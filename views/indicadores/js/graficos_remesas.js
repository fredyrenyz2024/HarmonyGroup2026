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

            GraficarIndicadoresRemesas(fecha_inicial, fecha_final);
        }
    });

    document.getElementById('exportar_excel_detalle').addEventListener('click', function () {
        var table = document.getElementById('tabla-remesas-detalle');
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

                // 👇 Forzar la columna Tarifa (índice 5) a texto
                let tarifaCell = cells[5];
                if (tarifaCell) {
                    tarifaCell.innerText = "" + tarifaCell.innerText;
                }
            });

            // 👇 Exportar manteniendo texto exacto
            var wb = XLSX.utils.table_to_book(clonedTable, { raw: true });

            const fechaActual = new Date().toISOString().slice(0, 10);
            const nombreArchivo = `Informe de Remesas Clientes ${fechaActual}.xlsx`;
            XLSX.writeFile(wb, nombreArchivo);
        } else {
            console.error("El elemento con el ID 'ordenes_decargue' no existe.");
        }
    });

    document.getElementById('exportar_excel_detalle_cliente').addEventListener('click', function () {
        var table = document.getElementById('tabla-remesas-clientes');
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
            const nombreArchivo = `Informe de Remesas Clientes ${fechaActual}.xlsx`;
            XLSX.writeFile(wb, nombreArchivo);
        } else {
            console.error("El elemento con el ID 'ordenes_decargue' no existe.");
        }
    });
};

// async function GraficarIndicadoresRemesas(fecha_inicio, fecha_final) {
//     try {
//         let datos = new FormData();
//         datos.append("Fecha_Inicio", fecha_inicio);
//         datos.append("Fecha_Final", fecha_final);

//         const chartDom = document.getElementById("IndicadoresGeneralRemesas");
//         const tbody = document.querySelector("#tabla-general-tipo-vehiculos tbody");
//         const totalGeneral = document.getElementById("total-general-tipo-vehiculo");

//         // 👉 Placeholder
//         chartDom.innerHTML = "<div class='text-center p-5'>⏳ Generando gráfica...</div>";
//         tbody.innerHTML = `<tr><td colspan="2" class="text-muted">⏳ Cargando datos...</td></tr>`;
//         totalGeneral.textContent = "";

//         // 👉 Fetch PHP
//         const response = await fetch($("#base_url").val() + "indicadores/InstruccionesRemesas", {
//             method: "POST",
//             body: datos
//         });

//         const data = await response.json();

//         if (!data || !data.total_remesas) {
//             Swal.fire("Sin datos", "No se encontraron remesas", "info");
//             chartDom.innerHTML = "<div class='text-center text-muted'>📉 No hay datos</div>";
//             return;
//         }

//         // 👉 Reset instancia previa
//         let myChart = echarts.getInstanceByDom(chartDom);
//         if (myChart) myChart.dispose();
//         myChart = echarts.init(chartDom);

//         // 👉 Configuración gráfica
//         let option = {
//             title: {
//                 text: "Indicadores de Remesas",
//                 left: "center"
//             },
//             tooltip: {
//                 trigger: "item",
//                 formatter: params => {
//                     return `${params.name}<br/>💰 $${Number(params.value).toLocaleString("es-CO")} (${params.percent}%)`;
//                 }
//             },
//             series: [
//                 {
//                     name: "Remesas",
//                     type: "pie",
//                     radius: ["40%", "70%"], // Dona
//                     label: {
//                         formatter: params => `${params.name}`, // 👈 solo el estado
//                         fontSize: 13,
//                         // fontWeight: "bold"
//                     },
//                     labelLine: {
//                         show: true,
//                         length: 20,  // línea más larga hacia afuera
//                         length2: 10,
//                         smooth: true
//                     },
//                     // 👇 evita que se monten las etiquetas
//                     labelLayout: params => {
//                         const isLeft = params.labelRect.x < myChart.getWidth() / 2;
//                         return {
//                             x: params.labelRect.x,
//                             y: params.labelRect.y,
//                             align: isLeft ? "right" : "left"
//                         };
//                     },
//                     data: [
//                         { name: "Pendientes", value: data.total_pendientes },
//                         { name: "Instrucción", value: data.total_instruccion },
//                         { name: "Facturadas", value: data.total_facturadas }
//                     ]
//                 }
//             ]
//         };

//         myChart.setOption(option);

//         // 👉 Evento de click para capturar configuracion_id
//         myChart.on("click", function (params) {
//             // let idConfig = params.data.configuracion_id;
//             MostrarRemesasPorAgencia(params.name, fecha_inicio, fecha_final);
//             MostrarRemesasPorCliente(params.name, fecha_inicio, fecha_final);
//         });

//         // 👉 Tabla
//         tbody.innerHTML = `
//             <tr><td>Pendientes</td><td>$${Number(data.total_pendientes).toLocaleString("es-CO")}</td></tr>
//             <tr><td>Instrucción</td><td>$${Number(data.total_instruccion).toLocaleString("es-CO")}</td></tr>
//             <tr><td>Facturadas</td><td>$${Number(data.total_facturadas).toLocaleString("es-CO")}</td></tr>
//         `;
//         totalGeneral.textContent = `$${Number(data.total_valor).toLocaleString("es-CO")}`;

//     } catch (error) {
//         console.error("Error:", error);
//         Swal.fire("Error", "No se pudo cargar el gráfico de instrucciones", "error");
//     }
// }


async function GraficarIndicadoresRemesas(fecha_inicio, fecha_final) {
    const chartDom = document.getElementById("IndicadoresGeneralRemesas");
    const tbody = document.querySelector("#tabla-general-tipo-vehiculos tbody");
    const totalGeneral = document.getElementById("total-general-tipo-vehiculo");

    // 🚨 1. DESECHO ROBUSTO (CORRECCIÓN CRÍTICA)
    // Obtener la instancia existente y desecharla ANTES de modificar el DOM.
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart) {
        try {
            myChart.dispose();
        } catch (e) {
            // Ignoramos el error si falla el dispose, pero ya aseguramos que no se use el DOM modificado.
            console.warn("ECharts disposal failed (ignored):", e);
        }
    }

    // 👉 Placeholder y limpieza inicial (Ahora es seguro)
    chartDom.innerHTML = "<div class='text-center p-5'>⏳ Generando gráfica...</div>";
    tbody.innerHTML = `<tr><td colspan="2" class="text-muted">⏳ Cargando datos...</td></tr>`;
    totalGeneral.textContent = "";

    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);

        // 👉 Fetch PHP
        const response = await fetch($("#base_url").val() + "indicadores/InstruccionesRemesas", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        if (!data || !data.total_remesas) {
            Swal.fire("Sin datos", "No se encontraron remesas", "info");
            chartDom.innerHTML = "<div class='text-center text-muted'>📉 No hay datos</div>";
            return;
        }

        // 2. INICIALIZACIÓN (Aseguramos que el DOM esté limpio antes de inicializar)
        chartDom.innerHTML = ''; // Limpiamos el placeholder
        myChart = echarts.init(chartDom);

        // 👉 Configuración gráfica (Usando tus datos fijos de ejemplo)
        let option = {
            title: {
                text: "Indicadores de Remesas",
                left: "center"
            },
            tooltip: {
                trigger: "item",
                formatter: params => {
                    return `${params.name}<br/>💰 $${Number(params.value).toLocaleString("es-CO")} (${params.percent}%)`;
                }
            },
            series: [
                {
                    name: "Remesas",
                    type: "pie",
                    radius: ["40%", "70%"], // Dona
                    label: {
                        formatter: params => `${params.name}`,
                        fontSize: 13,
                    },
                    labelLine: {
                        show: true,
                        length: 20,
                        length2: 10,
                        smooth: true
                    },
                    labelLayout: params => {
                        const isLeft = params.labelRect.x < myChart.getWidth() / 2;
                        return {
                            x: params.labelRect.x,
                            y: params.labelRect.y,
                            align: isLeft ? "right" : "left"
                        };
                    },
                    data: [
                        { name: "Pendientes", value: data.total_pendientes },
                        { name: "Instrucción", value: data.total_instruccion },
                        { name: "Facturadas", value: data.total_facturadas }
                    ]
                }
            ]
        };

        myChart.setOption(option);

        // 👉 Evento de click para capturar el estado
        myChart.on("click", function (params) {
            MostrarRemesasPorAgencia(params.name, fecha_inicio, fecha_final);
            MostrarRemesasPorCliente(params.name, fecha_inicio, fecha_final);
        });

        // 👉 Tabla
        tbody.innerHTML = `
            <tr><td>Pendientes</td><td>$${Number(data.total_pendientes).toLocaleString("es-CO")}</td></tr>
            <tr><td>Instrucción</td><td>$${Number(data.total_instruccion).toLocaleString("es-CO")}</td></tr>
            <tr><td>Facturadas</td><td>$${Number(data.total_facturadas).toLocaleString("es-CO")}</td></tr>
        `;
        totalGeneral.textContent = `$${Number(data.total_valor).toLocaleString("es-CO")}`;

    } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "No se pudo cargar el gráfico de indicadores de remesas", "error");
    }
}

async function MostrarRemesasPorAgencia(estado, fecha_inicio, fecha_final) {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);
        datos.append("Estado", estado); // 👈 enviamos el estado al controlador

        // 👉 Llamada al controlador
        const response = await fetch($("#base_url").val() + "indicadores/InstruccionesRemesasAgencia", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        if (!data || data.length === 0) {
            Swal.fire("Sin datos", "No se encontraron remesas para este estado", "info");
            return;
        }

        // === Procesamos data ===
        let agencias = data.map(item => item.agencia);
        let totales = data.map(item => item["total remesas"]);

        // === Gráfico de barras ===
        let chartDom = document.getElementById("IndicadoresRemesasAgencias");
        let myChart = echarts.getInstanceByDom(chartDom);
        if (myChart) myChart.dispose();
        myChart = echarts.init(chartDom);

        let option = {
            title: { text: `Remesas por Agencia (${estado})`, left: "center" },
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
        const tbody = document.querySelector("#tabla-remesas-agencias tbody");
        const totalGeneral = document.getElementById("total-remesas-agecias");
        tbody.innerHTML = "";

        let sumaTotal = 0;

        data.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.agencia}</td>
                    <td>${item["total remesas"]}</td>
                </tr>
            `;
            sumaTotal += parseInt(item["total remesas"]);
        });

        totalGeneral.textContent = sumaTotal;

    } catch (error) {
        console.error("Error cargando datos:", error);
        Swal.fire("Error", "Hubo un problema al cargar los datos", "error");
    }
}

async function MostrarRemesasPorCliente(estado, fecha_inicio, fecha_final) {
    try {
        const datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);
        datos.append("Estado", estado);

        const chartDom = document.getElementById("IndicadoresRemesasClientes");
        const tbody = document.querySelector("#tabla-remesas-clientes tbody");
        const totalCliente = document.getElementById("total-remesas-cliente");

        // Placeholder mientras carga
        chartDom.innerHTML = "<div class='text-center p-4'>⏳ Generando gráfica...</div>";
        tbody.innerHTML = `<tr><td colspan="2" class="text-center text-muted">⏳ Cargando datos...</td></tr>`;
        totalCliente.textContent = "";

        // Llamada al backend
        const resp = await fetch($("#base_url").val() + "indicadores/InstruccionesRemesasCliente", {
            method: "POST",
            body: datos
        });

        const data = await resp.json();

        // Validaciones
        if (!data || !Array.isArray(data) || data.length === 0) {
            chartDom.innerHTML = "<div class='text-center text-muted'>📉 No hay datos para el periodo/estado seleccionado</div>";
            tbody.innerHTML = `<tr><td colspan="2" class="text-center text-muted">—</td></tr>`;
            totalCliente.textContent = "0";
            return;
        }

        // Preparar arrays para el gráfico
        const clientes = data.map(r => r.cliente);
        const totales = data.map(r => Number(r["total remesas"] || r.total_remesas || 0));

        // Destruir instancia anterior si existe (evita errores removeChild)
        let myChart = echarts.getInstanceByDom(chartDom);
        if (myChart) {
            try { myChart.dispose(); } catch (e) { console.warn("dispose error:", e); }
        }
        // limpiar DOM por si quedó contenido HTML
        chartDom.innerHTML = "";

        // Crear nueva instancia
        myChart = echarts.init(chartDom);

        // Configuración del gráfico (barra horizontal para muchas categorías)
        const option = {
            title: { text: `Remesas por Cliente (${estado})`, left: "center" },
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
                formatter: params => {
                    const it = params[0];
                    return `${it.name}<br/>💰 ${Number(it.value).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}`;
                }
            },
            grid: { left: "8%", right: "8%", bottom: "28%", containLabel: true },
            dataZoom: [
                { type: "slider", show: true, start: 0, end: 40, xAxisIndex: [0] },
                { type: "inside", xAxisIndex: [0] }
            ],
            xAxis: {
                type: "category",
                data: clientes,
                axisLabel: { rotate: 45, interval: 0, formatter: val => val.length > 20 ? val.slice(0, 20) + "…" : val }
            },
            yAxis: {
                type: "value",
                axisLabel: { formatter: val => Number(val).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }) }
            },
            series: [
                {
                    name: "Total",
                    type: "bar",
                    data: totales,
                    itemStyle: { color: "#1976D2" },
                    label: { show: true, position: "top", formatter: v => Number(v.value).toLocaleString('es-CO') }
                }
            ]
        };

        myChart.setOption(option);

        // Llenar tabla y total
        tbody.innerHTML = "";
        let suma = 0;
        data.forEach(row => {
            const totalRem = Number(row["total remesas"] || row.total_remesas || 0);
            tbody.insertAdjacentHTML("beforeend", `
                <tr>
                    <td style="text-align:left">${row.cliente}</td>
                    <td style="white-space:nowrap">${totalRem}</td>
                    </tr>
                    `);
            suma += totalRem;
            // <td style="white-space:nowrap">${Number(totalRem).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</td>
        });
        totalCliente.textContent = Number(suma).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

        // Opcional: click en barra -> hacer algo (detalle)
        myChart.on('click', function (params) {
            // params.name -> cliente; params.value -> monto
            // Ejemplo: abrir detalle por cliente
            // MostrarDetalleRemesasCliente(params.name, fecha_inicio, fecha_final, estado);
            console.log('Cliente clickeado:', params.name, params.value);
        });

        // Manejo resize automático
        window.addEventListener('resize', () => myChart.resize());

    } catch (error) {
        console.error("Error MostrarRemesasPorCliente:", error);
        Swal.fire("Error", "No se pudo cargar remesas por cliente", "error");
    } finally {
        DetalleRemesas(estado, fecha_inicio, fecha_final);
    }
}

async function DetalleRemesas(estado, fecha_inicio, fecha_final) {
    try {
        const datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);
        datos.append("Estado", estado);

        const tbody = document.querySelector("#tabla-remesas-detalle tbody");
        const totalGeneral = document.getElementById("total-remesas-detalle");

        // 🔄 Mensaje de carga
        tbody.innerHTML = `<tr><td colspan="8" class="text-muted">⏳ Cargando datos...</td></tr>`;
        totalGeneral.textContent = "";

        // 👉 Fetch al backend
        const resp = await fetch($("#base_url").val() + "indicadores/getDetalleRemesa", {
            method: "POST",
            body: datos
        });

        const data = await resp.json();

        // Validación
        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-muted">📉 No hay resultados en este rango de fechas</td></tr>`;
            return;
        }

        // === Renderizar resultados ===
        tbody.innerHTML = "";
        let contador = 1;
        let sumaTotal = 0;

        data.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${contador++}</td>
                    <td>${item.Remesa}</td>
                    <td>${item.Fecha_remesa}</td>
                    <td>${item.cliente}</td>
                    <td>${item.agencia}</td>
                    <td>$${Number(item.total_tarifa).toLocaleString("es-CO")}</td>
                    <td>${item.Estado_Remesa}</td>
                    <td>${item.Fecha_cumplido ?? "-"}</td>
                </tr>
            `;
            sumaTotal += parseFloat(item.total_tarifa);
        });

        // Total en el footer
        totalGeneral.textContent = `$${sumaTotal.toLocaleString("es-CO")}`;

    } catch (error) {
        console.error("Error DetalleRemesas:", error);
        Swal.fire("Error", "No se pudo cargar el detalle de remesas", "error");
    }
}

