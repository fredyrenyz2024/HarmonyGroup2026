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

  listar_pedidos_prioritarios(fechaColombia, fechaColombia);

  document.addEventListener("click", async (e) => {
    if (e.target.matches("#btn_asignar_proveedor") || e.target.matches("#btn_asignar_proveedor *")) {
      let enlace = e.target.closest("#btn_asignar_proveedor");
      let dataId = enlace.getAttribute("data-id");
      let dataId2 = enlace.getAttribute("data-id2");

      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Asignar proveedor solicitud de servicio`);

      // Mostrar un indicador de carga mientras se obtienen los datos
      myOffcanvas.updateContent(`
        <div class="col-12">
          <div class="row">
            <table class="table table-sm" style="font-size: 12px;">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Proveedor</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody id="tbody_proveedor_torre_control">
                <tr><td colspan="4" class="text-center">Cargando proveedores...</td></tr>
              </tbody>
            </table>

            <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
              <div class="mb-3">
                <label class="control-label">(*) Fecha Vencimiento:</label>
                <input type="date" class="form-control form-control-sm" id="fecha_vencimiento" name="fecha_vencimiento">
              </div>
            </div>

            <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
              <div class="mb-3">
                <label class="control-label">(*) Hora Vencimiento:</label>
                <input type="time" class="form-control form-control-sm" id="hora_vencimiento" name="hora_vencimiento">
              </div>
            </div>

            <div class="col-12 gy-6 my-3">
              <div class="row g-3 justify-content-end">
                <div class="col-auto">
                  <button class="btn btn-phoenix-primary btn-sm text-danger" type="button" id="btn-cancelar">
                    <span class="text-danger" data-feather="x"></span> Cancelar
                  </button>
                </div>

                <div class="col-auto">
                  <button class="btn btn-primary btn-sm" id="btn_asignacion_proveedor" type="button" data-numdoc_solicitud="${dataId}">
                    <span class="uil uil-save"></span> Guardar Asignación
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      `);

      try {
        let formData = new FormData();
        formData.append("dataId2", dataId2);

        let response = await fetch($('#base_url').val() + 'torrecontrol/listar_proveedores_cliente', {
          method: "POST",
          body: formData
        });

        let data = await response.json();
        if (data) {
          let rows = "";
          data.forEach((proveedor, index) => {
            rows += `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${proveedor.razon_social}</td>
                  <td>${proveedor.estado_proveedor}</td>
                  <td>
                    <div class="btn-group btn-group-sm" role="group" aria-label="...">
                      <button class="btn btn-subtle-warning btn-sm me-1 px-1 py-0 asignar-proveedor" id="btn_listar_servicios" data-id="${proveedor.id}" type="button">
                        Servicios
                      </button>
                    </div>
                  </td>
                </tr>
                <tr id="servicios_${proveedor.id}" style="display: none;">
                  <td colspan="4">
                    <div class="lista-servicios"></div>
                  </td>
                </tr>
              `;
          });

          document.getElementById("tbody_proveedor_torre_control").innerHTML = rows;
        } else {
          document.getElementById("tbody_proveedor_torre_control").innerHTML = `<tr><td colspan="4" class="text-center text-danger">${data.message}</td></tr>`;
        }
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        document.getElementById("tbody_proveedor_torre_control").innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar proveedores</td></tr>`;
      }

      myOffcanvas.show();
    }

    // 🚀 Evento para listar servicios cuando se haga clic en "Servicios"
    if (e.target.matches("#btn_listar_servicios") || e.target.matches("#btn_listar_servicios *")) {
      let enlace = e.target.closest("#btn_listar_servicios");
      let proveedorId = enlace.getAttribute("data-id");
      let filaServicios = document.getElementById(`servicios_${proveedorId}`);

      // Mostrar u ocultar la fila de servicios
      if (filaServicios.style.display === "none") {
        filaServicios.style.display = "table-row";

        // Obtener servicios si aún no se han cargado
        if (filaServicios.querySelector(".lista-servicios").innerHTML.trim() === "") {
          try {
            let formData = new FormData();
            formData.append("proveedor_id", proveedorId);

            let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_proveedor', {
              method: "POST",
              body: formData
            });

            let data = await response.json();

            if (data) {
              let serviciosHTML = '<ul class="list-group">';
              data.forEach((servicio) => {
                serviciosHTML += `
                  <li class="list-group-item d-flex align-items-center p-1">
                    <!--<i class="uil uil-folder text-warning me-2"></i>-->
                    <div class="form-check form-switch">
                      <input class="form-check-input me-2" type="checkbox" name="servicioProveedor" id="servicio_${servicio.id}" value="${servicio.id}" data-idProveedor="${proveedorId}">
                      <label for="servicio_${servicio.id}" class="flex-grow-1">${servicio.tipo_servicio}</label>
                    </div>
                  </li>
                `;
              });
              serviciosHTML += '</ul>';

              filaServicios.querySelector(".lista-servicios").innerHTML = serviciosHTML;
            } else {
              filaServicios.querySelector(".lista-servicios").innerHTML = `<p class="text-danger">${data.message}</p>`;
            }
          } catch (error) {
            console.error("Error al obtener servicios:", error);
            filaServicios.querySelector(".lista-servicios").innerHTML = `<p class="text-danger">Error al cargar servicios</p>`;
          }
        }
      } else {
        filaServicios.style.display = "none";
      }
    }

    if (e.target.matches("#btn_asignacion_proveedor") || e.target.matches("#btn_asignacion_proveedor *")) {
      let enlace = e.target.closest("#btn_asignacion_proveedor");
      let numdocSolicitud = enlace.getAttribute("data-numdoc_solicitud");

      let asignaciones = [];

      document.querySelectorAll('input[name="servicioProveedor"]:checked').forEach((checkbox) => {
        let servicioId = checkbox.value;
        let proveedorId = checkbox.getAttribute("data-idProveedor");

        asignaciones.push({
          servicio_id: servicioId,
          proveedor_id: proveedorId
        });
      });

      if (asignaciones.length === 0) {
        alert("Debe seleccionar al menos un servicio y un proveedor.");
        return;
      }

      const result = await Swal.fire({
        title: "Seguro",
        text: "¿Desea guardar asignacion del proveedor?",
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
        const btn = document.querySelector("#btn_asignacion_proveedor");

        btn.disabled = true;
        btn.innerHTML = "Asignando Proveedor... ⏳";

        let formData = new FormData();
        formData.append("numdocSolicitud", numdocSolicitud);
        formData.append("asignaciones", JSON.stringify(asignaciones));
        formData.append("fecha_vencimiento", document.getElementById("fecha_vencimiento").value);
        formData.append("hora_vencimiento", document.getElementById("hora_vencimiento").value);

        try {
          const response = await fetch($('#base_url').val() + 'torrecontrol/insertar_asignacion', {
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
              myOffcanvas.hide();
              listar_pedidos_prioritarios(fechaColombia, fechaColombia);
            }
          });

        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Error al enviar datos al servidor.", "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = "<span class='uil uil-save'></span> Guardar Asignación";
        }
      }
    }

    if (e.target.matches("#btn_publicar_pedido") || e.target.matches("#btn_publicar_pedido *")) {
      let enlace = e.target.closest("#btn_publicar_pedido");
      let dataId = enlace.getAttribute("data-id");
      let dataId2 = enlace.getAttribute("data-id2");

      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Publicar Pedido ${dataId}`);

      // Mostrar un indicador de carga mientras se obtienen los datos
      myOffcanvas.updateContent(`
        <div class="col-12">
          <div class="row">
            <table class="table table-sm" style="font-size: 12px;">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Servicio</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acción</th>
                  <th scope="col">Seleccionar</th>
                </tr>
              </thead>
              <tbody id="tbody_servicio_torre_control">
                <tr><td colspan="4" class="text-center">Cargando servicios...</td></tr>
              </tbody>
            </table>

            <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
              <div class="mb-3">
                <label class="control-label">(*) Fecha Vencimiento:</label>
                <input type="date" class="form-control form-control-sm" id="fecha_vencimiento" name="fecha_vencimiento">
              </div>
            </div>

            <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
              <div class="mb-3">
                <label class="control-label">(*) Hora Vencimiento:</label>
                <input type="time" class="form-control form-control-sm" id="hora_vencimiento" name="hora_vencimiento">
              </div>
            </div>

            <div class="col-12 gy-6 my-3">
              <div class="row g-3 justify-content-end">
                <div class="col-auto">
                  <button class="btn btn-phoenix-primary btn-sm text-danger" type="button" id="btn-cancelar">
                    <span class="text-danger" data-feather="x"></span> Cancelar
                  </button>
                </div>

                <div class="col-auto">
                  <button class="btn btn-primary btn-sm" id="btn_publicacion_pedido" type="button" data-numdoc_solicitud="${dataId}">
                    <span class="uil uil-save"></span> Publicar Pedido
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      `);


      try {
        let formData = new FormData();
        formData.append("dataId2", dataId2);

        let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicio_proveedor', {
          method: "POST",
          body: formData
        });

        let data = await response.json();
        if (data) {
          let rows = "";
          data.forEach((servicio, index) => {
            rows += `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${servicio.tipo_servicio}</td>
                  <td>${servicio.esatdo_servicio}</td>
                  <td>
                    <div class="btn-group btn-group-sm" role="group" aria-label="...">
                      <button class="btn btn-subtle-warning btn-sm me-1 px-1 py-0 asignar-servicio" id="btn_listar_proveedores" data-id="${servicio.cliente_id}" data-id2="${servicio.servicio_id}" type="button">
                        Proveedores
                      </button>
                    </div>
                  </td>
                  <td><div class="form-check form-switch"><input class="form-check-input me-2" type="checkbox" name="ProveedorServicio" data-clienId="${servicio.cliente_id}" id="servicio_${servicio.servicio_id}" value="${servicio.servicio_id}"></div></td>
                </tr>
                <tr id="proveedores_${servicio.servicio_id}" style="display: none;">
                  <td colspan="5">
                    <div class="lista-proveedores"></div>
                  </td>
                </tr>
              `;
          });

          document.getElementById("tbody_servicio_torre_control").innerHTML = rows;
        } else {
          document.getElementById("tbody_servicio_torre_control").innerHTML = `<tr><td colspan="4" class="text-center text-danger">${data.message}</td></tr>`;
        }
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        document.getElementById("tbody_servicio_torre_control").innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar proveedores</td></tr>`;
      }

      myOffcanvas.show();
    }

    if (e.target.matches("#btn_listar_proveedores") || e.target.matches("#btn_listar_proveedores *")) {
      let enlace = e.target.closest("#btn_listar_proveedores");
      let clienId = enlace.getAttribute("data-id");
      let ServicioId = enlace.getAttribute("data-id2");

      await mostrarProveedores(clienId, ServicioId);
    }

    if (e.target.matches("#btn_publicacion_pedido") || e.target.matches("#btn_publicacion_pedido *")) {
      let enlace = e.target.closest("#btn_publicacion_pedido");
      let numdocSolicitud = enlace.getAttribute("data-numdoc_solicitud");

      let seleccionados = [];

      document.querySelectorAll("input[name='ProveedorServicio']:checked").forEach((checkbox) => {
        let servicioId = checkbox.value;
        let proveedores = document.querySelectorAll(`#proveedores_${servicioId} input[name='ServiciosProveedores']`);
        let proveedoresSeleccionados = [];

        proveedores.forEach((input) => {
          proveedoresSeleccionados.push(input.value);
        });

        seleccionados.push({
          servicio_id: servicioId,
          proveedores: proveedoresSeleccionados
        });
      });

      if (seleccionados.length === 0) {
        Swal.fire("Error", "Debe seleccionar al menos un servicio y un proveedor.", "error");
        return;
      }

      let fechaVencimiento = document.getElementById("fecha_vencimiento").value.trim();
      let horaVencimiento = document.getElementById("hora_vencimiento").value.trim();

      if (!fechaVencimiento || !horaVencimiento) {
        Swal.fire("Error", "Debe seleccionar fecha y hora de vencimiento.", "error");
        return;
      }

      const result = await Swal.fire({
        title: "¿Seguro?",
        text: "¿Desea guardar publicación del pedido?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3B71CA",
        cancelButtonColor: "#9FA6B2",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        customClass: { popup: "swal2-custom-font" },
      });

      if (result.isConfirmed) {
        const btn = document.querySelector("#btn_publicacion_pedido");

        btn.disabled = true;
        btn.innerHTML = "Publicando Pedido... ⏳";

        let formData = new FormData();
        formData.append("numdocSolicitud", numdocSolicitud);
        formData.append("seleccionados", JSON.stringify(seleccionados));
        formData.append("fecha_vencimiento", fechaVencimiento);
        formData.append("hora_vencimiento", horaVencimiento);
        formData.append("proceso", 'Publicación');

        try {
          const response = await fetch($('#base_url').val() + "torrecontrol/publicar_pedido", {
            method: "POST",
            body: formData,
            cache: "no-cache",
          });

          if (!response.ok) {
            const text = await response.text(); // Captura la respuesta completa en texto
            console.error("Error en la respuesta del servidor:", response.status, text);
            Swal.fire("Error", `Error ${response.status}: ${text}`, "error");
            return;
          }

          const data = await response.json();

          Swal.fire({
            title: "Mensaje!",
            text: data.message,
            icon: data.status ? "success" : "error",
            draggable: true,
          }).then((result) => {
            if (result.isConfirmed) {
              myOffcanvas.hide();
              listar_pedidos_prioritarios(fechaColombia, fechaColombia);
            }
          });

        } catch (err) {
          console.error("Error en fetch:", err);
          Swal.fire("Error", "Error al enviar datos al servidor.", "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = "<span class='uil uil-save'></span> Publicar Pedido";
        }
      }
    }

    if (e.target.matches("#btn_detalle_proceso") || e.target.matches("#btn_detalle_proceso *")) {
      let enlace = e.target.closest("#btn_detalle_proceso");
      let Solicitud = enlace.getAttribute("data-id");
      let Cliente = enlace.getAttribute("data-id2");
      let Proceso = enlace.getAttribute("data-proceso");

      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Destalle Proceso del pedido N°` + Solicitud);
      myOffcanvas.updateContent(`
        <table class="table table-sm" style="font-size:10px;">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">PROCESO</th>
              <th scope="col">TIPO SERVICIO</th>
              <th scope="col">PROVEEDOR</th>
              <th scope="col">FECHA VENCIMIENTO</th>
              <th scope="col">HORA VENCIMIENTO</th>
            </tr>
          </thead>
          <tbody id="tbody_detalle_proceso"></tbody>
        </table>
      `);

      try {
        let formData = new FormData();
        formData.append("Solicitud", Solicitud);

        let response = await fetch($('#base_url').val() + 'torrecontrol/detalle_proceso', {
          method: "POST",
          body: formData
        });

        let data = await response.json();
        if (data) {
          let rows = "";
          data.forEach((proveedor, index) => {
            rows += `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${proveedor.proceso}</td>
                  <td>${proveedor.tipo_servicio}</td>
                  <td>${proveedor.razon_social}</td>
                  <td>${proveedor.fecha_vencimiento}</td>
                  <td>${proveedor.hora_vencimiento}</td>
                  <!--<td>
                    <div class="btn-group btn-group-sm" role="group" aria-label="...">
                      <button class="btn btn-subtle-warning btn-sm me-1 px-1 py-0 asignar-proveedor" id="btn_listar_servicios" data-id="${proveedor.id}" type="button">
                        Servicios
                      </button>
                    </div>
                  </td>-->
                </tr>
                <!--<tr id="servicios_${proveedor.id}" style="display: none;">
                  <td colspan="4">
                    <div class="lista-servicios"></div>
                  </td>
                </tr>-->
              `;
          });

          document.getElementById("tbody_detalle_proceso").innerHTML = rows;
        } else {
          document.getElementById("tbody_detalle_proceso").innerHTML = `<tr><td colspan="4" class="text-center text-danger">${data.message}</td></tr>`;
        }
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        document.getElementById("tbody_detalle_proceso").innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar proveedores</td></tr>`;
      }

      myOffcanvas.show();
    }

    /* Boton para buscar por fechas */
    if (e.target.matches(`#campo-${window.VENTANA}-buscar`) || e.target.matches(`#campo-${window.VENTANA}-buscar *`)) {
      let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
      let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
      listar_pedidos_prioritarios(fecha_inicial, fecha_final);
    }

    if (e.target.matches("#btn_observacion_solicitud_servicio") || e.target.matches("#btn_observacion_solicitud_servicio *")) {
      let enlace = e.target.closest("#btn_observacion_solicitud_servicio");
      let Observacion = enlace.getAttribute("data-id");
      let NumdocSolicitud = enlace.getAttribute("data-id2");
      let SitioCargue = enlace.getAttribute("data-id3");
      let SitioDescargue = enlace.getAttribute("data-id4");
      let ReferenciaProducto = enlace.getAttribute("data-id5");
      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Detalle de solicitud de servicio N°` + NumdocSolicitud);
      myOffcanvas.updateContent(`<b>Observación:</b> ${Observacion} <br> <b>Sitio Cargue:</b> ${SitioCargue} <br> <b>Sitio Descargue:</b> ${SitioDescargue} <br> <b>Referencia Producto:</b> ${ReferenciaProducto}`);
      myOffcanvas.show();
    }

    if (e.target.matches("#btn_marcar_prioridad") || e.target.matches("#btn_marcar_prioridad *")) {
      let enlace = e.target.closest("#btn_marcar_prioridad");
      let numdocSolicitud = enlace.getAttribute("data-id");
      const result = await Swal.fire({
        title: "Seguro",
        text: "¿Desea guardar la prioridad?",
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
        const btn = document.querySelector("#btn_marcar_prioridad");

        btn.disabled = true;
        btn.innerHTML = "Asignando Prioridad... ⏳";

        let formData = new FormData();
        formData.append("numdocSolicitud", numdocSolicitud);

        try {
          const response = await fetch($('#base_url').val() + 'torrecontrol/Insertar_Prioridad', {
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
              myOffcanvas.hide();
              listar_pedidos_prioritarios(fechaColombia, fechaColombia);
            }
          });

        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Error al enviar datos al servidor.", "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = "<span class='uil uil-bell'></span> Marcar como Prioridad";
        }
      }
    }
  });

  // Evento para mostrar/ocultar proveedores con el checkbox y hacer la petición AJAX
  document.addEventListener("change", async (e) => {
    if (e.target.matches("input[name='ProveedorServicio']")) {
      let ServicioId = e.target.value;
      let clienId = e.target.getAttribute("data-clienId");

      await mostrarProveedores(clienId, ServicioId);
    }
  });

}

async function listar_pedidos_prioritarios(fecha_inicial, fecha_final) {
  /* Funcion para enviar los datos */
  let dato = new FormData();
  dato.append('fecha_inicial', fecha_inicial);
  dato.append('fecha_final', fecha_final);
  dato.append('estado', 'Prioritaria');
  try {
    const response = await fetch($('#base_url').val() + 'torrecontrol/listar_administracion_pedidos', {
      method: 'POST',
      body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tbl_prioritarias_pedidos');
      tbody.innerHTML = '';
      let esatdo_autorizado = '';
      let col_estatus_publicacion = '';
      let col_estatus_asignacion = '';
      let btn_Asignacion = "";
      let btn_publicacion = "";
      let col_prioridad = "";
      let btn_prioridad = "";

      data.forEach(element => {
        const fila = document.createElement('tr');

        if (element.estado_publicaion === 'Pendiente') {
          col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${element.estado_publicaion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_publicaion === 'Publicado') {
          col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_publicaion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_publicaion === 'Cancelado') {
          col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${element.estado_publicaion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_publicacion = `<a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-feedback"></span> Publicar Pedido</a>`;
        } else if (element.estado_publicaion === 'Aceptado') {
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado_publicaion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_publicaion === 'Pendiente Respuesta') {
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${element.estado_publicaion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        }

        if (element.estado_asignacion === 'Pendiente') {
          col_estatus_asignacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${element.estado_asignacion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_asignacion === 'Asignado') {
          col_estatus_asignacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_asignacion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_asignacion === 'Cancelado') {
          col_estatus_asignacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${element.estado_asignacion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_asignacion === 'Aceptado') {
          col_estatus_asignacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado_asignacion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_asignacion === 'Ganador') {
          col_estatus_asignacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado_asignacion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        }

        if (element.estado_prioridad === 'Prioritaria') {
          col_prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${element.estado_prioridad}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_prioridad = ``;
        } else if (element.estado_prioridad === 'No Marcada') {
          col_prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_prioridad}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          btn_prioridad = `<a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"> <span class="uil uil-bell"></span> Marcar como Prioridad</a>`;
        }

        /* Validar la asignación del pedido */
        if (element.estado_publicaion === "Aceptado" && element.estado_asignacion === "Asignado") {
          btn_publicacion = "";
          btn_Asignacion = "";
        }
        /* Validar publicación del pedido */
        else if (element.estado_publicaion === "Publicado" && element.estado_asignacion === "Pendiente") {
          btn_publicacion = "";
          btn_Asignacion = "";
        }
        /* Validar si el pedido ya tuvo una publicación */
        else if (element.estado_publicaion === "Pendiente Respuesta" && element.estado_asignacion === "Pendiente") {
          btn_publicacion = "";
          btn_Asignacion = "";
        } else if (element.estado_publicaion === "Aceptado" && element.estado_asignacion === "Ganador") {
          btn_publicacion = "";
          btn_Asignacion = "";
        }
        /* Si no se cumplen las condiciones anteriores, mostrar los botones */
        else {
          btn_publicacion = `<a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-feedback"></span> Publicar Pedido</a>`;
          btn_Asignacion = `<a class="dropdown-item fw-bold" href="#" id="btn_asignar_proveedor" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-file-search-alt"></span> Asignar Proveedor</a>`;
        }

        const columnaNundocSolicitud = document.createElement('td');
        columnaNundocSolicitud.innerHTML = `
        <div class="dropdown">
          <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.numdoc_solicitud}</a>
          <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
            ${btn_Asignacion}
            ${btn_publicacion}
            <a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>
            <a class="dropdown-item fw-bold" href="#" id="btn_observacion_solicitud_servicio"  data-id="${element.observaciones}" data-id2="${element.numdoc_solicitud}" data-id3="${element.sitio_cargue}" data-id4="${element.sitio_descargue}" data-id5="${element.referencia}"><span class="uil-wrap-text"></span> Detalle solicitud servicio</a>
            <div class="dropdown-divider"></div> 
            ${btn_prioridad}
          </div>
        </div>
        `;
        const columnaCliente = document.createElement('td');
        columnaCliente.innerHTML = element.nombre_cliente;
        columnaCliente.style.width = 'auto';
        columnaCliente.style.whiteSpace = 'nowrap';
        const columnaCiudadOrigen = document.createElement('td');
        columnaCiudadOrigen.innerHTML = element.ciudad_origen;
        columnaCiudadOrigen.style.width = 'auto';
        columnaCiudadOrigen.style.whiteSpace = 'nowrap';
        // const columnaSitioCargue = document.createElement('td');
        // columnaSitioCargue.innerHTML = element.sitio_cargue;
        const columnaCiudadDestino = document.createElement('td');
        columnaCiudadDestino.innerHTML = element.ciudad_destino;
        // const columnaSitioDescargue = document.createElement('td');
        // columnaSitioDescargue.innerHTML = element.sitio_descargue;
        const columnaCodigoProducto = document.createElement('td');
        columnaCodigoProducto.innerHTML = element.cod_producto;
        const columnaReferencia = document.createElement('td');
        columnaReferencia.innerHTML = element.referencia_pedido;
        // columnaReferencia.style.width = 'auto';
        // columnaReferencia.style.whiteSpace = 'nowrap';

        const columnaModalidad = document.createElement('td');
        columnaModalidad.innerHTML = element.modalidad;
        const columnaPesoNeto = document.createElement('td');
        columnaPesoNeto.innerHTML = element.peso_neto + " KG";
        const columnaPesoBruto = document.createElement('td');
        columnaPesoBruto.innerHTML = element.peso_bruto + " KG";
        // const columnaNum_Cotizacion = document.createElement('td');
        // columnaNum_Cotizacion.innerHTML = `<a href="#" id="btn_ver_solicitud_Prioritaria" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}" data-id3="${id}" class="text-decoration-none"> N°${element.nundoc_solicitud}</a> `;
        const columnaUnidades = document.createElement('td');
        columnaUnidades.innerHTML = element.unidades;
        const columnaTipoVehiculo = document.createElement('td');
        columnaTipoVehiculo.innerHTML = element.tipo_vehiculo;
        const columnaCosto = document.createElement('td');
        columnaCosto.innerHTML = '$ ' + parseFloat(element.costo, 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString();
        columnaCosto.style.width = 'auto';
        columnaCosto.style.whiteSpace = 'nowrap';
        const columnaTarifa = document.createElement('td');
        columnaTarifa.innerHTML = '$ ' + parseFloat(element.tarifa, 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString();
        columnaTarifa.style.width = 'auto';
        columnaTarifa.style.whiteSpace = 'nowrap';
        // const columnaPeso = document.createElement('td');
        // columnaPeso.innerHTML = element.peso_neto_kg + 'Kg';
        const columnaEstadoPublicacion = document.createElement('td');
        columnaEstadoPublicacion.innerHTML = col_estatus_publicacion;
        const columnaEstadoAsignacion = document.createElement('td');
        columnaEstadoAsignacion.innerHTML = col_estatus_asignacion;
        const columnaFecha = document.createElement('td');
        columnaFecha.innerHTML = element.fecha + ' ' + element.hora;
        columnaFecha.style.width = 'auto';
        columnaFecha.style.whiteSpace = 'nowrap';
        // //Empresas
        const columnaPriordad = document.createElement('td');
        columnaPriordad.innerHTML = col_prioridad;

        fila.appendChild(columnaNundocSolicitud);
        fila.appendChild(columnaReferencia);
        fila.appendChild(columnaCliente);
        fila.appendChild(columnaCiudadOrigen);
        // fila.appendChild(columnaSitioCargue);
        fila.appendChild(columnaCiudadDestino);
        // fila.appendChild(columnaSitioDescargue);
        fila.appendChild(columnaCodigoProducto);
        fila.appendChild(columnaModalidad);
        fila.appendChild(columnaPesoNeto);
        fila.appendChild(columnaPesoBruto);
        fila.appendChild(columnaUnidades);
        fila.appendChild(columnaTipoVehiculo);
        fila.appendChild(columnaCosto);
        fila.appendChild(columnaTarifa);
        fila.appendChild(columnaFecha);
        fila.appendChild(columnaPriordad);
        fila.appendChild(columnaEstadoPublicacion);
        fila.appendChild(columnaEstadoAsignacion);
        tbody.appendChild(fila);
      });
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

// Función para obtener y mostrar proveedores
async function mostrarProveedores(clienId, ServicioId) {
  let filaProveedores = document.getElementById(`proveedores_${ServicioId}`);

  if (!filaProveedores) {
    console.error(`No se encontró el <tr> con id #proveedores_${ServicioId}`);
    return;
  }

  // Mostrar u ocultar la fila de servicios
  if (filaProveedores.style.display === "none") {
    filaProveedores.style.display = "table-row";

    // Obtener servicios si aún no se han cargado
    if (filaProveedores.querySelector(".lista-proveedores").innerHTML.trim() === "") {
      try {
        let formData = new FormData();
        formData.append("clienId", clienId);
        formData.append("ServicioId", ServicioId);

        let response = await fetch($('#base_url').val() + 'torrecontrol/listar_provedores_clientes', {
          method: "POST",
          body: formData
        });

        let data = await response.json();

        if (data) {
          let serviciosHTML = '<ul class="list-group">';
          data.forEach((proveedor) => {
            serviciosHTML += `
              <li class="list-group-item d-flex align-items-center p-1">
                <div class="form-check form-switch">
                  <input class="form-check-input me-2" type="hidden" name="ServiciosProveedores" id="proveedor_${proveedor.id}" value="${proveedor.id}" data-ServicioId="${proveedor.servicio_id}">
                  <label for="servicio_${proveedor.id}" class="flex-grow-1">${proveedor.razon_social}</label>
                </div>
              </li>
            `;
          });
          serviciosHTML += '</ul>';

          filaProveedores.querySelector(".lista-proveedores").innerHTML = serviciosHTML;
        } else {
          filaProveedores.querySelector(".lista-proveedores").innerHTML = `<p class="text-danger">${data.message}</p>`;
        }
      } catch (error) {
        console.error("Error al obtener servicios:", error);
        filaProveedores.querySelector(".lista-proveedores").innerHTML = `<p class="text-danger">Error al cargar proveedores</p>`;
      }
    }
  } else {
    filaProveedores.style.display = "none";
  }
}