window.VENTANA = null;
window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID de la ventana a la variable global
    listarVehiculosEnturnados();
    document.getElementById(`campo-${window.VENTANA}-origen`).style.display = 'none';
    document.getElementById(`campo-${window.VENTANA}-destino`).style.display = 'none';
    document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).style.display = 'none';
    document.getElementById(`campo-${window.VENTANA}-fecha_final`).style.display = 'none';
}

document.addEventListener('click', async function (e) {

    if (e.target.matches(`#campo-${window.VENTANA}-filtrar`) || e.target.matches(`#campo-${window.VENTANA}-filtrar *`)) {
        e.preventDefault();

        const filtros = {};

        // Referencias a campos
        const origenEl = document.getElementById(`campo-${window.VENTANA}-origen`);
        const destinoEl = document.getElementById(`campo-${window.VENTANA}-destino`);
        const fechaIniEl = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`);
        const fechaFinEl = document.getElementById(`campo-${window.VENTANA}-fecha_final`);

        // -----------------------------
        // 1️⃣ Tomar SOLO campos visibles
        // -----------------------------
        if (origenEl && origenEl.style.display !== 'none' && origenEl.value) {
            filtros.origen = origenEl.value;
        }

        if (destinoEl && destinoEl.style.display !== 'none' && destinoEl.value) {
            filtros.destino = destinoEl.value;
        }

        if (
            fechaIniEl && fechaFinEl &&
            fechaIniEl.style.display !== 'none' &&
            fechaFinEl.style.display !== 'none'
        ) {
            if (fechaIniEl.value && fechaFinEl.value) {
                filtros.fecha_inicio = fechaIniEl.value;
                filtros.fecha_final = fechaFinEl.value;
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Atención',
                    text: 'Debe seleccionar fecha inicial y final'
                });
                return;
            }
        }

        // -----------------------------
        // 2️⃣ Validación mínima
        // -----------------------------
        if (Object.keys(filtros).length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Debe seleccionar al menos un filtro'
            });
            return;
        }

        // -----------------------------
        // 3️⃣ Ejecutar listado filtrado
        // -----------------------------
        listarVehiculosEnturnados(filtros);
    }


    if (e.target.matches(`#campo-${window.VENTANA}-nuevo_enturnamiento`) || e.target.closest(`#campo-${window.VENTANA}-nuevo_enturnamiento`)) {
        e.preventDefault();
        let enlace = e.target.closest(`#campo-${window.VENTANA}-nuevo_enturnamiento`);
        // Mostrar offcanvas
        const offcanvas = new bootstrap.Offcanvas('#offcanvasRightEnturnados');
        offcanvas.show();
        OrigenEnturnar();
        DestinoEnturnar();
    }

    if (e.target.matches('#btnCancelarEnturnado') || e.target.closest('#btnCancelarEnturnado *')) {
        $('#form_enturnados').trigger('reset');
        $('#form_enturnados .is-invalid, #form_enturnados .is-valid').removeClass('is-invalid is-valid');
        $('#mensaje_propietario_existe, #mensaje_poseedor_existe, #mensaje_conductor_existe, #mensaje_trailer_existe').html('');
    }

    if (e.target.matches('#btnGuardarEnturnadoVehiculos') || e.target.matches('#btnGuardarEnturnadoVehiculos *')) {
        e.preventDefault();

        // 1️⃣ Validar campos obligatorios
        const camposObligatorios = [
            'placag', 'configuracion_vehiculo', 'docupro', 'nompro',
            'docutene', 'nomtene', 'docucondu', 'nomcondu',
            'web', 'user_satelite', 'clave', 'ubicaion_actual',
            'origen_enturnar', 'destino_enturnar'
        ];

        let validado = true;

        camposObligatorios.forEach(id => {
            const campo = document.getElementById(id);
            if (!campo || campo.value.trim() === '') {
                campo.classList.add('is-invalid');
                validado = false;
            } else {
                campo.classList.remove('is-invalid');
            }
        });

        // Validar campos del trailer si aplica
        if (document.getElementById('propietario_obligatorio').checked) {
            const trailerCampos = ['placat', 'docproptrailer', 'nomproptrailer'];
            trailerCampos.forEach(id => {
                const campo = document.getElementById(id);
                if (!campo || campo.value.trim() === '') {
                    campo.classList.add('is-invalid');
                    validado = false;
                } else {
                    campo.classList.remove('is-invalid');
                }
            });
        }

        if (!validado) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                html: `<p style="font-size: 14px;">Por favor completa todos los campos obligatorios antes de continuar.</p>`,
                confirmButtonColor: '#f0ad4e'
            });
            return;
        }

        // 2️⃣ Crear objeto de datos
        const data = {
            placa_vehiculo: document.getElementById('placag').value.trim(),
            configuracion_vehiculo: document.getElementById('configuracion_vehiculo').value,
            documento_propietario: document.getElementById('docupro').value.trim(),
            nombre_propietario: document.getElementById('nompro').value.trim(),
            documento_tenedor: document.getElementById('docutene').value.trim(),
            nombre_tenedor: document.getElementById('nomtene').value.trim(),
            documento_conductor: document.getElementById('docucondu').value.trim(),
            nombre_conductor: document.getElementById('nomcondu').value.trim(),
            Trailer: document.getElementById('propietario_obligatorio').checked ? 'Sí' : 'No',
            placa_trailer: document.getElementById('placat').value.trim(),
            documento_propietario_trailer: document.getElementById('docproptrailer').value.trim(),
            nombre_propietario_trailer: document.getElementById('nomproptrailer').value.trim(),
            origen_enturnar: document.getElementById('origen_enturnar').value.trim(),
            destino_enturnar: document.getElementById('destino_enturnar').value.trim(),
            ubicacion_actual: document.getElementById('ubicaion_actual').value.trim(),
        };

        try {
            // 3️⃣ Enviar datos al controlador
            const response = await fetch($('#base_url').val() + 'prefiltro_nacional/InsertarEnturnamiento', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const json = await response.json();

            // 4️⃣ Mostrar resultado con SweetAlert2
            Swal.fire({
                icon: json.status ? 'success' : 'error',
                title: json.status ? 'Gestión registrada' : 'Error en la gestión',
                html: `<p style="font-size: 14px;">${json.message || 'Sin mensaje del servidor.'}</p>`,
                confirmButtonColor: json.status ? '#28a745' : '#d33',
            }).then(() => {
                if (json.status) {
                    $('#form_enturnados').trigger('reset');
                    const offcanvasEl = document.getElementById('offcanvasRightEnturnados');
                    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
                    offcanvas.hide();
                    listarVehiculosEnturnados();
                }
            });

        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                html: `<p style="font-size: 14px;">${error.message}</p>`,
                confirmButtonColor: '#d33'
            });
        }
    }

    if (e.target.matches("#btn_gestion_enturnado") || e.target.matches("#btn_gestion_enturnado *")) {

        let btn = e.target.closest('#btn_gestion_enturnado');

        let gestionId = btn.getAttribute('data-enturnado_id');
        let placa = btn.getAttribute('data-placa');

        // Guardar el ID en el input oculto del modal
        document.getElementById('id_enturnamiento').value = gestionId;

        // Si quieres mostrar la placa dentro del modal:
        if (document.getElementById('placa_modal')) {
            document.getElementById('placa_modal').textContent = placa;
        }
    }

    if (e.target.matches("#btn_guardar_gestion") || e.target.matches("#btn_guardar_gestion *")) {
        e.preventDefault();

        let Estado = document.getElementById("select_estado").value.trim();
        let Motivo = document.getElementById("select_opcion").value.trim();
        let IdGestion = document.getElementById("id_enturnamiento").value;

        let formdata = new FormData();
        formdata.append('Estado', Estado);
        formdata.append('Motivo', Motivo);
        formdata.append('IdGestion', IdGestion);

        fetch($('#base_url').val() + 'prefiltro_nacional/Guardar_Gestion', {
            method: 'POST',
            body: formdata,
        })
            .then(res => res.json())
            .then(data => {
                if (data.status) {
                    Swal.fire("Éxito", data.message, "success");
                } else {
                    Swal.fire("Error", data.message, "error");
                }
            })
            .catch(err => {
                console.error(err);
                Swal.fire("Error", "No se pudo procesar la solicitud", "error");
            });
    }
});

document.addEventListener('change', async function (e) {
    if (e.target.matches('#placag')) {
        let placa = e.target.value.trim().toUpperCase();

        // No consultar si hay menos de 3 caracteres (para evitar sobrecarga)
        if (placa.length < 3) return;

        // Mostramos un loader opcional
        $('#loading-overlay-nexosapp-historico').css('display', 'flex');

        try {
            let datos = new FormData();
            datos.append('placa', placa);

            const response = await fetch($('#base_url').val() + 'prefiltro_nacional/Buscar_Placa', {
                method: 'POST',
                body: datos,
                cache: 'no-cache'
            });

            if (!response.ok) throw new Error('Error en la consulta.');

            const data = await response.json();

            if (data.status) {
                // Ejemplo: llenar campos si existe el vehículo
                document.getElementById('docupro').value = data.vehiculo.Documento_Propietario || '';
                document.getElementById('nompro').value = data.vehiculo.Propietario || '';

                //Tenedor
                document.getElementById('docutene').value = data.vehiculo.Documento_Tenedor || '';
                document.getElementById('nomtene').value = data.vehiculo.Tenedor || '';

                //Conductor
                document.getElementById('docucondu').value = data.vehiculo.Documento_Conductor || '';
                document.getElementById('nomcondu').value = data.vehiculo.Conductor || '';

                //Gps
                document.getElementById('web').value = data.vehiculo.web_satelital || '';
                document.getElementById('user_satelite').value = data.vehiculo.usuario_satelital || '';
                document.getElementById('clave').value = data.vehiculo.clave_satelital || '';

                if (data.vehiculo.Documento_Poseedor_Trailer && data.vehiculo.Documento_Propietario_Trailer && data.vehiculo.Propietario_Trailer) {
                    document.getElementById('propietario_obligatorio').checked = true;
                    document.getElementById('placat').value = data.vehiculo.Trailer || '';
                    document.getElementById('docproptrailer').value = data.vehiculo.Documento_Propietario_Trailer || '';
                    document.getElementById('nomproptrailer').value = data.vehiculo.Propietario_Trailer || '';
                }

            } else {
                // Si no encuentra la placa
                // console.warn(data.message);
                alert(data.message);
            }

        } catch (error) {
            console.error('Error al consultar placa:', error);
        } finally {
            $('#loading-overlay-nexosapp-historico').css('display', 'none');
        }
    }

    if (e.target.matches(`#campo-${window.VENTANA}-filtro`) || e.target.matches(`#campo-${window.VENTANA}-filtro *`)) {
        const SelectFiltro = e.target.value;

        // 🔹 LISTA COMPLETA DE FILTROS POSIBLES
        const filtros = [
            `campo-${window.VENTANA}-origen`,
            `campo-${window.VENTANA}-destino`,
            `campo-${window.VENTANA}-fecha_inicial`,
            `campo-${window.VENTANA}-fecha_final`
            // `campo-${window.VENTANA}-tipo_vehiculo` // si aplica
        ];

        // 1️⃣ OCULTAR TODO SIEMPRE
        filtros.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        // 2️⃣ SI EL VALOR ESTÁ VACÍO, TERMINAR AQUÍ
        if (!SelectFiltro) {
            return;
        }

        // 3️⃣ MOSTRAR SEGÚN FILTRO
        switch (SelectFiltro) {
            case 'Origen':
                document.getElementById(`campo-${window.VENTANA}-origen`).style.display = '';
                origen_ruta();
                break;

            case 'Destino':
                document.getElementById(`campo-${window.VENTANA}-destino`).style.display = '';
                destino_ruta();
                break;

            case 'Fechas':
                document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).style.display = '';
                document.getElementById(`campo-${window.VENTANA}-fecha_final`).style.display = '';
                break;

            case 'Origen Destino':
                document.getElementById(`campo-${window.VENTANA}-origen`).style.display = '';
                document.getElementById(`campo-${window.VENTANA}-destino`).style.display = '';
                origen_ruta();
                destino_ruta();
                break;

            default:
                // nada
                break;
        }
    }

});

async function listarVehiculosEnturnados(filtros = {}) {
    try {
        const response = await fetch(
            $('#base_url').val() + 'prefiltro_nacional/Listar_Vehiculos_Enturnados',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filtros)
            }
        );

        const json = await response.json();
        const tbody = document.getElementById('tbl-vehiculos-enturnado');
        tbody.innerHTML = '';

        if (json.status && json.data.length > 0) {
            json.data.forEach(v => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="dropdown">
                            <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none"
                               data-bs-toggle="dropdown">
                               ${v.placa_vehiculo || '-'}
                            </a>
                            <div class="dropdown-menu dropdown-menu-end py-0">
                                <a class="dropdown-item fw-bold"
                                   href="#"
                                   id="btn_gestion_enturnado"
                                   data-placa="${v.placa_vehiculo}"
                                   data-enturnado_id="${v.id}"
                                   data-bs-toggle="modal" 
                                   data-bs-target="#staticBackdrop">
                                   Gestionar Enturnado
                                </a>
                            </div>
                        </div>
                    </td>
                    <td>${v.conductor || '-'}</td>
                    <td>${v.celular || '-'}</td>
                    <td>${v.ubicacion_actual || '-'}</td>
                    <td>${v.agencia || '-'}</td>
                    <td>${v.Origen || '-'}</td>
                    <td>${v.Destino || '-'}</td>
                    <td>${v.usuario || '-'}</td>
                    <td>${v.Fecha_Enturnar || '-'}</td>
                    <td>${v.estado || '-'}</td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center text-muted">
                        No hay vehículos enturnados.
                    </td>
                </tr>`;
        }
    } catch (error) {
        console.error('Error al listar:', error);
    }
}

function aplicarFiltro() {
    const filtro = document.getElementById(`campo-${window.VENTANA}-filtro`).value;

    let filtros = {};

    switch (filtro) {
        case 'Origen':
            filtros.origen = document.getElementById(`campo-${window.VENTANA}-origen`).value;
            break;

        case 'Destino':
            filtros.destino = document.getElementById(`campo-${window.VENTANA}-destino`).value;
            break;

        case 'Origen Destino':
            filtros.origen = document.getElementById(`campo-${window.VENTANA}-origen`).value;
            filtros.destino = document.getElementById(`campo-${window.VENTANA}-destino`).value;
            break;

        case 'Fechas':
            filtros.fecha_inicio = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
            filtros.fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
            break;
    }

    listarVehiculosEnturnados(filtros);
}

async function OrigenEnturnar() {
    try {
        const response = await fetch($('#base_url').val() + 'serviciocliente/Consulta_Municipios', {
            method: 'POST',
            cache: 'no-cache'
        });

        const data = await response.json();
        window.municipiosData = data;

        $('#origen_enturnar').each(function () {
            const $select = $(this);
            $select.empty().append('<option value="">Seleccione un municipio</option>');

            data.forEach(function (element) {
                $select.append(
                    `<option value="${element.rndc_codigo_ciudad}" 
                        data-municipio="${element.municipio}" 
                        data-depto="${element.depto}">
                        ${element.municipio} - ${element.depto}
                    </option>`
                );
            });

            $select.select2({
                placeholder: 'Seleccione un municipio',
                allowClear: true,
                width: '100%',
                dropdownParent: $('#offcanvasRightEnturnados') // 🔥 FIX
            });
        });

    } catch (error) {
        console.error('Error en Municipios:', error);
    }
}

async function DestinoEnturnar() {
    try {
        const response = await fetch($('#base_url').val() + 'serviciocliente/Consulta_Municipios', {
            method: 'POST',
            cache: 'no-cache'
        });

        const data = await response.json();
        window.municipiosData = data;

        $('#destino_enturnar').each(function () {
            const $select = $(this);
            $select.empty().append('<option value="">Seleccione un municipio</option>');

            data.forEach(function (element) {
                $select.append(
                    `<option value="${element.rndc_codigo_ciudad}" 
                        data-municipio="${element.municipio}" 
                        data-depto="${element.depto}">
                        ${element.municipio} - ${element.depto}
                    </option>`
                );
            });

            $select.select2({
                placeholder: 'Seleccione un municipio',
                allowClear: true,
                width: '100%',
                dropdownParent: $('#offcanvasRightEnturnados') // 🔥 FIX
            });
        });

    } catch (error) {
        console.error('Error en Municipios:', error);
    }
}

function origen_ruta() {
    const selector = `#campo-${window.VENTANA}-origen`;

    $.ajax({
        url: $('#base_url').val() + 'trafico/Cargar_origen',
        type: 'POST',
        dataType: 'json',
        success: function (data) {

            const $select = $(selector);
            $select.empty(); // 🔴 importante: limpiar antes
            $select.append('<option value="">Seleccione Origen</option>');

            data.forEach(element => {
                $select.append(
                    `<option value="${element.rndc_codigo_ciudad}">
                        ${element.municipio} - ${element.depto}
                    </option>`
                );
            });

            // ✅ Inicializar Select2 AL FINAL
            // initSelect2(selector, 'Seleccione origen');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('No trajo origen', errorThrown);
        }
    });
}

function destino_ruta() {
    const selector = `#campo-${window.VENTANA}-destino`;

    $.ajax({
        url: $('#base_url').val() + 'trafico/Cargar_destino',
        type: 'POST',
        dataType: 'json',
        success: function (data) {

            const $select = $(selector);
            $select.empty(); // 🔴 importante
            $select.append('<option value="">Seleccione Destino</option>');

            data.forEach(element => {
                $select.append(
                    `<option value="${element.rndc_codigo_ciudad}">
                        ${element.municipio} - ${element.depto}
                    </option>`
                );
            });

            // ✅ Inicializar Select2 AL FINAL
            // initSelect2(selector, 'Seleccione destino');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('No trajo destino', errorThrown);
        }
    });
}

function initSelect2(selector, placeholder = 'Seleccione una opción') {
    const $el = $(selector);

    if ($el.hasClass('select2-hidden-accessible')) {
        $el.select2('destroy');
    }

    $el.select2({
        placeholder: placeholder,
        width: '100%',
        allowClear: true
    });
}