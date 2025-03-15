window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global
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

  let tipo = 2;
  let cliente = "";
  let fecha_inicial = $('#fecha_inicial').val();
  let fecha_final = $('#fecha_final').val();

  listar_cotizaciones(tipo, fecha_inicial, fecha_final, cliente);

  // Si la ventana es la 2, activar el evento de cambio en #filtro
  if (window.VENTANA == 12) {
    $(`#campo-${window.VENTANA}-filtro`).off("change").on("change", function () {
      document.getElementById(`campo-${window.VENTANA}-clientes`).style.display = "block";

      $.ajax({
        url: $('#base_url').val() + 'serviciocliente/Listar_Clientes',
        type: "POST",
        dataType: "json",
        success: function (data) {
          let select = $(`#campo-${window.VENTANA}-clientes`);
          select.empty().append('<option value="">Seleccione</option>');

          $.each(data, function (index, item) {
            select.append(`<option value="${item.id}">${item.nombre}</option>`);
          });

          // Inicializa Select2 en el select de clientes
          select.select2({
            placeholder: 'Seleccione una opción',
            allowClear: true,
          });
        },
        error: function (xhr, status, error) {
          console.error("Error en AJAX:", status, error);
          alert("Error al cargar los datos.");
        }
      });
    });


    $(`#campo-${window.VENTANA}-clientes`).off("change").on("change", function () {
      let valorSeleccionado = $(this).val();
      // console.log("Cambio en el filtro detectado. Mostrando clientes... " + valorSeleccionado); // Depuración
      listar_cotizaciones(tipo, fecha_inicial, fecha_final, valorSeleccionado);
    });
  }
  document.addEventListener("click", async e => {
    if (e.target.matches("#btn_ver_solicitud_en_curso") || e.target.matches("#btn_ver_solicitud_en_curso *")) {
      // let padre = e.target.parentElement.parentElement;
      // Obtener el enlace (el elemento con el data-id)
      let enlace = e.target.closest('#btn_ver_solicitud_en_curso');
      // // Obtener el valor del atributo data-id
      let dataId = enlace.getAttribute('data-id');
      let dataId2 = enlace.getAttribute('data-id2');
      // let dataId3 = enlace.getAttribute('data-id3');
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
      // var newWindow = window.open($('#base_url').val() + "serviciocliente/canvas?cotizacion=" + encodeURIComponent(dataId) + "&solicitud_servicio=" + encodeURIComponent(dataId2), "ventanaCentrada", 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

      // // Puts focus on the newWindow
      // if (window.focus) {
      //   newWindow.focus();
      // }

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
};


async function listar_cotizaciones(tipo, fecha_inicial, fecha_final, cliente) {
  /* Funcion para enviar los datos */
  let dato = new FormData();
  dato.append('tipo', tipo);
  dato.append('fecha_inicial', fecha_inicial);
  dato.append('fecha_final', fecha_final);
  dato.append('estado', 'En_Curso');
  dato.append('cliente', cliente);
  try {
    const response = await fetch($('#base_url').val() + 'serviciocliente/consultar_cotizaciones', {
      method: 'POST',
      body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tbl_cotizaciones_en_curso');
      tbody.innerHTML = '';
      let esatdo_autorizado = '';
      let col_estatus = '';
      let cot_itr = '';
      let n_cotizacion = '';
      let btn_editar = '';
      let Prioridad = '';

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

        /* Consultas de estado de las solicitudes */
        if (element.estado_autorizacion === 'F1') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-default"  data-toggle="tooltip" title="Realizada" ></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">Realizada</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F2') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-success"  data-toggle="tooltip" title="Entregada"></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">Entregada</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F4') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-danger" data-toggle="tooltip" title="Pérdida"></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Pérdida</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F3') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-warning"  data-toggle="tooltip" title="Ganada"></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">Ganada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F5') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-primary" data-toggle="tooltip" title="Cancelada"></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Cancelada</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F6') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-gray" data-toggle="tooltip" title="Rechazada"></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">Rechazada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        }
        /* Validar si la solicitud es Itr */
        if (element.itr === 'Si') {
          cot_itr = `<span class="badge badge-phoenix badge-phoenix-success float-right">SI</span>`;
        } else {
          cot_itr = `<span class="badge badge-phoenix badge-phoenix-primary float-right">NO</span>`;
        }

        // if (perfil === '1') {
        //   if (element.prioritaria === 'Propuesta') {
        //     Prioridad = `<span class="badge badge-phoenix badge-phoenix-warning float-right"><a href="#" id="btn_aprobar_solicitud" data-id="${element.nundoc_solicitud}" class="text-decoration-none text-warning" title="Aprobar solicitud">${element.prioritaria}</a></span>`;
        //   } else {
        //     Prioridad = `<span class="badge badge-phoenix badge-phoenix-primary float-right">${element.prioritaria}</span>`;
        //   }
        // }

        if (element.prioritaria === 'Propuesta') {
          Prioridad = `<span class="badge badge-phoenix badge-phoenix-warning float-right"><a href="#" id="btn_aprobar_solicitud" data-id="${element.nundoc_solicitud}" class="text-decoration-none text-warning" title="Aprobar solicitud">${element.prioritaria}</a></span>`;
        } else if (element.prioritaria === null) {
          Prioridad = `<span class="badge badge-phoenix badge-phoenix-info float-right">No marcada</span>`;
        } else {
          Prioridad = `<span class="badge badge-phoenix badge-phoenix-primary float-right">${element.prioritaria}</span>`;
        }

        const columnaEstado = document.createElement('td');
        columnaEstado.innerHTML = col_estatus;
        const columnaEstado_Autorizacion = document.createElement('td');
        columnaEstado_Autorizacion.innerHTML = esatdo_autorizado;
        const columnaItr = document.createElement('td');
        columnaItr.innerHTML = cot_itr;
        const columnaNum_Cotizacion = document.createElement('td');
        columnaNum_Cotizacion.innerHTML = `<a href="#" id="btn_ver_solicitud_en_curso" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}" class="text-decoration-none">N°${element.nundoc_solicitud}</a>`;
        // columnaNum_Cotizacion.innerHTML = `<a href="#" id="btn_ver_solicitud" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" class="text-decoration-none" aria-disabled="true">N°${element.nundoc_solicitud}</a>`;
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

        /* Acciones para los botones */
        // if (element.n_cotizacion) {
        //   n_cotizacion = element.n_cotizacion;
        //   if (element.estado_autorizacion === 'cancelada' || element.estado_autorizacion === 'autorizado') {
        //     btn_editar = `
        //       <button  class="btn btn-warning btn-sm cell-detail hint--top-left" data-toggle="modal" data-target="#no_editar_cotizacion" title="Editar Cotización" data-toogle="tooltip" data-placement="top" onclick="prueba_editar_no(this)" data-hint="" data-id="${n_cotizacion}" data-id2="${element.estado_autorizado}">
        //           <span class="uil uil-file-edit-alt" style="color:#ffffff;"></span>
        //       </button>`;
        //   } else if (element.estado_autorizacion !== 'cancelada' || element.estado_autorizacion !== 'autorizado') {
        //     btn_editar = `
        //     <button onclick="prueba_editar_no(this)" class="btn btn-warning btn-sm cell-detail hint--top-left" data-hint="" data-id="${n_cotizacion}" data-id2="${element.estado_autorizado}">
        //       <!--<span class="icon mdi mdi-edit" data-toggle="modal" data-target="#no_editar_cotizacion" title="Editar Cotización"></span>-->
        //       <span class="uil uil-file-edit-alt" style="color:#ffffff;"></span>
        //     </button>`;
        //   }
        //   columnaAcciones.innerHTML = `
        //   <div class="btn-group btn-group-sm" role="group" aria-label="...">
        //     ${btn_editar}
        //     <button onclick="Visualizar(this)"; data-placement="top" class="btn btn-info btn-sm cell-detail hint--top-left" data-hint="" data-id="${n_cotizacion}" data-toggle="modal" data-target="#ver_cotizacion" title="Ver Cotización">
        //       <span class="uil uil-eye" style="color:#ffffff;"></span>
        //     </button>
        //     <button data-toggle="modal" data-target="#ver_historico" title="Historico" data-placement="top" onclick="historico(this,${n_cotizacion})";  class="btn btn-secondary btn-xs cell-detail hint--top-left" data-hint="" data-id="${element.nombre_cliente}">
        //       <span class="icon mdi mdi-balance"></span>
        //     </button>
        //     <button data-placement="top" data-toggle="modal" data-target="#tb_solicitud" title="Solicitud de servicio" onclick="tbsolicitudes(this,${n_cotizacion})";  class="btn btn-success btn-xs cell-detail hint--top-left" data-hint="" data-id="${element.nombre_cliente}">
        //        <span class="icon mdi mdi-account-circle" style="color:#ffffff;"></span>
        //      </button>
        //   </div>
        //   `;
        // } else {
        // }

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