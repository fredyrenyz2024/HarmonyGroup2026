$(document).ready(function () {
  $.post(
    $("#id_url_ajax").val() + "tiempo_logistico_cargue/Seleccionar_Manifiesto",
    function (data) {
      if (data) {
        $("#manifiestos").html('<option value="">Seleccione</option>');
        for (var i = 0; i < data.length; i++) {
          $("#manifiestos").append('<option value="' + data[i]["id"] + '">Mani: ' + data[i]["id"] + " - " + data[i]["placa"] + "</option>");
        }
      }
    },
    "json",
  );

  $("#buscar_ordenes").click(function () {
    var mani = $("#manifiestos").val();
    var clasef = $("#clase_fecha").val();
    $("#clase_fecha_reg").val(clasef);
    if (mani != "" && clasef != "") {
      //buscar las ordendes de cargue que les falte registrar la fecha seleccionada con ese manifiesto
      $.post(
        $("#id_url_ajax").val() + "tiempo_logistico_cargue/Datos_Manifiesto",
        "manifi=" + mani,
        function (data) {
          if (data) {
            $("#c_mnfi").val(data["id"]);
            $("#c_placa").val(data["placa"]);
            $("#c_marca").val(data["marca"]);
            $("#c_color").val(data["color"]);
            $("#c_modelo").val(data["anio_fabricacion"]);
            $("#c_nomconductor").val(data["conductor"]);
            $("#c_docconductor").val(data["docconductor"]);
            $("#c_telefono").val(data["celular"]);
            $("#c_propietario").val(data["propietario"] + " " + data["apellido1"] + " " + data["apellido2"]);
            $("#c_docpropi").val(data["docpropietario"]);
          } else {
            $("#c_mnfi").val("");
            $("#c_placa").val("");
            $("#c_marca").val("");
            $("#c_color").val("");
            $("#c_modelo").val("");
            $("#c_nomconductor").val("");
            $("#c_docconductor").val("");
            $("#c_telefono").val("");
            $("#c_propietario").val("");
            $("#c_docpropi").val("");
          }
        },
        "json",
      );

      $.post(
        $("#id_url_ajax").val() + "tiempo_logistico_cargue/Ordenes_Cargue",
        "manifi=" + mani + "&fecha=" + clasef,
        function (data) {
          $("#tabla_ordenes").html("");
          if (data) {
            for (var i = 0; i < data.length; i++) {
              var check;
              check =
                '<input id="ch' +
                data[i]["id_orden"] +
                '"  class="chorden"  type="checkbox" data-id="' +
                data[i]["id_orden"] +
                '" data-id2=' +
                i +
                ' value="' +
                data[i]["id_orden"] +
                '" >';
              $("#tabla_ordenes").append(
                '<tr id="fil' +
                  i +
                  '">' +
                  "<td>" +
                  check +
                  "</td>" +
                  '<td><input type="text" class="form-control input-sm bg-light numorden" value="' +
                  data[i]["id_orden"] +
                  '" readonly="readonly"></td>' +
                  '<td><input type="text" class="form-control input-sm bg-light numremesa" value="' +
                  data[i]["idrem"] +
                  '" readonly="readonly"></td>' +
                  "<td>" +
                  data[i]["remite"] +
                  "</td>" +
                  "<td>" +
                  data[i]["destino"] +
                  "</td>" +
                  "<td>" +
                  data[i]["mer_producto"] +
                  "</td>" +
                  '<td><input type="text" id="fecregistro' +
                  data[i]["id_orden"] +
                  '" class="form-control input-sm bg-light fecregistro" value="' +
                  data[i]["fecha_cargue"] +
                  " " +
                  data[i]["hora_cargue"] +
                  '" readonly="readonly"></td>' +
                  "</tr>",
              );
              $("#id_cargue").val(data[i]["id_cargue"]);
            }
          } else {
            $("#tabla_ordenes").html("");
          }
        },
        "json",
      );
    }
  });

  $("#registrartiempo").click(function () {
    var msg_error = "";
    if (!$("#manifiestos").val()) {
      msg_error += "<p>Debe existir <strong>Manifiesto</strong> para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!$("#c_mnfi").val()) {
      msg_error += "<p>Debe existir <strong>Manifiesto</strong> para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!$("#c_placa").val()) {
      msg_error += "<p>Debe existir <strong>Placa</strong> para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!$("#c_marca").val()) {
      msg_error += "<p>Debe existir <strong>Marca</strong> para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!$("#c_color").val()) {
      msg_error += "<p>Debe existir <strong>Color</strong> para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!$("#c_modelo").val()) {
      msg_error += "<p>Debe existir <strong>Modelo</strong> para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!$("#c_nomconductor").val()) {
      msg_error += "<p>Debe existir <strong>Conductor</strong> para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!$("#c_docconductor").val()) {
      msg_error += "<p>Debe existir <strong>Documento Conductor</strong> para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!$("#c_telefono").val()) {
      msg_error += "<p>Debe existir <strong>Teléfono</strong> para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!$("#c_propietario").val()) {
      msg_error += "<p>Debe existir <strong>Propietario</strong> para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!$("#c_docpropi").val()) {
      msg_error += "<p>Debe existir <strong>Documento Propietario</strong> para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!$("#clase_fecha").val()) {
      msg_error += "<p>Debe existir <strong>Clase de Fecha</strong> para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!$("#fircargar").val()) {
      msg_error += "<p>Debe existir <strong>Fecha </strong>en tiempo logístco, para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!$("#hircargar").val()) {
      msg_error += "<p>Debe existir <strong>Hora</strong>en tiempo logístico para registrar los Tiempos Lógísticos de Cargue</p>";
    }

    /*$(".chorden").each(function(){ //Mínimo 1
			if(!$(".chorden").is('checked')){
				alert('DEBE SERLECCIONAR UN CHECKBOX');
			}
		});*/
    //validacion de fechas posteriores y 15 minutos
    $(".numorden").each(function (index) {
      var orden = $(this).val();
      //fecha capturada
      var feccaptura = $("#fircargar").val() + " " + $("#hircargar").val();
      if ($("#ch" + orden).is(":checked")) {
        $("#fecregistro" + orden).each(function (index) {
          var dateregistradora = $(this).val();
          var fcaptura2 = feccaptura + ":00";
          var registro = moment(dateregistradora);
          var captura = moment(fcaptura2);
          var tf = captura.diff(registro, "minutes");
          if (feccaptura <= dateregistradora) {
            msg_error +=
              "<p>La fecha capturada debe ser <strong> mayor </strong> a la fecha de registro en la orden: " +
              orden +
              ", para registrar los Tiempos Logísticos de Cargue</p>";
          }
          if (tf <= 15) {
            msg_error +=
              "<p>La fecha a registrar debe tener mínimo <strong> 15 minutos </strong> a la fecha de orden: " +
              orden +
              ", para registrar los Tiempos Lógísticos de Cargue</p>";
          }
        });
      }
    });
    if (!msg_error) {
      Registrar_Tiempo();
    } else {
      $("#msg_present").html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          "</div></div>",
      );
      $(".panel-body").animate({scrollTop: 2}, 600);
    }
  });
});

function Registrar_Tiempo() {
  var mnf = $("#manifiestos").val();
  $("#c_mnfi").val();
  var placa = $("#c_placa").val();
  var marca = $("#c_marca").val();
  var color = $("#c_color").val();
  var modelo = $("#c_modelo").val();
  var condu = $("#c_nomconductor").val();
  var doccondu = $("#c_docconductor").val();
  var telefono = $("#c_telefono").val();
  var propi = $("#c_propietario").val();
  var docpro = $("#c_docpropi").val();
  var clase = $("#clase_fecha").val();
  var fecha = $("#fircargar").val();
  var hora = $("#hircargar").val();
  var obs = $("#firobserva").val();
  var idcargar = $("#id_cargue").val();
  var arreglo = new Array();
  $(".chorden:checked").each(function () {
    var numero_orden = $(this).val();
    arreglo.push(numero_orden);
  });
  orden = arreglo;
  var paquete_dato =
    "manifi=" +
    mnf +
    "&placa=" +
    placa +
    "&fecha_c=" +
    fecha +
    "&hora_c=" +
    hora +
    "&obser=" +
    obs +
    "&num_ordenes=" +
    orden +
    "&idcargar=" +
    idcargar +
    "&clase=" +
    clase;
  $.post(
    $("#id_url_ajax").val() + "tiempo_logistico_cargue/Registro_Tiempos",
    paquete_dato,
    function (data) {
      if (data == "true") {
        alert("Datos Registrados Exitosamente!!");
        //$(location).prop('href','tiempo_logistico_cargue/editar_crear/?idmenu=5');
        location.reload();
      }
    },
    "json",
  );
}
