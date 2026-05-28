window.VENTANA = null;
window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID de la ventana a la variable global
    const offcanvasElement = document.getElementById('offcanvasGestion'); // Usando tu ID de offcanvas
    offcanvasElement.addEventListener('shown.bs.offcanvas', async function () {
        // Asegúrate de que los municipios se carguen si no lo has hecho
        // Puedes llamar a await Municipios(); aquí si lo necesitas

        // Inicializa Select2 SOLO cuando el offcanvas esté COMPLETAMENTE visible
        $('#municipio').select2({
            dropdownParent: $('#offcanvasGestion'), // 👈 CRUCIAL para Offcanvas
            placeholder: 'Seleccione una opción',
            allowClear: true
        });
    });

    let campoFechaInicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`);
    let campoFechaFinal = document.getElementById(`campo-${window.VENTANA}-fecha_final`);

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
    ListarContenedoresVacios(fecha_inicial, fecha_final);

    document.addEventListener('click', async e => {

        if (e.target.matches(`#campo-${window.VENTANA}-filtrar`) || e.target.matches(`#campo-${window.VENTANA}-filtrar *`)) {
            let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
            let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
            ListarContenedoresVacios(fecha_inicial, fecha_final);
        }

        if (e.target.matches(`#btn-modificar-contenedor`) || e.target.matches(`#btn-modificar-contenedor *`)) {
            const BotonModificar = e.target.closest('#btn-modificar-contenedor');
            let SolicitudId = BotonModificar.getAttribute(`data-SolicitudId`);
            let DiasVencidos = BotonModificar.getAttribute(`data-DiasVencidos`);
            let FechaVencimiento = BotonModificar.getAttribute(`data-FechaVencimiento`);
            let EstadoGestion = BotonModificar.getAttribute(`data-EstadoGestion`);
            let MismoVehiculo = BotonModificar.getAttribute(`data-MismoVehiculo`);
            let Placa = BotonModificar.getAttribute(`data-Placa`);
            let Manifiesto = BotonModificar.getAttribute(`data-Manifiesto`);
            let NumdocSolicitud = BotonModificar.getAttribute(`data-NumdocSolicitud`);
            // let EstadoGestion = BotonModificar.getAttribute(`data-EstadoGestion`);

            document.getElementById('btnGuardarGestion').setAttribute('data-SolicitudId', SolicitudId);
            document.getElementById('btnGuardarGestion').setAttribute('data-DiasVencidos', DiasVencidos);
            document.getElementById('btnGuardarGestion').setAttribute('data-FechaVencimiento', FechaVencimiento);

            document.getElementById(`fecha_actual`).value = FechaVencimiento;
            // document.getElementById(`flexSwitchCheckDevolcucion`).value = EstadoGestion;
            const checkboxDevolucion = document.getElementById(`flexSwitchCheckDevolcucion`);

            if (checkboxDevolucion) {
                // 🛑 Lógica para SELECCIONAR Y DESHABILITAR

                if (MismoVehiculo === 'No') {
                    // Si la condición se cumple, marcamos y deshabilitamos
                    checkboxDevolucion.checked = true;
                    checkboxDevolucion.disabled = true; // Establece el atributo disabled

                } else {
                    // Si la condición NO se cumple, aseguramos que esté desmarcado y habilitado
                    checkboxDevolucion.checked = false;
                    checkboxDevolucion.disabled = false;
                }
            }

            document.getElementById(`numdoc_solicitud`).value = NumdocSolicitud;
            document.getElementById(`manifiesto`).value = Manifiesto;
            document.getElementById(`nueva_placa`).value = Placa;
            document.getElementById(`estado_gestion`).value = EstadoGestion;

            Municipios();

            // const result = await Swal.fire({
            //     title: '¿Seguro?',
            //     text: '¿Esta seguro de completar este contenedor vacio?',
            //     icon: 'question',
            //     showCancelButton: true,
            //     confirmButtonColor: '#3B71CA',
            //     cancelButtonColor: '#9FA6B2',
            //     confirmButtonText: 'Aceptar',
            //     cancelButtonText: 'Cancelar',
            //     customClass: {
            //         popup: 'swal2-custom-font',
            //     },
            // });

            // if (result.isConfirmed) {
            //     try {
            //         let data = new FormData();
            //         data.append('SolicitudId', SolicitudId);
            //         data.append('estado', 'Completado');
            //         data.append('DiasVencidos', DiasVencidos);

            //         await fetch($('#base_url').val() + 'prefiltro_nacional/GuardarOperacionContenedor', {
            //             method: 'POST',
            //             cache: 'no-cache',
            //             body: data,
            //         })
            //             .then(response => {
            //                 if (!response.ok) throw new Error(response.statusText);
            //                 return response.json();
            //             })
            //             .then(function (data) {
            //                 if (data.status === true) {
            //                     Swal.fire({
            //                         title: "Mensaje!",
            //                         text: data.mensaje,
            //                         icon: "success"
            //                     });
            //                     let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
            //                     let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
            //                     ListarContenedoresVacios(fecha_inicial, fecha_final);
            //                 } else {
            //                     Swal.fire({
            //                         title: "Mensaje!",
            //                         text: data.mensaje,
            //                         icon: "error"
            //                     });
            //                 }
            //             })
            //             .catch(error => {
            //                 Swal.fire({
            //                     title: "Mensaje!",
            //                     text: error,
            //                     icon: "error"
            //                 });
            //             });
            //     } catch (error) {
            //         console.log(error);
            //     }
            // }
        }

        //GUardar gestion
        if (e.target.matches(`#btnGuardarGestion`) || e.target.matches(`#btnGuardarGestion *`)) {
            let Boton = e.target.closest(`#btnGuardarGestion`);
            let Solicitud_Id = Boton.getAttribute('data-SolicitudId');
            let DiasVencidos = Boton.getAttribute('data-DiasVencidos');
            let FechaVencimiento = Boton.getAttribute('data-FechaVencimiento');
            let EstadoGestion = document.getElementById('estado_gestion').value;
            let FechaDevolucion = document.getElementById('fecha_devolucion').value;
            let Patio = document.getElementById('patio').value;
            let Municipio = document.getElementById('municipio').value;
            let Redireccionado = document.getElementById('flexSwitchCheckRedireccionado');
            let DevolucionMismoVehiculo = document.getElementById('flexSwitchCheckDevolcucion'); // 🛑 Nuevo Check
            let FechaCita = document.getElementById('fecha_cita').value;
            let PatioRedireccion = document.getElementById('patio_redireccion').value;
            let ObservacionGestion = document.getElementById('obsrvacion_gestion').value;

            // OBTENCIÓN DE OBJETOS FILE
            let TirillaFile = document.getElementById('tirilla').files[0];
            let SoporteFile = document.getElementById('soporte').files[0]; // Archivo Soporte (Redireccionado)
            let Solicitud = document.getElementById('numdoc_solicitud').value; // 🛑 Archivo Solicitud
            let Manifiesto = document.getElementById('manifiesto').value; // 🛑 Archivo Manifiesto
            let Placa = document.getElementById('nueva_placa').value; // 🛑 Archivo Placa Nueva

            let FechaVencimientoActual = document.getElementById(`fecha_actual`).value;
            let FechaVencimientoNueva = document.getElementById(`fecha_nueva`).value;

            let errores = [];

            // ------------------------------------------------------------------
            // 🛑 VALIDACIONES OBLIGATORIAS (BASE)
            // ------------------------------------------------------------------
            if (!EstadoGestion) {
                errores.push('Debe seleccionar un <strong>Estado de gestión</strong>.');
            }

            // if (!TirillaFile) {
            //     errores.push('Debe adjuntar el archivo de <strong>Tirilla</strong>.');
            // }

            if (!ObservacionGestion.trim()) {
                errores.push('Debe diligenciar el campo de <strong>Observaciones</strong>.');
            }

            // ------------------------------------------------------------------
            // 🛑 VALIDACIONES CONDICIONALES (DEVOLUCIÓN MISMO VEHÍCULO)
            // ------------------------------------------------------------------
            if (DevolucionMismoVehiculo.checked) {
                // Si NO es Devolución Mismo Vehículo, los 3 archivos son obligatorios
                if (!Solicitud) {
                    errores.push('Debe adjuntar el archivo de <strong>Solicitud de Servicio</strong>.');
                }
                if (!Manifiesto) {
                    errores.push('Debe adjuntar el archivo de <strong>Manifiesto</strong>.');
                }
                if (!Placa) {
                    errores.push('Debe adjuntar el archivo de <strong>Placa Nueva</strong>.');
                }
            }

            // ------------------------------------------------------------------
            // VALIDACIONES CONDICIONALES (Estado Finalizado)
            // ------------------------------------------------------------------
            if (EstadoGestion === 'Finalizado') {
                if (!FechaDevolucion) {
                    errores.push('Debe seleccionar una <strong>Fecha de devolución</strong>.');
                }
                if (!Patio) {
                    errores.push('Debe seleccionar un <strong>Patio</strong>.');
                }
                if (!Municipio) {
                    errores.push('Debe seleccionar un <strong>Municipio</strong>.');
                }
            }

            // ------------------------------------------------------------------
            // VALIDACIONES CONDICIONALES (Redireccionado)
            // ------------------------------------------------------------------
            if (Redireccionado.checked) {
                if (!FechaCita) {
                    errores.push('Debe seleccionar una <strong>Fecha de cita</strong>.');
                }
                if (!PatioRedireccion) {
                    errores.push('Debe seleccionar un <strong>Patio de redirección</strong>.');
                }
                if (!SoporteFile) {
                    errores.push('Debe adjuntar el archivo de <strong>Soporte</strong>.');
                }
            }

            // ------------------------------------------------------------------
            // MOSTRAR ERRORES O CONTINUAR
            // ------------------------------------------------------------------
            if (errores.length > 0) {
                const listaErrores = errores.map(msg => `<li>${msg}</li>`).join('');
                Swal.fire({
                    title: 'Atención',
                    html: `<ul class="text-start ps-4">${listaErrores}</ul>`,
                    icon: 'warning',
                    confirmButtonText: 'Corregir',
                });
                return;
            }

            // ------------------------------------------------------------------
            // PROCESAMIENTO DE DATOS (Si no hay errores)
            // ------------------------------------------------------------------
            let formdata = new FormData();
            formdata.append('Solicitud_Id', Solicitud_Id);
            formdata.append('EstadoGestion', EstadoGestion);
            formdata.append('FechaDevolucion', FechaDevolucion);
            formdata.append('Patio', Patio);
            formdata.append('Municipio', Municipio);
            formdata.append('Redireccionado', Redireccionado.checked ? 'Si' : 'No');
            formdata.append('DevolucionMismoVehiculo', DevolucionMismoVehiculo.checked ? 'No' : 'Si'); // 🛑 Nuevo
            formdata.append('FechaCita', FechaCita);
            formdata.append('PatioRedireccion', PatioRedireccion);
            formdata.append('ObservacionGestion', ObservacionGestion);
            formdata.append('DiasVencidos', DiasVencidos);
            formdata.append('FechaVencimientoActual', FechaVencimientoActual);
            formdata.append('FechaVencimientoNueva', FechaVencimientoNueva);

            // Añadir archivos condicionalmente
            if (TirillaFile) { formdata.append('Tirilla', TirillaFile); }
            if (SoporteFile) { formdata.append('Soporte', SoporteFile); }
            if (Solicitud) { formdata.append('numdoc_solicitud', Solicitud); } // 🛑 Archivos Devolucion
            if (Manifiesto) { formdata.append('manifiesto', Manifiesto); }
            if (Placa) { formdata.append('nueva_placa', Placa); }

            try {
                await fetch($('#base_url').val() + 'prefiltro_nacional/GuardarOperacionContenedor', {
                    method: 'POST',
                    cache: 'no-cache',
                    body: formdata,
                })
                    // ... (Resto de tu lógica de fetch, promesas y SweetAlert) ...
                    .then(response => {
                        if (!response.ok) throw new Error(response.statusText);
                        return response.json();
                    })
                    .then(function (data) {
                        if (data.status === true) {
                            Swal.fire({
                                title: "Mensaje!",
                                text: data.mensaje,
                                icon: "success",
                                timer: 2000,
                                showConfirmButton: false
                            }).then(() => {
                                const offcanvasEl = document.getElementById('offcanvasGestion');
                                if (offcanvasEl) {
                                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl);
                                    bsOffcanvas.hide();
                                }
                                limpiarFormularioGestion();
                                let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
                                let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
                                ListarContenedoresVacios(fecha_inicial, fecha_final);
                            });

                        } else {
                            Swal.fire({
                                title: "Mensaje!",
                                text: data.mensaje,
                                icon: "error"
                            });
                        }
                    })
                    .catch(error => {
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

        if (e.target.matches(`#btn-cambiar-fecha-entrega`) || e.target.matches(`#btn-cambiar-fecha-entrega *`)) {
            let Boton = e.target.closest(`#btn-cambiar-fecha-entrega`);
            let Solicitud_Id = Boton.getAttribute('data-SolicitudId');
            let FechaVencimiento = Boton.getAttribute('data-FechaVencimiento');
            let DiasVencidos = Boton.getAttribute('data-DiasVencidos');
            document.getElementById(`fecha_actual`).value = FechaVencimiento;
            document.getElementById(`btn-update-fecha-vencimiento`).setAttribute('data-Solicitud_Id', Solicitud_Id);
            document.getElementById(`btn-update-fecha-vencimiento`).setAttribute('data-DiasVencidos', DiasVencidos);
        }

        if (e.target.matches(`#btn-update-fecha-vencimiento`) || e.target.matches(`#btn-update-fecha-vencimiento *`)) {
            let Boton = e.target.closest(`#btn-update-fecha-vencimiento`);
            let Solicitud_Id = Boton.getAttribute('data-Solicitud_Id');
            let DiasVencidos = Boton.getAttribute('data-DiasVencidos');
            let FechaVencimientoActual = document.getElementById(`fecha_actual`).value;
            let FechaVencimientoNueva = document.getElementById(`fecha_nueva`).value;

            // 🎯 Validación de la Fecha Nueva
            if (!FechaVencimientoNueva) {
                Swal.fire('Atención', 'Debe seleccionar una nueva fecha de vencimiento.', 'warning');
                return;
            }

            // Preparar los datos
            const dataToSend = {
                solicitud_id: Solicitud_Id,
                fecha_actual: FechaVencimientoActual, // Puede servir para validación en el backend/histórico
                fecha_nueva: FechaVencimientoNueva,
                dias_vencidos: DiasVencidos,
            };

            try {
                const response = await fetch($('#base_url').val() + 'prefiltro_nacional/actualizarFechaVencimiento', { // 👈 URL al controlador
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                });

                const result = await response.json();

                if (!response.ok) {
                    // Manejar errores HTTP (400, 500, etc.)
                    throw new Error(result.message || 'Error en la respuesta del servidor.');
                }

                if (result.status) {
                    Swal.fire('Éxito', result.message, 'success');
                    // Ocultar modal, recargar la tabla, etc.
                    let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
                    let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
                    ListarContenedoresVacios(fecha_inicial, fecha_final);
                    $(`#verticallyCentered`).modal('hide');
                } else {
                    Swal.fire('Error', result.message, 'error');
                }

            } catch (error) {
                console.error('Fetch error:', error);
                Swal.fire('Error de Conexión', error.message || 'No se pudo completar la operación.', 'error');
            }
        }

        if (e.target.matches(`#btn-historicos`) || e.target.matches(`#btn-historicos *`)) {
            let Boton = e.target.closest(`#btn-historicos`);
            let Solicitud_Id = Boton.getAttribute('data-SolicitudId');

            let formdata = new FormData();
            formdata.append('SolicitudId', Solicitud_Id);

            try {
                const response = await fetch($('#base_url').val() + 'prefiltro_nacional/ConsultarHistoricoContenedor', {
                    // 👈 URL al controlador
                    method: 'POST',
                    body: formdata
                });

                const result = await response.json();

                if (!response.ok) {
                    // Manejar errores HTTP (400, 500, etc.)
                    throw new Error(result.message || 'Error en la respuesta del servidor.');
                }

                // --------------------------------------------------------------------------------

                // Lógica principal de tu código (dentro de tu función asíncrona)
                // ...
                let template = ``;
                const container = document.getElementById('timeline-container');

                if (result.status && result.data && result.data.length > 0) {
                    result.data.forEach(element => {
                        const style = getActionStyle(element.estado_gestion);

                        // 1. Manejo de Redirección (para badge)
                        const redireccionBadge = element.redireccion === 'Si'
                            ? `<span class="badge bg-danger ms-2">Redireccionado</span>`
                            : '';

                        // 2. Enlace de Archivo (Tirilla/Soporte)
                        // const tirillaLink = element.tirilla_soporte
                        //     ? `<a href="${$('#base_url').val()}public/files/contenedores/${element.tirilla_soporte}" target="_blank" class="text-primary fw-semibold text-decoration-none ms-1">Ver Soporte</a>`
                        //     : `<span class="text-muted fst-italic">No adjunto</span>`;

                        // 2. Enlace de Archivo (Tirilla/Soporte)
                        const tirillaLink = element.tirilla_soporte
                            ? `<a href="${$('#base_url').val()}public/files/contenedores/${element.tirilla_soporte}" target="_blank" class="text-primary fw-semibold text-decoration-none ms-1">Ver Tirilla</a>`
                            : `<span class="text-muted fst-italic">No adjunto</span>`;

                        // 3. Documento de Cita (Soporte)
                        // Asumo que tu modelo adjunta la ruta del soporte de cita a element.soporte_cita_red
                        const soporteCitaLink = element.soporte_cita
                            ? `<a href="${$('#base_url').val()}public/files/contenedores/${element.soporte_cita}" target="_blank" class="text-info fw-semibold text-decoration-none ms-1">Ver Documento Cita</a>`
                            : `<span class="text-muted fst-italic">No adjunto</span>`;

                        // 4. Lógica de Redirección Detallada
                        let destinoDetails = `<span class="fw-semibold text-body">Destino:</span> ${element.patio ?? 'N/A'} (${element.ciudad ?? 'N/A'})`;
                        let citaDetails = '';

                        if (element.redireccion === 'Si') {
                            // Si hay redirección, la información cambia y se agregan los detalles de la cita
                            destinoDetails = `
                                <span class="fw-semibold text-danger">DESTINO REDIRECCIONADO:</span>
                                <span class="fst-italic">De ${element.patio ?? 'N/A'} → a <strong>${element.patio_cita ?? 'N/A'}</strong></span>
                            `;

                            citaDetails = `
                                <p class="mb-0">
                                    <span class="fw-semibold text-body">Fecha Cita:</span> ${element.fecha_cita || 'N/A'} 
                                    <span class="fw-semibold text-body ms-3">Soporte Cita:</span> ${soporteCitaLink}
                                </p>
                            `;
                        }

                        template += `
                            <div class="timeline-item">
                                <div class="timeline-dot ${style.dotClass}"></div> 
                                <div class="timeline-content">
                                    
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <h6 class="mb-0 fw-bold">
                                            <i class="${style.icon} me-2 text-primary"></i> 
                                            ${style.title} ${redireccionBadge}
                                        </h6>
                                        <small class="text-muted text-end fw-semibold">
                                            ${element.fecha} ${element.hora}
                                        </small>
                                    </div>

                                    <div class="mb-2 p-2 rounded bg-light border" style="font-size: 0.85rem;">
                                        
                                        <p class="mb-1">
                                            <span class="fw-semibold text-body">Fecha Devolución:</span> 
                                            ${element.fecha_devolucion || '-'}
                                        </p>
                                        
                                        <p class="mb-1">
                                            ${destinoDetails}
                                        </p>
                                        
                                        <p class="mb-1">
                                            <span class="fw-semibold text-body">Soporte Tirilla:</span> 
                                            ${tirillaLink}
                                        </p>
                                        
                                        ${citaDetails} 

                                        <div class="border-top border-translucent border-dashed"></div>
                                        <p class="mb-1">
                                            <span class="fw-semibold text-body">Mismo Vehiculo:</span> 
                                            ${element.mismo_vehiculo === 'Si' ? `<span class="badge badge-phoenix badge-phoenix-success">${element.mismo_vehiculo}</span>` : `<span class="badge badge-phoenix badge-phoenix-warning">${element.mismo_vehiculo || '-'}</span>`}
                                        </p>
                                        <p class="mb-1">
                                            <span class="fw-semibold text-body">Placa:</span> 
                                            ${element.placa || '-'}
                                        </p>
                                        <p class="mb-1">
                                            <span class="fw-semibold text-body">Manifiesto:</span> 
                                            ${element.manifiesto || '-'}
                                        </p>
                                        <p class="mb-1">
                                            <span class="fw-semibold text-body">Solicitud Servicio:</span> 
                                            ${element.numdoc_solicitud || '-'}
                                        </p>
                                    </div>

                                    <p class="text-sm mb-1">
                                        <span class="fw-semibold">Observación:</span> ${element.observacion || 'Sin observaciones.'}
                                    </p>
                                    <small class="text-muted">
                                        Registrado por: <span class="fw-semibold text-dark">${element.usuario}</span>
                                    </small>
                                </div>
                            </div>
                        `;
                    });

                    container.innerHTML = template;

                } else if (result.status) {
                    container.innerHTML = '<div class="alert alert-info border-info-subtle p-2 text-center">No se encontró historial de gestión para esta solicitud.</div>';
                } else {
                    container.innerHTML = `<div class="alert alert-danger p-2">Error al cargar el historial: ${result.message}</div>`;
                }

            } catch (error) {
                console.error('Fetch error:', error);
                Swal.fire('Error de Conexión', error.message || 'No se pudo completar la operación.', 'error');
            }
        }
    });

    // JS
    document.addEventListener('change', async e => {
        // 🛑 Listener para el switch de Devolucion Mismo Vehiculo
        if (e.target.matches(`#flexSwitchCheckDevolcucion`)) {

            // Obtener el estado del checkbox
            const isChecked = e.target.checked;

            // Definir los IDs de los inputs afectados
            const inputsAfectados = [
                '#numdoc_solicitud',
                '#manifiesto',
                '#nueva_placa'
            ];

            // Iterar sobre los inputs para aplicar la lógica
            inputsAfectados.forEach(id => {
                const input = $(id);

                if (isChecked) {
                    // 1. SI ESTÁ SELECCIONADO (Devolución Mismo Vehículo): 
                    // Deshabilitar inputs y remover required (no son necesarios)
                    input.prop('disabled', false);
                    // input.removeAttr('required');

                } else {
                    // 2. SI ESTÁ DESELECCIONADO (Devolución Nuevo Vehículo): 
                    // Habilitar inputs y hacerlos obligatorios (requeridos)
                    input.prop('disabled', true);
                    // input.attr('required', 'required');
                }
            });

            console.log(`Devolución Mismo Vehículo: ${isChecked ? 'Activada (Inputs Deshabilitados)' : 'Desactivada (Inputs Obligatorios)'}`);
        }

        // 🛑 Listener para el switch de Redireccionado
        if (e.target.matches(`#flexSwitchCheckRedireccionado`)) {

            // Obtener el estado del checkbox
            const isChecked = e.target.checked;

            // Definir los IDs de los inputs y selects afectados
            const elementosAfectados = [
                '#fecha_cita',         // input type="date"
                '#soporte',            // input type="file" (Documento Cita)
                '#patio_redireccion'   // select
            ];

            // Iterar sobre los elementos para aplicar la lógica
            elementosAfectados.forEach(id => {
                const elemento = $(id);

                if (isChecked) {
                    // 1. SI ESTÁ SELECCIONADO (Redireccionado): 
                    // Habilitar inputs y hacerlos obligatorios
                    elemento.prop('disabled', false);
                    // elemento.attr('required', 'required');

                } else {
                    // 2. SI ESTÁ DESELECCIONADO (No Redireccionado): 
                    // Deshabilitar inputs y remover required (no son necesarios)
                    elemento.prop('disabled', true);
                    // elemento.removeAttr('required');

                    // Opcional: Limpiar el valor de los campos cuando se desactiva
                    if (id === '#patio_redireccion') {
                        elemento.val('').trigger('change'); // Limpia el select
                    } else {
                        elemento.val(''); // Limpia inputs (fecha, file)
                    }
                }
            });

            console.log(`Redireccionado: ${isChecked ? 'Activado (Campos Obligatorios)' : 'Desactivado (Campos Opcionales/Deshabilitados)'}`);
        }

        // 🛑 Listener para el select de Estado Gestión
        if (e.target.matches(`#estado_gestion`)) {

            const estadoSeleccionado = e.target.value;
            const habilitar = estadoSeleccionado === 'Finalizado';

            // Definir los IDs de los inputs y selects afectados
            const camposDevolucion = [
                '#fecha_devolucion',
                '#patio',
                '#municipio'
            ];

            // Iterar sobre los campos para aplicar la lógica
            camposDevolucion.forEach(id => {
                const elemento = $(id);

                if (habilitar) {
                    // 1. SI ESTÁ 'Finalizado': Habilitar y hacer obligatorios
                    elemento.prop('disabled', false);
                    // elemento.attr('required', 'required');

                } else {
                    // 2. SI NO ES 'Finalizado': Deshabilitar y limpiar
                    elemento.prop('disabled', true);
                    // elemento.removeAttr('required');

                    // Limpiar el valor del campo
                    if (id === '#patio' || id === '#municipio') {
                        // Para selects (opcionalmente con select2), usar trigger('change')
                        elemento.val('').trigger('change');
                    } else {
                        // Para inputs de fecha
                        elemento.val('');
                    }
                }
            });

            // console.log(`Campos de Devolución: ${habilitar ? 'Habilitados y Obligatorios' : 'Deshabilitados'}`);
        }
    });

}

// JS
async function ListarContenedoresVacios(fecha_inicial, fecha_final) {
    $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga

    // Usamos const en lugar de datos = new FormData();
    const datos = new FormData();
    datos.append('fecha_inicial', fecha_inicial);
    datos.append('fecha_final', fecha_final);

    try {
        const response = await fetch($('#base_url').val() + 'prefiltro_nacional/Consultar_Contenedores_Vacios', {
            method: 'POST',
            body: datos,
            cache: 'no-cache',
        });

        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();

        let tbody = document.getElementById('tbl-contenedores-vacios');
        let template = ''; // Variable local para construir todas las filas

        // Limpiamos el tbody antes de empezar, para el caso de que no haya datos.
        tbody.innerHTML = '';

        if (data && data.length > 0) {

            data.forEach(element => {
                let estado = '';
                let estado_contenedor = '';

                // Lógica de Estado (Vencimiento)
                if (element.esta_vencido === 1) {
                    estado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Vencido</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
                } else if (element.esta_vencido === 2) {
                    estado = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">Vence hoy</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
                } else {
                    estado = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">A Tiempo</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
                }

                // Lógica de Estado de la Solicitud de Servicio
                if (element.estado_devolucion === 'Pendiente' || element.estado_devolucion === null) {
                    estado_contenedor = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">Pendiente</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
                } else if (element.estado_devolucion === 'Completado') {
                    estado_contenedor = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">Completado</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
                } else {
                    estado_contenedor = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Vencido</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
                }

                // Concatenación de la nueva fila al TEMPLATE
                template += `
                    <tr>
                        <td class='text-center' style='color:black;width:auto; white-space: nowrap;'>
                            <div class="dropdown">
                                <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${element.tipo_contenedor}</a>
                                <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
                                ${element.estado_devolucion === 'Completado' ? '' : `<a class="dropdown-item fw-bold" href="#" id='btn-modificar-contenedor' data-bs-toggle="offcanvas" data-bs-target="#offcanvasGestion" aria-controls="offcanvasGestion"
                                    data-SolicitudId='${element.nundoc_solicitud}' data-DiasVencidos='${element.dias_vencido}' data-FechaVencimiento='${element.devol_dias}' data-EstadoGestion='${element.estado_gestion}'
                                    data-MismoVehiculo='${element.mismo_vehiculo}' data-Placa='${element.Placa_Devolucion}' data-Manifiesto='${element.manifiesto}' data-NumdocSolicitud='${element.numdoc_Solicitud}'>Gestión Contenedor</a>`}

                                <a class="dropdown-item fw-bold" href="#" id='btn-historicos' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" 
                                    data-SolicitudId='${element.nundoc_solicitud}' data-FechaVencimiento='${element.devol_dias}' data-DiasVencidos='${element.dias_vencido}' data-bs-toggle="modal" data-bs-target="#verticallyCentered">Historicos</a>
                                </div>
                            </div>
                        </td>
                        <td class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.placa}</td>
                        <td class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.Conductor}</td>
                        <td class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.celular}</td>
                        <td class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.Agencia}</td>
                        <td class='text-center' style='color:black;width:auto; white-space: nowrap;'>${estado}</td>
                        <td class='text-center' style='color:black;width:auto; white-space: nowrap;'>${estado_contenedor}</td>
                        <td class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.devol_dias}</td>
                        <td class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.dias_vencido}</td>
                        <td class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.devol_numcont}</td>
                        <td class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.nombre_cliente}</td>
                        <td class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.Municipio}</td>
                        <td class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.devol_direccion}</td>
                    </tr>`;
            });

            // 🛑 ASIGNACIÓN FINAL: Se pinta el tbody una sola vez.
            tbody.innerHTML = template;

        } else {
            // Si no hay datos
            tbody.innerHTML = `<tr><td colspan="15" class="text-muted">No se encontraron contenedores vacíos.</td></tr>`;
        }
    } catch (error) {
        console.error('Error en ListarContenedoresVacios:', error);
        alert('Error de trucaht: ' + error);
    } finally {
        $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga
    }
}

// JS - Función Municipios MODIFICADA (QUITAR Select2 de aquí)
async function Municipios() {
    $('#municipio').empty();

    try {
        const response = await fetch($('#base_url').val() + 'serviciocliente/Consulta_Municipios', {
            method: 'POST',
            cache: 'no-cache'
        });
        const data = await response.json();

        $('#municipio').append('<option value="">Seleccione un municipio</option>');

        data.forEach(function (element) {
            $('#municipio').append(
                `<option value="${element.rndc_codigo_ciudad}" data-municipio="${element.municipio}" data-depto="${element.depto}">${element.municipio}-${element.depto}</option>`
            );
        });

        return true; // Retornamos algo para saber que la carga terminó
    } catch (error) {
        console.error('Error en Municipios:', error);
        throw error;
    }
}

// JS - Función auxiliar para obtener el ícono y clase del estado
function getActionStyle(estado) {
    switch (estado) {
        case 'Finalizado':
            return { icon: 'uil uil-check-circle', dotClass: 'bg-success', title: 'Gestión Finalizada' };
        case 'Iniciado':
            return { icon: 'uil uil-play-circle', dotClass: 'bg-info', title: 'Gestión en Curso' };
        case 'Pendiente':
            return { icon: 'uil uil-hourglass', dotClass: 'bg-warning', title: 'Gestión Pendiente' };
        default:
            return { icon: 'uil uil-question-circle', dotClass: 'bg-secondary', title: 'Estado Desconocido' };
    }
}

// JS - Función de limpieza robusta y completamente manual
function limpiarFormularioGestion() {
    // 1. Inputs de Texto y Fechas
    document.getElementById('fecha_devolucion').value = '';
    document.getElementById('fecha_cita').value = '';
    document.getElementById('fecha_actual').value = '';
    document.getElementById('fecha_nueva').value = '';
    document.getElementById('obsrvacion_gestion').value = '';

    // 2. Limpieza de Selects (incluyendo Select2)
    // Usamos jQuery/Select2 para restablecer el valor y disparar el evento de Select2
    $('#estado_gestion').val('').trigger('change');
    $('#patio').val('').trigger('change');
    $('#municipio').val('').trigger('change');
    $('#patio_redireccion').val('').trigger('change');

    // 3. Limpieza de File Inputs (requiere establecer el valor a cadena vacía)
    document.getElementById('tirilla').value = '';
    document.getElementById('soporte').value = '';

    // 4. Resetear Checkbox/Switch
    document.getElementById('flexSwitchCheckRedireccionado').checked = false;

    console.log('Formulario de gestión reiniciado de forma manual y robusta.');
}