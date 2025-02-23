$(document).ready(function() {
  $('.select2').select2();
  $.post(
    $('#id_url_ajax').val() + 'transporte/Buscar_Mnf_Cumplido',
    function(data) {
      $('#placao').html('<option value="">Seleccione</option>');
      if (data) {
        for (var i = 0; i < data.length; i++) {
          let autorizacion = '';
          if (data[i]['num_autorizacion'] != '' && data[i]['num_autorizacion'] != null) {
            autorizacion = data[i]['num_autorizacion'];
          } else {
            autorizacion = 'Sin numero';
          }
          $('#placao').append('<option value="' + data[i]['id'] + '">' + data[i]['id'] + ' ' + data[i]['placa'] + ' (' + autorizacion + ') - ' + data[i]['fecha_expedicion'] + ' </option>');
        }
      } else {
        $('#placao').html('');
      }
    },
    'json',
  );
  $('#placao').change(function() {
    //Datos del manifiesto
    var manifiesto = $('#placao').val();
    $.post(
      $('#id_url_ajax').val() + 'transporte/Manifiesto_Cumplido',
      'idmanifi=' + manifiesto,
      function(data) {
        if (data) {
          var clasifica;
          if (data['tipo_manifiesto'] == 1) {
            clasifica = 'General';
          }
          if (data['tipo_manifiesto'] == 2) {
            clasifica = 'Paqueteo';
          }
          if (data['tipo_manifiesto'] == 3) {
            clasifica = 'Urbano de puertos';
          }
          if (data['tipo_manifiesto'] == 4) {
            clasifica = 'Masivo';
          }
          if (data['tipo_manifiesto'] == 5) {
            clasifica = 'Semimasivo';
          }
          if (data['tipo_manifiesto'] == 6) {
            clasifica = 'Urbano';
          }
          if (data['tipo_manifiesto'] == 7) {
            clasifica = 'Movimiento contenedores';
          }
          $('#id_manifiesto').val(data['id']);
          $('#o_fecha_exedicion').val(data['fecha_expedicion']);
          $('#tipo_manifiesto').val(clasifica);
          $('#origen').val(data['ori']);
          $('#destino').val(data['dest']);
          $('#placa').val(data['placa']);
          $('#nameposee').val(data['nameposeedor'] + ' ' + data['poseape1'] + ' ' + data['poseape2']);
          $('#docposee').val(data['docposeedor']);
          $('#namepropi').val(data['namepropi'] + ' ' + data['proape1'] + ' ' + data['proape2']);
          $('#docpropi').val(data['docpropi']);
          $('#nameconduc').val(data['nameconduc'] + ' ' + data['conduape1'] + ' ' + data['conduape2']);
          $('#docconduc').val(data['docucondu']);
          $('#fecha_pago').val(data['fecha_pago']);
          $('#agencia_pago').val(data['lugar']);
        } else {
          $('#id_manifiesto').val('');
          $('#o_fecha_exedicion').val('');
          $('#tipo_manifiesto').val('');
          $('#origen').val('');
          $('#destino').val('');
          $('#placa').val('');
          $('#nameposee').val('');
          $('#docposee').val('');
          $('#namepropi').val('');
          $('#docpropi').val('');
          $('#nameconduc').val('');
          $('#docconduc').val('');
          $('#cant_multa').val('');
          $('#tarif_multa').val('');
          $('#valor_multa').val('');
          $('#fecha_pago').val('');
          $('#agencia_pago').val('');
        }
      },
      'json',
    );
    //ordenes de cargue
    $.post(
      $('#id_url_ajax').val() + 'transporte/Ordenes_Cumplido',
      'idmanifi=' + manifiesto,
      function(data) {
        if (data) {
          $('#tabla_cargue').html('');
          for (var i = 0; i < data.length; i++) {
            $('#tabla_cargue').append(
              '<tr>' +
                '<td><input type="text" class="form-control input-sm" value="' +
                data[i]['id_orden_cargue'] +
                '" readonly="readonly"></td>' +
                '<td><input type="text" class="form-control input-sm"  value="' +
                data[i]['fecha_cargue'] +
                '" readonly="readonly"></td>' +
                '<td><input type="text" class="form-control input-sm" value="' +
                data[i]['hora_cargue'] +
                '" readonly="readonly"></td>' +
                '<td><input type="text" class="form-control input-sm" value="' +
                data[i]['obs_cargue'] +
                '" readonly="readonly"></td>' +
                '<td><input type="text" class="form-control input-sm" value="' +
                data[i]['tipo_fecha'] +
                '" readonly="readonly"></td>' +
                '</tr>',
            );
          }
        }
      },
      'json',
    );
    //Remesas
    $.post(
      $('#id_url_ajax').val() + 'transporte/Remesas_Cumplido',
      'idmanifi=' + manifiesto,
      function(data) {
        if (data) {
          $('#tabla_descargue').html('');
          for (var i = 0; i < data.length; i++) {
            $('#tabla_descargue').append(
              '<tr>' +
                '<td><input type="text" class="form-control input-sm chreme" value="' +
                data[i]['id_remesa'] +
                '" readonly="readonly"></td>' +
                '<td><input type="text" class="form-control input-sm chfecha" value="' +
                data[i]['fecha_descargue'] +
                '" readonly="readonly"></td>' +
                '<td><input type="text" class="form-control input-sm chhora" value="' +
                data[i]['hora_descargue'] +
                '" readonly="readonly"></td>' +
                '<td><input type="text" class="form-control input-sm chobs" value="' +
                data[i]['obs_descargue'] +
                '" readonly="readonly"></td>' +
                '<td><input type="text" class="form-control input-sm chtipo" value="' +
                data[i]['tipo_fecha'] +
                '" readonly="readonly"></td>' +
                '</tr>',
            );
          }
        }
      },
      'json',
    );
  });

  //Valor Multa
  $('#cant_multa').change(function() {
    var canti = $('#cant_multa').val();
    var tari = 50000;
    var multi = parseFloat(tari) * parseFloat(canti);
    $('#valor_multa').val(multi);
  });

  $('#Registrar_Cumplido').click(function() {
    if (window.confirm('¿Deseas guardar el cumplido?')) {
      // Código a ejecutar si el usuario hace clic en "Aceptar"
      var msg_error = '';
      if (!$('#placao').val()) {
        msg_error += '<p>Debe ingresar el <strong>Manifiesto</strong> para registrar el Cumplido</p>';
      }
      if (!$('#id_manifiesto').val()) {
        msg_error += '<p>Debe ingresar el <strong>Manifiesto Seleccionado</strong> para registrar el Cumplido</p>';
      }
      if (!$('#o_fecha_exedicion').val()) {
        msg_error += '<p>Debe ingresar el <strong>Fecha de expedición</strong> para registrar el Cumplido</p>';
      }
      if (!$('#tipo_manifiesto').val()) {
        msg_error += '<p>Debe ingresar el <strong>Tipo Manifiesto</strong> para registrar el Cumplido</p>';
      }
      if (!$('#origen').val()) {
        msg_error += '<p>Debe ingresar el <strong>Origen</strong> para registrar el Cumplido</p>';
      }
      if (!$('#destino').val()) {
        msg_error += '<p>Debe ingresar el <strong>destino</strong> para registrar el Cumplido</p>';
      }
      if (!$('#placa').val()) {
        msg_error += '<p>Debe ingresar el <strong>Placa</strong> para registrar el Cumplido</p>';
      }
      if (!$('#nameposee').val()) {
        msg_error += '<p>Debe ingresar el <strong>Nombre Poseedor</strong> para registrar el Cumplido</p>';
      }
      if (!$('#docposee').val()) {
        msg_error += '<p>Debe ingresar el <strong>Documento Poseedor</strong> para registrar el Cumplido</p>';
      }
      if (!$('#namepropi').val()) {
        msg_error += '<p>Debe ingresar el <strong>Nombre Propietario</strong> para registrar el Cumplido</p>';
      }
      if (!$('#docpropi').val()) {
        msg_error += '<p>Debe ingresar el <strong>Documento Propietario</strong> para registrar el Cumplido</p>';
      }
      if (!$('#nameconduc').val()) {
        msg_error += '<p>Debe ingresar el <strong>Nombre Conductor</strong> para registrar el Cumplido</p>';
      }
      if (!$('#docconduc').val()) {
        msg_error += '<p>Debe ingresar el <strong>Documento Conductor</strong> para registrar el Cumplido</p>';
      }
      if (!$('#valor_multa').val()) {
        msg_error += '<p>Debe ingresar el <strong>Valor Multa, ingrese Cantidad Multa</strong> para registrar el Cumplido</p>';
      }
      if (!$('#fecha_pago').val()) {
        msg_error += '<p>Debe ingresar el <strong>Fecha de Pago</strong> para registrar el Cumplido</p>';
      }
      if (!$('#agencia_pago').val()) {
        msg_error += '<p>Debe ingresar el <strong>Agencia de Pago</strong> para registrar el Cumplido</p>';
      }
      if (!$('#tabla_cargue tr').val().length == 0) {
        msg_error += '<p>Debe ingresar el <strong></strong> para registrar el Cumplido</p>';
      }
      if (!$('#tabla_descargue').val().length == 0) {
        msg_error += '<p>Debe ingresar el <strong></strong> para registrar el Cumplido</p>';
      }
      if (!$('#expide_cumplido').val()) {
        msg_error += '<p>Debe ingresar el <strong>Fecha de expedición cumplido</strong> para registrar el Cumplido</p>';
      }
      if (!$('#noveda').val()) {
        msg_error += '<p>Debe ingresar el <strong>Novedad</strong> para registrar el Cumplido</p>';
      }
      if (!msg_error) {
        Crear_Cumplido_inicial($('#id_manifiesto').val());
        // Crear_Cumplido();
      } else {
        $('#msg_present').html(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
            msg_error +
            '</div></div>',
        );
        $('.panel-body').animate({scrollTop: 0}, 900);
      }
    } else {
      // Código a ejecutar si el usuario hace clic en "Cancelar"
      console.log('Operación Cancelada.');
    }
  });
});

function Crear_Cumplido_inicial(num_manifiesto) {
  // Cumplido inicial de remesa
  var proceso = 3;
  var paquete = 'num_manifiesto=' + num_manifiesto + '&proceso=' + proceso + '&dato=3' + '&filtro=""' + '&tipopro=3';

  $.ajax({
    url: $('#id_url_ajax').val() + 'web_service/Transmite_Cumplido_Inicial',
    type: 'POST',
    data: paquete,
    dataType: 'json',
    beforeSend: function() {
      // Mostrar el indicador de carga
      $('#loading-overlay-rndc ').css('display', 'flex'); // Mostrar mensaje de carga
    },
    success: function(data) {
      for (var z = 0; z < data.length; z++) {
        var mensaje = JSON.stringify(data[z]);
        $('#msg_present').append(
          '<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado! Resultado Remesa RNDC</strong> ' +
            mensaje +
            '</div></div>',
        );
        $('#accordion1').animate({scrollTop: 0}, 900, 'swing');
      }
    },
    complete: function() {
      // Ocultar el indicador de carga, sin importar si fue éxito o error
      $('#loading-overlay-rndc ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      Cumplido_Manifiesto_Rndc(num_manifiesto);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error al procesar la solicitud:', textStatus, errorThrown);
      $('#msg_present').append(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong> Se produjo un error al transmitir el cumplido inicial.</div></div>',
      );
      $('#accordion1').animate({scrollTop: 0}, 900);
    },
  });
}

function Cumplido_Manifiesto_Rndc(num_manifiesto) {
  var resultado = false;
  var proceso = 3;
  var paquete_transmite = 'id=' + num_manifiesto + '&proceso=' + proceso + '&dato=3' + '&filtro=""' + '&tipopro=3';

  $.ajax({
    url: $('#id_url_ajax').val() + 'web_service/Transmite_Cumplido',
    type: 'POST',
    data: paquete_transmite,
    dataType: 'json',
    beforeSend: function() {
      // Mostrar el indicador de carga
      $('#loading-overlay-rndc ').css('display', 'flex'); // Mostrar mensaje de carga
    },
    success: function(data) {
      if (data.status == 'true') {
        resultado = true;
        var tablas_locales = 'Se Registro Cumplido ' + data.num_cumplido + ' Exitosamente RNDC';
        $('#msg_present').append(
          '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="check" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
            tablas_locales +
            ' - ' +
            data.resultado +
            '</div></div>',
        );
        $('#accordion1').animate({scrollTop: 0}, 900);
        // Crea_Dato_Oet(num_manifiesto); // Comentado, según tu código
        setTimeout(() => {
          window.location.reload();
        }, 6000);
      } else if (data.status == 'false') {
        resultado = false;
        var tablas_locales = 'No se creo Cumplido ' + data.num_cumplido + ' en RNDC';
        $('#msg_present').append(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
            tablas_locales +
            ' - ' +
            data.resultado +
            '</div></div>',
        );
        $('#accordion1').animate({scrollTop: 0}, 900);
      }
    },
    complete: function() {
      $('#loading-overlay-rndc').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      // Ocultar el indicador de carga, sin importar si fue éxito o error
      if (resultado === true) {
        $('#loading-overlay-rndc').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        // Crea_Dato_Oet(num_manifiesto);
        Crear_Cumplido();
      } else {
        $('#loading-overlay-rndc').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        alert('Manifiesto no cumplido en el ministerio de transporte');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error al procesar la solicitud:', textStatus, errorThrown);
      $('#loading-overlay-rndc').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      $('#msg_present').append(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong> Se produjo un error al transmitir el cumplido.</div></div>',
      );
      $('#accordion1').animate({scrollTop: 0}, 900);
    },
  });
}

function Crear_Cumplido() {
  var num_manifiesto = '';

  var manifi = $('#placao').val();
  var id_manifiesto = $('#id_manifiesto').val();
  var fec_expide = $('#o_fecha_exedicion').val();
  var tipo_manifiesto = $('#tipo_manifiesto').val();
  var origen = $('#origen').val();
  var destino = $('#destino').val();
  var placa = $('#placa').val();
  var nameposee = $('#nameposee').val();
  var docposee = $('#docposee').val();
  var namepropi = $('#namepropi').val();
  var docpropi = $('#docpropi').val();
  var nameconduc = $('#nameconduc').val();
  var docconduc = $('#docconduc').val();
  var cant_multa = $('#cant_multa').val();
  var tarif_multa = $('#tarif_multa').val();
  var valor_multa = $('#valor_multa').val();
  var expide_cum = $('#expide_cumplido').val();
  var nove = $('#noveda').val();

  // Remesas
  var dato = {
    idremesa: [],
    fecha: [],
    hora: [],
    obs: [],
    tipo: [],
  };
  $('.chreme').each(function(index) {
    var a = $(this).val();
    dato.idremesa[index] = a;
  });
  $('.chfecha').each(function(index) {
    var fec = $(this).val();
    dato.fecha[index] = fec;
  });
  $('.chhora').each(function(index) {
    var a = $(this).val();
    dato.hora[index] = a;
  });
  $('.chobs').each(function(index) {
    var a = $(this).val();
    dato.obs[index] = a;
  });
  $('.chtipo').each(function(index) {
    var a = $(this).val();
    dato.tipo[index] = a;
  });
  var nota_remesa = dato;
  nota_remesa = JSON.stringify(nota_remesa);

  var paquete = 'manifi=' + manifi + '&placa=' + placa + '&cantim=' + cant_multa + '&tarim=' + tarif_multa + '&valorm=' + valor_multa + '&remesa=' + nota_remesa + '&nove=' + nove;

  $.ajax({
    url: $('#id_url_ajax').val() + 'transporte/Registro_Cumplido',
    type: 'POST',
    data: paquete,
    dataType: 'json',
    beforeSend: function() {
      // Mostrar el indicador de carga
      $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
    },
    success: function(data) {
      if (data.status == true) {
        pal = 'Proceso terminado';
        num_manifiesto = $('#id_manifiesto').val();
        msg_texto = 'Datos Registrados Exitosamente NEXOSAPP';
        sessionStorage.setItem(
          'mensaje_nexos',
          `<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible">
            <div class="icon">
              <span class="mdi mdi-check"></span>
            </div>
            <div class="message">
              <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button>
                <strong>${pal}!</strong> ${msg_texto}
              </div>
            </div>`,
        );
      } else if (data.status == false) {
        pal = 'Proceso terminado';
        msg_texto = 'Datos No Registrados NEXOSAPP';
        sessionStorage.setItem(
          'mensaje_nexos',
          `<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible">
            <div class="icon">
              <span class="mdi mdi-check"></span>
            </div>
            <div class="message">
              <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button>
                <strong>${pal}!</strong> ${msg_texto}
              </div>
            </div>`,
        );
        $('#accordion1').animate({scrollTop: 0}, 900);
      }
    },
    complete: function() {
      // Ocultar el indicador de carga, sin importar si fue éxito o error
      $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      // Crear_Cumplido_inicial(num_manifiesto);
      Crea_Dato_Oet(num_manifiesto);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error al procesar la solicitud:', textStatus, errorThrown);
      $('#msg_present').append(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong> Se produjo un error al registrar los datos.</div></div>',
      );
      $('#accordion1').animate({scrollTop: 0}, 900);
    },
  });
}

function Crea_Dato_Oet(num_manifiesto) {
  var recurso = 4;
  var paquete = 'recurso=' + recurso + '&numero=' + num_manifiesto;

  $.ajax({
    url: $('#id_url_ajax').val() + 'integrar_oet/Consulta_Transacciones',
    type: 'POST',
    data: paquete,
    dataType: 'json',
    beforeSend: function() {
      // Mostrar el indicador de carga
      $('#loading-overlay-oet ').css('display', 'flex'); // Mostrar mensaje de carga
    },
    success: function(data) {
      if (data.status == true || data.status == 'true') {
        var pal = 'Proceso terminado';
        var msg_texto = 'Datos Registrados Exitosamente OET';
        $('#msg_present').append(
          '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>' +
            pal +
            '!</strong>' +
            msg_texto +
            '</div></div>',
        );
        $('#accordion1').animate({scrollTop: 0}, 900);
        setTimeout(function() {
          location.reload(false);
        }, 6000);
      } else if (data.status == false || data.status == 'false') {
        var pal = 'Proceso terminado';
        var msg_texto = 'Datos No Registrados Exitosamente OET';
        $('#msg_present').append(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>' +
            pal +
            '!</strong>' +
            msg_texto +
            ' ' +
            data.error +
            '</div></div>',
        );
        $('#accordion1').animate({scrollTop: 0}, 900);
        setTimeout(function() {
          location.reload(false);
        }, 6000);
      }
    },
    complete: function() {
      // Ocultar el indicador de carga, sin importar si fue éxito o error
      // $('#loadingIndicator').hide();
      $('#loading-overlay-oet ').css('display', 'none'); // Mostrar mensaje de carga
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error al procesar la solicitud:', textStatus, errorThrown);
      $('#msg_present').append(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong> Se produjo un error al procesar la solicitud.</div></div>',
      );
      $('#accordion1').animate({scrollTop: 0}, 900);
    },
  });
}
