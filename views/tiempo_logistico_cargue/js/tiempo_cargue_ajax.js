$(document).ready(function() {
  let params1 = new URLSearchParams(location.search);
  let mnf = params1.get('manifiesto');
  let ocr = params1.get('orden_cargue');

  /* Fecha y Hora de Llegada de Cargue */
  var hirllegada = document.getElementById('hirllegada');
  var error = document.getElementById('error');

  hirllegada.addEventListener('input', function() {
    var value = hirllegada.value.replace(/[^0-9]/g, ''); // Solo números
    if (value.length > 4) value = value.slice(0, 4); // Máximo 4 dígitos
    // Insertar ':'
    if (value.length > 2) {
      value = value.slice(0, 2) + ':' + value.slice(2);
    }
    hirllegada.value = value;
    // Validar hora
    if (value.length === 5) {
      var [hours, minutes] = value.split(':').map(Number);
      if (hours > 23 || minutes > 59) {
        error.innerHTML = '<span class="label label-danger"> Hora inválida. Debe ser entre 00:00 y 23:59</span>';
        let fehca_llegada_cargue = $('#firentrada');
        let hora_llegada_cargue = $('#hirentrada');
        fehca_llegada_cargue.prop('disabled', true);
        hora_llegada_cargue.prop('disabled', true);
        // hora_llegada_cargue.focus();
      } else {
        error.textContent = '';
        let fehca_llegada_cargue = $('#firentrada');
        let hora_llegada_cargue = $('#hirentrada');
        fehca_llegada_cargue.prop('disabled', false);
        hora_llegada_cargue.prop('disabled', false);
      }
    } else {
      error.textContent = '';
      let fehca_llegada_cargue = $('#firentrada');
      let hora_llegada_cargue = $('#hirentrada');
      fehca_llegada_cargue.prop('disabled', false);
      hora_llegada_cargue.prop('disabled', false);
    }
  });

  /* Fecha y Hora de Entrada de Cargue */
  var hirentrada = document.getElementById('hirentrada');
  var error2 = document.getElementById('error2');

  hirentrada.addEventListener('input', function() {
    var value = hirentrada.value.replace(/[^0-9]/g, ''); // Solo números
    if (value.length > 4) value = value.slice(0, 4); // Máximo 4 dígitos
    // Insertar ':'
    if (value.length > 2) {
      value = value.slice(0, 2) + ':' + value.slice(2);
    }
    hirentrada.value = value;
    // Validar hora
    if (value.length === 5) {
      var [hours, minutes] = value.split(':').map(Number);
      if (hours > 23 || minutes > 59) {
        error2.innerHTML = '<span class="label label-danger"> Hora inválida. Debe ser entre 00:00 y 23:59</span>';
        let fehca_entrada_cargue = $('#firsalida');
        let hora_entrada_cargue = $('#hirsalida');
        fehca_entrada_cargue.prop('disabled', true);
        hora_entrada_cargue.prop('disabled', true);
      } else {
        error2.textContent = '';
        let fehca_entrada_cargue = $('#firsalida');
        let hora_entrada_cargue = $('#hirsalida');
        fehca_entrada_cargue.prop('disabled', false);
        hora_entrada_cargue.prop('disabled', false);
      }
    } else {
      error2.textContent = '';
      let fehca_entrada_cargue = $('#firsalida');
      let hora_entrada_cargue = $('#hirsalida');
      fehca_entrada_cargue.prop('disabled', false);
      hora_entrada_cargue.prop('disabled', false);
    }
  });

  /* Fecha y Hora de Salida de Cargue */
  var hirsalida = document.getElementById('hirsalida');
  var error3 = document.getElementById('error3');

  hirsalida.addEventListener('input', function() {
    var value = hirsalida.value.replace(/[^0-9]/g, ''); // Solo números
    if (value.length > 4) value = value.slice(0, 4); // Máximo 4 dígitos
    // Insertar ':'
    if (value.length > 2) {
      value = value.slice(0, 2) + ':' + value.slice(2);
    }
    hirsalida.value = value;
    // Validar hora
    if (value.length === 5) {
      var [hours, minutes] = value.split(':').map(Number);
      if (hours > 23 || minutes > 59) {
        error3.innerHTML = '<span class="label label-danger"> Hora inválida. Debe ser entre 00:00 y 23:59</span>';
      } else {
        error3.textContent = '';
      }
    } else {
      error3.textContent = '';
    }
  });

  $.post(
    $('#id_url_ajax').val() + 'tiempo_logistico_cargue/Verificar_ordenes',
    'orden_cargue=' + ocr + '&manifiesto=' + mnf,
    function(data) {
      if (data) {
        data.forEach(element => {
          if (element.tipo_fecha === 'fec_llegada') {
            $('#firllegada').val(element.fecha_cargue);
            $('#hirllegada').val(element.hora_cargue);
            $('#firllegada').attr('disabled', true);
            $('#hirllegada').attr('disabled', true);
            $('#registrar_tiempo').prop('disabled', true);
          }
          if (element.tipo_fecha === 'fec_entrada') {
            $('#firentrada').val(element.fecha_cargue);
            $('#hirentrada').val(element.hora_cargue);
            $('#firentrada').attr('disabled', true);
            $('#hirentrada').attr('disabled', true);
            $('#registrar_tiempo').prop('disabled', true);
          }
          if (element.tipo_fecha === 'fec_salida') {
            $('#firsalida').val(element.fecha_cargue);
            $('#hirsalida').val(element.hora_cargue);
            $('#firsalida').attr('disabled', true);
            $('#hirsalida').attr('disabled', true);
            $('#registrar_tiempo').prop('disabled', true);
          }
        });
      }
    },
    'json',
  );

  $.post(
    $('#id_url_ajax').val() + 'tiempo_logistico_cargue/Selecciona_Ordenes_detalle',
    'manifiesto=' + mnf + '&orden_cargue=' + ocr,
    function(data) {
      if (data) {
        localStorage.setItem('ordenes', JSON.stringify(data));
        var dato = JSON.parse(localStorage.getItem('ordenes'));
        occargue = dato;
        // Variables a llenar
        $('#idmanifiesto').val(mnf);
        $('#idordencargue').val(ocr);
        $.each(dato, function(index, dato) {
          $('#placa').val(dato.placa);
        });
        for (var i = 0; i < data.length; i++) {
          // if (id === datos[i].id) {}
          $('.remesa_id').html(data[i].id);
          $('.peso').html(data[i].peso);
          $('.empaque').html(data[i].empaque);
          $('.cliente').html(data[i].Cliente);
          $('.remitente').html(data[i].Remitente);
          $('.destinatario').html(data[i].Destinatario);
          $('.placa').html(data[i].placa);
          $('.fecha_entrega').html('0000-00-00 00-00-00');
          $('.volumen').html(data[i].mer_volumen);
          $('.mercancia').html(data[i].mer_producto);
          $('.direccion_remitente').html(data[i].Direccion_Remitente);
          $('.direccion_destinatario').html(data[i].Direccion_Destinatario);
        }
      }
    },
    'json',
  );

  // Bloquedar fechas futuras
  // var fechaInput = document.getElementById("firllegada");
  var fechaInputllegada = document.getElementById('firllegada');
  // Obtén la fecha actual en el formato 'YYYY-MM-DD'
  var fechaActuallleda = new Date().toISOString().split('T')[0];
  // Establece el atributo 'max' del campo de entrada para bloquear fechas anteriores
  fechaInputllegada.setAttribute('max', fechaActuallleda);

  var fechaInputentrada = document.getElementById('firentrada');
  // Obtén la fecha actual en el formato 'YYYY-MM-DD'
  var fechaActualentrada = new Date().toISOString().split('T')[0];
  // Establece el atributo 'max' del campo de entrada para bloquear fechas anteriores
  fechaInputentrada.setAttribute('max', fechaActualentrada);

  var fechaInputsalida = document.getElementById('firsalida');
  // Obtén la fecha actual en el formato 'YYYY-MM-DD'
  var fechaActualsalida = new Date().toISOString().split('T')[0];
  // Establece el atributo 'max' del campo de entrada para bloquear fechas anteriores
  fechaInputsalida.setAttribute('max', fechaActualsalida);

  /* Valiar hora */
  $('#hirllegada').on('change', function(event) {
    event.preventDefault();
    // Obtén los valores de la fecha y la hora
    var fecha = $('#firllegada').val();
    var hora = $('#hirllegada').val();
    // Combina la fecha y la hora
    var fechaYHora = moment(fecha + ' ' + hora, 'YYYY-MM-DD HH:mm');
    // Obtén la fecha y hora actual del servidor (puedes ajustar esto según tu backend)
    var fechaActualServidor = moment();

    // Compara las fechas
    if (fechaYHora.isAfter(fechaActualServidor)) {
      // Si la fecha y hora ingresadas son mayores que la actual en el servidor, muestra un mensaje de error
      var mensaje = 'La hora de llegada no pueden ser mayor que la actual en el servidor.';
      Swal.fire({
        // position: 'top-end',
        position: 'center',
        icon: 'warning',
        title: 'Advertencia',
        text: mensaje,
        showConfirmButton: true,
        // timer: 1500,
      });
      let hora_llegada_cargue = $('#hirllegada');
      hora_llegada_cargue.focus();
      $('.nexos-content').animate({scrollTop: 2}, 600);
      $('.nexos-messages').css('display', 'block');
      $('#hirllegada').val('');
      setTimeout(() => {
        $('.nexos-messages').css('display', 'none');
      }, 3000);
      // Evita que el formulario se envíe
      event.preventDefault();
    }
  });

  $('#hirentrada').change(function(event) {
    event.preventDefault();
    // Obtén los valores de la fecha y la hora
    var fecha = $('#firentrada').val();
    var hora = $('#hirentrada').val();
    // Combina la fecha y la hora
    var fechaYHora = moment(fecha + ' ' + hora, 'YYYY-MM-DD HH:mm');
    // Obtén la fecha y hora actual del servidor (puedes ajustar esto según tu backend)
    var fechaActualServidor = moment();

    // Compara las fechas
    if (fechaYHora.isAfter(fechaActualServidor)) {
      // Si la fecha y hora ingresadas son mayores que la actual en el servidor, muestra un mensaje de error
      var mensaje = 'La hora de entrada no pueden ser mayor que la actual en el servidor.';
      Swal.fire({
        // position: 'top-end',
        position: 'center',
        icon: 'warning',
        title: 'Advertencia',
        text: mensaje,
        showConfirmButton: true,
        // timer: 1500,
      });
      $('.nexos-content').animate({scrollTop: 2}, 600);
      $('.nexos-messages').css('display', 'block');
      $('#hirentrada').val('');
      setTimeout(() => {
        $('.nexos-messages').css('display', 'none');
      }, 3000);
      // Evita que el formulario se envíe
      event.preventDefault();
    }
  });

  $('#hirsalida').change(function(event) {
    event.preventDefault();
    // Obtén los valores de la fecha y la hora
    var fecha = $('#firsalida').val();
    var hora = $('#hirsalida').val();
    // Combina la fecha y la hora
    var fechaYHora = moment(fecha + ' ' + hora, 'YYYY-MM-DD HH:mm');
    // Obtén la fecha y hora actual del servidor (puedes ajustar esto según tu backend)
    var fechaActualServidor = moment();

    // Compara las fechas
    if (fechaYHora.isAfter(fechaActualServidor)) {
      // Si la fecha y hora ingresadas son mayores que la actual en el servidor, muestra un mensaje de error
      var mensaje = 'La hora de salida no pueden ser mayor que la actual en el servidor.';
      Swal.fire({
        // position: 'top-end',
        position: 'center',
        icon: 'warning',
        title: 'Advertencia',
        text: mensaje,
        showConfirmButton: true,
        // timer: 1500,
      });
      $('.nexos-content').animate({scrollTop: 2}, 600);
      $('.nexos-messages').css('display', 'block');
      $('#hirsalida').val('');
      setTimeout(() => {
        $('.nexos-messages').css('display', 'none');
      }, 3000);
      // Evita que el formulario se envíe
      event.preventDefault();
    }
  });

  $('#busca_dato').click(function() {
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
      $('.nexos-messages').css('display', 'block');
    }
  });

  $('#registrar_tiempo').click(function() {
    $('.nexos-messages').html('');
    var msg_error = '';
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
    // var feccaptura = ($("#fircargar").val() + ' ' + $("#hircargar").val());
    var fec2 = $('#firllegada').val() + ' ' + $('#hirllegada').val();
    var fec3 = $('#firentrada').val() + ' ' + $('#hirentrada').val();
    var fec4 = $('#firsalida').val() + ' ' + $('#hirsalida').val();
    //completar fechas
    // var fcaptura2 = (feccaptura + ':00');
    var fecllegada = fec2 + ':00';
    var fecentrada = fec3 + ':00';
    var fecsalida = fec4 + ':00';
    //color formato fecha-mes-dia hora-minuto-segundo a todas las fechas capturadas
    // var A = moment(fcaptura2).format("YYYY-MM-DD HH:mm:ss");
    var B = moment(fecllegada).format('YYYY-MM-DD HH:mm:ss');
    var C = moment(fecentrada).format('YYYY-MM-DD HH:mm:ss');
    var D = moment(fecsalida).format('YYYY-MM-DD HH:mm:ss');
    //formatear fechas
    // var captura = moment(A);
    var captura2 = moment(B);
    var captura3 = moment(C);
    var captura4 = moment(D);
    //sacar la diferencia de cada fecha
    // var tf1 = captura.diff(captura2, "minutes");
    var tf2 = captura2.diff(captura3, 'minutes');
    var tf3 = captura3.diff(captura4, 'minutes');

    // tf1 = Math.abs(tf1);
    tf2 = Math.abs(tf2);
    tf3 = Math.abs(tf3);
    console.log(tf2);
    // if (fcaptura2 >= fecllegada) {
    // 	msg_error += "<p>La fecha 2 debe ser <strong> mayor </strong> a la fecha 1, para registrar los Tiempos Logísticos de Cargue</p>";
    // }
    if (fecllegada >= fecentrada) {
      msg_error += '<p>La fecha 1 debe ser <strong> mayor </strong> a la fecha 2, para registrar los Tiempos Logísticos de Cargue</p>';
    }
    if (fecentrada >= fecsalida) {
      msg_error += '<p>La fecha 2 debe ser <strong> mayor </strong> a la fecha 3, para registrar los Tiempos Logísticos de Cargue</p>';
    }
    // if (tf1 <= 15) {
    //   msg_error += "<p>Entre la fecha 1 y entre la fecha 2 debe haber 15 minutos de diferencia</p>";
    // }
    if (tf2 <= 15) {
      msg_error += '<p>Entre la fecha 1 y entre la fecha 2 debe haber 15 minutos de diferencia</p>';
    }
    if (tf3 <= 15) {
      msg_error += '<p>Entre la fecha 2 y entre la fecha 1 debe haber 15 minutos de diferencia</p>';
    }
    if (!msg_error) {
      Registrar_Tiempo();
    } else {
      $('.nexos-messages').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          '</div></div>',
      );
      $('.nexos-content').animate({scrollTop: 2}, 800);
      $('.nexos-messages').css('display', 'block');
    }
  });
});

function Registrar_Tiempo() {
  if (window.confirm('¿Esta seguro de registrar los tiempos de cargue?')) {
    $('#manifiestos').val();
    var manifiesto = $('#idmanifiesto').val();
    var placa = $('#placa').val();
    idprincipal = '';
    orden = $('#idordencargue').val();
    //fecha2
    var tp2 = $('#tpfecha2').val();
    var f2 = $('#firllegada').val();
    var h2 = $('#hirllegada').val();
    // var ob2 = $("#obs2").val();
    //fecha 3
    var tp3 = $('#tpfecha3').val();
    var f3 = $('#firentrada').val();
    var h3 = $('#hirentrada').val();
    // var ob3 = $("#obs3").val();
    //fecha 4
    var tp4 = $('#tpfecha4').val();
    var f4 = $('#firsalida').val();
    var h4 = $('#hirsalida').val();
    // var ob4 = $("#obs4").val();
    //construir paquete de datos
    /*paquete_tiempo="manifieso="+mnf+"&fircargar="+fircargar+"&hircargar="+hircargar+"&observair="+observair
		+"&num_oden="+orden+"&placa="+placa_v+"&idtabla="+idprincipal;*/
    paquete_tiempo =
      'manifiesto=' +
      manifiesto +
      '&placa=' +
      placa +
      '&tipofechallega=' +
      tp2 +
      '&fllegcargar=' +
      f2 +
      '&hllegcargar=' +
      h2 +
      // "&obserllego=" +
      // ob2 +
      '&tipofechaentro=' +
      tp3 +
      '&fentrocarga=' +
      f3 +
      '&hentrocarga=' +
      h3 +
      // "&obsentro=" +
      // ob3 +
      '&tipofechasali=' +
      tp4 +
      '&fsalidacarga=' +
      f4 +
      '&hsalidacarga=' +
      h4 +
      // "&obssalio=" +
      // ob4 +
      '&num_orden=' +
      orden;
    $.post($('#id_url_ajax').val() + 'tiempo_logistico_cargue/Registro_Tiempo_Cargue', paquete_tiempo, function(data) {
      var da = JSON.parse(data);
      if (da.numero === 200) {
        $('.nexos-messages').html(
          '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><i class="fas fa-check"></i></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Mensaje </strong>' +
            da.mensaje +
            '</div></div>',
        );
        $('.nexos-content').animate({scrollTop: 2}, 600);
        $('.nexos-messages').css('display', 'block');
        location.reload();
      } else if (da.numero === 400) {
        // mensaje = "Datos No fueron Registrados!!";
        $('.nexos-messages').html(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
            da.mensaje +
            '</div></div>',
        );
        $('.nexos-content').animate({scrollTop: 2}, 600);
        $('.nexos-messages').css('display', 'block');
      }
    });
  } else {
    console.log('Operación cancelada');
  }
}

function Buscar_Dato(manifiesto) {
  mnf = manifiesto;
  $.post(
    $('#id_url_ajax').val() + 'tiempo_logistico_cargue/Selecciona_Manifiesto_Individual',
    'manifiesto=' + mnf,
    function(data) {
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
