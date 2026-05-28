window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global

    document.getElementById(`campo-${window.VENTANA}-vehiculos`).style.display = 'none';
    document.getElementById(`campo-${window.VENTANA}-proveedores`).style.display = 'none';

    // Crear instancia
    // Usar una variable global o una propiedad en el objeto window
    if (!window.myOffcanvas) {
        window.myOffcanvas = new DynamicOffcanvas({
            id: `customOffcanvas${id}`,
            title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
            content: '<p>Contenido inicial</p>',
            scroll: true,
            backdrop: false
        });
    } else {
        console.log('El offcanvas ya está creado.');
    }

    // Validar los filtro de que se van a mostrar en la plataforma
    document.addEventListener('change', async e => {
        if (e.target.matches(`#campo-${window.VENTANA}-filtro`) || e.target.matches(`#campo-${window.VENTANA}-filtro *`)) {
            let filtro = e.target.value;
            if (filtro === 'Proveedores') {
                document.getElementById(`campo-${window.VENTANA}-proveedores`).style.display = '';
                document.getElementById(`campo-${window.VENTANA}-vehiculos`).style.display = 'none';
                document.getElementById(`campo-${window.VENTANA}-buscar`).value = '';
                let tbody = document.getElementById('tbody_recursos');
                tbody.innerHTML = '';
                cambiarEncabezados(filtro);
            } else if (filtro === 'Vehiculos') {
                document.getElementById(`campo-${window.VENTANA}-vehiculos`).style.display = '';
                document.getElementById(`campo-${window.VENTANA}-proveedores`).style.display = 'none';
                document.getElementById(`campo-${window.VENTANA}-buscar`).value = '';
                let tbody = document.getElementById('tbody_recursos');
                tbody.innerHTML = '';
                cambiarEncabezados(filtro);
            } else {

            }
        }
    });

    document.addEventListener('click', async e => {
        if (e.target.matches(`#campo-${window.VENTANA}-buscar`) || e.target.matches(`#campo-${window.VENTANA}-buscar *`)) {
            // Llamada a la función asíncrona que contiene el fetch y el try/catch
            buscarRecursos();
        }

        if (e.target.matches('#btn-accion-recurso') || e.target.matches('#btn-accion-recurso *')) {
            let Boton = e.target.closest("#btn-accion-recurso");
            // let numdoc_trazabilidad = Enlace.getAttribute("data-id");
            let VehiculoId = Boton.getAttribute("data-VehiculoId");
            let Placa = Boton.getAttribute("data-Placa");
            let Marca = Boton.getAttribute("data-Marca");
            let Configuracion = Boton.getAttribute("data-Configuracion");
            let Modelo = Boton.getAttribute("data-Modelo");
            let Color = Boton.getAttribute("data-Color");
            let Linea = Boton.getAttribute("data-Linea");
            let Estado = Boton.getAttribute("data-estado");
            let Carroceria = Boton.getAttribute("data-Carroceria");
            let Propietario = Boton.getAttribute("data-Propietario");
            let Tenedor = Boton.getAttribute("data-Tenedor");
            let Conductor = Boton.getAttribute("data-Conductor");
            let PropietarioId = Boton.getAttribute("data-PropietarioId");
            let TenedorId = Boton.getAttribute("data-TenedorId");
            let ConductorId = Boton.getAttribute("data-ConductorId");

            myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Inhabilitar Vehículos`);
            myOffcanvas.updateContent(`
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-12 col-md-2">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Placa:</span>
                            <span class="text-body-emphasis" style='font-size:11px;'>${Placa}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-2">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Marca:</span>
                            <span class="text-body-emphasis" style='font-size:11px;'>${Marca}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-4">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Configuración:</span>
                            <span class="text-body-emphasis" style='font-size:11px;'>${Configuracion}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-3">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Modelo:</span>
                            <span class="text-body-emphasis" style='font-size:11px;'>${Modelo}</span>
                        </p>
                    </div>

                </div>
                <div class="row border-top border-translucent border-dashed">
                                    <div class="col-12 col-md-2">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Color:</span>
                            <span class="text-body-emphasis" style='font-size:11px;'>${Color}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-3">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Línea:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:12px;'>${Linea}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-3">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Carrocería:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:12px;'>${Carroceria}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-3">
                        <!-- ELEMNTO PARA LOS ESTADOS -->
                    </div>

                    <div class="col-12 col-md-4">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Propietario:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:12px;'>${Propietario}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-4">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Tenedor:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:12px;'>${Tenedor}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-4">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Conductor:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:12px;'>${Conductor}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div class="border-top border-translucent border-dashed pt-2">
                <div class="row">
                    <div class="col-12 col-md-4 mb-3">
                        <label for="ind_aprobaID" class="form-label fw-semibold">Estado:</label>
                        <select name="ind_aproba" id="ind_aprobaID" class="form-select form-select-sm">
                            <option value="">-Seleccione--</option>
                            <option value="INHABILITADO">INHABILITADO</option>
                            <option value="desbloqueado">HABILITADO</option>
                        </select>
                    </div>

                    <div class="col-12 col-md-4 mb-3">
                        <label for="cod_tipinhID" class="form-label fw-semibold">Tipo de Inhabilitación:</label>
                        <select name="cod_tipinh" id="cod_tipinhID" class="form-select form-select-sm">
                            <option value="">-Seleccione--</option>
                            <option value="Suspendido">Suspendido</option>
                            <option value="Mantenimiento">Mantenimiento</option>
                            <option value="Inhabilitación Normal">Inhabilitación Normal</option>
                            <option value="Habilitación Normal">Habilitación Normal</option>
                            <option value="Moroso">Moroso</option>
                            <option value="Incumplimiento">Incumplimiento</option>
                        </select>
                    </div>
                    
                    <div class="col-12 col-md-4 mb-3">
                        <label for="cod_tipinhID" class="form-label fw-semibold">Observaciones:</label>
                        <textarea name="observacion" id="observacion" rows="1" class="form-control form-control-sm"></textarea>
                    </div>
                </div>
            </div>

             <div class="border-top border-translucent border-dashed pt-2">
                <div class="row justify-content-end">
                    <div class="col-auto">
                    <button class="btn btn-success btn-sm py-1" id="btn_inhabilitar_recurso" type="button" data-RecursoId='${VehiculoId}' data-Placa='${Placa}' data-Objeto='vehiculo' data-Estado=${Estado} 
                    data-PropietarioId=${PropietarioId} data-TenedorId=${TenedorId} data-ConductorId=${ConductorId}> 
                        <span class="uil uil-play-circle"></span> Guardar
                    </button>
                    </div>
                </div>
             </div>

            <div class="row border-top border-translucent border-dashed mt-2 pt-2">
                <div class="col-12">
                    <h6 class="fw-bold mb-2">Histórico de Bloqueos:</h6>
                    <div id="historicoBloqueos">Cargando histórico...</div> 
                </div>
            </div>
            `);
            myOffcanvas.show();

            // -----------------------------------------------------------------------
            // **NUEVA LÓGICA PARA CARGAR EL HISTÓRICO**
            // -----------------------------------------------------------------------

            try {
                const contenedor = document.getElementById('historicoBloqueos');
                const VehiculoId = Boton.getAttribute("data-VehiculoId"); // Ya lo tenías definido

                // Petición fetch al controlador
                fetch($('#base_url').val() + 'seguridad_prefiltro/obtenerHistoricoBloqueos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ vehiculo_id: VehiculoId })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error en la respuesta del servidor');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.status === 'success') {
                            // Generar y mostrar el HTML del historial
                            if (data.data.length > 0) {
                                contenedor.innerHTML = generarHtmlHistorico(data.data);
                            } else {
                                contenedor.innerHTML = '<p class="text-secondary">No se encontró histórico de bloqueos para este vehículo.</p>';
                            }
                        } else {
                            contenedor.innerHTML = `<p class="text-danger">Error al cargar el histórico: ${data.message}</p>`;
                        }
                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                        contenedor.innerHTML = `<p class="text-danger">Hubo un error de conexión: ${error.message}</p>`;
                    });

            } catch (error) {
                console.error('Error al intentar iniciar la carga del histórico:', error);
            }

            // Función auxiliar para generar el HTML del histórico (ADAPTADA)
            function generarHtmlHistorico(historial) {
                let html = '<ul class="list-group list-group-flush">';

                // Si no hay historial, manejamos el caso
                if (historial.length === 0) {
                    return '<p class="text-secondary">No se encontró histórico de bloqueos para este vehículo.</p>';
                }

                historial.forEach(item => {
                    // Determinar el color del badge basado en el estado (ejemplo)
                    const badgeClass = item.estado === 'INHABILITADO' ? 'bg-danger' : 'bg-success';

                    html += `
                        <li class="list-group-item d-flex flex-column py-2 px-0">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <div class="fw-bold me-2">
                                    ${item.tipo_inhabilitacion} 
                                    <span class="badge ${badgeClass} rounded-pill ms-1" style="font-size: 0.7em;">${item.estado}</span>
                                </div>
                                <small class="text-body-secondary text-end">${item.fecha_operacion}</small>
                            </div>
                            
                            <div class="d-flex w-100 justify-content-between align-items-start mt-1" style="font-size: 0.85em;">
                                <div class="text-muted">
                                    <span class="fw-semibold">Proceso:</span> ${item.nombre_proceso} <br>
                                    <span class="fw-semibold">Usuario:</span> ${item.usuario}
                                </div>
                            </div>

                            <div class="mt-1" style="font-size: 0.85em;">
                                <span class="fw-semibold">Obs:</span> ${item.observacion || 'No aplica'}
                            </div>
                        </li>
                    `;
                });
                html += '</ul>';
                return html;
            }
        }

        if (e.target.matches('#btn-accion-proveedor') || e.target.matches('#btn-accion-proveedor *')) {
            let Boton = e.target.closest("#btn-accion-proveedor");
            let NumdocProveedor = Boton.getAttribute("data-NumdocProveedor");
            let Documento = Boton.getAttribute("data-Documento");
            let Nombre = Boton.getAttribute("data-Nombre");
            let Direccion = Boton.getAttribute("data-Direccion");
            let Municipio = Boton.getAttribute("data-Municipio");
            let Celular = Boton.getAttribute("data-Celular");
            let Abreviatura = Boton.getAttribute("data-Abreviatura");
            let Estado = Boton.getAttribute("data-Estado");
            let Partes = Celular.split('-');

            myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Operación Proveedor`);
            myOffcanvas.updateContent(`<h3 class="card-title mb-4">Datos del Proveedor</h3>
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-12 col-md-3">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">No Identificación:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:13px;'>${Documento}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-3">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Nombre:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:13px;'>${Nombre}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-3">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Abreviatura:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:13px;'>${Abreviatura}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-3">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Dirección:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:13px;'>${Direccion}</span>
                        </p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-3">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Ciudad:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:13px;'>${Municipio}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-3">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Celular 1:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:13px;'>${parseInt(Partes[0], 10)}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-3">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Celular 2:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:13px;'>${parseInt(Partes[1], 10) ? parseInt(Partes[1], 10) : '-'}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-3">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Estado:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:13px;'>${Estado}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-3">
                        <!-- ELEMNTO PARA LOS ESTADOS -->
                    </div>
                </div>
            </div>

            <div class="border-top border-translucent border-dashed pt-2">
                <div class="row">
                    <div class="col-12 col-md-4 mb-3">
                        <label for="ind_aprobaID" class="form-label fw-semibold">Estado:</label>
                        <select name="ind_aproba" id="ind_aprobaID" class="form-select form-select-sm">
                            <option value="">-Seleccione--</option>
                            <option value="INHABILITADO">INHABILITADO</option>
                            <option value="HABILITADO">HABILITADO</option>
                            <!--<option value="INACTIVO">INACTIVO</option>-->
                        </select>
                    </div>
                    <div class="col-12 col-md-4 mb-3">
                        <label for="cod_tipinhID" class="form-label fw-semibold">Tipo de Inhabilitación:</label>
                        <select name="cod_tipinh" id="cod_tipinhID" class="form-select form-select-sm">
                            <option value="">-Seleccione--</option>
                            <option value="Suspendido">Suspendido</option>
                            <option value="Mantenimiento">Mantenimiento</option>
                            <option value="Inhabilitación Normal">Inhabilitación Normal</option>
                            <option value="Habilitación Normal">Habilitación Normal</option>
                            <option value="Moroso">Moroso</option>
                            <option value="Incumplimiento">Incumplimiento</option>
                        </select>
                    </div>
                    <div class="col-12 col-md-4 mb-3">
                        <label for="cod_tipinhID" class="form-label fw-semibold">Observaciones:</label>
                        <textarea name="observacion" id="observacion" rows="1" class="form-control form-control-sm"></textarea>
                    </div>
                </div>
            </div>

             <div class="border-top border-translucent border-dashed pt-2">
                <div class="row justify-content-end">
                    <div class="col-auto">
                    <button class="btn btn-success btn-sm py-1" id="btn_inhabilitar_proveedor" type="button" data-RecursoId='${NumdocProveedor}' data-Documento='${Documento}' data-Nombre='${Nombre}' data-Objeto='proveedor'
                    data-Estado='${Estado}'> 
                        <span class="uil uil-play-circle"></span> Guardar
                    </button>
                    </div>
                </div>
             </div>

            <div class="row border-top border-translucent border-dashed mt-2 pt-2">
                <div class="col-12">
                    <h6 class="fw-bold mb-2">Histórico de Bloqueos:</h6>
                    <div id="historicoBloqueosRecursos">Cargando histórico...</div> 
                </div>
            </div>
            `);
            myOffcanvas.show();

            // -----------------------------------------------------------------------
            // **NUEVA LÓGICA PARA CARGAR EL HISTÓRICO**
            // -----------------------------------------------------------------------

            try {
                const contenedor = document.getElementById('historicoBloqueosRecursos');
                const VehiculoId = Boton.getAttribute("data-VehiculoId"); // Ya lo tenías definido

                // Petición fetch al controlador
                fetch($('#base_url').val() + 'seguridad_prefiltro/obtenerHistoricoBloqueos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ vehiculo_id: NumdocProveedor })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error en la respuesta del servidor');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.status === 'success') {
                            // Generar y mostrar el HTML del historial
                            if (data.data.length > 0) {
                                contenedor.innerHTML = generarHtmlHistorico(data.data);
                            } else {
                                contenedor.innerHTML = '<p class="text-secondary">No se encontró histórico de bloqueos para este proveedor.</p>';
                            }
                        } else {
                            contenedor.innerHTML = `<p class="text-danger">Error al cargar el histórico: ${data.message}</p>`;
                        }
                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                        contenedor.innerHTML = `<p class="text-danger">Hubo un error de conexión: ${error.message}</p>`;
                    });

            } catch (error) {
                console.error('Error al intentar iniciar la carga del histórico:', error);
            }

            // Función auxiliar para generar el HTML del histórico (ADAPTADA)
            function generarHtmlHistorico(historial) {
                let html = '<ul class="list-group list-group-flush">';

                // Si no hay historial, manejamos el caso
                if (historial.length === 0) {
                    return '<p class="text-secondary">No se encontró histórico de bloqueos para este proveedor.</p>';
                }

                historial.forEach(item => {
                    // Determinar el color del badge basado en el estado (ejemplo)
                    const badgeClass = item.estado === 'INHABILITADO' ? 'bg-danger' : 'bg-success';

                    html += `
                        <li class="list-group-item d-flex flex-column py-2 px-0">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <div class="fw-bold me-2">
                                    ${item.tipo_inhabilitacion} 
                                    <span class="badge ${badgeClass} rounded-pill ms-1" style="font-size: 0.7em;">${item.estado}</span>
                                </div>
                                <small class="text-body-secondary text-end">${item.fecha_operacion}</small>
                            </div>
                            
                            <div class="d-flex w-100 justify-content-between align-items-start mt-1" style="font-size: 0.85em;">
                                <div class="text-muted">
                                    <span class="fw-semibold">Proceso:</span> ${item.nombre_proceso} <br>
                                    <span class="fw-semibold">Usuario:</span> ${item.usuario}
                                </div>
                            </div>

                            <div class="mt-1" style="font-size: 0.85em;">
                                <span class="fw-semibold">Obs:</span> ${item.observacion || 'No aplica'}
                            </div>
                        </li>
                    `;
                });
                html += '</ul>';
                return html;
            }
        }

        if (e.target.matches('#btn_inhabilitar_recurso') || e.target.matches('#btn_inhabilitar_recurso *')) {
            let BotonInhabilitar = e.target.closest("#btn_inhabilitar_recurso");

            // --- 1. Recolección de datos (Mejora: uso de operador de coalescencia nula para seguridad) ---
            let RecursoId = BotonInhabilitar.getAttribute('data-RecursoId');
            let Placa = BotonInhabilitar.getAttribute('data-Placa');
            let Objeto = BotonInhabilitar.getAttribute('data-Objeto');
            let Nombre = BotonInhabilitar.getAttribute('data-Nombre');
            let EstadoActual = BotonInhabilitar.getAttribute('data-estado');
            let PropietarioId = BotonInhabilitar.getAttribute('data-PropietarioId') ?? ''; // Usar '' si es null
            let TenedorId = BotonInhabilitar.getAttribute('data-TenedorId') ?? ''; // Usar '' si es null
            let ConductorId = BotonInhabilitar.getAttribute('data-ConductorId') ?? ''; // Usar '' si es null

            let Estado = document.getElementById('ind_aprobaID')?.value ?? '';
            let TipoHinhabilitacion = document.getElementById('cod_tipinhID')?.value ?? '';
            let Observacion = document.getElementById('observacion')?.value ?? '';

            // --- 2. Confirmación con SweetAlert ---
            const result = await Swal.fire({
                title: '¿Seguro?',
                text: '¿Desea Inhabilitar Recurso? ' + (Placa ? Placa : Nombre),
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
                    // Preparar FormData
                    let formdata = new FormData();
                    formdata.append('RecursoId', RecursoId);
                    formdata.append('Estado', Estado);
                    formdata.append('TipoHinhabilitacion', TipoHinhabilitacion);
                    formdata.append('Observacion', Observacion);
                    formdata.append('Objeto', Objeto);
                    formdata.append('EstadoActual', EstadoActual);
                    // Enviar IDs de terceros (vacíos si son null)
                    formdata.append('PropietarioId', PropietarioId);
                    formdata.append('TenedorId', TenedorId);
                    formdata.append('ConductorId', ConductorId);

                    // --- 3. Ejecución de la solicitud Fetch ---
                    const response = await fetch($('#base_url').val() + 'seguridad_prefiltro/Inhabilitar_vehiculo', {
                        method: 'POST',
                        body: formdata,
                        cache: 'no-cache',
                    });

                    // Manejar error de respuesta HTTP (ej: 404, 500)
                    if (!response.ok) {
                        throw new Error(`Error de servidor: ${response.status} ${response.statusText}`);
                    }

                    const data = await response.json();

                    // --- 4. Manejo de la respuesta JSON (El principal cambio) ---
                    if (data && typeof data.status !== 'undefined') {
                        // La respuesta es un OBJETO con la propiedad 'status'
                        const resultado = data;

                        if (resultado.status === true) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Éxito',
                                text: resultado.message,
                                timer: 2500,
                                showConfirmButton: false
                            });
                            // Asegúrate de que 'myOffcanvas' y 'buscarRecursos' están definidos
                            if (typeof myOffcanvas !== 'undefined' && myOffcanvas.hide) myOffcanvas.hide();
                            if (typeof buscarRecursos === 'function') buscarRecursos();
                        } else {
                            // Respuesta con status: false (error de lógica de negocio)
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: resultado.message || 'Ocurrió un error en la operación',
                                timer: 3000,
                                showConfirmButton: false
                            });
                        }
                    } else {
                        // Respuesta JSON válida pero con formato inesperado
                        Swal.fire({
                            icon: 'error',
                            title: 'Respuesta inválida',
                            text: 'El servidor devolvió un JSON con formato inesperado.',
                        });
                    }
                } catch (error) {
                    // Error de red, fallo en response.json(), o error de servidor HTTP
                    console.error('Error en la solicitud:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de conexión/servidor',
                        text: error.message || 'No se pudo conectar al servidor o hubo un error inesperado.',
                    });
                }
            }
        }

        if (e.target.matches('#btn_inhabilitar_proveedor') || e.target.matches('#btn_inhabilitar_proveedor *')) {
            let BotonInhabilitar = e.target.closest("#btn_inhabilitar_proveedor");
            let RecursoId = BotonInhabilitar.getAttribute('data-RecursoId');
            let Objeto = BotonInhabilitar.getAttribute('data-Objeto');
            let Nombre = BotonInhabilitar.getAttribute('data-Nombre');
            let EstadoActual = BotonInhabilitar.getAttribute('data-estado');

            // --- 2. Confirmación con SweetAlert ---
            const result = await Swal.fire({
                title: '¿Seguro?',
                text: '¿Desea Inhabilitar Recurso? ' + Nombre,
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
                // 1. Capturar los valores del formulario que están en el Offcanvas/Vista
                const nuevoEstado = document.getElementById('ind_aprobaID').value;
                const tipoInhabilitacion = document.getElementById('cod_tipinhID').value;
                const observacion = document.getElementById('observacion').value;

                // 2. Validaciones básicas
                if (nuevoEstado === '' || tipoInhabilitacion === '') {
                    Swal.fire('Error de Datos', 'Debe seleccionar el estado y el tipo de inhabilitación.', 'error');
                    return; // Detener la ejecución si faltan datos
                }

                // 3. Preparar los datos para enviar al Controlador
                const dataToSend = {
                    RecursoId: RecursoId,
                    Objeto: Objeto, // 'proveedor' o similar
                    Estado: nuevoEstado, // Ejemplo: 'INHABILITADO'
                    TipoHinhabilitacion: tipoInhabilitacion,
                    Observacion: observacion,
                    // No olvides incluir otros IDs si son relevantes para el bloqueo de proveedores
                    // Ej: PropietarioId, TenedorId, etc., si aplica al bloqueo de proveedor
                };

                // 4. Petición fetch al controlador
                try {
                    const response = await fetch($('#base_url').val() + 'seguridad_prefiltro/inhabilitarRecurso', { // Ajusta la URL de tu controlador
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(dataToSend)
                    });

                    const data = await response.json();

                    // 5. Manejar la respuesta
                    if (data && data.length > 0) {
                        const resultData = data[0];
                        if (resultData.status) {
                            Swal.fire('Éxito', resultData.message, 'success');
                            // Ocultar el Offcanvas y recargar la tabla de datos
                            // Asegúrate de que 'myOffcanvas' y 'buscarRecursos' están definidos
                            if (typeof myOffcanvas !== 'undefined' && myOffcanvas.hide) myOffcanvas.hide();
                            if (typeof buscarRecursos === 'function') buscarRecursos();
                        } else {
                            Swal.fire('Error', resultData.message, 'error');
                        }
                    } else {
                        Swal.fire('Error', 'Respuesta inesperada del servidor.', 'error');
                    }

                } catch (error) {
                    console.error('Error en la petición Fetch:', error);
                    Swal.fire('Error de Conexión', 'No se pudo conectar con el servidor.', 'error');
                }
            }
        }
    });
}

function cambiarEncabezados(tipo) {
    // const tipo = document.getElementById('tipoFiltro').value;
    const encabezadoRow = document.getElementById('encabezados');
    encabezadoRow.innerHTML = ''; // Limpiar

    let columnas = [];

    if (tipo === 'Vehiculos') {
        columnas = [
            'Placa', 'Marca', 'Configuración', 'Modelo',
            'Color', 'Línea', 'Carrocería', 'Estado'
        ];
    } else if (tipo === 'Proveedores') {
        columnas = [
            'Nit o CC', 'Nombre', 'Abreviatura', 'Ciudad', 'Dirección', 'Celular', 'Estado'
        ];
    }

    columnas.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        encabezadoRow.appendChild(th);
    });
}

// Función principal que encapsula la lógica de la búsqueda y la llamada asíncrona
async function buscarRecursos() {
    // 1. Recolección de datos
    let formdata = new FormData();
    formdata.append('filtro', document.getElementById(`campo-${window.VENTANA}-filtro`).value);
    // Lógica para determinar el valor a buscar (vehículos o proveedores)
    formdata.append('valor', document.getElementById(`campo-${window.VENTANA}-vehiculos`).value ? document.getElementById(`campo-${window.VENTANA}-vehiculos`).value : document.getElementById(`campo-${window.VENTANA}-proveedores`).value);
    formdata.append('busqueda', document.getElementById(`campo-${window.VENTANA}-buscar`).value.trim());

    // 2. Mostrar Loader
    const loader = document.querySelector('.img_load');
    if (loader) loader.style.display = 'table-row';

    // 3. Ejecución de la solicitud con Try...Catch...Finally
    try {
        const response = await fetch($('#base_url').val() + 'seguridad_prefiltro/listar_recursos', {
            method: 'POST',
            body: formdata,
            cache: 'no-cache',
        });

        // Manejo de la respuesta HTTP
        if (!response.ok) {
            // Lanza un error si la respuesta HTTP no es exitosa (ej: 404, 500)
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        let filtro = document.getElementById(`campo-${window.VENTANA}-filtro`).value;

        // 4. Procesar los datos
        if (data) {
            // La función listar_recursos ahora solo se encarga de pintar la tabla
            listar_recursos(filtro, data);
        }

    } catch (error) {
        // Manejo de errores de red o errores lanzados dentro del try
        console.error('Error en la solicitud para listar recursos:', error);
        // Se podría agregar una notificación al usuario aquí
        console.log('Error: no se pudo obtener la lista de recursos.');
        // Puedes decidir si relanzar el error o simplemente manejarlo
        // throw error; 

    } finally {
        // 5. Ocultar Loader
        if (loader) loader.style.display = 'none';
    }
}

async function listar_recursos(filtro, data) {
    let tbody = document.getElementById('tbody_recursos');
    tbody.innerHTML = '';
    let col_estatus_trazabilidad = "";
    if (filtro === 'Vehiculos') {
        data.forEach(element => {
            const fila = document.createElement('tr');
            const columnaPlaca = document.createElement('td');

            columnaPlaca.innerHTML = `<a class='text-decoration-none' href='#' id='btn-accion-recurso' data-Placa='${element.placa}' data-VehiculoId='${element.numdoc_vehiculo}' data-Marca='${element.marca}' data-Configuracion='${element.Configuracion}' data-Modelo='${element.Modelo}'
            data-Color='${element.color}' data-Linea='${element.Linea}' data-Carroceria='${element.Carroceria}' data-Propietario='${element.Documento_Propietario}-${element.Nombre_Propietario}' data-Estado='${element.estado_proceso}' data-Tenedor='${element.Documento_Tenedor}-${element.Nombre_Tenedor}' 
            data-Conductor='${element.Documento_Conductor}-${element.Nombre_Conductor}' data-PropietarioId='${element.id_propietario}' data-TenedorId='${element.id_tenedor}' data-ConductorId='${element.id_conductor}'>${element.placa}</a>`;
            columnaPlaca.style.width = 'auto';
            columnaPlaca.style.whiteSpace = 'nowrap';
            columnaPlaca.style.textAlign = 'center';

            const columnaMarca = document.createElement('td');
            columnaMarca.innerHTML = element.marca;
            columnaMarca.style.width = 'auto';
            columnaMarca.style.whiteSpace = 'nowrap';
            columnaMarca.style.textAlign = 'center';

            const columnaConfiguracion = document.createElement('td');
            columnaConfiguracion.innerHTML = element.Configuracion;
            columnaConfiguracion.style.width = 'auto';
            columnaConfiguracion.style.whiteSpace = 'nowrap';
            columnaConfiguracion.style.textAlign = 'center';

            const columnaModelo = document.createElement('td');
            columnaModelo.innerHTML = element.Modelo;
            columnaModelo.style.width = 'auto';
            columnaModelo.style.whiteSpace = 'nowrap';
            columnaModelo.style.textAlign = 'center';

            const columnaColor = document.createElement('td');
            columnaColor.innerHTML = element.color;
            columnaColor.style.width = 'auto';
            columnaColor.style.whiteSpace = 'nowrap';
            columnaColor.style.textAlign = 'center';

            const columnaLinea = document.createElement('td');
            columnaLinea.innerHTML = element.Linea;
            columnaLinea.style.width = 'auto';
            columnaLinea.style.whiteSpace = 'nowrap';
            columnaLinea.style.textAlign = 'center';

            const columnaCarroceria = document.createElement('td');
            columnaCarroceria.innerHTML = element.Carroceria;
            columnaCarroceria.style.width = 'auto';
            columnaCarroceria.style.whiteSpace = 'nowrap';
            columnaCarroceria.style.textAlign = 'center';

            const columnaEstadoProceso = document.createElement('td');
            const estado = obtenerEstadoTrazabilidad(element.estado_proceso);
            col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
            columnaEstadoProceso.innerHTML = col_estatus_trazabilidad;
            columnaEstadoProceso.style.width = 'auto';
            columnaEstadoProceso.style.whiteSpace = 'nowrap';
            columnaEstadoProceso.style.textAlign = 'center';

            fila.appendChild(columnaPlaca);
            fila.appendChild(columnaMarca);
            fila.appendChild(columnaConfiguracion);
            fila.appendChild(columnaModelo);
            fila.appendChild(columnaColor);
            fila.appendChild(columnaLinea);
            fila.appendChild(columnaCarroceria);
            fila.appendChild(columnaEstadoProceso);
            tbody.appendChild(fila);
        });

    } else if (filtro === 'Proveedores') {
        data.forEach(element => {
            const fila = document.createElement('tr');
            const tipo_Proveedor = document.getElementById(`campo-${window.VENTANA}-proveedores`).value;

            // Acceso dinámico a las propiedades del objeto
            const Documento_proveedor = element[`Documento_${tipo_Proveedor}`];
            const Nombre_proveedor = element[`Nombre_${tipo_Proveedor}`];
            const Celular_proveedor = element[`Celular_${tipo_Proveedor}`];
            const Direccion_proveedor = element[`Direccion_${tipo_Proveedor}`];
            const Municipio_proveedor = element[`Municipio_${tipo_Proveedor}`];
            const Abreviatura_proveedor = element[`Abreviatura_${tipo_Proveedor}`];
            const Estado_proveedor = element[`Estado_${tipo_Proveedor}`];
            const Numdoc_proveedor = element[`Numdoc_${tipo_Proveedor}`];

            const estado = obtenerEstadoTrazabilidad(Estado_proveedor);
            col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
            const columnaDocumentoProveedor = document.createElement('td');
            columnaDocumentoProveedor.innerHTML = `<a class='text-decoration-none' href='#' id='btn-accion-proveedor' data-Documento='${Documento_proveedor}' data-Nombre='${Nombre_proveedor}' data-Celular='${Celular_proveedor}' 
            data-Direccion='${Direccion_proveedor}' data-Municipio='${Municipio_proveedor}' data-NumdocProveedor='${Numdoc_proveedor}' data-Abreviatura='${Abreviatura_proveedor}' data-Estado='${Estado_proveedor}'>${Documento_proveedor}</a>`;
            columnaDocumentoProveedor.style.width = 'auto';
            columnaDocumentoProveedor.style.whiteSpace = 'nowrap';
            columnaDocumentoProveedor.style.textAlign = 'center';

            const columnaNombreProveedor = document.createElement('td');
            columnaNombreProveedor.innerHTML = Nombre_proveedor;
            columnaNombreProveedor.style.width = 'auto';
            columnaNombreProveedor.style.whiteSpace = 'nowrap';
            columnaNombreProveedor.style.textAlign = 'center';

            const columnaAbreviaturaProveedor = document.createElement('td');
            columnaAbreviaturaProveedor.innerHTML = Abreviatura_proveedor;
            columnaAbreviaturaProveedor.style.width = 'auto';
            columnaAbreviaturaProveedor.style.whiteSpace = 'nowrap';
            columnaAbreviaturaProveedor.style.textAlign = 'center';

            const columnaMunicipioProveedor = document.createElement('td');
            columnaMunicipioProveedor.innerHTML = Municipio_proveedor;
            columnaMunicipioProveedor.style.width = 'auto';
            columnaMunicipioProveedor.style.whiteSpace = 'nowrap';
            columnaMunicipioProveedor.style.textAlign = 'center';

            const columnaDireccionProveedor = document.createElement('td');
            columnaDireccionProveedor.innerHTML = Direccion_proveedor;
            columnaDireccionProveedor.style.width = 'auto';
            columnaDireccionProveedor.style.whiteSpace = 'nowrap';
            columnaDireccionProveedor.style.textAlign = 'center';

            const columnaCelularProveedor = document.createElement('td');
            columnaCelularProveedor.innerHTML = Celular_proveedor;
            columnaCelularProveedor.style.width = 'auto';
            columnaCelularProveedor.style.whiteSpace = 'nowrap';
            columnaCelularProveedor.style.textAlign = 'center';

            const columnaEstadoProveedor = document.createElement('td');
            columnaEstadoProveedor.innerHTML = col_estatus_trazabilidad;
            columnaEstadoProveedor.style.width = 'auto';
            columnaEstadoProveedor.style.whiteSpace = 'nowrap';
            columnaEstadoProveedor.style.textAlign = 'center';

            fila.appendChild(columnaDocumentoProveedor);
            fila.appendChild(columnaNombreProveedor);
            fila.appendChild(columnaAbreviaturaProveedor);
            fila.appendChild(columnaMunicipioProveedor);
            fila.appendChild(columnaDireccionProveedor);
            fila.appendChild(columnaCelularProveedor);
            fila.appendChild(columnaEstadoProveedor);
            tbody.appendChild(fila);
        });

    }
}

