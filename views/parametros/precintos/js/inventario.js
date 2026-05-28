window.VENTANA = null; // Variable global para almacenar el ID
// window.precintosList = null;
// sessionStorage.clear();
// Definir la función initScript globalmente
window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global
    Listar_gencias_origen();
    Listar_gencias();
    Listar_Asignacion();
    document.addEventListener('click', async e => {
        if (e.target.matches(`#btn_guardar_asignacion_precintos`) || e.target.matches(`#btn_guardar_asignacion_precintos *`)) {
            e.preventDefault();
            const agencia_origen = document.getElementById('agencia_origen').value;
            const agencia_destino = document.getElementById('agencia_destino').value;
            const tipo = document.getElementById('tipo_precinto').value;
            const desde = parseInt(document.getElementById('desde').value);
            const hasta = parseInt(document.getElementById('hasta').value);
            const observacion = document.getElementById('observacion').value;

            if (!agencia_origen || !agencia_destino || !tipo || isNaN(desde) || isNaN(hasta) || desde > hasta) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Completa todos los campos correctamente',
                });
                return;
            }

            const result = await Swal.fire({
                title: '¿Seguro?',
                text: '¿Desea Ingresar el Trasalado de Precintos?',
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
                    const response = await fetch($('#base_url').val() + 'parametros/Insertar_asignacion_precintos', {
                        method: 'POST',
                        body: new URLSearchParams({ agencia_origen, agencia_destino, tipo, desde, hasta, observacion })
                    });

                    const data = await response.json();

                    if (data.success === true) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Éxito!',
                            text: 'Precintos asignados correctamente',
                        }).then(() => {
                            // Aquí puedes actualizar la vista o redirigir, si deseas
                            reset();
                            Listar_Asignacion();
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al asignar',
                            text: data.mensaje || 'Ocurrió un error inesperado.',
                        });
                    }
                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de red',
                        text: 'Ocurrió un error al intentar asignar los precintos.',
                    });
                }
            }

        }
    });
}

function verificarPrecintos() {
    const oficina = document.getElementById('agencia_destino').value;
    const tipo = document.getElementById('tipo_precinto').value;
    const desde = parseInt(document.getElementById('desde').value);
    const hasta = parseInt(document.getElementById('hasta').value);

    if (!oficina || !tipo || isNaN(desde) || isNaN(hasta)) {
        alert("Completa todos los campos correctamente");
        return;
    }

    fetch($('#base_url').val() + 'parametros/verificar_precintos', {
        method: 'POST',
        body: new URLSearchParams({ oficina, tipo, desde, hasta })
    })
        .then(response => response.json())
        .then(data => {
            const resultado = document.getElementById('resultado_validacion');
            if (data.valido) {
                resultado.innerHTML = `✅ Se encontraron ${data.cantidad} precintos válidos para asignar.`;
                // document.getElementById('btn_asignar_precintos').disabled = false;
                document.getElementById('btn_guardar_asignacion_precintos').style.display = "";
            } else {
                resultado.innerHTML = `❌ Error: ${data.mensaje}`;
                document.getElementById('btn_guardar_asignacion_precintos').style.display = "none";
            }
        })
        .catch(err => console.error('Error:', err));
}

async function Listar_Asignacion() {
    const loader = document.querySelector('.img_load');
    if (loader) loader.style.display = 'table-row';

    const tbody = document.getElementById('tbody_precintos_asignados');
    tbody.innerHTML = '';

    try {
        const response = await fetch($('#base_url').val() + 'parametros/listar_inventario_precintos', {
            method: 'POST',
            cache: 'no-cache',
        });

        const data = await response.json();

        if (data && data.length > 0) {
            // Recolectar tipos únicos para el filtro
            // const tiposUnicos = [...new Set(data.map(item => item.tipo_precinto))];

            // Construir las filas
            data.forEach((element, index) => {
                const fila = document.createElement('tr');
                fila.classList.add('text-center');

                // const estado = obtenerEstadoTrazabilidad(element.estado_precinto);
                // const col_estatus_trazabilidad = createBadge(estado.texto, estado.color);

                fila.innerHTML = `
                    <td style="white-space: nowrap;">${index + 1}</td>
                    <td class="align-middle tipo" style="white-space: nowrap;">${element.codigo_precinto}</td>
                    <td class="align-middle tipo" style="white-space: nowrap;">${element.cantidad}</td>
                    <td class="align-middle tipo" style="white-space: nowrap;">${element.origen}</td>
                    <td class="align-middle tipo" style="white-space: nowrap;">${element.destino}</td>
                    <td class="align-middle tipo" style="white-space: nowrap;">${element.tipo_precinto}</td>
                    <td class="align-middle tipo" style="white-space: nowrap;">${element.tipo_movimiento}</td>
                    <td class="align-middle tipo" style="white-space: nowrap;">${element.fecha_movimiento}</td>
                `;

                tbody.appendChild(fila);
            });

            // ⚠️ Destruir instancia previa de List.js si existe
            // if (precintosList !== null) {
            //     precintosList.destroy();
            //     precintosList = null;
            // }

            // ✅ Crear nueva instancia de List.js después de renderizar filas
            // precintosList = new List('tableExample3', {
            //     valueNames: ['codigo', 'tipo', 'fecha_ingreso', 'estado', 'agencia_asignada'],
            //     page: 15,
            //     pagination: true
            // });

            // Filtro por tipo
            // const selectFiltroTipo = document.getElementById('filtro_tipo_precinto');
            // selectFiltroTipo.addEventListener('change', function () {
            //     const filtro = this.value;
            //     if (filtro === "") {
            //         precintosList.filter(); // mostrar todo
            //     } else {
            //         precintosList.filter(item => item.values().tipo === filtro);
            //     }
            // });
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

function reset() {
    document.getElementById('agencia_origen').value = '';
    document.getElementById('agencia_destino').value = '';
    document.getElementById('tipo_precinto').value = '';
    document.getElementById('desde').value = '';
    document.getElementById('hasta').value = '';
    document.getElementById('observacion').value = '';
    document.getElementById('resultado_validacion').innerHTML = '';
    // document.getElementById('btn_asignar_precintos').disabled = true;
    document.getElementById('btn_guardar_asignacion_precintos').style.display = "none";

}

async function Listar_gencias() {
    try {
        const response = await fetch($('#base_url').val() + 'parametros/listar_agencias_destino', {
            method: 'POST',
            cache: 'no-cache',
        });
        const data = await response.json();
        var html = '<option value="">--- Selecciona ---</option>';
        data.forEach(function (item) {
            html += `<option value="${item.nombre_bodega}">${item.nombre_bodega}</option>`;
        });
        $('#agencia_destino').html(html);
    } catch (error) {
        console.error('Error en la primera solicitud:', error);
        throw error;
    } finally {
        // $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    }
}

async function Listar_gencias_origen() {
    try {
        const response = await fetch($('#base_url').val() + 'parametros/listar_agencias_origen', {
            method: 'POST',
            cache: 'no-cache',
        });
        const data = await response.json();
        var html = '<option value="">--- Selecciona ---</option>';
        data.forEach(function (item) {
            html += `<option value="${item.nombre_bodega}">${item.nombre_bodega}</option>`;
        });
        $('#agencia_origen').html(html);
    } catch (error) {
        console.error('Error en la primera solicitud:', error);
        throw error;
    } finally {
        // $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    }
}