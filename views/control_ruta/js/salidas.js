const w = window;
const d = document;

d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  listar_manifiestos_salida();
});

async function listar_manifiestos_salida() {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'control_ruta/Dato_salida', {
      method: 'POST',
      // body: formdata,
      cache: 'no-cache',
    });
    const data = await response.json();
    let tipo_manifiesto = '';
    const tbody = d.getElementById('tablero_salida');
    tbody.innerHTML = '';
    data.forEach(element => {
      var fila = d.createElement('tr');
      const columnaManifiesto = d.createElement('td');
      columnaManifiesto.innerHTML = `<a  href="#" onClick="abrir_detalle(${element.id})">${element.id}</a>`;
      columnaManifiesto.style.textAlign = 'center';
      // columnaManifiesto.textContent = element.id;
      // if (element.tipo_manifiesto === '1') {
      //   tipo_manifiesto = 'General';
      // } else if (element.tipo_manifiesto === '3') {
      //   tipo_manifiesto = 'Viaje Vacio';
      // } else if (element.tipo_manifiesto === '4') {
      //   tipo_manifiesto = 'Varios viajes en el Dia';
      // } else if (element.tipo_manifiesto === '8') {
      //   tipo_manifiesto = 'Viaje de Ida y Regreso';
      // }
      // const columnaTipoManifiesto = d.createElement('td');
      // columnaTipoManifiesto.textContent = tipo_manifiesto;
      const columnaAgencia = d.createElement('td');
      columnaAgencia.textContent = element.Lugar;
      // const columnaTipoTransporte = d.createElement('td');
      // columnaTipoTransporte.textContent = element.tipo_transporte;
      const columnaOrigen = d.createElement('td');
      columnaOrigen.textContent = element.origen;
      const columnaDestino = d.createElement('td');
      columnaDestino.textContent = element.destino;
      const columnaPlaca = d.createElement('td');
      columnaPlaca.textContent = element.placa;
      // const columnaGps = d.createElement('td');
      // columnaGps.textContent = element.web_satelital;
      const columnaConductor = d.createElement('td');
      columnaConductor.textContent = element.Nombre_Conductor + ' ' + element.apellido1 + ' ' + element.apellido2;
      const columnaCelular = d.createElement('td');
      columnaCelular.textContent = element.celular;

      fila.appendChild(columnaManifiesto);
      // fila.appendChild(columnaTipoManifiesto);
      fila.appendChild(columnaAgencia);
      // fila.appendChild(columnaTipoTransporte);
      fila.appendChild(columnaOrigen);
      fila.appendChild(columnaDestino);
      fila.appendChild(columnaPlaca);
      // fila.appendChild(columnaGps);
      fila.appendChild(columnaConductor);
      fila.appendChild(columnaCelular);
      // Rendreizar la tabla
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    $('#crea_vehiculos').css('display', 'none');
    $('#mensaje_token_estudio').html(
      '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><i class="fas fa-times"></i></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Ha ocurrrido un error ' +
        'Error en la primera solicitud:',
      error + '.</div></div>',
    );
    throw error;
  } finally {
    // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}

function abrir_detalle(manifiesto) {
  url = $('#id_url_ajax').val() + 'control_ruta/manifiesto_salida/?idmenu=5&m=' + codificarBase64(manifiesto);
  window.open(url, '_self');
}
