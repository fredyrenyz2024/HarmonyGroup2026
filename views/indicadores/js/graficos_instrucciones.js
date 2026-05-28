window.VENTANA = "";

window.initScript = function (id) {
    window.VENTANA = id;
    // alert("HOLA MUNDO DESDE HOY.");

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
    }

    document.addEventListener("click", async e => {
        if (e.target.matches(`#campo-${window.VENTANA}-filtrar`) || e.target.matches(`#campo-${window.VENTANA}-filtrar *`)) {
            let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
            let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;

            GraficarInstruccionesFacturacion(fecha_inicial, fecha_final);
        }
    });

    document.getElementById('exportar_excel_instrucciones').addEventListener('click', function () {
        var table = document.getElementById('tabla-facturacion-clientes');
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
            const nombreArchivo = `Informe de Tipo Vehiculos-${fechaActual}.xlsx`;
            XLSX.writeFile(wb, nombreArchivo);
        } else {
            console.error("El elemento con el ID 'ordenes_decargue' no existe.");
        }
    });
};

async function GraficarInstruccionesFacturacion(fecha_inicio, fecha_final) {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);

        const chartDom = document.getElementById("IndicadoresInstruccionesFacturaicon");
        const tbody = document.querySelector("#tabla-general-tipo-vehiculos tbody");
        const totalGeneral = document.getElementById("total-general-tipo-vehiculo");

        // 👉 Placeholder
        chartDom.innerHTML = "<div class='text-center p-5'>⏳ Generando gráfica...</div>";
        tbody.innerHTML = `<tr><td colspan="2" class="text-muted">⏳ Cargando datos...</td></tr>`;
        totalGeneral.textContent = "";

        // 👉 Fetch PHP
        const response = await fetch($("#base_url").val() + "indicadores/InstruccionesFacturacion", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        if (!data || !data.total_instrucciones) {
            Swal.fire("Sin datos", "No se encontraron instrucciones", "info");
            chartDom.innerHTML = "<div class='text-center text-muted'>📉 No hay datos</div>";
            return;
        }

        // 👉 Reset instancia previa
        let myChart = echarts.getInstanceByDom(chartDom);
        if (myChart) myChart.dispose();
        myChart = echarts.init(chartDom);

        // 👉 Configuración gráfica
        let option = {
            title: {
                text: "Instrucciones de Facturación",
                // subtext: `Total: $${Number(data.total_instrucciones).toLocaleString()}`,
                left: "center"
            },
            tooltip: {
                trigger: "item",
                formatter: "{b}<br/>$ {c} ({d}%)"
            },
            series: [
                {
                    name: "Instrucciones",
                    type: "pie",
                    radius: ["40%", "70%"], // Dona
                    label: { formatter: "{b}: {c}" },
                    data: [
                        { name: "Pendientes", value: data.total_pendientes },
                        { name: "Facturadas", value: data.total_facturadas }
                    ]
                }
            ]
        };

        myChart.on("click", function (params) {
            // let idConfig = params.data.configuracion_id;
            GraficarFacturacionPorCliente(fecha_inicio, fecha_final, params.name);
            GraficarFacturacionPorComercial(fecha_inicio, fecha_final, params.name);
        });

        myChart.setOption(option);

        // 👉 Tabla
        tbody.innerHTML = `
            <tr><td>Pendientes</td><td>$${Number(data.total_pendientes).toLocaleString()}</td></tr>
            <tr><td>Facturadas</td><td>$${Number(data.total_facturadas).toLocaleString()}</td></tr>
        `;
        totalGeneral.textContent = `$${Number(data.total_instrucciones).toLocaleString()}`;

    } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "No se pudo cargar el gráfico de instrucciones", "error");
    }
}

async function GraficarFacturacionPorCliente(fecha_inicio, fecha_final, estado = "Completada") {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);
        datos.append("Estado", estado);

        const chartDom = document.getElementById("IndicadoresFacturacionClientes");
        const tbody = document.querySelector("#tabla-facturacion-clientes tbody");
        const totalGeneral = document.getElementById("total-general-facturacion-clientes");

        // 👉 Reset instancia previa y mostrar loading con ECharts
        let myChart = echarts.getInstanceByDom(chartDom);
        if (myChart) {
            myChart.dispose();
        }
        myChart = echarts.init(chartDom);
        myChart.showLoading({
            text: "⏳ Generando gráfica...",
            color: "#1976D2"
        });

        // 👉 Placeholder de tabla
        tbody.innerHTML = `<tr><td colspan="2" class="text-muted">⏳ Cargando datos...</td></tr>`;
        totalGeneral.textContent = "";

        // 👉 Fetch PHP
        const response = await fetch($("#base_url").val() + "indicadores/FacturacionPorCliente", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        if (!data || data.length === 0) {
            Swal.fire("Sin datos", "No se encontraron clientes", "info");
            myChart.hideLoading();
            myChart.clear();
            myChart.setOption({
                title: { text: "📉 No hay datos", left: "center", top: "middle" }
            });
            return;
        }

        // 👉 Configuración gráfica con scroll horizontal
        let option = {
            title: {
                text: `Facturación por Cliente (${estado})`,
                left: "center"
            },
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
                formatter: params => {
                    let item = params[0];
                    return `${item.name}<br/>💰 $${Number(item.value).toLocaleString()}`;
                }
            },
            grid: {
                left: "5%",
                right: "5%",
                bottom: "20%",
                containLabel: true
            },
            dataZoom: [
                {
                    type: "slider",
                    show: true,
                    start: 0,
                    end: 30, // muestra 30% y el resto con scroll
                    xAxisIndex: [0]
                },
                {
                    type: "inside",
                    xAxisIndex: [0]
                }
            ],
            xAxis: {
                type: "category",
                data: data.map(item => item.cliente),
                axisLabel: {
                    rotate: 45,
                    fontSize: 10,
                    interval: 0
                }
            },
            yAxis: {
                type: "value",
                axisLabel: { formatter: val => `$${Number(val).toLocaleString()}` }
            },
            series: [
                {
                    type: "bar",
                    data: data.map(item => item.total_facturar),
                    itemStyle: { color: "#1976D2" },
                    label: {
                        show: true,
                        position: "top",
                        formatter: val => `$${Number(val.value).toLocaleString()}`
                    }
                }
            ]
        };

        myChart.hideLoading();
        myChart.setOption(option);

        // 👉 Tabla
        tbody.innerHTML = "";
        let total = 0;
        data.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.cliente}</td>
                    <td>$${Number(item.total_facturar).toLocaleString()}</td>
                </tr>
            `;
            total += parseFloat(item.total_facturar);
        });

        totalGeneral.textContent = `$${total.toLocaleString()}`;

    } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "No se pudo cargar el gráfico de facturación por cliente", "error");
    }
}

// async function GraficarFacturacionPorComercial(fecha_inicio, fecha_final, estado = "Completada") {
//     try {
//         let datos = new FormData();
//         datos.append("Fecha_Inicio", fecha_inicio);
//         datos.append("Fecha_Final", fecha_final);
//         datos.append("Estado", estado);

//         const chartDom = document.getElementById("IndicadoresFacturaiconComercial");
//         const tbody = document.querySelector("#tabla-general-facturacion-comercial tbody");
//         const totalGeneral = document.getElementById("total-general-instruccion-comercial");

//         // 👉 Reset instancia previa y mostrar loading con ECharts
//         let myChart = echarts.getInstanceByDom(chartDom);
//         if (myChart) {
//             myChart.dispose();
//         }
//         myChart = echarts.init(chartDom);
//         myChart.showLoading({
//             text: "⏳ Generando gráfica...",
//             color: "#1976D2"
//         });

//         // 👉 Placeholder de tabla
//         tbody.innerHTML = `<tr><td colspan="2" class="text-muted">⏳ Cargando datos...</td></tr>`;
//         totalGeneral.textContent = "";

//         // 👉 Fetch PHP
//         const response = await fetch($("#base_url").val() + "indicadores/FacturacionPorComercial", {
//             method: "POST",
//             body: datos
//         });

//         const data = await response.json();

//         if (!data || data.length === 0) {
//             Swal.fire("Sin datos", "No se encontraron clientes", "info");
//             myChart.hideLoading();
//             myChart.clear();
//             myChart.setOption({
//                 title: { text: "📉 No hay datos", left: "center", top: "middle" }
//             });
//             return;
//         }

//         // 👉 Configuración gráfica con scroll horizontal
//         let option = {
//             title: {
//                 text: `Facturación por Comercial (${estado})`,
//                 left: "center"
//             },
//             tooltip: {
//                 trigger: "axis",
//                 axisPointer: { type: "shadow" },
//                 formatter: params => {
//                     let item = params[0];
//                     return `${item.name}<br/>💰 $${Number(item.value).toLocaleString()}`;
//                 }
//             },
//             grid: {
//                 left: "5%",
//                 right: "5%",
//                 bottom: "20%",
//                 containLabel: true
//             },
//             dataZoom: [
//                 {
//                     type: "slider",
//                     show: true,
//                     start: 0,
//                     end: 30, // muestra 30% y el resto con scroll
//                     xAxisIndex: [0]
//                 },
//                 {
//                     type: "inside",
//                     xAxisIndex: [0]
//                 }
//             ],
//             xAxis: {
//                 type: "category",
//                 data: data.map(item => item.cliente),
//                 axisLabel: {
//                     rotate: 45,
//                     fontSize: 10,
//                     interval: 0
//                 }
//             },
//             yAxis: {
//                 type: "value",
//                 axisLabel: { formatter: val => `$${Number(val).toLocaleString()}` }
//             },
//             series: [
//                 {
//                     type: "bar",
//                     data: data.map(item => item.total_facturar),
//                     itemStyle: { color: "#1976D2" },
//                     label: {
//                         show: true,
//                         position: "top",
//                         formatter: val => `$${Number(val.value).toLocaleString()}`
//                     }
//                 }
//             ]
//         };

//         myChart.hideLoading();
//         myChart.setOption(option);

//         // 👉 Tabla
//         tbody.innerHTML = "";
//         let total = 0;
//         data.forEach(item => {
//             tbody.innerHTML += `
//                 <tr>
//                     <td>${item.cliente}</td>
//                     <td>$${Number(item.total_facturar).toLocaleString()}</td>
//                 </tr>
//             `;
//             total += parseFloat(item.total_facturar);
//         });

//         totalGeneral.textContent = `$${total.toLocaleString()}`;

//     } catch (error) {
//         console.error("Error:", error);
//         Swal.fire("Error", "No se pudo cargar el gráfico de facturación por cliente", "error");
//     }
// }


async function GraficarFacturacionPorComercial(fecha_inicio, fecha_final, estado = "Completada") {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);
        datos.append("Estado", estado);

        const chartDom = document.getElementById("IndicadoresFacturaiconComercial");
        const tbody = document.querySelector("#tabla-general-facturacion-comercial tbody");
        const totalGeneral = document.getElementById("total-general-instruccion-comercial");

        // 👉 Reset instancia previa y mostrar loading
        let myChart = echarts.getInstanceByDom(chartDom);
        if (myChart) {
            myChart.dispose();
        }
        myChart = echarts.init(chartDom);
        myChart.showLoading({
            text: "⏳ Generando gráfica...",
            color: "#1976D2"
        });

        // 👉 Placeholder tabla
        tbody.innerHTML = `<tr><td colspan="4" class="text-muted">⏳ Cargando datos...</td></tr>`;
        totalGeneral.textContent = "";

        // 👉 Fetch PHP
        const response = await fetch($("#base_url").val() + "indicadores/FacturacionPorComercial", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        if (!data || data.length === 0) {
            Swal.fire("Sin datos", "No se encontraron resultados", "info");
            myChart.hideLoading();
            myChart.clear();
            myChart.setOption({
                title: { text: "📉 No hay datos", left: "center", top: "middle" }
            });
            return;
        }

        // 👉 Configuración gráfica
        let option = {
            title: {
                text: `Facturación por Comercial (${estado})`,
                left: "center"
            },
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
                formatter: params => {
                    let item = params[0];
                    return `${item.name}<br/>💰 $${Number(item.value).toLocaleString()}`;
                }
            },
            grid: {
                left: "5%",
                right: "5%",
                bottom: "20%",
                containLabel: true
            },
            dataZoom: [
                { type: "slider", show: true, start: 0, end: 40, xAxisIndex: [0] },
                { type: "inside", xAxisIndex: [0] }
            ],
            xAxis: {
                type: "category",
                data: data.map(item => item.Usuario),
                axisLabel: { rotate: 45, fontSize: 10, interval: 0 }
            },
            yAxis: {
                type: "value",
                axisLabel: { formatter: val => `$${Number(val).toLocaleString()}` }
            },
            series: [
                {
                    type: "bar",
                    data: data.map(item => item.total_facturacion),
                    itemStyle: { color: "#1976D2" },
                    label: {
                        show: true,
                        position: "top",
                        formatter: val => `$${Number(val.value).toLocaleString()}`
                    }
                }
            ]
        };

        myChart.hideLoading();
        myChart.setOption(option);

        // 👉 Tabla
        tbody.innerHTML = "";
        let total = 0;
        data.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.Usuario}</td>
                    <td>$${Number(item.total_instruccion).toLocaleString()}</td>
                    <td>$${Number(item.total_servicio_especial).toLocaleString()}</td>
                    <td><strong>$${Number(item.total_facturacion).toLocaleString()}</strong></td>
                </tr>
            `;
            total += parseFloat(item.total_facturacion);
        });

        totalGeneral.textContent = `$${total.toLocaleString()}`;

    } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "No se pudo cargar el gráfico de facturación por comercial", "error");
    }
}