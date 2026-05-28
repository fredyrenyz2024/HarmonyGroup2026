// 'use strict';
// (function () {

//     /* ══════════════════════════════════════════════════════
//      *  CONFIG
//      * ══════════════════════════════════════════════════════ */
//     const baseUrl = () => document.getElementById('base_url_api').value;

//     const API = {
//         municipios: () => baseUrl() + 'municipios/listar',
//         clientesInternos: () => baseUrl() + 'clientes/listar',
//         clientes: {
//             listar: () => baseUrl() + 'clientes-ext/listar',
//             guardar: () => baseUrl() + 'clientes-ext/guardar',
//             obtener: () => baseUrl() + 'clientes-ext/obtener',
//             actualizar: () => baseUrl() + 'clientes-ext/actualizar',
//             cambiarEstado: () => baseUrl() + 'clientes-ext/cambiar-estado',
//         },
//         remitentes: {
//             listar: () => baseUrl() + 'remitentes/listar',
//             guardar: () => baseUrl() + 'remitentes/guardar',
//             obtener: () => baseUrl() + 'remitentes/obtener',
//             actualizar: () => baseUrl() + 'remitentes/actualizar',
//             cambiarEstado: () => baseUrl() + 'remitentes/cambiar-estado',
//         },
//         horarios: {
//             listar: () => baseUrl() + 'remitentes/horarios/listar',
//             guardar: () => baseUrl() + 'remitentes/horarios/guardar',
//             eliminar: () => baseUrl() + 'remitentes/horarios/eliminar',
//         },
//         geocercas: {
//             listar: () => baseUrl() + 'geocercas/listar',
//             guardar: () => baseUrl() + 'geocercas/guardar',
//             obtener: () => baseUrl() + 'geocercas/obtener',
//             actualizar: () => baseUrl() + 'geocercas/actualizar',
//             cambiarEstado: () => baseUrl() + 'geocercas/cambiar-estado',
//         },
//         consulta: {
//             remitentes: () => baseUrl() + 'consulta/remitentes',
//         },
//     };

//     /* ══════════════════════════════════════════════════════
//      *  HELPERS
//      * ══════════════════════════════════════════════════════ */

//     async function post(url, params = {}) {
//         const fd = new FormData();
//         Object.entries(params).forEach(([k, v]) => fd.append(k, v ?? ''));
//         const res = await fetch(url, {
//             method: 'POST',
//             headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
//             body: fd,
//         });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return await res.json();
//     }

//     function mostrarAlerta(alertId, mensaje, tipo = 'error') {
//         const el = document.getElementById(alertId);
//         if (!el) return;
//         el.className = `form-alert ${tipo}`;
//         el.textContent = mensaje;
//         el.style.display = 'block';
//         if (tipo === 'success') setTimeout(() => { el.style.display = 'none'; }, 3000);
//     }

//     function ocultarAlerta(alertId) {
//         const el = document.getElementById(alertId);
//         if (el) el.style.display = 'none';
//     }

//     function toggleForm(formId, mostrar, titulo = null) {
//         const card = document.getElementById(formId);
//         if (!card) return;
//         card.classList.toggle('visible', mostrar);
//         if (titulo) {
//             const span = card.querySelector('[id$="-titulo"]');
//             if (span) span.textContent = titulo;
//         }
//     }

//     function actualizarBadge(badgeId, total) {
//         const el = document.getElementById(badgeId);
//         if (el) el.textContent = `${total} registro${total !== 1 ? 's' : ''}`;
//     }

//     function badgeEstado(estado) {
//         return estado === 'activo'
//             ? `<span class="badge-st bs-green"><i class="bi bi-circle-fill" style="font-size:6px"></i> Activo</span>`
//             : `<span class="badge-st bs-slate"><i class="bi bi-circle" style="font-size:6px"></i> Inactivo</span>`;
//     }

//     function formatFecha(fecha) {
//         return fecha ? fecha.split('T')[0] : '';
//     }

//     /* ══════════════════════════════════════════════════════
//      *  TOM SELECT — helper seguro (destroy + reinit)
//      * ══════════════════════════════════════════════════════ */
//     const tsInstances = {};

//     function initTomSelect(target, opciones = {}) {
//         const el = typeof target === 'string' ? document.querySelector(target) : target;
//         if (!el) return null;
//         if (el.tomselect) el.tomselect.destroy();
//         return new TomSelect(el, {
//             create: false,
//             allowEmptyOption: true,
//             sortField: { field: 'text', direction: 'asc' },
//             onInitialize() { this.control.classList.add('f-control'); },
//             ...opciones,
//         });
//     }

//     /* ══════════════════════════════════════════════════════
//      *  DATATABLES — helper reutilizable con filtros
//      * ══════════════════════════════════════════════════════ */
//     function inicializarDataTable(tableSelector, opciones = {}) {
//         const $tabla = $(tableSelector);
//         if (!$tabla.length) return null;

//         if ($.fn.DataTable.isDataTable(tableSelector)) {
//             $tabla.DataTable().destroy();
//         }
//         $tabla.find('thead tr.filters').remove();

//         const $headerRow = $tabla.find('thead tr:first');
//         const $filterRow = $headerRow.clone(true).addClass('filters');
//         $filterRow.find('th').html('');
//         $filterRow.appendTo($tabla.find('thead'));

//         const dt = $tabla.DataTable({
//             orderCellsTop: true,
//             fixedHeader: true,
//             language: { url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
//             ...opciones,
//             initComplete() {
//                 const api = this.api();
//                 api.columns().eq(0).each(function (colIdx) {
//                     const cell = $tabla.find('.filters th').get(colIdx);
//                     if (!cell) return;
//                     if (colIdx === 0) { $(cell).html(''); return; }
//                     const title = $(api.column(colIdx).header()).text();
//                     $(cell).html(
//                         `<input type="text" class="w-100" placeholder="${title}" style="font-size:11px;height:24px;">`
//                     );
//                     $('input', cell).on('keyup change', function (e) {
//                         e.stopPropagation();
//                         if (api.column(colIdx).search() !== this.value)
//                             api.column(colIdx).search(this.value).draw();
//                     });
//                 });
//                 if (opciones.initComplete) opciones.initComplete.call(this);
//             },
//         });

//         return dt;
//     }

//     /* ══════════════════════════════════════════════════════
//      *  EXPORTAR EXCEL con SheetJS
//      *  Exporta la tabla DataTable actualmente visible
//      * ══════════════════════════════════════════════════════ */
//     function exportarExcel(tableSelector, nombreArchivo) {
//         const $tabla = $(tableSelector);
//         if (!$tabla.length) return;

//         // Cabeceras (primera fila del thead, sin la fila de filtros)
//         const headers = [];
//         $tabla.find('thead tr:first th').each(function () {
//             const txt = $(this).text().trim();
//             if (txt) headers.push(txt);
//         });
//         // Última columna (Acciones) no se exporta
//         headers.pop();

//         // Filas visibles
//         const rows = [];
//         $tabla.DataTable().rows({ search: 'applied' }).nodes().each(function () {
//             const cells = [];
//             $(this).find('td').each(function (i) {
//                 if (i >= headers.length) return; // omitir columna acciones
//                 // Limpiar HTML: tomar solo texto
//                 cells.push($(this).text().trim());
//             });
//             rows.push(cells);
//         });

//         const wsData = [headers, ...rows];
//         const wb = XLSX.utils.book_new();
//         const ws = XLSX.utils.aoa_to_sheet(wsData);

//         // Ancho automático de columnas
//         const colWidths = headers.map((h, i) => {
//             const maxLen = Math.max(h.length, ...rows.map(r => (r[i] || '').length));
//             return { wch: Math.min(maxLen + 2, 40) };
//         });
//         ws['!cols'] = colWidths;

//         XLSX.utils.book_append_sheet(wb, ws, 'Datos');
//         XLSX.writeFile(wb, `${nombreArchivo}_${new Date().toISOString().slice(0, 10)}.xlsx`);
//     }

//     /* ══════════════════════════════════════════════════════
//      *  TABS
//      * ══════════════════════════════════════════════════════ */
//     function initTabs() {
//         document.querySelectorAll('.mod-tab').forEach(btn => {
//             btn.addEventListener('click', () => {
//                 document.querySelectorAll('.mod-tab').forEach(t => t.classList.remove('active'));
//                 document.querySelectorAll('.mod-panel').forEach(p => p.classList.remove('active'));
//                 btn.classList.add('active');
//                 const panel = document.getElementById(btn.dataset.tab);
//                 if (panel) panel.classList.add('active');

//                 // Cuando entra al tab Consultar, cargar selects si están vacíos
//                 if (btn.dataset.tab === 'tab-consultar') {
//                     inicializarConsulta();
//                 }
//             });
//         });
//     }

//     /* ══════════════════════════════════════════════════════
//      *  MUNICIPIOS
//      * ══════════════════════════════════════════════════════ */
//     let municipiosCache = [];

//     async function cargarMunicipios() {
//         if (!municipiosCache.length) {
//             try {
//                 const json = await post(API.municipios());
//                 if (json.numero !== 200) throw new Error(json.mensaje);
//                 municipiosCache = json.data ?? [];
//             } catch (e) { console.error('cargarMunicipios:', e); return; }
//         }
//         llenarSelectsMunicipios();
//     }

//     function llenarSelectsMunicipios() {
//         const opts = municipiosCache
//             .map(m => `<option value="${m.municipio}">${m.municipio} — ${m.depto}</option>`)
//             .join('');
//         ['cli-ciudad', 'rem-ciudad'].forEach(id => {
//             const sel = document.getElementById(id);
//             if (!sel) return;
//             sel.innerHTML = '<option value="">— Seleccione municipio —</option>' + opts;
//             tsInstances[id] = initTomSelect(sel, { placeholder: 'Seleccione un municipio...' });
//         });
//     }

//     /* ══════════════════════════════════════════════════════
//      *  CLIENTES INTERNOS
//      * ══════════════════════════════════════════════════════ */
//     let clientesInternosCache = [];

//     async function cargarClientesInternos() {
//         if (!clientesInternosCache.length) {
//             try {
//                 const json = await post(API.clientesInternos());
//                 if (json.numero !== 200) throw new Error(json.mensaje);
//                 clientesInternosCache = json.data ?? [];
//             } catch (e) { console.error('cargarClientesInternos:', e); return; }
//         }
//         llenarSelectsClientesInternos();
//     }

//     function llenarSelectsClientesInternos() {
//         // Select del formulario de clientes externos
//         const selForm = document.getElementById('cli-cliente');
//         if (selForm) {
//             const opts = clientesInternosCache
//                 .map(m => `<option value="${m.id}">${m.nombre}</option>`).join('');
//             selForm.innerHTML = '<option value="">— Seleccione cliente —</option>' + opts;
//             tsInstances['cli-cliente'] = initTomSelect(selForm, { placeholder: 'Seleccione un cliente...' });
//         }
//         // Select del tab Consultar
//         const selCns = document.getElementById('cns-cliente-interno');
//         if (selCns) {
//             const opts = clientesInternosCache
//                 .map(m => `<option value="${m.id}">${m.nombre}</option>`).join('');
//             selCns.innerHTML = '<option value="">— Todos —</option>' + opts;
//             tsInstances['cns-cliente-interno'] = initTomSelect(selCns, {
//                 placeholder: 'Seleccione cliente interno...',
//                 onChange(value) { onCnsClienteInternoChange(value); },
//             });
//         }
//     }

//     /* ══════════════════════════════════════════════════════
//      *  CLIENTES EXTERNOS
//      * ══════════════════════════════════════════════════════ */
//     const cli = { modoEdicion: false, datos: [] };

//     // async function listarClientes() {
//     //     try {
//     //         const json = await post(API.clientes.listar());
//     //         if (json.numero !== 200) throw new Error(json.mensaje);
//     //         cli.datos = json.data ?? [];
//     //         // renderClientes(cli.datos);
//     //         renderClientes(json.data);
//     //         // actualizarBadge('badge-clientes', cli.datos.length);
//     //         actualizarBadge('badge-clientes', json.data.length);
//     //         llenarSelectClientes(json.data);
//     //         // llenarSelectClientes(cli.datos);
//     //     } catch (e) { console.error('listarClientes:', e); }
//     // }

//     // function renderClientes(lista) {
//     //     const tbody = document.getElementById('tbody-clientes');
//     //     if (!lista.length) {
//     //         tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state">
//     //             <div class="es-icon"><i class="bi bi-building"></i></div>
//     //             <div class="es-title">Sin clientes registrados</div>
//     //             <div class="es-sub">Crea el primer cliente externo</div>
//     //         </div></td></tr>`;
//     //         return;
//     //     }
//     //     tbody.innerHTML = '';
//     //     tbody.innerHTML = lista.map((r, i) => `
//     //         <tr>
//     //             <td>${i + 1}</td>
//     //             <td>${r.cliente_interno?.nombre ?? '-'}</td>
//     //             <td>${r.nit_cliente ?? '-'}</td>
//     //             <td><strong>${r.razon_social ?? '-'}</strong></td>
//     //             <td>${r.ciudad ?? '-'}</td>
//     //             <td>${r.direccion ?? '-'}</td>
//     //             <td>${r.hora_inicio ?? '-'}</td>
//     //             <td>${r.hora_fin ?? '-'}</td>
//     //             <td>${badgeEstado(r.estado)}</td>
//     //             <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
//     //             <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
//     //             <td><div class="d-flex gap-1">
//     //                 <button class="action-btn ab-edit" title="Editar"
//     //                     data-accion="editar-cliente" data-id="${r.id}">
//     //                     <i class="bi bi-pencil-fill"></i>
//     //                 </button>
//     //                 <button class="action-btn ab-toggle"
//     //                     title="${r.estado === 'activo' ? 'Desactivar' : 'Activar'}"
//     //                     data-accion="toggle-cliente" data-id="${r.id}" data-estado="${r.estado}">
//     //                     <i class="bi bi-${r.estado === 'activo' ? 'toggle-on' : 'toggle-off'}"></i>
//     //                 </button>
//     //             </div></td>
//     //         </tr>`).join('');

//     //     setTimeout(() => inicializarDataTable('#tbl-clientes-externos'), 100);
//     // }


//     async function listarClientes() {
//         try {
//             // 1. Limpiamos visualmente la tabla antes de la petición (opcional, da feedback al usuario)
//             // document.getElementById('tbody-clientes').innerHTML = 'Cargando...';

//             const json = await post(API.clientes.listar());
//             if (json.numero !== 200) throw new Error(json.mensaje);

//             // 2. Actualizamos el objeto global
//             cli.datos = json.data ?? [];

//             // 3. Renderizamos usando el objeto global
//             renderClientes(cli.datos);

//             actualizarBadge('badge-clientes', cli.datos.length);
//             llenarSelectClientes(cli.datos);

//         } catch (e) {
//             console.error('listarClientes:', e);
//         }
//     }

//     function renderClientes(lista) {
//         const tbody = document.getElementById('tbody-clientes');
//         const tablaId = '#tbl-clientes-externos';

//         // --- PASO CLAVE: Destruir DataTable si ya existe ---
//         if ($.fn.DataTable.isDataTable(tablaId)) {
//             $(tablaId).DataTable().destroy();
//         }

//         if (!lista || !lista.length) {
//             tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state">
//             <div class="es-icon"><i class="bi bi-building"></i></div>
//             <div class="es-title">Sin clientes registrados</div>
//             <div class="es-sub">Crea el primer cliente externo</div>
//         </div></td></tr>`;
//             return;
//         }

//         // Renderizado de filas
//         tbody.innerHTML = lista.map((r, i) => `
//         <tr>
//             <td>${i + 1}</td>
//             <td>${r.cliente_interno?.nombre ?? '-'}</td>
//             <td>${r.nit_cliente ?? '-'}</td>
//             <td><strong>${r.razon_social ?? '-'}</strong></td>
//             <td>${r.ciudad ?? '-'}</td>
//             <td>${r.direccion ?? '-'}</td>
//             <td>${r.hora_inicio ?? '-'}</td>
//             <td>${r.hora_fin ?? '-'}</td>
//             <td>${badgeEstado(r.estado)}</td>
//             <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
//             <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
//             <td><div class="d-flex gap-1">
//                 <button class="action-btn ab-edit" title="Editar" data-accion="editar-cliente" data-id="${r.id}">
//                     <i class="bi bi-pencil-fill"></i>
//                 </button>
//                 <button class="action-btn ab-toggle" title="${r.estado === 'activo' ? 'Desactivar' : 'Activar'}" 
//                     data-accion="toggle-cliente" data-id="${r.id}" data-estado="${r.estado}">
//                     <i class="bi bi-${r.estado === 'activo' ? 'toggle-on' : 'toggle-off'}"></i>
//                 </button>
//             </div></td>
//         </tr>`).join('');

//         // --- RE-INICIALIZAR ---
//         // Usamos el setTimeout para asegurar que el DOM se haya actualizado
//         setTimeout(() => {
//             if (typeof inicializarDataTable === "function") {
//                 inicializarDataTable(tablaId);
//             }
//         }, 50);
//     }

//     async function guardarCliente() {
//         ocultarAlerta('alert-clientes');
//         const id = document.getElementById('cli-id').value;
//         const cliCliente = document.getElementById('cli-cliente').value.trim();
//         const nit = document.getElementById('cli-nit').value.trim();
//         const razon = document.getElementById('cli-razon').value.trim();
//         const ciudad = document.getElementById('cli-ciudad').value;
//         const direccion = document.getElementById('cli-direccion').value.trim();
//         const horaInicio = document.getElementById('cli-hora-inicio').value;
//         const horaFin = document.getElementById('cli-hora-fin').value;
//         const estado = document.getElementById('cli-estado').value;
//         const usuario = document.getElementById('ssn_usuario').value;

//         if (!nit || !razon || !ciudad || !estado) {
//             mostrarAlerta('alert-clientes', 'Complete los campos obligatorios (*).');
//             return;
//         }

//         const btn = document.getElementById('btn-guardar-cliente');
//         btn.disabled = true;
//         btn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Guardando…';

//         try {
//             const params = {
//                 cliente_id: cliCliente,
//                 nit_cliente: nit,
//                 razon_social: razon,
//                 ciudad,
//                 direccion,
//                 hora_inicio: horaInicio,
//                 hora_fin: horaFin,
//                 estado,
//                 usuario,
//             };
//             if (cli.modoEdicion) params.id = id;
//             const json = await post(
//                 cli.modoEdicion ? API.clientes.actualizar() : API.clientes.guardar(), params
//             );
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             mostrarAlerta('alert-clientes', json.mensaje, 'success');
//             await listarClientes();
//             setTimeout(() => resetFormCliente(), 2000);
//         } catch (e) {
//             mostrarAlerta('alert-clientes', e.message);
//         } finally {
//             btn.disabled = false;
//             btn.innerHTML = '<i class="bi bi-check-lg"></i> Guardar';
//         }
//     }

//     async function editarCliente(id) {
//         try {
//             const json = await post(API.clientes.obtener(), { id });
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             const r = json.data;
//             await cargarMunicipios();
//             await cargarClientesInternos();

//             document.getElementById('cli-id').value = r.id;
//             document.getElementById('cli-nit').value = r.nit_cliente ?? '';
//             document.getElementById('cli-razon').value = r.razon_social ?? '';
//             document.getElementById('cli-direccion').value = r.direccion ?? '';
//             document.getElementById('cli-hora-inicio').value = r.hora_inicio ?? '';
//             document.getElementById('cli-hora-fin').value = r.hora_fin ?? '';
//             document.getElementById('cli-estado').value = r.estado ?? 'activo';

//             if (tsInstances['cli-cliente']) tsInstances['cli-cliente'].setValue(r.cliente_id ?? '');
//             if (tsInstances['cli-ciudad']) tsInstances['cli-ciudad'].setValue(r.ciudad ?? '');

//             cli.modoEdicion = true;
//             toggleForm('form-card-clientes', true, 'Editar Cliente Externo');
//             document.getElementById('form-card-clientes').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//         } catch (e) { alert('Error al cargar cliente: ' + e.message); }
//     }

//     async function toggleCliente(id, estadoActual) {
//         try {
//             const json = await post(API.clientes.cambiarEstado(), {
//                 id, estado: estadoActual === 'activo' ? 'inactivo' : 'activo',
//             });
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             await listarClientes();
//         } catch (e) { alert('Error al cambiar estado: ' + e.message); }
//     }

//     function resetFormCliente() {
//         ['cli-id', 'cli-nit', 'cli-razon', 'cli-direccion', 'cli-hora-inicio', 'cli-hora-fin']
//             .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
//         if (tsInstances['cli-cliente']) tsInstances['cli-cliente'].clear();
//         if (tsInstances['cli-ciudad']) tsInstances['cli-ciudad'].clear();
//         document.getElementById('cli-estado').value = 'activo';
//         cli.modoEdicion = false;
//         toggleForm('form-card-clientes', false);
//         ocultarAlerta('alert-clientes');
//     }

//     /** Llena el select rem-cliente en el tab de remitentes */
//     function llenarSelectClientes(lista) {
//         const sel = document.getElementById('rem-cliente');
//         if (!sel) return;
//         const valorActual = sel.value;
//         sel.innerHTML = '<option value="">— Seleccione cliente —</option>';
//         lista.filter(c => c.estado === 'activo').forEach(c => {
//             sel.innerHTML += `<option value="${c.id}">${c.razon_social}</option>`;
//         });
//         tsInstances['rem-cliente'] = initTomSelect(sel, { placeholder: 'Seleccione un cliente externo...' });
//         if (valorActual) tsInstances['rem-cliente'].setValue(valorActual);
//     }

//     /* ══════════════════════════════════════════════════════
//      *  REMITENTES / DESTINATARIOS
//      * ══════════════════════════════════════════════════════ */
//     const rem = { modoEdicion: false, datos: [] };

//     // async function listarRemitentes() {
//     //     try {
//     //         const json = await post(API.remitentes.listar());
//     //         if (json.numero !== 200) throw new Error(json.mensaje);
//     //         rem.datos = json.data ?? [];
//     //         renderRemitentes(rem.datos);
//     //         actualizarBadge('badge-remitentes', rem.datos.length);
//     //         llenarSelectRemitentes(rem.datos);
//     //     } catch (e) { console.error('listarRemitentes:', e); }
//     // }

//     // function renderRemitentes(lista) {
//     //     const tbody = document.getElementById('tbody-remitentes');
//     //     if (!lista.length) {
//     //         tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state">
//     //             <div class="es-icon"><i class="bi bi-people"></i></div>
//     //             <div class="es-title">Sin remitentes registrados</div>
//     //             <div class="es-sub">Crea el primer remitente o destinatario</div>
//     //         </div></td></tr>`;
//     //         return;
//     //     }
//     //     tbody.innerHTML = lista.map((r, i) => `
//     //         <tr>
//     //             <td>${i + 1}</td>
//     //             <td>${r.id}</td>
//     //             <td>${r.cliente.cliente_interno?.nombre ?? '-'}</td>
//     //             <td>${r.cliente?.razon_social ?? '-'}</td>
//     //             <td><strong>${r.nombre_remitente_destinatario ?? '-'}</strong></td>
//     //             <td>${r.ciudad ?? '-'}</td>
//     //             <td style="font-family:monospace;font-size:.75rem">${r.latitud ?? '-'}</td>
//     //             <td style="font-family:monospace;font-size:.75rem">${r.longitud ?? '-'}</td>
//     //             <td>${renderHorarioPills(r.horarios ?? [])}</td>
//     //             <td>${badgeEstado(r.estado)}</td>
//     //             <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
//     //             <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
//     //             <td><div class="d-flex gap-1">
//     //                 <button class="action-btn ab-edit" title="Editar"
//     //                     data-accion="editar-remitente" data-id="${r.id}">
//     //                     <i class="bi bi-pencil-fill"></i>
//     //                 </button>
//     //                 <button class="action-btn ab-toggle"
//     //                     title="${r.estado === 'activo' ? 'Desactivar' : 'Activar'}"
//     //                     data-accion="toggle-remitente" data-id="${r.id}" data-estado="${r.estado}">
//     //                     <i class="bi bi-${r.estado === 'activo' ? 'toggle-on' : 'toggle-off'}"></i>
//     //                 </button>
//     //             </div></td>
//     //         </tr>`).join('');

//     //     setTimeout(() => inicializarDataTable('#tbl-remitentes'), 100);
//     // }

//     async function listarRemitentes() {
//         try {
//             // Limpiamos el array antes de la nueva carga para evitar datos residuales
//             rem.datos = [];

//             const json = await post(API.remitentes.listar());
//             if (json.numero !== 200) throw new Error(json.mensaje);

//             // Asignamos los nuevos datos
//             rem.datos = json.data ?? [];

//             // Renderizamos usando la data fresca
//             renderRemitentes(rem.datos);

//             actualizarBadge('badge-remitentes', rem.datos.length);
//             llenarSelectRemitentes(rem.datos);
//         } catch (e) {
//             console.error('listarRemitentes:', e);
//         }
//     }

//     function renderRemitentes(lista) {
//         const tbody = document.getElementById('tbody-remitentes');
//         const tablaId = '#tbl-remitentes';

//         // --- 1. Destruir instancia de DataTable si ya existe ---
//         if ($.fn.DataTable.isDataTable(tablaId)) {
//             $(tablaId).DataTable().destroy();
//         }

//         // --- 2. Validar si hay datos ---
//         if (!lista || !lista.length) {
//             tbody.innerHTML = `<tr><td colspan="13"><div class="empty-state">
//             <div class="es-icon"><i class="bi bi-people"></i></div>
//             <div class="es-title">Sin remitentes registrados</div>
//             <div class="es-sub">Crea el primer remitente o destinatario</div>
//         </div></td></tr>`;
//             return;
//         }

//         // --- 3. Limpiar y mapear el contenido ---
//         tbody.innerHTML = lista.map((r, i) => `
//         <tr>
//             <td>${i + 1}</td>
//             <td>${r.id}</td>
//             <td>${r.cliente?.cliente_interno?.nombre ?? '-'}</td>
//             <td>${r.cliente?.razon_social ?? '-'}</td>
//             <td><strong>${r.nombre_remitente_destinatario ?? '-'}</strong></td>
//             <td>${r.ciudad ?? '-'}</td>
//             <td style="font-family:monospace;font-size:.75rem">${r.latitud ?? '-'}</td>
//             <td style="font-family:monospace;font-size:.75rem">${r.longitud ?? '-'}</td>
//             <td>${renderHorarioPills(r.horarios ?? [])}</td>
//             <td>${badgeEstado(r.estado)}</td>
//             <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
//             <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
//             <td><div class="d-flex gap-1">
//                 <button class="action-btn ab-edit" title="Editar"
//                     data-accion="editar-remitente" data-id="${r.id}">
//                     <i class="bi bi-pencil-fill"></i>
//                 </button>
//                 <button class="action-btn ab-toggle"
//                     title="${r.estado === 'activo' ? 'Desactivar' : 'Activar'}"
//                     data-accion="toggle-remitente" data-id="${r.id}" data-estado="${r.estado}">
//                     <i class="bi bi-${r.estado === 'activo' ? 'toggle-on' : 'toggle-off'}"></i>
//                 </button>
//             </div></td>
//         </tr>`).join('');

//         // --- 4. Re-inicializar DataTable con un pequeño delay ---
//         setTimeout(() => {
//             if (typeof inicializarDataTable === 'function') {
//                 inicializarDataTable(tablaId);
//             }
//         }, 50);
//     }

//     function renderHorarioPills(horarios) {
//         if (!horarios.length) return '<span style="color:var(--slate-400);font-size:.72rem">Sin horarios</span>';
//         return `<div class="horario-pills">${horarios.map(h =>
//             `<span class="horario-pill"><i class="bi bi-clock"></i>${h.hora_inicio} – ${h.hora_fin}</span>`
//         ).join('')}</div>`;
//     }

//     /* ── Horarios múltiples ── */
//     function agregarFilaHorario(horario = null) {
//         const contenedor = document.getElementById('rem-horarios-container');
//         if (!contenedor) return;
//         const num = contenedor.children.length + 1;
//         const row = document.createElement('div');
//         row.className = 'horario-row';
//         row.dataset.horarioId = horario?.id ?? '';
//         row.innerHTML = `
//             <span class="h-num">${num}</span>
//             <span class="h-label">Entrada</span>
//             <input type="time" class="h-input rem-hora-inicio" value="${horario?.hora_inicio ?? ''}" required>
//             <span class="h-sep"><i class="bi bi-arrow-right"></i></span>
//             <span class="h-label">Salida</span>
//             <input type="time" class="h-input rem-hora-fin" value="${horario?.hora_fin ?? ''}" required>
//             <button type="button" class="btn-del-horario btn-eliminar-horario" title="Eliminar horario"
//                 ${horario?.id ? `data-horario-id="${horario.id}"` : ''}>
//                 <i class="bi bi-trash-fill"></i>
//             </button>`;
//         contenedor.appendChild(row);
//         actualizarNumerosHorario();
//     }

//     function actualizarNumerosHorario() {
//         document.querySelectorAll('#rem-horarios-container .horario-row').forEach((row, i) => {
//             const num = row.querySelector('.h-num');
//             if (num) num.textContent = i + 1;
//         });
//     }

//     async function eliminarFilaHorario(btn) {
//         const row = btn.closest('.horario-row');
//         const horarioId = btn.dataset.horarioId;
//         if (horarioId) {
//             try {
//                 const json = await post(API.horarios.eliminar(), { id: horarioId });
//                 if (json.numero !== 200) throw new Error(json.mensaje);
//             } catch (e) { alert('Error al eliminar horario: ' + e.message); return; }
//         }
//         row.remove();
//         actualizarNumerosHorario();
//         const contenedor = document.getElementById('rem-horarios-container');
//         if (contenedor && contenedor.children.length === 0) agregarFilaHorario();
//     }

//     function recogerHorarios() {
//         return Array.from(
//             document.querySelectorAll('#rem-horarios-container .horario-row')
//         ).map(row => ({
//             id: row.dataset.horarioId || null,
//             hora_inicio: row.querySelector('.rem-hora-inicio').value,
//             hora_fin: row.querySelector('.rem-hora-fin').value,
//         })).filter(h => h.hora_inicio && h.hora_fin);
//     }

//     async function guardarRemitente() {
//         ocultarAlerta('alert-remitentes');
//         const id = document.getElementById('rem-id').value;
//         const cliente = document.getElementById('rem-cliente').value;
//         const nombre = document.getElementById('rem-nombre').value.trim();
//         const ciudad = document.getElementById('rem-ciudad').value;
//         const lat = document.getElementById('rem-lat').value.trim();
//         const lng = document.getElementById('rem-lng').value.trim();
//         const estado = document.getElementById('rem-estado').value;
//         const usuario = document.getElementById('ssn_usuario').value;
//         const horarios = recogerHorarios();

//         if (!cliente || !nombre || !ciudad || !lat || !lng) {
//             mostrarAlerta('alert-remitentes', 'Complete los campos obligatorios (*).');
//             return;
//         }
//         if (!horarios.length) {
//             mostrarAlerta('alert-remitentes', 'Agregue al menos un horario de entrada y salida.');
//             return;
//         }

//         const btn = document.getElementById('btn-guardar-remitente');
//         btn.disabled = true;
//         btn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Guardando…';

//         try {
//             const params = {
//                 id_cliente: cliente,
//                 nombre_remitente_destinatario: nombre,
//                 ciudad, latitud: lat, longitud: lng, estado, usuario,
//                 horarios: JSON.stringify(horarios),
//             };
//             if (rem.modoEdicion) params.id = id;
//             const json = await post(
//                 rem.modoEdicion ? API.remitentes.actualizar() : API.remitentes.guardar(), params
//             );
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             mostrarAlerta('alert-remitentes', json.mensaje, 'success');
//             await listarRemitentes();
//             setTimeout(() => resetFormRemitente(), 2000);
//         } catch (e) {
//             mostrarAlerta('alert-remitentes', e.message);
//         } finally {
//             btn.disabled = false;
//             btn.innerHTML = '<i class="bi bi-check-lg"></i> Guardar';
//         }
//     }

//     async function editarRemitente(id) {
//         try {
//             const json = await post(API.remitentes.obtener(), { id });
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             const r = json.data;
//             await cargarMunicipios();

//             document.getElementById('rem-id').value = r.id;
//             document.getElementById('rem-nombre').value = r.nombre_remitente_destinatario ?? '';
//             document.getElementById('rem-lat').value = r.latitud ?? '';
//             document.getElementById('rem-lng').value = r.longitud ?? '';
//             document.getElementById('rem-estado').value = r.estado ?? 'activo';

//             if (tsInstances['rem-cliente']) tsInstances['rem-cliente'].setValue(r.id_cliente ?? '');
//             if (tsInstances['rem-ciudad']) tsInstances['rem-ciudad'].setValue(r.ciudad ?? '');

//             const contenedor = document.getElementById('rem-horarios-container');
//             contenedor.innerHTML = '';
//             const horarios = r.horarios ?? [];
//             if (horarios.length) horarios.forEach(h => agregarFilaHorario(h));
//             else agregarFilaHorario();

//             rem.modoEdicion = true;
//             toggleForm('form-card-remitentes', true, 'Editar Remitente / Destinatario');
//             document.getElementById('form-card-remitentes').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//         } catch (e) { alert('Error al cargar remitente: ' + e.message); }
//     }

//     async function toggleRemitente(id, estadoActual) {
//         try {
//             const json = await post(API.remitentes.cambiarEstado(), {
//                 id, estado: estadoActual === 'activo' ? 'inactivo' : 'activo',
//             });
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             await listarRemitentes();
//         } catch (e) { alert('Error al cambiar estado: ' + e.message); }
//     }

//     function resetFormRemitente() {
//         ['rem-id', 'rem-nombre', 'rem-lat', 'rem-lng'].forEach(id => {
//             const el = document.getElementById(id); if (el) el.value = '';
//         });
//         if (tsInstances['rem-cliente']) tsInstances['rem-cliente'].clear();
//         if (tsInstances['rem-ciudad']) tsInstances['rem-ciudad'].clear();
//         document.getElementById('rem-estado').value = 'activo';
//         const contenedor = document.getElementById('rem-horarios-container');
//         if (contenedor) { contenedor.innerHTML = ''; agregarFilaHorario(); }
//         rem.modoEdicion = false;
//         toggleForm('form-card-remitentes', false);
//         ocultarAlerta('alert-remitentes');
//     }

//     function llenarSelectRemitentes(lista) {
//         const sel = document.getElementById('geo-remitente');
//         if (!sel) return;
//         const valorActual = sel.value;
//         sel.innerHTML = '<option value="">— Seleccione remitente/dest. —</option>';
//         lista.filter(r => r.estado === 'activo').forEach(r => {
//             sel.innerHTML += `<option value="${r.id}" data-ciudad="${r.ciudad ?? ''}">${r.nombre_remitente_destinatario}</option>`;
//         });
//         tsInstances['geo-remitente'] = initTomSelect(sel, {
//             placeholder: 'Seleccione remitente...',
//             onChange(value) {
//                 const opt = sel.querySelector(`option[value="${value}"]`);
//                 const ciudad = opt ? (opt.dataset.ciudad ?? '') : '';
//                 const display = document.getElementById('geo-ciudad-display');
//                 const input = document.getElementById('geo-ciudad');
//                 if (display) display.textContent = ciudad || '—';
//                 if (input) input.value = ciudad;
//             },
//         });
//         if (valorActual) tsInstances['geo-remitente'].setValue(valorActual);
//     }

//     /* ══════════════════════════════════════════════════════
//      *  GEOCERCAS
//      * ══════════════════════════════════════════════════════ */
//     const geo = { modoEdicion: false, datos: [] };

//     // async function listarGeocercas() {
//     //     try {
//     //         const json = await post(API.geocercas.listar());
//     //         if (json.numero !== 200) throw new Error(json.mensaje);
//     //         geo.datos = json.data ?? [];
//     //         renderGeocercas(geo.datos);
//     //         actualizarBadge('badge-geocercas', geo.datos.length);
//     //     } catch (e) { console.error('listarGeocercas:', e); }
//     // }

//     // function renderGeocercas(lista) {
//     //     const tbody = document.getElementById('tbody-geocercas');
//     //     if (!lista.length) {
//     //         tbody.innerHTML = `<tr><td colspan="10"><div class="empty-state">
//     //             <div class="es-icon"><i class="bi bi-geo"></i></div>
//     //             <div class="es-title">Sin geocercas registradas</div>
//     //             <div class="es-sub">Crea la primera geocerca</div>
//     //         </div></td></tr>`;
//     //         return;
//     //     }
//     //     tbody.innerHTML = lista.map((r, i) => `
//     //         <tr>
//     //             <td>${i + 1}</td>
//     //             <td>${r.remitente_destinatario?.cliente?.cliente_interno?.nombre ?? '-'}</td>
//     //             <td>${r.remitente_destinatario?.cliente?.razon_social ?? '-'}</td>
//     //             <td>${r.remitente_destinatario?.nombre_remitente_destinatario ?? '-'}</td>
//     //             <td><strong>${r.nombre_punto_geo ?? '-'}</strong></td>
//     //             <td>${r.ciudad ?? '-'}</td>
//     //             <td style="font-family:monospace;font-size:.75rem">${r.latitud ?? '-'}</td>
//     //             <td style="font-family:monospace;font-size:.75rem">${r.longitud ?? '-'}</td>
//     //             <td>${badgeEstado(r.estado)}</td>
//     //             <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
//     //             <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
//     //             <td><div class="d-flex gap-1">
//     //                 <button class="action-btn ab-edit" title="Editar"
//     //                     data-accion="editar-geocerca" data-id="${r.id}">
//     //                     <i class="bi bi-pencil-fill"></i>
//     //                 </button>
//     //                 <button class="action-btn ab-toggle"
//     //                     title="${r.estado === 'activo' ? 'Desactivar' : 'Activar'}"
//     //                     data-accion="toggle-geocerca" data-id="${r.id}" data-estado="${r.estado}">
//     //                     <i class="bi bi-${r.estado === 'activo' ? 'toggle-on' : 'toggle-off'}"></i>
//     //                 </button>
//     //             </div></td>
//     //         </tr>`).join('');

//     //     setTimeout(() => inicializarDataTable('#tbl-geocercas'), 100);
//     // }

//     async function listarGeocercas() {
//         try {
//             // Limpiamos el array global antes de la consulta
//             geo.datos = [];

//             const json = await post(API.geocercas.listar());
//             if (json.numero !== 200) throw new Error(json.mensaje);

//             // Guardamos y renderizamos
//             geo.datos = json.data ?? [];
//             renderGeocercas(geo.datos);

//             actualizarBadge('badge-geocercas', geo.datos.length);
//         } catch (e) {
//             console.error('listarGeocercas:', e);
//         }
//     }

//     function renderGeocercas(lista) {
//         const tbody = document.getElementById('tbody-geocercas');
//         const tablaId = '#tbl-geocercas';

//         // 1. Destruir DataTable si ya está inicializada
//         if ($.fn.DataTable.isDataTable(tablaId)) {
//             $(tablaId).DataTable().destroy();
//         }

//         // 2. Manejo de estado vacío
//         if (!lista || !lista.length) {
//             tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state">
//             <div class="es-icon"><i class="bi bi-geo"></i></div>
//             <div class="es-title">Sin geocercas registradas</div>
//             <div class="es-sub">Crea la primera geocerca</div>
//         </div></td></tr>`;
//             return;
//         }

//         // 3. Renderizado de filas con Optional Chaining para seguridad
//         tbody.innerHTML = lista.map((r, i) => `
//         <tr>
//             <td>${i + 1}</td>
//             <td>${r.remitente_destinatario?.cliente?.cliente_interno?.nombre ?? '-'}</td>
//             <td>${r.remitente_destinatario?.cliente?.razon_social ?? '-'}</td>
//             <td>${r.remitente_destinatario?.nombre_remitente_destinatario ?? '-'}</td>
//             <td><strong>${r.nombre_punto_geo ?? '-'}</strong></td>
//             <td>${r.ciudad ?? '-'}</td>
//             <td style="font-family:monospace;font-size:.75rem">${r.latitud ?? '-'}</td>
//             <td style="font-family:monospace;font-size:.75rem">${r.longitud ?? '-'}</td>
//             <td>${badgeEstado(r.estado)}</td>
//             <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
//             <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
//             <td><div class="d-flex gap-1">
//                 <button class="action-btn ab-edit" title="Editar"
//                     data-accion="editar-geocerca" data-id="${r.id}">
//                     <i class="bi bi-pencil-fill"></i>
//                 </button>
//                 <button class="action-btn ab-toggle"
//                     title="${r.estado === 'activo' ? 'Desactivar' : 'Activar'}"
//                     data-accion="toggle-geocerca" data-id="${r.id}" data-estado="${r.estado}">
//                     <i class="bi bi-${r.estado === 'activo' ? 'toggle-on' : 'toggle-off'}"></i>
//                 </button>
//             </div></td>
//         </tr>`).join('');

//         // 4. Re-inicialización de la tabla
//         setTimeout(() => {
//             if (typeof inicializarDataTable === 'function') {
//                 inicializarDataTable(tablaId);
//             }
//         }, 50);
//     }

//     async function guardarGeocerca() {
//         ocultarAlerta('alert-geocercas');
//         const id = document.getElementById('geo-id').value;
//         const remitente = document.getElementById('geo-remitente').value;
//         const nombre = document.getElementById('geo-nombre').value.trim();
//         const ciudad = document.getElementById('geo-ciudad').value;
//         const lat = document.getElementById('geo-lat').value.trim();
//         const lng = document.getElementById('geo-lng').value.trim();
//         const estado = document.getElementById('geo-estado').value;
//         const usuario = document.getElementById('ssn_usuario').value;

//         if (!remitente || !nombre || !lat || !lng) {
//             mostrarAlerta('alert-geocercas', 'Complete los campos obligatorios (*).');
//             return;
//         }

//         const btn = document.getElementById('btn-guardar-geocerca');
//         btn.disabled = true;
//         btn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Guardando…';

//         try {
//             const params = { id_rem_des: remitente, nombre_punto_geo: nombre, ciudad, latitud: lat, longitud: lng, estado, usuario };
//             if (geo.modoEdicion) params.id = id;
//             const json = await post(
//                 geo.modoEdicion ? API.geocercas.actualizar() : API.geocercas.guardar(), params
//             );
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             mostrarAlerta('alert-geocercas', json.mensaje, 'success');
//             await listarGeocercas();
//             setTimeout(() => resetFormGeocerca(), 2000);
//         } catch (e) {
//             mostrarAlerta('alert-geocercas', e.message);
//         } finally {
//             btn.disabled = false;
//             btn.innerHTML = '<i class="bi bi-check-lg"></i> Guardar';
//         }
//     }

//     async function editarGeocerca(id) {
//         try {
//             const json = await post(API.geocercas.obtener(), { id });
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             const r = json.data;
//             document.getElementById('geo-id').value = r.id;
//             document.getElementById('geo-nombre').value = r.nombre_punto_geo ?? '';
//             document.getElementById('geo-lat').value = r.latitud ?? '';
//             document.getElementById('geo-lng').value = r.longitud ?? '';
//             document.getElementById('geo-estado').value = r.estado ?? 'activo';
//             document.getElementById('geo-ciudad').value = r.ciudad ?? '';
//             const display = document.getElementById('geo-ciudad-display');
//             if (display) display.textContent = r.ciudad || '—';
//             if (tsInstances['geo-remitente']) tsInstances['geo-remitente'].setValue(r.id_rem_des ?? '');
//             geo.modoEdicion = true;
//             toggleForm('form-card-geocercas', true, 'Editar Geocerca');
//             document.getElementById('form-card-geocercas').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//         } catch (e) { alert('Error al cargar geocerca: ' + e.message); }
//     }

//     async function toggleGeocerca(id, estadoActual) {
//         try {
//             const json = await post(API.geocercas.cambiarEstado(), {
//                 id, estado: estadoActual === 'activo' ? 'inactivo' : 'activo',
//             });
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             await listarGeocercas();
//         } catch (e) { alert('Error al cambiar estado: ' + e.message); }
//     }

//     function resetFormGeocerca() {
//         ['geo-id', 'geo-nombre', 'geo-lat', 'geo-lng', 'geo-ciudad'].forEach(id => {
//             const el = document.getElementById(id); if (el) el.value = '';
//         });
//         if (tsInstances['geo-remitente']) tsInstances['geo-remitente'].clear();
//         const display = document.getElementById('geo-ciudad-display');
//         if (display) display.textContent = '—';
//         document.getElementById('geo-estado').value = 'activo';
//         geo.modoEdicion = false;
//         toggleForm('form-card-geocercas', false);
//         ocultarAlerta('alert-geocercas');
//     }

//     /* ══════════════════════════════════════════════════════
//      *  TAB CONSULTAR
//      * ══════════════════════════════════════════════════════ */
//     let consultaInicializada = false;
//     let consultaDatos = [];  // cache de los resultados actuales para exportar

//     async function inicializarConsulta() {
//         if (consultaInicializada) return;
//         consultaInicializada = true;
//         await cargarClientesInternos();
//     }

//     /** Cuando cambia el cliente interno: carga clientes externos asociados */
//     function onCnsClienteInternoChange(clienteInternoId) {
//         const selExt = document.getElementById('cns-cliente-externo');
//         const selRem = document.getElementById('cns-remitente');
//         if (!selExt) return;

//         // Resetear cascada
//         selExt.innerHTML = '<option value="">— Todos —</option>';
//         selExt.disabled = true;
//         if (tsInstances['cns-cliente-externo']) tsInstances['cns-cliente-externo'].destroy();
//         selRem.innerHTML = '<option value="">— Todos —</option>';
//         selRem.disabled = true;
//         if (tsInstances['cns-remitente']) tsInstances['cns-remitente'].destroy();

//         if (!clienteInternoId) return;

//         // Filtrar clientes externos del cache que pertenecen a este cliente interno
//         const externosFiltrados = cli.datos.filter(
//             c => String(c.cliente_id) === String(clienteInternoId)
//         );

//         if (!externosFiltrados.length) {
//             selExt.innerHTML = '<option value="">— Sin clientes externos —</option>';
//             tsInstances['cns-cliente-externo'] = initTomSelect(selExt, { placeholder: 'Sin resultados...' });
//             return;
//         }

//         const opts = externosFiltrados
//             .map(c => `<option value="${c.id}">${c.razon_social}</option>`).join('');
//         selExt.innerHTML = '<option value="">— Todos —</option>' + opts;
//         selExt.disabled = false;

//         tsInstances['cns-cliente-externo'] = initTomSelect(selExt, {
//             placeholder: 'Seleccione cliente externo...',
//             onChange(value) { onCnsClienteExternoChange(value); },
//         });
//     }

//     /** Cuando cambia el cliente externo: carga remitentes asociados */
//     function onCnsClienteExternoChange(clienteExternoId) {
//         const selRem = document.getElementById('cns-remitente');
//         if (!selRem) return;

//         selRem.innerHTML = '<option value="">— Todos —</option>';
//         selRem.disabled = true;
//         if (tsInstances['cns-remitente']) tsInstances['cns-remitente'].destroy();

//         if (!clienteExternoId) return;

//         const remitentesFiltrados = rem.datos.filter(
//             r => String(r.id_cliente) === String(clienteExternoId)
//         );

//         const opts = remitentesFiltrados
//             .map(r => `<option value="${r.id}">${r.nombre_remitente_destinatario}</option>`).join('');
//         selRem.innerHTML = '<option value="">— Todos —</option>' + opts;
//         selRem.disabled = false;

//         tsInstances['cns-remitente'] = initTomSelect(selRem, {
//             placeholder: 'Seleccione remitente...',
//         });
//     }

//     /** Ejecuta la consulta con los filtros actuales */
//     async function ejecutarConsulta() {
//         const clienteInternoId = document.getElementById('cns-cliente-interno')?.value ?? '';
//         const clienteExternoId = document.getElementById('cns-cliente-externo')?.value ?? '';
//         const remitenteId = document.getElementById('cns-remitente')?.value ?? '';
//         const ciudadFiltro = (document.getElementById('cns-ciudad-filtro')?.value ?? '').toLowerCase();
//         const estadoFiltro = document.getElementById('cns-estado-filtro')?.value ?? '';

//         // UI: mostrar spinner
//         document.getElementById('cns-estado-inicial').style.display = 'none';
//         document.getElementById('cns-spinner').style.display = 'flex';
//         document.getElementById('cns-tabla-wrapper').style.display = 'none';
//         document.getElementById('kpi-row').style.display = 'none';
//         document.getElementById('btn-excel-consulta').disabled = true;

//         try {
//             // Construir resultado desde los caches locales (sin necesidad de endpoint extra)
//             let resultado = rem.datos.map(r => ({
//                 ...r,
//                 cliente_externo: cli.datos.find(c => c.id === r.id_cliente) ?? null,
//                 cliente_interno: null, // se resuelve abajo
//             }));

//             // Resolver cliente interno
//             resultado.forEach(r => {
//                 const ext = r.cliente_externo;
//                 if (ext) {
//                     r.cliente_interno = clientesInternosCache.find(ci => ci.id === ext.cliente_id) ?? null;
//                 }
//             });

//             // Aplicar filtros
//             if (clienteInternoId) {
//                 resultado = resultado.filter(r => String(r.cliente_interno?.id) === String(clienteInternoId));
//             }
//             if (clienteExternoId) {
//                 resultado = resultado.filter(r => String(r.id_cliente) === String(clienteExternoId));
//             }
//             if (remitenteId) {
//                 resultado = resultado.filter(r => String(r.id) === String(remitenteId));
//             }
//             if (ciudadFiltro) {
//                 resultado = resultado.filter(r => (r.ciudad ?? '').toLowerCase().includes(ciudadFiltro));
//             }
//             if (estadoFiltro) {
//                 resultado = resultado.filter(r => r.estado === estadoFiltro);
//             }

//             consultaDatos = resultado;
//             renderConsulta(resultado);

//         } catch (e) {
//             console.error('ejecutarConsulta:', e);
//             document.getElementById('cns-spinner').style.display = 'none';
//             document.getElementById('cns-estado-inicial').style.display = 'flex';
//         }
//     }

//     function renderConsulta(lista) {
//         document.getElementById('cns-spinner').style.display = 'none';

//         // KPIs
//         const clientesExtUnicos = new Set(lista.map(r => r.id_cliente)).size;
//         const totalHorarios = lista.reduce((acc, r) => acc + (r.horarios?.length ?? 0), 0);
//         const totalActivos = lista.filter(r => r.estado === 'activo').length;
//         document.getElementById('kpi-clientes-ext').textContent = clientesExtUnicos;
//         document.getElementById('kpi-remitentes').textContent = lista.length;
//         document.getElementById('kpi-horarios').textContent = totalHorarios;
//         document.getElementById('kpi-activos').textContent = totalActivos;
//         document.getElementById('kpi-row').style.display = lista.length ? 'flex' : 'none';

//         actualizarBadge('badge-consulta', lista.length);

//         const tbody = document.getElementById('tbody-consulta');

//         if (!lista.length) {
//             tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state">
//                 <div class="es-icon"><i class="bi bi-search"></i></div>
//                 <div class="es-title">Sin resultados</div>
//                 <div class="es-sub">Ajusta los filtros e intenta de nuevo</div>
//             </div></td></tr>`;
//             document.getElementById('cns-tabla-wrapper').style.display = 'block';
//             return;
//         }

//         tbody.innerHTML = lista.map((r, i) => `
//             <tr>
//                 <td>${i + 1}</td>
//                 <td>${r.cliente_interno?.nombre ?? '-'}</td>
//                 <td>${r.cliente_externo?.razon_social ?? '-'}</td>
//                 <td>${r.cliente_externo?.nit_cliente ?? '-'}</td>
//                 <td><strong>${r.nombre_remitente_destinatario ?? '-'}</strong></td>
//                 <td>${r.ciudad ?? '-'}</td>
//                 <td style="font-family:monospace;font-size:.75rem">${r.latitud ?? '-'}</td>
//                 <td style="font-family:monospace;font-size:.75rem">${r.longitud ?? '-'}</td>
//                 <td>${renderHorarioPills(r.horarios ?? [])}</td>
//                 <td>${badgeEstado(r.estado)}</td>
//                 <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
//                 <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
//             </tr>`).join('');

//         document.getElementById('cns-tabla-wrapper').style.display = 'block';
//         document.getElementById('btn-excel-consulta').disabled = false;

//         setTimeout(() => inicializarDataTable('#tbl-consulta', { columnDefs: [{ orderable: false, targets: -1 }] }), 100);
//     }

//     function limpiarConsulta() {
//         if (tsInstances['cns-cliente-interno']) tsInstances['cns-cliente-interno'].clear();
//         if (tsInstances['cns-cliente-externo']) tsInstances['cns-cliente-externo']?.clear();
//         if (tsInstances['cns-remitente']) tsInstances['cns-remitente']?.clear();

//         const selExt = document.getElementById('cns-cliente-externo');
//         const selRem = document.getElementById('cns-remitente');
//         if (selExt) { selExt.innerHTML = '<option value="">— Seleccione cliente interno —</option>'; selExt.disabled = true; }
//         if (selRem) { selRem.innerHTML = '<option value="">— Todos —</option>'; selRem.disabled = true; }

//         const ciudadEl = document.getElementById('cns-ciudad-filtro');
//         const estadoEl = document.getElementById('cns-estado-filtro');
//         if (ciudadEl) ciudadEl.value = '';
//         if (estadoEl) estadoEl.value = '';

//         document.getElementById('cns-estado-inicial').style.display = 'flex';
//         document.getElementById('cns-spinner').style.display = 'none';
//         document.getElementById('cns-tabla-wrapper').style.display = 'none';
//         document.getElementById('kpi-row').style.display = 'none';
//         document.getElementById('btn-excel-consulta').disabled = true;
//         consultaDatos = [];
//     }

//     /* ══════════════════════════════════════════════════════
//      *  EVENT LISTENERS
//      * ══════════════════════════════════════════════════════ */
//     function initEventListeners() {

//         // document.addEventListener('click', async (e) => {
//         $(document).off('click').on('click', async function (e) {

//             // ── Clientes ──
//             if (e.target.closest('#btn-nuevo-cliente')) {
//                 resetFormCliente();
//                 await cargarMunicipios();
//                 await cargarClientesInternos();
//                 toggleForm('form-card-clientes', true, 'Remitente / Destinatario');
//                 document.getElementById('form-card-clientes').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//             }

//             if (e.target.closest('#btn-cancelar-cliente, #btn-cancelar-cliente-2')) resetFormCliente();
//             if (e.target.closest('#btn-guardar-cliente')) await guardarCliente();

//             const btnEditCli = e.target.closest('[data-accion="editar-cliente"]');
//             if (btnEditCli) await editarCliente(btnEditCli.dataset.id);
//             const btnToggleCli = e.target.closest('[data-accion="toggle-cliente"]');
//             if (btnToggleCli) await toggleCliente(btnToggleCli.dataset.id, btnToggleCli.dataset.estado);

//             // Excel clientes
//             if (e.target.closest('#btn-excel-clientes'))
//                 exportarExcel('#tbl-clientes-externos', 'Clientes_Externos');

//             // ── Remitentes ──
//             if (e.target.closest('#btn-nuevo-remitente')) {
//                 resetFormRemitente();
//                 await cargarMunicipios();
//                 toggleForm('form-card-remitentes', true, 'Nueva Sede');
//                 document.getElementById('form-card-remitentes').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//             }

//             if (e.target.closest('#btn-cancelar-remitente, #btn-cancelar-remitente-2')) resetFormRemitente();
//             if (e.target.closest('#btn-guardar-remitente')) await guardarRemitente();

//             const btnEditRem = e.target.closest('[data-accion="editar-remitente"]');
//             if (btnEditRem) await editarRemitente(btnEditRem.dataset.id);
//             const btnToggleRem = e.target.closest('[data-accion="toggle-remitente"]');
//             if (btnToggleRem) await toggleRemitente(btnToggleRem.dataset.id, btnToggleRem.dataset.estado);

//             // Horarios
//             if (e.target.closest('#btn-agregar-horario')) agregarFilaHorario();
//             const btnElimHorario = e.target.closest('.btn-eliminar-horario');
//             if (btnElimHorario) await eliminarFilaHorario(btnElimHorario);

//             // Excel remitentes
//             if (e.target.closest('#btn-excel-remitentes'))
//                 exportarExcel('#tbl-remitentes', 'Remitentes_Destinatarios');

//             // ── Geocercas ──
//             if (e.target.closest('#btn-nueva-geocerca')) {
//                 resetFormGeocerca();
//                 toggleForm('form-card-geocercas', true, 'Nueva Geocerca');
//                 document.getElementById('form-card-geocercas').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//             }

//             if (e.target.closest('#btn-cancelar-geocerca, #btn-cancelar-geocerca-2')) resetFormGeocerca();
//             if (e.target.closest('#btn-guardar-geocerca')) await guardarGeocerca();

//             const btnEditGeo = e.target.closest('[data-accion="editar-geocerca"]');
//             if (btnEditGeo) await editarGeocerca(btnEditGeo.dataset.id);
//             const btnToggleGeo = e.target.closest('[data-accion="toggle-geocerca"]');
//             if (btnToggleGeo) await toggleGeocerca(btnToggleGeo.dataset.id, btnToggleGeo.dataset.estado);

//             // Excel geocercas
//             if (e.target.closest('#btn-excel-geocercas'))
//                 exportarExcel('#tbl-geocercas', 'Geocercas');

//             // ── Consultar ──
//             if (e.target.closest('#btn-consultar')) await ejecutarConsulta();
//             if (e.target.closest('#btn-limpiar-consulta')) limpiarConsulta();
//             if (e.target.closest('#btn-excel-consulta'))
//                 exportarExcel('#tbl-consulta', 'Consulta_Remitentes');
//         });
//     }

//     /* ══════════════════════════════════════════════════════
//      *  INIT
//      * ══════════════════════════════════════════════════════ */
//     async function init() {
//         initTabs();
//         initEventListeners();
//         agregarFilaHorario();  // una fila vacía por defecto

//         await Promise.all([
//             listarClientes(),
//             listarRemitentes(),
//             listarGeocercas(),
//         ]);
//     }

//     if (document.readyState === 'loading') {
//         document.addEventListener('DOMContentLoaded', init);
//     } else {
//         init();
//     }

// })();



// 'use strict';

// (function () {

//     /* ══════════════════════════════════════════════════════
//      *  CONFIG
//      * ══════════════════════════════════════════════════════ */
//     const baseUrl = () => document.getElementById('base_url_api').value;

//     const API = {
//         municipios: () => baseUrl() + 'municipios/listar',
//         clientesInternos: () => baseUrl() + 'clientes/listar',
//         clientes: {
//             listar: () => baseUrl() + 'clientes-ext/listar',
//             guardar: () => baseUrl() + 'clientes-ext/guardar',
//             obtener: () => baseUrl() + 'clientes-ext/obtener',
//             actualizar: () => baseUrl() + 'clientes-ext/actualizar',
//             cambiarEstado: () => baseUrl() + 'clientes-ext/cambiar-estado',
//         },
//         remitentes: {
//             listar: () => baseUrl() + 'remitentes/listar',
//             guardar: () => baseUrl() + 'remitentes/guardar',
//             obtener: () => baseUrl() + 'remitentes/obtener',
//             actualizar: () => baseUrl() + 'remitentes/actualizar',
//             cambiarEstado: () => baseUrl() + 'remitentes/cambiar-estado',
//         },
//         horarios: {
//             listar: () => baseUrl() + 'remitentes/horarios/listar',
//             guardar: () => baseUrl() + 'remitentes/horarios/guardar',
//             eliminar: () => baseUrl() + 'remitentes/horarios/eliminar',
//         },
//         geocercas: {
//             listar: () => baseUrl() + 'geocercas/listar',
//             guardar: () => baseUrl() + 'geocercas/guardar',
//             obtener: () => baseUrl() + 'geocercas/obtener',
//             actualizar: () => baseUrl() + 'geocercas/actualizar',
//             cambiarEstado: () => baseUrl() + 'geocercas/cambiar-estado',
//         },
//         consulta: {
//             remitentes: () => baseUrl() + 'consulta/remitentes',
//         },
//     };

//     /* ══════════════════════════════════════════════════════
//      *  HELPERS
//      * ══════════════════════════════════════════════════════ */

//     async function post(url, params = {}) {
//         const fd = new FormData();
//         Object.entries(params).forEach(([k, v]) => fd.append(k, v ?? ''));
//         const res = await fetch(url, {
//             method: 'POST',
//             headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
//             body: fd,
//         });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return await res.json();
//     }

//     function mostrarAlerta(alertId, mensaje, tipo = 'error') {
//         const el = document.getElementById(alertId);
//         if (!el) return;
//         el.className = `form-alert ${tipo}`;
//         el.textContent = mensaje;
//         el.style.display = 'block';
//         if (tipo === 'success') setTimeout(() => { el.style.display = 'none'; }, 3000);
//     }

//     function ocultarAlerta(alertId) {
//         const el = document.getElementById(alertId);
//         if (el) el.style.display = 'none';
//     }

//     function toggleForm(formId, mostrar, titulo = null) {
//         const card = document.getElementById(formId);
//         if (!card) return;
//         card.classList.toggle('visible', mostrar);
//         if (titulo) {
//             const span = card.querySelector('[id$="-titulo"]');
//             if (span) span.textContent = titulo;
//         }
//     }

//     function actualizarBadge(badgeId, total) {
//         const el = document.getElementById(badgeId);
//         if (el) el.textContent = `${total} registro${total !== 1 ? 's' : ''}`;
//     }

//     function badgeEstado(estado) {
//         return estado === 'activo'
//             ? `<span class="badge-st bs-green"><i class="bi bi-circle-fill" style="font-size:6px"></i> Activo</span>`
//             : `<span class="badge-st bs-slate"><i class="bi bi-circle" style="font-size:6px"></i> Inactivo</span>`;
//     }

//     function formatFecha(fecha) {
//         return fecha ? fecha.split('T')[0] : '';
//     }

//     /* ══════════════════════════════════════════════════════
//      *  TOM SELECT — helper seguro (destroy + reinit)
//      * ══════════════════════════════════════════════════════ */
//     const tsInstances = {};

//     function initTomSelect(target, opciones = {}) {
//         const el = typeof target === 'string' ? document.querySelector(target) : target;
//         if (!el) return null;
//         if (el.tomselect) el.tomselect.destroy();
//         return new TomSelect(el, {
//             create: false,
//             allowEmptyOption: true,
//             sortField: { field: 'text', direction: 'asc' },
//             onInitialize() { this.control.classList.add('f-control'); },
//             ...opciones,
//         });
//     }

//     /* ══════════════════════════════════════════════════════
//      *  DATATABLES — helper reutilizable con filtros
//      * ══════════════════════════════════════════════════════ */
//     function inicializarDataTable(tableSelector, opciones = {}) {
//         const $tabla = $(tableSelector);
//         if (!$tabla.length) return null;

//         if ($.fn.DataTable.isDataTable(tableSelector)) {
//             $tabla.DataTable().destroy();
//         }
//         $tabla.find('thead tr.filters').remove();

//         const $headerRow = $tabla.find('thead tr:first');
//         const $filterRow = $headerRow.clone(true).addClass('filters');
//         $filterRow.appendTo($tabla.find('thead'));

//         const dt = $tabla.DataTable({
//             orderCellsTop: true,
//             fixedHeader: true,
//             destroy: true,
//             language: { url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
//             ...opciones,
//             initComplete() {
//                 const api = this.api();
//                 api.columns().eq(0).each(function (colIdx) {
//                     const cell = $tabla.find('.filters th').get(colIdx);
//                     if (!cell) return;
//                     if (colIdx === 0) { $(cell).html(''); return; }
//                     const title = $(api.column(colIdx).header()).text();
//                     $(cell).html(
//                         `<input type="text" class="w-100" placeholder="${title}" style="font-size:11px;height:24px;">`
//                     );
//                     $('input', cell).on('keyup change', function (e) {
//                         e.stopPropagation();
//                         if (api.column(colIdx).search() !== this.value)
//                             api.column(colIdx).search(this.value).draw();
//                     });
//                 });
//                 if (opciones.initComplete) opciones.initComplete.call(this);
//             },
//         });

//         return dt;
//     }

//     /* ══════════════════════════════════════════════════════
//      *  EXPORTAR EXCEL con SheetJS
//      *  Exporta la tabla DataTable actualmente visible
//      * ══════════════════════════════════════════════════════ */
//     function exportarExcel(tableSelector, nombreArchivo) {
//         const $tabla = $(tableSelector);
//         if (!$tabla.length) return;

//         // Cabeceras (primera fila del thead, sin la fila de filtros)
//         const headers = [];
//         $tabla.find('thead tr:first th').each(function () {
//             const txt = $(this).text().trim();
//             if (txt) headers.push(txt);
//         });
//         // Última columna (Acciones) no se exporta
//         headers.pop();

//         // Filas visibles
//         const rows = [];
//         $tabla.DataTable().rows({ search: 'applied' }).nodes().each(function () {
//             const cells = [];
//             $(this).find('td').each(function (i) {
//                 if (i >= headers.length) return; // omitir columna acciones
//                 // Limpiar HTML: tomar solo texto
//                 cells.push($(this).text().trim());
//             });
//             rows.push(cells);
//         });

//         const wsData = [headers, ...rows];
//         const wb = XLSX.utils.book_new();
//         const ws = XLSX.utils.aoa_to_sheet(wsData);

//         // Ancho automático de columnas
//         const colWidths = headers.map((h, i) => {
//             const maxLen = Math.max(h.length, ...rows.map(r => (r[i] || '').length));
//             return { wch: Math.min(maxLen + 2, 40) };
//         });
//         ws['!cols'] = colWidths;

//         XLSX.utils.book_append_sheet(wb, ws, 'Datos');
//         XLSX.writeFile(wb, `${nombreArchivo}_${new Date().toISOString().slice(0, 10)}.xlsx`);
//     }

//     /* ══════════════════════════════════════════════════════
//      *  TABS
//      * ══════════════════════════════════════════════════════ */
//     function initTabs() {
//         document.querySelectorAll('.mod-tab').forEach(btn => {
//             btn.addEventListener('click', () => {
//                 document.querySelectorAll('.mod-tab').forEach(t => t.classList.remove('active'));
//                 document.querySelectorAll('.mod-panel').forEach(p => p.classList.remove('active'));
//                 btn.classList.add('active');
//                 const panel = document.getElementById(btn.dataset.tab);
//                 if (panel) panel.classList.add('active');

//                 // Cuando entra al tab Consultar, cargar selects si están vacíos
//                 if (btn.dataset.tab === 'tab-consultar') {
//                     inicializarConsulta();
//                 }
//             });
//         });
//     }

//     /* ══════════════════════════════════════════════════════
//      *  MUNICIPIOS
//      * ══════════════════════════════════════════════════════ */
//     let municipiosCache = [];

//     async function cargarMunicipios() {
//         if (!municipiosCache.length) {
//             try {
//                 const json = await post(API.municipios());
//                 if (json.numero !== 200) throw new Error(json.mensaje);
//                 municipiosCache = json.data ?? [];
//             } catch (e) { console.error('cargarMunicipios:', e); return; }
//         }
//         llenarSelectsMunicipios();
//     }

//     function llenarSelectsMunicipios() {
//         const opts = municipiosCache
//             .map(m => `<option value="${m.municipio}">${m.municipio} — ${m.depto}</option>`)
//             .join('');
//         ['cli-ciudad', 'rem-ciudad'].forEach(id => {
//             const sel = document.getElementById(id);
//             if (!sel) return;
//             sel.innerHTML = '<option value="">— Seleccione municipio —</option>' + opts;
//             tsInstances[id] = initTomSelect(sel, { placeholder: 'Seleccione un municipio...' });
//         });
//     }

//     /* ══════════════════════════════════════════════════════
//      *  CLIENTES INTERNOS
//      * ══════════════════════════════════════════════════════ */
//     let clientesInternosCache = [];

//     async function cargarClientesInternos() {
//         if (!clientesInternosCache.length) {
//             try {
//                 const json = await post(API.clientesInternos());
//                 if (json.numero !== 200) throw new Error(json.mensaje);
//                 clientesInternosCache = json.data ?? [];
//             } catch (e) { console.error('cargarClientesInternos:', e); return; }
//         }
//         llenarSelectsClientesInternos();
//     }

//     function llenarSelectsClientesInternos() {
//         // Select del formulario de clientes externos
//         const selForm = document.getElementById('cli-cliente');
//         if (selForm) {
//             const opts = clientesInternosCache
//                 .map(m => `<option value="${m.id}">${m.nombre}</option>`).join('');
//             selForm.innerHTML = '<option value="">— Seleccione cliente —</option>' + opts;
//             tsInstances['cli-cliente'] = initTomSelect(selForm, { placeholder: 'Seleccione un cliente...' });
//         }
//         // Select del tab Consultar
//         const selCns = document.getElementById('cns-cliente-interno');
//         if (selCns) {
//             const opts = clientesInternosCache
//                 .map(m => `<option value="${m.id}">${m.nombre}</option>`).join('');
//             selCns.innerHTML = '<option value="">— Todos —</option>' + opts;
//             tsInstances['cns-cliente-interno'] = initTomSelect(selCns, {
//                 placeholder: 'Seleccione cliente interno...',
//                 onChange(value) { onCnsClienteInternoChange(value); },
//             });
//         }
//     }

//     /* ══════════════════════════════════════════════════════
//      *  CLIENTES EXTERNOS
//      * ══════════════════════════════════════════════════════ */
//     const cli = { modoEdicion: false, datos: [] };

//     async function listarClientes() {
//         try {
//             const json = await post(API.clientes.listar());
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             cli.datos = json.data ?? [];
//             renderClientes(cli.datos);
//             actualizarBadge('badge-clientes', cli.datos.length);
//             llenarSelectClientes(cli.datos);
//         } catch (e) { console.error('listarClientes:', e); }
//     }

//     function renderClientes(lista) {
//         const tbody = document.getElementById('tbody-clientes');
//         if (!lista.length) {
//             tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state">
//                 <div class="es-icon"><i class="bi bi-building"></i></div>
//                 <div class="es-title">Sin clientes registrados</div>
//                 <div class="es-sub">Crea el primer cliente externo</div>
//             </div></td></tr>`;
//             return;
//         }
//         tbody.innerHTML = '';
//         tbody.innerHTML = lista.map((r, i) => `
//             <tr>
//                 <td>${i + 1}</td>
//                 <td>${r.cliente_interno?.nombre ?? '-'}</td>
//                 <td>${r.nit_cliente ?? '-'}</td>
//                 <td><strong>${r.razon_social ?? '-'}</strong></td>
//                 <td>${r.ciudad ?? '-'}</td>
//                 <td>${r.direccion ?? '-'}</td>
//                 <td>${r.hora_inicio ?? '-'}</td>
//                 <td>${r.hora_fin ?? '-'}</td>
//                 <td>${badgeEstado(r.estado)}</td>
//                 <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
//                 <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
//                 <td><div class="d-flex gap-1">
//                     <button class="action-btn ab-edit" title="Editar"
//                         data-accion="editar-cliente" data-id="${r.id}">
//                         <i class="bi bi-pencil-fill"></i>
//                     </button>
//                     <button class="action-btn ab-toggle"
//                         title="${r.estado === 'activo' ? 'Desactivar' : 'Activar'}"
//                         data-accion="toggle-cliente" data-id="${r.id}" data-estado="${r.estado}">
//                         <i class="bi bi-${r.estado === 'activo' ? 'toggle-on' : 'toggle-off'}"></i>
//                     </button>
//                 </div></td>
//             </tr>`).join('');

//         setTimeout(() => inicializarDataTable('#tbl-clientes-externos'), 100);
//     }

//     async function guardarCliente() {
//         ocultarAlerta('alert-clientes');
//         const id = document.getElementById('cli-id').value;
//         const cliCliente = document.getElementById('cli-cliente').value.trim();
//         const nit = document.getElementById('cli-nit').value.trim();
//         const razon = document.getElementById('cli-razon').value.trim();
//         const ciudad = document.getElementById('cli-ciudad').value;
//         const direccion = document.getElementById('cli-direccion').value.trim();
//         const horaInicio = document.getElementById('cli-hora-inicio').value;
//         const horaFin = document.getElementById('cli-hora-fin').value;
//         const estado = document.getElementById('cli-estado').value;
//         const usuario = document.getElementById('ssn_usuario').value;

//         if (!nit || !razon || !ciudad || !estado) {
//             mostrarAlerta('alert-clientes', 'Complete los campos obligatorios (*).');
//             return;
//         }

//         const btn = document.getElementById('btn-guardar-cliente');
//         btn.disabled = true;
//         btn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Guardando…';

//         try {
//             const params = {
//                 cliente_id: cliCliente,
//                 nit_cliente: nit,
//                 razon_social: razon,
//                 ciudad,
//                 direccion,
//                 hora_inicio: horaInicio,
//                 hora_fin: horaFin,
//                 estado,
//                 usuario,
//             };
//             if (cli.modoEdicion) params.id = id;
//             const json = await post(
//                 cli.modoEdicion ? API.clientes.actualizar() : API.clientes.guardar(), params
//             );
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             mostrarAlerta('alert-clientes', json.mensaje, 'success');
//             resetFormCliente();
//             await listarClientes();
//         } catch (e) {
//             mostrarAlerta('alert-clientes', e.message);
//         } finally {
//             btn.disabled = false;
//             btn.innerHTML = '<i class="bi bi-check-lg"></i> Guardar';
//         }
//     }

//     async function editarCliente(id) {
//         try {
//             const json = await post(API.clientes.obtener(), { id });
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             const r = json.data;
//             await cargarMunicipios();
//             await cargarClientesInternos();

//             document.getElementById('cli-id').value = r.id;
//             document.getElementById('cli-nit').value = r.nit_cliente ?? '';
//             document.getElementById('cli-razon').value = r.razon_social ?? '';
//             document.getElementById('cli-direccion').value = r.direccion ?? '';
//             document.getElementById('cli-hora-inicio').value = r.hora_inicio ?? '';
//             document.getElementById('cli-hora-fin').value = r.hora_fin ?? '';
//             document.getElementById('cli-estado').value = r.estado ?? 'activo';

//             if (tsInstances['cli-cliente']) tsInstances['cli-cliente'].setValue(r.cliente_id ?? '');
//             if (tsInstances['cli-ciudad']) tsInstances['cli-ciudad'].setValue(r.ciudad ?? '');

//             cli.modoEdicion = true;
//             toggleForm('form-card-clientes', true, 'Editar Cliente Externo');
//             document.getElementById('form-card-clientes').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//         } catch (e) { alert('Error al cargar cliente: ' + e.message); }
//     }

//     async function toggleCliente(id, estadoActual) {
//         try {
//             const json = await post(API.clientes.cambiarEstado(), {
//                 id, estado: estadoActual === 'activo' ? 'inactivo' : 'activo',
//             });
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             await listarClientes();
//         } catch (e) { alert('Error al cambiar estado: ' + e.message); }
//     }

//     function resetFormCliente() {
//         ['cli-id', 'cli-nit', 'cli-razon', 'cli-direccion', 'cli-hora-inicio', 'cli-hora-fin']
//             .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
//         if (tsInstances['cli-cliente']) tsInstances['cli-cliente'].clear();
//         if (tsInstances['cli-ciudad']) tsInstances['cli-ciudad'].clear();
//         document.getElementById('cli-estado').value = 'activo';
//         cli.modoEdicion = false;
//         toggleForm('form-card-clientes', false);
//         ocultarAlerta('alert-clientes');
//     }

//     /** Llena el select rem-cliente en el tab de remitentes */
//     function llenarSelectClientes(lista) {
//         const sel = document.getElementById('rem-cliente');
//         if (!sel) return;
//         const valorActual = sel.value;
//         sel.innerHTML = '<option value="">— Seleccione cliente —</option>';
//         lista.filter(c => c.estado === 'activo').forEach(c => {
//             sel.innerHTML += `<option value="${c.id}">${c.razon_social}</option>`;
//         });
//         tsInstances['rem-cliente'] = initTomSelect(sel, { placeholder: 'Seleccione un cliente externo...' });
//         if (valorActual) tsInstances['rem-cliente'].setValue(valorActual);
//     }

//     /* ══════════════════════════════════════════════════════
//      *  REMITENTES / DESTINATARIOS
//      * ══════════════════════════════════════════════════════ */
//     const rem = { modoEdicion: false, datos: [] };

//     async function listarRemitentes() {
//         try {
//             const json = await post(API.remitentes.listar());
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             rem.datos = json.data ?? [];
//             renderRemitentes(rem.datos);
//             actualizarBadge('badge-remitentes', rem.datos.length);
//             llenarSelectRemitentes(rem.datos);
//         } catch (e) { console.error('listarRemitentes:', e); }
//     }

//     function renderRemitentes(lista) {
//         const tbody = document.getElementById('tbody-remitentes');
//         if (!lista.length) {
//             tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state">
//                 <div class="es-icon"><i class="bi bi-people"></i></div>
//                 <div class="es-title">Sin remitentes registrados</div>
//                 <div class="es-sub">Crea el primer remitente o destinatario</div>
//             </div></td></tr>`;
//             return;
//         }
//         tbody.innerHTML = lista.map((r, i) => `
//             <tr>
//                 <td>${i + 1}</td>
//                 <td>${r.id}</td>
//                 <td>${r.cliente.cliente_interno?.nombre ?? '-'}</td>
//                 <td>${r.cliente?.razon_social ?? '-'}</td>
//                 <td><strong>${r.nombre_remitente_destinatario ?? '-'}</strong></td>
//                 <td>${r.ciudad ?? '-'}</td>
//                 <td style="font-family:monospace;font-size:.75rem">${r.latitud ?? '-'}</td>
//                 <td style="font-family:monospace;font-size:.75rem">${r.longitud ?? '-'}</td>
//                 <td>${renderHorarioPills(r.horarios ?? [])}</td>
//                 <td>${badgeEstado(r.estado)}</td>
//                 <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
//                 <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
//                 <td><div class="d-flex gap-1">
//                     <button class="action-btn ab-edit" title="Editar"
//                         data-accion="editar-remitente" data-id="${r.id}">
//                         <i class="bi bi-pencil-fill"></i>
//                     </button>
//                     <button class="action-btn ab-toggle"
//                         title="${r.estado === 'activo' ? 'Desactivar' : 'Activar'}"
//                         data-accion="toggle-remitente" data-id="${r.id}" data-estado="${r.estado}">
//                         <i class="bi bi-${r.estado === 'activo' ? 'toggle-on' : 'toggle-off'}"></i>
//                     </button>
//                 </div></td>
//             </tr>`).join('');

//         setTimeout(() => inicializarDataTable('#tbl-remitentes'), 100);
//     }

//     function renderHorarioPills(horarios) {
//         if (!horarios.length) return '<span style="color:var(--slate-400);font-size:.72rem">Sin horarios</span>';
//         return `<div class="horario-pills">${horarios.map(h =>
//             `<span class="horario-pill"><i class="bi bi-clock"></i>${h.hora_inicio} – ${h.hora_fin}</span>`
//         ).join('')}</div>`;
//     }

//     /* ── Horarios múltiples ── */
//     function agregarFilaHorario(horario = null) {
//         const contenedor = document.getElementById('rem-horarios-container');
//         if (!contenedor) return;
//         const num = contenedor.children.length + 1;
//         const row = document.createElement('div');
//         row.className = 'horario-row';
//         row.dataset.horarioId = horario?.id ?? '';
//         row.innerHTML = `
//             <span class="h-num">${num}</span>
//             <span class="h-label">Entrada</span>
//             <input type="time" class="h-input rem-hora-inicio" value="${horario?.hora_inicio ?? ''}" required>
//             <span class="h-sep"><i class="bi bi-arrow-right"></i></span>
//             <span class="h-label">Salida</span>
//             <input type="time" class="h-input rem-hora-fin" value="${horario?.hora_fin ?? ''}" required>
//             <button type="button" class="btn-del-horario btn-eliminar-horario" title="Eliminar horario"
//                 ${horario?.id ? `data-horario-id="${horario.id}"` : ''}>
//                 <i class="bi bi-trash-fill"></i>
//             </button>`;
//         contenedor.appendChild(row);
//         actualizarNumerosHorario();
//     }

//     function actualizarNumerosHorario() {
//         document.querySelectorAll('#rem-horarios-container .horario-row').forEach((row, i) => {
//             const num = row.querySelector('.h-num');
//             if (num) num.textContent = i + 1;
//         });
//     }

//     async function eliminarFilaHorario(btn) {
//         const row = btn.closest('.horario-row');
//         const horarioId = btn.dataset.horarioId;
//         if (horarioId) {
//             try {
//                 const json = await post(API.horarios.eliminar(), { id: horarioId });
//                 if (json.numero !== 200) throw new Error(json.mensaje);
//             } catch (e) { alert('Error al eliminar horario: ' + e.message); return; }
//         }
//         row.remove();
//         actualizarNumerosHorario();
//         const contenedor = document.getElementById('rem-horarios-container');
//         if (contenedor && contenedor.children.length === 0) agregarFilaHorario();
//     }

//     function recogerHorarios() {
//         return Array.from(
//             document.querySelectorAll('#rem-horarios-container .horario-row')
//         ).map(row => ({
//             id: row.dataset.horarioId || null,
//             hora_inicio: row.querySelector('.rem-hora-inicio').value,
//             hora_fin: row.querySelector('.rem-hora-fin').value,
//         })).filter(h => h.hora_inicio && h.hora_fin);
//     }

//     async function guardarRemitente() {
//         ocultarAlerta('alert-remitentes');
//         const id = document.getElementById('rem-id').value;
//         const cliente = document.getElementById('rem-cliente').value;
//         const nombre = document.getElementById('rem-nombre').value.trim();
//         const ciudad = document.getElementById('rem-ciudad').value;
//         const lat = document.getElementById('rem-lat').value.trim();
//         const lng = document.getElementById('rem-lng').value.trim();
//         const estado = document.getElementById('rem-estado').value;
//         const usuario = document.getElementById('ssn_usuario').value;
//         const horarios = recogerHorarios();

//         if (!cliente || !nombre || !ciudad || !lat || !lng) {
//             mostrarAlerta('alert-remitentes', 'Complete los campos obligatorios (*).');
//             return;
//         }
//         if (!horarios.length) {
//             mostrarAlerta('alert-remitentes', 'Agregue al menos un horario de entrada y salida.');
//             return;
//         }

//         const btn = document.getElementById('btn-guardar-remitente');
//         btn.disabled = true;
//         btn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Guardando…';

//         try {
//             const params = {
//                 id_cliente: cliente,
//                 nombre_remitente_destinatario: nombre,
//                 ciudad, latitud: lat, longitud: lng, estado, usuario,
//                 horarios: JSON.stringify(horarios),
//             };
//             if (rem.modoEdicion) params.id = id;
//             const json = await post(
//                 rem.modoEdicion ? API.remitentes.actualizar() : API.remitentes.guardar(), params
//             );
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             mostrarAlerta('alert-remitentes', json.mensaje, 'success');
//             resetFormRemitente();
//             await listarRemitentes();
//         } catch (e) {
//             mostrarAlerta('alert-remitentes', e.message);
//         } finally {
//             btn.disabled = false;
//             btn.innerHTML = '<i class="bi bi-check-lg"></i> Guardar';
//         }
//     }

//     async function editarRemitente(id) {
//         try {
//             const json = await post(API.remitentes.obtener(), { id });
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             const r = json.data;
//             await cargarMunicipios();

//             document.getElementById('rem-id').value = r.id;
//             document.getElementById('rem-nombre').value = r.nombre_remitente_destinatario ?? '';
//             document.getElementById('rem-lat').value = r.latitud ?? '';
//             document.getElementById('rem-lng').value = r.longitud ?? '';
//             document.getElementById('rem-estado').value = r.estado ?? 'activo';

//             if (tsInstances['rem-cliente']) tsInstances['rem-cliente'].setValue(r.id_cliente ?? '');
//             if (tsInstances['rem-ciudad']) tsInstances['rem-ciudad'].setValue(r.ciudad ?? '');

//             const contenedor = document.getElementById('rem-horarios-container');
//             contenedor.innerHTML = '';
//             const horarios = r.horarios ?? [];
//             if (horarios.length) horarios.forEach(h => agregarFilaHorario(h));
//             else agregarFilaHorario();

//             rem.modoEdicion = true;
//             toggleForm('form-card-remitentes', true, 'Editar Remitente / Destinatario');
//             document.getElementById('form-card-remitentes').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//         } catch (e) { alert('Error al cargar remitente: ' + e.message); }
//     }

//     async function toggleRemitente(id, estadoActual) {
//         try {
//             const json = await post(API.remitentes.cambiarEstado(), {
//                 id, estado: estadoActual === 'activo' ? 'inactivo' : 'activo',
//             });
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             await listarRemitentes();
//         } catch (e) { alert('Error al cambiar estado: ' + e.message); }
//     }

//     function resetFormRemitente() {
//         ['rem-id', 'rem-nombre', 'rem-lat', 'rem-lng'].forEach(id => {
//             const el = document.getElementById(id); if (el) el.value = '';
//         });
//         if (tsInstances['rem-cliente']) tsInstances['rem-cliente'].clear();
//         if (tsInstances['rem-ciudad']) tsInstances['rem-ciudad'].clear();
//         document.getElementById('rem-estado').value = 'activo';
//         const contenedor = document.getElementById('rem-horarios-container');
//         if (contenedor) { contenedor.innerHTML = ''; agregarFilaHorario(); }
//         rem.modoEdicion = false;
//         toggleForm('form-card-remitentes', false);
//         ocultarAlerta('alert-remitentes');
//     }

//     function llenarSelectRemitentes(lista) {
//         const sel = document.getElementById('geo-remitente');
//         if (!sel) return;
//         const valorActual = sel.value;
//         sel.innerHTML = '<option value="">— Seleccione remitente/dest. —</option>';
//         lista.filter(r => r.estado === 'activo').forEach(r => {
//             sel.innerHTML += `<option value="${r.id}" data-ciudad="${r.ciudad ?? ''}">${r.nombre_remitente_destinatario}</option>`;
//         });
//         tsInstances['geo-remitente'] = initTomSelect(sel, {
//             placeholder: 'Seleccione remitente...',
//             onChange(value) {
//                 const opt = sel.querySelector(`option[value="${value}"]`);
//                 const ciudad = opt ? (opt.dataset.ciudad ?? '') : '';
//                 const display = document.getElementById('geo-ciudad-display');
//                 const input = document.getElementById('geo-ciudad');
//                 if (display) display.textContent = ciudad || '—';
//                 if (input) input.value = ciudad;
//             },
//         });
//         if (valorActual) tsInstances['geo-remitente'].setValue(valorActual);
//     }

//     /* ══════════════════════════════════════════════════════
//      *  GEOCERCAS
//      * ══════════════════════════════════════════════════════ */
//     const geo = { modoEdicion: false, datos: [] };

//     async function listarGeocercas() {
//         try {
//             const json = await post(API.geocercas.listar());
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             geo.datos = json.data ?? [];
//             renderGeocercas(geo.datos);
//             actualizarBadge('badge-geocercas', geo.datos.length);
//         } catch (e) { console.error('listarGeocercas:', e); }
//     }

//     function renderGeocercas(lista) {
//         const tbody = document.getElementById('tbody-geocercas');
//         if (!lista.length) {
//             tbody.innerHTML = `<tr><td colspan="10"><div class="empty-state">
//                 <div class="es-icon"><i class="bi bi-geo"></i></div>
//                 <div class="es-title">Sin geocercas registradas</div>
//                 <div class="es-sub">Crea la primera geocerca</div>
//             </div></td></tr>`;
//             return;
//         }
//         tbody.innerHTML = lista.map((r, i) => `
//             <tr>
//                 <td>${i + 1}</td>
//                 <td>${r.remitente_destinatario?.cliente?.cliente_interno?.nombre ?? '-'}</td>
//                 <td>${r.remitente_destinatario?.cliente?.razon_social ?? '-'}</td>
//                 <td>${r.remitente_destinatario?.nombre_remitente_destinatario ?? '-'}</td>
//                 <td><strong>${r.nombre_punto_geo ?? '-'}</strong></td>
//                 <td>${r.ciudad ?? '-'}</td>
//                 <td style="font-family:monospace;font-size:.75rem">${r.latitud ?? '-'}</td>
//                 <td style="font-family:monospace;font-size:.75rem">${r.longitud ?? '-'}</td>
//                 <td>${badgeEstado(r.estado)}</td>
//                 <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
//                 <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
//                 <td><div class="d-flex gap-1">
//                     <button class="action-btn ab-edit" title="Editar"
//                         data-accion="editar-geocerca" data-id="${r.id}">
//                         <i class="bi bi-pencil-fill"></i>
//                     </button>
//                     <button class="action-btn ab-toggle"
//                         title="${r.estado === 'activo' ? 'Desactivar' : 'Activar'}"
//                         data-accion="toggle-geocerca" data-id="${r.id}" data-estado="${r.estado}">
//                         <i class="bi bi-${r.estado === 'activo' ? 'toggle-on' : 'toggle-off'}"></i>
//                     </button>
//                 </div></td>
//             </tr>`).join('');

//         setTimeout(() => inicializarDataTable('#tbl-geocercas'), 100);
//     }

//     async function guardarGeocerca() {
//         ocultarAlerta('alert-geocercas');
//         const id = document.getElementById('geo-id').value;
//         const remitente = document.getElementById('geo-remitente').value;
//         const nombre = document.getElementById('geo-nombre').value.trim();
//         const ciudad = document.getElementById('geo-ciudad').value;
//         const lat = document.getElementById('geo-lat').value.trim();
//         const lng = document.getElementById('geo-lng').value.trim();
//         const estado = document.getElementById('geo-estado').value;
//         const usuario = document.getElementById('ssn_usuario').value;

//         if (!remitente || !nombre || !lat || !lng) {
//             mostrarAlerta('alert-geocercas', 'Complete los campos obligatorios (*).');
//             return;
//         }

//         const btn = document.getElementById('btn-guardar-geocerca');
//         btn.disabled = true;
//         btn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Guardando…';

//         try {
//             const params = { id_rem_des: remitente, nombre_punto_geo: nombre, ciudad, latitud: lat, longitud: lng, estado, usuario };
//             if (geo.modoEdicion) params.id = id;
//             const json = await post(
//                 geo.modoEdicion ? API.geocercas.actualizar() : API.geocercas.guardar(), params
//             );
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             mostrarAlerta('alert-geocercas', json.mensaje, 'success');
//             resetFormGeocerca();
//             await listarGeocercas();
//         } catch (e) {
//             mostrarAlerta('alert-geocercas', e.message);
//         } finally {
//             btn.disabled = false;
//             btn.innerHTML = '<i class="bi bi-check-lg"></i> Guardar';
//         }
//     }

//     async function editarGeocerca(id) {
//         try {
//             const json = await post(API.geocercas.obtener(), { id });
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             const r = json.data;
//             document.getElementById('geo-id').value = r.id;
//             document.getElementById('geo-nombre').value = r.nombre_punto_geo ?? '';
//             document.getElementById('geo-lat').value = r.latitud ?? '';
//             document.getElementById('geo-lng').value = r.longitud ?? '';
//             document.getElementById('geo-estado').value = r.estado ?? 'activo';
//             document.getElementById('geo-ciudad').value = r.ciudad ?? '';
//             const display = document.getElementById('geo-ciudad-display');
//             if (display) display.textContent = r.ciudad || '—';
//             if (tsInstances['geo-remitente']) tsInstances['geo-remitente'].setValue(r.id_rem_des ?? '');
//             geo.modoEdicion = true;
//             toggleForm('form-card-geocercas', true, 'Editar Geocerca');
//             document.getElementById('form-card-geocercas').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//         } catch (e) { alert('Error al cargar geocerca: ' + e.message); }
//     }

//     async function toggleGeocerca(id, estadoActual) {
//         try {
//             const json = await post(API.geocercas.cambiarEstado(), {
//                 id, estado: estadoActual === 'activo' ? 'inactivo' : 'activo',
//             });
//             if (json.numero !== 200) throw new Error(json.mensaje);
//             await listarGeocercas();
//         } catch (e) { alert('Error al cambiar estado: ' + e.message); }
//     }

//     function resetFormGeocerca() {
//         ['geo-id', 'geo-nombre', 'geo-lat', 'geo-lng', 'geo-ciudad'].forEach(id => {
//             const el = document.getElementById(id); if (el) el.value = '';
//         });
//         if (tsInstances['geo-remitente']) tsInstances['geo-remitente'].clear();
//         const display = document.getElementById('geo-ciudad-display');
//         if (display) display.textContent = '—';
//         document.getElementById('geo-estado').value = 'activo';
//         geo.modoEdicion = false;
//         toggleForm('form-card-geocercas', false);
//         ocultarAlerta('alert-geocercas');
//     }

//     /* ══════════════════════════════════════════════════════
//      *  TAB CONSULTAR
//      * ══════════════════════════════════════════════════════ */
//     let consultaInicializada = false;
//     let consultaDatos = [];  // cache de los resultados actuales para exportar

//     async function inicializarConsulta() {
//         if (consultaInicializada) return;
//         consultaInicializada = true;
//         await cargarClientesInternos();
//     }

//     /** Cuando cambia el cliente interno: carga clientes externos asociados */
//     function onCnsClienteInternoChange(clienteInternoId) {
//         const selExt = document.getElementById('cns-cliente-externo');
//         const selRem = document.getElementById('cns-remitente');
//         if (!selExt) return;

//         // Resetear cascada
//         selExt.innerHTML = '<option value="">— Todos —</option>';
//         selExt.disabled = true;
//         if (tsInstances['cns-cliente-externo']) tsInstances['cns-cliente-externo'].destroy();
//         selRem.innerHTML = '<option value="">— Todos —</option>';
//         selRem.disabled = true;
//         if (tsInstances['cns-remitente']) tsInstances['cns-remitente'].destroy();

//         if (!clienteInternoId) return;

//         // Filtrar clientes externos del cache que pertenecen a este cliente interno
//         const externosFiltrados = cli.datos.filter(
//             c => String(c.cliente_id) === String(clienteInternoId)
//         );

//         if (!externosFiltrados.length) {
//             selExt.innerHTML = '<option value="">— Sin clientes externos —</option>';
//             tsInstances['cns-cliente-externo'] = initTomSelect(selExt, { placeholder: 'Sin resultados...' });
//             return;
//         }

//         const opts = externosFiltrados
//             .map(c => `<option value="${c.id}">${c.razon_social}</option>`).join('');
//         selExt.innerHTML = '<option value="">— Todos —</option>' + opts;
//         selExt.disabled = false;

//         tsInstances['cns-cliente-externo'] = initTomSelect(selExt, {
//             placeholder: 'Seleccione cliente externo...',
//             onChange(value) { onCnsClienteExternoChange(value); },
//         });
//     }

//     /** Cuando cambia el cliente externo: carga remitentes asociados */
//     function onCnsClienteExternoChange(clienteExternoId) {
//         const selRem = document.getElementById('cns-remitente');
//         if (!selRem) return;

//         selRem.innerHTML = '<option value="">— Todos —</option>';
//         selRem.disabled = true;
//         if (tsInstances['cns-remitente']) tsInstances['cns-remitente'].destroy();

//         if (!clienteExternoId) return;

//         const remitentesFiltrados = rem.datos.filter(
//             r => String(r.id_cliente) === String(clienteExternoId)
//         );

//         const opts = remitentesFiltrados
//             .map(r => `<option value="${r.id}">${r.nombre_remitente_destinatario}</option>`).join('');
//         selRem.innerHTML = '<option value="">— Todos —</option>' + opts;
//         selRem.disabled = false;

//         tsInstances['cns-remitente'] = initTomSelect(selRem, {
//             placeholder: 'Seleccione remitente...',
//         });
//     }

//     /** Ejecuta la consulta con los filtros actuales */
//     async function ejecutarConsulta() {
//         const clienteInternoId = document.getElementById('cns-cliente-interno')?.value ?? '';
//         const clienteExternoId = document.getElementById('cns-cliente-externo')?.value ?? '';
//         const remitenteId = document.getElementById('cns-remitente')?.value ?? '';
//         const ciudadFiltro = (document.getElementById('cns-ciudad-filtro')?.value ?? '').toLowerCase();
//         const estadoFiltro = document.getElementById('cns-estado-filtro')?.value ?? '';

//         // UI: mostrar spinner
//         document.getElementById('cns-estado-inicial').style.display = 'none';
//         document.getElementById('cns-spinner').style.display = 'flex';
//         document.getElementById('cns-tabla-wrapper').style.display = 'none';
//         document.getElementById('kpi-row').style.display = 'none';
//         document.getElementById('btn-excel-consulta').disabled = true;

//         try {
//             // Construir resultado desde los caches locales (sin necesidad de endpoint extra)
//             let resultado = rem.datos.map(r => ({
//                 ...r,
//                 cliente_externo: cli.datos.find(c => c.id === r.id_cliente) ?? null,
//                 cliente_interno: null, // se resuelve abajo
//             }));

//             // Resolver cliente interno
//             resultado.forEach(r => {
//                 const ext = r.cliente_externo;
//                 if (ext) {
//                     r.cliente_interno = clientesInternosCache.find(ci => ci.id === ext.cliente_id) ?? null;
//                 }
//             });

//             // Aplicar filtros
//             if (clienteInternoId) {
//                 resultado = resultado.filter(r => String(r.cliente_interno?.id) === String(clienteInternoId));
//             }
//             if (clienteExternoId) {
//                 resultado = resultado.filter(r => String(r.id_cliente) === String(clienteExternoId));
//             }
//             if (remitenteId) {
//                 resultado = resultado.filter(r => String(r.id) === String(remitenteId));
//             }
//             if (ciudadFiltro) {
//                 resultado = resultado.filter(r => (r.ciudad ?? '').toLowerCase().includes(ciudadFiltro));
//             }
//             if (estadoFiltro) {
//                 resultado = resultado.filter(r => r.estado === estadoFiltro);
//             }

//             consultaDatos = resultado;
//             renderConsulta(resultado);

//         } catch (e) {
//             console.error('ejecutarConsulta:', e);
//             document.getElementById('cns-spinner').style.display = 'none';
//             document.getElementById('cns-estado-inicial').style.display = 'flex';
//         }
//     }

//     function renderConsulta(lista) {
//         document.getElementById('cns-spinner').style.display = 'none';

//         // KPIs
//         const clientesExtUnicos = new Set(lista.map(r => r.id_cliente)).size;
//         const totalHorarios = lista.reduce((acc, r) => acc + (r.horarios?.length ?? 0), 0);
//         const totalActivos = lista.filter(r => r.estado === 'activo').length;
//         document.getElementById('kpi-clientes-ext').textContent = clientesExtUnicos;
//         document.getElementById('kpi-remitentes').textContent = lista.length;
//         document.getElementById('kpi-horarios').textContent = totalHorarios;
//         document.getElementById('kpi-activos').textContent = totalActivos;
//         document.getElementById('kpi-row').style.display = lista.length ? 'flex' : 'none';

//         actualizarBadge('badge-consulta', lista.length);

//         const tbody = document.getElementById('tbody-consulta');

//         if (!lista.length) {
//             tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state">
//                 <div class="es-icon"><i class="bi bi-search"></i></div>
//                 <div class="es-title">Sin resultados</div>
//                 <div class="es-sub">Ajusta los filtros e intenta de nuevo</div>
//             </div></td></tr>`;
//             document.getElementById('cns-tabla-wrapper').style.display = 'block';
//             return;
//         }

//         tbody.innerHTML = lista.map((r, i) => `
//             <tr>
//                 <td>${i + 1}</td>
//                 <td>${r.cliente_interno?.nombre ?? '-'}</td>
//                 <td>${r.cliente_externo?.razon_social ?? '-'}</td>
//                 <td>${r.cliente_externo?.nit_cliente ?? '-'}</td>
//                 <td><strong>${r.nombre_remitente_destinatario ?? '-'}</strong></td>
//                 <td>${r.ciudad ?? '-'}</td>
//                 <td style="font-family:monospace;font-size:.75rem">${r.latitud ?? '-'}</td>
//                 <td style="font-family:monospace;font-size:.75rem">${r.longitud ?? '-'}</td>
//                 <td>${renderHorarioPills(r.horarios ?? [])}</td>
//                 <td>${badgeEstado(r.estado)}</td>
//                 <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
//                 <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
//             </tr>`).join('');

//         document.getElementById('cns-tabla-wrapper').style.display = 'block';
//         document.getElementById('btn-excel-consulta').disabled = false;

//         setTimeout(() => inicializarDataTable('#tbl-consulta', { columnDefs: [{ orderable: false, targets: -1 }] }), 100);
//     }

//     function limpiarConsulta() {
//         if (tsInstances['cns-cliente-interno']) tsInstances['cns-cliente-interno'].clear();
//         if (tsInstances['cns-cliente-externo']) tsInstances['cns-cliente-externo']?.clear();
//         if (tsInstances['cns-remitente']) tsInstances['cns-remitente']?.clear();

//         const selExt = document.getElementById('cns-cliente-externo');
//         const selRem = document.getElementById('cns-remitente');
//         if (selExt) { selExt.innerHTML = '<option value="">— Seleccione cliente interno —</option>'; selExt.disabled = true; }
//         if (selRem) { selRem.innerHTML = '<option value="">— Todos —</option>'; selRem.disabled = true; }

//         const ciudadEl = document.getElementById('cns-ciudad-filtro');
//         const estadoEl = document.getElementById('cns-estado-filtro');
//         if (ciudadEl) ciudadEl.value = '';
//         if (estadoEl) estadoEl.value = '';

//         document.getElementById('cns-estado-inicial').style.display = 'flex';
//         document.getElementById('cns-spinner').style.display = 'none';
//         document.getElementById('cns-tabla-wrapper').style.display = 'none';
//         document.getElementById('kpi-row').style.display = 'none';
//         document.getElementById('btn-excel-consulta').disabled = true;
//         consultaDatos = [];
//     }

//     /* ══════════════════════════════════════════════════════
//      *  EVENT LISTENERS
//      * ══════════════════════════════════════════════════════ */
//     function initEventListeners() {

//         document.addEventListener('click', async (e) => {

//             // ── Clientes ──
//             if (e.target.closest('#btn-nuevo-cliente')) {
//                 resetFormCliente();
//                 await cargarMunicipios();
//                 await cargarClientesInternos();
//                 toggleForm('form-card-clientes', true, 'Remitente / Destinatario');
//                 document.getElementById('form-card-clientes').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//             }
//             if (e.target.closest('#btn-cancelar-cliente, #btn-cancelar-cliente-2')) resetFormCliente();
//             if (e.target.closest('#btn-guardar-cliente')) await guardarCliente();

//             const btnEditCli = e.target.closest('[data-accion="editar-cliente"]');
//             if (btnEditCli) await editarCliente(btnEditCli.dataset.id);
//             const btnToggleCli = e.target.closest('[data-accion="toggle-cliente"]');
//             if (btnToggleCli) await toggleCliente(btnToggleCli.dataset.id, btnToggleCli.dataset.estado);

//             // Excel clientes
//             if (e.target.closest('#btn-excel-clientes'))
//                 exportarExcel('#tbl-clientes-externos', 'Clientes_Externos');

//             // ── Remitentes ──
//             if (e.target.closest('#btn-nuevo-remitente')) {
//                 resetFormRemitente();
//                 await cargarMunicipios();
//                 toggleForm('form-card-remitentes', true, 'Nuevo Remitente / Destinatario');
//                 document.getElementById('form-card-remitentes').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//             }
//             if (e.target.closest('#btn-cancelar-remitente, #btn-cancelar-remitente-2')) resetFormRemitente();
//             if (e.target.closest('#btn-guardar-remitente')) await guardarRemitente();

//             const btnEditRem = e.target.closest('[data-accion="editar-remitente"]');
//             if (btnEditRem) await editarRemitente(btnEditRem.dataset.id);
//             const btnToggleRem = e.target.closest('[data-accion="toggle-remitente"]');
//             if (btnToggleRem) await toggleRemitente(btnToggleRem.dataset.id, btnToggleRem.dataset.estado);

//             // Horarios
//             if (e.target.closest('#btn-agregar-horario')) agregarFilaHorario();
//             const btnElimHorario = e.target.closest('.btn-eliminar-horario');
//             if (btnElimHorario) await eliminarFilaHorario(btnElimHorario);

//             // Excel remitentes
//             if (e.target.closest('#btn-excel-remitentes'))
//                 exportarExcel('#tbl-remitentes', 'Remitentes_Destinatarios');

//             // ── Geocercas ──
//             if (e.target.closest('#btn-nueva-geocerca')) {
//                 resetFormGeocerca();
//                 toggleForm('form-card-geocercas', true, 'Nueva Geocerca');
//                 document.getElementById('form-card-geocercas').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//             }
//             if (e.target.closest('#btn-cancelar-geocerca, #btn-cancelar-geocerca-2')) resetFormGeocerca();
//             if (e.target.closest('#btn-guardar-geocerca')) await guardarGeocerca();

//             const btnEditGeo = e.target.closest('[data-accion="editar-geocerca"]');
//             if (btnEditGeo) await editarGeocerca(btnEditGeo.dataset.id);
//             const btnToggleGeo = e.target.closest('[data-accion="toggle-geocerca"]');
//             if (btnToggleGeo) await toggleGeocerca(btnToggleGeo.dataset.id, btnToggleGeo.dataset.estado);

//             // Excel geocercas
//             if (e.target.closest('#btn-excel-geocercas'))
//                 exportarExcel('#tbl-geocercas', 'Geocercas');

//             // ── Consultar ──
//             if (e.target.closest('#btn-consultar')) await ejecutarConsulta();
//             if (e.target.closest('#btn-limpiar-consulta')) limpiarConsulta();
//             if (e.target.closest('#btn-excel-consulta'))
//                 exportarExcel('#tbl-consulta', 'Consulta_Remitentes');
//         });
//     }

//     /* ══════════════════════════════════════════════════════
//      *  INIT
//      * ══════════════════════════════════════════════════════ */
//     async function init() {
//         initTabs();
//         initEventListeners();
//         agregarFilaHorario();  // una fila vacía por defecto

//         await Promise.all([
//             listarClientes(),
//             listarRemitentes(),
//             listarGeocercas(),
//         ]);
//     }

//     if (document.readyState === 'loading') {
//         document.addEventListener('DOMContentLoaded', init);
//     } else {
//         init();
//     }

// })();



'use strict';

(function () {

    /* ══════════════════════════════════════════════════════
     *  CONFIG
     * ══════════════════════════════════════════════════════ */
    const baseUrl = () => document.getElementById('base_url_api').value;

    const API = {
        municipios: () => baseUrl() + 'municipios/listar',
        clientesInternos: () => baseUrl() + 'clientes/listar',
        clientes: {
            listar: () => baseUrl() + 'clientes-ext/listar',
            guardar: () => baseUrl() + 'clientes-ext/guardar',
            obtener: () => baseUrl() + 'clientes-ext/obtener',
            actualizar: () => baseUrl() + 'clientes-ext/actualizar',
            cambiarEstado: () => baseUrl() + 'clientes-ext/cambiar-estado',
        },
        remitentes: {
            listar: () => baseUrl() + 'remitentes/listar',
            guardar: () => baseUrl() + 'remitentes/guardar',
            obtener: () => baseUrl() + 'remitentes/obtener',
            actualizar: () => baseUrl() + 'remitentes/actualizar',
            cambiarEstado: () => baseUrl() + 'remitentes/cambiar-estado',
        },
        horarios: {
            listar: () => baseUrl() + 'remitentes/horarios/listar',
            guardar: () => baseUrl() + 'remitentes/horarios/guardar',
            eliminar: () => baseUrl() + 'remitentes/horarios/eliminar',
        },
        geocercas: {
            listar: () => baseUrl() + 'geocercas/listar',
            guardar: () => baseUrl() + 'geocercas/guardar',
            obtener: () => baseUrl() + 'geocercas/obtener',
            actualizar: () => baseUrl() + 'geocercas/actualizar',
            cambiarEstado: () => baseUrl() + 'geocercas/cambiar-estado',
        },
        consulta: {
            remitentes: () => baseUrl() + 'consulta/remitentes',
        },
    };

    /* ══════════════════════════════════════════════════════
     *  HELPERS
     * ══════════════════════════════════════════════════════ */

    async function post(url, params = {}) {
        const fd = new FormData();
        Object.entries(params).forEach(([k, v]) => fd.append(k, v ?? ''));
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
            body: fd,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    }

    function mostrarAlerta(alertId, mensaje, tipo = 'error') {
        const el = document.getElementById(alertId);
        if (!el) return;
        el.className = `form-alert ${tipo}`;
        el.textContent = mensaje;
        el.style.display = 'block';
        if (tipo === 'success') setTimeout(() => { el.style.display = 'none'; }, 3000);
    }

    function ocultarAlerta(alertId) {
        const el = document.getElementById(alertId);
        if (el) el.style.display = 'none';
    }

    function toggleForm(formId, mostrar, titulo = null) {
        const card = document.getElementById(formId);
        if (!card) return;
        card.classList.toggle('visible', mostrar);
        if (titulo) {
            const span = card.querySelector('[id$="-titulo"]');
            if (span) span.textContent = titulo;
        }
    }

    function actualizarBadge(badgeId, total) {
        const el = document.getElementById(badgeId);
        if (el) el.textContent = `${total} registro${total !== 1 ? 's' : ''}`;
    }

    function badgeEstado(estado) {
        return estado === 'activo'
            ? `<span class="badge-st bs-green"><i class="bi bi-circle-fill" style="font-size:6px"></i> Activo</span>`
            : `<span class="badge-st bs-slate"><i class="bi bi-circle" style="font-size:6px"></i> Inactivo</span>`;
    }

    function formatFecha(fecha) {
        return fecha ? fecha.split('T')[0] : '';
    }

    /* ══════════════════════════════════════════════════════
     *  TOM SELECT — helper seguro (destroy + reinit)
     * ══════════════════════════════════════════════════════ */
    const tsInstances = {};

    function initTomSelect(target, opciones = {}) {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (!el) return null;
        if (el.tomselect) el.tomselect.destroy();
        return new TomSelect(el, {
            create: false,
            allowEmptyOption: true,
            sortField: { field: 'text', direction: 'asc' },
            onInitialize() { this.control.classList.add('f-control'); },
            ...opciones,
        });
    }

    /* ══════════════════════════════════════════════════════
     *  DATATABLES — helper reutilizable con filtros
     * ══════════════════════════════════════════════════════ */
    function inicializarDataTable(tableSelector, opciones = {}) {
        const $tabla = $(tableSelector);
        if (!$tabla.length) return null;

        if ($.fn.DataTable.isDataTable(tableSelector)) {
            $tabla.DataTable().destroy();
        }
        $tabla.find('thead tr.filters').remove();

        const $headerRow = $tabla.find('thead tr:first');
        const $filterRow = $headerRow.clone(true).addClass('filters');
        $filterRow.find('th').html('');
        $filterRow.appendTo($tabla.find('thead'));

        const dt = $tabla.DataTable({
            orderCellsTop: true,
            fixedHeader: true,
            language: { url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
            ...opciones,
            initComplete() {
                const api = this.api();
                api.columns().eq(0).each(function (colIdx) {
                    const cell = $tabla.find('.filters th').get(colIdx);
                    if (!cell) return;
                    if (colIdx === 0) { $(cell).html(''); return; }
                    const title = $(api.column(colIdx).header()).text();
                    $(cell).html(
                        `<input type="text" class="w-100" placeholder="${title}" style="font-size:11px;height:24px;">`
                    );
                    $('input', cell).on('keyup change', function (e) {
                        e.stopPropagation();
                        if (api.column(colIdx).search() !== this.value)
                            api.column(colIdx).search(this.value).draw();
                    });
                });
                if (opciones.initComplete) opciones.initComplete.call(this);
            },
        });

        return dt;
    }

    /* ══════════════════════════════════════════════════════
     *  EXPORTAR EXCEL con SheetJS
     *  Exporta la tabla DataTable actualmente visible
     * ══════════════════════════════════════════════════════ */
    function exportarExcel(tableSelector, nombreArchivo) {
        const $tabla = $(tableSelector);
        if (!$tabla.length) return;

        // Cabeceras (primera fila del thead, sin la fila de filtros)
        const headers = [];
        $tabla.find('thead tr:first th').each(function () {
            const txt = $(this).text().trim();
            if (txt) headers.push(txt);
        });
        // Última columna (Acciones) no se exporta
        headers.pop();

        // Filas visibles
        const rows = [];
        $tabla.DataTable().rows({ search: 'applied' }).nodes().each(function () {
            const cells = [];
            $(this).find('td').each(function (i) {
                if (i >= headers.length) return; // omitir columna acciones
                // Limpiar HTML: tomar solo texto
                cells.push($(this).text().trim());
            });
            rows.push(cells);
        });

        const wsData = [headers, ...rows];
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Ancho automático de columnas
        const colWidths = headers.map((h, i) => {
            const maxLen = Math.max(h.length, ...rows.map(r => (r[i] || '').length));
            return { wch: Math.min(maxLen + 2, 40) };
        });
        ws['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, 'Datos');
        XLSX.writeFile(wb, `${nombreArchivo}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    }

    /* ══════════════════════════════════════════════════════
     *  TABS
     * ══════════════════════════════════════════════════════ */
    function initTabs() {
        document.querySelectorAll('.mod-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mod-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.mod-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const panel = document.getElementById(btn.dataset.tab);
                if (panel) panel.classList.add('active');

                // Cuando entra al tab Consultar, cargar selects si están vacíos
                if (btn.dataset.tab === 'tab-consultar') {
                    inicializarConsulta();
                }
            });
        });
    }

    /* ══════════════════════════════════════════════════════
     *  MUNICIPIOS
     * ══════════════════════════════════════════════════════ */
    let municipiosCache = [];

    async function cargarMunicipios() {
        if (!municipiosCache.length) {
            try {
                const json = await post(API.municipios());
                if (json.numero !== 200) throw new Error(json.mensaje);
                municipiosCache = json.data ?? [];
            } catch (e) { console.error('cargarMunicipios:', e); return; }
        }
        llenarSelectsMunicipios();
    }

    function llenarSelectsMunicipios() {
        const opts = municipiosCache
            .map(m => `<option value="${m.municipio}">${m.municipio} — ${m.depto}</option>`)
            .join('');
        ['cli-ciudad', 'rem-ciudad'].forEach(id => {
            const sel = document.getElementById(id);
            if (!sel) return;
            sel.innerHTML = '<option value="">— Seleccione municipio —</option>' + opts;
            tsInstances[id] = initTomSelect(sel, { placeholder: 'Seleccione un municipio...' });
        });
    }

    /* ══════════════════════════════════════════════════════
     *  CLIENTES INTERNOS
     * ══════════════════════════════════════════════════════ */
    let clientesInternosCache = [];

    async function cargarClientesInternos() {
        if (!clientesInternosCache.length) {
            try {
                const json = await post(API.clientesInternos());
                if (json.numero !== 200) throw new Error(json.mensaje);
                clientesInternosCache = json.data ?? [];
            } catch (e) { console.error('cargarClientesInternos:', e); return; }
        }
        llenarSelectsClientesInternos();
    }

    function llenarSelectsClientesInternos() {
        // Select del formulario de clientes externos
        const selForm = document.getElementById('cli-cliente');
        if (selForm) {
            const opts = clientesInternosCache
                .map(m => `<option value="${m.id}">${m.nombre}</option>`).join('');
            selForm.innerHTML = '<option value="">— Seleccione cliente —</option>' + opts;
            tsInstances['cli-cliente'] = initTomSelect(selForm, { placeholder: 'Seleccione un cliente...' });
        }
        // Select del tab Consultar
        const selCns = document.getElementById('cns-cliente-interno');
        if (selCns) {
            const opts = clientesInternosCache
                .map(m => `<option value="${m.id}">${m.nombre}</option>`).join('');
            selCns.innerHTML = '<option value="">— Todos —</option>' + opts;
            tsInstances['cns-cliente-interno'] = initTomSelect(selCns, {
                placeholder: 'Seleccione cliente interno...',
                onChange(value) { onCnsClienteInternoChange(value); },
            });
        }
    }

    /* ══════════════════════════════════════════════════════
     *  CLIENTES EXTERNOS
     * ══════════════════════════════════════════════════════ */
    const cli = { modoEdicion: false, datos: [] };

    // async function listarClientes() {
    //     try {
    //         const json = await post(API.clientes.listar());
    //         if (json.numero !== 200) throw new Error(json.mensaje);
    //         cli.datos = json.data ?? [];
    //         // renderClientes(cli.datos);
    //         renderClientes(json.data);
    //         // actualizarBadge('badge-clientes', cli.datos.length);
    //         actualizarBadge('badge-clientes', json.data.length);
    //         llenarSelectClientes(json.data);
    //         // llenarSelectClientes(cli.datos);
    //     } catch (e) { console.error('listarClientes:', e); }
    // }

    // function renderClientes(lista) {
    //     const tbody = document.getElementById('tbody-clientes');
    //     if (!lista.length) {
    //         tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state">
    //             <div class="es-icon"><i class="bi bi-building"></i></div>
    //             <div class="es-title">Sin clientes registrados</div>
    //             <div class="es-sub">Crea el primer cliente externo</div>
    //         </div></td></tr>`;
    //         return;
    //     }
    //     tbody.innerHTML = '';
    //     tbody.innerHTML = lista.map((r, i) => `
    //         <tr>
    //             <td>${i + 1}</td>
    //             <td>${r.cliente_interno?.nombre ?? '-'}</td>
    //             <td>${r.nit_cliente ?? '-'}</td>
    //             <td><strong>${r.razon_social ?? '-'}</strong></td>
    //             <td>${r.ciudad ?? '-'}</td>
    //             <td>${r.direccion ?? '-'}</td>
    //             <td>${r.hora_inicio ?? '-'}</td>
    //             <td>${r.hora_fin ?? '-'}</td>
    //             <td>${badgeEstado(r.estado)}</td>
    //             <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
    //             <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
    //             <td><div class="d-flex gap-1">
    //                 <button class="action-btn ab-edit" title="Editar"
    //                     data-accion="editar-cliente" data-id="${r.id}">
    //                     <i class="bi bi-pencil-fill"></i>
    //                 </button>
    //                 <button class="action-btn ab-toggle"
    //                     title="${r.estado === 'activo' ? 'Desactivar' : 'Activar'}"
    //                     data-accion="toggle-cliente" data-id="${r.id}" data-estado="${r.estado}">
    //                     <i class="bi bi-${r.estado === 'activo' ? 'toggle-on' : 'toggle-off'}"></i>
    //                 </button>
    //             </div></td>
    //         </tr>`).join('');

    //     setTimeout(() => inicializarDataTable('#tbl-clientes-externos'), 100);
    // }


    async function listarClientes() {
        try {
            // 1. Limpiamos visualmente la tabla antes de la petición (opcional, da feedback al usuario)
            // document.getElementById('tbody-clientes').innerHTML = 'Cargando...';

            const json = await post(API.clientes.listar());
            if (json.numero !== 200) throw new Error(json.mensaje);

            // 2. Actualizamos el objeto global
            cli.datos = json.data ?? [];

            // 3. Renderizamos usando el objeto global
            renderClientes(cli.datos);

            actualizarBadge('badge-clientes', cli.datos.length);
            llenarSelectClientes(cli.datos);

        } catch (e) {
            console.error('listarClientes:', e);
        }
    }

    function renderClientes(lista) {
        const tbody = document.getElementById('tbody-clientes');
        const tablaId = '#tbl-clientes-externos';

        // --- PASO CLAVE: Destruir DataTable si ya existe ---
        if ($.fn.DataTable.isDataTable(tablaId)) {
            $(tablaId).DataTable().destroy();
        }

        if (!lista || !lista.length) {
            tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state">
            <div class="es-icon"><i class="bi bi-building"></i></div>
            <div class="es-title">Sin clientes registrados</div>
            <div class="es-sub">Crea el primer cliente externo</div>
        </div></td></tr>`;
            return;
        }

        // Renderizado de filas
        tbody.innerHTML = lista.map((r, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${r.cliente_interno?.nombre ?? '-'}</td>
            <td>${r.nit_cliente ?? '-'}</td>
            <td><strong>${r.razon_social ?? '-'}</strong></td>
            <td>${r.ciudad ?? '-'}</td>
            <td>${r.direccion ?? '-'}</td>
            <td>${r.hora_inicio ?? '-'}</td>
            <td>${r.hora_fin ?? '-'}</td>
            <td>${badgeEstado(r.estado)}</td>
            <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
            <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
            <td><div class="d-flex gap-1">
                <button class="action-btn ab-edit" title="Editar" data-accion="editar-cliente" data-id="${r.id}">
                    <i class="bi bi-pencil-fill"></i>
                </button>
                <button class="action-btn ab-toggle" title="${r.estado === 'activo' ? 'Desactivar' : 'Activar'}" 
                    data-accion="toggle-cliente" data-id="${r.id}" data-estado="${r.estado}">
                    <i class="bi bi-${r.estado === 'activo' ? 'toggle-on' : 'toggle-off'}"></i>
                </button>
            </div></td>
        </tr>`).join('');

        // --- RE-INICIALIZAR ---
        // Usamos el setTimeout para asegurar que el DOM se haya actualizado
        setTimeout(() => {
            if (typeof inicializarDataTable === "function") {
                inicializarDataTable(tablaId);
            }
        }, 50);
    }

    async function guardarCliente() {
        ocultarAlerta('alert-clientes');
        const id = document.getElementById('cli-id').value;
        const cliCliente = document.getElementById('cli-cliente').value.trim();
        const nit = document.getElementById('cli-nit').value.trim();
        const razon = document.getElementById('cli-razon').value.trim();
        const ciudad = document.getElementById('cli-ciudad').value;
        const direccion = document.getElementById('cli-direccion').value.trim();
        const horaInicio = document.getElementById('cli-hora-inicio').value;
        const horaFin = document.getElementById('cli-hora-fin').value;
        const estado = document.getElementById('cli-estado').value;
        const usuario = document.getElementById('ssn_usuario').value;

        if (!nit || !razon || !ciudad || !estado) {
            mostrarAlerta('alert-clientes', 'Complete los campos obligatorios (*).');
            return;
        }

        const btn = document.getElementById('btn-guardar-cliente');
        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Guardando…';

        try {
            const params = {
                cliente_id: cliCliente,
                nit_cliente: nit,
                razon_social: razon,
                ciudad,
                direccion,
                hora_inicio: horaInicio,
                hora_fin: horaFin,
                estado,
                usuario,
            };
            if (cli.modoEdicion) params.id = id;
            const json = await post(
                cli.modoEdicion ? API.clientes.actualizar() : API.clientes.guardar(), params
            );
            if (json.numero !== 200) throw new Error(json.mensaje);
            mostrarAlerta('alert-clientes', json.mensaje, 'success');
            await listarClientes();
            setTimeout(() => resetFormCliente(), 2000);
        } catch (e) {
            mostrarAlerta('alert-clientes', e.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-check-lg"></i> Guardar';
        }
    }

    async function editarCliente(id) {
        try {
            const json = await post(API.clientes.obtener(), { id });
            if (json.numero !== 200) throw new Error(json.mensaje);
            const r = json.data;
            await cargarMunicipios();
            await cargarClientesInternos();

            document.getElementById('cli-id').value = r.id;
            document.getElementById('cli-nit').value = r.nit_cliente ?? '';
            document.getElementById('cli-razon').value = r.razon_social ?? '';
            document.getElementById('cli-direccion').value = r.direccion ?? '';
            document.getElementById('cli-hora-inicio').value = r.hora_inicio ?? '';
            document.getElementById('cli-hora-fin').value = r.hora_fin ?? '';
            document.getElementById('cli-estado').value = r.estado ?? 'activo';

            if (tsInstances['cli-cliente']) tsInstances['cli-cliente'].setValue(r.cliente_id ?? '');
            if (tsInstances['cli-ciudad']) tsInstances['cli-ciudad'].setValue(r.ciudad ?? '');

            cli.modoEdicion = true;
            toggleForm('form-card-clientes', true, 'Editar Cliente Externo');
            document.getElementById('form-card-clientes').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (e) { alert('Error al cargar cliente: ' + e.message); }
    }

    async function toggleCliente(id, estadoActual) {
        try {
            const json = await post(API.clientes.cambiarEstado(), {
                id, estado: estadoActual === 'activo' ? 'inactivo' : 'activo',
            });
            if (json.numero !== 200) throw new Error(json.mensaje);
            await listarClientes();
        } catch (e) { alert('Error al cambiar estado: ' + e.message); }
    }

    function resetFormCliente() {
        ['cli-id', 'cli-nit', 'cli-razon', 'cli-direccion', 'cli-hora-inicio', 'cli-hora-fin']
            .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        if (tsInstances['cli-cliente']) tsInstances['cli-cliente'].clear();
        if (tsInstances['cli-ciudad']) tsInstances['cli-ciudad'].clear();
        document.getElementById('cli-estado').value = 'activo';
        cli.modoEdicion = false;
        toggleForm('form-card-clientes', false);
        ocultarAlerta('alert-clientes');
    }

    /** Llena el select rem-cliente en el tab de remitentes */
    function llenarSelectClientes(lista) {
        const sel = document.getElementById('rem-cliente');
        if (!sel) return;
        const valorActual = sel.value;
        sel.innerHTML = '<option value="">— Seleccione cliente —</option>';
        lista.filter(c => c.estado === 'activo').forEach(c => {
            sel.innerHTML += `<option value="${c.id}">${c.razon_social}</option>`;
        });
        tsInstances['rem-cliente'] = initTomSelect(sel, { placeholder: 'Seleccione un cliente externo...' });
        if (valorActual) tsInstances['rem-cliente'].setValue(valorActual);
    }

    /* ══════════════════════════════════════════════════════
     *  REMITENTES / DESTINATARIOS
     * ══════════════════════════════════════════════════════ */
    const rem = { modoEdicion: false, datos: [] };

    // async function listarRemitentes() {
    //     try {
    //         const json = await post(API.remitentes.listar());
    //         if (json.numero !== 200) throw new Error(json.mensaje);
    //         rem.datos = json.data ?? [];
    //         renderRemitentes(rem.datos);
    //         actualizarBadge('badge-remitentes', rem.datos.length);
    //         llenarSelectRemitentes(rem.datos);
    //     } catch (e) { console.error('listarRemitentes:', e); }
    // }

    // function renderRemitentes(lista) {
    //     const tbody = document.getElementById('tbody-remitentes');
    //     if (!lista.length) {
    //         tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state">
    //             <div class="es-icon"><i class="bi bi-people"></i></div>
    //             <div class="es-title">Sin remitentes registrados</div>
    //             <div class="es-sub">Crea el primer remitente o destinatario</div>
    //         </div></td></tr>`;
    //         return;
    //     }
    //     tbody.innerHTML = lista.map((r, i) => `
    //         <tr>
    //             <td>${i + 1}</td>
    //             <td>${r.id}</td>
    //             <td>${r.cliente.cliente_interno?.nombre ?? '-'}</td>
    //             <td>${r.cliente?.razon_social ?? '-'}</td>
    //             <td><strong>${r.nombre_remitente_destinatario ?? '-'}</strong></td>
    //             <td>${r.ciudad ?? '-'}</td>
    //             <td style="font-family:monospace;font-size:.75rem">${r.latitud ?? '-'}</td>
    //             <td style="font-family:monospace;font-size:.75rem">${r.longitud ?? '-'}</td>
    //             <td>${renderHorarioPills(r.horarios ?? [])}</td>
    //             <td>${badgeEstado(r.estado)}</td>
    //             <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
    //             <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
    //             <td><div class="d-flex gap-1">
    //                 <button class="action-btn ab-edit" title="Editar"
    //                     data-accion="editar-remitente" data-id="${r.id}">
    //                     <i class="bi bi-pencil-fill"></i>
    //                 </button>
    //                 <button class="action-btn ab-toggle"
    //                     title="${r.estado === 'activo' ? 'Desactivar' : 'Activar'}"
    //                     data-accion="toggle-remitente" data-id="${r.id}" data-estado="${r.estado}">
    //                     <i class="bi bi-${r.estado === 'activo' ? 'toggle-on' : 'toggle-off'}"></i>
    //                 </button>
    //             </div></td>
    //         </tr>`).join('');

    //     setTimeout(() => inicializarDataTable('#tbl-remitentes'), 100);
    // }

    async function listarRemitentes() {
        try {
            // Limpiamos el array antes de la nueva carga para evitar datos residuales
            rem.datos = [];

            const json = await post(API.remitentes.listar());
            if (json.numero !== 200) throw new Error(json.mensaje);

            // Asignamos los nuevos datos
            rem.datos = json.data ?? [];

            // Renderizamos usando la data fresca
            renderRemitentes(rem.datos);

            actualizarBadge('badge-remitentes', rem.datos.length);
            llenarSelectRemitentes(rem.datos);
        } catch (e) {
            console.error('listarRemitentes:', e);
        }
    }

    function renderRemitentes(lista) {
        const tbody = document.getElementById('tbody-remitentes');
        const tablaId = '#tbl-remitentes';

        // --- 1. Destruir instancia de DataTable si ya existe ---
        if ($.fn.DataTable.isDataTable(tablaId)) {
            $(tablaId).DataTable().destroy();
        }

        // --- 2. Validar si hay datos ---
        if (!lista || !lista.length) {
            tbody.innerHTML = `<tr><td colspan="13"><div class="empty-state">
            <div class="es-icon"><i class="bi bi-people"></i></div>
            <div class="es-title">Sin remitentes registrados</div>
            <div class="es-sub">Crea el primer remitente o destinatario</div>
        </div></td></tr>`;
            return;
        }

        // --- 3. Limpiar y mapear el contenido ---
        tbody.innerHTML = lista.map((r, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${r.id}</td>
            <td>${r.cliente?.cliente_interno?.nombre ?? '-'}</td>
            <td>${r.cliente?.razon_social ?? '-'}</td>
            <td><strong>${r.nombre_remitente_destinatario ?? '-'}</strong></td>
            <td>${r.ciudad ?? '-'}</td>
            <td style="font-family:monospace;font-size:.75rem">${r.latitud ?? '-'}</td>
            <td style="font-family:monospace;font-size:.75rem">${r.longitud ?? '-'}</td>
            <td>${renderHorarioPills(r.horarios ?? [])}</td>
            <td>${badgeEstado(r.estado)}</td>
            <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
            <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
            <td><div class="d-flex gap-1">
                <button class="action-btn ab-edit" title="Editar"
                    data-accion="editar-remitente" data-id="${r.id}">
                    <i class="bi bi-pencil-fill"></i>
                </button>
                <button class="action-btn ab-toggle"
                    title="${r.estado === 'activo' ? 'Desactivar' : 'Activar'}"
                    data-accion="toggle-remitente" data-id="${r.id}" data-estado="${r.estado}">
                    <i class="bi bi-${r.estado === 'activo' ? 'toggle-on' : 'toggle-off'}"></i>
                </button>
            </div></td>
        </tr>`).join('');

        // --- 4. Re-inicializar DataTable con un pequeño delay ---
        setTimeout(() => {
            if (typeof inicializarDataTable === 'function') {
                inicializarDataTable(tablaId);
            }
        }, 50);
    }

    function renderHorarioPills(horarios) {
        if (!horarios.length) return '<span style="color:var(--slate-400);font-size:.72rem">Sin horarios</span>';
        return `<div class="horario-pills">${horarios.map(h =>
            `<span class="horario-pill"><i class="bi bi-clock"></i>${h.hora_inicio} – ${h.hora_fin}</span>`
        ).join('')}</div>`;
    }

    /* ── Horarios múltiples ── */
    function agregarFilaHorario(horario = null) {
        const contenedor = document.getElementById('rem-horarios-container');
        if (!contenedor) return;
        const num = contenedor.children.length + 1;
        const row = document.createElement('div');
        row.className = 'horario-row';
        row.dataset.horarioId = horario?.id ?? '';
        row.innerHTML = `
            <span class="h-num">${num}</span>
            <span class="h-label">Entrada</span>
            <input type="time" class="h-input rem-hora-inicio" value="${horario?.hora_inicio ?? ''}" required>
            <span class="h-sep"><i class="bi bi-arrow-right"></i></span>
            <span class="h-label">Salida</span>
            <input type="time" class="h-input rem-hora-fin" value="${horario?.hora_fin ?? ''}" required>
            <button type="button" class="btn-del-horario btn-eliminar-horario" title="Eliminar horario"
                ${horario?.id ? `data-horario-id="${horario.id}"` : ''}>
                <i class="bi bi-trash-fill"></i>
            </button>`;
        contenedor.appendChild(row);
        actualizarNumerosHorario();
    }

    function actualizarNumerosHorario() {
        document.querySelectorAll('#rem-horarios-container .horario-row').forEach((row, i) => {
            const num = row.querySelector('.h-num');
            if (num) num.textContent = i + 1;
        });
    }

    async function eliminarFilaHorario(btn) {
        const row = btn.closest('.horario-row');
        const horarioId = btn.dataset.horarioId;
        if (horarioId) {
            try {
                const json = await post(API.horarios.eliminar(), { id: horarioId });
                if (json.numero !== 200) throw new Error(json.mensaje);
            } catch (e) { alert('Error al eliminar horario: ' + e.message); return; }
        }
        row.remove();
        actualizarNumerosHorario();
        const contenedor = document.getElementById('rem-horarios-container');
        if (contenedor && contenedor.children.length === 0) agregarFilaHorario();
    }

    function recogerHorarios() {
        return Array.from(
            document.querySelectorAll('#rem-horarios-container .horario-row')
        ).map(row => ({
            id: row.dataset.horarioId || null,
            hora_inicio: row.querySelector('.rem-hora-inicio').value,
            hora_fin: row.querySelector('.rem-hora-fin').value,
        })).filter(h => h.hora_inicio && h.hora_fin);
    }

    async function guardarRemitente() {
        ocultarAlerta('alert-remitentes');
        const id = document.getElementById('rem-id').value;
        const cliente = document.getElementById('rem-cliente').value;
        const nombre = document.getElementById('rem-nombre').value.trim();
        const ciudad = document.getElementById('rem-ciudad').value;
        const lat = document.getElementById('rem-lat').value.trim();
        const lng = document.getElementById('rem-lng').value.trim();
        const estado = document.getElementById('rem-estado').value;
        const usuario = document.getElementById('ssn_usuario').value;
        const horarios = recogerHorarios();

        if (!cliente || !nombre || !ciudad || !lat || !lng) {
            mostrarAlerta('alert-remitentes', 'Complete los campos obligatorios (*).');
            return;
        }
        if (!horarios.length) {
            mostrarAlerta('alert-remitentes', 'Agregue al menos un horario de entrada y salida.');
            return;
        }

        const btn = document.getElementById('btn-guardar-remitente');
        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Guardando…';

        try {
            const params = {
                id_cliente: cliente,
                nombre_remitente_destinatario: nombre,
                ciudad, latitud: lat, longitud: lng, estado, usuario,
                horarios: JSON.stringify(horarios),
            };
            if (rem.modoEdicion) params.id = id;
            const json = await post(
                rem.modoEdicion ? API.remitentes.actualizar() : API.remitentes.guardar(), params
            );
            if (json.numero !== 200) throw new Error(json.mensaje);
            mostrarAlerta('alert-remitentes', json.mensaje, 'success');
            await listarRemitentes();
            setTimeout(() => resetFormRemitente(), 2000);
        } catch (e) {
            mostrarAlerta('alert-remitentes', e.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-check-lg"></i> Guardar';
        }
    }

    async function editarRemitente(id) {
        try {
            const json = await post(API.remitentes.obtener(), { id });
            if (json.numero !== 200) throw new Error(json.mensaje);
            const r = json.data;
            await cargarMunicipios();

            document.getElementById('rem-id').value = r.id;
            document.getElementById('rem-nombre').value = r.nombre_remitente_destinatario ?? '';
            document.getElementById('rem-lat').value = r.latitud ?? '';
            document.getElementById('rem-lng').value = r.longitud ?? '';
            document.getElementById('rem-estado').value = r.estado ?? 'activo';

            if (tsInstances['rem-cliente']) tsInstances['rem-cliente'].setValue(r.id_cliente ?? '');
            if (tsInstances['rem-ciudad']) tsInstances['rem-ciudad'].setValue(r.ciudad ?? '');

            const contenedor = document.getElementById('rem-horarios-container');
            contenedor.innerHTML = '';
            const horarios = r.horarios ?? [];
            if (horarios.length) horarios.forEach(h => agregarFilaHorario(h));
            else agregarFilaHorario();

            rem.modoEdicion = true;
            toggleForm('form-card-remitentes', true, 'Editar Remitente / Destinatario');
            document.getElementById('form-card-remitentes').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (e) { alert('Error al cargar remitente: ' + e.message); }
    }

    async function toggleRemitente(id, estadoActual) {
        try {
            const json = await post(API.remitentes.cambiarEstado(), {
                id, estado: estadoActual === 'activo' ? 'inactivo' : 'activo',
            });
            if (json.numero !== 200) throw new Error(json.mensaje);
            await listarRemitentes();
        } catch (e) { alert('Error al cambiar estado: ' + e.message); }
    }

    function resetFormRemitente() {
        ['rem-id', 'rem-nombre', 'rem-lat', 'rem-lng'].forEach(id => {
            const el = document.getElementById(id); if (el) el.value = '';
        });
        if (tsInstances['rem-cliente']) tsInstances['rem-cliente'].clear();
        if (tsInstances['rem-ciudad']) tsInstances['rem-ciudad'].clear();
        document.getElementById('rem-estado').value = 'activo';
        const contenedor = document.getElementById('rem-horarios-container');
        if (contenedor) { contenedor.innerHTML = ''; agregarFilaHorario(); }
        rem.modoEdicion = false;
        toggleForm('form-card-remitentes', false);
        ocultarAlerta('alert-remitentes');
    }

    function llenarSelectRemitentes(lista) {
        const sel = document.getElementById('geo-remitente');
        if (!sel) return;
        const valorActual = sel.value;
        sel.innerHTML = '<option value="">— Seleccione remitente/dest. —</option>';
        lista.filter(r => r.estado === 'activo').forEach(r => {
            sel.innerHTML += `<option value="${r.id}" data-ciudad="${r.ciudad ?? ''}">${r.nombre_remitente_destinatario}</option>`;
        });
        tsInstances['geo-remitente'] = initTomSelect(sel, {
            placeholder: 'Seleccione remitente...',
            onChange(value) {
                const opt = sel.querySelector(`option[value="${value}"]`);
                const ciudad = opt ? (opt.dataset.ciudad ?? '') : '';
                const display = document.getElementById('geo-ciudad-display');
                const input = document.getElementById('geo-ciudad');
                if (display) display.textContent = ciudad || '—';
                if (input) input.value = ciudad;
            },
        });
        if (valorActual) tsInstances['geo-remitente'].setValue(valorActual);
    }

    /* ══════════════════════════════════════════════════════
     *  GEOCERCAS
     * ══════════════════════════════════════════════════════ */
    const geo = { modoEdicion: false, datos: [] };

    // async function listarGeocercas() {
    //     try {
    //         const json = await post(API.geocercas.listar());
    //         if (json.numero !== 200) throw new Error(json.mensaje);
    //         geo.datos = json.data ?? [];
    //         renderGeocercas(geo.datos);
    //         actualizarBadge('badge-geocercas', geo.datos.length);
    //     } catch (e) { console.error('listarGeocercas:', e); }
    // }

    // function renderGeocercas(lista) {
    //     const tbody = document.getElementById('tbody-geocercas');
    //     if (!lista.length) {
    //         tbody.innerHTML = `<tr><td colspan="10"><div class="empty-state">
    //             <div class="es-icon"><i class="bi bi-geo"></i></div>
    //             <div class="es-title">Sin geocercas registradas</div>
    //             <div class="es-sub">Crea la primera geocerca</div>
    //         </div></td></tr>`;
    //         return;
    //     }
    //     tbody.innerHTML = lista.map((r, i) => `
    //         <tr>
    //             <td>${i + 1}</td>
    //             <td>${r.remitente_destinatario?.cliente?.cliente_interno?.nombre ?? '-'}</td>
    //             <td>${r.remitente_destinatario?.cliente?.razon_social ?? '-'}</td>
    //             <td>${r.remitente_destinatario?.nombre_remitente_destinatario ?? '-'}</td>
    //             <td><strong>${r.nombre_punto_geo ?? '-'}</strong></td>
    //             <td>${r.ciudad ?? '-'}</td>
    //             <td style="font-family:monospace;font-size:.75rem">${r.latitud ?? '-'}</td>
    //             <td style="font-family:monospace;font-size:.75rem">${r.longitud ?? '-'}</td>
    //             <td>${badgeEstado(r.estado)}</td>
    //             <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
    //             <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
    //             <td><div class="d-flex gap-1">
    //                 <button class="action-btn ab-edit" title="Editar"
    //                     data-accion="editar-geocerca" data-id="${r.id}">
    //                     <i class="bi bi-pencil-fill"></i>
    //                 </button>
    //                 <button class="action-btn ab-toggle"
    //                     title="${r.estado === 'activo' ? 'Desactivar' : 'Activar'}"
    //                     data-accion="toggle-geocerca" data-id="${r.id}" data-estado="${r.estado}">
    //                     <i class="bi bi-${r.estado === 'activo' ? 'toggle-on' : 'toggle-off'}"></i>
    //                 </button>
    //             </div></td>
    //         </tr>`).join('');

    //     setTimeout(() => inicializarDataTable('#tbl-geocercas'), 100);
    // }

    async function listarGeocercas() {
        try {
            // Limpiamos el array global antes de la consulta
            geo.datos = [];

            const json = await post(API.geocercas.listar());
            if (json.numero !== 200) throw new Error(json.mensaje);

            // Guardamos y renderizamos
            geo.datos = json.data ?? [];
            renderGeocercas(geo.datos);

            actualizarBadge('badge-geocercas', geo.datos.length);
        } catch (e) {
            console.error('listarGeocercas:', e);
        }
    }

    function renderGeocercas(lista) {
        const tbody = document.getElementById('tbody-geocercas');
        const tablaId = '#tbl-geocercas';

        // 1. Destruir DataTable si ya está inicializada
        if ($.fn.DataTable.isDataTable(tablaId)) {
            $(tablaId).DataTable().destroy();
        }

        // 2. Manejo de estado vacío
        if (!lista || !lista.length) {
            tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state">
            <div class="es-icon"><i class="bi bi-geo"></i></div>
            <div class="es-title">Sin geocercas registradas</div>
            <div class="es-sub">Crea la primera geocerca</div>
        </div></td></tr>`;
            return;
        }

        // 3. Renderizado de filas con Optional Chaining para seguridad
        tbody.innerHTML = lista.map((r, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${r.remitente_destinatario?.cliente?.cliente_interno?.nombre ?? '-'}</td>
            <td>${r.remitente_destinatario?.cliente?.razon_social ?? '-'}</td>
            <td>${r.remitente_destinatario?.nombre_remitente_destinatario ?? '-'}</td>
            <td><strong>${r.nombre_punto_geo ?? '-'}</strong></td>
            <td>${r.ciudad ?? '-'}</td>
            <td style="font-family:monospace;font-size:.75rem">${r.latitud ?? '-'}</td>
            <td style="font-family:monospace;font-size:.75rem">${r.longitud ?? '-'}</td>
            <td>${badgeEstado(r.estado)}</td>
            <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
            <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
            <td><div class="d-flex gap-1">
                <button class="action-btn ab-edit" title="Editar"
                    data-accion="editar-geocerca" data-id="${r.id}">
                    <i class="bi bi-pencil-fill"></i>
                </button>
                <button class="action-btn ab-toggle"
                    title="${r.estado === 'activo' ? 'Desactivar' : 'Activar'}"
                    data-accion="toggle-geocerca" data-id="${r.id}" data-estado="${r.estado}">
                    <i class="bi bi-${r.estado === 'activo' ? 'toggle-on' : 'toggle-off'}"></i>
                </button>
            </div></td>
        </tr>`).join('');

        // 4. Re-inicialización de la tabla
        setTimeout(() => {
            if (typeof inicializarDataTable === 'function') {
                inicializarDataTable(tablaId);
            }
        }, 50);
    }

    async function guardarGeocerca() {
        ocultarAlerta('alert-geocercas');
        const id = document.getElementById('geo-id').value;
        const remitente = document.getElementById('geo-remitente').value;
        const nombre = document.getElementById('geo-nombre').value.trim();
        const ciudad = document.getElementById('geo-ciudad').value;
        const lat = document.getElementById('geo-lat').value.trim();
        const lng = document.getElementById('geo-lng').value.trim();
        const estado = document.getElementById('geo-estado').value;
        const usuario = document.getElementById('ssn_usuario').value;

        if (!remitente || !nombre || !lat || !lng) {
            mostrarAlerta('alert-geocercas', 'Complete los campos obligatorios (*).');
            return;
        }

        const btn = document.getElementById('btn-guardar-geocerca');
        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Guardando…';

        try {
            const params = { id_rem_des: remitente, nombre_punto_geo: nombre, ciudad, latitud: lat, longitud: lng, estado, usuario };
            if (geo.modoEdicion) params.id = id;
            const json = await post(
                geo.modoEdicion ? API.geocercas.actualizar() : API.geocercas.guardar(), params
            );
            if (json.numero !== 200) throw new Error(json.mensaje);
            mostrarAlerta('alert-geocercas', json.mensaje, 'success');
            await listarGeocercas();
            setTimeout(() => resetFormGeocerca(), 2000);
        } catch (e) {
            mostrarAlerta('alert-geocercas', e.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-check-lg"></i> Guardar';
        }
    }

    async function editarGeocerca(id) {
        try {
            const json = await post(API.geocercas.obtener(), { id });
            if (json.numero !== 200) throw new Error(json.mensaje);
            const r = json.data;
            document.getElementById('geo-id').value = r.id;
            document.getElementById('geo-nombre').value = r.nombre_punto_geo ?? '';
            document.getElementById('geo-lat').value = r.latitud ?? '';
            document.getElementById('geo-lng').value = r.longitud ?? '';
            document.getElementById('geo-estado').value = r.estado ?? 'activo';
            document.getElementById('geo-ciudad').value = r.ciudad ?? '';
            const display = document.getElementById('geo-ciudad-display');
            if (display) display.textContent = r.ciudad || '—';
            if (tsInstances['geo-remitente']) tsInstances['geo-remitente'].setValue(r.id_rem_des ?? '');
            geo.modoEdicion = true;
            toggleForm('form-card-geocercas', true, 'Editar Geocerca');
            document.getElementById('form-card-geocercas').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (e) { alert('Error al cargar geocerca: ' + e.message); }
    }

    async function toggleGeocerca(id, estadoActual) {
        try {
            const json = await post(API.geocercas.cambiarEstado(), {
                id, estado: estadoActual === 'activo' ? 'inactivo' : 'activo',
            });
            if (json.numero !== 200) throw new Error(json.mensaje);
            await listarGeocercas();
        } catch (e) { alert('Error al cambiar estado: ' + e.message); }
    }

    function resetFormGeocerca() {
        ['geo-id', 'geo-nombre', 'geo-lat', 'geo-lng', 'geo-ciudad'].forEach(id => {
            const el = document.getElementById(id); if (el) el.value = '';
        });
        if (tsInstances['geo-remitente']) tsInstances['geo-remitente'].clear();
        const display = document.getElementById('geo-ciudad-display');
        if (display) display.textContent = '—';
        document.getElementById('geo-estado').value = 'activo';
        geo.modoEdicion = false;
        toggleForm('form-card-geocercas', false);
        ocultarAlerta('alert-geocercas');
    }

    /* ══════════════════════════════════════════════════════
     *  TAB CONSULTAR
     * ══════════════════════════════════════════════════════ */
    let consultaInicializada = false;
    let consultaDatos = [];

    /**
     * Inicializa el tab Consultar la primera vez que se abre.
     * Espera a que los datos globales (cli, rem) estén cargados
     * antes de poblar el primer select.
     */
    async function inicializarConsulta() {
        if (consultaInicializada) return;
        consultaInicializada = true;

        // Aseguramos que clientes internos estén en cache
        await cargarClientesInternos();

        // Poblar select de Cliente Interno con todos los que tengan
        // al menos una sede (cliente externo) en cli.datos
        const selCI = document.getElementById('cns-cliente-interno');
        if (!selCI) return;

        // Reunir IDs únicos de clientes internos que tienen sedes
        const idsConSedes = new Set(cli.datos.map(c => String(c.cliente_id)));

        const opts = clientesInternosCache
            .filter(ci => idsConSedes.has(String(ci.id)))
            .map(ci => `<option value="${ci.id}">${ci.nombre}</option>`)
            .join('');

        selCI.innerHTML = '<option value="">— Todos los clientes —</option>' + opts;

        // Si ya existía una instancia TomSelect, destruirla antes de recrear
        if (tsInstances['cns-cliente-interno']) tsInstances['cns-cliente-interno'].destroy();

        tsInstances['cns-cliente-interno'] = initTomSelect(selCI, {
            placeholder: 'Seleccione cliente interno...',
            onChange(value) { onCnsClienteInternoChange(value); },
        });
    }

    /**
     * Nivel 1 → Nivel 2:
     * Al seleccionar Cliente Interno pobla el select de Sede (cliente externo).
     * Resetea en cascada: Sede y Remitente quedan vacíos.
     */
    function onCnsClienteInternoChange(clienteInternoId) {
        // ── Reset Sede ──────────────────────────────────────
        const selSede = document.getElementById('cns-cliente-externo');
        if (!selSede) return;
        if (tsInstances['cns-cliente-externo']) {
            tsInstances['cns-cliente-externo'].destroy();
            delete tsInstances['cns-cliente-externo'];
        }
        selSede.innerHTML = '<option value="">— Todas las sedes —</option>';
        selSede.disabled = true;

        // ── Reset Remitente ──────────────────────────────────
        _resetSelRemitente();

        if (!clienteInternoId) return;

        // Sedes (clientes externos) cuyo cliente_id coincide con el cliente interno seleccionado
        const sedesFiltradas = cli.datos.filter(
            c => String(c.cliente_id) === String(clienteInternoId)
        );

        if (!sedesFiltradas.length) {
            selSede.innerHTML = '<option value="">— Sin sedes registradas —</option>';
            tsInstances['cns-cliente-externo'] = initTomSelect(selSede, {
                placeholder: 'Sin sedes...',
            });
            return;
        }

        const opts = sedesFiltradas
            .map(c => `<option value="${c.id}">${c.razon_social}</option>`)
            .join('');
        selSede.innerHTML = '<option value="">— Todas las sedes —</option>' + opts;
        selSede.disabled = false;

        tsInstances['cns-cliente-externo'] = initTomSelect(selSede, {
            placeholder: 'Seleccione una sede...',
            onChange(value) { onCnsSedeChange(value); },
        });
    }

    /**
     * Nivel 2 → Nivel 3:
     * Al seleccionar Sede pobla el select de Remitente/Destinatario.
     * Solo muestra los remitentes que pertenecen a esa sede (id_cliente).
     */
    function onCnsSedeChange(sedeId) {
        _resetSelRemitente();

        if (!sedeId) return;

        const selRem = document.getElementById('cns-remitente');
        if (!selRem) return;

        // rem.datos: cada remitente tiene id_cliente = id de la sede (cliente externo)
        const remFiltrados = rem.datos.filter(
            r => String(r.id_cliente) === String(sedeId)
        );

        if (!remFiltrados.length) {
            selRem.innerHTML = '<option value="">— Sin remitentes en esta sede —</option>';
            tsInstances['cns-remitente'] = initTomSelect(selRem, {
                placeholder: 'Sin remitentes...',
            });
            return;
        }

        const opts = remFiltrados
            .map(r => `<option value="${r.id}">${r.nombre_remitente_destinatario}</option>`)
            .join('');
        selRem.innerHTML = '<option value="">— Todos los remitentes —</option>' + opts;
        selRem.disabled = false;

        tsInstances['cns-remitente'] = initTomSelect(selRem, {
            placeholder: 'Seleccione remitente / destinatario...',
        });
    }

    /** Helper: resetea el select de Remitente a su estado vacío/deshabilitado */
    function _resetSelRemitente() {
        const selRem = document.getElementById('cns-remitente');
        if (!selRem) return;
        if (tsInstances['cns-remitente']) {
            tsInstances['cns-remitente'].destroy();
            delete tsInstances['cns-remitente'];
        }
        selRem.innerHTML = '<option value="">— Todos los remitentes —</option>';
        selRem.disabled = true;
    }

    /**
     * Ejecuta la consulta aplicando los filtros seleccionados.
     * Trabaja 100% con los caches locales (cli.datos, rem.datos,
     * clientesInternosCache) sin llamadas extra al servidor.
     */
    async function ejecutarConsulta() {
        const clienteInternoId = document.getElementById('cns-cliente-interno')?.value ?? '';
        const sedeId           = document.getElementById('cns-cliente-externo')?.value ?? '';
        const remitenteId      = document.getElementById('cns-remitente')?.value ?? '';
        const ciudadFiltro     = (document.getElementById('cns-ciudad-filtro')?.value ?? '').trim().toLowerCase();
        const estadoFiltro     = document.getElementById('cns-estado-filtro')?.value ?? '';

        // Mostrar spinner
        document.getElementById('cns-estado-inicial').style.display = 'none';
        document.getElementById('cns-spinner').style.display = 'flex';
        document.getElementById('cns-tabla-wrapper').style.display = 'none';
        document.getElementById('kpi-row').style.display = 'none';
        document.getElementById('btn-excel-consulta').disabled = true;

        try {
            // ── Paso 1: enriquecer cada remitente con su sede y cliente interno ──
            let resultado = rem.datos.map(r => {
                const sede = cli.datos.find(c => String(c.id) === String(r.id_cliente)) ?? null;
                const clienteInterno = sede
                    ? (clientesInternosCache.find(ci => String(ci.id) === String(sede.cliente_id)) ?? null)
                    : null;
                return { ...r, _sede: sede, _clienteInterno: clienteInterno };
            });

            // ── Paso 2: aplicar filtros jerárquicos ──────────────────────────────

            // Filtro por Cliente Interno
            if (clienteInternoId) {
                resultado = resultado.filter(
                    r => r._clienteInterno && String(r._clienteInterno.id) === String(clienteInternoId)
                );
            }

            // Filtro por Sede (cliente externo)
            if (sedeId) {
                resultado = resultado.filter(
                    r => String(r.id_cliente) === String(sedeId)
                );
            }

            // Filtro por Remitente/Destinatario específico
            if (remitenteId) {
                resultado = resultado.filter(
                    r => String(r.id) === String(remitenteId)
                );
            }

            // Filtro por Ciudad (texto libre)
            if (ciudadFiltro) {
                resultado = resultado.filter(
                    r => (r.ciudad ?? '').toLowerCase().includes(ciudadFiltro)
                );
            }

            // Filtro por Estado
            if (estadoFiltro) {
                resultado = resultado.filter(r => r.estado === estadoFiltro);
            }

            consultaDatos = resultado;
            renderConsulta(resultado);

        } catch (e) {
            console.error('ejecutarConsulta:', e);
            document.getElementById('cns-spinner').style.display = 'none';
            document.getElementById('cns-estado-inicial').style.display = 'flex';
        }
    }

    function renderConsulta(lista) {
        document.getElementById('cns-spinner').style.display = 'none';

        // ── KPIs ────────────────────────────────────────────────────────────────
        const sedesUnicas      = new Set(lista.map(r => r.id_cliente)).size;
        const totalHorarios    = lista.reduce((acc, r) => acc + (r.horarios?.length ?? 0), 0);
        const totalActivos     = lista.filter(r => r.estado === 'activo').length;
        const clientesIntUnicos = new Set(
            lista.map(r => r._clienteInterno?.id).filter(Boolean)
        ).size;

        document.getElementById('kpi-clientes-ext').textContent = sedesUnicas;
        document.getElementById('kpi-remitentes').textContent   = lista.length;
        document.getElementById('kpi-horarios').textContent     = totalHorarios;
        document.getElementById('kpi-activos').textContent      = totalActivos;
        document.getElementById('kpi-row').style.display        = lista.length ? 'flex' : 'none';

        actualizarBadge('badge-consulta', lista.length);

        const tbody = document.getElementById('tbody-consulta');

        // Destruir DataTable existente antes de reemplazar el tbody
        if ($.fn.DataTable.isDataTable('#tbl-consulta')) {
            $('#tbl-consulta').DataTable().destroy();
        }

        if (!lista.length) {
            tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state">
                <div class="es-icon"><i class="bi bi-search"></i></div>
                <div class="es-title">Sin resultados</div>
                <div class="es-sub">Ajusta los filtros e intenta de nuevo</div>
            </div></td></tr>`;
            document.getElementById('cns-tabla-wrapper').style.display = 'block';
            return;
        }

        tbody.innerHTML = lista.map((r, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${r._clienteInterno?.nombre ?? '-'}</td>
                <td>${r._sede?.razon_social ?? '-'}</td>
                <td>${r._sede?.nit_cliente ?? '-'}</td>
                <td><strong>${r.nombre_remitente_destinatario ?? '-'}</strong></td>
                <td>${r.ciudad ?? '-'}</td>
                <td style="font-family:monospace;font-size:.75rem">${r.latitud ?? '-'}</td>
                <td style="font-family:monospace;font-size:.75rem">${r.longitud ?? '-'}</td>
                <td>${renderHorarioPills(r.horarios ?? [])}</td>
                <td>${badgeEstado(r.estado)}</td>
                <td style="color:var(--slate-400);font-size:.75rem">${r.usuario ?? '-'}</td>
                <td style="color:var(--slate-400);font-size:.75rem">${formatFecha(r.fecha)}</td>
            </tr>`).join('');

        document.getElementById('cns-tabla-wrapper').style.display = 'block';
        document.getElementById('btn-excel-consulta').disabled = false;

        setTimeout(() => inicializarDataTable('#tbl-consulta'), 50);
    }

    function limpiarConsulta() {
        // Limpiar selects con TomSelect
        if (tsInstances['cns-cliente-interno']) tsInstances['cns-cliente-interno'].clear();

        // Resetear Sede
        const selSede = document.getElementById('cns-cliente-externo');
        if (tsInstances['cns-cliente-externo']) {
            tsInstances['cns-cliente-externo'].destroy();
            delete tsInstances['cns-cliente-externo'];
        }
        if (selSede) {
            selSede.innerHTML = '<option value="">— Todas las sedes —</option>';
            selSede.disabled = true;
        }

        // Resetear Remitente
        _resetSelRemitente();

        // Limpiar inputs de texto
        const ciudadEl = document.getElementById('cns-ciudad-filtro');
        const estadoEl = document.getElementById('cns-estado-filtro');
        if (ciudadEl) ciudadEl.value = '';
        if (estadoEl) estadoEl.value = '';

        // Resetear UI
        document.getElementById('cns-estado-inicial').style.display = 'flex';
        document.getElementById('cns-spinner').style.display = 'none';
        document.getElementById('cns-tabla-wrapper').style.display = 'none';
        document.getElementById('kpi-row').style.display = 'none';
        document.getElementById('btn-excel-consulta').disabled = true;
        consultaDatos = [];
    }

    /* ══════════════════════════════════════════════════════
     *  EVENT LISTENERS
     * ══════════════════════════════════════════════════════ */
    function initEventListeners() {

        // document.addEventListener('click', async (e) => {
        $(document).off('click').on('click', async function (e) {

            // ── Clientes ──
            if (e.target.closest('#btn-nuevo-cliente')) {
                resetFormCliente();
                await cargarMunicipios();
                await cargarClientesInternos();
                toggleForm('form-card-clientes', true, 'Remitente / Destinatario');
                document.getElementById('form-card-clientes').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            if (e.target.closest('#btn-cancelar-cliente, #btn-cancelar-cliente-2')) resetFormCliente();
            if (e.target.closest('#btn-guardar-cliente')) await guardarCliente();

            const btnEditCli = e.target.closest('[data-accion="editar-cliente"]');
            if (btnEditCli) await editarCliente(btnEditCli.dataset.id);
            const btnToggleCli = e.target.closest('[data-accion="toggle-cliente"]');
            if (btnToggleCli) await toggleCliente(btnToggleCli.dataset.id, btnToggleCli.dataset.estado);

            // Excel clientes
            if (e.target.closest('#btn-excel-clientes'))
                exportarExcel('#tbl-clientes-externos', 'Clientes_Externos');

            // ── Remitentes ──
            if (e.target.closest('#btn-nuevo-remitente')) {
                resetFormRemitente();
                await cargarMunicipios();
                toggleForm('form-card-remitentes', true, 'Nueva Sede');
                document.getElementById('form-card-remitentes').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            if (e.target.closest('#btn-cancelar-remitente, #btn-cancelar-remitente-2')) resetFormRemitente();
            if (e.target.closest('#btn-guardar-remitente')) await guardarRemitente();

            const btnEditRem = e.target.closest('[data-accion="editar-remitente"]');
            if (btnEditRem) await editarRemitente(btnEditRem.dataset.id);
            const btnToggleRem = e.target.closest('[data-accion="toggle-remitente"]');
            if (btnToggleRem) await toggleRemitente(btnToggleRem.dataset.id, btnToggleRem.dataset.estado);

            // Horarios
            if (e.target.closest('#btn-agregar-horario')) agregarFilaHorario();
            const btnElimHorario = e.target.closest('.btn-eliminar-horario');
            if (btnElimHorario) await eliminarFilaHorario(btnElimHorario);

            // Excel remitentes
            if (e.target.closest('#btn-excel-remitentes'))
                exportarExcel('#tbl-remitentes', 'Remitentes_Destinatarios');

            // ── Geocercas ──
            if (e.target.closest('#btn-nueva-geocerca')) {
                resetFormGeocerca();
                toggleForm('form-card-geocercas', true, 'Nueva Geocerca');
                document.getElementById('form-card-geocercas').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            if (e.target.closest('#btn-cancelar-geocerca, #btn-cancelar-geocerca-2')) resetFormGeocerca();
            if (e.target.closest('#btn-guardar-geocerca')) await guardarGeocerca();

            const btnEditGeo = e.target.closest('[data-accion="editar-geocerca"]');
            if (btnEditGeo) await editarGeocerca(btnEditGeo.dataset.id);
            const btnToggleGeo = e.target.closest('[data-accion="toggle-geocerca"]');
            if (btnToggleGeo) await toggleGeocerca(btnToggleGeo.dataset.id, btnToggleGeo.dataset.estado);

            // Excel geocercas
            if (e.target.closest('#btn-excel-geocercas'))
                exportarExcel('#tbl-geocercas', 'Geocercas');

            // ── Consultar ──
            if (e.target.closest('#btn-consultar')) await ejecutarConsulta();
            if (e.target.closest('#btn-limpiar-consulta')) limpiarConsulta();
            if (e.target.closest('#btn-excel-consulta'))
                exportarExcel('#tbl-consulta', 'Consulta_Remitentes');
        });
    }

    /* ══════════════════════════════════════════════════════
     *  INIT
     * ══════════════════════════════════════════════════════ */
    async function init() {
        initTabs();
        initEventListeners();
        agregarFilaHorario();  // una fila vacía por defecto

        await Promise.all([
            listarClientes(),
            listarRemitentes(),
            listarGeocercas(),
        ]);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();