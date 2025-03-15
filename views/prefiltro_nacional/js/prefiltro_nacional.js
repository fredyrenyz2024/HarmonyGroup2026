window.web = document.querySelector('#web');
window.user_satelite = document.querySelector('#user_satelite');
window.clave = document.querySelector('#clave');
window.nompro = document.querySelector('#nompro');
window.docupro = document.querySelector('#docupro');
window.nomtene = document.querySelector('#nomtene');
window.docutene = document.querySelector('#docutene');
window.nomcondu = document.querySelector('#nomcondu');
window.docucondu = document.querySelector('#docucondu');
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

  const SELECTFILTRO = "todos";
  Filtro(window.VENTANA);

  let datosnuevos = {
    web: '',
    user_satelite: '',
    clave: '',
    // nompro: '',
    docupro: '',
    // nomtene: '',
    docutene: '',
    // nomcondu: '',
    docucondu: '',
  };

  let numero = 0;

  const hoy = new Date(); // Obtener la fecha actual
  const fechaHoy = hoy.toISOString().split('T')[0]; // Formatear como YYYY-MM-DD
  document.addEventListener("click", async e => {
    if (e.target.matches(`#campo-${window.VENTANA}-buscar`) || e.target.matches(`#campo-${window.VENTANA}-buscar *`)) {
      Filtro();
    }
  });

  if (window.VENTANA === 8) {
    /* Validaciones de los filtros a mostrar */
    $(`#campo-${window.VENTANA}-filtro`).off("change").on("change", function () {
      let valorSeleccionado = $(this).val();

      // Verifica si los elementos existen antes de manipularlos
      let $clientes = $(`#campo-${window.VENTANA}-clientes`);
      let $empresas = $(`#campo-${window.VENTANA}-empresas`);

      if (valorSeleccionado === "Clientes") {
        // Si Empresas está visible, la ocultamos
        if ($empresas.is(":visible")) {
          $empresas.hide().val(""); // Ocultar y resetear selección
        }

        if ($clientes.is(":visible")) {
          $clientes.hide().val(""); // Ocultar y resetear selección
        }
        // Mostramos el select de Clientes
        $clientes.show();

        // Cargar clientes por AJAX
        $.ajax({
          url: $('#base_url').val() + 'serviciocliente/Listar_Clientes',
          type: "POST",
          dataType: "json",
          success: function (data) {
            $clientes.empty().append('<option value="">Seleccione</option>');
            $.each(data, function (index, item) {
              $clientes.append(`<option value="${item.id}">${item.nombre}</option>`);
            });

            // Inicializa Select2 en el select de clientes
            $clientes.select2({
              placeholder: 'Seleccione una opción',
              allowClear: true,
            });
          },
          error: function (xhr, status, error) {
            console.error("Error en AJAX:", status, error);
            alert("Error al cargar los datos.");
          }
        });

      } else if (valorSeleccionado === "Empresas") {
        // Si Clientes está visible, lo ocultamos
        if ($clientes.is(":visible")) {
          $clientes.hide().val(""); // Ocultar y resetear selección
        }

        if ($empresas.is(":visible")) {
          $empresas.hide().val(""); // Ocultar y resetear selección
        }
        // Mostramos el select de Empresas
        $empresas.show();

        // Cargar empresas por AJAX
        $.ajax({
          url: $('#base_url').val() + 'serviciocliente/Listar_Empresas',
          type: "POST",
          dataType: "json",
          success: function (data) {
            $empresas.empty().append('<option value="">Seleccione</option>');
            $.each(data, function (index, item) {
              $empresas.append(`<option value="${item.id}">${item.nombre_empresa}</option>`);
            });

            // Inicializa Select2 en el select de empresas
            $empresas.select2({
              placeholder: 'Seleccione una opción',
              allowClear: true,
            });
          },
          error: function (xhr, status, error) {
            console.error("Error en AJAX:", status, error);
            alert("Error al cargar los datos.");
          }
        });
      }
    });

  } else {
    //Colcoar otra ventana
  }

  //Solicitar prioridad para solicitudes
  document.addEventListener('click', async function (e) {  // 🔹 Escuchamos eventos de clic en toda la página
    if (e.target.matches("#btn_aprobar_solicitud") || e.target.closest("#btn_aprobar_solicitud")) {
      let enlace = e.target.closest('#btn_aprobar_solicitud');
      let dataId = enlace.getAttribute('data-id');

      const result = await Swal.fire({
        title: 'Seguro',
        text: '¿Desea aprobar la solicitud?',
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
        var datos = new FormData();
        datos.append('solicitud', dataId);
        datos.append('estado', "Aprobada");

        try {
          const response = await fetch($('#base_url').val() + 'serviciocliente/Aprobar_Prioridad', {
            method: 'POST',
            body: datos,
            cache: 'no-cache',
          });
          const data = await response.json();

          Swal.fire({
            title: "Mensaje!",
            text: data.message,
            icon: data.status === 200 ? "success" : "error",
            draggable: true
          });
          Filtro(window.VENTANA);

          if (data.ststus === 200) resetAll();
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      }
    }

    if (e.target.matches("#btn-solicitar-prioridad") || e.target.matches("#btn-solicitar-prioridad *")) {
      // Buscar el elemento padre con el id, en caso de que se haya clickeado un hijo
      const btn = e.target.closest("#btn-solicitar-prioridad");
      // Obtener el atributo 'data-id2'
      const numdoc_sol = btn.getAttribute('data-id2');

      /* Titulo del offcanva */
      myOffcanvas.updateTitle(`<span class="text-danger uil uil-bell"></span> Solicitar prioridad de solicitud de servicio`);

      myOffcanvas.updateContent(`
            <div class="d-flex justify-content-center">
              <h4>Solicitud de servicio: ${numdoc_sol}</h4>
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
                    <button class="btn btn-subtle-success btn-sm me-1 px-1 py-0" type="button" id="btn_save_propuesta" data-NumdocSolicitud="${numdoc_sol}"><span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar Prioridad</button>
                  </div>
                </div>
  
              </div>
            </div>
          `);
      myOffcanvas.show();
    }

    /* Guardar la solicitud de prioridad en operaciones */
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
        // Aplica el cambio solo si se confirma
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
            Filtro();
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

    if (e.target.matches("#btn-detalle-solicitud-servicio") || e.target.matches("#btn-detalle-solicitud-servicio *")) {

      // let padre = e.target.parentElement.parentElement;
      // Obtener el enlace (el elemento con el data-id)
      let enlace = e.target.closest('#btn-detalle-solicitud-servicio');
      // // Obtener el valor del atributo data-id
      let dataId = enlace.getAttribute('data-id');
      let dataId2 = enlace.getAttribute('data-id2');
      let dataId3 = enlace.getAttribute('data-id3');
      // Visualizar(dataId, dataId2, dataId3);

      // Definir dimensiones de la nueva ventana
      // const w = 1000;
      // const h = 1000;

      // Fixes dual-screen position                         Most browsers      Firefox
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

      // myOffcanvas.updateContent(`
      //   <h4>Contenido Actualizados: ${window.VENTANA}</h4> hola lucas solo contenido ventana

      //   <div class="container-fluid">
      //     <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
      //       <div class="row">
      //           <!-- Mostrar datos del cliente -->
      //         <div class="d-flex flex-wrap justify-content-start mt-2">
      //           <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
      //             <h6 class="mb-0 text-body-highlight me-2">Cliente</h6>
      //           </div>
      //         </div>
      //         <hr class="my-1 text-dark">
      //         <div id="cuerpo_cliente"><!-- Datos desde Javascript --></div>

      //       </div>
      //     </div>
      //   </div>
      //   `);
      // myOffcanvas.show();

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
  });

  async function Filtro() {
    if (SELECTFILTRO !== '') {
      $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
      try {
        let data = new FormData();
        data.append('filtro', SELECTFILTRO);
        data.append('fecha_inicial', document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value);
        data.append('fecha_final', document.getElementById(`campo-${window.VENTANA}-fecha_final`).value);
        data.append('estado', "Todas");
        // data.append('cliente', document.getElementById(`campo-${window.VENTANA}-clientes`).value ? document.getElementById(`campo-${window.VENTANA}-clientes`).value === "" : '');
        data.append('cliente', $(`#campo-${window.VENTANA}-clientes`).length > 0 ? $(`#campo-${window.VENTANA}-clientes`).val() || "" : "");
        // data.append('empresa', document.getElementById(`campo-${window.VENTANA}-empresas`).value ? document.getElementById(`campo-${window.VENTANA}-empresas`).value === "" : '');
        data.append('empresa', $(`#campo-${window.VENTANA}-empresas`).length > 0 ? $(`#campo-${window.VENTANA}-empresas`).val() || "" : "");
        // await fetch($('#base_url').val() + 'prefiltro_nacional/Consultar_Solicitudes', {
        await fetch($('#base_url').val() + 'prefiltro_nacional/Consultar_Solicitudes', {
          method: 'POST',
          body: data,
        })
          .then(response => {
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
          })
          .then(function (data) {
            let tbody = document.getElementById('tbl-solicitudes');
            let clase_btn = '';
            let estado = '';
            let template = '';
            let toltip = '';
            let estadobtn = '';
            let itr = '';
            let Prioridad = '';
            let perfil = document.getElementById("perfil_id").value;
            if (data) {
              // console.log(data);
              template.innerHTML = '';
              data.forEach(element => {
                if (element.esoli === 'Realizada') {
                  clase_btn = 'success';
                  estado = 'Realizada';
                  toltip = 'Realizada';
                  estadobtn = 'disabled';
                } else if (element.esoli === 'En_subasta') {
                  clase_btn = 'info';
                  estado = 'Subasta';
                  toltip = 'Subasta';
                  estadobtn = '';
                } else if (element.esoli === 'Pendiente') {
                  // Se usar el estado pendiente porque este proviene de la tabla de solicitudes de servicio.
                  // } else if (element.esoli === null) {
                  clase_btn = 'warning';
                  estado = 'Pendiente';
                  toltip = 'Pendiente';
                  estadobtn = '';
                } else if (element.esoli === 'asignada') {
                  clase_btn = 'warning';
                  estado = 'Asignada';
                  toltip = 'Asignada Solicitud Prefiltro';
                  estadobtn = '';
                } else if (element.esoli === 'en_tramite') {
                  clase_btn = 'warning';
                  estado = 'En tramite';
                  toltip = 'En tramite solicitud prefiltro';
                  estadobtn = '';
                } else if (element.esoli === 'aprobado_prefiltro') {
                  clase_btn = 'success';
                  estado = 'Aprobado prefiltro';
                  toltip = 'Aprobado prefiltro';
                  estadobtn = '';
                }
                if (element.itr === 'Si') {
                  itr = '<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">SI</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>';
                } else {
                  itr = '<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">NO</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>';
                }

                if (element.prioritaria === 'Propuesta') {
                  if (perfil === '1') {
                    Prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label"><a href="#" id="btn_aprobar_solicitud" data-id="${element.nundoc_solicitud}" class="text-decoration-none text-primary" title="Aprobar solicitud">${element.prioritaria}</a></span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>`;
                  } else {
                    Prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">${element.prioritaria}</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>`;
                  }
                } else if (element.prioritaria === 'Aprobada') {
                  Prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.prioritaria}</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>`;
                } else {
                  Prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">Sin proponer</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
                }

                template += `
              <tr>
                <!--<td class='text-${clase_btn}'>
                   <center>
                    <span class="mdi mdi-dot-circle icon" data-toggle="tooltip" title="${element.esoli !== null ? element.esoli : 'Pendiente'}"></span>
                   </center> data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop"
                </td>-->

                  <td class="cell-detail">
                      <div class="dropdown">
                        <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none fw-bold" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">N°${element.elid}</a>
                        <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
                          <a class="dropdown-item fw-bold" href="#" id="solicitar_estudio_seguridads" onclick="preestudio(this);" data-id="${element.n_cotizacion}" 
                          data-id2="${element.nundoc_solicitud}" data-id3="${element.nombre_cliente}" data-id4="${element.item}" data-id5="${element.tipo_mercancia}"
                          data-id6="${element.flete}" data-id7="${element.peso_neto_tn}" data-id8="${element.tipo_servicio_mer}"  data-id9="${element.total_tarifa}"
                          data-id10=""${element.origen_rndc}"  data-id11="${element.itr}" data-id12="${element.empresa}" onclick="reiniciar_contador();" ${estadobtn}><span class="uil uil-envelope-send"></span> Solicitar Estudio Seguridad</a>
                          <a class="dropdown-item fw-bold" href="#" id="btn-detalle-solicitud-servicio" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}" data-id3="${id}"><span class="uil uil-file-search-alt"></span> Detalle Solicitud</a>
                          ${(element.prioritaria === "Propuesta" || element.prioritaria === "Aprobada") ? '' : `<a class="dropdown-item fw-bold" id="btn-solicitar-prioridad" href="#" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}"> <span class="uil uil-bell"></span> Solicitar Prioridad </a>`}
                          <!--<div class="dropdown-divider"></div> 
                          <a class="dropdown-item" href="#">Separated link</a>-->
                        </div>
                      </div>
                          <!--COT-SS-BN
                    <span>${element.n_cotizacion} - ${element.elid} - ${element.item} </span>
                    <span class="text-success" style="font-weight:800;">${element.tipo_servicio_mer}</span>-->
                </td>
                <td>
                  <span class="text-success" style="font-weight:800;">${element.tipo_servicio_mer}</span>   
                </td>

                <td>
                  <span>${itr}</span>
                </td>

                <td style="width: auto; white-space: nowrap; color:black;">
                    <span> ${element.nombre_cliente} ${element.nit}</span>
                </td>

                <td style="width: auto; white-space: nowrap; color:black;">
                    <span>${element.tipo_mercancia}</span>
                </td>

                <td style="width: auto; white-space: nowrap; color:black;">
                    <span>${element.nombre}</span>
                </td>

                <td style="width: auto; white-space: nowrap; color:black;">
                  <span title="Peso Neto kg">${formatNum(element.peso_kg)} kg</span>
                </td>

                <td style="width: auto; white-space: nowrap; color:black;">
                  <span><b>Origén:</b> ${element.origen_solicitud} - <b>Destino:</b> ${element.destino_solicitud}</span>
                </td>

                <td class="cell-detail text-center" style="width: auto; white-space: nowrap; color:black;">
                  <span>${element.fecha} ${element.hora_creacion} </span>
                </td>
                
                <td class="cell-detail text-center" style="width: auto; white-space: nowrap; color:black;">
                    ${Prioridad}
                </td>
              
                <td style="width: auto; white-space: nowrap; color:black;">
                     <!--<span class="badge badge-phoenix badge-phoenix-${clase_btn}" title="${toltip}">${element.numero_placas > 0 ? 'Placas asignadas' : 'Sin asignar'}</span>-->
                     ${element.numero_placas > 0 ? '<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">Placas asignadas</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>' : '<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">Sin asignar</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>'}
                </td>

                <!--<td   style="text-align: center;vertical-align: middle;width: auto;white-space: nowrap;">
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-success" type="button" onclick="preestudio(this);" data-id="${element.n_cotizacion}" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop"
                        data-id2="${element.nundoc_solicitud}" data-id3="${element.nombre_cliente}" data-id4="${element.item}" data-id5="${element.tipo_mercancia}"
                        data-id6="${element.flete}" data-id7="${element.peso_neto_tn}" data-id8="${element.tipo_servicio_mer}"  data-id9="${element.total_tarifa}"
                        data-id10=""${element.origen_rndc}"  data-id11="${element.itr}" onclick="reiniciar_contador();" ${estadobtn}>
                        <span class="text-white uil uil-plus-square"></span>
                      </button>

                     <button class="btn btn-info" type="button" onclick="consulta_coti(this)"; data-hint="" data-id="${element.n_cotizacion}"  data-id2="${element.nundoc_solicitud}"  
                      data-id3="${element.idnegocio}" data-id4="${element.cant_vehiculo}" data-id5="${element.cant_disponible}">
                        <span class="icon mdi mdi-eye input-md" data-toggle="modal"data-target="#consulta_solicitud" title="Consultar solicitud de servicio"></span>
                     </button>

                     <button type="button" class="btn btn-warning mdi mdi-edit" data-placement="top" onclick="status(this)"; data-hint="" data-id="${element.n_cotizacion}"  data-id2="${element.nundoc_solicitud}">
                        <span class="icon mdi mdi-balance input-md"data-toggle="modal" data-target="#status" title="status"></span>
                    </button>
                    </div>
                </td>-->
            </tr>`;
                tbody.innerHTML = template;
              });
            } else {
              tbody.innerHTML = '';
            }
          })
          .catch(error => {
            alert(error);
          });
      } catch (error) {
        alert('Error de trucaht' + error);
      } finally {
        $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    }
  }
}

// function preestudio(element) {
//   $('#cuerpo_lista2').html('');
//   $('#totalfle').val('');
//   $('#tottarifa').val('');
//   // let offcanvas = new bootstrap.Offcanvas(document.getElementById('staticBackdrop'));
//   var elemento = $(element);
//   var cotiza = elemento.data('id');
//   var num = elemento.data('id2');
//   var cliente = elemento.data('id3');
//   var item = elemento.data('id4');
//   var pareja = elemento.data('id5');
//   var flete = elemento.data('id6');
//   var pesoneto = elemento.data('id7'); //peso bruto tonelada
//   var tipo_servicio = elemento.data('id8');
//   var tarifa = elemento.data('id9');
//   var origen = elemento.data('id10');
//   var itr = elemento.data('id11');
//   var empresa = elemento.data('id12');
//   $("#empresa_cliente").val(empresa);
//   listar_responsables();

//   /* Titulo del offcanva */
//   myOffcanvas.updateTitle(`<span class="text-dark uil uil-car"></span> Consultar vehículo`);

//   /* Contenido del offcanva */
//   myOffcanvas.updateContent(`
//     <div class="d-flex justify-content-center align-items-center w-100">
//       <div class="row w-100">
//         <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
//           <label>N° solicitud</label>
//           <input type="text" id="servicio_base" class="form-control form-control-sm text-center" disabled>
//         </div>

//         <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
//           <label class="text-center">Tipo servicio</label>
//           <input type="text" id="tipo_base" class="form-control form-control-sm text-center" disabled>
//         </div>

//         <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
//           <label>Placa</label>
//           <input type="text" id="placa" class="form-control form-control-sm text-center">
//           <input type="hidden" id="proceso_itr" class="form-control form-control-sm text-center">
//         </div>

//         <div class="col-xs-3 col-md-3 col-sm-3 col-lg-3">
//           <br>
//           <button class="btn btn-primary btn-sm" onclick="ValidacionReglaNegocio();" style="width: 100%;">
//             <span class="uil uil-search"></span> Buscar
//           </button>
//         </div>

//         <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
//           <input type="hidden" id="origen_base" class="form-control form-control-sm" readonly="readonly" name="origen_de_base">
//           <input type="hidden" id="empresa_cliente" class="form-control form-control-sm" readonly="readonly" name="empresa_cliente">
//         </div>
//       </div>
//     </div>

//       <div class="offcanvas-body">
//     <div id="nexos_messages_popup"></div>
//     <!--CABECERA-->
//     <h4 id="nexos_messages_b1"></h4>
//     <h4 id="nexos_messages_b2"></h4>
//     <div id="historicos"></div>
//     <div id="mensaje_itr"></div>

//     <div class="row">
//       <!-- <label id="historico" style="font-weight:700;"></label> -->
//       <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//         <div id="historico"></div>
//         <div id="historico_vencido"></div>
//       </div>
//     </div>

//     <div class="row pt-2" id="controles_tipo">
//       <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12  thv" style="display:none;">
//         <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
//           <input type="hidden" id="estado_vehiculo">
//           <label><b>Tipo de operación:</b>&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//         </div>
//         <di class="d-flex justify-content-center">
//           <div id="divnuevo" class="col-xs-3 col-sm-3 col-md-3 col-lg-3" style="display:none;">
//             <input type="radio" id="nuevo" class="tipo_hoja" name="gender" value="1" style="width: 20px; height: 20px;">
//             <label for="nuevo" id="nuevo2">Nuevo</label>&nbsp;&nbsp;
//           </div>

//           <div id="divhabil" class="col-xs-3 col-sm-3 col-md-3 col-lg-3" style="display:none;">
//             <input type="radio" id="habil" class="tipo_hoja" name="gender" value="2" style="width: 20px; height: 20px;">
//             <label for="habil" id="habil2">Habilitar</label>&nbsp;&nbsp;
//           </div>

//           <div id="divactualiza" class="col-xs-3 col-sm-3 col-md-3 col-lg-3" style="display:none;">
//             <input type="radio" id="update" class="tipo_hoja" name="gender" value="3" style="width: 20px; height: 20px;">
//             <label for="update" id="update2">Actualizar</label>
//           </div>
//         </di>

//       </div>
//     </div>
//     <!--estados de prefiltro -->
//     <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12">
//       <input type="hidden" id="tiporadio" class="form-control input-sm">
//     </div>
//     <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12">
//       <label>Último estado (prefiltro):</label>
//       <input type="text" id="estado_prefiltron" class="form-control text-danger input-sm" disabled="disabled" style="border:0px; background-color:white; font-weight:700; text-align:left;  ">
//       <input type="hidden" id="solianterior" class="form-control input-sm">
//     </div>

//     <div class="col-xs-6 col-sm-12 col-md-12 col-lg-12" id="mensaje_vehiculo_bloquear"></div>
//     <div class="col-xs-6 col-sm-12 col-md-12 col-lg-12" id="mensaje_inciado"></div>
//     <!--CUERPO EDITAR PREESTUDIO-->
//     <div class="row" style="padding-right:1px; padding-left:1px; padding-bottom:1px;  padding-top:1px;" id="diveditardatos">
//       <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//         <!--	<p class="text-left" style="font-size:10pt; font-weight:500; color:#2E2E2E;">Señor Usuario recuerde que podra actualizar datos siempre y cuando su solicitud  este en proceso por parte del área de seguridad</p> -->
//       </div>
//     </div>
//     <!--CUERPO DEL VEHICULO PREESTUDIO CREAR PREESTUDIO-->
//     <div class="row" id="divdatos">
//       <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//         <div id="accordion1" class="panel-group accordion">
//           <!-- Acordeon Itr -->
//           <div class="panel panel-default hello" id="datos_proveedores" style="display:none;">
//             <div class="panel-heading">
//               <h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion1" href="#collapseitr" class="collapsed"><i class="icon mdi mdi-chevron-down"></i>Datos ITR</a></h4>
//             </div>
//             <div id="collapseitr" class="panel-collapse collapse">
//               <div class="panel-body" style="padding: 1px 1px 1px;">
//                 <!-- Validar los datos del vehiculo para el otro servio itr -->
//                 <div class="datos_proveedores">
//                   <table cellpadding="0" cellspacing="0" width="100%" border="0" style="background-color: #332D2D;color:#fff;">
//                     <tbody>
//                       <tr>
//                         <td class="celda_titulo2 text-center" style="margin:25px;">
//                           <b>Datos del Vehículo</b>
//                         </td>
//                       </tr>
//                       <tr>
//                       </tr>
//                     </tbody>
//                   </table>
//                   <table cellpadding="0" cellspacing="0" width="100%" id="tbl_datos_prefiltro">
//                     <tbody>
//                       <tr class="text-center active">
//                         <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Nombre Propietario</th>
//                         <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Documento</th>
//                         <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Celular</th>
//                         <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Acción</th>
//                       </tr>
//                       <tr>
//                         <td id="vpropi" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
//                         <td id="vpdocumento" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
//                         <td id="cpropi" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
//                         <td id="accion_propietario" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
//                       </tr>
//                       <tr>
//                       </tr>
//                       <tr class="text-center active">
//                         <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Nombre Poseedor</th>
//                         <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Documento</th>
//                         <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Celular</th>
//                         <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Acción</th>
//                       </tr>
//                       <tr>
//                         <td id="vtene" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
//                         <td id="vtdocumento" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
//                         <td id="ctene" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
//                         <td id="accion_poseedor" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
//                       </tr>
//                       <tr>
//                       </tr>
//                       <tr class="text-center active">
//                         <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Nombre Conductor</th>
//                         <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Documento</th>
//                         <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Celular</th>
//                         <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Acción</th>
//                       </tr>
//                       <tr>
//                         <td id="vcondu" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
//                         <td id="vcdocumento" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
//                         <td id="ccondu" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
//                         <td id="accion_conductor" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
//                       </tr>
//                       <tr>
//                       </tr>
//                       <tr class="text-center active">
//                         <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Nombre Propietario Trailer</th>
//                         <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Documento Propietarioi Trailer</th>
//                         <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Celular</th>
//                         <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Acción</th>
//                       </tr>
//                       <tr>
//                         <td id="ptcondu" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
//                         <td id="ptcdocumento" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
//                         <td id="cpropt" class="text-left" style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;"> </td>
//                         <td id="accion_propietario_trailer" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div class="accordion" id="hvpreestudio" style="display:none;">
//             <div class="accordion-item border-top">
//               <h2 class="accordion-header" id="headingOne">
//                 <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Datos del vehículo</button>
//               </h2>
//             </div>

//             <div class="accordion-collapse collapse" aria-labelledby="headingOne" id="collapseOne">
//               <div class="accordion-body pt-0">
//                 <div class="row">
//                   <div class="sms"></div>
//                   <div class="col-xs-12 col-md-6 col-sm-6 col-lg-6">
//                     <label>Placa Vehiculo&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="text" id="placag" class="form-control input-xs" disabled="disabled">
//                   </div>
//                   <div class="col-xs-12 col-md-6 col-sm-6 col-lg-6">
//                     <label>Web Sátelital&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="text" id="web" name="web" class="form-control input-xs">
//                   </div>
//                   <div class="col-xs-12 col-md-6 col-sm-6 col-lg-6">
//                     <label>Usuario&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="text" id="user_satelite" name="user_satelite" class="form-control input-xs">
//                   </div>
//                   <div class="col-xs-12 col-md-6 col-sm-6 col-lg-6">
//                     <label>Clave&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="text" id="clave" name="clave" class="form-control input-xs">
//                   </div>
//                   <div class="col-xs-6 col-md-6 col-sm-6 col-lg-6">
//                     <label>Documento Propietario&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="number" id="docupro" name="docupro" class="form-control input-xs">
//                   </div>
//                   <div class="col-xs-6 col-md-6 col-sm-6 col-lg-6">
//                     <label>Nombre Propietario&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="text" id="nompro" name="nompro" class="form-control input-xs">
//                   </div>
//                   <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12">
//                     <div id="mensaje_propietario_existe"></div>
//                   </div>
//                   <div class="col-xs-6 col-md-6 col-sm-6 col-lg-6">
//                     <label>Documento Poseedor&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="number" id="docutene" name="docutene" class="form-control input-xs">
//                   </div>
//                   <div class="col-xs-6 col-md-6 col-sm-6 col-lg-6">
//                     <label>Nombre Poseedor&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="text" id="nomtene" name="nomtene" class="form-control input-xs">
//                   </div>
//                   <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12">
//                     <div id="mensaje_poseedor_existe"></div>
//                   </div>
//                   <div class="col-xs-6 col-md-6 col-sm-6 col-lg-6">
//                     <label>Documento Conductor&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="number" id="docucondu" name="docucondu" class="form-control input-xs" onChange="javascript:referencias_prefiltro();">
//                   </div>
//                   <div class="col-xs-6 col-md-6 col-sm-6 col-lg-6">
//                     <label>Nombre Conductor&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="text" id="nomcondu" name="nomcondu" class="form-control input-xs">
//                   </div>
//                   <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12">
//                     <div id="mensaje_conductor_existe"></div>
//                   </div>
//                   <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12 mt-2">
//                     <div class="border border-1 p-2">
//                       <h5 style="font-weight: bold;">Datos Trailer&nbsp;&nbsp;&nbsp;&nbsp; <input type="checkbox" id="propietario_obligatorio" style="transform: scale(1.5);"></h5>
//                     </div>
//                   </div>
//                   <div class="col-xs-12 col-md-4 col-sm-4 col-lg-4">
//                     <label id="etiqueta_placa_trailer">Placa Trailer </label>
//                     <input type="text" id="placat" name="placat" disabled class="form-control input-xs">
//                   </div>
//                   <div class="col-xs-12 col-md-4 col-sm-4 col-lg-4">
//                     <label id="etiqueta_documento_trailer">Documento Propietario Trailer</label>
//                     <input type="number" id="docproptrailer" name="docproptrailer" class="form-control input-xs" disabled>
//                   </div>
//                   <div class="col-xs-12 col-md-4 col-sm-4 col-lg-4">
//                     <label id="estiqueta_propietario_trailer">Nombre Propietario Trailer</label>
//                     <input type="text" id="nomproptrailer" name="nomproptrailer" class="form-control input-xs" disabled>
//                   </div>
//                   <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12">
//                     <div id="mensaje_trailer_existe"></div>
//                     <div id="mensaje_trailer_obligatorio" style="margin-top: 5px;"></div>
//                   </div>
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <input type="hidden" id="cab" value="1">
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <!-- REFERENCIAS PARA VEHICULO NUEVO -->
//           <div class="accordion" id="panel_referenciaNEW" style="display:none;">
//             <div class="accordion-item border-top">
//               <h2 class="accordion-header" id="collapsereferencianew">
//                 <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwos" aria-expanded="true" aria-controls="collapseTwos">Referencias laborales</button>
//               </h2>
//             </div>
//             <div id="collapseTwos" class="accordion-collapse collapse" aria-labelledby="collapsereferencianew">
//               <div class="accordion-body pt-0">
//                 <!--REFERENCIAS PARA VEHICULOS NUEVOS -->
//                 <div class="col-xs-6 col-sm-2 col-md-2 col-lg-2" style="margin-top:10px; text-align:center; ">
//                   <button class="btn btn-info btn-sm text-center" data-toggle="tooltip" data-placement="top" title="Agregar fila" id="agregar_fila">
//                     <span class="uil uil-file-plus-alt"></span>
//                   </button>
//                 </div>
//                 <hr />
//                 <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
//                   <h3>
//                     <p class="text-center text-info">Referencias laborales</p>
//                   </h3><br>
//                 </div>
//                 <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                   <table class="table table-sm table-bordered" id="table_mercancia">
//                     <thead style="border-color:blue;"></thead>
//                     <tbody></tbody>
//                   </table>
//                 </div>
//                 <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                   <input type="hidden" id="ref" value="2">
//                 </div>
//               </div>
//             </div>
//           </div>
//           <!--FIN REFERENCIA PARA VEHICULOS NUEVOS -->

//           <!--REFERENCIAS PARA ACTUALIZAR y HABILITAR  -->
//           <div class="accordion" id="panel_referenciahv" style="display:none;">
//             <div class="accordion-item border-top">
//               <h2 class="accordion-header" id="headingReferer">
//                 <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsereferencia" aria-expanded="true" aria-controls="collapsereferencia">Referencias Empresariales</button>
//               </h2>
//             </div>
//             <div id="collapsereferencia" class="accordion-collapse collapse" aria-labelledby="headingReferer">
//               <div class="accordion-body pt-0">
//                 <input type="hidden" id="idconductor">
//                 <div class="row">
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <span class="badge badge-pill badge-primary">1</span>
//                   </div>

//                   <div class="col-xs-12 col-sm-12 col-md-12  REmpresarial8">
//                     <label>Empresa 1:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="text" class="form-control input-sm" id="referencias_empresariales1" onblur="mayuscula(this);">
//                     <label id="error_referencia_empresarial2"></label>
//                   </div>

//                   <div class="col-xs-6 col-sm-6 col-md-6">
//                     <label>Fecha Ingreso:</label>
//                     <input type="date" id="fingreso1" class="form-control input-sm">
//                   </div>

//                   <div class="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
//                     <label>Fecha Retiro:</label>
//                     <input type="date" id="fretiro1" class="form-control input-sm">
//                   </div>

//                   <div class="form-group col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <label>Persona Contacto:</label>
//                     <input type="text" id="contacto_ref1" placeholder="Nombre Contacto" class="form-control input-sm" onblur="mayuscula(this);">
//                     <label id="error_contacto"></label>
//                   </div>

//                   <div class="form-group col-xs-12 col-sm-4 col-md-4 col-lg-4">
//                     <label>Celular Empresa:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="int" id="celular_ref1" placeholder="Celular Empresa" maxlength="10" class="form-control input-sm">
//                     <label id="error_celularref1"></label>
//                   </div>

//                   <div class="form-group col-xs-12 col-sm-4 col-md-4  col-lg-4">
//                     <label>Cargo:</label>
//                     <input type="text" id="cargo_ref1" placeholder="Cargo" class="form-control input-sm" onblur="mayuscula(this);">
//                     <label id="error_cargo"></label>
//                   </div>
//                   <div class="form-group col-xs-12 col-sm-4 col-md-4  col-lg-4">
//                     <label>Antiguedad</label>
//                     <input type="number" id="anti_ref1" min="0" placeholder="Antiguedad1" class="form-control input-sm">
//                   </div>
//                   <input type="hidden" id="idrl1">
//                 </div>
//                 <div class="row">
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <span class="badge badge-pill badge-primary">2</span>
//                   </div>

//                   <div class="col-xs-12 col-sm-12 col-md-12  REmpresarial8">
//                     <label>Empresa 2:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="text" class="form-control input-sm" id="referencias_empresariales2" onblur="mayuscula(this);">
//                     <label id="error_referencia_empresarial2"></label>
//                   </div>

//                   <div class="col-xs-6 col-sm-6 col-md-6">
//                     <label>Fecha Ingreso:</label>
//                     <input type="date" id="fingreso2" class="form-control input-sm">
//                   </div>

//                   <div class="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
//                     <label>Fecha Retiro:</label>
//                     <input type="date" id="fretiro2" class="form-control input-sm">
//                   </div>

//                   <div class="form-group col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <label>Persona Contacto:</label>
//                     <input type="text" id="contacto_ref2" placeholder="Nombre Contacto" class="form-control input-sm" onblur="mayuscula(this);">
//                     <label id="error_contacto"></label>
//                   </div>

//                   <div class="form-group col-xs-12 col-sm-4 col-md-4 col-lg-4">
//                     <label>Celular Empresa:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="int" id="celular_ref2" placeholder="Celular Empresa" maxlength="10" class="form-control input-sm">
//                     <label id="error_celularref1"></label>
//                   </div>

//                   <div class="form-group col-xs-12 col-sm-4 col-md-4  col-lg-4">
//                     <label>Cargo:</label>
//                     <input type="text" id="cargo_ref2" placeholder="Cargo" class="form-control input-sm" onblur="mayuscula(this);">
//                     <label id="error_cargo"></label>
//                   </div>
//                   <div class="form-group col-xs-12 col-sm-4 col-md-4  col-lg-4">
//                     <label>Antiguedad</label>
//                     <input type="number" id="anti_ref2" min="0" placeholder="Antiguedad2" class="form-control input-sm">
//                   </div>
//                   <input type="hidden" id="idrl2">
//                 </div>
//                 <div class="row">
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <span class="badge badge-pill badge-primary">3</span>
//                   </div>

//                   <div class="col-xs-12 col-sm-12 col-md-12  REmpresarial8">
//                     <label>Empresa 3:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="text" class="form-control input-sm" id="referencias_empresariales3" onblur="mayuscula(this);">
//                     <label id="error_referencia_empresarial2"></label>
//                   </div>

//                   <div class="col-xs-6 col-sm-6 col-md-6">
//                     <label>Fecha Ingreso:</label>
//                     <input type="date" id="fingreso3" class="form-control input-sm">
//                   </div>

//                   <div class="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
//                     <label>Fecha Retiro:</label>
//                     <input type="date" id="fretiro3" class="form-control input-sm">
//                   </div>

//                   <div class="form-group col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <label>Persona Contacto:</label>
//                     <input type="text" id="contacto_ref3" placeholder="Nombre Contacto" class="form-control input-sm" onblur="mayuscula(this);">
//                     <label id="error_contacto"></label>
//                   </div>

//                   <div class="form-group col-xs-12 col-sm-4 col-md-4 col-lg-4">
//                     <label>Celular Empresa:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="int" id="celular_ref3" placeholder="Celular Empresa" maxlength="10" class="form-control input-sm">
//                     <label id="error_celularref1"></label>
//                   </div>

//                   <div class="form-group col-xs-12 col-sm-4 col-md-4  col-lg-4">
//                     <label>Cargo:</label>
//                     <input type="text" id="cargo_ref3" placeholder="Cargo" class="form-control input-sm" onblur="mayuscula(this);">
//                     <label id="error_cargo"></label>
//                   </div>
//                   <div class="form-group col-xs-12 col-sm-4 col-md-4  col-lg-4">
//                     <label>Antiguedad</label>
//                     <input type="number" id="anti_ref3" min="0" placeholder="Antiguedad3" class="form-control input-sm">
//                   </div>
//                   <input type="hidden" id="idrl3">
//                 </div>
//               </div>
//             </div>
//           </div>

//           <!--REFERENCIAS PERSONALES solo para habilitar-actualizar -->
//           <div class="accordion" id="panel_refepersonal" style="display:none;">
//             <div class="accordion-item border-top">
//               <h2 class="accordion-header" id="headingReferer">
//                 <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsepersonal" aria-expanded="true" aria-controls="collapsepersonal">Persona Contacto y Referencia</button>
//               </h2>
//             </div>
//             <div id="collapsepersonal" class="accordion-collapse collapse">
//               <div class="accordion-body pt-0">
//                 <div class="row">
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <label><strong>Contacto en caso de emergencia</strong></label>
//                   </div>
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <span class="badge badge-pill badge-primary">1</span>
//                   </div>
//                   <div class="col-xs-12 col-sm-3 col-md-3 REmpresarial2">
//                     <label>Nombre Persona 1:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input class="form-control form-control-sm" id="referencias_personales1" onblur="mayuscula(this);">
//                     <label id="error_referencias_personales"></label>
//                   </div>
//                   <div class="col-xs-12 col-sm-3 col-md-3 FPersonal1">
//                     <label>Fecha 1:</label>
//                     <input type="date" id="fecha_personal1" class="form-control form-control-sm">
//                   </div>
//                   <div class="col-xs-12 col-sm-6 col-md-3 REmpresarial2">
//                     <label>Parentezco:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <select class="form-select form-select-sm" id="parenp1">
//                       <option value="" readonly="readonly">Seleccione una opción</option>
//                       <option value="1">Amigo/a</option>
//                       <option value="2">Hermano/a</option>
//                       <option value="3">Padre</option>
//                       <option value="4">Madre</option>
//                       <option value="5">Tio/a</option>
//                       <option value="6">Sobrino/a</option>
//                       <option value="7">Hijo/a</option>
//                       <option value="8">Espaso/a</option>
//                     </select>
//                     <label id="error_referencias_personales"></label>
//                   </div>
//                   <div class="col-xs-12 col-sm-6 col-md-3 REmpresarial2">
//                     <label>Teléfono:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="number" id="telefonop1" min="0" class="form-control form-control-sm" maxlength="10">
//                     <label id="error_referencias_personales"></label>
//                   </div>
//                   <div class="col-xs-12 col-sm-3 col-md-3 REmpresarial2">
//                     <input type="hidden" id="idrper1">
//                   </div>
//                 </div>
//                 <!-- Referencias personales -->
//                 <div class="row">
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <label><strong>Referencia personal</strong></label>
//                   </div>
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <span class="badge badge-pill badge-primary">2</span>
//                   </div>
//                   <div class="col-xs-12 col-sm-6 col-md-3 RPersonal2">
//                     <label>Nombre Persona 2:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="text" class="form-control form-control-sm" id="referencias_personales2" onblur="mayuscula(this);">
//                     <label id="error_referencias_personales"></label>
//                   </div>
//                   <div class="col-xs-12 col-sm-6 col-md-3 FRpersonal2">
//                     <label>Fecha Personal 2:</label>
//                     <input type="date" id="fecha_personal2" class="form-control form-control-sm" value="">
//                   </div>
//                   <div class="col-xs-12 col-sm-6 col-md-3 REmpresarial2">
//                     <label>Parentezco:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <select class="form-select form-select-sm" id="parenp2">
//                       <option value="" readonly="readonly">Seleccione una opción</option>
//                       <option value="1">Amigo/a</option>
//                       <option value="2">Hermano/a</option>
//                       <option value="3">Padre</option>
//                       <option value="4">Madre</option>
//                       <option value="5">Tio/a</option>
//                       <option value="6">Sobrino/a</option>
//                       <option value="7">Hijo/a</option>
//                       <option value="8">Espaso/a</option>
//                     </select>
//                     <label id="error_referencias_personales"></label>
//                   </div>
//                   <div class="col-xs-12 col-sm-6 col-md-3 REmpresarial2">
//                     <label>Teléfono:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="number" id="telefonop2" min="0" class="form-control form-control-sm" maxlength="10">
//                     <label id="error_referencias_personales"></label>
//                   </div>
//                   <div class="col-xs-12 col-sm-3 col-md-3 REmpresarial2">
//                     <input type="hidden" id="idrper2">
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div class="accordion" id="panel_solicitudes" style="display:none;">
//             <div class="accordion-item border-top">
//               <h2 class="accordion-header" id="headingDatosSolicitud">
//                 <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="true" aria-controls="collapsepersonal">Datos de la solicitud</button>
//               </h2>
//             </div>
//             <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingDatosSolicitud">
//               <div class="accordion-body pt-0">
//                 <!--MODAL SOLICITUDES SERVICIO - cargarlas -->
//                 <div id="solicitudservicio" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary" style="overflow-y:auto;">
//                   <div class=".modal-dialog-modal-lg.modal-dialog ">
//                     <div class="modal-content ">
//                       <div class="modal-header">
//                         <button type="button" id="cancel" class="close md-close"><span class="mdi mdi-close"></span></button>
//                         <h3 class="modal-title">
//                           <label style="font-weight:900; margin-top:20px;">
//                             Solicitudes de servicio
//                           </label>
//                         </h3>
//                       </div>
//                       <div class="modal-body" style=" margin-top:20px; margin-bottom:20px;  margin-right:20px;  margin-left:20px;">
//                         <div id="nexos_messages_popup"></div>
//                         <div class="row">
//                           <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                             <label>Listas seleccionadas</label>
//                             <ul id="listamodal"></ul>
//                           </div>
//                           <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                             <table id='table2' class='table table-striped table-hover' data-page-length='100'>
//                               <thead>
//                                 <tr>
//                                   <th>Solicitud</th>
//                                   <th>Mercancía</th>
//                                   <th>Item</th>
//                                   <th>Origen</th>
//                                   <th>Destino</th>
//                                   <th>Peso(Kg) / Tipo vehiculo</th>
//                                   <th>Cliente</th>
//                                   <th>Tipo</th>
//                                   <th>Acciones</th>
//                                 </tr>
//                               </thead>
//                               <tbody id="tbl-solicitudes-consolidadas"></tbody>
//                             </table>
//                           </div>
//                         </div>
//                       </div>
//                       <div class="modal-footer">
//                         <button type="button" id="cancel" class="btn btn-default md-close">Cancelar</button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <!--SOLICITUD DE PREESTUDIO -->
//                 <div class="row">
//                   <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
//                     <label style="font-weight:600; margin-top:20px;"> Solicitudes de servicio:
//                     </label>&nbsp;&nbsp;
//                     <button type="button" id="btn_soli" data-toggle="modal" class="btn btn-primary btn-sm"><span class="uil-shopping-cart-alt"></span></button>
//                   </div>
//                 </div>

//                 <div class="row">
//                   <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
//                     <label style="font-weight:800; margin-top:20px;">Solicitudes de servicio seleccionadas</label>
//                     <input type="hidden" id="maxservi" value="1">
//                   </div>

//                   <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
//                     <input type="hidden" value="3" id="soli_total">
//                   </div>
//                   <style type="text/css">
//                     .seleccionada {
//                       background-color: #0585C0;
//                       color: white;
//                     }
//                   </style>
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <table class="table table-bordered table-sm" style="font-size: 12px;">
//                       <thead>
//                         <th>#</th>
//                         <th>Servicio</th>
//                         <th>Item-Mercancía</th>
//                         <th>Cliente</th>
//                         <th>Flete cot.</th>
//                         <th style="display:none">Peso bruto(Tn)</th>
//                         <!-- <th>Tarifa cot.</th> -->
//                         <th>Acción</th>
//                       </thead>
//                       <tbody id="cuerpo_lista2">
//                       </tbody>
//                     </table>
//                   </div>


//                   <!-- <div class="row"></div> -->
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <table class="table table-bordered table-sm" style="font-size: 12px;">
//                       <thead>
//                         <th>Suma de Flete por solicitudes</th>
//                         <th>Total peso Bruto(Tn)</th>
//                       </thead>
//                       <tbody id="totalizar"></tbody>
//                     </table>
//                   </div>

//                   <!-- <div class="row"></div> -->
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <table class="table table-bordered table-sm">
//                       <thead>
//                         <th>N° - Remitente</th>
//                         <th>Fecha</th>
//                         <th>Peso(Kg)</th>
//                         <th>Punto de cargue</th>
//                       </thead>
//                       <tbody id="cuerpo_fechas">
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 <div class="row">
//                   <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
//                     <label>Total sumatoria Peso(Kg)</label>
//                     <input type="text" id="total_pesos" class="form-control form-control-sm" disabled>
//                   </div>
//                   <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
//                     <label>Capacidad carga vehículo(Kg)&nbsp;<span style="color:red;"><i>(*)</i></span></label>
//                     <input type="text" id="capa_carga_vh" class="form-control form-control-sm">
//                   </div>
//                 </div>

//                 <div class="row">
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <label style="font-weight:800; margin-top:20px;">Solicitud de Preestudio</label>
//                   </div>
//                   <div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">
//                     <label>Fecha</label>
//                     <input type="text" id="fpree" value="<?php echo date('Y-m-d'); ?>" class="form-control form-control-sm" disabled>
//                   </div>
//                   <div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">
//                     <label>Hora</label>
//                     <input type="text" id="hpree" value="<?php echo date('H:i:s'); ?>" class="form-control form-control-sm" disabled>
//                   </div>
//                   <div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">
//                     <label>Usuario</label>
//                     <input type="text" id="userpree" class="form-control form-control-sm" value="<?php echo $ssn_nombre; ?>" disabled>
//                   </div>
//                   <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12">
//                     <label>Observaciones</label>
//                     <textarea id="obserpree" class="form-control form-control-sm"></textarea>
//                   </div>
//                   <input type="hidden" id="id_consolidacion" class="form-control form-control-sm" disabled>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div class="accordion" id="panel_seguridad" style="display:none;">
//             <div class="accordion-item border-top">
//               <h2 class="accordion-header" id="headingUpdateData">
//                 <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_update" aria-expanded="true" aria-controls="collapse_update">Actualiza Seguridad (hojas de vida)</button>
//               </h2>
//             </div>
//             <div id="collapse_update" class="accordion-collapse collapse" aria-labelledby="headingUpdateData">
//               <div class="accordion-body pt-0">
//                 <div id="msg_alerta" class="py-2"></div>
//                 <div class="row pt-3">
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
//                     <div class="row">
//                       <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
//                         <h4><span class="uil-list-ui-alt"></span> Recursos actuales</h4>
//                       </div>
//                       <div class="col-sm-6 col-md-6 col-lg-6"></div>
//                       <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
//                         <div class="mb-1">
//                           <label>Vehículo</label>
//                           <input type="text" class="form-control form-control-sm fs-10" id="veh_vehiculo" disabled>
//                         </div>
//                       </div>
//                       <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
//                         <div class="mb-1">
//                           <label>Conductor</label>
//                           <input type="text" class="form-control form-control-sm fs-10" id="veh_conduc" disabled>
//                         </div>
//                       </div>
//                       <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
//                         <div class="mb-1">
//                           <label>Propietario</label>
//                           <input type="text" class="form-control form-control-sm fs-10" id="veh_propiet" disabled>
//                         </div>
//                       </div>
//                       <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
//                         <div class="mb-1">
//                           <label>Poseedor</label>
//                           <input type="text" class="form-control form-control-sm fs-10" id="veh_poseed" disabled>
//                         </div>
//                       </div>
//                     </div>
//                     <hr class="my-1 text-dark">
//                     <div class="d-flex justify-content-center">
//                       <div class="form-check form-check-inline">
//                         <input class="form-check-input recursos_checbox" id="cbox1" type="checkbox" value="nuevo_recurso" style="transform: scale(1.3);">
//                         <label class="form-check-label fs-12" for="cbox1">Nuevo recurso</label>
//                       </div>
//                       <div class="form-check form-check-inline">
//                         <input class="form-check-input recursos_checbox" id="cbox2" type="checkbox" value="datos_dinamicos" style="transform: scale(1.3);">
//                         <label class="form-check-label fs-12" for="cbox2">Datos dinámicos</label>
//                       </div>
//                     </div>
//                     <hr class="my-1 text-dark">
//                   </div>
//                 </div>

//                 <!-- TABS INICIO -->
//                 <div class="row panel_tabs_recursos pt-3">
//                   <div class="col-sm-12 col-md-12 col-lg-12">
//                     <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
//                       <li class="nav-item re_inexis"><a class="nav-link active" data-bs-toggle="tab" href="#home2" role="tab" aria-controls="home2" aria-selected="true" style="display: none;" id="creacion_nuevo_recuro">Creación de recursos nuevos</a></li>
//                       <li class="nav-item re_dinamic"><a class="nav-link" data-bs-toggle="tab" href="#profile2" role="tab" aria-controls="profile2" aria-selected="false" style="display: none;" id="datos_dinamicos">Datos dinámicos</a></li>
//                       <!-- <li class="nav-item"><a class="nav-link" id="contact-tab" data-bs-toggle="tab" href="#tab-contact" role="tab" aria-controls="tab-contact" aria-selected="false">Contact</a></li> -->
//                     </ul>

//                     <div class="tab-content mt-3" id="myTabContent">
//                       <div class="tab-pane fade show active re_inexis" id="home2" role="tabpanel" aria-labelledby="home2">
//                         <div class="panel panel-border-color panel-border-color-dark" id="inexistente_actividades"><!-- recurso -->
//                           <div class="panel-body text-center" style="padding: 1px 1px 1p;">

//                             <div class="d-flex justify-content-center">
//                               <div class="form-check form-check-inline">
//                                 <input class="form-check-input chebox_recurso" id="cbpre1" type="checkbox" value="Propietario" style="transform: scale(1.3);">
//                                 <label class="form-check-label fs-12" for="cbpre1">Propietario</label>
//                               </div>
//                               <div class="form-check form-check-inline">
//                                 <input class="form-check-input chebox_recurso" id="cbpre2" type="checkbox" value="Poseedor" style="transform: scale(1.3);">
//                                 <label class="form-check-label fs-12" for="cbpre2">Poseedor</label>
//                               </div>
//                               <div class="form-check form-check-inline">
//                                 <input class="form-check-input chebox_recurso" id="cbpre3" type="checkbox" value="Conductor" style="transform: scale(1.3);">
//                                 <label class="form-check-label fs-12" for="cbpre3">Conductor</label>
//                               </div>
//                               <div class="form-check form-check-inline">
//                                 <input class="form-check-input chebox_recurso" id="cbpre4" type="checkbox" value="Trailer" style="transform: scale(1.3);">
//                                 <label class="form-check-label fs-12" for="cbpre4">Tráiler</label>
//                               </div>
//                             </div>

//                           </div>
//                         </div>

//                         <!-- propietario -->
//                         <div id="inexistente_propietario">
//                           <div class="row">
//                             <!-- <div class="panel-body"> </div> -->
//                             <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                               <div class="mb-1">
//                                 <label>Número Documento</label>
//                                 <input type="number" class="form-control form-control-sm" id="number_propietario">
//                               </div>
//                             </div>
//                             <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                               <div class="mb-1">
//                                 <label>Nombre completo propietario</label>
//                                 <input type="text" class="form-control form-control-sm nombre_i" id="name_propietario">
//                               </div>
//                             </div>
//                           </div>
//                           <hr class="my-1 text-dark">
//                         </div>

//                         <!-- poseedor -->
//                         <div id="inexistente_poseedor">
//                           <div class="row">
//                             <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
//                               <label>Número Documento</label>
//                               <input type="number" class="form-control form-control-sm" id="number_poseedor">
//                             </div>
//                             <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
//                               <label>Nombre completo poseedor</label>
//                               <input type="text" class="form-control form-control-sm nombrei" id="name_poseedor">
//                             </div>
//                           </div>
//                           <hr class="my-1 text-dark">
//                         </div>

//                         <!-- conductor-->
//                         <div id="inexistente_conductor">
//                           <div class="panel-body">
//                             <div class="row">
//                               <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
//                                 <label>Número Documento</label>
//                                 <input type="number" class="form-control form-control-sm" id="number_conductor">
//                               </div>
//                               <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
//                                 <label>Nombre completo conductor</label>
//                                 <input type="text" class="form-control form-control-sm nombre_i" id="name_conductor">
//                               </div>
//                             </div><br>
//                             <div class="row">
//                               <!-- Primera referencia -->
//                               <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4" style="border-right:1px solid gray">
//                                 <span>Nombre Empresa</span>
//                                 <input type="text" class="form-control form-control-sm" id="referencias_empresariales1pre" onblur="mayuscula(this);">
//                                 <span>Persona Contacto</span>
//                                 <input type="text" id="contacto_ref1pre" placeholder="Nombre Contacto" class="form-control form-control-sm" onblur="mayuscula(this);">
//                                 <span>Celular Empresa</span>
//                                 <input type="number" id="celular_ref1pre" placeholder="Celular Empresa" maxlength="10" class="form-control form-control-sm">
//                                 <span>Cargo</span>
//                                 <input type="text" id="cargo_ref1pre" placeholder="Cargo" class="form-control input-sm" onblur="mayuscula(this);">
//                                 <span>Fecha ingreso 1</span>
//                                 <input type="date" id="fingresoa1pre" class="form-control form-control-sm">
//                                 <span>Fecha ingreso 2</span>
//                                 <input type="date" id="fretiroa3pre" class="form-control form-control-sm">
//                                 <span>Antiguedad</span>
//                                 <input type="number" id="anti_ref1pre" min="0" class="form-control form-control-sm">
//                               </div>
//                               <!-- Segunda referencia -->
//                               <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4" style="border-right:1px solid gray">
//                                 <span>Nombre Empresa</span>
//                                 <input type="text" class="form-control form-control-sm" id="referencias_empresariales2pre" onblur="mayuscula(this);">
//                                 <span>Persona Contacto</span>
//                                 <input type="text" id="contacto_ref2pre" placeholder="Nombre Contacto" class="form-control form-control-sm" onblur="mayuscula(this);">
//                                 <span>Celular Empresa</span>
//                                 <input type="number" id="celular_ref2pre" placeholder="Celular Empresa" maxlength="10" class="form-control form-control-sm">
//                                 <span>Cargo</span>
//                                 <input type="text" id="cargo_ref2pre" placeholder="Cargo" class="form-control form-control-sm" onblur="mayuscula(this);">
//                                 <span>Fecha ingreso 1</span>
//                                 <input type="date" id="fingresob1pre" class="form-control form-control-sm">
//                                 <span>Fecha ingreso 2</span>
//                                 <input type="date" id="fretirob3pre" class="form-control form-control-sm">
//                                 <span>Antiguedad</span>
//                                 <input type="number" id="anti_ref2pre" min="0" class="form-control form-control-sm">
//                               </div>
//                               <!-- tercera referencia  -->
//                               <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
//                                 <span>Nombre Empresa</span>
//                                 <input type="text" class="form-control form-control-sm" id="referencias_empresariales3pre" onblur="mayuscula(this);">
//                                 <span>Persona Contacto</span>
//                                 <input type="text" id="contacto_ref3pre" placeholder="Nombre Contacto" class="form-control form-control-sm" onblur="mayuscula(this);">
//                                 <span>Celular Empresa</span>
//                                 <input type="number" id="celular_ref3pre" placeholder="Celular Empresa" maxlength="10" class="form-control form-control-sm">
//                                 <span>Cargo</span>
//                                 <input type="text" id="cargo_ref3pre" placeholder="Cargo" class="form-control form-control-sm" onblur="mayuscula(this);">
//                                 <span>Fecha ingreso 1</span>
//                                 <input type="date" id="fingresoc1pre" class="form-control form-control-sm">
//                                 <span>Fecha ingreso 2</span>
//                                 <input type="date" id="fretiroc3pre" class="form-control form-control-sm">
//                                 <span>Antiguedad</span>
//                                 <input type="number" id="anti_ref3pre" min="0" class="form-control form-control-sm">
//                               </div>
//                             </div>
//                             <!--cierre del panel body -->
//                           </div>
//                           <hr class="my-1 text-dark">
//                         </div>

//                         <!-- vehiculo -->
//                         <div class="panel panel-border-color panel-border-color-dark" id="inexistente_vehiculo">
//                           <div class="panel-body">
//                             <div class="col-xs-6 col-sm-3 col-md-3 col-lg-3">
//                               <div class="mb-1">
//                                 <label>Placa vehículo</label>
//                                 <input type="text" class="form-control form-control-sm" id="placa_vehiculosat">
//                               </div>
//                             </div>
//                             <div class="col-xs-6 col-sm-3 col-md-3 col-lg-3">
//                               <div class="mb-1">
//                                 <label>URL satélital</label>
//                                 <input type="text" class="form-control form-control-sm" id="url_sat">
//                               </div>
//                             </div>
//                             <div class="col-xs-6 col-sm-3 col-md-3 col-lg-3">
//                               <div class="mb-1">
//                                 <label>Usuario satélital</label>
//                                 <input type="text" class="form-control form-control-sm" id="user_sat">
//                               </div>
//                             </div>
//                             <div class="col-xs-6 col-sm-3 col-md-3 col-lg-3">
//                               <div class="mb-1">
//                                 <label>Clave satélital</label>
//                                 <input type="text" class="form-control form-control-sm" id="pass_sat">
//                               </div>
//                             </div>
//                           </div>
//                           <hr class="my-1 text-dark">
//                         </div>

//                         <!--trailer -->
//                         <div id="inexistente_trailer">
//                           <div class="row">
//                             <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
//                               <label>Placa tráiler</label>
//                               <input type="text" class="form-control form-control-sm" id="placa_trailerpre">
//                             </div>
//                             <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
//                               <label>Número documento propietario tráiler</label>
//                               <input type="text" class="form-control form-control-sm" id="propidocu_trailer">
//                             </div>
//                             <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
//                               <label>Nombre propietario tráiler</label>
//                               <input type="text" class="form-control form-control-sm" id="propi_trailer">
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div class="tab-pane fade re_dinamic" id="profile2" role="tabpanel" aria-labelledby="profile2">
//                         <div class="row">
//                           <div class="col-xs-12 col-sm-412col-md-12 col-lg-12">
//                             <div class="input-group input-group-sm mb-3">
//                               <label class="input-group-text" for="inputGroupSelect01">Tipo hoja de vida</label>
//                               <select id="thv" class="form-select form-select-sm text-center">
//                                 <option value="">Seleccione</option>
//                                 <option value="propietario">Propietario</option>
//                                 <option value="conductor">Conductor</option>
//                                 <option value="tenedor">Tenedor</option>
//                                 <option value="vehiculo">Vehículo</option>
//                                 <option value="trailer">Trailer</option>
//                               </select>
//                             </div>
//                           </div>
//                         </div>

//                         <div class="row uno">
//                           <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                             <div class="mb-1">
//                               <input type="text" id="label" class="form-control form-control-sm" readonly="" style="font-size:12pt; text-align:center;">
//                             </div>
//                           </div>
//                           <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4" id="elbtn">
//                             <div class="mb-1">
//                               <label>Campo actualizar: </label>
//                               <input type='text' class='form-control form-control-sm' id='dato'>
//                             </div>
//                           </div>
//                           <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4" id="elbtn">
//                             <div class="mb-1">
//                               <label>Información actualizar: </label>
//                               <input type='text' class='form-control form-control-sm' id='detalle'>
//                             </div>
//                           </div>
//                           <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 pt-4" id="elbtn">
//                             <div class="mb-1">
//                               <button id="agregue_tb" class="btn btn-phoenix-success btn-sm text-center"><span class="uil uil-plus-square"></span></button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <!-- <div class="tab-pane fade" id="tab-contact" role="tabpanel" aria-labelledby="contact-tab">Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.</div> -->
//                     </div>
//                   </div>
//                 </div>

//                 <!-- TABS FIN -->
//                 <!-- Tabla -->
//                 <div class="row panel_total_recursos pt-3">
//                   <div class="col-sm-12 col-md-12 col-lg-12">
//                     <div class="panel panel-default">
//                       <table class="table table-hover table-bordered table-sm text-center" style=" font-size:12px;">
//                         <thead>
//                           <tr>
//                             <th>Código</th>
//                             <th>Tipo HV</th>
//                             <th>Dato actualizar</th>
//                             <th>Detalle</th>
//                             <th>Archivo</th>
//                           </tr>
//                         </thead>
//                         <tbody id="cuerpo_actu">
//                         <tbody>
//                       </table>
//                       <input type="hidden" id="valortb" readonly="readonly">
//                     </div>
//                   </div>
//                 </div>

//               </div>
//             </div>
//           </div>
//           <!--DOCUMENTOS -->

//           <!--documentos para actualizar-->
//           <div class="accordion" id="panel_papeles_actualiza" style="display:none;">
//             <div class="accordion-item border-top">
//               <h2 class="accordion-header" id="headingUpdateData1">
//                 <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#doc_update" aria-expanded="true" aria-controls="doc_update"><i class="icon mdi mdi-chevron-down"></i>Documentos Para Actualizar</button>
//               </h2>
//             </div>
//             <div id="doc_update" class="accordion-collapse collapse" aria-labelledby="headingUpdateData1">
//               <div class="accordion-body pt-0">
//               </div>
//             </div>
//           </div>

//           <!--documentos para habilitar-->
//           <div class="accordion" id="panel_papeles_habilitar" style="display:none;">
//             <div class="accordion-item border-top">
//               <h2 class="accordion-header" id="headingUpdateData2">
//                 <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#doc_habilitar" aria-expanded="true" aria-controls="doc_habilitar"><i class="icon mdi mdi-chevron-down"></i>Documentos Para Habilitar</a></button>
//               </h2>
//             </div>
//             <div id="doc_habilitar" class="accordion-collapse collapse" aria-labelledby="headingUpdateData2">
//               <div class="accordion-body pt-0">
//                 <div class="row">
//                   <input type="hidden" id="deta_condu">
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <p class="text-center text-primary" style="font-size:14pt; margin-top:20px;"><strong>Documentos
//                         obligatorios:</strong></p>
//                     <hr>
//                   </div>
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <label style="font-weight:800; margin-top:20px;">Fotos del Conductor</label>

//                   </div>
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <label style="font-weight:800; margin-top:20px;">Fotos de Indumentaria</label>
//                   </div>
//                 </div>
//                 <div class="row">
//                   <p class="text-center text-primary" style="font-size:14pt; margin-top:20px;"><strong>Documentos
//                       complementarios:</strong></p>
//                   <hr>
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <label style="font-weight:800; margin-top:20px;">Referencia laboral</label>
//                     <table class="table">
//                       <thead style="text-align:left;color:white; background-color:#FFA900;">
//                         <tr>
//                           <th style="width:3%;">#</th>
//                           <th style="width:5%;">Documento/Img</th>
//                           <th style="width:10%;">Nombre</th>
//                           <th style="width:20%;">Actualice documento</th>
//                         </tr>
//                       </thead>
//                       <tbody id="consulta_documentos">
//                       </tbody>
//                     </table>
//                   </div>
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <label style="font-weight:800; margin-top:20px;">Referencia Personal</label>
//                     <table class="table">
//                       <thead style="text-align:left;color:white; background-color:#FFA900;">
//                         <tr>
//                           <th style="width:3%;">#</th>
//                           <th style="width:5%;">Documento/Img</th>
//                           <th style="width:10%;">Nombre</th>
//                           <th style="width:20%;">Actualice documento</th>
//                         </tr>
//                       </thead>
//                       <tbody id="documentos_personal">
//                       </tbody>
//                     </table>
//                   </div>
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <label style="font-weight:800; margin-top:20px;">Licencia</label>
//                     <table class="table">
//                       <thead style="text-align:left;color:white; background-color:#FFA900;">
//                         <tr>
//                           <th style="width:3%;">#</th>
//                           <th style="width:5%;">Documento/Img</th>
//                           <th style="width:10%;">Nombre</th>
//                           <th style="width:20%;">Actualice documento</th>
//                         </tr>
//                       </thead>
//                       <tbody id="documentos_licencia">
//                       </tbody>
//                     </table>
//                   </div>
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <label style="font-weight:800; margin-top:20px;">Rut</label>
//                     <table class="table">
//                       <thead style="text-align:left;color:white; background-color:#FFA900;">
//                         <tr>
//                           <th style="width:3%;">#</th>
//                           <th style="width:5%;">Documento/Img</th>
//                           <th style="width:10%;">Nombre</th>
//                           <th style="width:20%;">Actualice documento</th>
//                         </tr>
//                       </thead>
//                       <tbody id="documentos_rut">
//                       </tbody>
//                     </table>
//                   </div>
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <label style="font-weight:800; margin-top:20px;">Eps</label>
//                     <table class="table">
//                       <thead style="text-align:left;color:white; background-color:#FFA900;">
//                         <tr>
//                           <th style="width:3%;">#</th>
//                           <th style="width:5%;">Documento/Img</th>
//                           <th style="width:10%;">Nombre</th>
//                           <th style="width:20%;">Actualice documento</th>
//                         </tr>
//                       </thead>
//                       <tbody id="documentos_eps">
//                       </tbody>
//                     </table>
//                   </div>
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <label style="font-weight:800; margin-top:20px;">Arl</label>
//                     <table class="table">
//                       <thead style="text-align:left;color:white; background-color:#FFA900;">
//                         <tr>
//                           <th style="width:3%;">#</th>
//                           <th style="width:5%;">Documento/Img</th>
//                           <th style="width:10%;">Nombre</th>
//                           <th style="width:20%;">Actualice documento</th>
//                         </tr>
//                       </thead>
//                       <tbody id="documentos_arl">
//                       </tbody>
//                     </table>
//                   </div>
//                   <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//                     <label style="font-weight:800; margin-top:20px;">Curso Mercancías peligrosas</label>
//                     <table class="table">
//                       <thead style="text-align:left;color:white; background-color:#FFA900;">
//                         <tr>
//                           <th style="width:3%;">#</th>
//                           <th style="width:5%;">Documento/Img</th>
//                           <th style="width:10%;">Nombre</th>
//                           <th style="width:20%;">Actualice documento</th>
//                         </tr>
//                       </thead>
//                       <tbody id="documentos_peligro">
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <!--documentos nuevos-->
//           <div class="accordion" id="panel_papeles" style="display:none;">
//             <div class="accordion-item border-top">
//               <h2 class="accordion-header" id="headingUpdateData3">
//                 <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#documentos" aria-expanded="true" aria-controls="documentos"><i class="icon mdi mdi-chevron-down"></i>Documentos prefiltro</button>
//               </h2>
//             </div>
//             <div id="documentos" class="accordion-collapse collapse" aria-labelledby="headingUpdateData3">
//               <div class="accordion-body pt-0">
//                 <div class="row">
//                   <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
//                     <label>¿Desea Agregar un documento?</label>
//                   </div>
//                   <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
//                     <button class=" form-control btn btn-info mdi mdi-plus input-sm text-center" data-toggle="tooltip" data-placement="top" title="Agregar" id="agregar_docu"> Agregar
//                       Documentos</button>
//                   </div>
//                 </div><br>
//                 <div class="row">
//                   <table class="table table-bordered table-condensed">
//                     <thead style="background-color:#332D2D;color:#fff;text-align:center;">
//                       <th>#</th>
//                       <th>Tipo Hoja Vida</th>
//                       <th>Clase</th>
//                       <th>Ruta</th>
//                       <th>Subir</th>
//                       <th>Nombre Archivo</th>
//                       <th>Acción</th>
//                     </thead>
//                     <tbody id="tabla_papeles">
//                     </tbody>
//                   </table>
//                 </div>
//                 <input type="hidden" id="cont_papel">
//                 <input type="hidden" id="valor_documento" class="form-control input-sm" readonly="readonly" value="6">
//               </div>
//             </div>
//           </div>

//           <!--documento flete-placa -->
//           <div class="accordion" id="panel_fletepk" style="display:none;">
//             <div class="accordion-item border-top">
//               <h2 class="accordion-header" id="headingSubasta">
//                 <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo"><i class="icon mdi mdi-chevron-down"></i>Subasta</button>
//               </h2>
//             </div>
//             <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingSubasta">
//               <div class="accordion-body pt-0">
//                 <div class="row">
//                   <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
//                     <div class="mb-1">
//                       <label>Placa</label>
//                       <input type="text" id="su_placa" class="form-control form-control-sm" disabled>
//                     </div>
//                   </div>
//                   <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
//                     <div class="mb-1">
//                       <label>Num. servicio</label>
//                       <input type="text" id="su_servicio" class="form-control form-control-sm" disabled>
//                     </div>
//                   </div>
//                   <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
//                     <div class="mb-1">
//                       <label>Flete sugerido</label>
//                       <input type="text" id="su_fletecot" class="form-control form-control-sm" disabled>
//                     </div>
//                   </div>
//                   <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
//                     <div class="mb-1">
//                       <label>Total flete propuesto</label>
//                       <input type="text" id="su_propuesto" class="form-control form-control-sm" min="0">
//                     </div>
//                   </div>
//                   <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
//                     <div class="mb-1">
//                       <label>Total peso bruto(Tn)</label>
//                       <input type="text" id="su_neto" class="form-control form-control-sm" disabled>
//                     </div>
//                   </div>
//                   <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
//                     <div class="mb-1">
//                       <label title="sumatoria">Total peso Neto(Kg)</label>
//                       <input type="text" id="su_sumatorianeto" class="form-control form-control-sm" disabled>
//                     </div>
//                   </div>
//                   <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
//                     <div class="mb-1">
//                       <label>estado creación</label>
//                       <input type="text" id="su_estado" value="pendiente" class="form-control form-control-sm" disabled>
//                     </div>
//                   </div>
//                   <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
//                     <div class="mb-1">
//                       <label>usuario creación</label>
//                       <input type="text" id="su_user" class="form-control form-control-sm" value="<?php echo $ssn_nombre; ?>" disabled>
//                     </div>
//                   </div>
//                   <div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">
//                     <div class="mb-1">
//                       <label>Fecha creación</label>
//                       <input type="text" id="su_fecha" value="<?php echo date('Y-m-d'); ?>" class="form-control form-control-sm" disabled>
//                     </div>
//                   </div>
//                   <div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">
//                     <div class="mb-1">
//                       <label>Hora creación</label>
//                       <input type="text" id="su_hora" value="<?php echo date('H:i:s'); ?>" class="form-control form-control-sm" disabled>
//                     </div>
//                   </div>
//                   <div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">
//                     <div class="mb-1">
//                       <label>Número subasta</label>
//                       <input type="text" id="su_numsubasta" class="form-control form-control-sm" disabled>
//                     </div>
//                   </div>
//                   <div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">
//                     <div class="mb-1">
//                       <label>Responsable VehÍculo <span style="color:red;"><i>(*)</i></span></label>
//                       <select name="responsable_vehiculo" id="responsable_vehiculo" class="form-control form-control-sm "></select>
//                     </div>
//                   </div>
//                   <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
//                     <div class="mb-1">
//                       <input type="hidden" id="su_tarifacot" class="form-control form-control-sm" disabled>
//                     </div>
//                   </div>
//                   <input type="hidden" id="su_valida" class="form-control form-control-sm" disabled value="1">
//                 </div>
//               </div>
//             </div>
//           </div>
//           <!--FIN DOCUMENTOS -->
//         </div>
//         <!--GUARDAR SOLO  -->
//         <!-- <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12" id="divbotones">
//               <button id="crear_preestudio" class="btn btn-success">Guardar</button>
//             </div> -->
//       </div>
//     </div>
//     <!--CUERPO DE LA SOLICITUD-->
//     <div class="offcanvas-footer p-3 border-top text-center">
//       <div class="d-flex justify-content-end align-content-between gap-3">
//         <button type="button" id="btn_cerrar" data-bs-dismiss="offcanvas" aria-label="Close" class="btn btn-danger btn-sm" id="cierremodal"><i class="fas fa-times"></i> Cancelar</button>
//         <button id="crear_preestudio" class="btn btn-success btn-sm"><i class="far fa-save"></i> Guardar Prefiltro</button>
//       </div>
//     </div>
//   </div>
// `);

//   myOffcanvas.show();

//   if (itr === 'Si') {
//     document.getElementById('mensaje_itr').innerHTML = `
//             <div class="alert alert-contrast alert-warning alert-dismissible" role="alert">
//               <div class="icon"><span class="mdi mdi-alert-triangle"></span></div>
//               <div class="message">
//                 <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><strong>Advertencia!</strong> Este Vehiculo sera clasificada como proceso ITR esta seguro.
//               </div>
//             </div>`;
//     document.getElementById('proceso_itr').value = itr;
//   }

//   $('#servicio_base').val(num);
//   $('#tipo_base').val(tipo_servicio);
//   $('#origen_base').val(origen);
//   $('#su_fletecot').val(flete);
//   $('#su_servicio').val(num);
//   $('#su_neto').val(pesoneto);
//   $('#su_tarifacot').val(tarifa);
//   if (tipo_servicio === 'Expreso') {
//     document.getElementById('btn_soli').disabled = true;
//   } else if (tipo_servicio == 'Consolidado') {
//     document.getElementById('btn_soli').disabled = false;
//   }

//   $('#listamodal').html('<span class="badge badge-primary badge-pill" >' + num + '</span>');
//   $('#cuerpo_lista2').html(`
//             <tr class="prin${num}">
//                 <td>1</td>
//                 <td>
//                     <input type="hidden" id="servicio1" value="${num}" class="form-control form-control-sm fs-10 fserva" name="fserva[]">
//                     ${num}
//                 </td>
//                 <td>${cotiza} (${item}) ${pareja}</td>
//                 <td>${cliente}</td>
//                 <td>
//                     <input type="password" id="fl${num}" class="form-control form-control-sm fs-10 tflete" value="${flete}" readonly="readonly" onChange="javascript:currencyMask(this)">
//                 </td>
//                 <td style="display:none">
//                     <input type="text" class="form-control form-control-sm fs-10 tneto2" value="${pesoneto}" readonly="readonly">
//                 </td>
//                 <td>
//                     <input type="hidden" id="tari${num}" class="form-control form-control-sm fs-10 ttarifa" value="${tarifa}" readonly="readonly">
//                 </td>
//                 <td>${tipo_servicio}</td>
//             </tr>
//           `);

//   $('#totalizar').html(`
//           <tr>
//               <td>
//                   <input type="password" id="totalfle" class="form-control form-control-sm fs-10" value="${flete}" readonly="readonly">
//               </td>
//               <td style="display:none;">
//                   <input type="text" id="totalneto" class="form-control form-control-sm fs-10"  value="${pesoneto}" readonly="readonly">
//               </td>
//               <td>
//                   <input type="hidden" id="tottarifa" class="form-control form-control-sm fs-10"  value="${tarifa}" readonly="readonly">
//               </td>
//           </tr>
//           `);

//   //formatear
//   $('#fl' + num).val(parseFloat($('#fl' + num).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#totalfle').val(parseFloat($('#totalfle').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#su_fletecot').val(parseFloat($('#su_fletecot').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#tari' + num).val(parseFloat($('#tari' + num).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#tottarifa').val(parseFloat($('#tottarifa').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#su_tarifacot').val(parseFloat($('#su_tarifacot').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

//   //VALIDAR SOLICITUD DE SERVICIO ANIDADAS
//   let formdata = new FormData();
//   formdata.append('solicitud_servicio_id', num);
//   fetch($('#base_url').val() + 'validacionparametros/Validar_solicitud_agrupacion', {
//     method: 'POST',
//     cache: 'no-cache',
//     body: formdata,
//   })
//     .then(response => response.json())
//     .then(function (data) {
//       if (data !== false) {
//         document.getElementById('id_consolidacion').value = data.agrupacion;
//         consulta_solicitudes_anidadas(data.agrupacion, num);
//         fechas_cargue(data.agrupacion, num);
//       } else {
//         document.getElementById('id_consolidacion').value = '';
//         fechas_cargue(0, num);
//       }
//     })
//     .catch(error => {
//       alert(error);
//     });
// }