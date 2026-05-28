window.VENTANA = "";

window.initScript = function (id) {
    window.VENTANA = id;

    let campoFechaInicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`);
    let campoFechaFinal = document.getElementById(`campo-${window.VENTANA}-fecha_final`);

    let Perfil_Id = document.getElementById("ssn_id_perfil").value;



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
    }

    document.addEventListener("click", async e => {
        if (e.target.matches(`#campo-${window.VENTANA}-filtrar`) || e.target.matches(`#campo-${window.VENTANA}-filtrar *`)) {
            let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
            let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;

            Listar_Grafica_General_Manifiestos(fecha_inicial, fecha_final);
        }
    });

    document.getElementById('exportar_excel').addEventListener('click', function () {
        var table = document.getElementById('tablaManifiestos');
        if (table) {
            // Clonar la tabla
            var clonedTable = table.cloneNode(true);

            // Indicar qué columnas omitir (por ejemplo, 1 y 3)
            var columnsToOmit = [6]; // Índices base 0

            // Eliminar las columnas no deseadas en el encabezado
            var ths = clonedTable.querySelectorAll('thead th');
            columnsToOmit.slice().reverse().forEach(index => {
                ths[index].remove();
            });

            // Eliminar las columnas no deseadas en las filas del cuerpo
            var rows = clonedTable.querySelectorAll('tbody tr');
            rows.forEach(row => {
                var cells = row.querySelectorAll('td');
                columnsToOmit.slice().reverse().forEach(index => {
                    cells[index].remove();
                });
            });

            // Convertir la tabla modificada a libro de Excel
            var wb = XLSX.utils.table_to_book(clonedTable);
            const fechaActual = new Date().toISOString().slice(0, 10);
            const nombreArchivo = `Informe de Manifiestos_${fechaActual}.xlsx`;
            XLSX.writeFile(wb, nombreArchivo);
        } else {
            console.error("El elemento con el ID 'ordenes_decargue' no existe.");
        }
    });
};

async function Listar_Grafica_General_Manifiestos(fecha_inicio, fecha_final) {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);

        const response = await fetch($("#base_url").val() + "indicadores/Graficos_General_manifiestos", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        if (!data || data.length === 0) {
            Swal.fire("Sin datos", "No se encontraron registros en el rango seleccionado", "info");
            return;
        }

        // === Gráfico de torta ===
        let chartDom = document.getElementById("GraficaGeneralManifiestos");
        let myChart = echarts.init(chartDom);

        let option = {
            title: {
                text: "Distribución de Manifiestos",
                left: "center"
            },
            tooltip: {
                trigger: "item",
                formatter: "{b}<br/>Cantidad: {c} ({d}%)"
            },
            legend: {
                orient: "horizontal",
                bottom: 10
            },
            series: [
                {
                    name: "Manifiestos",
                    type: "pie",
                    radius: "60%",
                    label: { formatter: "{b}: {c}" },
                    data: [
                        { name: "Activos", value: data.total_activos, itemStyle: { color: "#4CAF50" } },
                        { name: "Anulados", value: data.total_inactivos, itemStyle: { color: "#F44336" } }
                    ]
                }
            ]
        };

        myChart.setOption(option);

        // === Tabla ===
        const tbody = document.getElementById("tablaResultados");
        tbody.innerHTML = `
          <tr><td style='width:auto; white-space: nowrap;'>Total</td><td style='width:auto; white-space: nowrap;'>${data.total_manifiestos}</td></tr>
          <tr><td style='width:auto; white-space: nowrap;'>Activos</td><td style='width:auto; white-space: nowrap;'>${data.total_activos}</td></tr>
          <tr><td style='width:auto; white-space: nowrap;'>Anulados</td><td style='width:auto; white-space: nowrap;'>${data.total_inactivos}</td></tr>
        `;

        // Evento click en gráfica
        myChart.on("click", async function (params) {
            // El nombre que devuelve echarts será "Activos" o "Inactivos"
            let estado = params.name.toLowerCase(); // lo paso a minúscula: "activos" | "inactivos"

            let datos = new FormData();
            datos.append("Fecha_Inicio", fecha_inicio);
            datos.append("Fecha_Final", fecha_final);
            datos.append("Estado", estado);

            try {
                const response = await fetch(
                    $("#base_url").val() + "indicadores/Graficos_Detalle_Manifiestos",
                    {
                        method: "POST",
                        body: datos
                    }
                );

                const data = await response.json();

                if (!data.detalle || data.detalle.length === 0) {
                    Swal.fire("Sin datos", "No se encontraron registros en el rango seleccionado", "info");
                    return;
                }

                // console.log("🚀 ~ Listar_Grafica_General_Manifiestos ~ data:", data);
                if (estado === 'anulados') {
                    renderTablaManifiestos(data.detalle);

                    renderTablaTotalManifiestos(data.resumen);
                } else {
                    Graficos_Detalle(fecha_inicio, fecha_final);
                    renderTablaManifiestos(data.detalle);
                    renderTablaTotalManifiestos(data.resumen);
                }

            } catch (error) {
                Swal.fire("Error", "No se pudo consultar el detalle: " + error, "error");
            }
        });

    } catch (error) {
        console.error("Error cargando datos:", error);
        Swal.fire("Error", "Hubo un problema al cargar los datos", "error");
    }
}

function renderTablaManifiestos(data) {
    let tbody = document.querySelector("#tablaManifiestos tbody");
    let html = "";
    let perfil = document.getElementById("ssn_id_perfil").value;
    // console.log("🚀 ~ renderTablaManifiestos ~ perfil:", typeof perfil)
    // 🚀 Formateador en pesos colombianos
    const formatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0
    });

    data.forEach(row => {
        html += `
          <tr>
            <td style='white-space: nowrap;'>${row.Manifiesto}</td>
            <!--<td style='white-space: nowrap;'>${row.Remesa}</td>
            <td style='white-space: nowrap;'>${row.Orden_Cargue}</td>-->
            <td style='white-space: nowrap;'>${row.placa}</td>
            <td style='white-space: nowrap;'>${row.Conductor}</td>
            <td style='white-space: nowrap;'>${row.Origen}</td>
            <td style='white-space: nowrap;'>${row.Destino}</td>
            <td style='white-space: nowrap;'>${row.tipo_vehiculo}</td>
            ${perfil === '10' || perfil === '11' || perfil === '12' ? '' : `<td style='white-space: nowrap;'>${formatter.format(row.Total_Manifiesto)}</td>`}
            ${perfil === '10' || perfil === '11' || perfil === '12' ? '' : `<td style='white-space: nowrap;'>${row.Anticipo === '-' ? row.Anticipo : formatter.format(row.Anticipo)}</td>`}
            <td style='white-space: nowrap;'>${row.Agencia}</td>
            <td style='white-space: nowrap;'>${row.fecha_expedicion}</td>
            <td style='white-space: nowrap;'>${row.estadomnf_actual == 1 ? "Activo" : "Inactivo"}</td>
          </tr>
        `;
    });

    tbody.innerHTML = html; // 🚀 Se inserta todo de una vez
}

function renderTablaTotalManifiestos(data) {
    let tbody = document.querySelector("#tablaTotalResultados");
    let html = "";

    // 🚀 Formateador en pesos colombianos
    const formatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0
    });

    data.forEach(row => {
        html += `
          <tr>
            <td style='white-space: nowrap;'>${row.Agencia}</td>
            <td style='white-space: nowrap;'>${formatter.format(row.Total_Manifiesto)}</td>
            <td style='white-space: nowrap;'>${formatter.format(row.Total_Anticipo)}</td>
          </tr>
        `;
    });

    tbody.innerHTML = html; // 🚀 Se inserta todo de una vez
}

// --- util: asegura arrays y números ---
const A = v => Array.isArray(v) ? v : [];
const N = v => Number(v) || 0;
async function Graficos_Detalle(fecha_inicio, fecha_final) {

    let datos = new FormData();
    datos.append("Fecha_Inicio", fecha_inicio);
    datos.append("Fecha_Final", fecha_final);

    try {
        const response = await fetch(
            $("#base_url").val() + "indicadores/Detalle_Manifiestos_Grafico",
            {
                method: "POST",
                body: datos
            }
        );

        const data = await response.json();

        if (!data || data.length === 0) {
            Swal.fire("Sin datos", "No se encontraron registros en el rango seleccionado", "info");
            return;
        }

        // console.log("🚀 ~ Listar_Grafica_General_Manifiestos ~ data:", data);
        // Graficos_Detalle(fecha_inicio, fecha_final);
        // Renderizar tabla o detalle
        // renderGraficosPrecintos(data);

        // === 1. Cumplidos ===
        // let chartCumplidos = echarts.init(document.getElementById("grafCumplidos"));
        // chartCumplidos.setOption({
        //     title: { text: "Cumplidos", left: "center" },
        //     tooltip: { trigger: "item", formatter: "{b}<br/>Cantidad: {c} ({d}%)" },
        //     legend: { bottom: 10 },
        //     series: [{
        //         name: "Cumplidos",
        //         type: "pie",
        //         radius: "60%",
        //         label: { formatter: "{b}: {c}" },
        //         data: data.cumplidos.map(e => ({
        //             name: e.estado,
        //             value: e.cantidad,
        //             itemStyle: { color: e.estado === "Cumplido" ? "#4CAF50" : "#F44336" }
        //         }))
        //     }]
        // });

        // // === 2. Rutas ===
        // let chartRutas = echarts.init(document.getElementById("grafRutas"));
        // chartRutas.setOption({
        //     title: { text: "Origen - Destino", left: "center" },
        //     tooltip: { trigger: "item", formatter: "{b}<br/>Cantidad: {c} ({d}%)" },
        //     legend: { bottom: 10 },
        //     series: [{
        //         name: "Rutas",
        //         type: "pie",
        //         radius: "60%",
        //         label: { formatter: "{b}: {c}" },
        //         data: data.origen_destino.map(e => ({
        //             name: e.ruta,
        //             value: e.cantidad
        //         }))
        //     }]
        // });

        // // === 3. Tipos de Vehículos ===
        // let chartVehiculos = echarts.init(document.getElementById("grafVehiculos"));
        // chartVehiculos.setOption({
        //     title: { text: "Tipos de Vehículos", left: "center" },
        //     tooltip: { trigger: "item", formatter: "{b}<br/>Cantidad: {c} ({d}%)" },
        //     legend: { bottom: 10 },
        //     series: [{
        //         name: "Vehículos",
        //         type: "pie",
        //         radius: "60%",
        //         label: { formatter: "{b}: {c}" },
        //         data: data.tipo_vehiculo.map(e => ({
        //             name: e.tipo_vehiculo,
        //             value: e.cantidad
        //         }))
        //     }]
        // });

        // // === 4. Agencias ===
        // let chartAgencias = echarts.init(document.getElementById("grafAgencias"));
        // chartAgencias.setOption({
        //     title: { text: "Agencias", left: "center" },
        //     tooltip: { trigger: "item", formatter: "{b}<br/>Cantidad: {c} ({d}%)" },
        //     legend: { bottom: 10 },
        //     series: [{
        //         name: "Agencias",
        //         type: "pie",
        //         radius: "60%",
        //         label: { formatter: "{b}: {c}" },
        //         data: data.agencias.map(e => ({
        //             name: e.agencia,
        //             value: e.cantidad
        //         }))
        //     }]
        // });

        // // === 1. Cumplidos (Pie) ===
        // let chartCumplidos = echarts.init(document.getElementById("grafCumplidos"));
        // chartCumplidos.setOption({
        //     title: { text: "Cumplidos", left: "center" },
        //     tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
        //     legend: { bottom: 10 },
        //     series: [{
        //         type: "pie",
        //         radius: "60%",
        //         data: [
        //             { value: 120, name: "Activos", itemStyle: { color: "#4CAF50" } },
        //             { value: 40, name: "Inactivos", itemStyle: { color: "#F44336" } }
        //         ]
        //     }]
        // });

        // // === 2. Agencias (Pie) ===
        // let chartAgencias = echarts.init(document.getElementById("grafAgencias"));
        // chartAgencias.setOption({
        //     title: { text: "Agencias", left: "center" },
        //     tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
        //     legend: { bottom: 10 },
        //     series: [{
        //         type: "pie",
        //         radius: "60%",
        //         data: [
        //             { value: 60, name: "Disponibles", itemStyle: { color: "#2196F3" } },
        //             { value: 30, name: "Ocupadas", itemStyle: { color: "#FFC107" } }
        //         ]
        //     }]
        // });

        // // === 3. Rutas (Bar) ===
        // let chartRutas = echarts.init(document.getElementById("grafRutas"));
        // chartRutas.setOption({
        //     title: { text: "Rutas", left: "center" },
        //     tooltip: { trigger: "axis" },
        //     xAxis: { type: "category", data: ["Ruta 1", "Ruta 2", "Ruta 3", "Ruta 4"] },
        //     yAxis: { type: "value" },
        //     series: [{
        //         type: "bar",
        //         data: [50, 80, 30, 90],
        //         itemStyle: { color: "#FF9800" }
        //     }]
        // });

        // // === 4. Vehículos (Bar) ===
        // let chartVehiculos = echarts.init(document.getElementById("grafVehiculos"));
        // chartVehiculos.setOption({
        //     title: { text: "Vehículos", left: "center" },
        //     tooltip: { trigger: "axis" },
        //     xAxis: { type: "category", data: ["Camión", "Furgón", "Tractomula", "Bus"] },
        //     yAxis: { type: "value" },
        //     series: [{
        //         type: "bar",
        //         data: [40, 70, 90, 30],
        //         itemStyle: { color: "#673AB7" }
        //     }]
        // });

        // // === 1. Cumplidos (Pie) ===
        // let chartCumplidos = echarts.init(document.getElementById("grafCumplidos"));
        // chartCumplidos.setOption({
        //     title: { text: "Cumplidos", left: "center" },
        //     tooltip: { trigger: "item", formatter: "{b}<br/>Cantidad: {c} ({d}%)" },
        //     legend: { bottom: 10 },
        //     series: [{
        //         name: "Cumplidos",
        //         type: "pie",
        //         radius: "60%",
        //         label: { formatter: "{b}: {c}" },
        //         data: data.cumplidos.map(e => ({
        //             name: e.estado,
        //             value: e.cantidad,
        //             itemStyle: { color: e.estado === "Cumplidos" ? "#4CAF50" : "#F44336" }
        //         }))
        //     }]
        // });

        // // === 2. Rutas (Bar) ===
        // let chartRutas = echarts.init(document.getElementById("grafRutas"));
        // chartRutas.setOption({
        //     title: { text: "Origen - Destino", left: "center" },
        //     tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        //     xAxis: {
        //         type: "value"
        //     },
        //     yAxis: {
        //         type: "category",
        //         data: data.origen_destino.map(e => e.ruta)
        //     },
        //     series: [{
        //         name: "Cantidad",
        //         type: "bar",
        //         data: data.origen_destino.map(e => e.cantidad),
        //         itemStyle: { color: "#2196F3" }
        //     }]
        // });

        // // === 3. Tipos de Vehículos (Bar) ===
        // let chartVehiculos = echarts.init(document.getElementById("grafVehiculos"));
        // chartVehiculos.setOption({
        //     title: { text: "Tipos de Vehículos", left: "center" },
        //     tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        //     xAxis: {
        //         type: "value"
        //     },
        //     yAxis: {
        //         type: "category",
        //         data: data.tipo_vehiculo.map(e => e.tipo_vehiculo)
        //     },
        //     series: [{
        //         name: "Cantidad",
        //         type: "bar",
        //         data: data.tipo_vehiculo.map(e => e.cantidad),
        //         itemStyle: { color: "#9C27B0" }
        //     }]
        // });

        // === Cumplidos vs Sin Cumplir ===
        const estados = A(data.cumplidos);

        // Buscamos “Cumplido/Cumplidos” y “Pendiente/Sin cumplir” de forma robusta
        const getCantidad = (pred) => {
            const f = estados.find(e => (e.estado || '').toLowerCase().match(pred));
            return f ? N(f.cantidad) : 0;
        };

        const cantCumplidos = getCantidad(/cumplid/);                 // “cumplido(s)”
        let cantPendientes = getCantidad(/pendiente/);               // “pendiente(s)”
        if (cantPendientes === 0) cantPendientes = getCantidad(/sin\s*cumplir/); // “sin cumplir”

        // Si solo vino “Cumplidos”, mantenemos “Sin Cumplir” en 0
        const dataCumplidosPie = [
            { name: "Cumplidos", value: cantCumplidos },
            { name: "Sin Cumplir", value: cantPendientes }
        ];

        const chartCumplidos = echarts.init(document.getElementById("grafCumplidos"));
        chartCumplidos.setOption({
            title: { text: "Cumplidos", left: "center" },
            tooltip: { trigger: "item", formatter: "{b}<br/>Cantidad: {c} ({d}%)" },
            legend: { bottom: 10 },
            series: [{
                name: "Cumplidos",
                type: "pie",
                radius: "60%",
                label: { formatter: "{b}: {c}" },
                data: dataCumplidosPie
            }]
        });

        // 👉 Evento de click
        chartCumplidos.on("click", function (params) {
            renderTablaManifiestosCumplido(params.name, fecha_inicio, fecha_final);
        });

        // === Agencias ===
        const agenciasData = A(data.agencias).map(a => ({
            name: a.agencia,
            value: N(a.cantidad)
        }));

        const chartAgencias = echarts.init(document.getElementById("grafAgencias"));
        chartAgencias.setOption({
            title: { text: "Agencias", left: "center" },
            tooltip: { trigger: "item", formatter: "{b}<br/>Cantidad: {c} ({d}%)" },
            legend: { bottom: 10 },
            series: [{
                name: "Agencias",
                type: "pie",
                radius: "60%",
                label: { formatter: "{b}: {c}" },
                data: agenciasData
            }]
        });

        // 👉 Evento de click
        chartAgencias.on("click", function (params) {
            renderTablaManifiestosAgencias(params.name, fecha_inicio, fecha_final);
        });

        // Responsivo
        window.addEventListener('resize', () => {
            chartCumplidos.resize();
            chartAgencias.resize();
        });

        // Pintar tabla de Rutas
        // let rutasHtml = "";
        // data.origen_destino.forEach(e => {
        //     rutasHtml += `
        //     <tr>
        //         <td>${e.ruta}</td>
        //         <td>${e.cantidad}</td>
        //     </tr>
        // `;
        // });
        // document.getElementById("tablaRutas").innerHTML = rutasHtml;

        // // Pintar tabla de Vehículos
        // let vehiculosHtml = "";
        // data.tipo_vehiculo.forEach(e => {
        //     vehiculosHtml += `
        //     <tr>
        //         <td>${e.tipo_vehiculo}</td>
        //         <td>${e.cantidad}</td>
        //     </tr>
        // `;
        // });
        // document.getElementById("tablaVehiculos").innerHTML = vehiculosHtml;

        // === 4. Agencias (Pie) ===
        // let chartAgencias = echarts.init(document.getElementById("grafAgencias"));
        // chartAgencias.setOption({
        //     title: { text: "Agencias", left: "center" },
        //     tooltip: { trigger: "item", formatter: "{b}<br/>Cantidad: {c} ({d}%)" },
        //     legend: { bottom: 10 },
        //     series: [{
        //         name: "Agencias",
        //         type: "pie",
        //         radius: "60%",
        //         label: { formatter: "{b}: {c}" },
        //         data: data.agencias.map(e => ({
        //             name: e.agencia,
        //             value: e.cantidad
        //         }))
        //     }]
        // });

    } catch (error) {
        // Swal.fire("Error", "No se pudo consultar el detalle: " + error, "error");
    }
}

function renderTablaManifiestosCumplido(Estado, fecha_inicio, fecha_final) {
    let tbody = $("#tablaManifiestos tbody");

    // 🚀 Formateador en pesos colombianos
    const formatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0
    });

    // 🔹 Mostrar loader dentro de la tabla
    tbody.html(`
        <tr>
            <td colspan="11" class="text-center p-3">
                <div class="spinner-border text-primary" role="status"></div>
                <span class="ms-2">Cargando datos...</span>
            </td>
        </tr>
    `);

    // 🔹 Petición con jQuery $.post
    $.post(
        $("#base_url").val() + "indicadores/ObtenerManifiestosCumplido",
        { estado: Estado, fecha_inicio: fecha_inicio, fecha_final: fecha_final },
        function (data) {
            let html = "";

            if (data && data.length > 0) {
                data.forEach(row => {
                    html += `
                        <tr>
                            <td style='white-space: nowrap;'>${row.Manifiesto}</td>
                            <!--<td style='white-space: nowrap;'>${row.Remesa}</td>
                            <td style='white-space: nowrap;'>${row.Orden_Cargue}</td>-->
                            <td style='white-space: nowrap;'>${row.placa}</td>
                            <td style='white-space: nowrap;'>${row.Conductor}</td>
                            <td style='white-space: nowrap;'>${row.Origen}</td>
                            <td style='white-space: nowrap;'>${row.Destino}</td>
                            <td style='white-space: nowrap;'>${row.tipo_vehiculo}</td>
                            <td style='white-space: nowrap;'>${formatter.format(row.Total_Manifiesto)}</td>
                            <td style='white-space: nowrap;'>${row.Anticipo === '-' ? row.Anticipo : formatter.format(row.Anticipo)}</td>
                            <td style='white-space: nowrap;'>${row.Agencia}</td>
                            <td style='white-space: nowrap;'>${row.fecha_expedicion}</td>
                            <td style='white-space: nowrap;'>${row.estadomnf_actual == 1 ? "Activo" : "Inactivo"}</td>
                        </tr>
                    `;
                });
            } else {
                html = `
                    <tr>
                        <td colspan="11" class="text-center p-3 text-muted">
                            No se encontraron registros para <strong>${Estado}</strong>.
                        </td>
                    </tr>
                `;
            }

            tbody.html(html); // 🚀 Se reemplaza de una sola vez
        },
        "json"
    ).fail(function () {
        tbody.html(`
            <tr>
                <td colspan="11" class="text-center p-3 text-danger">
                    ❌ Error al cargar los datos.
                </td>
            </tr>
        `);
    });
}

function renderTablaManifiestosAgencias(Agencia, fecha_inicio, fecha_final) {
    let tbody = $("#tablaManifiestos tbody");

    // 🚀 Formateador en pesos colombianos
    const formatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0
    });

    // 🔹 Mostrar loader dentro de la tabla
    tbody.html(`
        <tr>
            <td colspan="11" class="text-center p-3">
                <div class="spinner-border text-primary" role="status"></div>
                <span class="ms-2">Cargando datos...</span>
            </td>
        </tr>
    `);

    // 🔹 Petición con jQuery $.post
    $.post(
        $("#base_url").val() + "indicadores/ObtenerManifiestosAgencias",
        { agencia: Agencia, fecha_inicio: fecha_inicio, fecha_final: fecha_final },
        function (data) {
            let html = "";

            if (data && data.length > 0) {
                data.forEach(row => {
                    html += `
                        <tr>
                            <td style='white-space: nowrap;'>${row.Manifiesto}</td>
                            <!--<td style='white-space: nowrap;'>${row.Remesa}</td>
                            <td style='white-space: nowrap;'>${row.Orden_Cargue}</td>-->
                            <td style='white-space: nowrap;'>${row.placa}</td>
                            <td style='white-space: nowrap;'>${row.Conductor}</td>
                            <td style='white-space: nowrap;'>${row.Origen}</td>
                            <td style='white-space: nowrap;'>${row.Destino}</td>
                            <td style='white-space: nowrap;'>${row.tipo_vehiculo}</td>
                            <td style='white-space: nowrap;'>${formatter.format(row.Total_Manifiesto)}</td>
                            <td style='white-space: nowrap;'>${row.Anticipo === '-' ? row.Anticipo : formatter.format(row.Anticipo)}</td>
                            <td style='white-space: nowrap;'>${row.Agencia}</td>
                            <td style='white-space: nowrap;'>${row.fecha_expedicion}</td>
                            <td style='white-space: nowrap;'>${row.estadomnf_actual == 1 ? "Activo" : "Inactivo"}</td>
                        </tr>
                    `;
                });
            } else {
                html = `
                    <tr>
                        <td colspan="11" class="text-center p-3 text-muted">
                            No se encontraron registros para <strong>${Estado}</strong>.
                        </td>
                    </tr>
                `;
            }

            tbody.html(html); // 🚀 Se reemplaza de una sola vez
        },
        "json"
    ).fail(function () {
        tbody.html(`
            <tr>
                <td colspan="11" class="text-center p-3 text-danger">
                    ❌ Error al cargar los datos.
                </td>
            </tr>
        `);
    });
}