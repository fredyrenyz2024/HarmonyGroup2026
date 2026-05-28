window.VENTANA = null; // Variable global para almacenar el ID
window.precintosList = null;
// Definir la función initScript globalmente
window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global
    Listar_Precintos();
    document.addEventListener('click', async e => {
        if (e.target.matches(`#btn_guardar_lote`) || e.target.matches(`#btn_guardar_lote *`)) {
            e.preventDefault();

            const result = await Swal.fire({
                title: '¿Seguro?',
                text: '¿Desea Guardar los precintos?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3B71CA',
                cancelButtonColor: '#9FA6B2',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                customClass: {
                    popup: 'swal2-custom-font',
                },
            });
            if (result.isConfirmed) {
                try {
                    $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
                    const formData = new FormData();
                    formData.append('codigo_inicial', document.getElementById('codigo_inicial').value);
                    formData.append('codigo_final', document.getElementById('codigo_final').value);
                    formData.append('tipo_precinto', document.getElementById('tipo_precinto').value);

                    const response = await fetch($('#base_url').val() + 'parametros/Guardar_Lote_Precintos', {
                        method: 'POST',
                        body: formData,
                        cache: 'no-cache',
                    });

                    if (response.ok) {
                        const data = await response.json();

                        if (data.status === 'ok') {
                            Swal.fire({
                                icon: 'success',
                                title: '¡Éxito!',
                                text: data.mensaje,
                                timer: 2000,
                                showConfirmButton: false
                            }).then(() => {
                                // window.location.reload();
                                Listar_Precintos();
                                document.getElementById('codigo_inicial').value = '';
                                document.getElementById('codigo_final').value = '';
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al guardar',
                                text: data.mensaje,
                            });
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error en la solicitud',
                            text: response.statusText
                        });
                    }
                } catch (error) {
                    console.error('Error al enviar el formulario:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error inesperado',
                        text: 'Ocurrió un error al guardar el lote. Por favor, inténtelo de nuevo.'
                    });
                } finally {
                    $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
                }
            }
        }
    })
}

async function Listar_Precintos() {
    const loader = document.querySelector('.img_load');
    if (loader) loader.style.display = 'table-row';

    const tbody = document.getElementById('tbody_precintos_listado');
    tbody.innerHTML = '';

    try {
        const response = await fetch($('#base_url').val() + 'parametros/listar_lotes', {
            method: 'POST',
            cache: 'no-cache',
        });

        const data = await response.json();

        if (data && data.length > 0) {
            // Recolectar tipos únicos para el filtro
            const tiposUnicos = [...new Set(data.map(item => item.tipo_precinto))];

            // Llenar el select de filtro
            const selectFiltroTipo = document.getElementById('filtro_tipo_precinto');
            selectFiltroTipo.innerHTML = `<option value="">-- Filtrar por Tipo --</option>`;
            tiposUnicos.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo;
                option.textContent = tipo;
                selectFiltroTipo.appendChild(option);
            });

            // Construir las filas
            data.forEach((element, index) => {
                const fila = document.createElement('tr');
                fila.classList.add('text-center');

                const estado = obtenerEstadoTrazabilidad(element.estado_precinto);
                const col_estatus_trazabilidad = createBadge(estado.texto, estado.color);

                fila.innerHTML = `
                    <td style="white-space: nowrap;">${index + 1}</td>
                    <td class="align-middle codigo" style="white-space: nowrap;">
                        <a class='text-decoration-none' href='#' id='btn-instrucciones-cliente' 
                           data-ClienteId='${element.id}' data-Cliente='${element.id}'>${element.codigo_precinto}</a>
                    </td>
                    <td class="align-middle tipo" style="white-space: nowrap;">${element.tipo_precinto}</td>
                    <td class="align-middle agencia_asignada" style="white-space: nowrap;">${element.agencia_asignada ? element.agencia_asignada : 'Sin Asignar'}</td>
                    <td class="align-middle fecha_ingreso" style="white-space: nowrap;">${element.fecha_ingreso}</td>
                    <td class="align-middle estado" style="white-space: nowrap;">${col_estatus_trazabilidad}</td>
                `;

                tbody.appendChild(fila);
            });

            // ⚠️ Destruir instancia previa de List.js si existe
            if (precintosList !== null) {
                precintosList.destroy();
                precintosList = null;
            }

            // ✅ Crear nueva instancia de List.js después de renderizar filas
            precintosList = new List('tableExample3', {
                valueNames: ['codigo', 'tipo', 'fecha_ingreso', 'estado', 'agencia_asignada'],
                page: 15,
                pagination: true
            });

            // Filtro por tipo
            // const selectFiltroTipo = document.getElementById('filtro_tipo_precinto');
            selectFiltroTipo.addEventListener('change', function () {
                const filtro = this.value;
                if (filtro === "") {
                    precintosList.filter(); // mostrar todo
                } else {
                    precintosList.filter(item => item.values().tipo === filtro);
                }
            });
        } else {
            // No hay datos
            const fila = document.createElement('tr');
            fila.innerHTML = `<td colspan="5" class="text-center text-danger">No se encontraron datos</td>`;
            tbody.appendChild(fila);
        }

    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    } finally {
        if (loader) loader.style.display = 'none';
    }
}

// Función para crear badge
function createBadge(text, type) {
    return `
    <span class="badge badge-phoenix fs-10 badge-phoenix-${type}">
      <span class="badge-label">${text}</span>
      <span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span>
    </span>`;
}

// Función para obtener el estado corregido
function obtenerEstadoTrazabilidad(tipoTrazabilidad) {
    let textoTrazabilidad = tipoTrazabilidad;

    // Devolvemos el texto corregido y el color
    return {
        texto: textoTrazabilidad,
        color: window.estadosTrazabilidad[textoTrazabilidad] || 'secondary'
    };
}

window.estadosTrazabilidad = {
    'usado': 'info',
    'en_transito': 'danger',
    'disponible': 'success',
    'asignado': 'warning',
};