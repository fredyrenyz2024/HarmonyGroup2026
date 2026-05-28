window.VENTANA = "";
// Variable global para el título del detalle
const estadoDetalleTitulo = document.getElementById("estado-detalle-titulo");

window.initScript = function (id) {
    window.VENTANA = id;

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

}

async function GraficarInstruccionesFacturacion(fecha_inicio, fecha_final) {
    try {
        let datos = new FormData();
        // 🚨 Importante: Usar los nombres de variables del controlador PHP
        datos.append("fechaInicio", fecha_inicio);
        datos.append("fechaFinal", fecha_final);

        const chartDom = document.getElementById("IndicadoresInstruccionesFacturaicon");
        const tbody = document.querySelector("#tabla-general-tipo-vehiculos tbody");
        const totalGeneral = document.getElementById("total-general-tipo-vehiculo");

        // Placeholder
        chartDom.innerHTML = "<div class='text-center p-5'>⏳ Generando gráfica...</div>";
        tbody.innerHTML = `<tr><td colspan="2" class="text-muted">⏳ Cargando datos...</td></tr>`;
        totalGeneral.textContent = "";

        // 👉 Fetch PHP
        const response = await fetch($("#base_url").val() + "indicadores/obtenerConteoInstruccionesPorEstado", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        if (!data.status || !data.data || data.data.length === 0) {
            Swal.fire("Sin datos", "No se encontraron instrucciones", "info");
            chartDom.innerHTML = "<div class='text-center text-muted'>📉 No hay datos</div>";
            tbody.innerHTML = `<tr><td colspan="2" class="text-muted">No hay datos.</td></tr>`;
            totalGeneral.textContent = "0";
            return;
        }

        // PROCESAMIENTO DE DATOS (Recibe [{estado_instruccion, total_instrucciones}, ...])
        let chartData = [];
        let tableHTML = "";
        let totalGeneralCount = 0;

        data.data.forEach(item => {
            const estado = item.estado_instruccion;
            const total = parseInt(item.total_instrucciones);

            chartData.push({ name: estado, value: total });
            tableHTML += `<tr><td>${estado}</td><td>${total.toLocaleString()}</td></tr>`;
            totalGeneralCount += total;
        });


        // Reset instancia previa
        let myChart = echarts.getInstanceByDom(chartDom);
        if (myChart) myChart.dispose();
        myChart = echarts.init(chartDom);

        // Configuración gráfica
        let option = {
            title: {
                text: "Instrucciones de Facturación",
                left: "center"
            },
            tooltip: {
                trigger: "item",
                // Muestra el nombre del estado (b), el conteo (c) y el porcentaje (d)
                formatter: "{b}<br/>Total: {c} ({d}%)"
            },
            series: [
                {
                    name: "Instrucciones",
                    type: "pie",
                    radius: ["40%", "70%"], // Dona
                    label: { formatter: "{b}: {c}" },
                    data: chartData // 👈 DATOS DINÁMICOS
                }
            ]
        };

        // 👉 EVENTO CLICK ECHARTS (LLAMA A LAS OTRAS DOS CONSULTAS)
        myChart.off("click");
        myChart.on("click", function (params) {
            const estadoClickeado = params.name;

            // 1. Carga el conteo por cliente y lo grafica (Consulta 3)
            GraficarFacturacionPorCliente(fecha_inicio, fecha_final, estadoClickeado);

            // 2. Carga el listado detallado (Consulta 2)
            ListarInstruccionesDetalle(fecha_inicio, fecha_final, estadoClickeado);
        });

        myChart.setOption(option);

        // 👉 Tabla
        tbody.innerHTML = tableHTML;
        totalGeneral.textContent = totalGeneralCount.toLocaleString();

    } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "No se pudo cargar el gráfico de instrucciones", "error");
    }
}

/**
 * Función para cargar y mostrar el Conteo por Cliente (Consulta 3).
 * @param {string} fecha_inicio 
 * @param {string} fecha_final 
 * @param {string} estado - Estado de la instrucción clickeado.
 */
async function GraficarFacturacionPorCliente(fecha_inicio, fecha_final, estado) {
    const chartDomClientes = document.getElementById("chartClientes");

    // 🚨 1. LIMPIEZA ROBUSTA: Desechar la instancia previa de ECharts de forma segura
    // Obtenemos la instancia, si existe.
    let myChartClientes = echarts.getInstanceByDom(chartDomClientes);
    if (myChartClientes) {
        try {
            // Intentamos desecharla para liberar memoria y el canvas
            myChartClientes.dispose();
        } catch (e) {
            // Si el dispose() falla (que es el error que recibes), lo ignoramos y seguimos
            console.warn("ECharts disposal failed (ignored):", e);
        }
    }

    // 2. Placeholder e Indicador de Carga
    // Limpiamos el contenedor (ahora sin riesgo de que ECharts lo esté usando)
    chartDomClientes.innerHTML = "<div class='text-center p-5'>⏳ Cargando conteo por cliente...</div>";
    estadoDetalleTitulo.textContent = estado;

    try {
        let datos = new FormData();
        datos.append("fechaInicio", fecha_inicio);
        datos.append("fechaFinal", fecha_final);
        datos.append("estado", estado);

        // 👉 Fetch PHP para Consulta 3
        const response = await fetch($("#base_url").val() + "indicadores/obtenerConteoPorClienteYEstado", {
            method: "POST",
            body: datos
        });
        const data = await response.json();

        if (!data.status || !data.data || data.data.length === 0) {
            chartDomClientes.innerHTML = `<div class='text-center text-muted p-5'>No hay clientes con instrucciones en estado: ${estado}</div>`;
            return;
        }

        // PROCESAMIENTO DE DATOS
        let chartDataClientes = data.data.map(item => ({
            name: item.nombre_cliente,
            value: parseInt(item.total_instrucciones_cliente)
        }));

        // 3. INICIALIZACIÓN: Creamos la nueva instancia de ECharts
        // ¡Importante! Antes de inicializar, aseguramos que el DOM esté limpio del mensaje de carga
        chartDomClientes.innerHTML = '';
        myChartClientes = echarts.init(chartDomClientes);

        // 4. Configuración Gráfica de Clientes (Barras)
        let optionClientes = {
            title: { text: `Clientes con instrucciones '${estado}'`, left: "center" },
            tooltip: { trigger: "axis", formatter: "{b}<br/>Total: {c}" },
            xAxis: { type: 'value' },
            yAxis: {
                type: 'category',
                data: chartDataClientes.map(item => item.name).reverse()
            },
            series: [
                {
                    name: "Instrucciones",
                    type: "bar",
                    data: chartDataClientes.map(item => item.value).reverse(),
                    itemStyle: { color: '#007bff' }
                }
            ]
        };

        myChartClientes.setOption(optionClientes);

    } catch (error) {
        console.error("Error al graficar clientes:", error);
        Swal.fire("Error", `No se pudo cargar el conteo de clientes para el estado ${estado}`, "error");
    }
}

/**
 * Función para cargar el listado detallado de instrucciones (Consulta 2).
 * Genera y llena una tabla HTML con los resultados y añade el botón de exportar.
 * * @param {string} fecha_inicio 
 * @param {string} fecha_final 
 * @param {string} estado - Estado de la instrucción clickeado.
 */
async function ListarInstruccionesDetalle(fecha_inicio, fecha_final, estado) {
    try {
        const detalleDom = document.getElementById("detalleListadoInstrucciones");
        // Placeholder de carga
        detalleDom.innerHTML = "<div class='text-center p-5'>⏳ Cargando listado de instrucciones...</div>";

        let datos = new FormData();
        datos.append("fechaInicio", fecha_inicio);
        datos.append("fechaFinal", fecha_final);
        datos.append("estado", estado);

        // 👉 Fetch PHP para Consulta 2
        const response = await fetch($("#base_url").val() + "indicadores/obtenerListadoInstruccionesPorEstado", {
            method: "POST",
            body: datos
        });
        const data = await response.json();

        if (!data.status || !data.data || data.data.length === 0) {
            detalleDom.innerHTML = `<div class='alert alert-info p-3'>No se encontraron instrucciones detalladas en estado: <strong>${estado}</strong>.</div>`;
            return;
        }

        const instrucciones = data.data;
        const total = instrucciones.length;

        // Función de ayuda para formatear moneda (de tu código)
        const formatMoney = (value) => {
            if (value === null) return '$0';
            return Number(value).toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            });
        };

        // 1. 👉 ESTRUCTURA DEL ENCABEZADO Y BOTÓN DE EXPORTAR
        let headerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                
                <h5 class="mb-0">
                    Instrucciones en estado: 
                    <span class="badge badge-phoenix badge-phoenix-info ms-2" style="font-size: 13px;">
                        ${estado} (<span class="fw-bold contador">${total}</span>)
                    </span>
                </h5>

                <a href="JavaScript:void(0);" id="exportar_excel_instrucciones_detalle" class="text-decoration-none d-flex align-items-center text-success fw-bold">
                    <img src="${$("#base_url").val()}public/img/excel_2013.png" alt="Excel" width="18px" class="me-1">
                    Exportar a Excel
                </a>
            </div>
        `;

        // 2. Construcción de la tabla
        let tableHTML = `
            <table class='table table-bordered table-striped table-sm' style="font-size:12px;" id="tabla-instrucciones-detalle">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Instrucción/Concepto</th>
                        <th>Valor Inst.</th>
                        <th>Valor Fact.</th>
                        <th>Serv. Esp.</th>
                        <th>Usuario</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // 3. Llenado de Filas
        instrucciones.forEach(item => {
            const nombreSanitizado = item.nombre ? item.nombre.substring(0, 50) + '...' : 'N/A';
            // Las observaciones no se muestran en la tabla, solo en el título
            // const observacionesSanitizadas = item.observaciones ? item.observaciones.replace(/\r\n/g, ' ').substring(0, 50) + '...' : 'N/A';

            tableHTML += `
                <tr>
                    <td>${item.id}</td>
                    <td title="${item.nombre_cliente}">${item.nombre_cliente.substring(0, 30)}...</td>
                    <td title="${item.nombre}">${nombreSanitizado}</td>
                    <td class="text-end">${formatMoney(item.total_instruccion)}</td>
                    <td class="text-end">${formatMoney(item.total_factura)}</td>
                    <td class="text-end">${formatMoney(item.total_servicios_especiales)}</td>
                    <td>${item.usuario ?? 'N/A'}</td>
                    <td>${item.fecha}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        // 4. Inserción final en el DOM (Encabezado + Tabla)
        detalleDom.innerHTML = headerHTML + tableHTML;

        // 5. Asignar Evento de Exportación (Necesita una función de exportación)
        // --------------------------------------------------------------------------------

        // Event Listener (Tu código principal corregido)
        // Asegúrate de que este ID coincida con el botón en tu HTML
        document.getElementById('exportar_excel_instrucciones_detalle').addEventListener('click', () => {
            // Obtener el estado actual (asumimos que está disponible globalmente o se puede obtener del título)
            // Usaremos un placeholder para el estado que debes obtener del contexto
            const estadoActual = document.getElementById('estado-detalle-titulo').textContent.trim()
                || 'General';

            // Llamar a la función de exportación
            exportarTablaAExcel('tabla-instrucciones-detalle', estadoActual);
        });

    } catch (error) {
        console.error("Error al listar detalle:", error);
        Swal.fire("Error", `No se pudo cargar el listado de instrucciones para el estado ${estado}`, "error");
    }
}


// Variable auxiliar para usar en el nombre del archivo si es necesario
const fechaActual = new Date().toISOString().slice(0, 10);

/**
 * Realiza la exportación de una tabla específica a Excel.
 * @param {string} tableId - ID de la tabla a exportar.
 * @param {string} estado - El estado actual para el nombre del archivo.
 */
function exportarTablaAExcel(tableId, estado) {
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
            const nombreArchivo = `Instrucciones_${estado}_${fechaActual}.xlsx`;

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

// Nota: Asegúrate de tener disponible la función 'formatMoney' si usas jQuery/locale formatting