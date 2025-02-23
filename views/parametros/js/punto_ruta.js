$(document).ready(function () {
  punto_existente();

  $("#btn_crea").click(function () {
    $.post(
      $("#id_url_ajax").val() + "parametros/Consulta_Municipios",
      function (data) {
        if (data) {
          for (var z = 0; z < data.length; z++) {
            $("#municipio").append('<option value="' + data[z]["id"] + '">' + data[z]["municipio"] + " - " + data[z]["depto"] + "</option>");
          }
        }
      },
      "json",
    );
  });

  $("#btn_guadarpoint").click(function () {
    var msg_error = "";
    if (!$("#p_punto").val()) {
      msg_error += "<p>Debe diligenciar el campo <strong>Nombre Punto </strong> para poder crear el Plan de Ruta.</p>";
      AplicaFoco("#p_punto");
    } else {
      RemueveFoco("#p_punto");
    }
    if (!$("#municipio").val()) {
      msg_error += "<p>Debe diligenciar el campo <strong>Ubicación </strong> para poder crear el Plan de Ruta.</p>";
      AplicaFoco("#municipio");
    } else {
      RemueveFoco("#municipio");
    }
    if (!$("#p_descri").val()) {
      msg_error += "<p>Debe diligenciar el campo <strong>Descripción </strong> para poder crear el Plan de Ruta.</p>";
      AplicaFoco("#p_descri");
    } else {
      RemueveFoco("#p_descri");
    }
    if (!$("#latitud").val()) {
      msg_error += "<p>Debe diligenciar el campo <strong>Latitud </strong> para poder crear el Plan de Ruta.</p>";
      AplicaFoco("#latitud");
    } else {
      RemueveFoco("#latitud");
    }
    if (!$("#longitud").val()) {
      msg_error += "<p>Debe diligenciar el campo <strong>Longitud </strong> para poder crear el Plan de Ruta.</p>";
      AplicaFoco("#longitud");
    } else {
      RemueveFoco("#longitud");
    }
    if (!$("#tipo_punto").val()) {
      msg_error += "<p>Debe diligenciar el campo <strong>Tipo Punto </strong> para poder crear el Plan de Ruta.</p>";
      AplicaFoco("#tipo_punto");
    } else {
      RemueveFoco("#tipo_punto");
    }
    if (!msg_error) {
      crear_punto();
    } else {
      $("#msg_crear").html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          "</div></div>",
      );
      $("#crear_plan").animate({scrollTop: 0}, 600);
    }
  });

  $("#consulte").click(function () {
    var muni = $("#Punto").val();
    if (muni == "") {
      alert("Debe seleccionar una ubicación");
    } else {
      Consulta_tabla();
    }
  });

  $("#municipio").change(function () {
    var id_muni = $("#municipio").val();
    $.post(
      $("#id_url_ajax").val() + "parametros/Consulta_cordenadas",
      "id_muni=" + id_muni,
      function (data) {
        $("#latitud").val("");
        $("#longitud").val("");
        if (data) {
          $("#latitud").val(data["latitud"]);
          $("#longitud").val(data["longitud"]);
        }
      },
      "json",
    );
  });
});

function punto_existente() {
  $.post(
    $("#id_url_ajax").val() + "parametros/Consulta_Punto",
    function (data) {
      if (data) {
        for (var z = 0; z < data.length; z++) {
          $("#Punto").append('<option value="' + data[z]["id"] + '">' + data[z]["municipio"] + " - " + data[z]["depto"] + "</option>");
        }
      }
    },
    "json",
  );
}

function crear_punto() {
  var name_punto = $("#p_punto").val();
  var municipio = $("#municipio").val();
  var p_descri = $("#p_descri").val();
  var latitud = $("#latitud").val();
  var longitud = $("#longitud").val();
  var user = $("#user").val();
  var fecha = $("#fecha").val();
  var hora = $("#hora").val();
  var datos =
    "punto=" +
    name_punto +
    "&ubicacion=" +
    municipio +
    "&descrip=" +
    p_descri +
    "&latitud=" +
    latitud +
    "&longitud=" +
    longitud +
    "&user=" +
    user +
    "&fecha=" +
    fecha +
    "&hora=" +
    hora;
  $.post(
    $("#id_url_ajax").val() + "parametros/Registro_Punto",
    datos,
    function (data) {
      if (data == "true") {
        alert("Datos Registrados Exitosamente!!");
        location.reload();
      }
    },
    "json",
  );
}

function Consulta_tabla() {
  var munic = $("#Punto").val();
  $.post(
    $("#id_url_ajax").val() + "parametros/Consulta_puntos",
    "id_municipio=" + munic,
    function (data) {
      if (data) {
        for (var m = 0; m < data.length; m++) {
          var s, colour;
          if (data[m]["estado"] == 1) {
            s = "<center><span class='mdi mdi-dot-circle icon'></span></center>";
            colour = "class='nexos-txt-success'";
          }
          if (data[m]["estado"] == 0) {
            s = "<center><span class='mdi mdi-dot-circle icon'></span></center>";
            colour = "class='nexos-txt-danger'";
          }

          $("#cuerpo_tabla").append(
            "<tr>" +
              "<td " +
              colour +
              ">" +
              s +
              "</td><td>" +
              data[m]["municipio"] +
              "</td><td>" +
              data[m]["nom_punto"] +
              "</td>" +
              "<td>" +
              data[m]["latitud"] +
              " / " +
              data[m]["longitud"] +
              "</td><td></td>" +
              "</tr>",
          );
        }
      }
    },
    "json",
  );
}
