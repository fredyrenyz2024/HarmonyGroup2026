// Importa la función desde funciones.js
// import { Visualizar } from '../../layout/assets/lib/serv_clientecotizaciones_ajax.js';
// window.VENTANA = null; // Variable global para almacenar el ID
// window.initScript = function (id) {
//   window.VENTANA = id; // Asigna el ID recibido a la variable global
//   // Definir la función initScript globalmente
//   const hoy = new Date(); // Obtener la fecha actual
//   const fechaHoy = hoy.toISOString().split('T')[0]; // Formatear como YYYY-MM-DD

//   if (window.VENTANA == 5) {
//     // alert("hola mundo desde aqui");
//     // Si la ventana es la 2, activar el evento de cambio en #filtro
//     let tipo = 2;
//     let cliente = "";
//     var fecha_inicial = $(`#campo-${window.VENTANA}-fecha_inicial`).val() === undefined ? fechaHoy : $(`#campo-${window.VENTANA}-fecha_inicial`).val();
//     var fecha_final = $(`#campo-${window.VENTANA}-fecha_final`).val() === undefined ? fechaHoy : $(`#campo-${window.VENTANA}-fecha_final`).val();
//     listar_solicitudes_pendientes(tipo, fecha_inicial, fecha_final, cliente);

//     $(`#campo-${window.VENTANA}-filtro`).off("change").on("change", function () {
//       document.getElementById(`campo-${window.VENTANA}-clientes`).style.display = "block";
//       $.ajax({
//         url: $('#base_url').val() + 'serviciocliente/Listar_Clientes',
//         type: "POST",
//         dataType: "json",
//         success: function (data) {
//           let select = $(`#campo-${window.VENTANA}-clientes`);
//           select.empty().append('<option value="">Seleccione</option>');

//           $.each(data, function (index, item) {
//             select.append(`<option value="${item.id}">${item.nombre}</option>`);
//           });

//           // Inicializa Select2 en el select de clientes
//           select.select2({
//             placeholder: 'Seleccione una opción',
//             allowClear: true,
//           });
//         },
//         error: function (xhr, status, error) {
//           console.error("Error en AJAX:", status, error);
//           alert("Error al cargar los datos.");
//         }
//       });
//     });

//     $(`#campo-${window.VENTANA}-clientes`).off("change").on("change", function () {
//       let valorSeleccionado = $(this).val();
//       listar_solicitudes_pendientes(tipo, fecha_inicial, fecha_final, valorSeleccionado);
//     });

//     document.addEventListener("click", async e => {
//       if (e.target.matches("#btn_ver_solicitud_Pendiente") || e.target.matches("#btn_ver_solicitud_Pendiente *")) {
//         let padre = e.target.parentElement.parentElement;
//         // Obtener el enlace (el elemento con el data-id)
//         let enlace = e.target.closest('#btn_ver_solicitud_Pendiente');
//         // Obtener el valor del atributo data-id
//         let dataId = enlace.getAttribute('data-id');
//         let dataId2 = enlace.getAttribute('data-id2');
//         Visualizar(dataId, dataId2);
//       }
//     });
//   }
// };

window.initScript = function (id) {
  // Limpiar eventos anteriores si existen
  if (window.VENTANA_HANDLERS) {
    $(document).off('change', window.VENTANA_HANDLERS.filtroHandler);
    $(document).off('change', window.VENTANA_HANDLERS.clientesHandler);
    $(document).off('click', window.VENTANA_HANDLERS.clickHandler);
  }


  /* Actualiar la session de php para la ventana */
  $.post($('#base_url').val() + 'serviciocliente/actualizar_session', {
    ventana_id: id
  }, function (response) {
    console.log("Sesión actualizada:", response);
  });

  const hoy = new Date();
  const fechaHoy = hoy.toISOString().split('T')[0];

  if (id === 5) { // Usar el parámetro id directamente
    const filtroSelector = `#campo-${id}-filtro`;
    const clientesSelector = `#campo-${id}-clientes`;

    let tipo = 2;
    let cliente = "";
    let fecha_inicial = $(`#campo-${id}-fecha_inicial`).val() || fechaHoy;
    let fecha_final = $(`#campo-${id}-fecha_final`).val() || fechaHoy;

    listar_solicitudes_pendientes(tipo, fecha_inicial, fecha_final, cliente);

    // Manejador para cambio en filtro
    const filtroHandler = function () {
      $(clientesSelector).show();
      $.ajax({
        url: $('#base_url').val() + 'serviciocliente/Listar_Clientes',
        type: "POST",
        dataType: "json",
        success: function (data) {
          let select = $(clientesSelector);
          select.empty().append('<option value="">Seleccione</option>');
          $.each(data, function (index, item) {
            select.append(`<option value="${item.id}">${item.nombre}</option>`);
          });
          select.select2({ placeholder: 'Seleccione una opción', allowClear: true });
        },
        error: function (xhr, status, error) {
          console.error("Error en AJAX:", status, error);
          alert("Error al cargar los datos.");
        }
      });
    };

    // Manejador para cambio en clientes
    const clientesHandler = function () {
      let valorSeleccionado = $(this).val();
      listar_solicitudes_pendientes(tipo, fecha_inicial, fecha_final, valorSeleccionado);
    };

    // Manejador para clic en botones
    const clickHandler = async (e) => {
      if (e.target.matches("#btn_ver_solicitud_Pendiente, #btn_ver_solicitud_Pendiente *")) {
        // const enlace = e.target.closest('#btn_ver_solicitud_Pendiente');
        // const dataId = enlace.getAttribute('data-id');
        // const dataId2 = enlace.getAttribute('data-id2');
        // Visualizar(dataId, dataId2);
        // let padre = e.target.parentElement.parentElement;
        // Obtener el enlace (el elemento con el data-id)
        let enlace = e.target.closest('#btn_ver_solicitud_Pendiente');
        // // Obtener el valor del atributo data-id
        let dataId = enlace.getAttribute('data-id');
        let dataId2 = enlace.getAttribute('data-id2');
        let dataId3 = enlace.getAttribute('data-id3');
        // Visualizar(dataId, dataId2, dataId3);

        // // Definir dimensiones de la nueva ventana
        const w = 1000;
        const h = 1000;

        // Fixes dual-screen position                         Most browsers      Firefox
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;
        var newWindow = window.open($('#base_url').val() + "serviciocliente/canvas?cotizacion=" + encodeURIComponent(dataId) + "&solicitud_servicio=" + encodeURIComponent(dataId2), "ventanaCentrada", 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

        // Puts focus on the newWindow
        if (window.focus) {
          newWindow.focus();
        }
      }


    };

    // Asignar eventos usando delegación
    $(document).on('change', filtroSelector, filtroHandler);
    $(document).on('change', clientesSelector, clientesHandler);
    $(document).on('click', clickHandler);

    // Guardar referencias para limpiar luego
    window.VENTANA_HANDLERS = {
      filtroHandler,
      clientesHandler,
      clickHandler
    };
  }
};

// Asegúrate de limpiar al cerrar la ventana/componente
window.cleanupScript = function () {
  if (window.VENTANA_HANDLERS) {
    $(document).off('change', window.VENTANA_HANDLERS.filtroHandler);
    $(document).off('change', window.VENTANA_HANDLERS.clientesHandler);
    $(document).off('click', window.VENTANA_HANDLERS.clickHandler);
    window.VENTANA_HANDLERS = null;
  }
};

async function listar_solicitudes_pendientes(tipo, fecha_inicial, fecha_final, cliente) {
  /* Funcion para enviar los datos */
  let dato = new FormData();
  dato.append('tipo', tipo);
  dato.append('fecha_inicial', fecha_inicial);
  dato.append('fecha_final', fecha_final);
  dato.append('estado', "Pendiente");
  dato.append('cliente', cliente);

  try {
    const response = await fetch($('#base_url').val() + 'serviciocliente/consultar_cotizaciones', {
      method: 'POST',
      body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let esatdo_autorizado = '';
      let col_estatus = '';
      let cot_itr = '';
      // let n_cotizacion = '';
      // let btn_editar = '';

      let tbody = document.getElementById('tblSolicitudesPendientes');
      tbody.innerHTML = '';

      data.resultado.forEach(element => {
        const fila = document.createElement('tr');
        if (element.estado_estudio === 'Sin Estado') {
          if (element.estado === 'Pendiente') {
            col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">sin gestionar</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          } else if (element.estado === 'por autorizar') {
            col_estatus = `<span  data-toggle="tooltip" style="color:#ec1f00;">${element.estado}</span>`;
          } else {
            col_estatus = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">sin gestionar</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          }
        } else {
          if (element.estado_estudio === 'pendiente_iniciar') {
            col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">Estudio Pendiente Iniciar</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
          } else if (element.estado_estudio === 'iniciado') {
            col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">Estudio Iniciado</span><span class="ms-1" data-feather="info" style="height:12.8px;width:12.8px;"></span></span>`;
          } else if (element.estado_estudio === 'Pendiente') {
            col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">Estudio Pendiente</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          } else if (element.estado_estudio === 'Rechazado') {
            col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Estudio Rechazado</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span>`;
          } else if (element.estado_estudio === 'Aprobado') {
            col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">Estudio Aprobado</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>`;
          } else if (element.estado_estudio === 'vencida') {
            col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Estudio Vencido</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>`;
          } else if (element.estado_estudio === 'Sin Estado') {
            col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">Sin Estado</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>`;
          }
        }

        /* Consultas de estado de las solicitudes */
        if (element.estado_autorizacion === 'F1') {
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">Realizada</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F2') {
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">Entregada</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F4') {
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Pérdida</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F3') {
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">Ganada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F5') {
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Cancelada</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F6') {
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">Rechazada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        }

        /* Validar si la solicitud es Itr */
        if (element.itr === 'Si') {
          cot_itr = `<span class="badge badge-phoenix badge-phoenix-success float-right">SI</span>`;
        } else {
          cot_itr = `<span class="badge badge-phoenix badge-phoenix-primary float-right">NO</span>`;
        }

        const columnaEstado = document.createElement('td');
        columnaEstado.innerHTML = col_estatus;
        const columnaEstado_Autorizacion = document.createElement('td');
        columnaEstado_Autorizacion.innerHTML = esatdo_autorizado;
        const columnaItr = document.createElement('td');
        columnaItr.innerHTML = cot_itr;
        const columnaNum_Cotizacion = document.createElement('td');
        columnaNum_Cotizacion.innerHTML = `<a href="#" id="btn_ver_solicitud_Pendiente" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}" class="text-decoration-none">N°${element.nundoc_solicitud}</a>`;
        // columnaNum_Cotizacion.innerHTML = `<a href="#" id="btn_ver_solicitud_Pendiente" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" class="text-decoration-none" aria-disabled="true">N°${element.nundoc_solicitud}</a>`;
        const columnaCliente = document.createElement('td');
        columnaCliente.innerHTML = element.nombre_cliente;
        const columnaMercancia = document.createElement('td');
        columnaMercancia.innerHTML = element.tipo_mercancia;
        const columnaPeso = document.createElement('td');
        columnaPeso.innerHTML = element.peso_neto_kg + 'Kg';
        const columnafecha = document.createElement('td');
        columnafecha.innerHTML = element.fecha_solicitud_servicio;
        const columnaServicio = document.createElement('td');
        columnaServicio.innerHTML = element.tipo_transporte;
        // const columnaAcciones = document.createElement('td');
        //Empresas
        const columnaAcciones = document.createElement('td');
        columnaAcciones.innerHTML = element.nombre_empresa;

        fila.appendChild(columnaNum_Cotizacion);
        fila.appendChild(columnaItr);
        fila.appendChild(columnaCliente);
        fila.appendChild(columnaMercancia);
        fila.appendChild(columnaPeso);
        fila.appendChild(columnaServicio);
        fila.appendChild(columnafecha);
        fila.appendChild(columnaEstado_Autorizacion);
        fila.appendChild(columnaEstado);
        fila.appendChild(columnaAcciones);
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

