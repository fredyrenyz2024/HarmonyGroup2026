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
        } else if (element.estado_prioridad === 'No Marcada') {
          col_prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_prioridad}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        }

        /* Validar la asignación del pedido */
        if (element.estado_publicaion === "Publicado" && element.estado_asignacion === "Asignado") {
          btn_publicacion = "";
          btn_Asignacion = "";
          btn_cancelacion = "";
        }
        /* Validar publicación del pedido */
        else if (element.estado_publicaion === "Publicado" && element.estado_asignacion === "Pendiente") {
          btn_publicacion = "";
          btn_Asignacion = "";
          btn_cancelacion = "";
        }
        /* Validar si el pedido ya tuvo una publicación */
        else if (element.estado_publicaion === "Pendiente Respuesta" && element.estado_asignacion === "Pendiente") {
          btn_publicacion = "";
          btn_Asignacion = "";
          btn_cancelacion = "";
        } else if (element.estado_publicaion === "Aceptado" && element.estado_asignacion === "Ganador") {
          btn_publicacion = "";
          btn_Asignacion = "";
          btn_cancelacion = "";
        }
        /* Si no se cumplen las condiciones anteriores, mostrar los botones */
        else {
          btn_publicacion = `<a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-feedback"></span> Publicar Pedido</a>`;
          btn_Asignacion = `<a class="dropdown-item fw-bold" href="#" id="btn_asignar_proveedor" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-file-search-alt"></span> Asignar Proveedor</a>`;
          btn_cancelacion = `<a class="dropdown-item fw-bold" href="#" id="btn_cancelar_pedido" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-x"></span>  Cancelar Pedido</a>`;
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
            ${btn_cancelacion}
            <a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"> <span class="uil uil-bell"></span> Marcar como Prioridad</a>
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
