$(document).ready(function() {
  //remesas
  $.post(
    $('#id_url_ajax').val() + 'manifiesto/Selecciona_Remesa',
    function(data) {
      if (data) {
        for (var z = 0; z < data.length; z++) {
          $('#escoger').append('<option value="' + data[z]['id_vehiculo'] + '">' + data[z]['placa'] + '</option>');
        }
      }
    },
    'json',
  );
  //traer la fecha de pago
  var fechapago = moment().add(8, 'days');
  var ffinal = fechapago.format('YYYY-MM-DD');
  $('#fecha_pago').val(ffinal);

  $('#Registrar_remesa').click(function() {
    if (window.confirm('¿Deseas guardar el manifiesto?')) {
      // Código a ejecutar si el usuario hace clic en "Aceptar"
      $('#msg_present').html('');
      var msg_error = '';
      if (!$('#escoger').val()) {
        msg_error += '<p>Debe seleccionar la <strong>Placa</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#escoger');
      } else {
        RemueveFoco('#escoger');
      }
      if (!$('#fecha_expe').val()) {
        msg_error += '<p>El campo <strong>Fecha expedición</strong>no debe estar vacío para registrar el Manifiesto</p>';
        AplicaFoco('#fecha_expe');
      } else {
        RemueveFoco('#fecha_expe');
      }
      if (!$('#origen_viaje').val()) {
        msg_error += '<p>Debe seleccionar el <strong>Origen viaje</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#origen_viaje');
      } else {
        RemueveFoco('#origen_viaje');
      }
      if (!$('#destino_viaje').val()) {
        msg_error += '<p>Debe seleccionar el <strong>Destino viaje</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#destino_viaje');
      } else {
        RemueveFoco('#destino_viaje');
      }
      if (!$('#tipo_manifiesto').val()) {
        msg_error += '<p>Debe seleccionar el <strong>Tipo_manifiesto</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#tipo_manifiesto');
      } else {
        RemueveFoco('#tipo_manifiesto');
      }
      if (!$('#titular').val()) {
        msg_error += '<p>Debe ingresar el <strong>Titular</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#titular');
      } else {
        RemueveFoco('#titular');
      }
      if (!$('#tidentificacion').val()) {
        msg_error += '<p>Debe ingresar el <strong>Documento identificación del titular</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#tidentificacion');
      } else {
        RemueveFoco('#tidentificacion');
      }
      if (!$('#tdireccion').val()) {
        msg_error += '<p>Debe ingresar la <strong>Dirección del titular</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#tdireccion');
      } else {
        RemueveFoco('#tdireccion');
      }
      if (!$('#ttelefono').val()) {
        msg_error += '<p>Debe ingresar el <strong>Teléfono</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#ttelefono');
      } else {
        RemueveFoco('#ttelefono');
      }
      if (!$('#tciudad').val()) {
        msg_error += '<p>Debe ingresar la <strong>Ciudad del titular</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#tciudad');
      } else {
        RemueveFoco('#tciudad');
      }
      if (!$('#plak').val()) {
        msg_error += '<p>Debe ingresar <strong>Placa en Datos del vehículo</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#plak');
      } else {
        RemueveFoco('#plak');
      }
      if (!$('#mark').val()) {
        msg_error += '<p>Debe ingresar la <strong>Marca en Datos del vehículo</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#mark');
      } else {
        RemueveFoco('#mark');
      }
      if (!$('#config').val()) {
        msg_error += '<p>Debe ingresar la <strong>Configuración en Datos del vehículo</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#config');
      } else {
        RemueveFoco('#config');
      }
      if (!$('#peso').val()) {
        msg_error += '<p>Debe ingresar el <strong>Peso en Datos del vehículo</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#peso');
      } else {
        RemueveFoco('#peso');
      }
      if (!$('#tidentificacion').val()) {
        msg_error += '<p>Debe ingresar la <strong>Póliza en Datos del vehículo</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#tidentificacion');
      } else {
        RemueveFoco('#tidentificacion');
      }
      if (!$('#seguro').val()) {
        msg_error += '<p>Debe ingresar la <strong>Seguro en Datos del vehículo</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#seguro');
      } else {
        RemueveFoco('#seguro');
      }
      if (!$('#fechavence').val()) {
        msg_error += '<p>Debe ingresar el <strong>F.vencim/Soat en Datos del vehículo</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#fechavence');
      } else {
        RemueveFoco('#fechavence');
      }
      if (!$('#cnombre').val()) {
        msg_error += '<p>Debe ingresar el <strong>Nombre del conductor</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#cnombre');
      } else {
        RemueveFoco('#cnombre');
      }
      if (!$('#cidentifica').val()) {
        msg_error += '<p>Debe ingresar el <strong>Documento de identificación del conductor</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#cidentifica');
      } else {
        RemueveFoco('#cidentifica');
      }
      if (!$('#cdireccion').val()) {
        msg_error += '<p>Debe ingresar el <strong>Dirección del conductor</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#cdireccion');
      } else {
        RemueveFoco('#cdireccion');
      }
      if (!$('#ctelefono').val()) {
        msg_error += '<p>Debe ingresar la <strong>Teléfono del conductor</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#ctelefono');
      } else {
        RemueveFoco('#ctelefono');
      }
      if (!$('#clicencia').val()) {
        msg_error += '<p>Debe ingresar la <strong>N° licencia del conductor</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#clicencia');
      } else {
        RemueveFoco('#clicencia');
      }
      if (!$('#cciudad').val()) {
        msg_error += '<p>Debe ingresar la <strong>Ciudad del conductor</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#cciudad');
      } else {
        RemueveFoco('#cciudad');
      }
      if (!$('#tnombre').val()) {
        msg_error += '<p>Debe ingresar la <strong>Nombre del poseedor</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#tnombre');
      } else {
        RemueveFoco('#tnombre');
      }
      if (!$('#tnumero').val()) {
        msg_error += '<p>Debe ingresar el <strong>Documento identificación del poseedor</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#tnumero');
      } else {
        RemueveFoco('#tnumero');
      }
      if (!$('#tedireccion').val()) {
        msg_error += '<p>Debe ingresar el <strong>Dirección del poseedor</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#tedireccion');
      } else {
        RemueveFoco('#tedireccion');
      }
      if (!$('#tetelefono').val()) {
        msg_error += '<p>Debe ingresar el <strong>Teléfono del poseedor</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#tetelefono');
      } else {
        RemueveFoco('#tetelefono');
      }
      if (!$('#teciudad').val()) {
        msg_error += '<p>Debe ingresar el <strong>Ciudad del poseedor</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#teciudad');
      } else {
        RemueveFoco('#teciudad');
      }
      if (!$('#total_viaje').val()) {
        msg_error += '<p>Debe ingresar el <strong>Valor total del viaje</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#total_viaje');
      } else {
        RemueveFoco('#total_viaje');
      }
      if (!$('#valor_retefuente').val()) {
        msg_error += '<p>Debe ingresar el <strong>Retención en la fuente</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#valor_retefuente');
      } else {
        RemueveFoco('#valor_retefuente');
      }
      if (!$('#valor_reteica').val()) {
        msg_error += '<p>Debe ingresar el <strong>Retención ICA</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#valor_reteica');
      } else {
        RemueveFoco('#valor_reteica');
      }
      if (!$('#valor_neto').val()) {
        msg_error += '<p>Debe ingresar el <strong>Valor Neto a Pagar</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#valor_neto');
      } else {
        RemueveFoco('#valor_neto');
      }
      //validar anticipo
      if ($('#requiere_anticipo').val() == 1) {
        if (!$('#porcentaje_anticipo').val()) {
          msg_error += '<p>Debe ingresar el <strong>Porcentaje de anticipo</strong> para registrar el Manifiesto</p>';
          AplicaFoco('#porcentaje_anticipo');
        } else {
          RemueveFoco('#porcentaje_anticipo');
        }
        if (!$('#valor_anticipo').val()) {
          msg_error += '<p>Debe ingresar el <strong>Valor Anticipo</strong> para registrar el Manifiesto</p>';
          AplicaFoco('#valor_anticipo');
        } else {
          RemueveFoco('#valor_anticipo');
        }
        if (!$('#metodo_desembolsa').val()) {
          msg_error += '<p>Debe ingresar el <strong>Método desembolso</strong> para registrar el Manifiesto</p>';
          AplicaFoco('#metodo_desembolsa');
        } else {
          RemueveFoco('#metodo_desembolsa');
        }

        /*if($("#valor_anticipado").val() > $("#valor_anticipo_lim").val() ){
					msg_error+="<p>El <strong>Valor Anticipo</strong> es mayor al <strong>Valor Límite Anticipo(65%)</strong> autorizado para registrar el Manifiesto</p>";
				}*/
      }

      if (!$('#agencia').val()) {
        msg_error += '<p>Debe ingresar el <strong>Lugar</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#agencia');
      } else {
        RemueveFoco('#agencia');
      }
      if (!$('#fecha_pago').val()) {
        msg_error += '<p>Debe ingresar la <strong>Fecha en valores</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#fecha_pago');
      } else {
        RemueveFoco('#fecha_pago');
      }
      if (!$('#cargue').val()) {
        msg_error += '<p>Debe ingresar el <strong>Cargue pagado por en Valores</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#cargue');
      } else {
        RemueveFoco('#cargue');
      }
      if (!$('#descargue').val()) {
        msg_error += '<p>Debe ingresar el <strong>Descargue</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#descargue');
      } else {
        RemueveFoco('#descargue');
      }
      if (!$('#obs').val()) {
        msg_error += '<p>Debe ingresar el <strong>Observación en valores</strong> para registrar el Manifiesto</p>';
        AplicaFoco('#obs');
      } else {
        RemueveFoco('#obs');
      }
      /*if($("#suma_remesas").val() > $("#capacidad_carga").val()){
				msg_error+="<p>La capacidad de carga o (Peso sumatoria de remesas) <strong> supera </strong> la capacidad de carga del vehículo</p>";
			}*/
      //alert($("#table_remesa").val().length);

      if (!msg_error) {
        // Crear_Manifiesto();
        Validar_Tarifa();
      } else {
        $('#msg_present').html(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
            msg_error +
            '</div></div>',
        );
        $('.panel-body').animate({scrollTop: 0}, 600);
      }
    } else {
      // Código a ejecutar si el usuario hace clic en "Cancelar"
      console.log('Operación Cnacelada.');
    }
  });

  //ANTICIPO
  $('#requiere_anticipo').change(function() {
    var rant = $('#requiere_anticipo').val();
    if (rant == 1) {
      $('#metodo_desembolsa').prop('disabled', false);
      $('#porcentaje_anticipo').prop('disabled', false);
      $('#valor_anticipo').prop('disabled', false);
      //consulta los porcentajes
      $.post(
        $('#id_url_ajax').val() + 'manifiesto/Consulta_Porcentaje',
        function(data) {
          $('#porcentaje_anticipo').html('<option value="">Seleccione</option>');
          if (data) {
            for (var i = 0; i < data.length; i++) {
              $('#porcentaje_anticipo').append('<option value="' + data[i]['valor'] + '">' + data[i]['valor'] + '</option>');
            }
          }
        },
        'json',
      );

      $('#metodo_desembolsa').html('<option value="">Seleccione</option>' + '<option value="1">Cheque</option>' + '<option value="2">Efectivo</option>' + '<option value="3">Transferencia</option>');
    }
    if (rant == 0) {
      $('#porcentaje_anticipo').html('');
      $('#valor_anticipo').val('');
      $('#tipo_cuenta').prop('disabled', true);
      $('#num_cuenta_ant').prop('disabled', true);
      $('#metodo_desembolsa').html('');
      $('#porcentaje_anticipo').html('');
      $('#valor_anticipo').val('');
      $('#metodo_desembolsa').prop('disabled', true);
      $('#porcentaje_anticipo').prop('disabled', true);
      $('#valor_anticipo').prop('disabled', true);
    }
  });

  $('#valor_anticipo').change(function() {
    //validar si el valor del anticipo se pasa del valor limite
    var anti = $('#valor_anticipo').val().replace(/,/g, '');
    var lim = $('#valor_anticipo_lim').val().replace(/,/g, '');
    var neto = $('#valor_neto').val().replace(/,/g, '');
    if ($('#vincula').val() == 'Tercero') {
      if (parseFloat(anti) > parseFloat(lim)) {
        //valor anticipo * 100 /valor total del viaje
        /*var totv=$("#total_viaje").val().replace(/,/g,"");
        var anticpo=$("#valor_anticipo").val().replace(/,/g,"");
        var formula=((parseFloat(anticpo)*100)/totv);*/
        $('#valor_anticipo').val(lim);
        $('#valor_anticipo').val(parseFloat($('#valor_anticipo').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#porcentaje_anticipo').val(65);
        saldo = parseFloat(neto) - parseFloat(lim);
        $('#saldo_manifi').val(saldo);
      } else {
        //calcular
        var totv = $('#total_viaje').val().replace(/,/g, '');
        var anticpo = $('#valor_anticipo').val().replace(/,/g, '');
        var formula = parseFloat(anticpo) * 100 / totv;
        var formu = parseFloat(formula).toFixed(2);
        $('#porcentaje_anticipo').val(formu);
        $('#valor_anticipo').val(parseFloat($('#valor_anticipo').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        saldo = parseFloat(neto) - parseFloat(anticpo);
        $('#saldo_manifi').val(saldo);
      }
    }
    //Saldo a pagar
    $('#saldo_manifi').val(parseFloat($('#saldo_manifi').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  });
  // Calcular nueva tarifa para el manifiesto
  $(document).on('keydown', function(event) {
    if (event.keyCode === 9) {
      // 9 es el keyCode de la tecla Tab
      // Aquí puedes agregar la lógica que desees
      calcular_tarifas_nuevas();
    }
  });
  //Cambiar la nueva tarifa para el manifesto en el dom
  $('#Actualizar_trarifa').click(function() {
    $('#total_viaje').val($('#total_manifiesto_tarifa').val());
    $('#valor_retefuente').val($('#valor_retefuente_tarifa').val());
    $('#valor_reteica').val($('#valor_reteica_tarifa').val());
    $('#valor_anticipo_lim').val($('#valor_anticipo_lim_tarifa').val());
    $('#valor_neto').val($('#valor_neto_tarifa').val());
    $('#saldo_manifi').val($('#saldo_manifi_tarifa').val());
    $('#actualizar_tarifas').modal('hide');
    Swal.fire({
      title: 'Mensaje!',
      text: 'Tarifa actualiada correctamente.',
      icon: 'success',
      customClass: {
        popup: 'swal2-custom-font',
      },
      timer: 500,
    });
  });
  //Calcular nueva tarifa para el manifiesto
  // $('#btn_validar_trazabilidad').click(function() {
  //   const totalViaje = $(this).attr('data-idtotal_viaje'); // O usa .attr('data-idtotal_viaje')
  //   console.log('El total del viaje es:', totalViaje);
  // });
  document.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.matches('#btn_validar_trazabilidad') || e.target.matches('#btn_validar_trazabilidad *')) {
      // Buscar el botón principal que tiene el ID
      const boton = e.target.closest('#btn_validar_trazabilidad');
      // Obtener el atributo data-id
      const dataId = boton.dataset.idtotal_viaje;

      if (dataId > $('#total_viaje').val()) {
        $('#actualizar_tarifas').modal('show');
        $('#listar_tarifas').modal('hide');
      } else if ($('#total_viaje').val() >= dataId) {
        console.log('VALORES CORRECTOS PARA LA GENERACION DEL MANIFESTO');
      }
      // console.log('El valor de data-id es:', dataId);
    }
  });
});

$('#escoger').change(function() {
  var id_carro = $('#escoger').val();
  if (id_carro != '') {
    //consulta de las remesas para montar en la tabla
    $.post(
      $('#id_url_ajax').val() + 'manifiesto/Consulta_Remesas',
      'id_carro=' + id_carro,
      function(data) {
        $('#table_remesa').html('');
        if (data) {
          var acumula = 0;
          var acumulavol = 0;
          for (var t = 0; t < data.length; t++) {
            acumula = parseFloat(acumula) + parseFloat(data[t]['cantidad_real_cargada']);
            acumulavol = parseFloat(acumulavol) + parseFloat(data[t]['mer_volumen']);
            var natur;
            if (data[t]['naturaleza'] == 1) {
              natur = 'Carga normal';
            }
            if (data[t]['naturaleza'] == 2) {
              natur = 'Carga Peligrosa';
            }
            if (data[t]['naturaleza'] == 3) {
              natur = 'Carga Extradimensionada';
            }
            if (data[t]['naturaleza'] == 4) {
              natur = 'Carga extrapesada';
            }
            if (data[t]['naturaleza'] == 5) {
              natur = 'Residuos Peligrosos';
            }
            if (data[t]['naturaleza'] == 6) {
              natur = 'Semovientes';
            }
            if (data[t]['naturaleza'] == 7) {
              natur = 'Refrigerada';
            }
            /* Agregar codigo de las ciudades del manifesto para hacer las validaciones */
            $('#codigo_origen_manifesto').val(data[t]['codigo_origen']);
            $('#codigo_destino_manifesto').val(data[t]['codigo_destino']);

            $('#table_remesa').append(
              '<tr><td>' +
                '<input type="text" class="form-control input-xs bg-ligth remid" value="' +
                data[t]['id'] +
                '" readonly="readonly">' +
                '<input type="text" class="form-control input-xs remcli" value="Nexos Cargo S.A.S." readonly="readonly" style="font-size:10px;">' +
                '</td>' +
                '<td>' +
                '<input type="text" class="form-control input-xs remori" value="' +
                data[t]['origen_rem'] +
                '" readonly="readonly" style="font-size:10px;">' +
                '<input type="text" class="form-control input-xs remdes" value="' +
                data[t]['destino_rem'] +
                '" readonly="readonly" style="font-size:10px;">' +
                '</td>' +
                '<td>' +
                '<input type="text" class="form-control input-xs remtiposer" value="' +
                data[t]['tipo_servicio_mer'] +
                '" readonly="readonly" style="font-size:10px;">' +
                '<input type="text" class="form-control input-xs remcant" value="' +
                data[t]['cantidad_empaque'] +
                '" readonly style="font-size:10px;">' +
                '</td>' +
                '<td><input type="text" class="form-control input-xs remtipomer" value="' +
                data[t]['tipo_mercancia'] +
                '" readonly style="font-size:10px;">' +
                '<input type="text" class="form-control input-xs remnatu" value="' +
                natur +
                '" readonly style="font-size:10px;">' +
                '<input type="text" class="input-xs bg-light remempaque" value="' +
                data[t]['empaque'] +
                '" readonly style="font-size:10px; border:0;">' +
                '</td>' +
                '<td><input type="text" class="form-control input-xs remnomr" value="' +
                data[t]['nomrem'] +
                '" readonly style="font-size:10px;">' +
                '<input type="text" class="form-control input-xs remdocr" readonly value="' +
                data[t]['docrem'] +
                '">' +
                '</td>' +
                '<td><input type="text" class="form-control input-xs remnomd" value="' +
                data[t]['nomdest'] +
                '" readonly style="font-size:10px;">' +
                '<input type="text" class="form-control input-xs remdocd" value="' +
                data[t]['docdest'] +
                '" readonly>' +
                '</td>' +
                '<td><input type="text" class="form-control input-xs remitr" value="' +
                data[t]['itr'] +
                '" readonly style="font-size:10px;">' +
                '</td>' +
                '</tr>',
            );
          }
          $('#suma_remesas').val(acumula);
          $('#suma_volumen').val(acumulavol);
        }
      },
      'json',
    );

    //consulta de los datos del vehículo y del conductor
    $.post(
      $('#id_url_ajax').val() + 'manifiesto/Consulta_Datos',
      'carro=' + id_carro,
      function(data) {
        if (data) {
          $('#titular').val(data['nomtenedor'] + ' ' + data['apellido1'] + ' ' + data['apellido2']);
          $('#tidentificacion').val(data['numtenedor']);
          $('#tdireccion').val(data['tendireccion']);
          $('#ttelefono').val(data['celular']);
          $('#tciudad').val(data['tenmunicipio']);
          $('#plak').val(data['placa']);
          $('#mark').val(data['marca']);
          $('#trailer').val(data['placa_trailer']);
          $('#config').val(data['confletra']);
          $('#peso').val(data['peso']);
          $('#poliza').val(data['num_soat']);
          $('#seguro').val(data['aseguradora']);
          $('#fechavence').val(data['vence_soat']);
          $('#cnombre').val(data['nomconductor'] + ' ' + data['coape1'] + ' ' + data['coape2']);
          $('#cidentifica').val(data['numero_documento']);
          $('#cdireccion').val(data['direccion']);
          $('#ctelefono').val(data['celular']);
          $('#clicencia').val(data['rndc_numero_licencia']);
          $('#cciudad').val(data['municipio']);
          $('#tnombre').val(data['nomtenedor'] + ' ' + data['apellido1'] + ' ' + data['apellido2']);
          $('#tnumero').val(data['numtenedor']);
          $('#tedireccion').val(data['tendireccion']);
          $('#tetelefono').val(data['tencelular']);
          $('#teciudad').val(data['tenmunicipio']);
          $('#agencia').val(data['nomagencia']);
          $('#capacidad_carga').val(data['capacidad_tn']);
          $('#vincula').val(data['tipo_vinculacion']);
          //valores
          $('#total_viaje').val(data['ve_fletepactado']);
          var valor = data['ve_fletepactado'];
          var valnormal2 = valor.replace(/,/g, '');
          //calcular reteica
          //Valor bruto de la mercancía X tarifa Reteica ÷ 1000
          var ica;
          if (data['nomagencia'] == 'Bogotá') {
            ica = parseFloat(4.14);
            $('#nombre_agencia_manifiesto').val(data['nomagencia']);
          }
          if (data['nomagencia'] == 'Cartagena') {
            ica = parseFloat(8.56);
            $('#nombre_agencia_manifiesto').val(data['nomagencia']);
          }
          if (data['nomagencia'] == 'Buenaventura') {
            ica = parseFloat(7);
            $('#nombre_agencia_manifiesto').val(data['nomagencia']);
          }
          if (data['nomagencia'] == 'Barranquilla') {
            ica = parseFloat(8);
            $('#nombre_agencia_manifiesto').val(data['nomagencia']);
          }
          //reteica sobre 1000 , retefuente sobre 100
          var retei = (parseFloat(valnormal2) * ica).toFixed(0);
          resica = parseFloat(retei) / parseFloat(1000);
          $('#valor_reteica').val(resica);
          $('#valor_reteica').val(parseFloat($('#valor_reteica').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          //calcular Retefuente
          var valnormal = valor.replace(/,/g, '');
          var res = parseFloat(1) * parseFloat(valnormal);
          var resultadofuente = parseFloat(res) / parseFloat(100);
          resultadofuente = resultadofuente;
          $('#valor_retefuente').val(resultadofuente);
          $('#valor_retefuente').val(parseFloat($('#valor_retefuente').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          //calcular el anticipo límite
          var anti = parseFloat(valnormal) * parseFloat(65);
          var resanti2 = parseFloat(anti) / parseFloat(100);
          $('#valor_anticipo_lim').val(resanti2);
          $('#valor_anticipo_lim').val(parseFloat($('#valor_anticipo_lim').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          //calcular el valor neto a pagar
          var suma = parseFloat(resultadofuente) + parseFloat(resica);
          var valorneto = parseFloat(valnormal) - parseFloat(suma);
          $('#valor_neto').val(valorneto);
          $('#valor_neto').val(parseFloat($('#valor_neto').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          //calcular saldo a pagar
          if ($('#valor_anticipo').val() != '' || $('#valor_anticipo').val() != 0) {
            anticipo = $('#valor_anticipo').val();
            saldo = parseFloat(valorneto) - parseFloat(anticipo);
            $('#saldo_manifi').val(saldo);
            $('#saldo_manifi').val(parseFloat($('#saldo_manifi').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          } else {
            saldo = parseFloat(valorneto) - parseFloat(0);
            $('#saldo_manifi').val(saldo);
            $('#saldo_manifi').val(parseFloat($('#saldo_manifi').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          }
        }
      },
      'json',
    );

    //origenes
    $.post(
      $('#id_url_ajax').val() + 'manifiesto/Consulta_Municipios',
      'id_vehi=' + id_carro,
      function(data) {
        $('#origen_viaje').html('<option value="">Seleccionar</option>');
        if (data) {
          for (var z = 0; z < data.length; z++) {
            $('#origen_viaje').append('<option value="' + data[z]['id'] + '">' + data[z]['municipio'] + ' - ' + data[z]['depto'] + '</option>');
          }
        }
      },
      'json',
    );

    //destinos
    $.post(
      $('#id_url_ajax').val() + 'manifiesto/Consulta_Municipios_Dest',
      'id_vehi=' + id_carro,
      function(data) {
        $('#destino_viaje').html('<option value="">Seleccionar</option>');
        if (data) {
          for (var z = 0; z < data.length; z++) {
            $('#destino_viaje').append('<option value="' + data[z]['id'] + '">' + data[z]['municipio'] + ' - ' + data[z]['depto'] + '</option>');
          }
        }
      },
      'json',
    );

    $.post(
      $('#id_url_ajax').val() + 'manifiesto/Consultar_configuracion_vehiculo',
      'id_vehi=' + id_carro,
      function(data) {
        if (data) {
          $('#configuracion_vehiculo').val(data['nombre']);
        }
      },
      'json',
    );
  }
});

// Validar valores del sicetac para la emision de los manifiestos

async function Validar_Tarifa() {
  $('#loading-overlay-rndc').css('display', 'flex');

  // Crear datos para la solicitud
  let datos = new FormData();
  datos.append('configuracion_vehiculo', $('#configuracion_vehiculo').val());
  datos.append('codigo_origen_manifesto', $('#codigo_origen_manifesto').val());
  datos.append('codigo_destino_manifesto', $('#codigo_destino_manifesto').val());
  datos.append('vehiculo_id', $('#escoger').val());

  try {
    const response = await fetch($('#id_url_ajax').val() + 'web_service/Validar_Sicetac_Prueba', {
      method: 'POST',
      body: datos,
      cache: 'no-cache',
    });

    // Procesar la respuesta en JSON
    const data = await response.json();

    if (data.status === 'true') {
      // const tablas_locales = 'Se registró el manifiesto exitosamente en el RNDC.';
      // $('#msg_present').append(
      //   `<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible">
      //     <div class="icon"><span class="mdi mdi-check"></span></div>
      //     <div class="message">
      //       <button type="button" data-dismiss="alert" aria-label="Close" class="close">
      //         <span aria-hidden="true" class="mdi mdi-close"></span>
      //       </button>
      //       <strong>Proceso terminado!</strong> ${tablas_locales} - ${JSON.stringify(data.resultado)}
      //     </div>
      //   </div>`,
      // );
      // $('#accordion1').animate({scrollTop: 0}, 600);
      await procesarResultados(data);
    } else if (data.status === 'false') {
      // Mostrar mensaje de error
      const mensajeError = data.mensaje || 'Ha ocurrido un error desconocido.';
      $('#msg_present').append(
        `<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
          <div class="icon"><span class="mdi mdi-close"></span></div>
          <div class="message">
            <button type="button" data-dismiss="alert" aria-label="Close" class="close">
              <span aria-hidden="true" class="mdi mdi-close"></span>
            </button>
            <strong>Error:</strong> ${mensajeError}
          </div>
        </div>`,
      );
      $('#accordion1').animate({scrollTop: 0}, 600);
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    $('#msg_present').append(
      `<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
        <div class="icon"><span class="mdi mdi-alert-circle"></span></div>
        <div class="message">
          <button type="button" data-dismiss="alert" aria-label="Close" class="close">
            <span aria-hidden="true" class="mdi mdi-close"></span>
          </button>
          <strong>Error:</strong> No se pudo completar la solicitud. Verifique su conexión o intente nuevamente.
        </div>
      </div>`,
    );
    $('#accordion1').animate({scrollTop: 0}, 600);
  } finally {
    $('#loading-overlay-rndc').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
  }
}

// Función para decodificar texto desde ISO-8859-1 a UTF-8
function decodeISO88591ToUTF8(text) {
  const isoBytes = new Uint8Array([...text].map(char => char.charCodeAt(0)));
  const decoder = new TextDecoder('iso-8859-1');
  return decoder.decode(isoBytes);
}

async function procesarResultados(data) {
  if (data.status === 'true') {
    // Asegúrate de que el campo "resultado" y "documento" existan antes de recorrer
    if (data.resultado && Array.isArray(data.resultado.documento)) {
      // Recorrer los documentos en el resultado
      let tbody = document.getElementById('tbody_tarifas_sicetac');
      tbody.innerHTML = '';
      // let totalHoras = 0;
      data.resultado.documento.forEach((documento, index) => {
        // console.log(typeof documento.valorhora);

        const fila = document.createElement('tr');
        if (documento.valor > $('#total_viaje').val()) {
          const columnaSicetacIndex = document.createElement('td');
          columnaSicetacIndex.innerHTML = index + 1;
          columnaSicetacIndex.style.textAlign = 'center';
          // columnaSicetacIndex.style.paddingLeft = '15px';

          const columnaSicetacUnidadTransporte = document.createElement('td');
          columnaSicetacUnidadTransporte.innerHTML = documento.nombreunidadtransporte;
          columnaSicetacUnidadTransporte.style.textAlign = 'center';
          // columnaSicetacUnidadTransporte.style.paddingLeft = '15px';
          columnaSicetacUnidadTransporte.style.color = 'white';
          columnaSicetacUnidadTransporte.style.width = 'auto';
          columnaSicetacUnidadTransporte.style.whiteSpace = 'nowrap';
          columnaSicetacUnidadTransporte.style.color = '#000000'; // Sobrescribe el color anterior

          const columnaSicetacNombreCarga = document.createElement('td');
          columnaSicetacNombreCarga.innerHTML = documento.nombretipocarga;
          columnaSicetacNombreCarga.style.textAlign = 'center';
          // columnaSicetacNombreCarga.style.paddingLeft = '15px';
          columnaSicetacNombreCarga.style.color = 'white';
          columnaSicetacNombreCarga.style.width = 'auto';
          columnaSicetacNombreCarga.style.whiteSpace = 'nowrap';
          columnaSicetacNombreCarga.style.color = '#000000'; // Sobrescribe el color anterior

          const columnaSicetacNombeRuta = document.createElement('td');
          columnaSicetacNombeRuta.innerHTML = decodeISO88591ToUTF8(documento.nombreruta);
          columnaSicetacNombeRuta.style.textAlign = 'center';
          // columnaSicetacNombeRuta.style.paddingLeft = '15px';
          columnaSicetacNombeRuta.style.color = 'white';
          columnaSicetacNombeRuta.style.width = 'auto';
          columnaSicetacNombeRuta.style.whiteSpace = 'nowrap';
          columnaSicetacNombeRuta.style.color = '#000000'; // Sobrescribe el color anterior

          const columnaSicetacValorRuta = document.createElement('td');
          columnaSicetacValorRuta.innerHTML = documento.valor;
          columnaSicetacValorRuta.style.textAlign = 'center';
          // columnaSicetacValorRuta.style.paddingLeft = '15px';

          // const columnaSicetacValorTonelada = document.createElement('td');
          // columnaSicetacValorTonelada.innerHTML = documento.valortonelada;
          // columnaSicetacValorTonelada.style.textAlign = 'center';
          // columnaSicetacValorTonelada.style.paddingLeft = '15px';

          const columnaSicetacValorHora = document.createElement('td');
          columnaSicetacValorHora.innerHTML = documento.valorhora;
          columnaSicetacValorHora.style.textAlign = 'center';
          // columnaSicetacValorHora.style.paddingLeft = '15px';

          const columnaSicetacDistancia = document.createElement('td');
          columnaSicetacDistancia.innerHTML = documento.distancia;
          columnaSicetacDistancia.style.textAlign = 'center';
          // columnaSicetacDistancia.style.paddingLeft = '15px';

          // let totalHoras = 4 * Number(documento.valorhora);
          const columnaSicetacTotalHoras = document.createElement('td');
          columnaSicetacTotalHoras.innerHTML = 4 * parseFloat(documento.valorhora);
          columnaSicetacTotalHoras.style.textAlign = 'center';
          // columnaSicetacTotalHoras.style.paddingLeft = '15px';

          const columnaSicetacTotalViaje = document.createElement('td');
          const totalHoras = 4 * parseFloat(documento.valorhora);
          const totalViaje = parseFloat(documento.valor) + totalHoras;
          columnaSicetacTotalViaje.innerHTML = totalViaje; //Redondear a 2 decimales
          columnaSicetacTotalViaje.style.textAlign = 'center';
          // columnaSicetacTotalViaje.style.paddingLeft = '15px';

          const columnaSicetacAcciones = document.createElement('td');
          columnaSicetacAcciones.innerHTML = `<a href="#" class="cell-detail  hint--top btn btn-success btn-xs" data-idtotal_viaje="${totalViaje}" id="btn_validar_trazabilidad"><i class="fas fa-retweet"></i></a>`;
          columnaSicetacAcciones.style.textAlign = 'center';
          // columnaSicetacAcciones.style.paddingLeft = '15px';

          fila.appendChild(columnaSicetacIndex);
          fila.appendChild(columnaSicetacUnidadTransporte);
          fila.appendChild(columnaSicetacNombreCarga);
          fila.appendChild(columnaSicetacNombeRuta);
          fila.appendChild(columnaSicetacValorRuta);
          // fila.appendChild(columnaSicetacValorTonelada);
          fila.appendChild(columnaSicetacValorHora);
          // fila.appendChild(columnaSicetacDistancia);
          fila.appendChild(columnaSicetacTotalHoras);
          fila.appendChild(columnaSicetacTotalViaje);
          fila.appendChild(columnaSicetacAcciones);

          tbody.appendChild(fila);
          $('#listar_tarifas').modal('show');
        }
      });
    } else {
      // console.error('El campo "resultado.documento" no es válido o no contiene un array.');
      if (data.resultado.documento.valor > $('#total_viaje').val()) {
        // alert('hola mundo desde aqui');
        $('#actualizar_tarifas').modal('show');
      } else if ($('#total_viaje').val() >= data.resultado.documento.valor) {
        // alert('hola mundo desde aqui flete mayor o gial al sicetac');
        Crear_Manifiesto();
      }
    }
  } else {
    console.error('El status no es true. Respuesta:', data);
  }
}

function roundToDecimals(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function calcular_tarifas_nuevas() {
  var ica;
  let valornormal2 = $('#total_manifiesto_tarifa').val();
  var valnormal_2 = valornormal2.replace(/,/g, '');
  if ($('#nombre_agencia_manifiesto').val() == 'Bogotá') {
    ica = parseFloat(4.14);
  }
  if ($('#nombre_agencia_manifiesto').val() == 'Cartagena') {
    ica = parseFloat(8.56);
  }
  if ($('#nombre_agencia_manifiesto').val() == 'Buenaventura') {
    ica = parseFloat(7);
  }
  if ($('#nombre_agencia_manifiesto').val() == 'Barranquilla') {
    ica = parseFloat(8);
  }
  //reteica sobre 1000 , retefuente sobre 100
  var retei = (parseFloat(valnormal_2) * ica).toFixed(0);
  resica = parseFloat(retei) / parseFloat(1000);
  $('#valor_reteica_tarifa').val(resica);
  $('#valor_reteica_tarifa').val(parseFloat($('#valor_reteica_tarifa').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //calcular Retefuente
  var valnormal = valornormal2.replace(/,/g, '');
  var res = parseFloat(1) * parseFloat(valnormal);
  var resultadofuente = parseFloat(res) / parseFloat(100);
  resultadofuente = resultadofuente;
  $('#valor_retefuente_tarifa').val(resultadofuente);
  $('#valor_retefuente_tarifa').val(parseFloat($('#valor_retefuente_tarifa').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

  //calcular el anticipo límite
  var anti = parseFloat(valnormal) * parseFloat(65);
  var resanti2 = parseFloat(anti) / parseFloat(100);
  $('#valor_anticipo_lim_tarifa').val(resanti2);
  $('#valor_anticipo_lim_tarifa').val(parseFloat($('#valor_anticipo_lim_tarifa').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

  //calcular el valor neto a pagar
  var suma = parseFloat(resultadofuente) + parseFloat(resica);
  var valorneto = parseFloat(valnormal) - parseFloat(suma);
  $('#valor_neto_tarifa').val(valorneto);
  $('#valor_neto_tarifa').val(parseFloat($('#valor_neto_tarifa').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

  //Calcular saldo del manifiesto
  saldo = parseFloat(valorneto) - parseFloat(0);
  $('#saldo_manifi_tarifa').val(saldo);
  $('#saldo_manifi_tarifa').val(parseFloat($('#saldo_manifi_tarifa').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
}

async function Crear_Manifiesto() {
  //datos del manifiesto
  var fecha_expe = $('#fecha_expe').val();
  var tipo_mnf = $('#tipo_manifiesto').val();
  var origen = $('#origen_viaje').val();
  var destino = $('#destino_viaje').val();
  var poseedor = $('#titular').val();
  var posee_num = $('#tidentificacion').val();
  var posee_dire = $('#tdireccion').val();
  var posee_tele = $('#ttelefono').val();
  var posee_ciudad = $('#tciudad').val();
  var placa = $('#plak').val();
  var marca = $('#mark').val();
  var trailer = $('#trailer').val();
  var config = $('#config').val();
  var peso = $('#peso').val();
  var poliza = $('#poliza').val();
  var seguro = $('#seguro').val();
  var fecha_vence = $('#fechavence').val();
  var condu_name = $('#cnombre').val();
  var condu_identifi = $('#cidentifica').val();
  var condu_dire = $('#cdireccion').val();
  var condu_tel = $('#ctelefono').val();
  var condu_licen = $('#clicencia').val();
  var condu_city = $('#cciudad').val();
  var tot_viaje = $('#total_viaje').val();
  var v_rete = $('#valor_retefuente').val();
  var v_reteica = $('#valor_reteica').val();
  var v_neto = $('#valor_neto').val();
  var saldo = $('#saldo_manifi').val();
  var agencia = $('#agencia').val();
  var fec_pago = $('#fecha_pago').val();
  var cargue = $('#cargue').val();
  var descargue = $('#descargue').val();
  var obs = $('#obs').val();
  var r_anti = $('#requiere_anticipo').val();
  var total_peso = $('#suma_remesas').val();
  var total_volumen = $('#suma_volumen').val();

  var anti_por, anti_valor, anti_limi, anti_metodo;
  if (r_anti == 1) {
    anti_por = $('#porcentaje_anticipo').val();
    anti_valor = $('#valor_anticipo').val();
    anti_limi = $('#valor_anticipo_lim').val();
    anti_metodo = $('#metodo_desembolsa').val();
  }
  if (r_anti == 0) {
    anti_por = '';
    anti_valor = '';
    anti_limi = '';
    anti_metodo = '';
  }
  //RECOGER REMESAS
  var datorem = {
    id_remesa: [],
  };

  var datoremitr = {
    manifiesto_itr: [],
  };

  $('.remid').each(function(index) {
    //id remesa
    var numremesa = $(this).val();
    datorem.id_remesa[index] = numremesa;
  });

  $('.remitr').each(function(index) {
    //id remesa
    var manitr = $(this).val();
    datoremitr.manifiesto_itr[index] = manitr;
  });

  var notanew = datorem;
  notanew = JSON.stringify(notanew);

  var notanewitr = datoremitr;
  notanewitr = JSON.stringify(notanewitr);

  var numero_documento = 0;
  $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga

  var datos = new FormData();
  datos.append('placa', placa);
  datos.append('fecha_expe', fecha_expe);
  datos.append('tipo_mnf', tipo_mnf);
  datos.append('origen', origen);
  datos.append('destino', destino);
  datos.append('posee_num', posee_num);
  datos.append('condu_identifi', condu_identifi);
  datos.append('tot_viaje', tot_viaje);
  datos.append('v_rete', v_rete);
  datos.append('v_reteica', v_reteica);
  datos.append('v_neto', v_neto);
  datos.append('saldo', saldo);
  datos.append('agencia', agencia);
  datos.append('fec_pago', fec_pago);
  datos.append('cargue', cargue);
  datos.append('descargue', descargue);
  datos.append('obs', obs);
  datos.append('r_anti', r_anti);
  datos.append('porcentaje', anti_por);
  datos.append('valor', anti_valor);
  datos.append('metodo', anti_metodo);
  datos.append('total_peso', total_peso);
  datos.append('total_volumen', total_volumen);
  datos.append('remesas', notanew);
  datos.append('remesaitr', notanewitr);

  try {
    const response = await fetch($('#id_url_ajax').val() + 'manifiesto/Registro_mnf', {
      method: 'POST',
      body: datos,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      mensaje = 'Datos Registrados Exitosamente NEXOSAPP Manifiesto N° ' + data.numero_documento;
      $('#msg_present').append(
        '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="check" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          mensaje +
          '</div></div>',
      );
      $('.panel-body').animate({scrollTop: 0}, 900, 'swing');
      // Crear_Dato_Oet(data.numero_documento);
      numero_documento = data.numero_documento;
    } else {
      mensaje = 'Datos No Registrados NEXOSAPP';
      $('#msg_present').append(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          mensaje +
          ' - ' +
          data.error +
          '</div></div>',
      );
      $('.panel-body').animate({scrollTop: 0}, 900, 'swing');
      // setTimeout(function() {
      //   location.reload(false);
      // }, 2000);
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    Crear_Remesa_Rndc(numero_documento);
  }
}

//Informacion de la carga
function Crear_Informacion_Carga(num_mani) {
  proceso = 4;
  var paquete_transmite = 'id=' + num_mani + '&proceso=' + proceso + '&dato=3' + '&filtro=""' + '&tipopro=3';
  $.post(
    $('#id_url_ajax').val() + 'web_service/InformacionCarga',
    paquete_transmite,
    function(data) {
      if (data.status == 'true') {
        tablas_locales = 'Se Registro Información de Carga Exitosamente RNDC';
        $('#msg_present').append(
          '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
            tablas_locales +
            ' - ' +
            data.resultado +
            '</div></div>',
        );
        $('#accordion1').animate({scrollTop: 0}, 600);
        Crear_Informacion_Viaje(num_mani);
      } else if (data.status == 'false') {
        tablas_locales = 'No se creo Información de Carga en RNDC';
        $('#msg_present').append(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
            tablas_locales +
            ' - ' +
            data.resultado +
            '</div></div>',
        );
        $('#accordion1').animate({scrollTop: 0}, 600);
      }
    },
    'json',
  );
}

//Informacion del viaje
function Crear_Informacion_Viaje(num_mani) {
  proceso = 4;
  var paquete_transmite = 'id=' + num_mani + '&proceso=' + procesp + '&dato=3' + '&filtro=""' + '&tipopro=3';
  $.post(
    $('#id_url_ajax').val() + 'web_service/InformacionViaje',
    paquete_transmite,
    function(data) {
      if (data.status == 'true') {
      } else if (data.status == 'false') {
      }
    },
    'json',
  );
}

//Crear remesas de carga
async function Crear_Remesa_Rndc(num_mani) {
  let proceso = 3;
  let response_rndc = false;
  $('#loading-overlay-rndc').css('display', 'flex');
  let datos = new FormData();
  datos.append('id', num_mani);
  datos.append('proceso', proceso);
  datos.append('dato', 3);
  datos.append('filtro', '');
  datos.append('tipopro', 3);

  try {
    const response = await fetch($('#id_url_ajax').val() + 'web_service/Remesas', {
      method: 'POST',
      body: datos,
      cache: 'no-cache',
    });
    const data = await response.json();

    if (data) {
      for (let z = 0; z < data.length; z++) {
        let mensaje = JSON.stringify(data[z]);
        $('#msg_present').append(
          '<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado! Resultado Remesa RNDC</strong> ' +
            mensaje +
            '</div></div>',
        );
        $('.panel-body').animate({scrollTop: 0}, 900, 'swing');
      }

      // Esperar a que se complete Validar_Remesas_Rndc
      const remesasValidadas = await Validar_Remesas_Rndc(num_mani);

      if (remesasValidadas) {
        Crear_Manifiesto_Rndc(num_mani);
        response_rndc = true;
      }
    } else {
      let mensaje = 'Datos No Registrados RNDC';
      $('#msg_present').append(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          mensaje +
          ' - ' +
          data.error +
          '</div></div>',
      );
      $('.panel-body').animate({scrollTop: 0}, 900, 'swing');
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-rndc').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    if (response_rndc === true) {
      Crear_Datorm_Oet(num_mani); // Solo se ejecuta después de todo el proceso
    } else {
      Crear_Datorm_Oet(num_mani); // Solo se ejecuta después de todo el proceso
    }
  }
}

let remponse_remesas_oet = false;
//Crear Remesa OET
async function Crear_Datorm_Oet(num_mani) {
  recurso = 2;
  $('#loading-overlay-oet').css('display', 'flex');
  let datos = new FormData();
  datos.append('recurso', recurso);
  datos.append('numero', num_mani);

  try {
    const response = await fetch($('#id_url_ajax').val() + 'integrar_oet/Consulta_Transacciones', {
      method: 'POST',
      body: datos,
      cache: 'no-cache',
    });
    const data = await response.json();
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
      $('.panel-body').animate({scrollTop: 0}, 900);
      // Crea_Dato_Oet(num_mani);
      remponse_remesas_oet = true;
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
      $('.panel-body').animate({scrollTop: 0}, 900);
      // Crea_Dato_Oet(num_mani);
      remponse_remesas_oet = false;
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-oet').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    if (remponse_remesas_oet === true) {
      Crea_Dato_Oet(num_mani);
    } else {
      pal = 'Proceso terminado';
      msg_texto = 'Datos No Registrados Exitosamente OET ' + num_mani;
      $('#msg_present').append(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>' +
          pal +
          '!</strong>' +
          msg_texto +
          ' ' +
          '</div></div>',
      );
      $('.panel-body').animate({scrollTop: 0}, 900);
    }
  }
}

let response_remesas = false;
async function Validar_Remesas_Rndc(num_mani) {
  $('#loading-overlay-rndc').css('display', 'flex');
  let datos = new FormData();
  datos.append('manifiesto', num_mani);

  try {
    const response = await fetch($('#id_url_ajax').val() + 'manifiesto/Valida_Remesas', {
      method: 'POST',
      body: datos,
      cache: 'no-cache',
    });

    const data = await response.json();

    if (data[0]['can_remesa'] == data[0]['can_re_rndc']) {
      response_remesas = true; // Indicamos que las remesas están listas
    } else {
      mensaje = 'No puede transmitir manifiesto porque hay remesas por crear en RNDC';
      $('#msg_present').append(
        '<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado! Resultado RNDC</strong> ' +
          mensaje +
          '</div></div>',
      );
      $('.panel-body').animate({scrollTop: 0}, 900, 'swing');
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-rndc').css('display', 'none');
    return response_remesas; // Devolvemos el estado de las remesas
  }
}

async function Crear_Manifiesto_Rndc(num_mani) {
  //alert('crear manifiesto en el ministerio'+num_mani);
  proceso = 4;
  // var paquete_transmite = 'id=' + num_mani + '&proceso=' + proceso + '&dato=3' + '&filtro=""' + '&tipopro=3';
  $('#loading-overlay-rndc').css('display', 'flex');
  let datos = new FormData();
  datos.append('id', num_mani);
  datos.append('proceso', proceso);
  datos.append('dato', '3');
  datos.append('filtro', '');
  datos.append('tipopro', '3');

  try {
    const response = await fetch($('#id_url_ajax').val() + 'web_service/Transmite_Manifiesto', {
      method: 'POST',
      body: datos,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data.status == 'true') {
      tablas_locales = 'Se Registro Manifiesto ' + data.num_manifiesto;
      +' Exitosamente RNDC';
      $('#msg_present').append(
        '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="check" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
      );
      $('#accordion1').animate({scrollTop: 0}, 600);
      //Crea_Dato_Oet(num_mani);
    } else if (data.status == 'false') {
      tablas_locales = 'No se creo Manifiesto ' + data.num_manifiesto;
      +' en RNDC';
      $('#msg_present').append(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          ' - ' +
          data.resultado +
          '</div></div>',
      );
      $('#accordion1').animate({scrollTop: 0}, 600);
      //Crea_Dato_Oet(num_mani);
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-rndc').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    // Crear_Datorm_Oet(num_mani);
  }
}

async function Crea_Dato_Oet(num_manifiesto) {
  recurso = 3;
  // var paquete = 'recurso=' + recurso + '&numero=' + num_manifiesto;

  let datos = new FormData();
  datos.append('recurso', recurso);
  datos.append('numero', num_manifiesto);
  $('#loading-overlay-oet').css('display', 'flex');

  try {
    const response = await fetch($('#id_url_ajax').val() + 'integrar_oet/Consulta_Transacciones', {
      method: 'POST',
      body: datos,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data.status == true || data.status == 'true') {
      pal = 'Proceso terminado';
      msg_texto = 'Datos Manifiesto Registrados Exitosamente OET';
      $('#msg_present').append(
        '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>' +
          pal +
          '!</strong>' +
          msg_texto +
          '</div></div>',
      );
      $('#accordion1').animate({scrollTop: 0}, 900);
      // setTimeout(function() {
      //   location.reload(false);
      // }, 2000);
    } else if (data.status == false || data.status == 'false') {
      pal = 'Proceso terminado';
      msg_texto = 'Datos Manifiesto No Registrados Exitosamente OET';
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
      // setTimeout(function() {
      //   location.reload(false);
      // }, 2000);
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-oet').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    // location.reload(false);
  }
}
