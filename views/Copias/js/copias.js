const d = document;
const w = window;
d.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  programarTareas();
  Listar_copias();
  d.addEventListener("click", async (e) => {
    if (e.target.matches("#btn_crear_copia") || e.target.matches("#btn_crear_copia *")) {
      d.getElementById("cargando_gif").style.display = "Block";
      d.getElementById("btn_crear_copia").style.display = "none";
      ejecutarTarea();
    }
  });
});

async function ejecutarTarea() {
  console.log("Tarea ejecutada a las 12:00 PM, 6:00 PM o 12:00 AM");
  // Agrega aquí el código que deseas ejecutar en esos horarios.
  await fetch($("#id_url_ajax").val() + "copias/Crear_copias_mysql", {
    method: "POST",
    cache: "no-cache",
    // body: data,
  })
    .then((response) => response.json())
    .then(function (data) {
      let mensaje = "";
      if (data.numero === 400) {
        d.getElementById("cargando_gif").style.display = "none";
        d.getElementById("btn_crear_copia").style.display = "block";
        mensaje = `
        <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
            <div class="icon"><span class="mdi mdi-info-outline"></span></div>
            <div class="message">
              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Mensaje!</strong> ${data.mensaje}
            </div>
        </div>`;
        Listar_copias();
      } else if (data.numero === 200) {
        d.getElementById("cargando_gif").style.display = "none";
        d.getElementById("btn_crear_copia").style.display = "block";
        mensaje = `
        <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
            <div class="icon"><span class="mdi mdi-check"></span></div>
            <div class="message">
              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Mensaje!</strong> ${data.mensaje}
            </div>
        </div>`;
        Listar_copias();
      } else {
        d.getElementById("cargando_gif").style.display = "none";
        d.getElementById("btn_crear_copia").style.display = "block";
        mensaje = `
        <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
            <div class="icon"><span class="mdi mdi-info-outline"></span></div>
            <div class="message">
              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Mensaje!</strong> Este vehículo con placa <strong>Texto</strong> no se encuentra creado en el sistema, solicitar prefiltro para su creación.
            </div>
        </div>`;
        Listar_copias();
      }
      d.getElementById("historico").innerHTML = mensaje;
    })
    .catch((error) => {
      d.getElementById("cargando_gif").style.display = "none";
      d.getElementById("btn_crear_copia").style.display = "block";
      alert(JSON.stringify(error));
    });
}

function programarTareas() {
  const now = new Date();
  const mediodia = new Date(now);
  mediodia.setHours(12, 0, 0, 0);

  const tarde = new Date(now);
  tarde.setHours(18, 0, 0, 0);

  const medianoche = new Date(now);
  medianoche.setHours(0, 0, 0, 0);

  const msEnUnDia = 24 * 60 * 60 * 1000; // Milisegundos en un día

  const proximoMediodia = mediodia.getTime() > now.getTime() ? mediodia : new Date(mediodia.getTime() + msEnUnDia);
  const proximaTarde = tarde.getTime() > now.getTime() ? tarde : new Date(tarde.getTime() + msEnUnDia);
  const proximaMedianoche = medianoche.getTime() > now.getTime() ? medianoche : new Date(medianoche.getTime() + msEnUnDia);

  const tiempoHastaMediodia = proximoMediodia - now;
  const tiempoHastaTarde = proximaTarde - now;
  const tiempoHastaMedianoche = proximaMedianoche - now;

  setTimeout(() => {
    ejecutarTarea();
    setInterval(ejecutarTarea, msEnUnDia); // Programa ejecución diaria
  }, tiempoHastaMediodia);

  setTimeout(() => {
    ejecutarTarea();
    setInterval(ejecutarTarea, msEnUnDia); // Programa ejecución diaria
  }, tiempoHastaTarde);

  setTimeout(() => {
    ejecutarTarea();
    setInterval(ejecutarTarea, msEnUnDia); // Programa ejecución diaria
  }, tiempoHastaMedianoche);
}

async function Listar_copias() {
  $.getJSON($("#id_url_ajax").val() + "copias/Listar_copias_mysql", function (data) {
    $("#lista_copias_seguridad").html("");
    data.forEach(function (elemento) {
      var tipo = elemento.tipo;
      var nombre = elemento.nombre;
      var elementoHTML = '<li><a href="../../backups/' + nombre + '">' + nombre + "</a></li>";

      if (tipo === "carpeta") {
        // elementoHTML = '<li><a href="#" class="carpeta">' + nombre + "</a></li>";
        elementoHTML = `<div class="email-list-item email-list-item--unread">
                 <div class="email-list-actions">
                   <div class="custom-control custom-checkbox">
                     <input class="custom-control-input" type="checkbox" id="check2">
                     <label class="custom-control-label" for="check2"></label>
                   </div>
                 </div>
                 <div class="email-list-detail"><span class="date float-right"><i class="far fa-folder"></i> ${nombre}</span><span class="from"></span></div>
                 </div>`;
      }
      $("#lista_copias_seguridad").append(elementoHTML);
    });
  });

  // Agregar manejo de eventos para acceder a carpetas o archivos
  $("#lista_copias_seguridad").on("click", "a", function (e) {
    e.preventDefault();
    var ruta = $(this).attr("href");
    // Implementa la lógica para acceder a la carpeta o archivo seleccionado
  });
}
