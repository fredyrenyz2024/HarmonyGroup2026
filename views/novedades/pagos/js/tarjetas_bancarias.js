window.VENTANA = "";
// Variable global para el título del detalle

window.initScript = function (id) {
    window.VENTANA = id;

    // 🛑 Llamada inicial al cargar la página
    ListarTarjetasRegistradas();
    cargarDatosFinancieros();

    $('#btn_guardar_tarjeta').on('click', function () {
        const numTarjeta = $('#txt_numero_tarjeta').val();
        const idBanco = $('#slct_banco').val();
        const tipoCuenta = $('#slct_tipo_cuenta').val();

        if (!numTarjeta || !idBanco || !tipoCuenta) {
            Swal.fire('Atención', 'Debe completar todos los campos.', 'warning');
            return;
        }

        Swal.fire({
            title: 'Confirmar',
            text: '¿Desea registrar esta nueva tarjeta bancaria?',
            icon: 'question',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('numero_tarjeta', numTarjeta);
                formData.append('id_banco', idBanco);
                formData.append('tipo_cuenta', tipoCuenta);

                try {
                    const response = await fetch($('#base_url').val() + 'novedades/crearTarjeta', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();

                    if (data.status === true) {
                        Swal.fire('Éxito', data.mensaje, 'success');
                        // Opcional: limpiar el formulario
                        ListarTarjetasRegistradas();
                    } else {
                        Swal.fire('Error', data.mensaje, 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Fallo de conexión al guardar la tarjeta.', 'error');
                }
            }
        });
    });

    // 🛑 Listener para la Gestión de Estado
    document.addEventListener('click', function (e) {
        if (e.target.matches('.btn-gestion-estado')) {
            e.preventDefault();
            const tarjetaId = e.target.dataset.id;
            const nuevoEstado = e.target.dataset.estado;

            Swal.fire({
                title: `Cambiar estado a ${nuevoEstado}`,
                text: `¿Está seguro de cambiar el estado de la tarjeta #${tarjetaId} a ${nuevoEstado}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Sí, ${nuevoEstado}`,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const formData = new FormData();
                    formData.append('tarjeta_id', tarjetaId);
                    formData.append('estado', nuevoEstado);

                    try {
                        const response = await fetch($('#base_url').val() + 'novedades/gestionarEstadoTarjeta', {
                            method: 'POST', body: formData
                        });
                        const data = await response.json();

                        if (data.status === true) {
                            Swal.fire('Éxito', data.mensaje, 'success');
                            ListarTarjetasRegistradas(); // Recargar la tabla
                        } else {
                            Swal.fire('Error', data.mensaje, 'error');
                        }
                    } catch (error) {
                        Swal.fire('Error', 'Fallo de conexión al gestionar el estado.', 'error');
                    }
                }
            });
        }
    });
}

// Función principal de carga de datos financieros
function cargarDatosFinancieros() {

    // 🚨 1. Limpieza inicial de selects (antes del AJAX)
    $('#banco').empty().append('<option value="">Seleccione</option>');

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
                    $('#slct_banco').append('<option value="' + element.id + '">' + element.abreviatura + '</option>');
                });
            }
            // 🚨 3. Inicializar Select2 después de que el DOM esté poblado
            inicializarSelect2('#slct_banco', 'Seleccione un Banco');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error al cargar datos financieros:', errorThrown);
            // Puedes mostrar un mensaje de error en la interfaz si lo deseas
        },
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

// 🛑 Funciones de Ayuda (Color del estado)
function obtenerBadgeEstado(estado) {
    let color = 'secondary';
    switch (estado) {
        case 'Disponible':
            color = 'success';
            break;
        case 'Asignada':
            color = 'info';
            break;
        case 'Congelada':
            color = 'warning';
            break;
        case 'Reportado':
        case 'Inactivo':
            color = 'danger';
            break;
        default:
            color = 'info';
    }
    return `<span class="badge badge-phoenix badge-phoenix-${color}"><span class="badge-label">${estado}</span></span>`;
}

// 🛑 Función para Listar la Tabla
async function ListarTarjetasRegistradas() {
    const tbodyId = '#tbody-tarjetas-registradas';
    const totalFooterId = '#total-tarjetas-general';
    $(tbodyId).html('<tr><td colspan="7" class="text-muted">⏳ Cargando tarjetas...</td></tr>');
    $(totalFooterId).text('0');

    try {
        const response = await fetch($('#base_url').val() + 'novedades/listarTodasTarjetas');
        const result = await response.json();

        let template = '';
        let totalTarjetas = 0;

        if (result.status && result.data && result.data.length > 0) {
            totalTarjetas = result.data.length;

            result.data.forEach(item => {
                const ultimosDigitos = item.numero_tarjeta.slice(-4);
                const estadoActual = item.estado; // Estado ENUM de la base de datos

                // 🛑 VALIDACIÓN CLAVE: No permitir gestión si la tarjeta está 'Asignada' o 'Disponible'
                // const gestionPermitida = estadoActual !== 'Asignada' && estadoActual !== 'Disponible';
                const gestionPermitida = estadoActual !== 'Asignada';

                // Determina si se debe mostrar la opción 'Activar' (solo si NO está en estados activos/disponibles)
                const puedeActivar = estadoActual === 'Inactivo' || estadoActual === 'Congelada' || estadoActual === 'Reportado';

                // 🛑 HTML DEL DROPDOWN
                const accionesDropdown = `
                    <div class="dropdown">
                        <a class="btn btn-phoenix-secondary dropdown-toggle btn-sm py-0 ${gestionPermitida ? '' : 'disabled'}" 
                           id="dropdown-${item.id}" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            ${gestionPermitida ? 'Gestionar' : 'En Uso'}
                        </a>
                        <ul class="dropdown-menu">
                            ${gestionPermitida ?
                        `<li><a class="dropdown-item btn-gestion-estado" data-id="${item.id}" data-estado="Inactivo" href="#">Inactivar</a></li>
                                 <li><a class="dropdown-item btn-gestion-estado" data-id="${item.id}" data-estado="Congelada" href="#">Congelar</a></li>
                                 <li><a class="dropdown-item btn-gestion-estado" data-id="${item.id}" data-estado="Reportado" href="#">Reportar</a></li>
                                 ${puedeActivar ? `
                                     <li><div class="dropdown-divider"></div></li>
                                     <li><a class="dropdown-item fw-bold btn-gestion-estado text-success" data-id="${item.id}" data-estado="Disponible" href="#">Activar</a></li>
                                 ` : ''}` : `<li><span class="dropdown-item text-muted">Acción no permitida</span></li>`
                    }
                        </ul>
                    </div>
                `;

                template += `
                    <tr>
                        <td style="white-space: nowrap;">**** ${ultimosDigitos}</td>
                        <td style="white-space: nowrap;">${item.nombre_banco}</td>
                        <td style="white-space: nowrap;">${item.tipo_cuenta_nombre}</td>
                        <td style="white-space: nowrap;">${obtenerBadgeEstado(item.estado)}</td>
                        <td style="white-space: nowrap;">${item.fecha}</td>
                        <td style="white-space: nowrap;">${item.usuario}</td>
                        <td style="white-space: nowrap;">
                            ${accionesDropdown}
                        </td>
                    </tr>`;
            });

            $(tbodyId).html(template);

        } else {
            $(tbodyId).html('<tr><td colspan="7" class="text-info">No se encontraron tarjetas registradas.</td></tr>');
        }

        $(totalFooterId).text(totalTarjetas);

    } catch (error) {
        console.error('Error al listar tarjetas:', error);
        $(tbodyId).html('<tr><td colspan="7" class="text-danger">Error al cargar la lista de tarjetas.</td></tr>');
    }
}
