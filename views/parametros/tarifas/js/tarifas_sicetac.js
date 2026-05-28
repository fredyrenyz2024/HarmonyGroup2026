// /**
//  * ============================================================
//  *  MÓDULO DE CONSULTA — TARIFAS SICETAC
//  *  Proyecto HARMONY 2026 | Transporte Nacional
//  *  Archivo: sicetac_tarifas.js
//  * ============================================================
//  *
//  *  DEPENDENCIAS:
//  *  - Swal (sweetalert2)
//  *  - jQuery (para selector base_url_api)
//  *  - FontAwesome (íconos)
//  *
//  *  INICIALIZACIÓN:
//  *  El sistema llama window.initScript(id) al cargar el módulo.
//  *  También se puede llamar scInit() directamente.
//  *
//  *  API ESPERADA (Laravel):
//  *  GET  /api/v1/sicetac/tarifa           → modo exacto
//  *  GET  /api/v1/sicetac/tarifas/ruta     → todas las configs de la ruta
//  *  POST /api/v1/sicetac/tarifas/configs  → multi-configuraciones
//  * ============================================================
//  */

// 'use strict';

// /* ============================================================
//    HEADERS DE AUTENTICACIÓN
//    Centralizado aquí. Si cambia la key, solo tocas este lugar.
//    Se fusionan sobre los headers base dentro de scApiFetch().
//    ============================================================ */
// const SC_HEADERS_SICETAC = () => ({
//   'Content-Type': 'application/json',
//   'Accept': 'application/json',
//   'X-Requested-With': 'XMLHttpRequest',
//   'X-API-KEY': 'mi_super_api_key_ultra_secreta_123',
// });

// /* ============================================================
//    ESTADO GLOBAL DEL MÓDULO
//    ============================================================ */
// let SC_STATE = {
//   data: [],
//   tarifaActual: null,
//   empresa_id: null,
//   usuario: null,
//   baseUrl: '',
//   modo: 'exacta',
//   periodoActivo: '',
// };

// /* ============================================================
//    INICIALIZACIÓN
//    ============================================================ */
// function scInit() {
//   SC_STATE.empresa_id = document.getElementById('empresa_id')?.value || 1;
//   SC_STATE.usuario = document.getElementById('ssn_nombre')?.value
//     || window?.USER_NAME
//     || 'sistema';
//   SC_STATE.baseUrl = (typeof $ !== 'undefined' ? $('#base_url_api').val() : null)
//     || document.getElementById('base_url_api')?.value
//     || 'parametros/';

//   const hoy = new Date();
//   const periodoDefault = hoy.getFullYear().toString()
//     + String(hoy.getMonth() + 1).padStart(2, '0');

//   const periodoEl = document.getElementById('f-periodo');
//   if (periodoEl && !periodoEl.value) {
//     periodoEl.placeholder = `Ej: ${periodoDefault} (actual)`;
//   }

//   scBuildMultiChecks();
// }

// /* ============================================================
//    GESTIÓN DEL MODO DE CONSULTA
//    ============================================================ */
// function scSetModo(modo, tabEl) {
//   SC_STATE.modo = modo;
//   document.querySelectorAll('.modo-tab').forEach(t => t.classList.remove('active'));
//   if (tabEl) tabEl.classList.add('active');

//   const wrapConfig = document.getElementById('wrap-config');
//   const wrapCondicion = document.getElementById('wrap-condicion');
//   const wrapMulti = document.getElementById('wrap-multiconfig');

//   if (wrapConfig) wrapConfig.style.display = (modo !== 'ruta') ? '' : 'none';
//   if (wrapCondicion) wrapCondicion.style.display = '';
//   if (wrapMulti) wrapMulti.style.display = (modo === 'multiconfig') ? 'block' : 'none';
// }

// /* ============================================================
//    CHECKBOXES MULTI-CONFIG
//    ============================================================ */
// const SC_CONFIGS = [
//   { v: '3S3', l: '3S3 — Tractomula 3+3' }, { v: '3S2', l: '3S2 — Tractomula 3+2' },
//   { v: '2S3', l: '2S3 — Tractomula 2+3' }, { v: '2S2', l: '2S2 — Tractomula 2+2' },
//   { v: '3', l: '3 — Camión 3 ejes' }, { v: '2', l: '2 — Camión 2 ejes' },
//   { v: '2L1', l: '2L1 — Liviano' }, { v: '2L2', l: '2L2 — Liviano' },
//   { v: '2L3', l: '2L3 — Liviano' }, { v: 'V2', l: 'V2 — Volqueta' },
//   { v: 'V3', l: 'V3 — Volqueta' }, { v: 'V4', l: 'V4 — Volqueta' },
// ];
// const SC_MULTI_DEFAULT = ['3S3', '2S3', '3S2'];

// function scBuildMultiChecks() {
//   const contenedor = document.getElementById('multi-check-list');
//   if (!contenedor || contenedor.innerHTML.trim()) return;
//   contenedor.innerHTML = SC_CONFIGS.map(c => `
//     <label class="check-pill">
//       <input type="checkbox" name="multi-cfg" value="${c.v}"
//              ${SC_MULTI_DEFAULT.includes(c.v) ? 'checked' : ''}>
//       ${c.l}
//     </label>`).join('');
// }

// /* ============================================================
//    CONSULTAR — PUNTO DE ENTRADA PRINCIPAL
//    ============================================================ */
// async function scConsultar() {
//   const origen = document.getElementById('f-origen')?.value.trim() || '';
//   const destino = document.getElementById('f-destino')?.value.trim() || '';
//   const periodo = document.getElementById('f-periodo')?.value.trim() || '';
//   const condicion = document.getElementById('f-condicion')?.value || '1';

//   if (!origen) return scFlash('error', 'Origen inválido', 'El código DIVIPOLA debe tener exactamente 8 dígitos.');
//   if (!destino) return scFlash('error', 'Destino inválido', 'El código DIVIPOLA debe tener exactamente 8 dígitos.');

//   scBtnLoading('btn-consultar', true);
//   scTableLoading();
//   scToggleExportBtn(false);

//   try {
//     let tarifas = [];
//     let periodoReal = '';

//     /* ── MODO EXACTA ── */
//     if (SC_STATE.modo === 'exacta') {
//       const config = document.getElementById('f-config')?.value || '3S3';
//       const resp = await scApiFetch(
//         // `${SC_STATE.baseUrl}sicetac/tarifa`,
//         `http://127.0.0.1:8000/api/v1/sicetac/tarifa`,
//         {
//           method: 'GET',
//           headers: SC_HEADERS_SICETAC(),
//           params: { origen, destino, configuracionesid: config, condicion_carga: condicion, periodo },
//         }
//       );
//       // tarifas = resp.tarifa ? [resp.tarifa] : [];
//       // periodoReal = resp.periodo || '';

//       // CORRECCIÓN AQUÍ:
//       // Si 'resp.tarifas' ya es un array según tu JSON, lo asignamos directamente.
//       // Usamos el operador || [] por si viene nulo.
//       tarifas = Array.isArray(resp.tarifas) ? resp.tarifas : (resp.tarifas ? [resp.tarifas] : []);

//       periodoReal = resp.periodo || '';

//       /* ── MODO RUTA ── */
//     } else if (SC_STATE.modo === 'ruta') {
//       const resp = await scApiFetch(
//         // `${SC_STATE.baseUrl}sicetac/tarifas/ruta`,
//         `http://127.0.0.1:8000/api/v1/sicetac/tarifas/ruta`,
//         {
//           method: 'GET',
//           headers: SC_HEADERS_SICETAC(),
//           params: { origen, destino, condicion_carga: condicion, periodo },
//         }
//       );
//       tarifas = resp.tarifas || [];
//       periodoReal = resp.periodo || '';

//       /* ── MODO MULTI-CONFIG ── */
//     } else {
//       const checks = [...document.querySelectorAll('input[name="multi-cfg"]:checked')].map(c => c.value);
//       if (!checks.length) {
//         scBtnLoading('btn-consultar', false);
//         return scFlash('error', 'Sin configuraciones', 'Selecciona al menos una configuración para comparar.');
//       }
//       const body = { origen, destino, configuraciones: checks, condicion_carga: +condicion };
//       if (periodo) body.periodo = periodo;

//       const resp = await scApiFetch(
//         // `${SC_STATE.baseUrl}sicetac/tarifas/configs`,
//         `http://127.0.0.1:8000/api/v1/sicetac/tarifas/configs`,
//         {
//           method: 'POST',
//           headers: SC_HEADERS_SICETAC(),
//           data: body,
//         }
//       );
//       tarifas = resp.tarifas || [];
//       periodoReal = resp.periodo || '';
//     }

//     SC_STATE.data = tarifas;
//     SC_STATE.periodoActivo = periodoReal;

//     scRenderTabla(tarifas);
//     scActualizarStats(tarifas);

//     const lblPeriodo = document.getElementById('lbl-periodo-activo');
//     if (lblPeriodo) lblPeriodo.innerHTML =
//       `<i class="fas fa-calendar-alt"></i> Período: <strong>${periodoReal || '—'}</strong>`;

//     const lblModo = document.getElementById('lbl-info-activo');
//     const modoLabels = { exacta: '① Exacta', ruta: '② Por Ruta', multiconfig: '③ Multi-Config' };
//     if (lblModo) lblModo.textContent = ` — ${modoLabels[SC_STATE.modo] || ''}`;

//     const badgeCount = document.getElementById('ap-badge-count');
//     if (badgeCount) badgeCount.textContent = tarifas.length;

//     scToggleExportBtn(tarifas.length > 0);

//     tarifas.length
//       ? scFlash('success', 'Tarifas cargadas', `${tarifas.length} tarifa(s) encontrada(s) · Período ${periodoReal}`)
//       : scFlash('info', 'Sin resultados', 'No se encontraron tarifas para los parámetros indicados.');

//   } catch (err) {
//     console.error('[SC] Error consultando SiceTac:', err);
//     scTableError(err.message);
//     scFlash('error', 'Error de consulta', err.message || 'No se pudo conectar con la API.');
//   } finally {
//     scBtnLoading('btn-consultar', false);
//   }
// }

// /* ============================================================
//    RENDER TABLA PRINCIPAL
//    ============================================================ */
// function scRenderTabla(data) {
//   const tbody = document.getElementById('sc-tbody');
//   if (!tbody) return;

//   if (!data || data.length === 0) {
//     tbody.innerHTML = `
//       <tr><td colspan="12">
//         <div class="ap-empty">
//           <div class="ap-empty-icon"><i class="fas fa-inbox"></i></div>
//           <div class="ap-empty-title">Sin resultados</div>
//           <div class="ap-empty-sub">No se encontraron tarifas para los parámetros indicados.</div>
//         </div>
//       </td></tr>`;
//     return;
//   }

//   const minVal = Math.min(...data.map(t => t.valor));
//   const maxVal = Math.max(...data.map(t => t.valor));

//   tbody.innerHTML = data.map((item, idx) => {
//     const esMin = item.valor === minVal && data.length > 1;
//     const esMax = item.valor === maxVal && data.length > 1;
//     const rowCls = esMin ? 'row-min' : (esMax ? 'row-max' : '');

//     const condBadge = (item.condicioncarga === 'CARGADO' || item.condicioncarga === 1)
//       ? `<span class="badge-cargado"><i class="fas fa-box"></i> Cargado</span>`
//       : `<span class="badge-vacio"><i class="fas fa-box-open"></i> Vacío</span>`;

//     return `
//       <tr class="${rowCls}" data-idx="${idx}">
//         <td style="color:var(--ap-gray); font-size:0.72rem;">${idx + 1}</td>
//         <td><span class="badge-config">${item.configuracion}</span></td>
//         <td style="max-width:220px; overflow:hidden; text-overflow:ellipsis;" title="${item.via || ''}">
//           ${item.nombreRuta || '—'}
//           ${esMin ? '<br><span class="tag-min"><i class="fas fa-star"></i> Más económico</span>' : ''}
//         </td>
//         <td style="font-family:monospace; font-size:0.8rem;">
//           <div style="font-weight:700; font-size:0.9rem;">${item.nomorigen}</div>
//           <div style="font-size:0.7rem; color:var(--ap-gray);">/ ${item.origen}</div>
//         </td>
//         <td style="font-family:monospace; font-size:0.8rem;">
//           <div style="font-weight:700; font-size:0.9rem;">${item.nomdestino}</div>
//           <div style="font-size:0.7rem; color:var(--ap-gray);">/ ${item.destino}</div>
//         </td>
//         <td>${condBadge}</td>
//         <td>${item.nombreunidadtransporte}</td>
//         <td>${scFixText(item.nombretipocarga)}</td>
//         <td style="text-align:center; font-weight:600;">${scFmtNum(item.kilometros)}</td>
//         <td>
//           <div style="font-weight:700; font-size:0.9rem;">${scFmtCOP(item.valor)}</div>
//           <div style="font-size:0.7rem; color:var(--ap-gray);">/ viaje completo</div>
//         </td>
//         <!--<td>${scFmtCOP(item.valorTonelada)}</td>-->
//         <td>${scFmtCOP(item.valorHora)}</td>
//         <td>${item.horasrecorrido}</td>
//         <td style="font-size:0.78rem; color:var(--ap-gray);">${item.periodo || '—'}</td>
//         <td>
//           <button class="btn-ap-ver" onclick="scAbrirDetalle(${idx})" title="Calcular valor mínimo">
//             <i class="fas fa-calculator"></i> Calcular
//           </button>
//         </td>
//       </tr>`;
//   }).join('');
// }

// function scFixText(str) {
//   if (!str) return '—';
//   try {
//     // Esto convierte "Granel SÃ³lido" en "Granel Sólido" automáticamente
//     return decodeURIComponent(escape(str));
//   } catch (e) {
//     return str;
//   }
// }

// /* ============================================================
//    ESTADÍSTICAS RÁPIDAS
//    ============================================================ */
// function scActualizarStats(data) {
//   const n = data.length;
//   const elTotal = document.getElementById('cnt-total');
//   const elMenor = document.getElementById('cnt-menor');
//   const elMayor = document.getElementById('cnt-mayor');
//   const elKm = document.getElementById('cnt-km');
//   const elBadge = document.getElementById('ap-badge-count');

//   if (elBadge) elBadge.textContent = n;
//   if (elTotal) elTotal.textContent = n || '—';

//   if (!n) {
//     if (elMenor) elMenor.textContent = '—';
//     if (elMayor) elMayor.textContent = '—';
//     if (elKm) elKm.textContent = '—';
//     return;
//   }

//   const vals = data.map(t => t.valor);
//   const kms = data.map(t => t.distancia);
//   if (elMenor) elMenor.textContent = scFmtCOP(Math.min(...vals));
//   if (elMayor) elMayor.textContent = scFmtCOP(Math.max(...vals));
//   if (elKm) elKm.textContent = scFmtNum(Math.max(...kms)) + ' km';
// }

// /* ============================================================
//    FILTRO LOCAL
//    ============================================================ */
// function scFiltrarTabla(texto) {
//   const filas = document.querySelectorAll('#sc-tbody tr[data-idx]');
//   const t = texto.toLowerCase().trim();
//   filas.forEach(tr => {
//     tr.style.display = (!t || tr.innerText.toLowerCase().includes(t)) ? '' : 'none';
//   });
// }

// function scLimpiarFiltros() {
//   ['f-origen', 'f-destino', 'f-periodo'].forEach(id => {
//     const el = document.getElementById(id);
//     if (el) el.value = '';
//   });
//   const cfgEl = document.getElementById('f-config');
//   const condEl = document.getElementById('f-condicion');
//   if (cfgEl) cfgEl.value = '3S3';
//   if (condEl) condEl.value = '1';

//   scSetModo('exacta', document.querySelector('.modo-tab[data-modo="exacta"]'));
//   SC_STATE.data = []; SC_STATE.periodoActivo = '';
//   scActualizarStats([]);
//   scToggleExportBtn(false);

//   const lblInfo = document.getElementById('lbl-info-activo');
//   const lblPeriodo = document.getElementById('lbl-periodo-activo');
//   if (lblInfo) lblInfo.textContent = '';
//   if (lblPeriodo) lblPeriodo.innerHTML = '<i class="fas fa-calendar-alt"></i> —';

//   const tbody = document.getElementById('sc-tbody');
//   if (tbody) tbody.innerHTML = `
//     <tr><td colspan="12">
//       <div class="ap-empty">
//         <div class="ap-empty-icon"><i class="fas fa-search"></i></div>
//         <div class="ap-empty-title">Ingresa origen y destino</div>
//         <div class="ap-empty-sub">Completa los filtros y presiona Consultar</div>
//       </div>
//     </td></tr>`;
// }

// /* ============================================================
//    EXPORTAR A EXCEL
//    Genera un .xls real con formato SpreadsheetML (nativo,
//    sin librerías externas). Abre directamente en Excel/LibreOffice.
//    Incluye:
//      · Hoja principal con todos los datos, estilos y fila resumen
//      · Hoja de parámetros con los metadatos de la consulta
//      · Fila de encabezados con fondo navy y letra blanca
//      · Filas con color según min (verde) / max (rojo)
//      · Columnas de moneda con formato $ #,##0
//      · Panel superior fijo (freeze 3 filas)
//    ============================================================ */
// // function scExportarExcel() {
// //   const data = SC_STATE.data;
// //   if (!data || data.length === 0) {
// //     return scFlash('info', 'Sin datos', 'Primero realiza una consulta para exportar resultados.');
// //   }

// //   const origen = document.getElementById('f-origen')?.value || '—';
// //   const destino = document.getElementById('f-destino')?.value || '—';
// //   const periodo = SC_STATE.periodoActivo || document.getElementById('f-periodo')?.value || '—';
// //   const condicion = document.getElementById('f-condicion')?.value === '1' ? 'Cargado' : 'Vacío';
// //   const modo = { exacta: 'Exacta', ruta: 'Por Ruta', multiconfig: 'Multi-Config' }[SC_STATE.modo] || SC_STATE.modo;
// //   const fechaExp = new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
// //   const minVal = Math.min(...data.map(t => t.valor));
// //   const maxVal = Math.max(...data.map(t => t.valor));
// //   const avgVal = data.reduce((a, t) => a + (Number(t.valor) || 0), 0) / data.length;

// //   // ── Helpers ────────────────────────────────────────────────
// //   const esc = s => String(s ?? '')
// //     .replace(/&/g, '&amp;').replace(/</g, '&lt;')
// //     .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// //   const C = (val, type, sid) =>
// //     `<Cell${sid ? ` ss:StyleID="${sid}"` : ''}><Data ss:Type="${type}">${esc(val)}</Data></Cell>`;

// //   const N = v => (v === null || v === undefined) ? 0 : Number(v);

// //   // ── Estilos ─────────────────────────────────────────────────
// //   const styles = `<Styles>
// //   <Style ss:ID="s_title">
// //     <Font ss:Bold="1" ss:Size="13" ss:Color="#0F1F3D"/>
// //   </Style>
// //   <Style ss:ID="s_meta_k">
// //     <Font ss:Bold="1" ss:Size="10" ss:Color="#1A3C6B"/>
// //     <Interior ss:Color="#F0F4F8" ss:Pattern="Solid"/>
// //   </Style>
// //   <Style ss:ID="s_meta_v">
// //     <Font ss:Size="10" ss:Color="#0F1F3D"/>
// //   </Style>
// //   <Style ss:ID="s_th">
// //     <Font ss:Bold="1" ss:Size="10" ss:Color="#FFFFFF"/>
// //     <Interior ss:Color="#0F1F3D" ss:Pattern="Solid"/>
// //     <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
// //     <Borders>
// //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#E8A020"/>
// //       <Border ss:Position="Right"  ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#1A3C6B"/>
// //     </Borders>
// //   </Style>
// //   <Style ss:ID="s_row">
// //     <Font ss:Size="10" ss:Color="#0F1F3D"/>
// //     <Alignment ss:Vertical="Center"/>
// //     <Borders>
// //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDE3EF"/>
// //     </Borders>
// //   </Style>
// //   <Style ss:ID="s_row_c">
// //     <Font ss:Size="10" ss:Color="#0F1F3D"/>
// //     <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
// //     <Borders>
// //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDE3EF"/>
// //     </Borders>
// //   </Style>
// //   <Style ss:ID="s_money">
// //     <Font ss:Size="10" ss:Color="#0F1F3D"/>
// //     <NumberFormat ss:Format="&quot;$&quot; #,##0"/>
// //     <Alignment ss:Horizontal="Right"/>
// //     <Borders>
// //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDE3EF"/>
// //     </Borders>
// //   </Style>
// //   <Style ss:ID="s_min">
// //     <Font ss:Bold="1" ss:Size="10" ss:Color="#166534"/>
// //     <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
// //     <Alignment ss:Vertical="Center"/>
// //     <Borders>
// //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/>
// //     </Borders>
// //   </Style>
// //   <Style ss:ID="s_min_c">
// //     <Font ss:Bold="1" ss:Size="10" ss:Color="#166534"/>
// //     <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
// //     <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
// //     <Borders>
// //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/>
// //     </Borders>
// //   </Style>
// //   <Style ss:ID="s_min_m">
// //     <Font ss:Bold="1" ss:Size="10" ss:Color="#166534"/>
// //     <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
// //     <NumberFormat ss:Format="&quot;$&quot; #,##0"/>
// //     <Alignment ss:Horizontal="Right"/>
// //     <Borders>
// //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/>
// //     </Borders>
// //   </Style>
// //   <Style ss:ID="s_max">
// //     <Font ss:Size="10" ss:Color="#991B1B"/>
// //     <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
// //     <Alignment ss:Vertical="Center"/>
// //     <Borders>
// //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/>
// //     </Borders>
// //   </Style>
// //   <Style ss:ID="s_max_c">
// //     <Font ss:Size="10" ss:Color="#991B1B"/>
// //     <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
// //     <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
// //     <Borders>
// //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/>
// //     </Borders>
// //   </Style>
// //   <Style ss:ID="s_max_m">
// //     <Font ss:Size="10" ss:Color="#991B1B"/>
// //     <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
// //     <NumberFormat ss:Format="&quot;$&quot; #,##0"/>
// //     <Alignment ss:Horizontal="Right"/>
// //     <Borders>
// //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/>
// //     </Borders>
// //   </Style>
// //   <Style ss:ID="s_foot">
// //     <Font ss:Bold="1" ss:Size="10" ss:Color="#1A3C6B"/>
// //     <Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/>
// //     <Borders>
// //       <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#1A3C6B"/>
// //     </Borders>
// //   </Style>
// //   <Style ss:ID="s_foot_m">
// //     <Font ss:Bold="1" ss:Size="10" ss:Color="#1A3C6B"/>
// //     <Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/>
// //     <NumberFormat ss:Format="&quot;$&quot; #,##0"/>
// //     <Alignment ss:Horizontal="Right"/>
// //     <Borders>
// //       <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#1A3C6B"/>
// //     </Borders>
// //   </Style>
// //   </Styles>`;

// //   // ── Filas de datos ───────────────────────────────────────────
// //   const dataRows = data.map((t, i) => {
// //     const esMin = t.valor === minVal && data.length > 1;
// //     const esMax = t.valor === maxVal && data.length > 1;
// //     const sN = esMin ? 's_min' : (esMax ? 's_max' : 's_row');
// //     const sC = esMin ? 's_min_c' : (esMax ? 's_max_c' : 's_row_c');
// //     const sM = esMin ? 's_min_m' : (esMax ? 's_max_m' : 's_money');
// //     const cond = (t.condicionCargaId === '1' || t.condicionCargaId === 1) ? 'Cargado' : 'Vacío';
// //     const nota = esMin ? '★ Más económico' : (esMax ? '▲ Más costoso' : '');
// //     return `<Row ss:Height="22">
// //       ${C(i + 1, 'Number', sC)}
// //       ${C(t.configuracionesid, 'String', sC)}
// //       ${C(t.nombreRuta || '—', 'String', sN)}
// //       ${C(t.origen, 'String', sC)}
// //       ${C(t.destino, 'String', sC)}
// //       ${C(cond, 'String', sC)}
// //       ${C(N(t.distancia), 'Number', sC)}
// //       ${C(N(t.valor), 'Number', sM)}
// //       ${C(N(t.valorTonelada), 'Number', sM)}
// //       ${C(N(t.valorHora), 'Number', sM)}
// //       ${C(t.periodo || '—', 'String', sC)}
// //       ${C(nota, 'String', sN)}
// //     </Row>`;
// //   }).join('\n');

// //   // ── Encabezados de columna ────────────────────────────────────
// //   const cols = ['#', 'Config.', 'Nombre Ruta', 'Origen', 'Destino', 'Condición',
// //     'Dist. km', 'Valor Movilización', 'Val. Tonelada', 'Val. Hora', 'Período', 'Nota'];
// //   const theadRow = `<Row ss:Height="30">${cols.map(h => C(h, 'String', 's_th')).join('')}</Row>`;

// //   // ── Fila resumen ──────────────────────────────────────────────
// //   const footerRow = `<Row ss:Height="26">
// //     ${C('', 'String', 's_foot')}
// //     ${C('', 'String', 's_foot')}
// //     ${C(`RESUMEN — ${data.length} tarifa(s)`, 'String', 's_foot')}
// //     ${C('', 'String', 's_foot')}
// //     ${C('', 'String', 's_foot')}
// //     ${C('', 'String', 's_foot')}
// //     ${C('', 'String', 's_foot')}
// //     ${C(N(minVal), 'Number', 's_foot_m')}
// //     ${C(N(avgVal), 'Number', 's_foot_m')}
// //     ${C(N(maxVal), 'Number', 's_foot_m')}
// //     ${C('', 'String', 's_foot')}
// //     ${C('Mín · Prom · Máx', 'String', 's_foot')}
// //   </Row>`;

// //   // ── Hoja de parámetros ────────────────────────────────────────
// //   const paramSheet = `<Worksheet ss:Name="Parámetros">
// //   <Table>
// //     <Column ss:Width="170"/><Column ss:Width="260"/>
// //     <Row ss:Height="30"><Cell ss:StyleID="s_title" ss:MergeAcross="1"><Data ss:Type="String">Consulta SiceTac — HARMONY 2026</Data></Cell></Row>
// //     <Row ss:Height="6"/>
// //     ${[
// //       ['Fecha exportación', fechaExp],
// //       ['Origen DIVIPOLA', origen],
// //       ['Destino DIVIPOLA', destino],
// //       ['Período consultado', periodo],
// //       ['Condición de carga', condicion],
// //       ['Modo de consulta', modo],
// //       ['Total tarifas', String(data.length)],
// //       ['Valor mínimo', scFmtCOP(minVal)],
// //       ['Valor promedio', scFmtCOP(avgVal)],
// //       ['Valor máximo', scFmtCOP(maxVal)],
// //       ['Usuario', SC_STATE.usuario || '—'],
// //     ].map(([k, v]) => `<Row ss:Height="20">${C(k, 'String', 's_meta_k')}${C(v, 'String', 's_meta_v')}</Row>`).join('\n')}
// //   </Table>
// //   </Worksheet>`;

// //   // ── Hoja principal ────────────────────────────────────────────
// //   const mainSheet = `<Worksheet ss:Name="Tarifas SiceTac">
// //   <Table>
// //     <Column ss:Width="32"/>
// //     <Column ss:Width="62"/>
// //     <Column ss:Width="210"/>
// //     <Column ss:Width="82"/>
// //     <Column ss:Width="82"/>
// //     <Column ss:Width="72"/>
// //     <Column ss:Width="68"/>
// //     <Column ss:Width="130"/>
// //     <Column ss:Width="115"/>
// //     <Column ss:Width="105"/>
// //     <Column ss:Width="72"/>
// //     <Column ss:Width="120"/>

// //     <Row ss:Height="32">
// //       <Cell ss:StyleID="s_title" ss:MergeAcross="11">
// //         <Data ss:Type="String">Tarifas SiceTac · ${esc(origen)} → ${esc(destino)} · Período ${esc(periodo)} · ${esc(condicion)}</Data>
// //       </Cell>
// //     </Row>
// //     <Row ss:Height="4"/>
// //     ${theadRow}
// //     ${dataRows}
// //     <Row ss:Height="4"/>
// //     ${footerRow}
// //   </Table>
// //   <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
// //     <FreezePanes/>
// //     <FrozenNoSplit/>
// //     <SplitHorizontal>3</SplitHorizontal>
// //     <TopRowBottomPane>3</TopRowBottomPane>
// //     <ActivePane>2</ActivePane>
// //     <Panes>
// //       <Pane><Number>3</Number></Pane>
// //       <Pane><Number>2</Number><ActiveRow>3</ActiveRow></Pane>
// //     </Panes>
// //   </WorksheetOptions>
// //   </Worksheet>`;

// //   // ── Armar libro completo ──────────────────────────────────────
// //   const wb = `<?xml version="1.0" encoding="UTF-8"?>
// // <?mso-application progid="Excel.Sheet"?>
// // <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
// //           xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
// //           xmlns:x="urn:schemas-microsoft-com:office:excel">
// //   <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
// //     <Title>Tarifas SiceTac</Title>
// //     <Author>HARMONY 2026</Author>
// //     <Created>${new Date().toISOString()}</Created>
// //   </DocumentProperties>
// //   ${styles}
// //   ${mainSheet}
// //   ${paramSheet}
// // </Workbook>`;

// //   // ── Disparar descarga ─────────────────────────────────────────
// //   const blob = new Blob([wb], { type: 'application/vnd.ms-excel;charset=utf-8' });
// //   const url = URL.createObjectURL(blob);
// //   const a = document.createElement('a');
// //   const nombre = `SiceTac_${origen}_${destino}_${periodo || 'periodo'}_${Date.now()}.xls`;
// //   a.href = url;
// //   a.download = nombre;
// //   document.body.appendChild(a);
// //   a.click();
// //   document.body.removeChild(a);
// //   URL.revokeObjectURL(url);

// //   scFlash('success', 'Excel generado', `"${nombre}" descargado con ${data.length} tarifa(s).`);
// // }

// /* ============================================================
//    EXPORTAR A EXCEL
//    Genera un .xls real con formato SpreadsheetML (nativo,
//    sin librerías externas). Abre directamente en Excel/LibreOffice.
//    Incluye:
//      · Hoja principal con todos los datos, estilos y fila resumen
//      · Hoja de parámetros con los metadatos de la consulta
//      · Fila de encabezados con fondo navy y letra blanca
//      · Filas con color según min (verde) / max (rojo)
//      · Columnas de moneda con formato $ #,##0
//      · Panel superior fijo (freeze 3 filas)
//    ============================================================ */
// function scExportarExcel() {
//   const data = SC_STATE.data;
//   if (!data || data.length === 0) {
//     return scFlash('info', 'Sin datos', 'Primero realiza una consulta para exportar resultados.');
//   }

//   const origen = document.getElementById('f-origen')?.value || '—';
//   const destino = document.getElementById('f-destino')?.value || '—';
//   const periodo = SC_STATE.periodoActivo || document.getElementById('f-periodo')?.value || '—';
//   const condicion = document.getElementById('f-condicion')?.value === '1' ? 'Cargado' : 'Vacío';
//   const modo = { exacta: 'Exacta', ruta: 'Por Ruta', multiconfig: 'Multi-Config' }[SC_STATE.modo] || SC_STATE.modo;
//   const fechaExp = new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
//   const minVal = Math.min(...data.map(t => t.valor));
//   const maxVal = Math.max(...data.map(t => t.valor));
//   const avgVal = data.reduce((a, t) => a + (Number(t.valor) || 0), 0) / data.length;

//   // ── Helpers ────────────────────────────────────────────────
//   const esc = s => String(s ?? '')
//     .replace(/&/g, '&amp;').replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

//   const C = (val, type, sid) =>
//     `<Cell${sid ? ` ss:StyleID="${sid}"` : ''}><Data ss:Type="${type}">${esc(val)}</Data></Cell>`;

//   const N = v => (v === null || v === undefined) ? 0 : Number(v);

//   // ── Estilos ─────────────────────────────────────────────────
//   const styles = `<Styles>
//   <Style ss:ID="s_title">
//     <Font ss:Bold="1" ss:Size="13" ss:Color="#0F1F3D"/>
//   </Style>
//   <Style ss:ID="s_meta_k">
//     <Font ss:Bold="1" ss:Size="10" ss:Color="#1A3C6B"/>
//     <Interior ss:Color="#F0F4F8" ss:Pattern="Solid"/>
//   </Style>
//   <Style ss:ID="s_meta_v">
//     <Font ss:Size="10" ss:Color="#0F1F3D"/>
//   </Style>
//   <Style ss:ID="s_th">
//     <Font ss:Bold="1" ss:Size="10" ss:Color="#FFFFFF"/>
//     <Interior ss:Color="#0F1F3D" ss:Pattern="Solid"/>
//     <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
//     <Borders>
//       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#E8A020"/>
//       <Border ss:Position="Right"  ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#1A3C6B"/>
//     </Borders>
//   </Style>
//   <Style ss:ID="s_row">
//     <Font ss:Size="10" ss:Color="#0F1F3D"/>
//     <Alignment ss:Vertical="Center"/>
//     <Borders>
//       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDE3EF"/>
//     </Borders>
//   </Style>
//   <Style ss:ID="s_row_c">
//     <Font ss:Size="10" ss:Color="#0F1F3D"/>
//     <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
//     <Borders>
//       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDE3EF"/>
//     </Borders>
//   </Style>
//   <Style ss:ID="s_money">
//     <Font ss:Size="10" ss:Color="#0F1F3D"/>
//     <NumberFormat ss:Format="&quot;$&quot; #,##0"/>
//     <Alignment ss:Horizontal="Right"/>
//     <Borders>
//       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDE3EF"/>
//     </Borders>
//   </Style>
//   <Style ss:ID="s_min">
//     <Font ss:Bold="1" ss:Size="10" ss:Color="#166534"/>
//     <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
//     <Alignment ss:Vertical="Center"/>
//     <Borders>
//       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/>
//     </Borders>
//   </Style>
//   <Style ss:ID="s_min_c">
//     <Font ss:Bold="1" ss:Size="10" ss:Color="#166534"/>
//     <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
//     <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
//     <Borders>
//       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/>
//     </Borders>
//   </Style>
//   <Style ss:ID="s_min_m">
//     <Font ss:Bold="1" ss:Size="10" ss:Color="#166534"/>
//     <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
//     <NumberFormat ss:Format="&quot;$&quot; #,##0"/>
//     <Alignment ss:Horizontal="Right"/>
//     <Borders>
//       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/>
//     </Borders>
//   </Style>
//   <Style ss:ID="s_max">
//     <Font ss:Size="10" ss:Color="#991B1B"/>
//     <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
//     <Alignment ss:Vertical="Center"/>
//     <Borders>
//       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/>
//     </Borders>
//   </Style>
//   <Style ss:ID="s_max_c">
//     <Font ss:Size="10" ss:Color="#991B1B"/>
//     <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
//     <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
//     <Borders>
//       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/>
//     </Borders>
//   </Style>
//   <Style ss:ID="s_max_m">
//     <Font ss:Size="10" ss:Color="#991B1B"/>
//     <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
//     <NumberFormat ss:Format="&quot;$&quot; #,##0"/>
//     <Alignment ss:Horizontal="Right"/>
//     <Borders>
//       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/>
//     </Borders>
//   </Style>
//   <Style ss:ID="s_foot">
//     <Font ss:Bold="1" ss:Size="10" ss:Color="#1A3C6B"/>
//     <Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/>
//     <Borders>
//       <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#1A3C6B"/>
//     </Borders>
//   </Style>
//   <Style ss:ID="s_foot_m">
//     <Font ss:Bold="1" ss:Size="10" ss:Color="#1A3C6B"/>
//     <Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/>
//     <NumberFormat ss:Format="&quot;$&quot; #,##0"/>
//     <Alignment ss:Horizontal="Right"/>
//     <Borders>
//       <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#1A3C6B"/>
//     </Borders>
//   </Style>
//   </Styles>`;

//   // ── Filas de datos ───────────────────────────────────────────
//   // Columnas activas — idénticas al <thead> de la tabla PHTML:
//   // # | Config. | Via | Origen | Destino | Condición | Unidad Transporte |
//   // Tipo Carga | Dist. km | Valor Movilización | Val. Hora | Tiemp. Hora | Período
//   const dataRows = data.map((t, i) => {
//     const esMin = t.valor === minVal && data.length > 1;
//     const esMax = t.valor === maxVal && data.length > 1;
//     const sN = esMin ? 's_min' : (esMax ? 's_max' : 's_row');
//     const sC = esMin ? 's_min_c' : (esMax ? 's_max_c' : 's_row_c');
//     const sM = esMin ? 's_min_m' : (esMax ? 's_max_m' : 's_money');
//     const cond = (t.condicioncarga === 'CARGADO' || t.condicioncarga === 1) ? 'Cargado' : 'Vacío';
//     const origenCell = [t.nomorigen, t.origen].filter(Boolean).join(' / ');
//     const destinoCell = [t.nomdestino, t.destino].filter(Boolean).join(' / ');
//     return `<Row ss:Height="22">
//       ${C(i + 1, 'Number', sC)}
//       ${C(t.configuracion || '—', 'String', sC)}
//       ${C(t.via || '—', 'String', sN)}
//       ${C(origenCell || '—', 'String', sC)}
//       ${C(destinoCell || '—', 'String', sC)}
//       ${C(cond, 'String', sC)}
//       ${C(t.nombreunidadtransporte || '—', 'String', sN)}
//       ${C(scFixText(t.nombretipocarga) || '—', 'String', sN)}
//       ${C(N(t.kilometros), 'Number', sC)}
//       ${C(N(t.valor), 'Number', sM)}
//       ${C(N(t.valorHora), 'Number', sM)}
//       ${C(String(t.horasrecorrido ?? '—'), 'String', sC)}
//       ${C(t.periodo || '—', 'String', sC)}
//     </Row>`;
//   }).join('\n');

//   // ── Encabezados (mismo orden que el <thead> del PHTML) ────────
//   const cols = [
//     '#', 'Config.', 'Via', 'Origen', 'Destino', 'Condición',
//     'Unidad Transporte', 'Tipo Carga', 'Dist. km',
//     'Valor Movilización', 'Val. Hora', 'Tiemp. Hora', 'Período',
//   ];
//   const theadRow = `<Row ss:Height="30">${cols.map(h => C(h, 'String', 's_th')).join('')}</Row>`;

//   // ── Fila resumen (13 columnas — resumen en cols 10-12) ─────────
//   const footerRow = `<Row ss:Height="26">
//     ${C('', 'String', 's_foot')}
//     ${C('', 'String', 's_foot')}
//     ${C(`RESUMEN — ${data.length} tarifa(s)`, 'String', 's_foot')}
//     ${C('', 'String', 's_foot')}
//     ${C('', 'String', 's_foot')}
//     ${C('', 'String', 's_foot')}
//     ${C('', 'String', 's_foot')}
//     ${C('', 'String', 's_foot')}
//     ${C('', 'String', 's_foot')}
//     ${C(N(minVal), 'Number', 's_foot_m')}
//     ${C(N(avgVal), 'Number', 's_foot_m')}
//     ${C(N(maxVal), 'Number', 's_foot_m')}
//     ${C('Mín · Prom · Máx', 'String', 's_foot')}
//   </Row>`;

//   // ── Hoja de parámetros ────────────────────────────────────────
//   const paramSheet = `<Worksheet ss:Name="Parámetros">
//   <Table>
//     <Column ss:Width="170"/><Column ss:Width="260"/>
//     <Row ss:Height="30"><Cell ss:StyleID="s_title" ss:MergeAcross="1"><Data ss:Type="String">Consulta SiceTac — HARMONY 2026</Data></Cell></Row>
//     <Row ss:Height="6"/>
//     ${[
//       ['Fecha exportación', fechaExp],
//       ['Origen DIVIPOLA', origen],
//       ['Destino DIVIPOLA', destino],
//       ['Período consultado', periodo],
//       ['Condición de carga', condicion],
//       ['Modo de consulta', modo],
//       ['Total tarifas', String(data.length)],
//       ['Valor mínimo', scFmtCOP(minVal)],
//       ['Valor promedio', scFmtCOP(avgVal)],
//       ['Valor máximo', scFmtCOP(maxVal)],
//       ['Usuario', SC_STATE.usuario || '—'],
//     ].map(([k, v]) => `<Row ss:Height="20">${C(k, 'String', 's_meta_k')}${C(v, 'String', 's_meta_v')}</Row>`).join('\n')}
//   </Table>
//   </Worksheet>`;

//   // ── Hoja principal ────────────────────────────────────────────
//   const mainSheet = `<Worksheet ss:Name="Tarifas SiceTac">
//   <Table>
//     <Column ss:Width="32"/>   <!-- # -->
//     <Column ss:Width="58"/>   <!-- Config. -->
//     <Column ss:Width="190"/>  <!-- Via -->
//     <Column ss:Width="160"/>  <!-- Origen (nombre + divipola) -->
//     <Column ss:Width="160"/>  <!-- Destino (nombre + divipola) -->
//     <Column ss:Width="72"/>   <!-- Condición -->
//     <Column ss:Width="140"/>  <!-- Unidad Transporte -->
//     <Column ss:Width="130"/>  <!-- Tipo Carga -->
//     <Column ss:Width="65"/>   <!-- Dist. km -->
//     <Column ss:Width="125"/>  <!-- Valor Movilización -->
//     <Column ss:Width="100"/>  <!-- Val. Hora -->
//     <Column ss:Width="80"/>   <!-- Tiemp. Hora -->
//     <Column ss:Width="70"/>   <!-- Período -->

//     <Row ss:Height="32">
//       <Cell ss:StyleID="s_title" ss:MergeAcross="12">
//         <Data ss:Type="String">Tarifas SiceTac · ${esc(origen)} → ${esc(destino)} · Período ${esc(periodo)} · ${esc(condicion)}</Data>
//       </Cell>
//     </Row>
//     <Row ss:Height="4"/>
//     ${theadRow}
//     ${dataRows}
//     <Row ss:Height="4"/>
//     ${footerRow}
//   </Table>
//   <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
//     <FreezePanes/>
//     <FrozenNoSplit/>
//     <SplitHorizontal>3</SplitHorizontal>
//     <TopRowBottomPane>3</TopRowBottomPane>
//     <ActivePane>2</ActivePane>
//     <Panes>
//       <Pane><Number>3</Number></Pane>
//       <Pane><Number>2</Number><ActiveRow>3</ActiveRow></Pane>
//     </Panes>
//   </WorksheetOptions>
//   </Worksheet>`;

//   // ── Armar libro completo ──────────────────────────────────────
//   const wb = `<?xml version="1.0" encoding="UTF-8"?>
// <?mso-application progid="Excel.Sheet"?>
// <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
//           xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
//           xmlns:x="urn:schemas-microsoft-com:office:excel">
//   <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
//     <Title>Tarifas SiceTac</Title>
//     <Author>HARMONY 2026</Author>
//     <Created>${new Date().toISOString()}</Created>
//   </DocumentProperties>
//   ${styles}
//   ${mainSheet}
//   ${paramSheet}
// </Workbook>`;

//   // ── Disparar descarga ─────────────────────────────────────────
//   const blob = new Blob([wb], { type: 'application/vnd.ms-excel;charset=utf-8' });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   const nombre = `SiceTac_${origen}_${destino}_${periodo || 'periodo'}_${Date.now()}.xls`;
//   a.href = url;
//   a.download = nombre;
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
//   URL.revokeObjectURL(url);

//   scFlash('success', 'Excel generado', `"${nombre}" descargado con ${data.length} tarifa(s).`);
// }

// /* ============================================================
//    TOGGLE BOTÓN EXPORTAR
//    ============================================================ */
// function scToggleExportBtn(visible) {
//   const btn = document.getElementById('btn-exportar-excel');
//   if (btn) btn.style.display = visible ? '' : 'none';
// }

// /* ============================================================
//    ABRIR / CERRAR OFFCANVAS
//    ============================================================ */
// function scAbrirDetalle(idx) {
//   const tarifa = SC_STATE.data[idx];
//   if (!tarifa) return;
//   SC_STATE.tarifaActual = tarifa;

//   const elTitle = document.getElementById('oc-title');
//   const elSub = document.getElementById('oc-sub');
//   if (elTitle) elTitle.textContent = `${tarifa.configuracionesid} — ${tarifa.nombreRuta || 'Detalle SiceTac'}`;
//   if (elSub) elSub.textContent = `Período ${tarifa.periodo} · ${tarifa.origen} → ${tarifa.destino}`;

//   scRenderInfoGrid(tarifa);
//   scRenderCalculo(tarifa);

//   const vPactado = document.getElementById('sc-v-pactado');
//   if (vPactado) vPactado.value = '';
//   scRenderValidacion();

//   document.getElementById('ap-offcanvas').classList.add('show');
//   document.getElementById('ap-backdrop').classList.add('show');
//   document.body.style.overflow = 'hidden';
// }

// function scCerrarDetalle() {
//   document.getElementById('ap-offcanvas').classList.remove('show');
//   document.getElementById('ap-backdrop').classList.remove('show');
//   document.body.style.overflow = '';
//   SC_STATE.tarifaActual = null;
// }

// /* ============================================================
//    RENDER INFO GENERAL (offcanvas)
//    ============================================================ */
// function scRenderInfoGrid(tarifa) {
//   const grid = document.getElementById('sc-info-grid');
//   if (!grid) return;
//   const items = [
//     { label: 'Configuración', value: `<strong style="color:var(--ap-blue);font-size:1rem;">${tarifa.configuracionesid}</strong>` },
//     { label: 'Nombre Ruta', value: tarifa.nombreRuta || '—' },
//     { label: 'Período', value: tarifa.periodo || '—' },
//     { label: 'Fecha Ingreso', value: tarifa.fechaIngreso || '—' },
//     { label: 'Origen DIVIPOLA', value: `<span style="font-family:monospace;">${tarifa.origen}</span>` },
//     { label: 'Destino DIVIPOLA', value: `<span style="font-family:monospace;">${tarifa.destino}</span>` },
//     { label: 'Distancia', value: scFmtNum(tarifa.distancia) + ' km' },
//     { label: 'Condición Carga', value: tarifa.condicionCargaId == 1 ? '🟢 Cargado' : '🟡 Vacío' },
//   ];
//   grid.innerHTML = items.map(i => `
//     <div class="ap-info-item">
//       <div class="ap-info-label">${i.label}</div>
//       <div class="ap-info-value">${i.value}</div>
//     </div>`).join('');
// }

// /* ============================================================
//    CALCULADORA VALOR MÍNIMO
//    ============================================================ */
// function scRenderCalculo(tarifa) {
//   const tbody = document.getElementById('sc-calc-tbody');
//   if (!tbody) return;

//   const hC = parseFloat(document.getElementById('sc-h-cargue')?.value) || 0;
//   const hD = parseFloat(document.getElementById('sc-h-descargue')?.value) || 0;
//   const tot = hC + hD;

//   const elTotal = document.getElementById('sc-h-total');
//   if (elTotal) elTotal.value = tot;

//   const movil = tarifa.valor;
//   const tiempos = tarifa.valorHora * tot;
//   const minimo = movil + tiempos;

//   const elRes = document.getElementById('sc-result-valor');
//   if (elRes) elRes.textContent = scFmtCOP(minimo);

//   tbody.innerHTML = `
//     <tr>
//       <td>Valor movilización</td>
//       <td style="text-align:right;font-weight:700;">${scFmtCOP(movil)}</td>
//       <td style="color:var(--ap-gray);font-size:0.78rem;">Base SiceTac para esta ruta y configuración</td>
//     </tr>
//     <tr>
//       <td>Costo tiempo logístico</td>
//       <td style="text-align:right;font-weight:700;">${scFmtCOP(tiempos)}</td>
//       <td style="color:var(--ap-gray);font-size:0.78rem;">
//         ${scFmtCOP(tarifa.valorHora)} × ${tot} h (${hC}h cargue + ${hD}h descargue)
//       </td>
//     </tr>
//     <tr class="row-total">
//       <td><strong>Valor mínimo a pagar</strong></td>
//       <td style="text-align:right;font-size:1.05rem;">${scFmtCOP(minimo)}</td>
//       <td style="font-size:0.78rem;">Todo valor pactado inferior activa <strong>ALERTA001</strong> en el RNDC</td>
//     </tr>`;

//   scRenderValidacion();
// }

// function scRecalcular() {
//   if (!SC_STATE.tarifaActual) return;
//   scRenderCalculo(SC_STATE.tarifaActual);
// }

// /* ============================================================
//    VALIDAR VALOR PACTADO
//    ============================================================ */
// function scRenderValidacion() {
//   const tarifa = SC_STATE.tarifaActual;
//   const resEl = document.getElementById('sc-val-result');
//   if (!resEl || !tarifa) return;

//   const vPactado = parseFloat(document.getElementById('sc-v-pactado')?.value) || 0;
//   const hC = parseFloat(document.getElementById('sc-v-hc')?.value) || 0;
//   const hD = parseFloat(document.getElementById('sc-v-hd')?.value) || 0;

//   if (!vPactado) {
//     resEl.innerHTML = `
//       <div class="ap-validacion ok" style="opacity:0.45;">
//         <div class="ap-val-icon"><i class="fas fa-info-circle"></i></div>
//         <div>
//           <div class="ap-val-title">Ingresa el valor pactado para validar</div>
//           <div class="ap-val-sub">El sistema comparará contra el mínimo SiceTac calculado</div>
//         </div>
//       </div>`;
//     return;
//   }

//   const tiempos = tarifa.valorHora * (hC + hD);
//   const minimo = tarifa.valor + tiempos;
//   const cumple = vPactado >= minimo;
//   const dif = vPactado - minimo;

//   resEl.innerHTML = `
//     <div class="ap-validacion ${cumple ? 'ok' : 'warn'}">
//       <div class="ap-val-icon">
//         <i class="fas fa-${cumple ? 'check-circle' : 'exclamation-triangle'}"></i>
//       </div>
//       <div>
//         <div class="ap-val-title">
//           ${cumple ? '✅ El valor pactado cumple el mínimo SiceTac' : '⚠️ ALERTA001 — Valor inferior al mínimo SiceTac'}
//         </div>
//         <div class="ap-val-sub" style="margin-top:6px;">
//           Valor pactado: <strong>${scFmtCOP(vPactado)}</strong> ·
//           Mínimo SiceTac: <strong>${scFmtCOP(minimo)}</strong> ·
//           Diferencia: <strong style="color:${cumple ? '#16a34a' : '#dc2626'};">
//             ${cumple ? '+' : ''}${scFmtCOP(dif)}
//           </strong>
//         </div>
//       </div>
//     </div>`;
// }

// /* ============================================================
//    HELPERS DE TABLA
//    ============================================================ */
// function scTableLoading() {
//   const tbody = document.getElementById('sc-tbody');
//   if (!tbody) return;
//   tbody.innerHTML = `
//     <tr><td colspan="12">
//       <div style="padding:40px;text-align:center;color:var(--ap-gray);">
//         <i class="fas fa-spinner fa-spin" style="font-size:1.5rem;margin-bottom:10px;"></i>
//         <br>Consultando tarifas SiceTac...
//       </div>
//     </td></tr>`;
// }

// function scTableError(msg) {
//   const tbody = document.getElementById('sc-tbody');
//   if (!tbody) return;
//   tbody.innerHTML = `
//     <tr><td colspan="12">
//       <div class="ap-empty">
//         <div class="ap-empty-icon"><i class="fas fa-exclamation-triangle"></i></div>
//         <div class="ap-empty-title">Error al consultar</div>
//         <div class="ap-empty-sub">${msg || 'Intenta nuevamente'}</div>
//       </div>
//     </td></tr>`;
// }

// function scBtnLoading(id, loading) {
//   const btn = document.getElementById(id);
//   if (!btn) return;
//   btn.disabled = loading;
//   if (loading) {
//     btn.dataset.origHtml = btn.innerHTML;
//     btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Consultando...';
//   } else {
//     btn.innerHTML = btn.dataset.origHtml || btn.innerHTML;
//   }
// }

// /* ============================================================
//    FORMATTERS
//    ============================================================ */
// function scFmtCOP(valor) {
//   if (valor === null || valor === undefined || (valor !== 0 && !valor)) return '—';
//   return new Intl.NumberFormat('es-CO', {
//     style: 'currency', currency: 'COP',
//     minimumFractionDigits: 0, maximumFractionDigits: 0,
//   }).format(valor);
// }

// function scFmtNum(valor) {
//   if (!valor && valor !== 0) return '—';
//   return new Intl.NumberFormat('es-CO').format(valor);
// }

// /* ============================================================
//    FLASH NOTIFICATIONS
//    ============================================================ */
// let _scFlashTimer = null;

// function scFlash(type, title, msg) {
//   const el = document.getElementById('ap-flash');
//   if (!el) return;
//   el.className = `ap-flash ${type}`;
//   document.getElementById('ap-flash-title').textContent = title;
//   document.getElementById('ap-flash-msg').textContent = msg;
//   const iconMap = { success: 'fas fa-check-circle', error: 'fas fa-times-circle', info: 'fas fa-info-circle' };
//   // const iconEl = document.getElementById('ap-flash-icon');
//   // if (iconEl) iconEl.className = (iconMap[type] || 'fas fa-info-circle') + ' ';
//   requestAnimationFrame(() => el.classList.add('show'));
//   clearTimeout(_scFlashTimer);
//   _scFlashTimer = setTimeout(scFlashHide, 4500);
// }

// function scFlashHide() {
//   const el = document.getElementById('ap-flash');
//   if (el) el.classList.remove('show');
// }

// /* ============================================================
//    API FETCH HELPER
//    · Acepta headers externos (SC_HEADERS_SICETAC) como parámetro
//    · Los fusiona sobre los headers base — externos tienen prioridad
//    · Construye query string automáticamente para GET
//    ============================================================ */
// async function scApiFetch(url, { method = 'GET', params = null, data = null, headers = {} } = {}) {

//   // Construir query string para peticiones GET
//   if (params && method === 'GET') {
//     const qs = new URLSearchParams(
//       Object.fromEntries(
//         Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
//       )
//     );
//     url = `${url}?${qs}`;
//   }

//   // Headers base + los externos encima (SC_HEADERS_SICETAC agrega X-API-KEY)
//   const opts = {
//     method,
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//       'X-Requested-With': 'XMLHttpRequest',
//       ...headers,   // SC_HEADERS_SICETAC() sobreescribe / extiende aquí
//     },
//   };

//   // Body solo en métodos que lo admiten
//   if (data && method !== 'GET') {
//     opts.body = JSON.stringify(data);
//   }

//   const resp = await fetch(url, opts);

//   if (!resp.ok) {
//     const err = await resp.json().catch(() => ({}));
//     throw new Error(err.message || err.error || `Error HTTP ${resp.status}`);
//   }

//   return resp.json();
// }

// async function Municipios() {
//   try {
//     const response = await fetch($('#base_url_api').val() + 'tarifas/listar-municipios', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         // 'X-Requested-With': 'XMLHttpRequest',
//         'X-API-KEY': 'nexos_nacional2026@*',
//       },
//       cache: 'no-cache',
//     });

//     const data = await response.json();

//     // 👉 guardar en memoria global para reutilizar
//     window.municipiosData = data;

//     // 👉 recorrer todos los selects
//     $('#f-origen').each(function () {
//       const $select = $(this);
//       $select.empty().append('<option value="">Seleccione un municipio</option>');

//       data.data.forEach(function (element) {
//         $select.append(
//           `<option value="${element.rndc_codigo_ciudad}" data-municipio="${element.municipio}" data-depto="${element.depto}">
//                           ${element.municipio} - ${element.depto}
//            </option>`
//         );
//       });

//       // reinicializar select2
//       // $select.select2({
//       //   placeholder: 'Seleccione un municipio',
//       //   allowClear: true,
//       //   width: '100%'
//       // });
//     });

//     $('#f-destino').each(function () {
//       const $select = $(this);
//       $select.empty().append('<option value="">Seleccione un municipio</option>');

//       data.data.forEach(function (element) {
//         $select.append(
//           `<option value="${element.rndc_codigo_ciudad}" data-municipio="${element.municipio}" data-depto="${element.depto}">
//                           ${element.municipio} - ${element.depto}
//            </option>`
//         );
//       });

//       // reinicializar select2
//       // $select.select2({
//       //   placeholder: 'Seleccione un municipio',
//       //   allowClear: true,
//       //   width: '100%'
//       // });
//     });

//   } catch (error) {
//     console.error('Error en Municipios:', error);
//     throw error;
//   }
// }

// /* ============================================================
//    AUTO-INICIO
//    ============================================================ */
// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', scInit, Municipios);
//   // document.addEventListener('DOMContentLoaded', Municipios);
// } else {
//   scInit();
//   Municipios();
// }

// /* ============================================================
//    EXPOSICIÓN GLOBAL
//    Para onclick= / oninput= inline en el phtml
//    ============================================================ */
// window.scInit = scInit;
// window.scConsultar = scConsultar;
// window.scSetModo = scSetModo;
// window.scFiltrarTabla = scFiltrarTabla;
// window.scLimpiarFiltros = scLimpiarFiltros;
// window.scAbrirDetalle = scAbrirDetalle;
// window.scCerrarDetalle = scCerrarDetalle;
// window.scRecalcular = scRecalcular;
// window.scRenderValidacion = scRenderValidacion;
// window.scFlashHide = scFlashHide;
// window.scExportarExcel = scExportarExcel;
// window.Municipios = Municipios;

// window.initScript = function (id) {
//   window.VENTANA = id;
//   scInit();
// };

// /* ============================================================
//    ALIASES — nombres usados en los onclick del phtml existente
//    ============================================================ */
// window.sicetacConsultar = scConsultar;
// window.sicetacLimpiar = scLimpiarFiltros;
// window.setModo = scSetModo;
// window.filtrarTabla = scFiltrarTabla;
// window.cerrarDetalle = scCerrarDetalle;
// window.abrirDetalle = scAbrirDetalle;
// window.recalcular = scRecalcular;
// window.apFlashHide = scFlashHide;




/**
 * ============================================================
 *  MÓDULO DE CONSULTA — TARIFAS SICETAC
 *  Proyecto HARMONY 2026 | Transporte Nacional
 *  Archivo: sicetac_tarifas.js
 * ============================================================
 *
 *  DEPENDENCIAS:
 *  - Swal (sweetalert2)
 *  - jQuery (para selector base_url_api)
 *  - FontAwesome (íconos)
 *
 *  INICIALIZACIÓN:
 *  El sistema llama window.initScript(id) al cargar el módulo.
 *  También se puede llamar scInit() directamente.
 *
 *  API ESPERADA (Laravel):
 *  GET  /api/v1/sicetac/tarifa           → modo exacto
 *  GET  /api/v1/sicetac/tarifas/ruta     → todas las configs de la ruta
 *  POST /api/v1/sicetac/tarifas/configs  → multi-configuraciones
 * ============================================================
 */

(function () {

  'use strict';

  /* ============================================================
     HEADERS DE AUTENTICACIÓN
     Centralizado aquí. Si cambia la key, solo tocas este lugar.
     Se fusionan sobre los headers base dentro de scApiFetch().
     ============================================================ */
  const SC_HEADERS_SICETAC = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-API-KEY': 'mi_super_api_key_ultra_secreta_123',
  });

  /* ============================================================
     ESTADO GLOBAL DEL MÓDULO
     ============================================================ */
  let SC_STATE = {
    data: [],
    tarifaActual: null,
    empresa_id: null,
    usuario: null,
    baseUrl: '',
    modo: 'exacta',
    periodoActivo: '',
  };

  /* ============================================================
     INICIALIZACIÓN
     ============================================================ */
  function scInit() {
    SC_STATE.empresa_id = document.getElementById('empresa_id')?.value || 1;
    SC_STATE.usuario = document.getElementById('ssn_nombre')?.value
      || window?.USER_NAME
      || 'sistema';
    SC_STATE.baseUrl = (typeof $ !== 'undefined' ? $('#base_url_api').val() : null)
      || document.getElementById('base_url_api')?.value
      || 'parametros/';

    const hoy = new Date();
    const periodoDefault = hoy.getFullYear().toString()
      + String(hoy.getMonth() + 1).padStart(2, '0');

    const periodoEl = document.getElementById('f-periodo');
    if (periodoEl && !periodoEl.value) {
      periodoEl.placeholder = `Ej: ${periodoDefault} (actual)`;
    }

    scBuildMultiChecks();
  }

  /* ============================================================
     GESTIÓN DEL MODO DE CONSULTA
     ============================================================ */
  function scSetModo(modo, tabEl) {
    SC_STATE.modo = modo;
    document.querySelectorAll('.modo-tab').forEach(t => t.classList.remove('active'));
    if (tabEl) tabEl.classList.add('active');

    const wrapConfig = document.getElementById('wrap-config');
    const wrapCondicion = document.getElementById('wrap-condicion');
    const wrapMulti = document.getElementById('wrap-multiconfig');

    if (wrapConfig) wrapConfig.style.display = (modo !== 'ruta') ? '' : 'none';
    if (wrapCondicion) wrapCondicion.style.display = '';
    if (wrapMulti) wrapMulti.style.display = (modo === 'multiconfig') ? 'block' : 'none';
  }

  /* ============================================================
     CHECKBOXES MULTI-CONFIG
     ============================================================ */
  const SC_CONFIGS = [
    { v: '3S3', l: '3S3 — Tractomula 3+3' }, { v: '3S2', l: '3S2 — Tractomula 3+2' },
    { v: '2S3', l: '2S3 — Tractomula 2+3' }, { v: '2S2', l: '2S2 — Tractomula 2+2' },
    { v: '3', l: '3 — Camión 3 ejes' }, { v: '2', l: '2 — Camión 2 ejes' },
    { v: '2L1', l: '2L1 — Liviano' }, { v: '2L2', l: '2L2 — Liviano' },
    { v: '2L3', l: '2L3 — Liviano' }, { v: 'V2', l: 'V2 — Volqueta' },
    { v: 'V3', l: 'V3 — Volqueta' }, { v: 'V4', l: 'V4 — Volqueta' },
  ];
  const SC_MULTI_DEFAULT = ['3S3', '2S3', '3S2'];

  function scBuildMultiChecks() {
    const contenedor = document.getElementById('multi-check-list');
    if (!contenedor || contenedor.innerHTML.trim()) return;
    contenedor.innerHTML = SC_CONFIGS.map(c => `
    <label class="check-pill">
      <input type="checkbox" name="multi-cfg" value="${c.v}"
             ${SC_MULTI_DEFAULT.includes(c.v) ? 'checked' : ''}>
      ${c.l}
    </label>`).join('');
  }

  /* ============================================================
     CONSULTAR — PUNTO DE ENTRADA PRINCIPAL
     ============================================================ */
  async function scConsultar() {
    const origen = document.getElementById('f-origen')?.value.trim() || '';
    const destino = document.getElementById('f-destino')?.value.trim() || '';
    const periodo = document.getElementById('f-periodo')?.value.trim() || '';
    const condicion = document.getElementById('f-condicion')?.value || '1';

    if (!origen) return scFlash('error', 'Origen inválido', 'El código DIVIPOLA debe tener exactamente 8 dígitos.');
    if (!destino) return scFlash('error', 'Destino inválido', 'El código DIVIPOLA debe tener exactamente 8 dígitos.');

    scBtnLoading('btn-consultar', true);
    scTableLoading();
    scToggleExportBtn(false);

    try {
      let tarifas = [];
      let periodoReal = '';

      /* ── MODO EXACTA ── */
      if (SC_STATE.modo === 'exacta') {
        const config = document.getElementById('f-config')?.value || '3S3';
        const resp = await scApiFetch(
          // `${SC_STATE.baseUrl}sicetac/tarifa`,
          `http://127.0.0.1:8000/api/v1/sicetac/tarifa`,
          {
            method: 'GET',
            headers: SC_HEADERS_SICETAC(),
            params: { origen, destino, configuracionesid: config, condicion_carga: condicion, periodo },
          }
        );
        // tarifas = resp.tarifa ? [resp.tarifa] : [];
        // periodoReal = resp.periodo || '';

        // CORRECCIÓN AQUÍ:
        // Si 'resp.tarifas' ya es un array según tu JSON, lo asignamos directamente.
        // Usamos el operador || [] por si viene nulo.
        tarifas = Array.isArray(resp.tarifas) ? resp.tarifas : (resp.tarifas ? [resp.tarifas] : []);

        periodoReal = resp.periodo || '';

        /* ── MODO RUTA ── */
      } else if (SC_STATE.modo === 'ruta') {
        const resp = await scApiFetch(
          // `${SC_STATE.baseUrl}sicetac/tarifas/ruta`,
          `http://127.0.0.1:8000/api/v1/sicetac/tarifas/ruta`,
          {
            method: 'GET',
            headers: SC_HEADERS_SICETAC(),
            params: { origen, destino, condicion_carga: condicion, periodo },
          }
        );
        tarifas = resp.tarifas || [];
        periodoReal = resp.periodo || '';

        /* ── MODO MULTI-CONFIG ── */
      } else {
        const checks = [...document.querySelectorAll('input[name="multi-cfg"]:checked')].map(c => c.value);
        if (!checks.length) {
          scBtnLoading('btn-consultar', false);
          return scFlash('error', 'Sin configuraciones', 'Selecciona al menos una configuración para comparar.');
        }
        const body = { origen, destino, configuraciones: checks, condicion_carga: +condicion };
        if (periodo) body.periodo = periodo;

        const resp = await scApiFetch(
          // `${SC_STATE.baseUrl}sicetac/tarifas/configs`,
          `http://127.0.0.1:8000/api/v1/sicetac/tarifas/configs`,
          {
            method: 'POST',
            headers: SC_HEADERS_SICETAC(),
            data: body,
          }
        );
        tarifas = resp.tarifas || [];
        periodoReal = resp.periodo || '';
      }

      SC_STATE.data = tarifas;
      SC_STATE.periodoActivo = periodoReal;

      scRenderTabla(tarifas);
      scActualizarStats(tarifas);

      const lblPeriodo = document.getElementById('lbl-periodo-activo');
      if (lblPeriodo) lblPeriodo.innerHTML =
        `<i class="fas fa-calendar-alt"></i> Período: <strong>${periodoReal || '—'}</strong>`;

      const lblModo = document.getElementById('lbl-info-activo');
      const modoLabels = { exacta: '① Exacta', ruta: '② Por Ruta', multiconfig: '③ Multi-Config' };
      if (lblModo) lblModo.textContent = ` — ${modoLabels[SC_STATE.modo] || ''}`;

      const badgeCount = document.getElementById('ap-badge-count');
      if (badgeCount) badgeCount.textContent = tarifas.length;

      scToggleExportBtn(tarifas.length > 0);

      tarifas.length
        ? scFlash('success', 'Tarifas cargadas', `${tarifas.length} tarifa(s) encontrada(s) · Período ${periodoReal}`)
        : scFlash('info', 'Sin resultados', 'No se encontraron tarifas para los parámetros indicados.');

    } catch (err) {
      console.error('[SC] Error consultando SiceTac:', err);
      scTableError(err.message);
      scFlash('error', 'Error de consulta', err.message || 'No se pudo conectar con la API.');
    } finally {
      scBtnLoading('btn-consultar', false);
    }
  }

  /* ============================================================
     RENDER TABLA PRINCIPAL
     ============================================================ */
  function scRenderTabla(data) {
    const tbody = document.getElementById('sc-tbody');
    const TblSicetac = document.getElementById('tabla-sicetac');
    if (!tbody) return;

    if (!data || data.length === 0) {
      tbody.innerHTML = `
      <tr><td colspan="12">
        <div class="ap-empty">
          <div class="ap-empty-icon"><i class="fas fa-inbox"></i></div>
          <div class="ap-empty-title">Sin resultados</div>
          <div class="ap-empty-sub">No se encontraron tarifas para los parámetros indicados.</div>
        </div>
      </td></tr>`;
      return;
    }

    const minVal = Math.min(...data.map(t => t.valor));
    const maxVal = Math.max(...data.map(t => t.valor));

    tbody.innerHTML = data.map((item, idx) => {
      const esMin = item.valor === minVal && data.length > 1;
      const esMax = item.valor === maxVal && data.length > 1;
      const rowCls = esMin ? 'row-min' : (esMax ? 'row-max' : '');

      const condBadge = (item.condicioncarga === 'CARGADO' || item.condicioncarga === 1)
        ? `<span class="badge-cargado"><i class="fas fa-box"></i> Cargado</span>`
        : `<span class="badge-vacio"><i class="fas fa-box-open"></i> Vacío</span>`;

      return `
        <tr class="${rowCls}" data-idx="${idx}">
          <td style="color:var(--ap-gray); font-size:0.72rem;">${idx + 1}</td>
          <td><span class="badge-config">${item.configuracion}</span></td>
          <td style="max-width:220px; overflow:hidden; text-overflow:ellipsis;" title="${item.via || ''}">
            ${item.nombreRuta || '—'}
            ${esMin ? '<br><span class="tag-min"><i class="fas fa-star"></i> Más económico</span>' : ''}
          </td>
          <td style="font-family:monospace; font-size:0.8rem;">
            <div style="font-weight:700; font-size:0.9rem;">${item.nomorigen}</div>
            <div style="font-size:0.7rem; color:var(--ap-gray);">/ ${item.origen}</div>
          </td>
          <td style="font-family:monospace; font-size:0.8rem;">
            <div style="font-weight:700; font-size:0.9rem;">${item.nomdestino}</div>
            <div style="font-size:0.7rem; color:var(--ap-gray);">/ ${item.destino}</div>
          </td>
          <td>${condBadge}</td>
          <td>${item.nombreunidadtransporte}</td>
          <td>${scFixText(item.nombretipocarga)}</td>
          <td style="text-align:center; font-weight:600;">${scFmtNum(item.kilometros)}</td>
          <td>
            <div style="font-weight:700; font-size:0.9rem;">${scFmtCOP(item.valor)}</div>
            <div style="font-size:0.7rem; color:var(--ap-gray);">/ viaje completo</div>
          </td>
          <!--<td>${scFmtCOP(item.valorTonelada)}</td>-->
          <td>${scFmtCOP(item.valorHora)}</td>
          <td>${item.horasrecorrido}</td>
          <td style="font-size:0.78rem; color:var(--ap-gray);">${item.periodo || '—'}</td>
          <td>
            <button class="btn-ap-ver" onclick="scGuardarTarifa(${idx})" title="Guardar tarifa SiceTac"
              style="background:var(--ap-green);">
              <i class="fas fa-save"></i> Guardar
            </button>
          </td>
        </tr>`;
    }).join('');

    setTimeout(() => inicializarDataTableCostos(TblSicetac), 100);
  }

  /* =========================================================
 | DATATABLE COSTOS
 | =========================================================*/
  // function inicializarDataTableCostos(id) {
  //   const $tabla = $(id);

  //   if ($.fn.DataTable.isDataTable(id)) $tabla.DataTable().destroy();
  //   $tabla.find('thead tr.filters').remove();

  //   const $filterRow = $tabla.find('thead tr:first').clone(true).addClass('filters');
  //   $filterRow.appendTo($tabla.find('thead'));

  //   $tabla.DataTable({
  //     orderCellsTop: true,
  //     fixedHeader: true,
  //     destroy: true,
  //     language: { url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
  //     initComplete: function () {
  //       const api = this.api();
  //       api.columns().eq(0).each(function (colIdx) {
  //         const cell = $tabla.find('.filters th').get(colIdx);
  //         if (!cell) return;
  //         if (colIdx === 0) { $(cell).html(''); return; }
  //         const title = $(api.column(colIdx).header()).text();
  //         $(cell).html(`<input type="text" class=" form-control form-control-sm w-100" placeholder="${title}" style="font-size:11px;height:24px;">`);
  //         $('input', cell).on('keyup change', function (e) {
  //           e.stopPropagation();
  //           if (api.column(colIdx).search() !== this.value) {
  //             api.column(colIdx).search(this.value).draw();
  //           }
  //         });
  //       });
  //     }
  //   });
  // }

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
        const totalColumnas = api.columns().count();

        api.columns().eq(0).each(function (colIdx) {

          const cell = $tabla.find('.filters th').get(colIdx);
          if (!cell) return;

          // ❌ Omitir primera y última columna
          if (colIdx === 0 || colIdx === totalColumnas - 1) {
            $(cell).html('');
            return;
          }

          const title = $(api.column(colIdx).header()).text();

          $(cell).html(`
          <input type="text"
                 class="form-control form-control-sm w-100"
                 placeholder="${title}"
                 style="font-size:11px;height:24px;">
        `);

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

  function scFixText(str) {
    if (!str) return '—';
    try {
      // Esto convierte "Granel SÃ³lido" en "Granel Sólido" automáticamente
      return decodeURIComponent(escape(str));
    } catch (e) {
      return str;
    }
  }

  /* ============================================================
     ESTADÍSTICAS RÁPIDAS
     ============================================================ */
  function scActualizarStats(data) {
    const n = data.length;
    const elTotal = document.getElementById('cnt-total');
    const elMenor = document.getElementById('cnt-menor');
    const elMayor = document.getElementById('cnt-mayor');
    const elKm = document.getElementById('cnt-km');
    const elBadge = document.getElementById('ap-badge-count');

    if (elBadge) elBadge.textContent = n;
    if (elTotal) elTotal.textContent = n || '—';

    if (!n) {
      if (elMenor) elMenor.textContent = '—';
      if (elMayor) elMayor.textContent = '—';
      if (elKm) elKm.textContent = '—';
      return;
    }

    const vals = data.map(t => t.valor);
    const kms = data.map(t => t.distancia);
    if (elMenor) elMenor.textContent = scFmtCOP(Math.min(...vals));
    if (elMayor) elMayor.textContent = scFmtCOP(Math.max(...vals));
    if (elKm) elKm.textContent = scFmtNum(Math.max(...kms)) + ' km';
  }

  /* ============================================================
     FILTRO LOCAL
     ============================================================ */
  function scFiltrarTabla(texto) {
    const filas = document.querySelectorAll('#sc-tbody tr[data-idx]');
    const t = texto.toLowerCase().trim();
    filas.forEach(tr => {
      tr.style.display = (!t || tr.innerText.toLowerCase().includes(t)) ? '' : 'none';
    });
  }

  function scLimpiarFiltros() {
    ['f-origen', 'f-destino', 'f-periodo'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const cfgEl = document.getElementById('f-config');
    const condEl = document.getElementById('f-condicion');
    if (cfgEl) cfgEl.value = '3S3';
    if (condEl) condEl.value = '1';

    scSetModo('exacta', document.querySelector('.modo-tab[data-modo="exacta"]'));
    SC_STATE.data = []; SC_STATE.periodoActivo = '';
    scActualizarStats([]);
    scToggleExportBtn(false);

    const lblInfo = document.getElementById('lbl-info-activo');
    const lblPeriodo = document.getElementById('lbl-periodo-activo');
    if (lblInfo) lblInfo.textContent = '';
    if (lblPeriodo) lblPeriodo.innerHTML = '<i class="fas fa-calendar-alt"></i> —';

    const tbody = document.getElementById('sc-tbody');
    if (tbody) tbody.innerHTML = `
    <tr><td colspan="12">
      <div class="ap-empty">
        <div class="ap-empty-icon"><i class="fas fa-search"></i></div>
        <div class="ap-empty-title">Ingresa origen y destino</div>
        <div class="ap-empty-sub">Completa los filtros y presiona Consultar</div>
      </div>
    </td></tr>`;
  }

  /* ============================================================
     EXPORTAR A EXCEL
     Genera un .xls real con formato SpreadsheetML (nativo,
     sin librerías externas). Abre directamente en Excel/LibreOffice.
     Incluye:
       · Hoja principal con todos los datos, estilos y fila resumen
       · Hoja de parámetros con los metadatos de la consulta
       · Fila de encabezados con fondo navy y letra blanca
       · Filas con color según min (verde) / max (rojo)
       · Columnas de moneda con formato $ #,##0
       · Panel superior fijo (freeze 3 filas)
     ============================================================ */
  // function scExportarExcel() {
  //   const data = SC_STATE.data;
  //   if (!data || data.length === 0) {
  //     return scFlash('info', 'Sin datos', 'Primero realiza una consulta para exportar resultados.');
  //   }

  //   const origen = document.getElementById('f-origen')?.value || '—';
  //   const destino = document.getElementById('f-destino')?.value || '—';
  //   const periodo = SC_STATE.periodoActivo || document.getElementById('f-periodo')?.value || '—';
  //   const condicion = document.getElementById('f-condicion')?.value === '1' ? 'Cargado' : 'Vacío';
  //   const modo = { exacta: 'Exacta', ruta: 'Por Ruta', multiconfig: 'Multi-Config' }[SC_STATE.modo] || SC_STATE.modo;
  //   const fechaExp = new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
  //   const minVal = Math.min(...data.map(t => t.valor));
  //   const maxVal = Math.max(...data.map(t => t.valor));
  //   const avgVal = data.reduce((a, t) => a + (Number(t.valor) || 0), 0) / data.length;

  //   // ── Helpers ────────────────────────────────────────────────
  //   const esc = s => String(s ?? '')
  //     .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  //     .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  //   const C = (val, type, sid) =>
  //     `<Cell${sid ? ` ss:StyleID="${sid}"` : ''}><Data ss:Type="${type}">${esc(val)}</Data></Cell>`;

  //   const N = v => (v === null || v === undefined) ? 0 : Number(v);

  //   // ── Estilos ─────────────────────────────────────────────────
  //   const styles = `<Styles>
  //   <Style ss:ID="s_title">
  //     <Font ss:Bold="1" ss:Size="13" ss:Color="#0F1F3D"/>
  //   </Style>
  //   <Style ss:ID="s_meta_k">
  //     <Font ss:Bold="1" ss:Size="10" ss:Color="#1A3C6B"/>
  //     <Interior ss:Color="#F0F4F8" ss:Pattern="Solid"/>
  //   </Style>
  //   <Style ss:ID="s_meta_v">
  //     <Font ss:Size="10" ss:Color="#0F1F3D"/>
  //   </Style>
  //   <Style ss:ID="s_th">
  //     <Font ss:Bold="1" ss:Size="10" ss:Color="#FFFFFF"/>
  //     <Interior ss:Color="#0F1F3D" ss:Pattern="Solid"/>
  //     <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
  //     <Borders>
  //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#E8A020"/>
  //       <Border ss:Position="Right"  ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#1A3C6B"/>
  //     </Borders>
  //   </Style>
  //   <Style ss:ID="s_row">
  //     <Font ss:Size="10" ss:Color="#0F1F3D"/>
  //     <Alignment ss:Vertical="Center"/>
  //     <Borders>
  //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDE3EF"/>
  //     </Borders>
  //   </Style>
  //   <Style ss:ID="s_row_c">
  //     <Font ss:Size="10" ss:Color="#0F1F3D"/>
  //     <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  //     <Borders>
  //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDE3EF"/>
  //     </Borders>
  //   </Style>
  //   <Style ss:ID="s_money">
  //     <Font ss:Size="10" ss:Color="#0F1F3D"/>
  //     <NumberFormat ss:Format="&quot;$&quot; #,##0"/>
  //     <Alignment ss:Horizontal="Right"/>
  //     <Borders>
  //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDE3EF"/>
  //     </Borders>
  //   </Style>
  //   <Style ss:ID="s_min">
  //     <Font ss:Bold="1" ss:Size="10" ss:Color="#166534"/>
  //     <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
  //     <Alignment ss:Vertical="Center"/>
  //     <Borders>
  //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/>
  //     </Borders>
  //   </Style>
  //   <Style ss:ID="s_min_c">
  //     <Font ss:Bold="1" ss:Size="10" ss:Color="#166534"/>
  //     <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
  //     <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  //     <Borders>
  //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/>
  //     </Borders>
  //   </Style>
  //   <Style ss:ID="s_min_m">
  //     <Font ss:Bold="1" ss:Size="10" ss:Color="#166534"/>
  //     <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
  //     <NumberFormat ss:Format="&quot;$&quot; #,##0"/>
  //     <Alignment ss:Horizontal="Right"/>
  //     <Borders>
  //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/>
  //     </Borders>
  //   </Style>
  //   <Style ss:ID="s_max">
  //     <Font ss:Size="10" ss:Color="#991B1B"/>
  //     <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
  //     <Alignment ss:Vertical="Center"/>
  //     <Borders>
  //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/>
  //     </Borders>
  //   </Style>
  //   <Style ss:ID="s_max_c">
  //     <Font ss:Size="10" ss:Color="#991B1B"/>
  //     <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
  //     <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  //     <Borders>
  //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/>
  //     </Borders>
  //   </Style>
  //   <Style ss:ID="s_max_m">
  //     <Font ss:Size="10" ss:Color="#991B1B"/>
  //     <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
  //     <NumberFormat ss:Format="&quot;$&quot; #,##0"/>
  //     <Alignment ss:Horizontal="Right"/>
  //     <Borders>
  //       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/>
  //     </Borders>
  //   </Style>
  //   <Style ss:ID="s_foot">
  //     <Font ss:Bold="1" ss:Size="10" ss:Color="#1A3C6B"/>
  //     <Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/>
  //     <Borders>
  //       <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#1A3C6B"/>
  //     </Borders>
  //   </Style>
  //   <Style ss:ID="s_foot_m">
  //     <Font ss:Bold="1" ss:Size="10" ss:Color="#1A3C6B"/>
  //     <Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/>
  //     <NumberFormat ss:Format="&quot;$&quot; #,##0"/>
  //     <Alignment ss:Horizontal="Right"/>
  //     <Borders>
  //       <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#1A3C6B"/>
  //     </Borders>
  //   </Style>
  //   </Styles>`;

  //   // ── Filas de datos ───────────────────────────────────────────
  //   const dataRows = data.map((t, i) => {
  //     const esMin = t.valor === minVal && data.length > 1;
  //     const esMax = t.valor === maxVal && data.length > 1;
  //     const sN = esMin ? 's_min' : (esMax ? 's_max' : 's_row');
  //     const sC = esMin ? 's_min_c' : (esMax ? 's_max_c' : 's_row_c');
  //     const sM = esMin ? 's_min_m' : (esMax ? 's_max_m' : 's_money');
  //     const cond = (t.condicionCargaId === '1' || t.condicionCargaId === 1) ? 'Cargado' : 'Vacío';
  //     const nota = esMin ? '★ Más económico' : (esMax ? '▲ Más costoso' : '');
  //     return `<Row ss:Height="22">
  //       ${C(i + 1, 'Number', sC)}
  //       ${C(t.configuracionesid, 'String', sC)}
  //       ${C(t.nombreRuta || '—', 'String', sN)}
  //       ${C(t.origen, 'String', sC)}
  //       ${C(t.destino, 'String', sC)}
  //       ${C(cond, 'String', sC)}
  //       ${C(N(t.distancia), 'Number', sC)}
  //       ${C(N(t.valor), 'Number', sM)}
  //       ${C(N(t.valorTonelada), 'Number', sM)}
  //       ${C(N(t.valorHora), 'Number', sM)}
  //       ${C(t.periodo || '—', 'String', sC)}
  //       ${C(nota, 'String', sN)}
  //     </Row>`;
  //   }).join('\n');

  //   // ── Encabezados de columna ────────────────────────────────────
  //   const cols = ['#', 'Config.', 'Nombre Ruta', 'Origen', 'Destino', 'Condición',
  //     'Dist. km', 'Valor Movilización', 'Val. Tonelada', 'Val. Hora', 'Período', 'Nota'];
  //   const theadRow = `<Row ss:Height="30">${cols.map(h => C(h, 'String', 's_th')).join('')}</Row>`;

  //   // ── Fila resumen ──────────────────────────────────────────────
  //   const footerRow = `<Row ss:Height="26">
  //     ${C('', 'String', 's_foot')}
  //     ${C('', 'String', 's_foot')}
  //     ${C(`RESUMEN — ${data.length} tarifa(s)`, 'String', 's_foot')}
  //     ${C('', 'String', 's_foot')}
  //     ${C('', 'String', 's_foot')}
  //     ${C('', 'String', 's_foot')}
  //     ${C('', 'String', 's_foot')}
  //     ${C(N(minVal), 'Number', 's_foot_m')}
  //     ${C(N(avgVal), 'Number', 's_foot_m')}
  //     ${C(N(maxVal), 'Number', 's_foot_m')}
  //     ${C('', 'String', 's_foot')}
  //     ${C('Mín · Prom · Máx', 'String', 's_foot')}
  //   </Row>`;

  //   // ── Hoja de parámetros ────────────────────────────────────────
  //   const paramSheet = `<Worksheet ss:Name="Parámetros">
  //   <Table>
  //     <Column ss:Width="170"/><Column ss:Width="260"/>
  //     <Row ss:Height="30"><Cell ss:StyleID="s_title" ss:MergeAcross="1"><Data ss:Type="String">Consulta SiceTac — HARMONY 2026</Data></Cell></Row>
  //     <Row ss:Height="6"/>
  //     ${[
  //       ['Fecha exportación', fechaExp],
  //       ['Origen DIVIPOLA', origen],
  //       ['Destino DIVIPOLA', destino],
  //       ['Período consultado', periodo],
  //       ['Condición de carga', condicion],
  //       ['Modo de consulta', modo],
  //       ['Total tarifas', String(data.length)],
  //       ['Valor mínimo', scFmtCOP(minVal)],
  //       ['Valor promedio', scFmtCOP(avgVal)],
  //       ['Valor máximo', scFmtCOP(maxVal)],
  //       ['Usuario', SC_STATE.usuario || '—'],
  //     ].map(([k, v]) => `<Row ss:Height="20">${C(k, 'String', 's_meta_k')}${C(v, 'String', 's_meta_v')}</Row>`).join('\n')}
  //   </Table>
  //   </Worksheet>`;

  //   // ── Hoja principal ────────────────────────────────────────────
  //   const mainSheet = `<Worksheet ss:Name="Tarifas SiceTac">
  //   <Table>
  //     <Column ss:Width="32"/>
  //     <Column ss:Width="62"/>
  //     <Column ss:Width="210"/>
  //     <Column ss:Width="82"/>
  //     <Column ss:Width="82"/>
  //     <Column ss:Width="72"/>
  //     <Column ss:Width="68"/>
  //     <Column ss:Width="130"/>
  //     <Column ss:Width="115"/>
  //     <Column ss:Width="105"/>
  //     <Column ss:Width="72"/>
  //     <Column ss:Width="120"/>

  //     <Row ss:Height="32">
  //       <Cell ss:StyleID="s_title" ss:MergeAcross="11">
  //         <Data ss:Type="String">Tarifas SiceTac · ${esc(origen)} → ${esc(destino)} · Período ${esc(periodo)} · ${esc(condicion)}</Data>
  //       </Cell>
  //     </Row>
  //     <Row ss:Height="4"/>
  //     ${theadRow}
  //     ${dataRows}
  //     <Row ss:Height="4"/>
  //     ${footerRow}
  //   </Table>
  //   <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
  //     <FreezePanes/>
  //     <FrozenNoSplit/>
  //     <SplitHorizontal>3</SplitHorizontal>
  //     <TopRowBottomPane>3</TopRowBottomPane>
  //     <ActivePane>2</ActivePane>
  //     <Panes>
  //       <Pane><Number>3</Number></Pane>
  //       <Pane><Number>2</Number><ActiveRow>3</ActiveRow></Pane>
  //     </Panes>
  //   </WorksheetOptions>
  //   </Worksheet>`;

  //   // ── Armar libro completo ──────────────────────────────────────
  //   const wb = `<?xml version="1.0" encoding="UTF-8"?>
  // <?mso-application progid="Excel.Sheet"?>
  // <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  //           xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  //           xmlns:x="urn:schemas-microsoft-com:office:excel">
  //   <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  //     <Title>Tarifas SiceTac</Title>
  //     <Author>HARMONY 2026</Author>
  //     <Created>${new Date().toISOString()}</Created>
  //   </DocumentProperties>
  //   ${styles}
  //   ${mainSheet}
  //   ${paramSheet}
  // </Workbook>`;

  //   // ── Disparar descarga ─────────────────────────────────────────
  //   const blob = new Blob([wb], { type: 'application/vnd.ms-excel;charset=utf-8' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   const nombre = `SiceTac_${origen}_${destino}_${periodo || 'periodo'}_${Date.now()}.xls`;
  //   a.href = url;
  //   a.download = nombre;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);

  //   scFlash('success', 'Excel generado', `"${nombre}" descargado con ${data.length} tarifa(s).`);
  // }

  /* ============================================================
     EXPORTAR A EXCEL
     Genera un .xls real con formato SpreadsheetML (nativo,
     sin librerías externas). Abre directamente en Excel/LibreOffice.
     Incluye:
       · Hoja principal con todos los datos, estilos y fila resumen
       · Hoja de parámetros con los metadatos de la consulta
       · Fila de encabezados con fondo navy y letra blanca
       · Filas con color según min (verde) / max (rojo)
       · Columnas de moneda con formato $ #,##0
       · Panel superior fijo (freeze 3 filas)
     ============================================================ */
  function scExportarExcel() {
    const data = SC_STATE.data;
    if (!data || data.length === 0) {
      return scFlash('info', 'Sin datos', 'Primero realiza una consulta para exportar resultados.');
    }

    const origen = document.getElementById('f-origen')?.value || '—';
    const destino = document.getElementById('f-destino')?.value || '—';
    const periodo = SC_STATE.periodoActivo || document.getElementById('f-periodo')?.value || '—';
    const condicion = document.getElementById('f-condicion')?.value === '1' ? 'Cargado' : 'Vacío';
    const modo = { exacta: 'Exacta', ruta: 'Por Ruta', multiconfig: 'Multi-Config' }[SC_STATE.modo] || SC_STATE.modo;
    const fechaExp = new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
    const minVal = Math.min(...data.map(t => t.valor));
    const maxVal = Math.max(...data.map(t => t.valor));
    const avgVal = data.reduce((a, t) => a + (Number(t.valor) || 0), 0) / data.length;

    // ── Helpers ────────────────────────────────────────────────
    const esc = s => String(s ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    const C = (val, type, sid) =>
      `<Cell${sid ? ` ss:StyleID="${sid}"` : ''}><Data ss:Type="${type}">${esc(val)}</Data></Cell>`;

    const N = v => (v === null || v === undefined) ? 0 : Number(v);

    // ── Estilos ─────────────────────────────────────────────────
    const styles = `<Styles>
  <Style ss:ID="s_title">
    <Font ss:Bold="1" ss:Size="13" ss:Color="#0F1F3D"/>
  </Style>
  <Style ss:ID="s_meta_k">
    <Font ss:Bold="1" ss:Size="10" ss:Color="#1A3C6B"/>
    <Interior ss:Color="#F0F4F8" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="s_meta_v">
    <Font ss:Size="10" ss:Color="#0F1F3D"/>
  </Style>
  <Style ss:ID="s_th">
    <Font ss:Bold="1" ss:Size="10" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#0F1F3D" ss:Pattern="Solid"/>
    <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#E8A020"/>
      <Border ss:Position="Right"  ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#1A3C6B"/>
    </Borders>
  </Style>
  <Style ss:ID="s_row">
    <Font ss:Size="10" ss:Color="#0F1F3D"/>
    <Alignment ss:Vertical="Center"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDE3EF"/>
    </Borders>
  </Style>
  <Style ss:ID="s_row_c">
    <Font ss:Size="10" ss:Color="#0F1F3D"/>
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDE3EF"/>
    </Borders>
  </Style>
  <Style ss:ID="s_money">
    <Font ss:Size="10" ss:Color="#0F1F3D"/>
    <NumberFormat ss:Format="&quot;$&quot; #,##0"/>
    <Alignment ss:Horizontal="Right"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDE3EF"/>
    </Borders>
  </Style>
  <Style ss:ID="s_min">
    <Font ss:Bold="1" ss:Size="10" ss:Color="#166534"/>
    <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
    <Alignment ss:Vertical="Center"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/>
    </Borders>
  </Style>
  <Style ss:ID="s_min_c">
    <Font ss:Bold="1" ss:Size="10" ss:Color="#166534"/>
    <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/>
    </Borders>
  </Style>
  <Style ss:ID="s_min_m">
    <Font ss:Bold="1" ss:Size="10" ss:Color="#166534"/>
    <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
    <NumberFormat ss:Format="&quot;$&quot; #,##0"/>
    <Alignment ss:Horizontal="Right"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/>
    </Borders>
  </Style>
  <Style ss:ID="s_max">
    <Font ss:Size="10" ss:Color="#991B1B"/>
    <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
    <Alignment ss:Vertical="Center"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/>
    </Borders>
  </Style>
  <Style ss:ID="s_max_c">
    <Font ss:Size="10" ss:Color="#991B1B"/>
    <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
    <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/>
    </Borders>
  </Style>
  <Style ss:ID="s_max_m">
    <Font ss:Size="10" ss:Color="#991B1B"/>
    <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
    <NumberFormat ss:Format="&quot;$&quot; #,##0"/>
    <Alignment ss:Horizontal="Right"/>
    <Borders>
      <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/>
    </Borders>
  </Style>
  <Style ss:ID="s_foot">
    <Font ss:Bold="1" ss:Size="10" ss:Color="#1A3C6B"/>
    <Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/>
    <Borders>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#1A3C6B"/>
    </Borders>
  </Style>
  <Style ss:ID="s_foot_m">
    <Font ss:Bold="1" ss:Size="10" ss:Color="#1A3C6B"/>
    <Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/>
    <NumberFormat ss:Format="&quot;$&quot; #,##0"/>
    <Alignment ss:Horizontal="Right"/>
    <Borders>
      <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#1A3C6B"/>
    </Borders>
  </Style>
  </Styles>`;

    // ── Filas de datos ───────────────────────────────────────────
    // Columnas activas — idénticas al <thead> de la tabla PHTML:
    // # | Config. | Via | Origen | Destino | Condición | Unidad Transporte |
    // Tipo Carga | Dist. km | Valor Movilización | Val. Hora | Tiemp. Hora | Período
    const dataRows = data.map((t, i) => {
      const esMin = t.valor === minVal && data.length > 1;
      const esMax = t.valor === maxVal && data.length > 1;
      const sN = esMin ? 's_min' : (esMax ? 's_max' : 's_row');
      const sC = esMin ? 's_min_c' : (esMax ? 's_max_c' : 's_row_c');
      const sM = esMin ? 's_min_m' : (esMax ? 's_max_m' : 's_money');
      const cond = (t.condicioncarga === 'CARGADO' || t.condicioncarga === 1) ? 'Cargado' : 'Vacío';
      const origenCell = [t.nomorigen, t.origen].filter(Boolean).join(' / ');
      const destinoCell = [t.nomdestino, t.destino].filter(Boolean).join(' / ');
      return `<Row ss:Height="22">
      ${C(i + 1, 'Number', sC)}
      ${C(t.configuracion || '—', 'String', sC)}
      ${C(t.via || '—', 'String', sN)}
      ${C(origenCell || '—', 'String', sC)}
      ${C(destinoCell || '—', 'String', sC)}
      ${C(cond, 'String', sC)}
      ${C(t.nombreunidadtransporte || '—', 'String', sN)}
      ${C(scFixText(t.nombretipocarga) || '—', 'String', sN)}
      ${C(N(t.kilometros), 'Number', sC)}
      ${C(N(t.valor), 'Number', sM)}
      ${C(N(t.valorHora), 'Number', sM)}
      ${C(String(t.horasrecorrido ?? '—'), 'String', sC)}
      ${C(t.periodo || '—', 'String', sC)}
    </Row>`;
    }).join('\n');

    // ── Encabezados (mismo orden que el <thead> del PHTML) ────────
    const cols = [
      '#', 'Config.', 'Via', 'Origen', 'Destino', 'Condición',
      'Unidad Transporte', 'Tipo Carga', 'Dist. km',
      'Valor Movilización', 'Val. Hora', 'Tiemp. Hora', 'Período',
    ];
    const theadRow = `<Row ss:Height="30">${cols.map(h => C(h, 'String', 's_th')).join('')}</Row>`;

    // ── Fila resumen (13 columnas — resumen en cols 10-12) ─────────
    const footerRow = `<Row ss:Height="26">
    ${C('', 'String', 's_foot')}
    ${C('', 'String', 's_foot')}
    ${C(`RESUMEN — ${data.length} tarifa(s)`, 'String', 's_foot')}
    ${C('', 'String', 's_foot')}
    ${C('', 'String', 's_foot')}
    ${C('', 'String', 's_foot')}
    ${C('', 'String', 's_foot')}
    ${C('', 'String', 's_foot')}
    ${C('', 'String', 's_foot')}
    ${C(N(minVal), 'Number', 's_foot_m')}
    ${C(N(avgVal), 'Number', 's_foot_m')}
    ${C(N(maxVal), 'Number', 's_foot_m')}
    ${C('Mín · Prom · Máx', 'String', 's_foot')}
  </Row>`;

    // ── Hoja de parámetros ────────────────────────────────────────
    const paramSheet = `<Worksheet ss:Name="Parámetros">
  <Table>
    <Column ss:Width="170"/><Column ss:Width="260"/>
    <Row ss:Height="30"><Cell ss:StyleID="s_title" ss:MergeAcross="1"><Data ss:Type="String">Consulta SiceTac — HARMONY 2026</Data></Cell></Row>
    <Row ss:Height="6"/>
    ${[
        ['Fecha exportación', fechaExp],
        ['Origen DIVIPOLA', origen],
        ['Destino DIVIPOLA', destino],
        ['Período consultado', periodo],
        ['Condición de carga', condicion],
        ['Modo de consulta', modo],
        ['Total tarifas', String(data.length)],
        ['Valor mínimo', scFmtCOP(minVal)],
        ['Valor promedio', scFmtCOP(avgVal)],
        ['Valor máximo', scFmtCOP(maxVal)],
        ['Usuario', SC_STATE.usuario || '—'],
      ].map(([k, v]) => `<Row ss:Height="20">${C(k, 'String', 's_meta_k')}${C(v, 'String', 's_meta_v')}</Row>`).join('\n')}
  </Table>
  </Worksheet>`;

    // ── Hoja principal ────────────────────────────────────────────
    const mainSheet = `<Worksheet ss:Name="Tarifas SiceTac">
  <Table>
    <Column ss:Width="32"/>   <!-- # -->
    <Column ss:Width="58"/>   <!-- Config. -->
    <Column ss:Width="190"/>  <!-- Via -->
    <Column ss:Width="160"/>  <!-- Origen (nombre + divipola) -->
    <Column ss:Width="160"/>  <!-- Destino (nombre + divipola) -->
    <Column ss:Width="72"/>   <!-- Condición -->
    <Column ss:Width="140"/>  <!-- Unidad Transporte -->
    <Column ss:Width="130"/>  <!-- Tipo Carga -->
    <Column ss:Width="65"/>   <!-- Dist. km -->
    <Column ss:Width="125"/>  <!-- Valor Movilización -->
    <Column ss:Width="100"/>  <!-- Val. Hora -->
    <Column ss:Width="80"/>   <!-- Tiemp. Hora -->
    <Column ss:Width="70"/>   <!-- Período -->

    <Row ss:Height="32">
      <Cell ss:StyleID="s_title" ss:MergeAcross="12">
        <Data ss:Type="String">Tarifas SiceTac · ${esc(origen)} → ${esc(destino)} · Período ${esc(periodo)} · ${esc(condicion)}</Data>
      </Cell>
    </Row>
    <Row ss:Height="4"/>
    ${theadRow}
    ${dataRows}
    <Row ss:Height="4"/>
    ${footerRow}
  </Table>
  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
    <FreezePanes/>
    <FrozenNoSplit/>
    <SplitHorizontal>3</SplitHorizontal>
    <TopRowBottomPane>3</TopRowBottomPane>
    <ActivePane>2</ActivePane>
    <Panes>
      <Pane><Number>3</Number></Pane>
      <Pane><Number>2</Number><ActiveRow>3</ActiveRow></Pane>
    </Panes>
  </WorksheetOptions>
  </Worksheet>`;

    // ── Armar libro completo ──────────────────────────────────────
    const wb = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:x="urn:schemas-microsoft-com:office:excel">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Title>Tarifas SiceTac</Title>
    <Author>HARMONY 2026</Author>
    <Created>${new Date().toISOString()}</Created>
  </DocumentProperties>
  ${styles}
  ${mainSheet}
  ${paramSheet}
</Workbook>`;

    // ── Disparar descarga ─────────────────────────────────────────
    const blob = new Blob([wb], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const nombre = `SiceTac_${origen}_${destino}_${periodo || 'periodo'}_${Date.now()}.xls`;
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    scFlash('success', 'Excel generado', `"${nombre}" descargado con ${data.length} tarifa(s).`);
  }

  /* ============================================================
     TOGGLE BOTÓN EXPORTAR
     ============================================================ */
  function scToggleExportBtn(visible) {
    const btn = document.getElementById('btn-exportar-excel');
    if (btn) btn.style.display = visible ? '' : 'none';
  }

  /* ============================================================
     ABRIR / CERRAR OFFCANVAS
     ============================================================ */
  function scAbrirDetalle(idx) {
    const tarifa = SC_STATE.data[idx];
    if (!tarifa) return;
    SC_STATE.tarifaActual = tarifa;

    const elTitle = document.getElementById('oc-title');
    const elSub = document.getElementById('oc-sub');
    if (elTitle) elTitle.textContent = `${tarifa.configuracionesid} — ${tarifa.nombreRuta || 'Detalle SiceTac'}`;
    if (elSub) elSub.textContent = `Período ${tarifa.periodo} · ${tarifa.origen} → ${tarifa.destino}`;

    scRenderInfoGrid(tarifa);
    scRenderCalculo(tarifa);

    const vPactado = document.getElementById('sc-v-pactado');
    if (vPactado) vPactado.value = '';
    scRenderValidacion();

    document.getElementById('ap-offcanvas').classList.add('show');
    document.getElementById('ap-backdrop').classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function scCerrarDetalle() {
    document.getElementById('ap-offcanvas').classList.remove('show');
    document.getElementById('ap-backdrop').classList.remove('show');
    document.body.style.overflow = '';
    SC_STATE.tarifaActual = null;
  }

  /* ============================================================
     RENDER INFO GENERAL (offcanvas)
     ============================================================ */
  function scRenderInfoGrid(tarifa) {
    const grid = document.getElementById('sc-info-grid');
    if (!grid) return;
    const items = [
      { label: 'Configuración', value: `<strong style="color:var(--ap-blue);font-size:1rem;">${tarifa.configuracionesid}</strong>` },
      { label: 'Nombre Ruta', value: tarifa.nombreRuta || '—' },
      { label: 'Período', value: tarifa.periodo || '—' },
      { label: 'Fecha Ingreso', value: tarifa.fechaIngreso || '—' },
      { label: 'Origen DIVIPOLA', value: `<span style="font-family:monospace;">${tarifa.origen}</span>` },
      { label: 'Destino DIVIPOLA', value: `<span style="font-family:monospace;">${tarifa.destino}</span>` },
      { label: 'Distancia', value: scFmtNum(tarifa.distancia) + ' km' },
      { label: 'Condición Carga', value: tarifa.condicionCargaId == 1 ? '🟢 Cargado' : '🟡 Vacío' },
    ];
    grid.innerHTML = items.map(i => `
    <div class="ap-info-item">
      <div class="ap-info-label">${i.label}</div>
      <div class="ap-info-value">${i.value}</div>
    </div>`).join('');
  }

  /* ============================================================
     CALCULADORA VALOR MÍNIMO
     ============================================================ */
  function scRenderCalculo(tarifa) {
    const tbody = document.getElementById('sc-calc-tbody');
    if (!tbody) return;

    const hC = parseFloat(document.getElementById('sc-h-cargue')?.value) || 0;
    const hD = parseFloat(document.getElementById('sc-h-descargue')?.value) || 0;
    const tot = hC + hD;

    const elTotal = document.getElementById('sc-h-total');
    if (elTotal) elTotal.value = tot;

    const movil = tarifa.valor;
    const tiempos = tarifa.valorHora * tot;
    const minimo = movil + tiempos;

    const elRes = document.getElementById('sc-result-valor');
    if (elRes) elRes.textContent = scFmtCOP(minimo);

    tbody.innerHTML = `
    <tr>
      <td>Valor movilización</td>
      <td style="text-align:right;font-weight:700;">${scFmtCOP(movil)}</td>
      <td style="color:var(--ap-gray);font-size:0.78rem;">Base SiceTac para esta ruta y configuración</td>
    </tr>
    <tr>
      <td>Costo tiempo logístico</td>
      <td style="text-align:right;font-weight:700;">${scFmtCOP(tiempos)}</td>
      <td style="color:var(--ap-gray);font-size:0.78rem;">
        ${scFmtCOP(tarifa.valorHora)} × ${tot} h (${hC}h cargue + ${hD}h descargue)
      </td>
    </tr>
    <tr class="row-total">
      <td><strong>Valor mínimo a pagar</strong></td>
      <td style="text-align:right;font-size:1.05rem;">${scFmtCOP(minimo)}</td>
      <td style="font-size:0.78rem;">Todo valor pactado inferior activa <strong>ALERTA001</strong> en el RNDC</td>
    </tr>`;

    scRenderValidacion();
  }

  function scRecalcular() {
    if (!SC_STATE.tarifaActual) return;
    scRenderCalculo(SC_STATE.tarifaActual);
  }

  /* ============================================================
     VALIDAR VALOR PACTADO
     ============================================================ */
  function scRenderValidacion() {
    const tarifa = SC_STATE.tarifaActual;
    const resEl = document.getElementById('sc-val-result');
    if (!resEl || !tarifa) return;

    const vPactado = parseFloat(document.getElementById('sc-v-pactado')?.value) || 0;
    const hC = parseFloat(document.getElementById('sc-v-hc')?.value) || 0;
    const hD = parseFloat(document.getElementById('sc-v-hd')?.value) || 0;

    if (!vPactado) {
      resEl.innerHTML = `
      <div class="ap-validacion ok" style="opacity:0.45;">
        <div class="ap-val-icon"><i class="fas fa-info-circle"></i></div>
        <div>
          <div class="ap-val-title">Ingresa el valor pactado para validar</div>
          <div class="ap-val-sub">El sistema comparará contra el mínimo SiceTac calculado</div>
        </div>
      </div>`;
      return;
    }

    const tiempos = tarifa.valorHora * (hC + hD);
    const minimo = tarifa.valor + tiempos;
    const cumple = vPactado >= minimo;
    const dif = vPactado - minimo;

    resEl.innerHTML = `
    <div class="ap-validacion ${cumple ? 'ok' : 'warn'}">
      <div class="ap-val-icon">
        <i class="fas fa-${cumple ? 'check-circle' : 'exclamation-triangle'}"></i>
      </div>
      <div>
        <div class="ap-val-title">
          ${cumple ? '✅ El valor pactado cumple el mínimo SiceTac' : '⚠️ ALERTA001 — Valor inferior al mínimo SiceTac'}
        </div>
        <div class="ap-val-sub" style="margin-top:6px;">
          Valor pactado: <strong>${scFmtCOP(vPactado)}</strong> ·
          Mínimo SiceTac: <strong>${scFmtCOP(minimo)}</strong> ·
          Diferencia: <strong style="color:${cumple ? '#16a34a' : '#dc2626'};">
            ${cumple ? '+' : ''}${scFmtCOP(dif)}
          </strong>
        </div>
      </div>
    </div>`;
  }

  /* ============================================================
     HELPERS DE TABLA
     ============================================================ */
  function scTableLoading() {
    const tbody = document.getElementById('sc-tbody');
    if (!tbody) return;
    tbody.innerHTML = `
    <tr><td colspan="12">
      <div style="padding:40px;text-align:center;color:var(--ap-gray);">
        <i class="fas fa-spinner fa-spin" style="font-size:1.5rem;margin-bottom:10px;"></i>
        <br>Consultando tarifas SiceTac...
      </div>
    </td></tr>`;
  }

  function scTableError(msg) {
    const tbody = document.getElementById('sc-tbody');
    if (!tbody) return;
    tbody.innerHTML = `
    <tr><td colspan="12">
      <div class="ap-empty">
        <div class="ap-empty-icon"><i class="fas fa-exclamation-triangle"></i></div>
        <div class="ap-empty-title">Error al consultar</div>
        <div class="ap-empty-sub">${msg || 'Intenta nuevamente'}</div>
      </div>
    </td></tr>`;
  }

  function scBtnLoading(id, loading) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
      btn.dataset.origHtml = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Consultando...';
    } else {
      btn.innerHTML = btn.dataset.origHtml || btn.innerHTML;
    }
  }

  /* ============================================================
     FORMATTERS
     ============================================================ */
  function scFmtCOP(valor) {
    if (valor === null || valor === undefined || (valor !== 0 && !valor)) return '—';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP',
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(valor);
  }

  function scFmtNum(valor) {
    if (!valor && valor !== 0) return '—';
    return new Intl.NumberFormat('es-CO').format(valor);
  }

  /* ============================================================
     FLASH NOTIFICATIONS
     ============================================================ */
  let _scFlashTimer = null;

  function scFlash(type, title, msg) {
    const el = document.getElementById('ap-flash');
    if (!el) return;
    el.className = `ap-flash ${type}`;
    document.getElementById('ap-flash-title').textContent = title;
    document.getElementById('ap-flash-msg').textContent = msg;
    const iconMap = { success: 'fas fa-check-circle', error: 'fas fa-times-circle', info: 'fas fa-info-circle' };
    // const iconEl = document.getElementById('ap-flash-icon');
    // if (iconEl) iconEl.className = (iconMap[type] || 'fas fa-info-circle') + ' ';
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(_scFlashTimer);
    _scFlashTimer = setTimeout(scFlashHide, 4500);
  }

  function scFlashHide() {
    const el = document.getElementById('ap-flash');
    if (el) el.classList.remove('show');
  }

  /* ============================================================
     API FETCH HELPER
     · Acepta headers externos (SC_HEADERS_SICETAC) como parámetro
     · Los fusiona sobre los headers base — externos tienen prioridad
     · Construye query string automáticamente para GET
     ============================================================ */
  async function scApiFetch(url, { method = 'GET', params = null, data = null, headers = {} } = {}) {

    // Construir query string para peticiones GET
    if (params && method === 'GET') {
      const qs = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
        )
      );
      url = `${url}?${qs}`;
    }

    // Headers base + los externos encima (SC_HEADERS_SICETAC agrega X-API-KEY)
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...headers,   // SC_HEADERS_SICETAC() sobreescribe / extiende aquí
      },
    };

    // Body solo en métodos que lo admiten
    if (data && method !== 'GET') {
      opts.body = JSON.stringify(data);
    }

    const resp = await fetch(url, opts);

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.message || err.error || `Error HTTP ${resp.status}`);
    }

    return resp.json();
  }

  async function Municipios() {
    try {
      const response = await fetch($('#base_url_api').val() + 'tarifas/listar-municipios', {
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
      $('#f-origen').each(function () {
        const $select = $(this);
        $select.empty().append('<option value="">Seleccione un municipio</option>');

        data.data.forEach(function (element) {
          $select.append(
            `<option value="${element.rndc_codigo_ciudad}" data-municipio="${element.municipio}" data-depto="${element.depto}">
                          ${element.municipio} - ${element.depto}
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

      $('#f-destino').each(function () {
        const $select = $(this);
        $select.empty().append('<option value="">Seleccione un municipio</option>');

        data.data.forEach(function (element) {
          $select.append(
            `<option value="${element.rndc_codigo_ciudad}" data-municipio="${element.municipio}" data-depto="${element.depto}">
                          ${element.municipio} - ${element.depto}
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

  /* ============================================================
     GUARDAR TARIFA SICETAC → cmx_fletes_nacional
     ============================================================ */

  /**
   * Guarda la tarifa SiceTac de la fila seleccionada.
   * Desactiva la tarifa activa anterior para la misma configuración
   * y crea una nueva con estado ACTIVA y vigencia calculada.
   */
  async function scGuardarTarifa(idx) {
    const tarifa = SC_STATE.data[idx];
    if (!tarifa) return;

    const empresaId = SC_STATE.empresa_id;
    const usuario = SC_STATE.usuario;

    // Confirmación con SweetAlert si está disponible, si no confirm() nativo
    const confirmado = (typeof Swal !== 'undefined')
      ? await Swal.fire({
        title: '¿Guardar tarifa SiceTac?',
        html: `
          <div style="text-align:left; font-size:0.9rem; line-height:1.8;">
            <strong>Configuración:</strong> ${tarifa.configuracion}<br>
            <strong>Origen:</strong> ${tarifa.nomorigen} (${tarifa.origen})<br>
            <strong>Destino:</strong> ${tarifa.nomdestino} (${tarifa.destino})<br>
            <strong>Valor:</strong> ${scFmtCOP(tarifa.valor)}<br>
            <strong>Período:</strong> ${tarifa.periodo || SC_STATE.periodoActivo}
          </div>
          <p style="margin-top:12px; font-size:0.8rem; color:#64748b;">
            Se desactivará la tarifa activa anterior para esta ruta/configuración.
          </p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#64748b',
        confirmButtonText: '<i class="fas fa-save"></i> Sí, guardar',
        cancelButtonText: 'Cancelar',
      }).then(r => r.isConfirmed)
      : confirm(`¿Guardar tarifa ${tarifa.configuracion} | ${scFmtCOP(tarifa.valor)}?`);

    if (!confirmado) return;

    // Buscar el botón de la fila para mostrar loading
    const fila = document.querySelector(`#sc-tbody tr[data-idx="${idx}"]`);
    const btnEl = fila?.querySelector('button');
    if (btnEl) {
      btnEl.disabled = true;
      btnEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }

    try {
      const body = {
        origen: tarifa.origen,
        destino: tarifa.destino,
        configuracion: tarifa.configuracion,
        tarifa_sicetac: tarifa.valor,
        periodo: tarifa.periodo || SC_STATE.periodoActivo,
        empresa_id: empresaId,
        usuario: usuario,
      };

      const resp = await scApiFetch(
        `http://127.0.0.1:8000/api/v1/sicetac/guardar-tarifa`,
        {
          method: 'POST',
          headers: SC_HEADERS_SICETAC(),
          data: body,
        }
      );

      if (resp.ok) {
        scFlash('success', 'Tarifa guardada', `${tarifa.configuracion} — ${scFmtCOP(tarifa.valor)} registrado correctamente.`);

        // Marcar fila visualmente como guardada
        if (fila) {
          fila.style.background = '#f0fdf4';
          if (btnEl) {
            btnEl.disabled = false;
            btnEl.innerHTML = '<i class="fas fa-check"></i> Guardado';
            btnEl.style.background = '#86efac';
            btnEl.style.cursor = 'default';
            btnEl.onclick = null;
          }
        }
      } else {
        throw new Error(resp.message || resp.error || 'Error al guardar');
      }

    } catch (err) {
      console.error('[SC] Error guardando tarifa:', err);
      scFlash('error', 'Error al guardar', err.message || 'No se pudo guardar la tarifa. Intenta nuevamente.');

      if (btnEl) {
        btnEl.disabled = false;
        btnEl.innerHTML = '<i class="fas fa-save"></i> Guardar';
      }
    }
  }

  /* ============================================================
     AUTO-INICIO
     ============================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scInit, Municipios);
    // document.addEventListener('DOMContentLoaded', Municipios);
  } else {
    scInit();
    Municipios();
  }

  /* ============================================================
     EXPOSICIÓN GLOBAL
     Para onclick= / oninput= inline en el phtml
     ============================================================ */
  window.scInit = scInit;
  window.scConsultar = scConsultar;
  window.scSetModo = scSetModo;
  window.scFiltrarTabla = scFiltrarTabla;
  window.scLimpiarFiltros = scLimpiarFiltros;
  window.scAbrirDetalle = scAbrirDetalle;
  window.scCerrarDetalle = scCerrarDetalle;
  window.scRecalcular = scRecalcular;
  window.scRenderValidacion = scRenderValidacion;
  window.scFlashHide = scFlashHide;
  window.scExportarExcel = scExportarExcel;
  window.scGuardarTarifa = scGuardarTarifa;
  window.Municipios = Municipios;

  window.initScript = function (id) {
    window.VENTANA = id;
    scInit();
  };

  /* ============================================================
     ALIASES — nombres usados en los onclick del phtml existente
     ============================================================ */
  window.sicetacConsultar = scConsultar;
  window.sicetacLimpiar = scLimpiarFiltros;
  window.setModo = scSetModo;
  window.filtrarTabla = scFiltrarTabla;
  window.cerrarDetalle = scCerrarDetalle;
  window.abrirDetalle = scAbrirDetalle;
  window.recalcular = scRecalcular;
  window.apFlashHide = scFlashHide;

})();