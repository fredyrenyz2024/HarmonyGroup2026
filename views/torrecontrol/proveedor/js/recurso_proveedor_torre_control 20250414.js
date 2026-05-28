window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global

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

  const hoy = new Date();
  const opciones = { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" };

  // Formatear la fecha a "YYYY-MM-DD"
  const fechaColombia = new Intl.DateTimeFormat("es-CO", opciones)
    .format(hoy)
    .split("/")
    .reverse()
    .join("-");

  listar_recursos_proveedor(fechaColombia, fechaColombia, window.VENTANA);

  document.addEventListener("click", async (e) => {

    if (e.target.matches(`#campo-${window.VENTANA}-buscar`) || e.target.matches(`#campo-${window.VENTANA}-buscar *`)) {

      // if (document.getElementById(`campo-${window.VENTANA}-filtro`).value === "") {
      //   let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
      //   let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
      //   listar_pedidos_administrador(fecha_inicial, fecha_final);
      // } else {
      //   let filtro = document.getElementById(`campo-${window.VENTANA}-filtro`).value.trim();
      //   listar_pedidos_administrador('', '', filtro);
      // }

      let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
      let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
      listar_recursos_proveedor(fecha_inicial, fecha_final);
    }

    // if (e.target.matches("#btn_detalle_proceso_servicio") || e.target.matches("#btn_detalle_proceso_servicio *")) {
    //   let Enlace = e.target.closest("#btn_detalle_proceso_servicio");
    //   let MaestroId = Enlace.getAttribute("data-id");
    //   let ClienteId = Enlace.getAttribute("data-id2");
    //   let Proceso = Enlace.getAttribute("data-proceso");
    //   let EstadoRecurso = Enlace.getAttribute("data-EstadoRecurso");
    //   let proveedor_id = document.getElementById("proveedor_id").value;
    //   myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Detalle de solicitud de servicio N°` + MaestroId);
    //   myOffcanvas.updateContent(`
    //       <div class="col-12">
    //         <div class="row">
    //           <div class="container d-flex justify-content-center align-items-center">
    //             <div class="row text-black fw-bold text-center d-flex flex-wrap">
    //               <div class="col-auto mx-3 h6">Peso Neto total: <span  class="badge badge-phoenix badge-phoenix-primary" id="pesoNeto">0</span></div>
    //               <div class="col-auto mx-3 h6">Peso Bruto total: <span class="badge badge-phoenix badge-phoenix-primary" id="pesoBruto">0</span></div>
    //               <div class="col-auto mx-3 h6">Total Unidades: <span   class="badge badge-phoenix badge-phoenix-primary" id="totalUnidades">0</span></div>
    //             </div>
    //           </div>
    //           <hr class="my-1 text-dark">
    //            <h6 class="mb-0 text-body-highlight me-2">Pedidos</h6>
    //           <hr class="my-1 text-dark">
    //           <div class="table-responsive scrollbar">
    //             <table class="table table-sm text-center" style="font-size: 11px;">
    //               <thead>
    //                 <tr>
    //                   <th scope="col" scope="col" style='color:black;width: auto; white-space: nowrap;'>#</th>
    //                   <!--<th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Recurso</th>-->
    //                   <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Ref.Pedido</th>
    //                   <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Cod.Producto</th>
    //                   <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Producto</th>
    //                   <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Peso Neto</th>
    //                   <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Peso Bruto</th>
    //                   <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Empaque</th>
    //                   <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Cantidad</th>
    //                   <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>No. Estibas</th>
    //                   <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Origen</th>
    //                   <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Destino</th>
    //                   <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Fecha Cargue</th>
    //                   <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Fecha Descargue</th>
    //                   <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Remitente</th>
    //                   <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Destinatario</th>
    //                   <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Trazabilidad</th>
    //                   <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Estado</th>
    //                   <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Acciones</th>
    //                 </tr>
    //               </thead>
    //               <tbody id="tbody_servicios_pedidos_recurso" class="text-center">
    //                 <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
    //               </tbody>
    //             </table>
    //           </div>
    //           <hr class="my-1 text-dark">
    //            <div class="d-flex align-items-center justify-content-between">
    //             <h6 class="mb-0 me-2 d-flex align-items-center justify-content-center">Servicios</h6>
    //               <div class="col-11">
    //                 <div class="row justify-content-end">
    //                   <div class="col-auto">
    //                     <button class="btn btn-primary btn-sm py-1" id="btn_iniciar_recurso" type="button" data-RecursoId=${MaestroId} data-procesoId=${Proceso}>
    //                       <span class="uil uil-save"></span> Iniciar
    //                     </button>
    //                   </div>
    //                 </div>
    //               </div>
    //            </div>
    //           <hr class="my-1 text-dark">
    //           <div class="table-responsive scrollbar" style="display: none;" id="tbl_recursos_proveedor">
    //             <table class="table table-sm text-center" style="font-size: 11px;">
    //               <thead>
    //                 <tr>
    //                   <th scope="col" style='width: auto; white-space: nowrap;'>Proveedor</th>
    //                   <th scope="col" style='width: auto; white-space: nowrap;'>Servicio</th>
    //                   <th scope="col" style='width: auto; white-space: nowrap;'>Vehiculo</th>
    //                   <th scope="col" style='width: auto; white-space: nowrap;'>Fecha Registro</th>
    //                   <th scope="col" style='width: auto; white-space: nowrap;'>Fecha Limite</th>
    //                   <th scope="col" style='width: auto; white-space: nowrap;'>Estado</th>
    //                   <th scope="col" style='width: auto; white-space: nowrap;'>Acciones</th>
    //                 </tr>
    //               </thead>
    //               <tbody id="tbody_servicios_recurso" class="text-center">
    //                 <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
    //               </tbody>
    //             </table>
    //               <hr class="my-1 text-dark">
    //                 <h6 class="mb-0 me-2 d-flex align-items-center justify-content-start">Valores Propuestos</h6>
    //               <hr class="my-1 text-dark">
    //               <table class="table table-sm text-center" style="font-size: 11px;">
    //                 <thead>
    //                   <tr>
    //                     <th scope="col" style='width: auto; white-space: nowrap;'>#</th>
    //                     <th scope="col" style='width: auto; white-space: nowrap;'>Valor Propuesto</th>
    //                     <th scope="col" style='width: auto; white-space: nowrap;'>Fecha Inicio</th>
    //                     <th scope="col" style='width: auto; white-space: nowrap;'>Cedula conductor</th>
    //                     <th scope="col" style='width: auto; white-space: nowrap;'>Nombre conductor</th>
    //                     <th scope="col" style='width: auto; white-space: nowrap;'>Placa</th>
    //                   </tr>
    //                 </thead>
    //                 <tbody id="tbody_propuestos_proveedor" class="text-center">
    //                   <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
    //                 </tbody>
    //               </table>
    //           </div>

    //           <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" id="cargue_masivo" style="display:none;">
    //             <!-- 1) Input para seleccionar el archivo de Excel -->
    //             <div class="mb-3">
    //               <label class="form-label" for="customFileSm">Subir Archivo</label>
    //               <input type="file" class="form-control form-control-sm" id="excelFile" accept=".xls, .xlsx" onchange="leerExcel()" placeholder="Seleccionar Archivo">
    //             </div>
    //           </div>

    //           <!-- 3) Área de previsualización -->
    //           <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" id="visualizar_pedidos"
    //             style="display:none;">
    //             <h6>Vista Previa</h6>
    //             <div class="form-group col-xs-12">
    //               <div class="table-responsive">
    //                 <table class="table table-striped table-sm" id="previewTable" cellpadding="0" border="1"
    //                   style="width: 100%; border: #332D2D;">
    //                   <!-- Aquí se generarán dinámicamente las filas -->
    //                 </table>
    //               </div>
    //             </div>
    //           </div>
    //           <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
    //             <div class="row justify-content-end">
    //               <div class="col-auto">
    //                 <button class="btn btn-success btn-sm py-1" id="btn_guardar_trazabilidad" type="button" style="display: none;"> 
    //                   <span class="uil uil-import"></span> Importar Trazabilidad
    //                 </button>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //   `);

    //   Listar_pedidos_recursos(MaestroId, proveedor_id, Proceso, EstadoRecurso);
    //   myOffcanvas.updateHeight('100vh');
    //   myOffcanvas.updateWidth('75%');
    //   myOffcanvas.updateClass('offcanvas-end');
    //   myOffcanvas.show();
    // }

    if (e.target.matches("#btn_detalle_proceso_servicio") || e.target.matches("#btn_detalle_proceso_servicio *")) {
      let Enlace = e.target.closest("#btn_detalle_proceso_servicio");
      let MaestroId = Enlace.getAttribute("data-id");
      let ClienteId = Enlace.getAttribute("data-id2");
      let Proceso = Enlace.getAttribute("data-proceso");
      let EstadoRecurso = Enlace.getAttribute("data-EstadoRecurso");
      let proveedor_id = document.getElementById("proveedor_id").value;
      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Detalle de solicitud de servicio N°` + MaestroId);
      myOffcanvas.updateContent(`
          <div class="col-12">
            <div class="row">
              <div class="container d-flex justify-content-center align-items-center">
                <div class="row text-black fw-bold text-center d-flex flex-wrap">
                  <div class="col-auto mx-3 h6">Peso Neto total: <span  class="badge badge-phoenix badge-phoenix-primary" id="pesoNeto">0</span></div>
                  <div class="col-auto mx-3 h6">Peso Bruto total: <span class="badge badge-phoenix badge-phoenix-primary" id="pesoBruto">0</span></div>
                  <div class="col-auto mx-3 h6">Total Unidades: <span   class="badge badge-phoenix badge-phoenix-primary" id="totalUnidades">0</span></div>
                </div>
              </div>
              
              <hr class="my-1 text-dark">
               <h6 class="mb-0 text-body-highlight me-2">Pedidos</h6>
              <hr class="my-1 text-dark">
              <div class="table-responsive scrollbar">
                <table class="table table-sm text-center" style="font-size: 11px;">
                  <thead>
                    <tr>
                      <th scope="col" scope="col" style='color:black;width: auto; white-space: nowrap;'>#</th>
                      <!--<th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Recurso</th>-->
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Ref.Pedido</th>
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Cod.Producto</th>
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Producto</th>
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Peso Neto</th>
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Peso Bruto</th>
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Empaque</th>
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Cantidad</th>
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>No. Estibas</th>
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Origen</th>
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Destino</th>
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Fecha Cargue</th>
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Fecha Descargue</th>
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Remitente</th>
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Destinatario</th>
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Trazabilidad</th>
                      <th class="text-center" scope="col" style='color:black;width: auto; white-space: nowrap;'>Estado</th>
                      <th class="text-center" scope="col" style='width: auto; white-space: nowrap;'>Acciones</th>
                    </tr>
                  </thead>
                  <tbody id="tbody_servicios_pedidos_recurso" class="text-center">
                    <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
                  </tbody>
                </table>
              </div>

              <hr class="my-1 text-dark">
                <div class="d-flex align-items-center justify-content-between">
                 <h6 class="mb-0 me-2 d-flex align-items-center justify-content-center">Servicios Especiales</h6>
               </div>
              <hr class="my-1 text-dark">

              <!-- Este es el contenedor de los tabs (debe estar en tu HTML) -->
              <ul class="nav nav-underline fs-9" id="cabecera_proveedores_servicios_especiales" role="tablist">
                <!-- Los tabs se generarán dinámicamente aquí -->
              </ul>

              <div id="detalle_proveedores_servicios_especiales"></div>

              <hr class="my-1 text-dark">
                  <div class="d-flex align-items-center justify-content-between">
                  <h6 class="mb-0 me-2 d-flex align-items-center justify-content-center">Observaciones</h6>
                </div>
              <hr class="my-1 text-dark">
              <textarea class="form-control form-control-sn observacion_opcion" disabled id="observacion_recurso" rows="1" placeholder="Observaciones" oninput="this.value = this.value.toUpperCase();"></textarea>

              <hr class="my-1 text-dark">
               <div class="d-flex align-items-center justify-content-between">
                <h6 class="mb-0 me-2 d-flex align-items-center justify-content-center">Servicios</h6>
                  <div class="col-11">
                    <div class="row justify-content-end">
                      <div class="col-auto">
                        <button class="btn btn-primary btn-sm py-1" id="btn_iniciar_recurso" type="button" data-RecursoId=${MaestroId} data-procesoId=${Proceso}>
                          <span class="uil uil-save"></span> Iniciar
                        </button>
                      </div>
                    </div>
                  </div>
               </div>
              <hr class="my-1 text-dark">
              <div class="table-responsive scrollbar" style="display: none;" id="tbl_recursos_proveedor">
                <table class="table table-sm text-center" style="font-size: 11px;">
                  <thead>
                    <tr>
                      <th scope="col" style='width: auto; white-space: nowrap;'>Proveedor</th>
                      <th scope="col" style='width: auto; white-space: nowrap;'>Servicio</th>
                      <th scope="col" style='width: auto; white-space: nowrap;'>Vehiculo</th>
                      <th scope="col" style='width: auto; white-space: nowrap;'>Fecha Registro</th>
                      <th scope="col" style='width: auto; white-space: nowrap;'>Fecha Limite</th>
                      <th scope="col" style='width: auto; white-space: nowrap;'>Estado</th>
                      <th scope="col" style='width: auto; white-space: nowrap;'>Acciones</th>
                    </tr>
                  </thead>
                  <tbody id="tbody_servicios_recurso" class="text-center">
                    <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
                  </tbody>
                </table>
                  <hr class="my-1 text-dark">
                    <h6 class="mb-0 me-2 d-flex align-items-center justify-content-start">Valores Propuestos</h6>
                  <hr class="my-1 text-dark">
                  <table class="table table-sm text-center" style="font-size: 11px;">
                    <thead>
                      <tr>
                        <th scope="col" style='width: auto; white-space: nowrap;'>#</th>
                        <th scope="col" style='width: auto; white-space: nowrap;'>Valor Propuesto</th>
                        <th scope="col" style='width: auto; white-space: nowrap;'>Fecha Inicio</th>
                        <th scope="col" style='width: auto; white-space: nowrap;'>Cedula conductor</th>
                        <th scope="col" style='width: auto; white-space: nowrap;'>Nombre conductor</th>
                        <th scope="col" style='width: auto; white-space: nowrap;'>Placa</th>
                      </tr>
                    </thead>
                    <tbody id="tbody_propuestos_proveedor" class="text-center">
                      <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
                    </tbody>
                  </table>
                  <INPUT type="hidden" id="PlacaGanadora">
              </div>

              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" id="cargue_masivo" style="display:none;">
                <!-- 1) Input para seleccionar el archivo de Excel -->
                <div class="mb-3">
                  <label class="form-label" for="customFileSm">Subir Archivo</label>
                  <input type="file" class="form-control form-control-sm" id="excelFile" accept=".xls, .xlsx" onchange="leerExcel()" placeholder="Seleccionar Archivo">
                </div>
              </div>

              <!-- 3) Área de previsualización -->
              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" id="visualizar_pedidos"
                style="display:none;">
                <h6>Vista Previa</h6>
                <div class="form-group col-xs-12">
                  <div class="table-responsive">
                    <table class="table table-striped table-sm" id="previewTable" cellpadding="0" border="1"
                      style="width: 100%; border: #332D2D;">
                      <!-- Aquí se generarán dinámicamente las filas -->
                    </table>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <div class="row justify-content-end">
                  <div class="col-auto">
                    <button class="btn btn-success btn-sm py-1" id="btn_guardar_trazabilidad" type="button" style="display: none;"> 
                      <span class="uil uil-import"></span> Importar Trazabilidad
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      `);

      Listar_pedidos_recursos(MaestroId, proveedor_id, Proceso, EstadoRecurso);
      myOffcanvas.updateHeight('100vh');
      myOffcanvas.updateWidth('75%');
      myOffcanvas.updateClass('offcanvas-end');
      myOffcanvas.show();
    }

    if (e.target.matches("#btn_proceso_servicios_recurso") || e.target.matches("#btn_proceso_servicios_recurso *")) {
      let recurso = e.target.getAttribute("data-recurso");
      let numdoc = e.target.getAttribute("data-numdoc_solicitud");

      let filaProveedores = document.getElementById(`Recurso_proveedores_${numdoc}`);

      if (!filaProveedores) {
        console.error(`No se encontró el <tr> con id #Recurso_proveedores_${numdoc}`);
        return;
      }

      // Mostrar u ocultar la fila de servicios
      if (filaProveedores.style.display === "none") {
        filaProveedores.style.display = "table-row";

        // Obtener servicios si aún no se han cargado
        if (filaProveedores.querySelector(".lista-proceso-proveedores").innerHTML.trim() === "") {

          try {
            let formData = new FormData();
            formData.append("MaestroId", recurso);
            // formData.append("numdoc", numdoc);

            // let response = await fetch($('#base_url').val() + 'torrecontrol/listar_detalle_proveedores_servicio', {
            let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_servicios_pedidos_recursos', {
              method: "POST",
              body: formData
            });
            let data = await response.json();
            if (data) {
              let serviciosHTML = ' <div class="accordion" id="accordionExample">';
              data.forEach((proveedor) => {
                serviciosHTML += `
                  <div class="accordion-item border-top">
                    <h2 class="accordion-header" id="TipoServicio${proveedor.tipo_servicio}">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#TipoServicio_${proveedor.servicio_id}" aria-expanded="false" aria-controls="TipoServicio_${proveedor.servicio_id}">
                        ${proveedor.tipo_servicio}
                      </button>
                    </h2>
                    <div class="accordion-collapse collapse" id="TipoServicio_${proveedor.servicio_id}" aria-labelledby="TipoServicio${proveedor.tipo_servicio}" data-bs-parent="#accordionExample" style="">
                      <div class="accordion-body pt-0" id="contenido${proveedor.servicio_id}"></div>
                    </div>
                  </div>
                `;
              });
              serviciosHTML += '</div>';
              filaProveedores.querySelector(".lista-proceso-proveedores").innerHTML = serviciosHTML;
            } else {
              filaProveedores.querySelector(".lista-proceso-proveedores").innerHTML = `<p class="text-danger">${data.message}</p>`;
            }
          } catch (error) {
            console.error("Error al obtener servicios:", error);
            filaProveedores.querySelector(".lista-proceso-proveedores").innerHTML = `<p class="text-danger">Error al cargar proveedores</p>`;
          } finally { }
        }
      }
    }

    if (e.target.matches("#btn_iniciar_recurso") || e.target.matches("#btn_iniciar_recurso *")) {
      let enlace = e.target.closest("#btn_iniciar_recurso");
      let RecursoId = enlace.getAttribute("data-RecursoId");
      let proceso = enlace.getAttribute("data-procesoId");
      let SolicitudesId = enlace.getAttribute("data-SolicitudesId");
      let proveedor_id = document.getElementById("proveedor_id").value;

      try {
        let formData = new FormData();
        formData.append("RecursoId", RecursoId);
        formData.append("proveedor_id", proveedor_id);
        formData.append("proceso", proceso);
        formData.append("SolicitudesId", SolicitudesId);

        let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_recursos_proveedor', {
          method: "POST",
          body: formData
        });

        let data = await response.json();
        if (data) {
          document.getElementById("tbl_recursos_proveedor").style.display = "";
          let rows = "";
          let col_estatus_publicacion = '';
          let btn_postular_gestion_servicio = '';
          data.forEach((servicio, index) => {
            if (servicio.estado_servicio === 'Pendiente Iniciar') {
              col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              btn_postular_gestion_servicio = `
              <div class="form-check form-switch text-center">
                <input class="form-check-input me-2" type="checkbox" name="ProveedorServiciodetalle" data-proveedorId="${servicio.proveedorId}" data-TipoServicio="${servicio.tipo_servicio}" data-pedidosId="${SolicitudesId}" data-recursoId="${RecursoId}" id="servicio_${servicio.servicioId}" value="${servicio.servicioId}">
              </div>`;
            } else if (servicio.estado_servicio === 'Iniciado') {
              col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              btn_postular_gestion_servicio = ``;
            } else if (servicio.estado_servicio === 'Cancelado') {
              col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              // btn_publicacion = `<a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido" data-id="${servicio.numdoc_solicitud}" data-id2="${servicio.cliente}"><span class="uil uil-feedback"></span> Publicar Pedido</a>`;
              btn_postular_gestion_servicio = ``;
            } else if (servicio.estado_servicio === 'Completado') {
              col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              btn_postular_gestion_servicio = ``;
            } else if (servicio.estado_servicio === 'Rechazado') {
              col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              btn_postular_gestion_servicio = ``;
            } else if (servicio.estado_servicio === 'Postulado') {
              col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              btn_postular_gestion_servicio = ``;
            }

            rows += `
                <tr>
                  <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.razon_social}</td>
                  <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.tipo_servicio}</td>
                  <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.vehiculo}</td>
                  <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.Fecha_registro}</td>
                  <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_limite}</td>
                  <td class='text-center' style='width: auto; white-space: nowrap;'>${col_estatus_publicacion}</td>
                  <td class='text-center' style='width: auto; white-space: nowrap;'>
                    ${btn_postular_gestion_servicio}
                  </td>
                </tr>
                <tr id="detalle_recurso_proveedores_asignados_${servicio.servicioId}" style="display: none;">
                  <td colspan="12">
                    <div class="lista-detalle-accion-proveedores"></div>
                  </td>
                </tr>
              `;
          });

          document.getElementById("tbody_servicios_recurso").innerHTML = rows;
          Listar_pedidos_recursos(RecursoId, proveedor_id, proceso);
          listar_recursos_proveedor(fechaColombia, fechaColombia, window.VENTANA);
        } else {
          document.getElementById("tbody_servicios_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
        }
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        document.getElementById("tbody_servicios_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
      }
    }

    if (e.target.matches("#btn_guardar_postulacion") || e.target.matches("#btn_guardar_postulacion *")) {
      let enlace = e.target.closest("#btn_guardar_postulacion");
      let proveedorId = enlace.getAttribute("data-id");
      let servicioId = enlace.getAttribute("data-id2");
      let PedidosId = enlace.getAttribute("data-id3");
      // console.log("🚀 ~ PedidosId:", typeof JSON.stringify(PedidosId));
      let SolicitudesArray = PedidosId.split(",").map(Number);
      // let SolicitudesArray = PedidosId.split(","); 

      let TipoServicio = enlace.getAttribute("data-id4");
      let Porceso = enlace.getAttribute("data-id5");
      let RecursoId = enlace.getAttribute("data-id6");
      let fecha_inicio = document.getElementById("fecha_inicio").value.trim();
      let hora_inicio = document.getElementById("hora_inicio").value.trim();

      let formData = new FormData();
      let errores = [];

      if (TipoServicio === "Despachos" || TipoServicio === "Transporte") {
        let placa = document.getElementById("placa").value.trim();
        let flete = document.getElementById("flete").value.trim();
        let cedula_conductor = document.getElementById("cedula_conductor").value.trim();
        let nombre_conductor = document.getElementById("nombre_conductor").value.trim();

        if (!placa) errores.push("El campo Placa es obligatorio.");
        if (!flete) errores.push("El campo Flete es obligatorio.");
        if (!fecha_inicio) errores.push("El campo Fecha Inicio es obligatorio.");
        if (!hora_inicio) errores.push("El campo Hora Inicio es obligatorio.");

        //Nuevos datos para los otros metodos
        let capacidad = document.getElementById("capacidad").value.trim();
        let tiempo_libre = document.getElementById("tiempo_libre").value.trim();
        let valor_dia = document.getElementById("valor_dia").value.trim();
        let estado_vehiculo = document.getElementById("estado_vehiculo").value.trim();
        let contenedor = document.getElementById("contenedor").value.trim();
        let tara = document.getElementById("tara").value.trim();

        if (errores.length > 0) {
          alert(errores.join("\n"));
          return;
        }

        formData.append("proveedorId", proveedorId);
        formData.append("servicioId", servicioId);
        formData.append("PedidosId", JSON.stringify(SolicitudesArray));
        formData.append("placa", placa);
        formData.append("flete", flete);
        formData.append("cedula_conductor", cedula_conductor);
        formData.append("nombre_conductor", nombre_conductor);
        formData.append("fecha_inicio", fecha_inicio);
        formData.append("hora_inicio", hora_inicio);
        formData.append("capacidad", capacidad);
        formData.append("tiempo_libre", tiempo_libre);
        formData.append("valor_dia", valor_dia);
        formData.append("estado_vehiculo", estado_vehiculo);
        formData.append("contenedor", contenedor);
        formData.append("tara", tara);
        formData.append("Proceso", Porceso);
        formData.append("RecursoId", RecursoId);
      } else {
        let costo_servicio = document.getElementById("costo_servicio").value.trim();
        let fecha_inicio = document.getElementById("fecha_inicio").value.trim();
        let hora_inicio = document.getElementById("hora_inicio").value.trim();

        if (!costo_servicio) errores.push("El campo Costo del Servicio es obligatorio.");
        if (!fecha_inicio) errores.push("El campo Fecha Inicio es obligatorio.");
        if (!hora_inicio) errores.push("El campo Hora Inicio es obligatorio.");

        if (errores.length > 0) {
          alert(errores.join("\n"));
          return;
        }
        formData.append("proveedorId", proveedorId);
        formData.append("servicioId", servicioId);
        formData.append("PedidosId", JSON.stringify(SolicitudesArray));
        formData.append("costo_servicio", costo_servicio);
        formData.append("fecha_inicio", fecha_inicio);
        formData.append("hora_inicio", hora_inicio);
        formData.append("Proceso", Porceso);
        formData.append("RecursoId", RecursoId);
      }

      if (errores.length === 0) {
        const result = await Swal.fire({
          title: "Seguro",
          text: "¿Desea guardar la respuesta?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3B71CA",
          cancelButtonColor: "#9FA6B2",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          customClass: {
            popup: "swal2-custom-font",
          },
        });

        if (result.isConfirmed) {
          const btn = document.querySelector("#btn_guardar_postulacion");

          btn.disabled = true;
          btn.innerHTML = "Guardando Posulación... ⏳";

          try {
            const response = await fetch($('#base_url').val() + 'torrecontrol/insertar_postulacion', {
              method: 'POST',
              body: formData,
              cache: 'no-cache',
            });

            const data = await response.json();

            Swal.fire({
              title: "Mensaje!",
              text: data.message,
              icon: data.status ? "success" : "error",
              draggable: true
            }).then((result) => {
              if (result.isConfirmed) {
                // location.reload(); // Recargar la página
                // myOffcanvas.hide();
                // listar_recursos_proveedor(fechaColombia, fechaColombia);
                Listar_servicios(RecursoId, Porceso, SolicitudesArray, proveedorId);
              }
            });

          } catch (err) {
            console.error(err);
            Swal.fire("Error", "Error al enviar datos al servidor.", "error");
          } finally {
            btn.disabled = false;
            btn.innerHTML = " <span class='uil uil-file-import'></span> Guardar Postulación";
          }

        }

      }
    }

    const buttonCargarTrazabilidad = e.target.closest('[id^="btn_cargar_trazabilidad_"]');
    if (buttonCargarTrazabilidad) {
      let ServicioId = buttonCargarTrazabilidad.getAttribute("data-ServicioId");
      let RecursoId = buttonCargarTrazabilidad.getAttribute("data-RecursoId");
      document.getElementById("cargue_masivo").style.display = "";
      document.getElementById("visualizar_pedidos").style.display = "";
      document.getElementById("btn_guardar_trazabilidad").style.display = "";
      // CargarTrazabilidad(ServicioId, RecursoId);
      document.getElementById("btn_guardar_trazabilidad").setAttribute("data-ServicioId", ServicioId);
      document.getElementById("btn_guardar_trazabilidad").setAttribute("data-RecursoId", RecursoId);
    }

    if (e.target.matches("#btn_guardar_trazabilidad") || e.target.matches("#btn_guardar_trazabilidad *")) {
      let ServicioId = e.target.closest("[data-ServicioId]").getAttribute("data-ServicioId");
      let RecursoId = e.target.closest("[data-RecursoId]").getAttribute("data-RecursoId");

      if (globalData.length === 0) {
        Swal.fire({
          title: "Mensaje!",
          text: "No hay datos para enviar. Primero carga y previsualiza un archivo de Excel.",
          icon: "warning",
          draggable: true
        });
        return;
      }

      const result = await Swal.fire({
        title: 'Seguro',
        text: '¿Desea aprobar la solicitud?',
        icon: 'warning',
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
        const btn = document.querySelector("#btn_guardar_trazabilidad");
        btn.disabled = true;
        btn.innerHTML = "Importando... ⏳";

        try {
          // Crear objeto FormData
          let formData = new FormData();
          formData.append("ServicioId", ServicioId);
          formData.append("RecursoId", RecursoId);
          formData.append("globalData", JSON.stringify(globalData));  // Convertimos globalData a JSON

          const response = await fetch($('#base_url').val() + 'torrecontrol/importar_trazabilidad', {
            method: 'POST',
            body: formData
          });

          const data = await response.json();

          Swal.fire({
            title: "Mensaje!",
            text: data.message,
            icon: data.status === true ? "success" : "error",
            draggable: true
          });

        } catch (err) {
          console.error(err);
          alert("Error al enviar datos al servidor.");
        } finally {
          btn.disabled = false;
          btn.innerHTML = "<span class='uil uil-file-import'></span> Importar Trazabilidad";
        }
      }
    }

    if (e.target.matches("#btn_gestion_pedido") || e.target.matches("#btn_gestion_pedido *")) {
      let MaestroId = e.target.getAttribute("data-id");
      //offcanvas-bottom
      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Gestion Pedido N°` + MaestroId);
      myOffcanvas.updateContent(`
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <h4 class="text-center" style="font-weight: bold;">Progreso del Pedido</h4>
          <div class="progress" style="height:15px">
            <div class="progress-bar progress-bar-striped active rounded-3" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;width: 0;" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top"></div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-4" id="tabla_gestion_actividades">
          <h4 class="text-center" style="font-weight: bold;">Listado de actividades</h4>
          <div class="bs-example" data-example-id="simple-table">
            <table class="table table-sm" style="font-size:12px;">
              <thead class='table-bordered'>
                <tr>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>#</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Parametro</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Actividad</th>
                  <!--<th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Costo</th>-->
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Responsable</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Criterio</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Fecha Base</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Vencimiento</th>
                  <!--<th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Tiempo Vencimiento</th>-->
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Tiempo Parametrizado</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Estado</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Acción</th>
                </tr>
              </thead>
              <tbody id="tbody_actividades"></tbody>
            </table>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="gestion_pedido"></div>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div id="detalle_gestion"></div>
        </div>

      `);

      setTimeout(() => {
        Listar_actividades_pedido(MaestroId);
      }, 50);

      myOffcanvas.updateHeight('100vh');
      myOffcanvas.updateWidth('100%');
      myOffcanvas.updateClass('offcanvas-bottom');
      myOffcanvas.show();
    }

    if (e.target.matches('#btn_cerrar_gestion') || e.target.matches('#btn_cerrar_gestion *')) {
      // alert("hola");
      document.getElementById('btn_cerrar_gestion').style.display = 'none';
      document.getElementById('btn_detalle_gestion').style.display = 'block';
      document.getElementById('btn_agregar_solicitud').style.display = 'block';
      document.getElementById('acordeones_parametros').style.display = 'block';
      document.getElementById('tabla_gestion_actividades').style.display = 'block';
      document.getElementById('btn_editar_pedido').style.display = 'block';
      // document.getElementById("btn_inicio_gestion").style.display = "block";
      var contenido = document.getElementById('detalle_gestion');
      contenido.innerHTML = ''; // Elimina el contenido
    }

    let Boton_cancelar;
    let Boton_guardar_gestion;
    // if (e.target.matches('#btn_gestion_actividad_proveedor') || e.target.matches('#btn_gestion_actividad_proveedor *')) {
    //   var padre = e.target.parentElement.parentElement;
    //   var Procesos = padre.querySelector('#btn_gestion_actividad_proveedor');
    //   var proceso_id = Procesos.getAttribute('data-idproceso');
    //   var actividad_id = Procesos.getAttribute('data-idactividad');
    //   // console.log("Proceso: " + proceso_id + " Actividad: " + actividad_id);
    //   var form_gestio = document.getElementById(`proceso_numero${actividad_id}`);
    //   var numero_proceso = form_gestio.getAttribute('data-idnum_proceso');
    //   // console.log("Numero de proceso del formulario: " + numero_proceso);
    //   Boton_cancelar = document.getElementById(`btn_cancelar_gestion${actividad_id}`);
    //   Boton_guardar_gestion = document.getElementById(`btn_guardar_gestion${actividad_id}`);
    //   // Boton_detalle_actividad = document.getElementById(`btn_guardar_gestion${actividad_id}`);

    //   if (actividad_id === numero_proceso) {
    //     document.getElementById(`columnaproceso${numero_proceso}`).style.display = document.getElementById(`columnaproceso${numero_proceso}`).style.display === 'none' ? 'table-row' : 'none';
    //     Boton_cancelar.addEventListener('click', async e => {
    //       document.getElementById(`columnaproceso${numero_proceso}`).style.display = 'none';
    //     });
    //     Boton_guardar_gestion.addEventListener('click', async e => {
    //       let PedidoId = Boton_guardar_gestion.getAttribute('data-PedidoId');
    //       let MaestroId = Boton_guardar_gestion.getAttribute('data-MaestroId');

    //       if (document.getElementById('estado_actividad' + actividad_id).value === '') {
    //         mensaje = `
    //         <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
    //           <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
    //             <strong>Mensaje!</strong> <p class="mb-0 flex-1"> Debe seleccionar un estado para este pedido</p>
    //           <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
    //         </div>
    //         `;
    //         document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
    //       } else if (document.getElementById('observacion_gestion' + actividad_id).value === '') {
    //         mensaje = `
    //         <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
    //           <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
    //             <strong>Mensaje!</strong> <p class="mb-0 flex-1"> Debe diligenciar una obsrvación  para poder gaurdar la gestión</p>
    //           <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
    //         </div>`;
    //         document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
    //         document.getElementById('observacion_gestion' + actividad_id).focus();
    //       } else {
    //         const result = await Swal.fire({
    //           title: "Seguro",
    //           text: "¿Desea realizar la operación de gestión?",
    //           icon: "question",
    //           showCancelButton: true,
    //           confirmButtonColor: "#3B71CA",
    //           cancelButtonColor: "#9FA6B2",
    //           confirmButtonText: "Aceptar",
    //           cancelButtonText: "Cancelar",
    //           customClass: {
    //             popup: "swal2-custom-font",
    //           },
    //         });

    //         if (result.isConfirmed) {
    //           let data = new FormData();
    //           data.append('nundoc', PedidoId);
    //           data.append('parametros_pedido', document.getElementById('parametros_pedido' + actividad_id).value);
    //           data.append('parametros_punto_pedido_opcion', document.getElementById('parametros_punto_pedido_opcion' + actividad_id).value);
    //           data.append('observacion', document.getElementById('observacion_gestion' + actividad_id).value);
    //           data.append('estado_actividad', document.getElementById('estado_actividad' + actividad_id).value);
    //           var documentos = document.getElementById('documento' + actividad_id).files[0];
    //           if (documentos !== undefined) {
    //             data.append('documento', documentos);
    //           } else {
    //             data.append('documento', 'Sin_evidencia');
    //           }
    //           // data.append("documento", document.getElementById("documento").files[0]);
    //           // var publicar = document.getElementById('publicar' + actividad_id);
    //           // if (publicar.checked) {
    //           //   data.append('publicar', 'SI');
    //           // } else {
    //           //   data.append('publicar', 'NO');
    //           // }
    //           data.append('publicar', 'NO');
    //           await fetch($('#base_url').val() + 'torrecontrol/Insertar_gestion_pedido', {
    //             method: 'POST',
    //             body: data,
    //             cache: 'no-cache',
    //           })
    //             .then(res => (res.ok ? res.json() : Promise.reject(res)))
    //             .catch(error => {
    //               alert(JSON.stringify(error.length) || 'Error al cargar las solicitudes');
    //             })
    //             .then(response => {
    //               if (response.numero === 200) {
    //                 mensaje = `
    //                 <div class="alert alert-outline-success d-flex align-items-center" role="alert">
    //                   <span class="fas fa-check-circle text-success fs-5 me-3"></span>
    //                   <strong>Mensaje!</strong> <p class="mb-0 flex-1">${response.mensaje}</p>
    //                   <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
    //                 </div>`;
    //                 // Numero_actividades(PedidoId);
    //               } else {
    //                 mensaje = `
    //                   <div class="alert alert-outline-danger d-flex align-items-center" role="alert">
    //                     <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
    //                       <strong>Mensaje!</strong> <p class="mb-0 flex-1">${response.mensaje}</p>
    //                     <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
    //                   </div>`;
    //               }
    //               setTimeout(function () {
    //                 // location.reload(false);
    //                 Listar_actividades_pedido(MaestroId);
    //                 // Numero_actividades(PedidoId);
    //                 document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
    //               }, 1500);
    //             });
    //         }
    //       }
    //     });
    //   }
    // }
    if (e.target.matches('#btn_gestion_actividad_proveedor') || e.target.matches('#btn_gestion_actividad_proveedor *')) {
      var padre = e.target.parentElement.parentElement;
      var Procesos = padre.querySelector('#btn_gestion_actividad_proveedor');
      var proceso_id = Procesos.getAttribute('data-idproceso');
      var actividad_id = Procesos.getAttribute('data-idactividad');
      // console.log("Proceso: " + proceso_id + " Actividad: " + actividad_id);
      var form_gestio = document.getElementById(`proceso_numero${actividad_id}`);
      var numero_proceso = form_gestio.getAttribute('data-idnum_proceso');
      // console.log("Numero de proceso del formulario: " + numero_proceso);
      Boton_cancelar = document.getElementById(`btn_cancelar_gestion${actividad_id}`);
      Boton_guardar_gestion = document.getElementById(`btn_guardar_gestion${actividad_id}`);
      Select_Estado_Actividad = document.getElementById(`estado_actividad${actividad_id}`);
      Select_Estado_Actividad.addEventListener('change', async e => {
        if (Select_Estado_Actividad.value === 'COMPLETADO') {
          document.getElementById(`costo_ejecutado${actividad_id}`).disabled = false;
          document.getElementById(`costo_ejecutado${actividad_id}`).value = '';
        } else {
          document.getElementById(`costo_ejecutado${actividad_id}`).disabled = true;
          document.getElementById(`costo_ejecutado${actividad_id}`).value = '';
        }
      });

      if (actividad_id === numero_proceso) {
        document.getElementById(`columnaproceso${numero_proceso}`).style.display = document.getElementById(`columnaproceso${numero_proceso}`).style.display === 'none' ? 'table-row' : 'none';
        Boton_cancelar.addEventListener('click', async e => {
          document.getElementById(`columnaproceso${numero_proceso}`).style.display = 'none';
        });
        Boton_guardar_gestion.addEventListener('click', async e => {
          let PedidoId = Boton_guardar_gestion.getAttribute('data-PedidoId');
          let MaestroId = Boton_guardar_gestion.getAttribute('data-MaestroId');

          if (document.getElementById('estado_actividad' + actividad_id).value === '') {
            mensaje = `
            <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
              <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                <strong>Mensaje!</strong> <p class="mb-0 flex-1"> Debe seleccionar un estado para este pedido</p>
              <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `;
            document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
          } else if (document.getElementById('observacion_gestion' + actividad_id).value === '') {
            mensaje = `
            <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
              <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                <strong>Mensaje!</strong> <p class="mb-0 flex-1"> Debe diligenciar una obsrvación  para poder gaurdar la gestión</p>
              <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
            document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
            document.getElementById('observacion_gestion' + actividad_id).focus();
          } else {
            const result = await Swal.fire({
              title: "Seguro",
              text: "¿Desea realizar la operación de gestión?",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#3B71CA",
              cancelButtonColor: "#9FA6B2",
              confirmButtonText: "Aceptar",
              cancelButtonText: "Cancelar",
              customClass: {
                popup: "swal2-custom-font",
              },
            });

            if (result.isConfirmed) {
              let data = new FormData();
              data.append('nundoc', PedidoId);
              data.append('parametros_pedido', document.getElementById('parametros_pedido' + actividad_id).value);
              data.append('parametros_punto_pedido_opcion', document.getElementById('parametros_punto_pedido_opcion' + actividad_id).value);
              data.append('observacion', document.getElementById('observacion_gestion' + actividad_id).value);
              data.append('estado_actividad', document.getElementById('estado_actividad' + actividad_id).value);
              data.append('costo_ejecutado', document.getElementById('costo_ejecutado' + actividad_id).value);
              var documentos = document.getElementById('documento' + actividad_id).files[0];
              if (documentos !== undefined) {
                data.append('documento', documentos);
              } else {
                data.append('documento', 'Sin_evidencia');
              }

              data.append('publicar', 'NO');
              await fetch($('#base_url').val() + 'torrecontrol/Insertar_gestion_pedido', {
                method: 'POST',
                body: data,
                cache: 'no-cache',
              })
                .then(res => (res.ok ? res.json() : Promise.reject(res)))
                .catch(error => {
                  alert(JSON.stringify(error.length) || 'Error al cargar las solicitudes');
                })
                .then(response => {
                  if (response.numero === 200) {
                    mensaje = `
                    <div class="alert alert-outline-success d-flex align-items-center" role="alert">
                      <span class="fas fa-check-circle text-success fs-5 me-3"></span>
                      <strong>Mensaje!</strong> <p class="mb-0 flex-1">${response.mensaje}</p>
                      <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
                  } else {
                    mensaje = `
                      <div class="alert alert-outline-danger d-flex align-items-center" role="alert">
                        <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                          <strong>Mensaje!</strong> <p class="mb-0 flex-1">${response.mensaje}</p>
                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                      </div>`;
                  }
                  setTimeout(function () {
                    Listar_actividades_pedido(MaestroId);
                    document.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
                  }, 1500);
                });
            }
          }
        });
      }
    }

    let Boton_cerrar_detalle;
    const BtnGestionTrazabilidad = e.target.closest('[id^="btn_detalle_actividad"]');
    // if (e.target.matches('#btn_detalle_actividad') || e.target.matches('#btn_detalle_actividad *')) {
    if (BtnGestionTrazabilidad) {
      var padre = e.target.parentElement.parentElement;
      var Procesos = padre.querySelector('#btn_detalle_actividad');
      var proceso_id = Procesos.getAttribute('data-idproceso');
      var actividad_id = Procesos.getAttribute('data-idactividad');
      var PedidoId = Procesos.getAttribute('data-PedidoId');
      // console.log("Proceso: " + proceso_id + " Actividad: " + actividad_id);
      var form_gestio = document.getElementById(`detalle_actividad_numero${actividad_id}`);
      var numero_proceso = form_gestio.getAttribute('data-idnum_proceso');
      Boton_cerrar_detalle = document.getElementById(`btn_cerrar_detalle${actividad_id}`);
      if (actividad_id === numero_proceso) {
        document.getElementById(`columnadetalleactividad${numero_proceso}`).style.display = document.getElementById(`columnadetalleactividad${numero_proceso}`).style.display === 'none' ? 'table-row' : 'none';
        // Detalles_actividaes(PedidoId, actividad_id);
        setTimeout(() => {
          Detalles_actividaes(PedidoId, actividad_id);
        }, 50);
        // Boton_cerrar_detalle.addEventListener('click', async e => {
        //   document.getElementById(`columnadetalleactividad${numero_proceso}`).style.display = 'none';
        // });
      }
    }

    const BtnGuardarTrazabilidad = e.target.closest('[id^="btn_guardar_trazabilidad_gestion"]');
    // if (e.target.matches("#btn_guardar_trazabilidad_gestion") || e.target.matches("#btn_guardar_trazabilidad_gestion *")) {
    if (BtnGuardarTrazabilidad) {
      let SolicitudId = e.target.getAttribute("data-SolicitudId");
      let ReferenciaPedido = e.target.getAttribute("data-ReferenciaPedido");
      let tipoTrazabilidad = document.getElementById(`select_tipo_trazabilidad${SolicitudId}`).value;

      let formData = new FormData();
      formData.append('ReferenciaPedido', ReferenciaPedido);
      formData.append('tipoTrazabilidad', tipoTrazabilidad);
      formData.append('SolicitudId', SolicitudId);
      // data.append('observacion', document.getElementById(`observacion_gestion_trazabilidad${SolicitudId}`).value);
      formData.append('observacion', document.getElementById(`observacion_gestion_trazabilidad${SolicitudId}`).value);
      var documentos = document.getElementById(`documento_trazabilidad${SolicitudId}`).files[0];
      if (documentos !== undefined) {
        formData.append('documento', documentos);
      } else {
        formData.append('documento', 'Sin_evidencia');
      }

      try {
        let response = await fetch($('#base_url').val() + 'torrecontrol/insertar_trazabilidad_pedido', {
          method: "POST",
          body: formData
        });

        let data = await response.json();
        if (data) {
          Swal.fire({
            title: "Mensaje!",
            html: data.mensaje,
            icon: "success",
            draggable: true
          });
          setTimeout(function () {
            location.reload(false);
          }, 1000);
        } else {
          Swal.fire({
            title: "Mensaje!",
            html: data.mensaje,
            icon: "error",
            draggable: true
          });
        }
      } catch (error) {

      }
    }

    const BtnGuardarFechaEstimada = e.target.closest('[id^="btn_guardar_trazabilidad_fecha_estimada"]');
    if (BtnGuardarFechaEstimada) {
      let SolicitudId = e.target.getAttribute("data-SolicitudId");
      let ReferenciaPedido = e.target.getAttribute("data-ReferenciaPedido");
      let tipoTrazabilidad = document.getElementById(`select_tipo_trazabilidad${SolicitudId}`).value;
      let FechaEstimada = document.getElementById(`fecha_estimada_entrega${SolicitudId}`).value;
      let HoraEstimada = document.getElementById(`hora_estimada_entrega${SolicitudId}`).value;

      if (!FechaEstimada || !HoraEstimada) {
        Swal.fire({
          title: "Mensaje!",
          text: "Debe seleccionar una fecha y hora estimada.",
          icon: "warning",
          draggable: true
        });
        return;
      }


      const result = await Swal.fire({
        title: '¿Seguro?',
        text: '¿Desea Actualizar Fecha Entrega del pedido? ' + ReferenciaPedido,
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

          let formData = new FormData();
          formData.append('ReferenciaPedido', ReferenciaPedido);
          formData.append('tipoTrazabilidad', tipoTrazabilidad);
          formData.append('SolicitudId', SolicitudId);
          formData.append('FechaEstimada', FechaEstimada);
          formData.append('HoraEstimada', HoraEstimada);

          let response = await fetch($('#base_url').val() + 'torrecontrol/insertar_fecha_estimada', {
            method: "POST",
            body: formData
          });

          let data = await response.json();
          if (data.success === true) {
            Swal.fire({
              title: "Mensaje!",
              html: data.message,
              icon: "success",
              draggable: true
            });
            setTimeout(function () {
              location.reload(false);
            }, 1000);
          } else {
            Swal.fire({
              title: "Mensaje!",
              html: data.message,
              icon: "error",
              draggable: true
            });
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error de red',
            text: 'No se pudo conectar al servidor',
          });
        }
      }
    }

    const BtnImportarTrazaPedido = document.getElementById(`btn_guardar_trazabilidad_pedido`);

    if (BtnImportarTrazaPedido?.contains(e.target)) {
      if (globalData.length === 0) {
        Swal.fire({
          title: "Mensaje!",
          text: "No hay datos para enviar. Primero carga y previsualiza un archivo de Excel.",
          icon: "warning",
          draggable: true
        });
        return;
      }

      const result = await Swal.fire({
        title: 'Seguro',
        text: '¿Desea aprobar la solicitud?',
        icon: 'warning',
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
        const btn = document.querySelector("#btn_guardar_trazabilidad_pedido");
        btn.disabled = true;
        btn.innerHTML = "Importando... ⏳";

        try {
          // Crear objeto FormData
          let formData = new FormData();
          // formData.append("ServicioId", ServicioId);
          // formData.append("RecursoId", RecursoId);
          formData.append("globalData", JSON.stringify(globalData));  // Convertimos globalData a JSON

          const response = await fetch($('#base_url').val() + 'torrecontrol/importar_trazabilidad_pedido', {
            method: 'POST',
            body: formData
          });

          const data = await response.json();

          Swal.fire({
            title: "Mensaje!",
            text: data.message,
            icon: data.status === true ? "success" : "error",
            draggable: true
          });

        } catch (err) {
          console.error(err);
          alert("Error al enviar datos al servidor.");
        } finally {
          btn.disabled = false;
          btn.innerHTML = "<span class='uil uil-file-import'></span> Importar Trazabilidad";
        }
      }
    }


    if (e.target.matches('#btn_rechazar_recurso') || e.target.matches("#btn_rechazar_recurso *")) {
      // const btn = document.querySelector("#btn_rechazar_recurso");
      let btn = e.target.closest("#btn_rechazar_recurso");
      let data_recurso = btn.getAttribute("data-id");
      console.log(data_recurso);


      const result = await Swal.fire({
        title: "Seguro",
        text: "¿Desea guardar la respuesta?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3B71CA",
        cancelButtonColor: "#9FA6B2",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        customClass: {
          popup: "swal2-custom-font",
        },
      });

      if (result.isConfirmed) {

        btn.disabled = true;
        btn.innerHTML = "Guardando Posulación... ⏳";
        let formData = new FormData();
        formData.append("data_recurso", data_recurso);

        try {
          const response = await fetch($('#base_url').val() + 'torrecontrol/Rechazar_recurso', {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
          });

          const data = await response.json();

          Swal.fire({
            title: "Mensaje!",
            text: data.mensaje,
            icon: data.numero === 200 ? "success" : "error",
            draggable: true
          }).then((result) => {
            if (result.isConfirmed) {
              listar_recursos_proveedor(fechaColombia, fechaColombia, window.VENTANA);
              // Listar_servicios(RecursoId, Porceso, SolicitudesArray, proveedorId);
            }
          });

        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Error al enviar datos al servidor.", "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = " <span class='uil uil-file-import'></span> Guardar Postulación";
        }

      }



    }

    if (e.target.matches(`#id_rechazar_se`) || (e.target.matches(`#id_rechazar_se *`))) {
      alert("ok");
      let boton = e.target.closest('#id_rechazar_se'); // Capturamos el botón real
      let RecursoId = boton.getAttribute('data-RecursoId');
      // console.log(RecursoId);
      let ServicioId = boton.getAttribute('data-ServicioId');
      let ProveedorId = boton.getAttribute('data-ProveedorId');
      const result = await Swal.fire({
        title: "Seguro",
        text: "¿Desea rechazar el servicio especial?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3B71CA",
        cancelButtonColor: "#9FA6B2",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        customClass: {
          popup: "swal2-custom-font",
        },
      });
      if (result.isConfirmed) {
        let dato = new FormData();
        dato.append('RecursoId', RecursoId);
        dato.append('ServicioId', ServicioId);
        dato.append('ProveedorId', ProveedorId);
        try {
          const response = await fetch($('#base_url').val() + 'torrecontrol/rechazar_servicio_espacial', {
            method: 'POST',
            body: dato,
            cache: 'no-cache',
          });
          const data = await response.json();
          Swal.fire({
            title: "Mensaje!",
            text: data.message,
            icon: data.success ? "success" : "error",
            draggable: true
          }).then((result) => {
            if (result.isConfirmed) {
              myOffcanvas.hide();
            }
          });
        } catch (error) {

        }
      }
    }

  });

  // Evento para mostrar/ocultar proveedores con el checkbox y hacer la petición AJAX
  document.addEventListener("change", async (e) => {
    // if (e.target.matches("input[name='ProveedorServiciodetalle']")) {
    //   let ServicioId = e.target.value;
    //   let proveedorId = e.target.getAttribute("data-proveedorId");
    //   let TipoServicio = e.target.getAttribute("data-TipoServicio");
    //   let PedidosId = e.target.getAttribute("data-pedidosId");
    //   let RecursoId = e.target.getAttribute("data-recursoId");

    //   let filaServicios = document.getElementById(`detalle_recurso_proveedores_asignados_${ServicioId}`);
    //   // Mostrar u ocultar la fila de servicios
    //   if (filaServicios.style.display === "none") {
    //     filaServicios.style.display = "table-row";
    //     // Obtener servicios si aún no se han cargado
    //     if (filaServicios.querySelector(".lista-detalle-accion-proveedores").innerHTML.trim() === "") {
    //       filaServicios.querySelector(".lista-detalle-accion-proveedores").innerHTML = `
    //         <div class="container-fluid pt-3">
    //           <!-- <div class="d-flex justify-content-center"> -->
    //           <div class="row">

    //             <div id="despachos" style="display: none;">
    //               <div class="row">
    //                 <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
    //                   <div class="mb-3">
    //                     <label style="font-size: 12px;">Placa</label>
    //                     <input type="text" id="placa" name="placa" class="form-control form-control-sm" placeholder="Placa" oninput="this.value = this.value.toUpperCase();">
    //                   </div>
    //                 </div>
    //                 <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
    //                   <div class="mb-3">
    //                     <label style="font-size: 12px;">Cedula</label>
    //                     <input type="text" id="cedula_conductor" name="cedula_conductor" class="form-control form-control-sm" placeholder="Cedula" oninput="this.value = this.value.toUpperCase();">
    //                   </div>
    //                 </div>
    //                 <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
    //                   <div class="mb-3">
    //                     <label style="font-size: 12px;">Nombre</label>
    //                     <input type="text" id="nombre_conductor" name="nombre_conductor" class="form-control form-control-sm" placeholder="Nombre" oninput="this.value = this.value.toUpperCase();">
    //                   </div>
    //                 </div>
    //                 <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
    //                   <div class="mb-3">
    //                     <label style="font-size: 12px;">Flete</label>
    //                     <input type="text" id="flete" name="flete" class="form-control form-control-sm" placeholder="Flete">
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>

    //             <div id="otros" style="display: none;">
    //               <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
    //                 <div class="mb-3">
    //                   <label style="font-size: 12px;">Valor Servicio</label>
    //                   <input type="text" id="costo_servicio" name="costo_servicio" class="form-control form-control-sm" placeholder="Valor Servicio">
    //                 </div>
    //               </div>
    //             </div>

    //             <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
    //               <div class="mb-3">
    //                 <label style="font-size: 12px;">Fecha Inicio del servicio</label>
    //                 <input type="date" id="fecha_inicio" name="fecha_inicio" class="form-control form-control-sm">
    //               </div>
    //             </div>

    //             <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
    //               <div class="mb-3">
    //                 <label style="font-size: 12px;">Hora Inicio del servicio</label>
    //                 <input type="time" id="hora_inicio" name="hora_inicio" class="form-control form-control-sm">
    //               </div>
    //             </div>

    //             <div class="col-12 gy-6 my-3" id="btn-acciones">
    //               <div class="row g-3 justify-content-end">
    //                 <div class="col-auto">
    //                   <button class="btn btn-success btn-sm" id="btn_guardar_postulacion" type="button" data-id="${proveedorId}" data-id2="${ServicioId}" data-id3="${PedidosId}" data-id4="${TipoServicio}" data-id5="${ServicioId}" data-id6="${RecursoId}">
    //                     <span class="uil uil-file-import"></span> Guardar Postulación
    //                   </button>
    //                 </div>
    //               </div>
    //             </div>

    //           </div>
    //         </div>
    //       `;

    //       /* Validar el tipo de servicio */

    //       if (TipoServicio === "Despachos") {
    //         document.getElementById("despachos").style.display = "";
    //       } else {
    //         document.getElementById("otros").style.display = "";
    //       }
    //     }
    //   } else {
    //     filaServicios.style.display = "none";
    //   }
    //   // await mostrarProveedores(clienId, ServicioId);
    // }

    if (e.target.matches("input[name='ProveedorServiciodetalle']")) {
      let ServicioId = e.target.value;
      let proveedorId = e.target.getAttribute("data-proveedorId");
      let TipoServicio = e.target.getAttribute("data-TipoServicio");
      let PedidosId = e.target.getAttribute("data-pedidosId");
      let RecursoId = e.target.getAttribute("data-recursoId");
      let Modalidad = e.target.getAttribute("data-modalidad");

      let filaServicios = document.getElementById(`detalle_recurso_proveedores_asignados_${ServicioId}`);
      // Mostrar u ocultar la fila de servicios
      if (filaServicios.style.display === "none") {
        filaServicios.style.display = "table-row";
        // Obtener servicios si aún no se han cargado
        if (filaServicios.querySelector(".lista-detalle-accion-proveedores").innerHTML.trim() === "") {
          filaServicios.querySelector(".lista-detalle-accion-proveedores").innerHTML = `
            <div class="container-fluid pt-3">
                <div id="despachos" style="display: none;">
                  <div class="row">
                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                      <div class="mb-2">
                        <label style="font-size: 12px;">Placa</label>
                        <input type="text" id="placa" name="placa" class="form-control form-control-sm" placeholder="Placa" oninput="this.value = this.value.toUpperCase();">
                      </div>
                    </div>
                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                      <div class="mb-2">
                        <label style="font-size: 12px;">Cedula</label>
                        <input type="text" id="cedula_conductor" name="cedula_conductor" class="form-control form-control-sm" placeholder="Cedula" oninput="this.value = this.value.toUpperCase();">
                      </div>
                    </div>
                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                      <div class="mb-2">
                        <label style="font-size: 12px;">Nombre</label>
                        <input type="text" id="nombre_conductor" name="nombre_conductor" class="form-control form-control-sm" placeholder="Nombre" oninput="this.value = this.value.toUpperCase();">
                      </div>
                    </div>

                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                      <div class="mb-2">
                        <label style="font-size: 12px;">Flete</label>
                        <input type="text" id="flete" name="flete" class="form-control form-control-sm" placeholder="Flete">
                      </div>
                    </div>

                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4" id="carga_liquida"  style="display: none;">
                      <div class="mb-2">
                        <label style="font-size: 12px;">Capacidad</label>
                        <input type="text" id="capacidad" name="capacidad" class="form-control form-control-sm" placeholder="Capacidad">
                      </div>
                    </div>

                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4" id="carga_liquida2"  style="display: none;">
                      <div class="mb-2">
                        <label style="font-size: 12px;">Tiempo Libre</label>
                        <input type="text" id="tiempo_libre" name="tiempo_libre" class="form-control form-control-sm" placeholder="Tiempo Libre">
                      </div>
                    </div> 

                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4" id="carga_liquida3"  style="display: none;">
                      <div class="mb-2">
                        <label style="font-size: 12px;">Valor día de Stand By</label>
                        <input type="text" id="valor_dia" name="valor_dia" class="form-control form-control-sm" placeholder="Valor día de Stand By">
                      </div>
                    </div>

                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4 mt-4" id="carga_liquida4"  style="display: none;">
                      <div class="form-check form-switch">
                        <input class="form-check-input" id="estado_vehiculo" type="checkbox">
                        <label class="form-check-label" for="estado_vehiculo">Respuesta cumplimiento de requisitos de vehículo</label>
                      </div>
                    </div>


                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4" id="carga_importacion_exportacion"  style="display: none;">
                      <div class="mb-2">
                        <label style="font-size: 12px;">Contenedor</label>
                        <input type="text" id="contenedor" name="contenedor" class="form-control form-control-sm" placeholder="# contenedor">
                      </div>
                    </div>

                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4" id="carga_exportacion_importacion"  style="display: none;">
                      <div class="mb-2">
                        <label style="font-size: 12px;">Tara</label>
                        <input type="text" id="tara" name="tara" class="form-control form-control-sm" placeholder="Tara">
                      </div>
                    </div>
                    
                  </div>
                </div>

                <div id="otros" style="display: none;">
                  <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <div class="mb-3">
                      <label style="font-size: 12px;">Valor Servicio</label>
                      <input type="text" id="costo_servicio" name="costo_servicio" class="form-control form-control-sm" placeholder="Valor Servicio">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                    <div class="mb-3">
                      <label style="font-size: 12px;">Fecha Inicio del servicio</label>
                      <input type="date" id="fecha_inicio" name="fecha_inicio" class="form-control form-control-sm">
                    </div>
                  </div>

                  <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                    <div class="mb-3">
                      <label style="font-size: 12px;">Hora Inicio del servicio</label>
                      <input type="time" id="hora_inicio" name="hora_inicio" class="form-control form-control-sm">
                    </div>
                  </div>
                </div>

                <div class="col-12 gy-6 my-3" id="btn-acciones">
                  <div class="row g-3 justify-content-end">
                    <div class="col-auto">
                      <button class="btn btn-success btn-sm" id="btn_guardar_postulacion" type="button" data-id="${proveedorId}" data-id2="${ServicioId}" data-id3="${PedidosId}" data-id4="${TipoServicio}" data-id5="${ServicioId}" data-id6="${RecursoId}">
                        <span class="uil uil-file-import"></span> Guardar Postulación
                      </button>
                    </div>
                  </div>
                </div>
            </div>
          `;

          /* Validar el modalidad */
          // if (Modalidad === "CARGA LIQUIDA") {
          //   document.getElementById("carga_liquida").style.display = "";
          //   document.getElementById("carga_liquida2").style.display = "";
          //   document.getElementById("carga_liquida3").style.display = "";
          //   document.getElementById("carga_liquida4").style.display = "";
          // } else {
          //   document.getElementById("carga_liquida").style.display = "none";
          //   document.getElementById("carga_liquida2").style.display = "none";
          //   document.getElementById("carga_liquida3").style.display = "none";
          //   document.getElementById("carga_liquida4").style.display = "none";
          // }

          // if (Modalidad === "IMPORTACION" || Modalidad === "EXPORTACION") {
          //   document.getElementById("carga_importacion_exportacion").style.display = "";
          //   document.getElementById("carga_exportacion_importacion").style.display = "";
          // } else {
          //   document.getElementById("carga_importacion_exportacion").style.display = "none";
          //   document.getElementById("carga_exportacion_importacion").style.display = "none";
          // }

          if (Modalidad === "CARGA LIQUIDA") {
            document.getElementById("carga_liquida").style.display = "";
            document.getElementById("carga_liquida2").style.display = "";
            document.getElementById("carga_liquida3").style.display = "";
            // document.getElementById("carga_liquida4").style.display = "";
            document.getElementById("carga_importacion_exportacion").style.display = "";
            document.getElementById("carga_exportacion_importacion").style.display = "";
          } else {
            document.getElementById("carga_liquida").style.display = "none";
            document.getElementById("carga_liquida2").style.display = "none";
            document.getElementById("carga_liquida3").style.display = "none";
            document.getElementById("carga_liquida4").style.display = "none";
            document.getElementById("carga_importacion_exportacion").style.display = "none";
          }

          if (Modalidad === "IMPORTACION" || Modalidad === "EXPORTACION") {
            document.getElementById("carga_importacion_exportacion").style.display = "";
            document.getElementById("carga_exportacion_importacion").style.display = "";
            document.getElementById("carga_liquida").style.display = "";
            document.getElementById("carga_liquida2").style.display = "";
            document.getElementById("carga_liquida3").style.display = "";
          } else {
            // document.getElementById("carga_importacion_exportacion").style.display = "none";
            // document.getElementById("carga_exportacion_importacion").style.display = "none";
          }

          /* Validar el tipo de servicio */
          if (TipoServicio === "Despachos") {
            document.getElementById("despachos").style.display = "";
          } else {
            document.getElementById("otros").style.display = "";
          }
        }
      } else {
        filaServicios.style.display = "none";
      }
      // await mostrarProveedores(clienId, ServicioId);
    }

    if (e.target.matches("#costo_servicio") || e.target.matches("#costo_servicio *")) {
      let costo_servicio = document.getElementById("costo_servicio").value.trim();
      $('#costo_servicio').val(parseFloat(costo_servicio, 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
    }

    if (e.target.matches("#flete") || e.target.matches("#flete *")) {
      let flete = document.getElementById("flete").value.trim();
      $('#flete').val(parseFloat(flete, 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
    }

    const filtroContenedor = document.getElementById(`campo-${window.VENTANA}-filtro`);

    if (filtroContenedor?.contains(e.target)) {
      const valorFiltro = filtroContenedor.value || e.target.value;
      if (valorFiltro === 'cague masivo recursos') {
        console.log('Valor del filtro desde le if:', valorFiltro);
      } else if (valorFiltro === 'cargue masivo pedidos') {
        myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Trazbilidad pedido`);
        myOffcanvas.updateContent(`
          <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" id="cargue_masivo_pedidos">
            <!-- 1) Input para seleccionar el archivo de Excel -->
            <div class="mb-3">
              <label class="form-label" for="customFileSm">Subir Archivo</label>
              <input type="file" class="form-control form-control-sm" id="excelFilePedidos" accept=".xls, .xlsx" onchange="leerExcelPeido()" placeholder="Seleccionar Archivo">
            </div>
          </div>

          <!-- 3) Área de previsualización -->
          <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" id="visualizar_pedidos_cargue">
            <h6>Vista Previa</h6>
            <div class="form-group col-xs-12">
              <div class="table-responsive">
                <table class="table table-striped table-sm" id="previewTablePedidos" cellpadding="0" border="1"
                  style="width: 100%; border: #332D2D;">
                  <!-- Aquí se generarán dinámicamente las filas -->
                </table>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div class="row justify-content-end">
              <div class="col-auto">
                <button class="btn btn-success btn-sm py-1" id="btn_guardar_trazabilidad_pedido" type="button">
                  <span class="uil uil-import"></span> Importar Trazabilidad Pedidos
                </button>
              </div>
            </div>
          </div>
        `);
        myOffcanvas.updateHeight('100vh');
        myOffcanvas.updateWidth('75%');
        myOffcanvas.updateClass('offcanvas-end');
        myOffcanvas.show();
      }
    }

  });
}

async function listar_recursos_proveedor(fecha_inicial, fecha_final, ventana) {
  /* Funcion para enviar los datos */
  let dato = new FormData();
  dato.append('fecha_inicial', fecha_inicial);
  dato.append('fecha_final', fecha_final);
  dato.append('ventana', ventana);
  dato.append('proveedor_id', document.getElementById('proveedor_id').value);
  try {
    const response = await fetch($('#base_url').val() + 'torrecontrol/listar_recrusos_administrador', {
      method: 'POST',
      body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tbl_administrador_recurso_pedidos');
      tbody.innerHTML = '';
      let esatdo_recurso = '';
      let btn_cancelacion = "";
      let btn_removeAsignacion = "";
      let btn_rechazar = "";
      let btn_detalle_proceso = "";

      data.forEach(element => {
        const fila = document.createElement('tr');

        if (element.estado_recurso === 'Pendiente Iniciar') {
          esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${element.estado_recurso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_rechazar = `<a class="dropdown-item fw-bold" href="#" id="btn_rechazar_recurso" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-id2="${element.cliente}" data-EstadoRecurso="${element.estado_recurso}"><span class="uil uil-transaction"></span> Rechazar recurso</a>
          `;
          btn_gestion_pedidos = ``;
          btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-id2="${element.cliente}" data-EstadoRecurso="${element.estado_recurso}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
        } else if (element.estado_recurso === 'Iniciado') {
          esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_recurso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-id2="${element.cliente}" data-EstadoRecurso="${element.estado_recurso}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
          btn_rechazar = ``;
        } else if (element.estado_recurso === 'Completado') {
          esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado_recurso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-id2="${element.cliente}" data-EstadoRecurso="${element.estado_recurso}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
          btn_rechazar = ``;
        } else if (element.estado_recurso === 'Cancelado') {
          esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.estado_recurso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-id2="${element.cliente}" data-EstadoRecurso="${element.estado_recurso}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
          btn_rechazar = ``;
        } else if (element.estado_recurso === 'Rechazado') {
          esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${element.estado_recurso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-id2="${element.cliente}" data-EstadoRecurso="${element.estado_recurso}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
          btn_rechazar = ``;
        }

        /* Accion para gestionar los pedidos generados a los recursos */
        if (element.pedido_plantilla === 'SI' && element.estado_recurso !== 'Rechazado') {
          btn_gestion_pedidos = `<a class="dropdown-item fw-bold" href="#" id="btn_gestion_pedido" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-clienteId="${element.clienteId}"><span class="uil-list-ui-alt"></span> Gestion Pedidos</a>`;
        } else {
          btn_gestion_pedidos = ``;
        }

        // const columnaNundocSolicitud = document.createElement('td');
        // columnaNundocSolicitud.innerHTML = `
        // <div class="dropdown">
        //   <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.referencias_pedido}</a>
        //   <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
        //     <a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>
        //   </div>
        // </div>
        // `;

        const columnaNundocSolicitud = document.createElement('td');
        columnaNundocSolicitud.innerHTML = `
        <div class="dropdown">
          <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.referencias_pedido}</a>
          <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
            ${btn_detalle_proceso}
            ${btn_gestion_pedidos}
            ${btn_rechazar}

          </div>
        </div>
        `;

        const columnaCliente = document.createElement('td');
        columnaCliente.innerHTML = element.nombre;
        columnaCliente.style.width = 'auto';
        columnaCliente.style.whiteSpace = 'nowrap';

        const columnaModalidad = document.createElement('td');
        columnaModalidad.innerHTML = element.modalidad;
        columnaModalidad.style.width = 'auto';
        columnaModalidad.style.whiteSpace = 'nowrap';

        const columnaProceso = document.createElement('td');
        columnaProceso.innerHTML = element.proceso === 'Asignación' ? `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.proceso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>` : `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">${element.proceso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        columnaProceso.style.width = 'auto';
        columnaProceso.style.whiteSpace = 'nowrap';

        const columnaFecha = document.createElement('td');
        columnaFecha.innerHTML = element.fecha;
        columnaFecha.style.width = 'auto';
        columnaFecha.style.whiteSpace = 'nowrap';

        const columnaUsuario = document.createElement('td');
        columnaUsuario.innerHTML = element.usuario;
        columnaUsuario.style.width = 'auto';
        columnaUsuario.style.whiteSpace = 'nowrap';

        const columnaEstado = document.createElement('td');
        columnaEstado.innerHTML = esatdo_recurso;
        columnaEstado.style.width = 'auto';
        columnaEstado.style.whiteSpace = 'nowrap';

        const columnaEstadoRecurso = document.createElement('td');
        // columnaEstadoRecurso.innerHTML = esatdo_recurso;
        columnaEstadoRecurso.dataset.id = element.maestro_id; // Guardamos el ID para su actualización posterior
        columnaEstadoRecurso.style.width = 'auto';
        columnaEstadoRecurso.style.whiteSpace = 'nowrap';


        fila.appendChild(columnaNundocSolicitud);
        fila.appendChild(columnaCliente);
        fila.appendChild(columnaModalidad);
        fila.appendChild(columnaProceso);
        fila.appendChild(columnaFecha);
        fila.appendChild(columnaUsuario);
        fila.appendChild(columnaEstado);
        fila.appendChild(columnaEstadoRecurso);
        tbody.appendChild(fila);
      });
      await estado_recurso();
    } else {
      console.log('else');
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
    // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}

async function Listar_pedidos_recursos(MaestroId, proveedor_id, Proceso, EstadoRecurso) {
  try {
    let formData = new FormData();
    formData.append("MaestroId", MaestroId);
    formData.append("proveedor_id", proveedor_id);

    let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_recursos', {
      method: "POST",
      body: formData
    });

    let data = await response.json();
    console.log("🚀 ~ Listar_pedidos_recursos ~ data:", data)
    if (data) {
      let miArray = [];
      let rows = "";

      let totalPesoNeto = 0;
      let totalPesoBruto = 0;
      let totalUnidades = 0;
      let col_estatus_publicacion = '';
      let select_acciones = '';
      let opciones = [
        'Fecha Estimada Entrega',
        'Llegada Cargue',
        'Cargue',
        'Salida Cargue',
        'Inicio Ruta',
        'Transito',
        'Llegada Descargue',
        'Descargue',
        'Salida Descargue'
      ];

      data.sql.forEach((servicio, index) => {
        if (servicio.peso_neto_kg) {
          totalPesoNeto += parseFloat(servicio.peso_neto_kg);
        }

        if (servicio.peso_bruto_kg) {
          totalPesoBruto += parseFloat(servicio.peso_bruto_kg);
        }

        if (servicio.unidades) {
          totalUnidades += parseFloat(servicio.unidades);
        }

        $('#pesoNeto').text(totalPesoNeto);
        $('#pesoBruto').text(totalPesoBruto);
        $('#totalUnidades').text(totalUnidades);

        miArray.push(servicio.numdoc_solicitud);

        if (servicio.estado_proceso_pedido === 'Pendiente Iniciar') {
          col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          select_acciones = ``;
        } else if (servicio.estado_proceso_pedido === 'Iniciado') {
          col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (servicio.estado_proceso_pedido === 'Cancelado') {
          col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_publicacion = `<a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido" data-id="${servicio.numdoc_solicitud}" data-id2="${servicio.cliente}"><span class="uil uil-feedback"></span> Publicar Pedido</a>`;
          select_acciones = ``;
        } else if (servicio.estado_proceso_pedido === 'Postulado') {
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_publicacion = ``;
          select_acciones = ``;
        } else if (servicio.estado_proceso_pedido === 'Completado') {
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          // Excluir la opción que ya venga en tipo_trazabilidad
          let opcionesFiltradas = opciones.filter(opcion => opcion !== servicio.tipo_trazabilidad);

          select_acciones = `
          <select class="form-select form-select-sm me-1 px-1 py-0 w-100" onchange="trazabilidad_pedido(this.value, ${servicio.numdoc_solicitud})" id="select_tipo_trazabilidad${servicio.numdoc_solicitud}" data-id="${servicio.numdoc_solicitud}" data-Referencia="${servicio.referencia_pedido}" name="select_tipo_trazabilidad" aria-label=".form-select-sm example">
            <option value="" selected=""><i class="uil uil-angle-down"></i></option>
            ${opcionesFiltradas.map(opcion => `<option value="${opcion}">${opcion}</option>`).join('')}
          </select>
          `;
        } else if (servicio.estado_proceso_pedido === 'Rechazado') {
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        }


        checkbox_carrito = `
          <input class="form-check-input pedido-checkbox_pr" id="check_pedido_pro${servicio.numdoc_solicitud}"
            type="checkbox" value="${servicio.numdoc_solicitud}" data-tipo="${servicio.tipo_trazabilidad}" data-id="${servicio.numdoc_solicitud}"
            style="scale: 1.3;">
          `;




        rows += `
            <tr>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${checkbox_carrito}</td> 
              <th scope="row">${servicio.numdoc_solicitud}</th>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.referencia_pedido}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.cod_producto}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.producto}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.peso_neto_kg}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.peso_bruto_kg}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.presentacion}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.unidades}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.num_estibas}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.ciudad_origen}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.ciudad_destino}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_cargar}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_entregar}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.remitente}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.destinatario}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'><span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.tipo_trazabilidad}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${col_estatus_publicacion}</td>
              <td class='text-center' style='width: auto; white-space: nowrap;'>${select_acciones}</td>
            </tr>
            <tr id="Recurso_proveedores_${servicio.numdoc_solicitud}" style="display: none;">
              <td colspan="18">
                <div class="lista-proceso-proveedores"></div>
              </td>
            </tr>
            <tr id="trazabilidad_pedidos_recurso_${servicio.numdoc_solicitud}" style="display: none;">
              <td colspan="18" id="trazabilidad_pedidos_${servicio.numdoc_solicitud}">
                <div class="trazabilidad-pedidos">
                  <div class="row">
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                      <div class="mb-1">
                        <input type="text" class="form-control form-control-sm text-center fz-12" name="OpcionTrazabilidad" id="OpcionTrazabilidad${servicio.numdoc_solicitud}" readonly>
                      </div>
                    </div>
                    <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                      <div class="mb-1">
                        <label class="form-label" for="documento_trazabilidad${servicio.numdoc_solicitud}">Documento</label>
                        <input type="file" name="documento_trazabilidad" id="documento_trazabilidad${servicio.numdoc_solicitud}" class="form-control form-control-sm">
                      </div>
                    </div>
                    <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                      <div class="mb-1">
                        <label class="form-label" for="observacion_gestion_trazabilidad${servicio.numdoc_solicitud}">Observación</label>
                        <textarea name="observacion_gestion_trazabilidad" id="observacion_gestion_trazabilidad${servicio.numdoc_solicitud}" cols="30" rows="1"
                          class="form-control form-control-sm"></textarea>
                      </div>
                    </div>
                    
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex justify-content-end my-2">
                      <div class="btn-group btn-group-sm" role="group" aria-label="...">
                        <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-0" style="margin-right:5px;" id="btn_cancelar_gestion_trazabilidad${servicio.numdoc_solicitud}"><i class="uil-x"></i> Cancelar</button>
                        <button type="button" class="btn btn-success btn-sm me-1 px-1 py-0" id="btn_guardar_trazabilidad_gestion" data-SolicitudId="${servicio.numdoc_solicitud}" data-ReferenciaPedido="${servicio.referencia_pedido}"><i class="uil-save"></i> Guardar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td colspan="18" id="trazabilidad_tiempo_estimado_${servicio.numdoc_solicitud}" style="display: none;">
                <div class="trazabilidad-pedidos">
                    <div class="row">
                      <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                       <label class="form-label" for="fecha_estimada_entrega${servicio.numdoc_solicitud}">Fecha Estimada Entrega</label>
                        <input type="date" name="fecha_estimada_entrega" id="fecha_estimada_entrega${servicio.numdoc_solicitud}" class="form-control form-control-sm">
                      </div>
                      <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                        <label class="form-label" for="hora_estimada_entrega${servicio.numdoc_solicitud}">Hora Estimada Entrega</label>
                        <input type="time" name="hora_estimada_entrega" id="hora_estimada_entrega${servicio.numdoc_solicitud}" class="form-control form-control-sm">
                      </div>
                      <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4 align-middle  text-end pe-0">
                        <div class="btn-group btn-group-sm pt-3" role="group" aria-label="...">
                          <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-0" style="margin-right:5px;" id="btn_cancelar_gestion_fecha_estimada${servicio.numdoc_solicitud}"><i class="uil-x"></i> Cancelar</button>
                          <button type="button" class="btn btn-success btn-sm me-1 px-1 py-0" id="btn_guardar_trazabilidad_fecha_estimada" data-SolicitudId="${servicio.numdoc_solicitud}" data-ReferenciaPedido="${servicio.referencia_pedido}"><i class="uil-save"></i> Guardar</button>
                        </div>
                      </div>
                    </div>
                </div>
              </td>
            </tr>
          `;
      });

      if (data.sql.every(servicio => servicio.estado_proceso_pedido === 'Iniciado') || data.sql.every(servicio => servicio.estado_proceso_pedido === 'Completado')) {
        // Listar_servicios(MaestroId, Proceso, miArray, proveedor_id);
        Listar_servicios(MaestroId, Proceso, miArray, proveedor_id, data.sql.map(s => s.modalidad));
        document.getElementById("btn_iniciar_recurso").style.display = "none";
      } else if (EstadoRecurso === 'Cancelado') {
        document.getElementById("btn_iniciar_recurso").style.display = "none";
      }

      /* Colcoar Array de las solicitudes de servicio para inicar proceso */
      document.getElementById("btn_iniciar_recurso").setAttribute("data-SolicitudesId", JSON.stringify(miArray));

      document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = rows;


      let rows_Servicios = "";
      let tabHeaders = "";

      data.proveedores.forEach((proveedor, index) => {
        // Construir el HTML para cada tab header
        tabHeaders += ` 
          <li class="nav-item">
            <a class="nav-link ${index === 0 ? 'active' : ''}" 
               id="${proveedor.proveedor_id}-tab" 
               data-bs-toggle="tab" 
               href="#tab-${proveedor.proveedor_id}" 
               role="tab" 
               aria-controls="tab-${proveedor.proveedor_id}" 
               aria-selected="${index === 0 ? 'true' : 'false'}">
               ${" - " + proveedor.razon_social + " "}
            </a>
          </li>
        `;
      });

      // Insertar todos los headers en el contenedor
      document.getElementById('cabecera_proveedores_servicios_especiales').innerHTML = tabHeaders;

      // Necesitamos hacer esto en una función async
      let tabContent = '<div class="tab-content"> ';

      // Usamos for...of en lugar de forEach para poder usar await
      for (const [index, proveedor] of data.proveedores.entries()) {
        const contenido = await Listar_servicios_especiales_proveedor(proveedor.proveedor_id, MaestroId, index);
        tabContent += contenido;
      }

      tabContent += '</div>';
      document.getElementById('detalle_proveedores_servicios_especiales').innerHTML = tabContent;

      /* Observaciones de los recursos */
      document.getElementById("observacion_recurso").innerHTML = data.sql[0].observacion;

    } else {
      document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
    }
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
  }
}

async function Listar_servicios(RecursoId, proceso, SolicitudesId, proveedor_id, modalidad) {
  try {
    let formData = new FormData();
    formData.append("RecursoId", RecursoId);
    formData.append("proveedor_id", proveedor_id);
    formData.append("proceso", proceso);
    formData.append("SolicitudesId", JSON.stringify(SolicitudesId));

    let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_recursos_proveedor', {
      method: "POST",
      body: formData
    });

    let data = await response.json();
    if (data) {
      document.getElementById("tbl_recursos_proveedor").style.display = "";
      let rows = "";
      let rows2 = "";
      //   <div class="form-check form-switch text-center">
      //   <input class="form-check-input me-2" type="checkbox" name="ProveedorServiciodetalle" data-proveedorId="${servicio.proveedorId}" data-TipoServicio="${servicio.tipo_servicio}" data-pedidosId="${SolicitudesId}" data-recursoId="${RecursoId}" id="servicio_${servicio.servicioId}" value="${servicio.servicioId}">
      // </div>
      let col_estatus_publicacion = '';
      let btn_cargar_trazabilidad = '';
      let btn_postular_gestion_servicio = '';
      data.forEach((servicio, index) => {

        if (servicio.estado_servicio === 'Pendiente Iniciar') {
          col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_postular_gestion_servicio = `
          <div class="form-check form-switch text-center">
            <input class="form-check-input me-2" type="checkbox" name="ProveedorServiciodetalle" data-modalidad="${modalidad}"  data-proveedorId="${servicio.proveedorId}" data-TipoServicio="${servicio.tipo_servicio}" data-pedidosId="${SolicitudesId}" data-recursoId="${RecursoId}" id="servicio_${servicio.servicioId}" value="${servicio.servicioId}">
          </div>`;
          btn_cargar_trazabilidad = ``;
        } else if (servicio.estado_servicio === 'Iniciado') {
          col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_postular_gestion_servicio = ``;
          btn_cargar_trazabilidad = ``;
        } else if (servicio.estado_servicio === 'Cancelado') {
          col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_postular_gestion_servicio = ``;
          btn_cargar_trazabilidad = ``;
        } else if (servicio.estado_servicio === 'Completado') {
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_postular_gestion_servicio = ``;
          btn_cargar_trazabilidad = ``;
        } else if (servicio.estado_servicio === 'Rechazado') {
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_postular_gestion_servicio = ``;
          btn_cargar_trazabilidad = ``;
        } else if (servicio.estado_servicio === 'Postulado') {
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_postular_gestion_servicio = ``;
          btn_cargar_trazabilidad = ``;
        } else if (servicio.estado_servicio === 'Ganador') {
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_postular_gestion_servicio = ``;
          btn_cargar_trazabilidad = `
          <div class="btn-group btn-group-sm" role="group" aria-label="Extra-small button group">
            <button class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" type="button" id="btn_cargar_trazabilidad_" style="font-size:12px;" data-ServicioId="${servicio.servicioId}" data-RecursoId="${RecursoId}">
              <span class="uil uil-file-edit-alt" data-fa-transform="shrink-3"></span> Trazabilidad
            </button>
          </div>
          `;
        } else if (servicio.estado_servicio === 'No Asignada') {
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_postular_gestion_servicio = ``;
          btn_cargar_trazabilidad = ``;
        }

        rows += `
          <tr>
            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.razon_social}</td>
            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.tipo_servicio}</td>
            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.vehiculo}</td>
            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.Fecha_registro}</td>
            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_limite}</td>
            <td class='text-center' style='width: auto; white-space: nowrap;'>${col_estatus_publicacion}</td>
            <td class='text-center' style='width: auto; white-space: nowrap;'>
                ${btn_postular_gestion_servicio}
                ${btn_cargar_trazabilidad}
            </td>
          </tr>
          <tr id="detalle_recurso_proveedores_asignados_${servicio.servicioId}" style="display: none;">
            <td colspan="12">
              <div class="lista-detalle-accion-proveedores"></div>
            </td>
          </tr>
        `;

        rows2 += `
        <tr>
          <th scope="row">${index + 1}</th>
          <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.Valor_Servicio}</td>
          <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.Fecha_Inicio}</td>
          <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.cedula_conductor}</td>
          <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.nombre_conductor}</td>
          <td class='text-center' style='width: auto; white-space: nowrap;'>${(servicio.Placa) ? servicio.Placa : 'No Aplica'}</td>
        </tr>
      `;
      });

      document.getElementById("tbody_servicios_recurso").innerHTML = rows;
      document.getElementById("tbody_propuestos_proveedor").innerHTML = rows2;
    } else {
      document.getElementById("tbody_servicios_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
      document.getElementById("tbody_propuestos_proveedor").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
    }
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    document.getElementById("tbody_servicios_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
    document.getElementById("tbody_propuestos_proveedor").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
  }
}

// async function Listar_actividades_pedido(MaestroId) {
//   try {
//     let formData = new FormData();
//     formData.append("RecursoId", MaestroId);

//     let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_actividades_gestion', {
//       method: "POST",
//       body: formData,
//       cache: 'no-cache',
//     });

//     let data = await response.json();
//     let tbody = document.getElementById('tbody_actividades');
//     let usuario = document.getElementById('id_usuario').value;
//     let CriterioCalculo = "";
//     tbody.innerHTML = '';
//     data.forEach(element => {
//       // setTimeout(() => {}, 500);
//       const fila = document.createElement('tr');
//       const columnaPosicion = document.createElement('td');
//       columnaPosicion.textContent = element.posicion;
//       columnaPosicion.style.textAlign = 'center';
//       columnaPosicion.style.width = 'auto';
//       columnaPosicion.style.whiteSpace = 'nowrap';
//       const columnaParametro = document.createElement('td');
//       columnaParametro.textContent = element.nombre_tipo;
//       columnaParametro.style.textAlign = 'center';
//       columnaParametro.style.width = 'auto';
//       columnaParametro.style.whiteSpace = 'nowrap';

//       const columnaCostoActividad = document.createElement('td');
//       if (element.costo_actividad === null) {
//         columnaCostoActividad.innerHTML = `<input type="number" class="form-control form-control-sm costo_actividad text-center" id="costo_actividad${element.actividad_id}">`;
//       } else {
//         columnaCostoActividad.innerHTML = `<input type="number" class="form-control form-control-sm costo_actividad text-center" id="costo_actividad${element.actividad_id}" value="${element.costo_actividad}">`;
//       }
//       columnaCostoActividad.style.textAlign = 'center';
//       columnaCostoActividad.style.width = 'auto';
//       columnaCostoActividad.style.whiteSpace = 'nowrap';

//       const columnaActividad = document.createElement('td');
//       columnaActividad.innerHTML = `<span class="text-primary">${element.nombre_opcion}</span>`;
//       columnaActividad.style.textAlign = 'center';
//       columnaActividad.style.width = 'auto';
//       columnaActividad.style.whiteSpace = 'nowrap';

//       const columnaResponsable = document.createElement('td');
//       columnaResponsable.textContent = element.nom_usuario;
//       columnaResponsable.style.textAlign = 'center';
//       columnaResponsable.style.width = 'auto';
//       columnaResponsable.style.whiteSpace = 'nowrap';

//       const columnaFechaBase = document.createElement('td');
//       columnaFechaBase.textContent = element.fecha_base === null || '' ? 'Sin Fecha' : element.fecha_base;
//       columnaFechaBase.style.textAlign = 'center';
//       columnaFechaBase.style.width = 'auto';
//       columnaFechaBase.style.whiteSpace = 'nowrap';

//       const columnaVencimiento = document.createElement('td');
//       // columnaVencimiento.textContent = element.fecha_inicio + ' ' + element.hora_inicio;
//       if (element.fecha_inicio && element.hora_inicio) {
//         columnaVencimiento.textContent = element.fecha_inicio + ' ' + element.hora_inicio;
//       } else {
//         columnaVencimiento.textContent = 'sin fecha de vencimiento';
//       }

//       columnaVencimiento.style.textAlign = 'center';
//       columnaVencimiento.style.width = 'auto';
//       columnaVencimiento.style.whiteSpace = 'nowrap';

//       // const columnaVTiempoTrancurrido = document.createElement('td');
//       // columnaVTiempoTrancurrido.textContent = element.tiempo_transcurrido_base;
//       // columnaVTiempoTrancurrido.style.textAlign = 'center';
//       // columnaVTiempoTrancurrido.style.width = 'auto';
//       // columnaVTiempoTrancurrido.style.whiteSpace = 'nowrap';

//       const columnaVencimientoTranscurrido = document.createElement('td');
//       // columnaVencimientoTranscurrido.textContent = element.tiempo_transcurrido_base;
//       columnaVencimientoTranscurrido.textContent = element.valor_minutos;
//       columnaVencimientoTranscurrido.style.textAlign = 'center';
//       columnaVencimientoTranscurrido.style.width = 'auto';
//       columnaVencimientoTranscurrido.style.whiteSpace = 'nowrap';

//       const columnaEstdo = document.createElement('td');
//       if (element.estado_actividad === 'SIN INICIAR') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       } else if (element.estado_actividad === 'EN GESTION') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       } else if (element.estado_actividad === 'COMPLETADO') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       } else if (element.estado_actividad === 'CANCELADO') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       } else if (element.estado_actividad === 'PAUSADO') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       } else if (element.estado_actividad === 'VENCIDO') {
//         columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
//       }

//       columnaEstdo.style.textAlign = 'center';
//       columnaEstdo.style.width = 'auto';
//       columnaEstdo.style.whiteSpace = 'nowrap';
//       /* Eejcuatr consualtr de dependcias */
//       const columnaAcciones = document.createElement('td');
//       columnaAcciones.style.textAlign = 'center';
//       columnaAcciones.style.width = 'auto';
//       columnaAcciones.style.whiteSpace = 'nowrap';

//       if (element.estado_actividad === 'SIN INICIAR' || element.estado_actividad === 'EN GESTION' || element.estado_actividad === 'PAUSADO' || element.estado_actividad === 'VENCIDO') {
//         // Verificamos si la actividad actual tiene una actividad dependiente completada
//         if (element.actividad_dependiente !== null) {
//           // Buscamos la actividad dependiente y verificamos su estado
//           const actividadDependiente = data.find(act => act.actividad_id === element.actividad_dependiente);
//           if (actividadDependiente && actividadDependiente.estado_actividad === 'COMPLETADO') {
//             // Si la actividad dependiente está completada, desbloqueamos la actividad actual
//             if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
//               columnaAcciones.innerHTML = `
//                 <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                   <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                 </div>`;
//             } else {
//               if (element.estado_visualizar === 'VISUALIZADOR') {
//                 columnaAcciones.innerHTML = `
//                   <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                     <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                   </div>`;
//               } else {
//                 columnaAcciones.innerHTML = `
//                   <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                     <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad_proveedor" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-comment-alt-message"></i> Gestionar</button>
//                     <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                   </div>`;
//               }
//             }
//           } else {
//             // Si no está completada, dejamos la actividad bloqueada
//             if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
//               columnaAcciones.innerHTML = `
//                 <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                   <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                 </div>`;
//             } else {
//               if (element.estado_visualizar === 'VISUALIZADOR') {
//                 columnaAcciones.innerHTML = `
//                   <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                     <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                   </div>`;
//               } else {
//                 columnaAcciones.innerHTML = `
//                 <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                   <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad_proveedor" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}" disabled><i class="uil-comment-alt-message"></i> Gestionar</button>
//                   <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>

//                 </div>`;
//               }
//             }
//           }
//         } else {
//           // Si no tiene dependencia, se puede gestionar sin restricciones
//           if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
//             columnaAcciones.innerHTML = `
//               <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                 <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//               </div>`;
//           } else {
//             if (element.estado_visualizar === 'VISUALIZADOR') {
//               columnaAcciones.innerHTML = `
//                 <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                   <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//                 </div>`;
//             } else {
//               columnaAcciones.innerHTML = `
//               <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                 <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad_proveedor" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-comment-alt-message"></i> Gestionar</button>
//                 <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>

//               </div>`;
//             }
//           }
//         }
//       } else if (element.estado_actividad === 'COMPLETADO' || element.estado_actividad === 'CANCELADO') {
//         // Si la actividad ya está completada o cancelada
//         if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
//           columnaAcciones.innerHTML = `
//             <div class="btn-group btn-group-sm" role="group" aria-label="...">
//               <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//             </div>`;
//         } else {
//           columnaAcciones.innerHTML = `
//             <div class="btn-group btn-group-sm" role="group" aria-label="...">
//               <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
//             </div>`;
//         }
//       }

//       const fila2 = document.createElement('tr');
//       fila2.style.display = 'none';
//       fila2.setAttribute('id', `columnaproceso${element.actividad_id}`);

//       const columnaFormulario = document.createElement('td');

//       columnaFormulario.setAttribute('id', `celdaproceso${element.actividad_id}`);
//       columnaFormulario.setAttribute('colspan', 11);
//       columnaFormulario.style.backgroundColor = "#f1f2f4";

//       columnaFormulario.innerHTML = `
//           <div id="proceso_numero${element.num_proceso}" style="padding:1px 1px 1px;" data-idnum_proceso="${element.num_proceso}" class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
//             <div class="row">
//               <div id="mensaje${element.actividad_id}"></div>
//               <!--<div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex justify-content-end">
//                 <div class="mb-1">
//                   <div class="checkbox">
//                     <label style="font-weight: bold;font-size: 15px;">
//                       <input type="checkbox" id="publicar${element.actividad_id}" name="publicar" style="transform: scale(1.5);margin-right: 5px;">
//                       Publicar Gestion al Cliente
//                     </label>
//                   </div>
//                 </div>
//               </div>-->
//               <input class="form-control input-xs" type="hidden" id="parametros_pedido${element.actividad_id}" name="parametros_pedido" value="${element.proceso_id}" data-id_parametros_pedido="${element.proceso_id}" readonly>
//               <input class="form-control input-xs" type="hidden" id="parametros_punto_pedido_opcion${element.actividad_id}" name="parametros_punto_pedido_opcion" value="${element.actividad_id}" data-id_parametros_punto_pedido_opcion="${element.actividad_id}" readonly>

//               <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                 <div class="mb-1">
//                   <label class="form-label" for="documento${element.actividad_id}">Documento</label>
//                   <input type="file" name="documento" id="documento${element.actividad_id}" class="form-control form-control-sm">
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                 <div class="mb-1">
//                   <label class="form-label" for="estado_actividad${element.actividad_id}">Seleccionar Estado</label>
//                   <select name="estado_actividad" id="estado_actividad${element.actividad_id}" class="form-select form-select-sm">
//                     <option value="" selected>Selecciones</option>
//                     <option value="SIN INICIAR">SIN INICIAR</option>
//                     <option value="EN GESTION">EN GESTION</option>
//                     <option value="COMPLETADO">COMPLETADO</option>
//                     <option value="CANCELADO">CANCELADO</option>
//                     <option value="PAUSADO">PAUSADO</option>
//                   </select>
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
//                 <div class="mb-1">
//                   <label class="form-label" for="observacion_gestion${element.actividad_id}">Observación</label>
//                   <textarea name="observacion_gestion" id="observacion_gestion${element.actividad_id}" cols="30" rows="2"
//                     class="form-control form-control-sm"></textarea>
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex justify-content-end my-2">
//                 <div class="btn-group btn-group-sm" role="group" aria-label="...">
//                   <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1" style="margin-right:5px;" id="btn_cancelar_gestion${element.actividad_id}"><i class="fas fa-times"></i> Cancelar</button>
//                   <button type="button" class="btn btn-success btn-sm me-1 px-1 py-1" id="btn_guardar_gestion${element.actividad_id}" data-PedidoId="${data[0]['numdoc']}" data-MaestroId="${MaestroId}"><i class="far fa-save"></i> Guardar</button>
//                 </div>
//               </div>
//             </div>
//           </div>`;
//       const fila3 = document.createElement('tr');
//       fila3.style.display = 'none';
//       fila3.setAttribute('id', `columnadetalleactividad${element.actividad_id}`);
//       const columnaGestionActvidad = document.createElement('td');
//       columnaGestionActvidad.setAttribute('id', `columnadetalleactividad${element.actividad_id}`);
//       columnaGestionActvidad.setAttribute('colspan', 11);
//       columnaGestionActvidad.innerHTML = `
//         <div id="detalle_actividad_numero${element.num_proceso}" style="padding:1px 1px 1px;" data-idnum_proceso="${element.num_proceso}" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
//         <div id="mensaje_publicado${element.actividad_id}"></div>
//           <div class="bs-example" data-example-id="simple-table">
//             <table class="table table-sm" style="font-size:12px;">
//               <thead class='table-bordered'>
//                 <tr>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>#</th>
//                   <!--<th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Actividad</th>-->
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Fecha</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Observación</th>
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Responsable</th>
//                   <!--<th class='text-center' style='color:black;width: auto; white-space: nowrap;'>publicado</th>-->
//                   <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Evidencia</th>
//                 </tr>
//               </thead>
//               <tbody id="tbl_detalle_gestion${element.actividad_id}"></tbody>
//               <!--<tfoot>
//               <tr>
//                 <td colspan="5" class="d-flex justify-content-end"><button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1" style="margin-right:5px;" id="btn_cerrar_detalle${element.actividad_id}"><i class="fas fa-times"></i> Cerrar</button></td>
//               </tr>
//               </tfoot>-->
//             </table>
//           </div>
//         </div>
//         `;

//       // criterio_calculo
//       if (element.criterio_calculo === 1) {
//         CriterioCalculo = `Fecha Inicial`;
//       } else if (element.criterio_calculo === 2) {
//         CriterioCalculo = `Fecha Cargue`;
//       } else if (element.criterio_calculo === 3) {
//         CriterioCalculo = `Fecha Descargue`;
//       } else if (element.criterio_calculo === 4) {
//         CriterioCalculo = `Fecha actividad dependiente` + ' (' + element.nombre_actividad_dependiente + ')';
//       }

//       const columnaCriterioCalculo = document.createElement('td');
//       columnaCriterioCalculo.innerHTML = CriterioCalculo;
//       columnaCriterioCalculo.style.textAlign = 'center';
//       columnaCriterioCalculo.style.width = 'auto';
//       columnaCriterioCalculo.style.whiteSpace = 'nowrap';

//       fila.appendChild(columnaPosicion);
//       fila.appendChild(columnaParametro);
//       fila.appendChild(columnaActividad);
//       fila.appendChild(columnaCostoActividad);
//       fila.appendChild(columnaResponsable);
//       fila.appendChild(columnaCriterioCalculo);
//       fila.appendChild(columnaFechaBase);
//       fila.appendChild(columnaVencimiento);
//       // fila.appendChild(columnaVTiempoTrancurrido);
//       fila.appendChild(columnaVencimientoTranscurrido);
//       fila.appendChild(columnaEstdo);
//       fila.appendChild(columnaAcciones);

//       fila2.appendChild(columnaFormulario);
//       fila3.appendChild(columnaGestionActvidad);
//       // tbody.appendChild(fila, fila2, fila3);
//       tbody.appendChild(fila);
//       tbody.appendChild(fila2);
//       tbody.appendChild(fila3);

//       // Selecciona el input por su id
//       document.getElementById(`costo_actividad${element.actividad_id}`).addEventListener('keydown', async function (event) {
//         // Verifica si la tecla presionada es Enter
//         if (event.key === 'Enter') {
//           // Evita la acción predeterminada del Enter (como el envío de formulario)
//           event.preventDefault();

//           Swal.fire({
//             title: 'Actualizar Costo',
//             text: '¿Está seguro de continuar?',
//             icon: 'warning',
//             showCancelButton: true,
//             cancelButtonColor: '#9FA6B2',
//             confirmButtonColor: '#14A44D',
//             confirmButtonText: 'Si',
//             cancelButtonText: 'No',
//             customClass: {
//               popup: 'swal2-custom-font',
//             },
//           }).then(async result => {
//             if (result.isConfirmed) {
//               // Toma el valor del input
//               let valorInput = this.value;
//               let formdata = new FormData();
//               formdata.append('actvidad_id', element.actividad_id);
//               formdata.append('valor', valorInput);
//               // formdata.append('nundoc', data[0]['numdoc']);
//               formdata.append('nundoc', element.numdoc);
//               try {
//                 const response = await fetch($('#base_url').val() + 'pedidos/actualizar_costo', {
//                   method: 'POST',
//                   body: formdata,
//                   cache: 'no-cache',
//                 });

//                 const data = await response.json();
//                 if (data.status === 200) {
//                   Swal.fire({
//                     title: 'Exito!',
//                     // text: 'No hay información para generar la trazabilidad.',
//                     html: data.mensaje,
//                     icon: 'success',
//                     customClass: {
//                       popup: 'swal2-custom-font',
//                     },
//                   });
//                   // location.reload(false);
//                   setInterval(() => {
//                     location.reload(false);
//                   }, 500);
//                 } else {
//                   Swal.fire({
//                     title: 'Error!',
//                     // text: 'No hay información para generar la trazabilidad.',
//                     html: data.mensaje,
//                     icon: 'error',
//                     customClass: {
//                       popup: 'swal2-custom-font',
//                     },
//                   });
//                 }
//               } catch (error) {
//                 console.error('Error en la primera solicitud:', error);
//                 throw error;
//               } finally {
//                 // $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
//               }
//             }
//           });
//         }
//       });

//     });
//     Numero_actividades(data[0]['numdoc']);
//   } catch (error) {
//     console.error("Error al obtener proveedores:", error);
//     // document.getElementById("bloque_header").innerHTML = `<p class="text-danger">Error al cargar servicios</p>`;
//   } finally { }
// }

async function Listar_actividades_pedido(MaestroId) {
  try {
    let formData = new FormData();
    formData.append("RecursoId", MaestroId);

    let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_actividades_gestion', {
      method: "POST",
      body: formData,
      cache: 'no-cache',
    });

    let data = await response.json();
    let tbody = document.getElementById('tbody_actividades');
    let usuario = document.getElementById('id_usuario').value;
    let CriterioCalculo = "";
    tbody.innerHTML = '';
    data.forEach(element => {
      // setTimeout(() => {}, 500);
      const fila = document.createElement('tr');
      const columnaPosicion = document.createElement('td');
      columnaPosicion.textContent = element.posicion;
      columnaPosicion.style.textAlign = 'center';
      columnaPosicion.style.width = 'auto';
      columnaPosicion.style.whiteSpace = 'nowrap';
      const columnaParametro = document.createElement('td');
      columnaParametro.textContent = element.nombre_tipo;
      columnaParametro.style.textAlign = 'center';
      columnaParametro.style.width = 'auto';
      columnaParametro.style.whiteSpace = 'nowrap';

      // const columnaCostoActividad = document.createElement('td');
      // if (element.costo_actividad === null) {
      //   columnaCostoActividad.innerHTML = `<input type="number" class="form-control form-control-sm costo_actividad text-center" id="costo_actividad${element.actividad_id}">`;
      // } else {
      //   columnaCostoActividad.innerHTML = `<input type="number" class="form-control form-control-sm costo_actividad text-center" id="costo_actividad${element.actividad_id}" value="${element.costo_actividad}">`;
      // }
      // columnaCostoActividad.style.textAlign = 'center';
      // columnaCostoActividad.style.width = 'auto';
      // columnaCostoActividad.style.whiteSpace = 'nowrap';

      const columnaActividad = document.createElement('td');
      columnaActividad.innerHTML = `<span class="text-primary">${element.nombre_opcion}</span>`;
      columnaActividad.style.textAlign = 'center';
      columnaActividad.style.width = 'auto';
      columnaActividad.style.whiteSpace = 'nowrap';

      const columnaResponsable = document.createElement('td');
      columnaResponsable.textContent = element.nom_usuario;
      columnaResponsable.style.textAlign = 'center';
      columnaResponsable.style.width = 'auto';
      columnaResponsable.style.whiteSpace = 'nowrap';

      const columnaFechaBase = document.createElement('td');
      columnaFechaBase.textContent = element.fecha_base === null || '' ? 'Sin Fecha' : element.fecha_base;
      columnaFechaBase.style.textAlign = 'center';
      columnaFechaBase.style.width = 'auto';
      columnaFechaBase.style.whiteSpace = 'nowrap';

      const columnaVencimiento = document.createElement('td');
      // columnaVencimiento.textContent = element.fecha_inicio + ' ' + element.hora_inicio;
      if (element.fecha_inicio && element.hora_inicio) {
        columnaVencimiento.textContent = element.fecha_inicio + ' ' + element.hora_inicio;
      } else {
        columnaVencimiento.textContent = 'sin fecha de vencimiento';
      }

      columnaVencimiento.style.textAlign = 'center';
      columnaVencimiento.style.width = 'auto';
      columnaVencimiento.style.whiteSpace = 'nowrap';

      // const columnaVTiempoTrancurrido = document.createElement('td');
      // columnaVTiempoTrancurrido.textContent = element.tiempo_transcurrido_base;
      // columnaVTiempoTrancurrido.style.textAlign = 'center';
      // columnaVTiempoTrancurrido.style.width = 'auto';
      // columnaVTiempoTrancurrido.style.whiteSpace = 'nowrap';

      const columnaVencimientoTranscurrido = document.createElement('td');
      columnaVencimientoTranscurrido.textContent = element.valor_minutos;
      // columnaVencimientoTranscurrido.textContent = element.tiempo_transcurrido_base;
      columnaVencimientoTranscurrido.style.textAlign = 'center';
      columnaVencimientoTranscurrido.style.width = 'auto';
      columnaVencimientoTranscurrido.style.whiteSpace = 'nowrap';

      const columnaEstdo = document.createElement('td');
      if (element.estado_actividad === 'SIN INICIAR') {
        columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
      } else if (element.estado_actividad === 'EN GESTION') {
        columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
      } else if (element.estado_actividad === 'COMPLETADO') {
        columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
      } else if (element.estado_actividad === 'CANCELADO') {
        columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
      } else if (element.estado_actividad === 'PAUSADO') {
        columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
      } else if (element.estado_actividad === 'VENCIDO') {
        columnaEstdo.innerHTML = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.estado_actividad}</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
      }

      columnaEstdo.style.textAlign = 'center';
      columnaEstdo.style.width = 'auto';
      columnaEstdo.style.whiteSpace = 'nowrap';
      /* Eejcuatr consualtr de dependcias */
      const columnaAcciones = document.createElement('td');
      columnaAcciones.style.textAlign = 'center';
      columnaAcciones.style.width = 'auto';
      columnaAcciones.style.whiteSpace = 'nowrap';

      if (element.estado_actividad === 'SIN INICIAR' || element.estado_actividad === 'EN GESTION' || element.estado_actividad === 'PAUSADO' || element.estado_actividad === 'VENCIDO') {
        // Verificamos si la actividad actual tiene una actividad dependiente completada
        if (element.actividad_dependiente !== null) {
          // Buscamos la actividad dependiente y verificamos su estado
          const actividadDependiente = data.find(act => act.actividad_id === element.actividad_dependiente);
          if (actividadDependiente && actividadDependiente.estado_actividad === 'COMPLETADO') {
            // Si la actividad dependiente está completada, desbloqueamos la actividad actual
            if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
              columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                  <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                </div>`;
            } else {
              if (element.estado_visualizar === 'VISUALIZADOR') {
                columnaAcciones.innerHTML = `
                  <div class="btn-group btn-group-sm" role="group" aria-label="...">
                    <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                  </div>`;
              } else {
                columnaAcciones.innerHTML = `
                  <div class="btn-group btn-group-sm" role="group" aria-label="...">
                    <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad_proveedor" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-comment-alt-message"></i> Gestionar</button>
                    <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                  </div>`;
              }
            }
          } else {
            // Si no está completada, dejamos la actividad bloqueada
            if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
              columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                  <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                </div>`;
            } else {
              if (element.estado_visualizar === 'VISUALIZADOR') {
                columnaAcciones.innerHTML = `
                  <div class="btn-group btn-group-sm" role="group" aria-label="...">
                    <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                  </div>`;
              } else {
                columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                  <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad_proveedor" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}" disabled><i class="uil-comment-alt-message"></i> Gestionar</button>
                  <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                 
                </div>`;
              }
            }
          }
        } else {
          // Si no tiene dependencia, se puede gestionar sin restricciones
          if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
            columnaAcciones.innerHTML = `
              <div class="btn-group btn-group-sm" role="group" aria-label="...">
                <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
              </div>`;
          } else {
            if (element.estado_visualizar === 'VISUALIZADOR') {
              columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                  <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
                </div>`;
            } else {
              columnaAcciones.innerHTML = `
              <div class="btn-group btn-group-sm" role="group" aria-label="...">
                <button type="button" class="btn btn-subtle-success btn-sm me-1 px-1 py-0" title="Gestionar actividad" id="btn_gestion_actividad_proveedor" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-comment-alt-message"></i> Gestionar</button>
                <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
               
              </div>`;
            }
          }
        }
      } else if (element.estado_actividad === 'COMPLETADO' || element.estado_actividad === 'CANCELADO') {
        // Si la actividad ya está completada o cancelada
        if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
          columnaAcciones.innerHTML = `
            <div class="btn-group btn-group-sm" role="group" aria-label="...">
              <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
            </div>`;
        } else {
          columnaAcciones.innerHTML = `
            <div class="btn-group btn-group-sm" role="group" aria-label="...">
              <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-PedidoId="${data[0]['numdoc']}" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="uil-eye"></i> Trazabilidad</button>
            </div>`;
        }
      }

      const fila2 = document.createElement('tr');
      fila2.style.display = 'none';
      fila2.setAttribute('id', `columnaproceso${element.actividad_id}`);

      const columnaFormulario = document.createElement('td');

      columnaFormulario.setAttribute('id', `celdaproceso${element.actividad_id}`);
      columnaFormulario.setAttribute('colspan', 11);
      columnaFormulario.style.backgroundColor = "#f1f2f4";

      columnaFormulario.innerHTML = `
          <div id="proceso_numero${element.num_proceso}" style="padding:1px 1px 1px;" data-idnum_proceso="${element.num_proceso}" class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div class="row">
              <div id="mensaje${element.actividad_id}"></div>
              <!--<div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex justify-content-end">
                <div class="mb-1">
                  <div class="checkbox">
                    <label style="font-weight: bold;font-size: 15px;">
                      <input type="checkbox" id="publicar${element.actividad_id}" name="publicar" style="transform: scale(1.5);margin-right: 5px;">
                      Publicar Gestion al Cliente
                    </label>
                  </div>
                </div>
              </div>-->
              <input class="form-control input-xs" type="hidden" id="parametros_pedido${element.actividad_id}" name="parametros_pedido" value="${element.proceso_id}" data-id_parametros_pedido="${element.proceso_id}" readonly>
              <input class="form-control input-xs" type="hidden" id="parametros_punto_pedido_opcion${element.actividad_id}" name="parametros_punto_pedido_opcion" value="${element.actividad_id}" data-id_parametros_punto_pedido_opcion="${element.actividad_id}" readonly>

              <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <div class="mb-1">
                  <label class="form-label" for="documento${element.actividad_id}">Documento</label>
                  <input type="file" name="documento" id="documento${element.actividad_id}" class="form-control form-control-sm">
                </div>
              </div>

              <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <div class="mb-1">
                  <label class="form-label" for="estado_actividad${element.actividad_id}">Seleccionar Estado</label>
                  <select name="estado_actividad" id="estado_actividad${element.actividad_id}" class="form-select form-select-sm" data-EstadoActividadId="${element.actividad_id}">
                    <option value="" selected>Selecciones</option>
                    <option value="SIN INICIAR">SIN INICIAR</option>
                    <option value="EN GESTION">EN GESTION</option>
                    <option value="COMPLETADO">COMPLETADO</option>
                    <option value="CANCELADO">CANCELADO</option>
                    <option value="PAUSADO">PAUSADO</option>
                  </select>
                </div>
              </div>

              <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <div class="mb-1">
                  <label class="form-label" for="costo_estimado${element.actividad_id}">Costo Estimado</label>
                  <input type="text" name="costo_estimado" id="costo_estimado${element.actividad_id}" class="form-control form-control-sm text-center" disabled value="${element.costo_promedio ? parseFloat(element.costo_promedio).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : 0}">
                </div>
              </div>

              <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <div class="mb-1">
                  <label class="form-label" for="costo_ejecutado${element.actividad_id}">Costo Ejecutado</label>
                  <input type="number" name="costo_ejecutado" id="costo_ejecutado${element.actividad_id}" class="form-control form-control-sm text-center" disabled>
                </div>
              </div>

              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <div class="mb-1">
                  <label class="form-label" for="observacion_gestion${element.actividad_id}">Observación</label>
                  <textarea name="observacion_gestion" id="observacion_gestion${element.actividad_id}" cols="30" rows="2" oninput="this.value = this.value.toUpperCase();"
                    class="form-control form-control-sm"></textarea>
                </div>
              </div>

              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex justify-content-end my-2">
                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                  <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1" style="margin-right:5px;" id="btn_cancelar_gestion${element.actividad_id}"><i class="fas fa-times"></i> Cancelar</button>
                  <button type="button" class="btn btn-success btn-sm me-1 px-1 py-1" id="btn_guardar_gestion${element.actividad_id}" data-PedidoId="${data[0]['numdoc']}" data-MaestroId="${MaestroId}"><i class="far fa-save"></i> Guardar</button>
                </div>
              </div>
            </div>
          </div>`;
      const fila3 = document.createElement('tr');
      fila3.style.display = 'none';
      fila3.setAttribute('id', `columnadetalleactividad${element.actividad_id}`);
      const columnaGestionActvidad = document.createElement('td');
      columnaGestionActvidad.setAttribute('id', `columnadetalleactividad${element.actividad_id}`);
      columnaGestionActvidad.setAttribute('colspan', 11);
      columnaGestionActvidad.innerHTML = `
        <div id="detalle_actividad_numero${element.num_proceso}" style="padding:1px 1px 1px;" data-idnum_proceso="${element.num_proceso}" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div id="mensaje_publicado${element.actividad_id}"></div>
          <div class="bs-example" data-example-id="simple-table">
            <table class="table table-sm" style="font-size:12px;">
              <thead class='table-bordered'>
                <tr>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>#</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Fecha</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Costo Estimado</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Costo Ejecutado</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Observación</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Responsable</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Evidencia</th>
                </tr>
              </thead>
              <tbody id="tbl_detalle_gestion${element.actividad_id}"></tbody>
            </table>
          </div>
        </div>
        `;

      // criterio_calculo
      if (element.criterio_calculo === 1) {
        CriterioCalculo = `Fecha Inicial`;
      } else if (element.criterio_calculo === 2) {
        CriterioCalculo = `Fecha Cargue`;
      } else if (element.criterio_calculo === 3) {
        CriterioCalculo = `Fecha Descargue`;
      } else if (element.criterio_calculo === 4) {
        // CriterioCalculo = `Fecha actividad dependiente`+' ('+element.nombre_actividad_dependiente+')';
        CriterioCalculo = `Fecha actividad dependiente`;
      }

      const columnaCriterioCalculo = document.createElement('td');
      columnaCriterioCalculo.innerHTML = CriterioCalculo;
      columnaCriterioCalculo.style.textAlign = 'center';
      columnaCriterioCalculo.style.width = 'auto';
      columnaCriterioCalculo.style.whiteSpace = 'nowrap';

      fila.appendChild(columnaPosicion);
      fila.appendChild(columnaParametro);
      fila.appendChild(columnaActividad);
      // fila.appendChild(columnaCostoActividad);
      fila.appendChild(columnaResponsable);
      fila.appendChild(columnaCriterioCalculo);
      fila.appendChild(columnaFechaBase);
      fila.appendChild(columnaVencimiento);
      // fila.appendChild(columnaVTiempoTrancurrido);
      fila.appendChild(columnaVencimientoTranscurrido);
      fila.appendChild(columnaEstdo);
      fila.appendChild(columnaAcciones);

      fila2.appendChild(columnaFormulario);
      fila3.appendChild(columnaGestionActvidad);
      // tbody.appendChild(fila, fila2, fila3);
      tbody.appendChild(fila);
      tbody.appendChild(fila2);
      tbody.appendChild(fila3);
    });
    Numero_actividades(data[0]['numdoc']);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    // document.getElementById("bloque_header").innerHTML = `<p class="text-danger">Error al cargar servicios</p>`;
  } finally { }
}

async function Numero_actividades(nundoc) {
  let data = new FormData();
  data.append('nundoc', nundoc);
  await fetch($('#base_url').val() + 'pedidos/Progreso_pedido', {
    method: 'POST',
    body: data,
    cache: 'no-cache',
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res)))
    .catch(error => {
      alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
    })
    .then(response => {
      var objeto = response.cantidad_actividades;
      var cantidadActividades = objeto.Cantidad_actividades;
      var totalActividades = parseInt(cantidadActividades);
      var porcentajePorActividad = 100 / totalActividades;
      var progresoActual = 0;
      response.estado_actividades.forEach(element => {
        // console.log(element);
        if (element.estado_actividad === 'COMPLETADO') {
          progresoActual++;
          // totalActividadesCompletas;
        }
      });
      // Calcular el ancho de la barra de progreso
      // var ancho = (progresoActual / totalActividades) * 100;
      var ancho = 100 * progresoActual / totalActividades;
      // console.log(ancho);
      // Actualizar la barra de progreso
      $('.progress-bar').css('width', ancho + '%');
      // $(".progress-bar").html(ancho.toFixed(2) + "%"); // Redondear el porcentaje a dos decimales
      ancho = Math.round(ancho * 100) / 100; // Redondear a dos decimales
      $('.progress-bar').html(ancho + '%'); // Redondear el porcentaje a dos decimales
    });
}

// async function Detalles_actividaes(nundoc, actividad_id) {
//   let data = new FormData();
//   data.append('nundoc', nundoc);
//   data.append('actividad', actividad_id);
//   await fetch($('#base_url').val() + 'pedidos/ver_detalle_actividad', {
//     method: 'POST',
//     body: data,
//     cache: 'no-cache',
//   })
//     .then(res => (res.ok ? res.json() : Promise.reject(res)))
//     .catch(error => {
//       alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
//     })
//     .then(response => {
//       let tbody = document.getElementById('tbl_detalle_gestion' + actividad_id);
//       tbody.innerHTML = '';
//       if (response.length > 0) {
//         response.forEach(element => {
//           // setTimeout(() => {}, 500);
//           const fila = document.createElement('tr');
//           fila.style.fontSize = '12px';
//           const columnaNumero = document.createElement('td');
//           columnaNumero.textContent = element.detalle_id;
//           columnaNumero.style.textAlign = 'center';
//           columnaNumero.style.width = 'auto';
//           columnaNumero.style.whiteSpace = 'nowrap';

//           const columnaFecha = document.createElement('td');
//           columnaFecha.textContent = element.fecha;
//           columnaFecha.style.textAlign = 'center';
//           columnaFecha.style.width = 'auto';
//           columnaFecha.style.whiteSpace = 'nowrap';

//           const columnaObservacion = document.createElement('td');
//           columnaObservacion.textContent = element.observacion;
//           columnaObservacion.style.textAlign = 'center';
//           columnaObservacion.style.width = 'auto';
//           columnaObservacion.style.whiteSpace = 'nowrap';

//           const columnaResponsable = document.createElement('td');
//           columnaResponsable.textContent = element.usuario;
//           columnaResponsable.style.textAlign = 'center';
//           columnaResponsable.style.width = 'auto';
//           columnaResponsable.style.whiteSpace = 'nowrap';
//           // const columnaPublicado = document.createElement('td');
//           // if (element.se_publica === 'SI') {
//           //   columnaPublicado.innerHTML = `
//           //   <select style="background-color:#14A44D;color:#FFFFFF;border-radiud:15px;" onchange="Publicado(this,${actividad_id},${nundoc},${element.detalle_id})" class="select_publicados" id="select_publicado${actividad_id}" data-id="${element.detalle_id}">
//           //           <option value="${element.se_publica}">${element.se_publica}</option>
//           //           <option value="NO">NO</option>
//           //   </select>`;
//           // } else {
//           //   columnaPublicado.innerHTML = `
//           //   <select style="background-color:#DC4C64;color:#FFFFFF;" onchange="Publicado(this,${actividad_id},${nundoc},${element.detalle_id})" class="select_publicados" id="select_publicado${actividad_id}" data-id="${element.detalle_id}">
//           //     <option value="${element.se_publica}">${element.se_publica}</option>
//           //     <option value="SI">SI</option>
//           //   </select>`;
//           // }
//           // columnaPublicado.style.textAlign = 'center';
//           const columnaEvidencia = document.createElement('td');
//           if (element.nombre_archivo !== 'Sin_evidencia') {
//             columnaEvidencia.innerHTML = `
//             <div class="btn-group" role="group" aria-label="...">
//               <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" onclick="abrir_fotos('${element.documento}' , '${element.nombre_archivo}')"><i class="uil-file-download-alt"></i> Descargar</button>
//              </div>
//             `;
//           } else {
//             columnaEvidencia.innerHTML = `<span class="text-primary">Sin evidencia</span>`;
//           }
//           columnaEvidencia.style.textAlign = 'center';
//           columnaEvidencia.style.width = 'auto';
//           columnaEvidencia.style.whiteSpace = 'nowrap';

//           fila.appendChild(columnaNumero);
//           // fila.appendChild(columnaParametro);
//           // fila.appendChild(columnaConcepto);
//           fila.appendChild(columnaFecha);
//           fila.appendChild(columnaObservacion);
//           fila.appendChild(columnaResponsable);
//           // fila.appendChild(columnaPublicado);
//           fila.appendChild(columnaEvidencia);
//           tbody.appendChild(fila);

//         });
//       } else {
//         const fila = document.createElement('tr');
//         const columnaSindatos = document.createElement('td');
//         columnaSindatos.colSpan = 5;
//         columnaSindatos.innerHTML = `Actividad del parametro sin Gestión`;
//         columnaSindatos.style.textAlign = 'center';
//         columnaSindatos.style.width = 'auto';
//         columnaSindatos.style.whiteSpace = 'nowrap';

//         fila.appendChild(columnaSindatos);
//         tbody.appendChild(fila);
//       }
//     });
// }

async function Detalles_actividaes(nundoc, actividad_id) {
  let data = new FormData();
  data.append('nundoc', nundoc);
  data.append('actividad', actividad_id);
  await fetch($('#base_url').val() + 'pedidos/ver_detalle_actividad', {
    method: 'POST',
    body: data,
    cache: 'no-cache',
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res)))
    .catch(error => {
      alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
    })
    .then(response => {
      let tbody = document.getElementById('tbl_detalle_gestion' + actividad_id);
      tbody.innerHTML = '';
      if (response.length > 0) {
        response.forEach(element => {
          setTimeout(() => {
            const fila = document.createElement('tr');
            fila.style.fontSize = '12px';
            const columnaNumero = document.createElement('td');
            columnaNumero.textContent = element.detalle_id;
            columnaNumero.style.textAlign = 'center';
            columnaNumero.style.width = 'auto';
            columnaNumero.style.whiteSpace = 'nowrap';

            const columnaFecha = document.createElement('td');
            columnaFecha.textContent = element.fecha;
            columnaFecha.style.textAlign = 'center';
            columnaFecha.style.width = 'auto';
            columnaFecha.style.whiteSpace = 'nowrap';

            const columnaCostoEstimado = document.createElement('td');
            columnaCostoEstimado.textContent = parseFloat(element.costo_promedio).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
            columnaCostoEstimado.style.textAlign = 'center';
            columnaCostoEstimado.style.width = 'auto';
            columnaCostoEstimado.style.whiteSpace = 'nowrap';

            const columnaCostoActividad = document.createElement('td');
            columnaCostoActividad.textContent = element.costo_actividad ? parseFloat(element.costo_actividad).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : '-';
            columnaCostoActividad.style.textAlign = 'center';
            columnaCostoActividad.style.width = 'auto';
            columnaCostoActividad.style.whiteSpace = 'nowrap';


            const columnaObservacion = document.createElement('td');
            columnaObservacion.textContent = element.observacion;
            columnaObservacion.style.textAlign = 'center';
            columnaObservacion.style.width = 'auto';
            columnaObservacion.style.whiteSpace = 'nowrap';

            const columnaResponsable = document.createElement('td');
            columnaResponsable.textContent = element.usuario;
            columnaResponsable.style.textAlign = 'center';
            columnaResponsable.style.width = 'auto';
            columnaResponsable.style.whiteSpace = 'nowrap';

            const columnaEvidencia = document.createElement('td');
            if (element.nombre_archivo !== 'Sin_evidencia') {
              columnaEvidencia.innerHTML = `
            <div class="btn-group" role="group" aria-label="...">
              <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0" onclick="abrir_fotos('${element.documento}' , '${element.nombre_archivo}')"><i class="uil-file-download-alt"></i> Descargar</button>
             </div>
            `;
            } else {
              columnaEvidencia.innerHTML = `<span class="text-primary">Sin evidencia</span>`;
            }
            columnaEvidencia.style.textAlign = 'center';
            columnaEvidencia.style.width = 'auto';
            columnaEvidencia.style.whiteSpace = 'nowrap';

            fila.appendChild(columnaNumero);
            // fila.appendChild(columnaParametro);
            // fila.appendChild(columnaConcepto);
            fila.appendChild(columnaFecha);
            fila.appendChild(columnaCostoEstimado);
            fila.appendChild(columnaCostoActividad);
            fila.appendChild(columnaObservacion);
            fila.appendChild(columnaResponsable);
            // fila.appendChild(columnaPublicado);
            fila.appendChild(columnaEvidencia);
            tbody.appendChild(fila);
          }, 500);
        });
      } else {
        const fila = document.createElement('tr');
        const columnaSindatos = document.createElement('td');
        columnaSindatos.colSpan = 5;
        columnaSindatos.innerHTML = `Actividad del parametro sin Gestión`;
        columnaSindatos.style.textAlign = 'center';
        columnaSindatos.style.width = 'auto';
        columnaSindatos.style.whiteSpace = 'nowrap';

        fila.appendChild(columnaSindatos);
        tbody.appendChild(fila);
      }
    });
}

function abrir_fotos(url, name) {
  // URL de la página que deseas abrir en la nueva ventana
  var url = $('#base_url').val() + url + name;
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

// function trazabilidad_pedido(valor, SolicitudId) {
//   if (valor === '') {
//     document.getElementById("trazabilidad_pedidos_recurso_" + SolicitudId).style.display = "none";
//     document.getElementById("carga_trazabilidad_pedidos_recurso_" + SolicitudId).style.display = "none";
//   } else if (valor === 'Cargue Documento') {
//     document.getElementById("trazabilidad_pedidos_recurso_" + SolicitudId).style.display = "none";
//     document.getElementById("carga_trazabilidad_pedidos_recurso_" + SolicitudId).style.display = "";
//     document.getElementById("cargue_masivo_pedidos" + SolicitudId).style.display = "";
//     document.getElementById("visualizar_pedidos_cargue" + SolicitudId).style.display = "";
//     document.getElementById("btn_guardar_trazabilidad_pedido" + SolicitudId).style.display = "";
//   } else {
//     let nuevaCadena = valor.replace("_", " "); // Reemplaza el guion bajo con un espacio
//     document.getElementById("OpcionTrazabilidad" + SolicitudId).value = nuevaCadena;
//     document.getElementById("trazabilidad_pedidos_recurso_" + SolicitudId).style.display = "";
//   }
// }

function trazabilidad_pedido(valor, SolicitudId) {
  console.log("🚀 ~ valor:", valor)
  if (valor === '') {
    document.getElementById("trazabilidad_pedidos_recurso_" + SolicitudId).style.display = "none";
    document.getElementById("carga_trazabilidad_pedidos_recurso_" + SolicitudId).style.display = "none";
  } else if (valor === 'Cargue Documento') {
    document.getElementById("trazabilidad_pedidos_recurso_" + SolicitudId).style.display = "none";
    document.getElementById("carga_trazabilidad_pedidos_recurso_" + SolicitudId).style.display = "";
    document.getElementById("cargue_masivo_pedidos" + SolicitudId).style.display = "";
    document.getElementById("visualizar_pedidos_cargue" + SolicitudId).style.display = "";
    document.getElementById("btn_guardar_trazabilidad_pedido" + SolicitudId).style.display = "";
  } else {
    if (valor === 'Fecha Estimada Entrega') {
      document.getElementById("trazabilidad_pedidos_recurso_" + SolicitudId).style.display = "";
      document.getElementById("trazabilidad_pedidos_" + SolicitudId).style.display = "none";
      document.getElementById("trazabilidad_tiempo_estimado_" + SolicitudId).style.display = "";
    } else {
      let nuevaCadena = valor.replace("_", " "); // Reemplaza el guion bajo con un espacio
      document.getElementById("OpcionTrazabilidad" + SolicitudId).value = nuevaCadena;
      document.getElementById("trazabilidad_pedidos_recurso_" + SolicitudId).style.display = "";
      document.getElementById("trazabilidad_pedidos_" + SolicitudId).style.display = "";
    }
  }
}

async function ImportarTrazabilidad(params) {
  // console.log("🚀 ~ ImportarTrazabilidad ~ params:", params)

  if (globalData.length === 0) {
    Swal.fire({
      title: "Mensaje!",
      text: "No hay datos para enviar. Primero carga y previsualiza un archivo de Excel.",
      icon: "warning",
      draggable: true
    });
    return;
  }

  const result = await Swal.fire({
    title: 'Seguro',
    text: '¿Desea aprobar la solicitud?',
    icon: 'warning',
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
    const btn = document.querySelector("#btn_guardar_trazabilidad");
    btn.disabled = true;
    btn.innerHTML = "Importando... ⏳";

    try {
      // Crear objeto FormData
      let formData = new FormData();
      // formData.append("ServicioId", ServicioId);
      // formData.append("RecursoId", RecursoId);
      formData.append("globalData", JSON.stringify(globalData));  // Convertimos globalData a JSON

      const response = await fetch($('#base_url').val() + 'torrecontrol/importar_trazabilidad_pedido', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      Swal.fire({
        title: "Mensaje!",
        text: data.message,
        icon: data.status === true ? "success" : "error",
        draggable: true
      });

    } catch (err) {
      console.error(err);
      alert("Error al enviar datos al servidor.");
    } finally {
      btn.disabled = false;
      btn.innerHTML = "<span class='uil uil-file-import'></span> Importar Trazabilidad";
    }
  }

}

// async function estado_recurso() {
//   const filas = document.querySelectorAll("#tbl_administrador_recurso_pedidos tr td:last-child");
//   const baseUrl = $('#base_url').val();

//   for (const columna of filas) {
//     const id = columna.dataset.id;
//     if (id) {
//       try {
//         const formData = new FormData();
//         formData.append('RecursoId', id);

//         const response = await fetch(`${baseUrl}torrecontrol/estado_recurso`, {
//           method: 'POST',
//           body: formData
//         });

//         const data = await response.json();
//         columna.innerHTML = ''; // Limpiar contenido previo

//         data.forEach(element => {
//           let estado_recurso = '';

//           switch (element.estado_servicio) {
//             case 'Ganador':
//               estado_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-success" data-bs-toggle="tooltip" data-bs-placement="top" title="${element.razon_social}"><span class="badge-label">${element.estado_servicio}</span></span>`;
//               break;
//             case 'Postulado':
//               estado_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning" data-bs-toggle="tooltip" data-bs-placement="top" title="${element.razon_social}"><span class="badge-label">${element.estado_servicio}</span></span>`;
//               break;
//             case 'Pendiente Iniciar':
//               estado_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="${element.razon_social}"><span class="badge-label">${element.estado_servicio}</span></span>`;
//               break;
//             default:
//               estado_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-dark"><span class="badge-label">Desconocido</span></span>`;
//           }

//           columna.innerHTML += estado_recurso;
//         });

//       } catch (error) {
//         console.error('Error obteniendo estado recurso:', error);
//         columna.innerHTML = '<span class="text-danger">Error</span>';
//       }
//     }
//   }
// }

async function estado_recurso() {
  const filas = document.querySelectorAll("#tbl_administrador_recurso_pedidos tr td:last-child");
  const baseUrl = $('#base_url').val();

  for (const columna of filas) {
    const id = columna.dataset.id;
    if (id) {
      try {
        const formData = new FormData();
        formData.append('RecursoId', id);

        const response = await fetch(`${baseUrl}torrecontrol/estado_recurso`, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        // console.log("🚀 ~ estado_recurso ~ data:",  data)

        columna.innerHTML = ''; // Limpiar contenido previo

        // Verificar si es un array o un objeto único
        if (Array.isArray(data)) {
          // Si es un array, recorrerlo
          data.forEach(element => {
            columna.innerHTML += generarBadge(element);
          });
        } else {
          // Si es un objeto único, solo mostrarlo
          columna.innerHTML = generarBadge(data);
        }

      } catch (error) {
        console.error('Error obteniendo estado recurso:', error);
        columna.innerHTML = '<span class="text-danger">Error</span>';
      }
    }
  }
}

// Función auxiliar para generar el badge según el estado
function generarBadge(element) {
  let badgeClass = "badge-phoenix-dark"; // Estado por defecto
  let estadoTexto = "Desconocido";

  switch (element.estado_servicio) {
    case 'Ganador':
      badgeClass = "badge-phoenix-success";
      estadoTexto = element.estado_servicio;
      break;
    case 'Postulado':
      badgeClass = "badge-phoenix-warning";
      estadoTexto = element.estado_servicio;
      break;
    case 'Pendiente Iniciar':
      badgeClass = "badge-phoenix-secondary";
      estadoTexto = element.estado_servicio;
      break;
    case 'No Asignada':
      badgeClass = "badge-phoenix-danger";
      estadoTexto = element.estado_servicio;
      break;
  }

  return `<span class="badge badge-phoenix fs-10 ${badgeClass}" data-bs-toggle="tooltip" data-bs-placement="top" title="${element.razon_social}">
            <span class="badge-label">${estadoTexto}</span>
          </span>`;
}

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
        data-bs-scroll="${this.settings.scroll}" 
        data-bs-backdrop="${this.settings.backdrop}" 
        tabindex="-1" 
        aria-labelledby="${this.settings.id}-label" style="width: ${this.settings.width}; height: ${this.settings.height}">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title fw-bold" id="${this.settings.id}-label">
            ${this.settings.title}
          </h5>
          <button class="btn-close text-reset" type="button" data-bs-dismiss="offcanvas"></button>
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

/* Funcion para modificar la clase del offcanvas */
DynamicOffcanvas.prototype.updateClass = function (newClass) {
  var offcanvas = this.offcanvasElement;

  // Eliminar todas las clases de posición de offcanvas
  Array.from(offcanvas.classList)
    .filter(cls => cls.startsWith('offcanvas-'))
    .forEach(cls => offcanvas.classList.remove(cls));

  // Agregar la nueva clase
  offcanvas.classList.add(newClass);
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

if (!window.globalData) {
  window.globalData = [];
} else {
  console.log('El offcanvas ya está creado.');
}

// function leerExcel() {
//   const fileInput = document.getElementById('excelFile');
//   const file = fileInput.files[0];

//   if (!file) {
//     alert("Por favor selecciona un archivo de Excel primero.");
//     return;
//   }

//   const reader = new FileReader();

//   reader.onload = function (e) {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: 'array' });

//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//     if (sheetData.length === 0) {
//       alert("El archivo está vacío o no tiene datos.");
//       return;
//     }

//     const previewTable = document.getElementById("previewTable");
//     previewTable.innerHTML = "";

//     // Crear encabezados de la tabla
//     const thead = document.createElement("thead");
//     thead.style.fontSize = "10px";
//     thead.style.color = "#332D2D";

//     const headerRow = document.createElement("tr");
//     headerRow.classList.add("text-center");
//     const headers1 = sheetData[0].filter(header => header.trim() !== ""); // Filtra vacíos
//     headers1.forEach(headerText => {
//       const th = document.createElement("th");
//       th.textContent = headerText;
//       headerRow.appendChild(th);
//     });

//     // Agregar una columna adicional para el botón de eliminar
//     const thEliminar = document.createElement("th");
//     thEliminar.textContent = "ACCIONES";
//     headerRow.appendChild(thEliminar);

//     thead.appendChild(headerRow);
//     previewTable.appendChild(thead);

//     // Crear cuerpo de la tabla con las filas
//     const tbody = document.createElement("tbody");
//     tbody.style.fontSize = "10px";
//     tbody.style.textAlign = "center";

//     const headers = sheetData[0]; // Definir headers antes del bucle

//     sheetData.slice(1).forEach((rowData, rowIndex) => {
//       const row = document.createElement("tr");

//       rowData.forEach((cellData, index) => {
//         const td = document.createElement("td");

//         // Convertir fechas en formato numérico a fecha legible
//         if (typeof cellData === "number" && headers[index].toLowerCase().includes("fecha")) {
//           let date = new Date((cellData - 25569) * 86400 * 1000);
//           td.textContent = date.toISOString().split("T")[0];
//         } else {
//           td.textContent = (cellData !== undefined && cellData !== null) ? cellData : "";
//         }

//         row.appendChild(td);
//       });
//       // Agregar botón de eliminar
//       const tdEliminar = document.createElement("td");
//       const btnEliminar = document.createElement("button");
//       // btnEliminar.textContent = "Eliminar";
//       btnEliminar.innerHTML = `<span class="uil-trash-alt"></span>`;
//       btnEliminar.classList.add("btn", "btn-subtle-danger", "btn-sm", "me-1", "px-1", "py-0");
//       // btnEliminar.onclick = function () {
//       //   if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
//       //     row.remove(); // Eliminar la fila del DOM
//       //     globalData.splice(rowIndex, 1); // Eliminar del array global
//       //   }
//       // };

//       btnEliminar.onclick = function () {
//         if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
//           row.remove(); // Eliminar del DOM

//           // Buscar el índice correcto en globalData
//           let indexToRemove = globalData.findIndex(item =>
//             Object.values(item).join("") === row.innerText.replace(/\s/g, "")
//           );

//           if (indexToRemove > -1) {
//             globalData.splice(indexToRemove, 1); // Eliminar del array global
//           }
//         }
//       };

//       tdEliminar.appendChild(btnEliminar);
//       row.appendChild(tdEliminar);

//       tbody.appendChild(row);
//     });

//     previewTable.appendChild(tbody);

//     globalData = sheetData.slice(1).map(row => {
//       let obj = {};
//       headers.forEach((header, index) => {
//         let cellData = row[index] || "";

//         // Convertir fechas si el header contiene "fecha"
//         if (typeof cellData === "number" && header.toLowerCase().includes("fecha")) {
//           let date = new Date((cellData - 25569) * 86400 * 1000);
//           cellData = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
//         }

//         obj[header] = cellData;
//       });
//       return obj;
//     });

//   };

//   reader.readAsArrayBuffer(file);
// }

// function leerExcel() {
//   const fileInput = document.getElementById('excelFile');
//   const file = fileInput.files[0];

//   if (!file) {
//     alert("Por favor selecciona un archivo de Excel primero.");
//     return;
//   }

//   const reader = new FileReader();

//   reader.onload = function (e) {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: 'array' });

//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//     if (sheetData.length === 0) {
//       alert("El archivo está vacío o no tiene datos.");
//       return;
//     }

//     const previewTable = document.getElementById("previewTable");
//     previewTable.innerHTML = "";

//     // Crear encabezados de la tabla
//     const thead = document.createElement("thead");
//     thead.style.fontSize = "10px";
//     thead.style.color = "#332D2D";

//     const headerRow = document.createElement("tr");
//     headerRow.classList.add("text-center");
//     const headers = sheetData[0].filter(header => header.trim() !== "");
//     headers.forEach(headerText => {
//       const th = document.createElement("th");
//       th.textContent = headerText;
//       headerRow.appendChild(th);
//     });

//     // Agregar columna Acciones
//     const thEliminar = document.createElement("th");
//     thEliminar.textContent = "Acciones";
//     headerRow.appendChild(thEliminar);

//     thead.appendChild(headerRow);
//     previewTable.appendChild(thead);

//     const tbody = document.createElement("tbody");
//     tbody.style.fontSize = "10px";
//     tbody.style.textAlign = "center";

//     sheetData.slice(1).forEach((rowData) => {
//       const row = document.createElement("tr");

//       rowData.forEach((cellData, index) => {
//         const td = document.createElement("td");

//         if (typeof cellData === "number") {
//           const headerText = headers[index].toLowerCase();

//           if (headerText.includes("fecha") || headerText.includes("hora")) {
//             // Convertir número de Excel a fecha y hora
//             let excelDate = new Date((cellData - 25569) * 86400 * 1000);
//             // Ajustar la diferencia horaria si es necesario
//             let year = excelDate.getFullYear();
//             let month = String(excelDate.getMonth() + 1).padStart(2, '0');
//             let day = String(excelDate.getDate()).padStart(2, '0');
//             let hours = String(excelDate.getHours()).padStart(2, '0');
//             let minutes = String(excelDate.getMinutes()).padStart(2, '0');
//             let seconds = String(excelDate.getSeconds()).padStart(2, '0');

//             td.textContent = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//           } else {
//             td.textContent = cellData;
//           }
//         } else {
//           td.textContent = (cellData !== undefined && cellData !== null) ? cellData : "";
//         }

//         row.appendChild(td);
//       });

//       // Botón de eliminar
//       const tdEliminar = document.createElement("td");
//       const btnEliminar = document.createElement("button");
//       btnEliminar.innerHTML = `<span class="uil-trash-alt"></span>`;
//       btnEliminar.classList.add("btn", "btn-subtle-danger", "btn-sm", "me-1", "px-1", "py-0");

//       btnEliminar.onclick = function () {
//         if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
//           row.remove();

//           let indexToRemove = globalData.findIndex(item =>
//             Object.values(item).join("") === row.innerText.replace(/\s/g, "")
//           );

//           if (indexToRemove > -1) {
//             globalData.splice(indexToRemove, 1);
//           }
//         }
//       };

//       tdEliminar.appendChild(btnEliminar);
//       row.appendChild(tdEliminar);

//       tbody.appendChild(row);
//     });

//     previewTable.appendChild(tbody);

//     // Construir globalData
//     globalData = sheetData.slice(1).map(row => {
//       let obj = {};
//       headers.forEach((header, index) => {
//         let cellData = row[index] || "";

//         if (typeof cellData === "number") {
//           const headerText = header.toLowerCase();
//           if (headerText.includes("fecha") || headerText.includes("hora")) {
//             let excelDate = new Date((cellData - 25569) * 86400 * 1000);
//             let year = excelDate.getFullYear();
//             let month = String(excelDate.getMonth() + 1).padStart(2, '0');
//             let day = String(excelDate.getDate()).padStart(2, '0');
//             let hours = String(excelDate.getHours()).padStart(2, '0');
//             let minutes = String(excelDate.getMinutes()).padStart(2, '0');
//             let seconds = String(excelDate.getSeconds()).padStart(2, '0');

//             cellData = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//           }
//         }

//         obj[header] = cellData;
//       });
//       return obj;
//     });

//   };

//   reader.readAsArrayBuffer(file);
// }


// function leerExcel() {
//   const fileInput = document.getElementById('excelFile');
//   const file = fileInput.files[0];

//   if (!file) {
//     alert("Por favor selecciona un archivo de Excel primero.");
//     return;
//   }

//   const reader = new FileReader();

//   reader.onload = function (e) {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: 'array' });

//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//     if (sheetData.length === 0) {
//       alert("El archivo está vacío o no tiene datos.");
//       return;
//     }

//     const previewTable = document.getElementById("previewTable");
//     previewTable.innerHTML = "";

//     // Crear encabezados de la tabla
//     const thead = document.createElement("thead");
//     thead.style.fontSize = "10px";
//     thead.style.color = "#332D2D";

//     const headerRow = document.createElement("tr");
//     headerRow.classList.add("text-center");
//     const headers1 = sheetData[0].filter(header => header.trim() !== ""); // Filtra vacíos
//     headers1.forEach(headerText => {
//       const th = document.createElement("th");
//       th.textContent = headerText;
//       headerRow.appendChild(th);
//     });

//     // Agregar una columna adicional para el botón de eliminar
//     const thEliminar = document.createElement("th");
//     thEliminar.textContent = "Acciones";
//     headerRow.appendChild(thEliminar);

//     thead.appendChild(headerRow);
//     previewTable.appendChild(thead);

//     // Crear cuerpo de la tabla con las filas
//     const tbody = document.createElement("tbody");
//     tbody.style.fontSize = "10px";
//     tbody.style.textAlign = "center";

//     const headers = sheetData[0]; // Definir headers antes del bucle

//     sheetData.slice(1).forEach((rowData, rowIndex) => {
//       const row = document.createElement("tr");

//       rowData.forEach((cellData, index) => {
//         const td = document.createElement("td");

//         // // Convertir fechas en formato numérico a fecha legible
//         // if (typeof cellData === "number" && headers[index].toLowerCase().includes("fecha")) {
//         //   let date = new Date((cellData - 25569) * 86400 * 1000);
//         //   td.textContent = date.toISOString().split("T")[0];
//         // } else {
//         //   td.textContent = (cellData !== undefined && cellData !== null) ? cellData : "";
//         // }

//         if (typeof cellData === "number") {
//           if (headers[index].toLowerCase().includes("fecha")) {
//             // Convertir la fecha en formato numérico de Excel a formato legible
//             let date = new Date((cellData - 25569) * 86400 * 1000);
//             td.textContent = date.toISOString().split("T")[0];
//           } else if (headers[index].toLowerCase().includes("hora")) {
//             // Convertir la hora en decimal a HH:MM:SS
//             let totalSeconds = Math.round(cellData * 86400); // Convertir fracción de día a segundos
//             let hours = Math.floor(totalSeconds / 3600);
//             let minutes = Math.floor((totalSeconds % 3600) / 60);
//             let seconds = totalSeconds % 60;

//             // Formatear con ceros a la izquierda
//             let formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//             td.textContent = formattedTime;
//           } else {
//             td.textContent = cellData;
//           }
//         } else {
//           td.textContent = (cellData !== undefined && cellData !== null) ? cellData : "";
//         }



//         row.appendChild(td);
//       });
//       // Agregar botón de eliminar
//       const tdEliminar = document.createElement("td");
//       const btnEliminar = document.createElement("button");
//       // btnEliminar.textContent = "Eliminar";
//       btnEliminar.innerHTML = `<span class="uil-trash-alt"></span>`;
//       btnEliminar.classList.add("btn", "btn-subtle-danger", "btn-sm", "me-1", "px-1", "py-0");
//       // btnEliminar.onclick = function () {
//       //   if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
//       //     row.remove(); // Eliminar la fila del DOM
//       //     globalData.splice(rowIndex, 1); // Eliminar del array global
//       //   }
//       // };

//       btnEliminar.onclick = function () {
//         if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
//           row.remove(); // Eliminar del DOM

//           // Buscar el índice correcto en globalData
//           let indexToRemove = globalData.findIndex(item =>
//             Object.values(item).join("") === row.innerText.replace(/\s/g, "")
//           );

//           if (indexToRemove > -1) {
//             globalData.splice(indexToRemove, 1); // Eliminar del array global
//           }
//         }
//       };

//       tdEliminar.appendChild(btnEliminar);
//       row.appendChild(tdEliminar);

//       tbody.appendChild(row);
//     });

//     previewTable.appendChild(tbody);

//     // globalData = sheetData.slice(1).map(row => {
//     //   let obj = {};
//     //   headers.forEach((header, index) => {
//     //     let cellData = row[index] || "";

//     //     // Convertir fechas si el header contiene "fecha"
//     //     if (typeof cellData === "number" && header.toLowerCase().includes("fecha")) {
//     //       let date = new Date((cellData - 25569) * 86400 * 1000);
//     //       cellData = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
//     //     }

//     //     obj[header] = cellData;
//     //   });
//     //   return obj;
//     // });

//     globalData = sheetData.slice(1).map(row => {
//       let obj = {};
//       headers.forEach((header, index) => {
//         let cellData = row[index] || "";

//         if (typeof cellData === "number") {
//           if (header.toLowerCase().includes("fecha")) {
//             // Convertir fecha en formato Excel a YYYY-MM-DD
//             let date = new Date((cellData - 25569) * 86400 * 1000);
//             cellData = date.toISOString().split("T")[0];
//           } else if (header.toLowerCase().includes("hora")) {
//             // Convertir hora en decimal a HH:MM:SS
//             let totalSeconds = Math.round(cellData * 86400); // Convertir fracción de día a segundos
//             let hours = Math.floor(totalSeconds / 3600);
//             let minutes = Math.floor((totalSeconds % 3600) / 60);
//             let seconds = totalSeconds % 60;

//             // Formatear con ceros a la izquierda
//             cellData = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//           }
//         }

//         obj[header] = cellData;
//       });
//       return obj;
//     });


//   };

//   reader.readAsArrayBuffer(file);
// }

function leerExcel() {
  const fileInput = document.getElementById('excelFile');
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor selecciona un archivo de Excel primero.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (sheetData.length === 0) {
      alert("El archivo está vacío o no tiene datos.");
      return;
    }

    const previewTable = document.getElementById("previewTable");
    previewTable.innerHTML = "";

    const thead = document.createElement("thead");
    thead.style.fontSize = "10px";
    thead.style.color = "#332D2D";

    const headerRow = document.createElement("tr");
    headerRow.classList.add("text-center");

    const headers = sheetData[0].filter(header => header.trim() !== "");
    headers.forEach(headerText => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    const thEliminar = document.createElement("th");
    thEliminar.textContent = "Acciones";
    headerRow.appendChild(thEliminar);

    thead.appendChild(headerRow);
    previewTable.appendChild(thead);

    const tbody = document.createElement("tbody");
    tbody.style.fontSize = "10px";
    tbody.style.textAlign = "center";

    const filasUtiles = sheetData.slice(1).filter(row => {
      return row.some(cell => cell !== undefined && cell !== null && String(cell).trim() !== "");
    });

    // Construimos un array temporal
    globalData = filasUtiles.map((rowData, rowIndex) => {
      const obj = {};
      const tr = document.createElement("tr");

      headers.forEach((header, index) => {
        const td = document.createElement("td");
        let cellData = rowData[index] || "";

        if (typeof cellData === "number") {
          const headerText = header.toLowerCase();
          if (headerText.includes("fecha")) {
            // let excelDate = new Date((cellData - 25569) * 86400 * 1000);
            // let year = excelDate.getFullYear();
            // let month = String(excelDate.getMonth() + 1).padStart(2, '0');
            // let day = String(excelDate.getDate()).padStart(2, '0');
            // cellData = `${year}-${month}-${day}`; // Solo FECHA

            let excelDate = new Date(Math.round((cellData - 25569) * 86400 * 1000));

            // Ajuste por desfase horario (convierte a UTC primero)
            let year = excelDate.getUTCFullYear();
            let month = String(excelDate.getUTCMonth() + 1).padStart(2, '0');
            let day = String(excelDate.getUTCDate()).padStart(2, '0');

            cellData = `${year}-${month}-${day}`; // Solo FECHA
          } else if (headerText.includes("hora")) {
            // let excelDate = new Date((cellData - 25569) * 86400 * 1000);
            // let hours = String(excelDate.getHours()).padStart(2, '0');
            // let minutes = String(excelDate.getMinutes()).padStart(2, '0');
            // let seconds = String(excelDate.getSeconds()).padStart(2, '0');
            // cellData = `${hours}:${minutes}:${seconds}`; // Solo HORA
            // Si es hora
            const totalSeconds = Math.round(cellData * 24 * 60 * 60);
            const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
            const seconds = String(totalSeconds % 60).padStart(2, '0');
            cellData = `${hours}:${minutes}:${seconds}`;
          }
        }

        obj[header] = cellData;
        td.textContent = cellData;
        tr.appendChild(td);
      });

      // Botón de eliminar
      const tdEliminar = document.createElement("td");
      const btnEliminar = document.createElement("button");
      btnEliminar.innerHTML = `<span class="uil-trash-alt"></span>`;
      btnEliminar.classList.add("btn", "btn-subtle-danger", "btn-sm", "me-1", "px-1", "py-0");

      btnEliminar.onclick = function () {
        if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
          // Elimina del DOM
          tr.remove();

          // Elimina del array
          globalData.splice(rowIndex, 1);
        }
      };

      tdEliminar.appendChild(btnEliminar);
      tr.appendChild(tdEliminar);

      tbody.appendChild(tr);

      return obj;
    });

    previewTable.appendChild(tbody);

  };

  reader.readAsArrayBuffer(file);
}

// function leerExcelPeido() {
//   const fileInput = document.getElementById('excelFilePedidos');
//   const file = fileInput.files[0];

//   if (!file) {
//     alert("Por favor selecciona un archivo de Excel primero.");
//     return;
//   }

//   const reader = new FileReader();

//   reader.onload = function (e) {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: 'array' });

//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//     if (sheetData.length === 0) {
//       alert("El archivo está vacío o no tiene datos.");
//       return;
//     }

//     const previewTable = document.getElementById("previewTablePedidos");
//     previewTable.innerHTML = "";

//     const thead = document.createElement("thead");
//     thead.style.fontSize = "10px";
//     thead.style.color = "#332D2D";

//     const headerRow = document.createElement("tr");
//     headerRow.classList.add("text-center");

//     const headers = sheetData[0].filter(header => header.trim() !== "");
//     headers.forEach(headerText => {
//       const th = document.createElement("th");
//       th.textContent = headerText;
//       headerRow.appendChild(th);
//     });

//     const thEliminar = document.createElement("th");
//     thEliminar.textContent = "Acciones";
//     headerRow.appendChild(thEliminar);

//     thead.appendChild(headerRow);
//     previewTable.appendChild(thead);

//     const tbody = document.createElement("tbody");
//     tbody.style.fontSize = "10px";
//     tbody.style.textAlign = "center";

//     sheetData.slice(1).forEach((rowData) => {
//       const row = document.createElement("tr");

//       rowData.forEach((cellData, index) => {
//         const td = document.createElement("td");
//         const headerText = headers[index]?.toLowerCase() || "";

//         if (typeof cellData === "number") {
//           if (headerText.includes("fecha")) {
//             td.textContent = convertirExcelFecha(cellData);
//           } else if (headerText.includes("hora")) {
//             td.textContent = convertirExcelHora(cellData);
//           } else {
//             td.textContent = cellData;
//           }
//         } else {
//           td.textContent = (cellData !== undefined && cellData !== null) ? cellData : "";
//         }

//         row.appendChild(td);
//       });

//       // Botón eliminar
//       const tdEliminar = document.createElement("td");
//       const btnEliminar = document.createElement("button");
//       btnEliminar.innerHTML = `<span class="uil-trash-alt"></span>`;
//       btnEliminar.classList.add("btn", "btn-subtle-danger", "btn-sm", "me-1", "px-1", "py-0");

//       btnEliminar.onclick = function () {
//         if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
//           row.remove();
//           let indexToRemove = globalData.findIndex(item =>
//             Object.values(item).join("") === row.innerText.replace(/\s/g, "")
//           );
//           if (indexToRemove > -1) {
//             globalData.splice(indexToRemove, 1);
//           }
//         }
//       };

//       tdEliminar.appendChild(btnEliminar);
//       row.appendChild(tdEliminar);
//       tbody.appendChild(row);
//     });

//     previewTable.appendChild(tbody);

//     // Formatear también globalData
//     globalData = sheetData.slice(1).map(row => {
//       let obj = {};
//       headers.forEach((header, index) => {
//         let cellData = row[index] || "";
//         const headerText = header.toLowerCase();

//         if (typeof cellData === "number") {
//           if (headerText.includes("fecha")) {
//             cellData = convertirExcelFecha(cellData);
//           } else if (headerText.includes("hora")) {
//             cellData = convertirExcelHora(cellData);
//           }
//         }

//         obj[header] = cellData;
//       });
//       return obj;
//     });

//   };

//   reader.readAsArrayBuffer(file);
// }

// // Función para convertir FECHAS de Excel a YYYY-MM-DD
// function convertirExcelFecha(cellData) {
//   const excelDate = new Date(Math.round((cellData - 25569) * 86400 * 1000));
//   excelDate.setDate(excelDate.getDate() + 1);
//   const year = excelDate.getFullYear();
//   const month = String(excelDate.getMonth() + 1).padStart(2, '0');
//   const day = String(excelDate.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// }

// // Función para convertir HORAS de Excel a HH:mm:ss en 24 horas
// function convertirExcelHora(cellData) {
//   let totalSeconds = Math.round((cellData % 1) * 24 * 60 * 60);
//   let hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
//   let minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
//   let seconds = String(totalSeconds % 60).padStart(2, '0');
//   return `${hours}:${minutes}:${seconds}`;
// }

function leerExcelPeido() {
  const fileInput = document.getElementById('excelFilePedidos');
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor selecciona un archivo de Excel primero.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (sheetData.length === 0) {
      alert("El archivo está vacío o no tiene datos.");
      return;
    }

    const previewTable = document.getElementById("previewTablePedidos");
    previewTable.innerHTML = "";

    const thead = document.createElement("thead");
    thead.style.fontSize = "10px";
    thead.style.color = "#332D2D";

    const headerRow = document.createElement("tr");
    headerRow.classList.add("text-center");

    const headers = sheetData[0].filter(header => header.trim() !== "");
    headers.forEach(headerText => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    const thEliminar = document.createElement("th");
    thEliminar.textContent = "Acciones";
    headerRow.appendChild(thEliminar);

    thead.appendChild(headerRow);
    previewTable.appendChild(thead);

    const tbody = document.createElement("tbody");
    tbody.style.fontSize = "10px";
    tbody.style.textAlign = "center";

    const filasUtiles = sheetData.slice(1).filter(row => {
      return row.some(cell => cell !== undefined && cell !== null && String(cell).trim() !== "");
    });

    // Construimos un array temporal
    globalData = filasUtiles.map((rowData, rowIndex) => {
      const obj = {};
      const tr = document.createElement("tr");

      headers.forEach((header, index) => {
        const td = document.createElement("td");
        let cellData = rowData[index] || "";

        if (typeof cellData === "number") {
          const headerText = header.toLowerCase();
          if (headerText.includes("fecha")) {
            // Solo FECHA
            let excelDate = new Date(Math.round((cellData - 25569) * 86400 * 1000));

            // Ajuste por desfase horario (convierte a UTC primero)
            let year = excelDate.getUTCFullYear();
            let month = String(excelDate.getUTCMonth() + 1).padStart(2, '0');
            let day = String(excelDate.getUTCDate()).padStart(2, '0');

            cellData = `${year}-${month}-${day}`;
          } else if (headerText.includes("hora")) {
            // Si es hora
            const totalSeconds = Math.round(cellData * 24 * 60 * 60);
            const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
            const seconds = String(totalSeconds % 60).padStart(2, '0');
            cellData = `${hours}:${minutes}:${seconds}`;
          }
        }

        obj[header] = cellData;
        td.textContent = cellData;
        tr.appendChild(td);
      });

      // Botón de eliminar
      const tdEliminar = document.createElement("td");
      const btnEliminar = document.createElement("button");
      btnEliminar.innerHTML = `<span class="uil-trash-alt"></span>`;
      btnEliminar.classList.add("btn", "btn-subtle-danger", "btn-sm", "me-1", "px-1", "py-0");

      btnEliminar.onclick = function () {
        if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
          // Elimina del DOM
          tr.remove();

          // Elimina del array
          globalData.splice(rowIndex, 1);
        }
      };

      tdEliminar.appendChild(btnEliminar);
      tr.appendChild(tdEliminar);

      tbody.appendChild(tr);

      return obj;
    });

    previewTable.appendChild(tbody);

  };

  reader.readAsArrayBuffer(file);
}


async function Listar_servicios_especiales_proveedor(ProveedorId, MaestroId, index) {
  let formData = new FormData();
  formData.append('ProveedorId', ProveedorId);
  formData.append('MaestroId', MaestroId);

  try {
    let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_especiales_recursos_proveedor', {
      method: "POST",
      body: formData
    });

    let data = await response.json();
    let servicios = "";

    if (data && data.length > 0) {
      servicios = `
        <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="tab-${ProveedorId}" role="tabpanel" aria-labelledby="${ProveedorId}-tab">
          <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle table-sm" style="font-size: 12px;">
              <thead class="table-light">
                <tr>
                  <th>Tipo servicio</th>
                  <th>Estado</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                ${data.map(element => `
                  <tr>
                    <td>${element.nombre}</td>
                    <td>
                     <span class="badge badge-phoenix fs-10 badge-phoenix${element.estado_servicio_especial === 'Aprobado' ? '-success' : element.estado_servicio_especial === 'Cancelado' ? '-danger' : '-secondary'}"><span class="badge-label">${element.estado_servicio_especial}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span>
                      </span>
                   
                    </td>
                     ${element.estado_servicio_especial === 'Aprobado' ? `<td> $${element.valor_servicio.toLocaleString()}</td>` : `     
                      <td class="editable-value" 
                          data-servicio-id="${element.servicio_especial}"
                          data-proveedor-id="${element.proveedor_id}"
                          data-original-value="${element.valor_servicio}"
                          data-maestro-id="${MaestroId}">
                        $${element.valor_servicio.toLocaleString()}
                      </td>`}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else {
      servicios = `
        <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="tab-${ProveedorId}" role="tabpanel" aria-labelledby="${ProveedorId}-tab">
          <div class="alert alert-info text-center py-4">
            <i class="bi bi-info-circle-fill fs-3 mb-3"></i>
            <h5 class="alert-heading">No hay servicios registrados</h5>
          </div>
        </div>
      `;
    }

    // Inicializar eventos después de renderizar
    setTimeout(initEditableValues, 100);

    return servicios;
  } catch (error) {
    console.error('Error:', error);
    return `
      <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="tab-${ProveedorId}" role="tabpanel" aria-labelledby="${ProveedorId}-tab">
        <div class="alert alert-danger text-center py-4">
          <i class="bi bi-exclamation-triangle-fill fs-3 mb-3"></i>
          <h5 class="alert-heading">Error al cargar los servicios</h5>
          <p class="mb-0">Por favor intente nuevamente</p>
        </div>
      </div>
    `;
  }
}

function initEditableValues() {
  document.querySelectorAll('.editable-value').forEach(cell => {
    cell.addEventListener('click', function (e) {
      if (this.querySelector('input')) return; // Ya está en modo edición

      const originalValue = this.getAttribute('data-original-value');
      const servicioId = this.getAttribute('data-servicio-id');
      const proveedorId = this.getAttribute('data-proveedor-id');
      const maestroId = this.getAttribute('data-maestro-id');

      this.innerHTML = `
        <div class="d-flex align-items-center">
          <input type="number" class="form-control form-control-sm" value="${originalValue}" style="width: 40%;"> 
       
          <button class="btn btn-subtle-danger btn-sm me-1 px-1 py-0 cancel-btn" id="id_rechazar_se" data-RecursoId=${maestroId} data-ServicioId=${servicioId} data-ProveedorId=${proveedorId}>
            <span class="uil uil-cancel"></span> Rechazar
          </button>
        </div>
      `;
      // <button class="btn btn-subtle-success btn-sm me-1 px-1 py-0 save-btn" 
      //   <span class="uil uil-save"></span> Guardar
      // </button>
      const input = this.querySelector('input');
      input.focus();
      input.select();

      // Guardar con Enter
      input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          saveValue(this, originalValue, servicioId, proveedorId, maestroId, cell);
        }
      });

      // Botón Guardar
      this.querySelector('.save-btn').addEventListener('click', function () {
        saveValue(input, originalValue, servicioId, proveedorId, maestroId, cell);
      });

      // Botón Cancelar
      this.querySelector('.cancel-btn').addEventListener('click', function () {
        cell.innerHTML = `$${parseFloat(originalValue).toLocaleString()}`;
      });
    });
  });
}

async function saveValue(input, originalValue, servicioId, proveedorId, maestroId, cell) {
  const newValue = input.value;

  if (parseFloat(newValue) === parseFloat(originalValue)) {
    cell.innerHTML = `$${parseFloat(originalValue).toLocaleString()}`;
    return;
  }

  if (!newValue || isNaN(newValue)) {
    showToast('error', 'Error', 'Ingrese un valor numérico válido');
    return;
  }

  try {
    cell.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

    const formData = new FormData();
    formData.append('servicio_id', servicioId);
    formData.append('proveedor_id', proveedorId);
    formData.append('valor', newValue);
    formData.append('maestro_id', maestroId);

    const response = await fetch($('#base_url').val() + 'torrecontrol/actualizar_valor_servicio', {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.success === true) {
      cell.innerHTML = `$${parseFloat(newValue).toLocaleString()}`;
      cell.setAttribute('data-original-value', newValue);
      showToast('success', 'Éxito', 'Valor actualizado correctamente');
    } else {
      throw new Error(result.message || 'Error al actualizar');
    }
  } catch (error) {
    console.error('Error:', error);
    cell.innerHTML = `$${parseFloat(originalValue).toLocaleString()}`;
    showToast('error', 'Error', 'No se pudo actualizar el valor');
  }
}

function showToast(type, title, message) {
  // Implementación básica de toast notification
  const toastHtml = `
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1100">
      <div class="toast show align-items-center text-white bg-${type}" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <strong>${title}</strong>: ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  `;

  const toastContainer = document.createElement('div');
  toastContainer.innerHTML = toastHtml;
  document.body.appendChild(toastContainer);

  setTimeout(() => {
    toastContainer.remove();
  }, 3000);
}