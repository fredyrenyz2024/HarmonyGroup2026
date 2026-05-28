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
        // if (e.target.matches(`#campo-${window.VENTANA}-filtrar`) || e.target.matches(`#campo-${window.VENTANA}-filtrar *`)) {
        //     let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
        //     let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;

        //     GraficarInstruccionesFacturacion(fecha_inicial, fecha_final);
        // }

        if (e.target.matches(`#btn-detalle-manifiestos`) || e.target.matches(`#btn-detalle-manifiestos *`)) {
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

        // if (e.target.matches(`#btn-anticipo`) || e.target.matches(`#btn-anticipo *`)) {
        //     let Boton = e.target.closest(`#btn-anticipo`);
        //     // Capturamos el documento del conductor para la validación
        //     const Numdoc_Conductor = Boton.getAttribute('data-Numdoc-conductor');
        //     const Valor_Anticipo = Boton.getAttribute('data-valor-anticipo');
        //     const Conductor = Boton.getAttribute('data-conductor_manifiesto');
        //     const Nombre_conductor = Boton.getAttribute('data-conductor');
        //     const Manifiesto = Boton.getAttribute('data-manifiesto');

        //     if (!Numdoc_Conductor) {
        //         Swal.fire('Error', 'Documento del conductor no disponible.', 'error');
        //         return;
        //     }

        //     // 1. Mostrar indicador de validación
        //     Swal.fire({
        //         title: 'Validando requisitos de pago...',
        //         text: 'Verificando datos bancarios y documentación.',
        //         icon: 'info',
        //         showConfirmButton: false,
        //         allowOutsideClick: false
        //     });

        //     const formData = new FormData();
        //     formData.append('Numdoc_Conductor', Numdoc_Conductor);

        //     try {
        //         const response = await fetch($('#base_url').val() + 'novedades/validarDatosAnticipo', { // 👈 Endpoint del controlador
        //             method: 'POST',
        //             body: formData
        //         });

        //         const result = await response.json();
        //         Swal.close(); // Cerrar el indicador de carga

        //         if (result.status === true) {
        //             // 2. ÉXITO: Los datos son válidos, procedemos al formulario/lógica de anticipo
        //             Swal.fire('Validación Completa', result.message, 'success');

        //             document.getElementById(`bloque_anticipo`).style.display = '';
        //             document.getElementById(`bloque_liquidacion`).style.display = 'none';
        //             document.getElementById(`bloque-pagos`).style.display = 'none';
        //             // document.getElementById(`bloque_pago`).style.display = 'none';

        //             const valorNumerico = parseFloat(Valor_Anticipo.replace(/,/g, ''));

        //             const valorFormateado = valorNumerico.toLocaleString('es-CO', {
        //                 style: 'currency',
        //                 currency: 'COP'
        //             });

        //             document.getElementById('valor_anticipo').value = valorFormateado;

        //             document.getElementById(`beneficiario_anticipo`).value = Conductor + ' - ' + Nombre_conductor;
        //             document.getElementById(`btn-buscar-beneficiario`).setAttribute('data-numdoc-conductor', Numdoc_Conductor);
        //             document.getElementById(`btn-guardar-anticipo`).setAttribute('data-manifiesto', Manifiesto);
        //             document.getElementById(`btn-guardar-anticipo`).setAttribute('data-numdoc-conductor', Numdoc_Conductor);

        //         } else {
        //             // 3. FALLO: Mostrar el mensaje de error detallado
        //             Swal.fire('Validación Requerida', result.message, 'warning');
        //         }

        //     } catch (error) {
        //         Swal.fire('Error de Conexión', 'No se pudo comunicar con el servidor para la validación.', 'error');
        //         console.error('Fetch error:', error);
        //     }
        // }


        // JS

        // document.addEventListener("click", async e => {
        //     // 🛑 Listener para el botón de Elaborar Anticipo
        //     if (e.target.matches(`#btn-anticipo`) || e.target.matches(`#btn-anticipo *`)) {
        //         let Boton = e.target.closest(`#btn-anticipo`);

        //         // 1. Captura de datos necesarios
        //         const Numdoc_Conductor = Boton.getAttribute('data-Numdoc-conductor');
        //         const Valor_Anticipo = Boton.getAttribute('data-valor-anticipo');
        //         const Conductor = Boton.getAttribute('data-conductor_manifiesto'); // Documento del conductor
        //         const Nombre_conductor = Boton.getAttribute('data-conductor'); // Nombre completo del conductor
        //         const Manifiesto = Boton.getAttribute('data-manifiesto');

        //         if (!Numdoc_Conductor) {
        //             Swal.fire('Error', 'Documento del conductor no disponible.', 'error');
        //             return;
        //         }

        //         // 2. Mostrar indicador de validación
        //         Swal.fire({
        //             title: 'Validando requisitos de pago...',
        //             text: 'Verificando datos bancarios y documentación.',
        //             icon: 'info',
        //             showConfirmButton: false,
        //             allowOutsideClick: false
        //         });

        //         const formData = new FormData();
        //         formData.append('Numdoc_Conductor', Numdoc_Conductor);

        //         try {
        //             const response = await fetch($('#base_url').val() + 'novedades/validarDatosAnticipo', {
        //                 method: 'POST',
        //                 body: formData
        //             });

        //             const result = await response.json();
        //             Swal.close(); // Cerrar el indicador de carga

        //             if (result.status === true) {
        //                 // 3. ÉXITO: Abrir el bloque de anticipo y cargar valores

        //                 // Mostrar el mensaje de éxito (con el método de pago activo)
        //                 Swal.fire('Validación Completa', result.message, 'success');

        //                 // Mostrar el bloque de Anticipo y ocultar otros bloques de gestión de pago
        //                 document.getElementById(`bloque_anticipo`).style.display = '';
        //                 document.getElementById(`bloque_liquidacion`).style.display = 'none';
        //                 document.getElementById(`bloque-pagos`).style.display = 'none';

        //                 // Procesar y formatear el valor del anticipo
        //                 const valorLimpio = parseFloat(Valor_Anticipo.replace(/[^0-9.-]+/g, "") || 0); // Limpiar para asegurar número
        //                 const valorFormateado = valorLimpio.toLocaleString('es-CO', { // Formato final (ej: $ 1.234.567)
        //                     style: 'currency',
        //                     currency: 'COP',
        //                     minimumFractionDigits: 0
        //                 });

        //                 // 4. Llenar los campos del formulario de Anticipo
        //                 document.getElementById('valor_anticipo').value = valorFormateado;
        //                 document.getElementById(`beneficiario_anticipo`).value = Nombre_conductor; // Asumo que este campo recibe el nombre legible

        //                 // 🛑 Pasar datos para la acción final de guardado
        //                 document.getElementById(`btn-buscar-beneficiario`).setAttribute('data-numdoc-conductor', Numdoc_Conductor);
        //                 document.getElementById(`btn-guardar-anticipo`).setAttribute('data-manifiesto', Manifiesto);
        //                 document.getElementById(`btn-guardar-anticipo`).setAttribute('data-numdoc-conductor', Numdoc_Conductor);


        //             } else {
        //                 // 5. FALLO: Mostrar el mensaje de error detallado del Controlador
        //                 Swal.fire('Validación Requerida', result.message, 'warning');
        //             }

        //         } catch (error) {
        //             Swal.fire('Error de Conexión', 'No se pudo comunicar con el servidor para la validación.', 'error');
        //             console.error('Fetch error:', error);
        //         }
        //     }
        // });

            if (e.target.matches(`#btn-anticipo`) || e.target.matches(`#btn-anticipo *`)) {
        let Boton = e.target.closest(`#btn-anticipo`);
        
        // 1. Captura de datos
        const Numdoc_Conductor = Boton.getAttribute('data-Numdoc-conductor');
        const Valor_Anticipo = Boton.getAttribute('data-valor-anticipo');
        const Nombre_conductor = Boton.getAttribute('data-conductor'); 
        const Manifiesto = Boton.getAttribute('data-manifiesto');

        if (!Numdoc_Conductor) {
            Swal.fire('Error', 'Documento del conductor no disponible.', 'error');
            return;
        }

        Swal.fire({ title: 'Validando requisitos de pago...', icon: 'info', showConfirmButton: false, allowOutsideClick: false });

        const formData = new FormData();
        formData.append('Numdoc_Conductor', Numdoc_Conductor);

        try {
            const response = await fetch($('#base_url').val() + 'novedades/validarDatosAnticipo', { method: 'POST', body: formData });
            const result = await response.json();
            Swal.close(); 

            if (result.status === true) {
                // 3. ÉXITO: Abrir el bloque de anticipo y cargar valores
                Swal.fire('Validación Completa', result.message, 'success');

                document.getElementById(`bloque_anticipo`).style.display = '';
                document.getElementById(`bloque_liquidacion`).style.display = 'none';
                document.getElementById(`bloque-pagos`).style.display = 'none';
                
                const valorLimpio = parseFloat(Valor_Anticipo.replace(/[^0-9.-]+/g, "") || 0);
                const valorFormateado = valorLimpio.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

                // 4. Llenar campos
                document.getElementById('valor_anticipo').value = valorFormateado;
                document.getElementById(`beneficiario_anticipo`).value = Nombre_conductor; 
                
                // Pasar datos para la acción final de guardado
                document.getElementById(`btn-guardar-anticipo`).setAttribute('data-manifiesto', Manifiesto);
                document.getElementById(`btn-guardar-anticipo`).setAttribute('data-numdoc-conductor', Numdoc_Conductor);

                // 🛑 LLAMADA CLAVE: Inicializar el formulario con las opciones validadas
                inicializarFormularioAnticipo(result.validacion);

            } else {
                // 5. FALLO: Mostrar el mensaje de error detallado del Controlador
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
        if (e.target.matches('#btn-guardar-anticipo') || e.target.matches('#btn-guardar-anticipo *')) {
            let Boton = e.target.closest('#btn-guardar-anticipo');
            let Manifiesto = Boton.getAttribute('data-manifiesto');
            // Nuevo campo: Numdoc
            let Numdoc = Boton.getAttribute('data-numdoc-conductor');
            let Anticipo = document.getElementById('valor_anticipo').value;
            let fecha_anticipo = document.getElementById('fecha_anticipo').value;
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

        //Liquidacion
        if (e.target.matches(`#btn-liquidacion`) || e.target.matches(`#btn-liquidacion *`)) {
            let Boton = e.target.closest(`#btn-liquidacion`);

            const Numdoc_Tenedor = Boton.getAttribute('data-numdoc-tenedor');
            const Valor_Liquidacion = Boton.getAttribute('data-valor-liquidacion');
            const Tenedor = Boton.getAttribute('data-nit-titular');
            const Nombre_tenedor = Boton.getAttribute('data-tenedor');
            const Manifiesto = Boton.getAttribute('data-manifiesto');

            if (!Numdoc_Tenedor) {
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
            formData.append('Numdoc_Conductor', Numdoc_Tenedor);

            try {
                const response = await fetch($('#base_url').val() + 'novedades/validarDatosAnticipo', { // 👈 Endpoint del controlador
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                Swal.close(); // Cerrar el indicador de carga

                if (result.status === true) {
                    // 2. ÉXITO: Los datos son válidos, procedemos al formulario/lógica de anticipo
                    Swal.fire('Validación Completa', 'Validación de pagos exitosa. Puede continuar con la liquidación.', 'success');

                    // 🚨 AQUÍ VA LA LÓGICA PARA ELABORAR EL ANTICIPO
                    // Por ejemplo, cargar un modal o redirigir:
                    // cargarFormularioAnticipo(Boton.attributes); 
                    document.getElementById(`bloque_liquidacion`).style.display = '';
                    document.getElementById(`bloque_anticipo`).style.display = 'none';
                    document.getElementById(`bloque-pagos`).style.display = 'none';
                    // document.getElementById(`bloque_pago`).style.display = 'none';

                    const valorNumerico = parseFloat(Valor_Liquidacion.replace(/,/g, ''));

                    const valorFormateado = valorNumerico.toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                    });
                    document.getElementById('valor_liquidacion').value = valorFormateado;

                    document.getElementById(`beneficiario_liquidacion`).value = Tenedor + ' - ' + Nombre_tenedor;
                    document.getElementById(`btn-buscar-beneficiario-liquidacion`).setAttribute('data-numdoc-tenedor', Numdoc_Tenedor);
                    document.getElementById(`btn-buscar-beneficiario-liquidacion-rut`).setAttribute('data-numdoc-tenedor', Numdoc_Tenedor);
                    document.getElementById(`btn-guardar-liquidacion`).setAttribute('data-manifiesto', Manifiesto);
                    document.getElementById(`btn-guardar-liquidacion`).setAttribute('data-numdoc-tenedor', Numdoc_Tenedor);

                } else {
                    // 3. FALLO: Mostrar el mensaje de error detallado
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

        // Asegúrate de que SweetAlert2 (Swal) esté cargado en tu página.
        if (e.target.matches('#btn-guardar-liquidacion') || e.target.matches('#btn-guardar-liquidacion *')) {
            let Boton = e.target.closest('#btn-guardar-liquidacion');
            let Manifiesto = Boton.getAttribute('data-manifiesto');
            let Numdoc = Boton.getAttribute('data-numdoc-tenedor');
            let Liquidacion = document.getElementById('valor_liquidacion').value;
            let fecha_liquidacion = document.getElementById('fecha_liquidacion').value;
            let documento_liquidacion_input = document.getElementById('documento_liquidacion');

            // Validamos la existencia del archivo antes de intentar acceder a files[0]
            let documento_liquidacion = documento_liquidacion_input.files[0] ?? null;

            // 1. Validación simple en cliente con Swal
            if (!Manifiesto || !Liquidacion || !fecha_liquidacion || !documento_liquidacion) {
                console.error("Faltan campos obligatorios: Manifiesto ID, Valor, Fecha o Documento de liquidación.");
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos Incompletos',
                    text: 'Por favor, complete todos los campos y adjunte el documento de la liquidación.',
                    confirmButtonText: 'Entendido'
                });
                return; // Detiene la ejecución si faltan datos
            }

            // 2. Preparar FormData
            const formData = new FormData();
            formData.append('manifiesto_id', Manifiesto);
            formData.append('numdoc_tenedor', Numdoc); // Nuevo campo (numdoc_tenedor)
            formData.append('liquidacion', Liquidacion);
            formData.append('fecha_liquidacion', fecha_liquidacion);
            formData.append('documento_liquidacion', documento_liquidacion); // Archivo

            // 3. Ejecutar Fetch
            fetch($('#base_url').val() + 'novedades/UpdateLiquidacion', { // Asumiendo 'UpdateLiquidacion'
                method: 'POST',
                body: formData
            })
                .then(res => {
                    // Intentamos leer el JSON para manejar errores específicos del servidor
                    if (!res.ok) {
                        return res.json().then(errorData => {
                            throw new Error(errorData.message || `Error HTTP! Status: ${res.status}`);
                        });
                    }
                    return res.json();
                })
                .then(data => {
                    // 4. Mostrar respuesta con SweetAlert
                    if (data.status === true) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Liquidación Guardada!',
                            text: data.message,
                            confirmButtonText: 'Aceptar'
                        }).then(() => {
                            // Opcional: Recargar la página o actualizar la vista
                            location.reload();
                            document.getElementById(`bloque_liquidacion`).style.display = 'none';
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error en la Operación',
                            text: data.message || 'Ocurrió un error inesperado al guardar la liquidación.',
                            confirmButtonText: 'Cerrar'
                        });
                    }
                })
                .catch(err => {
                    console.error("Error en la petición fetch:", err);

                    // 5. Mostrar error general con SweetAlert
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Conexión',
                        text: 'Ocurrió un error al procesar la liquidación. Detalle: ' + err.message,
                        confirmButtonText: 'Cerrar'
                    });
                });
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

                        if (data) {
                            document.getElementById(`bloque-pagos`).style.display = '';
                            document.getElementById(`bloque_liquidacion`).style.display = 'none';
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

        if (e.target.matches(`#btn-cancelar-liquidacion`) || e.target.matches(`#btn-cancelar-liquidacion *`)) {
            document.getElementById(`bloque_liquidacion`).style.display = 'none';
            limpiarBloqueLiquidacion();
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
                        <td>${element.Tenedor}</td>
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
                    <td>${tenedor || 'N/A'}</td>
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
                        <th style="width: auto; white-space: nowrap;">Conductor</th>
                        <th style="width: auto; white-space: nowrap;">Fecha Creación</th>
                        <th style="width: auto; white-space: nowrap;">Origen</th>
                        <th style="width: auto; white-space: nowrap;">Destino</th>
                        <th style="width: auto; white-space: nowrap;">Anticipo</th>
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

        // <td> 
        //     <div class="dropdown">
        //         <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${m.id}</a>
        //         <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
        //         <a class="dropdown-item fw-bold" href="#" id='btn-anticipo' data-nit-titular="${nit}" data-tenedor="${tenedor}" data-conductor="${conductor}" data-direccion="${direccion}" data-celular="${celular}" data-municipio="${municipio}" data-Manifiesto-id="${m.id}" 
        //         data-conductor_manifiesto="${m.conductor_manifiesto}" data-Numdoc-conductor='${m.Nudoc_Conductor}' data-valor-anticipo='${m.valor_anticipo}'>Elaborar Anticipo</a>

        //         <a class="dropdown-item fw-bold" href="#" data-nit-titular="${nit}" data-tenedor="${tenedor}" data-conductor="${conductor}" data-direccion="${direccion}" data-celular="${celular}" data-municipio="${municipio}" data-Manifiesto-id="${m.id}" 
        //         data-conductor_manifiesto="${m.conductor_manifiesto}" data-Numdoc-tenedor='${m.Nudoc_Tenedor}'>Elaborar Liquidación</a>
        //             <!--<a class="dropdown-item fw-bold" href="#">Elaborar Liquidación</a>-->
        //             <a class="dropdown-item fw-bold" href="#">Detalle Documento</a>

        //             <!--<div class="dropdown-divider"></div>
        //             <a class="dropdown-item fw-bold" href="#">Separated link</a>-->
        //         </div>
        //     </div>
        // </td>

        tableHTML += `
            <tr>
                <td style="width: auto; white-space: nowrap;"> 
                    <a class="fw-bold text-decoration-none" type="button" onClick="ImprimirManifiesto(${m.id})">
                    #${m.id}
                    </a>
                </td>
                <td style="width: auto; white-space: nowrap;">${m.placa}</td>
                <td style="width: auto; white-space: nowrap;">${m.Conductor}</td>
                <td style="width: auto; white-space: nowrap;">${m.fecha_expedicion}</td>
                <td style="width: auto; white-space: nowrap;">${m.Origen}</td>
                <td style="width: auto; white-space: nowrap;">${m.Destino}</td>
                <td style="width: auto; white-space: nowrap;">${estado_anticipo}</td>
                <td style="width: auto; white-space: nowrap;">${estado_liquidacion}</td>
                <td style="width: auto; white-space: nowrap;">${estado_pago}</td>
                <td style="width: auto; white-space: nowrap;">${m.Agencia}</td>
                <td style="width: auto; white-space: nowrap;">
                    <div class="btn-group btn-group-sm" role="group" aria-label="...">
                    ${m.estado_ancipo === null || m.estado_ancipo === 'Pendiente' ? `<button class="btn btn-primary btn-sm me-1 px-1 py-0" type="button" id='btn-anticipo' data-manifiesto='${m.id}' data-nit-titular="${nit}" data-tenedor="${tenedor}" data-conductor="${conductor}" data-direccion="${direccion}" 
                    data-celular="${celular}" data-municipio="${municipio}" data-Manifiesto-id="${m.id}" data-conductor_manifiesto="${m.conductor_manifiesto}" data-Numdoc-conductor='${m.Nudoc_Conductor}' data-valor-anticipo='${m.valor_anticipo}'>Anticipo</button>` : ''}

                    ${m.estado_liquidacion === null || m.estado_liquidacion === 'Pendiente' ? `<button class="btn btn-warning btn-sm me-1 px-1 py-0" type="button" id='btn-liquidacion' data-manifiesto='${m.id}' data-nit-titular="${nit}" data-tenedor="${tenedor}" data-conductor="${conductor}" data-direccion="${direccion}" 
                    data-celular="${celular}" data-municipio="${municipio}" data-Manifiesto-id="${m.id}" data-conductor_manifiesto="${m.conductor_manifiesto}" data-Numdoc-tenedor='${m.Nudoc_Tenedor}' data-valor-liquidacion='${m.saldo}'>Liquidación</button>` : ''}

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

/**
 * Función que formatea los datos y los inyecta en el Offcanvas con una UI más bonita.
 * @param {object} detalle Objeto con los datos del manifiesto (anticipo y liquidación).
 */
function mostrarDetalleManifiesto(detalle) {
    // Función para formatear valores a moneda local (COP, usando es-CO)
    const formatCurrency = (value) => {
        return (parseFloat(value) || 0).toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        });
    };

    // Función para generar el enlace al documento
    // Función para generar el enlace al documento
    const getDocumentLink = (path, name, color) => {
        if (!path || path.trim() === '') {
            return '<span class="badge bg-secondary"><i class="fas fa-times-circle"></i> No registrado</span>';
        }

        // Usamos la URL base para construir la ruta absoluta del archivo
        const fullUrl = $('#base_url').val() + path;

        // CORRECCIÓN: Se envuelve la llamada a Openventana en el onclick para que se ejecute AL hacer clic
        return `<a type='button' class="btn btn-sm btn-${color} me-1 px-1 py-1" onclick='Openventana("${fullUrl}")'><i class="fas fa-file-pdf"></i> ${name}</a>`;
    };

    // --- Bloque de Anticipo ---
    const anticipoHtml = `
        <div class="card mb-4 border-success shadow-sm">
            <div class="card-header bg-success text-white p-1">
                <h5 class="mb-0 text-white"><i class="fas fa-hand-holding-usd"></i> Detalle del Anticipo</h5>
            </div>
            <ul class="list-group list-group-flush p-1">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Valor Anticipado:</strong>
                    <span class="badge bg-success">${Number(detalle[0].anticipo).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Estado:</strong>
                    <span class="badge bg-success">${detalle[0].estado_ancipo || 'N/A'}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Fecha y Hora:</strong>
                    <span><i class="far fa-calendar-alt"></i> ${detalle[0].fecha_anticipo || 'N/A'} <i class="far fa-clock ms-2"></i> ${detalle[0].hora_anticipo || ''}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Registrado por:</strong>
                    <span><i class="fas fa-user-check"></i> ${detalle[0].usuario_anticipo || 'N/A'}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Documento Soporte:</strong>
                    ${getDocumentLink(detalle[0].documento_anticipo, 'Ver Documento', 'success')}
                </li>
            </ul >
        </div >
    `;

    // --- Bloque de Liquidación ---
    const liquidacionHtml = `
    <div class="card mb-4 border-primary shadow-sm">
            <div class="card-header bg-primary text-white p-1">
                <h5 class="mb-0 text-white"><i class="fas fa-money-check-alt"></i> Detalle de la Liquidación</h5>
            </div>
            <ul class="list-group list-group-flush p-1">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Valor Liquidado:</strong>
                    <span class="badge bg-primary">${Number(detalle[0].liquidacion).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Estado:</strong>
                    <span class="badge bg-primary">${detalle[0].estado_liquidacion || 'N/A'}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Fecha y Hora:</strong>
                    <span><i class="far fa-calendar-alt"></i> ${detalle[0].fecha_liquidacion || 'N/A'} <i class="far fa-clock ms-2"></i> ${detalle[0].hora_liquidacion || ''}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Registrado por:</strong>
                    <span><i class="fas fa-user-check"></i> ${detalle[0].usuario_liquidacion || 'N/A'}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Documento Soporte:</strong>
                    ${getDocumentLink(detalle[0].documento_liquidacion, 'Ver Documento', 'primary')}
                </li>
            </ul>
        </div >
    `;

    // --- Bloque de Información General ---
    const generalHtml = `
    <div class="alert alert-info shadow-sm p-1" role ="alert">
        <div class="d-flex justify-content-between align-items-center">
            <h6 class="mb-0"><i class="fas fa-info-circle"></i> ID Manifiesto: <strong>${detalle[0].manifiesto_id}</strong></h6>
            <span class="badge bg-dark">${detalle[0].estado_pago || 'PENDIENTE'}</span>
        </div>
        </div>
    <hr class="mb-4">
        `;

    const offcanvasBody = document.querySelector('#detalle-pagos');

    if (offcanvasBody) {
        // Inyectar todo el contenido
        offcanvasBody.innerHTML = generalHtml + anticipoHtml + liquidacionHtml;
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

// JS (Fragmento completo que maneja la validación y la interfaz de Anticipo)

/**
 * Función que inicializa el formulario de anticipo con los métodos de pago disponibles 
 * y maneja la visibilidad de las opciones.
 * @param {object} validacion - El objeto 'validacion' devuelto por el controlador.
 */
// function inicializarFormularioAnticipo(validacion) {
//     const selectMetodo = $('#slct_metodo_pago');
//     const contenedorOpciones = $('#contenedor_opciones_pago');

//     // Opciones de detalle de pago (se ocultan inicialmente)
//     const opcionTarjetas = $('#opcion_tarjetas');
//     const opcionCuentas = $('#opcion_cuentas');
//     const chkNuevaCuenta = $('#chk_inscribir_nueva_cuenta');

//     // Limpieza
//     selectMetodo.empty().append('<option value="">Seleccione Método</option>');
//     opcionTarjetas.hide();
//     opcionCuentas.hide();

//     const datosAdicionales = validacion.datos_adicionales || {};

//     // 🛑 1. Llenar SELECT DE MÉTODO DE PAGO

//     // Opción Tarjeta Asignada (Si existe)
//     if (datosAdicionales.asignacion_id) {
//         selectMetodo.append(`<option value="TARJETA" data-id="${datosAdicionales.asignacion_id}">Tarjeta Asignada</option>`);
//         // NOTA: Asumo que tienes una función para listar las tarjetas en el select de detalle.
//         // listarTarjetasParaAnticipo();
//     }

//     // Opción Cuenta Principal (Si existe)
//     if (datosAdicionales.pf_id) {
//         const cuentaDisplay = datosAdicionales.pf_cuenta ? 'Cuenta Principal (***' + datosAdicionales.pf_cuenta.slice(-4) + ')' : 'Cuenta Principal (Sin N°)';
//         selectMetodo.append(`<option value="CUENTA_P">${cuentaDisplay}</option>`);
//     }

//     // Opción Tercero Beneficiario (Si existe)
//     if (datosAdicionales.ben_documento) {
//         selectMetodo.append(`<option value="TERCERO">Tercero Beneficiario</option>`);
//     }

//     // Opción para inscribir NUEVA CUENTA (siempre disponible si no hay tarjeta asignada)
//     // Se añade solo si el conductor no tiene tarjeta asignada (para forzar su uso)
//     // if (!datosAdicionales.asignacion_id) {
//     selectMetodo.append(`<option value="NUEVA_CUENTA">Inscribir Nueva Cuenta</option>`);
//     // }

//     // 🛑 2. Control inicial y selección por defecto
//     if (selectMetodo.find('option').length > 1) {
//         contenedorOpciones.slideDown(200);
//         // Seleccionar el primer método de pago disponible
//         selectMetodo.val(selectMetodo.find('option:eq(1)').val()).trigger('change');
//     } else {
//         contenedorOpciones.hide();
//     }
// }

// --------------------------------------------------------------------------------
// 🛑 LISTENERS DE CONTROL DE INTERFAZ
// --------------------------------------------------------------------------------

// Listener del SELECT de Método de Pago
// $('#slct_metodo_pago').on('change', function () {
//     const metodo = $(this).val();

//     // Ocultar todas las opciones de detalle al cambiar
//     $('#opcion_tarjetas').slideUp(100);
//     $('#opcion_cuentas').slideUp(100);
//     $('#chk_inscribir_nueva_cuenta').prop('checked', false);

//     // 🛑 Lógica para habilitar las opciones específicas
//     if (metodo === 'TARJETA') {
//         $('#opcion_tarjetas').slideDown(200);
//         // Habilitar la selección de tarjeta disponible aquí si aplica
//     } else if (metodo === 'CUENTA_P' || metodo === 'TERCERO') {
//         $('#opcion_cuentas').slideDown(200);
//         // Deshabilitar la opción de nueva cuenta si ya seleccionó una cuenta existente
//         $('#chk_inscribir_nueva_cuenta').prop('disabled', true);
//         $('#slct_cuenta_bancaria').prop('disabled', false); // Habilitar la selección de cuenta existente
//     } else if (metodo === 'NUEVA_CUENTA') {
//         $('#opcion_cuentas').slideDown(200);
//         $('#chk_inscribir_nueva_cuenta').prop('checked', true).prop('disabled', false).trigger('change'); // Forzar chequeo
//         $('#slct_cuenta_bancaria').prop('disabled', true); // Deshabilitar el select de cuentas existentes
//     }
// });

// Listener de control para el Checkbox de Nueva Cuenta
// $('#chk_inscribir_nueva_cuenta').on('change', function () {
//     const isChecked = $(this).is(':checked');

//     // 🛑 Lógica para habilitar/deshabilitar los inputs de inscripción
//     // Asumo que tienes inputs: #txt_num_cuenta_nuevo, #slct_banco_nuevo, #slct_tipo_cuenta_nuevo

//     // Ejemplo de cómo habilitar/deshabilitar campos de nueva cuenta:
//     // $('#txt_num_cuenta_nuevo').prop('disabled', !isChecked);
//     // $('#slct_banco_nuevo').prop('disabled', !isChecked);

//     // Si se desmarca manualmente, asegurar que se vuelva a seleccionar la cuenta existente si aplica
//     if (!isChecked && $('#slct_metodo_pago').val() === 'NUEVA_CUENTA') {
//         // Forzar a Seleccione Método si se desmarca sin seleccionar algo más
//         $('#slct_metodo_pago').val('').trigger('change');
//     }
// });

// JS (Fragmento completo del módulo de anticipos)

// --------------------------------------------------------------------------------
// 🛑 FUNCIONES DE CONTROL DE INTERFAZ Y LÓGICA DE NEGOCIO
// --------------------------------------------------------------------------------

/**
 * Función que inicializa el formulario de anticipo con los métodos de pago disponibles 
 * y selecciona el método activo.
 * @param {object} validacion - El objeto 'validacion' devuelto por el controlador.
 */
function inicializarFormularioAnticipo(validacion) {
    const selectMetodo = $('#slct_metodo_pago');
    const contenedorOpciones = $('#contenedor_opciones_pago');
    
    // Opciones de detalle de pago (se ocultan inicialmente)
    const opcionTarjetas = $('#opcion_tarjetas');
    const opcionCuentas = $('#opcion_cuentas');
    const chkNuevaCuenta = $('#chk_inscribir_nueva_cuenta');
    
    // Limpieza
    selectMetodo.empty().append('<option value="">Seleccione Método</option>');
    opcionTarjetas.hide();
    opcionCuentas.hide();
    
    const datosAdicionales = validacion.datos_adicionales || {};
    const metodoActivo = validacion.metodo_pago; // Ej: 'Tarjeta Asignada', 'Cuenta Principal', etc.

    // Mapeo de texto de la validación a valor del select
    const metodoMap = {
        'Tarjeta Asignada': 'TARJETA',
        'Cuenta Principal': 'CUENTA_P',
        'Tercero Beneficiario': 'TERCERO'
    };
    const valorPreseleccionado = metodoMap[metodoActivo] || '';

    // 1. 🛑 Llenar SELECT DE MÉTODO DE PAGO
    
    // Opción Tarjeta Asignada (Si existe)
    if (datosAdicionales.asignacion_id) {
        selectMetodo.append(`<option value="TARJETA" data-id="${datosAdicionales.asignacion_id}">Tarjeta Asignada</option>`);
    }
    
    // Opción Cuenta Principal (Si existe)
    if (datosAdicionales.pf_id) {
        const cuentaDisplay = datosAdicionales.pf_cuenta ? 'Cuenta Principal (***' + String(datosAdicionales.pf_cuenta).slice(-4) + ')' : 'Cuenta Principal (Sin N°)';
        selectMetodo.append(`<option value="CUENTA_P">${cuentaDisplay}</option>`);
    }
    
    // Opción Tercero Beneficiario (Si existe)
    if (datosAdicionales.ben_documento) {
        selectMetodo.append(`<option value="TERCERO">Tercero Beneficiario</option>`);
    }
    
    // Opción para inscribir NUEVA CUENTA
    selectMetodo.append(`<option value="NUEVA_CUENTA">Inscribir Nueva Cuenta (Cambiar Pago)</option>`);

    // 2. 🛑 Control inicial y selección por defecto
    if (selectMetodo.find('option').length > 1) {
        contenedorOpciones.slideDown(200);
        // Seleccionar el método activo o el primero si no hay activo
        const valorInicial = valorPreseleccionado || selectMetodo.find('option:eq(1)').val();
        
        // Usamos setTimeout para asegurar que el DOM y Select2 (si aplica) estén listos
        setTimeout(() => {
            selectMetodo.val(valorInicial).trigger('change'); 
        }, 100);
        
    } else {
        contenedorOpciones.hide();
    }
    
    // 3. 🛑 Inicializar Listener de control de nueva cuenta si no está ya activo
    // Esto asegura que al cargar el formulario, el checkbox ya tenga su listener
    if (!selectMetodo.data('metodoPagoChangeListener')) {
        selectMetodo.data('metodoPagoChangeListener', true);
    }
}

// --------------------------------------------------------------------------------
// 🛑 LISTENERS DE CONTROL DE INTERFAZ (Se asume que están al nivel superior del script)
// --------------------------------------------------------------------------------

// Listener del SELECT de Método de Pago
$('#slct_metodo_pago').on('change', function() {
    const metodo = $(this).val();
    
    // Ocultar y deshabilitar opciones de nueva cuenta
    $('#opcion_tarjetas').slideUp(100);
    $('#opcion_cuentas').slideUp(100);
    
    // Reiniciar el control de la nueva cuenta
    $('#chk_inscribir_nueva_cuenta').prop('checked', false).prop('disabled', false); 
    $('#slct_cuenta_bancaria').prop('disabled', false); 
    
    // 🛑 Lógica para habilitar las opciones específicas
    if (metodo === 'TARJETA') {
        $('#opcion_tarjetas').slideDown(200);
        $('#chk_inscribir_nueva_cuenta').prop('disabled', true); // No puede inscribir si usa tarjeta
        
    } else if (metodo === 'CUENTA_P' || metodo === 'TERCERO') {
        $('#opcion_cuentas').slideDown(200);
        // Si se usa una cuenta existente, se deshabilita la opción de nueva cuenta
        $('#chk_inscribir_nueva_cuenta').prop('disabled', true); 
        
    } else if (metodo === 'NUEVA_CUENTA') {
         // 🛑 Habilitar el bloque de cuentas y forzar el check de inscripción
         $('#opcion_cuentas').slideDown(200);
         $('#chk_inscribir_nueva_cuenta').prop('checked', true).prop('disabled', false).trigger('change');
         $('#slct_cuenta_bancaria').prop('disabled', true); // Deshabilitar selección de cuentas existentes
    }
});

// Listener de control para el Checkbox de Nueva Cuenta
$('#chk_inscribir_nueva_cuenta').on('change', function() {
    const isChecked = $(this).is(':checked');
    
    // Lógica para habilitar/deshabilitar los inputs de nueva cuenta aquí si existen
    // Ej: $('#txt_num_cuenta_nuevo').prop('disabled', !isChecked);
    
    // Si se desmarca manualmente, resetear el select si estaba en 'NUEVA_CUENTA'
    if (!isChecked && $('#slct_metodo_pago').val() === 'NUEVA_CUENTA') {
        $('#slct_metodo_pago').val('').trigger('change'); 
    }
});


// --------------------------------------------------------------------------------
// 🛑 LISTENER DEL BOTÓN DE ANTICIPO (Tu código principal)
// --------------------------------------------------------------------------------

// document.addEventListener("click", async e => {
//     if (e.target.matches(`#btn-anticipo`) || e.target.matches(`#btn-anticipo *`)) {
//         let Boton = e.target.closest(`#btn-anticipo`);
        
//         // 1. Captura de datos
//         const Numdoc_Conductor = Boton.getAttribute('data-Numdoc-conductor');
//         const Valor_Anticipo = Boton.getAttribute('data-valor-anticipo');
//         const Nombre_conductor = Boton.getAttribute('data-conductor'); 
//         const Manifiesto = Boton.getAttribute('data-manifiesto');

//         if (!Numdoc_Conductor) {
//             Swal.fire('Error', 'Documento del conductor no disponible.', 'error');
//             return;
//         }

//         Swal.fire({ title: 'Validando requisitos de pago...', icon: 'info', showConfirmButton: false, allowOutsideClick: false });

//         const formData = new FormData();
//         formData.append('Numdoc_Conductor', Numdoc_Conductor);

//         try {
//             const response = await fetch($('#base_url').val() + 'novedades/validarDatosAnticipo', { method: 'POST', body: formData });
//             const result = await response.json();
//             Swal.close(); 

//             if (result.status === true) {
//                 // 3. ÉXITO: Abrir el bloque de anticipo y cargar valores
//                 Swal.fire('Validación Completa', result.message, 'success');

//                 document.getElementById(`bloque_anticipo`).style.display = '';
//                 document.getElementById(`bloque_liquidacion`).style.display = 'none';
//                 document.getElementById(`bloque-pagos`).style.display = 'none';
                
//                 const valorLimpio = parseFloat(Valor_Anticipo.replace(/[^0-9.-]+/g, "") || 0);
//                 const valorFormateado = valorLimpio.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

//                 // 4. Llenar campos
//                 document.getElementById('valor_anticipo').value = valorFormateado;
//                 document.getElementById(`beneficiario_anticipo`).value = Nombre_conductor; 
                
//                 // Pasar datos para la acción final de guardado
//                 document.getElementById(`btn-guardar-anticipo`).setAttribute('data-manifiesto', Manifiesto);
//                 document.getElementById(`btn-guardar-anticipo`).setAttribute('data-numdoc-conductor', Numdoc_Conductor);

//                 // 🛑 LLAMADA CLAVE: Inicializar el formulario con las opciones validadas
//                 inicializarFormularioAnticipo(result.validacion);

//             } else {
//                 // 5. FALLO: Mostrar el mensaje de error detallado del Controlador
//                 Swal.fire('Validación Requerida', result.message, 'warning');
//             }

//         } catch (error) {
//             Swal.fire('Error de Conexión', 'No se pudo comunicar con el servidor para la validación.', 'error');
//             console.error('Fetch error:', error);
//         }
//     }
// });