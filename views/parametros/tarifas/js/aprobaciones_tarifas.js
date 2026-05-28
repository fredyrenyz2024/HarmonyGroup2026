/**
 * ============================================================
 *  MÓDULO DE APROBACIÓN — TARIFA DE VENTA
 *  Proyecto HARMONY 2026 | Transporte Nacional
 *  Archivo: aprobacion_tarifas.js
 * ============================================================
 *
 *  DEPENDENCIAS:
 *  - Swal (sweetalert2)
 *  - jQuery (para el selector base_url_api)
 *  - FontAwesome (íconos)
 *
 *  INICIALIZACIÓN:
 *  Llamar apInit() cuando el módulo se carga en el DOM.
 *  El sistema llama apCargar() automáticamente al inicio.
 * ============================================================
 */
(function () {

  'use strict';

  /* ============================================================
     ESTADO GLOBAL DEL MÓDULO
     ============================================================ */
  let AP_STATE = {
    data: [],      // Datos actuales de la bandeja
    tarifaActual: null,    // Tarifa abierta en el offcanvas
    empresa_id: null,
    usuario: null,
    baseUrl: '',
  };

  /* ============================================================
     INICIALIZACIÓN
     ============================================================ */
  function apInit() {
    AP_STATE.empresa_id = document.getElementById('empresa_id')?.value || 1;
    AP_STATE.usuario = document.getElementById('ssn_nombre')?.value
      || window?.USER_NAME
      || 'sistema';
    AP_STATE.baseUrl = $('#base_url_api').val() || 'parametros/';

    // Poner fecha por defecto: últimas 2 semanas
    const hoy = new Date();
    const hace2 = new Date();
    hace2.setDate(hoy.getDate() - 14);

    const fmt = d => d.toISOString().split('T')[0];
    document.getElementById('ap-fecha-desde').value = fmt(hoy);
    document.getElementById('ap-fecha-hasta').value = fmt(hoy);

    apCargar();
  }

  /* ============================================================
     CARGA DE DATOS — BANDEJA PENDIENTES
     ============================================================ */
  async function apCargar() {
    apTableLoading();

    const params = new URLSearchParams({
      empresa_id: AP_STATE.empresa_id,
      fecha_desde: document.getElementById('ap-fecha-desde').value || '',
      fecha_hasta: document.getElementById('ap-fecha-hasta').value || '',
      // search: document.getElementById('ap-search').value || '',
      cliente_id: document.getElementById('f_cliente_aprobacion').value || '',
      tipo_vehiculo: document.getElementById('ap-tipo-vehiculo').value || '',
    });

    // Limpiar parámetros vacíos
    [...params.entries()].forEach(([k, v]) => { if (!v) params.delete(k); });

    try {
      const resp = await apiFetch(
        // `${AP_STATE.baseUrl}tarifas/aprobacion/pendientes?${params}`,
        `${AP_STATE.baseUrl}tarifas/aprobacion/pendientes?${params}`,
        { method: 'GET' }
      );

      if (!resp.success) throw new Error(resp.message || 'Error consultando pendientes');

      AP_STATE.data = resp.data || [];
      apRenderTabla(AP_STATE.data);
      // apActualizarStats(AP_STATE.data);
      document.getElementById('ap-badge-count').textContent = AP_STATE.data.length;

    } catch (err) {
      console.error('[AP] Error cargando bandeja:', err);
      apTableError(err.message);
    }
  }

  /* ============================================================
     RENDER TABLA PRINCIPAL
     ============================================================ */
  function apRenderTabla(data) {
    const tbody = document.getElementById('ap-tbody');
    const tableId = '#tabla-aprobaciones';

    if (!data || data.length === 0) {
      tbody.innerHTML = `
            <tr><td colspan="12">
                <div class="ap-empty">
                    <div class="ap-empty-icon"><i class="fas fa-check-double"></i></div>
                    <div class="ap-empty-title">¡Todo al día!</div>
                    <div class="ap-empty-sub">No hay tarifas pendientes de aprobación en el período seleccionado.</div>
                </div>
            </td></tr>`;
      return;
    }

    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);

    const rows = data.map((item, idx) => {
      const fechaSol = item.fecha ? new Date(item.fecha + 'T00:00:00') : null;
      const diasAgo = fechaSol ? Math.floor((hoy - fechaSol) / 86400000) : 0;
      const diasClass = diasAgo > 7 ? 'urgente' : diasAgo > 3 ? 'atencion' : 'normal';
      const rowClass = diasAgo > 7 ? 'ap-row-urgente' : 'ap-row-normal';

      const fechaFmt = fechaSol
        ? fechaSol.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : '—';

      const compsBadges = (item.componentes || [])
        .filter(c => c.requiere_aprobacion)
        .map(c => `<span class="badge-tipo">${c.tipo_label}</span>`)
        .join('');

      const tarifaFmt = apFormatCOP(item.tarifa);

      // Semáforo de vigencia
      const vigHtml = apRenderVigencia(item.vigencia);

      return `
            <tr class="${rowClass}" data-id="${item.id}">
                <td style="color:var(--ap-gray); font-size:0.72rem;">${idx + 1}</td>
                <td>
                    <div style="font-weight:600;">${fechaFmt}</div>
                    <div style="font-size:0.7rem; color:var(--ap-gray);">${item.hora || ''}</div>
                </td>
                <td>
                    <span class="dias-badge ${diasClass}">
                        <i class="fas fa-clock"></i> ${diasAgo}d
                    </span>
                </td>
                <td>
                    <div style="font-weight:600; max-width:160px; overflow:hidden; text-overflow:ellipsis;" title="${item.cliente}">
                        ${item.cliente || '—'}
                    </div>
                </td>
                <td title="${item.origen}">
                    <div style="max-width:130px; overflow:hidden; text-overflow:ellipsis;">
                        ${item.origen_nombre || item.origen || '—'}
                    </div>
                </td>
                <td title="${item.destino}">
                    <div style="max-width:130px; overflow:hidden; text-overflow:ellipsis;">
                        ${item.destino_nombre || item.destino || '—'}
                    </div>
                </td>
                <td>${apFormatVehiculo(item.tipo_vehiculo)}</td>
                <td style="font-weight:700; color:var(--ap-navy);">
                    ${tarifaFmt}
                </td>
                <td>
                    <div style="display:flex; flex-wrap:wrap; gap:2px; max-width:200px;">
                        ${compsBadges || '<span style="color:var(--ap-gray); font-size:0.72rem;">Ninguno</span>'}
                    </div>
                    <div style="font-size:0.7rem; color:var(--ap-orange); margin-top:3px;">
                        ${item.pendientes_count} pendiente${item.pendientes_count !== 1 ? 's' : ''}
                    </div>
                </td>
                <td>${vigHtml}</td>
                <td>
                    <div style="font-size:0.78rem;">${item.usuario || '—'}</div>
                </td>
                <td>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="btn-ap-ver" onclick="apAbrirDetalle(${item.id})" title="Ver detalle y gestionar">
                            <i class="fas fa-eye"></i> Gestionar
                        </button>
                       <!-- <button class="btn-ap-aprobar" onclick="apAprobarRapido(${item.id})" title="Aprobar directamente">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn-ap-rechazar" onclick="apRechazarRapido(${item.id})" title="Rechazar">
                            <i class="fas fa-times"></i>
                        </button>->
                    </div>
                </td>
            </tr>`;
    }).join('');

    tbody.innerHTML = rows;

    setTimeout(() => inicializarDataTableCostos(tableId), 100);
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

  /* ============================================================
     ESTADÍSTICAS RÁPIDAS
     ============================================================ */
  // function apActualizarStats(data) {
  //   const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  //   const lunes = new Date(hoy);
  //   lunes.setDate(hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1));

  //   let cntHoy = 0, cntSemana = 0, cntMayor5 = 0;

  //   data.forEach(item => {
  //     if (!item.fecha) return;
  //     const f = new Date(item.fecha + 'T00:00:00');
  //     const dias = Math.floor((hoy - f) / 86400000);

  //     if (f.getTime() === hoy.getTime()) cntHoy++;
  //     if (f >= lunes) cntSemana++;
  //     if (dias > 5) cntMayor5++;
  //   });

  //   document.getElementById('cnt-pendientes').textContent = data.length;
  //   document.getElementById('cnt-hoy').textContent = cntHoy;
  //   document.getElementById('cnt-semana').textContent = cntSemana;
  //   document.getElementById('cnt-mayor5').textContent = cntMayor5;
  // }

  /* ============================================================
     FILTRO LOCAL POR COLUMNA (tipo Excel, REQ transversal)
     ============================================================ */
  function apFiltrarTabla(texto) {
    const filas = document.querySelectorAll('#ap-tbody tr[data-id]');
    const t = texto.toLowerCase().trim();

    filas.forEach(tr => {
      const txt = tr.innerText.toLowerCase();
      tr.style.display = (!t || txt.includes(t)) ? '' : 'none';
    });
  }

  function apLimpiarFiltros() {
    document.getElementById('ap-fecha-desde').value = '';
    document.getElementById('ap-fecha-hasta').value = '';

    // Limpiar TomSelect correctamente
    const clienteSelect = document.getElementById('f_cliente_aprobacion');
    if (clienteSelect.tomselect) {
      clienteSelect.tomselect.clear();
    }

    document.getElementById('ap-tipo-vehiculo').value = '';
    document.getElementById('ap-col-search').value = '';

    apCargar();
  }

  /* ============================================================
     ABRIR DETALLE (OFFCANVAS)
     ============================================================ */
  function apAbrirDetalle(id) {
    const tarifa = AP_STATE.data.find(t => t.id === id);
    if (!tarifa) return;

    AP_STATE.tarifaActual = tarifa;

    // Actualizar título
    document.getElementById('ap-oc-title').textContent = `Gestión — ${tarifa.cliente || 'Cliente ' + tarifa.cliente_id}`;
    document.getElementById('ap-oc-sub').textContent = `Tarifa #${tarifa.id} · ${tarifa.origen_nombre} → ${tarifa.destino_nombre}`;

    // Info grid
    apRenderInfoGrid(tarifa);

    // Componentes
    apRenderComponentes(tarifa);

    CausalesAprobacion();

    // Limpiar observaciones
    document.getElementById('ap-causa-id').value = '';
    document.getElementById('ap-observacion').value = '';

    // Mostrar
    document.getElementById('ap-offcanvas').classList.add('show');
    document.getElementById('ap-backdrop').classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function apCerrarDetalle() {
    document.getElementById('ap-offcanvas').classList.remove('show');
    document.getElementById('ap-backdrop').classList.remove('show');
    document.body.style.overflow = '';
    AP_STATE.tarifaActual = null;
  }

  /* ============================================================
     RENDER INFO GENERAL DE LA TARIFA
     ============================================================ */
  function apRenderInfoGrid(tarifa) {
    const items = [
      { label: 'Cliente', value: tarifa.cliente || tarifa.cliente_id },
      { label: 'Origen', value: tarifa.origen_nombre || tarifa.origen },
      { label: 'Destino', value: tarifa.destino_nombre || tarifa.destino },
      { label: 'Tipo Vehículo', value: apFormatVehiculo(tarifa.tipo_vehiculo) },
      { label: 'Tarifa Plena', value: apFormatCOP(tarifa.tarifa) },
      { label: 'Inicio Vigencia', value: apFmtFecha(tarifa.fecha_inicio) },
      { label: 'Fin Vigencia', value: apFmtFecha(tarifa.fecha_fin) },
      { label: 'Fecha Solicitud', value: apFmtFecha(tarifa.fecha) + ' ' + (tarifa.hora || '') },
      { label: 'Usuario', value: tarifa.usuario || '—' },
      { label: 'Estado Vigencia', value: tarifa.estado_vigencia || '—' },
    ];

    document.getElementById('ap-info-grid').innerHTML = items.map(i => `
        <div class="ap-info-item">
            <div class="ap-info-label">${i.label}</div>
            <div class="ap-info-value">${i.value}</div>
        </div>`).join('');
  }

  /* ============================================================
     RENDER COMPONENTES EN DETALLE
     ============================================================ */
  // function apRenderComponentes(tarifa) {
  //   const tbody = document.getElementById('ap-comp-tbody');
  //   const multiContainer = document.getElementById('ap-detalle-multi');

  //   let multiHtml = '';
  //   let rows = '';

  //   (tarifa.componentes || []).forEach(comp => {
  //     // MULTI_ORIGEN y MULTI_DESTINO NO van en la tabla de componentes.
  //     // Se editan exclusivamente en la sección de detalle por municipio (abajo).
  //     const esTipoMultiMunicipio = ['MULTI_ORIGEN', 'MULTI_DESTINO'].includes(comp.tipo);

  //     const pendiente = comp.requiere_aprobacion;
  //     const rowClass = pendiente ? 'comp-pendiente' : '';
  //     const estadoBadge = pendiente
  //       ? `<span class="badge-pendiente"><i class="fas fa-clock me-1"></i>Pendiente</span>`
  //       : `<span class="badge-aprobado"><i class="fas fa-check me-1"></i>OK</span>`;

  //     const varPct = parseFloat(comp.variacion_pct || 0).toFixed(1);
  //     const varClass = parseFloat(varPct) > 10 ? 'badge-variacion-alta' : 'badge-variacion-normal';
  //     const varSign = parseFloat(varPct) >= 0 ? '+' : '';
  //     const valorFmt = apFormatCOP(comp.valor);

  //     // Para MultiOrigen/MultiDestino, el valor viene del total de detalles
  //     const tieneDetalles = ['MULTI_ORIGEN', 'MULTI_DESTINO'].includes(comp.tipo) && comp.detalles?.length > 0;

  //     const inputAjuste = pendiente
  //       ? `<input type="number" class="ap-valor-input" id="ajuste-${comp.id}"
  //                data-comp-id="${comp.id}" data-tipo="${comp.tipo}"
  //                value="${parseFloat(comp.valor || 0).toFixed(2)}"
  //                step="0.01" min="0"
  //                ${tieneDetalles ? 'disabled title="Ajustar por detalle abajo"' : ''} />`
  //       : `<span style="color:var(--ap-gray); font-size:0.78rem;">—</span>`;

  //     const btnComp = pendiente
  //       ? `<div style="display:flex; gap:5px;">
  //                   <button class="btn-ap-aprobar" style="padding:4px 8px; font-size:0.7rem;"
  //                       onclick="apAprobarComponente(${comp.id})" title="Aprobar solo este componente">
  //                       <i class="fas fa-check"></i>
  //                   </button>
  //                   <button class="btn-ap-rechazar" style="padding:4px 8px; font-size:0.7rem;"
  //                       onclick="apRechazarComponente(${comp.id})" title="Rechazar solo este componente">
  //                       <i class="fas fa-times"></i>
  //                   </button>
  //              </div>`
  //       : `<span style="color:var(--ap-gray); font-size:0.72rem;">—</span>`;

  //     // Solo agregar a la tabla de componentes si NO es Multi por municipio
  //     if (!esTipoMultiMunicipio) {
  //       rows += `
  //           <tr class="${rowClass}">
  //               <td><span style="font-weight:700;">${comp.tipo_label}</span></td>
  //               <td><span style="color:var(--ap-gray);">—</span></td>
  //               <td style="font-weight:700;">${valorFmt}</td>
  //               <td><span class="${varClass}">${varSign}${varPct}%</span></td>
  //               <td style='width: auto; white-space: nowrap;'>${estadoBadge}</td>
  //               <td>${inputAjuste}</td>
  //               <td>${btnComp}</td>
  //           </tr>`;
  //     }

  //     // Renderizar detalles EDITABLES de MultiOrigen / MultiDestino
  //     if (tieneDetalles) {
  //       const esPendiente = !!pendiente;
  //       const detalleRows = comp.detalles.map((d, di) => {
  //         const detId = d.id || `new-${comp.id}-${di}`;
  //         const munNom = d.municipio || d.municipio_id || '—';

  //         if (esPendiente) {
  //           // Fila EDITABLE — el aprobador puede modificar rate_1 y rate_2
  //           const totalLocal = (parseFloat(d.rate_1) || 0) + (parseFloat(d.rate_2) || 0);
  //           return `
  //                       <tr class="ap-mun-row" data-det-id="${detId}" data-comp-id="${comp.id}">
  //                           <td class="ap-mun-nombre">
  //                               <i class="fas fa-map-marker-alt" style="color:var(--ap-blue); margin-right:6px;"></i>
  //                               ${munNom}
  //                           </td>
  //                           <td>
  //                               <input type="number" class="ap-mun-input"
  //                                   id="mun-r1-${detId}" data-det-id="${detId}" data-field="rate_1"
  //                                   value="${parseFloat(d.rate_1 || 0).toFixed(2)}" step="0.01" min="0"
  //                                   oninput="apActualizarTotalMunicipio('${detId}')"
  //                                   placeholder="1ra tarifa" />
  //                           </td>
  //                           <td>
  //                               <input type="number" class="ap-mun-input"
  //                                   id="mun-r2-${detId}" data-det-id="${detId}" data-field="rate_2"
  //                                   value="${parseFloat(d.rate_2 || 0).toFixed(2)}" step="0.01" min="0"
  //                                   oninput="apActualizarTotalMunicipio('${detId}')"
  //                                   placeholder="2da tarifa" />
  //                           </td>
  //                           <!--<td>
  //                               <span id="mun-total-${detId}" class="ap-mun-total">
  //                                   ${apFormatCOP(totalLocal)}
  //                               </span>
  //                           </td>-->
  //                           <td>
  //                               <button class="ap-mun-btn-reset" title="Restaurar valores originales"
  //                                   onclick="apRestaurarMunicipio('${detId}', ${parseFloat(d.rate_1 || 0).toFixed(2)}, ${parseFloat(d.rate_2 || 0).toFixed(2)})">
  //                                   <i class="fas fa-undo"></i>
  //                               </button>
  //                           </td>
  //                       </tr>`;
  //         } else {
  //           // Fila solo lectura — componente ya aprobado
  //           return `
  //                       <tr>
  //                           <td style="padding-left:8px; color:var(--ap-navy);">
  //                               <i class="fas fa-map-marker-alt" style="color:var(--ap-blue); margin-right:6px;"></i>
  //                               ${munNom}
  //                           </td>
  //                           <td style="color:var(--ap-gray);">${apFormatCOP(d.rate_1)} <small>(1ra)</small></td>
  //                           <td style="color:var(--ap-gray);">${apFormatCOP(d.rate_2)} <small>(2da)</small></td>
  //                           <td style="font-weight:700;">${apFormatCOP((d.rate_1 || 0) + (d.rate_2 || 0))}</td>
  //                           <td>—</td>
  //                       </tr>`;
  //         }
  //       }).join('');

  //       const headerEdicion = esPendiente
  //         ? `<span class="ap-mun-edit-badge"><i class="fas fa-pencil-alt me-1"></i>Editable · Ajusta rate_1 y rate_2 por municipio</span>`
  //         : `<span style="font-size:0.7rem; color:var(--ap-green);"><i class="fas fa-check me-1"></i>Aprobado</span>`;

  //       const guardarBtn = esPendiente
  //         ? `<button class="ap-mun-btn-guardar" onclick="apGuardarDetallesMunicipio(${comp.id})">
  //                       <i class="fas fa-save me-1"></i>Guardar cambios de municipios
  //                  </button>`
  //         : '';

  //       multiHtml += `
  //               <div class="ap-mun-card" id="ap-mun-card-${comp.id}">
  //                   <div class="ap-mun-card-header">
  //                       <span><i class="fas fa-route me-2"></i>${comp.tipo_label} — Detalle por municipio</span>
  //                       ${headerEdicion}
  //                   </div>
  //                   <div style="overflow-x:auto;">
  //                       <table class="ap-mun-table">
  //                           <thead>
  //                               <tr>
  //                                   <th style="text-align:left; min-width:180px;">Municipio</th>
  //                                   <th style="min-width:130px;">1ra Tarifa</th>
  //                                   <th style="min-width:130px;">2da Tarifa</th>
  //                                   <!--<th style="min-width:110px;">Total</th>-->
  //                                   <th style="width:44px;"></th>
  //                               </tr>
  //                           </thead>
  //                           <tbody>${detalleRows}</tbody>
  //                       </table>
  //                   </div>
  //                   ${guardarBtn}
  //               </div>`;
  //     }
  //   });

  //   tbody.innerHTML = rows || '<tr><td colspan="7" style="text-align:center; color:var(--ap-gray); padding:20px;">Sin componentes</td></tr>';

  //   if (multiHtml) {
  //     multiContainer.innerHTML = `
  //           <div style="font-size:0.8rem; font-weight:700; color:var(--ap-blue); margin-bottom:10px;">
  //               <i class="fas fa-map-marked-alt"></i> Detalle por municipio (Multi Origen / Multi Destino)
  //           </div>
  //           ${multiHtml}`;
  //     multiContainer.style.display = 'block';
  //   } else {
  //     multiContainer.style.display = 'none';
  //     multiContainer.innerHTML = '';
  //   }
  // }

  // function apRenderComponentes(tarifa) {
  //   const tbody = document.getElementById('ap-comp-tbody');
  //   const multiContainer = document.getElementById('ap-detalle-multi');

  //   // Indexar componentes anteriores por tipo para acceso rápido
  //   const compAnterioresPorTipo = {};
  //   if (tarifa.tarifa_anterior && tarifa.tarifa_anterior.componentes) {
  //     tarifa.tarifa_anterior.componentes.forEach(c => {
  //       compAnterioresPorTipo[c.tipo] = c;
  //     });
  //   }

  //   let multiHtml = '';
  //   let rows = '';

  //   (tarifa.componentes || []).forEach(comp => {
  //     const esTipoMultiMunicipio = ['MULTI_ORIGEN', 'MULTI_DESTINO'].includes(comp.tipo);

  //     const pendiente = comp.requiere_aprobacion;
  //     const rowClass = pendiente ? 'comp-pendiente' : '';
  //     const estadoBadge = pendiente
  //       ? `<span class="badge-pendiente"><i class="fas fa-clock me-1"></i>Pendiente</span>`
  //       : `<span class="badge-aprobado"><i class="fas fa-check me-1"></i>OK</span>`;

  //     const varPct = parseFloat(comp.variacion_pct || 0).toFixed(1);
  //     const varClass = parseFloat(varPct) > 10 ? 'badge-variacion-alta' : 'badge-variacion-normal';
  //     const varSign = parseFloat(varPct) >= 0 ? '+' : '';
  //     const valorFmt = apFormatCOP(comp.valor);

  //     // ── VALOR ANTERIOR ──────────────────────────────────────────
  //     // Primero intenta el campo enriquecido del backend,
  //     // si no, busca en tarifa_anterior.componentes por tipo
  //     const valorAntRaw = comp.valor_anterior
  //       ?? compAnterioresPorTipo[comp.tipo]?.valor
  //       ?? null;

  //     const valorAntFmt = valorAntRaw !== null
  //       ? apFormatCOP(valorAntRaw)
  //       : '<span style="color:var(--ap-gray); font-size:0.75rem;">Sin historial</span>';

  //     // Flecha de variación visual
  //     const varRealPct = comp.variacion_pct_real ?? null;
  //     let varAntHtml = '';
  //     if (varRealPct !== null && valorAntRaw !== null) {
  //       const sign = varRealPct >= 0 ? '+' : '';
  //       const color = varRealPct > 0
  //         ? 'var(--ap-orange)'
  //         : varRealPct < 0
  //           ? 'var(--ap-green)'
  //           : 'var(--ap-gray)';
  //       const arrow = varRealPct > 0 ? '▲' : varRealPct < 0 ? '▼' : '▬';
  //       varAntHtml = `<div style="font-size:0.7rem; color:${color}; margin-top:2px;">
  //                     ${arrow} ${sign}${varRealPct.toFixed(1)}% vs anterior
  //                   </div>`;
  //     }

  //     const tieneDetalles = ['MULTI_ORIGEN', 'MULTI_DESTINO'].includes(comp.tipo) && comp.detalles?.length > 0;

  //     const inputAjuste = pendiente
  //       ? `<input type="number" class="ap-valor-input" id="ajuste-${comp.id}"
  //              data-comp-id="${comp.id}" data-tipo="${comp.tipo}"
  //              value="${parseFloat(comp.valor || 0).toFixed(2)}"
  //              step="0.01" min="0"
  //              ${tieneDetalles ? 'disabled title="Ajustar por detalle abajo"' : ''} />`
  //       : `<span style="color:var(--ap-gray); font-size:0.78rem;">—</span>`;

  //     const btnComp = pendiente
  //       ? `<div style="display:flex; gap:5px;">
  //             <button class="btn-ap-aprobar" style="padding:4px 8px; font-size:0.7rem;"
  //                 onclick="apAprobarComponente(${comp.id})" title="Aprobar solo este componente">
  //                 <i class="fas fa-check"></i>
  //             </button>
  //             <button class="btn-ap-rechazar" style="padding:4px 8px; font-size:0.7rem;"
  //                 onclick="apRechazarComponente(${comp.id})" title="Rechazar solo este componente">
  //                 <i class="fas fa-times"></i>
  //             </button>
  //        </div>`
  //       : `<span style="color:var(--ap-gray); font-size:0.72rem;">—</span>`;

  //     if (!esTipoMultiMunicipio) {
  //       rows += `
  //       <tr class="${rowClass}">
  //         <td><span style="font-weight:700;">${comp.tipo_label}</span></td>

  //         <!-- Valor anterior + variación -->
  //         <td>
  //           <div style="font-weight:600;">${valorAntFmt}</div>
  //           ${varAntHtml}
  //         </td>

  //         <!-- Valor nuevo (pendiente) -->
  //         <td style="font-weight:700;">${valorFmt}</td>

  //         <!-- Variación original guardada -->
  //         <td><span class="${varClass}">${varSign}${varPct}%</span></td>

  //         <!-- Tarifa Mercado -->
  //         <td>
  //           <input type="number" class="ap-valor-input ap-input-mercado"
  //             id="mercado-${comp.id}"
  //             data-comp-id="${comp.id}"
  //             placeholder="$ Mercado"
  //             step="0.01" min="0"
  //             style="width:100%; min-width:100px;" />
  //         </td>

  //         <!-- Tarifa Sicetat -->
  //         <td>
  //           <input type="number" class="ap-valor-input ap-input-sicetat"
  //             id="sicetat-${comp.id}"
  //             data-comp-id="${comp.id}"
  //             placeholder="$ Sicetat"
  //             step="0.01" min="0"
  //             style="width:100%; min-width:100px;" />
  //         </td>

  //         <td style="white-space:nowrap;">${estadoBadge}</td>
  //         <td>${inputAjuste}</td>
  //         <td>${btnComp}</td>
  //       </tr>`;
  //     }

  //     // ... (bloque MULTI_ORIGEN / MULTI_DESTINO sin cambios)
  //     if (tieneDetalles) {
  //       // — idéntico al código original que ya tienes —
  //       const esPendiente = !!pendiente;
  //       const detalleRows = comp.detalles.map((d, di) => {
  //         const detId = d.id || `new-${comp.id}-${di}`;
  //         const munNom = d.municipio || d.municipio_id || '—';

  //         if (esPendiente) {
  //           const totalLocal = (parseFloat(d.rate_1) || 0) + (parseFloat(d.rate_2) || 0);
  //           return `
  //           <tr class="ap-mun-row" data-det-id="${detId}" data-comp-id="${comp.id}">
  //             <td class="ap-mun-nombre">
  //               <i class="fas fa-map-marker-alt" style="color:var(--ap-blue); margin-right:6px;"></i>
  //               ${munNom}
  //             </td>
  //             <td>
  //               <input type="number" class="ap-mun-input"
  //                 id="mun-r1-${detId}" data-det-id="${detId}" data-field="rate_1"
  //                 value="${parseFloat(d.rate_1 || 0).toFixed(2)}" step="0.01" min="0"
  //                 oninput="apActualizarTotalMunicipio('${detId}')"
  //                 placeholder="1ra tarifa" />
  //             </td>
  //             <td>
  //               <input type="number" class="ap-mun-input"
  //                 id="mun-r2-${detId}" data-det-id="${detId}" data-field="rate_2"
  //                 value="${parseFloat(d.rate_2 || 0).toFixed(2)}" step="0.01" min="0"
  //                 oninput="apActualizarTotalMunicipio('${detId}')"
  //                 placeholder="2da tarifa" />
  //             </td>
  //             <td>
  //               <button class="ap-mun-btn-reset" title="Restaurar valores originales"
  //                 onclick="apRestaurarMunicipio('${detId}', ${parseFloat(d.rate_1 || 0).toFixed(2)}, ${parseFloat(d.rate_2 || 0).toFixed(2)})">
  //                 <i class="fas fa-undo"></i>
  //               </button>
  //             </td>
  //           </tr>`;
  //         } else {
  //           return `
  //           <tr>
  //             <td style="padding-left:8px; color:var(--ap-navy);">
  //               <i class="fas fa-map-marker-alt" style="color:var(--ap-blue); margin-right:6px;"></i>
  //               ${munNom}
  //             </td>
  //             <td style="color:var(--ap-gray);">${apFormatCOP(d.rate_1)} <small>(1ra)</small></td>
  //             <td style="color:var(--ap-gray);">${apFormatCOP(d.rate_2)} <small>(2da)</small></td>
  //             <td style="font-weight:700;">${apFormatCOP((d.rate_1 || 0) + (d.rate_2 || 0))}</td>
  //             <td>—</td>
  //           </tr>`;
  //         }
  //       }).join('');

  //       const headerEdicion = esPendiente
  //         ? `<span class="ap-mun-edit-badge"><i class="fas fa-pencil-alt me-1"></i>Editable</span>`
  //         : `<span style="font-size:0.7rem; color:var(--ap-green);"><i class="fas fa-check me-1"></i>Aprobado</span>`;

  //       const guardarBtn = esPendiente
  //         ? `<button class="ap-mun-btn-guardar" onclick="apGuardarDetallesMunicipio(${comp.id})">
  //             <i class="fas fa-save me-1"></i>Guardar cambios de municipios
  //          </button>`
  //         : '';

  //       multiHtml += `
  //       <div class="ap-mun-card" id="ap-mun-card-${comp.id}">
  //         <div class="ap-mun-card-header">
  //           <span><i class="fas fa-route me-2"></i>${comp.tipo_label} — Detalle por municipio</span>
  //           ${headerEdicion}
  //         </div>
  //         <div style="overflow-x:auto;">
  //           <table class="ap-mun-table">
  //             <thead>
  //               <tr>
  //                 <th style="text-align:left; min-width:180px;">Municipio</th>
  //                 <th style="min-width:130px;">1ra Tarifa</th>
  //                 <th style="min-width:130px;">2da Tarifa</th>
  //                 <th style="width:44px;"></th>
  //               </tr>
  //             </thead>
  //             <tbody>${detalleRows}</tbody>
  //           </table>
  //         </div>
  //         ${guardarBtn}
  //       </div>`;
  //     }
  //   });

  //   tbody.innerHTML = rows || '<tr><td colspan="9" style="text-align:center; color:var(--ap-gray); padding:20px;">Sin componentes</td></tr>';

  //   if (multiHtml) {
  //     multiContainer.innerHTML = `
  //     <div style="font-size:0.8rem; font-weight:700; color:var(--ap-blue); margin-bottom:10px;">
  //       <i class="fas fa-map-marked-alt"></i> Detalle por municipio (Multi Origen / Multi Destino)
  //     </div>
  //     ${multiHtml}`;
  //     multiContainer.style.display = 'block';
  //   } else {
  //     multiContainer.style.display = 'none';
  //     multiContainer.innerHTML = '';
  //   }
  // }

  // function apRenderComponentes(tarifa) {
  //   const tbody = document.getElementById('ap-comp-tbody');
  //   const multiContainer = document.getElementById('ap-detalle-multi');

  //   // Indexar componentes anteriores por tipo para acceso rápido
  //   const compAnterioresPorTipo = {};
  //   if (tarifa.tarifa_anterior && tarifa.tarifa_anterior.componentes) {
  //     tarifa.tarifa_anterior.componentes.forEach(c => {
  //       compAnterioresPorTipo[c.tipo] = c;
  //     });
  //   }

  //   let multiHtml = '';
  //   let rows = '';

  //   (tarifa.componentes || []).forEach(comp => {
  //     const esTipoMultiMunicipio = ['MULTI_ORIGEN', 'MULTI_DESTINO'].includes(comp.tipo);

  //     const pendiente = comp.requiere_aprobacion;
  //     const rowClass = pendiente ? 'comp-pendiente' : '';
  //     const estadoBadge = pendiente
  //       ? `<span class="badge-pendiente"><i class="fas fa-clock me-1"></i>Pendiente</span>`
  //       : `<span class="badge-aprobado"><i class="fas fa-check me-1"></i>OK</span>`;

  //     const varPct = parseFloat(comp.variacion_pct || 0).toFixed(1);
  //     const varClass = parseFloat(varPct) > 10 ? 'badge-variacion-alta' : 'badge-variacion-normal';
  //     const varSign = parseFloat(varPct) >= 0 ? '+' : '';
  //     const valorFmt = apFormatCOP(comp.valor);

  //     // ── Valor anterior ───────────────────────────────────────
  //     const valorAntRaw = comp.valor_anterior
  //       ?? compAnterioresPorTipo[comp.tipo]?.valor
  //       ?? null;

  //     const valorAntFmt = valorAntRaw !== null
  //       ? apFormatCOP(valorAntRaw)
  //       : '<span style="color:var(--ap-gray); font-size:0.75rem;">Sin historial</span>';

  //     // Flecha de variación visual
  //     const varRealPct = comp.variacion_pct_real ?? null;
  //     let varAntHtml = '';
  //     if (varRealPct !== null && valorAntRaw !== null) {
  //       const sign = varRealPct >= 0 ? '+' : '';
  //       const color = varRealPct > 0
  //         ? 'var(--ap-orange)'
  //         : varRealPct < 0
  //           ? 'var(--ap-green)'
  //           : 'var(--ap-gray)';
  //       const arrow = varRealPct > 0 ? '▲' : varRealPct < 0 ? '▼' : '▬';
  //       varAntHtml = `<div style="font-size:0.7rem; color:${color}; margin-top:2px;">
  //                              ${arrow} ${sign}${varRealPct.toFixed(1)}% vs anterior
  //                          </div>`;
  //     }

  //     const tieneDetalles = ['MULTI_ORIGEN', 'MULTI_DESTINO'].includes(comp.tipo) && comp.detalles?.length > 0;

  //     const inputAjuste = pendiente
  //       ? `<input type="number" class="ap-valor-input" id="ajuste-${comp.id}"
  //                  data-comp-id="${comp.id}" data-tipo="${comp.tipo}"
  //                  value="${parseFloat(comp.valor || 0).toFixed(2)}"
  //                  step="0.01" min="0"
  //                  ${tieneDetalles ? 'disabled title="Ajustar por detalle abajo"' : ''} />`
  //       : `<span style="color:var(--ap-gray); font-size:0.78rem;">—</span>`;

  //     const btnComp = pendiente
  //       ? `<div style="display:flex; gap:5px;">
  //                 <button class="btn-ap-aprobar" style="padding:4px 8px; font-size:0.7rem;"
  //                     onclick="apAprobarComponente(${comp.id})" title="Aprobar solo este componente">
  //                     <i class="fas fa-check"></i>
  //                 </button>
  //                 <button class="btn-ap-rechazar" style="padding:4px 8px; font-size:0.7rem;"
  //                     onclick="apRechazarComponente(${comp.id})" title="Rechazar solo este componente">
  //                     <i class="fas fa-times"></i>
  //                 </button>
  //              </div>`
  //       : `<span style="color:var(--ap-gray); font-size:0.72rem;">—</span>`;

  //     // ── Tabla principal (solo NO multi municipio) ────────────
  //     if (!esTipoMultiMunicipio) {
  //       rows += `
  //           <tr class="${rowClass}">
  //               <td><span style="font-weight:700;">${comp.tipo_label}</span></td>
  //               <td>
  //                   <div style="font-weight:600;">${valorAntFmt}</div>
  //                   ${varAntHtml}
  //               </td>
  //               <td style="font-weight:700;">${valorFmt}</td>
  //               <td><span class="${varClass}">${varSign}${varPct}%</span></td>
  //               <td>
  //                   <input type="number" class="ap-valor-input ap-input-mercado"
  //                       id="mercado-${comp.id}" data-comp-id="${comp.id}"
  //                       placeholder="$ Mercado" step="0.01" min="0"
  //                       style="width:100%; min-width:100px;" />
  //               </td>
  //               <td>
  //                   <input type="number" class="ap-valor-input ap-input-sicetat"
  //                       id="sicetat-${comp.id}" data-comp-id="${comp.id}"
  //                       placeholder="$ Sicetat" step="0.01" min="0"
  //                       style="width:100%; min-width:100px;" />
  //               </td>
  //               <td style="white-space:nowrap;">${estadoBadge}</td>
  //               <td>${inputAjuste}</td>
  //               <td>${btnComp}</td>
  //           </tr>`;
  //     }

  //     // ── Card de municipios (MULTI_ORIGEN / MULTI_DESTINO) ────
  //     if (tieneDetalles) {
  //       const esPendiente = !!pendiente;

  //       // ── FIX 2: Resumen valor anterior/nuevo del componente multi ──
  //       const valorAntMultiRaw = comp.valor_anterior
  //         ?? compAnterioresPorTipo[comp.tipo]?.valor
  //         ?? null;
  //       const varRealMulti = comp.variacion_pct_real ?? null;

  //       let resumenAnteriorHtml = '';
  //       if (valorAntMultiRaw !== null) {
  //         let varMultiHtml = '';
  //         if (varRealMulti !== null) {
  //           const sign = varRealMulti >= 0 ? '+' : '';
  //           const color = varRealMulti > 0
  //             ? 'var(--ap-orange)'
  //             : varRealMulti < 0
  //               ? 'var(--ap-green)'
  //               : 'var(--ap-gray)';
  //           const arrow = varRealMulti > 0 ? '▲' : varRealMulti < 0 ? '▼' : '▬';
  //           varMultiHtml = `
  //                       <span style="color:${color}; font-weight:600;">
  //                           ${arrow} ${sign}${varRealMulti.toFixed(1)}% vs anterior
  //                       </span>`;
  //         }

  //         resumenAnteriorHtml = `
  //                   <div style="display:flex; flex-wrap:wrap; gap:20px; align-items:center;
  //                               padding:7px 14px; background:#f8fafc;
  //                               border-bottom:1px solid #e5e7eb; font-size:0.75rem;">
  //                       <span>
  //                           <span style="color:var(--ap-gray);">Valor anterior:</span>
  //                           <strong style="margin-left:4px; color:var(--ap-navy);">
  //                               ${apFormatCOP(valorAntMultiRaw)}
  //                           </strong>
  //                       </span>
  //                       <span>
  //                           <span style="color:var(--ap-gray);">Valor nuevo:</span>
  //                           <strong style="margin-left:4px; color:var(--ap-navy);">
  //                               ${apFormatCOP(comp.valor)}
  //                           </strong>
  //                       </span>
  //                       ${varMultiHtml}
  //                   </div>`;
  //       }

  //       const detalleRows = comp.detalles.map((d, di) => {
  //         const detId = d.id || `new-${comp.id}-${di}`;
  //         const munNom = d.municipio || d.municipio_id || '—';

  //         if (esPendiente) {
  //           return `
  //                   <tr class="ap-mun-row" data-det-id="${detId}" data-comp-id="${comp.id}">
  //                       <td class="ap-mun-nombre">
  //                           <i class="fas fa-map-marker-alt" style="color:var(--ap-blue); margin-right:6px;"></i>
  //                           ${munNom}
  //                       </td>
  //                       <td>
  //                           <input type="number" class="ap-mun-input"
  //                               id="mun-r1-${detId}" data-det-id="${detId}" data-field="rate_1"
  //                               value="${parseFloat(d.rate_1 || 0).toFixed(2)}" step="0.01" min="0"
  //                               oninput="apActualizarTotalMunicipio('${detId}')"
  //                               placeholder="1ra tarifa" />
  //                       </td>
  //                       <td>
  //                           <input type="number" class="ap-mun-input"
  //                               id="mun-r2-${detId}" data-det-id="${detId}" data-field="rate_2"
  //                               value="${parseFloat(d.rate_2 || 0).toFixed(2)}" step="0.01" min="0"
  //                               oninput="apActualizarTotalMunicipio('${detId}')"
  //                               placeholder="2da tarifa" />
  //                       </td>
  //                       <td>
  //                           <button class="ap-mun-btn-reset" title="Restaurar valores originales"
  //                               onclick="apRestaurarMunicipio('${detId}', ${parseFloat(d.rate_1 || 0).toFixed(2)}, ${parseFloat(d.rate_2 || 0).toFixed(2)})">
  //                               <i class="fas fa-undo"></i>
  //                           </button>
  //                       </td>
  //                   </tr>`;
  //         } else {
  //           return `
  //                   <tr>
  //                       <td style="padding-left:8px; color:var(--ap-navy);">
  //                           <i class="fas fa-map-marker-alt" style="color:var(--ap-blue); margin-right:6px;"></i>
  //                           ${munNom}
  //                       </td>
  //                       <td style="color:var(--ap-gray);">${apFormatCOP(d.rate_1)} <small>(1ra)</small></td>
  //                       <td style="color:var(--ap-gray);">${apFormatCOP(d.rate_2)} <small>(2da)</small></td>
  //                       <td style="font-weight:700;">${apFormatCOP((d.rate_1 || 0) + (d.rate_2 || 0))}</td>
  //                       <td>—</td>
  //                   </tr>`;
  //         }
  //       }).join('');

  //       const headerEdicion = esPendiente
  //         ? `<span class="ap-mun-edit-badge"><i class="fas fa-pencil-alt me-1"></i>Editable</span>`
  //         : `<span style="font-size:0.7rem; color:var(--ap-green);"><i class="fas fa-check me-1"></i>Aprobado</span>`;

  //       const guardarBtn = esPendiente
  //         ? `<button class="ap-mun-btn-guardar" onclick="apGuardarDetallesMunicipio(${comp.id})">
  //                      <i class="fas fa-save me-1"></i>Guardar cambios de municipios
  //                  </button>`
  //         : '';

  //       multiHtml += `
  //           <div class="ap-mun-card" id="ap-mun-card-${comp.id}">
  //               <div class="ap-mun-card-header">
  //                   <span><i class="fas fa-route me-2"></i>${comp.tipo_label} — Detalle por municipio</span>
  //                   ${headerEdicion}
  //               </div>

  //               ${resumenAnteriorHtml}

  //               <div style="overflow-x:auto;">
  //                   <table class="ap-mun-table">
  //                       <thead>
  //                           <tr>
  //                               <th style="text-align:left; min-width:180px;">Municipio</th>
  //                               <th style="min-width:130px;">1ra Tarifa</th>
  //                               <th style="min-width:130px;">2da Tarifa</th>
  //                               <th style="width:44px;"></th>
  //                           </tr>
  //                       </thead>
  //                       <tbody>${detalleRows}</tbody>
  //                   </table>
  //               </div>
  //               ${guardarBtn}
  //           </div>`;
  //     }
  //   });

  //   tbody.innerHTML = rows || '<tr><td colspan="9" style="text-align:center; color:var(--ap-gray); padding:20px;">Sin componentes</td></tr>';

  //   if (multiHtml) {
  //     multiContainer.innerHTML = `
  //       <div style="font-size:0.8rem; font-weight:700; color:var(--ap-blue); margin-bottom:10px;">
  //           <i class="fas fa-map-marked-alt"></i> Detalle por municipio (Multi Origen / Multi Destino)
  //       </div>
  //       ${multiHtml}`;
  //     multiContainer.style.display = 'block';
  //   } else {
  //     multiContainer.style.display = 'none';
  //     multiContainer.innerHTML = '';
  //   }
  // }

  function apRenderComponentes(tarifa) {
    const tbody = document.getElementById('ap-comp-tbody');
    const multiContainer = document.getElementById('ap-detalle-multi');

    // Indexar componentes anteriores por tipo para acceso rápido
    const compAnterioresPorTipo = {};
    if (tarifa.tarifa_anterior && tarifa.tarifa_anterior.componentes) {
      tarifa.tarifa_anterior.componentes.forEach(c => {
        compAnterioresPorTipo[c.tipo] = c;
      });
    }

    let multiHtml = '';
    let rows = '';

    const valorFmtSicetac = apFormatCOP(tarifa.tarifa_sicetac ?? 0);
    // Justo antes del forEach de componentes, calcular sicetac anterior
    const sicetacAnterior = tarifa.tarifa_anterior?.tarifa_sicetac ?? null;
    (tarifa.componentes || []).forEach(comp => {
      // console.log("🚀 ~ apRenderComponentes ~ comp:", comp)
      const esTipoMultiMunicipio = ['MULTI_ORIGEN', 'MULTI_DESTINO'].includes(comp.tipo);
      // ── Solo PLENA muestra Sicetat, el resto muestra — ──
      const esTipoPlena = comp.tipo === 'PLENA';

      const pendiente = comp.requiere_aprobacion;
      const rowClass = pendiente ? 'comp-pendiente' : '';
      const estadoBadge = pendiente
        ? `<span class="badge-pendiente"><i class="fas fa-clock me-1"></i>Pendiente</span>`
        : `<span class="badge-aprobado"><i class="fas fa-check me-1"></i>OK</span>`;

      const varPct = parseFloat(comp.variacion_pct || 0).toFixed(1);
      const varClass = parseFloat(varPct) > 10 ? 'badge-variacion-alta' : 'badge-variacion-normal';
      const varSign = parseFloat(varPct) >= 0 ? '+' : '';
      const valorFmt = apFormatCOP(comp.valor);

      // ── Valor anterior ───────────────────────────────────────
      const valorAntRaw = comp.valor_anterior
        ?? compAnterioresPorTipo[comp.tipo]?.valor
        ?? null;

      const valorAntFmt = valorAntRaw !== null
        ? apFormatCOP(valorAntRaw)
        : '<span style="color:var(--ap-gray); font-size:0.75rem;">Sin historial</span>';

      const varRealPct = comp.variacion_pct_real ?? null;
      let varAntHtml = '';
      if (varRealPct !== null && valorAntRaw !== null) {
        const sign = varRealPct >= 0 ? '+' : '';
        const color = varRealPct > 0 ? 'var(--ap-orange)' : varRealPct < 0 ? 'var(--ap-green)' : 'var(--ap-gray)';
        const arrow = varRealPct > 0 ? '▲' : varRealPct < 0 ? '▼' : '▬';
        varAntHtml = `<div style="font-size:0.7rem; color:${color}; margin-top:2px;">
                               ${arrow} ${sign}${varRealPct.toFixed(1)}% vs anterior
                           </div>`;
      }

      const tieneDetalles = ['MULTI_ORIGEN', 'MULTI_DESTINO'].includes(comp.tipo) && comp.detalles?.length > 0;

      const inputAjuste = pendiente
        ? `<input type="number" class="ap-valor-input" id="ajuste-${comp.id}"
                   data-comp-id="${comp.id}" data-tipo="${comp.tipo}"
                   value="${parseFloat(comp.valor || 0).toFixed(2)}"
                   step="0.01" min="0"
                   ${tieneDetalles ? 'disabled title="Ajustar por detalle abajo"' : ''} />`
        : `<span style="color:var(--ap-gray); font-size:0.78rem;">—</span>`;

      const btnComp = pendiente
        ? `<div style="display:flex; gap:5px;">
                  <button class="btn-ap-aprobar" style="padding:4px 8px; font-size:0.7rem;"
                      onclick="apAprobarComponente(${comp.id})" title="Aprobar solo este componente">
                      <i class="fas fa-check"></i>
                  </button>
                  <button class="btn-ap-rechazar" style="padding:4px 8px; font-size:0.7rem;"
                      onclick="apRechazarComponente(${comp.id})" title="Rechazar solo este componente">
                      <i class="fas fa-times"></i>
                  </button>
               </div>`
        : `<span style="color:var(--ap-gray); font-size:0.72rem;">—</span>`;

      // ── Tabla principal (solo NO multi municipio) ──────────── ${varAntHtml} ${sicetacAnterior !== null ? `<div style="font-size:0.7rem; color:var(--ap-gray); margin-bottom:2px;"> Ant: ${apFormatCOP(sicetacAnterior)}  </div>` : ''}
      if (!esTipoMultiMunicipio) {
        rows += `
            <tr class="${rowClass}">
                <td style='width:auto; white-space: nowrap;'><span style="font-weight:700;">${comp.tipo_label}</span></td>
                <td style='width:auto; white-space: nowrap;'>
                    <div style="font-weight:600;">${valorAntFmt}</div>
                </td>
                <td style="font-weight:700;">${valorFmt}</td>
                <td style='width:auto; white-space: nowrap;'><span class="${varClass}">${varSign}${varPct}%</span></td>
                <td style='width:auto; white-space: nowrap;'>
                    <input type="number" class="ap-valor-input ap-input-mercado" id="mercado-${comp.id}" data-comp-id="${comp.id}" placeholder="$ Mercado" step="0.01" min="0" style="width:100%; min-width:100px;" />
                </td>
                <td style='width:auto; white-space: nowrap;'>
                  ${esTipoPlena ? `${apFormatCOP(tarifa.tarifa_sicetac ?? 0)} <!--<input type="text" class="ap-valor-input ap-input-sicetat" id="sicetat-${comp.id}" data-comp-id="${comp.id}" placeholder="$ Sicetat" value="${apFormatCOP(tarifa.tarifa_sicetac ?? 0)}" style="width:100%; min-width:100px;" disabled />-->`
            : `<span style="color:var(--ap-gray); font-size:0.78rem;">—</span>`}
                </td>
              <td style='width:auto; white-space: nowrap;'>${inputAjuste}</td>
              <td style='width:auto; white-space: nowrap;'>
                  ${calcularVariacionTarifa(comp.valor, tarifa.tarifa_sicetac, esTipoPlena)}
              </td>
              <td style="white-space:nowrap;">${estadoBadge}</td>
                <!--<td style='width:auto; white-space: nowrap;'>${btnComp}</td>-->
            </tr>`;
      }

      // ── Card de municipios (MULTI_ORIGEN / MULTI_DESTINO) ────
      if (tieneDetalles) {
        const esPendiente = !!pendiente;

        // Indexar detalles anteriores por municipio_id
        const detallesAntPorMunicipio = {};
        const compAnt = compAnterioresPorTipo[comp.tipo];

        // Fuente 1: detalles_anteriores directo en el componente (backend enriquecido)
        if (comp.detalles_anteriores?.length) {
          comp.detalles_anteriores.forEach(d => {
            detallesAntPorMunicipio[d.municipio_id] = d;
          });
          // Fuente 2: fallback desde tarifa_anterior.componentes
        } else if (compAnt?.detalles?.length) {
          compAnt.detalles.forEach(d => {
            detallesAntPorMunicipio[d.municipio_id] = d;
          });
        }

        // ── Resumen totales del componente multi ─────────────
        const valorAntMultiRaw = comp.valor_anterior ?? compAnt?.valor ?? null;
        const varRealMulti = comp.variacion_pct_real ?? null;

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
                    <div style="display:flex; flex-wrap:wrap; gap:20px; align-items:center;
                                padding:7px 14px; background:#f8fafc;
                                border-bottom:1px solid #e5e7eb; font-size:0.75rem;">
                        <span>
                            <span style="color:var(--ap-gray);">Total anterior:</span>
                            <strong style="margin-left:4px; color:var(--ap-navy);">${apFormatCOP(valorAntMultiRaw)}</strong>
                        </span>
                        <span>
                            <span style="color:var(--ap-gray);">Total nuevo:</span>
                            <strong style="margin-left:4px; color:var(--ap-navy);">${apFormatCOP(comp.valor)}</strong>
                        </span>
                        ${varMultiHtml}
                    </div>`;
        }

        // ── Filas de municipios con desglose anterior ────────
        const detalleRows = comp.detalles.map((d, di) => {
          const detId = d.id || `new-${comp.id}-${di}`;
          const munNom = d.municipio || d.municipio_id || '—';

          // Buscar municipio equivalente en tarifa anterior
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
            return `<div style="font-size:0.68rem; color:${color};">${sign}${apFormatCOP(diff)}</div>`;
          };

          if (esPendiente) {
            return `
                    <tr class="ap-mun-row" data-det-id="${detId}" data-comp-id="${comp.id}">
                        <td class="ap-mun-nombre" style='width:auto; white-space: nowrap;'>
                            <i class="fas fa-map-marker-alt" style="color:var(--ap-blue); margin-right:6px;"></i>
                            ${munNom}
                        </td>
                        <td style='width:auto; white-space: nowrap;'>
                            ${r1Ant !== null
                ? `<div style="font-size:0.7rem; color:var(--ap-gray); margin-bottom:2px;">
                                       Ant: ${apFormatCOP(r1Ant)}
                                   </div>`
                : ''}
                            <input type="number" class="ap-mun-input"
                                id="mun-r1-${detId}" data-det-id="${detId}" data-field="rate_1"
                                value="${parseFloat(d.rate_1 || 0).toFixed(2)}" step="0.01" min="0"
                                oninput="apActualizarTotalMunicipio('${detId}')"
                                placeholder="1ra tarifa" />
                            ${diffTag(diffR1)}
                        </td>
                        <td style='width:auto; white-space: nowrap;'>
                            ${r2Ant !== null
                ? `<div style="font-size:0.7rem; color:var(--ap-gray); margin-bottom:2px;">
                                       Ant: ${apFormatCOP(r2Ant)}
                                   </div>`
                : ''}
                            <input type="number" class="ap-mun-input"
                                id="mun-r2-${detId}" data-det-id="${detId}" data-field="rate_2"
                                value="${parseFloat(d.rate_2 || 0).toFixed(2)}" step="0.01" min="0"
                                oninput="apActualizarTotalMunicipio('${detId}')"
                                placeholder="2da tarifa" />
                            ${diffTag(diffR2)}
                        </td>
                        <td style='width:auto; white-space: nowrap;'>
                            <button class="ap-mun-btn-reset" title="Restaurar valores originales"
                                onclick="apRestaurarMunicipio('${detId}', ${parseFloat(d.rate_1 || 0).toFixed(2)}, ${parseFloat(d.rate_2 || 0).toFixed(2)})">
                                <i class="fas fa-undo"></i>
                            </button>
                        </td>
                    </tr>`;
          } else {
            const totalNuevo = parseFloat(d.rate_1 || 0) + parseFloat(d.rate_2 || 0);
            const totalAnt = dAnt ? (r1Ant + r2Ant) : null;
            return `
                    <tr>
                        <td style="padding-left:8px; color:var(--ap-navy); width:auto; white-space: nowrap;'">
                            <i class="fas fa-map-marker-alt" style="color:var(--ap-blue); margin-right:6px;"></i>
                            ${munNom}
                        </td>
                        <td style='width:auto; white-space: nowrap;'>
                            <div style="color:var(--ap-gray);">${apFormatCOP(d.rate_1)} <small>(nueva)</small></div>
                            ${r1Ant !== null
                ? `<div style="font-size:0.7rem; color:var(--ap-gray);">Ant: ${apFormatCOP(r1Ant)}</div>`
                : ''}
                        </td>
                        <td style='width:auto; white-space: nowrap;'>
                            <div style="color:var(--ap-gray);">${apFormatCOP(d.rate_2)} <small>(nueva)</small></div>
                            ${r2Ant !== null
                ? `<div style="font-size:0.7rem; color:var(--ap-gray);">Ant: ${apFormatCOP(r2Ant)}</div>`
                : ''}
                        </td>
                        <td style="font-weight:700; width:auto; white-space: nowrap;'">${apFormatCOP(totalNuevo)}</td>
                        <td style='width:auto; white-space: nowrap;'>${totalAnt !== null
                ? `<small style="color:var(--ap-gray);">Ant: ${apFormatCOP(totalAnt)}</small>`
                : '—'}</td>
                    </tr>`;
          }
        }).join('');

        const headerEdicion = esPendiente
          ? `<span class="ap-mun-edit-badge"><i class="fas fa-pencil-alt me-1"></i>Editable</span>`
          : `<span style="font-size:0.7rem; color:var(--ap-green);"><i class="fas fa-check me-1"></i>Aprobado</span>`;

        const guardarBtn = esPendiente
          ? `<button class="ap-mun-btn-guardar" onclick="apGuardarDetallesMunicipio(${comp.id})">
                       <i class="fas fa-save me-1"></i>Guardar cambios de municipios
                   </button>`
          : '';

        multiHtml += `
            <div class="ap-mun-card" id="ap-mun-card-${comp.id}">
                <div class="ap-mun-card-header">
                    <span><i class="fas fa-route me-2"></i>${comp.tipo_label} — Detalle por municipio</span>
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

    tbody.innerHTML = rows || '<tr><td colspan="9" style="text-align:center; color:var(--ap-gray); padding:20px;">Sin componentes</td></tr>';

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

  /* ============================================================
     APROBAR TARIFA COMPLETA (desde offcanvas)
     ============================================================ */
  async function apAprobarTarifa() {
    const tarifa = AP_STATE.tarifaActual;
    if (!tarifa) return;

    const confirm = await Swal.fire({
      title: '¿Aprobar tarifa completa?',
      html: `
            <p style="margin-bottom:8px;">Se aprobará la tarifa <strong>#${tarifa.id}</strong> completa.</p>
            <p style="color:#166534; background:#f0fdf4; padding:10px; border-radius:7px; font-size:0.85rem;">
                <i class="fas fa-info-circle me-1"></i>
                La tarifa anterior activa quedará <strong>inactiva</strong> automáticamente y esta pasará a ser la tarifa vigente del cliente.
            </p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-check-circle me-1"></i> Sí, aprobar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
    });

    if (!confirm.isConfirmed) return;

    // Recolectar ajustes de valores (el aprobador pudo modificar)
    const ajustes = apRecolectarAjustes();
    const body = {
      usuario: AP_STATE.usuario,
      causa_id: document.getElementById('ap-causa-id').value || null,
      observacion: document.getElementById('ap-observacion').value || null,
      ...ajustes,
    };

    try {
      apBtnLoading('ap-btn-aprobar-todo', true);
      const resp = await apiFetch(
        `${AP_STATE.baseUrl}tarifas/${tarifa.id}/aprobar`,
        { method: 'POST', data: body }
      );

      if (!resp.success) throw new Error(resp.message);

      apFlash('success', '¡Aprobada!', `Tarifa #${tarifa.id} aprobada y activada correctamente.`);
      apCerrarDetalle();
      await apCargar(); // Actualizar bandeja (sale automáticamente)

    } catch (err) {
      apFlash('error', 'Error al aprobar', err.message);
    } finally {
      apBtnLoading('ap-btn-aprobar-todo', false);
    }
  }

  /* ============================================================
     RECHAZAR TARIFA COMPLETA (desde offcanvas)
     ============================================================ */
  async function apRechazarTarifa() {
    const tarifa = AP_STATE.tarifaActual;
    if (!tarifa) return;

    const observacion = document.getElementById('ap-observacion').value;
    const causa_id = document.getElementById('ap-causa-id').value;

    const confirm = await Swal.fire({
      title: '¿Rechazar tarifa?',
      html: `
            <p>Se rechazará la tarifa <strong>#${tarifa.id}</strong>.</p>
            <p style="color:#991b1b; background:#fef2f2; padding:10px; border-radius:7px; font-size:0.85rem; margin-top:8px;">
                <i class="fas fa-exclamation-triangle me-1"></i>
                La tarifa pasará a estado <strong>Rechazada</strong>. La tarifa anterior activa del cliente continuará vigente.
            </p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-times-circle me-1"></i> Sí, rechazar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
    });

    if (!confirm.isConfirmed) return;

    try {
      apBtnLoading('ap-btn-rechazar-todo', true);
      const resp = await apiFetch(
        `${AP_STATE.baseUrl}tarifas/${tarifa.id}/rechazar`,
        {
          method: 'POST',
          data: {
            usuario: AP_STATE.usuario,
            causa_id: causa_id || null,
            observacion: observacion || null,
          }
        }
      );

      if (!resp.success) throw new Error(resp.message);

      apFlash('info', 'Rechazada', `Tarifa #${tarifa.id} rechazada. La tarifa anterior sigue activa.`);
      apCerrarDetalle();
      await apCargar();

    } catch (err) {
      apFlash('error', 'Error al rechazar', err.message);
    } finally {
      apBtnLoading('ap-btn-rechazar-todo', false);
    }
  }

  /* ============================================================
     GUARDAR AJUSTE DE VALORES (sin aprobar todavía)
     ============================================================ */
  async function apGuardarAjuste() {
    const tarifa = AP_STATE.tarifaActual;
    if (!tarifa) return;

    const ajustes = apRecolectarAjustes();
    if (Object.keys(ajustes).length === 0) {
      apFlash('info', 'Sin cambios', 'No se detectaron cambios en los valores.');
      return;
    }

    try {
      apBtnLoading('ap-btn-guardar-ajuste', true);
      const resp = await apiFetch(
        `${AP_STATE.baseUrl}tarifas/${tarifa.id}/ajuste-aprobacion`,
        { method: 'PUT', data: { usuario: AP_STATE.usuario, ...ajustes } }
      );

      if (!resp.success) throw new Error(resp.message);

      // Actualizar datos locales
      AP_STATE.tarifaActual.tarifa = ajustes.plena || AP_STATE.tarifaActual.tarifa;
      apFlash('success', 'Ajuste guardado', 'Los valores fueron actualizados. Aún está pendiente de aprobación.');

    } catch (err) {
      apFlash('error', 'Error al guardar ajuste', err.message);
    } finally {
      apBtnLoading('ap-btn-guardar-ajuste', false);
    }
  }

  /* ============================================================
     APROBAR COMPONENTE INDIVIDUAL
     ============================================================ */
  async function apAprobarComponente(compId) {
    const confirm = await Swal.fire({
      title: '¿Aprobar este componente?',
      text: 'Si es el último pendiente, la tarifa completa se activará automáticamente.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar componente',
      confirmButtonColor: '#16a34a',
    });
    if (!confirm.isConfirmed) return;

    try {
      // Capturar valor ajustado si existe
      const inputAjuste = document.getElementById(`ajuste-${compId}`);
      const valorNuevo = inputAjuste ? parseFloat(inputAjuste.value) : null;

      const resp = await apiFetch(
        `${AP_STATE.baseUrl}tarifas/componentes/${compId}/aprobar`,
        {
          method: 'POST',
          data: {
            usuario: AP_STATE.usuario,
            valor_nuevo: valorNuevo,
          }
        }
      );

      if (!resp.success) throw new Error(resp.message);

      if (resp.auto_activada) {
        apFlash('success', '¡Tarifa activada!', 'Todos los componentes aprobados. La tarifa está ahora activa.');
        apCerrarDetalle();
        await apCargar();
      } else {
        apFlash('success', 'Componente aprobado', 'Quedan otros componentes por revisar.');
        // Refrescar el componente en UI
        await apRefrescarDetalle();
      }
    } catch (err) {
      apFlash('error', 'Error', err.message);
    }
  }

  /* ============================================================
     RECHAZAR COMPONENTE INDIVIDUAL
     ============================================================ */
  async function apRechazarComponente(compId) {
    const { value: obs } = await Swal.fire({
      title: 'Motivo de rechazo',
      input: 'textarea',
      inputLabel: 'Observación (opcional)',
      inputPlaceholder: 'Detalle el motivo del rechazo...',
      showCancelButton: true,
      confirmButtonText: 'Rechazar componente',
      confirmButtonColor: '#dc2626',
    });

    try {
      const resp = await apiFetch(
        `${AP_STATE.baseUrl}tarifas/componentes/${compId}/rechazar`,
        {
          method: 'POST',
          data: { usuario: AP_STATE.usuario, observacion: obs || null }
        }
      );

      if (!resp.success) throw new Error(resp.message);

      apFlash('info', 'Componente rechazado', 'La tarifa ha pasado a estado Rechazada.');
      apCerrarDetalle();
      await apCargar();

    } catch (err) {
      apFlash('error', 'Error', err.message);
    }
  }

  /* ============================================================
     APROBAR RÁPIDO DESDE LA TABLA (sin abrir offcanvas)
     ============================================================ */
  async function apAprobarRapido(id) {
    const tarifa = AP_STATE.data.find(t => t.id === id);
    if (!tarifa) return;

    const confirm = await Swal.fire({
      title: '¿Aprobar tarifa?',
      html: `
            <p><strong>Cliente:</strong> ${tarifa.cliente}</p>
            <p><strong>Ruta:</strong> ${tarifa.origen_nombre} → ${tarifa.destino_nombre}</p>
            <p><strong>Plena:</strong> ${apFormatCOP(tarifa.tarifa)}</p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-check-circle me-1"></i> Aprobar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#16a34a',
    });

    if (!confirm.isConfirmed) return;

    try {
      const resp = await apiFetch(
        `${AP_STATE.baseUrl}tarifas/${id}/aprobar`,
        { method: 'POST', data: { usuario: AP_STATE.usuario } }
      );

      if (!resp.success) throw new Error(resp.message);

      apFlash('success', '¡Aprobada!', `Tarifa #${id} activada correctamente.`);
      await apCargar();

    } catch (err) {
      apFlash('error', 'Error al aprobar', err.message);
    }
  }

  /* ============================================================
     RECHAZAR RÁPIDO DESDE LA TABLA
     ============================================================ */
  async function apRechazarRapido(id) {
    const tarifa = AP_STATE.data.find(t => t.id === id);
    if (!tarifa) return;

    const confirm = await Swal.fire({
      title: '¿Rechazar tarifa?',
      html: `<p><strong>Cliente:</strong> ${tarifa.cliente}</p><p><strong>Ruta:</strong> ${tarifa.origen_nombre} → ${tarifa.destino_nombre}</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Rechazar',
      confirmButtonColor: '#dc2626',
    });

    if (!confirm.isConfirmed) return;

    try {
      const resp = await apiFetch(
        `${AP_STATE.baseUrl}tarifas/${id}/rechazar`,
        { method: 'POST', data: { usuario: AP_STATE.usuario } }
      );

      if (!resp.success) throw new Error(resp.message);

      apFlash('info', 'Rechazada', `Tarifa #${id} rechazada.`);
      await apCargar();

    } catch (err) {
      apFlash('error', 'Error al rechazar', err.message);
    }
  }

  /* ============================================================
     HELPERS INTERNOS
     ============================================================ */

  /** Recolecta los valores modificados en los inputs de ajuste (escalares) */
  function apRecolectarAjustes() {
    const result = {};
    document.querySelectorAll('[id^="ajuste-"]').forEach(input => {
      const tipo = input.dataset.tipo;
      const valor = parseFloat(input.value);
      if (isNaN(valor)) return;

      const original = AP_STATE.tarifaActual?.componentes?.find(c => c.id === parseInt(input.dataset.compId));
      const valOrig = parseFloat(original?.valor || 0);

      if (Math.abs(valor - valOrig) > 0.001) {
        if (tipo === 'PLENA') result.plena = valor;
        if (tipo === 'MULTI_RECOGIDA') result.multi_recogida = valor;
        if (tipo === 'MULTI_ENTREGA') result.multi_entrega = valor;
      }
    });
    return result;
  }

  /**
   * Actualiza en tiempo real el total de un municipio cuando el usuario
   * modifica rate_1 o rate_2 en el input.
   */
  function apActualizarTotalMunicipio(detId) {
    const r1 = parseFloat(document.getElementById(`mun-r1-${detId}`)?.value || 0);
    const r2 = parseFloat(document.getElementById(`mun-r2-${detId}`)?.value || 0);
    const tot = document.getElementById(`mun-total-${detId}`);
    if (tot) tot.textContent = apFormatCOP(r1 + r2);
  }

  /**
   * Restaura los valores originales de un municipio (botón undo).
   */
  function apRestaurarMunicipio(detId, origR1, origR2) {
    const i1 = document.getElementById(`mun-r1-${detId}`);
    const i2 = document.getElementById(`mun-r2-${detId}`);
    if (i1) { i1.value = parseFloat(origR1).toFixed(2); }
    if (i2) { i2.value = parseFloat(origR2).toFixed(2); }
    apActualizarTotalMunicipio(detId);
  }

  /**
   * Recolecta los detalles editados de un componente Multi (origen/destino).
   * Devuelve array de { det_id, rate_1, rate_2 } SOLO con filas modificadas.
   */
  function apRecolectarDetallesMunicipio(compId) {
    const tarifa = AP_STATE.tarifaActual;
    if (!tarifa) return [];

    const comp = tarifa.componentes?.find(c => c.id === compId);
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

      // Solo incluir filas que cambiaron
      if (Math.abs(r1 - r1Orig) > 0.001 || Math.abs(r2 - r2Orig) > 0.001) {
        cambios.push({
          det_id: d.id,
          municipio_id: d.municipio_id,
          rate_1: r1,
          rate_2: r2,
        });
      }
    });

    return cambios;
  }

  /**
   * Guarda los cambios de rate_1/rate_2 por municipio de un componente Multi.
   * Llama al endpoint PUT tarifas/{id}/ajuste-aprobacion con los detalles.
   */
  async function apGuardarDetallesMunicipio(compId) {
    const tarifa = AP_STATE.tarifaActual;
    if (!tarifa) return;

    const cambios = apRecolectarDetallesMunicipio(compId);
    if (cambios.length === 0) {
      apFlash('info', 'Sin cambios', 'No se detectaron cambios en los municipios.');
      return;
    }

    const comp = tarifa.componentes?.find(c => c.id === compId);
    const tipoStr = comp?.tipo_label || `Componente #${compId}`;

    const confirmado = await Swal.fire({
      title: '¿Guardar cambios?',
      html: `
            <p>Se guardarán los ajustes de <strong>${tipoStr}</strong>.</p>
            <p style="color:#1d4ed8; background:#eff6ff; padding:10px; border-radius:7px; font-size:0.82rem; margin-top:8px;">
                <i class="fas fa-info-circle me-1"></i>
                Se modificarán <strong>${cambios.length} municipio(s)</strong>.
                La tarifa sigue en estado Pendiente hasta que se apruebe formalmente.
            </p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-save me-1"></i> Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0f766e',
    });

    if (!confirmado.isConfirmed) return;

    // Deshabilitar botón
    const btnEl = document.querySelector(`#ap-mun-card-${compId} .ap-mun-btn-guardar`);
    if (btnEl) { btnEl.disabled = true; btnEl.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Guardando...'; }

    try {
      const resp = await apiFetch(
        `${AP_STATE.baseUrl}tarifas/${tarifa.id}/ajuste-aprobacion`,
        {
          method: 'PUT',
          data: {
            usuario: AP_STATE.usuario,
            comp_id: compId,
            detalles_multi: cambios,   // array de { det_id, municipio_id, rate_1, rate_2 }
          }
        }
      );

      if (!resp.success) throw new Error(resp.message);

      // Actualizar datos locales en memoria para que el undo funcione correctamente
      if (comp?.detalles) {
        cambios.forEach(c => {
          const det = comp.detalles.find(d => d.id === c.det_id);
          if (det) { det.rate_1 = c.rate_1; det.rate_2 = c.rate_2; }
        });
      }

      apFlash('success', 'Municipios actualizados', `${cambios.length} municipio(s) de ${tipoStr} guardados correctamente.`);

    } catch (err) {
      apFlash('error', 'Error al guardar', err.message);
    } finally {
      if (btnEl) { btnEl.disabled = false; btnEl.innerHTML = '<i class="fas fa-save me-1"></i>Guardar cambios de municipios'; }
    }
  }

  /** Refresca el detalle del offcanvas volviendo a buscar la tarifa actual */
  async function apRefrescarDetalle() {
    if (!AP_STATE.tarifaActual) return;
    await apCargar();
    const updated = AP_STATE.data.find(t => t.id === AP_STATE.tarifaActual.id);
    if (updated) {
      AP_STATE.tarifaActual = updated;
      apRenderInfoGrid(updated);
      apRenderComponentes(updated);
    }
  }

  function apTableLoading() {
    document.getElementById('ap-tbody').innerHTML = `
        <tr><td colspan="12">
            <div style="padding:40px; text-align:center; color:var(--ap-gray);">
                <i class="fas fa-spinner fa-spin" style="font-size:1.5rem; margin-bottom:10px;"></i>
                <br>Consultando solicitudes...
            </div>
        </td></tr>`;
  }

  function apTableError(msg) {
    document.getElementById('ap-tbody').innerHTML = `
        <tr><td colspan="12">
            <div class="ap-empty">
                <div class="ap-empty-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="ap-empty-title">Error al cargar</div>
                <div class="ap-empty-sub">${msg}</div>
            </div>
        </td></tr>`;
  }

  function apBtnLoading(id, loading) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
      btn.dataset.origHtml = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Procesando...';
    } else {
      btn.innerHTML = btn.dataset.origHtml || btn.innerHTML;
    }
  }

  /* ============================================================
     RENDER HELPERS
     ============================================================ */
  function apRenderVigencia(vigencia) {
    if (!vigencia) return '<span style="color:var(--ap-gray);">—</span>';
    const colores = { vencida: 'danger', por_vencer: 'warning', vigente: 'success', no_iniciada: 'info' };
    const labels = { vencida: 'Vencida', por_vencer: 'Por vencer', vigente: 'Vigente', no_iniciada: 'No iniciada' };
    const estado = vigencia.estado || 'indefinido';
    const color = colores[estado] || 'secondary';
    const label = labels[estado] || estado;
    return `<span class="badge bg-${color}">${label}</span>`;
  }

  function apFormatCOP(valor) {
    if (!valor && valor !== 0) return '—';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(valor);
  }

  function apFormatVehiculo(tipo) {
    if (!tipo) return '—';
    const map = {
      'TURBO': 'Turbo',
      'SENCILLO': 'Sencillo',
      'DOBLETROQUE': 'Doble Troque',
      'TRACTOMULA': 'Tractomula',
      'MINIMULA': 'Minimula',
      'NHR': 'NHR',
    };
    return map[tipo?.toUpperCase()] || tipo;
  }

  function apFmtFecha(f) {
    if (!f) return '—';
    const d = new Date(f + 'T00:00:00');
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  /* ============================================================
     FLASH NOTIFICATIONS
     ============================================================ */
  let _flashTimer = null;

  function apFlash(type, title, msg) {
    const el = document.getElementById('ap-flash');
    if (!el) return;

    el.className = `ap-flash ${type}`;
    document.getElementById('ap-flash-title').textContent = title;
    document.getElementById('ap-flash-msg').textContent = msg;

    // const iconMap = { success: 'fas fa-check-circle', error: 'fas fa-times-circle', info: 'fas fa-info-circle' };
    // document.getElementById('ap-flash-icon').className = (iconMap[type] || 'fas fa-info-circle') + ' ';

    requestAnimationFrame(() => el.classList.add('show'));

    clearTimeout(_flashTimer);
    _flashTimer = setTimeout(apFlashHide, 4500);
  }

  function apFlashHide() {
    const el = document.getElementById('ap-flash');
    if (el) el.classList.remove('show');
  }

  /* ============================================================
     API FETCH HELPER (reutiliza el existente o define uno propio)
     ============================================================ */
  async function apiFetch(url, { method = 'GET', data = null } = {}) {
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'nexos_nacional2026@*',
        'Accept': 'application/json',
      },
    };
    if (data && method !== 'GET') opts.body = JSON.stringify(data);

    const resp = await fetch(url, opts);
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.message || `Error HTTP ${resp.status}`);
    }
    return resp.json();
  }

  async function CausalesAprobacion() {
    try {
      const response = await fetch($('#base_url_api').val() + 'tarifas/listar-causales', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 'X-Requested-With': 'XMLHttpRequest',
          'X-API-KEY': 'nexos_nacional2026@*',
        },
        cache: 'no-cache',
      });

      const data = await response.json();

      // 👉 guardar en memoria global para reutilizar
      window.municipiosData = data;

      // 👉 recorrer todos los selects
      $('#ap-causa-id').each(function () {
        const $select = $(this);
        $select.empty().append('<option value="">Seleccione una Causal</option>');

        data.data.forEach(function (element) {
          $select.append(
            `<option value="${element.id}" data-municipio="${element.id}" data-depto="${element.causal_aprobacion}">
                          ${element.causal_aprobacion}
           </option>`
          );
        });

        // reinicializar select2
        // $select.select2({
        //   placeholder: 'Seleccione un municipio',
        //   allowClear: true,
        //   width: '100%'
        // });
      });

    } catch (error) {
      console.error('Error en Municipios:', error);
      throw error;
    }
  }

  async function Listar_Clientes() {
    try {
      // 1. Definimos los IDs de los selects que queremos afectar
      const selectIds = ["#f_cliente_aprobacion"];

      const resp = await fetch(
        $("#base_url").val() + "indicadores/ListarClientes",
        {
          method: "POST",
        },
      );

      const data = await resp.json();

      // 2. Iteramos sobre cada ID para llenarlos e inicializar TomSelect
      selectIds.forEach((id) => {
        const selectElement = document.querySelector(id);
        if (!selectElement) return; // Si el elemento no existe en la página actual, saltar

        // Limpiar y agregar opción inicial vacía (necesaria para el placeholder)
        selectElement.innerHTML = `<option value=""></option>`;

        if (!data || data.length === 0) {
          let opt = document.createElement("option");
          opt.value = "";
          opt.textContent = "⚠️ No hay clientes disponibles";
          selectElement.appendChild(opt);
        } else {
          // Llenar con la data del servidor
          data.forEach((item) => {
            let opt = document.createElement("option");
            opt.value = item.id;
            opt.textContent = item.nombre;
            selectElement.appendChild(opt);
          });
        }

        // 3. Destruir instancia previa si existe (evita errores de duplicidad)
        if (selectElement.tomselect) {
          selectElement.tomselect.destroy();
        }

        // 4. Inicializar TomSelect con el placeholder
        new TomSelect(id, {
          create: false, // Usualmente para tipos de vehículos no quieres que el usuario invente nuevos
          placeholder: "Seleccione un vehículo...",
          allowEmptyOption: true,
          sortField: {
            field: "text",
            direction: "asc",
          },
          onInitialize: function () {
            // Aplicar clases de Bootstrap para mantener el diseño uniforme
            this.control.classList.add("form-control", "form-control-sm");
          },
        });
      });
    } catch (error) {
      console.error("Error al listar cliente:", error);
      Swal.fire("Error", "No se pudo cargar la lista de clientes", "error");
    }
  }

  /* ============================================================
     AUTO-INICIO
     (Si el módulo se carga con window.initScript, usar ese patrón)
     ============================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apInit, Listar_Clientes);
  } else {
    apInit();
    Listar_Clientes();
  }

  /* ============================================================
     EXPOSICIÓN GLOBAL (para onclick= inline del phtml)
     ============================================================ */
  window.apInit = apInit;
  window.apCargar = apCargar;
  window.apAbrirDetalle = apAbrirDetalle;
  window.apCerrarDetalle = apCerrarDetalle;
  window.apAprobarTarifa = apAprobarTarifa;
  window.apRechazarTarifa = apRechazarTarifa;
  window.apGuardarAjuste = apGuardarAjuste;
  window.apAprobarComponente = apAprobarComponente;
  window.apRechazarComponente = apRechazarComponente;
  window.apAprobarRapido = apAprobarRapido;
  window.apRechazarRapido = apRechazarRapido;
  window.apFiltrarTabla = apFiltrarTabla;
  window.apLimpiarFiltros = apLimpiarFiltros;
  window.apFlashHide = apFlashHide;
  window.apActualizarTotalMunicipio = apActualizarTotalMunicipio;
  window.apRestaurarMunicipio = apRestaurarMunicipio;
  window.apGuardarDetallesMunicipio = apGuardarDetallesMunicipio;
  window.CausalesAprobacion = CausalesAprobacion;

  window.initScript = function (id) {
    window.VENTANA = id;
    apInit();
  };

})();