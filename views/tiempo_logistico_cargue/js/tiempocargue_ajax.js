$(document).ready(function () {
  //consultar manifiesto que tienen remesas pendientes por registrar time logistico
  $.post(
    $("#id_url_ajax").val() + "tiempo_logistico_cargue/Selecciona_Manifiesto",
    function (data) {
      if (data) {
        for (var m = 0; m < data.length; m++) {
          $("#manifiestos").append('<option value="' + data[m]["id"] + '">' + data[m]["id"] + " - " + data[m]["placa"] + "</option>");
        }
      } else {
        $("#manifiestos").html("");
      }
    },
    "json",
  );

  $("#manifiestos").change(function () {
    //datos del manifiesto
    var mnf = $("#manifiestos").val();
    $.post(
      $("#id_url_ajax").val() + "tiempo_logistico_cargue/Selecciona_Manifiesto_Individual",
      "manifiesto=" + mnf,
      function (data) {
        if (data) {
          $("#c_numnf").val(data["id"]);
          $("#c_placa").val(data["placa"]);
          $("#c_marca").val(data["marca"]);
          $("#c_color").val(data["color"]);
          $("#c_modelo").val(data["anio_fabricacion"]);
          $("#c_nomconductor").val(data["conductor"] + " " + data["conape1"] + " " + data["conape2"]);
          $("#c_docconductor").val(data["docconductor"]);
          $("#c_telefono").val(data["celular"]);
          $("#c_propietario").val(data["propietario"] + " " + data["apellido1"] + " " + data["apellido2"]);
          $("#c_docpropi").val(data["docpropietario"]);
        } else {
          $("#c_numnf").val("");
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

    //Ordenes
    $.post(
      $("#id_url_ajax").val() + "tiempo_logistico_cargue/Selecciona_Ordenes",
      "manifiesto=" + mnf,
      function (data) {
        $("#tabla_orden").html("");
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
            $("#tabla_orden").append(
              "<tr>" +
                '<td id="fil' +
                i +
                '">' +
                check +
                "</td>" +
                '<td id="fil' +
                i +
                '">' +
                data[i]["id_orden"] +
                "</td>" +
                '<td id="fil' +
                i +
                '">' +
                data[i]["idrem"] +
                "</td>" +
                '<td id="fil' +
                i +
                '">' +
                data[i]["remite"] +
                "</td>" +
                '<td id="fil' +
                i +
                '">' +
                data[i]["destino"] +
                "</td>" +
                '<td id="fil' +
                i +
                '">' +
                data[i]["mer_producto"] +
                "</td>" +
                "</tr>",
            );
          }
        }
      },
      "json",
    );

    //ID CARGUE TIEMPO LOGISTICO
    $.post(
      $("#id_url_ajax").val() + "tiempo_logistico_cargue/Selecciona_Idcargue",
      "manifiesto=" + mnf,
      function (data) {
        $("#idtablaprincipal").val("");
        if (data) {
          $("#idtablaprincipal").val(data["id"]);
        } else {
          $("#idtablaprincipal").val("");
        }
      },
      "json",
    );
  });

  $("#registrartiempo").click(function () {
    var msg_error = "";

    if (!$("#c_numnf").val()) {
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
    if ($("#tabla_orden tr").length == 0) {
      msg_error += "<p>Debe existir <strong>Mínimo una orden</strong> para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!$("#fircargar").val()) {
      msg_error += "<p>Debe existir <strong>Fecha de salida al cargue</strong> para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!$("#hircargar").val()) {
      msg_error += "<p>Debe existir <strong>Hora de salida al cargue</strong> para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!$(".chorden").prop("checked")) {
      msg_error += "<p>Debe Seleccionar <strong>mínimo 1 remesa</strong> para registrar los Tiempos Lógísticos de Cargue</p>";
    }
    if (!msg_error) {
      Registra_Tiempo();
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

function Registra_Tiempo() {
  var mnf = $("#c_numnf").val();
  var placa_v = $("#c_placa").val();
  var marca = $("#c_marca").val();
  var color = $("#c_color").val();
  var modelo = $("#c_modelo").val();
  var nomcondu = $("#c_nomconductor").val();
  var docondu = $("#c_docconductor").val();
  var telefono = $("#c_telefono").val();
  var propie = $("#c_propietario").val();
  var docpropi = $("#c_docpropi").val();

  var fircargar = $("#fircargar").val();
  var hircargar = $("#hircargar").val();
  var observair = $("#firobserva").val();
  var idprincipal = $("#idtablaprincipal").val();
  //traer ordenes seleccionadas
  var dato = {
    orden: [],
  };
  var arreglo = new Array();
  $(".chorden:checked").each(function () {
    var numero_orden = $(this).val();
    arreglo.push(numero_orden);
  });
  orden = arreglo;

  //construir paquete de datos
  paquete_tiempo =
    "manifieso=" +
    mnf +
    "&fircargar=" +
    fircargar +
    "&hircargar=" +
    hircargar +
    "&observair=" +
    observair +
    "&num_oden=" +
    orden +
    "&placa=" +
    placa_v +
    "&idtabla=" +
    idprincipal;

  $.post(
    $("#id_url_ajax").val() + "tiempo_logistico_cargue/Registro_Tiempo_Cargue",
    paquete_tiempo,
    function (data) {
      if (data == "true") {
        alert("Datos Registrados Exitosamente!!");
        //$(location).prop('href','tiempo_logistico_cargue/tiempo_cargue/?idmenu=5');
        location.reload();
      }
    },
    "json",
  );
}
