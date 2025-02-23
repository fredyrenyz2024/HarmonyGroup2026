$(document).ready(function () {
  $(".divcliente").hide();
  $(".divfechas").hide();
  $("#contenedor_datos").hide();

  $("#filtro").change(function () {
    $(".divcliente").hide();
    $(".divfechas").hide();
    $("#contenedor_datos").hide();
    $("#valor_campo").val('');
    var filtro = $("#filtro").val();
    if (filtro == 1) {//fecha
      $(".divfechas").show();
    } else if (filtro == 2 || filtro == 3) {//placa
      $(".divcliente").show();
    } else if (filtro == '') {
      $(".divfechas").hide();
      $(".divcliente").hide();
      $("#valor_campo").val('');
    }
  });

  $("#buscar_subasta").click(function () {
    var msg_error = "";
    var filtro = $("#filtro").val();
    if (filtro == 1 && !$("#finicial").val()) {
      alert('Por favor ingresar la fecha');
      msg_error += "<p>Debe diligenciar el campo <strong>Fecha</strong> para poder generar consulta.</p>";
    } else if (filtro == 2 && !$("#valor_campo").val()) {
      msg_error += "<p>Debe diligenciar el campo <strong>valor (placa)</strong> para poder generar consulta.</p>";

    } else if (filtro == 3 && !$("#valor_campo").val()) {
      msg_error += "<p>Debe diligenciar el campo <strong>valor (número de subasta)</strong> para poder generar consulta.</p>";
    }
    if (!msg_error) {
      Consulta_Subasta();
    } else {
      $(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
      $(".panel-bodya").animate({ scrollTop: 0 }, 600);
      $("#body_table").html('');
    }
  });



});

function Consulta_Subasta() {
  $("#contenedor_datos").hide();
  $("#tabla_datos").show();
  var filtro = $("#filtro").val();
  var datos_enviar = '';
  if (filtro == 1) {//fecha
    datos_enviar = 'tipo=1&valor=' + $("#finicial").val();
  }
  if (filtro == 2) {//placa
    datos_enviar = 'tipo=2&valor=' + $("#valor_campo").val();
  }
  if (filtro == 3) {//subasta
    datos_enviar = 'tipo=3&valor=' + $("#valor_campo").val();
  }
  $.post($("#id_url_ajax").val() + 'sac_subasta/Consultar_subasta', datos_enviar, function (data) {
    if (data) {
      $("#body_table").html('');
      for (var v = 0; v < data.length; v++) {
        var btnconsulta = '';
        btnconsulta = '<button class="btn btn-space btn-secondary btn-sm mdi mdi-edit" title="Gestionar Subasta" onClick="Consulta_detalle(' + data[v]['id'] + ')"></button>';

        $("#body_table").append(
          '<tr>' +
          '<td>' + data[v]['id'] + '</td>' +
          '<td>' + data[v]['fecha'] + ' - ' + data[v]['hora'] + '</td>' +
          '<td>' + data[v]['placa'] + '</td>' +
          '<td>' + data[v]['conductor'] + '</td>' +
          '<td>' + data[v]['estado'] + '</td>' +
          '<td>' + btnconsulta + '</td>' +
          '</tr>'
        );
      }
    }
  }, 'json');
}


function Consulta_detalle(id_subasta) {
  $("#contenedor_datos").show();
  $("#tabla_datos").hide();
  //consultar todas las solicitudes
  $.post($("#id_url_ajax").val() + 'sac_subasta/Consultar_detalle_subasta', 'id_subasta=' + id_subasta, function (data) {
    if (data) {
      $("#detalle_cabeza").html('');
      $("#detalle_cuerpo").html('');
      $("#detalle_total").html('');
      let input = '<label>Ajusta</label> <select id="aprobartarifa" class="form-control input-xs"  onchange="cambia_tarifa();"><option value="">Select</option></select>';
      let input2 = '<label>Acepta</label> <select id="aprobarflete" class="form-control input-xs" onchange="cambia_flete();"><option value="">Select</option><option value="1" title="Permite ajustar la tarifa">Si</option><option value="0" title="Envía su respuesta a operaciones y les permite modificar el valor del Flete">No</option></select>';
      let placa = '';
      let conductor = '';
      let flete_final = '';
      let tarifa_final = '';
      let flete_op = '';
      let res = 0;
      let rent = 0;
      let boton = '';

      for (var m = 0; m < data.length; m++) {

        if (data[m]['estadoflete'] == 'pendiente_aprobacion') {
          //calcula utilidad
          let valor = (data[m]['tarifa_promedio']).replace(/,/g, "");
          let f = (data[m]['flete_propuesto']).replace(/,/g, "");
          resta = (parseFloat(valor) - parseFloat(f));
          calculo = (parseFloat(resta) / parseFloat(valor));
          res = (parseFloat(calculo) * 100);
          res = res.toFixed(2);
          //calcula rentabilidad
          rent = (parseFloat(valor) - parseFloat(f));
          //totales
          placa = data[m]['placa'];
          conductor = data[m]['conductor'];
          flete_final = data[m]['flete_suma'];
          tarifa_final = data[m]['tarifa_promedio'];
          flete_op = data[m]['flete_propuesto'];
          $("#idpareja").val(data[m]['parejaorigen']);
          boton = '<button id="guardar_aprobacion" class="btn-xs btn btn-success"  onclick="guarda_respuesta(' + id_subasta + ')">Guardar</button>'
        }

        $("#detalle_cabeza").html('<tr><td class="cell-detail"><span>Subasta</span><span class="cell-detail-description">' + data[m]['id_suba'] + '</span></td>' +
          '<td class="cell-detail"> <span>Vehículo</span> <span class="cell-detail-description">' + placa + '</span>  </td>' +
          '<td class="cell-detail"> <span>Conductor</span> <span class="cell-detail-description">' + conductor + '</span></td>' +
          '</tr>');

        $("#detalle_cuerpo").append('<tr><td>' + data[m]['nombre_cliente'] + '</td><td>' + data[m]['numer_solservicio'] + '</td> <td>' + data[m]['flete_individual'] + '</td>  <td>' + data[m]['total_tarifa'] + '</td> </tr>');

        $("#detalle_total").html('<tr><td> <input type="text" id="flete_propuesto" class="form-control input-xs" value="' + flete_op + '" readonly="readonly"></td><td><input type="text" id="" class="form-control input-xs" value="' + flete_final + '" readonly="readonly"></td> <td> <input type="text" id="tarifa_final" class="" value="' + tarifa_final + '"  onchange="tarifa_final(' + flete_op + ');"></td> ' +
          ' <td> <label>Utilidad </label><input type="text" id="utilidad" class="form-control-xs" value="' + res + '" readonly="readonly">  <label>Rentabilidad </label> <input type="text" id="rentabilidad" class="form-control-xs" value="' + rent + '" readonly="readonly"> </td></tr>');

        $("#detalle_accion").html('<tr><td>' + input2 + '</td><td>' + input + '</td><td>' + boton + '</td></tr>');
        $("#aprobartarifa").prop('disabled', true);
        $("#utilidad").prop('disabled', true);
        $("#rentabilidad").prop('disabled', true);
        $("#tarifa_final").prop('disabled', true);
      }


    } else {
      alert('no hay datos');
    }
  }, 'json');
  //consultar la solciitud ganadora

}

function cambia_flete() {
  $("#aprobartarifa").html('');
  var select_flete = $("#aprobarflete").val();
  if (select_flete == 1) {
    $("#aprobartarifa").html('<option value="0">No</option>' +
      '<option value="1">Si</option>');
    $("#aprobartarifa").prop('disabled', false);
  }
  if (select_flete == 0) {
    $("#aprobartarifa").html('<option value="">Select</option>');
    $("#aprobartarifa").prop('disabled', true);
  }
}

function cambia_tarifa() {
  var select_tarifa = $("#aprobartarifa").val();
  if (select_tarifa == 1) {
    $("#tarifa_final").prop('disabled', false);
  }
  if (select_tarifa == 0) {
    $("#tarifa_final").prop('disabled', true);
  }
}

function tarifa_final(fleteop) {//recalcula utilidad y rentabilidad
  let valor = ($("#tarifa_final").val()).replace(/,/g, "");
  let f = fleteop;
  resta = (parseFloat(valor) - parseFloat(f));
  calculo = (parseFloat(resta) / parseFloat(valor));
  res = (parseFloat(calculo) * 100);
  res = res.toFixed(2);
  //calcula rentabilidad
  rent = (parseFloat(valor) - parseFloat(f));
  $("#utilidad").val(res);
  $("#rentabilidad").val(rent);
}

function guarda_respuesta(id_subasta) {

  flete_propu = $("#flete_propuesto").val();
  tarifa_pro = $("#tarifa_final").val();
  utilidad = $("#utilidad").val();
  rentabili = $("#rentabilidad").val();
  id_pareja = $("#idpareja").val();
  //idsubasta
  subasta = id_subasta;
  rta = $("#aprobarflete").val();
  estado_tarifa = $("#aprobartarifa").val();

  if (rta == 0) {//no acepta flete
    var datos = 'flete=' + flete_propu + '&tarifa=' + tarifa_pro + '&utilidad=' + utilidad + '&rentabilidad=' + rentabili + '&subasta=' + subasta + '&rta=' + rta;
    //1 movimiento flete 
    $.post($("#id_url_ajax").val() + 'sac_subasta/Respuesta_Flete', datos, function (data) {
      if (data == "true") {
        var msg_rta = '<p>Registro Exitosamente Los Dstos!!</p>';
        $(".nexos-messages").html('<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Respuesta!</strong>' + msg_rta + '</div></div>');
        $(".panel-bodya").animate({ scrollTop: 0 }, 600);
      } else {
        $(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
        $(".panel-bodya").animate({ scrollTop: 0 }, 600);
      }
      $("#body_table").html('');
      $("#contenedor_datos").hide();
      $("#tabla_datos").show();
    }, 'json');
  }
  if (rta == 1) {//acepta flete y registra tarifa
    var datos = 'flete=' + flete_propu + '&tarifa=' + tarifa_pro + '&utilidad=' + utilidad + '&rentabilidad=' + rentabili + '&subasta=' + subasta + '&rta=' + rta + '&idpareja=' + id_pareja + '&estadotarifa=' + estado_tarifa;
    //2 movimientos flete y tarifa 
    $.post($("#id_url_ajax").val() + 'sac_subasta/Respuesta_Completa', datos, function (data) {
      if (data == "true") {
        var msg_rta = '<p>Registro Exitosamente Los Dstos!!</p>';
        $(".nexos-messages").html('<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Respuesta!</strong>' + msg_rta + '</div></div>');
        $(".panel-bodya").animate({ scrollTop: 0 }, 600);

      } else {
        $(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
        $(".panel-bodya").animate({ scrollTop: 0 }, 600);
      }
      $("#body_table").html('');
      $("#contenedor_datos").hide();
      $("#tabla_datos").show();
    }, 'json');
  }
}