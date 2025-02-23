const d = document;
const w = window;

d.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
});

function consecutivo_plan() {
  var maestro_detalle = {
    action: "maestro_detalle_ruta",
  };
  $.ajax({
    url: url,
    type: "POST",
    data: maestro_detalle,
    dataType: "json",
    success: function (data) {
      if (data.result != null) {
        data.result.forEach(function (element, index) {
          consecutivo = element.numero_actual;
          crear_plan(consecutivo);
        });
      } else {
        alert("null");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("no consulto maestro");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function crear_plan(id) {
  var data = null;
  data = new FormData();
  // data.append("accion", 'crear_plan');
  var i = 0;
  for (i = 1; i <= contador_global1; i++) {
    var punto = $("#p_punto" + i + "").val();
    var city = $("#p_ciudad" + i + "").val();
    var tiempo = $("#p_tiempo" + i + "").val();
    var orden = $("#orden" + i + "").val();
    var descri = $("#p_descri" + i + "").val();
    var tpunto = $("#tp" + i + "").val();
    var latitud = $("#latitud" + i + "").val();
    var longitud = $("#longitud" + i + "").val();
    var kilometro = $("#p_km" + i + "").val();

    data.append("ciudad", city);
    data.append("name_punto", punto);
    data.append("tiempo", tiempo);
    data.append("orden", orden);
    data.append("descri", descri);
    data.append("tipo_punto", tpunto);
    data.append("latitud", latitud);
    data.append("longitud", longitud);
    data.append("kilometros", kilometro);
    data.append("cab", $("#cab").val(5));
    data.append("punto", $("#puntos").val());
    data.append("fin", 9);

    data.append("id_ruta", $("#r_id").val());
    data.append("cod_plan", id);
    data.append("name_plan", $("#p_planname").val());
    data.append("detallep", $("#p_planob").val());
    data.append("fplan", $("#p_fechac").val());
    data.append("hplan", $("#p_horac").val());
    data.append("uplan", $("#p_userc").val());
    data.append("cab", $("#cab").val());
    data.append("fin", 9);
    data.append("cab", $("#cab").val());
    data.append("fin", 9);
  }

  // var contador_final = contador_global1 + 1;
  // if ($("#ordenfinal").val() == contador_final) {}
  data.append("puntofinal", $("#p_puntofinal").val());
  data.append("tiempofinal", $("#p_tiempofinal").val());
  data.append("descripfinal", $("#p_descrifinal").val());
  data.append("kmfinal", $("#p_kmfinal").val());
  data.append("ordenfinal", $("#ordenfinal").val());
  data.append("tpfinal", $("#tpfinal").val());
  data.append("latitudfinal", $("#latitudfinal").val());
  data.append("longifinal", $("#longitudfinal").val());
  data.append("ubicacion", $("#p_ciudadfinal").val());
  data.append("cab", $("#cab").val(5));
  data.append("punto", $("#puntos").val(5));
  data.append("fin", 3);

  fetch($("#id_url_ajax").val() + "planrutaController/Crear_Plan", {
    method: "POST",
    body: data,
    cache: "no-cache",
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then(function (data) {
      if (data.numero === 200) {
        mensaje = `
      <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><span class="mdi mdi-check"></span></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
            <strong>Mensaje!</strong> ${data.mensaje}
          </div>
      </div>`;
        // alert(data['mensaje']);
        $("#crea_vehiculopreestudio").modal("hide");
        Filtro();
        Limpiarmodal();
        Ocultarbloque();
      } else {
        mensaje = `
      <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><span class="mdi mdi-info-outline"></span></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
            <strong>Mensaje!</strong> ${data.mensaje}
          </div>
      </div>`;
        // alert("error");
      }
      d.getElementById("historicos").innerHTML = mensaje;
    })
    .catch((error) => {
      alert(error);
    });

  //refrescar pagina
  // alert('Ok!!Plan Registrado Exitosamente!!');
  // location.reload();
}
