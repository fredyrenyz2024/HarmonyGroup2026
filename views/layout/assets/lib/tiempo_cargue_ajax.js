$(document).ready(function () {
  // alert('ZABU MAFU');

  $.post(
    $('#id_url_ajax').val() + 'tiempo_logistico_cargue/Selecciona_Manifiesto',
    function (data) {
      $('#manifiestos').html('<option value="">Seleccione</option>');
      if (data) {
        for (var m = 0; m < data.length; m++) {
          $('#manifiestos').append('<option value="' + data[m]['id'] + '">' + data[m]['id'] + ' - ' + data[m]['placa'] + '</option>');
        }
      } else {
        $('#manifiestos').html('');
      }
    },
    'json',
  );

  $('#manifiestos').change(function () {
    $('#occargue').html('');
    var mnf = $('#manifiestos').val();
    $.post(
      $('#id_url_ajax').val() + 'tiempo_logistico_cargue/Selecciona_Ordenes',
      'manifiesto=' + mnf,
      function (data) {
        if (data) {
          for (var i = 0; i < data.length; i++) {
            $('#occargue').append('<option value="' + data[i]['id_orden'] + '">' + data[i]['id_orden'] + '</option>');
          }
        }
      },
      'json',
    );
  });

  $('#busca_dato').click(function () {
    $('.nexos-messages').html('');
    var msg_error = '';
    if (!$('#manifiestos').val()) {
      msg_error += '<p>Debe seleccionar <strong>Manifiesto</strong> para registrar los Tiempos Lógísticos de Cargue</p>';
    }
    if (!$('#occargue').val()) {
      msg_error += '<p>Debe seleccionar <strong>Orden</strong> para registrar los Tiempos Lógísticos de Cargue</p>';
    }
    if (!msg_error) {
      Buscar_Dato($('#manifiestos').val());
    } else {
      $('.nexos-messages').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          '</div></div>',
      );
      $('.nexos-content').animate({scrollTop: 2}, 600);
    }
  });

  $('#registrar_tiempo').click(function () {
    $('.nexos-messages').html('');
    var msg_error = '';
    if (!$('#fircargar').val()) {
      msg_error += '<p>Debe registrar la fecha de salida al lugar cargue</p>';
    }
    if (!$('#hircargar').val()) {
      msg_error += '<p>Debe registrar la hora de salida al lugar cargue</p>';
    }
    if (!$('#firllegada').val()) {
      msg_error += '<p>Debe registrar la fecha de llegada al lugar de cargue</p>';
    }
    if (!$('#hirllegada').val()) {
      msg_error += '<p>Debe registrar la hora de llegada al lugar de cargue</p>';
    }
    if (!$('#firentrada').val()) {
      msg_error += '<p>Debe registrar la fecha de entrada al lugar de cargue</p>';
    }
    if (!$('#hirentrada').val()) {
      msg_error += '<p>Debe registrar la hora de llegada al lugar de cargue</p>';
    }
    if (!$('#firsalida').val()) {
      msg_error += '<p>Debe registrar la fecha de salida al lugar de cargue</p>';
    }
    if (!$('#hirsalida').val()) {
      msg_error += '<p>Debe registrar la hora de salida al lugar de cargue</p>';
    }
    //fechas de captura
    var feccaptura = $('#fircargar').val() + ' ' + $('#hircargar').val();
    var fec2 = $('#firllegada').val() + ' ' + $('#hirllegada').val();
    var fec3 = $('#firentrada').val() + ' ' + $('#hirentrada').val();
    var fec4 = $('#firsalida').val() + ' ' + $('#hirsalida').val();
    //completar fechas
    var fcaptura2 = feccaptura + ':00';
    var fecllegada = fec2 + ':00';
    var fecentrada = fec3 + ':00';
    var fecsalida = fec4 + ':00';
    //color formato fecha-mes-dia hora-minuto-segundo a todas las fechas capturadas
    var A = moment(fcaptura2).format('YYYY-MM-DD HH:mm:ss');
    var B = moment(fecllegada).format('YYYY-MM-DD HH:mm:ss');
    var C = moment(fecentrada).format('YYYY-MM-DD HH:mm:ss');
    var D = moment(fecsalida).format('YYYY-MM-DD HH:mm:ss');
    //formatear fechas
    var captura = moment(A);
    var captura2 = moment(B);
    var captura3 = moment(C);
    var captura4 = moment(D);
    //sacar la diferencia de cada fecha
    var tf1 = captura.diff(captura2, 'minutes');
    var tf2 = captura2.diff(captura3, 'minutes');
    var tf3 = captura3.diff(captura4, 'minutes');

    tf1 = Math.abs(tf1);
    tf2 = Math.abs(tf2);
    tf3 = Math.abs(tf3);

    if (fcaptura2 >= fecllegada) {
      msg_error += '<p>La fecha 2 debe ser <strong> mayor </strong> a la fecha 1, para registrar los Tiempos Logísticos de Cargue</p>';
    }
    if (fecllegada >= fecentrada) {
      msg_error += '<p>La fecha 3 debe ser <strong> mayor </strong> a la fecha 2, para registrar los Tiempos Logísticos de Cargue</p>';
    }
    if (fecentrada >= fecsalida) {
      msg_error += '<p>La fecha 4 debe ser <strong> mayor </strong> a la fecha 3, para registrar los Tiempos Logísticos de Cargue</p>';
    }
    if (tf1 <= 15) {
      msg_error += '<p>Entre la fecha 1 y entre la fecha 2 debe haber 15 minutos de diferencia</p>';
    }
    if (tf2 <= 15) {
      msg_error += '<p>Entre la fecha 2 y entre la fecha 3 debe haber 15 minutos de diferencia</p>';
    }
    if (tf3 <= 15) {
      msg_error += '<p>Entre la fecha 3 y entre la fecha 4 debe haber 15 minutos de diferencia</p>';
    }
    if (!msg_error) {
      Registrar_Tiempo();
    } else {
      $('.nexos-messages').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          '</div></div>',
      );
      $('.nexos-content').animate({scrollTop: 2}, 600);
    }
  });
});

function Registrar_Tiempo() {
  alert('registrar tiempo');
  $('#manifiestos').val();
  var manifiesto = $('#idmanifiesto').val();
  var placa = $('#placa').val();
  idprincipal = '';
  var dato = {
    orden: [],
  };
  var arreglo = new Array();
  $('#occargue').each(function () {
    var numero_orden = $(this).val();
    arreglo.push(numero_orden);
  });
  orden = arreglo;
  //fecha1
  var tp1 = $('#tpfecha1').val();
  var f1 = $('#fircargar').val();
  var h1 = $('#hircargar').val();
  var ob1 = $('#obs1').val();
  //fecha2
  var tp2 = $('#tpfecha2').val();
  var f2 = $('#firllegada').val();
  var h2 = $('#hirllegada').val();
  var ob2 = $('#obs2').val();
  //fecha 3
  var tp3 = $('#tpfecha3').val();
  var f3 = $('#firentrada').val();
  var h3 = $('#hirentrada').val();
  var ob3 = $('#obs3').val();
  //fecha 4
  var tp4 = $('#tpfecha4').val();
  var f4 = $('#firsalida').val();
  var h4 = $('#hirsalida').val();
  var ob4 = $('#obs4').val();
  //construir paquete de datos
  /*paquete_tiempo="manifieso="+mnf+"&fircargar="+fircargar+"&hircargar="+hircargar+"&observair="+observair
	+"&num_oden="+orden+"&placa="+placa_v+"&idtabla="+idprincipal;*/
  paquete_tiempo =
    'manifiesto=' +
    manifiesto +
    '&placa=' +
    placa +
    '&tipofechacarga=' +
    tp1 +
    '&fircargar=' +
    f1 +
    '&hircargar=' +
    h1 +
    '&observair=' +
    ob1 +
    '&tipofechallega=' +
    tp2 +
    '&fllegcargar=' +
    f2 +
    '&hllegcargar=' +
    h2 +
    '&obserllego=' +
    ob2 +
    '&tipofechaentro=' +
    tp3 +
    '&fentrocarga=' +
    f3 +
    '&hentrocarga=' +
    h3 +
    '&obsentro=' +
    ob3 +
    '&tipofechasali=' +
    tp4 +
    '&fsalidacarga=' +
    f4 +
    '&hsalidacarga=' +
    h4 +
    '&obssalio=' +
    ob4 +
    '&num_orden=' +
    orden;
  $.post($('#id_url_ajax').val() + 'tiempo_logistico_cargue/Registro_Tiempo_Cargue', paquete_tiempo, function (data) {
    if (data.Numero === 200) {
      $('.nexos-messages').html(
        '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          data.Mensaje +
          '</div></div>',
      );
      $('.nexos-content').animate({scrollTop: 2}, 600);
      // location.reload();
    } else {
      mensaje = 'Datos No fueron Registrados!!';
      $('.nexos-messages').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          mensaje +
          '</div></div>',
      );
      $('.nexos-content').animate({scrollTop: 2}, 600);
    }
    // if (data == "true" || data == true) {
    //   mensaje = "Datos Registrados Exitosamente!!";
    //   $(".nexos-messages").html(
    //     '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
    //       mensaje +
    //       "</div></div>",
    //   );
    //   $(".nexos-content").animate({scrollTop: 2}, 600);
    //   location.reload();
    //   //crear_dato_rndc();
    // } else {
    //   mensaje = "Datos No fueron Registrados!!";
    //   $(".nexos-messages").html(
    //     '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
    //       mensaje +
    //       "</div></div>",
    //   );
    //   $(".nexos-content").animate({scrollTop: 2}, 600);
    //   location.reload();
    // }
  });
}

function Buscar_Dato(manifiesto) {
  mnf = manifiesto;
  $.post(
    $('#id_url_ajax').val() + 'tiempo_logistico_cargue/Selecciona_Manifiesto_Individual',
    'manifiesto=' + mnf,
    function (data) {
      $('#datoa').html('');
      if (data) {
        $('#num_manifiesto').html(data['id']);
        $('#numplaca').html(data['placa']);
        $('#nummarca').html(data['marca']);
        $('#numcolor').html(data['color']);
        $('#nummodelo').html(data['anio_fabricacion']);
        $('#numcondu').html(data['conductor'] + ' ' + data['conape1'] + ' ' + data['conape2']);
        $('#numdocume').html(data['docconductor']);
        $('#numtele').html(data['celular']);
        $('#numpropi').html(data['propietario'] + ' ' + data['apellido1'] + ' ' + data['apellido2']);
        $('#numdocpro').html(data['docpropietario']);
        $('#idmanifiesto').val(data['id']);
        $('#placa').val(data['placa']);
      }
    },
    'json',
  );
}
