window.VENTANA = null; // Variable global para almacenar el ID

// sessionStorage.clear();
// Definir la función initScript globalmente
window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global
    // listarServiciosEspeciales();
    Listar_Clientes();
    Municipios();
    Listar_Servicios_Especiales();

    $(document).on("click", ".addRow", function () {
        let newRow = `
        <div class="col-12 d-flex municipio-row mb-2">
            <!-- Ciudad -->
            <div class="col-12 col-sm-12 col-md-6 col-lg-6 pe-1">
                <div class="mb-1">
                    <label style="font-size: 12px;">Ciudad</label>
                    <select name="destino_cliente_servicio_especial[]" class="form-select form-select-sm municipio-select">
                        <option value="" selected>Seleccione</option>
                    </select>
                </div>
            </div>

            <!-- Costo -->
            <div class="col-12 col-sm-12 col-md-5 col-lg-5 pe-1">
                <div class="mb-1">
                    <label style="font-size: 12px;">Costo</label>
                    <input type="text" name="costo_cliente[]" class="form-control form-control-sm" onchange="currencyMask2(this)">
                </div>
            </div>

            <!-- Botón eliminar -->
            <div class="col-12 col-sm-12 col-md-1 col-lg-1 d-flex align-items-end">
                <button type="button" class="btn btn-phoenix-danger btn-sm removeRow">
                    <span class="fas fa-minus"></span>
                </button>
            </div>
        </div>`;

        $("#municipios_container").append(newRow);

        // Inicializar Select2 en el nuevo select
        let $newSelect = $("#municipios_container .municipio-select").last();
        $newSelect.select2({
            placeholder: "Seleccione un municipio",
            allowClear: true,
            width: "100%"
        });

        // Si ya tienes los municipios cargados en memoria
        if (window.municipiosData) {
            $newSelect.empty().append('<option value="">Seleccione</option>');
            window.municipiosData.forEach(function (element) {
                $newSelect.append(
                    `<option value="${element.rndc_codigo_ciudad}">
                    ${element.municipio} - ${element.depto}
                </option>`
                );
            });
        }
    });

    // Quitar fila
    $(document).on("click", ".removeRow", function () {
        $(this).closest(".municipio-row").remove();
    });

    document.addEventListener("click", async e => {
        if (e.target.matches(`#btn_inactivar_tarifa`) || e.target.matches(`#btn_inactivar_tarifa *`)) {
            let Boton = e.target.closest(`#btn_inactivar_tarifa`);
            let TarifaId = Boton.getAttribute(`data-servicio_Id`);
            let ProveedorId = Boton.getAttribute(`data-cliente_id`);

            const data = {
                TarifaId,
                ProveedorId
            };

            try {
                const response = await fetch($("#base_url").val() + "parametros/Inactivar_tarifa_venta_servicio", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Tarifa Inactivada correctamente',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        // 📋 Refrescar listado
                        listarServiciosEspeciales();
                    });
                }
            } catch (error) {
                console.error("Error en la petición:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor'
                });
            }
        }

        if (e.target.matches(`#btn_activar_tarifa`) || e.target.matches(`#btn_activar_tarifa *`)) {
            let Boton = e.target.closest(`#btn_activar_tarifa`);
            let TarifaId = Boton.getAttribute(`data-servicio_Id`);
            let ProveedorId = Boton.getAttribute(`data-cliente_id`);
            const data = {
                TarifaId,
                ProveedorId
            };

            try {
                const response = await fetch($("#base_url").val() + "parametros/Activar_tarifa_venta_servicio", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Tarifa Activada correctamente',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        // 📋 Refrescar listado
                        listarServiciosEspeciales();
                    });
                }
            } catch (error) {
                console.error("Error en la petición:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor'
                });
            }
        }

        if (e.target.matches(`#btn_editar_tarifa`) || e.target.matches(`#btn_editar_tarifa *`)) {
            // let Boton = document.getElementById(`btn_editar_tarifa`);
            let Boton = e.target.closest(`#btn_editar_tarifa`);
            let TarifaId = Boton.getAttribute(`data-servicio_Id`);
            let ProveedorId = Boton.getAttribute(`data-cliente_id`);
            let servi_id = Boton.getAttribute(`data-ser_id`);

            const data = {
                TarifaId,
                ProveedorId,
                servi_id
            };

            try {
                const response = await fetch($("#base_url").val() + "parametros/Detalle_tarifa_venta_servicio", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result) {
                    document.getElementById(`servicio_venta_id`).value = result.cabecera.id;

                    // document.getElementById(`cliente_servicio_especial`).value = result.cabecera.cliente_id;

                    // document.getElementById(`origen_tarifa`).value = result.cabecera.origen;
                    const slct_tipo_cliente = document.getElementById('tipo_cliente');
                    const valoro_tipo_cliente = result.cabecera.Servicio_Id.toLocaleString();
                    // Buscar opción que tenga ese texto
                    let optionValue_tipo_cliente = null;
                    for (let option of slct_tipo_cliente.options) {
                        if (option.value === valoro_tipo_cliente) {
                            optionValue_tipo_cliente = option.value; // asignar el value correspondiente
                            break;
                        }
                    }

                    // Si encontramos la opción, seleccionarla con Select2
                    if (optionValue_tipo_cliente) {
                        $('#tipo_cliente').val(optionValue_tipo_cliente).trigger('change');
                    }

                    const slct_cliente_servicio_especial = document.getElementById('cliente_servicio_especial');
                    const valoro_cliente_servicio_especial = result.cabecera.cliente_id.toLocaleString();
                    // Buscar opción que tenga ese texto
                    let optionValue_cliente_servicio_especial = null;
                    for (let option of slct_cliente_servicio_especial.options) {
                        if (option.value === valoro_cliente_servicio_especial) {
                            optionValue_cliente_servicio_especial = option.value; // asignar el value correspondiente
                            break;
                        }
                    }

                    // Si encontramos la opción, seleccionarla con Select2
                    if (optionValue_cliente_servicio_especial) {
                        $('#cliente_servicio_especial').val(optionValue_cliente_servicio_especial).trigger('change');
                    }
                    document.getElementById(`estado_cliente`).value = result.cabecera.estado_servicio_venta;

                    // 📌 Iterar los costos
                    const container = document.getElementById("municipios_container");
                    container.innerHTML = ""; // limpiar antes de rellenar

                    result.costos.forEach((costo, index) => {
                        const row = document.createElement("div");
                        row.classList.add("col-12", "d-flex", "municipio-row", "mb-2");

                        row.innerHTML = `
                            <!-- Ciudad -->
                            <div class="col-12 col-sm-12 col-md-6 col-lg-6 pe-1">
                                <div class="mb-1">
                                    <label style="font-size: 12px;">Ciudad</label>
                                    <select name="destino_cliente_servicio_especial[]" 
                                            class="form-select form-select-sm municipio-select">
                                        <option value="">Seleccione</option>
                                        <option value="${costo.ciudad}" selected>${costo.Destino}</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Costo -->
                            <div class="col-12 col-sm-12 col-md-5 col-lg-5 pe-1">
                                <div class="mb-1">
                                    <label style="font-size: 12px;">Costo</label>
                                    <input type="text" name="costo_cliente[]" class="form-control form-control-sm" 
                                        value="${Number(costo.costo).toLocaleString('es-CO', {
                            style: 'currency',
                            currency: 'COP'
                        }) ?? ''}">
                                </div>
                            </div>

                            <!-- Botón agregar -->
                            <div class="col-12 col-sm-12 col-md-1 col-lg-1 d-flex align-items-end">
                                <button type="button" class="btn btn-phoenix-primary btn-sm addRow">
                                    <span class="fas fa-plus"></span>
                                </button>
                            </div>
                        `;
                        container.appendChild(row);
                    });
                }
            } catch (error) {
                console.error("❌ Error:", error);
                // tbody.innerHTML = `<tr><td colspan="7">Error al cargar tarifas</td></tr>`;
                Swal.fire("Error", "No se pudieron cargar las tarifas", "error");
            }
        }
    });

}

// 👉 Función para listar servicios especiales
function listarServiciosEspeciales() {
    $.ajax({
        url: $("#base_url").val() + "parametros/listarServiciosEspecialesVentas",
        type: "POST",
        dataType: "json",
        success: function (data) {
            let rows = "";

            if (data && data && data.length > 0) {
                data.forEach((value, index) => {
                    // Estado con colores
                    let estadoCol = (value.estado === "activo")
                        ? `<td class="text" style="color:blue;">
                               <center><span class="mdi mdi-dot-circle icon"></span></center>
                           </td>`
                        : `<td class="text" style="color:black;">
                               <center><span class="mdi mdi-dot-circle icon"></span></center>
                           </td>`;

                    // Botón editar
                    let btnEditar = `
                        <button type="button" 
                                class="btn btn-phoenix-primary btn-sm me-1 mb-1"
                                onclick="prueba_edite(this)"
                                data-id="${value.id}" 
                                data-id2="${value.nombre}" 
                                data-id3="${value.tipificacion}" 
                                data-id4="${value.estado}" 
                                data-id5="${value.costo}"
                                data-bs-toggle="modal" 
                                data-bs-target="#editar_tipo_vehiculo"
                                title="Editar Tipo Servicio">
                            <span class="fas fa-edit"></span>
                        </button>`;

                    // Construcción de fila
                    rows += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>
                                <div class="dropdown">
                                    <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${value.nombre ?? '-'}</a>
                                    <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
                                    <a class="dropdown-item fw-bold" href="#" id="btn_editar_tarifa" data-servicio_Id="${value.Servicio_Id}" data-cliente_id="${value.cliente_id}" data-ser_id="${value.id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvaTarifasVentasServiciosEspeciales" aria-controls="offcanvaTarifasVentasServiciosEspeciales">Editar Tarifa</a>
                                    ${value.estado_servicio_venta === 'Inactivo' ? `<a class="dropdown-item fw-bold" href="#" id="btn_activar_tarifa" data-servicio_Id="${value.Servicio_Id}" data-cliente_id="${value.cliente_id}">Activar Tarifa</a>` :
                            `<a class="dropdown-item fw-bold" href="#" id="btn_inactivar_tarifa" data-servicio_Id="${value.Servicio_Id}" data-cliente_id="${value.cliente_id}">Inactivar Tarifa</a>`}
                                    <!--<div class="dropdown-divider"></div>
                                    <a class="dropdown-item fw-bold" href="#">Separated link</a>-->
                                    </div>
                                </div>                            
                            </td>
                            <td>${value.tipo_servicio}</td>
                            <td>${value.tipificacion}</td>
                             <td>${crearBadgeEstado(value.estado_servicio_venta)}</td>
                            </tr>
                            `;
                    // <td>${btnEditar}</td>
                });
            } else {
                rows = `<tr><td colspan="4" class="text-center text-muted">No hay registros</td></tr>`;
            }

            $("#sericio_especial_costo_body").html(rows);
        },
        error: function (err) {
            console.error("Error al listar servicios:", err.responseText);
            $("#sericio_especial_costo_body").html(
                `<tr><td colspan="4" class="text-center text-danger">Error cargando datos</td></tr>`
            );
        }
    });
}

async function Listar_Clientes() {
    try {
        // const selectPlaca = document.getElementById("campo-84-placa");
        const selectCliente = document.getElementById(`cliente_servicio_especial`);

        // limpiar opciones (dejar solo el primero "Seleccione placa")
        selectCliente.innerHTML = `<option value="">Seleccione cliente</option>`;

        const resp = await fetch($("#base_url").val() + "indicadores/ListarClientes", {
            method: "POST"
        });

        const data = await resp.json();

        if (!data || data.length === 0) {
            let opt = document.createElement("option");
            opt.value = "";
            opt.textContent = "⚠️ No hay clientes disponibles";
            selectCliente.appendChild(opt);
            return;
        }

        // recorrer resultados y agregarlos al select
        data.forEach(item => {
            let opt = document.createElement("option");
            opt.value = item.id;   // puedes usar item.placa si lo prefieres como valor
            opt.textContent = item.nombre;
            selectCliente.appendChild(opt);
        });

        $('#cliente_servicio_especial').select2({
            placeholder: 'Seleccione una opción',
            allowClear: true
        });

    } catch (error) {
        console.error("Error al listar cliente:", error);
        Swal.fire("Error", "No se pudo cargar la lista de clientes", "error");
    }
}

// 👉 Llamar al cargar la página
$(document).ready(function () {
    listarServiciosEspeciales();
});

function tipificar() {
    //alert('cambio');
    var t = $("#tipi").val();
    if (t == 'Especial') {
        $("#costo").prop('disabled', false);
    } else {
        $("#costo").prop('disabled', true);
    }
}

function editipificar() {
    var tipo = $("#e_tipificar").val();
    if (tipo == 'Mercancia') {
        $("#e_costo").val('');
    }
    if (tipo == 'Especial') {
        $("#e_costo").val(costoanterior);
    }
}

async function creartipo() {
    try {
        // capturar valores simples
        const tipo = $("#tipo_cliente").val();
        const estado = $("#estado_cliente").val();
        const tipi = $("#tipi_cliente").val();
        const cliente_servicio_especial = $("#cliente_servicio_especial").val();
        const servicio_venta_id = $("#servicio_venta_id").val();
        // capturar arrays
        const municipios = $("select[name='destino_cliente_servicio_especial[]']")
            .map(function () { return $(this).val(); }).get();

        const costos = $("input[name='costo_cliente[]']")
            .map(function () { return $(this).val(); }).get();

        // armar FormData
        const formData = new FormData();
        formData.append("tipo", tipo);
        formData.append("estado", estado);
        formData.append("tipi", tipi);
        formData.append("cliente_servicio_especial", cliente_servicio_especial);
        formData.append("servicio_id", servicio_venta_id);

        municipios.forEach((m, i) => formData.append(`municipios[${i}]`, m));
        costos.forEach((c, i) => formData.append(`costos[${i}]`, c));

        // enviar al backend
        const response = await fetch($("#base_url").val() + "parametros/InsertarCliente", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Error HTTP: " + response.status);
        }

        const data = await response.json();

        if (data.status === 'ok') {
            Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                text: "✅ Datos Registrados Exitosamente!!",
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                // 👉 Cerrar el offcanvas
                const offcanvasEl = document.querySelector('.offcanvas.show');
                if (offcanvasEl) {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
                    bsOffcanvas.hide();
                }

                // 👉 Refrescar tabla
                listarServiciosEspeciales();
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error en el servidor",
                text: data.message || "No se guardó.",
            });
        }

    } catch (error) {
        console.error("❌ Error en creartipo:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al registrar el tipo de servicio."
        });
    }
}

function prueba_edite(element) {
    // alert('en un tetrico');
    var elemento = $(element);
    var id = elemento.data("id");
    var nombre = elemento.data("id2");
    var clase = elemento.data("id3");
    var estado = elemento.data("id4");
    var costo = elemento.data("id5");
    $("#e_tipo").val(nombre);
    $("#e_id").val(id);
    if (clase == 'Mercancia') {
        $("#e_tipificar").html('<option value="' + clase + '">' + clase + '</option>' +
            '<option value="Especial">Especial</option>');
        $("#e_costo").val('');
        $("#e_costo").prop('disabled', true);
    } else if (clase == 'Especial') {
        $("#e_tipificar").html('<option value="' + clase + '">' + clase + '</option>' +
            '<option value="Mercancia">Mercancia</option>');
        $("#e_costo").val(costo);
        $("#e_costo").prop('disabled', false);

    }

    if (estado == 'activo') {
        $("#e_estado").html('<option value="activo">activo</option>' + '<option value="inactivo">inactivo</option>');
    }
    if (estado == 'inactivo') {
        $("#e_estado").html('<option value="inactivo">inactivo</option>' + '<option value="activo">activo</option>');
    }
}

function update() {
    // alert('hhelo');
    var id_tb = $("#e_id").val();
    var nom = $("#e_tipo").val();
    var tipi = $("#e_tipificar").val();
    var estado = $("#e_estado").val();
    var ecosto = $("#e_costo").val();

    datos_editar = {
        id: id_tb,
        nom: nom,
        tipi: tipi,
        esta: estado,
        ecosto: ecosto,
        action: 'actualizar'
    };

    $.ajax({
        url: "http://localhost/mvcLuisMiguel/libs/index_tiposervicio_ajax.php",
        type: 'POST',
        data: datos_editar,
        dataType: 'json',
        success: function (data) {
            // console.log('sisi update');
            alert('Datos Actualizados Exitosamente!!');
            $("html, body").animate({ scrollTop: 0 }, 600);
            setTimeout(function () { location.reload(false); }, 800);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error update');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

async function Municipios() {
    try {
        const response = await fetch($('#base_url').val() + 'serviciocliente/Consulta_Municipios', {
            method: 'POST',
            cache: 'no-cache'
        });

        const data = await response.json();

        // 👉 guardar en memoria global para reutilizar
        window.municipiosData = data;

        // 👉 recorrer todos los selects
        $('.municipio-select').each(function () {
            const $select = $(this);
            $select.empty().append('<option value="">Seleccione un municipio</option>');

            data.forEach(function (element) {
                $select.append(
                    `<option value="${element.rndc_codigo_ciudad}" 
                             data-municipio="${element.municipio}" data-depto="${element.depto}">
                             ${element.municipio} - ${element.depto}
                     </option>`
                );
            });

            // reinicializar select2
            $select.select2({
                placeholder: 'Seleccione un municipio',
                allowClear: true,
                width: '100%'
            });
        });

    } catch (error) {
        console.error('Error en Municipios:', error);
        throw error;
    }
}

async function Listar_Servicios_Especiales() {
    //tipo_cliente
    try {
        const response = await fetch($('#base_url').val() + 'parametros/Lista_Servicios_Especiales', {
            method: 'POST',
            cache: 'no-cache'
        });

        const data = await response.json();

        // 👉 guardar en memoria global para reutilizar
        window.municipiosData = data;

        // 👉 recorrer todos los selects
        $('#tipo_cliente').each(function () {
            const $select = $(this);
            $select.empty().append('<option value="">Seleccione un municipio</option>');

            data.forEach(function (element) {
                $select.append(
                    `<option value="${element.id}">
                             ${element.nombre}
                     </option>`
                );
            });

            // reinicializar select2
            $select.select2({
                placeholder: 'Seleccione un municipio',
                allowClear: true,
                width: '100%'
            });
        });

    } catch (error) {
        console.error('Error en Municipios:', error);
        throw error;
    }
}

function crearBadgeEstado(estado) {
    let badgeClass, badgeText;

    switch (estado.toLowerCase()) {
        case 'activo':
            badgeClass = 'badge-phoenix-success';
            badgeText = 'Activo';
            break;
        case 'inactivo':
            badgeClass = 'badge-phoenix-danger';
            badgeText = 'Inactivo';
            break;
        case 'pendiente':
            badgeClass = 'badge-phoenix-warning';
            badgeText = 'Pendiente';
            break;
        case 'expirado':
            badgeClass = 'badge-phoenix-secondary';
            badgeText = 'Expirado';
            break;
        default:
            badgeClass = 'badge-phoenix-info';
            badgeText = estado;
    }

    return `<span class="badge badge-phoenix ${badgeClass}">${badgeText}</span>`;
}

function currencyMask2(ele) {
    let elemento = $(ele);
    let valor = elemento.val();

    // Quitar todo lo que no sea número
    valor = valor.replace(/[^\d]/g, "");

    if (valor === "") {
        elemento.val("");
        return;
    }

    // Convertir a número
    let numero = parseFloat(valor);

    // Formatear en pesos colombianos con dos decimales
    let formateado = numero.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 2
    });

    elemento.val(formateado);
}