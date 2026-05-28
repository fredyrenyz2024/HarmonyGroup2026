window.VENTANA = null;
window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID de la ventana a la variable global
    ListarEnturnados();

    document.addEventListener('click', async function (e) {
        if (e.target.matches('#btn-gestionar-vehiculo') || e.target.closest('#btn-gestionar-vehiculo')) {
            e.preventDefault();
            let enlace = e.target.closest('#btn-gestionar-vehiculo');

            // Extraer atributos
            let data = {
                placa: enlace.getAttribute('data-placa'),
                conductor: enlace.getAttribute('data-conductor'),
                celular: enlace.getAttribute('data-celular'),
                ubicacion: enlace.getAttribute('data-ubicacion'),
                agencia: enlace.getAttribute('data-agencia'),
                solicitud: enlace.getAttribute('data-solicitud'),
                origen: enlace.getAttribute('data-origen'),
                destino: enlace.getAttribute('data-destino'),
                solicitante: enlace.getAttribute('data-solicitante'),
                estado: enlace.getAttribute('data-estado'),
                GestionId: enlace.getAttribute('data-GestionId'),
                EstadoEnturnamiento: enlace.getAttribute('data-estado_enturnamiento'),
            };

            // Mostrar datos en el Offcanvas
            document.getElementById('oc_placa').textContent = data.placa || '---';
            document.getElementById('oc_conductor').textContent = data.conductor || '---';
            document.getElementById('oc_celular').textContent = data.celular || '---';
            document.getElementById('oc_ubicacion').textContent = data.ubicacion || '---';
            document.getElementById('oc_agencia').textContent = data.agencia || '---';
            document.getElementById('oc_solicitud').textContent = data.solicitud || '---';
            document.getElementById('oc_origen').textContent = data.origen || '---';
            document.getElementById('oc_destino').textContent = data.destino || '---';
            document.getElementById('oc_solicitante').textContent = data.solicitante || '---';

            // Cambiar color del badge según estado
            const estadoEl = document.getElementById('oc_estado');
            estadoEl.textContent = data.estado || '---';
            estadoEl.className =
                'badge rounded-pill ' +
                (data.estado === 'Rechazado' ? 'bg-danger' : data.estado === 'Pendiente' ? 'bg-warning text-dark' : 'bg-success');

            if (data.EstadoEnturnamiento === 'Gestion Finzalida') {
                document.getElementById('btnGuardarGestionVehiculos').style.display = 'none';
                document.getElementById('estado_gestion_vehiculo').style.display = 'none';
                document.getElementById('obsrvacion_gestion_vehiculo').style.display = 'none';
            } else {
                document.getElementById('btnGuardarGestionVehiculos').style.display = '';
                document.getElementById('estado_gestion_vehiculo').style.display = '';
                document.getElementById('obsrvacion_gestion_vehiculo').style.display = '';
            }

            document.getElementById('btnGuardarGestionVehiculos').setAttribute('data-gestion_id', data.GestionId);

            // Mostrar offcanvas
            const offcanvas = new bootstrap.Offcanvas('#offcanvasRight');
            offcanvas.show();
            // ListarHistoricoGestion(data.GestionId);
            // Cargar el historial automáticamente
            await ListarHistoricoGestion(data.GestionId);
        }

        if (e.target.matches('#btnGuardarGestionVehiculos') || e.target.matches('#btnGuardarGestionVehiculos *')) {
            let enlace = e.target.closest('#btnGuardarGestionVehiculos');
            let gestion_id = enlace.getAttribute('data-gestion_id');

            let estado = document.getElementById('estado_gestion_vehiculo').value;
            let observaciones = document.getElementById('obsrvacion_gestion_vehiculo').value;

            let datos = new FormData();
            datos.append('estado', estado);
            datos.append('observaciones', observaciones);
            datos.append('gestion_id', gestion_id);

            try {
                const response = await fetch($('#base_url').val() + 'prefiltro_nacional/Insertar_Gestion_Vehiculo', {
                    method: 'POST',
                    body: datos,
                    cache: 'no-cache',
                });
                const data = await response.json();

                Swal.fire({
                    icon: data.status ? 'success' : 'error',
                    title: data.status ? 'Gestión registrada' : 'Error en la gestión',
                    html: `<p style="font-size: 14px;">${data.message || 'Sin mensaje del servidor.'}</p>`,
                    confirmButtonColor: data.status ? '#28a745' : '#d33',
                });
                document.getElementById('estado_gestion_vehiculo').value = '';
                document.getElementById('obsrvacion_gestion_vehiculo').value = '';
                ListarHistoricoGestion(gestion_id);
                ListarEnturnados();
            } catch (error) {
                console.error('Error en la primera solicitud:', error);
            }
        }

        if (e.target.matches('#btn-chat-conductor') || e.target.matches('#btn-chat-conductor *')) {
            let Boton = e.target.closest('#btn-chat-conductor');
            let Conductor = Boton.getAttribute('data-conductor');
            let Placa = Boton.getAttribute('data-placa');
            document.getElementById('placa-chat').innerText = 'Placa: ' + Placa + ' ';
            document.getElementById('title-chat').innerText = ' Conductor: ' + Conductor;

            // Mostrar offcanvas
            const offcanvas = new bootstrap.Offcanvas('#offcanvasChat');
            offcanvas.show();

            const wa_id = '573168344312'; // <- dinámico si quieres cambiar de chat
            // const wa_id = '573133354074'; // <- dinámico si quieres cambiar de chat
            // Cargar historial
            loadMessages(wa_id);
        }

       if (e.target.matches('#btn-enviar-mesanje') || e.target.matches('#btn-enviar-mesanje *')) {
           let Mensaje = document.getElementById('mensaje_texto').innerText;
           if (!Mensaje) return;
    
           const response = await fetch('http://127.0.0.1:8000/api/whatsapp/send/text', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                   // to: waId,
                //    to: '573017925954',
                   to: '573168344312',
                   text: Mensaje,
               }),
           });
    
           const res = await response.json();
    
           // Mensaje del backend real viene en res.data
           renderSent(res.data);
    
           document.getElementById('mensaje_texto').innerText = '';
       }

    });
};

async function ListarEnturnados() {
    $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
    try {
        await fetch($('#base_url').val() + 'prefiltro_nacional/Listar_Enturnados', {
            method: 'POST',
            // body: data,
        })
            .then((response) => {
                if (!response.ok) throw new Error(response.statusText);
                return response.json();
            })
            .then(function (data) {
                let tbody = document.getElementById('tbl-vehiculos-enturnado');
                let template = '';
                let estado = '';
                let estado_contenedor = '';
                if (data) {
                    // console.log(data);
                    template.innerHTML = '';
                    data.forEach((element) => {
                        // Determinar color de estado
                        const estado = element.estado_enturnamiento || 'Desconocido';
                        const estadoRespuesta = element.estado_respuesta || 'Desconocido';
                        let badgeEstado = '';
                        if (estado === 'Rechazado') {
                            badgeEstado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${estado}</span></span>`;
                        } else if (estado === 'Pendiente') {
                            badgeEstado = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${estado}</span></span>`;
                        } else {
                            badgeEstado = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${estado}</span></span>`;
                        }
                        let badgeEstadoRespuesta = '';
                        if (estadoRespuesta === 'Rechazado') {
                            badgeEstadoRespuesta = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${estadoRespuesta}</span></span>`;
                        } else if (estadoRespuesta === 'Pendiente') {
                            badgeEstadoRespuesta = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${estadoRespuesta}</span></span>`;
                        } else {
                            badgeEstadoRespuesta = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${estadoRespuesta}</span></span>`;
                        }

                        template += `
                        <tr>
                            <td  class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.Conductor}</td>
                            <td  class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.celular}</td>
                            <td  class='text-center' style='color:black;width:auto; white-space: nowrap;'>
                                <div class="dropdown">
                                    <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${
                                        element.placa
                                    }</a>
                                    <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
                                        <a class="dropdown-item fw-bold" href="#" id='btn-gestionar-vehiculo'
                                            data-GestionId="${element.GestionId || ''}"
                                            data-placa="${element.placa || ''}"
                                            data-conductor="${element.Conductor || ''}"
                                            data-celular="${element.celular || ''}"
                                            data-ubicacion="${element.ubicacion || ''}"
                                            data-agencia="${element.Agencia || ''}"
                                            data-solicitud="${element.Solicitud_Servicio || ''}"
                                            data-origen="${element.Origen || ''}"
                                            data-destino="${element.Destino || ''}"
                                            data-solicitante="${element.Solicitante || ''}"
                                            data-estado="${estado}"
                                            data-estado_enturnamiento="${element.estado_enturnamiento}"> 
                                                Gestionar Vehiculo
                                        </a>
                                        <a class="dropdown-item fw-bold" href="#" id='btn-chat-conductor' 
                                            data-conductor="${element.Conductor || ''}" 
                                            data-placa="${element.placa || ''}"> 
                                                Chat
                                        </a>
                                </div>
                            </td>
                            <td  class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.ubicacion}</td>
                            <td  class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.Agencia}</td>
                            <td  class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.Solicitud_Servicio}</td>
                            <td  class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.Origen}</td>
                            <td  class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.Destino}</td>
                            <td  class='text-center' style='color:black;width:auto; white-space: nowrap;'>${element.Solicitante}</td>
                            <td  class='text-center' style='color:black;width:auto; white-space: nowrap;'>${badgeEstado}</td>
                            <td  class='text-center' style='color:black;width:auto; white-space: nowrap;'>${badgeEstadoRespuesta}</td>
                        </tr>`;
                        tbody.innerHTML = template;
                    });
                } else {
                    tbody.innerHTML = '';
                }
            })
            .catch((error) => {
                console.log(error);
                // alert(error);
            });
    } catch (error) {
        alert('Error de trucaht' + error);
    } finally {
        $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    }
}

async function ListarHistoricoGestion(GestionId) {
    // const overlay = $('#loading-overlay-nexosapp-historico');
    const tbody = document.getElementById('tbody-historico-gestion');

    // overlay.css('display', 'flex');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Cargando...</td></tr>';

    const dato = new FormData();
    dato.append('GestionId', GestionId);

    try {
        const response = await fetch($('#base_url').val() + 'prefiltro_nacional/Historico_Gestion', {
            method: 'POST',
            body: dato,
        });

        if (!response.ok) throw new Error('Error HTTP: ' + response.status);
        const data = await response.json();

        if (data.status && Array.isArray(data.data) && data.data.length > 0) {
            let rows = '';
            data.data.forEach((item) => {
                rows += `
                    <tr>
                        <td style="color:black;width:auto; white-space: nowrap;">${item.fecha || '-'}</td>
                        <td style="color:black;width:auto; white-space: nowrap;">${item.hora || '-'}</td>
                        <td style="color:black;width:auto; white-space: nowrap;">
                            <span class="badge badge-phoenix badge-phoenix-${
                                item.estado_enturnamiento === 'Gestion Finzalida'
                                    ? 'success'
                                    : item.estado_enturnamiento === 'Pendiente Iniciar Gestion'
                                    ? 'warning'
                                    : 'info'
                            }">
                                ${item.estado_enturnamiento}
                            </span>
                        </td>
                        <td style="color:black;width:auto; white-space: nowrap;">${item.observacion || 'Sin observaciones'}</td>
                        <td style="color:black;width:auto; white-space: nowrap;">${item.usuario || '-'}</td>
                    </tr>
                `;
            });
            tbody.innerHTML = rows;
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Sin gestiones registradas.</td></tr>';
        }
    } catch (error) {
        console.error(error);
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error al cargar histórico.</td></tr>';
    } finally {
        // overlay.css('display', 'none');
    }
}

// window.chatBody = document.querySelector('.card-body-chat');
// async function loadMessages(wa_id) {
//     const response = await fetch(`http://127.0.0.1:8000/api/chat/messages/${wa_id}`);
//     const messages = await response.json();

//     window.chatBody.innerHTML = ''; // Limpia el chat

//     messages.forEach((msg) => {
//         if (msg.direction === 'received') {
//             renderReceived(msg);
//         } else {
//             renderSent(msg);
//         }
//     });

//     window.chatBody.scrollTop = window.chatBody.scrollHeight;
// }

// function renderReceived(msg) {
//     // Convertir created_at a hora
//     const hora = new Date(msg.created_at).toLocaleTimeString('es-CO', {
//         hour: '2-digit',
//         minute: '2-digit',
//     });
//     window.chatBody.insertAdjacentHTML(
//         'beforeend',
//         `
//         <div class="d-flex chat-message">
//             <div class="d-flex mb-2 flex-1">
//                 <div class="w-100 w-xxl-75">
//                     <div class="d-flex hover-actions-trigger">
//                         <div class="avatar avatar-m me-3 flex-shrink-0">
//                             <img class="rounded-circle" src="${$('#base_url').val()}public/assets/img/team/avatar.webp">
//                         </div>
//                         <div class="chat-message-content received me-2">
//                             <div class="mb-1 received-message-content border rounded-2 p-3">
//                                 <p class="mb-0">${msg.message}</p>
//                                 <div class="text-end">
//                                     <p class="mb-0 fs-10 ms-7 text-body-white">${hora}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <!--<p class="mb-0 fs-10 ms-7 text-body-tertiary">${msg.created_at}</p>-->
//                 </div>
//             </div>
//         </div>
//         `
//     );
// }

// function renderSent(msg) {
//     // Convertir created_at a hora
//     const hora = new Date(msg.created_at).toLocaleTimeString('es-CO', {
//         hour: '2-digit',
//         minute: '2-digit',
//     });

//     window.chatBody.insertAdjacentHTML(
//         'beforeend',
//         `
//             <div class="d-flex chat-message">
//                 <div class="d-flex mb-2 justify-content-end flex-1">
//                     <div class="w-100 w-xxl-75">
//                         <div class="d-flex flex-end-center hover-actions-trigger">
//                             <div class="chat-message-content me-2">
//                                 <div class="mb-1 sent-message-content bg-primary text-white rounded-2 p-2">
//                                     <p class="mb-0">${msg.message}</p>
//                                     <div class="text-end">
//                                         <p class="mb-0 fs-10 text-body-white">${hora}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `
//     );
// }

// // Habilita logs de depuración
// Pusher.logToConsole = true;

// const pusher = new Pusher('a1f9465e63c04e78d2ee', {
//     cluster: 'mt1',
//     forceTLS: true,
// });

// // Ejemplo: número de WhatsApp del contacto
// const waId = '573001112233';

// const channel = pusher.subscribe(`whatsapp.chat.${waId}`);

// channel.bind('message.created', function (data) {
//     console.log('Mensaje recibido en TIEMPO REAL:', data);

//     if (data.direction === 'received') {
//         renderReceived(data);
//     } else {
//         renderSent(data);
//     }

//     window.chatBody.scrollTop = window.chatBody.scrollHeight;
// });

// === LOAD INITIAL MESSAGES ===
window.chatBody = document.querySelector('.card-body-chat');

async function loadMessages(wa_id) {
    const response = await fetch(`http://127.0.0.1:8000/api/chat/messages/${wa_id}`);
    const messages = await response.json();

    window.chatBody.innerHTML = '';

    messages.forEach((msg) => {
        if (msg.direction === 'received') renderReceived(msg);
        else renderSent(msg);
    });

    window.chatBody.scrollTop = window.chatBody.scrollHeight;
}

// === RENDER MSG RECEIVED ===
function renderReceived(msg) {
    const hora = new Date(msg.created_at).toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
    });

    window.chatBody.insertAdjacentHTML(
        'beforeend',
        `
        <div class="d-flex chat-message">
            <div class="d-flex mb-2 flex-1">
                <div class="w-100 w-xxl-75">
                    <div class="d-flex hover-actions-trigger">
                        <div class="avatar avatar-m me-3 flex-shrink-0">
                            <img class="rounded-circle" 
                                src="${$('#base_url').val()}public/assets/img/team/avatar.webp">
                        </div>
                        <div class="chat-message-content received me-2">
                            <div class="mb-1 received-message-content border rounded-2 p-3">
                                <p class="mb-0">${msg.message}</p>
                                <div class="text-end">
                                    <p class="mb-0 fs-10 ms-7 text-body-white">${hora}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    );
}

// === RENDER MSG SENT ===
function renderSent(msg) {
    const hora = new Date(msg.created_at).toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
    });

    window.chatBody.insertAdjacentHTML(
        'beforeend',
        `
       <div class="d-flex chat-message">
            <div class="d-flex mb-2 justify-content-end flex-1">
                <div class="w-100 w-xxl-75">
                    <div class="d-flex flex-end-center hover-actions-trigger">
                        <div class="chat-message-content me-2">
                            <div class="mb-1 sent-message-content bg-primary text-white rounded-2 p-2">
                                <p class="mb-0">${msg.message}</p>
                                <div class="text-end">
                                    <p class="mb-0 fs-10 text-body-white">${hora}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    );
}

// === PUSHER REALTIME ===
Pusher.logToConsole = true;

const pusher = new Pusher('a1f9465e63c04e78d2ee', {
    cluster: 'mt1',
    forceTLS: true,
});

const waId = '573168344312'; // <- DEBES CAMBIARLO SEGÚN EL CONVERSATION SELECTED
// const waId = '573017925954'; // <- DEBES CAMBIARLO SEGÚN EL CONVERSATION SELECTED

const channel = pusher.subscribe(`whatsapp.chat.${waId}`);
// console.log("🚀 ~ channel:", channel)

channel.bind('message.created', function (data) {
    // console.log('Realtime recibido:', data);

    if (data.direction === 'received') renderReceived(data);
    else renderSent(data);

    window.chatBody.scrollTop = window.chatBody.scrollHeight;
});
