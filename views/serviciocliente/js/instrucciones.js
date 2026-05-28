window.VENTANA = null; // Variable global para almacenar el ID

// sessionStorage.clear();
// Definir la función initScript globalmente
window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global
    Listar_Instrucciones_Facturacion();

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

    document.addEventListener('change', async e => {
        if (e.target.matches(`#estado_instruccion`) || e.target.matches(`#estado_instruccion *`)) {
            let estadoSeleccionado = e.target.value;
            let NumdocFactura = document.getElementById('numero_factura');
            let TotalFactura = document.getElementById('total_factura');
            let DocumentoFactura = document.getElementById('documento_factura');

            if (estadoSeleccionado === 'Rechazada' || estadoSeleccionado === 'Cancelada') {
                NumdocFactura.required = false;
                NumdocFactura.disabled = true;
                TotalFactura.required = false;
                TotalFactura.disabled = true;
                DocumentoFactura.required = false;
                DocumentoFactura.disabled = true;
            } else if (estadoSeleccionado === 'Facturada') {
                NumdocFactura.disabled = false;
                NumdocFactura.required = true;
                TotalFactura.disabled = false;
                TotalFactura.required = true;
                DocumentoFactura.disabled = false;
                DocumentoFactura.required = true;
            } else if (estadoSeleccionado === 'Pendiente Facturar') {
                NumdocFactura.disabled = true;
                NumdocFactura.required = false;
                TotalFactura.disabled = true;
                TotalFactura.required = false;
                DocumentoFactura.disabled = true;
                DocumentoFactura.required = false;
            }
        }

        if (e.target.classList.contains(`chk_instruccion_remesa`) || e.target.classList.contains(`chk_instruccion_remesa *`)) {
            // Selecciona todos los checkboxes con ese name que están marcados
            const seleccionados = [];
            document.querySelectorAll('.chk_instruccion_remesa:checked').forEach(chk => {
                seleccionados.push(chk.value);
            });

            // Actualizar el total de las remesas seleccionadas
            let totalRemesasSeleccionadas = 0;
            document.querySelectorAll('.chk_instruccion_remesa:checked').forEach(chk => {
                const valorRemesa = parseFloat(chk.getAttribute('data-RemesaValor'));
                if (!isNaN(valorRemesa)) {
                    totalRemesasSeleccionadas += valorRemesa;
                }
            });

            // Mostrar el total en la interfaz
            document.getElementById('total_factura').value = totalRemesasSeleccionadas.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
        }
    });

    document.addEventListener('click', async e => {
        if (e.target.matches(`#btn-instrucciones-cliente`) || e.target.matches(`#btn-instrucciones-cliente *`)) {
            let instruccionesAgrupadas = {}; // 💡 Mueve esta línea aquí
            let Boton = e.target.closest(`#btn-instrucciones-cliente`);
            let Cliente = Boton.getAttribute('data-Cliente');
            let ClienteId = Boton.getAttribute('data-ClienteId');
            let perfil_id = document.getElementById('perfil_id').value;
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

                        <div class="col-12 col-md-6 p-1">
                            <div class="mb-1">
                                <label style="font-size: 12px;">Estado Instrucci&oacute;n&nbsp;<span style="color:red;"><i>(*)</i></label>
                                <select name="estado_instruccion" id="estado_instruccion" class="form-select form-select-sm">
                                    <option value="">-Seleccione-</option>
                                    <option value="Facturada">Facturada</option>
                                    <option value="Pendiente Facturar">Pendiente Facturar</option>
                                    <option value="Rechazada">Rechazada</option>
                                    <!--<option value="Cancelada">Cancelada</option>-->
                                </select>
                            </div>
                        </div>

                        <div class="col-12 col-md-6 p-1">
                            <div class="mb-1">
                                <label style="font-size: 12px;">Numero Factura&oacute;n&nbsp;<span style="color:red;"><i>(*)</i></label>
                                <input class="form-control form-control-sm" id="numero_factura" type="text">
                            </div>
                        </div>

                        <div class="col-12 col-md-6 p-1">
                            <div class="mb-1">
                                <label style="font-size: 12px;">Total Factura&oacute;n&nbsp;<span style="color:red;"><i>(*)</i></label>
                                <input class="form-control form-control-sm" id="total_factura" type="text">
                            </div>
                        </div>

                        <div class="col-12 col-md-6 p-1">
                            <div class="mb-1">
                                <label style="font-size: 12px;">Documento&nbsp;<span style="color:red;"><i>(*)</i></label>
                                <input class="form-control form-control-sm" id="documento_factura" type="file" accept="application/pdf">
                            </div>
                        </div>

                        <div class="col-12 col-md-62 p-1">
                            <div class="mb-1">
                                <label style="font-size: 12px;">Observaciones Instrucci&oacute;n&nbsp;<span style="color:red;"><i>(*)</i></label>
                                <textarea class="form-control" id="descripcion_factura" oninput="this.value = this.value.toUpperCase();" style="height: 100px"></textarea>
                            </div>
                        </div>

                        <div class="border-top border-translucent border-dashed pt-2">
                            <div class="row justify-content-end">
                                <div class="col-auto">
                                    <button class="btn btn-success btn-sm py-1" id="btn_guardar_instruccion" type="button" data-ClienteId='${ClienteId}' data-Objeto='proveedor'> 
                                        <span class="uil uil-save"></span> Guardar Facturaci&oacute;n
                                    </button>
                                </div>
                                <!-- ✅ NUEVO BOTÓN 
                                <div class="col-auto">
                                    <button class="btn btn-primary btn-sm py-1" id="btn_exportar_excel" type="button" data-cliente="${Cliente}">
                                        <span class="uil uil-file-download"></span> Exportar a Excel
                                    </button>
                                </div>-->
                            </div>
                        </div>
                    </div>
                </div>
            `);

            //Listar las instrucciones de facturacion del cliente
            let formdata = new FormData();
            formdata.append('ClienteId', ClienteId);
            try {
                const response = await fetch($('#base_url').val() + 'serviciocliente/Detalle_Instrucciones_Facturacion_Cliente', {
                    method: 'POST',
                    body: formdata,
                    cache: 'no-cache',
                });
                const data = await response.json();

                // let instruccionesAgrupadas = {};

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
                            ruta_documento: row.ruta_documento,
                            nombre_documento: row.nombre_documento,
                            origen_ajuste: row.origen_ajuste,
                            destino_ajuste: row.destino_ajuste,
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
                        default:
                            color = 'black';
                    }

                    html += `
                            <div class="accordion-item">
                                <h6 class="accordion-header d-flex align-items-center justify-content-between" id="heading_${index}">

                                    <div class="d-flex align-items-center w-80">
                                        <div class="form-check form-switch mt-2">
                                            <input class="form-check-input chk_instruccion collapsed" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}" type="checkbox" id="chk_instruccion${instruccion.id}" name="chk_instruccion[]" value="${instruccion.id}" data-idvalor="${instruccion.id}">
                                              <label class="form-check-label my-1" for="chk_instruccion${instruccion.id}"> Instrucción #${instruccion.id} - Estado: <span style="color: ${color}; font-weight: 600;">${instruccion.estado}</span> - Comercial: ${instruccion.comercial_nombre} - Fecha Instrucción: ${instruccion.Fecha_Instrccion}</label>
                                        </div>
                                    </div>

                                    <div class="btn-group btn-group-sm mt-2 ms-3" role="group" aria-label="Acciones">
                                        <!--<button class="btn btn-subtle-warning btn-sm me-1 px-1 py-0" type="button">Left</button>-->
                                        <!-- Botón exportar Excel — siempre visible por instrucción -->
                                        <button class="btn btn-subtle-success btn-sm me-1 px-1 py-0 btn-exportar-instruccion" 
                                                type="button" 
                                                data-instruccion_id="${instruccion.id}">
                                            <span class="uil uil-file-download"></span> Exportar Excel
                                        </button>
                                        ${instruccion.estado === 'Pendiente' || instruccion.estado === 'Rechazada' ?
                            `<button class="btn btn-subtle-danger btn-sm me-1 px-1 py-0" type="button" data-instruccion_id="${instruccion.id}" data-cliente="${instruccion.nombre}" id="btn-annular-instruccion-instrucciones"  data-bs-toggle="modal" data-bs-target="#ModalSolicitudAnulacion">
                                                <span class="uil uil-file-block-alt" data-fa-transform="shrink-3"></span>  Anular Instrucción
                                         </button>`
                            : ``}
                                    </div>

                                </h6>
                                <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="heading_${index}" data-bs-parent="#accordionExample">
                                    <div class="accordion-body pt-2">
                                        <!-- Número de factura alineado a la derecha -->
                                        <div class="text-end border-bottom border-translucent border-dashed">
                                            <strong>Num.Factura:</strong>
                                            ${instruccion.remesas[0]?.estado_facturacion === 'Facturada' ? `<span class="text-success">${instruccion.remesas[0].num_factura}</span>` : `<span class="text-danger">Pendiente</span>`}
                                        </div>
                                        <ul class="list-group list-group-flush" id="list_remesas_${instruccion.id}">
                                            <!-- Remesas se insertarán dinámicamente aquí al abrir el acordeón -->
                                        </ul>
                                        <div class="row mb-2"> 
                                            <div class="col-12 col-md-12">
                                                <div class="mb-2">
                                                    <label style="font-size: 12px;">Nombre Instrucci&oacute;n&nbsp;<span style="color:red;"><i>(*)</i></label>
                                                    <input class="form-control form-control-sm" type="text" oninput="this.value = this.value.toUpperCase();" value="${instruccion.nombre.trim()}" disabled>
                                                </div>
                                            </div>

                                            <div class="col-12 col-md-4">
                                                <div class="mb-2">
                                                    <label style="font-size: 12px;">Total Instrucci&oacute;n</label>
                                                    <input class="form-control form-control-sm" type="text" disabled value="${parseFloat(instruccion.total_instruccion).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}">
                                                </div>
                                            </div>

                                            <div class="col-12 col-md-4">
                                                <div class="mb-2">
                                                    <label style="font-size: 12px;">Total Servicios Especiales</label>
                                                    <input class="form-control form-control-sm"  type="text" disabled value="${parseFloat(instruccion.total_servicios_especiales).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}">
                                                </div>
                                            </div>

                                            <div class="col-12 col-md-4">
                                                <div class="mb-2">
                                                    <label style="font-size: 12px;">Total Factura</label>
                                                    <input class="form-control form-control-sm" id="total_factura_instruccion" type="text" disabled value="${parseFloat(instruccion.total_factura).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}">
                                                </div>
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
                                                                <!--<li class="list-group-item d-flex justify-content-between align-items-center">
                                                                    <a class="text-decoration-none" href="#" onclick="abrir_fotos('${rem.ruta_documento}')">
                                                                        📎   ${getFileIcon(rem.nombre_documento)} ${rem.nombre_documento}
                                                                    </a>
                                                                </li>
                                                                <div class="archivo-adjunto" title="${rem.nombre_documento}" onclick="mostrarExcel('${$('#base_url').val() + rem.ruta_documento}', '${rem.nombre_documento}')">-->
                                                                <div class="archivo-adjunto" title="${rem.nombre_documento}" onclick="abrir_fotos('${rem.ruta_documento}')">
                                                                    <div class="icono-archivo">${getFileIcon(rem.nombre_documento)}</div>
                                                                    <div class="nombre-archivo">${rem.nombre_documento}</div>
                                                                </div>
                                                        `).join('')}
                                                    </ul>
                                                </div>
                                            </div>
                                        <textarea class="form-control mt-1" id="descripcion_instruccion_${instruccion.id}" oninput="this.value = this.value.toUpperCase();" style="height: 100px" disabled>${instruccion.observaciones.trim()}</textarea>
                                    </div>
                                </div>
                            </div>
                        `;
                    index++;
                }

                document.addEventListener('show.bs.collapse', async function (e) {
                    const accordionBody = e.target;
                    const accordionItem = accordionBody.closest('.accordion-item');
                    const chkInput = accordionItem.querySelector('.chk_instruccion');
                    const instruccionId = chkInput.dataset.idvalor;

                    // Evita recarga si ya se cargó
                    if (accordionBody.dataset.loaded === 'true') return;

                    // Crear FormData
                    let formRemesas = new FormData();
                    formRemesas.append('instruccion_id', instruccionId);

                    try {
                        const response = await fetch($('#base_url').val() + 'serviciocliente/Detalle_Instrucciones_Facturacion_Remesas_Cliente', {
                            method: 'POST',
                            body: formRemesas,
                            cache: 'no-cache',
                        });

                        const remesas = await response.json();

                        // Buscar o crear el <ul>
                        let ul = accordionBody.querySelector('ul.list-group');
                        if (!ul) {
                            ul = document.createElement('ul');
                            ul.classList.add('list-group', 'list-group-flush');
                            ul.id = `list_remesas_${instruccionId}`;
                            accordionBody.querySelector('.accordion-body').appendChild(ul);
                        }

                        // Calcular total
                        // const totalInstruccion = remesas.reduce((acc, r) => acc + parseFloat(r.Total_Remesa), 0);
                        const totalInstruccion = remesas.reduce((acc, r) => acc + parseFloat(rem.Total_Remesa ? rem.Total_Remesa : TotalRemesa), 0);
                        const TotalRemesa = rem.valor_tarifa;

                        // Renderizar remesas
                        ul.innerHTML = remesas.map(rem => `
                                <li class="list-group-item d-flex justify-content-between align-items-center" style="font-size:13px;">
                                    <div class="form-check form-switch mt-2">
                                        <input class="form-check-input me-2 chk_instruccion_remesa" type="checkbox" id="chk_instruccion_remesa_${rem.remesa_id}" name="chk_instruccion_remesa[]" 
                                        value="${rem.remesa_id}" data-RemesaValor="${rem.Total_Remesa}" data-instruccion-id="${instruccionId}" ${rem.estado_facturacion === 'Facturada' ? 'checked disabled' : ''}>
                                        <strong>Remesa:</strong> ${rem.remesa_id} 
                                        <strong>Manifiesto:</strong> ${rem.Manifiesto} 
                                        <strong>Ruta:</strong> ${!rem.origen_ajuste ? rem.Origen : rem.origen_ajuste} - ${!rem.destino_ajuste ? rem.Destino : rem.destino_ajuste}
                                    </div>
                                    <span><strong>Total:</strong> ${parseFloat(rem.Total_Remesa ? rem.Total_Remesa : TotalRemesa).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                                </li>
                                `).join('') + `
                                <li class="list-group-item d-flex justify-content-between">
                                    <span><strong>Total Instrucción:</strong></span>
                                    <span class="text-success">${totalInstruccion.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                                </li>
                        `;

                        // ✅ Marcar remesas si ya estaba check la instrucción
                        if (chkInput.checked) {
                            ul.querySelectorAll('.chk_instruccion_remesa').forEach(remesaCheckbox => {
                                remesaCheckbox.checked = true;
                                remesaCheckbox.disabled = true;
                            });
                        }

                        accordionBody.dataset.loaded = 'true';

                    } catch (error) {
                        console.error('Error cargando remesas de la instrucción:', error);
                    }
                });


                document.getElementById('List-acordeon').innerHTML = `
                    <div class="accordion" id="accordionExample">
                        ${html}
                    </div>
                `;

                document.querySelectorAll('.chk_instruccion').forEach(checkbox => {
                    checkbox.addEventListener('change', function () {
                        const instruccionId = this.getAttribute('data-idvalor');
                        const isChecked = this.checked;
                        document.querySelectorAll(`.chk_instruccion_remesa[data-instruccion-id="${instruccionId}"]`)
                            .forEach(remesaCheckbox => {
                                remesaCheckbox.checked = isChecked;

                                if (isChecked) {
                                    // ✅ Deshabilitar si está check
                                    setTimeout(() => {
                                        remesaCheckbox.disabled = true;
                                    }, 10);
                                } else {
                                    // ❌ Volver a habilitar y limpiar si está uncheck
                                    remesaCheckbox.disabled = false;
                                }
                            });
                    });
                });

                document.getElementById('List-acordeon').addEventListener('click', function (e) {
                    const btn = e.target.closest('.btn-exportar-instruccion');
                    if (!btn) return;

                    const instruccionId = btn.getAttribute('data-instruccion_id');
                    const instruccion = instruccionesAgrupadas[instruccionId];
                    if (!instruccion) return;

                    exportarInstruccionIndividualExcel(instruccion);
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
                                  <label class="form-check-label my-1" for="chk_instruccion${instruccion.id}"> Instrucción #${instruccion.id} - Estado: <span style="color: ${color}; font-weight: 600;">${instruccion.estado}</span> - Comercial: ${instruccion.comercial_nombre} - Fecha Instrucción: ${instruccion.Fecha_Instrccion}</label>
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

            // ✅ Listener del botón exportar
            // document.getElementById('btn_exportar_excel').addEventListener('click', function () {
            //     const cliente = this.getAttribute('data-cliente');
            //     exportarInstruccionesExcel(instruccionesAgrupadas, cliente);
            // });
        }

        if (e.target.matches(`#btn_guardar_instruccion`) || e.target.matches(`#btn_guardar_instruccion *`)) {
            // 1. Obtener la instrucción seleccionada
            const chkSeleccionados = document.querySelectorAll('.chk_instruccion:checked');
            if (chkSeleccionados.length === 0) {
                Swal.fire('Atención', 'Debe seleccionar una instrucción para facturar.', 'warning');
                return;
            }

            if (chkSeleccionados.length > 1) {
                Swal.fire('Atención', 'Solo puede facturar una instrucción a la vez.', 'warning');
                return;
            }

            const instruccionId = chkSeleccionados[0].value;

            // 2. Obtener remesas marcadas de esa instrucción
            const remesas = Array.from(
                document.querySelectorAll(`.chk_instruccion_remesa[data-instruccion-id="${instruccionId}"]:checked`)
            ).map(remesaChk => remesaChk.value);

            if (remesas.length === 0) {
                Swal.fire('Atención', 'Debe seleccionar al menos una remesa asociada a la instrucción.', 'warning');
                return;
            }

            // 3. Obtener datos del formulario
            const estado_instruccion = document.getElementById('estado_instruccion').value;
            const numero_factura = document.getElementById('numero_factura').value.trim();
            const total_factura = document.getElementById('total_factura').value.trim();
            const total_factura_instruccion = document.getElementById('total_factura_instruccion').value.trim();
            const descripcion_factura = document.getElementById('descripcion_factura').value.trim();

            const inputArchivo = document.getElementById('documento_factura');
            const archivo = inputArchivo.files[0];

            // 4. Validaciones de campos
            if (estado_instruccion === 'Pendiente Facturar' || estado_instruccion === 'Rechazada') {
                if (!descripcion_factura) {
                    Swal.fire('Campos obligatorios', 'Debe completar todos los campos requeridos antes de guardar.', 'warning');
                    return;
                }
            } else {
                if (!estado_instruccion || !numero_factura || !total_factura || !descripcion_factura) {
                    Swal.fire('Campos obligatorios', 'Debe completar todos los campos requeridos antes de guardar.', 'warning');
                    return;
                }
                if (!archivo) {
                    Swal.fire('Archivo requerido', 'Debe seleccionar un archivo PDF para subir.', 'warning');
                    return;
                }

                if (archivo.type !== 'application/pdf') {
                    Swal.fire('Tipo de archivo inválido', 'Solo se permite subir archivos en formato PDF.', 'error');
                    return;
                }
            }

            // 5. Confirmación
            const result = await Swal.fire({
                title: '¿Seguro?',
                text: '¿Desea registrar la factura para esta instrucción?',
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
                    // 6. Armar estructura por instrucción
                    const asociaciones = [{
                        instruccion_id: instruccionId,
                        remesas: remesas,
                        estado: estado_instruccion,
                        numero_factura: numero_factura,
                        total_factura: total_factura,
                        total_factura_instruccion: total_factura_instruccion,
                        descripcion_factura: descripcion_factura
                    }];

                    const formdata = new FormData();
                    formdata.append('asociaciones', JSON.stringify(asociaciones));
                    formdata.append('archivo', archivo);

                    const response = await fetch($('#base_url').val() + 'serviciocliente/Insertar_Trazabilidad_Instruccion', {
                        method: 'POST',
                        body: formdata,
                        cache: 'no-cache',
                    });

                    const data = await response.json();

                    if (data.success === true) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Éxito!',
                            text: data.message,
                            confirmButtonColor: '#3085d6'
                        });
                        myOffcanvas.hide();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.message,
                            confirmButtonColor: '#d33'
                        });
                    }
                } catch (error) {
                    console.error('Error en la solicitud:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error del servidor',
                        text: 'No se pudo completar la operación.',
                        confirmButtonColor: '#d33'
                    });
                }
            }
        }

        //Anular instrcciones de faturacion
        if (e.target.matches(`#btn-annular-instruccion-instrucciones`) || e.target.matches(`#btn-annular-instruccion-instrucciones *`)) {
            let Boton = e.target.closest(`#btn-annular-instruccion-instrucciones`);
            let InstruccionId = Boton.getAttribute(`data-instruccion_id`);
            let Nombre_instruccion = Boton.getAttribute(`data-cliente`);
            document.getElementById(`instruccion_solicitud`).value = InstruccionId + '-' + Nombre_instruccion;
            document.getElementById(`instruccion_Id_solicitud`).value = InstruccionId;
            // console.log("🚀 ~ InstruccionId:", InstruccionId)
        }

        if (e.target.matches(`#btn_anular_instruccion_instrucciones`) || e.target.matches(`#btn_anular_instruccion_instrucciones *`)) {
            let Boton = e.target.closest(`#btn_anular_instruccion_instrucciones`);
            let motivo = document.getElementById(`motivo_anulacion_solicitud`).value;
            let instruccion_Id = document.getElementById(`instruccion_Id_solicitud`).value;
            let evidencia = document.getElementById(`evidencia_solicitud`).files[0];
            let observacion = document.getElementById(`observacion_solicitud`).value;

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
                    datos.append('estado', 'Pendiente Anulacion Instruccion');
                    datos.append('aprobacion', 'No Aplica');

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
                                $('#ModalSolicitudAnulacion').modal('hide');
                                let offcanvasEl = document.getElementById(`customOffcanvas${window.VENTANA}`);
                                let offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
                                offcanvas.hide();
                                Listar_Instrucciones_Facturacion();
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

        if (e.target.matches(`#btn_cancelar_anulacion_instruccion`) || e.target.matches(`#btn_cancelar_anulacion_instruccion *`)) {
            // Reiniciar los campos
            document.getElementById('instruccion_solicitud').value = '';
            document.getElementById('instruccion_Id_solicitud').value = '';
            document.getElementById('motivo_anulacion_solicitud').value = '';
            document.getElementById('evidencia_solicitud').value = '';
            document.getElementById('observacion_solicitud').value = '';
        }
    });
}

async function Listar_Instrucciones_Facturacion() {
    const loader = document.querySelector('.img_load');
    if (loader) loader.style.display = 'table-row';
    let tbody = document.getElementById('tbody_instrcciones_facturacion');
    tbody.innerHTML = '';
    try {
        const response = await fetch($('#base_url').val() + 'serviciocliente/Listar_Instrucciones', {
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
            document.getElementById('numero_instrucciones').innerHTML = totalInstrucciones;
            document.getElementById('total_instrucciones').innerHTML = totalInstruccionesValor.toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP',
            });
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

function escapeTextareaContent(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\n/g, "&#10;");
}

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

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return '📄';
    if (['jpg', 'jpeg', 'png'].includes(ext)) return '🖼️';
    if (['xlsx', 'xls'].includes(ext)) return '📊';
    return '📎';
}

// function exportarInstruccionIndividualExcel(instruccion) {
//     const wb = XLSX.utils.book_new();
//     const filas = [];

//     // Encabezados
//     filas.push([
//         'Instrucción ID', 'Estado', 'Comercial', 'Fecha Instrucción',
//         'Nombre Instrucción', 'Total Instrucción', 'Total Servicios Especiales',
//         'Total Factura', 'Num. Factura', 'Estado Facturación',
//         'Remesa ID', 'Manifiesto', 'Origen', 'Destino', 'Total Remesa', 'Observaciones'
//     ]);

//     if (instruccion.remesas.length === 0) {
//         filas.push([
//             instruccion.id, instruccion.estado, instruccion.comercial_nombre,
//             instruccion.Fecha_Instrccion, instruccion.nombre?.trim(),
//             parseFloat(instruccion.total_instruccion) || 0,
//             parseFloat(instruccion.total_servicios_especiales) || 0,
//             parseFloat(instruccion.total_factura) || 0,
//             instruccion.num_factura || 'Pendiente', instruccion.estado_facturacion || '',
//             '', '', '', '', '',
//             instruccion.observaciones?.trim()
//         ]);
//     } else {
//         instruccion.remesas.forEach((rem, idx) => {
//             filas.push([
//                 instruccion.id, instruccion.estado, instruccion.comercial_nombre,
//                 instruccion.Fecha_Instrccion, instruccion.nombre?.trim(),
//                 parseFloat(instruccion.total_instruccion) || 0,
//                 parseFloat(instruccion.total_servicios_especiales) || 0,
//                 parseFloat(instruccion.total_factura) || 0,
//                 instruccion.num_factura || 'Pendiente', instruccion.estado_facturacion || '',
//                 rem.remesa_id, rem.Manifiesto,
//                 rem.origen_ajuste || rem.Origen,
//                 rem.destino_ajuste || rem.Destino,
//                 parseFloat(rem.Total_Remesa) || 0,
//                 idx === 0 ? instruccion.observaciones?.trim() : ''
//             ]);
//         });
//     }

//     const ws = XLSX.utils.aoa_to_sheet(filas);
//     ws['!cols'] = [
//         { wch: 14 }, { wch: 18 }, { wch: 22 }, { wch: 20 },
//         { wch: 30 }, { wch: 18 }, { wch: 22 }, { wch: 16 },
//         { wch: 16 }, { wch: 18 }, { wch: 12 }, { wch: 14 },
//         { wch: 20 }, { wch: 20 }, { wch: 16 }, { wch: 35 }
//     ];

//     XLSX.utils.book_append_sheet(wb, ws, 'Instrucción');

//     const fechaHoy = new Date().toISOString().slice(0, 10);
//     XLSX.writeFile(wb, `Instruccion_${instruccion.id}_${instruccion.nombre?.trim()}_${fechaHoy}.xlsx`);
// }

function exportarInstruccionIndividualExcel(instruccion) {
    const wb = XLSX.utils.book_new();
    const ws = {};
    let fila = 1; // openpyxl es 1-indexed, acá manejamos manual con XLSX

    const filas = [];

    // ── BLOQUE 1: Encabezado con info de la instrucción ──────────────────────
    filas.push(['INSTRUCCIÓN DE FACTURACIÓN', '']);
    filas.push(['']);
    filas.push(['Instrucción ID', instruccion.id]);
    filas.push(['Estado', instruccion.estado]);
    filas.push(['Comercial', instruccion.comercial_nombre]);
    filas.push(['Fecha Instrucción', instruccion.Fecha_Instrccion]);
    filas.push(['Nombre Instrucción', instruccion.nombre?.trim()]);
    filas.push(['Num. Factura', instruccion.num_factura || 'Pendiente']);
    filas.push(['Estado Facturación', instruccion.estado_facturacion || 'Pendiente']);
    filas.push(['']);
    filas.push(['Total Instrucción', parseFloat(instruccion.total_instruccion) || 0]);
    filas.push(['Total Serv. Especiales', parseFloat(instruccion.total_servicios_especiales) || 0]);
    filas.push(['Total Factura', parseFloat(instruccion.total_factura) || 0]);
    filas.push(['']);
    filas.push(['Observaciones', instruccion.observaciones?.trim()]);
    filas.push(['']);
    filas.push(['']);

    // ── BLOQUE 2: Tabla de remesas ────────────────────────────────────────────
    filas.push(['REMESAS ASOCIADAS', '', '', '', '']);
    filas.push(['Remesa ID', 'Manifiesto', 'Origen', 'Destino', 'Total Remesa']);

    // Deduplicar remesas por remesa_id
    const remesasUnicas = [...new Map(
        instruccion.remesas.map(r => [r.remesa_id, r])
    ).values()];

    let totalRemesas = 0;
    remesasUnicas.forEach(rem => {
        const total = parseFloat(rem.Total_Remesa) || 0;
        totalRemesas += total;
        filas.push([
            rem.remesa_id,
            rem.Manifiesto,
            rem.origen_ajuste || rem.Origen,
            rem.destino_ajuste || rem.Destino,
            total
        ]);
    });

    // Fila de total
    filas.push(['', '', '', 'TOTAL', totalRemesas]);

    // ── Construir la hoja ─────────────────────────────────────────────────────
    const ws_data = XLSX.utils.aoa_to_sheet(filas);

    // ── Estilos de ancho de columna ───────────────────────────────────────────
    ws_data['!cols'] = [
        { wch: 26 },  // A - Etiqueta / Remesa ID
        { wch: 40 },  // B - Valor / Manifiesto
        { wch: 28 },  // C - Origen
        { wch: 30 },  // D - Destino
        { wch: 18 },  // E - Total Remesa
    ];

    // ── Formato moneda a columna E (totales remesas) ──────────────────────────
    // Fila donde empieza la tabla de remesas (filas.length - remesasUnicas.length - 1)
    const filaInicioRemesas = filas.length - remesasUnicas.length - 1; // fila de datos
    for (let i = filaInicioRemesas; i <= filas.length; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: i, c: 4 });
        if (ws_data[cellRef] && typeof ws_data[cellRef].v === 'number') {
            ws_data[cellRef].z = '"$"#,##0';
        }
    }

    // Formato moneda a totales del bloque 1 (filas 10, 11, 12 → índice 10,11,12)
    [10, 11, 12].forEach(idx => {
        const cellRef = XLSX.utils.encode_cell({ r: idx, c: 1 });
        if (ws_data[cellRef] && typeof ws_data[cellRef].v === 'number') {
            ws_data[cellRef].z = '"$"#,##0';
        }
    });

    XLSX.utils.book_append_sheet(wb, ws_data, 'Instrucción');

    const fechaHoy = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Instruccion_${instruccion.id}_${fechaHoy}.xlsx`);
}