(function () {
    'use strict';

    /* =========================================================
     | ESTADO DEL MÓDULO
     | Todas las variables que antes eran const/let en scope
     | global ahora viven aquí, seguras ante recargas.
     | =========================================================*/
    let _STATE = {
        timerInterval: null,
        progreso: 0,
        baseUrlApi: '',
    };

    /* =========================================================
     | CONSTANTES DEL MÓDULO
     | Antes: const IM_STEPS = [...] → SyntaxError al recargar.
     | Ahora viven dentro del IIFE: sin problema.
     | =========================================================*/
    const IM_STEPS = [
        { id: 'step-convirtiendo', pct: 15, msg: 'Convirtiendo fórmulas Excel a valores...' },
        { id: 'step-archivo', pct: 35, msg: 'Procesando hoja "archivo" — rutas y tarifas...' },
        { id: 'step-multiorigen', pct: 55, msg: 'Procesando hoja "multiorigen"...' },
        { id: 'step-multidestino', pct: 72, msg: 'Procesando hoja "multidestino"...' },
        { id: 'step-variaciones', pct: 88, msg: 'Evaluando variaciones y reglas de aprobación...' },
        { id: 'step-finalizando', pct: 97, msg: 'Guardando y actualizando lista de tarifas...' },
    ];

    /* =========================================================
     | HELPER: FETCH CENTRALIZADO
     | Evita repetir headers en cada petición.
     | =========================================================*/
    async function _apiFetch(url, { method = 'GET', data = null } = {}) {
        const opts = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-KEY': 'nexos_nacional2026@*',
            },
        };
        if (data && method !== 'GET') opts.body = JSON.stringify(data);

        const resp = await fetch(url, opts);

        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            const error = new Error(err.message || `Error HTTP ${resp.status}`);
            error.status = resp.status;
            error.payload = err;
            throw error;
        }
        return resp.json();
    }

    /* =========================================================
     | PUNTO DE ENTRADA — WindowManager
     | =========================================================*/
    window.initScript = function (id) {
        window.VENTANA = id;

        // Leer la base URL de la API desde el DOM (nunca hardcodeada)
        _STATE.baseUrlApi = document.getElementById('base_url_api')?.value ?? '';

        listar_Fletes_Costos();
        _initFormulario(id);
        _initOffcanvas();
        _initDragDrop();
        _initEventosFijos();
    };

    /* =========================================================
     | INICIALIZACIÓN DEL FORMULARIO
     | =========================================================*/
    function _initFormulario(id) {
        const anioInput = document.getElementById('vigencia');
        const semanaInput = document.getElementById('semana');
        const mesSelect = document.getElementById('mes_flete');

        if (!anioInput || !semanaInput || !mesSelect) return;

        const ahora = new Date();
        anioInput.value = ahora.getFullYear();
        semanaInput.value = _getISOWeek(ahora);
        mesSelect.value = ahora.getMonth() + 1;

        semanaInput.addEventListener('change', _actualizarMes);
        anioInput.addEventListener('change', _actualizarMes);

        const switchConfig = document.getElementById('switch-config-extra-costo');
        const tabsContainer = document.querySelector('.custom-tabs-container');
        if (tabsContainer) tabsContainer.style.display = 'none';

        if (switchConfig) {
            switchConfig.addEventListener('change', function () {
                if (tabsContainer) {
                    tabsContainer.style.display = this.checked ? 'block' : 'none';
                }
            });
        }

        // Delegación de eventos para validación de duplicados (municipios + vehículo)
        const campos = ['slct_municipios', 'slct_municipios2', 'slct_tipo_vehiculo_costo'];
        campos.forEach(nombre => {
            const el = document.getElementById(nombre) || document.querySelector(`[name="${nombre}"]`);
            if (el) el.addEventListener('change', _verificarDuplicadoFlete);
        });

        // Delegación principal del contenedor
        const container = document.getElementById(`contenido_ventana-${id}`);
        if (container) {
            container.onclick = _manejadorClickContenedor;
        }

        // Input para limpiar errores de validación
        document.addEventListener('input', function (e) {
            if (e.target.classList.contains('is-invalid')) {
                limpiarError(e.target);
            }
        });
    }

    /* =========================================================
     | VERIFICAR FLETE DUPLICADO
     | =========================================================*/
    function _verificarDuplicadoFlete() {
        const origen = document.getElementById('slct_municipios')?.value
            || document.querySelector('[name="slct_municipios"]')?.value;
        const destino = document.getElementById('slct_municipios2')?.value
            || document.querySelector('[name="slct_municipios2"]')?.value;
        const vehiculo = document.getElementById('slct_tipo_vehiculo_costo')?.value;

        if (!origen || !destino || !vehiculo) return;

        if (typeof verificaFlete === 'function' && verificaFlete(origen, destino, vehiculo)) {
            document.getElementById('valor')?.setAttribute('disabled', true);
            document.getElementById('vigencia')?.setAttribute('disabled', true);
            document.getElementById('nexos_messages_popup').innerHTML =
                '<div class="alert alert-danger">El flete que intenta crear ya existe. Búsquelo en la lista para editarlo.</div>';
        } else {
            document.getElementById('valor')?.removeAttribute('disabled');
            // document.getElementById('vigencia')?.removeAttribute('disabled');
            // document.getElementById('nexos_messages_popup').innerHTML = '';
        }
    }

    /* =========================================================
     | MANEJADOR ÚNICO DE CLICKS — delegación de eventos
     | Reemplaza múltiples onclick inline del HTML dinámico
     | =========================================================*/
    async function _manejadorClickContenedor(e) {

        // ── GUARDAR TARIFA COSTO ──────────────────────────────
        if (e.target.closest('#btn_guardar_tarifa_costo')) {
            await _guardarTarifaCosto(e.target.closest('#btn_guardar_tarifa_costo'));
            return;
        }

        if (e.target.closest('#btn_inactivar_tarifa_costos')) {
            await _inactivarTarifaCosto(e.target.closest('#btn_inactivar_tarifa_costos'));
            return;
        }

        if (e.target.closest('#btn_activar_tarifa_costo')) {
            await _activarTarifaCosto(e.target.closest('#btn_activar_tarifa_costo'));
            return;
        }

        // ── EDITAR TARIFA COSTO ───────────────────────────────
        if (e.target.closest('.btn_editar_flete_costo')) {
            const btn = e.target.closest('.btn_editar_flete_costo');
            await _editarTarifaCosto(btn.getAttribute('data-id'));
            return;
        }

        // ── AGREGAR MULTI ORIGEN ──────────────────────────────
        if (e.target.closest('#btn-add-multiorigen-costo')) {
            await _agregarMultiOrigen();
            return;
        }

        // ── ELIMINAR MULTI ORIGEN ─────────────────────────────
        if (e.target.closest('.btn-remove-extra-costo')) {
            e.target.closest('.extra-origin-item-costo')?.remove();
            return;
        }

        // ── AGREGAR MULTI DESTINO ─────────────────────────────
        if (e.target.closest('#btn-add-multidestino-costo')) {
            await _agregarMultiDestino();
            return;
        }

        // ── ELIMINAR MULTI DESTINO ────────────────────────────
        if (e.target.closest('.btn-remove-destination-costo')) {
            e.target.closest('.extra-destination-item-costo')?.remove();
            return;
        }
    }

    /* =========================================================
     | GUARDAR / ACTUALIZAR TARIFA COSTO
     | =========================================================*/
    async function _guardarTarifaCosto(btn) {
        const tarifaId = btn.getAttribute('data-tarifa_id');
        const isUpdate = !!tarifaId && tarifaId !== '';

        const errores = [];
        const origen = document.getElementById('slct_municipios')?.value;
        const destino = document.getElementById('slct_municipios2')?.value;
        const vehiculo = document.getElementById('slct_tipo_vehiculo_costo')?.value;
        const valor = document.getElementById('valor')?.value;

        if (!origen) errores.push('Debe seleccionar Origen.');
        if (!destino) errores.push('Debe seleccionar Destino.');
        if (!vehiculo) errores.push('Debe seleccionar Tipo Vehículo.');
        if (!valor) errores.push('Debe ingresar Tarifa Costo.');

        if (errores.length > 0) {
            mostrarErrores(errores);
            return;
        }

        const payload = {
            empresa_id: document.getElementById('empresa_id')?.value || 1,
            usuario: document.getElementById('ssn_nombre')?.value || 'sistema',
            origen,
            destino,
            tipo_vehiculo: vehiculo,
            plena: limpiarMoneda(valor),
            multi_recogida: limpiarMoneda(document.getElementById('multi_recogida_costo')?.value ?? 0),
            multi_entrega: limpiarMoneda(document.getElementById('multi_entrega_costo')?.value ?? 0),
            multi_origen_items: obtenerMultiOrigen(),
            multi_destino_items: obtenerMultiDestino(),
        };

        const url = isUpdate
            ? `${_STATE.baseUrlApi}tarifas-costos/${tarifaId}`
            : `${_STATE.baseUrlApi}tarifas-costos`;
        const method = isUpdate ? 'PUT' : 'POST';

        try {
            const result = await _apiFetch(url, { method, data: payload });

            if (!result.success) {
                mostrarErrores([result.message || 'Error inesperado']);
                return;
            }

            /* =========================================================
            | MENSAJE DINÁMICO SEGÚN RESPUESTA DEL UPDATE
            ========================================================= */

            let htmlExtra = '';

            /* Advertencias del backend */
            if (result.advertencias && result.advertencias.length > 0) {
                htmlExtra += `
                    <div class="text-start mt-3">
                        <b>Advertencias:</b>
                        <ul class="mb-0">
                            ${result.advertencias.map(a => `<li>${a}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            /* Componentes que superaron umbral */
            if (result.componentes_pendientes && result.componentes_pendientes.length > 0) {
                htmlExtra += `
                    <div class="text-start mt-3">
                        <b>Componentes que superaron variación:</b>
                        <ul class="mb-0">
                            ${result.componentes_pendientes.map(c => `
                                <li>
                                    ${c.nombre || 'Componente'} 
                                    (${c.variacion_pct ?? 0}%)
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            }

            await Swal.fire({
                icon: result.requiere_aprobacion ? 'warning' : 'success',
                title: result.requiere_aprobacion
                    ? 'Tarifa pendiente de aprobación'
                    : isUpdate
                        ? 'Tarifa actualizada correctamente'
                        : 'Tarifa creada correctamente',
                html: `
        <p>${result.message || 'Operación realizada correctamente.'}</p>
        ${htmlExtra}
    `,
                confirmButtonText: 'Aceptar',
            });

            // Recargar la ventana dinámicamente (sin F5)
            const anchor = document.querySelector(`#myTab a[data-id="${window.VENTANA}"]`);
            if (anchor) {
                WindowManager.cargarContenidoVentana(anchor);
            } else {
                window.location.reload();
            }

        } catch (err) {
            if (err.status === 422) {
                const errors = err.payload?.errors || {};
                const primera = Object.values(errors)?.[0]?.[0] || err.message;
                Swal.fire({ icon: 'warning', title: 'Validación', text: primera });
                return;
            }
            mostrarErrores(['Error de conexión con la API: ' + (err.message || '')]);
        }
    }

    /* =========================================================
     | EDITAR TARIFA COSTO
     | =========================================================*/
    async function _editarTarifaCosto(tarifaId) {
        try {
            const result = await _apiFetch(`${_STATE.baseUrlApi}tarifas-costos/${tarifaId}`);

            if (!result.success || !result.data) {
                Swal.fire('Error', 'No se pudo cargar la tarifa', 'error');
                return;
            }

            const data = result.data;

            resetFormularioCosto();

            setTomSelectValue('slct_municipios', data.origen);
            setTomSelectValue('slct_municipios2', data.destino);
            setTomSelectValue('slct_tipo_vehiculo_costo', data.tipo_vehiculo);

            document.getElementById('valor').value = formatCOP(data.tarifa);
            document.getElementById('vigencia').value = data.vigencia;
            document.getElementById('mes_flete').value = data.mes;
            document.getElementById('semana').value = data.semana;
            document.getElementById('estado').value = data.estado === 'Activa' ? 'Activa' : 'Inactiva';

            const switchConfig = document.getElementById('switch-config-extra-costo');
            const tabsContainer = document.querySelector('.custom-tabs-container');
            let tieneExtras = false;

            (data.componentes || []).forEach(componente => {
                switch (componente.tipo) {
                    case 'PLENA': break;
                    case 'MULTI_RECOGIDA':
                        document.getElementById('multi_recogida_costo').value = formatCOP(componente.valor);
                        tieneExtras = true;
                        break;
                    case 'MULTI_ENTREGA':
                        document.getElementById('multi_entrega_costo').value = formatCOP(componente.valor);
                        tieneExtras = true;
                        break;
                    case 'MULTI_ORIGEN':
                        renderMultiOrigenCosto(componente.detalles);
                        tieneExtras = true;
                        break;
                    case 'MULTI_DESTINO':
                        renderMultiDestinoCosto(componente.detalles);
                        tieneExtras = true;
                        break;
                }
            });

            await MunicipiosTarifasExtras();

            // Setear valores en TomSelects de extras DESPUÉS de cargar municipios
            document.querySelectorAll('.js-extra-origin-costo').forEach(sel => {
                const val = sel.dataset.selected;
                if (sel.tomselect && val) sel.tomselect.setValue(String(val));
            });
            document.querySelectorAll('.js-extra-destination-costo').forEach(sel => {
                const val = sel.dataset.selected;
                if (sel.tomselect && val) sel.tomselect.setValue(String(val));
            });

            if (switchConfig) switchConfig.checked = tieneExtras;
            if (tabsContainer) tabsContainer.style.display = tieneExtras ? '' : 'none';

            document.getElementById('btn_guardar_tarifa_costo').setAttribute('data-tarifa_id', tarifaId);
            const empresaId = document.getElementById("empresa_id")?.value || "";

            const responseHist = await _apiFetch(`${_STATE.baseUrlApi}tarifas-costo/historico?origen=${result.data.origen}&destino=${result.data.destino}&tipo_vehiculo=${result.data.tipo_vehiculo}&empresa_id=${empresaId}`)

            const resultHist = await responseHist.data;
            renderHistoricoTarifas(resultHist);

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
        }
    }

    /* =========================================================
    | INACTIVAR TARIFA COSTO
    | =========================================================*/
    async function _inactivarTarifaCosto(btn) {
        const TarifaId = btn.getAttribute('data-tarifa_id');

        Swal.fire({
            title: "¿Inactivar tarifa?",
            text: "Esta acción inactivará la tarifa seleccionada.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, inactivar",
            cancelButtonText: "Cancelar",
            reverseButtons: true, // Pone "Cancelar" a la izquierda
            focusCancel: true, // Enfocar cancelar por seguridad
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            // Opcional: deshabilitar el botón para evitar doble clic
            btn.disabled = true;

            try {
                const response = await fetch(
                    $("#base_url_api").val() + `tarifas-costos/inactivar-tarifa-costo/${TarifaId}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", "X-API-KEY": "nexos_nacional2026@*", },
                        body: JSON.stringify({ TarifaId }),
                    },
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const result = await response.json();

                if (result) {
                    await Swal.fire({
                        icon: "success",
                        title: "Éxito",
                        text: "Tarifa inactivada correctamente",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    // 📋 Refrescar listado
                    listar_Fletes_Costos();
                } else {
                    // Maneja caso de respuesta válida pero sin éxito lógico
                    Swal.fire({
                        icon: "info",
                        title: "No se pudo inactivar",
                        text: "El servidor no confirmó la inactivación.",
                    });
                }
            } catch (error) {
                console.error("Error en la petición:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error de conexión",
                    text: "No se pudo conectar con el servidor",
                });
            } finally {
                btn.disabled = false;
            }
        });
    }

    /* =========================================================
    | ACTIVAR TARIFA COSTO
    | =========================================================*/
    async function _activarTarifaCosto(btn) {
        const TarifaId = btn.getAttribute('data-tarifa_id');

        Swal.fire({
            title: "¿Activar tarifa?",
            text: "Esta acción activara la tarifa seleccionada.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, activar",
            cancelButtonText: "Cancelar",
            reverseButtons: true, // Pone "Cancelar" a la izquierda
            focusCancel: true, // Enfocar cancelar por seguridad
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            // Opcional: deshabilitar el botón para evitar doble clic
            btn.disabled = true;

            try {
                const response = await fetch(
                    $("#base_url_api").val() + `tarifas-costos/activar-tarifa-costo/${TarifaId}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", "X-API-KEY": "nexos_nacional2026@*" },
                        body: JSON.stringify({ TarifaId }),
                    },
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const result = await response.json();

                if (result) {
                    await Swal.fire({
                        icon: "success",
                        title: "Éxito",
                        text: "Tarifa activada correctamente",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    // 📋 Refrescar listado
                    listar_Fletes_Costos();
                } else {
                    // Maneja caso de respuesta válida pero sin éxito lógico
                    Swal.fire({
                        icon: "info",
                        title: "No se pudo activar",
                        text: "El servidor no confirmó la activación.",
                    });
                }
            } catch (error) {
                console.error("Error en la petición:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error de conexión",
                    text: "No se pudo conectar con el servidor",
                });
            } finally {
                btn.disabled = false;
            }
        });
    }

    /* =========================================================
     | AGREGAR BLOQUES MULTI ORIGEN / DESTINO
     | =========================================================*/
    async function _agregarMultiOrigen() {
        const container = document.getElementById('multiorigen-costo-container');
        const nuevo = document.createElement('div');
        nuevo.classList.add('row', 'g-3', 'extra-origin-item-costo', 'mb-2');
        nuevo.innerHTML = `
            <div class="col-md-6">
                <label class="form-label-sm">Origen Adicional <span class="req">*</span></label>
                <div class="input-group input-group-sm">
                    <select class="js-extra-origin-costo municipio_id w-100" name="extra_origin_costo_id[]"></select>
                </div>
            </div>
            <div class="col-md-3">
                <label class="form-label-sm">Tarifa Adicional 1</label>
                <div class="input-group input-group-sm">
                    <span class="input-group-text">$</span>
                    <input type="text" class="form-control js-extra-rate-costo-1 rate_1" name="extra_rate_costo_1[]" placeholder="0.00" onchange="currencyMask2(this)">
                </div>
            </div>
            <div class="col-md-3 d-flex align-items-end">
                <div class="w-100">
                    <label class="form-label-sm">Tarifa Adicional 2</label>
                    <div class="input-group input-group-sm">
                        <span class="input-group-text">$</span>
                        <input type="text" class="form-control js-extra-rate-costo-2 rate_2" name="extra_rate_costo_2[]" placeholder="0.00" onchange="currencyMask2(this)">
                        <button class="btn btn-outline-danger btn-sm btn-remove-extra-costo" type="button">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>`;
        container.appendChild(nuevo);
        await inicializarTomSelectIndividual(nuevo.querySelector('.js-extra-origin-costo'));
    }

    async function _agregarMultiDestino() {
        const container = document.getElementById('multidestino-costo-container');
        const nuevo = document.createElement('div');
        nuevo.classList.add('row', 'g-3', 'extra-destination-item-costo', 'mb-2');
        nuevo.innerHTML = `
            <div class="col-md-6">
                <label class="form-label-sm">Destino Adicional <span class="req">*</span></label>
                <div class="input-group input-group-sm">
                    <select class="js-extra-destination-costo municipio_id w-100" name="extra_destination_costo_id[]"></select>
                </div>
            </div>
            <div class="col-md-3">
                <label class="form-label-sm">Tarifa Adicional 1</label>
                <div class="input-group input-group-sm">
                    <span class="input-group-text">$</span>
                    <input type="text" class="form-control js-extra-destination-costo-rate-1 rate_1" name="extra_destination_costo_rate_1[]" placeholder="0.00" onchange="currencyMask2(this)">
                </div>
            </div>
            <div class="col-md-3 d-flex align-items-end">
                <div class="w-100">
                    <label class="form-label-sm">Tarifa Adicional 2</label>
                    <div class="input-group input-group-sm">
                        <span class="input-group-text">$</span>
                        <input type="text" class="form-control js-extra-destination-costo-rate-2 rate_2" name="extra_destination_costo_rate_2[]" placeholder="0.00" onchange="currencyMask2(this)">
                        <button class="btn btn-outline-danger btn-sm btn-remove-destination-costo" type="button">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>`;
        container.appendChild(nuevo);
        await inicializarTomSelectIndividual(nuevo.querySelector('.js-extra-destination-costo'));
    }

    /* =========================================================
     | INICIALIZACIÓN OFFCANVAS
     | =========================================================*/
    function _initOffcanvas() {
        const offcanvasEl = document.getElementById('offcanvaTarifasCostos');
        if (!offcanvasEl || offcanvasEl.dataset.listenerOk) return;

        offcanvasEl.addEventListener('hidden.bs.offcanvas', function () {
            // document.getElementById('miSelect').value = '';
            // document.getElementById('miSelect').style.display = '';
            // document.getElementById('crear_flete').style.display = 'none';
            document.getElementById('cargue_masivo').style.display = 'none';
            document.getElementById('vigencia').value = '';
            document.getElementById('mes_flete').value = '';
            document.getElementById('slct_tipo_vehiculo_costo').value = '';
            document.getElementById('valor').value = '';
            $('#slct_municipios').val(null).trigger('change');
            $('#slct_municipios2').val(null).trigger('change');
            document.getElementById('tarifa_costo_id').value = '';
            document.getElementById('historico_tarifas').innerHTML = '';
            document.getElementById('nexos_messages_popup').innerHTML = '';
        });

        // Flag para no duplicar el listener si la ventana se recarga
        offcanvasEl.dataset.listenerOk = 'true';
    }

    /* =========================================================
     | EVENTOS FIJOS (botones con ID estático en el HTML)
     | =========================================================*/
    function _initEventosFijos() {

        // Filtrar tabla de costos
        document.getElementById('btn_filtrar_tarifas_costos')
            ?.addEventListener('click', listar_Fletes_Costos);

        // Exportar Excel
        // document.getElementById('exportar_excel_tarifa_costo')
        //     ?.addEventListener('click', _exportarExcel);

        // Botón editar flete (jQuery legacy — se mantiene para no romper flujo viejo)
        // FIX: antes estaba en scope global fuera de initScript y fallaba en carga dinámica
        $('#btn_edita_flete').off('click').on('click', _editarFleteAjaxLegacy);
    }

    /* =========================================================
     | EXPORTAR EXCEL
     | =========================================================*/
    async function _exportarExcel() {
        const baseUrl = $("#base_url_api").val();
        const empresaId = document.getElementById("empresa_id")?.value || "";

        const filtros = {
            empresa_id: empresaId,
            limit: 9999,
        };
        // const filtros = {
        //     empresa_id: empresaId,
        //     fecha_desde: document.getElementById('f_fecha_desde_costo')?.value || '',
        //     fecha_hasta: document.getElementById('f_fecha_hasta_costo')?.value || '',
        //     search: document.getElementById('f_search_costo')?.value || '',
        //     tipo_vehiculo: document.getElementById('f_tipo_vehiculo_costo')?.value || '',
        //     estado: document.getElementById('f_estado_costo')?.value || '',
        //     origen: document.getElementById('f_origen_costo')?.value || '',
        //     destino: document.getElementById('f_destino_costo')?.value || '',
        //     semana_desde: document.getElementById('f_semana_desde_costo')?.value || '',
        //     semana_hasta: document.getElementById('f_semana_hasta_costo')?.value || '',
        //     mes_desde: document.getElementById('f_mes_desde_costo')?.value || '',
        //     mes_hasta: document.getElementById('f_mes_hasta_costo')?.value || '',
        //     pendientes: document.getElementById('f_pendientes_costo')?.checked ? '1' : '',
        //     limit: 9999,
        // };

        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([k, v]) => {
            if (v !== "" && v !== null && v !== undefined) params.append(k, v);
        });

        // const btnEl = document.getElementById("exportar_excel_tarifa_costo");
        // const textoOriginal = btnEl.innerHTML;
        // btnEl.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Generando Excel...`;
        // btnEl.style.pointerEvents = "none";

        // try {
        //     const response = await fetch(`${baseUrl}tarifas-costos?${params.toString()}`, {
        //         method: "GET",
        //         headers: {
        //             Accept: "application/json",
        //             "Content-Type": "application/json",
        //             "X-API-KEY": "nexos_nacional2026@*",
        //         },
        //     });

        //     if (!response.ok) throw new Error(`Error HTTP ${response.status}`);

        //     const result = await response.json();
        //     const tarifas = result.data || [];
        //     console.log("🚀 ~ _exportarExcel ~ tarifas:", tarifas)

        //     if (!tarifas.length) {
        //         Swal.fire("Sin datos", "No hay tarifas para exportar con los filtros actuales.", "warning");
        //         return;
        //     }

        //     const wb = XLSX.utils.book_new();

        //     /* ── Hoja 1: RESUMEN ─────────────────────────────────────── */
        //     const resumenHeaders = [
        //         "#", "Código", "Origen", "Destino", "Tipo Vehículo",
        //         "Vigencia", "Mes", "Semana", "Flete (COP)", "Flete SiceTac (COP)",
        //         "Estado Vigencia", "Estado", "Estado Aprobación",
        //         "Fecha Registro", "Usuario", "Empresa", "Causales", "Observación",
        //     ];

        //     const resumenRows = [resumenHeaders];

        //     tarifas.forEach((t, idx) => {
        //         const origen = t.municipio_origen
        //             ? `${t.municipio_origen.municipio} - ${t.municipio_origen.depto}`
        //             : (t.origen ?? "");
        //         const destino = t.municipio_destino
        //             ? `${t.municipio_destino.municipio} - ${t.municipio_destino.depto}`
        //             : (t.destino ?? "");

        //         // Componente PLENA como flete principal
        //         const compPlena = (t.componentes || []).find(c => c.tipo === "PLENA");

        //         // Causa y observación del componente (primer componente con causa)
        //         const compConCausa = (t.componentes || []).find(c => c.causa);
        //         const causal = compConCausa?.causa?.nombre ?? compConCausa?.causa_id ?? "";
        //         const observacion = compConCausa?.observacion ?? "";

        //         // Estado aprobación legible
        //         const estadoAprob = (() => {
        //             const estados = (t.componentes || []).map(c => c.requiere_aprobacion);
        //             if (estados.includes(1)) return "Pendiente";
        //             if (estados.includes(2)) return "Rechazado";
        //             return "Aprobado";
        //         })();

        //         console.log("🚀 ~ _exportarExcel ~ t.estado_vigencia:", t.estado_vigencia)
        //         resumenRows.push([
        //             idx + 1,
        //             t.id,
        //             origen,
        //             destino,
        //             obtenerTipoVehiculo(t.tipo_vehiculo) ?? t.tipo_vehiculo ?? "",
        //             t.vigencia?.estado ?? t.vigencia ?? "",
        //             t.mes ?? "",
        //             t.semana ?? "",
        //             numerico(compPlena?.valor ?? t.tarifa),
        //             numerico(t.flete_sicetac ?? t.flete_sice_tac ?? ""),
        //             t.estado_vigencia ?? "",
        //             t.estado ?? "",
        //             estadoAprob,
        //             fmtFecha(t.fecha ?? t.created_at),
        //             t.usuario ?? "",
        //             // t.empresa?.nombre ?? t.empresa_id ?? "",
        //             // tarifas.empresa_tarifa.nombre_empresa ?? "",
        //             t.empresa_tarifa?.nombre_empresa ?? "",
        //             causal,
        //             observacion,
        //         ]);
        //     });

        //     const wsResumen = XLSX.utils.aoa_to_sheet(resumenRows);
        //     estilarHoja(wsResumen, resumenHeaders.length);
        //     XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

        //     /* ── Hoja 2: DETALLE COMPONENTES ─────────────────────────── */
        //     const detalleHeaders = [
        //         "Código", "Origen", "Destino", "Tipo Vehículo",
        //         "Tipo Componente", "Valor Componente (COP)",
        //         "Requiere Aprobación", "% Variación",
        //         "Causal", "Observación",
        //         "Municipio Detalle", "1ra Tarifa (COP)", "2da Tarifa (COP)", "Total Municipio (COP)",
        //     ];

        //     const detalleRows = [detalleHeaders];

        //     tarifas.forEach((t) => {
        //         const origen = t.municipio_origen
        //             ? `${t.municipio_origen.municipio} - ${t.municipio_origen.depto}`
        //             : (t.origen ?? "");
        //         const destino = t.municipio_destino
        //             ? `${t.municipio_destino.municipio} - ${t.municipio_destino.depto}`
        //             : (t.destino ?? "");

        //         const comps = t.componentes || [];

        //         if (!comps.length) {
        //             detalleRows.push([t.id, origen, destino, t.tipo_vehiculo ?? "",
        //                 "—", "", "", "", "", "", "", "", "", ""]);
        //             return;
        //         }

        //         comps.forEach((comp) => {
        //             const tipoLabel = etiquetaComponente(comp.tipo);
        //             const detalles = comp.detalles || [];
        //             const reqAprob = comp.requiere_aprobacion === 1 ? "Pendiente"
        //                 : comp.requiere_aprobacion === 2 ? "Rechazado"
        //                     : "Aprobado";
        //             const varPct = comp.variacion_pct != null
        //                 ? parseFloat(comp.variacion_pct).toFixed(2) + "%" : "";
        //             const causal = comp.causa?.nombre ?? comp.causa_id ?? "";
        //             const observacion = comp.observacion ?? "";

        //             if (!detalles.length) {
        //                 detalleRows.push([
        //                     t.id, origen, destino, t.tipo_vehiculo ?? "",
        //                     tipoLabel, numerico(comp.valor),
        //                     reqAprob, varPct, causal, observacion,
        //                     "", "", "", "",
        //                 ]);
        //             } else {
        //                 detalles.forEach((det) => {
        //                     const munNombre = det.municipio
        //                         ? `${det.municipio.municipio} - ${det.municipio.depto ?? ""}`
        //                         : (det.municipio_id ?? "");
        //                     const r1 = numerico(det.rate_1);
        //                     const r2 = numerico(det.rate_2);
        //                     const total = r1 + r2;

        //                     detalleRows.push([
        //                         t.id, origen, destino, t.tipo_vehiculo ?? "",
        //                         tipoLabel, numerico(comp.valor),
        //                         reqAprob, varPct, causal, observacion,
        //                         munNombre, r1, r2, total,
        //                     ]);
        //                 });
        //             }
        //         });
        //     });

        //     const wsDetalle = XLSX.utils.aoa_to_sheet(detalleRows);
        //     estilarHoja(wsDetalle, detalleHeaders.length);
        //     XLSX.utils.book_append_sheet(wb, wsDetalle, "Detalle Componentes");

        //     /* ── Descargar ───────────────────────────────────────────── */
        //     const fecha = new Date().toISOString().slice(0, 10);
        //     XLSX.writeFile(wb, `Informe_Tarifas_Costo_${fecha}.xlsx`);

        //     Swal.fire({
        //         icon: "success", title: "Excel generado",
        //         text: `${tarifas.length} tarifa(s) exportada(s) correctamente.`,
        //         timer: 2500, showConfirmButton: false,
        //     });

        // } catch (err) {
        //     console.error("[Export] Error:", err);
        //     Swal.fire("Error", `No se pudo generar el Excel: ${err.message}`, "error");
        // } finally {
        //     btnEl.innerHTML = textoOriginal;
        //     btnEl.style.pointerEvents = "";
        // }
    }

    /* =========================================================
     | DRAG & DROP — IMPORTACIÓN MASIVA
     | FIX: antes usaba DOMContentLoaded que no dispara
     | en carga dinámica. Ahora se llama directo desde initScript.
     | =========================================================*/
    function _initDragDrop() {
        const dz = document.getElementById('im-dropzone');
        if (!dz || dz.dataset.dzOk) return;

        dz.addEventListener('dragover', (e) => {
            e.preventDefault();
            dz.classList.add('dragover');
        });
        dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
        dz.addEventListener('drop', (e) => {
            e.preventDefault();
            dz.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (!file) return;

            const ext = file.name.split('.').pop().toLowerCase();
            if (!['xlsx', 'xls'].includes(ext)) {
                Swal.fire({ icon: 'warning', title: 'Formato no permitido', text: 'Solo .xlsx o .xls', confirmButtonText: 'OK' });
                return;
            }
            const dt = new DataTransfer();
            dt.items.add(file);
            document.getElementById('archivo_excel_costos').files = dt.files;
            _imMostrarArchivoSeleccionado(file);
        });

        const offcanvasIM = document.getElementById('offcanvasImporteMasivoCostos');
        if (offcanvasIM) {
            offcanvasIM.addEventListener('hidden.bs.offcanvas', () => imReset());
        }

        dz.dataset.dzOk = 'true';
    }

    /* =========================================================
     | LISTAR COSTOS
     | =========================================================*/
    async function listar_Fletes_Costos() {
        const tbody = document.getElementById('tarifa_flete_body');
        const tableId = '#tarifas_costo_export';

        if ($.fn.DataTable.isDataTable(tableId)) {
            $(tableId).DataTable().destroy();
            $(`${tableId} thead tr.filters`).remove();
        }

        const params = new URLSearchParams();
        const filtros = {
            empresa_id: document.getElementById('empresa_id')?.value || '',
            fecha_desde: document.getElementById('f_fecha_desde_costo')?.value || '',
            fecha_hasta: document.getElementById('f_fecha_hasta_costo')?.value || '',
            // search: document.getElementById('f_search_costo')?.value || '',
            municipio_id: document.getElementById('f_municipio_costo')?.value || '',
            tipo_vehiculo: document.getElementById('f_tipo_vehiculo_costo')?.value || '',
            estado: document.getElementById('f_estado_costo')?.value || '',
            origen: document.getElementById('f_origen_costo')?.value || '',
            destino: document.getElementById('f_destino_costo')?.value || '',
            semana_desde: document.getElementById('f_semana_desde_costo')?.value || '',
            semana_hasta: document.getElementById('f_semana_hasta_costo')?.value || '',
            mes_desde: document.getElementById('f_mes_desde_costo')?.value || '',
            mes_hasta: document.getElementById('f_mes_hasta_costo')?.value || '',
            pendientes: document.getElementById('f_pendientes_costo')?.checked ? '1' : '',
        };
        Object.entries(filtros).forEach(([k, v]) => { if (v) params.append(k, v); });

        tbody.innerHTML = `<tr><td colspan="12"><div class="text-center p-3"><div class="spinner-border text-primary"></div></div></td></tr>`;

        try {
            const result = await _apiFetch(`${_STATE.baseUrlApi}tarifas-costos?${params.toString()}`);

            tbody.innerHTML = '';

            if (!result.data || result.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="12">No hay registros</td></tr>';
                return;
            }

            // actualizarResumenVigenciasCostos(result.data);

            result.data.forEach((item, index) => {
                const formatFecha = (f) => f ? f.split('T')[0] : '';
                const vigenciaHtml = renderVigenciaCosto(item.vigencia_semaforo);
                // console.log("🚀 ~ listar_Fletes_Costos ~ item.vigencia_semaforo:", item.vigencia_semaforo)
                const estadoBadge = item.estado === 'Activa'
                    ? `<span class="badge badge-phoenix badge-phoenix-success">Activado</span>`
                    : `<span class="badge badge-phoenix badge-phoenix-danger">Inactiva</span>`;

                let rowClass = '';
                if (item.vigencia_semaforo?.estado === 'Vencido') rowClass = 'table-danger';
                if (item.vigencia_semaforo?.estado === 'Por vencer') rowClass = 'table-warning';

                const row = `
                <tr class="${rowClass}">
                    <td>${index + 1}</td>
                    <td style='width:auto; white-space: nowrap;'>${item.id}</td>
                    <td style="white-space:nowrap;">
                        <div class="dropdown">
                            <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" data-bs-toggle="dropdown">
                                ${item.municipio_origen?.municipio ?? ''} - ${item.municipio_origen?.depto ?? ''}
                            </a>
                            <div class="dropdown-menu dropdown-menu-end py-0">
                                <a class="dropdown-item fw-bold btn_editar_flete_costo" href="#" data-id="${item.id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvaTarifasCostos"> Editar Tarifa </a>
                                
                                ${/* Solo mostrar opciones de estado si NO está rechazada */
                    item.estado_tarifa !== "Rechazada" ? `
                                        ${item.estado_tarifa === "Activa" ? `<a class="dropdown-item fw-bold btn_inactivar_tarifa_costos" id="btn_inactivar_tarifa_costos" href="#" data-tarifa_id="${item.id}" > Inactivar Tarifa</a>` : ""}
                                        ${item.estado_tarifa === "Inactiva" ? `<a class="dropdown-item fw-bold btn_activar_tarifa_costo" id="btn_activar_tarifa_costo" href="#" data-tarifa_id="${item.id}" >Activar Tarifa</a>` : ""}
                                    ` : ""
                    }
                            </div>
                        </div>
                    </td>
                    <td style="white-space:nowrap;">${item.municipio_destino?.municipio ?? ''} - ${item.municipio_destino?.depto ?? ''}</td>
                    <td style='width:auto; white-space: nowrap;'>${item.municipio_origen?.zona_municipio?.[0]?.zona?.nombre_zona ?? "-"}</td>
                    <td style='width:auto; white-space: nowrap;'>${item.municipio_destino?.zona_municipio?.[0]?.zona?.nombre_zona ?? "-"}</td>
                    <td style="white-space:nowrap;">${item.tipo_vehiculo} - ${obtenerTipoVehiculo(item.tipo_vehiculo)}</td>
                    <td style="white-space:nowrap;">${item.vigencia}</td>
                    <td style="white-space:nowrap;">${item.mes}</td>
                    <td style="white-space:nowrap;">${item.semana}</td>
                    <td style="white-space:nowrap;">${Number(item.tarifa).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                    <td style="white-space:nowrap;">${Number(item.tarifa_sicetac).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                    <td style='width:auto; white-space: nowrap;'>
                        ${calcularVariacionTarifa(item.tarifa, item.tarifa_sicetac)}
                    </td>
                    <td>${vigenciaHtml}</td>
                    <td>${estadoBadge}</td>
                    <td style='width:auto; white-space: nowrap;'>
                        ${(() => {
                        if (item.estado_aprobacion === 'Pendiente Aprobacion' || item.estado_aprobacion === 'Rechazada') {
                            return `<span class="badge badge-phoenix badge-phoenix-danger">${item.estado_aprobacion}</span>`;
                        } else {
                            return `<span class="badge badge-phoenix badge-phoenix-success">${item.estado_aprobacion}</span>`;
                        }
                    })()}
                    </td>
                    <td style="white-space:nowrap;">${formatFecha(item.fecha)} ${item.hora}</td>
                    <td style="white-space:nowrap;">${item.usuario}</td>
                    <td style='width:auto; white-space: nowrap;'>${item.empresa_tarifa.nombre_empresa}</td>
                    <td style='width:auto; white-space: nowrap; min-width:140px;'>
                            ${renderCausalesTabla(item.componentes)}
                    </td>
                    <td style='width:auto; white-space: nowrap; min-width:160px; max-width:240px; vertical-align:top;'>
                            ${renderObservacionesTabla(item.componentes)}
                    </td>
                </tr>`;
                tbody.insertAdjacentHTML('beforeend', row);
            });

            setTimeout(() => inicializarDataTableCostos(tableId), 100);

        } catch (error) {
            console.error(error);
            tbody.innerHTML = `<tr><td colspan="12" class="text-danger">Error al cargar costos</td></tr>`;
        }
    }

    // Agrega esta función helper antes o dentro de listar_Tarifas_cliente
    function calcularVariacionTarifa(tarifa, tarifa_sicetac) {
        const t = Number(tarifa) || 0;
        const s = Number(tarifa_sicetac) || 0;  // Si es null/undefined/NaN → 0

        if (s === 0) {
            return `<span class="badge badge-phoenix badge-phoenix-secondary">Sin SICETAC</span>`;
        }

        const variacion = ((t - s) / s) * 100;
        const abs = Math.abs(variacion).toFixed(2);

        if (variacion > 0) {
            return `<span class="badge badge-phoenix badge-phoenix-success">
                    <i class="bi bi-arrow-up"></i> +${abs}% sobre SICETAC
                </span>`;
        } else if (variacion < 0) {
            return `<span class="badge badge-phoenix badge-phoenix-danger">
                    <i class="bi bi-arrow-down"></i> -${abs}% bajo SICETAC
                </span>`;
        } else {
            return `<span class="badge badge-phoenix badge-phoenix-info">
                    <i class="bi bi-dash"></i> Igual a SICETAC
                </span>`;
        }
    }

    /* =========================================================
     | DATATABLE COSTOS
     | =========================================================*/
    function inicializarDataTableCostos(id) {
        const $tabla = $(id);

        if ($.fn.DataTable.isDataTable(id)) $tabla.DataTable().destroy();
        $tabla.find('thead tr.filters').remove();

        const $filterRow = $tabla.find('thead tr:first').clone(true).addClass('filters');
        $filterRow.appendTo($tabla.find('thead'));

        $tabla.DataTable({
            orderCellsTop: true,
            fixedHeader: true,
            destroy: true,
            language: { url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
            initComplete: function () {
                const api = this.api();
                api.columns().eq(0).each(function (colIdx) {
                    const cell = $tabla.find('.filters th').get(colIdx);
                    if (!cell) return;
                    if (colIdx === 0) { $(cell).html(''); return; }
                    const title = $(api.column(colIdx).header()).text();
                    $(cell).html(`<input type="text" class="w-100" placeholder="${title}" style="font-size:11px;height:24px;">`);
                    $('input', cell).on('keyup change', function (e) {
                        e.stopPropagation();
                        if (api.column(colIdx).search() !== this.value) {
                            api.column(colIdx).search(this.value).draw();
                        }
                    });
                });
            }
        });
    }

    function renderCausalesTabla(componentes) {
        if (!componentes || componentes.length === 0) {
            return `<span class="text-muted" style="font-size:0.7rem;">—</span>`;
        }

        // Recolectar causales únicas (puede haber varios componentes con la misma)
        const causalesUnicas = [...new Map(
            componentes
                .filter(c => c.causa !== null)
                .map(c => [c.causa.id, c.causa.causal_aprobacion])
        ).entries()];

        if (causalesUnicas.length === 0) {
            return `<span class="badge bg-light text-muted border" style="font-size:0.65rem;">
                    <i class="bi bi-slash-circle me-1"></i>Sin causal
                </span>`;
        }

        // Una línea por causal única
        return causalesUnicas.map(([id, nombre]) =>
            `<span class="badge bg-warning-subtle text-warning border border-warning-subtle d-block mb-1" style="font-size:0.65rem; white-space:normal; text-align:left;">
            <i class="bi bi-tag-fill me-1"></i>${nombre}
        </span>`
        ).join('');
    }

    function renderObservacionesTabla(componentes) {
        if (!componentes || componentes.length === 0) {
            return `<span class="text-muted" style="font-size:0.7rem;">—</span>`;
        }

        // Filtrar solo los que tienen observación con texto real
        const conObservacion = componentes.filter(
            c => c.observacion && c.observacion.trim() !== ""
        );

        if (conObservacion.length === 0) {
            return `<span class="text-muted" style="font-size:0.7rem;">—</span>`;
        }

        // Mostrar: nombre del componente + su observación
        return conObservacion.map(c =>
            `<div class="mb-1" style="font-size:0.68rem; text-align:left; min-width:160px; max-width:220px;">
            <span class="fw-bold text-secondary d-block" style="font-size:0.6rem; text-transform:uppercase; letter-spacing:0.04em;">
                ${c.tipo.replace(/_/g, " ")}
            </span>
            <span class="text-dark" style="white-space:normal; line-height:1.3;">
                <i class="bi bi-chat-left-text-fill text-info me-1" style="font-size:0.6rem;"></i>${c.observacion}
            </span>
        </div>`
        ).join('<hr class="my-1">');
    }

    /* =========================================================
     | SEMÁFORO DE VIGENCIAS
     | =========================================================*/
    // function actualizarResumenVigenciasCostos(data) {
    //     let vigentes = 0, porVencer = 0, vencidas = 0, inactivas = 0, por_aprobar = 0;

    //     data.forEach(item => {
    //         const estado = item.vigencia_semaforo?.estado;
    //         const estado_tar = item.estado_tarifa;
    //         const estado_apro = item.estado_aprobacion;

    //         if (estado === 'Vigente') vigentes++;
    //         if (estado === 'Por vencer') porVencer++;
    //         if (estado === 'Vencido') vencidas++;
    //         if (estado_tar === "Inactiva") inactivas++;
    //         if (estado_apro === "Pendiente Aprobacion") por_aprobar++;
    //     });

    //     _animateCounter('total_vigentes_costos', vigentes);
    //     _animateCounter('total_por_vencer_costos', porVencer);
    //     _animateCounter('total_vencidas_costos', vencidas);
    //     _animateCounter('total_por_aprobar_costos', inactivas);
    //     _animateCounter('total_inactivas_costos', por_aprobar);
    // }

    function renderVigenciaCosto(vigencia_semaforo) {

        if (!vigencia_semaforo) {
            return `<span class="badge badge-phoenix badge-phoenix-secondary">Sin datos</span>`;
        }

        let { estado = '', color = 'success', dias_restantes: dias = 0, label = estado } = vigencia_semaforo;

        // 🔧 Redondear días
        dias = Math.ceil(dias); // recomendado para días restantes

        const textoDias =
            estado === 'Vencido'
                ? '(Vencida)'
                : (estado === 'Vigente' || estado === 'Por vencer')
                    ? `(${dias} días restantes)`
                    : '';

        return `
        <div class="d-flex flex-column align-items-center">
            <span class="badge badge-phoenix badge-phoenix-${color}">
                ${label.toUpperCase()}
            </span>
            <small class="text-muted">${textoDias}</small>
        </div>`;
    }

    /* =========================================================
     | IMPORTACIÓN MASIVA
     | =========================================================*/
    function imOnFileSelected(input) {
        if (!input.files || !input.files[0]) return;
        _imMostrarArchivoSeleccionado(input.files[0]);
    }

    function _imMostrarArchivoSeleccionado(file) {
        document.getElementById('im-file-name').textContent = file.name;
        document.getElementById('im-file-size').textContent = _imFormatBytes(file.size);
        document.getElementById('im-file-preview').classList.add('show');
        document.getElementById('im-btn-start').disabled = false;

        const dz = document.getElementById('im-dropzone');
        if (dz) { dz.style.borderColor = '#16a34a'; dz.style.background = '#f0fdf4'; }
    }

    function imLimpiarArchivo() {
        const input = document.getElementById('archivo_excel_costos');
        if (input) input.value = '';
        document.getElementById('im-file-preview').classList.remove('show');
        document.getElementById('im-btn-start').disabled = true;

        const dz = document.getElementById('im-dropzone');
        if (dz) { dz.style.borderColor = ''; dz.style.background = ''; }
    }

    /* ===========================================================================
    | ▼ INICIO — Reemplaza: async function importarTarifasMasivo()
    | ===========================================================================*/
    async function importarTarifasMasivo() {
        const archivoInput = document.getElementById('archivo_excel_costos');
        if (!archivoInput?.files?.[0]) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin archivo',
                text: 'Selecciona un archivo Excel antes de continuar.',
                confirmButtonText: 'OK',
            });
            return;
        }

        _imMostrarSeccion('progress');
        _imResetSteps();
        _imSetProgreso(0, 'Iniciando proceso...');
        _imIniciarSimulacion();

        try {
            const formData = new FormData();
            formData.append('file', archivoInput.files[0]);
            formData.append('empresa_id', document.getElementById('empresa_id')?.value ?? '');
            formData.append('usuario', document.getElementById('ssn_nombre')?.value ?? '');

            const response = await fetch(`${_STATE.baseUrlApi}tarifas-costos/importar-masivo`, {
                method: 'POST',
                headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
                body: formData,
            });

            const result = await response.json();

            _imDetenerSimulacion();

            // ── Si fue un error de validación (VAL-1 / VAL-2 / VAL-3) ────────
            // El servidor devuelve success:false con tipo_error:"validacion".
            // No marcamos todos los steps como completados: marcamos el que
            // corresponde según qué hoja estaba procesando cuando abortó.
            if (!result.success && result.tipo_error === 'validacion') {
                _imMarcarStepError(_imDetectarStepFallido(result.message));
                _imSetProgreso(0, 'Importación detenida');
                await new Promise(r => setTimeout(r, 400));
                _imMostrarErrorValidacion(result.message);
                return;
            }

            // ── Respuesta normal (éxito o error de sistema) ───────────────────
            _imMarcarTodosCompletados();
            _imSetProgreso(100, '¡Procesamiento completado!');
            await new Promise(r => setTimeout(r, 700));

            if (result.success) {
                _imMostrarResultado(result);
                await listar_Fletes_Costos();

                const n = result.resumen?.creadas_pendientes ?? 0;
                if (n > 0) {
                    Swal.fire({
                        icon: 'info',
                        title: `${n} tarifa${n > 1 ? 's' : ''} en bandeja de aprobación`,
                        html: `<strong>${n}</strong> tarifa${n > 1 ? 's requieren' : ' requiere'} aprobación.<br>
                           Revísalas en la <strong>Bandeja de Aprobación</strong>.`,
                        confirmButtonText: 'Entendido',
                        confirmButtonColor: '#1a3c6b',
                    });
                }
            } else {
                // Error de sistema: devolver a pantalla de upload con Swal
                _imMostrarResultadoError(result.message ?? 'Error procesando el archivo.');
                Swal.fire({
                    icon: 'error',
                    title: 'Error en la importación',
                    html: `<p>${result.message ?? 'Error al procesar el archivo.'}</p>
                       ${result.error ? `<small class="text-danger">${result.error}</small>` : ''}`,
                    confirmButtonText: 'Cerrar',
                });
            }

        } catch (err) {
            // Error de red o respuesta no-JSON
            _imDetenerSimulacion();
            _imMarcarStepError(IM_STEPS[0].id);
            console.error('importarTarifasMasivo error:', err);
            _imMostrarResultadoError('Error de conexión con el servidor.');
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                html: `<p>${err.message}</p>`,
                confirmButtonText: 'Cerrar',
            });
        }
    }
    /* ▲ FIN — importarTarifasMasivo */

    function _imMostrarResultado(result) {
        const r = result.resumen ?? {};
        _imMostrarSeccion('result');

        const tienePendientes = (r.creadas_pendientes ?? 0) > 0;
        const tieneErrores = (r.errores ?? 0) > 0;

        if (!tienePendientes && !tieneErrores) {
            document.getElementById('im-result-icon').textContent = '✅';
            document.getElementById('im-result-title').textContent = '¡Importación completada!';
            document.getElementById('im-result-sub').textContent = `${r.creadas_activas ?? 0} tarifa(s) activadas`;
        } else if (tienePendientes && !tieneErrores) {
            document.getElementById('im-result-icon').textContent = '⏳';
            document.getElementById('im-result-title').textContent = 'Completada con observaciones';
            document.getElementById('im-result-sub').textContent = `${r.creadas_pendientes} tarifa(s) requieren aprobación`;
        } else {
            document.getElementById('im-result-icon').textContent = '⚠️';
            document.getElementById('im-result-title').textContent = 'Finalizada con errores';
            document.getElementById('im-result-sub').textContent = 'Revisa los detalles a continuación';
        }

        document.getElementById('sum-activas').textContent = r.creadas_activas ?? 0;
        document.getElementById('sum-pendientes').textContent = r.creadas_pendientes ?? 0;
        document.getElementById('sum-saltadas').textContent = (r.saltadas_pendiente ?? 0) + (r.saltadas_vacias ?? 0);
        document.getElementById('sum-errores').textContent = r.errores ?? 0;

        const pendientesList = result.pendientes_detalle ?? [];
        if (pendientesList.length > 0) {
            document.getElementById('im-block-pendientes').style.display = 'block';
            document.getElementById('badge-pendientes').textContent = pendientesList.length;
            document.getElementById('detail-pendientes').innerHTML = pendientesList.map(p => `
                <div class="im-detail-row">
                    <div class="ruta">Fila #${p.fila} — ${p.origen} → ${p.destino} · ${p.tipo}</div>
                    <div class="meta">Tarifa ID: <strong>#${p.tarifa_id}</strong>
                        ${(p.variaciones ?? []).map(v =>
                `<span class="im-var-chip alta">${_imLabelTipo(v.tipo)} ${v.variacion_pct}% (lím. ${v.limite}%)</span>`
            ).join('')}
                    </div>
                </div>`).join('');
            document.getElementById('detail-pendientes').classList.add('open');
        }

        const erroresList = result.errores_detalle ?? [];
        if (erroresList.length > 0) {
            document.getElementById('im-block-errores').style.display = 'block';
            document.getElementById('badge-errores').textContent = erroresList.length;
            document.getElementById('detail-errores').innerHTML = erroresList.map(e => `
                <div class="im-detail-row">
                    <div class="ruta" style="color:#dc2626;">Fila #${e.fila} — ${e.origen || '?'} → ${e.destino || '?'} · ${e.tipo || '?'}</div>
                    <div class="meta" style="color:#991b1b;">${e.error}</div>
                </div>`).join('');
        }
    }

    // function _imMostrarResultadoError(mensaje) {
    //     _imMostrarSeccion('result');
    //     document.getElementById('im-result-icon').textContent = '❌';
    //     document.getElementById('im-result-title').textContent = 'Error en la importación';
    //     document.getElementById('im-result-sub').textContent = mensaje;
    //     ['sum-activas', 'sum-pendientes', 'sum-saltadas', 'sum-errores']
    //         .forEach(id => document.getElementById(id).textContent = '—');
    // }

    /* ===========================================================================
        | ▼ INICIO — Reemplaza: function _imMostrarResultadoError(mensaje)
        | ===========================================================================*/
    function _imMostrarResultadoError(mensaje) {
        _imMostrarSeccion('result');
        document.getElementById('im-result-icon').textContent = '❌';
        document.getElementById('im-result-title').textContent = 'Error en la importación';
        document.getElementById('im-result-sub').textContent = mensaje;
        ['sum-activas', 'sum-pendientes', 'sum-saltadas', 'sum-errores']
            .forEach(id => document.getElementById(id).textContent = '—');
    }
    /* ▲ FIN — _imMostrarResultadoError */

    /* ===========================================================================
 | ▼ INICIO — NUEVAS FUNCIONES (agregar después de _imMostrarResultadoError)
 |
 | Estas funciones NO existían antes. Agrégalas al bloque de
 | "IMPORTACIÓN MASIVA" del JS, justo después de _imMostrarResultadoError.
 | ===========================================================================*/

    /**
     * _imMostrarErrorValidacion
     *
     * Muestra un Swal diferenciado para errores de validación de datos
     * (hojas faltantes, campos vacíos, rowKey inválido, municipio duplicado).
     *
     * A diferencia del error de sistema, este:
     *   - Usa icono de advertencia (warning), no de error
     *   - Tiene un título distinto que comunica que el problema está en el archivo
     *   - Ofrece el botón "Corregir archivo" que vuelve a la pantalla de upload
     *     para que el usuario pueda seleccionar un archivo corregido sin recargar
     *   - Muestra el mensaje exacto del backend con formato monoespaciado
     *     para que sea fácil leer el número de fila y campo involucrado
     */
    function _imMostrarErrorValidacion(mensaje) {
        Swal.fire({
            icon: 'warning',
            title: 'El archivo tiene errores — importación cancelada',
            html: `
            <p style="margin-bottom:12px; color:#6b7280; font-size:.9rem;">
                Se encontró un problema en los datos antes de guardar cualquier registro.
                <strong>No se modificó nada</strong> en la base de datos.
            </p>
            <div style=" background:#fef3c7; border:1px solid #f59e0b; border-radius:8px; padding:12px 16px; text-align:left; font-size:.85rem; color:#92400e; font-family: 'Courier New', monospace; white-space: pre-wrap; word-break: break-word; line-height: 1.6;">
                ${_imEscapeHtml(mensaje)}
            </div>
            <p style="margin-top:12px; color:#6b7280; font-size:.8rem;">
                Corrige el archivo Excel y vuelve a intentarlo.
            </p>
        `,
            confirmButtonText: '<i class="fas fa-file-excel me-1"></i> Corregir archivo',
            confirmButtonColor: '#d97706',
            showCancelButton: false,
            width: 560,
        }).then(() => {
            // Al cerrar el Swal: volver a la pantalla de upload lista para nuevo intento
            imReset();
        });
    }

    /**
     * _imDetectarStepFallido
     *
     * Infiere qué step de la barra de progreso marcar como error
     * basándose en qué hoja menciona el mensaje del backend.
     * Así el usuario ve visualmente en qué etapa se detuvo el proceso.
     */
    function _imDetectarStepFallido(mensaje) {
        if (!mensaje) return IM_STEPS[0].id;
        const m = mensaje.toLowerCase();
        if (m.includes('"multidestino"')) return 'step-multidestino';
        if (m.includes('"multiorigen"')) return 'step-multiorigen';
        if (m.includes('"archivo"')) return 'step-archivo';
        // VAL-1: falta de hojas → fallo en la etapa de conversión inicial
        return 'step-convirtiendo';
    }

    /**
     * _imEscapeHtml
     *
     * Escapa caracteres HTML para mostrar el mensaje del backend
     * de forma segura dentro del innerHTML del Swal.
     */
    function _imEscapeHtml(texto) {
        return String(texto)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    /* ▲ FIN — Nuevas funciones */


    function imToggleDetalle(tipo) {
        document.getElementById(`detail-${tipo}`)?.classList.toggle('open');
    }

    function imCerrar() {
        const el = document.getElementById('offcanvasImporteMasivoCostos');
        const oc = el ? bootstrap.Offcanvas.getInstance(el) : null;
        if (oc) oc.hide();
        setTimeout(() => imReset(), 300);
    }

    function imReset() {
        imLimpiarArchivo();
        _imDetenerSimulacion();
        _imResetSteps();
        _imSetProgreso(0, 'Iniciando proceso...');
        ['im-block-pendientes', 'im-block-errores'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        ['detail-pendientes', 'detail-errores'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.innerHTML = ''; el.classList.remove('open'); }
        });
        _imMostrarSeccion('upload');
    }

    /* ── Progreso y steps ───────────────────────────────────*/
    function _imMostrarSeccion(seccion) {
        ['upload', 'progress', 'result'].forEach(s => {
            const el = document.getElementById(`im-${s}-section`);
            if (el) el.style.display = s === seccion ? 'block' : 'none';
        });
    }

    function _imSetProgreso(pct, titulo, sub) {
        _STATE.progreso = pct;
        const fill = document.getElementById('im-progress-fill');
        const lbl = document.getElementById('im-pct-label');
        const right = document.getElementById('im-pct-right');
        const title = document.getElementById('im-prog-title');
        const subEl = document.getElementById('im-prog-sub');
        if (fill) fill.style.width = pct + '%';
        if (lbl) lbl.textContent = pct + '%';
        if (right) right.textContent = pct + '%';
        if (title && titulo) title.textContent = titulo;
        if (subEl && sub) subEl.textContent = sub;
    }

    function _imResetSteps() {
        IM_STEPS.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) el.className = 'im-step';
        });
    }

    function _imMarcarStepActivo(stepId) {
        const el = document.getElementById(stepId);
        if (el && !el.classList.contains('done')) el.className = 'im-step active';
    }

    function _imMarcarStepDone(stepId) {
        const el = document.getElementById(stepId);
        if (el) {
            el.className = 'im-step done';
            const dot = el.querySelector('.im-step-dot');
            if (dot) dot.innerHTML = '<i class="fas fa-check"></i>';
        }
    }

    function _imMarcarStepError(stepId) {
        const el = document.getElementById(stepId);
        if (el) {
            el.className = 'im-step error';
            const dot = el.querySelector('.im-step-dot');
            if (dot) dot.innerHTML = '<i class="fas fa-times"></i>';
        }
    }

    function _imMarcarTodosCompletados() {
        IM_STEPS.forEach(s => _imMarcarStepDone(s.id));
    }

    function _imIniciarSimulacion() {
        let stepIdx = 0, pct = 0;
        _imMarcarStepActivo(IM_STEPS[0].id);
        _imSetProgreso(5, IM_STEPS[0].msg);

        _STATE.timerInterval = setInterval(() => {
            const siguiente = stepIdx < IM_STEPS.length ? IM_STEPS[stepIdx].pct : 95;
            pct += Math.random() * 4 + 1;
            if (pct > siguiente - 1) pct = siguiente - 1;
            if (pct > 95) pct = 95;
            _imSetProgreso(Math.round(pct));

            if (stepIdx < IM_STEPS.length && pct >= IM_STEPS[stepIdx].pct - 3) {
                _imMarcarStepDone(IM_STEPS[stepIdx].id);
                stepIdx++;
                if (stepIdx < IM_STEPS.length) {
                    _imMarcarStepActivo(IM_STEPS[stepIdx].id);
                    const titleEl = document.getElementById('im-prog-title');
                    if (titleEl) titleEl.textContent = IM_STEPS[stepIdx].msg;
                }
            }
        }, 1200);
    }

    function _imDetenerSimulacion() {
        if (_STATE.timerInterval) {
            clearInterval(_STATE.timerInterval);
            _STATE.timerInterval = null;
        }
    }

    /* =========================================================
     | HELPERS DE FORMULARIO
     | =========================================================*/
    function limpiarError(el) {
        if (!el) return;
        el.classList.remove('is-invalid');
        el.parentNode.querySelector('.invalid-feedback')?.remove();
    }

    function mostrarErrores(errores) {
        Swal.fire({
            icon: 'error',
            title: 'Errores encontrados',
            html: `<ul style="text-align:left">${errores.map(e => `<li>${e}</li>`).join('')}</ul>`,
        });
    }

    function limpiarMoneda(valor) {
        if (!valor) return 0;
        return parseFloat(String(valor).replace(/[$\s.]/g, '').replace(',', '.')) || 0;
    }

    function formatCOP(valor) {
        return Number(valor).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    }

    function setTomSelectValue(id, value) {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.tomselect) el.tomselect.setValue(String(value));
        else el.value = value;
    }

    function resetFormularioCosto() {
        document.getElementById('multiorigen-costo-container').innerHTML = '';
        document.getElementById('multidestino-costo-container').innerHTML = '';
        document.getElementById('multi_recogida_costo').value = '';
        document.getElementById('multi_entrega_costo').value = '';
        document.getElementById('valor').value = '';
        document.getElementById('vigencia').value = '';
        document.getElementById('mes_flete').value = '';
        document.getElementById('semana').value = '';
        document.getElementById('btn_guardar_tarifa_costo').setAttribute('data-tarifa_id', '');
    }

    function obtenerMultiOrigen() {
        return [...document.querySelectorAll('#multiorigen-costo-container .extra-origin-item-costo')]
            .map(row => ({
                municipio_id: row.querySelector('.municipio_id')?.value,
                rate_1: limpiarMoneda(row.querySelector('.rate_1')?.value ?? 0),
                rate_2: limpiarMoneda(row.querySelector('.rate_2')?.value ?? 0),
            }));
    }

    function obtenerMultiDestino() {
        return [...document.querySelectorAll('#multidestino-costo-container .extra-destination-item-costo')]
            .map(row => ({
                municipio_id: row.querySelector('.municipio_id')?.value,
                rate_1: limpiarMoneda(row.querySelector('.rate_1')?.value ?? 0),
                rate_2: limpiarMoneda(row.querySelector('.rate_2')?.value ?? 0),
            }));
    }

    function renderMultiOrigenCosto(detalles = []) {
        const container = document.getElementById('multiorigen-costo-container');
        detalles.forEach(detalle => {
            const nuevo = document.createElement('div');
            nuevo.classList.add('row', 'g-3', 'extra-origin-item-costo', 'mb-2');
            nuevo.innerHTML = `
                <div class="col-md-6">
                    <label class="form-label-sm">Origen Adicional <span class="req">*</span></label>
                    <div class="input-group input-group-sm">
                        <select class="js-extra-origin-costo municipio_id w-100" data-selected="${detalle.municipio_id}" name="extra_origin_costo_id[]"></select>
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-sm">Tarifa Adicional 1</label>
                    <div class="input-group input-group-sm">
                        <span class="input-group-text">$</span>
                        <input type="text" class="form-control js-extra-rate-costo-1 rate_1" value="${formatCOP(detalle.rate_1)}">
                    </div>
                </div>
                <div class="col-md-3 d-flex align-items-end">
                    <div class="w-100">
                        <label class="form-label-sm">Tarifa Adicional 2</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">$</span>
                            <input type="text" class="form-control js-extra-rate-costo-2 rate_2" value="${formatCOP(detalle.rate_2)}">
                            <button class="btn btn-outline-danger btn-sm btn-remove-extra-costo" type="button"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                </div>`;
            container.appendChild(nuevo);
        });
    }

    function renderMultiDestinoCosto(detalles = []) {
        const container = document.getElementById('multidestino-costo-container');
        detalles.forEach(detalle => {
            const nuevo = document.createElement('div');
            nuevo.classList.add('row', 'g-3', 'extra-destination-item-costo', 'mb-2');
            nuevo.innerHTML = `
                <div class="col-md-6">
                    <label class="form-label-sm">Destino Adicional <span class="req">*</span></label>
                    <div class="input-group input-group-sm">
                        <select class="js-extra-destination-costo municipio_id w-100" data-selected="${detalle.municipio_id}" name="extra_destination_costo_id[]"></select>
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-sm">Tarifa Adicional 1</label>
                    <div class="input-group input-group-sm">
                        <span class="input-group-text">$</span>
                        <input type="text" class="form-control js-extra-destination-costo-rate-1 rate_1" value="${formatCOP(detalle.rate_1)}">
                    </div>
                </div>
                <div class="col-md-3 d-flex align-items-end">
                    <div class="w-100">
                        <label class="form-label-sm">Tarifa Adicional 2</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">$</span>
                            <input type="text" class="form-control js-extra-destination-costo-rate-2 rate_2" value="${formatCOP(detalle.rate_2)}">
                            <button class="btn btn-outline-danger btn-sm btn-remove-destination-costo" type="button"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                </div>`;
            container.appendChild(nuevo);
        });
    }

    /**
     * Formatea una fecha ISO a DD/MM/YYYY.
     * Acepta strings con o sin hora ("2025-03-01" y "2025-03-01T00:00:00").
     */
    function fmtFecha(val) {
        if (!val) return "";
        const s = val.toString().split("T")[0]; // quitar hora si viene
        const [y, m, d] = s.split("-");
        if (!y || !m || !d) return s;
        return `${d}/${m}/${y}`;
    }

    /**
     * Devuelve un número limpio para celdas numéricas del Excel.
     * SheetJS guarda valores numéricos reales (no strings) para que
     * Excel les aplique formato de moneda/número.
     */
    function numerico(val) {
        const n = parseFloat(val);
        return isNaN(n) ? 0 : n;
    }

    /** Etiqueta legible por tipo de componente */
    function etiquetaComponente(tipo) {
        const map = {
            PLENA: "Tarifa Plena",
            MULTI_RECOGIDA: "Multi Recogida",
            MULTI_ENTREGA: "Multi Entrega",
            MULTI_ORIGEN: "Multi Origen",
            MULTI_DESTINO: "Multi Destino",
        };
        return map[tipo] || tipo;
    }

    /**
     * Aplica estilos básicos a una hoja:
     *  - Encabezado: fondo verde oscuro, texto blanco, negrita.
     *  - Autoajuste de ancho de columnas.
     *  - Filtros automáticos en la fila de encabezado.
     */
    function estilarHoja(ws, numCols) {
        if (!ws["!ref"]) return;

        const range = XLSX.utils.decode_range(ws["!ref"]);
        const totalRows = range.e.r;

        /* ── Estilo de encabezado ─────────────────────────────── */
        const estiloHeader = {
            font: { bold: true, color: { rgb: "FFFFFF" }, name: "Arial", sz: 10 },
            fill: { fgColor: { rgb: "1A5276" }, patternType: "solid" },
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            border: {
                top: { style: "thin", color: { rgb: "AAAAAA" } },
                bottom: { style: "thin", color: { rgb: "AAAAAA" } },
                left: { style: "thin", color: { rgb: "AAAAAA" } },
                right: { style: "thin", color: { rgb: "AAAAAA" } },
            },
        };

        for (let c = 0; c < numCols; c++) {
            const addr = XLSX.utils.encode_cell({ r: 0, c });
            if (!ws[addr]) continue;
            ws[addr].s = estiloHeader;
        }

        /* ── Estilo de celdas de datos ───────────────────────── */
        const estiloMoneda = {
            numFmt: '"$"#,##0.00',
            font: { name: "Arial", sz: 9 },
            border: {
                top: { style: "hair", color: { rgb: "DDDDDD" } },
                bottom: { style: "hair", color: { rgb: "DDDDDD" } },
                left: { style: "hair", color: { rgb: "DDDDDD" } },
                right: { style: "hair", color: { rgb: "DDDDDD" } },
            },
        };
        const estiloTexto = {
            font: { name: "Arial", sz: 9 },
            border: estiloMoneda.border,
        };

        // Columnas que contienen moneda (índice 0-based).
        // Hoja Resumen: cols 10–15 | Hoja Detalle: cols 9, 13, 14, 15
        const colsMoneda = new Set([9, 10, 11, 12, 13, 14, 15]);

        for (let r = 1; r <= totalRows; r++) {
            for (let c = 0; c < numCols; c++) {
                const addr = XLSX.utils.encode_cell({ r, c });
                if (!ws[addr]) continue;
                ws[addr].s = colsMoneda.has(c) ? estiloMoneda : estiloTexto;
            }
        }

        /* ── Autoajuste ancho de columnas ────────────────────── */
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        ws["!cols"] = Array.from({ length: numCols }, (_, ci) => {
            const maxLen = data.reduce((acc, row) => {
                const cell = row[ci];
                return Math.max(acc, cell ? cell.toString().length : 0);
            }, 10);
            return { wch: Math.min(maxLen + 4, 55) }; // máximo 55 chars
        });

        /* ── Filtros automáticos ─────────────────────────────── */
        ws["!autofilter"] = {
            ref: XLSX.utils.encode_range({
                s: { r: 0, c: 0 },
                e: { r: totalRows, c: numCols - 1 },
            }),
        };

        /* ── Fijar fila de encabezado (freeze pane) ──────────── */
        ws["!freeze"] = { xSplit: 0, ySplit: 1 };
    }

    /* =========================================================
     | HELPERS GENERALES
     | =========================================================*/
    function _animateCounter(id, value) {
        const el = document.getElementById(id);
        if (!el) return;
        let start = 0;
        const step = Math.ceil(value / (300 / 16));
        const interval = setInterval(() => {
            start += step;
            if (start >= value) { el.textContent = value; clearInterval(interval); }
            else el.textContent = start;
        }, 16);
    }

    function obtenerTipoVehiculo(value) {
        const mapa = {
            '2': 'Camión dos ejes - Sencillo PBV mas de 10500 Kg',
            '2_7_8': 'Camion dos ejes - Sencillo PBV 7500-8000 Kg',
            '2_8_9': 'Camion dos ejes - Sencillo PBV 8001-9000 Kg',
            '2_9_105': 'Camion dos ejes - Sencillo PBV 9001-10500 Kg',
            '2S2': 'Tractocamión dos ejes - Patineta - Minimula con semiremolque de dos ejes',
            '2S3': 'Tractocamión dos ejes - Patineta - Minimula con semiremolque de tres ejes',
            '3': 'Camión tres ejes - Dobletroque',
            '3S2': 'Tractocamión tres ejes - Tractomula con semiremolque de dos ejes',
            '3S3': 'Tractocamión tres ejes - Tractomula con semiremolque de tres ejes',
            'V2': 'Volqueta dos ejes - Sencillo',
            'V3': 'Volqueta tres ejes - Dobletroque',
            'V4': 'Volqueta cuatro ejes - Cuatromanos',
        };
        return mapa[value] || 'No especificado';
    }

    function currencyMask2(ele) {
        const elemento = $(ele);
        let valor = elemento.val().replace(/[^\d]/g, '');
        if (!valor) { elemento.val(''); return; }
        elemento.val(parseFloat(valor).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 }));
    }

    async function MunicipiosTarifasExtras() {
        try {
            const response = await fetch($('#base_url').val() + 'serviciocliente/Consulta_Municipios', { method: 'POST', cache: 'no-cache' });
            const data = await response.json();

            ['.js-extra-origin-costo', '.js-extra-destination-costo'].forEach(clase => {
                document.querySelectorAll(clase).forEach(el => {
                    if (el.tomselect) el.tomselect.destroy();
                    el.innerHTML = '<option value=""></option>';
                    data.forEach(mun => {
                        const opt = document.createElement('option');
                        opt.value = mun.rndc_codigo_ciudad;
                        opt.textContent = `${mun.municipio} - ${mun.depto}`;
                        el.appendChild(opt);
                    });
                    new TomSelect(el, {
                        create: false,
                        placeholder: clase.includes('origin') ? 'Seleccione origen...' : 'Seleccione destino...',
                        allowEmptyOption: true,
                        maxOptions: null,
                        sortField: { field: 'text', direction: 'asc' },
                        onInitialize: function () { this.control.classList.add('form-control', 'form-control-sm'); }
                    });
                });
            });
        } catch (error) {
            console.error('Error en MunicipiosTarifasExtras:', error);
        }
    }

    async function inicializarTomSelectIndividual(el) {
        if (!el || el.tomselect) return;
        try {
            const response = await fetch($('#base_url').val() + 'serviciocliente/Consulta_Municipios', { method: 'POST', cache: 'no-cache' });
            const data = await response.json();
            el.innerHTML = '<option value=""></option>';
            data.forEach(mun => {
                const opt = document.createElement('option');
                opt.value = mun.rndc_codigo_ciudad;
                opt.textContent = `${mun.municipio} - ${mun.depto}`;
                el.appendChild(opt);
            });
            new TomSelect(el, { create: false, placeholder: 'Seleccione...', allowEmptyOption: true, sortField: { field: 'text', direction: 'asc' } });
        } catch (error) {
            console.error('Error inicializando TomSelect:', error);
        }
    }

    function _getISOWeek(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    function _actualizarMes() {
        const year = parseInt(document.getElementById('vigencia').value);
        const week = parseInt(document.getElementById('semana').value);
        if (!year || !week || week < 1 || week > 53) return;
        const date = new Date(year, 0, 1 + (week - 1) * 7);
        document.getElementById('mes_flete').value = date.getMonth() + 1;
    }

    function _imFormatBytes(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    function _imLabelTipo(tipo) {
        return { PLENA: 'Plena', MULTI_RECOGIDA: 'Recogida', MULTI_ENTREGA: 'Entrega', MULTI_ORIGEN: 'Multi-Origen', MULTI_DESTINO: 'Multi-Destino' }[tipo] ?? tipo;
    }

    /* =========================================================
     | LEGADO — jQuery AJAX (se mantiene hasta migrar al API)
     | =========================================================*/
    function _editarFleteAjaxLegacy() {
        let msg_error = '';
        if (!$('#e_valor').val()) msg_error += '<p>Debe diligenciar el campo <strong>Flete</strong>.</p>';
        if (!$('#e_vigencia').val()) msg_error += '<p>Debe diligenciar el campo <strong>Vigencia</strong>.</p>';

        if (msg_error) {
            $('.nexos-messages').html(`<div class="alert alert-danger">${msg_error}</div>`);
            $('html, body').animate({ scrollTop: 0 }, 600);
            return;
        }

        const params = {
            id: $('#e_id').val(),
            tarifa: $('#e_valor').val(),
            vigencia: $('#e_vigencia').val(),
            mes: $('#e_mes').val(),
        };

        $.ajaxSetup({ async: false });
        $.ajax({
            url: $('#base_url').val() + 'libs/fletes_ajax.php?action=editaFlete2',
            type: 'POST',
            data: params,
            cache: false,
            dataType: 'json',
            beforeSend: () => {
                $('.nexos-messages').html('<div class="modal" style="display:block;background:rgba(0,0,0,.5)"><div style="text-align:center;margin:10% auto;background:#fff;padding:30px;max-width:60%;border-radius:5px;">Procesando...</div></div>');
            },
            error: (jqXHR) => {
                console.error(jqXHR);
                $('.nexos-messages').html('<div class="alert alert-danger">Error al procesar la solicitud.</div>');
            },
            success: (data) => {
                if (!data.error) {
                    $('.nexos-messages').html('<div class="alert alert-success">Registro editado con éxito.</div>');
                    setTimeout(() => location.reload(false), 600);
                } else {
                    $('.nexos-messages').html(`<div class="alert alert-danger">${data.error}</div>`);
                }
            },
        });
        $.ajaxSetup({ async: true });
    }

    function renderHistoricoTarifas(historico) {
        const container = document.getElementById("historico-tarifas-costos-container");
        container.innerHTML = "";

        if (!historico || historico.length === 0) {
            container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay registros históricos</td></tr>';
            return;
        }

        const formatMoney = (v) => Number(v).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

        historico.forEach(h => {
            const row = `
                <tr>
                    <td class="fw-bold">${h.fecha ? h.fecha.split('T')[0] : '--'}</td>
                    <td class="text-primary">${formatMoney(h.tarifa)}</td>
                    <td>
                        <small class="d-block text-muted">Año: ${h.vigencia}</small>
                        <small class="d-block text-muted">Mes: ${h.mes}</small>
                        <small class="d-block text-muted">Semana: ${h.semana}</small>
                    </td>
                    <td>
                        <span class="badge ${h.estado_tarifa === 'Activa' ? 'bg-success' : 'bg-secondary'}" style="font-size:0.6rem">
                            ${h.estado_tarifa}
                        </span>
                    </td>
                    <td style='width:auto; white-space: nowrap;'>
                        ${h.estado_aprobacion === "Pendiente Aprobacion" || h.estado_aprobacion === "Rechazada"
                        ? `<span class="badge badge-phoenix badge-phoenix-danger">${h.estado_aprobacion ?? ""}</span>`
                        : `<span class="badge badge-phoenix badge-phoenix-success">${h.estado_aprobacion ?? ""}</span>`}
                    </td>
                    <td><i class="bi bi-person me-1"></i>${h.usuario || 'N/A'}</td>
                </tr>
            `;
            container.insertAdjacentHTML("beforeend", row);
        });
    }

    /* ===================================================================
    |  Descarga de plantilla
    | =================================================================== */

    function descargarPlantillaMasivo() {
        let base = $("#base_url").val();
        let url = base + "public/files/Plantilla_Tarifa_Costo.xlsx";

        window.location.href = url;
    }

    async function Municipios() {
        // Definimos todos los IDs que deben cargarse con la lista de municipios
        const selectIds = [
            // "#origen_tarifa",
            // "#destino_tarifa",
            "#f_origen_costo",
            "#f_destino_costo",
            "#f_municipio_costo",
        ];

        try {
            const response = await fetch(
                $("#base_url").val() + "serviciocliente/Consulta_Municipios",
                {
                    method: "POST",
                    cache: "no-cache",
                },
            );
            const data = await response.json();

            selectIds.forEach((id) => {
                const el = document.querySelector(id);
                if (!el) return;

                // 1. Destruir instancia de TomSelect si ya existe
                if (el.tomselect) {
                    el.tomselect.destroy();
                }

                // 2. Limpiar y llenar el select original
                el.innerHTML = '<option value=""></option>'; // Opción vacía para el placeholder

                data.forEach(function (element) {
                    let opt = document.createElement("option");
                    opt.value = element.rndc_codigo_ciudad;
                    opt.textContent = `${element.municipio} - ${element.depto}`;

                    // Guardar metadatos (útil si necesitas usarlos después)
                    opt.dataset.municipio = element.municipio;
                    opt.dataset.depto = element.depto;

                    el.appendChild(opt);
                });

                // 3. Inicializar TomSelect con configuración unificada
                new TomSelect(id, {
                    create: false, // Cambiado a false para evitar entradas manuales erróneas en municipios
                    placeholder: id.includes("origen")
                        ? "Seleccione origen..."
                        : "Seleccione destino...",
                    allowEmptyOption: true,
                    maxOptions: null, // Permite ver todos los municipios al buscar
                    sortField: {
                        field: "text",
                        direction: "asc",
                    },
                    onInitialize: function () {
                        // Aplicar clases de Bootstrap para que no se vea "aplastado"
                        this.control.classList.add("form-control", "form-control-sm");
                    },
                });
            });
        } catch (error) {
            console.error("Error en Municipios:", error);
        }
    }

    function inicializarVehiculos() {
        const vehiculoIds = ["#slct_tipo_vehiculo_costo", "#f_vehiculo"];

        vehiculoIds.forEach((id) => {
            const el = document.querySelector(id);
            if (!el) return;

            // Destruir instancia previa si existe
            if (el.tomselect) {
                el.tomselect.destroy();
            }

            // Inicializar TomSelect
            new TomSelect(id, {
                create: false, // Usualmente para tipos de vehículos no quieres que el usuario invente nuevos
                placeholder: "Seleccione un vehículo...",
                allowEmptyOption: true,
                sortField: [{ field: "$order" }],
                onInitialize: function () {
                    // Aplicar clases de Bootstrap para mantener el diseño uniforme
                    this.control.classList.add("form-control", "form-control-sm");
                },
            });
        });
    }

    function inicializarOrigenDestino() {
        const vehiculoIds = ["#slct_municipios", "#slct_municipios2"];

        vehiculoIds.forEach((id) => {
            const el = document.querySelector(id);
            if (!el) return;

            // Destruir instancia previa si existe
            if (el.tomselect) {
                el.tomselect.destroy();
            }

            // Inicializar TomSelect
            new TomSelect(id, {
                create: false, // Usualmente para tipos de vehículos no quieres que el usuario invente nuevos
                placeholder: "Seleccione un municipio...",
                allowEmptyOption: true,
                sortField: [{ field: "$order" }],
                onInitialize: function () {
                    // Aplicar clases de Bootstrap para mantener el diseño uniforme
                    this.control.classList.add("form-control", "form-control-sm");
                },
            });
        });
    }

    /* =========================================================
     | EXPOSICIÓN PÚBLICA
     | Solo lo que el HTML llama con onclick o el WindowManager. <small class="d-block text-muted">Hasta: ${h.fecha_fin.split('T')[0]}</small>
     | Todo lo demás es privado dentro del IIFE.
     | =========================================================*/
    window.imOnFileSelected = imOnFileSelected;
    window.imLimpiarArchivo = imLimpiarArchivo;
    window.importarTarifasMasivo = importarTarifasMasivo;
    window.imToggleDetalle = imToggleDetalle;
    window.imCerrar = imCerrar;
    window.imReset = imReset;
    window.currencyMask2 = currencyMask2;
    window.descargarPlantillaMasivo = descargarPlantillaMasivo;
    window.Municipios = Municipios;

    /* =========================================================
     | UI — GESTIÓN DE FILTROS DE CONSULTA (COSTOS)
     | Funciones para el panel de filtros mejorado
     | =========================================================*/

    /**
     * Muestra / oculta el panel de filtros avanzados y rota el ícono chevron.
     */
    function toggleFiltersCosto() {
        const panel = document.getElementById('advancedFiltersCosto');
        const btn = document.getElementById('toggleAdvancedCosto');
        if (!panel || !btn) return;
        const isOpen = panel.classList.contains('show');
        panel.classList.toggle('show', !isOpen);
        btn.classList.toggle('open', !isOpen);
        // Municipios();
    }

    /**
     * Limpia todos los campos de filtro y borra los chips activos.
     */
    function limpiarFiltrosCosto() {
        const fields = [
            'f_fecha_desde_costo', 'f_fecha_hasta_costo',
            'f_search_costo', 'f_tipo_vehiculo_costo', 'f_estado_costo',
            'f_origen_costo', 'f_destino_costo',
            'f_semana_desde_costo', 'f_semana_hasta_costo',
            'f_mes_desde_costo', 'f_mes_hasta_costo',
        ];
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        const pend = document.getElementById('f_pendientes_costo');
        if (pend) pend.checked = false;
        renderChipsCosto();
    }

    /**
     * Renderiza los chips de filtros avanzados activos.
     */
    function renderChipsCosto() {
        const container = document.getElementById('activeFilterChipsCosto');
        if (!container) return;

        const map = {
            f_origen_costo: 'Origen',
            f_destino_costo: 'Destino',
            f_semana_desde_costo: 'Sem. desde',
            f_semana_hasta_costo: 'Sem. hasta',
            f_mes_desde_costo: 'Mes desde',
            f_mes_hasta_costo: 'Mes hasta',
        };

        container.innerHTML = '';

        Object.entries(map).forEach(([id, label]) => {
            const el = document.getElementById(id);
            if (el && el.value) {
                const displayVal = el.options
                    ? el.options[el.selectedIndex]?.text
                    : el.value;
                const chip = document.createElement('div');
                chip.className = 'filter-chip';
                chip.innerHTML = `
                    <span>${label}: <strong>${displayVal}</strong></span>
                    <button onclick="clearFilterFieldCosto('${id}')" title="Quitar filtro">
                        <i class="bi bi-x-lg" style="font-size:.65rem;"></i>
                    </button>`;
                container.appendChild(chip);
            }
        });

        const pend = document.getElementById('f_pendientes_costo');
        if (pend && pend.checked) {
            const chip = document.createElement('div');
            chip.className = 'filter-chip';
            chip.innerHTML = `
                <span>Solo pendientes</span>
                <button onclick="document.getElementById('f_pendientes_costo').checked=false; renderChipsCosto();" title="Quitar">
                    <i class="bi bi-x-lg" style="font-size:.65rem;"></i>
                </button>`;
            container.appendChild(chip);
        }
    }

    /**
     * Limpia un campo individual de filtro y re-renderiza los chips.
     */
    function clearFilterFieldCosto(id) {
        const el = document.getElementById(id);
        if (el) el.value = '';
        renderChipsCosto();
    }

    /* Escuchar cambios en filtros avanzados para actualizar chips */
    document.addEventListener('DOMContentLoaded', function () {
        [
            'f_origen_costo', 'f_destino_costo',
            'f_semana_desde_costo', 'f_semana_hasta_costo',
            'f_mes_desde_costo', 'f_mes_hasta_costo',
            'f_pendientes_costo',
        ].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', renderChipsCosto);
        });
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', Municipios, inicializarVehiculos, inicializarOrigenDestino);
    } else {
        Municipios();
        inicializarVehiculos();
        inicializarOrigenDestino();
    }

    /* Exponer funciones UI al scope global */
    window.toggleFiltersCosto = toggleFiltersCosto;
    window.limpiarFiltrosCosto = limpiarFiltrosCosto;
    window.renderChipsCosto = renderChipsCosto;
    window.clearFilterFieldCosto = clearFilterFieldCosto;

})();