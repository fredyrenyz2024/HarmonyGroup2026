const d = document;
const w = window;
d.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  // alert("hola Mundo");
  Listar_origenes();
  Listar_destinos();
  Listar_clientes();
  Listar_conductores();

  d.addEventListener("click", async (e) => {
    if (e.target.matches("#btn_crear_filtro") || e.target.matches("#btn_crear_filtro *")) {
      // Obtener todos los elementos con la clase "campo"
      var $campos = d.querySelectorAll(".campo");
      // Crear la tabla
      var $tabla = d.createElement("table");
      $tabla.setAttribute("cellpadding", 0);
      $tabla.setAttribute("cellspacing", 0);
      $tabla.setAttribute("border", 0);
      $tabla.style.width = "100%";
      $tabla.style.borderCollapse = "collapse";

      // Crear el encabezado (thead) solo una vez
      var $thead = d.createElement("thead");
      $thead.style.backgroundColor = "#332D2D";
      $thead.style.color = "#FFFFFF";
      $thead.style.borderBottom = "1px #ddd solid";
      var $encabezado = d.createElement("tr");

      $manifiesto = d.getElementById("num_manifiesto").value;
      $remesa = d.getElementById("num_remesa").value;
      $placa = d.getElementById("num_placa").value;

      console.log($manifiesto);

      // Variable para rastrear si se encontró al menos un campo verificado
      var hayCampoVerificado = false;

      for (var j = 0; j < $campos.length; j++) {
        if ($campos[j].checked) {
          var $th = d.createElement("th");
          $th.textContent = $campos[j].value;
          $thead.style.width = "auto";
          $thead.style.whiteSpace = "nowrap";
          $thead.style.borderRight = "1px #ddd solid;";
          $encabezado.appendChild($th);

          if ($manifiesto !== "" && $manifiesto === $campos[j].value) {
            console.log("hola");
          } else {
          }

          // Marcar la variable como true si al menos un campo está verificado
          hayCampoVerificado = true;
        }
      }

      // Mostrar el mensaje del else solo si no hay campos verificados
      if (!hayCampoVerificado) {
        // console.log("solo cuando todos están vacíos");
        $mensaje = `
          <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role = "alert">
            <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
            <div class="message">
              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Mensaje!</strong> Debe seleccionar minimo un elmento de los campos para crear el informe
            </div>
          </div>
        `;
        d.getElementById("msg_present").innerHTML = $mensaje;
      }

      $thead.appendChild($encabezado);
      $tabla.appendChild($thead);

      // Crear las filas (tbody)
      var $tbody = d.createElement("tbody");
      for (let i = 0; i < $campos.length; i++) {
        if ($campos[i].checked) {
          var $fila = d.createElement("tr");
          var $celda = d.createElement("td");

          $tbody.appendChild($fila);
        }
      }
      $tabla.appendChild($tbody);

      // Obtener el contenedor y agregar la tabla
      var contenedorTabla = d.getElementById("tabla_filtrada");
      contenedorTabla.appendChild($tabla);
    }
  });
});

function Listar_origenes() {
  $("#origen").html('<option value="">Seleccionar origen</option>');
  $.ajax({
    url: $("#id_url_ajax").val() + "informe/Listar_origen",
    type: "POST",
    // data: dato1s,
    dataType: "json",
    success: function (data) {
      if (data) {
        data.forEach(function (element, index) {
          $("#origen").append(`<option value="${element.id}">${element.municipio + " - " + element.depto}</option>`);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("no cargo el select");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function Listar_destinos() {
  $("#destino").html('<option value="">Seleccionar destino</option>');
  $.ajax({
    url: $("#id_url_ajax").val() + "informe/Listar_destino",
    type: "POST",
    // data: dato1s,
    dataType: "json",
    success: function (data) {
      if (data) {
        data.forEach(function (element, index) {
          $("#destino").append(`<option value="${element.id}">${element.municipio + " - " + element.depto + " - " + element.apellido1}</option>`);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("no cargo el select");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function Listar_clientes() {
  $("#cliente").html('<option value="">Seleccionar cliente</option>');
  $.ajax({
    url: $("#id_url_ajax").val() + "informe/Listar_cliente",
    type: "POST",
    // data: dato1s,
    dataType: "json",
    success: function (data) {
      if (data) {
        data.forEach(function (element, index) {
          $("#cliente").append(`<option value="${element.id}">${element.documento + " - " + element.nombre}</option>`);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("no cargo el select");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function Listar_conductores() {
  $("#conductor").html('<option value="">Seleccionar conductor</option>');
  $.ajax({
    url: $("#id_url_ajax").val() + "informe/Listar_conductor",
    type: "POST",
    // data: dato1s,
    dataType: "json",
    success: function (data) {
      if (data) {
        data.forEach(function (element, index) {
          $("#conductor").append(`<option value="${element.conductor_id}">${element.numero_documento + " - " + element.nombre}</option>`);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("no cargo el select");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
