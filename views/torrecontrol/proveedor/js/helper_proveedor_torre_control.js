$(document).ready(function () {

  const hoy = new Date();
  const opciones = { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" };

  // Formatear la fecha a "YYYY-MM-DD"
  const fechaColombia = new Intl.DateTimeFormat("es-CO", opciones)
    .format(hoy)
    .split("/")
    .reverse()
    .join("-");

  document.addEventListener("click", async e => {
    if (e.target.matches("#btn_detalle_proceso") || e.target.matches("#btn_detalle_proceso *")) {
      let enlace = e.target.closest("#btn_detalle_proceso");
      let Solicitud = enlace.getAttribute("data-id");
      let Cliente = enlace.getAttribute("data-id2");

      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Destalle Proceso del pedido ` + Solicitud);
      myOffcanvas.updateContent(`
        <table class="table table-sm table-striped" style="font-size:10px;">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">PROCESO</th>
              <th scope="col">TIPO SERVICIO</th>
              <th scope="col">PROVEEDOR</th>
              <th scope="col">FECHA VENCIMIENTO</th>
              <th scope="col">HORA VENCIMIENTO</th>
              <th scope="col">ESTADO GESTION</th>
              <th scope="col">ACCION</th>
            </tr>
          </thead>
          <tbody id="tbody_detalle_proceso"></tbody>
        </table>
      `);

      try {
        let formData = new FormData();
        formData.append("Solicitud", Solicitud);
        formData.append("Solicitud", Solicitud);

        let response = await fetch($('#base_url').val() + 'torrecontrol/detalle_proceso', {
          method: "POST",
          body: formData
        });

        let data = await response.json();
        if (data) {
          let rows = "";
          let estado_actviidad = "";
          let btn_inicio_gestion = "";
          let btn_rechazo_gestion = "";
          let btn_cancelar_gestion = "";
          let btn_postular_servicio = "";

          data.consulta_proveedor.forEach((proveedor, index) => {

            if (proveedor.estado_pedido === "Iniciado") {
              estado_actviidad = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${proveedor.estado_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              btn_inicio_gestion = ``;
              btn_rechazo_gestion = ``;
              btn_cancelar_gestion = `<a class="dropdown-item fw-bold" href="#" id="btn_cancelar_gestion_servicio" data-id="${proveedor.proveedor_id}" data-id2="${proveedor.servicio_id}" data-id3="${proveedor.pedido_id}"><span class="uil-x"></span> Cancelar Servicio</a>`;
              btn_postular_servicio = `<a class="dropdown-item fw-bold" href="#" id="btn_postular_gestion_servicio" data-id="${proveedor.proveedor_id}" data-id2="${proveedor.servicio_id}" data-id3="${proveedor.pedido_id}" data-id4="${proveedor.tipo_servicio}" data-id5="${proveedor.proceso}"><span class="uil-file-check-alt"></span> Postular Servicio</a>`;
            } else if (proveedor.estado_pedido === "Rechazado") {
              estado_actviidad = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${proveedor.estado_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              btn_inicio_gestion = ``;
              btn_rechazo_gestion = ``;
              btn_cancelar_gestion = ``;
              btn_postular_servicio = ``;
            } else if (proveedor.estado_pedido === "Pendiente") {
              estado_actviidad = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${proveedor.estado_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              btn_inicio_gestion = `<a class="dropdown-item fw-bold" href="#" id="btn_iniciar_gestion" data-id="${proveedor.proveedor_id}" data-id2="${proveedor.servicio_id}" data-id3="${proveedor.pedido_id}"><span class="uil-play"></span> Iniciar Gestión</a>`;
              btn_rechazo_gestion = `<a class="dropdown-item fw-bold" href="#" id="btn_rechazar_gestion_servicio" data-id="${proveedor.proveedor_id}" data-id2="${proveedor.servicio_id}" data-id3="${proveedor.pedido_id}"><span class="uil-x"></span> Rechazar Servicio</a>`;
              btn_cancelar_gestion = ``;
              btn_postular_servicio = ``;
            } else if (proveedor.estado_pedido === "Cancelado") {
              estado_actviidad = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${proveedor.estado_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              btn_inicio_gestion = ``;
              btn_rechazo_gestion = ``;
              btn_cancelar_gestion = ``;
              btn_postular_servicio = ``;
            } else if (proveedor.estado_pedido === "Ganador") {
              estado_actviidad = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${proveedor.estado_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              btn_inicio_gestion = ``;
              btn_rechazo_gestion = ``;
              btn_cancelar_gestion = ``;
              btn_postular_servicio = ``;
            } else if (proveedor.estado_pedido === "Postulado") {
              estado_actviidad = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${proveedor.estado_pedido}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              btn_inicio_gestion = ``;
              btn_rechazo_gestion = ``;
              btn_cancelar_gestion = ``;
              btn_postular_servicio = ``;
            } else {
              estado_actviidad = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">Pendiente</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              btn_inicio_gestion = `<a class="dropdown-item fw-bold" href="#" id="btn_iniciar_gestion" data-id="${proveedor.proveedor_id}" data-id2="${proveedor.servicio_id}" data-id3="${proveedor.pedido_id}"><span class="uil-play"></span> Iniciar Gestión</a>`;
              btn_rechazo_gestion = `<a class="dropdown-item fw-bold" href="#" id="btn_rechazar_gestion_servicio" data-id="${proveedor.proveedor_id}" data-id2="${proveedor.servicio_id}" data-id3="${proveedor.pedido_id}"><span class="uil-x"></span> Rechazar Servicio</a>`;
              btn_cancelar_gestion = ``;
              btn_postular_servicio = ``;
            }

            rows += `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${proveedor.proceso}</td>
                  <td>${proveedor.tipo_servicio}</td>
                  <td>${proveedor.razon_social}</td>
                  <td>${proveedor.fecha_vencimiento}</td>
                  <td>${proveedor.hora_vencimiento}</td>
                  <td>${estado_actviidad}</td>
                  <td>
                  <div class="dropdown">
                    <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <span class="uil-list-ui-alt"></span></a>
                    <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink"> 
                      ${btn_inicio_gestion}
                      ${btn_rechazo_gestion}
                      ${btn_cancelar_gestion}
                      ${btn_postular_servicio}
                    </div>
                  </div>
                  </td>
                </tr>
                <tr id="postular_${proveedor.servicio_id}" style="display: none;">
                  <td colspan="8">
                    <div class="lista-servicios"></div>
                  </td>
                </tr>
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

    // 🚀 Evento para listar servicios cuando se haga clic en "Servicios"
    if (e.target.matches("#btn_postular_gestion_servicio") || e.target.matches("#btn_postular_gestion_servicio *")) {
      let enlace = e.target.closest("#btn_postular_gestion_servicio");
      let proveedorId = enlace.getAttribute("data-id");
      let servicioId = enlace.getAttribute("data-id2");
      let pedidoId = enlace.getAttribute("data-id3");
      let tipoServicio = enlace.getAttribute("data-id4");
      let Porceso = enlace.getAttribute("data-id5");
      let filaServicios = document.getElementById(`postular_${servicioId}`);

      // Mostrar u ocultar la fila de servicios
      if (filaServicios.style.display === "none") {
        filaServicios.style.display = "table-row";

        // Obtener servicios si aún no se han cargado
        if (filaServicios.querySelector(".lista-servicios").innerHTML.trim() === "") {

          filaServicios.querySelector(".lista-servicios").innerHTML = `
            <div class="container-fluid pt-3">
              <!-- <div class="d-flex justify-content-center"> -->
              <div class="row">

                <div id="despachos" style="display: none;">
                  <div class="row">
                    <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                      <div class="mb-3">
                        <label style="font-size: 12px;">Placa</label>
                        <input type="text" id="placa" name="placa" class="form-control form-control-sm" placeholder="Placa" oninput="this.value = this.value.toUpperCase();">
                      </div>
                    </div>
                    <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
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
                      <button class="btn btn-phoenix-primary btn-sm text-danger" type="button" id="btn-cancelar">
                        <span class="text-danger" data-feather="x"></span> Cancelar
                      </button>
                    </div>
                    <div class="col-auto">
                      <button class="btn btn-success btn-sm" id="btn_guardar_postulacion" type="button" data-id="${proveedorId}" data-id2="${servicioId}" data-id3="${pedidoId}" data-id4="${tipoServicio}" data-id5="${Porceso}">
                        <span class="uil uil-file-import"></span> Guardar Postulación
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          `;

          /* Validar el tipo de servicio */

          if (tipoServicio === "Despachos") {
            document.getElementById("despachos").style.display = "";
          } else {
            document.getElementById("otros").style.display = "";
          }
        }
      } else {
        filaServicios.style.display = "none";
      }
    }

    if (e.target.matches("#btn_iniciar_gestion") || e.target.matches("#btn_iniciar_gestion *")) {
      let enlace = e.target.closest("#btn_iniciar_gestion");
      let proveedorId = enlace.getAttribute("data-id");
      let servicioId = enlace.getAttribute("data-id2");
      let pedidoId = enlace.getAttribute("data-id3");

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
        const btn = document.querySelector("#btn_iniciar_gestion");

        btn.disabled = true;
        btn.innerHTML = "Iniciado Gestión... ⏳";
        let formData = new FormData();
        formData.append("proveedorId", proveedorId);
        formData.append("servicioId", servicioId);
        formData.append("pedidoId", pedidoId);
        formData.append("estado", 'Iniciado');


        try {
          const response = await fetch($('#base_url').val() + 'torrecontrol/insertar_gestion', {
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
              listar_pedidos_proveedor(fechaColombia, fechaColombia);
            }
          });

        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Error al enviar datos al servidor.", "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = "<span class='uil-play'></span> Iniciar Gestión";
        }

      }
    }

    if (e.target.matches("#btn_rechazar_gestion_servicio") || e.target.matches("#btn_rechazar_gestion_servicio *")) {
      let enlace = e.target.closest("#btn_rechazar_gestion_servicio");
      let proveedorId = enlace.getAttribute("data-id");
      let servicioId = enlace.getAttribute("data-id2");
      let pedidoId = enlace.getAttribute("data-id3");

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
        const btn = document.querySelector("#btn_rechazar_gestion_servicio");

        btn.disabled = true;
        btn.innerHTML = "Iniciado Gestión... ⏳";
        let formData = new FormData();
        formData.append("proveedorId", proveedorId);
        formData.append("servicioId", servicioId);
        formData.append("pedidoId", pedidoId);
        formData.append("estado", 'Rechazado');


        try {
          const response = await fetch($('#base_url').val() + 'torrecontrol/insertar_gestion', {
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
              listar_pedidos_proveedor(fechaColombia, fechaColombia);
            }
          });

        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Error al enviar datos al servidor.", "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = "<span class='uil-play'></span> Iniciar Gestión";
        }

      }
    }

    if (e.target.matches("#btn_cancelar_gestion_servicio") || e.target.matches("#btn_cancelar_gestion_servicio *")) {
      let enlace = e.target.closest("#btn_cancelar_gestion_servicio");
      let proveedorId = enlace.getAttribute("data-id");
      let servicioId = enlace.getAttribute("data-id2");
      let pedidoId = enlace.getAttribute("data-id3");

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
        const btn = document.querySelector("#btn_cancelar_gestion_servicio");

        btn.disabled = true;
        btn.innerHTML = "Iniciado Gestión... ⏳";
        let formData = new FormData();
        formData.append("proveedorId", proveedorId);
        formData.append("servicioId", servicioId);
        formData.append("pedidoId", pedidoId);
        formData.append("estado", 'Cancelado');


        try {
          const response = await fetch($('#base_url').val() + 'torrecontrol/insertar_gestion', {
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
              listar_pedidos_proveedor(fechaColombia, fechaColombia);
            }
          });

        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Error al enviar datos al servidor.", "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = "<span class='uil-play'></span> Iniciar Gestión";
        }

      }
    }

    /* Guardar la posulacion de los pedidos o servicios */
    if (e.target.matches("#btn_guardar_postulacion") || e.target.matches("#btn_guardar_postulacion *")) {
      let enlace = e.target.closest("#btn_guardar_postulacion");
      let proveedorId = enlace.getAttribute("data-id");
      let servicioId = enlace.getAttribute("data-id2");
      let pedidoId = enlace.getAttribute("data-id3");
      let TipoServicio = enlace.getAttribute("data-id4");
      let Porceso = enlace.getAttribute("data-id5");
      let fecha_inicio = document.getElementById("fecha_inicio").value.trim();
      let hora_inicio = document.getElementById("hora_inicio").value.trim();

      let formData = new FormData();
      let errores = [];

      if (TipoServicio === "Despachos") {
        let placa = document.getElementById("placa").value.trim();
        let flete = document.getElementById("flete").value.trim();

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
        formData.append("pedidoId", pedidoId);
        formData.append("placa", placa);
        formData.append("flete", flete);
        formData.append("fecha_inicio", fecha_inicio);
        formData.append("hora_inicio", hora_inicio);
        formData.append("Proceso", Porceso);
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
        formData.append("pedidoId", pedidoId);
        formData.append("costo_servicio", costo_servicio);
        formData.append("fecha_inicio", fecha_inicio);
        formData.append("hora_inicio", hora_inicio);
        formData.append("Proceso", Porceso);
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
                myOffcanvas.hide();
                listar_pedidos_proveedor(fechaColombia, fechaColombia);
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

    /* Iniciar pedido */
    if (e.target.matches("#btn_iniciar_pedido") || e.target.matches("#btn_iniciar_pedido *")) {
      let enlace = e.target.closest("#btn_iniciar_pedido");
      let SolicitudId = enlace.getAttribute("data-id");
      // let PorveedorId = enlace.getAttribute("data-id2");

      const result = await Swal.fire({
        title: "Seguro",
        text: "¿Desea iniciar el pedido " + SolicitudId + "?",
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
        const btn = document.querySelector("#btn_iniciar_pedido");

        btn.disabled = true;
        btn.innerHTML = "Iniciando Pedido... ⏳";

        let formData = new FormData();
        formData.append("SolicitudId", SolicitudId);
        // formData.append("PorveedorId", PorveedorId);

        try {
          const response = await fetch($('#base_url').val() + 'torrecontrol/iniciar_pedido', {
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
              listar_pedidos_proveedor(fechaColombia, fechaColombia);
            }
          });

        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Error al enviar datos al servidor.", "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = "<span class='uil uil-play'></span> Inicar Pedido";
        }
      }


    }
  });

  document.addEventListener("change", async (e) => {
    // e.preventDefault();
    if (e.target.matches("#costo_servicio") || e.target.matches("#costo_servicio *")) {
      let costo_servicio = document.getElementById("costo_servicio").value.trim();
      $('#costo_servicio').val(parseFloat(costo_servicio, 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
    }

    if (e.target.matches("#flete") || e.target.matches("#flete *")) {
      let flete = document.getElementById("flete").value.trim();
      $('#flete').val(parseFloat(flete, 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
    }
  });
});
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
        aria-labelledby="${this.settings.id}-label" style="width: 800px;">
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