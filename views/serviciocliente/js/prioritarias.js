window.initScript = function (id) {
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
  const fechaHoy = hoy.toISOString().split('T')[0];

  if (id === 2) {  // Usar el ID directamente
    const filtroSelector = `#campo-${id}-filtro`;
    const clientesSelector = `#campo-${id}-clientes`;

    let tipo = 2;
    let cliente = "";
    let fecha_inicial = $(`#campo-${id}-fecha_inicial`).val() || fechaHoy;
    let fecha_final = $(`#campo-${id}-fecha_final`).val() || fechaHoy;

    listar_solicitudes_prioritarias(tipo, fecha_inicial, fecha_final, cliente, id);

    // Manejador para cambio en filtro
    const filtroHandler = function () {
      document.getElementById(`campo-${id}-clientes`).style.display = "block";
      $.ajax({
        url: $('#base_url').val() + 'serviciocliente/Listar_Clientes',
        type: "POST",
        dataType: "json",
        success: function (data) {
          let select = $(clientesSelector);
          select.empty().append('<option value="">Seleccione</option>');
          $.each(data, function (index, item) {
            select.append(`<option value="${item.id}">${item.nombre}</option>`);
          });
          select.select2({ placeholder: 'Seleccione una opción', allowClear: true });
        },
        error: function (xhr, status, error) {
          console.error("Error en AJAX:", status, error);
          alert("Error al cargar los datos.");
        }
      });
    };

    // Manejador para cambio en clientes
    const clientesHandler = function () {
      let valorSeleccionado = $(this).val();
      listar_solicitudes_prioritarias(tipo, fecha_inicial, fecha_final, valorSeleccionado, id);
    };

    // Manejador para clic en botones
    const clickHandler = async (e) => {
      if (e.target.matches("#btn_ver_solicitud_Prioritaria, #btn_ver_solicitud_Prioritaria *")) {
        // // let padre = e.target.parentElement.parentElement;
        // // Obtener el enlace (el elemento con el data-id)
        let enlace = e.target.closest('#btn_ver_solicitud_Prioritaria');
        // // // Obtener el valor del atributo data-id
        let dataId = enlace.getAttribute('data-id');
        let dataId2 = enlace.getAttribute('data-id2');
        let dataId3 = enlace.getAttribute('data-id3');

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
    };

    document.addEventListener('click', async function (e) {  // 🔹 Escuchamos eventos de clic en toda la página
      // if (e.target.matches("#btn_aprobar_solicitud") || e.target.closest("#btn_aprobar_solicitud")) {
      //   let enlace = e.target.closest('#btn_aprobar_solicitud');
      //   let dataId = enlace.getAttribute('data-id');
      //   let dataNivel = enlace.getAttribute('data-nivel');
      //   let dataMotivo = enlace.getAttribute('data-motivo');
      //   let dataUsuario = enlace.getAttribute('data-usuario');
      //   let dataFechaPrioridad = enlace.getAttribute('data-FechaPrioridad');

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
      //     var datos = new FormData();
      //     datos.append('solicitud', dataId);
      //     datos.append('estado', "Aprobada");

      //     try {
      //       const response = await fetch($('#base_url').val() + 'serviciocliente/Aprobar_Prioridad', {
      //         method: 'POST',
      //         body: datos,
      //         cache: 'no-cache',
      //       });
      //       const data = await response.json();

      //       Swal.fire({
      //         title: "Mensaje!",
      //         text: data.message,
      //         icon: data.status === 200 ? "success" : "error",
      //         draggable: true
      //       });
      //       listar_solicitudes_pendientes(tipo, fecha_inicial, fecha_final, cliente);

      //       if (data.ststus === 200) resetAll();
      //     } catch (error) {
      //       console.error('Error en la solicitud:', error);
      //     }
      //   }
      // }

      if (e.target.matches("#btn_aprobar_solicitud") || e.target.closest("#btn_aprobar_solicitud")) {
        const enlace = e.target.closest('#btn_aprobar_solicitud');

        const dataId = enlace.getAttribute('data-id');
        const dataNivel = enlace.getAttribute('data-nivel');
        const dataMotivo = enlace.getAttribute('data-motivo');
        const dataUsuario = enlace.getAttribute('data-usuario');
        const dataFechaPrioridad = enlace.getAttribute('data-FechaPrioridad');

        const result = await Swal.fire({
          title: 'Confirmar aprobación',
          icon: 'warning',
          html: `
            <div class="text-start">
              <p><strong>Solicitud:</strong> ${dataId}</p>
              <p><strong>Nivel:</strong> ${dataNivel ?? 'N/A'}</p>
              <p><strong>Motivo:</strong> ${dataMotivo ?? 'N/A'}</p>
              <p><strong>Usuario:</strong> ${dataUsuario ?? 'N/A'}</p>
              <p><strong>Fecha prioridad:</strong> ${dataFechaPrioridad ?? 'N/A'}</p>
              <hr>
              <p class="text-danger fw-semibold mb-0">
                ¿Está seguro de aprobar esta solicitud?
              </p>
            </div>
          `,
          showCancelButton: true,
          confirmButtonColor: '#3B71CA',
          cancelButtonColor: '#9FA6B2',
          confirmButtonText: 'Sí, aprobar',
          cancelButtonText: 'Cancelar',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });

        if (!result.isConfirmed) return;

        const datos = new FormData();
        datos.append('solicitud', dataId);
        datos.append('estado', 'Aprobada');

        try {
          const response = await fetch(
            $('#base_url').val() + 'serviciocliente/Aprobar_Prioridad',
            {
              method: 'POST',
              body: datos,
              cache: 'no-cache',
            }
          );

          const data = await response.json();

          Swal.fire({
            title: 'Mensaje',
            text: data.message,
            icon: data.status === 200 ? 'success' : 'error',
          });

          listar_solicitudes_pendientes(tipo, fecha_inicial, fecha_final, cliente);

          if (data.status === 200) resetAll();

        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      }

      if (e.target.matches("#btn_detalle_prioritaria") || e.target.closest("#btn_detalle_prioritaria")) {
        const enlace = e.target.closest('#btn_detalle_prioritaria');

        const dataId = enlace.getAttribute('data-id');
        const dataNivel = enlace.getAttribute('data-nivel');
        const dataMotivo = enlace.getAttribute('data-motivo');
        const dataUsuario = enlace.getAttribute('data-usuario');
        const dataFechaPrioridad = enlace.getAttribute('data-FechaPrioridad');
        const dataUsuarioAprueba = enlace.getAttribute('data-usuario_aprueba');
        const dataFechaAprueba = enlace.getAttribute('data-FechaAprueba');

        const result = await Swal.fire({
          title: 'Confirmación aprobación',
          // icon: 'info',
          html: `
            <div class="text-start">
              <p><strong>Solicitud:</strong> ${dataId}</p>
              <p><strong>Nivel:</strong> ${dataNivel ?? 'N/A'}</p>
              <p><strong>Motivo:</strong> ${dataMotivo ?? 'N/A'}</p>
              <p><strong>Usuario:</strong> ${dataUsuario ?? 'N/A'}</p>
              <p><strong>Fecha prioridad:</strong> ${dataFechaPrioridad ?? 'N/A'}</p>
              <hr>
              <p><strong>Usuario Aprobación:</strong> ${dataUsuarioAprueba ?? 'N/A'}</p>
              <p><strong>Fecha Aprobación:</strong> ${dataFechaAprueba ?? 'N/A'}</p>
            </div>
          `,
          showCancelButton: false,
          // confirmButtonColor: '#3B71CA',
          cancelButtonColor: '#9FA6B2',
          // confirmButtonText: 'Sí, aprobar',
          cancelButtonText: 'Cerrar',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      }

    });

    // Asignar eventos usando delegación
    $(document).on('change', filtroSelector, filtroHandler);
    $(document).on('change', clientesSelector, clientesHandler);
    $(document).on('click', clickHandler);

    // Guardar referencias para limpiar luego
    window.VENTANA_HANDLERS = {
      filtroHandler,
      clientesHandler,
      clickHandler
    };
  } else {
    console.log("Ventana no manejada:", id);
  }
};

async function listar_solicitudes_prioritarias(tipo, fecha_inicial, fecha_final, cliente, id) {
  /* Funcion para enviar los datos */
  let dato = new FormData();
  dato.append('tipo', tipo);
  dato.append('fecha_inicial', fecha_inicial);
  dato.append('fecha_final', fecha_final);
  dato.append('estado', "Prioritarias");
  dato.append('cliente', cliente);
  try {
    const response = await fetch($('#base_url').val() + 'serviciocliente/consultar_cotizaciones', {
      method: 'POST',
      body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tblSolicitudesPrioritarias');
      tbody.innerHTML = '';
      let esatdo_autorizado = '';
      let col_estatus = '';
      let cot_itr = '';
      let Prioridad = '';
      let n_cotizacion = '';
      let btn_editar = '';
      let perfil = document.getElementById("perfil_id").value;

      // document.querySelector('.badge').innerHTML = data.resultado_cantidad['total_cotizaciones'];
      // $('.badge').html(data.resultado_cantidad['total_cotizaciones']);

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
        //   col_estatus = `<span  data-toggle="tooltip" style="color:purple;">${element.estado_autorizado}</span>`;
        // } else if (element.estado_autorizado === 'por autorizar') {
        //   col_estatus = `<span  data-toggle="tooltip" style="color:red;">${element.estado_autorizado}</span>`;
        // } else {
        //   col_estatus = `<td class="text"></td>`;
        // }

        /* Consultas de estado de las solicitudes */
        if (element.estado_autorizacion === 'F1') {
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">Realizada</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F2') {
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">Entregada</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F4') {
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Pérdida</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F3') {
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">Ganada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F5') {
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Cancelada</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F6') {
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">Rechazada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        }
        /* Validar si la solicitud es Itr */
        if (element.itr === 'Si') {
          cot_itr = `<span class="badge badge-phoenix badge-phoenix-success float-right">SI</span>`;
        } else {
          cot_itr = `<span class="badge badge-phoenix badge-phoenix-primary float-right">NO</span>`;
        }

        if (perfil === '1') {
          if (element.prioritaria === 'Propuesta') {
            Prioridad = `<span class="badge badge-phoenix badge-phoenix-warning float-right"><a href="#" id="btn_aprobar_solicitud" data-id="${element.nundoc_solicitud}" data-nivel="${element.nivel}" data-motivo="${element.motivo}" data-usuario="${element.usuario}" data-FechaPrioridad="${element.FechaPrioridad}" class="text-decoration-none text-warning" title="Aprobar solicitud">${element.prioritaria}</a></span>`;
          } else {
            // Prioridad = `<span class="badge badge-phoenix badge-phoenix-primary float-right">${element.prioritaria}</span>`;
            Prioridad = `<span class="badge badge-phoenix badge-phoenix-primary float-right"><a href="#" id="btn_detalle_prioritaria" data-id="${element.nundoc_solicitud}" data-nivel="${element.nivel}" data-motivo="${element.motivo}" data-usuario="${element.usuario}" data-FechaPrioridad="${element.FechaPrioridad}" data-usuario_aprueba="${element.usuario_aprueba}" data-FechaAprueba="${element.FechaAprueba}" class="text-decoration-none text-primary" title="Detalle Prioridad">${element.prioritaria}</a></span>`;
          }
        }

        const columnaEstado = document.createElement('td');
        columnaEstado.innerHTML = col_estatus;
        const columnaEstado_Autorizacion = document.createElement('td');
        columnaEstado_Autorizacion.innerHTML = esatdo_autorizado;
        const columnaItr = document.createElement('td');
        columnaItr.innerHTML = cot_itr;
        const columnaNum_Cotizacion = document.createElement('td');
        columnaNum_Cotizacion.innerHTML = `<a href="#" id="btn_ver_solicitud_Prioritaria" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}" data-id3="${id}" class="text-decoration-none"> N°${element.nundoc_solicitud}</a> `;
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