window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global

    // Crear instancia
    // Usar una variable global o una propiedad en el objeto window
    // if (!window.myOffcanvas) {
    //     window.myOffcanvas = new DynamicOffcanvas({
    //         id: `customOffcanvas${id}`,
    //         title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
    //         content: '<p>Contenido inicial</p>',
    //         scroll: true,
    //         backdrop: false
    //     });
    // } else {
    //     console.log('El offcanvas ya está creado.');
    // }

    ListarManifiestosSeguimiento();

    document.addEventListener("click", async (e) => {
        if (e.target.closest("#enviar_correo")) {
            const btn = e.target.closest("#enviar_correo");
            const id = btn.dataset.id;
            const Metodo = btn.getAttribute('data-Metodo');
            console.log("🚀 ~ Metodo:", Metodo)
            const Proceso = btn.getAttribute('data-Proceso');
            console.log("🚀 ~ Proceso:", Proceso)
            const ClienteId = btn.getAttribute('data-ClienteId');
            console.log("🚀 ~ ClienteId:", ClienteId)

            await ejecutarAccion(btn, "bi-envelope", "Correo enviado con éxito 🚀", id, Metodo, Proceso, ClienteId);
        }

        if (e.target.closest("#enviar_whatsapp")) {
            const btn = e.target.closest("#enviar_whatsapp");
            const id = btn.dataset.id;
            await ejecutarAccion(btn, "bi-whatsapp", "WhatsApp enviado con éxito 📲", id);
        }

        // if (e.target.closest("#enviar_notificaciones")) {
        //     const btn = e.target.closest("#enviar_notificaciones");
        //     const id = btn.dataset.id;
        //     await ejecutarAccion(btn, "bi-bell", "Notificación enviada con éxito 🔔", id);
        // }

        if (e.target.closest("#btn_configuracion_envios")) {
            const btn = e.target.closest("#btn_configuracion_envios");
            const ClienteId = btn.getAttribute("data-ClienteId");

            /* Consultar configuración del cliente */
            let datos = new FormData();
            datos.append('ClienteId', ClienteId);

            try {
                const response = await fetch($('#base_url').val() + 'novedades/Consultar_Configuraciones', {
                    method: 'POST',
                    body: datos,
                    cache: 'no-cache',
                });
                const data = await response.json();

                if (data && data.length > 0) {
                    const contenedor = document.getElementById('contenedor_configuraciones');
                    contenedor.innerHTML = ''; // limpiar

                    // ---- CABECERA SWITCHES ----
                    const cabecera = `
                        <div class="d-flex flex-wrap gap-12 justify-content-center">
                                <div class="mb-3">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="envio_automatico" data-ClienteId="${data[0].cliente_id}" ${data[0].envio_automatico === "SI" ? "checked" : ""}>
                                        <label class="form-check-label fw-bold">Envíos Automáticos</label>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="envio_manual" data-ClienteId="${data[0].cliente_id}" ${data[0].envio_manual === "SI" ? "checked" : ""}>
                                        <label class="form-check-label fw-bold">Envíos Manuales</label>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="envio_whatsapp" data-ClienteId="${data[0].cliente_id}" ${data[0].envio_whatsapp === "SI" ? "checked" : ""}>
                                        <label class="form-check-label fw-bold">WhatsApp</label>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="estado_configuracion" data-ClienteId="${data[0].cliente_id}" ${data[0].estado_configuracion === "ACTIVO" ? "checked" : ""}>
                                        <label class="form-check-label fw-bold">Configuración Activa</label>
                                    </div>
                                </div>
                        </div>`;

                    // ---- TABLA DE USUARIOS ----
                    document.getElementById("btn_guardar_cliente").setAttribute("data-ConfiguracionId", data[0].configuracion_id)
                    let usuarios = `
                        <h5 class="mt-2">Usuarios configurados</h5>
                        <table class='table table-bordered table-sm text-center' data-page-length='100' style="font-size:12px;">
                            <thead>
                                <tr>
                                    <th style='color:black;width: auto; white-space: nowrap;'>Nombre</th>
                                    <th style='color:black;width: auto; white-space: nowrap;'>Correo</th>
                                    <th style='color:black;width: auto; white-space: nowrap;'>Celular</th>
                                    <th style='color:black;width: auto; white-space: nowrap;'>Activo</th>
                                </tr>
                            </thead>
                            <tbody id="tabla_usuarios">
                                ${data.map(item => `
                                    <tr>
                                        <td style='color:black;width: auto; white-space: nowrap;'><input type="text" class="form-control form-control-sm me-1 px-1 py-1" value="${item.nombre}"  disabled></td>
                                        <td style='color:black;width: auto; white-space: nowrap;'><input type="email" class="form-control form-control-sm me-1 px-1 py-1" value="${item.correo}" disabled></td>
                                        <td style='color:black;width: auto; white-space: nowrap;'><input type="text" class="form-control form-control-sm me-1 px-1 py-1" value="${item.celular}" disabled></td>
                                        <td class="d-flex justify-content-center" style='width: auto; white-space: nowrap;font-size:14px;'>
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" name="contacto_cliente" id="contacto_cliente${item.detalle_id}" data-DetalleId="${item.detalle_id}" data-ClienteId="${item.cliente_id}" data-ConfiguracionId="${item.configuracion_id}" ${item.estado_detalle === "ACTIVO" ? "checked" : ""}>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                `).join("")}
                            </tbody>
                        </table>
                        <button type="button" class="btn btn-sm btn-primary me-1 px-1 py-1" id="btn_agregar_usuario">
                            <i class="far fa-plus-square"></i>   Agregar Usuario
                        </button>`;

                    // Pintar todo en el contenedor
                    contenedor.innerHTML = cabecera + usuarios;

                    // ---- BIND DE LOS SWITCHES DINÁMICOS ----
                    const switches = [
                        { id: "envio_automatico", campo: "envio_automatico", valores: ["SI", "NO"] },
                        { id: "envio_manual", campo: "envio_manual", valores: ["SI", "NO"] },
                        { id: "envio_whatsapp", campo: "envio_whatsapp", valores: ["SI", "NO"] },
                        { id: "estado_configuracion", campo: "estado_configuracion", valores: ["ACTIVO", "INACTIVO"] },
                    ];

                    switches.forEach(sw => {
                        const el = document.getElementById(sw.id);
                        if (el) {
                            el.addEventListener("change", e => {
                                const clienteId = el.getAttribute("data-ClienteId");
                                const valor = e.target.checked ? sw.valores[0] : sw.valores[1];
                                actualizarConfiguracion(sw.campo, valor, clienteId);
                            });
                        }
                    });

                    // Detectar cambio en cualquier switch
                    $(document).on("change", "input[name='contacto_cliente']", function () {
                        let isChecked = $(this).is(":checked") ? "ACTIVO" : "INACTIVO"; // valor que vas a mandar
                        let detalleId = $(this).data("detalleid");
                        let clienteId = $(this).data("clienteid");
                        let configuracionId = $(this).data("configuracionid");

                        // Opcional: feedback visual inmediato
                        $(this).prop("disabled", true);

                        $.ajax({
                            url: $('#base_url').val() + "novedades/Actualizar_Usuario", // tu ruta en PHP/Laravel
                            method: "POST",
                            data: {
                                DetalleId: detalleId,
                                ClienteId: clienteId,
                                ConfiguracionId: configuracionId,
                                Estado: isChecked
                            },
                            success: function (response) {
                                showToast("success", "Usuario actualizado", `El usuario fue marcado como ${isChecked}`);
                            },
                            error: function () {
                                showToast("danger", "Error", "No se pudo actualizar el estado.");
                                // revertir switch si falla
                                $(`#contacto_cliente${detalleId}`).prop("checked", !($(this).is(":checked")));
                            },
                            complete: function () {
                                // reactivar el switch
                                $(`#contacto_cliente${detalleId}`).prop("disabled", false);
                            }
                        });
                    });

                    // ---- EVENTO AGREGAR USUARIO ----
                    document.getElementById("btn_agregar_usuario").addEventListener("click", () => {
                        const tbody = document.getElementById("tabla_usuarios");
                        const nuevaFila = document.createElement("tr");
                        nuevaFila.innerHTML = `
                            <td style='color:black;width: auto; white-space: nowrap;'><input type="text" class="form-control form-control-sm me-1 px-1 py-1" placeholder="Nombre"  id="nombre_contacto"  name="nombre_contacto"></td>
                            <td style='color:black;width: auto; white-space: nowrap;'><input type="email" class="form-control form-control-sm me-1 px-1 py-1" placeholder="Correo" id="correo_contacto"  name="correo_contacto"></td>
                            <td style='color:black;width: auto; white-space: nowrap;'><input type="text" class="form-control form-control-sm me-1 px-1 py-1" placeholder="Celular" id="ceular_contacto"  name="ceular_contacto"></td>
                            <td class="d-flex justify-content-center" style='width: auto; white-space: nowrap;font-size:14px;'><div class="form-check form-switch"><input class="form-check-input" type="checkbox" checked disabled></div></td>
                        `;
                        tbody.appendChild(nuevaFila);
                    });
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        }

    });

    //Cliekc para gaurdar los contactos nuevos
    document.getElementById("btn_guardar_cliente").addEventListener("click", (e) => {
        const configuracionId = e.target.getAttribute("data-ConfiguracionId"); // <- aquí recuperas el id

        const filas = document.querySelectorAll("#tabla_usuarios tr");
        let contactos = [];

        filas.forEach(fila => {
            let nombre = fila.querySelector("input[name='nombre_contacto']")?.value || "";
            let correo = fila.querySelector("input[name='correo_contacto']")?.value || "";
            let celular = fila.querySelector("input[name='ceular_contacto']")?.value || "";
            let activo = fila.querySelector(".form-check-input")?.checked ? "ACTIVO" : "INACTIVO";

            if (nombre !== "" && correo !== "") {
                contactos.push({
                    nombre: nombre,
                    correo: correo,
                    celular: celular,
                    estado: activo
                });
            }
        });

        // console.log("Contactos a guardar:", contactos);
        // console.log("Configuracion ID:", configuracionId);

        // Enviar por AJAX
        $.ajax({
            url: $('#base_url').val() + 'novedades/GuardarContactos',
            type: "POST",
            data: {
                contactos: JSON.stringify(contactos),
                configuracion_id: configuracionId
            },
            success: function (res) {
                let resp = JSON.parse(res);
                if (resp) {
                    showToast("success", "Configuración Guardada", "Usuarios registrados correctamente");
                } else {
                    showToast("danger", "Error", "No se pudo guardar");
                }
            }
        });
    });

    async function ejecutarAccion(btn, icono, mensaje, id, Metodo, Proceso, ClienteId) {
        // const icon = btn.querySelector("i");
        // const originalIcon = icon.className;

        // Animación de carga
        // icon.className = "spinner-border spinner-border-sm text-secondary";

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
            }
        });

        try {
            // Aquí haces el fetch hacia tu API en Laravel (por ejemplo: http://127.0.0.1:8000/api/enviar)
            const response = await fetch("http://127.0.0.1:8000/api/enviar-notificacion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    // Si tu API usa token:
                    // "Authorization": "Bearer TU_TOKEN"
                },
                body: JSON.stringify({
                    pedido: id,
                    metodo: Metodo,
                    Procedencia: Proceso,
                    cliente: ClienteId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error en la API");
            }

            // ✅ Mensaje de confirmación
            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: data.message || mensaje,
                timer: 2000,
                showConfirmButton: false,
            });

        } catch (error) {
            // ❌ Error
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "No se pudo completar la acción",
            });
        } finally {
            // Restaurar icono original
            // icon.className = originalIcon || icono;
        }
    }
}

// function ListarManifiestosSeguimiento() {
//     const totalColumnas = $('#manThead th').length || 9;

//     let Perfil_Id = document.getElementById('perfil_id').value;
//     // Mostrar spinner de carga
//     $('#manbodyseguimiento').html(`
//         <tr>
//             <td colspan="${totalColumnas}" class="text-center py-4">
//                 <div class="spinner-border text-success" role="status"></div>
//                 <p class="mt-2 text-muted">Consultando manifiestos en seguimiento...</p>
//             </td>
//         </tr>
//     `);

//     $.post($('#base_url').val() + 'novedades/Listar_Manifiestos_Seguimiento', function (data) {
//         $('#manbodyseguimiento').empty();

//         if (data && data.length > 0) {
//             const filas = data.map((mnf) => {
//                 // Ruta origen → destino
//                 const ruta = `${mnf.origen} → ${mnf.destino}`;
//                 // Estado (puedes cambiar la lógica según tu backend)
//                 const estado = mnf.cumplido == 1
//                     ? `<span class="badge badge-phoenix badge-phoenix-success">Cumplido</span>`
//                     : `<span class="badge badge-phoenix badge-phoenix-warning">En seguimiento</span>`;

//                 return `
//                     <tr>
//                         <td>
//                             <div class="dropdown">
//                                 <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" 
//                                 id="dropdownMenuLink" href="#" role="button" 
//                                 data-bs-toggle="dropdown" aria-expanded="false">
//                                     ${mnf.placa}
//                                 </a>
//                                 <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">

//                                     ${mnf.envio_manual === "SI" && mnf.estado_configuracion === "ACTIVO" ? `
//                                         <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" id="enviar_correo" data-id="${mnf.Manifiesto}" data-ClienteId="${mnf.Cliente_Id}">
//                                             <i class="fa-solid fa-envelope"></i> <span>Enviar correo</span>
//                                         </a>
//                                     ` : ""}

//                                     ${mnf.envio_whatsapp === "SI" && mnf.estado_configuracion === "ACTIVO" ? `
//                                         <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" id="enviar_whatsapp" data-id="${mnf.Manifiesto}" data-ClienteId="${mnf.Cliente_Id}">
//                                             <i class="fa-brands fa-whatsapp"></i> <span>Enviar WhatsApp</span>
//                                         </a>
//                                     ` : ""}

//                                     ${mnf.envio_automatico === "SI" && mnf.estado_configuracion === "ACTIVO" ? `
//                                         <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" id="enviar_notificaciones" data-id="${mnf.Manifiesto}" data-ClienteId="${mnf.Cliente_Id}">
//                                             <i class="fa-solid fa-bell"></i> <span>Enviar notificación</span>
//                                         </a>
//                                     ` : ""}

//                                     <div class="dropdown-divider"></div>
//                                     <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" data-ClienteId="${mnf.Cliente_Id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasConfiguracionEnvios" aria-controls="offcanvasConfiguracionEnvios" id="btn_configuracion_envios">
//                                         <i class="fas fa-cogs"></i> <span>Configuración Notificaciones</span>
//                                     </a>

//                                     <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" data-ClienteId="${mnf.Cliente_Id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNotificacionesEnviadas" aria-controls="offcanvasNotificacionesEnviadas">
//                                         <i class="fas fa-eye"></i> <span>Ver Registros enviados</span>
//                                     </a>
//                                 </div>
//                             </div>
//                         </td>
//                         <td>${mnf.Solicitud_Id}</td>
//                         <td>${mnf.Cliente}</td>
//                         <td>${mnf.Manifiesto}</td>
//                         <td>${mnf.Remesa}</td>
//                         <td>${mnf.Orden_Cargue}</td>
//                         <td>${ruta}</td>
//                         <td>${mnf.Ultimo_Sitio}</td>
//                         <td>${mnf.novedad}</td>
//                         <td>${mnf.Feca_Expedicion}</td>
//                         <td>${estado}</td>
//                     </tr>`;
//             });

//             $('#manbodyseguimiento').html(filas.join(''));
//         } else {
//             $('#manbodyseguimiento').html(`
//                 <tr>
//                     <td colspan="${totalColumnas}" class="text-center text-muted py-4">
//                         No se encontraron manifiestos en seguimiento.
//                     </td>
//                 </tr>
//             `);
//         }
//     }, 'json').fail(function () {
//         $('#manbodyseguimiento').html(`
//             <tr>
//                 <td colspan="${totalColumnas}" class="text-center text-danger py-4">
//                     Error al cargar los manifiestos. Intenta nuevamente.
//                 </td>
//             </tr>
//         `);
//     });
// }

// Función para actualizar cada configuración individualmente

function ListarManifiestosSeguimiento() {
    const totalColumnas = $('#manThead th').length || 9;
    let Perfil_Id = document.getElementById('perfil_id').value;

    // Mostrar spinner de carga
    $('#manbodyseguimiento').html(`
        <tr>
            <td colspan="${totalColumnas}" class="text-center py-4">
                <div class="spinner-border text-success" role="status"></div>
                <p class="mt-2 text-muted">Consultando manifiestos en seguimiento...</p>
            </td>
        </tr>
    `);

    $.post(
        $('#base_url').val() + 'novedades/Listar_Manifiestos_Seguimiento',
        { perfil_id: Perfil_Id }, // 👈 enviar perfil al backend
        function (data) {
            $('#manbodyseguimiento').empty();

            if (data && data.length > 0) {
                const filas = data.map((mnf) => {
                    const ruta = `${mnf.origen} → ${mnf.destino}`;
                    // Quiero validar para saber que estado voy a mostrar
                    let estado = "";
                    if (mnf.tipo_trazabilidad !== '') {
                        estado += `<span class="badge badge-phoenix badge-phoenix-warning">${mnf.tipo_trazabilidad}</span>`;
                    } else {
                        estado += mnf.cumplido == 1
                            ? `<span class="badge badge-phoenix badge-phoenix-success">Cumplido</span>`
                            : `<span class="badge badge-phoenix badge-phoenix-warning">En seguimiento</span>`;
                    }


                    //                     ${mnf.envio_manual === "SI" && mnf.estado_configuracion === "ACTIVO" ? `
                    //     <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" id="enviar_correo" data-id="${mnf.Manifiesto}" data-ClienteId="${mnf.Cliente_Id}">
                    //         <i class="fa-solid fa-envelope"></i> <span>Enviar correo</span>
                    //     </a>
                    // ` : ""}

                    return `
                        <tr>
                            <td>
                                <div class="dropdown">
                                    <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" 
                                    id="dropdownMenuLink" href="#" role="button" 
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                        ${mnf.placa}
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">

                                        ${mnf.Estado_Pedido ? `
                                            <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" id="enviar_correo" data-Metodo='Manual' data-Proceso='Torre Control' data-id="${mnf.numdoc_solicitud}" data-ClienteId="${mnf.Cliente_Id}">
                                                <i class="fa-solid fa-envelope"></i> <span>Enviar correo</span>
                                            </a>
                                        `: mnf.envio_manual === "SI" && mnf.estado_configuracion === "ACTIVO" ? `
                                            <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" id="enviar_correo" data-Metodo='Manual' data-Proceso='Nacional' data-id="${mnf.Manifiesto}" data-ClienteId="${mnf.Cliente_Id}">
                                                <i class="fa-solid fa-envelope"></i> <span>Enviar correo</span>
                                            </a>
                                        ` : ""}

                                        ${mnf.envio_whatsapp === "SI" && mnf.estado_configuracion === "ACTIVO" ? `
                                            <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" id="enviar_whatsapp" data-id="${mnf.Manifiesto}" data-ClienteId="${mnf.Cliente_Id}">
                                                <i class="fa-brands fa-whatsapp"></i> <span>Enviar WhatsApp</span>
                                            </a>
                                        ` : ""}

                                        ${mnf.envio_automatico === "SI" && mnf.estado_configuracion === "ACTIVO" ? `
                                            <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" id="enviar_notificaciones" data-id="${mnf.Manifiesto}" data-ClienteId="${mnf.Cliente_Id}">
                                                <i class="fa-solid fa-bell"></i> <span>Enviar notificación</span>
                                            </a>
                                        ` : ""}

                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" data-ClienteId="${mnf.Cliente_Id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasConfiguracionEnvios" aria-controls="offcanvasConfiguracionEnvios" id="btn_configuracion_envios">
                                            <i class="fas fa-cogs"></i> <span>Configuración Notificaciones</span>
                                        </a>

                                        <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" data-ClienteId="${mnf.Cliente_Id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNotificacionesEnviadas" aria-controls="offcanvasNotificacionesEnviadas">
                                            <i class="fas fa-eye"></i> <span>Ver Registros enviados</span>
                                        </a>
                                    </div>
                                </div>
                            </td>
                            <td>${mnf.Solicitud_Id ?? mnf.referencia_pedido}</td>
                            <td>${mnf.Cliente ?? mnf.nombre_cliente}</td>
                            <td>${mnf.Manifiesto ?? '-'}</td>
                            <td>${mnf.Remesa ?? '-'}</td>
                            <td>${mnf.Orden_Cargue ?? '-'}</td>
                            <td>${ruta}</td>
                            <td>${mnf.Ultimo_Sitio ?? '-'}</td>
                            <td>${mnf.novedad ? mnf.novedad : mnf.observacion ? mnf.observacion : '-'}</td>
                            <td>${mnf.Feca_Expedicion ?? mnf.Fecha_Inicio}</td>
                            <td>${estado}</td>
                        </tr>`;
                });

                $('#manbodyseguimiento').html(filas.join(''));
            } else {
                $('#manbodyseguimiento').html(`
                    <tr>
                        <td colspan="${totalColumnas}" class="text-center text-muted py-4">
                            No se encontraron manifiestos en seguimiento.
                        </td>
                    </tr>
                `);
            }
        },
        'json'
    ).fail(function () {
        $('#manbodyseguimiento').html(`
            <tr>
                <td colspan="${totalColumnas}" class="text-center text-danger py-4">
                    Error al cargar los manifiestos. Intenta nuevamente.
                </td>
            </tr>
        `);
    });
}

async function actualizarConfiguracion(campo, valor, clienteId) {
    let datos = new FormData();
    datos.append("campo", campo);
    datos.append("valor", valor);
    datos.append("cliente_id", clienteId);

    try {
        const response = await fetch($('#base_url').val() + 'novedades/Actualizar_Esatdo_Configuraciom', {
            method: "POST",
            body: datos,
        });

        const resultado = await response.json();

        if (resultado) {
            showToast("success", "Éxito", `Se actualizó <b>${campo}</b> a <b>${valor}</b>`);
            // console.log(`✅ ${campo} actualizado a ${valor}`);
            ListarManifiestosSeguimiento()
        } else {
            showToast("danger", "Error", `No se pudo actualizar <b>${campo}</b>`);
            // console.warn(`⚠️ Error al actualizar ${campo}:`, resultado.message);
            ListarManifiestosSeguimiento()
        }
    } catch (error) {
        showToast("danger", "Error", "Ocurrió un error en la petición.");
        console.error("❌ Error en la petición:", error);
    }
}

// Toast con diseño más ancho
function showToast(type, title, message) {
    // Crear el contenedor si no existe
    let container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.className = "toast-container position-fixed bottom-0 end-0 p-3";
        container.style.zIndex = "1200";
        document.body.appendChild(container);
    }

    // Crear el toast
    const toastEl = document.createElement("div");
    toastEl.className = `toast align-items-center text-white bg-${type} border-0 fade`;
    toastEl.setAttribute("role", "alert");
    toastEl.setAttribute("aria-live", "assertive");
    toastEl.setAttribute("aria-atomic", "true");

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong>${title}</strong><br>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    container.appendChild(toastEl);

    // Inicializar con Bootstrap JS (para que haga la animación)
    const toast = new bootstrap.Toast(toastEl, {
        delay: 4000
    });
    toast.show();

    // Eliminar del DOM cuando termine
    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}

