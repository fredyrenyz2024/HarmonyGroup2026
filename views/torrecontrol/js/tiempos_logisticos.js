/**
 * ═══════════════════════════════════════════════════════════════════════
 *  tiempos_logisticos.js
 *
 *  Módulo JS para el offcanvas de detalle de pedido (Torre de Control).
 *  Gestiona la llamada a la API de tiempos, el renderizado de:
 *    • KPIs (Estado SLA, T. Disponible, ETA Cargue, ETA Descargue, Avance)
 *    • Paneles de horarios (ventana tránsito, remitente, destinatario)
 *    • Indicadores visuales de margen (a tiempo / en riesgo / atrasado)
 *    • Tabla de resumen de tiempos en planta (cargue y descargue)
 *
 *  USO:
 *    TiemposLogisticos.init(baseUrl);       ← una sola vez al arrancar
 *    TiemposLogisticos.cargar(pedidoId, duracionSegundos);
 *    TiemposLogisticos.cargarSoloHorarios(pedidoId); ← antes de tener Maps
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

const TiemposLogisticos = (function () {
    'use strict';

    /* ── Configuración interna ──────────────────────────────────────── */
    let _baseUrl = '';
    let _pedidoId = null;

    /* ── Selectores de elementos del DOM (offcanvas) ────────────────── */
    const SEL = {
        /* KPIs superiores */
        kpiSlaVal: '#kpi-sla-val',
        kpiSlaSub: '#kpi-sla-sub',
        kpiTdisVal: '#kpi-tdis-val',
        kpiCargueVal: '#kpi-cargue-val',
        kpiCargueSub: '#kpi-cargue-sub',
        kpiEntregaVal: '#kpi-entrega-val',
        kpiEntregaSub: '#kpi-entrega-sub',
        kpiPctVal: '#kpi-pct-val',
        kpiBarFill: '#kpi-bar-fill',

        /* Paneles de horarios */
        horariosLoading: '#oc-horarios-loading',
        horariosEmpty: '#oc-horarios-empty',
        horariosContent: '#oc-horarios-content',
        panelCliente: '#oc-panel-cliente-externo',
        panelRemitente: '#oc-panel-remitente',
        panelDest: '#oc-panel-destinatario',
        motivoAjusteWrap: '#oc-motivo-ajuste-wrap',
        motivoAjusteTxt: '#oc-motivo-ajuste-texto',

        /* Tablas de tiempos en panel expandible */
        tablaCargue: '#tabla-tiempos-CARGUE',
        tablaDescargue: '#tabla-tiempos-DESCARGUE',
    };

    /* ══════════════════════════════════════════════════════════════════
     *  API PÚBLICA
     * ══════════════════════════════════════════════════════════════════ */

    /**
     * Inicializa el módulo con la URL base de la API.
     * @param {string} baseUrl  Ej: 'https://api.empresa.com/torrecontrol'
     */
    function init(baseUrl) {
        _baseUrl = baseUrl.replace(/\/$/, '');
    }

    /**
     * Carga SOLO los horarios y nombres (antes de tener la ruta de Google Maps).
     * @param {number} pedidoId
     */
    async function cargarSoloHorarios(pedidoId) {
        _pedidoId = pedidoId;
        _mostrarLoading();
        const data = await _llamarApi(pedidoId, 0, true);
        if (data) _renderHorarios(data);
    }

    /**
     * Carga el cálculo completo de tiempos logísticos.
     * @param {number} pedidoId
     * @param {number} duracionSegundos  Duración bruta de Google Maps
     */
    async function cargar(pedidoId, duracionSegundos) {
        _pedidoId = pedidoId;
        const data = await _llamarApi(pedidoId, duracionSegundos, false);
        if (!data) return;

        _renderHorarios(data);
        _renderKpis(data);
        _renderTablasTiempos(data);
    }

    /* ══════════════════════════════════════════════════════════════════
     *  LLAMADA A LA API
     * ══════════════════════════════════════════════════════════════════ */

    async function _llamarApi(pedidoId, duracionSegundos, soloHorarios) {
        try {
            const body = new FormData();
            body.append('PedidoId', pedidoId);
            body.append('duracion_segundos', duracionSegundos);
            body.append('solo_horarios', soloHorarios ? '1' : '0');

            const resp = await fetch(
                `${_baseUrl}/Calcular_tiempos_logisticos`,
                { method: 'POST', body }
            );

            if (!resp.ok) {
                console.error('[TiemposLogisticos] HTTP error:', resp.status);
                _mostrarError('Error de conexión con el servidor.');
                return null;
            }

            const json = await resp.json();

            if (json.numero !== 200) {
                console.warn('[TiemposLogisticos] API error:', json.mensaje);
                _mostrarError(json.mensaje ?? 'Error al calcular tiempos.');
                return null;
            }

            return json.data;

        } catch (err) {
            console.error('[TiemposLogisticos] fetch error:', err);
            _mostrarError('No se pudo conectar con la API de tiempos.');
            return null;
        }
    }

    /* ══════════════════════════════════════════════════════════════════
     *  RENDER — KPIs superiores del offcanvas
     * ══════════════════════════════════════════════════════════════════ */

    function _renderKpis(d) {
        /* ── Color y textos según estado SLA ── */
        const colorMap = {
            'A TIEMPO': { hex: '#10b981', css: 'green', badge: 'bs-green' },
            'EN RIESGO': { hex: '#f59e0b', css: 'amber', badge: 'bs-amber' },
            'ATRASADO': { hex: '#ef4444', css: 'red', badge: 'bs-red' },
            'CALCULANDO': { hex: '#94a3b8', css: 'slate', badge: 'bs-slate' },
            'SIN DATOS': { hex: '#94a3b8', css: 'slate', badge: 'bs-slate' },
        };
        const col = colorMap[d.estado_sla] ?? colorMap['SIN DATOS'];

        /* ── KPI 1: Estado SLA ── */
        const slaVal = _qs(SEL.kpiSlaVal);
        const slaSub = _qs(SEL.kpiSlaSub);
        if (slaVal) {
            slaVal.textContent = d.estado_sla;
            slaVal.style.color = col.hex;
        }
        if (slaSub) {
            slaSub.innerHTML = d.diferencia_texto
                ? `<i class="${d.sla_icono}"></i> ${d.diferencia_texto} vs SLA`
                : 'Sin SLA registrado';
        }

        /* ── KPI 2: Tiempo disponible hasta SLA ── */
        const tdisVal = _qs(SEL.kpiTdisVal);
        if (tdisVal) {
            tdisVal.textContent = d.tiempo_disponible ?? '—';
            tdisVal.style.color = col.hex;
        }

        /* ── KPI 3: ETA Cargue (llegada a bodega origen) ── */
        const cargueVal = _qs(SEL.kpiCargueVal);
        const cargueSub = _qs(SEL.kpiCargueSub);
        if (cargueVal) {
            cargueVal.textContent = d.eta_cargue ?? '—';
        }
        if (cargueSub) {
            cargueSub.textContent = d.sla_cargue
                ? `SLA: ${d.sla_cargue}`
                : 'Sin SLA cargue';
        }

        /* ── KPI 4: ETA Descargue (llegada a bodega destino) ── */
        const entregaVal = _qs(SEL.kpiEntregaVal);
        const entregaSub = _qs(SEL.kpiEntregaSub);
        if (entregaVal) {
            entregaVal.textContent = d.eta_descargue ?? '—';
        }
        if (entregaSub) {
            entregaSub.textContent = d.sla_entrega
                ? `SLA: ${d.sla_entrega}`
                : 'Sin fecha compromiso';
        }

        /* ── KPI 5: Porcentaje completado ── */
        const pctVal = _qs(SEL.kpiPctVal);
        const barFill = _qs(SEL.kpiBarFill);
        if (pctVal) pctVal.textContent = `${d.porcentaje_avance}%`;
        if (barFill) barFill.style.width = `${d.porcentaje_avance}%`;

        /* ── Borde superior del KPI SLA según color ── */
        const kpiSlaCard = _qs('#kpi-card-cargue');
        if (kpiSlaCard) {
            kpiSlaCard.style.borderTopColor = col.hex;
        }

        /* ── Duración de tránsito en el mapa ── */
        const mapDuracion = _qs('#ocMapDuracion');
        if (mapDuracion) {
            mapDuracion.textContent = d.duracion_buffer_texto ?? '—';
        }
    }

    /* ══════════════════════════════════════════════════════════════════
     *  RENDER — Paneles de horarios operativos
     * ══════════════════════════════════════════════════════════════════ */

    function _renderHorarios(d) {
        _qs(SEL.horariosLoading)?.classList.add('d-none');
        _qs(SEL.horariosLoading, 'style.display', 'none');

        const hayDatos =
            d.ventana_cliente_inicio ||
            (d.horarios_remitente && d.horarios_remitente.length > 0) ||
            (d.horarios_destinatario && d.horarios_destinatario.length > 0);

        if (!hayDatos) {
            _show(SEL.horariosEmpty);
            _hide(SEL.horariosContent);
            return;
        }

        _hide(SEL.horariosLoading);
        _hide(SEL.horariosEmpty);
        _show(SEL.horariosContent);

        /* ── Panel: Ventana de tránsito (Cliente Externo) ── */
        const panelCE = _qs(SEL.panelCliente);
        if (panelCE) {
            panelCE.innerHTML = _htmlVentanaCliente(d);
        }

        /* ── Panel: Horarios Remitente (Bodega Origen) ── */
        const panelRem = _qs(SEL.panelRemitente);
        if (panelRem) {
            panelRem.innerHTML = _htmlHorarios(
                d.horarios_remitente,
                d.nombre_remitente ?? 'Remitente',
                '#0369a1'
            );
        }

        /* ── Panel: Horarios Destinatario (Bodega Destino) ── */
        const panelDes = _qs(SEL.panelDest);
        if (panelDes) {
            panelDes.innerHTML = _htmlHorarios(
                d.horarios_destinatario,
                d.nombre_destinatario ?? 'Destinatario',
                '#0891b2'
            );
        }

        /* ── Motivo de ajuste ── */
        const motivoWrap = _qs(SEL.motivoAjusteWrap);
        const motivoTxt = _qs(SEL.motivoAjusteTxt);
        if (d.motivos_ajuste_array && d.motivos_ajuste_array.length > 0) {
            if (motivoWrap) motivoWrap.style.display = '';
            if (motivoTxt) motivoTxt.textContent = d.motivo_ajuste;
        } else {
            if (motivoWrap) motivoWrap.style.display = 'none';
        }
    }

    /* ── HTML: Ventana de tránsito del cliente externo ── */
    function _htmlVentanaCliente(d) {
        if (!d.ventana_cliente_inicio && !d.ventana_cliente_fin) {
            return _htmlSinDatos('Sin ventana de tránsito registrada');
        }

        const inicio = d.ventana_cliente_inicio?.substring(0, 5) ?? '—';
        const fin = d.ventana_cliente_fin?.substring(0, 5) ?? '—';
        const nombre = d.nombre_cliente_externo ?? d.nombre_cliente_interno ?? 'Cliente';

        return `
            <div style="font-size:11px;font-weight:600;color:#0f172a;margin-bottom:.5rem;">
                ${_escHtml(nombre)}
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:.5rem;">
                <div style="${_styleHoraBadge('#1a3260')}">
                    <i class="bi bi-clock me-1" style="font-size:9px;"></i>${inicio}
                </div>
                <span style="color:#94a3b8;font-size:10px;">→</span>
                <div style="${_styleHoraBadge('#1a3260')}">
                    <i class="bi bi-clock-fill me-1" style="font-size:9px;"></i>${fin}
                </div>
            </div>
            <div style="font-size:10px;color:#475569;margin-top:.3rem;">
                <i class="bi bi-info-circle me-1" style="color:#94a3b8;"></i>
                Franja horaria permitida para circular en ruta
            </div>`;
    }

    /* ── HTML: Tabla de horarios de bodega (remitente o destinatario) ── */
    function _htmlHorarios(horarios, nombre, colorHeader) {
        if (!horarios || horarios.length === 0) {
            return _htmlSinDatos('Sin horarios registrados');
        }

        const filas = horarios.map(h => {
            const ini = (h.inicio ?? '').substring(0, 5);
            const fin = (h.fin ?? '').substring(0, 5);
            return `
                <div style="display:flex;align-items:center;justify-content:space-between;
                            padding:.35rem 0;border-bottom:1px solid #f1f5f9;">
                    <div style="${_styleHoraBadge(colorHeader)}">
                        <i class="bi bi-door-open me-1" style="font-size:9px;"></i>${ini}
                    </div>
                    <span style="font-size:10px;color:#94a3b8;">—</span>
                    <div style="${_styleHoraBadge(colorHeader)}">
                        <i class="bi bi-door-closed me-1" style="font-size:9px;"></i>${fin}
                    </div>
                    <span style="font-size:10px;color:#475569;">${_calcDuracion(ini, fin)}</span>
                </div>`;
        }).join('');

        return `
            <div style="font-size:11px;font-weight:600;color:#0f172a;margin-bottom:.5rem;">
                ${_escHtml(nombre)}
            </div>
            ${filas}`;
    }

    /* ── HTML: Sin datos disponibles ── */
    function _htmlSinDatos(mensaje) {
        return `
            <div style="display:flex;align-items:center;gap:6px;
                        font-size:11px;color:#94a3b8;padding:.35rem 0;">
                <i class="bi bi-dash-circle"></i>
                ${_escHtml(mensaje)}
            </div>`;
    }

    /* ══════════════════════════════════════════════════════════════════
     *  RENDER — Tablas de tiempos en paneles expandibles (Cargue/Descargue)
     * ══════════════════════════════════════════════════════════════════ */

    function _renderTablasTiempos(d) {
        _renderTablaTiempoUno(
            SEL.tablaCargue,
            'CARGUE',
            d.eta_cargue,
            d.sla_cargue,
            d.minutos_cargue_texto,
            d.diferencia_min,
            d
        );

        _renderTablaTiempoUno(
            SEL.tablaDescargue,
            'DESCARGUE',
            d.eta_descargue,
            d.sla_entrega,
            d.minutos_descargue_texto,
            d.diferencia_min,
            d
        );
    }

    function _renderTablaTiempoUno(selector, tipo, eta, sla, minTexto, diferenciaMin, d) {
        const contenedor = _qs(selector);
        if (!contenedor) return;

        const esCargue = tipo === 'CARGUE';

        /* ── Filas de la tabla ── */
        const filas = [
            {
                etiqueta: esCargue ? 'ETA llegada a cargue' : 'ETA llegada a descargue',
                valor: eta ?? '—',
                highlight: true,
            },
            {
                etiqueta: esCargue ? 'SLA ventana cargue' : 'SLA entrega comprometida',
                valor: sla ?? '—',
            },
            {
                etiqueta: esCargue ? 'Tiempo estándar cargue' : 'Tiempo estándar descargue',
                valor: minTexto ?? '—',
            },
            {
                etiqueta: 'Duración tránsito (con buffer 28%)',
                valor: d.duracion_buffer_texto ?? '—',
            },
        ];

        /* ── Margen final ── */
        let margenHtml = '';
        if (!esCargue && diferenciaMin !== null && diferenciaMin !== undefined) {
            const abs = Math.abs(diferenciaMin);
            const h = Math.floor(abs / 60);
            const m = abs % 60;
            const signo = diferenciaMin >= 0 ? '+' : '−';
            const texto = `${signo}${h > 0 ? h + 'h ' : ''}${m}min`;
            const color = diferenciaMin >= 0 ? '#16a34a' : '#dc2626';
            const bg = diferenciaMin >= 0 ? 'rgba(22,163,74,.08)' : 'rgba(220,38,38,.08)';
            const icono = diferenciaMin >= 0 ? 'bi-check-circle-fill' : 'bi-x-circle-fill';
            margenHtml = `
                <div style="margin-top:.6rem;padding:.5rem .7rem;border-radius:8px;
                            background:${bg};border:1px solid ${color}40;
                            display:flex;align-items:center;gap:8px;">
                    <i class="bi ${icono}" style="color:${color};font-size:13px;"></i>
                    <div>
                        <div style="font-size:9px;font-weight:700;letter-spacing:.8px;
                                    text-transform:uppercase;color:${color};">
                            ${diferenciaMin >= 0 ? 'A TIEMPO' : 'ATRASADO'}
                        </div>
                        <div style="font-family:'JetBrains Mono',monospace;font-size:13px;
                                    font-weight:700;color:${color};">
                            ${texto}
                        </div>
                        <div style="font-size:10px;color:#475569;">
                            ${diferenciaMin >= 0 ? 'de margen respecto al SLA' : 'de retraso sobre el SLA'}
                        </div>
                    </div>
                </div>`;
        }

        /* ── HTML de la tabla ── */
        const htmlFilas = filas.map(f => `
            <tr${f.highlight ? ' style="background:#f0f9ff;"' : ''}>
                <td style="padding:5px 8px;color:#64748b;font-size:10px;">
                    ${_escHtml(f.etiqueta)}
                </td>
                <td class="v" style="padding:5px 8px;text-align:right;
                                     font-family:'JetBrains Mono',monospace;
                                     font-size:11px;color:#0f172a;font-weight:600;">
                    ${_escHtml(String(f.valor))}
                </td>
            </tr>`).join('');

        contenedor.innerHTML = `
            <table class="oc-table" style="width:100%;">
                <thead>
                    <tr>
                        <th colspan="2" style="font-size:9px;font-weight:700;
                                               letter-spacing:1px;text-transform:uppercase;
                                               color:#94a3b8;background:#f1f5f9;
                                               padding:5px 8px;">
                            ${tipo} · Resumen de tiempos
                        </th>
                    </tr>
                </thead>
                <tbody>${htmlFilas}</tbody>
            </table>
            ${margenHtml}`;
    }

    /* ══════════════════════════════════════════════════════════════════
     *  ESTADOS DE UI
     * ══════════════════════════════════════════════════════════════════ */

    function _mostrarLoading() {
        _show(SEL.horariosLoading);
        _hide(SEL.horariosEmpty);
        _hide(SEL.horariosContent);
    }

    function _mostrarError(mensaje) {
        _hide(SEL.horariosLoading);
        _hide(SEL.horariosContent);
        const empty = _qs(SEL.horariosEmpty);
        if (empty) {
            empty.innerHTML = `<i class="bi bi-exclamation-triangle me-1" style="color:#f59e0b;"></i>
                               ${_escHtml(mensaje)}`;
            empty.style.display = '';
        }
    }

    /* ══════════════════════════════════════════════════════════════════
     *  UTILIDADES DOM
     * ══════════════════════════════════════════════════════════════════ */

    function _qs(selector) {
        return document.querySelector(selector);
    }

    function _show(selector) {
        const el = _qs(selector);
        if (el) el.style.display = '';
    }

    function _hide(selector) {
        const el = _qs(selector);
        if (el) el.style.display = 'none';
    }

    /* ══════════════════════════════════════════════════════════════════
     *  UTILIDADES GENERALES
     * ══════════════════════════════════════════════════════════════════ */

    /** Escapa HTML para evitar XSS */
    function _escHtml(str) {
        if (str === null || str === undefined) return '—';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /** Calcula duración entre dos horas 'HH:MM' y retorna texto legible */
    function _calcDuracion(ini, fin) {
        if (!ini || !fin) return '';
        const [hi, mi] = ini.split(':').map(Number);
        const [hf, mf] = fin.split(':').map(Number);
        const totalMin = (hf * 60 + mf) - (hi * 60 + mi);
        if (totalMin <= 0) return '';
        const h = Math.floor(totalMin / 60);
        const m = totalMin % 60;
        return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'min' : ''}`;
    }

    /** Estilo inline para las pastillas de hora */
    function _styleHoraBadge(color) {
        return `display:inline-flex;align-items:center;font-size:10px;font-weight:700;
                font-family:'JetBrains Mono',monospace;
                background:${color}18;color:${color};
                border:1px solid ${color}40;border-radius:6px;padding:2px 8px;`;
    }

    /* ── API pública ── */
    return { init, cargar, cargarSoloHorarios };

})();


/* ═══════════════════════════════════════════════════════════════════════
 *  INTEGRACIÓN CON EL OFFCANVAS EXISTENTE
 *
 *  En administrador_pedidos.js, dentro del handler del botón que abre
 *  el offcanvas de detalle (donde ya llamas cargarHorariosPedido,
 *  cargarGeoercasPedido, etc.) agregar:
 *
 *  ───────────────────────────────────────────────────────────────────
 *
 *  // 1) Inicializar (una sola vez, al cargar la página):
 *  TiemposLogisticos.init(document.getElementById('base_url_api').value);
 *
 *  // 2) Al abrir el offcanvas (antes de tener la duración de Maps):
 *  TiemposLogisticos.cargarSoloHorarios(pedidoId);
 *
 *  // 3) Cuando Google Maps responde con la duración de la ruta:
 *  //    (dentro del callback de la API de Directions / Distance Matrix)
 *  const duracionSeg = response.routes[0].legs[0].duration.value;
 *  TiemposLogisticos.cargar(pedidoId, duracionSeg);
 *
 *  ───────────────────────────────────────────────────────────────────
 *
 *  Si tu flujo de Maps está en SatrackGPS.js o similar, puedes emitir
 *  un evento personalizado:
 *
 *    // En SatrackGPS.js al obtener la duración:
 *    document.dispatchEvent(new CustomEvent('maps:duracion', {
 *        detail: { pedidoId, duracionSegundos }
 *    }));
 *
 *    // En administrador_pedidos.js:
 *    document.addEventListener('maps:duracion', (e) => {
 *        TiemposLogisticos.cargar(e.detail.pedidoId, e.detail.duracionSegundos);
 *    });
 *
 * ═══════════════════════════════════════════════════════════════════════
 */
