window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global

  if (!window.myOffcanvas) {
    window.myOffcanvas = new DynamicOffcanvas({
      id: `customOffcanvas${id}`,
      title: '<span class="text-dark uil uil-car"></span> Titulo General',
      content: '<p>Contenido inicial</p>',
      scroll: true,
      backdrop: false
    });
  } else {
    console.log('El offcanvas ya esta creado.');
  }

  Listar_proveedores();

  document.addEventListener("click", async (e) => {
    if (e.target.id === "btn_ver_proveedores_asignados" || e.target.id === "btn_ver_proveedores_asignados *") {
      let enlace = e.target.closest("#btn_ver_proveedores_asignados");
      let ServicioId = enlace.getAttribute("data-id");
      let NombreServicio = enlace.getAttribute("data-id2");
      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Listado de los proveedores asignados al servicio ` + NombreServicio);

      myOffcanvas.updateContent(`
        <div class="table-responsive scrollbar">
          <table class="table table-sm table-striped" style="font-size:10px;">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Proveedor</th>
                <th scope="col">Correo</th>
                <th scope="col">Telefono</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody id="tbl_listar_proveedores_asignados_torre_control"></tbody>
          </table>
      </div>
      `);

      try {
        let formData = new FormData();
        formData.append("ServicioId", ServicioId);

        let response = await fetch($('#base_url').val() + 'parametros/listar_proveedores_asignados', {
          method: "POST",
          body: formData
        });

        let data = await response.json();
        if (data) {
          let rows = "";
          let estado_aasignacion_servicio = "";

          data.forEach((proveedor, index) => {
            if (proveedor.estado_asignacion_servicio === "Activo") {
              estado_aasignacion_servicio = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${proveedor.estado_asignacion_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (proveedor.estado_asignacion_servicio === "Inactivo") {
              estado_aasignacion_servicio = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${proveedor.estado_asignacion_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
            }

            rows += `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${proveedor.razon_social}</td>
                  <td>${proveedor.correo}</td>
                  <td>${proveedor.telefono}</td>
                  <td>${estado_aasignacion_servicio}</td>
                </tr>
              `;
          });

          document.getElementById("tbl_listar_proveedores_asignados_torre_control").innerHTML = rows;
        } else {
          document.getElementById("tbl_listar_proveedores_asignados_torre_control").innerHTML = `<tr><td colspan="4" class="text-center text-danger">${data.message}</td></tr>`;
        }
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        document.getElementById("tbl_listar_proveedores_asignados_torre_control").innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar proveedores</td></tr>`;
      }

      window.myOffcanvas.show();
    }
  });
}

async function Listar_proveedores() {
  try {
    const response = await fetch($('#base_url').val() + 'parametros/listar_servicios_torre_control', {
      method: 'POST',
      // body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tbl_listar_servicios_torre_control');
      tbody.innerHTML = '';
      let col_estatus_publicacion = '';

      data.forEach(element => {
        const fila = document.createElement('tr');

        if (element.esatdo_servicio === 'Activo') {
          col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.esatdo_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.esatdo_servicio === 'Inactivo') {
          col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.esatdo_servicio}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        }

        const columnaDocumentoProveedor = document.createElement('td');
        // columnaDocumentoProveedor.innerHTML = element.documento_proveedor;
        columnaDocumentoProveedor.innerHTML = `
        <div class="dropdown">
          <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.id}</a>
          <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
            <a class="dropdown-item fw-bold" href="#" id="btn_ver_proveedores_asignados" data-id="${element.id}" data-id2="${element.tipo_servicio}" ><span class="uil uil-transaction"></span> Proveedores Asignados</a>
          </div>
        </div>
        `;

        const columnaContactoProveedor = document.createElement('td');
        columnaContactoProveedor.innerHTML = element.tipo_servicio;
        const columnaNumeroContactoProveedor = document.createElement('td');
        columnaNumeroContactoProveedor.innerHTML = element.descripcion;
        const columnaEsatdoProveedor = document.createElement('td');
        columnaEsatdoProveedor.innerHTML = col_estatus_publicacion;


        fila.appendChild(columnaDocumentoProveedor);
        fila.appendChild(columnaContactoProveedor);
        fila.appendChild(columnaNumeroContactoProveedor);
        fila.appendChild(columnaEsatdoProveedor);
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