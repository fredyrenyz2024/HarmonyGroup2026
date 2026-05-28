// window.VENTANA = null; // Variable global para almacenar el ID
// (function () {
//     "use strict";
//     // Definir la función initScript globalmente
//     window.initScript = function (id) {
//         window.VENTANA = id; // Asigna el ID recibido a la variable global

//         // Crear instancia
//         // Usar una variable global o una propiedad en el objeto window
//         if (!window.myOffcanvas) {
//             window.myOffcanvas = new DynamicOffcanvas({
//                 id: `customOffcanvas${id}`,
//                 title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
//                 content: '<p>Contenido inicial</p>',
//                 scroll: true,
//                 backdrop: false,
//             });
//         } else {
//             console.log('El offcanvas ya está creado.');
//         }

//         // document.getElementById(`campo-${window.VENTANA}-trazabilidad`).style.display = 'none';
//         // Obtener los campos por ID
//         let campoFechaInicial = document.getElementById(`fecha_inicial`);
//         let campoFechaFinal = document.getElementById(`fecha_final`);

//         if (campoFechaInicial && campoFechaFinal) {
//             let hoy = new Date();
//             let anio = hoy.getFullYear();
//             let mes = hoy.getMonth() + 1; // Los meses van de 0 a 11
//             let dia = hoy.getDate();

//             // Formatear mes y día con dos dígitos
//             mes = mes < 10 ? `0${mes}` : mes;
//             let diaActual = dia < 10 ? `0${dia}` : dia;

//             // Establecer fechas en formato YYYY-MM-DD
//             let fechaInicio = `${anio}-${mes}-01`;
//             let fechaFin = `${anio}-${mes}-${diaActual}`;

//             // Asignar las fechas a los inputs
//             campoFechaInicial.value = fechaInicio;
//             campoFechaFinal.value = fechaFin;

//             // Obtener los valores de los inputs para enviar a la función
//             let fecha_inicial = campoFechaInicial.value;
//             let fecha_final = campoFechaFinal.value;

//             // Llamar a la función con los valores actualizados
//             listar_pedidos_administrador(fecha_inicial, fecha_final);
//         }

//         document.addEventListener('click', async (e) => {
//             /* Boton para buscar por fechas */
//             if (e.target.matches('#buscar') || e.target.matches('#buscar *')) {
//                 const fecha_inicial = document.getElementById('fecha_inicial')?.value ?? '';
//                 const fecha_final = document.getElementById('fecha_final')?.value ?? '';
//                 const _estPub = document.getElementById('f-estado-pub')?.value ?? ''; // Asignado / Cancelado / Pendiente
//                 const _estTraz = document.getElementById('f-estado-traz')?.value ?? ''; // Cargue / Descargue / etc
//                 const _modalidad = document.getElementById('f-modalidad')?.value ?? ''; // CARGA SECA / IMPORTACION / etc

//                 document.querySelectorAll('.kpi-resumen').forEach(c => c.classList.remove('active'));

//                 if (_estTraz && _modalidad) {
//                     // Trazabilidad + modalidad
//                     listar_pedidos_administrador(fecha_inicial, fecha_final, '', _estTraz, _modalidad, 'filt_traz_mod');

//                 } else if (_estPub && _modalidad) {
//                     // Estado publicación + modalidad
//                     listar_pedidos_administrador(fecha_inicial, fecha_final, _estPub, _modalidad, '', 'filt_mod');

//                 } else if (_estTraz) {
//                     // Solo trazabilidad
//                     listar_pedidos_administrador(fecha_inicial, fecha_final, _estTraz, '', '', 'trazabilidad');

//                 } else if (_estPub) {
//                     // Solo estado publicación/asignación
//                     listar_pedidos_administrador(fecha_inicial, fecha_final, _estPub, '', '', 'filt');

//                 } else if (_modalidad) {
//                     // Solo modalidad
//                     listar_pedidos_administrador(fecha_inicial, fecha_final, '', _modalidad, '', 'mod');

//                 } else {
//                     // Solo fechas
//                     listar_pedidos_administrador(fecha_inicial, fecha_final, '', '', '', '');
//                 }
//             }

//             if (e.target.matches('#btn-carrito-pedidos') || e.target.matches('#btn-carrito-pedidos *')) {
//                 let clienId = document.getElementById('btn-carrito-pedidos').getAttribute('data-idCliente');
//                 let pedidoId = document.getElementById('btn-carrito-pedidos').getAttribute('data-idPedido');
//                 let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

//                 if (carrito.length === 0) {
//                     myOffcanvas.updateContent(`<p class="text-center text-muted">No hay pedidos en el carrito.</p>`);
//                 } else {
//                     let tablaHTML = `
//               <table class="table table-striped table-sm" data-page-length='100' style="font-size:11px;">
//                   <thead>
//                       <tr>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>#</th>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>N° Pedido</th>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>Placa</th>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>Cliente</th>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>Producto</th>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>Unidades</th>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>Presetación</th>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>Peso Neto</th>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>Peso Bruto</th>
//                       </tr>
//                   </thead>
//                   <tbody>`;

//                     carrito.forEach((item, index) => {
//                         tablaHTML += `
//                   <tr>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${index + 1}</td>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${item.id}</td>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId4}</td>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId || '-'}</td>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId12 || '-'}</td>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId7 || '-'}</td>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId13 || '-'}</td>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId10 || '-'} KG</td>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId11 || '-'} KG</td>
//                   </tr>`;
//                     });

//                     tablaHTML += `
//                     </tbody>
//                     </table>
//                     <div class="d-flex align-items-center justify-content-between">
//                         <h5 id="titulo_opcion" class="mb-0 me-2 d-flex align-items-center justify-content-center">Título</h5>
//                         <div id="acciones_asignacion"></div>
//                     </div>
//                     <hr class="my-1 text-dark">
//                     <div class="container" id="contenido_opcion"></div>
//                 `;

//                     myOffcanvas.updateTitle(`
//                     <div class="d-flex align-items-center justify-content-between">
//                         <span class="text-primary-emphasis uil uil-file-alt"></span> Listado de Pedidos 
//                         <div class="dropdown ms-2">
//                         <a class="btn btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink"  href="#"  role="button" data-bs-toggle="dropdown"  aria-haspopup="true"  aria-expanded="false">Opciones</a>
//                         <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
//                             <a class="dropdown-item fw-bold" href="#" id="btn_asignar_proveedor" data-id="${pedidoId}" data-id2="${clienId}" data-title="Asignar Proveedor"><span class="uil uil-file-search-alt"></span> Asignar Proveedor</a>
//                             <a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido"   data-id="${pedidoId}" data-id2="${clienId}" data-title="Publicar Pedidos"><span class="uil uil-feedback"></span> Publicar Pedido</a>
//                             <!--<a class="dropdown-item" href="#">Something else here</a>
//                             <div class="dropdown-divider"></div>
//                             <a class="dropdown-item" href="#">Separated link</a>
//                         </div>-->
//                         </div>
//                     </div>
//                 `);

//                     myOffcanvas.updateContent(tablaHTML);
//                     myOffcanvas.updateHeight('100vh');
//                     myOffcanvas.updateWidth('70%');
//                     myOffcanvas.updateClass('offcanvas-end');
//                 }

//                 myOffcanvas.show();
//             }

//             if (e.target.matches('#btn_detalle_trazabilidad_pedido') || e.target.matches('#btn_detalle_trazabilidad_pedido *')) {
//                 let Enlace = e.target.closest('#btn_detalle_trazabilidad_pedido');
//                 let PedidoId = Enlace.getAttribute('data-id');

//                 myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Trazabilidad pedido`);
//                 myOffcanvas.updateContent(`
//                     <div class="table-responsive scrollbar">
//                         <style>
//                             #lineaTiempo {
//                             position: relative;
//                             }

//                             #lineaTiempo .progreso-linea,
//                             #lineaTiempo .progreso-linea-actual {
//                             position: absolute;
//                             top: 16px; /* Centro exacto de los círculos de 32px de alto */
//                             height: 4px;
//                             z-index: 0;
//                             transition: all 0.3s ease-in-out;
//                             }

//                             #lineaTiempo .progreso-linea {
//                             background-color: green;
//                             }

//                             #lineaTiempo .progreso-linea-actual {
//                             background-color: orange;
//                             }

//                             .step {
//                             position: relative;
//                             z-index: 1;
//                             flex: 1;
//                             display: flex;
//                             flex-direction: column;
//                             align-items: center;
//                             }

//                             .circle {
//                             width: 32px;
//                             height: 32px;
//                             background-color: #dee2e6;
//                             border-radius: 50%;
//                             border: 3px solid transparent;
//                             display: flex;
//                             align-items: center;
//                             justify-content: center;
//                             z-index: 1;
//                             }

//                             .circle.completed {
//                             background-color: green;
//                             }

//                             .circle.current {
//                             background-color: orange;
//                             }

//                             .step small {
//                             margin-top: 6px;
//                             font-size: 0.75rem;
//                             color: #495057;
//                             text-align: center;
//                             }

//                             .info-extra {
//                             font-size: 0.7rem;
//                             color: #6c757d;
//                             text-align: center;
//                             }
//                         </style>

//                         <div class="timeline-wrapper bg-light rounded p-4" >
//                             <h1 class="h6 mb-3 text-end"><span id='FechaEstimada'></span></h1>
//                             <div class="d-flex justify-content-between position-relative timeline-line" id="lineaTiempo">
//                             <!-- Los pasos se inyectarán por JavaScript -->
//                             </div>
//                         </div>

//                         <div class="border-top border-translucent border-dashed pt-3"></div>

//                         <table class="table table-sm text-center" style="font-size: 11px;">
//                         <thead>
//                             <tr>
//                             <th class='text-center' style='width: auto; white-space: nowrap;'>#</th>
//                             <th class='text-center' style='width: auto; white-space: nowrap;'>Tipo Trazabilidad</th>
//                             <th class='text-center' style='width: auto; white-space: nowrap;'>Observación</th>
//                             <th class='text-center' style='width: auto; white-space: nowrap;'>Usuario</th>
//                             <th class='text-center' style='width: auto; white-space: nowrap;'>Fecha</th>
//                             <th class='text-center' style='width: auto; white-space: nowrap;'>Soporte</th>
//                             </tr>
//                         </thead>
//                         <tbody id="tbody_detalle_trazabilidad_pedido" class="text-center">
//                             <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
//                         </tbody>
//                         </table>

//                         <!--<style>
//                             .timeline {
//                             display: flex;
//                             justify-content: space-between;
//                             align-items: center;
//                             margin: 50px 0;
//                             position: relative;
//                             }

//                             .timeline::before {
//                             content: '';
//                             position: absolute;
//                             top: 50%;
//                             left: 0;
//                             width: 100%;
//                             height: 4px;
//                             background-color: #000;
//                             z-index: 1;
//                             }

//                             .step {
//                             position: relative;
//                             z-index: 2;
//                             text-align: center;
//                             flex: 1;
//                             }

//                             .circle {
//                             width: 30px;
//                             height: 30px;
//                             border-radius: 50%;
//                             margin: 0 auto 10px;
//                             background-color: #ccc;
//                             border: 2px solid #000;
//                             transition: background-color 0.5s ease;
//                             }

//                             .step.active .circle {
//                             background-color: #ffc107; /* amarillo */
//                             }

//                             .step.done .circle {
//                             background-color: #28a745; /* verde */
//                             }

//                             .label {
//                             font-weight: bold;
//                             }
//                         </style>

//                         <div class="container">
//                         <div class="timeline">
//                             <div class="step done" id="step1">
//                             <div class="circle"></div>
//                             <div class="label">Asignado</div>
//                             </div>
//                             <div class="step active" id="step2">
//                             <div class="circle"></div>
//                             <div class="label">Llega vehículo</div>
//                             </div>
//                             <div class="step" id="step3">
//                             <div class="circle"></div>
//                             <div class="label">En cargue</div>
//                             </div>
//                             <div class="step" id="step4">
//                             <div class="circle"></div>
//                             <div class="label">En ruta</div>
//                             </div>
//                             <div class="step" id="step5">
//                             <div class="circle"></div>
//                             <div class="label">Entregado</div>
//                             </div>
//                         </div>
//                         </div>-->
//                     </div>
//                 `);

//                 try {
//                     let formData = new FormData();
//                     formData.append('PedidoId', PedidoId);

//                     let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_trazabilidad_pedido', {
//                         method: 'POST',
//                         body: formData,
//                     });

//                     let data = await response.json();
//                     if (data) {
//                         let rows = '';

//                         data.forEach((servicio, index) => {
//                             rows += `
//                             <tr>
//                             <th scope="row">${index + 1}</th>
//                             <!--<td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.referencia}</td>-->
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.tipo_trazabilidad}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.observacion}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.usuario}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_registro}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>
//                                 <a href="${$('#base_url').val()}${servicio.evidencia}" target="_blank" class="btn btn-outline-primary btn-sm me-1 px-1 py-0">
//                                     <i class="uil-file-download-alt"></i> Ver Documento
//                                 </a>
//                             </td>
//                             </tr>
//                             <!--<tr id="Recurso_proveedores_${servicio.referencia}" style="display: none;">
//                             <td colspan="12">
//                                 <div class="lista-proceso-proveedores"></div>
//                             </td>
//                             </tr>
//                             <tr id="trazabilidad_pedidos_recurso_${servicio.referencia}" style="display: none;">
//                             <td colspan="12">
//                                 <div class="trazabilidad-pedidos"></div>
//                             </td>
//                             </tr>-->
//                         `;
//                         });

//                         document.getElementById('tbody_detalle_trazabilidad_pedido').innerHTML = rows;
//                     } else {
//                         document.getElementById(
//                             'tbody_detalle_trazabilidad_pedido'
//                         ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
//                     }
//                 } catch (error) {
//                     console.error('Error al obtener proveedores:', error);
//                     document.getElementById(
//                         'tbody_detalle_trazabilidad_pedido'
//                     ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
//                 }

//                 // Actualizar el estado de los pasos en la línea de tiempo
//                 cargarLineaTiempo(PedidoId);
//                 myOffcanvas.show();
//             }

//             if (e.target.matches(`#btn-close-customOffcanvas${window.VENTANA}`) || e.target.matches(`#btn-close-customOffcanvas${window.VENTANA} *`)) {
//                 SatrackGPS.detener(); // ← AGREGAR ESTA LÍNEA al inicio del bloque existente
//                 sessionStorage.clear();
//                 actualizarContadorCarrito();

//                 const checkboxes = document.querySelectorAll('.servicioProveedor');
//                 checkboxes.forEach((element) => {
//                     if (element.checked) {
//                         console.log('El checkbox estaba marcado ✅ y ahora lo desmarcamos.');
//                         element.checked = false;
//                     } else {
//                         element.checked = false;
//                         console.log('El checkbox ya estaba NO marcado ❌.');
//                     }
//                 });

//                 window.ArrayDespachos = [];
//             }

//             if (e.target.matches('#btn_detalle_trazabilidad') || e.target.matches('#btn_detalle_trazabilidad *')) {
//                 let Enlace = e.target.closest('#btn_detalle_trazabilidad');
//                 // let numdoc_trazabilidad = Enlace.getAttribute("data-id");
//                 let ServicioId = Enlace.getAttribute('data-ServicioId');
//                 let RecursoId = Enlace.getAttribute('data-RecursoId');

//                 myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Detalle de solicitud de servicio`);
//                 myOffcanvas.updateContent(`
//                 <div class="table-responsive scrollbar">
//                     <table class="table table-sm text-center" style="font-size: 11px;">
//                         <thead>
//                         <tr>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>#</th>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>Placa</th>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>Ruta </th>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>Sitio</th>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>Latitud</th>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>Longitud</th>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>Fecha</th>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>Nota</th>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>Usuario</th>
//                         </tr>
//                         </thead>
//                         <tbody id="tbody_detalle_trazabilidad" class="text-center">
//                         <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
//                         </tbody>
//                     </table>
//                     </div>

//                     <div id="map" style="height: 600px; width: 100%;"></div>
//                 `);

//                 try {
//                     let formData = new FormData();
//                     formData.append('ServicioId', ServicioId);
//                     formData.append('RecursoId', RecursoId);
//                     // formData.append("proveedor_id", document.getElementById('proveedor_id').value);

//                     let response = await fetch($('#base_url').val() + 'torrecontrol/detalle_trazabilidad_pedido', {
//                         method: 'POST',
//                         body: formData,
//                     });

//                     let data = await response.json();
//                     if (data) {
//                         let rows = '';

//                         data.forEach((servicio, index) => {
//                             rows += `
//                             <tr>
//                             <th scope="row">${index + 1}</th>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.placa_vehiculo}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.ruta}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.sitio_seguimiento}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.latitud}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.longitud}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_hora_seguimiento}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.nota_seguimiento}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.usuario_reporte}</td>
//                             </tr>
//                             <tr id="Recurso_proveedores_${servicio.referencia}" style="display: none;">
//                             <td colspan="12">
//                                 <div class="lista-proceso-proveedores"></div>
//                             </td>
//                             </tr>
//                         `;
//                         });

//                         document.getElementById('tbody_detalle_trazabilidad').innerHTML = rows;

//                         /*Dibujar mapa  */
//                         let map; // 🛡️ Mejor declararlo afuera

//                         async function initMap() {
//                             const { Map } = await google.maps.importLibrary('maps');
//                             const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
//                             const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary('routes');
//                             const { Geocoder } = await google.maps.importLibrary('geocoding'); // Importar Geocoder

//                             map = new Map(document.getElementById('map'), {
//                                 center: { lat: 4.5709, lng: -74.2973 }, // Colombia
//                                 zoom: 5.5,
//                                 gestureHandling: 'greedy',
//                                 mapId: 'db5350020424d6c4',
//                             });

//                             const geocoder = new Geocoder();

//                             // Función auxiliar para obtener el nombre del lugar
//                             async function obtenerNombreLugar(lat, lng) {
//                                 return new Promise((resolve, reject) => {
//                                     geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//                                         if (status === 'OK' && results[0]) {
//                                             resolve(results[0].formatted_address); // Puedes usar también address_components si quieres algo más específico
//                                         } else {
//                                             console.error('No se pudo obtener el nombre del lugar:', status);
//                                             resolve('Lugar desconocido'); // Por si falla
//                                         }
//                                     });
//                                 });
//                             }

//                             // Colocar los marcadores
//                             for (const punto of data) {
//                                 const lat = parseFloat(punto.latitud);
//                                 const lng = parseFloat(punto.longitud);
//                                 const nombreLugar = await obtenerNombreLugar(lat, lng);

//                                 new AdvancedMarkerElement({
//                                     map: map,
//                                     position: { lat, lng },
//                                     title: `${nombreLugar}\n${punto.fecha_hora}`, // Nombre + fecha_hora
//                                 });
//                             }

//                             // Ahora usar DirectionsService para calcular la ruta real
//                             const directionsService = new DirectionsService();
//                             const directionsRenderer = new DirectionsRenderer({ map: map });

//                             // Creamos el array de paradas (waypoints)
//                             const waypoints = data.slice(1, data.length - 1).map((punto) => ({
//                                 location: {
//                                     lat: parseFloat(punto.latitud),
//                                     lng: parseFloat(punto.longitud),
//                                 },
//                                 stopover: true,
//                             }));

//                             // Definimos la solicitud
//                             const request = {
//                                 origin: {
//                                     lat: parseFloat(data[0].latitud),
//                                     lng: parseFloat(data[0].longitud),
//                                 },
//                                 destination: {
//                                     lat: parseFloat(data[data.length - 1].latitud),
//                                     lng: parseFloat(data[data.length - 1].longitud),
//                                 },
//                                 waypoints: waypoints,
//                                 travelMode: google.maps.TravelMode.DRIVING,
//                                 optimizeWaypoints: false,
//                             };

//                             // Pedimos la ruta
//                             directionsService.route(request, (result, status) => {
//                                 if (status === 'OK') {
//                                     directionsRenderer.setDirections(result);
//                                 } else {
//                                     console.error('Error en la ruta:', status);
//                                 }
//                             });
//                         }

//                         initMap();
//                     } else {
//                         document.getElementById(
//                             'tbody_detalle_trazabilidad'
//                         ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
//                     }
//                 } catch (error) {
//                     console.error('Error al obtener proveedores:', error);
//                     document.getElementById(
//                         'tbody_detalle_trazabilidad'
//                     ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
//                 }

//                 myOffcanvas.show();
//             }

//             if (e.target.matches('#btn_cancelar_pedido') || e.target.matches('#btn_cancelar_pedido *')) {
//                 let boton = e.target.closest('#btn_cancelar_pedido'); // Capturamos el botón real
//                 let SolicitudId = boton.getAttribute('data-id');

//                 try {
//                     const result = await Swal.fire({
//                         title: '¿Seguro?',
//                         text: '¿Desea cancelar la solicitud?',
//                         icon: 'warning',
//                         showCancelButton: true,
//                         confirmButtonColor: '#3B71CA',
//                         cancelButtonColor: '#9FA6B2',
//                         confirmButtonText: 'Aceptar',
//                         cancelButtonText: 'Cancelar',
//                         customClass: {
//                             popup: 'swal2-custom-font',
//                         },
//                     });

//                     if (result.isConfirmed) {
//                         let formData = new FormData();
//                         formData.append('SolicitudId', SolicitudId);

//                         let response = await fetch($('#base_url').val() + 'torrecontrol/cancelar_solicitud_pedido', {
//                             method: 'POST',
//                             body: formData,
//                         });

//                         let data = await response.json();

//                         if (data && data.status === true) {
//                             await Swal.fire({
//                                 title: 'Solicitud Cancelada',
//                                 text: data.message || 'La solicitud fue cancelada exitosamente.',
//                                 icon: 'success',
//                                 confirmButtonColor: '#3B71CA',
//                                 customClass: {
//                                     popup: 'swal2-custom-font',
//                                 },
//                             });

//                             // Si quieres actualizar la tabla o hacer otra acción después del éxito
//                             // actualizarTabla();  <-- ejemplo
//                             let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
//                             let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
//                             listar_pedidos_administrador(fecha_inicial, fecha_final);
//                         } else {
//                             await Swal.fire({
//                                 title: 'Error',
//                                 text: data.message || 'No se pudo cancelar la solicitud.',
//                                 icon: 'error',
//                                 confirmButtonColor: '#3B71CA',
//                                 customClass: {
//                                     popup: 'swal2-custom-font',
//                                 },
//                             });

//                             document.getElementById('tbody_detalle_trazabilidad').innerHTML = `
//                                 <tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>
//                             `;
//                         }
//                     }
//                 } catch (error) {
//                     console.error('Error al cancelar solicitud:', error);

//                     await Swal.fire({
//                         title: 'Error inesperado',
//                         text: 'Ocurrió un error al intentar cancelar la solicitud.',
//                         icon: 'error',
//                         confirmButtonColor: '#3B71CA',
//                         customClass: {
//                             popup: 'swal2-custom-font',
//                         },
//                     });

//                     document.getElementById('tbody_detalle_trazabilidad').innerHTML = `
//                         <tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>
//                     `;
//                 }
//             }

//             if (e.target.matches(`#btn_detalle`) || e.target.matches(`#btn_detalle *`)) {
//                 let Enlace = e.target.closest('#btn_detalle');
//                 let PedidoId = Enlace.getAttribute('data-SolicitudId');
//                 let ServicioId = Enlace.getAttribute('data-ServicioId');
//                 let RecursoId = Enlace.getAttribute('data-RecursoId');

//                 myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Trazabilidad`);
//                 myOffcanvas.updateContent(`
//                     <div class="table-responsive scrollbar">
//                         <style>
//                             #lineaTiempo {
//                             position: relative;
//                             }

//                             #lineaTiempo .progreso-linea,
//                             #lineaTiempo .progreso-linea-actual {
//                             position: absolute;
//                             top: 16px; /* Centro exacto de los círculos de 32px de alto */
//                             height: 4px;
//                             z-index: 0;
//                             transition: all 0.3s ease-in-out;
//                             }

//                             #lineaTiempo .progreso-linea {
//                             background-color: green;
//                             }

//                             #lineaTiempo .progreso-linea-actual {
//                             background-color: orange;
//                             }

//                             .step {
//                             position: relative;
//                             z-index: 1;
//                             flex: 1;
//                             display: flex;
//                             flex-direction: column;
//                             align-items: center;
//                             }

//                             .circle {
//                             width: 32px;
//                             height: 32px;
//                             background-color: #dee2e6;
//                             border-radius: 50%;
//                             border: 3px solid transparent;
//                             display: flex;
//                             align-items: center;
//                             justify-content: center;
//                             z-index: 1;
//                             }

//                             .circle.completed {
//                             background-color: green;
//                             }

//                             .circle.current {
//                             background-color: orange;
//                             }

//                             .step small {
//                             margin-top: 6px;
//                             font-size: 0.75rem;
//                             color: #495057;
//                             text-align: center;
//                             }

//                             .info-extra {
//                             font-size: 0.7rem;
//                             color: #6c757d;
//                             text-align: center;
//                             }
//                         </style>

//                         <div class="timeline-wrapper bg-light rounded p-4" >
//                             <h1 class="h6 mb-3 text-end"><span id='FechaEstimada'></span></h1>
//                             <div class="d-flex justify-content-between position-relative timeline-line" id="lineaTiempo">
//                             <!-- Los pasos se inyectarán por JavaScript -->
//                             </div>
//                         </div>

//                         <div class="border-top border-translucent border-dashed pt-3"></div>

//                         <hr class="my-1 text-dark">
//                             <h6>Trazabilidad Pedido</h6>
//                         <hr class="my-1 text-dark">

//                         <table class="table table-sm text-center" style="font-size: 11px;">
//                             <thead>
//                                 <tr>
//                                 <th class='text-center' style='width: auto; white-space: nowrap;'>#</th>
//                                 <th class='text-center' style='width: auto; white-space: nowrap;'>Tipo Trazabilidad</th>
//                                 <th class='text-center' style='width: auto; white-space: nowrap;'>Observación</th>
//                                 <th class='text-center' style='width: auto; white-space: nowrap;'>Usuario</th>
//                                 <th class='text-center' style='width: auto; white-space: nowrap;'>Fecha</th>
//                                 <th class='text-center' style='width: auto; white-space: nowrap;'>Soporte</th>
//                                 </tr>
//                             </thead>
//                             <tbody id="tbody_detalle_trazabilidad_pedido" class="text-center">
//                                 <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
//                             </tbody>
//                         </table>
//                     </div>

//                     <hr class="my-1 text-dark">
//                         <h6>Trazabilidad Recurso</h6>
//                     <hr class="my-1 text-dark">

//                     <div class="table-responsive scrollbar">
//                         <table class="table table-sm text-center" style="font-size: 11px;">
//                             <thead>
//                             <tr>
//                                 <th scope="col" style='width: auto; white-space: nowrap;'>#</th>
//                                 <th scope="col" style='width: auto; white-space: nowrap;'>Placa</th>
//                                 <th scope="col" style='width: auto; white-space: nowrap;'>Ruta </th>
//                                 <th scope="col" style='width: auto; white-space: nowrap;'>Sitio</th>
//                                 <th scope="col" style='width: auto; white-space: nowrap;'>Latitud</th>
//                                 <th scope="col" style='width: auto; white-space: nowrap;'>Longitud</th>
//                                 <th scope="col" style='width: auto; white-space: nowrap;'>Fecha</th>
//                                 <th scope="col" style='width: auto; white-space: nowrap;'>Nota</th>
//                                 <th scope="col" style='width: auto; white-space: nowrap;'>Usuario</th>
//                             </tr>
//                             </thead>
//                             <tbody id="tbody_detalle_trazabilidad" class="text-center">
//                             <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
//                             </tbody>
//                         </table>
//                     </div>
//                     <div id="map" style="height: 600px; width: 100%;"></div>
//                 `);

//                 try {
//                     let formData = new FormData();
//                     formData.append('PedidoId', PedidoId);

//                     let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_trazabilidad_pedido', {
//                         method: 'POST',
//                         body: formData,
//                     });

//                     let data = await response.json();
//                     if (data) {
//                         let rows = '';

//                         data.forEach((servicio, index) => {
//                             rows += `
//                             <tr>
//                             <th scope="row">${index + 1}</th>
//                             <!--<td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.referencia}</td>-->
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.tipo_trazabilidad}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.observacion}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.usuario}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_registro}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>
//                                 <a href="${$('#base_url').val()}${servicio.evidencia
//                                 }" target="_blank" class="btn btn-outline-primary btn-sm me-1 px-1 py-0">
//                                     <i class="uil-file-download-alt"></i> Ver Documento
//                                 </a>
//                             </td>
//                             </tr>
//                         `;
//                         });

//                         document.getElementById('tbody_detalle_trazabilidad_pedido').innerHTML = rows;
//                     } else {
//                         document.getElementById(
//                             'tbody_detalle_trazabilidad_pedido'
//                         ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
//                     }
//                 } catch (error) {
//                     console.error('Error al obtener proveedores:', error);
//                     document.getElementById(
//                         'tbody_detalle_trazabilidad_pedido'
//                     ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
//                 }

//                 //Trazabilidad de los recursos
//                 try {
//                     let formData = new FormData();
//                     formData.append('ServicioId', ServicioId);
//                     formData.append('RecursoId', RecursoId);
//                     // formData.append("proveedor_id", document.getElementById('proveedor_id').value);

//                     let response = await fetch($('#base_url').val() + 'torrecontrol/detalle_trazabilidad_pedido', {
//                         method: 'POST',
//                         body: formData,
//                     });

//                     let data = await response.json();
//                     if (data) {
//                         let rows = '';

//                         data.forEach((servicio, index) => {
//                             rows += `
//                             <tr>
//                             <th scope="row">${index + 1}</th>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.placa_vehiculo}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.ruta}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.sitio_seguimiento}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.latitud}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.longitud}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_hora_seguimiento}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.nota_seguimiento}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.usuario_reporte}</td>
//                             </tr>
//                             <tr id="Recurso_proveedores_${servicio.referencia}" style="display: none;">
//                             <td colspan="12">
//                                 <div class="lista-proceso-proveedores"></div>
//                             </td>
//                             </tr>
//                         `;
//                         });

//                         document.getElementById('tbody_detalle_trazabilidad').innerHTML = rows;

//                         /*Dibujar mapa  */
//                         let map; // 🛡️ Mejor declararlo afuera

//                         async function initMap() {
//                             const { Map } = await google.maps.importLibrary('maps');
//                             const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
//                             const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary('routes');
//                             const { Geocoder } = await google.maps.importLibrary('geocoding'); // Importar Geocoder

//                             map = new Map(document.getElementById('map'), {
//                                 center: { lat: 4.5709, lng: -74.2973 }, // Colombia
//                                 zoom: 5.5,
//                                 gestureHandling: 'greedy',
//                                 mapId: 'db5350020424d6c4',
//                             });

//                             const geocoder = new Geocoder();

//                             // Función auxiliar para obtener el nombre del lugar
//                             async function obtenerNombreLugar(lat, lng) {
//                                 return new Promise((resolve, reject) => {
//                                     geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//                                         if (status === 'OK' && results[0]) {
//                                             resolve(results[0].formatted_address); // Puedes usar también address_components si quieres algo más específico
//                                         } else {
//                                             console.error('No se pudo obtener el nombre del lugar:', status);
//                                             resolve('Lugar desconocido'); // Por si falla
//                                         }
//                                     });
//                                 });
//                             }

//                             // Colocar los marcadores
//                             for (const punto of data) {
//                                 const lat = parseFloat(punto.latitud);
//                                 const lng = parseFloat(punto.longitud);
//                                 const nombreLugar = await obtenerNombreLugar(lat, lng);

//                                 new AdvancedMarkerElement({
//                                     map: map,
//                                     position: { lat, lng },
//                                     title: `${nombreLugar}\n${punto.fecha_hora}`, // Nombre + fecha_hora
//                                 });
//                             }

//                             // Ahora usar DirectionsService para calcular la ruta real
//                             const directionsService = new DirectionsService();
//                             const directionsRenderer = new DirectionsRenderer({ map: map });

//                             // Creamos el array de paradas (waypoints)
//                             const waypoints = data.slice(1, data.length - 1).map((punto) => ({
//                                 location: {
//                                     lat: parseFloat(punto.latitud),
//                                     lng: parseFloat(punto.longitud),
//                                 },
//                                 stopover: true,
//                             }));

//                             // Definimos la solicitud
//                             const request = {
//                                 origin: {
//                                     lat: parseFloat(data[0].latitud),
//                                     lng: parseFloat(data[0].longitud),
//                                 },
//                                 destination: {
//                                     lat: parseFloat(data[data.length - 1].latitud),
//                                     lng: parseFloat(data[data.length - 1].longitud),
//                                 },
//                                 waypoints: waypoints,
//                                 travelMode: google.maps.TravelMode.DRIVING,
//                                 optimizeWaypoints: false,
//                             };

//                             // Pedimos la ruta
//                             directionsService.route(request, (result, status) => {
//                                 if (status === 'OK') {
//                                     directionsRenderer.setDirections(result);
//                                 } else {
//                                     console.error('Error en la ruta:', status);
//                                 }
//                             });
//                         }
//                         initMap();
//                     } else {
//                         document.getElementById(
//                             'tbody_detalle_trazabilidad'
//                         ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
//                     }
//                 } catch (error) {
//                     console.error('Error al obtener proveedores:', error);
//                     document.getElementById(
//                         'tbody_detalle_trazabilidad'
//                     ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
//                 }

//                 // Actualizar el estado de los pasos en la línea de tiempo
//                 cargarLineaTiempo(PedidoId);
//                 myOffcanvas.show();
//             }

//             /* ══════════════════════════════════════════════════════════════════════════════
//             |  BLOQUE 1 — Reemplaza el handler de #btn_detalle_trazabilidad_pedidos
//             |  (desde "if (e.target.matches('#btn_detalle_trazabilidad_pedidos')"
//             |   hasta su "}" de cierre, línea ~1061)
//             ══════════════════════════════════════════════════════════════════════════════*/

//             if (e.target.matches('#btn_detalle_trazabilidad_pedidos') || e.target.matches('#btn_detalle_trazabilidad_pedidos *')) {
//                 let BtnDetalle = e.target.closest('#btn_detalle_trazabilidad_pedidos');
//                 let SolicitudId = parseFloat(BtnDetalle.getAttribute('data-SolicitudId'));
//                 let LatitudOrigen = parseFloat(BtnDetalle.getAttribute('data-latitud_origen'));
//                 let LongitudOrigen = parseFloat(BtnDetalle.getAttribute('data-longitud_origen'));
//                 let LatitudDestino = parseFloat(BtnDetalle.getAttribute('data-latitud_destino'));
//                 let LongitudDestino = parseFloat(BtnDetalle.getAttribute('data-longitud_destino'));
//                 let ciudad_origen = BtnDetalle.getAttribute('data-ciudad_origen');
//                 let ciudad_destino = BtnDetalle.getAttribute('data-ciudad_destino');
//                 let fecha_creacion = BtnDetalle.getAttribute('data-fecha_creacion');
//                 let fecha_cargue = BtnDetalle.getAttribute('data-fecha_cargue');
//                 let fecha_entrega = BtnDetalle.getAttribute('data-fecha_entrega');
//                 let refPedido = BtnDetalle.getAttribute('data-refPedido');
//                 let tipoTrazabilidad = BtnDetalle.getAttribute('data-tipo_trazabilidad');
//                 // console.log("🚀 ~ tipoTrazabilidad:", tipoTrazabilidad);

//                 // ── Placa del pedido (usar data-placa del botón en producción) ──
//                 // Por ahora quemada; sustituir por:
//                 // let placaVehiculo = BtnDetalle.getAttribute('data-placa') ?? 'ABC123';

//                 // DESPUÉS
//                 const _placaRaw = BtnDetalle.getAttribute('data-placa');
//                 let placaVehiculo = (_placaRaw && _placaRaw !== 'null') ? _placaRaw : null;

//                 // ── Detener rastreo anterior si había uno activo ──
//                 SatrackGPS.detener();

//                 // ── Inyectar ID en los paneles ──
//                 document.querySelectorAll('.oc-sec-panel').forEach(panel => {
//                     panel.dataset.pedidoId = SolicitudId;
//                 });

//                 // ── Actualizar MAPA_CONFIG ──
//                 MAPA_CONFIG = {
//                     origen: { lat: LatitudOrigen, lng: LongitudOrigen, label: ciudad_origen },
//                     vehiculo: { label: placaVehiculo }, // lat/lng los asigna SatrackGPS al cargar
//                     destino: { lat: LatitudDestino, lng: LongitudDestino, label: ciudad_destino },
//                     radioOrigen: 300,
//                     radioDestino: 250,
//                 };

//                 // ── Variables globales de línea de tiempo ──
//                 window._tlSolicitudId = SolicitudId;
//                 window._tlFechaCreacion = fecha_creacion;
//                 window._tlFechaCargue = fecha_cargue;
//                 window._tlFechaEntrega = fecha_entrega;

//                 // ── Guardar la placa activa para usarla en initOcMap ──
//                 window._satrackPlacaActiva = placaVehiculo;

//                 // ── Actualizar DOM ──
//                 const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
//                 setEl('det-pedido', refPedido);
//                 setEl('ciudad-origen', ciudad_origen);
//                 setEl('ciudad-destino', ciudad_destino);

//                 // ── Línea de tiempo inicial ──
//                 // actualizarLineaTiempo(SolicitudId, fecha_creacion, fecha_cargue, fecha_entrega, 0);

//                 // ── Detalle del proceso ──
//                 try {
//                     const formData = new FormData();
//                     formData.append('Solicitud', SolicitudId);

//                     const response = await fetch($('#base_url').val() + 'torrecontrol/detalle_proceso', {
//                         method: 'POST', body: formData,
//                     });
//                     const data = await response.json();
//                     const sub = data.consulta_subasta[0];
//                     const safe = (val) => (val ?? '');

//                     setEl('nc-conductor', safe(sub?.nombre_conductor));
//                     // … resto de setEl que ya tenías …

//                 } catch (error) {
//                     console.error('Error al obtener detalle proceso:', error);
//                 }

//                 // ── Trazabilidad real del pedido → alimenta la línea de tiempo ──
//                 try {
//                     const formDataTraz = new FormData();
//                     formDataTraz.append('PedidoId', SolicitudId);

//                     const resTraz = await fetch($('#base_url_api').val() + 'Trazabilidad_pedidos', {
//                         method: 'POST',
//                         headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
//                         body: formDataTraz,
//                     });
//                     const jsonTraz = await resTraz.json();

//                     if (jsonTraz.numero === 200 && Array.isArray(jsonTraz.data)) {
//                         window._trazabilidadPedido = jsonTraz.data;
//                     } else {
//                         window._trazabilidadPedido = [];
//                     }
//                 } catch (errTraz) {
//                     console.warn('Sin trazabilidad disponible:', errTraz);
//                     window._trazabilidadPedido = [];
//                 }

//                 // Llamar con trazabilidad ya cargada en window._trazabilidadPedido
//                 actualizarLineaTiempo(SolicitudId, fecha_creacion, fecha_cargue, fecha_entrega, 0, tipoTrazabilidad);
//             }

//             // ── Helper distancia/tiempo + KPIs + línea de tiempo ─
//             function actualizarInfoRuta(legs) {
//                 let totalDistanciaM = 0;
//                 let totalDuracionS = 0;

//                 legs.forEach(leg => {
//                     totalDistanciaM += leg.distance.value;
//                     totalDuracionS += leg.duration.value;
//                 });

//                 const km = (totalDistanciaM / 1000).toFixed(1);
//                 const distanciaText = km >= 1 ? `${km} km` : `${totalDistanciaM} m`;

//                 const horas = Math.floor(totalDuracionS / 3600);
//                 const minutos = Math.floor((totalDuracionS % 3600) / 60);
//                 let duracionText = '';
//                 if (horas > 0) duracionText += `${horas} h `;
//                 if (minutos > 0) duracionText += `${minutos} min`;
//                 if (!duracionText) duracionText = '< 1 min';

//                 const elDist = document.getElementById('ocMapDistancia');
//                 const elDur = document.getElementById('ocMapDuracion');
//                 if (elDist) elDist.textContent = distanciaText;
//                 if (elDur) elDur.textContent = duracionText;

//                 const segVehiculoDestino = legs[1] ?? legs[0];
//                 actualizarKpisOc(
//                     segVehiculoDestino.duration.value,
//                     window._tlFechaCargue,
//                     window._tlFechaEntrega
//                 );

//                 // actualizarLineaTiempo(
//                 //     window._tlSolicitudId,
//                 //     window._tlFechaCreacion,
//                 //     window._tlFechaCargue,
//                 //     window._tlFechaEntrega,
//                 //     segVehiculoDestino.duration.value
//                 // );
//             }

//             // ── Geocercas ────────────────────────────────────────
//             async function cargarGeocercasPedido(pedidoId) {
//                 if (!ocMap) return;

//                 try {
//                     const baseUrl = document.getElementById('base_url_api').value;
//                     const formData = new FormData();
//                     formData.append('PedidoId', pedidoId);

//                     const res = await fetch(baseUrl + 'Geocercas_pedido', {
//                         method: 'POST',
//                         headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
//                         body: formData,
//                     });
//                     const json = await res.json();
//                     if (json.numero !== 200) return;

//                     const { remitente, destinatario, todos_puntos } = json.data;

//                     const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
//                     const { Circle } = await google.maps.importLibrary("maps");
//                     const { DirectionsService, TravelMode } = await google.maps.importLibrary("routes");

//                     /* ── Actualizar MAPA_CONFIG con coords reales ── */
//                     if (remitente?.lat && remitente?.lng) {
//                         MAPA_CONFIG.origen = { lat: remitente.lat, lng: remitente.lng, label: remitente.nombre };
//                     }
//                     if (destinatario?.lat && destinatario?.lng) {
//                         MAPA_CONFIG.destino = { lat: destinatario.lat, lng: destinatario.lng, label: destinatario.nombre };
//                     }

//                     /* ── Calcular ruta ── */
//                     if (MAPA_CONFIG.origen?.lat && MAPA_CONFIG.destino?.lat && directionsRenderer) {
//                         // Solo incluir el vehículo como waypoint si ya tiene posición real de Satrack
//                         const vehiculoWp = MAPA_CONFIG.vehiculo?.lat
//                             ? [{ location: { lat: MAPA_CONFIG.vehiculo.lat, lng: MAPA_CONFIG.vehiculo.lng }, stopover: false }]
//                             : [];

//                         new DirectionsService().route({
//                             origin: { lat: MAPA_CONFIG.origen.lat, lng: MAPA_CONFIG.origen.lng },
//                             destination: { lat: MAPA_CONFIG.destino.lat, lng: MAPA_CONFIG.destino.lng },
//                             travelMode: TravelMode.DRIVING,
//                             // waypoints: [{ location: MAPA_CONFIG.vehiculo, stopover: false }],
//                             waypoints: vehiculoWp,
//                         }, (result, status) => {
//                             if (status === 'OK') {
//                                 directionsRenderer.setDirections(result);
//                                 actualizarInfoRuta(result.routes[0].legs);
//                             } else {
//                                 console.warn('Directions API error:', status);
//                             }
//                         });
//                     }

//                     /* ── Helper: animar círculo con pulso ── */
//                     function animarCirculo(circle, radioBase, colorStroke) {
//                         let creciendo = true;
//                         let radio = radioBase;
//                         let opacidad = 0.7;

//                         setInterval(() => {
//                             if (creciendo) {
//                                 radio += radioBase * 0.08;
//                                 opacidad -= 0.04;
//                                 if (radio >= radioBase * 1.6) creciendo = false;
//                             } else {
//                                 radio -= radioBase * 0.08;
//                                 opacidad += 0.04;
//                                 if (radio <= radioBase) creciendo = true;
//                             }
//                             circle.setRadius(radio);
//                             circle.setOptions({ strokeOpacity: Math.max(0.1, opacidad) });
//                         }, 80);
//                     }

//                     /* ── Remitente del pedido (azul) ── */
//                     if (remitente?.lat && remitente?.lng) {
//                         const pinRem = new PinElement({
//                             background: '#0369a1', borderColor: '#0c4a6e',
//                             glyphColor: '#fff', glyph: '🏭', scale: 1.2,
//                         });
//                         new AdvancedMarkerElement({
//                             map: ocMap,
//                             position: { lat: remitente.lat, lng: remitente.lng },
//                             title: `Remitente: ${remitente.nombre}`,
//                             content: pinRem.element,
//                         });

//                         remitente.geocercas.forEach(g => {
//                             if (!g.lat || !g.lng) return;
//                             // const radioBase = 1500;
//                             const radioBase = 25;
//                             const c = new Circle({
//                                 map: ocMap,
//                                 center: { lat: g.lat, lng: g.lng },
//                                 radius: radioBase,
//                                 strokeColor: '#0369a1',
//                                 strokeOpacity: 0.7,
//                                 strokeWeight: 2,
//                                 fillColor: '#0369a1',
//                                 fillOpacity: 0.06,
//                             });
//                             animarCirculo(c, radioBase, '#0369a1');
//                         });
//                     }

//                     /* ── Destinatario del pedido (verde) ── */
//                     if (destinatario?.lat && destinatario?.lng) {
//                         const pinDes = new PinElement({
//                             background: '#16a34a', borderColor: '#14532d',
//                             glyphColor: '#fff', glyph: '🏪', scale: 1.2,
//                         });
//                         new AdvancedMarkerElement({
//                             map: ocMap,
//                             position: { lat: destinatario.lat, lng: destinatario.lng },
//                             title: `Destinatario: ${destinatario.nombre}`,
//                             content: pinDes.element,
//                         });

//                         destinatario.geocercas.forEach(g => {
//                             if (!g.lat || !g.lng) return;
//                             const radioBase = 1500;
//                             const c = new Circle({
//                                 map: ocMap,
//                                 center: { lat: g.lat, lng: g.lng },
//                                 radius: radioBase,
//                                 strokeColor: '#16a34a',
//                                 strokeOpacity: 0.7,
//                                 strokeWeight: 2,
//                                 fillColor: '#16a34a',
//                                 fillOpacity: 0.06,
//                             });
//                             animarCirculo(c, radioBase, '#16a34a');
//                         });
//                     }

//                     /* ── Todos los puntos del cliente (gris) ── */
//                     todos_puntos.forEach(punto => {
//                         if (punto.esPedido || !punto.lat || !punto.lng) return;
//                         const pin = new PinElement({
//                             background: '#94a3b8', borderColor: '#475569',
//                             glyphColor: '#fff', glyph: '📍', scale: 0.8,
//                         });
//                         new AdvancedMarkerElement({
//                             map: ocMap,
//                             position: { lat: punto.lat, lng: punto.lng },
//                             title: punto.nombre,
//                             content: pin.element,
//                         });
//                         punto.geocercas.forEach(g => {
//                             if (!g.lat || !g.lng) return;
//                             const radioBase = 1500;
//                             const c = new Circle({
//                                 map: ocMap,
//                                 center: { lat: g.lat, lng: g.lng },
//                                 radius: radioBase,
//                                 strokeColor: '#94a3b8',
//                                 strokeOpacity: 0.4,
//                                 strokeWeight: 1,
//                                 fillColor: '#94a3b8',
//                                 fillOpacity: 0.03,
//                             });
//                             animarCirculo(c, radioBase, '#94a3b8');
//                         });
//                     });

//                 } catch (e) {
//                     console.warn('Error cargando geocercas:', e);
//                 }
//             }

//             /* ══════════════════════════════════════════════════════════════════════════════
//             |  BLOQUE 2 — Reemplaza initOcMap() completa (línea ~1387)
//             |  Busca: "async function initOcMap() {"
//             |  Reemplaza todo el cuerpo de la función por el de abajo.
//             ══════════════════════════════════════════════════════════════════════════════*/
//             async function initOcMap() {
//                 if (!MAPA_CONFIG.origen || !MAPA_CONFIG.destino) {
//                     console.warn('initOcMap: MAPA_CONFIG no listo, reintentando…');
//                     setTimeout(initOcMap, 200);
//                     return;
//                 }

//                 const { Map, InfoWindow } = await google.maps.importLibrary('maps');
//                 const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary('marker');
//                 const { DirectionsRenderer } = await google.maps.importLibrary('routes');

//                 const mapDiv = document.getElementById('ocMap');
//                 if (!mapDiv) return;

//                 // ── Crear el mapa centrado en origen mientras llega la posición del vehículo ──
//                 ocMap = new Map(mapDiv, {
//                     center: MAPA_CONFIG.origen,
//                     zoom: 6,
//                     mapId: 'DEMO_MAP_ID',
//                     mapTypeId: 'roadmap',
//                     disableDefaultUI: false,
//                     zoomControl: true,
//                     streetViewControl: false,
//                     mapTypeControl: false,
//                     fullscreenControl: true,
//                 });

//                 // ── Marcador del vehículo sin posición — SatrackGPS lo ubica al cargar ──
//                 const pinVehiculo = new PinElement({
//                     background: '#ea580c',
//                     borderColor: '#9a3412',
//                     glyphColor: '#fff',
//                     glyph: '🚛',
//                     scale: 1.3,
//                 });
//                 vehiculoMarker = new AdvancedMarkerElement({
//                     map: ocMap,
//                     position: null,
//                     title: MAPA_CONFIG.vehiculo?.label ?? '',
//                     content: pinVehiculo.element,
//                 });

//                 // ── DirectionsRenderer ──
//                 directionsRenderer = new DirectionsRenderer({
//                     map: ocMap,
//                     suppressMarkers: true,
//                     polylineOptions: {
//                         strokeColor: '#0369a1',
//                         strokeWeight: 4,
//                         strokeOpacity: 0.75,
//                     },
//                 });

//                 // ── InfoWindow del vehículo ──
//                 const infoWin = new InfoWindow({
//                     content: `
//                         <div style="font-family:sans-serif;font-size:12px;min-width:180px;">
//                             <div style="font-weight:700;color:#0f172a;margin-bottom:6px;">🚛 Cargando…</div>
//                         </div>`,
//                 });
//                 vehiculoMarker.addListener('click', () =>
//                     infoWin.open({ anchor: vehiculoMarker, map: ocMap })
//                 );

//                 // ── Geocercas (pinta ruta y marcadores de origen/destino) ──
//                 await cargarGeocercasPedido(window._tlSolicitudId);

//                 // ── INICIAR RASTREO SATRACK EN TIEMPO REAL ──
//                 const placa = window._satrackPlacaActiva;
//                 if (placa) {
//                     SatrackGPS.iniciar(placa, ocMap, vehiculoMarker, directionsRenderer, infoWin);
//                 }
//             }

//             // ── Listener offcanvas — UNA sola vez ───────────────
//             const offcanvasEl = document.getElementById('offcanvasPedido');
//             if (offcanvasEl) {
//                 /* ══════════════════════════════════════════════════════════════════════════════
//                 |  BLOQUE 3 — Agrega esto DENTRO del listener 'shown.bs.offcanvas'
//                 |  (línea ~1476) donde ya se llama a initOcMap.
//                 |  En el else if (ocMap) reemplaza el bloque por este:
//                 ══════════════════════════════════════════════════════════════════════════════*/

//                 offcanvasEl.addEventListener('shown.bs.offcanvas', () => {
//                     if (!mapLoaded) {
//                         mapLoaded = true;
//                         setTimeout(initOcMap, 100);
//                     } else if (ocMap) {
//                         setTimeout(async () => {
//                             google.maps.event.trigger(ocMap, 'resize');
//                             ocMap.setCenter(MAPA_CONFIG.vehiculo);
//                             await cargarGeocercasPedido(window._tlSolicitudId);

//                             // Reiniciar rastreo con la nueva placa
//                             const placa = window._satrackPlacaActiva;
//                             if (placa) {
//                                 SatrackGPS.detener(); // Para el anterior
//                                 SatrackGPS.iniciar(placa, ocMap, vehiculoMarker, directionsRenderer);
//                             }
//                         }, 100);
//                     }
//                 });
//             }

//         });
//         // ── cierre document.addEventListener('click')

//         // ══════════════════════════════════════════════════════
//         // VARIABLES DEL MAPA — scope de initScript (fuera del click)
//         // ══════════════════════════════════════════════════════
//         let ocMap = null;
//         let vehiculoMarker = null;
//         let directionsRenderer = null;
//         let mapLoaded = false;
//         let MAPA_CONFIG = {};

//         // ── Timestamp live — una sola vez ───────────────────
//         const ocMapTs = document.getElementById('ocMapTs');
//         function ocTick() {
//             if (ocMapTs) ocMapTs.textContent = new Date()
//                 .toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
//         }
//         ocTick();
//         setInterval(ocTick, 1000);

//         // ════════════════════════════════════════════════════════
//         // KPI CARDS — clic para filtrar la tabla por estado
//         // ════════════════════════════════════════════════════════
//         document.querySelectorAll('.kpi-resumen').forEach(function (card) {
//             card.addEventListener('click', function () {
//                 document.querySelectorAll('.kpi-resumen').forEach(function (c) { c.classList.remove('active'); });
//                 this.classList.add('active');
//                 const filtro = this.dataset.filtro;
//                 const fi = document.getElementById('fecha_inicial') ? document.getElementById('fecha_inicial').value : '';
//                 const ff = document.getElementById('fecha_final') ? document.getElementById('fecha_final').value : '';
//                 if (filtro === 'todos') {
//                     listar_pedidos_administrador(fi, ff, '', '', '', '');
//                 } else {
//                     listar_pedidos_administrador(fi, ff, filtro, '', '', 'estado_publicacion');
//                 }
//             });
//         });

//         // ── Botón Consultar (nuevo, desde filtros) ──
//         const btnConsultar = document.getElementById('buscar');
//         if (btnConsultar) {
//             // Remover listeners previos clonando
//             const newBtn = btnConsultar.cloneNode(true);
//             btnConsultar.parentNode.replaceChild(newBtn, btnConsultar);
//             newBtn.addEventListener('click', function () {
//                 const fi = document.getElementById('fecha_inicial') ? document.getElementById('fecha_inicial').value : '';
//                 const ff = document.getElementById('fecha_final') ? document.getElementById('fecha_final').value : '';
//                 const modalidad = document.getElementById('f-modalidad') ? document.getElementById('f-modalidad').value : '';
//                 const estPub = document.getElementById('f-estado-pub') ? document.getElementById('f-estado-pub').value : '';
//                 const estTraz = document.getElementById('f-estado-traz') ? document.getElementById('f-estado-traz').value : '';
//                 document.querySelectorAll('.kpi-resumen').forEach(function (c) { c.classList.remove('active'); });

//                 // Prioridad: estado trazabilidad > estado publicación > modalidad > solo fechas
//                 if (estTraz) {
//                     listar_pedidos_administrador(fi, ff, estTraz, '', '', 'trazabilidad');
//                 } else if (estPub) {
//                     listar_pedidos_administrador(fi, ff, estPub, '', '', 'estado_publicacion');
//                 } else if (modalidad) {
//                     listar_pedidos_administrador(fi, ff, '', modalidad, '', 'mod');
//                 } else {
//                     listar_pedidos_administrador(fi, ff, '', '', '', '');
//                 }
//             });
//         }

//         // ── Botón Limpiar filtros ──
//         const btnLimpiar = document.getElementById('btn-limpiar');
//         if (btnLimpiar) {
//             btnLimpiar.addEventListener('click', function () {
//                 const ids = ['f-modalidad', 'f-estado-pub', 'f-estado-traz'];
//                 ids.forEach(function (id) { const el = document.getElementById(id); if (el) el.value = ''; });
//                 const fi = document.getElementById('fecha_inicial');
//                 const ff = document.getElementById('fecha_final');
//                 if (fi) fi.value = '';
//                 if (ff) ff.value = '';
//                 document.querySelectorAll('.kpi-resumen').forEach(function (c) { c.classList.remove('active'); });
//                 const tbody = document.getElementById('tbl_administrar_pedidos');
//                 if (tbody) tbody.innerHTML = `
//                 <tr><td colspan="25" class="text-center" style="padding:50px;color:var(--slate-400);">
//                     <i class="bi bi-inbox" style="font-size:2rem;display:block;margin-bottom:8px;"></i>
//                     Filtros limpiados — realice una nueva consulta
//                 </td></tr>`;
//                 const badge = document.getElementById('badge-total-tabla');
//                 if (badge) badge.textContent = '0 registros';
//                 const pagBar = document.getElementById('pagination-bar');
//                 if (pagBar) pagBar.style.display = 'none';
//                 sessionStorage.removeItem('carrito');
//                 actualizarContadorCarrito();
//                 // Resetear KPIs a 0
//                 ['kpi-total', 'kpi-pendiente', 'kpi-publicado', 'kpi-asignado', 'kpi-cancelado'].forEach(function (id) {
//                     const el = document.getElementById(id); if (el) el.textContent = '0';
//                 });
//             });
//         }

//         // Evento para seleccionar/deseleccionar todos los checkboxes
//         $('#selectAll').on('change', function () {
//             let isChecked = $(this).prop('checked');
//             $('.pedido-checkbox').prop('checked', isChecked);
//             let carrito = isChecked ? obtenerTodosLosPedidos() : [];
//             sessionStorage.setItem('carrito', JSON.stringify(carrito));
//             actualizarContadorCarrito();
//         });

//         $(document).on('change', '.pedido-checkbox', function () {
//             let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

//             // Modalidad del pedido actual que se intenta seleccionar
//             let modalidadActual = $(this).data('id15');

//             // Verificar si ya hay elementos seleccionados con modalidad diferente
//             let modalidadesEnCarrito = carrito.map((item) => item.dataId15);
//             let modalidadesUnicas = [...new Set(modalidadesEnCarrito)];

//             // Si ya hay modalidad en el carrito y es distinta, no permitir la selección
//             if ($(this).prop('checked') && modalidadesUnicas.length > 0 && !modalidadesUnicas.includes(modalidadActual)) {
//                 Swal.fire({
//                     icon: 'warning',
//                     title: 'Modalidades diferentes',
//                     text: 'No puedes seleccionar pedidos con diferentes modalidades.',
//                 });

//                 $(this).prop('checked', false); // Desmarcar
//                 return; // Salir de la función
//             }

//             let pedido = {
//                 id: $(this).val(),
//                 dataId: $(this).data('id'),
//                 dataId2: $(this).data('id2'),
//                 dataId3: $(this).data('id3'),
//                 dataId4: $(this).data('id4'),
//                 dataId5: $(this).data('id5'),
//                 dataId6: $(this).data('id6'),
//                 dataId7: $(this).data('id7'),
//                 dataId8: $(this).data('id8'),
//                 dataId9: $(this).data('id9'),
//                 dataId10: $(this).data('id10'),
//                 dataId11: $(this).data('id11'),
//                 dataId12: $(this).data('id12'),
//                 dataId13: $(this).data('id13'),
//                 dataId14: $(this).data('id14'),
//                 dataId15: modalidadActual,
//             };

//             if ($(this).prop('checked')) {
//                 if (!carrito.some((item) => item.id === pedido.id)) {
//                     carrito.push(pedido);
//                 }
//             } else {
//                 carrito = carrito.filter((item) => item.id !== pedido.id);
//             }

//             // ✅ RESALTAR FILA AL SELECCIONAR
//             let rowId = $(this).data('row');
//             let row = document.getElementById(rowId);
//             if (row) {
//                 row.style.backgroundColor = $(this).is(':checked') ? '#d8ddf9' : '';
//             }

//             $('#selectAll').prop('checked', $('.pedido-checkbox:checked').length === $('.pedido-checkbox').length);
//             sessionStorage.setItem('carrito', JSON.stringify(carrito));

//             let btnCarrito = document.getElementById('btn-carrito-pedidos');
//             if (btnCarrito) {
//                 btnCarrito.style.display = carrito.length > 0 ? '' : 'none';
//                 // btnCarrito.style.display = carrito.length > 0 ? 'block' : 'none';
//                 btnCarrito.setAttribute('data-idPedido', pedido.id);
//                 btnCarrito.setAttribute('data-idCliente', pedido.dataId14);
//             }
//             actualizarContadorCarrito();
//         });

//         document.addEventListener('input', async (e) => {
//             if (e.target.matches(`#campo-${window.VENTANA}-filtro`) || e.target.matches(`#campo-${window.VENTANA}-filtro *`)) {
//                 let filtro = document.getElementById(`campo-${window.VENTANA}-filtro`).value.trim();
//                 let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
//                 let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
//                 listar_pedidos_administrador(fecha_inicial, fecha_final, filtro, '', '', '');
//             }
//         });

//         //boton de excel
//         document.getElementById('exportar_excel').addEventListener('click', function () {
//             var table = document.getElementById('table1');
//             var wb = XLSX.utils.table_to_book(table);
//             // Crear contenido de archivo con fecha
//             // var fecha = new Date();
//             Array.from(table.getElementsByTagName('td')).forEach(function (td) {
//                 const text = td.innerText.trim();

//                 // Detectar valores con $ o formatos de fecha ISO
//                 const esFecha = /^\d{4}-\d{2}-\d{2}$/.test(text); // Formato YYYY-MM-DD

//                 if (esFecha) {
//                     td.setAttribute('data-t', 's'); // Marcar como texto para Excel
//                 }
//             });
//             const fechaActual = new Date().toISOString().slice(0, 10);
//             const nombreArchivo = `Informe de Pedidos ${fechaActual}.xlsx`; //'Informe Remesas_${fecha.toISOString()}.xlsx '
//             XLSX.writeFile(wb, nombreArchivo);
//         });
//     };

//     /* ─────────────────────────────────────────────────────────────────
//        ocToggle  — abre/cierra paneles del offcanvas de orden de carga
//        Uso en el HTML:
//          onclick="ocToggle('ocPanelOrigen','ocBtnOrigen','CARGUE')"
//        El panel debe tener el data-pedido-id con el ID del pedido:
//          <div class="oc-sec-panel" id="ocPanelOrigen" data-pedido-id="123">
//     ───────────────────────────────────────────────────────────────── */
//     function ocToggle(panelId, btnId, operacion) {
//         const panel = document.getElementById(panelId);
//         const btn = document.getElementById(btnId);
//         const isOpen = panel.classList.contains('open');

//         // Cierra todos los paneles
//         document.querySelectorAll('.oc-sec-panel').forEach(p => p.classList.remove('open'));
//         document.querySelectorAll('.oc-tl-expand-btn').forEach(b =>
//             b.innerHTML = '<i class="bi bi-chevron-down me-1"></i>Detalle'
//         );

//         if (!isOpen) {
//             panel.classList.add('open');
//             btn.innerHTML = '<i class="bi bi-chevron-up me-1"></i>Ocultar';

//             // Lee el ID del pedido desde el atributo data del panel
//             const pedidoId = panel.dataset.pedidoId;
//             if (pedidoId) {
//                 cargarTareasOC(pedidoId, operacion, panelId);
//             } else {
//                 console.warn('⚠️ ocToggle: el panel no tiene data-pedido-id');
//             }

//             setTimeout(() => {
//                 panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//             }, 60);
//         }
//     }

//     /* ─────────────────────────────────────────────────────────────────
//        cargarTareasOC  — GET vía FormData al endpoint existente
//        Endpoint esperado:  torrecontrol/Listar_tareas_oc
//        Parámetros POST:    PedidoId, Operacion
//     ───────────────────────────────────────────────────────────────── */
//     async function cargarTareasOC(pedidoId, operacion, panelId) {
//         const panel = document.getElementById(panelId);
//         if (!panel) return;

//         // ── Spinner SOLO en col-lg-7, no tocar col-lg-5 ──
//         const subtlEl = panel.querySelector('.col-lg-7 .oc-sub-tl');
//         const microEl = panel.querySelector('.oc-micro');
//         const contenedorTabla = document.getElementById(`tabla-tiempos-${operacion}`);

//         if (subtlEl) subtlEl.innerHTML = `
//         <div class="text-center py-3" style="color:#94a3b8;font-size:12px">
//             <i class="bi bi-arrow-repeat me-1"></i>Cargando tareas…
//         </div>`;

//         try {
//             const baseUrl = document.getElementById('base_url_api').value;
//             const formData = new FormData();
//             formData.append('PedidoId', pedidoId);
//             formData.append('Operacion', operacion);

//             const response = await fetch(baseUrl + 'Listar_tareas_oc', {
//                 method: 'POST',
//                 headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
//                 body: formData,
//             });

//             if (!response.ok) throw new Error(`HTTP ${response.status}`);

//             const json = await response.json();

//             if (json.numero !== 200) {
//                 if (subtlEl) subtlEl.innerHTML = `
//                 <div class="text-center py-3" style="color:#94a3b8;font-size:12px">
//                     ${json.mensaje}
//                 </div>`;
//                 return;
//             }

//             const tareas = json.data;

//             if (Array.isArray(tareas) && tareas.length > 0) {

//                 // Calcular tiempos
//                 const tareasConTiempos = calcularTiempos(tareas, window._tlFechaCargue);

//                 // Renderizar izquierda (micro + sub-tl) sin tocar col-lg-5
//                 renderTareasOC(panel, tareasConTiempos, pedidoId, operacion);

//                 // Renderizar tabla derecha
//                 const tituloMapa = {
//                     'CARGUE': 'Planta Origen',
//                     'DESCARGUE': 'Planta Destino',
//                     'TRANSITO': 'Tránsito',
//                 };
//                 renderTablaResumen(
//                     contenedorTabla,
//                     tareasConTiempos,
//                     tituloMapa[operacion] ?? operacion
//                 );

//             } else {
//                 if (subtlEl) subtlEl.innerHTML = `
//                 <div class="text-center py-3" style="color:#94a3b8;font-size:12px">
//                     <i class="bi bi-inbox me-1"></i>Sin tareas registradas para esta operación.
//                 </div>`;
//                 if (contenedorTabla) contenedorTabla.innerHTML = `
//                 <div class="text-center py-3" style="color:#94a3b8;font-size:12px">
//                     Sin datos disponibles
//                 </div>`;
//             }

//         } catch (error) {
//             console.error('❌ cargarTareasOC:', error);
//             if (subtlEl) subtlEl.innerHTML = `
//             <div style="padding:.8rem;color:#ef4444;font-size:12px">
//                 <i class="bi bi-exclamation-triangle me-1"></i>
//                 Error al cargar tareas: ${error.message}
//             </div>`;
//         }
//     }

//     /* ─────────────────────────────────────────────────────────────────
//         renderTareasOC  — construye el HTML del panel con los datos
//     ───────────────────────────────────────────────────────────────── */

//     function renderTareasOC(panel, tareas, pedidoId, operacion) {
//         const micropasos = tareas.map(t => `
//             <div class="oc-micro-step ${t.estado === 'COMPLETADO' ? 'oc-ms-done' :
//                 t.estado === 'EN GESTION' ? 'oc-ms-active' : ''
//             }">${t.nombre.split(' ')[0]}  </div>
//         `).join('');

//         const subItems = tareas.map(t => _buildSubItem(t, pedidoId, operacion)).join('');

//         // ✅ Actualiza solo micro y sub-tl — NO toca col-lg-5
//         const microEl = panel.querySelector('.oc-micro');
//         const subtlEl = panel.querySelector('.col-lg-7 .oc-sub-tl');

//         if (microEl) microEl.innerHTML = micropasos;
//         if (subtlEl) subtlEl.innerHTML = subItems;
//     }

//     /* ─────────────────────────────────────────────────────────────────
//        completarTareaOC  — POST para marcar una tarea como completada
//        Endpoint esperado:  torrecontrol/Completar_tarea_oc
//        Parámetros POST:    TareaId, PedidoId, Estado
//     ───────────────────────────────────────────────────────────────── */
//     async function completarTareaOC(tareaId, pedidoId, nuevoEstado, operacion, panelId) {
//         try {
//             const baseUrl = document.getElementById('base_url_api').value;

//             const formData = new FormData();
//             formData.append('TareaId', tareaId);
//             formData.append('PedidoId', pedidoId);
//             formData.append('Estado', nuevoEstado);
//             formData.append('Operacion', operacion);

//             const response = await fetch(baseUrl + 'torrecontrol/Completar_tarea_oc', {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (!response.ok) throw new Error(`HTTP ${response.status}`);

//             const data = await response.json();

//             if (data.success) {
//                 // Recarga el panel para reflejar el nuevo estado
//                 await cargarTareasOC(pedidoId, operacion, panelId);
//             } else {
//                 alert('No se pudo actualizar la tarea: ' + (data.message || 'Error desconocido'));
//             }

//         } catch (error) {
//             console.error('❌ completarTareaOC:', error);
//             alert('Error al completar tarea: ' + error.message);
//         }
//     }

//     /* ─────────────────────────────────────────────────────────────────
//        _buildSubItem  — HTML de un ítem de la línea de tiempo
//     ───────────────────────────────────────────────────────────────── */
//     function _buildSubItem(t, pedidoId, operacion) {

//         // ── Mapas por estado real de la actividad ──────────────
//         const iconMap = {
//             'EN GESTION': 'bi-arrow-repeat',
//             'SIN INICIAR': 'bi-clock',
//             'COMPLETADO': 'bi-check-lg',
//             'CANCELADO': 'bi-x-lg',
//             'PAUSADO': 'bi-pause-circle',
//         };

//         const badgeMap = {
//             'EN GESTION': 'oc-sub-badge-active',
//             'SIN INICIAR': 'oc-sub-badge-pending',
//             'COMPLETADO': 'oc-sub-badge-done',
//             'CANCELADO': 'oc-sub-badge-pending',
//             'PAUSADO': 'oc-sub-badge-pending',
//         };

//         const badgeLabel = {
//             'EN GESTION': 'EN GESTIÓN',
//             'SIN INICIAR': 'SIN INICIAR',
//             'COMPLETADO': 'COMPLETADO',
//             'CANCELADO': 'CANCELADO',
//             'PAUSADO': 'PAUSADO',
//         };

//         // Clase CSS del nodo visual (usa las clases existentes del offcanvas)
//         const nodoClase = {
//             'EN GESTION': 'active',
//             'SIN INICIAR': 'pending',
//             'COMPLETADO': 'done',
//             'CANCELADO': 'risk',
//             'PAUSADO': 'pending',
//         }[t.estado] ?? 'pending';

//         // ── Tiempos ────────────────────────────────────────────
//         let tiempos = '';
//         if (t._tiempos) {
//             const { fechaInicioCalc, fechaReal, textoAsignado, textoTranscurrido, alDia, pct } = t._tiempos;

//             // Badge de tiempo: color según estado y avance
//             let badgeColor, badgeText;
//             if (t.estado === 'COMPLETADO') {
//                 badgeColor = '#16a34a'; badgeText = textoAsignado;
//             } else if (!alDia) {
//                 badgeColor = '#dc2626'; badgeText = textoTranscurrido;
//             } else if (pct >= 80) {
//                 badgeColor = '#f59e0b'; badgeText = textoTranscurrido;
//             } else {
//                 badgeColor = '#0369a1'; badgeText = textoAsignado;
//             }

//             const badgeHtml = `<span style="
//                 font-size:8px;font-weight:700;letter-spacing:.5px;font-family:'JetBrains Mono',monospace;
//                 padding:1px 6px;border-radius:8px;
//                 background:${badgeColor}18;color:${badgeColor};border:1px solid ${badgeColor}40;
//                 white-space:nowrap">⏱ ${badgeText}</span>`;

//             const progHtml = fechaInicioCalc
//                 ? `<span class="oc-sub-time">Prog: ${fechaInicioCalc}</span>`
//                 : '';
//             // Real: fecha real de inicio del servidor
//             const realHtml = fechaReal
//                 ? `<span class="oc-sub-time">Real: ${fechaReal}</span>`
//                 : '';

//             tiempos = [progHtml, realHtml, badgeHtml].filter(Boolean).join('');
//         } else {
//             // Fallback: usar tiempos del servidor si no hay _tiempos calculados
//             const parts = [
//                 t.tiempo_programado ? `<span class="oc-sub-time">Prog: ${t.tiempo_programado}</span>` : '',
//                 t.tiempo_real ? `<span class="oc-sub-time">Real: ${t.tiempo_real}</span>` : '',
//                 t.delta ? `<span class="d ${t.delta_pos ? 'd-pos' : 'd-neg'}">${t.delta}</span>` : '',
//             ].filter(Boolean);
//             tiempos = parts.join('');
//         }

//         // ── Botón completar (solo EN GESTION) ─────────────────
//         const btnCompletar = t.estado === 'EN GESTION'
//             ? ``
//             //     ? `<button
//             //        class="btn btn-sm btn-outline-success ms-2"
//             //        style="font-size:10px;padding:2px 8px"
//             //        onclick="completarTareaOC(${t.id}, ${pedidoId}, 'done', '${operacion}', '${_panelIdDesdeOperacion(operacion)}')">
//             //        <i class="bi bi-check2 me-1"></i>Completar
//             //    </button>`
//             : '';

//         // ── Gestiones ──────────────────────────────────────────
//         let gestionesHtml = '';

//         if (Array.isArray(t.gestiones) && t.gestiones.length > 0) {

//             const dotColorMap = {
//                 'ACTIVO': '#0369a1',
//                 'EN GESTION': '#ea580c',
//                 'SIN INICIAR': '#94a3b8',
//                 'COMPLETADO': '#16a34a',
//                 'CANCELADO': '#dc2626',
//                 'PAUSADO': '#f59e0b',
//             };

//             const items = t.gestiones.map(g => {

//                 const dotColor = dotColorMap[g.estado] ?? '#94a3b8';

//                 const estadoBadge = `<span style="
//                 font-size:8px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;
//                 padding:1px 5px;border-radius:5px;margin-left:4px;
//                 background:${dotColor}18;color:${dotColor};border:1px solid ${dotColor}40
//             ">${g.estado ?? ''}</span>`;

//                 // Enlace solo si tiene documento Y nombre_archivo real
//                 const docHtml = (g.documento && g.nombre_archivo && g.nombre_archivo !== 'Sin_evidencia')
//                     ? `<a href="${$("#base_url").val()}${g.documento}${g.nombre_archivo}" target="_blank" class="oc-gestion-doc">
//                        <i class="bi bi-file-earmark-arrow-down"></i>${g.nombre_archivo}
//                    </a>`
//                     : '';

//                 return `
//             <div class="oc-ev">
//                 <div class="oc-ev-dot" style="background:${dotColor}"></div>
//                 <div style="min-width:0">
//                     <div class="oc-ev-time">
//                         ${g.fecha ?? '—'} · ${g.usuario ?? '—'}${estadoBadge}
//                     </div>
//                     <div class="oc-ev-label">${g.observacion ?? '—'}</div>
//                     ${docHtml}
//                 </div>
//             </div>`;
//             }).join('');

//             gestionesHtml = `
//         <div class="oc-gestion-wrap">
//             <div class="oc-gestion-header">
//                 <i class="bi bi-journal-text me-1"></i>Gestiones (${t.gestiones.length})
//             </div>
//             ${items}
//         </div>`;
//         }

//         return `
//             <div class="oc-sub-item">
//                 <div class="oc-sub-node ${nodoClase}">
//                     <i class="bi ${iconMap[t.estado] || 'bi-clock'}"></i>
//                 </div>
//                 <div class="flex-grow-1">
//                     <div class="d-flex justify-content-between align-items-start gap-1 flex-wrap">
//                         <span class="oc-sub-label">${t.nombre}</span>
//                         <div class="d-flex align-items-center flex-wrap gap-1">
//                             <span class="oc-sub-badge ${badgeMap[t.estado] ?? 'oc-sub-badge-pending'}">
//                                 ${badgeLabel[t.estado] ?? t.estado}
//                             </span>
//                             ${btnCompletar}
//                         </div>
//                     </div>
//                     ${t.meta ? `<div class="oc-sub-meta">${t.meta}</div>` : ''}
//                     ${tiempos ? `<div class="d-flex gap-2 mt-1 flex-wrap">${tiempos}</div>` : ''}
//                     ${gestionesHtml}
//                 </div>
//             </div>`;
//     }

//     /* ─────────────────────────────────────────────────────────────────
//        _panelIdDesdeOperacion  — mapea operacion → ID del panel
//        Ajusta según los IDs reales de tus paneles en el .phtml
//     ───────────────────────────────────────────────────────────────── */
//     function _panelIdDesdeOperacion(operacion) {
//         const mapa = {
//             'CARGUE': 'ocPanelOrigen',
//             'TRANSITO': 'ocPanelTransito',
//             'DESCARGUE': 'ocPanelDestino',
//         };
//         return mapa[operacion] || 'ocPanelOrigen';
//     }

//     /* ── Map buttons ── */
//     function ocMapMode(mode, el) {
//         document.querySelectorAll('.oc-map-btn').forEach(b => b.classList.remove('active'));
//         el.classList.add('active');
//         // Cuando integres Maps JS API: map.setMapTypeId(mode);
//     }

//     function ocCenter() {
//         const btn = document.getElementById('ocBtnCenter');
//         btn.innerHTML = '<i class="bi bi-check-lg"></i> Centrado';
//         setTimeout(() => { btn.innerHTML = '<i class="bi bi-crosshair"></i> Centrar'; }, 1500);
//         // Cuando integres Maps JS API: map.panTo(vehicleMarker.getPosition());
//     }

//     async function listar_pedidos_administrador(fecha_inicial, fecha_final, filtro, valor, trazabilidad, identificador) {
//         /* Funcion para enviar los datos */
//         let dato = new FormData();
//         dato.append('fecha_inicial', fecha_inicial);
//         dato.append('fecha_final', fecha_final);
//         // dato.append('filtro', filtro ? filtro : document.getElementById(`campo-${window.VENTANA}-filtros`).value.trim());
//         dato.append('filtro', filtro);
//         dato.append('valor', valor);
//         dato.append('trazabilidad', trazabilidad);
//         dato.append('identificador', identificador);
//         // dato.append('proceso_filtro', proceso_filtro);
//         // dato.append('filtros', document.getElementById(`campo-${window.VENTANA}-filtros`).value);
//         dato.append('filtros', '');
//         try {
//             const response = await fetch($('#base_url').val() + 'torrecontrol/listar_administracion_pedidos', {
//                 method: 'POST',
//                 body: dato,
//                 cache: 'no-cache',
//             });
//             const data = await response.json();
//             if (data) {
//                 let tbody = document.getElementById('tbl_administrar_pedidos');
//                 tbody.innerHTML = '';
//                 let col_estatus_publicacion = '';
//                 let col_estatus_asignacion = '';
//                 let btn_publicacion = '';
//                 let btn_cancelacion = '';
//                 let col_prioridad = '';
//                 let btn_removeAsignacion = '';
//                 let checkbox_carrito = '';
//                 let col_estatus_proceso = '';
//                 let col_estatus_trazabilidad = '';
//                 let btn_detalle_proceso = '';
//                 let btn_detalle_trazabilidad = '';
//                 let btn_trazabilidad_pedido = '';
//                 let btn_prioridad = '';

//                 data.forEach((element) => {
//                     const fila = document.createElement('tr');
//                     fila.id = `fila_${element.numdoc_solicitud}`;
//                     // Publicación
//                     if (estadosPublicacion[element.estado_publicaion]) {
//                         col_estatus_publicacion = createBadge(element.estado_publicaion, estadosPublicacion[element.estado_publicaion]);
//                     }

//                     // Asignación
//                     if (estadosAsignacion[element.estado_asignacion]) {
//                         col_estatus_asignacion = createBadge(element.estado_asignacion, estadosAsignacion[element.estado_asignacion]);
//                     }

//                     // Prioridad
//                     if (estadosPrioridad[element.estado_prioridad]) {
//                         col_prioridad = createBadge(element.estado_prioridad, estadosPrioridad[element.estado_prioridad]);
//                     }

//                     // Botones y checkbox según combinación de estado
//                     const estadoPublicacion = element.estado_publicaion;
//                     const estadoAsignacion = element.estado_asignacion;

//                     if (estadoPublicacion === 'Publicado' && estadoAsignacion === 'Asignado') {
//                         checkbox_carrito = ``;
//                         btn_removeAsignacion = ``;
//                         btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
//                         btn_prioridad = `<a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"> <span class="uil uil-bell"></span> Marcar como Prioridad</a>`;
//                     } else if (estadoPublicacion === 'Publicado' && estadoAsignacion === 'Pendiente') {
//                         checkbox_carrito = ``;
//                         btn_removeAsignacion = ``;
//                         btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
//                         btn_prioridad = `<a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"> <span class="uil uil-bell"></span> Marcar como Prioridad</a>`;
//                     } else if (
//                         (estadoPublicacion === 'Pendiente Respuesta' && estadoAsignacion === 'Pendiente') ||
//                         (estadoPublicacion === 'Aceptado' && estadoAsignacion === 'Ganador') ||
//                         (estadoPublicacion === 'Completado' && estadoAsignacion === 'Completado')
//                     ) {
//                         // No mostrar botones ni checkbox
//                         checkbox_carrito = ``;
//                         btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
//                     } else {
//                         btn_detalle_proceso = ``;
//                         // btn_detalle_trazabilidad = ``;
//                         btn_removeAsignacion = ``;
//                         // btn_trazabilidad_pedido = ``;
//                         btn_prioridad = `<a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"> <span class="uil uil-bell"></span> Marcar como Prioridad</a>`;
//                         // Mostrar botones de cancelación y checkbox
//                         if (element.estado_publicaion === 'Cancelado' && element.estado_asignacion === 'Cancelado') {
//                             btn_cancelacion = ``;
//                         } else {
//                             btn_cancelacion = `
//                         <a class="dropdown-item fw-bold" href="#" id="btn_cancelar_pedido"
//                           data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}">
//                           <span class="uil uil-x"></span> Cancelar Pedido
//                         </a>`;
//                         }

//                         checkbox_carrito = `
//                         <input class="form-check-input pedido-checkbox" id="check_pedido_${element.numdoc_solicitud}"
//                             type="checkbox" value="${element.numdoc_solicitud}"
//                             data-id="${element.nombre_cliente}" data-id2="${element.ciudad_origen}" data-id3="${element.ciudad_destino}"
//                             data-id4="${element.referencia_pedido}" data-id5="${element.fecha_cargue}" data-id6="${element.fecha_entrega}"
//                             data-id7="${element.unidades}" data-id8="${element.lote}" data-id9="${element.num_estibas}"
//                             data-id10="${element.peso_neto_kg}" data-id11="${element.peso_bruto_kg}"
//                             data-id12="${element.producto}" data-id13="${element.presentacion}" data-id14="${element.cliente}" data-id15="${element.modalidad}"
//                             style="scale: 1.2;" data-row="fila_${element.numdoc_solicitud}">
//                         `;
//                     }

//                     //Estado proceso
//                     if (estadosProceso[element.estado_proceso]) {
//                         if (element.estado_publicaion === 'Cancelado' && element.estado_asignacion === 'Cancelado') {
//                             col_estatus_proceso = createBadge('Cancelado', 'danger');
//                             checkbox_carrito = ``;
//                             btn_prioridad = ``;
//                             btn_detalle_proceso = ``;
//                             // btn_detalle_trazabilidad = ``;
//                             btn_removeAsignacion = ``;
//                             // btn_trazabilidad_pedido = ``;
//                             btn_publicacion = ``;
//                         } else {
//                             col_estatus_proceso = createBadge(element.estado_proceso, estadosProceso[element.estado_proceso]);
//                         }
//                     }

//                     //Estado de la trazabiliidad
//                     if (element.tipo_trazabilidad === 'Completado' || (element.tipo_trazabilidad === 'Iniciado' && element.estado_proceso_pedido === 'Completado')) {
//                         btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
//                     } else if (element.tipo_trazabilidad === 'Pendiente Iniciar' || element.tipo_trazabilidad === 'Sin Asignar') {
//                         btn_detalle_trazabilidad = ``;
//                     } else {
//                         // btn_detalle_trazabilidad = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}"><span class="uil uil-transaction"></span> Detalle trazabilidad</a>`;
//                         // btn_trazabilidad_pedido = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad_pedido" data-id="${element.numdoc_solicitud}"><span class="uil-wrap-text"></span> Trazabilidad pedido</a>`;
//                     }

//                     /* Validar si el pedido ya tuvo una postulacion */
//                     if (element.tipo_trazabilidad === 'Iniciado' && element.estado_proceso_pedido === 'Postulado') {
//                         // Estado de la trazabilidad
//                         const estado = obtenerEstadoTrazabilidad(element.estado_proceso_pedido);
//                         col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
//                     } else {
//                         // Estado de la trazabilidad
//                         const estado = obtenerEstadoTrazabilidad(element.tipo_trazabilidad);
//                         col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
//                     }

//                     const columnaNundocSolicitud = document.createElement('td');
//                     columnaNundocSolicitud.innerHTML = `
//                         <div class="dropdown">
//                             <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none menu_tabla" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-row-id="${fila.id}"> N°${element.referencia_pedido}</a>
//                             <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
//                             ${btn_detalle_proceso}
//                             ${btn_removeAsignacion}
//                             <div class="dropdown-divider"></div>
//                             <a class="dropdown-item fw-bold" href="#" id="btn_detalle" data-SolicitudId="${element.numdoc_solicitud}" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}"><span class="uil uil-transaction"></span> Trazabilidad</a>
//                             <a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad_pedidos" data-bs-toggle="offcanvas"
//                                 data-bs-target="#offcanvasPedido" style="font-family:'Space Grotesk',sans-serif;font-weight:600" data-SolicitudId="${element.numdoc_solicitud}" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}" data-latitud_origen="${element.latitud_origen}"
//                                 data-longitud_origen="${element.longitud_origen}" data-latitud_destino="${element.latitud_destino}" data-longitud_destino="${element.longitud_destino}" data-ciudad_origen="${element.ciudad_origen}" data-ciudad_destino="${element.ciudad_destino}" 
//                                 data-refPedido="${element.referencia_pedido}" data-fecha_creacion="${element.fecha} ${element.hora}" data-fecha_cargue="${element.fecha_cargue}" data-fecha_entrega="${element.fecha_entrega}" data-placa="${element.referencia}" data-tipo_trazabilidad="${element.tipo_trazabilidad}">
//                                 <span class="uil uil-transaction"></span> Trazabilidad Pedidos
//                             </a>
//                             ${btn_cancelacion}
//                             ${btn_prioridad}
//                             </div>
//                         </div>
//                     `;

//                     const columnaCheckPedido = document.createElement('td');
//                     columnaCheckPedido.innerHTML = checkbox_carrito;
//                     columnaCheckPedido.style.width = 'auto';
//                     columnaCheckPedido.style.whiteSpace = 'nowrap';
//                     columnaCheckPedido.style.textAlign = 'center';

//                     const columnaModalidadPedido = document.createElement('td');
//                     columnaModalidadPedido.innerHTML = element.modalidad;
//                     columnaModalidadPedido.style.width = 'auto';
//                     columnaModalidadPedido.style.whiteSpace = 'nowrap';
//                     columnaModalidadPedido.style.textAlign = 'center';

//                     const columnaCiudadOrigen = document.createElement('td');
//                     columnaCiudadOrigen.innerHTML = element.ciudad_origen;
//                     columnaCiudadOrigen.style.width = 'auto';
//                     columnaCiudadOrigen.style.whiteSpace = 'nowrap';

//                     const columnaRemitente = document.createElement('td');
//                     columnaRemitente.innerHTML = element.remitente;
//                     columnaRemitente.style.width = 'auto';
//                     columnaRemitente.style.whiteSpace = 'nowrap';
//                     const columnaCiudadDestino = document.createElement('td');
//                     columnaCiudadDestino.innerHTML = element.ciudad_destino;
//                     columnaCiudadDestino.style.width = 'auto';
//                     columnaCiudadDestino.style.whiteSpace = 'nowrap';
//                     const columnaSitioDescargue = document.createElement('td');

//                     columnaSitioDescargue.innerHTML = element.destinatario;
//                     const columnaCodigoProducto = document.createElement('td');
//                     columnaCodigoProducto.innerHTML = element.cod_producto;
//                     columnaSitioDescargue.style.width = 'auto';
//                     columnaSitioDescargue.style.whiteSpace = 'nowrap';

//                     const columnaProducto = document.createElement('td');
//                     columnaProducto.innerHTML = element.producto;
//                     columnaProducto.style.width = 'auto';
//                     columnaProducto.style.whiteSpace = 'nowrap';

//                     const columnaPesoNeto = document.createElement('td');
//                     columnaPesoNeto.innerHTML = element.peso_neto_kg + ' KG';
//                     columnaPesoNeto.style.width = 'auto';
//                     columnaPesoNeto.style.whiteSpace = 'nowrap';
//                     const columnaPesoBruto = document.createElement('td');
//                     columnaPesoBruto.innerHTML = element.peso_bruto_kg + ' KG';
//                     columnaPesoBruto.style.width = 'auto';
//                     columnaPesoBruto.style.whiteSpace = 'nowrap';

//                     const columnaPresentacion = document.createElement('td');
//                     columnaPresentacion.innerHTML = element.presentacion;
//                     columnaPresentacion.style.width = 'auto';
//                     columnaPresentacion.style.whiteSpace = 'nowrap';

//                     const columnaUnidades = document.createElement('td');
//                     columnaUnidades.innerHTML = element.unidades;
//                     columnaUnidades.style.width = 'auto';
//                     columnaUnidades.style.whiteSpace = 'nowrap';

//                     const columnaLote = document.createElement('td');
//                     columnaLote.innerHTML = element.lote;
//                     columnaLote.style.width = 'auto';
//                     columnaLote.style.whiteSpace = 'nowrap';

//                     const columnaEstibas = document.createElement('td');
//                     columnaEstibas.innerHTML = element.num_estibas;
//                     columnaEstibas.style.width = 'auto';
//                     columnaEstibas.style.whiteSpace = 'nowrap';

//                     const columnaFechaCargue = document.createElement('td');
//                     columnaFechaCargue.innerHTML = element.fecha_cargue;
//                     columnaFechaCargue.style.width = 'auto';
//                     columnaFechaCargue.style.whiteSpace = 'nowrap';

//                     const columnaFechaEntrega = document.createElement('td');
//                     columnaFechaEntrega.innerHTML = element.fecha_entrega;
//                     columnaFechaEntrega.style.width = 'auto';
//                     columnaFechaEntrega.style.whiteSpace = 'nowrap';

//                     const columnaEstadoPedido = document.createElement('td');
//                     columnaEstadoPedido.innerHTML = col_estatus_trazabilidad;
//                     columnaEstadoPedido.style.width = 'auto';
//                     columnaEstadoPedido.style.whiteSpace = 'nowrap';

//                     const columnaTipoVehiculo = document.createElement('td');
//                     columnaTipoVehiculo.innerHTML = element.tipo_vehiculo ? element.tipo_vehiculo : '-';
//                     columnaTipoVehiculo.style.width = 'auto';
//                     columnaTipoVehiculo.style.whiteSpace = 'nowrap';

//                     const columnaCosto = document.createElement('td');
//                     columnaCosto.innerHTML = element.costo ? element.costo : '-';
//                     columnaCosto.style.width = 'auto';
//                     columnaCosto.style.whiteSpace = 'nowrap';

//                     const columnaTarifa = document.createElement('td');
//                     columnaTarifa.innerHTML = element.tarifa ? element.tarifa : '-';
//                     columnaTarifa.style.width = 'auto';
//                     columnaTarifa.style.whiteSpace = 'nowrap';

//                     const columnaFechaRetiroContenedor = document.createElement('td');
//                     columnaFechaRetiroContenedor.innerHTML = element.fecha_retiro_contenedor ? element.fecha_retiro_contenedor : '-';
//                     columnaFechaRetiroContenedor.style.width = 'auto';
//                     columnaFechaRetiroContenedor.style.whiteSpace = 'nowrap';

//                     const columnaBooking = document.createElement('td');
//                     columnaBooking.innerHTML = element.booking ? element.booking : '-';
//                     columnaBooking.style.width = 'auto';
//                     columnaBooking.style.whiteSpace = 'nowrap';

//                     const columnaUnidadTransporte = document.createElement('td');
//                     columnaUnidadTransporte.innerHTML = element.unidad_transporte ? element.unidad_transporte : '-';
//                     columnaUnidadTransporte.style.width = 'auto';
//                     columnaUnidadTransporte.style.whiteSpace = 'nowrap';

//                     const columnaObservaciones = document.createElement('td');
//                     columnaObservaciones.innerHTML = element.observaciones ? element.observaciones : '-';
//                     columnaObservaciones.style.width = 'auto';
//                     columnaObservaciones.style.whiteSpace = 'nowrap';

//                     fila.appendChild(columnaCheckPedido);
//                     fila.appendChild(columnaModalidadPedido);
//                     fila.appendChild(columnaNundocSolicitud);
//                     fila.appendChild(columnaEstadoPedido);
//                     fila.appendChild(columnaCiudadOrigen);
//                     fila.appendChild(columnaRemitente);
//                     fila.appendChild(columnaCiudadDestino);
//                     fila.appendChild(columnaSitioDescargue);
//                     fila.appendChild(columnaCodigoProducto);
//                     fila.appendChild(columnaProducto);
//                     fila.appendChild(columnaPesoNeto);
//                     fila.appendChild(columnaPesoBruto);
//                     fila.appendChild(columnaPresentacion);
//                     fila.appendChild(columnaUnidades);
//                     fila.appendChild(columnaLote);
//                     fila.appendChild(columnaEstibas);
//                     fila.appendChild(columnaFechaCargue);
//                     fila.appendChild(columnaFechaEntrega);
//                     fila.appendChild(columnaTipoVehiculo);
//                     fila.appendChild(columnaCosto);
//                     fila.appendChild(columnaTarifa);
//                     fila.appendChild(columnaFechaRetiroContenedor);
//                     fila.appendChild(columnaBooking);
//                     fila.appendChild(columnaUnidadTransporte);
//                     fila.appendChild(columnaObservaciones);

//                     tbody.appendChild(fila);
//                 });

//                 // Agrega este código después de crear todas las filas (fuera del forEach pero dentro del if(data))
//                 document.querySelectorAll('.menu_tabla').forEach((toggle) => {
//                     toggle.addEventListener('click', function () {
//                         const rowId = this.getAttribute('data-row-id');
//                         const row = document.getElementById(rowId);
//                         document.querySelectorAll('tr').forEach((r) => r.classList.remove('selected-row'));
//                         if (row) row.classList.add('selected-row');
//                     });
//                 });

//                 // ── Actualizar KPI cards ──
//                 actualizarKpis(data);

//                 // ── Badge total tabla ──
//                 const badgeTabla = document.getElementById('badge-total-tabla');
//                 if (badgeTabla) badgeTabla.textContent = data.length + ' registros';

//                 // ── Paginación simple (informativa) ──
//                 const pagBar = document.getElementById('pagination-bar');
//                 if (pagBar) {
//                     pagBar.style.display = '';
//                     const setEl = (id, v) => { const n = document.getElementById(id); if (n) n.textContent = v; };
//                     setEl('pag-total', data.length);
//                     setEl('pag-desde', data.length > 0 ? 1 : 0);
//                     setEl('pag-hasta', data.length);
//                 }

//             } else {
//                 console.log('else');
//             }
//         } catch (error) {
//             console.error('Error en la primera solicitud:', error);
//             console.log('error no inserta');
//             throw error;
//         } finally {
//             // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
//         }
//     }

//     // Función para crear badge
//     function createBadge(text, type) {
//         return `
//         <span class="badge badge-phoenix fs-10 badge-phoenix-${type}">
//         <span class="badge-label">${text}</span>
//         <span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span>
//         </span>`;
//     }

//     // --- Estados de Publicación ---
//     window.estadosPublicacion = {
//         Pendiente: 'secondary',
//         Publicado: 'info',
//         Cancelado: 'secondary',
//         Aceptado: 'success',
//         'Pendiente Respuesta': 'warning',
//         Completado: 'success',
//     };

//     // --- Estados de Asignación ---
//     window.estadosAsignacion = {
//         Pendiente: 'secondary',
//         Asignado: 'info',
//         Cancelado: 'secondary',
//         Aceptado: 'success',
//         Ganador: 'success',
//         Completado: 'success',
//     };

//     // --- Estados de Prioridad ---
//     window.estadosPrioridad = {
//         Prioritaria: 'warning',
//         'No Marcada': 'info',
//     };

//     // --- Estados del Proceso ---
//     window.estadosProceso = {
//         Pendiente: 'secondary',
//         Asignación: 'warning',
//         Publicación: 'danger',
//         Completado: 'success',
//     };

//     function obtenerEstadoTrazabilidad(tipoTrazabilidad) {
//         let textoTrazabilidad = tipoTrazabilidad;

//         // Si viene "Completado", lo cambiamos a "Asignado"
//         if (tipoTrazabilidad === 'Completado') {
//             textoTrazabilidad = 'Asignado';
//         } else if (tipoTrazabilidad === 'Cancelado' || tipoTrazabilidad === 'Rechzado') {
//             textoTrazabilidad = 'Sin Asignar';
//         }

//         // Devolvemos el texto corregido y el color
//         return {
//             texto: textoTrazabilidad,
//             color: window.estadosTrazabilidad[textoTrazabilidad] || 'secondary',
//         };
//     }

//     window.estadosTrazabilidad = {
//         'Llegada Cargue': 'info',
//         Cargue: 'info',
//         'Salida Cargue': 'info',
//         'Inicio Ruta': 'primary',
//         Transito: 'primary',
//         'Llegada Descargue': 'info',
//         Descargue: 'info',
//         'Salida Descargue': 'info',
//         'Pendiente Iniciar': 'danger',
//         'Sin Asignar': 'secondary',
//         Iniciado: 'primary',
//         Asignado: 'success',
//         Postulado: 'warning',
//         Cancelado: 'danger',
//     };

//     // Agrega esto al final de tu archivo JavaScript o en tu CSS
//     window.style = document.createElement('style');
//     style.textContent = `
//     .selected-row {
//         background-color: #d8ddf9 !important;
//         /*box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);*/
//     }
//     `;
//     document.head.appendChild(style);

//     async function cargarLineaTiempo(PedidoId) {
//         try {
//             let formData = new FormData();
//             formData.append('PedidoId', PedidoId);

//             let response = await fetch($('#base_url').val() + 'torrecontrol/Linea_Tiempo_pedidos', {
//                 method: 'POST',
//                 body: formData,
//             });

//             let data = await response.json();

//             const etapasOrdenadas = ['Asignado', 'Llega vehículo', 'En cargue', 'En ruta', 'Entregado'];

//             const contenedor = document.getElementById('lineaTiempo');
//             contenedor.innerHTML = '';
//             contenedor.className = 'd-flex justify-content-between position-relative';

//             let ultimaIndex = -1;

//             //FechaEstimada
//             const etapas = data.etapas;

//             const etapaConFecha = Object.values(etapas).find((etapa) => etapa.fecha_entrega_estimada);

//             const fechaEstimada = etapaConFecha?.fecha_entrega_estimada || null;

//             // document.getElementById("FechaEstimada").textContent = fechaEstimada ? `Fecha estimada entrega: ${new Date(fechaEstimada).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}` : "Fecha estimada no disponible";
//             document.getElementById('FechaEstimada').textContent = `Fecha estimada entrega: ${fechaEstimada ? fechaEstimada : 'No disponible'}`;

//             etapasOrdenadas.forEach((etapa, index) => {
//                 const info = data.etapas[etapa];
//                 const step = document.createElement('div');
//                 step.className = 'step';
//                 step.dataset.etapa = etapa;

//                 const circle = document.createElement('div');
//                 circle.className = 'circle';

//                 if (info) {
//                     circle.classList.add('completed');
//                     ultimaIndex = index;
//                     circle.setAttribute('data-bs-toggle', 'tooltip');
//                     circle.setAttribute('data-bs-placement', 'bottom');
//                     circle.setAttribute('title', `📅 ${info.fecha_trazabilidad}\n📝 ${info.observacion}`);
//                 }

//                 step.appendChild(circle);

//                 const small = document.createElement('small');
//                 small.textContent = etapa;
//                 step.appendChild(small);

//                 if (info) {
//                     const fecha = document.createElement('div');
//                     fecha.className = 'info-extra';
//                     fecha.textContent = info.fecha_trazabilidad;
//                     step.appendChild(fecha);

//                     // const obs = document.createElement("div");
//                     // obs.className = "info-extra";
//                     // obs.textContent = info.observacion;
//                     // step.appendChild(obs);
//                 }

//                 contenedor.appendChild(step);
//             });

//             const steps = contenedor.querySelectorAll('.step');
//             if (steps.length && ultimaIndex >= 0) {
//                 const primer = steps[0].offsetLeft + steps[0].offsetWidth / 2;
//                 const ultimo = steps[ultimaIndex].offsetLeft + steps[ultimaIndex].offsetWidth / 2;

//                 // Línea verde (completado)
//                 const linea = document.createElement('div');
//                 linea.className = 'progreso-linea';
//                 linea.style.left = `${primer}px`;
//                 linea.style.width = `${ultimo - primer}px`;
//                 contenedor.appendChild(linea);

//                 // Línea amarilla (etapa actual)
//                 if (ultimaIndex + 1 < steps.length) {
//                     const siguiente = steps[ultimaIndex + 1].offsetLeft + steps[ultimaIndex + 1].offsetWidth / 2;
//                     const lineaActual = document.createElement('div');
//                     lineaActual.className = 'progreso-linea-actual';
//                     lineaActual.style.left = `${ultimo}px`;
//                     lineaActual.style.width = `${siguiente - ultimo}px`;
//                     contenedor.appendChild(lineaActual);
//                 }

//                 // Marcar la actual en naranja
//                 steps[ultimaIndex].querySelector('.circle').classList.remove('completed');
//                 steps[ultimaIndex].querySelector('.circle').classList.add('current');
//             }

//             // Activar tooltips
//             const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
//             tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));
//         } catch (error) {
//             console.error('Error en línea de tiempo:', error);
//         }
//     }

//     // ─── Actualiza badge y visibilidad del botón flotante de carrito ──────────
//     function actualizarContadorCarrito() {
//         let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
//         let btn = document.getElementById('btn-carrito-pedidos');
//         let contador = document.getElementById('carrito-contador');

//         if (!btn) return;
//         btn.style.display = carrito.length > 0 ? '' : 'none';
//         if (contador) contador.textContent = carrito.length;
//     }

//     // ─── Actualiza los KPI cards con conteos de la data recibida ──────────────
//     function actualizarKpis(data) {
//         if (!Array.isArray(data)) return;
//         const c = { todos: data.length, Pendiente: 0, Publicado: 0, Asignado: 0, Cancelado: 0 };
//         data.forEach(function (el) {
//             if (el.estado_publicaion === 'Pendiente') c.Pendiente++;
//             if (el.estado_publicaion === 'Publicado' ||
//                 el.estado_publicaion === 'Pendiente Respuesta' ||
//                 el.estado_publicaion === 'Aceptado') c.Publicado++;
//             if (el.estado_asignacion === 'Asignado' ||
//                 el.estado_asignacion === 'Ganador') c.Asignado++;
//             if (el.estado_publicaion === 'Cancelado') c.Cancelado++;
//         });
//         const set = function (id, v) { const el = document.getElementById(id); if (el) el.textContent = v; };
//         set('kpi-total', c.todos);
//         set('kpi-pendiente', c.Pendiente);
//         set('kpi-publicado', c.Publicado);
//         set('kpi-asignado', c.Asignado);
//         set('kpi-cancelado', c.Cancelado);
//     }

//     /* ── Parsear fechas ─────────────────────────────── */
//     // Las fechas vienen como '2026-03-19-08:00:00'
//     // Necesitamos reemplazar el 3er guión por 'T' para que sean válidas
//     const parsearFecha = (f) => {
//         if (!f) return null;
//         // '2026-03-19-08:00:00' → '2026-03-19T08:00:00'
//         const normalizada = f.replace(/^(\d{4}-\d{2}-\d{2})-(\d{2}:\d{2}:\d{2})$/, '$1T$2');
//         const dt = new Date(normalizada);
//         return isNaN(dt.getTime()) ? null : dt;
//     };

//     /* ═══════════════════════════════════════════════════════
//     actualizarKpisOc
//     Recibe:
//         duracionSegundos  → legs[1].duration.value  (vehículo→destino)
//         fechaCargue       → 'YYYY-MM-DD HH:mm:ss'
//         fechaEntrega      → 'YYYY-MM-DD HH:mm:ss'
//     ═══════════════════════════════════════════════════════ */
//     function actualizarKpisOc(duracionSegundos, fechaCargue, fechaEntrega) {
//         const ahora = new Date();

//         /* ── Parsear fechas ─────────────────────────────── */
//         // 'YYYY-MM-DD HH:mm:ss' → reemplazar espacio por T para Safari
//         // const dtCargue = fechaCargue ? new Date(fechaCargue.replace(' ', 'T')) : null;
//         // const dtEntrega = fechaEntrega ? new Date(fechaEntrega.replace(' ', 'T')) : null;
//         // const dtCargue = fechaCargue;
//         // const dtEntrega = fechaEntrega;
//         const dtCargue = parsearFecha(fechaCargue);
//         const dtEntrega = parsearFecha(fechaEntrega);

//         /* ── ETA estimada = ahora + duracion del mapa ───── */
//         const eta = new Date(ahora.getTime() + duracionSegundos * 1000);

//         /* ── T. Disponible ──────────────────────────────── */
//         const h = Math.floor(duracionSegundos / 3600);
//         const min = Math.floor((duracionSegundos % 3600) / 60);
//         const tDisponible = h > 0 ? `${h}h ${min}m` : `${min} min`;

//         document.getElementById('kpi-tdis-val').textContent = tDisponible;
//         document.getElementById('kpi-tdis-val').style.color = '#0369a1';

//         /* ── Estado SLA ─────────────────────────────────── */
//         const slaEl = document.getElementById('kpi-sla-val');
//         const slaSubEl = document.getElementById('kpi-sla-sub');

//         if (dtEntrega) {
//             const diffMs = eta.getTime() - dtEntrega.getTime(); // + = tarde, - = antes
//             const diffMin = Math.round(diffMs / 60000);
//             const absDiff = Math.abs(diffMin);
//             const diffStr = absDiff >= 60
//                 ? `${Math.floor(absDiff / 60)}h ${absDiff % 60}m`
//                 : `${absDiff} min`;

//             if (diffMin <= 0) {
//                 // A tiempo o antes
//                 slaEl.textContent = 'A TIEMPO';
//                 slaEl.style.color = '#16a34a';
//                 slaSubEl.textContent = `${diffStr} de margen`;
//             } else if (diffMin <= 60) {
//                 // Riesgo leve (menos de 1h de retraso)
//                 slaEl.textContent = 'RIESGO';
//                 slaEl.style.color = '#f59e0b';
//                 slaSubEl.textContent = `+${diffStr} de retraso`;
//             } else {
//                 // Crítico
//                 slaEl.textContent = 'CRÍTICO';
//                 slaEl.style.color = '#dc2626';
//                 slaSubEl.textContent = `+${diffStr} de retraso`;
//             }
//         } else {
//             slaEl.textContent = '—';
//             slaSubEl.textContent = 'Sin fecha de entrega';
//         }

//         /* ── Tarjeta Fecha Cargue ───────────────────────── */
//         const cardCargue = document.getElementById('kpi-card-cargue');
//         const cargueValEl = document.getElementById('kpi-cargue-val');
//         const cargueSubEl = document.getElementById('kpi-cargue-sub');

//         if (dtCargue) {
//             const opts = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false };
//             cargueValEl.textContent = dtCargue.toLocaleString('es-CO', opts);

//             if (ahora > dtCargue) {
//                 // Ya pasó la hora de cargue
//                 cargueValEl.style.color = '#dc2626';
//                 cardCargue.style.borderLeft = '3px solid #dc2626';
//                 cargueSubEl.textContent = 'Hora de cargue vencida';
//             } else {
//                 cargueValEl.style.color = '#16a34a';
//                 cardCargue.style.borderLeft = '3px solid #16a34a';
//                 cargueSubEl.textContent = 'Pendiente';
//             }
//         } else {
//             cargueValEl.textContent = '—';
//             cargueSubEl.textContent = 'Sin fecha';
//         }

//         /* ── Tarjeta Fecha Entrega ──────────────────────── */
//         const cardEntrega = document.getElementById('kpi-card-entrega');
//         const entregaValEl = document.getElementById('kpi-entrega-val');
//         const entregaSubEl = document.getElementById('kpi-entrega-sub');

//         if (dtEntrega) {
//             const opts = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false };
//             entregaValEl.textContent = dtEntrega.toLocaleString('es-CO', opts);

//             // Color basado en el mismo cálculo del SLA
//             const diffMin = Math.round((eta.getTime() - dtEntrega.getTime()) / 60000);
//             if (diffMin <= 0) {
//                 entregaValEl.style.color = '#16a34a';
//                 cardEntrega.style.borderLeft = '3px solid #16a34a';
//                 entregaSubEl.textContent = `ETA: ${eta.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
//             } else if (diffMin <= 60) {
//                 entregaValEl.style.color = '#f59e0b';
//                 cardEntrega.style.borderLeft = '3px solid #f59e0b';
//                 entregaSubEl.textContent = `ETA: ${eta.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
//             } else {
//                 entregaValEl.style.color = '#dc2626';
//                 cardEntrega.style.borderLeft = '3px solid #dc2626';
//                 entregaSubEl.textContent = `ETA: ${eta.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
//             }
//         } else {
//             entregaValEl.textContent = '—';
//             entregaSubEl.textContent = 'Sin fecha';
//         }
//     }

//     /* ═══════════════════════════════════════════════════════
//        actualizarLineaTiempo
//        Llama al servidor para nodo 2, calcula estado de cada
//        nodo y actualiza la barra de progreso.
//        Params:
//          solicitudId   — ID del pedido
//          fechaCreacion — 'YYYY-MM-DD HH:mm:ss'  (nodo 1)
//          fechaCargue   — 'YYYY-MM-DD-HH:mm:ss'  (nodo 3, programada)
//          fechaEntrega  — 'YYYY-MM-DD-HH:mm:ss'  (nodo 7, SLA)
//          etaSegundos   — segundos restantes al destino (del mapa)
//     ═══════════════════════════════════════════════════════ */

//     async function actualizarLineaTiempo(solicitudId, fechaCreacion, fechaCargue, fechaEntrega, etaSegundos) {

//         const ahora = new Date();

//         /* ── helpers ── */
//         const parseFecha = (f) => {
//             if (!f) return null;
//             const n = f.replace(/^(\d{4}-\d{2}-\d{2})[-\s](\d{2}:\d{2}:\d{2})$/, '$1T$2');
//             const d = new Date(n);
//             return isNaN(d.getTime()) ? null : d;
//         };
//         const fmt = (d) => d ? d.toLocaleString('es-CO', {
//             day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false
//         }) : '—';
//         const fmtDelta = (ms) => {
//             const min = Math.round(ms / 60000);
//             const abs = Math.abs(min);
//             const str = abs >= 60 ? `${Math.floor(abs / 60)}h ${abs % 60}m` : `${abs} min`;
//             return { str: (min >= 0 ? '+' : '-') + str, tarde: min > 0 };
//         };
//         const setNodo = (n, estado) => {
//             const el = document.getElementById(`tl-node-${n}`);
//             if (!el) return;
//             el.classList.remove('oc-node-done', 'oc-node-active', 'oc-node-pending', 'oc-node-risk');
//             el.classList.add(
//                 { done: 'oc-node-done', active: 'oc-node-active', pending: 'oc-node-pending', risk: 'oc-node-risk' }[estado]
//                 ?? 'oc-node-pending'
//             );
//         };
//         const setTime = (n, txt) => {
//             const el = document.getElementById(`tl-time-${n}`);
//             if (el) el.textContent = txt;
//         };
//         const setDelta = (n, ms) => {
//             const el = document.getElementById(`tl-delta-${n}`);
//             if (!el) return;
//             if (ms === null) { el.style.display = 'none'; return; }
//             const { str, tarde } = fmtDelta(ms);
//             el.textContent = str;
//             el.className = `d ${tarde ? 'd-neg' : 'd-pos'}`;
//             el.style.display = '';
//         };

//         /* ── Fechas programadas del pedido (referencia "Programada") ── */
//         const dtCargue = parseFecha(fechaCargue);   // Prog llegada cargue
//         const dtEntrega = parseFecha(fechaEntrega);  // Prog entrega

//         /* ── Trazabilidad real: primer registro de cada tipo ── */
//         const trazas = Array.isArray(window._trazabilidadPedido) ? window._trazabilidadPedido : [];
//         const buscarTraza = (tipo) => trazas.find(t => t.tipo_trazabilidad === tipo) ?? null;
//         const dtTraza = (tr) => tr ? parseFecha(`${tr.fecha} ${tr.hora}`) : null;

//         const trLlegadaCargue = buscarTraza('Llegada Cargue');
//         const trCargue = buscarTraza('Cargue');
//         const trSalidaCargue = buscarTraza('Salida Cargue');
//         const trInicioRuta = buscarTraza('Inicio Ruta');
//         const trTransito = buscarTraza('Transito');
//         const trLlegadaDes = buscarTraza('Llegada Descargue');
//         const trDescargue = buscarTraza('Descargue');
//         const trSalidaDes = buscarTraza('Salida Descargue');

//         const dtLlegadaCargue = dtTraza(trLlegadaCargue);
//         const dtCargueReal = dtTraza(trCargue);
//         const dtSalidaCargue = dtTraza(trSalidaCargue);
//         const dtInicioRuta = dtTraza(trInicioRuta);
//         const dtTransito = dtTraza(trTransito);
//         const dtLlegadaDes = dtTraza(trLlegadaDes);
//         const dtDescargueReal = dtTraza(trDescargue);
//         const dtSalidaDes = dtTraza(trSalidaDes);

//         /* ════════════════════════════
//            NODO 1 — Creación (siempre done)
//         ════════════════════════════ */
//         setNodo(1, 'done');
//         setTime(1, fmt(parseFecha(fechaCreacion)));

//         /* ════════════════════════════
//            NODO 2 — Asignación vehículo (consulta servidor)
//         ════════════════════════════ */
//         let dtAsignacion = null;
//         try {
//             const baseUrl = document.getElementById('base_url_api').value;
//             const fd2 = new FormData();
//             fd2.append('PedidoId', solicitudId);
//             const r2 = await fetch(baseUrl + 'Fecha_asignacion_vehiculo', {
//                 method: 'POST', headers: { 'X-API-KEY': 'nexos_nacional2026@*' }, body: fd2,
//             });
//             const j2 = await r2.json();
//             if (j2.numero === 200 && j2.data?.fecha_asignacion) {
//                 dtAsignacion = parseFecha(j2.data.fecha_asignacion);
//             }
//         } catch (e) { console.warn('Error nodo 2:', e); }

//         if (dtAsignacion) { setNodo(2, 'done'); setTime(2, fmt(dtAsignacion)); }
//         else { setNodo(2, 'pending'); setTime(2, 'Sin asignar'); }

//         /* ════════════════════════════
//            NODO 3 — Llegada a Cargue
//            Programada : fechaCargue del pedido
//            Real       : fecha+hora de la traza 'Llegada Cargue'
//            Delta      : Real − Programada  (positivo=tardó, negativo=adelantó)
//         ════════════════════════════ */
//         if (dtLlegadaCargue) {
//             // Registro real disponible — nodo completado
//             setNodo(3, 'done');
//             if (dtCargue) {
//                 const dms = dtLlegadaCargue.getTime() - dtCargue.getTime();
//                 setTime(3, `Prog: ${fmt(dtCargue)} | Real: ${fmt(dtLlegadaCargue)}`);
//                 setDelta(3, Math.abs(dms) > 60000 ? dms : null);
//             } else {
//                 setTime(3, fmt(dtLlegadaCargue));
//                 setDelta(3, null);
//             }
//         } else if (dtCargue) {
//             // Sin registro real todavía — mostrar programada y estado actual
//             setTime(3, `Prog: ${fmt(dtCargue)}`);
//             if (ahora >= dtCargue) {
//                 const dms = ahora.getTime() - dtCargue.getTime();
//                 setNodo(3, dms > 30 * 60000 ? 'risk' : 'active');
//                 setDelta(3, dms > 60000 ? dms : null);
//             } else {
//                 setNodo(3, dtAsignacion ? 'active' : 'pending');
//                 setDelta(3, null);
//             }
//         } else {
//             setNodo(3, 'pending');
//             setTime(3, '—');
//         }

//         /* ════════════════════════════
//            NODO 4 — Planta Origen (operación de cargue)
//            Programada : fechaCargue del pedido
//            Real       : traza 'Cargue' (active) | 'Salida Cargue' (done)
//         ════════════════════════════ */
//         if (dtSalidaCargue) {
//             setNodo(4, 'done');
//             if (dtCargue) {
//                 const dms = dtSalidaCargue.getTime() - dtCargue.getTime();
//                 setTime(4, `Prog: ${fmt(dtCargue)} | Real: ${fmt(dtSalidaCargue)}`);
//                 setDelta(4, Math.abs(dms) > 60000 ? dms : null);
//             } else {
//                 setTime(4, fmt(dtSalidaCargue));
//             }
//         } else if (dtCargueReal) {
//             setNodo(4, 'active');
//             if (dtCargue) {
//                 const dms = dtCargueReal.getTime() - dtCargue.getTime();
//                 setTime(4, `Prog: ${fmt(dtCargue)} | Real: ${fmt(dtCargueReal)}`);
//                 setDelta(4, Math.abs(dms) > 60000 ? dms : null);
//             } else {
//                 setTime(4, fmt(dtCargueReal));
//             }
//         } else if (dtLlegadaCargue) {
//             // Llegó pero aún sin registro de cargue
//             setNodo(4, 'active');
//             setTime(4, dtCargue ? `Prog: ${fmt(dtCargue)}` : '—');
//             setDelta(4, null);
//         } else if (dtCargue && ahora >= dtCargue) {
//             setNodo(4, 'active');
//             setTime(4, `Prog: ${fmt(dtCargue)}`);
//         }

//         /* ════════════════════════════
//            NODO 5 — Tránsito en Ruta
//            Real       : traza 'Salida Cargue' | 'Inicio Ruta' | 'Transito'
//            Completado : cuando existe 'Llegada Descargue'
//         ════════════════════════════ */
//         if (dtLlegadaDes) {
//             // Ya llegó al destino — tránsito completado
//             setNodo(5, 'done');
//             setTime(5, fmt(dtLlegadaDes));
//             setDelta(5, null);
//         } else if (dtTransito || dtInicioRuta || dtSalidaCargue) {
//             setNodo(5, 'active');
//             const dtRef = dtTransito || dtInicioRuta || dtSalidaCargue;
//             if (etaSegundos > 0) {
//                 const eta = new Date(ahora.getTime() + etaSegundos * 1000);
//                 setTime(5, `Salida: ${fmt(dtRef)} | ETA: ${fmt(eta)}`);
//                 if (dtEntrega) {
//                     const dms = eta.getTime() - dtEntrega.getTime();
//                     setDelta(5, dms > 0 ? dms : null);
//                 }
//             } else {
//                 setTime(5, fmt(dtRef));
//                 setDelta(5, null);
//             }
//         } else if (dtCargue && ahora >= dtCargue && etaSegundos > 0) {
//             setNodo(5, 'active');
//             const eta = new Date(ahora.getTime() + etaSegundos * 1000);
//             setTime(5, `ETA: ${fmt(eta)}`);
//             if (dtEntrega) {
//                 const dms = eta.getTime() - dtEntrega.getTime();
//                 setDelta(5, dms > 0 ? dms : null);
//             }
//         } else {
//             setNodo(5, 'pending');
//             setTime(5, '—');
//         }

//         /* ════════════════════════════
//            NODO 6 — Planta Destino
//            Programada : fechaEntrega del pedido
//            Real       : 'Llegada Descargue' (active) | 'Descargue'/'Salida Descargue' (done)
//         ════════════════════════════ */
//         if (dtSalidaDes) {
//             setNodo(6, 'done');
//             if (dtEntrega) {
//                 const dms = dtSalidaDes.getTime() - dtEntrega.getTime();
//                 setTime(6, `Prog: ${fmt(dtEntrega)} | Real: ${fmt(dtSalidaDes)}`);
//                 setDelta(6, Math.abs(dms) > 60000 ? dms : null);
//             } else {
//                 setTime(6, fmt(dtSalidaDes));
//             }
//         } else if (dtDescargueReal) {
//             setNodo(6, 'done');
//             if (dtEntrega) {
//                 const dms = dtDescargueReal.getTime() - dtEntrega.getTime();
//                 setTime(6, `Prog: ${fmt(dtEntrega)} | Real: ${fmt(dtDescargueReal)}`);
//                 setDelta(6, Math.abs(dms) > 60000 ? dms : null);
//             } else {
//                 setTime(6, fmt(dtDescargueReal));
//             }
//         } else if (dtLlegadaDes) {
//             setNodo(6, 'active');
//             if (dtEntrega) {
//                 const dms = dtLlegadaDes.getTime() - dtEntrega.getTime();
//                 setTime(6, `Prog: ${fmt(dtEntrega)} | Real: ${fmt(dtLlegadaDes)}`);
//                 setDelta(6, Math.abs(dms) > 60000 ? dms : null);
//             } else {
//                 setTime(6, fmt(dtLlegadaDes));
//             }
//         } else if (dtEntrega) {
//             setNodo(6, 'pending');
//             setTime(6, `SLA: ${fmt(dtEntrega)}`);
//             setDelta(6, null);
//         }

//         /* ════════════════════════════
//            NODO 7 — Entrega Final
//            Programada : fechaEntrega del pedido
//            Real       : traza 'Salida Descargue'
//         ════════════════════════════ */
//         if (dtSalidaDes) {
//             setNodo(7, 'done');
//             if (dtEntrega) {
//                 const dms = dtSalidaDes.getTime() - dtEntrega.getTime();
//                 setTime(7, `Prog: ${fmt(dtEntrega)} | Real: ${fmt(dtSalidaDes)}`);
//                 setDelta(7, Math.abs(dms) > 60000 ? dms : null);
//             } else {
//                 setTime(7, fmt(dtSalidaDes));
//                 setDelta(7, null);
//             }
//         } else if (dtEntrega && ahora >= dtEntrega) {
//             // SLA vencido sin registro de salida
//             setNodo(7, 'risk');
//             const dms = ahora.getTime() - dtEntrega.getTime();
//             setTime(7, `SLA vencido: ${fmt(dtEntrega)}`);
//             setDelta(7, dms > 60000 ? dms : null);
//         } else if (dtEntrega) {
//             setNodo(7, 'pending');
//             setTime(7, `SLA: ${fmt(dtEntrega)}`);
//             if (etaSegundos > 0) {
//                 const eta = new Date(ahora.getTime() + etaSegundos * 1000);
//                 const dms = eta.getTime() - dtEntrega.getTime();
//                 setDelta(7, dms > 0 ? dms : null);
//             } else {
//                 setDelta(7, null);
//             }
//         }

//         /* ════════════════════════════
//            BARRA DE PROGRESO
//            Cada nodo aporta un peso según la trazabilidad real disponible.
//         ════════════════════════════ */
//         const pesos = [
//             { pct: 100 },                                                                          // N1 creación
//             { pct: dtAsignacion ? 100 : 0 },                                                       // N2 asignación
//             { pct: dtLlegadaCargue ? 100 : (dtCargue && ahora >= dtCargue) ? 60 : 0 },             // N3 llegada cargue
//             { pct: dtSalidaCargue ? 100 : dtCargueReal ? 70 : dtLlegadaCargue ? 30 : 0 },          // N4 planta origen
//             { pct: dtLlegadaDes ? 100 : (dtTransito || dtInicioRuta || dtSalidaCargue) ? 50 : 0 }, // N5 tránsito
//             { pct: (dtDescargueReal || dtSalidaDes) ? 100 : dtLlegadaDes ? 50 : 0 },               // N6 planta destino
//             { pct: dtSalidaDes ? 100 : 0 },                                                        // N7 entrega final
//         ];

//         const cumplidos = pesos.reduce((a, p) => a + p.pct / 100, 0);
//         const porcentaje = Math.round((cumplidos / pesos.length) * 100);

//         const barFill = document.getElementById('kpi-bar-fill');
//         const barVal = document.getElementById('kpi-pct-val');
//         if (barFill) {
//             barFill.style.width = `${porcentaje}%`;
//             barFill.style.transition = 'width .6s ease';
//             barFill.style.background = porcentaje >= 80 ? 'linear-gradient(90deg,#16a34a,#22c55e)'
//                 : porcentaje >= 40 ? 'linear-gradient(90deg,#0369a1,#0891b2)'
//                     : 'linear-gradient(90deg,#ea580c,#f97316)';
//         }
//         if (barVal) barVal.textContent = `${porcentaje}%`;

//         const tlBar = document.getElementById('tl-progress-bar');
//         if (tlBar) tlBar.style.width = `${porcentaje}%`;
//     }

//     /* ═══════════════════════════════════════════════
//        renderTablaResumen
//        container → elemento DOM del div tabla-tiempos-X
//        tareas    → array enriquecido con _tiempos
//        titulo    → 'Planta Origen' | 'Planta Destino'
//     ═══════════════════════════════════════════════ */
//     function calcularTiempos(tareas, fechaCargue) {

//         const parseFecha = (f) => {
//             if (!f) return null;
//             const n = f.replace(/^(\d{4}-\d{2}-\d{2})[-\s](\d{2}:\d{2}:\d{2})$/, '$1T$2');
//             const d = new Date(n);
//             return isNaN(d.getTime()) ? null : d;
//         };

//         // Convierte valor_tiempo a minutos según medida_tiempo (1=min, 2=hrs, 3=días)
//         const aMinutos = (valor, medida) => {
//             if (!valor) return null;
//             const m = Number(medida) || 1;
//             if (m === 1) return Number(valor);
//             if (m === 2) return Number(valor) * 60;
//             if (m === 3) return Number(valor) * 1440;
//             return Number(valor);
//         };

//         const fmtMin = (m) => {
//             const abs = Math.abs(m);
//             if (abs >= 1440) return `${Math.floor(abs / 1440)}d ${Math.floor((abs % 1440) / 60)}h`;
//             if (abs >= 60) return `${Math.floor(abs / 60)}h ${abs % 60}m`;
//             return `${abs} min`;
//         };

//         const fmtFecha = (d) => {
//             if (!d) return null;
//             return d.toLocaleString('es-CO', {
//                 day: '2-digit', month: 'short', year: 'numeric',
//                 hour: '2-digit', minute: '2-digit', hour12: false,
//             });
//         };

//         // Fecha de cargue del pedido (base para actividades sin dependencia)
//         const dtCargue = parseFecha(fechaCargue);
//         const ahora = new Date();

//         // Mapa id → tarea
//         const mapaId = {};
//         tareas.forEach(t => { mapaId[t.id] = t; });

//         /* ── Precalcular dtInicio programado en cadena (memoización) ──────────
//          *
//          * Reglas:
//          *  criterio_calculo = 4  → dtInicio = fecha_base_calc del servidor
//          *                          (ya fue calculada en PHP con la gestión del prerequisito)
//          *  sin dependencia       → dtInicio = dtCargue
//          *  con dependencia       → dtInicio = dtInicio(prerequisito) + minutos(prerequisito)
//          *
//          * El servidor envía fecha_base_calc con el valor correcto para c=4,
//          * por lo que el JS solo necesita parsearla.
//         ────────────────────────────────────────────────────────────────────── */
//         const dtInicioCalc = {};

//         const resolverDtInicio = (t) => {
//             if (dtInicioCalc[t.id] !== undefined) return dtInicioCalc[t.id];

//             let dt = null;
//             const sinDep = !t.actividad_prerequisito || t.actividad_prerequisito === 0;

//             if (t.criterio_calculo === 4) {
//                 // PHP ya calculó y guardó fecha_base_calc con la fecha de gestión del prerequisito
//                 dt = parseFecha(t.fecha_base_calc) ?? dtCargue;

//             } else if (t.orden === 1 || sinDep) {
//                 dt = dtCargue;

//             } else if (t.actividad_prerequisito && mapaId[t.actividad_prerequisito]) {
//                 const pre = mapaId[t.actividad_prerequisito];
//                 const dtPre = resolverDtInicio(pre);
//                 const minPre = aMinutos(pre.valor_tiempo, pre.medida_tiempo);
//                 dt = (dtPre && minPre) ? new Date(dtPre.getTime() + minPre * 60 * 1000) : dtCargue;
//             }

//             dtInicioCalc[t.id] = dt;
//             return dt;
//         };

//         tareas.forEach(t => resolverDtInicio(t));

//         return tareas.map(t => {

//             const minAsignados = aMinutos(t.valor_tiempo, t.medida_tiempo);
//             if (!minAsignados) return { ...t, _tiempos: null };

//             const dtInicio = dtInicioCalc[t.id];
//             if (!dtInicio) return { ...t, _tiempos: null };

//             // Fecha real de ejecución (calculada o registrada en el servidor)
//             const dtReal = parseFecha(t.fecha_inicio_real);

//             // Fecha límite programada = dtInicio + tiempo estándar
//             const dtLimite = new Date(dtInicio.getTime() + minAsignados * 60 * 1000);

//             // Tiempo transcurrido real: si hay fecha real, desde dtInicio hasta dtReal
//             // Si no, desde dtInicio hasta ahora
//             const baseTranscurrido = dtReal || dtInicio;
//             const minTranscurridos = Math.max(0, Math.floor((ahora - baseTranscurrido) / 60000));
//             const minRestantes = Math.floor((dtLimite - ahora) / 60000);
//             const alDia = t.estado === 'COMPLETADO' || minRestantes >= 0;
//             const pct = Math.min(Math.round((minTranscurridos / minAsignados) * 100), 999);

//             // Para COMPLETADO: tiempo real = diferencia entre dtReal y dtInicio (si existe)
//             const minTransMostrar = (t.estado === 'COMPLETADO' && dtReal)
//                 ? Math.max(0, Math.floor((dtReal - dtInicio) / 60000))
//                 : t.estado === 'COMPLETADO'
//                     ? minAsignados
//                     : minTranscurridos;

//             return {
//                 ...t,
//                 _tiempos: {
//                     minAsignados,
//                     minTranscurridos: minTransMostrar,
//                     minRestantes,
//                     alDia,
//                     pct: t.estado === 'COMPLETADO' ? 100 : pct,
//                     textoAsignado: fmtMin(minAsignados),
//                     textoTranscurrido: fmtMin(minTransMostrar),
//                     textoRestante: t.estado === 'COMPLETADO'
//                         ? '0 min'
//                         : (minRestantes < 0 ? '-' : '+') + fmtMin(Math.abs(minRestantes)),
//                     // Prog = fecha calculada en que debía iniciar
//                     fechaInicioCalc: fmtFecha(dtInicio),
//                     // Real = fecha real de inicio (del servidor, puede ser null)
//                     fechaReal: fmtFecha(dtReal),
//                     fechaLimite: fmtFecha(dtLimite),
//                 },
//             };
//         });
//     }

//     function renderTablaResumen(container, tareas, titulo) {
//         if (!container) return;

//         const fmtMin = (m) => {
//             const abs = Math.abs(m);
//             if (abs >= 1440) return `${Math.floor(abs / 1440)}d ${Math.floor((abs % 1440) / 60)}h`;
//             if (abs >= 60) return `${Math.floor(abs / 60)}h ${abs % 60}m`;
//             return `${abs} min`;
//         };

//         // ── Filas: Actividad | Estándar | Real | Δ ──────────────────────────
//         // Real  = tiempo_real_gestion (última gestión − fecha_base_calc)
//         // Δ     = tiempo_real_min     (positivo=ganó, negativo=perdió)
//         const filas = tareas.map(t => {

//             const estandar = t._tiempos ? t._tiempos.textoAsignado : '—';

//             // ── Real ──
//             let realHtml = '<span style="color:#94a3b8">—</span>';
//             if (t.estado === 'COMPLETADO' && t.tiempo_real_gestion != null) {
//                 realHtml = `<span style="color:#16a34a;font-weight:600">${fmtMin(t.tiempo_real_gestion)}</span>`;
//             } else if (t.estado === 'EN GESTION' && t._tiempos) {
//                 realHtml = `<span style="color:#ea580c;font-weight:600">${t._tiempos.textoTranscurrido}</span>`;
//             }

//             // ── Delta ──
//             let deltaHtml = '<span style="color:#94a3b8">—</span>';
//             if (t.estado === 'COMPLETADO' && t.tiempo_real_min != null) {
//                 const diff = t.tiempo_real_min;
//                 const color = diff === 0 ? '#0369a1' : diff > 0 ? '#16a34a' : '#dc2626';
//                 const signo = diff > 0 ? '+' : diff < 0 ? '-' : '=';
//                 deltaHtml = `<span style="font-size:9px;font-weight:700;font-family:'JetBrains Mono',monospace;
//                     padding:1px 6px;border-radius:7px;white-space:nowrap;
//                     background:${color}12;color:${color};border:1px solid ${color}30">
//                     ${signo}${fmtMin(Math.abs(diff))}</span>`;
//             }

//             return `
//             <tr>
//                 <td style="font-size:10px;color:#0f172a;max-width:110px;white-space:normal;line-height:1.3">
//                     ${t.nombre}
//                 </td>
//                 <td class="v" style="font-size:10px;color:#475569;text-align:center">${estandar}</td>
//                 <td class="v" style="font-size:10px;text-align:center">${realHtml}</td>
//                 <td class="v" style="text-align:center">${deltaHtml}</td>
//             </tr>`;
//         }).join('');

//         // ── Totales ──
//         const totalAsig = tareas.reduce((a, t) => a + (t._tiempos?.minAsignados || 0), 0);
//         const totalReal = tareas.reduce((a, t) =>
//             t.estado === 'COMPLETADO' && t.tiempo_real_gestion != null ? a + t.tiempo_real_gestion : a, 0);
//         const totalDelta = tareas.reduce((a, t) =>
//             t.estado === 'COMPLETADO' && t.tiempo_real_min != null ? a + t.tiempo_real_min : a, 0);
//         const totalCompletadas = tareas.filter(t => t.estado === 'COMPLETADO' && t.tiempo_real_min != null).length;
//         const totalColorD = totalDelta === 0 ? '#0369a1' : totalDelta > 0 ? '#16a34a' : '#dc2626';
//         const totalDeltaHtml = totalCompletadas > 0
//             ? `<span style="font-size:9px;font-weight:700;font-family:'JetBrains Mono',monospace;
//                 padding:1px 6px;border-radius:7px;background:${totalColorD}12;
//                 color:${totalColorD};border:1px solid ${totalColorD}30">
//                 ${totalDelta > 0 ? '+' : totalDelta < 0 ? '-' : '='}${fmtMin(Math.abs(totalDelta))}</span>`
//             : '—';

//         // ── Registro de eventos: COMPLETADAS con delta != 0 ──
//         const eventos = tareas.filter(t =>
//             t.estado === 'COMPLETADO' &&
//             t.tiempo_real_min != null &&
//             t.tiempo_real_min !== 0
//         );

//         const eventosHtml = eventos.length === 0
//             ? `<div style="font-size:10px;color:#94a3b8;padding:8px 0">Sin diferencias de tiempo registradas.</div>`
//             : eventos.map(t => {
//                 const diff = t.tiempo_real_min;
//                 const color = diff > 0 ? '#16a34a' : '#dc2626';
//                 const texto = diff > 0
//                     ? `Ganó ${fmtMin(Math.abs(diff))} en "${t.nombre}"`
//                     : `Perdió ${fmtMin(Math.abs(diff))} en "${t.nombre}"`;
//                 return `
//                 <div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid #f1f5f9">
//                     <span style="font-size:7px;color:${color};margin-top:3px;flex-shrink:0">●</span>
//                     <div>
//                         <div style="font-size:10px;color:#0f172a">${texto}</div>
//                         <div style="font-size:9px;color:#94a3b8">
//                             Est: ${t._tiempos?.textoAsignado ?? '—'} · Real: ${fmtMin(t.tiempo_real_gestion ?? 0)}
//                         </div>
//                     </div>
//                     <span style="margin-left:auto;font-size:9px;font-weight:700;font-family:'JetBrains Mono',monospace;
//                         padding:1px 6px;border-radius:7px;white-space:nowrap;
//                         background:${color}12;color:${color};border:1px solid ${color}30">
//                         ${diff > 0 ? '+' : ''}${fmtMin(diff)}
//                     </span>
//                 </div>`;
//             }).join('');

//         container.innerHTML = `
//             <table class="oc-table" style="margin-bottom:.8rem">
//                 <thead>
//                     <tr>
//                         <th>Actividad</th>
//                         <th style="text-align:center">Estándar</th>
//                         <th style="text-align:center">Real</th>
//                         <th style="text-align:center">Δ</th>
//                     </tr>
//                 </thead>
//                 <tbody>${filas}</tbody>
//                 <tfoot>
//                     <tr class="total">
//                         <td>TOTAL ${titulo?.toUpperCase() ?? ''}</td>
//                         <td class="v" style="text-align:center">${fmtMin(totalAsig)}</td>
//                         <td class="v" style="text-align:center">${totalReal > 0 ? fmtMin(totalReal) : '—'}</td>
//                         <td class="v" style="text-align:center">${totalDeltaHtml}</td>
//                     </tr>
//                 </tfoot>
//             </table>

//             <div style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;
//                 color:#94a3b8;margin-bottom:.5rem;margin-top:.2rem">
//                 Registro de Eventos
//             </div>
//             <div style="max-height:180px;overflow-y:auto">
//                 ${eventosHtml}
//             </div>`;
//     }

//     // Exponer al scope global (igual que el ocToggle original)
//     window.ocToggle = ocToggle;
//     window.completarTareaOC = completarTareaOC;
// })();

window.VENTANA = null; // Variable global para almacenar el ID
(function () {
    "use strict";
    // Definir la función initScript globalmente
    window.initScript = function (id) {
        window.VENTANA = id; // Asigna el ID recibido a la variable global

        // Crear instancia
        // Usar una variable global o una propiedad en el objeto window
        if (!window.myOffcanvas) {
            window.myOffcanvas = new DynamicOffcanvas({
                id: `customOffcanvas${id}`,
                title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
                content: '<p>Contenido inicial</p>',
                scroll: true,
                backdrop: false,
            });
        } else {
            console.log('El offcanvas ya está creado.');
        }

        // document.getElementById(`campo-${window.VENTANA}-trazabilidad`).style.display = 'none';
        // Obtener los campos por ID
        let campoFechaInicial = document.getElementById(`fecha_inicial`);
        let campoFechaFinal = document.getElementById(`fecha_final`);

        if (campoFechaInicial && campoFechaFinal) {
            let hoy = new Date();
            let anio = hoy.getFullYear();
            let mes = hoy.getMonth() + 1; // Los meses van de 0 a 11
            let dia = hoy.getDate();

            // Formatear mes y día con dos dígitos
            mes = mes < 10 ? `0${mes}` : mes;
            let diaActual = dia < 10 ? `0${dia}` : dia;

            // Establecer fechas en formato YYYY-MM-DD
            let fechaInicio = `${anio}-${mes}-01`;
            let fechaFin = `${anio}-${mes}-${diaActual}`;

            // Asignar las fechas a los inputs
            campoFechaInicial.value = fechaInicio;
            campoFechaFinal.value = fechaFin;

            // Obtener los valores de los inputs para enviar a la función
            let fecha_inicial = campoFechaInicial.value;
            let fecha_final = campoFechaFinal.value;

            // Llamar a la función con los valores actualizados
            listar_pedidos_administrador(fecha_inicial, fecha_final);
        }

        document.addEventListener('click', async (e) => {
            /* Boton para buscar por fechas */
            if (e.target.matches('#buscar') || e.target.matches('#buscar *')) {
                const fecha_inicial = document.getElementById('fecha_inicial')?.value ?? '';
                const fecha_final = document.getElementById('fecha_final')?.value ?? '';
                const _estPub = document.getElementById('f-estado-pub')?.value ?? ''; // Asignado / Cancelado / Pendiente
                const _estTraz = document.getElementById('f-estado-traz')?.value ?? ''; // Cargue / Descargue / etc
                const _modalidad = document.getElementById('f-modalidad')?.value ?? ''; // CARGA SECA / IMPORTACION / etc

                document.querySelectorAll('.kpi-resumen').forEach(c => c.classList.remove('active'));

                if (_estTraz && _modalidad) {
                    // Trazabilidad + modalidad
                    listar_pedidos_administrador(fecha_inicial, fecha_final, '', _estTraz, _modalidad, 'filt_traz_mod');

                } else if (_estPub && _modalidad) {
                    // Estado publicación + modalidad
                    listar_pedidos_administrador(fecha_inicial, fecha_final, _estPub, _modalidad, '', 'filt_mod');

                } else if (_estTraz) {
                    // Solo trazabilidad
                    listar_pedidos_administrador(fecha_inicial, fecha_final, _estTraz, '', '', 'trazabilidad');

                } else if (_estPub) {
                    // Solo estado publicación/asignación
                    listar_pedidos_administrador(fecha_inicial, fecha_final, _estPub, '', '', 'filt');

                } else if (_modalidad) {
                    // Solo modalidad
                    listar_pedidos_administrador(fecha_inicial, fecha_final, '', _modalidad, '', 'mod');

                } else {
                    // Solo fechas
                    listar_pedidos_administrador(fecha_inicial, fecha_final, '', '', '', '');
                }
            }

            if (e.target.matches('#btn-carrito-pedidos') || e.target.matches('#btn-carrito-pedidos *')) {
                let clienId = document.getElementById('btn-carrito-pedidos').getAttribute('data-idCliente');
                let pedidoId = document.getElementById('btn-carrito-pedidos').getAttribute('data-idPedido');
                let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

                if (carrito.length === 0) {
                    myOffcanvas.updateContent(`<p class="text-center text-muted">No hay pedidos en el carrito.</p>`);
                } else {
                    let tablaHTML = `
              <table class="table table-striped table-sm" data-page-length='100' style="font-size:11px;">
                  <thead>
                      <tr>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>#</th>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>N° Pedido</th>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>Placa</th>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>Cliente</th>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>Producto</th>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>Unidades</th>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>Presetación</th>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>Peso Neto</th>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>Peso Bruto</th>
                      </tr>
                  </thead>
                  <tbody>`;

                    carrito.forEach((item, index) => {
                        tablaHTML += `
                  <tr>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${index + 1}</td>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${item.id}</td>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId4}</td>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId || '-'}</td>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId12 || '-'}</td>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId7 || '-'}</td>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId13 || '-'}</td>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId10 || '-'} KG</td>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId11 || '-'} KG</td>
                  </tr>`;
                    });

                    tablaHTML += `
                    </tbody>
                    </table>
                    <div class="d-flex align-items-center justify-content-between">
                        <h5 id="titulo_opcion" class="mb-0 me-2 d-flex align-items-center justify-content-center">Título</h5>
                        <div id="acciones_asignacion"></div>
                    </div>
                    <hr class="my-1 text-dark">
                    <div class="container" id="contenido_opcion"></div>
                `;

                    myOffcanvas.updateTitle(`
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="text-primary-emphasis uil uil-file-alt"></span> Listado de Pedidos 
                        <div class="dropdown ms-2">
                        <a class="btn btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink"  href="#"  role="button" data-bs-toggle="dropdown"  aria-haspopup="true"  aria-expanded="false">Opciones</a>
                        <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
                            <a class="dropdown-item fw-bold" href="#" id="btn_asignar_proveedor" data-id="${pedidoId}" data-id2="${clienId}" data-title="Asignar Proveedor"><span class="uil uil-file-search-alt"></span> Asignar Proveedor</a>
                            <a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido"   data-id="${pedidoId}" data-id2="${clienId}" data-title="Publicar Pedidos"><span class="uil uil-feedback"></span> Publicar Pedido</a>
                            <!--<a class="dropdown-item" href="#">Something else here</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#">Separated link</a>
                        </div>-->
                        </div>
                    </div>
                `);

                    myOffcanvas.updateContent(tablaHTML);
                    myOffcanvas.updateHeight('100vh');
                    myOffcanvas.updateWidth('70%');
                    myOffcanvas.updateClass('offcanvas-end');
                }

                myOffcanvas.show();
            }

            if (e.target.matches('#btn_detalle_trazabilidad_pedido') || e.target.matches('#btn_detalle_trazabilidad_pedido *')) {
                let Enlace = e.target.closest('#btn_detalle_trazabilidad_pedido');
                let PedidoId = Enlace.getAttribute('data-id');

                myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Trazabilidad pedido`);
                myOffcanvas.updateContent(`
                    <div class="table-responsive scrollbar">
                        <style>
                            #lineaTiempo {
                            position: relative;
                            }

                            #lineaTiempo .progreso-linea,
                            #lineaTiempo .progreso-linea-actual {
                            position: absolute;
                            top: 16px; /* Centro exacto de los círculos de 32px de alto */
                            height: 4px;
                            z-index: 0;
                            transition: all 0.3s ease-in-out;
                            }

                            #lineaTiempo .progreso-linea {
                            background-color: green;
                            }

                            #lineaTiempo .progreso-linea-actual {
                            background-color: orange;
                            }

                            .step {
                            position: relative;
                            z-index: 1;
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            }

                            .circle {
                            width: 32px;
                            height: 32px;
                            background-color: #dee2e6;
                            border-radius: 50%;
                            border: 3px solid transparent;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 1;
                            }

                            .circle.completed {
                            background-color: green;
                            }

                            .circle.current {
                            background-color: orange;
                            }

                            .step small {
                            margin-top: 6px;
                            font-size: 0.75rem;
                            color: #495057;
                            text-align: center;
                            }

                            .info-extra {
                            font-size: 0.7rem;
                            color: #6c757d;
                            text-align: center;
                            }
                        </style>

                        <div class="timeline-wrapper bg-light rounded p-4" >
                            <h1 class="h6 mb-3 text-end"><span id='FechaEstimada'></span></h1>
                            <div class="d-flex justify-content-between position-relative timeline-line" id="lineaTiempo">
                            <!-- Los pasos se inyectarán por JavaScript -->
                            </div>
                        </div>

                        <div class="border-top border-translucent border-dashed pt-3"></div>

                        <table class="table table-sm text-center" style="font-size: 11px;">
                        <thead>
                            <tr>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>#</th>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>Tipo Trazabilidad</th>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>Observación</th>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>Usuario</th>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>Fecha</th>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>Soporte</th>
                            </tr>
                        </thead>
                        <tbody id="tbody_detalle_trazabilidad_pedido" class="text-center">
                            <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
                        </tbody>
                        </table>

                        <!--<style>
                            .timeline {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin: 50px 0;
                            position: relative;
                            }

                            .timeline::before {
                            content: '';
                            position: absolute;
                            top: 50%;
                            left: 0;
                            width: 100%;
                            height: 4px;
                            background-color: #000;
                            z-index: 1;
                            }

                            .step {
                            position: relative;
                            z-index: 2;
                            text-align: center;
                            flex: 1;
                            }

                            .circle {
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            margin: 0 auto 10px;
                            background-color: #ccc;
                            border: 2px solid #000;
                            transition: background-color 0.5s ease;
                            }

                            .step.active .circle {
                            background-color: #ffc107; /* amarillo */
                            }

                            .step.done .circle {
                            background-color: #28a745; /* verde */
                            }

                            .label {
                            font-weight: bold;
                            }
                        </style>

                        <div class="container">
                        <div class="timeline">
                            <div class="step done" id="step1">
                            <div class="circle"></div>
                            <div class="label">Asignado</div>
                            </div>
                            <div class="step active" id="step2">
                            <div class="circle"></div>
                            <div class="label">Llega vehículo</div>
                            </div>
                            <div class="step" id="step3">
                            <div class="circle"></div>
                            <div class="label">En cargue</div>
                            </div>
                            <div class="step" id="step4">
                            <div class="circle"></div>
                            <div class="label">En ruta</div>
                            </div>
                            <div class="step" id="step5">
                            <div class="circle"></div>
                            <div class="label">Entregado</div>
                            </div>
                        </div>
                        </div>-->
                    </div>
                `);

                try {
                    let formData = new FormData();
                    formData.append('PedidoId', PedidoId);

                    let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_trazabilidad_pedido', {
                        method: 'POST',
                        body: formData,
                    });

                    let data = await response.json();
                    if (data) {
                        let rows = '';

                        data.forEach((servicio, index) => {
                            rows += `
                            <tr>
                            <th scope="row">${index + 1}</th>
                            <!--<td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.referencia}</td>-->
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.tipo_trazabilidad}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.observacion}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.usuario}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_registro}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>
                                <a href="${$('#base_url').val()}${servicio.evidencia}" target="_blank" class="btn btn-outline-primary btn-sm me-1 px-1 py-0">
                                    <i class="uil-file-download-alt"></i> Ver Documento
                                </a>
                            </td>
                            </tr>
                            <!--<tr id="Recurso_proveedores_${servicio.referencia}" style="display: none;">
                            <td colspan="12">
                                <div class="lista-proceso-proveedores"></div>
                            </td>
                            </tr>
                            <tr id="trazabilidad_pedidos_recurso_${servicio.referencia}" style="display: none;">
                            <td colspan="12">
                                <div class="trazabilidad-pedidos"></div>
                            </td>
                            </tr>-->
                        `;
                        });

                        document.getElementById('tbody_detalle_trazabilidad_pedido').innerHTML = rows;
                    } else {
                        document.getElementById(
                            'tbody_detalle_trazabilidad_pedido'
                        ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
                    }
                } catch (error) {
                    console.error('Error al obtener proveedores:', error);
                    document.getElementById(
                        'tbody_detalle_trazabilidad_pedido'
                    ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
                }

                // Actualizar el estado de los pasos en la línea de tiempo
                cargarLineaTiempo(PedidoId);
                myOffcanvas.show();
            }

            if (e.target.matches(`#btn-close-customOffcanvas${window.VENTANA}`) || e.target.matches(`#btn-close-customOffcanvas${window.VENTANA} *`)) {
                SatrackGPS.detener(); // ← AGREGAR ESTA LÍNEA al inicio del bloque existente
                sessionStorage.clear();
                actualizarContadorCarrito();

                const checkboxes = document.querySelectorAll('.servicioProveedor');
                checkboxes.forEach((element) => {
                    if (element.checked) {
                        console.log('El checkbox estaba marcado ✅ y ahora lo desmarcamos.');
                        element.checked = false;
                    } else {
                        element.checked = false;
                        console.log('El checkbox ya estaba NO marcado ❌.');
                    }
                });

                window.ArrayDespachos = [];
            }

            if (e.target.matches('#btn_detalle_trazabilidad') || e.target.matches('#btn_detalle_trazabilidad *')) {
                let Enlace = e.target.closest('#btn_detalle_trazabilidad');
                // let numdoc_trazabilidad = Enlace.getAttribute("data-id");
                let ServicioId = Enlace.getAttribute('data-ServicioId');
                let RecursoId = Enlace.getAttribute('data-RecursoId');

                myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Detalle de solicitud de servicio`);
                myOffcanvas.updateContent(`
                <div class="table-responsive scrollbar">
                    <table class="table table-sm text-center" style="font-size: 11px;">
                        <thead>
                        <tr>
                            <th scope="col" style='width: auto; white-space: nowrap;'>#</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Placa</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Ruta </th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Sitio</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Latitud</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Longitud</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Fecha</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Nota</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Usuario</th>
                        </tr>
                        </thead>
                        <tbody id="tbody_detalle_trazabilidad" class="text-center">
                        <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
                        </tbody>
                    </table>
                    </div>

                    <div id="map" style="height: 600px; width: 100%;"></div>
                `);

                try {
                    let formData = new FormData();
                    formData.append('ServicioId', ServicioId);
                    formData.append('RecursoId', RecursoId);
                    // formData.append("proveedor_id", document.getElementById('proveedor_id').value);

                    let response = await fetch($('#base_url').val() + 'torrecontrol/detalle_trazabilidad_pedido', {
                        method: 'POST',
                        body: formData,
                    });

                    let data = await response.json();
                    if (data) {
                        let rows = '';

                        data.forEach((servicio, index) => {
                            rows += `
                            <tr>
                            <th scope="row">${index + 1}</th>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.placa_vehiculo}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.ruta}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.sitio_seguimiento}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.latitud}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.longitud}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_hora_seguimiento}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.nota_seguimiento}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.usuario_reporte}</td>
                            </tr>
                            <tr id="Recurso_proveedores_${servicio.referencia}" style="display: none;">
                            <td colspan="12">
                                <div class="lista-proceso-proveedores"></div>
                            </td>
                            </tr>
                        `;
                        });

                        document.getElementById('tbody_detalle_trazabilidad').innerHTML = rows;

                        /*Dibujar mapa  */
                        let map; // 🛡️ Mejor declararlo afuera

                        async function initMap() {
                            const { Map } = await google.maps.importLibrary('maps');
                            const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
                            const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary('routes');
                            const { Geocoder } = await google.maps.importLibrary('geocoding'); // Importar Geocoder

                            map = new Map(document.getElementById('map'), {
                                center: { lat: 4.5709, lng: -74.2973 }, // Colombia
                                zoom: 5.5,
                                gestureHandling: 'greedy',
                                mapId: 'db5350020424d6c4',
                            });

                            const geocoder = new Geocoder();

                            // Función auxiliar para obtener el nombre del lugar
                            async function obtenerNombreLugar(lat, lng) {
                                return new Promise((resolve, reject) => {
                                    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                                        if (status === 'OK' && results[0]) {
                                            resolve(results[0].formatted_address); // Puedes usar también address_components si quieres algo más específico
                                        } else {
                                            console.error('No se pudo obtener el nombre del lugar:', status);
                                            resolve('Lugar desconocido'); // Por si falla
                                        }
                                    });
                                });
                            }

                            // Colocar los marcadores
                            for (const punto of data) {
                                const lat = parseFloat(punto.latitud);
                                const lng = parseFloat(punto.longitud);
                                const nombreLugar = await obtenerNombreLugar(lat, lng);

                                new AdvancedMarkerElement({
                                    map: map,
                                    position: { lat, lng },
                                    title: `${nombreLugar}\n${punto.fecha_hora}`, // Nombre + fecha_hora
                                });
                            }

                            // Ahora usar DirectionsService para calcular la ruta real
                            const directionsService = new DirectionsService();
                            const directionsRenderer = new DirectionsRenderer({ map: map });

                            // Creamos el array de paradas (waypoints)
                            const waypoints = data.slice(1, data.length - 1).map((punto) => ({
                                location: {
                                    lat: parseFloat(punto.latitud),
                                    lng: parseFloat(punto.longitud),
                                },
                                stopover: true,
                            }));

                            // Definimos la solicitud
                            const request = {
                                origin: {
                                    lat: parseFloat(data[0].latitud),
                                    lng: parseFloat(data[0].longitud),
                                },
                                destination: {
                                    lat: parseFloat(data[data.length - 1].latitud),
                                    lng: parseFloat(data[data.length - 1].longitud),
                                },
                                waypoints: waypoints,
                                travelMode: google.maps.TravelMode.DRIVING,
                                optimizeWaypoints: false,
                            };

                            // Pedimos la ruta
                            directionsService.route(request, (result, status) => {
                                if (status === 'OK') {
                                    directionsRenderer.setDirections(result);
                                } else {
                                    console.error('Error en la ruta:', status);
                                }
                            });
                        }

                        initMap();
                    } else {
                        document.getElementById(
                            'tbody_detalle_trazabilidad'
                        ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
                    }
                } catch (error) {
                    console.error('Error al obtener proveedores:', error);
                    document.getElementById(
                        'tbody_detalle_trazabilidad'
                    ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
                }

                myOffcanvas.show();
            }

            if (e.target.matches('#btn_cancelar_pedido') || e.target.matches('#btn_cancelar_pedido *')) {
                let boton = e.target.closest('#btn_cancelar_pedido'); // Capturamos el botón real
                let SolicitudId = boton.getAttribute('data-id');

                try {
                    const result = await Swal.fire({
                        title: '¿Seguro?',
                        text: '¿Desea cancelar la solicitud?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3B71CA',
                        cancelButtonColor: '#9FA6B2',
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar',
                        customClass: {
                            popup: 'swal2-custom-font',
                        },
                    });

                    if (result.isConfirmed) {
                        let formData = new FormData();
                        formData.append('SolicitudId', SolicitudId);

                        let response = await fetch($('#base_url').val() + 'torrecontrol/cancelar_solicitud_pedido', {
                            method: 'POST',
                            body: formData,
                        });

                        let data = await response.json();

                        if (data && data.status === true) {
                            await Swal.fire({
                                title: 'Solicitud Cancelada',
                                text: data.message || 'La solicitud fue cancelada exitosamente.',
                                icon: 'success',
                                confirmButtonColor: '#3B71CA',
                                customClass: {
                                    popup: 'swal2-custom-font',
                                },
                            });

                            // Si quieres actualizar la tabla o hacer otra acción después del éxito
                            // actualizarTabla();  <-- ejemplo
                            let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
                            let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
                            listar_pedidos_administrador(fecha_inicial, fecha_final);
                        } else {
                            await Swal.fire({
                                title: 'Error',
                                text: data.message || 'No se pudo cancelar la solicitud.',
                                icon: 'error',
                                confirmButtonColor: '#3B71CA',
                                customClass: {
                                    popup: 'swal2-custom-font',
                                },
                            });

                            document.getElementById('tbody_detalle_trazabilidad').innerHTML = `
                                <tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>
                            `;
                        }
                    }
                } catch (error) {
                    console.error('Error al cancelar solicitud:', error);

                    await Swal.fire({
                        title: 'Error inesperado',
                        text: 'Ocurrió un error al intentar cancelar la solicitud.',
                        icon: 'error',
                        confirmButtonColor: '#3B71CA',
                        customClass: {
                            popup: 'swal2-custom-font',
                        },
                    });

                    document.getElementById('tbody_detalle_trazabilidad').innerHTML = `
                        <tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>
                    `;
                }
            }

            if (e.target.matches(`#btn_detalle`) || e.target.matches(`#btn_detalle *`)) {
                let Enlace = e.target.closest('#btn_detalle');
                let PedidoId = Enlace.getAttribute('data-SolicitudId');
                let ServicioId = Enlace.getAttribute('data-ServicioId');
                let RecursoId = Enlace.getAttribute('data-RecursoId');

                myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Trazabilidad`);
                myOffcanvas.updateContent(`
                    <div class="table-responsive scrollbar">
                        <style>
                            #lineaTiempo {
                            position: relative;
                            }

                            #lineaTiempo .progreso-linea,
                            #lineaTiempo .progreso-linea-actual {
                            position: absolute;
                            top: 16px; /* Centro exacto de los círculos de 32px de alto */
                            height: 4px;
                            z-index: 0;
                            transition: all 0.3s ease-in-out;
                            }

                            #lineaTiempo .progreso-linea {
                            background-color: green;
                            }

                            #lineaTiempo .progreso-linea-actual {
                            background-color: orange;
                            }

                            .step {
                            position: relative;
                            z-index: 1;
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            }

                            .circle {
                            width: 32px;
                            height: 32px;
                            background-color: #dee2e6;
                            border-radius: 50%;
                            border: 3px solid transparent;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 1;
                            }

                            .circle.completed {
                            background-color: green;
                            }

                            .circle.current {
                            background-color: orange;
                            }

                            .step small {
                            margin-top: 6px;
                            font-size: 0.75rem;
                            color: #495057;
                            text-align: center;
                            }

                            .info-extra {
                            font-size: 0.7rem;
                            color: #6c757d;
                            text-align: center;
                            }
                        </style>

                        <div class="timeline-wrapper bg-light rounded p-4" >
                            <h1 class="h6 mb-3 text-end"><span id='FechaEstimada'></span></h1>
                            <div class="d-flex justify-content-between position-relative timeline-line" id="lineaTiempo">
                            <!-- Los pasos se inyectarán por JavaScript -->
                            </div>
                        </div>

                        <div class="border-top border-translucent border-dashed pt-3"></div>

                        <hr class="my-1 text-dark">
                            <h6>Trazabilidad Pedido</h6>
                        <hr class="my-1 text-dark">

                        <table class="table table-sm text-center" style="font-size: 11px;">
                            <thead>
                                <tr>
                                <th class='text-center' style='width: auto; white-space: nowrap;'>#</th>
                                <th class='text-center' style='width: auto; white-space: nowrap;'>Tipo Trazabilidad</th>
                                <th class='text-center' style='width: auto; white-space: nowrap;'>Observación</th>
                                <th class='text-center' style='width: auto; white-space: nowrap;'>Usuario</th>
                                <th class='text-center' style='width: auto; white-space: nowrap;'>Fecha</th>
                                <th class='text-center' style='width: auto; white-space: nowrap;'>Soporte</th>
                                </tr>
                            </thead>
                            <tbody id="tbody_detalle_trazabilidad_pedido" class="text-center">
                                <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <hr class="my-1 text-dark">
                        <h6>Trazabilidad Recurso</h6>
                    <hr class="my-1 text-dark">

                    <div class="table-responsive scrollbar">
                        <table class="table table-sm text-center" style="font-size: 11px;">
                            <thead>
                            <tr>
                                <th scope="col" style='width: auto; white-space: nowrap;'>#</th>
                                <th scope="col" style='width: auto; white-space: nowrap;'>Placa</th>
                                <th scope="col" style='width: auto; white-space: nowrap;'>Ruta </th>
                                <th scope="col" style='width: auto; white-space: nowrap;'>Sitio</th>
                                <th scope="col" style='width: auto; white-space: nowrap;'>Latitud</th>
                                <th scope="col" style='width: auto; white-space: nowrap;'>Longitud</th>
                                <th scope="col" style='width: auto; white-space: nowrap;'>Fecha</th>
                                <th scope="col" style='width: auto; white-space: nowrap;'>Nota</th>
                                <th scope="col" style='width: auto; white-space: nowrap;'>Usuario</th>
                            </tr>
                            </thead>
                            <tbody id="tbody_detalle_trazabilidad" class="text-center">
                            <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div id="map" style="height: 600px; width: 100%;"></div>
                `);

                try {
                    let formData = new FormData();
                    formData.append('PedidoId', PedidoId);

                    let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_trazabilidad_pedido', {
                        method: 'POST',
                        body: formData,
                    });

                    let data = await response.json();
                    if (data) {
                        let rows = '';

                        data.forEach((servicio, index) => {
                            rows += `
                            <tr>
                            <th scope="row">${index + 1}</th>
                            <!--<td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.referencia}</td>-->
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.tipo_trazabilidad}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.observacion}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.usuario}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_registro}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>
                                <a href="${$('#base_url').val()}${servicio.evidencia
                                }" target="_blank" class="btn btn-outline-primary btn-sm me-1 px-1 py-0">
                                    <i class="uil-file-download-alt"></i> Ver Documento
                                </a>
                            </td>
                            </tr>
                        `;
                        });

                        document.getElementById('tbody_detalle_trazabilidad_pedido').innerHTML = rows;
                    } else {
                        document.getElementById(
                            'tbody_detalle_trazabilidad_pedido'
                        ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
                    }
                } catch (error) {
                    console.error('Error al obtener proveedores:', error);
                    document.getElementById(
                        'tbody_detalle_trazabilidad_pedido'
                    ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
                }

                //Trazabilidad de los recursos
                try {
                    let formData = new FormData();
                    formData.append('ServicioId', ServicioId);
                    formData.append('RecursoId', RecursoId);
                    // formData.append("proveedor_id", document.getElementById('proveedor_id').value);

                    let response = await fetch($('#base_url').val() + 'torrecontrol/detalle_trazabilidad_pedido', {
                        method: 'POST',
                        body: formData,
                    });

                    let data = await response.json();
                    if (data) {
                        let rows = '';

                        data.forEach((servicio, index) => {
                            rows += `
                            <tr>
                            <th scope="row">${index + 1}</th>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.placa_vehiculo}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.ruta}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.sitio_seguimiento}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.latitud}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.longitud}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_hora_seguimiento}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.nota_seguimiento}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.usuario_reporte}</td>
                            </tr>
                            <tr id="Recurso_proveedores_${servicio.referencia}" style="display: none;">
                            <td colspan="12">
                                <div class="lista-proceso-proveedores"></div>
                            </td>
                            </tr>
                        `;
                        });

                        document.getElementById('tbody_detalle_trazabilidad').innerHTML = rows;

                        /*Dibujar mapa  */
                        let map; // 🛡️ Mejor declararlo afuera

                        async function initMap() {
                            const { Map } = await google.maps.importLibrary('maps');
                            const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
                            const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary('routes');
                            const { Geocoder } = await google.maps.importLibrary('geocoding'); // Importar Geocoder

                            map = new Map(document.getElementById('map'), {
                                center: { lat: 4.5709, lng: -74.2973 }, // Colombia
                                zoom: 5.5,
                                gestureHandling: 'greedy',
                                mapId: 'db5350020424d6c4',
                            });

                            const geocoder = new Geocoder();

                            // Función auxiliar para obtener el nombre del lugar
                            async function obtenerNombreLugar(lat, lng) {
                                return new Promise((resolve, reject) => {
                                    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                                        if (status === 'OK' && results[0]) {
                                            resolve(results[0].formatted_address); // Puedes usar también address_components si quieres algo más específico
                                        } else {
                                            console.error('No se pudo obtener el nombre del lugar:', status);
                                            resolve('Lugar desconocido'); // Por si falla
                                        }
                                    });
                                });
                            }

                            // Colocar los marcadores
                            for (const punto of data) {
                                const lat = parseFloat(punto.latitud);
                                const lng = parseFloat(punto.longitud);
                                const nombreLugar = await obtenerNombreLugar(lat, lng);

                                new AdvancedMarkerElement({
                                    map: map,
                                    position: { lat, lng },
                                    title: `${nombreLugar}\n${punto.fecha_hora}`, // Nombre + fecha_hora
                                });
                            }

                            // Ahora usar DirectionsService para calcular la ruta real
                            const directionsService = new DirectionsService();
                            const directionsRenderer = new DirectionsRenderer({ map: map });

                            // Creamos el array de paradas (waypoints)
                            const waypoints = data.slice(1, data.length - 1).map((punto) => ({
                                location: {
                                    lat: parseFloat(punto.latitud),
                                    lng: parseFloat(punto.longitud),
                                },
                                stopover: true,
                            }));

                            // Definimos la solicitud
                            const request = {
                                origin: {
                                    lat: parseFloat(data[0].latitud),
                                    lng: parseFloat(data[0].longitud),
                                },
                                destination: {
                                    lat: parseFloat(data[data.length - 1].latitud),
                                    lng: parseFloat(data[data.length - 1].longitud),
                                },
                                waypoints: waypoints,
                                travelMode: google.maps.TravelMode.DRIVING,
                                optimizeWaypoints: false,
                            };

                            // Pedimos la ruta
                            directionsService.route(request, (result, status) => {
                                if (status === 'OK') {
                                    directionsRenderer.setDirections(result);
                                } else {
                                    console.error('Error en la ruta:', status);
                                }
                            });
                        }
                        initMap();
                    } else {
                        document.getElementById(
                            'tbody_detalle_trazabilidad'
                        ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
                    }
                } catch (error) {
                    console.error('Error al obtener proveedores:', error);
                    document.getElementById(
                        'tbody_detalle_trazabilidad'
                    ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
                }

                // Actualizar el estado de los pasos en la línea de tiempo
                cargarLineaTiempo(PedidoId);
                myOffcanvas.show();
            }

            /* ══════════════════════════════════════════════════════════════════════════════
            |  BLOQUE 1 — Reemplaza el handler de #btn_detalle_trazabilidad_pedidos
            |  (desde "if (e.target.matches('#btn_detalle_trazabilidad_pedidos')"
            |   hasta su "}" de cierre, línea ~1061)
            ══════════════════════════════════════════════════════════════════════════════*/

            if (e.target.matches('#btn_detalle_trazabilidad_pedidos') || e.target.matches('#btn_detalle_trazabilidad_pedidos *')) {
                let BtnDetalle = e.target.closest('#btn_detalle_trazabilidad_pedidos');
                let SolicitudId = parseFloat(BtnDetalle.getAttribute('data-SolicitudId'));
                let LatitudOrigen = parseFloat(BtnDetalle.getAttribute('data-latitud_origen'));
                let LongitudOrigen = parseFloat(BtnDetalle.getAttribute('data-longitud_origen'));
                let LatitudDestino = parseFloat(BtnDetalle.getAttribute('data-latitud_destino'));
                let LongitudDestino = parseFloat(BtnDetalle.getAttribute('data-longitud_destino'));
                let ciudad_origen = BtnDetalle.getAttribute('data-ciudad_origen');
                let ciudad_destino = BtnDetalle.getAttribute('data-ciudad_destino');
                let fecha_creacion = BtnDetalle.getAttribute('data-fecha_creacion');
                let fecha_cargue = BtnDetalle.getAttribute('data-fecha_cargue');
                let fecha_entrega = BtnDetalle.getAttribute('data-fecha_entrega');
                let refPedido = BtnDetalle.getAttribute('data-refPedido');
                let tipoTrazabilidad = BtnDetalle.getAttribute('data-tipo_trazabilidad');
                // console.log("🚀 ~ tipoTrazabilidad:", tipoTrazabilidad);

                document.getElementById('oc-estado-transito').innerHTML = tipoTrazabilidad;
                document.getElementById('oc-estado-transito-two').innerHTML = tipoTrazabilidad;

                // ── Placa del pedido (usar data-placa del botón en producción) ──
                // Por ahora quemada; sustituir por:
                // let placaVehiculo = BtnDetalle.getAttribute('data-placa') ?? 'ABC123';

                // DESPUÉS
                const _placaRaw = BtnDetalle.getAttribute('data-placa');
                let placaVehiculo = (_placaRaw && _placaRaw !== 'null') ? _placaRaw : null;

                // ── Detener rastreo anterior si había uno activo ──
                SatrackGPS.detener();

                // ── Inyectar ID en los paneles ──
                document.querySelectorAll('.oc-sec-panel').forEach(panel => {
                    panel.dataset.pedidoId = SolicitudId;
                });

                // ── Actualizar MAPA_CONFIG ──
                MAPA_CONFIG = {
                    origen: { lat: LatitudOrigen, lng: LongitudOrigen, label: ciudad_origen },
                    vehiculo: { label: placaVehiculo }, // lat/lng los asigna SatrackGPS al cargar
                    destino: { lat: LatitudDestino, lng: LongitudDestino, label: ciudad_destino },
                    radioOrigen: 300,
                    radioDestino: 250,
                };

                // ── Variables globales de línea de tiempo ──
                window._tlSolicitudId = SolicitudId;
                window._tlFechaCreacion = fecha_creacion;
                window._tlFechaCargue = fecha_cargue;
                window._tlFechaEntrega = fecha_entrega;

                // ── Guardar la placa activa para usarla en initOcMap ──
                window._satrackPlacaActiva = placaVehiculo;

                // ── Actualizar DOM ──
                const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
                setEl('det-pedido', refPedido);
                setEl('det-pedido-hero', refPedido);
                setEl('ciudad-origen', ciudad_origen);
                setEl('ciudad-destino', ciudad_destino);

                // ── Línea de tiempo inicial ──
                // actualizarLineaTiempo(SolicitudId, fecha_creacion, fecha_cargue, fecha_entrega, 0);

                // ── Detalle del proceso ──
                try {
                    const formData = new FormData();
                    formData.append('Solicitud', SolicitudId);

                    const response = await fetch($('#base_url').val() + 'torrecontrol/detalle_proceso', {
                        method: 'POST', body: formData,
                    });
                    const data = await response.json();
                    const sub = data.consulta_subasta[0];
                    const safe = (val) => (val ?? '');

                    setEl('nc-conductor', safe(sub?.nombre_conductor));
                    setEl('pc-placa', safe(sub?.referencia));
                    setEl('pl-titulo', safe(sub?.referencia));
                    setEl('mnc-conductor', safe(sub?.nombre_conductor));
                    setEl('mpc-placa', safe(sub?.referencia));

                    setEl(
                        'fp-planta-origen',
                        sub?.fecha_inicio && sub?.hora_inicio
                            ? `${sub.fecha_inicio} ${sub.hora_inicio}`
                            : ''
                    );

                } catch (error) {
                    console.error('Error al obtener detalle proceso:', error);
                }

                // ── Trazabilidad real del pedido → alimenta la línea de tiempo ──
                try {
                    const formDataTraz = new FormData();
                    formDataTraz.append('PedidoId', SolicitudId);

                    const resTraz = await fetch($('#base_url_api').val() + 'Trazabilidad_pedidos', {
                        method: 'POST',
                        headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
                        body: formDataTraz,
                    });
                    const jsonTraz = await resTraz.json();

                    if (jsonTraz.numero === 200 && Array.isArray(jsonTraz.data)) {
                        window._trazabilidadPedido = jsonTraz.data;
                    } else {
                        window._trazabilidadPedido = [];
                    }
                } catch (errTraz) {
                    console.warn('Sin trazabilidad disponible:', errTraz);
                    window._trazabilidadPedido = [];
                }

                // Llamar con trazabilidad ya cargada en window._trazabilidadPedido
                actualizarLineaTiempo(SolicitudId, fecha_creacion, fecha_cargue, fecha_entrega, 0, tipoTrazabilidad);
            }

            // ── Helper distancia/tiempo + KPIs + línea de tiempo ─
            // function actualizarInfoRuta(legs) {
            //     let totalDistanciaM = 0;
            //     let totalDuracionS = 0;

            //     legs.forEach(leg => {
            //         totalDistanciaM += leg.distance.value;
            //         totalDuracionS += leg.duration.value;
            //     });

            //     const km = (totalDistanciaM / 1000).toFixed(1);
            //     const distanciaText = km >= 1 ? `${km} km` : `${totalDistanciaM} m`;

            //     const horas = Math.floor(totalDuracionS / 3600);
            //     const minutos = Math.floor((totalDuracionS % 3600) / 60);
            //     let duracionText = '';
            //     if (horas > 0) duracionText += `${horas} h `;
            //     if (minutos > 0) duracionText += `${minutos} min`;
            //     if (!duracionText) duracionText = '< 1 min';

            //     const elDist = document.getElementById('ocMapDistancia');
            //     const elDur = document.getElementById('ocMapDuracion');
            //     if (elDist) elDist.textContent = distanciaText;
            //     if (elDur) elDur.textContent = duracionText;

            //     const segVehiculoDestino = legs[1] ?? legs[0];
            //     actualizarKpisOc(
            //         segVehiculoDestino.duration.value,
            //         window._tlFechaCargue,
            //         window._tlFechaEntrega
            //     );

            //     // actualizarLineaTiempo(
            //     //     window._tlSolicitudId,
            //     //     window._tlFechaCreacion,
            //     //     window._tlFechaCargue,
            //     //     window._tlFechaEntrega,
            //     //     segVehiculoDestino.duration.value
            //     // );
            // }

            // ═══════════════════════════════════════════════════════════════════════════
            //  PARCHE: administrador_pedidos.js
            //
            //  INSTRUCCIONES:
            //  Reemplaza la función `actualizarInfoRuta` existente (líneas ~4378–4416)
            //  y agrega la nueva función `actualizarKpisOcConFechas` justo debajo
            //  de la función `actualizarKpisOc` existente.
            //
            //  NO toques nada más del archivo.
            // ═══════════════════════════════════════════════════════════════════════════


            // ═══════════════════════════════════════════════════════════════
            //  REEMPLAZAR — función actualizarInfoRuta (líneas ~4378–4416)
            //
            //  Cambios respecto al original:
            //   - Llama al nuevo endpoint Calcular_fechas_viaje con la
            //     duración bruta de Google Maps.
            //   - Si el backend responde OK, usa las fechas ajustadas para
            //     los KPIs (cargue y entrega reales según horarios).
            //   - Si falla (red, sin horarios), mantiene el comportamiento
            //     original como fallback.
            // ═══════════════════════════════════════════════════════════════
            function actualizarInfoRuta(legs) {
                let totalDistanciaM = 0;
                let totalDuracionS = 0;

                legs.forEach(leg => {
                    totalDistanciaM += leg.distance.value;
                    totalDuracionS += leg.duration.value;
                });

                // ── Distancia ──
                const km = (totalDistanciaM / 1000).toFixed(1);
                const distanciaText = km >= 1 ? `${km} km` : `${totalDistanciaM} m`;

                // ── Duración bruta del mapa (SIN buffer aún — el backend aplica el 28 %) ──
                const horas = Math.floor(totalDuracionS / 3600);
                const minutos = Math.floor((totalDuracionS % 3600) / 60);
                let duracionText = '';
                if (horas > 0) duracionText += `${horas} h `;
                if (minutos > 0) duracionText += `${minutos} min`;
                if (!duracionText) duracionText = '< 1 min';

                const elDist = document.getElementById('ocMapDistancia');
                const elDur = document.getElementById('ocMapDuracion');
                const elDur2 = document.getElementById('kpi-tdis-val');
                if (elDist) elDist.textContent = distanciaText;
                if (elDur) elDur.textContent = duracionText;
                if (elDur2) elDur2.textContent = duracionText;

                // ── Tramo vehículo → destino (mismo criterio que el original) ──
                const segVehiculoDestino = legs[1] ?? legs[0];

                // ── Llamar al backend para obtener fechas ajustadas ──────────
                const pedidoId = window._tlSolicitudId;
                const baseUrl = document.getElementById('base_url_api')?.value ?? '';

                if (pedidoId && baseUrl) {
                    const fd = new FormData();
                    fd.append('PedidoId', pedidoId);
                    fd.append('duracion_segundos', totalDuracionS);   // duración bruta total

                    fetch(baseUrl + 'Calcular_fechas_viaje', {
                        method: 'POST',
                        headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
                        body: fd,
                    })
                        .then(r => r.json())
                        .then(json => {
                            if (json.numero === 200) {
                                const d = json.data;

                                // Mostrar la duración con buffer en el badge de tiempo
                                if (elDur) {
                                    const bMin = d.duracion_con_buffer_min;
                                    const bH = Math.floor(bMin / 60);
                                    const bM = bMin % 60;
                                    const bufferText = bH > 0 ? `${bH}h ${bM}m (+28%)` : `${bM} min (+28%)`;
                                    elDur.textContent = bufferText;
                                }

                                if (elDur2) {
                                    const bMin = d.duracion_con_buffer_min;
                                    const bH = Math.floor(bMin / 60);
                                    const bM = bMin % 60;
                                    const bufferText = bH > 0 ? `${bH}h ${bM}m (+28%)` : `${bM} min (+28%)`;
                                    elDur2.textContent = bufferText;
                                }

                                // Actualizar KPIs con las fechas ajustadas del backend
                                actualizarKpisOcConFechas(
                                    segVehiculoDestino.duration.value,  // duración bruta para ETA
                                    d.fecha_cargue_ajustada,
                                    d.fecha_entrega_ajustada,
                                    d.motivo_ajuste
                                );
                            } else {
                                // Fallback: comportamiento original sin ajuste de horarios
                                actualizarKpisOc(
                                    segVehiculoDestino.duration.value,
                                    window._tlFechaCargue,
                                    window._tlFechaEntrega
                                );
                            }
                        })
                        .catch(() => {
                            // Sin red o error inesperado: fallback al comportamiento original
                            actualizarKpisOc(
                                segVehiculoDestino.duration.value,
                                window._tlFechaCargue,
                                window._tlFechaEntrega
                            );
                        });
                } else {
                    // Sin pedidoId o baseUrl: fallback
                    actualizarKpisOc(
                        segVehiculoDestino.duration.value,
                        window._tlFechaCargue,
                        window._tlFechaEntrega
                    );
                }
            }

            // ── Geocercas ────────────────────────────────────────
            async function cargarGeocercasPedido(pedidoId) {
                if (!ocMap) return;

                try {
                    const baseUrl = document.getElementById('base_url_api').value;
                    const formData = new FormData();
                    formData.append('PedidoId', pedidoId);

                    const res = await fetch(baseUrl + 'Geocercas_pedido', {
                        method: 'POST',
                        headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
                        body: formData,
                    });
                    const json = await res.json();
                    if (json.numero !== 200) return;

                    const { remitente, destinatario, todos_puntos } = json.data;

                    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
                    const { Circle } = await google.maps.importLibrary("maps");
                    const { DirectionsService, TravelMode } = await google.maps.importLibrary("routes");

                    /* ── Actualizar MAPA_CONFIG con coords reales ── */
                    if (remitente?.lat && remitente?.lng) {
                        MAPA_CONFIG.origen = { lat: remitente.lat, lng: remitente.lng, label: remitente.nombre };
                    }
                    if (destinatario?.lat && destinatario?.lng) {
                        MAPA_CONFIG.destino = { lat: destinatario.lat, lng: destinatario.lng, label: destinatario.nombre };
                    }

                    /* ── Calcular ruta ── */
                    if (MAPA_CONFIG.origen?.lat && MAPA_CONFIG.destino?.lat && directionsRenderer) {
                        // Solo incluir el vehículo como waypoint si ya tiene posición real de Satrack
                        const vehiculoWp = MAPA_CONFIG.vehiculo?.lat
                            ? [{ location: { lat: MAPA_CONFIG.vehiculo.lat, lng: MAPA_CONFIG.vehiculo.lng }, stopover: false }]
                            : [];

                        new DirectionsService().route({
                            origin: { lat: MAPA_CONFIG.origen.lat, lng: MAPA_CONFIG.origen.lng },
                            destination: { lat: MAPA_CONFIG.destino.lat, lng: MAPA_CONFIG.destino.lng },
                            travelMode: TravelMode.DRIVING,
                            // waypoints: [{ location: MAPA_CONFIG.vehiculo, stopover: false }],
                            waypoints: vehiculoWp,
                        }, (result, status) => {
                            if (status === 'OK') {
                                directionsRenderer.setDirections(result);
                                actualizarInfoRuta(result.routes[0].legs);
                            } else {
                                console.warn('Directions API error:', status);
                            }
                        });
                    }

                    /* ── Helper: animar círculo con pulso ── */
                    function animarCirculo(circle, radioBase, colorStroke) {
                        let creciendo = true;
                        let radio = radioBase;
                        let opacidad = 0.7;

                        setInterval(() => {
                            if (creciendo) {
                                radio += radioBase * 0.08;
                                opacidad -= 0.04;
                                if (radio >= radioBase * 1.6) creciendo = false;
                            } else {
                                radio -= radioBase * 0.08;
                                opacidad += 0.04;
                                if (radio <= radioBase) creciendo = true;
                            }
                            circle.setRadius(radio);
                            circle.setOptions({ strokeOpacity: Math.max(0.1, opacidad) });
                        }, 80);
                    }

                    /* ── Remitente del pedido (azul) ── */
                    if (remitente?.lat && remitente?.lng) {
                        const pinRem = new PinElement({
                            background: '#0369a1', borderColor: '#0c4a6e',
                            glyphColor: '#fff', glyph: '🏭', scale: 1.2,
                        });
                        new AdvancedMarkerElement({
                            map: ocMap,
                            position: { lat: remitente.lat, lng: remitente.lng },
                            title: `Remitente: ${remitente.nombre}`,
                            content: pinRem.element,
                        });

                        remitente.geocercas.forEach(g => {
                            if (!g.lat || !g.lng) return;
                            // const radioBase = 1500;
                            const radioBase = 25;
                            const c = new Circle({
                                map: ocMap,
                                center: { lat: g.lat, lng: g.lng },
                                radius: radioBase,
                                strokeColor: '#0369a1',
                                strokeOpacity: 0.7,
                                strokeWeight: 2,
                                fillColor: '#0369a1',
                                fillOpacity: 0.06,
                            });
                            animarCirculo(c, radioBase, '#0369a1');
                        });
                    }

                    /* ── Destinatario del pedido (verde) ── */
                    if (destinatario?.lat && destinatario?.lng) {
                        const pinDes = new PinElement({
                            background: '#16a34a', borderColor: '#14532d',
                            glyphColor: '#fff', glyph: '🏪', scale: 1.2,
                        });
                        new AdvancedMarkerElement({
                            map: ocMap,
                            position: { lat: destinatario.lat, lng: destinatario.lng },
                            title: `Destinatario: ${destinatario.nombre}`,
                            content: pinDes.element,
                        });

                        destinatario.geocercas.forEach(g => {
                            if (!g.lat || !g.lng) return;
                            const radioBase = 1500;
                            const c = new Circle({
                                map: ocMap,
                                center: { lat: g.lat, lng: g.lng },
                                radius: radioBase,
                                strokeColor: '#16a34a',
                                strokeOpacity: 0.7,
                                strokeWeight: 2,
                                fillColor: '#16a34a',
                                fillOpacity: 0.06,
                            });
                            animarCirculo(c, radioBase, '#16a34a');
                        });
                    }

                    /* ── Todos los puntos del cliente (gris) ── */
                    todos_puntos.forEach(punto => {
                        if (punto.esPedido || !punto.lat || !punto.lng) return;
                        const pin = new PinElement({
                            background: '#94a3b8', borderColor: '#475569',
                            glyphColor: '#fff', glyph: '📍', scale: 0.8,
                        });
                        new AdvancedMarkerElement({
                            map: ocMap,
                            position: { lat: punto.lat, lng: punto.lng },
                            title: punto.nombre,
                            content: pin.element,
                        });
                        punto.geocercas.forEach(g => {
                            if (!g.lat || !g.lng) return;
                            const radioBase = 1500;
                            const c = new Circle({
                                map: ocMap,
                                center: { lat: g.lat, lng: g.lng },
                                radius: radioBase,
                                strokeColor: '#94a3b8',
                                strokeOpacity: 0.4,
                                strokeWeight: 1,
                                fillColor: '#94a3b8',
                                fillOpacity: 0.03,
                            });
                            animarCirculo(c, radioBase, '#94a3b8');
                        });
                    });

                } catch (e) {
                    console.warn('Error cargando geocercas:', e);
                }
            }

            /* ══════════════════════════════════════════════════════════════════════════════
            |  BLOQUE 2 — Reemplaza initOcMap() completa (línea ~1387)
            |  Busca: "async function initOcMap() {"
            |  Reemplaza todo el cuerpo de la función por el de abajo.
            ══════════════════════════════════════════════════════════════════════════════*/
            async function initOcMap() {
                if (!MAPA_CONFIG.origen || !MAPA_CONFIG.destino) {
                    console.warn('initOcMap: MAPA_CONFIG no listo, reintentando…');
                    setTimeout(initOcMap, 200);
                    return;
                }

                const { Map, InfoWindow } = await google.maps.importLibrary('maps');
                const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary('marker');
                const { DirectionsRenderer } = await google.maps.importLibrary('routes');

                const mapDiv = document.getElementById('ocMap');
                if (!mapDiv) return;

                // ── Crear el mapa centrado en origen mientras llega la posición del vehículo ──
                ocMap = new Map(mapDiv, {
                    center: MAPA_CONFIG.origen,
                    zoom: 6,
                    mapId: 'DEMO_MAP_ID',
                    mapTypeId: 'roadmap',
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                });

                // ── Marcador del vehículo sin posición — SatrackGPS lo ubica al cargar ──
                const pinVehiculo = new PinElement({
                    background: '#ea580c',
                    borderColor: '#9a3412',
                    glyphColor: '#fff',
                    glyph: '🚛',
                    scale: 1.3,
                });
                vehiculoMarker = new AdvancedMarkerElement({
                    map: ocMap,
                    position: null,
                    title: MAPA_CONFIG.vehiculo?.label ?? '',
                    content: pinVehiculo.element,
                });

                // ── DirectionsRenderer ──
                directionsRenderer = new DirectionsRenderer({
                    map: ocMap,
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: '#0369a1',
                        strokeWeight: 4,
                        strokeOpacity: 0.75,
                    },
                });

                // ── InfoWindow del vehículo ──
                const infoWin = new InfoWindow({
                    content: `
                        <div style="font-family:sans-serif;font-size:12px;min-width:180px;">
                            <div style="font-weight:700;color:#0f172a;margin-bottom:6px;">🚛 Cargando…</div>
                        </div>`,
                });
                vehiculoMarker.addListener('click', () =>
                    infoWin.open({ anchor: vehiculoMarker, map: ocMap })
                );

                // ── Geocercas (pinta ruta y marcadores de origen/destino) ──
                await cargarGeocercasPedido(window._tlSolicitudId);

                // ── INICIAR RASTREO SATRACK EN TIEMPO REAL ──
                const placa = window._satrackPlacaActiva;
                if (placa) {
                    SatrackGPS.iniciar(placa, ocMap, vehiculoMarker, directionsRenderer, infoWin);
                }
            }

            // ── Listener offcanvas — UNA sola vez ───────────────
            const offcanvasEl = document.getElementById('offcanvasPedido');
            if (offcanvasEl) {
                /* ══════════════════════════════════════════════════════════════════════════════
                |  BLOQUE 3 — Agrega esto DENTRO del listener 'shown.bs.offcanvas'
                |  (línea ~1476) donde ya se llama a initOcMap.
                |  En el else if (ocMap) reemplaza el bloque por este:
                ══════════════════════════════════════════════════════════════════════════════*/

                offcanvasEl.addEventListener('shown.bs.offcanvas', () => {
                    if (!mapLoaded) {
                        mapLoaded = true;
                        setTimeout(initOcMap, 100);
                    } else if (ocMap) {
                        setTimeout(async () => {
                            google.maps.event.trigger(ocMap, 'resize');
                            ocMap.setCenter(MAPA_CONFIG.vehiculo);
                            await cargarGeocercasPedido(window._tlSolicitudId);

                            // Reiniciar rastreo con la nueva placa
                            const placa = window._satrackPlacaActiva;
                            if (placa) {
                                SatrackGPS.detener(); // Para el anterior
                                SatrackGPS.iniciar(placa, ocMap, vehiculoMarker, directionsRenderer);
                            }
                        }, 100);
                    }
                });
            }

        });
        // ── cierre document.addEventListener('click')

        // ══════════════════════════════════════════════════════
        // VARIABLES DEL MAPA — scope de initScript (fuera del click)
        // ══════════════════════════════════════════════════════
        let ocMap = null;
        let vehiculoMarker = null;
        let directionsRenderer = null;
        let mapLoaded = false;
        let MAPA_CONFIG = {};

        // ── Timestamp live — una sola vez ───────────────────
        const ocMapTs = document.getElementById('ocMapTs');
        function ocTick() {
            if (ocMapTs) ocMapTs.textContent = new Date()
                .toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
        ocTick();
        setInterval(ocTick, 1000);

        // ════════════════════════════════════════════════════════
        // KPI CARDS — clic para filtrar la tabla por estado
        // ════════════════════════════════════════════════════════
        document.querySelectorAll('.kpi-resumen').forEach(function (card) {
            card.addEventListener('click', function () {
                document.querySelectorAll('.kpi-resumen').forEach(function (c) { c.classList.remove('active'); });
                this.classList.add('active');
                const filtro = this.dataset.filtro;
                const fi = document.getElementById('fecha_inicial') ? document.getElementById('fecha_inicial').value : '';
                const ff = document.getElementById('fecha_final') ? document.getElementById('fecha_final').value : '';
                if (filtro === 'todos') {
                    listar_pedidos_administrador(fi, ff, '', '', '', '');
                } else {
                    listar_pedidos_administrador(fi, ff, filtro, '', '', 'estado_publicacion');
                }
            });
        });

        // ── Botón Consultar (nuevo, desde filtros) ──
        const btnConsultar = document.getElementById('buscar');
        if (btnConsultar) {
            // Remover listeners previos clonando
            const newBtn = btnConsultar.cloneNode(true);
            btnConsultar.parentNode.replaceChild(newBtn, btnConsultar);
            newBtn.addEventListener('click', function () {
                const fi = document.getElementById('fecha_inicial') ? document.getElementById('fecha_inicial').value : '';
                const ff = document.getElementById('fecha_final') ? document.getElementById('fecha_final').value : '';
                const modalidad = document.getElementById('f-modalidad') ? document.getElementById('f-modalidad').value : '';
                const estPub = document.getElementById('f-estado-pub') ? document.getElementById('f-estado-pub').value : '';
                const estTraz = document.getElementById('f-estado-traz') ? document.getElementById('f-estado-traz').value : '';
                document.querySelectorAll('.kpi-resumen').forEach(function (c) { c.classList.remove('active'); });

                // Prioridad: estado trazabilidad > estado publicación > modalidad > solo fechas
                if (estTraz) {
                    listar_pedidos_administrador(fi, ff, estTraz, '', '', 'trazabilidad');
                } else if (estPub) {
                    listar_pedidos_administrador(fi, ff, estPub, '', '', 'estado_publicacion');
                } else if (modalidad) {
                    listar_pedidos_administrador(fi, ff, '', modalidad, '', 'mod');
                } else {
                    listar_pedidos_administrador(fi, ff, '', '', '', '');
                }
            });
        }

        // ── Botón Limpiar filtros ──
        const btnLimpiar = document.getElementById('btn-limpiar');
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', function () {
                const ids = ['f-modalidad', 'f-estado-pub', 'f-estado-traz'];
                ids.forEach(function (id) { const el = document.getElementById(id); if (el) el.value = ''; });
                const fi = document.getElementById('fecha_inicial');
                const ff = document.getElementById('fecha_final');
                if (fi) fi.value = '';
                if (ff) ff.value = '';
                document.querySelectorAll('.kpi-resumen').forEach(function (c) { c.classList.remove('active'); });
                const tbody = document.getElementById('tbl_administrar_pedidos');
                if (tbody) tbody.innerHTML = `
                <tr><td colspan="25" class="text-center" style="padding:50px;color:var(--slate-400);">
                    <i class="bi bi-inbox" style="font-size:2rem;display:block;margin-bottom:8px;"></i>
                    Filtros limpiados — realice una nueva consulta
                </td></tr>`;
                const badge = document.getElementById('badge-total-tabla');
                if (badge) badge.textContent = '0 registros';
                const pagBar = document.getElementById('pagination-bar');
                if (pagBar) pagBar.style.display = 'none';
                sessionStorage.removeItem('carrito');
                actualizarContadorCarrito();
                // Resetear KPIs a 0
                ['kpi-total', 'kpi-pendiente', 'kpi-publicado', 'kpi-asignado', 'kpi-cancelado'].forEach(function (id) {
                    const el = document.getElementById(id); if (el) el.textContent = '0';
                });
            });
        }

        // Evento para seleccionar/deseleccionar todos los checkboxes
        $('#selectAll').on('change', function () {
            let isChecked = $(this).prop('checked');
            $('.pedido-checkbox').prop('checked', isChecked);
            let carrito = isChecked ? obtenerTodosLosPedidos() : [];
            sessionStorage.setItem('carrito', JSON.stringify(carrito));
            actualizarContadorCarrito();
        });

        $(document).on('change', '.pedido-checkbox', function () {
            let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

            // Modalidad del pedido actual que se intenta seleccionar
            let modalidadActual = $(this).data('id15');

            // Verificar si ya hay elementos seleccionados con modalidad diferente
            let modalidadesEnCarrito = carrito.map((item) => item.dataId15);
            let modalidadesUnicas = [...new Set(modalidadesEnCarrito)];

            // Si ya hay modalidad en el carrito y es distinta, no permitir la selección
            if ($(this).prop('checked') && modalidadesUnicas.length > 0 && !modalidadesUnicas.includes(modalidadActual)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Modalidades diferentes',
                    text: 'No puedes seleccionar pedidos con diferentes modalidades.',
                });

                $(this).prop('checked', false); // Desmarcar
                return; // Salir de la función
            }

            let pedido = {
                id: $(this).val(),
                dataId: $(this).data('id'),
                dataId2: $(this).data('id2'),
                dataId3: $(this).data('id3'),
                dataId4: $(this).data('id4'),
                dataId5: $(this).data('id5'),
                dataId6: $(this).data('id6'),
                dataId7: $(this).data('id7'),
                dataId8: $(this).data('id8'),
                dataId9: $(this).data('id9'),
                dataId10: $(this).data('id10'),
                dataId11: $(this).data('id11'),
                dataId12: $(this).data('id12'),
                dataId13: $(this).data('id13'),
                dataId14: $(this).data('id14'),
                dataId15: modalidadActual,
            };

            if ($(this).prop('checked')) {
                if (!carrito.some((item) => item.id === pedido.id)) {
                    carrito.push(pedido);
                }
            } else {
                carrito = carrito.filter((item) => item.id !== pedido.id);
            }

            // ✅ RESALTAR FILA AL SELECCIONAR
            let rowId = $(this).data('row');
            let row = document.getElementById(rowId);
            if (row) {
                row.style.backgroundColor = $(this).is(':checked') ? '#d8ddf9' : '';
            }

            $('#selectAll').prop('checked', $('.pedido-checkbox:checked').length === $('.pedido-checkbox').length);
            sessionStorage.setItem('carrito', JSON.stringify(carrito));

            let btnCarrito = document.getElementById('btn-carrito-pedidos');
            if (btnCarrito) {
                btnCarrito.style.display = carrito.length > 0 ? '' : 'none';
                // btnCarrito.style.display = carrito.length > 0 ? 'block' : 'none';
                btnCarrito.setAttribute('data-idPedido', pedido.id);
                btnCarrito.setAttribute('data-idCliente', pedido.dataId14);
            }
            actualizarContadorCarrito();
        });

        document.addEventListener('input', async (e) => {
            if (e.target.matches(`#campo-${window.VENTANA}-filtro`) || e.target.matches(`#campo-${window.VENTANA}-filtro *`)) {
                let filtro = document.getElementById(`campo-${window.VENTANA}-filtro`).value.trim();
                let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
                let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
                listar_pedidos_administrador(fecha_inicial, fecha_final, filtro, '', '', '');
            }
        });

        //boton de excel
        document.getElementById('exportar_excel').addEventListener('click', function () {
            var table = document.getElementById('table1');
            var wb = XLSX.utils.table_to_book(table);
            // Crear contenido de archivo con fecha
            // var fecha = new Date();
            Array.from(table.getElementsByTagName('td')).forEach(function (td) {
                const text = td.innerText.trim();

                // Detectar valores con $ o formatos de fecha ISO
                const esFecha = /^\d{4}-\d{2}-\d{2}$/.test(text); // Formato YYYY-MM-DD

                if (esFecha) {
                    td.setAttribute('data-t', 's'); // Marcar como texto para Excel
                }
            });
            const fechaActual = new Date().toISOString().slice(0, 10);
            const nombreArchivo = `Informe de Pedidos ${fechaActual}.xlsx`; //'Informe Remesas_${fecha.toISOString()}.xlsx '
            XLSX.writeFile(wb, nombreArchivo);
        });
    };

    /* ─────────────────────────────────────────────────────────────────
       ocToggle  — abre/cierra paneles del offcanvas de orden de carga
       Uso en el HTML:
         onclick="ocToggle('ocPanelOrigen','ocBtnOrigen','CARGUE')"
       El panel debe tener el data-pedido-id con el ID del pedido:
         <div class="oc-sec-panel" id="ocPanelOrigen" data-pedido-id="123">
    ───────────────────────────────────────────────────────────────── */
    function ocToggle(panelId, btnId, operacion) {
        const panel = document.getElementById(panelId);
        const btn = document.getElementById(btnId);
        const isOpen = panel.classList.contains('open');

        // Cierra todos los paneles
        document.querySelectorAll('.oc-sec-panel').forEach(p => p.classList.remove('open'));
        document.querySelectorAll('.oc-tl-expand-btn').forEach(b =>
            b.innerHTML = '<i class="bi bi-chevron-down me-1"></i>Detalle'
        );

        if (!isOpen) {
            panel.classList.add('open');
            btn.innerHTML = '<i class="bi bi-chevron-up me-1"></i>Ocultar';

            // Lee el ID del pedido desde el atributo data del panel
            const pedidoId = panel.dataset.pedidoId;
            if (pedidoId) {
                cargarTareasOC(pedidoId, operacion, panelId);
            } else {
                console.warn('⚠️ ocToggle: el panel no tiene data-pedido-id');
            }

            setTimeout(() => {
                panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 60);
        }
    }

    /* ─────────────────────────────────────────────────────────────────
       cargarTareasOC  — GET vía FormData al endpoint existente
       Endpoint esperado:  torrecontrol/Listar_tareas_oc
       Parámetros POST:    PedidoId, Operacion
    ───────────────────────────────────────────────────────────────── */
    async function cargarTareasOC(pedidoId, operacion, panelId) {
        const panel = document.getElementById(panelId);
        if (!panel) return;

        // ── Spinner SOLO en col-lg-7, no tocar col-lg-5 ──
        const subtlEl = panel.querySelector('.col-lg-7 .oc-sub-tl');
        const microEl = panel.querySelector('.oc-micro');
        const contenedorTabla = document.getElementById(`tabla-tiempos-${operacion}`);

        if (subtlEl) subtlEl.innerHTML = `
        <div class="text-center py-3" style="color:#94a3b8;font-size:12px">
            <i class="bi bi-arrow-repeat me-1"></i>Cargando tareas…
        </div>`;

        try {
            const baseUrl = document.getElementById('base_url_api').value;
            const formData = new FormData();
            formData.append('PedidoId', pedidoId);
            formData.append('Operacion', operacion);

            const response = await fetch(baseUrl + 'Listar_tareas_oc', {
                method: 'POST',
                headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
                body: formData,
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const json = await response.json();

            if (json.numero !== 200) {
                if (subtlEl) subtlEl.innerHTML = `
                <div class="text-center py-3" style="color:#94a3b8;font-size:12px">
                    ${json.mensaje}
                </div>`;
                return;
            }

            const tareas = json.data;

            if (Array.isArray(tareas) && tareas.length > 0) {

                // Calcular tiempos
                const tareasConTiempos = calcularTiempos(tareas, window._tlFechaCargue);

                // Renderizar izquierda (micro + sub-tl) sin tocar col-lg-5
                renderTareasOC(panel, tareasConTiempos, pedidoId, operacion);

                // Renderizar tabla derecha
                const tituloMapa = {
                    'CARGUE': 'Planta Origen',
                    'DESCARGUE': 'Planta Destino',
                    'TRANSITO': 'Tránsito',
                };
                renderTablaResumen(
                    contenedorTabla,
                    tareasConTiempos,
                    tituloMapa[operacion] ?? operacion
                );

            } else {
                if (subtlEl) subtlEl.innerHTML = `
                <div class="text-center py-3" style="color:#94a3b8;font-size:12px">
                    <i class="bi bi-inbox me-1"></i>Sin tareas registradas para esta operación.
                </div>`;
                if (contenedorTabla) contenedorTabla.innerHTML = `
                <div class="text-center py-3" style="color:#94a3b8;font-size:12px">
                    Sin datos disponibles
                </div>`;
            }

        } catch (error) {
            console.error('❌ cargarTareasOC:', error);
            if (subtlEl) subtlEl.innerHTML = `
            <div style="padding:.8rem;color:#ef4444;font-size:12px">
                <i class="bi bi-exclamation-triangle me-1"></i>
                Error al cargar tareas: ${error.message}
            </div>`;
        }
    }

    /* ─────────────────────────────────────────────────────────────────
        renderTareasOC  — construye el HTML del panel con los datos
    ───────────────────────────────────────────────────────────────── */

    function renderTareasOC(panel, tareas, pedidoId, operacion) {
        const micropasos = tareas.map(t => `
            <div class="oc-micro-step ${t.estado === 'COMPLETADO' ? 'oc-ms-done' :
                t.estado === 'EN GESTION' ? 'oc-ms-active' : ''
            }">${t.nombre.split(' ')[0]}  </div>
        `).join('');

        const subItems = tareas.map(t => _buildSubItem(t, pedidoId, operacion)).join('');

        // ✅ Actualiza solo micro y sub-tl — NO toca col-lg-5
        const microEl = panel.querySelector('.oc-micro');
        const subtlEl = panel.querySelector('.col-lg-7 .oc-sub-tl');

        if (microEl) microEl.innerHTML = micropasos;
        if (subtlEl) subtlEl.innerHTML = subItems;
    }

    /* ─────────────────────────────────────────────────────────────────
       completarTareaOC  — POST para marcar una tarea como completada
       Endpoint esperado:  torrecontrol/Completar_tarea_oc
       Parámetros POST:    TareaId, PedidoId, Estado
    ───────────────────────────────────────────────────────────────── */
    async function completarTareaOC(tareaId, pedidoId, nuevoEstado, operacion, panelId) {
        try {
            const baseUrl = document.getElementById('base_url_api').value;

            const formData = new FormData();
            formData.append('TareaId', tareaId);
            formData.append('PedidoId', pedidoId);
            formData.append('Estado', nuevoEstado);
            formData.append('Operacion', operacion);

            const response = await fetch(baseUrl + 'torrecontrol/Completar_tarea_oc', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();

            if (data.success) {
                // Recarga el panel para reflejar el nuevo estado
                await cargarTareasOC(pedidoId, operacion, panelId);
            } else {
                alert('No se pudo actualizar la tarea: ' + (data.message || 'Error desconocido'));
            }

        } catch (error) {
            console.error('❌ completarTareaOC:', error);
            alert('Error al completar tarea: ' + error.message);
        }
    }

    /* ─────────────────────────────────────────────────────────────────
       _buildSubItem  — HTML de un ítem de la línea de tiempo
    ───────────────────────────────────────────────────────────────── */
    function _buildSubItem(t, pedidoId, operacion) {

        // ── Mapas por estado real de la actividad ──────────────
        const iconMap = {
            'EN GESTION': 'bi-arrow-repeat',
            'SIN INICIAR': 'bi-clock',
            'COMPLETADO': 'bi-check-lg',
            'CANCELADO': 'bi-x-lg',
            'PAUSADO': 'bi-pause-circle',
        };

        const badgeMap = {
            'EN GESTION': 'oc-sub-badge-active',
            'SIN INICIAR': 'oc-sub-badge-pending',
            'COMPLETADO': 'oc-sub-badge-done',
            'CANCELADO': 'oc-sub-badge-pending',
            'PAUSADO': 'oc-sub-badge-pending',
        };

        const badgeLabel = {
            'EN GESTION': 'EN GESTIÓN',
            'SIN INICIAR': 'SIN INICIAR',
            'COMPLETADO': 'COMPLETADO',
            'CANCELADO': 'CANCELADO',
            'PAUSADO': 'PAUSADO',
        };

        // Clase CSS del nodo visual (usa las clases existentes del offcanvas)
        const nodoClase = {
            'EN GESTION': 'active',
            'SIN INICIAR': 'pending',
            'COMPLETADO': 'done',
            'CANCELADO': 'risk',
            'PAUSADO': 'pending',
        }[t.estado] ?? 'pending';

        // ── Tiempos ────────────────────────────────────────────
        let tiempos = '';
        if (t._tiempos) {
            const { fechaInicioCalc, fechaReal, textoAsignado, textoTranscurrido, alDia, pct } = t._tiempos;

            // Badge de tiempo: color según estado y avance
            let badgeColor, badgeText;
            if (t.estado === 'COMPLETADO') {
                badgeColor = '#16a34a'; badgeText = textoAsignado;
            } else if (!alDia) {
                badgeColor = '#dc2626'; badgeText = textoTranscurrido;
            } else if (pct >= 80) {
                badgeColor = '#f59e0b'; badgeText = textoTranscurrido;
            } else {
                badgeColor = '#0369a1'; badgeText = textoAsignado;
            }

            const badgeHtml = `<span style="
                font-size:8px;font-weight:700;letter-spacing:.5px;font-family:'JetBrains Mono',monospace;
                padding:1px 6px;border-radius:8px;
                background:${badgeColor}18;color:${badgeColor};border:1px solid ${badgeColor}40;
                white-space:nowrap">⏱ ${badgeText}</span>`;

            const progHtml = fechaInicioCalc
                ? `<span class="oc-sub-time">Prog: ${fechaInicioCalc}</span>`
                : '';
            // Real: fecha real de inicio del servidor
            const realHtml = fechaReal
                ? `<span class="oc-sub-time">Real: ${fechaReal}</span>`
                : '';

            tiempos = [progHtml, realHtml, badgeHtml].filter(Boolean).join('');
        } else {
            // Fallback: usar tiempos del servidor si no hay _tiempos calculados
            const parts = [
                t.tiempo_programado ? `<span class="oc-sub-time">Prog: ${t.tiempo_programado}</span>` : '',
                t.tiempo_real ? `<span class="oc-sub-time">Real: ${t.tiempo_real}</span>` : '',
                t.delta ? `<span class="d ${t.delta_pos ? 'd-pos' : 'd-neg'}">${t.delta}</span>` : '',
            ].filter(Boolean);
            tiempos = parts.join('');
        }

        // ── Botón completar (solo EN GESTION) ─────────────────
        const btnCompletar = t.estado === 'EN GESTION'
            ? ``
            //     ? `<button
            //        class="btn btn-sm btn-outline-success ms-2"
            //        style="font-size:10px;padding:2px 8px"
            //        onclick="completarTareaOC(${t.id}, ${pedidoId}, 'done', '${operacion}', '${_panelIdDesdeOperacion(operacion)}')">
            //        <i class="bi bi-check2 me-1"></i>Completar
            //    </button>`
            : '';

        // ── Gestiones ──────────────────────────────────────────
        let gestionesHtml = '';

        if (Array.isArray(t.gestiones) && t.gestiones.length > 0) {

            const dotColorMap = {
                'ACTIVO': '#0369a1',
                'EN GESTION': '#ea580c',
                'SIN INICIAR': '#94a3b8',
                'COMPLETADO': '#16a34a',
                'CANCELADO': '#dc2626',
                'PAUSADO': '#f59e0b',
            };

            const items = t.gestiones.map(g => {

                const dotColor = dotColorMap[g.estado] ?? '#94a3b8';

                const estadoBadge = `<span style="
                font-size:8px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;
                padding:1px 5px;border-radius:5px;margin-left:4px;
                background:${dotColor}18;color:${dotColor};border:1px solid ${dotColor}40
            ">${g.estado ?? ''}</span>`;

                // Enlace solo si tiene documento Y nombre_archivo real
                const docHtml = (g.documento && g.nombre_archivo && g.nombre_archivo !== 'Sin_evidencia')
                    ? `<a href="${$("#base_url").val()}${g.documento}${g.nombre_archivo}" target="_blank" class="oc-gestion-doc">
                       <i class="bi bi-file-earmark-arrow-down"></i>${g.nombre_archivo}
                   </a>`
                    : '';

                return `
            <div class="oc-ev">
                <div class="oc-ev-dot" style="background:${dotColor}"></div>
                <div style="min-width:0">
                    <div class="oc-ev-time">
                        ${g.fecha ?? '—'} · ${g.usuario ?? '—'}${estadoBadge}
                    </div>
                    <div class="oc-ev-label">${g.observacion ?? '—'}</div>
                    ${docHtml}
                </div>
            </div>`;
            }).join('');

            gestionesHtml = `
        <div class="oc-gestion-wrap">
            <div class="oc-gestion-header">
                <i class="bi bi-journal-text me-1"></i>Gestiones (${t.gestiones.length})
            </div>
            ${items}
        </div>`;
        }

        return `
            <div class="oc-sub-item">
                <div class="oc-sub-node ${nodoClase}">
                    <i class="bi ${iconMap[t.estado] || 'bi-clock'}"></i>
                </div>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start gap-1 flex-wrap">
                        <span class="oc-sub-label">${t.nombre}</span>
                        <div class="d-flex align-items-center flex-wrap gap-1">
                            <span class="oc-sub-badge ${badgeMap[t.estado] ?? 'oc-sub-badge-pending'}">
                                ${badgeLabel[t.estado] ?? t.estado}
                            </span>
                            ${btnCompletar}
                        </div>
                    </div>
                    ${t.meta ? `<div class="oc-sub-meta">${t.meta}</div>` : ''}
                    ${tiempos ? `<div class="d-flex gap-2 mt-1 flex-wrap">${tiempos}</div>` : ''}
                    ${gestionesHtml}
                </div>
            </div>`;
    }

    /* ─────────────────────────────────────────────────────────────────
       _panelIdDesdeOperacion  — mapea operacion → ID del panel
       Ajusta según los IDs reales de tus paneles en el .phtml
    ───────────────────────────────────────────────────────────────── */
    function _panelIdDesdeOperacion(operacion) {
        const mapa = {
            'CARGUE': 'ocPanelOrigen',
            'TRANSITO': 'ocPanelTransito',
            'DESCARGUE': 'ocPanelDestino',
        };
        return mapa[operacion] || 'ocPanelOrigen';
    }

    /* ── Map buttons ── */
    function ocMapMode(mode, el) {
        document.querySelectorAll('.oc-map-btn').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
        // Cuando integres Maps JS API: map.setMapTypeId(mode);
    }

    function ocCenter() {
        const btn = document.getElementById('ocBtnCenter');
        btn.innerHTML = '<i class="bi bi-check-lg"></i> Centrado';
        setTimeout(() => { btn.innerHTML = '<i class="bi bi-crosshair"></i> Centrar'; }, 1500);
        // Cuando integres Maps JS API: map.panTo(vehicleMarker.getPosition());
    }

    async function listar_pedidos_administrador(fecha_inicial, fecha_final, filtro, valor, trazabilidad, identificador) {
        /* Funcion para enviar los datos */
        let dato = new FormData();
        dato.append('fecha_inicial', fecha_inicial);
        dato.append('fecha_final', fecha_final);
        // dato.append('filtro', filtro ? filtro : document.getElementById(`campo-${window.VENTANA}-filtros`).value.trim());
        dato.append('filtro', filtro);
        dato.append('valor', valor);
        dato.append('trazabilidad', trazabilidad);
        dato.append('identificador', identificador);
        // dato.append('proceso_filtro', proceso_filtro);
        // dato.append('filtros', document.getElementById(`campo-${window.VENTANA}-filtros`).value);
        dato.append('filtros', '');
        try {
            const response = await fetch($('#base_url').val() + 'torrecontrol/listar_administracion_pedidos', {
                method: 'POST',
                body: dato,
                cache: 'no-cache',
            });
            const data = await response.json();
            if (data) {
                let tbody = document.getElementById('tbl_administrar_pedidos');
                tbody.innerHTML = '';
                let col_estatus_publicacion = '';
                let col_estatus_asignacion = '';
                let btn_publicacion = '';
                let btn_cancelacion = '';
                let col_prioridad = '';
                let btn_removeAsignacion = '';
                let checkbox_carrito = '';
                let col_estatus_proceso = '';
                let col_estatus_trazabilidad = '';
                let btn_detalle_proceso = '';
                let btn_detalle_trazabilidad = '';
                let btn_trazabilidad_pedido = '';
                let btn_prioridad = '';

                data.forEach((element) => {
                    const fila = document.createElement('tr');
                    fila.id = `fila_${element.numdoc_solicitud}`;
                    // Publicación
                    if (estadosPublicacion[element.estado_publicaion]) {
                        col_estatus_publicacion = createBadge(element.estado_publicaion, estadosPublicacion[element.estado_publicaion]);
                    }

                    // Asignación
                    if (estadosAsignacion[element.estado_asignacion]) {
                        col_estatus_asignacion = createBadge(element.estado_asignacion, estadosAsignacion[element.estado_asignacion]);
                    }

                    // Prioridad
                    if (estadosPrioridad[element.estado_prioridad]) {
                        col_prioridad = createBadge(element.estado_prioridad, estadosPrioridad[element.estado_prioridad]);
                    }

                    // Botones y checkbox según combinación de estado
                    const estadoPublicacion = element.estado_publicaion;
                    const estadoAsignacion = element.estado_asignacion;

                    if (estadoPublicacion === 'Publicado' && estadoAsignacion === 'Asignado') {
                        checkbox_carrito = ``;
                        btn_removeAsignacion = ``;
                        btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
                        btn_prioridad = `<a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"> <span class="uil uil-bell"></span> Marcar como Prioridad</a>`;
                    } else if (estadoPublicacion === 'Publicado' && estadoAsignacion === 'Pendiente') {
                        checkbox_carrito = ``;
                        btn_removeAsignacion = ``;
                        btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
                        btn_prioridad = `<a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"> <span class="uil uil-bell"></span> Marcar como Prioridad</a>`;
                    } else if (
                        (estadoPublicacion === 'Pendiente Respuesta' && estadoAsignacion === 'Pendiente') ||
                        (estadoPublicacion === 'Aceptado' && estadoAsignacion === 'Ganador') ||
                        (estadoPublicacion === 'Completado' && estadoAsignacion === 'Completado')
                    ) {
                        // No mostrar botones ni checkbox
                        checkbox_carrito = ``;
                        btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
                    } else {
                        btn_detalle_proceso = ``;
                        // btn_detalle_trazabilidad = ``;
                        btn_removeAsignacion = ``;
                        // btn_trazabilidad_pedido = ``;
                        btn_prioridad = `<a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"> <span class="uil uil-bell"></span> Marcar como Prioridad</a>`;
                        // Mostrar botones de cancelación y checkbox
                        if (element.estado_publicaion === 'Cancelado' && element.estado_asignacion === 'Cancelado') {
                            btn_cancelacion = ``;
                        } else {
                            btn_cancelacion = `
                        <a class="dropdown-item fw-bold" href="#" id="btn_cancelar_pedido"
                          data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}">
                          <span class="uil uil-x"></span> Cancelar Pedido
                        </a>`;
                        }

                        checkbox_carrito = `
                        <input class="form-check-input pedido-checkbox" id="check_pedido_${element.numdoc_solicitud}"
                            type="checkbox" value="${element.numdoc_solicitud}"
                            data-id="${element.nombre_cliente}" data-id2="${element.ciudad_origen}" data-id3="${element.ciudad_destino}"
                            data-id4="${element.referencia_pedido}" data-id5="${element.fecha_cargue}" data-id6="${element.fecha_entrega}"
                            data-id7="${element.unidades}" data-id8="${element.lote}" data-id9="${element.num_estibas}"
                            data-id10="${element.peso_neto_kg}" data-id11="${element.peso_bruto_kg}"
                            data-id12="${element.producto}" data-id13="${element.presentacion}" data-id14="${element.cliente}" data-id15="${element.modalidad}"
                            style="scale: 1.2;" data-row="fila_${element.numdoc_solicitud}">
                        `;
                    }

                    //Estado proceso
                    if (estadosProceso[element.estado_proceso]) {
                        if (element.estado_publicaion === 'Cancelado' && element.estado_asignacion === 'Cancelado') {
                            col_estatus_proceso = createBadge('Cancelado', 'danger');
                            checkbox_carrito = ``;
                            btn_prioridad = ``;
                            btn_detalle_proceso = ``;
                            // btn_detalle_trazabilidad = ``;
                            btn_removeAsignacion = ``;
                            // btn_trazabilidad_pedido = ``;
                            btn_publicacion = ``;
                        } else {
                            col_estatus_proceso = createBadge(element.estado_proceso, estadosProceso[element.estado_proceso]);
                        }
                    }

                    //Estado de la trazabiliidad
                    if (element.tipo_trazabilidad === 'Completado' || (element.tipo_trazabilidad === 'Iniciado' && element.estado_proceso_pedido === 'Completado')) {
                        btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
                    } else if (element.tipo_trazabilidad === 'Pendiente Iniciar' || element.tipo_trazabilidad === 'Sin Asignar') {
                        btn_detalle_trazabilidad = ``;
                    } else {
                        // btn_detalle_trazabilidad = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}"><span class="uil uil-transaction"></span> Detalle trazabilidad</a>`;
                        // btn_trazabilidad_pedido = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad_pedido" data-id="${element.numdoc_solicitud}"><span class="uil-wrap-text"></span> Trazabilidad pedido</a>`;
                    }

                    /* Validar si el pedido ya tuvo una postulacion */
                    if (element.tipo_trazabilidad === 'Iniciado' && element.estado_proceso_pedido === 'Postulado') {
                        // Estado de la trazabilidad
                        const estado = obtenerEstadoTrazabilidad(element.estado_proceso_pedido);
                        col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
                    } else {
                        // Estado de la trazabilidad
                        const estado = obtenerEstadoTrazabilidad(element.tipo_trazabilidad);
                        col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
                    }

                    const columnaNundocSolicitud = document.createElement('td');
                    columnaNundocSolicitud.innerHTML = `
                        <div class="dropdown">
                            <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none menu_tabla" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-row-id="${fila.id}"> N°${element.referencia_pedido}</a>
                            <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
                            ${btn_detalle_proceso}
                            ${btn_removeAsignacion}
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item fw-bold" href="#" id="btn_detalle" data-SolicitudId="${element.numdoc_solicitud}" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}"><span class="uil uil-transaction"></span> Trazabilidad</a>
                            <a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad_pedidos" data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasPedido" style="font-family:'Space Grotesk',sans-serif;font-weight:600" data-SolicitudId="${element.numdoc_solicitud}" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}" data-latitud_origen="${element.latitud_origen}"
                                data-longitud_origen="${element.longitud_origen}" data-latitud_destino="${element.latitud_destino}" data-longitud_destino="${element.longitud_destino}" data-ciudad_origen="${element.ciudad_origen}" data-ciudad_destino="${element.ciudad_destino}" 
                                data-refPedido="${element.referencia_pedido}" data-fecha_creacion="${element.fecha} ${element.hora}" data-fecha_cargue="${element.fecha_cargue}" data-fecha_entrega="${element.fecha_entrega}" data-placa="${element.referencia}" data-tipo_trazabilidad="${element.tipo_trazabilidad}">
                                <span class="uil uil-transaction"></span> Trazabilidad Pedidos
                            </a>
                            ${btn_cancelacion}
                            ${btn_prioridad}
                            </div>
                        </div>
                    `;

                    const columnaCheckPedido = document.createElement('td');
                    columnaCheckPedido.innerHTML = checkbox_carrito;
                    columnaCheckPedido.style.width = 'auto';
                    columnaCheckPedido.style.whiteSpace = 'nowrap';
                    columnaCheckPedido.style.textAlign = 'center';

                    const columnaModalidadPedido = document.createElement('td');
                    columnaModalidadPedido.innerHTML = element.modalidad;
                    columnaModalidadPedido.style.width = 'auto';
                    columnaModalidadPedido.style.whiteSpace = 'nowrap';
                    columnaModalidadPedido.style.textAlign = 'center';

                    const columnaCiudadOrigen = document.createElement('td');
                    columnaCiudadOrigen.innerHTML = element.ciudad_origen;
                    columnaCiudadOrigen.style.width = 'auto';
                    columnaCiudadOrigen.style.whiteSpace = 'nowrap';

                    const columnaRemitente = document.createElement('td');
                    columnaRemitente.innerHTML = element.remitente;
                    columnaRemitente.style.width = 'auto';
                    columnaRemitente.style.whiteSpace = 'nowrap';
                    const columnaCiudadDestino = document.createElement('td');
                    columnaCiudadDestino.innerHTML = element.ciudad_destino;
                    columnaCiudadDestino.style.width = 'auto';
                    columnaCiudadDestino.style.whiteSpace = 'nowrap';
                    const columnaSitioDescargue = document.createElement('td');

                    columnaSitioDescargue.innerHTML = element.destinatario;
                    const columnaCodigoProducto = document.createElement('td');
                    columnaCodigoProducto.innerHTML = element.cod_producto;
                    columnaSitioDescargue.style.width = 'auto';
                    columnaSitioDescargue.style.whiteSpace = 'nowrap';

                    const columnaProducto = document.createElement('td');
                    columnaProducto.innerHTML = element.producto;
                    columnaProducto.style.width = 'auto';
                    columnaProducto.style.whiteSpace = 'nowrap';

                    const columnaPesoNeto = document.createElement('td');
                    columnaPesoNeto.innerHTML = element.peso_neto_kg + ' KG';
                    columnaPesoNeto.style.width = 'auto';
                    columnaPesoNeto.style.whiteSpace = 'nowrap';
                    const columnaPesoBruto = document.createElement('td');
                    columnaPesoBruto.innerHTML = element.peso_bruto_kg + ' KG';
                    columnaPesoBruto.style.width = 'auto';
                    columnaPesoBruto.style.whiteSpace = 'nowrap';

                    const columnaPresentacion = document.createElement('td');
                    columnaPresentacion.innerHTML = element.presentacion;
                    columnaPresentacion.style.width = 'auto';
                    columnaPresentacion.style.whiteSpace = 'nowrap';

                    const columnaUnidades = document.createElement('td');
                    columnaUnidades.innerHTML = element.unidades;
                    columnaUnidades.style.width = 'auto';
                    columnaUnidades.style.whiteSpace = 'nowrap';

                    const columnaLote = document.createElement('td');
                    columnaLote.innerHTML = element.lote;
                    columnaLote.style.width = 'auto';
                    columnaLote.style.whiteSpace = 'nowrap';

                    const columnaEstibas = document.createElement('td');
                    columnaEstibas.innerHTML = element.num_estibas;
                    columnaEstibas.style.width = 'auto';
                    columnaEstibas.style.whiteSpace = 'nowrap';

                    const columnaFechaCargue = document.createElement('td');
                    columnaFechaCargue.innerHTML = element.fecha_cargue;
                    columnaFechaCargue.style.width = 'auto';
                    columnaFechaCargue.style.whiteSpace = 'nowrap';

                    const columnaFechaEntrega = document.createElement('td');
                    columnaFechaEntrega.innerHTML = element.fecha_entrega;
                    columnaFechaEntrega.style.width = 'auto';
                    columnaFechaEntrega.style.whiteSpace = 'nowrap';

                    const columnaEstadoPedido = document.createElement('td');
                    columnaEstadoPedido.innerHTML = col_estatus_trazabilidad;
                    columnaEstadoPedido.style.width = 'auto';
                    columnaEstadoPedido.style.whiteSpace = 'nowrap';

                    const columnaTipoVehiculo = document.createElement('td');
                    columnaTipoVehiculo.innerHTML = element.tipo_vehiculo ? element.tipo_vehiculo : '-';
                    columnaTipoVehiculo.style.width = 'auto';
                    columnaTipoVehiculo.style.whiteSpace = 'nowrap';

                    const columnaCosto = document.createElement('td');
                    columnaCosto.innerHTML = element.costo ? element.costo : '-';
                    columnaCosto.style.width = 'auto';
                    columnaCosto.style.whiteSpace = 'nowrap';

                    const columnaTarifa = document.createElement('td');
                    columnaTarifa.innerHTML = element.tarifa ? element.tarifa : '-';
                    columnaTarifa.style.width = 'auto';
                    columnaTarifa.style.whiteSpace = 'nowrap';

                    const columnaFechaRetiroContenedor = document.createElement('td');
                    columnaFechaRetiroContenedor.innerHTML = element.fecha_retiro_contenedor ? element.fecha_retiro_contenedor : '-';
                    columnaFechaRetiroContenedor.style.width = 'auto';
                    columnaFechaRetiroContenedor.style.whiteSpace = 'nowrap';

                    const columnaBooking = document.createElement('td');
                    columnaBooking.innerHTML = element.booking ? element.booking : '-';
                    columnaBooking.style.width = 'auto';
                    columnaBooking.style.whiteSpace = 'nowrap';

                    const columnaUnidadTransporte = document.createElement('td');
                    columnaUnidadTransporte.innerHTML = element.unidad_transporte ? element.unidad_transporte : '-';
                    columnaUnidadTransporte.style.width = 'auto';
                    columnaUnidadTransporte.style.whiteSpace = 'nowrap';

                    const columnaObservaciones = document.createElement('td');
                    columnaObservaciones.innerHTML = element.observaciones ? element.observaciones : '-';
                    columnaObservaciones.style.width = 'auto';
                    columnaObservaciones.style.whiteSpace = 'nowrap';

                    fila.appendChild(columnaCheckPedido);
                    fila.appendChild(columnaModalidadPedido);
                    fila.appendChild(columnaNundocSolicitud);
                    fila.appendChild(columnaEstadoPedido);
                    fila.appendChild(columnaCiudadOrigen);
                    fila.appendChild(columnaRemitente);
                    fila.appendChild(columnaCiudadDestino);
                    fila.appendChild(columnaSitioDescargue);
                    fila.appendChild(columnaCodigoProducto);
                    fila.appendChild(columnaProducto);
                    fila.appendChild(columnaPesoNeto);
                    fila.appendChild(columnaPesoBruto);
                    fila.appendChild(columnaPresentacion);
                    fila.appendChild(columnaUnidades);
                    fila.appendChild(columnaLote);
                    fila.appendChild(columnaEstibas);
                    fila.appendChild(columnaFechaCargue);
                    fila.appendChild(columnaFechaEntrega);
                    fila.appendChild(columnaTipoVehiculo);
                    fila.appendChild(columnaCosto);
                    fila.appendChild(columnaTarifa);
                    fila.appendChild(columnaFechaRetiroContenedor);
                    fila.appendChild(columnaBooking);
                    fila.appendChild(columnaUnidadTransporte);
                    fila.appendChild(columnaObservaciones);

                    tbody.appendChild(fila);
                });

                // Agrega este código después de crear todas las filas (fuera del forEach pero dentro del if(data))
                document.querySelectorAll('.menu_tabla').forEach((toggle) => {
                    toggle.addEventListener('click', function () {
                        const rowId = this.getAttribute('data-row-id');
                        const row = document.getElementById(rowId);
                        document.querySelectorAll('tr').forEach((r) => r.classList.remove('selected-row'));
                        if (row) row.classList.add('selected-row');
                    });
                });

                // ── Actualizar KPI cards ──
                actualizarKpis(data);

                // ── Badge total tabla ──
                const badgeTabla = document.getElementById('badge-total-tabla');
                if (badgeTabla) badgeTabla.textContent = data.length + ' registros';

                // ── Paginación simple (informativa) ──
                const pagBar = document.getElementById('pagination-bar');
                if (pagBar) {
                    pagBar.style.display = '';
                    const setEl = (id, v) => { const n = document.getElementById(id); if (n) n.textContent = v; };
                    setEl('pag-total', data.length);
                    setEl('pag-desde', data.length > 0 ? 1 : 0);
                    setEl('pag-hasta', data.length);
                }

            } else {
                console.log('else');
            }
        } catch (error) {
            console.error('Error en la primera solicitud:', error);
            console.log('error no inserta');
            throw error;
        } finally {
            // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
        }
    }

    // Función para crear badge
    function createBadge(text, type) {
        return `
        <span class="badge badge-phoenix fs-10 badge-phoenix-${type}">
        <span class="badge-label">${text}</span>
        <span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span>
        </span>`;
    }

    // --- Estados de Publicación ---
    window.estadosPublicacion = {
        Pendiente: 'secondary',
        Publicado: 'info',
        Cancelado: 'secondary',
        Aceptado: 'success',
        'Pendiente Respuesta': 'warning',
        Completado: 'success',
    };

    // --- Estados de Asignación ---
    window.estadosAsignacion = {
        Pendiente: 'secondary',
        Asignado: 'info',
        Cancelado: 'secondary',
        Aceptado: 'success',
        Ganador: 'success',
        Completado: 'success',
    };

    // --- Estados de Prioridad ---
    window.estadosPrioridad = {
        Prioritaria: 'warning',
        'No Marcada': 'info',
    };

    // --- Estados del Proceso ---
    window.estadosProceso = {
        Pendiente: 'secondary',
        Asignación: 'warning',
        Publicación: 'danger',
        Completado: 'success',
    };

    function obtenerEstadoTrazabilidad(tipoTrazabilidad) {
        let textoTrazabilidad = tipoTrazabilidad;

        // Si viene "Completado", lo cambiamos a "Asignado"
        if (tipoTrazabilidad === 'Completado') {
            textoTrazabilidad = 'Asignado';
        } else if (tipoTrazabilidad === 'Cancelado' || tipoTrazabilidad === 'Rechzado') {
            textoTrazabilidad = 'Sin Asignar';
        }

        // Devolvemos el texto corregido y el color
        return {
            texto: textoTrazabilidad,
            color: window.estadosTrazabilidad[textoTrazabilidad] || 'secondary',
        };
    }

    window.estadosTrazabilidad = {
        'Llegada Cargue': 'info',
        Cargue: 'info',
        'Salida Cargue': 'info',
        'Inicio Ruta': 'primary',
        Transito: 'primary',
        'Llegada Descargue': 'info',
        Descargue: 'info',
        'Salida Descargue': 'info',
        'Pendiente Iniciar': 'danger',
        'Sin Asignar': 'secondary',
        Iniciado: 'primary',
        Asignado: 'success',
        Postulado: 'warning',
        Cancelado: 'danger',
    };

    // Agrega esto al final de tu archivo JavaScript o en tu CSS
    window.style = document.createElement('style');
    style.textContent = `
    .selected-row {
        background-color: #d8ddf9 !important;
        /*box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);*/
    }
    `;
    document.head.appendChild(style);

    async function cargarLineaTiempo(PedidoId) {
        try {
            let formData = new FormData();
            formData.append('PedidoId', PedidoId);

            let response = await fetch($('#base_url').val() + 'torrecontrol/Linea_Tiempo_pedidos', {
                method: 'POST',
                body: formData,
            });

            let data = await response.json();

            const etapasOrdenadas = ['Asignado', 'Llega vehículo', 'En cargue', 'En ruta', 'Entregado'];

            const contenedor = document.getElementById('lineaTiempo');
            contenedor.innerHTML = '';
            contenedor.className = 'd-flex justify-content-between position-relative';

            let ultimaIndex = -1;

            //FechaEstimada
            const etapas = data.etapas;

            const etapaConFecha = Object.values(etapas).find((etapa) => etapa.fecha_entrega_estimada);

            const fechaEstimada = etapaConFecha?.fecha_entrega_estimada || null;

            // document.getElementById("FechaEstimada").textContent = fechaEstimada ? `Fecha estimada entrega: ${new Date(fechaEstimada).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}` : "Fecha estimada no disponible";
            document.getElementById('FechaEstimada').textContent = `Fecha estimada entrega: ${fechaEstimada ? fechaEstimada : 'No disponible'}`;

            etapasOrdenadas.forEach((etapa, index) => {
                const info = data.etapas[etapa];
                const step = document.createElement('div');
                step.className = 'step';
                step.dataset.etapa = etapa;

                const circle = document.createElement('div');
                circle.className = 'circle';

                if (info) {
                    circle.classList.add('completed');
                    ultimaIndex = index;
                    circle.setAttribute('data-bs-toggle', 'tooltip');
                    circle.setAttribute('data-bs-placement', 'bottom');
                    circle.setAttribute('title', `📅 ${info.fecha_trazabilidad}\n📝 ${info.observacion}`);
                }

                step.appendChild(circle);

                const small = document.createElement('small');
                small.textContent = etapa;
                step.appendChild(small);

                if (info) {
                    const fecha = document.createElement('div');
                    fecha.className = 'info-extra';
                    fecha.textContent = info.fecha_trazabilidad;
                    step.appendChild(fecha);

                    // const obs = document.createElement("div");
                    // obs.className = "info-extra";
                    // obs.textContent = info.observacion;
                    // step.appendChild(obs);
                }

                contenedor.appendChild(step);
            });

            const steps = contenedor.querySelectorAll('.step');
            if (steps.length && ultimaIndex >= 0) {
                const primer = steps[0].offsetLeft + steps[0].offsetWidth / 2;
                const ultimo = steps[ultimaIndex].offsetLeft + steps[ultimaIndex].offsetWidth / 2;

                // Línea verde (completado)
                const linea = document.createElement('div');
                linea.className = 'progreso-linea';
                linea.style.left = `${primer}px`;
                linea.style.width = `${ultimo - primer}px`;
                contenedor.appendChild(linea);

                // Línea amarilla (etapa actual)
                if (ultimaIndex + 1 < steps.length) {
                    const siguiente = steps[ultimaIndex + 1].offsetLeft + steps[ultimaIndex + 1].offsetWidth / 2;
                    const lineaActual = document.createElement('div');
                    lineaActual.className = 'progreso-linea-actual';
                    lineaActual.style.left = `${ultimo}px`;
                    lineaActual.style.width = `${siguiente - ultimo}px`;
                    contenedor.appendChild(lineaActual);
                }

                // Marcar la actual en naranja
                steps[ultimaIndex].querySelector('.circle').classList.remove('completed');
                steps[ultimaIndex].querySelector('.circle').classList.add('current');
            }

            // Activar tooltips
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));
        } catch (error) {
            console.error('Error en línea de tiempo:', error);
        }
    }

    // ─── Actualiza badge y visibilidad del botón flotante de carrito ──────────
    function actualizarContadorCarrito() {
        let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
        let btn = document.getElementById('btn-carrito-pedidos');
        let contador = document.getElementById('carrito-contador');

        if (!btn) return;
        btn.style.display = carrito.length > 0 ? '' : 'none';
        if (contador) contador.textContent = carrito.length;
    }

    // ─── Actualiza los KPI cards con conteos de la data recibida ──────────────
    function actualizarKpis(data) {
        if (!Array.isArray(data)) return;
        const c = { todos: data.length, Pendiente: 0, Publicado: 0, Asignado: 0, Cancelado: 0 };
        data.forEach(function (el) {
            if (el.estado_publicaion === 'Pendiente') c.Pendiente++;
            if (el.estado_publicaion === 'Publicado' ||
                el.estado_publicaion === 'Pendiente Respuesta' ||
                el.estado_publicaion === 'Aceptado') c.Publicado++;
            if (el.estado_asignacion === 'Asignado' ||
                el.estado_asignacion === 'Ganador') c.Asignado++;
            if (el.estado_publicaion === 'Cancelado') c.Cancelado++;
        });
        const set = function (id, v) { const el = document.getElementById(id); if (el) el.textContent = v; };
        set('kpi-total', c.todos);
        set('kpi-pendiente', c.Pendiente);
        set('kpi-publicado', c.Publicado);
        set('kpi-asignado', c.Asignado);
        set('kpi-cancelado', c.Cancelado);
    }

    /* ── Parsear fechas ─────────────────────────────── */
    // Las fechas vienen como '2026-03-19-08:00:00'
    // Necesitamos reemplazar el 3er guión por 'T' para que sean válidas
    const parsearFecha = (f) => {
        if (!f) return null;
        // '2026-03-19-08:00:00' → '2026-03-19T08:00:00'
        const normalizada = f.replace(/^(\d{4}-\d{2}-\d{2})-(\d{2}:\d{2}:\d{2})$/, '$1T$2');
        const dt = new Date(normalizada);
        return isNaN(dt.getTime()) ? null : dt;
    };

    /* ═══════════════════════════════════════════════════════
    actualizarKpisOc
    Recibe:
        duracionSegundos  → legs[1].duration.value  (vehículo→destino)
        fechaCargue       → 'YYYY-MM-DD HH:mm:ss'
        fechaEntrega      → 'YYYY-MM-DD HH:mm:ss'
    ═══════════════════════════════════════════════════════ */
    function actualizarKpisOc(duracionSegundos, fechaCargue, fechaEntrega) {
        const ahora = new Date();

        /* ── Parsear fechas ─────────────────────────────── */
        // 'YYYY-MM-DD HH:mm:ss' → reemplazar espacio por T para Safari
        // const dtCargue = fechaCargue ? new Date(fechaCargue.replace(' ', 'T')) : null;
        // const dtEntrega = fechaEntrega ? new Date(fechaEntrega.replace(' ', 'T')) : null;
        // const dtCargue = fechaCargue;
        // const dtEntrega = fechaEntrega;
        const dtCargue = parsearFecha(fechaCargue);
        const dtEntrega = parsearFecha(fechaEntrega);

        /* ── ETA estimada = ahora + duracion del mapa ───── */
        const eta = new Date(ahora.getTime() + duracionSegundos * 1000);

        /* ── T. Disponible ──────────────────────────────── */
        const h = Math.floor(duracionSegundos / 3600);
        const min = Math.floor((duracionSegundos % 3600) / 60);
        const tDisponible = h > 0 ? `${h}h ${min}m` : `${min} min`;

        // document.getElementById('kpi-tdis-val').textContent = tDisponible;
        // document.getElementById('kpi-tdis-val').style.color = '#0369a1';

        /* ── Estado SLA ─────────────────────────────────── */
        const slaEl = document.getElementById('kpi-sla-val');
        const slaSubEl = document.getElementById('kpi-sla-sub');

        if (dtEntrega) {
            const diffMs = eta.getTime() - dtEntrega.getTime(); // + = tarde, - = antes
            const diffMin = Math.round(diffMs / 60000);
            const absDiff = Math.abs(diffMin);
            const diffStr = absDiff >= 60
                ? `${Math.floor(absDiff / 60)}h ${absDiff % 60}m`
                : `${absDiff} min`;

            if (diffMin <= 0) {
                // A tiempo o antes
                slaEl.textContent = 'A TIEMPO';
                slaEl.style.color = '#16a34a';
                slaSubEl.textContent = `${diffStr} de margen`;
            } else if (diffMin <= 60) {
                // Riesgo leve (menos de 1h de retraso)
                slaEl.textContent = 'RIESGO';
                slaEl.style.color = '#f59e0b';
                slaSubEl.textContent = `+${diffStr} de retraso`;
            } else {
                // Crítico
                slaEl.textContent = 'CRÍTICO';
                slaEl.style.color = '#dc2626';
                slaSubEl.textContent = `+${diffStr} de retraso`;
            }
        } else {
            slaEl.textContent = '—';
            slaSubEl.textContent = 'Sin fecha de entrega';
        }

        /* ── Tarjeta Fecha Cargue ───────────────────────── */
        const cardCargue = document.getElementById('kpi-card-cargue');
        const cargueValEl = document.getElementById('kpi-cargue-val');
        const cargueSubEl = document.getElementById('kpi-cargue-sub');

        if (dtCargue) {
            const opts = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false };
            cargueValEl.textContent = dtCargue.toLocaleString('es-CO', opts);

            if (ahora > dtCargue) {
                // Ya pasó la hora de cargue
                cargueValEl.style.color = '#dc2626';
                cardCargue.style.borderLeft = '3px solid #dc2626';
                cargueSubEl.textContent = 'Hora de cargue vencida';
            } else {
                cargueValEl.style.color = '#16a34a';
                cardCargue.style.borderLeft = '3px solid #16a34a';
                cargueSubEl.textContent = 'Pendiente';
            }
        } else {
            cargueValEl.textContent = '—';
            cargueSubEl.textContent = 'Sin fecha';
        }

        /* ── Tarjeta Fecha Entrega ──────────────────────── */
        const cardEntrega = document.getElementById('kpi-card-entrega');
        const entregaValEl = document.getElementById('kpi-entrega-val');
        const entregaSubEl = document.getElementById('kpi-entrega-sub');

        if (dtEntrega) {
            const opts = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false };
            entregaValEl.textContent = dtEntrega.toLocaleString('es-CO', opts);

            // Color basado en el mismo cálculo del SLA
            const diffMin = Math.round((eta.getTime() - dtEntrega.getTime()) / 60000);
            if (diffMin <= 0) {
                entregaValEl.style.color = '#16a34a';
                cardEntrega.style.borderLeft = '3px solid #16a34a';
                entregaSubEl.textContent = `ETA: ${eta.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
            } else if (diffMin <= 60) {
                entregaValEl.style.color = '#f59e0b';
                cardEntrega.style.borderLeft = '3px solid #f59e0b';
                entregaSubEl.textContent = `ETA: ${eta.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
            } else {
                entregaValEl.style.color = '#dc2626';
                cardEntrega.style.borderLeft = '3px solid #dc2626';
                entregaSubEl.textContent = `ETA: ${eta.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
            }
        } else {
            entregaValEl.textContent = '—';
            entregaSubEl.textContent = 'Sin fecha';
        }
    }

    // ═══════════════════════════════════════════════════════════════
    //  NUEVA FUNCIÓN — actualizarKpisOcConFechas
    //
    //  Igual que actualizarKpisOc pero recibe las fechas YA ajustadas
    //  que vienen del backend (con buffer 28 % y respetando horarios).
    //  También muestra el motivo del ajuste en el sub-texto de los KPIs.
    //
    //  AGREGAR justo después del cierre `}` de la función
    //  `actualizarKpisOc` existente.
    // ═══════════════════════════════════════════════════════════════
    function actualizarKpisOcConFechas(duracionSegundos, fechaCargueAjustada, fechaEntregaAjustada, motivoAjuste) {
        const ahora = new Date();
        const dtCargue = parsearFecha(fechaCargueAjustada);
        const dtEntrega = parsearFecha(fechaEntregaAjustada);

        /* ── ETA = ahora + duración bruta del mapa ──
         *  (el buffer ya está absorbido en la fecha_entrega_ajustada;
         *   aquí solo se usa para el SLA en tiempo real) */
        const eta = new Date(ahora.getTime() + duracionSegundos * 1000);

        /* ── T. Disponible ── */
        const h = Math.floor(duracionSegundos / 3600);
        const min = Math.floor((duracionSegundos % 3600) / 60);
        const tDisponible = h > 0 ? `${h}h ${min}m` : `${min} min`;

        // const tDisVal = document.getElementById('kpi-tdis-val');
        // if (tDisVal) {
        //     tDisVal.textContent = tDisponible;
        //     tDisVal.style.color = '#0369a1';
        // }

        /* ── Estado SLA — compara ETA contra fecha_entrega_ajustada ── */
        const slaEl = document.getElementById('kpi-sla-val');
        const slaSubEl = document.getElementById('kpi-sla-sub');

        if (dtEntrega && slaEl && slaSubEl) {
            const diffMs = eta.getTime() - dtEntrega.getTime();
            const diffMin = Math.round(diffMs / 60000);
            const absDiff = Math.abs(diffMin);
            const diffStr = absDiff >= 60
                ? `${Math.floor(absDiff / 60)}h ${absDiff % 60}m`
                : `${absDiff} min`;

            if (diffMin <= 0) {
                slaEl.textContent = 'A TIEMPO';
                slaEl.style.color = '#16a34a';
                slaSubEl.textContent = `${diffStr} de margen`;
            } else if (diffMin <= 60) {
                slaEl.textContent = 'RIESGO';
                slaEl.style.color = '#f59e0b';
                slaSubEl.textContent = `+${diffStr} de retraso`;
            } else {
                slaEl.textContent = 'CRÍTICO';
                slaEl.style.color = '#dc2626';
                slaSubEl.textContent = `+${diffStr} de retraso`;
            }
        } else if (slaEl) {
            slaEl.textContent = '—';
            slaSubEl.textContent = 'Sin fecha de entrega';
        }

        /* ── Tarjeta Fecha Cargue (ajustada) ── */
        const cardCargue = document.getElementById('kpi-card-cargue');
        const cargueValEl = document.getElementById('kpi-cargue-val');
        const cargueSubEl = document.getElementById('kpi-cargue-sub');

        if (dtCargue && cargueValEl && cargueSubEl) {
            const opts = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false };
            cargueValEl.textContent = dtCargue.toLocaleString('es-CO', opts);

            if (ahora > dtCargue) {
                cargueValEl.style.color = '#dc2626';
                if (cardCargue) cardCargue.style.borderLeft = '3px solid #dc2626';
                cargueSubEl.textContent = 'Hora de cargue vencida';
            } else {
                cargueValEl.style.color = '#16a34a';
                if (cardCargue) cardCargue.style.borderLeft = '3px solid #16a34a';
                // Mostrar motivo del ajuste si lo hay
                cargueSubEl.textContent = motivoAjuste && motivoAjuste !== 'Sin ajustes de horario'
                    ? `Ajustado: ${motivoAjuste}`
                    : 'Según horario remitente';
            }
        } else if (cargueValEl) {
            cargueValEl.textContent = '—';
            cargueSubEl.textContent = 'Sin fecha';
        }

        /* ── Tarjeta Fecha Entrega (ajustada con buffer 28 %) ── */
        const cardEntrega = document.getElementById('kpi-card-entrega');
        const entregaValEl = document.getElementById('kpi-entrega-val');
        const entregaSubEl = document.getElementById('kpi-entrega-sub');

        if (dtEntrega && entregaValEl && entregaSubEl) {
            const opts = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false };
            entregaValEl.textContent = dtEntrega.toLocaleString('es-CO', opts);

            const diffMin = Math.round((eta.getTime() - dtEntrega.getTime()) / 60000);
            const etaStr = eta.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

            if (diffMin <= 0) {
                entregaValEl.style.color = '#16a34a';
                if (cardEntrega) cardEntrega.style.borderLeft = '3px solid #16a34a';
                entregaSubEl.textContent = `ETA: ${etaStr} · +28% buffer aplicado`;
            } else if (diffMin <= 60) {
                entregaValEl.style.color = '#f59e0b';
                if (cardEntrega) cardEntrega.style.borderLeft = '3px solid #f59e0b';
                entregaSubEl.textContent = `ETA: ${etaStr} · riesgo`;
            } else {
                entregaValEl.style.color = '#dc2626';
                if (cardEntrega) cardEntrega.style.borderLeft = '3px solid #dc2626';
                entregaSubEl.textContent = `ETA: ${etaStr} · crítico`;
            }
        } else if (entregaValEl) {
            entregaValEl.textContent = '—';
            entregaSubEl.textContent = 'Sin fecha';
        }
    }

    /* ═══════════════════════════════════════════════════════
       actualizarLineaTiempo
       Llama al servidor para nodo 2, calcula estado de cada
       nodo y actualiza la barra de progreso.
       Params:
         solicitudId   — ID del pedido
         fechaCreacion — 'YYYY-MM-DD HH:mm:ss'  (nodo 1)
         fechaCargue   — 'YYYY-MM-DD-HH:mm:ss'  (nodo 3, programada)
         fechaEntrega  — 'YYYY-MM-DD-HH:mm:ss'  (nodo 7, SLA)
         etaSegundos   — segundos restantes al destino (del mapa)
    ═══════════════════════════════════════════════════════ */

    async function actualizarLineaTiempo(solicitudId, fechaCreacion, fechaCargue, fechaEntrega, etaSegundos, tipoTrazabilidad = '') {

        const ahora = new Date();

        /* ── helpers ── */
        const parseFecha = (f) => {
            if (!f) return null;
            const n = f.replace(/^(\d{4}-\d{2}-\d{2})[-\s](\d{2}:\d{2}:\d{2})$/, '$1T$2');
            const d = new Date(n);
            return isNaN(d.getTime()) ? null : d;
        };
        const fmt = (d) => d ? d.toLocaleString('es-CO', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false
        }) : '—';
        const fmtDelta = (ms) => {
            const min = Math.round(ms / 60000);
            const abs = Math.abs(min);
            const str = abs >= 60 ? `${Math.floor(abs / 60)}h ${abs % 60}m` : `${abs} min`;
            return { str: (min >= 0 ? '+' : '-') + str, tarde: min > 0 };
        };
        const setNodo = (n, estado) => {
            const el = document.getElementById(`tl-node-${n}`);
            if (!el) return;
            el.classList.remove('oc-node-done', 'oc-node-active', 'oc-node-pending', 'oc-node-risk');
            el.classList.add(
                { done: 'oc-node-done', active: 'oc-node-active', pending: 'oc-node-pending', risk: 'oc-node-risk' }[estado]
                ?? 'oc-node-pending'
            );
        };
        const setTime = (n, txt) => {
            const el = document.getElementById(`tl-time-${n}`);
            if (el) el.textContent = txt;
        };
        const setDelta = (n, ms) => {
            const el = document.getElementById(`tl-delta-${n}`);
            if (!el) return;
            if (ms === null) { el.style.display = 'none'; return; }
            // ms = Real - Programada: positivo=tardó, negativo=adelantó
            const { str, tarde } = fmtDelta(ms);
            el.textContent = str;  // fmtDelta ya lleva signo + o -
            el.className = `d ${tarde ? 'd-neg' : 'd-pos'}`;
            el.style.display = '';
        };

        /* ── Fechas programadas del pedido (referencia "Programada") ── */
        const dtCargue = parseFecha(fechaCargue);   // Prog llegada cargue
        const dtEntrega = parseFecha(fechaEntrega);  // Prog entrega

        /* ── Trazabilidad real: primer registro de cada tipo ── */
        const trazas = Array.isArray(window._trazabilidadPedido) ? window._trazabilidadPedido : [];
        const buscarTraza = (tipo) => trazas.find(t => t.tipo_trazabilidad === tipo) ?? null;
        const dtTraza = (tr) => tr ? parseFecha(`${tr.fecha} ${tr.hora}`) : null;

        const trLlegadaCargue = buscarTraza('Llegada Cargue');
        const trCargue = buscarTraza('Cargue');
        const trSalidaCargue = buscarTraza('Salida Cargue');
        const trInicioRuta = buscarTraza('Inicio Ruta');
        const trTransito = buscarTraza('Transito');
        const trLlegadaDes = buscarTraza('Llegada Descargue');
        const trDescargue = buscarTraza('Descargue');
        const trSalidaDes = buscarTraza('Salida Descargue');

        const dtLlegadaCargue = dtTraza(trLlegadaCargue);
        const dtCargueReal = dtTraza(trCargue);
        const dtSalidaCargue = dtTraza(trSalidaCargue);
        const dtInicioRuta = dtTraza(trInicioRuta);
        const dtTransito = dtTraza(trTransito);
        const dtLlegadaDes = dtTraza(trLlegadaDes);
        const dtDescargueReal = dtTraza(trDescargue);
        const dtSalidaDes = dtTraza(trSalidaDes);

        /* ════════════════════════════
           NODO 1 — Creación (siempre done)
        ════════════════════════════ */
        setNodo(1, 'done');
        setTime(1, fmt(parseFecha(fechaCreacion)));

        /* ════════════════════════════
           NODO 2 — Asignación vehículo (consulta servidor)
        ════════════════════════════ */
        let dtAsignacion = null;
        try {
            const baseUrl = document.getElementById('base_url_api').value;
            const fd2 = new FormData();
            fd2.append('PedidoId', solicitudId);
            const r2 = await fetch(baseUrl + 'Fecha_asignacion_vehiculo', {
                method: 'POST', headers: { 'X-API-KEY': 'nexos_nacional2026@*' }, body: fd2,
            });
            const j2 = await r2.json();
            if (j2.numero === 200 && j2.data?.fecha_asignacion) {
                dtAsignacion = parseFecha(j2.data.fecha_asignacion);
            }
        } catch (e) { console.warn('Error nodo 2:', e); }

        if (dtAsignacion) { setNodo(2, 'done'); setTime(2, fmt(dtAsignacion)); }
        else { setNodo(2, 'pending'); setTime(2, 'Sin asignar'); }

        /* Si es solo Asignado: nodos 3-7 pending, barra proporcional, salir.
           Esto ocurre cuando tipo_trazabilidad es 'Completado', 'Sin Asignar'
           o cualquier valor que no sea uno de los 8 estados operativos. */
        const tiposOperativos = [
            'Llegada Cargue', 'Cargue', 'Salida Cargue', 'Inicio Ruta',
            'Transito', 'Llegada Descargue', 'Descargue', 'Salida Descargue',
        ];
        const esSoloAsignado = tipoTrazabilidad === 'Completado'
            || tipoTrazabilidad === 'Sin Asignar'
            || (tipoTrazabilidad !== '' && tipoTrazabilidad !== null
                && !tiposOperativos.includes(tipoTrazabilidad));
        if (esSoloAsignado) {
            [3, 4, 5, 6, 7].forEach(n => { setNodo(n, 'pending'); setTime(n, '—'); setDelta(n, null); });
            const pct = Math.round(((1 + (dtAsignacion ? 1 : 0)) / 7) * 100);
            const barFill = document.getElementById('kpi-bar-fill');
            const barVal = document.getElementById('kpi-pct-val');
            if (barFill) {
                barFill.style.width = `${pct}%`;
                barFill.style.transition = 'width .6s ease';
                barFill.style.background = 'linear-gradient(90deg,#ea580c,#f97316)';
            }
            if (barVal) barVal.textContent = `${pct}%`;
            const tlBar = document.getElementById('tl-progress-bar');
            if (tlBar) tlBar.style.width = `${pct}%`;
            return;
        }

        /* ════════════════════════════
           NODO 3 — Llegada a Cargue
           Programada : fechaCargue del pedido
           Real       : fecha+hora de la traza 'Llegada Cargue'
           Delta      : Real − Programada  (positivo=tardó, negativo=adelantó)
        ════════════════════════════ */
        if (dtLlegadaCargue) {
            // Registro real disponible — nodo completado
            setNodo(3, 'done');
            if (dtCargue) {
                const dms = dtLlegadaCargue.getTime() - dtCargue.getTime();
                setTime(3, `Prog: ${fmt(dtCargue)} | Real: ${fmt(dtLlegadaCargue)}`);
                setDelta(3, Math.abs(dms) > 60000 ? dms : null);
            } else {
                setTime(3, fmt(dtLlegadaCargue));
                setDelta(3, null);
            }
        } else if (dtCargue) {
            // Sin registro real todavía — mostrar programada y estado actual
            setTime(3, `Prog: ${fmt(dtCargue)}`);
            if (ahora >= dtCargue) {
                const dms = ahora.getTime() - dtCargue.getTime();
                setNodo(3, dms > 30 * 60000 ? 'risk' : 'active');
                setDelta(3, dms > 60000 ? dms : null);
            } else {
                setNodo(3, dtAsignacion ? 'active' : 'pending');
                setDelta(3, null);
            }
        } else {
            setNodo(3, 'pending');
            setTime(3, '—');
        }

        /* ════════════════════════════
           NODO 4 — Planta Origen (operación de cargue)
           Programada : fechaCargue del pedido
           Real       : traza 'Cargue' (active) | 'Salida Cargue' (done)
        ════════════════════════════ */
        if (dtSalidaCargue) {
            setNodo(4, 'done');
            if (dtCargue) {
                const dms = dtSalidaCargue.getTime() - dtCargue.getTime();
                setTime(4, `Prog: ${fmt(dtCargue)} | Real: ${fmt(dtSalidaCargue)}`);
                setDelta(4, Math.abs(dms) > 60000 ? dms : null);
            } else {
                setTime(4, fmt(dtSalidaCargue));
            }
        } else if (dtCargueReal) {
            setNodo(4, 'active');
            if (dtCargue) {
                const dms = dtCargueReal.getTime() - dtCargue.getTime();
                setTime(4, `Prog: ${fmt(dtCargue)} | Real: ${fmt(dtCargueReal)}`);
                setDelta(4, Math.abs(dms) > 60000 ? dms : null);
            } else {
                setTime(4, fmt(dtCargueReal));
            }
        } else if (dtLlegadaCargue) {
            // Llegó pero aún sin registro de cargue
            setNodo(4, 'active');
            setTime(4, dtCargue ? `Prog: ${fmt(dtCargue)}` : '—');
            setDelta(4, null);
        } else if (dtCargue && ahora >= dtCargue) {
            setNodo(4, 'active');
            setTime(4, `Prog: ${fmt(dtCargue)}`);
        }

        /* ════════════════════════════
           NODO 5 — Tránsito en Ruta
           Real       : traza 'Salida Cargue' | 'Inicio Ruta' | 'Transito'
           Completado : cuando existe 'Llegada Descargue'
        ════════════════════════════ */
        if (dtLlegadaDes) {
            // Ya llegó al destino — tránsito completado
            setNodo(5, 'done');
            setTime(5, fmt(dtLlegadaDes));
            setDelta(5, null);
        } else if (dtTransito || dtInicioRuta || dtSalidaCargue) {
            setNodo(5, 'active');
            const dtRef = dtTransito || dtInicioRuta || dtSalidaCargue;
            if (etaSegundos > 0) {
                const eta = new Date(ahora.getTime() + etaSegundos * 1000);
                setTime(5, `Salida: ${fmt(dtRef)} | ETA: ${fmt(eta)}`);
                if (dtEntrega) {
                    const dms = eta.getTime() - dtEntrega.getTime();
                    setDelta(5, dms > 0 ? dms : null);
                }
            } else {
                setTime(5, fmt(dtRef));
                setDelta(5, null);
            }
        } else if (dtCargue && ahora >= dtCargue && etaSegundos > 0) {
            setNodo(5, 'active');
            const eta = new Date(ahora.getTime() + etaSegundos * 1000);
            setTime(5, `ETA: ${fmt(eta)}`);
            if (dtEntrega) {
                const dms = eta.getTime() - dtEntrega.getTime();
                setDelta(5, dms > 0 ? dms : null);
            }
        } else {
            setNodo(5, 'pending');
            setTime(5, '—');
        }

        /* ════════════════════════════
           NODO 6 — Planta Destino
           Programada : fechaEntrega del pedido
           Real       : 'Llegada Descargue' (active) | 'Descargue'/'Salida Descargue' (done)
        ════════════════════════════ */
        if (dtSalidaDes) {
            setNodo(6, 'done');
            if (dtEntrega) {
                const dms = dtSalidaDes.getTime() - dtEntrega.getTime();
                setTime(6, `Prog: ${fmt(dtEntrega)} | Real: ${fmt(dtSalidaDes)}`);
                setDelta(6, Math.abs(dms) > 60000 ? dms : null);
            } else {
                setTime(6, fmt(dtSalidaDes));
            }
        } else if (dtDescargueReal) {
            setNodo(6, 'done');
            if (dtEntrega) {
                const dms = dtDescargueReal.getTime() - dtEntrega.getTime();
                setTime(6, `Prog: ${fmt(dtEntrega)} | Real: ${fmt(dtDescargueReal)}`);
                setDelta(6, Math.abs(dms) > 60000 ? dms : null);
            } else {
                setTime(6, fmt(dtDescargueReal));
            }
        } else if (dtLlegadaDes) {
            setNodo(6, 'active');
            if (dtEntrega) {
                const dms = dtLlegadaDes.getTime() - dtEntrega.getTime();
                setTime(6, `Prog: ${fmt(dtEntrega)} | Real: ${fmt(dtLlegadaDes)}`);
                setDelta(6, Math.abs(dms) > 60000 ? dms : null);
            } else {
                setTime(6, fmt(dtLlegadaDes));
            }
        } else if (dtEntrega) {
            setNodo(6, 'pending');
            setTime(6, `SLA: ${fmt(dtEntrega)}`);
            setDelta(6, null);
        }

        /* ════════════════════════════
           NODO 7 — Entrega Final
           Programada : fechaEntrega del pedido
           Real       : traza 'Salida Descargue'
        ════════════════════════════ */
        if (dtSalidaDes) {
            setNodo(7, 'done');
            if (dtEntrega) {
                const dms = dtSalidaDes.getTime() - dtEntrega.getTime();
                setTime(7, `Prog: ${fmt(dtEntrega)} | Real: ${fmt(dtSalidaDes)}`);
                setDelta(7, Math.abs(dms) > 60000 ? dms : null);
            } else {
                setTime(7, fmt(dtSalidaDes));
                setDelta(7, null);
            }
        } else if (dtEntrega && ahora >= dtEntrega) {
            // SLA vencido sin registro de salida
            setNodo(7, 'risk');
            const dms = ahora.getTime() - dtEntrega.getTime();
            setTime(7, `SLA vencido: ${fmt(dtEntrega)}`);
            setDelta(7, dms > 60000 ? dms : null);
        } else if (dtEntrega) {
            setNodo(7, 'pending');
            setTime(7, `SLA: ${fmt(dtEntrega)}`);
            if (etaSegundos > 0) {
                const eta = new Date(ahora.getTime() + etaSegundos * 1000);
                const dms = eta.getTime() - dtEntrega.getTime();
                setDelta(7, dms > 0 ? dms : null);
            } else {
                setDelta(7, null);
            }
        }

        /* ════════════════════════════
           BARRA DE PROGRESO
           Cada nodo aporta un peso según la trazabilidad real disponible.
        ════════════════════════════ */
        const pesos = [
            { pct: 100 },                                                                          // N1 creación
            { pct: dtAsignacion ? 100 : 0 },                                                       // N2 asignación
            { pct: dtLlegadaCargue ? 100 : (dtCargue && ahora >= dtCargue) ? 60 : 0 },             // N3 llegada cargue
            { pct: dtSalidaCargue ? 100 : dtCargueReal ? 70 : dtLlegadaCargue ? 30 : 0 },          // N4 planta origen
            { pct: dtLlegadaDes ? 100 : (dtTransito || dtInicioRuta || dtSalidaCargue) ? 50 : 0 }, // N5 tránsito
            { pct: (dtDescargueReal || dtSalidaDes) ? 100 : dtLlegadaDes ? 50 : 0 },               // N6 planta destino
            { pct: dtSalidaDes ? 100 : 0 },                                                        // N7 entrega final
        ];

        const cumplidos = pesos.reduce((a, p) => a + p.pct / 100, 0);
        const porcentaje = Math.round((cumplidos / pesos.length) * 100);

        const barFill = document.getElementById('kpi-bar-fill');
        const barVal = document.getElementById('kpi-pct-val');
        if (barFill) {
            barFill.style.width = `${porcentaje}%`;
            barFill.style.transition = 'width .6s ease';
            barFill.style.background = porcentaje >= 80 ? 'linear-gradient(90deg,#16a34a,#22c55e)'
                : porcentaje >= 40 ? 'linear-gradient(90deg,#0369a1,#0891b2)'
                    : 'linear-gradient(90deg,#ea580c,#f97316)';
        }
        if (barVal) barVal.textContent = `${porcentaje}%`;

        const tlBar = document.getElementById('tl-progress-bar');
        if (tlBar) tlBar.style.width = `${porcentaje}%`;
    }

    /* ═══════════════════════════════════════════════
       renderTablaResumen
       container → elemento DOM del div tabla-tiempos-X
       tareas    → array enriquecido con _tiempos
       titulo    → 'Planta Origen' | 'Planta Destino'
    ═══════════════════════════════════════════════ */
    function calcularTiempos(tareas, fechaCargue) {

        const parseFecha = (f) => {
            if (!f) return null;
            const n = f.replace(/^(\d{4}-\d{2}-\d{2})[-\s](\d{2}:\d{2}:\d{2})$/, '$1T$2');
            const d = new Date(n);
            return isNaN(d.getTime()) ? null : d;
        };

        // Convierte valor_tiempo a minutos según medida_tiempo (1=min, 2=hrs, 3=días)
        const aMinutos = (valor, medida) => {
            if (!valor) return null;
            const m = Number(medida) || 1;
            if (m === 1) return Number(valor);
            if (m === 2) return Number(valor) * 60;
            if (m === 3) return Number(valor) * 1440;
            return Number(valor);
        };

        const fmtMin = (m) => {
            const abs = Math.abs(m);
            if (abs >= 1440) return `${Math.floor(abs / 1440)}d ${Math.floor((abs % 1440) / 60)}h`;
            if (abs >= 60) return `${Math.floor(abs / 60)}h ${abs % 60}m`;
            return `${abs} min`;
        };

        const fmtFecha = (d) => {
            if (!d) return null;
            return d.toLocaleString('es-CO', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: false,
            });
        };

        // Fecha de cargue del pedido (base para actividades sin dependencia)
        const dtCargue = parseFecha(fechaCargue);
        const ahora = new Date();

        // Mapa id → tarea
        const mapaId = {};
        tareas.forEach(t => { mapaId[t.id] = t; });

        /* ── Precalcular dtInicio programado en cadena (memoización) ──────────
         *
         * Reglas:
         *  criterio_calculo = 4  → dtInicio = fecha_base_calc del servidor
         *                          (ya fue calculada en PHP con la gestión del prerequisito)
         *  sin dependencia       → dtInicio = dtCargue
         *  con dependencia       → dtInicio = dtInicio(prerequisito) + minutos(prerequisito)
         *
         * El servidor envía fecha_base_calc con el valor correcto para c=4,
         * por lo que el JS solo necesita parsearla.
        ────────────────────────────────────────────────────────────────────── */
        const dtInicioCalc = {};

        const resolverDtInicio = (t) => {
            if (dtInicioCalc[t.id] !== undefined) return dtInicioCalc[t.id];

            let dt = null;
            const sinDep = !t.actividad_prerequisito || t.actividad_prerequisito === 0;

            if (t.criterio_calculo === 4) {
                // PHP ya calculó y guardó fecha_base_calc con la fecha de gestión del prerequisito
                dt = parseFecha(t.fecha_base_calc) ?? dtCargue;

            } else if (t.orden === 1 || sinDep) {
                dt = dtCargue;

            } else if (t.actividad_prerequisito && mapaId[t.actividad_prerequisito]) {
                const pre = mapaId[t.actividad_prerequisito];
                const dtPre = resolverDtInicio(pre);
                const minPre = aMinutos(pre.valor_tiempo, pre.medida_tiempo);
                dt = (dtPre && minPre) ? new Date(dtPre.getTime() + minPre * 60 * 1000) : dtCargue;
            }

            dtInicioCalc[t.id] = dt;
            return dt;
        };

        tareas.forEach(t => resolverDtInicio(t));

        return tareas.map(t => {

            const minAsignados = aMinutos(t.valor_tiempo, t.medida_tiempo);
            if (!minAsignados) return { ...t, _tiempos: null };

            const dtInicio = dtInicioCalc[t.id];
            if (!dtInicio) return { ...t, _tiempos: null };

            // Fecha real de ejecución (calculada o registrada en el servidor)
            const dtReal = parseFecha(t.fecha_inicio_real);

            // Fecha límite programada = dtInicio + tiempo estándar
            const dtLimite = new Date(dtInicio.getTime() + minAsignados * 60 * 1000);

            // Tiempo transcurrido real: si hay fecha real, desde dtInicio hasta dtReal
            // Si no, desde dtInicio hasta ahora
            const baseTranscurrido = dtReal || dtInicio;
            const minTranscurridos = Math.max(0, Math.floor((ahora - baseTranscurrido) / 60000));
            const minRestantes = Math.floor((dtLimite - ahora) / 60000);
            const alDia = t.estado === 'COMPLETADO' || minRestantes >= 0;
            const pct = Math.min(Math.round((minTranscurridos / minAsignados) * 100), 999);

            // Para COMPLETADO: tiempo real = diferencia entre dtReal y dtInicio (si existe)
            const minTransMostrar = (t.estado === 'COMPLETADO' && dtReal)
                ? Math.max(0, Math.floor((dtReal - dtInicio) / 60000))
                : t.estado === 'COMPLETADO'
                    ? minAsignados
                    : minTranscurridos;

            return {
                ...t,
                _tiempos: {
                    minAsignados,
                    minTranscurridos: minTransMostrar,
                    minRestantes,
                    alDia,
                    pct: t.estado === 'COMPLETADO' ? 100 : pct,
                    textoAsignado: fmtMin(minAsignados),
                    textoTranscurrido: fmtMin(minTransMostrar),
                    textoRestante: t.estado === 'COMPLETADO'
                        ? '0 min'
                        : (minRestantes < 0 ? '-' : '+') + fmtMin(Math.abs(minRestantes)),
                    // Prog = fecha calculada en que debía iniciar
                    fechaInicioCalc: fmtFecha(dtInicio),
                    // Real = fecha real de inicio (del servidor, puede ser null)
                    fechaReal: fmtFecha(dtReal),
                    fechaLimite: fmtFecha(dtLimite),
                },
            };
        });
    }

    function renderTablaResumen(container, tareas, titulo) {
        if (!container) return;

        const fmtMin = (m) => {
            const abs = Math.abs(m);
            if (abs >= 1440) return `${Math.floor(abs / 1440)}d ${Math.floor((abs % 1440) / 60)}h`;
            if (abs >= 60) return `${Math.floor(abs / 60)}h ${abs % 60}m`;
            return `${abs} min`;
        };

        // ── Filas: Actividad | Estándar | Real | Δ ──────────────────────────
        // Real  = tiempo_real_gestion (última gestión − fecha_base_calc)
        // Δ     = tiempo_real_min     (positivo=ganó, negativo=perdió)
        const filas = tareas.map(t => {

            const estandar = t._tiempos ? t._tiempos.textoAsignado : '—';

            // ── Real ──
            let realHtml = '<span style="color:#94a3b8">—</span>';
            if (t.estado === 'COMPLETADO' && t.tiempo_real_gestion != null) {
                realHtml = `<span style="color:#16a34a;font-weight:600">${fmtMin(t.tiempo_real_gestion)}</span>`;
            } else if (t.estado === 'EN GESTION' && t._tiempos) {
                realHtml = `<span style="color:#ea580c;font-weight:600">${t._tiempos.textoTranscurrido}</span>`;
            }

            // ── Delta ──
            let deltaHtml = '<span style="color:#94a3b8">—</span>';
            if (t.estado === 'COMPLETADO' && t.tiempo_real_min != null) {
                const diff = t.tiempo_real_min;
                const color = diff === 0 ? '#0369a1' : diff > 0 ? '#16a34a' : '#dc2626';
                const signo = diff > 0 ? '+' : diff < 0 ? '-' : '=';
                deltaHtml = `<span style="font-size:9px;font-weight:700;font-family:'JetBrains Mono',monospace;
                    padding:1px 6px;border-radius:7px;white-space:nowrap;
                    background:${color}12;color:${color};border:1px solid ${color}30">
                    ${signo}${fmtMin(Math.abs(diff))}</span>`;
            }

            return `
            <tr>
                <td style="font-size:10px;color:#0f172a;max-width:110px;white-space:normal;line-height:1.3">
                    ${t.nombre}
                </td>
                <td class="v" style="font-size:10px;color:#475569;text-align:center">${estandar}</td>
                <td class="v" style="font-size:10px;text-align:center">${realHtml}</td>
                <td class="v" style="text-align:center">${deltaHtml}</td>
            </tr>`;
        }).join('');

        // ── Totales ──
        const totalAsig = tareas.reduce((a, t) => a + (t._tiempos?.minAsignados || 0), 0);
        const totalReal = tareas.reduce((a, t) =>
            t.estado === 'COMPLETADO' && t.tiempo_real_gestion != null ? a + t.tiempo_real_gestion : a, 0);
        const totalDelta = tareas.reduce((a, t) =>
            t.estado === 'COMPLETADO' && t.tiempo_real_min != null ? a + t.tiempo_real_min : a, 0);
        const totalCompletadas = tareas.filter(t => t.estado === 'COMPLETADO' && t.tiempo_real_min != null).length;
        const totalColorD = totalDelta === 0 ? '#0369a1' : totalDelta > 0 ? '#16a34a' : '#dc2626';
        const totalDeltaHtml = totalCompletadas > 0
            ? `<span style="font-size:9px;font-weight:700;font-family:'JetBrains Mono',monospace;
                padding:1px 6px;border-radius:7px;background:${totalColorD}12;
                color:${totalColorD};border:1px solid ${totalColorD}30">
                ${totalDelta > 0 ? '+' : totalDelta < 0 ? '-' : '='}${fmtMin(Math.abs(totalDelta))}</span>`
            : '—';

        // ── Registro de eventos: COMPLETADAS con delta != 0 ──
        const eventos = tareas.filter(t =>
            t.estado === 'COMPLETADO' &&
            t.tiempo_real_min != null &&
            t.tiempo_real_min !== 0
        );

        const eventosHtml = eventos.length === 0
            ? `<div style="font-size:10px;color:#94a3b8;padding:8px 0">Sin diferencias de tiempo registradas.</div>`
            : eventos.map(t => {
                const diff = t.tiempo_real_min;
                const color = diff > 0 ? '#16a34a' : '#dc2626';
                const texto = diff > 0
                    ? `Ganó ${fmtMin(Math.abs(diff))} en "${t.nombre}"`
                    : `Perdió ${fmtMin(Math.abs(diff))} en "${t.nombre}"`;
                return `
                <div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid #f1f5f9">
                    <span style="font-size:7px;color:${color};margin-top:3px;flex-shrink:0">●</span>
                    <div>
                        <div style="font-size:10px;color:#0f172a">${texto}</div>
                        <div style="font-size:9px;color:#94a3b8">
                            Est: ${t._tiempos?.textoAsignado ?? '—'} · Real: ${fmtMin(t.tiempo_real_gestion ?? 0)}
                        </div>
                    </div>
                    <span style="margin-left:auto;font-size:9px;font-weight:700;font-family:'JetBrains Mono',monospace;
                        padding:1px 6px;border-radius:7px;white-space:nowrap;
                        background:${color}12;color:${color};border:1px solid ${color}30">
                        ${diff > 0 ? '+' : ''}${fmtMin(diff)}
                    </span>
                </div>`;
            }).join('');

        container.innerHTML = `
            <table class="oc-table" style="margin-bottom:.8rem">
                <thead>
                    <tr>
                        <th>Actividad</th>
                        <th style="text-align:center">Estándar</th>
                        <th style="text-align:center">Real</th>
                        <th style="text-align:center">Δ</th>
                    </tr>
                </thead>
                <tbody>${filas}</tbody>
                <tfoot>
                    <tr class="total">
                        <td>TOTAL ${titulo?.toUpperCase() ?? ''}</td>
                        <td class="v" style="text-align:center">${fmtMin(totalAsig)}</td>
                        <td class="v" style="text-align:center">${totalReal > 0 ? fmtMin(totalReal) : '—'}</td>
                        <td class="v" style="text-align:center">${totalDeltaHtml}</td>
                    </tr>
                </tfoot>
            </table>

            <div style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;
                color:#94a3b8;margin-bottom:.5rem;margin-top:.2rem">
                Registro de Eventos
            </div>
            <div style="max-height:180px;overflow-y:auto">
                ${eventosHtml}
            </div>`;
    }

    // Exponer al scope global (igual que el ocToggle original)
    window.ocToggle = ocToggle;
    window.completarTareaOC = completarTareaOC;
})();