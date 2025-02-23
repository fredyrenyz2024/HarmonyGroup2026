const d = document;
const w = window;
let valores = "";
d.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  valores = window.location.search;
  Listar_pedidos();
});

async function Listar_pedidos() {
  // let data = new FormData();
  // data.append("fecha_inicial", fecha_inicio);
  // data.append("fecha_final", fecha_fin);
  await fetch($("#id_url_ajax").val() + "pedidos/Comportaidos_Conmigo", {
    method: "POST",
    // body: data,
    cache: "no-cache",
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .catch((error) => {
      alert(JSON.stringify(error.length) || "Error al cargar los pedidos compartidos");
    })
    .then((response) => {
      let tbody = d.getElementById("body_pedidos_compartidos");
      tbody.innerHTML = "";
      response.forEach((element) => {
        const fila = d.createElement("tr");
        const columnaNumdoc = d.createElement("td");
        columnaNumdoc.textContent = element.numdoc;
        const columnaReferencia = d.createElement("td");
        // columnaReferencia.textContent = element.referencia;
        columnaReferencia.innerHTML = `<a href="${$("#id_url_ajax").val()}pedidos/detalle_compartidos/${element.numdoc}/${valores}">${
          element.referencia
        }</a>`;
        const columnaCliente = d.createElement("td");
        columnaCliente.textContent = element.nombre;
        const columnaFecha = d.createElement("td");
        columnaFecha.textContent = element.fecha_creacion + " - " + element.hora_creacion;
        const columnaCompartido = d.createElement("td");
        columnaCompartido.textContent = element.usuario;

        const columnaEstado = d.createElement("td");
        if (element.estado === "ACTIVO") {
          columnaEstado.innerHTML = `<span class="label label-success">${element.estado}</span>`;
        } else if (element.estado === "CANCELADO") {
          columnaEstado.innerHTML = `<span class="label label-danger">${element.estado}</span>`;
        } else if (element.estado === "EN PROCESO") {
          columnaEstado.innerHTML = `<span class="label label-primary">${element.estado}</span>`;
        } else if (element.estado === "FINALIZADO") {
          columnaEstado.innerHTML = `<span class="label label-warning">${element.estado}</span>`;
        } else if (element.estado === "INICIADO") {
          columnaEstado.innerHTML = `<span class="label label-success">${element.estado}</span>`;
        } else {
          columnaEstado.innerHTML = `<span class="label label-info">${element.estado}</span>`;
        }

        fila.appendChild(columnaNumdoc);
        fila.appendChild(columnaReferencia);
        fila.appendChild(columnaCliente);
        fila.appendChild(columnaFecha);
        fila.appendChild(columnaCompartido);
        fila.appendChild(columnaEstado);
        tbody.appendChild(fila);
      });
    });
}
