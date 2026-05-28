(function () {
  "use strict";
  window.VENTANA = null;
  window.URL_DSNUBE = null;

  window.initScript = function (id) {
    window.VENTANA = id;
    window.URL_DSNUBE = document.getElementById('url_api_dsnube').value;

    $('#contenedor_datos').css('display', 'none');
    $('#contenedor_anticipo').css('display', 'none');
    $('#tabla_datos').css('display', '');

    $('#buscar_manifies').click(function () {
      TablaManifiesto();
      porcentaje();
    });

    //remesas
    $.post(
      $('#base_url').val() + 'manifiesto/Selecciona_Remesa',
      function (data) {
        if (data) {
          for (var z = 0; z < data.length; z++) {
            $('#escoger').append('<option value="' + data[z]['id_vehiculo'] + '">' + data[z]['placa'] + '</option>');
          }
        }
      },
      'json',
    );

    //obtener el valor final según el porcetanej
    $('#porcentaje_anticipo').change(function () {
      var por = $('#porcentaje_anticipo').val();
      var totviaje = $('#vant_total').val();
      var anti2 = parseFloat(totviaje) * parseFloat(por);
      var resanti2 = parseFloat(anti2) / 100;
      $('#valor_sugerido').val(resanti2);
    });

    //validar el boton de guardar anticipo
    $('#registrar_anticipo').click(function () {
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
          $('#base_url').val() + 'manifiesto/Registro_Anticipo',
          dato,
          function (data) {
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
        $('.panel-body').animate({ scrollTop: 0 }, 600);
      }
    });

    //imprimir
    $('#btn_imprimir').click(function () {
      //id del manifiesto
      var id_mnf = $('#v_mani').val();
      var url;

      // dato_pdf = Array(dato_pdf1);
      url = $('#base_url').val() + 'libs/manifiesto_pdf.php?' + 'id_mnf=' + codificarBase64(id_mnf);
      window.open(url, '_blank');
    });

    // JavaScript
    document.getElementById('exportar_excel').addEventListener('click', function () {
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

    $('#escoger').change(function () {
      var id_carro = $('#escoger').val();

      if (id_carro != '') {
        //consulta de las remesas para montar en la tabla
        $.post(
          $('#base_url').val() + 'manifiesto/Consulta_Remesas',
          'id_carro=' + id_carro,
          function (data) {
            $('#table_remesa').html('');
            if (data) {
              var acumula = 0;
              var acumulavol = 0;
              for (var t = 0; t < data.length; t++) {
                acumula += parseFloat(data[t]['cantidad_real_cargada'] || 0);
                acumulavol += parseFloat(data[t]['mer_volumen'] || 0);

                // Guardar codigos de ciudades
                $('#codigo_origen_manifesto').val(data[t]['codigo_origen']);
                $('#codigo_destino_manifesto').val(data[t]['codigo_destino']);

                $('#table_remesa').append(`
                <tr>
                  <!-- Remesa -->
                  <td class="align-middle text-center" style='width:auto; white-space: nowrap;'>
                    <input type="hidden" class="form-control input-xs bg-ligth remid" value="${data[t]['remesa_id']}">
                    <div class="fw-bold text-dark">${data[t]['remesa_id']}</div>
                    <div class="small text-muted">Nexos Cargo S.A.S.</div>
                  </td>

                  <!-- Origen - Destino -->
                  <td class="align-middle" style='width:auto; white-space: nowrap;'>
                    <div class="fw-bold">${data[t]['origen_rem']}</div>
                    <div class="text-muted small">${data[t]['destino_rem']}</div>
                  </td>

                  <!-- Servicio / Cantidad -->
                  <td class="align-middle text-center" style='width:auto; white-space: nowrap;'>
                    <div>${data[t]['servicio_cant']}</div>
                    <!--<div>${data[t]['tipo_servicio_mer']}</div>
                    <div class="text-muted small">${data[t]['cantidad_empaque']} Unid.</div>-->
                  </td>

                  <!-- Producto (Agrupado) -->
                  <td class="align-middle" style='width:auto; white-space: nowrap;'>
                    ${data[t]['productos']}
                  </td>

                  <!-- Destinatario -->
                  <td class="align-middle" style='width:auto; white-space: nowrap;'>
                    <div class="fw-bold">${data[t]['nomrem']}</div>
                    <div class="text-muted small">${data[t]['docrem']}</div>
                  </td>

                  <!-- Remitente -->
                  <td class="align-middle" style='width:auto; white-space: nowrap;'>
                    <div class="fw-bold">${data[t]['nomdest']}</div>
                    <div class="text-muted small">${data[t]['docdest']}</div>
                  </td>

                  <!-- ITR -->
                  <td class="align-middle text-center" style='width:auto; white-space: nowrap;'>
                    <span class="badge bg-${data[t]['itr'] === 'Si' ? 'success' : 'secondary'}">
                      ${data[t]['itr']}
                    </span>
                  </td>
                </tr>
              `);
              }
              $('#suma_remesas').val(acumula);
              $('#suma_volumen').val(acumulavol);
            }
          },
          'json',
        );


        //consulta de los datos del vehículo y del conductor
        $.post(
          $('#base_url').val() + 'manifiesto/Consulta_Datos',
          'carro=' + id_carro,
          function (data) {
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

              //Calcaular Fopat
              var retfopat = (parseFloat(valnormal2) * parseFloat(0.001)).toFixed(0);
              // resfopat = parseFloat(retfopat) / parseFloat(1000);
              $('#valor_fopat').val(retfopat);
              $('#valor_fopat').val(parseFloat($('#valor_fopat').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

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
        $.post($('#base_url').val() + 'manifiesto/Consulta_Municipios', 'id_vehi=' + id_carro,
          function (data) {
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
        $.post($('#base_url').val() + 'manifiesto/Consulta_Municipios_Dest', 'id_vehi=' + id_carro,
          function (data) {
            $('#destino_viaje').html('<option value="">Seleccionar</option>');
            if (data) {
              for (var z = 0; z < data.length; z++) {
                $('#destino_viaje').append('<option value="' + data[z]['id'] + '">' + data[z]['municipio'] + ' - ' + data[z]['depto'] + '</option>');
              }
            }
          },
          'json',
        );

        $.post($('#base_url').val() + 'manifiesto/Consultar_configuracion_vehiculo', 'id_vehi=' + id_carro,
          function (data) {
            if (data) {
              $('#configuracion_vehiculo').val(data['nombre']);
            }
          },
          'json',
        );
      }
    });

    //traer la fecha de pago
    var fechapago = moment().add(8, 'days');
    var ffinal = fechapago.format('YYYY-MM-DD');
    $('#fecha_pago').val(ffinal);

    $('#Registrar_manifiesto').click(function () {
      Swal.fire({
        title: '¿Deseas guardar el manifiesto?',
        text: 'Verifica que todos los campos estén completos antes de continuar.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          var msg_error = '';

          // Validaciones de campos obligatorios
          if (!$('#escoger').val()) { msg_error += '<li>Debe seleccionar la <strong>Placa</strong></li>'; AplicaFoco('#escoger'); } else { RemueveFoco('#escoger'); }
          if (!$('#fecha_expe').val()) { msg_error += '<li>El campo <strong>Fecha expedición</strong> no debe estar vacío</li>'; AplicaFoco('#fecha_expe'); } else { RemueveFoco('#fecha_expe'); }
          if (!$('#origen_viaje').val()) { msg_error += '<li>Debe seleccionar el <strong>Origen del viaje</strong></li>'; AplicaFoco('#origen_viaje'); } else { RemueveFoco('#origen_viaje'); }
          if (!$('#destino_viaje').val()) { msg_error += '<li>Debe seleccionar el <strong>Destino del viaje</strong></li>'; AplicaFoco('#destino_viaje'); } else { RemueveFoco('#destino_viaje'); }
          if (!$('#tipo_manifiesto').val()) { msg_error += '<li>Debe seleccionar el <strong>Tipo de manifiesto</strong></li>'; AplicaFoco('#tipo_manifiesto'); } else { RemueveFoco('#tipo_manifiesto'); }

          // Datos del titular
          if (!$('#titular').val()) { msg_error += '<li>Debe ingresar el <strong>Titular</strong></li>'; AplicaFoco('#titular'); } else { RemueveFoco('#titular'); }
          if (!$('#tidentificacion').val()) { msg_error += '<li>Debe ingresar el <strong>Documento de identificación del titular</strong></li>'; AplicaFoco('#tidentificacion'); } else { RemueveFoco('#tidentificacion'); }
          if (!$('#tdireccion').val()) { msg_error += '<li>Debe ingresar la <strong>Dirección del titular</strong></li>'; AplicaFoco('#tdireccion'); } else { RemueveFoco('#tdireccion'); }
          if (!$('#ttelefono').val()) { msg_error += '<li>Debe ingresar el <strong>Teléfono del titular</strong></li>'; AplicaFoco('#ttelefono'); } else { RemueveFoco('#ttelefono'); }
          if (!$('#tciudad').val()) { msg_error += '<li>Debe ingresar la <strong>Ciudad del titular</strong></li>'; AplicaFoco('#tciudad'); } else { RemueveFoco('#tciudad'); }

          // Datos del vehículo
          if (!$('#plak').val()) { msg_error += '<li>Debe ingresar la <strong>Placa</strong> del vehículo</li>'; AplicaFoco('#plak'); } else { RemueveFoco('#plak'); }
          if (!$('#mark').val()) { msg_error += '<li>Debe ingresar la <strong>Marca</strong> del vehículo</li>'; AplicaFoco('#mark'); } else { RemueveFoco('#mark'); }
          if (!$('#config').val()) { msg_error += '<li>Debe ingresar la <strong>Configuración</strong> del vehículo</li>'; AplicaFoco('#config'); } else { RemueveFoco('#config'); }
          if (!$('#peso').val()) { msg_error += '<li>Debe ingresar el <strong>Peso</strong> del vehículo</li>'; AplicaFoco('#peso'); } else { RemueveFoco('#peso'); }
          if (!$('#tidentificacion').val()) { msg_error += '<li>Debe ingresar la <strong>Póliza (Soat)</strong></li>'; AplicaFoco('#tidentificacion'); } else { RemueveFoco('#tidentificacion'); }
          if (!$('#seguro').val()) { msg_error += '<li>Debe ingresar la <strong>Compañía de seguros</strong></li>'; AplicaFoco('#seguro'); } else { RemueveFoco('#seguro'); }
          if (!$('#fechavence').val()) { msg_error += '<li>Debe ingresar la <strong>Fecha de vencimiento del Soat</strong></li>'; AplicaFoco('#fechavence'); } else { RemueveFoco('#fechavence'); }

          // Conductor
          if (!$('#cnombre').val()) { msg_error += '<li>Debe ingresar el <strong>Nombre del conductor</strong></li>'; AplicaFoco('#cnombre'); } else { RemueveFoco('#cnombre'); }
          if (!$('#cidentifica').val()) { msg_error += '<li>Debe ingresar el <strong>Documento del conductor</strong></li>'; AplicaFoco('#cidentifica'); } else { RemueveFoco('#cidentifica'); }
          if (!$('#cdireccion').val()) { msg_error += '<li>Debe ingresar la <strong>Dirección del conductor</strong></li>'; AplicaFoco('#cdireccion'); } else { RemueveFoco('#cdireccion'); }
          if (!$('#ctelefono').val()) { msg_error += '<li>Debe ingresar el <strong>Teléfono del conductor</strong></li>'; AplicaFoco('#ctelefono'); } else { RemueveFoco('#ctelefono'); }
          if (!$('#clicencia').val()) { msg_error += '<li>Debe ingresar el <strong>N° licencia del conductor</strong></li>'; AplicaFoco('#clicencia'); } else { RemueveFoco('#clicencia'); }
          if (!$('#cciudad').val()) { msg_error += '<li>Debe ingresar la <strong>Ciudad del conductor</strong></li>'; AplicaFoco('#cciudad'); } else { RemueveFoco('#cciudad'); }

          // Poseedor
          if (!$('#tnombre').val()) { msg_error += '<li>Debe ingresar el <strong>Nombre del poseedor</strong></li>'; AplicaFoco('#tnombre'); } else { RemueveFoco('#tnombre'); }
          if (!$('#tnumero').val()) { msg_error += '<li>Debe ingresar el <strong>Documento del poseedor</strong></li>'; AplicaFoco('#tnumero'); } else { RemueveFoco('#tnumero'); }
          if (!$('#tedireccion').val()) { msg_error += '<li>Debe ingresar la <strong>Dirección del poseedor</strong></li>'; AplicaFoco('#tedireccion'); } else { RemueveFoco('#tedireccion'); }
          if (!$('#tetelefono').val()) { msg_error += '<li>Debe ingresar el <strong>Teléfono del poseedor</strong></li>'; AplicaFoco('#tetelefono'); } else { RemueveFoco('#tetelefono'); }
          if (!$('#teciudad').val()) { msg_error += '<li>Debe ingresar la <strong>Ciudad del poseedor</strong></li>'; AplicaFoco('#teciudad'); } else { RemueveFoco('#teciudad'); }

          // Valores
          if (!$('#total_viaje').val()) { msg_error += '<li>Debe ingresar el <strong>Valor total del viaje</strong></li>'; AplicaFoco('#total_viaje'); } else { RemueveFoco('#total_viaje'); }
          if (!$('#valor_retefuente').val()) { msg_error += '<li>Debe ingresar la <strong>Retención en la fuente</strong></li>'; AplicaFoco('#valor_retefuente'); } else { RemueveFoco('#valor_retefuente'); }
          if (!$('#valor_reteica').val()) { msg_error += '<li>Debe ingresar la <strong>Retención ICA</strong></li>'; AplicaFoco('#valor_reteica'); } else { RemueveFoco('#valor_reteica'); }
          if (!$('#valor_fopat').val()) { msg_error += '<li>Debe ingresar la <strong>Retención FOPAT</strong></li>'; AplicaFoco('#valor_fopat'); } else { RemueveFoco('#valor_fopat'); }
          if (!$('#valor_neto').val()) { msg_error += '<li>Debe ingresar el <strong>Valor Neto a Pagar</strong></li>'; AplicaFoco('#valor_neto'); } else { RemueveFoco('#valor_neto'); }

          // Anticipo (si aplica)
          if ($('#requiere_anticipo').val() == 1) {
            if (!$('#porcentaje_anticipo').val()) { msg_error += '<li>Debe ingresar el <strong>Porcentaje de anticipo</strong></li>'; AplicaFoco('#porcentaje_anticipo'); } else { RemueveFoco('#porcentaje_anticipo'); }
            if (!$('#valor_anticipo').val()) { msg_error += '<li>Debe ingresar el <strong>Valor del anticipo</strong></li>'; AplicaFoco('#valor_anticipo'); } else { RemueveFoco('#valor_anticipo'); }
            if (!$('#metodo_desembolsa').val()) { msg_error += '<li>Debe seleccionar el <strong>Método de desembolso</strong></li>'; AplicaFoco('#metodo_desembolsa'); } else { RemueveFoco('#metodo_desembolsa'); }
          }

          if (!$('#agencia').val()) { msg_error += '<li>Debe ingresar el <strong>Lugar</strong></li>'; AplicaFoco('#agencia'); } else { RemueveFoco('#agencia'); }
          if (!$('#fecha_pago').val()) { msg_error += '<li>Debe ingresar la <strong>Fecha sugerida de pago</strong></li>'; AplicaFoco('#fecha_pago'); } else { RemueveFoco('#fecha_pago'); }
          if (!$('#cargue').val()) { msg_error += '<li>Debe ingresar <strong>Cargue pagado por</strong></li>'; AplicaFoco('#cargue'); } else { RemueveFoco('#cargue'); }
          if (!$('#descargue').val()) { msg_error += '<li>Debe ingresar <strong>Descargue pagado por</strong></li>'; AplicaFoco('#descargue'); } else { RemueveFoco('#descargue'); }
          if (!$('#obs').val()) { msg_error += '<li>Debe ingresar una <strong>Observación</strong></li>'; AplicaFoco('#obs'); } else { RemueveFoco('#obs'); }

          // Validar si  la placa ya tiene un manifiesto asociado del dia


          // Resultado final
          if (!msg_error) {
            Crear_Manifiesto();
          } else {
            Swal.fire({
              title: 'Errores encontrados',
              html: `<ul style="text-align:left;">${msg_error}</ul>`,
              icon: 'error',
              confirmButtonText: 'Revisar',
              width: '600px'
            });
          }
        }
      });
    });

    // Utilidades
    function limpiarNumero(valor) {
      return parseFloat((valor || '0').toString().replace(/,/g, '')) || 0;
    }

    function formatearNumero(valor) {
      return parseFloat(valor || 0).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }

    function mostrarError(titulo, mensaje) {
      Swal.fire({
        title: titulo,
        html: mensaje,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        width: '500px'
      });
    }

    // Cambiar comportamiento de anticipo
    $('#requiere_anticipo').change(function () {
      const requiere = $('#requiere_anticipo').val();
      const $metodo = $('#metodo_desembolsa');
      const $porcentaje = $('#porcentaje_anticipo');
      const $valor = $('#valor_anticipo');

      if (requiere == '1') {
        $metodo.prop('disabled', false);
        $porcentaje.prop('disabled', false);
        $valor.prop('disabled', false);

        // Consultar porcentajes desde servidor
        $.post(
          $('#base_url').val() + 'manifiesto/Consulta_Porcentaje',
          function (data) {
            $porcentaje.html('<option value="">Seleccione</option>');
            if (Array.isArray(data)) {
              data.forEach(item => {
                $porcentaje.append(`<option value="${item['valor']}">${item['valor']}</option>`);
              });
            }
          },
          'json'
        );

        // Cargar opciones de método
        $metodo.html(`
      <option value="">Seleccione</option>
      <option value="1">Cheque</option>
      <option value="2">Efectivo</option>
      <option value="3">Transferencia</option>
    `);
      } else {
        // Resetear valores si no requiere anticipo
        $porcentaje.html('').prop('disabled', true);
        $valor.val('').prop('disabled', true);
        $metodo.html('').prop('disabled', true);
        $('#tipo_cuenta, #num_cuenta_ant').prop('disabled', true);
      }
    });

    // Validar y calcular anticipo
    $('#valor_anticipo').change(function () {
      const anti = limpiarNumero($('#valor_anticipo').val());
      const lim = limpiarNumero($('#valor_anticipo_lim').val());
      const neto = limpiarNumero($('#valor_neto').val());
      const totalViaje = limpiarNumero($('#total_viaje').val());
      const $porcentaje = $('#porcentaje_anticipo');
      let saldo = 0;

      // Validar si supera límite
      if ($('#vincula').val() === 'Tercero' && anti > lim) {
        Swal.fire({
          title: 'Atención',
          text: 'El valor del anticipo supera el límite permitido (65%). Se ajustará automáticamente.',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });

        $('#valor_anticipo').val(formatearNumero(lim));
        $porcentaje.val(65);
        saldo = neto - lim;
      } else {
        // Calcular porcentaje del anticipo respecto al total
        const formula = totalViaje > 0 ? (anti * 100 / totalViaje) : 0;
        $porcentaje.val(parseFloat(formula).toFixed(2));
        $('#valor_anticipo').val(formatearNumero(anti));
        saldo = neto - anti;
      }

      // Actualizar saldo final
      $('#saldo_manifi').val(formatearNumero(saldo));
    });

    // Calcular tarifas nuevas con Tab
    $(document).on('keydown', function (event) {
      if (event.keyCode === 9) { // Tecla Tab
        calcular_tarifas_nuevas();
      }
    });

    // Actualizar valores desde modal de tarifas
    $('#Actualizar_trarifa').click(function () {
      $('#total_viaje').val($('#total_manifiesto_tarifa').val());
      $('#valor_retefuente').val($('#valor_retefuente_tarifa').val());
      $('#valor_reteica').val($('#valor_reteica_tarifa').val());
      // $('#valor_fopat').val($('#valor_reteica_tarifa').val());
      $('#valor_anticipo_lim').val($('#valor_anticipo_lim_tarifa').val());
      $('#valor_neto').val($('#valor_neto_tarifa').val());
      $('#saldo_manifi').val($('#saldo_manifi_tarifa').val());

      $('#actualizar_tarifas').modal('hide');

      Swal.fire({
        title: '¡Éxito!',
        text: 'La tarifa ha sido actualizada correctamente.',
        icon: 'success',
        timer: 1200,
        showConfirmButton: false
      });
    });

    var OrigenConsulta = null;
    var DestinoConsulta = null;

    /* Consultar los planes de ruta */
    // Cuando el usuario seleccione un origen
    $('#origen_viaje').on('change', function () {
      OrigenConsulta = $(this).val();
      console.log('Origen seleccionado:', OrigenConsulta);
      // Si ya hay destino, puedes hacer algo aquí
      if (DestinoConsulta) {
        obtenerPlanRuta(OrigenConsulta, DestinoConsulta);
      }
    });

    // Cuando el usuario seleccione un destino
    $('#destino_viaje').on('change', function () {
      DestinoConsulta = $(this).val();
      console.log('Destino seleccionado:', DestinoConsulta);
      // Si ya hay origen, puedes hacer algo aquí
      if (OrigenConsulta) {
      }
      obtenerPlanRuta(OrigenConsulta, DestinoConsulta);
    });
  };

  //Consultar plan de ruta para el manifiesto
  function obtenerPlanRuta(OrigenConsulta, DestinoConsulta) {
    // Verificar que ambos valores estén definidos y no vacíos
    if (!OrigenConsulta || !DestinoConsulta) {
      console.log('Origen o destino no definidos. Se omite la consulta de ruta.');
      return; // No ejecuta nada si falta uno
    }

    // Plan de ruta
    $.post(
      $('#base_url').val() + 'trafico/tplan',
      {
        origen_ruta: OrigenConsulta,
        destino_ruta: DestinoConsulta
      },
      function (data) {
        $('#select-plan-ruta').html('<option value="">Seleccionar</option>');
        if (data && data.length > 0) {
          $("#Registrar_manifiesto").prop('disabled', false);
          data.forEach(element => {
            $('#select-plan-ruta').append(`<option value="${element.cod_plan}">${element.cod_plan} - ${element.nombre_plan} - ${element.observacion} - ${element.km_tot_ruta} Km </option>`);
          });
        } else {
          $('#select-plan-ruta').append('<option value="">Sin rutas disponibles</option>');
        }
      },
      'json'
    );
  }

  // Consultar información completa del manifiesto
  async function ConsultaMnf(idmanifiesto) {
    $('.campov').val('');
    $('#tabla_cremitente').empty();
    $('#tabla_remesas').empty();
    $('#tabla_datos').hide();
    $('#contenedor_datos').show();

    try {
      // 1. Traer datos de cabecera del manifiesto
      const respManifiesto = await fetch(`${$('#base_url').val()}manifiesto/ConsultaManifiesto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `nummani=${idmanifiesto}`
      });
      const data = await respManifiesto.json();

      if (data && data.length) {
        const m = data[0];
        const tipos = ['General', 'Paqueteo', 'Urbano de puertos', 'Masivo', 'Semimasivo', 'Urbano', 'Movimiento contenedores'];
        const pagado = ['Empresa', 'Destinatario', 'Remitente', 'Conductor'];

        const tipo = tipos[m.tipo_manifiesto - 1] || 'Desconocido';
        const carg = pagado[m.cargue_pagado - 1] || '';
        const desca = pagado[m.descargue_pagado - 1] || '';

        // Asignar valores a los campos
        $('#v_mani').val(m.id);
        $('#v_tipomnf').val(tipo);
        $('#v_origenmnf').val(m.origen);
        $('#v_destinomnf').val(m.destino);
        $('#v_nombrecon').val(`${m.conductor} ${m.conape1} ${m.conape2}`);
        $('#v_numerocon').val(m.numero_documento);
        $('#v_numdire').val(m.direccion);
        $('#v_telecondu').val(m.celular);
        $('#v_numlicencon').val(m.rndc_categoria_licencia);
        $('#v_ciudadcon').val(m.cityconductor);
        $('#v_nombreten').val(`${m.nombre} ${m.apellido1} ${m.apellido2}`);
        $('#v_numeroten').val(m.docten);
        $('#v_direten').val(m.direten);
        $('#v_telten').val(m.celten);
        $('#v_cityten').val(m.cityten);
        $('#v_placa').val(m.placa);
        $('#v_marca').val(m.marca);
        $('#v_config').val(m.configuracion);
        $('#v_peso').val(m.peso);
        $('#v_poliza').val(m.num_soat);
        $('#v_seguro').val(m.aseguradora);
        $('#v_fecvence').val(m.vence_soat);
        $('#c_remolque').val(m.placa_trailer);
        $('#v_lugar').val(m.Lugar);
        $('#v_fecpago').val(m.fecha_pago);
        $('#v_cargue').val(carg);
        $('#v_descargue').val(desca);
        $('#v_observación').val(m.observacion);
        $('#v_total').val(m.valor_total_viaje);
        $('#v_retefuente').val(m.retencion_fuente);
        $('#v_reteica').val(m.rete_ica);
        $('#v_valorneto').val(m.neto_pagar);
        $('#v_valoranti').val(m.valor_anticipo);
        $('#v_saldo').val(m.saldo);
      }

      // 2. Traer remesas asociadas
      const respRemesas = await fetch(`${$('#base_url').val()}manifiesto/ConsultaRemesas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `nummani=${idmanifiesto}`
      });
      const remesas = await respRemesas.json();

      $('#tabla_remesas').empty();
      if (remesas && remesas.length) {
        remesas.forEach(r => {
          $('#tabla_remesas').append(`
          <tr>
            <td><input type="text" class="form-control input-xs" disabled value="${r.id}"></td>
            <td><input type="text" class="form-control input-xs" disabled value="${r.tipo_servicio_mer}"></td>
            <td><input type="text" class="form-control input-xs" disabled value="${r.cantidad_empaque}"></td>
            <td><input type="text" class="form-control input-xs" disabled value="${r.naturaleza}"></td>
            <td><input type="text" class="form-control input-xs" disabled value="${r.tipo_mercancia}"></td>
            <td><input type="text" class="form-control input-sm" disabled value="${r.nomrem}/${r.docrem}"></td>
            <td><input type="text" class="form-control input-sm" disabled value="${r.nomdest}/${r.docdest}"></td>
            <td><input type="text" class="form-control input-sm" disabled value="${r.nombre_cliente}"></td>
          </tr>
        `);
        });
      }
    } catch (error) {
      console.error('Error consultando manifiesto:', error);
    }
  }

  // Anular manifiesto (con SweetAlert)
  async function AnularMnf(idmanifiesto) {
    const result = await Swal.fire({
      title: '¿Anular manifiesto?',
      text: 'Esta acción también se transmitirá al Ministerio. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      const resp = await fetch(`${$('#base_url').val()}manifiesto/Anular_Manifiesto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id_manifiesto=${idmanifiesto}`
      });
      const data = await resp.json();

      if (data === true || data === 'true') {
        Swal.fire('Anulado', 'Manifiesto anulado exitosamente.', 'success');
        TablaManifiesto(); // Recargar tabla
      } else {
        Swal.fire('Error', 'No se pudo anular el manifiesto.', 'error');
      }
    } catch (error) {
      console.error('Error anulando manifiesto:', error);
      Swal.fire('Error', 'Hubo un problema al intentar anular el manifiesto.', 'error');
    }
  }

  // Consultar anticipos de un manifiesto
  async function AnticiposMnf(idmani) {
    $('#tabla_datos').hide();
    $('#contenedor_datos').hide();
    $('#contenedor_anticipo').show();

    try {
      // 1. Anticipos activos
      const respAnt = await fetch(`${$('#base_url').val()}manifiesto/Consultar_Anticipos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id_manifi=${idmani}`
      });
      const anticipos = await respAnt.json();
      $('#tb_anticipo').empty();

      if (anticipos && anticipos.length) {
        anticipos.forEach(a => {
          const metodos = { 1: 'Cheque', 2: 'Efectivo', 3: 'Transferencia' };
          const estados = {
            1: "<td class='nexos-txt-success'><center><span class='mdi mdi-dot-circle icon'></span></center></td>",
            2: "<td class='nexos-txt-warning'><center><span class='mdi mdi-dot-circle icon'></span></center></td>",
            0: "<td class='nexos-txt-danger'><center><span class='mdi mdi-dot-circle icon'></span></center></td>"
          };
          $('#tb_anticipo').append(`
          <tr>
            ${estados[a.estado] || '<td></td>'}
            <td>${a.nombre}</td>
            <td>${a.valor_anticipo}</td>
            <td>${metodos[a.metodo_desembolso] || ''}</td>
          </tr>
        `);
        });
      }

      // 2. Valor total del viaje
      const respVal = await fetch(`${$('#base_url').val()}manifiesto/Consultar_Valor_T`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id_manifi=${idmani}`
      });
      const valorData = await respVal.json();

      if (valorData) {
        $('#benefi').val(valorData.conductor_manifiesto);
        $('#vant_total').val(valorData.valor_total_viaje);
        $('#id_mnf').val(valorData.id);
        const resanti2 = (parseFloat(valorData.valor_total_viaje) * 65) / 100;
        $('#valor_limitante').val(resanti2);
      }
    } catch (error) {
      console.error('Error cargando anticipos o valores:', error);
    }
  }

  function TablaManifiesto() {
    // Ocultar/mostrar contenedores
    $('#contenedor_anticipo').hide();
    $('#contenedor_datos').hide();
    $('#tabla_datos').show();
    $('.campov').val('');
    $('#tabla_remesas').empty();
    $('#tb_anticipo').empty();

    const ini = $('#finicial').val();
    const fin = $('#ffinal').val();
    const totalColumnas = $('#manfhead th').length || 7;

    // Mostrar mensaje de carga
    $('#manfbody').html(`
    <tr>
      <td colspan="${totalColumnas}" class="text-center py-4">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-2 text-muted">Consultando Manifiestos...</p>
      </td>
    </tr>
  `);

    $.post(
      $('#base_url').val() + 'manifiesto/Consulta_Manifiestos',
      `finicia=${ini}&ffinal=${fin}`,
      function (data) {
        $('#manfbody').empty();

        if (data.manifiestos && data.manifiestos.length > 0) {
          $('.contador').text(data.total_manifiestos);

          const filas = data.manifiestos.map((mnf) => {
            // Tipo manifiesto
            const tipos = [
              '', 'General', 'Paqueteo', 'Urbano de puertos', 'Masivo',
              'Semimasivo', 'Urbano', 'Movimiento contenedores'
            ];
            const tipo = tipos[mnf.tipo_manifiesto] || 'Desconocido';
            const cumplido = mnf.cumplido == 1 ? 'Cumplido' : 'Sin cumplir';

            // Estado del manifiesto
            let estadoMnf, botones = '';
            if (mnf.estadomnf_actual == 1) {
              estadoMnf = `<td><center><span class="label label-success">Manifiesto Guardado</span></center></td>`;
              botones = `
              <button class="btn btn-primary btn-sm me-1 px-1 py-1" title="Ver" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDetalleManifiesto" aria-controls="offcanvasDetalleManifiesto" onClick="ConsultaMnf(${mnf.id})">
                <i class="fa-regular fa-eye"></i>
              </button>
              <button class="btn btn-warning btn-sm me-1 px-1 py-1" title="Editar" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDetalleManifiesto" aria-controls="offcanvasDetalleManifiesto" onClick="ConsultaMnf(${mnf.id})">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button class="btn btn-danger btn-sm me-1 px-1 py-1" title="Anular" onClick="AnularMnf(${mnf.id})">
                <i class="fa-solid fa-ban"></i>
              </button>
              <button class="btn btn-success btn-sm me-1 px-1 py-1" title="Imprimir" onClick="ImprimirManifiesto(${mnf.id})">
                <i class="fas fa-print"></i>
              </button>
            `;
            } else {
              estadoMnf = `<td class="nexos-txt-danger"><center><span class="label label-danger">Manifiesto Anulado</span></center></td>`;
              botones = `
              <button class="btn btn-primary btn-sm me-1 px-1 py-1" title="Ver" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDetalleManifiesto" aria-controls="offcanvasDetalleManifiesto" onClick="ConsultaMnf(${mnf.id})">
                <i class="fa-regular fa-eye"></i>
              </button>
            `;
            }

            return `
            <tr>
              <td class="text-center">${mnf.id}</td>
              <td class="text-center">${mnf.placa}</td>
              <td class="text-center">${mnf.conductor_manifiesto}</td>
              <td class="text-center">${tipo}</td>
              ${estadoMnf}
              <td class="text-center">${cumplido}</td>
              <td style="width:170px;" class="text-center">
                <div class="btn-group btn-group-sm" role="group" aria-label="Acciones">
                  ${botones}
                </div>
              </td>
            </tr>
          `;
          });

          $('#manfbody').html(filas.join(''));
        } else {
          $('#manfbody').html(`
          <tr>
            <td colspan="${totalColumnas}" class="text-center text-muted py-4">
              No se encontraron manifiestos para el rango seleccionado.
            </td>
          </tr>
        `);
        }
      },
      'json'
    ).fail(function () {
      $('#manfbody').html(`
      <tr>
        <td colspan="${totalColumnas}" class="text-center text-danger py-4">
          Error al cargar los manifiestos. Intenta nuevamente.
        </td>
      </tr>
    `);
    });
  }

  async function porcentaje() {
    const select = $('#porcentaje_anticipo');
    select.html('<option value="">Cargando...</option>');

    try {
      const response = await fetch(`${$('#base_url').val()}manifiesto/Consulta_Porcentaje`, {
        method: 'POST'
      });
      const data = await response.json();

      select.html('<option value="">Seleccione</option>');
      if (data && data.length) {
        data.forEach(opt => {
          select.append(`<option value="${opt.valor}">${opt.valor}</option>`);
        });
      }
    } catch (error) {
      console.error('Error cargando porcentaje:', error);
      select.html('<option value="">Error al cargar</option>');
    } finally {
      // Puedes ocultar loader aquí si lo usas
    }
  }

  function ImprimirManifiesto(id_mnf) {
    // var id_mnf = $('#v_mani').val();
    var url;

    // dato_pdf = Array(dato_pdf1);
    url = $('#base_url').val() + 'libs/manifiesto_pdf.php?' + 'id_mnf=' + codificarBase64(id_mnf);
    window.open(url, '_blank');
  }

  function calcular_tarifas_nuevas() {

    var ica = 0;

    // 🔒 VALIDAR EXISTENCIA DEL INPUT
    var $total = $('#total_manifiesto_tarifa');
    if (!$total.length) {
      console.warn('No existe #total_manifiesto_tarifa');
      return;
    }

    // 🔒 OBTENER VALOR SEGURO
    let valornormal2 = $total.val();
    if (!valornormal2) {
      valornormal2 = '0';
    }

    // 🔒 ASEGURAR STRING ANTES DE REPLACE
    var valnormal_2 = valornormal2.toString().replace(/,/g, '');

    // ===============================
    // ICA POR CIUDAD
    // ===============================
    if ($('#nombre_agencia_manifiesto').val() == 'Bogotá') {
      ica = 4.14;
    }
    if ($('#nombre_agencia_manifiesto').val() == 'Cartagena') {
      ica = 8.56;
    }
    if ($('#nombre_agencia_manifiesto').val() == 'Buenaventura') {
      ica = 7;
    }
    if ($('#nombre_agencia_manifiesto').val() == 'Barranquilla') {
      ica = 8;
    }

    // ===============================
    // RETEICA (sobre 1000)
    // ===============================
    var retei = (parseFloat(valnormal_2) * parseFloat(ica)) || 0;
    var resica = retei / 1000;

    $('#valor_reteica_tarifa').val(
      resica.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    );

    // ===============================
    // RETEFUENTE (1%)
    // ===============================
    var valnormal = parseFloat(valnormal_2) || 0;
    var resultadofuente = valnormal / 100;

    $('#valor_retefuente_tarifa').val(
      resultadofuente.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    );

    // ===============================
    // ANTICIPO LÍMITE (65%)
    // ===============================
    var resanti2 = (valnormal * 65) / 100;

    $('#valor_anticipo_lim_tarifa').val(
      resanti2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    );

    // ===============================
    // VALOR NETO
    // ===============================
    var suma = resultadofuente + resica;
    var valorneto = valnormal - suma;

    $('#valor_neto_tarifa').val(
      valorneto.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    );

    // ===============================
    // SALDO MANIFIESTO
    // ===============================
    var saldo = valorneto;

    $('#saldo_manifi_tarifa').val(
      saldo.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    );
  }

  window.mensajesTransmision = []; // Guardará todos los mensajes en orden
  // Crear manifiesto principal
  async function Crear_Manifiesto() {
    window.mensajesTransmision = []; // Reiniciar mensajes al iniciar todo el proceso

    var fecha_expe = $('#fecha_expe').val();
    var tipo_mnf = $('#tipo_manifiesto').val();
    var origen = $('#origen_viaje').val();
    var destino = $('#destino_viaje').val();
    var posee_num = $('#tidentificacion').val();
    var placa = $('#plak').val();
    var condu_identifi = $('#cidentifica').val();
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

    var anti_por = '', anti_valor = '', anti_metodo = '';
    if (r_anti == 1) {
      anti_por = $('#porcentaje_anticipo').val();
      anti_valor = $('#valor_anticipo').val();
      anti_metodo = $('#metodo_desembolsa').val();
    }

    // RECOGER REMESAS
    var datorem = { id_remesa: [] };
    $('.remid').each(function (index) {
      datorem.id_remesa[index] = $(this).val();
    });

    var datoremitr = { manifiesto_itr: [] };
    $('.remitr').each(function (index) {
      datoremitr.manifiesto_itr[index] = $(this).val();
    });

    var notanew = JSON.stringify(datorem);
    var notanewitr = JSON.stringify(datoremitr);

    $('#loading-overlay-nexosapp').css('display', 'flex');

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
      const response = await fetch($('#base_url').val() + 'manifiesto/Registro_mnf', {
        method: 'POST',
        body: datos,
        cache: 'no-cache',
      });
      const data = await response.json();
      if (data) {
        window.mensajesTransmision.push(`✅ Datos Registrados Exitosamente - Manifiesto N° ${data.numero_documento}`);
        await Crear_Manifiesto_Rndc(data.numero_documento);
      } else {
        window.mensajesTransmision.push(`❌ Error al registrar manifiesto: ${data.error || ''}`);
      }
    } catch (error) {
      window.mensajesTransmision.push(`❌ Error en Crear_Manifiesto: ${error.message}`);
    } finally {
      $('#loading-overlay-nexosapp').css('display', 'none');
    }
  }

  // ============================================================
  //  2️⃣ TRANSMITIR AL RNDC
  // ============================================================
  async function Crear_Manifiesto_Rndc(idManifiesto) {
    $('#loading-overlay-rndc').css('display', 'flex');
    // ❌ ELIMINADO: window.mensajesTransmision = [] — borraba el mensaje anterior

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/rndc/transmitir-manifiesto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'mi_super_api_key_ultra_secreta_123',
        },
        body: JSON.stringify({ manifiesto_id: idManifiesto }),
      });

      const res = await response.json();

      if (!res.success) {
        window.mensajesTransmision.push(`❌ Error enviando Manifiesto al RNDC:<br>${res.message ?? ''}`);
      } else {
        window.mensajesTransmision.push(`✅ Manifiesto transmitido al RNDC.<br>ID RNDC: ${res.ingresoid ?? 'N/A'}`);
      }

    } catch (error) {
      window.mensajesTransmision.push(`❌ Error de red con RNDC:<br>${error}`);
    } finally {
      $('#loading-overlay-rndc').css('display', 'none');
      // ❌ ELIMINADO: Swal aquí — se movió al final de DsNube
      await Crea_Dato_Oet(idManifiesto);
    }
  }

  // ============================================================
  //  3️⃣ REGISTRO EN OET
  // ============================================================
  async function Crea_Dato_Oet(num_manifiesto) {
    $('#loading-overlay-oet').css('display', 'flex');

    let datos = new FormData();
    datos.append('recurso', 3);
    datos.append('numero', num_manifiesto);

    try {
      const response = await fetch($('#base_url').val() + 'integrar_oet/Consulta_Transacciones', {
        method: 'POST',
        body: datos,
        cache: 'no-cache',
      });

      const data = await response.json();

      if (data.status == true || data.status == 'true') {
        window.mensajesTransmision.push(`🟩 Manifiesto registrado en OET`);
      } else {
        window.mensajesTransmision.push(`⚠️ No se registró manifiesto en OET`);
      }

    } catch (error) {
      window.mensajesTransmision.push(`❌ Error en OET: ${error.message}`);
    } finally {
      $('#loading-overlay-oet').css('display', 'none');
      // ❌ ELIMINADO: Swal aquí — se movió al final de DsNube
      await CrearManifietoDsNube(num_manifiesto);
      window.mensajesTransmision = []; // ✅ Reset DESPUÉS de que DsNube termina
    }
  }

  // ============================================================
  //  CLIENTE API — maneja token automáticamente
  // ============================================================
  const DsnubeApi = {
    TOKEN_KEY: 'dsnube_api_token',
    BASE_URL: document.getElementById('url_api_dsnube').value,
    API_KEY: 'nexos_dsnube_2026*',

    getToken() {
      return localStorage.getItem(this.TOKEN_KEY);
    },

    saveToken(token) {
      if (token) localStorage.setItem(this.TOKEN_KEY, token);
    },

    clearToken() {
      localStorage.removeItem(this.TOKEN_KEY);
    },

    async login() {
      const response = await fetch(this.BASE_URL + 'login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.API_KEY,
        },
        body: JSON.stringify({
          username: 'dsnube_api',   // lo pones en tu blade como variable global
          password: 'Traveck2025*',
        }),
      });

      const data = await response.json();

      if (!data.success) throw new Error('Login DsNube fallido');

      this.saveToken(data.token);
      return data.token;
    },

    // ✅ Fetch inteligente: reintenta una vez si el token expiró
    async fetch(endpoint, options = {}) {
      const doRequest = async (token) => {
        const response = await fetch(this.BASE_URL + endpoint, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': this.API_KEY,
            'Authorization': `Bearer ${token}`,
            ...(options.headers ?? {}),
          },
        });

        // Si Laravel devuelve un token renovado, guardarlo
        const newToken = response.headers.get('X-New-Token');
        if (newToken) this.saveToken(newToken);

        return response;
      };

      let token = this.getToken();

      // Sin token: hacer login primero
      if (!token) token = await this.login();

      let response = await doRequest(token);

      // Token expirado: login y reintentar UNA vez
      if (response.status === 401) {
        this.clearToken();
        token = await this.login();
        response = await doRequest(token);
      }

      return response;
    }
  };

  // ============================================================
  //  4️⃣ DSNUBE — ÚLTIMA FUNCIÓN → MUESTRA RESUMEN FINAL
  // ============================================================
  async function CrearManifietoDsNube(manifiestoId) {
    $('#loading-overlay-dsnube').css('display', 'flex');

    const payload = { manifiesto: manifiestoId };

    try {
      const response = await DsnubeApi.fetch('crear-manifiesto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'nexos_dsnube_2026*',
        },
        body: JSON.stringify(payload),
      });

      const resultado = await response.json();

      if (!resultado.success) {
        window.mensajesTransmision.push(`
                ❌ Error al transmitir a DsNube:<br>
                ${resultado.message ?? ''}<br>
                <small>${resultado.error ?? ''}</small>
            `);
      } else {
        window.mensajesTransmision.push(`✅ Manifiesto transmitido correctamente a DsNube.`);
      }

    } catch (error) {
      window.mensajesTransmision.push(`❌ Error inesperado conectando a DsNube: ${error}`);
    } finally {
      $('#loading-overlay-dsnube').css('display', 'none');

      // 🎉 RESUMEN FINAL — acumula los 4 procesos
      Swal.fire({
        title: '📘 Resumen General de Procesos',
        html: window.mensajesTransmision.join('<br><hr>'),
        icon: 'info',
        width: '50%',
        confirmButtonText: 'Entendido',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    }
  }

  function codificarBase64(texto) {
    return btoa(texto);
  }

  // Función para decodificar Base64
  function decodificarBase64(textoCodificado) {
    return atob(textoCodificado);
  }


  function AplicaFoco(idelemento) {
    $(idelemento).focus().css("background-color", "rgb(254,242,181)");
  }

  function RemueveFoco(idelemento) {
    $(idelemento).blur().css("background-color", "white");
  }

  window.ImprimirManifiesto = ImprimirManifiesto;
})();