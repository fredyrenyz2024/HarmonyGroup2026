window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = async function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global

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

    // Obtener los campos por ID
    let campoFechaInicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`);
    let campoFechaFinal = document.getElementById(`campo-${window.VENTANA}-fecha_final`);

    if (campoFechaInicial && campoFechaFinal) {
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

        RenderizarGraficos(fecha_inicial, fecha_final);
        // Llamar a la función con los valores actualizados
        // listar_pedidos_administrador(fecha_inicial, fecha_final);
    }

    document.addEventListener("click", async (e) => {
        if (e.target.matches(`#campo-${window.VENTANA}-aplicar`) || e.target.matches(`#campo-${window.VENTANA}-aplicar *`)) {
            // Crear contenedores internos antes de renderizar
            const contenedor = document.getElementById("tbl_graficos_pedidos");
            contenedor.innerHTML = "";

            const fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
            const fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
            RenderizarGraficos(fecha_inicial, fecha_final);
        }

        if (e.target.matches(`#btn_detalle`) || e.target.matches(`#btn_detalle *`)) {
            let Enlace = e.target.closest("#btn_detalle");
            let PedidoId = Enlace.getAttribute("data-SolicitudId");
            let ServicioId = Enlace.getAttribute("data-ServicioId");
            let RecursoId = Enlace.getAttribute("data-RecursoId");

            myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Trazabilidad`);
            myOffcanvas.updateContent(`
                <div class="table-responsive scrollbar">
                    <style>
                        #lineaTiempo {
                        position: relative;
                        }

                        #lineaTiempo .progreso-linea,
                        #lineaTiempo .progreso-linea-actual {
                        position: absolute;
                        top: 16px; /* Centro exacto de los círculos de 32px de alto */
                        height: 4px;
                        z-index: 0;
                        transition: all 0.3s ease-in-out;
                        }

                        #lineaTiempo .progreso-linea {
                        background-color: green;
                        }

                        #lineaTiempo .progreso-linea-actual {
                        background-color: orange;
                        }

                        .step {
                        position: relative;
                        z-index: 1;
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        }

                        .circle {
                        width: 32px;
                        height: 32px;
                        background-color: #dee2e6;
                        border-radius: 50%;
                        border: 3px solid transparent;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1;
                        }

                        .circle.completed {
                        background-color: green;
                        }

                        .circle.current {
                        background-color: orange;
                        }

                        .step small {
                        margin-top: 6px;
                        font-size: 0.75rem;
                        color: #495057;
                        text-align: center;
                        }

                        .info-extra {
                        font-size: 0.7rem;
                        color: #6c757d;
                        text-align: center;
                        }
                    </style>

                    <div class="timeline-wrapper bg-light rounded p-4" >
                        <h1 class="h6 mb-3 text-end"><span id='FechaEstimada'></span></h1>
                        <div class="d-flex justify-content-between position-relative timeline-line" id="lineaTiempo">
                        <!-- Los pasos se inyectarán por JavaScript -->
                        </div>
                    </div>

                    <div class="border-top border-translucent border-dashed pt-3"></div>

                    <hr class="my-1 text-dark">
                        <h6>Trazabilidad Pedido</h6>
                    <hr class="my-1 text-dark">

                    <table class="table table-sm text-center" style="font-size: 11px;">
                        <thead>
                            <tr>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>#</th>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>Tipo Trazabilidad</th>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>Observación</th>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>Usuario</th>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>Fecha</th>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>Soporte</th>
                            </tr>
                        </thead>
                        <tbody id="tbody_detalle_trazabilidad_pedido" class="text-center">
                            <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
                        </tbody>
                    </table>
                </div>

                <hr class="my-1 text-dark">
                    <h6>Trazabilidad Recurso</h6>
                <hr class="my-1 text-dark">

                <div class="table-responsive scrollbar">
                    <table class="table table-sm text-center" style="font-size: 11px;">
                        <thead>
                        <tr>
                            <th scope="col" style='width: auto; white-space: nowrap;'>#</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Placa</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Ruta </th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Sitio</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Latitud</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Longitud</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Fecha</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Nota</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Usuario</th>
                        </tr>
                        </thead>
                        <tbody id="tbody_detalle_trazabilidad" class="text-center">
                        <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
                        </tbody>
                    </table>
                </div>
                <div id="map" style="height: 600px; width: 100%;"></div>
            `);

            try {
                let formData = new FormData();
                formData.append("PedidoId", PedidoId);

                let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_trazabilidad_pedido', {
                    method: "POST",
                    body: formData
                });

                let data = await response.json();
                if (data) {
                    let rows = "";

                    data.forEach((servicio, index) => {
                        rows += `
                            <tr>
                            <th scope="row">${index + 1}</th>
                            <!--<td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.referencia}</td>-->
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.tipo_trazabilidad}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.observacion}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.usuario}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_registro}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>
                                <a href="${$('#base_url').val()}${servicio.evidencia}" target="_blank" class="btn btn-outline-primary btn-sm me-1 px-1 py-0">
                                    <i class="uil-file-download-alt"></i> Ver Documento
                                </a>
                            </td>
                            </tr>
                        `;
                    });

                    document.getElementById("tbody_detalle_trazabilidad_pedido").innerHTML = rows;
                } else {
                    document.getElementById("tbody_detalle_trazabilidad_pedido").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
                }
            } catch (error) {
                console.error("Error al obtener proveedores:", error);
                document.getElementById("tbody_detalle_trazabilidad_pedido").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
            }

            //Trazabilidad de los recursos
            try {
                let formData = new FormData();
                formData.append("ServicioId", ServicioId);
                formData.append("RecursoId", RecursoId);
                // formData.append("proveedor_id", document.getElementById('proveedor_id').value);

                let response = await fetch($('#base_url').val() + 'torrecontrol/detalle_trazabilidad_pedido', {
                    method: "POST",
                    body: formData
                });

                let data = await response.json();
                if (data) {
                    let rows = "";

                    data.forEach((servicio, index) => {
                        rows += `
                            <tr>
                            <th scope="row">${index + 1}</th>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.placa_vehiculo}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.ruta}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.sitio_seguimiento}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.latitud}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.longitud}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_hora_seguimiento}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.nota_seguimiento}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.usuario_reporte}</td>
                            </tr>
                            <tr id="Recurso_proveedores_${servicio.referencia}" style="display: none;">
                            <td colspan="12">
                                <div class="lista-proceso-proveedores"></div>
                            </td>
                            </tr>
                        `;
                    });

                    document.getElementById("tbody_detalle_trazabilidad").innerHTML = rows;

                    /*Dibujar mapa  */
                    let map; // 🛡️ Mejor declararlo afuera

                    async function initMap() {
                        const { Map } = await google.maps.importLibrary("maps");
                        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
                        const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes");
                        const { Geocoder } = await google.maps.importLibrary("geocoding"); // Importar Geocoder

                        map = new Map(document.getElementById("map"), {
                            center: { lat: 4.5709, lng: -74.2973 }, // Colombia
                            zoom: 5.5,
                            gestureHandling: "greedy",
                            mapId: "db5350020424d6c4"
                        });

                        const geocoder = new Geocoder();

                        // Función auxiliar para obtener el nombre del lugar
                        async function obtenerNombreLugar(lat, lng) {
                            return new Promise((resolve, reject) => {
                                geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                                    if (status === "OK" && results[0]) {
                                        resolve(results[0].formatted_address); // Puedes usar también address_components si quieres algo más específico
                                    } else {
                                        console.error("No se pudo obtener el nombre del lugar:", status);
                                        resolve("Lugar desconocido"); // Por si falla
                                    }
                                });
                            });
                        }

                        // Colocar los marcadores
                        for (const punto of data) {
                            const lat = parseFloat(punto.latitud);
                            const lng = parseFloat(punto.longitud);
                            const nombreLugar = await obtenerNombreLugar(lat, lng);

                            new AdvancedMarkerElement({
                                map: map,
                                position: { lat, lng },
                                title: `${nombreLugar}\n${punto.fecha_hora}`, // Nombre + fecha_hora
                            });
                        }

                        // Ahora usar DirectionsService para calcular la ruta real
                        const directionsService = new DirectionsService();
                        const directionsRenderer = new DirectionsRenderer({ map: map });

                        // Creamos el array de paradas (waypoints)
                        const waypoints = data.slice(1, data.length - 1).map(punto => ({
                            location: {
                                lat: parseFloat(punto.latitud),
                                lng: parseFloat(punto.longitud)
                            },
                            stopover: true
                        }));

                        // Definimos la solicitud
                        const request = {
                            origin: {
                                lat: parseFloat(data[0].latitud),
                                lng: parseFloat(data[0].longitud)
                            },
                            destination: {
                                lat: parseFloat(data[data.length - 1].latitud),
                                lng: parseFloat(data[data.length - 1].longitud)
                            },
                            waypoints: waypoints,
                            travelMode: google.maps.TravelMode.DRIVING,
                            optimizeWaypoints: false
                        };

                        // Pedimos la ruta
                        directionsService.route(request, (result, status) => {
                            if (status === "OK") {
                                directionsRenderer.setDirections(result);
                            } else {
                                console.error("Error en la ruta:", status);
                            }
                        });
                    }
                    initMap();
                } else {
                    document.getElementById("tbody_detalle_trazabilidad").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
                }
            } catch (error) {
                console.error("Error al obtener proveedores:", error);
                document.getElementById("tbody_detalle_trazabilidad").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
            }

            // Actualizar el estado de los pasos en la línea de tiempo
            cargarLineaTiempo(PedidoId);
            myOffcanvas.show();

        }
    });


    async function RenderizarGraficos(fecha_inicial, fecha_final) {
        try {
            const contenedorPrincipal = document.getElementById('indicadores_graficos');
            contenedorPrincipal.innerHTML = `
                <div class="row">
                    <div id="grafico_general" class="col-12 col-lg-6"></div>
                    <div id="grafico_asignado" class="col-12 col-lg-6"></div>
                </div>
                `;

            let formdata = new FormData();
            formdata.append('fecha_inicial', fecha_inicial);
            formdata.append('fecha_final', fecha_final);

            // Fetch y render del primer gráfico
            let response = await fetch($('#base_url').val() + 'torrecontrol/listar_graficos', {
                method: "POST",
                body: formdata
            });

            let data = await response.json();
            if (data !== "") {
                renderProviderCharts(data);
            }

            // Fetch y render del segundo gráfico
            // let response2 = await fetch($('#base_url').val() + 'torrecontrol/listar_graficos_asignados', {
            //     method: "POST",
            //     body: formdata
            // });

            // let data2 = await response2.json();
            // if (data2) {
            //     renderProviderCharts2(data2);
            // }

        } catch (error) {
            console.error("Error al cargar datos:", error);
            alert("Error al cargar los datos. Por favor intente nuevamente.");
        }
    }

    async function renderProviderCharts(groupedData) {
        const container = document.getElementById('grafico_general');
        container.innerHTML = '';

        const row = document.createElement('div');
        row.className = 'row';

        const chartCol = document.createElement('div');
        chartCol.className = 'col-12 mb-4';

        const chartCard = document.createElement('div');
        chartCard.className = 'card';

        const chartBody = document.createElement('div');
        chartBody.className = 'card-body';

        const chartDiv = document.createElement('div');
        chartDiv.id = 'chart-pie-total';
        chartDiv.style.height = '400px';

        chartBody.appendChild(chartDiv);
        chartCard.appendChild(chartBody);
        chartCol.appendChild(chartCard);
        row.appendChild(chartCol);
        container.appendChild(row);

        const chart = echarts.init(chartDiv);

        const pieData = [];
        Object.entries(groupedData).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                const val = value[0][key];
                if (typeof val === 'number') {
                    pieData.push({ name: key, value: val });
                }
            } else if (typeof value === 'object' && value !== null && typeof value[key] === 'number') {
                pieData.push({ name: key, value: value[key] });
            }
        });

        chart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [{
                name: 'Tareas',
                type: 'pie',
                radius: '60%',
                center: ['50%', '50%'],
                data: pieData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }],
            title: {
                text: 'Resumen de pedidos',
                subtext: 'Estado de las operaciones',
                left: 'center'
            }
        });


        chart.on('click', async function (params) {
            //mostrarDetalles(params.name, params.value);
            // alert(params.name, params.value);

            if (params.name === "confirmados") {
                let formdata = new FormData();
                formdata.append('fecha_inicial', campoFechaInicial.value);
                formdata.append('fecha_final', campoFechaFinal.value);
                let response2 = await fetch($('#base_url').val() + 'torrecontrol/listar_graficos_asignados', {
                    method: "POST",
                    body: formdata
                });

                let data2 = await response2.json();
                if (data2) {
                    renderProviderCharts2(data2);
                    console.log(params)
                }

            } else {

                const container = document.getElementById('grafico_asignado');
                container.innerHTML = '';

            }

            console.log("🚀 ~ params.value:", params.value)
            console.log("🚀 ~ params.name:", params.name)

            PedidosGraficos(params.name, params.value);

        });


        window.addEventListener('resize', () => chart.resize());
    }

    function renderProviderCharts2(groupedData) {
        const container = document.getElementById('grafico_asignado');
        container.innerHTML = '';

        const row = document.createElement('div');
        row.className = 'row';

        const chartCol = document.createElement('div');
        chartCol.className = 'col-12 mb-4';

        const chartCard = document.createElement('div');
        chartCard.className = 'card';

        // const chartHeader = document.createElement('div');
        // chartHeader.className = 'card-header';
        // chartHeader.textContent = 'Seguimiento de pedidos';

        const chartBody = document.createElement('div');
        chartBody.className = 'card-body';

        const chartDiv = document.createElement('div');
        chartDiv.id = 'chart-pie-total1';
        chartDiv.style.height = '400px';

        chartBody.appendChild(chartDiv);
        // chartCard.appendChild(chartHeader);
        chartCard.appendChild(chartBody);
        chartCol.appendChild(chartCard);
        row.appendChild(chartCol);
        container.appendChild(row);

        const pieData = groupedData.map(item => ({
            name: item.tipo_trazabilidad,
            value: item.cantidad
        }));

        const chart = echarts.init(chartDiv);

        chart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [{
                name: 'Trazabilidad',
                type: 'pie',
                radius: '60%',
                center: ['50%', '50%'],
                data: pieData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }],
            title: {
                text: 'Trazabilidad',
                subtext: 'Pedidos asignados',
                left: 'center'
            }
        });

        chart.on('click', function (params) {
            // mostrarDetalles2(params.name, params.value);
            enviarTipoTrazabilidad(params.name, params.value);
        });

        window.addEventListener('resize', () => chart.resize());
    }

    async function PedidosGraficos(params) {
        // console.log("🚀 ~ PedidosGraficos ~ params:", params)
        let dato = new FormData();
        dato.append('fecha_inicial', document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value);
        dato.append('fecha_final', document.getElementById(`campo-${window.VENTANA}-fecha_final`).value);
        dato.append('params', params);
        try {
            const response = await fetch($('#base_url').val() + 'torrecontrol/listar_grafico_pedidos', {
                method: 'POST',
                body: dato,
                cache: 'no-cache',
            });
            const data = await response.json();

            if (data) {
                let tbody = document.getElementById('tbl_graficos_pedidos');
                tbody.innerHTML = '';
                let col_estatus_trazabilidad = "";
                data.forEach(element => {
                    const fila = document.createElement('tr');

                    /* Validar si el pedido ya tuvo una postulacion */
                    // if (element.tipo_trazabilidad === 'Iniciado' && element.Estado_proceso === 'Postulado') {
                    //     // if (element.tipo_trazabilidad === 'Iniciado' && element.Estado_proceso === 'Postulado') {
                    //     // Estado de la trazabilidad
                    //     const estado = obtenerEstadoTrazabilidad(element.Estado_proceso);
                    //     col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
                    // } else {
                    //     // Estado de la trazabilidad
                    //     const estado = obtenerEstadoTrazabilidad(element.tipo_trazabilidad);
                    //     // const estado = obtenerEstadoTrazabilidad(element.Estado_proceso);
                    //     col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
                    // }

                    const columnaModalidadPedido = document.createElement('td');
                    columnaModalidadPedido.innerHTML = element.modalidad;
                    columnaModalidadPedido.style.width = 'auto';
                    columnaModalidadPedido.style.whiteSpace = 'nowrap';
                    columnaModalidadPedido.style.textAlign = 'center';

                    const columnaNundocSolicitud = document.createElement('td');
                    columnaNundocSolicitud.innerHTML = `
                        <div class="dropdown">
                        <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none menu_tabla" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-row-id="${fila.id}"> N°${element.referencia_pedido}</a>
                        <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
                            <a class="dropdown-item fw-bold" href="#" id="btn_detalle"  data-SolicitudId="${element.numdoc_solicitud}" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}"><span class="uil uil-transaction"></span> Detalle</a>
                            <div class="dropdown-divider"></div>
                        </div>
                        </div>
                    `;




                    const columnaCiudadOrigen = document.createElement('td');
                    columnaCiudadOrigen.innerHTML = element.ciudad_origen;
                    columnaCiudadOrigen.style.width = 'auto';
                    columnaCiudadOrigen.style.whiteSpace = 'nowrap';

                    const columnaCiudadDestino = document.createElement('td');
                    columnaCiudadDestino.innerHTML = element.ciudad_destino;
                    columnaCiudadDestino.style.width = 'auto';
                    columnaCiudadDestino.style.whiteSpace = 'nowrap';

                    const columnaCodigoProducto = document.createElement('td');
                    columnaCodigoProducto.innerHTML = element.cod_producto;
                    columnaCodigoProducto.style.width = 'auto';
                    columnaCodigoProducto.style.whiteSpace = 'nowrap';

                    const columnaProducto = document.createElement('td');
                    columnaProducto.innerHTML = element.producto;
                    columnaProducto.style.width = 'auto';
                    columnaProducto.style.whiteSpace = 'nowrap';

                    const columnaFechaCargue = document.createElement('td');
                    columnaFechaCargue.innerHTML = element.Fecha_Cargue;
                    columnaFechaCargue.style.width = 'auto';
                    columnaFechaCargue.style.whiteSpace = 'nowrap';

                    const columnaFechaEntrega = document.createElement('td');
                    columnaFechaEntrega.innerHTML = element.Fecha_Descargue;
                    columnaFechaEntrega.style.width = 'auto';
                    columnaFechaEntrega.style.whiteSpace = 'nowrap';

                    const columnaEstadoPedido = document.createElement('td');
                    if (params === "programados") {
                        columnaEstadoPedido.innerHTML = "Programado";
                    } else if (params === "confirmados") {
                        columnaEstadoPedido.innerHTML = element.seguimiento;
                    } else if (params === 'en_gestion') {
                        columnaEstadoPedido.innerHTML = "EnGestión";
                    } else if (params === 'entregados') {
                        columnaEstadoPedido.innerHTML = "entregado";

                    }
                    columnaEstadoPedido.style.width = 'auto';
                    columnaEstadoPedido.style.whiteSpace = 'nowrap';

                    fila.appendChild(columnaModalidadPedido);
                    fila.appendChild(columnaNundocSolicitud);
                    fila.appendChild(columnaEstadoPedido);
                    fila.appendChild(columnaCiudadOrigen);
                    fila.appendChild(columnaCiudadDestino);
                    fila.appendChild(columnaCodigoProducto);
                    fila.appendChild(columnaProducto);
                    fila.appendChild(columnaFechaCargue);
                    fila.appendChild(columnaFechaEntrega);

                    tbody.appendChild(fila);
                });
            }

        } catch (error) {
            console.error('Error en la primera solicitud:', error);
            console.log('error no inserta');
            throw error;
        } finally {
            // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
        }

    }

    async function enviarTipoTrazabilidad(params) {
        // console.log("🚀 ~ enviarTipoTrazabilidad ~ params:", params);
        let dato = new FormData();
        dato.append('fecha_inicial', document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value);
        dato.append('fecha_final', document.getElementById(`campo-${window.VENTANA}-fecha_final`).value);
        dato.append('params', params);

        try {
            const response = await fetch($('#base_url').val() + 'torrecontrol/listar_grafico_trazabilidad', {
                method: 'POST',
                body: dato,
                cache: 'no-cache',
            });
            const data = await response.json();

            if (data) {
                // console.log("🚀 ~ enviarTipoTrazabilidad ~ data:", data)
                let tbody = document.getElementById('tbl_graficos_pedidos');
                tbody.innerHTML = '';
                let col_estatus_trazabilidad = "";
                data.forEach(element => {
                    const fila = document.createElement('tr');

                    /* Validar si el pedido ya tuvo una postulacion */
                    // if (element.tipo_trazabilidad === 'Iniciado' && element.Estado_proceso === 'Postulado') {
                    //     // if (element.tipo_trazabilidad === 'Iniciado' && element.Estado_proceso === 'Postulado') {
                    //     // Estado de la trazabilidad
                    //     const estado = obtenerEstadoTrazabilidad(element.Estado_proceso);
                    //     col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
                    // } else {
                    //     // Estado de la trazabilidad
                    //     const estado = obtenerEstadoTrazabilidad(element.tipo_trazabilidad);
                    //     // const estado = obtenerEstadoTrazabilidad(element.Estado_proceso);
                    //     col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
                    // }


                    const columnaModalidadPedido = document.createElement('td');
                    columnaModalidadPedido.innerHTML = element.modalidad;
                    columnaModalidadPedido.style.width = 'auto';
                    columnaModalidadPedido.style.whiteSpace = 'nowrap';
                    columnaModalidadPedido.style.textAlign = 'center';

                    const columnaNundocSolicitud = document.createElement('td');
                    columnaNundocSolicitud.innerHTML = `
                        <div class="dropdown">
                        <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none menu_tabla" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-row-id="${fila.id}"> N°${element.referencia_pedido}</a>
                        <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
                            <a class="dropdown-item fw-bold" href="#" id="btn_detalle"  data-SolicitudId="${element.numdoc_solicitud}" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}"><span class="uil uil-transaction"></span> Detalle</a>
                            <div class="dropdown-divider"></div>
                        </div>
                        </div>
                    `;

                    const columnaCiudadOrigen = document.createElement('td');
                    columnaCiudadOrigen.innerHTML = element.ciudad_origen;
                    columnaCiudadOrigen.style.width = 'auto';
                    columnaCiudadOrigen.style.whiteSpace = 'nowrap';

                    const columnaCiudadDestino = document.createElement('td');
                    columnaCiudadDestino.innerHTML = element.ciudad_destino;
                    columnaCiudadDestino.style.width = 'auto';
                    columnaCiudadDestino.style.whiteSpace = 'nowrap';

                    const columnaCodigoProducto = document.createElement('td');
                    columnaCodigoProducto.innerHTML = element.cod_producto;
                    columnaCodigoProducto.style.width = 'auto';
                    columnaCodigoProducto.style.whiteSpace = 'nowrap';

                    const columnaProducto = document.createElement('td');
                    columnaProducto.innerHTML = element.producto;
                    columnaProducto.style.width = 'auto';
                    columnaProducto.style.whiteSpace = 'nowrap';

                    const columnaFechaCargue = document.createElement('td');
                    columnaFechaCargue.innerHTML = element.Fecha_Cargue;
                    columnaFechaCargue.style.width = 'auto';
                    columnaFechaCargue.style.whiteSpace = 'nowrap';

                    const columnaFechaEntrega = document.createElement('td');
                    columnaFechaEntrega.innerHTML = element.Fecha_Descargue;
                    columnaFechaEntrega.style.width = 'auto';
                    columnaFechaEntrega.style.whiteSpace = 'nowrap';

                    const columnaEstadoPedido = document.createElement('td');

                    if (element.tipo_trazabilidad) {
                        columnaEstadoPedido.innerHTML = element.tipo_trazabilidad
                    } else {
                        columnaEstadoPedido.innerHTML = element.seguimiento;
                    }
                    columnaEstadoPedido.style.width = 'auto';
                    columnaEstadoPedido.style.whiteSpace = 'nowrap';




                    fila.appendChild(columnaModalidadPedido);
                    fila.appendChild(columnaNundocSolicitud);
                    fila.appendChild(columnaEstadoPedido);
                    fila.appendChild(columnaCiudadOrigen);
                    fila.appendChild(columnaCiudadDestino);
                    fila.appendChild(columnaCodigoProducto);
                    fila.appendChild(columnaProducto);
                    fila.appendChild(columnaFechaCargue);
                    fila.appendChild(columnaFechaEntrega);

                    tbody.appendChild(fila);
                });
            }

        } catch (error) {
            console.error('Error en la primera solicitud:', error);
            console.log('error no inserta');
            throw error;
        } finally {
            // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
        }
    }


    async function mostrarDetalles2(categoria, valor) {

        const detallesDiv = document.getElementById('detalles_tareas');
        if (!detallesDiv) return;

        detallesDiv.innerHTML = `
                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div class="row">
            <!--<table class="text-end" cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size: 13px;">
                <thead>
                <tr>
                    <td class="text-right" style="border: 0px solid #ddd;padding: 1px;width: auto; white-space: nowrap;" colspan="5">
                    <a href="JavaScript:void(0);" id="exportar_excel" style="text-decoration: none;cursor: pointer;color: #332D2D;"><img src="${$("#base_url").val()}public/img/excel_2013.png" alt="Excel" width="15px"> <span style="font-size: 11px;"> Exportar a excel</span></a>
                    </td>
                </tr>
                </thead>
            </table>-->
            <div class="table-responsive scrollbar">
                <table id='myTable' class='table table-bordered table-sm' data-page-length='100' style="font-size:11px;">
                <thead>
                    <tr>
                    <th class='text-center' style='width: auto; white-space: nowrap;'>Modalidad</th>
                    <th class='text-center' style='width: auto; white-space: nowrap;'>Referencia</th>
                    <th class='text-center' style='width: auto; white-space: nowrap;'>Origen</th>
                    <th class='text-center' style='width: auto; white-space: nowrap;'>Destino</th>
                    <th class='text-center' style='width: auto; white-space: nowrap;'>Producto</th>
                    <th class='text-center' style='width: auto; white-space: nowrap;'>cargue</th>
            
                    </tr>
                </thead>
                <tbody id='tbl_detalle_pedidos' class='text-center'>
                    <tr>
                    <td colspan="11" class="text-center" style="font-size:15px;font-weight:bold;">
                        <img src="<?= BASE_URL ?>public/img/nexos_loading.gif" height="25" width="25" id="load_info" style="display: none;"> Esperando Información
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>
        </div>`;

        let formData = new FormData();
        formData.append("tipo", categoria);


        let response = await fetch($('#base_url').val() + 'torrecontrol/listar_graficos_asignados', {

        });

        let data = await response.json();
        //console.log(data.length);      

        if (data !== "") {
            renderProviderCharts2(data);

        } else {
            //showNoDataMessage();
        }

        await fetch($("#base_url").val() + "torrecontrol/Detalle_informe_pedidos", {
            method: "POST",
            cache: "no-cache",
            body: formData
        })
            .then((response) => {
                if (!response.ok) throw new Error(response.statusText);
                return response.json();
            })
            .then(function (data) {

                console.log(data);
                cont = 0;
                let tbody = document.getElementById("tbl_detalle_pedidos");
                tbody.innerHTML = "";
                if (data != "") {
                    data.forEach((element) => {
                        const fila = document.createElement("tr");

                        const columnaNumeroMo = document.createElement("td");
                        columnaNumeroMo.innerHTML = element.modalidad;
                        columnaNumeroMo.style.borderBottom = "1px #F5F5F5 solid";
                        columnaNumeroMo.style.borderRight = "1px #F5F5F5 solid";
                        columnaNumeroMo.style.textAlign = "center";
                        columnaNumeroMo.style.fontWeight = "bold";

                        const columnaFechaRf = document.createElement("td");
                        columnaFechaRf.innerHTML = element.referencia_pedido;
                        columnaFechaRf.style.borderBottom = "1px #F5F5F5 solid";
                        columnaFechaRf.style.borderRight = "1px #F5F5F5 solid";
                        columnaFechaRf.style.textAlign = "center";

                        const columnaOri = document.createElement("td");
                        columnaOri.innerHTML = element.ciudad_origen;
                        columnaOri.style.borderBottom = "1px #F5F5F5 solid";
                        columnaOri.style.borderRight = "1px #F5F5F5 solid";
                        columnaOri.style.textAlign = "center";

                        const columnaDes = document.createElement("td");
                        columnaDes.innerHTML = element.ciudad_destino;
                        columnaDes.style.borderBottom = "1px #F5F5F5 solid";
                        columnaDes.style.borderRight = "1px #F5F5F5 solid";
                        columnaDes.style.textAlign = "center";

                        const columnaCp = document.createElement("td");
                        columnaCp.innerHTML = element.cod_producto;
                        columnaCp.style.borderBottom = "1px #F5F5F5 solid";
                        columnaCp.style.borderRight = "1px #F5F5F5 solid";
                        columnaCp.style.textAlign = "center";

                        const columnaFc = document.createElement("td");
                        columnaFc.innerHTML = element.fecha_cargue;
                        columnaFc.style.borderBottom = "1px #F5F5F5 solid";
                        columnaFc.style.borderRight = "1px #F5F5F5 solid";
                        columnaFc.style.textAlign = "center";




                        fila.appendChild(columnaNumeroMo);
                        fila.appendChild(columnaFechaRf);
                        fila.appendChild(columnaOri);
                        fila.appendChild(columnaDes);
                        fila.appendChild(columnaCp);
                        fila.appendChild(columnaFc);



                        // Rendreizar la tabla
                        tbody.appendChild(fila);

                    });

                    new DataTable('#myTable', {
                        pageLength: 10,
                        dom: 'Bfrtip', // Posición de los botones
                        buttons: [
                            {
                                extend: 'excelHtml5',
                                text: 'Exportar a Excel',
                                className: 'btn btn-success'
                            }
                        ],
                        language: { // Corrección aquí (antes era 'lenguage')
                            "processing": "Procesando...",
                            "lengthMenu": "Mostrar _MENU_ registros",
                            "zeroRecords": "No se encontraron resultados",
                            "emptyTable": "Ningún dato disponible en esta tabla",
                            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                            "search": "Buscar:",
                            "loadingRecords": "Cargando...",
                            "paginate": {
                                "first": "Primero",
                                "last": "Último",
                                "next": "Siguiente",
                                "previous": "Anterior"
                            }
                        } // Se eliminó la coma extra antes del `)`
                    });

                } else {
                    tbody.innerHTML = "";
                    const fila = d.createElement("tr");
                    const columnaDatos = d.createElement("td");
                    columnaDatos.setAttribute("colspan", "14");
                    columnaDatos.classList.add("text-center");
                    columnaDatos.textContent = "No hay resultados de la operación";
                    fila.appendChild(columnaDatos);
                    // Rendreizar la tabla
                    tbody.appendChild(fila);
                }
            })

            .catch((error) => {
                alert(error);
            });
    }

    const style = document.createElement('style');
    style.textContent = `
        .no-data-message {
            text-align: center;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin: 20px;
            color: #666;
            font-size: 16px;
        }
        
        .chart-box {
            width: 48%;
            min-width: 400px;
            height: 400px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 15px;
            margin-bottom: 20px;
            display: inline-block;
        }
        
        .chart-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
        }
        
        .chart {
            width: 100%;
            height: 350px;
        }
        
        @media (max-width: 768px) {
            .chart-box {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);

    document.getElementById('exportar_excel').addEventListener('click', function () {
        var table = document.getElementById('table1');
        var wb = XLSX.utils.table_to_book(table);

        Array.from(table.getElementsByTagName('td')).forEach(function (td) {
            const text = td.innerText.trim();
            const esFecha = /^\d{4}-\d{2}-\d{2}$/.test(text);
            if (esFecha) {
                td.setAttribute('data-t', 's');
            }
        });

        const fechaColombia = new Date().toLocaleString("es-CO", {
            timeZone: "America/Bogota",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });

        const fechaFormateada = fechaColombia
            .replace(",", "")
            .replace(/\//g, "-")
            .replace(/:/g, "-")
            .trim();

        const nombreArchivo = `Informe de Pedidos ${fechaFormateada}.xlsx`;

        XLSX.writeFile(wb, nombreArchivo);
    });

    async function cargarLineaTiempo(PedidoId) {
        try {
            let formData = new FormData();
            formData.append("PedidoId", PedidoId);

            let response = await fetch($('#base_url').val() + 'torrecontrol/Linea_Tiempo_pedidos', {
                method: "POST",
                body: formData
            });

            let data = await response.json();

            const etapasOrdenadas = [
                "Asignado",
                "Llega vehículo",
                "En cargue",
                "En ruta",
                "Entregado"
            ];

            const contenedor = document.getElementById("lineaTiempo");
            contenedor.innerHTML = "";
            contenedor.className = "d-flex justify-content-between position-relative";

            let ultimaIndex = -1;

            //FechaEstimada
            const etapas = data.etapas;

            const etapaConFecha = Object.values(etapas).find(etapa => etapa.fecha_entrega_estimada);

            const fechaEstimada = etapaConFecha?.fecha_entrega_estimada || null;

            // document.getElementById("FechaEstimada").textContent = fechaEstimada ? `Fecha estimada entrega: ${new Date(fechaEstimada).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}` : "Fecha estimada no disponible";
            document.getElementById("FechaEstimada").textContent = `Fecha estimada entrega: ${fechaEstimada ? fechaEstimada : "No disponible"}`;

            etapasOrdenadas.forEach((etapa, index) => {
                const info = data.etapas[etapa];
                console.log("🚀 ~ etapasOrdenadas.forEach ~ info:", data.etapas)
                const step = document.createElement("div");
                step.className = "step";
                step.dataset.etapa = etapa;

                const circle = document.createElement("div");
                circle.className = "circle";

                if (info) {
                    circle.classList.add("completed");
                    ultimaIndex = index;
                    circle.setAttribute("data-bs-toggle", "tooltip");
                    circle.setAttribute("data-bs-placement", "bottom");
                    circle.setAttribute("title", `📅 ${info.fecha_trazabilidad}\n📝 ${info.observacion}`);
                }

                step.appendChild(circle);

                const small = document.createElement("small");
                small.textContent = etapa;
                step.appendChild(small);

                if (info) {
                    const fecha = document.createElement("div");
                    fecha.className = "info-extra";
                    fecha.textContent = info.fecha_trazabilidad;
                    step.appendChild(fecha);

                    // const obs = document.createElement("div");
                    // obs.className = "info-extra";
                    // obs.textContent = info.observacion;
                    // step.appendChild(obs);
                }

                contenedor.appendChild(step);
            });

            const steps = contenedor.querySelectorAll(".step");
            if (steps.length && ultimaIndex >= 0) {
                const primer = steps[0].offsetLeft + steps[0].offsetWidth / 2;
                const ultimo = steps[ultimaIndex].offsetLeft + steps[ultimaIndex].offsetWidth / 2;

                // Línea verde (completado)
                const linea = document.createElement("div");
                linea.className = "progreso-linea";
                linea.style.left = `${primer}px`;
                linea.style.width = `${ultimo - primer}px`;
                contenedor.appendChild(linea);

                // Línea amarilla (etapa actual)
                if (ultimaIndex + 1 < steps.length) {
                    const siguiente = steps[ultimaIndex + 1].offsetLeft + steps[ultimaIndex + 1].offsetWidth / 2;
                    const lineaActual = document.createElement("div");
                    lineaActual.className = "progreso-linea-actual";
                    lineaActual.style.left = `${ultimo}px`;
                    lineaActual.style.width = `${siguiente - ultimo}px`;
                    contenedor.appendChild(lineaActual);
                }

                // Marcar la actual en naranja
                steps[ultimaIndex].querySelector(".circle").classList.remove("completed");
                steps[ultimaIndex].querySelector(".circle").classList.add("current");
            }

            // Activar tooltips
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));

        } catch (error) {
            console.error("Error en línea de tiempo:", error);
        }
    }
}

function createBadge(text, type) {
    return `
    <span class="badge badge-phoenix fs-10 badge-phoenix-${type}">
      <span class="badge-label">${text}</span>
      <span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span>
    </span>`;
}

// --- Estados de Publicación ---
window.estadosPublicacion = {
    'Pendiente': 'secondary',
    'Publicado': 'info',
    'Cancelado': 'secondary',
    'Aceptado': 'success',
    'Pendiente Respuesta': 'warning',
    'Completado': 'success',
    'SIN ESTADO': 'danger',
    'null': 'danger',
};

// --- Estados de Asignación ---
window.estadosAsignacion = {
    'Pendiente': 'secondary',
    'Asignado': 'info',
    'Cancelado': 'secondary',
    'Aceptado': 'success',
    'Ganador': 'success',
    'Completado': 'success',
    'SIN ESTADO': 'danger',
    'null': 'danger',
};

function obtenerEstadoTrazabilidad(tipoTrazabilidad) {
    let textoTrazabilidad = tipoTrazabilidad;

    if (tipoTrazabilidad === 'Completado') {
        textoTrazabilidad = 'Asignado';
    } else if (!tipoTrazabilidad) {
        textoTrazabilidad = 'Sin Trazabilidad';
    }


    // Devolvemos el texto corregido y el color
    return {
        texto: textoTrazabilidad,
        color: window.estadosTrazabilidad[textoTrazabilidad] || 'secondary'
    };
}

window.estadosTrazabilidad = {
    'Llegada Cargue': 'info',
    'Cargue': 'info',
    'Salida Cargue': 'info',
    'Inicio Ruta': 'primary',
    'Transito': 'primary',
    'Llegada Descargue': 'info',
    'Descargue': 'info',
    'Salida Descargue': 'info',
    'Pendiente Iniciar': 'danger',
    'Sin Asignar': 'secondary',
    'Iniciado': 'primary',
    'Asignado': 'success',
    'Postulado': 'warning',
    'Cancelado': 'danger',
    'SIN ESTADO': 'danger',
    'Sin Trazabilidad': 'danger',
};

window.CampoId = null;


// Constructor del Offcanvas Dinámico
function DynamicOffcanvas(options) {
    // Configuración predeterminada
    var defaults = {
        id: 'dynamicOffcanvas',
        title: 'Default Title',
        content: 'Default Content',
        class: 'offcanvas-end',
        scroll: true,
        backdrop: false,
        width: '70%', // Nuevo valor por defecto
        height: 'auto' // Puedes agregar height también
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
    <div class="offcanvas ${this.settings.class}" 
        id="${this.settings.id}" 
        data-bs-scroll="${this.settings.scroll}" 
        data-bs-backdrop="${this.settings.backdrop}" 
        tabindex="-1" 
        aria-labelledby="${this.settings.id}-label" style="width: ${this.settings.width}; height: ${this.settings.height}">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title fw-bold" id="${this.settings.id}-label">
            ${this.settings.title}
          </h5>
          <button class="btn-close text-reset" type="button" data-bs-dismiss="offcanvas" id="btn-close-${this.settings.id}"></button>
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

DynamicOffcanvas.prototype.updateClass = function (newClass) {
    var offcanvas = this.offcanvasElement;

    // Eliminar todas las clases de posición de offcanvas
    Array.from(offcanvas.classList)
        .filter(cls => cls.startsWith('offcanvas-') && cls !== 'offcanvas')
        .forEach(cls => offcanvas.classList.remove(cls));

    // Agregar la nueva clase
    offcanvas.classList.add(newClass);

    // ⚡⚡ Destruir la instancia anterior
    if (this.bsOffcanvas) {
        this.bsOffcanvas.dispose();
    }

    // ⚡⚡ Crear nueva instancia con las nuevas clases
    this.bsOffcanvas = new bootstrap.Offcanvas(this.offcanvasElement);
};

// Función para modificar el ancho
DynamicOffcanvas.prototype.updateWidth = function (newWidth) {
    this.offcanvasElement.style.width = newWidth;
};

// Función para modificar el alto
DynamicOffcanvas.prototype.updateHeight = function (newHeight) {
    this.offcanvasElement.style.height = newHeight;
};

DynamicOffcanvas.prototype.show = function () {
    this.bsOffcanvas.show();
};

DynamicOffcanvas.prototype.hide = function () {
    this.bsOffcanvas.hide();
};

DynamicOffcanvas.prototype.getContent = function () {
    var body = this.offcanvasElement.querySelector('.offcanvas-body');
    return body.innerHTML; // Devuelve el contenido actual
};