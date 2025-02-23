$(document).ready(function () {
  Tabla_llegada();

  const searchInput = document.getElementById('buscar_manifiesto');
  searchInput.addEventListener('input', async (e) => {
    const searchTerm = searchInput.value.trim();
    // Realizar una solicitud AJAX para obtener resultados desde el servidor
    if (searchTerm !== '') {
      // Realizar una solicitud AJAX para obtener resultados desde el servidor
      $.post(
        $('#id_url_ajax').val() + 'control_ruta/Buscar_manifiesto_llegada',
        {datos: searchTerm},
        function (data) {
          // console.log(data);
          Tabla_Filtro(data);
        },
        'json',
      );
    } else {
      // Limpiar los resultados si el campo de búsqueda está vacío
      Tabla_SinFiltro();
    }
  });
});

$('#btn_finalizar').click(async function () {
  let dato = new FormData();
  dato.append('maniesto', $('#maniesto').val());
  dato.append('cod_inicio', $('#cod_inicio').val());
  dato.append('cod_punto', $('#cod_punto').val());
  try {
    const response = await fetch($('#id_url_ajax').val() + 'control_ruta/finalziar_Seguimiento', {
      method: 'POST',
      body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data.numero == 200) {
      let mensaje = `
      <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role = "alert">
          <div class="icon"><span class="mdi mdi-check"></span></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
            <strong>Mensaje!</strong> ${data.mensaje}
          </div>
      </div> `;
      document.getElementById('mensaje').innerHTML = mensaje;
      $('#d-footer-primary').modal('toggle');
      Tabla_llegada();
    } else {
      let mensaje = `
      <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role = "alert">
          <div class="icon"><i class="fas fa-times"></i></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
            <strong>Mensaje!</strong> Error al finalziar el Manifiesto.
          </div>
      </div> `;
      document.getElementById('mensaje').innerHTML = mensaje;
    }
  } catch (error) {
    console.error('Error en la segunda solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
  }
});

function Tabla_Filtro(data) {
  if (data) {
    $('#tablero_llegada').html('');
    var c = 0;
    var template = '';
    var tipo_manifiesto = '';
    for (var m = 0; m < data.length; m++) {
      c++;
      codigo_inicio = data[m]['cod_ini_ruta'];
      if (data[m]['tipo_manifiesto'] == 1) {
        tipo_manifiesto = 'General';
      } else if (data[m]['tipo_manifiesto'] == 2) {
        tipo_manifiesto = 'Multiparada';
      } else if (data[m]['tipo_manifiesto'] == 3) {
        tipo_manifiesto = 'Viaje Vacío';
      } else if (data[m]['tipo_manifiesto'] == 4) {
        tipo_manifiesto = 'Varios viajes en el Dia';
      } else if (data[m]['tipo_manifiesto'] == 8) {
        tipo_manifiesto = 'Viaje de Ida y Regreso';
      }

      template += `
            <tr id="tiempos${c}">
              <td style="text-align: center;white-space: nowrap;width: auto;" id="semaforo${c}" ><a href="#" onClick="Finalizar_seguiemto(${data[m]['id']})">${data[m]['id']}</a></td>
              <td style="white-space: nowrap;width: 65px;">${tipo_manifiesto}</td>
              <td style="white-space: nowrap;width: 127px;">${data[m]['Lugar']}</td>
              <td style="white-space: nowrap;width: auto;">${data[m]['origen']}</td>
              <td style="white-space: nowrap;width: auto;">${data[m]['destino']}</td>
              <td style="white-space: nowrap;width: auto;">${data[m]['mer_producto']}</td>
              <td style="white-space: nowrap;width: auto;">${data[m]['tipo_transporte']}</td>
              <td style="white-space: nowrap;width: auto;" class="cell-detail">${data[m]['placa']}</td>
              <td style="white-space: nowrap;width: auto;" class="cell-detail">${data[m]['apellido1']} ${data[m]['apellido1']}</td>
              <td style="white-space: nowrap;width: auto;" class="cell-detail">${data[m]['celular']}</td>
              <td style="white-space: nowrap;width: auto;" class="cell-detail">${data[m]['nombre']}</td>
              <td style="white-space: nowrap;width: auto;" id="maxnovedad${c}"></td>
              <td style="white-space: nowrap;width: auto;" id="maxhorafecha${c}"></td>
              <td style="white-space: nowrap;width: auto;" id="ultimositio${c}"></td>
              <td nowrap id="ultimaobservacion${c}"></td>
              <td style="white-space: nowrap;width: auto;" id="ultimaousuario${c}"></td>
            </tr>
          `;
      $('#tablero_llegada').html(template);

      if (data[m]['cod_ini_ruta'] != null) {
        var codini = data[m]['cod_ini_ruta'];
        // Actualizar la tabla cada minuto (60000 ms)
        // semaforo(codini, c, data[m]['id']);
        ultimanovedad(codini, c);
        ultimahorafecha(codini, c);
        traer_punto(codini);
        $('#cod_inicio').val(codini);
      }
    }
  }

  // $.post(
  //   $('#id_url_ajax').val() + 'control_ruta/Datos_SinFiltro',

  //   'json',
  // );
}

function Tabla_llegada() {
  $.post(
    $('#id_url_ajax').val() + 'control_ruta/Datos_llegada',
    function (data) {
      if (data) {
        $('#tablero_llegada').html('');
        var c = 0;
        var template = '';
        var tipo_manifiesto = '';
        for (var m = 0; m < data.length; m++) {
          c++;
          codigo_inicio = data[m]['cod_ini_ruta'];
          if (data[m]['tipo_manifiesto'] == 1) {
            tipo_manifiesto = 'General';
          } else if (data[m]['tipo_manifiesto'] == 2) {
            tipo_manifiesto = 'Multiparada';
          } else if (data[m]['tipo_manifiesto'] == 3) {
            tipo_manifiesto = 'Viaje Vacío';
          } else if (data[m]['tipo_manifiesto'] == 4) {
            tipo_manifiesto = 'Varios viajes en el Dia';
          } else if (data[m]['tipo_manifiesto'] == 8) {
            tipo_manifiesto = 'Viaje de Ida y Regreso';
          }

          template += `
              <tr id="tiempos${c}">
                <td style="text-align: center;white-space: nowrap;width: auto;" id="semaforo${c}" ><a href="#" onClick="Finalizar_seguiemto(${data[m]['id']})">${data[m]['id']}</a></td>
                <td style="white-space: nowrap;width: 65px;">${tipo_manifiesto}</td>
                <td style="white-space: nowrap;width: 127px;">${data[m]['Lugar']}</td>
                <td style="white-space: nowrap;width: auto;">${data[m]['origen']}</td>
                <td style="white-space: nowrap;width: auto;">${data[m]['destino']}</td>
                <td style="white-space: nowrap;width: auto;">${data[m]['mer_producto']}</td>
                <td style="white-space: nowrap;width: auto;">${data[m]['tipo_transporte']}</td>
                <td style="white-space: nowrap;width: auto;" class="cell-detail">${data[m]['placa']}</td>
                <td style="white-space: nowrap;width: auto;" class="cell-detail">${data[m]['apellido1']} ${data[m]['apellido1']}</td>
                <td style="white-space: nowrap;width: auto;" class="cell-detail">${data[m]['celular']}</td>
                <td style="white-space: nowrap;width: auto;" class="cell-detail">${data[m]['nombre']}</td>
                <td style="white-space: nowrap;width: auto;" id="maxnovedad${c}"></td>
                <td style="white-space: nowrap;width: auto;" id="maxhorafecha${c}"></td>
                <td style="white-space: nowrap;width: auto;" id="ultimositio${c}"></td>
                <td nowrap id="ultimaobservacion${c}"></td>
                <td style="white-space: nowrap;width: auto;" id="ultimaousuario${c}"></td>
              </tr>
            `;
          $('#tablero_llegada').html(template);

          if (data[m]['cod_ini_ruta'] != null) {
            var codini = data[m]['cod_ini_ruta'];
            // Actualizar la tabla cada minuto (60000 ms)
            // semaforo(codini, c, data[m]['id']);
            ultimanovedad(codini, c);
            ultimahorafecha(codini, c);
            traer_punto(codini);
            $('#cod_inicio').val(codini);
          }
        }
      }
    },
    'json',
  );
}

function ultimanovedad(codini, id) {
  var maximo = {
    codini: codini,
    action: 'ultima_novedad',
  };
  var url = $('#id_url_ajax').val() + 'libs/seguimientoruta_ajax.php';
  $.ajax({
    url: url,
    type: 'POST',
    data: maximo,
    dataType: 'json',
    success: function (data) {
      if (data.result != null) {
        var prisma;
        if (data.result[0].genera_alerta == 'NO') {
          prisma = '#CDCDCD';
        }
        if (data.result[0].genera_alerta == 'SI') {
          prisma = '#009B7D';
        }
        $('#maxnovedad' + id).html('<p style="color:' + prisma + '; text-align:left; font-size:8pt;"><strong>' + data.result[0].novedad + '</strong></p>');
      } else {
        $('#maxnovedad' + id).html('<strong>No existe una novedad aún</strong>');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function ultimahorafecha(codini, id) {
  var maximo = {
    codini: codini,
    // action: "ultima_novedad",
  };
  // var url = $("#id_url_ajax").val() + "libs/seguimientoruta_ajax.php";
  $.ajax({
    url: $('#id_url_ajax').val() + 'trafico/consulta_notas',
    type: 'POST',
    data: maximo,
    dataType: 'json',
    success: function (data) {
      if (data != null) {
        data.forEach((element) => {
          $('#maxhorafecha' + id).html(`<span class="cell-detail-description" style="font-size:8pt;">${element.fecha}-${element.hora}</span>`);
          $('#ultimositio' + id).html(`<p style="font-size:12px;"><b>${element.punto_plan_ruta !== null ? element.punto_plan_ruta : element.nom_punto}</b></p>`);
          $('#ultimaobservacion' + id).html(`<p style="font-size:12px;">${element.observacion}</p>`);
          $('#ultimaousuario' + id).html(`<p style="font-size:12px;">${element.usuario}</p>`);
        });
      } else {
        $('#maxhorafecha' + id).html('<strong>No existe una novedad aún</strong>');
        $('#ultimositio' + id).html('<strong>No tiene sitio de control</strong>');
        $('#maxhorafecha' + id).html('<strong>No tiene observaciones</strong>');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

async function traer_punto(codini) {
  let dato = new FormData();
  dato.append('codini', codini);
  try {
    const response = await fetch($('#id_url_ajax').val() + 'control_ruta/punto', {
      method: 'POST',
      body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      $('#cod_punto').val(data.cod_punto);
    }
  } catch (error) {
    console.error('Error en la segunda solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
  }
}

function Finalizar_seguiemto(manifiesto) {
  document.getElementById('num_man').innerHTML = manifiesto;
  $('#md-footer-primary').modal('toggle');
  $('#maniesto').val(manifiesto);
  // $('#btn_finalizar').atrr('data-manifiesto', manifiesto);
  // $("#btn_finalizar").atrr("data-cod_ini");
}
