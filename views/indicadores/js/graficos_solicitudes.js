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

            Listar_Grafica_General_Solicitudes_Servicio(fecha_inicial, fecha_final);
        }
    });
};

async function Listar_Grafica_General_Solicitudes_Servicio(fecha_inicio, fecha_final) {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);

        const response = await fetch($("#base_url").val() + "indicadores/Graficos_General_Solicitudes_Servicios", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        if (!data || data.length === 0) {
            Swal.fire("Sin datos", "No se encontraron registros en el rango seleccionado", "info");
            return;
        }

        // 🔹 Diccionario de nombres bonitos
        const labelsMap = {
            "Rechazado_modificar": "Rechazado Modificar",
            "Rechazado": "Rechazado",
            "vencida": "Vencida",
            "Cancelado": "Cancelado",
            "Aprobado": "Aprobado",
            "TOTAL": "Total"
        };

        // Función helper para sanitizar
        const formatLabel = (tipo) => {
            if (labelsMap[tipo]) return labelsMap[tipo];
            return tipo.charAt(0).toUpperCase() + tipo.slice(1); // fallback capitalizar
        };

        // 🔹 Filtramos el total
        let totalRow = data.find(item => item.tipo === "TOTAL");
        let total = totalRow ? totalRow.cantidad : 0;

        // 🔹 Quitamos el TOTAL del gráfico y sanitizamos nombres
        let chartData = data.filter(item => item.tipo !== "TOTAL")
            .map(item => ({
                name: formatLabel(item.tipo),
                value: item.cantidad
            }));

        // === Gráfico de torta ===
        let chartDom = document.getElementById("GraficaGeneralSolicitudes");
        let myChart = echarts.init(chartDom);

        let option = {
            title: {
                // text: "Distribución de Manifiestos",
                left: "center"
            },
            tooltip: {
                trigger: "item",
                formatter: "{b}<br/>Cantidad: {c} ({d}%)"
            },
            legend: {
                orient: "horizontal",
                left: "center"
            },
            series: [
                {
                    name: "Manifiestos",
                    type: "pie",
                    radius: "60%",
                    label: { formatter: "{b}: {c}" },
                    data: chartData
                }
            ]
        };

        // 👉 Evento de click
        myChart.on("click", function (params) {
            renderGraficaPorResponsable(params.name, fecha_inicio, fecha_final);
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

async function renderGraficaPorResponsable(estado, fecha_inicio, fecha_final) {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);
        datos.append("estado", estado);

        const response = await fetch($("#base_url").val() + "indicadores/Graficos_Estudios_Responsables", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        if (!data || data.length === 0) {
            Swal.fire("Sin datos", "No se encontraron registros en el rango seleccionado", "info");
            return;
        }

        let chartDom = document.getElementById("GraficaPorResponsable");
        let myChart = echarts.init(chartDom);

        let responsables = [];
        let usuario_id = [];
        let totales = [];

        let mapResponsableId = {};

        data.resumen.forEach(item => {
            let partes = item.responsable.trim().split(" ");
            let primerNombre = partes[0];

            responsables.push(primerNombre);
            usuario_id.push(item.usuario_id);
            totales.push(item.total_vehiculos);

            // 👉 mapear primer nombre → id usuario
            mapResponsableId[primerNombre] = item.usuario_id;
        });

        let option = {
            title: { text: "Vehículos Aprobados por Responsable", left: "center" },
            tooltip: { trigger: "axis" },
            xAxis: { type: "value", name: "Cantidad" },
            yAxis: { type: "category", data: responsables },
            series: [
                {
                    type: "bar",
                    data: totales,
                    itemStyle: { color: "#0D47A1" },
                    label: { show: true, position: "right" }
                }
            ]
        };

        // 👉 Evento de click
        myChart.on("click", function (params) {
            let responsable = params.name; // el responsable que clickeó
            let idUsuario = mapResponsableId[responsable]; // recupera su id

            // 👉 Aquí ya puedes llamar a tu función de detalle:
            RenderTablaDetalleResponsable(estado, idUsuario, fecha_inicio, fecha_final);
        });

        myChart.setOption(option);

        // === Tabla detalle ===
        //     const tbody = document.getElementById("tabla-detalle-vehiculos");
        //     tbody.innerHTML = data.detalle.map(d => `
        //     <tr>
        //         <td>${d.responsable}</td>
        //         <td>${d.placa}</td>
        //         <td>${d.usuario_postulador}</td>
        //         <td>${d.operacion}</td>
        //     </tr>
        // `).join("");

    } catch (error) {
        console.error("Error cargando datos:", error);
        Swal.fire("Error", "Hubo un problema al cargar los datos", "error");
    }
}

async function RenderTablaDetalleResponsable(estado, idUsuario, fecha_inicio, fecha_final) {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);
        datos.append("idUsuario", idUsuario);
        datos.append("estado", estado);

        const response = await fetch($("#base_url").val() + "indicadores/Detalle_Responsbale_Estudio", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        if (!data || data.length === 0) {
            Swal.fire("Sin datos", "No se encontraron registros en el rango seleccionado", "info");
            return;
        }

        // === Tabla detalle ===
        const tbody = document.getElementById("tabla-detalle-vehiculos");
        tbody.innerHTML = data.map(d => `
            <tr>
                <td>${d.responsable}</td>
                <td>${d.placa}</td>
                <td>${d.usuario_postulador}</td>
                <td>${d.Manifiesto}</td>
                <td>${d.fecha}</td>
                <td>${d.operacion}</td>
            </tr>
        `).join("");

    } catch (error) {
        console.error("Error cargando datos:", error);
        Swal.fire("Error", "Hubo un problema al cargar los datos", "error");
    }
}