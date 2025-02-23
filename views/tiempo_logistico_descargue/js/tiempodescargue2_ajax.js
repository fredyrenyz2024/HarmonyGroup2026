$(document).ready(function () {
  //traer las remesas que tienen fecha de llegada registrada
  $.post(
    $("#id_url_ajax").val() + "tiempo_logistico_descargue/Manifiesto_Remesa",
    function (data) {
      if (data) {
        $("#manifiestos").html('<option value="">Seleccione</option>');
        for (var i = 0; i < data.length; i++) {
          $("#manifiestos").append('<option value="' + data[i]["id"] + '">Mani: ' + data[i]["id"] + " - " + data[i]["placa"] + "</option>");
        }
      } else {
        $("#manifiestos").html('<option value="">Seleccione</option>');
      }
    },
    "json",
  );

  $("#buscar_remesas").click(function () {
    //consultar Manifiesto
    var mani = $("#manifiestos").val();
    var clasef = $("#clase_fecha").val();
    $("#clase_fecha_reg").val(clasef);
    if (mani != "" && clasef != "") {
      $.post(
        $("#id_url_ajax").val() + "tiempo_logistico_descargue/Datos_Manifiesto",
        "manifi=" + mani,
        function (data) {
          if (data) {
            $("#c_mnfi").val(data["id"]);
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
        $("#id_url_ajax").val() + "tiempo_logistico_descargue/Consulta_Remesas",
        "manifi=" + mani + "&tipfecha=" + clasef,
        function (data) {
          $("#tabla_reme").html("");
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
                ' value="' +
                data[i]["idrem"] +
                '" >';
              $("#tabla_reme").append(
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
              $("#id_descargue").val(data[i]["id_descargue"]);
            }
          } else {
            $("#tabla_reme").html("");
          }
        },
        "json",
      );
    }
  });

  $("#registrartiempo").click(function () {
    var msg_error = "";
    if (!$("#manifiestos").val()) {
      msg_error += "<p>Debe existir <strong>Manifiesto</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#c_placa").val()) {
      msg_error += "<p>Debe existir <strong>Placa</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#c_marca").val()) {
      msg_error += "<p>Debe existir <strong>Marca</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#c_color").val()) {
      msg_error += "<p>Debe existir <strong>Color</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#c_modelo").val()) {
      msg_error += "<p>Debe existir <strong>Modelo</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#c_nomconductor").val()) {
      msg_error += "<p>Debe existir <strong>Nombre Conductor</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#c_docconductor").val()) {
      msg_error += "<p>Debe existir <strong>Documento Conductor</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#c_telefono").val()) {
      msg_error += "<p>Debe existir <strong>Teléfono</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#c_propietario").val()) {
      msg_error += "<p>Debe existir <strong>Propietario</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#c_docpropi").val()) {
      msg_error += "<p>Debe existir <strong>Documento Propietario</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#fechareg").val()) {
      msg_error += "<p>Debe existir <strong>Fecha</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#horareg").val()) {
      msg_error += "<p>Debe existir <strong>Hora</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }
    if (!$("#id_descargue").val()) {
      msg_error += "<p>Debe existir <strong>Id tiempo</strong> para registrar los Tiempos Lógísticos de Descargue</p>";
    }

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
  var manifi = $("#c_mnfi").val();
  var placa = $("#c_placa").val();
  var marca = $("#c_marca").val();
  var color = $("#c_color").val();
  var model = $("#c_modelo").val();
  var condu = $("#c_nomconductor").val();
  var doccondu = $("#c_docconductor").val();
  var tel = $("#c_telefono").val();
  var propi = $("#c_propietario").val();
  var docpropi = $("#c_docpropi").val();
  var tipo_fec = $("#clase_fecha_reg").val();
  var fecha = $("#fechareg").val();
  var hora = $("#horareg").val();
  var observa = $("#observareg").val();
  var idprincipal = $("#id_descargue").val();
  var arreglo = new Array();
  $(".chorden:checked").each(function () {
    var numero_remesa = $(this).val();
    arreglo.push(numero_remesa);
  });
  remesa = arreglo;
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
    "&tipo_fecha=" +
    tipo_fec +
    "&idtabla=" +
    idprincipal +
    "&remesas=" +
    remesa;
  $.post(
    $("#id_url_ajax").val() + "tiempo_logistico_descargue/Registro_Tiempos_Salida",
    paquete,
    function (data) {
      if (data == "true") {
        alert("Registro Datos Exitosamente!!");
        //$(location).prop('href','tiempo_logistico_descargue/editar_crear/?idmenu=5');
        location.reload();
      }
    },
    "json",
  );
}
