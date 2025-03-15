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

          data.consulta_cliente.forEach((proveedor, index) => {

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