$(document).ready(function() {
  manifiestos_pendientes();
  //cargarorigen();
  $('.mnf').hide();
  $('.fec').hide();
  $('.butnn').hide();

  $('#filtro').change(function() {
    var valor = $('#filtro').val();
    if (valor == '') {
      $('#num_mnf').val('');
      $('.mnf').hide();
      $('.fec').hide();
      $('.butnn').hide();
    }
    if (valor == 1) {
      $('.mnf').show();
      $('.fec').hide();
      $('.butnn').show();
    }
    if (valor == 2) {
      $('.mnf').hide();
      $('.fec').show();
      $('.butnn').show();
    }
  });
  var c = 0;
  $('#agregar_fila').click(function() {
    var mensaje = '';
    if (!$('#maximo_entrega').val()) {
      mensaje += '<p>Por favor ingrese la <strong>cantidad de puntos de entrega</strong> que requiere para asignar</p>';
      $('#maximo_entrega').focus();
    }
    if (!mensaje) {
      var m = $('#maximo_entrega').val();
      c = c + 1;
      if (c <= m) {
        // alert('si puede continuar'+c);
        pentrega();
      }
      if (c == m) {
        alert('Señor usuario llego al tope');
      }
    } else {
      $('#msg_crear').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          mensaje +
          '</div></div>',
      );
      $('#crear_inicio').animate({scrollTop: 0}, 600);
    }
  });

  $('#btn_cancelar_asignacion').click(function() {
    // window.confirm()
    document.getElementById('tabla-manifiestos').style.display = 'block';
    document.getElementById('asignar-planruta').style.display = 'none';
  });

  $('#guarda_inicio').click(function() {
    if (window.confirm('¿Seguro desea gaurdar la asosiacion del manifiesto con el plan de ruta actual?')) {
      var msg_error = '';
      if (!$('#n_manifies').val()) {
        msg_error += '<p>Por favor ingrese el <strong>Manifiesto</strong> para poder crear un inicio de ruta</p>';
      }
      if (!$('#cedula').val()) {
        msg_error += '<p>Por favor ingrese el <strong>Número de identificación</strong> para poder crear un inicio de ruta</p>';
      }
      if (!$('#placa').val()) {
        msg_error += '<p>Por favor ingrese la <strong>Placa</strong> para poder crear un inicio de ruta</p>';
      }
      if (!$('#Plan').val()) {
        msg_error += '<p>Por favor seleccione el <strong>Plan</strong> para poder crear un inicio de ruta</p>';
      }
      if (!$('#fechasalida').val()) {
        msg_error += '<p>Debe haber datos en el campo <strong> Fecha sálida </strong>  para poder crear un inicio de ruta</p>';
      }
      if (!$('#horasalida').val()) {
        msg_error += '<p>Debe haber datos en el campo <strong> Hora sálida </strong>  para poder crear un inicio de ruta</p>';
      }

      if (!msg_error) {
        crear_inicio_ruta();
      } else {
        $('#msg_crear').html(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
            msg_error +
            '</div></div>',
        );
        $('#crear_inicio').animate({scrollTop: 0}, 600);
      }
    }
  });

  $('#buscar_inicio').click(function() {
    buscar_ini();
  });
});

var url2 = $('#id_url_ajax').val() + 'libs/trafico2_ajax.php';
var url = $('#id_url_ajax').val() + 'libs/trafico_ajax.php';

$('#cedula').blur(function() {
  var msg_erro = '';
  var cc = $('#cedula').val();
  var condu = {
    cc: cc,
    action: 'consulta_conductor',
  };
  $.ajax({
    url: url,
    type: 'POST',
    data: condu,
    dataType: 'json',
    success: function(data) {
      console.log('trajo conductor');
      console.log(data);
      if (data.result != null) {
        $('#nom_condu').val(data.result[0].nombre);
      } else {
        // alert('No existe un conductor con ese número de identificación');
        $('#nom_condu').html('');
        msg_erro += '<p>No existe un conductor con ese número de identificación</p>';
        $('#msg_crear').html(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
            msg_erro +
            '</div></div>',
        );
        $('#crear_inicio').animate({scrollTop: 0}, 600);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no trajoconducto ');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
});

$('#placa').blur(function() {
  var msg_erro = '';
  var plak = $('#placa').val();
  var car = {
    plak: plak,
    action: 'consulta_placa',
  };

  $.ajax({
    url: url,
    type: 'POST',
    data: car,
    dataType: 'json',
    success: function(data) {
      if (data.result != null) {
        // console.log('carro');
        $('#tcarro').val(data.result[0].nombre);
      } else {
        // console.log('no carro');
        $('#tcarro').html('');
        msg_erro += '<p>No existe un vehículo con esa placa</p>';
        $('#msg_crear').html(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
            msg_erro +
            '</div></div>',
        );
        $('#crear_inicio').animate({scrollTop: 0}, 600);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no trajocarro ');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
});

//validat tipo carga y tipo trans
$('#trans').change(function() {
  var c, t;
  c = $('#carga').val();
  t = $('#trans').val();

  if (c == '1' && t == '1') {
    $('#devuelve').prop('disabled', false);
    $('#dia').prop('disabled', false);
    $('#mun').prop('disabled', false);
    $('#dire').prop('disabled', false);
    //cargar municpios
    var cargue = {
      action: 'cargue',
    };

    // $("#mun").select2({
    // 	width:'100%'
    // });
    $.ajax({
      url: url,
      type: 'POST',
      data: cargue,
      dataType: 'json',
      success: function(data) {
        console.log('trajo muni');
        if (data.result) {
          data.result.forEach(function(element, index) {
            $('#mun').append('<option value="' + element.id + '">' + element.t + '</option>');
          });
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('no trajo muni');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } else {
    $('#devuelve').prop('disabled', true);
    $('#dia').prop('disabled', true);
    $('#mun').prop('disabled', true);
    $('#dire').prop('disabled', true);
  }
});

var cont = 0;
var contador_global1 = 0;
function pentrega() {
  cont++;
  contador_global1 = contador_global1 + 1;
  // var maximo=$("#maximo_entrega").val();
  var ciudad = {
    action: 'traer_ciudade',
  };
  $('#p_ciudad' + cont + '').html('');
  $.ajax({
    url: url,
    type: 'POST',
    data: ciudad,
    dataType: 'json',
    success: function(data) {
      console.log('trajo ciudad plan');
      data.result.forEach(function(element, index) {
        $('#p_ciudad' + cont + '').append('<option value="' + element.id + '">' + element.municipio + '-' + element.depto + '</option>');
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no trajo ciudad plan ');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  var pk = $('#placa').val();

  var cliente = {
    placa: pk,
    action: 'cliente_puntos',
  };

  $('#clientea' + cont + '').html('');
  $.ajax({
    url: url,
    type: 'POST',
    data: cliente,
    dataType: 'json',
    success: function(data) {
      console.log('trajo cliente');
      data.result.forEach(function(element, index) {
        $('#clientea' + cont + '').append('<option value="' + element.id + '">' + element.nombre + '</option>');
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no trajocliente ');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  var city = "<select id='p_ciudad" + cont + "' class='form-control input-xs'>" + '<option value="" readonly="readonly">Seleccione</option>' + '</select>';

  var cliente = "<select id='clientea" + cont + "' class='form-control input-xs'>" + '<option value="" readonly="readonly">Seleccione</option>' + '</select>';

  var pentrega =
    '<tr>' +
    '<tr  style="text-align:left; color:white; background-color:#33b5e5; height:20px; "><th>#</th><th>Municipio Entrega</th><th>Dirección</th><th>Remesa</th></tr>' +
    '<td><span class="badge badge-primary">' +
    cont +
    '</span></td>' +
    '<td>' +
    city +
    '</td>' +
    '<td><input type="text" id="dire' +
    cont +
    '" class="form-control" style=" height:14px; font-size:90%;"></td>' +
    '<td><input type="text" id="remesa' +
    cont +
    '" class="form-control"  style="width:169px; height:14px; font-size:90%;" ></td>' +
    '</tr>' +
    '<tr><th>Fecha Entrega</th><th>Cliente</th><th>Observación</th></tr>' +
    '<td><input type="date" id="fecha' +
    cont +
    '" class="form-control"   style="width:169px; height:14px; font-size:90%;"></td>' +
    '<td>' +
    cliente +
    '</td>' +
    '<td><textarea id="observa' +
    cont +
    '" class="form-control" style="width:169px; height:14px; font-size:90%; "></textarea></td>' +
    '</tr><tr><th>Hora</th><th>Tipo Punto</th><th>Orden</th></tr>' +
    '<tr><td><input type="time" id="hora' +
    cont +
    '" class="form-control" style="width:110px; height:14px; font-size:90%;" ></td>' +
    '<td><select id="tipo' +
    cont +
    '"  style="width:169px; height:17px; font-size:90%; " ><option value="punto entrega">punto entrega</option><option value="punto recogida">Punto recogida</option></select></td>' +
    '<td><input type="text" id="orden' +
    cont +
    '"  class="form-control" style="width:167px; height:14px; font-size:90%;  "  value="' +
    contador_global1 +
    '" readonly="readonly"></td></tr>';
  $('#tabla_pentrega').append(pentrega);
}

function crear_inicio_ruta() {
  var inicioData = new FormData();
  inicioData.append('mani', $('#n_manifies').val());
  inicioData.append('cedula', $('#cedula').val());
  inicioData.append('placa', $('#placa').val());
  inicioData.append('Plan', $('#Plan').val());
  inicioData.append('calvetj', $('#clavetj').val());
  inicioData.append('id_estudio', 0);
  inicioData.append('fechasalida', $('#fechasalida').val());
  inicioData.append('horasalida', $('#horasalida').val());
  inicioData.append('obse', $('#obse').val());
  inicioData.append('cab', $('#cab').val());
  // inicioData.append('cod_ini', num_inicioruta);
  inicioData.append('mentrega', $('#p_ciudad' + i).val());
  inicioData.append('dire', $('#dire' + i).val());
  inicioData.append('clientea', $('#clientea' + i).val());
  inicioData.append('remesa', $('#remesa' + i).val());
  inicioData.append('fentrega', $('#fecha' + i).val());
  inicioData.append('obs', $('#observa' + i).val());
  inicioData.append('hora', $('#hora' + i).val());
  inicioData.append('tipo', $('#tipo' + i).val());
  inicioData.append('orden', $('#orden' + i).val());
  inicioData.append('pun', $('#pun').val());
  inicioData.append('maximo', $('#maximo_entrega').val());
  //   entregaData.append('cab', $('#cab').val(5));

  $.ajax({
    // url: url2,
    url: $('#id_url_ajax').val() + 'trafico/crear_inicio',
    type: 'POST',
    data: inicioData,
    cache: false,
    processData: false,
    contentType: false,
    dataType: 'json',
    success: function(data) {
      console.log('si guardo inicio');
      alert('Ok!! Inicio Registrado Exitosamente!!');
      location.reload();
    },
    error: function() {
      console.log('no guardo inicio');
    },
  });
}

//tabla filtros
function buscar_ini() {
  var filtro = $('#filtro').val();
  var fi = $('#fechaini').val();
  var ff = $('#fechafinal').val();
  var es = $('#estado').val();
  var mnf = $('#num_mnf').val();

  if (filtro == '') {
    alert('Por favor registre los campos!!!');
  } else {
    var tabla = {
      filtro: filtro,
      fi: fi,
      ff: ff,
      num_mnf: mnf,
      action: 'tabla_inicio',
    };
    $('#body_esconder').html('');
    $.ajax({
      url: url,
      type: 'POST',
      data: tabla,
      dataType: 'json',
      success: function(data) {
        var cont = 0;
        if (data.result) {
          data.result.forEach(function(element, index) {
            cont++;
            var cinicio = element.cod_inicio;
            var codplan = element.cod_plan;
            var nplanilla = element.id_estudio_seguridad;
            var manifi = element.num_manifiesto;
            punto_control =
              '<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-local-store" title="Punto Contro" id="btnc' +
              cont +
              '"   data-toggle="modal" data-target="#pcontrol"  data-id="' +
              cinicio +
              '" data-id2="' +
              codplan +
              '" ></button>';
            punto_entrega =
              '<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-eye" title="Consulta plan de ruta" id="btne' +
              cont +
              '"   data-toggle="modal" data-target="#p_entrega"  data-id="' +
              cinicio +
              '" data-id2="' +
              codplan +
              '" data-id3="' +
              manifi +
              '" ></button>';
            status =
              '<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-balance" title="Status"  id="btnsta' +
              cont +
              '"   data-toggle="modal" data-target="#status"  data-id="' +
              cinicio +
              '" data-id2="' +
              codplan +
              '" ></button>';
            impresion =
              '<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-collection-pdf" title="Imprimir PDF" id="imprim' +
              cont +
              '"   data-toggle="modal" data-id="' +
              cinicio +
              '" data-id2="' +
              codplan +
              '" data-id3="' +
              manifi +
              '" ></button>';

            var es = element.estado;
            var col_status2 = '';

            if (es == '2') {
              col_status2 = '<td class="text" style="color:blue;">' + '<center>' + '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Aprobada" ></span>' + '</center>' + '</td>';
            }
            if (es == '3') {
              col_status2 = '<td class="text" style="color:purple;">' + '<center>' + '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Aprobada" ></span>' + '</center>' + '</td>';
            }
            if (es == '4') {
              col_status2 = '<td class="text" style="color:yellow;">' + '<center>' + '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Aprobada" ></span>' + '</center>' + '</td>';
            }
            if (es == '5') {
              col_status2 = '<td class="text" style="color:orange;">' + '<center>' + '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Aprobada" ></span>' + '</center>' + '</td>';
            }
            if (es == '6') {
              col_status2 = '<td class="text" style="color:orange;">' + '<center>' + '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Aprobada" ></span>' + '</center>' + '</td>';
            }
            if (es == '7') {
              col_status2 = '<td class="text" style="color:green;">' + '<center>' + '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Aprobada" ></span>' + '</center>' + '</td>';
            }
            if (es == '8') {
              col_status2 = '<td class="text" style="color:red;">' + '<center>' + '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Aprobada" ></span>' + '</center>' + '</td>';
            }
            $('#body_esconder').append(
              '<tr>' +
                col_status2 +
                '<td>' +
                element.cod_inicio +
                '</td>' +
                '<td>' +
                element.num_manifiesto +
                '</td>' +
                '<td>' +
                element.placa +
                '</td>' +
                '<td>' +
                element.nombre +
                ' ' +
                element.apellido1 +
                ' ' +
                element.apellido2 +
                '</td>' +
                '<td>' +
                punto_entrega +
                '&nbsp;' +
                status +
                '&nbsp;' +
                impresion +
                '</td>' +
                '</tr>',
            );
            var urlu = $('#id_url_ajax').val() + 'libs/trafico_ajax.php';
            //desarrollo de los botones
            $('#imprim' + cont + '').click(function() {
              var codini = $(this).attr('data-id');
              var idplan = $(this).attr('data-id2');
              var num_mnf = $(this).attr('data-id3');
              var dato_plan = 'id_manf=' + num_mnf + '&idplan=' + idplan + '&cod_ini_ruta=' + codini;
              url = $('#id_url_ajax').val() + 'libs/plan_ruta_pdf.php?' + dato_plan;
              window.open(url, '_blank');
            });

            $('#btnc' + cont + '').click(function() {
              var codini = $(this).attr('data-id');
              var idplan = $(this).attr('data-id2');
              // alert('punto control');
              var con = {
                idplan: idplan,
                action: 'puntos_decontrol',
              };
              $('#body_puntos').html('');
              $.ajax({
                url: urlu,
                type: 'POST',
                data: con,
                dataType: 'json',
                success: function(data) {
                  console.log('trajo los puntos');
                  data.result.forEach(function(element, index) {
                    $('#origen_c').val(element.origen);
                    $('#destino_c').val(element.destino);
                    $('#plan_c').val(element.nombre_plan);
                    $('#body_puntos').append(
                      '<tr>' +
                        '<td>' +
                        element.municipio +
                        '-' +
                        element.depto +
                        '</td>' +
                        '<td>' +
                        element.nombre_punto +
                        '</td>' +
                        '<td>' +
                        element.tiempo_estimacion +
                        '</td>' +
                        '<td>' +
                        element.descripcion_punto +
                        '</td>' +
                        '<td>' +
                        element.observaciones +
                        '</td>' +
                        '</tr>',
                    );
                  });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                  console.log('no trajo los planes');
                  console.log(jqXHR);
                  console.log(textStatus);
                  console.log(errorThrown);
                },
              });
            });

            $('#btne' + cont + '').click(function() {
              var codini = $(this).attr('data-id');
              var idplan = $(this).attr('data-id2');
              var num_mnf = $(this).attr('data-id3');
              // alert('punto entrega');
              $('#codigo_i').val(codini);
              $('#codigop').val(idplan);
              var ini = {
                codini: codini,
                idplan: idplan,
                planilla: num_mnf,
                action: 'punto_entrega',
              };
              $('#body_entrega').html('');
              $('.limpia').val('');
              //plan
              $('#name_plan').html('');
              $('#panel_principal').html('');
              $('#panel_entrega').html('');
              $('#panel_remesaa').html('');
              $.ajax({
                url: urlu,
                type: 'POST',
                data: ini,
                dataType: 'json',
                success: function(data) {
                  console.log('trajo los puntos');
                  if (data.result != null) {
                    $('#vplanilla').val(data.result[0].id);
                    $('#vmani').val(data.result[0].num_manifiesto);
                    $('#vcondu').val(data.result[0].cond_cedula);
                    $('#vplaca').val(data.result[0].placa);
                    $('#vobser').val(data.result[0].observacion);
                  }
                  //plan
                  if (data.result3 != null) {
                    var c;
                    data.result3.forEach(function(element, index) {
                      c++;
                      $('#name_plan').html('<h4>' + element.nombre_plan + '</h4>');
                      var m =
                        '<li class="list-group-item  list-group-item-primary">' +
                        '<p>' +
                        '<span>Punto ' +
                        element.nombre_punto +
                        '</span>' +
                        '<br><span><strong>Ciudad: </strong>' +
                        element.municipio +
                        ' Dto:' +
                        element.depto +
                        '   </span>' +
                        '  <span><strong>Nombre punto: </strong>' +
                        element.nombre_punto +
                        '   </span>' +
                        '  <span><strong>Tiempo estimado: </strong>' +
                        element.tiempo_estimacion +
                        ' Min   </span>' +
                        '  <span><strong>Descripción: </strong>' +
                        element.descripcion_punto +
                        '   </span>' +
                        '</p>' +
                        '</li>';
                      $('#panel_principal').append(m);
                    });
                  }
                  //
                  if (data.result6 != null) {
                    var t = 0;
                    var d = 1;
                    data.result6.forEach(function(element, index) {
                      d++;
                      $('#panel_entrega').append(
                        ' <div class="col-xs-8 col-sm-8 col-md-8"><div class="panel panel-border-color panel-border-color-warning">' +
                          '<div class="panel-heading">' +
                          d +
                          '</div>' +
                          '<div class="panel-body">' +
                          '<p>N° Solicitud: ' +
                          element.id +
                          '</p>' +
                          '<p>Municipio:  ' +
                          element.municipio +
                          '-' +
                          element.depto +
                          '</p>' +
                          '<p>Dirección:  ' +
                          element.direccion_entrega +
                          '</p>' +
                          '<p>Cliente:  ' +
                          element.cliente +
                          '</p>' +
                          '<p>Fecha estimada:  ' +
                          element.fecha_estimada_entrega +
                          '</p>' +
                          '<p>Hora estimada:  ' +
                          element.hora_estimada +
                          '</p>' +
                          '<p>Punto:  Punto Entrega - Lugar: ' +
                          element.lugar +
                          '  </p>' +
                          '<p>Observación:  ' +
                          element.observacion +
                          '</p>' +
                          '<p>Teléfono:  ' +
                          element.telefono +
                          '</p>' +
                          '</div></div></div>',
                      );
                    });
                  }
                  //remesas & orden de cargue
                  if (data.result4 != null) {
                    data.result4.forEach(function(element, index) {
                      $('#panel_remesaa').append(
                        '<div class="col-xs-3 col-sm-3 col-md-3"><div class="panel panel-border-color panel-border-color-warning">' +
                          '<div class="panel-heading">Orden/Remesa ' +
                          element.id +
                          '/' +
                          element.idrem +
                          '</div>' +
                          '<div class="panel-body">' +
                          '<p>Remitente: ' +
                          element.remite +
                          '</p>' +
                          '<p>Destinatario:  ' +
                          element.destino +
                          '</p>' +
                          '<p>Producto:  ' +
                          element.mer_producto +
                          '</p>' +
                          '<p>Peso:  ' +
                          element.ca_pesocargue +
                          ' Kg</p>' +
                          '</div></div></div>',
                      );
                    });
                  }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                  console.log('no trajo los planes');
                  console.log(jqXHR);
                  console.log(textStatus);
                  console.log(errorThrown);
                },
              });
            });

            $('#btnsta' + cont + '').click(function() {
              var codini = $(this).attr('data-id');
              var idplan = $(this).attr('data-id2');
              $('#codi').val(codini);
              var st = {
                codini: codini,
                action: 'status_iruta',
              };
              //tambien se usa en seguimiento
              $('#body_status').html('');
              $.ajax({
                url: urlu,
                type: 'POST',
                data: st,
                dataType: 'json',
                success: function(data) {
                  console.log('trajo los estados');
                  data.result.forEach(function(element, index) {
                    $('#body_status').append(
                      '<tr>' + '<td>' + element.estado + '</td>' + '<td>' + element.fecha + '</td>' + '<td>' + element.hora + '</td>' + '<td>' + element.usuario + '</td>' + '</tr>',
                    );
                  });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                  console.log('no trajo los estados');
                  console.log(jqXHR);
                  console.log(textStatus);
                  console.log(errorThrown);
                },
              });
            });
          }); //cierre del result principal
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('no tabla ');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }
}

async function manifiestos_pendientes() {
  //tbody_manifiestos_pendientes
  try {
    const response = await fetch($('#id_url_ajax').val() + 'trafico/Manifiestos_pendientes', {
      method: 'POST',
      cache: 'no-cache',
    });
    const data = await response.json();

    if (data) {
      console.log('🚀 ~ manifiestos_pendientes ~ data:', data.result);

      // let template = '';
      // let tipo_manifiesto, plan, color;
      // let c = 0;

      // for (let m = 0; m < data.data.length; m++) {
      //   c++;
      //   const item = data.data[m];
      //   // tipo_manifiesto = getTipoManifiesto(item['tipo_manifiesto']);
      //   // ({plan, color} = getPlanInfo(item['cod_ini_ruta']));

      //   template += `
      //             <tr id="tiempos${c}">
      //                 <td style="text-align: center;" id="semaforo${c}">
      //                     <a href="#" onClick="Registra_Seguimiento(${item['id']})">${item['id']}</a>
      //                 </td>
      //                 <td style="color: white;width: auto; white-space: nowrap;color:#000000;" id="tiempo${c}"></td>
      //                 <td style="color: white;width: auto; white-space: nowrap;color:#000000;">${item['origen']} - ${item['destino']} </td>
      //                 <td style="color: white;width: auto; white-space: nowrap;color:#000000;">${item['placa']}</td>
      //                 <td style="color: white;width: auto; white-space: nowrap;color:#000000;">${item['nombre_conductor']} ${item['apellido1']} ${item['apellido2']}</td>
      //                 <td style="color: white;width: auto; white-space: nowrap;color:#000000;">${item['celular']}</td>
      //                 <td style="color: white;width: auto; white-space: nowrap;color:#000000;">${item['nombre']}</td>
      //                 <td style="color: white;width: auto; white-space: nowrap;color:#000000;" id="ultimositio${c}"></td>
      //                 <td style="color: white;width: auto; white-space: nowrap;color:#000000;"  id="maxhorafecha${c}"></td>
      //                 <td style="color: white;width: auto; white-space: nowrap;color:#000000;" id="ultimaobservacion${c}"></td>
      //                 <td style="color: white;width: auto; white-space: nowrap;color:#000000;" id="ultimaousuario${c}"></td>
      //             </tr>
      //         `;

      //   if (item['cod_ini_ruta'] != null) {
      //     const codini = item['cod_ini_ruta'];
      //     semaforo(codini, c, item['id']);
      //     ultimahorafecha(codini, c);
      //   }
      // }

      // $('#tablero').html(template);

      // new DataTable('#tbl_Manifiestos_seguimiento', {
      //   destroy: true,
      //   paging: false,
      //   searching: true,
      //   ordering: true,
      //   order: [[1, 'asc']], // Ordenar la segunda columna (índice 1) en orden descendente
      //   info: false,
      //   responsive: true,
      //   pageLength: 100,
      //   dom: '<"row"<"col-sm-10 custom-search"f><"col-sm-2 text-right"B>>' + '<"row"<"col-sm-12"tr>>',
      //   buttons: [
      //     {
      //       extend: 'excelHtml5',
      //       text: '<i class="fa-regular fa-file-excel"></i> Exportar a Excel', // Incluye el icono y el texto
      //       className: 'btn btn-success input-xs', // Clase de estilo para el botón
      //       exportOptions: {
      //         columns: ':visible', // Exporta las columnas visibles
      //         modifier: {
      //           page: 'all', // Exporta todas las filas
      //         },
      //       },
      //     },
      //     // {
      //     //   extend: 'pdfHtml5',
      //     //   text: 'Exportar a PDF',
      //     //   className: 'btn btn-danger input-xs',
      //     //   orientation: 'landscape',
      //     //   pageSize: 'A4',
      //     //   exportOptions: {
      //     //     columns: ':visible', // Exporta las columnas visibles
      //     //     modifier: {
      //     //       page: 'all', // Exporta todas las filas
      //     //     },
      //     //   },
      //     // },
      //     // {
      //     //   extend: 'print',
      //     //   text: 'Imprimir',
      //     //   className: 'btn btn-primary input-xs',
      //     //   exportOptions: {
      //     //     columns: ':visible', // Exporta las columnas visibles
      //     //     modifier: {
      //     //       page: 'all', // Exporta todas las filas
      //     //     },
      //     //   },
      //     // },
      //   ],
      //   language: {
      //     decimal: ',',
      //     thousands: '.',
      //     lengthMenu: 'Mostrar _MENU_ registros por página',
      //     zeroRecords: 'No se encontraron resultados',
      //     info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
      //     infoEmpty: 'Mostrando 0 a 0 de 0 registros',
      //     infoFiltered: '(filtrado de _MAX_ registros totales)',
      //     search: 'Buscar:',
      //     paginate: {
      //       first: 'Primero',
      //       last: 'Último',
      //       next: 'Siguiente',
      //       previous: 'Anterior',
      //     },
      //   },
      // });
    } else {
      alert('Error al traer los datos');
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  }
}
