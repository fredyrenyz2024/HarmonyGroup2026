window.VENTANA = "";

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
            // let analista = document.getElementById(`campo-${window.VENTANA}-analistas`).value;

            // GraficarIndicadoresEstudios(fecha_inicial, fecha_final, analista);
            GraficarIndicadoresEstudios(fecha_inicial, fecha_final);
        }
    });

    document.getElementById('exportar_excel_detalle').addEventListener('click', function () {
        var table = document.getElementById('tabla-detalle-estudios');
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
            const nombreArchivo = `Informe de Estudios Seguridad ${fechaActual}.xlsx`;
            XLSX.writeFile(wb, nombreArchivo);
        } else {
            console.error("El elemento con el ID 'ordenes_decargue' no existe.");
        }
    });

    document.addEventListener("change", async e => {
        // 🛑 Listener para el SELECT de analistas
        if (e.target.matches(`#analistas`) || e.target.closest(`#analistas`)) {

            // Obtenemos el valor seleccionado
            const selectAnalistas = e.target.closest(`#analistas`);
            const analistaSeleccionado = selectAnalistas.value;

            // 🛑 Lógica de Ejecución al Filtrar

            // Obtener los valores actuales de los filtros de fecha/estado (ajusta los IDs según tu HTML)
            const estado = 'Total Estudios';
            let fechaInicio = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
            let fechaFinal = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;

            // Si el analista seleccionado es el valor por defecto (''), limpiamos el filtro.
            if (analistaSeleccionado) {
                // Recargar la tabla con filtros base (sin analista específico)
                Detalle_Estudios_Seguridad(estado, fechaInicio, fechaFinal, analistaSeleccionado);
            } else {
                // Recargar la tabla con el filtro de Analista (Necesitas modificar la función principal)
                // Ya que tu función Detalle_Estudios_Seguridad original NO recibe el filtro de analista,
                // DEBES actualizar el DOM para filtrar o modificar la función principal.

                // Si quieres filtrar solo en el lado del cliente (DOM), usarías esta lógica:
                // filtrarTablaPorAnalista(analistaSeleccionado); 

                // Si quieres filtrar en el servidor, MODIFICA la función Detalle_Estudios_Seguridad
                // para que acepte un cuarto parámetro (analistaSeleccionado).
            }
        }
    });
};

// async function GraficarIndicadoresEstudios(fecha_inicio, fecha_final, analista) {
async function GraficarIndicadoresEstudios(fecha_inicio, fecha_final) {
    try {
        let datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);
        // datos.append("analista", analista);

        const chartDom = document.getElementById("IndicadoresGeneralEstudios");
        const tbody = document.querySelector("#tabla-general-estudios tbody");
        const totalGeneral = document.getElementById("total-general-estudios");

        // 👉 Reset tabla
        tbody.innerHTML = `<tr><td colspan="2" class="text-muted">⏳ Cargando datos...</td></tr>`;
        totalGeneral.textContent = "";

        // 👉 Instancia o crea el gráfico
        let myChart = echarts.getInstanceByDom(chartDom);
        if (!myChart) myChart = echarts.init(chartDom);

        // 👉 Mostrar loading
        myChart.showLoading("default", { text: "⏳ Generando gráfica..." });

        // 👉 Fetch PHP (tu endpoint de estudios)
        const response = await fetch($("#base_url").val() + "indicadores/EstudiosPrefiltros", {
            method: "POST",
            body: datos
        });

        const data = await response.json();

        // 👉 Si no hay datos
        if (!data || (!data.total_estudios && !data.total_prefiltros)) {
            Swal.fire("Sin datos", "No se encontraron estudios", "info");
            myChart.clear();
            myChart.hideLoading();
            return;
        }

        // 👉 Datos vienen como array de fetchAll, tomar el primero
        const row = data;

        // 👉 Configuración gráfica
        let option = {
            title: {
                text: "Indicadores de Estudios",
                left: "center"
            },
            tooltip: {
                trigger: "item",
                formatter: params => {
                    return `${params.name}<br/>📊 ${Number(params.value).toLocaleString("es-CO")} (${params.percent}%)`;
                }
            },
            series: [
                {
                    name: "Estudios",
                    type: "pie",
                    radius: ["40%", "70%"], // Dona
                    label: {
                        formatter: params => `${params.name}`,
                        fontSize: 13
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
                        { name: "Total Estudios", value: row.total_estudios ?? 0 },
                        { name: "Prefiltros sin Estudio", value: row.total_prefiltros ?? 0 }
                    ]
                }
            ]
        };

        // 👉 Ocultar loading y dibujar
        myChart.hideLoading();
        myChart.setOption(option);

        // 👉 Evento de click para capturar configuracion_id
        myChart.on("click", function (params) {
            Detalle_Estudios_Seguridad(params.name, fecha_inicio, fecha_final, '');
            Listar_Analistas();
        });

        // 👉 Tabla
        tbody.innerHTML = `
            <tr><td>Total Estudios</td><td>${Number(row.total_estudios ?? 0).toLocaleString("es-CO")}</td></tr>
            <tr><td>Prefiltros sin Estudio</td><td>${Number(row.total_prefiltros ?? 0).toLocaleString("es-CO")}</td></tr>
        `;
        totalGeneral.textContent = Number((row.total_estudios ?? 0) + (row.total_prefiltros ?? 0)).toLocaleString("es-CO");

    } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "No se pudo cargar el gráfico de estudios", "error");
    }
}

async function Detalle_Estudios_Seguridad(estado, fecha_inicio, fecha_final, analistaSeleccionado) {

    try {
        const datos = new FormData();
        datos.append("Fecha_Inicio", fecha_inicio);
        datos.append("Fecha_Final", fecha_final);
        datos.append("Estado", estado);
        datos.append("Analista", analistaSeleccionado);

        const tbody = document.querySelector("#tabla-detalle-estudios tbody");

        // 🔄 Mensaje de carga
        tbody.innerHTML = `<tr><td colspan="11" class="text-muted">⏳ Cargando datos...</td></tr>`;

        // 👉 Fetch al backend
        const resp = await fetch($("#base_url").val() + "indicadores/Detalle_Estudios_Seguridad", {
            method: "POST",
            body: datos
        });

        const data = await resp.json();

        // Validación
        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="11" class="text-muted">📉 No hay resultados en este rango de fechas</td></tr>`;
            return;
        }

        // === Renderizar resultados ===
        tbody.innerHTML = "";
        let contador = 1;

        data.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${contador++}</td>
                    <td>${item.id_estudio}</td>
                    <td>${item.placa}</td>
                    <td>${item.Conductor}</td>
                    <td>${item.numero_documento}</td>
                    <td>${item.estado}</td>
                    <td>${item.Fecha_Registro}</td>
                    <td>${item.Fecha_Respuesta ?? "-"}</td>
                    <td>${item.Responsable}</td>
                    <td>${item.Analista}</td>
                    <td>${item.Tiempo_Transcurrido ?? "-"}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error Detalle_Estudios_Seguridad:", error);
        Swal.fire("Error", "No se pudo cargar el detalle de estudios", "error");
    }
}

// window.SELECT_ID = `#campo-${window.VENTANA}-analistas`;
async function Listar_Analistas() {
    // Limpieza inicial
    $(`#analistas`).empty();
    $(`#analistas`).append('<option value="">-- Seleccione Analista --</option>');

    try {
        const response = await fetch($('#base_url').val() + 'indicadores/listarAnalistasActivos', {
            method: 'POST',
            cache: 'no-cache'
        });

        const result = await response.json();
        console.log("🚀 ~ Listar_Analistas ~ result:", result)

        if (result && result.length > 0) {

            // 1. Llenar el Select
            result.forEach(p => {
                // Usamos numdoc_nexos como value, y mostramos el nombre completo + documento
                $(`#analistas`).append(
                    `<option value="${p.nom_usuario}">${p.nom_usuario}</option>`
                );
            });

            // 2. Inicializar Select2
            // $(`#analistas`).select2({
            //     placeholder: 'Buscar Analista por nombre',
            //     allowClear: true
            //     // Si está en modal/offcanvas: dropdownParent: $('#ID_DEL_CONTENEDOR')
            // });

        } else {
            console.warn('No se encontraron analista activos.');
            $(`#analistas`).append('<option value="">No se encontraron analistas</option>');
        }

    } catch (error) {
        console.error('Error en cargarSelectAnalistas:', error);
        $(`#analistas`).empty().append('<option value="">Error de carga</option>');
        // Opcional: Mostrar SweetAlert de error de conexión
    }
}

