// window.VENTANA = null; // Variable global para almacenar el ID
// // Definir la función initScript globalmente
// window.initScript = function (id) {
//   window.VENTANA = id; // Asigna el ID recibido a la variable global

//   // Crear instancia
//   // Usar una variable global o una propiedad en el objeto window
//   if (!window.myOffcanvas) {
//     window.myOffcanvas = new DynamicOffcanvas({
//       id: `customOffcanvas${id}`,
//       title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
//       content: '<p>Contenido inicial</p>',
//       scroll: true,
//       backdrop: false
//     });
//   } else {
//     console.log('El offcanvas ya está creado.');
//   }

//   const hoy = new Date();
//   const opciones = { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" };

//   // Formatear la fecha a "YYYY-MM-DD"
//   const fechaColombia = new Intl.DateTimeFormat("es-CO", opciones)
//     .format(hoy)
//     .split("/")
//     .reverse()
//     .join("-");

//   listar_recursos_administrador(fechaColombia, fechaColombia, '', '', '');

//   document.addEventListener("click", async (e) => {

//     if (e.target.matches('#rc-btn-buscar') || e.target.matches('#rc-btn-buscar *')) {
//       const fi = document.getElementById('rc-fecha-inicial')?.value ?? '';
//       const ff = document.getElementById('rc-fecha-final')?.value ?? '';
//       const modalidad = document.getElementById('rc-modalidad')?.value ?? '';
//       const estado = document.getElementById('rc-estado-recurso')?.value ?? '';
//       document.querySelectorAll('.rc-kpi-resumen').forEach(c => c.classList.remove('active'));
//       listar_recursos_administrador(fi, ff, modalidad, '', estado);
//     }

//     if (e.target.matches("#btn_detalle_proceso_servicio") || e.target.matches("#btn_detalle_proceso_servicio *")) {
//       consulta_tipo = [];
//       let Enlace = e.target.closest("#btn_detalle_proceso_servicio");
//       let MaestroId = Enlace.getAttribute("data-id");
//       let ClienteId = Enlace.getAttribute("data-id2");
//       let Proceso = Enlace.getAttribute("data-proceso");
//       let EstadoRecurso = Enlace.getAttribute("data-EstadoRecurso");
//       let ServicioId = Enlace.getAttribute("data-servicioId");
//       let MotivoCancelacion = Enlace.getAttribute('data-motivo_cancelacion');
//       let proveedor_id = document.getElementById("proveedor_id").value;
//       let select_acciones = '';

//       select_acciones = `
//         <select class="form-select form-select-sm me-1 px-1 py-0 w-100" onchange="trazabilidad_pedido(this.value)" name="select_tipo_trazabilidad"  id="select_tipo_trazabilidad" aria-label=".form-select-sm example">
//           <option value="" selected><i class="uil uil-angle-down"></i></option>
//         </select>
//       `;

//       myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Detalle de solicitud de servicio N°` + MaestroId);
//       myOffcanvas.updateContent(`
//           <div class="col-12">
//             <div class="row">
//               <div class="container d-flex justify-content-center align-items-center">
//                 <div class="row text-black fw-bold text-center d-flex flex-wrap">
//                   <div class="col-auto mx-3 h6">Peso Neto total: <span  class="badge badge-phoenix badge-phoenix-primary" id="pesoNeto">0</span></div>
//                   <div class="col-auto mx-3 h6">Peso Bruto total: <span class="badge badge-phoenix badge-phoenix-primary" id="pesoBruto">0</span></div>
//                   <div class="col-auto mx-3 h6">Total Unidades: <span   class="badge badge-phoenix badge-phoenix-primary" id="totalUnidades">0</span></div>
//                 </div>
//               </div>

//               <hr class="my-1 text-dark">
//                <h6 class="mb-0 text-body-highlight me-2">Pedidos</h6>
//               <hr class="my-1 text-dark">
//               <div class="table-responsive scrollbar">
//                 <table class="table table-sm text-center" style="font-size: 11px;">
//                   <thead>
//                     <tr>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'></th> 
//                       <th scope="col" scope="col" style='color:black;width: auto; white-space: nowrap;'>#</th>
//                       <!--<th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Recurso</th>-->
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Ref.Pedido</th>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Cod.Producto</th>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Producto</th>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Peso Neto</th>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Peso Bruto</th>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Empaque</th>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Cantidad</th>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>No. Estibas</th>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Origen</th>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Destino</th>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Fecha Cargue</th>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Fecha Descargue</th>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Remitente</th>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Destinatario</th>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Trazabilidad</th>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Estado</th>

//                     </tr>
//                   </thead>
//                   <tbody id="tbody_servicios_pedidos_recurso" class="text-center">
//                     <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
//                   </tbody>
//                 </table>
//               </div>

//                 <hr class="my-1 text-dark">
//                   <h6 class="mb-0 me-2 d-flex align-items-center justify-content-center">Trazabilidad</h6>
//                 <hr class="my-1 text-dark">
//               <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
//                   <label class="form-label" for="documento_trazabilidad">Escoger trazabilidad:</label>
//                   <div class="mb-1 col-4" >${select_acciones}</div>

//                   <div class="trazabilidad-pedidos">

//                       <div class="row" style="display:none" id="id_documentos">
//                           <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                               <div class="mb-1">
//                                 <label class="form-label" for="documento_trazabilidad">Documento</label>
//                                 <input type="file" name="documento_trazabilidad" id="documento_trazabilidad" class="form-control form-control-sm">
//                               </div>
//                           </div>
//                         <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                           <div class="mb-1">
//                               <label class="form-label" for="observacion_gestion_trazabilidad">Observación</label>
//                               <textarea name="observacion_gestion_trazabilidad" id="observacion_gestion_trazabilidad" cols="30" rows="1"
//                               class="form-control form-control-sm"></textarea>
//                           </div>
//                         </div>
//                       </div>  


//                       <div class="row" style="display:none" id="id_fechas">
//                           <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
//                           <label class="form-label" for="fecha_estimada_entrega">Fecha Estimada Entrega</label>
//                             <input type="date" name="fecha_estimada_entrega" id="fecha_estimada_entrega" class="form-control form-control-sm">
//                           </div>
//                           <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
//                             <label class="form-label" for="hora_estimada_entrega">Hora Estimada Entrega</label>
//                             <input type="time" name="hora_estimada_entrega" id="hora_estimada_entrega" class="form-control form-control-sm">
//                           </div>
//                       </div>


//                        <div class="row" style="display:none" id="botones">
//                           <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex justify-content-end my-2" >
//                               <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                                 <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-0" style="margin-right:5px;" id="btn_cancelar_gestion_trazabilidad"><i class="uil-x"></i> Cancelar</button>
//                                 <button type="button" class="btn btn-success btn-sm me-1 px-1 py-0" id="btn_guardar_trazabilidad_gestion" data-SolicitudId="" data-ReferenciaPedido=""><i class="uil-save"></i> Guardar</button>
//                               </div>
//                           </div>
//                       </div>    
//                   </div>
//               </div>

//               <hr class="my-1 text-dark">
//                 <div class="d-flex align-items-center justify-content-between">
//                  <h6 class="mb-0 me-2 d-flex align-items-center justify-content-center">Servicios Especiales</h6>
//                </div>
//               <hr class="my-1 text-dark">

//               <!-- Este es el contenedor de los tabs (debe estar en tu HTML) -->
//               <ul class="nav nav-underline fs-9" id="cabecera_proveedores_servicios_especiales" role="tablist">
//                 <!-- Los tabs se generarán dinámicamente aquí -->
//               </ul>

//               <div id="detalle_proveedores_servicios_especiales"></div>

//               <!-- Seccion de Servicios especiales -->
//               <div class="accordion mt-0" id="accordionExample2">
//                 <div class="accordion-item border-top"><h6 class="mb-0 me-2 d-flex align-items-center justify-content-left">Agregar Servicios Especiales</h6>
//                       <h2 class="accordion-header" id="ServicioAdicionalProveedor">
//                         <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#TipoServicio_Proveedor" aria-expanded="false" aria-controls="TipoServicio_Proveedor">
//                         Seleccionar Servicio(s) especial(es)
//                         </button>
//                       </h2>
//                       <div class="accordion-collapse collapse" id="TipoServicio_Proveedor" aria-labelledby="TipoServicio" data-bs-parent="#accordionExample" style="">
//                         <div class="accordion-body pt-0" id="contenido_Proveedor">
//                         <div class="row">
//                             <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12"
//                               id="contenido_servicio_especial_list_Proveedor" style="display:block;">
//                               <div class="mb-0">
//                                 <label class="form-label">(*) Tipo de Vehiculo:</label>
//                                 <select class="form-select form-select-sm fs-9" id="list_servicio_especial2_Proveedor"
//                                   name="list_servicio_especial_[]" multiple="multiple" style="width: 100%;font-size: 10px;">
//                                 </select>
//                                 <div id="contenedor_valores_servicios" class="mt-2"></div>
//                               </div>
//                             </div>

//                             <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12"
//                               id="ls_servicio_especial_list_Proveedor" style="display:block;">
//                               <div class="mb-0">
//                                 <label class="form-label"></label>
//                               </div>
//                             </div>
//                         </div>

//                             <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 " id="ls_servicio_especial_list_Proveedor" style="display:block;">
//                               <div class="mb-0 text-end">
//                                 <label class="form-label"></label>
//                                   <button class="btn btn-success btn-sm py-1" id="btn_guardar_se_Proveedor" type="button" style="display: block;" data-maestroId="${MaestroId}"> 
//                                     <span class="uil uil-play-circle"></span> Guardar Servicios
//                                   </button>
//                               </div>
//                             </div>
//                       </div>
//                 </div>
//              </div>

//               <hr class="my-1 text-dark">
//                   <div class="d-flex align-items-center justify-content-between">
//                     <h6 class="mb-0 me-2 d-flex align-items-center justify-content-center">Observaciones</h6>
//                   </div>
//               <hr class="my-1 text-dark">
//               <textarea class="form-control form-control-sn observacion_opcion" disabled id="observacion_recurso" rows="1" placeholder="Observaciones" oninput="this.value = this.value.toUpperCase();"></textarea>

//               <hr class="my-1 text-dark">
//                <div class="d-flex align-items-center justify-content-between">
//                 <h6 class="mb-0 me-2 d-flex align-items-center justify-content-center">Servicios</h6>
//                   <div class="col-11">
//                     <div class="row justify-content-end">
//                       <div class="col-auto">
//                         <button class="btn btn-primary btn-sm py-1" id="btn_iniciar_recurso" type="button" data-RecursoId=${MaestroId} data-procesoId=${Proceso}>
//                           <span class="uil uil-save"></span> Iniciar
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                </div>
//               <hr class="my-1 text-dark">
//               <div class="table-responsive scrollbar" style="display: none;" id="tbl_recursos_proveedor">
//                 <table class="table table-sm text-center" style="font-size: 11px;">
//                   <thead>
//                     <tr>
//                       <th scope="col" style='width: auto; white-space: nowrap;'>Proveedor</th>
//                       <th scope="col" style='width: auto; white-space: nowrap;'>Servicio</th>
//                       <th scope="col" style='width: auto; white-space: nowrap;'>Vehiculo</th>
//                       <th scope="col" style='width: auto; white-space: nowrap;'>Fecha Registro</th>
//                       <th scope="col" style='width: auto; white-space: nowrap;'>Fecha Limite</th>
//                       <th scope="col" style='width: auto; white-space: nowrap;'>Estado</th>
//                       <th scope="col" style='width: auto; white-space: nowrap;'>Acciones</th>
//                     </tr>
//                   </thead>
//                   <tbody id="tbody_servicios_recurso" class="text-center">
//                     <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
//                   </tbody>
//                 </table>
//                   <hr class="my-1 text-dark">
//                     <h6 class="mb-0 me-2 d-flex align-items-center justify-content-start">Valores Propuestos</h6>
//                   <hr class="my-1 text-dark">
//                   <table class="table table-sm text-center" style="font-size: 11px;">
//                     <thead>
//                       <tr>
//                         <th scope="col" style='width: auto; white-space: nowrap;'>#</th>
//                         <th scope="col" style='width: auto; white-space: nowrap;'>Valor Propuesto</th>
//                         <th scope="col" style='width: auto; white-space: nowrap;'>Fecha Inicio</th>
//                         <th scope="col" style='width: auto; white-space: nowrap;'>Cedula conductor</th>
//                         <th scope="col" style='width: auto; white-space: nowrap;'>Nombre conductor</th>
//                         <th scope="col" style='width: auto; white-space: nowrap;'>Placa</th>
//                       </tr>
//                     </thead>
//                     <tbody id="tbody_propuestos_proveedor" class="text-center">
//                       <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
//                     </tbody>
//                   </table>
//                   <INPUT type="hidden" id="PlacaGanadora">
//               </div>

//               <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" id="cargue_masivo" style="display:none;">
//                 <!-- 1) Input para seleccionar el archivo de Excel -->
//                 <div class="mb-3">
//                   <label class="form-label" for="customFileSm">Subir Archivo</label>
//                   <input type="file" class="form-control form-control-sm" id="excelFile" accept=".xls, .xlsx" onchange="leerExcel()" placeholder="Seleccionar Archivo">
//                 </div>
//               </div>

//               <!-- 3) Área de previsualización -->
//               <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" id="visualizar_pedidos"
//                 style="display:none;">
//                 <h6>Vista Previa</h6>
//                 <div class="form-group col-xs-12">
//                   <div class="table-responsive">
//                     <table class="table table-striped table-sm" id="previewTable" cellpadding="0" border="1"
//                       style="width: 100%; border: #332D2D;">
//                       <!-- Aquí se generarán dinámicamente las filas -->
//                     </table>
//                   </div>
//                 </div>
//               </div>
//               <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
//                 <div class="row justify-content-end">
//                   <div class="col-auto">
//                     <button class="btn btn-success btn-sm py-1" id="btn_guardar_trazabilidad" type="button" style="display: none;"> 
//                       <span class="uil uil-import"></span> Importar Trazabilidad
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <hr class="my-1 text-dark mt-3">
//               <h6>Motivo Cancelación</h6>
//             <hr class="my-1 text-dark">
//                 ${MotivoCancelacion}

//           </div>
//       `);
//       traer_servicio_especial();
//       Listar_pedidos_recursos(MaestroId, proveedor_id, Proceso, EstadoRecurso);
//       document.getElementById("btn_guardar_se_Proveedor").setAttribute('data-servicioId', ServicioId);
//       document.getElementById("btn_guardar_se_Proveedor").setAttribute('data-proveedorId', proveedor_id);
//       document.getElementById("btn_guardar_se_Proveedor").setAttribute('data-recursoId', MaestroId);
//       myOffcanvas.updateHeight('100vh');
//       myOffcanvas.updateWidth('75%');
//       myOffcanvas.updateClass('offcanvas-end');
//       myOffcanvas.show();
//     }

//     if (e.target.matches("#btn_proceso_servicios_recurso") || e.target.matches("#btn_proceso_servicios_recurso *")) {
//       let recurso = e.target.getAttribute("data-recurso");
//       let numdoc = e.target.getAttribute("data-numdoc_solicitud");

//       let filaProveedores = document.getElementById(`Recurso_proveedores_${numdoc}`);

//       if (!filaProveedores) {
//         console.error(`No se encontró el <tr> con id #Recurso_proveedores_${numdoc}`);
//         return;
//       }

//       // Mostrar u ocultar la fila de servicios
//       if (filaProveedores.style.display === "none") {
//         filaProveedores.style.display = "table-row";

//         // Obtener servicios si aún no se han cargado
//         if (filaProveedores.querySelector(".lista-proceso-proveedores").innerHTML.trim() === "") {

//           try {
//             let formData = new FormData();
//             formData.append("MaestroId", recurso);
//             // formData.append("numdoc", numdoc);

//             // let response = await fetch($('#base_url').val() + 'torrecontrol/listar_detalle_proveedores_servicio', {
//             let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_servicios_pedidos_recursos', {
//               method: "POST",
//               body: formData
//             });
//             let data = await response.json();
//             if (data) {
//               let serviciosHTML = ' <div class="accordion" id="accordionExample">';
//               data.forEach((proveedor) => {
//                 serviciosHTML += `
//                   <div class="accordion-item border-top">
//                     <h2 class="accordion-header" id="TipoServicio${proveedor.tipo_servicio}">
//                       <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#TipoServicio_${proveedor.servicio_id}" aria-expanded="false" aria-controls="TipoServicio_${proveedor.servicio_id}">
//                         ${proveedor.tipo_servicio}
//                       </button>
//                     </h2>
//                     <div class="accordion-collapse collapse" id="TipoServicio_${proveedor.servicio_id}" aria-labelledby="TipoServicio${proveedor.tipo_servicio}" data-bs-parent="#accordionExample" style="">
//                       <div class="accordion-body pt-0" id="contenido${proveedor.servicio_id}"></div>
//                     </div>
//                   </div>
//                 `;
//               });
//               serviciosHTML += '</div>';
//               filaProveedores.querySelector(".lista-proceso-proveedores").innerHTML = serviciosHTML;
//             } else {
//               filaProveedores.querySelector(".lista-proceso-proveedores").innerHTML = `<p class="text-danger">${data.message}</p>`;
//             }
//           } catch (error) {
//             console.error("Error al obtener servicios:", error);
//             filaProveedores.querySelector(".lista-proceso-proveedores").innerHTML = `<p class="text-danger">Error al cargar proveedores</p>`;
//           } finally { }
//         }
//       }
//     }

//     if (e.target.matches("#btn_iniciar_recurso") || e.target.matches("#btn_iniciar_recurso *")) {
//       let enlace = e.target.closest("#btn_iniciar_recurso");
//       let RecursoId = enlace.getAttribute("data-RecursoId");
//       let proceso = enlace.getAttribute("data-procesoId");
//       let SolicitudesId = enlace.getAttribute("data-SolicitudesId");
//       let proveedor_id = document.getElementById("proveedor_id").value;

//       try {
//         let formData = new FormData();
//         formData.append("RecursoId", RecursoId);
//         formData.append("proveedor_id", proveedor_id);
//         formData.append("proceso", proceso);
//         formData.append("SolicitudesId", SolicitudesId);

//         let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_recursos_proveedor', {
//           method: "POST",
//           body: formData
//         });

//         let data = await response.json();
//         if (data) {
//           document.getElementById("tbl_recursos_proveedor").style.display = "";
//           let rows = "";
//           let col_estatus_publicacion = '';
//           let btn_postular_gestion_servicio = '';
//           data.forEach((servicio, index) => {
//             if (servicio.estado_servicio === 'Pendiente Iniciar') {
//               col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//               btn_postular_gestion_servicio = `
//               <div class="form-check form-switch text-center">
//                 <input class="form-check-input me-2" type="checkbox" name="ProveedorServiciodetalle" data-proveedorId="${servicio.proveedorId}" data-TipoServicio="${servicio.tipo_servicio}" data-pedidosId="${SolicitudesId}" data-recursoId="${RecursoId}" id="servicio_${servicio.servicioId}" value="${servicio.servicioId}">
//               </div>`;
//             } else if (servicio.estado_servicio === 'Iniciado') {
//               col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//               btn_postular_gestion_servicio = ``;
//             } else if (servicio.estado_servicio === 'Cancelado') {
//               col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//               // btn_publicacion = `<a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido" data-id="${servicio.numdoc_solicitud}" data-id2="${servicio.cliente}"><span class="uil uil-feedback"></span> Publicar Pedido</a>`;
//               btn_postular_gestion_servicio = ``;
//             } else if (servicio.estado_servicio === 'Completado') {
//               col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//               btn_postular_gestion_servicio = ``;
//             } else if (servicio.estado_servicio === 'Rechazado') {
//               col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//               btn_postular_gestion_servicio = ``;
//             } else if (servicio.estado_servicio === 'Postulado') {
//               col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//               btn_postular_gestion_servicio = ``;
//             }

//             rows += `
//                 <tr>
//                   <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.razon_social}</td>
//                   <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.tipo_servicio}</td>
//                   <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.vehiculo}</td>
//                   <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.Fecha_registro}</td>
//                   <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_limite}</td>
//                   <td class='text-center' style='width: auto; white-space: nowrap;'>${col_estatus_publicacion}</td>
//                   <td class='text-center' style='width: auto; white-space: nowrap;'>
//                     ${btn_postular_gestion_servicio}
//                   </td>
//                 </tr>
//                 <tr id="detalle_recurso_proveedores_asignados_${servicio.servicioId}" style="display: none;">
//                   <td colspan="12">
//                     <div class="lista-detalle-accion-proveedores"></div>
//                   </td>
//                 </tr>
//               `;
//           });

//           document.getElementById("tbody_servicios_recurso").innerHTML = rows;
//           Listar_pedidos_recursos(RecursoId, proveedor_id, proceso);
//           listar_recursos_administrador(fechaColombia, fechaColombia, '', '', '');
//         } else {
//           document.getElementById("tbody_servicios_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
//         }
//       } catch (error) {
//         console.error("Error al obtener proveedores:", error);
//         document.getElementById("tbody_servicios_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
//       }
//     }

//     if (e.target.matches("#btn_guardar_postulacion") || e.target.matches("#btn_guardar_postulacion *")) {
//       let enlace = e.target.closest("#btn_guardar_postulacion");
//       let proveedorId = enlace.getAttribute("data-id");
//       let servicioId = enlace.getAttribute("data-id2");
//       let PedidosId = enlace.getAttribute("data-id3");
//       // console.log("🚀 ~ PedidosId:", typeof JSON.stringify(PedidosId));
//       let SolicitudesArray = PedidosId.split(",").map(Number);
//       // let SolicitudesArray = PedidosId.split(","); 

//       let TipoServicio = enlace.getAttribute("data-id4");
//       let Porceso = enlace.getAttribute("data-id5");
//       let RecursoId = enlace.getAttribute("data-id6");
//       let fecha_inicio = document.getElementById("fecha_inicio").value.trim();
//       let hora_inicio = document.getElementById("hora_inicio").value.trim();

//       let formData = new FormData();
//       let errores = [];

//       if (TipoServicio === "Despachos" || TipoServicio === "Transporte") {
//         let placa = document.getElementById("placa").value.trim();
//         let flete = document.getElementById("flete").value.trim();
//         let cedula_conductor = document.getElementById("cedula_conductor").value.trim();
//         let nombre_conductor = document.getElementById("nombre_conductor").value.trim();

//         if (!placa) errores.push("El campo Placa es obligatorio.");
//         if (!flete) errores.push("El campo Flete es obligatorio.");
//         if (!fecha_inicio) errores.push("El campo Fecha Inicio es obligatorio.");
//         if (!hora_inicio) errores.push("El campo Hora Inicio es obligatorio.");

//         //Nuevos datos para los otros metodos
//         let capacidad = document.getElementById("capacidad").value.trim();
//         let tiempo_libre = document.getElementById("tiempo_libre").value.trim();
//         let valor_dia = document.getElementById("valor_dia").value.trim();
//         let estado_vehiculo = document.getElementById("estado_vehiculo").value.trim();
//         let contenedor = document.getElementById("contenedor").value.trim();
//         let tara = document.getElementById("tara").value.trim();

//         if (errores.length > 0) {
//           alert(errores.join("\n"));
//           return;
//         }

//         formData.append("proveedorId", proveedorId);
//         formData.append("servicioId", servicioId);
//         formData.append("PedidosId", JSON.stringify(SolicitudesArray));
//         formData.append("placa", placa);
//         formData.append("flete", flete);
//         formData.append("cedula_conductor", cedula_conductor);
//         formData.append("nombre_conductor", nombre_conductor);
//         formData.append("fecha_inicio", fecha_inicio);
//         formData.append("hora_inicio", hora_inicio);
//         formData.append("capacidad", capacidad);
//         formData.append("tiempo_libre", tiempo_libre);
//         formData.append("valor_dia", valor_dia);
//         formData.append("estado_vehiculo", estado_vehiculo);
//         formData.append("contenedor", contenedor);
//         formData.append("tara", tara);
//         formData.append("Proceso", Porceso);
//         formData.append("RecursoId", RecursoId);
//       } else {
//         let costo_servicio = document.getElementById("costo_servicio").value.trim();
//         let fecha_inicio = document.getElementById("fecha_inicio").value.trim();
//         let hora_inicio = document.getElementById("hora_inicio").value.trim();

//         if (!costo_servicio) errores.push("El campo Costo del Servicio es obligatorio.");
//         if (!fecha_inicio) errores.push("El campo Fecha Inicio es obligatorio.");
//         if (!hora_inicio) errores.push("El campo Hora Inicio es obligatorio.");

//         if (errores.length > 0) {
//           alert(errores.join("\n"));
//           return;
//         }
//         formData.append("proveedorId", proveedorId);
//         formData.append("servicioId", servicioId);
//         formData.append("PedidosId", JSON.stringify(SolicitudesArray));
//         formData.append("costo_servicio", costo_servicio);
//         formData.append("fecha_inicio", fecha_inicio);
//         formData.append("hora_inicio", hora_inicio);
//         formData.append("Proceso", Porceso);
//         formData.append("RecursoId", RecursoId);
//       }

//       if (errores.length === 0) {
//         const result = await Swal.fire({
//           title: "Seguro",
//           text: "¿Desea guardar la respuesta?",
//           icon: "warning",
//           showCancelButton: true,
//           confirmButtonColor: "#3B71CA",
//           cancelButtonColor: "#9FA6B2",
//           confirmButtonText: "Aceptar",
//           cancelButtonText: "Cancelar",
//           customClass: {
//             popup: "swal2-custom-font",
//           },
//         });

//         if (result.isConfirmed) {
//           const btn = document.querySelector("#btn_guardar_postulacion");

//           btn.disabled = true;
//           btn.innerHTML = "Guardando Posulación... ⏳";

//           try {
//             const response = await fetch($('#base_url').val() + 'torrecontrol/insertar_postulacion', {
//               method: 'POST',
//               body: formData,
//               cache: 'no-cache',
//             });

//             const data = await response.json();

//             Swal.fire({
//               title: "Mensaje!",
//               text: data.message,
//               icon: data.status ? "success" : "error",
//               draggable: true
//             }).then((result) => {
//               if (result.isConfirmed) {
//                 // location.reload(); // Recargar la página
//                 // myOffcanvas.hide();
//                 // listar_recursos_proveedor(fechaColombia, fechaColombia);
//                 Listar_servicios(RecursoId, Porceso, SolicitudesArray, proveedorId);
//               }
//             });

//           } catch (err) {
//             console.error(err);
//             Swal.fire("Error", "Error al enviar datos al servidor.", "error");
//           } finally {
//             btn.disabled = false;
//             btn.innerHTML = " <span class='uil uil-file-import'></span> Guardar Postulación";
//           }

//         }

//       }
//     }

//     const buttonCargarTrazabilidad = e.target.closest('[id^="btn_cargar_trazabilidad_"]');
//     if (buttonCargarTrazabilidad) {
//       let ServicioId = buttonCargarTrazabilidad.getAttribute("data-ServicioId");
//       let RecursoId = buttonCargarTrazabilidad.getAttribute("data-RecursoId");
//       document.getElementById("cargue_masivo").style.display = "";
//       document.getElementById("visualizar_pedidos").style.display = "";
//       document.getElementById("btn_guardar_trazabilidad").style.display = "";
//       // CargarTrazabilidad(ServicioId, RecursoId);
//       document.getElementById("btn_guardar_trazabilidad").setAttribute("data-ServicioId", ServicioId);
//       document.getElementById("btn_guardar_trazabilidad").setAttribute("data-RecursoId", RecursoId);
//     }

//     if (e.target.matches("#btn_guardar_trazabilidad") || e.target.matches("#btn_guardar_trazabilidad *")) {
//       let ServicioId = e.target.closest("[data-ServicioId]").getAttribute("data-ServicioId");
//       let RecursoId = e.target.closest("[data-RecursoId]").getAttribute("data-RecursoId");

//       if (globalData.length === 0) {
//         Swal.fire({
//           title: "Mensaje!",
//           text: "No hay datos para enviar. Primero carga y previsualiza un archivo de Excel.",
//           icon: "warning",
//           draggable: true
//         });
//         return;
//       }

//       const result = await Swal.fire({
//         title: 'Seguro',
//         text: '¿Desea aprobar la solicitud?',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3B71CA',
//         cancelButtonColor: '#9FA6B2',
//         confirmButtonText: 'Aceptar',
//         cancelButtonText: 'Cancelar',
//         customClass: {
//           popup: 'swal2-custom-font',
//         },
//       });

//       if (result.isConfirmed) {
//         const btn = document.querySelector("#btn_guardar_trazabilidad");
//         btn.disabled = true;
//         btn.innerHTML = "Importando... ⏳";

//         try {
//           // Crear objeto FormData
//           let formData = new FormData();
//           formData.append("ServicioId", ServicioId);
//           formData.append("RecursoId", RecursoId);
//           formData.append("globalData", JSON.stringify(globalData));  // Convertimos globalData a JSON

//           const response = await fetch($('#base_url').val() + 'torrecontrol/importar_trazabilidad', {
//             method: 'POST',
//             body: formData
//           });

//           const data = await response.json();

//           Swal.fire({
//             title: "Mensaje!",
//             text: data.message,
//             icon: data.status === true ? "success" : "error",
//             draggable: true
//           });

//         } catch (err) {
//           console.error(err);
//           alert("Error al enviar datos al servidor.");
//         } finally {
//           btn.disabled = false;
//           btn.innerHTML = "<span class='uil uil-file-import'></span> Importar Trazabilidad";
//         }
//       }
//     }

//     if (e.target.matches("#btn_gestion_pedido") || e.target.matches("#btn_gestion_pedido *")) {
//       let MaestroId = e.target.getAttribute("data-id");
//       //offcanvas-bottom
//       myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Gestion Pedido N°` + MaestroId);
//       myOffcanvas.updateContent(`
//         <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//           <h4 class="text-center" style="font-weight: bold;">Progreso del Pedido</h4>
//           <div class="progress" style="height:15px">
//             <div class="progress-bar progress-bar-striped active rounded-3" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;width: 0;" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top"></div>
//           </div>
//         </div>
//         <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-4" id="tabla_gestion_actividades">
//           <h4 class="text-center" style="font-weight: bold;">Listado de actividades</h4>
//           <div class="bs-example" data-example-id="simple-table">
//             <table class="table table-sm" style="font-size:12px;">
//               <thead class='table-bordered'>
//                 <tr>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>#</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Parametro</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Actividad</th>
//                   <!--<th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Costo</th>-->
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Responsable</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Criterio</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Fecha Base</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Vencimiento</th>
//                   <!--<th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Tiempo Vencimiento</th>-->
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Tiempo Parametrizado</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Estado</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Acción</th>
//                 </tr>
//               </thead>
//               <tbody id="tbody_actividades"></tbody>
//             </table>
//           </div>
//         </div>

//         <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="gestion_pedido"></div>

//         <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//           <div id="detalle_gestion"></div>
//         </div>

//       `);

//       setTimeout(() => {
//         Listar_actividades_pedido(MaestroId);
//       }, 50);

//       myOffcanvas.updateHeight('100vh');
//       myOffcanvas.updateWidth('100%');
//       myOffcanvas.updateClass('offcanvas-bottom');
//       myOffcanvas.show();
//     }

//     if (e.target.matches('#btn_cerrar_gestion') || e.target.matches('#btn_cerrar_gestion *')) {
//       // alert("hola");
//       document.getElementById('btn_cerrar_gestion').style.display = 'none';
//       document.getElementById('btn_detalle_gestion').style.display = 'block';
//       document.getElementById('btn_agregar_solicitud').style.display = 'block';
//       document.getElementById('acordeones_parametros').style.display = 'block';
//       document.getElementById('tabla_gestion_actividades').style.display = 'block';
//       document.getElementById('btn_editar_pedido').style.display = 'block';
//       // document.getElementById("btn_inicio_gestion").style.display = "block";
//       var contenido = document.getElementById('detalle_gestion');
//       contenido.innerHTML = ''; // Elimina el contenido
//     }

//     let Boton_cancelar;
//     let Boton_guardar_gestion;

//     if (e.target.matches('#btn_gestion_actividad_proveedor') || e.target.matches('#btn_gestion_actividad_proveedor *')) {
//       var padre = e.target.parentElement.parentElement;
//       var Procesos = padre.querySelector('#btn_gestion_actividad_proveedor');
//       var proceso_id = Procesos.getAttribute('data-idproceso');
//       var actividad_id = Procesos.getAttribute('data-idactividad');
//       // console.log("Proceso: " + proceso_id + " Actividad: " + actividad_id);
//       var form_gestio = document.getElementById(`proceso_numero${actividad_id}`);
//       var numero_proceso = form_gestio.getAttribute('data-idnum_proceso');
//       // console.log("Numero de proceso del formulario: " + numero_proceso);
//       Boton_cancelar = document.getElementById(`btn_cancelar_gestion${actividad_id}`);
//       Boton_guardar_gestion = document.getElementById(`btn_guardar_gestion${actividad_id}`);
//       Select_Estado_Actividad = document.getElementById(`estado_actividad${actividad_id}`);
//       Select_Estado_Actividad.addEventListener('change', async e => {
//         if (Select_Estado_Actividad.value === 'COMPLETADO') {
//           document.getElementById(`costo_ejecutado${actividad_id}`).disabled = false;
//           document.getElementById(`costo_ejecutado${actividad_id}`).value = '';
//         } else {
//           document.getElementById(`costo_ejecutado${actividad_id}`).disabled = true;
//           document.getElementById(`costo_ejecutado${actividad_id}`).value = '';
//         }
//       });

//       if (actividad_id === numero_proceso) {
//         document.getElementById(`columnaproceso${numero_proceso}`).style.display = document.getElementById(`columnaproceso${numero_proceso}`).style.display === 'none' ? 'table-row' : 'none';
//         Boton_cancelar.addEventListener('click', async e => {
//           document.getElementById(`columnaproceso${numero_proceso}`).style.display = 'none';
//         });
//         Boton_guardar_gestion.addEventListener('click', async e => {
//           let PedidoId = Boton_guardar_gestion.getAttribute('data-PedidoId');
//           let MaestroId = Boton_guardar_gestion.getAttribute('data-MaestroId');

//           if (document.getElementById('estado_actividad' + actividad_id).value === '') {
//             mensaje = `
//             <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
//               <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
//                 <strong>Mensaje!</strong> <p class="mb-0 flex-1"> Debe seleccionar un estado para este pedido</p>
//               <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
//             </div>
//             `;
//             document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
//           } else if (document.getElementById('observacion_gestion' + actividad_id).value === '') {
//             mensaje = `
//             <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
//               <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
//                 <strong>Mensaje!</strong> <p class="mb-0 flex-1"> Debe diligenciar una obsrvación  para poder gaurdar la gestión</p>
//               <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
//             </div>`;
//             document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
//             document.getElementById('observacion_gestion' + actividad_id).focus();
//           } else {
//             const result = await Swal.fire({
//               title: "Seguro",
//               text: "¿Desea realizar la operación de gestión?",
//               icon: "question",
//               showCancelButton: true,
//               confirmButtonColor: "#3B71CA",
//               cancelButtonColor: "#9FA6B2",
//               confirmButtonText: "Aceptar",
//               cancelButtonText: "Cancelar",
//               customClass: {
//                 popup: "swal2-custom-font",
//               },
//             });

//             if (result.isConfirmed) {
//               let data = new FormData();
//               data.append('nundoc', PedidoId);
//               data.append('parametros_pedido', document.getElementById('parametros_pedido' + actividad_id).value);
//               data.append('parametros_punto_pedido_opcion', document.getElementById('parametros_punto_pedido_opcion' + actividad_id).value);
//               data.append('observacion', document.getElementById('observacion_gestion' + actividad_id).value);
//               data.append('estado_actividad', document.getElementById('estado_actividad' + actividad_id).value);
//               data.append('costo_ejecutado', document.getElementById('costo_ejecutado' + actividad_id).value);
//               var documentos = document.getElementById('documento' + actividad_id).files[0];
//               if (documentos !== undefined) {
//                 data.append('documento', documentos);
//               } else {
//                 data.append('documento', 'Sin_evidencia');
//               }

//               data.append('publicar', 'NO');
//               await fetch($('#base_url').val() + 'torrecontrol/Insertar_gestion_pedido', {
//                 method: 'POST',
//                 body: data,
//                 cache: 'no-cache',
//               })
//                 .then(res => (res.ok ? res.json() : Promise.reject(res)))
//                 .catch(error => {
//                   alert(JSON.stringify(error.length) || 'Error al cargar las solicitudes');
//                 })
//                 .then(response => {
//                   if (response.numero === 200) {
//                     mensaje = `
//                     <div class="alert alert-outline-success d-flex align-items-center" role="alert">
//                       <span class="fas fa-check-circle text-success fs-5 me-3"></span>
//                       <strong>Mensaje!</strong> <p class="mb-0 flex-1">${response.mensaje}</p>
//                       <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
//                     </div>`;
//                   } else {
//                     mensaje = `
//                       <div class="alert alert-outline-danger d-flex align-items-center" role="alert">
//                         <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
//                           <strong>Mensaje!</strong> <p class="mb-0 flex-1">${response.mensaje}</p>
//                         <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
//                       </div>`;
//                   }
//                   setTimeout(function () {
//                     Listar_actividades_pedido(MaestroId);
//                     document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
//                   }, 1500);
//                 });
//             }
//           }
//         });
//       }
//     }

//     let Boton_cerrar_detalle;
//     const BtnGestionTrazabilidad = e.target.closest('[id^="btn_detalle_actividad"]');
//     if (BtnGestionTrazabilidad) {
//       var padre = e.target.parentElement.parentElement;
//       var Procesos = padre.querySelector('#btn_detalle_actividad');
//       var proceso_id = Procesos.getAttribute('data-idproceso');
//       var actividad_id = Procesos.getAttribute('data-idactividad');
//       var PedidoId = Procesos.getAttribute('data-PedidoId');
//       // console.log("Proceso: " + proceso_id + " Actividad: " + actividad_id);
//       var form_gestio = document.getElementById(`detalle_actividad_numero${actividad_id}`);
//       var numero_proceso = form_gestio.getAttribute('data-idnum_proceso');
//       Boton_cerrar_detalle = document.getElementById(`btn_cerrar_detalle${actividad_id}`);
//       if (actividad_id === numero_proceso) {
//         document.getElementById(`columnadetalleactividad${numero_proceso}`).style.display = document.getElementById(`columnadetalleactividad${numero_proceso}`).style.display === 'none' ? 'table-row' : 'none';
//         // Detalles_actividaes(PedidoId, actividad_id);
//         setTimeout(() => {
//           Detalles_actividaes(PedidoId, actividad_id);
//         }, 50);
//         // Boton_cerrar_detalle.addEventListener('click', async e => {
//         //   document.getElementById(`columnadetalleactividad${numero_proceso}`).style.display = 'none';
//         // });
//       }
//     }

//     const BtnGuardarTrazabilidad = e.target.closest('[id^="btn_guardar_trazabilidad_gestion"]');
//     if (BtnGuardarTrazabilidad && consulta_tipo.length > 0) {
//       //console.log(consulta_tipo);
//       let formData = new FormData();
//       formData.append("datos_trazabilidad", JSON.stringify(consulta_tipo));
//       formData.append('traza', document.getElementById(`select_tipo_trazabilidad`).value);
//       /*for (let pair of formData.entries()) {
//         console.log(`${pair[0]}: ${pair[1]}`);
//       }*/


//       if (document.getElementById(`select_tipo_trazabilidad`).value !== 'Fecha Estimada Entrega') {
//         formData.append('observacion', document.getElementById(`observacion_gestion_trazabilidad`).value);
//         var documentos = document.getElementById(`documento_trazabilidad`).files[0];
//         if (documentos !== undefined) {
//           formData.append('documento', documentos);
//         } else {
//           formData.append('documento', 'Sin_evidencia');
//         }

//         try {
//           let response = await fetch($('#base_url').val() + 'torrecontrol/insertar_trazabilidad_pedido', {
//             method: "POST",
//             body: formData
//           });

//           let data = await response.json();
//           if (data) {
//             Swal.fire({
//               title: "Mensaje!",
//               html: data.mensaje,
//               icon: "success",
//               draggable: true
//             });
//             setTimeout(function () {
//               location.reload(false);
//             }, 1000);
//           } else {
//             Swal.fire({
//               title: "Mensaje!",
//               html: data.mensaje,
//               icon: "error",
//               draggable: true
//             });
//           }
//         } catch (error) {

//         }
//       }


//       if (document.getElementById(`select_tipo_trazabilidad`).value === 'Fecha Estimada Entrega') {
//         console.log(document.getElementById(`select_tipo_trazabilidad`).value);
//         let FechaEstimada = document.getElementById(`fecha_estimada_entrega`).value;
//         let HoraEstimada = document.getElementById(`hora_estimada_entrega`).value;

//         try {


//           // formData.append('ReferenciaPedido', ReferenciaPedido);
//           //formData.append('tipoTrazabilidad', tipoTrazabilidad);
//           // formData.append('SolicitudId', SolicitudId);
//           formData.append('FechaEstimada', FechaEstimada);
//           formData.append('HoraEstimada', HoraEstimada);

//           let response = await fetch($('#base_url').val() + 'torrecontrol/insertar_fecha_estimada', {
//             method: "POST",
//             body: formData
//           });

//           let data = await response.json();
//           if (data.success === true) {
//             Swal.fire({
//               title: "Mensaje!",
//               html: data.message,
//               icon: "success",
//               draggable: true
//             });
//             setTimeout(function () {
//               location.reload(false);
//             }, 1000);
//           } else {
//             Swal.fire({
//               title: "Mensaje!",
//               html: data.message,
//               icon: "error",
//               draggable: true
//             });
//           }
//         } catch (error) {
//           console.error('Error en la solicitud:', error);
//           Swal.fire({
//             icon: 'error',
//             title: 'Error de red',
//             text: 'No se pudo conectar al servidor',
//           });
//         }



//       }

//     }

//     const BtnGuardarFechaEstimada = e.target.closest('[id^="btn_guardar_trazabilidad_fecha_estimada"]');
//     if (BtnGuardarFechaEstimada) {
//       let SolicitudId = e.target.getAttribute("data-SolicitudId");
//       let ReferenciaPedido = e.target.getAttribute("data-ReferenciaPedido");
//       let tipoTrazabilidad = document.getElementById(`select_tipo_trazabilidad${SolicitudId}`).value;
//       let FechaEstimada = document.getElementById(`fecha_estimada_entrega${SolicitudId}`).value;
//       let HoraEstimada = document.getElementById(`hora_estimada_entrega${SolicitudId}`).value;

//       if (!FechaEstimada || !HoraEstimada) {
//         Swal.fire({
//           title: "Mensaje!",
//           text: "Debe seleccionar una fecha y hora estimada.",
//           icon: "warning",
//           draggable: true
//         });
//         return;
//       }


//       const result = await Swal.fire({
//         title: '¿Seguro?',
//         text: '¿Desea Actualizar Fecha Entrega del pedido? ' + ReferenciaPedido,
//         icon: 'question',
//         showCancelButton: true,
//         confirmButtonColor: '#3B71CA',
//         cancelButtonColor: '#9FA6B2',
//         confirmButtonText: 'Aceptar',
//         cancelButtonText: 'Cancelar',
//         customClass: {
//           popup: 'swal2-custom-font',
//         },
//       });

//       if (result.isConfirmed) {
//         try {

//           let formData = new FormData();
//           formData.append('ReferenciaPedido', ReferenciaPedido);
//           formData.append('tipoTrazabilidad', tipoTrazabilidad);
//           formData.append('SolicitudId', SolicitudId);
//           formData.append('FechaEstimada', FechaEstimada);
//           formData.append('HoraEstimada', HoraEstimada);

//           let response = await fetch($('#base_url').val() + 'torrecontrol/insertar_fecha_estimada', {
//             method: "POST",
//             body: formData
//           });

//           let data = await response.json();
//           if (data.success === true) {
//             Swal.fire({
//               title: "Mensaje!",
//               html: data.message,
//               icon: "success",
//               draggable: true
//             });
//             setTimeout(function () {
//               location.reload(false);
//             }, 1000);
//           } else {
//             Swal.fire({
//               title: "Mensaje!",
//               html: data.message,
//               icon: "error",
//               draggable: true
//             });
//           }
//         } catch (error) {
//           console.error('Error en la solicitud:', error);
//           Swal.fire({
//             icon: 'error',
//             title: 'Error de red',
//             text: 'No se pudo conectar al servidor',
//           });
//         }
//       }
//     }

//     const BtnImportarTrazaPedido = document.getElementById(`btn_guardar_trazabilidad_pedido`);

//     if (BtnImportarTrazaPedido?.contains(e.target)) {
//       if (globalData.length === 0) {
//         Swal.fire({
//           title: "Mensaje!",
//           text: "No hay datos para enviar. Primero carga y previsualiza un archivo de Excel.",
//           icon: "warning",
//           draggable: true
//         });
//         return;
//       }

//       const result = await Swal.fire({
//         title: 'Seguro',
//         text: '¿Desea aprobar la solicitud?',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3B71CA',
//         cancelButtonColor: '#9FA6B2',
//         confirmButtonText: 'Aceptar',
//         cancelButtonText: 'Cancelar',
//         customClass: {
//           popup: 'swal2-custom-font',
//         },
//       });

//       if (result.isConfirmed) {
//         const btn = document.querySelector("#btn_guardar_trazabilidad_pedido");
//         btn.disabled = true;
//         btn.innerHTML = "Importando... ⏳";

//         try {
//           // Crear objeto FormData
//           let formData = new FormData();
//           // formData.append("ServicioId", ServicioId);
//           // formData.append("RecursoId", RecursoId);
//           formData.append("globalData", JSON.stringify(globalData));  // Convertimos globalData a JSON

//           const response = await fetch($('#base_url').val() + 'torrecontrol/importar_trazabilidad_pedido', {
//             method: 'POST',
//             body: formData
//           });

//           const data = await response.json();

//           Swal.fire({
//             title: "Mensaje!",
//             text: data.message,
//             icon: data.status === true ? "success" : "error",
//             draggable: true
//           });

//         } catch (err) {
//           console.error(err);
//           alert("Error al enviar datos al servidor.");
//         } finally {
//           btn.disabled = false;
//           btn.innerHTML = "<span class='uil uil-file-import'></span> Importar Trazabilidad";
//         }
//       }
//     }

//     if (e.target.matches('#btn_rechazar_recurso') || e.target.matches("#btn_rechazar_recurso *")) {
//       // const btn = document.querySelector("#btn_rechazar_recurso");
//       let btn = e.target.closest("#btn_rechazar_recurso");
//       let data_recurso = btn.getAttribute("data-id");
//       console.log(data_recurso);


//       const result = await Swal.fire({
//         title: "Seguro",
//         text: "¿Desea guardar la respuesta?",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3B71CA",
//         cancelButtonColor: "#9FA6B2",
//         confirmButtonText: "Aceptar",
//         cancelButtonText: "Cancelar",
//         customClass: {
//           popup: "swal2-custom-font",
//         },
//       });

//       if (result.isConfirmed) {

//         btn.disabled = true;
//         btn.innerHTML = "Guardando Posulación... ⏳";
//         let formData = new FormData();
//         formData.append("data_recurso", data_recurso);

//         try {
//           const response = await fetch($('#base_url').val() + 'torrecontrol/Rechazar_recurso', {
//             method: 'POST',
//             body: formData,
//             cache: 'no-cache',
//           });

//           const data = await response.json();

//           Swal.fire({
//             title: "Mensaje!",
//             text: data.mensaje,
//             icon: data.numero === 200 ? "success" : "error",
//             draggable: true
//           }).then((result) => {
//             if (result.isConfirmed) {
//               listar_recursos_administrador(fechaColombia, fechaColombia, '', '', '');
//               // Listar_servicios(RecursoId, Porceso, SolicitudesArray, proveedorId);
//             }
//           });

//         } catch (err) {
//           console.error(err);
//           Swal.fire("Error", "Error al enviar datos al servidor.", "error");
//         } finally {
//           btn.disabled = false;
//           btn.innerHTML = " <span class='uil uil-file-import'></span> Guardar Postulación";
//         }

//       }



//     }

//     if (e.target.matches(`#id_rechazar_se`) || (e.target.matches(`#id_rechazar_se *`))) {
//       alert("ok");
//       let boton = e.target.closest('#id_rechazar_se'); // Capturamos el botón real
//       let RecursoId = boton.getAttribute('data-RecursoId');
//       // console.log(RecursoId);
//       let ServicioId = boton.getAttribute('data-ServicioId');
//       let ProveedorId = boton.getAttribute('data-ProveedorId');
//       const result = await Swal.fire({
//         title: "Seguro",
//         text: "¿Desea rechazar el servicio especial?",
//         icon: "question",
//         showCancelButton: true,
//         confirmButtonColor: "#3B71CA",
//         cancelButtonColor: "#9FA6B2",
//         confirmButtonText: "Aceptar",
//         cancelButtonText: "Cancelar",
//         customClass: {
//           popup: "swal2-custom-font",
//         },
//       });
//       if (result.isConfirmed) {
//         let dato = new FormData();
//         dato.append('RecursoId', RecursoId);
//         dato.append('ServicioId', ServicioId);
//         dato.append('ProveedorId', ProveedorId);
//         try {
//           const response = await fetch($('#base_url').val() + 'torrecontrol/rechazar_servicio_espacial', {
//             method: 'POST',
//             body: dato,
//             cache: 'no-cache',
//           });
//           const data = await response.json();
//           Swal.fire({
//             title: "Mensaje!",
//             text: data.message,
//             icon: data.success ? "success" : "error",
//             draggable: true
//           }).then((result) => {
//             if (result.isConfirmed) {
//               myOffcanvas.hide();
//             }
//           });
//         } catch (error) {

//         }
//       }
//     }

//     if (e.target.matches('#btn_guardar_se_Proveedor') || e.target.matches('#btn_guardar_se_Proveedor *')) {
//       const maestroId = e.target.getAttribute("data-maestroId");
//       const servicioId = e.target.getAttribute("data-servicioId");
//       const proveedorId = e.target.getAttribute("data-proveedorId");
//       const recursoId = e.target.getAttribute("data-recursoId");

//       let formData = new FormData();
//       formData.append("servicio_id", servicioId);
//       formData.append("proveedor_id", proveedorId);
//       formData.append("maestro_id", maestroId);

//       // RECORRER LOS SERVICIOS
//       document.querySelectorAll('.valor_servicio_input').forEach((input, index) => {
//         formData.append(`servicios[${index}][id]`, input.dataset.id);
//         formData.append(`servicios[${index}][valor]`, input.value);
//       });

//       // Enviar petición
//       const response = await fetch(`${$('#base_url').val()}torrecontrol/GuardarServiciosEspeciales`, {
//         method: "POST",
//         body: formData
//       });

//       // 👉 PROBAR ANTES DE PARSEAR JSON
//       const text = await response.text();
//       console.log("RESPUESTA CRUDA:", text);

//       let json;
//       try {
//         json = JSON.parse(text);
//       } catch (err) {
//         Swal.fire("Error", "El servidor no devolvió JSON. Revisa la consola.", "error");
//         return;
//       }

//       if (json.success) {
//         Swal.fire("Guardado", "Los servicios fueron registrados.", "success");
//       } else {
//         Swal.fire("Error", json.message, "error");
//       }
//     }
//   });

//   // Evento para mostrar/ocultar proveedores con el checkbox y hacer la petición AJAX
//   document.addEventListener("change", async (e) => {
//     if (e.target.matches("input[name='ProveedorServiciodetalle']")) {
//       let ServicioId = e.target.value;
//       let proveedorId = e.target.getAttribute("data-proveedorId");
//       let TipoServicio = e.target.getAttribute("data-TipoServicio");
//       let PedidosId = e.target.getAttribute("data-pedidosId");
//       let RecursoId = e.target.getAttribute("data-recursoId");
//       let Modalidad = e.target.getAttribute("data-modalidad");

//       let filaServicios = document.getElementById(`detalle_recurso_proveedores_asignados_${ServicioId}`);
//       // Mostrar u ocultar la fila de servicios
//       if (filaServicios.style.display === "none") {
//         filaServicios.style.display = "table-row";
//         // Obtener servicios si aún no se han cargado
//         if (filaServicios.querySelector(".lista-detalle-accion-proveedores").innerHTML.trim() === "") {
//           filaServicios.querySelector(".lista-detalle-accion-proveedores").innerHTML = `
//             <div class="container-fluid pt-3">
//                 <div id="despachos" style="display: none;">
//                   <div class="row">
//                     <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
//                       <div class="mb-2">
//                         <label style="font-size: 12px;">Placa</label>
//                         <input type="text" id="placa" name="placa" class="form-control form-control-sm" placeholder="Placa" oninput="this.value = this.value.toUpperCase();">
//                       </div>
//                     </div>
//                     <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
//                       <div class="mb-2">
//                         <label style="font-size: 12px;">Cedula</label>
//                         <input type="text" id="cedula_conductor" name="cedula_conductor" class="form-control form-control-sm" placeholder="Cedula" oninput="this.value = this.value.toUpperCase();">
//                       </div>
//                     </div>
//                     <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
//                       <div class="mb-2">
//                         <label style="font-size: 12px;">Nombre</label>
//                         <input type="text" id="nombre_conductor" name="nombre_conductor" class="form-control form-control-sm" placeholder="Nombre" oninput="this.value = this.value.toUpperCase();">
//                       </div>
//                     </div>

//                     <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
//                       <div class="mb-2">
//                         <label style="font-size: 12px;">Flete</label>
//                         <input type="text" id="flete" name="flete" class="form-control form-control-sm" placeholder="Flete">
//                       </div>
//                     </div>

//                     <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4" id="carga_liquida"  style="display: none;">
//                       <div class="mb-2">
//                         <label style="font-size: 12px;">Capacidad</label>
//                         <input type="text" id="capacidad" name="capacidad" class="form-control form-control-sm" placeholder="Capacidad">
//                       </div>
//                     </div>

//                     <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4" id="carga_liquida2"  style="display: none;">
//                       <div class="mb-2">
//                         <label style="font-size: 12px;">Tiempo Libre</label>
//                         <input type="text" id="tiempo_libre" name="tiempo_libre" class="form-control form-control-sm" placeholder="Tiempo Libre">
//                       </div>
//                     </div> 

//                     <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4" id="carga_liquida3"  style="display: none;">
//                       <div class="mb-2">
//                         <label style="font-size: 12px;">Valor día de Stand By</label>
//                         <input type="text" id="valor_dia" name="valor_dia" class="form-control form-control-sm" placeholder="Valor día de Stand By">
//                       </div>
//                     </div>

//                     <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4 mt-4" id="carga_liquida4"  style="display: none;">
//                       <div class="form-check form-switch">
//                         <input class="form-check-input" id="estado_vehiculo" type="checkbox">
//                         <label class="form-check-label" for="estado_vehiculo">Respuesta cumplimiento de requisitos de vehículo</label>
//                       </div>
//                     </div>


//                     <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4" id="carga_importacion_exportacion"  style="display: none;">
//                       <div class="mb-2">
//                         <label style="font-size: 12px;">Contenedor</label>
//                         <input type="text" id="contenedor" name="contenedor" class="form-control form-control-sm" placeholder="# contenedor">
//                       </div>
//                     </div>

//                     <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4" id="carga_exportacion_importacion"  style="display: none;">
//                       <div class="mb-2">
//                         <label style="font-size: 12px;">Tara</label>
//                         <input type="text" id="tara" name="tara" class="form-control form-control-sm" placeholder="Tara">
//                       </div>
//                     </div>

//                   </div>
//                 </div>

//                 <div id="otros" style="display: none;">
//                   <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
//                     <div class="mb-3">
//                       <label style="font-size: 12px;">Valor Servicio</label>
//                       <input type="text" id="costo_servicio" name="costo_servicio" class="form-control form-control-sm" placeholder="Valor Servicio">
//                     </div>
//                   </div>
//                 </div>

//                 <div class="row">
//                   <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                     <div class="mb-3">
//                       <label style="font-size: 12px;">Fecha Inicio del servicio</label>
//                       <input type="date" id="fecha_inicio" name="fecha_inicio" class="form-control form-control-sm">
//                     </div>
//                   </div>

//                   <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                     <div class="mb-3">
//                       <label style="font-size: 12px;">Hora Inicio del servicio</label>
//                       <input type="time" id="hora_inicio" name="hora_inicio" class="form-control form-control-sm">
//                     </div>
//                   </div>
//                 </div>

//                 <div class="col-12 gy-6 my-3" id="btn-acciones">
//                   <div class="row g-3 justify-content-end">
//                     <div class="col-auto">
//                       <button class="btn btn-success btn-sm" id="btn_guardar_postulacion" type="button" data-id="${proveedorId}" data-id2="${ServicioId}" data-id3="${PedidosId}" data-id4="${TipoServicio}" data-id5="${ServicioId}" data-id6="${RecursoId}">
//                         <span class="uil uil-file-import"></span> Guardar Postulación
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//             </div>
//           `;

//           /* Validar el modalidad */
//           // if (Modalidad === "CARGA LIQUIDA") {
//           //   document.getElementById("carga_liquida").style.display = "";
//           //   document.getElementById("carga_liquida2").style.display = "";
//           //   document.getElementById("carga_liquida3").style.display = "";
//           //   document.getElementById("carga_liquida4").style.display = "";
//           // } else {
//           //   document.getElementById("carga_liquida").style.display = "none";
//           //   document.getElementById("carga_liquida2").style.display = "none";
//           //   document.getElementById("carga_liquida3").style.display = "none";
//           //   document.getElementById("carga_liquida4").style.display = "none";
//           // }

//           // if (Modalidad === "IMPORTACION" || Modalidad === "EXPORTACION") {
//           //   document.getElementById("carga_importacion_exportacion").style.display = "";
//           //   document.getElementById("carga_exportacion_importacion").style.display = "";
//           // } else {
//           //   document.getElementById("carga_importacion_exportacion").style.display = "none";
//           //   document.getElementById("carga_exportacion_importacion").style.display = "none";
//           // }

//           if (Modalidad === "CARGA LIQUIDA") {
//             document.getElementById("carga_liquida").style.display = "";
//             document.getElementById("carga_liquida2").style.display = "";
//             document.getElementById("carga_liquida3").style.display = "";
//             // document.getElementById("carga_liquida4").style.display = "";
//             document.getElementById("carga_importacion_exportacion").style.display = "";
//             document.getElementById("carga_exportacion_importacion").style.display = "";
//           } else {
//             document.getElementById("carga_liquida").style.display = "none";
//             document.getElementById("carga_liquida2").style.display = "none";
//             document.getElementById("carga_liquida3").style.display = "none";
//             document.getElementById("carga_liquida4").style.display = "none";
//             document.getElementById("carga_importacion_exportacion").style.display = "none";
//           }

//           if (Modalidad === "IMPORTACION" || Modalidad === "EXPORTACION") {
//             document.getElementById("carga_importacion_exportacion").style.display = "";
//             document.getElementById("carga_exportacion_importacion").style.display = "";
//             document.getElementById("carga_liquida").style.display = "";
//             document.getElementById("carga_liquida2").style.display = "";
//             document.getElementById("carga_liquida3").style.display = "";
//           } else {
//             // document.getElementById("carga_importacion_exportacion").style.display = "none";
//             // document.getElementById("carga_exportacion_importacion").style.display = "none";
//           }

//           /* Validar el tipo de servicio */
//           if (TipoServicio === "Despachos") {
//             document.getElementById("despachos").style.display = "";
//           } else {
//             document.getElementById("otros").style.display = "";
//           }
//         }
//       } else {
//         filaServicios.style.display = "none";
//       }
//       // await mostrarProveedores(clienId, ServicioId);
//     }

//     if (e.target.matches("#costo_servicio") || e.target.matches("#costo_servicio *")) {
//       let costo_servicio = document.getElementById("costo_servicio").value.trim();
//       $('#costo_servicio').val(parseFloat(costo_servicio, 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//     }

//     if (e.target.matches("#flete") || e.target.matches("#flete *")) {
//       let flete = document.getElementById("flete").value.trim();
//       $('#flete').val(parseFloat(flete, 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//     }

//     const filtroContenedor = document.getElementById('rc-filtro-accion');

//     if (filtroContenedor?.contains(e.target)) {
//       const valorFiltro = filtroContenedor.value || e.target.value;
//       if (valorFiltro === 'cague masivo recursos') {
//         console.log('Valor del filtro desde le if:', valorFiltro);
//       } else if (valorFiltro === 'cargue masivo pedidos') {
//         myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Trazbilidad pedido`);
//         myOffcanvas.updateContent(`
//           <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" id="cargue_masivo_pedidos">
//             <!-- 1) Input para seleccionar el archivo de Excel -->
//             <div class="mb-3">
//               <label class="form-label" for="customFileSm">Subir Archivo</label>
//               <input type="file" class="form-control form-control-sm" id="excelFilePedidos" accept=".xls, .xlsx" onchange="leerExcelPeido()" placeholder="Seleccionar Archivo">
//             </div>
//           </div>

//           <!-- 3) Área de previsualización -->
//           <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" id="visualizar_pedidos_cargue">
//             <h6>Vista Previa</h6>
//             <div class="form-group col-xs-12">
//               <div class="table-responsive">
//                 <table class="table table-striped table-sm" id="previewTablePedidos" cellpadding="0" border="1"
//                   style="width: 100%; border: #332D2D;">
//                   <!-- Aquí se generarán dinámicamente las filas -->
//                 </table>
//               </div>
//             </div>
//           </div>
//           <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
//             <div class="row justify-content-end">
//               <div class="col-auto">
//                 <button class="btn btn-success btn-sm py-1" id="btn_guardar_trazabilidad_pedido" type="button">
//                   <span class="uil uil-import"></span> Importar Trazabilidad Pedidos
//                 </button>
//               </div>
//             </div>
//           </div>
//         `);
//         myOffcanvas.updateHeight('100vh');
//         myOffcanvas.updateWidth('75%');
//         myOffcanvas.updateClass('offcanvas-end');
//         myOffcanvas.show();
//       }
//     }

//   });

//   // ═══════════════════════════════════════
//   // KPI CARDS — filtrar por estado
//   // ═══════════════════════════════════════
//   document.querySelectorAll('.rc-kpi-resumen').forEach(function (card) {
//     card.addEventListener('click', function () {
//       document.querySelectorAll('.rc-kpi-resumen').forEach(function (c) { c.classList.remove('active'); });
//       this.classList.add('active');
//       const estado = this.dataset.estado;
//       const fi = document.getElementById('rc-fecha-inicial')?.value ?? '';
//       const ff = document.getElementById('rc-fecha-final')?.value ?? '';
//       listar_recursos_administrador(fi, ff, '', '', estado === 'todos' ? '' : estado);
//     });
//   });

//   // ── Botón Limpiar ──
//   document.getElementById('rc-btn-limpiar')?.addEventListener('click', function () {
//     ['rc-modalidad', 'rc-estado-recurso'].forEach(function (id) {
//       const el = document.getElementById(id); if (el) el.value = '';
//     });
//     const fi = document.getElementById('rc-fecha-inicial'); if (fi) fi.value = '';
//     const ff = document.getElementById('rc-fecha-final'); if (ff) ff.value = '';
//     document.querySelectorAll('.rc-kpi-resumen').forEach(function (c) { c.classList.remove('active'); });
//     const tbody = document.getElementById('tbl_administrador_recurso_pedidos');
//     if (tbody) tbody.innerHTML = `
//       <tr><td colspan="9" class="text-center" style="padding:50px;color:var(--slate-400);">
//         <i class="bi bi-inbox" style="font-size:2rem;display:block;margin-bottom:8px;"></i>
//         Filtros limpiados — realice una nueva consulta
//       </td></tr>`;
//     const badge = document.getElementById('rc-badge-total');
//     if (badge) badge.textContent = '0 registros';
//     const pagBar = document.getElementById('rc-pagination-bar');
//     if (pagBar) pagBar.style.display = 'none';
//     ['rc-kpi-total', 'rc-kpi-pendiente', 'rc-kpi-iniciado', 'rc-kpi-completado', 'rc-kpi-cancelado'].forEach(function (id) {
//       const el = document.getElementById(id); if (el) el.textContent = '0';
//     });
//   });

// }

// async function listar_recursos_administrador(fecha_inicial, fecha_final, valor, filtro, estadoRecurso) {
//   /* Funcion para enviar los datos */
//   let dato = new FormData();
//   dato.append('fecha_inicial', fecha_inicial);
//   dato.append('fecha_final', fecha_final);
//   dato.append('valor', valor ?? '');
//   dato.append('filtro', filtro ?? '');
//   dato.append('estado_recurso', estadoRecurso ?? '');
//   dato.append('proveedor_id', document.getElementById('proveedor_id').value);
//   try {
//     const response = await fetch($('#base_url').val() + 'torrecontrol/listar_recrusos_administrador', {
//       method: 'POST',
//       body: dato,
//       cache: 'no-cache',
//     });
//     const data = await response.json();
//     if (data) {
//       let tbody = document.getElementById('tbl_administrador_recurso_pedidos');
//       tbody.innerHTML = '';
//       let esatdo_recurso = '';
//       let btn_cancelacion = "";
//       let btn_removeAsignacion = "";
//       let btn_rechazar = "";
//       let btn_detalle_proceso = "";

//       data.forEach(element => {
//         const fila = document.createElement('tr');

//         if (element.estado_recurso === 'Pendiente Iniciar') {
//           esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${element.estado_recurso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_rechazar = `<a class="dropdown-item fw-bold" href="#" id="btn_rechazar_recurso" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-id2="${element.cliente}" data-EstadoRecurso="${element.estado_recurso}"><span class="uil uil-transaction"></span> Rechazar recurso</a>
//           `;
//           btn_gestion_pedidos = ``;
//           btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-id2="${element.cliente}" data-EstadoRecurso="${element.estado_recurso}" data-servicioId="${element.serivicio_id}" data-motivo_cancelacion="${element.motivo_cancelacion}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
//         } else if (element.estado_recurso === 'Iniciado') {
//           esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_recurso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-id2="${element.cliente}" data-EstadoRecurso="${element.estado_recurso}" data-servicioId="${element.serivicio_id}" data-motivo_cancelacion="${element.motivo_cancelacion}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
//           btn_rechazar = ``;
//         } else if (element.estado_recurso === 'Completado') {
//           esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado_recurso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-id2="${element.cliente}" data-EstadoRecurso="${element.estado_recurso}" data-servicioId="${element.serivicio_id}" data-motivo_cancelacion="${element.motivo_cancelacion}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
//           btn_rechazar = ``;
//         } else if (element.estado_recurso === 'Cancelado') {
//           esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.estado_recurso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-id2="${element.cliente}" data-EstadoRecurso="${element.estado_recurso}" data-servicioId="${element.serivicio_id}" data-motivo_cancelacion="${element.motivo_cancelacion}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
//           btn_rechazar = ``;
//         } else if (element.estado_recurso === 'Rechazado') {
//           esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${element.estado_recurso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-id2="${element.cliente}" data-EstadoRecurso="${element.estado_recurso}" data-servicioId="${element.serivicio_id}" data-motivo_cancelacion="${element.motivo_cancelacion}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
//           btn_rechazar = ``;
//         }

//         /* Accion para gestionar los pedidos generados a los recursos */
//         if (element.pedido_plantilla === 'SI' && element.estado_recurso !== 'Rechazado') {
//           btn_gestion_pedidos = `<a class="dropdown-item fw-bold" href="#" id="btn_gestion_pedido" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-clienteId="${element.clienteId}"><span class="uil-list-ui-alt"></span> Gestion Pedidos</a>`;
//         } else {
//           btn_gestion_pedidos = ``;
//         }

//         const columnaNundocSolicitud = document.createElement('td');
//         columnaNundocSolicitud.innerHTML = `
//         <div class="dropdown">
//           <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.referencias_pedido}</a>
//           <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
//             ${btn_detalle_proceso}
//             ${btn_gestion_pedidos}
//             ${btn_rechazar}
//           </div>
//         </div>
//         `;

//         const columnaCliente = document.createElement('td');
//         columnaCliente.innerHTML = element.nombre;
//         columnaCliente.style.width = 'auto';
//         columnaCliente.style.whiteSpace = 'nowrap';

//         const columnaModalidad = document.createElement('td');
//         columnaModalidad.innerHTML = element.modalidad;
//         columnaModalidad.style.width = 'auto';
//         columnaModalidad.style.whiteSpace = 'nowrap';

//         const columnaProceso = document.createElement('td');
//         columnaProceso.innerHTML = element.proceso === 'Asignación' ? `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.proceso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>` : `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">${element.proceso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//         columnaProceso.style.width = 'auto';
//         columnaProceso.style.whiteSpace = 'nowrap';

//         const columnaFecha = document.createElement('td');
//         columnaFecha.innerHTML = element.fecha;
//         columnaFecha.style.width = 'auto';
//         columnaFecha.style.whiteSpace = 'nowrap';

//         const columnaCar = document.createElement('td');
//         columnaCar.innerHTML = "-";
//         columnaCar.style.width = 'auto';
//         columnaCar.style.whiteSpace = 'nowrap';

//         const columnaUsuario = document.createElement('td');
//         columnaUsuario.innerHTML = element.usuario;
//         columnaUsuario.style.width = 'auto';
//         columnaUsuario.style.whiteSpace = 'nowrap';

//         const columnaEstado = document.createElement('td');
//         columnaEstado.innerHTML = esatdo_recurso;
//         columnaEstado.style.width = 'auto';
//         columnaEstado.style.whiteSpace = 'nowrap';

//         const columnaEstadoRecurso = document.createElement('td');
//         // columnaEstadoRecurso.innerHTML = esatdo_recurso;
//         columnaEstadoRecurso.dataset.id = element.maestro_id; // Guardamos el ID para su actualización posterior
//         columnaEstadoRecurso.style.width = 'auto';
//         columnaEstadoRecurso.style.whiteSpace = 'nowrap';


//         fila.appendChild(columnaNundocSolicitud);
//         fila.appendChild(columnaCliente);
//         fila.appendChild(columnaModalidad);
//         fila.appendChild(columnaProceso);
//         fila.appendChild(columnaFecha);
//         fila.appendChild(columnaCar);
//         fila.appendChild(columnaUsuario);
//         fila.appendChild(columnaEstado);
//         fila.appendChild(columnaEstadoRecurso);
//         tbody.appendChild(fila);
//       });

//       // ── KPIs + badge + paginación ──
//       rc_actualizarKpisAdmin(data);
//       const rcBadge = document.getElementById('rc-badge-total');
//       if (rcBadge) rcBadge.textContent = data.length + ' registros';
//       const rcPagBar = document.getElementById('rc-pagination-bar');
//       if (rcPagBar) {
//         rcPagBar.style.display = '';
//         const s = (id, v) => { const n = document.getElementById(id); if (n) n.textContent = v; };
//         s('rc-pag-total', data.length);
//         s('rc-pag-desde', data.length > 0 ? 1 : 0);
//         s('rc-pag-hasta', data.length);
//       }

//       await estado_recurso();
//     } else {
//       console.log('else');
//     }
//   } catch (error) {
//     console.error('Error en la primera solicitud:', error);
//     console.log('error no inserta');
//     throw error;
//   } finally {
//     // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
//   }
// }

// async function Listar_pedidos_recursos(MaestroId, proveedor_id, Proceso, EstadoRecurso) {
//   try {
//     let formData = new FormData();
//     formData.append("MaestroId", MaestroId);
//     formData.append("proveedor_id", proveedor_id);

//     let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_recursos', {
//       method: "POST",
//       body: formData
//     });

//     let data = await response.json();
//     console.log("🚀 ~ Listar_pedidos_recursos ~ data:", data)
//     if (data) {
//       let miArray = [];
//       let rows = "";

//       let totalPesoNeto = 0;
//       let totalPesoBruto = 0;
//       let totalUnidades = 0;
//       let col_estatus_publicacion = '';
//       let select_acciones = '';
//       let opciones = [
//         'Fecha Estimada Entrega',
//         'Llegada Cargue',
//         'Cargue',
//         'Salida Cargue',
//         'Inicio Ruta',
//         'Transito',
//         'Llegada Descargue',
//         'Descargue',
//         'Salida Descargue'
//       ];

//       data.sql.forEach((servicio, index) => {
//         if (servicio.peso_neto_kg) {
//           totalPesoNeto += parseFloat(servicio.peso_neto_kg);
//         }

//         if (servicio.peso_bruto_kg) {
//           totalPesoBruto += parseFloat(servicio.peso_bruto_kg);
//         }

//         if (servicio.unidades) {
//           totalUnidades += parseFloat(servicio.unidades);
//         }

//         $('#pesoNeto').text(totalPesoNeto);
//         $('#pesoBruto').text(totalPesoBruto);
//         $('#totalUnidades').text(totalUnidades);

//         miArray.push(servicio.numdoc_solicitud);

//         if (servicio.estado_proceso_pedido === 'Pendiente Iniciar') {
//           col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           select_acciones = ``;
//         } else if (servicio.estado_proceso_pedido === 'Iniciado') {
//           col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//         } else if (servicio.estado_proceso_pedido === 'Cancelado') {
//           col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_publicacion = `<a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido" data-id="${servicio.numdoc_solicitud}" data-id2="${servicio.cliente}"><span class="uil uil-feedback"></span> Publicar Pedido</a>`;
//           select_acciones = ``;
//         } else if (servicio.estado_proceso_pedido === 'Postulado') {
//           col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_publicacion = ``;
//           select_acciones = ``;
//         } else if (servicio.estado_proceso_pedido === 'Completado') {
//           col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           // Excluir la opción que ya venga en tipo_trazabilidad
//           let opcionesFiltradas = opciones.filter(opcion => opcion !== servicio.tipo_trazabilidad);

//           /*select_acciones = `
//           <select class="form-select form-select-sm me-1 px-1 py-0 w-100" onchange="trazabilidad_pedido(this.value, ${servicio.numdoc_solicitud})" id="select_tipo_trazabilidad${servicio.numdoc_solicitud}" data-id="${servicio.numdoc_solicitud}" data-Referencia="${servicio.referencia_pedido}" name="select_tipo_trazabilidad" aria-label=".form-select-sm example">
//             <option value="" selected=""><i class="uil uil-angle-down"></i></option>
//             ${opcionesFiltradas.map(opcion => `<option value="${opcion}">${opcion}</option>`).join('')}
//           </select>
//           `;*/
//         } else if (servicio.estado_proceso_pedido === 'Rechazado') {
//           col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//         }


//         checkbox_carrito = `
//           <input class="form-check-input pedido-checkbox_pr" id="check_pedido_pro${servicio.numdoc_solicitud}"
//             type="checkbox" value="${servicio.numdoc_solicitud}" data-tipo="${servicio.tipo_trazabilidad}" data-id="${servicio.numdoc_solicitud}" data-idre="${servicio.referencia_pedido}"  style="scale: 1.3;">
//           `;

//         rows += `
//             <tr>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${checkbox_carrito}</td> 
//               <th scope="row">${servicio.numdoc_solicitud}</th>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.referencia_pedido}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.cod_producto}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.producto}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.peso_neto_kg}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.peso_bruto_kg}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.presentacion}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.unidades}</td>
//               <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.num_estibas}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.ciudad_origen}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.ciudad_destino}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_cargar}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_entregar}</td>
//               <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.remitente}</td>
//               <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.destinatario}</td>
//               <td class='text-center' style='color:black;width: auto; white-space: nowrap;'><span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.tipo_trazabilidad}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span</td>
//               <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${col_estatus_publicacion}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'></td>
//             </tr>


//           `;
//       });

//       if (data.sql.every(servicio => servicio.estado_proceso_pedido === 'Iniciado') || data.sql.every(servicio => servicio.estado_proceso_pedido === 'Completado')) {
//         // Listar_servicios(MaestroId, Proceso, miArray, proveedor_id);
//         Listar_servicios(MaestroId, Proceso, miArray, proveedor_id, data.sql.map(s => s.modalidad));
//         document.getElementById("btn_iniciar_recurso").style.display = "none";
//       } else if (EstadoRecurso === 'Cancelado') {
//         document.getElementById("btn_iniciar_recurso").style.display = "none";
//       }

//       /* Colcoar Array de las solicitudes de servicio para inicar proceso */
//       document.getElementById("btn_iniciar_recurso").setAttribute("data-SolicitudesId", JSON.stringify(miArray));

//       document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = rows;


//       let rows_Servicios = "";
//       let tabHeaders = "";

//       data.proveedores.forEach((proveedor, index) => {
//         // Construir el HTML para cada tab header
//         tabHeaders += ` 
//           <li class="nav-item">
//             <a class="nav-link ${index === 0 ? 'active' : ''}" 
//                id="${proveedor.proveedor_id}-tab" 
//                data-bs-toggle="tab" 
//                href="#tab-${proveedor.proveedor_id}" 
//                role="tab" 
//                aria-controls="tab-${proveedor.proveedor_id}" 
//                aria-selected="${index === 0 ? 'true' : 'false'}">
//                ${" - " + proveedor.razon_social + " "}
//             </a>
//           </li>
//         `;
//       });

//       // Insertar todos los headers en el contenedor
//       document.getElementById('cabecera_proveedores_servicios_especiales').innerHTML = tabHeaders;

//       // Necesitamos hacer esto en una función async
//       let tabContent = '<div class="tab-content"> ';

//       // Usamos for...of en lugar de forEach para poder usar await
//       for (const [index, proveedor] of data.proveedores.entries()) {
//         const contenido = await Listar_servicios_especiales_proveedor(proveedor.proveedor_id, MaestroId, index);
//         tabContent += contenido;
//       }

//       tabContent += '</div>';
//       document.getElementById('detalle_proveedores_servicios_especiales').innerHTML = tabContent;

//       /* Observaciones de los recursos */
//       // document.getElementById("observacion_recurso").innerHTML = data.sql[0].observacion;
//       const observacion =
//         data.sql?.[0]?.observacion ??
//         data.sql?.[0]?.observaciones ??
//         '';

//       document.getElementById("observacion_recurso").innerHTML = observacion;

//     } else {
//       document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
//     }
//   } catch (error) {
//     console.error("Error al obtener proveedores:", error);
//     document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
//   }
// }

// async function Listar_servicios(RecursoId, proceso, SolicitudesId, proveedor_id, modalidad) {
//   try {
//     let formData = new FormData();
//     formData.append("RecursoId", RecursoId);
//     formData.append("proveedor_id", proveedor_id);
//     formData.append("proceso", proceso);
//     formData.append("SolicitudesId", JSON.stringify(SolicitudesId));

//     let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_recursos_proveedor', {
//       method: "POST",
//       body: formData
//     });

//     let data = await response.json();
//     if (data) {
//       document.getElementById("tbl_recursos_proveedor").style.display = "";
//       let rows = "";
//       let rows2 = "";
//       //   <div class="form-check form-switch text-center">
//       //   <input class="form-check-input me-2" type="checkbox" name="ProveedorServiciodetalle" data-proveedorId="${servicio.proveedorId}" data-TipoServicio="${servicio.tipo_servicio}" data-pedidosId="${SolicitudesId}" data-recursoId="${RecursoId}" id="servicio_${servicio.servicioId}" value="${servicio.servicioId}">
//       // </div>
//       let col_estatus_publicacion = '';
//       let btn_cargar_trazabilidad = '';
//       let btn_postular_gestion_servicio = '';
//       data.forEach((servicio, index) => {

//         if (servicio.estado_servicio === 'Pendiente Iniciar') {
//           col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_postular_gestion_servicio = `
//           <div class="form-check form-switch text-center">
//             <input class="form-check-input me-2" type="checkbox" name="ProveedorServiciodetalle" data-modalidad="${modalidad}"  data-proveedorId="${servicio.proveedorId}" data-TipoServicio="${servicio.tipo_servicio}" data-pedidosId="${SolicitudesId}" data-recursoId="${RecursoId}" id="servicio_${servicio.servicioId}" value="${servicio.servicioId}">
//           </div>`;
//           btn_cargar_trazabilidad = ``;
//         } else if (servicio.estado_servicio === 'Iniciado') {
//           col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_postular_gestion_servicio = ``;
//           btn_cargar_trazabilidad = ``;
//         } else if (servicio.estado_servicio === 'Cancelado') {
//           col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_postular_gestion_servicio = ``;
//           btn_cargar_trazabilidad = ``;
//         } else if (servicio.estado_servicio === 'Completado') {
//           col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_postular_gestion_servicio = ``;
//           btn_cargar_trazabilidad = ``;
//         } else if (servicio.estado_servicio === 'Rechazado') {
//           col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_postular_gestion_servicio = ``;
//           btn_cargar_trazabilidad = ``;
//         } else if (servicio.estado_servicio === 'Postulado') {
//           col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_postular_gestion_servicio = ``;
//           btn_cargar_trazabilidad = ``;
//         } else if (servicio.estado_servicio === 'Ganador') {
//           col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_postular_gestion_servicio = ``;
//           btn_cargar_trazabilidad = `
//           <div class="btn-group btn-group-sm" role="group" aria-label="Extra-small button group">
//             <button class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" type="button" id="btn_cargar_trazabilidad_" style="font-size:12px;" data-ServicioId="${servicio.servicioId}" data-RecursoId="${RecursoId}">
//               <span class="uil uil-file-edit-alt" data-fa-transform="shrink-3"></span> Trazabilidad
//             </button>
//           </div>
//           `;
//         } else if (servicio.estado_servicio === 'No Asignada') {
//           col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_postular_gestion_servicio = ``;
//           btn_cargar_trazabilidad = ``;
//         }

//         rows += `
//           <tr>
//             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.razon_social}</td>
//             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.tipo_servicio}</td>
//             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.vehiculo}</td>
//             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.Fecha_registro}</td>
//             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_limite}</td>
//             <td class='text-center' style='width: auto; white-space: nowrap;'>${col_estatus_publicacion}</td>
//             <td class='text-center' style='width: auto; white-space: nowrap;'>
//                 ${btn_postular_gestion_servicio}
//                 ${btn_cargar_trazabilidad}
//             </td>
//           </tr>
//           <tr id="detalle_recurso_proveedores_asignados_${servicio.servicioId}" style="display: none;">
//             <td colspan="12">
//               <div class="lista-detalle-accion-proveedores"></div>
//             </td>
//           </tr>
//         `;

//         rows2 += `
//         <tr>
//           <th scope="row">${index + 1}</th>
//           <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.Valor_Servicio}</td>
//           <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.Fecha_Inicio}</td>
//           <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.cedula_conductor}</td>
//           <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.nombre_conductor}</td>
//           <td class='text-center' style='width: auto; white-space: nowrap;'>${(servicio.Placa) ? servicio.Placa : 'No Aplica'}</td>
//         </tr>
//       `;
//       });

//       document.getElementById("tbody_servicios_recurso").innerHTML = rows;
//       document.getElementById("tbody_propuestos_proveedor").innerHTML = rows2;
//     } else {
//       document.getElementById("tbody_servicios_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
//       document.getElementById("tbody_propuestos_proveedor").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
//     }
//   } catch (error) {
//     console.error("Error al obtener proveedores:", error);
//     document.getElementById("tbody_servicios_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
//     document.getElementById("tbody_propuestos_proveedor").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
//   }
// }

// async function Listar_actividades_pedido(MaestroId) {
//   try {
//     let formData = new FormData();
//     formData.append("RecursoId", MaestroId);

//     let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_actividades_gestion', {
//       method: "POST",
//       body: formData,
//       cache: 'no-cache',
//     });

//     let data = await response.json();
//     let tbody = document.getElementById('tbody_actividades');
//     let usuario = document.getElementById('id_usuario').value;
//     let CriterioCalculo = "";
//     tbody.innerHTML = '';
//     data.forEach(element => {
//       // setTimeout(() => {}, 500);
//       const fila = document.createElement('tr');
//       const columnaPosicion = document.createElement('td');
//       columnaPosicion.textContent = element.posicion;
//       columnaPosicion.style.textAlign = 'center';
//       columnaPosicion.style.width = 'auto';
//       columnaPosicion.style.whiteSpace = 'nowrap';
//       const columnaParametro = document.createElement('td');
//       columnaParametro.textContent = element.nombre_tipo;
//       columnaParametro.style.textAlign = 'center';
//       columnaParametro.style.width = 'auto';
//       columnaParametro.style.whiteSpace = 'nowrap';

//       // const columnaCostoActividad = document.createElement('td');
//       // if (element.costo_actividad === null) {
//       //   columnaCostoActividad.innerHTML = `<input type="number" class="form-control form-control-sm costo_actividad text-center" id="costo_actividad${element.actividad_id}">`;
//       // } else {
//       //   columnaCostoActividad.innerHTML = `<input type="number" class="form-control form-control-sm costo_actividad text-center" id="costo_actividad${element.actividad_id}" value="${element.costo_actividad}">`;
//       // }
//       // columnaCostoActividad.style.textAlign = 'center';
//       // columnaCostoActividad.style.width = 'auto';
//       // columnaCostoActividad.style.whiteSpace = 'nowrap';

//       const columnaActividad = document.createElement('td');
//       columnaActividad.innerHTML = `<span class="text-primary">${element.nombre_opcion}</span>`;
//       columnaActividad.style.textAlign = 'center';
//       columnaActividad.style.width = 'auto';
//       columnaActividad.style.whiteSpace = 'nowrap';

//       const columnaResponsable = document.createElement('td');
//       columnaResponsable.textContent = element.nom_usuario;
//       columnaResponsable.style.textAlign = 'center';
//       columnaResponsable.style.width = 'auto';
//       columnaResponsable.style.whiteSpace = 'nowrap';

//       const columnaFechaBase = document.createElement('td');
//       columnaFechaBase.textContent = element.fecha_base === null || '' ? 'Sin Fecha' : element.fecha_base;
//       columnaFechaBase.style.textAlign = 'center';
//       columnaFechaBase.style.width = 'auto';
//       columnaFechaBase.style.whiteSpace = 'nowrap';

//       const columnaVencimiento = document.createElement('td');
//       // columnaVencimiento.textContent = element.fecha_inicio + ' ' + element.hora_inicio;
//       if (element.fecha_inicio && element.hora_inicio) {
//         columnaVencimiento.textContent = element.fecha_inicio + ' ' + element.hora_inicio;
//       } else {
//         columnaVencimiento.textContent = 'sin fecha de vencimiento';
//       }

//       columnaVencimiento.style.textAlign = 'center';
//       columnaVencimiento.style.width = 'auto';
//       columnaVencimiento.style.whiteSpace = 'nowrap';

//       // const columnaVTiempoTrancurrido = document.createElement('td');
//       // columnaVTiempoTrancurrido.textContent = element.tiempo_transcurrido_base;
//       // columnaVTiempoTrancurrido.style.textAlign = 'center';
//       // columnaVTiempoTrancurrido.style.width = 'auto';
//       // columnaVTiempoTrancurrido.style.whiteSpace = 'nowrap';

//       const columnaVencimientoTranscurrido = document.createElement('td');
//       columnaVencimientoTranscurrido.textContent = element.valor_minutos;
//       // columnaVencimientoTranscurrido.textContent = element.tiempo_transcurrido_base;
//       columnaVencimientoTranscurrido.style.textAlign = 'center';
//       columnaVencimientoTranscurrido.style.width = 'auto';
//       columnaVencimientoTranscurrido.style.whiteSpace = 'nowrap';

//       const columnaEstdo = document.createElement('td');
//       if (element.estado_actividad === 'SIN INICIAR') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       } else if (element.estado_actividad === 'EN GESTION') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       } else if (element.estado_actividad === 'COMPLETADO') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       } else if (element.estado_actividad === 'CANCELADO') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       } else if (element.estado_actividad === 'PAUSADO') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       } else if (element.estado_actividad === 'VENCIDO') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       }

//       columnaEstdo.style.textAlign = 'center';
//       columnaEstdo.style.width = 'auto';
//       columnaEstdo.style.whiteSpace = 'nowrap';
//       /* Eejcuatr consualtr de dependcias */
//       const columnaAcciones = document.createElement('td');
//       columnaAcciones.style.textAlign = 'center';
//       columnaAcciones.style.width = 'auto';
//       columnaAcciones.style.whiteSpace = 'nowrap';

//       if (element.estado_actividad === 'SIN INICIAR' || element.estado_actividad === 'EN GESTION' || element.estado_actividad === 'PAUSADO' || element.estado_actividad === 'VENCIDO') {
//         // Verificamos si la actividad actual tiene una actividad dependiente completada
//         if (element.actividad_dependiente !== null) {
//           // Buscamos la actividad dependiente y verificamos su estado
//           const actividadDependiente = data.find(act => act.actividad_id === element.actividad_dependiente);
//           if (actividadDependiente && actividadDependiente.estado_actividad === 'COMPLETADO') {
//             // Si la actividad dependiente está completada, desbloqueamos la actividad actual
//             if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
//               columnaAcciones.innerHTML = `
//                 <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                   <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                 </div>`;
//             } else {
//               if (element.estado_visualizar === 'VISUALIZADOR') {
//                 columnaAcciones.innerHTML = `
//                   <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                     <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                   </div>`;
//               } else {
//                 columnaAcciones.innerHTML = `
//                   <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                     <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad_proveedor" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-comment-alt-message"></i> Gestionar</button>
//                     <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                   </div>`;
//               }
//             }
//           } else {
//             // Si no está completada, dejamos la actividad bloqueada
//             if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
//               columnaAcciones.innerHTML = `
//                 <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                   <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                 </div>`;
//             } else {
//               if (element.estado_visualizar === 'VISUALIZADOR') {
//                 columnaAcciones.innerHTML = `
//                   <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                     <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                   </div>`;
//               } else {
//                 columnaAcciones.innerHTML = `
//                 <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                   <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad_proveedor" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}" disabled><i class="uil-comment-alt-message"></i> Gestionar</button>
//                   <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>

//                 </div>`;
//               }
//             }
//           }
//         } else {
//           // Si no tiene dependencia, se puede gestionar sin restricciones
//           if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
//             columnaAcciones.innerHTML = `
//               <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                 <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//               </div>`;
//           } else {
//             if (element.estado_visualizar === 'VISUALIZADOR') {
//               columnaAcciones.innerHTML = `
//                 <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                   <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                 </div>`;
//             } else {
//               columnaAcciones.innerHTML = `
//               <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                 <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad_proveedor" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-comment-alt-message"></i> Gestionar</button>
//                 <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>

//               </div>`;
//             }
//           }
//         }
//       } else if (element.estado_actividad === 'COMPLETADO' || element.estado_actividad === 'CANCELADO') {
//         // Si la actividad ya está completada o cancelada
//         if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
//           columnaAcciones.innerHTML = `
//             <div class="btn-group btn-group-sm" role="group" aria-label="...">
//               <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//             </div>`;
//         } else {
//           columnaAcciones.innerHTML = `
//             <div class="btn-group btn-group-sm" role="group" aria-label="...">
//               <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//             </div>`;
//         }
//       }

//       const fila2 = document.createElement('tr');
//       fila2.style.display = 'none';
//       fila2.setAttribute('id', `columnaproceso${element.actividad_id}`);

//       const columnaFormulario = document.createElement('td');

//       columnaFormulario.setAttribute('id', `celdaproceso${element.actividad_id}`);
//       columnaFormulario.setAttribute('colspan', 11);
//       columnaFormulario.style.backgroundColor = "#f1f2f4";

//       columnaFormulario.innerHTML = `
//           <div id="proceso_numero${element.num_proceso}" style="padding:1px 1px 1px;" data-idnum_proceso="${element.num_proceso}" class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
//             <div class="row">
//               <div id="mensaje${element.actividad_id}"></div>
//               <!--<div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex justify-content-end">
//                 <div class="mb-1">
//                   <div class="checkbox">
//                     <label style="font-weight: bold;font-size: 15px;">
//                       <input type="checkbox" id="publicar${element.actividad_id}" name="publicar" style="transform: scale(1.5);margin-right: 5px;">
//                       Publicar Gestion al Cliente
//                     </label>
//                   </div>
//                 </div>
//               </div>-->
//               <input class="form-control input-xs" type="hidden" id="parametros_pedido${element.actividad_id}" name="parametros_pedido" value="${element.proceso_id}" data-id_parametros_pedido="${element.proceso_id}" readonly>
//               <input class="form-control input-xs" type="hidden" id="parametros_punto_pedido_opcion${element.actividad_id}" name="parametros_punto_pedido_opcion" value="${element.actividad_id}" data-id_parametros_punto_pedido_opcion="${element.actividad_id}" readonly>

//               <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                 <div class="mb-1">
//                   <label class="form-label" for="documento${element.actividad_id}">Documento</label>
//                   <input type="file" name="documento" id="documento${element.actividad_id}" class="form-control form-control-sm">
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                 <div class="mb-1">
//                   <label class="form-label" for="estado_actividad${element.actividad_id}">Seleccionar Estado</label>
//                   <select name="estado_actividad" id="estado_actividad${element.actividad_id}" class="form-select form-select-sm" data-EstadoActividadId="${element.actividad_id}">
//                     <option value="" selected>Selecciones</option>
//                     <option value="SIN INICIAR">SIN INICIAR</option>
//                     <option value="EN GESTION">EN GESTION</option>
//                     <option value="COMPLETADO">COMPLETADO</option>
//                     <option value="CANCELADO">CANCELADO</option>
//                     <option value="PAUSADO">PAUSADO</option>
//                   </select>
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                 <div class="mb-1">
//                   <label class="form-label" for="costo_estimado${element.actividad_id}">Costo Estimado</label>
//                   <input type="text" name="costo_estimado" id="costo_estimado${element.actividad_id}" class="form-control form-control-sm text-center" disabled value="${element.costo_promedio ? parseFloat(element.costo_promedio).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : 0}">
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                 <div class="mb-1">
//                   <label class="form-label" for="costo_ejecutado${element.actividad_id}">Costo Ejecutado</label>
//                   <input type="number" name="costo_ejecutado" id="costo_ejecutado${element.actividad_id}" class="form-control form-control-sm text-center" disabled>
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
//                 <div class="mb-1">
//                   <label class="form-label" for="observacion_gestion${element.actividad_id}">Observación</label>
//                   <textarea name="observacion_gestion" id="observacion_gestion${element.actividad_id}" cols="30" rows="2" oninput="this.value = this.value.toUpperCase();"
//                     class="form-control form-control-sm"></textarea>
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex justify-content-end my-2">
//                 <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                   <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1" style="margin-right:5px;" id="btn_cancelar_gestion${element.actividad_id}"><i class="fas fa-times"></i> Cancelar</button>
//                   <button type="button" class="btn btn-success btn-sm me-1 px-1 py-1" id="btn_guardar_gestion${element.actividad_id}" data-PedidoId="${data[0]['numdoc']}" data-MaestroId="${MaestroId}"><i class="far fa-save"></i> Guardar</button>
//                 </div>
//               </div>
//             </div>
//           </div>`;
//       const fila3 = document.createElement('tr');
//       fila3.style.display = 'none';
//       fila3.setAttribute('id', `columnadetalleactividad${element.actividad_id}`);
//       const columnaGestionActvidad = document.createElement('td');
//       columnaGestionActvidad.setAttribute('id', `columnadetalleactividad${element.actividad_id}`);
//       columnaGestionActvidad.setAttribute('colspan', 11);
//       columnaGestionActvidad.innerHTML = `
//         <div id="detalle_actividad_numero${element.num_proceso}" style="padding:1px 1px 1px;" data-idnum_proceso="${element.num_proceso}" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//         <div id="mensaje_publicado${element.actividad_id}"></div>
//           <div class="bs-example" data-example-id="simple-table">
//             <table class="table table-sm" style="font-size:12px;">
//               <thead class='table-bordered'>
//                 <tr>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>#</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Fecha</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Costo Estimado</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Costo Ejecutado</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Observación</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Responsable</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Evidencia</th>
//                 </tr>
//               </thead>
//               <tbody id="tbl_detalle_gestion${element.actividad_id}"></tbody>
//             </table>
//           </div>
//         </div>
//         `;

//       // criterio_calculo
//       if (element.criterio_calculo === 1) {
//         CriterioCalculo = `Fecha Inicial`;
//       } else if (element.criterio_calculo === 2) {
//         CriterioCalculo = `Fecha Cargue`;
//       } else if (element.criterio_calculo === 3) {
//         CriterioCalculo = `Fecha Descargue`;
//       } else if (element.criterio_calculo === 4) {
//         // CriterioCalculo = `Fecha actividad dependiente`+' ('+element.nombre_actividad_dependiente+')';
//         CriterioCalculo = `Fecha actividad dependiente`;
//       }

//       const columnaCriterioCalculo = document.createElement('td');
//       columnaCriterioCalculo.innerHTML = CriterioCalculo;
//       columnaCriterioCalculo.style.textAlign = 'center';
//       columnaCriterioCalculo.style.width = 'auto';
//       columnaCriterioCalculo.style.whiteSpace = 'nowrap';

//       fila.appendChild(columnaPosicion);
//       fila.appendChild(columnaParametro);
//       fila.appendChild(columnaActividad);
//       // fila.appendChild(columnaCostoActividad);
//       fila.appendChild(columnaResponsable);
//       fila.appendChild(columnaCriterioCalculo);
//       fila.appendChild(columnaFechaBase);
//       fila.appendChild(columnaVencimiento);
//       // fila.appendChild(columnaVTiempoTrancurrido);
//       fila.appendChild(columnaVencimientoTranscurrido);
//       fila.appendChild(columnaEstdo);
//       fila.appendChild(columnaAcciones);

//       fila2.appendChild(columnaFormulario);
//       fila3.appendChild(columnaGestionActvidad);
//       // tbody.appendChild(fila, fila2, fila3);
//       tbody.appendChild(fila);
//       tbody.appendChild(fila2);
//       tbody.appendChild(fila3);
//     });
//     Numero_actividades(data[0]['numdoc']);
//   } catch (error) {
//     console.error("Error al obtener proveedores:", error);
//     // document.getElementById("bloque_header").innerHTML = `<p class="text-danger">Error al cargar servicios</p>`;
//   } finally { }
// }

// async function Numero_actividades(nundoc) {
//   let data = new FormData();
//   data.append('nundoc', nundoc);
//   await fetch($('#base_url').val() + 'pedidos/Progreso_pedido', {
//     method: 'POST',
//     body: data,
//     cache: 'no-cache',
//   })
//     .then(res => (res.ok ? res.json() : Promise.reject(res)))
//     .catch(error => {
//       alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
//     })
//     .then(response => {
//       var objeto = response.cantidad_actividades;
//       var cantidadActividades = objeto.Cantidad_actividades;
//       var totalActividades = parseInt(cantidadActividades);
//       var porcentajePorActividad = 100 / totalActividades;
//       var progresoActual = 0;
//       response.estado_actividades.forEach(element => {
//         // console.log(element);
//         if (element.estado_actividad === 'COMPLETADO') {
//           progresoActual++;
//           // totalActividadesCompletas;
//         }
//       });
//       // Calcular el ancho de la barra de progreso
//       // var ancho = (progresoActual / totalActividades) * 100;
//       var ancho = 100 * progresoActual / totalActividades;
//       // console.log(ancho);
//       // Actualizar la barra de progreso
//       $('.progress-bar').css('width', ancho + '%');
//       // $(".progress-bar").html(ancho.toFixed(2) + "%"); // Redondear el porcentaje a dos decimales
//       ancho = Math.round(ancho * 100) / 100; // Redondear a dos decimales
//       $('.progress-bar').html(ancho + '%'); // Redondear el porcentaje a dos decimales
//     });
// }

// async function Detalles_actividaes(nundoc, actividad_id) {
//   let data = new FormData();
//   data.append('nundoc', nundoc);
//   data.append('actividad', actividad_id);
//   await fetch($('#base_url').val() + 'pedidos/ver_detalle_actividad', {
//     method: 'POST',
//     body: data,
//     cache: 'no-cache',
//   })
//     .then(res => (res.ok ? res.json() : Promise.reject(res)))
//     .catch(error => {
//       alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
//     })
//     .then(response => {
//       let tbody = document.getElementById('tbl_detalle_gestion' + actividad_id);
//       tbody.innerHTML = '';
//       if (response.length > 0) {
//         response.forEach(element => {
//           setTimeout(() => {
//             const fila = document.createElement('tr');
//             fila.style.fontSize = '12px';
//             const columnaNumero = document.createElement('td');
//             columnaNumero.textContent = element.detalle_id;
//             columnaNumero.style.textAlign = 'center';
//             columnaNumero.style.width = 'auto';
//             columnaNumero.style.whiteSpace = 'nowrap';

//             const columnaFecha = document.createElement('td');
//             columnaFecha.textContent = element.fecha;
//             columnaFecha.style.textAlign = 'center';
//             columnaFecha.style.width = 'auto';
//             columnaFecha.style.whiteSpace = 'nowrap';

//             const columnaCostoEstimado = document.createElement('td');
//             columnaCostoEstimado.textContent = parseFloat(element.costo_promedio).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
//             columnaCostoEstimado.style.textAlign = 'center';
//             columnaCostoEstimado.style.width = 'auto';
//             columnaCostoEstimado.style.whiteSpace = 'nowrap';

//             const columnaCostoActividad = document.createElement('td');
//             columnaCostoActividad.textContent = element.costo_actividad ? parseFloat(element.costo_actividad).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : '-';
//             columnaCostoActividad.style.textAlign = 'center';
//             columnaCostoActividad.style.width = 'auto';
//             columnaCostoActividad.style.whiteSpace = 'nowrap';


//             const columnaObservacion = document.createElement('td');
//             columnaObservacion.textContent = element.observacion;
//             columnaObservacion.style.textAlign = 'center';
//             columnaObservacion.style.width = 'auto';
//             columnaObservacion.style.whiteSpace = 'nowrap';

//             const columnaResponsable = document.createElement('td');
//             columnaResponsable.textContent = element.usuario;
//             columnaResponsable.style.textAlign = 'center';
//             columnaResponsable.style.width = 'auto';
//             columnaResponsable.style.whiteSpace = 'nowrap';

//             const columnaEvidencia = document.createElement('td');
//             if (element.nombre_archivo !== 'Sin_evidencia') {
//               columnaEvidencia.innerHTML = `
//             <div class="btn-group" role="group" aria-label="...">
//               <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" onclick="abrir_fotos('${element.documento}' , '${element.nombre_archivo}')"><i class="uil-file-download-alt"></i> Descargar</button>
//              </div>
//             `;
//             } else {
//               columnaEvidencia.innerHTML = `<span class="text-primary">Sin evidencia</span>`;
//             }
//             columnaEvidencia.style.textAlign = 'center';
//             columnaEvidencia.style.width = 'auto';
//             columnaEvidencia.style.whiteSpace = 'nowrap';

//             fila.appendChild(columnaNumero);
//             // fila.appendChild(columnaParametro);
//             // fila.appendChild(columnaConcepto);
//             fila.appendChild(columnaFecha);
//             fila.appendChild(columnaCostoEstimado);
//             fila.appendChild(columnaCostoActividad);
//             fila.appendChild(columnaObservacion);
//             fila.appendChild(columnaResponsable);
//             // fila.appendChild(columnaPublicado);
//             fila.appendChild(columnaEvidencia);
//             tbody.appendChild(fila);
//           }, 500);
//         });
//       } else {
//         const fila = document.createElement('tr');
//         const columnaSindatos = document.createElement('td');
//         columnaSindatos.colSpan = 5;
//         columnaSindatos.innerHTML = `Actividad del parametro sin Gestión`;
//         columnaSindatos.style.textAlign = 'center';
//         columnaSindatos.style.width = 'auto';
//         columnaSindatos.style.whiteSpace = 'nowrap';

//         fila.appendChild(columnaSindatos);
//         tbody.appendChild(fila);
//       }
//     });
// }

// function abrir_fotos(url, name) {
//   // URL de la página que deseas abrir en la nueva ventana
//   var url = $('#base_url').val() + url + name;
//   // Opciones de la ventana emergente (ancho, alto, opciones adicionales)
//   var ventanaAncho = 1000;
//   var ventanaAlto = 1000;
//   // Calcula las coordenadas para centrar la ventana
//   var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
//   var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
//   // Opciones de la ventana emergente (ancho, alto, posición)
//   var opcionesVentana = 'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
//   // Utiliza window.open para abrir la nueva ventana
//   window.open(url, name, opcionesVentana);
// }

// function trazabilidad_pedido(valor) {
//   console.log("🚀 ~ valor:", valor)
//   if (valor === '') {
//     document.getElementById("id_documentos").style.display = "none";
//     document.getElementById("id_fechas").style.display = "none";
//     document.getElementById("botones").style.display = "none";
//   } else if (valor === 'Fecha Estimada Entrega') {
//     document.getElementById("id_documentos").style.display = "none";
//     document.getElementById("id_fechas").style.display = "";
//     document.getElementById("botones").style.display = "";
//   } else {
//     document.getElementById("id_documentos").style.display = "";
//     document.getElementById("id_fechas").style.display = "none";
//     document.getElementById("botones").style.display = "";

//   }

// }

// async function ImportarTrazabilidad(params) {
//   // console.log("🚀 ~ ImportarTrazabilidad ~ params:", params)

//   if (globalData.length === 0) {
//     Swal.fire({
//       title: "Mensaje!",
//       text: "No hay datos para enviar. Primero carga y previsualiza un archivo de Excel.",
//       icon: "warning",
//       draggable: true
//     });
//     return;
//   }

//   const result = await Swal.fire({
//     title: 'Seguro',
//     text: '¿Desea aprobar la solicitud?',
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3B71CA',
//     cancelButtonColor: '#9FA6B2',
//     confirmButtonText: 'Aceptar',
//     cancelButtonText: 'Cancelar',
//     customClass: {
//       popup: 'swal2-custom-font',
//     },
//   });

//   if (result.isConfirmed) {
//     const btn = document.querySelector("#btn_guardar_trazabilidad");
//     btn.disabled = true;
//     btn.innerHTML = "Importando... ⏳";

//     try {
//       // Crear objeto FormData
//       let formData = new FormData();
//       // formData.append("ServicioId", ServicioId);
//       // formData.append("RecursoId", RecursoId);
//       formData.append("globalData", JSON.stringify(globalData));  // Convertimos globalData a JSON

//       const response = await fetch($('#base_url').val() + 'torrecontrol/importar_trazabilidad_pedido', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       Swal.fire({
//         title: "Mensaje!",
//         text: data.message,
//         icon: data.status === true ? "success" : "error",
//         draggable: true
//       });

//     } catch (err) {
//       console.error(err);
//       alert("Error al enviar datos al servidor.");
//     } finally {
//       btn.disabled = false;
//       btn.innerHTML = "<span class='uil uil-file-import'></span> Importar Trazabilidad";
//     }
//   }

// }

// function traer_servicio_especial() {

//   $('#list_servicio_especial2_Proveedor').html('');

//   $.ajax({
//     url: $('#base_url').val() + 'torrecontrol/traer_servicio_especial',
//     type: 'POST',
//     dataType: 'json',

//     success: function (data) {

//       $('#list_servicio_especial2_Proveedor').append('<option value="">Seleccione</option>');

//       data.forEach(function (element) {
//         $('#list_servicio_especial2_Proveedor').append(
//           `<option value="${element.id}" data-nombre="${element.nombre}">
//               ${element.nombre}
//            </option>`
//         );
//       });

//       // Inicializar Select2
//       $('#list_servicio_especial2_Proveedor').select2({
//         placeholder: 'Seleccione servicios',
//         allowClear: true,
//         width: '100%'
//       });

//       // Activar eventos
//       manejarEventosServicios();
//     },

//     error: function () {
//       console.log('Error al traer servicios especiales');
//     }
//   });

// }

// // function manejarEventosServicios() {

// //   const select = $('#list_servicio_especial2_Proveedor');
// //   const contenedor = $('#contenedor_valores_servicios');

// //   // Al seleccionar un servicio
// //   select.on('select2:select', function (e) {
// //     let id = e.params.data.id;
// //     let texto = e.params.data.text;

// //     // Crear input para ese servicio
// //     let html = `
// //             <div class="row mt-1 servicio-item" data-id="${serv.id}" id="servicio_valor_${id}">
// //                 <div class="col-7">
// //                     <label class="form-label mb-0">${texto}</label>
// //                 </div>
// //                 <div class="col-5">
// //                     <input type="number" 
// //                            class="form-control form-control-sm valor_servicio_input"
// //                            name="valores_servicio[${id}]" 
// //                            placeholder="Valor" data-id="${serv.id}"
// //                            min="0">
// //                 </div>
// //             </div>
// //         `;

// //     contenedor.append(html);
// //   });

// //   // Al quitar un servicio
// //   select.on('select2:unselect', function (e) {
// //     let id = e.params.data.id;

// //     // Eliminar el input del servicio quitado
// //     $(`#servicio_valor_${id}`).remove();
// //   });
// // }

// function manejarEventosServicios() {

//   const select = $('#list_servicio_especial2_Proveedor');
//   const contenedor = $('#contenedor_valores_servicios');

//   // Cuando cambia la selección (agrega o elimina)
//   select.on('change', function () {

//     contenedor.empty(); // limpiar todo

//     const serviciosSeleccionados = $(this).select2('data');

//     serviciosSeleccionados.forEach((serv, index) => {
//       contenedor.append(`
//                 <div class="row mb-2 servicio-item" data-id="${serv.id}">
//                     <div class="col-md-6">
//                         <label class="form-label mb-0">${serv.text}</label>
//                     </div>
//                     <div class="col-md-6">
//                         <input type="number"
//                             class="form-control form-control-sm valor_servicio_input"
//                             placeholder="Valor del servicio"
//                             data-id="${serv.id}">
//                     </div>
//                 </div>
//             `);
//     });

//   });

// }



// async function estado_recurso() {
//   const filas = document.querySelectorAll("#tbl_administrador_recurso_pedidos tr td:last-child");
//   const baseUrl = $('#base_url').val();

//   for (const columna of filas) {
//     const id = columna.dataset.id;
//     if (id) {
//       try {
//         const formData = new FormData();
//         formData.append('RecursoId', id);

//         const response = await fetch(`${baseUrl}torrecontrol/estado_recurso`, {
//           method: 'POST',
//           body: formData
//         });

//         const data = await response.json();
//         // console.log("🚀 ~ estado_recurso ~ data:",  data)

//         columna.innerHTML = ''; // Limpiar contenido previo

//         // Verificar si es un array o un objeto único
//         if (Array.isArray(data)) {
//           // Si es un array, recorrerlo
//           data.forEach(element => {
//             columna.innerHTML += generarBadge(element);
//           });
//         } else {
//           // Si es un objeto único, solo mostrarlo
//           columna.innerHTML = generarBadge(data);
//         }

//       } catch (error) {
//         console.error('Error obteniendo estado recurso:', error);
//         columna.innerHTML = '<span class="text-danger">Error</span>';
//       }
//     }
//   }
// }

// // Función auxiliar para generar el badge según el estado
// function generarBadge(element) {
//   let badgeClass = "badge-phoenix-dark"; // Estado por defecto
//   let estadoTexto = "Desconocido";

//   switch (element.estado_servicio) {
//     case 'Ganador':
//       badgeClass = "badge-phoenix-success";
//       estadoTexto = element.estado_servicio;
//       break;
//     case 'Postulado':
//       badgeClass = "badge-phoenix-warning";
//       estadoTexto = element.estado_servicio;
//       break;
//     case 'Pendiente Iniciar':
//       badgeClass = "badge-phoenix-secondary";
//       estadoTexto = element.estado_servicio;
//       break;
//     case 'No Asignada':
//       badgeClass = "badge-phoenix-danger";
//       estadoTexto = element.estado_servicio;
//       break;
//   }

//   return `<span class="badge badge-phoenix fs-10 ${badgeClass}" data-bs-toggle="tooltip" data-bs-placement="top" title="${element.razon_social}">
//             <span class="badge-label">${estadoTexto}</span>
//           </span>`;
// }

// function DynamicOffcanvas(options) {
//   // Configuración predeterminada
//   var defaults = {
//     id: 'dynamicOffcanvas',
//     title: 'Default Title',
//     content: 'Default Content',
//     class: 'offcanvas-end',
//     scroll: true,
//     backdrop: false,
//     width: '60%', // Nuevo valor por defecto
//     height: 'auto' // Puedes agregar height también
//   };

//   // Fusionar opciones con defaults
//   this.settings = Object.assign({}, defaults, options);

//   // Inicializar
//   this.initialize();
// }

// DynamicOffcanvas.prototype.initialize = function () {
//   this.createOffcanvas();
//   this.bsOffcanvas = new bootstrap.Offcanvas(this.offcanvasElement);
// };

// DynamicOffcanvas.prototype.createOffcanvas = function () {
//   var offcanvasHTML = `
//     <div class="offcanvas ${this.settings.class}" 
//         id="${this.settings.id}" 
//         data-bs-scroll="${this.settings.scroll}" 
//         data-bs-backdrop="${this.settings.backdrop}" 
//         tabindex="-1" 
//         aria-labelledby="${this.settings.id}-label" style="width: ${this.settings.width}; height: ${this.settings.height}">
//         <div class="offcanvas-header">
//           <h5 class="offcanvas-title fw-bold" id="${this.settings.id}-label">
//             ${this.settings.title}
//           </h5>
//           <button class="btn-close text-reset" type="button" data-bs-dismiss="offcanvas"></button>
//         </div>
//       <div class="offcanvas-body">
//         ${this.settings.content}
//       </div>
//     </div>
// `;

//   var container = document.createElement('div');
//   container.innerHTML = offcanvasHTML;
//   this.offcanvasElement = container.firstElementChild;
//   document.body.appendChild(this.offcanvasElement);
// };

// DynamicOffcanvas.prototype.updateContent = function (newContent) {
//   var body = this.offcanvasElement.querySelector('.offcanvas-body');
//   body.innerHTML = newContent;
// };

// DynamicOffcanvas.prototype.updateTitle = function (newTitle) {
//   var title = this.offcanvasElement.querySelector('.offcanvas-title');
//   title.innerHTML = newTitle;
// };

// /* Funcion para modificar la clase del offcanvas */
// DynamicOffcanvas.prototype.updateClass = function (newClass) {
//   var offcanvas = this.offcanvasElement;

//   // Eliminar todas las clases de posición de offcanvas
//   Array.from(offcanvas.classList)
//     .filter(cls => cls.startsWith('offcanvas-'))
//     .forEach(cls => offcanvas.classList.remove(cls));

//   // Agregar la nueva clase
//   offcanvas.classList.add(newClass);
// };

// // Función para modificar el ancho
// DynamicOffcanvas.prototype.updateWidth = function (newWidth) {
//   this.offcanvasElement.style.width = newWidth;
// };

// // Función para modificar el alto
// DynamicOffcanvas.prototype.updateHeight = function (newHeight) {
//   this.offcanvasElement.style.height = newHeight;
// };

// DynamicOffcanvas.prototype.show = function () {
//   this.bsOffcanvas.show();
// };

// DynamicOffcanvas.prototype.hide = function () {
//   this.bsOffcanvas.hide();
// };

// DynamicOffcanvas.prototype.getContent = function () {
//   var body = this.offcanvasElement.querySelector('.offcanvas-body');
//   return body.innerHTML; // Devuelve el contenido actual
// };

// if (!window.globalData) {
//   window.globalData = [];
// } else {
//   console.log('El offcanvas ya está creado.');
// }

// function leerExcel() {
//   const fileInput = document.getElementById('excelFile');
//   const file = fileInput.files[0];

//   if (!file) {
//     alert("Por favor selecciona un archivo de Excel primero.");
//     return;
//   }

//   const reader = new FileReader();

//   reader.onload = function (e) {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: 'array' });

//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//     if (sheetData.length === 0) {
//       alert("El archivo está vacío o no tiene datos.");
//       return;
//     }

//     const previewTable = document.getElementById("previewTable");
//     previewTable.innerHTML = "";

//     const thead = document.createElement("thead");
//     thead.style.fontSize = "10px";
//     thead.style.color = "#332D2D";

//     const headerRow = document.createElement("tr");
//     headerRow.classList.add("text-center");

//     const headers = sheetData[0].filter(header => header.trim() !== "");
//     headers.forEach(headerText => {
//       const th = document.createElement("th");
//       th.textContent = headerText;
//       headerRow.appendChild(th);
//     });

//     const thEliminar = document.createElement("th");
//     thEliminar.textContent = "Acciones";
//     headerRow.appendChild(thEliminar);

//     thead.appendChild(headerRow);
//     previewTable.appendChild(thead);

//     const tbody = document.createElement("tbody");
//     tbody.style.fontSize = "10px";
//     tbody.style.textAlign = "center";

//     const filasUtiles = sheetData.slice(1).filter(row => {
//       return row.some(cell => cell !== undefined && cell !== null && String(cell).trim() !== "");
//     });

//     // Construimos un array temporal
//     globalData = filasUtiles.map((rowData, rowIndex) => {
//       const obj = {};
//       const tr = document.createElement("tr");

//       headers.forEach((header, index) => {
//         const td = document.createElement("td");
//         let cellData = rowData[index] || "";

//         if (typeof cellData === "number") {
//           const headerText = header.toLowerCase();
//           if (headerText.includes("fecha")) {
//             // let excelDate = new Date((cellData - 25569) * 86400 * 1000);
//             // let year = excelDate.getFullYear();
//             // let month = String(excelDate.getMonth() + 1).padStart(2, '0');
//             // let day = String(excelDate.getDate()).padStart(2, '0');
//             // cellData = `${year}-${month}-${day}`; // Solo FECHA

//             let excelDate = new Date(Math.round((cellData - 25569) * 86400 * 1000));

//             // Ajuste por desfase horario (convierte a UTC primero)
//             let year = excelDate.getUTCFullYear();
//             let month = String(excelDate.getUTCMonth() + 1).padStart(2, '0');
//             let day = String(excelDate.getUTCDate()).padStart(2, '0');

//             cellData = `${year}-${month}-${day}`; // Solo FECHA
//           } else if (headerText.includes("hora")) {
//             // let excelDate = new Date((cellData - 25569) * 86400 * 1000);
//             // let hours = String(excelDate.getHours()).padStart(2, '0');
//             // let minutes = String(excelDate.getMinutes()).padStart(2, '0');
//             // let seconds = String(excelDate.getSeconds()).padStart(2, '0');
//             // cellData = `${hours}:${minutes}:${seconds}`; // Solo HORA
//             // Si es hora
//             const totalSeconds = Math.round(cellData * 24 * 60 * 60);
//             const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
//             const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
//             const seconds = String(totalSeconds % 60).padStart(2, '0');
//             cellData = `${hours}:${minutes}:${seconds}`;
//           }
//         }

//         obj[header] = cellData;
//         td.textContent = cellData;
//         tr.appendChild(td);
//       });

//       // Botón de eliminar
//       const tdEliminar = document.createElement("td");
//       const btnEliminar = document.createElement("button");
//       btnEliminar.innerHTML = `<span class="uil-trash-alt"></span>`;
//       btnEliminar.classList.add("btn", "btn-subtle-danger", "btn-sm", "me-1", "px-1", "py-0");

//       btnEliminar.onclick = function () {
//         if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
//           // Elimina del DOM
//           tr.remove();

//           // Elimina del array
//           globalData.splice(rowIndex, 1);
//         }
//       };

//       tdEliminar.appendChild(btnEliminar);
//       tr.appendChild(tdEliminar);

//       tbody.appendChild(tr);

//       return obj;
//     });

//     previewTable.appendChild(tbody);

//   };

//   reader.readAsArrayBuffer(file);
// }

// function leerExcelPeido() {
//   const fileInput = document.getElementById('excelFilePedidos');
//   const file = fileInput.files[0];

//   if (!file) {
//     alert("Por favor selecciona un archivo de Excel primero.");
//     return;
//   }

//   const reader = new FileReader();

//   reader.onload = function (e) {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: 'array' });

//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//     if (sheetData.length === 0) {
//       alert("El archivo está vacío o no tiene datos.");
//       return;
//     }

//     const previewTable = document.getElementById("previewTablePedidos");
//     previewTable.innerHTML = "";

//     const thead = document.createElement("thead");
//     thead.style.fontSize = "10px";
//     thead.style.color = "#332D2D";

//     const headerRow = document.createElement("tr");
//     headerRow.classList.add("text-center");

//     const headers = sheetData[0].filter(header => header.trim() !== "");
//     headers.forEach(headerText => {
//       const th = document.createElement("th");
//       th.textContent = headerText;
//       headerRow.appendChild(th);
//     });

//     const thEliminar = document.createElement("th");
//     thEliminar.textContent = "Acciones";
//     headerRow.appendChild(thEliminar);

//     thead.appendChild(headerRow);
//     previewTable.appendChild(thead);

//     const tbody = document.createElement("tbody");
//     tbody.style.fontSize = "10px";
//     tbody.style.textAlign = "center";

//     const filasUtiles = sheetData.slice(1).filter(row => {
//       return row.some(cell => cell !== undefined && cell !== null && String(cell).trim() !== "");
//     });

//     // Construimos un array temporal
//     globalData = filasUtiles.map((rowData, rowIndex) => {
//       const obj = {};
//       const tr = document.createElement("tr");

//       headers.forEach((header, index) => {
//         const td = document.createElement("td");
//         let cellData = rowData[index] || "";

//         if (typeof cellData === "number") {
//           const headerText = header.toLowerCase();
//           if (headerText.includes("fecha")) {
//             // Solo FECHA
//             let excelDate = new Date(Math.round((cellData - 25569) * 86400 * 1000));

//             // Ajuste por desfase horario (convierte a UTC primero)
//             let year = excelDate.getUTCFullYear();
//             let month = String(excelDate.getUTCMonth() + 1).padStart(2, '0');
//             let day = String(excelDate.getUTCDate()).padStart(2, '0');

//             cellData = `${year}-${month}-${day}`;
//           } else if (headerText.includes("hora")) {
//             // Si es hora
//             const totalSeconds = Math.round(cellData * 24 * 60 * 60);
//             const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
//             const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
//             const seconds = String(totalSeconds % 60).padStart(2, '0');
//             cellData = `${hours}:${minutes}:${seconds}`;
//           }
//         }

//         obj[header] = cellData;
//         td.textContent = cellData;
//         tr.appendChild(td);
//       });

//       // Botón de eliminar
//       const tdEliminar = document.createElement("td");
//       const btnEliminar = document.createElement("button");
//       btnEliminar.innerHTML = `<span class="uil-trash-alt"></span>`;
//       btnEliminar.classList.add("btn", "btn-subtle-danger", "btn-sm", "me-1", "px-1", "py-0");

//       btnEliminar.onclick = function () {
//         if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
//           // Elimina del DOM
//           tr.remove();

//           // Elimina del array
//           globalData.splice(rowIndex, 1);
//         }
//       };

//       tdEliminar.appendChild(btnEliminar);
//       tr.appendChild(tdEliminar);

//       tbody.appendChild(tr);

//       return obj;
//     });

//     previewTable.appendChild(tbody);

//   };

//   reader.readAsArrayBuffer(file);
// }

// async function Listar_servicios_especiales_proveedor(ProveedorId, MaestroId, index) {
//   let formData = new FormData();
//   formData.append('ProveedorId', ProveedorId);
//   formData.append('MaestroId', MaestroId);

//   try {
//     let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_especiales_recursos_proveedor', {
//       method: "POST",
//       body: formData
//     });

//     let data = await response.json();
//     let servicios = "";

//     if (data && data.length > 0) {
//       servicios = `
//         <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="tab-${ProveedorId}" role="tabpanel" aria-labelledby="${ProveedorId}-tab">
//           <div class="table-responsive">
//             <table class="table table-bordered table-hover align-middle table-sm" style="font-size: 12px;">
//               <thead class="table-light">
//                 <tr>
//                   <th>Tipo servicio</th>
//                   <th>Estado</th>
//                   <th>Valor</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${data.map(element => `
//                   <tr>
//                     <td>${element.nombre}</td>
//                     <td>
//                      <span class="badge badge-phoenix fs-10 badge-phoenix${element.estado_servicio_especial === 'Aprobado' ? '-success' : element.estado_servicio_especial === 'Cancelado' ? '-danger' : '-secondary'}"><span class="badge-label">${element.estado_servicio_especial}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span>
//                       </span>

//                     </td>
//                      ${element.estado_servicio_especial === 'Aprobado' ? `<td> $${element.valor_servicio.toLocaleString()}</td>` : `     
//                       <td class="editable-value" 
//                           data-servicio-id="${element.servicio_especial}"
//                           data-proveedor-id="${element.proveedor_id}"
//                           data-original-value="${element.valor_servicio}"
//                           data-maestro-id="${MaestroId}">
//                         $${element.valor_servicio.toLocaleString()}
//                       </td>`}
//                   </tr>
//                 `).join('')}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       `;
//     } else {
//       servicios = `
//         <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="tab-${ProveedorId}" role="tabpanel" aria-labelledby="${ProveedorId}-tab">
//           <div class="alert alert-info text-center py-4">
//             <i class="bi bi-info-circle-fill fs-3 mb-3"></i>
//             <h5 class="alert-heading">No hay servicios registrados</h5>
//           </div>
//         </div>
//       `;
//     }

//     // Inicializar eventos después de renderizar
//     setTimeout(initEditableValues, 100);

//     return servicios;
//   } catch (error) {
//     console.error('Error:', error);
//     return `
//       <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="tab-${ProveedorId}" role="tabpanel" aria-labelledby="${ProveedorId}-tab">
//         <div class="alert alert-danger text-center py-4">
//           <i class="bi bi-exclamation-triangle-fill fs-3 mb-3"></i>
//           <h5 class="alert-heading">Error al cargar los servicios</h5>
//           <p class="mb-0">Por favor intente nuevamente</p>
//         </div>
//       </div>
//     `;
//   }
// }

// function initEditableValues() {
//   document.querySelectorAll('.editable-value').forEach(cell => {
//     cell.addEventListener('click', function (e) {
//       if (this.querySelector('input')) return; // Ya está en modo edición

//       const originalValue = this.getAttribute('data-original-value');
//       const servicioId = this.getAttribute('data-servicio-id');
//       const proveedorId = this.getAttribute('data-proveedor-id');
//       const maestroId = this.getAttribute('data-maestro-id');

//       this.innerHTML = `
//         <div class="d-flex align-items-center">
//           <input type="number" class="form-control form-control-sm" value="${originalValue}" style="width: 40%;"> 

//           <button class="btn btn-subtle-danger btn-sm me-1 px-1 py-0 cancel-btn" id="id_rechazar_se" data-RecursoId=${maestroId} data-ServicioId=${servicioId} data-ProveedorId=${proveedorId}>
//             <span class="uil uil-cancel"></span> Rechazar
//           </button>
//         </div>
//       `;
//       // <button class="btn btn-subtle-success btn-sm me-1 px-1 py-0 save-btn" 
//       //   <span class="uil uil-save"></span> Guardar
//       // </button>
//       const input = this.querySelector('input');
//       input.focus();
//       input.select();

//       // Guardar con Enter
//       input.addEventListener('keypress', function (e) {
//         if (e.key === 'Enter') {
//           saveValue(this, originalValue, servicioId, proveedorId, maestroId, cell);
//         }
//       });

//       // Botón Guardar
//       this.querySelector('.save-btn').addEventListener('click', function () {
//         saveValue(input, originalValue, servicioId, proveedorId, maestroId, cell);
//       });

//       // Botón Cancelar
//       this.querySelector('.cancel-btn').addEventListener('click', function () {
//         cell.innerHTML = `$${parseFloat(originalValue).toLocaleString()}`;
//       });
//     });
//   });
// }

// async function saveValue(input, originalValue, servicioId, proveedorId, maestroId, cell) {
//   const newValue = input.value;

//   if (parseFloat(newValue) === parseFloat(originalValue)) {
//     cell.innerHTML = `$${parseFloat(originalValue).toLocaleString()}`;
//     return;
//   }

//   if (!newValue || isNaN(newValue)) {
//     showToast('error', 'Error', 'Ingrese un valor numérico válido');
//     return;
//   }

//   try {
//     cell.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

//     const formData = new FormData();
//     formData.append('servicio_id', servicioId);
//     formData.append('proveedor_id', proveedorId);
//     formData.append('valor', newValue);
//     formData.append('maestro_id', maestroId);

//     const response = await fetch($('#base_url').val() + 'torrecontrol/actualizar_valor_servicio', {
//       method: "POST",
//       body: formData
//     });

//     const result = await response.json();

//     if (result.success === true) {
//       cell.innerHTML = `$${parseFloat(newValue).toLocaleString()}`;
//       cell.setAttribute('data-original-value', newValue);
//       showToast('success', 'Éxito', 'Valor actualizado correctamente');
//     } else {
//       throw new Error(result.message || 'Error al actualizar');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     cell.innerHTML = `$${parseFloat(originalValue).toLocaleString()}`;
//     showToast('error', 'Error', 'No se pudo actualizar el valor');
//   }
// }

// function showToast(type, title, message) {
//   // Implementación básica de toast notification
//   const toastHtml = `
//     <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1100">
//       <div class="toast show align-items-center text-white bg-${type}" role="alert" aria-live="assertive" aria-atomic="true">
//         <div class="d-flex">
//           <div class="toast-body">
//             <strong>${title}</strong>: ${message}
//           </div>
//           <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
//         </div>
//       </div>
//     </div>
//   `;

//   const toastContainer = document.createElement('div');
//   toastContainer.innerHTML = toastHtml;
//   document.body.appendChild(toastContainer);

//   setTimeout(() => {
//     toastContainer.remove();
//   }, 3000);
// }

// function actualizarSelectTrazabilidad(ultimoEstado) {

//   const opciones = [

//     'Fecha Estimada Entrega',
//     'Sin trazabilidad',
//     'Llegada Cargue',
//     'Cargue',
//     'Salida Cargue',
//     'Inicio Ruta',
//     'Transito',
//     'Llegada Descargue',
//     'Descargue',
//     'Salida Descargue'
//   ];

//   const select = document.getElementById('select_tipo_trazabilidad');
//   const siguienteIndex = opciones.indexOf(ultimoEstado) + 1;

//   // Limpiar el select actual
//   select.innerHTML = '<option value="" selected><i class="uil uil-angle-down"></i></option>';

//   // Agregar todas las opciones
//   opciones.forEach((opcion, index) => {
//     const option = document.createElement('option');
//     option.value = opcion;
//     option.textContent = opcion;

//     // Siempre habilitar "Fecha Estimada Entrega"
//     if (opcion === 'Fecha Estimada Entrega') {
//       option.disabled = false;
//     } else {
//       // Solo habilitar la siguiente opción en orden
//       option.disabled = index !== siguienteIndex;
//     }

//     select.appendChild(option);
//   });
// }

// $(document).on('change', '.pedido-checkbox_pr', function () {

//   let tipo = $(this).data('tipo');
//   let pedido = $(this).data('id');
//   let referencia = $(this).data('idre');

//   let checkboxes = document.querySelectorAll('input[type="checkbox"]');
//   let totalSeleccionados = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;

//   if ((consulta_tipo.some(item => item.tipo === tipo) || consulta_tipo.length === 0) && this.checked === true) {
//     consulta_tipo.push({ tipo: tipo, pedido: pedido, referencia: referencia });
//     console.log(consulta_tipo);
//   } else {

//     this.checked = false;

//     if (totalSeleccionados === 0) {
//       // Limpiar el select actual
//       consulta_tipo = [];

//     } else if (!(consulta_tipo.some(item => item.tipo === tipo))) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Tipo de trazabilidad',
//         text: 'No puedes seleccionar pedidos con diferentes trazabilidad.',
//       });
//     } else {
//       consulta_tipo = consulta_tipo.filter(item => item.pedido !== pedido);
//     }
//   }


//   let tipoSeleccionado = null;
//   const tipoActual = this.dataset.tipo;
//   if (this.checked) {
//     actualizarSelectTrazabilidad(tipo);

//     console.log(consulta_tipo);
//     if (!tipoSeleccionado) {
//       // Primer tipo seleccionado
//       tipoSeleccionado = tipoActual;
//     } else if (tipoActual !== tipoSeleccionado) {
//       alert(`Solo puedes seleccionar pedidos con tipo de trazabilidad "${tipoSeleccionado}".`);
//       this.checked = false;
//     }
//   } else {
//     // Si se desmarca y no queda ninguno seleccionado, reinicia el tipo
//     document.getElementById('select_tipo_trazabilidad').innerHTML = "";
//     const algunoMarcado = Array.from(document.querySelectorAll('.pedido-checkbox_pr'))
//       .some(cb => cb.checked);
//     if (!algunoMarcado) {
//       tipoSeleccionado = null;
//     }
//   }
// });

// // ─── Actualiza KPI cards usando los IDs del phtml recurso_torre_control ──
// function rc_actualizarKpisAdmin(data) {
//   if (!Array.isArray(data)) return;
//   const c = { total: data.length, pendiente: 0, iniciado: 0, completado: 0, cancelado: 0 };
//   data.forEach(function (el) {
//     const estados = (el.estados_recurso || el.estado_recurso || '').split(',').map(function (s) { return s.trim(); });
//     if (estados.some(function (e) { return e === 'Pendiente Iniciar'; })) c.pendiente++;
//     if (estados.some(function (e) { return e === 'Iniciado'; })) c.iniciado++;
//     if (estados.some(function (e) { return e === 'Completado'; })) c.completado++;
//     if (estados.some(function (e) { return e === 'Cancelado' || e === 'Rechazado'; })) c.cancelado++;
//   });
//   const set = function (id, v) { const el = document.getElementById(id); if (el) el.textContent = v; };
//   set('rc-kpi-total', c.total);
//   set('rc-kpi-pendiente', c.pendiente);
//   set('rc-kpi-iniciado', c.iniciado);
//   set('rc-kpi-completado', c.completado);
//   set('rc-kpi-cancelado', c.cancelado);
// }

// window.VENTANA = null; // Variable global para almacenar el ID
// // Definir la función initScript globalmente
// window.initScript = function (id) {
//   window.VENTANA = id; // Asigna el ID recibido a la variable global

//   if (!window.myOffcanvas) {
//     window.myOffcanvas = new DynamicOffcanvas({
//       id: `customOffcanvas${window.VENTANA}`,
//       title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
//       content: '<p>Contenido inicial</p>',
//       scroll: true,
//       backdrop: false,
//     });
//   } else {
//     console.log('El offcanvas ya está creado.');
//   }

//   const hoy = new Date();
//   const opciones = { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' };
//   const fechaColombia = new Intl.DateTimeFormat('es-CO', opciones).format(hoy).split('/').reverse().join('-');

//   listar_recursos_administrador(fechaColombia, fechaColombia, '', '');

//   document.addEventListener('click', async (e) => {

//     // ── Botón Consultar ──
//     if (e.target.matches('#rc-btn-buscar') || e.target.matches('#rc-btn-buscar *')) {
//       let fechaInicio = document.getElementById('rc-fecha-inicial')?.value.trim() ?? '';
//       let fechaFinal = document.getElementById('rc-fecha-final')?.value.trim() ?? '';
//       let modalidad = document.getElementById('rc-modalidad')?.value ?? '';
//       let estado = document.getElementById('rc-estado-recurso')?.value ?? '';
//       document.querySelectorAll('.rc-kpi-resumen').forEach(c => c.classList.remove('active'));
//       listar_recursos_administrador(fechaInicio, fechaFinal, modalidad, '', estado);
//     }

//     if (e.target.matches('#btn_detalle_proceso_servicio') || e.target.matches('#btn_detalle_proceso_servicio *')) {
//       let Enlace = e.target.closest('#btn_detalle_proceso_servicio');
//       let MaestroId = Enlace.getAttribute('data-id');
//       let ClienteId = Enlace.getAttribute('data-clienteId');
//       let Proceso = Enlace.getAttribute('data-proceso');
//       let MotivoCancelacion = Enlace.getAttribute('data-motivo_cancelacion');

//       myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Detalle de solicitud de servicio N°` + MaestroId);
//       myOffcanvas.updateContent(`
//           <div class="col-12">
//             <div class="row">
//               <div class="container d-flex justify-content-center align-items-center">
//                 <div class="row text-black fw-bold text-center d-flex flex-wrap">
//                   <div class="col-auto mx-3 h6">Peso Neto total: <span class="badge badge-phoenix badge-phoenix-primary" id="pesoNeto">0</span></div>
//                   <div class="col-auto mx-3 h6">Peso Bruto total: <span class="badge badge-phoenix badge-phoenix-primary" id="pesoBruto">0</span></div>
//                   <div class="col-auto mx-3 h6">Total Unidades: <span class="badge badge-phoenix badge-phoenix-primary" id="totalUnidades">0</span></div>
//                 </div>
//               </div>
//               <hr class="my-1 text-dark">
//               <h6 class="mb-0 text-body-highlight me-2">Pedidos</h6>
//               <hr class="my-1 text-dark">
//               <div class="table-responsive scrollbar">
//                 <table class="table table-sm text-center" style="font-size: 12px;">
//                   <thead>
//                     <tr>
//                       <th scope="col" style='width: auto; white-space: nowrap;'>#</th>
//                       <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Ref.Pedido</th>
//                       <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Cod.Producto</th>
//                       <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Producto</th>
//                       <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Peso Bruto</th>
//                       <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Empaque</th>
//                       <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Cantidad</th>
//                       <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>No. Estibas</th>
//                       <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Origen</th>
//                       <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Destino</th>
//                       <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Fecha Cargue</th>
//                       <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Fecha Descargue</th>
//                       <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Remitente</th>
//                       <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Destinatario</th>
//                       <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Trazabilidad</th>
//                       <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Estado</th>
//                     </tr>
//                   </thead>
//                   <tbody id="tbody_servicios_pedidos_recurso" class="text-center">
//                     <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             <hr class="my-1 text-dark">
//             <div class="d-flex align-items-center justify-content-between">
//               <h6 class="mb-0 me-2 d-flex align-items-center justify-content-center">Servicios Especiales</h6>
//             </div>
//             <hr class="my-1 text-dark">

//             <ul class="nav nav-underline fs-9" id="cabecera_proveedores_servicios_especiales" role="tablist"></ul>
//             <div id="detalle_proveedores_servicios_especiales"></div>

//             <div class="accordion mt-0" id="accordionExample2">
//               <div class="accordion-item border-top">
//                 <h6 class="mb-0 me-2 d-flex align-items-center justify-content-left">Agregar Servicios Especiales</h6>
//                 <h2 class="accordion-header" id="ServicioAdicional">
//                   <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#TipoServicio_" aria-expanded="false" aria-controls="TipoServicio_"></button>
//                 </h2>
//                 <div class="accordion-collapse collapse" id="TipoServicio_" aria-labelledby="TipoServicio" data-bs-parent="#accordionExample" style="">
//                   <div class="accordion-body pt-0" id="contenido">
//                     <div class="row">
//                       <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6" id="contenido_servicio_especial_list_" style="display:block;">
//                         <div class="mb-0">
//                           <label class="form-label">(*) Tipo de Vehiculo:</label>
//                           <select class="form-select form-select-sm fs-9" id="list_servicio_especial2" name="list_servicio_especial_[]" multiple="multiple" style="width: 100%;font-size: 10px;"></select>
//                         </div>
//                       </div>
//                       <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6" id="ls_servicio_especial_list_" style="display:block;">
//                         <div class="mb-0"><label class="form-label"></label></div>
//                       </div>
//                     </div>
//                     <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6" id="ls_servicio_especial_list_" style="display:block;">
//                       <div class="mb-0">
//                         <label class="form-label"></label>
//                         <button class="btn btn-success btn-sm py-1" id="btn_guardar_se" type="button" style="display: block;" data-maestroId="${MaestroId}">
//                           <span class="uil uil-play-circle"></span> Guardar Servicios
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <hr class="my-1 text-dark">
//             <div class="d-flex align-items-center justify-content-between">
//               <h6 class="mb-0 me-2 d-flex align-items-center justify-content-center">Observaciones</h6>
//             </div>
//             <hr class="my-1 text-dark">
//             <textarea class="form-control form-control-sn observacion_opcion" disabled id="observacion_recurso" rows="1" placeholder="Observaciones" oninput="this.value = this.value.toUpperCase();"></textarea>

//             <div class="accordion" id="accordionExample"></div>

//             <hr class="my-1 text-dark">
//             <div class="d-flex align-items-center justify-content-between">
//               <h6 class="mb-0 me-2 d-flex align-items-center justify-content-center">Subasta</h6>
//               <div class="col-5">
//                 <div class="row justify-content-end">
//                   <div class="col-auto">
//                     <select class="form-select form-select-sm" id="slct_criterio" name="slct_criterio" style="width: 100%;display: none;">
//                       <option selected="" value="">Seleccione Criterio</option>
//                       <option value="Fecha_inicio_servicio">Fecha Inicio de servicio</option>
//                       <option value="Valor_servicio">Valor de servicio</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//               <div class="col-5">
//                 <div class="row justify-content-end">
//                   <div class="col-auto">
//                     <button class="btn btn-danger btn-sm py-1" id="btn_cancelar_recurso" type="button"><span class="uil uil-x"></span> Rechazar Servicios</button>
//                     <button class="btn btn-success btn-sm py-1" id="btn_subastar_recurso" type="button" style="display: none;"><span class="uil uil-play-circle"></span> Subastar Servicios</button>
//                     <button class="btn btn-success btn-sm py-1" id="btn_asignar_recurso" type="button" style="display: none;"><span class="uil uil-play-circle"></span> Asignar Servicios</button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <hr class="my-1 text-dark">

//             <h5>RESULTADOS DE LA SUBASTA</h5>
//             <table class="table table-sm" style="font-size:10px;">
//               <thead>
//                 <tr>
//                   <th scope="col">#</th>
//                   <th scope="col">SERVICIO</th>
//                   <th scope="col">VALOR SERVICIO</th>
//                   <th scope="col">PROVEEDOR</th>
//                   <th scope="col">CEDULA CONDUCTOR</th>
//                   <th scope="col">NOMBRE CONDUCTOR</th>
//                   <th scope="col">PLACA</th>
//                   <th scope="col">FECHA REGISTRO</th>
//                   <th scope="col">FECHA INICIO</th>
//                   <th scope="col">ACCION</th>
//                 </tr>
//               </thead>
//               <tbody id="tbody_subasta_resultados"></tbody>
//             </table>

//             <hr class="my-1 text-dark">
//             <h6>Editar datos del servicio</h6>
//             <hr class="my-1 text-dark">
//             <div class="row mt-2" id="bloque_datos_servicio" style="display: none;">
//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
//                 <div class="mb-1">
//                   <label class="form-label" for="valor_servicio">Valor Servicio</label>
//                   <input type="text" name="valor_servicio" id="valor_servicio" class="form-control form-control-sm">
//                 </div>
//               </div>
//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
//                 <div class="mb-1">
//                   <label class="form-label" for="cedula_conductor">Cedula Conductor</label>
//                   <input type="text" name="cedula_conductor" id="cedula_conductor" class="form-control form-control-sm">
//                 </div>
//               </div>
//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
//                 <div class="mb-1">
//                   <label class="form-label" for="nombre_conductor">Nombre Conductor</label>
//                   <input type="text" name="nombre_conductor" id="nombre_conductor" class="form-control form-control-sm">
//                 </div>
//               </div>
//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
//                 <div class="mb-1">
//                   <label class="form-label" for="placa">Placa</label>
//                   <input type="text" name="placa" id="placa" class="form-control form-control-sm">
//                 </div>
//               </div>
//             </div>

//             <div class="row mt-2" id="bloque_carga_liquida" style="display: none;">
//               <div class="col-12 col-sm-12 col-md-2"><div class="mb-1"><label class="form-label" for="capacidad_vehiculo">Capacidad Vehículo</label><input type="text" name="capacidad_vehiculo" id="capacidad_vehiculo" class="form-control form-control-sm"></div></div>
//               <div class="col-12 col-sm-12 col-md-2"><div class="mb-1"><label class="form-label" for="tiempo_libre">Tiempo Libre</label><input type="text" name="tiempo_libre" id="tiempo_libre" class="form-control form-control-sm"></div></div>
//               <div class="col-12 col-sm-12 col-md-2"><div class="mb-1"><label class="form-label" for="stand_bay">Stand By</label><input type="text" name="stand_bay" id="stand_bay" class="form-control form-control-sm"></div></div>
//               <div class="col-12 col-sm-12 col-md-2"><div class="mb-1"><label class="form-label" for="cumplimiento">Cumplimiento</label><select name="cumplimiento" id="cumplimiento" class="form-select form-select-sm"><option value="" selected>Selecciones</option><option value="CUMPLE">CUMPLE</option><option value="NO CUMPLE">NO CUMPLE</option></select></div></div>
//               <div class="col-12 col-sm-12 col-md-2"><div class="mb-1"><label class="form-label" for="contenedor">Contenedor</label><input type="text" name="contenedor" id="contenedor" class="form-control form-control-sm"></div></div>
//               <div class="col-12 col-sm-12 col-md-2"><div class="mb-1"><label class="form-label" for="tara">Tara</label><input type="text" name="tara" id="tara" class="form-control form-control-sm"></div></div>
//             </div>

//             <div class="row mt-2" style="display: none;" id="btn_acciones_edit_datos">
//               <div class="col-12 d-flex justify-content-end my-2">
//                 <div class="btn-group btn-group-sm" role="group">
//                   <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1" style="margin-right:5px;" id="btn_cancelar_edit_datos"><i class="fas fa-times"></i> Cancelar</button>
//                   <button type="button" class="btn btn-success btn-sm me-1 px-1 py-1" id="btn_guardar_edit_datos" data-MaestroId="${MaestroId}"><i class="far fa-save"></i> Guardar</button>
//                 </div>
//               </div>
//             </div>

//             <hr class="my-1 text-dark mt-3">
//             <h6>Motivo Cancelación</h6>
//             <hr class="my-1 text-dark">
//             ${MotivoCancelacion}
//           </div>
//       `);

//       traer_servicio_especial();
//       Listar_pedidos_recursos(MaestroId, window.VENTANA, Proceso, ClienteId);
//       myOffcanvas.updateClass('offcanvas-end');
//       myOffcanvas.updateHeight('100vh');
//       myOffcanvas.updateWidth('70%');
//       myOffcanvas.show();
//     }

//     if (e.target.matches('#btn_proceso_servicios_recurso') || e.target.matches('#btn_proceso_servicios_recurso *')) {
//       let recurso = e.target.getAttribute('data-recurso');
//       let numdoc = e.target.getAttribute('data-numdoc_solicitud');
//       let filaProveedores = document.getElementById(`Recurso_proveedores_${numdoc}`);
//       if (!filaProveedores) { console.error(`No se encontró el <tr> con id #Recurso_proveedores_${numdoc}`); return; }
//       if (filaProveedores.style.display === 'none') {
//         filaProveedores.style.display = 'table-row';
//         if (filaProveedores.querySelector('.lista-proceso-proveedores').innerHTML.trim() === '') {
//           try {
//             let formData = new FormData();
//             formData.append('MaestroId', recurso);
//             let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_servicios_pedidos_recursos', { method: 'POST', body: formData });
//             let data = await response.json();
//             if (data) {
//               let serviciosHTML = '<div class="accordion" id="accordionExample">';
//               data.forEach((proveedor) => {
//                 serviciosHTML += `
//                   <div class="accordion-item border-top">
//                     <h2 class="accordion-header" id="TipoServicio${proveedor.tipo_servicio}">
//                       <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#TipoServicio_${proveedor.servicio_id}" aria-expanded="false" aria-controls="TipoServicio_${proveedor.servicio_id}">${proveedor.tipo_servicio}</button>
//                     </h2>
//                     <div class="accordion-collapse collapse" id="TipoServicio_${proveedor.servicio_id}" aria-labelledby="TipoServicio${proveedor.tipo_servicio}" data-bs-parent="#accordionExample">
//                       <div class="accordion-body pt-0" id="contenido${proveedor.servicio_id}"></div>
//                     </div>
//                   </div>`;
//               });
//               serviciosHTML += '</div>';
//               filaProveedores.querySelector('.lista-proceso-proveedores').innerHTML = serviciosHTML;
//             } else {
//               filaProveedores.querySelector('.lista-proceso-proveedores').innerHTML = `<p class="text-danger">${data.message}</p>`;
//             }
//           } catch (error) {
//             console.error('Error al obtener servicios:', error);
//             filaProveedores.querySelector('.lista-proceso-proveedores').innerHTML = `<p class="text-danger">Error al cargar proveedores</p>`;
//           }
//         }
//       }
//     }

//     if (e.target.matches('#btn_gestion_pedido') || e.target.matches('#btn_gestion_pedido *')) {
//       let MaestroId = e.target.getAttribute('data-id');
//       myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Gestion Pedido N°` + MaestroId);
//       myOffcanvas.updateContent(`
//         <div class="card shadow-sm mb-4">
//           <div class="card-body py-3">
//             <div class="row text-center text-md-start align-items-center">
//               <div class="col-md-2 mb-2 mb-md-0"><small class="text-muted d-block">Tipo de servicio</small><span class="fw-semibold" id="tipo_servicio_header"></span></div>
//               <div class="col-md-2 mb-2 mb-md-0"><small class="text-muted d-block">Vehículo</small><span class="fw-semibold text-secondary" id="vehiculo_header"></span></div>
//               <div class="col-md-2 mb-2 mb-md-0"><small class="text-muted d-block">Estado</small><span id="estado_header"></span></div>
//               <div class="col-md-3 mb-2 mb-md-0"><small class="text-muted d-block">Fecha de registro</small><span class="fw-semibold" id="fecha_registro_header"></span></div>
//               <div class="col-md-3"><small class="text-muted d-block">Fecha límite</small><span class="fw-semibold text-danger" id="fecha_limite_header"></span></div>
//               <div class="row mb-3">
//                 <div class="col-2"><small class="text-muted">Cedula: <span class="fw-semibold" id="cedula_header"></span></small></div>
//                 <div class="col-2"><small class="text-muted">Conductor: <span class="fw-semibold" id="conductor_header"></span></small></div>
//                 <div class="col-2"><small class="text-muted"><span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label" id="placa_header"></span></span></small></div>
//                 <div class="col-3"><small class="text-muted">Inicio de servicio: <span class="fw-semibold text-success" id="inicio_servicio_header"></span></small></div>
//               </div>
//               <hr class="my-1 text-dark">
//             </div>
//           </div>
//         </div>
//         <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//           <h4 class="text-center" style="font-weight: bold;">Progreso del Pedido</h4>
//           <div class="progress" style="height:15px">
//             <div class="progress-bar progress-bar-striped active rounded-3" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;width: 0;" data-bs-toggle="tooltip" data-bs-placement="top" title="Progreso"></div>
//           </div>
//         </div>
//         <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-4" id="tabla_gestion_actividades">
//           <h4 class="text-center" style="font-weight: bold;">Listado de actividades</h4>
//           <div class="bs-example">
//             <table class="table table-sm" style="font-size:12px;">
//               <thead class='table-bordered'>
//                 <tr>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>#</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Parametro</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Actividad</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Responsable</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Criterio</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Fecha Base</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Vencimiento</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Tiempo Parametrizado</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Estado</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Acción</th>
//                 </tr>
//               </thead>
//               <tbody id="tbody_actividades"></tbody>
//             </table>
//           </div>
//         </div>
//         <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="gestion_pedido"></div>
//         <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div id="detalle_gestion"></div></div>
//       `);
//       setTimeout(() => { Listar_actividades_pedido(MaestroId); }, 50);
//       myOffcanvas.updateHeight('100vh');
//       myOffcanvas.updateWidth('100%');
//       myOffcanvas.show();
//     }

//     if (e.target.matches('#btn_detalle_gestion') || e.target.matches('#btn_detalle_gestion *')) {
//       document.getElementById('btn_cerrar_gestion').style.display = 'block';
//       document.getElementById('btn_detalle_gestion').style.display = 'none';
//       document.getElementById('btn_agregar_solicitud').style.display = 'none';
//       document.getElementById('acordeones_parametros').style.display = 'none';
//       document.getElementById('gestion_pedido').style.display = 'none';
//       document.getElementById('tabla_gestion_actividades').style.display = 'none';
//       document.getElementById('btn_editar_pedido').style.display = 'block';
//     }

//     if (e.target.matches('#btn_cerrar_gestion') || e.target.matches('#btn_cerrar_gestion *')) {
//       document.getElementById('btn_cerrar_gestion').style.display = 'none';
//       document.getElementById('btn_detalle_gestion').style.display = 'block';
//       document.getElementById('btn_agregar_solicitud').style.display = 'block';
//       document.getElementById('acordeones_parametros').style.display = 'block';
//       document.getElementById('tabla_gestion_actividades').style.display = 'block';
//       document.getElementById('btn_editar_pedido').style.display = 'block';
//       var contenido = document.getElementById('detalle_gestion');
//       contenido.innerHTML = '';
//     }

//     let Boton_cancelar;
//     let Boton_guardar_gestion;
//     let Select_Estado_Actividad = '';
//     if (e.target.matches('#btn_gestion_actividad') || e.target.matches('#btn_gestion_actividad *')) {
//       var padre = e.target.parentElement.parentElement;
//       var Procesos = padre.querySelector('#btn_gestion_actividad');
//       var proceso_id = Procesos.getAttribute('data-idproceso');
//       var actividad_id = Procesos.getAttribute('data-idactividad');
//       var form_gestio = document.getElementById(`proceso_numero${actividad_id}`);
//       var numero_proceso = form_gestio.getAttribute('data-idnum_proceso');
//       Boton_cancelar = document.getElementById(`btn_cancelar_gestion${actividad_id}`);
//       Boton_guardar_gestion = document.getElementById(`btn_guardar_gestion${actividad_id}`);
//       Select_Estado_Actividad = document.getElementById(`estado_actividad${actividad_id}`);
//       Select_Estado_Actividad.addEventListener('change', async (e) => {
//         if (Select_Estado_Actividad.value === 'COMPLETADO') {
//           document.getElementById(`costo_ejecutado${actividad_id}`).disabled = false;
//           document.getElementById(`costo_ejecutado${actividad_id}`).value = '';
//         } else {
//           document.getElementById(`costo_ejecutado${actividad_id}`).disabled = true;
//           document.getElementById(`costo_ejecutado${actividad_id}`).value = '';
//         }
//       });

//       if (actividad_id === numero_proceso) {
//         document.getElementById(`columnaproceso${numero_proceso}`).style.display =
//           document.getElementById(`columnaproceso${numero_proceso}`).style.display === 'none' ? 'table-row' : 'none';
//         Boton_cancelar.addEventListener('click', async (e) => {
//           document.getElementById(`columnaproceso${numero_proceso}`).style.display = 'none';
//         });
//         Boton_guardar_gestion.addEventListener('click', async (e) => {
//           let PedidoId = Boton_guardar_gestion.getAttribute('data-PedidoId');
//           let MaestroId = Boton_guardar_gestion.getAttribute('data-MaestroId');

//           if (document.getElementById('estado_actividad' + actividad_id).value === '') {
//             mensaje = `<div class="alert alert-outline-warning d-flex align-items-center" role="alert"><span class="fas fa-info-circle text-warning fs-5 me-3"></span><strong>Mensaje!</strong> <p class="mb-0 flex-1"> Debe seleccionar un estado para este pedido</p><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
//             document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
//           } else if (document.getElementById('observacion_gestion' + actividad_id).value === '') {
//             mensaje = `<div class="alert alert-outline-warning d-flex align-items-center" role="alert"><span class="fas fa-info-circle text-warning fs-5 me-3"></span><strong>Mensaje!</strong> <p class="mb-0 flex-1"> Debe diligenciar una observación para poder guardar la gestión</p><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
//             document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
//             document.getElementById('observacion_gestion' + actividad_id).focus();
//           } else {
//             const result = await Swal.fire({
//               title: 'Seguro', text: '¿Desea realizar la operación de gestión?', icon: 'question',
//               showCancelButton: true, confirmButtonColor: '#3B71CA', cancelButtonColor: '#9FA6B2',
//               confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar', customClass: { popup: 'swal2-custom-font' },
//             });
//             if (result.isConfirmed) {
//               let data = new FormData();
//               data.append('nundoc', PedidoId);
//               data.append('parametros_pedido', document.getElementById('parametros_pedido' + actividad_id).value);
//               data.append('parametros_punto_pedido_opcion', document.getElementById('parametros_punto_pedido_opcion' + actividad_id).value);
//               data.append('observacion', document.getElementById('observacion_gestion' + actividad_id).value);
//               data.append('estado_actividad', document.getElementById('estado_actividad' + actividad_id).value);
//               data.append('costo_ejecutado', document.getElementById('costo_ejecutado' + actividad_id).value);
//               var documentos = document.getElementById('documento' + actividad_id).files[0];
//               data.append('documento', documentos !== undefined ? documentos : 'Sin_evidencia');
//               data.append('publicar', 'NO');
//               await fetch($('#base_url').val() + 'torrecontrol/Insertar_gestion_pedido', { method: 'POST', body: data, cache: 'no-cache' })
//                 .then((res) => (res.ok ? res.json() : Promise.reject(res)))
//                 .catch((error) => { alert(JSON.stringify(error.length) || 'Error al cargar las solicitudes'); })
//                 .then((response) => {
//                   if (response.numero === 200) {
//                     mensaje = `<div class="alert alert-outline-success d-flex align-items-center" role="alert"><span class="fas fa-check-circle text-success fs-5 me-3"></span><strong>Mensaje!</strong> <p class="mb-0 flex-1">${response.mensaje}</p><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
//                   } else {
//                     mensaje = `<div class="alert alert-outline-danger d-flex align-items-center" role="alert"><span class="fas fa-times-circle text-danger fs-5 me-3"></span><strong>Mensaje!</strong> <p class="mb-0 flex-1">${response.mensaje}</p><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
//                   }
//                   setTimeout(function () {
//                     Listar_actividades_pedido(MaestroId);
//                     document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
//                   }, 1500);
//                 });
//             }
//           }
//         });
//       }
//     }

//     let Boton_cerrar_detalle;
//     if (e.target.matches('#btn_detalle_actividad') || e.target.matches('#btn_detalle_actividad *')) {
//       var padre = e.target.parentElement.parentElement;
//       var Procesos = padre.querySelector('#btn_detalle_actividad');
//       var proceso_id = Procesos.getAttribute('data-idproceso');
//       var actividad_id = Procesos.getAttribute('data-idactividad');
//       var PedidoId = Procesos.getAttribute('data-PedidoId');
//       var form_gestio = document.getElementById(`detalle_actividad_numero${actividad_id}`);
//       var numero_proceso = form_gestio.getAttribute('data-idnum_proceso');
//       Boton_cerrar_detalle = document.getElementById(`btn_cerrar_detalle${actividad_id}`);
//       if (actividad_id === numero_proceso) {
//         document.getElementById(`columnadetalleactividad${numero_proceso}`).style.display =
//           document.getElementById(`columnadetalleactividad${numero_proceso}`).style.display === 'none' ? 'table-row' : 'none';
//         setTimeout(() => { Detalles_actividaes(PedidoId, actividad_id); }, 50);
//       }
//     }

//     if (e.target.matches('#btn_cancelar_asignacion') || e.target.matches('#btn_cancelar_asignacion *')) {
//       let boton = e.target.closest('#btn_cancelar_asignacion');
//       let RecursoId = boton.getAttribute('data-id');
//       try {
//         const result = await Swal.fire({
//           title: '¿Seguro?', text: '¿Desea cancelar la solicitud?', icon: 'warning',
//           showCancelButton: true, confirmButtonColor: '#3B71CA', cancelButtonColor: '#9FA6B2',
//           confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar', customClass: { popup: 'swal2-custom-font' },
//         });
//         if (result.isConfirmed) {
//           let formData = new FormData();
//           formData.append('RecursoId', RecursoId);
//           let response = await fetch($('#base_url').val() + 'torrecontrol/cancelar_asignacion_recurso', { method: 'POST', body: formData });
//           let data = await response.json();
//           if (data && data.success === true) {
//             await Swal.fire({ title: 'Recurso Cancelado', text: data.message || 'El recurso fue cancelado exitosamente.', icon: 'success', confirmButtonColor: '#3B71CA', customClass: { popup: 'swal2-custom-font' } });
//             // ── Recargar con los filtros actuales del HTML ──
//             let fi = document.getElementById('rc-fecha-inicial')?.value ?? '';
//             let ff = document.getElementById('rc-fecha-final')?.value ?? '';
//             listar_recursos_administrador(fi, ff, '', '');
//           } else {
//             await Swal.fire({ title: 'Error', text: data.message || 'No se pudo cancelar la solicitud.', icon: 'error', confirmButtonColor: '#3B71CA', customClass: { popup: 'swal2-custom-font' } });
//           }
//         }
//       } catch (error) {
//         console.error('Error al cancelar solicitud:', error);
//         await Swal.fire({ title: 'Error inesperado', text: 'Ocurrió un error al intentar cancelar la solicitud.', icon: 'error', confirmButtonColor: '#3B71CA', customClass: { popup: 'swal2-custom-font' } });
//       }
//     }

//     if (e.target.matches(`#btn_cancelar_servicio_especial`) || e.target.matches(`#btn_cancelar_servicio_especial *`)) {
//       let boton = e.target.closest('#btn_cancelar_servicio_especial');
//       let RecursoId = boton.getAttribute('data-maestroid');
//       let ServicioId = boton.getAttribute('data-servicio');
//       let ProveedorId = boton.getAttribute('data-proveedorid');
//       const result = await Swal.fire({ title: 'Seguro', text: '¿Desea cancelar el servicio especial?', icon: 'question', showCancelButton: true, confirmButtonColor: '#3B71CA', cancelButtonColor: '#9FA6B2', confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar', customClass: { popup: 'swal2-custom-font' } });
//       if (result.isConfirmed) {
//         let dato = new FormData();
//         dato.append('RecursoId', RecursoId); dato.append('ServicioId', ServicioId); dato.append('ProveedorId', ProveedorId);
//         try {
//           const response = await fetch($('#base_url').val() + 'torrecontrol/cancelar_servicio_espacial', { method: 'POST', body: dato, cache: 'no-cache' });
//           const data = await response.json();
//           Swal.fire({ title: 'Mensaje!', text: data.message, icon: data.success ? 'success' : 'error', draggable: true }).then((result) => { if (result.isConfirmed) { Listar_servicios_especiales_proveedor(ProveedorId, RecursoId); } });
//         } catch (error) { }
//       }
//     }

//     if (e.target.matches(`#btn_rechazar_servicio_especial`) || e.target.matches(`#btn_rechazar_servicio_especial *`)) {
//       let boton = e.target.closest('#btn_rechazar_servicio_especial');
//       let RecursoId = boton.getAttribute('data-maestroid');
//       let ServicioId = boton.getAttribute('data-servicio');
//       let ProveedorId = boton.getAttribute('data-proveedorid');
//       const result = await Swal.fire({ title: 'Seguro', text: '¿Desea rechazar el servicio especial?', icon: 'question', showCancelButton: true, confirmButtonColor: '#3B71CA', cancelButtonColor: '#9FA6B2', confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar', customClass: { popup: 'swal2-custom-font' } });
//       if (result.isConfirmed) {
//         let dato = new FormData();
//         dato.append('RecursoId', RecursoId); dato.append('ServicioId', ServicioId); dato.append('ProveedorId', ProveedorId);
//         try {
//           const response = await fetch($('#base_url').val() + 'torrecontrol/rechazar_servicio_espacial', { method: 'POST', body: dato, cache: 'no-cache' });
//           const data = await response.json();
//           Swal.fire({ title: 'Mensaje!', text: data.message, icon: data.success ? 'success' : 'error', draggable: true }).then((result) => { if (result.isConfirmed) { Listar_servicios_especiales_proveedor(ProveedorId, RecursoId); } });
//         } catch (error) { }
//       }
//     }

//     if (e.target.matches(`#btn_aprobar_servicio_especial`) || e.target.matches(`#btn_aprobar_servicio_especial *`)) {
//       let boton = e.target.closest('#btn_aprobar_servicio_especial');
//       let RecursoId = boton.getAttribute('data-maestroid');
//       let ServicioId = boton.getAttribute('data-servicio');
//       let ProveedorId = boton.getAttribute('data-proveedorid');
//       const result = await Swal.fire({ title: 'Seguro', text: '¿Desea aprobar el servicio especial?', icon: 'question', showCancelButton: true, confirmButtonColor: '#3B71CA', cancelButtonColor: '#9FA6B2', confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar', customClass: { popup: 'swal2-custom-font' } });
//       if (result.isConfirmed) {
//         let dato = new FormData();
//         dato.append('RecursoId', RecursoId); dato.append('ServicioId', ServicioId); dato.append('ProveedorId', ProveedorId);
//         try {
//           const response = await fetch($('#base_url').val() + 'torrecontrol/aprobar_servicio_espacial', { method: 'POST', body: dato, cache: 'no-cache' });
//           const data = await response.json();
//           Swal.fire({ title: 'Mensaje!', text: data.message, icon: data.success ? 'success' : 'error', draggable: true }).then((result) => { if (result.isConfirmed) { Listar_servicios_especiales_proveedor(ProveedorId, RecursoId); } });
//         } catch (error) { }
//       }
//     }

//     if (e.target.matches(`#btn_guardar_se`) || e.target.matches(`#btn_guardar_se *`)) {
//       let boton = e.target.closest('#btn_guardar_se');
//       let RecursoId = boton.getAttribute('data-maestroid');
//       let ProveedorId = boton.getAttribute('data-proveedorid');
//       let ServicioId = boton.getAttribute('data-serviciosid');
//       let PedidoId = boton.getAttribute('data-solicitudesId');
//       let ServicioEspId = Array.from(document.getElementById(`list_servicio_especial2`).selectedOptions).map((option) => option.value);
//       let datos = new FormData();
//       const result = await Swal.fire({ title: 'Seguro', text: '¿Desea guardar los servicios especiales?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#3B71CA', cancelButtonColor: '#9FA6B2', confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar', customClass: { popup: 'swal2-custom-font' } });
//       if (result.isConfirmed) {
//         const btn = document.querySelector('#btn_guardar_se');
//         btn.disabled = true; btn.innerHTML = 'Creando Servicios... ⏳';
//         datos.append('RecursoId', RecursoId); datos.append('ArrayProveedorId', JSON.stringify(ProveedorId));
//         datos.append('ArrayServicioId', JSON.stringify(ServicioId)); datos.append('ArrayPedidoId', JSON.stringify(PedidoId));
//         datos.append('ArrayServicioEspId', JSON.stringify(ServicioEspId));
//         try {
//           const response = await fetch($('#base_url').val() + 'torrecontrol/agregar_servicios_especiales', { method: 'POST', body: datos, cache: 'no-cache' });
//           const data = await response.json();
//           Swal.fire({ title: 'Mensaje!', text: data.message, icon: data.status ? 'success' : 'error', draggable: true }).then((result) => { if (result.isConfirmed) { myOffcanvas.hide(); sessionStorage.clear(); } });
//         } catch (err) { console.error(err); Swal.fire('Error', 'Error al enviar datos al servidor.', 'error'); }
//         finally { btn.disabled = false; btn.innerHTML = "<span class='uil uil-save'></span> Guardar Asignación"; }
//       }
//     }

//     if (e.target.matches(`#btn_edit_datos`) || e.target.matches(`#btn_edit_datos *`)) {
//       let boton = e.target.closest('#btn_edit_datos');
//       let RecursoId = boton.getAttribute('data-RecursoId');
//       document.getElementById('btn_acciones_edit_datos').style.display = '';
//       document.getElementById('bloque_carga_liquida').style.display = '';
//       document.getElementById('bloque_datos_servicio').style.display = '';
//       try {
//         const formdata = new FormData();
//         formdata.append('RecursoId', RecursoId);
//         const response = await fetch($('#base_url').val() + 'torrecontrol/editar_datos_recurso', { method: 'POST', body: formdata, cache: 'no-cache' });
//         const data = await response.json();
//         if (data) {
//           document.getElementById('valor_servicio').value = data.valor_servicio;
//           document.getElementById('cedula_conductor').value = data.cedula_conductor;
//           document.getElementById('nombre_conductor').value = data.nombre_conductor;
//           document.getElementById('placa').value = data.referencia;
//           document.getElementById('capacidad_vehiculo').value = data.capacidad;
//           document.getElementById('tiempo_libre').value = data.tiempo_libre;
//           document.getElementById('stand_bay').value = data.stand_bay;
//           document.getElementById('cumplimiento').value = data.cumplimiento;
//           document.getElementById('contenedor').value = data.contenedor;
//           document.getElementById('tara').value = data.tara;
//         }
//       } catch (error) {
//         console.error('Error al editar datos del pedido:', error);
//         await Swal.fire({ title: 'Error inesperado', text: 'Ocurrió un error al intentar editar los datos del pedido.', icon: 'error', confirmButtonColor: '#3B71CA', customClass: { popup: 'swal2-custom-font' } });
//       }
//     }

//     if (e.target.matches('#btn_cancelar_edit_datos') || e.target.matches('#btn_cancelar_edit_datos *')) {
//       document.getElementById('btn_acciones_edit_datos').style.display = 'none';
//       document.getElementById('bloque_carga_liquida').style.display = 'none';
//       document.getElementById('bloque_datos_servicio').style.display = 'none';
//       ['valor_servicio', 'cedula_conductor', 'nombre_conductor', 'placa', 'capacidad_vehiculo', 'tiempo_libre', 'stand_bay', 'contenedor', 'tara'].forEach(id => { document.getElementById(id).value = ''; });
//       document.getElementById('cumplimiento').value = '';
//     }

//     if (e.target.matches('#btn_guardar_edit_datos') || e.target.matches('#btn_guardar_edit_datos *')) {
//       let boton = e.target.closest('#btn_guardar_edit_datos');
//       let MaestroId = boton.getAttribute('data-MaestroId');
//       try {
//         const formdata = new FormData();
//         formdata.append('MaestroId', MaestroId);
//         formdata.append('valor_servicio', document.getElementById('valor_servicio').value);
//         formdata.append('cedula_conductor', document.getElementById('cedula_conductor').value);
//         formdata.append('nombre_conductor', document.getElementById('nombre_conductor').value);
//         formdata.append('placa', document.getElementById('placa').value);
//         formdata.append('capacidad_vehiculo', document.getElementById('capacidad_vehiculo').value);
//         formdata.append('tiempo_libre', document.getElementById('tiempo_libre').value);
//         formdata.append('stand_bay', document.getElementById('stand_bay').value);
//         formdata.append('cumplimiento', document.getElementById('cumplimiento').value);
//         formdata.append('contenedor', document.getElementById('contenedor').value);
//         formdata.append('tara', document.getElementById('tara').value);
//         const response = await fetch($('#base_url').val() + 'torrecontrol/guardar_editar_datos_recurso', { method: 'POST', body: formdata, cache: 'no-cache' });
//         const data = await response.json();
//         if (data && data.success) {
//           await Swal.fire({ title: 'Éxito', text: 'Datos del recurso actualizados correctamente.', icon: 'success', confirmButtonColor: '#3B71CA', customClass: { popup: 'swal2-custom-font' } });
//           myOffcanvas.hide();
//           // ── Recargar con los filtros actuales del HTML ──
//           let fi = document.getElementById('rc-fecha-inicial')?.value ?? '';
//           let ff = document.getElementById('rc-fecha-final')?.value ?? '';
//           listar_recursos_administrador(fi, ff, '', '');
//         } else {
//           await Swal.fire({ title: 'Error', text: data.message || 'No se pudieron actualizar los datos del recurso.', icon: 'error', confirmButtonColor: '#3B71CA', customClass: { popup: 'swal2-custom-font' } });
//         }
//       } catch (error) {
//         console.error('Error al guardar los datos del recurso:', error);
//         await Swal.fire({ title: 'Error inesperado', text: 'Ocurrió un error al intentar guardar los datos del recurso.', icon: 'error', confirmButtonColor: '#3B71CA', customClass: { popup: 'swal2-custom-font' } });
//       }
//     }

//     if (e.target.matches('#btn_reasignar_recurso') || e.target.matches('#btn_reasignar_recurso *')) {
//       const boton = e.target.closest('#btn_reasignar_recurso');
//       const Proveedor_Id = boton.dataset.proveedor_id;
//       const MaestroId = boton.dataset.id;
//       const tdEstado = document.querySelector(`#tbl_administrador_recurso_pedidos td[data-id="${MaestroId}"]`);
//       let Razon_Social = tdEstado ? tdEstado.dataset.razon_social : null;
//       $('#ReasignarProveedorModal').modal('show');
//       document.getElementById("proveedor_actual").value = Razon_Social;
//       const btnGuardar = document.getElementById("btn_guardar_proveedor");
//       btnGuardar.dataset.proveedor_id = Proveedor_Id;
//       btnGuardar.dataset.maestro_id = MaestroId;
//       btnGuardar.dataset.razon_social = Razon_Social;
//     }

//     $('#ReasignarProveedorModal').on('shown.bs.modal', function () { traer_proveedor_torre_control(); });

//     if (e.target.matches("#btn_guardar_proveedor") || e.target.matches("#btn_guardar_proveedor *")) {
//       e.preventDefault();
//       const boton = e.target.closest('#btn_guardar_proveedor');
//       const ProveedorActualId = boton.dataset.proveedor_id;
//       const MaestroId = boton.dataset.maestro_id;
//       const ProveedorNuevoId = document.getElementById("nuevo_proveedor").value;
//       const MotivoCancelacion = document.getElementById("motivo_cancelacion").value.trim();
//       if (!ProveedorNuevoId) { Swal.fire({ icon: 'warning', title: 'Proveedor requerido', text: 'Debe seleccionar un proveedor nuevo' }); return; }
//       if (!MotivoCancelacion) { Swal.fire({ icon: 'warning', title: 'Motivo requerido', text: 'Debe indicar el motivo de la reasignación' }); return; }
//       Swal.fire({ title: '¿Confirmar reasignación?', text: 'Esta acción cancelará el proveedor actual y asignará uno nuevo.', icon: 'question', showCancelButton: true, confirmButtonText: 'Sí, reasignar', cancelButtonText: 'Cancelar', confirmButtonColor: '#0d6efd', cancelButtonColor: '#6c757d' }).then((result) => {
//         if (!result.isConfirmed) return;
//         const formData = new FormData();
//         formData.append('maestro_id', MaestroId); formData.append('proveedor_actual_id', ProveedorActualId);
//         formData.append('proveedor_nuevo_id', ProveedorNuevoId); formData.append('motivo_cancelacion', MotivoCancelacion);
//         fetch($('#base_url').val() + 'torrecontrol/ReasignarProveedor', { method: 'POST', body: formData })
//           .then(res => res.json())
//           .then(data => {
//             if (data.status) { Swal.fire({ icon: 'success', title: 'Reasignado', text: data.message }).then(() => { $('#ReasignarProveedorModal').modal('hide'); }); }
//             else { Swal.fire({ icon: 'error', title: 'Error', text: data.error }); }
//           })
//           .catch(err => { console.error(err); Swal.fire({ icon: 'error', title: 'Error inesperado', text: 'Ocurrió un error al procesar la solicitud' }); });
//       });
//     }

//   });

//   // ── Input búsqueda en tiempo real ──
//   document.addEventListener('input', async (e) => {
//     if (e.target.matches('#rc-input-busqueda') || e.target.matches('#rc-input-busqueda *')) {
//       let filtro = document.getElementById('rc-input-busqueda').value.trim();
//       listar_recursos_administrador('', '', '', filtro);
//     }
//   });

//   // ── Cambio de modalidad en tiempo real ──
//   document.addEventListener('change', async (e) => {
//     if (e.target.matches('#rc-modalidad') || e.target.matches('#rc-modalidad *')) {
//       let valor = document.getElementById('rc-modalidad').value.trim();
//       let fechaInicio = document.getElementById('rc-fecha-inicial')?.value.trim() ?? '';
//       let fechaFinal = document.getElementById('rc-fecha-final')?.value.trim() ?? '';
//       listar_recursos_administrador(fechaInicio, fechaFinal, valor, '');
//     }
//   });

//   // ═══════════════════════════════════════
//   // KPI CARDS — filtrar por estado
//   // ═══════════════════════════════════════
//   document.querySelectorAll('.rc-kpi-resumen').forEach(function (card) {
//     card.addEventListener('click', function () {
//       document.querySelectorAll('.rc-kpi-resumen').forEach(function (c) { c.classList.remove('active'); });
//       this.classList.add('active');
//       const estado = this.dataset.estado;
//       const fi = document.getElementById('rc-fecha-inicial')?.value ?? '';
//       const ff = document.getElementById('rc-fecha-final')?.value ?? '';
//       listar_recursos_administrador(fi, ff, '', '', estado === 'todos' ? '' : estado);
//     });
//   });

//   // ── Botón Limpiar ──
//   document.getElementById('rc-btn-limpiar')?.addEventListener('click', function () {
//     ['rc-modalidad', 'rc-estado-recurso'].forEach(function (id) { const el = document.getElementById(id); if (el) el.value = ''; });
//     const fi = document.getElementById('rc-fecha-inicial'); if (fi) fi.value = '';
//     const ff = document.getElementById('rc-fecha-final'); if (ff) ff.value = '';
//     const ib = document.getElementById('rc-input-busqueda'); if (ib) ib.value = '';
//     document.querySelectorAll('.rc-kpi-resumen').forEach(function (c) { c.classList.remove('active'); });
//     const tbody = document.getElementById('tbl_administrador_recurso_pedidos');
//     if (tbody) tbody.innerHTML = `<tr><td colspan="9" class="text-center" style="padding:50px;color:var(--slate-400);"><i class="bi bi-inbox" style="font-size:2rem;display:block;margin-bottom:8px;"></i>Filtros limpiados — realice una nueva consulta</td></tr>`;
//     const badge = document.getElementById('rc-badge-total'); if (badge) badge.textContent = '0 registros';
//     const pagBar = document.getElementById('rc-pagination-bar'); if (pagBar) pagBar.style.display = 'none';
//     ['rc-kpi-total', 'rc-kpi-pendiente', 'rc-kpi-iniciado', 'rc-kpi-completado', 'rc-kpi-cancelado'].forEach(function (id) { const el = document.getElementById(id); if (el) el.textContent = '0'; });
//   });

// };

// // ════════════════════════════════════════════════════════
// // FUNCIÓN PRINCIPAL DE LISTADO
// // ════════════════════════════════════════════════════════
// async function listar_recursos_administrador(fecha_inicial, fecha_final, valor, filtro, estadoRecurso) {
//   let dato = new FormData();
//   dato.append('fecha_inicial', fecha_inicial ?? '');
//   dato.append('fecha_final', fecha_final ?? '');
//   dato.append('valor', valor ?? '');
//   dato.append('filtro', filtro ?? '');
//   dato.append('estado_recurso', estadoRecurso ?? '');

//   try {
//     const response = await fetch($('#base_url').val() + 'torrecontrol/listar_recrusos_administrador', {
//       method: 'POST', body: dato, cache: 'no-cache',
//     });
//     const data = await response.json();
//     if (data) {
//       let tbody = document.getElementById('tbl_administrador_recurso_pedidos');
//       tbody.innerHTML = '';
//       let btn_gestion_pedidos = '';
//       let btn_removeAsignacion = '';
//       let btn_Reasignacion = '';

//       data.forEach((element) => {
//         const fila = document.createElement('tr');
//         let estados_recurso_html = '';
//         let estados = element.estados_recurso.split(',').map((e) => e.trim());

//         estados.forEach((estado) => {
//           let badgeClass = 'badge-phoenix-secondary';
//           if (estado === 'Pendiente Iniciar') {
//             badgeClass = 'badge-phoenix-secondary';
//             btn_removeAsignacion = `<a class="dropdown-item fw-bold" href="#" id="btn_cancelar_asignacion" data-id="${element.maestro_id}"><span class="uil-wrap-text"></span> Cancelar Asignación de pedido</a>`;
//             btn_Reasignacion = `<a class="dropdown-item fw-bold" href="#" id="btn_reasignar_recurso" data-id="${element.maestro_id}" data-proveedor_id="${element.proveedor_id}"><span class="uil-user-arrows"></span> Reasignar Recurso</a>`;
//           } else if (estado === 'Iniciado') {
//             badgeClass = 'badge-phoenix-info';
//             btn_Reasignacion = `<a class="dropdown-item fw-bold" href="#" id="btn_reasignar_recurso" data-id="${element.maestro_id}" data-proveedor_id="${element.proveedor_id}"><span class="uil-user-arrows"></span> Reasignar Recurso</a>`;
//           } else if (estado === 'Completado') {
//             badgeClass = 'badge-phoenix-success'; btn_Reasignacion = ``;
//           } else if (estado === 'Cancelado') {
//             badgeClass = 'badge-phoenix-danger';
//           } else if (estado === 'Rechazado') {
//             badgeClass = 'badge-phoenix-warning';
//             btn_Reasignacion = `<a class="dropdown-item fw-bold" href="#" id="btn_reasignar_recurso" data-id="${element.maestro_id}" data-proveedor_id="${element.proveedor_id}"><span class="uil-user-arrows"></span> Reasignar Recurso</a>`;
//           }
//           estados_recurso_html += `<span class="badge badge-phoenix fs-10 ${badgeClass}"><span class="badge-label">${estado}</span></span> `;
//         });

//         if (element.pedido_plantilla === 'SI') {
//           btn_gestion_pedidos = `<a class="dropdown-item fw-bold" href="#" id="btn_gestion_pedido" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-clienteId="${element.clienteId}"><span class="uil-list-ui-alt"></span> Gestion Pedidos</a>`;
//         } else { btn_gestion_pedidos = ``; }

//         const columnaNundocSolicitud = document.createElement('td');
//         columnaNundocSolicitud.innerHTML = `
//           <div class="dropdown">
//             <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N° ${element.referencias_pedido}</a>
//             <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
//               <a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-clienteId="${element.clienteId}" data-motivo_cancelacion="${element.motivo_cancelacion}"><span class="uil uil-transaction"></span> Detalle Proceso</a>
//               ${btn_removeAsignacion}
//               ${btn_Reasignacion}
//               ${btn_gestion_pedidos}
//             </div>
//           </div>`;

//         const columnaCliente = document.createElement('td'); columnaCliente.innerHTML = element.nombre; columnaCliente.style.cssText = 'width:auto;white-space:nowrap;';
//         const columnaModalidad = document.createElement('td'); columnaModalidad.innerHTML = element.modalidad; columnaModalidad.style.cssText = 'width:auto;white-space:nowrap;';
//         const columnaProceso = document.createElement('td');
//         columnaProceso.innerHTML = element.proceso === 'Asignación'
//           ? `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.proceso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`
//           : `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">${element.proceso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//         columnaProceso.style.cssText = 'width:auto;white-space:nowrap;';
//         const columnaFecha = document.createElement('td'); columnaFecha.innerHTML = element.fecha; columnaFecha.style.cssText = 'width:auto;white-space:nowrap;';
//         const columnaFechaSalida = document.createElement('td'); columnaFechaSalida.innerHTML = element.Fecha_Salida; columnaFechaSalida.style.cssText = 'width:auto;white-space:nowrap;';
//         const columnaUsuario = document.createElement('td'); columnaUsuario.innerHTML = element.usuario; columnaUsuario.style.cssText = 'width:auto;white-space:nowrap;';
//         const columnaEstado = document.createElement('td'); columnaEstado.innerHTML = estados_recurso_html; columnaEstado.style.cssText = 'width:auto;white-space:nowrap;';
//         const columnaEstadoRecurso = document.createElement('td');
//         columnaEstadoRecurso.dataset.id = element.maestro_id;
//         columnaEstadoRecurso.style.cssText = 'width:auto;white-space:nowrap;';

//         fila.appendChild(columnaNundocSolicitud); fila.appendChild(columnaCliente); fila.appendChild(columnaModalidad);
//         fila.appendChild(columnaProceso); fila.appendChild(columnaFecha); fila.appendChild(columnaFechaSalida);
//         fila.appendChild(columnaUsuario); fila.appendChild(columnaEstado); fila.appendChild(columnaEstadoRecurso);
//         tbody.appendChild(fila);
//       });

//       // ── KPIs + badge + paginación ──
//       rc_actualizarKpisAdmin(data);
//       const rcBadge = document.getElementById('rc-badge-total'); if (rcBadge) rcBadge.textContent = data.length + ' registros';
//       const rcPagBar = document.getElementById('rc-pagination-bar');
//       if (rcPagBar) {
//         rcPagBar.style.display = '';
//         const s = (id, v) => { const n = document.getElementById(id); if (n) n.textContent = v; };
//         s('rc-pag-total', data.length); s('rc-pag-desde', data.length > 0 ? 1 : 0); s('rc-pag-hasta', data.length);
//       }

//       await estado_recurso();
//     } else { console.log('else'); }
//   } catch (error) {
//     console.error('Error en la primera solicitud:', error);
//     throw error;
//   }
// }

// async function Listar_pedidos_recursos(MaestroId, proveedor_id, Proceso, EstadoRecurso) {
//   try {
//     let formData = new FormData();
//     formData.append("MaestroId", MaestroId);
//     formData.append("proveedor_id", proveedor_id);

//     let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_recursos', {
//       method: "POST",
//       body: formData
//     });

//     let data = await response.json();
//     console.log("🚀 ~ Listar_pedidos_recursos ~ data:", data)
//     if (data) {
//       let miArray = [];
//       let rows = "";

//       let totalPesoNeto = 0;
//       let totalPesoBruto = 0;
//       let totalUnidades = 0;
//       let col_estatus_publicacion = '';
//       let select_acciones = '';
//       let opciones = [
//         'Fecha Estimada Entrega',
//         'Llegada Cargue',
//         'Cargue',
//         'Salida Cargue',
//         'Inicio Ruta',
//         'Transito',
//         'Llegada Descargue',
//         'Descargue',
//         'Salida Descargue'
//       ];

//       data.sql.forEach((servicio, index) => {
//         if (servicio.peso_neto_kg) {
//           totalPesoNeto += parseFloat(servicio.peso_neto_kg);
//         }

//         if (servicio.peso_bruto_kg) {
//           totalPesoBruto += parseFloat(servicio.peso_bruto_kg);
//         }

//         if (servicio.unidades) {
//           totalUnidades += parseFloat(servicio.unidades);
//         }

//         $('#pesoNeto').text(totalPesoNeto);
//         $('#pesoBruto').text(totalPesoBruto);
//         $('#totalUnidades').text(totalUnidades);

//         miArray.push(servicio.numdoc_solicitud);

//         if (servicio.estado_proceso_pedido === 'Pendiente Iniciar') {
//           col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           select_acciones = ``;
//         } else if (servicio.estado_proceso_pedido === 'Iniciado') {
//           col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//         } else if (servicio.estado_proceso_pedido === 'Cancelado') {
//           col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_publicacion = `<a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido" data-id="${servicio.numdoc_solicitud}" data-id2="${servicio.cliente}"><span class="uil uil-feedback"></span> Publicar Pedido</a>`;
//           select_acciones = ``;
//         } else if (servicio.estado_proceso_pedido === 'Postulado') {
//           col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_publicacion = ``;
//           select_acciones = ``;
//         } else if (servicio.estado_proceso_pedido === 'Completado') {
//           col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           // Excluir la opción que ya venga en tipo_trazabilidad
//           let opcionesFiltradas = opciones.filter(opcion => opcion !== servicio.tipo_trazabilidad);

//           /*select_acciones = `
//           <select class="form-select form-select-sm me-1 px-1 py-0 w-100" onchange="trazabilidad_pedido(this.value, ${servicio.numdoc_solicitud})" id="select_tipo_trazabilidad${servicio.numdoc_solicitud}" data-id="${servicio.numdoc_solicitud}" data-Referencia="${servicio.referencia_pedido}" name="select_tipo_trazabilidad" aria-label=".form-select-sm example">
//             <option value="" selected=""><i class="uil uil-angle-down"></i></option>
//             ${opcionesFiltradas.map(opcion => `<option value="${opcion}">${opcion}</option>`).join('')}
//           </select>
//           `;*/
//         } else if (servicio.estado_proceso_pedido === 'Rechazado') {
//           col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//         }


//         checkbox_carrito = `
//           <input class="form-check-input pedido-checkbox_pr" id="check_pedido_pro${servicio.numdoc_solicitud}"
//             type="checkbox" value="${servicio.numdoc_solicitud}" data-tipo="${servicio.tipo_trazabilidad}" data-id="${servicio.numdoc_solicitud}" data-idre="${servicio.referencia_pedido}"  style="scale: 1.3;">
//           `;




//         rows += `
//             <tr>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${checkbox_carrito}</td> 
//               <th scope="row">${servicio.numdoc_solicitud}</th>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.referencia_pedido}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.cod_producto}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.producto}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.peso_neto_kg}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.peso_bruto_kg}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.presentacion}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.unidades}</td>
//               <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.num_estibas}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.ciudad_origen}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.ciudad_destino}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_cargar}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_entregar}</td>
//               <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.remitente}</td>
//               <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.destinatario}</td>
//               <td class='text-center' style='color:black;width: auto; white-space: nowrap;'><span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.tipo_trazabilidad}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span</td>
//               <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${col_estatus_publicacion}</td>
//               <td class='text-center' style='width: auto; white-space: nowrap;'></td>
//             </tr>


//           `;
//       });

//       if (data.sql.every(servicio => servicio.estado_proceso_pedido === 'Iniciado') || data.sql.every(servicio => servicio.estado_proceso_pedido === 'Completado')) {
//         // Listar_servicios(MaestroId, Proceso, miArray, proveedor_id);
//         Listar_servicios(MaestroId, Proceso, miArray, proveedor_id, data.sql.map(s => s.modalidad));
//         document.getElementById("btn_iniciar_recurso").style.display = "none";
//       } else if (EstadoRecurso === 'Cancelado') {
//         document.getElementById("btn_iniciar_recurso").style.display = "none";
//       }

//       /* Colcoar Array de las solicitudes de servicio para inicar proceso */
//       document.getElementById("btn_iniciar_recurso").setAttribute("data-SolicitudesId", JSON.stringify(miArray));

//       document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = rows;


//       let rows_Servicios = "";
//       let tabHeaders = "";

//       data.proveedores.forEach((proveedor, index) => {
//         // Construir el HTML para cada tab header
//         tabHeaders += ` 
//           <li class="nav-item">
//             <a class="nav-link ${index === 0 ? 'active' : ''}" 
//                id="${proveedor.proveedor_id}-tab" 
//                data-bs-toggle="tab" 
//                href="#tab-${proveedor.proveedor_id}" 
//                role="tab" 
//                aria-controls="tab-${proveedor.proveedor_id}" 
//                aria-selected="${index === 0 ? 'true' : 'false'}">
//                ${" - " + proveedor.razon_social + " "}
//             </a>
//           </li>
//         `;
//       });

//       // Insertar todos los headers en el contenedor
//       document.getElementById('cabecera_proveedores_servicios_especiales').innerHTML = tabHeaders;

//       // Necesitamos hacer esto en una función async
//       let tabContent = '<div class="tab-content"> ';

//       // Usamos for...of en lugar de forEach para poder usar await
//       for (const [index, proveedor] of data.proveedores.entries()) {
//         const contenido = await Listar_servicios_especiales_proveedor(proveedor.proveedor_id, MaestroId, index);
//         tabContent += contenido;
//       }

//       tabContent += '</div>';
//       document.getElementById('detalle_proveedores_servicios_especiales').innerHTML = tabContent;

//       /* Observaciones de los recursos */
//       // document.getElementById("observacion_recurso").innerHTML = data.sql[0].observacion;
//       const observacion =
//         data.sql?.[0]?.observacion ??
//         data.sql?.[0]?.observaciones ??
//         '';

//       document.getElementById("observacion_recurso").innerHTML = observacion;

//     } else {
//       document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
//     }
//   } catch (error) {
//     console.error("Error al obtener proveedores:", error);
//     document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
//   }
// }

// async function Listar_servicios(RecursoId, proceso, SolicitudesId, proveedor_id, modalidad) {
//   try {
//     let formData = new FormData();
//     formData.append("RecursoId", RecursoId);
//     formData.append("proveedor_id", proveedor_id);
//     formData.append("proceso", proceso);
//     formData.append("SolicitudesId", JSON.stringify(SolicitudesId));

//     let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_recursos_proveedor', {
//       method: "POST",
//       body: formData
//     });

//     let data = await response.json();
//     if (data) {
//       document.getElementById("tbl_recursos_proveedor").style.display = "";
//       let rows = "";
//       let rows2 = "";
//       //   <div class="form-check form-switch text-center">
//       //   <input class="form-check-input me-2" type="checkbox" name="ProveedorServiciodetalle" data-proveedorId="${servicio.proveedorId}" data-TipoServicio="${servicio.tipo_servicio}" data-pedidosId="${SolicitudesId}" data-recursoId="${RecursoId}" id="servicio_${servicio.servicioId}" value="${servicio.servicioId}">
//       // </div>
//       let col_estatus_publicacion = '';
//       let btn_cargar_trazabilidad = '';
//       let btn_postular_gestion_servicio = '';
//       data.forEach((servicio, index) => {

//         if (servicio.estado_servicio === 'Pendiente Iniciar') {
//           col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_postular_gestion_servicio = `
//           <div class="form-check form-switch text-center">
//             <input class="form-check-input me-2" type="checkbox" name="ProveedorServiciodetalle" data-modalidad="${modalidad}"  data-proveedorId="${servicio.proveedorId}" data-TipoServicio="${servicio.tipo_servicio}" data-pedidosId="${SolicitudesId}" data-recursoId="${RecursoId}" id="servicio_${servicio.servicioId}" value="${servicio.servicioId}">
//           </div>`;
//           btn_cargar_trazabilidad = ``;
//         } else if (servicio.estado_servicio === 'Iniciado') {
//           col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_postular_gestion_servicio = ``;
//           btn_cargar_trazabilidad = ``;
//         } else if (servicio.estado_servicio === 'Cancelado') {
//           col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_postular_gestion_servicio = ``;
//           btn_cargar_trazabilidad = ``;
//         } else if (servicio.estado_servicio === 'Completado') {
//           col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_postular_gestion_servicio = ``;
//           btn_cargar_trazabilidad = ``;
//         } else if (servicio.estado_servicio === 'Rechazado') {
//           col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_postular_gestion_servicio = ``;
//           btn_cargar_trazabilidad = ``;
//         } else if (servicio.estado_servicio === 'Postulado') {
//           col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_postular_gestion_servicio = ``;
//           btn_cargar_trazabilidad = ``;
//         } else if (servicio.estado_servicio === 'Ganador') {
//           col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_postular_gestion_servicio = ``;
//           btn_cargar_trazabilidad = `
//           <div class="btn-group btn-group-sm" role="group" aria-label="Extra-small button group">
//             <button class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" type="button" id="btn_cargar_trazabilidad_" style="font-size:12px;" data-ServicioId="${servicio.servicioId}" data-RecursoId="${RecursoId}">
//               <span class="uil uil-file-edit-alt" data-fa-transform="shrink-3"></span> Trazabilidad
//             </button>
//           </div>
//           `;
//         } else if (servicio.estado_servicio === 'No Asignada') {
//           col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
//           btn_postular_gestion_servicio = ``;
//           btn_cargar_trazabilidad = ``;
//         }

//         rows += `
//           <tr>
//             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.razon_social}</td>
//             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.tipo_servicio}</td>
//             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.vehiculo}</td>
//             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.Fecha_registro}</td>
//             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_limite}</td>
//             <td class='text-center' style='width: auto; white-space: nowrap;'>${col_estatus_publicacion}</td>
//             <td class='text-center' style='width: auto; white-space: nowrap;'>
//                 ${btn_postular_gestion_servicio}
//                 ${btn_cargar_trazabilidad}
//             </td>
//           </tr>
//           <tr id="detalle_recurso_proveedores_asignados_${servicio.servicioId}" style="display: none;">
//             <td colspan="12">
//               <div class="lista-detalle-accion-proveedores"></div>
//             </td>
//           </tr>
//         `;

//         rows2 += `
//         <tr>
//           <th scope="row">${index + 1}</th>
//           <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.Valor_Servicio}</td>
//           <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.Fecha_Inicio}</td>
//           <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.cedula_conductor}</td>
//           <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.nombre_conductor}</td>
//           <td class='text-center' style='width: auto; white-space: nowrap;'>${(servicio.Placa) ? servicio.Placa : 'No Aplica'}</td>
//         </tr>
//       `;
//       });

//       document.getElementById("tbody_servicios_recurso").innerHTML = rows;
//       document.getElementById("tbody_propuestos_proveedor").innerHTML = rows2;
//     } else {
//       document.getElementById("tbody_servicios_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
//       document.getElementById("tbody_propuestos_proveedor").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
//     }
//   } catch (error) {
//     console.error("Error al obtener proveedores:", error);
//     document.getElementById("tbody_servicios_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
//     document.getElementById("tbody_propuestos_proveedor").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
//   }
// }

// async function Listar_actividades_pedido(MaestroId) {
//   try {
//     let formData = new FormData();
//     formData.append("RecursoId", MaestroId);

//     let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_actividades_gestion', {
//       method: "POST",
//       body: formData,
//       cache: 'no-cache',
//     });

//     let data = await response.json();
//     let tbody = document.getElementById('tbody_actividades');
//     let usuario = document.getElementById('id_usuario').value;
//     let CriterioCalculo = "";
//     tbody.innerHTML = '';
//     data.forEach(element => {
//       // setTimeout(() => {}, 500);
//       const fila = document.createElement('tr');
//       const columnaPosicion = document.createElement('td');
//       columnaPosicion.textContent = element.posicion;
//       columnaPosicion.style.textAlign = 'center';
//       columnaPosicion.style.width = 'auto';
//       columnaPosicion.style.whiteSpace = 'nowrap';
//       const columnaParametro = document.createElement('td');
//       columnaParametro.textContent = element.nombre_tipo;
//       columnaParametro.style.textAlign = 'center';
//       columnaParametro.style.width = 'auto';
//       columnaParametro.style.whiteSpace = 'nowrap';

//       // const columnaCostoActividad = document.createElement('td');
//       // if (element.costo_actividad === null) {
//       //   columnaCostoActividad.innerHTML = `<input type="number" class="form-control form-control-sm costo_actividad text-center" id="costo_actividad${element.actividad_id}">`;
//       // } else {
//       //   columnaCostoActividad.innerHTML = `<input type="number" class="form-control form-control-sm costo_actividad text-center" id="costo_actividad${element.actividad_id}" value="${element.costo_actividad}">`;
//       // }
//       // columnaCostoActividad.style.textAlign = 'center';
//       // columnaCostoActividad.style.width = 'auto';
//       // columnaCostoActividad.style.whiteSpace = 'nowrap';

//       const columnaActividad = document.createElement('td');
//       columnaActividad.innerHTML = `<span class="text-primary">${element.nombre_opcion}</span>`;
//       columnaActividad.style.textAlign = 'center';
//       columnaActividad.style.width = 'auto';
//       columnaActividad.style.whiteSpace = 'nowrap';

//       const columnaResponsable = document.createElement('td');
//       columnaResponsable.textContent = element.nom_usuario;
//       columnaResponsable.style.textAlign = 'center';
//       columnaResponsable.style.width = 'auto';
//       columnaResponsable.style.whiteSpace = 'nowrap';

//       const columnaFechaBase = document.createElement('td');
//       columnaFechaBase.textContent = element.fecha_base === null || '' ? 'Sin Fecha' : element.fecha_base;
//       columnaFechaBase.style.textAlign = 'center';
//       columnaFechaBase.style.width = 'auto';
//       columnaFechaBase.style.whiteSpace = 'nowrap';

//       const columnaVencimiento = document.createElement('td');
//       // columnaVencimiento.textContent = element.fecha_inicio + ' ' + element.hora_inicio;
//       if (element.fecha_inicio && element.hora_inicio) {
//         columnaVencimiento.textContent = element.fecha_inicio + ' ' + element.hora_inicio;
//       } else {
//         columnaVencimiento.textContent = 'sin fecha de vencimiento';
//       }

//       columnaVencimiento.style.textAlign = 'center';
//       columnaVencimiento.style.width = 'auto';
//       columnaVencimiento.style.whiteSpace = 'nowrap';

//       // const columnaVTiempoTrancurrido = document.createElement('td');
//       // columnaVTiempoTrancurrido.textContent = element.tiempo_transcurrido_base;
//       // columnaVTiempoTrancurrido.style.textAlign = 'center';
//       // columnaVTiempoTrancurrido.style.width = 'auto';
//       // columnaVTiempoTrancurrido.style.whiteSpace = 'nowrap';

//       const columnaVencimientoTranscurrido = document.createElement('td');
//       columnaVencimientoTranscurrido.textContent = element.valor_minutos;
//       // columnaVencimientoTranscurrido.textContent = element.tiempo_transcurrido_base;
//       columnaVencimientoTranscurrido.style.textAlign = 'center';
//       columnaVencimientoTranscurrido.style.width = 'auto';
//       columnaVencimientoTranscurrido.style.whiteSpace = 'nowrap';

//       const columnaEstdo = document.createElement('td');
//       if (element.estado_actividad === 'SIN INICIAR') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       } else if (element.estado_actividad === 'EN GESTION') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       } else if (element.estado_actividad === 'COMPLETADO') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       } else if (element.estado_actividad === 'CANCELADO') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       } else if (element.estado_actividad === 'PAUSADO') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       } else if (element.estado_actividad === 'VENCIDO') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       }

//       columnaEstdo.style.textAlign = 'center';
//       columnaEstdo.style.width = 'auto';
//       columnaEstdo.style.whiteSpace = 'nowrap';
//       /* Eejcuatr consualtr de dependcias */
//       const columnaAcciones = document.createElement('td');
//       columnaAcciones.style.textAlign = 'center';
//       columnaAcciones.style.width = 'auto';
//       columnaAcciones.style.whiteSpace = 'nowrap';

//       if (element.estado_actividad === 'SIN INICIAR' || element.estado_actividad === 'EN GESTION' || element.estado_actividad === 'PAUSADO' || element.estado_actividad === 'VENCIDO') {
//         // Verificamos si la actividad actual tiene una actividad dependiente completada
//         if (element.actividad_dependiente !== null) {
//           // Buscamos la actividad dependiente y verificamos su estado
//           const actividadDependiente = data.find(act => act.actividad_id === element.actividad_dependiente);
//           if (actividadDependiente && actividadDependiente.estado_actividad === 'COMPLETADO') {
//             // Si la actividad dependiente está completada, desbloqueamos la actividad actual
//             if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
//               columnaAcciones.innerHTML = `
//                 <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                   <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                 </div>`;
//             } else {
//               if (element.estado_visualizar === 'VISUALIZADOR') {
//                 columnaAcciones.innerHTML = `
//                   <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                     <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                   </div>`;
//               } else {
//                 columnaAcciones.innerHTML = `
//                   <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                     <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad_proveedor" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-comment-alt-message"></i> Gestionar</button>
//                     <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                   </div>`;
//               }
//             }
//           } else {
//             // Si no está completada, dejamos la actividad bloqueada
//             if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
//               columnaAcciones.innerHTML = `
//                 <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                   <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                 </div>`;
//             } else {
//               if (element.estado_visualizar === 'VISUALIZADOR') {
//                 columnaAcciones.innerHTML = `
//                   <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                     <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                   </div>`;
//               } else {
//                 columnaAcciones.innerHTML = `
//                 <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                   <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad_proveedor" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}" disabled><i class="uil-comment-alt-message"></i> Gestionar</button>
//                   <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>

//                 </div>`;
//               }
//             }
//           }
//         } else {
//           // Si no tiene dependencia, se puede gestionar sin restricciones
//           if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
//             columnaAcciones.innerHTML = `
//               <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                 <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//               </div>`;
//           } else {
//             if (element.estado_visualizar === 'VISUALIZADOR') {
//               columnaAcciones.innerHTML = `
//                 <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                   <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                 </div>`;
//             } else {
//               columnaAcciones.innerHTML = `
//               <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                 <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad_proveedor" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-comment-alt-message"></i> Gestionar</button>
//                 <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>

//               </div>`;
//             }
//           }
//         }
//       } else if (element.estado_actividad === 'COMPLETADO' || element.estado_actividad === 'CANCELADO') {
//         // Si la actividad ya está completada o cancelada
//         if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
//           columnaAcciones.innerHTML = `
//             <div class="btn-group btn-group-sm" role="group" aria-label="...">
//               <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//             </div>`;
//         } else {
//           columnaAcciones.innerHTML = `
//             <div class="btn-group btn-group-sm" role="group" aria-label="...">
//               <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//             </div>`;
//         }
//       }

//       const fila2 = document.createElement('tr');
//       fila2.style.display = 'none';
//       fila2.setAttribute('id', `columnaproceso${element.actividad_id}`);

//       const columnaFormulario = document.createElement('td');

//       columnaFormulario.setAttribute('id', `celdaproceso${element.actividad_id}`);
//       columnaFormulario.setAttribute('colspan', 11);
//       columnaFormulario.style.backgroundColor = "#f1f2f4";

//       columnaFormulario.innerHTML = `
//           <div id="proceso_numero${element.num_proceso}" style="padding:1px 1px 1px;" data-idnum_proceso="${element.num_proceso}" class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
//             <div class="row">
//               <div id="mensaje${element.actividad_id}"></div>
//               <!--<div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex justify-content-end">
//                 <div class="mb-1">
//                   <div class="checkbox">
//                     <label style="font-weight: bold;font-size: 15px;">
//                       <input type="checkbox" id="publicar${element.actividad_id}" name="publicar" style="transform: scale(1.5);margin-right: 5px;">
//                       Publicar Gestion al Cliente
//                     </label>
//                   </div>
//                 </div>
//               </div>-->
//               <input class="form-control input-xs" type="hidden" id="parametros_pedido${element.actividad_id}" name="parametros_pedido" value="${element.proceso_id}" data-id_parametros_pedido="${element.proceso_id}" readonly>
//               <input class="form-control input-xs" type="hidden" id="parametros_punto_pedido_opcion${element.actividad_id}" name="parametros_punto_pedido_opcion" value="${element.actividad_id}" data-id_parametros_punto_pedido_opcion="${element.actividad_id}" readonly>

//               <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                 <div class="mb-1">
//                   <label class="form-label" for="documento${element.actividad_id}">Documento</label>
//                   <input type="file" name="documento" id="documento${element.actividad_id}" class="form-control form-control-sm">
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                 <div class="mb-1">
//                   <label class="form-label" for="estado_actividad${element.actividad_id}">Seleccionar Estado</label>
//                   <select name="estado_actividad" id="estado_actividad${element.actividad_id}" class="form-select form-select-sm" data-EstadoActividadId="${element.actividad_id}">
//                     <option value="" selected>Selecciones</option>
//                     <option value="SIN INICIAR">SIN INICIAR</option>
//                     <option value="EN GESTION">EN GESTION</option>
//                     <option value="COMPLETADO">COMPLETADO</option>
//                     <option value="CANCELADO">CANCELADO</option>
//                     <option value="PAUSADO">PAUSADO</option>
//                   </select>
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                 <div class="mb-1">
//                   <label class="form-label" for="costo_estimado${element.actividad_id}">Costo Estimado</label>
//                   <input type="text" name="costo_estimado" id="costo_estimado${element.actividad_id}" class="form-control form-control-sm text-center" disabled value="${element.costo_promedio ? parseFloat(element.costo_promedio).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : 0}">
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                 <div class="mb-1">
//                   <label class="form-label" for="costo_ejecutado${element.actividad_id}">Costo Ejecutado</label>
//                   <input type="number" name="costo_ejecutado" id="costo_ejecutado${element.actividad_id}" class="form-control form-control-sm text-center" disabled>
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
//                 <div class="mb-1">
//                   <label class="form-label" for="observacion_gestion${element.actividad_id}">Observación</label>
//                   <textarea name="observacion_gestion" id="observacion_gestion${element.actividad_id}" cols="30" rows="2" oninput="this.value = this.value.toUpperCase();"
//                     class="form-control form-control-sm"></textarea>
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex justify-content-end my-2">
//                 <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                   <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1" style="margin-right:5px;" id="btn_cancelar_gestion${element.actividad_id}"><i class="fas fa-times"></i> Cancelar</button>
//                   <button type="button" class="btn btn-success btn-sm me-1 px-1 py-1" id="btn_guardar_gestion${element.actividad_id}" data-PedidoId="${data[0]['numdoc']}" data-MaestroId="${MaestroId}"><i class="far fa-save"></i> Guardar</button>
//                 </div>
//               </div>
//             </div>
//           </div>`;
//       const fila3 = document.createElement('tr');
//       fila3.style.display = 'none';
//       fila3.setAttribute('id', `columnadetalleactividad${element.actividad_id}`);
//       const columnaGestionActvidad = document.createElement('td');
//       columnaGestionActvidad.setAttribute('id', `columnadetalleactividad${element.actividad_id}`);
//       columnaGestionActvidad.setAttribute('colspan', 11);
//       columnaGestionActvidad.innerHTML = `
//         <div id="detalle_actividad_numero${element.num_proceso}" style="padding:1px 1px 1px;" data-idnum_proceso="${element.num_proceso}" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//         <div id="mensaje_publicado${element.actividad_id}"></div>
//           <div class="bs-example" data-example-id="simple-table">
//             <table class="table table-sm" style="font-size:12px;">
//               <thead class='table-bordered'>
//                 <tr>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>#</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Fecha</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Costo Estimado</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Costo Ejecutado</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Observación</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Responsable</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Evidencia</th>
//                 </tr>
//               </thead>
//               <tbody id="tbl_detalle_gestion${element.actividad_id}"></tbody>
//             </table>
//           </div>
//         </div>
//         `;

//       // criterio_calculo
//       if (element.criterio_calculo === 1) {
//         CriterioCalculo = `Fecha Inicial`;
//       } else if (element.criterio_calculo === 2) {
//         CriterioCalculo = `Fecha Cargue`;
//       } else if (element.criterio_calculo === 3) {
//         CriterioCalculo = `Fecha Descargue`;
//       } else if (element.criterio_calculo === 4) {
//         // CriterioCalculo = `Fecha actividad dependiente`+' ('+element.nombre_actividad_dependiente+')';
//         CriterioCalculo = `Fecha actividad dependiente`;
//       }

//       const columnaCriterioCalculo = document.createElement('td');
//       columnaCriterioCalculo.innerHTML = CriterioCalculo;
//       columnaCriterioCalculo.style.textAlign = 'center';
//       columnaCriterioCalculo.style.width = 'auto';
//       columnaCriterioCalculo.style.whiteSpace = 'nowrap';

//       fila.appendChild(columnaPosicion);
//       fila.appendChild(columnaParametro);
//       fila.appendChild(columnaActividad);
//       // fila.appendChild(columnaCostoActividad);
//       fila.appendChild(columnaResponsable);
//       fila.appendChild(columnaCriterioCalculo);
//       fila.appendChild(columnaFechaBase);
//       fila.appendChild(columnaVencimiento);
//       // fila.appendChild(columnaVTiempoTrancurrido);
//       fila.appendChild(columnaVencimientoTranscurrido);
//       fila.appendChild(columnaEstdo);
//       fila.appendChild(columnaAcciones);

//       fila2.appendChild(columnaFormulario);
//       fila3.appendChild(columnaGestionActvidad);
//       // tbody.appendChild(fila, fila2, fila3);
//       tbody.appendChild(fila);
//       tbody.appendChild(fila2);
//       tbody.appendChild(fila3);
//     });
//     Numero_actividades(data[0]['numdoc']);
//   } catch (error) {
//     console.error("Error al obtener proveedores:", error);
//     // document.getElementById("bloque_header").innerHTML = `<p class="text-danger">Error al cargar servicios</p>`;
//   } finally { }
// }

// async function Numero_actividades(nundoc) {
//   let data = new FormData();
//   data.append('nundoc', nundoc);
//   await fetch($('#base_url').val() + 'pedidos/Progreso_pedido', {
//     method: 'POST',
//     body: data,
//     cache: 'no-cache',
//   })
//     .then(res => (res.ok ? res.json() : Promise.reject(res)))
//     .catch(error => {
//       alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
//     })
//     .then(response => {
//       var objeto = response.cantidad_actividades;
//       var cantidadActividades = objeto.Cantidad_actividades;
//       var totalActividades = parseInt(cantidadActividades);
//       var porcentajePorActividad = 100 / totalActividades;
//       var progresoActual = 0;
//       response.estado_actividades.forEach(element => {
//         // console.log(element);
//         if (element.estado_actividad === 'COMPLETADO') {
//           progresoActual++;
//           // totalActividadesCompletas;
//         }
//       });
//       // Calcular el ancho de la barra de progreso
//       // var ancho = (progresoActual / totalActividades) * 100;
//       var ancho = 100 * progresoActual / totalActividades;
//       // console.log(ancho);
//       // Actualizar la barra de progreso
//       $('.progress-bar').css('width', ancho + '%');
//       // $(".progress-bar").html(ancho.toFixed(2) + "%"); // Redondear el porcentaje a dos decimales
//       ancho = Math.round(ancho * 100) / 100; // Redondear a dos decimales
//       $('.progress-bar').html(ancho + '%'); // Redondear el porcentaje a dos decimales
//     });
// }

// async function Detalles_actividaes(nundoc, actividad_id) {
//   let data = new FormData();
//   data.append('nundoc', nundoc);
//   data.append('actividad', actividad_id);
//   await fetch($('#base_url').val() + 'pedidos/ver_detalle_actividad', {
//     method: 'POST',
//     body: data,
//     cache: 'no-cache',
//   })
//     .then(res => (res.ok ? res.json() : Promise.reject(res)))
//     .catch(error => {
//       alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
//     })
//     .then(response => {
//       let tbody = document.getElementById('tbl_detalle_gestion' + actividad_id);
//       tbody.innerHTML = '';
//       if (response.length > 0) {
//         response.forEach(element => {
//           setTimeout(() => {
//             const fila = document.createElement('tr');
//             fila.style.fontSize = '12px';
//             const columnaNumero = document.createElement('td');
//             columnaNumero.textContent = element.detalle_id;
//             columnaNumero.style.textAlign = 'center';
//             columnaNumero.style.width = 'auto';
//             columnaNumero.style.whiteSpace = 'nowrap';

//             const columnaFecha = document.createElement('td');
//             columnaFecha.textContent = element.fecha;
//             columnaFecha.style.textAlign = 'center';
//             columnaFecha.style.width = 'auto';
//             columnaFecha.style.whiteSpace = 'nowrap';

//             const columnaCostoEstimado = document.createElement('td');
//             columnaCostoEstimado.textContent = parseFloat(element.costo_promedio).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
//             columnaCostoEstimado.style.textAlign = 'center';
//             columnaCostoEstimado.style.width = 'auto';
//             columnaCostoEstimado.style.whiteSpace = 'nowrap';

//             const columnaCostoActividad = document.createElement('td');
//             columnaCostoActividad.textContent = element.costo_actividad ? parseFloat(element.costo_actividad).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : '-';
//             columnaCostoActividad.style.textAlign = 'center';
//             columnaCostoActividad.style.width = 'auto';
//             columnaCostoActividad.style.whiteSpace = 'nowrap';


//             const columnaObservacion = document.createElement('td');
//             columnaObservacion.textContent = element.observacion;
//             columnaObservacion.style.textAlign = 'center';
//             columnaObservacion.style.width = 'auto';
//             columnaObservacion.style.whiteSpace = 'nowrap';

//             const columnaResponsable = document.createElement('td');
//             columnaResponsable.textContent = element.usuario;
//             columnaResponsable.style.textAlign = 'center';
//             columnaResponsable.style.width = 'auto';
//             columnaResponsable.style.whiteSpace = 'nowrap';

//             const columnaEvidencia = document.createElement('td');
//             if (element.nombre_archivo !== 'Sin_evidencia') {
//               columnaEvidencia.innerHTML = `
//             <div class="btn-group" role="group" aria-label="...">
//               <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" onclick="abrir_fotos('${element.documento}' , '${element.nombre_archivo}')"><i class="uil-file-download-alt"></i> Descargar</button>
//              </div>
//             `;
//             } else {
//               columnaEvidencia.innerHTML = `<span class="text-primary">Sin evidencia</span>`;
//             }
//             columnaEvidencia.style.textAlign = 'center';
//             columnaEvidencia.style.width = 'auto';
//             columnaEvidencia.style.whiteSpace = 'nowrap';

//             fila.appendChild(columnaNumero);
//             // fila.appendChild(columnaParametro);
//             // fila.appendChild(columnaConcepto);
//             fila.appendChild(columnaFecha);
//             fila.appendChild(columnaCostoEstimado);
//             fila.appendChild(columnaCostoActividad);
//             fila.appendChild(columnaObservacion);
//             fila.appendChild(columnaResponsable);
//             // fila.appendChild(columnaPublicado);
//             fila.appendChild(columnaEvidencia);
//             tbody.appendChild(fila);
//           }, 500);
//         });
//       } else {
//         const fila = document.createElement('tr');
//         const columnaSindatos = document.createElement('td');
//         columnaSindatos.colSpan = 5;
//         columnaSindatos.innerHTML = `Actividad del parametro sin Gestión`;
//         columnaSindatos.style.textAlign = 'center';
//         columnaSindatos.style.width = 'auto';
//         columnaSindatos.style.whiteSpace = 'nowrap';

//         fila.appendChild(columnaSindatos);
//         tbody.appendChild(fila);
//       }
//     });
// }

// function abrir_fotos(url, name) {
//   // URL de la página que deseas abrir en la nueva ventana
//   var url = $('#base_url').val() + url + name;
//   // Opciones de la ventana emergente (ancho, alto, opciones adicionales)
//   var ventanaAncho = 1000;
//   var ventanaAlto = 1000;
//   // Calcula las coordenadas para centrar la ventana
//   var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
//   var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
//   // Opciones de la ventana emergente (ancho, alto, posición)
//   var opcionesVentana = 'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
//   // Utiliza window.open para abrir la nueva ventana
//   window.open(url, name, opcionesVentana);
// }

// function trazabilidad_pedido(valor) {
//   console.log("🚀 ~ valor:", valor)
//   if (valor === '') {
//     document.getElementById("id_documentos").style.display = "none";
//     document.getElementById("id_fechas").style.display = "none";
//     document.getElementById("botones").style.display = "none";
//   } else if (valor === 'Fecha Estimada Entrega') {
//     document.getElementById("id_documentos").style.display = "none";
//     document.getElementById("id_fechas").style.display = "";
//     document.getElementById("botones").style.display = "";
//   } else {
//     document.getElementById("id_documentos").style.display = "";
//     document.getElementById("id_fechas").style.display = "none";
//     document.getElementById("botones").style.display = "";

//   }

// }

// async function ImportarTrazabilidad(params) {
//   // console.log("🚀 ~ ImportarTrazabilidad ~ params:", params)

//   if (globalData.length === 0) {
//     Swal.fire({
//       title: "Mensaje!",
//       text: "No hay datos para enviar. Primero carga y previsualiza un archivo de Excel.",
//       icon: "warning",
//       draggable: true
//     });
//     return;
//   }

//   const result = await Swal.fire({
//     title: 'Seguro',
//     text: '¿Desea aprobar la solicitud?',
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3B71CA',
//     cancelButtonColor: '#9FA6B2',
//     confirmButtonText: 'Aceptar',
//     cancelButtonText: 'Cancelar',
//     customClass: {
//       popup: 'swal2-custom-font',
//     },
//   });

//   if (result.isConfirmed) {
//     const btn = document.querySelector("#btn_guardar_trazabilidad");
//     btn.disabled = true;
//     btn.innerHTML = "Importando... ⏳";

//     try {
//       // Crear objeto FormData
//       let formData = new FormData();
//       // formData.append("ServicioId", ServicioId);
//       // formData.append("RecursoId", RecursoId);
//       formData.append("globalData", JSON.stringify(globalData));  // Convertimos globalData a JSON

//       const response = await fetch($('#base_url').val() + 'torrecontrol/importar_trazabilidad_pedido', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       Swal.fire({
//         title: "Mensaje!",
//         text: data.message,
//         icon: data.status === true ? "success" : "error",
//         draggable: true
//       });

//     } catch (err) {
//       console.error(err);
//       alert("Error al enviar datos al servidor.");
//     } finally {
//       btn.disabled = false;
//       btn.innerHTML = "<span class='uil uil-file-import'></span> Importar Trazabilidad";
//     }
//   }

// }

// // function traer_servicio_especial() {
// //   $(`#list_servicio_especial2_Proveedor`).html('');
// //   $.ajax({
// //     url: $('#base_url').val() + 'torrecontrol/traer_servicio_especial',
// //     type: 'POST',
// //     dataType: 'json',
// //     success: function (data) {
// //       //traer el tipo de vehiculo
// //       $(`#list_servicio_especial2_Proveedor`).append('<option value="">Seleccione</option>');
// //       data.forEach(function (element, index1) {
// //         $(`#list_servicio_especial2_Proveedor`).append(
// //           '<option value="' + element.id + '" style="width: 100%;font-size: 10px;"   >' + element.nombre + '</option>'
// //         );
// //       });
// //       // Inicializar los selects con Select2
// //       $(`#list_servicio_especial2_Proveedor`).select2({
// //         placeholder: 'Seleccione una opción',
// //         allowClear: true,
// //         width: '100%',
// //       });
// //     },
// //     error: function (jqXHR, textStatus, errorThrown) {
// //       console.log('no entro ');
// //       console.log(jqXHR);
// //       console.log(textStatus);
// //       console.log(errorThrown);
// //     },
// //   });
// // }

// // function traer_servicio_especial() {
// //   $('#list_servicio_especial2_Proveedor').html('');
// //   $.ajax({
// //     url: $('#base_url').val() + 'torrecontrol/traer_servicio_especial',
// //     type: 'POST',
// //     dataType: 'json',
// //     success: function (data) {

// //       $('#list_servicio_especial2_Proveedor').append('<option value="">Seleccione</option>');

// //       data.forEach(function (element) {
// //         $('#list_servicio_especial2_Proveedor').append(
// //           `<option value="${element.id}" data-nombre="${element.nombre}">
// //                         ${element.nombre}
// //                     </option>`
// //         );
// //       });

// //       // Inicializar Select2
// //       $('#list_servicio_especial2_Proveedor').select2({
// //         placeholder: 'Seleccione servicios',
// //         allowClear: true,
// //         width: '100%'
// //       });

// //       // === Eventos de Select2 ===
// //       manejarEventosServicios();
// //     }
// //   });
// // }

// function traer_servicio_especial() {

//   $('#list_servicio_especial2_Proveedor').html('');

//   $.ajax({
//     url: $('#base_url').val() + 'torrecontrol/traer_servicio_especial',
//     type: 'POST',
//     dataType: 'json',

//     success: function (data) {

//       $('#list_servicio_especial2_Proveedor').append('<option value="">Seleccione</option>');

//       data.forEach(function (element) {
//         $('#list_servicio_especial2_Proveedor').append(
//           `<option value="${element.id}" data-nombre="${element.nombre}">
//               ${element.nombre}
//            </option>`
//         );
//       });

//       // Inicializar Select2
//       $('#list_servicio_especial2_Proveedor').select2({
//         placeholder: 'Seleccione servicios',
//         allowClear: true,
//         width: '100%'
//       });

//       // Activar eventos
//       manejarEventosServicios();
//     },

//     error: function () {
//       console.log('Error al traer servicios especiales');
//     }
//   });

// }



// // function manejarEventosServicios() {

// //   const select = $('#list_servicio_especial2_Proveedor');
// //   const contenedor = $('#contenedor_valores_servicios');

// //   // Al seleccionar un servicio
// //   select.on('select2:select', function (e) {
// //     let id = e.params.data.id;
// //     let texto = e.params.data.text;

// //     // Crear input para ese servicio
// //     let html = `
// //             <div class="row mt-1 servicio-item" data-id="${serv.id}" id="servicio_valor_${id}">
// //                 <div class="col-7">
// //                     <label class="form-label mb-0">${texto}</label>
// //                 </div>
// //                 <div class="col-5">
// //                     <input type="number" 
// //                            class="form-control form-control-sm valor_servicio_input"
// //                            name="valores_servicio[${id}]" 
// //                            placeholder="Valor" data-id="${serv.id}"
// //                            min="0">
// //                 </div>
// //             </div>
// //         `;

// //     contenedor.append(html);
// //   });

// //   // Al quitar un servicio
// //   select.on('select2:unselect', function (e) {
// //     let id = e.params.data.id;

// //     // Eliminar el input del servicio quitado
// //     $(`#servicio_valor_${id}`).remove();
// //   });
// // }

// function manejarEventosServicios() {

//   const select = $('#list_servicio_especial2_Proveedor');
//   const contenedor = $('#contenedor_valores_servicios');

//   // Cuando cambia la selección (agrega o elimina)
//   select.on('change', function () {

//     contenedor.empty(); // limpiar todo

//     const serviciosSeleccionados = $(this).select2('data');

//     serviciosSeleccionados.forEach((serv, index) => {
//       contenedor.append(`
//                 <div class="row mb-2 servicio-item" data-id="${serv.id}">
//                     <div class="col-md-6">
//                         <label class="form-label mb-0">${serv.text}</label>
//                     </div>
//                     <div class="col-md-6">
//                         <input type="number"
//                             class="form-control form-control-sm valor_servicio_input"
//                             placeholder="Valor del servicio"
//                             data-id="${serv.id}">
//                     </div>
//                 </div>
//             `);
//     });

//   });

// }



// async function estado_recurso() {
//   const filas = document.querySelectorAll("#tbl_administrador_recurso_pedidos tr td:last-child");
//   const baseUrl = $('#base_url').val();

//   for (const columna of filas) {
//     const id = columna.dataset.id;
//     if (id) {
//       try {
//         const formData = new FormData();
//         formData.append('RecursoId', id);

//         const response = await fetch(`${baseUrl}torrecontrol/estado_recurso`, {
//           method: 'POST',
//           body: formData
//         });

//         const data = await response.json();
//         // console.log("🚀 ~ estado_recurso ~ data:",  data)

//         columna.innerHTML = ''; // Limpiar contenido previo

//         // Verificar si es un array o un objeto único
//         if (Array.isArray(data)) {
//           // Si es un array, recorrerlo
//           data.forEach(element => {
//             columna.innerHTML += generarBadge(element);
//           });
//         } else {
//           // Si es un objeto único, solo mostrarlo
//           columna.innerHTML = generarBadge(data);
//         }

//       } catch (error) {
//         console.error('Error obteniendo estado recurso:', error);
//         columna.innerHTML = '<span class="text-danger">Error</span>';
//       }
//     }
//   }
// }

// // Función auxiliar para generar el badge según el estado
// function generarBadge(element) {
//   let badgeClass = "badge-phoenix-dark"; // Estado por defecto
//   let estadoTexto = "Desconocido";

//   switch (element.estado_servicio) {
//     case 'Ganador':
//       badgeClass = "badge-phoenix-success";
//       estadoTexto = element.estado_servicio;
//       break;
//     case 'Postulado':
//       badgeClass = "badge-phoenix-warning";
//       estadoTexto = element.estado_servicio;
//       break;
//     case 'Pendiente Iniciar':
//       badgeClass = "badge-phoenix-secondary";
//       estadoTexto = element.estado_servicio;
//       break;
//     case 'No Asignada':
//       badgeClass = "badge-phoenix-danger";
//       estadoTexto = element.estado_servicio;
//       break;
//   }

//   return `<span class="badge badge-phoenix fs-10 ${badgeClass}" data-bs-toggle="tooltip" data-bs-placement="top" title="${element.razon_social}">
//             <span class="badge-label">${estadoTexto}</span>
//           </span>`;
// }

// function DynamicOffcanvas(options) {
//   // Configuración predeterminada
//   var defaults = {
//     id: 'dynamicOffcanvas',
//     title: 'Default Title',
//     content: 'Default Content',
//     class: 'offcanvas-end',
//     scroll: true,
//     backdrop: false,
//     width: '60%', // Nuevo valor por defecto
//     height: 'auto' // Puedes agregar height también
//   };

//   // Fusionar opciones con defaults
//   this.settings = Object.assign({}, defaults, options);

//   // Inicializar
//   this.initialize();
// }

// DynamicOffcanvas.prototype.initialize = function () {
//   this.createOffcanvas();
//   this.bsOffcanvas = new bootstrap.Offcanvas(this.offcanvasElement);
// };

// DynamicOffcanvas.prototype.createOffcanvas = function () {
//   var offcanvasHTML = `
//     <div class="offcanvas ${this.settings.class}" 
//         id="${this.settings.id}" 
//         data-bs-scroll="${this.settings.scroll}" 
//         data-bs-backdrop="${this.settings.backdrop}" 
//         tabindex="-1" 
//         aria-labelledby="${this.settings.id}-label" style="width: ${this.settings.width}; height: ${this.settings.height}">
//         <div class="offcanvas-header">
//           <h5 class="offcanvas-title fw-bold" id="${this.settings.id}-label">
//             ${this.settings.title}
//           </h5>
//           <button class="btn-close text-reset" type="button" data-bs-dismiss="offcanvas"></button>
//         </div>
//       <div class="offcanvas-body">
//         ${this.settings.content}
//       </div>
//     </div>
// `;

//   var container = document.createElement('div');
//   container.innerHTML = offcanvasHTML;
//   this.offcanvasElement = container.firstElementChild;
//   document.body.appendChild(this.offcanvasElement);
// };

// DynamicOffcanvas.prototype.updateContent = function (newContent) {
//   var body = this.offcanvasElement.querySelector('.offcanvas-body');
//   body.innerHTML = newContent;
// };

// DynamicOffcanvas.prototype.updateTitle = function (newTitle) {
//   var title = this.offcanvasElement.querySelector('.offcanvas-title');
//   title.innerHTML = newTitle;
// };

// /* Funcion para modificar la clase del offcanvas */
// DynamicOffcanvas.prototype.updateClass = function (newClass) {
//   var offcanvas = this.offcanvasElement;

//   // Eliminar todas las clases de posición de offcanvas
//   Array.from(offcanvas.classList)
//     .filter(cls => cls.startsWith('offcanvas-'))
//     .forEach(cls => offcanvas.classList.remove(cls));

//   // Agregar la nueva clase
//   offcanvas.classList.add(newClass);
// };

// // Función para modificar el ancho
// DynamicOffcanvas.prototype.updateWidth = function (newWidth) {
//   this.offcanvasElement.style.width = newWidth;
// };

// // Función para modificar el alto
// DynamicOffcanvas.prototype.updateHeight = function (newHeight) {
//   this.offcanvasElement.style.height = newHeight;
// };

// DynamicOffcanvas.prototype.show = function () {
//   this.bsOffcanvas.show();
// };

// DynamicOffcanvas.prototype.hide = function () {
//   this.bsOffcanvas.hide();
// };

// DynamicOffcanvas.prototype.getContent = function () {
//   var body = this.offcanvasElement.querySelector('.offcanvas-body');
//   return body.innerHTML; // Devuelve el contenido actual
// };

// if (!window.globalData) {
//   window.globalData = [];
// } else {
//   console.log('El offcanvas ya está creado.');
// }

// function leerExcel() {
//   const fileInput = document.getElementById('excelFile');
//   const file = fileInput.files[0];

//   if (!file) {
//     alert("Por favor selecciona un archivo de Excel primero.");
//     return;
//   }

//   const reader = new FileReader();

//   reader.onload = function (e) {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: 'array' });

//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//     if (sheetData.length === 0) {
//       alert("El archivo está vacío o no tiene datos.");
//       return;
//     }

//     const previewTable = document.getElementById("previewTable");
//     previewTable.innerHTML = "";

//     const thead = document.createElement("thead");
//     thead.style.fontSize = "10px";
//     thead.style.color = "#332D2D";

//     const headerRow = document.createElement("tr");
//     headerRow.classList.add("text-center");

//     const headers = sheetData[0].filter(header => header.trim() !== "");
//     headers.forEach(headerText => {
//       const th = document.createElement("th");
//       th.textContent = headerText;
//       headerRow.appendChild(th);
//     });

//     const thEliminar = document.createElement("th");
//     thEliminar.textContent = "Acciones";
//     headerRow.appendChild(thEliminar);

//     thead.appendChild(headerRow);
//     previewTable.appendChild(thead);

//     const tbody = document.createElement("tbody");
//     tbody.style.fontSize = "10px";
//     tbody.style.textAlign = "center";

//     const filasUtiles = sheetData.slice(1).filter(row => {
//       return row.some(cell => cell !== undefined && cell !== null && String(cell).trim() !== "");
//     });

//     // Construimos un array temporal
//     globalData = filasUtiles.map((rowData, rowIndex) => {
//       const obj = {};
//       const tr = document.createElement("tr");

//       headers.forEach((header, index) => {
//         const td = document.createElement("td");
//         let cellData = rowData[index] || "";

//         if (typeof cellData === "number") {
//           const headerText = header.toLowerCase();
//           if (headerText.includes("fecha")) {
//             // let excelDate = new Date((cellData - 25569) * 86400 * 1000);
//             // let year = excelDate.getFullYear();
//             // let month = String(excelDate.getMonth() + 1).padStart(2, '0');
//             // let day = String(excelDate.getDate()).padStart(2, '0');
//             // cellData = `${year}-${month}-${day}`; // Solo FECHA

//             let excelDate = new Date(Math.round((cellData - 25569) * 86400 * 1000));

//             // Ajuste por desfase horario (convierte a UTC primero)
//             let year = excelDate.getUTCFullYear();
//             let month = String(excelDate.getUTCMonth() + 1).padStart(2, '0');
//             let day = String(excelDate.getUTCDate()).padStart(2, '0');

//             cellData = `${year}-${month}-${day}`; // Solo FECHA
//           } else if (headerText.includes("hora")) {
//             // let excelDate = new Date((cellData - 25569) * 86400 * 1000);
//             // let hours = String(excelDate.getHours()).padStart(2, '0');
//             // let minutes = String(excelDate.getMinutes()).padStart(2, '0');
//             // let seconds = String(excelDate.getSeconds()).padStart(2, '0');
//             // cellData = `${hours}:${minutes}:${seconds}`; // Solo HORA
//             // Si es hora
//             const totalSeconds = Math.round(cellData * 24 * 60 * 60);
//             const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
//             const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
//             const seconds = String(totalSeconds % 60).padStart(2, '0');
//             cellData = `${hours}:${minutes}:${seconds}`;
//           }
//         }

//         obj[header] = cellData;
//         td.textContent = cellData;
//         tr.appendChild(td);
//       });

//       // Botón de eliminar
//       const tdEliminar = document.createElement("td");
//       const btnEliminar = document.createElement("button");
//       btnEliminar.innerHTML = `<span class="uil-trash-alt"></span>`;
//       btnEliminar.classList.add("btn", "btn-subtle-danger", "btn-sm", "me-1", "px-1", "py-0");

//       btnEliminar.onclick = function () {
//         if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
//           // Elimina del DOM
//           tr.remove();

//           // Elimina del array
//           globalData.splice(rowIndex, 1);
//         }
//       };

//       tdEliminar.appendChild(btnEliminar);
//       tr.appendChild(tdEliminar);

//       tbody.appendChild(tr);

//       return obj;
//     });

//     previewTable.appendChild(tbody);

//   };

//   reader.readAsArrayBuffer(file);
// }

// function leerExcelPeido() {
//   const fileInput = document.getElementById('excelFilePedidos');
//   const file = fileInput.files[0];

//   if (!file) {
//     alert("Por favor selecciona un archivo de Excel primero.");
//     return;
//   }

//   const reader = new FileReader();

//   reader.onload = function (e) {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: 'array' });

//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//     if (sheetData.length === 0) {
//       alert("El archivo está vacío o no tiene datos.");
//       return;
//     }

//     const previewTable = document.getElementById("previewTablePedidos");
//     previewTable.innerHTML = "";

//     const thead = document.createElement("thead");
//     thead.style.fontSize = "10px";
//     thead.style.color = "#332D2D";

//     const headerRow = document.createElement("tr");
//     headerRow.classList.add("text-center");

//     const headers = sheetData[0].filter(header => header.trim() !== "");
//     headers.forEach(headerText => {
//       const th = document.createElement("th");
//       th.textContent = headerText;
//       headerRow.appendChild(th);
//     });

//     const thEliminar = document.createElement("th");
//     thEliminar.textContent = "Acciones";
//     headerRow.appendChild(thEliminar);

//     thead.appendChild(headerRow);
//     previewTable.appendChild(thead);

//     const tbody = document.createElement("tbody");
//     tbody.style.fontSize = "10px";
//     tbody.style.textAlign = "center";

//     const filasUtiles = sheetData.slice(1).filter(row => {
//       return row.some(cell => cell !== undefined && cell !== null && String(cell).trim() !== "");
//     });

//     // Construimos un array temporal
//     globalData = filasUtiles.map((rowData, rowIndex) => {
//       const obj = {};
//       const tr = document.createElement("tr");

//       headers.forEach((header, index) => {
//         const td = document.createElement("td");
//         let cellData = rowData[index] || "";

//         if (typeof cellData === "number") {
//           const headerText = header.toLowerCase();
//           if (headerText.includes("fecha")) {
//             // Solo FECHA
//             let excelDate = new Date(Math.round((cellData - 25569) * 86400 * 1000));

//             // Ajuste por desfase horario (convierte a UTC primero)
//             let year = excelDate.getUTCFullYear();
//             let month = String(excelDate.getUTCMonth() + 1).padStart(2, '0');
//             let day = String(excelDate.getUTCDate()).padStart(2, '0');

//             cellData = `${year}-${month}-${day}`;
//           } else if (headerText.includes("hora")) {
//             // Si es hora
//             const totalSeconds = Math.round(cellData * 24 * 60 * 60);
//             const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
//             const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
//             const seconds = String(totalSeconds % 60).padStart(2, '0');
//             cellData = `${hours}:${minutes}:${seconds}`;
//           }
//         }

//         obj[header] = cellData;
//         td.textContent = cellData;
//         tr.appendChild(td);
//       });

//       // Botón de eliminar
//       const tdEliminar = document.createElement("td");
//       const btnEliminar = document.createElement("button");
//       btnEliminar.innerHTML = `<span class="uil-trash-alt"></span>`;
//       btnEliminar.classList.add("btn", "btn-subtle-danger", "btn-sm", "me-1", "px-1", "py-0");

//       btnEliminar.onclick = function () {
//         if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
//           // Elimina del DOM
//           tr.remove();

//           // Elimina del array
//           globalData.splice(rowIndex, 1);
//         }
//       };

//       tdEliminar.appendChild(btnEliminar);
//       tr.appendChild(tdEliminar);

//       tbody.appendChild(tr);

//       return obj;
//     });

//     previewTable.appendChild(tbody);

//   };

//   reader.readAsArrayBuffer(file);
// }

// async function Listar_servicios_especiales_proveedor(ProveedorId, MaestroId, index) {
//   let formData = new FormData();
//   formData.append('ProveedorId', ProveedorId);
//   formData.append('MaestroId', MaestroId);

//   try {
//     let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_especiales_recursos_proveedor', {
//       method: "POST",
//       body: formData
//     });

//     let data = await response.json();
//     let servicios = "";

//     if (data && data.length > 0) {
//       servicios = `
//         <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="tab-${ProveedorId}" role="tabpanel" aria-labelledby="${ProveedorId}-tab">
//           <div class="table-responsive">
//             <table class="table table-bordered table-hover align-middle table-sm" style="font-size: 12px;">
//               <thead class="table-light">
//                 <tr>
//                   <th>Tipo servicio</th>
//                   <th>Estado</th>
//                   <th>Valor</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${data.map(element => `
//                   <tr>
//                     <td>${element.nombre}</td>
//                     <td>
//                      <span class="badge badge-phoenix fs-10 badge-phoenix${element.estado_servicio_especial === 'Aprobado' ? '-success' : element.estado_servicio_especial === 'Cancelado' ? '-danger' : '-secondary'}"><span class="badge-label">${element.estado_servicio_especial}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span>
//                       </span>

//                     </td>
//                      ${element.estado_servicio_especial === 'Aprobado' ? `<td> $${element.valor_servicio.toLocaleString()}</td>` : `     
//                       <td class="editable-value" 
//                           data-servicio-id="${element.servicio_especial}"
//                           data-proveedor-id="${element.proveedor_id}"
//                           data-original-value="${element.valor_servicio}"
//                           data-maestro-id="${MaestroId}">
//                         $${element.valor_servicio.toLocaleString()}
//                       </td>`}
//                   </tr>
//                 `).join('')}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       `;
//     } else {
//       servicios = `
//         <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="tab-${ProveedorId}" role="tabpanel" aria-labelledby="${ProveedorId}-tab">
//           <div class="alert alert-info text-center py-4">
//             <i class="bi bi-info-circle-fill fs-3 mb-3"></i>
//             <h5 class="alert-heading">No hay servicios registrados</h5>
//           </div>
//         </div>
//       `;
//     }

//     // Inicializar eventos después de renderizar
//     setTimeout(initEditableValues, 100);

//     return servicios;
//   } catch (error) {
//     console.error('Error:', error);
//     return `
//       <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="tab-${ProveedorId}" role="tabpanel" aria-labelledby="${ProveedorId}-tab">
//         <div class="alert alert-danger text-center py-4">
//           <i class="bi bi-exclamation-triangle-fill fs-3 mb-3"></i>
//           <h5 class="alert-heading">Error al cargar los servicios</h5>
//           <p class="mb-0">Por favor intente nuevamente</p>
//         </div>
//       </div>
//     `;
//   }
// }

// function initEditableValues() {
//   document.querySelectorAll('.editable-value').forEach(cell => {
//     cell.addEventListener('click', function (e) {
//       if (this.querySelector('input')) return; // Ya está en modo edición

//       const originalValue = this.getAttribute('data-original-value');
//       const servicioId = this.getAttribute('data-servicio-id');
//       const proveedorId = this.getAttribute('data-proveedor-id');
//       const maestroId = this.getAttribute('data-maestro-id');

//       this.innerHTML = `
//         <div class="d-flex align-items-center">
//           <input type="number" class="form-control form-control-sm" value="${originalValue}" style="width: 40%;"> 

//           <button class="btn btn-subtle-danger btn-sm me-1 px-1 py-0 cancel-btn" id="id_rechazar_se" data-RecursoId=${maestroId} data-ServicioId=${servicioId} data-ProveedorId=${proveedorId}>
//             <span class="uil uil-cancel"></span> Rechazar
//           </button>
//         </div>
//       `;
//       // <button class="btn btn-subtle-success btn-sm me-1 px-1 py-0 save-btn" 
//       //   <span class="uil uil-save"></span> Guardar
//       // </button>
//       const input = this.querySelector('input');
//       input.focus();
//       input.select();

//       // Guardar con Enter
//       input.addEventListener('keypress', function (e) {
//         if (e.key === 'Enter') {
//           saveValue(this, originalValue, servicioId, proveedorId, maestroId, cell);
//         }
//       });

//       // Botón Guardar
//       this.querySelector('.save-btn').addEventListener('click', function () {
//         saveValue(input, originalValue, servicioId, proveedorId, maestroId, cell);
//       });

//       // Botón Cancelar
//       this.querySelector('.cancel-btn').addEventListener('click', function () {
//         cell.innerHTML = `$${parseFloat(originalValue).toLocaleString()}`;
//       });
//     });
//   });
// }

// async function saveValue(input, originalValue, servicioId, proveedorId, maestroId, cell) {
//   const newValue = input.value;

//   if (parseFloat(newValue) === parseFloat(originalValue)) {
//     cell.innerHTML = `$${parseFloat(originalValue).toLocaleString()}`;
//     return;
//   }

//   if (!newValue || isNaN(newValue)) {
//     showToast('error', 'Error', 'Ingrese un valor numérico válido');
//     return;
//   }

//   try {
//     cell.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

//     const formData = new FormData();
//     formData.append('servicio_id', servicioId);
//     formData.append('proveedor_id', proveedorId);
//     formData.append('valor', newValue);
//     formData.append('maestro_id', maestroId);

//     const response = await fetch($('#base_url').val() + 'torrecontrol/actualizar_valor_servicio', {
//       method: "POST",
//       body: formData
//     });

//     const result = await response.json();

//     if (result.success === true) {
//       cell.innerHTML = `$${parseFloat(newValue).toLocaleString()}`;
//       cell.setAttribute('data-original-value', newValue);
//       showToast('success', 'Éxito', 'Valor actualizado correctamente');
//     } else {
//       throw new Error(result.message || 'Error al actualizar');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     cell.innerHTML = `$${parseFloat(originalValue).toLocaleString()}`;
//     showToast('error', 'Error', 'No se pudo actualizar el valor');
//   }
// }

// function showToast(type, title, message) {
//   // Implementación básica de toast notification
//   const toastHtml = `
//     <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1100">
//       <div class="toast show align-items-center text-white bg-${type}" role="alert" aria-live="assertive" aria-atomic="true">
//         <div class="d-flex">
//           <div class="toast-body">
//             <strong>${title}</strong>: ${message}
//           </div>
//           <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
//         </div>
//       </div>
//     </div>
//   `;

//   const toastContainer = document.createElement('div');
//   toastContainer.innerHTML = toastHtml;
//   document.body.appendChild(toastContainer);

//   setTimeout(() => {
//     toastContainer.remove();
//   }, 3000);
// }

// function actualizarSelectTrazabilidad(ultimoEstado) {

//   const opciones = [

//     'Fecha Estimada Entrega',
//     'Sin trazabilidad',
//     'Llegada Cargue',
//     'Cargue',
//     'Salida Cargue',
//     'Inicio Ruta',
//     'Transito',
//     'Llegada Descargue',
//     'Descargue',
//     'Salida Descargue'
//   ];

//   const select = document.getElementById('select_tipo_trazabilidad');
//   const siguienteIndex = opciones.indexOf(ultimoEstado) + 1;

//   // Limpiar el select actual
//   select.innerHTML = '<option value="" selected><i class="uil uil-angle-down"></i></option>';

//   // Agregar todas las opciones
//   opciones.forEach((opcion, index) => {
//     const option = document.createElement('option');
//     option.value = opcion;
//     option.textContent = opcion;

//     // Siempre habilitar "Fecha Estimada Entrega"
//     if (opcion === 'Fecha Estimada Entrega') {
//       option.disabled = false;
//     } else {
//       // Solo habilitar la siguiente opción en orden
//       option.disabled = index !== siguienteIndex;
//     }

//     select.appendChild(option);
//   });
// }

// $(document).on('change', '.pedido-checkbox_pr', function () {

//   let tipo = $(this).data('tipo');
//   let pedido = $(this).data('id');
//   let referencia = $(this).data('idre');

//   let checkboxes = document.querySelectorAll('input[type="checkbox"]');
//   let totalSeleccionados = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;

//   if ((consulta_tipo.some(item => item.tipo === tipo) || consulta_tipo.length === 0) && this.checked === true) {
//     consulta_tipo.push({ tipo: tipo, pedido: pedido, referencia: referencia });
//     console.log(consulta_tipo);
//   } else {

//     this.checked = false;

//     if (totalSeleccionados === 0) {
//       // Limpiar el select actual
//       consulta_tipo = [];

//     } else if (!(consulta_tipo.some(item => item.tipo === tipo))) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Tipo de trazabilidad',
//         text: 'No puedes seleccionar pedidos con diferentes trazabilidad.',
//       });
//     } else {
//       consulta_tipo = consulta_tipo.filter(item => item.pedido !== pedido);
//     }
//   }


//   let tipoSeleccionado = null;
//   const tipoActual = this.dataset.tipo;
//   if (this.checked) {
//     actualizarSelectTrazabilidad(tipo);

//     console.log(consulta_tipo);
//     if (!tipoSeleccionado) {
//       // Primer tipo seleccionado
//       tipoSeleccionado = tipoActual;
//     } else if (tipoActual !== tipoSeleccionado) {
//       alert(`Solo puedes seleccionar pedidos con tipo de trazabilidad "${tipoSeleccionado}".`);
//       this.checked = false;
//     }
//   } else {
//     // Si se desmarca y no queda ninguno seleccionado, reinicia el tipo
//     document.getElementById('select_tipo_trazabilidad').innerHTML = "";
//     const algunoMarcado = Array.from(document.querySelectorAll('.pedido-checkbox_pr'))
//       .some(cb => cb.checked);
//     if (!algunoMarcado) {
//       tipoSeleccionado = null;
//     }
//   }
// });

// // ─── Actualiza KPI cards usando los IDs del phtml rc- ────────────────────
// function rc_actualizarKpisAdmin(data) {
//   if (!Array.isArray(data)) return;
//   const c = { total: data.length, pendiente: 0, iniciado: 0, completado: 0, cancelado: 0 };
//   data.forEach(function (el) {
//     const estados = (el.estados_recurso || el.estado_recurso || '').split(',').map(function (s) { return s.trim(); });
//     if (estados.some(function (e) { return e === 'Pendiente Iniciar'; })) c.pendiente++;
//     if (estados.some(function (e) { return e === 'Iniciado'; })) c.iniciado++;
//     if (estados.some(function (e) { return e === 'Completado'; })) c.completado++;
//     if (estados.some(function (e) { return e === 'Cancelado' || e === 'Rechazado'; })) c.cancelado++;
//   });
//   const set = function (id, v) { const el = document.getElementById(id); if (el) el.textContent = v; };
//   set('rc-kpi-total', c.total);
//   set('rc-kpi-pendiente', c.pendiente);
//   set('rc-kpi-iniciado', c.iniciado);
//   set('rc-kpi-completado', c.completado);
//   set('rc-kpi-cancelado', c.cancelado);
// }

(function () {
  "use strict";

  window.VENTANA = null; // Variable global para almacenar el ID
  // Definir la función initScript globalmente
  window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global

    // Crear instancia
    // Usar una variable global o una propiedad en el objeto window
    if (!window.myOffcanvas) {
      window.myOffcanvas = new DynamicOffcanvas({
        id: `customOffcanvas${window.VENTANA}`,
        title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
        content: '<p>Contenido inicial</p>',
        scroll: true,
        backdrop: false,
      });
    } else {
      console.log('El offcanvas ya está creado.');
    }

    const hoy = new Date();
    const opciones = { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' };

    // Formatear la fecha a "YYYY-MM-DD"
    const fechaColombia = new Intl.DateTimeFormat('es-CO', opciones).format(hoy).split('/').reverse().join('-');

    listar_recursos_administrador(fechaColombia, fechaColombia);

    document.addEventListener('click', async (e) => {
      if (e.target.matches('#rc-btn-buscar') || e.target.matches('#rc-btn-buscar *')) {
        let fechaInicio = document.getElementById('rc-fecha-inicial').value.trim();
        let fechaFinal = document.getElementById('rc-fecha-final').value.trim();
        listar_recursos_administrador(fechaInicio, fechaFinal);
      }

      if (e.target.matches('#btn_detalle_proceso_servicio') || e.target.matches('#btn_detalle_proceso_servicio *')) {
        let Enlace = e.target.closest('#btn_detalle_proceso_servicio');
        let MaestroId = Enlace.getAttribute('data-id');
        let ClienteId = Enlace.getAttribute('data-clienteId');
        let Proceso = Enlace.getAttribute('data-proceso');
        let MotivoCancelacion = Enlace.getAttribute('data-motivo_cancelacion');

        myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Detalle de solicitud de servicio N°` + MaestroId);
        myOffcanvas.updateContent(`
          <div class="col-12">
            <div class="row">
              <div class="container d-flex justify-content-center align-items-center">
                <div class="row text-black fw-bold text-center d-flex flex-wrap">
                  <div class="col-auto mx-3 h6">Peso Neto total: <span class="badge badge-phoenix badge-phoenix-primary" id="pesoNeto">0</span></div>
                  <div class="col-auto mx-3 h6">Peso Bruto total: <span class="badge badge-phoenix badge-phoenix-primary" id="pesoBruto">0</span></div>
                  <div class="col-auto mx-3 h6">Total Unidades: <span class="badge badge-phoenix badge-phoenix-primary" id="totalUnidades">0</span></div>
                </div>
              </div>
              <hr class="my-1 text-dark">
              <h6 class="mb-0 text-body-highlight me-2">Pedidos</h6>
              <hr class="my-1 text-dark">
              <div class="table-responsive scrollbar">
                <table class="table table-sm text-center" style="font-size: 12px;">
                  <thead>
                    <tr>
                      <th scope="col" scope="col" style='width: auto; white-space: nowrap;'>#</th>
                       <!--<th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Recurso</th>-->
                      <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Ref.Pedido</th>
                      <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Cod.Producto</th>
                      <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Producto</th>
                      <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Peso Bruto</th>
                      <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Empaque</th>
                      <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Cantidad</th>
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>No. Estibas</th>
                      <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Origen</th>
                      <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Destino</th>
                      <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Fecha Cargue</th>
                      <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Fecha Descargue</th>
                      <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Remitente</th>
                      <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Destinatario</th>
                      <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Trazabilidad</th>
                      <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Estado</th>
                    </tr>
                  </thead>
                  <tbody id="tbody_servicios_pedidos_recurso" class="text-center">
                    <tr>
                      <td colspan="12" class="text-center">Cargando servicios...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <hr class="my-1 text-dark">
                <div class="d-flex align-items-center justify-content-between">
                 <h6 class="mb-0 me-2 d-flex align-items-center justify-content-center">Servicios Especiales</h6>
               </div>
            <hr class="my-1 text-dark">

            <!-- Este es el contenedor de los tabs (debe estar en tu HTML) -->
            <ul class="nav nav-underline fs-9" id="cabecera_proveedores_servicios_especiales" role="tablist">
              <!-- Los tabs se generarán dinámicamente aquí -->
            </ul>

            <div id="detalle_proveedores_servicios_especiales"></div>
              <div class="accordion mt-0" id="accordionExample2">
              <div class="accordion-item border-top"><h6 class="mb-0 me-2 d-flex align-items-center justify-content-left">Agregar Servicios Especiales</h6>
                    <h2 class="accordion-header" id="ServicioAdicional">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#TipoServicio_" aria-expanded="false" aria-controls="TipoServicio_">
                       </button>
                    </h2>
                    <div class="accordion-collapse collapse" id="TipoServicio_" aria-labelledby="TipoServicio" data-bs-parent="#accordionExample" style="">
                      <div class="accordion-body pt-0" id="contenido">
                       <div class="row">
                          <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6"
                            id="contenido_servicio_especial_list_" style="display:block;">
                            <div class="mb-0">
                              <label class="form-label">(*) Tipo de Vehiculo:</label>
                              <select class="form-select form-select-sm fs-9" id="list_servicio_especial2"
                                name="list_servicio_especial_[]" multiple="multiple" style="width: 100%;font-size: 10px;">
                              </select>
                            </div>
                          </div>

                          <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6"
                            id="ls_servicio_especial_list_" style="display:block;">
                            <div class="mb-0">
                              <label class="form-label"></label>
                               
                            </div>
                          </div>
                      </div>

                          <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6"
                            id="ls_servicio_especial_list_" style="display:block;">
                            <div class="mb-0">
                              <label class="form-label"></label>
                                <button class="btn btn-success btn-sm py-1" id="btn_guardar_se" type="button" style="display: block;" data-maestroId="${MaestroId}"> 
                                  <span class="uil uil-play-circle"></span> Guardar Servicios
                                </button>
                            </div>
                          </div>
                    </div>
              </div>
             </div>

            <hr class="my-1 text-dark">
                <div class="d-flex align-items-center justify-content-between">
                 <h6 class="mb-0 me-2 d-flex align-items-center justify-content-center">Observaciones</h6>
               </div>
            <hr class="my-1 text-dark">
            <textarea class="form-control form-control-sn observacion_opcion" disabled id="observacion_recurso" rows="1" placeholder="Observaciones" oninput="this.value = this.value.toUpperCase();"></textarea>

            <div class="accordion" id="accordionExample"></div>

            <hr class="my-1 text-dark">
               <div class="d-flex align-items-center justify-content-between">
                <h6 class="mb-0 me-2 d-flex align-items-center justify-content-center">Subasta</h6>
                  <div class="col-5">
                    <div class="row justify-content-end">
                      <div class="col-auto">
                        <select class="form-select form-select-sm" aria-label=".form-select-sm example" id="slct_criterio" name="slct_criterio" style="width: 100%;display: none;">
                          <option selected="" value="">Seleccione Criterio</option>
                          <option value="Fecha_inicio_servicio">Fecha Inicio de servicio</option>
                          <option value="Valor_servicio">Valor de servicio</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="col-5">
                    <div class="row justify-content-end">
                      <div class="col-auto">
                        <button class="btn btn-danger btn-sm py-1" id="btn_cancelar_recurso" type="button"> 
                          <span class="uil uil-x"></span> Rechazar Servicios
                        </button>
                        <button class="btn btn-success btn-sm py-1" id="btn_subastar_recurso" type="button" style="display: none;"> 
                          <span class="uil uil-play-circle"></span> Subastar Servicios
                        </button>
                        <button class="btn btn-success btn-sm py-1" id="btn_asignar_recurso" type="button" style="display: none;"> 
                          <span class="uil uil-play-circle"></span> Asignar Servicios
                        </button>
                      </div>
                    </div>
                  </div>
               </div>
            <hr class="my-1 text-dark">

          <h5>RESULTADOS DE LA SUBASTA</h5>

            <table class="table table-sm" style="font-size:10px;">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">SERVICIO</th>
                    <th scope="col">VALOR SERVICIO</th>
                    <th scope="col">PROVEEDOR</th>
                    <th scope="col">CEDULA CONDUCTOR</th>
                    <th scope="col">NOMBRE CONDUCTOR</th>
                    <th scope="col">PLACA</th>
                    <th scope="col">FECHA REGISTRO</th>
                    <th scope="col">FECHA INICIO</th>
                    <th scope="col">ACCION</th>
                  </tr>
                </thead>
                <tbody id="tbody_subasta_resultados"></tbody>
              </table>

              <hr class="my-1 text-dark">
                <h6>Editar datos del servicio</h6>
              <hr class="my-1 text-dark">
              <div class="row mt-2" id="bloque_datos_servicio" style="display: none;">
                  <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                    <div class="mb-1">
                      <label class="form-label" for="valor_servicio">Valor Servicio</label>
                      <input type="text" name="valor_servicio" id="valor_servicio" class="form-control form-control-sm">
                    </div>
                  </div>
                  <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                    <div class="mb-1">
                      <label class="form-label" for="cedula_conductor">Cedula Conductor</label>
                      <input type="text" name="cedula_conductor" id="cedula_conductor" class="form-control form-control-sm">
                    </div>
                  </div>
                  <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                    <div class="mb-1">
                      <label class="form-label" for="nombre_conductor">Nombre Conductor</label>
                      <input type="text" name="nombre_conductor" id="nombre_conductor" class="form-control form-control-sm">
                    </div>
                  </div>
                  <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                    <div class="mb-1">
                      <label class="form-label" for="placa">Placa</label>
                      <input type="text" name="placa" id="placa" class="form-control form-control-sm">
                    </div>
                  </div>
              </div>

              <div class="row mt-2" id="bloque_carga_liquida" style="display: none;">
                  <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                    <div class="mb-1">
                      <label class="form-label" for="capacidad_vehiculo">Capacidad Vehículo</label>
                      <input type="text" name="capacidad_vehiculo" id="capacidad_vehiculo" class="form-control form-control-sm">
                    </div>
                  </div>
                  <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                    <div class="mb-1">
                      <label class="form-label" for="tiempo_libre">Tiempo Libre</label>
                      <input type="text" name="tiempo_libre" id="tiempo_libre" class="form-control form-control-sm">
                    </div>
                  </div>
                  <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                    <div class="mb-1">
                      <label class="form-label" for="stand_bay">Stand By</label>
                      <input type="text" name="stand_bay" id="stand_bay" class="form-control form-control-sm">
                    </div>
                  </div>
                  <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                    <div class="mb-1">
                      <label class="form-label" for="cumplimiento">Cumplimiento</label>
                      <!--<input type="text" name="cumplimiento" id="cumplimiento" class="form-control form-control-sm">-->
                        <select name="cumplimiento" id="cumplimiento" class="form-select form-select-sm">
                          <option value="" selected>Selecciones</option>
                          <option value="CUMPLE">CUMPLE</option>
                          <option value="NO CUMPLE">NO CUMPLE</option>
                        </select>
                    </div>
                  </div>
                  <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                    <div class="mb-1">
                      <label class="form-label" for="contenedor">Contenedor</label>
                      <input type="text" name="contenedor" id="contenedor" class="form-control form-control-sm">
                    </div>
                  </div>
                  <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                    <div class="mb-1">
                      <label class="form-label" for="tara">Tara</label>
                      <input type="text" name="tara" id="tara" class="form-control form-control-sm">
                    </div>
                  </div>
              </div>
              <div class="row mt-2" style="display: none;" id="btn_acciones_edit_datos">
                  <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex justify-content-end my-2">
                    <div class="btn-group btn-group-sm" role="group" aria-label="...">
                      <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1" style="margin-right:5px;" id="btn_cancelar_edit_datos"><i class="fas fa-times"></i> Cancelar</button>
                      <button type="button" class="btn btn-success btn-sm me-1 px-1 py-1" id="btn_guardar_edit_datos" data-MaestroId="${MaestroId}"><i class="far fa-save"></i> Guardar</button>
                    </div>
                  </div>
              </div>

            <hr class="my-1 text-dark mt-3">
              <h6>Motivo Cancelación</h6>
            <hr class="my-1 text-dark">
                ${MotivoCancelacion}
          </div>
      `);

        traer_servicio_especial();
        Listar_pedidos_recursos(MaestroId, window.VENTANA, Proceso, ClienteId);
        myOffcanvas.updateClass('offcanvas-end');
        myOffcanvas.updateHeight('100vh');
        myOffcanvas.updateWidth('70%');
        myOffcanvas.show();
      }

      if (e.target.matches('#btn_proceso_servicios_recurso') || e.target.matches('#btn_proceso_servicios_recurso *')) {
        let recurso = e.target.getAttribute('data-recurso');
        let numdoc = e.target.getAttribute('data-numdoc_solicitud');

        let filaProveedores = document.getElementById(`Recurso_proveedores_${numdoc}`);

        if (!filaProveedores) {
          console.error(`No se encontró el <tr> con id #Recurso_proveedores_${numdoc}`);
          return;
        }

        // Mostrar u ocultar la fila de servicios
        if (filaProveedores.style.display === 'none') {
          filaProveedores.style.display = 'table-row';

          // Obtener servicios si aún no se han cargado
          if (filaProveedores.querySelector('.lista-proceso-proveedores').innerHTML.trim() === '') {
            try {
              let formData = new FormData();
              formData.append('MaestroId', recurso);
              // formData.append("numdoc", numdoc);

              // let response = await fetch($('#base_url').val() + 'torrecontrol/listar_detalle_proveedores_servicio', {
              let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_servicios_pedidos_recursos', {
                method: 'POST',
                body: formData,
              });
              let data = await response.json();
              if (data) {
                let serviciosHTML = ' <div class="accordion" id="accordionExample">';
                data.forEach((proveedor) => {
                  serviciosHTML += `
                  <div class="accordion-item border-top">
                    <h2 class="accordion-header" id="TipoServicio${proveedor.tipo_servicio}">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#TipoServicio_${proveedor.servicio_id}" aria-expanded="false" aria-controls="TipoServicio_${proveedor.servicio_id}">
                        ${proveedor.tipo_servicio}
                      </button>
                    </h2>
                    <div class="accordion-collapse collapse" id="TipoServicio_${proveedor.servicio_id}" aria-labelledby="TipoServicio${proveedor.tipo_servicio}" data-bs-parent="#accordionExample" style="">
                      <div class="accordion-body pt-0" id="contenido${proveedor.servicio_id}"></div>
                    </div>
                  </div>
                `;
                });
                serviciosHTML += '</div>';
                filaProveedores.querySelector('.lista-proceso-proveedores').innerHTML = serviciosHTML;
              } else {
                filaProveedores.querySelector('.lista-proceso-proveedores').innerHTML = `<p class="text-danger">${data.message}</p>`;
              }
            } catch (error) {
              console.error('Error al obtener servicios:', error);
              filaProveedores.querySelector(
                '.lista-proceso-proveedores'
              ).innerHTML = `<p class="text-danger">Error al cargar proveedores</p>`;
            } finally {
            }
          }
        }
      }

      if (e.target.matches('#btn_gestion_pedido') || e.target.matches('#btn_gestion_pedido *')) {
        let MaestroId = e.target.getAttribute('data-id');
        //offcanvas-bottom
        myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Gestion Pedido N°` + MaestroId);
        myOffcanvas.updateContent(`

        <!-- HEADER INFO -->
        <!--<div class="card shadow-sm mb-4">
            <div class="card-body py-3">
                <div class="row text-center text-md-start align-items-center">

                    <div class="col-md-2 mb-2 mb-md-0">
                        <small class="text-muted d-block">Tipo de servicio</small>
                        <span class="fw-semibold" id="tipo_servicio_header"></span>
                    </div>

                    <div class="col-md-2 mb-2 mb-md-0">
                        <small class="text-muted d-block">Vehículo</small>
                        <span class="fw-semibold text-secondary" id="vehiculo_header"></span>
                    </div>

                    <div class="col-md-2 mb-2 mb-md-0">
                        <small class="text-muted d-block">Estado</small>
                        <span id="estado_header"></span>
                    </div>

                    <div class="col-md-3 mb-2 mb-md-0">
                        <small class="text-muted d-block">Fecha de registro</small>
                        <span class="fw-semibold" id="fecha_registro_header"></span>
                    </div>

                    <div class="col-md-3">
                        <small class="text-muted d-block">Fecha límite</small>
                        <span class="fw-semibold text-danger" id="fecha_limite_header"></span>
                    </div>

                </div>
            </div>
        </div>-->

        <div class="card shadow-sm mb-4">
            <div class="card-body py-3">
                <div class="row text-center text-md-start align-items-center">

                    <div class="col-md-2 mb-2 mb-md-0">
                        <small class="text-muted d-block">Tipo de servicio</small>
                        <span class="fw-semibold" id="tipo_servicio_header"></span>
                    </div>

                    <div class="col-md-2 mb-2 mb-md-0">
                        <small class="text-muted d-block">Vehículo</small>
                        <span class="fw-semibold text-secondary" id="vehiculo_header"></span>
                    </div>

                    <div class="col-md-2 mb-2 mb-md-0">
                        <small class="text-muted d-block">Estado</small>
                        <span id="estado_header"></span>
                    </div>

                    <div class="col-md-3 mb-2 mb-md-0">
                        <small class="text-muted d-block">Fecha de registro</small>
                        <span class="fw-semibold" id="fecha_registro_header"></span>
                    </div>

                    <div class="col-md-3">
                        <small class="text-muted d-block">Fecha límite</small>
                        <span class="fw-semibold text-danger" id="fecha_limite_header"></span>
                    </div>

                    <div class="row mb-3">
                        <div class="col-2">
                            <small class="text-muted">Cedula:  <span class="fw-semibold" id="cedula_header"></span> </small>
                        </div>
                        <div class="col-2">
                            <small class="text-muted">Conductor:  <span class="fw-semibold" id="conductor_header"></span></small>
                        </div>
                        <div class="col-2">
                            <small class="text-muted"><span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label" id="placa_header"></span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span></small>
                        </div>
                        <div class="col-3">
                            <small class="text-muted">Inicio de servicio: <span class="fw-semibold text-success" id="inicio_servicio_header"></span></small>
                        </div>
                    </div>
                    <hr class="my-1 text-dark">

                </div>
            </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <h4 class="text-center" style="font-weight: bold;">Progreso del Pedido</h4>
          <div class="progress" style="height:15px">
            <div class="progress-bar progress-bar-striped active rounded-3" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;width: 0;" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top"></div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-4" id="tabla_gestion_actividades">
          <h4 class="text-center" style="font-weight: bold;">Listado de actividades</h4>
          <div class="bs-example" data-example-id="simple-table">
            <table class="table table-sm" style="font-size:12px;">
              <thead class='table-bordered'>
                <tr>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>#</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Parametro</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Actividad</th>
                  <!--<th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Costo</th>-->
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Responsable</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Criterio</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Fecha Base</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Vencimiento</th>
                  <!--<th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Tiempo Vencimiento</th>-->
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Tiempo Parametrizado</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Estado</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Acción</th>
                </tr>
              </thead>
              <tbody id="tbody_actividades"></tbody>
            </table>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="gestion_pedido"></div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div id="detalle_gestion"></div>
        </div>
      `);

        // Listar_actividades_pedido(MaestroId);
        // Espera a que el DOM se actualice antes de cargar los datos
        setTimeout(() => {
          Listar_actividades_pedido(MaestroId);
        }, 50);

        myOffcanvas.updateHeight('100vh');
        myOffcanvas.updateWidth('100%');
        // myOffcanvas.updateClass('offcanvas-bottom');
        myOffcanvas.show();
      }

      // Detalle de gestion vista
      if (e.target.matches('#btn_detalle_gestion') || e.target.matches('#btn_detalle_gestion *')) {
        document.getElementById('btn_cerrar_gestion').style.display = 'block';
        document.getElementById('btn_detalle_gestion').style.display = 'none';
        document.getElementById('btn_agregar_solicitud').style.display = 'none';
        document.getElementById('acordeones_parametros').style.display = 'none';
        document.getElementById('gestion_pedido').style.display = 'none';
        document.getElementById('tabla_gestion_actividades').style.display = 'none';
        document.getElementById('btn_editar_pedido').style.display = 'block';
        // document.getElementById("btn_inicio_gestion").style.display = "block";
        // Detalles_gestion_vista(nundoc);
      }

      if (e.target.matches('#btn_cerrar_gestion') || e.target.matches('#btn_cerrar_gestion *')) {
        // alert("hola");
        document.getElementById('btn_cerrar_gestion').style.display = 'none';
        document.getElementById('btn_detalle_gestion').style.display = 'block';
        document.getElementById('btn_agregar_solicitud').style.display = 'block';
        document.getElementById('acordeones_parametros').style.display = 'block';
        document.getElementById('tabla_gestion_actividades').style.display = 'block';
        document.getElementById('btn_editar_pedido').style.display = 'block';
        // document.getElementById("btn_inicio_gestion").style.display = "block";
        var contenido = document.getElementById('detalle_gestion');
        contenido.innerHTML = ''; // Elimina el contenido
      }

      let Boton_cancelar;
      let Boton_guardar_gestion;
      let Select_Estado_Actividad = '';
      if (e.target.matches('#btn_gestion_actividad') || e.target.matches('#btn_gestion_actividad *')) {
        var padre = e.target.parentElement.parentElement;
        var Procesos = padre.querySelector('#btn_gestion_actividad');
        var proceso_id = Procesos.getAttribute('data-idproceso');
        var actividad_id = Procesos.getAttribute('data-idactividad');
        // console.log("Proceso: " + proceso_id + " Actividad: " + actividad_id);
        var form_gestio = document.getElementById(`proceso_numero${actividad_id}`);
        var numero_proceso = form_gestio.getAttribute('data-idnum_proceso');
        // console.log("Numero de proceso del formulario: " + numero_proceso);
        Boton_cancelar = document.getElementById(`btn_cancelar_gestion${actividad_id}`);
        Boton_guardar_gestion = document.getElementById(`btn_guardar_gestion${actividad_id}`);
        // Boton_detalle_actividad = document.getElementById(`btn_guardar_gestion${actividad_id}`);
        Select_Estado_Actividad = document.getElementById(`estado_actividad${actividad_id}`);
        Select_Estado_Actividad.addEventListener('change', async (e) => {
          if (Select_Estado_Actividad.value === 'COMPLETADO') {
            document.getElementById(`costo_ejecutado${actividad_id}`).disabled = false;
            document.getElementById(`costo_ejecutado${actividad_id}`).value = '';
          } else {
            document.getElementById(`costo_ejecutado${actividad_id}`).disabled = true;
            document.getElementById(`costo_ejecutado${actividad_id}`).value = '';
          }
        });

        if (actividad_id === numero_proceso) {
          document.getElementById(`columnaproceso${numero_proceso}`).style.display =
            document.getElementById(`columnaproceso${numero_proceso}`).style.display === 'none' ? 'table-row' : 'none';
          Boton_cancelar.addEventListener('click', async (e) => {
            document.getElementById(`columnaproceso${numero_proceso}`).style.display = 'none';
          });
          Boton_guardar_gestion.addEventListener('click', async (e) => {
            let PedidoId = Boton_guardar_gestion.getAttribute('data-PedidoId');
            let MaestroId = Boton_guardar_gestion.getAttribute('data-MaestroId');

            if (document.getElementById('estado_actividad' + actividad_id).value === '') {
              mensaje = `
            <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
              <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                <strong>Mensaje!</strong> <p class="mb-0 flex-1"> Debe seleccionar un estado para este pedido</p>
              <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `;
              document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
            } else if (document.getElementById('observacion_gestion' + actividad_id).value === '') {
              mensaje = `
            <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
              <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                <strong>Mensaje!</strong> <p class="mb-0 flex-1"> Debe diligenciar una obsrvación  para poder gaurdar la gestión</p>
              <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
              document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
              document.getElementById('observacion_gestion' + actividad_id).focus();
            } else {
              const result = await Swal.fire({
                title: 'Seguro',
                text: '¿Desea realizar la operación de gestión?',
                icon: 'question',
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
                let data = new FormData();
                data.append('nundoc', PedidoId);
                data.append('parametros_pedido', document.getElementById('parametros_pedido' + actividad_id).value);
                data.append(
                  'parametros_punto_pedido_opcion',
                  document.getElementById('parametros_punto_pedido_opcion' + actividad_id).value
                );
                data.append('observacion', document.getElementById('observacion_gestion' + actividad_id).value);
                data.append('estado_actividad', document.getElementById('estado_actividad' + actividad_id).value);
                data.append('costo_ejecutado', document.getElementById('costo_ejecutado' + actividad_id).value);
                var documentos = document.getElementById('documento' + actividad_id).files[0];
                if (documentos !== undefined) {
                  data.append('documento', documentos);
                } else {
                  data.append('documento', 'Sin_evidencia');
                }
                // data.append("documento", document.getElementById("documento").files[0]);
                // var publicar = document.getElementById('publicar' + actividad_id);
                // if (publicar.checked) {
                //   data.append('publicar', 'SI');
                // } else {
                //   data.append('publicar', 'NO');
                // }
                data.append('publicar', 'NO');
                await fetch($('#base_url').val() + 'torrecontrol/Insertar_gestion_pedido', {
                  method: 'POST',
                  body: data,
                  cache: 'no-cache',
                })
                  .then((res) => (res.ok ? res.json() : Promise.reject(res)))
                  .catch((error) => {
                    alert(JSON.stringify(error.length) || 'Error al cargar las solicitudes');
                  })
                  .then((response) => {
                    if (response.numero === 200) {
                      mensaje = `
                    <div class="alert alert-outline-success d-flex align-items-center" role="alert">
                      <span class="fas fa-check-circle text-success fs-5 me-3"></span>
                      <strong>Mensaje!</strong> <p class="mb-0 flex-1">${response.mensaje}</p>
                      <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
                      // Numero_actividades(PedidoId);
                    } else {
                      mensaje = `
                      <div class="alert alert-outline-danger d-flex align-items-center" role="alert">
                        <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                          <strong>Mensaje!</strong> <p class="mb-0 flex-1">${response.mensaje}</p>
                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                      </div>`;
                    }
                    setTimeout(function () {
                      // location.reload(false);
                      Listar_actividades_pedido(MaestroId);
                      // Numero_actividades(PedidoId);
                      document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
                    }, 1500);
                  });
              }
            }
          });
        }
      }

      let Boton_cerrar_detalle;
      if (e.target.matches('#btn_detalle_actividad') || e.target.matches('#btn_detalle_actividad *')) {
        var padre = e.target.parentElement.parentElement;
        var Procesos = padre.querySelector('#btn_detalle_actividad');
        var proceso_id = Procesos.getAttribute('data-idproceso');
        var actividad_id = Procesos.getAttribute('data-idactividad');
        var PedidoId = Procesos.getAttribute('data-PedidoId');
        // console.log("Proceso: " + proceso_id + " Actividad: " + actividad_id);
        var form_gestio = document.getElementById(`detalle_actividad_numero${actividad_id}`);
        var numero_proceso = form_gestio.getAttribute('data-idnum_proceso');
        Boton_cerrar_detalle = document.getElementById(`btn_cerrar_detalle${actividad_id}`);
        if (actividad_id === numero_proceso) {
          document.getElementById(`columnadetalleactividad${numero_proceso}`).style.display =
            document.getElementById(`columnadetalleactividad${numero_proceso}`).style.display === 'none' ? 'table-row' : 'none';
          setTimeout(() => {
            Detalles_actividaes(PedidoId, actividad_id);
          }, 50);
          // Boton_cerrar_detalle.addEventListener('click', async e => {
          //   document.getElementById(`columnadetalleactividad${numero_proceso}`).style.display = 'none';
          // });
        }
      }

      if (e.target.matches('#btn_cancelar_asignacion') || e.target.matches('#btn_cancelar_asignacion *')) {
        let boton = e.target.closest('#btn_cancelar_asignacion'); // Capturamos el botón real
        let RecursoId = boton.getAttribute('data-id');

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
            formData.append('RecursoId', RecursoId);

            let response = await fetch($('#base_url').val() + 'torrecontrol/cancelar_asignacion_recurso', {
              method: 'POST',
              body: formData,
            });

            let data = await response.json();

            if (data && data.success === true) {
              await Swal.fire({
                title: 'Recurso Cancelado',
                text: data.message || 'El recurso fue cancelado exitosamente.',
                icon: 'success',
                confirmButtonColor: '#3B71CA',
                customClass: {
                  popup: 'swal2-custom-font',
                },
              });

              // Si quieres actualizar la tabla o hacer otra acción después del éxito
              // actualizarTabla();  <-- ejemplo
              let fecha_inicial = document.getElementById('rc-fecha-inicial')?.value ?? '';
              let fecha_final = document.getElementById('rc-fecha-final')?.value ?? '';
              listar_recursos_administrador(fecha_inicial, fecha_final);
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

      if (e.target.matches(`#btn_cancelar_servicio_especial`) || e.target.matches(`#btn_cancelar_servicio_especial *`)) {
        let boton = e.target.closest('#btn_cancelar_servicio_especial'); // Capturamos el botón real
        let RecursoId = boton.getAttribute('data-maestroid');
        // console.log(RecursoId);
        let ServicioId = boton.getAttribute('data-servicio');
        let ProveedorId = boton.getAttribute('data-proveedorid');
        const result = await Swal.fire({
          title: 'Seguro',
          text: '¿Desea cancelar el servicio especial?',
          icon: 'question',
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
          let dato = new FormData();
          dato.append('RecursoId', RecursoId);
          dato.append('ServicioId', ServicioId);
          dato.append('ProveedorId', ProveedorId);
          try {
            const response = await fetch($('#base_url').val() + 'torrecontrol/cancelar_servicio_espacial', {
              method: 'POST',
              body: dato,
              cache: 'no-cache',
            });
            const data = await response.json();
            Swal.fire({
              title: 'Mensaje!',
              text: data.message,
              icon: data.success ? 'success' : 'error',
              draggable: true,
            }).then((result) => {
              if (result.isConfirmed) {
                Listar_servicios_especiales_proveedor(ProveedorId, RecursoId);
              }
            });
          } catch (error) { }
        }
      }

      if (e.target.matches(`#btn_rechazar_servicio_especial`) || e.target.matches(`#btn_rechazar_servicio_especial *`)) {
        let boton = e.target.closest('#btn_rechazar_servicio_especial'); // Capturamos el botón real
        let RecursoId = boton.getAttribute('data-maestroid');
        // console.log(RecursoId);
        let ServicioId = boton.getAttribute('data-servicio');
        let ProveedorId = boton.getAttribute('data-proveedorid');
        const result = await Swal.fire({
          title: 'Seguro',
          text: '¿Desea rechazar el servicio especial?',
          icon: 'question',
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
          let dato = new FormData();
          dato.append('RecursoId', RecursoId);
          dato.append('ServicioId', ServicioId);
          dato.append('ProveedorId', ProveedorId);
          try {
            const response = await fetch($('#base_url').val() + 'torrecontrol/rechazar_servicio_espacial', {
              method: 'POST',
              body: dato,
              cache: 'no-cache',
            });
            const data = await response.json();
            Swal.fire({
              title: 'Mensaje!',
              text: data.message,
              icon: data.success ? 'success' : 'error',
              draggable: true,
            }).then((result) => {
              if (result.isConfirmed) {
                Listar_servicios_especiales_proveedor(ProveedorId, RecursoId);
              }
            });
          } catch (error) { }
        }
      }

      if (e.target.matches(`#btn_aprobar_servicio_especial`) || e.target.matches(`#btn_aprobar_servicio_especial *`)) {
        let boton = e.target.closest('#btn_aprobar_servicio_especial'); // Capturamos el botón real
        let RecursoId = boton.getAttribute('data-maestroid');
        // console.log(RecursoId);
        let ServicioId = boton.getAttribute('data-servicio');
        let ProveedorId = boton.getAttribute('data-proveedorid');
        const result = await Swal.fire({
          title: 'Seguro',
          text: '¿Desea aprobar el servicio especial?',
          icon: 'question',
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
          let dato = new FormData();
          dato.append('RecursoId', RecursoId);
          dato.append('ServicioId', ServicioId);
          dato.append('ProveedorId', ProveedorId);
          try {
            const response = await fetch($('#base_url').val() + 'torrecontrol/aprobar_servicio_espacial', {
              method: 'POST',
              body: dato,
              cache: 'no-cache',
            });
            const data = await response.json();
            Swal.fire({
              title: 'Mensaje!',
              text: data.message,
              icon: data.success ? 'success' : 'error',
              draggable: true,
            }).then((result) => {
              if (result.isConfirmed) {
                Listar_servicios_especiales_proveedor(ProveedorId, RecursoId);
              }
            });
          } catch (error) { }
        }
      }

      if (e.target.matches(`#btn_guardar_se`) || e.target.matches(`#btn_guardar_se *`)) {
        let boton = e.target.closest('#btn_guardar_se'); // Capturamos el botón real
        let RecursoId = boton.getAttribute('data-maestroid');
        let ProveedorId = boton.getAttribute('data-proveedorid');
        let ServicioId = boton.getAttribute('data-serviciosid');
        let PedidoId = boton.getAttribute('data-solicitudesId');
        let ServicioEspId = Array.from(document.getElementById(`list_servicio_especial2`).selectedOptions).map((option) => option.value);
        let datos = new FormData();

        console.log(datos);

        const result = await Swal.fire({
          title: 'Seguro',
          text: '¿Desea guardar los servicios especiales?',
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
          const btn = document.querySelector('#btn_guardar_se');
          btn.disabled = true;
          btn.innerHTML = 'Creando Servicios... ⏳';
          datos.append('RecursoId', RecursoId);
          datos.append('ArrayProveedorId', JSON.stringify(ProveedorId));
          datos.append('ArrayServicioId', JSON.stringify(ServicioId));
          datos.append('ArrayPedidoId', JSON.stringify(PedidoId));
          datos.append('ArrayServicioEspId', JSON.stringify(ServicioEspId));
          console.log(datos);

          try {
            const response = await fetch($('#base_url').val() + 'torrecontrol/agregar_servicios_especiales', {
              method: 'POST',
              body: datos,
              cache: 'no-cache',
            });

            const data = await response.json();

            Swal.fire({
              title: 'Mensaje!',
              text: data.message,
              icon: data.status ? 'success' : 'error',
              draggable: true,
            }).then((result) => {
              if (result.isConfirmed) {
                myOffcanvas.hide();
                sessionStorage.clear();
              }
            });
          } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Error al enviar datos al servidor.', 'error');
          } finally {
            btn.disabled = false;
            btn.innerHTML = "<span class='uil uil-save'></span> Guardar Asignación";
          }
        }
      }

      //Editar Datos del pedidos ganador
      if (e.target.matches(`#btn_edit_datos`) || e.target.matches(`#btn_edit_datos *`)) {
        let boton = e.target.closest('#btn_edit_datos'); // Capturamos el botón real
        let RecursoId = boton.getAttribute('data-RecursoId');
        // console.log("🚀 ~ document.addEventListener ~ RecursoId:", RecursoId);
        document.getElementById('btn_acciones_edit_datos').style.display = '';
        document.getElementById('bloque_carga_liquida').style.display = '';
        document.getElementById('bloque_datos_servicio').style.display = '';
        try {
          const formdata = new FormData();
          formdata.append('RecursoId', RecursoId);

          const response = await fetch($('#base_url').val() + 'torrecontrol/editar_datos_recurso', {
            method: 'POST',
            body: formdata,
            cache: 'no-cache',
          });
          const data = await response.json();
          if (data) {
            // Mostrar los datos en un modal o formulario
            document.getElementById('valor_servicio').value = data.valor_servicio;
            document.getElementById('cedula_conductor').value = data.cedula_conductor;
            document.getElementById('nombre_conductor').value = data.nombre_conductor;
            document.getElementById('placa').value = data.referencia;
            document.getElementById('capacidad_vehiculo').value = data.capacidad;
            document.getElementById('tiempo_libre').value = data.tiempo_libre;
            document.getElementById('stand_bay').value = data.stand_bay;
            document.getElementById('cumplimiento').value = data.cumplimiento;
            document.getElementById('contenedor').value = data.contenedor;
            document.getElementById('tara').value = data.tara;
          }
        } catch (error) {
          console.error('Error al editar datos del pedido:', error);
          await Swal.fire({
            title: 'Error inesperado',
            text: 'Ocurrió un error al intentar editar los datos del pedido.',
            icon: 'error',
            confirmButtonColor: '#3B71CA',
            customClass: {
              popup: 'swal2-custom-font',
            },
          });
        }
      }

      // Cancelar edición de datos del recurso
      if (e.target.matches('#btn_cancelar_edit_datos') || e.target.matches('#btn_cancelar_edit_datos *')) {
        document.getElementById('btn_acciones_edit_datos').style.display = 'none';
        document.getElementById('bloque_carga_liquida').style.display = 'none';
        document.getElementById('bloque_datos_servicio').style.display = 'none';
        document.getElementById('valor_servicio').value = '';
        document.getElementById('cedula_conductor').value = '';
        document.getElementById('nombre_conductor').value = '';
        document.getElementById('placa').value = '';
        document.getElementById('capacidad_vehiculo').value = '';
        document.getElementById('tiempo_libre').value = '';
        document.getElementById('stand_bay').value = '';
        document.getElementById('cumplimiento').value = '';
        document.getElementById('contenedor').value = '';
        document.getElementById('tara').value = '';
        // Cerrar el offcanvas
        // myOffcanvas.hide();
        // Actualizar la lista de recursos
        // let fecha_inicial = document.getElementById('rc-fecha-inicial')?.value ?? '';
        // let fecha_final = document.getElementById('rc-fecha-final')?.value ?? '';
        // listar_recursos_administrador(fecha_inicial, fecha_final);
      }

      if (e.target.matches('#btn_guardar_edit_datos') || e.target.matches('#btn_guardar_edit_datos *')) {
        let boton = e.target.closest('#btn_guardar_edit_datos'); // Capturamos el botón real
        let MaestroId = boton.getAttribute('data-MaestroId');

        try {
          const formdata = new FormData();
          formdata.append('MaestroId', MaestroId);
          formdata.append('valor_servicio', document.getElementById('valor_servicio').value);
          formdata.append('cedula_conductor', document.getElementById('cedula_conductor').value);
          formdata.append('nombre_conductor', document.getElementById('nombre_conductor').value);
          formdata.append('placa', document.getElementById('placa').value);
          formdata.append('capacidad_vehiculo', document.getElementById('capacidad_vehiculo').value);
          formdata.append('tiempo_libre', document.getElementById('tiempo_libre').value);
          formdata.append('stand_bay', document.getElementById('stand_bay').value);
          formdata.append('cumplimiento', document.getElementById('cumplimiento').value);
          formdata.append('contenedor', document.getElementById('contenedor').value);
          formdata.append('tara', document.getElementById('tara').value);

          const response = await fetch($('#base_url').val() + 'torrecontrol/guardar_editar_datos_recurso', {
            method: 'POST',
            body: formdata,
            cache: 'no-cache',
          });
          const data = await response.json();
          if (data && data.success) {
            await Swal.fire({
              title: 'Éxito',
              text: 'Datos del recurso actualizados correctamente.',
              icon: 'success',
              confirmButtonColor: '#3B71CA',
              customClass: {
                popup: 'swal2-custom-font',
              },
            });
            // Cerrar el offcanvas
            myOffcanvas.hide();
            // Actualizar la lista de recursos
            let fecha_inicial = document.getElementById('rc-fecha-inicial')?.value ?? '';
            let fecha_final = document.getElementById('rc-fecha-final')?.value ?? '';
            listar_recursos_administrador(fecha_inicial, fecha_final);
          } else {
            await Swal.fire({
              title: 'Error',
              text: data.message || 'No se pudieron actualizar los datos del recurso.',
              icon: 'error',
              confirmButtonColor: '#3B71CA',
              customClass: {
                popup: 'swal2-custom-font',
              },
            });
          }
        } catch (error) {
          console.error('Error al guardar los datos del recurso:', error);
          await Swal.fire({
            title: 'Error inesperado',
            text: 'Ocurrió un error al intentar guardar los datos del recurso.',
            icon: 'error',
            confirmButtonColor: '#3B71CA',
            customClass: {
              popup: 'swal2-custom-font',
            },
          });
        }
      }

      if (e.target.matches('#btn_reasignar_recurso') || e.target.matches('#btn_reasignar_recurso *')) {
        const boton = e.target.closest('#btn_reasignar_recurso');

        const Proveedor_Id = boton.dataset.proveedor_id;
        const MaestroId = boton.dataset.id;

        // 🔍 Buscar el TD que tenga el mismo MaestroId
        const tdEstado = document.querySelector(
          `#tbl_administrador_recurso_pedidos td[data-id="${MaestroId}"]`
        );

        let Razon_Social = null;

        if (tdEstado) {
          Razon_Social = tdEstado.dataset.razon_social;
        }

        // console.log({
        //   MaestroId,
        //   Proveedor_Id,
        //   Razon_Social
        // });

        // Mostrar modal
        $('#ReasignarProveedorModal').modal('show');

        document.getElementById("proveedor_actual").value = Razon_Social;

        // Pasar datos al botón guardar
        const btnGuardar = document.getElementById("btn_guardar_proveedor");
        btnGuardar.dataset.proveedor_id = Proveedor_Id;
        btnGuardar.dataset.maestro_id = MaestroId;
        btnGuardar.dataset.razon_social = Razon_Social;
      }

      $('#ReasignarProveedorModal').on('shown.bs.modal', function () {
        traer_proveedor_torre_control();
      });

      if (e.target.matches("#btn_guardar_proveedor") || e.target.matches("#btn_guardar_proveedor *")) {
        e.preventDefault();

        const boton = e.target.closest('#btn_guardar_proveedor');

        const ProveedorActualId = boton.dataset.proveedor_id;
        const MaestroId = boton.dataset.maestro_id;
        const ProveedorNuevoId = document.getElementById("nuevo_proveedor").value;
        const MotivoCancelacion = document.getElementById("motivo_cancelacion").value.trim();

        if (!ProveedorNuevoId) {
          Swal.fire({
            icon: 'warning',
            title: 'Proveedor requerido',
            text: 'Debe seleccionar un proveedor nuevo',
          });
          return;
        }

        if (!MotivoCancelacion) {
          Swal.fire({
            icon: 'warning',
            title: 'Motivo requerido',
            text: 'Debe indicar el motivo de la reasignación',
          });
          return;
        }

        Swal.fire({
          title: '¿Confirmar reasignación?',
          text: 'Esta acción cancelará el proveedor actual y asignará uno nuevo.',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, reasignar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#0d6efd',
          cancelButtonColor: '#6c757d'
        }).then((result) => {

          if (!result.isConfirmed) return;

          const formData = new FormData();
          formData.append('maestro_id', MaestroId);
          formData.append('proveedor_actual_id', ProveedorActualId);
          formData.append('proveedor_nuevo_id', ProveedorNuevoId);
          formData.append('motivo_cancelacion', MotivoCancelacion);

          fetch($('#base_url').val() + 'torrecontrol/ReasignarProveedor', {
            method: 'POST',
            body: formData
          })
            .then(res => res.json())
            .then(data => {
              if (data.status) {
                Swal.fire({
                  icon: 'success',
                  title: 'Reasignado',
                  text: data.message,
                }).then(() => {
                  $('#ReasignarProveedorModal').modal('hide');
                  // 👉 recargar tabla si aplica
                  // listar_recursos_administrador(...)
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: data.error,
                });
              }
            })
            .catch(err => {
              console.error(err);
              Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'Ocurrió un error al procesar la solicitud',
              });
            });

        });
      }
    });

    document.addEventListener('input', async (e) => {
      if (e.target.matches('#rc-input-busqueda') || e.target.matches('#rc-input-busqueda *')) {
        let filtro = document.getElementById('rc-input-busqueda').value.trim();
        listar_recursos_administrador('', '', '', filtro);
      }
    });

    document.addEventListener('change', async (e) => {
      if (e.target.matches('#rc-modalidad') || e.target.matches('#rc-modalidad *')) {
        let valor = document.getElementById('rc-modalidad').value.trim();
        let fechaInicio = document.getElementById('rc-fecha-inicial').value.trim();
        let fechaFinal = document.getElementById('rc-fecha-final').value.trim();
        listar_recursos_administrador(fechaInicio, fechaFinal, valor);
      }
    });
  };

  async function listar_recursos_administrador(fecha_inicial, fecha_final, valor, filtro) {
    /* Funcion para enviar los datos */
    let dato = new FormData();
    dato.append('fecha_inicial', fecha_inicial);
    dato.append('fecha_final', fecha_final);
    dato.append('valor', valor ?? '');
    dato.append('filtro', filtro ?? '');

    try {
      const response = await fetch($('#base_url').val() + 'torrecontrol/listar_recrusos_administrador', {
        method: 'POST',
        body: dato,
        cache: 'no-cache',
      });
      const data = await response.json();
      if (data) {
        let tbody = document.getElementById('tbl_administrador_recurso_pedidos');
        tbody.innerHTML = '';
        let btn_gestion_pedidos = '';
        let btn_removeAsignacion = '';
        let btn_Reasignacion = '';

        data.forEach((element) => {
          const fila = document.createElement('tr');

          // Manejo de múltiples estados
          let estados_recurso_html = '';
          let estados = element.estados_recurso.split(',').map((e) => e.trim());

          estados.forEach((estado) => {
            let badgeClass = 'badge-phoenix-secondary'; // Por defecto

            if (estado === 'Pendiente Iniciar') {
              badgeClass = 'badge-phoenix-secondary';
              btn_removeAsignacion = `
            <a class="dropdown-item fw-bold" href="#" id="btn_cancelar_asignacion"
              data-id="${element.maestro_id}">
              <span class="uil-wrap-text"></span> Cancelar Asignación de pedido
            </a>`;

              btn_Reasignacion = `
            <a class="dropdown-item fw-bold" href="#" id="btn_reasignar_recurso"
              data-id="${element.maestro_id}" data-proveedor_id="${element.proveedor_id}">
              <span class="uil-user-arrows"></span> Reasignar Recurso
            </a>`;
            } else if (estado === 'Iniciado') {
              badgeClass = 'badge-phoenix-info';
              btn_Reasignacion = `
            <a class="dropdown-item fw-bold" href="#" id="btn_reasignar_recurso"
              data-id="${element.maestro_id}" data-proveedor_id="${element.proveedor_id}">
              <span class="uil-user-arrows"></span> Reasignar Recurso
            </a>`;
            } else if (estado === 'Completado') {
              badgeClass = 'badge-phoenix-success';
              btn_Reasignacion = ``;
            } else if (estado === 'Cancelado') {
              badgeClass = 'badge-phoenix-danger';
            } else if (estado === 'Rechazado') {
              badgeClass = 'badge-phoenix-warning';
              btn_Reasignacion = `
            <a class="dropdown-item fw-bold" href="#" id="btn_reasignar_recurso"
              data-id="${element.maestro_id}" data-proveedor_id="${element.proveedor_id}">
              <span class="uil-user-arrows"></span> Reasignar Recurso
            </a>`;
            }

            estados_recurso_html += `<span class="badge badge-phoenix fs-10 ${badgeClass}">
                                      <span class="badge-label">${estado}</span>
                                  </span> `;
          });

          /* Accion para gestionar los pedidos generados a los recursos */
          if (element.pedido_plantilla === 'SI') {
            btn_gestion_pedidos = `<a class="dropdown-item fw-bold" href="#" id="btn_gestion_pedido" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-clienteId="${element.clienteId}"><span class="uil-list-ui-alt"></span> Gestion Pedidos</a>`;
          } else {
            btn_gestion_pedidos = ``;
          }

          const columnaNundocSolicitud = document.createElement('td');
          columnaNundocSolicitud.innerHTML = `
                <div class="dropdown">
                  <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N° ${element.referencias_pedido}</a>
                  <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
                    <a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-clienteId="${element.clienteId}" data-motivo_cancelacion="${element.motivo_cancelacion}"><span class="uil uil-transaction"></span> Detalle Proceso</a>
                    ${btn_removeAsignacion}
                    ${btn_Reasignacion}
                    ${btn_gestion_pedidos}
                  </div>
                </div>
                `;

          const columnaCliente = document.createElement('td');
          columnaCliente.innerHTML = element.nombre;
          columnaCliente.style.width = 'auto';
          columnaCliente.style.whiteSpace = 'nowrap';

          const columnaModalidad = document.createElement('td');
          columnaModalidad.innerHTML = element.modalidad;
          columnaModalidad.style.width = 'auto';
          columnaModalidad.style.whiteSpace = 'nowrap';

          const columnaProceso = document.createElement('td');
          columnaProceso.innerHTML =
            element.proceso === 'Asignación'
              ? `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.proceso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`
              : `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">${element.proceso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          columnaProceso.style.width = 'auto';
          columnaProceso.style.whiteSpace = 'nowrap';

          const columnaFecha = document.createElement('td');
          columnaFecha.innerHTML = element.fecha;
          columnaFecha.style.width = 'auto';
          columnaFecha.style.whiteSpace = 'nowrap';

          const columnaFechaSalida = document.createElement('td');
          columnaFechaSalida.innerHTML = element.Fecha_Salida;
          columnaFechaSalida.style.width = 'auto';
          columnaFechaSalida.style.whiteSpace = 'nowrap';

          const columnaUsuario = document.createElement('td');
          columnaUsuario.innerHTML = element.usuario;
          columnaUsuario.style.width = 'auto';
          columnaUsuario.style.whiteSpace = 'nowrap';

          const columnaEstado = document.createElement('td');
          columnaEstado.innerHTML = estados_recurso_html;
          columnaEstado.style.width = 'auto';
          columnaEstado.style.whiteSpace = 'nowrap';

          const columnaEstadoRecurso = document.createElement('td');
          // columnaEstadoRecurso.innerHTML = esatdo_recurso;
          columnaEstadoRecurso.dataset.id = element.maestro_id; // Guardamos el ID para su actualización posterior
          columnaEstadoRecurso.style.width = 'auto';
          columnaEstadoRecurso.style.whiteSpace = 'nowrap';

          fila.appendChild(columnaNundocSolicitud);
          fila.appendChild(columnaCliente);
          fila.appendChild(columnaModalidad);
          fila.appendChild(columnaProceso);
          fila.appendChild(columnaFecha);
          fila.appendChild(columnaFechaSalida);
          fila.appendChild(columnaUsuario);
          fila.appendChild(columnaEstado);
          fila.appendChild(columnaEstadoRecurso);
          tbody.appendChild(fila);
        });
        await estado_recurso();
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

  async function Listar_pedidos_recursos(MaestroId, VentanaId, Proceso, ClienteId) {
    try {
      let formData = new FormData();
      formData.append('MaestroId', MaestroId);
      formData.append('VentanaId', VentanaId);

      let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_recursos', {
        method: 'POST',
        body: formData,
      });

      let data = await response.json();
      if (data) {
        let miArray = [];
        let ArrayRefPedidos = [];

        let rows = '';
        let totalPesoNeto = 0;
        let totalPesoBruto = 0;
        let totalUnidades = 0;
        let col_estatus_publicacion = '';

        document.getElementById('tbody_subasta_resultados').innerHTML = '';
        data.sql.forEach((servicio, index) => {
          $('#pesoNeto').text('');
          $('#pesoBruto').text('');
          $('#totalUnidades').text('');

          if (servicio.peso_neto_kg) {
            totalPesoNeto += parseFloat(servicio.peso_neto_kg);
          }

          if (servicio.peso_bruto_kg) {
            totalPesoBruto += parseFloat(servicio.peso_bruto_kg);
          }

          if (servicio.unidades) {
            totalUnidades += parseFloat(servicio.unidades);
          }

          $('#pesoNeto').text(totalPesoNeto);
          $('#pesoBruto').text(totalPesoBruto);
          $('#totalUnidades').text(totalUnidades);

          if (servicio.estado_proceso_pedido === 'Pendiente Iniciar') {
            col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          } else if (servicio.estado_proceso_pedido === 'Iniciado') {
            col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          } else if (servicio.estado_proceso_pedido === 'Cancelado') {
            col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
            btn_publicacion = `<a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido" data-id="${servicio.numdoc_solicitud}" data-id2="${servicio.cliente}"><span class="uil uil-feedback"></span> Publicar Pedido</a>`;
          } else if (servicio.estado_proceso_pedido === 'Completado') {
            col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          } else if (servicio.estado_proceso_pedido === 'Rechazado') {
            col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          }

          miArray.push(servicio.numdoc_solicitud);
          ArrayRefPedidos.push(servicio.referencia_pedido);
          rows += `
            <tr>
              <th scope="row" class='text-center' style='width: auto; white-space: nowrap;'>${servicio.numdoc_solicitud}</th>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.referencia_pedido}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.cod_producto}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.producto}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.peso_bruto_kg}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.presentacion}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.unidades}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.num_estibas}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.ciudad_origen}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.ciudad_destino}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_cargar}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_entregar}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.remitente}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.destinatario}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'><span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.tipo_trazabilidad}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${col_estatus_publicacion}</td>
            </tr>
            <tr id="Recurso_proveedores_${servicio.numdoc_solicitud}" style="display: none;">
              <td colspan="12">
                <div class="lista-proceso-proveedores"></div>
              </td>
            </tr>
          `;
        });
        document.getElementById('tbody_servicios_pedidos_recurso').innerHTML = rows;
        const modalidad_pedido = data.sql.length > 0 ? data.sql[0].modalidad : null;
        Listar_servicios_por_proveedor(MaestroId, VentanaId, Proceso, miArray, ClienteId, ArrayRefPedidos, modalidad_pedido);
        document.getElementById('btn_guardar_se').setAttribute('data-solicitudesId', miArray);

        /* LLenar tabla de subasta */
        if (data.resultados.length > 0) {
          let rows_Subasta = '';
          data.resultados.forEach((proveedor, index) => {
            rows_Subasta += `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${proveedor.tipo_servicio}</td>
                  <!--<td>${proveedor.valor_ganador}</td>-->
                  <td>${parseFloat(proveedor.valor_ganador).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                  <td>${proveedor.razon_social}</td>
                  <td>${proveedor.cedula_conductor}</td>
                  <td>${proveedor.nombre_conductor}</td>
                  <td>${proveedor.referencia}</td>
                  <td>${proveedor.Fecha_registro}</td>
                  <td>${proveedor.Fecha_Inicio}</td>
                  <td>
                    <div class="row">
                      <div class="col-12 d-flex justify-content-end align-items-center">
                        <div class="btn-group btn-group-sm" role="group" aria-label="Extra-small button group">
                          <button class="btn btn-subtle-warning btn-sm me-1 px-1 py-0" type="button" id="btn_edit_datos" style="font-size:12px;" data-RecursoId="${proveedor.recurso_id}">
                            <span class="uil uil-file-edit-alt" data-fa-transform="shrink-3"></span> Editar
                          </button>
                          <!--<button class="btn btn-subtle-success btn-sm me-1 px-1 py-0" type="button" id="btn_save_cargue22768" style="font-size:12px;display:none;" data-remitente="ECOLAB SIBERIA" data-punto="1" data-puntoid="22768" data-numdocsol="22757">
                            <span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar
                          </button>
                          <button class="btn btn-subtle-danger btn-sm me-1 px-1 py-0" type="button" id="btn_canelar_cargue22768" style="font-size:12px;display:none;" data-remitente="ECOLAB SIBERIA" data-punto="1" data-puntoid="22768" data-numdocsol="22757">
                            <span class="uil uil-cancel" data-fa-transform="shrink-3"></span> Cacelar
                          </button>-->
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr id="servicios_${proveedor.servicio_id}" style="display: none;">
                  <td colspan="4">
                    <div class="lista-servicios"></div>
                  </td>
                </tr>
              `;
          });
          document.getElementById('tbody_subasta_resultados').innerHTML = rows_Subasta;
        } else {
          document.getElementById(
            'tbody_subasta_resultados'
          ).innerHTML = `<tr><td colspan="8" class="text-center text-danger">No hay datos para mostrar</td></tr>`;
        }

        let rows_Servicios = '';
        let tabHeaders = '';

        data.proveedores.forEach((proveedor, index) => {
          // Construir el HTML para cada tab header
          tabHeaders += `
          <li class="nav-item">
            <a class="nav-link ${index === 0 ? 'active' : ''}" 
               id="${proveedor.proveedor_id}-tab" 
               data-bs-toggle="tab" 
               href="#tab-${proveedor.proveedor_id}" 
               role="tab" 
               aria-controls="tab-${proveedor.proveedor_id}" 
               aria-selected="${index === 0 ? 'true' : 'false'}">
               ${proveedor.razon_social}
            </a>
          </li>
        `;
        });

        // Insertar todos los headers en el contenedor
        document.getElementById('cabecera_proveedores_servicios_especiales').innerHTML = tabHeaders;

        // Necesitamos hacer esto en una función async
        let tabContent = '<div class="tab-content">';

        // Usamos for...of en lugar de forEach para poder usar await
        for (const [index, proveedor] of data.proveedores.entries()) {
          const contenido = await Listar_servicios_especiales_proveedor(proveedor.proveedor_id, MaestroId, index);
          tabContent += contenido;
        }

        tabContent += '</div>';
        document.getElementById('detalle_proveedores_servicios_especiales').innerHTML = tabContent;

        /* Observaciones de los recursos */
        document.getElementById('observacion_recurso').innerHTML = data.sql[0].observacion;
      } else {
        document.getElementById(
          'tbody_servicios_pedidos_recurso'
        ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">No hay datos para mostrar</td></tr>`;
      }
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      document.getElementById(
        'tbody_servicios_pedidos_recurso'
      ).innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
    }
  }

  async function Listar_servicios_por_proveedor(MaestroId, VentanaId, Proceso, miArray, ClienteId, ArrayRefPedidos, modalidad_pedido) {
    try {
      let formData = new FormData();
      formData.append('RecursoId', MaestroId);
      formData.append('VentanaId', VentanaId);

      let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_recursos_proveedor', {
        method: 'POST',
        body: formData,
      });

      let data = await response.json();
      if (data) {
        // Agrupar por razon_social (proveedor)
        const getBadgeClass = (estado) => {
          switch (estado) {
            case 'Pendiente Iniciar':
              return 'badge-phoenix fs-10 badge-phoenix-secondary';
            case 'Iniciado':
              return 'badge-phoenix fs-10 badge-phoenix-info';
            case 'Cancelado':
              return 'badge-phoenix fs-10 badge-phoenix-danger';
            case 'Rechazado':
              return 'badge-phoenix fs-10 badge-phoenix-danger';
            case 'Completado':
              return 'badge-phoenix fs-10 badge-phoenix-success';
            case 'Postulado':
              return 'badge-phoenix fs-10 badge-phoenix-warning';
            case 'Ganador':
              return 'badge-phoenix fs-10 badge-phoenix-success';
            case 'No Asignada':
              return 'badge-phoenix fs-10 badge-phoenix-danger';
            default:
              return 'badge-secondary';
          }
        };

        const groupedByProvider = data.reduce((acc, current) => {
          const key = current.razon_social;

          if (!acc[key]) {
            acc[key] = {
              proveedor: current.razon_social,
              estado_servicio: `<span class="badge ${getBadgeClass(current.estado_servicio)}"><span class="badge-label">${current.estado_servicio
                }</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`,
              estado_recurso: `<span class="badge ${getBadgeClass(current.estado_recurso)}"><span class="badge-label">${current.estado_recurso
                }</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`,
              servicios: [],
            };
          }

          acc[key].servicios.push({
            tipo_servicio: current.tipo_servicio,
            vehiculo: current.vehiculo,
            estado: current.estado_servicio,
            servicioId: current.servicioId,
            fecha_registro: current.Fecha_registro,
            fecha_limite: current.fecha_limite,
            ProveedorId: current.ProveedorId,
            Valor_Servicio: current.Valor_Servicio,
            Fecha_Inicio: current.Fecha_Inicio,
            Fecha_Actualizacion: current.Fecha_Actualizacion,
            Placa: current.Placa,
            cedula_conductor: current.cedula_conductor,
            nombre_conductor: current.nombre_conductor,
            estado_recurso: current.estado_recurso,
            capacidad: current.capacidad,
            tiempo_libre: current.tiempo_libre,
            stand_bay: current.stand_bay,
            cumplimiento: current.cumplimiento,
            contenedor: current.contenedor,
            tara: current.tara,
          });

          return acc;
        }, {});
        // Convertir a array
        const result = Object.values(groupedByProvider);

        const accordionContainer = document.getElementById('accordionExample');
        accordionContainer.innerHTML = '';
        let arrayServicios_1 = [];
        let arrayproveedor_1 = [];

        result.forEach((proveedor, index) => {
          const accordionItem = document.createElement('div');
          accordionItem.className = `accordion-item${index === 0 ? ' border-top' : ''}`;

          const ServiciosTot = proveedor.servicios.filter((servicio) => servicio.estado !== 'Postulado');
          arrayServicios_1.push(ServiciosTot.map((servicio) => servicio.servicioId));
          document.getElementById('btn_guardar_se').setAttribute('data-serviciosId', arrayServicios_1);

          arrayproveedor_1.push(ServiciosTot.map((servicio) => servicio.ProveedorId));
          document.getElementById('btn_guardar_se').setAttribute('data-proveedorId', arrayproveedor_1);

          // Obtener los servicios postulados
          const serviciosPostulados = proveedor.servicios.filter((servicio) => servicio.estado === 'Postulado');

          // Obtener solo los IDs de los servicios postulados
          const arrayServicios = serviciosPostulados.map((servicio) => servicio.servicioId);
          const arrayProveedores = serviciosPostulados.map((servicio) => servicio.ProveedorId);
          const arrayValoresServicio = serviciosPostulados.map((servicio) => servicio.Valor_Servicio);
          const arrayFechaInicio = serviciosPostulados.map((servicio) => servicio.Fecha_Inicio);
          const arrayFechaActualizacion = serviciosPostulados.map((servicio) => servicio.Fecha_Actualizacion);
          const arrayPlaca = serviciosPostulados.map((servicio) => servicio.Placa);

          // Mostrar el botón si hay al menos un servicio postulado
          if (arrayServicios.length > 0) {
            if (Proceso === 'Asignación') {
              if (proveedor.servicios.some(servicio => servicio.estado_recurso === 'Cancelado')) {
                document.getElementById('btn_asignar_recurso').style.display = 'none';
                document.getElementById('btn_cancelar_recurso').style.display = 'none';
              } else {
                document.getElementById('btn_asignar_recurso').style.display = '';
                document.getElementById('btn_cancelar_recurso').style.display = '';
              }

              // document.getElementById('btn_asignar_recurso').style.display = '';
              document.getElementById('btn_asignar_recurso').setAttribute('data-ServiciosId', JSON.stringify(arrayServicios));
              document.getElementById('btn_asignar_recurso').setAttribute('data-Proceso', Proceso);
              document.getElementById('btn_asignar_recurso').setAttribute('data-MaestroId', MaestroId);
              document.getElementById('btn_asignar_recurso').setAttribute('data-SolicitudesId', JSON.stringify(miArray));
              document.getElementById('btn_asignar_recurso').setAttribute('data-ProveedoresId', JSON.stringify(arrayProveedores));
              document.getElementById('btn_asignar_recurso').setAttribute('data-ValoresServicio', JSON.stringify(arrayValoresServicio));
              document.getElementById('btn_asignar_recurso').setAttribute('data-FechaInicio', JSON.stringify(arrayFechaInicio));
              document.getElementById('btn_asignar_recurso').setAttribute('data-FechaActualizacion', JSON.stringify(arrayFechaActualizacion));
              document.getElementById('btn_asignar_recurso').setAttribute('data-Placa', JSON.stringify(arrayPlaca));
              document.getElementById('btn_asignar_recurso').setAttribute('data-ClienteId', ClienteId);
              document.getElementById('btn_asignar_recurso').setAttribute('data-ReferenciaPedidos', JSON.stringify(ArrayRefPedidos));
              document.getElementById('btn_asignar_recurso').setAttribute('data-Modalidad', modalidad_pedido);
              /*
              =========================================
              Boton para cancelar Servicio en subasta
              =========================================
              */
              document.getElementById('btn_cancelar_recurso').setAttribute('data-ServiciosId', JSON.stringify(arrayServicios));
              document.getElementById('btn_cancelar_recurso').setAttribute('data-Proceso', Proceso);
              document.getElementById('btn_cancelar_recurso').setAttribute('data-MaestroId', MaestroId);
              document.getElementById('btn_cancelar_recurso').setAttribute('data-SolicitudesId', JSON.stringify(miArray));
              document.getElementById('btn_cancelar_recurso').setAttribute('data-ProveedoresId', JSON.stringify(arrayProveedores));
              document.getElementById('btn_cancelar_recurso').setAttribute('data-ValoresServicio', JSON.stringify(arrayValoresServicio));
              document.getElementById('btn_cancelar_recurso').setAttribute('data-FechaInicio', JSON.stringify(arrayFechaInicio));
              document.getElementById('btn_cancelar_recurso').setAttribute('data-FechaActualizacion', JSON.stringify(arrayFechaActualizacion));
              document.getElementById('btn_cancelar_recurso').setAttribute('data-Placa', JSON.stringify(arrayPlaca));
              document.getElementById('btn_cancelar_recurso').setAttribute('data-ClienteId', ClienteId);
              document.getElementById('btn_cancelar_recurso').setAttribute('data-ReferenciaPedidos', JSON.stringify(ArrayRefPedidos));
              document.getElementById('btn_cancelar_recurso').setAttribute('data-Modalidad', modalidad_pedido);
            } else {
              // console.log("🚀 ~ Listar_servicios_por_proveedor ~ proveedor.estado_recurso :", proveedor.servicios.estado_recurso)
              if (proveedor.servicios.some(servicio => servicio.estado_recurso === 'Cancelado')) {
                document.getElementById('btn_subastar_recurso').style.display = 'none';
                document.getElementById('btn_cancelar_recurso').style.display = 'none';
                document.getElementById('slct_criterio').style.display = 'none';
              } else {
                document.getElementById('btn_subastar_recurso').style.display = '';
                document.getElementById('btn_cancelar_recurso').style.display = '';
                document.getElementById('slct_criterio').style.display = '';
              }

              // document.getElementById('btn_subastar_recurso').style.display = '';
              // document.getElementById('slct_criterio').style.display = '';
              document.getElementById('btn_subastar_recurso').setAttribute('data-MaestroId', MaestroId);
              document.getElementById('btn_subastar_recurso').setAttribute('data-ClienteId', ClienteId);
              document.getElementById('btn_subastar_recurso').setAttribute('data-Modalidad', modalidad_pedido);
              document.getElementById('btn_subastar_recurso').setAttribute('data-ReferenciaPedidos', JSON.stringify(ArrayRefPedidos));
              /*
                =========================================
                Boton para cancelar Servicio en subasta
                =========================================
              */
              document.getElementById('btn_cancelar_recurso').setAttribute('data-MaestroId', MaestroId);
              document.getElementById('btn_cancelar_recurso').setAttribute('data-ClienteId', ClienteId);
              document.getElementById('btn_cancelar_recurso').setAttribute('data-Modalidad', modalidad_pedido);
              document.getElementById('btn_cancelar_recurso').setAttribute('data-ReferenciaPedidos', JSON.stringify(ArrayRefPedidos));
            }
          }

          const serviciosHTML = proveedor.servicios
            .map((servicio) => {
              let col_estatus_publicacion;

              switch (servicio.estado) {
                case 'Pendiente Iniciar':
                  col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${servicio.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
                  break;
                case 'Iniciado':
                  col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${servicio.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
                  break;
                case 'Cancelado':
                case 'Rechazado':
                  col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
                  break;
                case 'Completado':
                  col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
                  break;
                case 'Postulado':
                  col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${servicio.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
                  break;
                case 'Ganador':
                  col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
                  break;
                case 'No Asignada':
                  col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
                  break;
                default:
                  col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-light"><span class="badge-label">${servicio.estado}</span></span>`;
              }

              return `
            <div class="row mb-2" style="font-size:13px;">
              <div class="col-2">${servicio.tipo_servicio}</div>
              <div class="col-2"><small class="text-muted">${servicio.vehiculo}</small></div>
              <div class="col-2">${col_estatus_publicacion}</div>
              <div class="col-3"><small class="text-muted">${servicio.fecha_registro}</small></div>
              <div class="col-3"><small class="text-muted">${servicio.fecha_limite}</small></div>
            </div>
            
            <div class="row mb-3">
              <div class="col-2">
                <small class="text-muted">Cedula: ${servicio.cedula_conductor ? servicio.cedula_conductor : 'No Aplica'}</small>
              </div>
              <div class="col-2">
                <small class="text-muted">Conductor: ${servicio.nombre_conductor ? servicio.nombre_conductor : 'No Aplica'}</small>
              </div>
              <div class="col-2">
                <small class="text-muted">${servicio.Placa ? `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${servicio.Placa}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`
                  : 'No Aplica'
                }</small>
              </div>
              <div class="col-3">
                <small class="text-muted">Valor Servicio: ${servicio.Valor_Servicio ? servicio.Valor_Servicio : 0.0}</small>
              </div>
              <div class="col-3">
                <small class="text-muted">Inicio de servicio: ${servicio.Fecha_Inicio ? servicio.Fecha_Inicio : '0000-00-00'}</small>
              </div>
            </div>
            <hr class="my-1 text-dark">
          `;
            })
            .join('');

          /* Datos de la operacion */
          const OperacionesHTML = proveedor.servicios
            .map((operacion) => {
              return `
                    <div class="row mb-3">
                      <div class="col-2 text-muted" style="font-size:12px;">${operacion.capacidad ? operacion.capacidad : '-'}</div>
                      <div class="col-2 text-muted" style="font-size:12px;">${operacion.tiempo_libre ? operacion.tiempo_libre : '-'}</div>
                      <div class="col-2 text-muted" style="font-size:12px;">${operacion.stand_bay ? operacion.stand_bay : '-'}</div>
                      <div class="col-2 text-muted" style="font-size:12px;">${operacion.cumplimiento ? operacion.cumplimiento : '-'}</div>
                      <div class="col-2 text-muted" style="font-size:12px;">${operacion.contenedor ? operacion.contenedor : '-'}</div>
                      <div class="col-2 text-muted" style="font-size:12px;">${operacion.tara ? operacion.tara : '-'}</div>
                    </div>
                  `;
            })
            .join('');

          accordionItem.innerHTML = `
          <h2 class="accordion-header" id="heading${index}">
            <button class="accordion-button collapsed d-flex justify-content-between align-items-center" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#collapse${index}" 
                    aria-expanded="false" 
                    aria-controls="collapse${index}">

              <!-- Contenedor de 3 columnas fijas -->
              <span class="d-flex w-100 align-items-center justify-content-between">
                
                <!-- Columna 1: Nombre del proveedor (ajustable) -->
                <span class="text-primary flex-grow-1 text-truncate">${proveedor.proveedor}</span>

                <!-- Columna 2: Estado del servicio (fijo) -->
                <span class="badge mx-3 text-nowrap" style="min-width: 140px; text-align: center;">
                  <span class="text-dark flex-grow-1 text-truncate me-2">Estado Servicio: </span> ${proveedor.estado_servicio}
                  <span class="text-dark flex-grow-1 text-truncate me-2">Estado Recurso: </span>${proveedor.estado_recurso}
                </span>
              </span>
            </button>
          </h2>
          <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#accordionExample">
              <div class="accordion-body pt-0">
                  <div class="row fw-bold mb-2">
                      <div class="col-2">Tipo servicio</div>
                      <div class="col-2">Vehículo</div>
                      <div class="col-2">Estado</div>
                      <div class="col-3">Fecha Registro</div>
                      <div class="col-3">Fecha Límite</div>
                  </div>
                  ${serviciosHTML}
                  <div class="row fw-bold mb-2">
                      <div class="col-2">Capacidad Vehículo</div>
                      <div class="col-2">Tiempo Libre</div>
                      <div class="col-2">Stand By</div>
                      <div class="col-2">Cumplimiento</div>
                      <div class="col-2">Contenedor</div>
                      <div class="col-2">Tara</div>
                  </div>
                  ${OperacionesHTML}
              </div>
          </div>
        `;

          accordionContainer.appendChild(accordionItem);
        });
      } else {
        document.getElementById('bloque_header').innerHTML = `<p class="text-danger">${data.message}</p>`;
      }
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      document.getElementById('bloque_header').innerHTML = `<p class="text-danger">Error al cargar servicios</p>`;
    }
  }

  async function Listar_actividades_pedido(MaestroId) {
    try {
      let formData = new FormData();
      formData.append('RecursoId', MaestroId);

      let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_actividades_gestion', {
        method: 'POST',
        body: formData,
        cache: 'no-cache',
      });

      let data = await response.json();
      let tbody = document.getElementById('tbody_actividades');
      let usuario = document.getElementById('id_usuario').value;
      let CriterioCalculo = '';
      tbody.innerHTML = '';
      data.actividades.forEach((element) => {
        // setTimeout(() => {}, 500);
        const fila = document.createElement('tr');
        const columnaPosicion = document.createElement('td');
        columnaPosicion.textContent = element.posicion;
        columnaPosicion.style.textAlign = 'center';
        columnaPosicion.style.width = 'auto';
        columnaPosicion.style.whiteSpace = 'nowrap';
        const columnaParametro = document.createElement('td');
        columnaParametro.textContent = element.nombre_tipo;
        columnaParametro.style.textAlign = 'center';
        columnaParametro.style.width = 'auto';
        columnaParametro.style.whiteSpace = 'nowrap';

        const columnaActividad = document.createElement('td');
        columnaActividad.innerHTML = `<span class="text-primary">${element.nombre_opcion}</span>`;
        columnaActividad.style.textAlign = 'center';
        columnaActividad.style.width = 'auto';
        columnaActividad.style.whiteSpace = 'nowrap';

        const columnaResponsable = document.createElement('td');
        columnaResponsable.textContent = element.nom_usuario;
        columnaResponsable.style.textAlign = 'center';
        columnaResponsable.style.width = 'auto';
        columnaResponsable.style.whiteSpace = 'nowrap';

        const columnaFechaBase = document.createElement('td');
        columnaFechaBase.textContent = element.fecha_base === null || '' ? 'Sin Fecha' : element.fecha_base;
        columnaFechaBase.style.textAlign = 'center';
        columnaFechaBase.style.width = 'auto';
        columnaFechaBase.style.whiteSpace = 'nowrap';

        const columnaVencimiento = document.createElement('td');
        // columnaVencimiento.textContent = element.fecha_inicio + ' ' + element.hora_inicio;
        if (element.fecha_inicio && element.hora_inicio) {
          columnaVencimiento.textContent = element.fecha_inicio + ' ' + element.hora_inicio;
        } else {
          columnaVencimiento.textContent = 'sin fecha de vencimiento';
        }

        columnaVencimiento.style.textAlign = 'center';
        columnaVencimiento.style.width = 'auto';
        columnaVencimiento.style.whiteSpace = 'nowrap';

        // const columnaVTiempoTrancurrido = document.createElement('td');
        // columnaVTiempoTrancurrido.textContent = element.tiempo_transcurrido_base;
        // columnaVTiempoTrancurrido.style.textAlign = 'center';
        // columnaVTiempoTrancurrido.style.width = 'auto';
        // columnaVTiempoTrancurrido.style.whiteSpace = 'nowrap';

        const columnaVencimientoTranscurrido = document.createElement('td');
        columnaVencimientoTranscurrido.textContent = element.valor_minutos;
        // columnaVencimientoTranscurrido.textContent = element.tiempo_transcurrido_base;
        columnaVencimientoTranscurrido.style.textAlign = 'center';
        columnaVencimientoTranscurrido.style.width = 'auto';
        columnaVencimientoTranscurrido.style.whiteSpace = 'nowrap';

        const columnaEstdo = document.createElement('td');
        if (element.estado_actividad === 'SIN INICIAR') {
          columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_actividad === 'EN GESTION') {
          columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_actividad === 'COMPLETADO') {
          columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_actividad === 'CANCELADO') {
          columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_actividad === 'PAUSADO') {
          columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_actividad === 'VENCIDO') {
          columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        }

        columnaEstdo.style.textAlign = 'center';
        columnaEstdo.style.width = 'auto';
        columnaEstdo.style.whiteSpace = 'nowrap';
        /* Eejcuatr consualtr de dependcias */
        const columnaAcciones = document.createElement('td');
        columnaAcciones.style.textAlign = 'center';
        columnaAcciones.style.width = 'auto';
        columnaAcciones.style.whiteSpace = 'nowrap';

        if (element.estado_actividad === 'SIN INICIAR' || element.estado_actividad === 'EN GESTION' ||
          element.estado_actividad === 'PAUSADO' || element.estado_actividad === 'VENCIDO'
        ) {
          // Verificamos si la actividad actual tiene una actividad dependiente completada
          if (element.actividad_dependiente !== null) {
            // Buscamos la actividad dependiente y verificamos su estado
            const actividadDependiente = data.actividades.find((act) => act.actividad_id === element.actividad_dependiente);
            if (actividadDependiente && actividadDependiente.estado_actividad === 'COMPLETADO') {
              // Si la actividad dependiente está completada, desbloqueamos la actividad actual
              if (usuario === '404' || usuario === '403' || usuario === '400' || usuario === '401' || usuario === '402') {
                columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                  <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data.actividades[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                </div>`;
              } else {
                if (element.estado_visualizar === 'VISUALIZADOR') {
                  columnaAcciones.innerHTML = `
                  <div class="btn-group btn-group-sm" role="group" aria-label="...">
                    <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data.actividades[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                  </div>`;
                } else {
                  columnaAcciones.innerHTML = `
                  <div class="btn-group btn-group-sm" role="group" aria-label="...">
                    <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-comment-alt-message"></i> Gestionar</button>
                    <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data.actividades[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                  </div>`;
                }
              }
            } else {
              // Si no está completada, dejamos la actividad bloqueada
              if (usuario === '404' || usuario === '403' || usuario === '400' || usuario === '401' || usuario === '402') {
                columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                  <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data.actividades[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                </div>`;
              } else {
                if (element.estado_visualizar === 'VISUALIZADOR') {
                  columnaAcciones.innerHTML = `
                  <div class="btn-group btn-group-sm" role="group" aria-label="...">
                    <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data.actividades[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                  </div>`;
                } else {
                  columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                  <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}" disabled><i class="uil-comment-alt-message"></i> Gestionar</button>
                  <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data.actividades[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                 
                </div>`;
                }
              }
            }
          } else {
            // Si no tiene dependencia, se puede gestionar sin restricciones
            if (usuario === '404' || usuario === '403' || usuario === '400' || usuario === '401' || usuario === '402') {
              columnaAcciones.innerHTML = `
              <div class="btn-group btn-group-sm" role="group" aria-label="...">
                <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data.actividades[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
              </div>`;
            } else {
              if (element.estado_visualizar === 'VISUALIZADOR') {
                columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                  <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data.actividades[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                </div>`;
              } else {
                columnaAcciones.innerHTML = `
              <div class="btn-group btn-group-sm" role="group" aria-label="...">
                <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-comment-alt-message"></i> Gestionar</button>
                <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data.actividades[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
               
              </div>`;
              }
            }
          }
        } else if (element.estado_actividad === 'COMPLETADO' || element.estado_actividad === 'CANCELADO') {
          // Si la actividad ya está completada o cancelada
          if (usuario === '404' || usuario === '403' || usuario === '400' || usuario === '401' || usuario === '402') {
            columnaAcciones.innerHTML = `
            <div class="btn-group btn-group-sm" role="group" aria-label="...">
              <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data.actividades[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
            </div>`;
          } else {
            columnaAcciones.innerHTML = `
            <div class="btn-group btn-group-sm" role="group" aria-label="...">
              <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data.actividades[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
            </div>`;
          }
        }

        const fila2 = document.createElement('tr');
        fila2.style.display = 'none';
        fila2.setAttribute('id', `columnaproceso${element.actividad_id}`);

        const columnaFormulario = document.createElement('td');

        columnaFormulario.setAttribute('id', `celdaproceso${element.actividad_id}`);
        columnaFormulario.setAttribute('colspan', 11);
        columnaFormulario.style.backgroundColor = '#f1f2f4';

        columnaFormulario.innerHTML = `
          <div id="proceso_numero${element.num_proceso}" style="padding:1px 1px 1px;" data-idnum_proceso="${element.num_proceso
          }" class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div class="row">
              <div id="mensaje${element.actividad_id}"></div>
              <!--<div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex justify-content-end">
                <div class="mb-1">
                  <div class="checkbox">
                    <label style="font-weight: bold;font-size: 15px;">
                      <input type="checkbox" id="publicar${element.actividad_id}" name="publicar" style="transform: scale(1.5);margin-right: 5px;">
                      Publicar Gestion al Cliente
                    </label>
                  </div>
                </div>
              </div>-->
              <input class="form-control input-xs" type="hidden" id="parametros_pedido${element.actividad_id}" name="parametros_pedido" value="${element.proceso_id}" data-id_parametros_pedido="${element.proceso_id}" readonly>
              <input class="form-control input-xs" type="hidden" id="parametros_punto_pedido_opcion${element.actividad_id}" name="parametros_punto_pedido_opcion" value="${element.actividad_id}" data-id_parametros_punto_pedido_opcion="${element.actividad_id}" readonly>

              <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <div class="mb-1">
                  <label class="form-label" for="documento${element.actividad_id}">Documento</label>
                  <input type="file" name="documento" id="documento${element.actividad_id}" class="form-control form-control-sm">
                </div>
              </div>

              <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <div class="mb-1">
                  <label class="form-label" for="estado_actividad${element.actividad_id}">Seleccionar Estado</label>
                    <select name="estado_actividad" id="estado_actividad${element.actividad_id}" class="form-select form-select-sm" data-EstadoActividadId="${element.actividad_id}">
                      <option value="" selected>Selecciones</option>
                      <option value="SIN INICIAR">SIN INICIAR</option>
                      <option value="EN GESTION">EN GESTION</option>
                      <option value="COMPLETADO">COMPLETADO</option>
                      <option value="CANCELADO">CANCELADO</option>
                      <option value="PAUSADO">PAUSADO</option>
                    </select>
                </div>
              </div>

              <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <div class="mb-1">
                  <label class="form-label" for="costo_estimado${element.actividad_id}">Costo Estimado</label>
                  <input type="text" name="costo_estimado" id="costo_estimado${element.actividad_id}" class="form-control form-control-sm text-center" disabled value="${element.costo_promedio ? parseFloat(element.costo_promedio).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : 0}">
                </div>
              </div>

              <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <div class="mb-1">
                  <label class="form-label" for="costo_ejecutado${element.actividad_id}">Costo Ejecutado</label>
                  <input type="number" name="costo_ejecutado" id="costo_ejecutado${element.actividad_id}" class="form-control form-control-sm text-center" disabled>
                </div>
              </div>

              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <div class="mb-1">
                  <label class="form-label" for="observacion_gestion${element.actividad_id}">Observación</label>
                  <textarea name="observacion_gestion" id="observacion_gestion${element.actividad_id}" cols="30" rows="2"
                    class="form-control form-control-sm"></textarea>
                </div>
              </div>

              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex justify-content-end my-2">
                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                  <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1" style="margin-right:5px;" id="btn_cancelar_gestion${element.actividad_id}"><i class="fas fa-times"></i> Cancelar</button>
                  <button type="button" class="btn btn-success btn-sm me-1 px-1 py-1" id="btn_guardar_gestion${element.actividad_id}" data-PedidoId="${data.actividades[0]['numdoc']}" data-MaestroId="${MaestroId}"><i class="far fa-save"></i> Guardar</button>
                </div>
              </div>
            </div>
          </div>`;
        const fila3 = document.createElement('tr');
        fila3.style.display = 'none';
        fila3.setAttribute('id', `columnadetalleactividad${element.actividad_id}`);
        const columnaGestionActvidad = document.createElement('td');
        columnaGestionActvidad.setAttribute('id', `columnadetalleactividad${element.actividad_id}`);
        columnaGestionActvidad.setAttribute('colspan', 11);
        columnaGestionActvidad.innerHTML = `
        <div id="detalle_actividad_numero${element.num_proceso}" style="padding:1px 1px 1px;" data-idnum_proceso="${element.num_proceso}" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div id="mensaje_publicado${element.actividad_id}"></div>
          <div class="bs-example" data-example-id="simple-table">
            <table class="table table-sm" style="font-size:12px;">
              <thead class='table-bordered'>
                <tr>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>#</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Fecha</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Costo Estimado</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Costo Ejecutado</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Observación</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Responsable</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Evidencia</th>
                </tr>
              </thead>
              <tbody id="tbl_detalle_gestion${element.actividad_id}"></tbody>
            </table>
          </div>
        </div>
        `;

        // criterio_calculo
        if (element.criterio_calculo === 1) {
          CriterioCalculo = `Fecha Inicial`;
        } else if (element.criterio_calculo === 2) {
          CriterioCalculo = `Fecha Cargue`;
        } else if (element.criterio_calculo === 3) {
          CriterioCalculo = `Fecha Descargue`;
        } else if (element.criterio_calculo === 4) {
          CriterioCalculo = `Fecha actividad dependiente` + ' (' + element.nombre_actividad_dependiente + ')';
        }

        const columnaCriterioCalculo = document.createElement('td');
        columnaCriterioCalculo.innerHTML = CriterioCalculo;
        columnaCriterioCalculo.style.textAlign = 'center';
        columnaCriterioCalculo.style.width = 'auto';
        columnaCriterioCalculo.style.whiteSpace = 'nowrap';

        fila.appendChild(columnaPosicion);
        fila.appendChild(columnaParametro);
        fila.appendChild(columnaActividad);
        // fila.appendChild(columnaCostoActividad);
        fila.appendChild(columnaResponsable);
        fila.appendChild(columnaCriterioCalculo);
        fila.appendChild(columnaFechaBase);
        fila.appendChild(columnaVencimiento);
        // fila.appendChild(columnaVTiempoTrancurrido);
        fila.appendChild(columnaVencimientoTranscurrido);
        fila.appendChild(columnaEstdo);
        fila.appendChild(columnaAcciones);

        fila2.appendChild(columnaFormulario);
        fila3.appendChild(columnaGestionActvidad);
        // tbody.appendChild(fila, fila2, fila3);
        tbody.appendChild(fila);
        tbody.appendChild(fila2);
        tbody.appendChild(fila3);
      });

      let col_estatus_publicacion;

      switch (data.servicios[0].estado_servicio) {
        case 'Pendiente Iniciar':
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${data.servicios[0].estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          break;
        case 'Iniciado':
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${data.servicios[0].estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          break;
        case 'Cancelado':
        case 'Rechazado':
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${data.servicios[0].estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          break;
        case 'Completado':
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${data.servicios[0].estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          break;
        case 'Postulado':
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${data.servicios[0].estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          break;
        case 'Ganador':
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${data.servicios[0].estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          break;
        case 'No Asignada':
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${data.servicios[0].estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          break;
        default:
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-light"><span class="badge-label">${data.servicios[0].estado_servicio}</span></span>`;
      }

      // data.servicios.forEach(item => {});
      // document.getElementById("tipo_servicio_header").innerHTML = data.servicios[0].tipo_servicio;
      // document.getElementById("vehiculo_header").innerHTML = data.servicios[0].Placa;
      // document.getElementById("estado_header").innerHTML = col_estatus_publicacion;
      // document.getElementById("fecha_registro_header").innerHTML = data.servicios[0].Fecha_registro;
      // document.getElementById("fecha_limite_header").innerHTML = data.servicios[0].fecha_limite;

      document.getElementById("tipo_servicio_header").innerHTML = data.servicios[0].tipo_servicio;
      document.getElementById("vehiculo_header").innerHTML = data.servicios[0].vehiculo;
      document.getElementById("estado_header").innerHTML = col_estatus_publicacion;
      document.getElementById("fecha_registro_header").innerHTML = data.servicios[0].Fecha_registro;
      document.getElementById("fecha_limite_header").innerHTML = data.servicios[0].fecha_limite;
      document.getElementById("cedula_header").innerHTML = data.servicios[0].cedula_conductor;
      document.getElementById("conductor_header").innerHTML = data.servicios[0].nombre_conductor;
      document.getElementById("placa_header").innerHTML = data.servicios[0].Placa;
      document.getElementById("inicio_servicio_header").innerHTML = data.servicios[0].Fecha_Inicio;

      Numero_actividades(data.actividades[0]['numdoc']);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      // document.getElementById("bloque_header").innerHTML = `<p class="text-danger">Error al cargar servicios</p>`;
    } finally {
    }
  }

  async function Numero_actividades(nundoc) {
    let data = new FormData();
    data.append('nundoc', nundoc);
    await fetch($('#base_url').val() + 'pedidos/Progreso_pedido', {
      method: 'POST',
      body: data,
      cache: 'no-cache',
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .catch((error) => {
        alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
      })
      .then((response) => {
        var objeto = response.cantidad_actividades;
        var cantidadActividades = objeto.Cantidad_actividades;
        var totalActividades = parseInt(cantidadActividades);
        var porcentajePorActividad = 100 / totalActividades;
        var progresoActual = 0;
        response.estado_actividades.forEach((element) => {
          // console.log(element);
          if (element.estado_actividad === 'COMPLETADO') {
            progresoActual++;
            // totalActividadesCompletas;
          }
        });
        // Calcular el ancho de la barra de progreso
        // var ancho = (progresoActual / totalActividades) * 100;
        var ancho = (100 * progresoActual) / totalActividades;
        // console.log(ancho);
        // Actualizar la barra de progreso
        $('.progress-bar').css('width', ancho + '%');
        // $(".progress-bar").html(ancho.toFixed(2) + "%"); // Redondear el porcentaje a dos decimales
        ancho = Math.round(ancho * 100) / 100; // Redondear a dos decimales
        $('.progress-bar').html(ancho + '%'); // Redondear el porcentaje a dos decimales
      });
  }

  async function Detalles_actividaes(nundoc, actividad_id) {
    let data = new FormData();
    data.append('nundoc', nundoc);
    data.append('actividad', actividad_id);
    await fetch($('#base_url').val() + 'pedidos/ver_detalle_actividad', {
      method: 'POST',
      body: data,
      cache: 'no-cache',
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .catch((error) => {
        alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
      })
      .then((response) => {
        let tbody = document.getElementById('tbl_detalle_gestion' + actividad_id);
        tbody.innerHTML = '';
        if (response.length > 0) {
          response.forEach((element) => {
            setTimeout(() => {
              const fila = document.createElement('tr');
              fila.style.fontSize = '12px';
              const columnaNumero = document.createElement('td');
              columnaNumero.textContent = element.detalle_id;
              columnaNumero.style.textAlign = 'center';
              columnaNumero.style.width = 'auto';
              columnaNumero.style.whiteSpace = 'nowrap';

              const columnaFecha = document.createElement('td');
              columnaFecha.textContent = element.fecha;
              columnaFecha.style.textAlign = 'center';
              columnaFecha.style.width = 'auto';
              columnaFecha.style.whiteSpace = 'nowrap';

              const columnaCostoEstimado = document.createElement('td');
              columnaCostoEstimado.textContent = parseFloat(element.costo_promedio).toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP',
              });
              columnaCostoEstimado.style.textAlign = 'center';
              columnaCostoEstimado.style.width = 'auto';
              columnaCostoEstimado.style.whiteSpace = 'nowrap';

              const columnaCostoActividad = document.createElement('td');
              columnaCostoActividad.textContent = element.costo_actividad
                ? parseFloat(element.costo_actividad).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
                : '-';
              columnaCostoActividad.style.textAlign = 'center';
              columnaCostoActividad.style.width = 'auto';
              columnaCostoActividad.style.whiteSpace = 'nowrap';

              const columnaObservacion = document.createElement('td');
              columnaObservacion.textContent = element.observacion;
              columnaObservacion.style.textAlign = 'center';
              columnaObservacion.style.width = 'auto';
              columnaObservacion.style.whiteSpace = 'nowrap';

              const columnaResponsable = document.createElement('td');
              columnaResponsable.textContent = element.usuario;
              columnaResponsable.style.textAlign = 'center';
              columnaResponsable.style.width = 'auto';
              columnaResponsable.style.whiteSpace = 'nowrap';

              const columnaEvidencia = document.createElement('td');
              if (element.nombre_archivo !== 'Sin_evidencia') {
                columnaEvidencia.innerHTML = `
                <div class="btn-group" role="group" aria-label="...">
                  <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" onclick="abrir_fotos('${element.rutas_documento}' , '${element.nombres_archivo}')"><i class="uil-file-download-alt"></i> Descargar</button>
                </div>
                `;
              } else {
                columnaEvidencia.innerHTML = `<span class="text-primary">Sin evidencia</span>`;
              }
              columnaEvidencia.style.textAlign = 'center';
              columnaEvidencia.style.width = 'auto';
              columnaEvidencia.style.whiteSpace = 'nowrap';

              fila.appendChild(columnaNumero);
              // fila.appendChild(columnaParametro);
              // fila.appendChild(columnaConcepto);
              fila.appendChild(columnaFecha);
              fila.appendChild(columnaCostoEstimado);
              fila.appendChild(columnaCostoActividad);
              fila.appendChild(columnaObservacion);
              fila.appendChild(columnaResponsable);
              // fila.appendChild(columnaPublicado);
              fila.appendChild(columnaEvidencia);
              tbody.appendChild(fila);
            }, 500);
          });
        } else {
          const fila = document.createElement('tr');
          const columnaSindatos = document.createElement('td');
          columnaSindatos.colSpan = 5;
          columnaSindatos.innerHTML = `Actividad del parametro sin Gestión`;
          columnaSindatos.style.textAlign = 'center';
          columnaSindatos.style.width = 'auto';
          columnaSindatos.style.whiteSpace = 'nowrap';

          fila.appendChild(columnaSindatos);
          tbody.appendChild(fila);
        }
      });
  }

  function abrir_fotos(url, name) {
    // URL de la página que deseas abrir en la nueva ventana
    var url = $('#base_url').val() + url + name;
    // Opciones de la ventana emergente (ancho, alto, opciones adicionales)
    var ventanaAncho = 1000;
    var ventanaAlto = 1000;
    // Calcula las coordenadas para centrar la ventana
    var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
    var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
    // Opciones de la ventana emergente (ancho, alto, posición)
    var opcionesVentana =
      'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
    // Utiliza window.open para abrir la nueva ventana
    window.open(url, name, opcionesVentana);
  }

  async function estado_recurso() {
    const filas = document.querySelectorAll('#tbl_administrador_recurso_pedidos tr td:last-child');
    const baseUrl = $('#base_url').val();

    for (const columna of filas) {
      const id = columna.dataset.id;
      if (id) {
        try {
          const formData = new FormData();
          formData.append('RecursoId', id);

          const response = await fetch(`${baseUrl}torrecontrol/estado_recurso`, {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();

          columna.innerHTML = ''; // Limpiar contenido previo

          // Verificar si es un array o un objeto único
          if (Array.isArray(data)) {
            // Si es un array, recorrerlo
            data.forEach((element) => {
              columna.setAttribute('data-razon_social', element.razon_social);
              columna.innerHTML += generarBadge(element);
            });
          } else {
            // Si es un objeto único, solo mostrarlo
            columna.innerHTML = generarBadge(data);
          }
        } catch (error) {
          console.error('Error obteniendo estado recurso:', error);
          columna.innerHTML = '<span class="text-danger">Error</span>';
        }
      }
    }
  }

  // Función auxiliar para generar el badge según el estado
  function generarBadge(element) {
    let badgeClass = 'badge-phoenix-dark'; // Estado por defecto
    let estadoTexto = 'Desconocido';

    switch (element.estado_servicio) {
      case 'Ganador':
        badgeClass = 'badge-phoenix-success';
        estadoTexto = element.estado_servicio;
        break;
      case 'Postulado':
        badgeClass = 'badge-phoenix-warning';
        estadoTexto = element.estado_servicio;
        break;
      case 'Pendiente Iniciar':
        badgeClass = 'badge-phoenix-secondary';
        estadoTexto = element.estado_servicio;
        break;
      case 'No Asignada':
        badgeClass = 'badge-phoenix-danger';
        estadoTexto = element.estado_servicio;
        break;
    }

    return `<span class="badge badge-phoenix fs-10 ${badgeClass}" data-bs-toggle="tooltip" data-bs-placement="top" title="${element.razon_social}">
            <span class="badge-label">${estadoTexto}</span>
          </span>`;
  }

  async function Listar_servicios_especiales_proveedor(ProveedorId, MaestroId, index) {
    let formData = new FormData();
    formData.append('ProveedorId', ProveedorId);
    formData.append('MaestroId', MaestroId);

    try {
      let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_especiales_recursos_proveedor', {
        method: 'POST',
        body: formData,
      });

      let data = await response.json();
      let servicios = '';

      if (data && data.length > 0) {
        servicios = `
        <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="tab-${ProveedorId}" role="tabpanel" aria-labelledby="${ProveedorId}-tab">
          <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle table-sm" style="font-size: 12px;">
              <thead>
                <tr>
                  <th>Tipo servicio</th>
                  <th>Estado</th>
                  <th>Valor</th>
                  <th>Operación</th>
                  <!--<th>Nombre</th>
                  <th>Proveedor</th>-->
                </tr>
              </thead>
              <tbody>
                ${data
            .map(
              (element) => `
                  <tr>
                    <!--<td>${element.servicio_especial}</td>-->
                    <td>${element.nombre}</td>
                    <td>
                      <span class="badge badge-phoenix fs-10 ${element.estado_servicio_especial === 'Activo'
                  ? 'badge-phoenix-primary'
                  : element.estado_servicio_especial === 'Cancelado'
                    ? 'badge-phoenix-danger'
                    : element.estado_servicio_especial === 'Aprobado'
                      ? 'badge-phoenix-success'
                      : element.estado_servicio_especial === 'Rechazado'
                        ? 'badge-phoenix-warning'
                        : 'badge-phoenix-secondary'
                }">
                        ${element.estado_servicio_especial}
                      </span>
                    </td>
                    <td>$${element.valor_servicio.toLocaleString()}</td>
                    <td>
                      <div class="dropdown">
                          <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="uil-list-ui-alt"></span></a>
                          <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">

                            ${element.valor_servicio === 0 ||
                  element.estado_servicio_especial === 'Aprobado' ||
                  element.estado_servicio_especial === 'Rechazado' ||
                  element.estado_servicio_especial === 'Cancelado'
                  ? ''
                  : `<a class="dropdown-item fw-bold" href="#" id="btn_aprobar_servicio_especial" data-proceso="Asignación" data-MaestroId="${MaestroId}" data-servicio="${element.servicio_especial}"   data-proveedorId="${ProveedorId}"><span class="uil uil-transaction"></span> Aprobar</a>`
                }
                            ${element.valor_servicio === 0 ||
                  element.estado_servicio_especial === 'Aprobado' ||
                  element.estado_servicio_especial === 'Rechazado' ||
                  element.estado_servicio_especial === 'Cancelado'
                  ? ''
                  : `<a class="dropdown-item fw-bold" href="#" id="btn_rechazar_servicio_especial" data-proceso="Asignación" data-MaestroId="${MaestroId}" data-servicio="${element.servicio_especial}"   data-proveedorId="${ProveedorId}"><span class="uil uil-transaction"></span> Rechazar</a>`
                }
                            ${element.valor_servicio > 0 || element.estado_servicio_especial === 'Cancelado'
                  ? ''
                  : `<a class="dropdown-item fw-bold" href="#" id="btn_cancelar_servicio_especial" data-proceso="Asignación" data-MaestroId="${MaestroId}" data-servicio="${element.servicio_especial}"   data-proveedorId="${ProveedorId}"><span class="uil uil-transaction"></span> Cancelar</a>`
                }
                          
                          </div>
                        </div>
                      </td>
      
                  </tr>
                `
            )
            .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
      } else {
        servicios = `
        <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="tab-${ProveedorId}" role="tabpanel" aria-labelledby="${ProveedorId}-tab">
          <div class="alert alert-info text-center py-4">
            <i class="bi bi-info-circle-fill fs-3 mb-3"></i>
            <h5 class="alert-heading">No hay servicios registrados</h5>
          </div>
        </div>
      `;
      }

      return servicios;
    } catch (error) {
      console.error('Error:', error);
      return `
      <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="tab-${ProveedorId}" role="tabpanel" aria-labelledby="${ProveedorId}-tab">
        <div class="alert alert-danger text-center py-4">
          <i class="bi bi-exclamation-triangle-fill fs-3 mb-3"></i>
          <h5 class="alert-heading">Error al cargar los servicios</h5>
          <p class="mb-0">Por favor intente nuevamente</p>
        </div>
      </div>
    `;
    }
  }

  function traer_servicio_especial() {
    $(`#list_servicio_especial2`).html('');
    $.ajax({
      url: $('#base_url').val() + 'torrecontrol/traer_servicio_especial',
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        //traer el tipo de vehiculo
        $(`#list_servicio_especial2`).append('<option value="">Seleccione</option>');
        data.forEach(function (element, index1) {
          $(`#list_servicio_especial2`).append(
            '<option value="' + element.id + '" style="width: 100%;font-size: 10px;"   >' + element.nombre + '</option>'
          );
        });
        // Inicializar los selects con Select2
        $(`#list_servicio_especial2`).select2({
          placeholder: 'Seleccione una opción',
          allowClear: true,
          width: '100%',
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('no entro ');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }

  function traer_proveedor_torre_control() {
    const $select = $('#nuevo_proveedor');

    // Limpiar opciones
    $select.empty().append('<option value="">Seleccione</option>');

    $.ajax({
      url: $('#base_url').val() + 'torrecontrol/ListaProveedores',
      type: 'POST',
      dataType: 'json',
      success: function (data) {

        data.forEach(function (element) {
          $select.append(
            `<option value="${element.id}">
                        ${element.razon_social}
                     </option>`
          );
        });

        // 🔴 Destruir Select2 si ya estaba inicializado
        if ($select.hasClass('select2-hidden-accessible')) {
          $select.select2('destroy');
        }

        // ✅ Inicializar Select2 dentro del modal CORRECTO
        $select.select2({
          placeholder: 'Seleccione una opción',
          allowClear: true,
          width: '100%',
          dropdownParent: $('#ReasignarProveedorModal')
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error('Error cargando proveedores', errorThrown);
      }
    });
  }
})();