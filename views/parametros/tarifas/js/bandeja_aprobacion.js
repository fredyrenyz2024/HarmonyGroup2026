(function () {

    'use strict';
    window.VENTANA = null;

    /**
     * =============================================================================
     * BANDEJA DE APROBACIÓN — TARIFAS DE COSTO
     * bandeja_aprobacion.js
     *
     * Alineado con el módulo de aprobación de VENTAS.
     * Prefijo "apCostos" para evitar colisiones.
     * =============================================================================
     */

    window._apCostos_tarifaActual = null;
    window._apCostos_dataCompleta = [];

    /* =============================================================================
       CARGAR BANDEJA
       ============================================================================= */
    async function apCostosCargar() {
        const desde = document.getElementById('ap-costos-fecha-desde')?.value ?? '';
        const hasta = document.getElementById('ap-costos-fecha-hasta')?.value ?? '';
        // const search = document.getElementById('ap-costos-search')?.value ?? '';
        const municipio_id = document.getElementById('f_numicipios_aprobacion')?.value ?? '';
        const vehiculo = document.getElementById('ap-costos-tipo-vehiculo')?.value ?? '';
        const empId = document.getElementById('empresa_id')?.value ?? '';

        document.getElementById('ap-costos-tbody').innerHTML = `
        <tr><td colspan="11" style="text-align:center; padding:40px;">
            <div class="ap-empty-icon"><i class="fas fa-spinner fa-spin"></i></div>
            <div>Cargando solicitudes...</div>
        </td></tr>`;

        let url = `${document.getElementById('base_url_api').value}bandeja/pendientes-aprobacion?`;
        if (empId) url += `empresa_id=${empId}&`;
        if (desde) url += `fecha_desde=${desde}&`;
        if (hasta) url += `fecha_hasta=${hasta}&`;
        if (municipio_id) url += `municipio_id=${municipio_id}&`;
        if (vehiculo) url += `tipo_vehiculo=${encodeURIComponent(vehiculo)}&`;

        try {
            const resp = await _apCostosFetch(url);
            const result = await resp.json();

            if (!result.success) {
                apCostosFlash('error', 'Error', result.message ?? 'No se pudo cargar la bandeja.');
                return;
            }

            // window._apCostos_dataCompleta = result.data ?? [];

            // let lista = window._apCostos_dataCompleta;
            let lista = result.data || [];
            // console.log("🚀 ~ apCostosCargar ~ lista:", lista)
            // if (search) {
            // const s = search.toLowerCase();
            // if (municipio_id) {
            //     const s = municipio_id.toLowerCase();
            //     lista = lista.filter(t =>
            //         (t.municipio_origen?.municipio ?? t.origen).toLowerCase().includes(s) ||
            //         (t.municipio_destino?.municipio ?? t.destino).toLowerCase().includes(s) ||
            //         (t.tipo_vehiculo ?? '').toLowerCase().includes(s)
            //     );
            // }

            _apCostosRenderTabla(lista);
            // _apCostosActualizarStats(lista);
            // _apCostosCargarVehiculos(window._apCostos_dataCompleta);

        } catch (err) {
            console.error('apCostosCargar error:', err);
            apCostosFlash('error', 'Error de conexión', err.message);
        }
    }

    /* =============================================================================
       ESTADÍSTICAS
       ============================================================================= */
    // function _apCostosActualizarStats(lista) {
    //     const hoy = new Date().toISOString().slice(0, 10);
    //     const lunes = _apCostosInicioSemana();

    //     document.getElementById('costos-cnt-pendientes').textContent = lista.length;
    //     document.getElementById('costos-cnt-hoy').textContent = lista.filter(t => (t.fecha ?? '').slice(0, 10) === hoy).length;
    //     document.getElementById('costos-cnt-semana').textContent = lista.filter(t => (t.fecha ?? '').slice(0, 10) >= lunes).length;
    //     document.getElementById('costos-cnt-mayor5').textContent = lista.filter(t => _apCostosDiasTranscurridos(t.fecha) > 5).length;
    //     document.getElementById('ap-costos-badge-count').textContent = lista.length;
    // }


    // function _apCostosRenderTabla(lista) {
    //     const tbody = document.getElementById('ap-costos-tbody');
    //     const tableId = '#tabla-aprobaciones-costos';


    //     if (!lista.length) {
    //         tbody.innerHTML = `
    //         <tr><td colspan="11">
    //             <div class="ap-empty">
    //                 <div class="ap-empty-icon"><i class="fas fa-inbox"></i></div>
    //                 <div class="ap-empty-title">Sin solicitudes pendientes</div>
    //                 <div class="ap-empty-sub">No hay tarifas de costo que requieran aprobación.</div>
    //             </div>
    //         </td></tr>`;
    //         return;
    //     }

    //     tbody.innerHTML = lista.map((t, i) => {
    //         const origen = t.municipio_origen?.municipio ?? t.origen;
    //         const destino = t.municipio_destino?.municipio ?? t.destino;
    //         const dias = _apCostosDiasTranscurridos(t.fecha);

    //         const diasBadge = dias > 5
    //             ? `<span class="dias-badge urgente"><i class="fas fa-exclamation-triangle"></i> ${dias}d</span>`
    //             : dias > 2
    //                 ? `<span class="dias-badge atencion">${dias}d</span>`
    //                 : `<span class="dias-badge normal">${dias}d</span>`;

    //         const compsHTML = (t.componentes ?? [])
    //             .filter(c => c.requiere_aprobacion == 1)
    //             .map(c => `<span class="badge-tipo ${_apCostosClaseBadgeTipo(c.tipo)}">${_apCostosLabelTipo(c.tipo)}</span>`)
    //             .join('');

    //         const sem = t.vigencia_semaforo ?? {};
    //         const dotClass = sem.badge === 'bg-success' ? 'dot-verde' : sem.badge === 'bg-warning' ? 'dot-amarillo' : 'dot-rojo';

    //         return `
    //             <tr class="${dias > 5 ? 'ap-row-urgente' : 'ap-row-normal'}" data-id="${t.id}">
    //                 <td style="font-weight:700; color:var(--ap-gray);">${i + 1}</td>
    //                 <td>${_apCostosFormatFecha(t.fecha)}</td>
    //                 <td>${diasBadge}</td>
    //                 <td style="max-width:160px; overflow:hidden; text-overflow:ellipsis;">${origen}</td>
    //                 <td style="max-width:160px; overflow:hidden; text-overflow:ellipsis;">${destino}</td>
    //                 <td><span style="font-size:.78rem; font-weight:600;">${t.tipo_vehiculo ?? '—'}</span></td>
    //                 <td style="font-weight:700;">${_apCostosFormatCOP(t.tarifa ?? 0)}</td>
    //                 <td>${compsHTML || '<span style="color:var(--ap-gray); font-size:.78rem;">—</span>'}</td>
    //                 <td>
    //                     <span class="semaforo-dot ${dotClass}"></span>
    //                     <span style="font-size:.78rem;">${sem.label ?? '—'}</span>
    //                 </td>
    //                 <td style="font-size:.78rem; color:var(--ap-gray);">${t.usuario ?? '—'}</td>
    //                 <td>
    //                     <div style="display:flex; gap:6px; flex-wrap:wrap;">
    //                         <button class="btn-ap-ver" onclick="apCostosAbrirDetalle(${t.id})">
    //                             <i class="fas fa-eye"></i> Gestionar
    //                         </button>
    //                     </div>
    //                 </td>
    //             </tr>`;
    //     }).join('');

    //     setTimeout(() => inicializarDataTableCostos(tableId), 200);
    // }

    /* =========================================================
     | DATATABLE COSTOS
     | =========================================================*/
    // function inicializarDataTableCostos(id) {
    //     const $tabla = $(id);

    //     // 1. Destruir PRIMERO, antes de manipular el DOM
    //     if ($.fn.DataTable.isDataTable(id)) {
    //         $tabla.DataTable().destroy();
    //     }

    //     // 2. Limpiar fila de filtros anterior (puede haber quedado del ciclo previo)
    //     $tabla.find('thead tr.filters').remove();

    //     // 3. Ahora sí clonar el thead limpio para los filtros
    //     const $filterRow = $tabla.find('thead tr:first').clone(true).addClass('filters');
    //     $filterRow.appendTo($tabla.find('thead'));

    //     $tabla.DataTable({
    //         orderCellsTop: true,
    //         fixedHeader: true,
    //         destroy: true,
    //         // Importante: NO cachear datos entre reinicios
    //         retrieve: false,
    //         language: { url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
    //         initComplete: function () {
    //             const api = this.api();
    //             api.columns().eq(0).each(function (colIdx) {
    //                 const cell = $tabla.find('.filters th').get(colIdx);
    //                 if (!cell) return;
    //                 if (colIdx === 0) { $(cell).html(''); return; }
    //                 const title = $(api.column(colIdx).header()).text();
    //                 $(cell).html(`<input type="text" class="w-100" placeholder="${title}" style="font-size:11px;height:24px;">`);
    //                 $('input', cell).on('keyup change', function (e) {
    //                     e.stopPropagation();
    //                     if (api.column(colIdx).search() !== this.value) {
    //                         api.column(colIdx).search(this.value).draw();
    //                     }
    //                 });
    //             });
    //         }
    //     });
    // }

    /* =============================================================================
       RENDER TABLA
       ============================================================================= */
    function _apCostosRenderTabla(lista) {
        const tbody = document.getElementById("ap-costos-tbody");
        const tableId = "#tabla-aprobaciones-costos";

        // ✅ Destruir DataTable ANTES de modificar el DOM
        if ($.fn.DataTable.isDataTable(tableId)) {
            $(tableId).DataTable().destroy();
        }

        // ✅ Limpiar fila de filtros anterior
        $(tableId).find("thead tr.filters").remove();

        // ✅ Limpiar tbody explícitamente
        tbody.innerHTML = "";

        if (!lista.length) {
            tbody.innerHTML = `
            <tr><td colspan="11">
                <div class="ap-empty">
                    <div class="ap-empty-icon"><i class="fas fa-inbox"></i></div>
                    <div class="ap-empty-title">Sin solicitudes pendientes</div>
                    <div class="ap-empty-sub">No hay tarifas de costo que requieran aprobación.</div>
                </div>
            </td></tr>`;
            return;
        }

        tbody.innerHTML = lista.map((t, i) => {
            const fechaSol = t.fecha ? new Date(t.fecha + "T00:00:00") : null;
            const origen = t.municipio_origen?.municipio ?? t.origen;
            const destino = t.municipio_destino?.municipio ?? t.destino;
            const dias = _apCostosDiasTranscurridos(t.fecha);

            const fechaFmt = fechaSol
                ? fechaSol.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" })
                : "—";

            const diasBadge = dias > 5
                ? `<span class="dias-badge urgente"><i class="fas fa-exclamation-triangle"></i> ${dias}d</span>`
                : dias > 2
                    ? `<span class="dias-badge atencion">${dias}d</span>`
                    : `<span class="dias-badge normal">${dias}d</span>`;

            const compsHTML = (t.componentes ?? [])
                .filter(c => c.requiere_aprobacion == 1)
                .map(c => `<span class="badge-tipo ${_apCostosClaseBadgeTipo(c.tipo)}">${_apCostosLabelTipo(c.tipo)}</span>`)
                .join("");

            const sem = t.vigencia_semaforo ?? {};
            const dotClass = sem.badge === "bg-success" ? "dot-verde"
                : sem.badge === "bg-warning" ? "dot-amarillo"
                    : "dot-rojo";

            return `
            <tr class="${dias > 5 ? "ap-row-urgente" : "ap-row-normal"}" data-id="${t.id}">
                <td style="font-weight:700; color:var(--ap-gray);">${i + 1}</td>
                <td>${fechaFmt}</td>
                <td>${diasBadge}</td>
                <td style="max-width:160px; overflow:hidden; text-overflow:ellipsis;">${origen}</td>
                <td style="max-width:160px; overflow:hidden; text-overflow:ellipsis;">${destino}</td>
                <td><span style="font-size:.78rem; font-weight:600;">${t.tipo_vehiculo ?? "—"}</span></td>
                <td style="font-weight:700;">${_apCostosFormatCOP(t.tarifa ?? 0)}</td>
                <td>${compsHTML || '<span style="color:var(--ap-gray); font-size:.78rem;">—</span>'}</td>
                <td>
                    <span class="semaforo-dot ${dotClass}"></span>
                    <span style="font-size:.78rem;">${sem.label ?? "—"}</span>
                </td>
                <td style="font-size:.78rem; color:var(--ap-gray);">${t.usuario ?? "—"}</td>
                <td>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="btn-ap-ver" onclick="apCostosAbrirDetalle(${t.id})">
                            <i class="fas fa-eye"></i> Gestionar
                        </button>
                    </div>
                </td>
            </tr>`;
        }).join("");

        setTimeout(() => inicializarDataTableCostos(tableId), 100);
    }

    /* =========================================================
    | DATATABLE COSTOS
    | =========================================================*/
    function inicializarDataTableCostos(id) {
        const $tabla = $(id);

        // Ya fue destruido en _apCostosRenderTabla, pero por seguridad:
        if ($.fn.DataTable.isDataTable(id)) {
            $tabla.DataTable().destroy();
        }

        // La fila de filtros también ya fue limpiada, pero por seguridad:
        $tabla.find("thead tr.filters").remove();

        const $filterRow = $tabla.find("thead tr:first").clone(true).addClass("filters");
        $filterRow.appendTo($tabla.find("thead"));

        $tabla.DataTable({
            orderCellsTop: true,
            fixedHeader: true,
            destroy: true,
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
            },
            initComplete: function () {
                const api = this.api();
                api.columns().eq(0).each(function (colIdx) {
                    const cell = $tabla.find(".filters th").get(colIdx);
                    if (!cell) return;
                    if (colIdx === 0) { $(cell).html(""); return; }
                    const title = $(api.column(colIdx).header()).text();
                    $(cell).html(
                        `<input type="text" class="w-100" placeholder="${title}" style="font-size:11px;height:24px;">`
                    );
                    $("input", cell).on("keyup change", function (e) {
                        e.stopPropagation();
                        if (api.column(colIdx).search() !== this.value) {
                            api.column(colIdx).search(this.value).draw();
                        }
                    });
                });
            },
        });
    }

    /* =============================================================================
       ABRIR DETALLE (OFFCANVAS)
       ============================================================================= */
    // async function apCostosAbrirDetalle(tarifaId) {
    //     try {
    //         const resp = await _apCostosFetch(`${document.getElementById('base_url_api').value}tarifas-costos/${tarifaId}`);
    //         const result = await resp.json();

    //         if (!result.success) {
    //             apCostosFlash('error', 'Error', 'No se pudo cargar la tarifa.');
    //             return;
    //         }

    //         window._apCostos_tarifaActual = result.data;
    //         const t = window._apCostos_tarifaActual;

    //         const origen = t.municipio_origen?.municipio ?? t.origen;
    //         const destino = t.municipio_destino?.municipio ?? t.destino;
    //         document.getElementById('ap-costos-oc-title').textContent = 'Gestión de Aprobación — Costo';
    //         document.getElementById('ap-costos-oc-sub').textContent = `Tarifa #${t.id} · ${origen} → ${destino}`;

    //         _apCostosRenderInfoGrid(t);
    //         _apCostosRenderComponentes(t);
    //         CausalesAprobacion();

    //         document.getElementById('ap-costos-observacion').value = '';
    //         document.getElementById('ap-costos-causa-id').value = '';

    //         document.getElementById('ap-costos-offcanvas').classList.add('show');
    //         document.getElementById('ap-costos-backdrop').classList.add('show');

    //     } catch (err) {
    //         console.error(err);
    //         apCostosFlash('error', 'Error de conexión', err.message);
    //     }
    // }

    async function apCostosAbrirDetalle(tarifaId) {
        try {
            const resp = await _apCostosFetch(`${document.getElementById('base_url_api').value}tarifas-costos/${tarifaId}`);
            const result = await resp.json();

            if (!result.success) {
                apCostosFlash('error', 'Error', 'No se pudo cargar la tarifa.');
                return;
            }

            // ── Mergear tarifa_anterior dentro del objeto data ──────────
            const t = {
                ...result.data,
                tarifa_anterior: result.tarifa_anterior ?? null,
            };

            window._apCostos_tarifaActual = t;

            const origen = t.municipio_origen?.municipio ?? t.origen;
            const destino = t.municipio_destino?.municipio ?? t.destino;

            document.getElementById('ap-costos-oc-title').textContent = 'Gestión de Aprobación — Costo';
            document.getElementById('ap-costos-oc-sub').textContent = `Tarifa #${t.id} · ${origen} → ${destino}`;

            _apCostosRenderInfoGrid(t);
            _apCostosRenderComponentes(t);
            CausalesAprobacion();

            document.getElementById('ap-costos-observacion').value = '';
            document.getElementById('ap-costos-causa-id').value = '';

            document.getElementById('ap-costos-offcanvas').classList.add('show');
            document.getElementById('ap-costos-backdrop').classList.add('show');

        } catch (err) {
            console.error(err);
            apCostosFlash('error', 'Error de conexión', err.message);
        }
    }

    // async function apCostosAbrirDetalle(tarifaId) {
    //     try {
    //         // ── PRIMERO: buscar en el estado ya cargado (tiene valor_anterior) ──
    //         const tarifaCargada = (window._apCostos_state?.data ?? []).find(t => t.id === tarifaId);

    //         let t;

    //         if (tarifaCargada) {
    //             // Ya tenemos el objeto completo con valor_anterior desde la bandeja
    //             t = tarifaCargada;
    //         } else {
    //             // Fallback: fetch individual (cuando se abre directo sin bandeja)
    //             const resp = await _apCostosFetch(`${document.getElementById('base_url_api').value}tarifas-costos/${tarifaId}`);
    //             const result = await resp.json();

    //             if (!result.success) {
    //                 apCostosFlash('error', 'Error', 'No se pudo cargar la tarifa.');
    //                 return;
    //             }
    //             t = result.data;
    //         }

    //         window._apCostos_tarifaActual = t;

    //         const origen = t.municipio_origen?.municipio ?? t.origen;
    //         const destino = t.municipio_destino?.municipio ?? t.destino;

    //         document.getElementById('ap-costos-oc-title').textContent = 'Gestión de Aprobación — Costo';
    //         document.getElementById('ap-costos-oc-sub').textContent = `Tarifa #${t.id} · ${origen} → ${destino}`;

    //         _apCostosRenderInfoGrid(t);
    //         _apCostosRenderComponentes(t);
    //         CausalesAprobacion();

    //         document.getElementById('ap-costos-observacion').value = '';
    //         document.getElementById('ap-costos-causa-id').value = '';

    //         document.getElementById('ap-costos-offcanvas').classList.add('show');
    //         document.getElementById('ap-costos-backdrop').classList.add('show');

    //     } catch (err) {
    //         console.error(err);
    //         apCostosFlash('error', 'Error de conexión', err.message);
    //     }
    // }

    /* =============================================================================
       INFO GRID
       ============================================================================= */
    function _apCostosRenderInfoGrid(t) {
        const origen = t.municipio_origen?.municipio ?? t.origen;
        const destino = t.municipio_destino?.municipio ?? t.destino;
        const sem = t.vigencia_semaforo ?? {};
        const dotClass = sem.badge === 'bg-success' ? 'dot-verde' : sem.badge === 'bg-warning' ? 'dot-amarillo' : 'dot-rojo';

        document.getElementById('ap-costos-info-grid').innerHTML = `
        <div class="ap-info-item">
            <div class="ap-info-label">Origen</div>
            <div class="ap-info-value">${origen}</div>
        </div>
        <div class="ap-info-item">
            <div class="ap-info-label">Destino</div>
            <div class="ap-info-value">${destino}</div>
        </div>
        <div class="ap-info-item">
            <div class="ap-info-label">Tipo Vehículo</div>
            <div class="ap-info-value">${t.tipo_vehiculo ?? '—'}</div>
        </div>
        <div class="ap-info-item">
            <div class="ap-info-label">Tarifa Plena</div>
            <div class="ap-info-value" style="color:var(--ap-blue);">${_apCostosFormatCOP(t.tarifa)}</div>
        </div>
        <div class="ap-info-item">
            <div class="ap-info-label">Semana / Mes / Año</div>
            <div class="ap-info-value">S${t.semana} / M${t.mes} / ${t.vigencia}</div>
        </div>
        <div class="ap-info-item">
            <div class="ap-info-label">Vigencia</div>
            <div class="ap-info-value">
                <span class="semaforo-dot ${dotClass}"></span>${sem.label ?? '—'}
            </div>
        </div>
        <div class="ap-info-item">
            <div class="ap-info-label">Fecha solicitud</div>
            <div class="ap-info-value">${_apCostosFormatFecha(t.fecha)}</div>
        </div>
        <div class="ap-info-item">
            <div class="ap-info-label">Usuario</div>
            <div class="ap-info-value">${t.usuario ?? '—'}</div>
        </div>`;
    }

    /* =============================================================================
       RENDER COMPONENTES + SECCIÓN MULTI MUNICIPIO
       ============================================================================= */
    // function _apCostosRenderComponentes(tarifa) {
    //     const componentes = tarifa.componentes ?? [];
    //     const tbody = document.getElementById('ap-costos-comp-tbody');
    //     const multiContainer = document.getElementById('ap-costos-detalle-multi');

    //     let rows = '';
    //     let multiHtml = '';

    //     componentes.forEach(c => {
    //         const esTipoMultiMunicipio = ['MULTI_ORIGEN', 'MULTI_DESTINO'].includes(c.tipo);
    //         const pendiente = c.requiere_aprobacion == 1;
    //         const tieneDetalles = esTipoMultiMunicipio && (c.detalles?.length > 0);

    //         const varClass = parseFloat(c.variacion_pct) > 30 ? 'badge-variacion-alta' : 'badge-variacion-normal';
    //         const varIcon = parseFloat(c.variacion_pct) > 30 ? 'fa-arrow-up' : 'fa-arrow-right';
    //         const estadoBadge = pendiente
    //             ? `<span class="badge-pendiente">Pendiente</span>`
    //             : `<span class="badge-aprobado"><i class="fas fa-check me-1"></i>OK</span>`;

    //         const inputAjuste = pendiente
    //             ? `<div style="display:flex; align-items:center; gap:4px;">
    //                <span style="font-size:.78rem; color:var(--ap-gray);">$</span>
    //                <input type="text"
    //                       class="ap-valor-input"
    //                       id="inp-comp-${c.id}"
    //                       data-comp-id="${c.id}"
    //                       data-original="${c.valor}"
    //                       placeholder="${_apCostosFormatCOP(c.valor)}"
    //                       ${tieneDetalles ? 'disabled title="Ajustar por detalle abajo"' : ''}
    //                       onchange="apCostosCurrencyMask(this)">
    //            </div>`
    //             : `<span style="color:var(--ap-gray); font-size:0.78rem;">—</span>`;

    //         const btnComp = pendiente
    //             ? `<button class="btn-ap-aprobar" style="padding:4px 10px;"
    //                    onclick="apCostosAprobarComponente(${c.id})">
    //                <i class="fas fa-check"></i>
    //            </button>`
    //             : `<span style="color:var(--ap-gray); font-size:0.72rem;">—</span>`;

    //         if (!esTipoMultiMunicipio) {
    //             rows += `
    //         <tr class="${pendiente ? 'comp-pendiente' : ''}" id="comp-row-${c.id}">
    //             <td><span class="badge-tipo ${_apCostosClaseBadgeTipo(c.tipo)}">${_apCostosLabelTipo(c.tipo)}</span></td>
    //             <td style="font-weight:700;">${_apCostosFormatCOP(c.valor)}</td>
    //             <td><span class="${varClass}"><i class="fas ${varIcon}"></i> ${_apCostosNum(c.variacion_pct)}%</span></td>
    //             <td>${estadoBadge}</td>
    //             <td>${inputAjuste}</td>
    //             <td>${btnComp}</td>
    //         </tr>`;
    //         }

    //         // ── Sección editable de municipios ──
    //         if (tieneDetalles) {
    //             const tipoLabel = c.tipo_label || _apCostosLabelTipo(c.tipo);
    //             const detalleRows = c.detalles.map((d, di) => {
    //                 const detId = d.id || `new-${c.id}-${di}`;

    //                 const munNom = d.municipio?.municipio
    //                     || d.municipio_nombre
    //                     || d.nombre_municipio
    //                     || d.municipio
    //                     || d.municipio_id
    //                     || '—';

    //                 if (pendiente) {
    //                     return `
    //                 <tr class="ap-mun-row" data-det-id="${detId}" data-comp-id="${c.id}">
    //                     <td class="ap-mun-nombre">
    //                         <i class="fas fa-map-marker-alt" style="color:var(--ap-blue); margin-right:6px;"></i>
    //                         ${munNom}
    //                     </td>
    //                     <td>
    //                         <input type="number" class="ap-mun-input"
    //                             id="mun-r1-${detId}" data-det-id="${detId}" data-field="rate_1"
    //                             value="${parseFloat(d.rate_1 || 0).toFixed(2)}"
    //                             step="0.01" min="0"
    //                             oninput="apCostosActualizarTotalMunicipio('${detId}')"
    //                             placeholder="1ra tarifa" />
    //                     </td>
    //                     <td>
    //                         <input type="number" class="ap-mun-input"
    //                             id="mun-r2-${detId}" data-det-id="${detId}" data-field="rate_2"
    //                             value="${parseFloat(d.rate_2 || 0).toFixed(2)}"
    //                             step="0.01" min="0"
    //                             oninput="apCostosActualizarTotalMunicipio('${detId}')"
    //                             placeholder="2da tarifa" />
    //                     </td>
    //                     <td>
    //                         <button class="ap-mun-btn-reset" title="Restaurar valores originales"
    //                             onclick="apCostosRestaurarMunicipio('${detId}', ${parseFloat(d.rate_1 || 0).toFixed(2)}, ${parseFloat(d.rate_2 || 0).toFixed(2)})">
    //                             <i class="fas fa-undo"></i>
    //                         </button>
    //                     </td>
    //                 </tr>`;
    //                 } else {
    //                     return `
    //                 <tr>
    //                     <td style="padding-left:8px;">
    //                         <i class="fas fa-map-marker-alt" style="color:var(--ap-blue); margin-right:6px;"></i>
    //                         ${munNom}
    //                     </td>
    //                     <td style="color:var(--ap-gray);">${_apCostosFormatCOP(d.rate_1)} <small>(1ra)</small></td>
    //                     <td style="color:var(--ap-gray);">${_apCostosFormatCOP(d.rate_2)} <small>(2da)</small></td>
    //                     <td>—</td>
    //                 </tr>`;
    //                 }
    //             }).join('');

    //             const headerEdicion = pendiente
    //                 ? `<span class="ap-mun-edit-badge"><i class="fas fa-pencil-alt me-1"></i>Editable · Ajusta rate_1 y rate_2 por municipio</span>`
    //                 : `<span style="font-size:0.7rem; color:var(--ap-green);"><i class="fas fa-check me-1"></i>Aprobado</span>`;

    //             const guardarBtn = pendiente
    //                 ? `<button class="ap-mun-btn-guardar" onclick="apCostosGuardarDetallesMunicipio(${c.id})">
    //                    <i class="fas fa-save me-1"></i>Guardar cambios de municipios
    //                </button>`
    //                 : '';

    //             multiHtml += `
    //         <div class="ap-mun-card" id="ap-mun-card-${c.id}">
    //             <div class="ap-mun-card-header">
    //                 <span><i class="fas fa-route me-2"></i>${tipoLabel} — Detalle por municipio</span>
    //                 ${headerEdicion}
    //             </div>
    //             <div style="overflow-x:auto;">
    //                 <table class="ap-mun-table">
    //                     <thead>
    //                         <tr>
    //                             <th style="text-align:left; min-width:180px;">Municipio</th>
    //                             <th style="min-width:130px;">1ra Tarifa</th>
    //                             <th style="min-width:130px;">2da Tarifa</th>
    //                             <th style="width:44px;"></th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>${detalleRows}</tbody>
    //                 </table>
    //             </div>
    //             ${guardarBtn}
    //         </div>`;
    //         }
    //     });

    //     tbody.innerHTML = rows || `<tr><td colspan="6" style="text-align:center; color:var(--ap-gray); padding:20px;">No hay componentes pendientes.</td></tr>`;

    //     if (multiHtml) {
    //         multiContainer.innerHTML = `
    //         <div style="font-size:0.8rem; font-weight:700; color:var(--ap-blue); margin-bottom:10px;">
    //             <i class="fas fa-map-marked-alt"></i> Detalle por municipio (Multi Origen / Multi Destino)
    //         </div>
    //         ${multiHtml}`;
    //         multiContainer.style.display = 'block';
    //     } else {
    //         multiContainer.style.display = 'none';
    //         multiContainer.innerHTML = '';
    //     }
    // }

    // function _apCostosRenderComponentes(tarifa) {
    //     console.log('🔍 tarifa.tarifa_anterior:', tarifa.tarifa_anterior);
    //     console.log('🔍 primer componente:', tarifa.componentes?.[0]);

    //     const componentes = tarifa.componentes ?? [];
    //     const tbody = document.getElementById('ap-costos-comp-tbody');
    //     const multiContainer = document.getElementById('ap-costos-detalle-multi');

    //     // ── Indexar componentes anteriores por tipo ──────────────────
    //     const compAntPorTipo = {};
    //     if (tarifa.tarifa_anterior?.componentes) {
    //         tarifa.tarifa_anterior.componentes.forEach(c => {
    //             compAntPorTipo[c.tipo] = c;
    //         });
    //     }

    //     let rows = '';
    //     let multiHtml = '';

    //     componentes.forEach(c => {
    //         const esTipoMultiMunicipio = ['MULTI_ORIGEN', 'MULTI_DESTINO'].includes(c.tipo);
    //         const pendiente = c.requiere_aprobacion == 1;
    //         const tieneDetalles = esTipoMultiMunicipio && (c.detalles?.length > 0);

    //         const varClass = parseFloat(c.variacion_pct) > 30 ? 'badge-variacion-alta' : 'badge-variacion-normal';
    //         const varIcon = parseFloat(c.variacion_pct) > 30 ? 'fa-arrow-up' : 'fa-arrow-right';

    //         const estadoBadge = pendiente
    //             ? `<span class="badge-pendiente">Pendiente</span>`
    //             : `<span class="badge-aprobado"><i class="fas fa-check me-1"></i>OK</span>`;

    //         // ── Valor anterior ─────────────────────────────────────── ${varAntHtml}
    //         console.log("🚀 ~ _apCostosRenderComponentes ~ c.valor_anterior:", c.valor_anterior)
    //         const valorAntRaw = c.valor_anterior
    //             ?? compAntPorTipo[c.tipo]?.valor
    //             ?? null;
    //         console.log("🚀 ~ _apCostosRenderComponentes ~ valorAntRaw:", valorAntRaw)

    //         const valorAntFmt = valorAntRaw !== null
    //             ? _apCostosFormatCOP(valorAntRaw)
    //             : '<span style="color:var(--ap-gray); font-size:0.75rem;">Sin historial</span>';
    //         console.log("🚀 ~ _apCostosRenderComponentes ~ valorAntFmt:", valorAntFmt)

    //         // Flecha de variación real
    //         const varReal = c.variacion_pct_real ?? null;
    //         let varAntHtml = '';
    //         if (varReal !== null && valorAntRaw !== null) {
    //             const sign = varReal >= 0 ? '+' : '';
    //             const color = varReal > 0 ? 'var(--ap-orange)' : varReal < 0 ? 'var(--ap-green)' : 'var(--ap-gray)';
    //             const arrow = varReal > 0 ? '▲' : varReal < 0 ? '▼' : '▬';
    //             varAntHtml = `<div style="font-size:0.7rem; color:${color}; margin-top:2px;">
    //                            ${arrow} ${sign}${varReal.toFixed(1)}% vs anterior
    //                        </div>`;
    //         }

    //         const inputAjuste = pendiente
    //             ? `<div style="display:flex; align-items:center; gap:4px;">
    //                <span style="font-size:.78rem; color:var(--ap-gray);">$</span>
    //                <input type="text"
    //                       class="ap-valor-input"
    //                       id="inp-comp-${c.id}"
    //                       data-comp-id="${c.id}"
    //                       data-original="${c.valor}"
    //                       placeholder="${_apCostosFormatCOP(c.valor)}"
    //                       ${tieneDetalles ? 'disabled title="Ajustar por detalle abajo"' : ''}
    //                       onchange="apCostosCurrencyMask(this)">
    //            </div>`
    //             : `<span style="color:var(--ap-gray); font-size:0.78rem;">—</span>`;

    //         const btnComp = pendiente
    //             ? `<button class="btn-ap-aprobar" style="padding:4px 10px;"
    //                    onclick="apCostosAprobarComponente(${c.id})">
    //                <i class="fas fa-check"></i>
    //            </button>`
    //             : `<span style="color:var(--ap-gray); font-size:0.72rem;">—</span>`;

    //         if (!esTipoMultiMunicipio) {
    //             rows += `
    //         <tr class="${pendiente ? 'comp-pendiente' : ''}" id="comp-row-${c.id}">
    //             <td>
    //                 <span class="badge-tipo ${_apCostosClaseBadgeTipo(c.tipo)}">
    //                     ${_apCostosLabelTipo(c.tipo)}
    //                 </span>
    //             </td>

    //             <!-- Valor anterior + flecha variación -->
    //             <td>
    //                 <div style="font-weight:600;">${valorAntFmt}</div>

    //             </td>

    //             <!-- Valor nuevo (pendiente) -->
    //             <td style="font-weight:700;">${_apCostosFormatCOP(c.valor)}</td>

    //             <!-- Variación guardada en BD -->
    //             <td>
    //                 <span class="${varClass}">
    //                     <i class="fas ${varIcon}"></i> ${_apCostosNum(c.variacion_pct)}%
    //                 </span>
    //             </td>

    //             <!-- Tarifa Mercado -->
    //             <td>
    //                 <input type="number"
    //                        class="ap-valor-input ap-input-mercado"
    //                        id="costos-mercado-${c.id}"
    //                        data-comp-id="${c.id}"
    //                        placeholder="$ Mercado"
    //                        step="0.01" min="0"
    //                        style="width:100%; min-width:100px;" />
    //             </td>

    //             <!-- Tarifa Sicetat -->
    //             <td>
    //                 <input type="number"
    //                        class="ap-valor-input ap-input-sicetat"
    //                        id="costos-sicetat-${c.id}"
    //                        data-comp-id="${c.id}"
    //                        placeholder="$ Sicetat"
    //                        step="0.01" min="0"
    //                        style="width:100%; min-width:100px;" />
    //             </td>

    //             <td>${estadoBadge}</td>
    //             <td>${inputAjuste}</td>
    //             <td>${btnComp}</td>
    //         </tr>`;
    //         }

    //         // ── Sección editable de municipios (sin cambios) ─────────
    //         if (tieneDetalles) {
    //             const tipoLabel = c.tipo_label || _apCostosLabelTipo(c.tipo);
    //             const detalleRows = c.detalles.map((d, di) => {
    //                 const detId = d.id || `new-${c.id}-${di}`;
    //                 const munNom = d.municipio?.municipio || d.municipio_nombre
    //                     || d.nombre_municipio || d.municipio
    //                     || d.municipio_id || '—';

    //                 if (pendiente) {
    //                     return `
    //                 <tr class="ap-mun-row" data-det-id="${detId}" data-comp-id="${c.id}">
    //                     <td class="ap-mun-nombre">
    //                         <i class="fas fa-map-marker-alt" style="color:var(--ap-blue); margin-right:6px;"></i>
    //                         ${munNom}
    //                     </td>
    //                     <td>
    //                         <input type="number" class="ap-mun-input"
    //                             id="mun-r1-${detId}" data-det-id="${detId}" data-field="rate_1"
    //                             value="${parseFloat(d.rate_1 || 0).toFixed(2)}"
    //                             step="0.01" min="0"
    //                             oninput="apCostosActualizarTotalMunicipio('${detId}')"
    //                             placeholder="1ra tarifa" />
    //                     </td>
    //                     <td>
    //                         <input type="number" class="ap-mun-input"
    //                             id="mun-r2-${detId}" data-det-id="${detId}" data-field="rate_2"
    //                             value="${parseFloat(d.rate_2 || 0).toFixed(2)}"
    //                             step="0.01" min="0"
    //                             oninput="apCostosActualizarTotalMunicipio('${detId}')"
    //                             placeholder="2da tarifa" />
    //                     </td>
    //                     <td>
    //                         <button class="ap-mun-btn-reset" title="Restaurar valores originales"
    //                             onclick="apCostosRestaurarMunicipio('${detId}', ${parseFloat(d.rate_1 || 0).toFixed(2)}, ${parseFloat(d.rate_2 || 0).toFixed(2)})">
    //                             <i class="fas fa-undo"></i>
    //                         </button>
    //                     </td>
    //                 </tr>`;
    //                 } else {
    //                     return `
    //                 <tr>
    //                     <td style="padding-left:8px;">
    //                         <i class="fas fa-map-marker-alt" style="color:var(--ap-blue); margin-right:6px;"></i>
    //                         ${munNom}
    //                     </td>
    //                     <td style="color:var(--ap-gray);">${_apCostosFormatCOP(d.rate_1)} <small>(1ra)</small></td>
    //                     <td style="color:var(--ap-gray);">${_apCostosFormatCOP(d.rate_2)} <small>(2da)</small></td>
    //                     <td>—</td>
    //                 </tr>`;
    //                 }
    //             }).join('');

    //             const headerEdicion = pendiente
    //                 ? `<span class="ap-mun-edit-badge"><i class="fas fa-pencil-alt me-1"></i>Editable · Ajusta rate_1 y rate_2 por municipio</span>`
    //                 : `<span style="font-size:0.7rem; color:var(--ap-green);"><i class="fas fa-check me-1"></i>Aprobado</span>`;

    //             const guardarBtn = pendiente
    //                 ? `<button class="ap-mun-btn-guardar" onclick="apCostosGuardarDetallesMunicipio(${c.id})">
    //                    <i class="fas fa-save me-1"></i>Guardar cambios de municipios
    //                </button>`
    //                 : '';

    //             multiHtml += `
    //         <div class="ap-mun-card" id="ap-mun-card-${c.id}">
    //             <div class="ap-mun-card-header">
    //                 <span><i class="fas fa-route me-2"></i>${tipoLabel} — Detalle por municipio</span>
    //                 ${headerEdicion}
    //             </div>
    //             <div style="overflow-x:auto;">
    //                 <table class="ap-mun-table">
    //                     <thead>
    //                         <tr>
    //                             <th style="text-align:left; min-width:180px;">Municipio</th>
    //                             <th style="min-width:130px;">1ra Tarifa</th>
    //                             <th style="min-width:130px;">2da Tarifa</th>
    //                             <th style="width:44px;"></th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>${detalleRows}</tbody>
    //                 </table>
    //             </div>
    //             ${guardarBtn}
    //         </div>`;
    //         }
    //     });

    //     tbody.innerHTML = rows || `
    //     <tr>
    //         <td colspan="9" style="text-align:center; color:var(--ap-gray); padding:20px;">
    //             No hay componentes pendientes.
    //         </td>
    //     </tr>`;

    //     if (multiHtml) {
    //         multiContainer.innerHTML = `
    //         <div style="font-size:0.8rem; font-weight:700; color:var(--ap-blue); margin-bottom:10px;">
    //             <i class="fas fa-map-marked-alt"></i> Detalle por municipio (Multi Origen / Multi Destino)
    //         </div>
    //         ${multiHtml}`;
    //         multiContainer.style.display = 'block';
    //     } else {
    //         multiContainer.style.display = 'none';
    //         multiContainer.innerHTML = '';
    //     }
    // }

    // function _apCostosRenderComponentes(tarifa) {
    //     const componentes = tarifa.componentes ?? [];
    //     const tbody = document.getElementById('ap-costos-comp-tbody');
    //     const multiContainer = document.getElementById('ap-costos-detalle-multi');

    //     // ── Indexar componentes anteriores por tipo ──────────────────
    //     const compAntPorTipo = {};
    //     if (tarifa.tarifa_anterior?.componentes) {
    //         tarifa.tarifa_anterior.componentes.forEach(c => {
    //             compAntPorTipo[c.tipo] = c;
    //         });
    //     }

    //     let rows = '';
    //     let multiHtml = '';

    //     componentes.forEach(c => {
    //         const esTipoMultiMunicipio = ['MULTI_ORIGEN', 'MULTI_DESTINO'].includes(c.tipo);
    //         const pendiente = c.requiere_aprobacion == 1;
    //         const tieneDetalles = esTipoMultiMunicipio && (c.detalles?.length > 0);

    //         const varClass = parseFloat(c.variacion_pct) > 30 ? 'badge-variacion-alta' : 'badge-variacion-normal';
    //         const varIcon = parseFloat(c.variacion_pct) > 30 ? 'fa-arrow-up' : 'fa-arrow-right';

    //         const estadoBadge = pendiente
    //             ? `<span class="badge-pendiente">Pendiente</span>`
    //             : `<span class="badge-aprobado"><i class="fas fa-check me-1"></i>OK</span>`;

    //         // ── Valor anterior ───────────────────────────────────────
    //         const valorAntRaw = c.valor_anterior ?? compAntPorTipo[c.tipo]?.valor ?? null;

    //         const valorAntFmt = valorAntRaw !== null
    //             ? _apCostosFormatCOP(valorAntRaw)
    //             : '<span style="color:var(--ap-gray); font-size:0.75rem;">Sin historial</span>';

    //         // Flecha de variación real
    //         const varReal = c.variacion_pct_real ?? null;
    //         let varAntHtml = '';
    //         if (varReal !== null && valorAntRaw !== null) {
    //             const sign = varReal >= 0 ? '+' : '';
    //             const color = varReal > 0 ? 'var(--ap-orange)' : varReal < 0 ? 'var(--ap-green)' : 'var(--ap-gray)';
    //             const arrow = varReal > 0 ? '▲' : varReal < 0 ? '▼' : '▬';
    //             varAntHtml = `<div style="font-size:0.7rem; color:${color}; margin-top:2px;">
    //                            ${arrow} ${sign}${varReal.toFixed(1)}% vs anterior
    //                        </div>`;
    //         }

    //         const inputAjuste = pendiente
    //             ? `<div style="display:flex; align-items:center; gap:4px;">
    //                <span style="font-size:.78rem; color:var(--ap-gray);">$</span>
    //                <input type="text"
    //                       class="ap-valor-input"
    //                       id="inp-comp-${c.id}"
    //                       data-comp-id="${c.id}"
    //                       data-original="${c.valor}"
    //                       placeholder="${_apCostosFormatCOP(c.valor)}"
    //                       ${tieneDetalles ? 'disabled title="Ajustar por detalle abajo"' : ''}
    //                       onchange="apCostosCurrencyMask(this)">
    //            </div>`
    //             : `<span style="color:var(--ap-gray); font-size:0.78rem;">—</span>`;

    //         const btnComp = pendiente
    //             ? `<button class="btn-ap-aprobar" style="padding:4px 10px;"
    //                onclick="apCostosAprobarComponente(${c.id})">
    //            <i class="fas fa-check"></i>
    //            </button>`
    //             : `<span style="color:var(--ap-gray); font-size:0.72rem;">—</span>`;

    //         // ── Tabla principal (solo NO multi municipio) ────────────
    //         if (!esTipoMultiMunicipio) {
    //             rows += `
    //         <tr class="${pendiente ? 'comp-pendiente' : ''}" id="comp-row-${c.id}">
    //             <td>
    //                 <span class="badge-tipo ${_apCostosClaseBadgeTipo(c.tipo)}">
    //                     ${_apCostosLabelTipo(c.tipo)}
    //                 </span>
    //             </td>
    //             <td>
    //                 <div style="font-weight:600;">${valorAntFmt}</div>
    //                 ${varAntHtml}
    //             </td>
    //             <td style="font-weight:700;">${_apCostosFormatCOP(c.valor)}</td>
    //             <td>
    //                 <span class="${varClass}">
    //                     <i class="fas ${varIcon}"></i> ${_apCostosNum(c.variacion_pct)}%
    //                 </span>
    //             </td>
    //             <td>
    //                 <input type="number"
    //                        class="ap-valor-input ap-input-mercado"
    //                        id="costos-mercado-${c.id}"
    //                        data-comp-id="${c.id}"
    //                        placeholder="$ Mercado"
    //                        step="0.01" min="0"
    //                        style="width:100%; min-width:100px;" />
    //             </td>
    //             <td>
    //                 <input type="number"
    //                        class="ap-valor-input ap-input-sicetat"
    //                        id="costos-sicetat-${c.id}"
    //                        data-comp-id="${c.id}"
    //                        placeholder="$ Sicetat"
    //                        step="0.01" min="0"
    //                        style="width:100%; min-width:100px;" />
    //             </td>
    //             <td>${estadoBadge}</td>
    //             <td>${inputAjuste}</td>
    //             <td>${btnComp}</td>
    //         </tr>`;
    //         }

    //         // ── Card de municipios (MULTI_ORIGEN / MULTI_DESTINO) ────
    //         if (tieneDetalles) {
    //             const tipoLabel = c.tipo_label || _apCostosLabelTipo(c.tipo);

    //             // ── FIX 2: Resumen valor anterior/nuevo del componente multi ──
    //             const valorAntMultiRaw = c.valor_anterior ?? compAntPorTipo[c.tipo]?.valor ?? null;
    //             const varRealMulti = c.variacion_pct_real ?? null;

    //             let resumenAnteriorHtml = '';
    //             if (valorAntMultiRaw !== null) {
    //                 let varMultiHtml = '';
    //                 if (varRealMulti !== null) {
    //                     const sign = varRealMulti >= 0 ? '+' : '';
    //                     const color = varRealMulti > 0
    //                         ? 'var(--ap-orange)'
    //                         : varRealMulti < 0
    //                             ? 'var(--ap-green)'
    //                             : 'var(--ap-gray)';
    //                     const arrow = varRealMulti > 0 ? '▲' : varRealMulti < 0 ? '▼' : '▬';
    //                     varMultiHtml = `
    //                     <span style="color:${color}; font-weight:600;">
    //                         ${arrow} ${sign}${varRealMulti.toFixed(1)}% vs anterior
    //                     </span>`;
    //                 }

    //                 resumenAnteriorHtml = `
    //                 <div style="display:flex; flex-wrap:wrap; gap:20px; align-items:center;
    //                             padding:7px 14px; background:#f8fafc;
    //                             border-bottom:1px solid #e5e7eb; font-size:0.75rem;">
    //                     <span>
    //                         <span style="color:var(--ap-gray);">Valor anterior:</span>
    //                         <strong style="margin-left:4px; color:var(--ap-navy);">
    //                             ${_apCostosFormatCOP(valorAntMultiRaw)}
    //                         </strong>
    //                     </span>
    //                     <span>
    //                         <span style="color:var(--ap-gray);">Valor nuevo:</span>
    //                         <strong style="margin-left:4px; color:var(--ap-navy);">
    //                             ${_apCostosFormatCOP(c.valor)}
    //                         </strong>
    //                     </span>
    //                     ${varMultiHtml}
    //                 </div>`;
    //             }

    //             const detalleRows = c.detalles.map((d, di) => {
    //                 const detId = d.id || `new-${c.id}-${di}`;
    //                 const munNom = d.municipio?.municipio || d.municipio_nombre
    //                     || d.nombre_municipio || d.municipio
    //                     || d.municipio_id || '—';

    //                 if (pendiente) {
    //                     return `
    //                 <tr class="ap-mun-row" data-det-id="${detId}" data-comp-id="${c.id}">
    //                     <td class="ap-mun-nombre">
    //                         <i class="fas fa-map-marker-alt" style="color:var(--ap-blue); margin-right:6px;"></i>
    //                         ${munNom}
    //                     </td>
    //                     <td>
    //                         <input type="number" class="ap-mun-input"
    //                             id="mun-r1-${detId}" data-det-id="${detId}" data-field="rate_1"
    //                             value="${parseFloat(d.rate_1 || 0).toFixed(2)}"
    //                             step="0.01" min="0"
    //                             oninput="apCostosActualizarTotalMunicipio('${detId}')"
    //                             placeholder="1ra tarifa" />
    //                     </td>
    //                     <td>
    //                         <input type="number" class="ap-mun-input"
    //                             id="mun-r2-${detId}" data-det-id="${detId}" data-field="rate_2"
    //                             value="${parseFloat(d.rate_2 || 0).toFixed(2)}"
    //                             step="0.01" min="0"
    //                             oninput="apCostosActualizarTotalMunicipio('${detId}')"
    //                             placeholder="2da tarifa" />
    //                     </td>
    //                     <td>
    //                         <button class="ap-mun-btn-reset" title="Restaurar valores originales"
    //                             onclick="apCostosRestaurarMunicipio('${detId}', ${parseFloat(d.rate_1 || 0).toFixed(2)}, ${parseFloat(d.rate_2 || 0).toFixed(2)})">
    //                             <i class="fas fa-undo"></i>
    //                         </button>
    //                     </td>
    //                 </tr>`;
    //                 } else {
    //                     return `
    //                 <tr>
    //                     <td style="padding-left:8px;">
    //                         <i class="fas fa-map-marker-alt" style="color:var(--ap-blue); margin-right:6px;"></i>
    //                         ${munNom}
    //                     </td>
    //                     <td style="color:var(--ap-gray);">${_apCostosFormatCOP(d.rate_1)} <small>(1ra)</small></td>
    //                     <td style="color:var(--ap-gray);">${_apCostosFormatCOP(d.rate_2)} <small>(2da)</small></td>
    //                     <td>—</td>
    //                 </tr>`;
    //                 }
    //             }).join('');

    //             const headerEdicion = pendiente
    //                 ? `<span class="ap-mun-edit-badge"><i class="fas fa-pencil-alt me-1"></i>Editable · Ajusta rate_1 y rate_2 por municipio</span>`
    //                 : `<span style="font-size:0.7rem; color:var(--ap-green);"><i class="fas fa-check me-1"></i>Aprobado</span>`;

    //             const guardarBtn = pendiente
    //                 ? `<button class="ap-mun-btn-guardar" onclick="apCostosGuardarDetallesMunicipio(${c.id})">
    //                    <i class="fas fa-save me-1"></i>Guardar cambios de municipios
    //                </button>`
    //                 : '';

    //             multiHtml += `
    //         <div class="ap-mun-card" id="ap-mun-card-${c.id}">
    //             <div class="ap-mun-card-header">
    //                 <span><i class="fas fa-route me-2"></i>${tipoLabel} — Detalle por municipio</span>
    //                 ${headerEdicion}
    //             </div>

    //             ${resumenAnteriorHtml}

    //             <div style="overflow-x:auto;">
    //                 <table class="ap-mun-table">
    //                     <thead>
    //                         <tr>
    //                             <th style="text-align:left; min-width:180px;">Municipio</th>
    //                             <th style="min-width:130px;">1ra Tarifa</th>
    //                             <th style="min-width:130px;">2da Tarifa</th>
    //                             <th style="width:44px;"></th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>${detalleRows}</tbody>
    //                 </table>
    //             </div>
    //             ${guardarBtn}
    //         </div>`;
    //         }
    //     });

    //     tbody.innerHTML = rows || `
    //     <tr>
    //         <td colspan="9" style="text-align:center; color:var(--ap-gray); padding:20px;">
    //             No hay componentes pendientes.
    //         </td>
    //     </tr>`;

    //     if (multiHtml) {
    //         multiContainer.innerHTML = `
    //         <div style="font-size:0.8rem; font-weight:700; color:var(--ap-blue); margin-bottom:10px;">
    //             <i class="fas fa-map-marked-alt"></i> Detalle por municipio (Multi Origen / Multi Destino)
    //         </div>
    //         ${multiHtml}`;
    //         multiContainer.style.display = 'block';
    //     } else {
    //         multiContainer.style.display = 'none';
    //         multiContainer.innerHTML = '';
    //     }
    // }

    function _apCostosRenderComponentes(tarifa) {
        const componentes = tarifa.componentes ?? [];
        const tbody = document.getElementById('ap-costos-comp-tbody');
        const multiContainer = document.getElementById('ap-costos-detalle-multi');

        // ── Indexar componentes anteriores por tipo ──────────────────
        const compAntPorTipo = {};
        if (tarifa.tarifa_anterior?.componentes) {
            tarifa.tarifa_anterior.componentes.forEach(c => {
                compAntPorTipo[c.tipo] = c;
            });
        }

        let rows = '';
        let multiHtml = '';

        componentes.forEach(c => {
            const esTipoMultiMunicipio = ['MULTI_ORIGEN', 'MULTI_DESTINO'].includes(c.tipo);
            // ── Solo PLENA muestra Sicetat, el resto muestra — ──
            const esTipoPlena = c.tipo === 'PLENA';

            const pendiente = c.requiere_aprobacion == 1;
            const tieneDetalles = esTipoMultiMunicipio && (c.detalles?.length > 0);

            const varClass = parseFloat(c.variacion_pct) > 30 ? 'badge-variacion-alta' : 'badge-variacion-normal';
            const varIcon = parseFloat(c.variacion_pct) > 30 ? 'fa-arrow-up' : 'fa-arrow-right';

            const estadoBadge = pendiente
                ? `<span class="badge-pendiente">Pendiente</span>`
                : `<span class="badge-aprobado"><i class="fas fa-check me-1"></i>OK</span>`;

            // ── Valor anterior ───────────────────────────────────────
            const valorAntRaw = c.valor_anterior ?? compAntPorTipo[c.tipo]?.valor ?? null;

            const valorAntFmt = valorAntRaw !== null
                ? _apCostosFormatCOP(valorAntRaw)
                : '<span style="color:var(--ap-gray); font-size:0.75rem;">Sin historial</span>';

            const varReal = c.variacion_pct_real ?? null;
            let varAntHtml = '';
            if (varReal !== null && valorAntRaw !== null) {
                const sign = varReal >= 0 ? '+' : '';
                const color = varReal > 0 ? 'var(--ap-orange)' : varReal < 0 ? 'var(--ap-green)' : 'var(--ap-gray)';
                const arrow = varReal > 0 ? '▲' : varReal < 0 ? '▼' : '▬';
                varAntHtml = `<div style="font-size:0.7rem; color:${color}; margin-top:2px;">
                               ${arrow} ${sign}${varReal.toFixed(1)}% vs anterior
                           </div>`;
            }

            const inputAjuste = pendiente
                ? `<div style="display:flex; align-items:center; gap:4px;">
                   <span style="font-size:.78rem; color:var(--ap-gray);">$</span>
                   <input type="text" class="ap-valor-input" id="inp-comp-${c.id}" data-comp-id="${c.id}" data-original="${c.valor}" placeholder="${_apCostosFormatCOP(c.valor)}"
                          ${tieneDetalles ? 'disabled title="Ajustar por detalle abajo"' : ''} onchange="apCostosCurrencyMask(this)">
               </div>`
                : `<span style="color:var(--ap-gray); font-size:0.78rem;">—</span>`;

            const btnComp = pendiente
                ? `<button class="btn-ap-aprobar" style="padding:4px 10px;" onclick="apCostosAprobarComponente(${c.id})">
                    <i class="fas fa-check"></i>
                   </button>`
                : `<span style="color:var(--ap-gray); font-size:0.72rem;">—</span>`;

            // ── Tabla principal (solo NO multi municipio) ──────────── ${varAntHtml}
            if (!esTipoMultiMunicipio) {
                rows += `
                <tr class="${pendiente ? 'comp-pendiente' : ''}" id="comp-row-${c.id}">
                    <td style='width:auto; white-space: nowrap;'>
                        <span class="badge-tipo ${_apCostosClaseBadgeTipo(c.tipo)}">
                            ${_apCostosLabelTipo(c.tipo)}
                        </span>
                    </td>
                    <td style='width:auto; white-space: nowrap;'>
                        <div style="font-weight:600;">${valorAntFmt}</div>
                    </td>
                    <td style="font-weight:700;">${_apCostosFormatCOP(c.valor)}</td>
                    <td style='width:auto; white-space: nowrap;'>
                        <span class="${varClass}">
                            <i class="fas ${varIcon}"></i> ${_apCostosNum(c.variacion_pct)}%
                        </span>
                    </td>
                    <td style='width:auto; white-space: nowrap;'>
                        <input type="number" class="ap-valor-input ap-input-mercado"
                            id="costos-mercado-${c.id}" data-comp-id="${c.id}"
                            placeholder="$ Mercado" step="0.01" min="0"
                            style="width:100%; min-width:100px;" />
                    </td>
                    <!--<td style='width:auto; white-space: nowrap;'>
                        <input type="number" class="ap-valor-input ap-input-sicetat" id="costos-sicetat-${c.id}" data-comp-id="${c.id}" placeholder="$ Sicetat" step="0.01" min="0" style="width:100%; min-width:100px;" />
                    </td>-->
                    <td style='width:auto; white-space: nowrap;'>
                        ${esTipoPlena ? `${_apCostosFormatCOP(tarifa.tarifa_sicetac ?? 0)}` : `<span style="color:var(--ap-gray); font-size:0.78rem;">—</span>`}
                    </td>
                <td style='width:auto; white-space: nowrap;'>${inputAjuste}</td>
                <td style='width:auto; white-space: nowrap;'>
                    ${calcularVariacionTarifa(c.valor, tarifa.tarifa_sicetac, esTipoPlena)}
                </td>
                <td style='width:auto; white-space: nowrap;'>${estadoBadge}</td>
                    <!--<td style='width:auto; white-space: nowrap;'>${btnComp}</td>-->
                </tr>`;
            }

            // ── Card de municipios (MULTI_ORIGEN / MULTI_DESTINO) ────
            if (tieneDetalles) {
                const tipoLabel = c.tipo_label || _apCostosLabelTipo(c.tipo);

                // ── Indexar detalles anteriores por municipio_id ─────
                const detallesAntPorMunicipio = {};
                const compAnt = compAntPorTipo[c.tipo];

                // Fuente 1: detalles_anteriores directo en el componente (backend enriquecido)
                if (c.detalles_anteriores?.length) {
                    c.detalles_anteriores.forEach(d => {
                        detallesAntPorMunicipio[d.municipio_id] = d;
                    });
                    // Fuente 2: fallback desde tarifa_anterior.componentes
                } else if (compAnt?.detalles?.length) {
                    compAnt.detalles.forEach(d => {
                        detallesAntPorMunicipio[d.municipio_id] = d;
                    });
                }

                // ── Resumen totales del componente multi ─────────────
                const valorAntMultiRaw = c.valor_anterior ?? compAnt?.valor ?? null;
                const varRealMulti = c.variacion_pct_real ?? null;

                let resumenAnteriorHtml = '';
                if (valorAntMultiRaw !== null) {
                    let varMultiHtml = '';
                    if (varRealMulti !== null) {
                        const sign = varRealMulti >= 0 ? '+' : '';
                        const color = varRealMulti > 0 ? 'var(--ap-orange)' : varRealMulti < 0 ? 'var(--ap-green)' : 'var(--ap-gray)';
                        const arrow = varRealMulti > 0 ? '▲' : varRealMulti < 0 ? '▼' : '▬';
                        varMultiHtml = `<span style="color:${color}; font-weight:600;">
                                       ${arrow} ${sign}${varRealMulti.toFixed(1)}% vs anterior
                                   </span>`;
                    }
                    resumenAnteriorHtml = `
                    <div style="display:flex; flex-wrap:wrap; gap:20px; align-items:center; padding:7px 14px; background:#f8fafc; border-bottom:1px solid #e5e7eb; font-size:0.75rem;">
                        <span>
                            <span style="color:var(--ap-gray);">Total anterior:</span>
                            <strong style="margin-left:4px; color:var(--ap-navy);">
                                ${_apCostosFormatCOP(valorAntMultiRaw)}
                            </strong>
                        </span>
                        <span>
                            <span style="color:var(--ap-gray);">Total nuevo:</span>
                            <strong style="margin-left:4px; color:var(--ap-navy);">
                                ${_apCostosFormatCOP(c.valor)}
                            </strong>
                        </span>
                        ${varMultiHtml}
                    </div>`;
                }

                // ── Filas de municipios con desglose anterior ────────
                const detalleRows = c.detalles.map((d, di) => {
                    const detId = d.id || `new-${c.id}-${di}`;
                    const munNom = d.municipio?.municipio || d.municipio_nombre
                        || d.nombre_municipio || d.municipio
                        || d.municipio_id || '—';

                    const dAnt = detallesAntPorMunicipio[d.municipio_id] ?? null;
                    const r1Ant = dAnt ? parseFloat(dAnt.rate_1 || 0) : null;
                    const r2Ant = dAnt ? parseFloat(dAnt.rate_2 || 0) : null;
                    const diffR1 = dAnt ? parseFloat(d.rate_1 || 0) - r1Ant : null;
                    const diffR2 = dAnt ? parseFloat(d.rate_2 || 0) - r2Ant : null;

                    const diffTag = (diff) => {
                        if (diff === null) return '';
                        if (diff === 0) return `<div style="font-size:0.68rem; color:var(--ap-gray);">sin cambio</div>`;
                        const color = diff > 0 ? 'var(--ap-orange)' : 'var(--ap-green)';
                        const sign = diff > 0 ? '+' : '';
                        return `<div style="font-size:0.68rem; color:${color};">${sign}${_apCostosFormatCOP(diff)}</div>`;
                    };

                    if (pendiente) {
                        return `
                    <tr class="ap-mun-row" data-det-id="${detId}" data-comp-id="${c.id}">
                        <td class="ap-mun-nombre" style='width:auto; white-space: nowrap;'>
                            <i class="fas fa-map-marker-alt" style="color:var(--ap-blue); margin-right:6px;"></i>
                            ${munNom}
                        </td>
                        <td style='width:auto; white-space: nowrap;'>
                            ${r1Ant !== null
                                ? `<div style="font-size:0.7rem; color:var(--ap-gray); margin-bottom:2px;">
                                       Ant: ${_apCostosFormatCOP(r1Ant)}
                                   </div>`
                                : ''}
                            <input type="number" class="ap-mun-input" id="mun-r1-${detId}" data-det-id="${detId}" data-field="rate_1" value="${parseFloat(d.rate_1 || 0).toFixed(2)}" step="0.01" min="0" oninput="apCostosActualizarTotalMunicipio('${detId}')" placeholder="1ra tarifa" />
                            ${diffTag(diffR1)}
                        </td>
                        <td style='width:auto; white-space: nowrap;'>
                            ${r2Ant !== null
                                ? `<div style="font-size:0.7rem; color:var(--ap-gray); margin-bottom:2px;">
                                       Ant: ${_apCostosFormatCOP(r2Ant)}
                                   </div>`
                                : ''}
                            <input type="number" class="ap-mun-input" id="mun-r2-${detId}" data-det-id="${detId}" data-field="rate_2" value="${parseFloat(d.rate_2 || 0).toFixed(2)}" step="0.01" min="0" oninput="apCostosActualizarTotalMunicipio('${detId}')" placeholder="2da tarifa" />
                            ${diffTag(diffR2)}
                        </td>
                        <td style='width:auto; white-space: nowrap;'>
                            <button class="ap-mun-btn-reset" title="Restaurar valores originales"
                                onclick="apCostosRestaurarMunicipio('${detId}', ${parseFloat(d.rate_1 || 0).toFixed(2)}, ${parseFloat(d.rate_2 || 0).toFixed(2)})">
                                <i class="fas fa-undo"></i>
                            </button>
                        </td>
                    </tr>`;
                    } else {
                        const totalNuevo = parseFloat(d.rate_1 || 0) + parseFloat(d.rate_2 || 0);
                        const totalAnt = dAnt ? (r1Ant + r2Ant) : null;
                        return `
                    <tr>
                        <td style="padding-left:8px;width:auto; white-space: nowrap;">
                            <i class="fas fa-map-marker-alt" style="color:var(--ap-blue); margin-right:6px;"></i>
                            ${munNom}
                        </td>
                        <td style='width:auto; white-space: nowrap;'>
                            <div style="color:var(--ap-gray);">${_apCostosFormatCOP(d.rate_1)} <small>(nueva)</small></div>
                            ${r1Ant !== null
                                ? `<div style="font-size:0.7rem; color:var(--ap-gray);">Ant: ${_apCostosFormatCOP(r1Ant)}</div>`
                                : ''}
                        </td>
                        <td style='width:auto; white-space: nowrap;'>
                            <div style="color:var(--ap-gray);width:auto; white-space: nowrap;">${_apCostosFormatCOP(d.rate_2)} <small>(nueva)</small></div>
                            ${r2Ant !== null ? `<div style="font-size:0.7rem; color:var(--ap-gray);">Ant: ${_apCostosFormatCOP(r2Ant)}</div>`
                                : ''}
                        </td>
                        <td style="font-weight:700;width:auto; white-space: nowrap;">${_apCostosFormatCOP(totalNuevo)}</td>
                        <td style='width:auto; white-space: nowrap;'>${totalAnt !== null
                                ? `<small style="color:var(--ap-gray);">Ant: ${_apCostosFormatCOP(totalAnt)}</small>`
                                : '—'}</td>
                    </tr>`;
                    }
                }).join('');

                const headerEdicion = pendiente
                    ? `<span class="ap-mun-edit-badge"><i class="fas fa-pencil-alt me-1"></i>Editable · Ajusta rate_1 y rate_2 por municipio</span>`
                    : `<span style="font-size:0.7rem; color:var(--ap-green);"><i class="fas fa-check me-1"></i>Aprobado</span>`;

                const guardarBtn = pendiente
                    ? `<button class="ap-mun-btn-guardar" onclick="apCostosGuardarDetallesMunicipio(${c.id})">
                       <i class="fas fa-save me-1"></i>Guardar cambios de municipios
                   </button>`
                    : '';

                multiHtml += `
            <div class="ap-mun-card" id="ap-mun-card-${c.id}">
                <div class="ap-mun-card-header">
                    <span><i class="fas fa-route me-2"></i>${tipoLabel} — Detalle por municipio</span>
                    ${headerEdicion}
                </div>

                ${resumenAnteriorHtml}

                <div style="overflow-x:auto;">
                    <table class="ap-mun-table">
                        <thead>
                            <tr>
                                <th style="text-align:left; min-width:180px;">Municipio</th>
                                <th style="min-width:150px;">1ra Tarifa</th>
                                <th style="min-width:150px;">2da Tarifa</th>
                                <th style="width:44px;"></th>
                            </tr>
                        </thead>
                        <tbody>${detalleRows}</tbody>
                    </table>
                </div>
                ${guardarBtn}
            </div>`;
            }
        });

        tbody.innerHTML = rows || `
        <tr>
            <td colspan="9" style="text-align:center; color:var(--ap-gray); padding:20px;">
                No hay componentes pendientes.
            </td>
        </tr>`;

        if (multiHtml) {
            multiContainer.innerHTML = `
            <div style="font-size:0.8rem; font-weight:700; color:var(--ap-blue); margin-bottom:10px;">
                <i class="fas fa-map-marked-alt"></i> Detalle por municipio (Multi Origen / Multi Destino)
            </div>
            ${multiHtml}`;
            multiContainer.style.display = 'block';
        } else {
            multiContainer.style.display = 'none';
            multiContainer.innerHTML = '';
        }
    }

    // Agrega esta función helper antes o dentro de listar_Tarifas_cliente
    function calcularVariacionTarifa(tarifa, tarifa_sicetac, esTipoPlena) {
        const t = Number(tarifa) || 0;
        const s = esTipoPlena ? Number(tarifa_sicetac) : 0 || 0;  // Si es null/undefined/NaN → 0

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

    /* =============================================================================
       APROBAR TARIFA COMPLETA
       ✅ FIX: Recolecta componentes desde memoria (_apCostos_tarifaActual),
       no desde el DOM. Así incluye MULTI_ORIGEN y MULTI_DESTINO que no se
       renderizan en #ap-costos-comp-tbody.
       ============================================================================= */
    async function apCostosAprobarTarifa() {
        if (!window._apCostos_tarifaActual) return;

        const conf = await Swal.fire({
            icon: 'question',
            title: '¿Aprobar tarifa completa?',
            html: `Se aprobarán <strong>todos</strong> los componentes pendientes.<br>
                <small class="text-muted">La tarifa se activará y la anterior quedará inactiva.</small>`,
            showCancelButton: true,
            confirmButtonText: 'Sí, aprobar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#16a34a',
        });
        if (!conf.isConfirmed) return;

        const tarifa = window._apCostos_tarifaActual;

        // ✅ FIX: Iterar sobre TODOS los componentes pendientes en memoria.
        // Los MULTI_ORIGEN / MULTI_DESTINO no están en el DOM (#ap-costos-comp-tbody),
        // por eso antes llegaban vacíos al backend. Ahora se toman de la fuente de verdad.
        const componentesConValor = (tarifa.componentes ?? [])
            .filter(c => c.requiere_aprobacion == 1)
            .map(c => {
                // Para componentes normales (PLENA, MULTI_RECOGIDA, MULTI_ENTREGA)
                // se intenta leer el valor editado del input del DOM.
                // Para MULTI_ORIGEN / MULTI_DESTINO el input no existe → usa el valor original.
                const inp = document.getElementById(`inp-comp-${c.id}`);
                const valorDOM = inp ? _apCostosLimpiarMoneda(inp.value) : 0;
                return {
                    id: parseInt(c.id),
                    valor: valorDOM || parseFloat(c.valor || 0),
                };
            });

        await _apCostosEjecutarAprobacionConValores(tarifa.id, componentesConValor);
    }

    async function apCostosAprobarComponente(compId) {
        if (!window._apCostos_tarifaActual) return;

        const inp = document.getElementById(`inp-comp-${compId}`);
        const valor = inp
            ? (_apCostosLimpiarMoneda(inp.value) || parseFloat(inp.dataset.original || 0))
            : null;

        await _apCostosEjecutarAprobacionConValores(
            window._apCostos_tarifaActual.id,
            [{ id: compId, valor }]
        );
    }

    /* =============================================================================
       APROBAR DIRECTO (desde la tabla, sin abrir el offcanvas)
       ✅ FIX: Igual que apCostosAprobarTarifa — usa los componentes que devuelve
       el endpoint /tarifas-costos/{id}, no el DOM (que estaría vacío).
       ============================================================================= */
    async function apCostosAprobarDirecto(tarifaId) {
        const conf = await Swal.fire({
            icon: 'question',
            title: '¿Aprobar tarifa?',
            text: 'Se aprobarán todos los componentes pendientes de esta tarifa.',
            showCancelButton: true,
            confirmButtonText: 'Sí, aprobar',
            confirmButtonColor: '#16a34a',
        });
        if (!conf.isConfirmed) return;

        try {
            const resp = await _apCostosFetch(`${document.getElementById('base_url_api').value}tarifas-costos/${tarifaId}`);
            const result = await resp.json();

            // ✅ FIX: Usar TODOS los componentes pendientes del resultado del endpoint,
            // incluyendo MULTI_ORIGEN y MULTI_DESTINO.
            const componentesConValor = (result.data?.componentes ?? [])
                .filter(c => c.requiere_aprobacion == 1)
                .map(c => ({ id: parseInt(c.id), valor: parseFloat(c.valor || 0) }));

            await _apCostosEjecutarAprobacionConValores(tarifaId, componentesConValor);
        } catch (err) {
            apCostosFlash('error', 'Error', err.message);
        }
    }

    async function _apCostosEjecutarAprobacion(tarifaId, compIds) {
        const componentesConValor = compIds.map(id => {
            const inp = document.getElementById(`inp-comp-${id}`);
            const valor = inp
                ? (_apCostosLimpiarMoneda(inp.value) || parseFloat(inp.dataset.original || 0))
                : 0;
            return { id, valor };
        });
        await _apCostosEjecutarAprobacionConValores(tarifaId, componentesConValor);
    }

    /**
     * Ejecuta la aprobación enviando siempre { id, valor } por componente.
     */
    async function _apCostosEjecutarAprobacionConValores(tarifaId, componentesConValor) {
        const causa = document.getElementById('ap-costos-causa-id')?.value ?? '';
        const observacion = document.getElementById('ap-costos-observacion')?.value ?? '';
        const usuario = document.getElementById('ssn_nombre')?.value ?? 'Sistema';
        const baseUrl = document.getElementById('base_url_api').value;

        try {
            const resp = await _apCostosFetch(
                `${baseUrl}tarifas-costos/${tarifaId}/aprobar-con-modificacion`,
                'POST',
                {
                    componentes: componentesConValor,
                    causa_id: causa || null,
                    observacion,
                    usuario,
                }
            );
            const result = await resp.json();

            if (result.success) {
                componentesConValor.forEach(({ id, valor }) => {
                    const celda = document.querySelector(`#comp-row-${id} td:nth-child(2)`);
                    if (celda) celda.textContent = _apCostosFormatCOP(valor);
                });
            }

            _apCostosHandleRespuestaAprobacion(result);
        } catch (err) {
            apCostosFlash('error', 'Error', err.message);
        }
    }

    /* =============================================================================
       GUARDAR AJUSTE
       ============================================================================= */
    async function apCostosGuardarAjuste() {
        if (!window._apCostos_tarifaActual) return;

        const items = Array.from(document.querySelectorAll('.ap-valor-input[data-comp-id]'))
            .map(inp => ({
                id: parseInt(inp.dataset.compId),
                valor: _apCostosLimpiarMoneda(inp.value) || parseFloat(inp.dataset.original),
            }));

        if (!items.length) {
            apCostosFlash('info', 'Sin cambios', 'No hay componentes para ajustar.');
            return;
        }

        const conf = await Swal.fire({
            icon: 'question',
            title: '¿Modificar y aprobar?',
            html: `Los valores serán guardados <strong>sin control de umbral</strong>.<br>
                <small class="text-danger">Esta acción es exclusiva del perfil aprobador.</small>`,
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            confirmButtonColor: '#1a3c6b',
        });
        if (!conf.isConfirmed) return;

        const causa = document.getElementById('ap-costos-causa-id')?.value ?? '';
        const observacion = document.getElementById('ap-costos-observacion')?.value ?? '';
        const usuario = document.getElementById('ssn_nombre')?.value ?? 'Sistema';

        try {
            const resp = await _apCostosFetch(
                `${document.getElementById('base_url_api').value}tarifas-costos/${window._apCostos_tarifaActual.id}/aprobar-con-modificacion`,
                'POST',
                { componentes: items, causa_id: causa || null, observacion, usuario }
            );
            const result = await resp.json();
            _apCostosHandleRespuestaAprobacion(result);
        } catch (err) {
            apCostosFlash('error', 'Error', err.message);
        }
    }

    /* =============================================================================
       RECHAZAR TARIFA
       ============================================================================= */
    async function apCostosRechazarTarifa() {
        if (!window._apCostos_tarifaActual) return;
        await _apCostosRechazarPorId(window._apCostos_tarifaActual.id);
    }

    async function apCostosRechazarDirecto(tarifaId) {
        await _apCostosRechazarPorId(tarifaId);
    }

    async function _apCostosRechazarPorId(tarifaId) {
        const { value: motivo } = await Swal.fire({
            icon: 'warning',
            title: 'Rechazar solicitud',
            input: 'textarea',
            inputLabel: 'Motivo del rechazo *',
            inputPlaceholder: 'Ingrese el motivo...',
            inputAttributes: { maxlength: 500 },
            showCancelButton: true,
            confirmButtonText: 'Rechazar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            inputValidator: (v) => !v && 'Debe ingresar un motivo.',
        });
        if (!motivo) return;

        try {
            const resp = await _apCostosFetch(
                `${document.getElementById('base_url_api').value}tarifas-costos/${tarifaId}/rechazar`,
                'POST',
                { motivo, usuario: document.getElementById('ssn_nombre')?.value ?? 'Sistema' }
            );
            const result = await resp.json();
            if (result.success) {
                apCostosCerrarDetalle();
                apCostosFlash('info', 'Tarifa rechazada', result.message ?? 'La tarifa permanece inactiva.');
                await apCostosCargar();
            } else {
                apCostosFlash('error', 'Error', result.message ?? 'No se pudo rechazar.');
            }
        } catch (err) {
            apCostosFlash('error', 'Error', err.message);
        }
    }

    /* =============================================================================
       HANDLER RESPUESTA APROBACIÓN
       ============================================================================= */
    async function _apCostosHandleRespuestaAprobacion(result) {
        if (!result.success) {
            apCostosFlash('error', 'Error', result.message ?? 'No se pudo procesar.');
            return;
        }
        apCostosCerrarDetalle();
        if (result.estado_final === 'Activa') {
            await Swal.fire({
                icon: 'success',
                title: '¡Tarifa Aprobada y Activada!',
                html: `<p>${result.message}</p>
                    <small class="text-muted">La tarifa anterior fue inactivada automáticamente.</small>`,
                confirmButtonColor: '#16a34a',
            });
        } else {
            apCostosFlash('info', 'Aprobación parcial', result.message);
        }
        await apCostosCargar();
        // if (typeof listar_Fletes_Costos === 'function') listar_Fletes_Costos();
    }

    /* =============================================================================
       CERRAR OFFCANVAS
       ============================================================================= */
    function apCostosCerrarDetalle() {
        document.getElementById('ap-costos-offcanvas').classList.remove('show');
        document.getElementById('ap-costos-backdrop').classList.remove('show');
        window._apCostos_tarifaActual = null;
    }

    /* =============================================================================
       FILTROS
       ============================================================================= */
    function apCostosFiltrarTabla(texto) {
        const s = texto.toLowerCase();
        document.querySelectorAll('#ap-costos-tbody tr[data-id]').forEach(tr => {
            tr.style.display = tr.textContent.toLowerCase().includes(s) ? '' : 'none';
        });
    }

    function apCostosLimpiarFiltros() {
        ['ap-costos-fecha-desde', 'ap-costos-fecha-hasta', 'ap-costos-search',
            'ap-costos-col-search', 'ap-costos-tipo-vehiculo'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
        document.querySelectorAll('#ap-costos-tbody tr').forEach(tr => tr.style.display = '');
        apCostosCargar();
    }

    /* =============================================================================
       FLASH NOTIFICATIONS
       ============================================================================= */
    function apCostosFlash(tipo, titulo, mensaje) {
        const el = document.getElementById('ap-flash-costos');
        const icon = document.getElementById('ap-flash-icon-costos');
        const title = document.getElementById('ap-flash-title-costos');
        const msg = document.getElementById('ap-flash-msg-costos');
        if (!el) return;
        el.className = `ap-flash ${tipo}`;
        // icon.className = tipo === 'success' ? 'fas fa-check-circle' : tipo === 'error' ? 'fas fa-times-circle' : 'fas fa-info-circle';
        icon.style.fontSize = '1.1rem';
        icon.style.flexShrink = '0';
        title.textContent = titulo;
        msg.textContent = mensaje;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 4500);
    }

    function apCostosFlashHide() {
        document.getElementById('ap-flash-costos')?.classList.remove('show');
    }

    /* =============================================================================
       HELPERS — MUNICIPIOS
       ============================================================================= */
    function apCostosActualizarTotalMunicipio(detId) {
        const r1 = parseFloat(document.getElementById(`mun-r1-${detId}`)?.value || 0);
        const r2 = parseFloat(document.getElementById(`mun-r2-${detId}`)?.value || 0);
        const tot = document.getElementById(`mun-total-${detId}`);
        if (tot) tot.textContent = _apCostosFormatCOP(r1 + r2);
    }

    function apCostosRestaurarMunicipio(detId, origR1, origR2) {
        const i1 = document.getElementById(`mun-r1-${detId}`);
        const i2 = document.getElementById(`mun-r2-${detId}`);
        if (i1) i1.value = parseFloat(origR1).toFixed(2);
        if (i2) i2.value = parseFloat(origR2).toFixed(2);
        apCostosActualizarTotalMunicipio(detId);
    }

    function apCostosRecolectarDetallesMunicipio(compId) {
        const tarifa = window._apCostos_tarifaActual;
        if (!tarifa) return [];

        const comp = (tarifa.componentes || []).find(c => c.id === compId);
        if (!comp?.detalles) return [];

        const cambios = [];
        comp.detalles.forEach((d, di) => {
            const detId = d.id || `new-${compId}-${di}`;
            const r1Input = document.getElementById(`mun-r1-${detId}`);
            const r2Input = document.getElementById(`mun-r2-${detId}`);
            if (!r1Input || !r2Input) return;

            const r1 = parseFloat(r1Input.value) || 0;
            const r2 = parseFloat(r2Input.value) || 0;
            const r1Orig = parseFloat(d.rate_1) || 0;
            const r2Orig = parseFloat(d.rate_2) || 0;

            if (Math.abs(r1 - r1Orig) > 0.001 || Math.abs(r2 - r2Orig) > 0.001) {
                cambios.push({ det_id: d.id, municipio_id: d.municipio_id, rate_1: r1, rate_2: r2 });
            }
        });
        return cambios;
    }

    async function apCostosGuardarDetallesMunicipio(compId) {
        const tarifa = window._apCostos_tarifaActual;
        if (!tarifa) return;

        const cambios = apCostosRecolectarDetallesMunicipio(compId);
        if (cambios.length === 0) {
            apCostosFlash('info', 'Sin cambios', 'No se detectaron cambios en los municipios.');
            return;
        }

        const comp = (tarifa.componentes || []).find(c => c.id === compId);
        const tipoStr = comp?.tipo_label || _apCostosLabelTipo(comp?.tipo) || `Componente #${compId}`;
        const baseUrl = document.getElementById('base_url_api').value;
        const usuario = document.getElementById('ssn_nombre')?.value ?? 'Sistema';

        const confirmado = await Swal.fire({
            title: '¿Guardar cambios?',
            html: `
            <p>Se guardarán los ajustes de <strong>${tipoStr}</strong>.</p>
            <p style="color:#1d4ed8; background:#eff6ff; padding:10px; border-radius:7px;
                      font-size:0.82rem; margin-top:8px;">
                <i class="fas fa-info-circle me-1"></i>
                Se modificarán <strong>${cambios.length} municipio(s)</strong>.<br>
                La tarifa sigue en estado <em>Pendiente</em> hasta que se apruebe formalmente.
            </p>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-save me-1"></i> Guardar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#0f766e',
        });
        if (!confirmado.isConfirmed) return;

        const btnEl = document.querySelector(`#ap-mun-card-${compId} .ap-mun-btn-guardar`);
        if (btnEl) { btnEl.disabled = true; btnEl.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Guardando...'; }

        try {
            const resp = await _apCostosFetch(
                `${baseUrl}tarifas-costos/${tarifa.id}/ajuste-detalles-municipio`,
                'PUT',
                { usuario, comp_id: compId, detalles_multi: cambios }
            );
            const result = await resp.json();
            if (!result.success) throw new Error(result.message || 'Error al guardar municipios.');

            if (comp?.detalles) {
                cambios.forEach(c => {
                    const det = comp.detalles.find(d => d.id === c.det_id);
                    if (det) { det.rate_1 = c.rate_1; det.rate_2 = c.rate_2; }
                });
            }

            apCostosFlash('success', 'Municipios actualizados',
                `${cambios.length} municipio(s) de ${tipoStr} guardados correctamente.`);

        } catch (err) {
            apCostosFlash('error', 'Error al guardar', err.message);
        } finally {
            if (btnEl) { btnEl.disabled = false; btnEl.innerHTML = '<i class="fas fa-save me-1"></i>Guardar cambios de municipios'; }
        }
    }

    /* =============================================================================
       HELPERS INTERNOS
       ============================================================================= */
    function _apCostosCargarVehiculos(lista) {
        const sel = document.getElementById('ap-costos-tipo-vehiculo');
        if (!sel) return;
        const tipos = [...new Set(lista.map(t => t.tipo_vehiculo).filter(Boolean))].sort();
        const actual = sel.value;
        sel.innerHTML = '<option value="">Todos</option>' +
            tipos.map(v => `<option value="${v}" ${v === actual ? 'selected' : ''}>${v}</option>`).join('');
    }

    async function _apCostosFetch(url, method = 'GET', body = null) {
        const opts = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-KEY': 'nexos_nacional2026@*',
            },
        };
        if (body) opts.body = JSON.stringify(body);
        return fetch(url, opts);
    }

    function _apCostosLabelTipo(tipo) {
        return { PLENA: 'Plena', MULTI_RECOGIDA: 'Multi Rec.', MULTI_ENTREGA: 'Multi Ent.', MULTI_ORIGEN: 'Multi Ori.', MULTI_DESTINO: 'Multi Dst.' }[tipo] ?? tipo;
    }

    function _apCostosClaseBadgeTipo(tipo) {
        return { PLENA: 'badge-tipo-plena', MULTI_RECOGIDA: 'badge-tipo-recogida', MULTI_ENTREGA: 'badge-tipo-entrega', MULTI_ORIGEN: 'badge-tipo-origen', MULTI_DESTINO: 'badge-tipo-destino' }[tipo] ?? '';
    }

    function _apCostosFormatCOP(v) {
        return Number(v ?? 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
    }

    function _apCostosFormatFecha(f) {
        if (!f) return '—';
        return new Date(f + 'T00:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function _apCostosDiasTranscurridos(fecha) {
        if (!fecha) return 0;
        return Math.floor((Date.now() - new Date(fecha + 'T00:00:00').getTime()) / 86400000);
    }

    function _apCostosInicioSemana() {
        const d = new Date(); const day = d.getDay() || 7;
        d.setDate(d.getDate() - day + 1);
        return d.toISOString().slice(0, 10);
    }

    function _apCostosNum(v) { return Number(v ?? 0).toFixed(2); }

    function _apCostosLimpiarMoneda(valor) {
        if (!valor) return 0;
        return parseFloat(String(valor).replace(/[$\s.]/g, '').replace(',', '.')) || 0;
    }

    function apCostosCurrencyMask(input) {
        const raw = _apCostosLimpiarMoneda(input.value);
        if (!isNaN(raw) && raw > 0) {
            input.value = raw.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
        }
    }

    async function CausalesAprobacion() {
        try {
            const response = await fetch($('#base_url_api').val() + 'tarifas-costos/listar-causales', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-API-KEY': 'nexos_nacional2026@*',
                },
                cache: 'no-cache',
            });

            const data = await response.json();
            window.municipiosData = data;

            $('#ap-costos-causa-id').each(function () {
                const $select = $(this);
                $select.empty().append('<option value="">Seleccione una Causal</option>');

                data.data.forEach(function (element) {
                    $select.append(
                        `<option value="${element.id}" data-municipio="${element.id}" data-depto="${element.causal_aprobacion}">
                          ${element.causal_aprobacion}
                    </option>`
                    );
                });
            });

        } catch (error) {
            console.error('Error en Causales:', error);
            throw error;
        }
    }

    async function Municipios() {
        // Definimos todos los IDs que deben cargarse con la lista de municipios
        const selectIds = [
            "#f_numicipios_aprobacion",
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

    /* ============================================================
   AUTO-INICIO
   (Si el módulo se carga con window.initScript, usar ese patrón)
   ============================================================ */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', apCostosCargar, Municipios);
    } else {
        apCostosCargar();
        Municipios();
    }

    /* =============================================================================
       EXPONER AL SCOPE GLOBAL
       ============================================================================= */
    window.apCostosCargar = apCostosCargar;
    window.apCostosAbrirDetalle = apCostosAbrirDetalle;
    window.apCostosCerrarDetalle = apCostosCerrarDetalle;
    window.apCostosAprobarTarifa = apCostosAprobarTarifa;
    window.apCostosAprobarComponente = apCostosAprobarComponente;
    window.apCostosAprobarDirecto = apCostosAprobarDirecto;
    window.apCostosRechazarTarifa = apCostosRechazarTarifa;
    window.apCostosRechazarDirecto = apCostosRechazarDirecto;
    window.apCostosGuardarAjuste = apCostosGuardarAjuste;
    window.apCostosFiltrarTabla = apCostosFiltrarTabla;
    window.apCostosLimpiarFiltros = apCostosLimpiarFiltros;
    window.apCostosFlashHide = apCostosFlashHide;
    window.apCostosCurrencyMask = apCostosCurrencyMask;
    window.apCostosActualizarTotalMunicipio = apCostosActualizarTotalMunicipio;
    window._apCostosEjecutarAprobacionConValores = _apCostosEjecutarAprobacionConValores;
    window.apCostosRestaurarMunicipio = apCostosRestaurarMunicipio;
    window.apCostosGuardarDetallesMunicipio = apCostosGuardarDetallesMunicipio;
    window.CausalesAprobacion = CausalesAprobacion;

})();