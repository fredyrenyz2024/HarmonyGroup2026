(function () {
    "use strict";

    window.VENTANA = null; // Variable global para almacenar el ID

    // Definir la función initScript globalmente
    window.initScript = function (id) {
        window.VENTANA = id; // Asigna el ID recibido a la variable global
        listar_Tarifas_cliente();
        const container = document.getElementById(`contenido_ventana-${id}`);
        // const excelDataGlobal = [];
        window.tarifasDataGlobal = [];
        window.filtroVigenciaActivo = null;

        if (container) {
            // Removemos cualquier evento previo en este contenedor específico
            // (Aunque al usar innerHTML = '' el WindowManager suele limpiar esto, es buena práctica)

            container.onclick = async function (e) {
                if (e.target.matches(`#btn_guardar_tarifa`) || e.target.matches(`#btn_guardar_tarifa *`)) {
                    let Boton = e.target.closest(`#btn_guardar_tarifa`);
                    let TarifaId = Boton.getAttribute(`data-tarifa_id`);
                    const isUpdate = !!TarifaId;

                    if (!validarCamposBase()) {
                        Swal.fire({
                            icon: "warning",
                            title: "Campos incompletos",
                            text: "Debe completar los campos obligatorios",
                        });
                        return;
                    }

                    if (switchConfig.checked) {
                        if (!validarConfiguracionAvanzada()) {
                            Swal.fire({
                                icon: "warning",
                                title: "Configuración incompleta",
                                text: "Debe completar la configuración del módulo activo",
                            });
                            return;
                        }
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | 1️⃣ ARMAR DATA BASE
                    |--------------------------------------------------------------------------
                    */

                    //console.log(document.getElementById("ssn_nombre").value);
                    const data = {
                        cliente: document.getElementById("cliente_instruccion").value,
                        origen: document.getElementById("origen_tarifa").value,
                        destino: document.getElementById("destino_tarifa").value,
                        tipo_vehiculo: document.getElementById("slct_tipo_vehiculo_").value,
                        tarifa_venta: document.getElementById("tarifa-venta").value,
                        estado: document.getElementById("estado-tarifa-venta").value,
                        fecha_inicio: document.getElementById("fecha-inicio-venta").value,
                        fecha_fin: document.getElementById("fecha-fin-venta").value,
                        usuario: document.getElementById("ssn_nombre").value,
                        configuracion_extra: switchConfig.checked,
                        configuracion: {
                            multi_recogida: {
                                tarifa_adicional:
                                    document.getElementById("js-extra-venta-origen")?.value ||
                                    null,
                            },
                            multi_entrega: {
                                tarifa_adicional:
                                    document.getElementById("js-extra-venta-destino")?.value ||
                                    null,
                            },
                            multi_origen: [],
                            multi_destino: [],
                        },
                    };

                    // Multi Origen
                    document
                        .querySelectorAll("#multiorigen-container .extra-origin-item")
                        .forEach((item) => {
                            data.configuracion.multi_origen.push({
                                origen_id:
                                    item.querySelector(".js-extra-origin")?.value || null,
                                rate_1:
                                    limpiarMoneda(
                                        item.querySelector(".js-extra-rate-1")?.value,
                                    ) || 0,
                                rate_2:
                                    limpiarMoneda(
                                        item.querySelector(".js-extra-rate-2")?.value,
                                    ) || 0,
                            });
                        });

                    // Multi Destino
                    document
                        .querySelectorAll("#multidestino-container .extra-destination-item")
                        .forEach((item) => {
                            data.configuracion.multi_destino.push({
                                destino_id:
                                    item.querySelector(".js-extra-destination")?.value || null,
                                rate_1:
                                    limpiarMoneda(
                                        item.querySelector(".js-extra-destination-rate-1")?.value,
                                    ) || 0,
                                rate_2:
                                    limpiarMoneda(
                                        item.querySelector(".js-extra-destination-rate-2")?.value,
                                    ) || 0,
                            });
                        });

                    /*
                    |--------------------------------------------------------------------------
                    | 2️⃣ CONSTRUIR PAYLOAD SEGÚN TIPO
                    |--------------------------------------------------------------------------
                    */

                    let payload = {};

                    if (isUpdate) {
                        // ✏️ UPDATE → SOLO CAMPOS EDITABLES
                        payload = {
                            plena: limpiarMoneda(data.tarifa_venta),
                            multi_recogida: limpiarMoneda(
                                data.configuracion.multi_recogida.tarifa_adicional,
                            ),
                            multi_entrega: limpiarMoneda(
                                data.configuracion.multi_entrega.tarifa_adicional,
                            ),
                            extras: {
                                multi_origen: data.configuracion.multi_origen,
                                multi_destino: data.configuracion.multi_destino,
                            },
                            usuario: document.getElementById("ssn_nombre").value || "sistema",
                        };
                    } else {
                        // 🆕 CREATE → TODOS LOS CAMPOS
                        payload = buildTarifaApiPayload(data);
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | 3️⃣ LLAMADA API
                    |--------------------------------------------------------------------------
                    */

                    try {
                        const baseUrl = $("#base_url_api").val();

                        if (!baseUrl) {
                            console.error("Base URL API no definida");
                            return;
                        }

                        const url = isUpdate
                            ? `${baseUrl}tarifas/${TarifaId}`
                            : `${baseUrl}tarifas`;

                        const method = isUpdate ? "PUT" : "POST";

                        const result = await apiFetch(url, {
                            method: method,
                            data: payload,
                        });

                        /*
                        |--------------------------------------------------------------------------
                        | 4️⃣ RESPUESTA
                        |--------------------------------------------------------------------------
                        */

                        if (result?.success) {
                            const requiere = !!result.requiere_aprobacion;

                            let titulo = "";
                            let mensaje = "";

                            if (isUpdate) {
                                if (requiere) {
                                    titulo = "Actualización enviada a aprobación";
                                    mensaje =
                                        "La tarifa supera el umbral permitido y quedó pendiente. La tarifa activa actual no fue modificada.";
                                } else {
                                    titulo = "Tarifa actualizada correctamente";
                                    mensaje =
                                        "La nueva versión fue activada y reemplazó la anterior.";
                                }
                            } else {
                                if (requiere) {
                                    titulo = "Tarifa creada (Pendiente de aprobación)";
                                    mensaje =
                                        "La tarifa fue creada pero requiere aprobación antes de activarse.";
                                } else {
                                    titulo = "Tarifa creada correctamente";
                                    mensaje = "La tarifa fue creada y activada correctamente.";
                                }
                            }

                            await Swal.fire({
                                icon: "success",
                                title: titulo,
                                text: mensaje,
                            });

                            /*
                            |--------------------------------------------------------------------------
                            | 5️⃣ RESET FORMULARIO
                            |--------------------------------------------------------------------------
                            */

                            document
                                .getElementById("btn_guardar_tarifa")
                                .removeAttribute("data-tarifa_id");

                            document.getElementById("tarifa-venta").value = "";
                            document.getElementById("js-extra-venta-origen").value = "";
                            document.getElementById("js-extra-venta-destino").value = "";
                            document.getElementById("multiorigen-container").innerHTML = "";
                            document.getElementById("multidestino-container").innerHTML = "";

                            habilitarCamposVenta();
                            document.querySelector(".text-primary-custom").textContent =
                                "Nueva Tarifa Venta";

                            // Recargar ventana
                            const anchor = document.querySelector(
                                `#myTab a[data-id="${window.VENTANA}"]`,
                            );

                            if (anchor) {
                                WindowManager.cargarContenidoVentana(anchor);
                            } else {
                                window.location.reload();
                            }
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: result?.message || "No se pudo procesar la tarifa",
                            });
                        }
                    } catch (err) {
                        console.error(err);

                        if (err.status === 422) {
                            const errors = err.payload?.errors || {};
                            const first = Object.values(errors)?.[0]?.[0] || err.message;

                            Swal.fire({
                                icon: "warning",
                                title: "Validación",
                                text: first,
                            });
                            return;
                        }

                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: err.message || "Error de conexión",
                        });
                    }
                }

                if (e.target.matches(`.btn_detalle_tarifa`) || e.target.matches(`.btn_detalle_tarifa *`)) {
                    let Boton = e.target.closest(`.btn_detalle_tarifa`);
                    let TarifaId = Boton.getAttribute(`data-tarifa_id`);

                    verDetalleInforme(TarifaId);
                }

                if (e.target.matches(`.btn_editar_tarifa`) || e.target.matches(`.btn_editar_tarifa *`)) {
                    let Boton = e.target.closest(`.btn_editar_tarifa`);
                    let TarifaId = Boton.getAttribute(`data-tarifa_id`);
                    const empresaId = document.getElementById("empresa_id")?.value || "";

                    try {
                        const response = await fetch(
                            $("#base_url_api").val() + `tarifas/${TarifaId}`,
                            {
                                method: "GET",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                    "X-API-KEY": "nexos_nacional2026@*",
                                },
                            },
                        );

                        const result = await response.json();

                        if (result.data) {
                            bloquearCamposNoEditablesVenta();

                            // Cambiar título
                            document.querySelector(".text-primary-custom").textContent =
                                "Editar Tarifa Venta";
                            // --- LLENADO DE CAMPOS FIJOS ---
                            const fields = {
                                cliente_instruccion: result.data.cliente_id,
                                origen_tarifa: result.data.origen,
                                destino_tarifa: result.data.destino,
                                slct_tipo_vehiculo_: result.data.tipo_vehiculo,
                            };

                            for (let [id, val] of Object.entries(fields)) {
                                const el = document.getElementById(id);
                                if (el && el.tomselect) el.tomselect.addItem(String(val));
                            }

                            document.getElementById(`tarifa-venta`).value = Number(
                                result.data.tarifa,
                            ).toLocaleString("es-CO", {
                                style: "currency",
                                currency: "COP",
                            });

                            document.getElementById(`fecha-inicio-venta`).value =
                                result.data.fecha_inicio.split("T")[0];
                            document.getElementById(`fecha-fin-venta`).value =
                                result.data.fecha_fin.split("T")[0];
                            document.getElementById(`estado-tarifa-venta`).value =
                                result.data.estado_tarifa;

                            // --- CONFIGURACIÓN EXTRA ---
                            const switchConfig = document.getElementById(
                                "switch-config-extra-venta",
                            );
                            const tabsContainer = document.querySelector(
                                ".custom-tabs-container-venta",
                            );

                            // Resetear contenedores
                            document.getElementById("multiorigen-container").innerHTML = "";
                            document.getElementById("multidestino-container").innerHTML = "";

                            if (
                                result.data.configuracion_extra === "true" ||
                                result.data.configuracion_extra === true
                            ) {
                                switchConfig.checked = true;
                                if (tabsContainer) tabsContainer.style.display = "";
                            } else {
                                switchConfig.checked = false;
                                if (tabsContainer) tabsContainer.style.display = "none";
                            }

                            const componentes = result.data.componentes || [];

                            componentes.forEach((componente) => {
                                switch (componente.tipo) {
                                    case "PLENA":
                                        // si quieres validar coherencia
                                        console.log("Tarifa Plena:", componente.valor);
                                        break;

                                    case "MULTI_RECOGIDA":
                                        document.getElementById("js-extra-venta-origen").value =
                                            formatCOP(componente.valor);
                                        break;

                                    case "MULTI_ENTREGA":
                                        document.getElementById("js-extra-venta-destino").value =
                                            formatCOP(componente.valor);
                                        break;

                                    case "MULTI_ORIGEN":
                                        renderMultiOrigen(componente.detalles);
                                        break;

                                    case "MULTI_DESTINO":
                                        renderMultiDestino(componente.detalles);
                                        break;
                                }
                            });

                            await MunicipiosTarifasExtras();

                            // Ahora sí seteamos valores
                            document
                                .querySelectorAll(".js-extra-origin")
                                .forEach((select) => {
                                    const value = select.dataset.selected;
                                    if (select.tomselect && value) {
                                        select.tomselect.setValue(String(value));
                                    }
                                });

                            document
                                .querySelectorAll(".js-extra-destination")
                                .forEach((select) => {
                                    const value = select.dataset.selected;
                                    if (select.tomselect && value) {
                                        select.tomselect.setValue(String(value));
                                    }
                                });
                        }
                        // COLCOAR EL ID DE LA TARIFCA QUE SE VA AE DITAR
                        document
                            .getElementById("btn_guardar_tarifa")
                            .setAttribute("data-tarifa_id", TarifaId);


                        const responseHist = await fetch(
                            $("#base_url_api").val() + `tarifas/historico?cliente_id=${result.data.cliente_id}&origen=${result.data.origen}&destino=${result.data.destino}&tipo_vehiculo=${result.data.tipo_vehiculo}&empresa_id=${empresaId}`,
                            // $("#base_url_api").val() + `tarifas/historico`,
                            {
                                method: "GET",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                    "X-API-KEY": "nexos_nacional2026@*",
                                },
                            }
                        );

                        const resultHist = await responseHist.json();
                        renderHistoricoTarifas(resultHist.data);

                    } catch (error) {
                        console.error("❌ Error:", error);
                        Swal.fire("Error", "No se pudieron cargar las tarifas", "error");
                    }
                }

                if (e.target.matches("#btn_inactivar_tarifa") || e.target.matches("#btn_inactivar_tarifa *")) {
                    const Boton = e.target.closest("#btn_inactivar_tarifa");
                    const TarifaId = Boton.getAttribute("data-tarifa_id");

                    Swal.fire({
                        title: "¿Inactivar tarifa?",
                        text: "Esta acción inactivará la tarifa seleccionada.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sí, inactivar",
                        cancelButtonText: "Cancelar",
                        reverseButtons: true, // Pone "Cancelar" a la izquierda
                        focusCancel: true, // Enfocar cancelar por seguridad
                    }).then(async (result) => {
                        if (!result.isConfirmed) return;

                        // Opcional: deshabilitar el botón para evitar doble clic
                        Boton.disabled = true;

                        try {
                            const response = await fetch(
                                $("#base_url_api").val() + `tarifas/inactivarTarifa/${TarifaId}`,
                                {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json", "X-API-KEY": "nexos_nacional2026@*" },
                                    body: JSON.stringify({ TarifaId }),
                                },
                            );

                            if (!response.ok) {
                                throw new Error(`HTTP ${response.status}`);
                            }

                            const result = await response.json();

                            if (result) {
                                await Swal.fire({
                                    icon: "success",
                                    title: "Éxito",
                                    text: "Tarifa inactivada correctamente",
                                    timer: 2000,
                                    showConfirmButton: false,
                                });
                                // 📋 Refrescar listado
                                listar_Tarifas_cliente();
                            } else {
                                // Maneja caso de respuesta válida pero sin éxito lógico
                                Swal.fire({
                                    icon: "info",
                                    title: "No se pudo inactivar",
                                    text: "El servidor no confirmó la inactivación.",
                                });
                            }
                        } catch (error) {
                            console.error("Error en la petición:", error);
                            Swal.fire({
                                icon: "error",
                                title: "Error de conexión",
                                text: "No se pudo conectar con el servidor",
                            });
                        } finally {
                            Boton.disabled = false;
                        }
                    });
                }

                if (e.target.matches("#btn_activar_tarifa") || e.target.matches("#btn_activar_tarifa *")) {
                    const Boton = e.target.closest("#btn_activar_tarifa");
                    const TarifaId = Boton.getAttribute("data-tarifa_id");

                    Swal.fire({
                        title: "¿Activar tarifa?",
                        text: "Esta acción activará la tarifa seleccionada.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sí, activar",
                        cancelButtonText: "Cancelar",
                        reverseButtons: true, // "Cancelar" a la izquierda
                        focusCancel: true, // Enfocar "Cancelar" por seguridad
                    }).then(async (result) => {
                        if (!result.isConfirmed) return;

                        // Evitar dobles clics
                        Boton.disabled = true;

                        try {
                            const response = await fetch(
                                // $("#base_url").val() + "parametros/Activar_tarifa_venta",
                                $("#base_url_api").val() + `tarifas/activarTarifa/${TarifaId}`,
                                {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json", "X-API-KEY": "nexos_nacional2026@*" },
                                    body: JSON.stringify({ TarifaId }),
                                },
                            );

                            if (!response.ok) {
                                throw new Error(`HTTP ${response.status}`);
                            }

                            const result = await response.json();

                            if (result) {
                                await Swal.fire({
                                    icon: "success",
                                    title: "Éxito",
                                    text: "Tarifa activada correctamente",
                                    timer: 2000,
                                    showConfirmButton: false,
                                });
                                // 📋 Refrescar listado
                                listar_Tarifas_cliente();
                            } else {
                                Swal.fire({
                                    icon: "info",
                                    title: "No se pudo activar",
                                    text: "El servidor no confirmó la activación.",
                                });
                            }
                        } catch (error) {
                            console.error("Error en la petición:", error);
                            Swal.fire({
                                icon: "error",
                                title: "Error de conexión",
                                text: "No se pudo conectar con el servidor",
                            });
                        } finally {
                            Boton.disabled = false;
                        }
                    });
                }

                // ==============================
                // AGREGAR NUEVO BLOQUE
                // ==============================
                if (e.target.matches("#btn-add-multiorigen") || e.target.closest("#btn-add-multiorigen")) {
                    const container = document.getElementById("multiorigen-container");

                    const nuevo = document.createElement("div");
                    nuevo.classList.add("row", "g-3", "extra-origin-item", "mb-2");

                    // nuevo.innerHTML = `
                    //     <div class="col-md-6">
                    //         <label class="form-label-sm">
                    //             Origen Adicional <span class="req">*</span>
                    //         </label>

                    //         <div class="input-group input-group-sm">
                    //             <!--<select class="form-select bg-light js-extra-origin" name="extra_origin_id[]">-->
                    //             <select class="bg-light js-extra-origin" name="extra_origin_id[]">
                    //                 <!--<option value='' selected>Seleccione Origen Adicional</option>-->
                    //             </select>

                    //             <!--<button class="btn btn-outline-secondary btn-sm" type="button">
                    //                 <i class="bi bi-plus"></i>
                    //             </button>-->
                    //         </div>
                    //     </div>

                    //     <div class="col-md-3">
                    //         <label class="form-label-sm">Tarifa Adicional 1</label>
                    //         <div class="input-group input-group-sm">
                    //             <span class="input-group-text">$</span>
                    //             <input  type="text" class="form-control js-extra-rate-1" name="extra_rate_1[]" placeholder="0.00" oninput="this.value = this.value.toUpperCase();" onchange="currencyMask2(this)">
                    //         </div>
                    //     </div>

                    //     <div class="col-md-3 d-flex align-items-end">
                    //         <div class="w-100">
                    //             <label class="form-label-sm">Tarifa Adicional 2</label>
                    //             <div class="input-group input-group-sm">
                    //                 <span class="input-group-text">$</span>
                    //                 <input  type="text" class="form-control js-extra-rate-2" name="extra_rate_2[]" placeholder="0.00" oninput="this.value = this.value.toUpperCase();" onchange="currencyMask2(this)">
                    //                 <button class="btn btn-outline-danger btn-sm btn-remove-extra" type="button">
                    //                     <i class="bi bi-trash"></i>
                    //                 </button>
                    //             </div>
                    //         </div>
                    //     </div>
                    // `;

                    nuevo.innerHTML = `
                        <div class="col-md-6">
                            <label class="form-label-sm">
                                Origen Adicional <span class="req">*</span>
                            </label>
    
                            <div class="input-group input-group-sm">
                                <!--<select class="form-select bg-light js-extra-origin" name="extra_origin_id[]">-->
                                <select class="bg-light js-extra-origin" name="extra_origin_id[]">
                                    <!--<option value='' selected>Seleccione Origen Adicional</option>-->
                                </select>
    
                                <!--<button class="btn btn-outline-secondary btn-sm" type="button">
                                    <i class="bi bi-plus"></i>
                                </button>-->
                            </div>
                        </div>
    
                        <div class="col-md-3">
                            <label class="form-label-sm" data-bs-toggle="tooltip" data-bs-placement="top" title="Costo aplicado al primer punto de carga adicional ubicado en una zona geográfica o ciudad distinta al origen pactado en la ruta principal.">Tarifa Adicional 1</label>
                            <div class="input-group input-group-sm">
                                <span class="input-group-text">$</span>
                                <input  type="text" class="form-control js-extra-rate-1" name="extra_rate_1[]" placeholder="0.00" oninput="this.value = this.value.toUpperCase();" onchange="currencyMask2(this)">
                            </div>
                        </div>
    
                        <div class="col-md-3 d-flex align-items-end">
                            <div class="w-100">
                                <label class="form-label-sm" data-bs-toggle="tooltip" data-bs-placement="top" title="Tarifa aplicable a partir del segundo punto de carga y subsiguientes, realizados en ciudades o municipios diferentes al punto de origen inicial.">Tarifa Adicional 2</label>
                                <div class="input-group input-group-sm">
                                    <span class="input-group-text">$</span>
                                    <input  type="text" class="form-control js-extra-rate-2" name="extra_rate_2[]" placeholder="0.00" oninput="this.value = this.value.toUpperCase();" onchange="currencyMask2(this)">
                                    <button class="btn btn-outline-danger btn-sm btn-remove-extra" type="button">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;

                    container.appendChild(nuevo);

                    const nuevoSelect = nuevo.querySelector(".js-extra-origin");
                    await inicializarTomSelectIndividual(nuevoSelect);

                    // Si tienes función para cargar municipios destino
                    // if (typeof MunicipiosTarifasExtras === "function") {
                    //     MunicipiosTarifasExtras();
                    // }
                }

                // ==============================
                // ELIMINAR BLOQUE
                // ==============================
                if (e.target.matches(".btn-remove-extra") || e.target.closest(".btn-remove-extra")) {
                    const item = e.target.closest(".extra-origin-item");
                    if (item) item.remove();
                }

                // ==============================
                // AGREGAR MULTIDESTINO
                // ==============================
                if (e.target.matches("#btn-add-multidestino") || e.target.closest("#btn-add-multidestino")) {
                    const container = document.getElementById("multidestino-container");

                    const nuevo = document.createElement("div");
                    nuevo.classList.add("row", "g-3", "extra-destination-item", "mb-2");

                    // nuevo.innerHTML = `
                    //     <div class="col-md-6">
                    //         <label class="form-label-sm">
                    //             Destino Adicional <span class="req">*</span>
                    //         </label>

                    //         <div class="input-group input-group-sm">
                    //             <!--<select class="form-select bg-light js-extra-destination" name="extra_destination_id[]">-->
                    //             <select class="js-extra-destination" name="extra_destination_id[]">
                    //                 <!--<option value='' selected>Seleccione Destino</option>-->
                    //             </select>
                    //             <!--<button class="btn btn-outline-secondary btn-sm" type="button">
                    //                 <i class="bi bi-plus"></i>
                    //             </button>-->
                    //         </div>
                    //     </div>

                    //     <div class="col-md-3">
                    //         <label class="form-label-sm">Tarifa Adicional 1</label>
                    //         <div class="input-group input-group-sm">
                    //             <span class="input-group-text">$</span>
                    //             <input type="text" class="form-control js-extra-destination-rate-1" name="extra_destination_rate_1[]" placeholder="0.00" oninput="this.value = this.value.toUpperCase();" onchange="currencyMask2(this)">
                    //         </div>
                    //     </div>

                    //     <div class="col-md-3 d-flex align-items-end">
                    //         <div class="w-100">
                    //             <label class="form-label-sm">Tarifa Adicional 2</label>
                    //             <div class="input-group input-group-sm">
                    //                 <span class="input-group-text">$</span>
                    //                 <input type="text" class="form-control js-extra-destination-rate-2" name="extra_destination_rate_2[]" placeholder="0.00" oninput="this.value = this.value.toUpperCase();" onchange="currencyMask2(this)">

                    //                 <button class="btn btn-outline-danger btn-sm btn-remove-destination" type="button">
                    //                     <i class="bi bi-trash"></i>
                    //                 </button>
                    //             </div>
                    //         </div>
                    //     </div>
                    // `;

                    nuevo.innerHTML = `
                        <div class="col-md-6">
                            <label class="form-label-sm">
                                Destino Adicional <span class="req">*</span>
                            </label>
    
                            <div class="input-group input-group-sm">
                                <!--<select class="form-select bg-light js-extra-destination" name="extra_destination_id[]">-->
                                <select class="js-extra-destination" name="extra_destination_id[]">
                                    <!--<option value='' selected>Seleccione Destino</option>-->
                                </select>
                                <!--<button class="btn btn-outline-secondary btn-sm" type="button">
                                    <i class="bi bi-plus"></i>
                                </button>-->
                            </div>
                        </div>
    
                        <div class="col-md-3">
                            <label class="form-label-sm" data-bs-toggle="tooltip" data-bs-placement="top" title="Valor correspondiente a la primera entrega realizada en una ubicación o ciudad distinta al destino final declarado en la guía de transporte principal.">Tarifa Adicional 1</label>
                            <div class="input-group input-group-sm">
                                <span class="input-group-text">$</span>
                                <input type="text" class="form-control js-extra-destination-rate-1" name="extra_destination_rate_1[]" placeholder="0.00" oninput="this.value = this.value.toUpperCase();" onchange="currencyMask2(this)">
                            </div>
                        </div>
    
                        <div class="col-md-3 d-flex align-items-end">
                            <div class="w-100">
                                <label class="form-label-sm" data-bs-toggle="tooltip" data-bs-placement="top" title="Costo incremental aplicado a cada entrega adicional realizada a partir del segundo punto de descarga, siempre que este se encuentre fuera del perímetro urbano del destino original.">Tarifa Adicional 2</label>
                                <div class="input-group input-group-sm">
                                    <span class="input-group-text">$</span>
                                    <input type="text" class="form-control js-extra-destination-rate-2" name="extra_destination_rate_2[]" placeholder="0.00" oninput="this.value = this.value.toUpperCase();" onchange="currencyMask2(this)">
    
                                    <button class="btn btn-outline-danger btn-sm btn-remove-destination" type="button">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;

                    container.appendChild(nuevo);

                    const nuevoSelect = nuevo.querySelector(".js-extra-destination");
                    await inicializarTomSelectIndividual(nuevoSelect);
                }

                // ==============================
                // ELIMINAR MULTIDESTINO
                // ==============================
                if (e.target.matches(".btn-remove-destination") || e.target.closest(".btn-remove-destination")) {
                    const item = e.target.closest(".extra-destination-item");
                    if (item) item.remove();
                }

                if (e.target.matches(".btn-close-offcanvas") || e.target.matches(".btn-close-offcanvas *")) {
                    // 1. Buscamos el enlace (anchor) de la pestaña actual en el menú
                    // Usamos el ID de ventana que guardamos en window.VENTANA
                    const anchor = document.querySelector(
                        `#myTab a[data-id="${window.VENTANA}"]`,
                    );

                    if (anchor) {
                        // console.log("Reiniciando ventana dinámicamente...");
                        // 2. Llamamos al WindowManager para que recargue la vista
                        WindowManager.cargarContenidoVentana(anchor);
                    } else {
                        // Opción de respaldo si no encuentra el anchor
                        console.warn(
                            "No se encontró el disparador de la ventana, usando recarga suave.",
                        );
                        window.location.hash = "refrescando..."; // Un pequeño truco para forzar estado
                        window.location.reload();
                    }
                }

                const card = e.target.closest(".resumen-card");
                if (!card) return;

                const filtro = card.getAttribute("data-filtro");

                // Toggle
                if (window.filtroVigenciaActivo === filtro) {
                    window.filtroVigenciaActivo = null;
                    document
                        .querySelectorAll(".resumen-card")
                        .forEach((c) => c.classList.remove("active"));
                    renderTablaTarifas(window.tarifasDataGlobal);
                    return;
                }

                window.filtroVigenciaActivo = filtro;

                document
                    .querySelectorAll(".resumen-card")
                    .forEach((c) => c.classList.remove("active"));
                card.classList.add("active");

                const filtradas = window.tarifasDataGlobal.filter(
                    (t) => t.vigencia?.estado === filtro,
                );

                renderTablaTarifas(filtradas);
            };
        }

        Listar_Clientes();
        Municipios();
        _imvInitDragDrop(); // Importación masiva ventas — drag & drop + reset al cerrar offcanvas

        const switchConfig = document.getElementById("switch-config-extra-venta");
        const tabsContainer = document.querySelector(".custom-tabs-container-venta",);
        tabsContainer.style.display = "none";

        // Llamar la función
        inicializarVehiculos();

        switchConfig.addEventListener("change", function () {
            if (this.checked) {
                tabsContainer.style.display = "block";
            } else {
                tabsContainer.style.display = "none";
            }
        });

        document.addEventListener("input", function (e) {
            if (e.target.classList.contains("is-invalid")) {
                limpiarError(e.target);
            }
        });

        // let fecha_desde = document.getElementById("f_fecha_desde").value;
        // let fecha_hasta = document.getElementById("f_fecha_hasta").value;

        // document
        //     .getElementById("btn_filtrar_tarifas")
        //     .addEventListener("click", listar_Tarifas_cliente(fecha_desde, fecha_hasta));


        document
            .getElementById("btn_filtrar_tarifas")
            .addEventListener("click", () => {
                let fecha_desde = document.getElementById("f_fecha_desde").value;
                let fecha_hasta = document.getElementById("f_fecha_hasta").value;

                listar_Tarifas_cliente(fecha_desde, fecha_hasta);
            });

        /* ============================================================
           HELPERS LOCALES
           ============================================================ */

        /**
         * Formatea una fecha ISO a DD/MM/YYYY.
         * Acepta strings con o sin hora ("2025-03-01" y "2025-03-01T00:00:00").
         */
        function fmtFecha(val) {
            if (!val) return "";
            const s = val.toString().split("T")[0]; // quitar hora si viene
            const [y, m, d] = s.split("-");
            if (!y || !m || !d) return s;
            return `${d}/${m}/${y}`;
        }

        /**
         * Devuelve un número limpio para celdas numéricas del Excel.
         * SheetJS guarda valores numéricos reales (no strings) para que
         * Excel les aplique formato de moneda/número.
         */
        function numerico(val) {
            const n = parseFloat(val);
            return isNaN(n) ? 0 : n;
        }

        /** Etiqueta legible por tipo de componente */
        function etiquetaComponente(tipo) {
            const map = {
                PLENA: "Tarifa Plena",
                MULTI_RECOGIDA: "Multi Recogida",
                MULTI_ENTREGA: "Multi Entrega",
                MULTI_ORIGEN: "Multi Origen",
                MULTI_DESTINO: "Multi Destino",
            };
            return map[tipo] || tipo;
        }

        /**
         * Aplica estilos básicos a una hoja:
         *  - Encabezado: fondo verde oscuro, texto blanco, negrita.
         *  - Autoajuste de ancho de columnas.
         *  - Filtros automáticos en la fila de encabezado.
         */
        function estilarHoja(ws, numCols) {
            if (!ws["!ref"]) return;

            const range = XLSX.utils.decode_range(ws["!ref"]);
            const totalRows = range.e.r;

            /* ── Estilo de encabezado ─────────────────────────────── */
            const estiloHeader = {
                font: { bold: true, color: { rgb: "FFFFFF" }, name: "Arial", sz: 10 },
                fill: { fgColor: { rgb: "1A5276" }, patternType: "solid" },
                alignment: { horizontal: "center", vertical: "center", wrapText: true },
                border: {
                    top: { style: "thin", color: { rgb: "AAAAAA" } },
                    bottom: { style: "thin", color: { rgb: "AAAAAA" } },
                    left: { style: "thin", color: { rgb: "AAAAAA" } },
                    right: { style: "thin", color: { rgb: "AAAAAA" } },
                },
            };

            for (let c = 0; c < numCols; c++) {
                const addr = XLSX.utils.encode_cell({ r: 0, c });
                if (!ws[addr]) continue;
                ws[addr].s = estiloHeader;
            }

            /* ── Estilo de celdas de datos ───────────────────────── */
            const estiloMoneda = {
                numFmt: '"$"#,##0.00',
                font: { name: "Arial", sz: 9 },
                border: {
                    top: { style: "hair", color: { rgb: "DDDDDD" } },
                    bottom: { style: "hair", color: { rgb: "DDDDDD" } },
                    left: { style: "hair", color: { rgb: "DDDDDD" } },
                    right: { style: "hair", color: { rgb: "DDDDDD" } },
                },
            };
            const estiloTexto = {
                font: { name: "Arial", sz: 9 },
                border: estiloMoneda.border,
            };

            // Columnas que contienen moneda (índice 0-based).
            // Hoja Resumen: cols 10–15 | Hoja Detalle: cols 9, 13, 14, 15
            const colsMoneda = new Set([9, 10, 11, 12, 13, 14, 15]);

            for (let r = 1; r <= totalRows; r++) {
                for (let c = 0; c < numCols; c++) {
                    const addr = XLSX.utils.encode_cell({ r, c });
                    if (!ws[addr]) continue;
                    ws[addr].s = colsMoneda.has(c) ? estiloMoneda : estiloTexto;
                }
            }

            /* ── Autoajuste ancho de columnas ────────────────────── */
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            ws["!cols"] = Array.from({ length: numCols }, (_, ci) => {
                const maxLen = data.reduce((acc, row) => {
                    const cell = row[ci];
                    return Math.max(acc, cell ? cell.toString().length : 0);
                }, 10);
                return { wch: Math.min(maxLen + 4, 55) }; // máximo 55 chars
            });

            /* ── Filtros automáticos ─────────────────────────────── */
            ws["!autofilter"] = {
                ref: XLSX.utils.encode_range({
                    s: { r: 0, c: 0 },
                    e: { r: totalRows, c: numCols - 1 },
                }),
            };

            /* ── Fijar fila de encabezado (freeze pane) ──────────── */
            ws["!freeze"] = { xSplit: 0, ySplit: 1 };
        }
    };

    function animateCounter(id, value) {
        const el = document.getElementById(id);
        let start = 0;
        const duration = 300;
        const step = Math.ceil(value / (duration / 16));

        const interval = setInterval(() => {
            start += step;
            if (start >= value) {
                el.textContent = value;
                clearInterval(interval);
            } else {
                el.textContent = start;
            }
        }, 16);
    }

    // Variable global para mantener la instancia de la tabla
    window.tablaTarifas = null;
    // function actualizarResumenVigencias(data) {
    //     let vigentes = 0;
    //     let porVencer = 0;
    //     let vencidas = 0;
    //     let inactivas = 0;
    //     let por_aprobar = 0;

    //     data.forEach((item) => {
    //         const estado = item.vigencia?.estado;
    //         const estado_tar = item.estado_tarifa;
    //         const estado_apro = item.estado_aprobacion;

    //         if (estado === "vigente" && estado_tar === "Activa") vigentes++;
    //         if (estado === "por_vencer" && estado_tar === "Activa") porVencer++;
    //         if (estado === "vencida" && estado_tar === "Activa") vencidas++;
    //         if (estado_tar === "Inactiva") inactivas++;
    //         if (estado_apro === "Pendiente Aprobacion") por_aprobar++;
    //     });

    //     // document.getElementById("total_vigentes").textContent = vigentes;
    //     animateCounter("total_vigentes", vigentes);
    //     document.getElementById("total_por_vencer").textContent = porVencer;
    //     document.getElementById("total_vencidas").textContent = vencidas;
    //     document.getElementById("total_inactivas").textContent = inactivas;
    //     document.getElementById("total_por_aprobar").textContent = por_aprobar;
    // }

    function renderVigencia(vigencia) {
        if (!vigencia) {
            return `<span class="badge badge-phoenix badge-phoenix-secondary">Sin datos</span>`;
        }

        const estado = vigencia.estado ?? "";
        const color = vigencia.color ?? "success";
        const dias = vigencia.dias_restantes ?? 0;

        let textoDias = "";

        if (estado === "vigente") {
            textoDias = `(${dias} días restantes)`;
        }

        if (estado === "por_vencer") {
            textoDias = `(${dias} días restantes)`;
        }

        if (estado === "vencida") {
            textoDias = `(Vencida)`;
        }

        return `
            <div class="d-flex flex-column align-items-center">
                <span class="badge badge-phoenix badge-phoenix-${color}">
                    ${estado.replace("_", " ").toUpperCase()}
                </span>
                <small class="text-muted">${textoDias}</small>
            </div>
        `;
    }

    async function listar_Tarifas_cliente(fecha_desde = '', fecha_hasta = '') {
        const tbody = document.getElementById("tarifa_body");
        const tableId = "#tarifa_venta_export";

        // --- PASO A: Destruir instancia previa si existe ---
        if ($.fn.DataTable.isDataTable(tableId)) {
            $(tableId).DataTable().destroy();
            // Opcional: limpiar los filtros clonados para que no se dupliquen
            $(`${tableId} thead tr.filters`).remove();
        }

        const params = new URLSearchParams();
        const filtros = {
            empresa_id: document.getElementById("empresa_id")?.value || "",
            fecha_desde: fecha_desde,
            fecha_hasta: fecha_hasta,
            // fecha_desde: document.getElementById("f_fecha_desde")?.value || "",
            // fecha_hasta: document.getElementById("f_fecha_hasta")?.value || "",
            // search: document.getElementById("f_search")?.value || "",
            cliente_id: document.getElementById("f_cliente")?.value || "",
            tipo_vehiculo: document.getElementById("f_tipo_vehiculo")?.value || "",
            estado_tarifa: document.getElementById("f_estado_tarifa")?.value || "",
            origen: document.getElementById("f_origen")?.value || "",
            destino: document.getElementById("f_destino")?.value || "",
            semana_desde: document.getElementById("f_semana_desde")?.value || "",
            semana_hasta: document.getElementById("f_semana_hasta")?.value || "",
            mes_desde: document.getElementById("f_mes_desde")?.value || "",
            mes_hasta: document.getElementById("f_mes_hasta")?.value || "",
            pendientes: document.getElementById("f_pendientes")?.checked ? "1" : "",
        };

        Object.keys(filtros).forEach((key) => {
            if (filtros[key]) params.append(key, filtros[key]);
        });

        if (params.toString() === "") {
            Swal.fire("Atención", "Debe aplicar al menos un filtro", "warning");
            return;
        }

        tbody.innerHTML = `<tr><td colspan="9"><div class="text-center p-3"><div class="spinner-border text-primary"></div></div></td></tr>`;

        try {
            const response = await fetch(
                $("#base_url_api").val() + `tarifas?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "X-API-KEY": "nexos_nacional2026@*",
                    },
                },
            );

            if (!response.ok) throw new Error("Error al obtener tarifas");

            const result = await response.json();
            window.tarifasDataGlobal = result.data;
            tbody.innerHTML = "";

            if (!result.data || result.data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="9">No hay tarifas con esos filtros</td></tr>`;
                return;
            }

            // 🔥 Actualiza resumen
            // actualizarResumenVigencias(result.data);

            // --- PASO B: Llenado de filas (Tu lógica original) ---
            result.data.forEach((item, index) => {
                const vigenciaHtml = renderVigencia(item.vigencia);
                const formatFecha = (fechaStr) =>
                    fechaStr ? fechaStr.split("T")[0] : "";
                let rowClass = "";

                if (item.vigencia?.estado === "vencida") {
                    rowClass = "table-danger";
                }

                if (item.vigencia?.estado === "por_vencer") {
                    rowClass = "table-warning";
                }

                const row = `
                    <tr class="${rowClass}">
                        <td style='width:auto; white-space: nowrap;'>${index + 1}</td>
                        <td style='width:auto; white-space: nowrap;'>${item.id}</td>
                        <td style='width:auto; white-space: nowrap;'>
                            <div class="dropdown">
                                <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown">${item.cliente_tarifa?.nombre ?? ""}</a>
                                <div class="dropdown-menu dropdown-menu-end py-0">
                                    <a class="dropdown-item fw-bold btn_detalle_tarifa" href="#" data-tarifa_id="${item.id}">Detalle Tarifa</a>
                                    <a class="dropdown-item fw-bold btn_editar_tarifa" href="#" data-tarifa_id="${item.id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottomVenta">Editar Tarifa</a>
                                    ${item.estado_tarifa === "Activa" ? `<a class="dropdown-item fw-bold btn_inactivar_tarifa" id="btn_inactivar_tarifa" href="#" data-tarifa_id="${item.id}">Inactivar Tarifa</a>` : ""}
                                    ${item.estado_tarifa === "Inactiva" ? `<a class="dropdown-item fw-bold btn_activar_tarifa" id="btn_activar_tarifa" href="#" data-tarifa_id="${item.id}">Activar Tarifa</a>` : ""}
                                </div>
                            </div>
                        </td>
                        <td style='width:auto; white-space: nowrap;'>${formatFecha(item.fecha_inicio)}</td>
                        <td style='width:auto; white-space: nowrap;'>${formatFecha(item.fecha_fin)}</td>
                        <td style='width:auto; white-space: nowrap;'>${item.municipio_origen?.municipio ?? ""} - ${item.municipio_origen?.depto ?? ""}</td>
                        <td style='width:auto; white-space: nowrap;'>${item.municipio_destino?.municipio ?? ""} - ${item.municipio_destino?.depto ?? ""}</td>

                        <td style='width:auto; white-space: nowrap;'>${item.municipio_origen?.zona_municipio?.[0]?.zona?.nombre_zona ?? "-"}</td>
                        <td style='width:auto; white-space: nowrap;'>${item.municipio_destino?.zona_municipio?.[0]?.zona?.nombre_zona ?? "-"}</td>

                        <td style='width:auto; white-space: nowrap;'>${item.tipo_vehiculo} - ${obtenerTipoVehiculo(item.tipo_vehiculo)}</td>
                        <td style='width:auto; white-space: nowrap;'>${Number(item.tarifa).toLocaleString("es-CO", { style: "currency", currency: "COP" })}</td>
                        <td style='width:auto; white-space: nowrap;'>${Number(item.tarifa_sicetac).toLocaleString("es-CO", { style: "currency", currency: "COP" })}</td>
                        <td style='width:auto; white-space: nowrap;'>
                            ${calcularVariacionTarifa(item.tarifa, item.tarifa_sicetac)}
                        </td>
                        <td style='width:auto; white-space: nowrap;'>${vigenciaHtml}</td>
                        <td style='width:auto; white-space: nowrap;'>
                            ${item.estado_tarifa === "Activa"
                        ? `<span class="badge badge-phoenix badge-phoenix-success">Activado</span>`
                        : `<span class="badge badge-phoenix badge-phoenix-danger">${item.estado_tarifa ?? ""}</span>`}
                        </td>
                        <td style='width:auto; white-space: nowrap;'>
                            ${item.estado_aprobacion === "Pendiente Aprobacion" || item.estado_aprobacion === "Rechazada"
                        ? `<span class="badge badge-phoenix badge-phoenix-danger">${item.estado_aprobacion ?? ""}</span>`
                        : `<span class="badge badge-phoenix badge-phoenix-success">${item.estado_aprobacion ?? ""}</span>`}
                        </td>
                        <td style='width:auto; white-space: nowrap;'>${formatFecha(item.fecha)} ${item.hora ?? ""}</td>
                        <td style='width:auto; white-space: nowrap;'>${item.usuario ?? ""}</td>
                        <td style='width:auto; white-space: nowrap;'>${item.empresa_tarifa?.nombre_empresa ?? ""}</td>
                        <td style='width:auto; white-space: nowrap; min-width:140px;'>
                            ${renderCausalesTabla(item.componentes)}
                        </td>
                        <td style='width:auto; white-space: nowrap; min-width:160px; max-width:240px; vertical-align:top;'>
                            ${renderObservacionesTabla(item.componentes)}
                        </td>
                        <!--<td style='width:auto; white-space: nowrap; min-width:140px;'>
                            <div class="d-flex justify-content-center gap-1">
                                <button type="button" class="btn btn-sm btn-outline-primary btn_detalle_tarifa" data-tarifa_id="${item.id}">
                                    <i class="bi bi-eye"></i>
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-warning btn_editar_tarifa" data-tarifa_id="${item.id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottomVenta">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                ${item.estado_tarifa === "Activa"
                        ? `<button type="button" class="btn btn-sm btn-outline-danger btn_inactivar_tarifa" data-tarifa_id="${item.id}">
                                        <i class="bi bi-x-circle"></i>
                                    </button>`
                        : ""}
                                ${item.estado_tarifa === "Inactiva"
                        ? `<button type="button" class="btn btn-sm btn-outline-success btn_activar_tarifa" data-tarifa_id="${item.id}">
                                        <i class="bi bi-check-circle"></i>
                                    </button>`
                        : ""}
                            </div>
                        </td>-->
                    </tr>
                `;

                tbody.insertAdjacentHTML("beforeend", row);
            });

            // --- PASO C: Inicializar DataTables con Filtros Tipo Excel ---
            setTimeout(() => {
                inicializarDataTable(tableId);
            }, 100);
        } catch (error) {
            console.error(error);
            tbody.innerHTML = `<tr><td colspan="9">Error al cargar tarifas</td></tr>`;
        }
    }

    // Agrega esta función helper antes o dentro de listar_Tarifas_cliente
    function calcularVariacionTarifa(tarifa, tarifa_sicetac) {
        const t = Number(tarifa) || 0;
        const s = Number(tarifa_sicetac) || 0;  // Si es null/undefined/NaN → 0

        if (s === 0) {
            return `<span class="badge badge-phoenix badge-phoenix-secondary">Sin SICETAC</span>`;
        }

        const variacion = ((t - s) / s) * 100;
        const abs = Math.abs(variacion).toFixed(2);

        if (variacion > 0) {
            return `<span class="badge badge-phoenix badge-phoenix-success">
                    <i class="bi bi-arrow-up"></i> +${abs}% sobre SICETAC
                </span>`;
        } else if (variacion < 0) {
            return `<span class="badge badge-phoenix badge-phoenix-danger">
                    <i class="bi bi-arrow-down"></i> -${abs}% bajo SICETAC
                </span>`;
        } else {
            return `<span class="badge badge-phoenix badge-phoenix-info">
                    <i class="bi bi-dash"></i> Igual a SICETAC
                </span>`;
        }
    }

    function renderTablaTarifas(data) {
        const tableId = "#tarifa_venta_export";
        const tbody = document.getElementById("tarifa_body");

        // 🔥 Destruir DataTable antes de re-renderizar
        if ($.fn.DataTable.isDataTable(tableId)) {
            $(tableId).DataTable().destroy();
        }

        tbody.innerHTML = "";

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="10">No hay registros</td></tr>`;
            return;
        }

        data.forEach((item, index) => {
            const formatFecha = (fechaStr) =>
                fechaStr ? fechaStr.split("T")[0] : "";
            const vigenciaHtml = renderVigencia(item.vigencia);

            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.cliente_tarifa?.nombre ?? ""}</td>
                    <td>${formatFecha(item.fecha_inicio)}</td>
                    <td>${formatFecha(item.fecha_fin)}</td>
                    <td>${item.municipio_origen?.municipio}</td>
                    <td>${item.municipio_destino?.municipio}</td>
                    <td>${item.tipo_vehiculo}</td>
                    <td>${Number(item.tarifa).toLocaleString("es-CO", { style: "currency", currency: "COP" })}</td>
                    <td>
                        ${item.estado_tarifa === "Activa"
                    ? `<span class="badge badge-phoenix badge-phoenix-success">Activa</span>`
                    : `<span class="badge badge-phoenix badge-phoenix-danger">Inactiva</span>`
                }
                    </td>
                    <td>${vigenciaHtml}</td>
                </tr>
            `;

            tbody.insertAdjacentHTML("beforeend", row);
        });

        // 🔥 Re-inicializar limpio
        // inicializarDataTable(tableId);
    }

    function renderCausalesTabla(componentes) {
        if (!componentes || componentes.length === 0) {
            return `<span class="text-muted" style="font-size:0.7rem;">—</span>`;
        }

        // Recolectar causales únicas (puede haber varios componentes con la misma)
        const causalesUnicas = [...new Map(
            componentes
                .filter(c => c.causa !== null)
                .map(c => [c.causa.id, c.causa.causal_aprobacion])
        ).entries()];

        if (causalesUnicas.length === 0) {
            return `<span class="badge bg-light text-muted border" style="font-size:0.65rem;">
                    <i class="bi bi-slash-circle me-1"></i>Sin causal
                </span>`;
        }

        // Una línea por causal única
        return causalesUnicas.map(([id, nombre]) =>
            `<span class="badge bg-warning-subtle text-warning border border-warning-subtle d-block mb-1" style="font-size:0.65rem; white-space:normal; text-align:left;">
            <i class="bi bi-tag-fill me-1"></i>${nombre}
        </span>`
        ).join('');
    }

    function renderObservacionesTabla(componentes) {
        if (!componentes || componentes.length === 0) {
            return `<span class="text-muted" style="font-size:0.7rem;">—</span>`;
        }

        // Filtrar solo los que tienen observación con texto real
        const conObservacion = componentes.filter(
            c => c.motivo_aprobacion && c.motivo_aprobacion.trim() !== ""
        );

        if (conObservacion.length === 0) {
            return `<span class="text-muted" style="font-size:0.7rem;">—</span>`;
        }

        // Mostrar: nombre del componente + su observación
        return conObservacion.map(c =>
            `<div class="mb-1" style="font-size:0.68rem; text-align:left; min-width:160px; max-width:220px;">
            <span class="fw-bold text-secondary d-block" style="font-size:0.6rem; text-transform:uppercase; letter-spacing:0.04em;">
                ${c.tipo.replace(/_/g, " ")}
            </span>
            <span class="text-dark" style="white-space:normal; line-height:1.3;">
                <i class="bi bi-chat-left-text-fill text-info me-1" style="font-size:0.6rem;"></i>${c.motivo_aprobacion}
            </span>
        </div>`
        ).join('<hr class="my-1">');
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
            search: false,
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

    async function Listar_Clientes() {
        try {
            // 1. Definimos los IDs de los selects que queremos afectar
            const selectIds = ["#cliente_instruccion", "#f_cliente"];

            const resp = await fetch(
                $("#base_url").val() + "indicadores/ListarClientes",
                {
                    method: "POST",
                },
            );

            const data = await resp.json();

            // 2. Iteramos sobre cada ID para llenarlos e inicializar TomSelect
            selectIds.forEach((id) => {
                const selectElement = document.querySelector(id);
                if (!selectElement) return; // Si el elemento no existe en la página actual, saltar

                // Limpiar y agregar opción inicial vacía (necesaria para el placeholder)
                selectElement.innerHTML = `<option value=""></option>`;

                if (!data || data.length === 0) {
                    let opt = document.createElement("option");
                    opt.value = "";
                    opt.textContent = "⚠️ No hay clientes disponibles";
                    selectElement.appendChild(opt);
                } else {
                    // Llenar con la data del servidor
                    data.forEach((item) => {
                        let opt = document.createElement("option");
                        opt.value = item.id;
                        opt.textContent = item.nombre;
                        selectElement.appendChild(opt);
                    });
                }

                // 3. Destruir instancia previa si existe (evita errores de duplicidad)
                if (selectElement.tomselect) {
                    selectElement.tomselect.destroy();
                }

                // 4. Inicializar TomSelect con el placeholder
                new TomSelect(id, {
                    create: false, // Usualmente para tipos de vehículos no quieres que el usuario invente nuevos
                    placeholder: "Seleccione un vehículo...",
                    allowEmptyOption: true,
                    sortField: {
                        field: "text",
                        direction: "asc",
                    },
                    onInitialize: function () {
                        // Aplicar clases de Bootstrap para mantener el diseño uniforme
                        this.control.classList.add("form-control", "form-control-sm");
                    },
                });
            });
        } catch (error) {
            console.error("Error al listar cliente:", error);
            Swal.fire("Error", "No se pudo cargar la lista de clientes", "error");
        }
    }

    async function Municipios() {
        // Definimos todos los IDs que deben cargarse con la lista de municipios
        const selectIds = [
            "#origen_tarifa",
            "#destino_tarifa",
            "#f_origen",
            "#f_destino",
        ];

        try {
            const response = await fetch(
                $("#base_url").val() + "serviciocliente/Consulta_Municipios",
                {
                    method: "POST",
                    cache: "no-cache",
                },
            );
            const data = await response.json();

            selectIds.forEach((id) => {
                const el = document.querySelector(id);
                if (!el) return;

                // 1. Destruir instancia de TomSelect si ya existe
                if (el.tomselect) {
                    el.tomselect.destroy();
                }

                // 2. Limpiar y llenar el select original
                el.innerHTML = '<option value=""></option>'; // Opción vacía para el placeholder

                data.forEach(function (element) {
                    let opt = document.createElement("option");
                    opt.value = element.rndc_codigo_ciudad;
                    opt.textContent = `${element.municipio} - ${element.depto}`;

                    // Guardar metadatos (útil si necesitas usarlos después)
                    opt.dataset.municipio = element.municipio;
                    opt.dataset.depto = element.depto;

                    el.appendChild(opt);
                });

                // 3. Inicializar TomSelect con configuración unificada
                new TomSelect(id, {
                    create: false, // Cambiado a false para evitar entradas manuales erróneas en municipios
                    placeholder: id.includes("origen")
                        ? "Seleccione origen..."
                        : "Seleccione destino...",
                    allowEmptyOption: true,
                    maxOptions: null, // Permite ver todos los municipios al buscar
                    sortField: {
                        field: "text",
                        direction: "asc",
                    },
                    onInitialize: function () {
                        // Aplicar clases de Bootstrap para que no se vea "aplastado"
                        this.control.classList.add("form-control", "form-control-sm");
                    },
                });
            });
        } catch (error) {
            console.error("Error en Municipios:", error);
        }
    }

    function inicializarVehiculos() {
        const vehiculoIds = ["#slct_tipo_vehiculo_", "#f_vehiculo"];

        vehiculoIds.forEach((id) => {
            const el = document.querySelector(id);
            if (!el) return;

            // Destruir instancia previa si existe
            if (el.tomselect) {
                el.tomselect.destroy();
            }

            // Inicializar TomSelect
            new TomSelect(id, {
                create: false, // Usualmente para tipos de vehículos no quieres que el usuario invente nuevos
                placeholder: "Seleccione un vehículo...",
                allowEmptyOption: true,
                sortField: [{ field: "$order" }],
                onInitialize: function () {
                    // Aplicar clases de Bootstrap para mantener el diseño uniforme
                    this.control.classList.add("form-control", "form-control-sm");
                },
            });
        });
    }

    async function MunicipiosTarifasExtras() {
        try {
            const response = await fetch(
                $("#base_url").val() + "serviciocliente/Consulta_Municipios",
                {
                    method: "POST",
                    cache: "no-cache",
                },
            );
            const data = await response.json();

            // Definimos las clases que queremos convertir a TomSelect
            const clasesExtra = [".js-extra-origin", ".js-extra-destination"];

            clasesExtra.forEach((clase) => {
                const elementos = document.querySelectorAll(clase);

                elementos.forEach((el) => {
                    // 1. Evitar duplicados: Si ya tiene TomSelect, lo destruimos o saltamos
                    if (el.tomselect) {
                        el.tomselect.destroy();
                    }

                    // 2. Limpiar y llenar opciones
                    el.innerHTML = '<option value=""></option>';
                    data.forEach((element) => {
                        let opt = document.createElement("option");
                        opt.value = element.rndc_codigo_ciudad;
                        opt.textContent = `${element.municipio} - ${element.depto}`;
                        // Mantener metadatos por si los necesitas
                        opt.dataset.municipio = element.municipio;
                        opt.dataset.depto = element.depto;
                        el.appendChild(opt);
                    });

                    // 3. Inicializar TomSelect individualmente
                    new TomSelect(el, {
                        create: false,
                        placeholder: clase.includes("origin")
                            ? "Seleccione origen..."
                            : "Seleccione destino...",
                        allowEmptyOption: true,
                        maxOptions: null,
                        sortField: {
                            field: "text",
                            direction: "asc",
                        },
                        onInitialize: function () {
                            this.control.classList.add("form-control", "form-control-sm");
                        },
                    });
                });
            });
        } catch (error) {
            console.error("Error en Municipios Extras:", error);
        }
    }

    async function inicializarTomSelectIndividual(el) {
        if (el.tomselect) return;

        const response = await fetch(
            $("#base_url").val() + "serviciocliente/Consulta_Municipios",
            {
                method: "POST",
                cache: "no-cache",
            },
        );

        const data = await response.json();

        el.innerHTML = '<option value=""></option>';

        data.forEach((element) => {
            let opt = document.createElement("option");
            opt.value = element.rndc_codigo_ciudad;
            opt.textContent = `${element.municipio} - ${element.depto}`;
            el.appendChild(opt);
        });

        new TomSelect(el, {
            create: false,
            placeholder: "Seleccione origen...",
            allowEmptyOption: true,
            sortField: {
                field: "text",
                direction: "asc",
            },
        });
    }

    function formatCOP(valor) {
        return Number(valor).toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
        });
    }

    // Función para obtener el nombre del vehículo basado en el value
    function obtenerTipoVehiculo(value) {
        switch (value) {
            case "NHR_2":
                return "NHR — Sencillo >2500 Kg";
            case "2":
                return "Camión dos ejes - Sencillo PBV mas de 10500 Kg";
            case "2_7_8":
                return "Camion dos ejes - Sencillo PBV 7500-8000 Kg";
            case "2_8_9":
                return "Camion dos ejes - Sencillo PBV 8001-9000 Kg";
            case "2_9_105":
                return "Camion dos ejes - Sencillo PBV 9001-10500 Kg";
            case "2S2":
                return "Tractocamión dos ejes - Patineta - Minimula con semiremolque de dos ejes";
            case "2S3":
                return "Tractocamión dos ejes - Patineta - Minimula con semiremolque de tres ejes";
            case "3":
                return "Camión tres ejes - Dobletroque";
            case "3S2":
                return "Tractocamión tres ejes - Tractomula con semiremolque de dos ejes";
            case "3S3":
                return "Tractocamión tres ejes - Tractomula con semiremolque de tres ejes";
            case "V2":
                return "Volqueta dos ejes - Sencillo";
            case "V3":
                return "Volqueta tres ejes - Dobletroque";
            case "V4":
                return "Volqueta cuatro ejes - Cuatromanos";
            default:
                return "No especificado";
        }
    }

    // Función para crear un badge de Phoenix basado en el estado
    // function crearBadgeEstado(estado) {
    //     let badgeClass, badgeText;

    //     switch (estado.toLowerCase()) {
    //         case 'activa':
    //             badgeClass = 'badge-phoenix-success';
    //             badgeText = 'Activa';
    //             break;
    //         case 'inactiva':
    //             badgeClass = 'badge-phoenix-danger';
    //             badgeText = 'Inactiva';
    //             break;
    //         case 'pendiente':
    //             badgeClass = 'badge-phoenix-warning';
    //             badgeText = 'Pendiente';
    //             break;
    //         case 'expirada':
    //             badgeClass = 'badge-phoenix-secondary';
    //             badgeText = 'Expirada';
    //             break;
    //         default:
    //             badgeClass = 'badge-phoenix-info';
    //             badgeText = estado;
    //     }

    //     return `<span class="badge badge-phoenix ${badgeClass}">${badgeText}</span>`;
    // }

    // Función 1 – Validación Base
    function validarCamposBase() {
        const requiredFields = [
            "cliente_instruccion",
            "origen_tarifa",
            "destino_tarifa",
            "slct_tipo_vehiculo_",
            "tarifa-venta",
            "estado-tarifa-venta",
            "fecha-inicio-venta",
            "fecha-fin-venta",
        ];

        let isValid = true;

        requiredFields.forEach((id) => {
            const el = document.getElementById(id);

            if (!el) return;

            // Limpiar error previo
            limpiarError(el);

            if (!el.value || !el.value.trim()) {
                if (isValid === false) {
                    el.focus();
                }

                isValid = false;

                // Agregar clase Bootstrap
                el.classList.add("is-invalid");

                // Crear mensaje debajo
                const error = document.createElement("div");
                error.className = "invalid-feedback d-block";
                error.textContent = "Campo obligatorio";

                // Insertarlo después del input
                el.parentNode.appendChild(error);
            }
        });

        return isValid;
    }

    function limpiarError(element) {
        element.classList.remove("is-invalid");

        const existingError = element.parentNode.querySelector(".invalid-feedback");

        if (existingError) {
            existingError.remove();
        }
    }

    function marcarError(el, mensaje = "Campo obligatorio") {
        if (!el) return;

        el.classList.add("is-invalid");

        // Evitar duplicar mensajes
        if (!el.parentNode.querySelector(".invalid-feedback")) {
            const error = document.createElement("div");
            error.className = "invalid-feedback d-block";
            error.textContent = mensaje;
            el.parentNode.appendChild(error);
        }
    }

    function limpiarError(el) {
        if (!el) return;

        el.classList.remove("is-invalid");

        const error = el.parentNode.querySelector(".invalid-feedback");
        if (error) error.remove();
    }

    // Función 2 – Obtener TAB activo
    function obtenerTabActivo() {
        const activePane = document.querySelector(
            "#myTabContentVenta .tab-pane.show.active",
        );
        return activePane ? "#" + activePane.id : null;
    }

    // Función 3 – Validar configuración avanzada
    function validarConfiguracionAvanzada() {
        const tabActivo = obtenerTabActivo();

        if (!tabActivo) return true;

        let valido = true;
        let primerError = null;

        // 🔹 MULTIORIGEN
        if (tabActivo === "#tab-history") {
            const items = document.querySelectorAll(
                "#multiorigen-container .extra-origin-item",
            );

            if (items.length === 0) return false;

            items.forEach((item) => {
                const origen = item.querySelector(".js-extra-origin");
                const rate1 = item.querySelector(".js-extra-rate-1");
                const rate2 = item.querySelector(".js-extra-rate-2");

                [origen, rate1, rate2].forEach((campo) => {
                    limpiarError(campo);

                    if (!campo.value || !campo.value.trim()) {
                        marcarError(campo);
                        if (!primerError) primerError = campo;
                        valido = false;
                    }
                });
            });
        }

        // 🔹 MULTIDESTINO
        if (tabActivo === "#tab-multidestino") {
            const items = document.querySelectorAll(
                "#multidestino-container .extra-destination-item",
            );

            if (items.length === 0) return false;

            items.forEach((item) => {
                const destino = item.querySelector(".js-extra-destination");
                const rate1 = item.querySelector(".js-extra-destination-rate-1");
                const rate2 = item.querySelector(".js-extra-destination-rate-2");

                [destino, rate1, rate2].forEach((campo) => {
                    limpiarError(campo);

                    if (!campo.value || !campo.value.trim()) {
                        marcarError(campo);
                        if (!primerError) primerError = campo;
                        valido = false;
                    }
                });
            });
        }

        // 🔹 MULTIRECOGIDA
        if (tabActivo === "#tab-home") {
            const valor = document.getElementById("js-extra-venta-origen");
            limpiarError(valor);

            if (!valor.value.trim()) {
                marcarError(valor);
                primerError = valor;
                valido = false;
            }
        }

        // 🔹 MULTIENTREGA
        if (tabActivo === "#tab-config") {
            const valor = document.getElementById("js-extra-venta-destino");
            limpiarError(valor);

            if (!valor.value.trim()) {
                marcarError(valor);
                primerError = valor;
                valido = false;
            }
        }

        if (!valido && primerError) {
            primerError.focus();
        }

        return valido;
    }

    // async function apiFetch(url, { method = "GET", data = null } = {}) {
    //     const headers = {
    //         "Accept": "application/json",
    //         "Content-Type": "application/json",
    //     };

    //     // Si usas Laravel Sanctum / CSRF / token, agrega aquí:
    //     const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
    //     if (token) headers["X-CSRF-TOKEN"] = token;

    //     const res = await fetch(url, {
    //         method,
    //         headers,
    //         body: data ? JSON.stringify(data) : null,
    //     });

    //     // Si la API devuelve 422, 500, etc.
    //     const payload = await res.json().catch(() => ({}));

    //     if (!res.ok) {
    //         const msg = payload?.message || payload?.error || "Error en la API";
    //         throw { status: res.status, payload, message: msg };
    //     }

    //     return payload;
    // }

    async function apiFetch(url, { method = "GET", data = null } = {}) {
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": "nexos_nacional2026@*",
        };

        const res = await fetch(url, {
            method,
            headers,
            body: data ? JSON.stringify(data) : null,
        });

        const payload = await res.json().catch(() => ({}));

        if (!res.ok) {
            const msg = payload?.message || payload?.error || "Error en la API";
            throw { status: res.status, payload, message: msg };
        }

        return payload;
    }

    function buildTarifaApiPayload(data) {
        return {
            empresa_id: Number(document.getElementById("empresa_id")?.value || 1),
            cliente_id: Number(data.cliente),
            origen: data.origen,
            destino: data.destino,
            tipo_vehiculo: data.tipo_vehiculo,
            estado_tarifa: data.estado,
            configuracion_extra: data.configuracion_extra,
            plena: limpiarMoneda(data.tarifa_venta),
            multi_recogida: limpiarMoneda(
                data.configuracion?.multi_recogida?.tarifa_adicional,
            ),
            multi_entrega: limpiarMoneda(
                data.configuracion?.multi_entrega?.tarifa_adicional,
            ),
            multi_origen: 0,
            multi_destino: 0,
            usuario: data.usuario || null,
            fecha_inicio: data.fecha_inicio || null,
            fecha_fin: data.fecha_fin || null,
            extras: {
                multi_origen: data.configuracion?.multi_origen || [],
                multi_destino: data.configuracion?.multi_destino || [],
            },
        };
    }

    function limpiarMoneda(valor) {
        if (!valor) return 0;

        // Convertir a string por si acaso viene un número
        let str = String(valor);

        // Paso 1 y 2: Quitar símbolo $, espacios, y puntos de miles
        // Usamos una expresión regular para limpiar todo excepto la coma decimal
        let limpio = str.replace(/[$\s.]/g, "");

        // Paso 3: Cambiar la coma decimal por punto
        limpio = limpio.replace(",", ".");

        return parseFloat(limpio) || 0;
    }

    function renderMultiOrigen(detalles = []) {
        const container = document.getElementById("multiorigen-container");
        container.innerHTML = "";

        detalles.forEach((det, index) => {
            const html = `
                <div class="row g-3 extra-origin-item mb-2 align-items-end">
                    <div class="col-md-6">
                        <label class="form-label-sm">
                            Origen Adicional <span class="req">*</span>
                        </label>
    
                        <div class="input-group input-group-sm">
                            <select class="js-extra-origin" name="extra_origin_id[]" data-selected="${det.municipio_id}"></select>
                            <!--<button class="btn btn-outline-secondary btn-sm" type="button">
                                <i class="bi bi-plus"></i>
                            </button>-->
                        </div>
                    </div>
    
                    <div class="col-md-3">
                        <label class="form-label-sm">Tarifa Adicional 1</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">$</span>
                            <input  type="text" class="form-control js-extra-rate-1" name="extra_rate_1[]" placeholder="0.00" value="${formatCOP(det.rate_1)}">
                        </div>
                    </div>
    
                    <div class="col-md-3 d-flex align-items-end">
                        <div class="w-100">
                            <label class="form-label-sm">Tarifa Adicional 2</label>
                            <div class="input-group input-group-sm">
                                <span class="input-group-text">$</span>
                                <input  type="text" class="form-control js-extra-rate-2" name="extra_rate_2[]" placeholder="0.00" value="${formatCOP(det.rate_2)}">
                                <button class="btn btn-outline-danger btn-sm btn-remove-extra" type="button">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML("beforeend", html);
        });
    }

    function renderMultiDestino(detalles = []) {
        const container = document.getElementById("multidestino-container");
        container.innerHTML = ""; // 🔥 faltaba esto

        detalles.forEach((det) => {
            const html = `
            <div class="row g-3 extra-destination-item mb-2 align-items-end">
                <div class="col-md-6">
                    <label class="form-label-sm">
                        Destino Adicional <span class="req">*</span>
                    </label>
    
                    <div class="input-group input-group-sm">
                        <select class="js-extra-destination" name="extra_destination_id[]" data-selected="${det.municipio_id}"></select>
                        <!--<button class="btn btn-outline-secondary btn-sm" type="button">
                            <i class="bi bi-plus"></i>
                        </button>-->
                    </div>
                </div>
    
                <div class="col-md-3">
                    <label class="form-label-sm">Tarifa Adicional 1</label>
                    <div class="input-group input-group-sm">
                        <span class="input-group-text">$</span>
                        <input type="text" class="form-control js-extra-destination-rate-1" name="extra_destination_rate_1[]" placeholder="0.00" value="${formatCOP(det.rate_1)}">
                    </div>
                </div>
    
                <div class="col-md-3 d-flex align-items-end">
                    <div class="w-100">
                        <label class="form-label-sm">Tarifa Adicional 2</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">$</span>
                            <input type="text" class="form-control js-extra-destination-rate-2" name="extra_destination_rate_2[]" placeholder="0.00" value="${formatCOP(det.rate_2)}">
    
                            <button class="btn btn-outline-danger btn-sm btn-remove-destination" type="button">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

            container.insertAdjacentHTML("beforeend", html);
        });
    }

    /**
     * LÓGICA DE DETALLE TIPO INFORME PROFESIONAL
     */
    let chartInstance = null;
    function renderChart(valorActual) {
        const ctx = document.getElementById("chartComparativo").getContext("2d");
        if (chartInstance) {
            chartInstance.destroy();
        }

        const vActual = parseFloat(valorActual);
        const vHistorico = vActual * 0.94;
        const vMercado = vActual * 1.06;

        const variacion = (((vActual - vHistorico) / vHistorico) * 100).toFixed(1);
        const badge = document.getElementById("det-variacion-badge");
        badge.innerText = `${variacion}% Variación`;

        chartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Histórico", "Actual", "Mercado"],
                datasets: [
                    {
                        data: [vHistorico, vActual, vMercado],
                        backgroundColor: ["#cbd5e1", "#2563eb", "#94a3b8"],
                        borderRadius: 4,
                        barThickness: 40,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { display: false },
                    x: {
                        grid: { display: false },
                        ticks: { font: { weight: "bold", size: 10 } },
                    },
                },
            },
        });
    }

    async function verDetalleInforme(tarifaId) {
        try {
            const response = await fetch(
                $("#base_url_api").val() + `tarifas/${tarifaId}`,
                {
                    headers: { "X-API-KEY": "nexos_nacional2026@*" },
                },
            );
            const result = await response.json();
            const d = result.data;
            if (!d) return;

            const formatMoney = (v) =>
                Number(v).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0,
                });

            // 1. Datos Básicos
            document.getElementById("det-codigo-tarifa").innerText =
                `ID: #TRF-${d.id}`;
            document.getElementById("det-cliente").innerText =
                d.cliente_tarifa?.nombre || "CLIENTE";
            document.getElementById("det-origen").innerText =
                d.municipio_origen?.municipio || "--";
            document.getElementById("det-destino").innerText =
                d.municipio_destino?.municipio || "--";
            document.getElementById("det-precio-base").innerText = formatMoney(
                d.tarifa,
            );
            document.getElementById("det-fecha-inicio").innerText =
                d.fecha_inicio.split("T")[0];
            document.getElementById("det-fecha-fin").innerText =
                d.fecha_fin.split("T")[0];

            // Estado
            const b = document.getElementById("det-estado");
            b.innerText = d.estado_tarifa.toUpperCase();
            b.className = `badge rounded-pill px-3 py-1 ${d.estado_tarifa === "Activa" ? "bg-success" : "bg-secondary"}`;

            // 2. Procesar Componentes y Detalles (Puntos Adicionales)
            const listaPuntos = document.getElementById("det-lista-puntos");
            const seccionPuntos = document.getElementById("det-seccion-puntos");
            const listaExtras = document.getElementById("det-lista-extras");
            const seccionExtra = document.getElementById("det-seccion-extra");

            listaPuntos.innerHTML = "";
            listaExtras.innerHTML = "";
            let sumaAdicionales = 0;
            let hayPuntos = false;
            // ── Render Causales ─────────────────────────────────────────
            const listaCausales = document.getElementById("det-lista-causales");
            listaCausales.innerHTML = "";

            if (d.componentes && d.componentes.length > 0) {
                // d.componentes.forEach((comp) => {
                //     // Si el componente tiene detalles (es MULTI_ORIGEN o MULTI_DESTINO)
                //     if (comp.detalles && comp.detalles.length > 0) {
                //         hayPuntos = true;
                //         comp.detalles.forEach((det, idx) => {
                //             const r1 = parseFloat(det.rate_1) || 0;
                //             const r2 = parseFloat(det.rate_2) || 0;

                //             // Obtenemos el nombre del municipio de la relación cargada
                //             // Usamos encadenamiento opcional (?.) por si algún detalle no tiene municipio asignado
                //             const nombreMunicipio = det.municipio?.municipio || "No asignado";
                //             const codigoMunicipio = det.municipio_id || "--";

                //             const card = `
                //                 <div class="point-card p-3 mb-3 shadow-sm border-start-primary">
                //                     <div class="d-flex justify-content-between align-items-start mb-2 border-bottom pb-1">
                //                         <div>
                //                             <span class="badge bg-primary-subtle text-primary mb-1" style="font-size: 0.6rem;">${det.tipo_detalle}</span>
                //                             <div class="fw-bold text-dark" style="font-size: 0.85rem;">
                //                                 <i class="bi bi-geo-alt-fill text-danger me-1"></i>${nombreMunicipio} 
                //                                 <small class="text-muted">(${codigoMunicipio})</small>
                //                             </div>
                //                         </div>
                //                         <div class="text-end">
                //                             <small class="text-muted d-block fw-bold" style="font-size: 0.55rem;">ID DETALLE</small>
                //                             <span class="text-dark small">#${det.id}</span>
                //                         </div>
                //                     </div>
                //                     <div class="row g-2">
                //                         <div class="col-6">
                //                             <div class="p-2 rounded border bg-light text-center">
                //                                 <small class="text-muted d-block fw-bold" style="font-size: 0.55rem;">RATE 1</small>
                //                                 <span class="badge-price px-2 py-1 rounded w-100 d-inline-block">${formatMoney(r1)}</span>
                //                             </div>
                //                         </div>
                //                         <div class="col-6">
                //                             <div class="p-2 rounded border bg-light text-center">
                //                                 <small class="text-muted d-block fw-bold" style="font-size: 0.55rem;">RATE 2</small>
                //                                 <span class="badge-price px-2 py-1 rounded w-100 d-inline-block">${formatMoney(r2)}</span>
                //                             </div>
                //                         </div>
                //                     </div>
                //                 </div>`;
                //             listaPuntos.insertAdjacentHTML("beforeend", card);
                //         });
                //     } else {
                //         // Otros componentes (PLENA, etc) que no tienen detalles de puntos
                //         const val = parseFloat(comp.valor) || 0;
                //         if (comp.tipo !== "PLENA") {
                //             // No sumamos la plena si ya es la base
                //             sumaAdicionales += val;
                //         }
                //         const itemExtra = `
                //             <div class="list-group-item d-flex justify-content-between align-items-center p-3 mb-2 border rounded bg-light">
                //                 <span class="fw-bold text-dark" style="font-size: 0.8rem;">${comp.tipo.replace(/_/g, " ")}</span>
                //                 <span class="fw-bold text-primary">${formatMoney(val)}</span>
                //             </div>`;
                //         listaExtras.insertAdjacentHTML("beforeend", itemExtra);
                //     }
                // });

                d.componentes.forEach((comp) => {
                    const valor = parseFloat(comp.valor) || 0;
                    const variacion = parseFloat(comp.variacion_pct) || 0;
                    const tieneCausa = comp.causa !== null;

                    // Determinar si la variación es positiva, negativa o neutra
                    let signoIcon, signoClass, signoLabel;
                    if (variacion > 0) {
                        signoIcon = "bi-arrow-up-circle-fill";
                        signoClass = "text-danger";        // sube = alerta
                        signoLabel = `+${variacion.toFixed(2)}%`;
                    } else if (variacion < 0) {
                        signoIcon = "bi-arrow-down-circle-fill";
                        signoClass = "text-success";       // baja = favorable
                        signoLabel = `${variacion.toFixed(2)}%`;
                    } else {
                        signoIcon = "bi-dash-circle-fill";
                        signoClass = "text-secondary";
                        signoLabel = "0%";
                    }

                    // Badge de causal
                    const causaBadge = tieneCausa
                        ? `<span class="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-2" style="font-size:0.65rem;">
                                <i class="bi bi-tag-fill me-1"></i>${comp.causa.causal_aprobacion}
                            </span>`
                        : `<span class="badge bg-light text-muted border rounded-pill px-2" style="font-size:0.65rem;">
                                <i class="bi bi-slash-circle me-1"></i>Sin causal
                            </span>`;

                    // Motivo (observación del componente)
                    const motivoHtml = comp.motivo_aprobacion
                        ? `<div class="mt-2 p-2 rounded bg-light border-start border-warning border-3" style="font-size:0.72rem; color:#555;">
                                <i class="bi bi-chat-left-quote-fill text-warning me-1"></i>
                                <em>${comp.motivo_aprobacion}</em>
                            </div>`
                        : "";

                    const card = `
                    <div class="d-flex align-items-start gap-3 p-3 mb-2 rounded border bg-white shadow-sm">

                        <!-- Ícono de variación -->
                        <div class="pt-1">
                            <i class="bi ${signoIcon} fs-5 ${signoClass}"></i>
                        </div>

                        <!-- Contenido -->
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-center flex-wrap gap-1">
                                <span class="fw-bold text-dark" style="font-size:0.82rem;">
                                    ${comp.tipo.replace(/_/g, " ")}
                                </span>
                                <div class="d-flex align-items-center gap-2">
                                    <span class="fw-bold ${signoClass}" style="font-size:0.8rem;">${signoLabel}</span>
                                    <span class="fw-bold text-dark" style="font-size:0.82rem;">${formatMoney(valor)}</span>
                                </div>
                            </div>
                            <div class="mt-1">${causaBadge}</div>
                            ${motivoHtml}
                        </div>

                    </div>`;

                    listaCausales.insertAdjacentHTML("beforeend", card);
                });
            }

            seccionPuntos.style.display = hayPuntos ? "block" : "none";
            seccionExtra.style.display =
                listaExtras.children.length > 0 ? "block" : "none";
            document.getElementById("det-total-adicionales").innerText =
                formatMoney(sumaAdicionales);

            renderChart(d.tarifa);
            const inst = bootstrap.Offcanvas.getOrCreateInstance(
                document.getElementById("offcanvasDetalleTarifa"),
            );
            inst.show();
        } catch (error) {
            console.error("Error cargando reporte:", error);
        }
    }

    function bloquearCamposNoEditablesVenta() {
        const ids = [
            "cliente_instruccion",
            "origen_tarifa",
            "destino_tarifa",
            "slct_tipo_vehiculo_",
            "fecha-inicio-venta",
            "fecha-fin-venta",
            "estado-tarifa-venta",
        ];

        ids.forEach((id) => {
            const el = document.getElementById(id);

            if (!el) return;

            // Si usa TomSelect
            if (el.tomselect) {
                el.tomselect.disable();
                el.classList.add("bg-light", "opacity-75");
            } else {
                el.setAttribute("disabled", true);
            }
        });
    }

    function habilitarCamposVenta() {
        const ids = [
            "cliente_instruccion",
            "origen_tarifa",
            "destino_tarifa",
            "slct_tipo_vehiculo_",
            "fecha-inicio-venta",
            "fecha-fin-venta",
        ];

        ids.forEach((id) => {
            const el = document.getElementById(id);

            if (!el) return;

            if (el.tomselect) {
                el.tomselect.enable();
            } else {
                el.removeAttribute("disabled");
            }
        });
    }

    /* =============================================================================
     |  IMPORTACIÓN MASIVA — TARIFAS DE VENTA
     |
     |  Reemplaza el módulo IM anterior (flujo upload → preview → progress → result)
     |  por el nuevo módulo IMV alineado con el offcanvas de costos.
     |
     |  Offcanvas: #offcanvasImporteMasivoVentas
     |  Endpoint : POST {base_url_api}tarifas/importar-masivo
     | ============================================================================*/

    /* ── Pasos de progreso ───────────────────────────────────────────────────────
     | Cada step: id (DOM), pct (% al que se activa), msg (título durante ese step)
     | ──────────────────────────────────────────────────────────────────────────*/
    const IMV_STEPS = [
        { id: 'imv-step-archivo', pct: 30, msg: 'Procesando hoja "archivo" — clientes, rutas y tarifas...' },
        { id: 'imv-step-multiorigen', pct: 55, msg: 'Procesando hoja "multiorigen"...' },
        { id: 'imv-step-multidestino', pct: 75, msg: 'Procesando hoja "multidestino"...' },
        { id: 'imv-step-variaciones', pct: 90, msg: 'Evaluando variaciones y reglas de aprobación...' },
        { id: 'imv-step-finalizando', pct: 97, msg: 'Guardando y actualizando lista de tarifas...' },
    ];

    /* ── Estado local ────────────────────────────────────────────────────────── */
    let _imvTimerInterval = null;

    /* ── Inicialización drag & drop ──────────────────────────────────────────── */
    function _imvInitDragDrop() {
        const dz = document.getElementById('imv-dropzone');
        if (!dz || dz.dataset.dzOk) return;

        dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('dragover'); });
        dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
        dz.addEventListener('drop', (e) => {
            e.preventDefault();
            dz.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (!file) return;
            const ext = file.name.split('.').pop().toLowerCase();
            if (!['xlsx', 'xls'].includes(ext)) {
                Swal.fire({ icon: 'warning', title: 'Formato no permitido', text: 'Solo .xlsx o .xls', confirmButtonText: 'OK' });
                return;
            }
            const dt = new DataTransfer();
            dt.items.add(file);
            document.getElementById('archivo_excel_ventas').files = dt.files;
            _imvMostrarArchivoSeleccionado(file);
        });

        const oc = document.getElementById('offcanvasImporteMasivoVentas');
        if (oc) oc.addEventListener('hidden.bs.offcanvas', () => imvReset());

        dz.dataset.dzOk = 'true';
    }

    /* ── Selección de archivo ────────────────────────────────────────────────── */
    function imvOnFileSelected(input) {
        if (!input.files || !input.files[0]) return;
        _imvMostrarArchivoSeleccionado(input.files[0]);
    }

    function _imvMostrarArchivoSeleccionado(file) {
        document.getElementById('imv-file-name').textContent = file.name;
        document.getElementById('imv-file-size').textContent = _imvFormatBytes(file.size);
        document.getElementById('imv-file-preview').classList.add('show');
        document.getElementById('imv-btn-start').disabled = false;
        const dz = document.getElementById('imv-dropzone');
        if (dz) { dz.style.borderColor = '#16a34a'; dz.style.background = '#f0fdf4'; }
    }

    function imvLimpiarArchivo() {
        const input = document.getElementById('archivo_excel_ventas');
        if (input) input.value = '';
        document.getElementById('imv-file-preview').classList.remove('show');
        document.getElementById('imv-btn-start').disabled = true;
        const dz = document.getElementById('imv-dropzone');
        if (dz) { dz.style.borderColor = ''; dz.style.background = ''; }
    }

    /* ── Importación principal ───────────────────────────────────────────────── */
    async function importarTarifasVentasMasivo() {
        const archivoInput = document.getElementById('archivo_excel_ventas');
        if (!archivoInput?.files?.[0]) {
            Swal.fire({ icon: 'warning', title: 'Sin archivo', text: 'Selecciona un archivo Excel antes de continuar.', confirmButtonText: 'OK' });
            return;
        }

        _imvMostrarSeccion('progress');
        _imvResetSteps();
        _imvSetProgreso(0, 'Iniciando proceso...');
        _imvIniciarSimulacion();

        try {
            const formData = new FormData();
            formData.append('file', archivoInput.files[0]);
            formData.append('empresa_id', document.getElementById('empresa_id')?.value ?? '');
            formData.append('usuario', document.getElementById('ssn_nombre')?.value ?? '');

            const response = await fetch(
                `${$("#base_url_api").val()}tarifas/importar-masivo`,
                { method: 'POST', headers: { 'X-API-KEY': 'nexos_nacional2026@*' }, body: formData }
            );

            const result = await response.json();
            _imvDetenerSimulacion();

            // ── Error de validación (VAL-1 / VAL-2 / VAL-3) ─────────────────
            if (!result.success && result.tipo_error === 'validacion') {
                _imvMarcarStepError(_imvDetectarStepFallido(result.message));
                _imvSetProgreso(0, 'Importación detenida');
                await new Promise(r => setTimeout(r, 400));
                _imvMostrarErrorValidacion(result.message);
                return;
            }

            // ── Éxito o error de sistema ──────────────────────────────────────
            _imvMarcarTodosCompletados();
            _imvSetProgreso(100, '¡Procesamiento completado!');
            await new Promise(r => setTimeout(r, 700));

            if (result.success) {
                _imvMostrarResultado(result);
                await listar_Tarifas_cliente();

                const n = result.resumen?.creadas_pendientes ?? 0;
                if (n > 0) {
                    Swal.fire({
                        icon: 'info',
                        title: `${n} tarifa${n > 1 ? 's' : ''} en bandeja de aprobación`,
                        html: `<strong>${n}</strong> tarifa${n > 1 ? 's requieren' : ' requiere'} aprobación.<br>Revísalas en la <strong>Bandeja de Aprobación</strong>.`,
                        confirmButtonText: 'Entendido',
                        confirmButtonColor: '#1a3c6b',
                    });
                }
            } else {
                _imvMostrarResultadoError(result.message ?? 'Error procesando el archivo.');
                Swal.fire({
                    icon: 'error',
                    title: 'Error en la importación',
                    html: `<p>${result.message ?? 'Error al procesar el archivo.'}</p>${result.error ? `<small class="text-danger">${result.error}</small>` : ''}`,
                    confirmButtonText: 'Cerrar',
                });
            }

        } catch (err) {
            _imvDetenerSimulacion();
            _imvMarcarStepError(IMV_STEPS[0].id);
            console.error('importarTarifasVentasMasivo error:', err);
            _imvMostrarResultadoError('Error de conexión con el servidor.');
            Swal.fire({ icon: 'error', title: 'Error de conexión', html: `<p>${err.message}</p>`, confirmButtonText: 'Cerrar' });
        }
    }

    /* ── Mostrar resultado exitoso ───────────────────────────────────────────── */
    function _imvMostrarResultado(result) {
        const r = result.resumen ?? {};
        _imvMostrarSeccion('result');

        const tienePendientes = (r.creadas_pendientes ?? 0) > 0;
        const tieneErrores = (r.errores ?? 0) > 0;

        if (!tienePendientes && !tieneErrores) {
            document.getElementById('imv-result-icon').textContent = '✅';
            document.getElementById('imv-result-title').textContent = '¡Importación completada!';
            document.getElementById('imv-result-sub').textContent = `${r.creadas_activas ?? 0} tarifa(s) activadas`;
        } else if (tienePendientes && !tieneErrores) {
            document.getElementById('imv-result-icon').textContent = '⏳';
            document.getElementById('imv-result-title').textContent = 'Completada con observaciones';
            document.getElementById('imv-result-sub').textContent = `${r.creadas_pendientes} tarifa(s) requieren aprobación`;
        } else {
            document.getElementById('imv-result-icon').textContent = '⚠️';
            document.getElementById('imv-result-title').textContent = 'Finalizada con errores';
            document.getElementById('imv-result-sub').textContent = 'Revisa los detalles a continuación';
        }

        document.getElementById('imv-sum-activas').textContent = r.creadas_activas ?? 0;
        document.getElementById('imv-sum-pendientes').textContent = r.creadas_pendientes ?? 0;
        document.getElementById('imv-sum-saltadas').textContent = r.saltadas_pendiente ?? 0;
        document.getElementById('imv-sum-errores').textContent = r.errores ?? 0;

        const pendientesList = result.pendientes_detalle ?? [];
        if (pendientesList.length > 0) {
            document.getElementById('imv-block-pendientes').style.display = 'block';
            document.getElementById('imv-badge-pendientes').textContent = pendientesList.length;
            document.getElementById('imv-detail-pendientes').innerHTML = pendientesList.map(p => `
                <div class="im-v-detail-row">
                    <div class="ruta">Fila #${p.fila} · Cliente ${p.cliente_id} — ${p.origen} → ${p.destino} · ${p.tipo}</div>
                    <div class="meta">Tarifa ID: <strong>#${p.tarifa_id}</strong>
                        ${(p.variaciones ?? []).map(v =>
                `<span class="im-v-var-chip alta">${_imvLabelTipo(v.tipo)} ${v.variacion_pct}% (lím. ${v.limite}%)</span>`
            ).join('')}
                    </div>
                </div>`).join('');
            document.getElementById('imv-detail-pendientes').classList.add('open');
        }

        const erroresList = result.errores_detalle ?? [];
        if (erroresList.length > 0) {
            document.getElementById('imv-block-errores').style.display = 'block';
            document.getElementById('imv-badge-errores').textContent = erroresList.length;
            document.getElementById('imv-detail-errores').innerHTML = erroresList.map(e => `
                <div class="im-v-detail-row">
                    <div class="ruta" style="color:#dc2626;">Fila #${e.fila} · Cliente ${e.cliente_id || '?'} — ${e.origen || '?'} → ${e.destino || '?'} · ${e.tipo || '?'}</div>
                    <div class="meta" style="color:#991b1b;">${e.error}</div>
                </div>`).join('');
        }
    }

    /* ── Error de sistema en pantalla resultado ──────────────────────────────── */
    function _imvMostrarResultadoError(mensaje) {
        _imvMostrarSeccion('result');
        document.getElementById('imv-result-icon').textContent = '❌';
        document.getElementById('imv-result-title').textContent = 'Error en la importación';
        document.getElementById('imv-result-sub').textContent = mensaje;
        ['imv-sum-activas', 'imv-sum-pendientes', 'imv-sum-saltadas', 'imv-sum-errores']
            .forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '—'; });
    }

    /* ── Error de validación (Swal diferenciado) ─────────────────────────────── */
    function _imvMostrarErrorValidacion(mensaje) {
        Swal.fire({
            icon: 'warning',
            title: 'El archivo tiene errores — importación cancelada',
            html: `
                <p style="margin-bottom:12px;color:#6b7280;font-size:.9rem;">
                    Se encontró un problema en los datos antes de guardar cualquier registro.
                    <strong>No se modificó nada</strong> en la base de datos.
                </p>
                <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;
                            padding:12px 16px;text-align:left;font-size:.85rem;color:#92400e;
                            font-family:'Courier New',monospace;white-space:pre-wrap;
                            word-break:break-word;line-height:1.6;">
                    ${_imvEscapeHtml(mensaje)}
                </div>
                <p style="margin-top:12px;color:#6b7280;font-size:.8rem;">
                    Corrige el archivo Excel y vuelve a intentarlo.
                </p>`,
            confirmButtonText: '<i class="fas fa-file-excel me-1"></i> Corregir archivo',
            confirmButtonColor: '#d97706',
            showCancelButton: false,
            width: 560,
        }).then(() => imvReset());
    }

    /* ── Detectar qué step marcar como error ─────────────────────────────────── */
    function _imvDetectarStepFallido(mensaje) {
        if (!mensaje) return IMV_STEPS[0].id;
        const m = mensaje.toLowerCase();
        if (m.includes('"multidestino"')) return 'imv-step-multidestino';
        if (m.includes('"multiorigen"')) return 'imv-step-multiorigen';
        if (m.includes('"archivo"')) return 'imv-step-archivo';
        return IMV_STEPS[0].id;
    }

    /* ── Acordeón de detalles ────────────────────────────────────────────────── */
    function imvToggleDetalle(tipo) {
        document.getElementById(`imv-detail-${tipo}`)?.classList.toggle('open');
    }

    /* ── Cerrar y resetear ───────────────────────────────────────────────────── */
    function imvCerrar() {
        const el = document.getElementById('offcanvasImporteMasivoVentas');
        const oc = el ? bootstrap.Offcanvas.getInstance(el) : null;
        if (oc) oc.hide();
        setTimeout(() => imvReset(), 300);
    }

    function imvReset() {
        imvLimpiarArchivo();
        _imvDetenerSimulacion();
        _imvResetSteps();
        _imvSetProgreso(0, 'Iniciando proceso...');
        ['imv-block-pendientes', 'imv-block-errores'].forEach(id => {
            const el = document.getElementById(id); if (el) el.style.display = 'none';
        });
        ['imv-detail-pendientes', 'imv-detail-errores'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.innerHTML = ''; el.classList.remove('open'); }
        });
        _imvMostrarSeccion('upload');
    }

    /* ── Progreso y steps ────────────────────────────────────────────────────── */
    function _imvMostrarSeccion(seccion) {
        ['upload', 'progress', 'result'].forEach(s => {
            const el = document.getElementById(`imv-${s}-section`);
            if (el) el.style.display = s === seccion ? 'block' : 'none';
        });
    }

    function _imvSetProgreso(pct, titulo, sub) {
        const fill = document.getElementById('imv-progress-fill');
        const lbl = document.getElementById('imv-pct-label');
        const right = document.getElementById('imv-pct-right');
        const title = document.getElementById('imv-prog-title');
        const subEl = document.getElementById('imv-prog-sub');
        if (fill) fill.style.width = pct + '%';
        if (lbl) lbl.textContent = pct + '%';
        if (right) right.textContent = pct + '%';
        if (title && titulo) title.textContent = titulo;
        if (subEl && sub) subEl.textContent = sub;
    }

    function _imvResetSteps() {
        IMV_STEPS.forEach(s => { const el = document.getElementById(s.id); if (el) el.className = 'im-v-step'; });
    }

    function _imvMarcarStepActivo(stepId) {
        const el = document.getElementById(stepId);
        if (el && !el.classList.contains('done')) el.className = 'im-v-step active';
    }

    function _imvMarcarStepDone(stepId) {
        const el = document.getElementById(stepId);
        if (el) {
            el.className = 'im-v-step done';
            const dot = el.querySelector('.im-v-step-dot');
            if (dot) dot.innerHTML = '<i class="fas fa-check"></i>';
        }
    }

    function _imvMarcarStepError(stepId) {
        const el = document.getElementById(stepId);
        if (el) {
            el.className = 'im-v-step error';
            const dot = el.querySelector('.im-v-step-dot');
            if (dot) dot.innerHTML = '<i class="fas fa-times"></i>';
        }
    }

    function _imvMarcarTodosCompletados() {
        IMV_STEPS.forEach(s => _imvMarcarStepDone(s.id));
    }

    function _imvIniciarSimulacion() {
        let stepIdx = 0, pct = 0;
        _imvMarcarStepActivo(IMV_STEPS[0].id);
        _imvSetProgreso(5, IMV_STEPS[0].msg);

        _imvTimerInterval = setInterval(() => {
            const siguiente = stepIdx < IMV_STEPS.length ? IMV_STEPS[stepIdx].pct : 95;
            pct += Math.random() * 4 + 1;
            if (pct > siguiente - 1) pct = siguiente - 1;
            if (pct > 95) pct = 95;
            _imvSetProgreso(Math.round(pct));

            if (stepIdx < IMV_STEPS.length && pct >= IMV_STEPS[stepIdx].pct - 3) {
                _imvMarcarStepDone(IMV_STEPS[stepIdx].id);
                stepIdx++;
                if (stepIdx < IMV_STEPS.length) {
                    _imvMarcarStepActivo(IMV_STEPS[stepIdx].id);
                    const titleEl = document.getElementById('imv-prog-title');
                    if (titleEl) titleEl.textContent = IMV_STEPS[stepIdx].msg;
                }
            }
        }, 1200);
    }

    function _imvDetenerSimulacion() {
        if (_imvTimerInterval) { clearInterval(_imvTimerInterval); _imvTimerInterval = null; }
    }

    /* ── Descarga de plantilla ───────────────────────────────────────────────── */
    function imvDescargarPlantilla() {
        window.location.href = `${$("#base_url").val()}public/files/Plantilla_Tarifa_Venta.xlsx`;
    }

    /* ── Helpers internos ────────────────────────────────────────────────────── */
    function _imvFormatBytes(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }

    function _imvLabelTipo(tipo) {
        return { PLENA: 'Plena', MULTI_RECOGIDA: 'Recogida', MULTI_ENTREGA: 'Entrega', MULTI_ORIGEN: 'Multi-Origen', MULTI_DESTINO: 'Multi-Destino' }[tipo] ?? tipo;
    }

    function _imvEscapeHtml(texto) {
        return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    /* ── Histórico de tarifas ────────────────────────────────────────────────── */
    function renderHistoricoTarifas(historico) {
        // console.log("🚀 ~ renderHistoricoTarifas ~ historico:", historico)
        const container = document.getElementById("historico-tarifas-container");
        container.innerHTML = "";

        if (!historico || historico.length === 0) {
            container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay registros históricos</td></tr>';
            return;
        }

        const formatMoney = (v) => Number(v).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

        historico.forEach(h => {
            container.insertAdjacentHTML("beforeend", `
            <tr>
                <td class="fw-bold">${h.fecha ? h.fecha.split('T')[0] : '--'}</td>
                <td class="text-primary">${formatMoney(h.tarifa)}</td>
                <td>
                    <small class="d-block text-muted">Desde: ${h.fecha_inicio.split('T')[0]}</small>
                    <small class="d-block text-muted">Hasta: ${h.fecha_fin.split('T')[0]}</small>
                </td>
                <td><span class="badge ${h.estado_tarifa === 'Activa' ? 'bg-success' : 'bg-secondary'}" style="font-size:0.6rem">${h.estado_tarifa}</span></td>
                <td style='width:auto; white-space: nowrap;'>
                    ${h.estado_aprobacion === "Pendiente Aprobacion" || h.estado_aprobacion === "Rechazada"
                    ? `<span class="badge badge-phoenix badge-phoenix-danger">${h.estado_aprobacion ?? ""}</span>`
                    : `<span class="badge badge-phoenix badge-phoenix-success">${h.estado_aprobacion ?? ""}</span>`}
                </td>
                <td><i class="bi bi-person me-1"></i>${h.usuario || 'N/A'}</td>
            </tr>`);
        });
    }

    /* ── Exposición pública ──────────────────────────────────────────────────── */
    window.imvOnFileSelected = imvOnFileSelected;
    window.imvLimpiarArchivo = imvLimpiarArchivo;
    window.importarTarifasVentasMasivo = importarTarifasVentasMasivo;
    window.imvToggleDetalle = imvToggleDetalle;
    window.imvCerrar = imvCerrar;
    window.imvReset = imvReset;
    window.imvDescargarPlantilla = imvDescargarPlantilla;

})();

function currencyMask(value, locale = "en-US") {
    if (value === null || value === undefined || value === "") return "";
    // quitar separadores previos (comas) y espacios
    const clean = String(value).replace(/,/g, "").trim();
    const num = Number(clean);
    if (isNaN(num)) return "";
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
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

/* ===================================================================
 |  Descarga de plantilla
 | =================================================================== */

function descargarPlantillaMasivo() {
    let base = $("#base_url").val();
    let url = base + "public/files/Plantilla_Tarifa_Ventas.xlsx";

    window.location.href = url;
}

/* ===================================================================
 |  UI — GESTIÓN DE FILTROS DE CONSULTA
 |  Funciones para el panel de filtros mejorado (filtros_tarifa_ventas)
 | =================================================================== */

/**
 * Muestra / oculta el panel de filtros avanzados y rota el ícono chevron.
 */
// function toggleFilters() {
//     const panel = document.getElementById("advancedFilters");
//     const btn = document.getElementById("toggleAdvanced");
//     if (!panel || !btn) return;

//     const isOpen = panel.classList.contains("show");
//     panel.classList.toggle("show", !isOpen);
//     btn.classList.toggle("open", !isOpen);
// }

/**
 * Limpia todos los campos de filtro y borra los chips activos.
 */
function limpiarFiltros() {
    const fields = [
        "f_fecha_desde", "f_fecha_hasta",
        "f_search", "f_tipo_vehiculo", "f_estado_tarifa",
        "f_origen", "f_destino",
        "f_semana_desde", "f_semana_hasta",
        "f_mes_desde", "f_mes_hasta",
    ];

    fields.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    const pend = document.getElementById("f_pendientes");
    if (pend) pend.checked = false;

    renderChips();
}

/**
 * Renderiza los chips de filtros avanzados activos
 * (los que NO son fecha_desde / fecha_hasta ni search básico).
 */
function renderChips() {
    const container = document.getElementById("activeFilterChips");
    if (!container) return;

    const map = {
        f_origen: "Origen",
        f_destino: "Destino",
        f_semana_desde: "Sem. desde",
        f_semana_hasta: "Sem. hasta",
        f_mes_desde: "Mes desde",
        f_mes_hasta: "Mes hasta",
    };

    container.innerHTML = "";

    Object.entries(map).forEach(([id, label]) => {
        const el = document.getElementById(id);
        if (el && el.value) {
            const chip = document.createElement("div");
            chip.className = "filter-chip";
            chip.innerHTML = `
                <span>${label}: <strong>${el.options ? el.options[el.selectedIndex]?.text : el.value}</strong></span>
                <button onclick="clearFilterField('${id}')" title="Quitar filtro">
                    <i class="bi bi-x-lg" style="font-size:.65rem;"></i>
                </button>`;
            container.appendChild(chip);
        }
    });

    const pend = document.getElementById("f_pendientes");
    if (pend && pend.checked) {
        const chip = document.createElement("div");
        chip.className = "filter-chip";
        chip.innerHTML = `
            <span>Solo pendientes</span>
            <button onclick="document.getElementById('f_pendientes').checked=false; renderChips();" title="Quitar">
                <i class="bi bi-x-lg" style="font-size:.65rem;"></i>
            </button>`;
        container.appendChild(chip);
    }
}

/**
 * Limpia un campo individual de filtro y re-renderiza los chips.
 * @param {string} id  ID del campo a limpiar.
 */
function clearFilterField(id) {
    const el = document.getElementById(id);
    if (el) el.value = "";
    renderChips();
}

/* Escuchar cambios en los filtros avanzados para actualizar chips en tiempo real */
document.addEventListener("DOMContentLoaded", function () {
    [
        "f_origen", "f_destino",
        "f_semana_desde", "f_semana_hasta",
        "f_mes_desde", "f_mes_hasta",
        "f_pendientes",
    ].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("change", renderChips);
    });
});