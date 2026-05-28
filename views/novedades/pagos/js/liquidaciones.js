window.VENTANA = "";
// Variable global para el título del detalle

window.initScript = function (id) {
    window.VENTANA = id;
    Lista_general_pagos();

    document.addEventListener("click", async e => {
        // if (e.target.matches(`#campo-${window.VENTANA}-filtrar`) || e.target.matches(`#campo-${window.VENTANA}-filtrar *`)) {
        //     let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
        //     let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;

        //     GraficarInstruccionesFacturacion(fecha_inicial, fecha_final);
        // }

        if (e.target.closest(`#btn-detalle-liquidaciones`) || e.target.closest(`#btn-detalle-liquidaciones *`)) {
            e.preventDefault();

            let Boton = e.target.closest(`#btn-detalle-liquidaciones`);
            const nitTitular = Boton.getAttribute('data-nit-titular');
            const tenedor = Boton.getAttribute('data-tenedor');
            const conductor = Boton.getAttribute('data-conductor');
            const direccion = Boton.getAttribute('data-direccion');
            const celular = Boton.getAttribute('data-celular');
            const municipio = Boton.getAttribute('data-municipio');

            if (!nitTitular) {
                Swal.fire('Error', 'No se puede obtener el identificador del titular.', 'error');
                return;
            }

            Swal.fire({
                title: 'Cargando Detalle...',
                icon: 'info',
                showConfirmButton: false
            });

            try {
                const formData = new FormData();
                formData.append('nit_titular', nitTitular);
                formData.append('Procedencia', 'Liquidaciones');

                const response = await fetch($('#base_url').val() + 'novedades/obtenerDetalleManifiestos', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                Swal.close();

                if (result.status === true) {
                    // 🚨 1. Generar el contenido HTML
                    const htmlDetalle = generarHtmlDetalleManifiestos(result.data, result.nit, tenedor, conductor, direccion, celular, municipio);

                    // 2. Inyectar y mostrar el offcanvas
                    const offcanvasEl = document.getElementById('offcanvasDetalleManifiestosLiquidacion');
                    const contentDiv = document.getElementById('detalleManifiestoContentLiquidacion');

                    if (contentDiv) {
                        contentDiv.innerHTML = htmlDetalle;

                        // Actualizar el título del offcanvas
                        document.getElementById('offcanvasDetalleLabel').textContent = `Manifiestos de NIT/CC: ${result.nit}`;

                        // Mostrar el offcanvas (asumiendo Bootstrap 5)
                        const bsOffcanvas = new bootstrap.Offcanvas(offcanvasEl);
                        bsOffcanvas.show();

                    } else {
                        Swal.fire('Error', 'Contenedor de detalle no encontrado.', 'error');
                    }

                } else {
                    Swal.fire('Error', result.message || 'No se pudo cargar el detalle de manifiestos.', 'error');
                }

            } catch (error) {
                Swal.fire('Error de Conexión', 'Fallo al comunicarse con el servidor.', 'error');
                console.error('Fetch error:', error);
            }
        }

        //Liquidacion
        // 🛑 Listener para el botón de LIQUIDACIÓN
        if (e.target.matches(`#btn-liquidacion`) || e.target.matches(`#btn-liquidacion *`)) {
            let Boton = e.target.closest(`#btn-liquidacion`);

            // 1. Captura de datos
            const Numdoc_Tenedor = Boton.getAttribute('data-numdoc-tenedor');
            const Valor_Liquidacion_Original = Boton.getAttribute('data-valor-liquidacion'); // Saldo original
            const Tenedor = Boton.getAttribute('data-nit-titular');
            const Nombre_tenedor = Boton.getAttribute('data-tenedor');
            const Manifiesto = Boton.getAttribute('data-manifiesto');

            // 🛑 DATOS DEL SOBRE ANTICIPO (AJUSTE)
            const Sobreanticipo = Boton.getAttribute('data-sobreanticipo');
            const SaldoLiquidacion_Ajustado = Boton.getAttribute('data-saldoliquidacio'); // Saldo después de Sobre Anticipo

            if (!Numdoc_Tenedor) {
                Swal.fire('Error', 'Documento del tenedor no disponible.', 'error');
                return;
            }

            // 2. Mostrar indicador de validación
            Swal.fire({
                title: 'Validando requisitos de pago...',
                text: 'Verificando datos bancarios y documentación.',
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick: false
            });

            const formData = new FormData();
            formData.append('Numdoc_Conductor', Numdoc_Tenedor);

            try {
                const response = await fetch($('#base_url').val() + 'novedades/validarDatosAnticipo', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                Swal.close();

                if (result.status === true) {
                    // 3. ÉXITO: Abrir el bloque de liquidación
                    Swal.fire('Validación Completa', result.message, 'success');

                    document.getElementById(`bloque_liquidacion`).style.display = '';
                    document.getElementById(`bloque-pagos`).style.display = 'none';
                    // document.getElementById(`bloque_pago`).style.display = 'none';

                    // 🛑 LÓGICA DE VALOR A PAGAR (AJUSTADO)
                    // let valorFinalAPagar = 0;

                    // 🛑 4. LÓGICA DE CÁLCULO Y RESUMEN

                    // Funciones auxiliares para limpiar y formatear moneda
                    const limpiarFormatoMoneda = (str) => {
                        if (!str) return 0;
                        let limpio = String(str).replace(/[$. ]/g, '').replace(',', '.');
                        return parseFloat(limpio) || 0;
                    };
                    const formatearMoneda = (val) => {
                        return (val || 0).toLocaleString('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                        });
                    };

                    let valorFinalAPagar = 0;
                    let calculoHtml = '';

                    // Si 'SaldoLiquidacion_Ajustado' NO es nulo, indefinido, o vacío, usamos ese valor.
                    if (SaldoLiquidacion_Ajustado && SaldoLiquidacion_Ajustado.trim() !== '') {
                        valorFinalAPagar = SaldoLiquidacion_Ajustado;
                    } else {
                        // Si no hay saldo ajustado (no hubo sobreanticipo), usamos el saldo original.
                        valorFinalAPagar = Valor_Liquidacion_Original;
                    }

                    // 4. Formatear y Llenar el campo de Valor
                    const valorLimpio = parseFloat(String(valorFinalAPagar).replace(/[^0-9.-]+/g, "") || 0);
                    const valorFormateado = valorLimpio.toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0
                    });


                    const saldoOriginalLimpio = Valor_Liquidacion_Original;
                    const sobreAnticipoLimpio = parseFloat(Sobreanticipo);
                    const saldoAjustadoLimpio = parseFloat(SaldoLiquidacion_Ajustado);

                    // Si 'SaldoLiquidacion_Ajustado' o 'Sobreanticipo' tienen valor, mostramos el cálculo
                    if (sobreAnticipoLimpio > 0 && SaldoLiquidacion_Ajustado) {
                        valorFinalAPagar = saldoAjustadoLimpio;

                        // 🛑 NUEVO: Generar el HTML del resumen
                        calculoHtml = `
                        <h6 class="alert-heading">Detalle del Saldo</h6>
                        <hr class="my-1">
                        <div class="d-flex justify-content-between"><span>Saldo Original:</span> <strong>$ ${formatearMoneda(saldoOriginalLimpio)}</strong></div>
                        <div class="d-flex justify-content-between"><span>Sobre Anticipo Pagado:</span> <strong class="text-danger">-${formatearMoneda(sobreAnticipoLimpio)}</strong></div>
                        <hr class="my-1">
                        <div class="d-flex justify-content-between"><span>Nuevo Saldo a Pagar:</span> <strong>${formatearMoneda(saldoAjustadoLimpio)}</strong></div>
                    `;

                    } else {
                        // Si no hay saldo ajustado (no hubo sobreanticipo), usamos el saldo original.
                        valorFinalAPagar = saldoOriginalLimpio;
                        calculoHtml = `<div class="d-flex justify-content-between"><span>Saldo a Pagar:</span> <strong>${formatearMoneda(saldoOriginalLimpio)}</strong></div>`;
                    }

                    // 🛑 5. Inyectar el resumen HTML en el contenedor
                    const contenedorResumen = document.getElementById('resumen_calculo_liquidacion');
                    if (contenedorResumen) {
                        contenedorResumen.innerHTML = calculoHtml;
                        contenedorResumen.style.display = 'block'; // Mostrar el bloque
                    }

                    document.getElementById('valor_liquidacion').value = valorFormateado;

                    // 5. Llenar campos de Beneficiario y data-attributes
                    document.getElementById(`beneficiario_liquidacion`).value = Tenedor + ' - ' + Nombre_tenedor;
                    document.getElementById(`btn-buscar-beneficiario-liquidacion`).setAttribute('data-numdoc-tenedor', Numdoc_Tenedor);
                    document.getElementById(`btn-buscar-beneficiario-liquidacion-rut`).setAttribute('data-numdoc-tenedor', Numdoc_Tenedor);
                    document.getElementById(`btn-buscar-beneficiario-liquidacion-seguridad`).setAttribute('data-numdoc-tenedor', Numdoc_Tenedor);
                    document.getElementById(`btn-guardar-liquidacion`).setAttribute('data-manifiesto', Manifiesto);
                    document.getElementById(`btn-guardar-liquidacion`).setAttribute('data-numdoc-tenedor', Numdoc_Tenedor);

                    // 🛑 LLAMADA A INICIALIZACIÓN
                    inicializarFormularioAnticipo(result.validacion);

                } else {
                    // 6. FALLO: Mostrar el mensaje de error detallado
                    Swal.fire('Validación Requerida', result.message, 'warning');
                }

            } catch (error) {
                Swal.fire('Error de Conexión', 'No se pudo comunicar con el servidor para la validación.', 'error');
                console.error('Fetch error:', error);
            }
        }

        //Liquidacion
        if (e.target.matches(`#btn-buscar-beneficiario-liquidacion`) || e.target.matches(`#btn-buscar-beneficiario-liquidacion *`)) {
            let Boton = e.target.closest(`#btn-buscar-beneficiario-liquidacion`);
            const Numdoc_Conductor = Boton.getAttribute('data-numdoc-tenedor');

            try {
                const formData = new FormData();
                formData.append('id_proveedor', Numdoc_Conductor);

                const response = await fetch($('#base_url').val() + 'novedades/listarDatosFinancieros', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                // ✅ MÁS LEGIBLE - Template literals:
                // window.open(`${$('#base_url').val()}public/files/proveedores/financieros/${result.data[0]['certificado_adjunto']}`, '_blank');

                // ✅ REEMPLAZA TU CÓDIGO ACTUAL CON ESTE:
                const baseUrl = $('#base_url').val();
                const archivo = result.data[0]['certificado_adjunto'];
                const urlCompleta = baseUrl + 'public/files/proveedores/financieros/' + archivo;

                // Configuración de ventana centrada
                const ancho = 1000;
                const alto = 700;
                const left = (window.screen.width - ancho) / 2;
                const top = (window.screen.height - alto) / 2;

                window.open(
                    urlCompleta,
                    '_blank',
                    `width=${ancho},height=${alto},left=${left},top=${top},scrollbars=yes,resizable=yes,location=no,menubar=no,toolbar=no,status=no`
                );
            } catch (error) {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error de carga.</td></tr>`;
                console.error('Listado Error:', error);
            }

        }

        if (e.target.matches(`#btn-buscar-beneficiario-liquidacion-rut`) || e.target.matches(`#btn-buscar-beneficiario-liquidacion-rut *`)) {
            let Boton = e.target.closest(`#btn-buscar-beneficiario-liquidacion-rut`);
            const Numdoc_Conductor = Boton.getAttribute('data-numdoc-tenedor');

            try {
                const formData = new FormData();
                formData.append('id_proveedor', Numdoc_Conductor);

                const response = await fetch($('#base_url').val() + 'novedades/listarDatosFinancieros', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                // ✅ MÁS LEGIBLE - Template literals:
                // window.open(`${$('#base_url').val()}public/files/proveedores/financieros/${result.data[0]['certificado_adjunto']}`, '_blank');

                // ✅ REEMPLAZA TU CÓDIGO ACTUAL CON ESTE:
                const baseUrl = $('#base_url').val();
                const archivo = result.data[0]['documento_rut'];
                const urlCompleta = baseUrl + 'public/files/proveedores/financieros/' + archivo;

                // Configuración de ventana centrada
                const ancho = 1000;
                const alto = 700;
                const left = (window.screen.width - ancho) / 2;
                const top = (window.screen.height - alto) / 2;

                window.open(
                    urlCompleta,
                    '_blank',
                    `width=${ancho},height=${alto},left=${left},top=${top},scrollbars=yes,resizable=yes,location=no,menubar=no,toolbar=no,status=no`
                );
            } catch (error) {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error de carga.</td></tr>`;
                console.error('Listado Error:', error);
            }

        }

        if (e.target.matches(`#btn-buscar-beneficiario-liquidacion-seguridad`) || e.target.matches(`#btn-buscar-beneficiario-liquidacion-seguridad *`)) {
            let Boton = e.target.closest(`#btn-buscar-beneficiario-liquidacion-seguridad`);
            const Numdoc_Conductor = Boton.getAttribute('data-numdoc-tenedor');

            try {
                const formData = new FormData();
                formData.append('id_proveedor', Numdoc_Conductor);

                const response = await fetch($('#base_url').val() + 'novedades/listarDatosFinancieros', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                // ✅ MÁS LEGIBLE - Template literals:
                // window.open(`${$('#base_url').val()}public/files/proveedores/financieros/${result.data[0]['certificado_adjunto']}`, '_blank');

                // ✅ REEMPLAZA TU CÓDIGO ACTUAL CON ESTE:
                const baseUrl = $('#base_url').val();
                const archivo = result.data[0]['documento_eps'];
                const urlCompleta = baseUrl + 'public/files/proveedores/financieros/' + archivo;

                // Configuración de ventana centrada
                const ancho = 1000;
                const alto = 700;
                const left = (window.screen.width - ancho) / 2;
                const top = (window.screen.height - alto) / 2;

                window.open(
                    urlCompleta,
                    '_blank',
                    `width=${ancho},height=${alto},left=${left},top=${top},scrollbars=yes,resizable=yes,location=no,menubar=no,toolbar=no,status=no`
                );
            } catch (error) {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error de carga.</td></tr>`;
                console.error('Listado Error:', error);
            }

        }

        // 🛑 Listener para GUARDAR LIQUIDACIÓN
        if (e.target.matches('#btn-guardar-liquidacion') || e.target.matches('#btn-guardar-liquidacion *')) {
            e.preventDefault();

            let Boton = e.target.closest('#btn-guardar-liquidacion');

            // 1. Captura de datos esenciales (Manifiesto y Tenedor)
            const manifiestoId = Boton.getAttribute('data-manifiesto');
            const numdocTenedor = Boton.getAttribute('data-numdoc-tenedor'); // ID del Tenedor

            // 🛑 Datos del formulario de Liquidación
            const valorLiquidacionStr = document.getElementById('valor_liquidacion').value;
            const fecha_liquidacion = document.getElementById('fecha_liquidacion').value;
            const documentoInput = document.getElementById('documento_liquidacion');
            const documento_liquidacion = documentoInput.files[0] ?? null;

            // 🛑 Captura de campos de pago (IDs específicos de Liquidación)
            const slct_metodo_pago = document.getElementById('slct_metodo_pago_liquidacion').value;
            const slct_tarjeta_disponible = document.getElementById('slct_tarjeta_disponible_liquidacion').value;
            const slct_cuenta_bancaria = document.getElementById('slct_cuenta_bancaria_liquidacion').value;
            const chkNuevaCuenta = document.getElementById('chk_inscribir_nueva_cuenta_liquidacion').checked;

            let errores = [];

            // ------------------------------------------------------------------
            // 2. VALIDACIONES DE OBLIGATORIEDAD
            // ------------------------------------------------------------------

            if (!manifiestoId) { errores.push('Error interno: Manifiesto ID no disponible.'); }
            if (!valorLiquidacionStr) { errores.push('Debe ingresar un <strong>Valor para la Liquidación</strong>.'); }
            if (!fecha_liquidacion) { errores.push('Debe seleccionar la <strong>Fecha de Liquidación</strong>.'); }
            if (!documento_liquidacion) { errores.push('Debe adjuntar el <strong>Documento Soporte</strong>.'); }
            if (!slct_metodo_pago) { errores.push('Debe seleccionar el <strong>Método de Pago</strong>.'); }

            // Validación condicional del destino de pago
            if (slct_metodo_pago === 'TARJETA' && !slct_tarjeta_disponible) {
                errores.push('Debe seleccionar una <strong>Tarjeta Disponible</strong>.');
            } else if (slct_metodo_pago.includes('CUENTA') && !slct_cuenta_bancaria && !chkNuevaCuenta) {
                errores.push('Debe seleccionar una <strong>Cuenta de Destino</strong> o <strong>Inscribir una Nueva</strong>.');
            }

            // ------------------------------------------------------------------
            // 3. VALIDACIÓN DE LÓGICA DE NEGOCIO (Saldos)
            // ------------------------------------------------------------------

            // Función auxiliar para limpiar el formato de moneda (ej: "$ 1.200.000,00" -> 1200000.00)
            const limpiarFormatoMoneda = (str) => {
                if (!str) return 0;
                let limpio = String(str).replace(/[$. ]/g, '').replace(',', '.');
                return parseFloat(limpio) || 0;
            };

            const valorLiquidacionNum = limpiarFormatoMoneda(valorLiquidacionStr);

            if (valorLiquidacionNum <= 0) {
                errores.push('El valor de la Liquidación debe ser mayor a 0.');
            }

            // 🛑 (Opcional) Validación de Saldo: Si la liquidación supera el saldo pendiente (si tienes esos datos)
            // const saldoPendiente = limpiarFormatoMoneda(Boton.getAttribute('data-saldoliquidacio'));
            // if (valorLiquidacionNum > saldoPendiente) {
            //     errores.push('El valor a liquidar no puede superar el saldo pendiente.');
            // }


            // 4. MOSTRAR ERRORES O CONTINUAR
            if (errores.length > 0) {
                const listaErrores = errores.map(msg => `<li>${msg}</li>`).join('');
                Swal.fire({
                    title: 'Campos Incompletos',
                    html: `<ul class="text-start ps-4">${listaErrores}</ul>`,
                    icon: 'warning'
                });
                return;
            }

            // 5. PREPARAR FORM DATA
            Swal.fire({ title: 'Guardando Liquidación...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

            const formData = new FormData();
            formData.append('manifiesto_id', manifiestoId);
            formData.append('numdoc_tenedor', numdocTenedor);
            formData.append('liquidacion', valorLiquidacionStr); // Valor formateado (el Modelo lo limpiará)
            formData.append('fecha_liquidacion', fecha_liquidacion);
            formData.append('documento_liquidacion', documento_liquidacion);

            // Datos de Pago
            formData.append('slct_metodo_pago', slct_metodo_pago);
            formData.append('id_cuenta_destino', slct_cuenta_bancaria || slct_tarjeta_disponible);
            formData.append('tipo_item', 'LIQUIDACION'); // 🛑 CLAVE para el backend

            // Datos de Nueva Cuenta (si aplica)
            if (chkNuevaCuenta && slct_metodo_pago === 'NUEVA_CUENTA') {
                formData.append('inscribir_nueva_cuenta', true);
                formData.append('nuevo_num_cuenta', document.getElementById('txt_num_cuenta_nuevo_liquidacion').value);
                formData.append('nuevo_banco', document.getElementById('slct_banco_nuevo_liquidacion').value);
                formData.append('nuevo_tipo_cuenta', document.getElementById('slct_tipo_cuenta_nuevo_liquidacion').value);
            }

            // 6. EJECUCIÓN DEL FETCH
            try {
                const response = await fetch($('#base_url').val() + 'novedades/UpdateLiquidacion', {
                    method: 'POST', body: formData
                });
                const result = await response.json();
                Swal.close();

                if (result.status === 'success' || result.status === true) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Liquidación Guardada!',
                        text: result.message,
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        location.reload(); // Recargar la vista
                        document.getElementById(`bloque_liquidacion`).style.display = 'none';
                    });
                } else {
                    Swal.fire('Error', result.message || 'Error al procesar la transacción.', 'error');
                }
            } catch (error) {
                Swal.close();
                Swal.fire('Error', 'Fallo de conexión.', 'error');
            }
        }

        if (e.target.matches(`#btn-cancelar-liquidacion`) || e.target.matches(`#btn-cancelar-liquidacion *`)) {
            document.getElementById(`bloque_liquidacion`).style.display = 'none';
            limpiarBloqueLiquidacion();
        }
    });
}

function Lista_general_pagos() {

    const tbody = document.getElementById("tbody-pagos-liquidaciones");
    const baseUrl = $("#base_url").val(); // Asumo que tienes jQuery cargado

    // 1. Placeholder de carga
    tbody.innerHTML = `<tr><td colspan="6" class="text-muted">⏳ Cargando listado de pagos generales...</td></tr>`;

    // 2. Fetch al Controlador
    fetch(baseUrl + 'novedades/obtenerListaGeneralLiquidaciones', {
        method: 'POST',
        cache: 'no-cache',
        // No enviamos body porque el modelo no necesita parámetros
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor: ' + response.statusText);
            }
            return response.json();
        })
        .then(result => {
            if (result.status && result.data && result.data.length > 0) {

                let template = '';
                let totalManifiestos = 0; // 👈 Inicializar contador

                // 3. Generar filas de la tabla
                result.data.forEach(element => {
                    // Sumar la cantidad para el total general
                    totalManifiestos += parseInt(element.cantidad_manifiesto);
                    template += `
                    <tr>
                        <td>
                            <a class="text-decoration-none fw-bold" href='#' id='btn-detalle-liquidaciones' data-nit-titular='${element.Nit_titular}' data-tenedor='${element.Tenedor}' data-conductor='${element.Conductor}' data-direccion='${element.direccion}' 
                            data-celular='${element.celular}' data-municipio='${element.Municipio}'>${element.Nit_titular}</a>
                        </td>
                        <td>${element.Tenedor}</td>
                       <!-- <td>${element.Conductor}</td>-->
                        <td>${element.direccion}</td>
                        <td>${element.celular}</td>
                        <td>${element.Municipio}</td>
                        <td class="fw-bold">${element.cantidad_manifiesto}</td>
                    </tr>
                `;
                });

                tbody.innerHTML = template;

                // 🚨 ASIGNAR EL TOTAL AL FOOTER
                document.getElementById('total-manifiestos-liquidaciones').textContent = totalManifiestos.toLocaleString();

            } else {
                // Sin datos
                tbody.innerHTML = `<tr><td colspan="6" class="alert alert-info">No se encontraron manifiestos con pagos.</td></tr>`;
            }
        })
        .catch(error => {
            console.error("Fetch Error:", error);
            tbody.innerHTML = `<tr><td colspan="7" class="alert alert-danger">Error al cargar la lista: ${error.message}</td></tr>`;
        });
}


/**
 * Función que realiza la petición y llena el select con las tarjetas asignadas vigentes.
 *
 * @param {string} idProveedor ID del conductor/proveedor para el cual buscar tarjetas.
 */
async function listarTarjetasParaAnticipo(idProveedor) {
    const select = $('#slct_tarjeta_disponible_liquidacion');
    select.empty().append('<option value="">Cargando tarjetas...</option>');

    if (!idProveedor) {
        select.html('<option value="">Error: No hay proveedor seleccionado</option>');
        return;
    }

    const formData = new FormData();
    formData.append('id_proveedor', idProveedor); // Enviamos el ID del conductor

    try {
        const response = await fetch($('#base_url').val() + 'novedades/listarTarjetasAsignadas', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.status && result.data.length > 0) {
            let html = '<option value="">Seleccione Tarjeta</option>';

            result.data.forEach(item => {
                const ultimosDigitos = item.numero_tarjeta.slice(-4);
                const nombreMostrar = `${item.nombre_banco} (***${ultimosDigitos})`;

                // 🛑 El valor es el ID de la tarjeta (t.id)
                html += `<option value="${item.id_tarjeta}">${nombreMostrar}</option>`;
            });

            select.html(html);
        } else {
            select.html('<option value="">No hay tarjetas asignadas vigentes</option>');
            // 🛑 NOTA: Si este mensaje aparece, el usuario deberá usar la opción 'NUEVA_CUENTA'.
        }

    } catch (error) {
        console.error('Error al listar tarjetas asignadas:', error);
        select.html('<option value="">Error de carga de tarjetas</option>');
    }
}

/**
 * Función que realiza la petición para obtener cuentas bancarias vigentes y bancos disponibles.
 *
 * @param {string} idProveedor ID del conductor/proveedor para el cual buscar cuentas.
 */
async function listarCuentasParaAnticipo(idProveedor) {
    const selectCuentas = $('#slct_cuenta_bancaria_liquidacion');
    const selectBancoNuevo = $('#slct_banco_nuevo_liquidacion');

    // Limpieza inicial
    selectCuentas.empty().append('<option value="">Cargando cuentas...</option>');
    selectBancoNuevo.empty().append('<option value="">Seleccione Banco</option>');

    if (!idProveedor) {
        selectCuentas.html('<option value="">Error: No hay proveedor seleccionado</option>');
        selectBancoNuevo.html('<option value="">Error: Carga fallida</option>');
        return;
    }

    const formData = new FormData();
    formData.append('id_proveedor', idProveedor);

    try {
        const response = await fetch($('#base_url').val() + 'novedades/listarCuentasYBancosParaAnticipo', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.status && result.data) {
            const { cuentas, bancos_disponibles } = result.data;

            // 🛑 Llenar Select de Cuentas Existentes (#slct_cuenta_bancaria_liquidacion)
            let htmlCuentas = '<option value="">Seleccione Cuenta Existente</option>';
            if (cuentas.length > 0) {
                cuentas.forEach(item => {
                    const ultimosDigitos = String(item.numero_cuenta).slice(-4);
                    const tipoCuenta = item.tipo_cuenta === '1' ? 'Ahorros' : 'Corriente';
                    const display = `${item.nombre_banco} (${tipoCuenta} ***${ultimosDigitos})`;

                    // Almacenamos el ID del registro de la tabla cmx_proveedor_financieros (pf.id) como valor
                    // y el ID del banco para futura referencia.
                    htmlCuentas += `<option value="${item.id}" data-banco-id="${item.id_banco}" data-tipo-cuenta="${item.tipo_cuenta}"  data-cert-ruta="${item.certificado_adjunto || ''}"
                                       data-rut-ruta="${item.documento_rut || ''}">${display}</option>`;
                });
            }
            selectCuentas.html(htmlCuentas);

            // 🛑 Llenar Select de Bancos Disponibles (#slct_banco_nuevo)
            let htmlBancos = '<option value="">Seleccione Banco</option>';
            if (bancos_disponibles.length > 0) {
                bancos_disponibles.forEach(item => {
                    htmlBancos += `<option value="${item.id}">${item.nombre_banco}</option>`;
                });
            }
            selectBancoNuevo.html(htmlBancos);

        } else {
            selectCuentas.html('<option value="">No hay cuentas bancarias activas</option>');
            selectBancoNuevo.html('<option value="">No hay bancos para nueva cuenta</option>');
        }

    } catch (error) {
        console.error('Error al listar cuentas y bancos:', error);
        selectCuentas.html('<option value="">Error de carga</option>');
        selectBancoNuevo.html('<option value="">Error de carga</option>');
    }
}

/**
 * Función que inicializa el formulario de anticipo con los métodos de pago disponibles 
 * y selecciona el método activo retornado por la validación del servidor.
 * * @param {object} validacion - El objeto 'validacion' devuelto por el controlador, 
 * que contiene 'metodo_pago' y 'datos_adicionales'.
 */
function inicializarFormularioAnticipo(validacion) {
    // console.log("🚀 ~ inicializarFormularioAnticipo ~ validacion:", validacion['datos_adicionales']['numdoc_nexos'])
    const selectMetodo = $('#slct_metodo_pago_liquidacion');
    const contenedorOpciones = $('#contenedor_opciones_pago_liquidacion');

    // Opciones de detalle de pago (se ocultan inicialmente)
    const opcionTarjetas = $('#slct_banco_nuevo_liquidacion_liquidacion');
    const opcionCuentas = $('#opcion_cuentas_liquidacion_liquidacion');
    const chkNuevaCuenta = $('#chk_inscribir_nueva_cuenta_liquidacion_liquidacion');

    // Limpieza inicial
    selectMetodo.empty().append('<option value="">Seleccione Método</option>');
    opcionTarjetas.hide();
    opcionCuentas.hide();
    $('#inputs_nueva_cuenta_liquidacion').hide(); // Aseguramos que el bloque de inputs nuevos esté oculto

    // 🛑 Reiniciamos el control de nueva cuenta
    chkNuevaCuenta.prop('checked', false).prop('disabled', false);

    const datosAdicionales = validacion.datos_adicionales || {};
    const metodoActivo = validacion.metodo_pago; // Ej: 'Tarjeta Asignada'

    // Mapeo de texto de la validación a valor del select
    const metodoMap = {
        'Tarjeta Asignada': 'TARJETA',
        'Cuenta Principal': 'CUENTA_P',
        'Tercero Beneficiario': 'TERCERO'
    };
    const valorPreseleccionado = metodoMap[metodoActivo] || '';

    // 🛑 LLAMAR A LAS FUNCIONES DE LISTADO (Estas deben llenar los selects de detalle)
    // Se asume que estas funciones cargan las opciones en selects como #slct_tarjeta_disponible_liquidacion, etc.
    listarTarjetasParaAnticipo(validacion['datos_adicionales']['numdoc_nexos']);
    listarCuentasParaAnticipo(validacion['datos_adicionales']['numdoc_nexos']);

    // 1. 🛑 LLENAR EL SELECT DE MÉTODOS DE PAGO

    // Solo agregamos la opción al select si el método fue detectado como activo en el servidor
    if (metodoActivo === 'Tarjeta Asignada') {
        selectMetodo.append('<option value="TARJETA">Tarjeta Asignada</option>');
    }
    if (metodoActivo === 'Cuenta Principal') {
        const cuentaDisplay = datosAdicionales.pf_cuenta ? 'Cuenta Principal (***' + String(datosAdicionales.pf_cuenta).slice(-4) + ')' : 'Cuenta Principal';
        selectMetodo.append(`<option value="CUENTA_P">${cuentaDisplay}</option>`);
    }
    if (metodoActivo === 'Tercero Beneficiario') {
        selectMetodo.append('<option value="TERCERO">Tercero Beneficiario</option>');
    }

    // 🛑 Opción para inscribir NUEVA CUENTA (siempre se incluye como opción de cambio)
    selectMetodo.append('<option value="NUEVA_CUENTA">Inscribir Nueva Cuenta (Cambiar Pago)</option>');


    // 2. Control inicial y selección por defecto
    if (selectMetodo.find('option').length > 1) {
        contenedorOpciones.slideDown(200);

        // Seleccionar el método activo (o el primero si valorPreseleccionado es '') y disparar el change
        const valorInicial = valorPreseleccionado || selectMetodo.find('option:eq(1)').val();

        // Usamos setTimeout para asegurar que el DOM (y Select2 si aplica) se estabilice antes de cambiar.
        setTimeout(() => {
            selectMetodo.val(valorInicial).trigger('change');
        }, 100);

    } else {
        // No hay opciones más allá de "Seleccione Método"
        contenedorOpciones.hide();
        Swal.fire('Advertencia', 'No se encontraron métodos de pago activos para este conductor.', 'warning');
    }
}

$('#slct_metodo_pago_liquidacion').on('change', function () {
    const metodo = $(this).val();

    // Ocultar y deshabilitar todos los detalles
    $('#slct_banco_nuevo_liquidacion').slideUp(100);
    $('#opcion_cuentas_liquidacion').slideUp(100);
    $('#inputs_nueva_cuenta_liquidacion').slideUp(100);
    $('#chk_inscribir_nueva_cuenta_liquidacion').prop('checked', false).prop('disabled', false);

    // Deshabilitar todos los inputs de nueva cuenta
    $('#txt_num_cuenta_nuevo_liquidacion, #slct_banco_nuevo_liquidacion, #slct_tipo_cuenta_nuevo_liquidacion').prop('disabled', true).val('');

    if (metodo === 'TARJETA') {
        $('#slct_banco_nuevo_liquidacion').slideDown(200);
        $('#chk_inscribir_nueva_cuenta_liquidacion').prop('disabled', true);

    } else if (metodo === 'CUENTA_P' || metodo === 'TERCERO') {
        $('#opcion_cuentas_liquidacion').slideDown(200);
        $('#chk_inscribir_nueva_cuenta_liquidacion').prop('disabled', false); // 🛑 Permitir cambiar a nueva cuenta
        $('#slct_cuenta_bancaria_liquidacion').prop('disabled', false); // Habilitar selección de cuenta existente

    } else if (metodo === 'NUEVA_CUENTA') {
        $('#opcion_cuentas_liquidacion').slideDown(200);
        $('#chk_inscribir_nueva_cuenta_liquidacion').prop('checked', true).prop('disabled', false).trigger('change');
        $('#slct_cuenta_bancaria_liquidacion').prop('disabled', true); // Deshabilitar selección de cuentas existentes
    }
});


/**
 * Genera el HTML del detalle de manifiestos.
 * @param {Array} manifiestos - Datos de manifiestos.
 * @param {string} nit - Documento del titular.
 * @returns {string} HTML de la tabla de detalle.
 */
function generarHtmlDetalleManifiestos(manifiestos, nit, tenedor, conductor, direccion, celular, municipio) {
    if (manifiestos.length === 0) {
        return `<div class="alert alert-warning">No se encontraron manifiestos asociados al documento ${nit}.</div>`;
    }

    // 1. ESTRUCTURA DEL ENCABEZADO DEL TENEDOR/CONDUCTOR (similar a la imagen)
    let headerHTML = `
        <table class="table table-sm mb-4 detail-header-table" style="font-size: 0.9rem;">
            <!--<thead>
                <tr class="table-danger">
                    <th colspan="2" class="text-white text-center">Datos del Titular / Conductor</th>
                </tr>
            </thead>-->
            <tbody>
                <tr>
                    <td class="fw-bold" style="width: 25%;">NIT o C.C:</td>
                    <td>${nit}</td>
                    <td class="fw-bold">Tenedor:</td>
                    <td>${conductor || 'N/A'}</td>
                </tr>
                <tr>
                    <td class="fw-bold">Dirección:</td>
                    <td>${direccion || 'N/A'}</td>
                    <td class="fw-bold">Teléfono:</td>
                    <td>${celular || 'N/A'}</td>
                </tr>
                <tr>
                    <td class="fw-bold">Ciudad:</td>
                    <td>${municipio || 'N/A'}</td>
                </tr>
            </tbody>
        </table>

        <h5 class="fw-bold text-primary mb-3">Manifiestos asociados: (${manifiestos.length})</h5>
    `;

    // 2. ESTRUCTURA DE LA TABLA DE MANIFIESTOS
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-bordered table-striped table-sm text-center" style="font-size: 0.85rem;">
                <thead class="table-primary">
                    <tr>
                        <th style="width: auto; white-space: nowrap;">Manifiesto</th>
                        <th style="width: auto; white-space: nowrap;">Placa</th>
                        <th style="width: auto; white-space: nowrap;">Fecha Creación</th>
                        <th style="width: auto; white-space: nowrap;">Origen</th>
                        <th style="width: auto; white-space: nowrap;">Destino</th>
                        <!--<th style="width: auto; white-space: nowrap;">Anticipo</th>-->
                        <th style="width: auto; white-space: nowrap;">Liquidación</th>
                        <th style="width: auto; white-space: nowrap;">Estado Manifiesto</th>
                        <th style="width: auto; white-space: nowrap;">Agencia</th>
                        <th style="width: auto; white-space: nowrap;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;

    let estado_anticipo = '';
    let estado_liquidacion = '';
    let estado_pago = '';

    // 3. Llenado de filas
    manifiestos.forEach(m => {

        // Para estado_liquidacion
        if (m.estado_liquidacion === null || m.estado_liquidacion === 'Pendiente') {
            estado_liquidacion = '<span class="badge badge-phoenix badge-phoenix-info">Pendiente</span>';
        } else if (m.estado_liquidacion === 'Pagado') {
            estado_liquidacion = '<span class="badge badge-phoenix badge-phoenix-success">Pagado</span>';
        } else if (m.estado_liquidacion === 'Anulada' || m.estado_liquidacion === 'Cancelada') {
            estado_liquidacion = '<span class="badge badge-phoenix badge-phoenix-danger">' + m.estado_liquidacion + '</span>';
        } else {
            estado_liquidacion = '<span class="badge badge-phoenix badge-phoenix-secondary">' + m.estado_liquidacion + '</span>';
        }

        // Para estado_pago
        if (m.estado_pago === null || m.estado_pago === 'Pendiente') {
            estado_pago = '<span class="badge badge-phoenix badge-phoenix-info">Pendiente</span>';
        } else if (m.estado_pago === 'Completado') {
            estado_pago = '<span class="badge badge-phoenix badge-phoenix-success">Pagado</span>';
        } else if (m.estado_pago === 'Anulada' || m.estado_pago === 'Cancelada') {
            estado_pago = '<span class="badge badge-phoenix badge-phoenix-danger">' + m.estado_pago + '</span>';
        } else {
            estado_pago = '<span class="badge badge-phoenix badge-phoenix-secondary">' + m.estado_pago + '</span>';
        }

        tableHTML += `
            <tr>
                <td style="width: auto; white-space: nowrap;"> 
                    <a class="fw-bold text-decoration-none" type="button" onClick="ImprimirManifiesto(${m.id})">
                    #${m.id}
                    </a>
                </td>
                <td style="width: auto; white-space: nowrap;">${m.placa}</td>
                <td style="width: auto; white-space: nowrap;">${m.fecha_expedicion}</td>
                <td style="width: auto; white-space: nowrap;">${m.Origen}</td>
                <td style="width: auto; white-space: nowrap;">${m.Destino}</td>
               <!--<td style="width: auto; white-space: nowrap;">${estado_anticipo}</td>-->
                <td style="width: auto; white-space: nowrap;">${estado_liquidacion}</td>
                <td style="width: auto; white-space: nowrap;">${estado_pago}</td>
                <td style="width: auto; white-space: nowrap;">${m.Agencia}</td>
                <!--<td style="width: auto; white-space: nowrap;">
                    <div class="btn-group btn-group-sm" role="group" aria-label="...">
                    ${m.estado_ancipo === null || m.estado_ancipo === 'Pendiente' ? `<button class="btn btn-primary btn-sm me-1 px-1 py-0" type="button" id='btn-anticipo' data-manifiesto='${m.id}' data-nit-titular="${nit}" data-tenedor="${tenedor}" data-conductor="${conductor}" data-direccion="${direccion}" 
                    data-celular="${celular}" data-municipio="${municipio}" data-Manifiesto-id="${m.id}" data-conductor_manifiesto="${m.conductor_manifiesto}" data-Numdoc-conductor='${m.Nudoc_Conductor}' data-valor-anticipo='${m.valor_anticipo}'>Anticipo</button>` : ''}

                    ${m.estado_liquidacion === null || m.estado_liquidacion === 'Pendiente' ? `<button class="btn btn-warning btn-sm me-1 px-1 py-0" type="button" id='btn-liquidacion' data-manifiesto='${m.id}' data-nit-titular="${nit}" data-tenedor="${tenedor}" data-conductor="${conductor}" data-direccion="${direccion}" 
                    data-celular="${celular}" data-municipio="${municipio}" data-Manifiesto-id="${m.id}" data-conductor_manifiesto="${m.conductor_manifiesto}" data-Numdoc-tenedor='${m.Nudoc_Tenedor}' data-valor-liquidacion='${m.saldo}'>Liquidación</button>` : ''}

                    <button class="btn btn-info btn-sm me-1 px-1 py-0" type="button" id="btn-detalle-manifiestos-gestionado" data-Manifiesto-id="${m.id}">Detalles</button>

                    </div>
                </td>-->
                <td style="width: auto; white-space: nowrap;">
                    <div class="btn-group btn-group-sm" role="group" aria-label="...">
                       ${m.estado_liquidacion === null || m.estado_liquidacion === 'Pendiente' ? `<button class="btn btn-warning btn-sm me-1 px-1 py-0" type="button" id='btn-liquidacion' data-manifiesto='${m.id}' data-nit-titular="${nit}" data-tenedor="${tenedor}" data-conductor="${conductor}" data-direccion="${direccion}" 
                        data-celular="${celular}" data-municipio="${municipio}" data-Manifiesto-id="${m.id}" data-conductor_manifiesto="${m.conductor_manifiesto}" data-Numdoc-tenedor='${m.Nudoc_Tenedor}' data-valor-liquidacion='${m.Saldo_Original}' data-SobreAnticipo='${m.Valor_Sobreanticipo}' data-SaldoLiquidacio='${m.Saldo_Ajustado_Liquidacion}' >Liquidación</button>` : ''}

                    <button class="btn btn-info btn-sm me-1 px-1 py-0" type="button" id="btn-detalle-manifiestos-gestionado" data-Manifiesto-id="${m.id}">Detalles</button>
                        <!--<button class="btn btn-secondary btn-sm me-1 px-1 py-0" type="button">Manifiesto</button>-->
                    </div>
                </td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table></div>`; // Cierre de tabla y div responsive

    // 4. Devolver el encabezado y la tabla combinados
    return headerHTML + tableHTML;
}

function mostrarDetalleManifiesto(result) {
    console.log("🚀 ~ mostrarDetalleManifiesto ~ result:", result)
    const { cabecera, detalles } = result[0];
    console.log("🚀 ~ mostrarDetalleManifiesto ~ detalles:", detalles)
    console.log("🚀 ~ mostrarDetalleManifiesto ~ cabecera:", cabecera)
    const offcanvasBody = document.querySelector('#detalle-pagos');

    if (!cabecera) {
        offcanvasBody.innerHTML = '<div class="alert alert-warning">No hay pagos registrados para este manifiesto.</div>';
        return;
    }

    // --- Funciones Auxiliares (Definidas dentro para encapsulamiento) ---
    const formatCurrency = (value) => {
        return (parseFloat(value) || 0).toLocaleString('es-CO', {
            style: 'currency', currency: 'COP', minimumFractionDigits: 0
        });
    };

    const getDocumentLink = (path, name, color) => {
        if (!path || path.trim() === '') {
            return '<span class="badge bg-secondary"><i class="fas fa-times-circle"></i> No registrado</span>';
        }
        const fullUrl = $('#base_url').val() + path;
        return `<a type='button' class="btn btn-sm btn-${color} me-1 px-1 py-1" onclick='Openventana("${fullUrl}")'><i class="fas fa-file-pdf"></i> ${name}</a>`;
    };


    // --- 1. Bloque de Información General ---
    // Muestra el estado general del manifiesto desde la cabecera de pagos
    const generalHtml = `
    <div class="alert alert-info shadow-sm p-2" role="alert">
        <div class="d-flex justify-content-between align-items-center">
            <h6 class="mb-0"><i class="fas fa-info-circle"></i> ID Manifiesto: <strong>${cabecera.manifiesto_id}</strong></h6>
            <span class="badge bg-dark">${cabecera.estado_ancipo || 'PENDIENTE'}</span>
        </div>
        <hr class="my-2">
        <div class="row">
            <div class="col-6">
                <strong>Valor Total Manifiesto:</strong> ${formatCurrency(cabecera.valor_total_manifiesto)}
            </div>
            <div classcol="6">
                <strong>Total Pagado (Anticipos):</strong> ${formatCurrency(cabecera.Total_Pagado_General)}
            </div>
        </div>
    </div>
    <hr class="mb-4">
    `;

    // --- 2. Bloques de Detalles (Iterando sobre los resultados) ---
    let detallesHtml = '';

    if (detalles && detalles.length > 0) {

        detalles.forEach(item => {

            if (item.tipo_item === 'ANTICIPO') {
                // --- Bloque de Anticipo ---
                detallesHtml += `
                <div class="card mb-4 border-success shadow-sm">
                    <div class="card-header bg-success text-white p-1">
                        <h5 class="mb-0 text-white"><i class="fas fa-hand-holding-usd"></i> Detalle del Anticipo</h5>
                    </div>
                    <ul class="list-group list-group-flush p-1">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Valor Anticipado:</strong>
                            <span class="badge bg-success">${formatCurrency(item.valor)}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Fecha y Hora:</strong>
                            <span><i class="far fa-calendar-alt"></i> ${item.fecha || 'N/A'} <i class="far fa-clock ms-2"></i> ${item.hora || ''}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Registrado por:</strong>
                            <span><i class="fas fa-user-check"></i> ${item.usuario || 'N/A'}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Documento Soporte:</strong>
                            ${getDocumentLink(item.documento_soporte, 'Ver Soporte', 'success')}
                        </li>
                    </ul>
                </div>
                `;
            }
            else if (item.tipo_item === 'SOBREANTICIPO') {
                // --- Bloque de Sobre Anticipo ---
                detallesHtml += `
                <div class="card mb-4 border-warning shadow-sm">
                    <div class="card-header bg-warning text-dark p-1">
                        <h5 class="mb-0 text-dark"><i class="fas fa-plus-circle"></i> Detalle del Sobre Anticipo</h5>
                    </div>
                    <ul class="list-group list-group-flush p-1">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Valor Sobre Anticipo:</strong>
                            <span class="badge bg-warning text-dark">${formatCurrency(item.valor)}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Fecha y Hora:</strong>
                            <span><i class="far fa-calendar-alt"></i> ${item.fecha || 'N/A'} <i class="far fa-clock ms-2"></i> ${item.hora || ''}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Registrado por:</strong>
                            <span><i class="fas fa-user-check"></i> ${item.usuario || 'N/A'}</span>
                        </li>
                         <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Observación:</strong>
                            <span>${item.observacion || 'N/A'}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Documento Soporte:</strong>
                            ${getDocumentLink(item.documento_soporte, 'Ver Soporte', 'warning')}
                        </li>
                    </ul>
                </div>
                `;
            }
        });
    }

    // --- 3. Inyectar contenido (ELIMINANDO liquidacionHtml) ---
    if (offcanvasBody) {
        offcanvasBody.innerHTML = generalHtml + detallesHtml;
    } else {
        Swal.fire({
            title: 'Error de Vista',
            text: 'No se pudo encontrar el contenedor del Offcanvas.',
            icon: 'error'
        });
    }
}

function ImprimirManifiesto(id_mnf) {
    // ✅ REEMPLAZA TU CÓDIGO ACTUAL CON ESTE:
    const urlCompleta = $('#base_url').val() + 'libs/manifiesto_pdf.php?' + 'id_mnf=' + codificarBase64(id_mnf);

    // Configuración de ventana centrada
    const ancho = 1000;
    const alto = 700;
    const left = (window.screen.width - ancho) / 2;
    const top = (window.screen.height - alto) / 2;

    window.open(
        urlCompleta,
        '_blank',
        `width=${ancho},height=${alto},left=${left},top=${top},scrollbars=yes,resizable=yes,location=no,menubar=no,toolbar=no,status=no`
    );
}

function codificarBase64(texto) {
    return btoa(texto);
}

// Función para decodificar Base64
function decodificarBase64(textoCodificado) {
    return atob(textoCodificado);
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
    let formateado = numero.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 2
    });

    elemento.val(formateado);
}

function Openventana(url) {
    // Configuración de ventana centrada
    const ancho = 1000;
    const alto = 700;
    const left = (window.screen.width - ancho) / 2;
    const top = (window.screen.height - alto) / 2;

    window.open(
        url,
        '_blank',
        `width=${ancho},height=${alto},left=${left},top=${top},scrollbars=yes,resizable=yes,location=no,menubar=no,toolbar=no,status=no`
    );
}