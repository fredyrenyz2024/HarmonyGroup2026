window.VENTANA = "";

window.initScript = function (id) {
    window.VENTANA = id;
    Listar_Grafica_General_Precintos();
};

async function Listar_Grafica_General_Precintos() {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", '');
        datos.append("Fecha_Final", '');

        const response = await fetch($("#base_url").val() + "indicadores/Graficos_General_Precintos", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        if (!data || data.length === 0) {
            Swal.fire("Sin datos", "No se encontraron registros en el rango seleccionado", "info");
            return;
        }

        renderGraficaGeneral(data, '', '');
        renderTablaGeneral(data);

    } catch (error) {
        console.error("Error cargando datos:", error);
        Swal.fire("Error", "Hubo un problema al cargar los datos", "error");
    }
}

// function renderGraficaGeneral(data, fecha_inicio, fecha_final) {
function renderGraficaGeneral(data) {
    let chartDom = document.getElementById("grafica-general-precintos");
    let myChart = echarts.init(chartDom);

    let option = {
        title: {
            text: "Distribución de Precintos por Agencia",
            left: "center"
        },
        tooltip: {
            trigger: "item",
            formatter: "{b}<br/>Ingresos: {c} ({d}%)"
        },
        legend: {
            orient: "horizontal",
            bottom: 10
        },
        series: [
            {
                name: "Agencias",
                type: "pie",
                radius: "60%",
                label: { formatter: "{b}: {c}" },
                data: data
                    .filter(item => item.agencia !== "TOTAL")
                    .map(item => ({
                        name: item.agencia,
                        value: item.ingreso === '0' ? item.almacen : item.ingreso
                    }))
            }
        ]
    };

    myChart.setOption(option);

    // Evento click en gráfica
    myChart.on("click", async function (params) {
        let agencia = params.name;
        let detalle = data.find(item => item.agencia === agencia);

        if (detalle) {
            let datos = new FormData();
            datos.append("Fecha_Inicio", '');
            datos.append("Fecha_Final", '');
            datos.append("Agencia", agencia);

            const response = await fetch($("#base_url").val() + "indicadores/Graficos_Precintos_Agencia", {
                method: "POST",
                body: datos
            });

            const data = await response.json();

            if (!data || data.length === 0) {
                Swal.fire("Sin datos", "No se encontraron registros en el rango seleccionado", "info");
                return;
            }

            renderGraficosPrecintos(data, agencia);
        }
    });
}

function renderTablaGeneral(data) {
    let tbody = document.querySelector("#tabla-general-precintos tbody");
    tbody.innerHTML = "";

    data.forEach(item => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td style='width:auto; white-space: nowrap;'>${item.agencia}</td>
            <td style='width:auto; white-space: nowrap;'>${item.ingreso}</td>
            <td style='width:auto; white-space: nowrap;'>${item.disponibles === '0' ? item.almacen : item.disponibles}</td>
            <td style='width:auto; white-space: nowrap;'>${item.asignados}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderGraficosPrecintos(data, agencia) {
    // 🔹 Asegurar que siempre sea array
    if (!Array.isArray(data)) {
        data = [data];
    }

    // Contadores por agencia
    let agencias = {};
    data.forEach(item => {
        let agencia = item.agencia_asignada;
        if (!agencias[agencia]) {
            agencias[agencia] = { disponibles: 0, asignados: 0 };
        }

        if (item.estado_precinto === "disponible") {
            agencias[agencia].disponibles++;
        } else if (item.estado_precinto === "asignado") {
            agencias[agencia].asignados++;
        }
    });

    let chart3 = echarts.init(document.getElementById("graficoCruce"));

    let option3 = {
        title: { text: "Cruce Global (Disponibles vs Asignados)", left: "center" },
        tooltip: { trigger: "item" },
        legend: { bottom: 0 },
        series: [{
            name: "Cruce Global",
            type: "pie",
            radius: "60%",
            data: [
                { name: "Disponibles", value: data[0].disponibles },
                { name: "Asignados", value: data[0].asignados }
            ],
            emphasis: {
                itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0,0,0,0.5)" }
            }
        }]
    };

    chart3.setOption(option3);

    // --- Escuchar clic en el gráfico ---
    chart3.on("click", function (params) {
        if (params.name === "Disponibles") {
            renderTabla(data[0].detalle_disponibles, "Disponibles", agencia);
        } else if (params.name === "Asignados") {
            renderTabla(data[0].detalle_asignados, "Asignados", agencia);
        }
    });
}



// --- Función para renderizar tabla ---
function renderTabla(data, titulo, agencia) {
    let contenedor = document.getElementById("tablaDetalle");
    if (!contenedor) return;

    let html = `<h5>Detalle de ${titulo}</h5>`;
    html += `
                <div class="d-flex justify-content-between align-items-center mb-2">
                <!-- <span class="badge badge-phoenix badge-phoenix-info" style="font-size: 13px;">
                    Número de órdenes de cargue: <span class="fw-bold badge-phoenix-info contador">0</span>
                </span> -->
                <a href="JavaScript:void(0);" id="exportar_informe_precintos_excel" class="text-decoration-none d-flex align-items-center text-success fw-bold">
                    <img src="${$("#base_url").val()}public/img/excel_2013.png" alt="Excel" width="18px" class="me-1">
                    Exportar a Excel
                </a>
            </div>
    <table class='table table-bordered table-striped table-sm text-center' style=" font-size:12px;" id="tabla-precintos-detalle">
           <thead class="table-primary">
           <tr>`;

    // Encabezados dinámicos según llaves
    let keys = Object.keys(data[0] || {});
    keys.forEach(k => { html += `<th>${k}</th>`; });
    html += `</tr></thead><tbody>`;

    // Filas
    data.forEach(row => {
        html += `<tr>`;
        keys.forEach(k => { html += `<td>${row[k]}</td>`; });
        html += `</tr>`;
    });

    html += `</tbody></table>`;
    contenedor.innerHTML = html;



    // 5. Asignar Evento de Exportación (Necesita una función de exportación)
    // --------------------------------------------------------------------------------

    // Event Listener (Tu código principal corregido)
    // Asegúrate de que este ID coincida con el botón en tu HTML
    document.getElementById('exportar_informe_precintos_excel').addEventListener('click', () => {
        // Obtener el estado actual (asumimos que está disponible globalmente o se puede obtener del título)
        // Usaremos un placeholder para el estado que debes obtener del contexto
        const estadoActual = titulo || 'General';

        // Llamar a la función de exportación
        exportarTablaAExcel('tabla-precintos-detalle', estadoActual, agencia);
    });
}


// Variable auxiliar para usar en el nombre del archivo si es necesario
const fechaActual = new Date().toISOString().slice(0, 10);

/**
 * Realiza la exportación de una tabla específica a Excel.
 * @param {string} tableId - ID de la tabla a exportar.
 * @param {string} estado - El estado actual para el nombre del archivo.
 */
function exportarTablaAExcel(tableId, estado, agencia) {
    const table = document.getElementById(tableId);

    if (table) {
        // Mostrar alerta de inicio y obtener la instancia
        Swal.fire({
            title: "Exportando...",
            text: "Preparando su informe de instrucciones. Esto puede tomar un momento.",
            icon: "info",
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Clonar la tabla para no modificar la original
            const clonedTable = table.cloneNode(true);

            // Columna 6 (Usuario) que quieres omitir. Los índices son base 0.
            const columnsToOmit = [6];

            // Eliminar las columnas no deseadas en el encabezado
            let ths = clonedTable.querySelectorAll('thead th');
            columnsToOmit.slice().reverse().forEach(index => {
                ths[index].remove();
            });

            // Eliminar las columnas no deseadas en las filas del cuerpo
            let rows = clonedTable.querySelectorAll('tbody tr');
            rows.forEach(row => {
                let cells = row.querySelectorAll('td');
                columnsToOmit.slice().reverse().forEach(index => {
                    cells[index].remove();
                });
            });

            // Convertir la tabla modificada a libro de Excel
            const wb = XLSX.utils.table_to_book(clonedTable);

            // 🚨 NOMBRE DE ARCHIVO DINÁMICO Y TÍTULO
            const nombreArchivo = `Precintos_${agencia}_${estado}_${fechaActual}.xlsx`;

            // Escribir el archivo y forzar la descarga
            XLSX.writeFile(wb, nombreArchivo);

            // 🚨 CERRAR ALERTA DE SWEETALERT
            Swal.close();

        } catch (error) {
            console.error("Error al exportar a Excel:", error);
            Swal.fire('Error', `Fallo la exportación: ${error.message}`, 'error');
        }

    } else {
        console.error(`El elemento con el ID '${tableId}' no existe.`);
        Swal.fire('Error', `La tabla con ID '${tableId}' no fue encontrada.`, 'error');
    }
}