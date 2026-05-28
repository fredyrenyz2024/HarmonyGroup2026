// --------------------------------------------------------------------------------
// 🛑 ADAPTACIÓN DE LA LÓGICA DE INICIALIZACIÓN
// --------------------------------------------------------------------------------

window.initScript = function (id) {
    window.VENTANA = id;
    // JS (Global en tu archivo script)
    window.DETALLE_ACTUAL = []; // Almacenará los datos de clientes o placas

    let campoFechaInicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`);
    let campoFechaFinal = document.getElementById(`campo-${window.VENTANA}-fecha_final`);

    // Lógica para establecer las fechas por defecto (del 1 al día actual del mes)
    if (campoFechaInicial && campoFechaFinal) {
        let hoy = new Date();
        let anio = hoy.getFullYear();
        let mes = hoy.getMonth() + 1;
        let dia = hoy.getDate();

        mes = mes < 10 ? `0${mes}` : mes;
        let diaActual = dia < 10 ? `0${dia}` : dia;

        let fechaInicio = `${anio}-${mes}-01`;
        let fechaFin = `${anio}-${mes}-${diaActual}`;

        campoFechaInicial.value = fechaInicio;
        campoFechaFinal.value = fechaFin;

        // 🛑 Llamar al gráfico al inicializar la ventana
        GraficarVentasCostos(fechaInicio, fechaFin);
    }

    // Lógica para el botón de Filtrar
    document.addEventListener("click", async e => {
        if (e.target.matches(`#campo-${window.VENTANA}-filtrar`) || e.target.matches(`#campo-${window.VENTANA}-filtrar *`)) {
            let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
            let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;

            // 🛑 Llamar al gráfico con los filtros de fecha
            GraficarVentasCostos(fecha_inicial, fecha_final);
        }
    });

    // document.addEventListener("change", async e => {
    //     // 🛑 Listener para el SELECT de filtro dinámico (#analistas)
    //     if (e.target.matches(`#filtro_venta_costo`) || e.target.matches(`#filtro_venta_costo *`)) {

    //         const Seleccionado = e.target.value;
    //         console.log("🚀 ~ Seleccionado:", Seleccionado)

    //         // Debemos saber qué tipo de datos estamos mostrando actualmente (Ventas o Costos)
    //         const tituloActual = document.querySelector("#tabla-detalle-ventas-costos thead tr th:last-child").textContent;
    //         const tipoDetalle = tituloActual.includes("Venta") ? "Total Ventas" : "Total Costos";

    //         // 1. Verificar si es necesario filtrar
    //         if (Seleccionado && window.DETALLE_ACTUAL.length > 0) {

    //             // Renderizar la tabla solo con el ítem seleccionado (la lógica de filtrado está dentro)
    //             RenderizarTablaDetalle(tipoDetalle, window.DETALLE_ACTUAL, Seleccionado);

    //         } else if (window.DETALLE_ACTUAL.length > 0) {

    //             // Si selecciona la opción "Seleccione" (value=""), renderizamos todos los datos
    //             RenderizarTablaDetalle(tipoDetalle, window.DETALLE_ACTUAL, "");
    //         }
    //     }
    // });

    // JS

    // 🛑 Listener Optimizado para Select2 (debe ejecutarse después de la inicialización de Select2)

    // $('#filtro_venta_costo').on('change', function (e) {
    //     // Select2 dispara el evento 'change' en el elemento original.
    //     const Seleccionado = $(this).val(); // Obtenemos el valor seleccionado directamente de jQuery
    //     console.log("🚀 ~ Seleccionado:", Seleccionado);

    //     // 1. Determinar el tipo de detalle que se está mostrando actualmente
    //     // Asumo que tu tabla de detalle está visible.
    //     const tituloActual = document.querySelector("#tabla-detalle-ventas-costos thead tr th:last-child").textContent;
    //     // Si incluye 'Venta' es Ventas, de lo contrario es Costos (asumimos que siempre es uno de los dos)
    //     const tipoDetalle = tituloActual.includes("Venta") ? "Total Ventas" : "Total Costos";

    //     // 2. Verificar si hay datos globales para filtrar
    //     if (window.DETALLE_ACTUAL && window.DETALLE_ACTUAL.length > 0) {

    //         // Si el valor seleccionado es válido (no es la opción por defecto vacía)
    //         if (Seleccionado) {
    //             // Filtrar y renderizar solo el ítem seleccionado
    //             RenderizarTablaDetalle(tipoDetalle, window.DETALLE_ACTUAL, Seleccionado);
    //         } else {
    //             // Si selecciona la opción vacía (value=""), renderizamos todos los datos
    //             RenderizarTablaDetalle(tipoDetalle, window.DETALLE_ACTUAL, "");
    //         }
    //     } else {
    //         console.warn("No hay datos cargados en window.DETALLE_ACTUAL para aplicar el filtro.");
    //     }
    // });

    // JS (Listener para el cambio en el select de filtro)

    $('#filtro_venta_costo').on('change', function (e) {
        // 🛑 1. Select2 devuelve un array de valores seleccionados
        const Seleccionados = $(this).val();
        console.log("🚀 ~ Seleccionados:", Seleccionados);

        // 2. Determinar el tipo de detalle que se está mostrando
        const tituloActual = document.querySelector("#tabla-detalle-ventas-costos thead tr th:last-child").textContent;
        const tipoDetalle = tituloActual.includes("Venta") ? "Total Ventas" : "Total Costos";

        // 3. Verificar si hay datos globales para filtrar
        if (window.DETALLE_ACTUAL && window.DETALLE_ACTUAL.length > 0) {

            // Renderizar la tabla con el array de seleccionados.
            // Si Seleccionados es null o [], RenderizarTablaDetalle usará todos los datos.
            RenderizarTablaDetalle(tipoDetalle, window.DETALLE_ACTUAL, Seleccionados);

        } else {
            console.warn("No hay datos cargados en window.DETALLE_ACTUAL para aplicar el filtro.");
        }
    });

    // JS
    document.getElementById('exportar_excel_venta_costo').addEventListener('click', function () {
        var table = document.getElementById('tabla-detalle-ventas-costos');
        if (table) {
            var clonedTable = table.cloneNode(true);

            // 🛑 ESTO DEBE ELIMINARSE O AJUSTARSE A [] YA QUE LA TABLA SOLO TIENE 3 COLS.
            var columnsToOmit = [];

            // Eliminación de encabezados (ya no hace nada)
            var ths = clonedTable.querySelectorAll('thead th');
            columnsToOmit.slice().reverse().forEach(index => {
                ths[index].remove();
            });

            // Eliminación de celdas (ya no hace nada)
            var rows = clonedTable.querySelectorAll('tbody tr');
            rows.forEach(row => {
                var cells = row.querySelectorAll('td');
                columnsToOmit.slice().reverse().forEach(index => {
                    cells[index].remove();
                });

                // 👇 CORRECCIÓN: Forzar el formato de la columna TOTAL (índice 2)
                let tarifaCell = cells[2];
                if (tarifaCell) {
                    tarifaCell.innerText = "" + tarifaCell.innerText;
                }
            });

            // 👇 Exportar manteniendo texto exacto
            var wb = XLSX.utils.table_to_book(clonedTable, { raw: true });

            const fechaActual = new Date().toISOString().slice(0, 10);
            const nombreArchivo = `Informe de Ventas Costos ${fechaActual}.xlsx`;
            XLSX.writeFile(wb, nombreArchivo);
        } else {
            console.error("El elemento con el ID 'tabla-detalle-ventas-costos' no existe.");
        }
    });
};

// --------------------------------------------------------------------------------
// 🛑 MODIFICACIÓN DE GraficarVentasCostos para añadir el Evento de Clic (Drill-Down)
// --------------------------------------------------------------------------------

// Función principal adaptada para Ventas y Costos
async function GraficarVentasCostos(fecha_inicio, fecha_final) {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);

        // Referencias a los elementos del DOM
        const chartDom = document.getElementById("IndicadoresVentasCostos");
        const tbody = document.querySelector("#tabla-general-ventas-costos tbody");
        const totalFooter = document.getElementById("total-costos-ventas");

        // 👉 Reset tabla y totales
        tbody.innerHTML = `<tr><td colspan="2" class="text-muted">⏳ Cargando datos...</td></tr>`;
        totalFooter.textContent = "";

        // 👉 Instancia o crea el gráfico
        let myChart = echarts.getInstanceByDom(chartDom);
        if (!myChart) myChart = echarts.init(chartDom);

        // 👉 Mostrar loading
        myChart.showLoading("default", { text: "⏳ Generando gráfica..." });

        // 👉 Fetch PHP al nuevo endpoint (asumiendo que llamas al modelo GetVentasCostos)
        const response = await fetch($("#base_url").val() + "indicadores/CostosVentas", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        // 👉 Validación y preparación de datos
        if (!data || (!data.Ventas && !data.Costos)) {
            Swal.fire("Sin datos", "No se encontraron datos de Ventas ni Costos en el rango seleccionado.", "info");
            myChart.clear();
            myChart.hideLoading();
            tbody.innerHTML = `<tr><td colspan="2" class="text-muted">📉 No hay resultados</td></tr>`;
            return;
        }

        const totalVentas = data.Ventas ?? 0;
        const totalCostos = data.Costos ?? 0;
        const totalGeneral = totalVentas + totalCostos;

        // 👉 Configuración gráfica
        let option = {
            title: {
                text: "Ventas vs. Costos",
                subtext: `Total: ${Number(totalGeneral).toLocaleString("es-CO", { style: 'currency', currency: 'COP' })}`,
                left: "center"
            },
            tooltip: {
                trigger: "item",
                formatter: params => {
                    // Formateo a moneda COP
                    const valorFormato = Number(params.value).toLocaleString("es-CO", { style: 'currency', currency: 'COP' });
                    return `${params.name}<br/>💵 ${valorFormato} (${params.percent}%)`;
                }
            },
            series: [
                {
                    name: "Indicadores",
                    type: "pie",
                    radius: ["40%", "70%"], // Dona
                    center: ["50%", "60%"], // Centrado para dar espacio al título
                    data: [
                        { name: "Total Ventas", value: totalVentas, itemStyle: { color: '#138496' } }, // Color info/cyan
                        { name: "Total Costos", value: totalCostos, itemStyle: { color: '#dc3545' } }  // Color danger/red
                    ],
                    label: {
                        formatter: params => `${params.name}: ${params.percent}%`,
                        fontSize: 13
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        // 👉 Ocultar loading y dibujar
        myChart.hideLoading();
        myChart.setOption(option);

        // 🛑 EVENTO DE CLIC EN LA GRÁFICA (Drill-down)
        myChart.off('click'); // Limpia listeners previos
        myChart.on("click", function (params) {
            // params.name será "Total Ventas" o "Total Costos"
            if (params.seriesType === 'pie') {
                DetalleVentasCostos(params.name, fecha_inicio, fecha_final);
            }
        });

        // 👉 Llenar Tabla
        tbody.innerHTML = `
            <tr><td>Total Ventas</td><td>${Number(totalVentas).toLocaleString("es-CO", { style: 'currency', currency: 'COP' })}</td></tr>
            <tr><td>Total Costos</td><td>${Number(totalCostos).toLocaleString("es-CO", { style: 'currency', currency: 'COP' })}</td></tr>
        `;
        totalFooter.textContent = Number(totalGeneral).toLocaleString("es-CO", { style: 'currency', currency: 'COP' });

    } catch (error) {
        console.error("Error GraficarVentasCostos:", error);
        Swal.fire("Error", "No se pudo cargar el gráfico de Ventas y Costos", "error");
    }
}

// JS

// Nueva función para cargar el detalle (Clientes o Placas)
// async function DetalleVentasCostos(tipo_detalle, fecha_inicio, fecha_final) {
//     // Referencia al contenedor donde irá el gráfico (asumo que está visible)
//     const contenedorGrafico = document.getElementById("contenedor_grafico_detalle");
//     const tablaDetalle = document.getElementById("tabla-detalle-ventas-costos");
//     const tbody = tablaDetalle.querySelector("tbody");
//     const thead = tablaDetalle.querySelector("thead tr");
//     const totalFooter = document.getElementById("detalle-total-footer");

//     // 1. Mostrar estado de carga en la tabla
//     tbody.innerHTML = `<tr><td colspan="3" class="text-muted">⏳ Cargando detalle de ${tipo_detalle}...</td></tr>`;
//     thead.innerHTML = "";
//     totalFooter.textContent = "";

//     // 👉 Inicializar ECharts para el detalle
//     let myChartDetalle = echarts.getInstanceByDom(contenedorGrafico);
//     if (!myChartDetalle) myChartDetalle = echarts.init(contenedorGrafico);

//     myChartDetalle.showLoading("default", { text: "⏳ Generando gráfico de detalle..." });

//     try {
//         let datos = new FormData();
//         datos.append("Fecha_Inicio", fecha_inicio);
//         datos.append("Fecha_Final", fecha_final);
//         datos.append("Tipo_Detalle", tipo_detalle); // 'Total Ventas' o 'Total Costos'

//         const endpoint = $("#base_url").val() + "indicadores/DetalleVentasCostos";
//         const response = await fetch(endpoint, { method: "POST", body: datos });
//         const data = await response.json();

//         myChartDetalle.hideLoading(); // Ocultar carga si el fetch fue exitoso

//         if (!data || data.length === 0) {
//             tbody.innerHTML = `<tr><td colspan="3" class="text-muted">No hay datos para ${tipo_detalle} en este rango.</td></tr>`;
//             myChartDetalle.clear();
//             return;
//         }

//         let totalAcumulado = 0;
//         // 🛑 ALMACENAR DATOS GLOBALES Y LLAMAR AL FILTRO
//         window.DETALLE_ACTUAL = data;
//         LlenarFiltroDetalle(tipo_detalle, data); // Llama a la nueva función
//         tbody.innerHTML = "";

//         // 🛑 Preparación de datos para el Gráfico y la Tabla
//         const chartData = []; // Para el gráfico
//         const categoryData = []; // Ejes para barras/nombres

//         const esVenta = tipo_detalle === "Total Ventas";
//         const valorKey = esVenta ? "Total_Venta_Por_Cliente" : "Total_Pagado_Placa";
//         const nombreKey = esVenta ? "Nombre_Cliente" : "Placa";
//         const nombreEje = esVenta ? "Cliente" : "Placa";
//         const color = esVenta ? '#138496' : '#dc3545'; // Color basado en el tipo

//         // 2. Renderizar encabezados y datos (Tabla y Gráfico)
//         thead.innerHTML = `<th>#</th><th>${nombreEje}</th><th>${tipo_detalle}</th>`;

//         data.forEach((item, index) => {
//             const total = parseFloat(item[valorKey] || 0);
//             totalAcumulado += total;

//             // Datos para la tabla
//             tbody.innerHTML += `
//                 <tr>
//                     <td>${index + 1}</td>
//                     <td class="text-start">${item[nombreKey]}</td>
//                     <td>${Number(total).toLocaleString("es-CO", { style: 'currency', currency: 'COP' })}</td>
//                 </tr>
//             `;

//             // Datos para el gráfico (solo mostrar los primeros 10-15 elementos para que sea legible)
//             if (index < 15) {
//                 chartData.push({ value: total, name: item[nombreKey] });
//                 categoryData.push(item[nombreKey]); // Necesario si fuera un gráfico de barras
//             }
//         });

//         // 3. Generar el Gráfico de Detalle (Barras o Pie)
//         let optionDetalle = {
//             title: {
//                 text: `Detalle por ${nombreEje} (${tipo_detalle})`,
//                 left: 'center'
//             },
//             tooltip: {
//                 trigger: 'item',
//                 formatter: params => {
//                     const valorFormato = Number(params.value).toLocaleString("es-CO", { style: 'currency', currency: 'COP' });
//                     return `${params.name}<br/>💵 ${valorFormato} (${params.percent}%)`;
//                 }
//             },
//             legend: {
//                 orient: 'vertical',
//                 left: 'left',
//                 data: categoryData // Los nombres de clientes/placas
//             },
//             series: [
//                 {
//                     name: tipo_detalle,
//                     type: 'pie', // Usaremos Pie Chart para el detalle
//                     radius: '70%',
//                     center: ['50%', '55%'],
//                     data: chartData,
//                     emphasis: {
//                         itemStyle: {
//                             shadowBlur: 10,
//                             shadowOffsetX: 0,
//                             shadowColor: 'rgba(0, 0, 0, 0.5)'
//                         }
//                     },
//                     label: {
//                         formatter: '{b}: {c}' // Muestra nombre (b) y valor (c)
//                     }
//                 }
//             ]
//         };

//         myChartDetalle.setOption(optionDetalle);

//         // 4. Actualizar pie de página
//         totalFooter.setAttribute('colspan', '3');
//         totalFooter.innerHTML = `<strong>Total ${tipo_detalle}:</strong> ${Number(totalAcumulado).toLocaleString("es-CO", { style: 'currency', currency: 'COP' })}`;

//     } catch (error) {
//         console.error("Error DetalleVentasCostos:", error);
//         myChartDetalle.hideLoading();
//         tbody.innerHTML = `<tr><td colspan="3" class="text-danger">Error al cargar el detalle.</td></tr>`;
//     }
// }


// JS

async function DetalleVentasCostos(tipo_detalle, fecha_inicio, fecha_final) {
    // Referencia al contenedor donde irá el gráfico (asumo que está visible)
    const contenedorGrafico = document.getElementById("contenedor_grafico_detalle");
    const tablaDetalle = document.getElementById("tabla-detalle-ventas-costos");
    const tbody = tablaDetalle.querySelector("tbody");
    const thead = tablaDetalle.querySelector("thead tr");
    const totalFooter = document.getElementById("detalle-total-footer");

    // 1. Mostrar estado de carga en la tabla
    tbody.innerHTML = `<tr><td colspan="3" class="text-muted">⏳ Cargando detalle de ${tipo_detalle}...</td></tr>`;
    thead.innerHTML = "";
    totalFooter.textContent = "";

    // 👉 Inicializar ECharts para el detalle
    let myChartDetalle = echarts.getInstanceByDom(contenedorGrafico);
    if (!myChartDetalle) myChartDetalle = echarts.init(contenedorGrafico);

    myChartDetalle.showLoading("default", { text: "⏳ Generando gráfico de detalle..." });
    myChartDetalle.clear(); // Limpiar gráfico anterior antes de cargar

    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);
        datos.append("Tipo_Detalle", tipo_detalle); // 'Total Ventas' o 'Total Costos'

        const endpoint = $("#base_url").val() + "indicadores/DetalleVentasCostos";
        const response = await fetch(endpoint, { method: "POST", body: datos });
        const data = await response.json();

        myChartDetalle.hideLoading(); // Ocultar carga si el fetch fue exitoso

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" class="text-muted">No hay datos para ${tipo_detalle} en este rango.</td></tr>`;
            myChartDetalle.clear();
            // 🛑 Llenar filtro con opción de error si no hay datos
            LlenarFiltroDetalle(tipo_detalle, []);
            window.DETALLE_ACTUAL = [];
            return;
        }

        // 🛑 ALMACENAR DATOS GLOBALES Y LLAMAR AL FILTRO
        window.DETALLE_ACTUAL = data;
        LlenarFiltroDetalle(tipo_detalle, data); // Llama a la función para llenar el select

        // 🛑 Lógica de Preparación de Datos para el Gráfico y la Tabla
        const chartData = []; // Para el gráfico
        const categoryData = []; // Ejes/Nombres para la leyenda
        let totalAcumulado = 0;

        const esVenta = tipo_detalle === "Total Ventas";
        const valorKey = esVenta ? "Total_Venta_Por_Cliente" : "Total_Pagado_Placa";
        const nombreKey = esVenta ? "Nombre_Cliente" : "Placa";

        // 🛑 Itera solo para PREPARAR los datos del gráfico y el total
        data.forEach((item, index) => {
            const total = parseFloat(item[valorKey] || 0);
            totalAcumulado += total;

            // Datos para el gráfico (solo mostrar los primeros 15 elementos)
            if (index < 15) {
                chartData.push({ value: total, name: item[nombreKey] });
                categoryData.push(item[nombreKey]);
            }
        });

        // 🛑 Renderizar encabezados y tabla CON TODOS LOS DATOS
        // Llamamos a la función con los datos completos y sin filtro de valor
        RenderizarTablaDetalle(tipo_detalle, data, "");

        // 3. Generar el Gráfico de Detalle (Barras o Pie)
        let optionDetalle = {
            title: {
                text: `(${tipo_detalle})`,
                // text: `Top 15 Detalle por ${nombreKey} (${tipo_detalle})`,
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: params => {
                    const valorFormato = Number(params.value).toLocaleString("es-CO", { style: 'currency', currency: 'COP' });
                    return `${params.name}<br/>💵 ${valorFormato} (${params.percent}%)`;
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: categoryData // Los nombres de clientes/placas
            },
            series: [
                {
                    name: tipo_detalle,
                    type: 'pie',
                    radius: '70%',
                    center: ['50%', '55%'],
                    data: chartData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        formatter: '{b}: {d}%' // Muestra nombre (b) y porcentaje (d)
                    }
                }
            ]
        };

        myChartDetalle.setOption(optionDetalle);

        // 4. Actualizar pie de página (usando el total calculado en la iteración)
        totalFooter.setAttribute('colspan', '3');
        totalFooter.innerHTML = `<strong>Total ${tipo_detalle}:</strong> ${Number(totalAcumulado).toLocaleString("es-CO", { style: 'currency', currency: 'COP' })}`;
    } catch (error) {
        console.error("Error DetalleVentasCostos:", error);
        myChartDetalle.hideLoading();
        tbody.innerHTML = `<tr><td colspan="3" class="text-danger">Error al cargar el detalle.</td></tr>`;
    }
}

/**
 * Llena el select de filtros con Clientes o Placas y les da un nombre de etiqueta.
 */
// function LlenarFiltroDetalle(tipo_detalle, datos) {
//     const select = $('#filtro_venta_costo');
//     select.empty();

//     const esVenta = tipo_detalle === "Total Ventas";
//     const valorKey = esVenta ? "Nombre_Cliente" : "Placa";
//     const placeholder = esVenta ? "-- Seleccione Cliente --" : "-- Seleccione Placa --";

//     select.append(`<option value="">${placeholder}</option>`);

//     // Llenar las opciones con los nombres/placas únicos
//     datos.forEach(item => {
//         const valor = item[valorKey];
//         select.append(`<option value="${valor}">${valor}</option>`);
//     });

//     // Opcional: Si usas Select2
//     select.select2({ placeholder: placeholder, allowClear: true });
// }


// JS

/**
 * Llena el select de filtros con Clientes o Placas y lo inicializa como Select2 Múltiple.
 */
function LlenarFiltroDetalle(tipo_detalle, datos) {
    const select = $('#filtro_venta_costo');
    select.empty();

    const esVenta = tipo_detalle === "Total Ventas";
    const valorKey = esVenta ? "Nombre_Cliente" : "Placa";
    const placeholder = esVenta ? "Buscar Clientes..." : "Buscar Placas...";

    // 🛑 1. Agregar el atributo multiple
    select.attr('multiple', 'multiple');
    select.attr('data-placeholder', placeholder); // Para Select2

    // 2. Llenar las opciones
    datos.forEach(item => {
        const valor = item[valorKey];
        select.append(`<option value="${valor}">${valor}</option>`);
    });

    // 🛑 3. Inicializar Select2
    select.select2({
        placeholder: placeholder,
        allowClear: true,
        // Si el select2 está dentro de un modal o offcanvas, descomentar:
        // dropdownParent: $('#ID_DEL_CONTENEDOR_MODAL') 
    });
}

/**
 * Renderiza la tabla de detalle (o la filtra) y actualiza el footer.
 */
// function RenderizarTablaDetalle(tipo_detalle, datos_a_mostrar, filtro_valor = "") {
//     const tbody = document.querySelector("#tabla-detalle-ventas-costos tbody");
//     const thead = document.querySelector("#tabla-detalle-ventas-costos thead tr");
//     const totalFooter = document.getElementById("detalle-total-footer");

//     const esVenta = tipo_detalle === "Total Ventas";
//     const valorKey = esVenta ? "Total_Venta_Por_Cliente" : "Total_Pagado_Placa";
//     const nombreKey = esVenta ? "Nombre_Cliente" : "Placa";
//     const nombreEje = esVenta ? "Cliente" : "Placa";

//     let totalAcumulado = 0;
//     tbody.innerHTML = "";
//     thead.innerHTML = `<th>#</th><th>${nombreEje}</th><th>${tipo_detalle}</th>`;

//     // 🛑 Lógica de filtrado
//     const datosFiltrados = filtro_valor
//         ? datos_a_mostrar.filter(item => item[nombreKey] === filtro_valor)
//         : datos_a_mostrar;

//     if (datosFiltrados.length === 0) {
//         tbody.innerHTML = `<tr><td colspan="3" class="text-muted">No hay resultados que coincidan con el filtro.</td></tr>`;
//     }

//     datosFiltrados.forEach((item, index) => {
//         const total = parseFloat(item[valorKey] || 0);
//         totalAcumulado += total;

//         // Datos para la tabla
//         tbody.innerHTML += `
//             <tr>
//                 <td>${index + 1}</td>
//                 <td class="text-start">${item[nombreKey]}</td>
//                 <td>${Number(total).toLocaleString("es-CO", { style: 'currency', currency: 'COP' })}</td>
//             </tr>
//         `;
//     });

//     // 3. Actualizar pie de página
//     totalFooter.setAttribute('colspan', '3');
//     totalFooter.innerHTML = `<strong>Total ${tipo_detalle}:</strong> ${Number(totalAcumulado).toLocaleString("es-CO", { style: 'currency', currency: 'COP' })}`;
// }

// JS

/**
 * Renderiza la tabla de detalle y acepta un array de filtros para mostrar múltiples filas.
 * @param {string} tipo_detalle - 'Total Ventas' o 'Total Costos'.
 * @param {Array} datos_completos - Los datos completos (window.DETALLE_ACTUAL).
 * @param {Array|string} filtros_array - Array de Clientes/Placas seleccionados, o "" si es todo.
 */
function RenderizarTablaDetalle(tipo_detalle, datos_completos, filtros_array = []) {
    const tbody = document.querySelector("#tabla-detalle-ventas-costos tbody");
    const thead = document.querySelector("#tabla-detalle-ventas-costos thead tr");
    const totalFooter = document.getElementById("detalle-total-footer");

    const esVenta = tipo_detalle === "Total Ventas";
    const valorKey = esVenta ? "Total_Venta_Por_Cliente" : "Total_Pagado_Placa";
    const nombreKey = esVenta ? "Nombre_Cliente" : "Placa";
    const nombreEje = esVenta ? "Cliente" : "Placa";

    let totalAcumulado = 0;
    tbody.innerHTML = "";
    thead.innerHTML = `<th>#</th><th>${nombreEje}</th><th>${tipo_detalle}</th>`;

    // 🛑 Lógica de filtrado (filtrar si filtros_array contiene elementos)
    const debeFiltrar = Array.isArray(filtros_array) && filtros_array.length > 0;

    const datosFiltrados = debeFiltrar
        ? datos_completos.filter(item => filtros_array.includes(item[nombreKey]))
        : datos_completos; // Muestra todos si no hay filtros

    if (datosFiltrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="text-muted">No hay resultados que coincidan con los filtros seleccionados.</td></tr>`;
        totalFooter.innerHTML = '';
        return;
    }

    datosFiltrados.forEach((item, index) => {
        const total = parseFloat(item[valorKey] || 0);
        totalAcumulado += total;

        // Datos para la tabla
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td class="text-start">${item[nombreKey]}</td>
                <td>${Number(total).toLocaleString("es-CO", { style: 'currency', currency: 'COP' })}</td>
            </tr>
        `;
    });

    // 3. Actualizar pie de página
    totalFooter.setAttribute('colspan', '3');
    totalFooter.innerHTML = `<strong>Total ${tipo_detalle}:</strong> ${Number(totalAcumulado).toLocaleString("es-CO", { style: 'currency', currency: 'COP' })}`;
}