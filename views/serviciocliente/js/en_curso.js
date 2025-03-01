window.VENTANA = null; // Variable global para almacenar el ID
$(document).ready(function () {
  // Definir la función initScript globalmente
  window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global
    // console.log("VENTANA ASIGNADA:", window.VENTANA); // Depuración

    let tipo = 2;
    let cliente = "";
    let fecha_inicial = $('#fecha_inicial').val();
    let fecha_final = $('#fecha_final').val();

    listar_cotizaciones(tipo, fecha_inicial, fecha_final, cliente);

    // Si la ventana es la 2, activar el evento de cambio en #filtro
    if (window.VENTANA == 12) {
      $(`#campo-${window.VENTANA}-filtro`).off("change").on("change", function () {
        document.getElementById(`campo-${window.VENTANA}-clientes`).style.display = "block";

        $.ajax({
          url: $('#base_url').val() + 'serviciocliente/Listar_Clientes',
          type: "POST",
          dataType: "json",
          success: function (data) {
            let select = $(`#campo-${window.VENTANA}-clientes`);
            select.empty().append('<option value="">Seleccione</option>');

            $.each(data, function (index, item) {
              select.append(`<option value="${item.id}">${item.nombre}</option>`);
            });

            // Inicializa Select2 en el select de clientes
            select.select2({
              placeholder: 'Seleccione una opción',
              allowClear: true,
            });
          },
          error: function (xhr, status, error) {
            console.error("Error en AJAX:", status, error);
            alert("Error al cargar los datos.");
          }
        });
      });


      $(`#campo-${window.VENTANA}-clientes`).off("change").on("change", function () {
        let valorSeleccionado = $(this).val();
        // console.log("Cambio en el filtro detectado. Mostrando clientes... " + valorSeleccionado); // Depuración
        listar_cotizaciones(tipo, fecha_inicial, fecha_final, valorSeleccionado);
      });
    }
  };
});

async function listar_cotizaciones(tipo, fecha_inicial, fecha_final, cliente) {
  /* Funcion para enviar los datos */
  let dato = new FormData();
  dato.append('tipo', tipo);
  dato.append('fecha_inicial', fecha_inicial);
  dato.append('fecha_final', fecha_final);
  dato.append('estado', 'En_Curso');
  dato.append('cliente', cliente);
  try {
    const response = await fetch($('#base_url').val() + 'serviciocliente/consultar_cotizaciones', {
      method: 'POST',
      body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tbl_cotizaciones_en_curso');
      tbody.innerHTML = '';
      let esatdo_autorizado = '';
      let col_estatus = '';
      let cot_itr = '';
      let n_cotizacion = '';
      let btn_editar = '';
      let Prioridad = '';
      // let perfil = document.getElementById("perfil_id").value;
      // document.querySelector('.badge').innerHTML = data.resultado_cantidad['total_cotizaciones'];
      // $('.badge').html(data.resultado_cantidad['total_cotizaciones']);

      data.resultado.forEach(element => {
        const fila = document.createElement('tr');

        if (element.estado_estudio === 'Sin Estado') {
          if (element.estado === 'Pendiente') {
            col_estatus = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">sin gestionar</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          } else if (element.estado === 'por autorizar') {
            col_estatus = `<span  data-toggle="tooltip" style="color:#ec1f00;">${element.estado}</span>`;
          } else {
            col_estatus = `<td class="text"></td>`;
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
          } else {
            col_estatus = `<td class="text"></td>`;
          }
        }
        // if (element.estado_autorizado === 'autorizado') {
        //   col_estatus = `<span  data-toggle="tooltip" style="color:purple;">${element.estado_autorizado}</span>`;
        // } else if (element.estado_autorizado === 'por autorizar') {
        //   col_estatus = `<span  data-toggle="tooltip" style="color:red;">${element.estado_autorizado}</span>`;
        // } else {
        //   col_estatus = `<td class="text"></td>`;
        // }
        /* Consultas de estado de las solicitudes */
        if (element.estado_autorizacion === 'F1') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-default"  data-toggle="tooltip" title="Realizada" ></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">Realizada</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F2') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-success"  data-toggle="tooltip" title="Entregada"></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">Entregada</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F4') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-danger" data-toggle="tooltip" title="Pérdida"></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Pérdida</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F3') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-warning"  data-toggle="tooltip" title="Ganada"></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">Ganada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F5') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-primary" data-toggle="tooltip" title="Cancelada"></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Cancelada</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F6') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-gray" data-toggle="tooltip" title="Rechazada"></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">Rechazada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        }
        /* Validar si la solicitud es Itr */
        if (element.itr === 'Si') {
          cot_itr = `<span class="badge badge-phoenix badge-phoenix-success float-right">SI</span>`;
        } else {
          cot_itr = `<span class="badge badge-phoenix badge-phoenix-primary float-right">NO</span>`;
        }

        // if (perfil === '1') {
        //   if (element.prioritaria === 'Propuesta') {
        //     Prioridad = `<span class="badge badge-phoenix badge-phoenix-warning float-right"><a href="#" id="btn_aprobar_solicitud" data-id="${element.nundoc_solicitud}" class="text-decoration-none text-warning" title="Aprobar solicitud">${element.prioritaria}</a></span>`;
        //   } else {
        //     Prioridad = `<span class="badge badge-phoenix badge-phoenix-primary float-right">${element.prioritaria}</span>`;
        //   }
        // }

        if (element.prioritaria === 'Propuesta') {
          Prioridad = `<span class="badge badge-phoenix badge-phoenix-warning float-right"><a href="#" id="btn_aprobar_solicitud" data-id="${element.nundoc_solicitud}" class="text-decoration-none text-warning" title="Aprobar solicitud">${element.prioritaria}</a></span>`;
        } else if (element.prioritaria === null) {
          Prioridad = `<span class="badge badge-phoenix badge-phoenix-info float-right">No marcada</span>`;
        } else {
          Prioridad = `<span class="badge badge-phoenix badge-phoenix-primary float-right">${element.prioritaria}</span>`;
        }

        const columnaEstado = document.createElement('td');
        columnaEstado.innerHTML = col_estatus;
        const columnaEstado_Autorizacion = document.createElement('td');
        columnaEstado_Autorizacion.innerHTML = esatdo_autorizado;
        const columnaItr = document.createElement('td');
        columnaItr.innerHTML = cot_itr;
        const columnaNum_Cotizacion = document.createElement('td');
        columnaNum_Cotizacion.innerHTML = `<a href="#" id="btn_ver_solicitud" data-id="${element.n_cotizacion}"  data-id2="${element.nundoc_solicitud}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" class="text-decoration-none" aria-disabled="true">N°${element.nundoc_solicitud}</a>`;
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
        const columnaPrioridad = document.createElement('td');
        columnaPrioridad.innerHTML = Prioridad;
        //Empresas
        const columnaAcciones = document.createElement('td');
        columnaAcciones.innerHTML = element.nombre_empresa;

        /* Acciones para los botones */
        // if (element.n_cotizacion) {
        //   n_cotizacion = element.n_cotizacion;
        //   if (element.estado_autorizacion === 'cancelada' || element.estado_autorizacion === 'autorizado') {
        //     btn_editar = `
        //       <button  class="btn btn-warning btn-sm cell-detail hint--top-left" data-toggle="modal" data-target="#no_editar_cotizacion" title="Editar Cotización" data-toogle="tooltip" data-placement="top" onclick="prueba_editar_no(this)" data-hint="" data-id="${n_cotizacion}" data-id2="${element.estado_autorizado}">
        //           <span class="uil uil-file-edit-alt" style="color:#ffffff;"></span>
        //       </button>`;
        //   } else if (element.estado_autorizacion !== 'cancelada' || element.estado_autorizacion !== 'autorizado') {
        //     btn_editar = `
        //     <button onclick="prueba_editar_no(this)" class="btn btn-warning btn-sm cell-detail hint--top-left" data-hint="" data-id="${n_cotizacion}" data-id2="${element.estado_autorizado}">
        //       <!--<span class="icon mdi mdi-edit" data-toggle="modal" data-target="#no_editar_cotizacion" title="Editar Cotización"></span>-->
        //       <span class="uil uil-file-edit-alt" style="color:#ffffff;"></span>
        //     </button>`;
        //   }
        //   columnaAcciones.innerHTML = `
        //   <div class="btn-group btn-group-sm" role="group" aria-label="...">
        //     ${btn_editar}
        //     <button onclick="Visualizar(this)"; data-placement="top" class="btn btn-info btn-sm cell-detail hint--top-left" data-hint="" data-id="${n_cotizacion}" data-toggle="modal" data-target="#ver_cotizacion" title="Ver Cotización">
        //       <span class="uil uil-eye" style="color:#ffffff;"></span>
        //     </button>
        //     <button data-toggle="modal" data-target="#ver_historico" title="Historico" data-placement="top" onclick="historico(this,${n_cotizacion})";  class="btn btn-secondary btn-xs cell-detail hint--top-left" data-hint="" data-id="${element.nombre_cliente}">
        //       <span class="icon mdi mdi-balance"></span>
        //     </button>
        //     <button data-placement="top" data-toggle="modal" data-target="#tb_solicitud" title="Solicitud de servicio" onclick="tbsolicitudes(this,${n_cotizacion})";  class="btn btn-success btn-xs cell-detail hint--top-left" data-hint="" data-id="${element.nombre_cliente}">
        //        <span class="icon mdi mdi-account-circle" style="color:#ffffff;"></span>
        //      </button>
        //   </div>
        //   `;
        // } else {
        // }

        fila.appendChild(columnaNum_Cotizacion);
        fila.appendChild(columnaItr);
        fila.appendChild(columnaCliente);
        fila.appendChild(columnaMercancia);
        fila.appendChild(columnaPeso);
        fila.appendChild(columnaServicio);
        fila.appendChild(columnafecha);
        fila.appendChild(columnaEstado_Autorizacion);
        fila.appendChild(columnaEstado);
        fila.appendChild(columnaPrioridad);
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