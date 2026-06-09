// Se definen los parametros globales
var solicitud_servicio = new Array();
var baseUrl = document.getElementById("base_url_api").value;
var apiKey = document.getElementById("api_key_nexos").value;

document.addEventListener('DOMContentLoaded', async e => {
    // Se ejecuta la funcion inicial de la vista 
    init();
    setInterval(init, 300000);

    $('#buscar').click(function () {
        init();
    });



});

async function init() {
    try {
        mostrarLoading();
        const controller = new AbortController();
        const filter = $('#filtro').val();
        const cant_registros = document.getElementById('badge-total-tabla');
        cant_registros.textContent = 'Cargando...';

        const timeout = setTimeout(() => {
            controller.abort();
        }, 30000);

        if ($.fn.DataTable.isDataTable('#table_viajes_activos')) {
            $('#table_viajes_activos').DataTable().destroy();
        }

        try {
            /**** 
             * consulta de manifiestos en viaje activo a la base de datos de nexosapp a través de la API, se envía el filtro seleccionado por el usuario
             */
            const params = new URLSearchParams({
                filter: filter,
            });
            const response = await fetch(
                `${baseUrl}trafico/seguimientos-viajes?${params}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-API-KEY': apiKey
                    },
                    signal: controller.signal
                }
            );
            clearTimeout(timeout);
    
            if (!response.ok) {
                throw new Error(
                    `Error HTTP ${response.status}`
                );
            }

            // Si no hay errores, se procesa la respuesta
            const data = await response.json();
            cant_registros.textContent = data.data.viajes.total + ' registros';
            let template = ``;
            let solicitudes = [];

            // preguntar si existe la variable data.data.viajes.table
            if (data?.data?.viajes?.table) {
                const info = data.data.viajes.table;
                info.forEach((item, i) => {
                    const c = i + 1;
                    let colorSemaforo = colorTiempo(item.tiempo);
                    template += `
                        <tr class="text-center" id="tiempos${c}">
                            <td class="${colorSemaforo}" id="semaforo${c}">
                                <!--<a href="#" class='text-decoration-none btn-gestion-manifiesto' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" data-ManifiestoId='${item.id}'>${item.id}</a>-->
                                <a href="#" onClick="|(${item.id})">
                                    <span class="badge bg-light text-dark text-md">${item.id}</span>
                                </a>

                                <a class="badge text-bg-info text-decoration-none" href="#" id="btn_detalle_trazabilidad_viajes" data-bs-toggle="offcanvas"
                                    data-bs-target="#offcanvasViaje" onClick="getDatosManifiesto('${item.id}','${item.cod_ini_ruta}','${item.cod_plan}')" style="font-family:'Space Grotesk',sans-serif;font-weight:600">
                                    <span class="uil uil-eye"></span> ${item.id}
                                </a>

                            </td>
                            <td id="tiempo${c}"></td>
                            <td>${item.origen} - ${item.destino}</td>
                            <td>${item.placa}</td>
                            <td>${item.nombre_conductor} ${item.apellido1} ${item.apellido2}</td>
                            <td>${item.celular}</td>
                            <td>${item.nombre_cliente}</td>
                            <td id="ultimositio${c}"></td>
                            <td id="maxhorafecha${c}"></td>
                            <td id="ultimaousuario${c}"></td>
                        </tr>`;

                    if (item.cod_ini_ruta) {
                        solicitudes.push({ codini: item.cod_ini_ruta, id: c });
                    }
                });
            } else {
                console.error('No se encntró datos de viajes en la respuesta.');
                template += `
                    <tr id="tiempos_vacio">
                        <td colspan="11" class="text-center text-danger">
                            <div class="badge badge-phoenix align-items-center badge-phoenix-warning">No se encontraron datos de viajes.</div>
                        </td>
                    </tr>
                `;
            }

            $('#data_viajes_activos').html(template);
            $('#table_viajes_activos').DataTable({
                dom: '<"row justify-content-center bg-body mb-0 p-3 pb-0"<"col-md-4 d-flex justify-content-center"f><"col-md-4 d-flex justify-content-center"i><"col-md-4 d-flex justify-content-center"l><"col-md-12 d-flex justify-content-center"p>>rt',
                responsive: true,
                scrollCollapse: true,
                paging: true,
                pageLength: 25,
                pagingType: "simple_numbers",
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.8/i18n/es-ES.json'
                }
            });

            /****
             * Consulta a la base de datos de nexosapp para obtener el los ultimos seguimientos de GPS de cada manifiesto, 
             * esta consulta se hace de forma individual por cada manifiesto que se obtuvo en la consulta anterior
             * 
             */
            // Si hay manifiestos activos, se hace la consulta de los seguimientos de GPS para cada manifiesto, si no hay manifiestos activos, se omite esta parte
            const ar_viajes = data?.data?.viajes || null;
            if (ar_viajes && ar_viajes.total > 0) {
                // Se busca los id de cada manifiesto para hacer la consulta de los seguimientos de GPS
                const manifiestos_id = ar_viajes.table.map(solicitud => solicitud.id);
                const params1 = new URLSearchParams({
                    manifiestos_id,
                });

                const response1 = await fetch(
                    `${baseUrl}trafico/seguimientos-gps-manif?${params1}`,
                    {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'X-API-KEY': apiKey
                        },
                        signal: controller.signal
                    }
                );
                const data1 = await response1.json();
            }
            ocultarLoading();
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error(
                    'La petición superó el tiempo límite'
                );
            } else {
                console.error(
                    'Error de comunicación:',
                    error
                );
            }
            ocultarLoading();
            return null;
        }
    } catch (error) {
        ocultarLoading();
        console.error('Error en la solicitud:', error);
    }
}

function colorTiempo(tiempo) {
    if (tiempo < 0) {
        return 'estado-blanco';
    } else if (tiempo >= 0 && tiempo <= 30) {
        return 'estado-amarillo';
    } else if (tiempo >= 31 && tiempo <= 59) {
        return 'estado-naranja';
    } else if (tiempo >= 60 && tiempo <= 89) {
        return 'estado-rojo-claro';
    } else if (tiempo >= 90) {
        return 'estado-lila';
    } else {
        return '';
    }
}

function initMap() {
    const divMapa = document.getElementById('segMap');
    const centro = {
        lat: 4.60971,
        lng: -74.08175
    };

    const map = new google.maps.Map(
        document.getElementById('segMap'),
        {
            zoom: 12,
            center: centro,
            mapTypeId: 'roadmap'
        }
    );
}

/***
 * 
 * Funciones para abrir el offcanvas de detalles del viaje
 * 
*/
async function getDatosManifiesto(manifiesto_id, cod_ruta, cod_plan) {
    mostrarLoading();
    console.log("Entro en funcion getDatosManifiesto con ID:", manifiesto_id);
    $('.tab-viaje').removeClass('active');
    $('#demo-tab').addClass('active');
    $('.tab-content-viaje').removeClass('active show');
    $('#demo-tab-content').addClass('active show');
    $("#offcanvasViajeLabel").html(`Detalles Manifiesto ${manifiesto_id}`)

    try {
        const resultados = await Promise.allSettled([
            getInfoManifiesto(manifiesto_id),
            getSeguimientoRuta(cod_ruta),
            getSeguimientoGpsManif(manifiesto_id),
            getPlanRutaSeguimiento(manifiesto_id, cod_ruta, cod_plan),

            getOrdenesCargue(manifiesto_id),
            verificarOrdenesCargue(manifiesto_id),
        ]);

        console.log('Todo terminó', resultados);
    } catch (error) {
        console.error('Error global:', error);
    } finally {
        ocultarLoading();
    }
}

async function getInfoManifiesto(manifiesto_id){
    const manif_info = $("#manif-info");
    manif_info.empty();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
        mostrarLoading(); // ✅ usar loader global (recomendado)
        const params = new URLSearchParams({ manifiesto_id });
        const response = await fetch(
            `${baseUrl}trafico/manifiesto-info?${params}`,
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
        
        // codigo de logica de la respuesta 
        const manif = data.data.manifiesto;
        const content = `
            <div class="table-card-header">
                <div class="tc-title">
                    <i class="bi bi-truck"></i>
                    <small>Manifiesto: </small>${manif.num_manifiesto} 
                    <small>Código: </small>${manif.cod_inicio} 
                    <small>Ruta: </small>(${manif.cod_plan}) ${manif.nombre_plan}
                </div>
                <span class="badge badge-phoenix badge-phoenix-warning">${manif.estado}</span>
            </div>
            <div class="table-card-header">
                <span class="badge badge-phoenix badge-phoenix-info mb-1">Origen: ${manif.origin}</span> 
                <span class="badge badge-phoenix badge-phoenix-info">Destino: ${manif.destino}</span> 
            </div>
            <div class="card-body p-2">
                <div class="row justify-content-center g-3">
                    <!-- CONDUCTOR -->
                    <div class="col-sm-6 col-md-5 col-lg-4">
                        <div class="card border border-info h-100">
                        <div class="card-body p-2">
                            <h6 class="mb-2 text-info">Conductor</h6>
                            <small><strong>Nombre:</strong> ${manif.nombre} ${manif.apellido1} ${manif.apellido2}</small><br>
                            <small><strong>Documento:</strong> ${manif.cond_cedula}</small><br>
                            <small><strong>Celular:</strong> ${manif.celular}</small>
                        </div>
                        </div>
                    </div>

                    <!-- VEHÍCULO -->
                    <div class="col-sm-6 col-md-4 col-lg-3">
                        <div class="card border border-warning h-100">
                        <div class="card-body p-2">
                            <h6 class="mb-2 text-warning">Vehículo</h6>
                            <small><strong>Placa:</strong> ${manif.placa}</small><br>
                            <small><strong>Marca:</strong> ${manif.marca}</small><br>
                            <small><strong>Línea:</strong> ${manif.descripcion}</small><br>
                            <small><strong>Color:</strong> ${manif.color}</small>
                        </div>
                        </div>
                    </div>

                    <!-- CONFIGURACIÓN -->
                    <div class="col-sm-6 col-md-4 col-lg-3">
                        <div class="card border border-danger h-100">
                        <div class="card-body p-2">
                            <h6 class="mb-2 text-danger">Configuración</h6>
                            <small><strong>Carrocería:</strong> ${manif.carrocerias}</small><br>
                            <small><strong>Config:</strong> ${manif.configuracion}</small><br>
                            <small><strong>Año:</strong> ${manif.anio_fabricacion}</small>
                        </div>
                        </div>
                    </div>

                    <!-- TRAILER -->
                    <div class="col-sm-6 col-md-4 col-lg-3">
                        <div class="card border border-secondary h-100">
                        <div class="card-body p-2">
                            <h6 class="mb-2 text-secondary">Trailer</h6>
                            <small><strong>Placa:</strong> ${manif.Placatrailer}</small><br>
                            <small><strong>Lugar:</strong> ${manif.Lugar}</small>
                        </div>
                        </div>
                    </div>

                    <!-- GPS -->
                    <div class="col-sm-6 col-md-4 col-lg-3">
                        <div class="card border border-dark h-100">
                        <div class="card-body p-2">
                            <h6 class="mb-2 text-dark">GPS</h6>
                            <small><strong>Operador:</strong> ${manif.operador_gps}</small><br>
                            <small><strong>Usuario:</strong> ${manif.usuario_satelital}</small><br>
                            <small><strong>Web:</strong> ${manif.url}
                            <a href="${manif.url}" target="_blank">Acceder</a>
                            </small>
                        </div>
                        </div>
                    </div>

                    <!-- SALIDA -->
                    <div class="col-sm-6 col-md-4 col-lg-3">
                        <div class="card border border-light h-100">
                        <div class="card-body p-2">
                            <h6 class="mb-2 text-muted">Salida</h6>
                            <small><strong>Fecha:</strong> ${manif.ufecha}</small><br>
                            <small><strong>Hora:</strong> ${manif.uhora}</small><br>
                            <small><strong>Usuario:</strong> ${manif.usuario}</small>
                        </div>
                        </div>
                    </div>
                </div> 
            </div>
        `;
        manif_info.html(content);

        return data; // ✅ siempre devuelve resultado
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error(`Timeout en petición (manifiesto ${manifiesto_id})`);
        } else {
            console.error('Error de comunicación:', error);
        }
        return null;
    } finally {
        clearTimeout(timeout);        // ✅ SIEMPRE limpiar timeout
        ocultarLoading();             // ✅ SIEMPRE cerrar loader
    }
}

async function getSeguimientoRuta(cod_ruta){
    const data_seg = $('#data_seg_controladores');
    data_seg.empty();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    
    if ($.fn.DataTable.isDataTable('#table_seg_contoladores')) {
        $('#table_seg_contoladores').DataTable().destroy();
    }

    try {
        mostrarLoading(); // ✅ usar loader global (recomendado)

        const params = new URLSearchParams({ cod_ruta });
        const response = await fetch(
            `${baseUrl}trafico/seguimientos-ruta?${params}`,
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

        // codigo de logica de la respuesta 
        const seg = data?.data?.seguimietos_contrl ?? null;

        if (seg != null) {
            seg.forEach(function (element, index) {
                let tblBody = '';
                let cadena = element.novedad.substr(0, 7);
                let color = '';
                if (cadena === 'NOVEDAD') {
                    color = '#D50000';
                } else {
                    color = '#000000';
                }
                
                // /* Vaidar si es nota del punto del plan de ruta o de otro punto o de punto del controlador */ element.punto_controlador
                var punto = '';

                if (element.municipio === null && element.nom_punto === null && element.nombre_punto === null) {
                    punto = element.punto_controlador;
                } else if (element.municipio !== null && element.nom_punto === null && element.nombre_punto !== null) {
                    punto = element.nombre_punto;
                } else if (element.municipio !== null && element.nom_punto !== null && element.nombre_punto === null) {
                    punto = element.municipio + ' - ' + element.nom_punto;
                }

                tblBody = `
                    <tr>
                        <td class="p-1">
                            <span class="cell-detail-description" style='color:${color}'>
                              ${punto}
                            </span>
                        </td>
                        <td class="p-1">
                            <span class="cell-detail-description" style='color:${color}'>${element.fecha} - ${element.hora}</span>
                        </td>
                        <td class="p-1">
                            <span class="cell-detail-description" style='color:${color}'>${element.novedad}</span>
                        </td>
                        <td class="p-1 text-wrap">
                            <span class="cell-detail-description" style='color:${color}'> ${element.observacion}</span>
                        </td>
                        <td class="p-1">
                            <span class="cell-detail-description" style='color:${color}'>${element.usuario}</span>
                        </td>
                    </tr>`;

                data_seg.append(tblBody);
            });
        }

        $('#table_seg_contoladores').DataTable({
            dom: '<"row justify-content-center bg-body mb-0 p-3 pb-0 dt-small"<"col-md-4 d-flex justify-content-center"f><"col-md-4 d-flex justify-content-center"i><"col-md-4 d-flex justify-content-center"l><"col-md-12 d-flex justify-content-center"p>>rt',
            responsive: true,
            scrollCollapse: true,
            paging: true,
            pagingType: "simple_numbers",
            pageLength: 100,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.8/i18n/es-ES.json'
            }
        });

        return data; // ✅ siempre devuelve resultado
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error(`Timeout en petición (manifiesto ${cod_ruta})`);
        } else {
            console.error('Error de comunicación:', error);
        }
        return null;
    } finally {
        clearTimeout(timeout);        // ✅ SIEMPRE limpiar timeout
        ocultarLoading();             // ✅ SIEMPRE cerrar loader
    }
}

async function getSeguimientoGpsManif(manifiesto_id){
    const data_seg = $('#data_seg_gps');
    data_seg.empty();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    if ($.fn.DataTable.isDataTable('#table_seg_gps')) {
        $('#table_seg_gps').DataTable().destroy();
    }

    try {
        mostrarLoading(); // ✅ usar loader global (recomendado)

        const params = new URLSearchParams({ manifiesto_id });
        const response = await fetch(
            `${baseUrl}trafico/seguimientos-seg-gps-manif?${params}`,
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

        // codigo de logica de la respuesta 
        const seg = data?.data?.seguimietos_gps ?? null;
        if (seg) {
            $("#pre-data").html(seg);
            seg.forEach(function (element, index) {
                let tblBody = '';
                tblBody = `
                    <tr>
                        <td class="p-1">${element.estado_vehiculo}</td>
                        <td class="p-1">${element.placa}</td>
                        <td class="p-1">${element.evento}</td>
                        <td class="p-1">${element.velocidad} <small>(Km/h)</small></td>
                        <td class="p-1">${element.tiempo_detenido} <small>(min)</small></td>
                        <td class="p-1">${element.estado_localizacion}</td>
                        <td class="p-1">${element.fecha_evento}</td>
                        <td class="p-1">${element.fecha_registro}</td>
                        <td class="p-1">
                            ${element.direccion} 
                            <small>${element.localidad ?? ''} ${element.barrio ? ' - ' + element.barrio : ''}</small>
                        </td>
                        <td class="p-1">${element.ciudad}</td>
                        <td class="p-1 text-wrap">${element.departamento}</td>
                        <td class="p-1">${element.odometro} <small>(Kms)</small></td>
                        <td class="p-1">${element.sentido}</td>
                        <td class="p-1">${element.estado_seguimiento}</td>
                    </tr>`;

                data_seg.append(tblBody);
            });
        }

        $('#table_seg_gps').DataTable({
            dom: '<"row justify-content-center bg-body mb-0 p-3 pb-0 dt-small"<"col-md-4 d-flex justify-content-center"f><"col-md-4 d-flex justify-content-center"i><"col-md-4 d-flex justify-content-center"l><"col-md-12 d-flex justify-content-center"p>>rt',
            responsive: true,
            scrollCollapse: true,
            paging: true,
            pageLength: 25,
            pagingType: "simple_numbers",
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.8/i18n/es-ES.json'
            }
        });

        return data; // ✅ siempre devuelve resultado
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error(`Timeout en petición (manifiesto ${manifiesto_id})`);
        } else {
            console.error('Error de comunicación:', error);
        }
        return null;
    } finally {
        clearTimeout(timeout);        // ✅ SIEMPRE limpiar timeout
        ocultarLoading();             // ✅ SIEMPRE cerrar loader
    }
}

async function getPlanRutaSeguimiento(manifiesto_id, cod_ruta, cod_plan){
    console.log(`Entro en funcion getPlanRutaSeguimiento con id ${manifiesto_id}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
        mostrarLoading(); // ✅ usar loader global (recomendado)

        const params = new URLSearchParams({ manifiesto_id, cod_ruta, cod_plan });
        const response = await fetch(
            `${baseUrl}trafico/plan-ruta-seguimientos?${params}`,
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

        // codigo de logica de la respuesta 
        console.log(data);

        return data; // ✅ siempre devuelve resultado
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error(`Timeout en petición (manifiesto ${manifiesto_id})`);
        } else {
            console.error('Error de comunicación:', error);
        }
        return null;
    } finally {
        clearTimeout(timeout);        // ✅ SIEMPRE limpiar timeout
        ocultarLoading();             // ✅ SIEMPRE cerrar loader
    }
}

async function getOrdenesCargue(manifiesto_id){
    console.log(`Entro en funcion getOrdenesCargue con id ${manifiesto_id}`);
}        

async function verificarOrdenesCargue(manifiesto_id){
    console.log(`Entro en funcion verificarOrdenesCargue con id ${manifiesto_id}`);
}    

/** FUNCIONES DE MUESTRA DE LOADIG DEL MODULO */
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







// async function Tabla_SinFiltro() {
//     try {
//         const response = await fetch($('#base_url').val() + 'trafico/Datos_SinFiltro', {
//             method: 'POST',
//             cache: 'no-cache',
//         });
//         const data = await response.json();

//         if (data) {
//             let template = '';
//             let promises = [];

//             for (let m = 0; m < data.data.length; m++) {
//                 const item = data.data[m];
//                 const c = m + 1;

//                 template += `
//                     <tr id="tiempos${c}">
//                         <td style="width: auto; white-space: nowrap;text-align: center;" id="semaforo${c}">
//                             <a href="#" class='text-white text-decoration-none' onClick="Registra_Seguimiento(${item['id']})">${item['id']}</a>
//                         </td>
//                         <td style="width: auto; white-space: nowrap;" id="tiempo${c}"></td>
//                         <td style="width: auto; white-space: nowrap;">${item['origen']} - ${item['destino']}</td>
//                         <td style="width: auto; white-space: nowrap;">${item['placa']}</td>
//                         <td style="width: auto; white-space: nowrap;">${item['nombre_conductor']} ${item['apellido1']} ${item['apellido2']}</td>
//                         <td style="width: auto; white-space: nowrap;">${item['celular']}</td>
//                         <td style="width: auto; white-space: nowrap;">${item['nombre']}</td>
//                         <td style="width: auto; white-space: nowrap;" id="ultimositio${c}"></td>
//                         <td style="width: auto; white-space: nowrap;" id="maxhorafecha${c}"></td>
//                         <td style="width: auto; white-space: nowrap;" id="ultimaousuario${c}"></td>
//                     </tr>
//                 `;

//                 // Llama a ultimahorafecha y almacena la promesa
//                 if (item['cod_ini_ruta'] != null) {
//                     promises.push(
//                         new Promise(resolve => {
//                             ultimahorafecha(item['cod_ini_ruta'], c);
//                             resolve();
//                         }),
//                     );

//                     promises.push(
//                         new Promise(resolve => {
//                             semaforo(item['cod_ini_ruta'], c);
//                             resolve();
//                         }),
//                     );
//                 }
//             }

//             $('#tablero').html(template);

//             // Espera a que todas las actualizaciones dinámicas terminen
//             await Promise.all(promises);

//             // Inicializa DataTables después de actualizar dinámicamente los datos
//             new DataTable('#tbl_Manifiestos_seguimiento', {
//                 destroy: true,
//                 paging: false,
//                 searching: true,
//                 ordering: true,
//                 order: [[1, 'desc']],
//                 info: false,
//                 responsive: true,
//                 pageLength: 100,
//                 dom: '<"row"<"col-sm-10 custom-search"f><"col-sm-2 text-right"B>>' + '<"row"<"col-sm-12"tr>>',
//                 buttons: [
//                     {
//                         extend: 'excelHtml5',
//                         text: '<i class="fa-regular fa-file-excel"></i> Exportar a Excel',
//                         className: 'btn btn-success input-sm',
//                         exportOptions: {
//                             columns: ':visible',
//                             modifier: { page: 'all' },
//                         },
//                     },
//                 ],
//                 language: {
//                     decimal: ',',
//                     thousands: '.',
//                     lengthMenu: 'Mostrar _MENU_ registros por página',
//                     zeroRecords: 'No se encontraron resultados',
//                     info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
//                     infoEmpty: 'Mostrando 0 a 0 de 0 registros',
//                     infoFiltered: '(filtrado de _MAX_ registros totales)',
//                     search: 'Buscar:',
//                     paginate: { first: 'Primero', last: 'Último', next: 'Siguiente', previous: 'Anterior' },
//                 },
//             });
//         } else {
//             alert('Error al traer los datos');
//         }
//     } catch (error) {
//         console.error('Error en la solicitud:', error);
//     } finally {
//         Tabla_llegada();
//         await Contadores_manifiestos();
//     }
// }

function getTipoManifiesto(tipo) {
    const tipos = {
        1: 'General',
        2: 'Multiparada',
        3: 'Viaje Vacío',
        4: 'Varios viajes en el Día',
        8: 'Viaje de Ida y Regreso',
    };
    return tipos[tipo] || 'Desconocido';
}

function getPlanInfo(codigo) {
    return codigo ? { plan: 'SI', color: 'success' } : { plan: 'NO', color: 'danger' };
}

function Registra_Seguimiento(manifiesto) {
    url = $('#base_url').val() + 'control_ruta/redireccionar/?idmenu=5&m=' + manifiesto;
    window.open(url, '_self');
}

// Inicializar la variable de tiempo
// var tiempo = -59;
// function semaforo(codini, id, manifiesto) {
//     var consulta = { codini: codini };

//     $.ajax({
//         url: $('#base_url').val() + 'trafico/consulta_semaforo',
//         type: 'POST',
//         data: consulta,
//         dataType: 'json',
//         success: function (data) {
//             if (data != null) {
//                 data.forEach(element => {
//                     var resultado = parseFloat(element.tiempo);
//                     var texto = resultado.toLocaleString();
//                     var color = '';

//                     // Determina el color según el resultado
//                     if (resultado < 0) {
//                         color = '#FFFFFF'; // Blanco
//                     } else if (resultado >= 0 && resultado <= 30) {
//                         color = '#FFFF6C'; // Amarillo
//                     } else if (resultado >= 31 && resultado <= 59) {
//                         color = '#FF9E5E'; // Naranja
//                     } else if (resultado >= 60 && resultado <= 89) {
//                         color = '#FF8891'; // Rojo claro
//                     } else if (resultado >= 90 && resultado <= 119) {
//                         color = '#DDBBFF'; // Lila
//                     } else if (resultado >= 120) {
//                         color = '#DDBBFF'; // Lila
//                     }

//                     // Actualiza el semáforo y el tiempo en la tabla
//                     $(`#semaforo${id}`).css('background-color', color);
//                     $(`#tiempo${id}`).html(`<p>${texto}</p>`);

//                     // Actualiza los datos en DataTables
//                     const table = $('#tbl_Manifiestos_seguimiento').DataTable();
//                     const rowIndex = table.row(`#tiempos${id}`).index();
//                     const rowData = table.row(rowIndex).data();

//                     // Modifica los datos dinámicamente en DataTables
//                     rowData[1] = `<div style="background-color:${color}; width:100%; height:100%;"></div>`; // Columna del semáforo
//                     rowData[1] = texto; // Columna del tiempo

//                     table.row(rowIndex).data(rowData).draw(false); // Actualiza la fila
//                 });
//             }
//         },
//         error: function (jqXHR, textStatus, errorThrown) {
//             console.error('Error al obtener semáforo:', textStatus, errorThrown);
//         },
//     });
// }

// function ultimahorafecha(codini, id) {
//     const maximo = { codini: codini };

//     $.ajax({
//         url: $('#base_url').val() + 'trafico/consulta_notas',
//         type: 'POST',
//         data: maximo,
//         dataType: 'json',
//         success: function (data) {
//             if (data != null) {
//                 data.forEach(element => {
//                     // Actualiza el contenido dinámico
//                     $(`#maxhorafecha${id}`).html(`${element.fecha} - ${element.hora}`);
//                     $(`#ultimositio${id}`).html(`${element.Municipio}`);
//                     // $(`#ultimaobservacion${id}`).html(`${element.observacion}`);
//                     $(`#ultimaousuario${id}`).html(`${element.usuario}`);

//                     // Actualiza el estado interno de DataTables
//                     const table = $('#tbl_Manifiestos_seguimiento').DataTable();
//                     const rowIndex = table.row(`#tiempos${id}`).index(); // Encuentra el índice de la fila
//                     const rowData = table.row(rowIndex).data(); // Obtiene los datos de la fila

//                     // Modifica los datos dinámicamente en el estado de DataTables
//                     rowData[8] = `${element.fecha} - ${element.hora}`; // Columna maxhorafecha
//                     rowData[7] = `${element.Municipio}`; // Columna ultimositio
//                     // rowData[9] = `${element.observacion}`; // Columna ultimaobservacion
//                     rowData[9] = `${element.usuario}`; // Columna ultimaousuario

//                     table.row(rowIndex).data(rowData).draw(false); // Actualiza la fila
//                 });
//             } else {
//                 // Manejo de datos en blanco
//                 $(`#maxhorafecha${id}`).html('<strong>No existe una novedad aún</strong>');
//                 $(`#ultimositio${id}`).html('<strong>No tiene sitio de control</strong>');
//                 // $(`#ultimaobservacion${id}`).html('<strong>No tiene observaciones</strong>');
//                 $(`#ultimaousuario${id}`).html('<strong>No tiene usuario</strong>');
//             }
//         },
//         error: function (jqXHR, textStatus, errorThrown) {
//             console.error(jqXHR, textStatus, errorThrown);
//         },
//     });
// }


// Gestion de seguimientos y notas
function Tarjeta_Seguimiento(manifi) {
    //Tarjeta de seguimiento
    var tabla = {
        manifiesto: manifi,
        // action: "consultar_inicioruta",
    };
    $('#body_esconder').html('');
    $.ajax({
        // url: url,
        url: $('#base_url').val() + 'trafico/Consultar_inicio_ruta',
        type: 'POST',
        data: tabla,
        dataType: 'json',
        success: function (data) {
            if (data) {
                var c = 0;
                data.forEach(function (element, index) {
                    c++;
                    //var codini=element.id;
                    codini = element.cod_inicio;
                    codigo_plan = element.cod_plan;
                    // plan_ruta(codigo_plan, codini, manifi);
                    planilla = element.id_estudio_seguridad;
                    placa = element.placa;
                    mani = element.med;
                    dcondu = element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2;
                    med = element.med;
                    manifiesto = element.num_manifiesto;
                    // ultimanovedad(codini, c);
                    let codinin = codini;
                    // Informacio_Principal(manifi, codinin);
                    // Consulta_Seguimiento_Actual(codini);
                    let btngestor = '';
                    if (element.estado != 'Entregado') {
                        btngestor = `
                            <button type="button" class="btn btn-primary btn-md mdi mdi-truck" id="btn_ver${c}" data-toggle="modal" data-target="#ver_gestion" data-placement="top" title="Realizar Gestión" onclick="gestion(this)" data-id="${codini}" data-id2="${mani}" data-id3="${placa}" data-id4="${dcondu}" data-id6="${codigo_plan}" data-id7="${med}" data-id8="${planilla}" data-id9="${manifiesto}"></button>`;
                    } else {
                        btngestor = `
                            <button type="button" class="btn btn-primary btn-md mdi mdi-truck" id="btn_ver${c}" data-toggle="modal" data-target="#" data-placement="top" title="Realizar Gestión" onclick="gestion(this)" data-id="${codini}"></button>`;
                    }
                });
                plan_ruta(codigo_plan, codini, manifi);
                Informacio_Principal(manifi, codini);
                Consulta_Seguimiento_Actual(codini);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert("ocurrio un error en consulta de tabla");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
    });
}

/* Función para cargar el plan de ruta */
function plan_ruta(codigoPlan, codigoInicio, manifi) {
    var cont = {
        id_plan: codigoPlan,
        codigo_ini: codigoInicio,
        manifiesto: manifi,
    };

    var pcarraylat = [];
    var pcarraylong = [];
    var namepc = [];

    $.ajax({
        url: $('#base_url').val() + 'planruta/Listar_plan_ruta_seguimiento',
        type: 'POST',
        data: cont,
        dataType: 'json',
        success: function (data) {
            if (data) {
                var t = 0;
                var notas = data.notas_puntos;
                var puntos = data.plan_ruta;

                // Ordenar puntos para que "Lugar Llegada" esté siempre al final
                puntos.sort((a, b) => {
                    if (a.nombre_punto === 'Lugar Llegada') return 1;
                    if (b.nombre_punto === 'Lugar Llegada') return -1;
                    return 0;
                });

                $('#panel_control_plan_ruta').html('');
                puntos.forEach(function (element, index) {
                    // Determinar clasificación del punto
                    var clasificacion = element.tipo_punto === 'punto control' ? 'punto físico' : 'punto virtual';

                    // Agregar fila de punto al panel de control
                    $('#panel_control_plan_ruta').append(
                        `<tr style='border: 1px solid #ddd;padding: 1px;background-color:#fff;' class='punto_control${element.cod_punto}'>
                            <td class='control_punto${element.cod_punto}'>
                                <a href='Javascript:void(0);' onclick='formulario_seguimiento(${manifi});'
                                data-lat="${element.latitud}" data-long="${element.longitud}" data-punto="${element.nombre_punto}"
                                data-id="${element.idmunicipio}" data-cod_punto="${element.cod_punto}"  class="puntos_list">
                                ${element.nombre_punto} (${clasificacion})
                                </a>
                            </td>
                            <td class="fecha_control${element.cod_punto}"></td>
                            <td class="novedad_control${element.cod_punto}"></td>
                            <td>${element.municipio}-${element.depto}</td>
                            <td class="usuario_control${element.cod_punto}"></td>
                        </tr>`,
                    );

                    // Guardar datos de punto en arrays
                    pcarraylat[t] = [element.latitud];
                    pcarraylong[t] = [element.longitud];
                    namepc[t] = [element.nombre_punto];
                    t++;

                    // Agregar controlador de clic a los enlaces de puntos
                    $('.puntos_list').on('click', function (event) {
                        event.preventDefault();
                        var dataPunto = $(this).data('punto');
                        var dataLatitud = $(this).data('lat');
                        var dataLongitud = $(this).data('long');
                        var dataId = $(this).data('id');
                        var dataCodPunto = $(this).data('cod_punto');

                        // Guardar datos en localStorage
                        localStorage.setItem('puntos', dataPunto);
                        localStorage.setItem('latitud', dataLatitud);
                        localStorage.setItem('longitud', dataLongitud);
                        localStorage.setItem('municipio_id', dataId);
                        localStorage.setItem('codigo_punto', dataCodPunto);
                    });
                });

                notas_control(notas, puntos);
                // pintar_mapacontrol(latori, latdes, longori, longdes, pcarraylat, pcarraylong, namepc);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
    });
}

/* Funcion para llenar información principal de seguimiento */
async function Informacio_Principal(manifi, codinin) {
    $('#loading-overlay-nexosapp ').css('display', 'flex');
    let datos = new FormData();
    datos.append('manifiesto', manifi);

    //Nueva consulta  modificada con el fecht
    try {
        const response = await fetch($('#base_url').val() + 'trafico/seguimiento_ruta', {
            method: 'POST',
            body: datos,
            cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
            data.forEach(function (element, index) {
                var dcondu = element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2;
                codigoPlan = element.cod_plan;
                codigoInicio = element.cod_inicio;
                // plan_ruta(codigoPlan);
                $('.manifiesto').html(element.num_manifiesto);
                // $(".agencia").html(decodeURIComponent(escape(element.Lugar)));
                $('.agencia').html(element.Lugar);
                $('.conductor').html(dcondu);
                $('.documento').html(element.cond_cedula);
                $('.celular').html(element.celular);
                $('.telefono').html(element.celular);
                $('.marca').html(element.marca);
                $('.linea').html(element.descripcion);
                $('.color').html(element.color);
                $('.operador-gps').html(element.operador_gps);
                $('.url-gps').attr('href', element.url);
                $('.url-gps').html(element.url);
                $('.usuario-gps').html(element.usuario_satelital);
                $('.usuario-salida').html(element.usuario);
                $('.remolque').html(element.Placatrailer);

                /* Segunda columna de la tabla de informacioón */
                $('.origen').html(element.origin);
                $('.destino').html(element.destini);
                $('.ruta').html(element.nombre_plan);
                $('.fecha-salida').html(element.fechasalida + '-' + element.horasalida);
                // $(".fecha-llegada").html(element.nombre_plan);
                $('.configuración').html(element.configuracion);
                $('.carroceria').html(element.carrocerias);
                $('.id-gps').html(element.id);
                $('.clave-gps').html(element.clave_satelital);
                $('.placa').html(element.placa);
                $('.modelo').html(element.anio_fabricacion);
                $('.fecha-llegada').html(element.fecha_descargue && element.hora_descargue ? element.fecha_descargue + '-' + element.hora_descargue : 'Sin resgistrar' + ' - ' + 'Sin resgistrar');
            });
        } else {
        }
    } catch (error) {
        console.error('Error en la primera solicitud:', error);
        throw error;
    } finally {
        $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        // Puntos_geograficos(codigoPlan, codinin);
    }
}

/* Funciones para llenar la tabla de informacion de remesa*/
function Informacion(manifi) {
    $.post(
        $('#base_url').val() + 'tiempo_logistico_cargue/Selecciona_Ordenes',
        'manifiesto=' + manifi,
        function (data) {
            if (data) {
                data.forEach(element => {
                    // Primera validación: Verificar órdenes de carga
                    $.post(
                        $('#base_url').val() + 'tiempo_logistico_cargue/Verificar_ordenes',
                        'orden_cargue=' + element.id + '&manifiesto=' + manifi,
                        function (datosOrden) {
                            if (datosOrden.length > 0) {
                                // Segunda validación: Verificar remesas
                                $.post(
                                    $('#base_url').val() + 'tiempo_logistico_descargue/Verificar_ordenes',
                                    'remesa=' + element.Remesa + '&manifiesto=' + manifi,
                                    function (datosRemesa) {
                                        if (datosRemesa.length > 0) {
                                            $('#tbl_informacion').append(`
                                                <tr>
                                                    <td style="background-color: #FFFFFF;border-right:1px #ddd solid;">
                                                        <a href="Javascript:void(0)" onclick="abrir_orden_carga(${manifi},${element.id});" style="font-weight:bold;">[${element.id}]</a>
                                                        <input type="hidden" name="orden_cargue_id[]" value="${element.id}" class="orden_cargue_id">
                                                    </td>
                                                    <td style="background-color: #FFFFFF;border-right:1px #ddd solid;">
                                                        <a href="Javascript:void(0)" onclick="abrir_remesa(${manifi},${element.Remesa});" style="font-weight:bold;">[${element.Remesa}]</a>
                                                        <input type="hidden" name="remesa_descargue_id[]" value="${element.Remesa}" class="remesa_descargue_id">
                                                    </td>
                                                    <td style="border-right:1px #ddd solid;">0000-00-00 00-00-00</td>
                                                    <td style="border-right:1px #ddd solid;">${element.peso}Kg</td>
                                                    <td style="border-right:1px #ddd solid;">Volumen</td>
                                                    <td style="border-right:1px #ddd solid;">${element.empaque}</td>
                                                    <td style="border-right:1px #ddd solid;">${element.mer_producto}</td>
                                                    <td style="border-right:1px #ddd solid;">${element.Cliente}</td>
                                                    <td style="border-right:1px #ddd solid;">${element.Remitente}</td>
                                                    <td style="border-right:1px #ddd solid;">${element.Destinatario}</td>
                                                </tr>
                                            `);
                                        } else {
                                            $('#tbl_informacion').append(`
                                                <tr>
                                                    <td style="background-color: #FFFFFF;border-right:1px #ddd solid;">
                                                        <a href="Javascript:void(0)" onclick="abrir_orden_carga(${manifi},${element.id});" style="font-weight:bold;">[${element.id}]</a>
                                                        <input type="hidden" name="orden_cargue_id[]" value="${element.id}" class="orden_cargue_id">
                                                    </td>
                                                    <td style="background-color: #FFCDD2;border-right:1px #ddd solid;">
                                                        <a href="Javascript:void(0)" onclick="abrir_remesa(${manifi},${element.Remesa});" style="font-weight:bold;">[${element.Remesa}]</a>
                                                        <input type="hidden" name="remesa_descargue_id[]" value="${element.Remesa}" class="remesa_descargue_id">
                                                    </td>
                                                    <td style="border-right:1px #ddd solid;">0000-00-00 00-00-00</td>
                                                    <td style="border-right:1px #ddd solid;">${element.peso}Kg</td>
                                                    <td style="border-right:1px #ddd solid;">Volumen</td>
                                                    <td style="border-right:1px #ddd solid;">${element.empaque}</td>
                                                    <td style="border-right:1px #ddd solid;">${element.mer_producto}</td>
                                                    <td style="border-right:1px #ddd solid;">${element.Cliente}</td>
                                                    <td style="border-right:1px #ddd solid;">${element.Remitente}</td>
                                                    <td style="border-right:1px #ddd solid;">${element.Destinatario}</td>
                                                </tr>
                                            `);
                                        }
                                    },
                                    'json',
                                );
                            } else {
                                $('#tbl_informacion').append(`
                                    <tr>
                                        <td style="background-color: #FFCDD2;border-right:1px #ddd solid;">
                                        <a href="Javascript:void(0)" onclick="abrir_orden_carga(${manifi},${element.id});" style="font-weight:bold;">[${element.id}]</a>
                                        <input type="hidden" name="orden_cargue_id[]" value="${element.id}" class="orden_cargue_id">
                                        </td>
                                        <td style="background-color: #FFCDD2;border-right:1px #ddd solid;">
                                        <a href="Javascript:void(0)" onclick="abrir_remesa(${manifi},${element.Remesa});" style="font-weight:bold;">[${element.Remesa}]</a>
                                        <input type="hidden" name="remesa_descargue_id[]" value="${element.Remesa}" class="remesa_descargue_id">
                                        </td>
                                        <td style="border-right:1px #ddd solid;">0000-00-00 00-00-00</td>
                                        <td style="border-right:1px #ddd solid;">${element.peso}Kg</td>
                                        <td style="border-right:1px #ddd solid;">Volumen</td>
                                        <td style="border-right:1px #ddd solid;">${element.empaque}</td>
                                        <td style="border-right:1px #ddd solid;">${element.mer_producto}</td>
                                        <td style="border-right:1px #ddd solid;">${element.Cliente}</td>
                                        <td style="border-right:1px #ddd solid;">${element.Remitente}</td>
                                        <td style="border-right:1px #ddd solid;">${element.Destinatario}</td>
                                    </tr>
                                `);
                            }
                        },
                        'json',
                    );
                });
            }
        },
        'json',
    );
}

function Consulta_Seguimiento_Actual(codini) {
    var buscar = {
        codini: codini,
    };
    $.ajax({
        url: $('#base_url').val() + 'trafico/consulta_seguimiento',
        type: 'POST',
        data: buscar,
        dataType: 'json',
        success: function (data) {
            $('#seguimiento_real').html('');
            if (data != null) {
                data.forEach(function (element, index) {
                    var tblBody = '';
                    let cadena = element.novedad.substr(0, 7);
                    let color = '';
                    if (cadena === 'NOVEDAD') {
                        color = '#D50000';
                    } else {
                        color = '#000000';
                    }

                    // /* Vaidar si es nota del punto del plan de ruta o de otro punto o de punto del controlador */ element.punto_controlador
                    var punto = '';

                    if (element.municipio === null && element.nom_punto === null && element.nombre_punto === null) {
                        punto = element.punto_controlador;
                    } else if (element.municipio !== null && element.nom_punto === null && element.nombre_punto !== null) {
                        punto = element.nombre_punto;
                    } else if (element.municipio !== null && element.nom_punto !== null && element.nombre_punto === null) {
                        punto = element.municipio + ' - ' + element.nom_punto;
                    }

                    tblBody = `
						<tr>
							<td class="p-1">
                <span class="cell-detail-description" style='color:${color}'>
                  ${punto}
                </span>
              </td>
							<td class="p-1">
								<span class="cell-detail-description" style='color:${color}'>${element.fecha} - ${element.hora}</span>
							</td>
							<td class="p-1">
								<span class="cell-detail-description" style='color:${color}'>${element.novedad}</span>
							</td>
							<td class="p-1">
								<span class="cell-detail-description" style='color:${color}'> ${element.observacion}</span>
							</td>
							<td class="p-1">
								<span class="cell-detail-description" style='color:${color}'>${element.usuario}</span>
							</td>
						</tr>`;
                    $('#seguimiento_real').append(tblBody);
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('no trajo seguimientos');
            // console.log(jqXHR);
            // console.log(textStatus);
            // console.log(errorThrown);
        },
    });
}

function notas_control(notas, puntos) {
    var t = 0;
    var longitud = notas.length;
    var longitud_puntos = puntos.length;
    notas.forEach(element => {
        var clasificacion;
        if (element.tipo_punto == 'punto geografico') {
            clasificacion = 'punto virtual';
        }
        if (element.estado_punto === 'CERRADO') {
            $(`.control_punto${element.cod_punto}`).html(`
            <a href='Javascript:void(0);' style="pointer-events: none;cursor: not-allowed;color: #332D2D;">
                ${element.nombre_punto}(${clasificacion})
            </a>
          `);
            $(`.punto_control${element.cod_punto}`).css('backgroundColor', '#d8dfea');
            $(`.fecha_control${element.cod_punto}`).html(element.Hora_gestion);
            $(`.novedad_control${element.cod_punto}`).html(element.novedad);
            $(`.usuario_control${element.cod_punto}`).html(element.usuario);
        }
    });
}

/* Formulario de seguimientos */
function formulario_seguimiento(manifi) {
    fetch($('#base_url').val() + 'views/templates/formulario_seguimiento.phtml')
        .then(response => response.text())
        .then(data => {
            document.getElementById('contenido-controlador').innerHTML = data;
            $(document).ready(function () {
                gestion(manifi);
                // listanovedades();
                $('#notas_controlador').css('display', 'none');
                $('#plan_ruta_lista').css('display', 'none');
                $('#mapa_recorrido').css('display', 'none');
                if ($('#ocurrio option:selected').val() === 'En sitio') {
                    $('#nota').css('display', 'none');
                    $('#accion').css('display', 'block');

                    $('#accion').val(localStorage.getItem('puntos'));
                    $('#ubilatitud').val(localStorage.getItem('latitud'));
                    $('#ubilongitud').val(localStorage.getItem('longitud'));
                    $('#accion_id').val(localStorage.getItem('municipio_id'));
                    $('#codigo_punto').val(localStorage.getItem('codigo_punto'));
                }

                $('#ocurrio').change(function () {
                    $('#ubilatitud').val('');
                    $('#ubilongitud').val('');
                    var ocurrio = $('#ocurrio').val();
                    if (ocurrio === 'En sitio') {
                        $('#nota').css('display', 'none');
                        $('#accion').css('display', 'block');
                        $('#accion').css('disabled', true);
                        $('#accion').val(localStorage.getItem('puntos'));
                        $('#ubilatitud').val(localStorage.getItem('latitud'));
                        $('#ubilongitud').val(localStorage.getItem('longitud'));
                        $('#accion_id').val(localStorage.getItem('municipio_id'));
                        $('#codigo_punto').val(localStorage.getItem('codigo_punto'));
                    } else {
                        $('#nota').css('display', 'block');
                        $('#accion').css('display', 'none');
                        $('#accion').val('');
                        $('#ubilatitud').val('');
                        $('#ubilongitud').val('');
                        $('#accion_id').val('');
                        $('#codigo_punto').val('');

                        // Seleccionar el campo de entrada
                        var $miInput = $('#nota');
                        // Seleccionar el elemento donde mostrar el resultado
                        var $resultado = document.getElementById('searchResults');
                        var currentFocus = -1; // Índice de la selección actual

                        // Agregar un controlador de eventos para el evento input
                        $miInput.on('input', function () {
                            // Obtener el valor actual del campo de entrada
                            var valorInput = $miInput.val();
                            // Actualizar el contenido del elemento resultado
                            if (valorInput !== '') {
                                $.post(
                                    $('#base_url').val() + 'planruta/Buscar_Puntos_Control',
                                    { datos: valorInput },
                                    function (data) {
                                        mostrar_resultados(data);
                                    },
                                    'json',
                                );
                            } else {
                                $resultado.innerHTML = '';
                            }
                        });

                        function mostrar_resultados(results) {
                            // Limpiar resultados anteriores
                            $resultado.innerHTML = '';
                            currentFocus = -1; // Reiniciar el índice de la selección
                            // Mostrar los nuevos resultados
                            results.forEach(function (result, index) {
                                const li = document.createElement('li');
                                li.style.padding = '8px';
                                li.style.cursor = 'pointer';
                                li.style.transition = 'background-color 0.3s';
                                li.textContent = result.nom_punto + ' - ' + result.municipio;
                                li.setAttribute('data-index', index); // Asignar un índice al elemento
                                li.addEventListener('click', function () {
                                    seleccionarElemento(result);
                                });
                                $resultado.appendChild(li);
                            });
                        }

                        function seleccionarElemento(result) {
                            // Colocar el valor en el input al hacer clic en un resultado
                            $miInput.val(result.nom_punto + ' - ' + result.municipio);
                            $('#ubilatitud').val(result.latitud);
                            $('#ubilongitud').val(result.longitud);
                            $('#accion_id').val(result.cod_ciudad);
                            $('#codigo_punto').val(result.id);
                            $resultado.innerHTML = '';
                        }

                        // Manejar eventos de teclado para la navegación
                        $miInput.on('keydown', function (e) {
                            var items = $resultado.getElementsByTagName('li');
                            if (e.key === 'ArrowDown') {
                                // Mover hacia abajo en la lista
                                currentFocus++;
                                if (currentFocus >= items.length) currentFocus = 0;
                                addActive(items);
                            } else if (e.key === 'ArrowUp') {
                                // Mover hacia arriba en la lista
                                currentFocus--;
                                if (currentFocus < 0) currentFocus = items.length - 1;
                                addActive(items);
                            } else if (e.key === 'Enter') {
                                // Seleccionar el elemento activo
                                e.preventDefault();
                                if (currentFocus > -1) {
                                    if (items) items[currentFocus].click();
                                }
                            }
                        });

                        function addActive(items) {
                            if (!items) return false;
                            removeActive(items);
                            if (currentFocus >= items.length) currentFocus = 0;
                            if (currentFocus < 0) currentFocus = items.length - 1;
                            items[currentFocus].classList.add('autocomplete-active');
                        }

                        function removeActive(items) {
                            for (var i = 0; i < items.length; i++) {
                                items[i].classList.remove('autocomplete-active');
                            }
                        }

                        // Estilo para el elemento activo (opcional)
                        var style = document.createElement('style');
                        style.innerHTML = `.autocomplete-active {background-color: #f39c12 !important;color: white;}`;
                        document.head.appendChild(style);
                    }
                });

                /* Buscador de novedades para las notas */
                var $searchInput = $('#novedad');
                var $resultado_novedad = document.getElementById('searchResults2');
                var currentFocus = -1; // Índice de la selección actual

                // Buscar usuario responsable para la actividad
                $searchInput.on('input', function () {
                    const searchTerm = $searchInput.val().trim();
                    // Realizar una solicitud AJAX para obtener resultados desde el servidor
                    if (searchTerm !== '') {
                        $.post(
                            $('#base_url').val() + 'trafico/Buscar_novedades',
                            { datos: searchTerm },
                            function (data) {
                                mostrar_resultados_notas(data);
                            },
                            'json',
                        );
                    } else {
                        $resultado_novedad.innerHTML = '';
                    }
                });

                function mostrar_resultados_notas(results) {
                    // Limpiar resultados anteriores
                    $resultado_novedad.innerHTML = '';
                    currentFocus = -1; // Reiniciar el índice de la selección
                    // Mostrar los nuevos resultados
                    results.forEach(function (result, index) {
                        const li = document.createElement('li');
                        li.style.padding = '8px';
                        li.style.cursor = 'pointer';
                        li.style.transition = 'background-color 0.3s';
                        li.textContent = result.id + ' - ' + result.novedad;
                        li.setAttribute('data-index', index); // Asignar un índice al elemento
                        li.addEventListener('click', function () {
                            seleccionarElemento(result);
                        });
                        $resultado_novedad.appendChild(li);
                    });
                }

                function seleccionarElemento(result) {
                    // Colocar el valor en el input al hacer clic en un resultado
                    $searchInput.val(result.novedad);
                    $resultado_novedad.innerHTML = '';
                }

                // Manejar eventos de teclado para la navegación
                $searchInput.on('keydown', function (e) {
                    var items = $resultado_novedad.getElementsByTagName('li');
                    if (e.key === 'ArrowDown') {
                        // Mover hacia abajo en la lista
                        currentFocus++;
                        if (currentFocus >= items.length) currentFocus = 0;
                        addActive(items);
                    } else if (e.key === 'ArrowUp') {
                        // Mover hacia arriba en la lista
                        currentFocus--;
                        if (currentFocus < 0) currentFocus = items.length - 1;
                        addActive(items);
                    } else if (e.key === 'Enter') {
                        // Seleccionar el elemento activo
                        e.preventDefault();
                        if (currentFocus > -1) {
                            if (items) items[currentFocus].click();
                        }
                    }
                });

                function addActive(items) {
                    if (!items) return false;
                    removeActive(items);
                    if (currentFocus >= items.length) currentFocus = 0;
                    if (currentFocus < 0) currentFocus = items.length - 1;
                    items[currentFocus].classList.add('autocomplete-active');
                }

                function removeActive(items) {
                    for (var i = 0; i < items.length; i++) {
                        items[i].classList.remove('autocomplete-active');
                    }
                }

                // Estilo para el elemento activo (opcional)
                var style = document.createElement('style');
                style.innerHTML = `.autocomplete-active {background-color: #f39c12 !important;color: white;}`;
                document.head.appendChild(style);

                //Boton para volver a la tabla de notas
                $('#btn-volver-notas').click(function () {
                    location.reload();
                });

                // $('#btn_guadargestion').click(function () {
                //     Swal.fire({
                //         title: '¿Está seguro?',
                //         text: '¿Desea guardar la nota para este punto?',
                //         icon: 'question',
                //         showCancelButton: true,
                //         confirmButtonColor: '#3085d6',
                //         cancelButtonColor: '#d33',
                //         confirmButtonText: 'Sí, guardar',
                //         cancelButtonText: 'Cancelar',
                //         focusConfirm: true // 👈 Forzar focus en el botón de confirmar
                //     }).then((result) => {
                //         if (result.isConfirmed) {
                //             let msg_error = '';
                //             let ocurrioval = $('#ocurrio').val();

                //             if (ocurrioval === 'En sitio') {
                //                 if (!msg_error) {
                //                     validar_proceso(manifi); // Lógica si todo está bien
                //                 } else {
                //                     Swal.fire({
                //                         icon: 'error',
                //                         title: '¡Error!',
                //                         html: msg_error
                //                     });
                //                     $('#ver_gestion').animate({ scrollTop: 0 }, 600);
                //                 }
                //             } else {
                //                 if (!msg_error) {
                //                     Registrar_Gestion(manifi); // Lógica si todo está bien
                //                 } else {
                //                     Swal.fire({
                //                         icon: 'error',
                //                         title: '¡Error!',
                //                         html: msg_error
                //                     });
                //                     $('#ver_gestion').animate({ scrollTop: 0 }, 600);
                //                 }
                //             }
                //         }
                //     });
                // });


                $('#btn_guadargestion').click(function () {
                    // Swal.fire({
                    //     title: '¿Está seguro?',
                    //     text: '¿Desea guardar la nota para este punto?',
                    //     icon: 'question',
                    //     showCancelButton: true,
                    //     confirmButtonColor: '#3085d6',
                    //     cancelButtonColor: '#d33',
                    //     confirmButtonText: 'Sí, guardar',
                    //     cancelButtonText: 'Cancelar',
                    //     allowOutsideClick: false,
                    //     returnFocus: false, // Evita que el offcanvas tome foco
                    //     didOpen: () => {
                    //         const confirmBtn = Swal.getConfirmButton();
                    //         if (confirmBtn) confirmBtn.focus(); // 🔍 fuerza el focus en confirmar
                    //     }
                    // }).then((result) => {
                    //     if (result.isConfirmed) {
                    if (window.confirm('¿Esta seguro de guardar la nota para este punto?')) {
                        let msg_error = '';
                        let ocurrioval = $('#ocurrio').val();

                        if (ocurrioval === 'En sitio') {
                            if (!msg_error) {
                                validar_proceso(manifi);
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: '¡Error!',
                                    html: msg_error
                                });
                                $('#ver_gestion').animate({ scrollTop: 0 }, 600);
                            }
                        } else {
                            if (!msg_error) {
                                Registrar_Gestion(manifi);
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: '¡Error!',
                                    html: msg_error
                                });
                                $('#ver_gestion').animate({ scrollTop: 0 }, 600);
                            }
                        }
                    }
                    //     }
                    // });
                });

            });
        })
        .catch(error => console.log(error));
}

function trazabilidad() {
    fetch($('#base_url').val() + 'views/templates/trazabilidad.phtml')
        .then(response => response.text())
        .then(data => {
            document.getElementById('contenedor').innerHTML = data;

            $(document).ready(function () {
                $('#novedad_estado').html('');
                $('#novedad_seguimiento').html('');
                $('#tiempo_descargue').html('');
                $('#tiempo_cargue').html('');

                const estado = {
                    codigo_inicio: codigoInicio,
                    mani: manifiesti_codigo,
                    action: 'consultar_novedades',
                };

                $.ajax({
                    url: url,
                    type: 'POST',
                    data: estado,
                    dataType: 'json',
                    success: function (data) {
                        // === NOVEDAD ESTADO ===
                        if (data.result != null) {
                            data.result.forEach(element => {
                                let d = '';
                                switch (element.estado) {
                                    case 2: d = 'Enturnado'; break;
                                    case 3: d = 'Cargue'; break;
                                    case 4: d = 'Descargue'; break;
                                    case 5: d = 'En ruta'; break;
                                    case 6: d = 'Cumplido'; break;
                                    case 7: d = 'Entregado'; break;
                                    case 8: d = 'Devolución'; break;
                                    default: d = ''; break;
                                }

                                $('#novedad_estado').append(`
                                    <tr>
                                        <td>${d}</td>
                                        <td>${element.fecha} - ${element.hora}</td>
                                        <td>${element.reporte_cliente}</td>
                                        <td>${element.usuario}</td>
                                    </tr>
                                `);
                            });
                        }

                        // === NOVEDAD SEGUIMIENTO ===
                        if (data.result2 != null) {
                            data.result2.forEach(element => {
                                const clase = element.tipo_seguimiento === 'punto geografico'
                                    ? 'Punto virtual' : 'Punto físico';

                                $('#novedad_seguimiento').append(`
                                    <tr>
                                        <td>${clase}</td>
                                        <td>${element.observacion}</td>
                                        <td>${element.tipo_contacto}</td>
                                        <td>${element.reporte_cliente}</td>
                                        <td>${element.id_servicio}</td>
                                        <td>${element.usuario}</td>
                                        <td>${element.fecha} - ${element.hora}</td>
                                    </tr>
                                `);
                            });
                        }

                        // === TIEMPO CARGUE ===
                        if (data.result3 != null) {
                            data.result3.forEach(element => {
                                $('#tiempo_cargue').append(`
                                    <tr>
                                        <td>${element.id_orden_cargue}</td>
                                        <td>${element.tipo_fecha}</td>
                                        <td>${element.fecha_cargue}</td>
                                        <td>${element.hora_cargue}</td>
                                    </tr>
                                `);
                            });
                        }

                        // === TIEMPO DESCARGUE ===
                        if (data.result4 != null) {
                            data.result4.forEach(element => {
                                $('#tiempo_descargue').append(`
                                    <tr>
                                        <td>${element.id_remesa}</td>
                                        <td>${element.tipo_fecha}</td>
                                        <td>${element.fecha_descargue}</td>
                                        <td>${element.hora_descargue}</td>
                                    </tr>
                                `);
                            });
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log('no trajo estados');
                        console.log(jqXHR, textStatus, errorThrown);
                    },
                });
            });
        })
        .catch(error => console.log(error));
}

function gestion(manifi) {
    $('#noveq').val('');
    $('#observa').val('');
    $('#ubilatitud').val('');
    $('#ubilongitud').val('');
    $('#udocumnento').val('');
    $('.solocargue').hide();
    $('#msg_editar_gestion').html('');

    $('.med').html(med);
    $('.ini').html(codini);
    $('.man').html(manifi);
    $('.pk').html(placa);
    $('.conductor').html(dcondu);
    //consultar el último estado registrado
    var ultimo_estado = {
        id: codini,
        // action: 'estado_max',
    };

    $.ajax({
        url: $('#base_url').val() + 'trafico/estado_maximo',
        type: 'POST',
        data: ultimo_estado,
        dataType: 'json',
        success: function (data) {
            // console.log('trajo estado maximo');
            if (data.result) {
                // alert('estado');
                $('.subtitu2').html(data.result[0].letra);
                $('#actu').val(data.result[0].estado);
                $('#subtitu3').html(data.result[0].letra);
                $('#actu2').val(data.result[0].estado);
                var estado = data.result[0].estado;
                var estados = {
                    actual: estado,
                    action: 'estado_select',
                };
                $('#estadoq').html('');
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: estados,
                    dataType: 'json',
                    success: function (data) {
                        if (data) {
                            data.forEach(function (element, index) {
                                $('#estadoq').append('<option value="' + element.id + '">' + element.estado + '</option>');
                            });
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log('no trajo estados');
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown);
                    },
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('no trajo estado maximo');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
    });
    //consulta para traer las solicitudes de servicio
    var servi = {
        idplanilla: manifi,
        // action: 'consultar_solicitudes',
    };
    $('#nservicio').html('');
    $.ajax({
        url: $('#base_url').val() + 'trafico/consultar_solicitudes',
        type: 'POST',
        data: servi,
        dataType: 'json',
        success: function (data) {
            if (data != null) {
                var t = 0;
                data.forEach(function (element, index) {
                    solicitud_servicio[t] = element.mer_idservicio;
                    t++;
                });
                console.log(solicitud_servicio);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('No trajo solicitudes de servicio');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
    });
}

function abrir_orden_carga(manifi, orden) {
    // URL de la página que deseas abrir en la nueva ventana
    var url = $('#base_url').val() + `tiempo_logistico_cargue/crear_cargue/?manifiesto=${manifi}&orden_cargue=${orden}`;
    // Opciones de la ventana emergente (ancho, alto, opciones adicionales)
    var ventanaAncho = 1000;
    var ventanaAlto = 700;
    // Calcula las coordenadas para centrar la ventana
    var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
    var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
    // Opciones de la ventana emergente (ancho, alto, posición)
    var opcionesVentana = 'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
    // Utiliza window.open para abrir la nueva ventana
    window.open(url, name, opcionesVentana);
}

function abrir_remesa(manifi, remesa) {
    /* Validar si la orden de cargue ya esta diligenciada */

    $.post(
        $('#base_url').val() + 'tiempo_logistico_cargue/validar_order_cargue',
        'manifiesto=' + manifi,
        function (data) {
            if (data) {
                // URL de la página que deseas abrir en la nueva ventana
                var url = $('#base_url').val() + `tiempo_logistico_descargue/crear_descargue/?manifiesto=${manifi}&remesa=${remesa}`;
                // Opciones de la ventana emergente (ancho, alto, opciones adicionales)
                var ventanaAncho = 1000;
                var ventanaAlto = 700;
                // Calcula las coordenadas para centrar la ventana
                var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
                var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
                // Opciones de la ventana emergente (ancho, alto, posición)
                var opcionesVentana = 'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
                // Utiliza window.open para abrir la nueva ventana
                window.open(url, name, opcionesVentana);
            } else {
                var mensaje = 'Para llenar los <b>tiempos de descargue</b> debe llenar los <b>tiempos de cargue</b> del manifiesto ' + manifi;
                Swal.fire({
                    // position: 'top-end',
                    position: 'center',
                    icon: 'warning',
                    title: 'Advertencia',
                    html: mensaje,
                    showConfirmButton: true,
                    // timer: 1500,
                    customClass: {
                        popup: 'swal2-custom-font',
                    },
                });
            }
        },
        'json',
    );

    // var url = $('#base_url').val() + `tiempo_logistico_descargue/validar_order_cargue`;
    // let data = new FormData();
    // data.append('manifiesto', manifi);
    // $.ajax({
    //   url: url,
    //   type: 'POST',
    //   data: data,
    //   cache: false,
    //   processData: false, // Don't process the files
    //   contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    //   dataType: 'json',
    //   success: function(data, textStatus, jqXHR) {

    //   },
    //   error: function(jqXHR, textStatus, errorThrown) {
    //     var mensaje = 'Para llenar los tiempos de descargue de';
    //     Swal.fire({
    //       // position: 'top-end',
    //       position: 'center',
    //       icon: 'warning',
    //       title: 'Advertencia',
    //       text: mensaje,
    //       showConfirmButton: true,
    //       // timer: 1500,
    //     });
    //   },
    // });
}

//INSERT
function validar_proceso(manifi) {
    //VALIDAR EL SEGUIMIENTO
    // var a = $("#ini").val(); //cod_iniruta
    var a = codini; //cod_iniruta
    // var estad = $("#actu").val(); //estado actual
    var segui = 'punto geografico'; //tipo seguimiento
    var deta = $('#accion_id').val(); //detalle
    var proce = $('#proceso').val(); //proceso
    if (segui !== 'novedad general') {
        var fun = {
            cod_iniruta: a,
            // estado: estad,
            segui: segui,
            detalle: deta,
            proce: proce,
            // action: 'validar_tipoproceso',
        };
        $.ajax({
            url: $('#base_url').val() + 'trafico/validar_tipoproceso',
            type: 'POST',
            data: fun,
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    data.forEach(function (element, index) {
                        if (element.tipo_proceso == 'completado') {
                            alert('Este seguimiento ya tiene un estado de completado, no puede realizar más seguimientos sobre el mismo');
                        } else {
                            Registrar_Gestion(manifi);
                        }
                    });
                } else {
                    Registrar_Gestion(manifi);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            },
        });
    } else {
        Registrar_Gestion(manifi);
    }
}

async function Registrar_Gestion(manifi) {
    try {
        // Obtener los arrays de ordenes y remesas
        const ordenCargueInputs = document.querySelectorAll('input.orden_cargue_id');
        const remesaDescargueInputs = document.querySelectorAll('input.remesa_descargue_id');

        const ordenCargueArray = Array.from(ordenCargueInputs).map(input => input.value);
        const remesaDescargueArray = Array.from(remesaDescargueInputs).map(input => input.value);

        // Crear FormData
        const formData = new FormData();
        formData.append('accion_completado', $('#procesoq').val());
        formData.append('estado_siguiente', $('#estadoq').val());
        formData.append('reporte_cliente', $('#reporte').val());
        formData.append('observacion', $('#observa').val());
        formData.append('nota_punto_controlador', $('#nota').val());
        formData.append('solicitud_servicio_nuevo', solicitud_servicio);
        formData.append('contacto', 'Llamada telefonica');
        formData.append('tipo_seguimiento', 'punto geografico');
        formData.append('tipo_detalle', $('#accion_id').val());
        formData.append('novedad_general', $('#novedad').val());
        formData.append('ocurrio', $('#ocurrio').val());
        formData.append('latitud', $('#ubilatitud').val());
        formData.append('longitud', $('#ubilongitud').val());
        formData.append('documento_evidencia', '');
        formData.append('id_ini_ruta', codini);
        formData.append('idmanifiesto', mani);
        formData.append('tipo_proceso', $('#proceso').val());
        formData.append('edocu', '');
        formData.append('codigo_punto', $('#codigo_punto').val());
        formData.append('accion_punto', $('#accion').val());
        formData.append('manifiesto', manifi);
        // formData.append('manifiesto', manifiesti_codigo);

        // Agregar los arreglos al formData
        ordenCargueArray.forEach((val, i) => {
            formData.append(`orden_cargue_id[${i}]`, val);
        });
        remesaDescargueArray.forEach((val, i) => {
            formData.append(`remesa_descargue_id[${i}]`, val);
        });

        const response = await fetch($('#base_url').val() + 'trafico/crear_gestion', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.success === true) {

            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                html: data.message,
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false,
                customClass: { popup: 'swal2-custom-font' },
            }).then(() => {
                location.reload(true);
            });

        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                html: data.message,
                position: 'center',
                showConfirmButton: true,
                customClass: {
                    popup: 'swal2-custom-font',
                },
            });
        }
    } catch (error) {
        console.error('Error al guardar la gestión:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo guardar la gestión. Intenta de nuevo.',
        });
    }
}

function Registrar_Gestionestado() {
    var data = null;
    data = new FormData();
    data.append('accion', 'crear_gestionestado');
    var gestion = $('#select_gestion').val();
    if (gestion == 1) {
        data.append('id_ini_ruta', $('#ini').val());
        data.append('estadoq', $('#estadoq').val());
        data.append('procesoq', $('#procesoq').val());
        data.append('noveq', $('#noveq').val());
        data.append('reportecliente', $('#reportee').val());
        data.append('gestion', 1);
    }
    $.ajax({
        url: url2,
        type: 'POST',
        data: data,
        cache: false,
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            //location.reload();
            $('.hcontenedor').empty();
            var manifi = $('#man').val();
            Tarjeta_Seguimiento(manifi); //bloques
            $('#ver_gestion').modal('hide');
            alert('Ok!!Datos Registrado Exitosamente!!');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('no guardo seguimiento');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
    });
}

async function Tabla_SinFiltro() {
    try {
        const response = await fetch($('#base_url').val() + 'trafico/Datos_SinFiltro', {
            method: 'POST',
            cache: 'no-cache',
        });
        const data = await response.json();

        if (!data || !data.data) {
            alert('Error al traer los datos');
            return;
        }

        let template = '';
        let solicitudes = [];

        data.data.forEach((item, i) => {
            const c = i + 1;

            template += `
                <tr id="tiempos${c}">
                    <td style="white-space: nowrap;" id="semaforo${c}">
                        <!--<a href="#" class='text-decoration-none btn-gestion-manifiesto' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" data-ManifiestoId='${item.id}'>${item.id}</a>-->
                        <a href="#" onClick="Registra_Seguimiento(${item.id})">${item.id}</a>
                    </td>
                    <td style='width:auto; white-space: nowrap;' id="tiempo${c}"></td>
                    <td style='width:auto; white-space: nowrap;'>${item.origen} - ${item.destino}</td>
                    <td style='width:auto; white-space: nowrap;'>${item.placa}</td>
                    <td style='width:auto; white-space: nowrap;'>${item.nombre_conductor} ${item.apellido1} ${item.apellido2}</td>
                    <td style='width:auto; white-space: nowrap;'>${item.celular}</td>
                    <td style='width:auto; white-space: nowrap;'>${item.nombre_cliente}</td>
                    <td style='width:auto; white-space: nowrap;' id="ultimositio${c}"></td>
                    <td style='width:auto; white-space: nowrap;' id="maxhorafecha${c}"></td>
                    <td style='width:auto; white-space: nowrap;' id="ultimaousuario${c}"></td>
                </tr>`;

            if (item.cod_ini_ruta) {
                solicitudes.push({ codini: item.cod_ini_ruta, id: c });
            }
        });

        // Destruir el DataTable si existe antes de limpiar e insertar HTML nuevo
        if ($.fn.DataTable.isDataTable('#tbl_Manifiestos_seguimiento')) {
            $('#tbl_Manifiestos_seguimiento').DataTable().clear().destroy();
        }

        // Renderizar nuevo contenido
        $('#tablero').html(template);

        // Esperar a que el DOM se actualice completamente
        setTimeout(async () => {
            // Ejecutar actualizaciones por cada fila (datos asíncronos)
            // await Promise.all(solicitudes.map(item => actualizarInfo(item.codini, item.id)));
            await actualizarInfoLote(solicitudes);

            // Verificar que la tabla exista
            if (document.querySelector('#tbl_Manifiestos_seguimiento')) {
                new DataTable('#tbl_Manifiestos_seguimiento', {
                    paging: false,
                    searching: true,
                    ordering: true,
                    order: [[1, 'desc']],
                    info: false,
                    responsive: true,
                    pageLength: 100,
                    dom: '<"row"<"col-sm-10 custom-search"f><"col-sm-2 text-right"B>>' + '<"row"<"col-sm-12"tr>>',
                    buttons: [
                        {
                            extend: 'excelHtml5',
                            text: '<i class="fa-regular fa-file-excel"></i> Exportar a Excel',
                            className: 'btn btn-success input-sm',
                            exportOptions: { columns: ':visible', modifier: { page: 'all' } },
                        },
                    ],
                    language: {
                        decimal: ',',
                        thousands: '.',
                        search: 'Buscar:',
                        zeroRecords: 'No se encontraron resultados',
                        info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
                        infoEmpty: 'Mostrando 0 a 0 de 0 registros',
                        infoFiltered: '(filtrado de _MAX_ registros totales)',
                        paginate: { first: 'Primero', last: 'Último', next: 'Siguiente', previous: 'Anterior' },
                    },
                });
            }

            // Funciones auxiliares luego de renderizar
            await Contadores_manifiestos();
            Tabla_llegada();
        }, 50); // Esperar que el DOM pinte

    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

async function actualizarInfoLote(solicitudes) {
    const codigos = solicitudes.map(s => s.codini); // Extrae todos los cod_ini_ruta

    try {
        const response = await fetch($('#base_url').val() + 'trafico/obtenerLoteSeguimiento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(codigos),
        });

        const data = await response.json();

        // Por cada cod_ini_ruta recibido, actualiza la fila correspondiente
        data.forEach(item => {
            // Busca el índice ID de la fila en solicitudes[]
            const solicitud = solicitudes.find(s => s.codini === item.cod_ini_ruta);
            if (!solicitud) return;

            const id = solicitud.id;
            const tiempo = parseFloat(item.tiempo);
            const texto = isNaN(tiempo) ? 'N/A' : tiempo.toLocaleString();

            // Determina color de semáforo
            const color =
                tiempo < 0 ? '#FFFFFF' :
                    tiempo <= 30 ? '#FFFF6C' :
                        tiempo <= 59 ? '#FF9E5E' :
                            tiempo <= 89 ? '#FF8891' :
                                '#DDBBFF';

            $(`#semaforo${id}`).css({ 'background-color': color, 'color': '#000' });
            $(`#tiempo${id}`).html(texto);

            // Datos de última novedad
            $(`#maxhorafecha${id}`).html(`${item.fecha ?? '-'} - ${item.hora ?? '-'}`);
            $(`#ultimositio${id}`).html(item.Municipio ?? '-');
            $(`#ultimaousuario${id}`).html(item.usuario ?? '-');
        });

    } catch (error) {
        console.error("❌ Error en actualizarInfoLote:", error);
    }
}

function Contadores_manifiestos() {
    return new Promise((resolve, reject) => {
        $.post(
            $('#base_url').val() + 'trafico/Contadores_Manifiestos',
            function (data) {
                if (data) {
                    $('#num_vehiculos_seguimiento').html(data.total_manifiestos_seguimiento);
                    $('#num_vehiculos_totales').html(data.total_manifiestos_general);
                    $('#num_manifiestos_llegada').html(data.total_manifiestos_llegada);
                    resolve(data);
                } else {
                    reject('No data received');
                }
            },
            'json',
        ).fail((jqXHR, textStatus, errorThrown) => {
            reject(errorThrown);
        });
    });
}

function Tabla_llegada() {
    $.post(
        $('#base_url').val() + 'trafico/Datos_llegada',
        function (data) {
            if (data) {
                $('#tablero_llegada').html('');
                var c = 0;
                var template = '';
                var tipo_manifiesto = '';
                for (var m = 0; m < data.length; m++) {
                    c++;
                    codigo_inicio = data[m]['cod_ini_ruta'];
                    if (data[m]['tipo_manifiesto'] == 1) {
                        tipo_manifiesto = 'General';
                    } else if (data[m]['tipo_manifiesto'] == 2) {
                        tipo_manifiesto = 'Multiparada';
                    } else if (data[m]['tipo_manifiesto'] == 3) {
                        tipo_manifiesto = 'Viaje Vacío';
                    } else if (data[m]['tipo_manifiesto'] == 4) {
                        tipo_manifiesto = 'Varios viajes en el Dia';
                    } else if (data[m]['tipo_manifiesto'] == 8) {
                        tipo_manifiesto = 'Viaje de Ida y Regreso';
                    }

                    template += `
                        <tr id="tiempos${c}">
                            <td style="white-space: nowrap;width: auto;" id="semaforo${c}"><a href="#" onClick="Registra_Seguimiento(${data[m]['id']})">${data[m]['id']}</a></td>
                            <td style="white-space: nowrap;width: auto;">${data[m]['origen']} - ${data[m]['destino']}</td>
                            <td style="white-space: nowrap;width: auto;">${data[m]['mer_producto']}</td>
                            <td style="white-space: nowrap;width: auto;" class="cell-detail">${data[m]['placa']}</td>
                            <td style="white-space: nowrap;width: auto;" class="cell-detail">${data[m]['apellido1']} ${data[m]['apellido1']}</td>
                            <td style="white-space: nowrap;width: auto;" class="cell-detail">${data[m]['celular']}</td>
                            <td style="white-space: nowrap;width: auto;" class="cell-detail">${data[m]['nombre']}</td>
                            <td style="white-space: nowrap;width: auto;" class="cell-detail">
                                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                                    <button class="btn btn-primary btn-sm me-1 px-1 py-0 btn_finaliza_seguimiento" type="button" data-codini="${data[m]['cod_ini_ruta']}" data-manifiesto='${data[m]['id']}' onclick="Finalizar_Seguimiento(this)">
                                        Llegada Vehiculo
                                    </button>
                                    <button class="btn btn-warning btn-sm me-1 px-1 py-0" type="button">Devolver Trafico</button>
                                    <!--<button class="btn btn-secondary btn-sm me-1 px-1 py-0" type="button">Right</button>-->
                                </div>
                            </td>
                        </tr>`;
                    $('#tablero_llegada').html(template);

                    // if (data[m]['cod_ini_ruta'] != null) {
                    //     var codini = data[m]['cod_ini_ruta'];
                    //     // Actualizar la tabla cada minuto (60000 ms)
                    //     // semaforo(codini, c, data[m]['id']);
                    //     // ultimanovedad(codini, c);
                    //     // ultimahorafecha(codini, c);
                    //     // setInterval(semaforo(codini, c), 60000);
                    //     // traer_punto(codini);
                    // }
                }
            }
        },
        'json',
    );
}

// async function traer_punto(codini) {
//     const dato = new FormData();
//     dato.append('codini', codini);

//     try {
//         const response = await fetch($('#base_url').val() + 'control_ruta/punto', {
//             method: 'POST',
//             body: dato,
//             cache: 'no-cache',
//         });

//         const data = await response.json();

//         console.log("🚀 ~ traer_punto ~ data.cod_punto:", data.cod_punto)
//         if (data && data.cod_punto) {
//             document.querySelectorAll('.btn_finaliza_seguimiento').forEach(btn => {
//                 btn.setAttribute('data-CodigoPunto', data.cod_punto);
//             });
//         }
//     } catch (error) {
//         console.error('Error en la solicitud traer_punto:', error);
//         throw error;
//     } finally {
//         $('#loading-overlay-oet').css('display', 'none'); // Sin espacio al final del selector
//     }
// }

async function Finalizar_Seguimiento(boton) {
    const manifiesto = boton.getAttribute('data-manifiesto');
    const codini = boton.getAttribute('data-codini');

    // Esperar que se traiga el punto y se asigne al botón
    await traer_punto(codini, boton);

    const cod_punto = boton.getAttribute('data-CodigoPunto'); // Aquí ya debe estar asignado

    const dato = new FormData();
    dato.append('maniesto', manifiesto);
    dato.append('cod_inicio', codini);
    dato.append('cod_punto', cod_punto);

    try {
        const response = await fetch($('#base_url').val() + 'control_ruta/finalziar_Seguimiento', {
            method: 'POST',
            body: dato,
            cache: 'no-cache',
        });

        const data = await response.json();

        if (data.numero === 200) {
            await Swal.fire({
                icon: 'success',
                title: '¡Finalizado!',
                html: `<strong>Mensaje:</strong> ${data.mensaje}`,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                customClass: {
                    popup: 'swal2-custom-font',
                },
            });

            $('#d-footer-primary').modal('toggle');
            Tabla_llegada();

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                html: `<strong>Mensaje:</strong> Error al finalizar el Manifiesto.`,
                showConfirmButton: true,
                customClass: {
                    popup: 'swal2-custom-font',
                },
            });
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'Ocurrió un problema al finalizar el manifiesto. Intenta de nuevo.',
        });
    } finally {
        $('#loading-overlay-oet').css('display', 'none');
    }
}

async function traer_punto(codini, boton) {
    const dato = new FormData();
    dato.append('codini', codini);

    try {
        const response = await fetch($('#base_url').val() + 'control_ruta/punto', {
            method: 'POST',
            body: dato,
            cache: 'no-cache',
        });

        const data = await response.json();
        if (data && data.cod_punto) {
            boton.setAttribute('data-CodigoPunto', data.cod_punto);
        }
    } catch (error) {
        console.error('Error en traer_punto:', error);
    } finally {
        $('#loading-overlay-oet').css('display', 'none');
    }
}

// async function traer_punto(codini, boton) {
//     const dato = new FormData();
//     dato.append('codini', codini);

//     try {
//         const response = await fetch($('#base_url').val() + 'control_ruta/punto', {
//             method: 'POST',
//             body: dato,
//             cache: 'no-cache',
//         });

//         const data = await response.json();
//         if (data && data.cod_punto) {
//             // Asigna solo al botón correspondiente
//             boton.setAttribute('data-CodigoPunto', data.cod_punto);
//             console.log(`🎯 Botón para codini ${codini} actualizado con cod_punto: ${data.cod_punto}`);
//         }
//     } catch (error) {
//         console.error('Error en traer_punto:', error);
//     } finally {
//         $('#loading-overlay-oet').css('display', 'none');
//     }
// }