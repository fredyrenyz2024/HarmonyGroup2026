/**
 * SatrackGPS.js
 * Módulo de rastreo en tiempo real para el mapa de Torre de Control.
 *
 * Responsabilidades:
 *  1. Gestión del token con caché en sessionStorage (no vuelve a pedirlo si ya existe).
 *  2. Consulta de ubicación del vehículo a la API de Satrack.
 *  3. Actualización del marcador en el mapa de Google (ocMap / vehiculoMarker).
 *  4. Polling cada N segundos para simular tiempo real.
 *  5. Limpieza del intervalo al cerrar el offcanvas.
 *
 * USO (dentro de btn_detalle_trazabilidad_pedidos):
 *   SatrackGPS.iniciar(placa, ocMap, vehiculoMarker);
 *
 * Para detener:
 *   SatrackGPS.detener();
 */

window.SatrackGPS = (() => {
    'use strict';

    /* ══════════════════════════════════════════════════════════
     |  CONFIG  —  ajustar según ambiente
     ══════════════════════════════════════════════════════════*/
    const BASE_URL_API = () => document.getElementById('base_url_api')?.value ?? '';
    const ENDPOINT_TOKEN = 'satrack/token';
    const ENDPOINT_UBICACION = 'satrack/ubicacion-vehiculos';
    const INTERVALO_MS = 15_000;  // Actualizar cada 15 segundos
    const TOKEN_KEY = 'satrack_token';

    /* ══════════════════════════════════════════════════════════
     |  ESTADO INTERNO
     ══════════════════════════════════════════════════════════*/
    let _intervalId = null;
    let _mapa = null;
    let _marker = null;
    let _infoWindow = null;
    let _placa = null;
    let _directionsRenderer = null;
    let _primeraTick = true; // Para centrar el mapa solo la primera vez que llega posición real

    /* ══════════════════════════════════════════════════════════
     |  1. TOKEN — caché en sessionStorage
     ══════════════════════════════════════════════════════════*/

    /**
     * Retorna el token guardado en sessionStorage.
     * Null si no existe o expiró.
     */
    function _leerTokenCache() {
        try {
            const raw = sessionStorage.getItem(TOKEN_KEY);
            if (!raw) return null;
            const { token, expira } = JSON.parse(raw);
            if (Date.now() >= expira) {
                sessionStorage.removeItem(TOKEN_KEY);
                return null;
            }
            return token;
        } catch {
            return null;
        }
    }

    /**
     * Guarda el token en sessionStorage con TTL de 100 minutos.
     */
    function _guardarTokenCache(token) {
        const expira = Date.now() + 100 * 60 * 1000; // 100 min
        sessionStorage.setItem(TOKEN_KEY, JSON.stringify({ token, expira }));
    }

    /**
     * Solicita un token fresco al backend Laravel.
     * Solo se llama si el caché está vacío o expiró.
     */
    async function _solicitarToken() {
        const res = await fetch(BASE_URL_API() + ENDPOINT_TOKEN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-API-KEY': 'nexos_nacional2026@*' },
        });

        if (!res.ok) {
            throw new Error(`Error al obtener token Satrack: HTTP ${res.status}`);
        }

        const json = await res.json();

        if (!json.success || !json.token) {
            throw new Error('Respuesta inválida del servidor de token.');
        }

        _guardarTokenCache(json.token);
        return json.token;
    }

    /**
     * Obtiene el token: primero del caché, si no lo pide al servidor.
     */
    async function _obtenerToken() {
        return _leerTokenCache() ?? await _solicitarToken();
    }

    /* ══════════════════════════════════════════════════════════
     |  2. CONSULTA DE UBICACIÓN
     ══════════════════════════════════════════════════════════*/

    /**
     * Llama al endpoint de ubicación con la placa indicada.
     * Si el token expiró (401) lo renueva UNA vez y reintenta.
     * Si el vehículo no tiene monitoreo retorna { sinMonitoreo: true }.
     */
    async function _consultarUbicacion(placa, reintentar = true) {
        const token = await _obtenerToken();

        const res = await fetch(BASE_URL_API() + ENDPOINT_UBICACION, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-API-KEY': 'nexos_nacional2026@*'
            },
            body: JSON.stringify({ placas: [placa] }),
        });

        // Token expirado → limpiar caché, renovar y reintentar una sola vez
        if (res.status === 401 && reintentar) {
            sessionStorage.removeItem(TOKEN_KEY);
            return _consultarUbicacion(placa, false);
        }

        if (!res.ok) {
            throw new Error(`Error en ubicación Satrack: HTTP ${res.status}`);
        }

        const json = await res.json();

        // Vehículo sin monitoreo de flota activo
        if (json.sin_monitoreo === true) {
            return { sinMonitoreo: true };
        }

        if (!json.success || !json.vehiculos?.length) {
            return null;
        }

        return json.vehiculos[0];
    }

    /* ══════════════════════════════════════════════════════════
     |  3. ACTUALIZAR MARCADOR EN EL MAPA
     ══════════════════════════════════════════════════════════*/

    /**
     * Construye el elemento visual del marcador usando el color de Satrack.
     */
    function _crearElementoMarcador(vehiculo) {
        const color = vehiculo.color || '#ea580c';
        const icono = vehiculo.icono || 'truck-moving';
        const emoji = icono === 'truck-off' ? '🚛' : icono === 'truck-idle' ? '🚛' : '🚛';

        // Div con estilo inline para que funcione como PinElement personalizado
        const div = document.createElement('div');
        div.style.cssText = `
            background: ${color};
            border: 2px solid rgba(0,0,0,0.25);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
            cursor: pointer;
        `;

        const inner = document.createElement('span');
        inner.style.cssText = 'transform: rotate(45deg); font-size: 16px; line-height: 1;';
        inner.textContent = emoji;
        div.appendChild(inner);

        return div;
    }

    /**
     * Mueve el marcador del vehículo a la nueva posición
     * y actualiza el InfoWindow con los datos de Satrack.
     */
    function _actualizarMarcador(vehiculo) {
        if (!_mapa || !_marker) return;

        const posicion = { lat: vehiculo.lat, lng: vehiculo.lng };

        // Actualizar posición del marcador existente
        _marker.position = posicion;
        _marker.content = _crearElementoMarcador(vehiculo);

        // Actualizar MAPA_CONFIG global para que cargarGeocercasPedido
        // tenga siempre la posición real del vehículo
        if (window.MAPA_CONFIG) {
            window.MAPA_CONFIG.vehiculo = { ...posicion, label: vehiculo.placa };
        }

        // Primera vez que llega posición real: encuadrar mapa con origen + vehículo + destino
        if (_primeraTick) {
            _primeraTick = false;
            const cfg = window.MAPA_CONFIG;
            if (cfg?.origen?.lat && cfg?.destino?.lat) {
                const bounds = new google.maps.LatLngBounds();
                bounds.extend({ lat: cfg.origen.lat, lng: cfg.origen.lng });
                bounds.extend({ lat: cfg.destino.lat, lng: cfg.destino.lng });
                bounds.extend(posicion);
                _mapa.fitBounds(bounds);
            } else {
                _mapa.setCenter(posicion);
                _mapa.setZoom(12);
            }
        }

        // Construir contenido del InfoWindow
        const ignicion = vehiculo.ignicion === 1 ? '🟢 Encendido' : '🔴 Apagado';
        const velocidad = vehiculo.velocidad ?? 0;
        const estado = velocidad > 0 ? 'En movimiento' : 'Detenido';

        const html = `
            <div style="font-family: sans-serif; font-size: 12px; min-width: 200px; line-height: 1.6;">
                <div style="font-weight: 700; font-size: 14px; color: #0f172a; margin-bottom: 6px;">
                    🚛 ${vehiculo.placa}
                </div>
                <div style="color: #475569;">${vehiculo.direccion || ''}</div>
                <div style="color: #475569;">${vehiculo.ciudad || ''}</div>
                <hr style="margin: 6px 0; border-color: #e2e8f0;">
                <div>Ignición: <strong>${ignicion}</strong></div>
                <div>Estado: <strong>${estado}</strong></div>
                <div>Velocidad: <strong>${velocidad} km/h</strong></div>
                <div>Odómetro: <strong>${vehiculo.odometro ?? '-'} km</strong></div>
                <div style="color: #94a3b8; font-size: 10px; margin-top: 6px;">
                    Actualizado: ${vehiculo.fecha_evento ?? '–'}
                </div>
            </div>`;

        if (_infoWindow) {
            _infoWindow.setContent(html);
        }

        // Redibujar la ruta con la nueva posición del vehículo
        _recalcularRuta(posicion);
    }

    /* ══════════════════════════════════════════════════════════
     |  4. RECALCULAR RUTA ORIGEN → VEHÍCULO → DESTINO
     ══════════════════════════════════════════════════════════*/

    // function _recalcularRuta(posVehiculo) {
    //     console.log("🚀 ~ _recalcularRuta ~ posVehiculo:", posVehiculo)
    //     if (!_directionsRenderer || !window.MAPA_CONFIG) return;

    //     const { origen, destino } = window.MAPA_CONFIG;
    //     if (!origen?.lat || !destino?.lat) return;

    //     google.maps.importLibrary('routes').then(({ DirectionsService, TravelMode }) => {
    //         new DirectionsService().route({
    //             origin: { lat: origen.lat, lng: origen.lng },
    //             destination: { lat: destino.lat, lng: destino.lng },
    //             travelMode: TravelMode.DRIVING,
    //             waypoints: [{ location: posVehiculo, stopover: false }],
    //         }, (result, status) => {
    //             if (status === 'OK') {
    //                 _directionsRenderer.setDirections(result);
    //                 // Actualizar KPIs si la función existe
    //                 console.log("🚀 ~ _recalcularRuta ~ result.routes[0].legs:", result.routes[0])
    //                 if (typeof actualizarInfoRuta === 'function') {
    //                     actualizarInfoRuta(result.routes[0].legs);
    //                 }
    //             } else {
    //                 console.warn('SatrackGPS - Directions error:', status);
    //             }
    //         });
    //     });
    // }

    function _recalcularRuta(posVehiculo) {
        // console.log("🚀 ~ _recalcularRuta ~ posVehiculo:", posVehiculo)
        if (!_directionsRenderer || !window.MAPA_CONFIG) return;

        const { origen, destino } = window.MAPA_CONFIG;

        // El destino siempre es obligatorio
        if (!destino?.lat) return;

        // Validamos si posVehiculo tiene datos válidos para ser el nuevo origen
        let latOrigen, lngOrigen;
        if (posVehiculo && posVehiculo.lat && posVehiculo.lng) {
            console.log("entro aqui");
            
            latOrigen = posVehiculo.lat;
            lngOrigen = posVehiculo.lng;
        } else if (origen?.lat && origen?.lng) {
            // Respaldo: usamos el origen de la configuración si posVehiculo falla
            latOrigen = origen.lat;
            lngOrigen = origen.lng;
        } else {
            // Si no tenemos ni posición del vehículo ni origen base, detenemos la ejecución
            return;
        }

        google.maps.importLibrary('routes').then(({ DirectionsService, TravelMode }) => {
            new DirectionsService().route({
                origin: { lat: latOrigen, lng: lngOrigen }, // Asignamos el nuevo origen dinámico
                destination: { lat: destino.lat, lng: destino.lng },
                travelMode: TravelMode.DRIVING,
                // Se elimina 'waypoints' porque posVehiculo ahora es el origen directamente.
                // Si necesitas mantener otros waypoints intermedios reales, agrégalos aquí.
            }, (result, status) => {
                if (status === 'OK') {
                    _directionsRenderer.setDirections(result);
                    // Actualizar KPIs si la función existe
                    if (typeof actualizarInfoRuta === 'function') {
                        actualizarInfoRuta(result.routes[0].legs);
                    }
                } else {
                    console.warn('SatrackGPS - Directions error:', status);
                }
            });
        });
    }

    /* ══════════════════════════════════════════════════════════
     |  5. CICLO DE POLLING
     ══════════════════════════════════════════════════════════*/

    async function _tick() {
        if (!_placa) return;

        try {
            const vehiculo = await _consultarUbicacion(_placa);

            // Sin datos de ubicación disponibles
            if (vehiculo === null) {
                console.warn(`SatrackGPS: Sin datos para placa ${_placa}`);
                return;
            }

            // Vehículo sin monitoreo de flota — notificar primero, luego detener polling
            if (vehiculo.sinMonitoreo === true) {
                _mostrarSinMonitoreo(); // Primero: usa referencias aún vivas
                detener();              // Luego: limpia el intervalo
                return;
            }

            _actualizarMarcador(vehiculo);

        } catch (err) {
            console.error('SatrackGPS - Error en ciclo:', err.message);
        }
    }

    /**
     * Muestra un mensaje profesional cuando el vehículo no tiene monitoreo activo.
     * Tres canales simultáneos:
     *  1. Marcador gris en el mapa.
     *  2. InfoWindow abierto automáticamente sobre el marcador.
     *  3. Banner amarillo visible en el DOM encima del mapa.
     */
    function _mostrarSinMonitoreo() {
        const placaLocal = _placa;
        const markerLocal = _marker;
        const infoWinLocal = _infoWindow;
        const mapaLocal = _mapa;

        const htmlMensaje = `
            <div style="font-family:sans-serif;font-size:12px;min-width:220px;padding:4px 0;">
                <div style="font-weight:700;font-size:13px;color:#0f172a;margin-bottom:8px;">
                    🚛 ${placaLocal}
                </div>
                <div style="display:flex;align-items:flex-start;gap:8px;
                            background:#fef9c3;border:1px solid #fde047;
                            border-radius:6px;padding:8px 10px;">
                    <span style="font-size:18px;line-height:1.2;flex-shrink:0;">⚠️</span>
                    <div>
                        <div style="font-weight:600;color:#854d0e;margin-bottom:3px;">
                            Sin monitoreo de flota activo
                        </div>
                        <div style="color:#92400e;font-size:11px;line-height:1.5;">
                            Este vehículo no está registrado en la plataforma
                            de rastreo GPS. Contacte al área de logística para
                            activar el servicio.
                        </div>
                    </div>
                </div>
            </div>`;

        /* ── 1. Marcador gris ── */
        if (markerLocal) {
            const pin = document.createElement('div');
            pin.style.cssText = `
                background:#94a3b8;border:2px solid #64748b;
                border-radius:50% 50% 50% 0;transform:rotate(-45deg);
                width:36px;height:36px;display:flex;align-items:center;
                justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.25);`;
            const ic = document.createElement('span');
            ic.style.cssText = 'transform:rotate(45deg);font-size:16px;line-height:1;';
            ic.textContent = '🚛';
            pin.appendChild(ic);
            markerLocal.content = pin;
        }

        /* ── 2. InfoWindow abierto automáticamente ── */
        if (infoWinLocal && markerLocal && mapaLocal) {
            infoWinLocal.setContent(htmlMensaje);
            infoWinLocal.open({ anchor: markerLocal, map: mapaLocal });
        }

        /* ── 3. Banner visible en el DOM encima del mapa ── */
        const mapDiv = document.getElementById('ocMap');
        if (mapDiv) {
            // Eliminar banner anterior si existía
            document.getElementById('satrack-sin-monitoreo-banner')?.remove();

            const banner = document.createElement('div');
            banner.id = 'satrack-sin-monitoreo-banner';
            banner.style.cssText = `
                position:absolute;top:12px;left:50%;transform:translateX(-50%);
                z-index:9999;display:flex;align-items:center;gap:10px;
                background:#fef9c3;border:1.5px solid #fbbf24;
                border-radius:8px;padding:10px 16px;
                box-shadow:0 4px 12px rgba(0,0,0,.15);
                font-family:sans-serif;font-size:12px;max-width:340px;
                pointer-events:none;`;
            banner.innerHTML = `
                <span style="font-size:20px;flex-shrink:0;">⚠️</span>
                <div>
                    <div style="font-weight:700;color:#854d0e;margin-bottom:2px;">
                        Sin monitoreo de flota activo
                    </div>
                    <div style="color:#92400e;line-height:1.4;">
                        El vehículo <strong>${placaLocal}</strong> no está registrado
                        en la plataforma de rastreo GPS.
                    </div>
                </div>`;

            // El contenedor del mapa debe ser position:relative para que el absolute funcione
            const estiloContenedor = window.getComputedStyle(mapDiv).position;
            if (estiloContenedor === 'static') mapDiv.style.position = 'relative';

            mapDiv.appendChild(banner);
        }

        console.info(`SatrackGPS: ${placaLocal} sin monitoreo de flota. Rastreo detenido.`);
    }

    /* ══════════════════════════════════════════════════════════
     |  API PÚBLICA
     ══════════════════════════════════════════════════════════*/

    /**
     * Inicia el rastreo en tiempo real.
     *
     * @param {string} placa             - Placa del vehículo (ej: 'ABC123')
     * @param {google.maps.Map} mapa     - Instancia del mapa (ocMap)
     * @param {AdvancedMarkerElement} marker - Marcador del vehículo (vehiculoMarker)
     * @param {DirectionsRenderer} renderer - DirectionsRenderer activo
     * @param {google.maps.InfoWindow} infoWindow - InfoWindow del marcador
     */
    function iniciar(placa, mapa, marker, renderer, infoWindow) {
        if (!placa || !mapa || !marker) {
            console.error('SatrackGPS.iniciar: placa, mapa y marker son requeridos.');
            return;
        }

        // Detener ciclo anterior y limpiar estado completamente
        detener();
        _limpiarEstado();

        _placa = placa.toUpperCase().trim();
        _mapa = mapa;
        _marker = marker;
        _directionsRenderer = renderer ?? null;
        _infoWindow = infoWindow ?? null;

        console.info(`SatrackGPS: Iniciando rastreo para ${_placa} (cada ${INTERVALO_MS / 1000}s)`);

        // Primera llamada inmediata
        _tick();

        // Polling continuo
        _intervalId = setInterval(_tick, INTERVALO_MS);
    }

    /**
     * Detiene el polling. Las referencias al mapa/marcador se conservan
     * para que _mostrarSinMonitoreo() pueda usarlas después de llamar a detener().
     * Se limpian completamente solo al iniciar un nuevo rastreo.
     */
    function detener() {
        if (_intervalId !== null) {
            clearInterval(_intervalId);
            _intervalId = null;
            console.info('SatrackGPS: Rastreo detenido.');
        }
        // Eliminar el banner del DOM si existe
        document.getElementById('satrack-sin-monitoreo-banner')?.remove();
    }

    /**
     * Limpia todas las referencias internas.
     * Se llama al inicio de cada nuevo rastreo para no heredar estado anterior.
     */
    function _limpiarEstado() {
        _mapa = null;
        _marker = null;
        _infoWindow = null;
        _directionsRenderer = null;
        _placa = null;
        _primeraTick = true;
    }

    /**
     * Limpia el token del caché (útil para forzar renovación).
     */
    function limpiarToken() {
        sessionStorage.removeItem(TOKEN_KEY);
    }

    return { iniciar, detener, limpiarToken };

})();