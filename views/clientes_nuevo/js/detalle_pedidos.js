const d = document;
const w = window;
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  let params1 = new URLSearchParams(location.search);
  let cliente = params1.get('cliente');
  let numdoc = params1.get('numdoc');
  let solicitud_id = params1.get('solicitud_id');
  $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga independientemente del resultado
  let formdata = new FormData();
  formdata.append('cliente', decodificarBase64(cliente));
  formdata.append('numdoc', decodificarBase64(numdoc));
  formdata.append('solicitud_id', decodificarBase64(solicitud_id));

  try {
    const response = await fetch($('#id_url_ajax').val() + 'cliente/detalle_actividades_pedidos', {
      method: 'POST',
      body: formdata,
      cache: 'no-cache',
    });

    const data = await response.json();
    let tbody = d.getElementById('tbl_detalle_pedido');
    tbody.innerHTML = '';
    data.forEach(element => {
      const fila = d.createElement('tr');

      const columnaPosicion = d.createElement('td');
      columnaPosicion.innerHTML = element.posicion;
      columnaPosicion.style.textAlign = 'left';
      // columnaPosicion.style.paddingLeft = '15px';

      const columnaNombreOpcion = d.createElement('td');
      columnaNombreOpcion.innerHTML = element.nombre_opcion;
      columnaNombreOpcion.style.textAlign = 'left';
      // columnaNombreOpcion.style.paddingLeft = '15px';

      const columnaResponsable = d.createElement('td');
      // columnaResponsable.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
      columnaResponsable.innerHTML = element.usuario_responsable_actividad;
      columnaResponsable.style.textAlign = 'left';
      // columnaResponsable.style.paddingLeft = '15px';

      const columnaFecha = d.createElement('td');
      columnaFecha.innerHTML = element.fecha_inicio + ' - ' + element.hora_inicio;
      columnaFecha.style.textAlign = 'left';
      // columnaFecha.style.paddingLeft = '15px';

      const columnaEstadoActividad = d.createElement('td');
      // columnaEstadoActividad.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
      // columnaEstadoActividad.innerHTML = element.fecha_creacion;
      if (element.estado_actividad == 'SIN INICIAR') {
        columnaEstadoActividad.innerHTML = `<span class="label label-warning">${element.estado_actividad}</span>`;
      } else if (element.estado_actividad == 'EN GESTION') {
        columnaEstadoActividad.innerHTML = `<span class="label label-primary">${element.estado_actividad}</span>`;
      } else if (element.estado_actividad == 'COMPLETADO') {
        columnaEstadoActividad.innerHTML = `<span class="label label-success">${element.estado_actividad}</span>`;
      } else if (element.estado_actividad == 'CANCELADO') {
        columnaEstadoActividad.innerHTML = `<span class="label label-danger">${element.estado_actividad}</span>`;
      } else if (element.estado_actividad == 'PAUSADO') {
        columnaEstadoActividad.innerHTML = `<span class="label label-info">${element.estado_actividad}</span>`;
      }
      columnaEstadoActividad.style.textAlign = 'left';
      // columnaEstadoActividad.style.paddingLeft = '15px';

      const columnaAccionDetalle = d.createElement('td');
      columnaAccionDetalle.innerHTML = `<button type="button" class="btn btn-light btn-sm" id="btn_detalle_actividad" Onclick="Listar_detalles_pedido_actividad('${element.proceso_id}','${element.actividad_id}','${decodificarBase64(
        cliente,
      )}','${decodificarBase64(numdoc)}')"><i class="fa-regular fa-eye"></i> Detalle</button>`;
      columnaAccionDetalle.style.textAlign = 'left';
      // columnaAccionDetalle.style.paddingLeft = '15px';

      fila.appendChild(columnaPosicion);
      fila.appendChild(columnaNombreOpcion);
      fila.appendChild(columnaResponsable);
      fila.appendChild(columnaFecha);
      fila.appendChild(columnaEstadoActividad);
      fila.appendChild(columnaAccionDetalle);
      // fila.appendChild(columnaUsuarioCreacion);
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    // ListarDespachos(d.getElementById('fecha_inicial').value, d.getElementById('fecha_final').value, d.getElementById('cliente_id').value, d.getElementById('numdoc_predido').value, filtro);
  }
});

async function Listar_detalles_pedido_actividad(proceso_id, actividad_id, cliente, numdoc) {
  $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga independientemente del resultado
  let formdata = new FormData();
  formdata.append('cliente', cliente);
  formdata.append('proceso_id', numdoc);
  formdata.append('actividad_id', actividad_id);

  try {
    const response = await fetch($('#id_url_ajax').val() + 'cliente/detalle_actividades_clientes', {
      method: 'POST',
      body: formdata,
      cache: 'no-cache',
    });

    const data = await response.json();
    // console.log("🚀 ~ Listar_detalles_pedido_actividad ~ data:", typeof data)

    if (Object.keys(data).length === 0) {
      d.getElementById('detalle_pedidos').innerHTML = '<div class="text-center"><strong class="text-primary" style="font-size:15px;">Sin detalles para esta actividad</strong></div>'; // Limpiar el contenedor al inicio
    } else {
      d.getElementById('detalle_pedidos').innerHTML = ''; // Limpiar el contenedor al inicio
      data.forEach(element => {
        let evidencia = ''; // Inicia 'evidencia' como una cadena vacía

        if (element.nombre_archivo === 'Sin_evidencia') {
          evidencia = `<span class="text-primary">Sin soporte</span>`;
        } else {
          evidencia = `
            <div class="btn-group" role="group" aria-label="...">
              <a href="${$(
                '#id_url_ajax',
              ).val()}${element.documento}/${element.nombre_archivo}" data-ruta="${element.documento}" data-nombre="${element.nombre_archivo}" target="_blank" style="text-decoration: none;"><i class="far fa-file-image"></i> Soporte</a>
            </div>
          `;
        }

        // Agregar el HTML generado para cada elemento al contenedor 'detalle_pedidos'
        d.getElementById('detalle_pedidos').innerHTML += `
          <div id="accordion${element.id}" class="panel-group accordion" style="margin-bottom:10px;">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion${element.id}" href="#${element.id}" class="collapsed" aria-expanded="false">
                    <i class="icon mdi mdi-chevron-down"></i><strong class="text-primary">Actividad ${element.nombre_opcion}</strong> <br><div class="text-center"> Nota N° ${element.id}</div></a>
                </h4>
              </div>
              <div id="${element.id}" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                  <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <strong>Fecha:</strong> ${element.fecha}
                      <br>
                      <strong>Observación:</strong> ${element.observacion}
                      <br>
                      <strong>Responsable:</strong> ${element.usuario}
                      <br>
                      <strong>Soporte:</strong> ${evidencia}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      });
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    // ListarDespachos(d.getElementById('fecha_inicial').value, d.getElementById('fecha_final').value, d.getElementById('cliente_id').value, d.getElementById('numdoc_predido').value, filtro);
  }
}

function codificarBase64(texto) {
  return btoa(texto);
}

// Función para decodificar Base64
function decodificarBase64(textoCodificado) {
  return atob(textoCodificado);
}
