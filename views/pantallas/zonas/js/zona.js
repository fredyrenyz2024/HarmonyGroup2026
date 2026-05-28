// // window.VENTANA = null; // Variable global para almacenar el ID

// // // sessionStorage.clear();
// // // Definir la función initScript globalmente
// // window.initScript = function (id) {
// //   window.VENTANA = id; // Asigna el ID recibido a la variable global

// //   document.addEventListener("click", async e => {
// //     if (e.target.matches(`#campo-${window.VENTANA}-nueva_zona`) || e.target.matches(`#campo-${window.VENTANA}-nueva_zona *`)) {
// //       e.preventDefault();

// //       const offcanvasEl = document.getElementById('offcanvasRight');

// //       // Reutiliza instancia si ya existe
// //       let offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);

// //       if (!offcanvas) {
// //         offcanvas = new bootstrap.Offcanvas(offcanvasEl);
// //       }

// //       offcanvas.show();
// //     }
// //   });
// // }


// /**
//  * zonas_despacho.js
//  * REQ Ítem 25 — Parametrización de Zonas de Despacho por Origen / Destino
//  *
//  * Patrón idéntico al resto del módulo (flete_nacional.js):
//  *   - IIFE con estado privado
//  *   - _apiFetch centralizado con X-API-KEY
//  *   - TomSelect / búsqueda de municipios con debounce
//  *   - SheetJS para import/export
//  *   - Mismos helpers de formateo
//  */

// (function () {
//   'use strict';

//   /* ══════════════════════════════════════════════════════════════
//    | ESTADO
//    ══════════════════════════════════════════════════════════════ */
//   const _S = {
//     baseUrlApi: '',
//     baseUrl: '',
//     empresaId: 1,
//     usuario: 'sistema',
//     tab: 'zonas',

//     // Datos en memoria
//     zonas: [],          // listado completo
//     zonasFiltradas: [],        // resultado de búsqueda local
//     zonaActual: null,        // zona seleccionada/en edición

//     // Municipios seleccionados en el form (objeto {codigo: {id, nombre, departamento}})
//     municipiosSeleccionados: {},

//     // Control debounce búsqueda municipio
//     _debounceTimer: null,

//     // Datos del Excel cargado (para importación masiva)
//     excelFilas: [],
//   };

//   /* ══════════════════════════════════════════════════════════════
//    | FETCH CENTRALIZADO
//    ══════════════════════════════════════════════════════════════ */
//   async function _apiFetch(url, { method = 'GET', data = null } = {}) {
//     const opts = {
//       method,
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'X-API-KEY': 'nexos_nacional2026@*',
//       },
//     };
//     if (data && method !== 'GET') opts.body = JSON.stringify(data);
//     const resp = await fetch(url, opts);
//     if (!resp.ok) {
//       const err = await resp.json().catch(() => ({}));
//       const error = new Error(err.message || `Error HTTP ${resp.status}`);
//       error.status = resp.status;
//       error.payload = err;
//       throw error;
//     }
//     return resp.json();
//   }

//   /* ══════════════════════════════════════════════════════════════
//    | INICIALIZACIÓN
//    ══════════════════════════════════════════════════════════════ */
//   window.initZonasDespacho = function () {
//     _S.baseUrlApi = document.getElementById('base_url_api')?.value ?? '';
//     _S.baseUrl = document.getElementById('base_url')?.value ?? '';
//     _S.empresaId = parseInt(document.getElementById('empresa_id')?.value ?? 1);
//     _S.usuario = document.getElementById('ssn_nombre')?.value ?? 'sistema';

//     zdCargarZonas();
//     _initEventos();
//   };

//   function _initEventos() {
//     // Auto-init al abrir el offcanvas
//     const el = document.getElementById('offcanvasZonasDespacho');
//     if (el && !el.dataset.zdInit) {
//       el.addEventListener('show.bs.offcanvas', () => {
//         _S.baseUrlApi = document.getElementById('base_url_api')?.value ?? '';
//         _S.baseUrl = document.getElementById('base_url')?.value ?? '';
//         _S.empresaId = parseInt(document.getElementById('empresa_id')?.value ?? 1);
//         _S.usuario = document.getElementById('ssn_nombre')?.value ?? 'sistema';
//         zdCargarZonas();
//       });
//       // Cerrar dropdown de municipios al click fuera
//       document.addEventListener('click', e => {
//         if (!e.target.closest('.zd-mun-search-wrap')) {
//           _cerrarDropdownMun();
//         }
//       });
//       el.dataset.zdInit = 'true';
//     }
//   }

//   /* ══════════════════════════════════════════════════════════════
//    | TABS
//    ══════════════════════════════════════════════════════════════ */
//   window.zdCambiarTab = function (tab) {
//     _S.tab = tab;
//     document.querySelectorAll('.zd-tab').forEach(t => t.classList.remove('active'));
//     document.getElementById(`zd-tab-${tab}`)?.classList.add('active');

//     document.getElementById('zd-vista-zonas').style.display = tab === 'zonas' ? 'flex' : 'none';
//     document.getElementById('zd-vista-masivo').style.display = tab === 'masivo' ? 'block' : 'none';
//   };

//   /* ══════════════════════════════════════════════════════════════
//    | LISTADO DE ZONAS
//    ══════════════════════════════════════════════════════════════ */
//   window.zdCargarZonas = async function () {
//     const listBody = document.getElementById('zd-list-body');
//     listBody.innerHTML = `<div class="zd-loading"><div class="zd-spinner"></div><span>Cargando...</span></div>`;

//     try {
//       const inclInact = document.getElementById('zd-mostrar-inactivas')?.checked;
//       const params = new URLSearchParams({
//         empresa_id: _S.empresaId,
//         per_page: 200,
//       });
//       if (inclInact) params.append('incluir_inactivas', '1');

//       const res = await _apiFetch(`${_S.baseUrlApi}zonas-despacho?${params}`);
//       _S.zonas = res.data ?? [];
//       _S.zonasFiltradas = _S.zonas;
//       _renderLista(_S.zonas);

//     } catch (err) {
//       listBody.innerHTML = `<div class="zd-empty">
//                 <i class="fas fa-exclamation-circle"></i>
//                 Error: ${_esc(err.message)}
//             </div>`;
//     }
//   };

//   function _renderLista(zonas) {
//     const listBody = document.getElementById('zd-list-body');
//     if (!zonas.length) {
//       listBody.innerHTML = `<div class="zd-empty">
//                 <i class="fas fa-layer-group"></i>
//                 No hay zonas registradas.<br>Crea la primera con el botón <strong>+ Nueva Zona</strong>
//             </div>`;
//       return;
//     }

//     listBody.innerHTML = zonas.map(z => {
//       const munActivos = (z.municipios ?? []).filter(m => m.estado_municipio === 'Activo');
//       const isActiva = z.activo === 'Activo';
//       const selClass = _S.zonaActual?.id === z.id ? 'active' : '';
//       const inactClass = !isActiva ? 'inactiva' : '';

//       return `<div class="zd-zona-item ${selClass} ${inactClass}"
//                         onclick="zdSeleccionarZona(${z.id})"
//                         data-zona-id="${z.id}">
//                 <div class="zd-zona-item-name">
//                     <span class="zd-estado-dot ${isActiva ? 'activo' : 'inactivo'}"></span>
//                     ${_esc(z.nombre_zona)}
//                     <span class="zd-mun-count ms-auto">${munActivos.length} mun.</span>
//                 </div>
//                 <div class="zd-zona-item-sub">
//                     ${z.descripcion_zona ? _esc(z.descripcion_zona.substring(0, 55)) + (z.descripcion_zona.length > 55 ? '...' : '') : '<em>Sin descripción</em>'}
//                 </div>
//             </div>`;
//     }).join('');
//   }

//   window.zdFiltrarLista = function (texto) {
//     const q = texto.toLowerCase().trim();
//     const filtradas = q
//       ? _S.zonas.filter(z =>
//         z.nombre_zona.toLowerCase().includes(q) ||
//         (z.descripcion_zona ?? '').toLowerCase().includes(q)
//       )
//       : _S.zonas;
//     _renderLista(filtradas);
//   };

//   /* ══════════════════════════════════════════════════════════════
//    | SELECCIONAR ZONA (modo lectura/edición)
//    ══════════════════════════════════════════════════════════════ */
//   window.zdSeleccionarZona = async function (id) {
//     // Highlight en lista
//     document.querySelectorAll('.zd-zona-item').forEach(el => {
//       el.classList.toggle('active', parseInt(el.dataset.zonaId) === id);
//     });

//     try {
//       const res = await _apiFetch(`${_S.baseUrlApi}zonas-despacho/${id}`);
//       _S.zonaActual = res.data;
//       _abrirFormulario(res.data, false);  // false = modo edición existente

//     } catch (err) {
//       _toast('Error al cargar la zona: ' + err.message, 'error');
//     }
//   };

//   /* ══════════════════════════════════════════════════════════════
//    | FORMULARIO — abrir / cancelar / reset
//    ══════════════════════════════════════════════════════════════ */
//   window.zdNuevaZona = function () {
//     _S.zonaActual = null;
//     // Deseleccionar lista
//     document.querySelectorAll('.zd-zona-item').forEach(el => el.classList.remove('active'));
//     _abrirFormulario(null, true);
//   };

//   function _abrirFormulario(zona, esNueva) {
//     const emptyEl = document.getElementById('zd-empty-state');
//     const formEl = document.getElementById('zd-form-container');
//     const tituloEl = document.getElementById('zd-form-titulo');
//     const btnInact = document.getElementById('zd-btn-inactivar');
//     const erroresEl = document.getElementById('zd-form-errores');

//     if (emptyEl) emptyEl.style.display = 'none';
//     if (formEl) { formEl.style.display = 'flex'; formEl.style.flexDirection = 'column'; }

//     // Título
//     if (tituloEl) tituloEl.innerHTML = esNueva
//       ? `<i class="fas fa-plus-circle" style="color:var(--zd-purple)"></i> Nueva Zona`
//       : `<i class="fas fa-edit" style="color:var(--zd-purple)"></i> Editar Zona`;

//     // Botón inactivar: solo en edición de zona activa
//     if (btnInact) btnInact.style.display = (!esNueva && zona?.activo === 'Activo') ? 'inline-flex' : 'none';

//     // Limpiar errores
//     if (erroresEl) { erroresEl.style.display = 'none'; erroresEl.innerHTML = ''; }

//     // Rellenar campos
//     _getEl('zd-zona-id').value = zona?.id ?? '';
//     _getEl('zd-nombre-zona').value = zona?.nombre_zona ?? '';
//     _getEl('zd-descripcion').value = zona?.descripcion_zona ?? '';
//     _getEl('zd-activo').value = zona?.activo ?? 'Activo';

//     // Municipios
//     _S.municipiosSeleccionados = {};
//     if (zona?.municipios) {
//       zona.municipios
//         .filter(m => m.estado_municipio === 'Activo')
//         .forEach(m => {
//           const munData = m.municipio;
//           _S.municipiosSeleccionados[m.municipio_id] = {
//             id: m.municipio_id,
//             nombre: munData?.municipio ?? m.municipio_id,
//             departamento: munData?.departamento ?? '',
//           };
//         });
//     }
//     _renderTags();
//   }

//   window.zdCancelar = function () {
//     _S.zonaActual = null;
//     _S.municipiosSeleccionados = {};
//     document.getElementById('zd-form-container').style.display = 'none';
//     document.getElementById('zd-empty-state').style.display = 'block';
//     document.querySelectorAll('.zd-zona-item').forEach(el => el.classList.remove('active'));
//   };

//   /* ══════════════════════════════════════════════════════════════
//    | BUSCAR MUNICIPIO — debounce + fetch
//    ══════════════════════════════════════════════════════════════ */
//   window.zdBuscarMunicipio = function (q) {
//     clearTimeout(_S._debounceTimer);
//     if (q.length < 2) { _cerrarDropdownMun(); return; }

//     _S._debounceTimer = setTimeout(async () => {
//       try {
//         const params = new URLSearchParams({ q, limit: 30 });
//         const res = await _apiFetch(
//           `${_S.baseUrlApi}tarifas-costos/generador/municipios?${params}`
//         );
//         _renderDropdownMun(res ?? []);
//       } catch {
//         // Fallback: buscar en el endpoint legado del módulo base
//         try {
//           const resp = await fetch(_S.baseUrl + 'serviciocliente/Consulta_Municipios', {
//             method: 'POST', cache: 'no-cache'
//           });
//           const todos = await resp.json();
//           const ql = q.toLowerCase();
//           const filtrados = todos.filter(m =>
//             m.municipio.toLowerCase().includes(ql) ||
//             m.depto.toLowerCase().includes(ql) ||
//             m.rndc_codigo_ciudad.includes(ql)
//           ).slice(0, 30);
//           _renderDropdownMun(filtrados.map(m => ({
//             id: m.rndc_codigo_ciudad,
//             nombre: m.municipio,
//             departamento: m.depto,
//           })));
//         } catch (_) { /* silent */ }
//       }
//     }, 280);
//   };

//   function _renderDropdownMun(resultados) {
//     const dd = document.getElementById('zd-mun-dropdown');
//     if (!dd) return;

//     if (!resultados.length) {
//       dd.innerHTML = `<div class="zd-mun-opt" style="color:var(--zd-gray);cursor:default">Sin resultados</div>`;
//       dd.classList.add('open');
//       return;
//     }

//     dd.innerHTML = resultados.map(m => {
//       const yaAgregado = !!_S.municipiosSeleccionados[m.id];
//       return `<div class="zd-mun-opt ${yaAgregado ? 'ya-agregado' : ''}"
//                         onclick="${yaAgregado ? '' : `zdAgregarMunicipio('${m.id}','${_esc(m.nombre)}','${_esc(m.departamento)}')`}">
//                 <div>
//                     <div class="mun-nombre">${_esc(m.nombre)}</div>
//                     <div class="mun-depto">${_esc(m.departamento)} · ${m.id}</div>
//                 </div>
//             </div>`;
//     }).join('');
//     dd.classList.add('open');
//   }

//   function _cerrarDropdownMun() {
//     const dd = document.getElementById('zd-mun-dropdown');
//     if (dd) { dd.classList.remove('open'); dd.innerHTML = ''; }
//   }

//   window.zdAgregarMunicipio = function (id, nombre, departamento) {
//     _S.municipiosSeleccionados[id] = { id, nombre, departamento };
//     _renderTags();
//     _cerrarDropdownMun();
//     _getEl('zd-mun-search').value = '';
//   };

//   window.zdRemoverMunicipio = function (id) {
//     delete _S.municipiosSeleccionados[id];
//     _renderTags();
//   };

//   function _renderTags() {
//     const wrap = document.getElementById('zd-mun-tags');
//     const contador = document.getElementById('zd-mun-contador');
//     const municipios = Object.values(_S.municipiosSeleccionados);

//     if (contador) contador.textContent = municipios.length;

//     if (!municipios.length) {
//       wrap.innerHTML = `<span class="zd-tags-empty">Agrega municipios desde el buscador</span>`;
//       return;
//     }

//     wrap.innerHTML = municipios.map(m => `
//             <span class="zd-tag">
//                 <i class="fas fa-map-pin" style="font-size:.65rem"></i>
//                 ${_esc(m.nombre)}
//                 <small style="opacity:.7">&nbsp;${_esc(m.departamento)}</small>
//                 <button class="zd-tag-remove" onclick="zdRemoverMunicipio('${m.id}')" title="Quitar">
//                     <i class="fas fa-times"></i>
//                 </button>
//             </span>
//         `).join('');
//   }

//   /* ══════════════════════════════════════════════════════════════
//    | GUARDAR (crear / actualizar)
//    ══════════════════════════════════════════════════════════════ */
//   window.zdGuardar = async function () {
//     const erroresEl = document.getElementById('zd-form-errores');
//     const btnSave = document.getElementById('zd-btn-guardar');

//     // Validaciones frontend
//     const nombre = _getEl('zd-nombre-zona').value.trim();
//     if (!nombre) {
//       _mostrarErrorInline('El nombre de la zona es requerido.', erroresEl);
//       _getEl('zd-nombre-zona').focus();
//       return;
//     }

//     const municipioIds = Object.keys(_S.municipiosSeleccionados);

//     const payload = {
//       empresa_id: _S.empresaId,
//       usuario: _S.usuario,
//       nombre_zona: nombre,
//       descripcion_zona: _getEl('zd-descripcion').value.trim() || null,
//       activo: _getEl('zd-activo').value,
//       municipios: municipioIds,
//     };

//     if (erroresEl) { erroresEl.style.display = 'none'; erroresEl.innerHTML = ''; }
//     if (btnSave) { btnSave.disabled = true; btnSave.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...'; }

//     try {
//       const zonaId = _getEl('zd-zona-id').value;
//       const esUpdate = !!zonaId;

//       const res = await _apiFetch(
//         `${_S.baseUrlApi}zonas-despacho${esUpdate ? '/' + zonaId : ''}`,
//         { method: esUpdate ? 'PUT' : 'POST', data: payload }
//       );

//       if (!res.success) throw new Error(res.message ?? 'Error al guardar');

//       _toast(res.message, 'success');
//       await zdCargarZonas();

//       // Re-seleccionar la zona guardada
//       const idGuardado = res.data?.id ?? parseInt(zonaId);
//       if (idGuardado) zdSeleccionarZona(idGuardado);

//     } catch (err) {
//       // Mostrar conflictos de municipios si los hay
//       if (err.payload?.conflictos) {
//         _mostrarConflictos(err.payload.conflictos, erroresEl);
//       } else {
//         _mostrarErrorInline(err.message, erroresEl);
//       }
//     } finally {
//       if (btnSave) {
//         btnSave.disabled = false;
//         btnSave.innerHTML = '<i class="fas fa-save"></i> Guardar Zona';
//       }
//     }
//   };

//   /* ══════════════════════════════════════════════════════════════
//    | INACTIVAR ZONA
//    ══════════════════════════════════════════════════════════════ */
//   window.zdInactivar = async function () {
//     const zonaId = _getEl('zd-zona-id').value;
//     const nombre = _getEl('zd-nombre-zona').value;
//     if (!zonaId) return;

//     const confirm = await _confirm(
//       `¿Inactivar la zona "${nombre}"?`,
//       'Se inactivarán también todos sus municipios. Esta acción puede revertirse desde la edición.'
//     );
//     if (!confirm) return;

//     try {
//       const res = await _apiFetch(`${_S.baseUrlApi}zonas-despacho/${zonaId}`, {
//         method: 'DELETE',
//         data: { usuario: _S.usuario },
//       });
//       if (!res.success) throw new Error(res.message);
//       _toast(res.message, 'success');
//       zdCancelar();
//       zdCargarZonas();
//     } catch (err) {
//       _toast('Error: ' + err.message, 'error');
//     }
//   };

//   /* ══════════════════════════════════════════════════════════════
//    | EXPORTAR EXCEL — SheetJS
//    ══════════════════════════════════════════════════════════════ */
//   window.zdExportarExcel = async function () {
//     try {
//       const params = new URLSearchParams({ empresa_id: _S.empresaId });
//       const res = await _apiFetch(`${_S.baseUrlApi}zonas-despacho/exportar?${params}`);
//       if (!res.success || !res.data?.length) {
//         _toast('No hay datos para exportar.', 'warning');
//         return;
//       }
//       if (typeof XLSX === 'undefined') { _toast('Librería XLSX no disponible.', 'error'); return; }

//       const ws = XLSX.utils.json_to_sheet(res.data);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Zonas Despacho');

//       // Autoajuste columnas
//       const cols = Object.keys(res.data[0]).map(k => ({
//         wch: Math.max(k.length, ...res.data.map(r => String(r[k] ?? '').length)) + 2
//       }));
//       ws['!cols'] = cols;

//       XLSX.writeFile(wb, `Zonas_Despacho_${new Date().toISOString().slice(0, 10)}.xlsx`);

//     } catch (err) {
//       _toast('Error al exportar: ' + err.message, 'error');
//     }
//   };

//   /* ══════════════════════════════════════════════════════════════
//    | DESCARGAR PLANTILLA
//    ══════════════════════════════════════════════════════════════ */
//   window.zdDescargarPlantilla = function () {
//     if (typeof XLSX === 'undefined') { _toast('Librería XLSX no disponible.', 'error'); return; }

//     const datos = [
//       { nombre_zona: 'Zona Norte', descripcion_zona: 'Ciudades del norte del país', municipio_id: '05001' },
//       { nombre_zona: 'Zona Norte', descripcion_zona: 'Ciudades del norte del país', municipio_id: '08001' },
//       { nombre_zona: 'Zona Centro', descripcion_zona: 'Ciudades centrales', municipio_id: '11001' },
//     ];

//     const ws = XLSX.utils.json_to_sheet(datos);
//     ws['!cols'] = [{ wch: 20 }, { wch: 35 }, { wch: 18 }];
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
//     XLSX.writeFile(wb, 'Plantilla_Zonas_Despacho.xlsx');
//   };

//   /* ══════════════════════════════════════════════════════════════
//    | CARGA MASIVA — Dropzone + SheetJS + API
//    ══════════════════════════════════════════════════════════════ */
//   window.zdDragOver = e => { e.preventDefault(); document.getElementById('zd-dz')?.classList.add('dragover'); };
//   window.zdDragLeave = () => document.getElementById('zd-dz')?.classList.remove('dragover');
//   window.zdDrop = e => {
//     e.preventDefault();
//     document.getElementById('zd-dz')?.classList.remove('dragover');
//     const file = e.dataTransfer.files[0];
//     if (file) _procesarArchivo(file);
//   };

//   window.zdArchivoSeleccionado = function (input) {
//     if (input.files[0]) _procesarArchivo(input.files[0]);
//   };

//   function _procesarArchivo(file) {
//     const ext = file.name.split('.').pop().toLowerCase();
//     if (!['xlsx', 'xls'].includes(ext)) {
//       _toast('Solo se permiten archivos .xlsx o .xls', 'warning');
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       _toast('El archivo supera los 5MB permitidos.', 'warning');
//       return;
//     }

//     // Mostrar preview del archivo
//     _getEl('zd-file-name').textContent = file.name;
//     _getEl('zd-file-size').textContent = _formatBytes(file.size);
//     document.getElementById('zd-file-preview').style.display = 'block';

//     if (typeof XLSX === 'undefined') { _toast('Librería XLSX no disponible.', 'error'); return; }

//     const reader = new FileReader();
//     reader.onload = e => {
//       const wb = XLSX.read(e.target.result, { type: 'array' });
//       const ws = wb.Sheets[wb.SheetNames[0]];
//       const filas = XLSX.utils.sheet_to_json(ws, { defval: '' });

//       _S.excelFilas = filas;

//       // Preview (primeras 5 filas)
//       const preview = document.getElementById('zd-excel-preview');
//       if (preview && filas.length) {
//         const cols = Object.keys(filas[0]);
//         const maxRows = Math.min(5, filas.length);
//         preview.innerHTML = `
//                     <div style="font-size:.73rem;color:var(--zd-gray);margin-bottom:4px">
//                         Vista previa (${filas.length} filas detectadas):
//                     </div>
//                     <div style="overflow-x:auto">
//                     <table class="zd-mun-table">
//                         <thead><tr>${cols.map(c => `<th>${_esc(c)}</th>`).join('')}</tr></thead>
//                         <tbody>
//                             ${filas.slice(0, maxRows).map(f =>
//           `<tr>${cols.map(c => `<td>${_esc(String(f[c] ?? ''))}</td>`).join('')}</tr>`
//         ).join('')}
//                             ${filas.length > maxRows ? `<tr><td colspan="${cols.length}" style="text-align:center;color:var(--zd-gray)">... y ${filas.length - maxRows} filas más</td></tr>` : ''}
//                         </tbody>
//                     </table>
//                     </div>`;
//       }

//       // Habilitar botón importar
//       const btn = document.getElementById('zd-btn-importar');
//       if (btn) btn.disabled = !filas.length;
//     };
//     reader.readAsArrayBuffer(file);
//   }

//   window.zdLimpiarArchivo = function () {
//     _S.excelFilas = [];
//     document.getElementById('zd-file-preview').style.display = 'none';
//     document.getElementById('zd-excel-preview').innerHTML = '';
//     document.getElementById('zd-file-input').value = '';
//     const btn = document.getElementById('zd-btn-importar');
//     if (btn) btn.disabled = true;
//     const res = document.getElementById('zd-import-resultado');
//     if (res) res.style.display = 'none';
//   };

//   window.zdImportar = async function () {
//     if (!_S.excelFilas.length) return;

//     const btn = document.getElementById('zd-btn-importar');
//     if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Importando...'; }

//     try {
//       const res = await _apiFetch(`${_S.baseUrlApi}zonas-despacho/importar`, {
//         method: 'POST',
//         data: {
//           empresa_id: _S.empresaId,
//           usuario: _S.usuario,
//           filas: _S.excelFilas.map(f => ({
//             nombre_zona: String(f['nombre_zona'] ?? f['Zona'] ?? '').trim(),
//             descripcion_zona: String(f['descripcion_zona'] ?? f['Descripción'] ?? '').trim() || null,
//             municipio_id: String(f['municipio_id'] ?? f['Código Municipio'] ?? '').trim(),
//           })).filter(f => f.nombre_zona && f.municipio_id),
//         },
//       });

//       // Mostrar resultado
//       const resEl = document.getElementById('zd-import-resultado');
//       const bodyEl = document.getElementById('zd-import-resultado-body');

//       if (resEl && bodyEl) {
//         const { creadas, actualizadas, errores } = res.resumen ?? {};
//         bodyEl.innerHTML = `
//                     <div class="row g-2 mb-2">
//                         <div class="col-6">
//                             <div style="background:var(--zd-green-lt);border:1px solid #86efac;border-radius:8px;padding:8px 12px;text-align:center">
//                                 <div style="font-size:1.5rem;font-weight:800;color:var(--zd-green)">${creadas ?? 0}</div>
//                                 <div style="font-size:.73rem;color:var(--zd-green)">Zonas creadas</div>
//                             </div>
//                         </div>
//                         <div class="col-6">
//                             <div style="background:var(--zd-blue-lt);border:1px solid #93c5fd;border-radius:8px;padding:8px 12px;text-align:center">
//                                 <div style="font-size:1.5rem;font-weight:800;color:var(--zd-blue)">${actualizadas ?? 0}</div>
//                                 <div style="font-size:.73rem;color:var(--zd-blue)">Zonas actualizadas</div>
//                             </div>
//                         </div>
//                     </div>
//                     ${errores?.length ? `
//                     <div class="zd-conflicto-box">
//                         <strong><i class="fas fa-exclamation-triangle me-1"></i>${errores.length} conflicto(s):</strong>
//                         <ul>${errores.map(e => `<li>${_esc(e.zona)}: ${_esc(e.mensaje)}</li>`).join('')}</ul>
//                     </div>` : ''}
//                 `;
//         resEl.style.display = 'block';
//       }

//       _toast(res.message, errores?.length ? 'warning' : 'success');

//       // Recargar listado
//       if ((res.resumen?.creadas ?? 0) + (res.resumen?.actualizadas ?? 0) > 0) {
//         zdCargarZonas();
//       }

//     } catch (err) {
//       _toast('Error en importación: ' + err.message, 'error');
//     } finally {
//       if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-upload"></i> Importar Zonas'; }
//     }
//   };

//   /* ══════════════════════════════════════════════════════════════
//    | HELPERS PRIVADOS
//    ══════════════════════════════════════════════════════════════ */
//   function _mostrarErrorInline(msg, el) {
//     if (!el) return;
//     el.innerHTML = `<div class="zd-conflicto-box"><i class="fas fa-exclamation-circle me-1"></i>${_esc(msg)}</div>`;
//     el.style.display = 'block';
//   }

//   function _mostrarConflictos(conflictos, el) {
//     if (!el) return;
//     const items = conflictos.map(c => `<li>${_esc(c.mensaje)}</li>`).join('');
//     el.innerHTML = `<div class="zd-conflicto-box">
//             <strong><i class="fas fa-exclamation-triangle me-1"></i>Conflictos de municipios:</strong>
//             <ul>${items}</ul>
//             <small>Quita esos municipios del listado o asígnalos a la otra zona primero.</small>
//         </div>`;
//     el.style.display = 'block';
//   }

//   function _getEl(id) { return document.getElementById(id); }

//   function _esc(str) {
//     return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
//   }

//   function _formatBytes(bytes) {
//     if (bytes < 1024) return bytes + ' B';
//     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
//     return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
//   }

//   async function _confirm(titulo, texto) {
//     if (typeof Swal !== 'undefined') {
//       const r = await Swal.fire({
//         title: titulo, text: texto,
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: 'Sí, continuar',
//         cancelButtonText: 'Cancelar',
//         confirmButtonColor: '#dc2626',
//       });
//       return r.isConfirmed;
//     }
//     return window.confirm(`${titulo}\n${texto}`);
//   }

//   function _toast(msg, type = 'info') {
//     if (typeof mostrarToast === 'function') { mostrarToast(msg, type); return; }
//     const colors = { success: '#0f9d58', error: '#dc2626', warning: '#d97706', info: '#7c3aed' };
//     const t = document.createElement('div');
//     t.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;
//             background:${colors[type] ?? colors.info};color:#fff;
//             padding:12px 20px;border-radius:10px;font-size:.83rem;font-weight:600;
//             box-shadow:0 4px 16px rgba(0,0,0,.18);max-width:360px`;
//     t.textContent = msg;
//     document.body.appendChild(t);
//     setTimeout(() => t.remove(), 3500);
//   }

//   /* ══════════════════════════════════════════════════════════════
//    | EXPOSICIÓN PÚBLICA
//    ══════════════════════════════════════════════════════════════ */
//   window.initZonasDespacho = window.initZonasDespacho;
//   window.zdCambiarTab = window.zdCambiarTab;
//   window.zdCargarZonas = window.zdCargarZonas;
//   window.zdNuevaZona = window.zdNuevaZona;
//   window.zdSeleccionarZona = window.zdSeleccionarZona;
//   window.zdCancelar = window.zdCancelar;
//   window.zdGuardar = window.zdGuardar;
//   window.zdInactivar = window.zdInactivar;
//   window.zdBuscarMunicipio = window.zdBuscarMunicipio;
//   window.zdAgregarMunicipio = window.zdAgregarMunicipio;
//   window.zdRemoverMunicipio = window.zdRemoverMunicipio;
//   window.zdFiltrarLista = window.zdFiltrarLista;
//   window.zdExportarExcel = window.zdExportarExcel;
//   window.zdDescargarPlantilla = window.zdDescargarPlantilla;
//   window.zdArchivoSeleccionado = window.zdArchivoSeleccionado;
//   window.zdLimpiarArchivo = window.zdLimpiarArchivo;
//   window.zdImportar = window.zdImportar;
//   window.zdDragOver = window.zdDragOver;
//   window.zdDragLeave = window.zdDragLeave;
//   window.zdDrop = window.zdDrop;

// })();


/**
 * zonas_despacho_tabla.js
 * ──────────────────────────────────────────────────────────────
 * Maneja la vista de tabla principal de ZONAS (pantalla propia,
 * no offcanvas). Tabla: #tarifa_flete_body  en #ordenes_manifiesto_export
 *
 * Funcionalidades:
 *   1. Carga y renderiza las zonas al iniciar la página
 *   2. Botón "Exportar a Excel" con SheetJS
 *   3. Click en fila → abre offcanvasRight (formulario edición)
 *   4. Botón "Nueva Zona" → limpia y abre el formulario
 *   5. Guardar / Actualizar zona + municipios
 *   6. Cambiar estado Activo/Inactivo desde la tabla
 */

(function () {
  'use strict';

  /* ── Config ─────────────────────────────────────────────── */
  const CFG = {
    API_KEY: 'nexos_nacional2026@*',
    get baseUrl() { return document.getElementById('base_url')?.value ?? ''; },
    get apiUrl() { return document.getElementById('base_url_api')?.value ?? ''; },
    get empresa() { return parseInt(document.getElementById('empresa_id')?.value ?? 1); },
    get usuario() { return document.getElementById('ssn_nombre')?.value ?? 'sistema'; },
  };

  /* ── Estado ─────────────────────────────────────────────── */
  let _zonas = [];
  let _zonaEditId = null;       // null = nueva zona
  let _municipiosCatalogo = [];   // cache del catálogo de municipios
  let _munsSeleccionados = {};   // { codigo: {id,nombre,departamento} }

  /* ════════════════════════════════════════════════════════
   | INIT — punto de entrada
   ════════════════════════════════════════════════════════ */
  function init() {
    _cargarZonas();
    _initEventos();
    _cargarCatalogoMunicipios();   // carga en background para el formulario
  }

  /* ════════════════════════════════════════════════════════
   | FETCH CENTRALIZADO
   ════════════════════════════════════════════════════════ */
  async function _api(url, { method = 'GET', data = null } = {}) {
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-KEY': CFG.API_KEY,
      },
    };
    if (data && method !== 'GET') opts.body = JSON.stringify(data);
    const resp = await fetch(url, opts);
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw Object.assign(new Error(err.message || `Error HTTP ${resp.status}`), { payload: err });
    }
    return resp.json();
  }

  /* ════════════════════════════════════════════════════════
   | 1. CARGAR Y RENDERIZAR TABLA
   ════════════════════════════════════════════════════════ */
  async function _cargarZonas() {
    const tbody = document.getElementById('tarifa_flete_body');
    if (!tbody) return;

    tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4">
                    <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Cargando zonas...
                </td>
            </tr>`;

    try {
      const params = new URLSearchParams({
        empresa_id: CFG.empresa,
        per_page: 200,
        incluir_inactivas: 1,
      });

      const res = await _api(`${CFG.apiUrl}zonas-despacho?${params}`);
      _zonas = res.data ?? [];
      _renderTabla(_zonas);

    } catch (err) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-danger py-4">
                        <i class="fas fa-exclamation-circle me-1"></i>
                        ${_esc(err.message)}
                        <br><button class="btn btn-sm btn-outline-primary mt-2"
                            onclick="window._zdRecargar()">
                            <i class="fas fa-sync-alt me-1"></i>Reintentar
                        </button>
                    </td>
                </tr>`;
    }
  }

  function _renderTabla(zonas) {
    const tbody = document.getElementById('tarifa_flete_body');
    if (!tbody) return;

    if (!zonas.length) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted py-5">
                        <i class="fas fa-layer-group d-block mb-2" style="font-size:1.8rem;opacity:.3"></i>
                        No hay zonas registradas.<br>
                        <button class="btn btn-sm btn-primary mt-2"
                            onclick="window._zdNuevaZona()">
                            <i class="fas fa-plus me-1"></i>Crear primera zona
                        </button>
                    </td>
                </tr>`;
      return;
    }

    tbody.innerHTML = zonas.map(z => {
      const munsActivos = (z.municipios ?? []).filter(m => m.estado_municipio === 'Activo');
      const esActiva = z.activo === 'Activo';
      const estadoBadge = esActiva
        ? `<span class="badge bg-success">Activo</span>`
        : `<span class="badge bg-secondary">Inactivo</span>`;

      const fechaFmt = z.fecha
        ? new Date(z.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: '2-digit' })
        : '—';

      return `
            <tr style="cursor:pointer"
                onclick="_zdEditarFila(${z.id})"
                title="Clic para editar">
                <td class="text-start">
                    <div class="fw-bold" style="font-size:.82rem">${_esc(z.nombre_zona)}</div>
                    <div style="font-size:.72rem;color:#888">
                        <i class="fas fa-map-pin me-1" style="color:#7c3aed"></i>
                        ${munsActivos.length} municipio${munsActivos.length !== 1 ? 's' : ''}
                    </div>
                </td>
                <td class="text-start" style="font-size:.78rem;color:#555;max-width:260px">
                    ${z.descripcion_zona ? _esc(z.descripcion_zona) : '<em class="text-muted">—</em>'}
                </td>
                <td style="font-size:.78rem;white-space:nowrap">${fechaFmt}</td>
                <td>
                    ${estadoBadge}
                    <button class="btn btn-link btn-sm py-0 px-1 ms-1"
                        onclick="event.stopPropagation();_zdEditarFila(${z.id})"
                        title="Editar">
                        <i class="fas fa-edit text-primary"></i>
                    </button>
                    <button class="btn btn-link btn-sm py-0 px-1"
                        onclick="event.stopPropagation();_zdToggleEstado(${z.id},'${z.activo}')"
                        title="${esActiva ? 'Inactivar' : 'Activar'}">
                        <i class="fas fa-${esActiva ? 'ban text-danger' : 'check-circle text-success'}"></i>
                    </button>
                </td>
            </tr>`;
    }).join('');
  }

  /* ════════════════════════════════════════════════════════
   | 2. EXPORTAR EXCEL
   ════════════════════════════════════════════════════════ */
  async function _exportarExcel() {
    if (typeof XLSX === 'undefined') {
      _toast('La librería de exportación (SheetJS) no está disponible.', 'warning');
      return;
    }

    try {
      const params = new URLSearchParams({ empresa_id: CFG.empresa });
      const res = await _api(`${CFG.apiUrl}zonas-despacho/exportar?${params}`);

      if (!res.data?.length) { _toast('No hay datos para exportar.', 'info'); return; }

      const ws = XLSX.utils.json_to_sheet(res.data);
      // Autoajuste columnas
      ws['!cols'] = Object.keys(res.data[0]).map(k => ({
        wch: Math.max(k.length, ...res.data.map(r => String(r[k] ?? '').length)) + 2
      }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Zonas Despacho');
      XLSX.writeFile(wb, `Zonas_Despacho_${_hoy()}.xlsx`);
      _toast('Archivo descargado correctamente.', 'success');

    } catch (err) {
      _toast('Error al exportar: ' + err.message, 'error');
    }
  }

  /* ════════════════════════════════════════════════════════
   | 3. ABRIR FORMULARIO (offcanvasRight)
   ════════════════════════════════════════════════════════ */
  function _abrirOffcanvas(zona = null) {
    _zonaEditId = zona?.id ?? null;
    _munsSeleccionados = {};

    // Rellenar campos
    const v = id => document.getElementById(id);
    if (v('zona_edit_id')) v('zona_edit_id').value = zona?.id ?? '';
    if (v('nombre_zona')) v('nombre_zona').value = zona?.nombre_zona ?? '';
    if (v('descripcion')) v('descripcion').value = zona?.descripcion_zona ?? '';
    if (v('estado_zona')) v('estado_zona').value = zona?.activo ?? 'Activo';
    if (v('fecha')) v('fecha').value = _hoy();

    // Municipios ya asignados
    if (zona?.municipios) {
      zona.municipios
        .filter(m => m.estado_municipio === 'Activo')
        .forEach(m => {
          const mun = m.municipio;
          _munsSeleccionados[m.municipio_id] = {
            id: m.municipio_id,
            nombre: mun?.municipio ?? m.municipio_id,
            departamento: mun?.departamento ?? '',
          };
        });
    }

    _renderTagsMunicipios();

    // Actualizar título del offcanvas
    const titulo = document.getElementById('offcanvasRightLabel');
    if (titulo) titulo.textContent = zona ? `Editar zona: ${zona.nombre_zona}` : 'Crear zona despacho';

    // Botón inactivar
    const btnInact = document.getElementById('btn_inactivar_zona');
    if (btnInact) btnInact.style.display = (zona && zona.activo === 'Activo') ? 'inline-flex' : 'none';

    // Abrir offcanvas con Bootstrap
    const offEl = document.getElementById('offcanvasRight');
    if (offEl) {
      const bsOff = bootstrap.Offcanvas.getOrCreateInstance(offEl);
      bsOff.show();
    }
  }

  function _zdNuevaZona() {
    _abrirOffcanvas(null);
  }

  async function _zdEditarFila(id) {
    try {
      const res = await _api(`${CFG.apiUrl}zonas-despacho/${id}`);
      _abrirOffcanvas(res.data);
    } catch (err) {
      _toast('Error al cargar la zona: ' + err.message, 'error');
    }
  }

  /* ════════════════════════════════════════════════════════
   | 4. GUARDAR ZONA
   ════════════════════════════════════════════════════════ */
  async function _guardarZona() {
    const nombre = document.getElementById('nombre_zona')?.value?.trim();
    if (!nombre) {
      _toast('El nombre de la zona es obligatorio.', 'warning');
      document.getElementById('nombre_zona')?.focus();
      return;
    }

    const btnSave = document.getElementById('btn_guardar_zona');
    if (btnSave) { btnSave.disabled = true; btnSave.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Guardando...'; }

    const payload = {
      empresa_id: CFG.empresa,
      usuario: CFG.usuario,
      nombre_zona: nombre,
      descripcion_zona: document.getElementById('descripcion')?.value?.trim() || null,
      activo: document.getElementById('estado_zona')?.value ?? 'Activo',
      municipios: Object.keys(_munsSeleccionados),
    };

    try {
      const esUpdate = !!_zonaEditId;
      const res = await _api(
        `${CFG.apiUrl}zonas-despacho${esUpdate ? '/' + _zonaEditId : ''}`,
        { method: esUpdate ? 'PUT' : 'POST', data: payload }
      );

      if (!res.success) throw new Error(res.message ?? 'Error al guardar');

      _toast(res.message, 'success');

      // Cerrar offcanvas
      const offEl = document.getElementById('offcanvasRight');
      if (offEl) bootstrap.Offcanvas.getOrCreateInstance(offEl).hide();

      // Recargar tabla
      await _cargarZonas();

    } catch (err) {
      // Mostrar conflictos de municipios
      const sms = document.querySelector('.sms');
      if (sms) {
        const conflictos = err.payload?.conflictos;
        if (conflictos?.length) {
          sms.innerHTML = `<div class="alert alert-danger py-2" style="font-size:.8rem">
                        <strong><i class="fas fa-exclamation-triangle me-1"></i>Conflictos:</strong>
                        <ul class="mb-0 mt-1">${conflictos.map(c => `<li>${_esc(c.mensaje)}</li>`).join('')}</ul>
                    </div>`;
        } else {
          sms.innerHTML = `<div class="alert alert-danger py-2" style="font-size:.8rem">
                        <i class="fas fa-times-circle me-1"></i>${_esc(err.message)}
                    </div>`;
        }
      } else {
        _toast(err.message, 'error');
      }
    } finally {
      if (btnSave) { btnSave.disabled = false; btnSave.innerHTML = '<i class="fas fa-save me-1"></i>Guardar'; }
    }
  }

  /* ════════════════════════════════════════════════════════
   | 5. TOGGLE ESTADO (Activo ↔ Inactivo)
   ════════════════════════════════════════════════════════ */
  async function _zdToggleEstado(id, estadoActual) {
    const zona = _zonas.find(z => z.id === id);
    const nombre = zona?.nombre_zona ?? `Zona #${id}`;
    const accion = estadoActual === 'Activo' ? 'inactivar' : 'activar';

    if (!confirm(`¿Desea ${accion} la zona "${nombre}"?`)) return;

    try {
      if (estadoActual === 'Activo') {
        // Inactivar: DELETE endpoint
        const res = await _api(`${CFG.apiUrl}zonas-despacho/${id}`, {
          method: 'DELETE',
          data: { usuario: CFG.usuario },
        });
        if (!res.success) throw new Error(res.message);
        _toast(res.message, 'success');
      } else {
        // Reactivar: PUT con activo=Activo
        const res = await _api(`${CFG.apiUrl}zonas-despacho/${id}`, {
          method: 'PUT',
          data: {
            empresa_id: CFG.empresa,
            usuario: CFG.usuario,
            nombre_zona: nombre,
            activo: 'Activo',
            municipios: (zona?.municipios ?? [])
              .filter(m => m.estado_municipio === 'Activo')
              .map(m => m.municipio_id),
          },
        });
        if (!res.success) throw new Error(res.message);
        _toast(res.message, 'success');
      }
      await _cargarZonas();

    } catch (err) {
      _toast('Error: ' + err.message, 'error');
    }
  }

  /* ════════════════════════════════════════════════════════
   | 6. BUSCADOR DE MUNICIPIOS (para el formulario)
   ════════════════════════════════════════════════════════ */
  let _debounceTimer = null;

  function _buscarMunicipio(q) {
    clearTimeout(_debounceTimer);
    if (q.length < 2) { _cerrarDropdownMun(); return; }

    _debounceTimer = setTimeout(() => {
      const ql = q.toLowerCase();
      const filtrados = _municipiosCatalogo
        .filter(m => {
          const nombre = String(m.municipio ?? '').toLowerCase();
          const depto = String(m.depto ?? m.departamento ?? '').toLowerCase();
          const codigo = String(m.rndc_codigo_ciudad ?? '').toLowerCase();

          return (
            nombre.includes(ql) ||
            depto.includes(ql) ||
            codigo.includes(ql)
          );
        })
        .slice(0, 30);
      // console.log("🚀 ~ _buscarMunicipio ~ filtrados:", filtrados)
      // const filtrados = _municipiosCatalogo
      //   .filter(m =>
      //     m.municipio.toLowerCase().includes(ql) ||
      //     (m.depto ?? m.departamento ?? '').toLowerCase().includes(ql) ||
      //     m.rndc_codigo_ciudad.includes(ql)
      //   )
      //   .slice(0, 30);

      _renderDropdownMun(filtrados);
    }, 220);
  }

  async function _cargarCatalogoMunicipios() {
    try {
      const resp = await fetch(CFG.baseUrl + 'serviciocliente/Consulta_Municipios', {
        method: 'POST', cache: 'force-cache',
      });
      _municipiosCatalogo = await resp.json();
    } catch { /* silent — se reintenta al escribir */ }
  }

  function _renderDropdownMun(lista) {
    const dd = document.getElementById('drop_municipios');
    if (!dd) return;

    if (!lista.length) {
      dd.innerHTML = `<div class="dropdown-item text-muted" style="font-size:.8rem;cursor:default">Sin resultados</div>`;
    } else {
      dd.innerHTML = lista.map(m => {
        const cod = m.rndc_codigo_ciudad;
        const yaAgregado = !!_munsSeleccionados[cod];
        const depto = m.depto ?? m.departamento ?? '';
        return `<button type="button"
                    class="dropdown-item ${yaAgregado ? 'text-muted pe-none' : ''}"
                    style="font-size:.8rem;padding:6px 12px"
                    onclick="_zdAgregarMun('${cod}','${_esc(m.municipio)}','${_esc(depto)}')">
                    <strong>${_esc(m.municipio)}</strong>
                    <small class="text-muted ms-1">${_esc(depto)}</small>
                    ${yaAgregado ? '<span class="badge bg-secondary ms-1" style="font-size:.6rem">Ya agregado</span>' : ''}
                </button>`;
      }).join('');
    }

    dd.classList.add('show');
    dd.style.display = 'block';
  }

  function _cerrarDropdownMun() {
    const dd = document.getElementById('drop_municipios');
    if (dd) { dd.classList.remove('show'); dd.style.display = 'none'; }
  }

  function _zdAgregarMun(id, nombre, departamento) {
    _munsSeleccionados[id] = { id, nombre, departamento };
    _renderTagsMunicipios();
    _cerrarDropdownMun();
    const inp = document.getElementById('buscar_municipio');
    if (inp) inp.value = '';
  }

  function _zdQuitarMun(id) {
    delete _munsSeleccionados[id];
    _renderTagsMunicipios();
  }

  function _renderTagsMunicipios() {
    const wrap = document.getElementById('tags_municipios');
    const contador = document.getElementById('mun_contador');
    const lista = Object.values(_munsSeleccionados);

    if (contador) contador.textContent = lista.length;

    if (!wrap) return;

    if (!lista.length) {
      wrap.innerHTML = `<span class="text-muted" style="font-size:.75rem">Agrega municipios desde el buscador</span>`;
      return;
    }

    wrap.innerHTML = lista.map(m => `
            <span class="badge rounded-pill d-inline-flex align-items-center gap-1 me-1 mb-1"
                style="background:#f3e8ff;color:#7c3aed;border:1px solid #ddd6fe;font-size:.75rem;padding:4px 10px;font-weight:600">
                <i class="fas fa-map-pin" style="font-size:.65rem"></i>
                ${_esc(m.nombre)}
                <small style="opacity:.7">${_esc(m.departamento)}</small>
                <button type="button"
                    onclick="_zdQuitarMun('${m.id}')"
                    class="btn-close btn-close-sm ms-1"
                    style="font-size:.5rem;filter:none;opacity:.7"></button>
            </span>
        `).join('');
  }

  /* ════════════════════════════════════════════════════════
   | EVENTOS GLOBALES
   ════════════════════════════════════════════════════════ */
  function _initEventos() {
    // Botón "Exportar a Excel" (ya existe en el HTML)
    document.getElementById('exportar_excel')?.addEventListener('click', e => {
      e.preventDefault();
      _exportarExcel();
    });

    // Cerrar dropdown municipios al click fuera
    document.addEventListener('click', e => {
      if (!e.target.closest('#buscar_municipio') && !e.target.closest('#drop_municipios')) {
        _cerrarDropdownMun();
      }
    });
  }

  /* ════════════════════════════════════════════════════════
   | HELPERS
   ════════════════════════════════════════════════════════ */
  function _esc(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function _hoy() {
    return new Date().toISOString().slice(0, 10);
  }

  function _toast(msg, type = 'info') {
    if (typeof mostrarToast === 'function') { mostrarToast(msg, type); return; }
    const colors = { success: '#0f9d58', error: '#dc2626', warning: '#d97706', info: '#1a73e8' };
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;
            background:${colors[type] ?? colors.info};color:#fff;
            padding:11px 18px;border-radius:10px;font-size:.82rem;font-weight:600;
            box-shadow:0 4px 16px rgba(0,0,0,.2);max-width:340px;word-break:break-word`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  /* ════════════════════════════════════════════════════════
   | EXPOSICIÓN PÚBLICA
   ════════════════════════════════════════════════════════ */
  window._zdRecargar = _cargarZonas;
  window._zdNuevaZona = _zdNuevaZona;
  window._zdEditarFila = _zdEditarFila;
  window._zdToggleEstado = _zdToggleEstado;
  window._zdGuardarZona = _guardarZona;
  window._zdBuscarMun = _buscarMunicipio;
  window._zdAgregarMun = _zdAgregarMun;
  window._zdQuitarMun = _zdQuitarMun;

  /* ── Auto-init al cargar el DOM ─────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();