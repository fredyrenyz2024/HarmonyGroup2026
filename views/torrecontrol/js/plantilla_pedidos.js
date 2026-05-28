/**
 * plantilla_pedidos.js  –  Torre de Control / Crear Plantilla
 * ─────────────────────────────────────────────────────────────
 * Mejoras respecto a la versión anterior:
 *  • Tipo operación (CARGUE / DESCARGUE) por actividad
 *  • Validación centralizada con mensajes claros
 *  • Activación progresiva de campos al marcar el chk_detalle
 *  • Preview lateral con badge de tipo operación
 *  • Templates HTML  (<template>) en lugar de strings largos
 * ─────────────────────────────────────────────────────────────
 */
// (function () {
//   "use strict";
//   /* ═══════════════════════════════════════════════════════════
//    *  INIT GLOBAL
//    * ═══════════════════════════════════════════════════════════ */
//   window.VENTANA = null;

//   window.initScript = function (id) {
//     sessionStorage.clear();
//     window.VENTANA = id;

//     // Estado reactivo de la sesión
//     window.estado = {
//       contador: 0,               // posición actual de actividades seleccionadas
//       posiciones: {},            // { idActividad: posicion }
//       actividadesSeleccionadas: [], // [{ id, texto, tipoOperacion }]
//     };

//     feather.replace?.();          // re-inicializar íconos si feather está disponible

//     Listar_proveedores();
//     Listar_tipos_trazabilidad();
//     _initEventos();
//   };

//   /* ═══════════════════════════════════════════════════════════
//    *  EVENTOS PRINCIPALES
//    * ═══════════════════════════════════════════════════════════ */
//   function _initEventos() {
//     let contadorFilas = 1;

//     document.addEventListener('click', async (e) => {

//       /* ── Crear plantilla ─────────────────────────────────── */
//       if (e.target.closest('#btn-create-plantilla')) {
//         await _crearPlantilla();
//       }

//       /* ── Agregar fila visualizador ───────────────────────── */
//       if (e.target.closest('#btn-agregar-fila')) {
//         _agregarFilaVisualizador(contadorFilas++);
//       }

//       /* ── Eliminar fila visualizador ──────────────────────── */
//       if (e.target.closest('.btn-eliminar-fila')) {
//         e.target.closest('tr').remove();
//         _renumerarFilas();
//       }
//     });

//     /* ── Cambio de criterio de cálculo (habilitar depende) ── */
//     // document.addEventListener('change', (e) => {

//     //   // Activar/desactivar select de actividad dependiente si criterio = 4
//     //   if (e.target.matches('.select_detalle')) {
//     //     const Id = e.target.dataset.elementid;
//     //     const depSelect = document.getElementById('select_depende_' + Id);
//     //     depSelect.disabled = e.target.value !== '4';
//     //     if (e.target.value !== '4') depSelect.value = '';
//     //   }

//     //   // chk_detalle: activar/desactivar campos de la fila
//     //   if (e.target.matches('.chk_detalle')) {
//     //     _toggleFilaActividad(e.target);
//     //   }

//     //   // tipo_operacion: actualizar preview
//     //   if (e.target.matches('.tipo_operacion')) {
//     //     _actualizarTipoEnPreview(e.target.dataset.idactividad, e.target.value);
//     //   }
//     // });


//     document.addEventListener('change', (e) => {
//       // ── chk_trazabilidad (MOVIDO AQUÍ) ─────────────────────
//       if (e.target.matches('.chk_trazabilidad')) {
//         const valor = e.target.value;
//         const collapse = document.getElementById('collapse' + valor);
//         const bsCol = new bootstrap.Collapse(collapse, { toggle: false });

//         if (e.target.checked) {
//           bsCol.show();
//           _cargarDetalleParametro(valor);
//         } else {
//           bsCol.hide();
//           document.getElementById('list_detalle' + valor).innerHTML =
//             '<p class="text-muted small mb-0">Seleccione el parámetro para cargar sus actividades.</p>';
//         }
//       }

//       // ── select_detalle ──────────────────────────────────────
//       if (e.target.matches('.select_detalle')) {
//         const Id = e.target.dataset.elementid;
//         const depSelect = document.getElementById('select_depende_' + Id);
//         depSelect.disabled = e.target.value !== '4';
//         if (e.target.value !== '4') depSelect.value = '';
//       }

//       // ── chk_detalle ─────────────────────────────────────────
//       if (e.target.matches('.chk_detalle')) {
//         _toggleFilaActividad(e.target);
//       }

//       // ── tipo_operacion ───────────────────────────────────────
//       if (e.target.matches('.tipo_operacion')) {
//         _actualizarTipoEnPreview(e.target.dataset.idactividad, e.target.value);
//       }
//     });
//   }

//   /* ═══════════════════════════════════════════════════════════
//    *  TOGGLE FILA ACTIVIDAD (check / uncheck)
//    * ═══════════════════════════════════════════════════════════ */
//   function _toggleFilaActividad(checkbox) {
//     const Id = checkbox.dataset.idvalor;
//     const checked = checkbox.checked;

//     // Paneles que se muestran/ocultan
//     const paneles = ['tipo_op_wrap', 'form_asignacion', 'form_calculo', 'form_dependencia'];
//     paneles.forEach(p => {
//       const el = document.getElementById(p + Id);
//       if (el) el.style.display = checked ? '' : 'none';
//     });

//     const selectCalculo = document.getElementById('select_detalle' + Id);
//     const inputValor = document.getElementById('input_valor' + Id);
//     const selectMedida = document.getElementById('select_medida_tiempo' + Id);
//     const selectDepende = document.getElementById('select_depende_' + Id);
//     const inputCosto = document.getElementById('costo_sugerido' + Id);

//     if (checked) {
//       // Habilitar campos de cálculo
//       if (selectCalculo) selectCalculo.disabled = false;
//       if (inputValor) inputValor.disabled = false;
//       if (selectMedida) selectMedida.disabled = false;
//       if (inputCosto) inputCosto.disabled = false;

//       // Asignar posición
//       window.estado.contador++;
//       checkbox.dataset.idposicion = window.estado.contador;
//       window.estado.posiciones[Id] = window.estado.contador;

//       // Cargar usuarios en el select de responsable
//       _cargarUsuariosEnSelect('#slt_usuario_responsable' + Id, 'Seleccione Responsable');

//       // Cargar actividades ya seleccionadas en select de dependencia
//       _poblarSelectDependencia(Id);

//       // Agregar al preview lateral
//       const texto = checkbox.nextElementSibling?.textContent?.trim() || 'Actividad ' + Id;
//       _agregarPreview(Id, texto, window.estado.contador);

//       // Registrar en sesión interna
//       const yaExiste = window.estado.actividadesSeleccionadas.find(a => a.id === Id);
//       if (!yaExiste) {
//         window.estado.actividadesSeleccionadas.push({ id: Id, texto, tipoOperacion: '' });
//       }

//       // Actualizar selects de dependencias visibles
//       _refrescarTodosLosSelectsDependencia();

//       // Actualizar opciones de actividades en filas de visualizadores
//       _refrescarActividadesVisualizadores();

//     } else {
//       // Deshabilitar campos
//       [selectCalculo, inputValor, selectMedida, selectDepende, inputCosto].forEach(el => {
//         if (el) { el.disabled = true; el.value = ''; }
//       });

//       // Limpiar tipo operación
//       document.querySelectorAll(`input[name="tipo_operacion_${Id}"]`).forEach(r => r.checked = false);

//       // Quitar de posiciones
//       const pos = parseInt(checkbox.dataset.idposicion || 0);
//       delete window.estado.posiciones[Id];

//       // Reordenar posiciones
//       _reordenarPosiciones(Id, pos);

//       // Quitar del preview
//       _quitarPreview(Id);

//       // Quitar de sesión
//       window.estado.actividadesSeleccionadas =
//         window.estado.actividadesSeleccionadas.filter(a => a.id !== Id);

//       _refrescarTodosLosSelectsDependencia();
//       _refrescarActividadesVisualizadores();
//     }

//     _actualizarContadorPreview();
//   }

//   /* ═══════════════════════════════════════════════════════════
//    *  PREVIEW LATERAL
//    * ═══════════════════════════════════════════════════════════ */
//   function _agregarPreview(id, texto, posicion) {
//     const lista = document.getElementById('secondaryList');
//     const div = document.createElement('div');
//     div.className = 'preview-item';
//     div.id = 'preview_item_' + id;
//     div.innerHTML = `
//     <span class="preview-pos">${posicion}</span>
//     <span class="preview-texto flex-grow-1">${texto}</span>
//     <span class="preview-tipo" id="preview_tipo_${id}"></span>`;
//     lista.appendChild(div);
//   }

//   function _quitarPreview(id) {
//     document.getElementById('preview_item_' + id)?.remove();
//   }

//   function _actualizarTipoEnPreview(id, tipo) {
//     const span = document.getElementById('preview_tipo_' + id);
//     if (!span) return;
//     if (tipo === 'CARGUE') {
//       span.innerHTML = '<span class="badge-cargue">↑ Cargue</span>';
//     } else if (tipo === 'DESCARGUE') {
//       span.innerHTML = '<span class="badge-descargue">↓ Descargue</span>';
//     }

//     // Guardar en estado
//     const act = window.estado.actividadesSeleccionadas.find(a => a.id === id);
//     if (act) act.tipoOperacion = tipo;
//   }

//   function _actualizarContadorPreview() {
//     const contador = document.getElementById('posicion');
//     const n = document.getElementById('secondaryList').children.length;
//     if (contador) {
//       contador.textContent = n > 0 ? `Actividades seleccionadas: ${n}` : '';
//       contador.style.fontSize = '12px';
//     }
//   }

//   function _reordenarPosiciones(idEliminado, posEliminada) {
//     window.estado.contador = Math.max(0, window.estado.contador - 1);

//     // Reordenar items del preview
//     const lista = document.getElementById('secondaryList');
//     let nuevaPos = 1;
//     Array.from(lista.children).forEach(item => {
//       const posEl = item.querySelector('.preview-pos');
//       if (posEl) posEl.textContent = nuevaPos++;
//     });
//   }

//   /* ═══════════════════════════════════════════════════════════
//    *  SELECTS DE DEPENDENCIA
//    * ═══════════════════════════════════════════════════════════ */
//   function _poblarSelectDependencia(idActividad) {
//     const sel = document.getElementById('select_depende_' + idActividad);
//     if (!sel) return;
//     sel.innerHTML = '<option value="">Actividad que precede</option>';
//     window.estado.actividadesSeleccionadas
//       .filter(a => a.id !== idActividad)
//       .forEach(a => {
//         const opt = document.createElement('option');
//         opt.value = a.id;
//         opt.textContent = a.texto;
//         sel.appendChild(opt);
//       });
//     $(sel).trigger('change');
//   }

//   function _refrescarTodosLosSelectsDependencia() {
//     document.querySelectorAll('.select_depende_').forEach(sel => {
//       if (sel.disabled) return;
//       const idAct = sel.id.replace('select_depende_', '');
//       _poblarSelectDependencia(idAct);
//     });
//   }

//   /* ═══════════════════════════════════════════════════════════
//    *  FILAS DE VISUALIZADORES
//    * ═══════════════════════════════════════════════════════════ */
//   function _agregarFilaVisualizador(num) {
//     const tpl = document.getElementById('tpl-visualizador-row');
//     const fila = tpl.content.cloneNode(true).querySelector('tr');

//     fila.querySelector('.fila-num').textContent = num;

//     const tbody = document.getElementById('tbody_visualizadores');
//     tbody.appendChild(fila);

//     // Actividades seleccionadas
//     const selAct = fila.querySelector('.actividades_visualizar');
//     _poblarSelectActividades(selAct);
//     $(selAct).select2({ placeholder: 'Seleccione actividades', allowClear: true });

//     // Usuarios
//     const selUsu = fila.querySelector('.personas_visualizar');
//     _cargarUsuariosEnSelect(selUsu, 'Seleccione visualizador');
//   }

//   function _poblarSelectActividades(selectEl) {
//     selectEl.innerHTML = '<option value="">Seleccione una actividad</option>';
//     window.estado.actividadesSeleccionadas.forEach(a => {
//       const opt = document.createElement('option');
//       opt.value = a.id;
//       opt.textContent = a.texto;
//       selectEl.appendChild(opt);
//     });
//   }

//   function _refrescarActividadesVisualizadores() {
//     document.querySelectorAll('.actividades_visualizar').forEach(sel => {
//       const seleccionados = $(sel).val();
//       _poblarSelectActividades(sel);
//       $(sel).val(seleccionados).trigger('change');
//     });
//   }

//   function _renumerarFilas() {
//     document.querySelectorAll('#tbody_visualizadores tr').forEach((tr, i) => {
//       const num = tr.querySelector('.fila-num');
//       if (num) num.textContent = i + 1;
//     });
//   }

//   /* ═══════════════════════════════════════════════════════════
//    *  CARGAR USUARIOS EN UN SELECT
//    * ═══════════════════════════════════════════════════════════ */
//   async function _cargarUsuariosEnSelect(selector, placeholder) {
//     try {
//       const res = await fetch($('#base_url').val() + 'torrecontrol/Buscar_usuario', {
//         method: 'POST', cache: 'no-cache'
//       });
//       const data = await res.json();

//       const usuarios = data.data ?? data; // soporta {numero,data} y array directo
//       const sel = typeof selector === 'string'
//         ? document.querySelector(selector)
//         : selector;

//       if (!sel) return;
//       sel.innerHTML = `<option value="">Seleccione</option>`;
//       usuarios.forEach(u => {
//         const opt = document.createElement('option');
//         opt.value = u.id;
//         opt.textContent = u.nom_usuario;
//         sel.appendChild(opt);
//       });

//       $(sel).select2({ placeholder, allowClear: true });
//     } catch (err) {
//       console.error('Error al cargar usuarios:', err);
//     }
//   }

//   /* ═══════════════════════════════════════════════════════════
//    *  LISTAR PROVEEDORES
//    * ═══════════════════════════════════════════════════════════ */
//   async function Listar_proveedores() {
//     try {
//       const res = await fetch($('#base_url').val() + 'torrecontrol/Listar_proveedores_torre_control', {
//         method: 'POST', cache: 'no-cache'
//       });
//       const json = await res.json();
//       const data = json.data ?? json;

//       const sel = document.getElementById('slt_Proveedores');
//       sel.innerHTML = '<option value="" selected>Seleccione proveedor</option>';
//       data.forEach(p => {
//         const opt = document.createElement('option');
//         opt.value = p.id;
//         opt.textContent = p.razon_social;
//         sel.appendChild(opt);
//       });
//       $('#slt_Proveedores').select2({ placeholder: 'Seleccione proveedor', allowClear: true });
//     } catch (err) {
//       console.error('Error al cargar proveedores:', err);
//     }
//   }

//   /* ═══════════════════════════════════════════════════════════
//    *  LISTAR TIPOS DE TRAZABILIDAD (acordeón)
//    * ═══════════════════════════════════════════════════════════ */
//   async function Listar_tipos_trazabilidad() {
//     try {
//       const res = await fetch($('#base_url').val() + 'pedidos/Listar_tipos_Seguimiento', {
//         method: 'POST', cache: 'no-cache'
//       });
//       const data = await res.json();

//       let html = '';
//       data.forEach((el, idx) => {
//         html += `
//         <div class="accordion-item">
//           <h2 class="accordion-header d-flex align-items-center px-2" id="heading${idx}">
//             <input type="checkbox" class="chk_trazabilidad form-check-input me-2"
//                    id="chk_trazabilidad${idx}" name="chk_trazabilidad[]" value="${el.id}"
//                    data-bs-toggle="collapse" data-bs-target="#collapse${el.id}" style="transform:scale(0.9);">
//             <button class="accordion-button collapsed py-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${el.id}">
//               ${el.nombre_tipo}
//             </button>
//           </h2>
//           <div id="collapse${el.id}" class="accordion-collapse collapse"
//                aria-labelledby="heading${idx}" data-bs-parent="#accordionExample">
//             <div class="accordion-body py-2">
//               <div id="list_detalle${el.id}">
//                 <p class="text-muted small mb-0">Seleccione el parámetro para cargar sus actividades.</p>
//               </div>
//             </div>
//           </div>
//         </div>`;
//       });

//       document.getElementById('accordionExample').innerHTML = html;

//       // Evento para cargar detalle al marcar el checkbox
//       // document.addEventListener('change', async (e) => {
//       //   if (!e.target.matches('.chk_trazabilidad')) return;

//       //   const valor = e.target.value;
//       //   const collapse = document.getElementById('collapse' + valor);
//       //   const bsCol = new bootstrap.Collapse(collapse, { toggle: false });

//       //   if (e.target.checked) {
//       //     bsCol.show();
//       //     await _cargarDetalleParametro(valor);
//       //   } else {
//       //     bsCol.hide();
//       //     document.getElementById('list_detalle' + valor).innerHTML =
//       //       '<p class="text-muted small mb-0">Seleccione el parámetro para cargar sus actividades.</p>';
//       //   }
//       // });

//     } catch (err) {
//       document.getElementById('accordionExample').innerHTML =
//         '<div class="alert alert-danger m-2">Error al cargar parámetros de trazabilidad.</div>';
//       console.error(err);
//     }
//   }

//   /* ── Cargar detalle de un parámetro seleccionado ─────────── */
//   async function _cargarDetalleParametro(tipoProceso) {
//     const contenedor = document.getElementById('list_detalle' + tipoProceso);
//     contenedor.innerHTML = '<div class="text-muted small p-2"><span class="spinner-border spinner-border-sm me-1"></span> Cargando…</div>';

//     try {
//       const fd = new FormData();
//       fd.append('id', tipoProceso);
//       const res = await fetch($('#base_url').val() + 'pedidos/Listar_Opciones', {
//         method: 'POST', cache: 'no-cache', body: fd
//       });
//       const data = await res.json();

//       const tpl = document.getElementById('tpl-actividad-row');
//       let htmlDetalle = '';

//       data.forEach(el => {
//         // Clonar template y reemplazar placeholders
//         const tplHtml = tpl.innerHTML
//           .replaceAll('{{ID}}', el.id)
//           .replaceAll('{{NOMBRE}}', el.nombre_opcion)
//           .replaceAll('{{POSICION}}', '');
//         htmlDetalle += tplHtml;
//       });

//       contenedor.innerHTML = htmlDetalle || '<p class="text-muted small">Sin actividades disponibles.</p>';

//     } catch (err) {
//       contenedor.innerHTML = '<div class="alert alert-warning m-2 small">Error al cargar actividades del parámetro.</div>';
//       console.error(err);
//     }
//   }

//   /* ═══════════════════════════════════════════════════════════
//    *  VALIDACIÓN Y ENVÍO
//    * ═══════════════════════════════════════════════════════════ */
//   async function _crearPlantilla() {

//     // 1. Campos de cabecera
//     const proveedor = document.getElementById('slt_Proveedores').value;
//     const modalidad = document.getElementById('slt_Modalidad').value;
//     const nombrePlantilla = document.getElementById('nombre_plantilla').value.trim();

//     if (!proveedor) return _alerta('Debe seleccionar un proveedor.');
//     if (!modalidad) return _alerta('Debe seleccionar una modalidad.');
//     if (!nombrePlantilla) return _alerta('Debe indicar un nombre para la plantilla.');

//     // 2. Al menos un parámetro de trazabilidad
//     const chksTrazabilidad = Array.from(document.querySelectorAll('.chk_trazabilidad'));
//     const parametrosSeleccionados = chksTrazabilidad.filter(c => c.checked).map(c => c.value);
//     if (parametrosSeleccionados.length === 0) {
//       return _alerta('Debe seleccionar al menos un parámetro de trazabilidad.');
//     }

//     // 3. Al menos una actividad
//     const chksDetalle = Array.from(document.querySelectorAll('.chk_detalle'));
//     const actividadesMarcadas = chksDetalle.filter(c => c.checked);
//     if (actividadesMarcadas.length === 0) {
//       return _alerta('Debe seleccionar al menos una actividad en los parámetros de trazabilidad.');
//     }

//     // 4. Recolectar datos de actividades + validar tipo_operacion
//     const datos = [];
//     let errorTipo = null;

//     for (const chk of actividadesMarcadas) {
//       const Id = chk.dataset.idvalor;
//       const row = chk.closest('.actividad-row') || chk.closest(`[class*="trazabilidad_detalle_${Id}"]`);

//       // tipo_operacion OBLIGATORIO
//       const tipoOp = document.querySelector(`input[name="tipo_operacion_${Id}"]:checked`)?.value || '';
//       if (!tipoOp) {
//         const nombre = chk.nextElementSibling?.textContent?.trim() || 'Actividad ' + Id;
//         errorTipo = `La actividad "<strong>${nombre}</strong>" requiere indicar si es CARGUE o DESCARGUE.`;
//         break;
//       }

//       datos.push({
//         id: Id,
//         usuario_responsable: document.getElementById('slt_usuario_responsable' + Id)?.value || '',
//         select_detalle: document.getElementById('select_detalle' + Id)?.value || '',
//         Posicion_avtividad: chk.dataset.idposicion || '',
//         input_valor: document.getElementById('input_valor' + Id)?.value || '',
//         medida_tiempo: document.getElementById('select_medida_tiempo' + Id)?.value || '',
//         select_depende: document.getElementById('select_depende_' + Id)?.value || '',
//         costo_sugerido: document.getElementById('costo_sugerido' + Id)?.value || '',
//         tipo_operacion: tipoOp,
//       });
//     }

//     if (errorTipo) {
//       return Swal.fire({
//         title: 'Advertencia',
//         html: errorTipo,
//         icon: 'warning',
//         customClass: { popup: 'swal2-custom-font' },
//       });
//     }

//     // 5. Recolectar visualizadores
//     const visualizadores = [];
//     document.querySelectorAll('#tbody_visualizadores tr').forEach(tr => {
//       const usuarioId = tr.querySelector('.personas_visualizar')?.value;
//       const actividades = Array.from(
//         tr.querySelector('.actividades_visualizar')?.selectedOptions || []
//       ).map(o => o.value);

//       if (usuarioId && actividades.length > 0) {
//         visualizadores.push({ usuario_id: usuarioId, actividades });
//       }
//     });

//     // 6. Nota (parámetros de trazabilidad)
//     const nota = { tipo: parametrosSeleccionados };

//     // 7. Confirmar
//     const conf = await Swal.fire({
//       title: '¿Crear plantilla?',
//       html: `<strong>${nombrePlantilla}</strong><br>
//            <small>${actividadesMarcadas.length} actividades seleccionadas</small>`,
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#3B71CA',
//       cancelButtonColor: '#9FA6B2',
//       confirmButtonText: 'Crear',
//       cancelButtonText: 'Cancelar',
//       customClass: { popup: 'swal2-custom-font' },
//     });

//     if (!conf.isConfirmed) return;

//     // 8. Enviar al backend
//     try {
//       const fd = new FormData();
//       fd.append('proveedor_id', proveedor);
//       fd.append('modalidad', modalidad);
//       fd.append('nombre_plantilla', nombrePlantilla);
//       fd.append('nota', JSON.stringify(nota));
//       fd.append('datos', JSON.stringify(datos));
//       fd.append('visualizadores', JSON.stringify(visualizadores));

//       // const res = await fetch($('#base_url').val() + 'torrecontrol/Crear_plantillas', {
//       const res = await fetch($('#base_url_api').val() + 'Crear_plantillas', {
//         method: 'POST', headers: { "X-API-KEY": "nexos_nacional2026@*" }, cache: 'no-cache', body: fd
//       });
//       const resp = await res.json();

//       const icono = resp.numero === 200 ? 'success' : resp.numero === 305 ? 'warning' : 'error';
//       const titulo = resp.numero === 200 ? 'Éxito' : resp.numero === 305 ? 'Advertencia' : 'Error';

//       await Swal.fire({
//         title: titulo,
//         html: resp.mensaje,
//         icon: icono,
//         customClass: { popup: 'swal2-custom-font' },
//       });

//       if (resp.numero === 200) {
//         sessionStorage.clear();
//         location.reload(false);
//       }

//     } catch (err) {
//       Swal.fire({ title: 'Error', text: 'Error de conexión con el servidor.', icon: 'error' });
//       console.error(err);
//     }
//   }

//   /* ═══════════════════════════════════════════════════════════
//    *  UTILIDADES
//    * ═══════════════════════════════════════════════════════════ */
//   function _alerta(texto) {
//     Swal.fire({
//       title: 'Advertencia',
//       text: texto,
//       icon: 'warning',
//       draggable: true,
//       customClass: { popup: 'swal2-custom-font' },
//     });
//   }
// })();
/**
 * plantilla_pedidos.js  –  Torre de Control / Crear Plantilla
 * ─────────────────────────────────────────────────────────────
 * Mejoras respecto a la versión anterior:
 *  • Tipo operación (CARGUE / DESCARGUE) por actividad
 *  • Validación centralizada con mensajes claros
 *  • Activación progresiva de campos al marcar el chk_detalle
 *  • Preview lateral con badge de tipo operación
 *  • Templates HTML  (<template>) en lugar de strings largos
 * ─────────────────────────────────────────────────────────────
 * CORRECCIÓN: listeners nombrados con removeEventListener para
 * evitar acumulación al abrir la ventana múltiples veces sin
 * recargar la página (render dinámico / SPA).
 * ─────────────────────────────────────────────────────────────
 */
(function () {
  "use strict";

  /* ═══════════════════════════════════════════════════════════
   *  REFERENCIAS A HANDLERS (necesarias para removeEventListener)
   * ═══════════════════════════════════════════════════════════ */
  let _handlerClick = null;
  let _handlerChange = null;

  /* ═══════════════════════════════════════════════════════════
   *  INIT GLOBAL
   * ═══════════════════════════════════════════════════════════ */
  window.VENTANA = null;

  window.initScript = function (id) {
    sessionStorage.clear();
    window.VENTANA = id;

    // Estado reactivo de la sesión
    window.estado = {
      contador: 0,                  // posición actual de actividades seleccionadas
      posiciones: {},               // { idActividad: posicion }
      actividadesSeleccionadas: [], // [{ id, texto, tipoOperacion }]
    };

    feather.replace?.();            // re-inicializar íconos si feather está disponible

    Listar_proveedores();
    Listar_tipos_trazabilidad();
    _initEventos();
  };

  /* ═══════════════════════════════════════════════════════════
   *  EVENTOS PRINCIPALES
   *  — Se usan funciones nombradas guardadas en _handlerClick /
   *    _handlerChange para poder removerlas antes de re-registrar
   *    y así evitar listeners duplicados en render dinámico.
   * ═══════════════════════════════════════════════════════════ */
  function _initEventos() {
    let contadorFilas = 1;

    // ── Limpiar listeners anteriores si ya existían ──────────
    if (_handlerClick) document.removeEventListener('click', _handlerClick);
    if (_handlerChange) document.removeEventListener('change', _handlerChange);

    // ── Handler click ────────────────────────────────────────
    _handlerClick = async (e) => {

      /* ── Crear plantilla ─────────────────────────────────── */
      if (e.target.closest('#btn-create-plantilla')) {
        await _crearPlantilla();
      }

      /* ── Agregar fila visualizador ───────────────────────── */
      if (e.target.closest('#btn-agregar-fila')) {
        _agregarFilaVisualizador(contadorFilas++);
      }

      /* ── Eliminar fila visualizador ──────────────────────── */
      if (e.target.closest('.btn-eliminar-fila')) {
        e.target.closest('tr').remove();
        _renumerarFilas();
      }
    };

    // ── Handler change (ÚNICO — centraliza todos los casos) ──
    _handlerChange = async (e) => {

      // chk_trazabilidad: abrir/cerrar acordeón y cargar detalle
      // (antes estaba dentro de Listar_tipos_trazabilidad → se acumulaba)
      if (e.target.matches('.chk_trazabilidad')) {
        const valor = e.target.value;
        const collapse = document.getElementById('collapse' + valor);
        const bsCol = new bootstrap.Collapse(collapse, { toggle: false });

        if (e.target.checked) {
          bsCol.show();
          await _cargarDetalleParametro(valor);
        } else {
          bsCol.hide();
          document.getElementById('list_detalle' + valor).innerHTML =
            '<p class="text-muted small mb-0">Seleccione el parámetro para cargar sus actividades.</p>';
        }
      }

      // Activar/desactivar select de actividad dependiente si criterio = 4
      if (e.target.matches('.select_detalle')) {
        const Id = e.target.dataset.elementid;
        const depSelect = document.getElementById('select_depende_' + Id);
        depSelect.disabled = e.target.value !== '4';
        if (e.target.value !== '4') depSelect.value = '';
      }

      // chk_detalle: activar/desactivar campos de la fila
      if (e.target.matches('.chk_detalle')) {
        _toggleFilaActividad(e.target);
      }

      // tipo_operacion: actualizar preview
      if (e.target.matches('.tipo_operacion')) {
        _actualizarTipoEnPreview(e.target.dataset.idactividad, e.target.value);
      }
    };

    document.addEventListener('click', _handlerClick);
    document.addEventListener('change', _handlerChange);
  }

  /* ═══════════════════════════════════════════════════════════
   *  TOGGLE FILA ACTIVIDAD (check / uncheck)
   * ═══════════════════════════════════════════════════════════ */
  function _toggleFilaActividad(checkbox) {
    const Id = checkbox.dataset.idvalor;
    const checked = checkbox.checked;

    // Paneles que se muestran/ocultan
    const paneles = ['tipo_op_wrap', 'form_asignacion', 'form_calculo', 'form_dependencia'];
    paneles.forEach(p => {
      const el = document.getElementById(p + Id);
      if (el) el.style.display = checked ? '' : 'none';
    });

    const selectCalculo = document.getElementById('select_detalle' + Id);
    const inputValor = document.getElementById('input_valor' + Id);
    const selectMedida = document.getElementById('select_medida_tiempo' + Id);
    const selectDepende = document.getElementById('select_depende_' + Id);
    const inputCosto = document.getElementById('costo_sugerido' + Id);

    if (checked) {
      // Habilitar campos de cálculo
      if (selectCalculo) selectCalculo.disabled = false;
      if (inputValor) inputValor.disabled = false;
      if (selectMedida) selectMedida.disabled = false;
      if (inputCosto) inputCosto.disabled = false;

      // Asignar posición
      window.estado.contador++;
      checkbox.dataset.idposicion = window.estado.contador;
      window.estado.posiciones[Id] = window.estado.contador;

      // Cargar usuarios en el select de responsable
      _cargarUsuariosEnSelect('#slt_usuario_responsable' + Id, 'Seleccione Responsable');

      // Cargar actividades ya seleccionadas en select de dependencia
      _poblarSelectDependencia(Id);

      // Agregar al preview lateral
      const texto = checkbox.nextElementSibling?.textContent?.trim() || 'Actividad ' + Id;
      _agregarPreview(Id, texto, window.estado.contador);

      // Registrar en sesión interna
      const yaExiste = window.estado.actividadesSeleccionadas.find(a => a.id === Id);
      if (!yaExiste) {
        window.estado.actividadesSeleccionadas.push({ id: Id, texto, tipoOperacion: '' });
      }

      // Actualizar selects de dependencias visibles
      // _refrescarTodosLosSelectsDependencia();

      // Actualizar opciones de actividades en filas de visualizadores
      _refrescarActividadesVisualizadores();

    } else {
      // Deshabilitar campos
      // [selectCalculo, inputValor, selectMedida, selectDepende, inputCosto].forEach(el => {
      [selectCalculo, inputValor, selectMedida, inputCosto].forEach(el => {
        if (el) { el.disabled = true; el.value = ''; }
      });

      // Limpiar tipo operación
      document.querySelectorAll(`input[name="tipo_operacion_${Id}"]`).forEach(r => r.checked = false);

      // Quitar de posiciones
      const pos = parseInt(checkbox.dataset.idposicion || 0);
      delete window.estado.posiciones[Id];

      // Reordenar posiciones
      _reordenarPosiciones(Id, pos);

      // Quitar del preview
      _quitarPreview(Id);

      // Quitar de sesión
      window.estado.actividadesSeleccionadas =
        window.estado.actividadesSeleccionadas.filter(a => a.id !== Id);

      _refrescarTodosLosSelectsDependencia();
      _refrescarActividadesVisualizadores();
    }

    _actualizarContadorPreview();
  }

  /* ═══════════════════════════════════════════════════════════
   *  PREVIEW LATERAL
   * ═══════════════════════════════════════════════════════════ */
  function _agregarPreview(id, texto, posicion) {
    const lista = document.getElementById('secondaryList');
    const div = document.createElement('div');
    div.className = 'preview-item';
    div.id = 'preview_item_' + id;
    div.innerHTML = `
    <span class="preview-pos">${posicion}</span>
    <span class="preview-texto flex-grow-1">${texto}</span>
    <span class="preview-tipo" id="preview_tipo_${id}"></span>`;
    lista.appendChild(div);
  }

  function _quitarPreview(id) {
    document.getElementById('preview_item_' + id)?.remove();
  }

  function _actualizarTipoEnPreview(id, tipo) {
    const span = document.getElementById('preview_tipo_' + id);
    if (!span) return;
    if (tipo === 'CARGUE') {
      span.innerHTML = '<span class="badge-cargue">↑ Cargue</span>';
    } else if (tipo === 'DESCARGUE') {
      span.innerHTML = '<span class="badge-descargue">↓ Descargue</span>';
    }

    // Guardar en estado
    const act = window.estado.actividadesSeleccionadas.find(a => a.id === id);
    if (act) act.tipoOperacion = tipo;
  }

  function _actualizarContadorPreview() {
    const contador = document.getElementById('posicion');
    const n = document.getElementById('secondaryList').children.length;
    if (contador) {
      contador.textContent = n > 0 ? `Actividades seleccionadas: ${n}` : '';
      contador.style.fontSize = '12px';
    }
  }

  function _reordenarPosiciones(idEliminado, posEliminada) {
    window.estado.contador = Math.max(0, window.estado.contador - 1);

    // Reordenar items del preview
    const lista = document.getElementById('secondaryList');
    let nuevaPos = 1;
    Array.from(lista.children).forEach(item => {
      const posEl = item.querySelector('.preview-pos');
      if (posEl) posEl.textContent = nuevaPos++;
    });
  }

  /* ═══════════════════════════════════════════════════════════
   *  SELECTS DE DEPENDENCIA
   * ═══════════════════════════════════════════════════════════ */
  function _poblarSelectDependencia(idActividad) {
    const sel = document.getElementById('select_depende_' + idActividad);
    if (!sel) return;
    sel.innerHTML = '<option value="">Actividad que precede</option>';
    window.estado.actividadesSeleccionadas
      .filter(a => a.id !== idActividad)
      .forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.id;
        opt.textContent = a.texto;
        sel.appendChild(opt);
      });
    $(sel).trigger('change');
  }

  function _refrescarTodosLosSelectsDependencia() {
    document.querySelectorAll('.select_depende_').forEach(sel => {
      if (sel.disabled) return;
      const idAct = sel.id.replace('select_depende_', '');
      _poblarSelectDependencia(idAct);
    });
  }

  /* ═══════════════════════════════════════════════════════════
   *  FILAS DE VISUALIZADORES
   * ═══════════════════════════════════════════════════════════ */
  function _agregarFilaVisualizador(num) {
    const tpl = document.getElementById('tpl-visualizador-row');
    const fila = tpl.content.cloneNode(true).querySelector('tr');

    fila.querySelector('.fila-num').textContent = num;

    const tbody = document.getElementById('tbody_visualizadores');
    tbody.appendChild(fila);

    // Actividades seleccionadas
    const selAct = fila.querySelector('.actividades_visualizar');
    _poblarSelectActividades(selAct);
    $(selAct).select2({ placeholder: 'Seleccione actividades', allowClear: true });

    // Usuarios
    const selUsu = fila.querySelector('.personas_visualizar');
    _cargarUsuariosEnSelect(selUsu, 'Seleccione visualizador');
  }

  function _poblarSelectActividades(selectEl) {
    selectEl.innerHTML = '<option value="">Seleccione una actividad</option>';
    window.estado.actividadesSeleccionadas.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.id;
      opt.textContent = a.texto;
      selectEl.appendChild(opt);
    });
  }

  function _refrescarActividadesVisualizadores() {
    document.querySelectorAll('.actividades_visualizar').forEach(sel => {
      const seleccionados = $(sel).val();
      _poblarSelectActividades(sel);
      $(sel).val(seleccionados).trigger('change');
    });
  }

  function _renumerarFilas() {
    document.querySelectorAll('#tbody_visualizadores tr').forEach((tr, i) => {
      const num = tr.querySelector('.fila-num');
      if (num) num.textContent = i + 1;
    });
  }

  /* ═══════════════════════════════════════════════════════════
   *  CARGAR USUARIOS EN UN SELECT
   * ═══════════════════════════════════════════════════════════ */
  async function _cargarUsuariosEnSelect(selector, placeholder) {
    try {
      const res = await fetch($('#base_url').val() + 'torrecontrol/Buscar_usuario', {
        method: 'POST', cache: 'no-cache'
      });
      const data = await res.json();

      const usuarios = data.data ?? data; // soporta {numero,data} y array directo
      const sel = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

      if (!sel) return;
      sel.innerHTML = `<option value="">Seleccione</option>`;
      usuarios.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.id;
        opt.textContent = u.nom_usuario;
        sel.appendChild(opt);
      });

      $(sel).select2({ placeholder, allowClear: true });
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  }

  /* ═══════════════════════════════════════════════════════════
   *  LISTAR PROVEEDORES
   * ═══════════════════════════════════════════════════════════ */
  async function Listar_proveedores() {
    try {
      const res = await fetch($('#base_url').val() + 'torrecontrol/Listar_proveedores_torre_control', {
        method: 'POST', cache: 'no-cache'
      });
      const json = await res.json();
      const data = json.data ?? json;

      const sel = document.getElementById('slt_Proveedores');
      sel.innerHTML = '<option value="" selected>Seleccione proveedor</option>';
      data.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.razon_social;
        sel.appendChild(opt);
      });
      $('#slt_Proveedores').select2({ placeholder: 'Seleccione proveedor', allowClear: true });
    } catch (err) {
      console.error('Error al cargar proveedores:', err);
    }
  }

  /* ═══════════════════════════════════════════════════════════
   *  LISTAR TIPOS DE TRAZABILIDAD (acordeón)
   *  — Se elimina el document.addEventListener('change') que
   *    estaba aquí y se mueve al handler central de _initEventos.
   * ═══════════════════════════════════════════════════════════ */
  async function Listar_tipos_trazabilidad() {
    try {
      const res = await fetch($('#base_url').val() + 'pedidos/Listar_tipos_Seguimiento', {
        method: 'POST', cache: 'no-cache'
      });
      const data = await res.json();

      let html = '';
      data.forEach((el, idx) => {
        html += `
        <div class="accordion-item">
          <h2 class="accordion-header d-flex align-items-center px-2" id="heading${idx}">
            <input type="checkbox" class="chk_trazabilidad form-check-input me-2"
                   id="chk_trazabilidad${idx}" name="chk_trazabilidad[]" value="${el.id}"
                   data-bs-toggle="collapse" data-bs-target="#collapse${el.id}" style="transform:scale(0.9);">
            <button class="accordion-button collapsed py-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${el.id}">
              ${el.nombre_tipo}
            </button>
          </h2>
          <div id="collapse${el.id}" class="accordion-collapse collapse"
               aria-labelledby="heading${idx}" data-bs-parent="#accordionExample">
            <div class="accordion-body py-2">
              <div id="list_detalle${el.id}">
                <p class="text-muted small mb-0">Seleccione el parámetro para cargar sus actividades.</p>
              </div>
            </div>
          </div>
        </div>`;
      });

      document.getElementById('accordionExample').innerHTML = html;

      // ✅ LISTENER ELIMINADO DE AQUÍ — ahora vive en _handlerChange dentro de _initEventos()

    } catch (err) {
      document.getElementById('accordionExample').innerHTML =
        '<div class="alert alert-danger m-2">Error al cargar parámetros de trazabilidad.</div>';
      console.error(err);
    }
  }

  /* ── Cargar detalle de un parámetro seleccionado ─────────── */
  async function _cargarDetalleParametro(tipoProceso) {
    const contenedor = document.getElementById('list_detalle' + tipoProceso);
    contenedor.innerHTML = '<div class="text-muted small p-2"><span class="spinner-border spinner-border-sm me-1"></span> Cargando…</div>';

    try {
      const fd = new FormData();
      fd.append('id', tipoProceso);
      const res = await fetch($('#base_url').val() + 'pedidos/Listar_Opciones', {
        method: 'POST', cache: 'no-cache', body: fd
      });
      const data = await res.json();

      const tpl = document.getElementById('tpl-actividad-row');
      let htmlDetalle = '';

      data.forEach(el => {
        // Clonar template y reemplazar placeholders
        const tplHtml = tpl.innerHTML
          .replaceAll('{{ID}}', el.id)
          .replaceAll('{{NOMBRE}}', el.nombre_opcion)
          .replaceAll('{{POSICION}}', '');
        htmlDetalle += tplHtml;
      });

      contenedor.innerHTML = htmlDetalle || '<p class="text-muted small">Sin actividades disponibles.</p>';

    } catch (err) {
      contenedor.innerHTML = '<div class="alert alert-warning m-2 small">Error al cargar actividades del parámetro.</div>';
      console.error(err);
    }
  }

  /* ═══════════════════════════════════════════════════════════
   *  VALIDACIÓN Y ENVÍO
   * ═══════════════════════════════════════════════════════════ */
  async function _crearPlantilla() {

    // 1. Campos de cabecera
    const proveedor = document.getElementById('slt_Proveedores').value;
    const modalidad = document.getElementById('slt_Modalidad').value;
    const nombrePlantilla = document.getElementById('nombre_plantilla').value.trim();

    if (!proveedor) return _alerta('Debe seleccionar un proveedor.');
    if (!modalidad) return _alerta('Debe seleccionar una modalidad.');
    if (!nombrePlantilla) return _alerta('Debe indicar un nombre para la plantilla.');

    // 2. Al menos un parámetro de trazabilidad
    const chksTrazabilidad = Array.from(document.querySelectorAll('.chk_trazabilidad'));
    const parametrosSeleccionados = chksTrazabilidad.filter(c => c.checked).map(c => c.value);
    if (parametrosSeleccionados.length === 0) {
      return _alerta('Debe seleccionar al menos un parámetro de trazabilidad.');
    }

    // 3. Al menos una actividad
    const chksDetalle = Array.from(document.querySelectorAll('.chk_detalle'));
    const actividadesMarcadas = chksDetalle.filter(c => c.checked);
    if (actividadesMarcadas.length === 0) {
      return _alerta('Debe seleccionar al menos una actividad en los parámetros de trazabilidad.');
    }

    // 4. Recolectar datos de actividades + validar tipo_operacion
    const datos = [];
    let errorTipo = null;

    for (const chk of actividadesMarcadas) {
      const Id = chk.dataset.idvalor;

      // tipo_operacion OBLIGATORIO
      const tipoOp = document.querySelector(`input[name="tipo_operacion_${Id}"]:checked`)?.value || '';
      if (!tipoOp) {
        const nombre = chk.nextElementSibling?.textContent?.trim() || 'Actividad ' + Id;
        errorTipo = `La actividad "<strong>${nombre}</strong>" requiere indicar si es CARGUE o DESCARGUE.`;
        break;
      }

      datos.push({
        id: Id,
        usuario_responsable: document.getElementById('slt_usuario_responsable' + Id)?.value || '',
        select_detalle: document.getElementById('select_detalle' + Id)?.value || '',
        Posicion_avtividad: chk.dataset.idposicion || '',
        input_valor: document.getElementById('input_valor' + Id)?.value || '',
        medida_tiempo: document.getElementById('select_medida_tiempo' + Id)?.value || '',
        select_depende: document.getElementById('select_depende_' + Id)?.value || '',
        costo_sugerido: document.getElementById('costo_sugerido' + Id)?.value || '',
        tipo_operacion: tipoOp,
      });
    }

    if (errorTipo) {
      return Swal.fire({
        title: 'Advertencia',
        html: errorTipo,
        icon: 'warning',
        customClass: { popup: 'swal2-custom-font' },
      });
    }

    // 5. Recolectar visualizadores
    const visualizadores = [];
    document.querySelectorAll('#tbody_visualizadores tr').forEach(tr => {
      const usuarioId = tr.querySelector('.personas_visualizar')?.value;
      const actividades = Array.from(
        tr.querySelector('.actividades_visualizar')?.selectedOptions || []
      ).map(o => o.value);

      if (usuarioId && actividades.length > 0) {
        visualizadores.push({ usuario_id: usuarioId, actividades });
      }
    });

    // 6. Nota (parámetros de trazabilidad)
    const nota = { tipo: parametrosSeleccionados };

    // 7. Confirmar
    const conf = await Swal.fire({
      title: '¿Crear plantilla?',
      html: `<strong>${nombrePlantilla}</strong><br>
              <small>${actividadesMarcadas.length} actividades seleccionadas</small>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B71CA',
      cancelButtonColor: '#9FA6B2',
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'swal2-custom-font' },
    });

    if (!conf.isConfirmed) return;

    // 8. Enviar al backend
    try {
      const fd = new FormData();
      fd.append('proveedor_id', proveedor);
      fd.append('modalidad', modalidad);
      fd.append('nombre_plantilla', nombrePlantilla);
      fd.append('nota', JSON.stringify(nota));
      fd.append('datos', JSON.stringify(datos));
      fd.append('visualizadores', JSON.stringify(visualizadores));

      const res = await fetch($('#base_url_api').val() + 'Crear_plantillas', {
        method: 'POST',
        headers: { "X-API-KEY": "nexos_nacional2026@*" },
        cache: 'no-cache',
        body: fd
      });
      const resp = await res.json();

      const icono = resp.numero === 200 ? 'success' : resp.numero === 305 ? 'warning' : 'error';
      const titulo = resp.numero === 200 ? 'Éxito' : resp.numero === 305 ? 'Advertencia' : 'Error';

      await Swal.fire({
        title: titulo,
        html: resp.mensaje,
        icon: icono,
        customClass: { popup: 'swal2-custom-font' },
      });

      if (resp.numero === 200) {
        sessionStorage.clear();
        location.reload(false);
      }

    } catch (err) {
      Swal.fire({ title: 'Error', text: 'Error de conexión con el servidor.', icon: 'error' });
      console.error(err);
    }
  }

  /* ═══════════════════════════════════════════════════════════
   *  UTILIDADES
   * ═══════════════════════════════════════════════════════════ */
  function _alerta(texto) {
    Swal.fire({
      title: 'Advertencia',
      text: texto,
      icon: 'warning',
      draggable: true,
      customClass: { popup: 'swal2-custom-font' },
    });
  }

})();