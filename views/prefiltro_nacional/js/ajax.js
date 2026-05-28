window.VENTANA = null;

window.initScript = function (id) {
  window.VENTANA = id;
  $('#contenedor_datos').css('display', 'none');
  $('#tabla_datos').css('display', '');
  $('.divcliente').hide();
  $('.divfechas').hide();
  $('.divbtnbusqueda').hide();

  //llamar la placa
  Listar_Placas_Pendientes();

  var c = 0;
  $('#adicione_remitente').click(function () {
    c++;
    var num_service = $('#id_servicio').val();
    $.post(
      $('#base_url').val() + 'transporte/Consulta_Municipios',
      function (data) {
        if (data) {
          for (var z = 0; z < data.length; z++) {
            $('#p_ciudad' + c + '').append('<option value="' + data[z]['id'] + '">' + data[z]['municipio'] + ' - ' + data[z]['depto'] + '</option>');
          }
        }
      },
      'json',
    );
    $.post(
      $('#base_url').val() + 'transporte/Consulta_Cliente',
      'id_servi=' + num_service,
      function (datu) {
        if (datu) {
          $('#clientea' + c + '').html('<option value="' + datu['id'] + '">' + datu['nombre'] + '</option>');
        }
      },
      'json',
    );

    const ch = `<input type="button" id="p${c}" class="btn-primary" value="Remover" onclick="delete_remi(${c})">`;

    const city = `
    <select id="p_ciudad${c}" class="form-control input-xs acremtin">
      <option value="" readonly="readonly">Seleccione</option>
    </select>
  `;

    const cliente = `<select id="clientea${c}" class="form-control input-xs acremtincli"></select>`;

    const suma = `
      <tr class="td${c}">
        <tr class="td${c}" style="text-align:left; color:white; background-color:#33b5e5; height:20px;">
          <th>#</th><th>Origen</th><th>Dirección</th>
        </tr>
        <td class="td${c}">
          <span id="bgi${c}" class="badge badge-primary acbdgn">${c}</span>
        </td>
        <td class="td${c}">${city}</td>
        <td class="td${c}">
          <input type="text" id="dire${c}" class="form-control acremtdiden" style="height:14px; font-size:90%;">
        </td>
      </tr>
      <tr class="td${c}">
        <th>Fecha</th><th>Cliente</th><th>Observación</th>
      </tr>
      <tr>
        <td>
          <input type="date" id="fecha${c}" class="form-control acremtiden" style="width:169px; height:14px; font-size:90%;">
        </td>
        <td>${cliente}</td>
        <td>
          <textarea id="observa${c}" class="form-control acobservaren" style="width:169px; height:14px; font-size:90%;"></textarea>
        </td>
      </tr>
      <tr class="td${c}">
        <th>Hora</th><th>Tipo Punto</th><th>Orden</th>
      </tr>
      <tr>
        <td>
          <input type="time" id="hora${c}" class="form-control achoraden" style="width:110px; height:14px; font-size:90%;">
        </td>
        <td>
          <select id="tipo${c}" class="acdestipn" style="width:169px; height:17px; font-size:90%;">
            <option value="punto recogida">Punto recogida</option>
          </select>
        </td>
        <td>
          <input type="text" id="orden${c}" class="form-control acdesorn" style="width:167px; height:14px; font-size:90%;" value="${c}" readonly="readonly">
        </td>
      </tr>
      <tr id="btne${c}">
        <td>${ch}</td>
      </tr>`;

    $('#adicione_remite').append(suma);
  });
  var b = 0;

  $('#adicione_destina').click(function () {
    b++;
    const num_service = $('#id_servicio').val();

    // Cargar municipios
    $.post(
      $('#base_url').val() + 'transporte/Busque_Municipios',
      function (data) {
        if (data) {
          for (let t = 0; t < data.length; t++) {
            $(`#p_ciudadd${b}`).append(`
              <option value="${data[t]['id']}">
                ${data[t]['municipio']} - ${data[t]['depto']}
              </option>
            `);
          }
        }
      },
      'json'
    );

    // Cargar cliente
    $.post(
      $('#base_url').val() + 'transporte/Consulta_Cliente',
      `id_servi=${num_service}`,
      function (note) {
        if (note) {
          $(`#clientead${b}`).html(`
            <option value="${note['id']}">${note['nombre']}</option>
          `);
        }
      },
      'json'
    );

    const ch = `<input type="button" id="f${b}" class="btn-primary tf${b}" value="Remover" onclick="delete_destinew(${b})">`;

    const city = `
        <select id="p_ciudadd${b}" class="form-control input-xs idescity">
          <option value="" readonly="readonly">Seleccione</option>
        </select>
      `;

    const cliente = `
        <select id="clientead${b}" class="form-control input-xs idescli"></select>
      `;

    const destino = `
        <tr class="tf${b}">
          <tr class="tf${b}" style="text-align:left; color:white; background-color:#33b5e5; height:20px;">
            <th>#</th><th>Destino</th><th>Dirección</th>
          </tr>
          <td class="tf${b}">
            <span class="badge badge-primary tf${b}">${b}</span>
          </td>
          <td class="tf${b}">${city}</td>
          <td class="tf${b}">
            <input type="text" id="dired${b}" class="form-control idesdir" style="height:14px; font-size:90%;">
          </td>
        </tr>
        <tr class="tf${b}">
          <th>Fecha</th><th>Cliente</th><th>Observación</th>
        </tr>
        <tr>
          <td>
            <input type="date" id="fechad${b}" class="form-control idesfec" style="width:169px; height:14px; font-size:90%;">
          </td>
          <td>${cliente}</td>
          <td>
            <textarea id="observad${b}" class="form-control idesobs" style="width:169px; height:14px; font-size:90%;"></textarea>
          </td>
        </tr>
        <tr class="tf${b}">
          <th>Hora</th><th>Tipo Punto</th><th>Orden</th>
        </tr>
        <tr class="tf${b}">
          <td>
            <input type="time" id="horad${b}" class="form-control ideshora" style="width:110px; height:14px; font-size:90%;">
          </td>
          <td>
            <select id="tipod${b}" class="idestipo" style="width:169px; height:17px; font-size:90%;">
              <option value="punto entrega">punto entrega</option>
            </select>
          </td>
          <td>
            <input type="text" id="ordend${b}" class="form-control idesorden" style="width:167px; height:14px; font-size:90%;" value="${b}" readonly="readonly">
          </td>
        </tr>
        <tr class="tf${b}">
          <td>${ch}</td>
        </tr>
      `;

    $('#adicione_desti').append(destino);
  });

  //filtro
  $('#filtro_orden').change(function () {
    var consultar = $('#filtro_orden').val();
    if (consultar == '') {
      $('.divcliente').hide();
      $('.divfechas').hide();
      $('.divbtnbusqueda').hide();
    }
    if (consultar == 1) {
      $('.divcliente').hide();
      $('.divfechas').show();
      $('.divbtnbusqueda').show();
    }
    if (consultar == 2) {
      $('.divcliente').show();
      $('.divfechas').hide();
      $('.divbtnbusqueda').show();
      ConsultaCliente();
    }
    if (consultar == 3) {
      $('.divcliente').show();
      $('.divfechas').show();
      $('.divbtnbusqueda').show();
      ConsultaCliente();
    }
  });

  //TRAER DATOS QUE CONFORMAN LA ORDEN
  window.precintosDisponibles = [];
  $('#placao').change(function () {
    //carga los datos de la placa seleccionada
    var placa = $('#placao').val();
    $('#msg_present').html('');
    if (placa != '') {
      var idservicio = $(this).find(':selected').data('year');
      var idestudio = $(this).find(':selected').data('est');
      var idremitente = $(this).find(':selected').data('remi');
      var valor_propuesto = $(this).find(':selected').data('fp'); //valor propuesto x operaciones ó total
      var idpunto = $(this).find(':selected').data('prem');
      var pesorem = $(this).find(':selected').data('pesorem');
      var tarifapro = $(this).find(':selected').data('tarifa');
      var idfletesub = $(this).find(':selected').data('idflete');
      var idestsub = $(this).find(':selected').data('idef');
      var agenciaId = $(this).find(':selected').data('agencia');

      $('#id_puntoremitente').val(idpunto);
      $('#o_flete_pactado').val(valor_propuesto);
      $('.o_flete_pactado').html(valor_propuesto);
      $('#o_tarifapactada').val(tarifapro);
      $('#id_subasta_flete').val(idfletesub);
      $('#id_esubasta_flete').val(idestsub);
      //consulta datos del vehículo
      $.post($('#base_url').val() + 'transporte/Datos_Placa_Seleccionada',
        'eleccion_placa=' + placa,
        function (data) {
          // console.log("🚀 ~ data:", data)
          if (data) {
            var trailer = '';
            var idt = '';
            var dato;
            $('#id_vehiculo').val(data['idvehiculo']);
            $('#onom_propietario').val(data['pronom'] + ' ' + data['proape1'] + ' ' + data['proape2']);
            $('#odocumento_propietario').val(data['pronum']);
            $('#onom_tenedor').val(data['tenom'] + ' ' + data['teape1'] + ' ' + data['teape2']);
            $('#odocumento_tenedor').val(data['tenum']);
            $('#onom_conductor').val(data['connom'] + ' ' + data['conape1'] + ' ' + data['conape2'])
            $('#odocumento_conductor').val(data['connum']);
            $('#ocelular_conductor').val(data['celular'] + ' - ' + data['celular2']);
            $('#o_carroceria').val(data['tipo_carroceria']);
            $('#o_marca').val(data['marca']);
            $('#o_modelo').val(data['anio_fabricacion']);
            $('#o_color').val(data['color']);
            $('#o_tipovinculacion').val(data['tipo_vinculacion']);
            $('#o_clase').val(data['clase']);
            $('#o_pesocarro').val(data['capacidad_tn']);
            // $('#o_pesocarro').val(parseFloat($('#o_pesocarro').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

            if (data['placatrailer'] === null) {
              trailer = '';
              dato = '';
              idt = '';
            } else {
              trailer = data['placatrailer'];
              dato = data['idtrailer'];
              idt = data['idtrailer'];
            }
            $('#o_remolque').html('<option value="' + dato + '">' + trailer + '</option>');
            $('#id_trailer').val(idt);
            $('#id_propietario').val(data['id_pro']);
            // $('.id_propietario').html(data['id_pro']);
            $('#id_tenedor').val(data['id_ten']);
            // $('.id_tenedor').html(data['id_ten']);
            $('#id_conductor').val(data['id_con']);
          }
        },
        'json',
      );
      //consulta datos del cliente + datos de solicitud de servicio
      $('#id_servicio').val(idservicio);
      $('#id_estudios').val(idestudio);
      $('#id_remitente').val(idremitente);

      $.post(
        $('#base_url').val() + 'transporte/Datos_solicitud_servicio',
        'id_servicio=' + idservicio,
        function (dato) {
          if (dato) {
            $('#id_cliente').val(dato['id_cliente']);
            $('#o_identificacion').val(dato['documento'] + '-' + dato['digito_verificacion']);
            // $('.o_identificacion').html(dato['documento'] + '-' + dato['digito_verificacion']);
            $('#o_cliente').val(dato['nombre']);
            // $('.o_cliente').html(dato['nombre']);
            $('#o_direccioncl').val(dato['direccion']);
            // $('.o_direccioncl').html(dato['direccion']);
            $('#o_telefono').val(dato['telefono']);
            // $('.o_telefono').html(dato['telefono']);
            $('#o_ciudad').val(dato['ciudad']);
            // $('.o_ciudad').html(dato['ciudad']);
            // $("#o_producto").html("<option>" + dato["tipo_mercancia"] + "</option>");
            $('#o_producto').val(dato['tipo_mercancia']);
            // $('.o_producto').html(dato['tipo_mercancia']);
            // $("#o_empaque").html("<option>" + dato["empaque"] + "</option>");
            $('#o_empaque').val(dato['empaque']);
            // $('.o_empaque').html(dato['empaque']);
            $('#o_cantidad').val(dato['cantidad_empaque']);
            // $('.o_cantidad').html(dato['cantidad_empaque']);
            $('#o_volumen').val(dato['volumen_total']);
            $('#o_volumen').val(parseFloat($('#o_volumen').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
            // $('.o_volumen').html(parseFloat($('#o_volumen').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
            if (dato['devol_numcont'] != null) {
              $('#o_conten1').val(dato['devol_numcont']);
            } else {
              $('#o_conten1').val('');
            }
            $('#o_fletecotizacion').val(dato['flete']);
            $('#o_peso_mercancia').val(dato['peso_kg']);
            $('#o_peso_mercancia').val(parseFloat($('#o_peso_mercancia').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
            // $('.o_peso_mercancia').html(parseFloat(dato['peso_kg'], 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
            $('#o_pesocarga').val(pesorem);
            // $('.o_pesocarga').html(parseFloat(pesorem, 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
            $('#to_condicionesw').val(dato['seg_cond_cargue']);
          }
        },
        'json',
      );

      //consulta datos del remitente
      $.post(
        $('#base_url').val() + 'transporte/Datos_remitentes',
        'id_service=' + idservicio + '&id_remi=' + idremitente,
        function (data) {
          if (data) {
            $('#datos_remite').html('');
            var cont = 0;
            for (var m = 0; m < data.length; m++) {
              cont++;
              var ch = '<input type="button" id="p' + m + '" class="btn-primary" value="Remover"  onclick="delete_asocia(' + m + ')">';

              $('#datos_remite').append(`
              <div class="badge badge-phoenix badge-phoenix-primary p-2 mb-2">
                <b>Remitente ${cont}</b>
              </div>
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label" for="remite${m}">Remitente(*)</label>
                  <input type="text" id="remite${m}" class="form-control form-control-sm" value="${data[m]['nombre']}" disabled>
                </div>
                <div class="col-md-4">
                  <label class="form-label" for="tipodocumento${m}">Documento(*)</label>
                  <input type="text" id="tipodocumento${m}" class="form-control form-control-sm" value="${data[m]['documento']}" disabled>
                </div>
                <div class="col-md-4">
                  <label class="form-label" for="direccion${m}">Dirección remitente(*)</label>
                  <input type="text" id="direccion${m}" class="form-control form-control-sm" value="${data[m]['direccion_entrega']}" disabled>
                </div>
              </div>
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label" for="origen${m}">Origen(*)</label>
                  <input type="text" id="origen${m}" class="form-control form-control-sm" value="${data[m]['municipio']} / ${data[m]['depto']}" disabled>
                </div>
                <div class="col-md-4">
                  <label class="form-label" for="telefono${m}">Teléfono(*)</label>
                  <input type="text" id="telefono${m}" class="form-control form-control-sm" value="${data[m]['telefono']}" disabled>
                </div>
                <div class="col-md-4">
                  <label class="form-label" for="fecha_remi${m}">Fecha recogida(*)</label>
                  <input type="text" id="fecha_remi${m}" class="form-control form-control-sm" value="${data[m]['fecha_estimada_entrega']}" disabled>
                </div>
              </div>
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label" for="hora_remi${m}">Hora recogida(*)</label>
                  <input type="text" id="hora_remi${m}" class="form-control form-control-sm" value="${data[m]['hora_estimada']}" disabled>
                </div>
                <div class="col-md-8">
                  <label class="form-label" for="obs_remi${m}">Observación(*)</label>
                  <input type="text" id="obs_remi${m}" class="form-control form-control-sm" value="${data[m]['observacion']}" disabled>
                  <input type="hidden" id="idremi${m}" value="${data[m]['id']}">
                </div>
              </div>
            `);
            }
          }
        },
        'json',
      );

      //consutla datos del destinatario
      $.post(
        $('#base_url').val() + 'transporte/Datos_destinatario',
        'id_service=' + idservicio + '&id_puntoremi=' + idpunto,
        function (data) {
          $('#datos_destino').html('');
          if (data) {
            var cent = 0;
            for (var d = 0; d < data.length; d++) {
              cent++;
              var k = '<input type="button" id="p' + d + '" class="btn-primary" value="Remover"  onclick="delete_desty(' + d + ')">';
              $('#datos_destino').append(`
                <div class="badge badge-phoenix badge-phoenix-primary p-2 mb-2">
                  <b>Destinatario ${cent}</b>
                </div>
                <div class="row g-3 mb-3">
                  <div class="col-md-4">
                    <label class="form-label" for="destinatario${d}">Destinatario(*)</label>
                    <input type="text" id="destinatario${d}" class="form-control form-control-sm" value="${data[d]['nombre']}" disabled>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label" for="documento${d}">Documento(*)</label>
                    <input type="text" id="documento${d}" class="form-control form-control-sm" value="${data[d]['documento']}" disabled>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label" for="telefono${d}">Teléfono</label>
                    <input type="text" id="telefono${d}" class="form-control form-control-sm" value="${data[d]['telefono']}" disabled>
                  </div>
                </div>
                <div class="row g-3 mb-3">
                  <div class="col-md-4">
                    <label class="form-label" for="direccion${d}">Dirección(*)</label>
                    <input type="text" id="direccion${d}" class="form-control form-control-sm" value="${data[d]['direccion_entrega']}" disabled>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label" for="destino${d}">Destino(*)</label>
                    <input type="text" id="destino${d}" class="form-control form-control-sm" value="${data[d]['municipio']} / ${data[d]['depto']}" disabled>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label" for="fecha_entrega${d}">Fecha entrega(*)</label>
                    <input type="text" id="fecha_entrega${d}" class="form-control form-control-sm" value="${data[d]['fecha_estimada_entrega']}" disabled>
                  </div>
                </div>
                <div class="row g-3 mb-4">
                  <div class="col-md-4">
                    <label class="form-label" for="horaentre${d}">Hora entrega</label>
                    <input type="text" id="horaentre${d}" class="form-control form-control-sm" value="${data[d]['hora_estimada']}" disabled>
                  </div>
                  <div class="col-md-8">
                    <label class="form-label" for="observacion${d}">Observación(*)</label>
                    <textarea id="observacion${d}" class="form-control form-control-sm" rows="1" disabled>${data[d]['observacion']}</textarea>
                    <input type="hidden" id="iddest${d}" value="${data[d]['id']}">
                  </div>
                </div>
              `);
            }
          }
        },
        'json',
      );

      //semaforo de datos sujetos del vencimiento
      $.post(
        $('#base_url').val() + 'transporte/Consulta_Vencimiento',
        'num_estudio=' + idestudio,
        function (data) {
          if (data) {
            $('#vlicencia').val(data['rndc_vencimiento_licencia']);
            $('#vplanilla').val(data['fecha_vence_eps']);
            $('#vmercancia').val(data['vence_curso']);
            $('#vsoat').val(data['vence_soat']);
            $('#vtecnomecanica').val(data['tecno_fecha_vigencia']);
          }
        },
        'json',
      );

      //LLenar el select de los precintos de la agencia para el inventario
      // let Agencia = '';
      // if (agenciaId === 1) {
      //   Agencia = 'Bogotá';
      // } else if (agenciaId === 2) {
      //   Agencia = 'Cartagena';
      // } else if (agenciaId === 4) {
      //   Agencia = 'Buenaventura';
      // }

      // let Cliente = $('#id_cliente').val();

      // $.post(
      //   $('#base_url').val() + 'transporte/Consultar_Precintos',
      //   'Agencia=' + Agencia,
      //   function (data) {
      //     if (data) {
      //       precintosDisponibles = data; // guardar para uso posterior
      //       agregarFilaPrecinto(); // insertar la primera fila
      //     }
      //   },
      //   'json',
      // );


      // JS (Corregido y Optimizado)

      let Agencia = '';
      if (agenciaId === 1) {
        Agencia = 'Bogotá';
      } else if (agenciaId === 2) {
        Agencia = 'Cartagena';
      } else if (agenciaId === 4) {
        Agencia = 'Buenaventura';
      }

      let Cliente = $('#id_cliente').val();

      // 🛑 CORRECCIÓN: Usar un objeto literal para los datos
      let datos_a_enviar = {
        Agencia: Agencia,
        Cliente: Cliente
      };

      $.post(
        $('#base_url').val() + 'transporte/Consultar_Precintos',
        datos_a_enviar, // Enviar como objeto
        function (data) {
          if (data) {
            precintosDisponibles = data; // guardar para uso posterior
            // Asumo que agregarFilaPrecinto() es la función que renderiza la fila
            agregarFilaPrecinto();
          }
        },
        'json'
      ).fail(function (xhr, status, error) { // Recomendado: Añadir manejo de error
        console.error("Error al consultar precintos:", status, error);
      });

    } else {
      $('#id_servicio').val('');
      $('#onom_propietario').val('');
      $('#odocumento_propietario').val('');
      $('#onom_tenedor').val('');
      $('#odocumento_tenedor').val('');
      $('#onom_conductor').val('');
      $('#odocumento_conductor').val('');
      $('#ocelular_conductor').val('');
      $('#o_carroceria').val('');
      $('#o_marca').val('');
      $('#o_modelo').val('');
      $('#o_color').val('');
      $('#o_tipovinculacion').val('');
      $('#o_clase').val('');
      $('#o_identificacion').val('');
      $('#o_cliente').val('');
      $('#o_direccioncl').val('');
      $('#o_telefono').val('');
      $('#o_ciudad').val('');
      $('#o_producto').html('');
      $('#o_empaque').html('');
      $('#o_cantidad').val('');
      $('#o_volumen').val('');
      $('#o_conten1').val('');
      $('#o_pesocarro').val('');
      $('#o_remolque').html('<option value="">Seleccione</option>');
      $('#id_propietario').val('');
      $('#id_tenedor').val('');
      $('#id_conductor').val('');
      $('#o_flete_pactado').val('');
      $('#o_fletecotizacion').val();
      $('#adicione_remite').val('');
      $('#adicione_remite').html('');
      $('#adicione_desti').val('');
      $('#adicione_desti').html('');
      $('#tabla_precintos tbody').html('');
      $('#o_fletecotizacion').val('');
      $('#o_peso_mercancia').val('');
      $('#o_pesocarga').val('');
      $('#datos_remite').html('');
      $('#datos_destino').html('');
    }
  });

  //CONTENEDOR 2
  $('#cnt_opcion').change(function () {
    var conte = $('#cnt_opcion').val();
    if (conte == 0) {
      $('#cnt_municipio2').html('');
      $('#cnt_tipocon2').html('');
      $('#o_conten2').prop('disabled', true);
      $('#cnt_tipocon2').prop('disabled', true);
      $('#cnt_dias2').prop('disabled', true);
      $('#cnt_municipio2').prop('disabled', true);
      $('#cnt_direccion2').prop('disabled', true);
      $('#cnt_fcomodato2').prop('disabled', true);
      $('#cnt_peso2').prop('disabled', true);
    }
    if (conte == 1) {
      $('#o_conten2').prop('disabled', false);
      $('#cnt_tipocon2').prop('disabled', false);
      $('#cnt_dias2').prop('disabled', false);
      $('#cnt_municipio2').prop('disabled', false);
      $('#cnt_direccion2').prop('disabled', false);
      $('#cnt_fcomodato2').prop('disabled', false);
      $('#cnt_peso2').prop('disabled', false);

      $.post(
        $('#base_url').val() + 'transporte/Tipo_Contenedor',
        function (data) {
          $('#cnt_tipocon2').html('<option value="">Seleccione</option>');
          if (data) {
            for (var m = 0; m < data.length; m++) {
              $('#cnt_tipocon2').append('<option value="' + data[m]['id'] + '">' + data[m]['nombre'] + '</option>');
            }
          }
        },
        'json',
      );

      $.post(
        $('#base_url').val() + 'transporte/Municipio_Contenedor',
        function (data) {
          $('#cnt_municipio2').html('<option value="">Seleccione</option>');
          if (data) {
            for (var m = 0; m < data.length; m++) {
              $('#cnt_municipio2').append('<option value="' + data[m]['id'] + '">' + data[m]['municipio'] + '  |    ' + data[m]['depto'] + '</option>');
            }
          }
        },
        'json',
      );
    }
  });

  // JS
  // VALIDACIONES DEL BOTON GUARDAR
  $('#Registrar_orden').click(function () {
    Swal.fire({
      title: '¿Deseas guardar la orden de cargue?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        let msg_error = '';

        // Validaciones de campos obligatorios
        if (!$('#placao').val()) {
          msg_error += '<p>Debe diligenciar la <strong>Placa</strong> para registrar orden de cargue</p>';
          AplicaFoco('#placao');
        } else {
          RemueveFoco('#placao');
        }

        if (!$('#onom_conductor').val()) {
          msg_error += '<p>Debe diligenciar el <strong>Nombre del conductor</strong> para registrar orden de cargue</p>';
          AplicaFoco('#onom_conductor');
        } else {
          RemueveFoco('#onom_conductor');
        }

        if (!$('#odocumento_conductor').val()) {
          msg_error += '<p>Debe diligenciar el <strong>Documento del conductor</strong> para registrar orden de cargue</p>';
          AplicaFoco('#odocumento_conductor');
        } else {
          RemueveFoco('#odocumento_conductor');
        }

        if (!$('#o_identificacion').val()) {
          msg_error += '<p>Debe diligenciar la <strong>Identificación del cliente</strong></p>';
          AplicaFoco('#o_identificacion');
        } else {
          RemueveFoco('#o_identificacion');
        }

        if (!$('#o_cliente').val()) {
          msg_error += '<p>Debe diligenciar el <strong>Nombre del cliente</strong></p>';
          AplicaFoco('#o_cliente');
        } else {
          RemueveFoco('#o_cliente');
        }

        if (!$('#o_direccioncl').val()) {
          msg_error += '<p>Debe diligenciar la <strong>Dirección del cliente</strong></p>';
          AplicaFoco('#o_direccioncl');
        } else {
          RemueveFoco('#o_direccioncl');
        }

        if (!$('#o_telefono').val()) {
          msg_error += '<p>Debe diligenciar el <strong>Teléfono del cliente</strong></p>';
          AplicaFoco('#o_telefono');
        } else {
          RemueveFoco('#o_telefono');
        }

        if (!$('#o_ciudad').val()) {
          msg_error += '<p>Debe diligenciar la <strong>Ciudad del cliente</strong></p>';
          AplicaFoco('#o_ciudad');
        } else {
          RemueveFoco('#o_ciudad');
        }

        let filas_precinto = $('#tabla_precintos').find('tbody tr').length;
        if (filas_precinto > 0) {
          $('.inumprecinto').each(function () {
            if (!$(this).val()) {
              msg_error += '<p>Debe diligenciar el <strong>Código de precinto</strong></p>';
              AplicaFoco('.inumprecinto');
            } else {
              RemueveFoco('.inumprecinto');
            }
          });
        }

        if (!$('#o_producto').val()) {
          msg_error += '<p>Debe diligenciar el <strong>Producto</strong></p>';
          AplicaFoco('#o_producto');
        } else {
          RemueveFoco('#o_producto');
        }

        if (!$('#o_empaque').val()) {
          msg_error += '<p>Debe diligenciar el <strong>Tipo de empaque</strong></p>';
          AplicaFoco('#o_empaque');
        } else {
          RemueveFoco('#o_empaque');
        }

        if (!$('#o_cantidad').val()) {
          msg_error += '<p>Debe diligenciar la <strong>Cantidad</strong></p>';
          AplicaFoco('#o_cantidad');
        } else {
          RemueveFoco('#o_cantidad');
        }

        if (!$('#o_volumen').val()) {
          msg_error += '<p>Debe diligenciar el <strong>Volumen</strong></p>';
          AplicaFoco('#o_volumen');
        } else {
          RemueveFoco('#o_volumen');
        }

        if (!$('#o_pesocarga').val()) {
          msg_error += '<p>Debe diligenciar el <strong>Peso de carga</strong></p>';
          AplicaFoco('#o_pesocarga');
        } else {
          RemueveFoco('#o_pesocarga');
        }

        // -------------------------------------------------------------------------------------
        // 🛑 VALIDACIÓN DE CAPACIDAD VS PESO NETO (PESO CARGA)
        // -------------------------------------------------------------------------------------

        // Limpiar y parsear valores a float. Usamos 0 si el valor no está disponible.
        const pesoCarga = parseFloat($('#o_pesocarga').val().replace(/,/g, '') || 0);
        const capacidadVehiculo = parseFloat($('#o_pesocarro').val().replace(/,/g, '') || 0);

        // Validar: Si el Peso de la Carga es estrictamente mayor que la Capacidad del Vehículo
        if (pesoCarga > capacidadVehiculo) {
          msg_error += '<p>No puede generar la orden porque el <strong>Peso de carga (' + pesoCarga + ' kg) es mayor a la capacidad del vehículo (' + capacidadVehiculo + ' kg)</strong></p>';
          // AplicaFoco aquí si quieres que resalte el campo de la carga cuando falla
        }

        // -------------------------------------------------------------------------------------

        if ($('#cnt_opcion').val() == 1) {
          if (!$('#o_conten2').val()) {
            msg_error += '<p>Debe diligenciar el <strong>N° contenedor 2</strong></p>';
            AplicaFoco('#o_conten2');
          } else {
            RemueveFoco('#o_conten2');
          }

          if (!$('#cnt_tipocon2').val()) {
            msg_error += '<p>Debe diligenciar el <strong>Tipo Contenedor 2</strong></p>';
            AplicaFoco('#cnt_tipocon2');
          } else {
            RemueveFoco('#cnt_tipocon2');
          }

          if (!$('#cnt_dias2').val()) {
            msg_error += '<p>Debe diligenciar la <strong>Fecha Vencimiento 2</strong></p>';
            AplicaFoco('#cnt_dias2');
          } else {
            RemueveFoco('#cnt_dias2');
          }

          if (!$('#cnt_municipio2').val()) {
            msg_error += '<p>Debe diligenciar el <strong>Municipio Devolución 2</strong></p>';
            AplicaFoco('#cnt_municipio2');
          } else {
            RemueveFoco('#cnt_municipio2');
          }

          if (!$('#cnt_direccion2').val()) {
            msg_error += '<p>Debe diligenciar la <strong>Dirección Devolución 2</strong></p>';
            AplicaFoco('#cnt_direccion2');
          } else {
            RemueveFoco('#cnt_direccion2');
          }

          if (!$('#cnt_peso2').val()) {
            msg_error += '<p>Debe diligenciar el <strong>Peso Vacío 2(Kg)</strong></p>';
            AplicaFoco('#cnt_peso2');
          } else {
            RemueveFoco('#cnt_peso2');
          }
        }

        // Mostrar errores o registrar
        if (msg_error) {
          Swal.fire({
            title: '⚠️ ALERTA DE ORDEN DE CARGUE ⚠️',
            html: msg_error,
            icon: 'error',
            confirmButtonText: 'Revisar',
          });
        } else {
          Registro_orden();
        }
      } else {
        Swal.fire('Operación cancelada', '', 'info');
      }
    });
  });


  $('#buscar_orden').click(function () {
    //consulta de la tabla de ordenes de carga
    TablaOrden();
  });

  $('#btn_imprimir').click(function () {
    var orden_cargue = $('#c_orden').val();
    var urloc = $('#base_url').val() + 'libs/orden_cargue.php?' + 'n_orden=' + codificarBase64(orden_cargue);
    window.open(urloc, '_blank');
  });

  document.getElementById('exportar_excel').addEventListener('click', function () {
    var table = document.getElementById('ordenes_decargue_export');
    if (!table) {
      console.error("El elemento con el ID 'ordenes_decargue_export' no existe.");
      return;
    }

    // Clonar tabla y eliminar columnas no deseadas
    var clonedTable = table.cloneNode(true);
    var columnsToOmit = [0, 6]; // Índices base 0

    var ths = clonedTable.querySelectorAll('thead th');
    columnsToOmit.slice().reverse().forEach(index => {
      if (ths[index]) ths[index].remove();
    });

    var rows = clonedTable.querySelectorAll('tbody tr');
    rows.forEach(row => {
      var cells = row.querySelectorAll('td');
      columnsToOmit.slice().reverse().forEach(index => {
        if (cells[index]) cells[index].remove();
      });
    });

    // Crear libro a partir de la tabla
    var wb = XLSX.utils.table_to_book(clonedTable, { sheet: "Órdenes" });
    var ws = wb.Sheets["Órdenes"];

    // 1) Autoajustar columnas según el contenido
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    const colWidths = data[0].map((_, i) => {
      let maxLength = data.map(row => (row[i] ? row[i].toString().length : 0))
        .reduce((a, b) => Math.max(a, b), 0);
      return { wch: maxLength + 2 }; // +2 por padding
    });
    ws['!cols'] = colWidths;

    // 2) Agregar filtros (en la primera fila con datos)
    const range = XLSX.utils.decode_range(ws['!ref']);
    ws['!autofilter'] = { ref: XLSX.utils.encode_range(range.s, range.e) };

    // 3) Poner encabezados en negrita (simple, no requiere XLSX-Style)
    data[0].forEach((header, i) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
      if (!ws[cellAddress]) return;
      ws[cellAddress].s = { font: { bold: true } }; // Necesita versión con soporte de estilos (xlsx-style)
    });

    // 4) Exportar con nombre dinámico
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Informe_Ordenes_Cargue_${fechaActual}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  });

}

function Listar_Placas_Pendientes() {
  $.post(
    $('#base_url').val() + 'transporte/Seleccione_Placa',
    function (data) {
      if (data) {
        $('#placao').empty();
        $('#placao').append('<option value="">-- Seleccione una placa --</option>');

        for (var i = 0; i < data.length; i++) {
          const item = data[i];
          // Determinar texto para escenario
          let escenarioTexto = '';
          if (item.escenario_id == 2) {
            escenarioTexto = ' [Escenario 2]';
          } else if (item.escenario_id == 3) {
            escenarioTexto = ' [Escenario 3]';
          }

          const optionHtml = `
            <option 
              value="${item.placa}"
              data-year="${item.id_servicio_cliente}"
              data-est="${item.idestudi}"
              data-remi="${item.idremitente}"
              data-fp="${item.flete_propuesto}" 
              data-prem="${item.id_punto}"
              data-pesorem="${item.peso_remitente}"
              data-tarifa="${item.tarifa_promedio}"
              data-idflete="${item.id_subastaflete}"
              data-idef="${item.id_estadoflete}"
              data-agencia="${item.agencia}"
              data-escenario="${item.escenario_id}">
              
              Placa: ${item.placa} / N estudio: ${item.num_estudioseguridad} 
              / N servicio: ${item.id_servicio_cliente} 
              / Id remitente: ${item.idremitente} ${item.nombre} 
              / Lugar: ${item.lugar} ${escenarioTexto}
            </option>
          `;

          $('#placao').append(optionHtml);
        }
      }
    },
    'json'
  );
}

var conta = 0;
//ELIMINAR BLOQUES DE CODIGO
//eliminar remitente del dom
function delete_remi(id) {
  event.preventDefault();
  $('.td' + id).remove();
  $('#p' + id).remove();
  $('#p_ciudad' + id).remove();
  $('#clientea' + id).remove();
  $('#bgi' + id).remove();
  $('#dire' + id).remove();
  $('#fecha' + id).remove();
  $('#observa' + id).remove();
  $('#hora' + id).remove();
  $('#tipo' + id).remove();
  $('#orden' + id).remove();
  $('#btne' + id).remove();
  $(this).closest('td').remove();
  $(this).closest('p').remove();
  $(this).closest('p_ciudad').remove();
  $(this).closest('clientea').remove();
  $(this).closest('bgi').remove();
  $(this).closest('dire').remove();
  $(this).closest('fecha').remove();
  $(this).closest('observa').remove();
  $(this).closest('tipo').remove();
  $(this).closest('orden').remove();
  $(this).closest('btne').remove();
  alert('Dato Eliminado!!');
}

//eliminar destinanatario del dom
function delete_destinew(id) {
  event.preventDefault();
  $('#p_ciudadd' + id).remove();
  $('#clientead' + id).remove();
  $('#dired' + id).remove();
  $('#fechad' + id).remove();
  $('#observad' + id).remove();
  $('#horad' + id).remove();
  $('#tipod' + id).remove();
  $('#ordend' + id).remove();
  $('.tf' + id).remove();
  $(this).closest('p_ciudadd').remove();
  $(this).closest('clientead').remove();
  $(this).closest('dired').remove();
  $(this).closest('fechad').remove();
  $(this).closest('observad').remove();
  $(this).closest('horad').remove();
  $(this).closest('tipod').remove();
  $(this).closest('ordend').remove();
  $(this).closest('tf').remove();
  alert('Dato Eliminado!!');
}

//eliminar remitentes de BD
function delete_asocia(id) {
  var codigo = $('#idremi' + id + '').val();
  $.post(
    $('#base_url').val() + 'transporte/Eliminar_Dato',
    'id=' + codigo,
    function (datu) {
      if (datu == 'true') {
        event.preventDefault();
        $('.tr' + id).remove();
        $('#remite' + id).remove();
        $('#tipodocumento' + id).remove();
        $('#direccion' + id).remove();
        $('#origen' + id).remove();
        $('#telefono' + id).remove();
        $('#fecha_remi' + id).remove();
        $('#hora_remi' + id).remove();
        $('#obs_remi' + id).remove();
        $('#idremi' + id).remove();
        $(this).closest('tr').remove();
        $(this).closest('#remite').remove();
        $(this).closest('#tipodocumento').remove();
        $(this).closest('#direccion').remove();
        $(this).closest('#origen').remove();
        $(this).closest('#telefono').remove();
        $(this).closest('#fecha_remi').remove();
        $(this).closest('#hora_remi').remove();
        $(this).closest('#obs_remi').remove();
        $(this).closest('#idremi').remove();
        alert('Dato Eliminado!!');
      }
    },
    'json',
  );
}

//eliminar destinatario BD
function delete_desty(id) {
  var codi = $('#iddest' + id + '').val();
  $.post(
    $('#base_url').val() + 'transporte/Eliminar_Dato',
    'id=' + codi,
    function (datee) {
      if (datee == 'true') {
        event.preventDefault();
        $('.tm' + id).remove();
        $('#destinatario' + id).remove();
        $('#documento' + id).remove();
        $('#telefono' + id).remove();
        $('#direccion' + id).remove();
        $('#destino' + id).remove();
        $('#fecha_entrega' + id).remove();
        $('#horaentre' + id).remove();
        $('#observacion' + id).remove();
        $('#iddest' + id).remove();
        $(this).closest('tm').remove();
        $(this).closest('#destinatario').remove();
        $(this).closest('#documento').remove();
        $(this).closest('#telefono').remove();
        $(this).closest('#direccion').remove();
        $(this).closest('#destino').remove();
        $(this).closest('#fecha_entrega').remove();
        $(this).closest('#horaentre').remove();
        $(this).closest('#observacion').remove();
        $(this).closest('#iddest').remove();
        alert('Dato Eliminado!!');
      }
    },
    'json',
  );
}

function ConsultaCliente() {
  $.post(
    $('#base_url').val() + 'transporte/ConsultaCliente',
    function (data) {
      $('#clientefiltro').html('<option value="">Seleccionar</option>');
      if (data) {
        for (var i = 0; i < data.length; i++) {
          $('#clientefiltro').append('<option value="' + data[i]['id'] + '">' + data[i]['nombre'] + '</option>');
        }
      } else {
        $('#clientefiltro').html('<option value="">Seleccionar</option>');
      }
    },
    'json',
  );
}

//Formatear Números
function Formatear(ele) {
  var elemento = $(ele);
  elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
}

//Mayusculas
function mayuscula(elemento) {
  let texto = elemento.value;
  elemento.value = texto.toUpperCase();
}

//FUNCION ANTERIOR DE ORDEN DE CARGUE
async function Registro_orden() {
  $('#msg_present').html('');
  //datos del vehículo
  var placa = $('#placao').val();
  var fecha_expedicion = $('#o_fecha_exedicion').val();
  var propietario = $('#onom_propietario').val();
  var tenedor = $('#onom_tenedor').val();
  var conductor = $('#onom_conductor').val();
  var carroceria = $('#o_carroceria').val();
  var marca = $('#o_marca').val();
  var modelo = $('#o_modelo').val();
  var color = $('#o_color').val();
  var tipovinculacion = $('#o_tipovinculacion').val();
  var clase = $('#o_clase').val();
  var remolque = $('#o_remolque').val();
  var flete = $('#o_fletecotizacion').val();
  var fletepactado = $('#o_flete_pactado').val();
  //datos clientes
  var identifica = $('#o_identificacion').val();
  var cliente = $('#o_cliente').val();
  var direccion = $('#o_direccioncl').val();
  var telefono = $('#o_telefono').val();
  var ciudad = $('#o_ciudad').val();
  var orden = 0;
  //Datos generales
  var producto = $('#o_producto').val();
  var empaque = $('#o_empaque').val();
  var cantidad = $('#o_cantidad').val();
  var volumen = $('#o_volumen').val();
  var peso_mercancia = $('#o_peso_mercancia').val().replace(/,/g, '');
  var conte1 = $('#o_conten1').val();
  var conte2 = $('#o_conten2').val();
  /*var fechacargue=$("#o_fechacargue").val();
  var horacargue=$("#o_horacargue").val();*/
  var pesovehiculo = $('#o_pesocarro').val().replace(/,/g, '');
  var pesocarga = $('#o_pesocarga').val().replace(/,/g, '');
  var condici = $('#to_condicionesw').val();
  var embalaje = $('#t_embalaje').val();
  var observacio = $('#t_observacion').val();
  var docpropietario = $('#odocumento_propietario').val();
  var doctenedor = $('#odocumento_tenedor').val();
  var doc_conductor = $('#odocumento_conductor').val();
  var id_remitente = $('#id_remitente').val();
  //demás datos
  var id_conductor = $('#id_conductor').val();
  var id_tenedor = $('#id_tenedor').val();
  var id_propi = $('#id_propietario').val();
  var num_servicio = $('#id_servicio').val();
  var id_cliente = $('#id_cliente').val();
  var num_estudio = $('#id_estudios').val();
  var id_trailer = $('#id_trailer').val();
  var id_vehiculo = $('#id_vehiculo').val();
  var idreg = $('#idremi').val();
  var id_puntorem = $('#id_puntoremitente').val();
  var tarifa_propuesto = $('#o_tarifapactada').val();
  var id_subasta_flete = $('#id_subasta_flete').val();
  var id_esubasta_flete = $('#id_esubasta_flete').val();
  //datos de contenedor2
  var devoldias = $('#cnt_dias2').val();
  var devolmunicipio = $('#cnt_municipio2').val();
  var devoldireccion = $('#cnt_direccion2').val();
  var devoltipo = $('#cnt_tipocon2').val();
  var devolcomodato = $('#cnt_fcomodato2').val();
  var devolvacio = $('#cnt_peso2').val();
  //datos multiples
  //ACTUALIZAR REMITENTES
  $('#remite').val();
  $('#tipodocumento').val();
  $('#direccion').val();
  $('#origen').val();
  $('#telefono').val();
  $('#fecha_remi').val();
  $('#hora_remi').val();
  $('#obs_remi').val();
  //se construye el objeto que almacena los datos
  var dato = {
    dire: [],
    tel: [],
    fech: [],
    hor: [],
    obs: [],
    idremi: [],
  };
  //se recogen cada uno de los datos de los inputs que tengan la misma clase
  //debe existir una clase por cada tipo de dato ej: direccion, teléfono y con el index se recorre
  $('.acremitedi').each(function (index) {
    var a = $(this).val();
    dato.dire[index] = a;
  });
  $('.acremitete').each(function (index) {
    var tel = $(this).val();
    dato.tel[index] = tel;
  });
  $('.acremitefe').each(function (index) {
    var fecha = $(this).val();
    dato.fech[index] = fecha;
  });
  $('.acremiteho').each(function (index) {
    var hora = $(this).val();
    dato.hor[index] = hora;
  });
  $('.acremiteobs').each(function (index) {
    var obs = $(this).val();
    dato.obs[index] = obs;
  });
  $('.acremiteid').each(function (index) {
    var id = $(this).val();
    dato.idremi[index] = id;
  });
  var nota = dato;
  nota = JSON.stringify(nota);
  //CREAR REMITENTES NUEVOS
  var datonuevo = {
    p_ciudad: [],
    clientea: [],
    dire: [],
    fecha: [],
    observa: [],
    hora: [],
    tipo: [],
    orden: [],
  };
  $('.acremtin').each(function (index) {
    //ciudad
    var city = $(this).val();
    datonuevo.p_ciudad[index] = city;
  });
  $('.acremtincli').each(function (index) {
    //cliente
    var cliente = $(this).val();
    datonuevo.clientea[index] = cliente;
  });
  $('.acremtdiden').each(function (index) {
    //direccion
    var direccion = $(this).val();
    datonuevo.dire[index] = direccion;
  });
  $('.acremtiden').each(function (index) {
    //fecha
    var fech = $(this).val();
    datonuevo.fecha[index] = fech;
  });
  $('.acobservaren').each(function (index) {
    //observacion
    var obsr = $(this).val();
    datonuevo.observa[index] = obsr;
  });
  $('.achoraden').each(function (index) {
    //hora
    var hor = $(this).val();
    datonuevo.hora[index] = hor;
  });
  $('.acdestipn').each(function (index) {
    //tipo punto
    var tipop = $(this).val();
    datonuevo.tipo[index] = tipop;
  });
  $('.acdesorn').each(function (index) {
    //orden
    var ordenr = $(this).val();
    datonuevo.orden[index] = ordenr;
  });
  var notanew = datonuevo;
  notanew = JSON.stringify(notanew);
  //ACTUALIZAR DESTINATARIOS
  var impu = {
    direccion: [],
    destino: [],
    fecha_entrega: [],
    horaentre: [],
    observacion: [],
    iddest: [],
  };
  $('.acdesdir').each(function (index) {
    var dir = $(this).val();
    impu.direccion[index] = dir;
  });
  $('.acdescity').each(function (index) {
    var city = $(this).val();
    impu.destino[index] = city;
  });
  $('.acdesfec').each(function (index) {
    var dat = $(this).val();
    impu.fecha_entrega[index] = dat;
  });
  $('.acdeshour').each(function (index) {
    var tiempo = $(this).val();
    impu.horaentre[index] = tiempo;
  });
  $('.acdesobs').each(function (index) {
    var note = $(this).val();
    impu.observacion[index] = note;
  });
  $('.iddeti').each(function (index) {
    var iddesty = $(this).val();
    impu.iddest[index] = iddesty;
  });
  var actudes = impu;
  actudes = JSON.stringify(actudes);
  //INSERTAR DESTINATARIOS NUEVOS
  var impunew = {
    p_ciudadd: [],
    clientead: [],
    dired: [],
    fechad: [],
    observad: [],
    horad: [],
    tipod: [],
    ordend: [],
  };
  $('.idescity').each(function (index) {
    var ciudad = $(this).val();
    impunew.p_ciudadd[index] = ciudad;
  });
  $('.idescli').each(function (index) {
    var cliente = $(this).val();
    impunew.clientead[index] = cliente;
  });
  $('.idesdir').each(function (index) {
    var direccion = $(this).val();
    impunew.dired[index] = direccion;
  });
  $('.idesfec').each(function (index) {
    var fecha = $(this).val();
    impunew.fechad[index] = fecha;
  });
  $('.idesobs').each(function (index) {
    var noteo = $(this).val();
    impunew.observad[index] = noteo;
  });
  $('.ideshora').each(function (index) {
    var hora = $(this).val();
    impunew.horad[index] = hora;
  });
  $('.idestipo').each(function (index) {
    var tipologia = $(this).val();
    impunew.tipod[index] = tipologia;
  });
  $('.idesorden').each(function (index) {
    var orden = $(this).val();
    impunew.ordend[index] = orden;
  });
  var insertdes = impunew;
  insertdes = JSON.stringify(insertdes);
  //INSERTAR PRECINTOS
  var preci = {
    tipoprecinto: [],
    num_preci: [],
  };
  $('.ipretipo').each(function (index) {
    var tipor = $(this).val();
    preci.tipoprecinto[index] = tipor;
  });
  // $('.inumprecinto').each(function (index) {
  $('.iselectprecinto').each(function (index) {
    var numero = $(this).val();
    preci.num_preci[index] = numero;
  });
  var insertpreci = preci;
  insertpreci = JSON.stringify(insertpreci);

  let msg_texto = '';
  let color_orden = '';
  var numero_orden_cargue = 0;
  $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
  let datos = new FormData();
  datos.append('n_ordene', orden);
  datos.append('idcliente', id_cliente);
  datos.append('id_vehiculo', id_vehiculo);
  datos.append('id_trailer', id_trailer);
  datos.append('idconductor', id_conductor);
  datos.append('pesovehiculo', pesovehiculo);
  datos.append('flete', flete);
  datos.append('fletepactado', fletepactado);
  datos.append('num_estudio', num_estudio);
  datos.append('num_servicio', num_servicio);
  datos.append('mercancia', producto);
  datos.append('empaque', empaque);
  datos.append('cant', cantidad);
  datos.append('peso_mer', peso_mercancia);
  datos.append('volumen', volumen);
  datos.append('cont1', conte1);
  datos.append('cont2', conte2);
  datos.append('condicionk', condici);
  datos.append('obsk', observacio);
  datos.append('emabalajek', embalaje);
  datos.append('pesok', pesocarga);
  datos.append('id_remitente', id_remitente);
  datos.append('id_puntorem', id_puntorem);
  datos.append('cnt_dias2', devoldias);
  datos.append('cnt_muni2', devolmunicipio);
  datos.append('cnt_direccion', devoldireccion);
  datos.append('cnt_tpo', devoltipo);
  datos.append('cnt_comodato', devolcomodato);
  datos.append('cnt_vacio', devolvacio);
  datos.append('id_propietario', id_propi);
  datos.append('id_tenedor', id_tenedor);
  datos.append('tarifapropuesta', tarifa_propuesto);
  datos.append('id_subasta_flete', id_subasta_flete);
  datos.append('id_esubasta_flete', id_esubasta_flete);
  // datos.append("datos", "");
  // datos.append("datos_ordene", datos_ordene);
  datos.append('datos', nota);
  datos.append('renuevo', notanew);
  datos.append('actudesty', actudes);
  datos.append('insertdes', insertdes);
  datos.append('precinto', insertpreci);

  try {
    const response = await fetch($('#base_url').val() + 'transporte/Registro_orden', {
      method: 'POST',
      body: datos,
      cache: 'no-cache',
    });
    const data = await response.json();
    // console.log("🚀 ~ Registro_orden ~ data:", data.status)
    if (data.status === true) {
      msg_texto = 'Datos Registrados Exitosamente NEXOSAPP Orden N° ' + data.numero_documento;
      icon = 'check';
      color_orden = 'success';
      pal = 'Proceso terminado';
      numero_orden_cargue = data.numero_documento;
      //setTimeout(function() { location.reload(false); }, 2000);
    } else if (data.status === false) {
      msg_texto = 'Datos No Registrados Exitosamente NEXOSAPP';
      icon = 'close';
      color_orden = 'danger';
      pal = 'Proceso terminado';
    }
  } catch (error) {
    console.error('Error en Registro_orden:', error);
    msg_texto = `⚠️ NEXOSAPP: Error técnico en el registro`;
    color = 'warning';
    // throw error;
  } finally {
    $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    // Crear_Dato_Oet(numero_orden_cargue);
    Crear_Dato_Oet(numero_orden_cargue, msg_texto, color_orden);
  }
}

async function Crear_Dato_Oet(numero, mensajeNexos, colorNexos) {
  const recurso = 1;
  const paquete = new FormData();
  paquete.append('recurso', recurso);
  paquete.append('numero', numero);

  $('#loading-overlay-oet').css('display', 'flex');

  let mensajeOet = '';
  let colorOet = '';

  try {
    const response = await fetch($('#base_url').val() + 'integrar_oet/Consulta_Transacciones', {
      method: 'POST',
      body: paquete,
      cache: 'no-cache',
    });

    const data = await response.json();

    const offcanvasEl = document.getElementById('offcanvasNuevaOrdenCargue');
    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);

    if (data.status === true || data.status === 'true') {
      mensajeOet = `✅ OET: Integración completada con éxito. ID: ${data.id_orden || 'N/A'}`;
      colorOet = 'success';
    } else {
      mensajeOet = `❌ OET: Falló la integración. ID: ${data.id_orden || 'N/A'}`;
      colorOet = 'error';
    }
  } catch (error) {
    console.error('Error en integración OET:', error);
    mensajeOet = '⚠️ OET: Error técnico en la integración.';
    colorOet = 'warning';
    setInterval(() => {
      // 🔄 RECARGAR PÁGINA
      location.reload();
    }, 1500);
  } finally {
    $('#loading-overlay-oet').css('display', 'none');

    const colorFinal = (colorNexos === 'success' && colorOet === 'success') ? 'success' : (colorNexos === 'error' || colorOet === 'error') ? 'error' : 'warning';

    // const offcanvasEl = document.getElementById('offcanvasNuevaOrdenCargue');
    // const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);

    // Swal.fire({
    //   icon: colorFinal,
    //   title: 'Resultado del proceso',
    //   html: `
    //     <div style="text-align:left;">
    //       <p>${mensajeNexos}</p>
    //       <p>${mensajeOet}</p>
    //     </div>
    //   `,
    //   timer: 6000,
    //   timerProgressBar: true,
    // }).then(() => {
    //   if (offcanvasInstance) offcanvasInstance.hide();
    //   // ✅ Limpiar formulario
    //   const form = document.getElementById('formNuevaOrden'); // Ajusta el ID si es distinto
    //   if (form) {
    //     form.reset();

    //     // Si usas Select2 o algún otro plugin, reinícialo también:
    //     $(form).find('select').val('').trigger('change');
    //   }
    //   Listar_Placas_Pendientes();
    // });

    Swal.fire({
      icon: colorFinal,
      title: 'Resultado del proceso',
      html: `
        <div style="text-align:left;">
          <p>${mensajeNexos}</p>
          <p>${mensajeOet}</p>
        </div>
      `,
      timer: 6000,
      timerProgressBar: true,
    }).then(() => {

      // cerrar offcanvas
      if (offcanvasInstance) offcanvasInstance.hide();

      // limpiar formulario
      const form = document.getElementById('formNuevaOrden');
      if (form) {
        form.reset();
        $(form).find('select').val('').trigger('change');
      }

      // refrescar listados
      Listar_Placas_Pendientes();

      // 🔄 RECARGAR PÁGINA
      location.reload();
    });
  }
}

// FUNCIONES AUXILIARES (para recolectar datos)
function construirRemitentes() {
  const dato = { dire: [], tel: [], fech: [], hor: [], obs: [], idremi: [] };
  $('.acremitedi').each((i, e) => dato.dire[i] = $(e).val());
  $('.acremitete').each((i, e) => dato.tel[i] = $(e).val());
  $('.acremitefe').each((i, e) => dato.fech[i] = $(e).val());
  $('.acremiteho').each((i, e) => dato.hor[i] = $(e).val());
  $('.acremiteobs').each((i, e) => dato.obs[i] = $(e).val());
  $('.acremiteid').each((i, e) => dato.idremi[i] = $(e).val());
  return dato;
}

function construirRemitentesNuevos() {
  const datonuevo = { p_ciudad: [], clientea: [], dire: [], fecha: [], observa: [], hora: [], tipo: [], orden: [] };
  $('.acremtin').each((i, e) => datonuevo.p_ciudad[i] = $(e).val());
  $('.acremtincli').each((i, e) => datonuevo.clientea[i] = $(e).val());
  $('.acremtdiden').each((i, e) => datonuevo.dire[i] = $(e).val());
  $('.acremtiden').each((i, e) => datonuevo.fecha[i] = $(e).val());
  $('.acobservaren').each((i, e) => datonuevo.observa[i] = $(e).val());
  $('.achoraden').each((i, e) => datonuevo.hora[i] = $(e).val());
  $('.acdestipn').each((i, e) => datonuevo.tipo[i] = $(e).val());
  $('.acdesorn').each((i, e) => datonuevo.orden[i] = $(e).val());
  return datonuevo;
}

function construirDestinatarios() {
  const impu = { direccion: [], destino: [], fecha_entrega: [], horaentre: [], observacion: [], iddest: [] };
  $('.acdesdir').each((i, e) => impu.direccion[i] = $(e).val());
  $('.acdescity').each((i, e) => impu.destino[i] = $(e).val());
  $('.acdesfec').each((i, e) => impu.fecha_entrega[i] = $(e).val());
  $('.acdeshour').each((i, e) => impu.horaentre[i] = $(e).val());
  $('.acdesobs').each((i, e) => impu.observacion[i] = $(e).val());
  $('.iddeti').each((i, e) => impu.iddest[i] = $(e).val());
  return impu;
}

function construirDestinatariosNuevos() {
  const impunew = { p_ciudadd: [], clientead: [], dired: [], fechad: [], observad: [], horad: [], tipod: [], ordend: [] };
  $('.idescity').each((i, e) => impunew.p_ciudadd[i] = $(e).val());
  $('.idescli').each((i, e) => impunew.clientead[i] = $(e).val());
  $('.idesdir').each((i, e) => impunew.dired[i] = $(e).val());
  $('.idesfec').each((i, e) => impunew.fechad[i] = $(e).val());
  $('.idesobs').each((i, e) => impunew.observad[i] = $(e).val());
  $('.ideshora').each((i, e) => impunew.horad[i] = $(e).val());
  $('.idestipo').each((i, e) => impunew.tipod[i] = $(e).val());
  $('.idesorden').each((i, e) => impunew.ordend[i] = $(e).val());
  return impunew;
}

function construirPrecintos() {
  const preci = { tipoprecinto: [], num_preci: [] };
  $('.ipretipo').each((i, e) => preci.tipoprecinto[i] = $(e).val());
  $('.iselectprecinto').each((i, e) => preci.num_preci[i] = $(e).val());
  return preci;
}

function agregarFilaPrecinto() {
  conta++;

  $('#tabla_precintos').html('');

  // Obtener precintos ya usados
  const seleccionados = $('.iselectprecinto')
    .map(function () {
      return $(this).val();
    })
    .get();

  // Filtrar disponibles
  const disponibles = precintosDisponibles.filter(p => !seleccionados.includes(p.codigo_precinto));

  if (disponibles.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Sin precintos disponibles',
      text: 'Ya no hay más precintos disponibles.',
      timer: 2500,
      showConfirmButton: false,
      timerProgressBar: true
    });

    return;
  }

  // Opciones de precintos (código)
  let opcionesPrecinto = '<option value="">-- Seleccione un precinto --</option>';
  for (const p of disponibles) {
    opcionesPrecinto += `<option value="${p.codigo_precinto}">${p.codigo_precinto}</option>`;
  }

  // Obtener tipos únicos
  const tipos = [...new Set(precintosDisponibles.map(p => p.tipo_precinto))];

  // Opciones de tipos
  let opcionesTipo = '<option value="">-- Tipo --</option>';
  for (const t of tipos) {
    opcionesTipo += `<option value="${t}">${t}</option>`;
  }

  // Selects
  const selectPrecinto = `
    <select id="num_preci${conta}" class="form-control input-xs iselectprecinto">
      ${opcionesPrecinto}
    </select>
  `;

  const selectTipo = `
    <select id="tipopre${conta}" class="form-control input-xs ipretipo">
      ${opcionesTipo}
    </select>
  `;

  const observar = `<textarea id="sellos${conta}" class="form-control input-xs ipreobs"></textarea>`;

  const eliminar = `
    <button class="btn btn-danger btn-sm ps${conta}" onclick="delete_precinto(${conta})">
      <i class="fa fa-trash"></i>
    </button>
  `;

  // const eliminar = `
  //   <button class="btn btn-danger btn-sm ps${conta}" onclick="delete_precinto(${conta})">
  //     <i class="fa fa-trash"></i> Eliminar
  //   </button>
  // `;

  const fila = `
    <tr class="ps${conta}">
      <td><strong>${conta}</strong><input type="hidden" id="sk${conta}" value="1"></td>
      <td>${selectPrecinto}</td>
      <td>${selectTipo}</td>
      <td class="text-center">${eliminar}</td>
    </tr>
  `;

  $('#tabla_precintos').append(fila);
}

function delete_precinto(id) {
  // Elimina la fila
  $('.ps' + id).remove();

  // Reiniciar contador y reasignar clases/IDs a todas las filas
  conta = 0;
  $('#tabla_precintos tbody tr').each(function () {
    conta++;

    // Reasignar clase principal
    $(this).attr('class', 'ps' + conta);

    // Reasignar cada elemento dentro de la fila
    $(this).find('td:eq(0)').html(`<strong>${conta}</strong><input type="hidden" id="sk${conta}" value="1">`);

    $(this).find('select.iselectprecinto').attr('id', 'num_preci' + conta);
    $(this).find('select.ipretipo').attr('id', 'tipopre' + conta);
    $(this).find('textarea.ipreobs').attr('id', 'sellos' + conta);
    $(this).find('button').attr('onclick', 'delete_precinto(' + conta + ')').attr('class', 'btn btn-danger btn-sm ps' + conta).attr('id', 'r' + conta);
  });
}

function AplicaFoco(idelemento) {
  $(idelemento).focus().css("background-color", "rgb(254,242,181)");
}

function RemueveFoco(idelemento) {
  $(idelemento).blur().css("background-color", "white");
}

function AnularOrden(idorden) {
  Swal.fire({
    title: `¿Desea Anular la Orden de Cargue N° ${idorden}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, Anular',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      validar_anulacion(idorden);
    }
  });
}

function validar_anulacion(idorden) {
  $.post(
    $('#base_url').val() + 'transporte/ValidaAnulacionOrden',
    `idorden=${idorden}`,
    function (datu) {
      if (datu) {
        Swal.fire({
          icon: 'error',
          title: 'No se puede anular',
          text: '¡Esta Orden está asociada a una remesa activa!',
          confirmButtonText: 'Aceptar'
        });
      } else {
        AnularOrden2(idorden);
      }
    },
    'json'
  );
}

function AnularOrden2(idorden) {
  $.post(
    $('#base_url').val() + 'transporte/AnularOrden',
    `idorden=${idorden}`,
    function (datu) {
      if (datu === 'true') {
        Swal.fire({
          icon: 'success',
          title: 'Orden anulada',
          text: '¡Orden anulada exitosamente!',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          TablaOrden(); // Refrescar tabla después de confirmar
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo anular la orden.',
          confirmButtonText: 'Aceptar'
        });
      }
    },
    'json'
  );
}

async function TablaOrden() {
  // Limpiar campos y mostrar contenido
  $('#contenedor_datos').hide();
  $('#tabla_datos').show();
  $('.campov').val('');
  $('#tabla_cremitente').html('');

  // Mostrar loading
  $('#ordenload').html(`
    <div class="text-center py-3">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-muted">Consultando Órdenes de Cargue...</p>
    </div>
  `);

  // Preparar filtros
  const filtrarpor = $('#filtro_orden').val();
  let fecha = '', fechab = '', cliente = '';

  if (filtrarpor == 1) {
    fecha = $('#finicialOrden').val();
    fechab = $('#ffinalOrden').val();
  } else if (filtrarpor == 2) {
    cliente = $('#clientefiltro').val();
  } else if (filtrarpor == 3) {
    fecha = $('#finicialOrden').val();
    fechab = $('#ffinalOrden').val();
    cliente = $('#clientefiltro').val();
  }

  try {
    const response = await fetch(
      `${$('#base_url').val()}transporte/Consulta_Ordenes`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          finicia: fecha,
          ffinal: fechab,
          cliente: cliente,
          filtro: filtrarpor,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    $('#ordenbody').empty();

    if (data.ordenes && data.ordenes.length > 0) {
      $('.contador').text(data.total_ordenes);

      data.ordenes.forEach((orden) => {
        let status = '';
        let btnanular = '', btneditar = '', btnconsultar = '', btnpdf = '';

        btnconsultar = `
          <button class="btn btn-info btn-sm me-1 px-1 py-1" title="Ver orden"
            data-bs-toggle="offcanvas" data-bs-target="#offcanvasDetalleOrden" aria-controls="offcanvasDetalleOrden"
            onClick="ConsultaOrden(${orden.id}, ${orden.mer_idservicio})">
            <i class="fa-regular fa-eye"></i>
          </button>
        `;

        if (orden.estado == 1) {
          status = `<td class="nexos-txt-success"><center><span class="fas fa-circle text-success" title="Activo"></span></center></td>`;
          btnanular = `
            <button class="btn btn-danger btn-sm me-1 px-1 py-1" title="Anular orden"
              onClick="AnularOrden(${orden.id})">
              <i class="fa-solid fa-ban"></i>
            </button>
          `;
          btneditar = `
            <button class="btn btn-warning btn-sm me-1 px-1 py-1" title="Editar orden"
              data-bs-toggle="offcanvas" data-bs-target="#offcanvasDetalleOrden" aria-controls="offcanvasDetalleOrden"
              onClick="ConsultaOrden(${orden.id}, ${orden.mer_idservicio})">
              <i class="fa-solid fa-pencil"></i>
            </button>
          `;
          btnpdf = `
            <button class="btn btn-success btn-sm me-1 px-1 py-1" title="Imprimir orden"
              onClick="ImprimirPdf(${orden.id})">
              <i class="fa-solid fa-print"></i>
            </button>
          `;
        } else {
          status = `<td class="nexos-txt-danger"><center><span class="fas fa-circle text-danger" title="Inactivo"></span></center></td>`;
        }

        $('#ordenbody').append(`
          <tr>
            ${status}
            <td style="white-space: nowrap;">${orden.id}</td>
            <td style="white-space: nowrap;">${orden.cliente}</td>
            <td style="white-space: nowrap;">${orden.placa}</td> 
            <td style="white-space: nowrap;">${orden.nombre} ${orden.apellido1} ${orden.apellido2}</td>
            <td style="white-space: nowrap;">
              <span>Peso: ${orden.ca_pesocargue}</span>
            </td>
            <td class="text-right" style="white-space: nowrap;">
              <div class="btn-group btn-group-sm" role="group" aria-label="Acciones">
                ${btnconsultar}
                ${btnanular}
                ${btnpdf}
              </div>
            </td>
          </tr>
        `);
      });
    } else {
      $('#ordenbody').html(`<tr><td colspan="6" class="text-center text-muted">No se encontraron órdenes</td></tr>`);
    }
  } catch (error) {
    console.error('Error consultando órdenes:', error);
    $('#ordenbody').html(`<tr><td colspan="6" class="text-center text-danger">Error cargando órdenes</td></tr>`);
  } finally {
    // Siempre eliminar el loading
    $('#ordenload').empty();
  }
}

function ImprimirPdf(id) {
  // var id = $("#c_orden").val();
  let numeroorden = id;
  var urloc = $('#base_url').val() + 'libs/orden_cargue.php?' + 'n_orden=' + codificarBase64(numeroorden);
  window.open(urloc, '_blank');
}

function codificarBase64(texto) {
  return btoa(texto);
}

// FunciÃ³n para decodificar Base64
function decodificarBase64(textoCodificado) {
  return atob(textoCodificado);
}

function ConsultaOrden(idorden, idservicio) {
  $('.campov').val('');
  $('#tabla_cremitente').html('');
  // $('#tabla_datos').css('display', 'none');
  $('#contenedor_datos').css('display', '');
  //traer datos de la orden de cargue-cabecera
  $.post(
    $('#base_url').val() + 'transporte/ConsultaOrden', 'numorden=' + idorden,
    function (data) {
      if (data) {
        var trailer = '';
        if (data['placatrailer'] != null) {
          trailer = data['placatrailer'];
        }
        $('#titulo').html('Orden de cargue NÂ° ' + data['id']);
        $('#c_orden').val(data['id']);
        $('#c_placa').val(data['placa']);
        $('#c_nombre').val(data['nombre'] + ' ' + data['apellido1'] + ' ' + data['apellido2']);
        $('#c_numero').val(data['numero_documento']);
        $('#c_celular').val(data['celular']);
        $('#c_carroceria').val(data['tipo_carroceria']);
        $('#c_marca').val(data['marca']);
        $('#c_modelo').val(data['anio_fabricacion']);
        $('#c_color').val(data['color']);
        $('#c_tipovin').val(data['tipo_vinculacion']);
        $('#c_clase').val(data['clase']);
        $('#c_remolque').val(trailer);
        $('#c_flete').val(data['ve_fletecotizacion']);
        $('#c_fletep').val(data['ve_fletepactado']);
        $('#c_producto').val(data['mer_producto']);
        $('#c_empaque').val(data['mer_empaque']);
        $('#c_cant').val(data['mer_cantidad']);
        $('#c_volumen').val(data['mer_volumen']);
        $('#c_pesom').val(data['mer_pesomercancia']);
        $('#c_con1').val(data['mer_contenedor1']);
        $('#c_con2').val(data['mer_contenedor2']);
        $('#c_obs').val(data['ca_observacion']);
        $('#c_condi').val(data['ca_condiciones']);
        $('#c_laje').val(data['ca_embalaje']);
      }
    },
    'json',
  );
  //traer datos del remitente + destinatario
  $.post(
    $('#base_url').val() + 'transporte/ConsultaRemitente',
    `numorden=${idservicio}&idorden=${idorden}`,
    function (datm) {
      if (datm) {
        for (let v = 0; v < datm.length; v++) {
          let clase = '';
          if (datm[v]['tipo'] === 'punto entrega') {
            clase = 'Destinatario';
          }
          if (datm[v]['tipo'] === 'punto recogida') {
            clase = 'Remitente';
          }

          $('#tabla_cremitente').append(`
          <tr id="fila${v}">
            <td style='width:auto; white-space: nowrap;'>${datm[v]['nombre']}</td>
            <td style='width:auto; white-space: nowrap;'>${datm[v]['municipio']}-${datm[v]['depto']}</td>
            <td style='width:auto; white-space: nowrap;'>${datm[v]['direccion_entrega']}</td>
            <td style='width:auto; white-space: nowrap;'>${datm[v]['fecha_estimada_entrega']}</td>
            <td style='width:auto; white-space: nowrap;'>${datm[v]['hora_estimada']}</td>
            <td style='width:auto; white-space: nowrap;'>${datm[v]['observacion']}</td>
            <td style='width:auto; white-space: nowrap;'>${clase}</td>
          </tr>
        `);
        }
      }
    },
    'json'
  );

  // Traer datos del destinatario
  $.post(
    $('#base_url').val() + 'transporte/ConsultaDestinatario',
    `numorden=${idservicio}&idorden=${idorden}`,
    function (datm) {
      if (datm) {
        for (let v = 0; v < datm.length; v++) {
          $('#tabla_cremitente').append(`
          <tr id="fila${v}">
            <td style='width:auto; white-space: nowrap;'>${datm[v]['destinatario']}</td>
            <td style='width:auto; white-space: nowrap;'>${datm[v]['municipio']}-${datm[v]['depto']}</td>
            <td style='width:auto; white-space: nowrap;'>${datm[v]['direccion_entrega']}</td>
            <td style='width:auto; white-space: nowrap;'>${datm[v]['fecha_estimada_entrega']}</td>
            <td style='width:auto; white-space: nowrap;'>${datm[v]['hora_estimada']}</td>
            <td style='width:auto; white-space: nowrap;'>${datm[v]['observacion']}</td>
            <td>Destinatario</td>
          </tr>
        `);
        }
      }
    },
    'json'
  );

  Consultar_Dato_Oet(idorden);
}

function Consultar_Dato_Oet(idorden) {
  // Mostrar loading mientras consulta
  $('#panel_oet').html(`
    <div class="text-center py-3">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-muted">Consultando OET...</p>
    </div>
  `);

  var paquete = 'numero=' + idorden;

  $.post(
    $('#base_url').val() + 'integrar_oet/Consulta_Orden_Oet',
    paquete,
    function (data) {
      // Si la respuesta viene vacía o sin datos
      if (!data || $.isEmptyObject(data)) {
        $('#panel_oet').html('<p class="text-center text-warning">No hay datos para consultar</p>');
        return;
      }

      // Mostrar resultado según status
      if (data.status === true || data.status === 'true') {
        $('#panel_oet').html(`<p class="text-center text-success">${data.resultado}</p>`);
      } else if (data.status === false || data.status === 'false') {
        $('#panel_oet').html(`<p class="text-center text-danger">${data.resultado}</p>`);
      } else {
        $('#panel_oet').html('<p class="text-center text-warning">No hay datos para consultar</p>');
      }
    },
    'json'
  );
}
