window.VENTANA = "";
// Variable global para el título del detalle

window.initScript = function (id) {
    window.VENTANA = id;

    // 🛑 Llamada inicial al cargar la página
    listarYPopularConductores();
    listarYPopularTarjetas();

    // JS
    // Listener cuando se selecciona un conductor
    $('#slct_conductor').on('change', function () {
        const conductorId = $(this).val();
        if (conductorId) {
            // Cargar historial y tarjetas disponibles para ese conductor
            cargarHistorial(conductorId);
            // Función para cargar tarjetas estado=1 (Disponibles)
        } else {
            $('#tbl_historial_tarjetas tbody').empty();
        }
    });

    // JS

    $('#btn_asignar_tarjeta').on('click', function () {
        const conductorId = $('#slct_conductor').val();
        const tarjetaId = $('#slct_tarjeta_disponible').val();

        if (!conductorId || !tarjetaId) {
            Swal.fire('Atención', 'Debe seleccionar un conductor y una tarjeta disponible.', 'warning');
            return;
        }

        // 🛑 1. Confirmación SweetAlert
        Swal.fire({
            title: 'Confirmar Asignación',
            text: '¿Desea asignar la tarjeta seleccionada al conductor?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, Asignar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {

                // Mostrar estado de carga mientras se procesa
                Swal.fire({
                    title: 'Procesando...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // 🛑 2. Preparar datos y enviar al Controlador
                const formData = new FormData();
                formData.append('conductor_id', conductorId);
                formData.append('tarjeta_id', tarjetaId);

                try {
                    const response = await fetch($('#base_url').val() + 'novedades/asignarTarjeta', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();

                    Swal.close(); // Cerrar la ventana de carga

                    if (data.status === true) {
                        Swal.fire('Éxito', data.mensaje, 'success');

                        // 🛑 Acciones post-éxito:
                        // 1. Recargar el historial del conductor
                        cargarHistorial(conductorId);
                        // 2. Recargar la lista de tarjetas disponibles (la tarjeta asignada ya no debe aparecer)
                        listarYPopularTarjetas();
                        // 3. Opcional: Deseleccionar el conductor (si no se quiere trabajar con él)
                        $('#slct_conductor').val(null).trigger('change');

                    } else {
                        Swal.fire('Error', data.mensaje, 'error');
                    }
                } catch (error) {
                    Swal.close();
                    Swal.fire('Error de Conexión', 'Fallo al comunicarse con el servidor.', 'error');
                    console.error('Fetch error:', error);
                }
            }
        });
    });

    // JS (Debe estar en tu archivo de asignación o principal JS)

    document.addEventListener('click', function (e) {
        if (e.target.matches('.btn-retirar-tarjeta')) {
            const botonRetirar = e.target;
            const asignacionId = botonRetirar.getAttribute('data-asignacion-id');

            // Obtener el ID del conductor actualmente visible (para recargar el historial)
            const conductorId = $('#slct_conductor').val();

            if (!asignacionId || !conductorId) {
                Swal.fire('Error', 'Faltan datos de la asignación o conductor.', 'error');
                return;
            }

            Swal.fire({
                title: 'Confirmar Retiro',
                text: '¿Está seguro de que desea retirar esta tarjeta del conductor y finalizar su vigencia?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Retirar',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    Swal.fire({ title: 'Procesando...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

                    const formData = new FormData();
                    formData.append('asignacion_id', asignacionId);

                    try {
                        const response = await fetch($('#base_url').val() + 'novedades/retirarTarjeta', {
                            method: 'POST',
                            body: formData
                        });
                        const data = await response.json();

                        Swal.close();

                        if (data.status === true) {
                            Swal.fire('Retirada!', data.mensaje, 'success');

                            // 🛑 Recargar: Actualizar el historial y el listado de tarjetas disponibles
                            cargarHistorial(conductorId);
                            listarYPopularTarjetas();

                        } else {
                            Swal.fire('Error', data.mensaje || 'Fallo al retirar la tarjeta.', 'error');
                        }
                    } catch (error) {
                        Swal.close();
                        Swal.fire('Error de Conexión', 'Fallo al comunicarse con el servidor.', 'error');
                        console.error('Fetch error:', error);
                    }
                }
            });
        }
    });

    async function cargarHistorial(conductorId) {
        const tbody = $('#tbl_historial_tarjetas tbody');
        tbody.html('<tr><td colspan="4">Cargando historial...</td></tr>');

        try {
            const response = await fetch($('#base_url').val() + 'novedades/obtenerHistorial/' + conductorId);
            const result = await response.json();

            let html = '';
            if (result.length > 0) {
                result.forEach(item => {
                    const estado = item.estado_asignacion == 'Vigente' ? '<span class="badge badge-phoenix badge-phoenix-success">Vigente</span>' : '<span class="badge badge-phoenix badge-phoenix-secondary">Retirada</span>';
                    const fechaRetiro = item.fecha_retiro || 'N/A';

                    html += `
                    <tr>
                        <td style="width: auto; white-space: nowrap;">${item.numero_tarjeta} (${item.banco})</td>
                        <td style="width: auto; white-space: nowrap;">${item.fecha_asignacion}</td>
                        <td style="width: auto; white-space: nowrap;">${item.fecha_retiro ?? '-'}</td>
                        <td style="width: auto; white-space: nowrap;">${estado}</td>
                        <td style="width: auto; white-space: nowrap;">${item.estado_asignacion === 'Vigente' ? `<button class="btn btn-sm btn-danger py-1 btn-retirar-tarjeta" data-asignacion-id="${item.id}">Retirar</button>` : ''}</td>
                    </tr>
                `;
                });
            } else {
                html = '<tr><td colspan="4" tyle="width: auto; white-space: nowrap;">Este conductor no tiene historial de tarjetas.</td></tr>';
            }
            tbody.html(html);

        } catch (error) {
            tbody.html('<tr><td colspan="4" class="text-danger">Error al cargar el historial.</td></tr>');
        }
    }
}


// JS

/**
 * Llama al controlador para obtener y listar los conductores activos en el select.
 */
async function listarYPopularConductores() {
    const selectId = '#slct_conductor';
    $(selectId).empty().append('<option value="">Cargando...</option>');

    try {
        const response = await fetch($('#base_url').val() + 'novedades/listarConductores');
        const data = await response.json();

        let html = '<option value="">Seleccione Conductor</option>';

        if (data && data.length > 0) {
            data.forEach(item => {
                // ID del conductor (numdoc_nexos) como valor
                html += `<option value="${item.id_conductor}">${item.nombre_completo}</option>`;
            });
            $(selectId).html(html);
            // 🚨 3. Inicializar Select2 después de que el DOM esté poblado
            inicializarSelect2(selectId, 'Seleccione un Conductor');
        } else {
            $(selectId).html('<option value="">No hay conductores activos</option>');
        }

        // Opcional: Inicializar Select2 si lo usas
        // $(selectId).select2({ placeholder: "Seleccione Conductor", allowClear: true });

    } catch (error) {
        console.error('Error al listar conductores:', error);
        $(selectId).html('<option value="">Error de carga</option>');
    }
}

/**
 * Llama al controlador para obtener y listar las tarjetas bancarias disponibles.
 */
async function listarYPopularTarjetas() {
    const selectId = '#slct_tarjeta_disponible';
    $(selectId).empty().append('<option value="">Cargando...</option>');

    try {
        const response = await fetch($('#base_url').val() + 'novedades/listarTarjetas');
        const data = await response.json();

        let html = '<option value="">Seleccione Tarjeta</option>';

        if (data && data.length > 0) {
            data.forEach(item => {
                // Mostrar el nombre del banco y los últimos 4 dígitos de la tarjeta
                const ultimosDigitos = item.numero_tarjeta.slice(-4);
                const nombreMostrar = `${item.nombre_banco} - **** ${ultimosDigitos}`;

                // ID de la tarjeta como valor
                html += `<option value="${item.id_tarjeta}">${nombreMostrar}</option>`;
            });
            $(selectId).html(html);
        } else {
            $(selectId).html('<option value="">No hay tarjetas disponibles</option>');
        }

        // Opcional: Inicializar Select2 si lo usas
        // $(selectId).select2({ placeholder: "Seleccione Tarjeta", allowClear: true });

    } catch (error) {
        console.error('Error al listar tarjetas disponibles:', error);
        $(selectId).html('<option value="">Error de carga</option>');
    }
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