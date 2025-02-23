$(document).ready(function () {
  $.post(
    $("#id_url_ajax").val() + "tiempo_logistico_descargue/Selecciona_Manifiesto_descargue",
    function (data) {
      if (data) {
        for (var m = 0; m < data.length; m++) {
          $("#manifiestos").append('<option value="' + data[m]["id"] + '">' + data[m]["id"] + " " + data[m]["placa"] + "</option>");
        }
      } else {
        $("#manifiestos").html("");
      }
    },
    "json",
  );

  $("#manifiestos").change(function () {
    var num_mani = $("#manifiestos").val();
    $.post(
      $("#id_url_ajax").val() + "tiempo_logistico_descargue/Selecciona_Manifiesto_Individual",
      "manifiesto=" + num_mani,
      function (data) {
        if (data) {
          $("#d_numnf").val(data["id"]);
          $("#d_placa").val(data["placa"]);
          $("#d_marca").val(data["marca"]);
          $("#d_color").val(data["color"]);
          $("#d_modelo").val(data["anio_fabricacion"]);
          $("#d_nomconductor").val(data["conductor"] + " " + data["apellido1"] + " " + data["apellido2"]);
          $("#d_docconductor").val(data["docconductor"]);
          $("#d_telefono").val(data["celular"]);
          $("#d_propietario").val(data["propietario"]);
          $("#d_docpropi").val(data["docpropietario"]);
        } else {
          $("#d_numnf").val("");
          $("#d_placa").val("");
          $("#d_marca").val("");
          $("#d_color").val("");
          $("#d_modelo").val("");
          $("#d_nomconductor").val("");
          $("#d_docconductor").val("");
          $("#d_telefono").val("");
          $("#d_propietario").val("");
          $("#d_docpropi").val("");
        }
      },
      "json",
    );

    $.post(
      $("#id_url_ajax").val() + "tiempo_logistico_descargue/Remesas",
      "manifi=" + num_mani,
      function (data) {
        $("#tabla_remesas").html("");
        if (data) {
          for (var i = 0; i < data.length; i++) {
            var check;
            check =
              '<input id="ch' +
              data[i]["idrem"] +
              '"  class="chorden"  type="checkbox" data-id="' +
              data[i]["idrem"] +
              '" data-id2=' +
              i +
              ' data-id3="' +
              data[i]["id_llegada"] +
              '" value="' +
              data[i]["idrem"] +
              '" >';

            $("#tabla_remesas").append(
              "<tr>" +
                "<td>" +
                check +
                "</td>" +
                "<td>" +
                data[i]["idrem"] +
                "</td>" +
                "<td>" +
                data[i]["id_orden"] +
                "</td>" +
                "<td>" +
                data[i]["remite"] +
                "</td>" +
                "<td>" +
                data[i]["destino"] +
                "</td>" +
                "<td>" +
                data[i]["mer_producto"] +
                "</td>" +
                "</tr>",
            );
            $("#id_cargue").val(data[i]["id_cargue"]);
          }
        } else {
          $("#tabla_remesas").html("");
        }
      },
      "json",
    );

    //ID tabla principal
    $.post(
      $("#id_url_ajax").val() + "tiempo_logistico_descargue/Id_Principal",
      "manifiesto=" + num_mani,
      function (data) {
        $("#idprincipal").val("");
        if (data) {
          $("#idprincipal").val(data["id"]);
        } else {
          $("#idprincipal").val("");
        }
      },
      "json",
    );
  });

  $("#registrartiempo").click(function () {
    var msg_error = "";
    if (!$("#d_numnf").val()) {
      msg_error += "<p>Debe existir <strong>Manifiesto</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#d_placa").val()) {
      msg_error += "<p>Debe existir <strong>Placa</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#d_marca").val()) {
      msg_error += "<p>Debe existir <strong>Marca</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#d_color").val()) {
      msg_error += "<p>Debe existir <strong>Color</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#d_modelo").val()) {
      msg_error += "<p>Debe existir <strong>Modelo</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#d_nomconductor").val()) {
      msg_error += "<p>Debe existir <strong>Conductor</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#d_docconductor").val()) {
      msg_error += "<p>Debe existir <strong>Documento Conductor</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#d_telefono").val()) {
      msg_error += "<p>Debe existir <strong>Teléfono Conductor</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#d_propietario").val()) {
      msg_error += "<p>Debe existir <strong>Propietario</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#d_docpropi").val()) {
      msg_error += "<p>Debe existir <strong>Documento Propietario</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#firdescargar").val()) {
      msg_error += "<p>Debe existir <strong>Fecha de llegada</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#hirdescargar").val()) {
      msg_error += "<p>Debe existir <strong>Hora de llegada</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if ($("#tabla_remesas tr").length == 0) {
      msg_error += "<p>Debe existir <strong>mínimo 1 remesa</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }

    if (!$(".chorden").prop("checked")) {
      msg_error += "<p>Debe Seleccionar <strong>mínimo 1 remesa</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }

    if (!msg_error) {
      Registrar_Fecha();
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

function Registrar_Fecha() {
  var manifi = $("#d_numnf").val();
  var placa = $("#d_placa").val();
  var marca = $("#d_marca").val();
  var color = $("#d_color").val();
  var modl = $("#d_modelo").val();
  var condu = $("#d_nomconductor").val();
  var doccondu = $("#d_docconductor").val();
  var tele = $("#d_telefono").val();
  var propi = $("#d_propietario").val();
  var docpro = $("#d_docpropi").val();
  var fecha = $("#firdescargar").val();
  var hora = $("#hirdescargar").val();
  var observa = $("#firobservades").val();
  var idprincipal = $("#idprincipal").val();
  var array = new Array();
  var array2 = new Array();
  $(".chorden:checked").each(function () {
    var numero_orden = $(this).val();
    var idllega = $(this).attr("data-id3");
    array.push(numero_orden);
    array2.push(idllega);
  });
  reme = array;
  llegada = array2;

  var paquete =
    "manifi=" +
    manifi +
    "&placa=" +
    placa +
    "&fecha=" +
    fecha +
    "&hora=" +
    hora +
    "&observa=" +
    observa +
    "&remesas=" +
    reme +
    "&idtabla=" +
    idprincipal +
    "&llegada=" +
    llegada;

  $.post(
    $("#id_url_ajax").val() + "tiempo_logistico_descargue/Registro_Tiempo_Descargue",
    paquete,
    function (data) {
      if (data == "true") {
        alert("Datos Registrados Exitosamente!!");
        //$(location).prop('href','tiempo_logistico_descargue/tiempo_descargue/?idmenu=5');
        location.reload();
      }
    },
    "json",
  );
}
