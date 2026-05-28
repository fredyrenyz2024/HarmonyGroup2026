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

    document.addEventListener("change", async e => {
        if (e.target.matches(`#campo-${window.VENTANA}-filtros`) || e.target.matches(`#campo-${window.VENTANA}-filtros *`)) {
            let valor = e.target.value;

            // 👉 Ocultar siempre todas las secciones al inicio
            document.getElementById("origen_destino").style.display = "none";
            document.getElementById("seccion_configuracion").style.display = "none";
            document.getElementById("seccion_cliente").style.display = "none";

            // 👉 Mostrar según el filtro
            if (valor === "Origen Destino") {
                document.getElementById("origen_destino").style.display = "";
                Listar_Origen();
                Listar_Destino();
            } else if (valor === "Configuración") {
                document.getElementById("seccion_configuracion").style.display = "";
                Listar_Configuracion();
            } else if (valor === "Cliente") {
                document.getElementById("seccion_cliente").style.display = "";
                Listar_Clientes();
            } else if (valor === "Todos") {
                document.getElementById("origen_destino").style.display = "";
                document.getElementById("seccion_configuracion").style.display = "";
                document.getElementById("seccion_cliente").style.display = "";
                Listar_Origen();
                Listar_Destino();
                Listar_Clientes();
                Listar_Configuracion();
            }
        }
    });

    document.addEventListener("click", async e => {
        if (e.target.matches(`#campo-${window.VENTANA}-filtrar`) || e.target.matches(`#campo-${window.VENTANA}-filtrar *`)) {
            let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
            let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
            let filtroSeleccionado = document.getElementById(`campo-${window.VENTANA}-filtros`).value;

            let origen = document.getElementById(`origen`).value;
            let destino = document.getElementById(`destino`).value;
            let configuracion = document.getElementById(`configuracion`).value;
            let cliente = document.getElementById(`cliente`).value;

            // 👉 VALIDACIONES
            if (!fecha_inicial || !fecha_final) {
                Swal.fire("Campos obligatorios", "Debes seleccionar la fecha inicial y final", "warning");
                return;
            }

            if (filtroSeleccionado === "Origen Destino") {
                if (!origen || !destino) {
                    Swal.fire("Campos obligatorios", "Debes seleccionar Origen y Destino", "warning");
                    return;
                }
            } else if (filtroSeleccionado === "Configuración") {
                if (!configuracion) {
                    Swal.fire("Campos obligatorios", "Debes seleccionar una Configuración", "warning");
                    return;
                }
            } else if (filtroSeleccionado === "Cliente") {
                if (!cliente) {
                    Swal.fire("Campos obligatorios", "Debes seleccionar un Cliente", "warning");
                    return;
                }
            } else if (filtroSeleccionado === "Todos") {
                if (!origen || !destino || !configuracion || !cliente) {
                    Swal.fire("Campos obligatorios", "Debes seleccionar Origen, Destino, Configuración y Cliente", "warning");
                    return;
                }
            }

            try {
                // 👉 Preparar datos
                let datos = new FormData();
                datos.append("Fecha_Inicio", fecha_inicial);
                datos.append("Fecha_Final", fecha_final);
                datos.append("Origen", origen);
                datos.append("Destino", destino);
                datos.append("Configuracion", configuracion);
                datos.append("Cliente", cliente);

                // 👉 Petición al backend
                const resp = await fetch($("#base_url").val() + "indicadores/BuscarDatos", {
                    method: "POST",
                    body: datos
                });

                const data = await resp.json();


                // 👉 Llenar tabla
                let tbody = document.querySelector("#tabla-gestion-operacion tbody");
                tbody.innerHTML = "";

                if (!data || data.length === 0) {
                    Swal.fire("Sin datos", "No se encontraron registros en este rango de fechas", "info");
                    tbody.innerHTML = "";
                    return;
                }

                data.forEach((item, index) => {
                    let fila = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.id ?? ""}</td>
                    <td>${item.Origen ?? ""}</td>
                    <td>${item.Destino ?? ""}</td>
                    <td>${item.placa ?? ""}</td>
                    <td>${item.Conductor ?? ""}</td>
                    <td>${item.celular ?? ""}</td>
                    <td>${item.numero_documento ?? ""}</td>
                    <td>${item.Configuracion ?? ""}</td>
                    <td>${item.clase ?? ""}</td>
                </tr>`;
                    tbody.insertAdjacentHTML("beforeend", fila);
                });

            } catch (error) {
                console.error("Error en la consulta:", error);
                Swal.fire("Error", "Ocurrió un problema al consultar los datos", "error");
            }
        }
    });

    // document.getElementById('exportar_excel').addEventListener('click', function () {
    //     var table = document.getElementById('tabla-gestion-operacion');
    //     if (table) {
    //         // 👉 Clonar la tabla
    //         var clonedTable = table.cloneNode(true);

    //         // 👉 Exportar manteniendo todo el contenido
    //         var wb = XLSX.utils.table_to_book(clonedTable, { raw: true });

    //         const fechaActual = new Date().toISOString().slice(0, 10);
    //         const nombreArchivo = `Informe de Gestion ${fechaActual}.xlsx`;
    //         XLSX.writeFile(wb, nombreArchivo);
    //     } else {
    //         console.error("El elemento con el ID 'tabla-gestion-operacion' no existe.");
    //     }
    // });

    document.getElementById('exportar_excel').addEventListener('click', function () {
        var table = document.getElementById('tabla-gestion-operacion');
        if (table) {
            // 👉 Clonar la tabla
            var clonedTable = table.cloneNode(true);

            // 👉 Crear fila con filtros seleccionados
            var filtrosTable = document.createElement("table");
            var row = filtrosTable.insertRow();

            // Origen
            var origenSelect = document.getElementById("origen");
            var origenText = origenSelect ? origenSelect.options[origenSelect.selectedIndex].text : "";
            var origenCell = row.insertCell();
            origenCell.textContent = "Origen: " + origenText;

            // Destino
            var destinoSelect = document.getElementById("destino");
            var destinoText = destinoSelect ? destinoSelect.options[destinoSelect.selectedIndex].text : "";
            var destinoCell = row.insertCell();
            destinoCell.textContent = "Destino: " + destinoText;

            // Configuración
            var configSelect = document.getElementById("configuracion");
            var configText = configSelect ? configSelect.options[configSelect.selectedIndex].text : "";
            var configCell = row.insertCell();
            configCell.textContent = "Configuración: " + configText;

            // Cliente
            var clienteSelect = document.getElementById("cliente");
            var clienteText = clienteSelect ? clienteSelect.options[clienteSelect.selectedIndex].text : "";
            var clienteCell = row.insertCell();
            clienteCell.textContent = "Cliente: " + clienteText;

            // 👉 Combinar tabla de filtros + tabla original
            var exportContainer = document.createElement("div");
            exportContainer.appendChild(filtrosTable);
            exportContainer.appendChild(clonedTable);

            // 👉 Exportar a Excel
            var wb = XLSX.utils.table_to_book(exportContainer, { raw: true });

            const fechaActual = new Date().toISOString().slice(0, 10);
            const nombreArchivo = `Informe de Gestion ${fechaActual}.xlsx`;
            XLSX.writeFile(wb, nombreArchivo);
        } else {
            console.error("El elemento con el ID 'tabla-gestion-operacion' no existe.");
        }
    });
};

async function Listar_Origen() {
    try {
        // const selectPlaca = document.getElementById("campo-84-placa");
        const selectPlaca = document.getElementById(`origen`);

        // limpiar opciones (dejar solo el primero "Seleccione placa")
        selectPlaca.innerHTML = `<option value="">Seleccione Origen</option>`;

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

async function Listar_Destino() {
    try {
        // const selectPlaca = document.getElementById("campo-84-placa");
        const selectPlaca = document.getElementById(`destino`);

        // limpiar opciones (dejar solo el primero "Seleccione placa")
        selectPlaca.innerHTML = `<option value="">Seleccione Destino</option>`;

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
        const selectPlaca = document.getElementById(`cliente`);

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

async function Listar_Configuracion() {
    try {
        // const selectPlaca = document.getElementById("campo-84-placa");
        const selectPlaca = document.getElementById(`configuracion`);

        // limpiar opciones (dejar solo el primero "Seleccione placa")
        selectPlaca.innerHTML = `<option value="">Seleccione configuracion</option>`;

        const resp = await fetch($("#base_url").val() + "indicadores/ListarConfiguracion", {
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
            opt.value = item.nombre;   // puedes usar item.placa si lo prefieres como valor
            opt.textContent = item.Configuracion;
            selectPlaca.appendChild(opt);
        });

    } catch (error) {
        console.error("Error al listar configuracion:", error);
        Swal.fire("Error", "No se pudo cargar la lista de configuraciones", "error");
    }
}



