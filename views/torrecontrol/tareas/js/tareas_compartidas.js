window.VENTANA = null; // Variable global para almacenar el ID
window.valores = "";
window.RecursoId = "";
// sessionStorage.clear();
// Definir la función initScript globalmente
window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global
    window.valores = window.location.search;
    Listar_pedidos();


    document.addEventListener("click", async e => {
        if (e.target.matches("#btn_detalle_pedido")) {
            let MaestroId = e.target.getAttribute("data-id");
            let RecursoId = e.target.getAttribute("data-RecursoId");
            window.RecursoId = RecursoId;
            // Espera a que el DOM se actualice antes de cargar los datos
            setTimeout(() => {
                Listar_actividades_pedido(MaestroId, RecursoId);
            }, 50);
        }

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

                            // Obtener el input
                            let documentosInput = document.getElementById('documento' + actividad_id);

                            // Recorrer todos los archivos seleccionados
                            if (documentosInput && documentosInput.files.length > 0) {
                                for (let i = 0; i < documentosInput.files.length; i++) {
                                    // Agregar cada archivo al FormData
                                    data.append('documentos[]', documentosInput.files[i]);
                                }
                            } else {
                                // Si no hay archivos, puedes enviar un indicador
                                data.append('documentos[]', 'Sin_evidencia');
                            }

                            // var documentos = document.getElementById('documento' + actividad_id).files[0];
                            // if (documentos !== undefined) {
                            //     data.append('documento', documentos);
                            // } else {
                            //     data.append('documento', 'Sin_evidencia');
                            // }

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
                                        Listar_actividades_pedido(MaestroId, window.RecursoId);
                                        // Numero_actividades(PedidoId);
                                        document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
                                    }, 1500);
                                });
                        }
                    }
                });
            }
        }

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
                setTimeout(() => {
                    Detalles_actividaes(PedidoId, actividad_id);
                }, 50);
            }
        }
    });

}

async function Listar_pedidos() {
    await fetch($("#base_url").val() + "torrecontrol/Comportaidos_Conmigo", {
        method: "POST",
        // body: data,
        cache: "no-cache",
    })
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .catch((error) => {
            alert(JSON.stringify(error.length) || "Error al cargar los pedidos compartidos");
        })
        .then((response) => {
            let tbody = document.getElementById("body_pedidos_compartidos");
            tbody.innerHTML = "";

            document.querySelector(".contador").innerHTML = response[0].total_registros;
            response.forEach((element) => {
                const fila = document.createElement("tr");
                const columnaNumdoc = document.createElement("td");
                columnaNumdoc.textContent = element.numdoc;
                const columnaReferencia = document.createElement("td");
                columnaReferencia.innerHTML = `<a href="#!" class="text-decoration-none" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop" id="btn_detalle_pedido" data-id="${element.numdoc}" data-RecursoId="${element.recurso_id}">${element.referencia}</a>`;
                const columnaCliente = document.createElement("td");
                columnaCliente.textContent = element.nombre;
                const columnaFecha = document.createElement("td");
                columnaFecha.textContent = element.fecha_creacion + " - " + element.hora_creacion;
                const columnaCompartido = document.createElement("td");
                columnaCompartido.textContent = element.usuario;

                const columnaEstado = document.createElement("td");
                if (element.estado === "ACTIVO") {
                    columnaEstado.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado}</span><span class="fas fa-check ms-1" style="height:12.8px;width:12.8px;"></span></span>`;
                } else if (element.estado === "CANCELADO") {
                    columnaEstado.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.estado}</span><span class="fas fa-times ms-1" style="height:12.8px;width:12.8px;"></span></span>`;
                } else if (element.estado === "EN PROCESO") {
                    columnaEstado.innerHTML = `<span class=badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">${element.estado}</span><span class="fas fa-reply-all ms-1" style="height:12.8px;width:12.8px;"></span></span>`;
                } else if (element.estado === "FINALIZADO") {
                    columnaEstado.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${element.estado}</span><span class="fas fa-question-circle ms-1" style="height:12.8px;width:12.8px;"></span></span>`;
                } else if (element.estado === "INICIADO") {
                    columnaEstado.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado}</span><span class="fas fa-check ms-1" style="height:12.8px;width:12.8px;"></span></span>`;
                } else {
                    columnaEstado.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${element.estado}</span><span class="fas fa-ban ms-1" style="height:12.8px;width:12.8px;"></span></span>`;
                }

                fila.appendChild(columnaNumdoc);
                fila.appendChild(columnaReferencia);
                fila.appendChild(columnaCliente);
                fila.appendChild(columnaFecha);
                fila.appendChild(columnaCompartido);
                fila.appendChild(columnaEstado);
                tbody.appendChild(fila);
            });
        });
}

async function Listar_actividades_pedido(MaestroId, RecursoId) {
    try {
        let formData = new FormData();
        formData.append("Numdoc", MaestroId);
        formData.append("RecursoId", RecursoId);

        let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_actividades_gestion_compartidos', {
            method: "POST",
            body: formData,
            cache: 'no-cache',
        });

        let data = await response.json();
        let tbody = document.getElementById('tbody_actividades_compartidas');
        let usuario = document.getElementById('ssn_id_usuario').value;
        let CriterioCalculo = "";
        tbody.innerHTML = '';
        data.actividades.forEach(element => {
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
                        if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
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
                    if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
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
                if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
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
                            <input type="file" name="documentos[]" id="documento${element.actividad_id}" class="form-control form-control-sm" multiple>
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
                </div>`;

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
        document.getElementById("tipo_servicio_header").innerHTML = data.servicios[0].tipo_servicio;
        document.getElementById("vehiculo_header").innerHTML = data.servicios[0].vehiculo;
        document.getElementById("estado_header").innerHTML = col_estatus_publicacion;
        document.getElementById("fecha_registro_header").innerHTML = data.servicios[0].Fecha_registro;
        document.getElementById("fecha_limite_header").innerHTML = data.servicios[0].fecha_limite;
        document.getElementById("cedula_header").innerHTML = data.servicios[0].cedula_conductor;
        document.getElementById("conductor_header").innerHTML = data.servicios[0].nombre_conductor;
        document.getElementById("placa_header").innerHTML = data.servicios[0].Placa;
        document.getElementById("inicio_servicio_header").innerHTML = data.servicios[0].Fecha_Inicio;
        Numero_actividades(MaestroId);
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

                        //         const columnaEvidencia = document.createElement('td');
                        //         if (element.nombre_archivo !== 'Sin_evidencia') {
                        //             columnaEvidencia.innerHTML = `
                        // <div class="btn-group" role="group" aria-label="...">
                        //   <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" onclick="abrir_fotos('${element.documento}' , '${element.nombre_archivo}')"><i class="uil-file-download-alt"></i> Descargar</button>
                        // </div>
                        // `;
                        //         } else {
                        //             columnaEvidencia.innerHTML = `<span class="text-primary">Sin evidencia</span>`;
                        //         }
                        //         columnaEvidencia.style.textAlign = 'center';
                        //         columnaEvidencia.style.width = 'auto';
                        //         columnaEvidencia.style.whiteSpace = 'nowrap';

                        const columnaEvidencia = document.createElement('td');

                        const rutasConcat = element.rutas_documento || '';   // ej: "public/files/.../||public/files/.../"
                        const nombresConcat = element.nombres_archivo || '';   // ej: "doc1.pdf||doc2.png"

                        if (nombresConcat.trim() !== '') {
                            const rutas = rutasConcat.split('||');
                            const nombres = nombresConcat.split('||');

                            let htmlBotones = '';
                            for (let i = 0; i < nombres.length; i++) {
                                const carpeta = rutas[i] || '';
                                const nombre = nombres[i] || '';
                                if (!carpeta || !nombre) continue;

                                htmlBotones += `
                                <div class="btn-group" role="group" aria-label="...">
                                    <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0"
                                        onclick="abrir_fotos('${carpeta}', '${nombre}')">
                                        <i class="uil-file-download-alt"></i> Descargar ${i + 1}
                                    </button>
                                </div>
                                `;
                            }
                            columnaEvidencia.innerHTML = htmlBotones || `<span class="text-primary">Sin evidencia</span>`;
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

// function abrir_fotos(url, name) {
//     // URL de la página que deseas abrir en la nueva ventana
//     var url = $('#base_url').val() + url + name;
//     // Opciones de la ventana emergente (ancho, alto, opciones adicionales)
//     var ventanaAncho = 1000;
//     var ventanaAlto = 1000;
//     // Calcula las coordenadas para centrar la ventana
//     var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
//     var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
//     // Opciones de la ventana emergente (ancho, alto, posición)
//     var opcionesVentana = 'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
//     // Utiliza window.open para abrir la nueva ventana
//     window.open(url, name, opcionesVentana);
// }

function abrir_fotos(url, name) {
    var url = $('#base_url').val() + url + name;
    var ventanaAncho = 1000, ventanaAlto = 1000;
    var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
    var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
    var opcionesVentana = 'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
    window.open(url, name, opcionesVentana);
}
