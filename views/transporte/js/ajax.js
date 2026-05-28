$(document).ready(function () {
  //llamar la placa
  $.post(
    $('#id_url_ajax').val() + 'transporte/Seleccione_Placa',
    function (data) {
      if (data) {
        // Limpiar el select
        $('#placao').empty();

        // Agregar la opción inicial
        $('#placao').append('<option value="">-- Seleccione una placa --</option>');
        for (var i = 0; i < data.length; i++) {
          const item = data[i];
          const optionHtml = `
          <option value="${item.placa}"  data-year="${item.id_servicio_cliente}"  data-est="${item.idestudi}"  data-remi="${item.idremitente}"  data-fp="${item.flete_propuesto}" 
            data-prem="${item.id_punto}" data-pesorem="${item.peso_remitente}" data-tarifa="${item.tarifa_promedio}" data-idflete="${item.id_subastaflete}" data-idef="${item.id_estadoflete}" data-agencia='${item.agencia}'>
            Placa: ${item.placa} /N estudio: ${item.num_estudioseguridad} /N servicio: ${item.id_servicio_cliente} /Id remitente: ${item.idremitente} ${item.nombre} /Lugar: ${item.lugar}
          </option>
        `;
          $('#placao').append(optionHtml);
        }
      }
    },
    'json'
  );

});

var c = 0;
$('#adicione_remitente').click(function () {
  c++;
  var num_service = $('#id_servicio').val();
  $.post(
    $('#id_url_ajax').val() + 'transporte/Consulta_Municipios',
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
    $('#id_url_ajax').val() + 'transporte/Consulta_Cliente',
    'id_servi=' + num_service,
    function (datu) {
      if (datu) {
        $('#clientea' + c + '').html('<option value="' + datu['id'] + '">' + datu['nombre'] + '</option>');
      }
    },
    'json',
  );

  //   var ch = '<input type="button" id="p' + c + '" class="btn-primary" value="Remover"  onclick="delete_remi(' + c + ')">';

  //   var city = "<select id='p_ciudad" + c + "' class='form-control input-xs acremtin'>" + '<option value="" readonly="readonly">Seleccione</option>' + '</select>';
  //   var cliente = "<select id='clientea" + c + "' class='form-control input-xs acremtincli'></select>";
  //   var suma =
  //     '<tr class="td' +
  //     c +
  //     '">' +
  //     '<tr class="td' +
  //     c +
  //     '" style="text-align:left; color:white; background-color:#33b5e5; height:20px; "><th>#</th><th>Origen</th><th>Dirección</th></tr>' +
  //     '<td class="td' +
  //     c +
  //     '"><span id="bgi' +
  //     c +
  //     '" class="badge badge-primary acbdgn">' +
  //     c +
  //     '</span></td>' +
  //     '<td class="td' +
  //     c +
  //     '">' +
  //     city +
  //     '</td>' +
  //     '<td class="td' +
  //     c +
  //     '"><input type="text" id="dire' +
  //     c +
  //     '" class="form-control acremtdiden" style=" height:14px; font-size:90%;"></td>' +
  //     '</tr>' +
  //     '<tr class="td' +
  //     c +
  //     '"><th>Fecha</th><th>Cliente</th><th>Observación</th></tr>' +
  //     '<td><input type="date" id="fecha' +
  //     c +
  //     '" class="form-control acremtiden"   style="width:169px; height:14px; font-size:90%;"></td>' +
  //     '<td>' +
  //     cliente +
  //     '</td>' +
  //     '<td><textarea id="observa' +
  //     c +
  //     '" class="form-control acobservaren" style="width:169px; height:14px; font-size:90%; "></textarea></td>' +
  //     '</tr><tr class="td' +
  //     c +
  //     '"><th>Hora</th><th>Tipo Punto</th><th>Orden</th></tr>' +
  //     '<tr><td><input type="time" id="hora' +
  //     c +
  //     '" class="form-control achoraden" style="width:110px; height:14px; font-size:90%;" ></td>' +
  //     '<td><select id="tipo' +
  //     c +
  //     '" class="acdestipn" style="width:169px; height:17px; font-size:90%; " ><option value="punto recogida">Punto recogida</option></select></td>' +
  //     '<td><input type="text" id="orden' +
  //     c +
  //     '"  class="form-control acdesorn" style="width:167px; height:14px; font-size:90%;  "  value="' +
  //     c +
  //     '" readonly="readonly"></td>' +
  //     '</tr><tr id="btne' +
  //     c +
  //     '"><td>' +
  //     ch +
  //     '</td>' +
  //     '</tr>';
  //   $('#adicione_remite').append(suma);
  // });
  // var b = 0;

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
  </tr>
`;
  $('#adicione_remite').append(suma);
});
var b = 0;


// $('#adicione_destina').click(function () {
//   b++;
//   var num_service = $('#id_servicio').val();
//   $.post(
//     $('#id_url_ajax').val() + 'transporte/Busque_Municipios',
//     function (data) {
//       if (data) {
//         for (var t = 0; t < data.length; t++) {
//           $('#p_ciudadd' + b + '').append('<option value="' + data[t]['id'] + '">' + data[t]['municipio'] + ' - ' + data[t]['depto'] + '</option>');
//         }
//       }
//     },
//     'json',
//   );
//   $.post(
//     $('#id_url_ajax').val() + 'transporte/Consulta_Cliente',
//     'id_servi=' + num_service,
//     function (note) {
//       if (note) {
//         $('#clientead' + b + '').html('<option value="' + note['id'] + '">' + note['nombre'] + '</option>');
//       }
//     },
//     'json',
//   );

//   var ch = '<input type="button" id="f' + b + '" class="btn-primary tf' + b + '" value="Remover"  onclick="delete_destinew(' + b + ')">';

//   var city = "<select id='p_ciudadd" + b + "' class='form-control input-xs idescity'>" + '<option value="" readonly="readonly">Seleccione</option>' + '</select>';
//   var cliente = "<select id='clientead" + b + "' class='form-control input-xs idescli'></select>";
//   var destino =
//     '<tr class="tf' +
//     b +
//     '">' +
//     '<tr class="tf' +
//     b +
//     '" style="text-align:left; color:white; background-color:#33b5e5; height:20px; "><th>#</th><th>Destino</th><th>Dirección</th></tr>' +
//     '<td class="tf' +
//     b +
//     '"><span class="badge badge-primary tf' +
//     b +
//     '">' +
//     b +
//     '</span></td>' +
//     '<td class="tf' +
//     b +
//     '">' +
//     city +
//     '</td>' +
//     '<td class="tf' +
//     b +
//     '"><input type="text" id="dired' +
//     b +
//     '" class="form-control idesdir" style=" height:14px; font-size:90%;"></td>' +
//     '</tr>' +
//     '<tr class="tf' +
//     b +
//     '"><th>Fecha</th><th>Cliente</th><th>Observación</th></tr>' +
//     '<td class="tf' +
//     b +
//     '"><input type="date" id="fechad' +
//     b +
//     '" class="form-control idesfec"   style="width:169px; height:14px; font-size:90%;"></td>' +
//     '<td class="tf' +
//     b +
//     '">' +
//     cliente +
//     '</td>' +
//     '<td class="tf' +
//     b +
//     '"><textarea id="observad' +
//     b +
//     '" class="form-control idesobs" style="width:169px; height:14px; font-size:90%; "></textarea></td>' +
//     '</tr><tr class="tf' +
//     b +
//     '"><th>Hora</th><th>Tipo Punto</th><th>Orden</th></tr>' +
//     '<tr class="tf' +
//     b +
//     '"><td><input type="time" id="horad' +
//     b +
//     '" class="form-control ideshora" style="width:110px; height:14px; font-size:90%;" ></td>' +
//     '<td class="tf' +
//     b +
//     '"><select id="tipod' +
//     b +
//     '" class="idestipo"  style="width:169px; height:17px; font-size:90%; " ><option value="punto entrega">punto entrega</option></select></td>' +
//     '<td class="tf' +
//     b +
//     '"><input type="text" id="ordend' +
//     b +
//     '"  class="form-control idesorden" style="width:167px; height:14px; font-size:90%;  "  value="' +
//     b +
//     '" readonly="readonly"></td>' +
//     '</tr><tr class="tf' +
//     b +
//     '"><td>' +
//     ch +
//     '</td></tr>';

//   $('#adicione_desti').append(destino);
// });
$('#adicione_destina').click(function () {
  b++;
  const num_service = $('#id_servicio').val();

  // Cargar municipios
  $.post(
    $('#id_url_ajax').val() + 'transporte/Busque_Municipios',
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
    $('#id_url_ajax').val() + 'transporte/Consulta_Cliente',
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
var conta = 0;

// $('#adicione_precinto').click(function () {
//   conta++;
//   var pre =
//     '<select id="tipopre' +
//     conta +
//     '" class="form-control input-xs ipretipo"> <option value="Botella">Botella</option><option value="Metalico" disabled="disabled">Metalico</option><option value="Plastico" disabled="disabled">Plastico</option><option value="Adhesivo">Adhesivo</option><option value="Correilla">Correilla</option> </select>';

//   var mg = '<input type="button" id="r' + conta + '" class="btn-primary ps' + conta + '" value="Eliminar" onclick="delete_precinto(' + conta + ')">';
//   var observar = '<textarea id="sellos' + conta + '" class="form-control input-xs ipreobs"></textarea>';
//   var agrega =
//     '<tr class="ps' +
//     conta +
//     '">' +
//     '<td class="ps' +
//     conta +
//     '"><p><strong>' +
//     conta +
//     '</strong></p><input type="hidden" id="sk' +
//     conta +
//     '" value="1" class="ps' +
//     conta +
//     '"></td>' +
//     '<td class="ps' +
//     conta +
//     '"><input type="number" id="num_preci' +
//     conta +
//     '" class="form-control input-xs inumprecinto" min="0"  > </td>' +
//     '<td class="ps' +
//     conta +
//     '">' +
//     pre +
//     '</td><td class="ps' +
//     conta +
//     '">' +
//     mg +
//     '</td></tr>';
//   $('#tabla_precintos').append(agrega);
// });

// $('#adicione_precinto').click(function () {
//   conta++;
//   // SELECT pr.codigo_precinto,pr.tipo_precinto FROM cmx_precinto pr WHERE pr.agencia_asignada='Bogotá' AND pr.estado_precinto='disponible'
//   const pre = `
//     <select id="tipopre${conta}" class="form-control input-xs ipretipo">
//       <option value="Botella">Botella</option>
//       <option value="Metalico" disabled="disabled">Metalico</option>
//       <option value="Plastico" disabled="disabled">Plastico</option>
//       <option value="Adhesivo">Adhesivo</option>
//       <option value="Correilla">Correilla</option>
//     </select>
//   `;

//   const mg = `
//   <button id="r${conta}" class="btn btn-danger btn-sm ps${conta}" onclick="delete_precinto(${conta})">
//     <i class="fa fa-trash"></i> Eliminar
//   </button>
// `;


//   const observar = `
//     <textarea id="sellos${conta}" class="form-control input-xs ipreobs"></textarea>
//   `;

//   const agrega = `
//     <tr class="ps${conta}">
//       <td class="ps${conta}">
//         <p><strong>${conta}</strong></p>
//         <input type="hidden" id="sk${conta}" value="1" class="ps${conta}">
//       </td>
//       <td class="ps${conta}">
//         <input type="number" id="num_preci${conta}" class="form-control input-xs inumprecinto" min="0">
//       </td>
//       <td class="ps${conta}">${pre}</td>
//       <td class="ps${conta} text-center">${mg}</td>
//     </tr>
//   `;

//   $('#tabla_precintos').append(agrega);
// });


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

//eliminar precintos del dom
// function delete_precinto(id) {
//   event.preventDefault();
//   $('.ps' + id).remove();
//   $('#tipo_precinto' + id).remove();
//   $('#r' + id).remove();
//   $('#sellos' + id).remove();
//   $('#sk' + id).remove();
//   $('#num_preci' + id).remove();
//   $(this).closest('ps').remove();
//   $(this).closest('tipo_precinto').remove();
//   $(this).closest('r').remove();
//   $(this).closest('sellos').remove();
//   $(this).closest('sk').remove();
//   $(this).closest('num_preci').remove();
//   alert('Dato Eliminado!!');
// }

//eliminar remitentes de BD
function delete_asocia(id) {
  var codigo = $('#idremi' + id + '').val();
  $.post(
    $('#id_url_ajax').val() + 'transporte/Eliminar_Dato',
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
    $('#id_url_ajax').val() + 'transporte/Eliminar_Dato',
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

//TRAER DATOS QUE CONFORMAN LA ORDEN
let precintosDisponibles = [];
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
    // console.log("🚀 ~ agenciaId:", agenciaId)

    $('#id_puntoremitente').val(idpunto);
    $('#o_flete_pactado').val(valor_propuesto);
    $('.o_flete_pactado').html(valor_propuesto);
    $('#o_tarifapactada').val(tarifapro);
    $('#id_subasta_flete').val(idfletesub);
    $('#id_esubasta_flete').val(idestsub);
    //consulta datos del vehículo
    $.post(
      $('#id_url_ajax').val() + 'transporte/Datos_Placa_Seleccionada',
      'eleccion_placa=' + placa,
      function (data) {
        if (data) {
          var trailer = '';
          var idt = '';
          var dato;
          $('#id_vehiculo').val(data['idvehiculo']);
          $('#onom_propietario').val(data['pronom'] + ' ' + data['proape1'] + ' ' + data['proape2']);
          $('.onom_propietario').html(data['pronom'] + ' ' + data['proape1'] + ' ' + data['proape2']);
          $('#odocumento_propietario').val(data['pronum']);
          $('.odocumento_propietario').html(data['pronum']);
          $('#onom_tenedor').val(data['tenom'] + ' ' + data['teape1'] + ' ' + data['teape2']);
          $('.onom_tenedor').html(data['tenom'] + ' ' + data['teape1'] + ' ' + data['teape2']);
          $('#odocumento_tenedor').val(data['tenum']);
          $('.odocumento_tenedor').html(data['tenum']);
          $('#onom_conductor').val(data['connom'] + ' ' + data['conape1'] + ' ' + data['conape2']);
          $('.onom_conductor').html(data['connom'] + ' ' + data['conape1'] + ' ' + data['conape2']);
          $('#odocumento_conductor').val(data['connum']);
          $('.odocumento_conductor').html(data['connum']);
          $('#ocelular_conductor').val(data['celular'] + ' - ' + data['celular2']);
          $('.ocelular_conductor').html(data['celular'] + ' - ' + data['celular2']);
          $('#o_carroceria').val(data['tipo_carroceria']);
          $('.o_carroceria').html(data['tipo_carroceria']);
          $('#o_marca').val(data['marca']);
          $('.o_marca').html(data['marca']);
          $('#o_modelo').val(data['anio_fabricacion']);
          $('.o_modelo').html(data['anio_fabricacion']);
          $('#o_color').val(data['color']);
          $('.o_color').html(data['color']);
          $('#o_tipovinculacion').val(data['tipo_vinculacion']);
          $('.o_tipovinculacion').html(data['tipo_vinculacion']);
          $('#o_clase').val(data['clase']);
          $('.o_clase').html(data['clase']);
          $('#o_pesocarro').val(data['capacidad_tn']);
          $('#o_pesocarro').val(parseFloat($('#o_pesocarro').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('.o_pesocarro').html(parseFloat($('#o_pesocarro').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          if (data['placatrailer'] == null) {
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
          $('.id_propietario').html(data['id_pro']);
          $('#id_tenedor').val(data['id_ten']);
          $('.id_tenedor').html(data['id_ten']);
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
      $('#id_url_ajax').val() + 'transporte/Datos_solicitud_servicio',
      'id_servicio=' + idservicio,
      function (dato) {
        if (dato) {
          $('#id_cliente').val(dato['id_cliente']);
          $('#o_identificacion').val(dato['documento'] + '-' + dato['digito_verificacion']);
          $('.o_identificacion').html(dato['documento'] + '-' + dato['digito_verificacion']);
          $('#o_cliente').val(dato['nombre']);
          $('.o_cliente').html(dato['nombre']);
          $('#o_direccioncl').val(dato['direccion']);
          $('.o_direccioncl').html(dato['direccion']);
          $('#o_telefono').val(dato['telefono']);
          $('.o_telefono').html(dato['telefono']);
          $('#o_ciudad').val(dato['ciudad']);
          $('.o_ciudad').html(dato['ciudad']);
          // $("#o_producto").html("<option>" + dato["tipo_mercancia"] + "</option>");
          $('#o_producto').val(dato['tipo_mercancia']);
          $('.o_producto').html(dato['tipo_mercancia']);
          // $("#o_empaque").html("<option>" + dato["empaque"] + "</option>");
          $('#o_empaque').val(dato['empaque']);
          $('.o_empaque').html(dato['empaque']);
          $('#o_cantidad').val(dato['cantidad_empaque']);
          $('.o_cantidad').html(dato['cantidad_empaque']);
          $('#o_volumen').val(dato['volumen_total']);
          $('#o_volumen').val(parseFloat($('#o_volumen').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('.o_volumen').html(parseFloat($('#o_volumen').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          if (dato['devol_numcont'] != null) {
            $('#o_conten1').val(dato['devol_numcont']);
          } else {
            $('#o_conten1').val('');
          }
          $('#o_fletecotizacion').val(dato['flete']);
          $('#o_peso_mercancia').val(dato['peso_kg']);
          $('#o_peso_mercancia').val(parseFloat($('#o_peso_mercancia').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('.o_peso_mercancia').html(parseFloat(dato['peso_kg'], 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#o_pesocarga').val(pesorem);
          $('.o_pesocarga').html(parseFloat(pesorem, 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#to_condicionesw').val(dato['seg_cond_cargue']);
        }
      },
      'json',
    );

    //consulta datos del remitente
    $.post(
      $('#id_url_ajax').val() + 'transporte/Datos_remitentes',
      'id_service=' + idservicio + '&id_remi=' + idremitente,
      function (data) {
        if (data) {
          $('#datos_remite').html('');
          var cont = 0;
          for (var m = 0; m < data.length; m++) {
            cont++;
            var ch = '<input type="button" id="p' + m + '" class="btn-primary" value="Remover"  onclick="delete_asocia(' + m + ')">';
            $('#datos_remite').append(`
                <table cellpadding="0" cellspacing="0" width="100%" border="0" style="background-color: #332D2D;color:#fff;">
                  <tbody>
                    <tr>
                      <td class="celda_titulo2 text-left" style="margin:25px;">
                        <b>Remitente ${cont}</b> 
                      </td>
                    </tr>
                    <tr>
                    </tr>
                  </tbody>
               </table>
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;font-zise: 8px;padding-top: 15px;">
                <thead>
                    <tr class="tr${cont}">
                      <th style="background-color: #F5F5F5; width: 250px;font-weight: bold;border: 1px solid #ddd;padding: 1px;">Remitente(*):</th>
                        <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;padding: 1px 1px 1px;" class="remite${m}"> ${data[m]['nombre']} </td>
                        <input type="hidden" id="remite${m}" class="form-control input-xs tr" readonly="readonly" value="${data[m]['nombre']}">
                      <th style="background-color: #F5F5F5; width: 250px;font-weight: bold;border: 1px solid #ddd;padding: 1px;">Documento(*):</th>
                        <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;" class="tipodocumento${m}">${data[m]['documento']}</td>
                        <input type="hidden" id="tipodocumento${m}" class="form-control input-xs tr${m}" value="${data[m]['documento']}" readonly="readonly">
                      <th style="background-color: #F5F5F5; width: 250px;font-weight: bold;border: 1px solid #ddd;padding: 1px;">Dirección remitente(*):</th>
                        <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;" class="direccion${m}">${data[m]['direccion_entrega']}</td>
                        <input type="hidden" id="direccion${m}" class="form-control input-xs acremitedi" value="${data[m]['direccion_entrega']}" readonly="readonly">
                    </tr>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 250px;font-weight: bold;border: 1px solid #ddd;padding: 1px;">Origen(*):</th>
                      <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;" class="origen${m}">${data[m]['municipio']}/${data[m]['depto']}
                        <!--<select id="origen${m}" class="tr${m}" readonly="readonly">
                          <option>${data[m]['municipio']}/${data[m]['depto']}</option>
                        </select>-->
                      </td>
                      <input type="hidden" id="origen${m}" class="form-control input-xs tr${m}" value="${data[m]['municipio']} ${data[m]['depto']}" readonly="readonly">
                      <th style="background-color: #F5F5F5; width: 250px;font-weight: bold;border: 1px solid #ddd;padding: 1px;">Teléfono(*):</th>
                        <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;padding: 1px 1px 1px;" class="telefono${m}">${data[m]['telefono']}</td>
                        <input type="hidden" id="telefono${m}" class="form-control input-xs acremitete" value="${data[m]['telefono']}" readonly="readonly">
                      <th style="background-color: #F5F5F5; width: 250px;font-weight: bold;border: 1px solid #ddd;padding: 1px;">Fecha recogida(*):</th>
                        <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;" class="fecha_remi${m}">${data[m]['fecha_estimada_entrega']}</td>
                        <input type="hidden" id="fecha_remi${m}" class="form-control input-xs acremitefe" value="${data[m]['fecha_estimada_entrega']}" readonly="readonly">
                    </tr>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 250px;font-weight: bold;border: 1px solid #ddd;padding: 1px;">Hora recogida(*):</th>
                        <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;" class="hora_remi${m}">${data[m]['hora_estimada']}</td>
                        <input type="hidden" id="hora_remi${m}" class="form-control input-xs acremiteho" value="${data[m]['hora_estimada']}" readonly="readonly">
                      <th style="background-color: #F5F5F5; width: 250px;font-weight: bold;border: 1px solid #ddd;padding: 1px;">Observación(*):</th>
                        <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;" class="obs_remi${m}">${data[m]['observacion']}</td>
                        <input type="hidden" id="obs_remi${m}" class="form-control input-xs acremiteobs" value="${data[m]['observacion']}" readonly="readonly">
                        <input type="hidden" id="idremi${m}" class="form-control input-xs acremiteid" value="${data[m]['id']}" readonly="readonly">
                    </tr>
                </thead>
              </table>
              `);
          }
        }
      },
      'json',
    );

    //consutla datos del destinatario
    $.post(
      $('#id_url_ajax').val() + 'transporte/Datos_destinatario',
      'id_service=' + idservicio + '&id_puntoremi=' + idpunto,
      function (data) {
        $('#datos_destino').html('');
        if (data) {
          var cent = 0;
          for (var d = 0; d < data.length; d++) {
            cent++;
            var k = '<input type="button" id="p' + d + '" class="btn-primary" value="Remover"  onclick="delete_desty(' + d + ')">';
            $('#datos_destino').append(`
            <table cellpadding="0" cellspacing="0" width="100%" border="0" style="background-color: #332D2D;color:#fff;">
              <tbody>
                <tr>
                  <td class="celda_titulo2 text-left" style="margin:25px;">
                    <b>Destinatario ${cent}</b> 
                  </td>
                </tr>
                <tr>
                </tr>
              </tbody>
            </table>
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;font-zise: 8px;padding-top: 15px;">
              <thead>
                <tr class="tr${d}">
                  <th style="background-color: #F5F5F5; width: 250px;font-weight: bold;border: 1px solid #ddd;padding: 1px;">Destinatario(*):</th>
                    <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;padding: 1px 1px 1px;" class="destinatario${d}"> ${data[d]['nombre']}</td>
                    <input type="hidden" id="destinatario${d}" class="form-control input-xs tm${d}" readonly="readonly" value="${data[d]['nombre']}">
                  <th style="background-color: #F5F5F5; width: 250px;font-weight: bold;border: 1px solid #ddd;padding: 1px;">Documento(*):</th>
                    <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;" class="documento${d}">${data[d]['documento']}</td>
                    <input type="hidden" id="documento${d}" readonly="readonly" class="form-control input-xs tm${d}" value="${data[d]['documento']}">
                  <th style="background-color: #F5F5F5; width: 250px;font-weight: bold;border: 1px solid #ddd;padding: 1px;">Teléfono:</th>
                    <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;" class="telefono${d}">${data[d]['telefono']}</td>
                    <input type="hidden" id="telefono${d}" class="form-control input-xs tm${d}" value="${data[d]['telefono']}" readonly="readonly">
                </tr>
                <tr class="tr${d}">
                  <th style="background-color: #F5F5F5; width: 250px;font-weight: bold;border: 1px solid #ddd;padding: 1px;">Dirección(*):</th>
                    <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;padding: 1px 1px 1px;" class="direccion${d}"> ${data[d]['direccion_entrega']}</td>
                    <input type="hidden" id="direccion${d}" class="form-control input-xs acdesdir" readonly="readonly" value="${data[d]['direccion_entrega']}">
                  <th style="background-color: #F5F5F5; width: 250px;font-weight: bold;border: 1px solid #ddd;padding: 1px;">Destino(*):</th>
                    <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;" class="documento${d}">
                         <select id="destino${d}" class="acdescity" readonly="readonly" style="width:100%;">
                          <option value="${data[d]['idmunicipio']}">
                              ${data[d]['municipio']}/${data[d]['depto']}
                          </option>
                         </select>
                    </td>
                  <th style="background-color: #F5F5F5; width: 250px;font-weight: bold;border: 1px solid #ddd;padding: 1px;">Fecha entrega(*):</th>
                    <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;" class="fecha_entrega${d}">${data[d]['fecha_estimada_entrega']}</td>
                    <input type="hidden" id="fecha_entrega${d}" class="form-control input-xs acdesfec" value="${data[d]['fecha_estimada_entrega']}" readonly="readonly">
                </tr>
                <tr class="tr${d}">
                  <th style="background-color: #F5F5F5; width: 250px;font-weight: bold;border: 1px solid #ddd;padding: 1px;">Hora entrega:</th>
                    <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;padding: 1px 1px 1px;" class="horaentre${d}"> ${data[d]['hora_estimada']}</td>
                    <input type="hidden" id="horaentre${d}" class="form-control input-xs acdeshour" readonly="readonly" value="${data[d]['hora_estimada']}">
                  <th style="background-color: #F5F5F5; width: 250px;font-weight: bold;border: 1px solid #ddd;padding: 1px;">Observación(*):</th>
                    <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;" class="observacion${d}" colspan="3">
                      <textarea type="hidden" id="observacion${d}" class="form-control input-xs acdesobs" readonly="readonly" rows="1">${data[d]['observacion']}</textarea>
                    </td>
                      <input type="hidden" id="iddest${d}" class="form-control input-xs iddeti" value="${data[d]['id']}" readonly="readonly">
                </tr>
              </thead>
            </table>
            `);
          }
        }
      },
      'json',
    );

    //semaforo de datos sujetos del vencimiento
    $.post(
      $('#id_url_ajax').val() + 'transporte/Consulta_Vencimiento',
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
    let Agencia = '';
    if (agenciaId === 1) {
      Agencia = 'Bogotá';
    } else if (agenciaId === 2) {
      Agencia = 'Cartagena';
    } else if (agenciaId === 4) {
      Agencia = 'Buenaventura';
    }

    $.post(
      $('#id_url_ajax').val() + 'transporte/Consultar_Precintos',
      'Agencia=' + Agencia,
      function (data) {
        if (data) {
          // console.log("🚀 ~ data:", data);
          precintosDisponibles = data; // guardar para uso posterior
          agregarFilaPrecinto(); // insertar la primera fila
        }
      },
      'json',
    );
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
      $('#id_url_ajax').val() + 'transporte/Tipo_Contenedor',
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
      $('#id_url_ajax').val() + 'transporte/Municipio_Contenedor',
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

//VALIDACIONES DEL BOTON GUARDAR
$('#Registrar_orden').click(function () {
  if (window.confirm('¿Deseas guardar la orden de cargue?')) {
    // Código a ejecutar si el usuario hace clic en "Aceptar"
    var msg_error = '';
    if (!$('#placao').val()) {
      msg_error += '<p>Debe diligenciar la <strong>Placa</strong> para registrar orden de cargue</p>';
      //$("#placao").focus().css('background-color','rgba(240, 230, 140,3)');
      AplicaFoco('#placao');
    } else {
      RemueveFoco('#placao');
    }
    //validar datos que trae la placa
    if (!$('#onom_conductor').val()) {
      msg_error += '<p>Debe diligenciar la <strong>Nombre conductor</strong> para registrar orden de cargue</p>';
      AplicaFoco('#onom_conductor');
    } else {
      RemueveFoco('#onom_conductor');
    }
    if (!$('#odocumento_conductor').val()) {
      msg_error += '<p>Debe diligenciar la <strong>Documento conductor</strong> para registrar orden de cargue</p>';
      AplicaFoco('#odocumento_conductor');
    } else {
      RemueveFoco('#odocumento_conductor');
    }
    //validar datos del cliente
    if (!$('#o_identificacion').val()) {
      msg_error += '<p>Debe diligenciar la <strong>Identificación del cliente</strong> para registrar orden de cargue</p>';
      AplicaFoco('#o_identificacion');
    } else {
      RemueveFoco('#o_identificacion');
    }
    if (!$('#o_cliente').val()) {
      msg_error += '<p>Debe diligenciar la <strong>Nombre del cliente</strong> para registrar orden de cargue</p>';
      AplicaFoco('#o_cliente');
    } else {
      RemueveFoco('#o_cliente');
    }
    if (!$('#o_direccioncl').val()) {
      msg_error += '<p>Debe diligenciar la <strong>Dirección del cliente</strong> para registrar orden de cargue</p>';
      AplicaFoco('#o_direccioncl');
    } else {
      RemueveFoco('#o_direccioncl');
    }
    if (!$('#o_telefono').val()) {
      msg_error += '<p>Debe diligenciar la <strong>Teléfono del cliente</strong> para registrar orden de cargue</p>';
      AplicaFoco('#o_telefono');
    } else {
      RemueveFoco('#o_telefono');
    }
    if (!$('#o_ciudad').val()) {
      msg_error += '<p>Debe diligenciar la <strong>Ciudad del cliente</strong> para registrar orden de cargue</p>';
      AplicaFoco('#o_ciudad');
    } else {
      RemueveFoco('#o_ciudad');
    }
    //validar datos des destinatario mínimo 1
    //validar datos del precinto
    let filas_precinto = $('#tabla_precintos').find('tbody tr').length;
    if (filas_precinto > 0) {
      $('.inumprecinto').each(function (index) {
        if (!$(this).val()) {
          msg_error += '<p>Debe diligenciar  <strong>Código precinto</strong> para registrar orden de cargue</p>';
          AplicaFoco('.inumprecinto');
        } else {
          RemueveFoco('.inumprecinto');
        }
      });
    }
    //validar datos generales
    if (!$('#o_producto').val()) {
      msg_error += '<p>Debe diligenciar  <strong>Producto</strong> para registrar orden de cargue</p>';
      AplicaFoco('#o_producto');
    } else {
      RemueveFoco('#o_producto');
    }
    if (!$('#o_empaque').val()) {
      msg_error += '<p>Debe diligenciar  <strong>Tipo empaque</strong> para registrar orden de cargue</p>';
      AplicaFoco('#o_empaque');
    } else {
      RemueveFoco('#o_empaque');
    }
    if (!$('#o_cantidad').val()) {
      msg_error += '<p>Debe diligenciar la <strong>o_cantidad</strong> para registrar orden de cargue</p>';
      AplicaFoco('#o_cantidad');
    } else {
      RemueveFoco('#o_cantidad');
    }
    if (!$('#o_volumen').val()) {
      msg_error += '<p>Debe diligenciar la <strong>o_volumen</strong> para registrar orden de cargue</p>';
      AplicaFoco('#o_volumen');
    } else {
      RemueveFoco('#o_volumen');
    }

    if (!$('#o_pesocarga').val()) {
      msg_error += '<p>Debe diligenciar  <strong>Peso carga</strong> para registrar orden de cargue</p>';
      AplicaFoco('#o_pesocarga');
    } else {
      RemueveFoco('#o_pesocarga');
    }
    if (parseFloat($('#o_pesocarga').val().replace(/,/g, '')) > parseFloat($('#o_pesocarro').val().replace(/,/g, ''))) {
      msg_error += '<p>No puede generar la orden de cargue ya que el <strong>Peso carga es mayor a la capacidad del vehículo</strong>.</p>';
    }
    //validar datos de contenedor
    if ($('#cnt_opcion').val() == 1) {
      if (!$('#o_conten2').val()) {
        msg_error += '<p>Debe diligenciar  <strong>N° contenedor 2</strong> para registrar orden de cargue</p>';
        AplicaFoco('#o_conten2');
      } else {
        RemueveFoco('#o_conten2');
      }
      if (!$('#cnt_tipocon2').val()) {
        msg_error += '<p>Debe diligenciar  <strong>Tipo Contenedor 2</strong> para registrar orden de cargue</p>';
        AplicaFoco('#cnt_tipocon2');
      } else {
        RemueveFoco('#cnt_tipocon2');
      }
      if (!$('#cnt_dias2').val()) {
        msg_error += '<p>Debe diligenciar  <strong>Fecha Vencimiento 2</strong> para registrar orden de cargue</p>';
        AplicaFoco('#cnt_dias2');
      } else {
        RemueveFoco('#cnt_dias2');
      }
      if (!$('#cnt_municipio2').val()) {
        msg_error += '<p>Debe diligenciar  <strong>Municipio Devolución 2</strong> para registrar orden de cargue</p>';
        AplicaFoco('#cnt_municipio2');
      } else {
        RemueveFoco('#cnt_municipio2');
      }
      if (!$('#cnt_direccion2').val()) {
        msg_error += '<p>Debe diligenciar  <strong>Dirección Devolución 2</strong> para registrar orden de cargue</p>';
        AplicaFoco('#cnt_direccion2');
      } else {
        RemueveFoco('#cnt_direccion2');
      }
      if (!$('#cnt_peso2').val()) {
        msg_error += '<p>Debe diligenciar  <strong>Peso Vacío 2(Kg)</strong> para registrar orden de cargue</p>';
        AplicaFoco('#cnt_peso2');
      } else {
        RemueveFoco('#cnt_peso2');
      }
    }
    if (!msg_error) {
      // Registro_orden();
      Registro_orden();
    } else {
      $('#msg_present').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
        msg_error +
        '</div></div>',
      );
      $('.panel-body').animate({ scrollTop: 0 }, 600);
    }
  } else {
    // Código a ejecutar si el usuario hace clic en "Cancelar"
    console.log('Operación Cancelada');
  }
});

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

  var numero_orden_cargue = 0;
  $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
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
    const response = await fetch($('#id_url_ajax').val() + 'transporte/Registro_orden', {
      method: 'POST',
      body: datos,
      cache: 'no-cache',
    });
    const data = await response.json();
    // console.log("Primera solicitud completada:", data);
    // return data;
    if (data.status == true) {
      msg_texto = 'Datos Registrados Exitosamente NEXOSAPP Orden N° ' + data.numero_documento;
      icon = 'check';
      color = 'success';
      pal = 'Proceso terminado';
      $('#msg_present').html(
        '<div role="alert" class="alert alert-' +
        color +
        ' alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-' +
        icon +
        '"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>' +
        pal +
        '!</strong> ' +
        msg_texto +
        '</div></div>',
      );
      $('.panel-body').animate({ scrollTop: 0 }, 100);
      // Crear_Dato_Oet(data.numero_documento);
      numero_orden_cargue = data.numero_documento;
      //setTimeout(function() { location.reload(false); }, 2000);
    } else if (data.status == false) {
      msg_texto = 'Datos No Registrados Exitosamente NEXOSAPP';
      icon = 'close';
      color = 'danger';
      pal = 'Proceso terminado';
      $('#msg_present').html(
        '<div role="alert" class="alert alert-' +
        color +
        ' alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-' +
        icon +
        '"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>' +
        pal +
        '!</strong> ' +
        msg_texto +
        '</div></div>',
      );
      $('.panel-body').animate({ scrollTop: 0 }, 3000);
      $('#Registrar_orden').css('display', 'none');
      setTimeout(function () {
        location.reload(false);
      }, 5000);
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    Crear_Dato_Oet(numero_orden_cargue);
  }
}

async function Crear_Dato_Oet(numero) {
  recurso = 1;
  // var paquete = "recurso=" + recurso + "&numero=" + numero;
  let paquete = new FormData();
  paquete.append('recurso', recurso);
  paquete.append('numero', numero);
  $('#loading-overlay-oet ').css('display', 'flex');
  try {
    const response = await fetch($('#id_url_ajax').val() + 'integrar_oet/Consulta_Transacciones', {
      method: 'POST',
      body: paquete,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data.status == true || data.status == 'true') {
      pal = 'Proceso terminado';
      msg_texto = 'Datos Registrados Exitosamente OET ' + data.id_orden;
      $('#msg_present').append(
        '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>' +
        pal +
        '! </strong>' +
        msg_texto +
        '</div></div>',
      );
      $('.panel-body').animate({ scrollTop: 0 }, 600);
      $('#Registrar_orden').css('display', 'none');
      setTimeout(function () {
        location.reload(false);
      }, 5000);
    } else if (data.status == false || data.status == 'false') {
      pal = 'Proceso terminado';
      msg_texto = 'Datos No Registrados Exitosamente OET ' + data.id_orden;
      $('#msg_present').append(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>' +
        pal +
        '! </strong>' +
        msg_texto +
        ' ' +
        data.error +
        '</div></div>',
      );
      $('.panel-body').animate({ scrollTop: 0 }, 600);
      $('#Registrar_orden').css('display', 'none');
      setTimeout(function () {
        location.reload(false);
      }, 5000);
    }
  } catch (error) {
    console.error('Error en la segunda solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    location.reload(true);
  }
}

// function agregarFilaPrecinto() {
//   conta++;

//   // Obtener los precintos ya seleccionados
//   const seleccionados = $('.iselectprecinto')
//     .map(function () {
//       return $(this).val();
//     })
//     .get();

//   // Filtrar los disponibles
//   const opcionesFiltradas = precintosDisponibles.filter(p => !seleccionados.includes(p.codigo_precinto));

//   if (opcionesFiltradas.length === 0) {
//     alert('Ya se han asignado todos los precintos disponibles.');
//     return;
//   }

//   // Generar las opciones
//   let opciones = '<option value="">-- Seleccione un precinto --</option>';
//   for (const p of opcionesFiltradas) {
//     opciones += `<option value="${p.codigo_precinto}">${p.codigo_precinto} (${p.tipo_precinto})</option>`;
//   }

//   // Select de precintos
//   const selectPrecinto = `
//     <select id="num_preci${conta}" class="form-control input-xs iselectprecinto">
//       ${opciones}
//     </select>
//   `;

//   // Select de tipo (puedes eliminarlo si ya viene en la opción)
//   const tipoSelect = `
//     <select id="tipopre${conta}" class="form-control input-xs ipretipo">
//       <option value="Botella">Botella</option>
//       <option value="Metalico" disabled>Metalico</option>
//       <option value="Plastico" disabled>Plastico</option>
//       <option value="Adhesivo">Adhesivo</option>
//       <option value="Correilla">Correilla</option>
//     </select>
//   `;

//   // Observación y botón
//   const observar = `<textarea id="sellos${conta}" class="form-control input-xs ipreobs"></textarea>`;
//   const eliminar = `
//     <button class="btn btn-danger btn-sm ps${conta}" onclick="delete_precinto(${conta})">
//       <i class="fa fa-trash"></i> Eliminar
//     </button>
//   `;

//   // Fila completa
//   const fila = `
//     <tr class="ps${conta}">
//       <td><strong>${conta}</strong><input type="hidden" id="sk${conta}" value="1"></td>
//       <td>${selectPrecinto}</td>
//       <td>${tipoSelect}</td>
//       <td class="text-center">${eliminar}</td>
//     </tr>
//   `;

//   $('#tabla_precintos tbody').append(fila);
// }

function agregarFilaPrecinto() {
  conta++;

  // Obtener precintos ya usados
  const seleccionados = $('.iselectprecinto')
    .map(function () {
      return $(this).val();
    })
    .get();

  // Filtrar disponibles
  const disponibles = precintosDisponibles.filter(p => !seleccionados.includes(p.codigo_precinto));

  if (disponibles.length === 0) {
    alert('Ya no hay más precintos disponibles.');
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

  $('#tabla_precintos tbody').append(fila);
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

