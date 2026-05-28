window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global
  // generarPDF();

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
    if (e.target.matches(`#campo-${window.VENTANA}-filtrar`) || e.target.matches(`#campo-${window.VENTANA}-filtrar *`)) {

      let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
      let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
      let filtro = document.getElementById(`campo-${window.VENTANA}-filtros`).value.trim();
      listar_pedidos_administrador(fecha_inicial, fecha_final, filtro);
    }
  });

  document.getElementById('exportar_excel').addEventListener('click', function () {

    var estadoId = this.getAttribute('data-id'); // <--- Aquí obtienes el data-id del botón
    // console.log('Estado ID:', estadoId); // Solo para que veas que se captura bien

    var table = document.getElementById('tbl_informe_pedidos_torre_control');

    // Preprocesar la tabla para asegurar que los valores con formato de moneda sean tratados como texto
    Array.from(table.getElementsByTagName('td')).forEach(function (td) {
      if (td.innerText.includes('$') || td.innerText.includes(',')) {
        td.setAttribute('data-t', 's'); // Marcar como texto
      }
    });

    // Crear el libro de Excel a partir de la tabla
    var wb = XLSX.utils.table_to_book(table);

    // Aplicar estilo al thead (color de fondo y otros)
    var ws = wb.Sheets[wb.SheetNames[0]];

    // Definir estilo para el thead
    var rangoEncabezado = XLSX.utils.decode_range(ws['!ref']); // Obtener el rango de la tabla
    for (let C = rangoEncabezado.s.c; C <= rangoEncabezado.e.c; ++C) {
      var cell = ws[XLSX.utils.encode_cell({ r: 0, c: C })]; // Fila 0 es el thead
      if (!cell.s) cell.s = {};
      cell.s.fill = {
        patternType: 'solid',
        fgColor: { rgb: '3B71CA' }, // Color de fondo
      };
    }

    // Añadir filtros al thead
    ws['!autofilter'] = {
      ref: XLSX.utils.encode_range(rangoEncabezado),
    };

    // Ajustar ancho de las columnas
    ws['!cols'] = [
      { wpx: 120 },
      { wpx: 120 },
      { wpx: 320 },
      { wpx: 120 },
      { wpx: 120 },
      { wpx: 120 },
      { wpx: 120 },
      { wpx: 120 },
      { wpx: 120 },
    ];

    // Crear contenido de archivo con fecha
    // const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Informe Pedidos Torre de Control - ${document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value} - ${document.getElementById(`campo-${window.VENTANA}-fecha_final`).value}.xlsx`;

    XLSX.writeFile(wb, nombreArchivo);

  });

  document.addEventListener('change', async (e) => {
    if (e.target.matches(`#campo-${window.VENTANA}-filtros`) || e.target.matches(`#campo-${window.VENTANA}-filtros *`)) {
      let filtro = document.getElementById(`campo-${window.VENTANA}-filtros`).value.trim();
      // listar_pedidos_administrador('', '', filtro);
      if (filtro === 'informe simplificado') {
        // console.log("🚀 ~ document.addEventListener ~ filtro simplificado:", filtro);
        let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
        let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
        listar_pedidos_administrador(fecha_inicial, fecha_final, filtro);
      } else if (filtro === 'informe detallado') {
        // console.log("🚀 ~ document.addEventListener ~ filtro detallado:", filtro);
        let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
        let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
        listar_pedidos_administrador(fecha_inicial, fecha_final, filtro);
      }
    }
  });


};

// function generarPDF() {
//   // window.open('index.php?controller=Reporte&action=generarPDF', '_blank');
//   window.open($('#base_url').val() + 'Reporte/generarPDF', '_blank');
// }


async function listar_pedidos_administrador(fecha_inicial, fecha_final, filtro) {
  /* Funcion para enviar los datos */
  let dato = new FormData();
  dato.append('fecha_inicial', fecha_inicial);
  dato.append('fecha_final', fecha_final);
  dato.append('filtro', filtro);
  try {
    const response = await fetch($('#base_url').val() + 'torrecontrol/listar_informes_torre_control', {
      method: 'POST',
      body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tbl_administrar_pedidos_informe');
      tbody.innerHTML = '';
      let col_estatus_publicacion = '';
      let col_estatus_asignacion = '';
      let btn_publicacion = "";
      let btn_cancelacion = "";
      let col_prioridad = "";
      let btn_removeAsignacion = "";
      let checkbox_carrito = "";
      let col_estatus_proceso = "";
      let col_estatus_trazabilidad = "";

      data.forEach(element => {
        const fila = document.createElement('tr');

        // Publicación
        if (estadosPublicacion[element.estado_publicaion]) {
          col_estatus_publicacion = createBadge(element.estado_publicaion, estadosPublicacion[element.estado_publicaion]);
          if (element.estado_publicaion === 'Cancelado') {
            btn_publicacion = `
            <a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido"
              data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}">
              <span class="uil uil-feedback"></span> Publicar Pedido
            </a>`;
          }
        }

        // Asignación
        if (estadosAsignacion[element.estado_asignacion]) {
          col_estatus_asignacion = createBadge(element.estado_asignacion, estadosAsignacion[element.estado_asignacion]);
        }

        // Prioridad
        if (estadosPrioridad[element.estado_prioridad]) {
          col_prioridad = createBadge(element.estado_prioridad, estadosPrioridad[element.estado_prioridad]);
        }

        // const estado = obtenerEstadoTrazabilidad(element.tipo_trazabilidad);
        // col_estatus_trazabilidad = createBadge(estado.texto, estado.color);

        // //Estado proceso
        // if (estadosProceso[element.estado_proceso]) {
        //   col_estatus_proceso = createBadge(element.estado_proceso, estadosProceso[element.estado_proceso]);
        // }

        // //Estado de la trazabiliidad
        // if (estadosTrazabilidad[element.tipo_trazabilidad]) {
        //   col_estatus_trazabilidad = createBadge(element.tipo_trazabilidad, estadosTrazabilidad[element.tipo_trazabilidad]);
        // }

        //Estado proceso
        if (estadosProceso[element.estado_proceso]) {
          if (element.estado_publicaion === 'Cancelado' && element.estado_asignacion === 'Cancelado') {
            col_estatus_proceso = createBadge('Cancelado', 'danger');
            checkbox_carrito = ``;
            btn_prioridad = ``;
            btn_detalle_proceso = ``;
            btn_detalle_trazabilidad = ``;
            btn_removeAsignacion = ``;
            btn_trazabilidad_pedido = ``;
            btn_publicacion = ``;
          } else {
            col_estatus_proceso = createBadge(element.estado_proceso, estadosProceso[element.estado_proceso]);
          }
        }

        if (element.tipo_trazabilidad === 'Completado') {
          btn_detalle_trazabilidad = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}"><span class="uil uil-transaction"></span> Detalle trazabilidad</a>`;
          btn_trazabilidad_pedido = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad_pedido" data-id="${element.numdoc_solicitud}"><span class="uil-wrap-text"></span> Trazabilidad pedido</a>`;
        } else {
          btn_detalle_trazabilidad = ``;
          btn_trazabilidad_pedido = ``;
        }

        /* Validar si el pedido ya tuvo una postulacion */
        if (element.tipo_trazabilidad === 'Iniciado' && element.estado_proceso_pedido === 'Postulado') {
          // Estado de la trazabilidad
          const estado = obtenerEstadoTrazabilidad(element.estado_proceso_pedido);
          col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
        } else {
          // Estado de la trazabilidad
          const estado = obtenerEstadoTrazabilidad(element.tipo_trazabilidad);
          col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
        }


        const columnaNundocSolicitud = document.createElement('td');
        columnaNundocSolicitud.innerHTML = `N°${element.referencia_pedido}`;

        const columnaCliente = document.createElement('td');
        columnaCliente.innerHTML = element.nombre_cliente;
        columnaCliente.style.width = 'auto';
        columnaCliente.style.whiteSpace = 'nowrap';

        const columnaCiudadOrigen = document.createElement('td');
        columnaCiudadOrigen.innerHTML = element.ciudad_origen;
        columnaCiudadOrigen.style.width = 'auto';
        columnaCiudadOrigen.style.whiteSpace = 'nowrap';

        /*  const columnaReferencia = document.createElement('td');
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

        const columnaProcesoPedido = document.createElement('td');
        columnaProcesoPedido.innerHTML = col_estatus_proceso;
        columnaProcesoPedido.style.width = 'auto';
        columnaProcesoPedido.style.whiteSpace = 'nowrap';

        const columnaEstadoPedido = document.createElement('td');
        columnaEstadoPedido.innerHTML = col_estatus_trazabilidad;
        columnaEstadoPedido.style.width = 'auto';
        columnaEstadoPedido.style.whiteSpace = 'nowrap';

        const columnaPriordad = document.createElement('td');
        columnaPriordad.innerHTML = col_prioridad;

        // fila.appendChild(columnaCheckPedido);
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
        fila.appendChild(columnaProcesoPedido);
        fila.appendChild(columnaEstadoPedido);
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


function createBadge(text, type) {
  return `
    <span class="badge badge-phoenix fs-10 badge-phoenix-${type}">
      <span class="badge-label">${text}</span>
      <span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span>
    </span>`;
}

// --- Estados de Publicación ---
window.estadosPublicacion = {
  'Pendiente': 'secondary',
  'Publicado': 'info',
  'Cancelado': 'secondary',
  'Aceptado': 'success',
  'Pendiente Respuesta': 'warning',
  'Completado': 'success'
};

// --- Estados de Asignación ---
window.estadosAsignacion = {
  'Pendiente': 'secondary',
  'Asignado': 'info',
  'Cancelado': 'secondary',
  'Aceptado': 'success',
  'Ganador': 'success',
  'Completado': 'success'
};

// --- Estados de Prioridad ---
window.estadosPrioridad = {
  'Prioritaria': 'warning',
  'No Marcada': 'info'
};

// --- Estados del Proceso ---
window.estadosProceso = {
  'Pendiente': 'secondary',
  'Asignación': 'warning',
  'Publicación': 'danger',
  'Completado': 'success'
};

// --- Estados de Trazabilidad ---
// window.estadosTrazabilidad = {
//   'Llegada Cargue': 'info',
//   'Cargue': 'info',
//   'Salida Cargue': 'info',
//   'Inicio Ruta': 'primary',
//   'Transito': 'primary',
//   'Llegada Descargue': 'info',
//   'Descargue': 'info',
//   'Salida Descargue': 'info',
//   'Sin observación': 'secondary'
// };

function obtenerEstadoTrazabilidad(tipoTrazabilidad) {
  let textoTrazabilidad = tipoTrazabilidad;

  // Si viene "Completado", lo cambiamos a "Asignado"
  if (tipoTrazabilidad === 'Completado') {
    textoTrazabilidad = 'Asignado';
  }

  // Devolvemos el texto corregido y el color
  return {
    texto: textoTrazabilidad,
    color: window.estadosTrazabilidad[textoTrazabilidad] || 'secondary'
  };
}


window.estadosTrazabilidad = {
  'Llegada Cargue': 'info',
  'Cargue': 'info',
  'Salida Cargue': 'info',
  'Inicio Ruta': 'primary',
  'Transito': 'primary',
  'Llegada Descargue': 'info',
  'Descargue': 'info',
  'Salida Descargue': 'info',
  'Pendiente Iniciar': 'danger',
  'Sin Asignar': 'secondary',
  'Iniciado': 'primary',
  'Asignado': 'success'
};