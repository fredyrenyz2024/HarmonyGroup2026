window.VENTANA = null; // Variable global para almacenar el ID

// sessionStorage.clear();
// Definir la función initScript globalmente
window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global
    Listar_Historico_Instrucciones_Facturacion_Anulacion();

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
        if (e.target.matches(`#btn-instrucciones-solicitud-anulacion`) || e.target.matches(`#btn-instrucciones-solicitud-anulacion *`)) {
            let instruccionesAgrupadas = {};
            let Boton = e.target.closest(`#btn-instrucciones-solicitud-anulacion`);
            let Cliente = Boton.getAttribute('data-Cliente');
            let ClienteId = Boton.getAttribute('data-ClienteId');
            let Solicitud_Id = Boton.getAttribute('data-Solicitud_Id');
            let Solicitante_Id = Boton.getAttribute('data-Solicitante_Id');

            let Perfil_Id = document.getElementById(`perfil_id`).value;

            myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Instrucciones de Facturaci&oacute;n de ` + Cliente);
            myOffcanvas.updateContent(`
                <div class="container-fluid">
                    <div class="row mb-2"> 
                    <!-- Filtro para las instrucciones por estado -->
                        <!--<div class="col-12 col-md-4 p-1 ms-auto">
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
                        </div>-->
                        <div class="col-12 col-md-12 p-1" id='List-acordeon'></div>
                    </div>
                </div>
            `);

            //Listar las instrucciones de facturacion del cliente
            let formdata = new FormData();
            formdata.append('ClienteId', ClienteId);
            try {
                const response = await fetch($('#base_url').val() + 'serviciocliente/Detalle_Historico_Instrucciones_Facturacion_Cliente_Anulada', {
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
                            Isntruccion_Id: row.id,
                            Isntruccion: row.Isntruccion,
                            motivo: row.motivo,
                            estado_anulacion: row.estado_anulacion,
                            observacion: row.observacion,
                            evidencia: row.evidencia,
                            aprobacion_gerencia: row.aprobacion_gerencia,
                            Solicitud_Id: row.Solicitud_Id,
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

                    if (instruccion.aprobacion_gerencia === 'No') {
                        if (Perfil_Id === '1') {
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
                                        </div>

                                            ${instruccion.aprobacion_gerencia === 'No' ?
                                    `<div class="form-check form-switch">
                                                    <input class="form-check-input checkbox-aprobar" id="flexSwitchCheckAprobacion_${instruccion.id}" type="checkbox" data-instruccionId="${instruccion.id}" data-Solicitud_Id="${instruccion.Solicitud_Id}" value='Si'>
                                                    <label class="form-check-label fw-bold" for="flexSwitchCheckAprobacion_${instruccion.id}">Aprobar Anulación</label>
                                            </div>`: ''}
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
                                                        <input class="form-control form-control-sm total-instruccion" type="text" id="total_Instruccion_Facturacion${instruccion.id}" data-instruccion-id="${instruccion.id}"  disabled value="${parseFloat(instruccion.total_instruccion).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}">
                                                    </div>
                                                </div>
    
                                                <div class="col-12 col-md-4">
                                                    <div class="mb-2">
                                                        <label style="font-size: 12px;">Total Servicios Especiales</label>
                                                        <input class="form-control form-control-sm total_Servicio_especial_" data-instruccionId="${instruccion.id}" id="total_Servicio_especial_${instruccion.id}" type="text" disabled value="${parseFloat(instruccion.total_servicios_especiales).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}">
                                                    </div>
                                                </div>
    
                                                <div class="col-12 col-md-4">
                                                    <div class="mb-2">
                                                        <label style="font-size: 12px;">Total Factura</label>
                                                        <input class="form-control form-control-sm" type="text" id='total_instruccion${instruccion.id}' disabled value="${parseFloat(instruccion.total_factura).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}">
                                                    </div>
                                                </div>
    
                                                <div class="col-12 col-md-12 p-1">
                                                    <textarea class="form-control" id="descripcion_instruccion_sac_${instruccion.id}" oninput="this.value = this.value.toUpperCase();" rows='2' disabled>${instruccion.observaciones.trim()}</textarea>
                                                </div>
    
                                                <div class="col-12 col-md-12 border-top border-translucent border-dashed pt-2 p-1">
                                                    <h6> Respuesta Facturaci&oacute;n </h6>
                                                    <textarea class="form-control" id="descripcion_instruccion_${instruccion.id}" oninput="this.value = this.value.toUpperCase();" rows='2' disabled>${instruccion.Observacion_Respuesta}</textarea>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            index++;
                        }
                    } else {
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
                                                        <input class="form-control form-control-sm total-instruccion" type="text" id="total_Instruccion_Facturacion${instruccion.id}" data-instruccion-id="${instruccion.id}"  disabled value="${parseFloat(instruccion.total_instruccion).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}">
                                                    </div>
                                                </div>
    
                                                <div class="col-12 col-md-4">
                                                    <div class="mb-2">
                                                        <label style="font-size: 12px;">Total Servicios Especiales</label>
                                                        <input class="form-control form-control-sm total_Servicio_especial_" data-instruccionId="${instruccion.id}" id="total_Servicio_especial_${instruccion.id}" type="text" disabled value="${parseFloat(instruccion.total_servicios_especiales).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}">
                                                    </div>
                                                </div>
    
                                                <div class="col-12 col-md-4">
                                                    <div class="mb-2">
                                                        <label style="font-size: 12px;">Total Factura</label>
                                                        <input class="form-control form-control-sm" type="text" id='total_instruccion${instruccion.id}' disabled value="${parseFloat(instruccion.total_factura).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}">
                                                    </div>
                                                </div>
    
                                                <div class="col-12 col-md-12 p-1">
                                                    <textarea class="form-control" id="descripcion_instruccion_sac_${instruccion.id}" oninput="this.value = this.value.toUpperCase();" rows='2' disabled>${instruccion.observaciones.trim()}</textarea>
                                                </div>
    
                                                <div class="col-12 col-md-12 border-top border-translucent border-dashed pt-2 p-1">
                                                    <h6> Respuesta Facturaci&oacute;n </h6>
                                                    <textarea class="form-control" id="descripcion_instruccion_${instruccion.id}" oninput="this.value = this.value.toUpperCase();" rows='2' disabled>${instruccion.Observacion_Respuesta}</textarea>
                                                </div>
    
                                                <!-- Datos Solicitud de Anulacion -->
                                                <!--<div class="row"></div>-->
    
                                                <div class="border-top border-translucent border-dashed"></div>
    
                                                <div class="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6 p-1">
                                                    <div class="mb-1">
                                                        <label style="font-size: 12px;">Instrucci&oacute;n</label>
                                                        <input type="text" id="instruccion" class="form-control form-control-sm w-100" value="${instruccion.Isntruccion}" disabled>
                                                        <input type="hidden" id="instruccion_Id" class="form-control form-control-sm w-100" value="${instruccion.Isntruccion_Id}" disabled>
                                                    </div>
                                                </div>
    
                                                <div class="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6 p-1">
                                                    <div class="mb-1">
                                                        <label style="font-size: 12px;">
                                                            Motivo Anulación&nbsp;<span style="color:red;"><i>(*)</i></span>
                                                        </label>
                                                        <select id="motivo_anulacion_solicitud_${instruccion.id}" class="form-select form-select-sm w-100" disabled>
                                                            <option value="">Seleccione</option>
                                                            <option value="Solicitado SAC"   ${instruccion.motivo === 'Solicitado SAC' ? 'selected' : ''}>Solicitado SAC</option>
                                                            <option value="Cliente Rechaza"  ${instruccion.motivo === 'Cliente Rechaza' ? 'selected' : ''}>Cliente Rechaza</option>
                                                            <option value="Error Digitacion" ${instruccion.motivo === 'Error Digitacion' ? 'selected' : ''}>Error Digitación</option>
                                                            <option value="Error XML enviado a la DIAN" ${instruccion.motivo === 'Error XML enviado a la DIAN' ? 'selected' : ''}>Error XML enviado a la DIAN</option>
                                                        </select>
    
                                                        <!-- este es el que viaja -->
                                                        <input type="hidden" name="motivo_anulacion_solicitud" value="${instruccion.motivo}">
    
                                                    </div>
                                                </div>
    
                                                <div class="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6 p-1">
                                                    <div class="mb-1">
                                                        <label style="font-size: 12px;">Estado&nbsp;<span style="color:red;"><i>(*)</i></label>
                                                        <select id="estado_anulacion_solicitud_${instruccion.id}" class="form-select form-select-sm w-100">
                                                            <option value="">Seleccione</option>
                                                            <option value="Anulada"   ${instruccion.estado === 'Anulada' ? 'selected' : ''}>Anulada</option>
                                                            <option value="Pendiente" ${instruccion.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                                                            <option value="Rechazada" ${instruccion.estado === 'Rechazada' ? 'selected' : ''}>Rechazada</option>
                                                        </select>
                                                    </div>
                                                </div>
    
                                                <div class="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6 p-1">
                                                    <div class="mb-1">
                                                        <label style="font-size: 12px;">Evidencia&nbsp;<span style="color:red;"><i>(*)</i></label>
                                                        <input type="file" id="evidencia_anulacion_${instruccion.id}" class="form-control form-control-sm w-100">
                                                    </div>
                                                </div>
    
                                                <div class="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6 p-1">
                                                    <div class="mb-1">
                                                        <label style="font-size: 12px;">Observaciones Solicitante</label>
                                                        <textarea type="text" id="observacion_solicitud_${instruccion.id}" min="0" class="form-control form-control-sm bg-body-secondary" rows="2" readonly>${instruccion.observacion}</textarea>
                                                    </div>
                                                </div>
    
                                                <div class="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6 p-1">
                                                    <div class="mb-1">
                                                        <label style="font-size: 12px;">Observaciones (Opcional)</label>
                                                        <textarea type="text" id="observacion_anulacion_${instruccion.id}" min="0" class="form-control form-control-sm" rows="2" oninput="this.value = this.value.toUpperCase();"></textarea>
                                                    </div>
                                                </div>
    
                                                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 p-1 text-end">
                                                    <div class="mb-2">
                                                        <button class="btn btn-success btn-sm me-1 mb-1" type="button" id="btn_anular_instruccion" data-instruccionId="${instruccion.id}" data-Solicitud_Id="${instruccion.Solicitud_Id}" data-Solicitante_Id="${Solicitante_Id}">Anular Instrucción</button>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        index++;
                    }
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

                document.querySelectorAll('.checkbox-aprobar').forEach(checkbox => {
                    checkbox.addEventListener('change', async function () {
                        const aprobarId = this.value;
                        const instruccionId = this.getAttribute('data-instruccionId');
                        const Solicitud_Id = this.getAttribute('data-Solicitud_Id');
                        const isChecked = this.checked;

                        if (isChecked) {
                            const result = await Swal.fire({
                                title: '¿Seguro?',
                                text: '¿Desea aprobar la anulación?',
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
                                // console.log("🚀 ~ result.isConfirmed:", result.isConfirmed)
                                const formData = new FormData();
                                formData.append('aprobarId', aprobarId);
                                formData.append('instruccionId', instruccionId);
                                formData.append('Solicitud_Id', Solicitud_Id);
                                // formData.append('total_Instruccion_Facturacion', document.querySelector(`#total_Instruccion_Facturacion${instruccionId}`).value);
                                // formData.append('total_instruccion', document.querySelector(`#total_instruccion${instruccionId}`).value);

                                fetch($('#base_url').val() + 'serviciocliente/Aprobar_Anulacion_Instruccion', {
                                    method: 'POST',
                                    body: formData,
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log('Respuesta del servidor:', data);

                                        Swal.fire({
                                            icon: data.status === 'ok' ? 'success' : 'error',
                                            title: 'Anulación Aprobada',
                                            text: data.message,
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
                                this.checked = false;

                                // ✅ Restaurar los valores visuales previos
                                // totalInstruccionInput.value = totalInstruccionActual.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
                                // totalFacturaInput.value = (totalInstruccionActual + totalServiciosEspeciales).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
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

            // document.querySelector('#filtro_estado_instruccion').addEventListener('change', function (e) {
            //     const estadoSeleccionado = e.target.value;

            //     let htmlFiltrado = '';
            //     let index = 0;

            //     for (const id in instruccionesAgrupadas) {
            //         const instruccion = instruccionesAgrupadas[id];

            //         // Si no se seleccionó filtro o coincide el estado, incluir
            //         if (!estadoSeleccionado || instruccion.estado === estadoSeleccionado) {
            //             const collapseId = `collapse_${index}`;
            //             let color = 'black';

            //             switch (instruccion.estado) {
            //                 case 'Completada':
            //                     color = '#25b003';
            //                     break;
            //                 case 'Pendiente':
            //                     color = '#e5780b';
            //                     break;
            //                 case 'Pendiente Facturar':
            //                     color = '#0097eb';
            //                     break;
            //                 case 'Rechazada':
            //                     color = '#ec1f00';
            //                     break;
            //             }

            //             htmlFiltrado += `
            //                 <div class="accordion-item">
            //                     <h6 class="accordion-header d-flex align-items-center justify-content-between" id="heading_${index}">
            //                         <div class="d-flex align-items-center w-100">
            //                             <div class="form-check form-switch mt-2">
            //                                 <input class="form-check-input chk_instruccion collapsed" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}" type="checkbox" id="chk_instruccion${instruccion.id}" name="chk_instruccion[]" value="${instruccion.id}" data-idvalor="${instruccion.id}">
            //                                 <label class="form-check-label my-1" for="chk_instruccion${instruccion.id}"> Instrucción #${instruccion.id} - Estado: <span style="color: ${color}; font-weight: 600;">${instruccion.estado}</span> - 
            //                                 Comercial: ${instruccion.comercial_nombre} - Fecha Instrucción: ${instruccion.Fecha_Instrccion} -
            //                                 Num.Factura:  ${instruccion.remesas[0]?.estado_facturacion === 'Facturada' ? `<span class="text-dark"><a class='text-decoration-none' href='#' onclick="abrir_fotos('${instruccion.remesas[0]?.archivo}')">${instruccion.remesas[0]?.num_factura}</a></span>` : `<span class="text-danger">Pendiente</span>`}</label>
            //                             </div>
            //                         </div>
            //                     </h6>
            //                     <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="heading_${index}" data-bs-parent="#accordionExample">
            //                         <div class="accordion-body pt-2">
            //                             <div class="text-end border-bottom border-translucent border-dashed">
            //                                 <strong>Num.Factura:</strong>
            //                                 ${instruccion.remesas[0]?.estado_facturacion === 'Facturada' ? `<span class="text-success">${instruccion.remesas[0].num_factura}</span>` : `<span class="text-danger">Pendiente</span>`}
            //                             </div>
            //                             <ul class="list-group list-group-flush" id="list_remesas_${instruccion.id}">
            //                                 <!-- Remesas se cargarán al expandir -->
            //                             </ul>
            //                         </div>
            //                     </div>
            //                 </div>
            //             `;
            //             index++;
            //         }
            //     }

            //     document.getElementById('List-acordeon').innerHTML = `
            //         <div class="accordion" id="accordionExample">
            //             ${htmlFiltrado || `<div class="text-center text-muted">No hay instrucciones con ese estado.</div>`}
            //         </div>`;
            // });
        }

        if (e.target.matches(`#btn_anular_instruccion`) || e.target.matches(`#btn_anular_instruccion *`)) {
            let Boton = e.target.closest(`#btn_anular_instruccion`);
            let InstruccionId = Boton.getAttribute('data-instruccionId');
            let Solicitud_Id = Boton.getAttribute('data-Solicitud_Id');
            let Solicitante_Id = Boton.getAttribute('data-Solicitante_Id');
            let estado_anulacion_solicitud = document.getElementById(`estado_anulacion_solicitud_${InstruccionId}`).value;
            let observacion_anulacion = document.getElementById(`observacion_anulacion_${InstruccionId}`).value;
            let motivo_anulacion_solicitud = document.getElementById(`motivo_anulacion_solicitud_${InstruccionId}`).value;
            let evidencia_anulacion = document.getElementById(`evidencia_anulacion_${InstruccionId}`).files[0];

            // Confirmación con SweetAlert2
            Swal.fire({
                title: "¿Está seguro?",
                text: "Esta acción anulará la instrucción y la factura.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, anular",
                cancelButtonText: "Cancelar",
                reverseButtons: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let datos = new FormData();
                    datos.append('instruccion_Id', InstruccionId);
                    datos.append('estado', estado_anulacion_solicitud);
                    datos.append('observacion', observacion_anulacion);
                    datos.append('motivo', motivo_anulacion_solicitud);
                    datos.append('Solicitud_Id', Solicitud_Id);
                    datos.append('Solicitante_Id', Solicitante_Id);
                    if (evidencia_anulacion) {
                        datos.append('evidencia', evidencia_anulacion);
                    }

                    try {
                        const response = await fetch($('#base_url').val() + 'serviciocliente/Insertar_Anulacion_Contabilidad', {
                            method: 'POST',
                            body: datos,
                            cache: 'no-cache',
                        });

                        const data = await response.json();

                        if (data.success) {
                            Swal.fire({
                                icon: "success",
                                title: "¡Anulación Realizada!",
                                text: data.message || "Instrucción anulada correctamente.",
                                timer: 3000,
                                showConfirmButton: false
                            }).then(() => {
                                // 🔄 Resetear campos
                                // document.getElementById("vigencia_venta").value = "";
                                // document.getElementById("mes_flete_venta").value = "";
                                // $('#cliente_instruccion').val('').trigger('change');
                                // $('#origen_tarifa').val('').trigger('change');
                                // $('#destino_tarifa').val('').trigger('change');
                                // document.getElementById("configuracion_vehiculos_tarifa").value = "";
                                // document.getElementById("tarifa_venta").value = "";
                                // document.getElementById("estado_tarifa").value = "Activa";

                                // 🔒 Cerrar offcanvas con API de Bootstrap 5
                                let offcanvasEl = document.getElementById(`customOffcanvas${window.VENTANA}`);
                                let offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
                                offcanvas.hide();

                                // 📋 Refrescar listado
                                Listar_Historico_Instrucciones_Facturacion_Anulacion();
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: data.message || "No se pudo procesar la solicitud de anulación."
                            });
                        }
                    } catch (error) {
                        console.error('Error en la solicitud:', error);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Ocurrió un problema en el servidor. Intente nuevamente."
                        });
                    }
                }
            });
        }
    });
}

async function Listar_Historico_Instrucciones_Facturacion_Anulacion() {
    const loader = document.querySelector('.img_load');
    if (loader) loader.style.display = 'table-row';
    let tbody = document.getElementById('tbody_historico_instrcciones_facturacion_anulacion');
    tbody.innerHTML = '';
    try {
        const response = await fetch($('#base_url').val() + 'serviciocliente/Listar_Historico_Instrucciones_Anulacion', {
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
                // columnaDocumentoCliente.innerHTML = `<a class='text-decoration-none' href='#' id='btn-instrucciones-solicitud-anulacion' data-ClienteId='${element.cliente_id}' data-Cliente='${element.cliente_nombre}'>${element.documento_cliente}</a>`; 
                columnaDocumentoCliente.innerHTML = `<a class='text-decoration-none' href='#' id='btn-instrucciones-solicitud-anulacion' data-ClienteId='${element.cliente_id}' data-Cliente='${element.cliente_nombre}' data-Solicitud_Id="${element.Solicitud_Id}" data-Solicitante_Id="${element.solicitante_id}">${element.documento_cliente}</a>`;
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

// Construir un OffCanvas
// Constructor del Offcanvas Dinámico
function DynamicOffcanvas(options) {
    // Configuración predeterminada
    var defaults = {
        id: 'dynamicOffcanvas',
        title: 'Default Title',
        content: 'Default Content',
        class: 'offcanvas-end',
        scroll: true,
        backdrop: false,
        width: '60%', // Nuevo valor por defecto
        height: 'auto' // Puedes agregar height también
    };

    // Fusionar opciones con defaults
    this.settings = Object.assign({}, defaults, options);

    // Inicializar
    this.initialize();
}

DynamicOffcanvas.prototype.initialize = function () {
    this.createOffcanvas();
    this.bsOffcanvas = new bootstrap.Offcanvas(this.offcanvasElement);
};

DynamicOffcanvas.prototype.createOffcanvas = function () {
    var offcanvasHTML = `
    <div class="offcanvas ${this.settings.class}" 
        id="${this.settings.id}" 
        data-bs-scroll="${this.settings.scroll ? 'true' : 'false'}"
        data-bs-backdrop="${this.settings.backdrop ? 'true' : 'false'}"
        tabindex="-1" 
        aria-labelledby="${this.settings.id}-label" style="width: ${this.settings.width}; height: ${this.settings.height}">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title fw-bold" id="${this.settings.id}-label">
            ${this.settings.title}
          </h5>
          <button class="btn-close text-reset" type="button" data-bs-dismiss="offcanvas" id="btn-close-${this.settings.id}"></button>
        </div>
      <div class="offcanvas-body">
        ${this.settings.content}
      </div>
    </div>
`;

    var container = document.createElement('div');
    container.innerHTML = offcanvasHTML;
    this.offcanvasElement = container.firstElementChild;
    document.body.appendChild(this.offcanvasElement);
};

DynamicOffcanvas.prototype.updateContent = function (newContent) {
    var body = this.offcanvasElement.querySelector('.offcanvas-body');
    body.innerHTML = newContent;
};

DynamicOffcanvas.prototype.updateTitle = function (newTitle) {
    var title = this.offcanvasElement.querySelector('.offcanvas-title');
    title.innerHTML = newTitle;
};

DynamicOffcanvas.prototype.updateClass = function (newClass) {
    var offcanvas = this.offcanvasElement;

    // Eliminar todas las clases de posición de offcanvas
    Array.from(offcanvas.classList)
        .filter(cls => cls.startsWith('offcanvas-') && cls !== 'offcanvas')
        .forEach(cls => offcanvas.classList.remove(cls));

    // Agregar la nueva clase
    offcanvas.classList.add(newClass);

    // ⚡⚡ Destruir la instancia anterior
    if (this.bsOffcanvas) {
        this.bsOffcanvas.dispose();
    }

    // ⚡⚡ Crear nueva instancia con las nuevas clases
    this.bsOffcanvas = new bootstrap.Offcanvas(this.offcanvasElement);
};

// Función para modificar el ancho
DynamicOffcanvas.prototype.updateWidth = function (newWidth) {
    this.offcanvasElement.style.width = newWidth;
};

// Función para modificar el alto
DynamicOffcanvas.prototype.updateHeight = function (newHeight) {
    this.offcanvasElement.style.height = newHeight;
};

DynamicOffcanvas.prototype.show = function () {
    this.bsOffcanvas.show();
};

DynamicOffcanvas.prototype.hide = function () {
    this.bsOffcanvas.hide();
};

DynamicOffcanvas.prototype.getContent = function () {
    var body = this.offcanvasElement.querySelector('.offcanvas-body');
    return body.innerHTML; // Devuelve el contenido actual
};