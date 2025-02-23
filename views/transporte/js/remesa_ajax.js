$(document).ready(function() {
  $.post(
    $('#id_url_ajax').val() + 'transporte/Seleccione_orden',
    function(data) {
      if (data) {
        for (var i = 0; i < data.length; i++) {
          var idorden = data[i]['id'];
          var service = data[i]['mer_idservicio'];
          var remi = data[i]['id_remitente'];
          var dest = data[i]['id_destinatario'];
          var preal = data[i]['ca_pesocargue'];
          var idpunto = data[i]['id_punto'];

          $('#orden_cargue').append(
            '<option value="' +
              idorden +
              '" data-uno="' +
              idorden +
              '"  data-dos="' +
              service +
              '"  data-tres="' +
              remi +
              '" data-cuatro="' +
              dest +
              '"  data-cinco="' +
              preal +
              '" data-seis="' +
              idpunto +
              '">Orden: ' +
              data[i]['id'] +
              ' /Remi: (' +
              data[i]['id_remitente'] +
              ') ' +
              data[i]['remitente'] +
              ' /Dest: (' +
              data[i]['id_destinatario'] +
              ') ' +
              data[i]['destinatario'] +
              ' /Placa: ' +
              data[i]['placa'] +
              '</option>',
          );
        }
      }
    },
    'json',
  );
});

//Traer datos de la orden
$('#orden_cargue').change(function() {
  var orden = $('#orden_cargue').val();
  if (orden != '') {
    var idoc = $(this).find(':selected').data('uno');
    var servicio = $(this).find(':selected').data('dos');
    var remi = $(this).find(':selected').data('tres');
    var dest = $(this).find(':selected').data('cuatro');
    var peso_real_carga = $(this).find(':selected').data('cinco');
    var in_puntore = $(this).find(':selected').data('seis');
    $('#num_oc').val(idoc);
    $('#num_remi').val(remi);
    $('#num_dest').val(dest);
    $('#num_solicitud').val(servicio);
    $('#cantidad_real').val(peso_real_carga);
    $('#id_puntorem').val(in_puntore);
    //consultar datos de la solicitud
    $.post(
      $('#id_url_ajax').val() + 'transporte/Datos_Orden',
      'servicio=' + servicio,
      function(data) {
        if (data) {
          var carga;
          if (data[0]['tipo_carga'] == 'G') {
            carga = 'General';
          }
          if (data[0]['tipo_carga'] == 'P') {
            carga = 'Paqueteo';
          }
          if (data[0]['tipo_carga'] == 'C') {
            carga = 'Contenedor cargado';
          }
          $('#oficina').val(data[0]['nombrea']);
          $('#tempaque').val(data[0]['empaque']);
          $('#toperacion').val(carga);
          $('#valor_mercancia').val(data[0]['valor_mercancia']);
          $('#naturaleza').val(carga);
          $('#cantidad').val(data[0]['cantidad_empaque']);
          $('#volumen_total').val(data[0]['volumen_total']);
          $('#peso_neto_tn').val(data[0]['peso_neto_tn']);
          $('#mercancia').val(data[0]['tipo_mercancia']);
          $('#unidad_medida').val(data[0]['tipo_servicio_mer']);
          //propietario
          $('#protipoi').val(data[0]['tipo_documento']);
          $('#pronumero').val(data[0]['documento'] + '-' + data[0]['digito_verificacion']);
          $('#pronombre').val(data[0]['nombre']);
          $('#prodireccion').val(data[0]['direccion']);
          $('#promunicipio').val(data[0]['ciudad']);
          $('#propostal').val(data[0]['codigo_postal']);
          $('#observacion_cliente').val(data[0]['observaciones']);
        }
      },
      'json',
    );
    //consultar origenes-destinos & remitente-destinatarios
    $.post(
      $('#id_url_ajax').val() + 'transporte/Origen_Destino',
      'servicio=' + servicio,
      function(data) {
        $('#origen_destino').html('');
        if (data) {
          $('#origen_destino').append(
            '<span><p><strong>Origen:</strong> ' + data[0]['origen'] + ' - <strong>Destino:</strong> ' + data[0]['destino'] + '</p></span>',
          );
        }
      },
      'json',
    );
    //consultar datos de remitente - acordeon
    $.post(
      $('#id_url_ajax').val() + 'transporte/Dato_remitente',
      'servicio=' + servicio + '&remit=' + remi,
      function(datu) {
        if (datu) {
          $('#rnombre').val(datu[0]['nombre']);
          $('#rciudad').val(datu[0]['ciudad']);
          $('#rdireccion').val(datu[0]['direccion_entrega']);
          $('#rtelefono').val(datu[0]['telefono']);
          $('#ridentifica').val(datu[0]['documento']);
          $('#r_fechacargue').val(datu[0]['fecha_estimada_entrega']);
          $('#r_horacargue').val(datu[0]['hora_estimada']);
          //CALCULAR HORAS Y MINUTOS
          /*var fnow=moment().format('DD/MM/YYYY');
				var hnow=moment().format('HH:MM');
				var f_pacto_cargue=(datu[0]['fecha_estimada_entrega']);
				var h_pacto_cargue=(datu[0]['hora_estimada']);
				//concatenar fechas con horas
				var fecha_actual=(fnow+' '+hnow);
				var fcargue_completa=(f_pacto_cargue+' '+h_pacto_cargue);
				var calculo_hora=(fcargue_completa.diff(fecha_actual,'hours'));
				var calculo_minuto=(fcargue_completa.diff(fecha_actual,'minutes'));
				*/
        }
      },
      'json',
    );
    //consulta datos del destinatario - acordeon
    $.post(
      $('#id_url_ajax').val() + 'transporte/Dato_Destinatario',
      'servicio=' + servicio + '&remit=' + dest + '&desti=' + dest,
      function(dato) {
        if (dato) {
          $('#dnombre').val(dato[0]['nombre']);
          $('#didentifica').val(dato[0]['documento']);
          $('#dciudad').val(dato[0]['ciudad']);
          $('#ddireccion').val(dato[0]['direccion_entrega']);
          $('#dtelefono').val(dato[0]['telefono']);
          $('#fecha_entrega').val(dato[0]['fecha_estimada_entrega']);
          $('#hora_entrega').val(dato[0]['hora_estimada']);
          $('#r_fechadescargue').val(dato[0]['fecha_estimada_entrega']);
          $('#r_horadescargue').val(dato[0]['hora_estimada']);
          $('#observacion_destinatario').val(dato[0]['observacion']);
          //Concatenar fechas con horas
          /*var f_pacto_cargue=(datu[0]['fecha_estimada_entrega']);
				var h_pacto_cargue=(datu[0]['hora_estimada']);
				var fcargue_completa=(f_pacto_cargue+' '+h_pacto_cargue);
				f_pacto_descargue=(dato[0]['fecha_estimada_entrega']);
				h_pacto_descargue=(dato[0]['hora_estimada']);
				var fdescargue_completa=(f_pacto_descargue+' '+h_pacto_descargue);
				var calcula_hora=(fdescargue_completa.diff(fcargue_completa,'hours'));
				var calcula_minuto=(fdescargue_completa.diff(fcargue_completa,'minutes'));
				*/
        }
      },
      'json',
    );
    //consultar datos del vehículo según orden de cargue correspondiente
    $.post(
      $('#id_url_ajax').val() + 'transporte/Dato_vehiculo',
      'orden=' + idoc,
      function(dato) {
        if (dato) {
          $('#placa').val(dato[0]['placa']);
          $('#conductor').val(dato[0]['nombre'] + ' ' + dato[0]['apellido1'] + ' ' + dato[0]['apellido2']);
          $('#condu_identifica').val(dato[0]['numero_documento'] + '-' + dato[0]['digito_verificacion']);
        }
      },
      'json',
    );
    //consultar precintos según la orden de cargue
    $.post(
      $('#id_url_ajax').val() + 'transporte/precintos',
      'orden=' + idoc,
      function(dato) {
        $('#tb_precinto').html('');
        if (dato) {
          for (var i = 0; i < dato.length; i++) {
            $('#tb_precinto').append('<tr><td>' + dato[i]['serie_precinto'] + '</td>' + '<td>' + dato[i]['tipo_precinto'] + '</td>' + '</tr>');
          }
        }
      },
      'json',
    );
  } else {
    alert('Limpiar campos');
  }
});

function Calculo_Cantidad_hm() {
  alert('CALCULO CANTIDAD');
  var now = moment().format('DD/MM/YYYY');

  alert(now);
  var f_pacto_cargue = $('#r_fechacargue').val();
  var f_pacto_descargue = $('#r_fechadescargue').val();
  var h_pacto_cargue = $('#r_horacargue').val();
  var h_pacto_descargue = $('#r_horadescargue').val();

  /*alert(now);
	alert(f_pacto_cargue);
	alert(f_pacto_descargue);
	alert(h_pacto_cargue);
	alert(h_pacto_descargue);*/

  //calcular cantidad de horas y minutos de cargue
  /*var horas_cargo=(f_pacto_cargue.diff(f_pacto_cargue,'hours'));
	var minuto_cargo=(h_pacto_cargue.diff(h_pacto_cargue,'minutes'));
	*/

  //calcular cantidad de horas y minutos de descargue
  /*var horas_descargo=(f_pacto_cargue.diff(f_pacto_descargue,'hours'));
	var minuto_descargo=(h_pacto_cargue.diff(h_pacto_descargue,'minutes'));
	*/
}

//validaciondes del archivo
function fileValidation() {
  var fileInput = document.getElementById('archivo_adjunto');
  var filePath = fileInput.value;
  var allowedExtensions = /(.jpg|.jpeg|.png|.gif)$/i;
  var imgsize = document.getElementById('archivo_adjunto').files[0].size;
  if (imgsize > 2000000) {
    var msg_error = 'El archivo supera los 2Mb ';
    $('#msg_present').html(
      '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
        msg_error +
        '</div></div>',
    );
    fileInput.value = '';
    return false;
  }
  if (!allowedExtensions.exec(filePath)) {
    var msg_error = 'Extensiones permitidas para archivos .jpeg/ .jpg/ .png/ .gif ';
    $('#msg_present').html(
      '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
        msg_error +
        '</div></div>',
    );
    fileInput.value = '';
    return false;
  } else {
    //Image preview
    if (fileInput.files && fileInput.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {};
      reader.readAsDataURL(fileInput.files[0]);
      var valor = $('#archivo_adjunto').val();
      fic = valor.split('\\');
      if (fic == '' || fic == null) {
        $('#imagePreview2').val('');
      } else {
        $('#imagePreview2').val(fic[fic.length - 1]);
      }
    }
  }
}

$('#Registrar_remesa').click(function() {
  if (window.confirm('¿Deseas guardar la remesa de transporte?')) {
    var msg_error = '';
    if (!$('#orden_cargue').val()) {
      msg_error += '<p>Debe seleccionar la <strong>Orden de cargue</strong> para registrar la remesa</p>';
      AplicaFoco('#orden_cargue');
    } else {
      RemueveFoco('#orden_cargue');
    }
    if (!$('#rcontacto_remesa').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Remesa contado</strong> para registrar la remesa</p>';
      AplicaFoco('#rcontacto_remesa');
    } else {
      RemueveFoco('#rcontacto_remesa');
    }
    if (!$('#rcontra_remesa').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Remesa contraentrega</strong> para registrar la remesa</p>';
      AplicaFoco('#rcontra_remesa');
    } else {
      RemueveFoco('#rcontra_remesa');
    }
    if (!$('#r_horacargue').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Hora pactada del cargue</strong> para registrar la remesa</p>';
      AplicaFoco('#r_horacargue');
    } else {
      RemueveFoco('#r_horacargue');
    }
    if (!$('#r_fechacargue').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Fecha/hora cita cargue</strong> para registrar la remesa</p>';
      AplicaFoco('#r_fechacargue');
    } else {
      RemueveFoco('#r_fechacargue');
    }
    if (!$('#r_horadescargue').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Hora pactada del descargue</strong> para registrar la remesa</p>';
      AplicaFoco('#r_horadescargue');
    } else {
      RemueveFoco('#r_horadescargue');
    }
    if (!$('#r_fechadescargue').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Fecha/hora cita descargue</strong> para registrar la remesa</p>';
      AplicaFoco('#r_fechadescargue');
    } else {
      RemueveFoco('#r_fechadescargue');
    }
    if (!$('#cantidad_real').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Cantidad_cargada</strong> para registrar la remesa</p>';
      AplicaFoco('#cantidad_real');
    } else {
      RemueveFoco('#cantidad_real');
    }
    if (!$('#cant_hour_cargue').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Horas pacto cargue</strong> para registrar la remesa</p>';
      AplicaFoco('#cant_hour_cargue');
    } else {
      RemueveFoco('#cant_hour_cargue');
    }
    if (!$('#cant_min_cargue').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Minutos pacto cargue</strong> para registrar la remesa</p>';
      AplicaFoco('#cant_min_cargue');
    } else {
      RemueveFoco('#cant_min_cargue');
    }
    if (!$('#cant_hour_descargue').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Horas pacto descargue</strong> para registrar la remesa</p>';
      AplicaFoco('#cant_hour_descargue');
    } else {
      RemueveFoco('#cant_hour_descargue');
    }
    if (!$('#cant_min_descargue').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Minutos pacto descargue</strong> para registrar la remesa</p>';
      AplicaFoco('#cant_min_descargue');
    } else {
      RemueveFoco('#cant_min_descargue');
    }
    if (!msg_error) {
      Registro_Remesa();
    } else {
      $('#msg_present').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          '</div></div>',
      );
      $('.panel-group accordion').animate({scrollTop: 0}, 600);
    }
  } else {
    // Código a ejecutar si el usuario hace clic en "Cancelar"
    console.log('Operación Cancelada');
  }
});

async function Registro_Remesa() {
  //datos de la remesa
  var num_orden = $('#num_oc').val();
  var fechar = $('#fecha_remesa').val();
  var horar = $('#hora_remesa').val();
  var id_remitente = $('#num_remi').val();
  var id_destinatario = $('#num_dest').val();
  var sol_servicio = $('#num_solicitud').val();
  var r_contado = $('#rcontacto_remesa').val();
  var rcontra_remesa = $('#rcontra_remesa').val();
  var valor = $('#valor_mercancia').val();
  var aplicaseguro = '';
  var hcargue = $('#r_horacargue').val();
  var fcargue = $('#r_fechacargue').val();
  var hdescarga = $('#r_horadescargue').val();
  var fdescarga = $('#r_fechadescargue').val();
  var cantidad_real = $('#cantidad_real').val();
  var tn = $('#tipo_novedad').val();
  var descripcion = $('#describ_novedad').val();
  var factura = $('#dfactura').val();

  var id_puntorem = $('#id_puntorem').val();
  //nuevos datos
  var horaspactocargue = $('#cant_hour_cargue').val();
  var minutospactodcargue = $('#cant_min_cargue').val();
  var horaspactodescargue = $('#cant_hour_descargue').val();
  var minutopactodescargue = $('#cant_min_descargue').val();
  var obsercliente = $('#observacion_cliente').val();
  var nomarchivo = $('#imagePreview2').val();
  $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
  let datos = new FormData();
  datos.append('num_orden', num_orden);
  datos.append('id_remite', id_remitente);
  datos.append('id_dest', id_destinatario);
  datos.append('sol_servicio', sol_servicio);
  datos.append('r_contado', r_contado);
  datos.append('rcontra_remesa', rcontra_remesa);
  datos.append('valor', valor);
  datos.append('seguro', aplicaseguro);
  datos.append('hcargue', hcargue);
  datos.append('fcargue', fcargue);
  datos.append('hdescarga', hdescarga);
  datos.append('fdescarga', fdescarga);
  datos.append('cantidad_real', cantidad_real);
  datos.append('tipo_nove', tn);
  datos.append('desc_nove', descripcion);
  datos.append('facturara', factura);
  datos.append('fecha_creacion', fechar);
  datos.append('hora_creacion', horar);
  datos.append('nomarchivo', nomarchivo);
  datos.append('id_puntorem', id_puntorem);
  datos.append('horaspactocargue', horaspactocargue);
  datos.append('minutospactocargue', minutospactodcargue);
  datos.append('horaspactodescargue', horaspactodescargue);
  datos.append('minutospactodescargue', minutopactodescargue);
  datos.append('obsercliente', obsercliente);
  try {
    const response = await fetch($('#id_url_ajax').val() + 'transporte/Registro_remesa', {
      method: 'POST',
      body: datos,
      cache: 'no-cache',
    });
    const data = await response.json();
    // console.log("Primera solicitud completada:", data);
    // return data;
    if (data.status == true) {
      if ($('#archivo_adjunto').val()) {
        Consulta_Remesa_Archivo(num_orden, id_remitente, id_destinatario);
      }
      //msg_present
      msg_texto = 'Datos Registrados Exitosamente NEXOSAPP Remesa N° ' + data.numero_documento;
      $('#msg_present').append(
        '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          msg_texto +
          '</div></div>',
      );
      $('#accordion1').animate({scrollTop: 0}, 900, 'swing');
      $('#Registrar_remesa').css('display', 'none');
      setTimeout(function() {
        location.reload(false);
      }, 2000);
      idordencargue = $('#num_oc').val();
    } else if (data.status == false) {
      msg_texto = 'Datos No Registrados NEXOSAPP';
      $('#msg_present').append(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          msg_texto +
          '</div></div>',
      );
      $('#accordion1').animate({scrollTop: 0}, 900, 'swing');
      $('#Registrar_remesa').css('display', 'none');
      setTimeout(function() {
        location.reload(false);
      }, 2000);
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    // Crear_Dato_Oet(numero_orden_cargue);
  }
}

function Consulta_Remesa_Archivo(num_orden, id_remitente, id_destinatario) {
  $.post(
    $('#id_url_ajax').val() + 'transporte/Consulta_IDR',
    'idorden=' + num_orden + '&remit=' + id_remitente + '&dest=' + id_destinatario,
    function(data) {
      if (data) {
        var idremesa = data['id_remesa'];
        Guardar_Archivo(idremesa);
      }
    },
    'json',
  );
}

function Guardar_Archivo(idremesa) {
  var data = null;
  data = new FormData();
  var archivo_r = document.getElementById('archivo_adjunto').files;
  for (var x = 0; x < archivo_r.length; x++) {
    data.append('archivo_adjunto' + x, archivo_r[x]);
  }
  data.append('numero_remesa', idremesa);
  $.ajax({
    url: $('#id_url_ajax').val() + 'transporte/Subir_Archivo',
    type: 'POST',
    data: data,
    cache: false,
    processData: false,
    contentType: false,
    dataType: 'json',
    success: function(data, textStatus, jqXHR) {
      if (data == 'true') {
        alert('SI MOVIO ARCHIVO');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {},
  });
}

function Crear_Dato_Oet(idorden) {
  recurso = 2;
  var paquete = 'recurso=' + recurso + '&numero=' + idorden;
  $.post(
    $('#id_url_ajax').val() + 'integrar_oet/Consulta_Transacciones',
    paquete,
    function(data) {
      if (data.status == true || data.status == 'true') {
        pal = 'Proceso terminado';
        msg_texto = 'Datos Registrados Exitosamente OET ' + data.id_remesa;
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
        }, 200000);
      } else if (data.status == false || data.status == 'false') {
        pal = 'Proceso terminado';
        msg_texto = 'Datos No Registrados Exitosamente OET ' + data.id_remesa;
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
        }, 200000);
      }
    },
    'json',
  );
}
