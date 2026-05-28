window.VENTANA = "";
// Variable global para el título del detalle

window.initScript = function (id) {
    window.VENTANA = id;
    Lista_general_pagos();
    // let campoFechaInicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`);
    // let campoFechaFinal = document.getElementById(`campo-${window.VENTANA}-fecha_final`);

    // if (campoFechaInicial && campoFechaFinal) {
    //     let hoy = new Date();
    //     let anio = hoy.getFullYear();
    //     let mes = hoy.getMonth() + 1; // Los meses van de 0 a 11
    //     let dia = hoy.getDate();

    //     // Formatear mes y día con dos dígitos
    //     mes = mes < 10 ? `0${mes}` : mes;
    //     let diaActual = dia < 10 ? `0${dia}` : dia;

    //     // Establecer fechas en formato YYYY-MM-DD
    //     let fechaInicio = `${anio}-${mes}-01`;
    //     let fechaFin = `${anio}-${mes}-${diaActual}`;

    //     // Asignar las fechas a los inputs
    //     campoFechaInicial.value = fechaInicio;
    //     campoFechaFinal.value = fechaFin;
    // }

    document.addEventListener("click", async e => {
        if (e.target.closest(`#btn-detalle-manifiestos`) || e.target.closest(`#btn-detalle-manifiestos *`)) {
            e.preventDefault();

            let Boton = e.target.closest(`#btn-detalle-manifiestos`);
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
                    const offcanvasEl = document.getElementById('offcanvasDetalleManifiestos');
                    const contentDiv = document.getElementById('detalleManifiestoContent');

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

        if (e.target.closest(`#btn-anticipo`) || e.target.closest(`#btn-anticipo *`)) {
            e.preventDefault();

            let Boton = e.target.closest(`#btn-anticipo`);
            // Capturamos el documento del conductor para la validación
            const Numdoc_Conductor = Boton.getAttribute('data-Numdoc-conductor');
            const Valor_Anticipo = Boton.getAttribute('data-valor-anticipo');
            const Conductor = Boton.getAttribute('data-conductor_manifiesto');
            const Nombre_conductor = Boton.getAttribute('data-conductor');
            const Manifiesto = Boton.getAttribute('data-manifiesto');

            if (!Numdoc_Conductor) {
                Swal.fire('Error', 'Documento del conductor no disponible.', 'error');
                return;
            }

            // 1. Mostrar indicador de validación
            Swal.fire({
                title: 'Validando requisitos de pago...',
                text: 'Verificando datos bancarios y documentación.',
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick: false
            });

            const formData = new FormData();
            formData.append('Numdoc_Conductor', Numdoc_Conductor);

            try {
                const response = await fetch($('#base_url').val() + 'novedades/validarDatosAnticipo', { // 👈 Endpoint del controlador
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                Swal.close(); // Cerrar el indicador de carga

                if (result.status === true) {
                    // 2. ÉXITO: Los datos son válidos, procedemos al formulario/lógica de anticipo
                    Swal.fire('Validación Completa', result.message, 'success');

                    // 🚨 AQUÍ VA LA LÓGICA PARA ELABORAR EL ANTICIPO
                    // Por ejemplo, cargar un modal o redirigir:
                    // cargarFormularioAnticipo(Boton.attributes); 
                    document.getElementById(`bloque_anticipo`).style.display = '';
                    // document.getElementById(`bloque_liquidacion`).style.display = 'none';
                    document.getElementById(`bloque-pagos`).style.display = 'none';
                    // document.getElementById(`bloque_pago`).style.display = 'none';

                    const valorNumerico = parseFloat(Valor_Anticipo.replace(/,/g, ''));

                    const valorFormateado = valorNumerico.toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                    });

                    document.getElementById('valor_anticipo').value = valorFormateado;

                    document.getElementById(`beneficiario_anticipo`).value = Conductor + ' - ' + Nombre_conductor;
                    document.getElementById(`btn-buscar-beneficiario`).setAttribute('data-numdoc-conductor', Numdoc_Conductor);
                    document.getElementById(`btn-guardar-anticipo`).setAttribute('data-manifiesto', Manifiesto);
                    document.getElementById(`btn-guardar-anticipo`).setAttribute('data-numdoc-conductor', Numdoc_Conductor);

                    // 🛑 LLAMADA CORRECTA DESPUÉS DE VALIDAR
                    inicializarFormularioAnticipo(result.validacion);

                } else {
                    // 3. FALLO: Mostrar el mensaje de error detallado
                    Swal.fire('Validación Requerida', result.message, 'warning');
                }

            } catch (error) {
                Swal.fire('Error de Conexión', 'No se pudo comunicar con el servidor para la validación.', 'error');
                console.error('Fetch error:', error);
            }
        }

        if (e.target.matches(`#btn-buscar-beneficiario`) || e.target.matches(`#btn-buscar-beneficiario *`)) {
            let Boton = e.target.closest(`#btn-buscar-beneficiario`);
            const Numdoc_Conductor = Boton.getAttribute('data-numdoc-conductor');

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

        //Guardar los anticipos
        if (e.target.closest('#btn-guardar-anticipo')) {
            e.preventDefault();

            let Boton = e.target.closest('#btn-guardar-anticipo');
            let Manifiesto = Boton.getAttribute('data-manifiesto');
            // Nuevo campo: Numdoc
            let Numdoc = Boton.getAttribute('data-numdoc-conductor');
            let Anticipo = document.getElementById('valor_anticipo').value;
            let fecha_anticipo = document.getElementById('fecha_anticipo').value;
            let slct_metodo_pago = document.getElementById('slct_metodo_pago').value;
            let slct_tarjeta_disponible = document.getElementById('slct_tarjeta_disponible').value;
            let slct_cuenta_bancaria = document.getElementById('slct_cuenta_bancaria').value;

            let documento_anticipo_input = document.getElementById('documento_anticipo');

            // 1. Validación simple en cliente con Swal
            if (!Manifiesto || !Anticipo || !fecha_anticipo || documento_anticipo_input.files.length === 0) {
                console.error("Faltan campos obligatorios: Manifiesto ID, Valor, Fecha o Documento.");
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos Incompletos',
                    text: 'Por favor, complete todos los campos y adjunte el documento del anticipo.',
                    confirmButtonText: 'Entendido'
                });
                return; // Detiene la ejecución si faltan datos
            }

            let documento_anticipo = documento_anticipo_input.files[0];

            const formData = new FormData();
            formData.append('manifiesto_id', Manifiesto);
            formData.append('anticipo', Anticipo);
            formData.append('fecha_anticipo', fecha_anticipo);
            formData.append('documento_anticipo', documento_anticipo); // Archivo
            formData.append('numdoc_conductor', Numdoc); // Nuevo campo
            formData.append('slct_metodo_pago', slct_metodo_pago); // Nuevo campo
            formData.append('slct_tarjeta_disponible', slct_tarjeta_disponible); // Nuevo campo
            formData.append('slct_cuenta_bancaria', slct_cuenta_bancaria); // Nuevo campo

            // 2. Ejecutar Fetch
            fetch($('#base_url').val() + 'novedades/UpdateAnticipo', {
                method: 'POST',
                body: formData
            })
                .then(res => {
                    // Manejo de errores de HTTP (4xx, 5xx)
                    if (!res.ok) {
                        // Si la respuesta no es OK, intenta leer el JSON de error
                        return res.json().then(errorData => {
                            throw new Error(errorData.message || `Error HTTP! Status: ${res.status}`);
                        });
                    }
                    return res.json();
                })
                .then(data => {
                    // 3. Mostrar respuesta con SweetAlert
                    if (data.status === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Anticipo Guardado!',
                            text: data.message,
                            confirmButtonText: 'Aceptar'
                        }).then(() => {
                            // Opcional: Recargar la tabla o cerrar el modal aquí
                            location.reload();
                            document.getElementById(`bloque_anticipo`).style.display = 'none';
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error en la Operación',
                            text: data.message || 'Ocurrió un error inesperado al guardar el anticipo.',
                            confirmButtonText: 'Cerrar'
                        });
                    }
                })
                .catch(err => {
                    console.error("Error en la petición fetch:", err);

                    // 4. Mostrar error general con SweetAlert
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Conexión',
                        text: 'Ocurrió un error al procesar el anticipo. Detalle: ' + err.message,
                        confirmButtonText: 'Cerrar'
                    });
                });
        }

        // Sobre Anticipos
        // Lógica del botón de SOBRE ANTICIPO
        if (e.target.closest(`#btn-sobre-anticipo`)) {
            e.preventDefault();

            let Boton = e.target.closest(`#btn-sobre-anticipo`);

            // 1. Captura de datos
            const Manifiesto = Boton.getAttribute('data-manifiesto-id');
            const Numdoc_Conductor = Boton.getAttribute('data-Numdoc-conductor');
            const Nombre_conductor = Boton.getAttribute('data-conductor'); // Asumido
            const Valor_viaje = Boton.getAttribute('data-valor-viaje'); // Asumido 
            const Valor_Anticipo = Boton.getAttribute('data-valor-anticipo'); // Asumido 
            const Saldo_Manifiesto = Boton.getAttribute('data-saldo-manifiesto'); // Asumido 

            if (!Manifiesto || !Numdoc_Conductor) {
                Swal.fire('Error', 'Faltan datos (Manifiesto ID o Conductor).', 'error');
                return;
            }

            // 2. Mostrar indicador de validación
            Swal.fire({ title: 'Validando requisitos de pago...', icon: 'info', showConfirmButton: false, allowOutsideClick: false });

            const formData = new FormData();
            formData.append('Numdoc_Conductor', Numdoc_Conductor);

            try {
                // 3. Fetch (Usamos el mismo endpoint de validación)
                const response = await fetch($('#base_url').val() + 'novedades/validarDatosAnticipo', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                Swal.close();

                if (result.status === true) {
                    // 4. ÉXITO: Abrir el bloque de sobre anticipo
                    Swal.fire('Validación Completa', result.message, 'success');
                    document.getElementById(`bloque_sobre_anticipo`).style.display = '';
                    document.getElementById(`bloque-pagos`).style.display = 'none';
                    // 🛑 LLAMADA CLAVE: Inicializar el formulario específico de SOBRE ANTICIPO
                    inicializarFormularioSobreAnticipo(
                        result.validacion,
                        Manifiesto,
                        Nombre_conductor,
                        Numdoc_Conductor
                    );

                    document.getElementById(`btn-guardar-sobre-anticipo`).setAttribute('data-manifiesto', Manifiesto);
                    document.getElementById(`btn-guardar-sobre-anticipo`).setAttribute('data-numdoc-conductor', Numdoc_Conductor);
                    document.getElementById(`btn-guardar-sobre-anticipo`).setAttribute('data-valor-viaje', Valor_viaje);
                    document.getElementById(`btn-guardar-sobre-anticipo`).setAttribute('data-valor-anticipo', Valor_Anticipo);
                    document.getElementById(`btn-guardar-sobre-anticipo`).setAttribute('data-saldo-manifiesto', Saldo_Manifiesto);

                } else {
                    // 5. FALLO: Mostrar el mensaje de error detallado del Controlador
                    Swal.fire('Validación Requerida', result.message, 'warning');
                }

            } catch (error) {
                Swal.fire('Error de Conexión', 'Fallo al comunicarse con el servidor.', 'error');
                console.error('Fetch error:', error);
            }
        }

        // 🛑 Listener Unificado para Guardar Sobre Anticipo
        const btnGuardarSobreAnticipo = e.target.closest('#btn-guardar-sobre-anticipo');
        if (btnGuardarSobreAnticipo) {
            e.preventDefault();

            // 1. Captura de datos esenciales y contexto
            const manifiestoId = btnGuardarSobreAnticipo.getAttribute('data-manifiesto');
            const numdocConductor = btnGuardarSobreAnticipo.getAttribute('data-numdoc-conductor');

            // 🛑 CAPTURA DE VALORES DEL MANIFIESTO (Desde el botón)
            // (Asumo que 'data-valor-viaje' es el total del manifiesto y 'data-valor-anticipo' es lo YA pagado)
            const valorViajeTotalStr = btnGuardarSobreAnticipo.getAttribute('data-valor-viaje');
            const valorAnticipoPagadoStr = btnGuardarSobreAnticipo.getAttribute('data-valor-anticipo');

            // 🛑 Captura de campos específicos del SOBRE ANTICIPO (del formulario)
            const valorNuevoSobreAnticipoStr = document.getElementById('valor_sobre_anticipo').value;
            const fecha = document.getElementById('fecha_sobre_anticipo').value;
            const documentoInput = document.getElementById('documento_sobre_anticipo');
            const observacion = document.getElementById('obs_sobre_anticipo')?.value.trim() || '';

            // ... (Captura de campos de método de pago) ...
            const slct_metodo_pago = document.getElementById('slct_metodo_pago_sobre_anticipo').value;
            const slct_tarjeta_disponible = document.getElementById('slct_tarjeta_disponible_sobre_anticipo').value;
            const slct_cuenta_bancaria = document.getElementById('slct_cuenta_bancaria_sobre_anticipo').value;

            const documento_anticipo = documentoInput.files[0] ?? null;
            let errores = [];

            // ------------------------------------------------------------------
            // 2. VALIDACIONES DE OBLIGATORIEDAD
            // ------------------------------------------------------------------

            // if (!manifiestoId) { errores.push('Error interno: Manifiesto ID no disponible.'); }
            if (!valorNuevoSobreAnticipoStr) { errores.push('Debe ingresar un <strong>Valor para el Sobre Anticipo</strong>.'); }
            if (!fecha) { errores.push('Debe seleccionar la <strong>Fecha del Sobre Anticipo</strong>.'); }
            if (!documento_anticipo) { errores.push('Debe adjuntar el <strong>Documento Soporte</strong>.'); }
            if (!slct_metodo_pago) { errores.push('Debe seleccionar el <strong>Método de Pago</strong>.'); }
            // if (!observacion) { errores.push('Debe agregar una <strong>Observación</strong> para el Sobre Anticipo.'); }

            // Validación condicional del destino de pago
            if (slct_metodo_pago === 'TARJETA' && !slct_tarjeta_disponible) {
                errores.push('Debe seleccionar una <strong>Tarjeta Disponible</strong>.');
            } else if (slct_metodo_pago !== 'TARJETA' && !slct_cuenta_bancaria) {
                // Asumiendo que 'NUEVA_CUENTA' o 'CUENTA_P' requiere el valor de slct_cuenta_bancaria (el ID)
                errores.push('Debe seleccionar una <strong>Cuenta de Destino</strong>.');
            }

            // ------------------------------------------------------------------
            // 3. 🛑 VALIDACIÓN DE LÓGICA DE NEGOCIO (Saldos)
            // ------------------------------------------------------------------

            // Función auxiliar para limpiar el formato de moneda (ej: "$ 1.200.000,00" -> 1200000.00)
            const limpiarFormatoMoneda = (str) => {
                if (!str) return 0;
                // Quita $, espacios, y puntos. Reemplaza coma decimal por punto.
                let limpio = str.replace(/[$. ]/g, '').replace(',', '.');
                return parseFloat(limpio) || 0;
            };

            const valorViajeTotal = limpiarFormatoMoneda(valorViajeTotalStr);
            const valorAnticipoPagado = limpiarFormatoMoneda(valorAnticipoPagadoStr);
            const valorNuevoSobreAnticipo = limpiarFormatoMoneda(valorNuevoSobreAnticipoStr);

            const saldoPendienteActual = valorViajeTotal - valorAnticipoPagado;

            // 🛑 VALIDACIÓN: El nuevo sobre anticipo no puede ser mayor que el saldo pendiente
            if (valorNuevoSobreAnticipo > saldoPendienteActual) {
                errores.push(`El valor del Sobre Anticipo (<strong>${valorNuevoSobreAnticipoStr}</strong>) 
                          no puede superar el saldo pendiente del manifiesto (<strong>${saldoPendienteActual.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</strong>).`);
            }

            if (valorNuevoSobreAnticipo <= 0) {
                errores.push('El valor del Sobre Anticipo debe ser mayor a 0.');
            }

            // 4. MOSTRAR ERRORES O CONTINUAR
            if (errores.length > 0) {
                const listaErrores = errores.map(msg => `<li>${msg}</li>`).join('');
                Swal.fire({
                    title: 'Error de Validación',
                    html: `<ul class="text-start ps-4">${listaErrores}</ul>`,
                    icon: 'warning'
                });
                return;
            }

            // 5. PREPARAR FORM DATA
            Swal.fire({ title: 'Guardando Pago...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

            const formData = new FormData();
            formData.append('manifiesto_id', manifiestoId);
            formData.append('anticipo', valorNuevoSobreAnticipoStr); // Enviamos el valor formateado (el Modelo lo limpiará)
            formData.append('fecha_anticipo', fecha);
            formData.append('documento_soporte_sobre', documento_anticipo);
            formData.append('numdoc_conductor', numdocConductor);
            formData.append('slct_metodo_pago', slct_metodo_pago);
            formData.append('id_cuenta_destino', slct_cuenta_bancaria || slct_tarjeta_disponible);
            formData.append('tipo_item', 'SOBREANTICIPO');
            // formData.append('observacion', observacion);

            // 6. EJECUCIÓN DEL FETCH
            try {
                const response = await fetch($('#base_url').val() + 'novedades/UpdateSobreAnticipo', { // 🛑 Endpoint específico
                    method: 'POST', body: formData
                });
                const result = await response.json();
                Swal.close();

                if (result.status === 'success' || result.status === true) {
                    // Swal.fire('¡Guardado!', result.message, 'success');
                    // Cierre y Recarga (ajusta según tu lógica)
                    // location.reload();
                    Swal.fire({
                        icon: 'success',
                        title: '¡Anticipo Guardado!',
                        text: result.message,
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        // Opcional: Recargar la tabla o cerrar el modal aquí
                        location.reload();
                        document.getElementById(`bloque_sobre_anticipo`).style.display = 'none';
                    });
                } else {
                    Swal.fire('Error', result.message || 'Error al procesar la transacción.', 'error');
                }
            } catch (error) {
                Swal.close();
                Swal.fire('Error', 'Fallo de conexión.', 'error');
            }
        }

        if (e.target.matches(`#btn-detalle-manifiestos-gestionado`) || e.target.matches(`#btn-detalle-manifiestos-gestionado *`)) {
            let Boton = e.target.closest(`#btn-detalle-manifiestos-gestionado`);
            const Manifiesto_id = Boton.getAttribute('data-manifiesto-id');

            if (!Manifiesto_id) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo obtener el ID del manifiesto.' });
                return;
            }

            const formData = new FormData();
            formData.append('manifiesto_id', Manifiesto_id);

            // 1. Mostrar Loader
            Swal.fire({
                title: 'Cargando Detalles...',
                text: 'Por favor, espere.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                fetch($('#base_url').val() + 'novedades/getDetalleManifiesto', {
                    method: 'POST',
                    body: formData
                })
                    .then(res => {
                        if (!res.ok) {
                            return res.json().then(errorData => {
                                throw new Error(errorData.message || `Error HTTP! Status: ${res.status}`);
                            });
                        }
                        return res.json();
                    })
                    .then(data => {
                        Swal.close(); // Cerrar el loader

                        console.log("🚀 ~ data:", data)
                        if (data) {
                            document.getElementById(`bloque-pagos`).style.display = '';
                            // document.getElementById(`bloque_liquidacion`).style.display = 'none';
                            document.getElementById(`bloque_anticipo`).style.display = 'none';
                            // LLAMADA A LA FUNCIÓN PARA POBLAR Y MOSTRAR EL OFFCANVAS
                            mostrarDetalleManifiesto(data);
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al Cargar',
                                text: data.message || 'No se pudo obtener el detalle del manifiesto.',
                                confirmButtonText: 'Cerrar'
                            });
                        }
                    })
                    .catch(error => {
                        Swal.close(); // Asegurar que el loader se cierre
                        console.error("Error en la petición fetch:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error de Conexión',
                            text: 'Ocurrió un error al cargar los detalles. Detalle: ' + error.message,
                            confirmButtonText: 'Cerrar'
                        });
                    });
            } catch (error) {
                Swal.close();
                console.error("Error síncrono:", error);
            }
        }

        if (e.target.matches(`#btn-cancelar-anticipo`) || e.target.matches(`#btn-cancelar-anticipo *`)) {
            document.getElementById(`bloque_anticipo`).style.display = 'none';
            limpiarBloqueAnticipo();
        }
    });

    // JS (Listener para #slct_cuenta_bancaria)
    document.addEventListener('change', function (e) {
        if (e.target.matches('#slct_cuenta_bancaria')) {
            const selectedOption = $(e.target).find('option:selected');
            const contenedorDocs = $('#contenedor_documentos_pago');

            // Obtener las rutas de los data attributes
            const certRuta = selectedOption.data('cert-ruta');
            const rutRuta = selectedOption.data('rut-ruta');

            let htmlEnlaces = '';

            if (certRuta || rutRuta) {
                // Función para generar un enlace de documento (debes tenerla definida)
                const getDocLink = (ruta, nombre, color) => {
                    const fullUrl = $('#base_url').val() + 'public/files/proveedores/financieros/' + ruta;
                    return `<a href="${fullUrl}" target="_blank" class="btn btn-sm btn-${color} py-1 me-2">${nombre} <i class="fas fa-file-pdf"></i></a>`;
                };

                htmlEnlaces += `<span class="fw-bold me-2">Documentos:</span>`;

                // 🛑 Enlace Certificado Bancario
                if (certRuta) {
                    htmlEnlaces += getDocLink(certRuta, 'Certificado Cuenta', 'primary');
                    document.getElementById('btn-guardar-anticipo').disabled = false;
                } else {
                    htmlEnlaces += '<span class="badge badge-phoenix badge-phoenix-danger me-2">Certificado Faltante</span>';
                    document.getElementById('btn-guardar-anticipo').disabled = true;
                }

                // 🛑 Enlace RUT
                // if (rutRuta) {
                //     htmlEnlaces += getDocLink(rutRuta, 'RUT', 'info');
                //     document.getElementById('btn-guardar-anticipo').disabled = false;
                // } else {
                //     htmlEnlaces += '<span class="badge badge-phoenix badge-phoenix-danger me-2">RUT Faltante</span>';
                //     document.getElementById('btn-guardar-anticipo').disabled = true;
                // }

            } else {
                htmlEnlaces = '<div class="text-danger">No hay documentos de soporte adjuntos para esta cuenta.</div>';
            }

            contenedorDocs.html(htmlEnlaces);
        }
    });
}

// JavaScript (JS)
function Lista_general_pagos() {
    const tbody = document.getElementById("tbody-pagos-general");
    const baseUrl = $("#base_url").val(); // Asumo que tienes jQuery cargado

    // 1. Placeholder de carga
    tbody.innerHTML = `<tr><td colspan="7" class="text-muted">⏳ Cargando listado de pagos generales...</td></tr>`;

    // 2. Fetch al Controlador
    fetch(baseUrl + 'novedades/obtenerListaGeneralPagos', {
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
                            <a class="text-decoration-none fw-bold" href='#' id='btn-detalle-manifiestos' data-nit-titular='${element.Nit_titular}' data-tenedor='${element.Tenedor}' data-conductor='${element.Conductor}' data-direccion='${element.direccion}' 
                            data-celular='${element.celular}' data-municipio='${element.Municipio}'>${element.Nit_titular}</a>
                        </td>
                        <!--<td>${element.Tenedor}</td>-->
                        <td>${element.Conductor}</td>
                        <td>${element.direccion}</td>
                        <td>${element.celular}</td>
                        <td>${element.Municipio}</td>
                        <td class="fw-bold">${element.cantidad_manifiesto}</td>
                    </tr>
                `;
                });

                tbody.innerHTML = template;

                // 🚨 ASIGNAR EL TOTAL AL FOOTER
                document.getElementById('total-manifiestos-general').textContent = totalManifiestos.toLocaleString();

            } else {
                // Sin datos
                tbody.innerHTML = `<tr><td colspan="7" class="alert alert-info">No se encontraron manifiestos con pagos.</td></tr>`;
            }
        })
        .catch(error => {
            console.error("Fetch Error:", error);
            tbody.innerHTML = `<tr><td colspan="7" class="alert alert-danger">Error al cargar la lista: ${error.message}</td></tr>`;
        });
}

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
                        <th style="width: auto; white-space: nowrap;">Anticipo</th>
                        <!--<th style="width: auto; white-space: nowrap;">Liquidación</th>-->
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
        // Para estado_anticipo
        if (m.estado_ancipo === null || m.estado_ancipo === 'Pendiente') {
            estado_anticipo = '<span class="badge badge-phoenix badge-phoenix-info">Pendiente</span>';
        } else if (m.estado_ancipo === 'Pagado') {
            estado_anticipo = '<span class="badge badge-phoenix badge-phoenix-success">Pagado</span>';
        } else if (m.estado_ancipo === 'Anulada' || m.estado_ancipo === 'Cancelada') {
            estado_anticipo = '<span class="badge badge-phoenix badge-phoenix-danger">' + m.estado_ancipo + '</span>';
        } else {
            estado_anticipo = '<span class="badge badge-phoenix badge-phoenix-secondary">' + m.estado_ancipo + '</span>';
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
                <td style="width: auto; white-space: nowrap;">${estado_anticipo}</td>
                <td style="width: auto; white-space: nowrap;">${estado_pago}</td>
                <td style="width: auto; white-space: nowrap;">${m.Agencia}</td>
                <td style="width: auto; white-space: nowrap;">
                    <div class="btn-group btn-group-sm" role="group" aria-label="...">
                        ${m.estado_ancipo === null || m.estado_ancipo === 'Pendiente' && m.estado_cargue === 'Cargado' ? `<button class="btn btn-primary btn-sm me-1 px-1 py-0" type="button" id='btn-anticipo' data-manifiesto='${m.id}' data-nit-titular="${nit}" data-tenedor="${tenedor}" data-conductor="${conductor}" data-direccion="${direccion}" 
                        data-celular="${celular}" data-municipio="${municipio}" data-Manifiesto-id="${m.id}" data-conductor_manifiesto="${m.conductor_manifiesto}" data-Numdoc-conductor='${m.Nudoc_Conductor}' data-valor-anticipo='${m.valor_anticipo}'>Anticipo</button>` : ''}

                        ${m.estado_ancipo === 'Pagado' ? `<button class="btn btn-warning btn-sm me-1 px-1 py-0" type="button" id='btn-sobre-anticipo' data-manifiesto='${m.id}' data-nit-titular="${nit}" data-tenedor="${tenedor}" data-conductor="${conductor}" data-direccion="${direccion}" 
                        data-celular="${celular}" data-municipio="${municipio}" data-Manifiesto-id="${m.id}" data-conductor_manifiesto="${m.conductor_manifiesto}" data-Numdoc-Conductor='${m.Nudoc_Conductor}' data-valor-liquidacion='${m.saldo}' data-valor-viaje='${m.valor_total_viaje}' 
                        data-valor-anticipo='${m.valor_anticipo}' data-saldo-manifiesto='${m.saldo}'>Sobre Anticipo</button>` : ''}

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

// JS (Función de renderizado)
/**
 * Función que formatea los datos y los inyecta en el Offcanvas.
 * Muestra Anticipo y Sobre Anticipos, y oculta Liquidación.
 * @param {object} result Objeto con {cabecera, detalles} del Modelo.
 */
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

/**
 * Limpia y restablece todos los campos del bloque de ANTICIPO.
 */
function limpiarBloqueAnticipo() {

    // 1. INPUTS
    $('#valor_anticipo').val(''); // Valor Anticipo

    // 2. FECHAS
    // Restablecer la fecha al valor actual si usas PHP para la inicialización, o simplemente limpiar
    $('#fecha_anticipo').val('');

    // 3. INPUTS de Archivo (FILE)
    $('#documento_anticipo').val(''); // Documento

    // 4. INPUTS deshabilitados/Beneficiario
    $('#beneficiario_anticipo').val(''); // Beneficiario

    // Opcional: Ocultar el bloque si la intención es "cancelar"
    // $('#bloque_anticipo').hide();

    console.log("Bloque de Anticipo limpiado.");
}

// ----------------------------------------------------------------------

/**
 * Limpia y restablece todos los campos del bloque de LIQUIDACIÓN.
 */
function limpiarBloqueLiquidacion() {

    // 1. INPUTS
    $('#valor_liquidacion').val(''); // Valor Liquidacion

    // 2. FECHAS
    // Restablecer la fecha al valor actual si usas PHP para la inicialización, o simplemente limpiar
    $('#fecha_liquidacion').val('');

    // 3. INPUTS de Archivo (FILE)
    $('#documento_liquidacion').val(''); // Documento

    // 4. INPUTS deshabilitados/Beneficiario
    $('#beneficiario_liquidacion').val(''); // Beneficiario

    // Opcional: Ocultar el bloque si la intención es "cancelar"
    // $('#bloque_liquidacion').hide();

    console.log("Bloque de Liquidación limpiado.");
}

/**
 * Función que realiza la petición y llena el select con las tarjetas asignadas vigentes.
 *
 * @param {string} idProveedor ID del conductor/proveedor para el cual buscar tarjetas.
 */
async function listarTarjetasParaAnticipo(idProveedor) {
    const select = $('#slct_tarjeta_disponible');
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
    const selectCuentas = $('#slct_cuenta_bancaria');
    const selectBancoNuevo = $('#slct_banco_nuevo');

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

            // 🛑 Llenar Select de Cuentas Existentes (#slct_cuenta_bancaria)
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
    const selectMetodo = $('#slct_metodo_pago');
    const contenedorOpciones = $('#contenedor_opciones_pago');

    // Opciones de detalle de pago (se ocultan inicialmente)
    const opcionTarjetas = $('#opcion_tarjetas');
    const opcionCuentas = $('#opcion_cuentas');
    const chkNuevaCuenta = $('#chk_inscribir_nueva_cuenta');

    // Limpieza inicial
    selectMetodo.empty().append('<option value="">Seleccione Método</option>');
    opcionTarjetas.hide();
    opcionCuentas.hide();
    $('#inputs_nueva_cuenta').hide(); // Aseguramos que el bloque de inputs nuevos esté oculto

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
    // Se asume que estas funciones cargan las opciones en selects como #slct_tarjeta_disponible, etc.
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

/**
 * Función que realiza la petición y llena el select con las tarjetas asignadas vigentes.
 *
 * @param {string} idProveedor ID del conductor/proveedor para el cual buscar tarjetas.
 */
async function listarTarjetasParaSobreAnticipo(idProveedor) {
    const select = $('#slct_tarjeta_disponible_sobre_anticipo');
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
async function listarCuentasParaSobreAnticipo(idProveedor) {
    const selectCuentas = $('#slct_cuenta_bancaria_sobre_anticipo');
    const selectBancoNuevo = $('#slct_banco_nuevo');

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

            // 🛑 Llenar Select de Cuentas Existentes (#slct_cuenta_bancaria)
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

function inicializarFormularioSobreAnticipo(validacion) {
    // console.log("🚀 ~ inicializarFormularioAnticipo ~ validacion:", validacion['datos_adicionales']['numdoc_nexos']) slct_tarjeta_disponible_sobre_anticipo
    const selectMetodo = $('#slct_metodo_pago_sobre_anticipo');
    const contenedorOpciones = $('#contenedor_opciones_pago_sobre_anticipo');

    // Opciones de detalle de pago (se ocultan inicialmente)
    const opcionTarjetas = $('#opcion_tarjetas_sobre_anticipo');
    const opcionCuentas = $('#opcion_cuentas_sobre_anticipo');
    const chkNuevaCuenta = $('#chk_inscribir_nueva_cuenta');

    // Limpieza inicial
    selectMetodo.empty().append('<option value="">Seleccione Método</option>');
    opcionTarjetas.hide();
    opcionCuentas.hide();
    $('#inputs_nueva_cuenta').hide(); // Aseguramos que el bloque de inputs nuevos esté oculto

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
    // Se asume que estas funciones cargan las opciones en selects como #slct_tarjeta_disponible, etc.
    listarTarjetasParaSobreAnticipo(validacion['datos_adicionales']['numdoc_nexos']);
    listarCuentasParaSobreAnticipo(validacion['datos_adicionales']['numdoc_nexos']);

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

// --------------------------------------------------------------------------------
// 🛑 LISTENERS DE CONTROL DE INTERFAZ (slct_metodo_pago y chk_inscribir_nueva_cuenta)
// --------------------------------------------------------------------------------

// Listener del SELECT de Método de Pago
$('#slct_metodo_pago').on('change', function () {
    const metodo = $(this).val();

    // Ocultar y deshabilitar todos los detalles
    $('#opcion_tarjetas').slideUp(100);
    $('#opcion_cuentas').slideUp(100);
    $('#inputs_nueva_cuenta').slideUp(100);
    $('#chk_inscribir_nueva_cuenta').prop('checked', false).prop('disabled', false);

    // Deshabilitar todos los inputs de nueva cuenta
    $('#txt_num_cuenta_nuevo, #slct_banco_nuevo, #slct_tipo_cuenta_nuevo').prop('disabled', true).val('');

    if (metodo === 'TARJETA') {
        $('#opcion_tarjetas').slideDown(200);
        $('#chk_inscribir_nueva_cuenta').prop('disabled', true);

    } else if (metodo === 'CUENTA_P' || metodo === 'TERCERO') {
        $('#opcion_cuentas').slideDown(200);
        $('#chk_inscribir_nueva_cuenta').prop('disabled', false); // 🛑 Permitir cambiar a nueva cuenta
        $('#slct_cuenta_bancaria').prop('disabled', false); // Habilitar selección de cuenta existente

    } else if (metodo === 'NUEVA_CUENTA') {
        $('#opcion_cuentas').slideDown(200);
        $('#chk_inscribir_nueva_cuenta').prop('checked', true).prop('disabled', false).trigger('change');
        $('#slct_cuenta_bancaria').prop('disabled', true); // Deshabilitar selección de cuentas existentes
    }
});

$('#slct_metodo_pago_sobre_anticipo').on('change', function () {
    const metodo = $(this).val();

    // Ocultar y deshabilitar todos los detalles
    $('#opcion_tarjetas_sobre_anticipo').slideUp(100);
    $('#opcion_cuentas_sobre_anticipo').slideUp(100);
    $('#inputs_nueva_cuenta').slideUp(100);
    $('#chk_inscribir_nueva_cuenta').prop('checked', false).prop('disabled', false);

    // Deshabilitar todos los inputs de nueva cuenta
    $('#txt_num_cuenta_nuevo_sobre_anticipo, #slct_banco_nuevo_sobre_anticipo, #slct_tipo_cuenta_nuevo_sobre_anticipo').prop('disabled', true).val('');

    if (metodo === 'TARJETA') {
        $('#opcion_tarjetas_sobre_anticipo').slideDown(200);
        $('#chk_inscribir_nueva_cuenta').prop('disabled', true);

    } else if (metodo === 'CUENTA_P' || metodo === 'TERCERO') {
        $('#opcion_cuentas_sobre_anticipo').slideDown(200);
        $('#chk_inscribir_nueva_cuenta').prop('disabled', false); // 🛑 Permitir cambiar a nueva cuenta
        $('#slct_cuenta_bancaria_sobre_anticipo').prop('disabled', false); // Habilitar selección de cuenta existente

    } else if (metodo === 'NUEVA_CUENTA') {
        $('#opcion_cuentas_sobre_anticipo').slideDown(200);
        $('#chk_inscribir_nueva_cuenta').prop('checked', true).prop('disabled', false).trigger('change');
        $('#slct_cuenta_bancaria_sobre_anticipo').prop('disabled', true); // Deshabilitar selección de cuentas existentes
    }
});

// Listener de control para el Checkbox de Nueva Cuenta
$('#chk_inscribir_nueva_cuenta').on('change', function () {
    const isChecked = $(this).is(':checked');

    // Inputs de la nueva cuenta
    const inputsNuevaCuenta = $('#txt_num_cuenta_nuevo, #slct_banco_nuevo, #slct_tipo_cuenta_nuevo');

    if (isChecked) {
        $('#inputs_nueva_cuenta').slideDown(200);
        inputsNuevaCuenta.prop('disabled', false);
        $('#slct_cuenta_bancaria').prop('disabled', true).val(''); // Limpiar y deshabilitar la cuenta existente
    } else {
        $('#inputs_nueva_cuenta').slideUp(200);
        inputsNuevaCuenta.prop('disabled', true).val('');
        $('#slct_cuenta_bancaria').prop('disabled', false); // Habilitar la cuenta existente
    }
});