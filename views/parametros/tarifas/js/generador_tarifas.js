// /**
//  * generador_tarifa_costo.js
//  * REQ Punto 23 – Generador Automático de Tarifas de Costo
//  *
//  * ACTUALIZADO: Integración con Zonas de Despacho (cmx_zona_despacho)
//  * - Reemplaza "regiones" por "zonas" (endpoint /zonas)
//  * - Agrega campos multi_origen y multi_destino
//  * - Tags estilizados para municipios de zona (color morado)
//  */

// (function () {
//   'use strict';

//   /* ══════════════════════════════════════════════════════════════
//    | ESTADO GLOBAL DEL GENERADOR
//    ══════════════════════════════════════════════════════════════ */
//   const GEN = {
//     paso: 1,
//     origenes: {},   // { codigo: { id, nombre, departamento, esZona, nombreZona } }
//     destinos: {},
//     vehiculos: new Set(),
//     zonas: [],   // catálogo de zonas de despacho
//     preview: [],
//     excluidos: new Set(),
//     timers: {},
//   };

//   const API_BASE = () => document.getElementById('base_url_api')?.value || '/api';
//   const EMPRESA = () => parseInt(document.getElementById('empresa_id')?.value || 1);
//   const USUARIO = () => document.getElementById('ssn_nombre')?.value || 'sistema';

//   /* ══════════════════════════════════════════════════════════════
//    | CATÁLOGO DE VEHÍCULOS
//    ══════════════════════════════════════════════════════════════ */
//   const VEHICULOS = [
//     { val: '2', label: 'Sencillo > 10.500 kg', desc: 'Camión 2 ejes' },
//     { val: '2_7_8', label: 'Sencillo 7.500-8.000 kg', desc: 'Camión 2 ejes' },
//     { val: '2_8_9', label: 'Sencillo 8.001-9.000 kg', desc: 'Camión 2 ejes' },
//     { val: '2_9_105', label: 'Sencillo 9.001-10.500 kg', desc: 'Camión 2 ejes' },
//     { val: '2S2', label: 'Tractomula / Patineta 2+2 ejes', desc: 'Tractocamión' },
//     { val: '2S3', label: 'Tractomula / Patineta 2+3 ejes', desc: 'Tractocamión' },
//     { val: '3', label: 'Dobletroque', desc: 'Camión 3 ejes' },
//     { val: '3S2', label: 'Tractomula 3+2 ejes', desc: 'Tractocamión' },
//     { val: '3S3', label: 'Tractomula 3+3 ejes', desc: 'Tractocamión' },
//     { val: 'V2', label: 'Volqueta Sencillo', desc: 'Volqueta 2 ejes' },
//     { val: 'V3', label: 'Volqueta Dobletroque', desc: 'Volqueta 3 ejes' },
//     { val: 'V4', label: 'Volqueta Cuatromanos', desc: 'Volqueta 4 ejes' },
//   ];

//   /* ══════════════════════════════════════════════════════════════
//    | INICIALIZACIÓN
//    ══════════════════════════════════════════════════════════════ */
//   window.initGeneradorTarifas = function () {
//     genReset();
//     genCargarZonas();
//     genRenderVehiculos();
//     genInicializarFechas();
//     genNavegar(0);
//   };

//   document.addEventListener('DOMContentLoaded', function () {
//     const offcanvas = document.getElementById('offcanvasGeneradorTarifas');
//     if (offcanvas) {
//       offcanvas.addEventListener('show.bs.offcanvas', function () {
//         window.initGeneradorTarifas();
//       });
//     }
//   });

//   /* ══════════════════════════════════════════════════════════════
//    | NAVEGACIÓN DE PASOS
//    ══════════════════════════════════════════════════════════════ */
//   window.genNavegar = function (delta) {
//     const pasosMax = 4;

//     if (delta === 1 && !genValidarPaso()) return;

//     GEN.paso = Math.max(1, Math.min(pasosMax, GEN.paso + delta));

//     document.querySelectorAll('.gen-section').forEach((s, i) => {
//       s.classList.toggle('active', i + 1 === GEN.paso);
//     });

//     document.querySelectorAll('.gen-step-tab').forEach((tab, i) => {
//       const n = i + 1;
//       tab.classList.toggle('active', n === GEN.paso);
//       tab.classList.toggle('done', n < GEN.paso);
//     });

//     document.getElementById('gen-paso-actual').textContent = GEN.paso;
//     document.getElementById('gen-footer-info').textContent =
//       GEN.paso < 5 ? `Paso ${GEN.paso} de 4` : '';

//     const btnPrev = document.getElementById('gen-btn-prev');
//     const btnNext = document.getElementById('gen-btn-next');
//     const btnPreview = document.getElementById('gen-btn-preview');
//     const btnGenerar = document.getElementById('gen-btn-generar');

//     btnPrev.style.display = GEN.paso > 1 && GEN.paso < 5 ? '' : 'none';
//     btnNext.style.display = GEN.paso < 3 ? '' : 'none';
//     btnPreview.style.display = GEN.paso === 3 ? '' : 'none';
//     btnGenerar.style.display = GEN.paso === 4 ? '' : 'none';

//     if (GEN.paso === 4 && GEN.preview.length === 0) {
//       genCargarPreview();
//     }
//   };

//   function genValidarPaso() {
//     if (GEN.paso === 1) {
//       if (Object.keys(GEN.origenes).length === 0) {
//         genToast('Agrega al menos un origen.', 'warning'); return false;
//       }
//       if (Object.keys(GEN.destinos).length === 0) {
//         genToast('Agrega al menos un destino.', 'warning'); return false;
//       }
//     }
//     if (GEN.paso === 2) {
//       if (GEN.vehiculos.size === 0) {
//         genToast('Selecciona al menos un tipo de vehículo.', 'warning'); return false;
//       }
//     }
//     if (GEN.paso === 3) {
//       const plena = genParseCurrency(document.getElementById('gen-plena').value);
//       if (!plena || plena <= 0) {
//         genToast('La Tarifa Plena es obligatoria y debe ser mayor a 0.', 'warning'); return false;
//       }
//     }
//     return true;
//   }

//   /* ══════════════════════════════════════════════════════════════
//    | PASO 1: ORÍGENES & DESTINOS
//    ══════════════════════════════════════════════════════════════ */
//   window.genBuscarMunicipio = function (q, tipo) {
//     clearTimeout(GEN.timers[tipo]);
//     if (q.length < 2) {
//       document.getElementById(`gen-drop-${tipo}`).style.display = 'none';
//       return;
//     }
//     GEN.timers[tipo] = setTimeout(() => {
//       fetch(`${API_BASE()}/tarifas-costos/generador/municipios?q=${encodeURIComponent(q)}`)
//         .then(r => r.json())
//         .then(res => {
//           if (!res.success) return;
//           genRenderDropdown(res.data, tipo);
//         })
//         .catch(() => { });
//     }, 280);
//   };

//   function genRenderDropdown(municipios, tipo) {
//     const drop = document.getElementById(`gen-drop-${tipo}`);
//     if (!municipios.length) {
//       drop.style.display = 'none';
//       return;
//     }
//     drop.innerHTML = municipios.map(m =>
//       `<div class="gen-mun-item" onclick="genAgregarMunicipio('${m.id}','${genEscape(m.nombre)}','${genEscape(m.departamento || m.depto || '')}','${tipo}')">
//                 <span>${m.nombre}</span>
//                 <span class="mun-dep">${m.departamento || m.depto || ''}</span>
//             </div>`
//     ).join('');
//     drop.style.display = 'block';
//   }

//   window.genAgregarMunicipio = function (id, nombre, departamento, tipo) {
//     const store = tipo === 'origen' ? GEN.origenes : GEN.destinos;
//     store[id] = { id, nombre, departamento, esZona: false, nombreZona: null };
//     genRenderTags(tipo);
//     document.getElementById(`gen-drop-${tipo}`).style.display = 'none';
//     document.getElementById(`gen-search-${tipo}`).value = '';
//   };

//   window.genRemoverMunicipio = function (id, tipo) {
//     if (tipo === 'origen') delete GEN.origenes[id];
//     else delete GEN.destinos[id];
//     genRenderTags(tipo);
//   };

//   window.genLimpiarOrigenes = function () {
//     GEN.origenes = {};
//     genRenderTags('origen');
//   };

//   window.genLimpiarDestinos = function () {
//     GEN.destinos = {};
//     genRenderTags('destino');
//   };

//   function genRenderTags(tipo) {
//     const store = tipo === 'origen' ? GEN.origenes : GEN.destinos;
//     const contId = `gen-tags-${tipo}`;
//     const cntId = `count-${tipo}s`;
//     const items = Object.values(store);

//     document.getElementById(contId).innerHTML = items.map(m =>
//       `<span class="gen-tag ${m.esZona ? 'zona-tag' : ''}">
//                 ${m.esZona ? '<i class="fas fa-layer-group"></i>' : ''}
//                 ${genEscape(m.nombre)}${m.departamento ? ', ' + genEscape(m.departamento) : ''}
//                 ${m.nombreZona ? '<small style="opacity:.6">(' + genEscape(m.nombreZona) + ')</small>' : ''}
//                 <span class="tag-remove" onclick="genRemoverMunicipio('${m.id}','${tipo}')">×</span>
//             </span>`
//     ).join('') || '<span style="color:#aaa;font-size:.75rem;">Ninguno seleccionado</span>';

//     document.getElementById(cntId).textContent = items.length;
//   }

//   /* ── Zonas de Despacho ─────────────────────────────────── */
//   function genCargarZonas() {
//     fetch(`${API_BASE()}/tarifas-costos/generador/zonas?empresa_id=${EMPRESA()}`)
//       .then(r => r.json())
//       .then(res => {
//         if (!res.success) return;
//         GEN.zonas = res.data;
//         genRenderZonaPills('origen');
//         genRenderZonaPills('destino');
//       })
//       .catch(() => { });
//   }

//   function genRenderZonaPills(tipo) {
//     const contId = `gen-zonas-${tipo}`;
//     const cont = document.getElementById(contId);
//     if (!cont || !GEN.zonas.length) {
//       if (cont) cont.innerHTML = '<span style="font-size:.72rem;color:#aaa;">No hay zonas parametrizadas</span>';
//       return;
//     }

//     cont.innerHTML = GEN.zonas.map(z =>
//       `<span class="gen-zona-pill" onclick="genAgregarZona(${z.id},'${tipo}')">
//                 <i class="fas fa-plus"></i> ${genEscape(z.nombre)}
//                 <small style="opacity:.6">(${z.municipios?.length || 0})</small>
//             </span>`
//     ).join('');
//   }

//   window.genAgregarZona = function (zonaId, tipo) {
//     const zona = GEN.zonas.find(z => z.id === zonaId);
//     if (!zona || !zona.municipios) return;

//     const store = tipo === 'origen' ? GEN.origenes : GEN.destinos;
//     let agregados = 0;
//     zona.municipios.forEach(m => {
//       if (!store[m.id]) {
//         store[m.id] = {
//           id: m.id,
//           nombre: m.nombre,
//           departamento: m.departamento,
//           esZona: true,
//           nombreZona: zona.nombre,
//         };
//         agregados++;
//       }
//     });
//     genRenderTags(tipo);
//     if (agregados > 0) {
//       genToast(`${agregados} municipio(s) de la zona "${zona.nombre}" agregados como ${tipo}.`, 'success');
//     } else {
//       genToast(`Todos los municipios de "${zona.nombre}" ya estaban seleccionados.`, 'info');
//     }
//   };

//   // Cerrar dropdown al hacer click fuera
//   document.addEventListener('click', function (e) {
//     ['origen', 'destino'].forEach(tipo => {
//       const wrap = document.getElementById(`search-wrap-${tipo}`);
//       const drop = document.getElementById(`gen-drop-${tipo}`);
//       if (wrap && !wrap.contains(e.target)) {
//         drop.style.display = 'none';
//       }
//     });
//   });

//   /* ══════════════════════════════════════════════════════════════
//    | PASO 2: VEHÍCULOS
//    ══════════════════════════════════════════════════════════════ */
//   function genRenderVehiculos() {
//     const cont = document.getElementById('gen-vehicle-grid');
//     if (!cont) return;
//     cont.innerHTML = VEHICULOS.map(v =>
//       `<label class="gen-veh-check" id="veh-wrap-${v.val}">
//                 <input type="checkbox" value="${v.val}"
//                     onchange="genToggleVehiculo('${v.val}', this.checked)">
//                 <div>
//                     <div class="veh-label">${v.label}</div>
//                     <div style="font-size:.7rem;color:#999">${v.desc}</div>
//                 </div>
//             </label>`
//     ).join('');
//   }

//   window.genToggleVehiculo = function (val, checked) {
//     if (checked) GEN.vehiculos.add(val);
//     else GEN.vehiculos.delete(val);
//     document.getElementById(`veh-wrap-${val}`)?.classList.toggle('checked', checked);
//   };

//   window.genSeleccionarTodosVehiculos = function () {
//     VEHICULOS.forEach(v => {
//       GEN.vehiculos.add(v.val);
//       const wrap = document.getElementById(`veh-wrap-${v.val}`);
//       if (wrap) {
//         wrap.classList.add('checked');
//         wrap.querySelector('input').checked = true;
//       }
//     });
//   };

//   window.genLimpiarVehiculos = function () {
//     GEN.vehiculos.clear();
//     VEHICULOS.forEach(v => {
//       const wrap = document.getElementById(`veh-wrap-${v.val}`);
//       if (wrap) {
//         wrap.classList.remove('checked');
//         wrap.querySelector('input').checked = false;
//       }
//     });
//   };

//   /* ══════════════════════════════════════════════════════════════
//    | PASO 3: VALORES Y VIGENCIA
//    ══════════════════════════════════════════════════════════════ */
//   function genInicializarFechas() {
//     const ahora = new Date();
//     const el = (id) => document.getElementById(id);

//     if (el('gen-vigencia')) el('gen-vigencia').value = ahora.getFullYear();
//     if (el('gen-mes')) el('gen-mes').value = ahora.getMonth() + 1;
//     if (el('gen-semana')) el('gen-semana').value = genGetSemanaISO(ahora);
//   }

//   function genGetSemanaISO(date) {
//     const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
//     const dn = d.getUTCDay() || 7;
//     d.setUTCDate(d.getUTCDate() + 4 - dn);
//     const yr = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
//     return Math.ceil((((d - yr) / 86400000) + 1) / 7);
//   }

//   window.genFormatCurrency = function (el) {
//     let val = el.value.replace(/[^0-9.]/g, '');
//     const parts = val.split('.');
//     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//     el.value = parts.join('.').substring(0, 20);
//   };

//   function genParseCurrency(str) {
//     return parseFloat((str || '').replace(/,/g, '')) || 0;
//   }

//   /* ══════════════════════════════════════════════════════════════
//    | PASO 4: PREVIEW
//    ══════════════════════════════════════════════════════════════ */
//   window.genCargarPreview = function () {
//     const body = document.getElementById('gen-preview-body');
//     const loading = document.getElementById('gen-preview-loading');
//     const table = document.getElementById('gen-preview-table');

//     if (!genValidarPasoCompleto()) return;

//     loading.style.display = 'block';
//     table.style.display = 'none';
//     body.innerHTML = '';
//     GEN.preview = [];
//     GEN.excluidos.clear();

//     const payload = genArmarPayload();

//     fetch(`${API_BASE()}/tarifas-costos/generador/preview`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': genCsrfToken() },
//       body: JSON.stringify(payload),
//     })
//       .then(r => r.json())
//       .then(res => {
//         loading.style.display = 'none';
//         table.style.display = '';

//         if (!res.success) {
//           genToast('Error al calcular las combinaciones.', 'error');
//           return;
//         }

//         GEN.preview = res.combinaciones || [];
//         genRenderPreview(res.resumen);
//         genNavegar(0);
//       })
//       .catch(err => {
//         loading.style.display = 'none';
//         table.style.display = '';
//         genToast('Error de red al cargar el preview.', 'error');
//         console.error(err);
//       });
//   };

//   function genRenderPreview(resumen) {
//     const stats = document.getElementById('gen-preview-stats');
//     stats.innerHTML = `
//             <span class="gen-stat-badge crear"><i class="fas fa-plus-circle"></i> ${resumen.crear} Nuevas</span>
//             <span class="gen-stat-badge act"><i class="fas fa-sync-alt"></i> ${resumen.actualizar} Actualizar</span>
//             <span class="gen-stat-badge pend"><i class="fas fa-hourglass-half"></i> ${resumen.con_aprobacion} Con aprobación</span>
//             <span class="gen-stat-badge saltar"><i class="fas fa-forward"></i> ${resumen.saltar} Saltar</span>
//         `;

//     const body = document.getElementById('gen-preview-body');
//     const vehiculoLabel = (val) => VEHICULOS.find(v => v.val === val)?.label || val;

//     body.innerHTML = GEN.preview.map((c, i) => {
//       const key = `${c.origen}|${c.destino}|${c.tipo_vehiculo}`;
//       const saltar = c.accion === 'SALTAR';
//       const varColor = c.variacion_pct > 20 ? '#dc2626' : c.variacion_pct > 10 ? '#d97706' : '#0f9d58';

//       return `<tr class="${saltar ? 'row-saltar' : ''}" id="gen-row-${i}" data-key="${key}">
//                 <td>
//                     ${saltar
//           ? `<i class="fas fa-ban" style="color:#cbd5e1" title="${c.motivo_saltar}"></i>`
//           : `<input type="checkbox" class="gen-row-check" checked
//                             onchange="genToggleExcluir('${key}', !this.checked, ${i})">`
//         }
//                 </td>
//                 <td>
//                     <div style="font-size:.8rem;font-weight:600">${genEscape(c.origen_nombre.split('(')[0].trim())}</div>
//                     <div style="font-size:.7rem;color:#999">${c.origen}</div>
//                 </td>
//                 <td>
//                     <div style="font-size:.8rem;font-weight:600">${genEscape(c.destino_nombre.split('(')[0].trim())}</div>
//                     <div style="font-size:.7rem;color:#999">${c.destino}</div>
//                 </td>
//                 <td style="font-size:.75rem">${vehiculoLabel(c.tipo_vehiculo)}</td>
//                 <td><span class="badge-accion ${c.accion}">${c.accion}</span></td>
//                 <td style="font-size:.8rem;font-weight:600">$${genNumFormat(c.plena)}</td>
//                 <td style="font-size:.78rem;color:#666">${c.valor_anterior > 0 ? '$' + genNumFormat(c.valor_anterior) : '—'}</td>
//                 <td style="font-size:.78rem;font-weight:600;color:${varColor}">
//                     ${c.variacion_pct > 0 ? `+${c.variacion_pct}%` : '—'}
//                 </td>
//                 <td>
//                     ${c.requiere_aprobacion
//           ? `<span style="font-size:.7rem;background:var(--gen-amber-lt);color:#92400e;padding:2px 7px;border-radius:10px;font-weight:700;">
//                              <i class="fas fa-clock me-1"></i>Requiere
//                            </span>`
//           : `<span style="font-size:.7rem;color:#0f9d58;">
//                              <i class="fas fa-check me-1"></i>Directo
//                            </span>`
//         }
//                 </td>
//             </tr>`;
//     }).join('') || `<tr><td colspan="9" class="text-center text-muted py-4">Sin combinaciones para mostrar</td></tr>`;
//   }

//   window.genToggleExcluir = function (key, excluir, rowIdx) {
//     if (excluir) GEN.excluidos.add(key);
//     else GEN.excluidos.delete(key);
//     document.getElementById(`gen-row-${rowIdx}`)?.classList.toggle('row-excluir', excluir);
//     const total = GEN.preview.filter(c => c.accion !== 'SALTAR').length;
//     const excluidos = GEN.excluidos.size;
//     document.getElementById('gen-check-all').checked = excluidos === 0;
//     document.getElementById('gen-check-all').indeterminate = excluidos > 0 && excluidos < total;
//   };

//   window.genToggleAll = function (checked) {
//     GEN.preview.forEach((c, i) => {
//       if (c.accion === 'SALTAR') return;
//       const key = `${c.origen}|${c.destino}|${c.tipo_vehiculo}`;
//       if (!checked) GEN.excluidos.add(key);
//       else GEN.excluidos.delete(key);
//       const row = document.getElementById(`gen-row-${i}`);
//       const chk = row?.querySelector('input[type=checkbox]');
//       if (chk) chk.checked = checked;
//       row?.classList.toggle('row-excluir', !checked);
//     });
//   };

//   window.genMarcarTodos = function (checked) {
//     document.getElementById('gen-check-all').checked = checked;
//     genToggleAll(checked);
//   };

//   /* ══════════════════════════════════════════════════════════════
//    | EJECUTAR GENERACIÓN
//    ══════════════════════════════════════════════════════════════ */
//   window.genEjecutar = function () {
//     const btnGenerar = document.getElementById('gen-btn-generar');
//     const activas = GEN.preview.filter(c =>
//       c.accion !== 'SALTAR' && !GEN.excluidos.has(`${c.origen}|${c.destino}|${c.tipo_vehiculo}`)
//     ).length;

//     if (activas === 0) {
//       genToast('No hay combinaciones seleccionadas para generar.', 'warning');
//       return;
//     }

//     if (!confirm(`¿Confirmas la generación de ${activas} tarifa(s)? Esta acción no se puede deshacer.`)) return;

//     btnGenerar.disabled = true;
//     btnGenerar.innerHTML = `<div class="gen-spinner"></div> Generando...`;

//     const excluirArr = [];
//     GEN.excluidos.forEach(key => {
//       const [origen, destino, tipo_vehiculo] = key.split('|');
//       excluirArr.push({ origen, destino, tipo_vehiculo });
//     });

//     const payload = {
//       ...genArmarPayload(),
//       excluir: excluirArr,
//     };

//     fetch(`${API_BASE()}/tarifas-costos/generador/generar`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': genCsrfToken() },
//       body: JSON.stringify(payload),
//     })
//       .then(r => r.json())
//       .then(res => {
//         btnGenerar.disabled = false;
//         btnGenerar.innerHTML = `<i class="fas fa-magic"></i> Generar Tarifas`;

//         if (!res.success) {
//           genToast(res.message || 'Error al generar tarifas.', 'error');
//           return;
//         }

//         genMostrarResultado(res.resumen);
//         GEN.paso = 5;
//         document.querySelectorAll('.gen-section').forEach((s, i) => {
//           s.classList.toggle('active', i + 1 === 5);
//         });
//         document.querySelectorAll('.gen-step-tab').forEach(t => t.classList.remove('active'));
//         document.querySelectorAll('.gen-step-tab').forEach(t => t.classList.add('done'));
//         document.getElementById('gen-btn-generar').style.display = 'none';
//         document.getElementById('gen-btn-prev').style.display = 'none';
//         document.getElementById('gen-footer-info').textContent = '¡Proceso completado!';
//       })
//       .catch(err => {
//         btnGenerar.disabled = false;
//         btnGenerar.innerHTML = `<i class="fas fa-magic"></i> Generar Tarifas`;
//         genToast('Error de red al ejecutar la generación.', 'error');
//         console.error(err);
//       });
//   };

//   function genMostrarResultado(resumen) {
//     const tieneErrores = resumen.errores > 0;
//     document.getElementById('gen-result-icon').textContent = tieneErrores ? '⚠️' : '✅';
//     document.getElementById('gen-result-title').textContent =
//       tieneErrores ? 'Generación completada con advertencias' : '¡Generación completada!';
//     document.getElementById('gen-result-sub').textContent =
//       `${resumen.total} combinaciones procesadas.`;

//     document.getElementById('gen-result-grid').innerHTML = `
//             <div class="gen-result-card rc-activa">
//                 <div class="rc-num">${resumen.creadas_activas}</div>
//                 <div class="rc-label">Activadas directamente</div>
//             </div>
//             <div class="gen-result-card rc-pend">
//                 <div class="rc-num">${resumen.creadas_pendientes}</div>
//                 <div class="rc-label">A bandeja de aprobación</div>
//             </div>
//             <div class="gen-result-card rc-salt">
//                 <div class="rc-num">${resumen.saltadas_pendiente + resumen.saltadas_excluidas}</div>
//                 <div class="rc-label">Saltadas</div>
//             </div>
//             <div class="gen-result-card rc-error">
//                 <div class="rc-num">${resumen.errores}</div>
//                 <div class="rc-label">Con error</div>
//             </div>
//         `;
//   }

//   /* ══════════════════════════════════════════════════════════════
//    | CERRAR / RESET
//    ══════════════════════════════════════════════════════════════ */
//   window.genCerrar = function () {
//     const el = document.getElementById('offcanvasGeneradorTarifas');
//     if (el) bootstrap.Offcanvas.getInstance(el)?.hide();
//     if (typeof listar_Fletes_Costos === 'function') listar_Fletes_Costos();
//   };

//   window.genReset = function () {
//     GEN.paso = 1;
//     GEN.origenes = {};
//     GEN.destinos = {};
//     GEN.vehiculos.clear();
//     GEN.preview = [];
//     GEN.excluidos.clear();

//     ['origen', 'destino'].forEach(tipo => {
//       const tags = document.getElementById(`gen-tags-${tipo}`);
//       if (tags) tags.innerHTML = '';
//       const cnt = document.getElementById(`count-${tipo}s`);
//       if (cnt) cnt.textContent = '0';
//       const inp = document.getElementById(`gen-search-${tipo}`);
//       if (inp) inp.value = '';
//     });

//     const body = document.getElementById('gen-preview-body');
//     if (body) body.innerHTML = '';

//     // Limpiar campos de valores
//     ['gen-plena', 'gen-multi-recogida', 'gen-multi-origen', 'gen-multi-entrega', 'gen-multi-destino'].forEach(id => {
//       const el = document.getElementById(id);
//       if (el) el.value = '';
//     });

//     genLimpiarVehiculos();
//     GEN.paso = 1;
//     genNavegar(0);
//   };

//   /* ══════════════════════════════════════════════════════════════
//    | HELPERS
//    ══════════════════════════════════════════════════════════════ */
//   function genArmarPayload() {
//     return {
//       empresa_id: EMPRESA(),
//       usuario: USUARIO(),
//       origenes: Object.keys(GEN.origenes),
//       destinos: Object.keys(GEN.destinos),
//       tipos_vehiculo: [...GEN.vehiculos],
//       plena: genParseCurrency(document.getElementById('gen-plena')?.value),
//       multi_recogida: genParseCurrency(document.getElementById('gen-multi-recogida')?.value),
//       multi_origen: genParseCurrency(document.getElementById('gen-multi-origen')?.value),
//       multi_entrega: genParseCurrency(document.getElementById('gen-multi-entrega')?.value),
//       multi_destino: genParseCurrency(document.getElementById('gen-multi-destino')?.value),
//       vigencia: parseInt(document.getElementById('gen-vigencia')?.value) || new Date().getFullYear(),
//       mes: parseInt(document.getElementById('gen-mes')?.value) || new Date().getMonth() + 1,
//       semana: parseInt(document.getElementById('gen-semana')?.value) || genGetSemanaISO(new Date()),
//     };
//   }

//   function genValidarPasoCompleto() {
//     const plena = genParseCurrency(document.getElementById('gen-plena')?.value);
//     if (Object.keys(GEN.origenes).length === 0) { genToast('Agrega al menos un origen.', 'warning'); return false; }
//     if (Object.keys(GEN.destinos).length === 0) { genToast('Agrega al menos un destino.', 'warning'); return false; }
//     if (GEN.vehiculos.size === 0) { genToast('Selecciona al menos un tipo de vehículo.', 'warning'); return false; }
//     if (!plena || plena <= 0) { genToast('La Tarifa Plena es obligatoria.', 'warning'); return false; }
//     return true;
//   }

//   function genEscape(str) {
//     return (str || '').replace(/'/g, "\\'").replace(/</g, '&lt;').replace(/>/g, '&gt;');
//   }

//   function genNumFormat(num) {
//     return (parseFloat(num) || 0).toLocaleString('es-CO');
//   }

//   function genCsrfToken() {
//     return document.querySelector('meta[name="csrf-token"]')?.content
//       || document.querySelector('input[name="_token"]')?.value
//       || '';
//   }

//   function genToast(msg, type = 'info') {
//     if (typeof mostrarToast === 'function') {
//       mostrarToast(msg, type);
//       return;
//     }
//     const colors = { success: '#0f9d58', error: '#dc2626', warning: '#d97706', info: '#1a73e8' };
//     const toast = document.createElement('div');
//     toast.style.cssText = `
//             position:fixed;bottom:24px;right:24px;z-index:9999;
//             background:${colors[type] || colors.info};color:#fff;
//             padding:12px 20px;border-radius:10px;font-size:.83rem;font-weight:600;
//             box-shadow:0 4px 16px rgba(0,0,0,.18);
//             animation:gen-slide-in .25s ease;
//         `;
//     toast.textContent = msg;
//     document.body.appendChild(toast);
//     setTimeout(() => toast.remove(), 3500);
//   }

//   window.genSubirExcel = function () {

//     const file = document.getElementById('gen-excel').files[0];
//     if (!file) {
//       genToast('Selecciona un archivo Excel', 'warning');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('archivo', file);
//     formData.append('empresa_id', EMPRESA());
//     formData.append('usuario', USUARIO());

//     fetch(`${API_BASE()}tarifas-costos/generador/upload`, {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'X-API-KEY': 'nexos_nacional2026@*',
//         // ❌ NO pongas Content-Type
//       },
//       body: formData
//     })
//       .then(async r => {
//         if (!r.ok) {
//           const text = await r.text();
//           throw new Error(text);
//         }
//         return r.json();
//       })
//       .then(res => {

//         if (!res.success) {
//           genToast(res.message || 'Error al procesar el archivo', 'error');
//           return;
//         }

//         genToast('Archivo procesado correctamente', 'success');
//         console.log(res);

//       })
//       .catch(err => {
//         console.error(err);
//         genToast('Error de conexión con la API', 'error');
//       });
//   }

// })();


/* ══════════════════════════════════════════════════════════
   MÓDULO GENERADOR TARIFAS — CARGA EXCEL
   Vista DOM (sin modal / offcanvas)
══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Estado ─────────────────────────────────────── */
  const S = {
    archivo: null,
    preview: [],
    errores: [],
    resumen: {},
    importado: false,
    empresa_id: null,
    usuario: null,
  };

  const API = () => document.getElementById('base_url_api')?.value || '/api';
  const EMP = () => parseInt(document.getElementById('empresa_id')?.value || 1);
  const USR = () => document.getElementById('ssn_nombre')?.value || 'sistema';
  const CSRF = () =>
    document.querySelector('meta[name="csrf-token"]')?.content ||
    document.querySelector('input[name="_token"]')?.value || '';

  /* ── Navegación de pasos ─────────────────────────── */
  const PASOS = 4;

  window.cexIrPaso = function (n) {
    for (let i = 1; i <= PASOS; i++) {
      const sec = document.getElementById(`cex-sec-${i}`);
      if (sec) sec.classList.toggle('is-active', i === n);
    }
    for (let i = 1; i <= PASOS; i++) {
      const wiz = document.getElementById(`cex-wiz-${i}`);
      const num = document.getElementById(`cex-wiz-num-${i}`);
      if (!wiz) continue;
      wiz.classList.remove('is-active', 'is-done');
      if (i === n) {
        wiz.classList.add('is-active');
        num.innerHTML = i;
      } else if (i < n) {
        wiz.classList.add('is-done');
        num.innerHTML = '<i class="fas fa-check" style="font-size:.6rem"></i>';
      } else {
        num.innerHTML = i;
      }
    }
  };

  /* ── Drag & drop ─────────────────────────────────── */
  window.cexHandleDrop = function (e) {
    e.preventDefault();
    document.getElementById('cex-dropzone').classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const fi = document.getElementById('cex-file-input');
    const dt = new DataTransfer();
    dt.items.add(file);
    fi.files = dt.files;
    cexArchivoSeleccionado(fi);
  };

  window.cexArchivoSeleccionado = function (input) {
    const file = input.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls'].includes(ext)) {
      cexToast('Solo se aceptan archivos .xlsx o .xls', 'error');
      input.value = '';
      return;
    }
    S.archivo = file;
    document.getElementById('cex-file-name').textContent = file.name;
    document.getElementById('cex-file-size').textContent =
      file.size > 1024 * 1024
        ? (file.size / 1024 / 1024).toFixed(1) + ' MB'
        : Math.round(file.size / 1024) + ' KB';
    document.getElementById('cex-file-pill').style.display = 'flex';
  };

  /* ── PASO 1 → 2: Calcular preview ───────────────── */
  window.cexCalcPreview = function () {
    if (!S.archivo) {
      cexToast('Selecciona un archivo Excel primero.', 'warning');
      return;
    }

    S.empresa_id = EMP();
    S.usuario = USR();

    // Mostrar paso 2 con loading
    cexIrPaso(2);
    document.getElementById('cex-loading').style.display = '';
    document.getElementById('cex-preview-content').style.display = 'none';
    document.getElementById('cex-bar-2').style.display = 'none';

    const fd = new FormData();
    fd.append('archivo', S.archivo);
    fd.append('empresa_id', S.empresa_id);
    fd.append('usuario', S.usuario);

    fetch(`${API()}tarifas-costos/generador-tarifas/preview`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'X-API-KEY': 'nexos_nacional2026@*' },
      body: fd,
    })
      .then(async r => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then(res => {
        document.getElementById('cex-loading').style.display = 'none';
        document.getElementById('cex-preview-content').style.display = '';
        document.getElementById('cex-bar-2').style.display = '';

        if (!res.success) {
          cexToast(res.message || 'Error al calcular el preview.', 'error');
          cexIrPaso(1);
          return;
        }

        S.preview = res.preview || [];
        S.errores = res.errores || [];
        S.resumen = res.resumen || {};
        S.importado = false;

        cexRenderBadges(document.getElementById('cex-badges'));
        cexRenderTabla();
        cexRenderErrores();
      })
      .catch(err => {
        document.getElementById('cex-loading').style.display = 'none';
        document.getElementById('cex-preview-content').style.display = '';
        document.getElementById('cex-bar-2').style.display = '';
        cexToast('Error de red al calcular el preview.', 'error');
        console.error(err);
        cexIrPaso(1);
      });
  };

  /* ── PASO 2 → 3 → 4: Importar ───────────────────── */
  window.cexImportar = function () {
    if (!S.archivo || S.importado) return;

    const btn = document.getElementById('cex-btn-importar');
    btn.disabled = true;
    btn.innerHTML = `<span class="cex-spin cex-spin-sm"></span> Importando...`;

    cexIrPaso(3);

    const fd = new FormData();
    fd.append('archivo', S.archivo);
    fd.append('empresa_id', S.empresa_id);
    fd.append('usuario', S.usuario);

    fetch(`${API()}tarifas-costos/importar`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'X-API-KEY': 'nexos_nacional2026@*' },
      body: fd,
    })
      .then(async r => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then(res => {
        btn.disabled = false;
        btn.innerHTML = `<i class="fas fa-check"></i> Confirmar importación`;

        if (!res.success) {
          cexToast(res.message || 'Error al importar.', 'error');
          cexIrPaso(2);
          return;
        }

        S.importado = true;
        S.resumen = res.resumen || S.resumen;

        cexRenderResultado();
        cexIrPaso(4);
        cexToast(`✅ ${res.resumen.procesadas} ruta(s) importadas correctamente.`, 'success');

        if (typeof listar_Fletes_Costos === 'function') listar_Fletes_Costos();
      })
      .catch(err => {
        btn.disabled = false;
        btn.innerHTML = `<i class="fas fa-check"></i> Confirmar importación`;
        cexToast('Error de red al importar.', 'error');
        console.error(err);
        cexIrPaso(2);
      });
  };

  /* ── Exportar a Excel ────────────────────────────── */
  window.cexExportarPreview = function () {
    if (!S.preview.length) {
      cexToast('No hay datos para exportar.', 'warning');
      return;
    }

    fetch(`${API()}tarifas-costos/exportar-preview`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-API-KEY': 'nexos_nacional2026@*', },
      body: JSON.stringify({ empresa_id: S.empresa_id, filas: S.preview }),
    })
      .then(async r => {
        if (!r.ok) throw new Error(await r.text());
        const blob = await r.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tarifas_generadas_${cexFechaHoy()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        cexToast('✅ Archivo Excel descargado.', 'success');
      })
      .catch(err => {
        cexToast('Error al generar el archivo Excel.', 'error');
        console.error(err);
      });
  };

  window.cexFinalizarYListar = function () {
    if (typeof listar_Fletes_Costos === 'function') listar_Fletes_Costos();
  };

  /* ── Render tabla preview ────────────────────────── */
  function cexRenderTabla() {
    const tbody = document.getElementById('cex-tbody');
    if (!S.preview.length) {
      tbody.innerHTML = `
        <tr><td colspan="12" style="text-align:center;padding:48px;color:var(--c-text-soft)">
          <i class="fas fa-inbox" style="font-size:2rem;opacity:.3;display:block;margin-bottom:8px"></i>
          No se encontraron rutas válidas en el archivo
        </td></tr>`;
      return;
    }

    tbody.innerHTML = S.preview.map((f, i) => `
      <tr>
        <td class="cex-t-center" style="color:var(--c-text-soft);font-size:.72rem">${i + 1}</td>
        <td>
          <div class="cex-t-sub">${esc(f.nombre_origen)}</div>
          <!--<div class="cex-t-main">${esc(f.origen)}</div>-->
        </td>
        <td>
          <div class="cex-t-sub">${esc(f.nombre_destino)}</div>
          <!--<div class="cex-t-main">${esc(f.destino)}</div>-->
        </td>
        <td><span class="cex-veh">${esc(f.tipo_vehiculo)}</span></td>
        <td><span class="cex-region"><i class="fas fa-layer-group"></i> ${esc(f.region)}</span></td>
        <td class="cex-t-num">${fmtVal(f.ultima_tarifa)}</td>
        <td class="cex-t-num">${fmtVal(f.tarifa_sicetac)}</td>
        <td class="cex-t-num">${fmtVal(f.tarifa_mercado)}</td>
        <td class="cex-t-center">${fmtSem(f.semana_actualizacion)}</td>
        <td class="cex-t-center" style="font-size:.77rem">${esc(f.mes_actualizacion)}</td>
        <td class="cex-t-center" style="font-size:.77rem">${esc(f.anio_actualizacion)}</td>
        <td class="cex-t-center">${estadoBadge(f.estado)}</td>
      </tr>`).join('');
  }

  function cexRenderBadges(cont) {
    if (!cont) return;
    const r = S.resumen;
    cont.innerHTML = `
      <span class="cex-badge cex-badge-total"><i class="fas fa-list"></i> ${S.preview.length} Rutas válidas</span>
      <span class="cex-badge cex-badge-ok"><i class="fas fa-check-circle"></i> ${r.procesadas ?? 0} Procesables</span>
      <span class="cex-badge cex-badge-skip"><i class="fas fa-forward"></i> ${r.saltadas ?? 0} Saltadas</span>
      <span class="cex-badge cex-badge-err"><i class="fas fa-exclamation-circle"></i> ${r.errores ?? 0} Errores</span>
    `;
  }

  function cexRenderErrores() {
    const panel = document.getElementById('cex-err-panel');
    const body = document.getElementById('cex-err-body');
    if (!S.errores.length) { panel.style.display = 'none'; return; }
    panel.style.display = '';
    body.innerHTML = S.errores.map(e =>
      `<div class="cex-err-row">
        <span class="cex-err-fila">Fila ${e.fila}</span>
        <span class="cex-err-msg">${esc(e.error)}</span>
      </div>`).join('');
  }

  function cexRenderResultado() {
    const cont = document.getElementById('cex-result-cards');
    const r = S.resumen;
    cont.innerHTML = `
      <div class="cex-rc rc-ok">
        <div class="rc-n">${r.procesadas ?? 0}</div>
        <div class="rc-l">Importadas</div>
      </div>
      <div class="cex-rc rc-skip">
        <div class="rc-n">${r.saltadas ?? 0}</div>
        <div class="rc-l">Saltadas</div>
      </div>
      <div class="cex-rc rc-err">
        <div class="rc-n">${r.errores ?? 0}</div>
        <div class="rc-l">Con error</div>
      </div>
      <div class="cex-rc rc-all">
        <div class="rc-n">${S.preview.length}</div>
        <div class="rc-l">Rutas totales</div>
      </div>`;
  }

  /* ── Reset ───────────────────────────────────────── */
  window.cexReset = function () {
    S.archivo = null;
    S.preview = [];
    S.errores = [];
    S.resumen = {};
    S.importado = false;

    const fi = document.getElementById('cex-file-input');
    if (fi) fi.value = '';

    const pill = document.getElementById('cex-file-pill');
    if (pill) pill.style.display = 'none';

    const tbody = document.getElementById('cex-tbody');
    if (tbody) tbody.innerHTML = '';

    const badges = document.getElementById('cex-badges');
    if (badges) badges.innerHTML = '';

    const errPanel = document.getElementById('cex-err-panel');
    if (errPanel) errPanel.style.display = 'none';

    const btnImp = document.getElementById('cex-btn-importar');
    if (btnImp) {
      btnImp.disabled = false;
      btnImp.innerHTML = `<i class="fas fa-check"></i> Confirmar importación`;
    }

    cexIrPaso(1);
  };

  /* ── Helpers ─────────────────────────────────────── */
  function esc(s) {
    return (s == null ? '' : String(s))
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function fmtVal(v) {
    if (!v || v === '-') return '<span style="color:#d1d5db">—</span>';
    const n = parseFloat(String(v).replace(/,/g, ''));
    if (isNaN(n)) return esc(v);
    return '$' + n.toLocaleString('es-CO');
  }

  function fmtSem(v) {
    if (!v || v === '-') return '<span style="color:#d1d5db">—</span>';
    return `<span class="cex-semana">S${esc(String(v))}</span>`;
  }

  function estadoBadge(e) {
    const map = {
      'ACTIVA': ['cex-estado-activa', 'check-circle', 'Activa'],
      'NUEVA': ['cex-estado-nueva', 'plus-circle', 'Nueva'],
      'PENDIENTE': ['cex-estado-pend', 'hourglass-half', 'Pendiente'],
    };
    const [cls, icon, label] = map[e] || ['cex-estado-nueva', 'circle', e || '—'];
    return `<span class="${cls}"><i class="fas fa-${icon}"></i> ${label}</span>`;
  }

  function cexFechaHoy() {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  }

  function cexToast(msg, type = 'info') {
    if (typeof mostrarToast === 'function') { mostrarToast(msg, type); return; }
    const colors = { success: '#0f9d58', error: '#dc2626', warning: '#d97706', info: '#1a73e8' };
    const icons = { success: 'check-circle', error: 'times-circle', warning: 'exclamation-triangle', info: 'info-circle' };
    const t = document.createElement('div');
    t.className = 'cex-toast';
    t.style.background = colors[type] || colors.info;
    t.innerHTML = `<i class="fas fa-${icons[type] || 'info-circle'}"></i> ${esc(msg)}`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3800);
  }

})();