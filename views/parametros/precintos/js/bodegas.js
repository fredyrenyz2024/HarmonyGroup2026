window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global
    Listar_bodegas();
    listar_responsables();
    listar_clientes();

    document.addEventListener('click', async e => {
        if (e.target.matches(`#btn_agregar_bodega`) || e.target.matches(`#btn_agregar_bodega *`)) {
            let Boton = e.target.closest(`#btn_agregar_bodega`);
            // let BodegaId = Boton.getAttribute('data-BodegaId');
            let responsable_bodega = document.getElementById('responsable_bodega').value;
            let cliente_bodega = document.getElementById('cliente_bodega').value;
            let nombre_bodega = document.getElementById('nombre_bodega').value;
            let estado = document.getElementById('estado').value;

            const result = await Swal.fire({
                title: '¿Seguro?',
                text: '¿Desea crear esta bodega? ' + nombre_bodega,
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

                    let formdata = new FormData();
                    formdata.append('responsable_bodega', responsable_bodega);
                    formdata.append('cliente_bodega', cliente_bodega);
                    formdata.append('nombre_bodega', nombre_bodega);
                    formdata.append('estado', estado);

                    const response = await fetch($('#base_url').val() + 'parametros/Insertar_bodega', {
                        method: 'POST',
                        body: formdata,
                        cache: 'no-cache',
                    });
                    const data = await response.json();

                    if (data.status === true) {
                        Swal.fire({
                            icon: "success",
                            title: "Proceso terminado",
                            text: data.message,
                            confirmButtonText: "Aceptar"
                        }).then(() => {
                            // 🔒 Cerrar offcanvas con API de Bootstrap 5
                            let offcanvasEl = document.getElementById('offcanvaBodegas');
                            let offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
                            offcanvas.hide();
                            document.getElementById('responsable_bodega').value = '';
                            document.getElementById('nombre_bodega').value = '';
                            Listar_bodegas(); // ✅ Recargar solo la tabla
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.message || 'Ocurrió un error inesperado',
                            timer: 3000,
                            showConfirmButton: false
                        });
                    }
                } catch (error) {
                    console.log("🚀 ~ error:", error)
                }
            }
        }
    })
}

// JS
async function Listar_bodegas() {
    // 1. Obtener la referencia al cuerpo de la tabla
    const tbody = document.getElementById('tarifa_bodegas_body');
    if (!tbody) {
        console.error('Error: No se encontró el elemento con id "tarifa_bodegas_body"');
        return;
    }

    // Limpiar filas previas
    tbody.innerHTML = '';

    // Definir la URL y los datos (si no necesitas enviar datos, 'formdata' puede ser null o {})
    const baseURL = $('#base_url').val();
    const url = baseURL + 'parametros/listar_bodega';
    const formdata = new FormData(); // Puedes añadir datos aquí si los necesitas, ej: formdata.append('key', 'value');

    try {
        // 2. Ejecutar la llamada fetch (POST)
        const response = await fetch(url, {
            method: 'POST',
            body: formdata, // Envía los datos del formulario
            cache: 'no-cache',
            // headers: { 'Content-Type': 'application/json' } // No es necesario con FormData
        });

        // Manejo de errores HTTP (ej: 404, 500)
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        // 3. Obtener los datos JSON
        const data = await response.json();

        // 4. Procesar y dibujar los datos en la tabla
        // Asumo que el JSON devuelve un array de objetos directamente, o en data.data
        const bodegas = data.data || data;

        if (Array.isArray(bodegas) && bodegas.length > 0) {
            let contador = 1;

            bodegas.forEach(bodega => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${contador++}</td>
                    <td>${bodega.cliente}</td>
                    <td>${bodega.nombre_bodega || 'N/A'}</td>
                    <td>${bodega.responsable || 'SIN ASIGNAR'}</td> 
                    <td><span class="badge bg-success">ACTIVO</span></td> 
                `;

                tbody.appendChild(row);
            });
        } else {
            // Si no hay datos
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4">No se encontraron bodegas.</td>`;
            tbody.appendChild(row);
        }

    } catch (error) {
        console.error('Error al listar bodegas:', error);
        tbody.innerHTML = `<tr><td colspan="4" class="text-danger">¡Error al cargar los datos! ${error.message}</td></tr>`;
    }
}

async function listar_responsables() {
    try {
        const response = await fetch($('#base_url').val() + 'parametros/listar_responsables_vehiculo', {
            method: 'POST',
            cache: 'no-cache',
        });
        const data = await response.json();
        var html = '<option value="">Seleccionar responsable</option>';
        data.forEach(function (item) {
            html += `<option value="${item.nom_usuario}">${item.nom_usuario}</option>`;
        });
        $('#responsable_bodega').html(html);

        // 🛑 CORRECCIÓN: Usar un string literal para el placeholder
        $('#responsable_bodega').select2({ placeholder: 'Seleccionar responsable', allowClear: true });
    } catch (error) {
        console.error('Error en la primera solicitud:', error);
        throw error;
    } finally {
        // $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    }
}

async function listar_clientes() {
    try {
        const response = await fetch($('#base_url').val() + 'parametros/Listar_clientes', {
            method: 'POST',
            cache: 'no-cache',
        });
        const data = await response.json();
        var html = '<option value="">Seleccionar cliente</option>';
        data.forEach(function (item) {
            html += `<option value="${item.id}">${item.nombre}</option>`;
        });
        $('#cliente_bodega').html(html);


        // Opcional: Si usas Select2
        $('#cliente_bodega').select2({ placeholder: 'Seleccionar cliente', allowClear: true });

    } catch (error) {
        console.error('Error en la primera solicitud:', error);
        throw error;
    } finally {
        // $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    }
}