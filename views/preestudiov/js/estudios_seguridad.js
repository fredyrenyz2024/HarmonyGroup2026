window.VENTANA = null;
window.initScript = function (id) {
    window.VENTANA = id;

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

    let FechaInicial = document.getElementById(`fecha_inicial`).value;
    let FechaFinal = document.getElementById(`fecha_final`).value;
    // let FechaInicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
    // let FechaFinal = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;

    listar_solicitudes_operaciones(FechaInicial, FechaFinal, '', 'todos');

    setInterval(() => {
        listar_solicitudes_operaciones(FechaInicial, FechaFinal, '', 'todos');
    }, 600000);

    const input = document.getElementById('buscar_estudio_seguridad');

    document.addEventListener('click', async e => {

        // Aplicar filtro de fechas en operaciones
        // if (e.target.matches(`#campo-${window.VENTANA}-filtrar`) || e.target.matches(`#campo-${window.VENTANA}-filtrar *`)) {
        if (e.target.matches(`#btn_filtrar_estudios`) || e.target.matches(`#btn_filtrar_estudios *`)) {
            let FechaInicial = document.getElementById(`fecha_inicial`).value;
            let FechaFinal = document.getElementById(`fecha_final`).value;
            // let FechaInicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
            // let FechaFinal = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
            listar_solicitudes_operaciones(FechaInicial, FechaFinal, '', 'todos');
        }

        if (e.target.matches('.btn-ver') || e.target.matches('.btn-ver *')) {
            const boton = e.target.closest('.btn-ver'); // obtiene el botón más cercano

            // IDs básicos que ya usabas
            const SolicitudId = boton.getAttribute('data-solicitudId');
            const PreestudioId = boton.getAttribute('data-preestudioid');
            const Placa = boton.getAttribute('data-Placa');
            const Operacion = boton.getAttribute('data-Operacion');
            const EscenarioId = boton.getAttribute('data-EscenarioId');
            const Estado = boton.getAttribute('data-Estado');
            const EstadoPrefiltro = boton.getAttribute('data-EstadoPrefiltro');
            const EstadoCreacion = boton.getAttribute('data-EstadoCreacion');

            // Los nuevos atributos que quieres pasar
            const ProcesoPrefiltroItr = boton.getAttribute('data-proceso_prefiltro_itr');
            const Nombre = boton.getAttribute('data-Nombre');
            const DocumentoPropietario = boton.getAttribute('data-propietario');
            const DocumentoTenedor = boton.getAttribute('data-tenedor');
            const DocumentoConductor = boton.getAttribute('data-conductor');
            const PlacaTrailerNuevo = boton.getAttribute('data-placa_trailer_nuevo');
            const DocumentoPropietarioTrailer = boton.getAttribute('data-documento_propietario_trailer');
            const Observacion = boton.getAttribute('data-observacion');
            const UsuarioResponsableVehiculo = boton.getAttribute('data-usuario_responsable_vehiculo');
            const ExisteEstudio = boton.getAttribute('data-existe_estudio');
            const ResponsableVehiculo = boton.getAttribute('data-responsable_vehiculo');

            // Primero verificamos si otro usuario está gestionando
            const data = new FormData();
            data.append('id_estudio', SolicitudId); // o PreestudioId si tu estudio principal es ese
            data.append('area', 'Operaciones'); // o PreestudioId si tu estudio principal es ese
            // data.append('id_usuario', idUsuario);
            // data.append('nombre_usuario', nombreUsuario);

            fetch($('#base_url').val() + 'validacionparametros/insertar_usuario_gestion', {
                method: 'POST',
                cache: 'no-cache',
                body: data
            })
                .then(response => response.json())
                .then(res => {
                    // Ahora envías todos al método, por ejemplo como un objeto
                    CargarDatosPrefiltros(SolicitudId,
                        PreestudioId,
                        Placa,
                        Operacion,
                        EscenarioId,
                        Estado,
                        EstadoPrefiltro,
                        EstadoCreacion,
                        ProcesoPrefiltroItr,
                        Nombre,
                        DocumentoPropietario,
                        DocumentoTenedor,
                        DocumentoConductor,
                        PlacaTrailerNuevo,
                        DocumentoPropietarioTrailer,
                        Observacion,
                        UsuarioResponsableVehiculo,
                        ExisteEstudio,
                        ResponsableVehiculo
                    )


                    // DetallesEstudioSeguridad(
                    //     SolicitudId,
                    //     PreestudioId,
                    //     Placa,
                    //     Operacion,
                    //     EscenarioId,
                    //     Estado,
                    //     EstadoPrefiltro,
                    //     EstadoCreacion,
                    //     ProcesoPrefiltroItr,
                    //     Nombre,
                    //     DocumentoPropietario,
                    //     DocumentoTenedor,
                    //     DocumentoConductor,
                    //     PlacaTrailerNuevo,
                    //     DocumentoPropietarioTrailer,
                    //     Observacion,
                    //     UsuarioResponsableVehiculo,
                    //     ExisteEstudio,   // <-- Aquí va
                    //     '',              // EstudioIdc (no lo tienes)
                    //     '',              // VehiculoId (no lo tienes)
                    //     '',              // ConductorId (no lo tienes)
                    //     ExisteEstudio    // <-- Este parece duplicado como EsxisteEstudio
                    // );


                    // Y luego mostramos el mensaje (espera un poco a que se genere el HTML)
                    // setTimeout(() => {
                    //     if (res.status === 'ocupado') {
                    //         $(`#GestionadoPor${SolicitudId}`).html(`${res.usuario} está gestionando este estudio.`);
                    //         $(`#GestionadoPor${SolicitudId}`).css('color', 'red').css('font-weight', 'bold');
                    //     } else {
                    //         $(`#GestionadoPor${SolicitudId}`).html(`Tú estás gestionando este estudio.`);
                    //         $(`#GestionadoPor${SolicitudId}`).css('color', 'green').css('font-weight', 'bold');
                    //     }
                    // }, 300);

                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de red',
                        text: 'No se pudo verificar el estado del estudio.',
                        confirmButtonText: 'Cerrar'
                    });
                    console.error(error);
                });
        }

        // if (e.target.matches('#btn_respuestaope') || e.target.matches('#btn_respuestaope *')) {

        if (e.target.matches('.btn-listado') || e.target.closest('.btn-listado')) {
            const boton = e.target.closest('.btn-listado');

            // IDs básicos
            const SolicitudId = boton.getAttribute('data-solicitudId');
            const PreestudioId = boton.getAttribute('data-solicitudId'); // ¿Seguro que quieres duplicar?
            const Placa = boton.getAttribute('data-Placa');
            const Operacion = boton.getAttribute('data-Operacion');
            const EscenarioId = boton.getAttribute('data-EscenarioId');
            const Estado = boton.getAttribute('data-Estado');
            const EstadoPrefiltro = boton.getAttribute('data-EstadoPrefiltro');
            const EstadoCreacion = boton.getAttribute('data-EstadoCreacion');

            // Nuevos atributos
            const ProcesoPrefiltroItr = boton.getAttribute('data-proceso_prefiltro_itr');
            const Nombre = boton.getAttribute('data-Nombre');
            const DocumentoPropietario = boton.getAttribute('data-propietario');
            const DocumentoTenedor = boton.getAttribute('data-tenedor');
            const DocumentoConductor = boton.getAttribute('data-conductor');
            const PlacaTrailerNuevo = boton.getAttribute('data-placa_trailer_nuevo');
            const DocumentoPropietarioTrailer = boton.getAttribute('data-documento_propietario_trailer');
            const Observacion = boton.getAttribute('data-observacion');
            const UsuarioResponsableVehiculo = boton.getAttribute('data-usuario_responsable_vehiculo');
            const ExisteEstudio = boton.getAttribute('data-existe_estudio');
            const EstudioIdc = boton.getAttribute('data-EstudioIdc');
            const VehiculoId = boton.getAttribute('data-VehiculoId');
            const ConductorId = boton.getAttribute('data-conductorId');
            const EsxisteEstudio = boton.getAttribute('data-EsxisteEstudio');
            const ResponsableVehiculo = boton.getAttribute('data-responsable_vehiculo');

            // Llamada con el orden correcto
            cargarDatosEstudioPromesa(SolicitudId,
                PreestudioId,
                Placa,
                Operacion,
                EscenarioId,
                Estado,
                EstadoPrefiltro,
                EstadoCreacion,
                ProcesoPrefiltroItr,
                Nombre,
                DocumentoPropietario,
                DocumentoTenedor,
                DocumentoConductor,
                PlacaTrailerNuevo,
                DocumentoPropietarioTrailer,
                Observacion,
                UsuarioResponsableVehiculo, ExisteEstudio, EstudioIdc, VehiculoId,
                ConductorId, ResponsableVehiculo);
        }

        const btnRespuestaOperaciones = e.target.closest('[id^="btn_respuestaope"]');
        if (btnRespuestaOperaciones) {
            // Acceder al data-id
            const EstudioId = btnRespuestaOperaciones.getAttribute('data-EstudioId');

            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: `¿Estas seguro de enviar la respuesta al estudio ${EstudioId}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                // Código a ejecutar si el usuario hace clic en "Aceptar"
                var mensaje = '';
                if (!$(`#op_estudio`).val()) {
                    mensaje = `
                <div class="alert alert-outline-warning d-flex align-items-start p-2 mt-2" role="alert">
                    <span class="fas fa-info-circle text-warning fs-5 me-3 mt-1"></span>
                    <p><strong>Mensaje!</strong> Por favor, diligencie el campo <strong>Estudio</strong> para continuar con el proceso de seguridad.</p>

                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
                }

                if (!$(`#op_ntipo`).val()) {
                    mensaje = `
                <div class="alert alert-outline-warning d-flex align-items-start p-2 mt-2" role="alert">
                    <span class="fas fa-info-circle text-warning fs-5 me-3 mt-1"></span>
                    <p><strong>Mensaje!</strong> Por favor, diligencie el campo <strong>N° tipo</strong> para continuar con el proceso de seguridad.</p>

                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
                }

                if (!$(`#op_nestudio`).val()) {
                    mensaje = `
                <div class="alert alert-outline-warning d-flex align-items-start p-2 mt-2" role="alert">
                    <span class="fas fa-info-circle text-warning fs-5 me-3 mt-1"></span>
                    <p><strong>Mensaje!</strong> Por favor, diligencie el campo <strong>N° estudio</strong> para continuar con el proceso de seguridad.</p>

                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
                }

                if (!$(`#op_respuesta`).val()) {
                    mensaje = `
                <div class="alert alert-outline-warning d-flex align-items-start p-2 mt-2" role="alert">
                    <span class="fas fa-info-circle text-warning fs-5 me-3 mt-1"></span>
                    <p><strong>Mensaje!</strong> Por favor, diligencie el campo <strong>Respuesta</strong> para continuar con el proceso de seguridad.</p>

                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
                }

                if (!mensaje) {
                    guardar_respuesta(EstudioId);
                } else {
                    $('#ver_lista_segu').animate({ scrollTop: 0 }, 600);
                }
                document.getElementById('mensaje_respuesta').innerHTML = mensaje;
            } else {
                // Código a ejecutar si el usuario hace clic en "Cancelar"
                console.log('Acción confirmada.');
            }
        }

        const btnCancelarOperaciones = e.target.closest('[id^="btn_cancelar"]');
        if (btnCancelarOperaciones) {
            // Acceder al data-id
            const EstudioId = btnCancelarOperaciones.getAttribute('data-EstudioId');
            document.getElementById(`caja_rtaopera${EstudioId}`).style.display = 'none';
        }

        const btnAnularOperaciones = e.target.closest('[id^="btn_anular_estudio"]');
        if (btnAnularOperaciones) {
            let padre = e.target.parentElement.parentElement;
            const EstudioIdC = btnAnularOperaciones.getAttribute('data-EstudioIdC');
            const Placa = btnAnularOperaciones.getAttribute('data-Placa');
            const SolicitudId = btnAnularOperaciones.getAttribute('data-SolicitudId');
            const NombreOpcion = btnAnularOperaciones.getAttribute('data-NombreOpcion');
            const VehiculoId = btnAnularOperaciones.getAttribute('data-VehiculoId');
            const ConductorId = btnAnularOperaciones.getAttribute('data-ConductorId');
            const NundocSolicitud = btnAnularOperaciones.getAttribute('data-NundocSolicitud');

            myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Anular Estudio de seguridad`);
            myOffcanvas.updateContent(`
        <div class="row" id="cancelar_estudio${SolicitudId}">
            <input type="hidden" id="estudioc${SolicitudId}" value='${EstudioIdC}'>
            <input type="hidden" id="NundocSolicitud${SolicitudId}" value='${NundocSolicitud}'>
            <input type="hidden" id="vehiculo_cancelar${SolicitudId}" value='${VehiculoId}'>
            <input type="hidden" id="coductor_cancelar${SolicitudId}" value='${ConductorId}'>
            <div id="nexos_messages_popup_cancel"></div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                <label class="form-label" for="accion_actividad">Acción</label>
                <input type="text" id="accion_actividad${SolicitudId}" class="form-control form-control-sm" value='${NombreOpcion}' disabled>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                <label class="form-label" for="cancela_placa">Placa</label>
                <input type="text" id="cancela_placa${SolicitudId}" class="form-control form-control-sm" value='${Placa}' disabled>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                <label class="form-label" for="cancela_prestudio">Preestudio</label>
                <input type="text" id="cancela_prestudio${SolicitudId}" class="form-control form-control-sm" value='${SolicitudId}' disabled>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <label class="form-label" for="cancela_motivo">Motivo</label>
                <select id="cancela_motivo${SolicitudId}" class="form-select form-select-sm">
                    <option value="">Seleccionar</option>
                    <option value="Conductor cancelo el viaje">Conductor Cancelo el Viaje</option>
                    <option value="Vehiculos para otro servicio">Vehiculos para otro servicio</option>
                    <option value="Placa asiganada por error">Placa asignada por error</option>
                    <option value="Vehiculos varado">Vehículo Varado</option>
                </select>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <label class="form-label" for="cancela_nota">Nota</label>
                <textarea id="cancela_nota${SolicitudId}" class="form-control form-control-sm" rows="1" oninput="this.value = this.value.toUpperCase();"></textarea>
            </div>
        </div>

        <div class="offcanvas-footer text-center pt-2">
            <div class="d-flex justify-content-end align-content-between gap-3">
                <button type="button" id="btn_cerrar" data-bs-dismiss="offcanvas" aria-label="Close" class="btn btn-danger btn-sm py-1"><i class="fas fa-times"></i> Cancelar</button>
                <button type="button" id="Boton_cancelacion" class="btn btn-success btn-sm py-1" data-escenarioid="1" data-SolicitudId='${SolicitudId}'><i class="far fa-save"></i> Guardar Cancelación</button>
            </div>
        </div>
        `);

            myOffcanvas.show();
        }

        if (e.target.matches('#Boton_cancelacion') || e.target.matches('#Boton_cancelacion *')) {
            let BotonCancelar = document.getElementById('Boton_cancelacion');
            let SolicitudId = BotonCancelar.getAttribute('data-SolicitudId');

            const result = await Swal.fire({
                title: '¿Seguro?',
                text: '¿Esta seguro de cancelar o anular esta solicitud de estudio?',
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

                let accion = $(`#accion_actividad${SolicitudId}`).val();
                var mensaje = '';
                if (accion === 'Estudio de Seguridad') {

                    if (!$(`#cancela_motivo${SolicitudId}`).val()) {
                        mensaje += `
                    <div class="alert alert-outline-danger d-flex align-items-center p-1" role="alert">
                        <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                        <p class="mb-0 flex-1  text-dark"><strong>Mensaje!</strong> Debe seleccionar el campo <strong>Motivo</strong> para poder generar la cancelación.</p>

                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
                    } else {
                        mensaje += ``;
                    }

                    if (!$(`#cancela_nota${SolicitudId}`).val()) {
                        mensaje += `
                    <div class="alert alert-outline-warning d-flex align-items-center p-1" role="alert">
                        <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                        <p class="mb-0 flex-1  text-dark"><strong>Mensaje!</strong> Debe diligenciar el campo <strong>Nota</strong> para poder generar la cancelación.</p>

                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
                    } else {
                        mensaje += ``;

                    }

                    if (!mensaje) {
                        registrar_cancelacion(SolicitudId);
                    } else {
                        $('#nexos_messages_popup_cancel').html(`${mensaje}`);
                        $(`#cancelar_estudio${SolicitudId}`).animate({ scrollTop: 0 }, 600);
                    }
                } else {
                    if (!$(`#cancela_motivo${SolicitudId}`).val()) {
                        mensaje += `
                    <div class="alert alert-outline-danger d-flex align-items-center p-1" role="alert">
                        <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                        <p class="mb-0 flex-1  text-dark"><strong>Mensaje!</strong> Debe diligenciar el campo <strong>Motivo</strong> para poder generar la cancelación.</p>

                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
                    } else {
                        mensaje += ``;

                    }

                    if (!$(`#cancela_nota${SolicitudId}`).val()) {
                        mensaje += `
                    <div class="alert alert-outline-warning d-flex align-items-center p-1" role="alert">
                        <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                        <p class="mb-0 flex-1  text-dark"><strong>Mensaje!</strong> Debe diligenciar el campo <strong>Nota</strong> para poder generar la cancelación.</p>

                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
                    } else {
                        mensaje += ``;

                    }

                    if (!mensaje) {
                        registrar_cancelacion(SolicitudId);
                    } else {
                        $('#nexos_messages_popup_cancel').html(`${mensaje}`);
                        $(`#cancelar_estudio${SolicitudId}`).animate({ scrollTop: 0 }, 600);
                    }
                }
            }
        }

        const BtnRetornarEstudioSeguridad = e.target.closest('[id^="guarde_rehabil"]');
        if (BtnRetornarEstudioSeguridad) {
            const result = await Swal.fire({
                title: '¿Seguro?',
                text: '¿Estás seguro de reiniciar el estudio de seguridad?',
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

            if (!result.isConfirmed) return;

            const SolicitudId = BtnRetornarEstudioSeguridad.getAttribute('data-SolicitudId');
            const VehiculoId = BtnRetornarEstudioSeguridad.getAttribute('data-VehiculoId');
            const ConductorId = BtnRetornarEstudioSeguridad.getAttribute('data-ConductorId');
            const EstudioIdC = BtnRetornarEstudioSeguridad.getAttribute('data-EstudioIdC');
            const Placa = BtnRetornarEstudioSeguridad.getAttribute('data-Placa');

            let data = new FormData();
            data.append('num_estudio', SolicitudId);
            data.append('id_conductor', ConductorId);
            data.append('id_vehiculo', VehiculoId);
            data.append('id_estudio_c', EstudioIdC);
            data.append('observacion', '');

            $.ajax({
                url: $('#base_url').val() + 'validacionparametros/reactivar_estudio',
                type: 'POST',
                data: data,
                cache: false,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function (data) {
                    if (data.numero === 400) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al reactivar estudio',
                            html: data.mensaje,
                            confirmButtonText: 'Cerrar'
                        });
                    } else if (data.numero === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Estudio reactivado exitosamente',
                            html: data.mensaje,
                            confirmButtonText: 'Aceptar'
                        }).then(() => {
                            // listar_solicitudes_operaciones();
                            let FechaInicial = document.getElementById(`fecha_inicial`).value;
                            let FechaFinal = document.getElementById(`fecha_final`).value;
                            // let FechaInicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
                            // let FechaFinal = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
                            listar_solicitudes_operaciones(FechaInicial, FechaFinal, '');
                        });
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de red',
                        text: 'Ocurrió un error al intentar reactivar el estudio. Intenta nuevamente.',
                        confirmButtonText: 'Cerrar'
                    });
                    console.error(jqXHR, textStatus, errorThrown);
                }
            });
        }

        const BtnValidarTokenSeguridad = e.target.closest('[id^="validar_token"]');
        if (BtnValidarTokenSeguridad) {
            // Obtener los datos desde los atributos del botón
            const placas = BtnValidarTokenSeguridad.getAttribute('data-placa');
            const numsoli = BtnValidarTokenSeguridad.getAttribute('data-prefiltroid');
            const propietario = BtnValidarTokenSeguridad.getAttribute('data-propietario');
            const conductor = BtnValidarTokenSeguridad.getAttribute('data-conductor');
            const poseedor = BtnValidarTokenSeguridad.getAttribute('data-tenedor');
            const trailer = BtnValidarTokenSeguridad.getAttribute('data-placa_trailer_nuevo');
            const propietario_trailer = BtnValidarTokenSeguridad.getAttribute('data-documento_propietario_trailer');
            const tokens = document.getElementById(`tokenval`).value;

            // Validar que haya token
            if (!tokens || tokens.trim() === '') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Token requerido',
                    html: `Debe ingresar el código de seguridad para completar el proceso de hoja de vida para la placa <strong>${placas}</strong>.`,
                    confirmButtonText: 'Entendido'
                }).then(() => {
                    document.getElementById('tokenval').focus();
                });
                return;
            }

            // Preparar datos para el servidor
            const data = new FormData();
            data.append('placa', placas);
            data.append('token', tokens);
            data.append('numsoli', numsoli);
            data.append('propietario', propietario);
            data.append('conductor', conductor);
            data.append('tenedor', poseedor);

            fetch($('#base_url').val() + 'validacionparametros/validar_token', {
                method: 'POST',
                cache: 'no-cache',
                body: data,
            })
                .then(response => response.json())
                .then(function (resp) {
                    // Evaluar la respuesta del servidor
                    if (resp.numero === 400) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Token inválido',
                            html: resp.mensaje,
                            confirmButtonText: 'Reintentar'
                        }).then(() => {
                            document.getElementById('tokenval').focus();
                        });
                    } else if (resp.numero === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Validación exitosa',
                            html: resp.mensaje,
                            confirmButtonText: 'Continuar'
                        }).then(() => {
                            // Ocultar el bloque de validación y mostrar sección final
                            const datosVal = BtnValidarTokenSeguridad.closest(`#datos_val`);
                            if (datosVal) datosVal.style.display = 'none';
                            const solEstu = document.getElementById(`sol_estu`);
                            if (solEstu) solEstu.style.display = '';
                            Hojas_de_vida(numsoli, placas, conductor, propietario, poseedor, propietario_trailer, trailer)
                        });
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Vehículo no encontrado',
                            html: `El vehículo con placa <strong>${placas}</strong> no se encuentra creado en el sistema. Solicite un prefiltro para su creación.`,
                            confirmButtonText: 'Entendido'
                        });
                    }
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error en el servidor',
                        text: 'Ocurrió un error inesperado. Intente nuevamente.',
                        confirmButtonText: 'Cerrar'
                    });
                    console.error(error);
                });
        }

        const BtnValidarHojasVida = e.target.closest('[id^="validar_hojasv"]');
        if (BtnValidarHojasVida) {
            // Obtener valores desde los data-* del botón
            const prefiltro_id = BtnValidarHojasVida.getAttribute('data-prefiltroid');
            const propietario_id = BtnValidarHojasVida.getAttribute('data-propietario');
            const tenedor_id = BtnValidarHojasVida.getAttribute('data-tenedor');
            const conductor_id = BtnValidarHojasVida.getAttribute('data-conductor');
            const placa_id = BtnValidarHojasVida.getAttribute('data-placa');
            const propietario_trailer_id = BtnValidarHojasVida.getAttribute('data-documento_propietario_trailer');
            const trailer_id = BtnValidarHojasVida.getAttribute('data-placa_trailer_nuevo');

            // Mostrar overlay de carga
            $('#loading-overlay-nexosapp').css('display', 'flex');

            const datos = new FormData();
            datos.append('propietario', propietario_id);
            datos.append('tenedor', tenedor_id);
            datos.append('conductor', conductor_id);
            datos.append('placa', placa_id);
            datos.append('propietario_trailer', propietario_trailer_id);
            datos.append('trailer', trailer_id);

            try {
                const response = await fetch($('#base_url').val() + 'validacionparametros/validar_hojas_vida', {
                    method: 'POST',
                    body: datos,
                    cache: 'no-cache',
                });
                const data = await response.json();

                if (data.numero === 400) {
                    // Mostrar mensaje de error
                    Swal.fire({
                        icon: 'error',
                        title: 'Validación fallida',
                        html: data.mensaje,
                        confirmButtonText: 'Cerrar'
                    }).then(() => {
                        // Ajustar la visibilidad de botones/elementos si es necesario
                        document.getElementById(`solicitar_hv`).style.display = 'none';
                        document.getElementById(`validar_hv`).style.display = '';
                    });
                } else if (data.numero === 200) {
                    // Mostrar mensaje de éxito
                    Swal.fire({
                        icon: 'success',
                        title: 'Validación exitosa',
                        html: data.mensaje,
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        document.getElementById(`solicitar_hv`).style.display = '';
                        document.getElementById(`validar_hv`).style.display = 'none';
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Respuesta inesperada',
                        text: 'El servidor devolvió un resultado desconocido.',
                        confirmButtonText: 'Entendido'
                    });
                }
            } catch (error) {
                console.error('Error en la validación de hojas de vida:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de red',
                    text: 'No se pudo completar la validación. Intente nuevamente.',
                    confirmButtonText: 'Cerrar'
                });
            } finally {
                // Ocultar overlay independientemente del resultado
                $('#loading-overlay-nexosapp').css('display', 'none');
            }

            try {
                // Llamada adicional para mostrar las hojas de vida
                await Hojas_de_vida(prefiltro_id, placa_id, conductor_id, propietario_id, tenedor_id, propietario_trailer_id, trailer_id);
            } catch (error) {
                console.error('Error al cargar hojas de vida:', error);
            }
        }

        const BtnSolicitarEstudioSeguridad = e.target.closest('[id^="validar_solicitud"]');
        if (BtnSolicitarEstudioSeguridad) {
            // Tomamos los datos desde los atributos del botón
            const placa = BtnSolicitarEstudioSeguridad.getAttribute('data-placa');
            const idprees = BtnSolicitarEstudioSeguridad.getAttribute('data-prefiltroid');
            const proceso = BtnSolicitarEstudioSeguridad.getAttribute('data-proceso_estu');
            const proceso_prefiltro_itr = BtnSolicitarEstudioSeguridad.getAttribute('data-proceso_estu_itr');
            const observacion_prefiltro = BtnSolicitarEstudioSeguridad.getAttribute('data-observacion_prefiltro') || '';
            const responsable_vehiculo = BtnSolicitarEstudioSeguridad.getAttribute('data-responsable_vehiculo') || '';
            const EscenarioId = BtnSolicitarEstudioSeguridad.getAttribute('data-EscenarioId') || '';

            // Confirmación antes de enviar
            Swal.fire({
                title: '¿Solicitar estudio de seguridad?',
                text: `¿Deseas solicitar un estudio de seguridad para la placa ${placa}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3B71CA',
                cancelButtonColor: '#9FA6B2',
                confirmButtonText: 'Sí, solicitar',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        let formdata = new FormData();
                        formdata.append('placa', placa);
                        formdata.append('idprees', idprees);
                        formdata.append('proceso', proceso);
                        formdata.append('proceso_prefiltro_itr', proceso_prefiltro_itr);
                        formdata.append('observacion_prefiltro', observacion_prefiltro);
                        formdata.append('responsable_vehiculo', responsable_vehiculo);
                        formdata.append('EscenarioId', EscenarioId);

                        const response = await fetch($('#base_url').val() + 'validacionparametros/Crear_estudio_seguridad', {
                            method: 'POST',
                            cache: 'no-cache',
                            body: formdata
                        });

                        const resp = await response.json();

                        if (resp.numero === 400) {
                            Swal.fire({
                                icon: 'error',
                                title: 'No se pudo solicitar el estudio',
                                html: resp.mensaje,
                                confirmButtonText: 'Cerrar'
                            });
                        } else if (resp.numero === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Estudio solicitado exitosamente',
                                html: resp.mensaje,
                                confirmButtonText: 'Aceptar'
                            }).then(() => {
                                $('#estudio_seguridad').modal('hide');
                                listar_solicitudes_operaciones();
                            });
                        } else {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Respuesta inesperada',
                                text: 'El servidor no devolvió un estado válido.',
                                confirmButtonText: 'Cerrar'
                            });
                        }
                    } catch (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error en la solicitud',
                            text: `No se pudo procesar la solicitud: ${error}`,
                            confirmButtonText: 'Cerrar'
                        });
                        console.error('Error en la solicitud de estudio:', error);
                    }
                }
            });
        }

        const btnValidarPrefiltro = e.target.closest('[id^="btn_validar_datos_prefiltro"]');
        if (btnValidarPrefiltro) {
            Swal.fire({
                title: '¿Está seguro?',
                text: '¿Desea validar el nuevo recurso?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, validar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar overlay de carga

                    try {
                        // Obtener los datos del botón
                        const token = btnValidarPrefiltro.getAttribute('data-token');
                        const estado = btnValidarPrefiltro.getAttribute('data-estado');
                        const estudio = btnValidarPrefiltro.getAttribute('data-estudio');
                        const propietario = btnValidarPrefiltro.getAttribute('data-propietario');
                        const poseedor = btnValidarPrefiltro.getAttribute('data-poseedor');
                        const conductor = btnValidarPrefiltro.getAttribute('data-conductor');
                        const Propietario_Trailer = btnValidarPrefiltro.getAttribute('data-propietarioTrailer');

                        // Crear formulario para enviar datos
                        let datos = new FormData();
                        datos.append('propietario', propietario);
                        datos.append('poseedor', poseedor);
                        datos.append('conductor', conductor);
                        datos.append('Propietario_Trailer', Propietario_Trailer);
                        datos.append('estudio', estudio);
                        datos.append('token', token);
                        datos.append('estado', estado);

                        const response = await fetch($('#base_url').val() + 'validacionparametros/validar_hojas_prefiltro_recurso_nuevo', {
                            method: 'POST',
                            body: datos,
                            cache: 'no-cache',
                        });
                        const data = await response.json();

                        if (data === true) {
                            document.getElementById(`validado_token_prefiltro_nuevo${estudio}`).innerHTML =
                                `<i class="fa-solid fa-user-check" style="color:#FFF;"></i>`;
                            document.getElementById(`validado_token_prefiltro_nuevo${estudio}`).style.backgroundColor = '#81C784';

                            Swal.fire({
                                icon: 'success',
                                title: 'Validación exitosa',
                                text: `La operación del estudio ${estudio} fue validada correctamente.`,
                                confirmButtonColor: '#3085d6'
                            });

                            // Notificación push
                            Push.Permission.request();
                            Push.create('Plataforma NexosApp', {
                                body: `El o los recursos creados para el estudio ${estudio} deben actualizar la hoja de vida.`,
                                icon: $('#id_url_ajax').val() + 'public/img/logo.png',
                                timeout: 8000,
                                vibrate: [100, 100, 100],
                                onClick: function () {
                                    window.location = $('#id_url_ajax').val() + 'preestudiov/nacional_preestudio/?idmenu=1';
                                },
                            });
                            let FechaInicial = document.getElementById(`fecha_inicial`).value;
                            let FechaFinal = document.getElementById(`fecha_final`).value;
                            // let FechaInicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
                            // let FechaFinal = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
                            listar_solicitudes_operaciones(FechaInicial, FechaFinal, '');
                        } else {
                            document.getElementById(`validado_token_prefiltro_nuevo${estudio}`).innerHTML =
                                `<i class="fa-solid fa-user-xmark" style="color:#FFF;"></i>`;
                            document.getElementById(`validado_token_prefiltro_nuevo${estudio}`).style.backgroundColor = '#E57373';

                            Swal.fire({
                                icon: 'error',
                                title: 'Error en la validación',
                                text: 'El token no pertenece a este prefiltro o el recurso no está creado en el sistema.',
                                confirmButtonColor: '#d33'
                            });
                        }
                    } catch (error) {
                        console.error('Error en la solicitud:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error inesperado',
                            text: 'Ocurrió un error en la operación. Intente nuevamente.',
                            confirmButtonColor: '#d33'
                        });
                    } finally {
                        $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar overlay
                    }
                }
            });
        }
    });

    input.addEventListener('keyup', function () {
        const filtro = this.value.toLowerCase().trim();
        let FechaInicial = document.getElementById(`fecha_inicial`).value;
        let FechaFinal = document.getElementById(`fecha_final`).value;
        // let FechaInicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
        // let FechaFinal = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
        listar_solicitudes_operaciones(FechaInicial, FechaFinal, filtro, 'todos');
    });

    document.querySelector('[data-chat-thread-list="all"]')
        .addEventListener('click', () => renderPorTab('operaciones'));

    document.querySelector('[data-chat-thread-list="read"]')
        .addEventListener('click', () => renderPorTab('seguridad'));

    document.querySelector('[data-chat-thread-list="unread"]')
        .addEventListener('click', () => renderPorTab('resultados'));

}

async function listar_solicitudes_operaciones(FechaInicial, FechaFinal, Buscar = '', Valor = '') {
    try {
        let formdatos = new FormData();
        formdatos.append('estado', 't');
        formdatos.append('fecha_inicial', FechaInicial);
        formdatos.append('fecha_final', FechaFinal);
        formdatos.append('estudio_seguridad', 'estudio_seguridad');
        formdatos.append('buscar', Buscar);  // 🔹 se envía al backend
        formdatos.append('valor', Valor);

        const ul = document.getElementById('List_prefiltro_seguridad');
        ul.innerHTML = ''; // Limpiar lista

        await fetch($('#base_url').val() + 'validacionparametros/Consultar_solicitudes_operaciones', {
            method: 'POST',
            cache: 'no-cache',
            body: formdatos,
        })
            .then(response => {
                if (!response.ok) throw new Error(response.statusText);
                return response.json();
            })
            .then(function (data) {
                // window.dataSolicitudes = data.datos || [];
                window.dataSolicitudes = data.datos; // 👈 guardas TODO
                // renderPorTab('operaciones');         // 👈 pintas solo una vista

                if (data.datos.length > 0) {
                    const registros = data.datos;
                    // Ordenar por fecha y hora (ascendente)
                    registros.forEach(r => {
                        if (!r.fecha) r.fecha = '2000-01-01';
                        if (!r.hora) r.hora = '00:00:00';
                    });

                    registros.sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));

                    document.getElementById('total_general').innerHTML = data.total_general;
                    // document.getElementById('total_prefiltros').innerHTML = data.total_prefiltros;
                    // document.getElementById('total_estudios').innerHTML = data.total_estudios;

                    registros.forEach((element, index) => {
                        // operacion = element.operacion;

                        const operacion = element.operacion || 'Nuevo';

                        let status_es = '', col_status = '', title = '';
                        // let status_pre = '', col_status_pre = '', title_pre = '';

                        // ===========================
                        // PREFILTROS
                        // ===========================
                        if (element.tipo === 'prefiltro') {
                            // Estado visual
                            if (operacion === 'Nuevo') {
                                if (element.estado === 'aprobado') {
                                    col_status = '#14A44D';
                                    title = 'Prefiltro aprobado Autoriza HV';
                                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Prefiltro Aprobado</span>";
                                } else if (element.estado === 'pendiente') {
                                    col_status = '#E4A11B';
                                    title = 'Prefiltro Pendiente';
                                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Prefiltro Pendiente</span>";
                                } else if (element.estado === 'vencida') {
                                    col_status = '#5D4037';
                                    title = 'Prefiltro Vencido';
                                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Prefiltro Vencido</span>";
                                } else if (element.estado === 'pendiente_iniciar') {
                                    col_status = '#332D2D';
                                    title = 'Prefiltro Pendiente por iniciar';
                                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Prefiltro Pendiente Iniciar</span>";
                                } else if (element.estado === 'iniciado') {
                                    col_status = '#0D47A1';
                                    title = 'Prefiltro iniciado';
                                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Prefiltro Iniciado</span>";
                                } else if (element.estado === 'rechazado') {
                                    col_status = '#DC4C64';
                                    title = 'Prefiltro rechazado';
                                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Prefiltro Rechazado</span>";
                                } else if (element.estado === 'cancelado') {
                                    col_status = '#D50000';
                                    title = 'Prefiltro cancelado';
                                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Prefiltro Cancelado</span>";
                                } else if (element.estado === 'Rechazado_modificar') {
                                    col_status = '#F44336';
                                    title = 'Prefiltro rechazado para modificar';
                                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-info'>Prefiltro Rechazado para modificar</span>";
                                }
                                status_e = element.campo || '';
                                status_es = estado;
                            }

                            // Validar si es ITR
                            itr = (element.itr === 'SI')
                                ? '<span class="label label-success">Si</span>'
                                : '<span class="label label-danger">No</span>';

                            // ===========================
                            // RENDER HTML DEL ELEMENTO
                            // ===========================

                            // Contenedor avatar
                            const avatarDiv = document.createElement('div');
                            avatarDiv.className = 'avatar avatar-xl rounded-circle position-relative d-flex justify-content-center align-items-center me-3 me-sm-0 me-xl-2';
                            avatarDiv.style.width = '50px';
                            avatarDiv.style.height = '50px';
                            avatarDiv.style.border = '0.9px solid #c0c0c0';
                            avatarDiv.style.fontSize = '10px';
                            avatarDiv.style.color = '#1976D2';
                            avatarDiv.style.fontWeight = 'bold';
                            avatarDiv.style.backgroundColor = '#f8f9fa';

                            // Texto (placa)
                            const placaSpan = document.createElement('span');
                            placaSpan.className = 'z-1';
                            placaSpan.innerText = element.placa || '';

                            // Contador de interacciones
                            const totalInteracciones = element.interacciones?.[0]?.Total_Interacciones ?? 0;
                            const contadorSpan = document.createElement('span');
                            contadorSpan.className = 'bg-primary rounded-circle top-0 end-0 position-absolute text-white d-flex justify-content-center align-items-center fs-10 fw-semibold lh-1';
                            contadorSpan.style.height = '1rem';
                            contadorSpan.style.width = '1rem';
                            contadorSpan.innerText = totalInteracciones;

                            avatarDiv.appendChild(contadorSpan);
                            avatarDiv.appendChild(placaSpan);

                            // LI contenedor
                            const li = document.createElement('li');
                            li.className = 'nav-item read estudio-animado';
                            li.role = 'presentation';
                            li.addEventListener('animationend', () => {
                                li.classList.remove('estudio-animado');
                            });

                            // Link
                            const link = document.createElement('a');
                            link.className = 'nav-link d-flex align-items-center justify-content-center p-2';
                            link.setAttribute('data-bs-toggle', 'tab');
                            link.setAttribute('data-chat-thread', 'data-chat-thread');
                            link.setAttribute('href', `#tab-thread-${element.esoli}`);
                            link.setAttribute('role', 'tab');
                            link.setAttribute('aria-selected', 'false');
                            link.setAttribute('title', title);
                            link.setAttribute('data-PreestudioId', element.esoli);
                            // link.setAttribute('data-solicitudId', element.esoli);
                            link.setAttribute('data-Placa', element.placa);
                            link.setAttribute('data-Operacion', element.operacion);
                            // link.setAttribute('data-Nombre', element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2 ?? '');
                            link.setAttribute('data-EscenarioId', element.escenario_id);
                            // link.setAttribute('data-EsxisteEstudio', element.existe_estudio ?? '');
                            link.setAttribute('data-proceso_prefiltro_itr', element.itr ?? '');
                            link.setAttribute('data-Estado', element.estado);
                            // link.setAttribute('data-VehiculoId', element.vehiculo_id ? element.vehiculo_id : '');
                            // link.setAttribute('data-conductorId', element.conductor_id);
                            link.setAttribute('data-proceso_prefiltro_itr', element.itr);
                            link.setAttribute('data-Nombre', element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2);
                            link.setAttribute('data-propietario', element.documento_propietario);
                            link.setAttribute('data-tenedor', element.documento_tenedor);
                            link.setAttribute('data-conductor', element.documento_conductor);
                            link.setAttribute('data-placa_trailer_nuevo', element.placa_trailer);
                            link.setAttribute('data-documento_propietario_trailer', element.documento_propietario_trailer);
                            link.setAttribute('data-observacion', element.observacion);
                            link.setAttribute('data-existe_estudio', element.existe_estudio);
                            link.setAttribute('data-usuario_responsable_vehiculo', element.usuario_responsable_vehiculo);
                            link.setAttribute('data-responsable_vehiculo', element.responsable_vehiculo);
                            link.classList.add('btn-ver');

                            // Contenido
                            const contentDiv = document.createElement('div');
                            contentDiv.className = 'flex-1 d-sm-none d-xl-block';

                            const topRow = document.createElement('div');
                            topRow.className = 'd-flex justify-content-between align-items-center';
                            topRow.innerHTML = `
                                <div class="d-flex justify-content-between align-items-center w-100 position-relative grupo-hover">
                                <h5 class="fs-9 text-body-tertiary fw-normal name text-nowrap mb-0">
                                    ${status_es} | Numero: ${element.esoli}
                                </h5>
                                </div>
                            `;

                            let colorOperacion = '#6c757d'; // gris
                            switch (operacion) {
                                case 'Actualizar': colorOperacion = '#E4A11B'; break;
                                case 'Habilitar': colorOperacion = '#14A44D'; break;
                                case 'Nuevo': colorOperacion = '#0D47A1'; break;
                            }

                            const bottomRow = document.createElement('div');
                            bottomRow.className = 'd-flex justify-content-between';
                            bottomRow.innerHTML = `
                                <p class="fs-10 mb-0 line-clamp-1 text-body-tertiary text-opacity-85 message">
                                Operación: <b style="color:${colorOperacion}">${operacion}</b> | ${element.fecha ? element.fecha : element.fecha_prefiltro} ${element.hora ? element.hora : element.hora_prefiltro} | ${element.prioritaria === null ? `` : `<span class="badge badge-phoenix badge-phoenix-danger">Prioritaria <span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`}
                                </p>
                            `;

                            const hr = document.createElement('div');
                            hr.className = 'border-top border-translucent border-dashed';

                            const gestionado = document.createElement('div');
                            gestionado.className = 'd-flex justify-content-between';
                            gestionado.innerHTML = `
                                <p class="fs-10 mb-0 line-clamp-1 text-body-tertiary text-opacity-85 message" id='GestionadoPor${element.esoli}'></p>
                            `;

                            contentDiv.appendChild(topRow);
                            contentDiv.appendChild(bottomRow);
                            contentDiv.appendChild(hr);
                            contentDiv.appendChild(gestionado);

                            link.appendChild(avatarDiv);
                            link.appendChild(contentDiv);
                            li.appendChild(link);
                            ul.appendChild(li);
                        }

                        // ===========================
                        // ESTUDIOS (por ahora solo log)
                        // ===========================
                        else if (element.tipo === 'estudio') {
                            // console.log('Estudio:', element);

                            if (operacion === 'Nuevo' || operacion === 'Habilitar' || operacion === 'Actualizar') {
                                /* Validar si esta activo de la creacion de recurso nuevo para cambiar la etiqueda */
                                if (operacion === 'Actualizar') {
                                    if (element.estado_prefiltro === 'Pendiente' || element.estado_prefiltro === 'Iniciado' || element.estado_prefiltro === 'Rechazado' || element.estado_prefiltro === 'Aprobado') {
                                        if (element.estado_creacion === 'TERCERO CREADO') {
                                            col_status = '#0D47A1';
                                            title = 'Recurso Creado';
                                            estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Nuevo recurso creado</span>";
                                        } else {
                                            if (element.estado_prefiltro === 'Aprobado') {
                                                col_status = '#14A44D';
                                                title = 'Nuevo recurso Aprobado';
                                                estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-info'>Nuevo recurso Aprobado</span>";
                                            } else if (element.estado_prefiltro === 'Pendiente') {
                                                col_status = '#E4A11B';
                                                title = 'Nuevo recurso Pendiente';
                                                estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Nuevo recurso Pendiente</span>";
                                            } else if (element.estado_prefiltro === 'Iniciado') {
                                                col_status = '#0D47A1';
                                                title = 'Nuevo recurso Iniciado';
                                                estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-primary'>Nuevo recurso Iniciado</span>";
                                            } else if (element.estado_prefiltro === 'Rechazado') {
                                                col_status = '#F44336';
                                                title = 'Nuevo recurso Rechazado';
                                                estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Nuevo recurso Rechazado</span>";
                                            }
                                        }
                                        status_es = estado;
                                    } else {
                                        if (element.estado == 'Aprobado') {
                                            col_status = '#14A44D';
                                            title = 'Estudio de seguridad aprobado';
                                            estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Estudio Aprobado</span>";
                                        } else if (element.estado == 'Pendiente') {
                                            col_status = '#E4A11B';
                                            title = 'Estudio de seguridad Pendiente';
                                            estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Pendiente</span>";
                                        } else if (element.estado == 'vencida') {
                                            col_status = '#F44336';
                                            title = 'Estudio de seguridad Vencido';
                                            estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Vencido</span>";
                                        } else if (element.estado == 'pendiente_iniciar') {
                                            col_status = '#E4A11B';
                                            title = 'Estudio de seguridad Pendiente por iniciar';
                                            estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Pendiente Iniciar</span>";
                                        } else if (element.estado == 'iniciado') {
                                            col_status = '#0D47A1';
                                            title = 'Estudio de seguridad iniciado';
                                            estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-primary'>Estudio Iniciado</span>";
                                        } else if (element.estado == 'Rechazado') {
                                            col_status = '#F44336';
                                            title = 'Estudio de seguridad rechazado';
                                            estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger' >Estudio Rechazado</span>";
                                        } else if (element.estado == 'cancelado') {
                                            col_status = '#D50000';
                                            title = 'Estudio de seguridad cancelado';
                                            estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Cancelado</span>";
                                        } else if (element.estado == 'Rechazado_modificar') {
                                            col_status = '#F44336';
                                            title = 'Estudio de seguridad rechazado para modificar';
                                            estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Rechazado para modificar</span>";
                                        }
                                        status_es = estado;
                                    }
                                } else {
                                    if (element.estado == 'Aprobado') {
                                        col_status = '#14A44D';
                                        title = 'Estudio de seguridad aprobado';
                                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Estudio Aprobado</span>";
                                    } else if (element.estado == 'Pendiente') {
                                        col_status = '#E4A11B';
                                        title = 'Estudio de seguridad Pendiente';
                                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Pendiente</span>";
                                    } else if (element.estado == 'vencida') {
                                        col_status = '#F44336';
                                        title = 'Estudio de seguridad Vencido';
                                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Vencido</span>";
                                    } else if (element.estado == 'pendiente_iniciar') {
                                        col_status = '#E4A11B';
                                        title = 'Estudio de seguridad Pendiente por iniciar';
                                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Pendiente Iniciar</span>";
                                    } else if (element.estado == 'iniciado') {
                                        col_status = '#0D47A1';
                                        title = 'Estudio de seguridad iniciado';
                                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-primary'>Estudio Iniciado</span>";
                                    } else if (element.estado == 'Rechazado') {
                                        col_status = '#F44336';
                                        title = 'Estudio de seguridad rechazado';
                                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger' >Estudio Rechazado</span>";
                                    } else if (element.estado == 'cancelado') {
                                        col_status = '#D50000';
                                        title = 'Estudio de seguridad cancelado';
                                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Cancelado</span>";
                                    } else if (element.estado == 'Rechazado_modificar') {
                                        col_status = '#F44336';
                                        title = 'Estudio de seguridad rechazado para modificar';
                                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Rechazado para modificar</span>";
                                    }
                                    status_es = estado;
                                }
                            }

                            // Validar si es ITR
                            itr = (element.itr === 'SI')
                                ? '<span class="fs-10 badge badge-phoenix badge-phoenix-success">Si</span>'
                                : '<span class="fs-10 badge badge-phoenix badge-phoenix-danger">No</span>';

                            // ===========================
                            // RENDER HTML DEL ELEMENTO
                            // ===========================

                            // Contenedor avatar
                            const avatarDiv = document.createElement('div');
                            avatarDiv.className = 'avatar avatar-xl rounded-circle position-relative d-flex justify-content-center align-items-center me-3 me-sm-0 me-xl-2';
                            avatarDiv.style.width = '50px';
                            avatarDiv.style.height = '50px';
                            avatarDiv.style.border = '0.9px solid #c0c0c0';
                            avatarDiv.style.fontSize = '10px';
                            avatarDiv.style.color = '#1976D2';
                            avatarDiv.style.fontWeight = 'bold';
                            avatarDiv.style.backgroundColor = '#f8f9fa';

                            // Texto (placa)
                            const placaSpan = document.createElement('span');
                            placaSpan.className = 'z-1';
                            placaSpan.innerText = element.placa || '';

                            // Contador de interacciones
                            const totalInteracciones = element.interacciones?.[0]?.Total_Interacciones ?? 0;
                            const contadorSpan = document.createElement('span');
                            contadorSpan.className = 'bg-primary rounded-circle top-0 end-0 position-absolute text-white d-flex justify-content-center align-items-center fs-10 fw-semibold lh-1';
                            contadorSpan.style.height = '1rem';
                            contadorSpan.style.width = '1rem';
                            contadorSpan.innerText = totalInteracciones;

                            avatarDiv.appendChild(contadorSpan);
                            avatarDiv.appendChild(placaSpan);

                            // LI contenedor
                            const li = document.createElement('li');
                            li.className = 'nav-item read estudio-animado';
                            li.role = 'presentation';
                            li.addEventListener('animationend', () => {
                                li.classList.remove('estudio-animado');
                            });

                            // Link
                            const link = document.createElement('a');
                            link.className = 'nav-link d-flex align-items-center justify-content-center p-2';
                            link.setAttribute('data-bs-toggle', 'tab');
                            link.setAttribute('data-chat-thread', 'data-chat-thread');
                            link.setAttribute('href', `#tab-thread-${element.esoli}`);
                            link.setAttribute('role', 'tab');
                            link.setAttribute('aria-selected', 'false');
                            link.setAttribute('title', title);

                            link.setAttribute('data-solicitudId', element.id_estudio);
                            link.setAttribute('data-Placa', element.placa);
                            link.setAttribute('data-VehiculoId', element.id_vehiculo);
                            link.setAttribute('data-conductorId', element.id_conductor);
                            link.setAttribute('data-Operacion', element.operacion);
                            // link.setAttribute('data-PreestudioId', element.id_preestudio ? element.id_preestudio : element.id_estudio);
                            link.setAttribute('data-Nombre', element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2 ?? '');
                            // link.setAttribute('data-DataArray', JSON.stringify(data));
                            link.setAttribute('data-Estado', element.estado);
                            link.setAttribute('data-EstadoPrefiltro', element.estado_prefiltro);
                            link.setAttribute('data-EstadoCreacion', element.estado_creacion ?? '');
                            link.setAttribute('data-ObservacionGeneral', element.observacion_general ?? '');
                            link.setAttribute('data-EscenarioId', element.escenario_id);
                            link.setAttribute('data-EstudioIdC', element.id_estudio_c);
                            link.setAttribute('data-EsxisteEstudio', element.existe_estudio);
                            link.setAttribute('data-proceso_prefiltro_itr', element.itr);
                            link.setAttribute('data-responsable_vehiculo', element.responsable_vehiculo);
                            link.classList.add('btn-listado');

                            // Contenido
                            const contentDiv = document.createElement('div');
                            contentDiv.className = 'flex-1 d-sm-none d-xl-block';

                            const topRow = document.createElement('div');
                            topRow.className = 'd-flex justify-content-between align-items-center';
                            topRow.innerHTML = `
                                <div class="d-flex justify-content-between align-items-center w-100 position-relative grupo-hover">
                                <h5 class="fs-9 text-body-tertiary fw-normal name text-nowrap mb-0">
                                    ${status_es} | Numero: ${element.id_estudio}
                                </h5>
                                </div>
                            `;

                            let colorOperacion = '#6c757d'; // gris
                            switch (operacion) {
                                case 'Actualizar': colorOperacion = '#E4A11B'; break;
                                case 'Habilitar': colorOperacion = '#14A44D'; break;
                                case 'Nuevo': colorOperacion = '#0D47A1'; break;
                            }

                            const bottomRow = document.createElement('div');
                            bottomRow.className = 'd-flex justify-content-between';
                            bottomRow.innerHTML = `
                                <p class="fs-10 mb-0 line-clamp-1 text-body-tertiary text-opacity-85 message">
                                    Operación: <b style="color:${colorOperacion}">${operacion}</b> | ${element.fecha} ${element.hora} | ${element.prioritaria === null ? `` : `<span class="badge badge-phoenix badge-phoenix-danger">Prioritaria <span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`}
                                </p>
                            `;

                            const hr = document.createElement('div');
                            hr.className = 'border-top border-translucent border-dashed';

                            const gestionado = document.createElement('div');
                            gestionado.className = 'd-flex justify-content-between';
                            gestionado.innerHTML = `
                                <p class="fs-10 mb-0 line-clamp-1 text-body-tertiary text-opacity-85 message" id='GestionadoPor${element.id_estudio}'></p>
                            `;

                            contentDiv.appendChild(topRow);
                            contentDiv.appendChild(bottomRow);
                            contentDiv.appendChild(hr);
                            contentDiv.appendChild(gestionado);

                            link.appendChild(avatarDiv);
                            link.appendChild(contentDiv);
                            li.appendChild(link);
                            ul.appendChild(li);

                        }
                    });
                    // DetallesEstudioSeguridad(registros, operacion);
                } else {
                    const li = document.createElement('li');
                    li.innerHTML = `<div class="text-center text-muted py-2">Sin registros en la lista</div>`;
                    ul.appendChild(li);
                }
            })
            .catch(error => {
                // alert(error);
            });

    } catch (error) {
        console.log(error);
    }
}

function renderPorTab(tab) {

    const ul = document.getElementById('List_prefiltro_seguridad');
    ul.innerHTML = '';

    let filtrados = [];

    if (tab === 'operaciones') {
        filtrados = window.dataSolicitudes.filter(e =>
            e.tipo === 'estudio' &&
            (e.estado || '').toLowerCase() === 'pendiente'
        );
        document.getElementById('total_general').innerText = filtrados.length;
    }

    if (tab === 'seguridad') {
        filtrados = window.dataSolicitudes.filter(e =>
            ['pendiente_iniciar', 'iniciado'].includes(
                (e.estado || '').toLowerCase()
            )
        );
        document.getElementById('total_prefiltros').innerText = filtrados.length;
    }

    if (tab === 'resultados') {
        filtrados = window.dataSolicitudes.filter(e =>
            ['aprobado', 'rechazado'].includes(
                (e.estado || '').toLowerCase()
            )
        );
        document.getElementById('total_estudios').innerText = filtrados.length;
    }

    filtrados.forEach(element => {
        renderItem(element, ul); // tu código actual
    });
}

function renderItem(element, ul) {

    // document.getElementById('total_prefiltros').innerHTML = element++;
    const operacion = element.operacion || 'Nuevo';

    let status_es = '', col_status = '', title = '';
    // let status_pre = '', col_status_pre = '', title_pre = '';

    // ===========================
    // PREFILTROS
    // ===========================
    if (element.tipo === 'prefiltro') {
        // Estado visual
        if (operacion === 'Nuevo') {
            if (element.estado === 'aprobado') {
                col_status = '#14A44D';
                title = 'Prefiltro aprobado Autoriza HV';
                estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Prefiltro Aprobado</span>";
            } else if (element.estado === 'pendiente') {
                col_status = '#E4A11B';
                title = 'Prefiltro Pendiente';
                estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Prefiltro Pendiente</span>";
            } else if (element.estado === 'vencida') {
                col_status = '#5D4037';
                title = 'Prefiltro Vencido';
                estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Prefiltro Vencido</span>";
            } else if (element.estado === 'pendiente_iniciar') {
                col_status = '#332D2D';
                title = 'Prefiltro Pendiente por iniciar';
                estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Prefiltro Pendiente Iniciar</span>";
            } else if (element.estado === 'iniciado') {
                col_status = '#0D47A1';
                title = 'Prefiltro iniciado';
                estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Prefiltro Iniciado</span>";
            } else if (element.estado === 'rechazado') {
                col_status = '#DC4C64';
                title = 'Prefiltro rechazado';
                estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Prefiltro Rechazado</span>";
            } else if (element.estado === 'cancelado') {
                col_status = '#D50000';
                title = 'Prefiltro cancelado';
                estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Prefiltro Cancelado</span>";
            } else if (element.estado === 'Rechazado_modificar') {
                col_status = '#F44336';
                title = 'Prefiltro rechazado para modificar';
                estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-info'>Prefiltro Rechazado para modificar</span>";
            }
            status_e = element.campo || '';
            status_es = estado;
        }

        // Validar si es ITR
        itr = (element.itr === 'SI')
            ? '<span class="label label-success">Si</span>'
            : '<span class="label label-danger">No</span>';

        // ===========================
        // RENDER HTML DEL ELEMENTO
        // ===========================

        // Contenedor avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar avatar-xl rounded-circle position-relative d-flex justify-content-center align-items-center me-3 me-sm-0 me-xl-2';
        avatarDiv.style.width = '50px';
        avatarDiv.style.height = '50px';
        avatarDiv.style.border = '0.9px solid #c0c0c0';
        avatarDiv.style.fontSize = '10px';
        avatarDiv.style.color = '#1976D2';
        avatarDiv.style.fontWeight = 'bold';
        avatarDiv.style.backgroundColor = '#f8f9fa';

        // Texto (placa)
        const placaSpan = document.createElement('span');
        placaSpan.className = 'z-1';
        placaSpan.innerText = element.placa || '';

        // Contador de interacciones
        const totalInteracciones = element.interacciones?.[0]?.Total_Interacciones ?? 0;
        const contadorSpan = document.createElement('span');
        contadorSpan.className = 'bg-primary rounded-circle top-0 end-0 position-absolute text-white d-flex justify-content-center align-items-center fs-10 fw-semibold lh-1';
        contadorSpan.style.height = '1rem';
        contadorSpan.style.width = '1rem';
        contadorSpan.innerText = totalInteracciones;

        avatarDiv.appendChild(contadorSpan);
        avatarDiv.appendChild(placaSpan);

        // LI contenedor
        const li = document.createElement('li');
        li.className = 'nav-item read estudio-animado';
        li.role = 'presentation';
        li.addEventListener('animationend', () => {
            li.classList.remove('estudio-animado');
        });

        // Link
        const link = document.createElement('a');
        link.className = 'nav-link d-flex align-items-center justify-content-center p-2';
        link.setAttribute('data-bs-toggle', 'tab');
        link.setAttribute('data-chat-thread', 'data-chat-thread');
        link.setAttribute('href', `#tab-thread-${element.esoli}`);
        link.setAttribute('role', 'tab');
        link.setAttribute('aria-selected', 'false');
        link.setAttribute('title', title);
        link.setAttribute('data-PreestudioId', element.esoli);
        // link.setAttribute('data-solicitudId', element.esoli);
        link.setAttribute('data-Placa', element.placa);
        link.setAttribute('data-Operacion', element.operacion);
        // link.setAttribute('data-Nombre', element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2 ?? '');
        link.setAttribute('data-EscenarioId', element.escenario_id);
        // link.setAttribute('data-EsxisteEstudio', element.existe_estudio ?? '');
        link.setAttribute('data-proceso_prefiltro_itr', element.itr ?? '');
        link.setAttribute('data-Estado', element.estado);
        // link.setAttribute('data-VehiculoId', element.vehiculo_id ? element.vehiculo_id : '');
        // link.setAttribute('data-conductorId', element.conductor_id);
        link.setAttribute('data-proceso_prefiltro_itr', element.itr);
        link.setAttribute('data-Nombre', element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2);
        link.setAttribute('data-propietario', element.documento_propietario);
        link.setAttribute('data-tenedor', element.documento_tenedor);
        link.setAttribute('data-conductor', element.documento_conductor);
        link.setAttribute('data-placa_trailer_nuevo', element.placa_trailer);
        link.setAttribute('data-documento_propietario_trailer', element.documento_propietario_trailer);
        link.setAttribute('data-observacion', element.observacion);
        link.setAttribute('data-existe_estudio', element.existe_estudio);
        link.setAttribute('data-usuario_responsable_vehiculo', element.usuario_responsable_vehiculo);
        link.setAttribute('data-responsable_vehiculo', element.responsable_vehiculo);
        link.classList.add('btn-ver');

        // Contenido
        const contentDiv = document.createElement('div');
        contentDiv.className = 'flex-1 d-sm-none d-xl-block';

        const topRow = document.createElement('div');
        topRow.className = 'd-flex justify-content-between align-items-center';
        topRow.innerHTML = `
                                <div class="d-flex justify-content-between align-items-center w-100 position-relative grupo-hover">
                                <h5 class="fs-9 text-body-tertiary fw-normal name text-nowrap mb-0">
                                    ${status_es} | Numero: ${element.esoli}
                                </h5>
                                </div>
                            `;

        let colorOperacion = '#6c757d'; // gris
        switch (operacion) {
            case 'Actualizar': colorOperacion = '#E4A11B'; break;
            case 'Habilitar': colorOperacion = '#14A44D'; break;
            case 'Nuevo': colorOperacion = '#0D47A1'; break;
        }

        const bottomRow = document.createElement('div');
        bottomRow.className = 'd-flex justify-content-between';
        bottomRow.innerHTML = `
                                <p class="fs-10 mb-0 line-clamp-1 text-body-tertiary text-opacity-85 message">
                                Operación: <b style="color:${colorOperacion}">${operacion}</b> | ${element.fecha} ${element.hora} | ${element.prioritaria === null ? `` : `<span class="badge badge-phoenix badge-phoenix-danger">Prioritaria <span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`}
                                </p>
                            `;

        const hr = document.createElement('div');
        hr.className = 'border-top border-translucent border-dashed';

        const gestionado = document.createElement('div');
        gestionado.className = 'd-flex justify-content-between';
        gestionado.innerHTML = `
                                <p class="fs-10 mb-0 line-clamp-1 text-body-tertiary text-opacity-85 message" id='GestionadoPor${element.esoli}'></p>
                            `;

        contentDiv.appendChild(topRow);
        contentDiv.appendChild(bottomRow);
        contentDiv.appendChild(hr);
        contentDiv.appendChild(gestionado);

        link.appendChild(avatarDiv);
        link.appendChild(contentDiv);
        li.appendChild(link);
        ul.appendChild(li);
    }

    // ===========================
    // ESTUDIOS (por ahora solo log)
    // ===========================
    else if (element.tipo === 'estudio') {
        // console.log('Estudio:', element);

        if (operacion === 'Nuevo' || operacion === 'Habilitar' || operacion === 'Actualizar') {
            /* Validar si esta activo de la creacion de recurso nuevo para cambiar la etiqueda */
            if (operacion === 'Actualizar') {
                if (element.estado_prefiltro === 'Pendiente' || element.estado_prefiltro === 'Iniciado' || element.estado_prefiltro === 'Rechazado' || element.estado_prefiltro === 'Aprobado') {
                    if (element.estado_creacion === 'TERCERO CREADO') {
                        col_status = '#0D47A1';
                        title = 'Recurso Creado';
                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Nuevo recurso creado</span>";
                    } else {
                        if (element.estado_prefiltro === 'Aprobado') {
                            col_status = '#14A44D';
                            title = 'Nuevo recurso Aprobado';
                            estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-info'>Nuevo recurso Aprobado</span>";
                        } else if (element.estado_prefiltro === 'Pendiente') {
                            col_status = '#E4A11B';
                            title = 'Nuevo recurso Pendiente';
                            estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Nuevo recurso Pendiente</span>";
                        } else if (element.estado_prefiltro === 'Iniciado') {
                            col_status = '#0D47A1';
                            title = 'Nuevo recurso Iniciado';
                            estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-primary'>Nuevo recurso Iniciado</span>";
                        } else if (element.estado_prefiltro === 'Rechazado') {
                            col_status = '#F44336';
                            title = 'Nuevo recurso Rechazado';
                            estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Nuevo recurso Rechazado</span>";
                        }
                    }
                    status_es = estado;
                } else {
                    if (element.estado == 'Aprobado') {
                        col_status = '#14A44D';
                        title = 'Estudio de seguridad aprobado';
                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Estudio Aprobado</span>";
                    } else if (element.estado == 'Pendiente') {
                        col_status = '#E4A11B';
                        title = 'Estudio de seguridad Pendiente';
                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Pendiente</span>";
                    } else if (element.estado == 'vencida') {
                        col_status = '#F44336';
                        title = 'Estudio de seguridad Vencido';
                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Vencido</span>";
                    } else if (element.estado == 'pendiente_iniciar') {
                        col_status = '#E4A11B';
                        title = 'Estudio de seguridad Pendiente por iniciar';
                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Pendiente Iniciar</span>";
                    } else if (element.estado == 'iniciado') {
                        col_status = '#0D47A1';
                        title = 'Estudio de seguridad iniciado';
                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-primary'>Estudio Iniciado</span>";
                    } else if (element.estado == 'Rechazado') {
                        col_status = '#F44336';
                        title = 'Estudio de seguridad rechazado';
                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger' >Estudio Rechazado</span>";
                    } else if (element.estado == 'cancelado') {
                        col_status = '#D50000';
                        title = 'Estudio de seguridad cancelado';
                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Cancelado</span>";
                    } else if (element.estado == 'Rechazado_modificar') {
                        col_status = '#F44336';
                        title = 'Estudio de seguridad rechazado para modificar';
                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Rechazado para modificar</span>";
                    }
                    status_es = estado;
                }
            } else {
                if (element.estado == 'Aprobado') {
                    col_status = '#14A44D';
                    title = 'Estudio de seguridad aprobado';
                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Estudio Aprobado</span>";
                } else if (element.estado == 'Pendiente') {
                    col_status = '#E4A11B';
                    title = 'Estudio de seguridad Pendiente';
                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Pendiente</span>";
                } else if (element.estado == 'vencida') {
                    col_status = '#F44336';
                    title = 'Estudio de seguridad Vencido';
                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Vencido</span>";
                } else if (element.estado == 'pendiente_iniciar') {
                    col_status = '#E4A11B';
                    title = 'Estudio de seguridad Pendiente por iniciar';
                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Pendiente Iniciar</span>";
                } else if (element.estado == 'iniciado') {
                    col_status = '#0D47A1';
                    title = 'Estudio de seguridad iniciado';
                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-primary'>Estudio Iniciado</span>";
                } else if (element.estado == 'Rechazado') {
                    col_status = '#F44336';
                    title = 'Estudio de seguridad rechazado';
                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger' >Estudio Rechazado</span>";
                } else if (element.estado == 'cancelado') {
                    col_status = '#D50000';
                    title = 'Estudio de seguridad cancelado';
                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Cancelado</span>";
                } else if (element.estado == 'Rechazado_modificar') {
                    col_status = '#F44336';
                    title = 'Estudio de seguridad rechazado para modificar';
                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Rechazado para modificar</span>";
                }
                status_es = estado;
            }
        }

        // Validar si es ITR
        itr = (element.itr === 'SI')
            ? '<span class="fs-10 badge badge-phoenix badge-phoenix-success">Si</span>'
            : '<span class="fs-10 badge badge-phoenix badge-phoenix-danger">No</span>';

        // ===========================
        // RENDER HTML DEL ELEMENTO
        // ===========================

        // Contenedor avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar avatar-xl rounded-circle position-relative d-flex justify-content-center align-items-center me-3 me-sm-0 me-xl-2';
        avatarDiv.style.width = '50px';
        avatarDiv.style.height = '50px';
        avatarDiv.style.border = '0.9px solid #c0c0c0';
        avatarDiv.style.fontSize = '10px';
        avatarDiv.style.color = '#1976D2';
        avatarDiv.style.fontWeight = 'bold';
        avatarDiv.style.backgroundColor = '#f8f9fa';

        // Texto (placa)
        const placaSpan = document.createElement('span');
        placaSpan.className = 'z-1';
        placaSpan.innerText = element.placa || '';

        // Contador de interacciones
        const totalInteracciones = element.interacciones?.[0]?.Total_Interacciones ?? 0;
        const contadorSpan = document.createElement('span');
        contadorSpan.className = 'bg-primary rounded-circle top-0 end-0 position-absolute text-white d-flex justify-content-center align-items-center fs-10 fw-semibold lh-1';
        contadorSpan.style.height = '1rem';
        contadorSpan.style.width = '1rem';
        contadorSpan.innerText = totalInteracciones;

        avatarDiv.appendChild(contadorSpan);
        avatarDiv.appendChild(placaSpan);

        // LI contenedor
        const li = document.createElement('li');
        li.className = 'nav-item read estudio-animado';
        li.role = 'presentation';
        li.addEventListener('animationend', () => {
            li.classList.remove('estudio-animado');
        });

        // Link
        const link = document.createElement('a');
        link.className = 'nav-link d-flex align-items-center justify-content-center p-2';
        link.setAttribute('data-bs-toggle', 'tab');
        link.setAttribute('data-chat-thread', 'data-chat-thread');
        link.setAttribute('href', `#tab-thread-${element.esoli}`);
        link.setAttribute('role', 'tab');
        link.setAttribute('aria-selected', 'false');
        link.setAttribute('title', title);

        link.setAttribute('data-solicitudId', element.id_estudio);
        link.setAttribute('data-Placa', element.placa);
        link.setAttribute('data-VehiculoId', element.id_vehiculo);
        link.setAttribute('data-conductorId', element.id_conductor);
        link.setAttribute('data-Operacion', element.operacion);
        // link.setAttribute('data-PreestudioId', element.id_preestudio ? element.id_preestudio : element.id_estudio);
        link.setAttribute('data-Nombre', element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2 ?? '');
        // link.setAttribute('data-DataArray', JSON.stringify(data));
        link.setAttribute('data-Estado', element.estado);
        link.setAttribute('data-EstadoPrefiltro', element.estado_prefiltro);
        link.setAttribute('data-EstadoCreacion', element.estado_creacion ?? '');
        link.setAttribute('data-ObservacionGeneral', element.observacion_general ?? '');
        link.setAttribute('data-EscenarioId', element.escenario_id);
        link.setAttribute('data-EstudioIdC', element.id_estudio_c);
        link.setAttribute('data-EsxisteEstudio', element.existe_estudio);
        link.setAttribute('data-proceso_prefiltro_itr', element.itr);
        link.setAttribute('data-responsable_vehiculo', element.responsable_vehiculo);
        link.classList.add('btn-listado');

        // Contenido
        const contentDiv = document.createElement('div');
        contentDiv.className = 'flex-1 d-sm-none d-xl-block';

        const topRow = document.createElement('div');
        topRow.className = 'd-flex justify-content-between align-items-center';
        topRow.innerHTML = `
                <div class="d-flex justify-content-between align-items-center w-100 position-relative grupo-hover">
                  <h5 class="fs-9 text-body-tertiary fw-normal name text-nowrap mb-0">
                    ${status_es} | Numero: ${element.id_estudio}
                  </h5>
                </div>
              `;

        let colorOperacion = '#6c757d'; // gris
        switch (operacion) {
            case 'Actualizar': colorOperacion = '#E4A11B'; break;
            case 'Habilitar': colorOperacion = '#14A44D'; break;
            case 'Nuevo': colorOperacion = '#0D47A1'; break;
        }

        const bottomRow = document.createElement('div');
        bottomRow.className = 'd-flex justify-content-between';
        bottomRow.innerHTML = `
                <p class="fs-10 mb-0 line-clamp-1 text-body-tertiary text-opacity-85 message">
                  Operación: <b style="color:${colorOperacion}">${operacion}</b> | ${element.fecha} ${element.hora} | ${element.prioritaria === null ? `` : `<span class="badge badge-phoenix badge-phoenix-danger">Prioritaria <span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`}
                </p>
              `;

        const hr = document.createElement('div');
        hr.className = 'border-top border-translucent border-dashed';

        const gestionado = document.createElement('div');
        gestionado.className = 'd-flex justify-content-between';
        gestionado.innerHTML = `
                <p class="fs-10 mb-0 line-clamp-1 text-body-tertiary text-opacity-85 message" id='GestionadoPor${element.id_estudio}'></p>
              `;

        contentDiv.appendChild(topRow);
        contentDiv.appendChild(bottomRow);
        contentDiv.appendChild(hr);
        contentDiv.appendChild(gestionado);

        link.appendChild(avatarDiv);
        link.appendChild(contentDiv);
        li.appendChild(link);
        ul.appendChild(li);

    }

}

// Creamos una promesa que envuelve toda la función de CargarDatosEstudio
async function cargarDatosEstudioPromesa(SolicitudId,
    PreestudioId,
    Placa,
    Operacion,
    EscenarioId,
    Estado,
    EstadoPrefiltro,
    EstadoCreacion,
    ProcesoPrefiltroItr,
    Nombre,
    DocumentoPropietario,
    DocumentoTenedor,
    DocumentoConductor,
    PlacaTrailerNuevo,
    DocumentoPropietarioTrailer,
    Observacion,
    UsuarioResponsableVehiculo, ExisteEstudio, EstudioIdc, VehiculoId,
    ConductorId, ResponsableVehiculo) {

    const baseUrl = $('#base_url').val();
    const contenedor = '.tab-content.flex-1';

    // URL dinámica para poder acceder al estudio directamente
    const nuevaUrl = `${window.location.origin}${window.location.pathname}?idmenu=1&submenu=92&solicitud=${codificarBase64(SolicitudId)}`;
    window.history.pushState({ SolicitudId }, '', nuevaUrl);

    try {
        // Mostrar loader
        $(contenedor).html('<div class="p-4 text-center">Cargando estudio...</div>');

        // Cargar la vista desde el servidor
        const respuesta = await fetch(`${baseUrl}views/templates/template_estudios_operaciones.phtml`, {
            method: 'GET',
            headers: { 'Content-Type': 'text/html' },
            cache: 'no-cache',
        });

        if (!respuesta.ok) {
            throw new Error(`Error al cargar la vista: ${respuesta.status}`);
        }

        const html = await respuesta.text();

        // Insertar la vista en el contenedor
        document.querySelector(contenedor).innerHTML = html;

        if (Estado === 'pendiente_iniciar') {
            document.getElementById('btn-accion-estudio').style.display = '';
            // document.getElementById('enviar_seguridad').style.display = 'none';
        } else if (Estado === 'iniciado') {
            // document.getElementById('enviar_seguridad').style.display = '';
            document.getElementById('btn-accion-estudio').style.display = 'none';
        } else if (Estado === 'Aprobado') {
            document.getElementById('btn_anular_estudio').style.display = '';
            // document.getElementById('enviar_seguridad').style.display = 'none';
            document.getElementById('btn-accion-estudio').style.display = '';
        } else if (Estado === 'cancelado') {
            document.getElementById('btn-accion-estudio').style.display = 'none';
            // document.getElementById('enviar_seguridad').style.display = 'none';
        } else if (Estado === 'Rechazado_modificar') {
            document.getElementById('btn-accion-estudio').style.display = 'none';
            // document.getElementById('enviar_seguridad').style.display = 'none';
        }

        const botonAnularEstudio = document.getElementById('btn_anular_estudio');
        botonAnularEstudio.setAttribute('data-EstudioIdC', EstudioIdc);
        botonAnularEstudio.setAttribute('data-Placa', Placa);
        botonAnularEstudio.setAttribute('data-SolicitudId', SolicitudId);
        botonAnularEstudio.setAttribute('data-NombreOpcion', 'Estudio de Seguridad');
        botonAnularEstudio.setAttribute('data-VehiculoId', VehiculoId);
        botonAnularEstudio.setAttribute('data-ConductorId', ConductorId);

        const BotonRetornarEstudio = document.getElementById('guarde_rehabil');
        BotonRetornarEstudio.setAttribute('data-EstudioIdC', EstudioIdc);
        BotonRetornarEstudio.setAttribute('data-Placa', Placa);
        BotonRetornarEstudio.setAttribute('data-SolicitudId', SolicitudId);
        BotonRetornarEstudio.setAttribute('data-VehiculoId', VehiculoId);
        BotonRetornarEstudio.setAttribute('data-ConductorId', ConductorId);
        BotonRetornarEstudio.setAttribute('data-Operacion', Operacion);


        document.getElementById('responsable_vehiculo_estudio').innerHTML = ResponsableVehiculo;

        return new Promise((resolve, reject) => {
            if ($('.idvehi').length) $('.idvehi').html(Placa);
            if ($('.idcondu').length) $('.idcondu').html(Nombre);
            if ($('.idstu').length) $('.idstu').html(SolicitudId);
            if ($('#idstu').length) $('#idstu').val(SolicitudId);

            const datos = {
                idv: VehiculoId,
                idc: ConductorId,
                idsoli: SolicitudId,
                // action: 'verestudio_operaciones'
            };

            $(`#ini, #apro, #cini, #capro, #rini, #rapro, #ruini, #ruapro, #pini, #poapro, #proini, #proapro, #smini, #sipro, #siscini, #siscompro, #aini, #adrpro, #gini, #gpro, #preini, #prepro, #cuerpo_estudio`).html('');

            $.ajax({
                url: $('#base_url').val() + 'validacionparametros/ver_estudio_operaciones',
                type: 'POST',
                data: datos,
                dataType: 'json',
                success: function (data) {
                    if (!data) return resolve();
                    let cunt = 0;
                    $(`#cuerpo_estudio`).html('');
                    const documentos = data.resultado || [];
                    if (documentos.length === 0) {
                        $(`#cuerpo_estudio`).html(`
                                <tr>
                                    <td colspan="6" class="text-center text-muted">
                                        <b>No hay gestion para las hojas de vida del estudio.</b>
                                    </td>
                                </tr>
                            `);
                        return; // salir si no hay nada más que mostrar
                    }

                    data.resultado.forEach((element, index) => {
                        cunt++;
                        const aprobado = element.estado;
                        const tipo = element.estudio;

                        const iniciado = '<center><span class="text-success fas fa-circle"></span></center>';
                        const aprobadoHtml = '<center><span class="text-success fas fa-circle"></span></center>';
                        const rechazadoHtml = '<center><span class="text-danger fas fa-circle"></span></center>';

                        const status = aprobado === 1 ? aprobadoHtml : aprobado === 0 ? rechazadoHtml : '';

                        const idMap = {
                            'hoja de vida vehiculo': [`#ini`, `#apro`],
                            'hoja de vida conductor': [`#cini`, `#capro`],
                            'risck': [`#rini`, `#rapro`],
                            'siplaft': [`#sini`, `#sapro`],
                            'runt': [`#ruini`, `#ruapro`],
                            'policia': [`#pini`, `#poapro`],
                            'procuraduria': [`#proini`, `#proapro`],
                            'simit': [`#smini`, `#sipro`],
                            'siscomn': [`#siscini`, `#siscompro`],
                            'adres': [`#aini`, `#adrpro`],
                            'Gps': [`#gini`, `#gpro`],
                            'Dato preestudio': [`#preini`, `#prepro`]
                        };

                        if (idMap[tipo]) {
                            const [iniId, aproId] = idMap[tipo];

                            if ($(iniId).length > 0 && $(aproId).length > 0) {
                                $(iniId).html(iniciado);
                                $(aproId).html(status);
                            } else {
                                console.warn(`❌ No se encontró el selector: ${iniId} o ${aproId}`);
                            }
                        } else {
                            console.warn(`⚠️ Tipo de estudio no mapeado: ${tipo}`);
                        }

                        const palabra = aprobado === 1 ? 'Aceptado' : 'No aceptado';

                        $(`#cuerpo_estudio`).append(`
                        <tr>
<td style="width: auto; white-space: nowrap; ">
    ${palabra === 'Aceptado'
                                ? `<b class='text-primary'>${element.estudio}</b>`
                                : (element.estadototal === 'Pendiente' || element.estadototal === 'Rechazado_modificar')
                                    ? `
                    <div class="dropdown">
                        <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none fw-bold"
                           id="dropdownMenuLink${cunt}" href="#" role="button" 
                           data-bs-toggle="dropdown" aria-expanded="false">
                            ${element.estudio}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink${cunt}">
                            <li>
                                <a class="dropdown-item" href="#" 
                                   id="res_operacion${cunt}" 
                                   data-id="${element.id_estudio}" 
                                   data-id2="${element.id}" 
                                   data-id3="${element.estudio}">
                                    Editar Respuesta
                                </a>
                            </li>
                        </ul>
                    </div>`
                                    : `<b>${element.estudio}</b>`
                            }
</td>

                            <td style="width: auto; white-space: nowrap; ">${CrearBadge(palabra)}</td>
                            <td>${element.observacion}</td>
                            <td style="width: auto; white-space: nowrap; ">${element.usuario}</td>
                            <td style="width: auto; white-space: nowrap; ">${element.fecha}_${element.hora}</td>
                        </tr>
                    `);

                        $(`#res_operacion${cunt}`).click(function () {
                            document.getElementById(`caja_rtaopera`).style.display = '';
                            $(`#op_estudio`).val($(this).data('id3'));
                            $(`#op_ntipo`).val($(this).data('id2'));
                            $(`#op_nestudio`).val($(this).data('id'));
                        });
                    });

                    $(`#tbr_observaciones`).html('');
                    const EstadosEstudios = data.resultado_observacion || [];
                    if (EstadosEstudios.length === 0) {
                        $(`#tbr_observaciones`).html(`
                                <tr>
                                    <td colspan="6" class="text-center text-muted">
                                        <b>Sin gestionar estudio de seguridad</b>
                                    </td>
                                </tr>
                            `);
                        return; // salir si no hay nada más que mostrar
                    }

                    data.resultado_observacion.forEach(element => {
                        $(`#tbr_observaciones`).append(`
                        <tr>
                            <td style="width: auto; white-space: nowrap; ">${element.id}</td>
                            <td>${element.observacion ?? 'Sin Obseravción'}</td>
                            <td style="width: auto; white-space: nowrap; ">${element.fecha}-${element.hora}</td>
                            <td style="width: auto; white-space: nowrap; ">${element.usuario}</td>
                            <td style="width: auto; white-space: nowrap;">${CrearBadge(element.estado)}</td>
                        </tr>`);
                    });
                    resolve();
                },
                error: reject
            });

            // Parte con fetch
            const formdatadocumento = new FormData();
            formdatadocumento.append('placa', Placa);
            formdatadocumento.append('solicitud', SolicitudId);

            fetch($('#base_url').val() + 'validacionparametros/Documentos_Actualizar', {
                method: 'POST',
                body: formdatadocumento
            }).then(resp => resp.json())
                .then(data => {
                    setTimeout(() => {
                        $(`#consulta_tbservicio_estudio`).html('');
                        $(`#consulta_datoupdate`).html('');
                        if (data.resultado_preestudio) {
                            data.resultado_preestudio.forEach(element => {
                                $(`#consulta_tbservicio_estudio`).append(`
                            <tr>
                                <td>${element.nundoc_solicitud}</td>
                                <td style="width: auto; white-space: nowrap; ">${element.nombre_cliente}</td>
                                <td colspan="2">${element.orige} - ${element.dest}</td>
                                <td style="width: auto; white-space: nowrap; ">${element.peso_kg} / ${element.tipo_vehiculo}</td>
                                <td style="width: auto; white-space: nowrap; ">${element.usuario_auditor}</td>
                                <td style="width: auto; white-space: nowrap; ">${element.fecha} - ${element.hora}</td>
                            </tr>`);
                            });

                            const documentos = data.resultado_documento_actualizar || [];

                            if (documentos.length === 0) {
                                $(`#consulta_datoupdate`).html(`
                                <tr>
                                    <td colspan="6" class="text-center text-muted">
                                        <b>No hay datos para actualizar</b>
                                    </td>
                                </tr>
                            `);
                                return; // salir si no hay nada más que mostrar
                            }

                            data.resultado_documento_actualizar.forEach(function (element, index) {
                                index++;
                                const icono = obtenerIconoArchivo(element.name_archivo); // ← AQUI USAS TU FUNCIÓN
                                $(`#consulta_datoupdate`).append(
                                    `<tr>
                                        <td style="width: auto; white-space: nowrap;">${index}</td>
                                        <td style="width: auto; white-space: nowrap;">${element.tipo_hv}</td>
                                        <td style="width: auto; white-space: nowrap;">${element.tipo_campo}</td>
                                        <td style="width: auto; white-space: nowrap;">
                                            ${element.name_archivo === "" && element.info_campo === ""
                                        ? 'Sin Documento'
                                        : (element.info_campo === ""
                                            ? `<a href="#" onclick="abrir_fotos('${element.ruta_archivo}' , '${element.name_archivo}')" class="cell-detail hint--top-left" data-hint="">${icono}</a>`
                                            : element.info_campo)
                                    }
                                        </td>
                                        <td style="width: auto; white-space: nowrap;">${element.usuario}</td>
                                        <td style="width: auto; white-space: nowrap;">${element.fecha} - ${element.hora}</td>
                                    </tr>`
                                );
                            });
                        }
                    }, 500);
                })
                .catch(error => {
                    console.error('Error en documentos:', error);
                    reject(error);
                });
            cargarRespuestasOperaciones(SolicitudId);
            if (Operacion === 'Actualizar' && ['Pendiente', 'Iniciado', 'Rechazado', 'Aprobado'].includes(EstadoPrefiltro)) {
                document.getElementById('accordionExample').style.display = '';
                Listar_datos_prefiltro_nuevo_recurso(SolicitudId, Placa);
            }
        });

    } catch (error) {
        console.error('Error cargando vista:', error);
        document.querySelector(contenedor).innerHTML = `
      <div class="alert alert-danger p-3">Error cargando la vista del estudio.</div>`;
    }

}

// FUNCION PARA CARGAR LOS PREFILTROS DE SEGURIDAD
async function CargarDatosPrefiltros(SolicitudId,
    PreestudioId,
    Placa,
    Operacion,
    EscenarioId,
    Estado,
    EstadoPrefiltro,
    EstadoCreacion,
    ProcesoPrefiltroItr,
    Nombre,
    DocumentoPropietario,
    DocumentoTenedor,
    DocumentoConductor,
    PlacaTrailerNuevo,
    DocumentoPropietarioTrailer,
    Observacion,
    UsuarioResponsableVehiculo,
    ExisteEstudio,
    ResponsableVehiculo) {
    const baseUrl = $('#base_url').val();
    const contenedor = '.tab-content.flex-1';

    // URL dinámica para poder acceder al estudio directamente
    const nuevaUrl = `${window.location.origin}${window.location.pathname}?idmenu=1&submenu=92&solicitud=${codificarBase64(PreestudioId)}`;
    window.history.pushState({ PreestudioId }, '', nuevaUrl);

    try {
        // Mostrar loader
        $(contenedor).html('<div class="p-4 text-center">Cargando estudio...</div>');

        // Cargar la vista desde el servidor
        const respuesta = await fetch(`${baseUrl}views/templates/template_prefiltros_operaciones.phtml`, {
            method: 'GET',
            headers: { 'Content-Type': 'text/html' },
            cache: 'no-cache',
        });

        if (!respuesta.ok) {
            throw new Error(`Error al cargar la vista: ${respuesta.status}`);
        }

        const html = await respuesta.text();

        // Insertar la vista en el contenedor
        document.querySelector(contenedor).innerHTML = html;

        if (Estado === 'aprobado') {
            document.getElementById('datos_val').style.display = '';
        }

        let BotonValidarToken = document.getElementById('validar_token');
        BotonValidarToken.setAttribute('data-proceso_prefiltro_itr', ProcesoPrefiltroItr);
        BotonValidarToken.setAttribute('data-prefiltroid', PreestudioId);
        BotonValidarToken.setAttribute('data-placa', Placa);
        BotonValidarToken.setAttribute('data-propietario', DocumentoPropietario);
        BotonValidarToken.setAttribute('data-tenedor', DocumentoTenedor);
        BotonValidarToken.setAttribute('data-conductor', DocumentoConductor);
        BotonValidarToken.setAttribute('data-placa_trailer_nuevo', PlacaTrailerNuevo);
        BotonValidarToken.setAttribute('data-documento_propietario_trailer', DocumentoPropietarioTrailer);
        BotonValidarToken.setAttribute('data-observacion_prefiltro', Observacion);
        BotonValidarToken.setAttribute('data-responsable_vehiculo', UsuarioResponsableVehiculo);

        let BotonValidarHojasVida = document.getElementById('validar_hojasv');
        BotonValidarHojasVida.setAttribute('data-prefiltroid', PreestudioId);
        BotonValidarHojasVida.setAttribute('data-placa', Placa);
        BotonValidarHojasVida.setAttribute('data-propietario', DocumentoPropietario);
        BotonValidarHojasVida.setAttribute('data-tenedor', DocumentoTenedor);
        BotonValidarHojasVida.setAttribute('data-conductor', DocumentoConductor);
        BotonValidarHojasVida.setAttribute('data-placa_trailer_nuevo', PlacaTrailerNuevo);
        BotonValidarHojasVida.setAttribute('data-documento_propietario_trailer', DocumentoPropietarioTrailer);

        let BotonSolicitudEstudio = document.getElementById('validar_solicitud');
        BotonSolicitudEstudio.setAttribute('data-prefiltroid', PreestudioId);
        BotonSolicitudEstudio.setAttribute('data-placa', Placa);
        BotonSolicitudEstudio.setAttribute('data-proceso_estu_itr', ProcesoPrefiltroItr);
        BotonSolicitudEstudio.setAttribute('data-proceso_estu', 'Pen_Sol_Seg');
        BotonSolicitudEstudio.setAttribute('data-observacion_prefiltro', Observacion);
        BotonSolicitudEstudio.setAttribute('data-responsable_vehiculo', UsuarioResponsableVehiculo);
        BotonSolicitudEstudio.setAttribute('data-EscenarioId', EscenarioId);

        document.getElementById('responsable_vehiculo_prefiltro').innerHTML = ResponsableVehiculo;

        let datos = new FormData();
        datos.append('placa', Placa);
        datos.append('solicitud', PreestudioId);

        await fetch($('#base_url').val() + 'validacionparametros/vsolicitud_preestudio', {
            method: 'POST',
            cache: 'no-cache',
            body: datos,
        })
            .then(response => response.json())
            .then(function (data) {
                if (data) {
                    $(`#vid`).html(data.ver_seguridad.id);
                    $(`#vcliente`).html(data.ver_seguridad.nombre_cliente);
                    $(`#vplaca`).html(data.ver_seguridad.placa + ' - ' + data.ver_seguridad.placa_trailer);
                    $(`#vconse`).html(data.ver_seguridad.id_preestudio);
                    $(`#vfecha`).html(data.ver_seguridad.fecha);
                    $(`#vhora`).html(data.ver_seguridad.hora);
                    $(`#vuser`).html(data.ver_seguridad.usuario_operaciones);

                    if (data.ver_seguridad.documento_propietario === data.ver_seguridad.Propietario) {
                        $(`#vpropi`).html(data.ver_seguridad.nombre_propietario);
                        $(`#vpropi`).css('backgroundColor', '#25b003');
                        $(`#vpropi`).css('color', '#FFFFFF');
                        $(`#vpdocumento`).css('backgroundColor', '#25b003');
                        $(`#vpdocumento`).css('color', '#FFFFFF');
                        $(`#vpdocumento`).html(data.ver_seguridad.documento_propietario);
                        $(`#estado_tercero_propietario`).html('<i class="fas fa-user-check"></i> Tercero Creado');
                        $(`#estado_tercero_propietario`).css('backgroundColor', '#25b003');
                    } else {
                        $(`#estado_tercero_propietario`).html('<i class="fas fa-user-times"></i> Tercero Pendiente');
                        // $(`#estado_tercero_propietario`).css('backgroundColor', '#FFFFFF');
                        // $(`#vpropi`).css('backgroundColor', '#FFFFFF');
                        $(`#vpropi`).css('Color', '#000000');
                        // $(`#vpdocumento`).css('backgroundColor', '#FFFFFF');
                        $(`#vpdocumento`).css('Color', '#000000');
                        $(`#vpropi`).html(data.ver_seguridad.nombre_propietario);
                        $(`#vpdocumento`).html(data.ver_seguridad.documento_propietario);
                    }

                    if (data.ver_seguridad.documento_tenedor === data.ver_seguridad.Poseedor) {
                        $(`#vtene`).html(data.ver_seguridad.nombre_tenedor);
                        $(`#vtene`).css('backgroundColor', '#25b003');
                        $(`#vtene`).css('color', '#FFFFFF');
                        $(`#vtdocumento`).css('backgroundColor', '#25b003');
                        $(`#vtdocumento`).css('color', '#FFFFFF');
                        $(`#vtdocumento`).html(data.ver_seguridad.documento_tenedor);
                        $(`#estado_tercero_poseedor`).html('<i class="fas fa-user-check"></i> Tercero Creado');
                        $(`#estado_tercero_poseedor`).css('backgroundColor', '#25b003');
                    } else {
                        $(`#estado_tercero_poseedor`).html('<i class="fas fa-user-times"></i> Tercero Pendiente');
                        // $(`#estado_tercero_poseedor`).css('backgroundColor', '#FFFFFF');
                        // $(`#vtene`).css('backgroundColor', '#FFFFFF');
                        $(`#vtene`).css('Color', '#000000');
                        // $(`#vtdocumento`).css('backgroundColor', '#FFFFFF');
                        $(`#vtdocumento`).css('Color', '#000000');
                        $(`#vtene`).html(data.ver_seguridad.nombre_tenedor);
                        $(`#vtdocumento`).html(data.ver_seguridad.documento_tenedor);
                    }

                    if (data.ver_seguridad.documento_conductor === data.ver_seguridad.Conductor) {
                        $(`#vcondu`).html(data.ver_seguridad.nombre_conductor);
                        $(`#vcondu`).css('backgroundColor', '#25b003');
                        $(`#vcondu`).css('color', '#FFFFFF');
                        $(`#vcdocumento`).css('backgroundColor', '#25b003');
                        $(`#vcdocumento`).css('color', '#FFFFFF');
                        $(`#vcdocumento`).html(data.ver_seguridad.documento_conductor);
                        $(`#estado_tercero_conductor`).html('<i class="fas fa-user-check"></i> Tercero Creado');
                        $(`#estado_tercero_conductor`).css('backgroundColor', '#25b003');
                    } else {
                        $(`#estado_tercero_conductor`).html('<i class="fas fa-user-times"></i> Tercero Pendiente');
                        // $(`#estado_tercero_conductor`).css('backgroundColor', '#FFFFFF');
                        $(`#estado_tercero_conductor`).html('<i class="fas fa-user-times"></i> Tercero Pendiente');
                        // $(`#estado_tercero_conductor`).css('backgroundColor', '#FFFFFF');
                        // $(`#vcondu`).css('backgroundColor', '#FFFFFF');
                        $(`#vcondu`).css('Color', '#000000');
                        // $(`#vcdocumento`).css('backgroundColor', '#FFFFFF');
                        $(`#vcdocumento`).css('Color', '#000000');
                        $(`#vcondu`).html(data.ver_seguridad.nombre_conductor);
                        $(`#vcdocumento`).html(data.ver_seguridad.documento_conductor);
                    }

                    // if (data.ver_seguridad.documento_propietario_trailer === data.ver_seguridad.Propietario_Trailer) {
                    //   $('#ptcondu').html(data.ver_seguridad.nombre_propietario_trailer);
                    //   $('#ptcondu').css('backgroundColor', '#25b003');
                    //   $('#ptcondu').css('Color', '#FFFFFF');
                    //   $('#ptcdocumento').css('backgroundColor', '#25b003');
                    //   $('#ptcdocumento').css('Color', '#FFFFFF');
                    //   $('#ptcdocumento').html(data.ver_seguridad.documento_propietario_trailer);
                    //   $('#estado_tercero_pro_trailer').html('<i class="fas fa-user-check"></i> Tercero Creado');
                    //   $('#estado_tercero_pro_trailer').css('backgroundColor', '#25b003');
                    // } else {
                    //   $('#ptcondu').css('backgroundColor', '#FFFFFF');
                    //   $('#ptcondu').css('Color', '#000000');
                    //   $('#ptcdocumento').css('backgroundColor', '#FFFFFF');
                    //   $('#ptcdocumento').css('Color', '#000000');
                    //   $('#ptcondu').html(data.ver_seguridad.nombre_propietario_trailer);
                    //   $('#ptcdocumento').html(data.ver_seguridad.documento_propietario_trailer);
                    //   $('#estado_tercero_pro_trailer').html('<i class="fas fa-user-check"></i> Tercero Pendiente');
                    //   $('#estado_tercero_pro_trailer').css('backgroundColor', '#FFFFFF');
                    // }

                    if (data.ver_seguridad.documento_propietario_trailer !== '') {
                        if (data.ver_seguridad.documento_propietario_trailer === data.ver_seguridad.Propietario_Trailer) {
                            $(`#ptcondu`).html(data.ver_seguridad.nombre_propietario_trailer);
                            $(`#ptcondu`).css('backgroundColor', '#25b003');
                            $(`#ptcondu`).css('color', '#FFFFFF');
                            $(`#ptcdocumento`).css('backgroundColor', '#25b003');
                            $(`#ptcdocumento`).css('color', '#FFFFFF');
                            $(`#ptcdocumento`).html(data.ver_seguridad.documento_propietario_trailer);
                            $(`#estado_tercero_pro_trailer`).html('<i class="fas fa-user-check"></i> Tercero Creado');
                            $(`#estado_tercero_pro_trailer`).css('backgroundColor', '#25b003');
                        } else {
                            // $(`#ptcondu`).css('backgroundColor', '#FFFFFF');
                            $(`#ptcondu`).css('Color', '#000000');
                            // $(`#ptcdocumento`).css('backgroundColor', '#FFFFFF');
                            $(`#ptcdocumento`).css('Color', '#000000');
                            $(`#ptcondu`).html(data.ver_seguridad.nombre_propietario_trailer);
                            $(`#ptcdocumento`).html(data.ver_seguridad.documento_propietario_trailer);
                            $(`#estado_tercero_pro_trailer`).html('<i class="fas fa-user-check"></i> Tercero Pendiente');
                            // $(`#estado_tercero_pro_trailer`).css('backgroundColor', '#FFFFFF');
                        }
                    } else {
                        // console.log('Sin pripietario de trailer');
                        $(`#ptcondu`).html('No Aplica');
                        // $(`#ptcondu`).css('backgroundColor', '#FFFFFF');
                        $(`#ptcondu`).css('Color', '#000000');
                        // $(`#ptcdocumento`).css('backgroundColor', '#FFFFFF');
                        $(`#ptcdocumento`).css('Color', '#000000');
                        $(`#ptcdocumento`).html('No Aplica');
                        $(`#estado_tercero_pro_trailer`).html('No Aplica');
                        // $(`#estado_tercero_pro_trailer`).css('backgroundColor', '#FFFFFF');
                    }

                    $(`#vweb`).html(data.ver_seguridad.web_satelital);
                    $(`#vwuser`).html(data.ver_seguridad.usuario_satelital);
                    $(`#vwclave`).html(data.ver_seguridad.clave_satelital);
                    $(`#vuser`).html(data.ver_seguridad.usuario);

                    // Listar Referencias
                    $(`#consulta_referencia`).html('');

                    if (data.resultado_referencias) {
                        data.resultado_referencias.forEach(function (element) {
                            $(`#consulta_referencia`).append(
                                `<tr>
                                        <td style="padding: 1px; width: auto; white-space: nowrap;">${element.nombre_empresa}</td>
                                        <td style="padding: 1px; width: auto; white-space: nowrap;">${element.fecha_ingreso ?? '-'}</td>
                                        <td style="padding: 1px; width: auto; white-space: nowrap;">${element.fecha_retiro ?? '-'}</td>
                                        <td style="padding: 1px; width: auto; white-space: nowrap;">${element.persona_contacto}</td>
                                        <td style="padding: 1px; width: auto; white-space: nowrap;">${element.celular}</td>
                                        <td style="padding: 1px; width: auto; white-space: nowrap;">${element.cargo}</td>
                                    </tr>`,
                            );
                        });
                    } else {
                        $(`#consulta_referencia`).html(
                            `<tr>
                                    <td></td>
                                    <td></td>
                                    <td>No hay Referencias</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>`,
                        );
                    }

                    $(`#consulta_tbservicio`).html('');

                    if (data.resultado_preestudio) {
                        data.resultado_preestudio.forEach(function (element) {
                            $(`#consulta_tbservicio`).append(
                                ` <tr>
                                <td style="padding: 1px; width: auto; white-space: nowrap;">${element.nundoc_solicitud}</td>
                                <td style="padding: 1px; width: auto; white-space: nowrap;">${element.nombre_cliente}</td>
                                <td style="padding: 1px;">${element.orige} - ${element.dest}</td>
                                <td style="padding: 1px; width: auto; white-space: nowrap;">${element.peso_kg} / ${element.tipo_vehiculo}</td>
                                <td style="padding: 1px; width: auto; white-space: nowrap;">${element.usuario_auditor}</td>
                                <td style="padding: 1px; width: auto; white-space: nowrap;">${element.fecha} - ${element.hora}</td>
                            </tr>'`,
                            );
                        });
                    }

                    $(`#consulta_documentos`).html('');
                    if (data.resultado_documentos) {
                        data.resultado_documentos.forEach(function (element, index) {
                            $(`#consulta_documentos`).append(
                                `<tr>
                                        <td style="padding: 1px; width: auto; white-space: nowrap;">${element.tipo_hv}</td>
                                        <td style="padding: 1px; width: auto; white-space: nowrap;">${element.clase}</td>
                                        <td style="padding: 1px; width: auto; white-space: nowrap;"> <a href="#" onclick="abrir_fotos('${element.ruta}' , '${element.nombre_archivo}')" class="cell-detail hint--top-left" data-hint="">
                                        <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="Documento"></span>
                                        </a></td>
                                        <td style="padding: 1px; width: auto; white-space: nowrap;">${element.usuario}</td>
                                        <td style="padding: 1px; width: auto; white-space: nowrap;">${element.fecha} - ${element.hora}</td>
                                    </tr>`,
                            );
                        });
                    }
                } else {
                    alert('Error de operación');
                }
            })
            .catch(error => {
                // alert(error); 3
            });

        // Actualizar campos
        let formdata = new FormData();
        formdata.append('placa', Placa);
        formdata.append('solicitud', PreestudioId);

        await fetch($('#base_url').val() + 'validacionparametros/vasolicitud_preestudio', {
            method: 'POST',
            cache: 'no-cache',
            body: formdata,
        })
            .then(response => response.json())
            .then(function (data) {
                if (data) {
                    var z = 0;
                    $(`#consulta_datoupdate`).html('');
                    data.forEach(function (element, index) {
                        z++;
                        $(`#consulta_datoupdate`).append(
                            ` <tr>
                                    <td> ${z}</td>
                                    <td>${element.tipo_hv}</td>
                                    <td>${element.tipo_campo} </td>
                                    <td> ${element.info_campo} </td>
                                    <td>${element.usuario}</td>
                                    <td> ${element.fecha} / ${element.hora} </td>
                                </tr>`,
                        );
                    });
                } else {
                    $(`#consulta_datoupdate`).append(
                        `<tr>
                                <td></td>
                                <td></td>
                                <td>No hay Referencias</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>`,
                    );
                }
            })
            .catch(error => {
                alert(error);
            });

        // Documentos campos
        let formdatadocumento = new FormData();
        formdatadocumento.append('placa', Placa);
        formdatadocumento.append('solicitud', PreestudioId);

        await fetch($('#base_url').val() + 'validacionparametros/Documentos_Actualizar', {
            method: 'POST',
            cache: 'no-cache',
            body: formdatadocumento,
        })
            .then(response => response.json())
            .then(function (data) {
                if (data) {
                    data.resultado_documento_actualizar.forEach(function (element, index) {
                        $(`#consulta_datoupdate`).append(
                            `<tr>
                                    <td>${element.tipo_hv}</td>
                                    <td>${element.clase}</td>
                                    <td> 
                                        <a href="#" onclick="abrir_fotos('${element.ruta}' , '${element.nombre_archivo}')" class="cell-detail hint--top-left" data-hint="">
                                            <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="Documento"></span>
                                        </a>
                                    </td>
                                    <td>${element.usuario}</td>
                                    <td>${element.fecha} - ${element.hora}</td>
                                </tr>`,
                        );
                    });
                } else {
                    $(`#consulta_datoupdate`).append(
                        `<tr>
                                <td></td>
                                <td></td>
                                <td>No hay Documentos</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>`,
                    );
                }
            })
            .catch(error => {
                alert(error);
            });

        CargarRespuestaSeguridad(Placa, PreestudioId);

    } catch (error) {
        console.error('Error cargando vista:', error);
        document.querySelector(contenedor).innerHTML = `
      <div class="alert alert-danger p-3">Error cargando la vista del estudio.</div>`;
    }
}

async function cargarRespuestasOperaciones(solicitudId) {
    try {
        const response = await fetch(`${$('#base_url').val()}validacionparametros/consultar_respuesta_operaciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ idestudio: solicitudId })
        });

        const data = await response.json();

        const tabla = document.getElementById(`tbr_opera`);
        tabla.innerHTML = '';

        if (data && data.respuesta_operaciones.length > 0) {
            data.respuesta_operaciones.forEach(element => {
                let archivoHTML;

                if (!element.nom_archivo) {
                    archivoHTML = `<label>Sin archivo</label>`;
                } else {
                    const icono = obtenerIconoArchivo(element.nom_archivo);
                    archivoHTML = `
                        <a href="javascript:void(0);" class="cell-deta" onclick="abrir_fotos('${element.archivo}', '${element.nom_archivo}')" data-hint="">
                            ${icono}
                        </a>
                    `;
                }

                tabla.innerHTML += `
                    <tr>
                        <td style="width: auto; white-space: nowrap; " class='text-center'>${element.estudio_letra}</td>
                        <td style="width: auto; white-space: nowrap; " class='text-center'>${element.fecha}</td>
                        <td style="width: auto; white-space: nowrap; " class='text-center'>${element.hora}</td>
                        <td class='text-center'>${element.nota}</td>
                        <td style="width: auto; white-space: nowrap; " class='text-center'>${archivoHTML}</td>
                    </tr>`;
            });

        } else {
            tabla.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center;"><b>Sin respuesta de operaciones</b></td>
            </tr>`;
        }
    } catch (error) {
        const tabla = document.getElementById(`tbr_opera`);
        console.error('Error al consultar respuestas de operaciones:', error);
        tabla.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; color: red;"><b>Error al cargar respuestas</b></td>
        </tr>`;
        reject(error);
    }
}

async function CargarRespuestaSeguridad(Placa, SolicitudId) {
    let data = new FormData();
    data.append('placa', Placa);
    data.append('solicitud', SolicitudId);

    await fetch($('#base_url').val() + 'validacionparametros/consultar_respuesta_seguridad', {
        method: 'POST',
        cache: 'no-cache',
        body: data,
    })
        .then(response => response.json())
        .then(function (data) {
            $(`#respuestas_seguridad`).html('');
            if (data.length > 0) {
                // Limpiar y listar respuestas

                data.forEach(function (element) {
                    const causa = element.respuesta ?? '';
                    const token = element.token ?? '';
                    const fechaExp = element.token_valido ?? '';

                    $(`#rplaca`).html(Placa);
                    $(`#token`).html(token);
                    $(`#tokenval`).val(token);
                    $(`#fechaexpiracion`).html(fechaExp);

                    $(`#respuestas_seguridad`).append(`
                    <tr>
                        <td style="width: auto; white-space: nowrap;">${element.estado}</td>
                        <td style="width: auto; white-space: nowrap;">${element.observacion}</td>
                        <td style="width: auto; white-space: nowrap;">${element.usuario}</td>
                        <td style="width: auto; white-space: nowrap;">${element.fecha} - ${element.hora}</td>
                    </tr>
                    `);
                });

            } else {
                $(`#respuestas_seguridad`).append(`
                    <tr>
                        <td class='text-center' colspan='4'>No hay Respuesta de seguridad</td>
                    </tr>
                `);
            }
        })
        .catch(error => {
            // alert(error); 2
        });

}

async function guardar_respuesta(EstudioId) {
    let datos = new FormData();
    const archivoInput = document.getElementById(`op_archivo`);
    const archivo = archivoInput.files[0];

    const nestudio = $(`#op_nestudio`).val();
    const estudio = $(`#op_estudio`).val();
    const ntipo = $(`#op_ntipo`).val();
    const rta = $(`#op_respuesta`).val();
    const nom = $(`#op_nomarchivo`).val();

    datos.append('op_archivo', archivo);
    datos.append('nestudio', nestudio);
    datos.append('ntipo', ntipo);
    datos.append('rta', rta);
    datos.append('nomarchivo', nom);
    datos.append('estudio', estudio);

    try {
        const response = await fetch($('#base_url').val() + 'validacionparametros/registrar_respuesta_operacion', {
            method: 'POST',
            body: datos,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
            cache: 'no-cache',
        });

        const data = await response.json();

        if (data && data.numero === 200) {
            await Swal.fire({
                title: '¡Éxito!',
                html: data.mensaje,
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });

            // Ocultar caja
            const caja = document.getElementById(`caja_rtaopera`);
            if (caja) caja.style.display = 'none';

            // Limpiar campos
            archivoInput.value = '';
            $(`#op_nestudio`).val('');
            $(`#op_estudio`).val('');
            $(`#op_ntipo`).val('');
            $(`#op_respuesta`).val('');
            $(`#op_nomarchivo`).val('');

            // Recargar tabla o datos
            tb_respuestas_op(nestudio);

        } else {
            await Swal.fire({
                title: 'Error',
                html: data.mensaje || 'Ocurrió un error al guardar la respuesta.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        await Swal.fire({
            title: 'Error de conexión',
            text: 'Hubo un problema al enviar la solicitud. Inténtalo nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

function tb_respuestas_op(EstudioId) {
    // const idstu = $('#op_nestudio').val();
    const dato = { idestudio: EstudioId };

    $.ajax({
        url: `${$('#base_url').val()}validacionparametros/consultar_respuesta_operaciones`,
        type: 'POST',
        data: dato,
        dataType: 'json',
        success: function (data) {
            $(`#tbr_opera`).html('');

            if (data) {
                data.respuesta_operaciones.forEach((element, index) => {
                    let doc = '';

                    if (!element.nom_archivo) {
                        doc = `<label>Sin archivo</label>`;
                    } else {
                        const icono = obtenerIconoArchivo(element.nom_archivo);
                        doc = `
                            <a href="javascript:void(0);" class="cell-deta" onclick="abrir_fotos('${element.archivo}', '${element.nom_archivo}')" data-hint="">
                                ${icono}
                            </a>
                        `;
                    }

                    $(`#tbr_opera`).append(`
                        <tr>
                            <td style="width: auto; white-space: nowrap; " class='text-center'>${element.estudio_letra}</td>
                            <td style="width: auto%; white-space: nowrap; " class='text-center'>${element.fecha}</td>
                            <td style="width: auto; white-space: nowrap; " class='text-center'>${element.hora}</td>
                            <td  class='text-center'>${element.nota}</td>
                            <td style="width: auto; white-space: nowrap; " class='text-center'>${doc}</td>
                        </tr>
                    `);
                });
            } else {
                $(`#tbr_opera`).append(`
                    <tr>
                        <td colspan="5" style="text-align: center;"><b>Sin respuesta de operaciones</b></td>
                    </tr>
                `);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error tabla operaciones respuestas');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
    });
}

function validarExtension(fic, SolicitudId) {
    var input = document.getElementById(`op_archivo`); // Reemplaza 'tuInputFile' con el ID de tu input file
    var archivos = input.files[0]
    // var archivos = input.files;
    if (archivos) {
        // Lista de extensiones permitidas
        var extensionesPermitidas = ["pdf", "jpg", "jpeg", "png", "webp"]; // Lista de extensiones permitidas
        // Obtener el nombre del archivo del input
        const archivo = input.value;
        // var archivos = licencia_conductor.files[0];
        // Obtener la extensión del archivo
        const extension = archivo.split('.').pop().toLowerCase(); // Obtiene la última parte después del punto y la convierte a minúscula
        // Verificar si la extensión está en la lista de permitidas
        if (extensionesPermitidas.includes(extension)) {
            console.log('Extensión permitida: ' + extension);
            // Verifica el tamaño del archivo (en este caso, máximo 2MB)
            var maxSize = 2 * 1024 * 1024; // 2 MB = 2,097,152 bytes
            if (archivos.size > maxSize) {
                // alert("El archivo no debe superar el tamaño de 2MB.");
                Swal.fire({
                    title: "Mensaje!",
                    text: "El archivo no debe superar el tamaño de 2MB.",
                    icon: "warning"
                });

                $(`#op_nomarchivo`).val('');
                input.value = '';
            } else {
                fic = fic.split("\\");
                if (fic == "" || fic == null) {
                    $(`#op_nomarchivo`).val("");
                } else {
                    $(`#op_nomarchivo`).val(fic[fic.length - 1]);
                }
            }
            return true;
        } else {
            // alert("Extensión de archivo no permitida. Por favor, selecciona un archivo con una de las siguientes extensiones: " +
            //     extensionesPermitidas.join(", "),
            // );
            Swal.fire({
                title: "Mensaje!",
                text: `Extensión de archivo no permitida. Por favor, selecciona un archivo con una de las siguientes extensiones: ${extensionesPermitidas.join(", ")}`,
                icon: "warning"
            });
            input.value = ''; // Vaciar el campo para evitar cargar el archivo
            document.getElementById(`#op_nomarchivo`).value = ''; // Vaciar el campo para evitar cargar el archivo
            return false;
        }
    }
}

async function push(nestudio, estudio, ntipo, rta, placa_push, nombre_push, num_solicitud_push) {
    Push.Permission.request();
    Push.create('Respuesta de operaciones al proceso ' + nestudio, {
        body: 'El proceso ' + nestudio + ' Con la respuesta: ' + rta + ' Tipo ' + ntipo,
        icon: $('#base_url').val() + 'public/img/logo.png',
        timeout: 2500000,
        vibrate: [100, 100, 100],
        onClick: function () {
            window.location = $('#base_url').val() + 'preestudiov/nacional_preestudio/?idmenu=1';
            console.log(this);
        },
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
    var opcionesVentana = 'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
    // Utiliza window.open para abrir la nueva ventana
    window.open(url, name, opcionesVentana);
}

function obtenerIconoArchivo(nombreArchivo) {
    if (!nombreArchivo) return '<span class="fas fa-file text-secondary" title="Archivo"></span>';

    const ext = nombreArchivo.split('.').pop().toLowerCase();

    switch (ext) {
        case 'pdf':
            return '<span class="fas fa-file-pdf text-danger" title="PDF"></span>';
        case 'doc':
        case 'docx':
            return '<span class="fas fa-file-word text-primary" title="Word"></span>';
        case 'xls':
        case 'xlsx':
            return '<span class="fas fa-file-excel text-success" title="Excel"></span>';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return '<span class="fas fa-file-image text-info" title="Imagen"></span>';
        case 'zip':
        case 'rar':
            return '<span class="fas fa-file-archive text-warning" title="Archivo comprimido"></span>';
        case 'txt':
            return '<span class="fas fa-file-alt text-muted" title="Texto"></span>';
        default:
            return '<span class="fas fa-file text-secondary" title="Archivo"></span>';
    }
}

//Registrara la cancelacion del estudio de seguridad
async function registrar_cancelacion(SolicitudId) {
    try {
        let data = new FormData();
        data.append('preestudio', document.getElementById(`cancela_prestudio${SolicitudId}`).value);
        data.append('placa', document.getElementById(`cancela_placa${SolicitudId}`).value);
        data.append('motivo', document.getElementById(`cancela_motivo${SolicitudId}`).value);
        data.append('anotacion', document.getElementById(`cancela_nota${SolicitudId}`).value);
        data.append('accion_actividad', document.getElementById(`accion_actividad${SolicitudId}`).value);
        data.append('estudioc', document.getElementById(`estudioc${SolicitudId}`).value);
        data.append('vehiculo_cancelar', document.getElementById(`vehiculo_cancelar${SolicitudId}`).value);
        data.append('coductor_cancelar', document.getElementById(`coductor_cancelar${SolicitudId}`).value);

        await fetch($('#base_url').val() + 'validacionparametros/Cancelacion_preestudio', {
            method: 'POST',
            cache: 'no-cache',
            body: data,
        })
            .then(response => {
                if (!response.ok) throw new Error(response.statusText);
                return response.json();
            })
            .then(function (data) {
                if (data) {
                    Swal.fire({
                        title: "Mensaje!",
                        text: "Realizo cancelación exitosamente!",
                        icon: "success"
                    });
                    myOffcanvas.hide();
                    listar_solicitudes_operaciones();
                } else {
                    Swal.fire({
                        title: "Mensaje!",
                        text: "Error en la cancelación!",
                        icon: "error"
                    });
                }
            })
            .catch(error => {
                // alert(error);
                Swal.fire({
                    title: "Mensaje!",
                    text: error,
                    icon: "error"
                });
            });
    } catch (error) {
        console.log(error);
    }
}

function CrearBadge(Estado) {
    // estados normales
    let status_es = '';
    switch (Estado) {
        case 'Aprobado':
            status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Aprobado</span>";
            break;
        case 'Pendiente':
            status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Pendiente</span>";
            break;
        case 'vencida':
            status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Vencido</span>";
            break;
        case 'pendiente_iniciar':
            status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Pendiente Iniciar</span>";
            break;
        case 'iniciado':
            status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Iniciado</span>";
            break;
        case 'Rechazado':
            status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Rechazado</span>";
            break;
        case 'cancelado':
        case 'Cancelado':
            status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Cancelado</span>";
            break;
        case 'Rechazado_modificar':
            status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Rechazado para modificar</span>";
            break;
        case 'Aceptado':
            status_es = `<span class='fs-10 badge badge-phoenix badge-phoenix-success'>${Estado}</span>`;
            break;
        case 'No aceptado':
            status_es = `<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>${Estado}</span>`;
            break;
    }
    return status_es;
}

async function Hojas_de_vida(prefiltro_id, placas, conductor, propietario, tenedor, propietario_trailer, trailer) {
    const cuerpo = $(`#cuerpo_valida`);
    cuerpo.html('');

    const crearFila = (label, existe, obligatorio, mensaje) => {
        let clase = 'table-secondary';
        let icono = '<span class="fas fa-minus-circle text-secondary"></span>';
        let texto = 'Dato no obligatorio';

        if (existe) {
            clase = 'table-success';
            icono = '<span class="fas fa-check-circle text-success"></span>';
            texto = `Existe ${mensaje}`;
        } else if (!existe && obligatorio) {
            clase = 'table-danger';
            icono = '<span class="fas fa-times-circle text-danger"></span>';
            texto = `NO existe ${mensaje}`;
        }

        return `
            <tr class="${clase}">
                <td style="width: auto; white-space: nowrap;" style="white-space: nowrap;">${label}</td>
                <td style="width: auto; white-space: nowrap;">${existe ? 'SI' : (obligatorio ? 'NO' : 'Opcional')}</td>
                <td style="width: auto; white-space: nowrap;">${texto}</td>
                <td style="width: auto; white-space: nowrap;">${icono}</td>
            </tr>
        `;
    };

    return new Promise(resolve => {
        setTimeout(() => {
            let data = new FormData();
            data.append('placa', placas);
            data.append('conductor', conductor);
            data.append('propietario', propietario);
            data.append('tenedor', tenedor);
            data.append('propietario_trailer', propietario_trailer);
            data.append('trailer', trailer);

            fetch($('#base_url').val() + 'validacionparametros/Estados_preestudio', {
                method: 'POST',
                cache: 'no-cache',
                body: data,
            })
                .then(response => response.json())
                .then(function (data) {
                    cuerpo.html('');

                    const entidades = [
                        { key: 'respuesta_propietario', label: 'Propietario', obligatorio: true, mensaje: 'un propietario creado con este documento' },
                        { key: 'respuesta_tenedor', label: 'Tenedor', obligatorio: true, mensaje: 'un tenedor creado con este documento' },
                        { key: 'respuesta_conductor', label: 'Conductor', obligatorio: true, mensaje: 'un conductor creado con este documento' },
                        { key: 'respuesta_vehiculo', label: 'Vehículo', obligatorio: true, mensaje: 'una hoja de vida vehicular creada con esta placa' },
                        { key: 'respuesta_propietario_trailer', label: 'Propietario Trailer', obligatorio: propietario_trailer ? true : false, mensaje: 'un propietario del trailer creado (opcional)' },
                        { key: 'respuesta_trailer', label: 'Trailer', obligatorio: trailer ? true : false, mensaje: 'una hoja de vida del trailer creada (opcional)' },
                    ];

                    entidades.forEach(ent => {
                        const existe = data[ent.key] && data[ent.key] !== false;
                        const fila = crearFila(ent.label, existe, ent.obligatorio, ent.mensaje);
                        cuerpo.append(fila);
                    });
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Error',
                        text: 'Ocurrió un error al consultar las hojas de vida: ' + error,
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                });

            resolve();
        }, 1000);
    });
}

async function Listar_datos_prefiltro_nuevo_recurso(solicitud_id, placa) {
    let data = new FormData();
    data.append('solicitud_id', solicitud_id);
    fetch($('#base_url').val() + 'validacionparametros/verificar_datos_nuevos', {
        method: 'POST',
        cache: 'no-cache',
        body: data,
    })
        .then(response => response.json())
        .then(function (data) {
            if (data) {
                var btn_validar = document.getElementById(`btn_validar_datos_prefiltro`);

                // Cambiar colores y textos según estado
                const estadoEl = document.getElementById(`estado_prefiltro_recurso_nuevo`);
                const tokenEl = document.getElementById(`token_prefiltro_nuevo`);
                const vigenciaEl = document.getElementById(`vigencia_token_prefiltro_nuevo`);
                const estadoTokenEl = document.getElementById(`estado_token_prefiltro_nuevo`);
                const botonValidar = document.getElementById(`boton-validar`);

                function resetToken() {
                    tokenEl.innerHTML = 'Sin respuesta';
                    vigenciaEl.innerHTML = 'Sin respuesta';
                    estadoTokenEl.innerHTML = 'Sin respuesta';
                }

                if (data.estado_prefiltro === 'Pendiente') {
                    estadoEl.innerHTML = data.estado_prefiltro;
                    estadoEl.style.backgroundColor = '#E4A11B';
                    estadoEl.style.color = '#FFFFFF';
                    resetToken();
                    botonValidar.style.display = 'none';
                } else if (data.estado_prefiltro === 'Iniciado') {
                    estadoEl.innerHTML = data.estado_prefiltro;
                    estadoEl.style.backgroundColor = '#54B4D3';
                    estadoEl.style.color = '#FFFFFF';
                    resetToken();
                    botonValidar.style.display = 'none';
                } else if (data.estado_prefiltro === 'Rechazado') {
                    estadoEl.innerHTML = data.estado_prefiltro;
                    estadoEl.style.backgroundColor = '#DC4C64';
                    estadoEl.style.color = '#FFFFFF';
                    resetToken();
                    botonValidar.style.display = 'none';
                } else if (data.estado_prefiltro === 'Aprobado') {
                    estadoEl.innerHTML = data.estado_prefiltro;
                    estadoEl.style.backgroundColor = '#14A44D';
                    estadoEl.style.color = '#FFFFFF';
                    if (data.token_actual) {
                        tokenEl.innerHTML = data.token_actual;
                        vigenciaEl.innerHTML = data.fecha_vigencia;
                        estadoTokenEl.innerHTML = data.estado_token;
                        btn_validar.setAttribute('data-token', data.token_actual);
                        btn_validar.setAttribute('data-estado', data.estado_token);
                        btn_validar.setAttribute('data-estudio', data.id_estudio);
                        botonValidar.style.display = 'block';
                    } else {
                        btn_validar.setAttribute('data-token', 'Sin respuesta');
                        btn_validar.setAttribute('data-estado', 'Sin respuesta');
                        btn_validar.setAttribute('data-estudio', 'Sin respuesta');
                        botonValidar.style.display = 'none';
                        resetToken();
                    }
                }

                // Datos generales
                // document.getElementById(`num_solicitud`).innerHTML = data.id_estudio;
                // document.getElementById(`placa_solicitud`).innerHTML = data.placa_vehiculo;
                // document.getElementById(`solicitud_fecha`).innerHTML = data.fecha;
                // document.getElementById(`solicitud_hora`).innerHTML = data.hora;
                // document.getElementById(`solicitud_user`).innerHTML = data.usuario;

                // Tabla principal de datos
                var tabla_datos = document.getElementById(`tbl_datos`);
                tabla_datos.innerHTML = '';

                // Propietario
                if (data.propietario === '1') {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <th style="font-weight:bold;white-space:nowrap">Nombre Propietario</th>
                        <td>${data.name_propietario}</td>
                        <th style="font-weight:bold;white-space:nowrap">Documento</th>
                        <td>${data.documento_propietario}</td>`;
                    tabla_datos.appendChild(fila);
                    btn_validar.setAttribute('data-propietario', data.documento_propietario);
                } else {
                    btn_validar.setAttribute('data-propietario', 'Sin Datos');
                }

                // Poseedor
                if (data.poseedor === '1') {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <th style="font-weight:bold;white-space:nowrap">Nombre Poseedor</th>
                        <td>${data.name_poseedor}</td>
                        <th style="font-weight:bold;white-space:nowrap">Documento</th>
                        <td>${data.documento_poseedor}</td>`;
                    tabla_datos.appendChild(fila);
                    btn_validar.setAttribute('data-poseedor', data.documento_poseedor);
                } else {
                    btn_validar.setAttribute('data-poseedor', 'Sin Datos');
                }

                // Conductor + referencias laborales
                if (data.conductor === '1') {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <th style="font-weight:bold;white-space:nowrap">Nombre Conductor</th>
                        <td>${data.name_conductor}</td>
                        <th style="font-weight:bold;white-space:nowrap">Documento</th>
                        <td>${data.documento_conductor}</td>`;
                    tabla_datos.appendChild(fila);
                    btn_validar.setAttribute('data-conductor', data.documento_conductor);

                    let tbody = document.getElementById(`referencias_nuevas`);
                    tbody.textContent = '';

                    const refs = [
                        [data.empresa1, data.feca1, data.feca2, data.persona1, data.cel1, data.cargo1],
                        [data.empresa2, data.fecb1, data.fecb2, data.persona2, data.cel2, data.cargo2],
                        [data.empresa3, data.fecc1, data.fecc2, data.persona3, data.cel3, data.cargo3]
                    ];
                    refs.forEach(row => {
                        const tr = document.createElement('tr');
                        row.forEach(cell => {
                            const td = document.createElement('td');
                            td.textContent = cell || '-';
                            tr.appendChild(td);
                        });
                        tbody.appendChild(tr);
                    });
                    document.getElementById(`tbl_referencias`).style.display = '';
                } else {
                    let tbody = document.getElementById(`referencias_nuevas`);
                    tbody.innerHTML = '';
                    document.getElementById(`tbl_referencias`).style.display = 'none';
                    btn_validar.setAttribute('data-conductor', 'Sin Datos');
                }

                // Trailer
                if (data.trailer === '1') {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <th style="font-weight:bold;white-space:nowrap">Placa Trailer</th>
                        <td>${data.placa_trailer}</td>
                        <th style="font-weight:bold;white-space:nowrap">Propietario Trailer</th>
                        <td>${data.name_propietario_trailer}</td>
                        <th style="font-weight:bold;white-space:nowrap">Documento Propietario Trailer</th>
                        <td>${data.documento_propi_trailer}</td>`;
                    tabla_datos.appendChild(fila);
                    btn_validar.setAttribute('data-propietarioTrailer', data.documento_propi_trailer);
                } else {
                    btn_validar.setAttribute('data-propietarioTrailer', 'Sin Datos');
                }
            }
        })
        .catch(error => alert(JSON.stringify(error)));

    // Datos actuales
    let datos = new FormData();
    datos.append('placa_consulta', placa);
    fetch($('#base_url').val() + 'validacionparametros/verificar_datos_actuales', {
        method: 'POST',
        cache: 'no-cache',
        body: datos,
    })
        .then(response => response.json())
        .then(function (data) {
            if (data) {
                document.getElementById(`propietario_actual`).innerHTML = data.Propietario;
                document.getElementById(`documento_propietario_actual`).innerHTML = data.cedula_propietario;
                document.getElementById(`tenedor_actual`).innerHTML = data.Poseedor;
                document.getElementById(`documento_tenedor_actual`).innerHTML = data.cedula_poseedor;
                document.getElementById(`conductor_actual`).innerHTML = data.Conductor;
                document.getElementById(`documento_conductor_actual`).innerHTML = data.cedula_conductor;

                if (data.Placa_Trailer) {
                    document.getElementById(`actual_placa_trailer`).innerHTML = data.Placa_Trailer;
                    document.getElementById(`actual_propietario_trailer`).innerHTML = data.Propietario_Trailer;
                    document.getElementById(`documento_actual_propietario_trailer`).innerHTML = data.cedula_propietario_trailer;
                } else {
                    document.getElementById(`actual_placa_trailer`).textContent = 'No Aplica';
                    document.getElementById(`actual_propietario_trailer`).textContent = '';
                    document.getElementById(`documento_actual_propietario_trailer`).textContent = '';
                }

                document.getElementById(`web_satelital`).innerHTML = `<a href="${data.web_satelital}" target="_blank">${data.web_satelital}</a>`;
                document.getElementById(`usuario_satelital`).innerHTML = data.usuario_satelital;
                document.getElementById(`clave_satelital`).innerHTML = data.clave_satelital;
            }
        })
        .catch(error => alert(error));

    // Logs
    let formdatos = new FormData();
    formdatos.append('placa_consulta', placa);
    formdatos.append('solicitud_id', solicitud_id);
    fetch($('#base_url').val() + 'validacionparametros/listar_logs_prefiltro_nuevo', {
        method: 'POST',
        cache: 'no-cache',
        body: formdatos,
    })
        .then(response => response.json())
        .then(function (data) {
            if (data) {
                var ul = document.getElementById(`lista_log_estdo`);
                ul.innerHTML = '';

                data.forEach(element => {
                    const li = document.createElement('li');
                    li.classList.add('p-2', 'mb-2', 'rounded', 'shadow-sm');

                    // Colores según estado
                    let bgColor = '#f8f9fa';
                    if (element.estado === 'Iniciado') bgColor = '#e3f2fd';
                    else if (element.estado === 'Aprobado') bgColor = '#d4edda';
                    else if (element.estado === 'Rechazado') bgColor = '#f8d7da';
                    else if (element.estado === 'Pendiente') bgColor = '#fff3cd';

                    li.style.backgroundColor = bgColor;
                    li.style.borderLeft = '4px solid #0d6efd';
                    li.style.fontSize = '13px';

                    li.innerHTML = `
                        <div class="fw-bold mb-1 text-dark">
                        Estado: <span class="text-primary">${element.estado}</span>
                        </div>
                        <div class="text-muted" style="font-size:12px;">
                        <strong>Observación:</strong> ${element.observacion || 'Sin observación'}<br>
                        <strong>Usuario:</strong> ${element.usuario} <br>
                        <strong>Fecha:</strong> ${element.fecha} ${element.hora}
                        </div>
                    `;
                    ul.appendChild(li);
                });
            }
        })
        .catch(error => alert(error));
}

// Construir un OffCanvas
// Constructor del Offcanvas Dinámico
function DynamicOffcanvas(options) {
    // Configuración predeterminada
    var defaults = {
        id: 'dynamicOffcanvas',
        title: 'Default Title',
        content: 'Default Content',
        scroll: true,
        backdrop: false
    };

    // Fusionar opciones con defaults
    this.settings = Object.assign({}, defaults, options);

    // Inicializar
    this.initialize();
}

DynamicOffcanvas.prototype.initialize = function () {
    this.createOffcanvas();
    this.bsOffcanvas = new bootstrap.Offcanvas(this.offcanvasElement);
};

DynamicOffcanvas.prototype.createOffcanvas = function () {
    var offcanvasHTML = `
    <div class="offcanvas offcanvas-end" 
        id="${this.settings.id}" 
        data-bs-scroll="${this.settings.scroll}" 
        data-bs-backdrop="${this.settings.backdrop}"
        data-bs-backdrop="static"
        tabindex="-1" 
        aria-labelledby="${this.settings.id}-label" style="width: 800px;">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title fw-bold" id="${this.settings.id}-label">
            ${this.settings.title}
          </h5>
          <button class="btn-close text-reset" type="button" data-bs-dismiss="offcanvas"></button>
        </div>
      <div class="offcanvas-body">
        ${this.settings.content}
      </div>
    </div>
`;

    var container = document.createElement('div');
    container.innerHTML = offcanvasHTML;
    this.offcanvasElement = container.firstElementChild;
    document.body.appendChild(this.offcanvasElement);
};

DynamicOffcanvas.prototype.updateContent = function (newContent) {
    var body = this.offcanvasElement.querySelector('.offcanvas-body');
    body.innerHTML = newContent;
};

DynamicOffcanvas.prototype.updateTitle = function (newTitle) {
    var title = this.offcanvasElement.querySelector('.offcanvas-title');
    title.innerHTML = newTitle;
};

DynamicOffcanvas.prototype.show = function () {
    this.bsOffcanvas.show();
};

DynamicOffcanvas.prototype.hide = function () {
    this.bsOffcanvas.hide();
};

// Función para codificar en Base64
function codificarBase64(texto) {
    return btoa(texto);
}

// Función para decodificar Base64
function decodificarBase64(textoCodificado) {
    return atob(textoCodificado);
}