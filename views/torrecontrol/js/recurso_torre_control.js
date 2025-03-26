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

  listar_recursos_administrador(fechaColombia, fechaColombia);


  document.addEventListener("click", async (e) => {
    if (e.target.matches("#btn_detalle_proceso_servicio") || e.target.matches("#btn_detalle_proceso_servicio *")) {
      let Enlace = e.target.closest("#btn_detalle_proceso_servicio");
      let MaestroId = Enlace.getAttribute("data-id");
      let ClienteId = Enlace.getAttribute("data-id2");
      let Proceso = Enlace.getAttribute("data-proceso");
      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Detalle de solicitud de servicio N°` + MaestroId);
      myOffcanvas.updateContent(`
      
          <div class="col-12">
            <div class="row">
              <table class="table table-sm text-center" style="font-size: 12px;">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Recurso</th>
                    <th scope="col">Ref.Pedido</th>
                    <th scope="col">Cod.Producto</th>
                    <th scope="col">Producto</th>
                    <th scope="col">Peso Bruto</th>
                    <th scope="col">Empaque</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Origen</th>
                    <th scope="col">Destino</th>
                    <th scope="col">Fecha Cargue</th>
                    <th scope="col">Fecha Descargue</th>
                  </tr>
                </thead>
                <tbody id="tbody_servicios_pedidos_recurso" class="text-center">
                  <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
      `);

      try {
        let formData = new FormData();
        formData.append("MaestroId", MaestroId);

        let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_recursos', {
          method: "POST",
          body: formData
        });

        let data = await response.json();
        if (data) {
          let rows = "";
          data.forEach((servicio, index) => {
            rows += `
                <tr>
                  <!--<th scope="row">${index + 1}</th>-->
                  <th scope="row">${servicio.numdoc_solicitud}</th>
                  <td>
                    <div class="dropdown">
                      <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${servicio.maestro_id}</a>
                      <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
                        <a class="dropdown-item fw-bold" href="#" id="btn_proceso_servicios_recurso" data-recurso="${servicio.maestro_id}" data-numdoc_solicitud="${servicio.numdoc_solicitud}"><span class="uil uil-transaction"></span> Detalle proceso recurso</a>
                        <!--<a class="dropdown-item fw-bold" href="#" id="btn_observacion_solicitud_servicio" ><span class="uil-wrap-text"></span> Detalle solicitud servicio</a>
                        <div class="dropdown-divider"></div> 
                        <a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#"> <span class="uil uil-bell"></span> Marcar como Prioridad</a>
                      </div>-->
                    </div>
                  </td>
                  <td>${servicio.referencia_pedido}</td>
                  <td>${servicio.cod_producto}</td>
                  <td>${servicio.producto}</td>
                  <td>${servicio.peso_bruto_kg}</td>
                  <td>${servicio.presentacion}</td>
                  <td>${servicio.unidades}</td>
                  <td>${servicio.ciudad_origen}</td>
                  <td>${servicio.ciudad_destino}</td>
                  <td>${servicio.fecha_cargue}</td>
                  <td>${servicio.fecha_entrega}</td>
                  <!--<td><div class="form-check form-switch"><input class="form-check-input me-2" type="checkbox" name="ProveedorServicio" data-clienId="${servicio.cliente_id}" id="servicio_${servicio.servicio_id}" value="${servicio.servicio_id}"></div></td>-->
                </tr>
                <tr id="Recurso_proveedores_${servicio.numdoc_solicitud}" style="display: none;">
                  <td colspan="12">
                    <div class="lista-proceso-proveedores"></div>
                  </td>
                </tr>
              `;
          });

          document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = rows;
        } else {
          document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
        }
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
      }

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
  });

}

async function listar_recursos_administrador(fecha_inicial, fecha_final) {
  /* Funcion para enviar los datos */
  let dato = new FormData();
  dato.append('fecha_inicial', fecha_inicial);
  dato.append('fecha_final', fecha_final);
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

        const columnaNundocSolicitud = document.createElement('td');
        columnaNundocSolicitud.innerHTML = `
        <div class="dropdown">
          <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.maestro_id}</a>
          <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
            <a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>
            <!--<a class="dropdown-item fw-bold" href="#" id="btn_observacion_solicitud_servicio"  data-id="${element.observaciones}" data-id2="${element.maestro_id}" data-id3="${element.sitio_cargue}" data-id4="${element.sitio_descargue}" data-id5="${element.referencia}"><span class="uil-wrap-text"></span> Detalle solicitud servicio</a>
           ${btn_removeAsignacion}
            <div class="dropdown-divider"></div> 
            ${btn_cancelacion}
            <a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.maestro_id}" data-id2="${element.cliente}"> <span class="uil uil-bell"></span> Marcar como Prioridad</a>-->
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
        columnaEstado.innerHTML = element.estado;
        columnaEstado.style.width = 'auto';
        columnaEstado.style.whiteSpace = 'nowrap';

        fila.appendChild(columnaNundocSolicitud);
        fila.appendChild(columnaCliente);
        fila.appendChild(columnaProceso);
        fila.appendChild(columnaFecha);
        fila.appendChild(columnaUsuario);
        fila.appendChild(columnaEstado);
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