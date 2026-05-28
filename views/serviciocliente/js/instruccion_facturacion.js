(function () {
    "use strict";
    window.VENTANA = null; // Variable global para almacenar el ID
    sessionStorage.clear();
    window.mensajesTransmision = [];
    // window.URL_DSNUBE = null;

    window.initScript = function (id) {
        window.VENTANA = id;
        // window.URL_DSNUBE = document.getElementById('url_api_dsnube').value;

        Listar_Remesas_General();
        // Crear instancia
        // Usar una variable global o una propiedad en el objeto window

        //Hasta aqui es la pru
        if (!window.myOffcanvas) {
            window.myOffcanvas = new DynamicOffcanvas({
                id: `customOffcanvas${id}`,
                title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
                content: "<p>Contenido inicial</p>",
                scroll: true,
                backdrop: false,
            });
        } else {
            console.log("El offcanvas ya está creado.");
        }

        $(document).on("change", "#selectAll", function () {
            let isChecked = $(this).prop("checked");
            $(".pedido-checkbox").prop("checked", isChecked).trigger("change"); // Usa trigger
        });

        $(document).on("change", ".pedido-checkbox", function () {
            let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
            let id = $(this).val();
            let totalRemesa = parseFloat($(this).attr("data-total-remesa") || 0); // 👈 Capturar el total

            if ($(this).prop("checked")) {
                if (!carrito.some((item) => item.id === id)) {
                    carrito.push({ id: id, total: totalRemesa }); // 👈 Guardar total
                }
            } else {
                carrito = carrito.filter((item) => item.id !== id);
            }

            sessionStorage.setItem("carrito", JSON.stringify(carrito));

            // Resaltar fila
            let rowId = $(this).data("row");
            let row = document.getElementById(rowId);
            if (row) {
                row.style.backgroundColor = $(this).is(":checked") ? "#d8ddf9" : "";
            }

            $("#selectAll").prop(
                "checked",
                $(".pedido-checkbox:checked").length === $(".pedido-checkbox").length,
            );

            actualizarContadorCarrito();
            actualizarTotalSeleccionado();
        });

        document.addEventListener("click", async (e) => {
            if (e.target.matches(`#btn-remesas-cliente`) || e.target.matches(`#btn-remesas-cliente *`)) {
                let Boton = e.target.closest(`#btn-remesas-cliente`);
                let Cliente = Boton.getAttribute("data-Cliente");
                let ClienteId = Boton.getAttribute("data-ClienteId");
                myOffcanvas.updateTitle(
                    `<span class="text-primary-emphasis uil uil-file-alt"></span> Instrucci&oacute;n de Facturaci&oacute;n ` +
                    Cliente,
                );
                myOffcanvas.updateContent(`<h5 class="card-title mb-2">Datos de Remesas</h5>
                <div class="container-fluid">
                    <div class="row mb-1">
                        <!-- Input de búsqueda alineado a la derecha -->
                        <div class="col-12 d-flex justify-content-end p-1">
                            <input type="hidden" id="search_remesas" class="form-control form-control-sm w-auto" placeholder="Buscar remesa..." style="font-size: 12px;">
                        </div>
                    </div>
                    <div class="row mb-2"> 
                        <div class="col-12 col-md-12 p-1">
                            <div class="table-responsive scrollbar">
                                <a href="JavaScript:void(0);" id="exportar_excel2" class="text-decoration-none d-flex align-items-center text-success fw-bold">
                                    <img src="https://www.harmonygroup.com.co/public/img/excel_2013.png" alt="Excel" width="18px" class="me-1">
                                    Exportar a Excel
                                </a>

                                <table id='table1' class='table table-bordered table-sm' data-page-length='100' style="font-size:12px;">
                                    <thead>
                                        <tr>
                                            <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>
                                                <input class="form-check-input" id="selectAll" type="checkbox" value="" style="scale: 1.2;">
                                            </th>
                                            <th class='text-center' style='width: auto; white-space: nowrap;'>Nro. Remesa</th>
                                            <th class='text-center' style='width: auto; white-space: nowrap;'>Placa</th>
                                            <th class='text-center' style='width: auto; white-space: nowrap;'>Fecha Remesa</th>
                                            <th class='text-center' style='width: auto; white-space: nowrap;'>Valor Remesa</th>
                                            <!--<th class='text-center' style='width: auto; white-space: nowrap;'>Valor Ajuste</th>-->
                                            <th class='text-center' style='width: auto; white-space: nowrap;'>Sac</th>
                                            <th class='text-center' style='width: auto; white-space: nowrap;'>Cliente</th>
                                            <th class='text-center' style='width: auto; white-space: nowrap;'>Mercancia</th>
                                            <th class='text-center' style='width: auto; white-space: nowrap;'>Agencia</th>
                                            <th class='text-center' style='width: auto; white-space: nowrap;'>Origen</th>
                                            <th class='text-center' style='width: auto; white-space: nowrap;'>Destino</th>
                                            <th class='text-center' style='width: auto; white-space: nowrap;'>Observaci&oacute;n</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody_remesa_cliente">
                                        <tr class="text-center img_loading" id="img_loading" style="display: none;">
                                            <td colspan="8"><img src="<?= BASE_URL ?>public/img/nexos_loading.gif" height="25" width="25"> Esperando Información</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="col-12 col-md-12 p-1">
                            <div class="mb-2">
                                <label style="font-size: 12px;">Nombre Instrucci&oacute;n&nbsp;<span style="color:red;"><i>(*)</i></label>
                                <input class="form-control form-control-sm" id="nombre_instruccion" type="text" oninput="this.value = this.value.toUpperCase();">
                            </div>
                        </div>

                        <div class="col-12 col-md-4 p-1">
                            <div class="mb-2">
                                <label style="font-size: 12px;">Total Instrucci&oacute;n&nbsp;<span style="color:red;"><i>(*)</i></label>
                                <input class="form-control form-control-sm" id="total_instruccion" type="text" disabled>
                            </div>
                        </div>

                        <div class="col-12 col-md-4 p-1">
                            <div class="mb-2">
                                <label style="font-size: 12px;">Total Servicios Especiales;&nbsp;<span style="color:red;"><i>(*)</i></label>
                                <input class="form-control form-control-sm" id="total_servicio_especial" type="text">
                            </div>
                        </div>

                        <div class="col-12 col-md-4 p-1">
                            <div class="mb-2">
                                <label style="font-size: 12px;">Total Factura;<span style="color:red;"><i>(*)</i></label>
                                <input class="form-control form-control-sm" id="total_facturacion" type="text" disabled>
                            </div>
                        </div>

                        <div class="col-12 col-md-6 p-1">
                            <div class="mb-2">
                                <label style="font-size: 12px;">Archivo Instrucci&oacute;n;<span style="color:red;"><i>(*)</i></label>
                                <input class="form-control form-control-sm" type="file" id="fileInputExcel" accept=".xlsx, .xls">
                            </div>
                        </div>

                        <div class="col-12 col-md-6 p-1">
                            <div class="mb-2">
                                <label style="font-size: 12px;">Soportes</label> 
                                <input class="form-control form-control-sm" type="file" id="archivo" name="archivo" name="archivo[]" accept=".pdf, image/*" multiple>
                            </div>
                        </div>


                        <div class="col-12 col-md-12 p-1">
                            <div class="mb-2">
                                <label style="font-size: 12px;">Observaciones Instrucci&oacute;n&nbsp;<span style="color:red;"><i>(*)</i></label>
                                <!--<input class="form-control form-control-sm" id="total_instruccion" type="text" oninput="this.value = this.value.toUpperCase();">-->
                                <textarea class="form-control tinymce" data-tinymce='{"height":"15rem","placeholder":"Write a description here..."}' id="descripcion_instruccion" oninput="this.value = this.value.toUpperCase();" style="height: 100px"></textarea>
                            </div>
                        </div>

                        <div class="border-top border-translucent border-dashed pt-2">
                            <div class="row justify-content-end">
                                <div class="col-auto">
                                <button class="btn btn-success btn-sm py-1" id="btn_guardar_instruccion" type="button" data-ClienteId='${ClienteId}' data-Objeto='proveedor'> 
                                    <span class="uil uil-save"></span> Guardar Instrucci&oacute;n
                                </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);

                Listar_Remesas_Cliente(ClienteId, "");
                document.addEventListener("input", async (e) => {
                    if (e.target.matches(`#search_remesas`)) {
                        const valor = e.target.value.trim();
                        Listar_Remesas_Cliente(ClienteId, valor);
                    }
                });

                myOffcanvas.updateHeight("100vh");
                myOffcanvas.updateWidth("80%");
                myOffcanvas.show();
                document
                    .getElementById("exportar_excel2")
                    .addEventListener("click", function () {
                        var table = document.getElementById("table1");
                        if (!table) {
                            console.error(
                                "El elemento con el ID 'ordenes_decargue_export' no existe.",
                            );
                            return;
                        }

                        // Clonar tabla y eliminar columnas no deseadas
                        var clonedTable = table.cloneNode(true);
                        var columnsToOmit = [0, 6]; // Índices base 0

                        var ths = clonedTable.querySelectorAll("thead th");
                        columnsToOmit
                            .slice()
                            .reverse()
                            .forEach((index) => {
                                if (ths[index]) ths[index].remove();
                            });

                        var rows = clonedTable.querySelectorAll("tbody tr");
                        rows.forEach((row) => {
                            var cells = row.querySelectorAll("td");
                            columnsToOmit
                                .slice()
                                .reverse()
                                .forEach((index) => {
                                    if (cells[index]) cells[index].remove();
                                });
                        });

                        // Crear libro a partir de la tabla
                        var wb = XLSX.utils.table_to_book(clonedTable, { sheet: "Órdenes" });
                        var ws = wb.Sheets["Órdenes"];

                        // 1) Autoajustar columnas según el contenido
                        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                        const colWidths = data[0].map((_, i) => {
                            let maxLength = data
                                .map((row) => (row[i] ? row[i].toString().length : 0))
                                .reduce((a, b) => Math.max(a, b), 0);
                            return { wch: maxLength + 2 }; // +2 por padding
                        });
                        ws["!cols"] = colWidths;

                        // 2) Agregar filtros (en la primera fila con datos)
                        const range = XLSX.utils.decode_range(ws["!ref"]);
                        ws["!autofilter"] = {
                            ref: XLSX.utils.encode_range(range.s, range.e),
                        };

                        // 3) Poner encabezados en negrita (simple, no requiere XLSX-Style)
                        data[0].forEach((header, i) => {
                            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
                            if (!ws[cellAddress]) return;
                            ws[cellAddress].s = { font: { bold: true } }; // Necesita versión con soporte de estilos (xlsx-style)
                        });

                        // 4) Exportar con nombre dinámico
                        const fechaActual = new Date().toISOString().slice(0, 10);
                        const nombreArchivo = `Informe_Ordenes_Cargue_${fechaActual}.xlsx`;
                        XLSX.writeFile(wb, nombreArchivo);
                    });

                // document.getElementById(`btn_valor_ajuste`).setAttribute('data-ClienteId', ClienteId);
            }

            if (e.target.matches(`#btn-close-customOffcanvas${window.VENTANA}`) || e.target.matches(`#btn-close-customOffcanvas${window.VENTANA} *`)) {
                sessionStorage.clear();
                actualizarContadorCarrito();
            }

            if (e.target.matches(`#btn_guardar_instruccion`) || e.target.matches(`#btn_guardar_instruccion *`)) {
                let Boton = e.target.closest(`#btn_guardar_instruccion`);
                let ClienteId = Boton.getAttribute("data-ClienteId");
                let Nombre_Cliente = Boton.getAttribute("data-NombreCliente");
                let Nombre = document.getElementById("nombre_instruccion").value;
                let Total_Instruccion =
                    document.getElementById("total_instruccion").value;
                let total_servicio_especial = document.getElementById(
                    "total_servicio_especial",
                ).value;
                let total_facturacion =
                    document.getElementById("total_facturacion").value;
                let Descripccion_Instruccion = document
                    .getElementById("descripcion_instruccion")
                    .value.trim();

                const inputNombre = document.getElementById("nombre_instruccion");
                const inputTotal = document.getElementById("total_instruccion");
                const inputTotalServicios = document.getElementById(
                    "total_servicio_especial",
                );
                const inputTotalFactura = document.getElementById("total_facturacion");
                const inputDescripcion = document.getElementById(
                    "descripcion_instruccion",
                );
                const carrito = sessionStorage.getItem("carrito");

                const fileInput = document.getElementById("fileInputExcel");

                const inputArchivos = document.getElementById("archivo");
                const archivos = inputArchivos.files;

                let error = false;

                if (!carrito || carrito === "[]") {
                    Swal.fire({
                        icon: "warning",
                        title: "Acción requerida",
                        html: "Debe seleccionar al menos na remesa para crear la instrucci&oacute;n de facturaci&oacute;n.",
                        confirmButtonText: "Aceptar",
                    });

                    // Si tienes algún campo visual relacionado (ej: una tabla, div o input), márcalo
                    const contenedorCarrito = document.getElementById("carrito_container"); // cambia por el ID real
                    if (contenedorCarrito) {
                        contenedorCarrito.classList.add("is-invalid"); // solo si aplica
                    }

                    return; // Detiene la ejecución
                }

                // Validar Nombre
                if (!Nombre || Nombre.trim() === "") {
                    inputNombre.classList.add("is-invalid");
                    Swal.fire({
                        icon: "warning",
                        title: "Campo obligatorio",
                        text: 'El campo "Nombre" es obligatorio.',
                        confirmButtonText: "Aceptar",
                    });
                    error = true;
                }

                // Validar Total Instrucción
                else if (!Total_Instruccion || Total_Instruccion.trim() === "") {
                    inputTotal.classList.add("is-invalid");
                    Swal.fire({
                        icon: "warning",
                        title: "Campo obligatorio",
                        text: 'El campo "Total Instrucción" es obligatorio.',
                        confirmButtonText: "Aceptar",
                    });
                    error = true;
                } else if (
                    !total_servicio_especial ||
                    total_servicio_especial.trim() === ""
                ) {
                    inputTotalServicios.classList.add("is-invalid");
                    Swal.fire({
                        icon: "warning",
                        title: "Campo obligatorio",
                        text: 'El campo "Total Servicios Especiales" es obligatorio.',
                        confirmButtonText: "Aceptar",
                    });
                    error = true;
                } else if (!total_facturacion || total_facturacion.trim() === "") {
                    inputTotalFactura.classList.add("is-invalid");
                    Swal.fire({
                        icon: "warning",
                        title: "Campo obligatorio",
                        text: 'El campo "Total Factura" es obligatorio.',
                        confirmButtonText: "Aceptar",
                    });
                    error = true;
                } else if (!fileInput.files.length) {
                    e.preventDefault(); // Detener el envío del formulario
                    // alert('Por favor, seleccione un archivo antes de continuar.');
                    Swal.fire({
                        icon: "warning",
                        title: "Campo obligatorio",
                        html: "Por favor, seleccione un archivo excel antes de continuar.",
                        confirmButtonText: "Aceptar",
                    });
                    error = true;
                    fileInput.focus();
                    fileInput.classList.add("is-invalid");
                } else if (
                    !Descripccion_Instruccion ||
                    Descripccion_Instruccion.trim() === ""
                ) {
                    inputDescripcion.classList.add("is-invalid");
                    Swal.fire({
                        icon: "warning",
                        title: "Campo obligatorio",
                        html: 'El campo "Descripci&oacute;n" es obligatorio.',
                        confirmButtonText: "Aceptar",
                    });
                    error = true;
                }

                if (error) return;

                // Limpiar clases si está todo correcto
                inputNombre.classList.remove("is-invalid");
                inputTotal.classList.remove("is-invalid");
                inputTotalServicios.classList.remove("is-invalid");
                inputTotalFactura.classList.remove("is-invalid");
                fileInput.classList.remove("is-invalid");
                inputDescripcion.classList.remove("is-invalid");

                const result = await Swal.fire({
                    title: "¿Seguro?",
                    text: "¿Desea Registrar Instruccion del cliente? " + Nombre_Cliente,
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#3B71CA",
                    cancelButtonColor: "#9FA6B2",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    customClass: {
                        popup: "swal2-custom-font",
                    },
                });

                if (result.isConfirmed) {
                    try {
                        let formdata = new FormData();
                        formdata.append("ClienteId", ClienteId);
                        formdata.append("Nombre", Nombre);
                        formdata.append("Total_Instruccion", Total_Instruccion);
                        formdata.append("Total_servicio_especial", total_servicio_especial);
                        formdata.append("Total_facturacion", total_facturacion);
                        formdata.append("Descripccion_Instruccion", Descripccion_Instruccion);
                        formdata.append("remesas", sessionStorage.getItem("carrito"));
                        // formdata.append('excel', excelInput.files[0]);
                        formdata.append("excel", fileInput.files[0]);
                        // Agregar cada archivo al FormData
                        for (let i = 0; i < archivos.length; i++) {
                            formdata.append("archivo[]", archivos[i]); // importante usar [] en el nombre
                        }

                        const response = await fetch(
                            $("#base_url").val() +
                            "serviciocliente/Guardar_Instruccion_Facturacion",
                            {
                                method: "POST",
                                body: formdata,
                                cache: "no-cache",
                            },
                        );
                        const data = await response.json();

                        if (data.status === "success") {
                            Swal.fire({
                                icon: "success",
                                title: "¡Éxito!",
                                text: data.message,
                                confirmButtonColor: "#3085d6",
                            });

                            myOffcanvas.hide();
                            Listar_Remesas_General();
                            // Opcional: limpiar campos, reiniciar carrito
                            sessionStorage.removeItem("carrito");
                            actualizarContadorCarrito();
                            await EnviarInstruccionFacturacion(data.instruccion_id);
                            // document.getElementById('form_instruccion').reset(); // si tienes un formulario
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: data.message,
                                confirmButtonColor: "#d33",
                            });
                        }
                    } catch (error) {
                        console.error("Error en la solicitud:", error);
                        Swal.fire({
                            icon: "error",
                            title: "Error del servidor",
                            text: "No se pudo completar la operación.",
                            confirmButtonColor: "#d33",
                        });
                    }
                }
            }

            if (e.target.matches(`#btn_valor_ajuste`) || e.target.matches(`#btn_valor_ajuste *`)) {
                let Boton = e.target.closest(`#btn_valor_ajuste`);
                let RemesaId = Boton.getAttribute("data-RemesaId");
                let valorActual = Boton.getAttribute("data-valorActual");
                let ClienteId = Boton.getAttribute("data-ClienteId");

                // ✅ cargar selects
                Municipios();
                document.getElementById(`remesaIdLabel`).innerHTML = RemesaId;
                document
                    .getElementById(`guardarAjusteBtn`)
                    .setAttribute("data-RemesaId", RemesaId);
                document.getElementById(`valor_Actual_Tarifa`).innerHTML =
                    formatMoney(valorActual);
                document
                    .getElementById(`guardarAjusteBtn`)
                    .setAttribute("data-valorActual", valorActual);
                document
                    .getElementById(`guardarAjusteBtn`)
                    .setAttribute("data-ClienteId", ClienteId);
                document.getElementById(`inputAjuste`).disabled = false;
                document.getElementById(`selectOrigen`).disabled = false;
                $("#selectOrigen").val("").trigger("change");
                document.getElementById(`selectDestino`).disabled = false;
                $("#selectDestino").val("").trigger("change");
                document.getElementById(`inputAjuste`).value = "";
                document.getElementById(`ajuste_id`).value = "";

                // ✅ set focus al input
                const input = document.getElementById("inputAjuste");
                if (input) {
                    input.focus();
                    input.addEventListener("keyup", function (e) {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            procesarAjuste(RemesaId, valorActual, this);
                        }
                    });
                }
            }

            if (e.target.matches(`#guardarAjusteBtn`) || e.target.matches(`#guardarAjusteBtn *`)) {
                let Boton = e.target.closest(`#guardarAjusteBtn`);
                let RemesaId = Boton.getAttribute("data-RemesaId");
                let ClienteId = Boton.getAttribute("data-ClienteId");
                let ValorActual = Boton.getAttribute("data-valorActual");
                let DestinatarioId = Boton.getAttribute("data-destinatarioid");
                let ValorAjuste = document.getElementById(`inputAjuste`).value;
                let selectOrigen = document.getElementById(`selectOrigen`).value;
                let selectDestino = document.getElementById(`selectDestino`).value;
                let AjusteId = document.getElementById(`ajuste_id`).value;

                Swal.fire({
                    title: "¿Está seguro?",
                    text: "¿Esta seguro de realizar el ajuste de tarifa?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    reverseButtons: true,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        let datos = new FormData();
                        datos.append("Valor_Actual", ValorActual);
                        // datos.append('Valor_Ajuste', ValorAjuste);
                        datos.append("Valor_Ajuste", ValorAjuste === "" ? null : ValorAjuste);
                        datos.append("Remesa_Id", RemesaId);
                        datos.append("selectOrigen", selectOrigen);
                        datos.append("selectDestino", selectDestino);
                        datos.append("AjusteId", AjusteId);
                        datos.append("DestinatarioId", DestinatarioId);

                        let response;
                        try {
                            if (AjusteId) {
                                response = await fetch(
                                    $("#base_url").val() +
                                    "serviciocliente/Autorizar_Ajuste_Remesa",
                                    {
                                        method: "POST",
                                        body: datos,
                                        cache: "no-cache",
                                    },
                                );
                            } else {
                                response = await fetch(
                                    $("#base_url").val() +
                                    "serviciocliente/Solicitar_Ajuste_Remesa",
                                    {
                                        method: "POST",
                                        body: datos,
                                        cache: "no-cache",
                                    },
                                );
                            }

                            const data = await response.json();

                            if (data.status) {
                                Swal.fire({
                                    icon: "success",
                                    title: "Solicitud Realizada!",
                                    text:
                                        data.message || "Solicitud de ajuste creada correctamente.",
                                    timer: 3000,
                                    showConfirmButton: false,
                                }).then(() => {
                                    // 🔒 Cerrar modal con API de Bootstrap 5
                                    $("#verticallyCentered").modal("hide");

                                    // 📋 Refrescar listado
                                    Listar_Remesas_Cliente(ClienteId, "");
                                });
                            } else {
                                Swal.fire({
                                    icon: "error",
                                    title: "Error",
                                    text:
                                        data.message ||
                                        "No se pudo procesar la solicitud de anulación.",
                                });
                            }
                        } catch (error) {
                            console.error("Error en la solicitud:", error);
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "Ocurrió un problema en el servidor. Intente nuevamente.",
                            });
                        }
                    }
                });
            }

            if (e.target.matches(`#btn_ver_ajuste`) || e.target.matches(`#btn_ver_ajuste *`)) {
                let Boton = e.target.closest(`#btn_ver_ajuste`);
                let RemesaId = Boton.getAttribute("data-RemesaId");
                let AjusteId = Boton.getAttribute("data-AjusteId");
                let ValorActual = Boton.getAttribute("data-valorActual");
                let ClienteId = Boton.getAttribute("data-ClienteId");
                let DestinatarioId = Boton.getAttribute("data-destinatarioid");
                // ✅ cargar selects
                await Municipios();

                document
                    .getElementById(`guardarAjusteBtn`)
                    .setAttribute("data-RemesaId", RemesaId);
                document
                    .getElementById(`guardarAjusteBtn`)
                    .setAttribute("data-valorActual", ValorActual);
                document
                    .getElementById(`guardarAjusteBtn`)
                    .setAttribute("data-ClienteId", ClienteId);
                document
                    .getElementById(`guardarAjusteBtn`)
                    .setAttribute("data-destinatarioid", DestinatarioId);

                let formdata = new FormData();
                formdata.append("RemesaId", RemesaId);
                formdata.append("AjusteId", AjusteId);

                try {
                    const response = await fetch(
                        $("#base_url").val() + "serviciocliente/Consultar_Ajuste_Remesa",
                        {
                            method: "POST",
                            body: formdata,
                            cache: "no-cache",
                        },
                    );

                    const data = await response.json();

                    if (data) {
                        document.getElementById(`remesaIdLabel`).innerHTML = RemesaId;
                        document.getElementById(`valor_Actual_Tarifa`).innerHTML =
                            formatMoney(ValorActual);
                        document.getElementById(`inputAjuste`).value = Number(
                            data.valor_ajuste,
                        ).toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                        });
                        document.getElementById(`inputAjuste`).disabled = true;
                        document.getElementById(`selectOrigen`).disabled = true;
                        document.getElementById(`selectDestino`).disabled = true;

                        // 2. Lógica de Selección: Ahora las opciones están garantizadas

                        // Origen
                        const valoro_selectOrigen = data.origen_ajuste;
                        const selectOrigen = document.getElementById("selectOrigen");

                        let optionValue_selectOrigen = null;
                        // No es necesario iterar si usas Select2 con valores correctos,
                        // pero si la data es el TEXTO, tu iteración es necesaria.
                        for (let option of selectOrigen.options) {
                            if (option.text.trim() === valoro_selectOrigen.trim()) {
                                // Mejor comparar TEXTO si eso es lo que te llega
                                optionValue_selectOrigen = option.value;
                                break;
                            }
                        }
                        if (optionValue_selectOrigen) {
                            $("#selectOrigen").val(optionValue_selectOrigen).trigger("change");
                        }

                        const selectDestino = document.getElementById("selectDestino");
                        const valoro_selectDestino = data.destino_ajuste;
                        // console.log("🚀 ~ valoro_selectDestino:", valoro_selectDestino)
                        // Buscar opción que tenga ese texto
                        let optionValue_selectDestino = null;
                        for (let option of selectDestino.options) {
                            if (option.value === valoro_selectDestino) {
                                optionValue_selectDestino = option.value; // asignar el value correspondiente
                                break;
                            }
                        }

                        // Si encontramos la opción, seleccionarla con Select2
                        if (optionValue_selectDestino) {
                            $("#selectDestino")
                                .val(optionValue_selectDestino)
                                .trigger("change");
                        }

                        document.getElementById(`ajuste_id`).value = AjusteId;
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text:
                                data.message || "No se pudo procesar la solicitud de anulación.",
                        });
                    }
                } catch (error) {
                    console.error("Error en la solicitud:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Ocurrió un problema en el servidor. Intente nuevamente.",
                    });
                }
            }
        });

        document.addEventListener("change", async (e) => {
            if (e.target.matches(`#total_servicio_especial`)) {
                const valor = limpiarNumero(e.target.value || "0");
                document.getElementById("total_servicio_especial").value =
                    formatCOP(valor);
                let TotalInstruccion = limpiarNumero(
                    document.getElementById("total_instruccion").value || "0",
                );
                let TotalServicioEspecial = valor;

                let TotalFacturacion = TotalInstruccion + TotalServicioEspecial;
                document.getElementById("total_facturacion").value =
                    formatCOP(TotalFacturacion);
            }
        });
    };

    async function Listar_Remesas_General() {
        const loader = document.querySelector(".img_load");
        if (loader) loader.style.display = "table-row";
        let tbody = document.getElementById("tbody_remesas_general");
        tbody.innerHTML = "";
        try {
            const response = await fetch(
                $("#base_url").val() + "serviciocliente/Listar_Remesas_Clientes",
                {
                    method: "POST",
                    // body: formdata,
                    cache: "no-cache",
                },
            );
            const data = await response.json();

            if (data) {
                let totalRemesas = 0;
                data.forEach((element, index) => {
                    const fila = document.createElement("tr");

                    const columnaIndiceCliente = document.createElement("td");
                    columnaIndiceCliente.innerHTML = index + 1;
                    columnaIndiceCliente.style.width = "auto";
                    columnaIndiceCliente.style.whiteSpace = "nowrap";
                    columnaIndiceCliente.style.textAlign = "center";

                    const columnaDocumentoCliente = document.createElement("td");
                    columnaDocumentoCliente.innerHTML = `<a class='text-decoration-none' href='#' id='btn-remesas-cliente' data-ClienteId='${element.cliente_id}' data-Cliente='${element.cliente_nombre}'>${element.documento}</a>`;
                    columnaDocumentoCliente.style.width = "auto";
                    columnaDocumentoCliente.style.whiteSpace = "nowrap";
                    columnaDocumentoCliente.style.textAlign = "center";

                    const columnaNombreCliente = document.createElement("td");
                    columnaNombreCliente.innerHTML = element.cliente_nombre;
                    columnaNombreCliente.style.width = "auto";
                    columnaNombreCliente.style.whiteSpace = "nowrap";
                    columnaNombreCliente.style.textAlign = "center";

                    const columnaRemesasCliente = document.createElement("td");
                    columnaRemesasCliente.innerHTML = element.total_remesas;
                    columnaRemesasCliente.style.width = "auto";
                    columnaRemesasCliente.style.whiteSpace = "nowrap";
                    columnaRemesasCliente.style.textAlign = "center";

                    // Acumular total
                    totalRemesas += Number(element.total_remesas) || 0;

                    fila.appendChild(columnaIndiceCliente);
                    fila.appendChild(columnaDocumentoCliente);
                    fila.appendChild(columnaNombreCliente);
                    fila.appendChild(columnaRemesasCliente);
                    tbody.appendChild(fila);
                });
                // Asignar el total acumulado al final
                document.getElementById("total_remesas").innerHTML = totalRemesas;
            }
        } catch (error) {
            console.error("Error en la primera solicitud:", error);
            console.log("error no inserta");
            throw error;
        } finally {
            // document.querySelector('.img_load').style.display = 'none';
            if (loader) loader.style.display = "none";
        }
    }

    function obtenerTodosLosPedidos() {
        return $(".pedido-checkbox")
            .map(function () {
                return {
                    id: $(this).val(),
                    // Si en el futuro necesitas más atributos, puedes agregarlos aquí.
                    // Por ahora solo usamos el valor
                };
            })
            .get();
    }

    function actualizarContadorCarrito() {
        let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
        if (carrito.length === 0) {
            // Deseleccionar todos los checkboxes de pedidos
            $(".pedido-checkbox").prop("checked", false);
            $("#selectAll").prop("checked", false);

            // Quitar resaltado de todas las filas
            $(".pedido-checkbox").each(function () {
                let rowId = $(this).data("row");
                let row = document.getElementById(rowId);
                if (row) row.style.backgroundColor = "";
            });
        }
    }

    // Formatea en COP
    window.formatCOP = (value) => {
        return value.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
        });
    };

    // Calcula el total de los seleccionados
    window.actualizarTotalSeleccionado = () => {
        const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

        // Sumar totales desde el sessionStorage, no desde el DOM 👈 Clave del fix
        let totalRemesas = carrito.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0);

        document.getElementById("total_instruccion").value = formatCOP(totalRemesas);

        const valorServicio =
            parseFloat(
                limpiarNumero(document.getElementById("total_servicio_especial").value) || "0",
            ) || 0;

        const totalFinal = totalRemesas + valorServicio;
        document.getElementById("total_facturacion").value = formatCOP(totalFinal);
    };

    // Agrega esto al final de tu archivo JavaScript o en tu CSS
    window.style = document.createElement("style");
    style.textContent = `.selected-row {
            background-color: #d8ddf9 !important;
            /*box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);*/
        }
    `;
    document.head.appendChild(style);

    async function Listar_Remesas_Cliente(ClienteId, Dato) {
        const loader = document.querySelector(".img_loading");
        if (loader) loader.style.display = "table-row";

        let formdata = new FormData();
        formdata.append("ClienteId", ClienteId);
        formdata.append("Dato", Dato);
        const tableId = "#table1";
        try {
            const response = await fetch(
                $("#base_url").val() + "serviciocliente/Remesas_Cliente",
                {
                    method: "POST",
                    body: formdata,
                    cache: "no-cache",
                },
            );
            const data = await response.json();

            if (data) {
                let checkbox_carrito = "";

                let tbody = document.getElementById("tbody_remesa_cliente");
                let perfil_aprobar = document.getElementById(`perfil_id`).value;
                tbody.innerHTML = "";
                data.forEach((element) => {
                    const valor = numberFromDecimal(element.Total_Remesa);
                    const valorTarifa = numberFromDecimal(element.valor_tarifa);

                    const fila = document.createElement("tr");

                    if (element.estado_ajuste === "Pendiente" && element.remesa_id) {
                        checkbox_carrito = ``;
                    } else {
                        checkbox_carrito = `
                        <input class="form-check-input pedido-checkbox" id="check_pedido_${element.numdoc_remesa}" data-total-remesa="${valorTarifa ? valorTarifa : valor}"
                         type="checkbox" value="${element.numdoc_remesa}" style="scale: 1.2;" data-row="fila_${element.numdoc_remesa}">
                        `;
                    }

                    const columnaCheckRemesa = document.createElement("td");
                    columnaCheckRemesa.innerHTML = checkbox_carrito;
                    columnaCheckRemesa.style.width = "auto";
                    columnaCheckRemesa.style.whiteSpace = "nowrap";
                    columnaCheckRemesa.style.textAlign = "center";

                    const columnaNundocRemesa = document.createElement("td");

                    if (element.estado_ajuste === "Pendiente" && element.remesa_id) {
                        if (perfil_aprobar === "1") {
                            columnaNundocRemesa.innerHTML = `
                            <div class="dropdown">
                                <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${element.numdoc_remesa}</a>
                                <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
                                    <a class="dropdown-item fw-bold" href="#" data-valorActual='${valorTarifa ? valorTarifa : valor}' data-RemesaId='${element.numdoc_remesa}' data-ClienteId='${ClienteId}' data-AjusteId='${element.ajuste_id}' data-destinatarioid="${element.destinatarioId}" id="btn_ver_ajuste" data-bs-toggle="modal" data-bs-target="#verticallyCentered">Ver Ajuste</a>
                                </div>
                            </div>
                        `;
                        } else {
                            columnaNundocRemesa.innerHTML = element.numdoc_remesa;
                        }
                    } else {
                        columnaNundocRemesa.innerHTML = `
                      <div class="dropdown">
                        <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${element.numdoc_remesa}</a>
                        <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
                          <a class="dropdown-item fw-bold" href="#" data-valorActual='${valorTarifa ? valorTarifa : valor}' data-RemesaId='${element.numdoc_remesa}' data-ClienteId='${ClienteId}' id="btn_valor_ajuste" data-bs-toggle="modal" data-bs-target="#verticallyCentered">Ajustes</a>
                          
                        </div>
                      </div>
                    `;
                    }

                    columnaNundocRemesa.style.width = "auto";
                    columnaNundocRemesa.style.whiteSpace = "nowrap";
                    columnaNundocRemesa.style.textAlign = "center";

                    const columnaFechaRemesa = document.createElement("td");
                    columnaFechaRemesa.innerHTML = element.fecha_remesa;
                    columnaFechaRemesa.style.width = "auto";
                    columnaFechaRemesa.style.whiteSpace = "nowrap";
                    columnaFechaRemesa.style.textAlign = "center";

                    const columnaSac = document.createElement("td");
                    columnaSac.innerHTML = element.Comercial;
                    columnaSac.style.width = "auto";
                    columnaSac.style.whiteSpace = "nowrap";
                    columnaSac.style.textAlign = "center";

                    const columnaClienteRemesa = document.createElement("td");
                    columnaClienteRemesa.innerHTML = element.Cliente;
                    columnaClienteRemesa.style.width = "auto";
                    columnaClienteRemesa.style.whiteSpace = "nowrap";
                    columnaClienteRemesa.style.textAlign = "center";

                    const columnaPlacaRemesa = document.createElement("td");
                    columnaPlacaRemesa.innerHTML = element.placa;
                    columnaPlacaRemesa.style.width = "auto";
                    columnaPlacaRemesa.style.whiteSpace = "nowrap";
                    columnaPlacaRemesa.style.textAlign = "center";

                    const columnaMercanciaRemesa = document.createElement("td");
                    columnaMercanciaRemesa.innerHTML = element.nombre;
                    columnaMercanciaRemesa.style.width = "auto";
                    columnaMercanciaRemesa.style.whiteSpace = "nowrap";
                    columnaMercanciaRemesa.style.textAlign = "center";

                    const columnaAgenciaRemesa = document.createElement("td");
                    columnaAgenciaRemesa.innerHTML = element.Lugar;
                    columnaAgenciaRemesa.style.width = "auto";
                    columnaAgenciaRemesa.style.whiteSpace = "nowrap";
                    columnaAgenciaRemesa.style.textAlign = "center";

                    const columnaOrigenRemesa = document.createElement("td");
                    columnaOrigenRemesa.innerHTML = element.Origen;

                    if (element.origen_ajuste && element.estado_ajuste === "Pendiente") {
                        columnaOrigenRemesa.style.backgroundColor = "#ff4e33ff";
                        columnaOrigenRemesa.style.color = "#ffffff";
                        columnaOrigenRemesa.style.fontWeight = "bold";
                    }

                    columnaOrigenRemesa.style.width = "auto";
                    columnaOrigenRemesa.style.whiteSpace = "nowrap";
                    columnaOrigenRemesa.style.textAlign = "center";

                    const columnaDestinoRemesa = document.createElement("td");
                    columnaDestinoRemesa.innerHTML = element.Destino;

                    if (element.destino_ajuste && element.estado_ajuste === "Pendiente") {
                        columnaDestinoRemesa.style.backgroundColor = "#ff4e33ff";
                        columnaDestinoRemesa.style.color = "#ffffff";
                        columnaDestinoRemesa.style.fontWeight = "bold";
                    }

                    columnaDestinoRemesa.style.width = "auto";
                    columnaDestinoRemesa.style.whiteSpace = "nowrap";
                    columnaDestinoRemesa.style.textAlign = "center";

                    const columnaTotalRemesa = document.createElement("td");
                    columnaTotalRemesa.innerHTML =
                        element.valor_tarifa === null
                            ? formatCOP(valor, 1)
                            : formatCOP(valorTarifa, 1);

                    if (element.valor_ajuste && element.estado_ajuste === "Pendiente") {
                        columnaTotalRemesa.style.backgroundColor = "#ff4e33ff";
                        columnaTotalRemesa.style.color = "#ffffff";
                        columnaTotalRemesa.style.fontWeight = "bold";
                    }

                    columnaTotalRemesa.style.width = "auto";
                    columnaTotalRemesa.style.whiteSpace = "nowrap";
                    columnaTotalRemesa.style.textAlign = "center";

                    const columnaObservacionRemesas = document.createElement("td");
                    columnaObservacionRemesas.innerHTML = element.Observacion;
                    columnaObservacionRemesas.style.width = "auto";
                    columnaObservacionRemesas.style.whiteSpace = "nowrap";
                    columnaObservacionRemesas.style.textAlign = "center";

                    // Campo para el ajuste de los valores de la remesas
                    // const columnaAjusteRemesa = document.createElement('td');
                    // columnaAjusteRemesa.innerHTML = `
                    //     <div class="mb-0">
                    //         <input class="form-control form-control-sm w-100 ajute_valor_remesa" id="valor_ajuste_${element.numdoc_remesa}" data-valor_actual='${valor}' type="text" placeholder="$ 0.00">
                    //     </div>
                    // `;
                    // columnaAjusteRemesa.style.width = '200px';
                    // columnaAjusteRemesa.style.whiteSpace = 'nowrap';
                    // columnaAjusteRemesa.style.textAlign = 'center';

                    fila.appendChild(columnaCheckRemesa);
                    fila.appendChild(columnaNundocRemesa);
                    fila.appendChild(columnaPlacaRemesa);
                    fila.appendChild(columnaFechaRemesa);
                    fila.appendChild(columnaTotalRemesa);
                    // fila.appendChild(columnaAjusteRemesa);
                    fila.appendChild(columnaSac);
                    fila.appendChild(columnaClienteRemesa);
                    fila.appendChild(columnaMercanciaRemesa);
                    // fila.appendChild(columnaTipoRemesa);
                    fila.appendChild(columnaAgenciaRemesa);
                    fila.appendChild(columnaOrigenRemesa);
                    fila.appendChild(columnaDestinoRemesa);
                    fila.appendChild(columnaObservacionRemesas);
                    tbody.appendChild(fila);
                    document
                        .getElementById("btn_guardar_instruccion")
                        .setAttribute("data-NombreCliente", element.Cliente);
                });
            }
        } catch (error) {
            console.error("Error en la primera solicitud:", error);
            console.log("error no inserta");
            throw error;
        } finally {
            // document.querySelector('.img_load').style.display = 'none';
            if (loader) loader.style.display = "none";
        }
        inicializarDataTable(tableId);

        // Restaurar checkboxes seleccionados desde sessionStorage
        const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
        const idsEnCarrito = carrito.map(item => item.id);

        $(".pedido-checkbox").each(function () {
            const id = $(this).val();
            if (idsEnCarrito.includes(id)) {
                $(this).prop("checked", true);
                const rowId = $(this).data("row");
                const row = document.getElementById(rowId);
                if (row) row.style.backgroundColor = "#d8ddf9";
            }
        });

        actualizarTotalSeleccionado();
    }

    function numberFromDecimal(value) {
        if (value === null || value === undefined || value === "") {
            return 0;
        }
        return Number(value);
    }

    function formatCOP(value, decimals = 1) {
        return Number(value).toLocaleString("es-CO", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    }

    function limpiarNumero(valor) {
        return (
            parseFloat(
                valor
                    .replace(/\$/g, "") // Eliminar símbolo $
                    .replace(/\./g, "") // Eliminar puntos de miles
                    .replace(",", "."), // Cambiar coma por punto decimal
            ) || 0
        );
    }

    function procesarAjuste(remesaId, valorActualRaw, inputEl) {
        const mensaje = document.getElementById("mensajeAprobacion");
        let original = parseNumber(valorActualRaw);
        let ingresado = parseNumber(inputEl.value);

        if (original === 0) {
            console.warn("Valor original es 0, evitar división por cero");
            return;
        }

        const diferencia = ((ingresado - original) / original) * 100;
        const absDif = Math.abs(diferencia);

        if (absDif > 2) {
            // requiere aprobacion
            mensaje.style.display = "block";
            // aqui puedes enviar al back con fetch() o abrir modal de aprobacion
            console.log(
                "Enviar a aprobacion -> remesa:",
                remesaId,
                "dif %:",
                diferencia,
            );
        } else {
            mensaje.style.display = "none";
            console.log("Dentro del 2% -> guardar normal");
            // Lógica de guardado (ej. fetch POST)
        }
    }

    // utilidades
    function parseNumber(value) {
        if (typeof value === "number") return value;
        if (!value) return 0;
        // quitar símbolos y puntos (ajusta según formato)
        const cleaned = String(value)
            .replace(/[^0-9\-.,]/g, "")
            .replace(/\./g, "")
            .replace(/,/g, ".");
        const n = parseFloat(cleaned);
        return isNaN(n) ? 0 : n;
    }

    function formatMoney(value) {
        let v = parseNumber(value);
        return v.toLocaleString("es-CO", { style: "currency", currency: "COP" });
    }

    function currencyMask2(ele) {
        let elemento = $(ele);
        let valor = elemento.val();

        // Quitar todo lo que no sea número
        valor = valor.replace(/[^\d]/g, "");

        if (valor === "") {
            elemento.val("");
            return;
        }

        // Convertir a número
        let numero = parseFloat(valor);

        // Formatear en pesos colombianos con dos decimales
        let formateado = numero.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 2,
        });

        elemento.val(formateado);
    }

    async function Municipios() {
        try {
            const response = await fetch(
                $("#base_url").val() + "serviciocliente/Consulta_Municipios",
                {
                    method: "POST",
                    cache: "no-cache",
                },
            );

            const data = await response.json();

            // 👉 guardar en memoria global para reutilizar
            window.municipiosData = data;

            // 👉 recorrer todos los selects
            $(".municipio-select").each(function () {
                const $select = $(this);
                $select
                    .empty()
                    .append('<option value="">Seleccione un municipio</option>');

                data.forEach(function (element) {
                    $select.append(
                        `<option value="${element.municipio} - ${element.depto}" 
                             data-municipio="${element.municipio}" 
                             data-depto="${element.depto}">
                             ${element.municipio} - ${element.depto}
                     </option>`,
                    );

                    // $select.append(
                    //     `<option value="${element.id}"
                    //              data-municipio="${element.municipio}"
                    //              data-depto="${element.depto}">
                    //              ${element.municipio} - ${element.depto}
                    //      </option>`
                    // );

                    // $select.append(
                    //     `<option value="${element.rndc_codigo_ciudad}"
                    //              data-municipio="${element.municipio}"
                    //              data-depto="${element.depto}">
                    //              ${element.municipio} - ${element.depto}
                    //      </option>`
                    // );
                });

                // reinicializar select2 dentro del modal
                $select.select2({
                    placeholder: "Seleccione un municipio",
                    allowClear: true,
                    width: "100%",
                    dropdownParent: $("#verticallyCentered"), // 👈 forzar que se pinte dentro del modal
                });
            });
        } catch (error) {
            console.error("Error en Municipios:", error);
            throw error;
        }
    }

    function inicializarDataTable(id) {
        const $tabla = $(id);

        // 1. Limpieza absoluta antes de empezar
        if ($.fn.DataTable.isDataTable(id)) {
            $tabla.DataTable().destroy();
        }
        $tabla.find("thead tr.filters").remove();

        // 2. Crear la fila de filtros clonando el header original
        const $headerRow = $tabla.find("thead tr:first");
        const $filterRow = $headerRow.clone(true).addClass("filters");
        $filterRow.appendTo($tabla.find("thead"));

        // 3. Inicializar DataTable
        window.tablaTarifas = $tabla.api = $tabla.DataTable({
            orderCellsTop: true,
            fixedHeader: true,
            destroy: true,
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
            },
            initComplete: function () {
                const api = this.api();

                // Usamos el API de datatables para recorrer las columnas de forma segura
                api
                    .columns()
                    .eq(0)
                    .each(function (colIdx) {
                        // Seleccionamos la celda de filtro usando el contexto de la tabla actual
                        // Esto evita el error de "reading property cell"
                        const cell = $tabla.find(".filters th").get(colIdx);

                        if (!cell) return; // Salvaguarda: si la celda no existe, saltar

                        const title = $(api.column(colIdx).header()).text();

                        // Columna 0 (ID/Número) se deja limpia
                        if (colIdx === 0) {
                            $(cell).html("");
                            return;
                        }

                        // Inyectamos el input
                        // $(cell).html(`<input type="text" class="form-control form-control-sm w-100" placeholder="${title}" style="font-size: 11px;"/>`);
                        $(cell).html(
                            `<input type="text" class="w-100" placeholder="${title}" style="font-size: 11px;height:24px;"/>`,
                        );

                        // Eventos de filtrado optimizados
                        $("input", cell).on("keyup change", function (e) {
                            e.stopPropagation(); // Evita que el click en el input active el ordenamiento de la columna
                            if (api.column(colIdx).search() !== this.value) {
                                api.column(colIdx).search(this.value).draw();
                            }
                        });
                    });
            },
        });
    }

    // ============================================================
    //  CLIENTE API — maneja token automáticamente
    // ============================================================
    const DsnubeApi = {
        TOKEN_KEY: 'dsnube_api_token',
        BASE_URL: document.getElementById('url_api_dsnube').value,
        API_KEY: 'nexos_dsnube_2026*',

        getToken() {
            return localStorage.getItem(this.TOKEN_KEY);
        },

        saveToken(token) {
            if (token) localStorage.setItem(this.TOKEN_KEY, token);
        },

        clearToken() {
            localStorage.removeItem(this.TOKEN_KEY);
        },

        async login() {
            const response = await fetch(this.BASE_URL + 'login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': this.API_KEY,
                },
                body: JSON.stringify({
                    username: 'dsnube_api',   // lo pones en tu blade como variable global
                    password: 'Traveck2025*',
                }),
            });

            const data = await response.json();

            if (!data.success) throw new Error('Login DsNube fallido');

            this.saveToken(data.token);
            return data.token;
        },

        // ✅ Fetch inteligente: reintenta una vez si el token expiró
        async fetch(endpoint, options = {}) {
            const doRequest = async (token) => {
                const response = await fetch(this.BASE_URL + endpoint, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-KEY': this.API_KEY,
                        'Authorization': `Bearer ${token}`,
                        ...(options.headers ?? {}),
                    },
                });

                // Si Laravel devuelve un token renovado, guardarlo
                const newToken = response.headers.get('X-New-Token');
                if (newToken) this.saveToken(newToken);

                return response;
            };

            let token = this.getToken();

            // Sin token: hacer login primero
            if (!token) token = await this.login();

            let response = await doRequest(token);

            // Token expirado: login y reintentar UNA vez
            if (response.status === 401) {
                this.clearToken();
                token = await this.login();
                response = await doRequest(token);
            }

            return response;
        }
    };

    async function EnviarInstruccionFacturacion(instruccionId) {
        $('#loading-overlay-dsnube').css('display', 'flex');

        const payload = { instruccion_id: instruccionId };
        const url = document.getElementById('url_api_dsnube').value;
        try {
            const response = await DsnubeApi.fetch('crear-instruccion-facturacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': 'nexos_dsnube_2026*',
                },
                body: JSON.stringify(payload),
            });

            const resultado = await response.json();

            if (!resultado.success) {
                Swal.fire({
                    title: '📘 Resumen General de Procesos',
                    html: `
                ❌ Error al transmitir a DsNube:<br>
                ${resultado.message ?? ''}<br>
                <small>${resultado.error ?? ''}</small>`,
                    icon: 'error',
                    // width: '50%',
                    confirmButtonText: 'Entendido',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            } else {
                Swal.fire({
                    title: '📘 Resumen General de Procesos',
                    html: `✅ Instruccion transmitida correctamente a DsNube, <br> <small>${resultado.instruccion ?? ''}</small> .`,
                    icon: 'success',
                    // width: '50%',
                    confirmButtonText: 'Entendido',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            }

        } catch (error) {
            Swal.fire({
                title: '📘 Resumen General de Procesos',
                html: `❌ Error inesperado conectando a DsNube: ${error}`,
                icon: 'error',
                // width: '50%',
                confirmButtonText: 'Entendido',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
        } finally {
            $('#loading-overlay-dsnube').css('display', 'none');
        }
    }

    // ============================================================
    //  EXPOSICIÓN GLOBAL — funciones accesibles desde HTML o contextos externos
    // ============================================================
    window.Listar_Remesas_General = Listar_Remesas_General;
    window.Listar_Remesas_Cliente = Listar_Remesas_Cliente;
    window.EnviarInstruccionFacturacion = EnviarInstruccionFacturacion;
})();