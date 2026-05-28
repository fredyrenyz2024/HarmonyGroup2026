/**
 * =============================================================================
 * INDICADORES E INFORMES DE COSTOS — REQ 26 al 35
 * indicadores_informes.js
 *
 * ENDPOINTS:
 *  [26] GET {API}/tarifas-costos/indicadores/tarifas-actualizadas?empresa_id=X
 *  [27] GET {API}/tarifas-costos/indicadores/ahorro-sobrecosto?empresa_id=X&fecha_desde=Y&fecha_hasta=Z[&con_detalle=1]
 *  [28] GET {API}/tarifas-costos/indicadores/ahorro-sobrecosto-ruta?...[&con_detalle=1&origen=A&destino=B]
 *  [29] GET {API}/tarifas-costos/indicadores/ahorro-sobrecosto-vehiculo?...[&con_detalle=1&tipo_vehiculo=V]
 *  [30] GET {API}/tarifas-costos/indicadores/ahorro-sobrecosto-despachador?...[&con_detalle=1&despachador=U]
 *  [31] GET {API}/tarifas-costos/indicadores/aprobaciones-despachador?...[&con_detalle=1&despachador=U]
 *  [32] GET {API}/tarifas-costos/informes/tarifas-vigentes?empresa_id=X[&origen=A&destino=B&tipo_vehiculo=V&estado_tarifa=S&fuente=F]
 *  [33] GET {API}/tarifas-costos/informes/ahorros-por-ruta?...  (fuente: cmx_manifiesto)
 *  [34] GET {API}/tarifas-costos/informes/ahorros-por-vehiculo?...
 *  [35] GET {API}/tarifas-costos/informes/ahorros-por-despachador?...
 * =============================================================================
 */

/* ─────────────────────────────────────────────
   ESTADO GLOBAL
───────────────────────────────────────────── */
window._ind_dataRuta = [];
window._ind_dataVehiculo = [];
window._ind_dataDespachador = [];
window._ind_dataAprobaciones = [];
window._ind_dataTarifasVig = [];
window._ind_dataInformeRuta = [];
window._ind_dataInformeVeh = [];
window._ind_dataInformeDes = [];

/* =============================================================================
   AUTO-INIT
   ============================================================================= */
document.addEventListener('DOMContentLoaded', () => {
  _indInitFechas();
});

/* =============================================================================
   TABS
   ============================================================================= */
// window.switchTab = function (tabId) {
//   /* Usar setProperty con !important para que no sea sobreescrito por CSS del sistema */
//   document.querySelectorAll('.tab-content').forEach(c => {
//     c.style.setProperty('display', 'none', 'important');
//     c.classList.remove('active');
//   });
//   document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
//   const el = document.getElementById('tab-' + tabId);
//   if (el) {
//     el.style.setProperty('display', 'block', 'important');
//     el.classList.add('active');
//   }
//   document.querySelectorAll('.tab-btn').forEach(b => {
//     if (b.getAttribute('onclick')?.includes(`'${tabId}'`)) b.classList.add('active');
//   });
// };

window.switchTab = function (tabId) {
  setTimeout(function () {
    document.querySelectorAll('.tab-content').forEach(c => {
      c.style.setProperty('display', 'none', 'important');
      c.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    const el = document.getElementById('tab-' + tabId);
    if (el) {
      el.style.setProperty('display', 'block', 'important');
      el.classList.add('active');
    }
    document.querySelectorAll('.tab-btn').forEach(b => {
      if (b.getAttribute('onclick')?.includes(`'${tabId}'`)) b.classList.add('active');
    });
  }, 0); // delay mínimo para ganarle al sistema
};

/* =============================================================================
   REQ 26 — % TARIFAS ACTUALIZADAS
   ============================================================================= */
window.cargarTarifasActualizadas = async function () {
  const empId = document.getElementById('empresa_id')?.value ?? '';
  if (!empId) { _indFlash('error', 'Error', 'No se pudo determinar la empresa.'); return; }

  _indTexto('ita-pct', '...');
  _indTexto('ita-act', '...');
  _indTexto('ita-req', '...');

  try {
    const resp = await _indFetch(`/tarifas-costos/indicadores/tarifas-actualizadas?empresa_id=${empId}`);
    const result = await resp.json();

    if (!result.success) {
      _indFlash('error', 'Error', result.message ?? 'No se pudo calcular el indicador.');
      return;
    }

    const pct = result.valor ?? 0;
    _indTexto('ita-pct', pct + '%');
    _indTexto('ita-act', _indNum(result.actualizadas));
    _indTexto('ita-req', _indNum(result.total_requeridas));
    _indTexto('ita-semana', `semana ${result.semana_actual} / ${result.anio_actual}`);

    const el = document.getElementById('ita-pct');
    if (el) el.style.color = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--yellow)' : 'var(--red)';

  } catch (err) {
    console.error('cargarTarifasActualizadas error:', err);
    _indFlash('error', 'Error de conexión', err.message);
  }
};

/* =============================================================================
   REQ 27 — AHORRO / SOBRECOSTO GLOBAL
   ============================================================================= */
window.cargarIndicadorGlobal = async function (conDetalle) {
  const params = _indFechaParams('ig-desde', 'ig-hasta');
  if (!params) return;
  if (conDetalle) params.set('con_detalle', '1');

  _indLimpiarStats('ig-ratio', 'ig-planificado', 'ig-ejecutado', 'ig-diferencia', 'ig-operaciones');

  try {
    const resp = await _indFetch(`/tarifas-costos/indicadores/ahorro-sobrecosto?${params}`);
    const result = await resp.json();

    if (!result.success) {
      _indFlash('error', 'Error', result.message ?? 'No se pudo calcular.');
      return;
    }

    const ratio = result.ratio;
    const interp = result.interpretacion ?? {};

    _indTexto('ig-ratio', ratio !== null ? ratio : 'N/D');
    _indTexto('ig-planificado', _indFormatCOP(result.total_planificado));
    _indTexto('ig-ejecutado', _indFormatCOP(result.total_ejecutado));
    _indTexto('ig-operaciones', _indNum(result.total_operaciones));
    _indTexto('ig-interpretacion', interp.label ?? '—');

    const difEl = document.getElementById('ig-diferencia');
    if (difEl) {
      const dif = result.diferencia_monto ?? 0;
      difEl.textContent = _indFormatCOP(Math.abs(dif));
      difEl.style.color = dif >= 0 ? 'var(--green)' : 'var(--red)';
    }

    const ratioEl = document.getElementById('ig-ratio');
    if (ratioEl && ratio !== null) {
      ratioEl.style.color = ratio > 1 ? 'var(--green)' : ratio < 1 ? 'var(--red)' : 'var(--navy)';
    }

    if (conDetalle && result.detalle?.length) {
      const drill = document.getElementById('ig-drill');
      document.getElementById('ig-drill-table').innerHTML = _indRenderDrillOperaciones(result.detalle);
      if (drill) {
        drill.style.display = 'block';
        drill.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

  } catch (err) {
    console.error('cargarIndicadorGlobal error:', err);
    _indFlash('error', 'Error de conexión', err.message);
  }
};

/* =============================================================================
   REQ 28 — AHORRO / SOBRECOSTO POR RUTA
   ============================================================================= */
window.cargarIndicadorRuta = async function () {
  const params = _indFechaParams('ir-desde', 'ir-hasta');
  if (!params) return;

  _indLoading('ir-tbl', 'Calculando ahorros por ruta...');

  try {
    const resp = await _indFetch(`/tarifas-costos/indicadores/ahorro-sobrecosto-ruta?${params}`);
    const result = await resp.json();

    if (!result.success) { _indError('ir-tbl', result.message); return; }

    window._ind_dataRuta = result.resumen ?? [];
    _indRenderResumenRuta(window._ind_dataRuta);

  } catch (err) {
    console.error('cargarIndicadorRuta error:', err);
    _indError('ir-tbl', err.message);
  }
};

window.drillRuta = async function (origen, destino) {
  const params = _indFechaParams('ir-desde', 'ir-hasta');
  if (!params) return;
  params.set('con_detalle', '1');
  params.set('origen', origen);
  params.set('destino', destino);

  _indTexto('ir-drill-title', `Detalle: ${origen} → ${destino}`);
  document.getElementById('ir-drill-table').innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
  document.getElementById('ir-drill').style.display = 'block';

  try {
    const resp = await _indFetch(`/tarifas-costos/indicadores/ahorro-sobrecosto-ruta?${params}`);
    const result = await resp.json();
    document.getElementById('ir-drill-table').innerHTML = result.detalle?.length
      ? _indRenderDrillOperaciones(result.detalle)
      : '<div class="empty-state"><div class="empty-text">Sin detalles</div></div>';
  } catch (err) {
    document.getElementById('ir-drill-table').innerHTML = '<div class="empty-state"><div class="empty-text">Error al cargar.</div></div>';
  }

  document.getElementById('ir-drill').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* =============================================================================
   REQ 29 — AHORRO / SOBRECOSTO POR TIPO VEHÍCULO
   ============================================================================= */
window.cargarIndicadorVehiculo = async function () {
  const params = _indFechaParams('iv-desde', 'iv-hasta');
  if (!params) return;

  _indLoading('iv-tbl', 'Calculando por tipo de vehículo...');

  try {
    const resp = await _indFetch(`/tarifas-costos/indicadores/ahorro-sobrecosto-vehiculo?${params}`);
    const result = await resp.json();

    if (!result.success) { _indError('iv-tbl', result.message); return; }

    window._ind_dataVehiculo = result.resumen ?? [];
    _indRenderResumenVehiculo(window._ind_dataVehiculo);

  } catch (err) {
    console.error('cargarIndicadorVehiculo error:', err);
    _indError('iv-tbl', err.message);
  }
};

window.drillVehiculo = async function (tipoVehiculo) {
  const params = _indFechaParams('iv-desde', 'iv-hasta');
  if (!params) return;
  params.set('con_detalle', '1');
  params.set('tipo_vehiculo', tipoVehiculo);

  _indTexto('iv-drill-title', `Detalle: ${tipoVehiculo}`);
  document.getElementById('iv-drill-table').innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
  document.getElementById('iv-drill').style.display = 'block';

  try {
    const resp = await _indFetch(`/tarifas-costos/indicadores/ahorro-sobrecosto-vehiculo?${params}`);
    const result = await resp.json();
    document.getElementById('iv-drill-table').innerHTML = result.detalle?.length
      ? _indRenderDrillOperaciones(result.detalle)
      : '<div class="empty-state"><div class="empty-text">Sin detalles</div></div>';
  } catch (err) {
    document.getElementById('iv-drill-table').innerHTML = '<div class="empty-state"><div class="empty-text">Error</div></div>';
  }

  document.getElementById('iv-drill').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* =============================================================================
   REQ 30 — AHORRO / SOBRECOSTO POR DESPACHADOR
   ============================================================================= */
window.cargarIndicadorDespachador = async function () {
  const params = _indFechaParams('id-desde', 'id-hasta');
  if (!params) return;

  _indLoading('id-tbl', 'Calculando por despachador...');

  try {
    const resp = await _indFetch(`/tarifas-costos/indicadores/ahorro-sobrecosto-despachador?${params}`);
    const result = await resp.json();

    if (!result.success) { _indError('id-tbl', result.message); return; }

    window._ind_dataDespachador = result.resumen ?? [];
    _indRenderResumenDespachador(window._ind_dataDespachador);

  } catch (err) {
    console.error('cargarIndicadorDespachador error:', err);
    _indError('id-tbl', err.message);
  }
};

window.drillDespachador = async function (despachador) {
  const params = _indFechaParams('id-desde', 'id-hasta');
  if (!params) return;
  params.set('con_detalle', '1');
  params.set('despachador', despachador);

  _indTexto('id-drill-title', `Detalle: ${despachador}`);
  document.getElementById('id-drill-table').innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
  document.getElementById('id-drill').style.display = 'block';

  try {
    const resp = await _indFetch(`/tarifas-costos/indicadores/ahorro-sobrecosto-despachador?${params}`);
    const result = await resp.json();
    document.getElementById('id-drill-table').innerHTML = result.detalle?.length
      ? _indRenderDrillOperaciones(result.detalle)
      : '<div class="empty-state"><div class="empty-text">Sin detalles</div></div>';
  } catch (err) {
    document.getElementById('id-drill-table').innerHTML = '<div class="empty-state"><div class="empty-text">Error</div></div>';
  }

  document.getElementById('id-drill').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* =============================================================================
   REQ 31 — % APROBACIONES POR DESPACHADOR
   ============================================================================= */
window.cargarAprobaciones = async function () {
  const params = _indFechaParams('ia-desde', 'ia-hasta');
  if (!params) return;

  _indLoading('ia-tbl', 'Calculando solicitudes de aprobación...');

  try {
    const resp = await _indFetch(`/tarifas-costos/indicadores/aprobaciones-despachador?${params}`);
    const result = await resp.json();

    if (!result.success) { _indError('ia-tbl', result.message); return; }

    window._ind_dataAprobaciones = result.resumen ?? [];
    _indRenderAprobaciones(window._ind_dataAprobaciones);

  } catch (err) {
    console.error('cargarAprobaciones error:', err);
    _indError('ia-tbl', err.message);
  }
};

window.cargarAprobacionesDetalle = async function () {
  const params = _indFechaParams('ia-desde', 'ia-hasta');
  if (!params) return;
  params.set('con_detalle', '1');

  const drill = document.getElementById('ia-drill');
  document.getElementById('ia-drill-table').innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
  drill.style.display = 'block';

  try {
    const resp = await _indFetch(`/tarifas-costos/indicadores/aprobaciones-despachador?${params}`);
    const result = await resp.json();

    document.getElementById('ia-drill-table').innerHTML = result.detalle?.length
      ? _indRenderDrillAprobaciones(result.detalle)
      : '<div class="empty-state"><div class="empty-text">Sin detalles</div></div>';

    if (result.resumen?.length) _indRenderAprobaciones(result.resumen);

  } catch (err) {
    document.getElementById('ia-drill-table').innerHTML = '<div class="empty-state"><div class="empty-text">Error</div></div>';
  }

  drill.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.drillAprobacion = async function (despachador) {
  const params = _indFechaParams('ia-desde', 'ia-hasta');
  if (!params) return;
  params.set('con_detalle', '1');
  params.set('despachador', despachador);

  const drill = document.getElementById('ia-drill');
  document.getElementById('ia-drill-table').innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
  drill.style.display = 'block';

  try {
    const resp = await _indFetch(`/tarifas-costos/indicadores/aprobaciones-despachador?${params}`);
    const result = await resp.json();
    document.getElementById('ia-drill-table').innerHTML = result.detalle?.length
      ? _indRenderDrillAprobaciones(result.detalle)
      : '<div class="empty-state"><div class="empty-text">Sin detalles</div></div>';
  } catch (err) {
    document.getElementById('ia-drill-table').innerHTML = '<div class="empty-state"><div class="empty-text">Error</div></div>';
  }

  drill.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* =============================================================================
   REQ 32 — INFORME TARIFAS VIGENTES
   ============================================================================= */
window.cargarTarifasVigentes = async function () {
  const empId = document.getElementById('empresa_id')?.value ?? '';
  const origen = document.getElementById('inf-v-origen')?.value?.trim() ?? '';
  const destino = document.getElementById('inf-v-destino')?.value?.trim() ?? '';
  const vehiculo = document.getElementById('inf-v-vehiculo')?.value?.trim() ?? '';
  const estado = document.getElementById('inf-v-estado')?.value ?? '';
  const fuente = document.getElementById('inf-v-fuente')?.value ?? '';

  const params = new URLSearchParams({ empresa_id: empId });
  if (origen) params.set('origen', origen);
  if (destino) params.set('destino', destino);
  if (vehiculo) params.set('tipo_vehiculo', vehiculo);
  if (estado) params.set('estado_tarifa', estado);
  if (fuente) params.set('fuente', fuente);

  _indLoading('inf-v-tbl', 'Cargando tarifas...');

  try {
    const resp = await _indFetch(`/tarifas-costos/informes/tarifas-vigentes?${params}`);
    const result = await resp.json();

    if (!result.success) { _indError('inf-v-tbl', result.message); return; }

    window._ind_dataTarifasVig = result.data ?? [];
    _indTexto('inf-v-count-txt', window._ind_dataTarifasVig.length + ' tarifas');
    _indMostrar('inf-v-count');
    _indRenderTarifasVigentes(window._ind_dataTarifasVig);

  } catch (err) {
    console.error('cargarTarifasVigentes error:', err);
    _indError('inf-v-tbl', err.message);
  }
};

window.exportarInformeTarifas = function () {
  const empId = document.getElementById('empresa_id')?.value ?? '';
  const origen = document.getElementById('inf-v-origen')?.value?.trim() ?? '';
  const destino = document.getElementById('inf-v-destino')?.value?.trim() ?? '';
  const vehiculo = document.getElementById('inf-v-vehiculo')?.value?.trim() ?? '';

  const params = new URLSearchParams({ empresa_id: empId, exportar: '1' });
  if (origen) params.set('origen', origen);
  if (destino) params.set('destino', destino);
  if (vehiculo) params.set('tipo_vehiculo', vehiculo);

  window.location.href = `${document.getElementById('base_url_api')?.value ?? ''}tarifas-costos/informes/tarifas-vigentes?${params}`;
};

/* =============================================================================
   REQ 33 — INFORME AHORROS POR RUTA  (fuente: cmx_manifiesto)
   ============================================================================= */
window.cargarInformeAhorrosRuta = async function () {
  const params = _indFechaParams('infar-desde', 'infar-hasta');
  if (!params) return;

  const origen = document.getElementById('infar-origen')?.value?.trim() ?? '';
  const destino = document.getElementById('infar-destino')?.value?.trim() ?? '';
  if (origen) params.set('origen', origen);
  if (destino) params.set('destino', destino);

  _indLoading('infar-tbl', 'Generando informe por ruta...');

  try {
    const resp = await _indFetch(`/tarifas-costos/informes/ahorros-por-ruta?${params}`);
    const result = await resp.json();

    if (!result.success) { _indError('infar-tbl', result.message); return; }

    window._ind_dataInformeRuta = result.data ?? [];
    _indRenderInformeAhorros('infar', window._ind_dataInformeRuta, result.totales ?? {});

  } catch (err) {
    console.error('cargarInformeAhorrosRuta error:', err);
    _indError('infar-tbl', err.message);
  }
};

/* =============================================================================
   REQ 34 — INFORME AHORROS POR VEHÍCULO  (fuente: cmx_manifiesto)
   ============================================================================= */
window.cargarInformeAhorrosVehiculo = async function () {
  const params = _indFechaParams('infav-desde', 'infav-hasta');
  if (!params) return;

  const vehiculo = document.getElementById('infav-vehiculo')?.value?.trim() ?? '';
  if (vehiculo) params.set('tipo_vehiculo', vehiculo);

  _indLoading('infav-tbl', 'Generando informe por vehículo...');

  try {
    const resp = await _indFetch(`/tarifas-costos/informes/ahorros-por-vehiculo?${params}`);
    const result = await resp.json();

    if (!result.success) { _indError('infav-tbl', result.message); return; }

    window._ind_dataInformeVeh = result.data ?? [];
    _indRenderInformeAhorros('infav', window._ind_dataInformeVeh, result.totales ?? {});

  } catch (err) {
    console.error('cargarInformeAhorrosVehiculo error:', err);
    _indError('infav-tbl', err.message);
  }
};

/* =============================================================================
   REQ 35 — INFORME AHORROS POR DESPACHADOR  (fuente: cmx_manifiesto)
   ============================================================================= */
window.cargarInformeAhorrosDespachador = async function () {
  const params = _indFechaParams('infad-desde', 'infad-hasta');
  if (!params) return;

  const despachador = document.getElementById('infad-despachador')?.value?.trim() ?? '';
  if (despachador) params.set('despachador', despachador);

  _indLoading('infad-tbl', 'Generando informe por despachador...');

  try {
    const resp = await _indFetch(`/tarifas-costos/informes/ahorros-por-despachador?${params}`);
    const result = await resp.json();

    if (!result.success) { _indError('infad-tbl', result.message); return; }

    window._ind_dataInformeDes = result.data ?? [];
    _indRenderInformeAhorros('infad', window._ind_dataInformeDes, result.totales ?? {});

  } catch (err) {
    console.error('cargarInformeAhorrosDespachador error:', err);
    _indError('infad-tbl', err.message);
  }
};

/* =============================================================================
   EXPORTAR EXCEL — SheetJS
   ============================================================================= */
window.exportarTabla = function (tblWrapId, filename) {
  const wrap = document.getElementById(tblWrapId);
  const table = wrap?.querySelector('table');
  if (!table) { _indFlash('warning', 'Atención', 'No hay datos para exportar.'); return; }
  if (!window.XLSX) { _indFlash('error', 'Error', 'SheetJS no disponible.'); return; }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(table);
  XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  _indFlash('success', 'Exportado', 'Archivo generado correctamente.');
};

window.exportarDrill = function (drillContentId, filename) {
  window.exportarTabla(drillContentId, filename);
};

/* =============================================================================
   FUNCIONES DE RENDER INTERNAS (también en window para acceso desde HTML)
   ============================================================================= */
window._indRenderResumenRuta = function (data) {
  if (!data.length) { _indVacio('ir-tbl', 'Sin operaciones en el período'); return; }

  const totPlan = data.reduce((s, d) => s + (d.total_planificado ?? 0), 0);
  const totEjec = data.reduce((s, d) => s + (d.total_ejecutado ?? 0), 0);
  const totDif = data.reduce((s, d) => s + (d.diferencia_monto ?? 0), 0);

  _indTexto('ir-tot-plan', _indFormatCOP(totPlan));
  _indTexto('ir-tot-ejec', _indFormatCOP(totEjec));
  _indFooterDif('ir-tot-dif', totDif);
  _indMostrar('ir-footer');

  const rows = data.map(d => {
    const [cls, txt] = _indResultadoClsTxt(d.interpretacion?.estado);
    return `<tr>
            <td>
                <div style="font-weight:700;color:var(--navy);font-size:.78rem">${_indEsc(d.origen_nombre ?? d.origen)}</div>
                <div style="font-size:.63rem;color:var(--muted)">→ ${_indEsc(d.destino_nombre ?? d.destino)}</div>
            </td>
            <td style="font-weight:700;">${_indFormatCOP(d.total_planificado)}</td>
            <td style="font-weight:700;">${_indFormatCOP(d.total_ejecutado)}</td>
            <td style="font-weight:700;color:${(d.diferencia_monto ?? 0) >= 0 ? 'var(--green)' : 'var(--red)'};">${_indFormatCOP(Math.abs(d.diferencia_monto))}</td>
            <td style="font-family:'DM Mono',monospace;font-weight:700;color:${d.ratio > 1 ? 'var(--green)' : d.ratio < 1 ? 'var(--red)' : 'var(--navy)'}">${d.ratio ?? '—'}</td>
            <td><span class="badge ${cls}">${txt}</span></td>
            <td style="font-family:'DM Mono',monospace;font-size:.68rem">${_indNum(d.total_operaciones)}</td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="window.drillRuta('${_indEsc(d.origen)}','${_indEsc(d.destino)}')">
                    <i class="fas fa-search-plus"></i> Detalle
                </button>
            </td>
        </tr>`;
  }).join('');

  document.getElementById('ir-tbl').innerHTML = `<table>
        <thead><tr>
            <th>Ruta</th><th>Planificado</th><th>Ejecutado</th>
            <th>Diferencia</th><th>Ratio</th><th>Resultado</th><th>Ops.</th><th></th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table>`;

  _indAgregarFiltro('ir-filter', 'ir-tbl');
};

window._indRenderResumenVehiculo = function (data) {
  if (!data.length) { _indVacio('iv-tbl', 'Sin operaciones en el período'); return; }

  const totPlan = data.reduce((s, d) => s + (d.total_planificado ?? 0), 0);
  const totEjec = data.reduce((s, d) => s + (d.total_ejecutado ?? 0), 0);
  const totDif = data.reduce((s, d) => s + (d.diferencia_monto ?? 0), 0);

  _indTexto('iv-tot-plan', _indFormatCOP(totPlan));
  _indTexto('iv-tot-ejec', _indFormatCOP(totEjec));
  _indFooterDif('iv-tot-dif', totDif);
  _indMostrar('iv-footer');

  const rows = data.map(d => {
    const [cls, txt] = _indResultadoClsTxt(d.interpretacion?.estado);
    return `<tr>
            <td><span style="background:rgba(15,31,61,.07);padding:3px 9px;border-radius:5px;font-weight:700;font-size:.72rem">${_indEsc(d.tipo_vehiculo)}</span></td>
            <td style="font-weight:700;">${_indFormatCOP(d.total_planificado)}</td>
            <td style="font-weight:700;">${_indFormatCOP(d.total_ejecutado)}</td>
            <td style="font-weight:700;color:${(d.diferencia_monto ?? 0) >= 0 ? 'var(--green)' : 'var(--red)'};">${_indFormatCOP(Math.abs(d.diferencia_monto))}</td>
            <td style="font-family:'DM Mono',monospace;font-weight:700;color:${d.ratio > 1 ? 'var(--green)' : d.ratio < 1 ? 'var(--red)' : 'var(--navy)'}">${d.ratio ?? '—'}</td>
            <td><span class="badge ${cls}">${txt}</span></td>
            <td style="font-family:'DM Mono',monospace;font-size:.68rem">${_indNum(d.total_operaciones)}</td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="window.drillVehiculo('${_indEsc(d.tipo_vehiculo)}')">
                    <i class="fas fa-search-plus"></i> Detalle
                </button>
            </td>
        </tr>`;
  }).join('');

  document.getElementById('iv-tbl').innerHTML = `<table>
        <thead><tr>
            <th>Tipo Vehículo</th><th>Planificado</th><th>Ejecutado</th>
            <th>Diferencia</th><th>Ratio</th><th>Resultado</th><th>Ops.</th><th></th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table>`;
};

window._indRenderResumenDespachador = function (data) {
  if (!data.length) { _indVacio('id-tbl', 'Sin operaciones en el período'); return; }

  const totPlan = data.reduce((s, d) => s + (d.total_planificado ?? 0), 0);
  const totEjec = data.reduce((s, d) => s + (d.total_ejecutado ?? 0), 0);
  const totDif = data.reduce((s, d) => s + (d.diferencia_monto ?? 0), 0);
  const maxOps = Math.max(...data.map(d => d.total_operaciones ?? 0), 1);

  _indTexto('id-tot-plan', _indFormatCOP(totPlan));
  _indTexto('id-tot-ejec', _indFormatCOP(totEjec));
  _indFooterDif('id-tot-dif', totDif);
  _indMostrar('id-footer');

  const rows = data.map(d => {
    const [cls, txt] = _indResultadoClsTxt(d.interpretacion?.estado);
    const pct = Math.round(((d.total_operaciones ?? 0) / maxOps) * 100);
    return `<tr>
            <td style="font-weight:600;color:var(--navy)">${_indEsc(d.despachador)}</td>
            <td style="font-weight:700;">${_indFormatCOP(d.total_planificado)}</td>
            <td style="font-weight:700;">${_indFormatCOP(d.total_ejecutado)}</td>
            <td style="font-weight:700;color:${(d.diferencia_monto ?? 0) >= 0 ? 'var(--green)' : 'var(--red)'};">${_indFormatCOP(Math.abs(d.diferencia_monto))}</td>
            <td style="font-family:'DM Mono',monospace;font-weight:700;color:${d.ratio > 1 ? 'var(--green)' : d.ratio < 1 ? 'var(--red)' : 'var(--navy)'}">${d.ratio ?? '—'}</td>
            <td><span class="badge ${cls}">${txt}</span></td>
            <td>
                <div class="num-cell">
                    <span class="num-mono">${_indNum(d.total_operaciones)}</span>
                    <div class="bar-wrap"><div class="bar-fill" style="width:${pct}%"></div></div>
                </div>
            </td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="window.drillDespachador('${_indEsc(d.despachador)}')">
                    <i class="fas fa-search-plus"></i> Detalle
                </button>
            </td>
        </tr>`;
  }).join('');

  document.getElementById('id-tbl').innerHTML = `<table>
        <thead><tr>
            <th>Despachador</th><th>Planificado</th><th>Ejecutado</th>
            <th>Diferencia</th><th>Ratio</th><th>Resultado</th><th>Ops.</th><th></th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table>`;
};

window._indRenderAprobaciones = function (data) {
  if (!data.length) { _indVacio('ia-tbl', 'Sin datos en el período'); return; }

  const rows = data.map(d => {
    const pct = d.porcentaje ?? 0;
    const color = pct > 30 ? 'var(--red)' : pct > 15 ? 'var(--yellow)' : 'var(--green)';
    const barW = Math.min(pct, 100);
    return `<tr>
            <td style="font-weight:600;color:var(--navy)">${_indEsc(d.despachador)}</td>
            <td style="font-family:'DM Mono',monospace;font-weight:700">${_indNum(d.total_despachos)}</td>
            <td style="font-family:'DM Mono',monospace;font-weight:700;color:var(--red)">${_indNum(d.total_aprobaciones)}</td>
            <td>
                <div style="display:flex;align-items:center;gap:8px">
                    <span style="font-weight:800;font-family:'DM Mono',monospace;color:${color};min-width:48px">${pct}%</span>
                    <div style="flex:1;height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden;min-width:60px">
                        <div style="height:100%;width:${barW}%;background:${color};border-radius:3px;transition:width .5s"></div>
                    </div>
                </div>
            </td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="window.drillAprobacion('${_indEsc(d.despachador)}')">
                    <i class="fas fa-search-plus"></i> Detalle
                </button>
            </td>
        </tr>`;
  }).join('');

  document.getElementById('ia-tbl').innerHTML = `<table>
        <thead><tr>
            <th>Despachador</th><th>Total Despachos</th>
            <th>Con Aprobación</th><th>% Aprobaciones</th><th></th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table>`;
};

window._indRenderTarifasVigentes = function (data) {
  if (!data.length) { _indVacio('inf-v-tbl', 'No se encontraron tarifas con esos filtros'); return; }

  const rows = data.map(d => {
    const vs = d.vigencia_semaforo ?? {};
    const ss = d.semaforo_semana ?? {};
    const sem = ss.estado === 'verde' ? 'sem-verde' : 'sem-rojo';
    const vig = (vs.badge ?? '').includes('success') ? 'badge-vigente'
      : (vs.badge ?? '').includes('warning') ? 'badge-por-vencer' : 'badge-vencida';

    const tieneMulti = d.tiene_multiparada
      ? '<span style="background:#e0f2fe;color:#0369a1;font-size:.6rem;font-weight:700;padding:1px 5px;border-radius:4px;margin-left:3px">MO/MD</span>'
      : '';

    const fuenteTag = d.fuente === 'MERCADO'
      ? '<span style="background:#f0fdf4;color:#15803d;font-size:.6rem;font-weight:700;padding:1px 5px;border-radius:4px">MERCADO</span>'
      : '<span style="background:#e0f2fe;color:#0369a1;font-size:.6rem;font-weight:700;padding:1px 5px;border-radius:4px">SISETAC</span>';

    return `<tr>
            <td>
                <div style="font-weight:700;color:var(--navy);font-size:.78rem">${_indEsc(d.origen_nombre ?? d.origen)}${tieneMulti}</div>
                <div style="font-size:.63rem;color:var(--muted)">→ ${_indEsc(d.destino_nombre ?? d.destino)}</div>
            </td>
            <td><span style="background:rgba(15,31,61,.07);padding:2px 7px;border-radius:4px;font-size:.65rem;font-weight:700">${_indEsc(d.tipo_vehiculo)}</span></td>
            <td style="font-weight:700;">${d.tarifa ? _indFormatCOP(d.tarifa) : '<span style="color:var(--muted);font-style:italic;font-size:.7rem">—</span>'}</td>
            <td>${fuenteTag}</td>
            <td>
                <div style="display:flex;align-items:center;gap:5px">
                    <span class="sem ${sem}"></span>
                    <span style="font-size:.67rem">${_indEsc(ss.label ?? '—')}</span>
                </div>
            </td>
            <td><span class="badge ${vig}">${_indEsc(vs.label ?? '—')}</span></td>
            <td style="font-size:.68rem;color:var(--muted)">${_indEsc(d.ultima_actualizacion ?? '—')}</td>
            <td style="font-size:.68rem;color:var(--muted)">${_indEsc(d.usuario ?? '—')}</td>
            <td><span class="badge ${d.estado_tarifa === 'Activa' ? 'badge-vigente' : 'badge-vencida'}">${_indEsc(d.estado_tarifa ?? '—')}</span></td>
        </tr>`;
  }).join('');

  document.getElementById('inf-v-tbl').innerHTML = `<table>
        <thead><tr>
            <th>Ruta</th><th>Vehículo</th><th>Tarifa</th><th>Fuente</th>
            <th>Semana</th><th>Vigencia</th><th>Actualización</th><th>Usuario</th><th>Estado</th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table>`;

  _indAgregarFiltro('inf-v-filter', 'inf-v-tbl');
};

window._indRenderInformeAhorros = function (prefix, data, totales) {
  if (!data.length) { _indVacio(`${prefix}-tbl`, 'Sin operaciones en el período'); return; }

  _indTexto(`${prefix}-tot-plan`, _indFormatCOP(totales.total_planificado));
  _indTexto(`${prefix}-tot-ejec`, _indFormatCOP(totales.total_ejecutado));
  _indTexto(`${prefix}-tot-op`, _indNum(data.length));
  _indFooterDif(`${prefix}-tot-dif`, totales.total_diferencia);
  _indMostrar(`${prefix}-footer`);

  const rows = data.map(d => {
    const [cls, txt] = _indResultadoClsTxt(d.tipo_resultado);
    const numDespacho = d.numero_despacho ?? d.num_autorizacion ?? d.id;
    const fecha = d.fecha_despacho ?? d.fecha_expedicion ?? '—';
    const despachador = d.despachador ?? d.usuario_despacho ?? '—';
    const ahorro = d.ahorro_sobrecosto ?? 0;

    return `<tr>
            <td style="font-family:'DM Mono',monospace;font-size:.7rem">${_indEsc(numDespacho)}</td>
            <td style="font-size:.68rem">${_indEsc(fecha)}</td>
            <td>
                <div style="font-weight:700;color:var(--navy);font-size:.75rem">${_indEsc(d.origen_nombre ?? d.origen)}</div>
                <div style="font-size:.62rem;color:var(--muted)">→ ${_indEsc(d.destino_nombre ?? d.destino)}</div>
            </td>
            <td><span style="background:rgba(15,31,61,.07);padding:2px 7px;border-radius:4px;font-size:.63rem;font-weight:700">${_indEsc(d.tipo_vehiculo)}</span></td>
            <td style="font-size:.68rem;color:var(--muted)">${_indEsc(despachador)}</td>
            <td style="font-weight:700;">${_indFormatCOP(d.tarifa_planificada)}</td>
            <td style="font-weight:700;">${_indFormatCOP(d.tarifa_ejecutada)}</td>
            <td style="font-weight:700;color:${ahorro >= 0 ? 'var(--green)' : 'var(--red)'};">${_indFormatCOP(Math.abs(ahorro))}</td>
            <td style="font-family:'DM Mono',monospace;font-size:.7rem;color:${(d.variacion_pct ?? 0) > 0 ? 'var(--green)' : 'var(--red)'}">
                ${d.variacion_pct != null ? d.variacion_pct + '%' : '—'}
            </td>
            <td style="font-family:'DM Mono',monospace;font-size:.7rem;color:${d.ratio > 1 ? 'var(--green)' : d.ratio < 1 ? 'var(--red)' : 'var(--navy)'}">${d.ratio ?? '—'}</td>
            <td><span class="badge ${cls}">${txt}</span></td>
        </tr>`;
  }).join('');

  document.getElementById(`${prefix}-tbl`).innerHTML = `<table>
        <thead><tr>
            <th>N° Manifiesto</th><th>Fecha</th><th>Ruta</th><th>Vehículo</th>
            <th>Despachador</th><th>Tarifa Plan.</th><th>Tarifa Ejec.</th>
            <th>Ahorro/Sobrec.</th><th>Variación %</th><th>Ratio</th><th>Resultado</th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table>`;

  _indAgregarFiltro(`${prefix}-filter`, `${prefix}-tbl`);
};

/* =============================================================================
   HELPERS PRIVADOS (accesibles también desde window por consistencia)
   ============================================================================= */
window._indRenderDrillOperaciones = function (data) {
  const rows = data.map(d => {
    const [cls, txt] = _indResultadoClsTxt(d.tipo_resultado);
    return `<tr>
            <td style="font-family:'DM Mono',monospace;font-size:.7rem">${_indEsc(d.numero_despacho ?? d.num_autorizacion ?? d.id)}</td>
            <td style="font-size:.68rem">${_indEsc(d.fecha_despacho ?? d.fecha_expedicion ?? '—')}</td>
            <td style="font-size:.7rem">${_indEsc(d.origen)} → ${_indEsc(d.destino)}</td>
            <td><span style="background:rgba(15,31,61,.07);padding:2px 7px;border-radius:4px;font-size:.65rem;font-weight:700">${_indEsc(d.tipo_vehiculo)}</span></td>
            <td style="font-weight:700;">${_indFormatCOP(d.tarifa_planificada)}</td>
            <td style="font-weight:700;">${_indFormatCOP(d.tarifa_ejecutada)}</td>
            <td style="font-weight:700;color:${(d.diferencia ?? 0) >= 0 ? 'var(--green)' : 'var(--red)'};">${_indFormatCOP(Math.abs(d.diferencia))}</td>
            <td><span class="badge ${cls}">${txt}</span></td>
        </tr>`;
  }).join('');

  return `<div class="table-wrap"><table>
        <thead><tr>
            <th>N° Despacho</th><th>Fecha</th><th>Ruta</th><th>Vehículo</th>
            <th>Planificado</th><th>Ejecutado</th><th>Diferencia</th><th>Resultado</th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table></div>`;
};

window._indRenderDrillAprobaciones = function (data) {
  const rows = data.map(d => `<tr>
        <td style="font-family:'DM Mono',monospace;font-size:.7rem">${_indEsc(d.numero_despacho ?? d.num_autorizacion ?? d.id)}</td>
        <td style="font-size:.68rem">${_indEsc(d.fecha_despacho ?? d.fecha_expedicion ?? '—')}</td>
        <td style="font-size:.7rem">${_indEsc(d.origen)} → ${_indEsc(d.destino)}</td>
        <td><span style="background:rgba(15,31,61,.07);padding:2px 7px;border-radius:4px;font-size:.65rem;font-weight:700">${_indEsc(d.tipo_vehiculo)}</span></td>
        <td style="font-size:.7rem;color:var(--red);font-weight:600">${_indEsc(d.componente_aprobacion ?? '—')}</td>
        <td style="font-family:'DM Mono',monospace;color:var(--yellow)">${d.variacion_pct != null ? d.variacion_pct + '%' : '—'}</td>
    </tr>`).join('');

  return `<div class="table-wrap"><table>
        <thead><tr>
            <th>N° Despacho</th><th>Fecha</th><th>Ruta</th>
            <th>Vehículo</th><th>Componente Aprobado</th><th>Variación %</th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table></div>`;
};

/* ─────────────────────────────────────────────
   UTILIDADES INTERNAS
───────────────────────────────────────────── */
function _indInitFechas() {
  const hoy = new Date();
  const hace3m = new Date(hoy);
  hace3m.setMonth(hace3m.getMonth() - 3);
  const desde = hace3m.toISOString().slice(0, 10);
  const hasta = hoy.toISOString().slice(0, 10);

  [
    ['ig-desde', 'ig-hasta'],
    ['ir-desde', 'ir-hasta'],
    ['iv-desde', 'iv-hasta'],
    ['id-desde', 'id-hasta'],
    ['ia-desde', 'ia-hasta'],
    ['infar-desde', 'infar-hasta'],
    ['infav-desde', 'infav-hasta'],
    ['infad-desde', 'infad-hasta'],
  ].forEach(([d, h]) => {
    const elD = document.getElementById(d);
    const elH = document.getElementById(h);
    if (elD) elD.value = desde;
    if (elH) elH.value = hasta;
  });
}

async function _indFetch(path) {
  const base = (document.getElementById('base_url_api')?.value ?? '').replace(/\/$/, '');
  const url = base + path;
  const sep = url.includes('?') ? '&' : '?';
  const empId = document.getElementById('empresa_id')?.value ?? '';
  const full = url.includes('empresa_id') ? url : `${url}${sep}empresa_id=${empId}`;
  const resp = await fetch(full, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-API-KEY': 'nexos_nacional2026@*',
    },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp;
}

function _indFechaParams(desdeId, hastaId) {
  const desde = document.getElementById(desdeId)?.value ?? '';
  const hasta = document.getElementById(hastaId)?.value ?? '';
  const empId = document.getElementById('empresa_id')?.value ?? '';
  if (!desde || !hasta) { _indFlash('warning', 'Atención', 'Seleccione rango de fechas.'); return null; }
  if (desde > hasta) { _indFlash('warning', 'Atención', 'Fecha Desde no puede ser mayor a Fecha Hasta.'); return null; }
  if (!empId) { _indFlash('error', 'Error', 'No se pudo determinar la empresa.'); return null; }
  return new URLSearchParams({ empresa_id: empId, fecha_desde: desde, fecha_hasta: hasta });
}

function _indResultadoClsTxt(tipo) {
  if (tipo === 'AHORRO' || tipo === 'ahorro') return ['badge-ahorro', 'Ahorro'];
  if (tipo === 'SOBRECOSTO' || tipo === 'sobrecosto') return ['badge-sobrecosto', 'Sobrecosto'];
  if (tipo === 'IGUAL' || tipo === 'igual') return ['badge-igual', 'Igual'];
  return ['badge-sin-tarifa', tipo ?? '—'];
}

function _indFooterDif(id, dif) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = _indFormatCOP(Math.abs(dif ?? 0));
  el.style.color = (dif ?? 0) >= 0 ? 'var(--green)' : 'var(--red)';
}

function _indAgregarFiltro(inputId, tableWrapId) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  inp.oninput = function () {
    const txt = this.value.toLowerCase().trim();
    const wrap = document.getElementById(tableWrapId);
    if (!wrap) return;
    wrap.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = !txt || row.textContent.toLowerCase().includes(txt) ? '' : 'none';
    });
  };
}

function _indLoading(id, msg) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `<div class="loading-state"><div class="spinner"></div><div style="font-size:.78rem;color:var(--muted);margin-top:8px">${_indEsc(msg)}</div></div>`;
}

function _indError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `<div class="empty-state"><div class="empty-icon" style="color:var(--red)"><i class="fas fa-exclamation-triangle"></i></div><div class="empty-text" style="color:var(--red)">${_indEsc(msg ?? 'Error desconocido')}</div></div>`;
}

function _indVacio(id, msg) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `<div class="empty-state"><div class="empty-icon"><i class="fas fa-inbox"></i></div><div class="empty-text">${_indEsc(msg)}</div></div>`;
}

function _indLimpiarStats(...ids) {
  ids.forEach(id => _indTexto(id, '—'));
}

function _indMostrar(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'flex';
}

function _indTexto(id, txt) {
  const el = document.getElementById(id);
  if (el) el.textContent = txt;
}

function _indNum(v) {
  return v !== null && v !== undefined ? Number(v).toLocaleString('es-CO') : '—';
}

function _indFormatCOP(v) {
  if (v === null || v === undefined) return '—';
  return Number(v).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
}

function _indEsc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function _indFlash(tipo, titulo, mensaje) {
  if (window.Swal) {
    Swal.fire({ toast: true, position: 'top-end', icon: tipo, title: titulo, text: mensaje, showConfirmButton: false, timer: 3500 });
  } else if (window.toastr) {
    toastr[tipo === 'error' ? 'error' : tipo === 'warning' ? 'warning' : tipo === 'success' ? 'success' : 'info'](mensaje, titulo);
  } else {
    console.log(`[IND·${tipo.toUpperCase()}] ${titulo}: ${mensaje}`);
  }
}