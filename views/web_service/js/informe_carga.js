$(document).ready(function () {
  $('.opcion_filtro').hide();
  $('.divcliente').hide();
  $('.divfecha').hide();
  $('#contenedor_datos').hide();

  $('#filtro').change(function () {
    $('#numero_documento').val('');
    $('#fecha_doc').val('');
    var filtro = $('#filtro').val();
    if (filtro == 1) {
      $('.opcion_filtro').show();
    }
    if (filtro == 2) {
      $('.opcion_filtro').show();
    }
    if (filtro == 3) {
      $('.opcion_filtro').show();
    }
    if (filtro == 4) {
      $('.opcion_filtro').show();
    }
    if (filtro == 5) {
      $('.opcion_filtro').show();
    }
    if (filtro == 6) {
      $('.opcion_filtro').show();
    }
    if (filtro == 7) {
      $('.opcion_filtro').show();
    }
    if (filtro == 8) {
      $('.opcion_filtro').show();
    }
  });

  $('#opcion').change(function () {
    $('#numero_documento').val('');
    $('#fecha_doc').val('');
    var opcion = $('#opcion').val();
    if (opcion == 3) {
      $('.divcliente').show();
      $('.divfecha').hide();
    }
    if (opcion == 4) {
      $('.divcliente').hide();
      $('.divfecha').show();
    }
  });

  $('#buscar_datos').click(function () {
    var msg_error = '';
    if (!$('#filtro').val()) {
      msg_error += '<p>Debe diligenciar el dato <strong>Documento Carga</strong> para realizar la consulta</p>';
      AplicaFoco($('#filtro'));
    }
    if (!$('#opcion').val()) {
      msg_error += '<p>Debe diligenciar el dato <strong>Opción de Filtro</strong> para realizar la consulta</p>';
      AplicaFoco($('#opcion'));
    }
    if ($('#opcion').val() == 3 && !$('#numero_documento').val()) {
      msg_error += '<p>Debe diligenciar el dato <strong>Número Documento</strong> para realizar la consulta</p>';
      AplicaFoco($('#numero_documento'));
    }
    if (!msg_error) {
      Consulta_Datos();
    } else {
      $('.nexos-messages').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
        msg_error +
        '</div></div>',
      );
      $('.panel-body').animate({ scrollTop: 0 }, 600);
    }
  });
});

function Consulta_Datos() {
  var numero = $('#numero_documento').val();
  var filtro = $('#filtro').val();
  var opcion = $('#opcion').val();
  var fecha = $('#fecha_doc').val();
  if (filtro == 1) {
    documento_carga = 'Remesa';
  }
  if (filtro == 2) {
    documento_carga = 'Manifiesto';
  }
  if (filtro == 3) {
    documento_carga = 'Cumplido';
  }
  if (filtro == 4) {
    documento_carga = 'Cliente';
  }
  if (filtro == 5) {
    documento_carga = 'Remitentes';
  }
  if (filtro == 6) {
    documento_carga = 'Propietario-Poseedor-Conductor';
  }
  if (filtro == 7) {
    documento_carga = 'Trailer';
  }
  if (filtro == 8) {
    documento_carga = 'Vehículo';
  }
  $('#cabecera_general').html('');
  $('#tabla_general').html('');
  //$.post($("#id_url_ajax").val()+'web_service/Consulta_Tabla_Retransmision','filtro='+filtro+'&opcion='+opcion+'&num_docu='+numero,function(data){
  $.post(
    $('#id_url_ajax').val() + 'web_service/Consulta_Tabla_Retransmision',
    'filtro=' + filtro + '&opcion=' + opcion + '&num_docu=' + numero + '&fecha=' + fecha,
    function (data) {
      if (data) {
        $('#cabecera_general').html('<tr><td>Documento carga</td><td>Número</td><td>Respuesta Rndc</td><td>Acción</td></tr>');
        for (var i = 0; i < data.length; i++) {
          var boton = '';
          if (data[i].estado == 0 || data[i].estado == null) {
            if (filtro !== 3) {
              //boton = "<button id='ver" + i + "' class='btn btn-sm btn-success mdi mdi-refresh-alt' title='Retransmitir' Onclick='transmitir_nuevamente(" + data[0].id_documento + ',' + opcion + ',' + filtro + ");'> Retransmitir</button>";
              boton =
                `<button id="ver'` +
                i +
                `" class="btn btn-space btn-success btn-sm mdi mdi-refresh" title="Retransmitir Rndc" onClick="transmitir_nuevamente('${data[0]
                  .id_documento}','${opcion}','${filtro}');">Retransmitir</button>`;
            }
            if (filtro == 3) {
              //boton = "<button id='ver" + i + "' class='btn btn-sm btn-success mdi mdi-refresh-alt' title='Retransmitir' Onclick='transmitir_nuevamente(" + data[0].manifiesto + ',' + opcion + ',' + filtro + ");'> Retransmitir</button>";
              boton =
                `<button id="ver'` +
                i +
                `" class="btn btn-space btn-success btn-sm mdi mdi-refresh" title="Retransmitir Rndc" onClick="transmitir_nuevamente('${data[0]
                  .manifiesto}','${opcion}','${filtro}');">Retransmitir</button>`;
            }
          } else {
            boton = "<button id='ver" + i + "' class='btn btn-sm btn-success mdi mdi-refresh-alt' title='Retransmitir''> Transmitido</button>";
          }

          $('#tabla_general').append(
            '<tr>' + '<td>' + documento_carga + '</td>' + '<td>' + data[i].id_documento + '</td>' + '<td>' + data[i].rta_ministerio + '</td>' + '<td>' + boton + '</td>' + '</tr>',
          );
        }
      }
    },
    'json',
  );
}

//FUNCION EN PAUSA - debe quedar con ventanas de edicion y proceso de regresion y reversion
function Retransmision(num_mnf, opcion, filtro) {
  $('#respuesta_rndc').html('');
  if (filtro == 2) {
    //manifiesto
    $.post(
      $('#id_url_ajax').val() + 'web_service/Consulta_Rndc',
      'num_mnf=' + num_mnf + '&opcion=' + opcion,
      function (data) {
        if (data) {
          mensaje = data[0]['rta_ministerio'];
          $('#respuesta_rndc').html(
            '<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Resultado RNDC! </strong> ' +
            mensaje +
            '</div></div>',
          );
          $('#bodycontenido').animate({ scrollTop: 0 }, 900, 'swing');

          $('#etiqueta').html(
            '<label>Nitempresa</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['nitempresa'] +
            '">' +
            '<label>Manifiesto carga</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['nummanifiestocarga'] +
            '">' +
            '<label>Operación Transporte</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['codoperaciontransporte'] +
            '">' +
            '<label>Fecha Expedición Manifiesto</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['fechaexpedicionmanifiesto'] +
            '">' +
            '<label>Origen</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['codmunicipioorigenmanifiesto'] +
            '">' +
            '<label>Destino</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['codmunicipiodestinomanifiesto'] +
            '">' +
            '<label>Titular Manifiesto</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['codidtitularmanifiesto'] +
            '">' +
            '<label>Número del titulae</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['munidtitularmanifiesto'] +
            '">',
          );

          $('#etiqueta2').html(
            '<label>Placa</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['numplaca'] +
            '">' +
            '<label>Placa Remolque</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['numplacaremolque'] +
            '">' +
            '<label>Codidconductor</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['codidconductor'] +
            '">' +
            '<label>Número Conductor</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['munidconductor'] +
            '">' +
            '<label>Valor Flete</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['valorfletepactadoviaje'] +
            '">' +
            '<label>RetencionIca</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['retencionicamanifiestocarga'] +
            '">' +
            '<label>Retefuente</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['retencionfuentemanifiesto'] +
            '">' +
            '<label>Valor Anticipo</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['valoranticipomanifiesto'] +
            '">' +
            '<label>Fecha  Pago Saldo</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['fechapagosaldomanifiesto'] +
            '">' +
            '<label>Responsable Cargue</label>' +
            '<input type="text" class="form-control input-xs" value="' +
            data[0]['cosresponsablecargue'] +
            '">',
          );
        }
      },
      'json',
    );
  }

  if (filtro == 1) {
    //remesa
    $.post($('#id_url_ajax').val() + 'web_service/Consulta_Rndc', 'num_mnf=' + num_mnf + '&opcion=' + opcion, function (data) { }, 'json');
  }

  if (filtro == 3) {
    //cumplido
    $.post($('#id_url_ajax').val() + 'web_service/Consulta_Rndc', 'num_mnf=' + num_mnf + '&opcion=' + opcion, function (data) { }, 'json');
  }
}

function transmitir_nuevamente(numero, opcion, filtro) {
  //controlador de funciones

  if (filtro == 1) {
    //remesa
    Crear_Remesa_Rndc(numero);
  }
  if (filtro == 2) {
    //manifiesto
    Validar_Remesas_Rndc(numero);
  }
  if (filtro == 3) {
    //cumplido
    Crear_Cumplido_Rndc(numero);
  }
  if (filtro == 4) {
    // clientes
    Crear_Cliente_Rndc(numero);
  }

  if (filtro == 5) {
    //remitente
    Crear_Remitente_Rndc(numero);
  }

  if (filtro == 6) {
    //terceros
    CrearTerceros_Rndc(numero);
  }

  if (filtro == 7) {
    //trailer
    Crear_Trailer_Rndc(numero);
  }

  if (filtro == 8) {
    //vehiculo
    Crear_vehiculo_Rndc(numero);
  }
}

function Crear_Remesa_Rndc(num_remesa) {
  var mensaje = '';
  //alert('crear remesas manifiesto'+num_mani);
  proceso = 3;
  var paquete_transmite = 'id=' + num_remesa + '&proceso=' + proceso + '&dato=3' + '&filtro=""' + '&tipopro=3';
  $.post(
    $('#id_url_ajax').val() + 'web_service/Retransmite_Remesaindividual',
    paquete_transmite,
    function (data) {
      if (data.status == 'true') {
        tablas_locales = 'Se Registro Remesa ' + num_remesa + ' Exitosamente RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="check" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
        );
        $('.panel-body').animate({ scrollTop: 0 }, 600);
      } else if (data.status == 'false') {
        tablas_locales = 'No se creo Remesa ' + num_remesa + ' en RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
        );
        $('.panel-body').animate({ scrollTop: 0 }, 600);
      }
    },
    'json',
  );
}

function Validar_Remesas_Rndc(num_mani) {
  var mensaje = '';
  $.post(
    $('#id_url_ajax').val() + 'manifiesto/Valida_Remesas',
    'manifiesto=' + num_mani,
    function (data) {
      if (data[0]['can_remesa'] == data[0]['can_re_rndc']) {
        //cant remesas activas - cant remesas transmitidas
        Crear_Manifiesto_Rndc(num_mani);
      }
      if (data[0]['can_remesa'] != data[0]['can_re_rndc']) {
        //enviar solo mensaje
        mensaje = 'No puede transmitir manifiesto porque hay remesas por crear en RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado! Resultado RNDC</strong> ' +
          mensaje +
          '</div></div>',
        );
        $('.panel-body').animate({ scrollTop: 0 }, 900, 'swing');
      }
    },
    'json',
  );
}

function Crear_Manifiesto_Rndc(num_mani) {
  //alert('crear manifiesto en el ministerio'+num_mani);
  var mensaje = '';
  proceso = 4;
  var paquete_transmite = 'id=' + num_mani + '&proceso=' + proceso + '&dato=3' + '&filtro=""' + '&tipopro=3';
  $.post(
    // $('#id_url_ajax').val() + 'web_service/Transmite_Manifiesto',
    $('#id_url_ajax').val() + 'web_service/Retransmite_Manifiesto',
    paquete_transmite,
    function (data) {
      //$.post($("#id_url_ajax").val()+'web_service/Transmite_Manifiesto',paquete_transmite,function(data){
      if (data.status == 'true') {
        tablas_locales = 'Se Registro Manifiesto ' + data.num_manifiesto;
        +' Exitosamente RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="check" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
        );
        $('#accordion1').animate({ scrollTop: 0 }, 600);
      } else if (data.status == 'false') {
        tablas_locales = 'No se creo Manifiesto ' + data.num_manifiesto;
        +' en RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
        );
        $('#accordion1').animate({ scrollTop: 0 }, 600);
      }
    },
    'json',
  );
}

async function Crear_Cumplido_Rndc(numManifiesto) {

  const mensajes = [];
  // $('#loading-overlay-rndc').show();

  try {

    const response = await fetch('http://127.0.0.1:8000/api/v1/rndc/transmitir-cumplido-inicial-manifiesto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'mi_super_api_key_ultra_secreta_123',
      },
      body: JSON.stringify({
        num_manifiesto: numManifiesto
      }),
    });

    const res = await response.json();

    /* =============================
       1️⃣ Error general del servicio
       ============================= */
    if (!res.success) {
      mensajes.push(
        `<b>❌ Error RNDC</b><br>${res.error}`
      );
      return;
    }

    /* =============================
       2️⃣ Resultados por remesa
       ============================= */
    if (Array.isArray(res.data)) {

      res.data.forEach(item => {

        if (item.status === true) {
          mensajes.push(
            `✅ <b>Remesa ${item.remesa}</b> transmitida correctamente<br>
             <small>ID RNDC: ${item.ingresoid ?? 'N/D'}</small>`
          );
        } else {
          mensajes.push(
            `❌ <b>Remesa ${item.remesa}</b> falló<br>
             <small>${item.error}</small>`
          );
        }

      });

    } else {
      mensajes.push('⚠️ Respuesta inesperada del servidor');
    }

  } catch (error) {

    mensajes.push(
      `❌ <b>Error de red</b><br>${error.message}`
    );

  } finally {

    // $('#loading-overlay-rndc').hide();

    Swal.fire({
      title: 'Resultado Cumplido RNDC',
      html: mensajes.join('<hr>'),
      icon: 'info',
      width: '70%',
      confirmButtonText: 'Cerrar'
    });
  }
}

// function Crear_Cumplido_Rndc(num_mani) {
//   //cumplido de manifiesto
//   var mensaje = '';
//   proceso = 3;
//   var paquete = 'num_manifiesto=' + num_mani + '&proceso=' + proceso + '&dato=3' + '&filtro=""' + '&tipopro=3';
//   $.post(
//     $('#id_url_ajax').val() + 'web_service/Retransmite_Cumplido_Rm',
//     paquete,
//     function(data) {
//       for (var z = 0; z < data.length; z++) {
//         mensaje = JSON.stringify(data[z]);
//         $('.nexos-messages').append(
//           '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="check" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado! Resultado Remesa RNDC</strong> ' +
//             mensaje +
//             '</div></div>',
//         );
//         $('#accordion1').animate({scrollTop: 0}, 900, 'swing');
//       }
//       Cumplido_Manifiesto_Rndc(num_mani);
//     },
//     'json',
//   );
// }

function Cumplido_Manifiesto_Rndc(num_manifiesto) {
  var mensaje = '';
  proceso = 3;
  var paquete_transmite = 'id=' + num_manifiesto + '&proceso=' + proceso + '&dato=3' + '&filtro=""' + '&tipopro=3';
  $.post(
    $('#id_url_ajax').val() + 'web_service/Retransmite_Cumplido_ma',
    paquete_transmite,
    function (data) {
      if (data.status == 'true') {
        tablas_locales = 'Se Registro Cumplido ' + data.num_cumplido + ' Exitosamente RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
        );
        $('#accordion1').animate({ scrollTop: 0 }, 600);
      } else if (data.status == 'false') {
        tablas_locales = 'No se creo Cumplido ' + data.num_cumplido + ' en RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
        );
        $('#accordion1').animate({ scrollTop: 0 }, 600);
      }
    },
    'json',
  );
}

function Crear_Cliente_Rndc(doc_cliente) {
  var mensaje = '';
  proceso = 3;
  var paquete_transmite = 'id=' + doc_cliente + '&proceso=' + proceso + '&dato=3' + '&filtro=""' + '&tipopro=3' + '&tipdoc=""' + '&conduce=""';
  $.post(
    $('#id_url_ajax').val() + 'web_service/Retransmite_Cliente',
    paquete_transmite,
    function (data) {
      if (data.status == 'true') {
        tablas_locales = 'Se Registro Cliente; ' + data.nombre + ', Exitosamente RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
        );
        $('.panel-body').animate({ scrollTop: 0 }, 600);
      } else if (data.status == 'false') {
        tablas_locales = 'No se creo Clientes ' + data.nombre + ' en RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
        );
        $('.panel-body').animate({ scrollTop: 0 }, 600);
      }
    },
    'json',
  );
}

function Crear_Remitente_Rndc(doc_remi) {
  var mensaje = '';
  proceso = 3;
  var paquete_transmite = 'id=' + doc_remi + '&proceso=' + proceso + '&dato=3' + '&filtro=""' + '&tipopro=3';
  $.post(
    $('#id_url_ajax').val() + 'web_service/Retransmite_Remitente',
    paquete_transmite,
    function (data) {
      if (data.status == 'true') {
        tablas_locales = 'Se Registro Remitente ' + data.nombre + ', Exitosamente RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
        );
        $('.panel-body').animate({ scrollTop: 0 }, 600);
      } else if (data.status == 'false') {
        tablas_locales = 'No se creo Remitente ' + data.nombre + ' en RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
        );
        $('.panel-body').animate({ scrollTop: 0 }, 600);
      }
    },
    'json',
  );
}

function CrearTerceros_Rndc(documento) {
  var mensaje = '';
  proceso = 11;
  var paquete_transmite = 'id=' + documento + '&proceso=' + proceso + '&dato=1' + '&filtro=""' + '&tipopro=2';
  $.post(
    $('#id_url_ajax').val() + 'web_service/Retransmite_Tercero',
    paquete_transmite,
    function (data) {
      if (data.status == 'true') {
        tablas_locales = 'Se Registro Tercero ' + data.nombre + ', Exitosamente RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
        );
        $('.panel-body').animate({ scrollTop: 0 }, 600);
      } else if (data.status == 'false') {
        tablas_locales = 'No se creo Tercero ' + data.nombre + ' en RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
        );
        $('.panel-body').animate({ scrollTop: 0 }, 600);
      }
    },
    'json',
  );
}

function Crear_Trailer_Rndc(documento) {
  var mensaje = '';
  proceso = 12;
  var paquete_transmite = 'id=' + documento + '&proceso=' + proceso + '&dato=3' + '&filtro=""' + '&tipopro=3';
  $.post(
    $('#id_url_ajax').val() + 'web_service/Retransmite_Trailer',
    paquete_transmite,
    function (data) {
      if (data.status == 'true') {
        tablas_locales = 'Se Registro Trailer ' + data.nombre + ', Exitosamente RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
        );
        $('.panel-body').animate({ scrollTop: 0 }, 600);
      } else if (data.status == 'false') {
        tablas_locales = 'No se creo Trailer ' + data.nombre + ' en RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
        );
        $('.panel-body').animate({ scrollTop: 0 }, 600);
      }
    },
    'json',
  );
}

function Crear_vehiculo_Rndc(documento) {
  var mensaje = '';
  proceso = 12;
  var paquete_transmite = 'id=' + documento + '&proceso=' + proceso + '&dato=3' + '&filtro=""' + '&tipopro=3';
  $.post(
    $('#id_url_ajax').val() + 'web_service/Retransmite_Vehiculo',
    paquete_transmite,
    function (data) {
      if (data.status == 'true') {
        tablas_locales = 'Se Registro Vehiculo ' + data.nombre + ', Exitosamente RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
        );
        $('.panel-body').animate({ scrollTop: 0 }, 600);
      } else if (data.status == 'false') {
        tablas_locales = 'No se creo Vehiculo ' + data.nombre + ' en RNDC';
        $('.nexos-messages').append(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
        );
        $('.panel-body').animate({ scrollTop: 0 }, 600);
      }
    },
    'json',
  );
}
