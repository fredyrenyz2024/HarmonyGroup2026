window.VENTANA = null; // Variable global para almacenar el ID
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

  listar_pedidos_pendientes();

  document.addEventListener('click', async (e) => {
    if (e.target.matches('#btn_detalle_proceso_servicio') || e.target.matches('#btn_detalle_proceso_servicio *')) {
      let Enlace = e.target.closest('#btn_detalle_proceso_servicio');
      let MaestroId = Enlace.getAttribute('data-id');
      let ClienteId = Enlace.getAttribute('data-clienteId');
      let Proceso = Enlace.getAttribute('data-proceso');
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
                  <!--<div class="col-5">
                    <div class="row justify-content-end">
                      <div class="col-auto">
                        <button class="btn btn-danger btn-sm py-1" id="btn_cancelar_recurso" type="button"> 
                          <span class="uil uil-x"></span>      Servicios
                        </button>
                        <button class="btn btn-success btn-sm py-1" id="btn_subastar_recurso" type="button" style="display: none;"> 
                          <span class="uil uil-play-circle"></span> Subastar Servicios
                        </button>
                        <button class="btn btn-success btn-sm py-1" id="btn_asignar_recurso" type="button" style="display: none;"> 
                          <span class="uil uil-play-circle"></span> Asignar Servicios
                        </button>
                      </div>
                    </div>
                  </div>-->
                  <div class="col-5">
                    <div class="row justify-content-end">
                      <div class="col-auto">
                        <button class="btn btn-danger btn-sm py-1" id="btn_ediatr_recurso_gestion" type="button" style="display: none;"> 
                          <span class="uil uil-x"></span> Editar Recurso
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
                        <select name="cumplimiento" id="cumplimiento" class="form-select form-select-sm" disabled>
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

    if (e.target.matches(`#btn_cancelar_servicio_especial_pendiente`) || e.target.matches(`#btn_cancelar_servicio_especial_pendiente *`)) {
      let boton = e.target.closest('#btn_cancelar_servicio_especial_pendiente'); // Capturamos el botón real
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

    if (e.target.matches(`#btn_rechazar_servicio_especial_pendiente`) || e.target.matches(`#btn_rechazar_servicio_especial_pendiente *`)) {
      let boton = e.target.closest('#btn_rechazar_servicio_especial_pendiente'); // Capturamos el botón real
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

    if (e.target.matches(`#btn_aprobar_servicio_especial_pendiente`) || e.target.matches(`#btn_aprobar_servicio_especial_pendiente *`)) {
      let boton = e.target.closest('#btn_aprobar_servicio_especial_pendiente'); // Capturamos el botón real
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

    //Editar Datos del pedidos ganador
    // if (e.target.matches(`#btn_edit_datos`) || e.target.matches(`#btn_edit_datos *`)) {
    //   let boton = e.target.closest('#btn_edit_datos'); // Capturamos el botón real
    //   let RecursoId = boton.getAttribute('data-RecursoId');
    //   // console.log("🚀 ~ document.addEventListener ~ RecursoId:", RecursoId);
    //   document.getElementById('btn_acciones_edit_datos').style.display = '';
    //   document.getElementById('bloque_carga_liquida').style.display = '';
    //   document.getElementById('bloque_datos_servicio').style.display = '';
    //   try {
    //     const formdata = new FormData();
    //     formdata.append('RecursoId', RecursoId);

    //     const response = await fetch($('#base_url').val() + 'torrecontrol/editar_datos_recurso', {
    //       method: 'POST',
    //       body: formdata,
    //       cache: 'no-cache',
    //     });
    //     const data = await response.json();
    //     if (data) {
    //       // Mostrar los datos en un modal o formulario
    //       document.getElementById('valor_servicio').value = data.valor_servicio;
    //       document.getElementById('cedula_conductor').value = data.cedula_conductor;
    //       document.getElementById('nombre_conductor').value = data.nombre_conductor;
    //       document.getElementById('placa').value = data.referencia;
    //       document.getElementById('capacidad_vehiculo').value = data.capacidad;
    //       document.getElementById('tiempo_libre').value = data.tiempo_libre;
    //       document.getElementById('stand_bay').value = data.stand_bay;
    //       document.getElementById('cumplimiento').value = data.cumplimiento;
    //       document.getElementById('contenedor').value = data.contenedor;
    //       document.getElementById('tara').value = data.tara;
    //     }
    //   } catch (error) {
    //     console.error('Error al editar datos del pedido:', error);
    //     await Swal.fire({
    //       title: 'Error inesperado',
    //       text: 'Ocurrió un error al intentar editar los datos del pedido.',
    //       icon: 'error',
    //       confirmButtonColor: '#3B71CA',
    //       customClass: {
    //         popup: 'swal2-custom-font',
    //       },
    //     });
    //   }
    // }

    if (e.target.matches(`#btn_edit_recursos_rechazado`) || e.target.matches(`#btn_edit_recursos_rechazado *`)) {
      let boton = e.target.closest('#btn_edit_recursos_rechazado'); // Capturamos el botón real
      let RecursoId = boton.getAttribute('data-maestroid');
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
        formdata.append('cumplimiento', document.getElementById('cumplimiento').value === '' ? document.getElementById('cumplimiento').value : 'Pendiente');
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
          // let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
          // let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
          // listar_recursos_administrador(fecha_inicial, fecha_final);
          listar_pedidos_pendientes();
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
    }

    if (e.target.matches(`#btn_retornar_recurso`) || e.target.matches(`#btn_retornar_recurso *`)) {
      const boton = e.target.closest('#btn_retornar_recurso');

      const Proveedor_Id = boton.dataset.proveedor_id;
      const MaestroId = boton.dataset.id;

      try {
        const formData = new FormData();
        formData.append('maestro_id', MaestroId);
        formData.append('Proveedor_Id', Proveedor_Id);

        fetch($('#base_url').val() + 'torrecontrol/RetornarRecurso', {
          method: 'POST',
          body: formData
        })
          .then(res => res.json())
          .then(data => {
            if (data) {
              Swal.fire({
                icon: 'success',
                title: 'Retornado',
                text: 'Recurso retornado correctamente.',
              }).then(() => {
                // $('#ReasignarProveedorModal').modal('hide');
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
      } catch (error) {

      }
    }
  });
}

async function listar_pedidos_pendientes() {
  try {
    const response = await fetch($('#base_url').val() + 'torrecontrol/ListarRecursosPendientes', {
      method: 'POST',
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tbl_pendientes_pedidos');
      tbody.innerHTML = '';
      let btn_gestion_pedidos = '';
      let btn_removeAsignacion = '';
      let btn_Reasignacion = '';
      let btn_Retornar = '';

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

            // btn_Reasignacion = `
            // <a class="dropdown-item fw-bold" href="#" id="btn_reasignar_recurso"
            //   data-id="${element.maestro_id}" data-proveedor_id="${element.proveedor_id}">
            //   <span class="uil-user-arrows"></span> Reasignar Recurso
            // </a>`;
          } else if (estado === 'Iniciado') {
            badgeClass = 'badge-phoenix-info';
          } else if (estado === 'Completado') {
            badgeClass = 'badge-phoenix-success';
            btn_Reasignacion = ``;
          } else if (estado === 'Cancelado') {
            badgeClass = 'badge-phoenix-danger';
          } else if (estado === 'Rechazado') {
            badgeClass = 'badge-phoenix-warning';
            btn_Retornar = `
            <a class="dropdown-item fw-bold" href="#" id="btn_retornar_recurso"
              data-id="${element.maestro_id}" data-proveedor_id="${element.proveedor_id}">
              <span class="uil-user-arrows"></span> Retornar Recurso
            </a>`;
          }

          estados_recurso_html += `<span class="badge badge-phoenix fs-10 ${badgeClass}">
                                      <span class="badge-label">${estado}</span>
                                  </span> `;
        });

        /* Accion para gestionar los pedidos generados a los recursos */
        // if (element.pedido_plantilla === 'SI') {
        //   btn_gestion_pedidos = `<a class="dropdown-item fw-bold" href="#" id="btn_gestion_pedido" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-clienteId="${element.clienteId}"><span class="uil-list-ui-alt"></span> Gestion Pedidos</a>`;
        // } else {
        //   btn_gestion_pedidos = ``;
        // }

        const columnaNundocSolicitud = document.createElement('td');
        columnaNundocSolicitud.innerHTML = `
                <div class="dropdown">
                  <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N° ${element.referencias_pedido}</a>
                  <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
                    <a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-clienteId="${element.clienteId}"><span class="uil uil-transaction"></span> Detalle Proceso</a>
                    ${btn_removeAsignacion}
                    ${btn_Retornar}
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
        columnaEstadoRecurso.dataset.estado = element.maestro_id;
        columnaEstadoRecurso.dataset.id = element.maestro_id; // Guardamos el ID para su actualización posterior
        columnaEstadoRecurso.style.width = 'auto';
        columnaEstadoRecurso.style.whiteSpace = 'nowrap';

        const columnaProveedorTransporte = document.createElement('td');
        // columnaProveedorTransporte.innerHTML = esatdo_recurso;
        columnaProveedorTransporte.dataset.proveedor = element.maestro_id;
        columnaProveedorTransporte.dataset.id = element.maestro_id; // Guardamos el ID para su actualización posterior
        columnaProveedorTransporte.style.width = 'auto';
        columnaProveedorTransporte.style.whiteSpace = 'nowrap';

        const columnaServiciosEspeciales = document.createElement('td');
        // columnaServiciosEspeciales.innerHTML = element.total_servicios_especiales_solicitados;
        let alertaServiciosEspeciales = '';

        if (element.total_servicios_especiales_solicitados > 0) {
          alertaServiciosEspeciales = `
            <span 
              class="text-danger ms-1"
              data-bs-toggle="tooltip"
              title="Servicios especiales pendientes (${element.total_servicios_especiales_solicitados})">
              <i class="uil uil-exclamation-triangle"></i>
              (${element.total_servicios_especiales_solicitados})
            </span>
          `;
        }
        columnaServiciosEspeciales.innerHTML = alertaServiciosEspeciales;
        columnaServiciosEspeciales.style.width = 'auto';
        columnaServiciosEspeciales.style.whiteSpace = 'nowrap';

        fila.appendChild(columnaNundocSolicitud);
        fila.appendChild(columnaCliente);
        fila.appendChild(columnaModalidad);
        fila.appendChild(columnaProceso);
        fila.appendChild(columnaFecha);
        fila.appendChild(columnaFechaSalida);
        fila.appendChild(columnaUsuario);
        // fila.appendChild(columnaEstado);
        fila.appendChild(columnaProveedorTransporte);
        fila.appendChild(columnaEstadoRecurso);
        fila.appendChild(columnaServiciosEspeciales);
        tbody.appendChild(fila);
      });
      // await proveedor_recurso();
      // await estado_recurso();
      await cargarProveedorYEstado();
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

async function cargarProveedorYEstado() {
  const filas = document.querySelectorAll('#tbl_pendientes_pedidos tr');
  const baseUrl = $('#base_url').val();

  for (const fila of filas) {
    const tdProveedor = fila.querySelector('td[data-proveedor]');
    const tdEstado = fila.querySelector('td[data-estado]');

    if (!tdProveedor || !tdEstado) continue;

    const recursoId = tdProveedor.dataset.proveedor;

    try {
      const formData = new FormData();
      formData.append('RecursoId', recursoId);

      const response = await fetch(`${baseUrl}torrecontrol/estado_recurso`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      // limpiar
      tdProveedor.innerHTML = '';
      tdEstado.innerHTML = '';

      if (Array.isArray(data)) {
        data.forEach(element => {
          // 🟦 PROVEEDOR
          if (element.razon_social) {
            // tdProveedor.textContent = element.razon_social;
            tdProveedor.innerHTML = `
                <span class="badge badge-phoenix fs-10 badge-phoenix-primary">
                    <span class="badge-label">${element.razon_social}</span>
                </span>
            `;
          }
          // 🟩 ESTADO
          tdEstado.innerHTML += generarBadge(element);
        });
      } else if (data) {
        if (data.razon_social) {
          tdProveedor.textContent = data.razon_social;
        }
        tdEstado.innerHTML = generarBadge(data);
      }

    } catch (error) {
      console.error('Error cargando proveedor / estado', error);
      tdProveedor.innerHTML = '<span class="text-danger">Error</span>';
      tdEstado.innerHTML = '<span class="text-danger">Error</span>';
    }
  }
}

// Función auxiliar para generar el badge según el estado
function generarBadge(element) {
  let badgeClass = 'badge-phoenix-dark';
  let estadoTexto = 'Desconocido';

  switch (element.estado_servicio) {
    case 'Ganador':
      badgeClass = 'badge-phoenix-success';
      estadoTexto = 'Aprobado';
      break;

    case 'Postulado':
      badgeClass = 'badge-phoenix-warning';
      estadoTexto = 'Pendiente Aprobación';
      break;

    case 'Pendiente Iniciar':
      badgeClass = 'badge-phoenix-secondary';
      estadoTexto = element.estado_servicio;
      break;

    case 'Rechazado':
      badgeClass = 'badge-phoenix-danger';
      estadoTexto = element.estado_servicio;
      break;

    case 'No Asignada':
      badgeClass = 'badge-phoenix-danger';
      estadoTexto = element.estado_servicio;
      break;
  }

  return `
        <span class="badge badge-phoenix fs-10 ${badgeClass}"
              data-bs-toggle="tooltip"
              title="${element.razon_social ?? ''}">
            <span class="badge-label">${estadoTexto}</span>
        </span>
    `;
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
                         <!-- <button class="btn btn-subtle-warning btn-sm me-1 px-1 py-0" type="button" id="btn_edit_datos" style="font-size:12px;" data-RecursoId="${proveedor.recurso_id}">
                            <span class="uil uil-file-edit-alt" data-fa-transform="shrink-3"></span> Editar
                          </button>
                          <button class="btn btn-subtle-success btn-sm me-1 px-1 py-0" type="button" id="btn_save_cargue22768" style="font-size:12px;display:none;" data-remitente="ECOLAB SIBERIA" data-punto="1" data-puntoid="22768" data-numdocsol="22757">
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
              <thead class="table-light">
                <tr>
                  <th>Tipo servicio</th>
                  <th>Estado</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                ${data.map(element => `
                  <tr>
                    <td>${element.nombre}</td>
                    <td>
                     <span class="badge badge-phoenix fs-10 badge-phoenix${element.estado_servicio_especial === 'Aprobado' ? '-success' : element.estado_servicio_especial === 'Cancelado' ? '-danger' : '-secondary'}"><span class="badge-label">${element.estado_servicio_especial}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span>
                      </span>
                   
                    </td>
                     ${element.estado_servicio_especial === 'Aprobado' ? `<td> $${element.valor_servicio.toLocaleString()}</td>` : `     
                      <td class="editable-value" 
                          data-servicio-id="${element.servicio_especial}"
                          data-proveedor-id="${element.proveedor_id}"
                          data-original-value="${element.valor_servicio}"
                          data-maestro-id="${MaestroId}">
                        $${element.valor_servicio.toLocaleString()}
                      </td>`}
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

    // Inicializar eventos después de renderizar
    setTimeout(initEditableValues, 100);

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

function initEditableValues() {
  document.querySelectorAll('.editable-value').forEach(cell => {
    cell.addEventListener('click', function (e) {
      if (this.querySelector('input')) return; // Ya está en modo edición

      const originalValue = this.getAttribute('data-original-value');
      const servicioId = this.getAttribute('data-servicio-id');
      const proveedorId = this.getAttribute('data-proveedor-id');
      const maestroId = this.getAttribute('data-maestro-id');

      this.innerHTML = `
        <div class="d-flex align-items-center">
          <input type="number" class="form-control form-control-sm" value="${originalValue}" style="width: 40%;"> 
       
          <button class="btn btn-subtle-danger btn-sm me-1 px-1 py-0 cancel-btn" id="id_rechazar_se" data-RecursoId=${maestroId} data-ServicioId=${servicioId} data-ProveedorId=${proveedorId}>
            <span class="uil uil-cancel"></span> Rechazar
          </button>
        </div>
      `;
      // <button class="btn btn-subtle-success btn-sm me-1 px-1 py-0 save-btn" 
      //   <span class="uil uil-save"></span> Guardar
      // </button>
      const input = this.querySelector('input');
      input.focus();
      input.select();

      // Guardar con Enter
      input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          saveValue(this, originalValue, servicioId, proveedorId, maestroId, cell);
        }
      });

      // Botón Guardar
      this.querySelector('.save-btn').addEventListener('click', function () {
        saveValue(input, originalValue, servicioId, proveedorId, maestroId, cell);
      });

      // Botón Cancelar
      this.querySelector('.cancel-btn').addEventListener('click', function () {
        cell.innerHTML = `$${parseFloat(originalValue).toLocaleString()}`;
      });
    });
  });
}

async function saveValue(input, originalValue, servicioId, proveedorId, maestroId, cell) {
  const newValue = input.value;

  if (parseFloat(newValue) === parseFloat(originalValue)) {
    cell.innerHTML = `$${parseFloat(originalValue).toLocaleString()}`;
    return;
  }

  if (!newValue || isNaN(newValue)) {
    showToast('error', 'Error', 'Ingrese un valor numérico válido');
    return;
  }

  try {
    cell.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

    const formData = new FormData();
    formData.append('servicio_id', servicioId);
    formData.append('proveedor_id', proveedorId);
    formData.append('valor', newValue);
    formData.append('maestro_id', maestroId);

    const response = await fetch($('#base_url').val() + 'torrecontrol/actualizar_valor_servicio', {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.success === true) {
      cell.innerHTML = `$${parseFloat(newValue).toLocaleString()}`;
      cell.setAttribute('data-original-value', newValue);
      showToast('success', 'Éxito', 'Valor actualizado correctamente');
    } else {
      throw new Error(result.message || 'Error al actualizar');
    }
  } catch (error) {
    console.error('Error:', error);
    cell.innerHTML = `$${parseFloat(originalValue).toLocaleString()}`;
    showToast('error', 'Error', 'No se pudo actualizar el valor');
  }
}

function showToast(type, title, message) {
  // Implementación básica de toast notification
  const toastHtml = `
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1100">
      <div class="toast show align-items-center text-white bg-${type}" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <strong>${title}</strong>: ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  `;

  const toastContainer = document.createElement('div');
  toastContainer.innerHTML = toastHtml;
  document.body.appendChild(toastContainer);

  setTimeout(() => {
    toastContainer.remove();
  }, 3000);
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

async function Listar_servicios_por_proveedor(MaestroId, VentanaId, Proceso, miArray, ClienteId, ArrayRefPedidos, modalidad_pedido) {
  try {
    let formData = new FormData();
    formData.append('RecursoId', MaestroId);
    formData.append('VentanaId', VentanaId);
    formData.append("proceso", Proceso);
    formData.append("SolicitudesId", JSON.stringify(ArrayRefPedidos));

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
                <small class="text-muted">${servicio.Placa
                ? `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${servicio.Placa}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>` : 'No Aplica'}
                </small>
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

        const tieneServicioRechazado = proveedor.servicios.some(s =>
          s.estado?.toLowerCase() === 'rechazado' &&
          s.estado_recurso?.toLowerCase() === 'rechazado'
        );

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
                  ${tieneServicioRechazado ? `
                    <button 
                      type="button"
                      class="btn btn-sm btn-outline-warning ms-2 btn-editar-servicio"
                      data-maestroid="${MaestroId}"
                      data-proveedor="${proveedor.proveedor}"
                      data-proceso="${Proceso}"
                      title="Editar servicio rechazado"
                      id="btn_edit_recursos_rechazado">
                      <i class="uil uil-edit"></i> Editar
                    </button>
                  `
            : ``
          }
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

        //         accordionItem.innerHTML = `
        // <h2 class="accordion-header" id="heading${index}">
        //   <div class="accordion-button collapsed d-flex align-items-center gap-3"
        //        data-bs-toggle="collapse"
        //        data-bs-target="#collapse${index}"
        //        aria-expanded="false"
        //        aria-controls="collapse${index}">

        //     <!-- 🟦 Proveedor -->
        //     <div class="flex-grow-1 text-primary fw-semibold text-truncate">
        //       ${proveedor.proveedor}
        //     </div>

        //     <!-- 🟧 Estados -->
        //     <div class="d-flex align-items-center gap-2 text-nowrap">
        //       <span class="fw-semibold text-dark">Estado Servicio:</span>
        //       ${proveedor.estado_servicio}

        //       <span class="fw-semibold text-dark ms-2">Estado Recurso:</span>
        //       ${proveedor.estado_recurso}
        //     </div>

        //     <!-- ✏️ Acción -->
        //     ${tieneServicioRechazado ? `
        //       <div class="ms-3">
        //         <button
        //           type="button"
        //           class="btn btn-sm btn-outline-warning btn-editar-servicio"
        //           data-maestroid="${MaestroId}"
        //           data-proveedor="${proveedor.proveedor}"
        //           data-proceso="${Proceso}"
        //           title="Editar servicio rechazado">
        //           <i class="uil uil-edit"></i> Editar
        //         </button>
        //       </div>
        //     ` : ``}

        //   </div>
        // </h2>

        // <div id="collapse${index}" class="accordion-collapse collapse"
        //      aria-labelledby="heading${index}"
        //      data-bs-parent="#accordionExample">
        //   <div class="accordion-body pt-0">
        //     <div class="row fw-bold mb-2">
        //       <div class="col-2">Tipo servicio</div>
        //       <div class="col-2">Vehículo</div>
        //       <div class="col-2">Estado</div>
        //       <div class="col-3">Fecha Registro</div>
        //       <div class="col-3">Fecha Límite</div>
        //     </div>
        //     ${serviciosHTML}
        //     <div class="row fw-bold mb-2">
        //       <div class="col-2">Capacidad Vehículo</div>
        //       <div class="col-2">Tiempo Libre</div>
        //       <div class="col-2">Stand By</div>
        //       <div class="col-2">Cumplimiento</div>
        //       <div class="col-2">Contenedor</div>
        //       <div class="col-2">Tara</div>
        //     </div>
        //     ${OperacionesHTML}
        //   </div>
        // </div>
        // `;


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