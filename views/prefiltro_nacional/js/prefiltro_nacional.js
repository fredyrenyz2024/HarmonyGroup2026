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
window.SELECTFILTRO = 'todos';

window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID de la ventana a la variable global
    Filtro();

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

    window.datosnuevos = {
        web: '',
        user_satelite: '',
        clave: '',
        docupro: '',
        docutene: '',
        docucondu: '',
    };

    const hoy = new Date(); // Obtener la fecha actual
    document.addEventListener('click', async (e) => {
        if (e.target.matches(`#campo-${window.VENTANA}-buscar`) || e.target.matches(`#campo-${window.VENTANA}-buscar *`)) {
            Filtro();
        }

        if (e.target.matches('.btn-manifestos-vehiculo') || e.target.matches('.btn-manifestos-vehiculo *')) {
            const placa = e.target.getAttribute('data-placa');

            if (!placa) {
                Swal.fire('Error', 'No se pudo obtener la placa del vehículo.', 'error');
                return;
            }

            // 1. Mostrar carga y obtener el tbody
            const tbodyDetalle = document.getElementById('tbody-manifiestos-encontrados');
            const h6Title = document.querySelector('.col-12.d-flex h6'); // El título de la columna de la tabla

            if (tbodyDetalle) {
                tbodyDetalle.innerHTML = '<tr><td colspan="10" class="text-center text-muted">Cargando manifiestos...</td></tr>';
            }
            if (h6Title) {
                h6Title.textContent = `Viajes del Vehículo ${placa}`;
            }

            // 2. Realizar la petición Fetch
            const formData = new URLSearchParams();
            formData.append('placa', placa);

            fetch($('#base_url').val() + 'controlt/getManifiestosByPlaca', {
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            })
                .then((response) => response.json())
                .then((result) => {
                    if (result.status && result.data.length > 0) {
                        document.getElementById('placa-text').innerHTML = placa;

                        // 3. Renderizar la tabla de Manifiestos
                        let html = '';
                        result.data.forEach((item) => {
                            const totalManifiesto = parseFloat(item.Total_Manifiesto || 0).toLocaleString('es-CO');
                            const anticipo = item.Anticipo || '$0.00';

                            html += `
                      <tr>
                          <td>${item.Manifiesto}</td>
                          <td>${item.remesa}</td>
                          <td>${item.Orden_Cargue}</td>
                          <td>${item.fecha_expedicion}</td>
                          <td>${item.Origen}</td>
                          <td>${item.Destino}</td>
                          <td>$${totalManifiesto}</td>
                          <td>${anticipo}</td>
                          <td>${item.Lugar_Expedicion}</td>
                          <td>
                              <button class="btn btn-sm btn-outline-info px-1 py-0" type="button" data-manifiesto-id="${item.Manifiesto}" onclick="ImprimirManifiesto(${item.Manifiesto})"><i class="far fa-eye"></i></button>
                          </td>
                      </tr>
                  `;
                        });

                        tbodyDetalle.innerHTML = html;
                    } else {
                        tbodyDetalle.innerHTML =
                            '<tr><td colspan="10" class="text-center text-info">No se encontraron viajes activos para esta placa.</td></tr>';
                    }
                })
                .catch((error) => {
                    console.error('Error al obtener manifiestos:', error);
                    tbodyDetalle.innerHTML = '<tr><td colspan="10" class="text-center text-danger">Fallo de conexión al servidor.</td></tr>';
                });
        }

        if (e.target.matches('.btn-seleccionar-vehiculo') || e.target.matches('.btn-seleccionar-vehiculo *')) {
            const Placa = e.target.getAttribute('data-placa');
            const NudocSolicitud = e.target.getAttribute('data-NudocSolicitud');
            const ConductorId = e.target.getAttribute('data-ConductorId');
            const NombreConductor = e.target.getAttribute('data-NombreConductor');
            const CelularConductor = e.target.getAttribute('data-CelularConductor');
            const LugarVehiculo = e.target.getAttribute('data-lugar');
            const Origen = e.target.getAttribute('data-origen');
            const Destino = e.target.getAttribute('data-destino');
            const FechCargue = e.target.getAttribute('data-fechcargue');
            const HoraCargue = e.target.getAttribute('data-horacargue');
            const Peso = e.target.getAttribute('data-peso');
            // Mostrar Swal con logo y spinner

            Swal.fire({
                title: 'Enviando mensaje...',
                html: `
                    <div style="display: flex; align-items: center; flex-direction: column; justify-content: center;">
                        <img src="${$('#base_url').val()}public/img/788.gif" alt="Logo" width="100" style="margin-bottom: 10px;" />
                        <p style="font-size: 16px; font-weight: 500; color: #333;">
                            Estamos enviando el mensaje al conductor. <br>
                            Por favor, espere un momento...
                        </p>
                    </div>
                `,
                showConfirmButton: false,
                allowOutsideClick: false,
                backdrop: true,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const datos = new FormData();
            datos.append('TelefonoConductor', CelularConductor);
            datos.append('Conductor', NombreConductor);
            datos.append('Origen', Origen);
            datos.append('Destino', Destino);
            datos.append('FechCargue', FechCargue);
            datos.append('HoraCargue', HoraCargue);
            datos.append('NudocSolicitud', NudocSolicitud);
            datos.append('ConductorId', ConductorId);
            datos.append('Placa', Placa);
            datos.append('Lugar', LugarVehiculo);
            datos.append('Peso', Peso);

            try {
                const response = await fetch($('#base_url').val() + 'prefiltro_nacional/Enviar_mensaje_conductor', {
                    method: 'POST',
                    body: datos,
                    cache: 'no-cache',
                });
                const data = await response.json();

                Swal.fire({
                    // icon: data.estado === 200 ? 'success' : 'info',
                    icon: data.status === "queued" ? 'success' : 'info',
                    // title: data.estado === 200 ? 'Mensaje enviado con éxito' : 'Mensaje procesado',
                    title: data.status === "queued" ? 'Mensaje enviado con éxito' : 'Mensaje procesado',
                    html: `
                  <p style="font-size: 14px;">${data.mensaje || 'El sistema ha procesado su solicitud.'}</p>
              `,
                    confirmButtonColor: '#3085d6',
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al enviar',
                    html: `<p style="font-size:14px;">Ocurrió un error al enviar el mensaje. Intente nuevamente más tarde.</p>`,
                });
                console.error('Error en la solicitud:', error);
            }
        }
    });

    document.addEventListener('change', function (e) {
        if (e.target.classList.contains('checkbox-vehiculo')) {
            const placa = e.target.dataset.placa;
            const btn = document.getElementById(`btnGestionar-${placa}`);

            if (!btn) return; // por si algo falla

            if (e.target.checked) {
                btn.setAttribute('disabled', true);
            } else {
                btn.removeAttribute('disabled');
            }
        }
    });

    /* Validaciones de los filtros a mostrar */
    $(`#campo-${window.VENTANA}-filtro`)
        .off('change')
        .on('change', function () {
            let valorSeleccionado = $(this).val();

            let $clientes = $(`#campo-${window.VENTANA}-clientes`);
            let $estados = $(`#campo-${window.VENTANA}-estados`);

            // Función para ocultar un select con Select2
            function ocultarSelect2($el) {
                if ($el.hasClass('select2-hidden-accessible')) {
                    $el.select2('destroy');
                }
                $el.val('').hide();
            }

            // Reset inicial de ambos
            ocultarSelect2($clientes);
            ocultarSelect2($estados);

            // -------- CLIENTES --------
            if (valorSeleccionado === 'Clientes') {
                $clientes.show();

                $.ajax({
                    url: $('#base_url').val() + 'serviciocliente/Listar_Clientes',
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        $clientes.empty().append('<option value="">Seleccione</option>');

                        $.each(data, function (index, item) {
                            $clientes.append(`<option value="${item.id}">${item.nombre}</option>`);
                        });

                        $clientes.select2({
                            placeholder: 'Seleccione una opción',
                            allowClear: true,
                        });
                    },
                    error: function (xhr, status, error) {
                        console.error('Error en AJAX:', status, error);
                        alert('Error al cargar los datos.');
                    },
                });
            }

            // -------- ESTADOS --------
            else if (valorSeleccionado === 'Estados') {
                const listaDeEstados = [
                    { value: '1', texto: 'Placas asignadas' },
                    { value: '0', texto: 'Sin asignar' },
                    { value: 'Propuesta', texto: 'Propuesta' },
                    { value: 'Aprobada', texto: 'Prioritarias' },
                ];

                $estados.show().empty().append('<option value="">Seleccione un Estado</option>');

                $.each(listaDeEstados, function (i, item) {
                    $estados.append(`<option value="${item.value}">${item.texto}</option>`);
                });

                $estados.select2({
                    placeholder: 'Seleccione un estado',
                    allowClear: true,
                });
            }
        });

    //Solicitar prioridad para solicitudes
    document.addEventListener('click', async function (e) {
        // 🔹 Escuchamos eventos de clic en toda la página
        // if (e.target.matches('#btn_aprobar_solicitud') || e.target.closest('#btn_aprobar_solicitud')) {
        //     let enlace = e.target.closest('#btn_aprobar_solicitud');
        //     let dataId = enlace.getAttribute('data-id');

        //     const result = await Swal.fire({
        //         title: 'Seguro',
        //         text: '¿Desea aprobar la solicitud?',
        //         icon: 'warning',
        //         showCancelButton: true,
        //         confirmButtonColor: '#3B71CA',
        //         cancelButtonColor: '#9FA6B2',
        //         confirmButtonText: 'Aceptar',
        //         cancelButtonText: 'Cancelar',
        //         customClass: {
        //             popup: 'swal2-custom-font',
        //         },
        //     });

        //     if (result.isConfirmed) {
        //         var datos = new FormData();
        //         datos.append('solicitud', dataId);
        //         datos.append('estado', 'Aprobada');

        //         try {
        //             const response = await fetch($('#base_url').val() + 'serviciocliente/Aprobar_Prioridad', {
        //                 method: 'POST',
        //                 body: datos,
        //                 cache: 'no-cache',
        //             });
        //             const data = await response.json();

        //             Swal.fire({
        //                 title: 'Mensaje!',
        //                 text: data.message,
        //                 icon: data.status === 200 ? 'success' : 'error',
        //                 draggable: true,
        //             });
        //             Filtro(window.VENTANA);

        //             if (data.ststus === 200) resetAll();
        //         } catch (error) {
        //             console.error('Error en la solicitud:', error);
        //         }
        //     }
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

        if (e.target.matches('#btn-solicitar-prioridad') || e.target.matches('#btn-solicitar-prioridad *')) {
            // Buscar el elemento padre con el id, en caso de que se haya clickeado un hijo
            const btn = e.target.closest('#btn-solicitar-prioridad');
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
        if (e.target.matches('#btn_save_propuesta') || e.target.matches('#btn_save_propuesta *')) {
            let enlace = e.target.closest('#btn_save_propuesta');
            // // Obtener el valor del atributo data-id
            let Numdoc_solicitud = enlace.getAttribute('data-NumdocSolicitud');
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: '¿Quieres cambiar el estado?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, cambiar',
                cancelButtonText: 'Cancelar',
            });

            if (result.isConfirmed) {
                // Aplica el cambio solo si se confirma
                datos = new FormData();
                datos.append('estado', 'Propuesta');
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
                            title: 'Mensaje!',
                            text: data.message,
                            icon: 'success',
                            draggable: true,
                        });
                        tipo = 2;
                        fecha_inicial = $(`#campo-${id}-fecha_inicial`).val();
                        fecha_final = $(`#campo-${id}-fecha_final`).val();
                        cliente = $(`#campo-${id}-clientes`).val() === '' ? '' : $(`#campo-${id}-clientes`).val();
                        empresa = $(`#campo-${id}-empresas`).val() === '' ? '' : $(`#campo-${id}-empresas`).val();
                        estado = 'Todas';
                        Filtro();
                        myOffcanvas.hide();
                    } else {
                        Swal.fire({
                            title: 'Mensaje!',
                            text: data.message,
                            icon: 'error',
                            draggable: true,
                        });
                    }
                } catch (error) {
                    console.error('Error en la primera solicitud:', error);
                }
            } else {
                // Revierte el cambio si se cancela
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

        if (e.target.matches('#btn-detalle-solicitud-servicio') || e.target.matches('#btn-detalle-solicitud-servicio *')) {
            // let padre = e.target.parentElement.parentElement;
            // Obtener el enlace (el elemento con el data-id)
            let enlace = e.target.closest('#btn-detalle-solicitud-servicio');
            // // Obtener el valor del atributo data-id
            let dataId = enlace.getAttribute('data-id');
            let dataId2 = enlace.getAttribute('data-id2');
            let dataId3 = enlace.getAttribute('data-id3');

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

        if (e.target.matches(`#btn-enturnar`) || e.target.matches(`#btn-enturnar *`)) {
            let enlace = e.target.closest('#btn-enturnar');
            // // Obtener el valor del atributo data-id
            let origenEnturnar = enlace.getAttribute('data-origenEnturnar');
            let Origen = enlace.getAttribute('data-Origen');
            let Destino = enlace.getAttribute('data-Destino');
            let FechCargue = enlace.getAttribute('data-FechCargue');
            let HoraCargue = enlace.getAttribute('data-HoraCargue');
            let NudocSolicitud = enlace.getAttribute('data-NudocSolicitud');

            /* Titulo del offcanva */
            myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Enturnar`);
            myOffcanvas.updateContent(`
                <!-- REFERENCIAS-->
                    <table class='table table-bordered table-striped table-sm' style=" font-size:12px;">
                        <thead>
                            <tr>
                            <td class="text-center" colspan='6'>
                                <b>Candidatos para enturnar</b>
                            </td>
                            </tr>
                            <tr>
                            <th class="text-center" style="width: auto; white-space: nowrap; color:black;">Placa</th>
                            <th class="text-center" style="width: auto; white-space: nowrap; color:black;">Conductor</th>
                            <th class="text-center" style="width: auto; white-space: nowrap; color:black;">Ruta</th>
                            <th class="text-center" style="width: auto; white-space: nowrap; color:black;">Telefono</th>
                            <!--<th class="text-center" style="width: auto; white-space: nowrap; color:black;">Acción</th>-->
                            </tr>
                        </thead>
                        <tbody id="tbody-enturnar"></tbody>
                    </table>
            `);

            datos = new FormData();
            datos.append('origenEnturnar', origenEnturnar);

            try {
                const response = await fetch($('#base_url').val() + 'prefiltro_nacional/Listar_Recursos_Enturnar', {
                    method: 'POST',
                    body: datos,
                    cache: 'no-cache',
                });
                const data = await response.json();

                if (data) {
                    const tbody = document.getElementById('tbody-enturnar');
                    tbody.innerHTML = ''; // Limpia contenido previo por si acaso

                    data.forEach((item) => {
                        const tr = document.createElement('tr');

                        tr.innerHTML = `
              <td class="text-center" style="width: auto; white-space: nowrap; color:black;">
                  <div class="dropdown">
                      <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${item.placa}</a>
                      <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
                      <a class="dropdown-item fw-bold" href="#" id='btn-enturnar-recurso' data-TelefonoConductor='${item.Celular}' data-Conductor='${item.Conductor}' 
                      data-Origen='${Origen}' data-Destino='${Destino}' data-FechCargue='${FechCargue}' data-HoraCargue='${HoraCargue}' data-NudocSolicitud='${NudocSolicitud}' 
                      data-ConductorId='${item.numdoc_nexos}' data-Placa='${item.placa}'>Enturnar</a>

                      <a class="dropdown-item fw-bold" href="#" id='btn-notificar-recurso' data-TelefonoConductor='${item.Celular}'>Notificar</a>
                      <!--<a class="dropdown-item fw-bold" href="#">Another action</a>
                      <a class="dropdown-item fw-bold" href="#">Something else here</a>

                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item fw-bold" href="#">Separated link</a>
                      </div>-->
                  </div>
              </td>
              <td class="text-center" style="width: auto; white-space: nowrap; color:black;">${item.Conductor}</td>
              <td class="text-center" style="width: auto; white-space: nowrap; color:black;">${item.Ruta}</td>
              <td class="text-center" style="width: auto; white-space: nowrap; color:black;">${item.Celular}</td>
              <!--<td class="text-center" style="width: auto; white-space: nowrap; color:black;">
                <button class="btn btn-sm btn-primary" onclick="enturnarVehiculo(${item.Numero_Manifiesto})">
                  Enturnar
                </button>
              </td>-->
            `;

                        tbody.appendChild(tr);
                    });
                }
            } catch (error) {
                console.error('Error en la primera solicitud:', error);
            }

            myOffcanvas.show();
        }

        // if (e.target.matches('#btn-gestionar-seleccionados') || e.target.matches('#btn-gestionar-seleccionados *')) {
        //     // let placas = getVehiculosSeleccionados();
        //     // console.log('Vehículos seleccionados:', placas);
        //     let vehiculosSeleccionados = getVehiculosSeleccionados();
        //     console.log('Vehículos seleccionados:', vehiculosSeleccionados);
        // }

        if (e.target.matches('#btn-gestionar-seleccionados') || e.target.matches('#btn-gestionar-seleccionados *')) {
            let vehiculosSeleccionados = getVehiculosSeleccionados();

            fetch($('#base_url').val() + 'prefiltro_nacional/Enviar_multiples_vehiculos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vehiculos: vehiculosSeleccionados }),
            })
                .then((r) => r.json())
                .then((data) => {
                    console.log('Respuesta del servidor:', data);
                    Swal.fire('OK', data.mensaje, 'success');
                })
                .catch((err) => {
                    console.error('ERROR:', err);
                    Swal.fire('Error', 'No se pudo enviar la solicitud', 'error');
                });
        }
    });

    /**
     * Script para gestionar el evento de clic en el botón "Buscar Vehiculo",
     * extraer los parámetros necesarios y realizar una petición POST AJAX/Fetch
     * al controlador PHP para buscar vehículos, mostrando los resultados en el mapa de Google Maps.
     */

    // Variable global para mantener la instancia del mapa de Google Maps
    window.googleMap = null;

    // La URL base debe ser accesible globalmente si se usa $('#base_url').val()
    // Asegúrate de que este elemento existe en tu HTML, sino, cámbialo a la URL fija.
    const BASE_URL = $('#base_url').length ? $('#base_url').val() : '';

    // 🛑 VARIABLES GLOBALES (Asegurar accesibilidad)
    let googleMap = null;
    window.searchData = null; // Almacena las coordenadas de origen
    window.searchDatosEnturnar = []; // Almacena las coordenadas de origen
    window.globalNudocConductor = []; // Almacena las coordenadas de origen

    // 🛑 FUNCIONES DE UTILIDAD PARA EL MAPA (Geocoding y Renderizado de Marcadores)

    /**
     * Función auxiliar para realizar el Geocoding inverso.
     */
    async function obtenerNombreLugar(geocoder, lat, lng) {
        return new Promise((resolve, reject) => {
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    resolve(results[0].formatted_address);
                } else {
                    console.warn('No se pudo obtener el nombre del lugar:', status);
                    resolve('Lugar desconocido');
                }
            });
        });
    }

    /**
     * Inicializa/Actualiza el mapa de Google Maps y coloca los marcadores.
     */
    async function initGoogleMapAndShowVehicles(positions, centerLat, centerLng) {
        const mapId = 'map-container';
        const container = document.getElementById(mapId);

        if (!container) {
            console.error('Contenedor del mapa no encontrado.');
            return;
        }

        // Reinicialización del mapa
        if (googleMap) {
            googleMap = null;
        }

        // 🛑 Importación de Librerías (requiere que la API Key esté cargada correctamente)
        const { Map } = await google.maps.importLibrary('maps');
        const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
        const { Geocoder } = await google.maps.importLibrary('geocoding');

        const geocoder = new Geocoder();
        const centerCoords = { lat: parseFloat(centerLat), lng: parseFloat(centerLng) };

        // Creación del mapa
        googleMap = new Map(container, {
            center: centerCoords,
            zoom: 13,
            gestureHandling: 'greedy',
            mapId: 'db5350020424d6c4',
        });

        const bounds = new google.maps.LatLngBounds();
        bounds.extend(centerCoords);

        // Marcador de Origen
        new AdvancedMarkerElement({
            map: googleMap,
            position: centerCoords,
            title: 'Punto de Búsqueda (Origen)',
        });

        // Marcadores de Vehículos
        for (const pos of positions) {
            const coords = { lat: parseFloat(pos.latitude), lng: parseFloat(pos.longitude) };
            bounds.extend(coords);

            const nombreLugar = await obtenerNombreLugar(geocoder, coords.lat, coords.lng);

            const contentDiv = document.createElement('div');
            contentDiv.className = 'vehicle-marker-content';
            contentDiv.style.cssText =
                'background: #007bff; color: white; padding: 4px 8px; border-radius: 4px; border: 2px solid white; font-size: 10px; font-weight: bold; white-space: nowrap; cursor: pointer;';
            contentDiv.innerHTML = `${pos.plate} (${nombreLugar.split(',')[0].trim()})`;

            new AdvancedMarkerElement({
                map: googleMap,
                position: coords,
                title: `Placa: ${pos.plate}\nUbicación: ${nombreLugar}`,
                content: contentDiv,
            });

            // 3️⃣ Buscar el botón correspondiente a esta placa
            const botonGestionar = document.querySelector(`.btn-seleccionar-vehiculo[data-placa="${pos.plate}"]`);

            if (botonGestionar) {
                // 4️⃣ Guardar la ubicación en el botón
                botonGestionar.dataset.lugar = nombreLugar;

                // 🔥 Opcional: actualizar el texto del botón o tooltip
                botonGestionar.title = `Gestionar (${nombreLugar.split(',')[0].trim()})`;
            } else {
                console.warn(`⚠️ No se encontró botón para la placa ${pos.plate}`);
            }
        }

        // Ajustar el zoom
        if (positions.length > 0) {
            googleMap.fitBounds(bounds);
        } else {
            googleMap.setZoom(13);
            googleMap.setCenter(centerCoords);
        }

        console.log(`[MAPA] Google Maps inicializado y ${positions.length} vehículos colocados.`);
    }

    /**
     * Controla la visibilidad del overlay/radar.
     */
    function toggleMapLoading(show, message = 'Consultando...') {
        const loadingOverlay = document.getElementById('map-loading-overlay');
        const titleElement = document.getElementById('offcanvasBottomLabel');

        if (loadingOverlay) {
            // Muestra u oculta el overlay completo (El efecto radar está dentro del overlay en el HTML)
            loadingOverlay.style.display = show ? 'flex' : 'none';
            const messageDiv = loadingOverlay.querySelector('.fw-bold');
            if (messageDiv) {
                messageDiv.textContent = show ? message : 'Búsqueda Finalizada.';
            }
        }

        if (titleElement) {
            titleElement.textContent = show ? `Resultados: ${message}` : titleElement.textContent;
        }
    }

    // --------------------------------------------------------------------------------------------------
    // 🛑 FUNCIÓN CENTRAL: Ejecuta el Fetch y Renderiza el Mapa
    // --------------------------------------------------------------------------------------------------

    // JS (Función executeSearchAndRenderMap Finalizada)
    async function executeSearchAndRenderMap(latitude, longitude, tipologia, carroceria) {
        const url = BASE_URL + 'controlt/searchVehiclesAction';
        const titleElement = document.getElementById('offcanvasBottomLabel');
        const tbody = document.getElementById('tbody-vehiculos-encontrados');
        const tbody1 = document.getElementById('tbody-manifiestos-encontrados');
        tbody1.innerHTML = ''; // Limpia contenido previo por si acaso
        const contenedor = document.getElementById('tbl_totalizados_configuracion');
        contenedor.innerHTML = ''; // Limpia contenido previo por si acaso
        const Select = $('#select-tipologia-local').select2();
        Select.empty();

        // $('#select-tipologia-local').select2();

        toggleMapLoading(true, 'Iniciando radar y consulta de vehículos...');
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Consultando API...</td></tr>';

        // 🛑 Paso 1: Captura de datos (asumiendo que window.searchData ya fue llenado)
        const NudocSolicitud = window.searchData?.NudocSolicitud;
        const OrigenEnturnar = window.searchData?.OrigenEnturnar;
        const ClienteEnturnar = window.searchData?.ClienteEnturnar;
        const DestinoEnturnar = window.searchData?.DestinoEnturnar;
        const ClienteNombre = window.searchData?.ClienteNombre;
        const TipoMercancia = window.searchData?.TipoMercancia;
        const Ruta = window.searchData?.Ruta;
        const Origen = window.searchData?.Origen;
        const Destino = window.searchData?.Destino;
        const FechaCargue = window.searchData?.FechaCargue;
        const HoraCargue = window.searchData?.HoraCargue;
        const Peso = window.searchData?.Peso;

        // 🛑 Paso 2: Crear el objeto con los pares clave-valor correctos de JS
        const nuevoRegistro = {
            NudocSolicitud: NudocSolicitud,
            OrigenEnturnar: OrigenEnturnar,
            ClienteEnturnar: ClienteEnturnar,
            DestinoEnturnar: DestinoEnturnar,
            ClienteNombre: ClienteNombre,
            TipoMercancia: TipoMercancia,
            Ruta: Ruta,
            Origen: Origen,
            Destino: Destino,
            FechaCargue: FechaCargue,
            HoraCargue: HoraCargue,
            Peso: Peso,
        };

        // 🛑 Paso 3: Agregar el objeto al array global
        window.searchDatosEnturnar.push(nuevoRegistro);

        // 1. Preparar parámetros de búsqueda
        const formData = new URLSearchParams();
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('clienteid', ClienteEnturnar);
        formData.append('destinoid', DestinoEnturnar);

        // Filtros dinámicos
        if (tipologia || carroceria) {
            let filterArray = [];
            if (carroceria) filterArray.push({ name: 'BodyWork', value: carroceria });
            if (tipologia) filterArray.push({ name: 'Typology', value: tipologia });
            formData.append('Filter', JSON.stringify(filterArray));
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP Error ${response.status}: ${errorText.substring(0, 100)}...`);
            }
            const data = await response.json();

            // 🛑 OBTENER EL MAPA DE VIAJES
            const viajesPorPlaca = data.Viajes || {};
            const viajesPorDestino = data.Destino || {};
            const viajesPorCliente = data.Cliente || {};
            const CodigoConductor = data.Codigo || {};
            const CelularesConductor = data.Celulares || {};

            // 🛑 CORRECCIÓN: Asignar directamente el objeto de mapeo.
            window.globalNudocConductor = CodigoConductor;

            // 🛑 Manejo de la Respuesta
            if (data.success && Array.isArray(data.data)) {
                const vehiclesFound = data.data;
                const totalVehicles = vehiclesFound.length;

                // 🛑 CLAVE: ALMACENAR LOS DATOS CRUDOS PARA FILTRADO LOCAL
                window.globalVehicleData = vehiclesFound;

                // 🛑 LLAMADA CRÍTICA: LLENAR EL SELECT DE TIPOLOGÍAS CON LOS RESULTADOS OBTENIDOS
                populateSelectTipologias(vehiclesFound);

                // // 🛑 CLAVE: ALMACENAR LOS DATOS CRUDOS PARA FILTRADO LOCAL
                // window.globalVehicleData = vehiclesFound;
                let htmlRows = '';

                // 🛑 1. Manejo de Cero Vehículos (Caso de éxito con 0 resultados)
                if (totalVehicles === 0) {
                    Swal.fire('Atención', 'No hay vehículos en este radio con los filtros aplicados.', 'info');
                    titleElement.textContent = `Resultados: 0 Vehículo(s) Encontrado(s)`;
                    await initGoogleMapAndShowVehicles([], latitude, longitude);
                    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-info">No se encontraron vehículos.</td></tr>';
                    renderizarTotalesConfiguracion([]);
                } else {
                    // 🛑 1. CONTAR CONFIGURACIONES
                    const conteoConfiguracion = contarPorConfiguracion(vehiclesFound);

                    // 🛑 2. MOSTRAR TABLA DE TOTALES POR CONFIGURACIÓN
                    renderizarTotalesConfiguracion(conteoConfiguracion);

                    // 🛑 3. Caso: Éxito con Resultados (> 0)
                    const vehiclePositions = vehiclesFound.map((item) => {
                        // 🛑 PASO A: EXTRACCIÓN Y LIMPIEZA DE DATOS
                        const placa = item.vehicle.licence_plate;
                        const tipologia = item.vehicle.vehicle_typology || 'N/A';
                        const nombreConductor = `${item.driver.name || ''} ${item.driver.last_name || ''}`.trim() || 'N/A';
                        // const celularConductor = item.driver.cellphone || 'N/A';

                        // 🛑 BUSCAR EL TOTAL DE VIAJES PARA ESTA PLACA
                        const totalManifiestos = viajesPorPlaca[placa] || 0;
                        window.globalManifiestos = totalManifiestos;
                        const totalManifiestosDestino = viajesPorDestino[placa] || 0;
                        window.globalManifiestosDestino = totalManifiestosDestino;
                        const totalManifiestosCliente = viajesPorCliente[placa] || 0;
                        window.globalManifiestosCliente = totalManifiestosCliente;

                        // 🛑 BUSCAR EL NUDOC DEL CONDUCTOR
                        const NudocConductor = CodigoConductor[placa] || 0;
                        const CelularConductor = CelularesConductor[placa] || 0;

                        let ownerName = 'N/A';
                        let ownerPhone = 'N/A';
                        try {
                            const ownerData = JSON.parse(item.vehicle.vehicle_owner);
                            ownerName = ownerData.name || 'N/A';
                            ownerPhone = ownerData.phone || 'N/A';
                        } catch (e) {
                            console.warn(`Error al parsear owner data para placa ${placa}`);
                        }

                        // 🛑 PASO B: CONSTRUIR LA FILA HTML (Integrando TotalViajes)
                        htmlRows += `
                            <tr class="vehicle-row" data-placa="${placa}" data-latitud="${item.position.latitude}"  data-longitud="${item.position.longitude
                            }">

                                <!-- 🟩 Checkbox de selección múltiple -->
                                <td  class="text-center d-flex justify-content-center" style="color:black;width:auto; white-space: nowrap;">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input checkbox-vehiculo" 
                                            id="flexSwitchCheckPlacaSeleccionada-${placa}" 
                                            data-placa="${placa}"
                                            data-nudocsolicitud="${NudocSolicitud}"
                                            data-origenenturnar="${OrigenEnturnar}"
                                            data-conductorid="${NudocConductor}"
                                            data-nombreconductor="${nombreConductor}"
                                            data-celularconductor="${CelularConductor}"
                                            data-origen="${Origen}"
                                            data-destino="${Destino}"
                                            data-fechacargue="${FechaCargue}"
                                            data-horacargue="${HoraCargue}"
                                            data-peso="${Peso}"
                                            type="checkbox">
                                    </div>
                                </td>

                                <td class="fw-bold text-danger">${placa}</td>
                                <td style="font-size: 11px; text-align: left;">
                                    ${tipologia}
                                </td>

                                <td>
                                    <span class="badge badge-phoenix badge-phoenix-${totalManifiestos > 0 ? 'success' : 'secondary'}">
                                        ${totalManifiestos} viajes
                                    </span>
                                </td>

                                <td>
                                    <span class="badge badge-phoenix badge-phoenix-${totalManifiestosDestino > 0 ? 'success' : 'secondary'}">
                                        ${totalManifiestosDestino} viajes
                                    </span>
                                </td>

                                <td>
                                    <span class="badge badge-phoenix badge-phoenix-${totalManifiestosCliente > 0 ? 'success' : 'secondary'}">
                                        ${totalManifiestosCliente} viajes
                                    </span>
                                </td>

                                <td>
                                    <div class="btn-group btn-group-sm" role="group" aria-label="...">
                                        <!--<button class="btn btn-success px-1 py-0 btn-seleccionar-vehiculo me-2"
                                            data-placa="${placa}"
                                            data-NudocSolicitud="${NudocSolicitud}"
                                            data-OrigenEnturnar="${OrigenEnturnar}"
                                            data-ConductorId="${NudocConductor}"
                                            data-NombreConductor="${nombreConductor}"
                                            data-CelularConductor="${CelularConductor}"
                                            data-origen="${Origen}"
                                            data-destino="${Destino}"
                                            data-fechcargue="${FechaCargue}"
                                            data-horacargue="${HoraCargue}"
                                            data-peso="${Peso}"
                                            type="button">Gestionar</button>-->
                                            <button id="btnGestionar-${placa}"
                                                class="btn btn-success px-1 py-0 btn-seleccionar-vehiculo me-2"
                                                data-placa="${placa}"
                                                data-NudocSolicitud="${NudocSolicitud}"
                                                data-OrigenEnturnar="${OrigenEnturnar}"
                                                data-ConductorId="${NudocConductor}"
                                                data-NombreConductor="${nombreConductor}"
                                                data-CelularConductor="${CelularConductor}"
                                                data-origen="${Origen}"
                                                data-destino="${Destino}"
                                                data-fechcargue="${FechaCargue}"
                                                data-horacargue="${HoraCargue}"
                                                data-peso="${Peso}"
                                                type="button">Gestionar</button>

                                        <button class="btn btn-info px-1 py-0 btn-manifestos-vehiculo"
                                            data-placa="${placa}" type="button">Manifiestos</button>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td></td> <!-- 🟩 Celda vacía para alinear con checkbox -->
                                <td colspan="6" class="p-0 border-0">
                                    <div class="bg-light p-2 text-start" style="font-size: 11px;">
                                        <p class="mb-0"><strong>Conductor:</strong> ${nombreConductor} (${CelularConductor})</p>
                                    </div>
                                </td>
                            </tr>
                        `;

                        return { plate: placa, latitude: item.position.latitude, longitude: item.position.longitude };
                    });

                    // 🛑 4. PINTAR LA TABLA COMPLETA
                    tbody.innerHTML = htmlRows;

                    // 5. Inicializar el mapa de Google
                    await initGoogleMapAndShowVehicles(vehiclePositions, latitude, longitude);
                    await DetalleVehiculos(OrigenEnturnar, DestinoEnturnar);
                    titleElement.textContent = `Resultados: ${totalVehicles} Vehículo(s) Encontrado(s) | Radar en Lat: ${latitude} - Solicitud: #${NudocSolicitud} - Cliente: ${ClienteNombre} - Ruta: ${Ruta}`;
                }
            }
            // 🛑 3. Manejo de Fallo de Lógica del Controlador (success: false)
            else {
                Swal.fire('Atención', data.message || 'Respuesta de la API no válida.', 'info');
                titleElement.textContent = `Resultados: 0 Vehículo(s) Encontrado(s)`;
                tbody.innerHTML = '<tr><td colspan="4" class="text-center text-info">No se encontraron vehículos.</td></tr>';
                await initGoogleMapAndShowVehicles([], latitude, longitude);
                renderizarTotalesConfiguracion([]); // Limpiar la tabla si falla la API
            }
        } catch (error) {
            console.error('[ERROR FETCH]:', error.message);
            Swal.fire('Error de Búsqueda', `Ocurrió un error al buscar vehículos. Mensaje: ${error.message}`, 'error');
            titleElement.textContent = `Error: Falló la búsqueda.`;
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error de conexión.</td></tr>';
            await initGoogleMapAndShowVehicles([], latitude, longitude);
            renderizarTotalesConfiguracion([]); // Limpiar la tabla si falla la conexión
        } finally {
            toggleMapLoading(false);
        }
    }

    // function getVehiculosSeleccionados() {
    //     let seleccionados = [];

    //     document.querySelectorAll('.checkbox-vehiculo:checked').forEach((chk) => {
    //         seleccionados.push(chk.dataset.placa);
    //     });

    //     return seleccionados;
    // }

    // function getVehiculosSeleccionados() {
    //     let seleccionados = [];

    //     document.querySelectorAll('.checkbox-vehiculo:checked').forEach((chk) => {
    //         // Copia todo el dataset del input
    //         const datos = { ...chk.dataset };

    //         // Si quieres, puedes castear números aquí:
    //         // datos.peso = Number(datos.peso || 0);

    //         seleccionados.push(datos);
    //     });

    //     return seleccionados;
    // }

    // function getVehiculosSeleccionados() {
    //     let seleccionados = [];

    //     document.querySelectorAll('.checkbox-vehiculo:checked').forEach((chk) => {
    //         const vehiculo = {
    //             placa: chk.getAttribute('data-placa'),
    //             nudocSolicitud: chk.getAttribute('data-nudocsolicitud'),
    //             origenEnturnar: chk.getAttribute('data-origenenturnar'),
    //             origen: chk.getAttribute('data-origen'),
    //             destino: chk.getAttribute('data-destino'),
    //             conductorId: chk.getAttribute('data-conductorid'),
    //             nombreConductor: chk.getAttribute('data-nombreconductor'),
    //             celularConductor: chk.getAttribute('data-celularconductor'),
    //             fechaCargue: chk.getAttribute('data-fechacargue'),
    //             horaCargue: chk.getAttribute('data-horacargue'),
    //             peso: chk.getAttribute('data-peso'),
    //         };

    //         seleccionados.push(vehiculo);
    //     });

    //     return seleccionados;
    // }

    function getVehiculosSeleccionados() {
        let seleccionados = [];

        document.querySelectorAll('.checkbox-vehiculo:checked').forEach(chk => {

            const vehiculo = {
                placa: chk.getAttribute("data-placa"),
                nudocSolicitud: chk.getAttribute("data-nudocsolicitud"),
                origenEnturnar: chk.getAttribute("data-origenenturnar"),
                origen: chk.getAttribute("data-origen"),
                destino: chk.getAttribute("data-destino"),
                conductorId: chk.getAttribute("data-conductorid"),
                nombreConductor: chk.getAttribute("data-nombreconductor"),
                celularConductor: chk.getAttribute("data-celularconductor"),
                fechaCargue: chk.getAttribute("data-fechacargue"),
                horaCargue: chk.getAttribute("data-horacargue"),
                peso: chk.getAttribute("data-peso"),
            };

            console.log("CHECKBOX LEE:", vehiculo);

            seleccionados.push(vehiculo);
        });

        return seleccionados;
    }


    /**
     * Función auxiliar para escapar HTML y prevenir XSS simple.
     * Esto evita que datos maliciosos (ej. <script>) se ejecuten.
     */
    function escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return str.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    /**
     * Busca los detalles de los vehículos (activos e históricos) para un origen
     * y actualiza las tablas en el DOM.
     *
     * @param {string} Origen_Enturnar - El código RNDC de la ciudad (ej. '11001000').
     */
    async function DetalleVehiculos(Origen_Enturnar, Destino_Enturnar) {
        const tbodyActivos = document.getElementById('tbody-viajes-activos');
        const tbodyHistorico = document.getElementById('tbody-viajes-historico');

        tbodyActivos.innerHTML = '<tr><td colspan="6">Cargando...</td></tr>';
        tbodyHistorico.innerHTML = '<tr><td colspan="6">Cargando...</td></tr>';

        try {
            // 1️⃣ Preparamos los datos con FormData
            const formData = new FormData();
            formData.append('origen', Origen_Enturnar);
            formData.append('destino', Destino_Enturnar);

            // 2️⃣ Endpoint PHP real
            const url = $('#base_url').val() + 'prefiltro_nacional/Vaijes_Vehiculos'; // tu punto de entrada principal (front controller)

            // 3️⃣ Enviamos la solicitud POST
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // 4️⃣ Validamos errores del servidor
            if (data.error) {
                throw new Error(`Error del servidor: ${data.error}`);
            }

            // 5️⃣ Rellenar tabla "Vehículos en Ruta" (activos)
            tbodyActivos.innerHTML = '';
            if (data.en_curso && data.en_curso.length > 0) {
                data.en_curso.forEach((viaje) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
          <td>${escapeHTML(viaje.Conductor)}</td>
          <td>${escapeHTML(viaje.celular)}</td>
          <td>${escapeHTML(viaje.placa)}</td>
          <td>${escapeHTML(viaje.Configuracion)}</td>
          <td>${escapeHTML(viaje.Carroceria)}</td>
          <td>${escapeHTML(viaje.Trailer)}</td>
          <td>-</td>
        `;
                    tbodyActivos.appendChild(tr);
                });
            } else {
                tbodyActivos.innerHTML = '<tr><td colspan="6">No se encontraron vehículos en ruta.</td></tr>';
            }

            // 6️⃣ Rellenar tabla "Histórico Ruta" (finalizados)
            tbodyHistorico.innerHTML = '';
            if (data.finalizados && data.finalizados.length > 0) {
                data.finalizados.forEach((viaje) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
          <td>${escapeHTML(viaje.Conductor)}</td>
          <td>${escapeHTML(viaje.celular)}</td>
          <td>${escapeHTML(viaje.placa)}</td>
          <td>${escapeHTML(viaje.Configuracion)}</td>
          <td>${escapeHTML(viaje.Carroceria)}</td>
          <td>${escapeHTML(viaje.Trailer)}</td>
          <td>${escapeHTML(viaje.fecha_expedicion)}</td>
        `;
                    tbodyHistorico.appendChild(tr);
                });
            } else {
                tbodyHistorico.innerHTML = '<tr><td colspan="6">No se encontraron viajes en el histórico.</td></tr>';
            }
        } catch (error) {
            console.error('Error al cargar detalles de vehículos:', error);
            const errorHtml = `<tr><td colspan="6" style="color: red;">Error al cargar datos: ${escapeHTML(error.message)}</td></tr>`;
            tbodyActivos.innerHTML = errorHtml;
            tbodyHistorico.innerHTML = errorHtml;
        }
    }

    // --------------------------------------------------------------------------------------------------
    // 🛑 LISTENERS (Disparadores de eventos)
    // --------------------------------------------------------------------------------------------------

    // 1. FUNCIÓN DE CARGA INICIAL (Activada por 'shown.bs.offcanvas')
    async function initializeMapOnShow(e) {
        if (!window.searchData || !window.searchData.latitude) return;

        const { latitude, longitude } = window.searchData;

        // 1. Inicializar el mapa AHORA con el punto de origen (para que esté cargado inmediatamente)
        await initGoogleMapAndShowVehicles([], latitude, longitude);

        // 2. Ejecutar la búsqueda inicial SIN filtros
        await executeSearchAndRenderMap(latitude, longitude, '', '', true);
        window.searchData = { latitude, longitude };
    }

    // 2. LISTENER DEL BOTÓN DE FILTRADO (Reejecuta la búsqueda con los nuevos filtros)
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('#btn-aplicar-filtros-mapa');

        if (btn) {
            e.preventDefault();

            // Usar la posición de origen almacenada (de la búsqueda inicial)
            const latitude = window.searchData?.latitude;
            const longitude = window.searchData?.longitude;

            if (!latitude || !longitude) {
                Swal.fire('Error', 'No se encontraron las coordenadas de origen de la búsqueda inicial.', 'error');
                return;
            }

            // Obtener los valores de los selects
            const tipologia = $('#select-tipologia').val() || '';
            const carroceria = $('#select-carroceria').val() || '';

            // Reejecutar el fetch y el renderizado con los nuevos filtros
            executeSearchAndRenderMap(latitude, longitude, tipologia, carroceria);
        }
    });

    // 3. LISTENER DEL BOTÓN DE BÚSQUEDA INICIAL (Solo almacena posición y abre el offcanvas)
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('#btn-buscar-vehiculo');

        if (btn) {
            e.preventDefault();

            // Almacenar la posición de origen
            const latitude = btn.getAttribute(`data-latitudOrigen`);
            const longitude = btn.getAttribute(`data-longitudOrigen`);
            const NudocSolicitud = btn.getAttribute(`data-NudocSolicitud`);
            const OrigenEnturnar = btn.getAttribute(`data-origenEnturnar`);
            const ClienteEnturnar = btn.getAttribute(`data-ClienteId`);
            const DestinoEnturnar = btn.getAttribute(`data-DestinoId`);
            const ClienteNombre = btn.getAttribute(`data-nombre_cliente`);
            const TipoMercancia = btn.getAttribute(`data-tipo_mercancia`);
            const Ruta = btn.getAttribute(`data-ruta`);
            const Origen = btn.getAttribute(`data-origen`);
            const Destino = btn.getAttribute(`data-destino`);
            const FechaCargue = btn.getAttribute(`data-fechcargue`);
            const HoraCargue = btn.getAttribute(`data-horacargue`);
            const Peso = btn.getAttribute(`data-peso`);

            window.searchData = {
                latitude,
                longitude,
                NudocSolicitud,
                OrigenEnturnar,
                ClienteEnturnar,
                DestinoEnturnar,
                ClienteNombre,
                TipoMercancia,
                Ruta,
                Origen,
                Destino,
                FechaCargue,
                HoraCargue,
                Peso,
            };

            // Mostrar el offcanvas
            const offcanvasElement = document.getElementById('offcanvasBottom');
            const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
            offcanvas.show();
        }
    });

    // 4. LISTENER DEL OFFCANVAS (Carga Inicial del mapa)
    const offcanvasElement = document.getElementById('offcanvasBottom');
    if (offcanvasElement) {
        offcanvasElement.addEventListener('shown.bs.offcanvas', initializeMapOnShow);
    }

    // 🛑 1. REMOVER EL LISTENER DELEGADO QUE MONITOREA EL DOCUMENTO
    /* document.addEventListener('change', function (e) { ... });
     */

    // 🛑 2. IMPLEMENTAR EL LISTENER DIRECTO CON JQUERY Y LA LÓGICA DE FILTRADO
    $('#select-tipologia-local').on('change', function (e) {
        e.preventDefault();

        // 🛑 CLAVE 1: Obtener el array de valores seleccionados del Select2 Múltiple
        // Si no se selecciona nada, .val() devuelve un array vacío [].
        const seleccionadas = $(this).val() || [];

        // 🛑 CLAVE 2: Asumir que la carrocería también está en un Select2 local
        const carroceria = $('#select-carroceria-local').val() || ''; // Puede ser un string o un array si también es multiple

        // Lógica de Filtro Local
        if (window.globalVehicleData && window.globalVehicleData.length > 0) {
            // 🛑 EJECUTAR LA FUNCIÓN DE FILTRADO LOCAL
            // Enviamos el array de tipologías seleccionadas
            filterAndRenderVehicles(
                window.globalVehicleData,
                seleccionadas, // Array de tipologías
                carroceria, // Carrocería (String o Array)
                window.searchDatosEnturnar
            );
        } else {
            Swal.fire('Error', 'No hay datos de vehículos cargados para filtrar.', 'error');
        }
    });

    // --------------------------------------------------------------------------------
    // 🛑 NUEVA FUNCIÓN: Filtra los datos locales y renderiza
    // --------------------------------------------------------------------------------

    /**
     * Filtra los datos locales por Tipología/Carrocería y renderiza la tabla y el mapa.
     * * @param {Array} allVehicles - Todos los vehículos de la búsqueda inicial (globalVehicleData).
     * @param {string} filterTypology - Valor de la tipología seleccionada.
     * @param {string} filterBodyWork - Valor de la carrocería seleccionada.
     * @param {object} searchData - Objeto simple con los datos de la solicitud (latitude, NudocSolicitud, etc.).
     */
    function filterAndRenderVehicles(allVehicles, filterTypologyArray, filterBodyWork, searchData) {
        const tbody = document.getElementById('tbody-vehiculos-encontrados');
        const tbody1 = document.getElementById('tbody-manifiestos-encontrados');
        tbody1.innerHTML = ''; // Limpia contenido previo por si acaso

        const titleElement = document.getElementById('offcanvasBottomLabel');
        const latitude = window.searchData.latitude;
        const longitude = window.searchData.longitude;

        // Mostrar carga mínima mientras se procesa el DOM
        toggleMapLoading(true, 'Aplicando filtros...');

        // 🛑 CORRECCIÓN CLAVE 1: Asegurarse de que el input de filtro es tratado como un array
        const tipologiasSeleccionadas = Array.isArray(filterTypologyArray) ? filterTypologyArray : [filterTypologyArray];

        // Normalizar el filtro de carrocería (asumiendo que es single select, por ahora)
        const filterBodyWorkNormalized = (filterBodyWork || '').toUpperCase().trim();

        // 🛑 2. FILTRAR VEHÍCULOS CON NORMALIZACIÓN
        const vehiclesFiltered = allVehicles.filter((item) => {
            const itemTypology = (item.vehicle.vehicle_typology || '').toUpperCase().trim();
            const itemBodyWork = (item.vehicle.bodywork || '').toUpperCase().trim();

            // 🛑 LÓGICA MÚLTIPLE PARA TIPOLOGÍA:
            // El vehículo coincide si NO hay filtros de tipología O si la tipología del vehículo
            // está incluida en los filtros seleccionados (después de normalizarlos).
            const tipologiasNormalizadas = tipologiasSeleccionadas.map((t) => (t || '').toUpperCase().trim()).filter((t) => t);
            const tieneFiltroTipologia = tipologiasNormalizadas.length > 0;

            const typologyMatch = !tieneFiltroTipologia || tipologiasNormalizadas.includes(itemTypology);

            // Lógica de carrocería (Se mantiene single select con normalización)
            const bodyWorkMatch = !filterBodyWorkNormalized || itemBodyWork === filterBodyWorkNormalized;

            return typologyMatch && bodyWorkMatch;
        });

        const totalVehicles = vehiclesFiltered.length;
        let htmlRows = '';
        const vehiclePositions = [];

        // 2. CONSTRUIR HTML Y POSICIONES
        if (totalVehicles > 0) {
            vehiclesFiltered.forEach((item) => {
                // 🛑 Repetimos la lógica de extracción de datos complejos (JSON parse)
                const placa = item.vehicle.licence_plate;
                const tipologia = item.vehicle.vehicle_typology || 'N/A';
                const nombreConductor = `${item.driver.name || ''} ${item.driver.last_name || ''}`.trim() || 'N/A';
                const celularConductor = item.driver.cellphone || 'N/A';

                // 🛑 NUEVA ASIGNACIÓN: Obtenemos datos de mapeo del objeto global Viajes
                const totalManifiestos = window.Viajes?.[placa] || 0;
                const totalManifiestosDestino = window.ViajesDestino?.[placa] || 0; // Asumo que tienes un mapeo global similar para Destino
                const totalManifiestosCliente = window.ViajesCliente?.[placa] || 0; // Asumo que tienes un mapeo global similar para Cliente
                const NudocConductorFiltro = window.globalNudocConductor?.[placa] || 0;

                let ownerName = 'N/A';
                let ownerPhone = 'N/A';
                try {
                    const ownerData = JSON.parse(item.vehicle.vehicle_owner);
                    ownerName = ownerData.name || 'N/A';
                    ownerPhone = ownerData.phone || 'N/A';
                } catch (e) { }

                htmlRows += `
                <tr class="vehicle-row" data-placa="${placa}" data-latitud="${item.position.latitude}" data-longitud="${item.position.longitude}">
                    <td class="fw-bold text-danger">${placa}</td>
                    <td style="font-size: 11px; text-align: left;">${tipologia}</td>
                    <td>
                        <span class="badge badge-phoenix badge-phoenix-${totalManifiestos > 0 ? 'success' : 'secondary'}">
                            ${totalManifiestos} viajes
                        </span>
                    </td>

                    <td>
                        <span class="badge badge-phoenix badge-phoenix-${totalManifiestosDestino > 0 ? 'success' : 'secondary'}">
                            ${totalManifiestosDestino} viajes
                        </span>
                    </td>

                    <td>
                        <span class="badge badge-phoenix badge-phoenix-${totalManifiestosCliente > 0 ? 'success' : 'secondary'}">
                            ${totalManifiestosCliente} viajes
                        </span>
                    </td>
                    <td>
                        <div class="btn-group btn-group-sm" role="group" aria-label="...">
                            <button class="btn btn-success px-1 py-0 btn-seleccionar-vehiculo me-2" data-placa="${placa}" data-NombreConductor="${nombreConductor}" data-CelularConductor="${celularConductor}"
                            data-NudocSolicitud="${searchData[0]['NudocSolicitud']}" data-OrigenEnturnar="${searchData[0]['OrigenEnturnar']
                    }" data-ConductorId="${NudocConductorFiltro}" data-ClienteEnturnar="${searchData[0]['ClienteEnturnar']}"
                            data-DestinoEnturnar="${searchData[0]['DestinoEnturnar']}" type="button">Enturnar</button>
                            
                            <button class="btn btn-info px-1 py-0 btn-manifestos-vehiculo" data-placa="${placa}" type="button">Manifiestos</button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="6" class="p-0 border-0">
                        <div class="bg-light p-2 text-start" style="font-size: 11px;">
                            <p class="mb-0"><strong>Conductor:</strong> ${nombreConductor} (${celularConductor})</p>
                            <p class="mb-0"><strong>Propietario:</strong> ${ownerName} (${ownerPhone})</p>
                        </div>
                    </td>
                </tr>
            `;

                vehiclePositions.push({
                    plate: placa,
                    latitude: item.position.latitude,
                    longitude: item.position.longitude,
                });
            });

            // 3. PINTAR LA TABLA Y EL MAPA
            tbody.innerHTML = htmlRows;
            initGoogleMapAndShowVehicles(vehiclePositions, latitude, longitude);

            // 🛑 CORRECCIÓN DE MENSAJE: Usa las variables de searchData
            titleElement.textContent = `Resultados: ${totalVehicles} Vehículo(s) Encontrado(s) | Radar en Lat: ${latitude} (Filtro) - Solicitud: #${searchData[0]['NudocSolicitud']} - Cliente: ${searchData[0]['ClienteNombre']} - Ruta: ${searchData[0]['Ruta']}`;
        } else {
            // 4. CERO RESULTADOS
            Swal.fire('Atención', 'Ningún vehículo coincide con los filtros.', 'info');
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-info">Ningún vehículo coincide con el filtro.</td></tr>';

            initGoogleMapAndShowVehicles([], latitude, longitude);
            titleElement.textContent = `Resultados: 0 Vehículo(s) Encontrado(s)`;
        }

        toggleMapLoading(false);
    }
};

async function Filtro() {
    if (window.SELECTFILTRO !== '') {
        $('#loading-overlay-nexosapp ').css('display', 'flex');
        try {
            let filtroActivo = 'Todos';

            if ($(`#campo-${window.VENTANA}-clientes`).is(':visible')) filtroActivo = 'Clientes';
            if ($(`#campo-${window.VENTANA}-estados`).is(':visible')) filtroActivo = 'Estados';

            let data = new FormData();

            data.append('filtro', SELECTFILTRO);
            data.append('fecha_inicial', document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value);
            data.append('fecha_final', document.getElementById(`campo-${window.VENTANA}-fecha_final`).value);
            data.append('estado', 'Todas');
            data.append('cliente', $(`#campo-${window.VENTANA}-clientes`).length > 0 ? $(`#campo-${window.VENTANA}-clientes`).val() || '' : '');
            data.append('filtros', document.getElementById(`campo-${window.VENTANA}-estados`).value);

            // IDs de los selects (Asumimos que $estados es 'empresas' y $clientes es 'clientes')
            const selectorEmpresa = $(`#campo-${window.VENTANA}-empresas`);
            const selectorCliente = $(`#campo-${window.VENTANA}-clientes`);

            if (filtroActivo === 'Estados') {
                // Si el filtro es por ESTADO, enviamos el valor del select de estados
                data.append('estado', selectorEmpresa.length > 0 ? selectorEmpresa.val() || '' : 'Todas');
                data.append('empresa', ''); // No enviar empresa
            } else if (filtroActivo === 'Empresas') {
                // Si el filtro es por EMPRESA
                data.append('empresa', selectorEmpresa.length > 0 ? selectorEmpresa.val() || '' : '');
                data.append('estado', 'Todas');
            } else {
                // Default (o si solo filtra por cliente)
                data.append('estado', 'Todas');
                data.append('empresa', '');
            }

            data.append('cliente', selectorCliente.length > 0 ? selectorCliente.val() || '' : '');

            await fetch($('#base_url').val() + 'prefiltro_nacional/Consultar_Solicitudes', {
                method: 'POST',
                body: data,
            })
                .then((response) => {
                    if (!response.ok) throw new Error(response.statusText);
                    return response.json();
                })
                .then(function (data) {
                    let tbody = document.getElementById('tbl-solicitudes');
                    let template = '';

                    // 🛑 CORRECCIÓN: Limpiar el tbody ANTES del bucle
                    tbody.innerHTML = '';

                    if (data && data.length > 0) {
                        // let totalGeneral = data.length;
                        // -------------------------------
                        // 4. CONTADORES
                        // -------------------------------
                        let totalGeneral = data.length;
                        let totalFiltro = 0;
                        let totalVehiculos = 0;
                        let totalTipoServicio = {};
                        let totalPorEstado = {
                            Realizada: 0,
                            En_subasta: 0,
                            Pendiente: 0,
                            asignada: 0,
                            en_tramite: 0,
                            aprobado_prefiltro: 0,
                        };

                        data.forEach((e) => {
                            if (e.numero_placas > 0) totalVehiculos++;

                            if (!totalTipoServicio[e.tipo_servicio_mer]) {
                                totalTipoServicio[e.tipo_servicio_mer] = 0;
                            }
                            totalTipoServicio[e.tipo_servicio_mer]++;

                            if (totalPorEstado[e.esoli] !== undefined) {
                                totalPorEstado[e.esoli]++;
                            }
                        });

                        // ---- CALCULAR "totalFiltro" según filtro visible ----
                        if (filtroActivo === 'Clientes') {
                            totalFiltro = data.filter((e) => e.Cliente_Id == valCliente).length;
                        } else if (filtroActivo === 'Estados') {
                            totalFiltro = data.filter((e) => e.numero_placas > 0).length;
                        } else {
                            totalFiltro = totalGeneral;
                        }

                        // -------------------------------
                        // 5. Cargar Contadores al HTML
                        // -------------------------------
                        $('#contador-general-solicitudes').text(totalGeneral);
                        // $("#contador-solicitudes-filtro").text(totalFiltro);
                        // $("#contador-vehiculos").text(totalVehiculos);

                        // $("#contador-tipo-servicio").text(
                        //     Object.keys(totalTipoServicio).length
                        // );

                        // $("#contador-estado").text(
                        //     Object.values(totalPorEstado).reduce((a, b) => a + b, 0)
                        // );
                        // ------------------ FIN CONTADORES ------------------

                        data.forEach((element) => {
                            let clase_btn = '';
                            let estado = '';
                            let toltip = '';
                            let estadobtn = '';
                            let itr = '';
                            let Prioridad = '';
                            let perfil = document.getElementById('perfil_id').value;

                            // --- Lógica de Badges (Se mantiene) ---
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
                                itr =
                                    '<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">SI</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>';
                            } else {
                                itr =
                                    '<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">NO</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>';
                            }

                            if (element.prioritaria === 'Propuesta') {
                                if (perfil === '1' || perfil === '8') {
                                    // Prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label"><a href="#" id="btn_aprobar_solicitud" data-id="${element.nundoc_solicitud}" class="text-decoration-none text-warning" title="Aprobar solicitud">${element.prioritaria}</a></span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>`;
                                    Prioridad = `<span class="badge badge-phoenix badge-phoenix-warning float-right"><a href="#" id="btn_aprobar_solicitud" data-id="${element.nundoc_solicitud}" data-nivel="${element.nivel}" data-motivo="${element.motivo}" data-usuario="${element.usuario}" data-FechaPrioridad="${element.FechaPrioridad}" class="text-decoration-none text-warning" title="Aprobar solicitud">${element.prioritaria}</a></span>`;
                                } else {
                                    Prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">${element.prioritaria}</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>`;
                                }
                            } else if (element.prioritaria === 'Aprobada') {
                                // Prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.prioritaria}</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>`;
                                Prioridad = `<span class="badge badge-phoenix badge-phoenix-primary float-right"><a href="#" id="btn_detalle_prioritaria" data-id="${element.nundoc_solicitud}" data-nivel="${element.nivel}" data-motivo="${element.motivo}" data-usuario="${element.usuario}" data-FechaPrioridad="${element.FechaPrioridad}" data-usuario_aprueba="${element.usuario_aprueba}" data-FechaAprueba="${element.FechaAprueba}" class="text-decoration-none text-primary" title="Detalle Prioridad">${element.prioritaria}</a></span>`;
                            } else {
                                Prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">Sin proponer</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
                            }
                            // --- Fin Lógica de Badges ---

                            // Concatenar al string
                            template += `
                                    <tr>
                                        <td class="cell-detail" style="color:black;width:auto; white-space: nowrap;">
                                            <div class="dropdown">
                                                <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none fw-bold" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">N°${element.elid
                                }</a>
                                                <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
                                                    <a class="dropdown-item fw-bold" href="#" id="solicitar_estudio_seguridads" onclick="preestudio(this);" data-id="${element.n_cotizacion
                                }" 
                                                    data-id2="${element.nundoc_solicitud}" data-id3="${element.nombre_cliente}" data-id4="${element.item
                                }" data-id5="${element.tipo_mercancia}"
                                                    data-id6="${element.flete}" data-id7="${element.peso_neto_tn}" data-id8="${element.tipo_servicio_mer
                                }"  data-id9="${element.total_tarifa}"
                                                    data-id10="${element.origen_rndc}" data-id11="${element.itr}" data-id12="${element.empresa
                                }" data-id13='${element.escenario_id}' data-id14='${element.Rndc_Origen}'
                                                    data-id15='${element.Rndc_Destino
                                }' onclick="reiniciar_contador();" ${estadobtn}><span class="uil uil-envelope-send"></span> Solicitar Estudio Seguridad</a>
                                                    <a class="dropdown-item fw-bold" href="#" id="btn-detalle-solicitud-servicio" data-id="${element.n_cotizacion
                                }" data-id2="${element.nundoc_solicitud}" data-id3="${window.VENTANA}">
                                                        <span class="uil uil-file-search-alt"></span> Detalle Solicitud
                                                    </a>
                                                    ${element.prioritaria === 'Propuesta' || element.prioritaria === 'Aprobada'
                                    ? ''
                                    : `<a class="dropdown-item fw-bold" id="btn-solicitar-prioridad" href="#" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}"> <span class="uil uil-bell"></span> Solicitar Prioridad </a>`
                                }
                                                    <div class="dropdown-divider"></div> 
                                                    <a class="dropdown-item fw-bold" href="#" id='btn-buscar-vehiculo' data-origenEnturnar='${element.Origen_Enturnar
                                }' data-Origen='${element.origen_solicitud}'
                                                    data-Destino='${element.destino_solicitud}' data-NudocSolicitud='${element.nundoc_solicitud
                                }' data-FechCargue='${element.fecha_cargue}' data-HoraCargue='${element.hora_cargue}' data-peso=${element.peso_neto_kg}
                                                    data-LatitudOrigen="${element.latitud_origen}" data-LongitudOrigen=${element.longitud_origen
                                } data-ClienteId='${element.Cliente_Id}' data-EmpresaId='${element.empresa_id}'
                                                    data-DestinoId='${element.Rndc_Destino}' data-nombre_cliente="${element.nombre_cliente
                                }" data-tipo_mercancia="${element.tipo_mercancia}" data-Ruta="Origén: ${element.origen_solicitud} - Destino: ${element.destino_solicitud
                                }">
                                                      Buscar Vehiculo
                                                    </a>
                                                    <a class="dropdown-item fw-bold" href="#" id='btn-enturnar' data-origenEnturnar='${element.Origen_Enturnar
                                }' data-Origen='${element.origen_solicitud}'
                                                    data-Destino='${element.destino_solicitud}' data-NudocSolicitud='${element.nundoc_solicitud
                                }' data-FechCargue='${element.fecha_cargue}' data-HoraCargue='${element.hora_cargue}'>Enturnar</a>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="cell-detail text-center" style="width: auto; white-space: nowrap; color:black;">${Prioridad}</td>
                                        <td style="color:black;width:auto; white-space: nowrap;"><span class="text-success" style="font-weight:800;">${element.tipo_servicio_mer
                                }</span></td>
                                        <td style="width: auto; white-space: nowrap; color:black;">
                                            ${element.numero_placas > 0
                                    ? '<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">Placas asignadas</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>'
                                    : '<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">Sin asignar</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>'
                                }
                                        </td>
                                        <td style="color:black;width:auto; white-space: nowrap;"><span>${itr}</span></td>
                                        <td style="width: auto; white-space: nowrap; color:black;"><span> ${element.nombre_cliente} ${element.nit
                                }</span></td>
                                        <td style="width: auto; white-space: nowrap; color:black;"><span>${element.tipo_mercancia}</span></td>
                                        <td style="width: auto; white-space: nowrap; color:black;"><span>${element.nombre}</span></td>
                                        <td style="width: auto; white-space: nowrap; color:black;"><span title="Peso Neto kg">${formatNum(
                                    element.peso_neto_kg
                                )} kg</span></td>
                                        <td style="width: auto; white-space: nowrap; color:black;"><span><b>Origén:</b> ${element.origen_solicitud
                                } - <b>Destino:</b> ${element.destino_solicitud}</span></td>
                                        <td class="cell-detail text-center" style="width: auto; white-space: nowrap; color:black;"><span>${element.fecha
                                } ${element.hora_creacion} </span></td>
                                      
                                    </tr>`;
                        });

                        // ASIGNACIÓN FINAL: Asignar el HTML al tbody DESPUÉS del bucle
                        tbody.innerHTML = template;
                    } else {
                        // Si no hay datos, mostrar mensaje de 'No hay resultados'
                        tbody.innerHTML = '<tr><td colspan="10" class="text-center text-info">No se encontraron solicitudes.</td></tr>';
                    }
                })
                .catch((error) => {
                    console.log(error);
                    tbody.innerHTML = '<tr><td colspan="10" class="text-danger">Error al cargar los datos.</td></tr>';
                });
        } catch (error) {
            alert('Error de trucaht' + error);
        } finally {
            $('#loading-overlay-nexosapp ').css('display', 'none');
        }
    }
}

function ImprimirManifiesto(id_mnf) {
    // ✅ REEMPLAZA TU CÓDIGO ACTUAL CON ESTE:
    const urlCompleta = $('#base_url').val() + 'libs/manifiesto_pdf.php?' + 'id_mnf=' + codificarBase64(id_mnf);

    // Configuración de ventana centrada
    const ancho = 1000;
    const alto = 700;
    const left = (window.screen.width - ancho) / 2;
    const top = (window.screen.height - alto) / 2;

    window.open(
        urlCompleta,
        '_blank',
        `width=${ancho},height=${alto},left=${left},top=${top},scrollbars=yes,resizable=yes,location=no,menubar=no,toolbar=no,status=no`
    );
}

function codificarBase64(texto) {
    return btoa(texto);
}

// Función para decodificar Base64
function decodificarBase64(textoCodificado) {
    return atob(textoCodificado);
}

/**
 * Cuenta la cantidad de vehículos por Tipología y Carrocería.
 * @param {Array} vehicles Array de objetos vehicle/position.
 * @returns {object} Un objeto con el conteo de cada tipología encontrada.
 */
function contarPorConfiguracion(vehicles) {
    const conteo = {};

    vehicles.forEach((item) => {
        // Usamos la Tipología como clave principal de conteo
        const tipologia = (item.vehicle.vehicle_typology || 'SIN TIPOLOGÍA').trim();
        const carroceria = (item.vehicle.bodywork || 'N/A').trim();

        // 🛑 Mapeo de corrección antes de usar la variable:
        const carroceriaLimpia = carroceria.replace('?', 'Ó');

        // Crear una clave única (puedes usar solo tipologia si prefieres)
        const clave = `${tipologia} [${carroceriaLimpia}]`;

        if (conteo[clave]) {
            conteo[clave].cantidad += 1;
        } else {
            conteo[clave] = {
                tipologia: tipologia,
                carroceria: carroceriaLimpia,
                cantidad: 1,
            };
        }
    });

    // Convertir el objeto a array para facilitar la iteración en el renderizado
    return Object.values(conteo);
}

/**
 * Renderiza la tabla de conteo de Tipologías en la columna de filtros.
 */
function renderizarTotalesConfiguracion(conteoConfiguracion) {
    const contenedor = document.getElementById('tbl_totalizados_configuracion');

    if (!contenedor) return;

    if (conteoConfiguracion.length === 0) {
        contenedor.innerHTML = '<div class="alert alert-info">No hay configuraciones detectadas.</div>';
        return;
    }

    let html = `
        <h6 class="fw-bold mb-2 mt-3 text-dark">Total por Configuración</h6>
        <div class="table-responsive" style="max-height: 250px; overflow-y: auto;">
            <table class='table table-striped table-sm mb-0' style="font-size:11px;">
                <thead class="table-dark">
                    <tr>
                        <th>Configuración</th>
                        <th style="width: 50px;">Total</th>
                    </tr>
                </thead>
                <tbody>
    `;

    // Ordenar por cantidad descendente
    conteoConfiguracion.sort((a, b) => b.cantidad - a.cantidad);

    conteoConfiguracion.forEach((item) => {
        html += `
            <tr>
                <td class="text-start">${item.tipologia} (${item.carroceria})</td>
                <td class="fw-bold">${item.cantidad}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;
    contenedor.innerHTML = html;
}

/**
 * Recolecta COMBINACIONES ÚNICAS de Tipología y Carrocería del conjunto de vehículos
 * y llena el select de filtros.
 * @param {Array} vehicles Array de objetos de vehículo de la API (vehiclesFound).
 */
function populateSelectTipologias(vehicles) {
    const selectId = '#select-tipologia-local';
    const select = $(selectId);

    // Usamos un Map donde la clave de unicidad es la combinación TIPOLOGÍA + CARROCERÍA
    // El valor (value) que se envía al filtro seguirá siendo solo la tipología base
    const opcionesUnicas = new Map();

    // 🛑 1. Recorrer los vehículos y construir la CLAVE ÚNICA DE COMBINACIÓN
    vehicles.forEach((item) => {
        // Normalizar y obtener Tipología y Carrocería
        const tipologia = (item.vehicle.vehicle_typology || 'SIN TIPOLOGÍA').trim();
        let carroceria = (item.vehicle.bodywork || 'SIN CARROCERÍA').trim();

        // Mapeo de corrección del carácter (Ó)
        const carroceriaLimpia = carroceria.replace('?', 'FURGÓN');

        // 🛑 CLAVE ÚNICA DE LA COMBINACIÓN para evitar que la misma opción se repita 20 veces
        const claveUnica = `${tipologia} [${carroceriaLimpia}]`; // Ej: "Camioneta de 2 ejes [FURGÓN]"

        // El valor que se envía al controlador (value="") debe ser solo la tipología base
        const optionValue = tipologia;

        // El texto que el usuario verá (Texto visible)
        const optionText = claveUnica; // Usamos la clave única para el texto visible

        // 2. Almacenar la opción: Solo si la combinación COMPLETA es nueva.
        if (tipologia && tipologia !== 'N/A' && !opcionesUnicas.has(claveUnica)) {
            opcionesUnicas.set(claveUnica, { value: optionValue, text: optionText });
        }
    });

    // 3. Limpiar el select y guardar selección anterior
    const selectedValues = select.val() || [];
    select.empty();
    select.append('<option value="">-- Sin Filtro --</option>');

    // 4. 🛑 Llenar con las COMBINACIONES ÚNICAS
    opcionesUnicas.forEach((opcion) => {
        // El value solo contiene la Tipología base para que la lógica de filtrado del Controller funcione
        select.append(`<option value="${opcion.value}">${opcion.text}</option>`);
    });

    // 5. Re-seleccionar los valores anteriores (esencial para Select2 múltiple)
    select.val(selectedValues);

    // 6. Inicializar/Re-inicializar Select2
    if (select.data('select2')) {
        select.trigger('change');
    } else {
        inicializarSelect2(selectId, 'Filtrar por Tipología (Múltiple)');
    }
}
