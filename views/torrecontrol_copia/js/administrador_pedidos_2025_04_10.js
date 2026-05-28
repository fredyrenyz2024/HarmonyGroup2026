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

  listar_pedidos_administrador(fechaColombia, fechaColombia);

  document.addEventListener("click", async (e) => {
    /* Boton para buscar por fechas */
    if (e.target.matches(`#campo-${window.VENTANA}-buscar`) || e.target.matches(`#campo-${window.VENTANA}-buscar *`)) {
      let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
      let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
      listar_pedidos_administrador(fecha_inicial, fecha_final);
    }

    if (e.target.matches(`#campo-${window.VENTANA}-carrito`) || e.target.matches(`#campo-${window.VENTANA}-carrito *`)) {
      let clienId = document.getElementById(`campo-${window.VENTANA}-carrito`).getAttribute("data-idCliente");
      let pedidoId = document.getElementById(`campo-${window.VENTANA}-carrito`).getAttribute("data-idPedido");
      let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

      if (carrito.length === 0) {
        myOffcanvas.updateContent(`<p class="text-center text-muted">No hay pedidos en el carrito.</p>`);
      } else {
        let tablaHTML = `
              <table class="table table-striped table-sm" data-page-length='100' style="font-size:11px;">
                  <thead>
                      <tr>
                          <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>#</th>
                          <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>N° Pedido</th>
                          <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Cliente</th>
                          <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Producto</th>
                          <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Unidades</th>
                          <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Prestación</th>
                          <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Acción</th>
                      </tr>
                  </thead>
                  <tbody>`;

        carrito.forEach((item, index) => {
          tablaHTML += `
                  <tr>
                      <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${index + 1}</td>
                      <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${item.dataId4}</td>
                      <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${item.dataId || '-'}</td>
                      <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${item.dataId12 || '-'}</td>
                      <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${item.dataId7 || '-'}</td>
                      <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${item.dataId13 || '-'}</td>
                      <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${item.dataId11 || '-'} KG</td>
                  </tr>`;
        });

        tablaHTML += `
          </tbody>
        </table>
          <div class="d-flex align-items-center justify-content-between">
              <h5 id="titulo_opcion" class="mb-0 me-2 d-flex align-items-center justify-content-center">Título</h5>
              <div id="acciones_asignacion"></div>
          </div>
          <hr class="my-1 text-dark">
          <div class="container" id="contenido_opcion"></div>
        `;

        myOffcanvas.updateTitle(`
          <div class="d-flex align-items-center justify-content-between">
            <span class="text-primary-emphasis uil uil-file-alt"></span> Listado de Pedidos 
            <div class="dropdown ms-2">
              <a class="btn btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink"  href="#"  role="button" data-bs-toggle="dropdown"  aria-haspopup="true"  aria-expanded="false">Opciones</a>
              <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
                <a class="dropdown-item fw-bold" href="#" id="btn_asignar_proveedor" data-id="${pedidoId}" data-id2="${clienId}" data-title="Asignar Proveedor"><span class="uil uil-file-search-alt"></span> Asignar Proveedor</a>
                <a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido"   data-id="${pedidoId}" data-id2="${clienId}" data-title="Publicar Pedidos"><span class="uil uil-feedback"></span> Publicar Pedido</a>
                <!--<a class="dropdown-item" href="#">Something else here</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Separated link</a>
              </div>-->
            </div>
          </div>
        `);

        myOffcanvas.updateContent(tablaHTML);
      }

      myOffcanvas.show();
    }

    if (e.target.matches("#btn_detalle_trazabilidad_pedido") || e.target.matches("#btn_detalle_trazabilidad_pedido *")) {
      let Enlace = e.target.closest("#btn_detalle_trazabilidad_pedido");
      let PedidoId = Enlace.getAttribute("data-id");

      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Trazabilidad pedido`);
      myOffcanvas.updateContent(`
          <div class="table-responsive scrollbar">
            <table class="table table-sm text-center" style="font-size: 11px;">
              <thead>
                <tr>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>#</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Tipo Trazabilidad</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Observación</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Usuario</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Fecha</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Soporte</th>
                </tr>
              </thead>
              <tbody id="tbody_detalle_trazabilidad_pedido" class="text-center">
                <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
              </tbody>
            </table>
          </div>
      `);

      try {
        let formData = new FormData();
        formData.append("PedidoId", PedidoId);

        let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_trazabilidad_pedido', {
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
                 <!--<td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.referencia}</td>-->
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.tipo_trazabilidad}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.observacion}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.usuario}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.fecha_registro}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>
                      <a href="${$('#base_url').val()}${servicio.evidencia}" target="_blank" class="btn btn-outline-primary btn-sm me-1 px-1 py-0">
                        <i class="uil-file-download-alt"></i> Ver Documento
                      </a>
                  </td>
                </tr>
                <!--<tr id="Recurso_proveedores_${servicio.referencia}" style="display: none;">
                  <td colspan="12">
                    <div class="lista-proceso-proveedores"></div>
                  </td>
                </tr>
                <tr id="trazabilidad_pedidos_recurso_${servicio.referencia}" style="display: none;">
                  <td colspan="12">
                    <div class="trazabilidad-pedidos"></div>
                  </td>
                </tr>-->
              `;
          });

          document.getElementById("tbody_detalle_trazabilidad_pedido").innerHTML = rows;
        } else {
          document.getElementById("tbody_detalle_trazabilidad_pedido").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
        }
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        document.getElementById("tbody_detalle_trazabilidad_pedido").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
      }
      myOffcanvas.show();

    }
  });
}

async function listar_pedidos_administrador(fecha_inicial, fecha_final) {
  /* Funcion para enviar los datos */
  let dato = new FormData();
  dato.append('fecha_inicial', fecha_inicial);
  dato.append('fecha_final', fecha_final);
  try {
    const response = await fetch($('#base_url').val() + 'torrecontrol/listar_administracion_pedidos', {
      method: 'POST',
      body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tbl_administrar_pedidos');
      tbody.innerHTML = '';
      let esatdo_autorizado = '';
      let col_estatus_publicacion = '';
      let col_estatus_asignacion = '';
      let btn_Asignacion = "";
      let btn_publicacion = "";
      let btn_cancelacion = "";
      let col_prioridad = "";
      let btn_removeAsignacion = "";
      let checkbox_carrito = "";

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
        } else if (element.estado_publicaion === 'Completado') {
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado_publicaion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
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
        } else if (element.estado_asignacion === 'Completado') {
          col_estatus_asignacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado_asignacion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        }

        if (element.estado_prioridad === 'Prioritaria') {
          col_prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${element.estado_prioridad}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_prioridad === 'No Marcada') {
          col_prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_prioridad}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        }

        /* Validar la asignación del pedido */
        if (element.estado_publicaion === "Publicado" && element.estado_asignacion === "Asignado") {
          btn_cancelacion = "";
          btn_removeAsignacion = `<a class="dropdown-item fw-bold" href="#" id="btn_cacnelar_asignacion" data-id="${element.numdoc_solicitud}"><span class="uil-wrap-text"></span> Cancelar Asignación de pedido</a>`;
          checkbox_carrito = ``;
        }
        /* Validar publicación del pedido */
        else if (element.estado_publicaion === "Publicado" && element.estado_asignacion === "Pendiente") {
          btn_cancelacion = "";
          btn_removeAsignacion = ``;
          checkbox_carrito = ``;
          btn_removeAsignacion = `<a class="dropdown-item fw-bold" href="#" id="btn_cacnelar_asignacion" data-id="${element.numdoc_solicitud}"><span class="uil-wrap-text"></span> Cancelar Publicación del pedido</a>`;
        }
        /* Validar si el pedido ya tuvo una publicación */
        else if (element.estado_publicaion === "Pendiente Respuesta" && element.estado_asignacion === "Pendiente") {
          btn_cancelacion = "";
          btn_removeAsignacion = ``;
          checkbox_carrito = ``;
        } else if (element.estado_publicaion === "Aceptado" && element.estado_asignacion === "Ganador") {
          btn_cancelacion = "";
          btn_removeAsignacion = ``;
          checkbox_carrito = ``;
        } else if (element.estado_publicaion === "Completado" && element.estado_asignacion === "Completado") {
          btn_cancelacion = "";
          btn_removeAsignacion = ``;
          checkbox_carrito = ``;
        }
        /* Si no se cumplen las condiciones anteriores, mostrar los botones */
        else {
          //btn_publicacion = `<a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-feedback"></span> Publicar Pedido</a>`;
          //btn_Asignacion = `<a class="dropdown-item fw-bold" href="#" id="btn_asignar_proveedor" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-file-search-alt"></span> Asignar Proveedor</a>`;
          btn_cancelacion = `<a class="dropdown-item fw-bold" href="#" id="btn_cancelar_pedido" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-x"></span>  Cancelar Pedido</a>`;
          checkbox_carrito = `<input class="form-check-input pedido-checkbox" id="check_pedido_${element.numdoc_solicitud}" type="checkbox" value="${element.numdoc_solicitud}" 
        data-id="${element.nombre_cliente}" data-id2="${element.ciudad_origen}" data-id3="${element.ciudad_destino}" data-id4="${element.referencia_pedido}"data-id5="${element.fecha_cargue}"
        data-id6="${element.fecha_entrega}" data-id7="${element.unidades}" data-id8="${element.lote}" data-id9="${element.num_estibas}" data-id10="${element.peso_neto_kg}" data-id11="${element.peso_bruto_kg}" 
        data-id12="${element.producto}" data-id13="${element.presentacion}" data-id14="${element.cliente}" style="scale: 1.2;" data-row="fila_${element.numdoc_solicitud}">`;
          btn_removeAsignacion = ``;
        }

        const columnaNundocSolicitud = document.createElement('td');
        /*         columnaNundocSolicitud.innerHTML = `
                <div class="dropdown">
                  <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.numdoc_solicitud}</a>
                  <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
                    <a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>
                    <!--<a class="dropdown-item fw-bold" href="#" id="btn_observacion_solicitud_servicio"  data-id="${element.observaciones}" data-id2="${element.numdoc_solicitud}" data-id3="${element.sitio_cargue}" data-id4="${element.sitio_descargue}" data-id5="${element.referencia}"><span class="uil-wrap-text"></span> Detalle solicitud servicio</a>-->
                   ${btn_removeAsignacion}
                    <div class="dropdown-divider"></div> 
                    ${btn_cancelacion}
                    <a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"> <span class="uil uil-bell"></span> Marcar como Prioridad</a>
                  </div>
                </div>
                `; */

        columnaNundocSolicitud.innerHTML = `
        <div class="dropdown">
          <!--<a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.numdoc_solicitud}</a>-->
          <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.referencia_pedido}</a>
          <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
            <a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>
           ${btn_removeAsignacion}
            <div class="dropdown-divider"></div> 
             <a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad_pedido" data-id="${element.numdoc_solicitud}"><span class="uil-wrap-text"></span> Trazabilidad pedido</a>
            ${btn_cancelacion}
            <a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"> <span class="uil uil-bell"></span> Marcar como Prioridad</a>
          </div>
        </div>
        `;

        const columnaCheckPedido = document.createElement('td');
        columnaCheckPedido.innerHTML = checkbox_carrito;
        columnaCheckPedido.style.width = 'auto';
        columnaCheckPedido.style.whiteSpace = 'nowrap';
        columnaCheckPedido.style.textAlign = 'center';

        const columnaCliente = document.createElement('td');
        columnaCliente.innerHTML = element.nombre_cliente;
        columnaCliente.style.width = 'auto';
        columnaCliente.style.whiteSpace = 'nowrap';
        const columnaCiudadOrigen = document.createElement('td');
        columnaCiudadOrigen.innerHTML = element.ciudad_origen;
        columnaCiudadOrigen.style.width = 'auto';
        columnaCiudadOrigen.style.whiteSpace = 'nowrap';

        /*         const columnaReferencia = document.createElement('td');
                columnaReferencia.innerHTML = element.referencia_pedido; */

        const columnaRemitente = document.createElement('td');
        columnaRemitente.innerHTML = element.remitente;
        columnaRemitente.style.width = 'auto';
        columnaRemitente.style.whiteSpace = 'nowrap';
        const columnaCiudadDestino = document.createElement('td');
        columnaCiudadDestino.innerHTML = element.ciudad_destino;
        columnaCiudadDestino.style.width = 'auto';
        columnaCiudadDestino.style.whiteSpace = 'nowrap';
        const columnaSitioDescargue = document.createElement('td');

        columnaSitioDescargue.innerHTML = element.destinatario;
        const columnaCodigoProducto = document.createElement('td');
        columnaCodigoProducto.innerHTML = element.cod_producto;
        columnaSitioDescargue.style.width = 'auto';
        columnaSitioDescargue.style.whiteSpace = 'nowrap';

        const columnaProducto = document.createElement('td');
        columnaProducto.innerHTML = element.producto;
        columnaProducto.style.width = 'auto';
        columnaProducto.style.whiteSpace = 'nowrap';

        const columnaPesoNeto = document.createElement('td');
        columnaPesoNeto.innerHTML = element.peso_neto_kg + " KG";
        columnaPesoNeto.style.width = 'auto';
        columnaPesoNeto.style.whiteSpace = 'nowrap';
        const columnaPesoBruto = document.createElement('td');
        columnaPesoBruto.innerHTML = element.peso_bruto_kg + " KG";
        columnaPesoBruto.style.width = 'auto';
        columnaPesoBruto.style.whiteSpace = 'nowrap';

        const columnaPresentacion = document.createElement('td');
        columnaPresentacion.innerHTML = element.presentacion;
        columnaPresentacion.style.width = 'auto';
        columnaPresentacion.style.whiteSpace = 'nowrap';
        // const columnaNum_Cotizacion = document.createElement('td');
        // columnaNum_Cotizacion.innerHTML = `<a href="#" id="btn_ver_solicitud_Prioritaria" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}" data-id3="${id}" class="text-decoration-none"> N°${element.nundoc_solicitud}</a> `;
        const columnaUnidades = document.createElement('td');
        columnaUnidades.innerHTML = element.unidades;
        columnaUnidades.style.width = 'auto';
        columnaUnidades.style.whiteSpace = 'nowrap';

        const columnaLote = document.createElement('td');
        columnaLote.innerHTML = element.lote;
        columnaLote.style.width = 'auto';
        columnaLote.style.whiteSpace = 'nowrap';

        const columnaEstibas = document.createElement('td');
        columnaEstibas.innerHTML = element.num_estibas;
        columnaEstibas.style.width = 'auto';
        columnaEstibas.style.whiteSpace = 'nowrap';

        const columnaFechaCargue = document.createElement('td');
        columnaFechaCargue.innerHTML = element.fecha_cargue;
        columnaFechaCargue.style.width = 'auto';
        columnaFechaCargue.style.whiteSpace = 'nowrap';

        const columnaFechaEntrega = document.createElement('td');
        columnaFechaEntrega.innerHTML = element.fecha_entrega;
        columnaFechaEntrega.style.width = 'auto';
        columnaFechaEntrega.style.whiteSpace = 'nowrap';


        const columnaEstadoPublicacion = document.createElement('td');
        columnaEstadoPublicacion.innerHTML = col_estatus_publicacion;
        columnaEstadoPublicacion.style.width = 'auto';
        columnaEstadoPublicacion.style.whiteSpace = 'nowrap';

        const columnaEstadoAsignacion = document.createElement('td');
        columnaEstadoAsignacion.innerHTML = col_estatus_asignacion;
        columnaEstadoAsignacion.style.width = 'auto';
        columnaEstadoAsignacion.style.whiteSpace = 'nowrap';

        const columnaPriordad = document.createElement('td');
        columnaPriordad.innerHTML = col_prioridad;

        fila.appendChild(columnaCheckPedido);
        fila.appendChild(columnaNundocSolicitud);
        // fila.appendChild(columnaReferencia);
        fila.appendChild(columnaCliente);
        fila.appendChild(columnaCiudadOrigen);
        fila.appendChild(columnaRemitente);
        fila.appendChild(columnaCiudadDestino);
        fila.appendChild(columnaSitioDescargue);
        fila.appendChild(columnaCodigoProducto);
        fila.appendChild(columnaProducto);
        fila.appendChild(columnaPesoNeto);
        fila.appendChild(columnaPesoBruto);
        fila.appendChild(columnaPresentacion);
        fila.appendChild(columnaUnidades);
        fila.appendChild(columnaLote);
        fila.appendChild(columnaEstibas);
        fila.appendChild(columnaFechaCargue);
        fila.appendChild(columnaFechaEntrega);
        fila.appendChild(columnaPriordad);
        fila.appendChild(columnaEstadoPublicacion);
        fila.appendChild(columnaEstadoAsignacion);
        fila.id = `fila_${element.numdoc_solicitud}`;

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
