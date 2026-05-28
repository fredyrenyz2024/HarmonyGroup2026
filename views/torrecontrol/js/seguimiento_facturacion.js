window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
   window.VENTANA = id; // Asigna el ID recibido a la variable global
   window.perfil = document.getElementById('perfil_id').value;
   // Crear instancia
   // Usar una variable global o una propiedad en el objeto window
   if (!window.myOffcanvas) {
      window.myOffcanvas = new DynamicOffcanvas({
         id: `customOffcanvas${id}`,
         title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
         content: '<p>Contenido inicial</p>',
         scroll: true,
         backdrop: false,
      });
   } else {
      console.log('El offcanvas ya está creado.');
   }

   const selectAll = document.getElementById('selectAll');

   if (selectAll) {
      selectAll.addEventListener('change', function () {
         document.querySelectorAll('.fila-check').forEach((chk) => {
            chk.checked = selectAll.checked;
         });
      });
   }

   document.addEventListener('click', async (e) => {
      if (e.target.matches(`#campo-${window.VENTANA}-filtrar`)) {
         let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
         let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;

         Listar_pedidos_facturacion(fecha_inicial, fecha_final);
      }

      if (e.target.matches(`#btn_seguimiento_factura`) || e.target.matches(`btn_seguimiento_factura *`)) {
         let estado_solicitud = e.target.getAttribute('data-estado_solicitud');
         let estado_aprobacion = e.target.getAttribute('data-estado_aprobacion');
         let motivo = e.target.getAttribute('data-motivo');

         let htmlEstadoSolicitud = '';
         let htmlEstadoAprobacion = '';

         if (estado_solicitud === null && estado_aprobacion === null) {
            htmlEstadoSolicitud = `<span class="badge badge-phoenix badge-phoenix-warning">Sin Auditoria</span>`;
            htmlEstadoAprobacion = `<span class="badge badge-phoenix badge-phoenix-warning">Sin Gestión</span>`;
         } else if (estado_solicitud === 'Pendiente' && estado_aprobacion === 'Pendiente') {
            htmlEstadoSolicitud = `<span class="badge badge-phoenix badge-phoenix-secondary">${estado_solicitud}</span>`;
            htmlEstadoAprobacion = `<span class="badge badge-phoenix badge-phoenix-secondary">${estado_aprobacion}</span>`;
         } else if (estado_solicitud === 'Rechazado' && estado_aprobacion === 'Rechazado') {
            htmlEstadoSolicitud = `<span class="badge badge-phoenix badge-phoenix-danger">${estado_solicitud}</span>`;
            htmlEstadoAprobacion = `<span class="badge badge-phoenix badge-phoenix-danger">${estado_aprobacion}</span>`;
         } else if (estado_solicitud === 'Aprobado' && estado_aprobacion === 'Aprobado') {
            htmlEstadoSolicitud = `<span class="badge badge-phoenix badge-phoenix-success">${estado_solicitud}</span>`;
            htmlEstadoAprobacion = `<span class="badge badge-phoenix badge-phoenix-success">${estado_aprobacion}</span>`;
         }

         myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Seguimiento Factura`);
         if (window.perfil === '43') { //Proveedor
            myOffcanvas.updateContent(`
               <div class="card shadow-sm mt-1">
                     <div class="card-header bg-primary text-white py-2">
                        <h6 class="mb-0">Gestión de Facturación</h6>
                     </div>

                     <div class="d-flex gap-3 justify-content-center my-3">
                        <div>
                           <b>Estado Aprobación:</b> ${htmlEstadoAprobacion || 'Sin Auditoria'}
                        </div>

                        <div>
                           <b>Estado Solicitud:</b> ${htmlEstadoSolicitud || 'Sin Gestión'}
                        </div>
                     </div>
                     <div class="card-body">

                        <form id="form_gestion_facturacion">

                              <div class="row g-3">

                                 <!-- PLACA -->
                                 <div class="col-md-3">
                                    <label class="form-label mb-0">Placa</label>
                                    <input type="text" id="placa" class="form-control" disabled>
                                 </div>

                                 <!-- CONDUCTOR -->
                                 <div class="col-md-5">
                                    <label class="form-label mb-0">Conductor</label>
                                    <input type="text" id="nombre_conductor" class="form-control" disabled>
                                 </div>

                                 <!-- CELULAR CONDUCTOR -->
                                 <div class="col-md-4">
                                    <label class="form-label mb-0">Celular Conductor</label>
                                    <input type="text" id="celular_conductor" class="form-control" disabled>
                                 </div>

                                 <!-- VALOR SERVICIO (HABILITADO) -->
                                 <div class="col-md-3">
                                    <label class="form-label mb-0 fw-bold text-primary">Valor Servicio</label>
                                    <!--<input type="text" id="valor_servicio" class="form-control" placeholder="$ 0" ${estado_solicitud === 'Rechazado' && estado_aprobacion === 'Rechazado' || estado_solicitud === 'null' && estado_aprobacion === 'null' ? '' : 'disabled'}>-->
                                    <input type="text" id="valor_servicio" class="form-control" placeholder="$ 0" disabled>
                                 </div>

                                 <div class="col-md-4" id='campo_soporte'>
                                    <label class="form-label mb-0 fw-bold text-primary">Soporte Cumplido</label>
                                    <input type="file" id="soporte_flete" class="form-control">
                                 </div>

                                 <!--<div class="col-md-4" id='campo_facturacion'>
                                    <label class="form-label mb-0 fw-bold text-primary">Soporte Facturación</label>
                                    <input type="file" id="soporte_facturacion" class="form-control">
                                 </div>-->


                                 <div class="col-md-3 mt-5" id='documento_soporte'></div>
                                 <div class="col-md-3 mt-5" id='documento_orden_compra'></div>
                                 <div class="col-md-3 mt-5" id='documento_facturacion'></div>

                                 
                                 ${estado_solicitud === 'Aprobado' && estado_aprobacion === 'Aprobado' ?
                  `
                                    <div class="col-md-12" id='campo_soporte_facturacion'>                                    
                                       <label class="form-label mb-0 fw-bold text-primary">Soporte Facturación</label>
                                       <div class="input-group">
                                          <input type="file" class="form-control" id="soporte_facturacion" aria-describedby="soporte_facturacion" aria-label="Upload">
                                          <button class="btn btn-outline-secondary" type="button" id="btn_soporte_facturacion" data-recurso="${e.target.getAttribute('data-recurso')}" data-proveedor="${e.target.getAttribute('data-proveedor')}">Guardar</button>
                                       </div>
                                    </div>
                                 `: ''}

                                 <div class="border-top border-translucent border-dashed pt-2"></div>

                                 <label class="form-label mb-0 fw-bold text-primary">Puntos Entrega</label>
                                 <div class="table-responsive scrollbar">
                                       <table id='table_gestion_facturacion_puntos' class='table table-bordered table-sm' data-page-length='100' style="font-size:11px;">
                                          <thead>
                                             <tr>
                                                <th class='text-center' style='width: auto; white-space: nowrap;'>Referencia</th>
                                                <th class='text-center' style='width: auto; white-space: nowrap;'>Origen</th>
                                                <th class='text-center' style='width: auto; white-space: nowrap;'>Remitente</th>
                                                <th class='text-center' style='width: auto; white-space: nowrap;'>Destino</th>
                                                <th class='text-center' style='width: auto; white-space: nowrap;'>Destinatario</th>
                                             </tr>
                                          </thead>
                                          <tbody id='tbl_seguimiendo_facturacion_puntos' class='text-center'>
                                             <tr>
                                                <td colspan="24" class="text-center" style="font-size:15px;font-weight:bold;">
                                                   <img src="${$('#base_url').val()}public/img/nexos_loading.gif" height="25" width="25" id="load_info" style="display: none;"> Esperando Información
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </div>

                                 <div class="border-top border-translucent border-dashed pt-2"></div>

                                 <div class="table-responsive scrollbar">
                                    <table id='table_gestion_facturacion_servicios' class='table table-bordered table-sm' data-page-length='100' style="font-size:11px;">
                                       <thead>
                                          <tr>
                                             <th class='text-center' style='width: auto; white-space: nowrap;'>Servicio Especial</th>
                                             <th class='text-center' style='width: auto; white-space: nowrap;'>Proveedor</th>
                                             <th class='text-center' style='width: auto; white-space: nowrap;'>Vaor Servicio</th>
                                             <th class='text-center' style='width: auto; white-space: nowrap;'>Soporte</th>
                                          </tr>
                                       </thead>
                                       <tbody id='tbl_seguimiendo_facturacion_servicios' class='text-center'>
                                          <tr>
                                             <td colspan="24" class="text-center" style="font-size:15px;font-weight:bold;">
                                                <img src="${$('#base_url').val()}public/img/nexos_loading.gif" height="25" width="25" id="load_info" style="display: none;"> Esperando Información
                                             </td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </div>

                                 <b>Motivo:</b> ${motivo || 'Sin motivo registrado'}

                                 <!-- BOTÓN GUARDAR -->
                                 ${/* estado_solicitud === 'Pendiente' && estado_aprobacion === 'Pendiente' || */ estado_solicitud === 'null' && estado_aprobacion === 'null' || estado_solicitud === 'Rechazado' && estado_aprobacion === 'Rechazado' ? `
                                 <div class="col-12 text-end mt-2">
                                    <button type="button" class="btn btn-success" id="btn_guardar_gestion">
                                          <i class="fa fa-save"></i> Guardar Cambios
                                    </button>
                                 </div>`: ''}
                              </div>
                        </form>
                     </div>
                  </div>
            `);

            if (/* estado_solicitud === 'Pendiente' && estado_aprobacion === 'Pendiente' || */ estado_solicitud === 'null' && estado_aprobacion === 'null' || estado_solicitud === 'Rechazado' && estado_aprobacion === 'Rechazado') {
               document.getElementById('btn_guardar_gestion').setAttribute('data-recurso', e.target.getAttribute('data-recurso'));
               document.getElementById('btn_guardar_gestion').setAttribute('data-proveedor', e.target.getAttribute('data-proveedor'));
            }
         } else if (window.perfil === '42' || window.perfil === '1' || window.perfil === '44') {
            myOffcanvas.updateContent(`
                  <div class="card shadow-sm mt-3">
                        <div class="card-header bg-primary text-white py-2">
                           <h6 class="mb-0">Detalle Facturación</h6>
                        </div>

                        <div class="card-body">

                           <form id="form_facturacion_admin">

                              <div class="row g-3">

                                    <!-- PLACA -->
                                    <div class="col-md-3">
                                       <label class="form-label mb-0">Placa</label>
                                       <input type="text" id="placa" class="form-control" disabled>
                                    </div>

                                    <!-- CONDUCTOR -->
                                    <div class="col-md-5">
                                       <label class="form-label mb-0">Conductor</label>
                                       <input type="text" id="nombre_conductor" class="form-control" disabled>
                                    </div>

                                    <!-- CELULAR CONDUCTOR -->
                                    <div class="col-md-4">
                                       <label class="form-label mb-0">Celular Conductor</label>
                                       <input type="text" id="celular_conductor" class="form-control" disabled>
                                    </div>

                                    <!-- VALOR SERVICIO PRINCIPAL -->
                                    <div class="col-md-3">
                                       <label class="form-label mb-0 fw-bold text-primary">Valor Servicio</label>
                                       <input type="text" id="valor_servicio" class="form-control" disabled>
                                    </div>

                                    <div class="col-md-3 mt-5" id='documento_soporte'></div>

                                    <div class="col-md-3 mt-5" id='documento_facturacion'></div>

                                    <div class="col-md-3  mt-5" id='documento_orden_compra'></div>

                                    <div class="col-md-12" id='campo_orden_compra'>
                                       <!--<label class="form-label mb-0 fw-bold text-primary">Orden Compra</label>
                                       <input type="file" id="soporte_orden_compra" class="form-control">-->
                                       
                                       <label class="form-label mb-0 fw-bold text-primary">Orden Compra</label>
                                       <div class="input-group">
                                          <input type="file" class="form-control" id="soporte_orden_compra" aria-describedby="soporte_orden_compra" aria-label="Upload">
                                          <button class="btn btn-outline-secondary" type="button" id="btn_soporte_orden_compra" data-recurso="${e.target.getAttribute('data-recurso')}" data-proveedor="${e.target.getAttribute('data-proveedor')}">Guardar</button>
                                       </div>
                                    </div>

                                    <div class="border-top border-translucent border-dashed pt-2"></div>

                                    <!-- DETALLE SERVICIOS ESPECIALES -->
                                    <div class="table-responsive scrollbar mt-3">
                                       <table class="table table-bordered table-sm" style="font-size:11px;">
                                          <thead>
                                                <tr>
                                                   <th>Servicio Especial</th>
                                                   <th>Proveedor</th>
                                                   <th>Valor</th>
                                                   <th>Soporte</th>
                                                </tr>
                                          </thead>
                                          <tbody id="tbl_servicios_admin">
                                                <tr>
                                                   <td colspan="4">Cargando...</td>
                                                </tr>
                                          </tbody>
                                       </table>
                                    </div>

                                    <div class="border-top border-translucent border-dashed pt-2"></div>

                                    <label class="form-label mb-0 fw-bold text-primary">Puntos Entrega</label>
                                    <div class="table-responsive scrollbar">
                                          <table id='table_gestion_facturacion_puntos' class='table table-bordered table-sm' data-page-length='100' style="font-size:11px;">
                                             <thead>
                                                <tr>
                                                   <th class='text-center' style='width: auto; white-space: nowrap;'>Referencia</th>
                                                   <th class='text-center' style='width: auto; white-space: nowrap;'>Origen</th>
                                                   <th class='text-center' style='width: auto; white-space: nowrap;'>Remitente</th>
                                                   <th class='text-center' style='width: auto; white-space: nowrap;'>Destino</th>
                                                   <th class='text-center' style='width: auto; white-space: nowrap;'>Destinatario</th>
                                                </tr>
                                             </thead>
                                             <tbody id='tbl_seguimiendo_facturacion_puntos' class='text-center'>
                                                <tr>
                                                   <td colspan="24" class="text-center" style="font-size:15px;font-weight:bold;">
                                                      <img src="${$('#base_url').val()}public/img/nexos_loading.gif" height="25" width="25" id="load_info" style="display: none;"> Esperando Información
                                                   </td>
                                                </tr>
                                             </tbody>
                                          </table>
                                       </div>

                                    <div class="border-top border-translucent border-dashed pt-2"></div>

                                    <!-- TOTALES -->
                                    <div class="col-md-4">
                                       <label class="form-label mb-0 fw-bold">Total Servicios Especiales</label>
                                       <input type="text" id="total_especiales" class="form-control" disabled>
                                    </div>

                                    <div class="col-md-4">
                                       <label class="form-label mb-0 fw-bold">Total General</label>
                                       <input type="text" id="total_general" class="form-control" disabled>
                                    </div>
                                 ${(window.perfil === '1' || window.perfil === '44') && estado_solicitud !== 'Aprobado' && estado_aprobacion !== 'Aprobado' ? `
                                    <div class="col-md-4">
                                       <label class="form-label mb-0 fw-bold">Estado Facturación</label>
                                       <select name="select_estado_facturacion" id="select_estado_facturacion" class="form-select form-select-sm">
                                          <option value="">Seleccione</option>
                                          <option value="Aprobado">Aprobar Facturacion</option>
                                          <option value="Rechazado">Rechazar Facturacion</option>
                                       </select>
                                    </div>

                                    <div class="col-md-12">
                                       <label class="form-label mb-0 fw-bold">Estado Facturación</label>
                                       <select name="select_motivo_rechazo_facturacion" id="select_motivo_rechazo_facturacion" class="form-select form-select-sm" style="display:none;">
                                          <option value="">Seleccione</option>
                                          <option value="FLETE NO CORRESPONDE">Flete no corresponde</option>
                                          <option value="VEHICULO NO CORRESPONDE">Vehículo no corresponde</option>
                                       </select>
                                    </div>

                                 <!-- BOTÓN GUARDAR -->                                                              
                                 <div class="col-12 text-end mt-5">
                                    <button type="button" class="btn btn-success" id="btn_guardar_estado">
                                          <i class="fa fa-save"></i> Guardar Cambios
                                    </button>
                                 </div>` : ''}
                              </div>
                           </form>
                        </div>
                  </div>
               `);

            if ((window.perfil === '1' || window.perfil === '44') && estado_solicitud !== 'Aprobado' && estado_aprobacion !== 'Aprobado') {
               document.getElementById('btn_guardar_estado').setAttribute('data-recurso', e.target.getAttribute('data-recurso'));
               document.getElementById('btn_guardar_estado').setAttribute('data-proveedor', e.target.getAttribute('data-proveedor'));
            }
         }
         try {
            await CargarDetalleFactura(
               e.target.getAttribute('data-recurso'),
               e.target.getAttribute('data-proveedor'),
               e.target.getAttribute('data-estado_solicitud'),
               e.target.getAttribute('data-estado_aprobacion')
            );
         } catch (error) {
            console.error(error);
         }

         myOffcanvas.show();
      }

      if (e.target.matches('#btn_guardar_gestion')) {
         const recurso_id = e.target.getAttribute('data-recurso');
         const proveedor_id = e.target.getAttribute('data-proveedor');

         let formData = new FormData();

         formData.append('recurso_id', recurso_id);
         formData.append('proveedor_id', proveedor_id);
         formData.append('valor_servicio_principal', limpiarNumero(document.getElementById('valor_servicio').value));

         // soporte flete
         const fileFlete = document.getElementById('soporte_flete').files[0];
         if (fileFlete) formData.append('soporte_flete', fileFlete);
         // const fileFactura = document.getElementById('soporte_facturacion').files[0];
         // if (fileFactura) formData.append('soporte_factura', fileFactura);

         // ================================
         //   SERVICIOS ESPECIALES
         // ================================

         const valores = document.querySelectorAll('.valor-servicio');
         const soportes = document.querySelectorAll('.soporte-servicio');

         valores.forEach((input, index) => {
            formData.append(`servicios[${index}][id]`, input.dataset.id);
            formData.append(`servicios[${index}][valor]`, limpiarNumero(input.value));

            // soporte del mismo index
            if (soportes[index] && soportes[index].files.length > 0) {
               formData.append(`servicios[${index}][soporte]`, soportes[index].files[0]);
            }
         });

         const response = await fetch(`${$('#base_url').val()}torrecontrol/GuardarSeguimientoFactura`, {
            method: 'POST',
            body: formData,
         });

         const json = await response.json();

         if (json.success) {
            Swal.fire('Guardado', 'La información fue registrada correctamente.', 'success');
            myOffcanvas.hide();
            window.location.reload(true);
         } else {
            Swal.fire('Error', json.message, 'error');
         }
      }

      if (e.target.matches('#btn_guardar_estado')) {
         const recurso_id = e.target.getAttribute('data-recurso');
         const proveedor_id = e.target.getAttribute('data-proveedor');
         const estado_facturacion = document.getElementById('select_estado_facturacion').value;
         const motivo = document.getElementById('select_motivo_rechazo_facturacion').value;

         let formData = new FormData();
         formData.append('recurso_id', recurso_id);
         formData.append('proveedor_id', proveedor_id);
         formData.append('estado_aprobacion', estado_facturacion);
         formData.append('motivo', motivo);

         const response = await fetch(`${$('#base_url').val()}torrecontrol/GuardarEstadoFacturacion`, {
            method: 'POST',
            body: formData,
         });

         const json = await response.json();

         if (json.success) {
            Swal.fire('Actualizado', 'El estado de facturación fue actualizado correctamente.', 'success');
            myOffcanvas.hide();
            window.location.reload(true);
         } else {
            Swal.fire('Error', json.message, 'error');
         }
      }

      if (e.target.matches('#btn_soporte_orden_compra')) {

         const recurso = e.target.getAttribute('data-recurso');
         const proveedor = e.target.getAttribute('data-proveedor');

         const fileInput = document.getElementById('soporte_orden_compra');
         const file = fileInput.files[0];

         if (!file) {
            Swal.fire("Error", "Debe seleccionar un archivo.", "error");
            return;
         }

         let formData = new FormData();
         formData.append("soporte_orden_compra", file);
         formData.append("recurso", recurso);
         formData.append("proveedor", proveedor);

         try {
            const response = await fetch(`${$('#base_url').val()}torrecontrol/GuardarSoporteOrdenCompra`, {
               method: "POST",
               body: formData
            });

            const data = await response.json();

            if (data.success) {
               Swal.fire("Éxito", "Soporte guardado correctamente.", "success");
               window.location.reload(true);
            } else {
               Swal.fire("Error", data.message, "error");
            }

         } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo enviar el archivo.", "error");
         }
      }

      if (e.target.matches('#btn_soporte_facturacion')) {
         const recurso = e.target.getAttribute('data-recurso');
         const proveedor = e.target.getAttribute('data-proveedor');

         const fileInput = document.getElementById('soporte_facturacion');
         const file = fileInput.files[0];

         if (!file) {
            Swal.fire("Error", "Debe seleccionar un archivo.", "error");
            return;
         }

         let formData = new FormData();
         formData.append("soporte_facturacion", file);
         formData.append("recurso", recurso);
         formData.append("proveedor", proveedor);

         try {
            const response = await fetch(`${$('#base_url').val()}torrecontrol/GuardarSoporteFacturacion`, {
               method: "POST",
               body: formData
            });

            const data = await response.json();

            if (data.success) {
               Swal.fire("Éxito", "Soporte guardado correctamente.", "success");
               window.location.reload(true);
            } else {
               Swal.fire("Error", data.message, "error");
            }

         } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo enviar el archivo.", "error");
         }
      }

      if (e.target.matches("#btnAprobarMasivo") || e.target.matches("#btnAprobarMasivo *")) {

         let datos = getSelectedRows();

         if (!datos.length) {
            Swal.fire("Atención", "No hay registros seleccionados", "warning");
            return;
         }

         Swal.fire({
            title: '¿Confirmar aprobación masiva?',
            text: `Se aprobarán ${datos.length} registros de facturación.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, aprobar',
            cancelButtonText: 'Cancelar'
         }).then((result) => {

            if (!result.isConfirmed) return;

            let formData = new FormData();
            formData.append('registros', JSON.stringify(datos));

            fetch($('#base_url').val() + 'torrecontrol/AprobarMasivo', {
               method: 'POST',
               body: formData
            })
               .then(res => res.json())
               .then(response => {

                  if (response.status === true) {
                     Swal.fire("Éxito", response.message, "success");
                     let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
                     let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;

                     Listar_pedidos_facturacion(fecha_inicial, fecha_final); // o location.reload()
                  } else {
                     Swal.fire("Error", response.message, "error");
                  }

               })
               .catch(err => {
                  console.error(err);
                  Swal.fire("Error", "Ocurrió un error en la aprobación", "error");
               });

         });
      }
   });

   document.addEventListener('change', async (e) => {
      if (e.target.matches('#select_estado_facturacion')) {
         let Estado = e.target.value;
         if (Estado === 'Rechazado') {
            document.getElementById('select_motivo_rechazo_facturacion').style.display = '';
         } else {
            document.getElementById('select_motivo_rechazo_facturacion').style.display = 'none';

         }
      }
   });

   // Seleccionar todos
   document.addEventListener('change', function (e) {
      if (e.target.id === 'selectAll') {
         const checked = e.target.checked;
         document.querySelectorAll('.row-check').forEach(ch => ch.checked = checked);
      }
   });

   function actualizarBotonDescarga() {
      const seleccionados = document.querySelectorAll('.row-check:checked').length;
      const btn = document.getElementById("btnDescargarSeleccionados");
      const btnAprobar = document.getElementById("btnAprobarMasivo");

      if (seleccionados > 0) {
         btn.classList.remove('d-none');  // mostrar
         if (window.perfil === '42' || window.perfil === '1') {
            btnAprobar.classList.remove('d-none');  // mostrar
         }
      } else {
         btn.classList.add('d-none');     // ocultar
         if (window.perfil === '42' || window.perfil === '1') {
            btnAprobar.classList.add('d-none');     // ocultar
         }
      }
   }

   // CUANDO SE SELECCIONA O DESELECCIONA UN CHECKBOX INDIVIDUAL
   document.addEventListener('change', function (e) {
      if (e.target.classList.contains('row-check')) {
         actualizarBotonDescarga();
      }

      if (e.target.id === 'selectAll') {
         const checked = e.target.checked;
         document.querySelectorAll('.row-check').forEach(ch => ch.checked = checked);
         actualizarBotonDescarga();
      }
   });

};

async function Listar_pedidos_facturacion(fecha_inicial, fecha_final) {
   let formdata = new FormData();
   formdata.append('fecha_inicial', fecha_inicial);
   formdata.append('fecha_final', fecha_final);

   const tbody = document.getElementById('tbl_seguimiendo_facturacion');
   const loading = document.getElementById('load_info');

   // Mostrar “cargando…”
   tbody.innerHTML = `
        <tr>
            <td colspan="24" class="text-center" style="font-size:15px;font-weight:bold;">
                <img src="${$('#base_url').val()}public/img/nexos_loading.gif" height="25" width="25"> Cargando información...
            </td>
        </tr>
    `;

   try {
      const response = await fetch($('#base_url').val() + `torrecontrol/Listar_recursos_facturacio`, {
         method: 'POST',
         body: formdata,
         cache: 'no-cache',
      });

      const json = await response.json();

      if (!json.success) {
         tbody.innerHTML = `
                <tr><td colspan="24" class="text-danger">Error al obtener datos.</td></tr>
            `;
         return;
      }

      const data = json.data;

      if (data.length === 0) {
         tbody.innerHTML = `
                <tr><td colspan="24" class="text-center">No hay información disponible</td></tr>
            `;
         return;
      }

      let html = '';
      let htmlEstadoSolicitud = '';
      let htmlEstadoAprobacion = '';

      data.forEach((item, index) => {

         if (item.estado_solicitud === null && item.estado_aprobacion === null) {
            htmlEstadoSolicitud = `<span class="badge badge-phoenix badge-phoenix-warning">Sin Auditoria</span>`;
            htmlEstadoAprobacion = `<span class="badge badge-phoenix badge-phoenix-warning">Sin Gestión</span>`;
         } else if (item.estado_solicitud === 'Pendiente' && item.estado_aprobacion === 'Pendiente') {
            htmlEstadoSolicitud = `<span class="badge badge-phoenix badge-phoenix-secondary">${item.estado_solicitud}</span>`;
            htmlEstadoAprobacion = `<span class="badge badge-phoenix badge-phoenix-secondary">${item.estado_aprobacion}</span>`;
         } else if (item.estado_solicitud === 'Rechazado' && item.estado_aprobacion === 'Rechazado') {
            htmlEstadoSolicitud = `<span class="badge badge-phoenix badge-phoenix-danger">${item.estado_solicitud}</span>`;
            htmlEstadoAprobacion = `<span class="badge badge-phoenix badge-phoenix-danger">${item.estado_aprobacion}</span>`;
         } else if (item.estado_solicitud === 'Aprobado' && item.estado_aprobacion === 'Aprobado') {
            htmlEstadoSolicitud = `<span class="badge badge-phoenix badge-phoenix-success">${item.estado_solicitud}</span>`;
            htmlEstadoAprobacion = `<span class="badge badge-phoenix badge-phoenix-success">${item.estado_aprobacion}</span>`;
         }

         // const compraLlena = item.num_compra != null && item.num_compra !== '' && item.num_compra !== '-';
         // const facturaLlena = item.num_factura != null && item.num_factura !== '' && item.num_factura !== '-';
         // const mostrarCheckbox = !(compraLlena && facturaLlena);

         const compraLlena =
            item.num_compra != null &&
            item.num_compra !== '' &&
            item.num_compra !== '-';

         const facturaLlena =
            item.num_factura != null &&
            item.num_factura !== '' &&
            item.num_factura !== '-';

         let mostrarCheckbox = true;
         const perfil = String(window.perfil);

         if (perfil === '43') {
            // SOLO factura
            mostrarCheckbox = !facturaLlena;

            // document.getElementById('row_cargar_archivos').style.display = 'none';
         } else if (perfil === '1' || perfil === '42') {
            // orden O factura
            mostrarCheckbox = !(compraLlena || facturaLlena);
            // document.getElementById('row_cargar_archivos').style.display = 'none';
         } else {
            // otros perfiles: orden Y factura
            mostrarCheckbox = !(compraLlena && facturaLlena);
         }

         html += `
            <tr>
                <!-- Checkbox solo si perfil != 42 -->
               <td class='text-center'>
                  ${mostrarCheckbox
               ? `<input
                           type="checkbox"
                           class="row-check form-check-input"
                           data-id="${item.recurso_id}"
                           data-proveedor="${item.proveedor_id}"
                           data-pedido="${item.referencias_pedido}"
                           style="scale:1.2;"
                        >`
               : ``
            }
               </td>
                <td  class='text-center' style='width: auto; white-space: nowrap;'>${item.modalidad}</td>
                <td  class='text-start' style='width: auto; white-space: nowrap;'>
                     <div class="dropdown">
                        <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N° ${item.referencias_pedido}</a>
                        <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
                           <a class="dropdown-item fw-bold" href="#" id="btn_seguimiento_factura" data-recurso="${item.recurso_id}" data-proveedor="${item.proveedor_id}" data-estado_solicitud="${item.estado_solicitud}" data-estado_aprobacion="${item.estado_aprobacion}" data-motivo="${item.motivo}"><span class="uil uil-transaction"></span> Seguimiento Factura</a>
                        </div>
                     </div>
                </td>
                <td  class='text-center' style='width: auto; white-space: nowrap;'>${htmlEstadoSolicitud}</td>
                <td  class='text-center' style='width: auto; white-space: nowrap;'>${htmlEstadoAprobacion}</td>
                <td  class='text-center' style='width: auto; white-space: nowrap;'>${item.fecha_solicitud}</td>
                <td  class='text-center' style='width: auto; white-space: nowrap;'>${item.fecha_asignacion}</td>
                <td  class='text-center' style='width: auto; white-space: nowrap;'>${item.proveedor}</td>
                <td  class='text-center' style='width: auto; white-space: nowrap;'>${item.placa}</td>
                <td  class='text-center' style='width: auto; white-space: nowrap;'>${item.nombre_conductor}</td>
                <td  class='text-center' style='width: auto; white-space: nowrap;'>${item.cedula_conductor}</td>
                <td  class='text-center' style='width: auto; white-space: nowrap;'>$ ${formatNumber(item.valor_servicio)}</td>
                <td  class='text-center' style='width: auto; white-space: nowrap;'>$ ${formatNumber(item.servicios_especiales)}</td>
                <td  class='text-center' style='width: auto; white-space: nowrap;'>${item.num_compra ?? '-'}</td>
                <td  class='text-center' style='width: auto; white-space: nowrap;'>${item.num_factura ?? '-'}</td>
            </tr>
            `;
      });

      tbody.innerHTML = html;
   } catch (error) {
      console.error('Error:', error);
      tbody.innerHTML = `
            <tr><td colspan="24" class="text-danger">Error al conectar con el servidor.</td></tr>
        `;
   }
}

function getSelectedRows() {
   const rows = [];

   document.querySelectorAll('.row-check:checked').forEach(ch => {
      rows.push({
         recurso_id: ch.dataset.id,
         proveedor_id: ch.dataset.proveedor,
         pedido: ch.dataset.pedido,
      });
   });

   return rows;
}

// function exportarSeleccionadosExcel() {

//    const checkboxes = document.querySelectorAll('.row-check:checked');

//    if (checkboxes.length === 0) {
//       alert("No hay registros seleccionados.");
//       return;
//    }

//    const table = document.querySelector("#tbl-auditoria-factura");

//    // Obtener encabezados Omitiendo:
//    // - Primera columna (checkbox)
//    // - Últimas 2 columnas
//    let headers = [...table.querySelectorAll("thead th")]
//       .slice(1, -2)   // quita checkbox y dos últimas
//       .map(th => th.innerText.trim());

//    // Agregar columna final
//    headers.push("Número Orden");

//    let rowsData = [];
//    rowsData.push(headers);

//    // Recorrer filas seleccionadas
//    checkboxes.forEach(ch => {
//       const tr = ch.closest("tr");
//       const cells = [...tr.querySelectorAll("td")];

//       // Omitir:
//       // index 0 -> checkbox
//       // index -2 -> Número Orden Compra
//       // index -1 -> Número Factura
//       const selectedCells = cells.slice(1, -2);

//       let row = [];

//       selectedCells.forEach((td, index) => {
//          let value = td.innerText.trim();

//          // LIMPIAR N° DEL PEDIDO
//          if (index === 1) { // columna Pedido
//             value = value.replace(/^N°/gi, "").trim();
//          }

//          row.push(value);
//       });

//       // Agregar la última columna nueva vacía
//       row.push("");

//       rowsData.push(row);
//    });

//    // Crear Excel
//    const workbook = XLSX.utils.book_new();
//    const worksheet = XLSX.utils.aoa_to_sheet(rowsData);

//    XLSX.utils.book_append_sheet(workbook, worksheet, "Seleccionados");
//    XLSX.writeFile(workbook, "pedidos_seleccionados.xlsx");
// }

function exportarSeleccionadosExcel() {

   const checkboxes = document.querySelectorAll('.row-check:checked');

   if (checkboxes.length === 0) {
      alert("No hay registros seleccionados.");
      return;
   }

   const table = document.querySelector("#tbl-auditoria-factura");

   let headers = [...table.querySelectorAll("thead th")]
      .slice(1, -2)
      .map(th => th.innerText.trim());

   headers.push("Número Orden");

   let rowsData = [];
   rowsData.push(headers);

   let pedidos = []; // 👈 guardamos pedidos

   checkboxes.forEach(ch => {
      const tr = ch.closest("tr");
      const cells = [...tr.querySelectorAll("td")];

      const selectedCells = cells.slice(1, -2);
      let row = [];

      selectedCells.forEach((td, index) => {
         let value = td.innerText.trim();

         if (index === 1) { // Pedido
            value = value.replace(/^N°/gi, "").trim();
            pedidos.push(value); // 👈 guardamos pedido
         }

         row.push(value);
      });

      row.push("");
      rowsData.push(row);
   });

   const workbook = XLSX.utils.book_new();
   const worksheet = XLSX.utils.aoa_to_sheet(rowsData);
   XLSX.utils.book_append_sheet(workbook, worksheet, "Seleccionados");

   // ✅ nombre del archivo
   // const nombreArchivo = `pedido_${pedidos[0]}.xlsx`;
   const fecha = new Date().toISOString().slice(0, 10);
   const nombreArchivo = `pedidos_${fecha}_${pedidos.join('_')}.xlsx`;

   XLSX.writeFile(workbook, nombreArchivo);
}

async function CargarDetalleFactura(recurso_id, proveedor_id, estado_solicitud, estado_aprobacion) {
   const formData = new FormData();
   formData.append('recurso_id', recurso_id);
   formData.append('proveedor_id', proveedor_id);

   const response = await fetch(`${$('#base_url').val()}torrecontrol/GetDetalleFactura`, {
      method: 'POST',
      body: formData,
   });

   const json = await response.json();

   if (!json.success) {
      Swal.fire('Error', json.message, 'error');
      return;
   }

   const detalle = json.detalle[0];
   const servicios = json.servicios_especiales;
   const puntos_entrega = json.puntos_entrega;

   // ==================== LLENAR FORMULARIO ====================
   document.getElementById('placa').value = detalle.referencia;
   document.getElementById('nombre_conductor').value = detalle.nombre_conductor;
   document.getElementById('celular_conductor').value = detalle.cedula_conductor;
   document.getElementById('valor_servicio').value = formatNumber(detalle.valor_servicio);

   // ==================== PERFIL PROVEEDOR (42) ====================
   if (window.perfil === '43') {
      let htmlProveedores = '';
      let htmlPuntos = '';

      if (servicios.length === 0) {
         htmlProveedores = `<tr><td colspan="4" class="text-muted">No hay servicios especiales aprobados</td></tr>`;
      } else {
         servicios.forEach((s) => {
            htmlProveedores += `
                    <tr>
                        <td>${s.servicio_especial}</td>
                        <td>${s.proveedor}</td>
                        <td>
                            <input type="text" 
                                class="form-control form-control-sm valor-servicio" 
                                data-id="${s.id}"
                                data-recurso="${s.recurso_id}"
                                value="${formatNumber(s.valor_servicio)}" ${estado_solicitud === 'Pendiente' && estado_aprobacion === 'Pendiente' || estado_solicitud === 'null' && estado_aprobacion === 'null' ? '' : 'disabled'}>
                        </td>
                        <td>
                        ${estado_solicitud === 'Pendiente' && estado_aprobacion === 'Pendiente' || estado_solicitud === 'null' && estado_aprobacion === 'null' || estado_aprobacion === 'Rechazado'
                  ? `<input type="file" class="form-control form-control-sm soporte-servicio" data-id="${s.id}">`
                  : s.soporte_servicio_especial
                     ? `<a href="${$('#base_url').val()}${s.soporte_servicio_especial}" target="_blank" class="btn btn-outline-primary btn-sm me-1 px-1 py-0">Ver Soporte</a>`
                     : '<span class="text-muted">No cargado</span>'
               }
                        </td>
                    </tr>
                `;
         });
      }

      if (puntos_entrega.length === 0) {
         htmlPuntos = `<tr><td colspan="4" class="text-muted">No hay servicios especiales aprobados</td></tr>`;
      } else {
         puntos_entrega.forEach(p => {
            htmlPuntos += `
                     <tr>
                        <td>${p.referencia_pedido}</td>
                        <td>${p.ciudad_origen}</td>
                        <td>${p.remitente}</td>
                        <td>${p.ciudad_destino}</td>
                        <td>${p.destinatario}</td>
                    </tr>
            `;
         });
      }

      // if (estado_solicitud === "Pendiente" && estado_aprobacion === "Pendiente" || estado_solicitud === 'null' && estado_aprobacion === 'null') {
      if (estado_solicitud === 'null' && estado_aprobacion === 'null' || estado_solicitud === 'Rechazado' && estado_aprobacion === 'Rechazado') {
         document.getElementById('campo_soporte').style.display = '';
         // document.getElementById('campo_facturacion').style.display = '';
      } else {
         document.getElementById('campo_soporte').style.display = 'none';
         // document.getElementById('campo_soporte_facturacion').style.display = 'none';

         if (detalle.soporte_orden_compra) {
            document.getElementById('documento_orden_compra').innerHTML = `<a href="${$('#base_url').val()}${detalle.soporte_orden_compra
               }" target="_blank" class="btn btn-outline-info btn-sm me-1 px-1 py-0 w-100">Orden Compra</a>`;
         }

         if (detalle.soporte_facturacion && estado_solicitud === 'Aprobado' && estado_aprobacion === 'Aprobado' || estado_solicitud === 'Pendiente' && estado_aprobacion === 'Pendiente') {
            document.getElementById('documento_soporte').innerHTML = `<a href="${$('#base_url').val()}${detalle.soporte_facturacion
               }" target="_blank" class="btn btn-outline-info btn-sm me-1 px-1 py-0 w-100">Cumplido</a>`;
         } else {
            document.getElementById('campo_soporte').style.display = 'none';
            // document.getElementById('campo_facturacion').style.display = '';
         }

         if (detalle.soporte_factura && estado_solicitud === 'Aprobado' && estado_aprobacion === 'Aprobado' && detalle.soporte_factura) {
            document.getElementById('campo_soporte_facturacion').style.display = 'none';
            document.getElementById('documento_facturacion').innerHTML = `<a href="${$('#base_url').val()}${detalle.soporte_factura
               }" target="_blank" class="btn btn-outline-info btn-sm me-1 px-1 py-0 w-100">Factura</a>`;
         } else {
            document.getElementById('campo_soporte').style.display = 'none';
            // document.getElementById('campo_soporte_facturacion').style.display = 'none';
            // document.getElementById('campo_facturacion').style.display = '';
         }
      }

      document.getElementById('tbl_seguimiendo_facturacion_puntos').innerHTML = htmlPuntos;
      document.getElementById('tbl_seguimiendo_facturacion_servicios').innerHTML = htmlProveedores;
      return;
   }

   // ==================== PERFIL ADMIN O CLIENTE ====================
   else {
      let htmlAdmin = '';
      let htmlPuntos = '';
      let totalEspeciales = 0;

      // AQUÍ EL CAMBIO CORRECTO
      let totalFlete = limpiarNumeroUniversal(detalle.valor_servicio);

      servicios.forEach((s) => {
         totalEspeciales += Number(s.valor_servicio);

         htmlAdmin += `
            <tr>
                <td>${s.servicio_especial}</td>
                <td>${s.proveedor}</td>
                <td>$ ${formatNumber(s.valor_servicio)}</td>
                <td>
                    ${s.soporte_servicio_especial
               ? `<a href="${$('#base_url').val()}${s.soporte_servicio_especial
               }" target="_blank" class="btn btn-outline-primary btn-sm me-1 px-1 py-0">Ver Soporte</a>`
               : '<span class="text-muted">No cargado</span>'
            }
                </td>
            </tr>
        `;
      });

      if (puntos_entrega.length === 0) {
         htmlPuntos = `<tr><td colspan="4" class="text-muted">No hay servicios especiales aprobados</td></tr>`;
      } else {
         puntos_entrega.forEach(p => {
            htmlPuntos += `
                     <tr>
                        <td>${p.referencia_pedido}</td>
                        <td>${p.ciudad_origen}</td>
                        <td>${p.remitente}</td>
                        <td>${p.ciudad_destino}</td>
                        <td>${p.destinatario}</td>
                    </tr>
            `;
         });
      }

      if (detalle.soporte_facturacion) {
         document.getElementById('documento_soporte').innerHTML = `<a href="${$('#base_url').val()}${detalle.soporte_facturacion
            }" target="_blank" class="btn btn-outline-info btn-sm me-1 px-1 py-0 w-100">Cumplido</a>`;
      }

      if (detalle.soporte_factura) {
         document.getElementById('documento_facturacion').innerHTML = `<a href="${$('#base_url').val()}${detalle.soporte_factura
            }" target="_blank" class="btn btn-outline-info btn-sm me-1 px-1 py-0 w-100">Factura</a>`;
      }

      if (detalle.soporte_orden_compra) {
         document.getElementById('campo_orden_compra').style.display = 'none';
         document.getElementById('documento_orden_compra').innerHTML = `<a href="${$('#base_url').val()}${detalle.soporte_orden_compra
            }" target="_blank" class="btn btn-outline-info btn-sm me-1 px-1 py-0 w-100">Orden Compra</a>`;
      }

      document.getElementById('tbl_seguimiendo_facturacion_puntos').innerHTML = htmlPuntos;
      document.getElementById('tbl_servicios_admin').innerHTML = htmlAdmin;

      document.getElementById('total_especiales').value = formatNumber(totalEspeciales);

      // SUMA FINAL CORRECTA
      document.getElementById('total_general').value = formatNumber(totalEspeciales + totalFlete);
   }
}

async function procesarExcelOrdenes() {
   const input = document.getElementById("input_excel_ordenes");

   if (!input.files.length) {
      alert("Seleccione un archivo Excel primero.");
      return;
   }

   const file = input.files[0];
   const reader = new FileReader();

   reader.onload = async function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convertimos el excel en una matriz
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Buscamos índices de columnas
      const header = rows[0];
      const idxPedido = header.indexOf("Pedido");
      const idxOrden = header.indexOf("Número Orden");

      if (idxPedido === -1 || idxOrden === -1) {
         alert("El archivo no contiene las columnas 'Pedido' y 'Número Orden'.");
         return;
      }

      // Procesar filas
      let registros = [];

      for (let i = 1; i < rows.length; i++) {
         const pedidoRaw = rows[i][idxPedido];
         const ordenCompra = rows[i][idxOrden];

         if (!pedidoRaw || !ordenCompra) continue;

         // LIMPIAR SOLO "N°", Y RESPETAR COMAS Y GUIONES
         const pedido = pedidoRaw.toString()
            .replace(/^N°/gi, "")
            .trim();

         registros.push({
            pedido: pedido,
            orden: ordenCompra
         });

      }

      if (registros.length === 0) {
         alert("El archivo no contiene órdenes de compra para procesar.");
         return;
      }

      // ENVIAR LOS REGISTROS AL CONTROLADOR
      const base = $('#base_url').val();

      const response = await fetch(base + "torrecontrol/ActualizarOrdenesCompra", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(registros)
      });

      const json = await response.json();

      if (json.success) {
         alert("Órdenes actualizadas correctamente.");
      } else {
         alert("Ocurrió un error al actualizar.");
      }
   };

   reader.readAsArrayBuffer(file);
}

function formatNumber(num) {
   if (!num) return 0;

   // Convertir a string
   num = num.toString();

   // Quitar comas y espacios
   num = num.replace(/,/g, '');

   // Convertir a número
   const valor = parseFloat(num);

   if (isNaN(valor)) return 0;

   // Formatear a moneda colombiana
   return valor.toLocaleString('es-CO');
}

function limpiarNumero(num) {
   return parseFloat(num.replace(/\./g, '').replace(/,/g, ''));
}

function limpiarNumeroUniversal(num) {
   if (!num) return 0;

   // Convertir a string
   num = num.toString().trim();

   // Caso 1: formato USA "4,613,328.00"
   if (num.includes(',') && num.includes('.')) {
      // Quitar comas (miles), dejar punto como decimal
      num = num.replace(/,/g, '');
      return parseFloat(num);
   }

   // Caso 2: formato Colombiano "4.613.328,00"
   if (num.includes('.') && num.includes(',')) {
      // Quitar puntos de miles
      num = num.replace(/\./g, '');
      // convertir coma a punto decimal
      num = num.replace(/,/g, '.');
      return parseFloat(num);
   }

   // Caso 3: formato sin decimales "4613328"
   return parseFloat(num.replace(/[^0-9.-]/g, ''));
}
