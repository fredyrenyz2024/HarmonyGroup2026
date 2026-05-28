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

            Listar_Grafica_Indicadores_Solicitudes(fecha_inicial, fecha_final);
        }
    });

    document.getElementById('exportar_excel').addEventListener('click', function () {
        var table = document.getElementById('tbl-detalle-solicitudes');
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
            const nombreArchivo = `Informe de Solicitudes_${fechaActual}.xlsx`;
            XLSX.writeFile(wb, nombreArchivo);
        } else {
            console.error("El elemento con el ID 'ordenes_decargue' no existe.");
        }
    });
};

async function Listar_Grafica_Indicadores_Solicitudes(fecha_inicio, fecha_final) {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);

        const response = await fetch($("#base_url").val() + "indicadores/IndicadoresSolicitudes", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        if (!data || data.error) {
            Swal.fire("Error", "No se encontraron datos válidos", "error");
            return;
        }

        // 🔹 Transformamos el array del backend en formato para la gráfica
        let chartData = [
            { name: "Con Manifiesto", value: data.solicitudes_con_manifiesto },
            { name: "Sin Manifiesto", value: data.solicitudes_sin_manifiesto }
        ];

        let total = data.total_solicitudes;

        // === Gráfico de torta ===
        let chartDom = document.getElementById("IndicadoresSolicitudes");
        let myChart = echarts.init(chartDom);

        let option = {
            title: {
                text: "Solicitudes de Servicio",
                subtext: `Total: ${total}`,
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
                    name: "Solicitudes",
                    type: "pie",
                    radius: "60%",
                    label: { formatter: "{b}: {c}" },
                    data: chartData
                }
            ]
        };

        // 👉 Evento de click
        myChart.on("click", function (params) {
            RenderSolicitudesEstados(params.name, fecha_inicio, fecha_final);
            RenderDetalleSolicitudesAgencia('', fecha_inicio, fecha_final, params.name);
        });

        myChart.setOption(option);

        // === Tabla ===
        const tbody = document.querySelector("#tabla-general-precintos tbody");
        const totalGeneral = document.getElementById("total-general");

        tbody.innerHTML = chartData.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.value}</td>
            </tr>
        `).join("");

        totalGeneral.textContent = total;

    } catch (error) {
        console.error("Error cargando datos:", error);
        Swal.fire("Error", "Hubo un problema al cargar los datos", "error");
    }
}

// Funciones para las agencias segun el estado
async function RenderSolicitudesEstados(estado, fecha_inicio, fecha_final) {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);
        datos.append("estado", estado);

        const response = await fetch($("#base_url").val() + "indicadores/Graficos_Solicitudes_Estados", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        if (!data || Object.keys(data).length === 0) {
            Swal.fire("Sin datos", "No se encontraron registros en el rango seleccionado", "info");
            return;
        }

        // === Render gráfico ===
        let chartDom = document.getElementById("IndicadoresSolicitudesAgencia");
        let myChart = echarts.init(chartDom);

        let agencias = [];
        let totales = [];

        // ⚡ Normalizamos los datos
        let rows = [];
        if (estado === "Sin Manifiesto") {
            rows = data; // array simple
        } else if (estado === "Con Manifiesto") {
            rows = data; // array simple
        } else {
            // ambos → viene como objeto { sin_manifiesto: [...], con_manifiesto: [...] }
            rows = [
                ...data.sin_manifiesto.map(r => ({ ...r, tipo: "Sin Manifiesto" })),
                ...data.con_manifiesto.map(r => ({ ...r, tipo: "Con Manifiesto" }))
            ];
        }

        // llenar arrays para gráfico
        rows.forEach(item => {
            agencias.push(item.agencia);
            totales.push(item.solicitudes_sin_manifiesto || item.solicitudes_con_manifiesto || 0);
        });

        let option = {
            title: { text: "Solicitudes por Agencia Diligenciadas por Mes", left: "center" },
            tooltip: { trigger: "axis" },
            xAxis: { type: "category", data: agencias, name: "Agencia" }, // 👉 categorías abajo
            yAxis: { type: "value", name: "Cantidad" }, // 👉 valores a la izquierda
            series: [
                {
                    type: "bar",
                    data: totales,
                    itemStyle: { color: "#0D47A1" },
                    label: { show: true, position: "top" } // 👉 muestra los números arriba de cada barra
                }
            ]
        };

        //Click para el detalle agencia
        myChart.on("click", function (params) {
            RenderDetalleSolicitudesAgencia(params.name, fecha_inicio, fecha_final, estado);
        });

        myChart.setOption(option);

        // === Render tabla ===
        const tbody = document.querySelector("#tabla-estados-solicitudes tbody");
        const totalGeneral = document.getElementById("total-general-estado");
        tbody.innerHTML = "";

        let sumaTotal = 0; // acumulador

        rows.forEach(item => {
            let cantidad = item.solicitudes_sin_manifiesto || item.solicitudes_con_manifiesto || 0;
            let tipo = item.tipo || estado;

            tbody.innerHTML += `
            <tr>
                <td>${item.agencia}</td>
                <td>${cantidad}</td>
            </tr>
        `;

            sumaTotal += cantidad; // ✅ acumular
        });

        // ✅ mostrar total al final
        totalGeneral.textContent = sumaTotal;


    } catch (error) {
        console.error("Error cargando datos:", error);
        Swal.fire("Error", "Hubo un problema al cargar los datos", "error");
    }
}

async function RenderDetalleSolicitudesAgencia(agencia, fecha_inicio, fecha_final, estado) {
    // 🔹 Mostrar loader
    document.getElementById("loader").style.display = "";
    try {

        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);
        datos.append("estado", estado);
        datos.append("agencia", agencia);

        const response = await fetch($("#base_url").val() + "indicadores/Detalle_Solicitud_Servicios", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        let tbody = document.getElementById("tabla-detalle-solicitudes");
        tbody.innerHTML = ""; // limpiar tabla

        if (!data || data.length === 0) {
            Swal.fire("Sin datos", "No se encontraron registros en el rango seleccionado", "info");
            return;
        }

        data.forEach((row) => {
            // 🔹 Mostrar solo una diferencia (días, horas o minutos)
            let diferencia = "";
            if (row.Diferencia_dias != 0) {
                diferencia = row.Diferencia_dias + " días";
            } else if (row.Diferencia_horas != 0) {
                diferencia = row.Diferencia_horas + " horas";
            } else if (row.Diferencia_minutos != 0) {
                diferencia = row.Diferencia_minutos + " minutos";
            } else {
                diferencia = ""; // si no hay diferencia
            }

            let tr = `
                <tr>
                    <td>${row.Responsable}</td>
                    <td>${row.placa}</td>
                    <td>${row.usuario_auditor}</td>
                    <td>${row.Manifiesto}</td>
                    <td>${row.Fecha_Solicitud}</td>
                    <td>${row.Fecha_Expedicion}</td>
                    <td>${row.nundoc_solicitud}</td>
                    <td>${row.Agencia}</td>
                    <td>${row.nombre_cliente}</td>
                    <td>${row.tipo_mercancia}</td>
                    <td>${row.empaque}</td>
                    <td>${row.tipo_vehiculo}</td>
                    <td>${row.clase}</td>
                    <td>${diferencia}</td>
                </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", tr);
        });

    } catch (error) {
        console.error("Error cargando datos:", error);
        Swal.fire("Error", "Hubo un problema al cargar los datos", "error");
    } finally {
        // 🔹 Ocultar loader siempre al terminar
        document.getElementById("loader").style.display = "none";
    }
}
