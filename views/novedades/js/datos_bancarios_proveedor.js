window.VENTANA = "";
// Asumo que tu SELECT tiene el ID 'slct_proveedores_activos'
window.SELECT_ID = '#slct_proveedores_activos';
// window.ENDPOINT = 'novedades/listarProveedoresActivos';
window.btnCancelar = document.getElementById('btn-cancelar');

window.initScript = function (id) {
    window.VENTANA = id;

    // consultar datos de configuracion
    cargarDatosFinancieros();
    // cargarSelectProveedores();

    // Es buena práctica ejecutar la función de control una vez al inicio
    actualizarCamposFinancieros();

    // JS - Función para guardar/actualizar los datos financieros del proveedor
    $(document).off('click', '#btn-update-datos').on('click', '#btn-update-datos', async function (e) {
        // La lógica de `e.target.matches` se maneja implícitamente por jQuery aquí.
        e.preventDefault(); // Previene la acción por defecto si el botón fuera un submit

        const CertificadoCuenta = document.getElementById(`flexSwitchCheckCertificadoCuenta`).checked;
        const esConductor = document.getElementById('checkConductor').checked;
        const esPoseedor = document.getElementById('checkPoseedor').checked;
        const flexSwitchCheckDocumentos = document.getElementById(`flexSwitchCheckDocumentos`).checked;

        if (CertificadoCuenta && esConductor) {
            const certificadoCuentaFile = document.getElementById('certificado_cuenta').files[0];
            const idProveedor = document.getElementById('slct_proveedores_activos').value;
            const formData = new FormData();
            formData.append('id_proveedor', idProveedor);
            if (certificadoCuentaFile) { formData.append('certificado_file', certificadoCuentaFile); }

            try {
                const response = await fetch($('#base_url').val() + 'novedades/actualizarCertificadoCuenta', { method: 'POST', body: formData });
                const result = await response.json();

                if (result.status === true) {
                    Swal.fire('Éxito', result.message, 'success');
                    // document.getElementById(`flexSwitchCheckCertificadoCuenta`).style.display = 'none';
                    // CertificadoCuenta.checked = false;
                    limpiarFormularioFinanciero();
                    listarDatosFinancieros(idProveedor);
                } else {
                    Swal.fire('Error', result.message || 'Fallo al actualizar los datos.', 'error');
                }
            } catch (error) {
                console.error('Fetch Error:', error);
                Swal.fire('Error de Conexión', 'No se pudo comunicar con el servidor.', 'error');
            }
        } else if (flexSwitchCheckDocumentos && esPoseedor) {

        } else {
            // 1. Captura de datos base y switch
            const idProveedor = document.getElementById('slct_proveedores_activos').value;
            const actividadEconomica = document.getElementById('acti_economica').value;
            const obligacionTributaria = document.getElementById('tributaria').value;
            const banco = document.getElementById('banco').value;
            const tipoCuenta = document.getElementById('tipo_cuenta').value;
            const numeroCuenta = document.getElementById('num_cuenta').value;
            const fecha_vencimiento_seguridad_social = document.getElementById('fecha_vencimiento_seguridad').value;
            const esBeneficiario = document.getElementById('flexSwitchCheckBeneficiario').checked;
            const errores = [];

            // Archivos Proveedor Principal
            const certificadoCuentaFile = document.getElementById('certificado_cuenta').files[0];
            const certificadoRutFile = document.getElementById('certificado_rut').files[0];
            const certificadoSeguridadFile = document.getElementById('certificado_seguridad').files[0];

            // 🛑 CAPTURA TEMPRANA DE DATOS Y ARCHIVOS DEL BENEFICIARIO
            const docBeneficiario = document.getElementById('num_documento_beneficiario').value;
            const nombresBeneficiario = document.getElementById('nombres_beneficiario').value;
            const apellidosBeneficiario = document.getElementById('apellidos_beneficiario').value;
            const bancoBeneficiario = document.getElementById('banco_beneficiario').value;
            const tipoCuentaBeneficiario = document.getElementById('tipo_cuenta_beneficiario').value;
            const numCuentaBeneficiario = document.getElementById('num_cuenta_beneficiario').value;

            const certificadoCuentaBeneficiarioFile = document.getElementById('certificado_cuenta_beneficiario').files[0];
            const certificadoRutBeneficiarioFile = document.getElementById('certificado_rut_beneficiario').files[0];
            const certificadoSeguridadBeneficiarioFile = document.getElementById('certificado_seguridad_beneficiario').files[0];
            const acuerdoBeneficiarioFile = document.getElementById('acuerdo_beneficiario').files[0];

            // ------------------------------------------------------------------
            // 🛑 VALIDACIÓN 2: DATOS FINANCIEROS DEL PROVEEDOR PRINCIPAL (Lógica de Exclusión)
            // ------------------------------------------------------------------
            if (!idProveedor) { errores.push('Debe seleccionar un proveedor principal.'); }

            if (!esBeneficiario) {
                // Si el pago es directo al proveedor, los campos son obligatorios
                if (!banco) { errores.push('Debe seleccionar el <strong>Banco del proveedor</strong>.'); }
                if (!numeroCuenta) { errores.push('Debe ingresar el <strong>Número de cuenta del proveedor</strong>.'); }
                if (!fecha_vencimiento_seguridad_social && !esConductor) { errores.push('Debe ingresar la <strong>Fecha de Vencimiento de la Seguridad Social</strong>.'); }
            }

            // ------------------------------------------------------------------
            // 🛑 VALIDACIÓN 3: TERCERO BENEFICIARIO (Si el switch está ON)
            // ------------------------------------------------------------------
            if (esBeneficiario) {
                if (esConductor) {
                    // Validaciones Obligatorias del Beneficiario
                    if (!docBeneficiario) { errores.push('Debe ingresar el <strong>Documento del Beneficiario</strong>.'); }
                    if (!nombresBeneficiario) { errores.push('Debe ingresar los <strong>Nombres del Beneficiario</strong>.'); }
                    if (!apellidosBeneficiario) { errores.push('Debe ingresar los <strong>Apellidos del Beneficiario</strong>.'); }
                    if (!bancoBeneficiario) { errores.push('Debe seleccionar el <strong>Banco del Beneficiario</strong>.'); }
                    if (!tipoCuentaBeneficiario) { errores.push('Debe seleccionar el <strong>Tipo de Cuenta del Beneficiario</strong>.'); }
                    if (!numCuentaBeneficiario) { errores.push('Debe ingresar el <strong>Número de Cuenta del Beneficiario</strong>.'); }
                    if (!certificadoCuentaBeneficiarioFile) { errores.push('Falta adjuntar <strong>Certificado Cuenta Beneficiario</strong>.'); }
                    // if (!certificadoRutBeneficiarioFile) { errores.push('Falta adjuntar <strong>Certificado Rut Beneficiario</strong>.'); }
                    // if (!certificadoSeguridadBeneficiarioFile) { errores.push('Falta adjuntar <strong>Seguridad Social Beneficiario</strong>.'); }
                    // if (!acuerdoBeneficiarioFile) { errores.push('Falta adjuntar <strong>Acuerdo Beneficiario</strong>.'); }
                } else {
                    // Validaciones Obligatorias del Beneficiario
                    if (!docBeneficiario) { errores.push('Debe ingresar el <strong>Documento del Beneficiario</strong>.'); }
                    if (!nombresBeneficiario) { errores.push('Debe ingresar los <strong>Nombres del Beneficiario</strong>.'); }
                    if (!apellidosBeneficiario) { errores.push('Debe ingresar los <strong>Apellidos del Beneficiario</strong>.'); }
                    if (!bancoBeneficiario) { errores.push('Debe seleccionar el <strong>Banco del Beneficiario</strong>.'); }
                    if (!tipoCuentaBeneficiario) { errores.push('Debe seleccionar el <strong>Tipo de Cuenta del Beneficiario</strong>.'); }
                    if (!numCuentaBeneficiario) { errores.push('Debe ingresar el <strong>Número de Cuenta del Beneficiario</strong>.'); }
                    // if (!fecha_vencimiento_seguridad_social) { errores.push('Debe ingresar la <strong>Fecha de Vencimiento de la Seguridad Social</strong>.'); }
                    if (!certificadoCuentaBeneficiarioFile) { errores.push('Falta adjuntar <strong>Certificado Cuenta Beneficiario</strong>.'); }
                    if (!certificadoRutBeneficiarioFile) { errores.push('Falta adjuntar <strong>Certificado Rut Beneficiario</strong>.'); }
                    if (!certificadoSeguridadBeneficiarioFile) { errores.push('Falta adjuntar <strong>Seguridad Social Beneficiario</strong>.'); }
                    if (!acuerdoBeneficiarioFile) { errores.push('Falta adjuntar <strong>Acuerdo Beneficiario</strong>.'); }
                }
            }

            // ------------------------------------------------------------------
            // 4. MOSTRAR ERRORES O CONTINUAR
            // ------------------------------------------------------------------
            if (errores.length > 0) {
                const listaErrores = errores.map(msg => `<li>${msg}</li>`).join('');
                Swal.fire({ title: 'Documentación Incompleta', html: `<ul class="text-start ps-4">${listaErrores}</ul>`, icon: 'warning', confirmButtonText: 'Corregir', });
                return;
            }

            // 5. PREPARAR FORM DATA (Lógica de envío)
            const formData = new FormData();
            formData.append('id_proveedor', idProveedor);
            formData.append('actividad_economica', actividadEconomica || 0);
            formData.append('obliga_tributaria', obligacionTributaria || 0);
            formData.append('banco', banco || 0);
            formData.append('tipo_cuenta', tipoCuenta === 'Seleccione' ? 0 : tipoCuenta);
            formData.append('numero_cuenta', numeroCuenta || 0);
            formData.append('fecha_vencimiento_seguridad_social', fecha_vencimiento_seguridad_social);

            // Archivos Proveedor Principal (Solo se envían si existen)
            if (certificadoCuentaFile) { formData.append('certificado_file', certificadoCuentaFile); }
            if (certificadoRutFile) { formData.append('rut_file', certificadoRutFile); }
            if (certificadoSeguridadFile) { formData.append('seguridad_file', certificadoSeguridadFile); }

            // Datos y Archivos del Beneficiario (Condicional)
            formData.append('es_beneficiario', esBeneficiario ? 1 : 0);
            if (esBeneficiario) {
                formData.append('doc_beneficiario', docBeneficiario);
                formData.append('nombres_beneficiario', nombresBeneficiario);
                formData.append('apellidos_beneficiario', apellidosBeneficiario);
                formData.append('banco_beneficiario', bancoBeneficiario);
                formData.append('tipo_cuenta_beneficiario', tipoCuentaBeneficiario);
                formData.append('num_cuenta_beneficiario', numCuentaBeneficiario);


                formData.append('certificado_cuenta_beneficiario_file', certificadoCuentaBeneficiarioFile);
                formData.append('certificado_rut_beneficiario_file', certificadoRutBeneficiarioFile);
                formData.append('certificado_seguridad_beneficiario_file', certificadoSeguridadBeneficiarioFile);
                formData.append('acuerdo_beneficiario_file', acuerdoBeneficiarioFile);
            }

            // 6. Petición Fetch
            try {
                const response = await fetch($('#base_url').val() + 'novedades/guardarDatosFinancieros', { method: 'POST', body: formData });
                const result = await response.json();

                if (result.status === true) {
                    Swal.fire('Éxito', result.message, 'success');
                    listarDatosFinancieros(idProveedor);
                    limpiarFormularioFinanciero();
                } else {
                    Swal.fire('Error', result.message || 'Fallo al actualizar los datos.', 'error');
                }
            } catch (error) {
                console.error('Fetch Error:', error);
                Swal.fire('Error de Conexión', 'No se pudo comunicar con el servidor.', 'error');
            }
        }

        // if (seguridadSocial) {
        //     const certificadoSeguridadFile = document.getElementById('certificado_seguridad').files[0];
        //     const idProveedor = document.getElementById('slct_proveedores_activos').value;
        //     const formData = new FormData();
        //     formData.append('id_proveedor', idProveedor);
        //     if (certificadoSeguridadFile) { formData.append('seguridad_file', certificadoSeguridadFile); }

        //     try {
        //         const response = await fetch($('#base_url').val() + 'novedades/actualizarSeguridadSocial', { method: 'POST', body: formData });
        //         const result = await response.json();

        //         if (result.status === true) {
        //             Swal.fire('Éxito', result.message, 'success');
        //             listarDatosFinancieros(idProveedor);
        //             limpiarFormularioFinanciero();
        //         } else {
        //             Swal.fire('Error', result.message || 'Fallo al actualizar los datos.', 'error');
        //         }
        //     } catch (error) {
        //         console.error('Fetch Error:', error);
        //         Swal.fire('Error de Conexión', 'No se pudo comunicar con el servidor.', 'error');
        //     }
        // } else {
        //     // 1. Captura de datos base y switch
        //     const idProveedor = document.getElementById('slct_proveedores_activos').value;
        //     const actividadEconomica = document.getElementById('acti_economica').value;
        //     const obligacionTributaria = document.getElementById('tributaria').value;
        //     const banco = document.getElementById('banco').value;
        //     const tipoCuenta = document.getElementById('tipo_cuenta').value;
        //     const numeroCuenta = document.getElementById('num_cuenta').value;
        //     const esBeneficiario = document.getElementById('flexSwitchCheckBeneficiario').checked;
        //     const errores = [];

        //     // Archivos Proveedor Principal
        //     const certificadoCuentaFile = document.getElementById('certificado_cuenta').files[0];
        //     const certificadoRutFile = document.getElementById('certificado_rut').files[0];
        //     const certificadoSeguridadFile = document.getElementById('certificado_seguridad').files[0];

        //     // 🛑 CAPTURA TEMPRANA DE DATOS Y ARCHIVOS DEL BENEFICIARIO
        //     const docBeneficiario = document.getElementById('num_documento_beneficiario').value;
        //     const nombresBeneficiario = document.getElementById('nombres_beneficiario').value;
        //     const apellidosBeneficiario = document.getElementById('apellidos_beneficiario').value;
        //     const bancoBeneficiario = document.getElementById('banco_beneficiario').value;
        //     const tipoCuentaBeneficiario = document.getElementById('tipo_cuenta_beneficiario').value;
        //     const numCuentaBeneficiario = document.getElementById('num_cuenta_beneficiario').value;

        //     const certificadoCuentaBeneficiarioFile = document.getElementById('certificado_cuenta_beneficiario').files[0];
        //     const certificadoRutBeneficiarioFile = document.getElementById('certificado_rut_beneficiario').files[0];
        //     const certificadoSeguridadBeneficiarioFile = document.getElementById('certificado_seguridad_beneficiario').files[0];
        //     const acuerdoBeneficiarioFile = document.getElementById('acuerdo_beneficiario').files[0];

        //     // ------------------------------------------------------------------
        //     // 🛑 VALIDACIÓN 2: DATOS FINANCIEROS DEL PROVEEDOR PRINCIPAL (Lógica de Exclusión)
        //     // ------------------------------------------------------------------
        //     if (!idProveedor) { errores.push('Debe seleccionar un proveedor principal.'); }

        //     if (!esBeneficiario) {
        //         // Si el pago es directo al proveedor, los campos son obligatorios
        //         if (!banco) { errores.push('Debe seleccionar el <strong>Banco del proveedor</strong>.'); }
        //         if (!numeroCuenta) { errores.push('Debe ingresar el <strong>Número de cuenta del proveedor</strong>.'); }
        //     }

        //     // ------------------------------------------------------------------
        //     // 🛑 VALIDACIÓN 3: TERCERO BENEFICIARIO (Si el switch está ON)
        //     // ------------------------------------------------------------------
        //     if (esBeneficiario) {
        //         // Validaciones Obligatorias del Beneficiario
        //         if (!docBeneficiario) { errores.push('Debe ingresar el <strong>Documento del Beneficiario</strong>.'); }
        //         if (!nombresBeneficiario) { errores.push('Debe ingresar los <strong>Nombres del Beneficiario</strong>.'); }
        //         if (!apellidosBeneficiario) { errores.push('Debe ingresar los <strong>Apellidos del Beneficiario</strong>.'); }
        //         if (!bancoBeneficiario) { errores.push('Debe seleccionar el <strong>Banco del Beneficiario</strong>.'); }
        //         if (!tipoCuentaBeneficiario) { errores.push('Debe seleccionar el <strong>Tipo de Cuenta del Beneficiario</strong>.'); }
        //         if (!numCuentaBeneficiario) { errores.push('Debe ingresar el <strong>Número de Cuenta del Beneficiario</strong>.'); }
        //         if (!certificadoCuentaBeneficiarioFile) { errores.push('Falta adjuntar <strong>Certificado Cuenta Beneficiario</strong>.'); }
        //         if (!certificadoRutBeneficiarioFile) { errores.push('Falta adjuntar <strong>Certificado Rut Beneficiario</strong>.'); }
        //         if (!certificadoSeguridadBeneficiarioFile) { errores.push('Falta adjuntar <strong>Seguridad Social Beneficiario</strong>.'); }
        //         if (!acuerdoBeneficiarioFile) { errores.push('Falta adjuntar <strong>Acuerdo Beneficiario</strong>.'); }
        //     }

        //     // ------------------------------------------------------------------
        //     // 4. MOSTRAR ERRORES O CONTINUAR
        //     // ------------------------------------------------------------------
        //     if (errores.length > 0) {
        //         const listaErrores = errores.map(msg => `<li>${msg}</li>`).join('');
        //         Swal.fire({ title: 'Documentación Incompleta', html: `<ul class="text-start ps-4">${listaErrores}</ul>`, icon: 'warning', confirmButtonText: 'Corregir', });
        //         return;
        //     }

        //     // 5. PREPARAR FORM DATA (Lógica de envío)
        //     const formData = new FormData();
        //     formData.append('id_proveedor', idProveedor);
        //     formData.append('actividad_economica', actividadEconomica || 0);
        //     formData.append('obliga_tributaria', obligacionTributaria || 0);
        //     formData.append('banco', banco || 0);
        //     formData.append('tipo_cuenta', tipoCuenta === 'Seleccione' ? 0 : tipoCuenta);
        //     formData.append('numero_cuenta', numeroCuenta || 0);

        //     // Archivos Proveedor Principal (Solo se envían si existen)
        //     if (certificadoCuentaFile) { formData.append('certificado_file', certificadoCuentaFile); }
        //     if (certificadoRutFile) { formData.append('rut_file', certificadoRutFile); }
        //     if (certificadoSeguridadFile) { formData.append('seguridad_file', certificadoSeguridadFile); }

        //     // Datos y Archivos del Beneficiario (Condicional)
        //     formData.append('es_beneficiario', esBeneficiario ? 1 : 0);
        //     if (esBeneficiario) {
        //         formData.append('doc_beneficiario', docBeneficiario);
        //         formData.append('nombres_beneficiario', nombresBeneficiario);
        //         formData.append('apellidos_beneficiario', apellidosBeneficiario);
        //         formData.append('banco_beneficiario', bancoBeneficiario);
        //         formData.append('tipo_cuenta_beneficiario', tipoCuentaBeneficiario);
        //         formData.append('num_cuenta_beneficiario', numCuentaBeneficiario);

        //         formData.append('certificado_cuenta_beneficiario_file', certificadoCuentaBeneficiarioFile);
        //         formData.append('certificado_rut_beneficiario_file', certificadoRutBeneficiarioFile);
        //         formData.append('certificado_seguridad_beneficiario_file', certificadoSeguridadBeneficiarioFile);
        //         formData.append('acuerdo_beneficiario_file', acuerdoBeneficiarioFile);
        //     }

        //     // 6. Petición Fetch
        //     try {
        //         const response = await fetch($('#base_url').val() + 'novedades/guardarDatosFinancieros', { method: 'POST', body: formData });
        //         const result = await response.json();

        //         if (result.status === true) {
        //             Swal.fire('Éxito', result.message, 'success');
        //             listarDatosFinancieros(idProveedor);
        //             limpiarFormularioFinanciero();
        //         } else {
        //             Swal.fire('Error', result.message || 'Fallo al actualizar los datos.', 'error');
        //         }
        //     } catch (error) {
        //         console.error('Fetch Error:', error);
        //         Swal.fire('Error de Conexión', 'No se pudo comunicar con el servidor.', 'error');
        //     }
        // }
    });

    if (window.btnCancelar) {
        window.btnCancelar.addEventListener('click', function () {
            // Mostrar una confirmación antes de recargar
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Se perderán todos los cambios no guardados.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, cancelar y salir',
                cancelButtonText: 'No, seguir editando'
            }).then((result) => {
                if (result.isConfirmed) {
                    // 🛑 RECARGA LA PÁGINA ACTUAL
                    window.location.reload();
                }
            });
        });
    }

    // document.addEventListener('click', async (e) => {
    //     if (e.target.matches('#btn-update-datos') || e.target.matches('#btn-update-datos *')) {

    //         // 1. Captura de datos base y switch
    //         const idProveedor = document.getElementById('slct_proveedores_activos').value;
    //         const actividadEconomica = document.getElementById('acti_economica').value;
    //         const obligacionTributaria = document.getElementById('tributaria').value;
    //         const banco = document.getElementById('banco').value;
    //         const tipoCuenta = document.getElementById('tipo_cuenta').value;
    //         const numeroCuenta = document.getElementById('num_cuenta').value;
    //         const esBeneficiario = document.getElementById('flexSwitchCheckBeneficiario').checked;
    //         const errores = [];

    //         // Archivos Proveedor Principal
    //         const certificadoCuentaFile = document.getElementById('certificado_cuenta').files[0];
    //         const certificadoRutFile = document.getElementById('certificado_rut').files[0];
    //         const certificadoSeguridadFile = document.getElementById('certificado_seguridad').files[0];

    //         // 🛑 CAPTURA TEMPRANA DE DATOS Y ARCHIVOS DEL BENEFICIARIO
    //         const docBeneficiario = document.getElementById('num_documento_beneficiario').value;
    //         const nombresBeneficiario = document.getElementById('nombres_beneficiario').value;
    //         const apellidosBeneficiario = document.getElementById('apellidos_beneficiario').value;
    //         const bancoBeneficiario = document.getElementById('banco_beneficiario').value;
    //         const tipoCuentaBeneficiario = document.getElementById('tipo_cuenta_beneficiario').value;
    //         const numCuentaBeneficiario = document.getElementById('num_cuenta_beneficiario').value;

    //         const certificadoCuentaBeneficiarioFile = document.getElementById('certificado_cuenta_beneficiario').files[0];
    //         const certificadoRutBeneficiarioFile = document.getElementById('certificado_rut_beneficiario').files[0];
    //         const certificadoSeguridadBeneficiarioFile = document.getElementById('certificado_seguridad_beneficiario').files[0];
    //         const acuerdoBeneficiarioFile = document.getElementById('acuerdo_beneficiario').files[0];

    //         // ------------------------------------------------------------------
    //         // 🛑 VALIDACIÓN 2: DATOS FINANCIEROS DEL PROVEEDOR PRINCIPAL (Lógica de Exclusión)
    //         // ------------------------------------------------------------------
    //         if (!idProveedor) { errores.push('Debe seleccionar un proveedor principal.'); }

    //         if (!esBeneficiario) {
    //             // Si el pago es directo al proveedor, los campos son obligatorios
    //             if (!banco) { errores.push('Debe seleccionar el <strong>Banco del proveedor</strong>.'); }
    //             if (!numeroCuenta) { errores.push('Debe ingresar el <strong>Número de cuenta del proveedor</strong>.'); }
    //         }

    //         // ------------------------------------------------------------------
    //         // 🛑 VALIDACIÓN 3: TERCERO BENEFICIARIO (Si el switch está ON)
    //         // ------------------------------------------------------------------
    //         if (esBeneficiario) {
    //             // Validaciones Obligatorias del Beneficiario
    //             if (!docBeneficiario) { errores.push('Debe ingresar el <strong>Documento del Beneficiario</strong>.'); }
    //             if (!nombresBeneficiario) { errores.push('Debe ingresar los <strong>Nombres del Beneficiario</strong>.'); }
    //             if (!apellidosBeneficiario) { errores.push('Debe ingresar los <strong>Apellidos del Beneficiario</strong>.'); }
    //             if (!bancoBeneficiario) { errores.push('Debe seleccionar el <strong>Banco del Beneficiario</strong>.'); }
    //             if (!tipoCuentaBeneficiario) { errores.push('Debe seleccionar el <strong>Tipo de Cuenta del Beneficiario</strong>.'); }
    //             if (!numCuentaBeneficiario) { errores.push('Debe ingresar el <strong>Número de Cuenta del Beneficiario</strong>.'); }
    //             if (!certificadoCuentaBeneficiarioFile) { errores.push('Falta adjuntar <strong>Certificado Cuenta Beneficiario</strong>.'); }
    //             if (!certificadoRutBeneficiarioFile) { errores.push('Falta adjuntar <strong>Certificado Rut Beneficiario</strong>.'); }
    //             if (!certificadoSeguridadBeneficiarioFile) { errores.push('Falta adjuntar <strong>Seguridad Social Beneficiario</strong>.'); }
    //             if (!acuerdoBeneficiarioFile) { errores.push('Falta adjuntar <strong>Acuerdo Beneficiario</strong>.'); }
    //         }

    //         // ------------------------------------------------------------------
    //         // 4. MOSTRAR ERRORES O CONTINUAR
    //         // ------------------------------------------------------------------
    //         if (errores.length > 0) {
    //             const listaErrores = errores.map(msg => `<li>${msg}</li>`).join('');
    //             Swal.fire({ title: 'Documentación Incompleta', html: `<ul class="text-start ps-4">${listaErrores}</ul>`, icon: 'warning', confirmButtonText: 'Corregir', });
    //             return;
    //         }

    //         // 5. PREPARAR FORM DATA (Lógica de envío)
    //         const formData = new FormData();
    //         formData.append('id_proveedor', idProveedor);
    //         formData.append('actividad_economica', actividadEconomica || 0);
    //         formData.append('obliga_tributaria', obligacionTributaria || 0);
    //         formData.append('banco', banco || 0);
    //         formData.append('tipo_cuenta', tipoCuenta === 'Seleccione' ? 0 : tipoCuenta);
    //         formData.append('numero_cuenta', numeroCuenta || 0);

    //         // Archivos Proveedor Principal (Solo se envían si existen)
    //         if (certificadoCuentaFile) { formData.append('certificado_file', certificadoCuentaFile); }
    //         if (certificadoRutFile) { formData.append('rut_file', certificadoRutFile); }
    //         if (certificadoSeguridadFile) { formData.append('seguridad_file', certificadoSeguridadFile); }

    //         // Datos y Archivos del Beneficiario (Condicional)
    //         formData.append('es_beneficiario', esBeneficiario ? 1 : 0);
    //         if (esBeneficiario) {
    //             formData.append('doc_beneficiario', docBeneficiario);
    //             formData.append('nombres_beneficiario', nombresBeneficiario);
    //             formData.append('apellidos_beneficiario', apellidosBeneficiario);
    //             formData.append('banco_beneficiario', bancoBeneficiario);
    //             formData.append('tipo_cuenta_beneficiario', tipoCuentaBeneficiario);
    //             formData.append('num_cuenta_beneficiario', numCuentaBeneficiario);

    //             formData.append('certificado_cuenta_beneficiario_file', certificadoCuentaBeneficiarioFile);
    //             formData.append('certificado_rut_beneficiario_file', certificadoRutBeneficiarioFile);
    //             formData.append('certificado_seguridad_beneficiario_file', certificadoSeguridadBeneficiarioFile);
    //             formData.append('acuerdo_beneficiario_file', acuerdoBeneficiarioFile);
    //         }

    //         // 6. Petición Fetch
    //         try {
    //             const response = await fetch($('#base_url').val() + 'novedades/guardarDatosFinancieros', { method: 'POST', body: formData });
    //             const result = await response.json();

    //             if (result.status === true) {
    //                 Swal.fire('Éxito', result.message, 'success');
    //             } else {
    //                 Swal.fire('Error', result.message || 'Fallo al actualizar los datos.', 'error');
    //             }
    //         } catch (error) {
    //             console.error('Fetch Error:', error);
    //             Swal.fire('Error de Conexión', 'No se pudo comunicar con el servidor.', 'error');
    //         }
    //     }
    // });

    // Listener para cambio de proveedor (para recargar el listado)
    // Usamos el evento 'change' directamente en el selector de jQuery, 
    // lo cual funciona correctamente con Select2.
    $('#slct_proveedores_activos').on('change', function () {
        // 'this' es el elemento SELECT nativo
        const idProveedor = $(this).val();

        // El valor de Select2 se limpia a '' (cadena vacía) si allowClear está activo
        if (idProveedor) {
            // Llama a la función de listar para mostrar los datos existentes
            listarDatosFinancieros(idProveedor);
        } else {
            // Limpia la tabla si el select está vacío (ej. al usar allowClear)
            document.getElementById('tbody-datos-financieros').innerHTML = '';
        }
    });

    // JS - Lógica para mostrar/ocultar y limpiar el bloque de beneficiarios
    document.addEventListener('change', async e => {
        // 🛑 1. Control de visibilidad del bloque de Beneficiario
        if (e.target.matches(`#flexSwitchCheckBeneficiario`)) {
            const bloqueBeneficiario = document.getElementById('datos_beneficiarios');
            const isChecked = e.target.checked;

            if (isChecked) {
                $(bloqueBeneficiario).slideDown(300);
            } else {
                // Ocultar y opcionalmente limpiar los campos al desactivar
                $(bloqueBeneficiario).slideUp(300, () => {
                    // Función auxiliar para limpiar el formulario del beneficiario (si la creas)
                    // limpiarFormularioBeneficiario(); 
                });
            }
        }

        if (e.target.matches(`#flexSwitchCheckSeguridadSocial`)) {
            const isChecked = e.target.checked;

            if (isChecked) {
                document.getElementById('acti_economica').disabled = true;
                document.getElementById('tributaria').disabled = true;
                document.getElementById('banco').disabled = true;
                document.getElementById('tipo_cuenta').disabled = true;
                document.getElementById('num_cuenta').disabled = true;
                document.getElementById('certificado_cuenta').disabled = true;
                document.getElementById('certificado_rut').disabled = true;
                document.getElementById('flexSwitchCheckBeneficiario').disabled = true;
            } else {
                document.getElementById('acti_economica').disabled = false;
                document.getElementById('tributaria').disabled = false;
                document.getElementById('banco').disabled = false;
                document.getElementById('tipo_cuenta').disabled = false;
                document.getElementById('num_cuenta').disabled = false;
                document.getElementById('certificado_cuenta').disabled = false;
                document.getElementById('certificado_rut').disabled = false;
                document.getElementById('flexSwitchCheckBeneficiario').disabled = false;
            }
        }
    });

    // 🛑 LISTENER DE EVENTOS (Monitorear el cambio en los checkboxes)
    // document.addEventListener('change', async e => {
    //     if (e.target.matches('.check-actividad')) {

    //         // 🛑 Desmarcar el otro checkbox para asegurar selección única (UX)
    //         const currentCheck = e.target;
    //         document.querySelectorAll('.check-actividad').forEach(otherCheck => {
    //             if (otherCheck !== currentCheck && currentCheck.checked) {
    //                 otherCheck.checked = false;
    //             }
    //         });

    //         // Ejecutar la lógica de búsqueda de proveedor
    //         handleActivityChange();
    //     }
    // });

    // --------------------------------------------------------------------------------
    // 🛑 LISTENERS DE EVENTO (Disparadores)
    // --------------------------------------------------------------------------------

    document.addEventListener('change', async e => {
        // 1. Cambio de actividad (Conductor/Poseedor)
        if (e.target.matches('.check-actividad')) {
            const currentCheck = e.target;

            // Asegurar selección única
            document.querySelectorAll('.check-actividad').forEach(otherCheck => {
                if (otherCheck !== currentCheck && currentCheck.checked) {
                    otherCheck.checked = false;
                }
            });

            // Ejecutar la lógica de búsqueda de proveedor
            handleActivityChange();

            // 🛑 EJECUTAR LÓGICA DE CONTROL DE CAMPOS AL CAMBIAR LA ACTIVIDAD
            actualizarCamposFinancieros();

        }

        // 2. Cambio de Tercero Beneficiario
        if (e.target.matches(`#flexSwitchCheckBeneficiario`)) {
            const bloqueBeneficiario = document.getElementById('datos_beneficiarios');
            const isChecked = e.target.checked;

            // Lógica de mostrar/ocultar
            if (isChecked) {
                $(bloqueBeneficiario).slideDown(300);
            } else {
                $(bloqueBeneficiario).slideUp(300);
            }

            // 🛑 EJECUTAR LÓGICA DE CONTROL DE CAMPOS AL ACTIVAR/DESACTIVAR BENEFICIARIO
            actualizarCamposFinancieros();
        }

        // 3. Cambio de Seguridad Social (Si el check existe y afecta la interfaz)
        if (e.target.matches(`#flexSwitchCheckSeguridadSocial`)) {
            // Esto podría afectar si el campo de archivo se convierte en opcional.
            // actualizarCamposFinancieros(); // (Opcional, si el check de seguridad social tiene un efecto directo en required)
        }
    });
}

// Función para inicializar Select2 de forma genérica
function inicializarSelect2(selector, placeholderText) {
    // Si el elemento ya es un Select2, lo destruimos antes de reinicializar
    if ($(selector).data('select2')) {
        $(selector).select2('destroy');
    }

    $(selector).select2({
        placeholder: placeholderText || 'Seleccione una opción',
        allowClear: true,
        // Agrega dropdownParent si el select está en un modal/offcanvas
        // dropdownParent: $('#ID_DEL_MODAL') 
    });
}

// Función principal de carga de datos financieros
function cargarDatosFinancieros() {

    // 🚨 1. Limpieza inicial de selects (antes del AJAX)
    $('#banco').empty().append('<option value="">Seleccione</option>');
    $('#tributaria').empty().append('<option value="">Seleccione</option>');
    $('#acti_economica').empty().append('<option value="">Seleccione</option>');

    // Si ya tienen Select2 activo, limpiamos la visualización
    // Esto se maneja mejor en la inicialización (ver abajo)

    var consulta_datos = {
        action: 'Consulta_Datos_Financieros',
    };

    $.ajax({
        url: $('#base_url').val() + 'libs/hojas_de_vida_ajax.php',
        type: 'POST',
        data: consulta_datos,
        dataType: 'json',
        success: function (data) {

            // 2. Llenar selects
            if (data.result) { // Bancos (asumo que result es la lista de bancos)
                data.result.forEach(function (element) {
                    $('#banco').append('<option value="' + element.id + '">' + element.abreviatura + '</option>');
                });
            }

            if (data.result) { // Bancos (asumo que result es la lista de bancos)
                data.result.forEach(function (element) {
                    $('#banco_beneficiario').append('<option value="' + element.id + '">' + element.abreviatura + '</option>');
                });
            }

            if (data.result2) { // Obligaciones Tributarias
                data.result2.forEach(function (element) {
                    $('#tributaria').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
                });
            }

            if (data.result3) { // Actividades Económicas
                data.result3.forEach(function (element) {
                    $('#acti_economica').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
                });
            }

            // 🚨 3. Inicializar Select2 después de que el DOM esté poblado
            inicializarSelect2('#banco', 'Seleccione un Banco');
            inicializarSelect2('#banco_beneficiario', 'Seleccione un Banco');
            inicializarSelect2('#tributaria', 'Seleccione Obligación Tributaria');
            inicializarSelect2('#acti_economica', 'Seleccione Actividad Económica');

            // Nota: Si los selects ya tienen el valor seteado (como .val() en tu código original), 
            // el .val() ya no es necesario aquí, ya que solo se usan para poblar. 
            // Si quieres *seleccionar* un valor preexistente, hazlo justo antes de inicializar Select2.

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error al cargar datos financieros:', errorThrown);
            // Puedes mostrar un mensaje de error en la interfaz si lo deseas
        },
    });
}

/**
 * Maneja el cambio de los checkboxes de actividad para listar proveedores.
 */
async function handleActivityChange() {
    const conductorCheck = document.getElementById('checkConductor');
    const poseedorCheck = document.getElementById('checkPoseedor');

    let actividadSeleccionada = '';

    // 🛑 Lógica de Prioridad: Si ambos están marcados o ninguno, decide la actividad a buscar.
    // Usamos el valor del que esté marcado (Asumimos que solo uno debe estar activo o se busca por el conductor)
    if (conductorCheck.checked) {
        actividadSeleccionada = conductorCheck.value; // "Conductor"
    } else if (poseedorCheck.checked) {
        actividadSeleccionada = poseedorCheck.value; // "Poseedor Vehículo"
    }

    if (actividadSeleccionada) {
        await cargarSelectProveedoresPorActividad(actividadSeleccionada);
    } else {
        // Si no hay ninguno seleccionado (o ambos están desmarcados), limpiar el select.
        $('#slct_proveedores_activos').empty().append('<option value="">Seleccione</option>');
        // Si usas Select2: $('#slct_proveedores_activos').val(null).trigger('change');
    }
}

/**
 * Realiza la petición al backend y llena el select de proveedores.
 * @param {string} actividad La actividad filtrada.
 */
async function cargarSelectProveedoresPorActividad(actividad) {
    const selectId = '#slct_proveedores_activos';
    $(selectId).empty().append('<option value="">Cargando...</option>');

    const formData = new FormData();
    formData.append('actividad', actividad); // La actividad específica ('Conductor'/'Poseedor Vehículo')

    try {
        const response = await fetch($('#base_url').val() + 'novedades/listarProveedoresActivos', {
            method: 'POST',
            body: formData,
            cache: 'no-cache'
        });

        const result = await response.json();
        let html = '<option value="">-- Seleccione Proveedor --</option>';

        if (result.status && result.data.length > 0) {
            result.data.forEach(p => {
                const optionText = `${p.nombre_completo} (NIT/CC: ${p.numero_documento})`;
                html += `<option value="${p.numdoc_nexos}">${optionText}</option>`;
            });
            $(selectId).html(html);

            // Inicializar Select2
            inicializarSelect2(selectId, `Buscar ${actividad}...`);

        } else {
            $(selectId).html('<option value="">No se encontraron proveedores</option>');
            inicializarSelect2(selectId, `No hay proveedores para ${actividad}`);
        }

    } catch (error) {
        console.error('Error al cargar proveedores:', error);
        $(selectId).html('<option value="">Error de carga</option>');
    }
}


// JS - Función para listar datos financieros
async function listarDatosFinancieros(idProveedor) {
    const tbody = document.getElementById('tbody-datos-financieros');
    // Usamos el contenedor padre para inyectar la tabla de beneficiarios
    const contenedorPrincipal = tbody.closest('.table-responsive');
    const contenedorBeneficiarioId = 'contenedor-beneficiario-detalle';

    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Cargando cuentas...</td></tr>`;
    $(`#${contenedorBeneficiarioId}`).remove(); // Limpiar tabla de beneficiarios anterior

    try {
        const formData = new FormData();
        formData.append('id_proveedor', idProveedor);

        const response = await fetch($('#base_url').val() + 'novedades/listarDatosFinancieros', {
            method: 'POST', body: formData
        });
        const result = await response.json();

        if (result.status && result.data.length > 0) {

            let html = '';
            let htmlBeneficiario = '';

            result.data.forEach(item => {
                document.getElementById('banco').value = item.banco;
                // 🛑 CORRECCIÓN: Usar el ID correcto del ítem y disparar 'change'
                // $('#banco').val(item.banco).trigger('change');
                // document.getElementById('tipo_cuenta').value = item.tipo_cuenta;
                // document.getElementById('num_cuenta').value = item.numero_cuenta;
                // document.getElementById('certificado_cuenta').value = item.certificado_adjunto;
                // document.getElementById('certificado_rut').value = item.documento_rut;
                // document.getElementById('certificado_seguridad').value = item.documento_eps;

                const estadoText = item.estado == 1 ? 'ACTIVO' : 'INACTIVO';
                const estadoClass = item.estado == 1 ? 'badge badge-phoenix badge-phoenix-success' : 'badge badge-phoenix badge-phoenix-danger';

                // if (item.documento_eps) {
                //     document.getElementById(`flexSwitchCheckSeguridadSocial`).style.display = '';
                // }

                if (item.certificado_adjunto) {
                    document.getElementById(`flexSwitchCheckCertificadoCuenta`).style.display = '';
                }

                // 🛑 A. Renderizado del Proveedor Principal (Tabla Existente)
                html += `
                    <tr>
                        <td style="width: auto; white-space: nowrap;">${item.nombre_banco}</td>
                        <td style="width: auto; white-space: nowrap;">${item.tipo_cuenta_desc}</td>
                        <td style="width: auto; white-space: nowrap;">${item.numero_cuenta}</td>
                        <td style="width: auto; white-space: nowrap;"><span class="${estadoClass}">${estadoText}</span></td>
                        <td style="width: auto; white-space: nowrap;">
                            ${item.certificado_adjunto ? `<a href="${$('#base_url').val()}public/files/proveedores/financieros/${item.certificado_adjunto}" target="_blank" class="btn btn-primary btn-sm me-1 px-1 py-0"><i class="far fa-file-pdf"></i></a>` : 'N/A'}
                            ${item.documento_rut ? `<a href="${$('#base_url').val()}public/files/proveedores/financieros/${item.documento_rut}" target="_blank" class="btn btn-info btn-sm me-1 px-1 py-0"><i class="far fa-file-pdf"></i></a>` : 'N/A'}
                            ${item.documento_eps ? `<a href="${$('#base_url').val()}public/files/proveedores/financieros/${item.documento_eps}" target="_blank" class="btn btn-warning btn-sm me-1 px-1 py-0"><i class="far fa-file-pdf"></i></a>` : 'N/A'}
                        </td>
                    </tr>
                `;

                // 🛑 B. Verificar y Renderizar Beneficiario
                if (item.ben_documento) {
                    htmlBeneficiario = `
                        <div id="${contenedorBeneficiarioId}" class="mt-4">
                            <h6 class="fw-bold text-success">Datos del Tercero Beneficiario</h6>
                            <table class='table table-bordered table-sm text-center' style="font-size:11px;">
                                <thead class="table-success">
                                    <tr>
                                        <th style="width: auto; white-space: nowrap;">Beneficiario</th>
                                        <th style="width: auto; white-space: nowrap;">Documento</th>
                                        <th style="width: auto; white-space: nowrap;">Banco/Cuenta</th>
                                        <th style="width: auto; white-space: nowrap;">Archivos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="width: auto; white-space: nowrap;">${item.ben_nombres} ${item.ben_apellidos}</td>
                                        <td style="width: auto; white-space: nowrap;">${item.ben_documento}</td>
                                        <td style="width: auto; white-space: nowrap;">${item.ben_nombre_banco} (${item.ben_tipo_cuenta_desc}) - ${item.ben_numero_cuenta}</td>
                                        <td style="width: auto; white-space: nowrap;">
                                            ${item.ben_certificado_adjunto ? `<a href="${$('#base_url').val()}public/files/proveedores/financieros/${item.ben_certificado_adjunto}" target="_blank" class="btn btn-primary btn-sm me-1 px-1 py-0" title="Certificado Cuenta"><i class="far fa-file-pdf"></i></a>` : ''}
                                            ${item.ben_documento_rut ? `<a href="${$('#base_url').val()}public/files/proveedores/financieros/${item.ben_documento_rut}" target="_blank" class="btn btn-info btn-sm me-1 px-1 py-0" title="RUT"><i class="far fa-file-pdf"></i></a>` : ''}
                                            ${item.ben_documento_seguridad ? `<a href="${$('#base_url').val()}public/files/proveedores/financieros/${item.ben_documento_seguridad}" target="_blank" class="btn btn-warning btn-sm me-1 px-1 py-0" title="Seguridad Social"><i class="far fa-file-pdf"></i></a>` : ''}
                                            ${item.ben_documento_acuerdo ? `<a href="${$('#base_url').val()}public/files/proveedores/financieros/${item.ben_documento_acuerdo}" target="_blank" class="btn btn-dark btn-sm me-1 px-1 py-0" title="Acuerdo"><i class="far fa-file-pdf"></i></a>` : ''}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    `;
                }
            });

            tbody.innerHTML = html;

            // 🛑 C. Inyectar el HTML del beneficiario después del contenedor de la tabla principal
            if (htmlBeneficiario) {
                $(contenedorPrincipal).after(htmlBeneficiario);
            }

        } else {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-info">No hay cuentas registradas.</td></tr>`;
        }

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error de carga.</td></tr>`;
        console.error('Listado Error:', error);
    }
}

// JS
/**
 * Limpia y restablece todos los campos del formulario de datos financieros, 
 * incluyendo los campos condicionales del beneficiario.
 */
function limpiarFormularioFinanciero() {

    // 1. SELECTS que usan Select2: Proveedor, Actividad, Tributaria, Bancos
    $('#slct_proveedores_activos').val(null).trigger('change');
    $('#acti_economica').val(null).trigger('change');
    $('#tributaria').val(null).trigger('change');
    $('#banco').val(null).trigger('change');
    $('#banco_beneficiario').val(null).trigger('change'); // 🛑 NUEVO: Banco Beneficiario

    // 2. SELECTS Estándar: Tipo de Cuenta
    $('#tipo_cuenta').val('');
    $('#tipo_cuenta_beneficiario').val(''); // 🛑 NUEVO: Tipo Cuenta Beneficiario

    // 3. INPUTS (Texto/Número)
    $('#num_cuenta').val('');

    // 🛑 NUEVOS: Campos de datos del Beneficiario
    $('#num_documento_beneficiario').val('');
    $('#nombres_beneficiario').val('');
    $('#apellidos_beneficiario').val('');
    $('#num_cuenta_beneficiario').val('');

    // 4. INPUTS de Archivo (FILE)
    $('#certificado_cuenta').val('');
    $('#certificado_rut').val('');
    $('#certificado_seguridad').val('');

    // 🛑 NUEVOS: Archivos del Beneficiario
    $('#certificado_cuenta_beneficiario').val('');
    $('#certificado_rut_beneficiario').val('');
    $('#certificado_seguridad_beneficiario').val('');
    $('#acuerdo_beneficiario').val('');

    // 5. 🛑 CONTROL DE SWITCH Y BLOQUE

    // Desactivar el switch de Beneficiario
    const switchBeneficiario = $('#flexSwitchCheckBeneficiario');
    switchBeneficiario.prop('checked', false).trigger('change');

    document.getElementById(`flexSwitchCheckCertificadoCuenta`).style.display = 'none';

    // Ocultar el bloque de Beneficiario (Se asume que el listener de change lo oculta
    // pero lo forzamos si el listener está en otro scope)
    $('#datos_beneficiarios').slideUp(300);

    console.log("Formulario de datos financieros limpiado.");
}

// --------------------------------------------------------------------------------
// 🛑 FUNCIÓN CENTRAL DE CONTROL DE ESTADO, REQUERIMIENTOS Y BLOQUEOS
// --------------------------------------------------------------------------------

function actualizarCamposFinancieros() {
    // 1. Obtener estados de los switches
    const checkConductor = document.getElementById('checkConductor');
    const checkPoseedor = document.getElementById('checkPoseedor');

    const esConductor = checkConductor?.checked || false;
    const esPoseedor = checkPoseedor?.checked || false;
    const esBeneficiario = document.getElementById('flexSwitchCheckBeneficiario')?.checked || false;

    // 2. Definir conjuntos de campos
    const camposDocumentacion = ['#certificado_rut', '#certificado_seguridad', '#fecha_vencimiento_seguridad']; // Rut/Seguridad Social del Principal
    const camposObligatoriosProv = ['#banco', '#tipo_cuenta', '#num_cuenta']; // Cuenta/Banco
    const camposBeneficiario = [ /* ... todos los campos del beneficiario ... */]; // Definidos en el código anterior

    // ------------------------------------------------------------------------
    // A. LÓGICA DE ACTIVIDAD (CONDUCTOR/POSEEDOR) Y DOCUMENTACIÓN BASE
    // ------------------------------------------------------------------------

    if (esConductor) {
        // Regla: Si es CONDUCTOR, los docs de cumplimiento (RUT/EPS) son opcionales y deshabilitados para este flujo
        $('#flexSwitchCheckSeguridadSocial').prop('disabled', true);
        camposDocumentacion.forEach(id => {
            $(id).prop('disabled', true).removeAttr('required');
        });

    } else if (esPoseedor) {
        // Regla: Si es POSEEDOR, los docs de cumplimiento (RUT/EPS) DEBEN ser requeridos si no hay Beneficiario.
        $('#flexSwitchCheckSeguridadSocial').prop('disabled', false);
        camposDocumentacion.forEach(id => {
            $(id).prop('disabled', false); // Habilitar
        });
        document.getElementById(`flexSwitchCheckCertificadoCuenta`).style.display = 'none';
        document.getElementById(`flexSwitchSectionDocumentos`).style.display = '';
    } else {
        // Ningún check de actividad activo (Estado inicial/limpio)
        $('#flexSwitchCheckSeguridadSocial').prop('disabled', false);
        camposDocumentacion.forEach(id => {
            $(id).prop('disabled', true).removeAttr('required'); // Deshabilitar si no hay actividad
        });
        document.getElementById(`flexSwitchCheckCertificadoCuenta`).style.display = 'none';
        document.getElementById(`flexSwitchSectionDocumentos`).style.display = 'none';
    }

    // ------------------------------------------------------------------------
    // B. LÓGICA DE TERCERO BENEFICIARIO (EXCLUSIÓN Y OBLIGATORIEDAD)
    // ------------------------------------------------------------------------

    // 🛑 1. CONTROL DE OBLIGATORIEDAD DEL PROVEEDOR PRINCIPAL
    camposObligatoriosProv.forEach(id => {
        if (esBeneficiario) {
            // Regla: Si hay beneficiario, los datos de cuenta del PROVEEDOR NO son obligatorios
            $(id).removeAttr('required');
        } else {
            // Regla: Si NO hay beneficiario, los datos de cuenta son OBLIGATORIOS
            $(id).attr('required', 'required');
        }
    });

    // 🛑 2. AJUSTE DE OBLIGATORIEDAD DE DOCUMENTOS DE CUMPLIMIENTO (RUT/EPS DEL PROVEEDOR)
    camposDocumentacion.forEach(id => {
        if (!esBeneficiario && esPoseedor) {
            // Si el pago es al Poseedor y no hay Beneficiario, los documentos de cumplimiento son obligatorios.
            $(id).attr('required', 'required');
        } else {
            // En cualquier otro caso (Conductor O Beneficiario), no son obligatorios en el Proveedor Principal.
            $(id).removeAttr('required');
        }
    });


    // 🛑 3. CONTROL DE OBLIGATORIEDAD DEL TERCERO BENEFICIARIO (SE MANTIENE)
    // Se asume que esta parte se encarga de habilitar/requerir sus propios campos si esBeneficiario=true
    camposBeneficiario.forEach(id => {
        if (esBeneficiario) {
            $(id).attr('required', 'required').prop('disabled', false);
        } else {
            $(id).removeAttr('required').prop('disabled', true);
        }
    });
}