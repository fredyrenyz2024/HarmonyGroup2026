window.VENTANA = null;
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID de la ventana a la variable global
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


  /* Variables del filtro */
  const hoy = new Date();
  const fechaHoy = hoy.toISOString().split('T')[0];

  var tipo = 2;
  var dato = "";
  var fecha_inicial = $(`#campo-${id}-fecha_inicial`).val() === undefined ? fechaHoy : $(`#campo-${id}-fecha_inicial`).val();
  var fecha_final = $(`#campo-${id}-fecha_final`).val() === undefined ? fechaHoy : $(`#campo-${id}-fecha_final`).val();
  var cliente = $(`#campo-${id}-clientes`).length > 0 ? $(`#campo-${id}-clientes`).val() : "";
  var empresa = $(`#campo-${id}-empresas`).length > 0 ? $(`#campo-${id}-empresas`).val() : "";
  var estado = "Todas";

  if (id == 1) {
    tipo = 2;
    dato = "";
    fecha_inicial = $(`#campo-${id}-fecha_inicial`).val() === undefined ? fechaHoy : $(`#campo-${id}-fecha_inicial`).val();
    fecha_final = $(`#campo-${id}-fecha_final`).val() === undefined ? fechaHoy : $(`#campo-${id}-fecha_final`).val();
    cliente = $(`#campo-${id}-clientes`).length > 0 ? $(`#campo-${id}-clientes`).val() : "";
    empresa = $(`#campo-${id}-empresas`).length > 0 ? $(`#campo-${id}-empresas`).val() : "";
    estado = "Todas";
    listar_cotizaciones(tipo, fecha_inicial, fecha_final, estado, cliente, empresa, id);

    /************************** Funcion para buscar Cotizaciones ******************************/
    document.addEventListener("click", async e => {
      if (e.target.matches(`#campo-${id}-buscar`) || e.target.matches(`#campo-${id}-buscar *`)) {
        tipo = 2;
        fecha_inicial = $(`#campo-${id}-fecha_inicial`).val();
        fecha_final = $(`#campo-${id}-fecha_final`).val();
        cliente = $(`#campo-${id}-clientes`).val() === "" ? "" : $(`#campo-${id}-clientes`).val();
        empresa = $(`#campo-${id}-empresas`).val() === '' ? "" : $(`#campo-${id}-empresas`).val();
        estado = "Todas";
        listar_cotizaciones(tipo, fecha_inicial, fecha_final, estado, cliente, empresa, id);
      }

      if (e.target.matches("#btn_ver_solicitud") || e.target.matches("#btn_ver_solicitud *")) {
        // let padre = e.target.parentElement.parentElement;
        // Obtener el enlace (el elemento con el data-id)
        let enlace = e.target.closest('#btn_ver_solicitud');
        // // // Obtener el valor del atributo data-id
        let dataId = enlace.getAttribute('data-id');
        let dataId2 = enlace.getAttribute('data-id2');
        let dataId3 = enlace.getAttribute('data-id3');
        // // Visualizar(dataId, dataId2, dataId3);

        // Definir dimensiones de la nueva ventana
        // const w = 1000;
        // const h = 1000;

        // // Fixes dual-screen position                         Most browsers      Firefox
        // var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
        // var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

        // var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        // var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        // var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        // var top = ((height / 2) - (h / 2)) + dualScreenTop;
        // var newWindow = window.open($('#base_url').val() + "serviciocliente/canvas?cotizacion=" + encodeURIComponent(dataId) + "&solicitud_servicio=" + encodeURIComponent(dataId2) + "&ventana=" + encodeURIComponent(dataId3), "ventanaCentrada", 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

        // // Puts focus on the newWindow
        // if (window.focus) {
        //   newWindow.focus();
        // }

        /* Titulo del offcanva */
        myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Datos solicitud de servicio`);

        myOffcanvas.updateContent(`
          <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div class="row">
              <div class="d-flex justify-content-end" id="check_prioridad">
                <div class="form-check form-switch">
                  <input class="form-check-input" id="flexSwitchCheckChecked" type="checkbox" />
                  <label class="form-check-label" for="flexSwitchCheckChecked">Prioritaria</label>
                </div>
              </div> 

              <div id="msg_ver"></div><!-- id para manejar los mensajes de errordel popup -->
              <div id="content_ver">
                <!-- <div id="titlu"></div> -->
                <!-- Mostrar datos del cliente -->
                <div class="d-flex flex-wrap justify-content-start mt-2">
                  <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                    <h6 class="mb-0 text-body-highlight me-2">Cliente</h6>
                  </div>
                </div>
                <hr class="my-1 text-dark">

                <div id="cuerpo_cliente"><!-- Datos desde Javascript --></div>

                <!-- <hr class="my-1 text-dark"> -->
                <div class="d-flex flex-wrap justify-content-start mt-2">
                  <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                    <h6 class="mb-0 text-body-highlight me-2">Mercancia</h6>
                  </div>
                </div>
                <hr class="my-1 text-dark">


                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                  <ul class="nav nav-underline fs-9" role="tablist" id="bloques_mercancias_menu" style="--phoenix-nav-link-padding-x: rem !important;">
                    <!-- Bloques de mercancia -->
                  </ul>

                  <div class="tab-content mt-1" id="detalle_mercancias">
                    <!-- Cargar tabla para seleccionar los remitentes seun su cantidad -->
                  </div>

                  <!-- servicios especiales -->
                  <ul class="nav nav-underline fs-9" role="tablist" id="bloques_servicios_especiales_menu" style="--phoenix-nav-link-padding-x: rem !important;">
                    <!-- Bloques de servicio especial -->
                  </ul>

                  <div class="tab-content mt-1" id="detalle_servicios_especiales">
                    <!-- Cargar tabla para seleccionar los remitentes seun su cantidad -->
                  </div>
                </div>

                <!-- <hr class="my-1 text-dark"> -->
                <div class="d-flex flex-wrap justify-content-start mt-2">
                  <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                    <h6 class="mb-0 text-body-highlight me-2">Costos de servicio</h6>
                  </div>
                </div>

                <hr class="my-1 text-dark">
                <div id="costos"><!-- Contenido desde Javascript --></div>
                <hr class="my-1 text-dark">
                <div id="costos1"></div>
                <hr class="my-1 text-dark">
                <!-- Total del servicio -->
                <div id="totcotiza"></div>

                <div id="Mensaje_update"></div>

                <!-- <hr class="my-1 text-dark"> -->
                <div class="d-flex flex-wrap justify-content-start mt-2">
                  <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                    <h6 class="mb-0 text-body-highlight me-2">Remitentes y Destinatarios</h6>
                  </div>
                </div>
                <hr class="my-1 text-dark">

                <!-- Remitentes -->
                <div class="d-flex flex-wrap justify-content-start mt-2">
                  <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                    <h6 class="mb-0 text-body-highlight me-2">Remitente(s)</h6>
                  </div>
                </div>
                <hr class="my-1 text-dark">

                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                  <ul class="nav nav-underline fs-9" role="tablist" id="bloques_punto_remitente" style="--phoenix-nav-link-padding-x: rem !important;">
                    <!-- Bloques de remitentes -->
                  </ul>

                  <div class="tab-content" id="detalle_puntos_remitentes">
                    <!-- Cargar tabla para seleccionar los remitentes seun su cantidad -->
                  </div>
                </div>
                <hr class="my-1 text-dark">

                <!-- Destinatarios -->
                <div class="d-flex flex-wrap justify-content-start mt-2">
                  <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                    <h6 class="mb-0 text-body-highlight me-2">Destinatario(s)</h6>
                  </div>
                </div>
                <hr class="my-1 text-dark">

                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                  <ul class="nav nav-underline fs-9" role="tablist" id="bloques_punto_destinatario" style="--phoenix-nav-link-padding-x: rem !important;">
                    <!-- Bloques de destinatarios -->
                  </ul>

                  <div class="tab-content" id="detalle_puntos_destinatarios">
                    <!-- Cargar tabla para seleccionar los remitentes seun su cantidad -->
                  </div>
                </div>
                <hr class="my-1 text-dark">

                <!-- Referenias para la facturacion -->

                <div class="row">
                  <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <!-- Listar la referencias por cada destinatario de la oslicyud d servicio -->
                    <ul class="nav nav-underline fs-9" role="tablist" id="bloques_referencias_menu" style="--phoenix-nav-link-padding-x: rem !important;">
                      <!-- Bloques de mercancia -->
                    </ul>

                    <div class="tab-content mt-1" id="detalle_referencias">
                      <!-- Cargar tabla para seleccionar los remitentes seun su cantidad -->
                    </div>
                  </div>
                </div>
                <hr class="my-1 text-dark">

                <div class="d-flex flex-wrap justify-content-start mt-2">
                  <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                    <h6 class="mb-0 text-body-highlight me-2">Datos Adicionales</h6>
                  </div>
                </div>
                <hr class="my-1 text-dark">

                <div class="row" id="Datos_adicionales">
                  <div class="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 col-xxl-5">
                    <div class="mb-1">
                      <label style="font-size: 12px;">Agencias</label>
                      <select id="servicio_agencia" style="width: 100%;" class="ts form-select form-select-sm">
                        <option value="" selected>Seleccione</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 col-xxl-5">
                    <div class="mb-1">
                      <label style="font-size: 12px;">Tipo Servicio</label>
                      <select id="servicio_cliente" style="width: 100%;" class="ts form-select form-select-sm">
                        <option value="" selected>Seleccione</option>
                        <option value="Expreso">Expreso - Viaje</option>
                        <option value="Consolidado">Consolidado - Tonelada</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                    <div class="mb-1 pt-5 d-flex justify-content-end">
                      <button class="btn btn-subtle-success btn-sm me-1 px-1 py-0" type="button" id="btn_update_agencia_solicitud"><span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar</button>
                    </div>
                  </div>
                  <input type="hidden" name="numero_cotizacion" id="numero_cotizacion">
                  <input type="hidden" name="numero_solicitud" id="numero_solicitud">
                </div>


                <div class="row" id="Datos_adicionales_operaciones" style="display: none;">
                  <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <div class="d-flex justify-content-center mb-2">
                      <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Información Restringida</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span>
                    </div>
                  </div>
                </div>

                <hr class="my-1 text-dark">

                <!-- Datos para el contenedor  -->
                <div class="row" id="Contenedor">
                  <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                    <div class="mb-1">
                      <label style="font-size: 12px;">Numero Contenedor</label>
                      <input type="text" id="numero_contenedor" name="numero_contenedor" class="form-control form-control-sm text-dark fs-10" oninput="this.value = this.value.toUpperCase();">
                    </div>
                  </div>
                  <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                    <div class="mb-1 pt-4">
                      <div class="form-check form-switch">
                        <input class="form-check-input" id="agrupable" type="checkbox">
                        <label class="form-check-label" for="agrupable">Agrupable</label>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                    <div class="mb-1 pt-5 d-flex justify-content-end">
                      <button class="btn btn-subtle-success btn-sm me-1 px-1 py-0" type="button" id="btn_save_contenedor"><span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar</button>
                    </div>
                  </div>
                </div>

                <div class="row" id="Contenedor_operaciones" style="display: none;">
                  <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <div class="d-flex justify-content-center mb-2">
                      <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Información Restringida</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span>
                    </div>
                  </div>
                </div>

                <hr class="my-1 text-dark">

                <!-- Costos Adicionales -->
                <div id="cuerpo_adicional"></div>
              </div>
            </div>
          </div>
        `);

        myOffcanvas.show();
        Visualizar(dataId, dataId2, dataId3);
      }

      if (e.target.matches("#btn-solicitar-prioridad") || e.target.matches("#btn-solicitar-prioridad *")) {
        // Obtener el enlace (el elemento con el data-id)
        let enlace = e.target.closest('#btn-solicitar-prioridad');
        // // Obtener el valor del atributo data-id
        let dataId = enlace.getAttribute('data-id');
        let dataId2 = enlace.getAttribute('data-id2');
        // let dataId3 = enlace.getAttribute('data-id3');

        /* Titulo del offcanva */
        myOffcanvas.updateTitle(`<span class="text-danger uil uil-bell"></span> Solicitar prioridad de solicitud de servicio`);

        myOffcanvas.updateContent(`
          <div class="d-flex justify-content-center">
            <h4>Solicitud de servicio: ${dataId2}</h4>
          </div>
          <hr class="my-1 text-dark">
        <!--<div class="container-fluid"> </div>-->
          <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div class="row">
              <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <div class="mb-1">
                  <label style="font-size: 12px;">Nivel Prioridad</label>
                    <select id="nivel_prioridad" style="width: 100%;" class="ts form-select form-select-sm">
                      <option value="" selected>Seleccione</option>
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                </div>
              </div>

              <!--Observacion o motivo de la prioridad-->
              <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                <div class="mb-1">
                  <label style="font-size: 12px;">Nivel Prioridad</label>
                    <select id="motivo_prioridad" style="width: 100%;" class="ts form-select form-select-sm">
                      <option value="" selected>Seleccione</option>
                      <option value="Cumplimiento de contrato">Cumplimiento de contrato</option>
                      <option value="Vehiculo debe estar cargado hoy">Vehiculo debe estar cargado hoy</option>
                      <option value="Varios viajes con el cliente">Varios viajes con el cliente</option>
                    </select>
                </div>
              </div>

              <!--<hr class="my-1 text-dark">-->

              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <div class="mb-1 pt-5 d-flex justify-content-end">
                  <button class="btn btn-subtle-success btn-sm me-1 px-1 py-0" type="button" id="btn_save_propuesta" data-NumdocSolicitud="${dataId2}"><span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar Prioridad</button>
                </div>
              </div>

            </div>
          </div>
        `);
        myOffcanvas.show();
      }

      if (e.target.matches("#btn_save_propuesta") || e.target.matches("#btn_save_propuesta *")) {
        let enlace = e.target.closest('#btn_save_propuesta');
        // // Obtener el valor del atributo data-id
        let Numdoc_solicitud = enlace.getAttribute('data-NumdocSolicitud');
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Quieres cambiar el estado?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, cambiar',
          cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
          /*  */// Aplica el cambio solo si se confirma
          datos = new FormData();
          datos.append('estado', "Propuesta");
          datos.append('numdoc_solicitud', Numdoc_solicitud);
          datos.append('nivel_prioridad', document.getElementById('nivel_prioridad').value);
          datos.append('motivo_prioridad', document.getElementById('motivo_prioridad').value);

          try {
            const response = await fetch($('#base_url').val() + 'serviciocliente/Actualizar_Prioridad', {
              method: 'POST',
              body: datos,
              cache: 'no-cache',
            });
            const data = await response.json();

            if (data.status === 200) {
              Swal.fire({
                title: "Mensaje!",
                text: data.message,
                icon: "success",
                draggable: true
              });
              tipo = 2;
              fecha_inicial = $(`#campo-${id}-fecha_inicial`).val();
              fecha_final = $(`#campo-${id}-fecha_final`).val();
              cliente = $(`#campo-${id}-clientes`).val() === "" ? "" : $(`#campo-${id}-clientes`).val();
              empresa = $(`#campo-${id}-empresas`).val() === '' ? "" : $(`#campo-${id}-empresas`).val();
              estado = "Todas";
              listar_cotizaciones(tipo, fecha_inicial, fecha_final, estado, cliente, empresa, id);
              myOffcanvas.hide();
            } else {
              Swal.fire({
                title: "Mensaje!",
                text: data.message,
                icon: "error",
                draggable: true
              });
            }
          } catch (error) {
            console.error('Error en la primera solicitud:', error);
          }
        } else {
          // Revierte el cambio si se cancela
        }
      }

      /* Aprobar tarifa subasta */
      if (e.target.matches("#btn-aprobar-tarifa-subasta") || e.target.matches("#btn-aprobar-tarifa-subasta *")) {
        // Obtener el valor del atributo data-id
        let enlace = e.target.closest('#btn-aprobar-tarifa-subasta');
        let dataId = enlace.getAttribute('data-id');
        myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Verificar Tarifa (subasta)`);
        myOffcanvas.updateContent(`
            <div id="msg_tarifa_subasta"></div>
              <div class="row" id="content_ver">
                <div id="titlu"></div>
                <input type="hidden" id="ssidflete">
                <input type="hidden" id="idpareja_origen_destino">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 msg"></div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <div class="mb-1">
                    <label class="control-label">Subasta</label>
                    <input type="text" id="ssubnum" class="form-control form-control-sm" disabled>
                  </div>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <div class="mb-1">
                    <label class="control-label">Nombre cliente</label>
                    <input type="text" id="sscliente" class="form-control form-control-sm" disabled>
                  </div>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                 <div class="mb-1">
                  <label class="control-label">num seguridad</label>
                  <input type="text" id="ssseguridad" class="form-control form-control-sm" disabled>
                  </div>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                 <div class="mb-1">
                  <label class="control-label">Solicitud de servicio</label>
                  <input type="text" id="ssservicio" class="form-control form-control-sm" disabled>
                  </div>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                 <div class="mb-1">
                  <label class="control-label">Placa</label>
                  <input type="text" id="ssplaca" class="form-control form-control-sm" disabled>
                  </div>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                 <div class="mb-1">
                  <label class="control-label">Flete sugerido</label>
                  <input type="text" id="ssfsugerido" class="form-control form-control-sm" disabled>
                  </div>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                 <div class="mb-1">
                  <label class="control-label" style="font-weight: 700; color:orange;">Flete propuesto</label>
                  <input type="text" id="ssfpropuesto" class="form-control form-control-sm" disabled>
                  </div>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                 <div class="mb-1">
                  <label class="control-label">Acepta Flete:</label>
                  <select id="respuesta_flete_s" class="form-control form-control-sm">
                    <option value="">Seleccione</option>
                    <option value="1">Si</option>
                    <option value="0">No</option>
                  </select>
                  </div>
                </div>
                <!--<div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <div class="my-4">
                    <button type="button" id="repuesta_flete" class="btn btn-subtle-primary btn-sm me-1 px-1 py-1"><span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar</button>
                  </div>
                </div>-->

                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <hr class="my-1 text-dark">
                </div>
                
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label class="control-label">Tarifa venta</label>
                  <input type="text" id="sstarifasold" class="form-control form-control-sm" onchange="cambia_tarifa()">
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label class="control-label">Utilidad</label>
                  <input type="text" id="ss_utilidad" class="form-control form-control-sm" disabled>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label class="control-label">Rentabilidad</label>
                  <input type="text" id="ss_rentabilidad" class="form-control form-control-sm" disabled>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label class="control-label">Ajuste de tarifa</label>
                  <select id="ssaprobar" class="form-control form-control-sm">
                    <option value="">Seleccione</option>
                  </select>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label class="control-label">Estado Flete</label>
                  <input type="text" id="estado_flete" class="form-control input-sm" disabled>
                </div>
            </div><!--conten fin -->
          <div class="row">
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <div class="my-4">
                    <button type="button" id="repuesta_flete" class="btn btn-subtle-primary btn-sm me-1 px-1 py-1"><span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar</button>
                  </div>
                </div>
          </div>
          `);
        myOffcanvas.show();

        var datos = {
          n_servicio: dataId
        };
        $.ajax({
          url: $('#base_url').val() + "serviciocliente/consulta_datos_subasta",
          type: 'POST',
          data: datos,
          dataType: 'json',
          success: function (data) {
            if (data.result != null) {

              if (data.result[0].acepta_flete == 'null') {
                document.getElementById("sstarifasold").disabled = true;
                document.getElementById("ssaprobar").disabled = true;
                $('#btnaprobar_tarifa').attr('disabled', true);
                document.getElementById("respuesta_flete_s").disabled = false;
                document.getElementById("repuesta_flete").disabled = false;
              }
              if (data.result[0].acepta_flete == 'Aceptado') {
                document.getElementById("sstarifasold").disabled = false;
                document.getElementById("ssaprobar").disabled = false;
                $('#btnaprobar_tarifa').attr('disabled', false);
                document.getElementById("respuesta_flete_s").disabled = true;
                document.getElementById("repuesta_flete").disabled = true;
              }

              $(".msg").html('');
              $("#estado_flete").val(data.result[0].acepta_flete);
              $("#ssidflete").val(data.result[0].idflete);
              $("#ssubnum").val(data.result[0].id_suba);
              $("#sscliente").val(data.result[0].nombre_cliente);
              $("#ssseguridad").val(data.result[0].num_estudioseguridad);
              $("#ssservicio").val(data.result[0].numer_solservicio);
              $("#ssplaca").val(data.result[0].placa);
              $("#ssfsugerido").val(data.result[0].flete_sugerido);
              $("#ssfpropuesto").val(data.result[0].flete_propuesto);
              $("#sstarifasold").val(data.result[0].tarifa_promedio);
              $("#idpareja_origen_destino").val(data.result[0].parejaorigen);
              //calcular utilidad + rentabilidad
              let a = (data.result[0].tarifa_promedio).replace(/,/g, "");
              let b = (data.result[0].flete_propuesto).replace(/,/g, "");
              let rent = (parseFloat(a) - parseFloat(b));
              $("#ss_rentabilidad").val(rent);
              let calculo = (parseFloat(rent) / parseFloat(a));
              let res = (parseFloat(calculo) * 100);
              let util = res.toFixed(2);
              $("#ss_utilidad").val(util);
              $("#ss_rentabilidad").val(parseFloat($("#ss_rentabilidad").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
              $("#ssfpropuesto").val(parseFloat($("#ssfpropuesto").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
              //  $("#sstarifasold").val(parseFloat($("#sstarifasold").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
              if (parseFloat(util) >= parseFloat(15)) {
                $("#ssaprobar").html('<option value="aprobado_sac">Ajustar</option>');
              } else {
                $("#ssaprobar").html('<option value="no_aprobado_sac">No ajustar</option>');
              }
            } else {
              $(".msg").html(`
                <div class="alert alert-outline-danger d-flex align-items-center py-2" role="alert">
                  <span class="fas fa-times-circle text-danger fs-7 me-2"></span>
                  <p class="mb-0 flex-1">No hay tarifas registradas para esta solicitud.</p>
                  <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                `);
              $("#consulta_sub").animate({ scrollTop: 0 }, 600);
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            // console.log('no trajomunis');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          }
        });
      }

      /* Respuesta de la aprobacion de las tarifa de fletes */
      // if (e.target.matches("#repuesta_flete") || e.target.matches("#repuesta_flete *")) {
      if (e.target.matches("#btnaprobar_tarifa") || e.target.matches("#btnaprobar_tarifa *")) {
        Swal.fire({
          title: 'Seguro',
          text: '¿Desea actualizar la solicitud de servicio?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3B71CA',
          cancelButtonColor: '#9FA6B2',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          customClass: {
            popup: 'swal2-custom-font',
          },
        }).then(async result => {
          if (result.isConfirmed) {
            flete_propu = $("#ssfpropuesto").val();
            tarifa_pro = $("#sstarifasold").val();
            utilidad = $("#ss_utilidad").val();
            rentabili = $("#ss_rentabilidad").val();
            subasta = $("#ssubnum").val();
            rta = $("#respuesta_flete_s").val();
            var sidflete = $("#ssidflete").val();
            ss = $("#ssservicio").val();

            if (rta == '1' || rta == '0') {
              var rta_flete = {
                sidflete: sidflete,
                flete_propu: flete_propu,
                tarifa_pro: tarifa_pro,
                utilidad: utilidad,
                rentabili: rentabili,
                subasta: subasta,
                estado: rta,
                nservicio: ss,
              };
              $.ajax({
                url: $("#id_url_ajax").val() + "serviciocliente/respuesta_flete",
                type: 'POST',
                data: rta_flete,
                dataType: 'json',
                success: function (data) {
                  if (data.numero === 200) {
                    Swal.fire({
                      title: "Mensaje!",
                      text: data.message,
                      icon: "success",
                      draggable: true
                    });
                    listar_cotizaciones(tipo, fecha_inicial, fecha_final, estado, cliente, empresa, id);
                    myOffcanvas.hide();
                  } else {
                    Swal.fire({
                      title: "Mensaje!",
                      text: data.message,
                      icon: "error",
                      draggable: true
                    });
                  }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  console.log('error error');
                  console.log(jqXHR);
                  console.log(textStatus);
                  console.log(errorThrown);
                }
              });
            } else {
              if (!$("#sstarifasold").val()) {
                msg_error += "<p>Debe diligenciar el campo <strong>Tarifa venta</strong> para poder registrar.</p>";
              }
              if (!$("#ssaprobar").val()) {
                msg_error += "<p>Debe seleccionar el campo <strong>Ajuste de tarifa</strong> para poder registrar.</p>";
              }
              if (!msg_error) {
                Aprobar_Tarifa();
              } else {
                $("#msg_tarifa_subasta").html(`
                <div class="alert alert-outline-danger d-flex align-items-center py-2" role="alert">
                  <span class="fas fa-times-circle text-danger fs-7 me-2"></span>
                  <!--<p class="mb-0 flex-1">No hay tarifas registradas para esta solicitud.</p>-->
                  ${msg_error}
                  <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                `);
                $("#consulta_sub").animate({
                  scrollTop: 0
                }, 600);
              }
            }
          }
        });
      }

      if (e.target.matches("#btn_cancelar_solicitud_servicio") || e.target.matches("#btn_cancelar_solicitud_servicio *")) {
        let enlace = e.target.closest('#btn_cancelar_solicitud_servicio');
        let dataId = enlace.getAttribute('data-id');

        Swal.fire({
          title: 'Seguro',
          text: '¿Desea anular la solicitud de servicio ' + dataId + '?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3B71CA',
          cancelButtonColor: '#9FA6B2',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          customClass: {
            popup: 'swal2-custom-font',
          },
        }).then(async result => {
          if (result.isConfirmed) {
            var buscar = {
              idsolicitud: dataId,
            };

            $.ajax({
              url: $("#base_url").val() + "serviciocliente/cancelar_solicitud_servicio",
              type: 'POST',
              data: buscar,
              dataType: 'json',
              success: function (data) {
                if (data.success === true) {
                  Swal.fire({
                    title: "Mensaje!",
                    html: data.message,
                    icon: "success",
                    draggable: true
                  });
                  listar_cotizaciones(tipo, fecha_inicial, fecha_final, estado, cliente, empresa, id);
                } else {
                  Swal.fire({
                    title: "Mensaje!",
                    html: data.message,
                    icon: "error",
                    draggable: true
                  });
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                console.log('error');
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              }
            });
          }
        });
      }

    });

    // // Filtro para clientes
    // $(document).on("change", `#campo-${id}-filtro`, function () {
    //   let valorSeleccionado = $(this).val();

    //   // Verifica si los elementos existen antes de manipularlos
    //   let $clientes = $(`#campo-${id}-clientes`);
    //   let $empresas = $(`#campo-${id}-empresas`);
    //   let $estados = $(`#campo-${id}-estados`);

    //   // Oculta todos antes de mostrar el que corresponde
    //   $clientes.hide();
    //   $empresas.hide();
    //   $estados.hide();

    //   if (valorSeleccionado === "Clientes") {
    //     $clientes.show();

    //     // Cargar clientes por AJAX
    //     $.ajax({
    //       url: $('#base_url').val() + 'serviciocliente/Listar_Clientes',
    //       type: "POST",
    //       dataType: "json",
    //       success: function (data) {
    //         $clientes.empty().append('<option value="">Seleccione</option>');
    //         $.each(data, function (index, item) {
    //           $clientes.append(`<option value="${item.id}">${item.nombre}</option>`);
    //         });

    //         // Inicializa Select2 en el select de clientes
    //         $clientes.select2({
    //           placeholder: 'Seleccione una opción',
    //           allowClear: true,
    //         });
    //       },
    //       error: function (xhr, status, error) {
    //         console.error("Error en AJAX:", status, error);
    //         alert("Error al cargar los datos.");
    //       }
    //     });

    //   } else if (valorSeleccionado === "Empresa") {
    //     if ($clientes) {
    //       $clientes.hide();
    //       alert("ENTRO BIEN")
    //     }
    //     $empresas.show();

    //     // Cargar empresas por AJAX
    //     $.ajax({
    //       url: $('#base_url').val() + 'serviciocliente/Listar_Empresas',
    //       type: "POST",
    //       dataType: "json",
    //       success: function (data) {
    //         $empresas.empty().append('<option value="">Seleccione</option>');
    //         $.each(data, function (index, item) {
    //           $empresas.append(`<option value="${item.id}">${item.nombre_empresa}</option>`);
    //         });

    //         // Inicializa Select2 en el select de empresas
    //         $empresas.select2({
    //           placeholder: 'Seleccione una opción',
    //           allowClear: true,
    //         });
    //       },
    //       error: function (xhr, status, error) {
    //         console.error("Error en AJAX:", status, error);
    //         alert("Error al cargar los datos.");
    //       }
    //     });
    //   } else if (valorSeleccionado === "Estado") {
    //     $estados.show();
    //   }
    // });

    // Suponiendo que "id" es "V1" o el que corresponda:
    // Si es variable, sustituye en la concatenación de IDs.
    // document.addEventListener('DOMContentLoaded', function () {});
    const filtro = document.getElementById(`campo-${id}-filtro`);
    if (!filtro) return; // Si no existe, salimos.

    // Escuchamos el evento 'change' en el <select> del filtro
    filtro.addEventListener('change', function () {
      const valorSeleccionado = this.value;

      // Referencias a los otros <select>
      const clientes = document.getElementById(`campo-${id}-clientes`);
      const empresas = document.getElementById(`campo-${id}-empresas`);
      const estados = document.getElementById(`campo-${id}-estados`);

      // Primero, ocultamos todos
      // if (clientes) clientes.style.display = 'none';
      // if (empresas) empresas.style.display = 'none';
      // if (estados) estados.style.display = 'none';

      // URL base (ajusta a tu ruta real)
      const baseUrl = document.getElementById('base_url').value;

      if (valorSeleccionado === 'Clientes') {
        if (clientes) {
          clientes.style.display = ''; // Muestra el select (display: block/inline-block, etc.)
          empresas.style.display = 'none'; // Muestra el select (display: block/inline-block, etc.)
          estados.style.display = 'none'; // Muestra el select (display: block/inline-block, etc.)

          // Petición AJAX con fetch
          fetch(baseUrl + 'serviciocliente/Listar_Clientes', {
            method: 'POST',
            // Si tu backend requiere parámetros, ajusta headers/body:
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({}) // Envía lo que necesites
          })
            .then(response => response.json())
            .then(data => {
              // Vaciamos opciones y agregamos la opción "Seleccione"
              clientes.innerHTML = '<option value="">Seleccione</option>';

              data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.nombre;
                clientes.appendChild(option);
              });

              // Inicializar Select2 (requiere jQuery).
              // Si sigues teniendo jQuery y select2 cargados, podrías hacer:
              if (window.$ && $.fn.select2) {
                $(clientes).select2({
                  placeholder: 'Seleccione una opción',
                  allowClear: true
                });
              }
            })
            .catch(error => {
              console.error('Error en AJAX:', error);
              alert('Error al cargar los datos.');
            });
        }

      } else if (valorSeleccionado === 'Empresa') {
        if (empresas) {
          document.getElementById(`contenedor_${id}_clientes`).style.display = 'none'; // Muestra el select (display: block/inline-block, etc.)
          estados.style.display = 'none'; // Muestra el select (display: block/inline-block, etc.)
          empresas.style.display = '';

          fetch(baseUrl + 'serviciocliente/Listar_Empresas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
          })
            .then(response => response.json())
            .then(data => {
              empresas.innerHTML = '<option value="">Seleccione</option>';

              data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.nombre_empresa;
                empresas.appendChild(option);
              });

              // Inicializar Select2 (requiere jQuery).
              if (window.$ && $.fn.select2) {
                $(empresas).select2({
                  placeholder: 'Seleccione una opción',
                  allowClear: true
                });
              }
            })
            .catch(error => {
              console.error('Error en AJAX:', error);
              alert('Error al cargar los datos.');
            });
        }

      } else if (valorSeleccionado === 'Estado') {
        if (estados) {
          estados.style.display = '';
          // Si necesitas cargar datos vía AJAX, hazlo de forma similar.
        }
      }
    });
  }

  async function listar_cotizaciones(tipo, fecha_inicial, fecha_final, estado, cliente, empresa, id) {
    /* Funcion para enviar los datos */
    $('#load_info').css('display', 'flex'); // Mostrar mensaje de carga
    let dato = new FormData();
    dato.append('tipo', tipo);
    dato.append('fecha_inicial', fecha_inicial);
    dato.append('fecha_final', fecha_final);
    dato.append('estado', estado);
    dato.append('cliente', cliente);
    dato.append('empresa', empresa);
    try {
      const response = await fetch($('#base_url').val() + 'serviciocliente/consultar_cotizaciones', {
        method: 'POST',
        body: dato,
        cache: 'no-cache',
      });
      const data = await response.json();
      if (data) {
        $('#load_info').css('display', 'none'); // Mostrar mensaje de carga
        let tbody = document.getElementById('tbl_cotizaciones');
        tbody.innerHTML = '';
        let esatdo_autorizado = '';
        let col_estatus = '';
        let cot_itr = '';
        let n_cotizacion = '';
        let btn_editar = '';
        let Prioridad = '';
        var btn_edita_tarifa = ''; //EDICION POR LA SUBASTA

        data.resultado.forEach(element => {
          const fila = document.createElement('tr');
          if (element.estado_estudio === 'Sin Estado') {
            if (element.estado === 'Pendiente') {
              col_estatus = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">sin gestionar</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (element.estado === 'por autorizar') {
              col_estatus = `<span  data-toggle="tooltip" style="color:#ec1f00;">${element.estado}</span>`;
            } else {
              col_estatus = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">sin gestionar</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
            }
          } else {
            if (element.estado_estudio === 'pendiente_iniciar') {
              col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">Estudio Pendiente Iniciar</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (element.estado_estudio === 'iniciado') {
              col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">Estudio Iniciado</span><span class="ms-1" data-feather="info" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (element.estado_estudio === 'Pendiente') {
              col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">Estudio Pendiente</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (element.estado_estudio === 'Rechazado') {
              col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Estudio Rechazado</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (element.estado_estudio === 'Aprobado') {
              col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">Estudio Aprobado</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (element.estado_estudio === 'vencida') {
              col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Estudio Vencido</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (element.estado_estudio === 'Sin Estado') {
              col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">Sin Estado</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>`;
            }
          }

          // if (element.estado_autorizado === 'autorizado') {
          //   col_estatus = `< span  data - toggle="tooltip" style = "color:purple;" > ${ element.estado_autorizado }</span > `;
          // } else if (element.estado_autorizado === 'por autorizar') {
          //   col_estatus = `< span  data - toggle="tooltip" style = "color:red;" > ${ element.estado_autorizado }</span > `;
          // } else {
          //   col_estatus = `< td class="text" ></td > `;
          // }

          /* Consultas de estado de las solicitudes */
          if (element.estado_autorizacion === 'F1') {
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary" ><span class="badge-label">Realizada</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span > `;
          } else if (element.estado_autorizacion === 'F2') {
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary" ><span class="badge-label">Entregada</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span > `;
          } else if (element.estado_autorizacion === 'F4') {
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger" ><span class="badge-label">Pérdida</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span > `;
          } else if (element.estado_autorizacion === 'F3') {
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-success" ><span class="badge-label">Ganada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span > `;
          } else if (element.estado_autorizacion === 'F5') {
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger" ><span class="badge-label">Cancelada</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span > `;
          } else if (element.estado_autorizacion === 'F6') {
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning" ><span class="badge-label">Rechazada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span > `;
          }

          /* Validar si la solicitud es Itr */
          if (element.itr === 'Si') {
            cot_itr = `<span class="badge badge-phoenix badge-phoenix-success float-right" > SI</span > `;
          } else {
            cot_itr = `<span class="badge badge-phoenix badge-phoenix-primary float-right" > NO</span > `;
          }

          if (element.prioritaria === 'Propuesta') {
            Prioridad = `<span class="badge badge-phoenix badge-phoenix-warning float-right" > <a href="#" id="btn_aprobar_solicitud" data-id="${element.nundoc_solicitud}" class="text-decoration-none text-warning" title="Aprobar solicitud">${element.prioritaria}</a></span > `;
          } else if (element.prioritaria === null) {
            Prioridad = `<span class="badge badge-phoenix badge-phoenix-info float-right" > No marcada</span > `;
          } else {
            Prioridad = `<span class="badge badge-phoenix badge-phoenix-primary float-right" > ${element.prioritaria}</span > `;
          }

          const columnaEstado = document.createElement('td');
          columnaEstado.innerHTML = col_estatus;
          const columnaEstado_Autorizacion = document.createElement('td');
          columnaEstado_Autorizacion.innerHTML = esatdo_autorizado;
          const columnaItr = document.createElement('td');
          columnaItr.innerHTML = cot_itr;
          const columnaNum_Cotizacion = document.createElement('td');
          // columnaNum_Cotizacion.innerHTML = `<a href="#" id=btn_ver_solicitud" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}" data-id3="${id}" aria-controls="offcanvasRight" class="text-decoration-none"> N°${element.nundoc_solicitud}</a > `;
          columnaNum_Cotizacion.innerHTML = `
              <div class="dropdown">
                <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.nundoc_solicitud}</a>
                <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
                  <a class="dropdown-item fw-bold" href="#" id="btn_ver_solicitud" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}" data-id3="${id}"><span class="uil uil-file-search-alt"></span> Detalle solicitud servicio</a>
                  ${(element.estado == 'En_subasta' && element.estado_secundario == 'pendiente_aprobacion_sac' || element.estado_secundario == 'aprueba_flete_sac' || element.estado_secundario == 'no_aprueba_ge') ? `<a class="dropdown-item fw-bold" href="#" id="btn-aprobar-tarifa-subasta" data-id="${element.nundoc_solicitud}"><span class="uil uil-feedback"></span> Aprobar Tarifa</a>` : ``}
                  <a class="dropdown-item fw-bold" href="#"><span class="uil uil-transaction"></span> Aprobar Subasta</a> 
                  <a class="dropdown-item fw-bold" href="#" id="btn_cancelar_solicitud_servicio"  data-id="${element.nundoc_solicitud}"><span class="uil uil-feedback"></span> Anular solicitud servicio</a>
                  ${(element.prioritaria === "Propuesta" || element.prioritaria === "Aprobada") ? '' : ` <div class="dropdown-divider"></div> <a class="dropdown-item fw-bold" id="btn-solicitar-prioridad" href="#" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}"> <span class="uil uil-bell"></span> Solicitar Prioridad </a>`}
                </div>
              </div>
          `;
          const columnaCliente = document.createElement('td');
          columnaCliente.innerHTML = element.nombre_cliente;
          const columnaMercancia = document.createElement('td');
          columnaMercancia.innerHTML = element.tipo_mercancia;
          const columnaPeso = document.createElement('td');
          columnaPeso.innerHTML = element.peso_neto_kg + 'Kg';
          const columnafecha = document.createElement('td');
          columnafecha.innerHTML = element.fecha_solicitud_servicio;
          const columnaServicio = document.createElement('td');
          columnaServicio.innerHTML = element.tipo_transporte;
          const columnaPrioridad = document.createElement('td');
          columnaPrioridad.innerHTML = Prioridad;
          //Empresas
          const columnaAcciones = document.createElement('td');
          columnaAcciones.innerHTML = element.nombre_empresa;

          fila.appendChild(columnaNum_Cotizacion);
          fila.appendChild(columnaItr);
          fila.appendChild(columnaCliente);
          fila.appendChild(columnaMercancia);
          fila.appendChild(columnaPeso);
          fila.appendChild(columnaServicio);
          fila.appendChild(columnafecha);
          fila.appendChild(columnaEstado_Autorizacion);
          fila.appendChild(columnaEstado);
          fila.appendChild(columnaPrioridad);
          fila.appendChild(columnaAcciones);
          tbody.appendChild(fila);
        });
      } else {
        // $('#load_info').css('display', 'none'); // Mostrar mensaje de carga
        // const fila = document.createElement('tr');
        // let tbody = document.getElementById('tbl_cotizaciones');
        // tbody.innerHTML = '';
        // const columnaSinDatos = document.createElement('td');
        // columnaSinDatos.colSpan = '11';
        // columnaSinDatos.style.fontBold = 'bold';
        // columnaSinDatos.innerHTML = `<span class="uil uil-list-ui-alt"></span> Sin resultados`;
        // fila.appendChild(columnaSinDatos);
        // tbody.appendChild(fila);
      }
    } catch (error) {
      console.error('Error en la primera solicitud:', error);
      console.log('error no inserta');
      throw error;
    } finally {
      // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
    }
  }

  function Aprobar_Tarifa() {
    var sidflete = $("#ssidflete").val();
    var subasta = $("#ssubnum").val();
    var cliente = $("#sscliente").val();
    var tarifa = $("#sstarifasold").val().replace(/,/g, "");
    var estado = $("#ssaprobar").val();
    var idpareja = $("#idpareja_origen_destino").val();
    //update en el campo nuevo de estado estado_sac
    //insert en el campo nuevo de detalle de mercancia
    // tarifa_subasta  responsable
    var dato = {
      sidflete: sidflete,
      subasta: subasta,
      tarifa: tarifa,
      estado: estado,
      idpareja: idpareja,
      action: 'Aprueba_Sac'
    };
    $.ajax({
      url: $("#id_url_ajax").val() + "libs/servicio_cliente_ajax.php",
      type: 'POST',
      data: dato,
      dataType: 'json',
      success: function (data) {
        alert('Se Registro Exitosamente!!!');
        $("html, body").animate({
          scrollTop: 0
        }, 600);
        setTimeout(function () {
          location.reload(false);
        }, 800);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('error error');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
  }
}
