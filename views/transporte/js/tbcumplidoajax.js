$(document).ready(function () {
  $('#contenedor_datos').hide();
  $('#tabla_datos').hide();
  $('.fec').hide();
  $('.num').hide();

  $('#filtro').change(function () {
    $filtro = $('#filtro').val();
    if ($filtro == '') {
      $('#contenedor_datos').hide();
      $('#tabla_datos').hide();
      $('.fec').hide();
      $('.num').hide();
    }
    if ($filtro == 1) {
      $('#contenedor_datos').hide();
      $('#tabla_datos').hide();
      $('.num').show();
      $('.fec').hide();
    }
    if ($filtro == 2) {
      $('#contenedor_datos').hide();
      $('#tabla_datos').hide();
      $('.num').hide();
      $('.fec').show();
    }
  });

  $('#buscar_cumplido').click(function () {
    var enviar, fec1, fec2, numero, d;
    if ($('#filtro').val() == 1) {
      d = $('#filtro').val();
      numero = $('#numnani').val();
      fec1 = '';
      fec2 = '';
      enviar = 'filtro=' + d + '&num=' + numero + '&fec1=' + fec1 + '&fec2=' + fec2;
    }
    if ($('#filtro').val() == 2) {
      d = $('#filtro').val();
      fec1 = $('#finicial').val();
      fec2 = $('#ffinal').val();
      numero = '';
      enviar = 'filtro=' + d + '&num=' + numero + '&fec1=' + fec1 + '&fec2=' + fec2;
    }
    Tabla_Cumplido();
  });

  $('#btn_imprimir').click(function () {
    var cumplido = $('#c_cumpli').val();
    $.ajax({
      url: $('#id_url_ajax').val() + 'transporte/CumplidoPdf',
      method: 'POST',
      data: { idcumplido: cumplido },
      dataType: 'json',
      success: function (data) {
        if (data) {
          cumplido = data[0]['id'];
          placa = data[0]['placa'];
          poseedor = data[0]['namete'] + ' ' + data[0]['teape1'] + ' ' + data[0]['teape2'];
          // poseedor = '';
          poseedor_documento = data[0]['docte'];
          conductor = data[0]['namecondu'] + ' ' + data[0]['conape1'] + ' ' + data[0]['conape2'];
          // conductor = '';
          conductor_documento = data[0]['doccondu'];
          condu_celular = data[0]['celular_condu'];
          marca = data[0]['marca'];
          modelo = data[0]['anio_fabricacion'];
          cant_multa = data[0]['cantidad_multa'];
          manifiesto = data[0]['manifiesto'];
          origen = data[0]['origen'];
          destino = data[0]['destino'];
          novedad = data[0]['novedad'];
          td_propie = data[0]['tipo_documento'];
          pesototal = data[0]['total_peso'];
          pesovolumen = data[0]['total_volumen'];
          fecha_pago = data[0]['nueva_fecha'];
          fecha_cumplido = data[0]['fecha_cumplido'];

          pdf_cumple =
            'numcumplido=' +
            cumplido +
            '&placa=' +
            placa +
            '&poseedor=' +
            poseedor +
            '&docposee=' +
            poseedor_documento +
            '&conductor=' +
            conductor +
            '&doccondu=' +
            conductor_documento +
            '&cel=' +
            condu_celular +
            '&marca=' +
            marca +
            '&modelo=' +
            modelo +
            '&cantmulta=' +
            cant_multa +
            '&manifiesto=' +
            manifiesto +
            '&origen=' +
            origen +
            '&destino=' +
            destino +
            '&novedad=' +
            novedad +
            '&tipodocp=' +
            td_propie +
            '&pesototal=' +
            pesototal +
            '&volumentotal=' +
            pesovolumen +
            '&fecha_pago=' +
            fecha_pago +
            '&fecha_cumplido=' +
            fecha_cumplido;

          var url = $('#id_url_ajax').val() + 'libs/cumplido_pdf.php?' + pdf_cumple;
          window.open(url, '_blank');
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  });
});

function ConsultaCumplido(id, manifiesto) {
  $('.campov').val('');
  $('#cumplidobody').html('');
  $('#tabla_datos').css('display', 'none');
  $('#contenedor_datos').css('display', 'block');
  //traer datos de la orden de cargue-cabecera
  $.post(
    $('#id_url_ajax').val() + 'transporte/ConsultaCumplido',
    'numma=' + manifiesto,
    function (data) {
      console.log(data);
      if (data) {
        $('#c_cumpli').val(data['id']);
        $('#c_placa').val(data['placa']);
        $('#c_manifi').val(data['manifiesto']);
        $('#c_nombre').val(data['conductor']);
        $('#c_numero').val(data['doccondu']);
        $('#c_propieta').val(data['propietaro']);
        $('#c_propinumero').val(data['docprop']);
        $('#c_posee').val(data['tenedor']);
        $('#c_poseenumero').val(data['docte']);
        $('#c_novedad').val(data['novedad']);
      } else {
        $('#c_cumpli').val('');
        $('#c_placa').val('');
        $('#c_manifi').val('');
        $('#c_nombre').val('');
        $('#c_numero').val('');
        $('#c_propieta').val('');
        $('#c_propinumero').val('');
        $('#c_posee').val('');
        $('#c_poseenumero').val('');
        $('#c_novedad').val('');
      }
    },
    'json',
  );
  //traer datos del remitente + destinatario
  $.post(
    $('#id_url_ajax').val() + 'transporte/ConsultaRemesas',
    'numcu=' + manifiesto,
    function (datm) {
      if (datm) {
        $('#tabla_remesas').html('');
        datm.forEach(element => {
          $('#tabla_remesas').append(
            '<tr>' +
            '<td>' +
            element['id_remesa'] +
            '</td>' +
            '<td>' +
            element['fecha'] +
            '</td>' +
            '<td>' +
            element['hora'] +
            '</td>' +
            '<td>' +
            element['observacion'] +
            '</td>' +
            '<td>' +
            element['tipo_fecha'] +
            '</td>' +
            '</tr>',
          );
        });
      }
    },
    'json',
  );
}

function AnularCumplido(idcumpli) {
  $.post(
    $('#id_url_ajax').val() + 'transporte/AnuleCumplido',
    'numcu=' + idcumpli,
    function (data) {
      if (data == 'true') {
        alert('Datos Anulados Exitosamente!!');
        Tabla_Cumplido();
      }
    },
    'json',
  );
}

function Tabla_Cumplido() {
  $('#contenedor_datos').css('display', 'none');
  $('#tabla_datos').css('display', 'block');
  var enviar, fec1, fec2, numero, d;
  if ($('#filtro').val() == 1) {
    d = $('#filtro').val();
    numero = $('#numnani').val();
    fec1 = '';
    fec2 = '';
    enviar = 'filtro=' + d + '&num=' + numero + '&fec1=' + fec1 + '&fec2=' + fec2;
  }
  if ($('#filtro').val() == 2) {
    d = $('#filtro').val();
    fec1 = $('#finicial').val();
    fec2 = $('#ffinal').val();
    numero = '';
    enviar = 'filtro=' + d + '&num=' + numero + '&fec1=' + fec1 + '&fec2=' + fec2;
  }

  $.post(
    $('#id_url_ajax').val() + 'transporte/Consultar_Tabla',
    enviar,
    function (data) {
      if (data) {
        $('#cumplidobody').html('');
        for (var i = 0; i < data.length; i++) {
          var estado;
          btnconsultar =
            '<button class="btn btn-space btn-secondary btn-sm mdi mdi-eye" title="Ver cumplido" onClick="ConsultaCumplido(' + data[i]['id'] + ',' + data[i]['manifiesto'] + ')"></button>';
          if (data[i]['estado'] == 1) {
            estado = '<p class="text-success">Activo</p>';
            btnanular = '<button class="btn btn-space btn-secondary btn-sm mdi mdi-block" title="Anular cumplido" onClick="AnularCumplido(' + data[i]['id'] + ')"></button>';
            btneditar =
              '<button class="btn btn-space btn-secondary btn-sm mdi mdi-edit" title="Editar cumplido" onClick="ConsultaCumplido(' + data[i]['id'] + ',' + data[i]['manifiesto'] + ')"></button>';
          }
          if (data[i]['estado'] == 0) {
            estado = '<p class="text-danger">Anulado</p>';
            btnanular = '';
            btneditar = '';
          }

          $('#cumplidobody').append(
            '<tr>' +
            '<td>' +
            estado +
            '</td>' +
            '<td>' +
            data[i]['id'] +
            '</td>' +
            '<td>' +
            data[i]['manifiesto'] +
            '</td>' +
            '<td>' +
            data[i]['placa'] +
            '</td>' +
            '<td>' +
            btnconsultar +
            '' +
            btneditar +
            '' +
            btnanular +
            '</td>' +
            '</tr>',
          );
        }
      }
    },
    'json',
  );
}
