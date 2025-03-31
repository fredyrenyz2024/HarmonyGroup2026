$(document).ready(function () {

  // Inicializar sessionStorage si no existe
  if (!sessionStorage.getItem("carrito")) {
    sessionStorage.setItem("carrito", JSON.stringify([]));
  }

  const hoy = new Date();
  const opciones = { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" };

  // Formatear la fecha a "YYYY-MM-DD"
  const fechaColombia = new Intl.DateTimeFormat("es-CO", opciones)
    .format(hoy)
    .split("/")
    .reverse()
    .join("-");

  document.addEventListener("click", async (e) => {
    if (e.target.matches("#btn_asignar_proveedor") || e.target.matches("#btn_asignar_proveedor *")) {
      let enlace = e.target.closest("#btn_asignar_proveedor");
      let dataId = enlace.getAttribute("data-id");
      let dataId2 = enlace.getAttribute("data-id2");
      let titulo_opcion = enlace.getAttribute("data-title");

      /* Colcoar titulo a la opcion que se va a ejecutar */
      document.getElementById("titulo_opcion").innerHTML = titulo_opcion;

      document.getElementById("acciones_asignacion").innerHTML = `
        <div class="col-12">
          <div class="row g-3 justify-content-end">
            <div class="col-auto">
              <button class="btn btn-primary btn-sm py-1" id="btn_asignacion_proveedor" type="button" data-numdoc_solicitud="${dataId}" data-ClienteId="${dataId2}">
                <span class="uil uil-save"></span> Asignar
              </button>
            </div>
          </div>
        </div>`;

      /* Colcoar contenido a la opcion que se va a ejecutar */
      document.getElementById("contenido_opcion").innerHTML = `
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
          </div>
        </div>
      `;

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
      // Obtener el contenido actual y agregar el nuevo contenido sin reemplazarlo
      let contenidoActual = myOffcanvas.getContent(); // Asegúrate de que `getContent()` existe en tu implementación
      myOffcanvas.updateContent(contenidoActual);
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
              let TipoServicio = "";
              data.forEach((servicio, index) => {
                TipoServicio = servicio.tipo_servicio;
                serviciosHTML += `
                  <li class="list-group-item d-flex align-items-center px-1 py-0 bg-gray-100" id="servicios_proveedor${index}">
                    <div class="container">
                      <div class="row align-items-center mb-2 gap-2">
                        <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2 d-flex justify-content-start mt-4">
                          <div class="form-check form-switch">
                            <input type="checkbox" class="form-check-input" name="servicioProveedor" id="servicio_${proveedorId}_${servicio.id}" value="${servicio.id}" data-idProveedor="${proveedorId}" data-index="${index}"
                            onchange="accionesServicio(${proveedorId}, this.value, this.id,'${TipoServicio}', ${index})">
                            <label class="form-label">${servicio.tipo_servicio}</label>
                          </div>
                        </div>
                        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3" id="contenido_fecha_vencimiento_${proveedorId}_${index}" style="display:none;">
                          <div class="mb-1">
                            <label class="form-label">(*) Fecha Vencimiento:</label>
                            <input type="date" class="form-control form-control-sm" id="fecha_vencimiento_${proveedorId}_${index}" name="fecha_vencimiento">
                          </div>
                        </div>
                        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3" id="contenido_hora_vencimiento_${proveedorId}_${index}" style="display:none;">
                          <div class="mb-1">
                            <label class="form-label">(*) Hora Vencimiento:</label>
                            <input type="time" class="form-control form-control-sm" id="hora_vencimiento_${proveedorId}_${index}" name="hora_vencimiento">
                          </div>
                        </div>
                        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3" id="contenido_tipo_vehiculo_${proveedorId}_${index}" style="display:none;">
                          <div class="mb-1">
                            <label class="form-label">(*) Tipo de Vehiculo:</label>
                            <select class="form-select form-select-sm fs-9" id="tipo_vehiculo_${proveedorId}_${index}" name="tipo_vehiculo" style="width: 100%;font-size: 10px;">
                            </select>
                          </div>
                        </div>
                      </div>
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
      // let enlace = e.target.closest("#btn_asignacion_proveedor");
      let ClienteId = e.target.getAttribute("data-ClienteId");
      let asignaciones = [];

      document.querySelectorAll('input[name="servicioProveedor"]:checked').forEach((checkbox) => {
        let servicioId = checkbox.value;
        let proveedorId = checkbox.getAttribute("data-idProveedor");
        let Index = checkbox.getAttribute("data-index");
        let fecha_vencimiento = document.getElementById(`fecha_vencimiento_${proveedorId}_${Index}`).value.trim();
        let hora_vencimiento = document.getElementById(`hora_vencimiento_${proveedorId}_${Index}`).value.trim();
        let tipo_vehiculo = document.getElementById(`tipo_vehiculo_${proveedorId}_${Index}`).value.trim();

        asignaciones.push({
          servicio_id: servicioId,
          proveedor_id: proveedorId,
          fecha_vencimiento: fecha_vencimiento,
          hora_vencimiento: hora_vencimiento,
          tipo_vehiculo: tipo_vehiculo ? (tipo_vehiculo || 0) : 0,// Evita valores undefined
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
        formData.append("asignaciones", JSON.stringify(asignaciones));
        formData.append("solicitudes", sessionStorage.getItem("carrito"));
        formData.append("ClienteId", ClienteId);

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
              myOffcanvas.hide();
              sessionStorage.clear();
              actualizarContadorCarrito();
              listar_pedidos_administrador(fechaColombia, fechaColombia);
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
      let titulo_opcion = enlace.getAttribute("data-title");

      /* Colcoar titulo a la opcion que se va a ejecutar */
      document.getElementById("titulo_opcion").innerHTML = titulo_opcion;

      document.getElementById("acciones_asignacion").innerHTML = `
      <div class="col-12">
        <div class="row g-3 justify-content-end">
          <div class="col-auto">
            <button class="btn btn-primary btn-sm py-1" id="btn_publicacion_pedido" type="button" data-numdoc_solicitud="${dataId}" data-ClienteId="${dataId2}">
              <span class="uil uil-save"></span> Publicar
            </button>
          </div>
        </div>
      </div>`;

      document.getElementById("contenido_opcion").innerHTML = `
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
            </div>
          </div>
       `;

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
    }

    if (e.target.matches("#btn_listar_proveedores") || e.target.matches("#btn_listar_proveedores *")) {
      let enlace = e.target.closest("#btn_listar_proveedores");
      let clienId = enlace.getAttribute("data-id");
      let ServicioId = enlace.getAttribute("data-id2");

      await mostrarProveedores(clienId, ServicioId);
    }

    if (e.target.matches("#btn_publicacion_pedido") || e.target.matches("#btn_publicacion_pedido *")) {
      let enlace = e.target.closest("#btn_publicacion_pedido");
      let ClienteId = enlace.getAttribute("data-clienteid");

      let seleccionados = [];
      let ArrayProveedoresseleccionados = [];

      // document.querySelectorAll("input[name='ProveedorServicio']:checked").forEach((checkbox) => {
      //   let servicioId = checkbox.value;
      //   let proveedores = document.querySelectorAll(`#proveedores_${servicioId} input[name='ServiciosProveedores']`);
      //   let fechaVencimiento = document.getElementById(`fecha_vencimiento_${servicioId}`).value.trim();
      //   let horaVencimiento = document.getElementById(`hora_vencimiento_${servicioId}`).value.trim();
      //   let tipoVehiculo = document.getElementById(`tipo_vehiculo_${servicioId}`).value.trim();
      //   let proveedoresSeleccionados = [];

      //   proveedores.forEach((input) => {
      //     // Si el proveedor no está en el array, lo agregamos
      //     proveedoresSeleccionados.push(input.value);
      //     if (!ArrayProveedoresseleccionados.includes(input.value)) {
      //       ArrayProveedoresseleccionados.push(input.value); // Guardamos en el array global
      //     }
      //   });

      //   seleccionados.push({
      //     servicio_id: servicioId,
      //     fecha_vencimiento: fechaVencimiento,
      //     hora_vencimiento: horaVencimiento,
      //     tipo_vehiculo: tipoVehiculo,
      //     proveedores: proveedoresSeleccionados
      //   });
      // });


      document.querySelectorAll("input[name='ProveedorServicio']:checked").forEach((checkbox) => {
        let servicioId = checkbox.value;
        let proveedores = document.querySelectorAll(`#proveedores_${servicioId} input[name='ServiciosProveedores']`);

        let fechaVencimientoElem = document.getElementById(`fecha_vencimiento_${servicioId}`);
        let horaVencimientoElem = document.getElementById(`hora_vencimiento_${servicioId}`);
        let tipoVehiculoElem = document.getElementById(`tipo_vehiculo_publicacion${servicioId}`);

        let fechaVencimiento = fechaVencimientoElem ? fechaVencimientoElem.value.trim() : "";
        let horaVencimiento = horaVencimientoElem ? horaVencimientoElem.value.trim() : "";
        let tipoVehiculo = tipoVehiculoElem ? (tipoVehiculoElem.value.trim() || 0) : 0; // Evita valores undefined

        let proveedoresSeleccionados = [];

        proveedores.forEach((input) => {
          proveedoresSeleccionados.push(input.value);
          if (!ArrayProveedoresseleccionados.includes(input.value)) {
            ArrayProveedoresseleccionados.push(input.value);
          }
        });

        seleccionados.push({
          servicio_id: servicioId,
          fecha_vencimiento: fechaVencimiento,
          hora_vencimiento: horaVencimiento,
          tipo_vehiculo: tipoVehiculo,
          proveedores: proveedoresSeleccionados
        });

      });

      if (seleccionados.length === 0) {
        Swal.fire("Error", "Debe seleccionar al menos un servicio y un proveedor.", "error");
        return;
      }

      // let fechaVencimiento = document.getElementById("fecha_vencimiento").value.trim();
      // let horaVencimiento = document.getElementById("hora_vencimiento").value.trim();

      // if (!fechaVencimiento || !horaVencimiento) {
      //   Swal.fire("Error", "Debe seleccionar fecha y hora de vencimiento.", "error");
      //   return;
      // }

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
        formData.append("seleccionados", JSON.stringify(seleccionados));
        formData.append("solicitudes", sessionStorage.getItem("carrito"));
        formData.append("Proveedoresseleccionados", JSON.stringify(ArrayProveedoresseleccionados));
        formData.append("proceso", 'Publicación');
        formData.append("ClienteId", ClienteId);

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
              sessionStorage.clear();
              actualizarContadorCarrito();
              listar_pedidos_administrador(fechaColombia, fechaColombia);
            }
          });

        } catch (err) {
          console.error("Error en fetch:", err);
          Swal.fire("Error", "Error al enviar datos al servidor.", "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = "<span class='uil uil-save'></span> Publicar";
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
        <ul class="list-group d-flex flex-row gap-3">
          <li class="list-group-item d-flex justify-content-between align-items-center gap-2" style="font-size:13px;">
            Total Servicios Gestionados
              <span class="badge badge-phoenix badge-phoenix-primary rounded-pill me-2" id="servicios_gestionados">0</span>
          </li>

          <li class="list-group-item d-flex justify-content-between align-items-center gap-2" style="font-size:13px;">
            Total Servicios Postulados
              <span class="badge badge-phoenix badge-phoenix-primary rounded-pill me-2" id="servicios_postulados">0</span>
          </li>

            <!-- Botón al lado de la segunda li -->
          <button class="btn btn-subtle-primary btn-sm text-right" type="button" id="btn_subastar" style="display: none;" data-id="${Solicitud}">Subastar Servicios</button>
        </ul>
        <hr class="my-1">
        <h5 class="mt-3"> SERVICIOS</h5>
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

        <h5> SUBASTA</h5>

        <table class="table table-sm" style="font-size:10px;">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">SERVICIO</th>
              <th scope="col">VALOR SERVICIO</th>
              <th scope="col">PROVEEDOR</th>
              <th scope="col">FECHA INICIO</th>
              <th scope="col">HORA INICIO</th>
              <th scope="col">FECHA REGISTRO</th>
              <th scope="col">HORA REGISTRO</th>
            </tr>
          </thead>
          <tbody id="tbody_subasta_proceso"></tbody>
        </table>

      <h5>RESULTADOS DE LA SUBASTA</h5>

      <table class="table table-sm" style="font-size:10px;">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">SERVICIO</th>
              <th scope="col">VALOR SERVICIO</th>
              <th scope="col">PROVEEDOR</th>
              <th scope="col">FECHA INICIO</th>
              <th scope="col">HORA INICIO</th>
              <th scope="col">FECHA REGISTRO</th>
              <th scope="col">HORA REGISTRO</th>
            </tr>
          </thead>
          <tbody id="tbody_subasta_resultados"></tbody>
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
        if (data.consulta_general.length > 0) {
          let rows = "";
          data.consulta_general.forEach((proveedor, index) => {
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

        /* LLenar tabla de subasta */
        if (data.consulta_subasta.length > 0) {
          let rows = "";
          data.consulta_subasta.forEach((proveedor, index) => {
            rows += `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${proveedor.tipo_servicio}</td>
                  <td>${proveedor.valor_servicio}</td>
                  <td>${proveedor.razon_social}</td>
                  <td>${proveedor.fecha_inicio}</td>
                  <td>${proveedor.hora_inicio}</td>
                  <td>${proveedor.fecha_actualizacion}</td>
                  <td>${proveedor.hora_actualizacion}</td>
                </tr>
              `;
          });
          document.getElementById("tbody_subasta_proceso").innerHTML = rows;

        } else {
          document.getElementById("tbody_subasta_proceso").innerHTML = `<tr><td colspan="4" class="text-center text-danger">${data.message}</td></tr>`;
        }

        document.getElementById("servicios_gestionados").innerHTML = data.total_gestionados.total_gestionados;
        document.getElementById("servicios_postulados").innerHTML = data.total_servicios.total_servicios;

        if (data.total_gestionados.total_gestionados === data.total_servicios.total_servicios) {
          document.getElementById("btn_subastar").style.display = "";
        } else {
          document.getElementById("btn_subastar").style.display = "none";
        }

      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        document.getElementById("tbody_detalle_proceso").innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar proveedores</td></tr>`;
      }

      myOffcanvas.show();
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
              listar_pedidos_administrador(fechaColombia, fechaColombia);
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

    // if (e.target.matches("#btn_subastar") || e.target.matches("#btn_subastar *")) {
    if (e.target.matches("#btn_asignar_recurso") || e.target.matches("#btn_asignar_recurso *")) {
      let enlace = e.target.closest("#btn_asignar_recurso");
      // let ServiciosId = enlace.getAttribute("data-ServiciosId");
      let Proceso = enlace.getAttribute("data-Proceso");
      let MaestroId = enlace.getAttribute("data-MaestroId");
      let ClienteId = enlace.getAttribute("data-ClienteId");
      let ReferenciaPedidos = JSON.parse(enlace.getAttribute("data-ReferenciaPedidos"));

      // let SolicitudesId = enlace.getAttribute("data-SolicitudesId");
      let ServiciosId = JSON.parse(enlace.getAttribute("data-serviciosid"));
      let SolicitudesId = JSON.parse(enlace.getAttribute("data-solicitudesid"));
      let ProveedoresId = JSON.parse(enlace.getAttribute("data-proveedoresid"));
      let ValoresServicio = JSON.parse(enlace.getAttribute("data-ValoresServicio"));
      let FechaInicio = JSON.parse(enlace.getAttribute("data-FechaInicio"));
      let FechaActualizacion = JSON.parse(enlace.getAttribute("data-FechaActualizacion"));
      let Placa = JSON.parse(enlace.getAttribute("data-Placa"));

      let solicitudes = [];

      // Verificamos que todos los arrays tengan la misma cantidad de elementos
      if (
        ServiciosId.length !== ProveedoresId.length ||
        ServiciosId.length !== ValoresServicio.length ||
        ServiciosId.length !== FechaInicio.length ||
        ServiciosId.length !== FechaActualizacion.length ||
        ServiciosId.length !== Placa.length
      ) {
        console.error("Error: Las longitudes de los arrays no coinciden.");
      } else {
        // Generar la combinación de servicios, solicitudes y proveedores
        ServiciosId.forEach((servicio, index) => {
          let proveedor_id = ProveedoresId[index];
          let valor_servicio = ValoresServicio[index];
          let fecha_inicio = FechaInicio[index];
          let fecha_actualizacion = FechaActualizacion[index];
          let placa = Placa[index];

          SolicitudesId.forEach(solicitud => {
            solicitudes.push({
              servicio_id: servicio,
              solicitud_id: solicitud,
              proveedor_id: proveedor_id,
              valor_servicio: valor_servicio,
              fecha_inicio: fecha_inicio,
              fecha_actualizacion: fecha_actualizacion,
              placa: placa,
            });
          });
        });

        console.log(solicitudes);
      }

      const result = await Swal.fire({
        title: "Seguro",
        text: "¿Desea Autorizar la subasta?",
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
        const btn = document.querySelector("#btn_asignar_recurso");

        btn.disabled = true;
        btn.innerHTML = "Subastando... ⏳";

        let formData = new FormData();
        formData.append("solicitudes", JSON.stringify(solicitudes));
        formData.append("proceso", Proceso);
        formData.append("MaestroId", MaestroId);
        formData.append("ClienteId", ClienteId);
        formData.append("ReferenciaPedidos", JSON.stringify(ReferenciaPedidos));

        try {
          const response = await fetch($('#base_url').val() + 'torrecontrol/Subastar_Pedido', {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
          });

          const data = await response.json();

          /* LLenar tabla de subasta */
          if (data.length > 0) {
            let rows = "";
            data.forEach((proveedor, index) => {
              rows += `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${proveedor.tipo_servicio}</td>
                  <td>${proveedor.valor_ganador}</td>
                  <td>${proveedor.razon_social}</td>
                  <td>${proveedor.Fecha_registro}</td>
                  <td>${proveedor.Fecha_Inicio}</td>
                </tr>
              `;
            });
            document.getElementById("tbody_subasta_resultados").innerHTML = rows;
          } else {
            document.getElementById("tbody_subasta_resultados").innerHTML = `<tr><td colspan="8" class="text-center text-danger">${data.message}</td></tr>`;
          }
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Error al enviar datos al servidor.", "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = `<span class="uil uil-play-circle"></span> Asignar Servicios`;
        }
      }
    }

    /* Subastar servicios en publicacion */
    if (e.target.matches("#btn_subastar_recurso") || e.target.matches("#btn_subastar_recurso *")) {
      let enlace = e.target.closest("#btn_subastar_recurso");
      let MaestroId = enlace.getAttribute("data-MaestroId");
      let Criterio = document.getElementById("slct_criterio").value;

      const result = await Swal.fire({
        title: "Seguro",
        text: "¿Desea Autorizar la subasta?",
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
        const btn = document.querySelector("#btn_subastar_recurso");

        btn.disabled = true;
        btn.innerHTML = "Subastando... ⏳";

        let formData = new FormData();
        formData.append("MaestroId", MaestroId);
        formData.append("Criterio", Criterio);

        try {
          const response = await fetch($('#base_url').val() + 'torrecontrol/Subastar_Pedido', {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
          });

          const data = await response.json();

          /* LLenar tabla de subasta */
          if (data.length > 0) {
            let rows = "";
            data.forEach((proveedor, index) => {
              rows += `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${proveedor.tipo_servicio}</td>
                  <td>${proveedor.valor_ganador}</td>
                  <td>${proveedor.razon_social}</td>
                  <td>${proveedor.Fecha_registro}</td>
                  <td>${proveedor.Fecha_Inicio}</td>
                </tr>
              `;
            });
            document.getElementById("tbody_subasta_resultados").innerHTML = rows;
          } else {
            document.getElementById("tbody_subasta_resultados").innerHTML = `<tr><td colspan="8" class="text-center text-danger">${data.message}</td></tr>`;
          }
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Error al enviar datos al servidor.", "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = `<span class="uil uil-play-circle"></span> Asignar Servicios`;
        }
      }
    }

    if (e.target.matches("#btn_cacnelar_asignacion") || e.target.matches("#btn_cacnelar_asignacion *")) {
      let enlace = e.target.closest("#btn_cacnelar_asignacion");
      let dataId = enlace.getAttribute("data-id");

      const result = await Swal.fire({
        title: "Seguro",
        text: "¿Desea cancelar la asignación del pedido " + dataId + "?",
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
        const btn = document.querySelector("#btn_cacnelar_asignacion");

        btn.disabled = true;
        btn.innerHTML = "Cancelando asignación... ⏳";

        let formData = new FormData();
        formData.append("numdocSolicitud", dataId);

        try {
          const response = await fetch($('#base_url').val() + 'torrecontrol/cancelar_asignacion', {
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
              listar_pedidos_administrador(fechaColombia, fechaColombia);
            }
          });

        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Error al enviar datos al servidor.", "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = "Cancelar Asignación";
        }
      }

    }

    /* Cerrar el offcanvas y limpiar el carrito */
    if (e.target.matches(".btn-close") || e.target.matches(".btn-close *")) {
      sessionStorage.clear();
      actualizarContadorCarrito();
    }
  });

  // Evento para mostrar/ocultar proveedores con el checkbox y hacer la petición AJAX
  document.addEventListener("change", async (e) => {
    if (e.target.matches("input[name='ProveedorServicio']")) {
      let ServicioId = e.target.value;
      let clienId = e.target.getAttribute("data-clienId");
      await mostrarProveedores(clienId, ServicioId);
    }


    // let ArrayDespachos = [];

    // if (e.target.matches("input[name='servicioProveedor']")) {
    //   let ServicioId = e.target.value;
    //   // Verifica si el ID ya existe antes de agregarlo
    //   if (!ArrayDespachos.includes(ServicioId)) {
    //     ArrayDespachos.push(ServicioId);
    //   } else {
    //     console.log("El servicio ya está agregado:", ServicioId);
    //   }
    // }


  });

  // Evento para seleccionar/deseleccionar todos los checkboxes
  $('#selectAll').on('change', function () {
    let isChecked = $(this).prop('checked');
    $('.pedido-checkbox').prop('checked', isChecked);
    let carrito = isChecked ? obtenerTodosLosPedidos() : [];
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    document.getElementById(`campo-16-carrito`).style.display = isChecked ? "" : "none";
    actualizarContadorCarrito();
  });

  // Evento para manejar cambios en los checkboxes individuales
  $(document).on('change', '.pedido-checkbox', function () {
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    let pedido = {
      id: $(this).val(),
      dataId: $(this).data('id'),  // Obtiene el atributo data-id
      dataId2: $(this).data('id2'),
      dataId3: $(this).data('id3'),
      dataId4: $(this).data('id4'),
      dataId5: $(this).data('id5'),
      dataId6: $(this).data('id6'),
      dataId7: $(this).data('id7'),
      dataId8: $(this).data('id8'),
      dataId9: $(this).data('id9'),
      dataId10: $(this).data('id10'),
      dataId11: $(this).data('id11'),
      dataId12: $(this).data('id12'),
      dataId13: $(this).data('id13'),
      dataId14: $(this).data('id14'),
    };

    if ($(this).prop('checked')) {
      // Agregar solo si no existe en el carrito
      if (!carrito.some(item => item.id === pedido.id)) {
        carrito.push(pedido);
      }
    } else {
      // Filtrar para eliminar el elemento
      carrito = carrito.filter(item => item.id !== pedido.id);
    }

    // Si todos los checkboxes están seleccionados, marcar el selectAll
    $('#selectAll').prop('checked', $('.pedido-checkbox:checked').length === $('.pedido-checkbox').length);
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    // Mostrar o ocultar el campo del carrito
    carrito.length > 0 ? document.getElementById(`campo-${window.VENTANA}-carrito`).style.display = "" : document.getElementById(`campo-${window.VENTANA}-carrito`).style.display = "none";
    document.getElementById(`campo-${window.VENTANA}-carrito`).setAttribute("data-idPedido", pedido.id);
    document.getElementById(`campo-${window.VENTANA}-carrito`).setAttribute("data-idCliente", pedido.dataId14);
    actualizarContadorCarrito();
  });
});

function obtenerTodosLosPedidos() {
  return $('.pedido-checkbox').map(function () {
    return {
      id: $(this).val(),          // Obtiene el valor del checkbox
      dataId: $(this).data('id'),
      dataId2: $(this).data('id2'),
      dataId3: $(this).data('id3'),
      dataId4: $(this).data('id4'),
      dataId5: $(this).data('id5'),
      dataId6: $(this).data('id6'),
      dataId7: $(this).data('id7'),
      dataId8: $(this).data('id8'),
      dataId9: $(this).data('id9'),
      dataId10: $(this).data('id10'),
      dataId11: $(this).data('id11'),
      dataId12: $(this).data('id12'),
      dataId13: $(this).data('id13'),
      dataId14: $(this).data('id14'),
    };
  }).get();
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
  let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
  $("#contadorCarrito").text(carrito.length);

  if (carrito.length === 0) {
    // Ocultar el campo del carrito
    document.getElementById(`campo-${window.VENTANA}-carrito`).style.display = "none";

    // Deseleccionar todos los checkboxes de pedidos
    $('.pedido-checkbox').prop('checked', false);

    // Deseleccionar el checkbox "Seleccionar todos"
    $('#selectAll').prop('checked', false);
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
    scroll: true,
    backdrop: false
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
    <div class="offcanvas offcanvas-end" 
        id="${this.settings.id}" 
        data-bs-scroll="${this.settings.scroll}" 
        data-bs-backdrop="${this.settings.backdrop}" 
        tabindex="-1" 
        aria-labelledby="${this.settings.id}-label" style="width: 1000px;">
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

DynamicOffcanvas.prototype.getContent = function () {
  var body = this.offcanvasElement.querySelector('.offcanvas-body');
  return body.innerHTML; // Devuelve el contenido actual
};

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
        let tipo_vehiculo = ``;
        if (data) {

          if (ServicioId === '2') {
            tipo_vehiculo = `
              <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <div class="mb-1">
                  <label class="form-label">(*) Tipo de Vehiculo:</label>
                  <select class="form-select form-select-sm fs-9" id="tipo_vehiculo_publicacion${ServicioId}" name="tipo_vehiculo" style="width: 100%;font-size: 10px;">
                  </select>
                </div>
              </div>
            `;
          } else {
            tipo_vehiculo = ``;
          }

          let control_servicio = `
            <div class="row">
              <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <div class="mb-3">
                  <label class="control-label">(*) Fecha Vencimiento:</label>
                  <input type="date" class="form-control form-control-sm" id="fecha_vencimiento_${ServicioId}" name="fecha_vencimiento">
                </div>
              </div>

              <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <div class="mb-3">
                  <label class="control-label">(*) Hora Vencimiento:</label>
                  <input type="time" class="form-control form-control-sm" id="hora_vencimiento_${ServicioId}" name="hora_vencimiento">
                </div>
              </div>
              ${tipo_vehiculo}
            </div>
          `;

          let serviciosHTML = '<ul class="list-group">';
          data.forEach((proveedor) => {
            serviciosHTML += `
              <li class="list-group-item d-flex align-items-center p-1  bg-gray-100">
                <div class="form-check form-switch">
                  <input class="form-check-input me-2" type="hidden" name="ServiciosProveedores" id="proveedor_${proveedor.id}" value="${proveedor.id}" data-ServicioId="${proveedor.servicio_id}">
                  <label for="servicio_${proveedor.id}" class="flex-grow-1">${proveedor.razon_social}</label>
                </div>
              </li>
            `;
          });
          serviciosHTML += '</ul>';

          filaProveedores.querySelector(".lista-proveedores").innerHTML = control_servicio + serviciosHTML;

        } else {
          filaProveedores.querySelector(".lista-proveedores").innerHTML = `<p class="text-danger">${data.message}</p>`;
        }
      } catch (error) {
        console.error("Error al obtener servicios:", error);
        filaProveedores.querySelector(".lista-proveedores").innerHTML = `<p class="text-danger">Error al cargar proveedores</p>`;
      } finally {
        if (ServicioId === '2') {
          $(`#tipo_vehiculo_publicacion${ServicioId}`).html('');
          $.ajax({
            url: $('#base_url').val() + 'serviciocliente/Tipo_Vehiculos',
            type: 'POST',
            dataType: 'json',
            success: function (data) {
              //traer el tipo de vehiculo
              $(`#tipo_vehiculo_publicacion${ServicioId}`).append('<option value="">Seleccione</option>');
              data.forEach(function (element, index1) {
                $(`#tipo_vehiculo_publicacion${ServicioId}`).append('<option value="' + element.id + '" style="width: 100%;font-size: 10px;"   >' + element.nombre + '</option>');
              });
              // Inicializar los selects con Select2
              $(`#tipo_vehiculo_publicacion${ServicioId}`).select2({
                placeholder: 'Seleccione una opción',
                allowClear: true,
                width: '100%',
              });
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log('no entro ');
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
            },
          });
        }
      }
    }
  } else {
    filaProveedores.style.display = "none";
  }
}

/* Funcion para obtener y mostrar proveedores */
let ArrayDespachos = [];
async function accionesServicio(proveedorId, servicioId, pedidoId, tipoServicio, index) {
  let pedidoCheckbox = document.getElementById(pedidoId);
  let fechaVencimiento = document.getElementById(`contenido_fecha_vencimiento_${proveedorId}_${index}`);
  let horaVencimiento = document.getElementById(`contenido_hora_vencimiento_${proveedorId}_${index}`);
  let tipoVehiculo = document.getElementById(`contenido_tipo_vehiculo_${proveedorId}_${index}`);

  if (!pedidoCheckbox || !fechaVencimiento || !horaVencimiento || !tipoVehiculo) {
    console.error("Algunos elementos no fueron encontrados.");
    return;
  }

  if (pedidoCheckbox.checked) {
    console.log(`✅ Mostrando elementos para ${tipoServicio} - Proveedor: ${proveedorId}, Índice: ${index}`);
    // Verifica si el ID ya existe antes de agregarlo
    if (!ArrayDespachos.includes(servicioId)) {
      ArrayDespachos.push(servicioId);
      fechaVencimiento.style.display = "";
      horaVencimiento.style.display = "";
      if (tipoServicio === "Despachos") {
        tipoVehiculo.style.display = "";
        $(`#tipo_vehiculo_${proveedorId}_${index}`).html('');
        $.ajax({
          url: $('#base_url').val() + 'serviciocliente/Tipo_Vehiculos',
          type: 'POST',
          dataType: 'json',
          success: function (data) {
            //traer el tipo de vehiculo
            $(`#tipo_vehiculo_${proveedorId}_${index}`).append('<option value="">Seleccione</option>');
            data.forEach(function (element, index1) {
              $(`#tipo_vehiculo_${proveedorId}_${index}`).append('<option value="' + element.id + '" style="width: 100%;font-size: 10px;"   >' + element.nombre + '</option>');
            });
            // Inicializar los selects con Select2
            $(`#tipo_vehiculo_${proveedorId}_${index}`).select2({
              placeholder: 'Seleccione una opción',
              allowClear: true,
              width: '100%',
            });
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log('no entro ');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
      }
    } else {
      console.log("El servicio ya está agregado:", servicioId);
      pedidoCheckbox.checked = false; // Desmarcar el checkbox si ya está en el array
    }
    console.log("🚀 ~ accionesServicio ~ ArrayDespachos:", ArrayDespachos)

  } else {
    console.log(`❌ Ocultando elementos para ${tipoServicio} - Proveedor: ${proveedorId}, Índice: ${index}`);
    fechaVencimiento.style.display = "none";
    tipoVehiculo.style.display = "none";
    horaVencimiento.style.display = "none";
    // Si se desmarca, eliminarlo del array
    ArrayDespachos = ArrayDespachos.filter(id => id !== servicioId);
    console.log(`❌ Eliminado ${servicioId} de ArrayDespachos`);
  }
}