window.VENTANA = "";

window.initScript = function (id) {
    window.VENTANA = id;
    // alert("HOLA MUNDO DESDE HOY.");
    Listar_Placas();
    Listar_Conductores();
    // Listar_Municipios();
    // Listar_Clientes();
    document.getElementById(`campo-${window.VENTANA}-destino`).style.display = 'none';
    document.getElementById(`campo-${window.VENTANA}-cliente`).style.display = 'none';

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
            let placa = document.getElementById(`campo-${window.VENTANA}-placa`).value;
            let conductor = document.getElementById(`campo-${window.VENTANA}-conductor`).value;

            GraficarAnaliticaDatos(fecha_inicial, fecha_final, placa, conductor);
            Listar_Detalle_Analisis(fecha_inicial, fecha_final, placa, conductor);
        }
    });

    // document.getElementById('exportar_excel_detalle').addEventListener('click', function () {
    //     var table = document.getElementById('tabla-detalle-estudios');
    //     if (table) {
    //         // Clonar la tabla
    //         var clonedTable = table.cloneNode(true);

    //         // Indicar qué columnas omitir (por ejemplo, 1 y 3)
    //         var columnsToOmit = [6]; // Índices base 0

    //         // Eliminar las columnas no deseadas en el encabezado
    //         var ths = clonedTable.querySelectorAll('thead th');
    //         columnsToOmit.slice().reverse().forEach(index => {
    //             ths[index].remove();
    //         });

    //         // Eliminar las columnas no deseadas en las filas del cuerpo
    //         var rows = clonedTable.querySelectorAll('tbody tr');
    //         rows.forEach(row => {
    //             var cells = row.querySelectorAll('td');
    //             columnsToOmit.slice().reverse().forEach(index => {
    //                 cells[index].remove();
    //             });

    //             // 👇 Forzar la columna Tarifa (índice 5) a texto
    //             let tarifaCell = cells[5];
    //             if (tarifaCell) {
    //                 tarifaCell.innerText = "" + tarifaCell.innerText;
    //             }
    //         });

    //         // 👇 Exportar manteniendo texto exacto
    //         var wb = XLSX.utils.table_to_book(clonedTable, { raw: true });

    //         const fechaActual = new Date().toISOString().slice(0, 10);
    //         const nombreArchivo = `Informe de Estudios Seguridad ${fechaActual}.xlsx`;
    //         XLSX.writeFile(wb, nombreArchivo);
    //     } else {
    //         console.error("El elemento con el ID 'ordenes_decargue' no existe.");
    //     }
    // });
};

async function GraficarAnaliticaDatos(fecha_inicial, fecha_final, placa, conductor) {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicial);
        datos.append("Fecha_Final", fecha_final);
        datos.append("Placa", placa);
        datos.append("Conductor", conductor);

        const response = await fetch($("#base_url").val() + "indicadores/AnaliticaDatos", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        // ============= 📌 PLACAS =============
        renderPieChart(
            "IndicadoresPlacasConductor",
            [
                { name: "Viajes Activos", value: data.placas?.viajes_activos ?? 0 },
                { name: "Viajes Anulados", value: data.placas?.viajes_anulados ?? 0 }
            ],
            "Indicadores de Placas"
        );
        renderTable("tabla-placa-conductor", [
            { Estado: "Viajes Activos", Total: data.placas?.viajes_activos ?? 0 },
            { Estado: "Viajes Anulados", Total: data.placas?.viajes_anulados ?? 0 }
        ], "#total-placa-conductor", data.placas?.total_viajes ?? 0);

        // ============= 📌 DESTINOS =============
        renderPieChart(
            "IndicadoresDestinos",
            data.destinos.map(d => ({ name: d.destino, value: d.total_viajes })),
            "Indicadores por Destinos"
        );
        renderTable("tabla-destino", data.destinos.map(d => ({
            Estado: d.destino,
            Total: d.total_viajes
        })), "#total-destino", data.destinos.reduce((a, b) => a + (b.total_viajes ?? 0), 0));

        // ============= 📌 CLIENTES =============
        renderPieChart(
            "IndicadoresClientes",
            data.clientes.map(c => ({ name: c.cliente_nombre, value: c.total_viajes })),
            "Indicadores por Clientes"
        );
        renderTable("tabla-clientes", data.clientes.map(c => ({
            Estado: c.cliente_nombre,
            Total: c.total_viajes
        })), "#total-clientes", data.clientes.reduce((a, b) => a + (b.total_viajes ?? 0), 0));

    } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "No se pudo cargar la analítica", "error");
    }
}

// 📌 Función para renderizar gráficas
function renderPieChart(containerId, seriesData, title) {
    const chartDom = document.getElementById(containerId);
    let myChart = echarts.getInstanceByDom(chartDom);
    if (!myChart) myChart = echarts.init(chartDom);

    let option = {
        title: { text: title, left: "center" },
        tooltip: {
            trigger: "item",
            formatter: params => `${params.name}<br/>📊 ${params.value} (${params.percent}%)`
        },
        series: [
            {
                type: "pie",
                radius: ["40%", "70%"],
                data: seriesData
            }
        ]
    };

    myChart.setOption(option);
}

// 📌 Función para renderizar tablas
function renderTable(tableId, rows, totalSelector, totalValue) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = rows.map(r => `
        <tr><td>${r.Estado}</td><td>${Number(r.Total).toLocaleString("es-CO")}</td></tr>
    `).join("");

    document.querySelector(totalSelector).textContent = Number(totalValue).toLocaleString("es-CO");
}

async function Listar_Placas() {
    try {
        // const selectPlaca = document.getElementById("campo-84-placa");
        const selectPlaca = document.getElementById(`campo-${window.VENTANA}-placa`);

        // limpiar opciones (dejar solo el primero "Seleccione placa")
        selectPlaca.innerHTML = `<option value="">Seleccione placa</option>`;

        const resp = await fetch($("#base_url").val() + "indicadores/ListarPlacas", {
            method: "POST"
        });

        const data = await resp.json();

        if (!data || data.length === 0) {
            let opt = document.createElement("option");
            opt.value = "";
            opt.textContent = "⚠️ No hay placas disponibles";
            selectPlaca.appendChild(opt);
            return;
        }

        // recorrer resultados y agregarlos al select
        data.forEach(item => {
            let opt = document.createElement("option");
            // opt.value = item.id;   // puedes usar item.placa si lo prefieres como valor
            opt.value = item.placa;   // puedes usar item.placa si lo prefieres como valor
            opt.textContent = item.placa;
            selectPlaca.appendChild(opt);
        });

    } catch (error) {
        console.error("Error al listar placas:", error);
        Swal.fire("Error", "No se pudo cargar la lista de placas", "error");
    }
}

async function Listar_Municipios() {
    try {
        // const selectPlaca = document.getElementById("campo-84-placa");
        const selectPlaca = document.getElementById(`campo-${window.VENTANA}-destino`);

        // limpiar opciones (dejar solo el primero "Seleccione placa")
        selectPlaca.innerHTML = `<option value="">Seleccione municipio</option>`;

        const resp = await fetch($("#base_url").val() + "indicadores/ListarMunicipios", {
            method: "POST"
        });

        const data = await resp.json();

        if (!data || data.length === 0) {
            let opt = document.createElement("option");
            opt.value = "";
            opt.textContent = "⚠️ No hay municipios disponibles";
            selectPlaca.appendChild(opt);
            return;
        }

        // recorrer resultados y agregarlos al select
        data.forEach(item => {
            let opt = document.createElement("option");
            opt.value = item.id;   // puedes usar item.placa si lo prefieres como valor
            opt.textContent = item.Destino;
            selectPlaca.appendChild(opt);
        });

    } catch (error) {
        console.error("Error al listar municipio:", error);
        Swal.fire("Error", "No se pudo cargar la lista de municipios", "error");
    }
}

async function Listar_Clientes() {
    try {
        // const selectPlaca = document.getElementById("campo-84-placa");
        const selectPlaca = document.getElementById(`campo-${window.VENTANA}-cliente`);

        // limpiar opciones (dejar solo el primero "Seleccione placa")
        selectPlaca.innerHTML = `<option value="">Seleccione cliente</option>`;

        const resp = await fetch($("#base_url").val() + "indicadores/ListarClientes", {
            method: "POST"
        });

        const data = await resp.json();

        if (!data || data.length === 0) {
            let opt = document.createElement("option");
            opt.value = "";
            opt.textContent = "⚠️ No hay clientes disponibles";
            selectPlaca.appendChild(opt);
            return;
        }

        // recorrer resultados y agregarlos al select
        data.forEach(item => {
            let opt = document.createElement("option");
            opt.value = item.id;   // puedes usar item.placa si lo prefieres como valor
            opt.textContent = item.nombre;
            selectPlaca.appendChild(opt);
        });

    } catch (error) {
        console.error("Error al listar cliente:", error);
        Swal.fire("Error", "No se pudo cargar la lista de clientes", "error");
    }
}

async function Listar_Conductores() {
    try {
        // const selectPlaca = document.getElementById("campo-84-placa");
        const selectPlaca = document.getElementById(`campo-${window.VENTANA}-conductor`);

        // limpiar opciones (dejar solo el primero "Seleccione placa")
        selectPlaca.innerHTML = `<option value="">Seleccione conductor</option>`;

        const resp = await fetch($("#base_url").val() + "indicadores/Get_Conductores", {
            method: "POST"
        });

        const data = await resp.json();

        if (!data || data.length === 0) {
            let opt = document.createElement("option");
            opt.value = "";
            opt.textContent = "⚠️ No hay clientes disponibles";
            selectPlaca.appendChild(opt);
            return;
        }

        // recorrer resultados y agregarlos al select
        data.forEach(item => {
            let opt = document.createElement("option");
            opt.value = item.numero_documento;   // puedes usar item.placa si lo prefieres como valor
            opt.textContent = item.Nombre;
            selectPlaca.appendChild(opt);
        });

    } catch (error) {
        console.error("Error al listar cliente:", error);
        Swal.fire("Error", "No se pudo cargar la lista de clientes", "error");
    }
}

async function Listar_Detalle_Analisis(fecha_inicio, fecha_final, placa, conductor) {
    try {
        const datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);
        datos.append("Placa", placa);
        datos.append("Conductor", conductor);

        const tbody = document.querySelector("#tabla-detalle-analitica tbody");

        // 🔄 Mensaje de carga
        tbody.innerHTML = `<tr><td colspan="9" class="text-muted">⏳ Cargando datos...</td></tr>`;

        // 👉 Fetch al backend
        const resp = await fetch($("#base_url").val() + "indicadores/Detalle_AnaliticaDatos", {
            method: "POST",
            body: datos
        });

        const data = await resp.json();

        // Validación
        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" class="text-muted">📉 No hay resultados en este rango de fechas</td></tr>`;
            return;
        }

        // === Renderizar resultados ===
        tbody.innerHTML = "";
        let contador = 1;

        data.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${contador++}</td>
                    <td>${item.Manifiesto}</td>
                    <td>${item.Radicado}</td>
                    <td>${item.Origen}</td>
                    <td>${item.Destino}</td>
                    <td>${item.Fecha_Expedicion}</td>
                    <td>${item.Conductor}</td>
                    <td>${item.Estado_Manifiesto}</td>
                    <td>${item.Planillador}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error Listar_Detalle_Analisis:", error);
        Swal.fire("Error", "No se pudo cargar el detalle analítico", "error");
    }
}