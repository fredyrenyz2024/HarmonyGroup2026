window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global

  const containerId = `customOffcanvas${id}`;
  if (!document.getElementById(containerId)) {
    const container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }

  // Crear instancia
  // Usar una variable global o una propiedad en el objeto window
  if (!window.myOffcanvas) {
    window.myOffcanvas = new DynamicOffcanvas({
      id: `customOffcanvas${id}`,
      title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
      content: '<p>Contenido inicial</p>',
      // class: 'offcanvas-bottom',
      scroll: true,
      backdrop: false
    });
  } else {
    console.log('El offcanvas ya está creado.');
  }

  const hoy = new Date();
  const opciones = { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" };

  // Formatear la fecha a "YYYY-MM-DD"
  const fechaColombia = new Intl.DateTimeFormat("es-CO", opciones)
    .format(hoy)
    .split("/")
    .reverse()
    .join("-");

  listar_recursos_administrador(fechaColombia, fechaColombia);

  document.addEventListener("click", async (e) => {
    if (e.target.matches(`#campo-${window.VENTANA}-buscar`) || e.target.matches(`#campo-${window.VENTANA}-buscar *`)) {
      let fechaInicio = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value.trim();
      let fechaFinal = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value.trim();
      listar_recursos_administrador(fechaInicio, fechaFinal);
    }

    if (e.target.matches("#btn_detalle_proceso_servicio") || e.target.matches("#btn_detalle_proceso_servicio *")) {
      let Enlace = e.target.closest("#btn_detalle_proceso_servicio");
      let MaestroId = Enlace.getAttribute("data-id");
      let ClienteId = Enlace.getAttribute("data-clienteId");
      let Proceso = Enlace.getAttribute("data-proceso");
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
              <!--<div class="accordion mt-0" id="accordionExample2">
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
              </div>-->
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

          </div>
      `);

      traer_servicio_especial();
      Listar_pedidos_recursos(MaestroId, window.VENTANA, Proceso, ClienteId);
      myOffcanvas.updateClass('offcanvas-end');
      myOffcanvas.updateHeight('100vh');
      myOffcanvas.updateWidth('70%');
      myOffcanvas.show();
    }


    if (e.target.matches("#btn_gestion_pedido") || e.target.matches("#btn_gestion_pedido *")) {
      let MaestroId = e.target.getAttribute("data-id");
      //offcanvas-bottom
      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Gestion Pedido N°` + MaestroId);
      myOffcanvas.updateContent(`
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

      setTimeout(() => {
        Listar_actividades_pedido(MaestroId);
      }, 50);

      myOffcanvas.updateHeight('100vh');
      myOffcanvas.updateWidth('100%');
      myOffcanvas.updateClass('offcanvas-bottom');
      myOffcanvas.show();
    }

    let Boton_cancelar;
    let Boton_guardar_gestion;
    // let Boton_detalle_actividad;
    // if (e.target.matches('#btn_gestion_actividad') || e.target.matches('#btn_gestion_actividad *')) {
    //   var padre = e.target.parentElement.parentElement;
    //   var Procesos = padre.querySelector('#btn_gestion_actividad');
    //   var proceso_id = Procesos.getAttribute('data-idproceso');
    //   var actividad_id = Procesos.getAttribute('data-idactividad');
    //   // console.log("Proceso: " + proceso_id + " Actividad: " + actividad_id);
    //   var form_gestio = document.getElementById(`proceso_numero${actividad_id}`);
    //   var numero_proceso = form_gestio.getAttribute('data-idnum_proceso');
    //   // console.log("Numero de proceso del formulario: " + numero_proceso);
    //   Boton_cancelar = document.getElementById(`btn_cancelar_gestion${actividad_id}`);
    //   Boton_guardar_gestion = document.getElementById(`btn_guardar_gestion${actividad_id}`);
    //   // Boton_detalle_actividad = document.getElementById(`btn_guardar_gestion${actividad_id}`);

    //   if (actividad_id === numero_proceso) {
    //     document.getElementById(`columnaproceso${numero_proceso}`).style.display = document.getElementById(`columnaproceso${numero_proceso}`).style.display === 'none' ? 'table-row' : 'none';
    //     Boton_cancelar.addEventListener('click', async e => {
    //       document.getElementById(`columnaproceso${numero_proceso}`).style.display = 'none';
    //     });
    //     Boton_guardar_gestion.addEventListener('click', async e => {
    //       let PedidoId = Boton_guardar_gestion.getAttribute('data-PedidoId');
    //       let MaestroId = Boton_guardar_gestion.getAttribute('data-MaestroId');

    //       if (document.getElementById('estado_actividad' + actividad_id).value === '') {
    //         mensaje = `
    //         <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
    //           <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
    //             <strong>Mensaje!</strong> <p class="mb-0 flex-1"> Debe seleccionar un estado para este pedido</p>
    //           <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
    //         </div>
    //         `;
    //         document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
    //       } else if (document.getElementById('observacion_gestion' + actividad_id).value === '') {
    //         mensaje = `
    //         <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
    //           <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
    //             <strong>Mensaje!</strong> <p class="mb-0 flex-1"> Debe diligenciar una obsrvación  para poder gaurdar la gestión</p>
    //           <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
    //         </div>`;
    //         document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
    //         document.getElementById('observacion_gestion' + actividad_id).focus();
    //       } else {
    //         const result = await Swal.fire({
    //           title: "Seguro",
    //           text: "¿Desea realizar la operación de gestión?",
    //           icon: "question",
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
    //           let data = new FormData();
    //           data.append('nundoc', PedidoId);
    //           data.append('parametros_pedido', document.getElementById('parametros_pedido' + actividad_id).value);
    //           data.append('parametros_punto_pedido_opcion', document.getElementById('parametros_punto_pedido_opcion' + actividad_id).value);
    //           data.append('observacion', document.getElementById('observacion_gestion' + actividad_id).value);
    //           data.append('estado_actividad', document.getElementById('estado_actividad' + actividad_id).value);
    //           var documentos = document.getElementById('documento' + actividad_id).files[0];
    //           if (documentos !== undefined) {
    //             data.append('documento', documentos);
    //           } else {
    //             data.append('documento', 'Sin_evidencia');
    //           }
    //           // data.append("documento", document.getElementById("documento").files[0]);
    //           // var publicar = document.getElementById('publicar' + actividad_id);
    //           // if (publicar.checked) {
    //           //   data.append('publicar', 'SI');
    //           // } else {
    //           //   data.append('publicar', 'NO');
    //           // }
    //           data.append('publicar', 'NO');
    //           await fetch($('#base_url').val() + 'torrecontrol/Insertar_gestion_pedido', {
    //             method: 'POST',
    //             body: data,
    //             cache: 'no-cache',
    //           })
    //             .then(res => (res.ok ? res.json() : Promise.reject(res)))
    //             .catch(error => {
    //               alert(JSON.stringify(error.length) || 'Error al cargar las solicitudes');
    //             })
    //             .then(response => {
    //               if (response.numero === 200) {
    //                 mensaje = `
    //                 <div class="alert alert-outline-success d-flex align-items-center" role="alert">
    //                   <span class="fas fa-check-circle text-success fs-5 me-3"></span>
    //                   <strong>Mensaje!</strong> <p class="mb-0 flex-1">${response.mensaje}</p>
    //                   <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
    //                 </div>`;
    //                 // Numero_actividades(PedidoId);
    //               } else {
    //                 mensaje = `
    //                   <div class="alert alert-outline-danger d-flex align-items-center" role="alert">
    //                     <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
    //                       <strong>Mensaje!</strong> <p class="mb-0 flex-1">${response.mensaje}</p>
    //                     <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
    //                   </div>`;
    //               }
    //               setTimeout(function () {
    //                 // location.reload(false);
    //                 Listar_actividades_pedido(MaestroId);
    //                 // Numero_actividades(PedidoId);
    //                 document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
    //               }, 1500);
    //             });
    //         }
    //       }
    //     });
    //   }
    // }

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
      Select_Estado_Actividad.addEventListener('change', async e => {
        if (Select_Estado_Actividad.value === 'COMPLETADO') {
          document.getElementById(`costo_ejecutado${actividad_id}`).disabled = false;
          document.getElementById(`costo_ejecutado${actividad_id}`).value = '';
        } else {
          document.getElementById(`costo_ejecutado${actividad_id}`).disabled = true;
          document.getElementById(`costo_ejecutado${actividad_id}`).value = '';
        }
      });

      if (actividad_id === numero_proceso) {
        document.getElementById(`columnaproceso${numero_proceso}`).style.display = document.getElementById(`columnaproceso${numero_proceso}`).style.display === 'none' ? 'table-row' : 'none';
        Boton_cancelar.addEventListener('click', async e => {
          document.getElementById(`columnaproceso${numero_proceso}`).style.display = 'none';
        });
        Boton_guardar_gestion.addEventListener('click', async e => {
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
              title: "Seguro",
              text: "¿Desea realizar la operación de gestión?",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#3B71CA",
              cancelButtonColor: "#9FA6B2",
              confirmButtonText: "Aceptar",
              cancelButtonText: "Cancelar",
              customClass: {
                popup: "swal2-custom-font",
              },
            });

            if (result.isConfirmed) {
              let data = new FormData();
              data.append('nundoc', PedidoId);
              data.append('parametros_pedido', document.getElementById('parametros_pedido' + actividad_id).value);
              data.append('parametros_punto_pedido_opcion', document.getElementById('parametros_punto_pedido_opcion' + actividad_id).value);
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
                .then(res => (res.ok ? res.json() : Promise.reject(res)))
                .catch(error => {
                  alert(JSON.stringify(error.length) || 'Error al cargar las solicitudes');
                })
                .then(response => {
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
        document.getElementById(`columnadetalleactividad${numero_proceso}`).style.display = document.getElementById(`columnadetalleactividad${numero_proceso}`).style.display === 'none' ? 'table-row' : 'none';
        Detalles_actividaes(PedidoId, actividad_id);
        // Boton_cerrar_detalle.addEventListener('click', async e => {
        //   document.getElementById(`columnadetalleactividad${numero_proceso}`).style.display = 'none';
        // });
      }
    }

  });

  document.addEventListener('change', async e => {
    if (e.target.matches(`#campo-${window.VENTANA}-modalidad`) || e.target.matches(`#campo-${window.VENTANA}-modalidad *`)) {
      let valor = document.getElementById(`campo-${window.VENTANA}-modalidad`).value.trim();
      let fechaInicio = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value.trim();
      let fechaFinal = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value.trim();
      listar_recursos_administrador(fechaInicio, fechaFinal, valor);
    }
  });

  async function listar_recursos_administrador(fecha_inicial, fecha_final, valor) {
    /* Funcion para enviar los datos */
    let dato = new FormData();
    dato.append('fecha_inicial', fecha_inicial);
    dato.append('fecha_final', fecha_final);
    dato.append('valor', valor === 'undefined' ? '' : document.getElementById(`campo-${window.VENTANA}-modalidad`).value.trim());

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
        let btn_removeAsignacion = "";

        data.forEach(element => {
          const fila = document.createElement('tr');

          let estados_recurso_html = '';
          let estados = element.estados_recurso.split(',').map(e => e.trim());

          estados.forEach(estado => {
            let badgeClass = 'badge-phoenix-secondary'; // Por defecto

            if (estado === 'Pendiente Iniciar') {
              badgeClass = 'badge-phoenix-secondary';
              btn_removeAsignacion = `
              <a class="dropdown-item fw-bold" href="#" id="btn_cancelar_asignacion"
                data-id="${element.maestro_id}">
                <span class="uil-wrap-text"></span> Cancelar Asignación de pedido
              </a>`;
            } else if (estado === 'Iniciado') {
              badgeClass = 'badge-phoenix-info';
              btn_removeAsignacion = ``;
            } else if (estado === 'Completado') {
              badgeClass = 'badge-phoenix-success';
              btn_removeAsignacion = ``;
            } else if (estado === 'Cancelado') {
              badgeClass = 'badge-phoenix-danger';
              btn_removeAsignacion = ``;
            } else if (estado === 'Rechazado') {
              badgeClass = 'badge-phoenix-warning';
              btn_removeAsignacion = ``;
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
              <a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-clienteId="${element.clienteId}"><span class="uil uil-transaction"></span> Detalle Proceso</a>
              <!--${btn_removeAsignacion}-->
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
          columnaProceso.innerHTML = element.proceso === 'Asignación' ? `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.proceso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>` : `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">${element.proceso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
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

  async function estado_recurso() {
    const filas = document.querySelectorAll("#tbl_administrador_recurso_pedidos tr td:last-child");
    const baseUrl = $('#base_url').val();

    for (const columna of filas) {
      const id = columna.dataset.id;
      if (id) {
        try {
          const formData = new FormData();
          formData.append('RecursoId', id);

          const response = await fetch(`${baseUrl}torrecontrol/estado_recurso`, {
            method: 'POST',
            body: formData
          });

          const data = await response.json();
          // console.log("🚀 ~ estado_recurso ~ data:",  data)

          columna.innerHTML = ''; // Limpiar contenido previo

          // Verificar si es un array o un objeto único
          if (Array.isArray(data)) {
            // Si es un array, recorrerlo
            data.forEach(element => {
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


  function generarBadge(element) {
    let badgeClass = "badge-phoenix-dark"; // Estado por defecto
    let estadoTexto = "Desconocido";

    switch (element.estado_servicio) {
      case 'Ganador':
        badgeClass = "badge-phoenix-success";
        estadoTexto = element.estado_servicio;
        break;
      case 'Postulado':
        badgeClass = "badge-phoenix-warning";
        estadoTexto = element.estado_servicio;
        break;
      case 'Pendiente Iniciar':
        badgeClass = "badge-phoenix-secondary";
        estadoTexto = element.estado_servicio;
        break;
      case 'No Asignada':
        badgeClass = "badge-phoenix-danger";
        estadoTexto = element.estado_servicio;
        break;
    }

    return `<span class="badge badge-phoenix fs-10 ${badgeClass}" data-bs-toggle="tooltip" data-bs-placement="top" title="${element.razon_social}">
              <span class="badge-label">${estadoTexto}</span>
            </span>`;
  }

  async function Listar_actividades_pedido(MaestroId) {
    try {
      let formData = new FormData();
      formData.append("RecursoId", MaestroId);

      let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_actividades_gestion', {
        method: "POST",
        body: formData,
        cache: 'no-cache',
      });

      let data = await response.json();
      let tbody = document.getElementById('tbody_actividades');
      let usuario = document.getElementById('id_usuario').value;
      let CriterioCalculo = "";
      tbody.innerHTML = '';
      data.forEach(element => {
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

        // const columnaCostoActividad = document.createElement('td');
        // if (element.costo_actividad === null) {
        //   columnaCostoActividad.innerHTML = `<input type="number" class="form-control form-control-sm costo_actividad text-center" id="costo_actividad${element.actividad_id}">`;
        // } else {
        //   columnaCostoActividad.innerHTML = `<input type="number" class="form-control form-control-sm costo_actividad text-center" id="costo_actividad${element.actividad_id}" value="${element.costo_actividad}">`;
        // }
        // columnaCostoActividad.style.textAlign = 'center';
        // columnaCostoActividad.style.width = 'auto';
        // columnaCostoActividad.style.whiteSpace = 'nowrap';

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

        if (element.estado_actividad === 'SIN INICIAR' || element.estado_actividad === 'EN GESTION' || element.estado_actividad === 'PAUSADO' || element.estado_actividad === 'VENCIDO') {
          // Verificamos si la actividad actual tiene una actividad dependiente completada
          if (element.actividad_dependiente !== null) {
            // Buscamos la actividad dependiente y verificamos su estado
            const actividadDependiente = data.find(act => act.actividad_id === element.actividad_dependiente);
            if (actividadDependiente && actividadDependiente.estado_actividad === 'COMPLETADO') {
              // Si la actividad dependiente está completada, desbloqueamos la actividad actual
              if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
                columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                  <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                </div>`;
              } else {
                if (element.estado_visualizar === 'VISUALIZADOR') {
                  columnaAcciones.innerHTML = `
                  <div class="btn-group btn-group-sm" role="group" aria-label="...">
                    <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                  </div>`;
                } else {
                  columnaAcciones.innerHTML = `
                  <div class="btn-group btn-group-sm" role="group" aria-label="...">
                    <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-comment-alt-message"></i> Gestionar</button>
                    <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                  </div>`;
                }
              }
            } else {
              // Si no está completada, dejamos la actividad bloqueada
              if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
                columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                  <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                </div>`;
              } else {
                if (element.estado_visualizar === 'VISUALIZADOR') {
                  columnaAcciones.innerHTML = `
                  <div class="btn-group btn-group-sm" role="group" aria-label="...">
                    <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                  </div>`;
                } else {
                  columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                  <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}" disabled><i class="uil-comment-alt-message"></i> Gestionar</button>
                  <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                 
                </div>`;
                }
              }
            }
          } else {
            // Si no tiene dependencia, se puede gestionar sin restricciones
            if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
              columnaAcciones.innerHTML = `
              <div class="btn-group btn-group-sm" role="group" aria-label="...">
                <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
              </div>`;
            } else {
              if (element.estado_visualizar === 'VISUALIZADOR') {
                columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                  <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                </div>`;
              } else {
                columnaAcciones.innerHTML = `
              <div class="btn-group btn-group-sm" role="group" aria-label="...">
                <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-comment-alt-message"></i> Gestionar</button>
                <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
              </div>`;
              }
            }
          }
        } else if (element.estado_actividad === 'COMPLETADO' || element.estado_actividad === 'CANCELADO') {
          // Si la actividad ya está completada o cancelada
          if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
            columnaAcciones.innerHTML = `
            <div class="btn-group btn-group-sm" role="group" aria-label="...">
              <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
            </div>`;
          } else {
            columnaAcciones.innerHTML = `
            <div class="btn-group btn-group-sm" role="group" aria-label="...">
              <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
            </div>`;
          }
        }

        const fila2 = document.createElement('tr');
        fila2.style.display = 'none';
        fila2.setAttribute('id', `columnaproceso${element.actividad_id}`);

        const columnaFormulario = document.createElement('td');

        columnaFormulario.setAttribute('id', `celdaproceso${element.actividad_id}`);
        columnaFormulario.setAttribute('colspan', 11);
        columnaFormulario.style.backgroundColor = "#f1f2f4";

        columnaFormulario.innerHTML = `
          <div id="proceso_numero${element.num_proceso}" style="padding:1px 1px 1px;" data-idnum_proceso="${element.num_proceso}" class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
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
                  <textarea name="observacion_gestion" id="observacion_gestion${element.actividad_id}" cols="30" rows="2" oninput="this.value = this.value.toUpperCase();"
                    class="form-control form-control-sm"></textarea>
                </div>
              </div>

              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex justify-content-end my-2">
                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                  <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1" style="margin-right:5px;" id="btn_cancelar_gestion${element.actividad_id}"><i class="fas fa-times"></i> Cancelar</button>
                  <button type="button" class="btn btn-success btn-sm me-1 px-1 py-1" id="btn_guardar_gestion${element.actividad_id}" data-PedidoId="${data[0]['numdoc']}" data-MaestroId="${MaestroId}"><i class="far fa-save"></i> Guardar</button>
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
          // CriterioCalculo = `Fecha actividad dependiente`+' ('+element.nombre_actividad_dependiente+')';
          CriterioCalculo = `Fecha actividad dependiente`;
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
      Numero_actividades(data[0]['numdoc']);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      // document.getElementById("bloque_header").innerHTML = `<p class="text-danger">Error al cargar servicios</p>`;
    } finally { }
  }

  async function Numero_actividades(nundoc) {
    let data = new FormData();
    data.append('nundoc', nundoc);
    await fetch($('#base_url').val() + 'pedidos/Progreso_pedido', {
      method: 'POST',
      body: data,
      cache: 'no-cache',
    })
      .then(res => (res.ok ? res.json() : Promise.reject(res)))
      .catch(error => {
        alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
      })
      .then(response => {
        var objeto = response.cantidad_actividades;
        var cantidadActividades = objeto.Cantidad_actividades;
        var totalActividades = parseInt(cantidadActividades);
        var porcentajePorActividad = 100 / totalActividades;
        var progresoActual = 0;
        response.estado_actividades.forEach(element => {
          // console.log(element);
          if (element.estado_actividad === 'COMPLETADO') {
            progresoActual++;
            // totalActividadesCompletas;
          }
        });
        // Calcular el ancho de la barra de progreso
        // var ancho = (progresoActual / totalActividades) * 100;
        var ancho = 100 * progresoActual / totalActividades;
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
      .then(res => (res.ok ? res.json() : Promise.reject(res)))
      .catch(error => {
        alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
      })
      .then(response => {
        let tbody = document.getElementById('tbl_detalle_gestion' + actividad_id);
        tbody.innerHTML = '';
        if (response.length > 0) {
          response.forEach(element => {
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
              columnaCostoEstimado.textContent = parseFloat(element.costo_promedio).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
              columnaCostoEstimado.style.textAlign = 'center';
              columnaCostoEstimado.style.width = 'auto';
              columnaCostoEstimado.style.whiteSpace = 'nowrap';

              const columnaCostoActividad = document.createElement('td');
              columnaCostoActividad.textContent = element.costo_actividad ? parseFloat(element.costo_actividad).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : '-';
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
                  <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" onclick="abrir_fotos('${element.documento}' , '${element.nombre_archivo}')"><i class="uil-file-download-alt"></i> Descargar</button>
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

  async function Listar_pedidos_recursos(MaestroId, VentanaId, Proceso, ClienteId) {
    try {
      let formData = new FormData();
      formData.append("MaestroId", MaestroId);
      formData.append("VentanaId", VentanaId);

      let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_recursos', {
        method: "POST",
        body: formData
      });

      let data = await response.json();
      if (data) {
        let miArray = [];
        let ArrayRefPedidos = [];

        let rows = "";
        let totalPesoNeto = 0;
        let totalPesoBruto = 0;
        let totalUnidades = 0;
        let col_estatus_publicacion = '';

        document.getElementById("tbody_subasta_resultados").innerHTML = '';
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
        document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = rows;
        const modalidad_pedido = data.sql.length > 0 ? data.sql[0].modalidad : null;
        Listar_servicios_por_proveedor(MaestroId, VentanaId, Proceso, miArray, ClienteId, ArrayRefPedidos, modalidad_pedido);
        // document.getElementById("btn_guardar_se").setAttribute("data-solicitudesId", miArray);

        /* LLenar tabla de subasta */
        if (data.resultados.length > 0) {
          let rows_Subasta = "";
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
          document.getElementById("tbody_subasta_resultados").innerHTML = rows_Subasta;
        } else {
          document.getElementById("tbody_subasta_resultados").innerHTML = `<tr><td colspan="8" class="text-center text-danger">No hay datos para mostrar</td></tr>`;
        }

        let rows_Servicios = "";
        let tabHeaders = "";

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
        document.getElementById("observacion_recurso").innerHTML = data.sql[0].observacion;
      } else {
        document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">No hay datos para mostrar</td></tr>`;
      }
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
    }
  }

  async function Listar_servicios_por_proveedor(MaestroId, VentanaId, Proceso, miArray, ClienteId, ArrayRefPedidos, modalidad_pedido) {
    try {
      let formData = new FormData();
      formData.append("RecursoId", MaestroId);
      formData.append("VentanaId", VentanaId);

      let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_recursos_proveedor', {
        method: "POST",
        body: formData
      });

      let data = await response.json();
      if (data) {
        // Agrupar por razon_social (proveedor)
        const getBadgeClass = (estado) => {
          switch (estado) {
            case 'Pendiente Iniciar': return 'badge-phoenix fs-10 badge-phoenix-secondary';
            case 'Iniciado': return 'badge-phoenix fs-10 badge-phoenix-info';
            case 'Cancelado': return 'badge-phoenix fs-10 badge-phoenix-danger';
            case 'Rechazado': return 'badge-phoenix fs-10 badge-phoenix-danger';
            case 'Completado': return 'badge-phoenix fs-10 badge-phoenix-success';
            case 'Postulado': return 'badge-phoenix fs-10 badge-phoenix-warning';
            case 'Ganador': return 'badge-phoenix fs-10 badge-phoenix-success';
            case 'No Asignada': return 'badge-phoenix fs-10 badge-phoenix-danger';
            default: return 'badge-secondary';
          }
        };

        const groupedByProvider = data.reduce((acc, current) => {
          const key = current.razon_social;

          if (!acc[key]) {
            acc[key] = {
              proveedor: current.razon_social,
              estado_servicio: `<span class="badge ${getBadgeClass(current.estado_servicio)}"><span class="badge-label">${current.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`,
              estado_recurso: `<span class="badge ${getBadgeClass(current.estado_recurso)}"><span class="badge-label">${current.estado_recurso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`,
              servicios: []
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

          const ServiciosTot = proveedor.servicios.filter(servicio => servicio.estado !== 'Postulado');
          arrayServicios_1.push(ServiciosTot.map(servicio => servicio.servicioId));
          // document.getElementById("btn_guardar_se").setAttribute("data-serviciosId",arrayServicios_1);

          arrayproveedor_1.push(ServiciosTot.map(servicio => servicio.ProveedorId));
          // document.getElementById("btn_guardar_se").setAttribute("data-proveedorId",arrayproveedor_1);

          // Obtener los servicios postulados
          const serviciosPostulados = proveedor.servicios.filter(servicio => servicio.estado === 'Postulado');

          // Obtener solo los IDs de los servicios postulados
          const arrayServicios = serviciosPostulados.map(servicio => servicio.servicioId);
          const arrayProveedores = serviciosPostulados.map(servicio => servicio.ProveedorId);
          const arrayValoresServicio = serviciosPostulados.map(servicio => servicio.Valor_Servicio);
          const arrayFechaInicio = serviciosPostulados.map(servicio => servicio.Fecha_Inicio);
          const arrayFechaActualizacion = serviciosPostulados.map(servicio => servicio.Fecha_Actualizacion);
          const arrayPlaca = serviciosPostulados.map(servicio => servicio.Placa);

          // Mostrar el botón si hay al menos un servicio postulado
          if (arrayServicios.length > 0) {
            if (Proceso === 'Asignación') {
              document.getElementById('btn_asignar_recurso').style.display = '';
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
            } else {
              document.getElementById('btn_subastar_recurso').style.display = '';
              document.getElementById('slct_criterio').style.display = '';
              document.getElementById('btn_subastar_recurso').setAttribute('data-MaestroId', MaestroId);
              document.getElementById('btn_subastar_recurso').setAttribute('data-ClienteId', ClienteId);
              document.getElementById('btn_subastar_recurso').setAttribute('data-Modalidad', modalidad_pedido);
              document.getElementById('btn_subastar_recurso').setAttribute('data-ReferenciaPedidos', JSON.stringify(ArrayRefPedidos));
            }
          }

          const serviciosHTML = proveedor.servicios.map(servicio => {
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
                <small class="text-muted">${servicio.Placa ? `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${servicio.Placa}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>` : 'No Aplica'}</small>
              </div>
              <div class="col-3">
                <small class="text-muted">Valor Servicio: ${servicio.Valor_Servicio ? servicio.Valor_Servicio : 0.00}</small>
              </div>
              <div class="col-3">
                <small class="text-muted">Inicio de servicio: ${servicio.Fecha_Inicio ? servicio.Fecha_Inicio : '0000-00-00'}</small>
              </div>
            </div>
            <hr class="my-1 text-dark">
          `;
          }).join('');

          /* Datos de la operacion */
          const OperacionesHTML = proveedor.servicios.map(operacion => {
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
          }).join('');

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
          <div id="collapse${index}" class="accordion-collapse collapse" 
              aria-labelledby="heading${index}" 
              data-bs-parent="#accordionExample">
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
        document.getElementById("bloque_header").innerHTML = `<p class="text-danger">${data.message}</p>`;
      }
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      document.getElementById("bloque_header").innerHTML = `<p class="text-danger">Error al cargar servicios</p>`;
    }
  }

  async function Listar_servicios_especiales_proveedor(ProveedorId, MaestroId, index) {
    let formData = new FormData();
    formData.append('ProveedorId', ProveedorId);
    formData.append('MaestroId', MaestroId);

    try {
      let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_especiales_recursos_proveedor', {
        method: "POST",
        body: formData
      });

      let data = await response.json();
      let servicios = "";

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
                ${data.map(element => `
                  <tr>
                    <!--<td>${element.servicio_especial}</td>-->
                    <td>${element.nombre}</td>
                    <td>
                      <span class="badge badge-phoenix fs-10 ${element.estado_servicio_especial === 'Activo' ? 'badge-phoenix-primary' : element.estado_servicio_especial === 'Cancelado' ? 'badge-phoenix-danger' : element.estado_servicio_especial === 'Aprobado' ? 'badge-phoenix-success' : element.estado_servicio_especial === 'Rechazado' ? 'badge-phoenix-warning' : 'badge-phoenix-secondary'}">
                        ${element.estado_servicio_especial}
                      </span>
                    </td>
                    <td>$${element.valor_servicio.toLocaleString()}</td>
                    <td>
                      <div class="dropdown">
                          <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="uil-list-ui-alt"></span></a>
                          <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">

                            ${element.valor_servicio === 0 || element.estado_servicio_especial === "Aprobado" || element.estado_servicio_especial === "Rechazado" || element.estado_servicio_especial === "Cancelado" ? '' : `<a class="dropdown-item fw-bold" href="#" id="btn_aprobar_servicio_especial" data-proceso="Asignación" data-MaestroId="${MaestroId}" data-servicio="${element.servicio_especial}"   data-proveedorId="${ProveedorId}"><span class="uil uil-transaction"></span> Aprobar</a>`}
                            ${element.valor_servicio === 0 || element.estado_servicio_especial === "Aprobado" || element.estado_servicio_especial === "Rechazado" || element.estado_servicio_especial === "Cancelado" ? '' : `<a class="dropdown-item fw-bold" href="#" id="btn_rechazar_servicio_especial" data-proceso="Asignación" data-MaestroId="${MaestroId}" data-servicio="${element.servicio_especial}"   data-proveedorId="${ProveedorId}"><span class="uil uil-transaction"></span> Rechazar</a>`}
                            ${element.valor_servicio > 0 || element.estado_servicio_especial === "Cancelado" ? '' : `<a class="dropdown-item fw-bold" href="#" id="btn_cancelar_servicio_especial" data-proceso="Asignación" data-MaestroId="${MaestroId}" data-servicio="${element.servicio_especial}"   data-proveedorId="${ProveedorId}"><span class="uil uil-transaction"></span> Cancelar</a>`}
                          
                          </div>
                        </div>
                      </td>
      
                  </tr>
                `).join('')}
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
          $(`#list_servicio_especial2`).append('<option value="' + element.id + '" style="width: 100%;font-size: 10px;"   >' + element.nombre + '</option>');
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
  var opcionesVentana = 'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
  // Utiliza window.open para abrir la nueva ventana
  window.open(url, name, opcionesVentana);
}