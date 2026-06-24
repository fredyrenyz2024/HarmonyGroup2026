var solicitud_servicio = new Array();
var baseUrl = document.getElementById("base_url_api").value;
var apiKey = document.getElementById("api_key_nexos").value;

document.addEventListener('DOMContentLoaded', async e => {
    mostrarLoading();
    try {
        // Precarga de datos de la vista
        await cargarListasEnum();
        await cargarListaClientes();

        // Metodo inicial de la vista
        init();
        eventos();
    } catch (error) {
        console.error('Error cargando datos:', error);
    } finally {
        ocultarLoading();
    }

    document.addEventListener('click', function (e) {
        // Se filtra que el click se haga en un link o un boton
        const btn = e.target.closest('a, button');
        if (!btn) return;

        // Evento del boton de abrir el offcanva de los detalles de la alerta
        if (e.target.classList.contains('data-det-alerta')) {
            const data = {
                id: e.target.dataset.id,
                nombre: e.target.dataset.nombre,
            };
            const tabs = {
                active_tab: "reglas-tab", 
                active_content: "tab-reglas-content",
            }
            mostrarTabDetAlerta(tabs);
            limpiarDatos();
            cargarDatosDetAlerta(data);
        }

        // Evento del boton de manejo de las pestañas 
        if (e.target.classList.contains('tab-det-alerta')) {
            const elem = e.target.closest('.tab-det-alerta');
            if (!elem) return;
            const href = elem.getAttribute('href');
            const tabs = {
                active_tab: elem.id,
                active_content: href.replace('#', ''),
            };
            mostrarTabDetAlerta(tabs);
        }

        // {...} Otros eventos de click
    });

    document.getElementById('btn_crear_regla').addEventListener('click', function () {
        $("#tab-form-regla-title").text("Crear Regla")
        limpiarDatos();

        const tabs = {
            active_tab: null,
            active_content: "tab-form-regla",
        };
        mostrarTabDetAlerta(tabs);
    });
});

function eventos() {
    // ✅ Evento DataTable (TU CASO)
    $('#table-reglas')
        .off('click', '.data-info-regla')
        .on('click', '.data-info-regla', function () {

            const btn = $(this);
            const data = {
                id: btn.data('id'),
                cmx_alerta_trafico_id: btn.data('cmx_alerta_trafico_id'),
                cmx_cliente_id: btn.data('cmx_cliente_id'),
                unidad_medida: btn.data('unidad_medida'),
                valor: btn.data('valor'),
                relevancia: btn.data('relevancia'),
                estado: btn.data('estado'),
            };

            $("#tab-form-regla-title").text("Editar Regla");

            mostrarTabDetAlerta({
                active_tab: null,
                active_content: "tab-form-regla",
            });

            limpiarDatos();
            cargarDatosRegla(data);
        });
}

/***** 
 * 
 * CONSULTA DE DATOS INICIAL DE LA VISTA 
 * 
 * */
async function init() {
    mostrarLoading();
    // Destruir el DataTable si existe antes de limpiar e insertar HTML nuevo
    if ($.fn.DataTable.isDataTable('#table')) {
        $('#table').DataTable().clear().destroy();
    }
    $("#table-data").empty();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    // Limpiar datos de modulo
    await limpiarDatos();
    // Se busca la informacion de las alertas creadas
    const response = await fetch(
        `${baseUrl}alertas-trafico`,
        {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'X-API-KEY': apiKey,
                signal: controller.signal
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();

    let content = ``;
    data.data.forEach(al => {
        content+= `
            <tr>
                <td class="text-center">
                    <div class="btn-group dropend">
                        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fa-solid fa-bars mr-1"></i>
                        </button>
                        <div class="dropdown-menu p-0">
                            <a class="dropdown-item p-2" href="#" onClick="cargarDatosAlerta(${al.id})" data-bs-toggle="offcanvas" data-bs-target="#offcanvasConfigAlertas">Editar</a>
                            <a class="dropdown-item p-2 data-det-alerta" href="#" data-id="${al.id}" data-nombre="${al.nombre}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasConfigDetAlertas">Ver Reglas</a>
                        </div>
                    </div>
                </td>
                <td>${al.nombre}</td>
                <td class="text-center">
                    <div class="badge badge-phoenix badge-phoenix-primary fs-10">${al.tipo_alerta}</div>
                </td>
                <td class="text-center">
                    <div class="badge badge-phoenix ${colorEstado(al.estado)} fs-10">${al.estado}</div>
                </td>
            </tr>
        `;
    });
    $("#table-data").html(content);

    $('#table').DataTable({
        dom: '<"row justify-content-center bg-body mb-0 p-3 pb-0 dt-small"<"col-md-4 d-flex justify-content-center"f><"col-md-4 d-flex justify-content-center"i><"col-md-4 d-flex justify-content-center"l><"col-md-12 d-flex justify-content-center"p>>rt',
        responsive: true,
        scrollCollapse: true,
        paging: true,
        pageLength: 25,
        pagingType: "simple_numbers",
    });
    ocultarLoading()
}

function limpiarDatos() {
    // Formulario de creación de Alertas
    document.getElementById('frm-id').value = null;
    const form_alertas = document.getElementById('form-alertas');
    form_alertas.reset();
    form_alertas.querySelectorAll('.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
    });
    form_alertas.querySelectorAll('.is-valid').forEach(el => {
        el.classList.remove('is-valid');
    });

    // Formulario de creación de las reglas de las Alertas
    document.getElementById('frm-det-id').value = null;
    const form_reglas = document.getElementById('form-reglas');
    form_reglas.reset();
    form_reglas.querySelectorAll('.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
    });
    form_reglas.querySelectorAll('.is-valid').forEach(el => {
        el.classList.remove('is-valid');
    });
    document.getElementById("frm-det-cmx_alerta_trafico_id").value = $('#offcanvasConfigDetAlertasLabel').data('cmx_alerta_trafico_id');
}

async function cargarListasEnum() {
    mostrarLoading();
    try {
        const result = await Promise.allSettled([
            getListasEnum("#frm-tipo-alerta", "cmx_alertas_trafico", "tipo_alerta"),
            getListasEnum("#frm-estado", "cmx_alertas_trafico", "estado"),
            getListasEnum("#frm-det-estado", "cmx_alertas_trafico_det", "estado"),
            getListasEnum("#frm-det-relevancia", "cmx_alertas_trafico_det", "relevancia"),
        ]);

        const listas = result.map((lis) => {
            const el = lis.value;
            $(el.html_id).empty()
            let content = `<option value="" disabled selected>Seleccione</option>`
            el.data.forEach(el => {
                content+= `<option value="${el}">${el}</option>`;
            });
            $(el.html_id).html(content)
        });
    } catch (error) {
        console.error('Error global:', error);
    } finally {
        ocultarLoading();
    }
}

async function getListasEnum(html_id, tabla, campo) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const params = new URLSearchParams({ tabla, campo });
    const response = await fetch(
        `${baseUrl}alertas-trafico/lista_enum?${params}`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-API-KEY': apiKey
            },
            signal: controller.signal
        }
    );

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();
    return { html_id, campo, data: data.data };
}

async function cargarListaClientes() {
    mostrarLoading();
    $("#frm-det-cliente").empty()
    const controller = new AbortController();

    try {
        const timeout = setTimeout(() => controller.abort(), 30000);
        const response = await fetch(
            `${baseUrl}clientes/lista`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-API-KEY': apiKey
                },
                signal: controller.signal
            }
        );

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();

        let content = `<option value="" selected>Seleccione</option>`
        data.data.forEach(el => {
            content+= `<option value="${el.id}">${el.nombre}</option>`;
        });
        $("#frm-det-cliente").html(content)
    } catch (error) {
        console.error('Error global:', error);
    } finally {
        ocultarLoading();
    }
}

function colorEstado(estado) {
    switch (estado) {
        case "ACTIVO":
            return `badge-phoenix-success`
            break;
    
        case "INACTIVO":
            return `badge-phoenix-danger`
            break;
    
        default:
            return `badge-phoenix-secondary`
            break;
    }
}


/***** 
 * 
 * CONSULTA DE DATOS DEL OFFCANVA DE EDICION DE LAS ALERTAS 
 * 
 * */
async function cargarDatosAlerta(alerta_id = null) {
    $("#form_config_alertas_title").text("Crear");
    // Limpiar datos de modulo
    await limpiarDatos();
    if (alerta_id) {
        $("#form_config_alertas_title").text("Editar");
        await getDatosAlerta(alerta_id);
    }
}

async function getDatosAlerta(alerta_id) {
    try {
        mostrarLoading();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
    
        // Se busca la informacion de las alertas creadas
        const response = await fetch(
            `${baseUrl}alertas-trafico/${alerta_id}`,
            {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'X-API-KEY': apiKey,
                    signal: controller.signal
                },
            }
        );
    
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }
    
        const data = await response.json();
        llenarFormulario("form-alertas", data.data);
    } catch (error) {
        console.error('Error cargando datos:', error);
    } finally {
        ocultarLoading();
    }
}

function llenarFormulario(formId, data) {
    const form = document.getElementById(formId);
    for (const key in data) {
        const campo = form.querySelector(`[name="${key}"]`);

        if (!campo) continue;
        const valor = data[key] ?? '';
        switch (campo.type) {
            case "checkbox":
                campo.checked = Boolean(valor);
                break;

            case "radio":
                const radio = form.querySelector(`[name="${key}"][value="${valor}"]`);
                if (radio) radio.checked = true;
                break;

            default:
                campo.value = valor;
        }
    }
}

async function save() {
    try {
        mostrarLoading();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        const form = validarFormulario('form-alertas');
        if (form.valido) {
            const response = await fetch(
                `${baseUrl}alertas-trafico`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-API-KEY': apiKey,
                    },
                    body: JSON.stringify(form.data),
                    signal: controller.signal
                }
            );
        
            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
            }
        
            const data = await response.json();
            document.getElementById('closeOffcanvasConfigAlertas').click();
            init();
        }
    } catch (error) {
        console.error('Error guardando datos:', error);
    } finally {
        ocultarLoading();
    }
}

function validarFormulario(formId) {
    const form = document.getElementById(formId);
    let valido = true;
    // Se valida el id del formulario
    const id = document.getElementById("frm-id").value;
    let data = {id: id && id!=="" ? id : null};

    form.querySelectorAll('[name]').forEach(input => {
        const name = input.name;
        const value = input.value.trim();
        if (input.hasAttribute('required') && !value) {
            input.classList.add('is-invalid');
            valido = false;
            return; // salta este campo
        }
        input.classList.remove('is-invalid');
        data[name] = value;
    });

    return {
        valido, data
    };
}
/***** FIN - CONSULTA DE DATOS DEL OFFCANVA DE EDICION DE LAS ALERTAS */

/***** 
 * 
 * FUNCIONES PARA LA EDICION DE LOS DETALLES DE LA ALERTA
 * 
 * */
async function cargarDatosDetAlerta(data = null){
    const { id, nombre } = data;
    mostrarLoading();
    try {
        if (data) {
            $("#offcanvasConfigDetAlertasLabel").html(`<small class="pe-2">Detalles Alerta</small> ${nombre}`);
            $('#offcanvasConfigDetAlertasLabel').data('cmx_alerta_trafico_id', id)
            $('#offcanvasConfigDetAlertasLabel').data('cmx_alerta_trafico_nombre', nombre)

            // Destruir el DataTable si existe antes de limpiar e insertar HTML nuevo
            if ($.fn.DataTable.isDataTable('#table-reglas')) {
                $('#table-reglas').DataTable().clear().destroy();
            }
            $("#table-reglas-data").empty();

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 30000);

            // Se busca la informacion de las alertas creadas
            const response = await fetch(
                `${baseUrl}alertas-trafico/detalles/${id}`,
                {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'X-API-KEY': apiKey,
                        signal: controller.signal
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
            }

            const data = await response.json();
            let content = ``;
            data.data.forEach(det => {
                content+= `
                    <tr>
                        <td class="text-center">
                            <button class="btn btn-sm btn-secondary data-info-regla" type="button" 
                                data-id="${det.id}"
                                data-cmx_alerta_trafico_id="${det.cmx_alerta_trafico_id}"
                                data-cmx_cliente_id="${det.cmx_cliente_id}"
                                data-unidad_medida="${det.unidad_medida}"
                                data-valor="${det.valor}"
                                data-relevancia="${det.relevancia}"
                                data-estado="${det.estado}"
                            >
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                        <td class="text-center">
                            <div class="badge badge-phoenix ${colorRelevancia(det.relevancia)} fs-10">${det.relevancia}</div>
                        </td>
                        <td>${det?.cliente?.nombre ?? `<small class="text-body-quaternary">Regla General</small>`}</td>
                        <td class="text-center">${det.unidad_medida}</td>
                        <td class="text-center">${det.valor}</td>
                        <td class="text-center">
                            <div class="badge badge-phoenix ${colorEstado(det.estado)} fs-10">${det.estado}</div>
                        </td>
                    </tr>
                `;
            });
            $("#table-reglas-data").html(content);

            $('#table-reglas').DataTable({
                dom: '<"row justify-content-center bg-body mb-0 p-3 pb-0 dt-small"<"col-md-4 d-flex justify-content-center"f><"col-md-4 d-flex justify-content-center"i><"col-md-4 d-flex justify-content-center"l><"col-md-12 d-flex justify-content-center"p>>rt',
                responsive: true,
                scrollCollapse: true,
                paging: true,
                pageLength: 25,
                pagingType: "simple_numbers",
            });

            return;
        }
        document.getElementById('closeOffcanvasConfigDetAlertas').click();
    } catch (error) {
        console.error('Error consultando datos:', error);
    } finally {
        ocultarLoading();
    }
}

function colorRelevancia(relevancia) {
    switch (relevancia) {
        case "ALTA":
            return `badge-phoenix-danger`
            break;
    
        case "MEDIA":
            return `badge-phoenix-warning`
            break;
    
        case "BAJA":
            return `badge-phoenix-secondary`
            break;
    
        default:
            return `badge-phoenix-secondary`
            break;
    }
}

async function mostrarTabDetAlerta(tab) {
    const { active_tab, active_content } = tab;

    await document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.remove('active');
        el.setAttribute('aria-selected', 'false');
    });
    await document.querySelectorAll('.tab-pane').forEach(el => {
        el.classList.remove('show', 'active');
    });
    if (active_tab) {
        const tabElement = document.getElementById(active_tab);
        tabElement.classList.add('active');
        tabElement.setAttribute('aria-selected', 'true');
    }
    if (active_content) {
        const contentElement = document.getElementById(active_content);
        contentElement.classList.add('show', 'active');
    }
}

function cargarDatosRegla(data) {
    mostrarLoading();
    // Se asigna la informacion al formulario
    llenarFormulario("form-reglas", data);
    ocultarLoading();
}

async function saveRegla() {
    try {
        mostrarLoading();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        const form = validarFormulario('form-reglas');
        if (form.valido) {
            const response = await fetch(
                `${baseUrl}alertas-trafico/save-regla`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-API-KEY': apiKey,
                    },
                    body: JSON.stringify(form.data),
                    signal: controller.signal
                }
            );
        
            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
            }
        
            const data = await response.json();
            const tabs = {
                active_tab: "reglas-tab", 
                active_content: "tab-reglas-content",
            }
            mostrarTabDetAlerta(tabs);
            const info = {
                id: $('#offcanvasConfigDetAlertasLabel').data('cmx_alerta_trafico_id'),
                nombre: $('#offcanvasConfigDetAlertasLabel').data('cmx_alerta_trafico_nombre')
            }
            cargarDatosDetAlerta(info);
        }
    } catch (error) {
        console.error('Error guardando datos:', error);
    } finally {
        ocultarLoading();
    }
}
/***** FIN - FUNCIONES PARA LA EDICION DE LOS DETALLES DE LA ALERTA  */


/***** 
 * 
 * FUNCIONES DE MUESTRA DE LOADIG DEL MODULO 
 * 
 * */
let peticionesActivas = 0;
function mostrarLoading() {
    peticionesActivas++;
    document.getElementById('loading-overlay-nexosapp').style.display = 'flex';
}

function ocultarLoading() {
    peticionesActivas--;
    if (peticionesActivas <= 0) {
        peticionesActivas = 0;
        document.getElementById('loading-overlay-nexosapp').style.display = 'none';
    }
}
/** FIN - FUNCIONES DE MUESTRA DE LOADIG DEL MODULO */
