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
      let ClienteId = Enlace.getAttribute("data-clienteId");
      let Proceso = Enlace.getAttribute("data-proceso");
      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Detalle de solicitud de servicio N°` + MaestroId);
      myOffcanvas.updateContent(`
          <div class="col-12">
            <div class="row">
              <div class="container d-flex justify-content-center align-items-center">
                <div class="row text-black fw-bold text-center d-flex flex-wrap">
                  <div class="col-auto mx-3">Peso Neto total: <span class="badge badge-phoenix badge-phoenix-primary" id="pesoNeto">0</span></div>
                  <div class="col-auto mx-3">Peso Bruto total: <span class="badge badge-phoenix badge-phoenix-primary" id="pesoBruto">0</span></div>
                  <div class="col-auto mx-3">Total Unidades: <span class="badge badge-phoenix badge-phoenix-primary" id="totalUnidades">0</span></div>
                </div>
              </div>
              <hr class="my-1 text-dark">
              <h6 class="mb-0 text-body-highlight me-2">Pedidos</h6>
              <hr class="my-1 text-dark">
              <div class="table-responsive scrollbar">
                <table class="table table-sm text-center" style="font-size: 12px;">
                  <thead>
                    <tr>
                      <th scope="col" scope="col" style='color:black;width: auto; white-space: nowrap;'>#</th>
                      <!--<th scope="col" scope="col" style='color:black;width: auto; white-space: nowrap;'>Recurso</th>-->
                      <th scope="col" scope="col" style='color:black;width: auto; white-space: nowrap;'>Ref.Pedido</th>
                      <th scope="col" scope="col" style='color:black;width: auto; white-space: nowrap;'>Cod.Producto</th>
                      <th scope="col" scope="col" style='color:black;width: auto; white-space: nowrap;'>Producto</th>
                      <th scope="col" scope="col" style='color:black;width: auto; white-space: nowrap;'>Peso Bruto</th>
                      <th scope="col" scope="col" style='color:black;width: auto; white-space: nowrap;'>Empaque</th>
                      <th scope="col" scope="col" style='color:black;width: auto; white-space: nowrap;'>Cantidad</th>
                      <th scope="col" scope="col" style='color:black;width: auto; white-space: nowrap;'>Origen</th>
                      <th scope="col" scope="col" style='color:black;width: auto; white-space: nowrap;'>Destino</th>
                      <th scope="col" scope="col" style='color:black;width: auto; white-space: nowrap;'>Fecha Cargue</th>
                      <th scope="col" scope="col" style='color:black;width: auto; white-space: nowrap;'>Fecha Descargue</th>
                    </tr>
                  </thead>
                  <tbody id="tbody_servicios_pedidos_recurso" class="text-center">
                    <tr>
                      <td colspan="12" class="text-center">Cargando servicios...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="accordion" id="accordionExample"></div>

            <hr class="my-1 text-dark">
               <div class="d-flex align-items-center justify-content-between">
                <h6 class="mb-0 me-2 d-flex align-items-center justify-content-center">Subasta</h6>
                  <div class="col-5">
                    <div class="row justify-content-end">
                      <div class="col-auto">
                        <select class="form-select form-select-sm" aria-label=".form-select-sm example" id="slct_criterio" name="slct_criterio" style="width: 100%;display: none;">
                          <option selected="" value="">Seleccione Criterio</option>
                          <option value="Fecha_inicio_servicio">Fecha Inicio de servicio</option>
                          <option value="Valor_servicio">Valor de servicio</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="col-5">
                    <div class="row justify-content-end">
                      <div class="col-auto">
                        <button class="btn btn-success btn-sm py-1" id="btn_subastar_recurso" type="button" style="display: none;"> 
                          <span class="uil uil-play-circle"></span> Subastar Servicios
                        </button>
                        <button class="btn btn-success btn-sm py-1" id="btn_asignar_recurso" type="button" style="display: none;"> 
                          <span class="uil uil-play-circle"></span> Asignar Servicios
                        </button>
                      </div>
                    </div>
                  </div>
               </div>
            <hr class="my-1 text-dark">

          <h5>RESULTADOS DE LA SUBASTA</h5>

            <table class="table table-sm" style="font-size:10px;">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">SERVICIO</th>
                    <th scope="col">VALOR SERVICIO</th>
                    <th scope="col">PROVEEDOR</th>
                    <th scope="col">FECHA REGISTRO</th>
                    <th scope="col">FECHA INICIO</th>
                  </tr>
                </thead>
                <tbody id="tbody_subasta_resultados"></tbody>
              </table>
          </div>
      `);

      Listar_pedidos_recursos(MaestroId, window.VENTANA, Proceso, ClienteId);

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
      let esatdo_recurso = '';
      let btn_cancelacion = "";
      let btn_removeAsignacion = "";

      data.forEach(element => {
        const fila = document.createElement('tr');


        if (element.estado === 'Activo') {
          esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado === 'Inactivo') {
          esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${element.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado === 'Cancelado') {
          esatdo_recurso = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        }

        const columnaNundocSolicitud = document.createElement('td');
        columnaNundocSolicitud.innerHTML = `
        <div class="dropdown">
          <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.maestro_id}</a>
          <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
            <a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.proceso}" data-id="${element.maestro_id}" data-clienteId="${element.clienteId}"><span class="uil uil-transaction"></span> Detalle Proceso</a>
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
        columnaEstado.innerHTML = esatdo_recurso;
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

async function Listar_pedidos_recursos(MaestroId, VentanaId, Proceso, ClienteId) {
  try {
    let formData = new FormData();
    formData.append("MaestroId", MaestroId);
    formData.append("VentanaId", VentanaId);

    let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_recursos', {
      method: "POST",
      body: formData
    });

    let data = await response.json();
    if (data) {
      let miArray = [];
      let ArrayRefPedidos = [];

      let rows = "";
      let totalPesoNeto = 0;
      let totalPesoBruto = 0;
      let totalUnidades = 0;
      let col_estatus_publicacion = '';

      data.sql.forEach((servicio, index) => {
        $('#pesoNeto').text('');
        $('#pesoBruto').text('');
        $('#totalUnidades').text('');

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
        ArrayRefPedidos.push(servicio.referencia_pedido);
        rows += `
            <tr>
              <th scope="row" class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.numdoc_solicitud}</th>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.referencia_pedido}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.cod_producto}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.producto}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.peso_bruto_kg}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.presentacion}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.unidades}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.ciudad_origen}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.ciudad_destino}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.fecha_cargue}</td>
              <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.fecha_entrega}</td>
            </tr>
            <tr id="Recurso_proveedores_${servicio.numdoc_solicitud}" style="display: none;">
              <td colspan="12">
                <div class="lista-proceso-proveedores"></div>
              </td>
            </tr>
          `;
      });
      document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = rows;
      Listar_servicios_por_proveedor(MaestroId, VentanaId, Proceso, miArray, ClienteId, ArrayRefPedidos);

      /* LLenar tabla de subasta */
      if (data.resultados.length > 0) {
        let rows_Subasta = "";
        data.resultados.forEach((proveedor, index) => {
          rows_Subasta += `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${proveedor.tipo_servicio}</td>
                  <td>${proveedor.valor_ganador}</td>
                  <td>${proveedor.razon_social}</td>
                  <td>${proveedor.Fecha_registro}</td>
                  <td>${proveedor.Fecha_Inicio}</td>
                </tr>
                <tr id="servicios_${proveedor.servicio_id}" style="display: none;">
                  <td colspan="4">
                    <div class="lista-servicios"></div>
                  </td>
                </tr>
              `;
        });
        document.getElementById("tbody_subasta_resultados").innerHTML = rows_Subasta;
      } else {
        document.getElementById("tbody_subasta_resultados").innerHTML = `<tr><td colspan="8" class="text-center text-danger">${data.message}</td></tr>`;
      }

    } else {
      document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
    }
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    document.getElementById("tbody_servicios_pedidos_recurso").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
  }
}

async function Listar_servicios_por_proveedor(MaestroId, VentanaId, Proceso, miArray, ClienteId, ArrayRefPedidos) {
  try {
    let formData = new FormData();
    formData.append("RecursoId", MaestroId);
    formData.append("VentanaId", VentanaId);

    let response = await fetch($('#base_url').val() + 'torrecontrol/listar_servicios_recursos_proveedor', {
      method: "POST",
      body: formData
    });

    let data = await response.json();
    if (data) {
      // Agrupar por razon_social (proveedor)
      const groupedByProvider = data.reduce((acc, current) => {
        const key = current.razon_social;

        if (!acc[key]) {
          acc[key] = {
            proveedor: current.razon_social,
            servicios: []
          };
        }

        acc[key].servicios.push({
          tipo_servicio: current.tipo_servicio,
          vehiculo: current.vehiculo,
          estado: current.estado_servicio,
          servicioId: current.servicioId,
          fecha_registro: current.Fecha_registro,
          fecha_limite: current.fecha_limite,
          ProveedorId: current.ProveedorId,
          Valor_Servicio: current.Valor_Servicio,
          Fecha_Inicio: current.Fecha_Inicio,
          Fecha_Actualizacion: current.Fecha_Actualizacion,
          Placa: current.Placa,
        });

        return acc;
      }, {});

      // Convertir a array
      const result = Object.values(groupedByProvider);

      const accordionContainer = document.getElementById('accordionExample');
      result.forEach((proveedor, index) => {
        const accordionItem = document.createElement('div');
        accordionItem.className = `accordion-item${index === 0 ? ' border-top' : ''}`;

        // Obtener los servicios postulados
        const serviciosPostulados = proveedor.servicios.filter(servicio => servicio.estado === 'Postulado');

        // Obtener solo los IDs de los servicios postulados
        const arrayServicios = serviciosPostulados.map(servicio => servicio.servicioId);
        const arrayProveedores = serviciosPostulados.map(servicio => servicio.ProveedorId);
        const arrayValoresServicio = serviciosPostulados.map(servicio => servicio.Valor_Servicio);
        const arrayFechaInicio = serviciosPostulados.map(servicio => servicio.Fecha_Inicio);
        const arrayFechaActualizacion = serviciosPostulados.map(servicio => servicio.Fecha_Actualizacion);
        const arrayPlaca = serviciosPostulados.map(servicio => servicio.Placa);

        // Mostrar el botón si hay al menos un servicio postulado
        if (arrayServicios.length > 0) {
          if (Proceso === 'Asignación') {
            document.getElementById('btn_asignar_recurso').style.display = '';
            document.getElementById('btn_asignar_recurso').setAttribute('data-ServiciosId', JSON.stringify(arrayServicios));
            document.getElementById('btn_asignar_recurso').setAttribute('data-Proceso', Proceso);
            document.getElementById('btn_asignar_recurso').setAttribute('data-MaestroId', MaestroId);
            document.getElementById('btn_asignar_recurso').setAttribute('data-SolicitudesId', JSON.stringify(miArray));
            document.getElementById('btn_asignar_recurso').setAttribute('data-ProveedoresId', JSON.stringify(arrayProveedores));
            document.getElementById('btn_asignar_recurso').setAttribute('data-ValoresServicio', JSON.stringify(arrayValoresServicio));
            document.getElementById('btn_asignar_recurso').setAttribute('data-FechaInicio', JSON.stringify(arrayFechaInicio));
            document.getElementById('btn_asignar_recurso').setAttribute('data-FechaActualizacion', JSON.stringify(arrayFechaActualizacion));
            document.getElementById('btn_asignar_recurso').setAttribute('data-Placa', JSON.stringify(arrayPlaca));
            document.getElementById('btn_asignar_recurso').setAttribute('data-ClienteId', ClienteId);
            document.getElementById('btn_asignar_recurso').setAttribute('data-ReferenciaPedidos', JSON.stringify(ArrayRefPedidos));
          } else {
            document.getElementById('btn_subastar_recurso').style.display = '';
            document.getElementById('slct_criterio').style.display = '';
            document.getElementById('btn_subastar_recurso').setAttribute('data-MaestroId', MaestroId);
          }
        }

        const serviciosHTML = proveedor.servicios.map(servicio => {
          let col_estatus_publicacion;

          switch (servicio.estado) {
            case 'Pendiente Iniciar':
              col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${servicio.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              break;
            case 'Iniciado':
              col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${servicio.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              break;
            case 'Cancelado':
            case 'Rechazado':
              col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              break;
            case 'Completado':
              col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              break;
            case 'Postulado':
              col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${servicio.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              break;
            case 'Ganador':
              col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${servicio.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              break;
            case 'No Asignada':
              col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${servicio.estado}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              break;
            default:
              col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-light"><span class="badge-label">${servicio.estado}</span></span>`;
          }

          return `
            <div class="row mb-2" style="font-size:13px;">
              <div class="col-2">${servicio.tipo_servicio}</div>
              <div class="col-2"><small class="text-muted">${servicio.vehiculo}</small></div>
              <div class="col-2">${col_estatus_publicacion}</div>
              <div class="col-3"><small class="text-muted">${servicio.fecha_registro}</small></div>
              <div class="col-3"><small class="text-muted">${servicio.fecha_limite}</small></div>
            </div>
            
            <div class="row mb-3">
              <div class="col-6">
                <small class="text-muted">Valor Servicio: ${servicio.Valor_Servicio ? servicio.Valor_Servicio : 0.00}</small>
              </div>
              <div class="col-6">
                <small class="text-muted">Inicio de servicio: ${servicio.Fecha_Inicio ? servicio.Fecha_Inicio : '0000-00-00'}</small>
              </div>
            </div>
            <hr class="my-1 text-dark">
          `;
        }).join('');

        accordionItem.innerHTML = `
          <h2 class="accordion-header" id="heading${index}">
              <button class="accordion-button collapsed" type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapse${index}" 
                      aria-expanded="false" 
                      aria-controls="collapse${index}">
                    ${proveedor.proveedor}
              </button>
          </h2>
          <div id="collapse${index}" class="accordion-collapse collapse" 
              aria-labelledby="heading${index}" 
              data-bs-parent="#accordionExample">
              <div class="accordion-body pt-0">
                  <div class="row fw-bold mb-2">
                      <div class="col-2">Tipo servicio</div>
                      <div class="col-2">Vehículo</div>
                      <div class="col-2">Estado</div>
                      <div class="col-3">Fecha Registro</div>
                      <div class="col-3">Fecha Límite</div>
                  </div>
                  ${serviciosHTML}
              </div>
          </div>
        `;

        accordionContainer.appendChild(accordionItem);
      });

    } else {
      document.getElementById("bloque_header").innerHTML = `<p class="text-danger">${data.message}</p>`;
    }
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    document.getElementById("bloque_header").innerHTML = `<p class="text-danger">Error al cargar servicios</p>`;
  }
}