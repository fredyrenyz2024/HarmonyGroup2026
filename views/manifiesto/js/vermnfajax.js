$(document).ready(function() {
  $('#contenedor_datos').css('display', 'none');
  $('#contenedor_anticipo').css('display', 'none');
  $('#tabla_datos').css('display', 'block');
  $('#buscar_manifies').click(function() {
    TablaManifiesto();
    porcentaje();
  });
  //obtener el valor final según el porcetanej
  $('#porcentaje_anticipo').change(function() {
    var por = $('#porcentaje_anticipo').val();
    var totviaje = $('#vant_total').val();
    var anti2 = parseFloat(totviaje) * parseFloat(por);
    var resanti2 = parseFloat(anti2) / 100;
    $('#valor_sugerido').val(resanti2);
  });
  //validar el boton de guardar anticipo
  $('#registrar_anticipo').click(function() {
    var msg_error = '';
    if (!$('#valor_sugerido').val()) {
      msg_error += '<p>Debe ingresar el <strong>Valor anticipo a sugerir</strong> para registrar el Anticipo</p>';
    }
    if (!$('#met_desem').val()) {
      msg_error += '<p>Debe ingresar el <strong>Método desembolso</strong> para registrar el Anticipo</p>';
    }
    if (!$('#porcentaje_anticipo').val()) {
      msg_error += '<p>Debe ingresar el <strong>Porcentaje</strong> para registrar el Anticipo</p>';
    }

    if (!msg_error) {
      //insertar anticipo
      var vtotal = $('#vant_total').val();
      var vlimi = $('#valor_limitante').val();
      var porcen = $('#porcentaje_anticipo').val();
      var anticipo = $('#valor_sugerido').val();
      var desem = $('#met_desem').val();
      var idmnf = $('#id_mnf').val();
      var beneficia = $('#benefi').val();

      var dato = 'mani=' + idmnf + '&vtotal=' + vtotal + '&vlim=' + vlimi + '&por=' + porcen + '&anticipo=' + anticipo + '&desem=' + desem + '&bene=' + beneficia;
      $.post(
        $('#id_url_ajax').val() + 'manifiesto/Registro_Anticipo',
        dato,
        function(data) {
          if (data == 'true') {
            alert('Datos Registrados Exitosamente!!');
            TablaManifiesto();
          }
        },
        'json',
      );
    } else {
      $('.msg_present').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          '</div></div>',
      );
      $('.panel-body').animate({scrollTop: 0}, 600);
    }
  });

  //imprimir
  $('#btn_imprimir').click(function() {
    //id del manifiesto
    var id_mnf = $('#v_mani').val();
    var url;

    // dato_pdf = Array(dato_pdf1);
    url = $('#id_url_ajax').val() + 'libs/manifiesto_pdf.php?' + 'id_mnf=' + codificarBase64(id_mnf);
    window.open(url, '_blank');
  });

  // JavaScript
  document.getElementById('exportar_excel').addEventListener('click', function() {
    var table = document.getElementById('ordenes_manifiesto_export');
    if (table) {
      // Clonar la tabla
      var clonedTable = table.cloneNode(true);

      // Indicar qué columnas omitir (por ejemplo, 1 y 3)
      var columnsToOmit = [6]; // Índices base 0

      // Eliminar las columnas no deseadas en el encabezado
      var ths = clonedTable.querySelectorAll('thead th');
      columnsToOmit.slice().reverse().forEach(index => {
        ths[index].remove();
      });

      // Eliminar las columnas no deseadas en las filas del cuerpo
      var rows = clonedTable.querySelectorAll('tbody tr');
      rows.forEach(row => {
        var cells = row.querySelectorAll('td');
        columnsToOmit.slice().reverse().forEach(index => {
          cells[index].remove();
        });
      });

      // Convertir la tabla modificada a libro de Excel
      var wb = XLSX.utils.table_to_book(clonedTable);
      const fechaActual = new Date().toISOString().slice(0, 10);
      const nombreArchivo = `Informe de Manifiestos_${fechaActual}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    } else {
      console.error("El elemento con el ID 'ordenes_decargue' no existe.");
    }
  });
});

function ConsultaMnf(idmanifiesto) {
  $('.campov').val('');
  $('#tabla_cremitente').html('');
  $('#tabla_remesas').html('');
  $('#tabla_datos').css('display', 'none');
  $('#contenedor_datos').css('display', 'block');
  //traer datos del manifiesto - cabecera
  $.post(
    $('#id_url_ajax').val() + 'manifiesto/ConsultaManifiesto',
    'nummani=' + idmanifiesto,
    function(data) {
      if (data) {
        var tp, carg, desca;
        if (data[0]['tipo_manifiesto'] == 1) {
          tp = 'General';
        }
        if (data[0]['tipo_manifiesto'] == 2) {
          tp = 'Paqueteo';
        }
        if (data[0]['tipo_manifiesto'] == 3) {
          tp = 'Urbano de puertos';
        }
        if (data[0]['tipo_manifiesto'] == 4) {
          tp = 'Masivo';
        }
        if (data[0]['tipo_manifiesto'] == 5) {
          tp = 'Semimasivo';
        }
        if (data[0]['tipo_manifiesto'] == 6) {
          tp = 'Urbano';
        }
        if (data[0]['tipo_manifiesto'] == 7) {
          tp = 'Movimiento contenedores';
        }
        if (data[0]['cargue_pagado'] == 1) {
          carg = 'Empresa';
        }
        if (data[0]['cargue_pagado'] == 2) {
          carg = 'Destinatario';
        }
        if (data[0]['cargue_pagado'] == 3) {
          carg = 'Remitente';
        }
        if (data[0]['cargue_pagado'] == 4) {
          carg = 'Conductor';
        }
        if (data[0]['descargue_pagado'] == 1) {
          desca = 'Empresa';
        }
        if (data[0]['descargue_pagado'] == 2) {
          desca = 'Destinatario';
        }
        if (data[0]['descargue_pagado'] == 3) {
          desca = 'Remitente';
        }
        if (data[0]['descargue_pagado'] == 4) {
          desca = 'Conductor';
        }
        $('#v_mani').val(data[0]['id']);
        $('#v_tipomnf').val(tp);
        $('#v_origenmnf').val(data[0]['origen']);
        $('#v_destinomnf').val(data[0]['destino']);
        $('#v_nombrecon').val(data[0]['conductor'] + ' ' + data[0]['conape1'] + ' ' + data[0]['conape2']);
        $('#v_numerocon').val(data[0]['numero_documento']);
        $('#v_numdire').val(data[0]['direccion']);
        $('#v_telecondu').val(data[0]['celular']);
        $('#v_numlicencon').val(data[0]['rndc_categoria_licencia']);
        $('#v_ciudadcon').val(data[0]['cityconductor']);
        $('#v_nombreten').val(data[0]['nombre'] + ' ' + data[0]['apellido1'] + ' ' + data[0]['apellido2']);
        $('#v_numeroten').val(data[0]['docten']);
        $('#v_direten').val(data[0]['direten']);
        $('#v_telten').val(data[0]['celten']);
        $('#v_cityten').val(data[0]['cityten']);
        $('#v_placa').val(data[0]['placa']);
        $('#v_marca').val(data[0]['marca']);
        $('#v_config').val(data[0]['configuracion']);
        $('#v_peso').val(data[0]['peso']);
        $('#v_poliza').val(data[0]['num_soat']);
        $('#v_seguro').val(data[0]['aseguradora']);
        $('#v_fecvence').val(data[0]['vence_soat']);
        $('#c_remolque').val(data[0]['placa_trailer']);
        $('#v_lugar').val(data[0]['Lugar']);
        $('#v_fecpago').val(data[0]['fecha_pago']);
        $('#v_cargue').val(carg);
        $('#v_descargue').val(desca);
        $('#v_observación').val(data[0]['observacion']);
        $('#v_total').val(data[0]['valor_total_viaje']);
        $('#v_retefuente').val(data[0]['retencion_fuente']);
        $('#v_reteica').val(data[0]['rete_ica']);
        $('#v_valorneto').val(data[0]['neto_pagar']);
        $('#v_valoranti').val(data[0]['valor_anticipo']);
        $('#v_saldo').val(data[0]['saldo']);
        $('#v_valorletras').val();
      }
    },
    'json',
  );
  //remesas asociadas al manifiesto seleccionado
  $.ajax({
    url: $('#id_url_ajax').val() + 'manifiesto/ConsultaRemesas',
    method: 'POST',
    data: {nummani: idmanifiesto},
    dataType: 'json',
    success: function(data) {
      if (data) {
        for (var t = 0; t < data.length; t++) {
          $('#tabla_remesas').append(
            '<tr>' +
              '<td><input type="text" class="form-control input-xs" readonly="readonly" value="' +
              data[t]['id'] +
              '"></td>' +
              '<td><input type="text" class="form-control input-xs" readonly="readonly" value="' +
              data[t]['tipo_servicio_mer'] +
              '"></td>' +
              '<td><input type="text" class="form-control input-xs" readonly="readonly" value="' +
              data[t]['cantidad_empaque'] +
              '"></td>' +
              '<td><input type="text" class="form-control input-xs" readonly="readonly" value="' +
              data[t]['naturaleza'] +
              '"></td>' +
              '<td><input type="text" class="form-control input-xs" readonly="readonly" value="' +
              data[t]['tipo_mercancia'] +
              '"></td>' +
              '<td><input type="text" class="form-control input-sm" readonly="readonly" value="' +
              data[t]['nomrem'] +
              '/' +
              data[t]['docrem'] +
              '"></td>' +
              '<td><input type="text" class="form-control input-sm" readonly="readonly" value="' +
              data[t]['nomdest'] +
              '/' +
              data[t]['docdest'] +
              '"></td>' +
              '<td><input type="text" class="form-control input-sm" readonly="readonly" value="' +
              data[t]['nombre_cliente'] +
              '"></td>' +
              '</tr>',
          );
        }
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#tabla_remesas').html('');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function AnularMnf(idmanifiesto) {
  //LAS ANULACIONES TAMBIÉN SE TRANSMITEN AL MINISTERIO
  $.post(
    $('#id_url_ajax').val() + 'manifiesto/Anular_Manifiesto',
    'id_manifiesto=' + idmanifiesto,
    function(data) {
      if (data == 'true') {
        alert('Manifiesto Anulado Exitosamente!!');
        TablaManifiesto();
      }
    },
    'json',
  );
}

function AnticiposMnf(idmani) {
  $('#tabla_datos').css('display', 'none');
  $('#contenedor_datos').css('display', 'none');
  $('#contenedor_anticipo').css('display', 'block');
  //consultar los anticipos activos
  $.post(
    $('#id_url_ajax').val() + 'manifiesto/Consultar_Anticipos',
    'id_manifi=' + idmani,
    function(data) {
      $('#tb_anticipo').html('');
      if (data) {
        for (var i = 0; i < data.length; i++) {
          var cuenta = '',
            met = '',
            status = '';
          if (data[i]['metodo_desembolso'] == 1) {
            met = 'Cheque';
          }
          if (data[i]['metodo_desembolso'] == 2) {
            met = 'Efectivo';
          }
          if (data[i]['metodo_desembolso'] == 3) {
            met = 'Transferencia';
          }

          //estados
          if (data[i]['estado'] == 1) {
            status = "<td class='nexos-txt-success'>" + "<center><span class='mdi mdi-dot-circle icon'></span></center>" + '</td>';
          }
          if (data[i]['estado'] == 2) {
            status = "<td class='nexos-txt-warning'>" + "<center><span class='mdi mdi-dot-circle icon'></span></center>" + '</td>';
          }
          if (data[i]['estado'] == 0) {
            status = "<td class='nexos-txt-danger'>" + "<center><span class='mdi mdi-dot-circle icon'></span></center>" + '</td>';
          }

          $('#tb_anticipo').append('<tr>' + status + '<td>' + data[i]['nombre'] + '</td>' + '<td>' + data[i]['valor_anticipo'] + '</td>' + '<td>' + met + '</td>' + '</tr>');
        }
      }
    },
    'json',
  );

  //consultar el valor total del viaje
  $.post(
    $('#id_url_ajax').val() + 'manifiesto/Consultar_Valor_T',
    'id_manifi=' + idmani,
    function(data) {
      $('#vant_total').val('');
      $('#valor_limitante').val('');
      if (data) {
        $('#benefi').val(data['conductor_manifiesto']);
        $('#vant_total').val(data['valor_total_viaje']);
        $('#id_mnf').val(data['id']);
        var valor = data['valor_total_viaje'];
        var anti2 = parseFloat(data['valor_total_viaje']) * parseFloat(65);
        var resanti2 = parseFloat(anti2) / 100;
        $('#valor_limitante').val(resanti2);
      }
    },
    'json',
  );
}

function TablaManifiesto() {
  $('#contenedor_anticipo').css('display', 'none');
  $('#contenedor_datos').css('display', 'none');
  $('#tabla_datos').css('display', 'block');
  $('.campov').val('');
  $('#tabla_remesas').html('');
  $('#tb_anticipo').html('');
  var ini = $('#finicial').val();
  var fin = $('#ffinal').val();

  $.post(
    $('#id_url_ajax').val() + 'manifiesto/Consulta_Manifiestos',
    'finicia=' + ini + '&ffinal=' + fin,
    function(data) {
      $('#manfbody').html('');
      if (data.manifiestos) {
        $('.badge').html(data.total_manifiestos);
        for (var a = 0; a < data.manifiestos.length; a++) {
          var esta_mnf, esta_ant, tipo;
          var btnanular = '',
            btneditar = '',
            btnconsultar = '',
            btnanticipo = '';
          btnimprimir = '';
          if (data.manifiestos[a]['estadomnf_actual'] == 1) {
            esta_mnf = '<td>' + "<center><span class='label label-success'>Manifiesto Guardado</span></center>" + '</td>';
            btnconsultar =
              '<button class="btn btn-space btn-primary btn-xs" title="ver Manifiesto" onClick="ConsultaMnf(' + data.manifiestos[a]['id'] + ')"><i class="fa-regular fa-eye"></i></button>';
            btneditar =
              '<button class="btn btn-space btn-warning btn-xs" title="Editar Manifiesto" onClick="ConsultaMnf(' + data.manifiestos[a]['id'] + ')"><i class="fa-solid fa-pencil"></i></button>';
            btnanular = '<button class="btn btn-space btn-danger btn-xs" title="Anular Manifiesto" onClick="AnularMnf(' + data.manifiestos[a]['id'] + ')"><i class="fa-solid fa-ban"></i></button>';
            btnanticipo =
              '<button class="btn btn-space btn-success btn-xs" title="Sugerir Anticipo" onClick="AnticiposMnf(' +
              data.manifiestos[a]['id'] +
              ')"><i class="fa-solid fa-money-bill-1-wave"></i></button>';
            btnimprimir =
              '<button class="btn btn-space btn-success btn-xs" title="Sugerir Anticipo" onClick="ImprimirManifiesto(' + data.manifiestos[a]['id'] + ')"><i class="fas fa-print"></i></button>';
          }

          if (data.manifiestos[a]['estadomnf_actual'] == 0) {
            esta_mnf = "<td class='nexos-txt-danger'>" + "<center><span class='label label-success'>Manifiesto Guardado</span></center>" + '</td>';
            btnanular = '';
            btneditar = '';
            btnconsultar =
              '<button class="btn btn-space btn-primary btn-xs" title="ver Manifiesto" onClick="ConsultaMnf(' + data.manifiestos[a]['id'] + ')"><i class="fa-regular fa-eye"></i></button>';
            btnanticipo = '';
            btnimprimir = '';
          }

          if (data.manifiestos[a]['estadoant_actual'] == 1) {
            esta_ant = "<td class='nexos-txt-success'>" + "<center><span class='mdi mdi-dot-circle icon' title='Anticipo vigente'></span></center>" + '</td>';
          }

          if (data.manifiestos[a]['tipo_manifiesto'] == 1) {
            tipo = 'General';
          }
          if (data.manifiestos[a]['tipo_manifiesto'] == 2) {
            tipo = 'Paqueteo';
          }
          if (data.manifiestos[a]['tipo_manifiesto'] == 3) {
            tipo = 'Urbano de puertos';
          }
          if (data.manifiestos[a]['tipo_manifiesto'] == 4) {
            tipo = 'Masivo';
          }
          if (data.manifiestos[a]['tipo_manifiesto'] == 5) {
            tipo = 'Semimasivo';
          }
          if (data.manifiestos[a]['tipo_manifiesto'] == 6) {
            tipo = 'Urbano';
          }
          if (data.manifiestos[a]['tipo_manifiesto'] == 7) {
            tipo = 'Movimiento contenedores';
          }

          if (data.manifiestos[a]['cumplido'] == 1) {
            cumplido = 'Cumplido';
          } else {
            cumplido = 'Sin cumplir';
          }

          $('#manfbody').append(
            '<tr>' +
              // esta_ant +
              "<td class='text-center'>" +
              data.manifiestos[a]['id'] +
              '</td>' +
              "<td class='text-center'>" +
              data.manifiestos[a]['placa'] +
              '</td>' +
              "<td class='text-center'>" +
              data.manifiestos[a]['conductor_manifiesto'] +
              '</td>' +
              "<td class='text-center'>" +
              tipo +
              '</td>' +
              esta_mnf +
              // "<td>" +
              // data[a]["observacion"] +
              // "</td>" +
              "<td class='text-center'>" +
              cumplido +
              '</td>' +
              "<td style='width: 170px;' class='text-center'>" +
              '<div class="btn-group btn-group-xs" role="group" aria-label="...">' +
              btnconsultar +
              '&nbsp;&nbsp;' +
              btneditar +
              '&nbsp;&nbsp;' +
              btnanular +
              '&nbsp;&nbsp;' +
              // btnanticipo +
              '&nbsp;&nbsp;' +
              btnimprimir +
              '</div>' +
              '</td></tr>',
          );
        }
      }
    },
    'json',
  );
}

function porcentaje() {
  $.post(
    $('#id_url_ajax').val() + 'manifiesto/Consulta_Porcentaje',
    function(data) {
      $('#porcentaje_anticipo').html('<option value="">Seleccione</option>');
      if (data) {
        $('#porcentaje_anticipo').html('');
        for (var i = 0; i < data.length; i++) {
          $('#porcentaje_anticipo').append('<option value="' + data[i]['valor'] + '">' + data[i]['valor'] + '</option>');
        }
      }
    },
    'json',
  );
}

function ImprimirManifiesto(id_mnf) {
  // var id_mnf = $('#v_mani').val();
  var url;

  // dato_pdf = Array(dato_pdf1);
  url = $('#id_url_ajax').val() + 'libs/manifiesto_pdf.php?' + 'id_mnf=' + codificarBase64(id_mnf);
  window.open(url, '_blank');
}

function codificarBase64(texto) {
  return btoa(texto);
}

// Función para decodificar Base64
function decodificarBase64(textoCodificado) {
  return atob(textoCodificado);
}
