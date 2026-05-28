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
    if (e.target.matches("#btn_detalle_proceso_servicio") || e.target.matches("#btn_detalle_proceso_servicio *")) {
      let Enlace = e.target.closest("#btn_detalle_proceso_servicio");
      let MaestroId = Enlace.getAttribute("data-id");
      let ClienteId = Enlace.getAttribute("data-id2");
      let Proceso = Enlace.getAttribute("data-proceso");
      let proveedor_id = document.getElementById("proveedor_id").value;
      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Detalle de solicitud de servicio N°` + MaestroId);
      myOffcanvas.updateContent(`
          <div class="col-12">
            <div class="row">
              <div class="container d-flex justify-content-center align-items-center">
                <div class="row text-black fw-bold text-center d-flex flex-wrap">
                  <div class="col-auto mx-3">Peso Neto total: <span  class="badge badge-phoenix badge-phoenix-primary" id="pesoNeto">0</span></div>
                  <div class="col-auto mx-3">Peso Bruto total: <span class="badge badge-phoenix badge-phoenix-primary" id="pesoBruto">0</span></div>
                  <div class="col-auto mx-3">Total Unidades: <span   class="badge badge-phoenix badge-phoenix-primary" id="totalUnidades">0</span></div>
                </div>
              </div>
              <hr class="my-1 text-dark">
               <h6 class="mb-0 text-body-highlight me-2">Pedidos</h6>
              <hr class="my-1 text-dark">
              <div class="table-responsive scrollbar">
                <table class="table table-sm text-center" style="font-size: 11px;">
                  <thead>
                    <tr>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>#</th>
                      <!--<th scope="col" style='color:black;width: auto; white-space: nowrap;'>Recurso</th>-->
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Ref.Pedido</th>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Cod.Producto</th>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Producto</th>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Peso Bruto</th>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Empaque</th>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Cantidad</th>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Origen</th>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Destino</th>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Fecha Cargue</th>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Fecha Descargue</th>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Estado</th>
                    </tr>
                  </thead>
                  <tbody id="tbody_servicios_pedidos_recurso" class="text-center">
                    <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
                  </tbody>
                </table>
              </div>
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
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Proveedor</th>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Servicio</th>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Vehiculo</th>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Fecha Registro</th>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Fecha Limite</th>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Estado</th>
                      <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Acciones</th>
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
                        <th scope="col" style='color:black;width: auto; white-space: nowrap;'>#</th>
                        <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Valor Propuesto</th>
                        <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Fecha Inicio</th>
                        <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Cedula conductor</th>
                        <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Nombre conductor</th>
                        <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Placa</th>
                      </tr>
                    </thead>
                    <tbody id="tbody_propuestos_proveedor" class="text-center">
                      <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
                    </tbody>
                  </table>
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

      Listar_pedidos_recursos(MaestroId, proveedor_id, Proceso);

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
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.razon_social}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.tipo_servicio}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.vehiculo}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.Fecha_registro}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.fecha_limite}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${col_estatus_publicacion}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>
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


  });

  // Evento para mostrar/ocultar proveedores con el checkbox y hacer la petición AJAX
  document.addEventListener("change", async (e) => {
    if (e.target.matches("input[name='ProveedorServiciodetalle']")) {
      let ServicioId = e.target.value;
      let proveedorId = e.target.getAttribute("data-proveedorId");
      let TipoServicio = e.target.getAttribute("data-TipoServicio");
      let PedidosId = e.target.getAttribute("data-pedidosId");
      let RecursoId = e.target.getAttribute("data-recursoId");

      let filaServicios = document.getElementById(`detalle_recurso_proveedores_asignados_${ServicioId}`);
      // Mostrar u ocultar la fila de servicios
      if (filaServicios.style.display === "none") {
        filaServicios.style.display = "table-row";
        // Obtener servicios si aún no se han cargado
        if (filaServicios.querySelector(".lista-detalle-accion-proveedores").innerHTML.trim() === "") {
          filaServicios.querySelector(".lista-detalle-accion-proveedores").innerHTML = `
            <div class="container-fluid pt-3">
              <!-- <div class="d-flex justify-content-center"> -->
              <div class="row">

                <div id="despachos" style="display: none;">
                  <div class="row">
                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                      <div class="mb-3">
                        <label style="font-size: 12px;">Placa</label>
                        <input type="text" id="placa" name="placa" class="form-control form-control-sm" placeholder="Placa" oninput="this.value = this.value.toUpperCase();">
                      </div>
                    </div>
                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                      <div class="mb-3">
                        <label style="font-size: 12px;">Cedula</label>
                        <input type="text" id="cedula_conductor" name="cedula_conductor" class="form-control form-control-sm" placeholder="Cedula" oninput="this.value = this.value.toUpperCase();">
                      </div>
                    </div>
                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                      <div class="mb-3">
                        <label style="font-size: 12px;">Nombre</label>
                        <input type="text" id="nombre_conductor" name="nombre_conductor" class="form-control form-control-sm" placeholder="Nombre" oninput="this.value = this.value.toUpperCase();">
                      </div>
                    </div>
                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                      <div class="mb-3">
                        <label style="font-size: 12px;">Flete</label>
                        <input type="text" id="flete" name="flete" class="form-control form-control-sm" placeholder="Flete">
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
            </div>
          `;

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

      data.forEach(element => {
        const fila = document.createElement('tr');

        if (element.estado_recurso === 'Pendiente Iniciar') {
          esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${element.estado_recurso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_recurso === 'Iniciado') {
          esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_recurso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_recurso === 'Completado') {
          esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado_recurso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_recurso === 'Cancelado') {
          esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.estado_recurso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_recurso === 'Rechazado') {
          esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${element.estado_recurso}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        }

        const columnaNundocSolicitud = document.createElement('td');
        columnaNundocSolicitud.innerHTML = `
        <div class="dropdown">
          <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.referencias_pedido}</a>
          <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
            <a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>
          </div>
        </div>
        `;

        const columnaCliente = document.createElement('td');
        columnaCliente.innerHTML = element.nombre;
        columnaCliente.style.width = 'auto';
        columnaCliente.style.whiteSpace = 'nowrap';

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

async function Listar_pedidos_recursos(MaestroId, proveedor_id, Proceso) {
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
      data.forEach((servicio, index) => {
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
        } else if (servicio.estado_proceso_pedido === 'Iniciado') {
          col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (servicio.estado_proceso_pedido === 'Cancelado') {
          col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_publicacion = `<a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido" data-id="${servicio.numdoc_solicitud}" data-id2="${servicio.cliente}"><span class="uil uil-feedback"></span> Publicar Pedido</a>`;
        } else if (servicio.estado_proceso_pedido === 'Completado') {
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (servicio.estado_proceso_pedido === 'Rechazado') {
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado_proceso_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        }

        rows += `
            <tr>
              <th scope="row">${servicio.numdoc_solicitud}</th>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.referencia_pedido}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.cod_producto}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.producto}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.peso_bruto_kg}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.presentacion}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.unidades}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.ciudad_origen}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.ciudad_destino}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.fecha_cargar}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.fecha_entregar}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${col_estatus_publicacion}</td>
            </tr>
            <tr id="Recurso_proveedores_${servicio.numdoc_solicitud}" style="display: none;">
              <td colspan="12">
                <div class="lista-proceso-proveedores"></div>
              </td>
            </tr>
          `;
      });

      if (data.every(servicio => servicio.estado_proceso_pedido === 'Iniciado') || data.every(servicio => servicio.estado_proceso_pedido === 'Completado')) {
        Listar_servicios(MaestroId, Proceso, miArray, proveedor_id);
        document.getElementById("btn_iniciar_recurso").style.display = "none";
      }

      /* Colcoar Array de las solicitudes de servicio para inicar proceso */
      document.getElementById("btn_iniciar_recurso").setAttribute("data-SolicitudesId", JSON.stringify(miArray));

      document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = rows;
    } else {
      document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
    }
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
  }
}

async function Listar_servicios(RecursoId, proceso, SolicitudesId, proveedor_id) {
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
            <input class="form-check-input me-2" type="checkbox" name="ProveedorServiciodetalle" data-proveedorId="${servicio.proveedorId}" data-TipoServicio="${servicio.tipo_servicio}" data-pedidosId="${SolicitudesId}" data-recursoId="${RecursoId}" id="servicio_${servicio.servicioId}" value="${servicio.servicioId}">
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
            <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.razon_social}</td>
            <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.tipo_servicio}</td>
            <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.vehiculo}</td>
            <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.Fecha_registro}</td>
            <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.fecha_limite}</td>
            <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${col_estatus_publicacion}</td>
            <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>
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
          <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.Valor_Servicio}</td>
          <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.Fecha_Inicio}</td>
          <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.cedula_conductor}</td>
          <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.nombre_conductor}</td>
          <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${(servicio.Placa) ? servicio.Placa : 'No Aplica'}</td>
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

function DynamicOffcanvas(options) {
  // Configuración predeterminada
  var defaults = {
    id: 'dynamicOffcanvas',
    title: 'Default Title',
    content: 'Default Content',
    scroll: true,
    backdrop: false
  };

  // Fusionar opciones con defaults
  this.settings = Object.assign({}, defaults, options);

  // Inicializar
  this.initialize();
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

DynamicOffcanvas.prototype.initialize = function () {
  this.createOffcanvas();
  this.bsOffcanvas = new bootstrap.Offcanvas(this.offcanvasElement);
};

DynamicOffcanvas.prototype.createOffcanvas = function () {
  var offcanvasHTML = `
    <div class="offcanvas offcanvas-end" 
        id="${this.settings.id}" 
        data-bs-scroll="${this.settings.scroll}" 
        data-bs-backdrop="${this.settings.backdrop}" 
        tabindex="-1" 
        aria-labelledby="${this.settings.id}-label" style="width: 900px;">
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

DynamicOffcanvas.prototype.show = function () {
  this.bsOffcanvas.show();
};

DynamicOffcanvas.prototype.hide = function () {
  this.bsOffcanvas.hide();
};

if (!window.globalData) {
  window.globalData = [];
} else {
  console.log('El offcanvas ya está creado.');
}

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

    // Crear encabezados de la tabla
    const thead = document.createElement("thead");
    thead.style.fontSize = "10px";
    thead.style.color = "#332D2D";

    const headerRow = document.createElement("tr");
    headerRow.classList.add("text-center");
    const headers1 = sheetData[0].filter(header => header.trim() !== ""); // Filtra vacíos
    headers1.forEach(headerText => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    // Agregar una columna adicional para el botón de eliminar
    const thEliminar = document.createElement("th");
    thEliminar.textContent = "ACCIONES";
    headerRow.appendChild(thEliminar);

    thead.appendChild(headerRow);
    previewTable.appendChild(thead);

    // Crear cuerpo de la tabla con las filas
    const tbody = document.createElement("tbody");
    tbody.style.fontSize = "10px";
    tbody.style.textAlign = "center";

    const headers = sheetData[0]; // Definir headers antes del bucle

    sheetData.slice(1).forEach((rowData, rowIndex) => {
      const row = document.createElement("tr");

      rowData.forEach((cellData, index) => {
        const td = document.createElement("td");

        // Convertir fechas en formato numérico a fecha legible
        if (typeof cellData === "number" && headers[index].toLowerCase().includes("fecha")) {
          let date = new Date((cellData - 25569) * 86400 * 1000);
          td.textContent = date.toISOString().split("T")[0];
        } else {
          td.textContent = (cellData !== undefined && cellData !== null) ? cellData : "";
        }

        row.appendChild(td);
      });
      // Agregar botón de eliminar
      const tdEliminar = document.createElement("td");
      const btnEliminar = document.createElement("button");
      // btnEliminar.textContent = "Eliminar";
      btnEliminar.innerHTML = `<span class="uil-trash-alt"></span>`;
      btnEliminar.classList.add("btn", "btn-subtle-danger", "btn-sm", "me-1", "px-1", "py-0");
      // btnEliminar.onclick = function () {
      //   if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
      //     row.remove(); // Eliminar la fila del DOM
      //     globalData.splice(rowIndex, 1); // Eliminar del array global
      //   }
      // };

      btnEliminar.onclick = function () {
        if (confirm("¿Estás seguro de que quieres eliminar esta fila?")) {
          row.remove(); // Eliminar del DOM

          // Buscar el índice correcto en globalData
          let indexToRemove = globalData.findIndex(item =>
            Object.values(item).join("") === row.innerText.replace(/\s/g, "")
          );

          if (indexToRemove > -1) {
            globalData.splice(indexToRemove, 1); // Eliminar del array global
          }
        }
      };

      tdEliminar.appendChild(btnEliminar);
      row.appendChild(tdEliminar);

      tbody.appendChild(row);
    });

    previewTable.appendChild(tbody);

    globalData = sheetData.slice(1).map(row => {
      let obj = {};
      headers.forEach((header, index) => {
        let cellData = row[index] || "";

        // Convertir fechas si el header contiene "fecha"
        if (typeof cellData === "number" && header.toLowerCase().includes("fecha")) {
          let date = new Date((cellData - 25569) * 86400 * 1000);
          cellData = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
        }

        obj[header] = cellData;
      });
      return obj;
    });

  };

  reader.readAsArrayBuffer(file);
}