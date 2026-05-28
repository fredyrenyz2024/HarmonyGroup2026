window.VENTANA = null; // Variable global para almacenar el ID

// sessionStorage.clear();
// Definir la función initScript globalmente
window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global
    Listar_Historico_Instrucciones_Facturacion();
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

    document.addEventListener('click', async e => {
        if (e.target.matches(`#btn-instrucciones-cliente`) || e.target.matches(`#btn-instrucciones-cliente *`)) {
            let instruccionesAgrupadas = {};
            let Boton = e.target.closest(`#btn-instrucciones-cliente`);
            let Cliente = Boton.getAttribute('data-Cliente');
            let ClienteId = Boton.getAttribute('data-ClienteId');
            myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Instrucciones de Facturaci&oacute;n de ` + Cliente);
            myOffcanvas.updateContent(`
                <div class="container-fluid">
                    <div class="row mb-2"> 
                    <!-- Filtro para las instrucciones por estado -->
                        <div class="col-12 col-md-4 p-1 ms-auto">
                            <div class="mb-1">
                                <label style="font-size: 12px;">Filtro</label>
                                <select name="filtro_estado_instruccion" id="filtro_estado_instruccion" class="form-select form-select-sm">
                                    <option value="">-Seleccione-</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Completada">Facturada</option>
                                    <option value="Pendiente Facturar">Pendiente Facturar</option>
                                    <option value="Rechazada">Rechazada</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-12 col-md-12 p-1" id='List-acordeon'></div>
                    </div>
                </div>
            `);

            //Listar las instrucciones de facturacion del cliente
            let formdata = new FormData();
            formdata.append('ClienteId', ClienteId);
            try {
                const response = await fetch($('#base_url').val() + 'serviciocliente/Detalle_Historico_Instrucciones_Facturacion_Cliente', {
                    method: 'POST',
                    body: formdata,
                    cache: 'no-cache',
                });
                const data = await response.json();

                data.forEach(row => {
                    const id = row.instruccion_id;

                    if (!instruccionesAgrupadas[id]) {
                        instruccionesAgrupadas[id] = {
                            id: row.instruccion_id,
                            nombre: row.nombre,
                            estado: row.estado_instruccion,
                            observaciones: row.observaciones,
                            comercial_nombre: row.comercial_nombre,
                            total_instruccion: row.total_instruccion,
                            total_factura: row.Total_factura_Instruccion,
                            total_servicios_especiales: row.total_servicios_especiales,
                            estado_facturacion: row.estado_facturacion,
                            num_factura: row.num_factura,
                            Fecha_Instrccion: row.Fecha_Instrccion,
                            Manifiesto: row.Manifiesto,
                            Origen: row.Origen,
                            Destino: row.Destino,
                            Observacion_Respuesta: row.Observacion_Respuesta,
                            archivo: row.archivo,
                            num_factura: row.num_factura,
                            ruta_documento: row.ruta_documento,
                            nombre_documento: row.nombre_documento,
                            remesas: []
                        };
                    }

                    instruccionesAgrupadas[id].remesas.push(row);
                });

                let html = '';
                let index = 0;
                let color = '';
                for (const id in instruccionesAgrupadas) {
                    const instruccion = instruccionesAgrupadas[id];
                    const collapseId = `collapse_${index}`;

                    switch (instruccion.estado) {
                        case 'Completada':
                            color = '#25b003';
                            break;

                        case 'Pendiente':
                            color = '#e5780b';
                            break;

                        case 'Pendiente Facturar':
                            color = '#0097eb';
                            break;

                        case 'Rechazada':
                            color = '#ec1f00';
                            break;

                        case 'Pendiente Anulacion':
                            color = '#d40000ff';
                            break;
                        default:
                            color = 'black';
                    }

                    html += `
                            <div class="accordion-item">
                                <h6 class="accordion-header d-flex align-items-center justify-content-between" id="heading_${index}">
                                    <div class="d-flex align-items-center w-80">
                                        <div class="form-check form-switch mt-2 flex-grow-1">
                                            <input class="form-check-input chk_instruccion collapsed"
                                                data-bs-toggle="collapse" data-bs-target="#${collapseId}"
                                                aria-expanded="false" aria-controls="${collapseId}"
                                                type="checkbox" id="chk_instruccion${instruccion.id}"
                                                name="chk_instruccion[]" value="${instruccion.id}"
                                                data-idvalor="${instruccion.id}">
                                            <label class="form-check-label my-1" for="chk_instruccion${instruccion.id}"> Instrucción #${instruccion.id} - 
                                             Estado: <span style="color: ${color}; font-weight: 600;">${instruccion.estado}</span> -
                                             Comercial: ${instruccion.comercial_nombre} - 
                                             Fecha Instrucción: ${instruccion.Fecha_Instrccion} - 
                                             Num.Factura:  ${instruccion.remesas[0]?.estado_facturacion === 'Facturada' ? `<span class="text-dark"><a class='text-decoration-none' href='#' onclick="abrir_fotos('${instruccion.remesas[0]?.archivo}')">${instruccion.remesas[0]?.num_factura}</a></span>` : `<span class="text-danger">Pendiente</span>`}</label>
                                        </div>
                                    </div>
                                    <div class="btn-group btn-group-sm mt-2 ms-3" role="group" aria-label="Acciones">
                                        <!--<button class="btn btn-subtle-warning btn-sm me-1 px-1 py-0" type="button">Left</button>-->
                                        ${instruccion.estado === 'Rechazada' ? `<button class="btn btn-subtle-warning btn-sm me-1 px-1 py-0" type="button" data-instruccion-id="${instruccion.id}" id="btn-edit-instruccion"><span class="uil uil-file-edit-alt" data-fa-transform="shrink-3"></span> Editar Instrucci&oacute;n</button>` : ''}
                                        ${instruccion.remesas[0]?.estado_facturacion === 'Facturada' && instruccion.estado !== 'Pendiente Anulacion' ?
                                        `<button class="btn btn-subtle-danger btn-sm me-1 px-1 py-0" 
                                                                        type="button" 
                                                                        data-instruccion_id="${instruccion.id}" 
                                                                        data-cliente="${instruccion.nombre}" 
                                                                        id="btn-annular-instruccion" 
                                                                        data-bs-toggle="modal" 
                                                                        data-bs-target="#verticallyCentered">
                                                                        <span class="uil uil-file-block-alt" data-fa-transform="shrink-3"></span> 
                                                                        Anular Factura
                                                                    </button>`
                                        : ``}
                                    </div>
                                </h6>
                                <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="heading_${index}" data-bs-parent="#accordionExample">
                                    <div class="accordion-body pt-2">
                                            <div class="input-group d-none" id='form-agregar-remesas-${instruccion.id}'>
                                                <select class="form-select form-select-sm select-remesas" data-instruccionId="${instruccion.id}" id="SelectRemesas_${instruccion.id}" multiple="multiple" style="width: 90%">
                                                        <option value="">Cargando remesas...</option>
                                                </select>
                                                <button class="btn btn-outline-secondary btn-sm" type="button" data-instruccion-id="${instruccion.id}" id="btn-buscar-remesas">Guardar</button>
                                            </div>
                                            <!-- Número de factura alineado a la derecha -->
                                            <div class="text-end border-bottom border-translucent border-dashed">
                                                <strong>Num.Factura:</strong>
                                                ${instruccion.remesas[0]?.estado_facturacion === 'Facturada' ? `<span class="text-dark"><a class='text-decoration-none' href='#' onclick="abrir_fotos('${instruccion.remesas[0]?.archivo}')">${instruccion.remesas[0]?.num_factura}</a></span>` : `<span class="text-danger">Pendiente</span>`}
                                            </div>

                                        <ul class="list-group list-group-flush">
                                            ${instruccion.remesas.map(rem => `
                                            <li class="list-group-item d-flex justify-content-between align-items-center" style="font-size:13px;">
                                                <div class="form-check form-switch mt-2">
                                                    <input class="form-check-input me-2 chk_instruccion_remesa" type="checkbox" id="chk_instruccion_remesa_${rem.remesa_id}" name="chk_instruccion_remesa[]" 
                                                    value="${rem.remesa_id}" data-RemesaValor="${rem.Total_Remesa}" data-instruccion-id="${instruccion.id}" ${rem.estado_facturacion === 'Facturada' ? 'checked disabled' : 'checked'}>
                                                    <strong>Remesa:</strong> ${rem.remesa_id}  <strong>Manifiesto: </strong> ${rem.Manifiesto} <strong>Ruta: </strong> ${rem.Origen} - ${rem.Destino} 
                                                </div>
                                                <span><strong>Total:</strong> ${parseFloat(rem.Total_Remesa).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                                            </li>
                                            `).join('')}
                                        </ul>

                                        <div class="row mb-2 border-top border-translucent border-dashed"> 
                                            <div class="col-12 col-md-4">
                                                <div class="mb-2">
                                                    <label style="font-size: 12px;">Total Instrucci&oacute;n</label>
                                                    <input class="form-control form-control-sm total-instruccion" type="text" id="total_Instruccion_Facturacion${instruccion.id}" data-instruccion-id="${instruccion.id}"  readonly value="${parseFloat(instruccion.total_instruccion).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}">
                                                </div>
                                            </div>

                                            <div class="col-12 col-md-4">
                                                <div class="mb-2">
                                                    <label style="font-size: 12px;">Total Servicios Especiales</label>
                                                    <input class="form-control form-control-sm total_Servicio_especial_" data-instruccionId="${instruccion.id}" id="total_Servicio_especial_${instruccion.id}" type="text" readonly value="${parseFloat(instruccion.total_servicios_especiales).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}">
                                                </div>
                                            </div>

                                            <div class="col-12 col-md-4">
                                                <div class="mb-2">
                                                    <label style="font-size: 12px;">Total Factura</label>
                                                    <input class="form-control form-control-sm" type="text" id='total_instruccion${instruccion.id}' readonly value="${parseFloat(instruccion.total_factura).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}">
                                                </div>
                                            </div>

                                            <div class="row">
                                                <style>
                                                    .archivo-adjunto {
                                                        display: flex;
                                                        align-items: center;
                                                        border: 1px solid #ccc;
                                                        border-radius: 6px;
                                                        padding: 6px 10px;
                                                        background-color: #f9f9f9;
                                                        box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
                                                        cursor: pointer;
                                                        max-width: 220px;
                                                        transition: background-color 0.2s ease;
                                                    }

                                                    .archivo-adjunto:hover {
                                                        background-color: #eaeaea;
                                                    }

                                                    .icono-archivo {
                                                        font-size: 22px;
                                                        margin-right: 8px;
                                                    }

                                                    .nombre-archivo {
                                                        white-space: nowrap;
                                                        overflow: hidden;
                                                        text-overflow: ellipsis;
                                                        font-size: 14px;
                                                    }
                                                </style>
                                                <h6>Adjuntos</h6>
                                                <div class="col-12 col-md-12 p-1">
                                                    <ul class="row flex-wrap gap-2" id="lista-archivos">
                                                        ${[...new Map(instruccion.remesas.filter(rem => rem.nombre_documento).map(rem => [rem.nombre_documento, rem])).values()] // <-- filtro extra
                            .map(rem => `
                                                                <div class="archivo-adjunto" title="${rem.nombre_documento}" onclick="abrir_fotos('${rem.ruta_documento}')">
                                                                    <div class="icono-archivo">${getFileIcon(rem.nombre_documento)}</div>
                                                                    <div class="nombre-archivo">${rem.nombre_documento}</div>
                                                                </div>
                                                        `).join('')}
                                                    </ul>
                                                </div>
                                            </div>
                                      
                                            <div class="col-12 col-md-6">
                                                <div class="mb-2">
                                                    <label style="font-size: 12px;">Archivo Instrucci&oacute;n;<span style="color:red;"><i>(*)</i></label>
                                                    <input class="form-control form-control-sm" type="file" id="fileInputExcel_${instruccion.id}" accept=".xlsx, .xls">
                                                </div>
                                            </div>

                                            <div class="col-12 col-md-6">
                                                <div class="mb-2">
                                                    <label style="font-size: 12px;">Soportes</label> 
                                                    <input class="form-control form-control-sm" type="file" id="archivo_${instruccion.id}" name="archivo" name="archivo[]" accept=".pdf, image/*" multiple>
                                                </div>
                                            </div>

                                            <div class="col-12 col-md-12 text-end">
                                                <div class="mb-2">
                                                    <button class="btn btn-primary btn-sm me-1 mb-1" type="button" id="btn_cargar_documento" data-instruccion-id="${instruccion.id}">Cargar documentos</button>
                                                </div>
                                            </div>
                                            
                                            <div class="col-12 col-md-12 p-1">
                                                <textarea class="form-control mt-1" id="descripcion_instruccion_sac_${instruccion.id}" oninput="this.value = this.value.toUpperCase();" style="height: 100px" readonly>${instruccion.observaciones.trim()}</textarea>
                                            </div>

                                            <div class="col-12 col-md-12 border-top border-translucent border-dashed pt-2 p-1">
                                            <h6> Respuesta Facturaci&oacute;n </h6>
                                                <textarea class="form-control mt-1" id="descripcion_instruccion_${instruccion.id}" oninput="this.value = this.value.toUpperCase();" readonly>${instruccion.Observacion_Respuesta}</textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    index++;
                }

                document.getElementById('List-acordeon').innerHTML = `
                    <div class="accordion" id="accordionExample">
                        ${html}
                    </div>
                `;

                document.querySelectorAll('.select-remesas').forEach(async select => {
                    const instruccionId = select.dataset.instruccionId;

                    let formData = new FormData();
                    formData.append('ClienteId', ClienteId);

                    try {
                        const response = await fetch($('#base_url').val() + 'serviciocliente/RemesasPorInstruccion', {
                            method: 'POST',
                            body: formData,
                        });

                        const remesas = await response.json();

                        select.innerHTML = ''; // Limpia opciones

                        if (remesas.length > 0) {
                            remesas.forEach(remesa => {
                                const option = document.createElement('option');
                                option.value = remesa.numdoc_remesa;
                                option.setAttribute('data-RemesaValor', remesa.Total_Remesa);
                                // option.textContent = `#${remesa.numdoc_remesa} - ${remesa.estado_facturacion}`;
                                option.textContent = `#${remesa.numdoc_remesa} - ${remesa.estado_facturacion} - ${parseFloat(remesa.Total_Remesa).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`;
                                select.appendChild(option);
                            });
                        } else {
                            select.innerHTML = '<option disabled>Sin remesas disponibles</option>';
                        }

                        // Inicializa Select2 después de llenar las opciones
                        $(select).select2({
                            placeholder: 'Selecciona remesas',
                            allowClear: true,
                            width: 'resolve'
                        });

                    } catch (error) {
                        console.error('Error cargando remesas:', error);
                        select.innerHTML = '<option disabled>Error al cargar</option>';
                    }
                });

                document.querySelectorAll('.chk_instruccion_remesa:not(:disabled)').forEach(checkbox => {
                    checkbox.addEventListener('change', async function () {
                        const remesaId = this.value;
                        const instruccionId = this.getAttribute('data-instruccion-id');
                        const isChecked = this.checked;

                        if (!isChecked) {
                            // Obtener el valor monetario de la remesa
                            const remesaValor = parseFloat(this.getAttribute('data-RemesaValor')) || 0;

                            // Referencias a los inputs
                            const totalInstruccionInput = document.querySelector(`#total_Instruccion_Facturacion${instruccionId}`);
                            const totalServiciosEspecialesInput = document.querySelector(`#total_Servicio_especial_${instruccionId}`);
                            const totalFacturaInput = document.querySelector(`#total_instruccion${instruccionId}`);

                            // Convertir a número los valores actuales
                            let totalInstruccionActual = parseFloat(limpiarNumero(totalInstruccionInput.value)) || 0;
                            let totalServiciosEspeciales = parseFloat(limpiarNumero(totalServiciosEspecialesInput.value)) || 0;

                            // Calcular nuevo total instrucción
                            let nuevoTotalInstruccion = totalInstruccionActual - remesaValor;
                            // if (nuevoTotalInstruccion < 0) nuevoTotalInstruccion = 0;

                            // Actualizar inputs visualmente
                            totalInstruccionInput.value = nuevoTotalInstruccion.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

                            // Calcular nuevo total factura
                            let nuevoTotalFactura = nuevoTotalInstruccion + totalServiciosEspeciales;
                            totalFacturaInput.value = nuevoTotalFactura.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

                            const result = await Swal.fire({
                                title: '¿Seguro?',
                                text: '¿Desea eliminar la remesa? ' + '#' + remesaId,
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
                                // Ahora se arma el formData y se envía la solicitud
                                const formData = new FormData();
                                formData.append('remesa_id', remesaId);
                                formData.append('instruccionId', instruccionId);
                                formData.append('total_Instruccion_Facturacion', document.querySelector(`#total_Instruccion_Facturacion${instruccionId}`).value);
                                formData.append('total_instruccion', document.querySelector(`#total_instruccion${instruccionId}`).value);

                                fetch($('#base_url').val() + 'serviciocliente/Eliminar_Remesa_Instruccion', {
                                    method: 'POST',
                                    body: formData,
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log('Respuesta del servidor:', data);

                                        Swal.fire({
                                            icon: data.success ? 'success' : 'error',
                                            title: data.success ? 'Remesa removida' : 'Error',
                                            text: data.mensaje,
                                            timer: 3000,
                                            showConfirmButton: false
                                        });
                                    })
                                    .catch(error => {
                                        console.error('Error en la petición:', error);

                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Error de red',
                                            text: 'No se pudo completar la solicitud.',
                                            timer: 3000,
                                            showConfirmButton: false
                                        });
                                    });
                            } else {
                                // ✅ Revertir checkbox si se canceló
                                this.checked = true;

                                // ✅ Restaurar los valores visuales previos
                                totalInstruccionInput.value = totalInstruccionActual.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
                                totalFacturaInput.value = (totalInstruccionActual + totalServiciosEspeciales).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
                            }

                        }
                    });
                });

            } catch (error) {
                console.error('Error en la primera solicitud:', error);
                console.log('error no inserta');
                throw error;
            } finally {
                // document.querySelector('.img_load').style.display = 'none';
                // if (loader) loader.style.display = 'none';
            }
            myOffcanvas.show();

            document.querySelector('#filtro_estado_instruccion').addEventListener('change', function (e) {
                const estadoSeleccionado = e.target.value;

                let htmlFiltrado = '';
                let index = 0;

                for (const id in instruccionesAgrupadas) {
                    const instruccion = instruccionesAgrupadas[id];

                    // Si no se seleccionó filtro o coincide el estado, incluir
                    if (!estadoSeleccionado || instruccion.estado === estadoSeleccionado) {
                        const collapseId = `collapse_${index}`;
                        let color = 'black';

                        switch (instruccion.estado) {
                            case 'Completada':
                                color = '#25b003';
                                break;
                            case 'Pendiente':
                                color = '#e5780b';
                                break;
                            case 'Pendiente Facturar':
                                color = '#0097eb';
                                break;
                            case 'Rechazada':
                                color = '#ec1f00';
                                break;
                        }

                        htmlFiltrado += `
                            <div class="accordion-item">
                                <h6 class="accordion-header d-flex align-items-center justify-content-between" id="heading_${index}">
                                    <div class="d-flex align-items-center w-100">
                                        <div class="form-check form-switch mt-2">
                                            <input class="form-check-input chk_instruccion collapsed" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}" type="checkbox" id="chk_instruccion${instruccion.id}" name="chk_instruccion[]" value="${instruccion.id}" data-idvalor="${instruccion.id}">
                                            <label class="form-check-label my-1" for="chk_instruccion${instruccion.id}"> Instrucción #${instruccion.id} - Estado: <span style="color: ${color}; font-weight: 600;">${instruccion.estado}</span> - 
                                            Comercial: ${instruccion.comercial_nombre} - Fecha Instrucción: ${instruccion.Fecha_Instrccion} -
                                            Num.Factura:  ${instruccion.remesas[0]?.estado_facturacion === 'Facturada' ? `<span class="text-dark"><a class='text-decoration-none' href='#' onclick="abrir_fotos('${instruccion.remesas[0]?.archivo}')">${instruccion.remesas[0]?.num_factura}</a></span>` : `<span class="text-danger">Pendiente</span>`}</label>
                                        </div>
                                    </div>
                                </h6>
                                <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="heading_${index}" data-bs-parent="#accordionExample">
                                    <div class="accordion-body pt-2">
                                        <div class="text-end border-bottom border-translucent border-dashed">
                                            <strong>Num.Factura:</strong>
                                            ${instruccion.remesas[0]?.estado_facturacion === 'Facturada' ? `<span class="text-success">${instruccion.remesas[0].num_factura}</span>` : `<span class="text-danger">Pendiente</span>`}
                                        </div>
                                        <ul class="list-group list-group-flush" id="list_remesas_${instruccion.id}">
                                            <!-- Remesas se cargarán al expandir -->
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        `;
                        index++;
                    }
                }

                document.getElementById('List-acordeon').innerHTML = `
                    <div class="accordion" id="accordionExample">
                        ${htmlFiltrado || `<div class="text-center text-muted">No hay instrucciones con ese estado.</div>`}
                    </div>`;
            });
        }

        if (e.target.matches(`#btn-edit-instruccion`) || e.target.matches(`#btn-edit-instruccion *`)) {
            let Boton = e.target.closest(`#btn-edit-instruccion`);
            const instruccionId = Boton.getAttribute('data-instruccion-id');
            document.getElementById(`form-agregar-remesas-${instruccionId}`).classList.remove('d-none');
            document.getElementById(`total_Servicio_especial_${instruccionId}`).removeAttribute('readonly');
            document.getElementById(`descripcion_instruccion_sac_${instruccionId}`).removeAttribute('readonly');
        }

        if (e.target.matches('#btn-buscar-remesas') || e.target.matches('#btn-buscar-remesas *')) {
            const boton = e.target.closest('#btn-buscar-remesas');
            const instruccionId = boton.dataset.instruccionId;

            // Buscar el <select> asociado por ID dinámico o clase con data
            const select = document.querySelector(`.select-remesas[data-instruccionId="${instruccionId}"]`);
            // const selectedOption = select.options[select.selectedIndex]; // Opción seleccionada
            // const dataId = selectedOption.getAttribute('data-RemesaValor'); // data-id del <option>
            const seleccionadas = $(select).val(); // Obtiene array de valores seleccionados

            const result = await Swal.fire({
                title: '¿Seguro?',
                text: '¿Desea Actualizar la instrucción?',
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
                let formData = new FormData();
                formData.append('total_Instruccion_Facturacion', document.getElementById(`total_Instruccion_Facturacion${instruccionId}`).value);
                formData.append('total_Servicio_especial', document.getElementById(`total_Servicio_especial_${instruccionId}`).value);
                formData.append('total_instruccion', document.getElementById(`total_instruccion${instruccionId}`).value);
                formData.append('descripcion_instruccion_sac', document.getElementById(`descripcion_instruccion_sac_${instruccionId}`).value);
                formData.append('instruccion_id', instruccionId);
                formData.append('remesas', JSON.stringify(seleccionadas));

                try {
                    const response = await fetch($('#base_url').val() + 'serviciocliente/AsociarMultiplesRemesas', {
                        method: 'POST',
                        body: formData
                    });

                    const result = await response.json();

                    if (result.success) {
                        Swal.fire('Guardado', 'Las remesas fueron asociadas correctamente', 'success');
                        window.location.reload(false);
                    } else {
                        Swal.fire('Error', result.message || 'No se pudo guardar', 'error');
                    }
                } catch (err) {
                    console.error(err);
                    Swal.fire('Error', 'Fallo en la conexión con el servidor', 'error');
                }
            }

        }

        //Ediatr los documentos de una instruccion de facturacion
        if (e.target.matches('#btn_cargar_documento') || e.target.matches('#btn_cargar_documento *')) {
            const boton = e.target.closest('#btn_cargar_documento');
            const instruccionId = boton.getAttribute('data-instruccion-id');

            const fileInput = document.getElementById(`fileInputExcel_${instruccionId}`);
            const inputArchivos = document.getElementById(`archivo_${instruccionId}`);

            if (!fileInput || !inputArchivos) {
                console.error('Inputs no encontrados');
                return;
            }

            const excelFile = fileInput.files[0];
            const soporteFiles = inputArchivos.files;

            if (!excelFile && soporteFiles.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Advertencia',
                    text: 'Debes seleccionar al menos un archivo.',
                });
                return;
            }

            let formdata = new FormData();
            formdata.append('instruccionId', instruccionId);
            if (excelFile) {
                formdata.append('excel', excelFile);
            }
            for (let i = 0; i < soporteFiles.length; i++) {
                formdata.append('archivo[]', soporteFiles[i]);
            }

            try {
                const response = await fetch($('#base_url').val() + 'serviciocliente/Actualizar_Documentos_Instruccion_Facturacion', {
                    method: 'POST',
                    body: formdata,
                });

                const data = await response.json();

                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: data.message,
                    });
                    myOffcanvas.hide();
                    Listar_Historico_Instrucciones_Facturacion();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message,
                    });
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error del servidor',
                    text: 'No se pudo completar la operación.',
                });
            }
        }

        //Anular instrcciones de faturacion
        if (e.target.matches(`#btn-annular-instruccion`) || e.target.matches(`#btn-annular-instruccion *`)) {
            let Boton = e.target.closest(`#btn-annular-instruccion`);
            let InstruccionId = Boton.getAttribute(`data-instruccion_id`);
            let Nombre_instruccion = Boton.getAttribute(`data-cliente`);
            document.getElementById(`instruccion`).value = InstruccionId + '-' + Nombre_instruccion;
            document.getElementById(`instruccion_Id`).value = InstruccionId;
            // console.log("🚀 ~ InstruccionId:", InstruccionId)
        }

        if (e.target.matches(`#btn_anular_instruccion`) || e.target.matches(`#btn_anular_instruccion *`)) {
            let Boton = e.target.closest(`#btn_anular_instruccion`);
            let motivo = document.getElementById(`motivo_anulacion`).value;
            let instruccion_Id = document.getElementById(`instruccion_Id`).value;
            let evidencia = document.getElementById(`evidencia`).files[0];
            let observacion = document.getElementById(`observacion`).value;

            if (motivo === '') {
                Swal.fire({
                    icon: "warning",
                    title: "Debe seleccionar un motivo de anulación.",
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    document.getElementById('motivo_anulacion').focus();
                });
                return;
            }

            // ⚠️ Confirmación antes de enviar
            Swal.fire({
                title: "¿Está seguro?",
                text: "Esta acción anulará la instrucción y no se podrá revertir.",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, anular",
                cancelButtonText: "Cancelar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let datos = new FormData();
                    datos.append('instruccion_Id', instruccion_Id);
                    datos.append('evidencia', evidencia);
                    datos.append('observacion', observacion);
                    datos.append('motivo', motivo);
                    datos.append('estado', 'Pendiente Anulacion Factura');
                    datos.append('aprobacion', 'No');

                    try {
                        const response = await fetch($('#base_url').val() + 'serviciocliente/Insertar_Solicitud_Anulacion', {
                            method: 'POST',
                            body: datos,
                            cache: 'no-cache',
                        });

                        const data = await response.json();

                        if (data.status === "ok") {
                            Swal.fire({
                                icon: "success",
                                title: "Solicitud enviada",
                                text: data.message || "La anulación fue procesada correctamente.",
                                confirmButtonText: "Aceptar"
                            }).then(() => {
                                $('#verticallyCentered').modal('hide');
                            });
                        } else {
                            Swal.fire({
                                icon: "warning",
                                title: "Atención",
                                text: data.message || "No se pudo procesar la solicitud.",
                                confirmButtonText: "Revisar"
                            });
                        }
                    } catch (error) {
                        console.error('Error en la solicitud:', error);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Ocurrió un problema al enviar la solicitud. Intente nuevamente.",
                            confirmButtonText: "Cerrar"
                        });
                    }
                }
            });
        }

        if (e.target.matches(`#btn_cancelar_anulacion`) || e.target.matches(`#btn_cancelar_anulacion *`)) {
            // Reiniciar los campos
            document.getElementById('instruccion').value = '';
            document.getElementById('instruccion_Id').value = '';
            document.getElementById('motivo_anulacion').value = '';
            document.getElementById('evidencia').value = '';
            document.getElementById('observacion').value = '';
        }

    });

    // Escuchar cuando el modal se cierra
    $('#verticallyCentered').on('hidden.bs.modal', function () {
        // Reiniciar todos los campos
        document.getElementById('instruccion').value = '';
        document.getElementById('instruccion_Id').value = '';
        document.getElementById('motivo_anulacion').value = '';
        document.getElementById('evidencia').value = '';
        document.getElementById('observacion').value = '';
    });

    document.addEventListener('change', async e => {
        if (e.target.matches(`.total_Servicio_especial_`)) {
            // const instruccionId = e.target.dataset.instruccionId;
            let Boton = e.target.closest(`.total_Servicio_especial_`);
            const instruccionId = Boton.getAttribute('data-instruccionId');
            const valor = limpiarNumero(e.target.value || '0');

            document.getElementById(`total_Servicio_especial_${instruccionId}`).value = formatCOP(valor);

            let TotalInstruccion = limpiarNumero(document.getElementById(`total_Instruccion_Facturacion${instruccionId}`).value || '0');
            let TotalServicioEspecial = valor;

            let TotalFacturacion = TotalInstruccion + TotalServicioEspecial;
            document.getElementById(`total_instruccion${instruccionId}`).value = formatCOP(TotalFacturacion);
        }
    });

    $(document).on('change', '.select-remesas', function () {
        const $select = $(this);
        const instruccionId = $select.data('instruccionid');

        const $inputTotalRemesas = $(`input[data-instruccion-id="${instruccionId}"].total-instruccion`);
        const $inputTotalInstruccion = $(`#total_instruccion${instruccionId}`);
        const $inputTotalServicioEspecial = $(`#total_Servicio_especial_${instruccionId}`);

        // Obtener valores anteriores del select (guardados en data)
        let remesasPrevias = $select.data('remesasPrevias') || [];

        // Obtener nuevas remesas seleccionadas (array de values)
        const remesasSeleccionadas = $select.val() || [];

        // Calcular diferencia: agregadas y eliminadas
        const agregadas = remesasSeleccionadas.filter(val => !remesasPrevias.includes(val));
        const eliminadas = remesasPrevias.filter(val => !remesasSeleccionadas.includes(val));

        // Inicializar cambio total
        let cambioTotal = 0;

        // Sumar valores agregados
        agregadas.forEach(value => {
            const $opt = $select.find(`option[value="${value}"]`);
            const val = parseFloat($opt.data('remesavalor')) || 0;
            cambioTotal += val;
        });

        // Restar valores eliminados
        eliminadas.forEach(value => {
            const $opt = $select.find(`option[value="${value}"]`);
            const val = parseFloat($opt.data('remesavalor')) || 0;
            cambioTotal -= val;
        });

        // Actualizar input total remesas
        const totalRemesasActual = limpiarNumero($inputTotalRemesas.val());
        const nuevoTotalRemesas = totalRemesasActual + cambioTotal;
        $inputTotalRemesas.val(formatCOP(nuevoTotalRemesas));

        // Sumar al valor del servicio especial
        const valorBase = limpiarNumero($inputTotalServicioEspecial.val());
        const totalInstruccion = valorBase + nuevoTotalRemesas;
        $inputTotalInstruccion.val(formatCOP(totalInstruccion));

        // Guardar nueva selección para la próxima vez
        $select.data('remesasPrevias', remesasSeleccionadas);
    });

}

async function Listar_Historico_Instrucciones_Facturacion() {
    const loader = document.querySelector('.img_load');
    if (loader) loader.style.display = 'table-row';
    let tbody = document.getElementById('tbody_historico_instrcciones_facturacion');
    tbody.innerHTML = '';
    try {
        const response = await fetch($('#base_url').val() + 'serviciocliente/Listar_Historico_Instrucciones', {
            method: 'POST',
            // body: formdata,
            cache: 'no-cache',
        });
        const data = await response.json();
        // let filtro = document.getElementById(`campo-${window.VENTANA}-filtro`).value;
        let totalInstrucciones = 0;
        let totalInstruccionesValor = 0;
        if (data) {

            data.forEach((element, index) => {
                const fila = document.createElement('tr');
                const columnaIndiceCliente = document.createElement('td');
                columnaIndiceCliente.innerHTML = index + 1;
                columnaIndiceCliente.style.width = 'auto';
                columnaIndiceCliente.style.whiteSpace = 'nowrap';
                columnaIndiceCliente.style.textAlign = 'center';

                const columnaDocumentoCliente = document.createElement('td');
                columnaDocumentoCliente.innerHTML = `<a class='text-decoration-none' href='#' id='btn-instrucciones-cliente' data-ClienteId='${element.cliente_id}' data-Cliente='${element.cliente_nombre}'>${element.documento_cliente}</a>`;
                columnaDocumentoCliente.style.width = 'auto';
                columnaDocumentoCliente.style.whiteSpace = 'nowrap';
                columnaDocumentoCliente.style.textAlign = 'center';

                const columnaNombreCliente = document.createElement('td');
                columnaNombreCliente.innerHTML = element.cliente_nombre;
                columnaNombreCliente.style.width = 'auto';
                columnaNombreCliente.style.whiteSpace = 'nowrap';
                columnaNombreCliente.style.textAlign = 'center';

                const columnaInstruccionesCliente = document.createElement('td');
                // const totalInstruccionesFacturacion = Number(element.total_instrucciones); // convierte string decimal a número
                const totalInstruccionesFacturacion = element.total_instrucciones; // convierte string decimal a número
                columnaInstruccionesCliente.innerHTML = totalInstruccionesFacturacion;
                columnaInstruccionesCliente.classList.add('text-center', 'text-nowrap');

                const columnaTotalValorInstruccionesCliente = document.createElement('td');
                const totalFacturacionInstruccion = Number(element.total_facturacion);
                columnaTotalValorInstruccionesCliente.innerHTML = totalFacturacionInstruccion.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                });
                columnaTotalValorInstruccionesCliente.classList.add('text-center', 'text-nowrap');

                // Acumular tottotalInstruccionesal
                totalInstrucciones += Number(element.total_instrucciones) || 0;
                totalInstruccionesValor += Number(element.total_facturacion) || 0;

                fila.appendChild(columnaIndiceCliente);
                fila.appendChild(columnaDocumentoCliente);
                fila.appendChild(columnaNombreCliente);
                fila.appendChild(columnaInstruccionesCliente);
                fila.appendChild(columnaTotalValorInstruccionesCliente);
                tbody.appendChild(fila);
            });
            // Asignar el total acumulado al final
            // document.getElementById('numero_instrucciones').innerHTML = totalInstrucciones;
            // document.getElementById('total_instrucciones').innerHTML = totalInstruccionesValor.toLocaleString('es-CO', {
            //     style: 'currency',
            //     currency: 'COP',
            // });
        }

    } catch (error) {
        console.error('Error en la primera solicitud:', error);
        console.log('error no inserta');
        throw error;
    } finally {
        // document.querySelector('.img_load').style.display = 'none';
        if (loader) loader.style.display = 'none';
    }
}

// function abrir_fotos(url, name) {
function abrir_fotos(url) {
    // URL de la página que deseas abrir en la nueva ventana
    var url = $('#base_url').val() + url;
    // Opciones de la ventana emergente (ancho, alto, opciones adicionales)
    var ventanaAncho = 1000;
    var ventanaAlto = 1000;
    // Calcula las coordenadas para centrar la ventana
    var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
    var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
    // Opciones de la ventana emergente (ancho, alto, posición)
    var opcionesVentana = 'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
    // Utiliza window.open para abrir la nueva ventana
    window.open(url, name, opcionesVentana);
}

// Formatea en COP
window.formatCOP = (value) => {
    return value.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP'
    });
};

function limpiarNumero(valor) {
    return parseFloat(
        valor
            .replace(/\$/g, '')     // Eliminar símbolo $
            .replace(/\./g, '')     // Eliminar puntos de miles
            .replace(',', '.')      // Cambiar coma por punto decimal
    ) || 0;
}

function getFileIcon(nombre) {
    if (!nombre || typeof nombre !== 'string') return '📎';
    const ext = nombre.split('.').pop().toLowerCase();

    switch (ext) {
        case 'pdf': return '📄';
        case 'xlsx':
        case 'xls': return '📊';
        case 'doc':
        case 'docx': return '📝';
        case 'jpg':
        case 'jpeg':
        case 'png': return '🖼️';
        default: return '📎';
    }
}