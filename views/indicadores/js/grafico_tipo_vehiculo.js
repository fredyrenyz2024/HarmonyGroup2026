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

            Listar_Grafica_Indicadores_Tipo_Vehiculo(fecha_inicial, fecha_final);
        }
    });

    document.getElementById('exportar_excel').addEventListener('click', function () {
        var table = document.getElementById('tbl-detalle-tipo-vehiculo-responsable');
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

// async function Listar_Grafica_Indicadores_Tipo_Vehiculo(fecha_inicial, fecha_final) {
//     try {
//         let datos = new FormData();
//         datos.append("Fecha_Inicio", fecha_inicial);
//         datos.append("Fecha_Final", fecha_final);

//         const response = await fetch($("#base_url").val() + "indicadores/IndicadoresTipoVehiculos", {
//             method: "POST",
//             body: datos
//         });

//         const data = await response.json();

//         if (!data || data.error) {
//             Swal.fire("Error", "No se encontraron datos válidos", "error");
//             return;
//         }

//         // 🔹 Transformamos en formato ECharts (guardando configuracion_id)
//         let chartData = data.map(item => ({
//             configuracion_completa: item.Configuracion,
//             name: item.Configuracion_Simple,
//             value: item.Total_Vehiculos,
//             configuracion_id: item.configuracion_id
//         }));

//         // === Gráfico de torta ===
//         let chartDom = document.getElementById("IndicadoresTipoVehiculos");
//         let myChart = echarts.init(chartDom);

//         let option = {
//             title: {
//                 text: "Vehículos por Configuración",
//                 subtext: `Total: ${chartData.reduce((a, b) => a + parseInt(b.value), 0)}`,
//                 left: "center"
//             },
//             tooltip: {
//                 trigger: "item",
//                 formatter: "{b}<br/>Cantidad: {c} ({d}%)"
//             },
//             legend: {
//                 orient: "horizontal",
//                 bottom: 0
//             },
//             series: [
//                 {
//                     name: "Configuraciones",
//                     type: "pie",
//                     radius: "60%",
//                     label: { formatter: "{b}: {c}" },
//                     data: chartData
//                 }
//             ]
//         };

//         myChart.setOption(option);

//         // 👉 Evento de click para capturar configuracion_id
//         myChart.on("click", function (params) {
//             let idConfig = params.data.configuracion_id;

//             // 👉 Aquí llamas otra función con el ID
//             MostrarDetallePorConfiguracion(idConfig, fecha_inicial, fecha_final);
//         });

//         // === Tabla ===
//         const tbody = document.querySelector("#tabla-general-tipo-vehiculos tbody");
//         const totalGeneral = document.getElementById("total-general-tipo-vehiculo");

//         tbody.innerHTML = chartData.map(item => `
//             <tr>
//                 <td>${item.configuracion_completa}</td>
//                 <td>${item.value}</td>
//             </tr>
//         `).join("");

//         totalGeneral.textContent = chartData.reduce((a, b) => a + parseInt(b.value), 0);

//     } catch (error) {
//         console.error("Error cargando datos:", error);
//         Swal.fire("Error", "Hubo un problema al cargar los datos", "error");
//     } finally {
//         cargarDetalleVehiculos(fecha_inicial, fecha_final);
//     }
// }

// async function MostrarDetallePorConfiguracion(configuracion_id, fecha_inicio, fecha_final) {
//     try {
//         let datos = new FormData();
//         datos.append("Fecha_Inicio", fecha_inicio);
//         datos.append("Fecha_Final", fecha_final);
//         datos.append("configuracion_id", configuracion_id);

//         const response = await fetch($("#base_url").val() + "indicadores/TipoVehiculosAgencia", {
//             method: "POST",
//             body: datos
//         });

//         const data = await response.json();

//         if (!data || data.length === 0) {
//             Swal.fire("Sin datos", "No se encontraron registros para esta configuración", "info");
//             return;
//         }

//         // === Procesamos data ===
//         let agencias = data.map(item => item.agencia);
//         let totales = data.map(item => item.total_vehiculos);

//         // === Gráfico de barras ===
//         let chartDom = document.getElementById("IndicadoresTipoVehiculosAgencia");
//         let myChart = echarts.init(chartDom);

//         let option = {
//             title: { text: "Vehículos por Agencia", left: "center" },
//             tooltip: { trigger: "axis" },
//             xAxis: { type: "category", data: agencias, name: "Agencia" },
//             yAxis: { type: "value", name: "Cantidad" },
//             series: [
//                 {
//                     type: "bar",
//                     data: totales,
//                     itemStyle: { color: "#0D47A1" },
//                     label: { show: true, position: "top" }
//                 }
//             ]
//         };

//         myChart.setOption(option);

//         // === Tabla ===
//         const tbody = document.querySelector("#tabla-estados-tipo-vehiculo-agencia tbody");
//         const totalGeneral = document.getElementById("total-general-tipo-vehiculo-agencia");
//         tbody.innerHTML = "";

//         let sumaTotal = 0;

//         data.forEach(item => {
//             tbody.innerHTML += `
//                 <tr>
//                     <td>${item.agencia}</td>
//                     <td>${item.total_vehiculos}</td>
//                 </tr>
//             `;
//             sumaTotal += parseInt(item.total_vehiculos);
//         });

//         totalGeneral.textContent = sumaTotal;

//     } catch (error) {
//         console.error("Error cargando datos:", error);
//         Swal.fire("Error", "Hubo un problema al cargar los datos", "error");
//     } finally {
//         GraficarVehiculosPorResponsable(configuracion_id, fecha_inicio, fecha_final);
//     }
// }

async function Listar_Grafica_Indicadores_Tipo_Vehiculo(fecha_inicial, fecha_final) {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicial);
        datos.append("Fecha_Final", fecha_final);

        const response = await fetch($("#base_url").val() + "indicadores/IndicadoresTipoVehiculos", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        if (!data || data.error) {
            Swal.fire("Error", "No se encontraron datos válidos", "error");
            return;
        }

        // 🔹 Transformamos en formato ECharts (guardando configuracion_id)
        let chartData = data.map(item => ({
            configuracion_completa: item.Configuracion,
            name: item.Configuracion_Simple,
            value: item.Total_Vehiculos,
            configuracion_id: item.configuracion_id
        }));

        // === Gráfico de torta ===
        let chartDom = document.getElementById("IndicadoresTipoVehiculos");
        let myChart = echarts.getInstanceByDom(chartDom);
        if (myChart) {
            myChart.dispose(); // 🔥 limpiar instancia previa
        }
        myChart = echarts.init(chartDom);

        let option = {
            title: {
                text: "Vehículos por Configuración",
                subtext: `Total: ${chartData.reduce((a, b) => a + parseInt(b.value), 0)}`,
                left: "center"
            },
            tooltip: {
                trigger: "item",
                formatter: "{b}<br/>Cantidad: {c} ({d}%)"
            },
            legend: {
                orient: "horizontal",
                bottom: 0
            },
            series: [
                {
                    name: "Configuraciones",
                    type: "pie",
                    radius: "60%",
                    label: { formatter: "{b}: {c}" },
                    data: chartData
                }
            ]
        };

        myChart.setOption(option);

        // 👉 Evento de click para capturar configuracion_id
        myChart.on("click", function (params) {
            let idConfig = params.data.configuracion_id;
            MostrarDetallePorConfiguracion(idConfig, fecha_inicial, fecha_final);
        });

        // === Tabla ===
        const tbody = document.querySelector("#tabla-general-tipo-vehiculos tbody");
        const totalGeneral = document.getElementById("total-general-tipo-vehiculo");

        tbody.innerHTML = chartData.map(item => `
            <tr>
                <td>${item.configuracion_completa}</td>
                <td>${item.value}</td>
            </tr>
        `).join("");

        totalGeneral.textContent = chartData.reduce((a, b) => a + parseInt(b.value), 0);

    } catch (error) {
        console.error("Error cargando datos:", error);
        Swal.fire("Error", "Hubo un problema al cargar los datos", "error");
    } finally {
        cargarDetalleVehiculos(fecha_inicial, fecha_final);
    }
}

async function MostrarDetallePorConfiguracion(configuracion_id, fecha_inicio, fecha_final) {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);
        datos.append("configuracion_id", configuracion_id);

        const response = await fetch($("#base_url").val() + "indicadores/TipoVehiculosAgencia", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        if (!data || data.length === 0) {
            Swal.fire("Sin datos", "No se encontraron registros para esta configuración", "info");
            return;
        }

        // === Procesamos data ===
        let agencias = data.map(item => item.agencia);
        let totales = data.map(item => item.total_vehiculos);

        // === Gráfico de barras ===
        let chartDom = document.getElementById("IndicadoresTipoVehiculosAgencia");
        let myChart = echarts.getInstanceByDom(chartDom);
        if (myChart) {
            myChart.dispose(); // 🔥 limpiar instancia previa
        }
        myChart = echarts.init(chartDom);

        let option = {
            title: { text: "Vehículos por Agencia", left: "center" },
            tooltip: { trigger: "axis" },
            xAxis: { type: "category", data: agencias, name: "Agencia" },
            yAxis: { type: "value", name: "Cantidad" },
            series: [
                {
                    type: "bar",
                    data: totales,
                    itemStyle: { color: "#0D47A1" },
                    label: { show: true, position: "top" }
                }
            ]
        };

        myChart.setOption(option);

        // === Tabla ===
        const tbody = document.querySelector("#tabla-estados-tipo-vehiculo-agencia tbody");
        const totalGeneral = document.getElementById("total-general-tipo-vehiculo-agencia");
        tbody.innerHTML = "";

        let sumaTotal = 0;

        data.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.agencia}</td>
                    <td>${item.total_vehiculos}</td>
                </tr>
            `;
            sumaTotal += parseInt(item.total_vehiculos);
        });

        totalGeneral.textContent = sumaTotal;

    } catch (error) {
        console.error("Error cargando datos:", error);
        Swal.fire("Error", "Hubo un problema al cargar los datos", "error");
    } finally {
        GraficarVehiculosPorResponsable(configuracion_id, fecha_inicio, fecha_final);
    }
}

async function GraficarVehiculosPorResponsable(configuracion_id, fecha_inicio, fecha_final) {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);
        datos.append("configuracion_id", configuracion_id);

        const chartDom = document.getElementById("IndicadoresVehiculosResponsable");
        const tbody = document.querySelector("#tabla-estados-tipo-vehiculo-responsable tbody");
        const totalGeneral = document.getElementById("total-general-tipo-vehiculo-responsable");

        // 👉 Limpiar tabla mientras carga
        tbody.innerHTML = `
            <tr>
                <td colspan="2" class="text-center text-muted">⏳ Generando tabla...</td>
            </tr>
        `;
        totalGeneral.textContent = "";

        // 👉 Preparar instancia de gráfico
        let myChart = echarts.getInstanceByDom(chartDom);
        if (myChart) {
            myChart.dispose();
        }
        myChart = echarts.init(chartDom);

        // 👉 Mostrar loading en el gráfico
        myChart.showLoading("default", {
            text: "⏳ Generando gráfica...",
            color: "#0d6efd",
            textColor: "#000",
            maskColor: "rgba(255,255,255,0.8)"
        });

        // 👉 Llamar al backend
        const response = await fetch($("#base_url").val() + "indicadores/VehiculosPorResponsable", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        if (!data || data.length === 0) {
            Swal.fire("Sin datos", "No se encontraron vehículos por responsable", "info");

            myChart.hideLoading();
            myChart.clear();
            myChart.setOption({
                title: {
                    text: "📉 No hay datos para graficar",
                    left: "center",
                    top: "center",
                    textStyle: { color: "#999", fontSize: 16 }
                }
            });

            tbody.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center text-muted">📉 No hay datos disponibles</td>
                </tr>
            `;
            return;
        }

        // 👉 Configuración del gráfico
        let option = {
            title: {
                text: "Distribución de Vehículos por Responsable",
                left: "center"
            },
            tooltip: {
                trigger: "item",
                formatter: "{b}<br/>Cantidad: {c} ({d}%)"
            },
            series: [
                {
                    name: "Vehículos",
                    type: "pie",
                    radius: "60%",
                    data: data.map(item => ({
                        name: item.Responsable,
                        value: item.Total_Vehiculos
                    })),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                    }
                }
            ]
        };

        // 👉 Ocultar loading y graficar
        myChart.hideLoading();
        myChart.setOption(option);

        // 👉 Llenar tabla
        tbody.innerHTML = "";
        let total = 0;

        data.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.Responsable}</td>
                    <td>${item.Total_Vehiculos}</td>
                </tr>
            `;
            total += parseInt(item.Total_Vehiculos);
        });

        totalGeneral.textContent = total;

    } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "No se pudo cargar el gráfico", "error");
    }
}

function cargarDetalleVehiculos(fecha_inicio, fecha_fin) {
    $("#loader").show();
    $("#tabla-detalle-tipo-vehiculo-responsable").html(""); // limpiar tabla

    $.ajax({
        url: $("#base_url").val() + "indicadores/detalleVehiculos",
        type: "POST",
        data: {
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin
        },
        dataType: "json",
        success: function (data) {
            $("#loader").hide();

            if (data.error) {
                alert("Error: " + data.error);
                return;
            }

            if (data.length === 0) {
                $("#tabla-detalle-tipo-vehiculo-responsable").html(
                    `<tr><td colspan="8">No se encontraron registros</td></tr>`
                );
                return;
            }

            let filas = "";
            $.each(data, function (i, row) {
                filas += `
                        <tr>
                            <td>${row.Manifiesto}</td>
                            <td>${row.placa}</td>
                            <td>${row.Conductor}</td>
                            <td>${row.celular}</td>
                            <td>${row.Lugar}</td>
                            <td>${row.Fecha_Expedicion}</td>
                            <td>${row.Configuracion}</td>
                            <td>${row.clase}</td>
                            <td>${row.Origen}</td>
                            <td>${row.Destino}</td>
                        </tr>
                    `;
            });

            $("#tabla-detalle-tipo-vehiculo-responsable").html(filas);
        },
        error: function (xhr, status, error) {
            $("#loader").hide();
            alert("Error al cargar los datos: " + error);
        }
    });
}

