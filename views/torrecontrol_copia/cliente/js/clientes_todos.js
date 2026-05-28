window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global

  // Crear instancia
  // Usar una variable global o una propiedad en el objeto window
  if (!window.myOffcanvas) {
    window.myOffcanvas = new DynamicOffcanvas({
      id: `customOffcanvas${id}`,
      title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
      content: '<p>Contenido inicial</p>',
      scroll: true,
      backdrop: false
    });
  } else {
    console.log('El offcanvas ya está creado.');
  }

  // const hoy = new Date();
  // const opciones = { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" };

  // // Formatear la fecha a "YYYY-MM-DD"
  // const fechaColombia = new Intl.DateTimeFormat("es-CO", opciones)
  //   .format(hoy)
  //   .split("/")
  //   .reverse()
  //   .join("-");

  // listar_pedidos_administrador(fechaColombia, fechaColombia);

  document.getElementById(`campo-${window.VENTANA}-trazabilidad`).style.display = "none";
  // Obtener los campos por ID
  let campoFechaInicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`);
  let campoFechaFinal = document.getElementById(`campo-${window.VENTANA}-fecha_final`);

  if (campoFechaInicial && campoFechaFinal) {
    let hoy = new Date();
    let anio = hoy.getFullYear();
    let mes = hoy.getMonth() + 1; // Los meses van de 0 a 11
    let dia = hoy.getDate();

    // Formatear mes y día con dos dígitos
    mes = mes < 10 ? `0${mes}` : mes;
    let diaActual = dia < 10 ? `0${dia}` : dia;

    // Establecer fechas en formato YYYY-MM-DD
    let fechaInicio = `${anio}-${mes}-01`;
    let fechaFin = `${anio}-${mes}-${diaActual}`;

    // Asignar las fechas a los inputs
    campoFechaInicial.value = fechaInicio;
    campoFechaFinal.value = fechaFin;

    // Obtener los valores de los inputs para enviar a la función
    let fecha_inicial = campoFechaInicial.value;
    let fecha_final = campoFechaFinal.value;

    // Llamar a la función con los valores actualizados
    listar_pedidos_administrador(fecha_inicial, fecha_final);
  }
  document.addEventListener("click", async (e) => {
    /* Boton para buscar por fechas */
    /* Boton para buscar por fechas */
    // if (e.target.matches(`#campo-${window.VENTANA}-buscar`) || e.target.matches(`#campo-${window.VENTANA}-buscar *`)) {
    //   let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
    //   let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
    //   listar_pedidos_administrador(fecha_inicial, fecha_final);
    // }

    if (e.target.matches(`#campo-${window.VENTANA}-buscar`) || e.target.matches(`#campo-${window.VENTANA}-buscar *`)) {

      if (document.getElementById(`campo-${window.VENTANA}-modalidades`).value === "" && document.getElementById(`campo-${window.VENTANA}-filtros`).value === "") {
        let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
        let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
        let identificador = "fecha";

        listar_pedidos_administrador(fecha_inicial, fecha_final, "", "", "", identificador);
      } else
        if (document.getElementById(`campo-${window.VENTANA}-modalidades`).value !== "" && document.getElementById(`campo-${window.VENTANA}-filtros`).value === "") {
          let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
          let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
          let valor = document.getElementById(`campo-${window.VENTANA}-modalidades`).value.trim();
          let identificador = "mod";
          //if (e.target.matches(`#campo-${window.VENTANA}-modalidades`) || e.target.matches(`#campo-${window.VENTANA}-modalidades *`)) {
          // valor = document.getElementById(`campo-${window.VENTANA}-modalidades`).value.trim();
          //}
          listar_pedidos_administrador(fecha_inicial, fecha_final, "", valor, "", identificador);
        } else if (document.getElementById(`campo-${window.VENTANA}-modalidades`).value !== "" && document.getElementById(`campo-${window.VENTANA}-filtros`).value !== "Asignado" && document.getElementById(`campo-${window.VENTANA}-filtros`).value !== "Pedido") {
          let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
          let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
          let modalidad = document.getElementById(`campo-${window.VENTANA}-modalidades`).value.trim();
          let filtro = document.getElementById(`campo-${window.VENTANA}-filtros`).value.trim();
          let identificador = "filt_mod"; // Filtro con modalidad
          listar_pedidos_administrador(fecha_inicial, fecha_final, filtro, modalidad, "", identificador);
        } else if (document.getElementById(`campo-${window.VENTANA}-filtros`).value === "Asignado" && document.getElementById(`campo-${window.VENTANA}-trazabilidad`).value === "" && document.getElementById(`campo-${window.VENTANA}-modalidades`).value === "") {
          let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
          let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
          // let filtro = document.getElementById(`campo-${window.VENTANA}-filtros`).value.trim();

          let identificador = "filt"; // Filtro
          listar_pedidos_administrador(fecha_inicial, fecha_final, "", "", "", identificador);
        } else if (document.getElementById(`campo-${window.VENTANA}-filtros`).value === "Asignado" && document.getElementById(`campo-${window.VENTANA}-trazabilidad`).value !== "" && document.getElementById(`campo-${window.VENTANA}-modalidades`).value === "") {
          let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
          let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
          let filtro = document.getElementById(`campo-${window.VENTANA}-filtros`).value.trim();
          let valor = document.getElementById(`campo-${window.VENTANA}-trazabilidad`).value.trim();
          let identificador = "filt_traz"; // Filtro con trazabilidad
          listar_pedidos_administrador(fecha_inicial, fecha_final, filtro, valor, "", identificador);
        } else if (document.getElementById(`campo-${window.VENTANA}-filtros`).value === "Asignado" && document.getElementById(`campo-${window.VENTANA}-trazabilidad`).value !== "" && document.getElementById(`campo-${window.VENTANA}-modalidades`).value !== "") {
          let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
          let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
          let modalidad = document.getElementById(`campo-${window.VENTANA}-modalidades`).value.trim();
          let valor = document.getElementById(`campo-${window.VENTANA}-trazabilidad`).value.trim();
          let identificador = "filt_traz_mod"; // Filtro con trazabilidad y modalidad
          listar_pedidos_administrador(fecha_inicial, fecha_final, "", valor, modalidad, identificador);
        } else if (document.getElementById(`campo-${window.VENTANA}-filtros`).value === "Asignado" && document.getElementById(`campo-${window.VENTANA}-trazabilidad`).value === "" && document.getElementById(`campo-${window.VENTANA}-modalidades`).value !== "") {
          let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
          let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
          let modalidad = document.getElementById(`campo-${window.VENTANA}-modalidades`).value.trim();
          let identificador = "filt_mod_asig"; // Filtro con trazabilidad y modalidad
          listar_pedidos_administrador(fecha_inicial, fecha_final, "", "", modalidad, identificador);

        } else {
          //let filtro = document.getElementById(`campo-${window.VENTANA}-filtro`).value.trim();
          //listar_pedidos_administrador('', '', filtro); 
        }
      // let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
      // let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
      // listar_pedidos_administrador(fecha_inicial, fecha_final);
    }

    if (e.target.matches(`#campo-${window.VENTANA}-carrito`) || e.target.matches(`#campo-${window.VENTANA}-carrito *`)) {
      let clienId = document.getElementById(`campo-${window.VENTANA}-carrito`).getAttribute("data-idCliente");
      let pedidoId = document.getElementById(`campo-${window.VENTANA}-carrito`).getAttribute("data-idPedido");
      let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

      if (carrito.length === 0) {
        myOffcanvas.updateContent(`<p class="text-center text-muted">No hay pedidos en el carrito.</p>`);
      } else {
        let tablaHTML = `
              <table class="table table-striped table-sm" data-page-length='100' style="font-size:11px;">
                  <thead>
                      <tr>
                          <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>#</th>
                          <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>N° Pedido</th>
                          <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Cliente</th>
                          <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Producto</th>
                          <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Unidades</th>
                          <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Prestación</th>
                          <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Acción</th>
                      </tr>
                  </thead>
                  <tbody>`;

        carrito.forEach((item, index) => {
          tablaHTML += `
                  <tr>
                      <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${index + 1}</td>
                      <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${item.dataId4}</td>
                      <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${item.dataId || '-'}</td>
                      <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${item.dataId12 || '-'}</td>
                      <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${item.dataId7 || '-'}</td>
                      <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${item.dataId13 || '-'}</td>
                      <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${item.dataId11 || '-'} KG</td>
                  </tr>`;
        });

        tablaHTML += `
          </tbody>
        </table>
          <div class="d-flex align-items-center justify-content-between">
              <h5 id="titulo_opcion" class="mb-0 me-2 d-flex align-items-center justify-content-center">Título</h5>
              <div id="acciones_asignacion"></div>
          </div>
          <hr class="my-1 text-dark">
          <div class="container" id="contenido_opcion"></div>
        `;

        myOffcanvas.updateTitle(`
          <div class="d-flex align-items-center justify-content-between">
            <span class="text-primary-emphasis uil uil-file-alt"></span> Listado de Pedidos 
            <div class="dropdown ms-2">
              <a class="btn btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink"  href="#"  role="button" data-bs-toggle="dropdown"  aria-haspopup="true"  aria-expanded="false">Opciones</a>
              <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
                <a class="dropdown-item fw-bold" href="#" id="btn_asignar_proveedor" data-id="${pedidoId}" data-id2="${clienId}" data-title="Asignar Proveedor"><span class="uil uil-file-search-alt"></span> Asignar Proveedor</a>
                <a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido"   data-id="${pedidoId}" data-id2="${clienId}" data-title="Publicar Pedidos"><span class="uil uil-feedback"></span> Publicar Pedido</a>
                <!--<a class="dropdown-item" href="#">Something else here</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Separated link</a>
              </div>-->
            </div>
          </div>
        `);

        myOffcanvas.updateContent(tablaHTML);
      }

      myOffcanvas.show();
    }

    if (e.target.matches("#btn_detalle_trazabilidad_pedido") || e.target.matches("#btn_detalle_trazabilidad_pedido *")) {
      let Enlace = e.target.closest("#btn_detalle_trazabilidad_pedido");
      let PedidoId = Enlace.getAttribute("data-id");

      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Trazabilidad pedido`);
      myOffcanvas.updateContent(`
          <div class="table-responsive scrollbar">
          <div class="table-responsive scrollbar">
              <style>
                #lineaTiempo {
                  position: relative;
                }

                #lineaTiempo .progreso-linea,
                #lineaTiempo .progreso-linea-actual {
                  position: absolute;
                  top: 16px; /* Centro exacto de los círculos de 32px de alto */
                  height: 4px;
                  z-index: 0;
                  transition: all 0.3s ease-in-out;
                }

                #lineaTiempo .progreso-linea {
                  background-color: green;
                }

                #lineaTiempo .progreso-linea-actual {
                  background-color: orange;
                }

                .step {
                  position: relative;
                  z-index: 1;
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                }

                .circle {
                  width: 32px;
                  height: 32px;
                  background-color: #dee2e6;
                  border-radius: 50%;
                  border: 3px solid transparent;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  z-index: 1;
                }

                .circle.completed {
                  background-color: green;
                }

                .circle.current {
                  background-color: orange;
                }

                .step small {
                  margin-top: 6px;
                  font-size: 0.75rem;
                  color: #495057;
                  text-align: center;
                }

                .info-extra {
                  font-size: 0.7rem;
                  color: #6c757d;
                  text-align: center;
                }
              </style>

              <div class="timeline-wrapper bg-light rounded p-4" >
                <h1 class="h6 mb-3 text-end"><span id='FechaEstimada'></span></h1>
                <div class="d-flex justify-content-between position-relative timeline-line" id="lineaTiempo">
                  <!-- Los pasos se inyectarán por JavaScript -->
                </div>
              </div>

            <div class="border-top border-translucent border-dashed pt-3"></div>

            <table class="table table-sm text-center" style="font-size: 11px;">
              <thead>
                <tr>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>#</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Tipo Trazabilidad</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Observación</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Usuario</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Fecha</th>
                  <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Soporte</th>
                </tr>
              </thead>
              <tbody id="tbody_detalle_trazabilidad_pedido" class="text-center">
                <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
              </tbody>
            </table>
          </div>
      `);

      try {
        let formData = new FormData();
        formData.append("PedidoId", PedidoId);

        let response = await fetch($('#base_url').val() + 'torrecontrol/Listar_trazabilidad_pedido', {
          method: "POST",
          body: formData
        });

        let data = await response.json();
        if (data) {
          let rows = "";

          data.forEach((servicio, index) => {
            rows += `
                <tr>
                  <th scope="row">${index + 1}</th>
                 <!--<td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.referencia}</td>-->
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.tipo_trazabilidad}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.observacion}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.usuario}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.fecha_registro}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>
                      <a href="${$('#base_url').val()}${servicio.evidencia}" target="_blank" class="btn btn-outline-primary btn-sm me-1 px-1 py-0">
                        <i class="uil-file-download-alt"></i> Ver Documento
                      </a>
                  </td>
                </tr>
                <!--<tr id="Recurso_proveedores_${servicio.referencia}" style="display: none;">
                  <td colspan="12">
                    <div class="lista-proceso-proveedores"></div>
                  </td>
                </tr>
                <tr id="trazabilidad_pedidos_recurso_${servicio.referencia}" style="display: none;">
                  <td colspan="12">
                    <div class="trazabilidad-pedidos"></div>
                  </td>
                </tr>-->
              `;
          });

          document.getElementById("tbody_detalle_trazabilidad_pedido").innerHTML = rows;
        } else {
          document.getElementById("tbody_detalle_trazabilidad_pedido").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
        }
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        document.getElementById("tbody_detalle_trazabilidad_pedido").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
      }

      // Actualizar el estado de los pasos en la línea de tiempo
      cargarLineaTiempo(PedidoId);
      myOffcanvas.show();

    }

    /* Cerrar el offcanvas y limpiar el carrito */
    // if (e.target.matches(".btn-close") || e.target.matches(".btn-close *")) {
    if (e.target.matches(`#btn-close-customOffcanvas${window.VENTANA}`) || e.target.matches(`#btn-close-customOffcanvas${window.VENTANA} *`)) {
      sessionStorage.clear();
      actualizarContadorCarrito();
    }

    if (e.target.matches("#btn_detalle_trazabilidad") || e.target.matches("#btn_detalle_trazabilidad *")) {
      let Enlace = e.target.closest("#btn_detalle_trazabilidad");
      // let numdoc_trazabilidad = Enlace.getAttribute("data-id");
      let ServicioId = Enlace.getAttribute("data-ServicioId");
      let RecursoId = Enlace.getAttribute("data-RecursoId");

      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Detalle de solicitud de servicio`);
      myOffcanvas.updateContent(`
        <div class="table-responsive scrollbar">
          <table class="table table-sm text-center" style="font-size: 11px;">
            <thead>
              <tr>
                <th scope="col" style='color:black;width: auto; white-space: nowrap;'>#</th>
                <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Placa</th>
                <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Ruta </th>
                <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Sitio</th>
                <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Latitud</th>
                <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Longitud</th>
                <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Fecha</th>
                <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Nota</th>
                <th scope="col" style='color:black;width: auto; white-space: nowrap;'>Usuario</th>
              </tr>
            </thead>
            <tbody id="tbody_detalle_trazabilidad" class="text-center">
              <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
            </tbody>
          </table>
        </div>

        <div id="map" style="height: 600px; width: 100%;"></div>

      `);

      try {
        let formData = new FormData();
        formData.append("ServicioId", ServicioId);
        formData.append("RecursoId", RecursoId);
        // formData.append("proveedor_id", document.getElementById('proveedor_id').value);

        let response = await fetch($('#base_url').val() + 'torrecontrol/detalle_trazabilidad_pedido', {
          method: "POST",
          body: formData
        });

        let data = await response.json();
        if (data) {
          let rows = "";

          data.forEach((servicio, index) => {
            rows += `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.placa_vehiculo}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.ruta}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.sitio_seguimiento}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.latitud}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.longitud}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.fecha_hora}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.nota_seguimiento}</td>
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.usuario_reporte}</td>
                </tr>
                <tr id="Recurso_proveedores_${servicio.referencia}" style="display: none;">
                  <td colspan="12">
                    <div class="lista-proceso-proveedores"></div>
                  </td>
                </tr>
              `;
          });

          document.getElementById("tbody_detalle_trazabilidad").innerHTML = rows;

          /*Dibujar mapa  */
          let map; // 🛡️ Mejor declararlo afuera

          // async function initMap() {
          //   const { Map } = await google.maps.importLibrary("maps");
          //   const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
          //   const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes"); // NUEVO

          //   map = new Map(document.getElementById("map"), {
          //     center: { lat: 4.5709, lng: -74.2973 }, // Colombia
          //     zoom: 5.5,
          //     gestureHandling: "greedy",
          //     mapId: "db5350020424d6c4"
          //   });

          //   // Colocar los marcadores
          //   data.forEach(punto => {
          //     new AdvancedMarkerElement({
          //       map: map,
          //       position: {
          //         lat: parseFloat(punto.latitud),
          //         lng: parseFloat(punto.longitud)
          //       },
          //       title: punto.sitio_seguimiento,
          //     });
          //   });

          //   // Ahora usar DirectionsService para calcular la ruta real
          //   const directionsService = new DirectionsService();
          //   const directionsRenderer = new DirectionsRenderer({ map: map });

          //   // Creamos el array de paradas (waypoints)
          //   const waypoints = data.slice(1, data.length - 1).map(punto => ({
          //     location: {
          //       lat: parseFloat(punto.latitud),
          //       lng: parseFloat(punto.longitud)
          //     },
          //     stopover: true
          //   }));

          //   // Definimos la solicitud
          //   const request = {
          //     origin: {
          //       lat: parseFloat(data[0].latitud),
          //       lng: parseFloat(data[0].longitud)
          //     },
          //     destination: {
          //       lat: parseFloat(data[data.length - 1].latitud),
          //       lng: parseFloat(data[data.length - 1].longitud)
          //     },
          //     waypoints: waypoints,
          //     travelMode: google.maps.TravelMode.DRIVING, // Puedes poner WALKING, BICYCLING o TRANSIT también
          //     optimizeWaypoints: false
          //   };

          //   // Pedimos la ruta
          //   directionsService.route(request, (result, status) => {
          //     if (status === "OK") {
          //       directionsRenderer.setDirections(result);
          //     } else {
          //       console.error("Error en la ruta:", status);
          //     }
          //   });
          // }

          async function initMap() {
            const { Map } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
            const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes");
            const { Geocoder } = await google.maps.importLibrary("geocoding"); // Importar Geocoder

            map = new Map(document.getElementById("map"), {
              center: { lat: 4.5709, lng: -74.2973 }, // Colombia
              zoom: 5.5,
              gestureHandling: "greedy",
              mapId: "db5350020424d6c4"
            });

            const geocoder = new Geocoder();

            // Función auxiliar para obtener el nombre del lugar
            async function obtenerNombreLugar(lat, lng) {
              return new Promise((resolve, reject) => {
                geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                  if (status === "OK" && results[0]) {
                    resolve(results[0].formatted_address); // Puedes usar también address_components si quieres algo más específico
                  } else {
                    console.error("No se pudo obtener el nombre del lugar:", status);
                    resolve("Lugar desconocido"); // Por si falla
                  }
                });
              });
            }

            // Colocar los marcadores
            for (const punto of data) {
              const lat = parseFloat(punto.latitud);
              const lng = parseFloat(punto.longitud);
              const nombreLugar = await obtenerNombreLugar(lat, lng);

              new AdvancedMarkerElement({
                map: map,
                position: { lat, lng },
                title: `${nombreLugar}\n${punto.fecha_hora}`, // Nombre + fecha_hora
              });
            }

            // Ahora usar DirectionsService para calcular la ruta real
            const directionsService = new DirectionsService();
            const directionsRenderer = new DirectionsRenderer({ map: map });

            // Creamos el array de paradas (waypoints)
            const waypoints = data.slice(1, data.length - 1).map(punto => ({
              location: {
                lat: parseFloat(punto.latitud),
                lng: parseFloat(punto.longitud)
              },
              stopover: true
            }));

            // Definimos la solicitud
            const request = {
              origin: {
                lat: parseFloat(data[0].latitud),
                lng: parseFloat(data[0].longitud)
              },
              destination: {
                lat: parseFloat(data[data.length - 1].latitud),
                lng: parseFloat(data[data.length - 1].longitud)
              },
              waypoints: waypoints,
              travelMode: google.maps.TravelMode.DRIVING,
              optimizeWaypoints: false
            };

            // Pedimos la ruta
            directionsService.route(request, (result, status) => {
              if (status === "OK") {
                directionsRenderer.setDirections(result);
              } else {
                console.error("Error en la ruta:", status);
              }
            });
          }

          initMap();

        } else {
          document.getElementById("tbody_detalle_trazabilidad").innerHTML = `<tr><td colspan="12" class="text-center text-danger">${data.message}</td></tr>`;
        }
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        document.getElementById("tbody_detalle_trazabilidad").innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error al cargar pedidos del recurso</td></tr>`;
      }

      myOffcanvas.show();
    }

  });

  // Evento para seleccionar/deseleccionar todos los checkboxes
  $('#selectAll').on('change', function () {
    let isChecked = $(this).prop('checked');
    $('.pedido-checkbox').prop('checked', isChecked);
    let carrito = isChecked ? obtenerTodosLosPedidos() : [];
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    document.getElementById(`campo-16-carrito`).style.display = isChecked ? "" : "none";
    actualizarContadorCarrito();
  });

  $(document).on('change', '.pedido-checkbox', function () {
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    let pedido = {
      id: $(this).val(),
      dataId: $(this).data('id'),
      dataId2: $(this).data('id2'),
      dataId3: $(this).data('id3'),
      dataId4: $(this).data('id4'),
      dataId5: $(this).data('id5'),
      dataId6: $(this).data('id6'),
      dataId7: $(this).data('id7'),
      dataId8: $(this).data('id8'),
      dataId9: $(this).data('id9'),
      dataId10: $(this).data('id10'),
      dataId11: $(this).data('id11'),
      dataId12: $(this).data('id12'),
      dataId13: $(this).data('id13'),
      dataId14: $(this).data('id14'),
    };

    if ($(this).prop('checked')) {
      // Agregar solo si no existe en el carrito
      if (!carrito.some(item => item.id === pedido.id)) {
        carrito.push(pedido);
      }
    } else {
      // Filtrar para eliminar el elemento
      carrito = carrito.filter(item => item.id !== pedido.id);
    }

    // ✅ RESALTAR FILA AL SELECCIONAR
    let rowId = $(this).data('row'); // debes tener data-row="id_fila" en el checkbox
    let row = document.getElementById(rowId);
    if (row) {
      row.style.backgroundColor = $(this).is(':checked') ? '#d8ddf9' : '';
    }

    $('#selectAll').prop('checked', $('.pedido-checkbox:checked').length === $('.pedido-checkbox').length);
    sessionStorage.setItem("carrito", JSON.stringify(carrito));

    let campoCarrito = document.getElementById(`campo-${window.VENTANA}-carrito`);
    campoCarrito.style.display = carrito.length > 0 ? "" : "none";
    campoCarrito.setAttribute("data-idPedido", pedido.id);
    campoCarrito.setAttribute("data-idCliente", pedido.dataId14);

    actualizarContadorCarrito();
  });

  // document.addEventListener("change", async (e) => {
  //   if (e.target.matches(`#campo-${window.VENTANA}-filtros`) || e.target.matches(`#campo-${window.VENTANA}-filtros *`)) {
  //     let valor = document.getElementById(`campo-${window.VENTANA}-filtros`).value.trim();
  //     // console.log("🚀 ~ document.addEventListener ~ trazabilidad:", valor)
  //     const campoTrazabilidad = document.getElementById(`campo-${window.VENTANA}-trazabilidad`);
  //     if (valor === 'Asignado') {
  //       campoTrazabilidad.style.display = "";

  //       // ✅ Reiniciar el select (poner en valor vacío o primera opción)
  //       const select = campoTrazabilidad.querySelector("select");
  //       if (select) {
  //         select.selectedIndex = 0; // selecciona la primera opción
  //         // select.value = ""; // o puedes usar esto si tienes una opción con value=""
  //       }
  //     } else {
  //       document.getElementById(`campo-${window.VENTANA}-trazabilidad`).style.display = "none";
  //       let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
  //       let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
  //       listar_pedidos_administrador(fecha_inicial, fecha_final, 'filtro_Select', valor);
  //     }
  //   }

  //   if (e.target.matches(`#campo-${window.VENTANA}-trazabilidad`) || e.target.matches(`#campo-${window.VENTANA}-trazabilidad *`)) {
  //     let valor = document.getElementById(`campo-${window.VENTANA}-trazabilidad`).value.trim();
  //     // console.log("🚀 ~ document.addEventListener ~ trazabilidad:", valor)
  //     let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
  //     let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
  //     listar_pedidos_administrador(fecha_inicial, fecha_final, 'filtro_Select', valor);
  //   }
  // });

  document.addEventListener("input", async (e) => {
    if (e.target.matches(`#campo-${window.VENTANA}-filtro`) || e.target.matches(`#campo-${window.VENTANA}-filtro *`)) {
      let filtro = document.getElementById(`campo-${window.VENTANA}-filtro`).value.trim();
      listar_pedidos_administrador('', '', filtro);
    }
  });

  document.addEventListener("change", async (e) => {
    if (e.target.matches(`#campo-${window.VENTANA}-filtros`) || e.target.matches(`#campo-${window.VENTANA}-filtros *`)) {
      let valor = document.getElementById(`campo-${window.VENTANA}-filtros`).value.trim()
      const campoTrazabilidad = document.getElementById(`campo-${window.VENTANA}-trazabilidad`);
      if (valor === 'Asignado') {
        campoTrazabilidad.style.display = "";
        document.getElementById(`campo-${window.VENTANA}-modalidades`).style.display = "";
        // ✅ Reiniciar el select (poner en valor vacío o primera opción)
        const select = campoTrazabilidad.querySelector("select");
        // document.getElementById(`campo-${window.VENTANA}-filtro`).style.display = "none";
        // document.getElementById(`campo-${window.VENTANA}-buscar`).style.display = "none";
        if (select) {
          select.selectedIndex = 0; // selecciona la primera opción
          // select.value = ""; // o puedes usar esto si tienes una opción con value=""
        }
      } else if (valor === 'Modalidad') {
        document.getElementById(`campo-${window.VENTANA}-trazabilidad`).style.display = "none";
        document.getElementById(`campo-${window.VENTANA}-modalidades`).style.display = "";
        let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
        let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
        //listar_pedidos_administrador(fecha_inicial, fecha_final, 'filtro_Select', valor);
      } else if (valor === "Pedidos") {
        document.getElementById(`campo-${window.VENTANA}-trazabilidad`).style.display = "none";
        document.getElementById(`campo-${window.VENTANA}-modalidades`).style.display = "none";
        document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).style.display = "none";
        document.getElementById(`campo-${window.VENTANA}-fecha_final`).style.display = "none";
        document.getElementById(`campo-${window.VENTANA}-buscar`).style.display = "none";
        document.getElementById(`campo-${window.VENTANA}-filtro`).style.display = "";
      }
      else {
        document.getElementById(`campo-${window.VENTANA}-trazabilidad`).style.display = "none";
        document.getElementById(`campo-${window.VENTANA}-modalidades`).style.display = "";
        document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).style.display = "";
        document.getElementById(`campo-${window.VENTANA}-fecha_final`).style.display = "";
        document.getElementById(`campo-${window.VENTANA}-buscar`).style.display = "";
      }
    }

    if (e.target.matches(`#campo-${window.VENTANA}-trazabilidad`) || e.target.matches(`#campo-${window.VENTANA}-trazabilidad *`)) {
      let valor = document.getElementById(`campo-${window.VENTANA}-trazabilidad`).value.trim();
      let modalidad = document.getElementById(`campo-${window.VENTANA}-modalidades`).value.trim()
      let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
      let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
      //listar_pedidos_administrador(fecha_inicial, fecha_final, 'filtro_Select', valor, modalidad, '');
    }

    if (document.getElementById(`campo-${window.VENTANA}-trazabilidad`).value.trim() === '') {
      if (e.target.matches(`#campo-${window.VENTANA}-modalidades`) || e.target.matches(`#campo-${window.VENTANA}-modalidades *`)) {
        let valor = document.getElementById(`campo-${window.VENTANA}-modalidades`).value.trim();
        let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
        let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
        //listar_pedidos_administrador(fecha_inicial, fecha_final, 'filtro_Select', valor, '', '');
      }
    } else {
      if (e.target.matches(`#campo-${window.VENTANA}-modalidades`) || e.target.matches(`#campo-${window.VENTANA}-modalidades *`)) {
        let valor = document.getElementById(`campo-${window.VENTANA}-modalidades`).value.trim();
        let trazabilidad = document.getElementById(`campo-${window.VENTANA}-trazabilidad`).value.trim();

        let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
        let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
        //listar_pedidos_administrador(fecha_inicial, fecha_final, 'filtro_Select', trazabilidad, valor);
      }
    }
  });

  //boton de excel
  document.getElementById('exportar_excel').addEventListener('click', function () {
    var table = document.getElementById('table1');
    var wb = XLSX.utils.table_to_book(table);
    // Crear contenido de archivo con fecha
    // var fecha = new Date();
    Array.from(table.getElementsByTagName('td')).forEach(function (td) {
      const text = td.innerText.trim();

      // Detectar valores con $ o formatos de fecha ISO
      const esFecha = /^\d{4}-\d{2}-\d{2}$/.test(text); // Formato YYYY-MM-DD

      if (esFecha) {
        td.setAttribute('data-t', 's'); // Marcar como texto para Excel
      }
    });
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Informe de Pedidos ${fechaActual}.xlsx`; //'Informe Remesas_${fecha.toISOString()}.xlsx '
    XLSX.writeFile(wb, nombreArchivo);
  });
}

async function listar_pedidos_administrador(fecha_inicial, fecha_final, filtro, valor, trazabilidad, identificador) {
  /* Funcion para enviar los datos */
  let dato = new FormData();
  dato.append('fecha_inicial', fecha_inicial);
  dato.append('fecha_final', fecha_final);
  // dato.append('filtro', filtro ? filtro : document.getElementById(`campo-${window.VENTANA}-filtros`).value.trim());
  dato.append('filtro', filtro);
  dato.append('valor', valor);
  dato.append('trazabilidad', trazabilidad);
  dato.append('identificador', identificador);
  // dato.append('proceso_filtro', proceso_filtro);
  dato.append('filtros', document.getElementById(`campo-${window.VENTANA}-filtros`).value);
  
  try {
    const response = await fetch($('#base_url').val() + 'torrecontrol/listar_administracion_pedidos', {
      method: 'POST',
      body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tbl_administrar_pedidos');
      tbody.innerHTML = '';
      // let col_estatus_publicacion = '';
      // let col_estatus_asignacion = '';
      // let btn_publicacion = "";
      let btn_cancelacion = "";
      let col_prioridad = "";
      let btn_removeAsignacion = "";
      let checkbox_carrito = "";
      let col_estatus_proceso = "";
      let col_estatus_trazabilidad = "";
      let btn_detalle_proceso = "";
      let btn_detalle_trazabilidad = "";
      let btn_trazabilidad_pedido = "";
      let btn_prioridad = "";

      data.forEach(element => {
        const fila = document.createElement('tr');
        fila.id = `fila_${element.numdoc_solicitud}`;
        // Publicacións
        if (estadosPublicacion[element.estado_publicaion]) {
          col_estatus_publicacion = createBadge(element.estado_publicaion, estadosPublicacion[element.estado_publicaion]);
        }

        // Asignación
        if (estadosAsignacion[element.estado_asignacion]) {
          col_estatus_asignacion = createBadge(element.estado_asignacion, estadosAsignacion[element.estado_asignacion]);
        }

        // Prioridad
        if (estadosPrioridad[element.estado_prioridad]) {
          col_prioridad = createBadge(element.estado_prioridad, estadosPrioridad[element.estado_prioridad]);
        }

        // Botones y checkbox según combinación de estado
        const estadoPublicacion = element.estado_publicaion;
        const estadoAsignacion = element.estado_asignacion;

        if (estadoPublicacion === 'Publicado' && estadoAsignacion === 'Asignado') {
          btn_removeAsignacion = ``;
          checkbox_carrito = ``;
          btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
          btn_detalle_trazabilidad = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}"><span class="uil uil-transaction"></span> Detalle trazabilidad</a>`;
          btn_trazabilidad_pedido = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad_pedido" data-id="${element.numdoc_solicitud}"><span class="uil-wrap-text"></span> Trazabilidad pedido</a>`;
          btn_prioridad = `<a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"> <span class="uil uil-bell"></span> Marcar como Prioridad</a>`;
        } else if (estadoPublicacion === 'Publicado' && estadoAsignacion === 'Pendiente') {
          btn_removeAsignacion = ``;
          checkbox_carrito = ``;
          btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
          btn_detalle_trazabilidad = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}"><span class="uil uil-transaction"></span> Detalle trazabilidad</a>`;
          btn_trazabilidad_pedido = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad_pedido" data-id="${element.numdoc_solicitud}"><span class="uil-wrap-text"></span> Trazabilidad pedido</a>`;
          btn_prioridad = `<a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"> <span class="uil uil-bell"></span> Marcar como Prioridad</a>`;
        } else if (
          (estadoPublicacion === 'Pendiente Respuesta' && estadoAsignacion === 'Pendiente') ||
          (estadoPublicacion === 'Aceptado' && estadoAsignacion === 'Ganador') ||
          (estadoPublicacion === 'Completado' && estadoAsignacion === 'Completado')
        ) {
          // No mostrar botones ni checkbox
          checkbox_carrito = ``;
        } else {
          btn_detalle_proceso = ``;
          btn_detalle_trazabilidad = ``;
          btn_removeAsignacion = ``;
          btn_trazabilidad_pedido = ``;
          btn_prioridad = `<a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"> <span class="uil uil-bell"></span> Marcar como Prioridad</a>`;
          // Mostrar botones de cancelación y checkbox
          if (element.estado_publicaion === 'Cancelado' && element.estado_asignacion === 'Cancelado') {
            btn_cancelacion = ``;
          } else {
            btn_cancelacion = `
            <a class="dropdown-item fw-bold" href="#" id="btn_cancelar_pedido"
              data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}">
              <span class="uil uil-x"></span> Cancelar Pedido
            </a>`;
          }

          checkbox_carrito = `
            <input class="form-check-input pedido-checkbox" id="check_pedido_${element.numdoc_solicitud}"
              type="checkbox" value="${element.numdoc_solicitud}"
              data-id="${element.nombre_cliente}" data-id2="${element.ciudad_origen}" data-id3="${element.ciudad_destino}"
              data-id4="${element.referencia_pedido}" data-id5="${element.fecha_cargue}" data-id6="${element.fecha_entrega}"
              data-id7="${element.unidades}" data-id8="${element.lote}" data-id9="${element.num_estibas}"
              data-id10="${element.peso_neto_kg}" data-id11="${element.peso_bruto_kg}"
              data-id12="${element.producto}" data-id13="${element.presentacion}" data-id14="${element.cliente}" data-id15="${element.modalidad}"
              style="scale: 1.2;" data-row="fila_${element.numdoc_solicitud}">
          `;
        }

        //Estado proceso
        if (estadosProceso[element.estado_proceso]) {
          if (element.estado_publicaion === 'Cancelado' && element.estado_asignacion === 'Cancelado') {
            col_estatus_proceso = createBadge('Cancelado', 'danger');
            checkbox_carrito = ``;
            btn_prioridad = ``;
            btn_detalle_proceso = ``;
            btn_detalle_trazabilidad = ``;
            btn_removeAsignacion = ``;
            btn_trazabilidad_pedido = ``;
            btn_publicacion = ``;
          } else {
            // element.estado_proceso==='Publicación' || 'Asignación'
            col_estatus_proceso = createBadge(element.estado_proceso, estadosProceso[element.estado_proceso]);
          }
        }

        if (element.tipo_trazabilidad === 'Completado' || element.tipo_trazabilidad === 'Iniciado' && element.estado_proceso_pedido === 'Completado') {
          btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
          btn_detalle_trazabilidad = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}"><span class="uil uil-transaction"></span> Detalle trazabilidad</a>`;
          btn_trazabilidad_pedido = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad_pedido" data-id="${element.numdoc_solicitud}"><span class="uil-wrap-text"></span> Trazabilidad pedido</a>`;
        } else if (element.tipo_trazabilidad === 'Pendiente Iniciar' || element.tipo_trazabilidad === 'Sin Asignar') {
          btn_detalle_trazabilidad = ``;
          btn_trazabilidad_pedido = ``;
        } else {
          // btn_detalle_trazabilidad = ``;
          // btn_trazabilidad_pedido = ``;
          btn_detalle_trazabilidad = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}"><span class="uil uil-transaction"></span> Detalle trazabilidad</a>`;
          btn_trazabilidad_pedido = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad_pedido" data-id="${element.numdoc_solicitud}"><span class="uil-wrap-text"></span> Trazabilidad pedido</a>`;
        }

        /* Validar si el pedido ya tuvo una postulacion */
        if (element.tipo_trazabilidad === 'Iniciado' && element.estado_proceso_pedido === 'Postulado') {
          // Estado de la trazabilidad
          const estado = obtenerEstadoTrazabilidad(element.estado_proceso_pedido);
          col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
        } else {
          // Estado de la trazabilidad
          const estado = obtenerEstadoTrazabilidad(element.tipo_trazabilidad);
          col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
        }

        const columnaNundocSolicitud = document.createElement('td');
        columnaNundocSolicitud.innerHTML = `
        <div class="dropdown">
          <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none menu_tabla" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-row-id="${fila.id}"> N°${element.referencia_pedido}</a>
          <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
            ${btn_detalle_proceso}
            ${btn_detalle_trazabilidad}
            ${btn_removeAsignacion}
            <div class="dropdown-divider"></div>
            ${btn_trazabilidad_pedido}
            ${btn_cancelacion}
            ${btn_prioridad}
          </div>
        </div>
        `;

        // const columnaCheckPedido = document.createElement('td');
        // columnaCheckPedido.innerHTML = checkbox_carrito;
        // columnaCheckPedido.style.width = 'auto';
        // columnaCheckPedido.style.whiteSpace = 'nowrap';
        // columnaCheckPedido.style.textAlign = 'center';

        const columnaModalidadPedido = document.createElement('td');
        columnaModalidadPedido.innerHTML = element.modalidad;
        columnaModalidadPedido.style.width = 'auto';
        columnaModalidadPedido.style.whiteSpace = 'nowrap';
        columnaModalidadPedido.style.textAlign = 'center';

        const columnaCliente = document.createElement('td');
        columnaCliente.innerHTML = element.nombre_cliente;
        columnaCliente.style.width = 'auto';
        columnaCliente.style.whiteSpace = 'nowrap';

        const columnaCiudadOrigen = document.createElement('td');
        columnaCiudadOrigen.innerHTML = element.ciudad_origen;
        columnaCiudadOrigen.style.width = 'auto';
        columnaCiudadOrigen.style.whiteSpace = 'nowrap';

        const columnaRemitente = document.createElement('td');
        columnaRemitente.innerHTML = element.remitente;
        columnaRemitente.style.width = 'auto';
        columnaRemitente.style.whiteSpace = 'nowrap';
        const columnaCiudadDestino = document.createElement('td');
        columnaCiudadDestino.innerHTML = element.ciudad_destino;
        columnaCiudadDestino.style.width = 'auto';
        columnaCiudadDestino.style.whiteSpace = 'nowrap';
        const columnaSitioDescargue = document.createElement('td');

        columnaSitioDescargue.innerHTML = element.destinatario;
        const columnaCodigoProducto = document.createElement('td');
        columnaCodigoProducto.innerHTML = element.cod_producto;
        columnaSitioDescargue.style.width = 'auto';
        columnaSitioDescargue.style.whiteSpace = 'nowrap';

        const columnaProducto = document.createElement('td');
        columnaProducto.innerHTML = element.producto;
        columnaProducto.style.width = 'auto';
        columnaProducto.style.whiteSpace = 'nowrap';

        const columnaPesoNeto = document.createElement('td');
        columnaPesoNeto.innerHTML = element.peso_neto_kg + " KG";
        columnaPesoNeto.style.width = 'auto';
        columnaPesoNeto.style.whiteSpace = 'nowrap';
        const columnaPesoBruto = document.createElement('td');
        columnaPesoBruto.innerHTML = element.peso_bruto_kg + " KG";
        columnaPesoBruto.style.width = 'auto';
        columnaPesoBruto.style.whiteSpace = 'nowrap';

        const columnaPresentacion = document.createElement('td');
        columnaPresentacion.innerHTML = element.presentacion;
        columnaPresentacion.style.width = 'auto';
        columnaPresentacion.style.whiteSpace = 'nowrap';

        const columnaUnidades = document.createElement('td');
        columnaUnidades.innerHTML = element.unidades;
        columnaUnidades.style.width = 'auto';
        columnaUnidades.style.whiteSpace = 'nowrap';

        const columnaLote = document.createElement('td');
        columnaLote.innerHTML = element.lote;
        columnaLote.style.width = 'auto';
        columnaLote.style.whiteSpace = 'nowrap';

        const columnaEstibas = document.createElement('td');
        columnaEstibas.innerHTML = element.num_estibas;
        columnaEstibas.style.width = 'auto';
        columnaEstibas.style.whiteSpace = 'nowrap';

        const columnaFechaCargue = document.createElement('td');
        columnaFechaCargue.innerHTML = element.fecha_cargue;
        columnaFechaCargue.style.width = 'auto';
        columnaFechaCargue.style.whiteSpace = 'nowrap';

        const columnaFechaEntrega = document.createElement('td');
        columnaFechaEntrega.innerHTML = element.fecha_entrega;
        columnaFechaEntrega.style.width = 'auto';
        columnaFechaEntrega.style.whiteSpace = 'nowrap';

        const columnaProcesoPedido = document.createElement('td');
        columnaProcesoPedido.innerHTML = col_estatus_proceso;
        columnaProcesoPedido.style.width = 'auto';
        columnaProcesoPedido.style.whiteSpace = 'nowrap';

        const columnaEstadoPedido = document.createElement('td');
        columnaEstadoPedido.innerHTML = col_estatus_trazabilidad;
        columnaEstadoPedido.style.width = 'auto';
        columnaEstadoPedido.style.whiteSpace = 'nowrap';

        const columnaTipoVehiculo = document.createElement('td');
        columnaTipoVehiculo.innerHTML = element.tipo_vehiculo ? element.tipo_vehiculo : '-';
        columnaTipoVehiculo.style.width = 'auto';
        columnaTipoVehiculo.style.whiteSpace = 'nowrap';

        const columnaCosto = document.createElement('td');
        columnaCosto.innerHTML = element.costo ? element.costo : '-';
        columnaCosto.style.width = 'auto';
        columnaCosto.style.whiteSpace = 'nowrap';

        const columnaTarifa = document.createElement('td');
        columnaTarifa.innerHTML = element.tarifa ? element.tarifa : '-';
        columnaTarifa.style.width = 'auto';
        columnaTarifa.style.whiteSpace = 'nowrap';

        const columnaFechaRetiroContenedor = document.createElement('td');
        columnaFechaRetiroContenedor.innerHTML = element.fecha_retiro_contenedor ? element.fecha_retiro_contenedor : '-';
        columnaFechaRetiroContenedor.style.width = 'auto';
        columnaFechaRetiroContenedor.style.whiteSpace = 'nowrap';

        const columnaBooking = document.createElement('td');
        columnaBooking.innerHTML = element.booking ? element.booking : '-';
        columnaBooking.style.width = 'auto';
        columnaBooking.style.whiteSpace = 'nowrap';

        const columnaUnidadTransporte = document.createElement('td');
        columnaUnidadTransporte.innerHTML = element.unidad_transporte ? element.unidad_transporte : '-';
        columnaUnidadTransporte.style.width = 'auto';
        columnaUnidadTransporte.style.whiteSpace = 'nowrap';

        const columnaObservaciones = document.createElement('td');
        columnaObservaciones.innerHTML = element.observaciones ? element.observaciones : '-';
        columnaObservaciones.style.width = 'auto';
        columnaObservaciones.style.whiteSpace = 'nowrap';

        const columnaPriordad = document.createElement('td');
        columnaPriordad.innerHTML = col_prioridad;

        // fila.appendChild(columnaCheckPedido);
        // fila.appendChild(columnaModalidadPedido);
        // fila.appendChild(columnaNundocSolicitud);
        // fila.appendChild(columnaCliente);
        // fila.appendChild(columnaCiudadOrigen);
        // fila.appendChild(columnaRemitente);
        // fila.appendChild(columnaCiudadDestino);
        // fila.appendChild(columnaSitioDescargue);
        // fila.appendChild(columnaCodigoProducto);
        // fila.appendChild(columnaProducto);
        // fila.appendChild(columnaPesoNeto);
        // fila.appendChild(columnaPesoBruto);
        // fila.appendChild(columnaPresentacion);
        // fila.appendChild(columnaUnidades);
        // fila.appendChild(columnaLote);
        // fila.appendChild(columnaEstibas);
        // fila.appendChild(columnaFechaCargue);
        // fila.appendChild(columnaFechaEntrega);
        // fila.appendChild(columnaFechaEntrega);
        // fila.appendChild(columnaTipoVehiculo);
        // fila.appendChild(columnaCosto);
        // fila.appendChild(columnaTarifa);
        // fila.appendChild(columnaFechaRetiroContenedor);
        // fila.appendChild(columnaBooking);
        // fila.appendChild(columnaUnidadTransporte);
        // fila.appendChild(columnaObservaciones);
        // fila.appendChild(columnaPriordad);
        // fila.appendChild(columnaProcesoPedido);
        // fila.appendChild(columnaEstadoPedido);

        // fila.appendChild(columnaCheckPedido);
        fila.appendChild(columnaModalidadPedido);
        fila.appendChild(columnaNundocSolicitud);
        // fila.appendChild(columnaReferencia);
        // fila.appendChild(columnaCliente);
        fila.appendChild(columnaEstadoPedido);
        fila.appendChild(columnaCiudadOrigen);
        fila.appendChild(columnaRemitente);
        fila.appendChild(columnaCiudadDestino);
        fila.appendChild(columnaSitioDescargue);
        fila.appendChild(columnaCodigoProducto);
        fila.appendChild(columnaProducto);
        fila.appendChild(columnaPesoNeto);
        fila.appendChild(columnaPesoBruto);
        fila.appendChild(columnaPresentacion);
        fila.appendChild(columnaUnidades);
        fila.appendChild(columnaLote);
        fila.appendChild(columnaEstibas);
        fila.appendChild(columnaFechaCargue);
        fila.appendChild(columnaFechaEntrega);
        fila.appendChild(columnaTipoVehiculo);
        fila.appendChild(columnaCosto);
        fila.appendChild(columnaTarifa);
        fila.appendChild(columnaFechaRetiroContenedor);
        fila.appendChild(columnaBooking);
        fila.appendChild(columnaUnidadTransporte);
        fila.appendChild(columnaObservaciones);
        // fila.appendChild(columnaPriordad);
        // fila.appendChild(columnaProcesoPedido);
        // fila.appendChild(columnaEstadoPedido);
        // fila.appendChild(columnaEstadoPublicacion);
        // fila.appendChild(columnaEstadoAsignacion);
        // fila.id = `fila_${element.numdoc_solicitud}`;



        tbody.appendChild(fila);
      });

      // Agrega este código después de crear todas las filas (fuera del forEach pero dentro del if(data))
      document.querySelectorAll('.menu_tabla').forEach(toggle => {
        toggle.addEventListener('click', function () {

          const rowId = this.getAttribute('data-row-id');
          const row = document.getElementById(rowId);

          // Remover clase de todas las filas
          document.querySelectorAll('tr').forEach(r => r.classList.remove('selected-row'));

          // Agregar clase a la fila seleccionada
          if (row) row.classList.add('selected-row');
        });
      });


    } else {
      console.log('else');
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
    // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}

// Función para crear badge
function createBadge(text, type) {
  return `
    <span class="badge badge-phoenix fs-10 badge-phoenix-${type}">
      <span class="badge-label">${text}</span>
      <span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span>
    </span>`;
}

// --- Estados de Publicación ---
window.estadosPublicacion = {
  'Pendiente': 'secondary',
  'Publicado': 'info',
  'Cancelado': 'danger',
  'Aceptado': 'success',
  'Pendiente Respuesta': 'warning',
  'Completado': 'success'
};

// --- Estados de Asignación ---
window.estadosAsignacion = {
  'Pendiente': 'secondary',
  'Asignado': 'info',
  'Cancelado': 'danger',
  'Aceptado': 'success',
  'Ganador': 'success',
  'Completado': 'success'
};

// --- Estados de Prioridad ---
window.estadosPrioridad = {
  'Prioritaria': 'warning',
  'No Marcada': 'info'
};

// --- Estados del Proceso ---
window.estadosProceso = {
  'Pendiente': 'secondary',
  'Asignación': 'warning',
  'Publicación': 'danger',
  'Completado': 'success',
  'Cancelado': 'danger'
};

// --- Estados de Trazabilidad ---
// window.estadosTrazabilidad = {
//   'Llegada Cargue': 'info',
//   'Cargue': 'info',
//   'Salida Cargue': 'info',
//   'Inicio Ruta': 'primary',
//   'Transito': 'primary',
//   'Llegada Descargue': 'info',
//   'Descargue': 'info',
//   'Salida Descargue': 'info',
//   'Pendiente Iniciar': 'danger',
//   'Sin Asignar': 'secondary',
//   'Iniciado': 'primary',
//   'Completado': 'success',
// };

// Función para obtener el estado corregido
function obtenerEstadoTrazabilidad(tipoTrazabilidad) {
  let textoTrazabilidad = tipoTrazabilidad;

  // Si viene "Completado", lo cambiamos a "Asignado"
  if (tipoTrazabilidad === 'Completado') {
    textoTrazabilidad = 'Asignado';
  }

  // Devolvemos el texto corregido y el color
  return {
    texto: textoTrazabilidad,
    color: window.estadosTrazabilidad[textoTrazabilidad] || 'secondary'
  };
}

window.estadosTrazabilidad = {
  'Llegada Cargue': 'info',
  'Cargue': 'info',
  'Salida Cargue': 'info',
  'Inicio Ruta': 'primary',
  'Transito': 'primary',
  'Llegada Descargue': 'info',
  'Descargue': 'info',
  'Salida Descargue': 'info',
  'Pendiente Iniciar': 'danger',
  'Sin Asignar': 'secondary',
  'Iniciado': 'primary',
  'Asignado': 'success',
  'Postulado': 'warning'
};

// Agrega esto al final de tu archivo JavaScript o en tu CSS
const style = document.createElement('style');
style.textContent = `
  .selected-row {
    background-color: #d8ddf9 !important;
    /*box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);*/
  }
`;
document.head.appendChild(style);


async function cargarLineaTiempo(PedidoId) {
  try {
    let formData = new FormData();
    formData.append("PedidoId", PedidoId);

    let response = await fetch($('#base_url').val() + 'torrecontrol/Linea_Tiempo_pedidos', {
      method: "POST",
      body: formData
    });

    let data = await response.json();

    const etapasOrdenadas = [
      "Asignado",
      "Llega vehículo",
      "En cargue",
      "En ruta",
      "Entregado"
    ];

    const contenedor = document.getElementById("lineaTiempo");
    contenedor.innerHTML = "";
    contenedor.className = "d-flex justify-content-between position-relative";

    let ultimaIndex = -1;

    //FechaEstimada
    const etapas = data.etapas;

    const etapaConFecha = Object.values(etapas).find(etapa => etapa.fecha_entrega_estimada);

    const fechaEstimada = etapaConFecha?.fecha_entrega_estimada || null;

    // document.getElementById("FechaEstimada").textContent = fechaEstimada ? `Fecha estimada entrega: ${new Date(fechaEstimada).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}` : "Fecha estimada no disponible";
    document.getElementById("FechaEstimada").textContent = `Fecha estimada entrega: ${fechaEstimada ? fechaEstimada : "No disponible"}`;

    etapasOrdenadas.forEach((etapa, index) => {
      const info = data.etapas[etapa];
      console.log("🚀 ~ etapasOrdenadas.forEach ~ info:", data.etapas)
      const step = document.createElement("div");
      step.className = "step";
      step.dataset.etapa = etapa;

      const circle = document.createElement("div");
      circle.className = "circle";

      if (info) {
        circle.classList.add("completed");
        ultimaIndex = index;
        circle.setAttribute("data-bs-toggle", "tooltip");
        circle.setAttribute("data-bs-placement", "bottom");
        circle.setAttribute("title", `📅 ${info.fecha_trazabilidad}\n📝 ${info.observacion}`);
      }

      step.appendChild(circle);

      const small = document.createElement("small");
      small.textContent = etapa;
      step.appendChild(small);

      if (info) {
        const fecha = document.createElement("div");
        fecha.className = "info-extra";
        fecha.textContent = info.fecha_trazabilidad;
        step.appendChild(fecha);

        // const obs = document.createElement("div");
        // obs.className = "info-extra";
        // obs.textContent = info.observacion;
        // step.appendChild(obs);
      }

      contenedor.appendChild(step);
    });

    const steps = contenedor.querySelectorAll(".step");
    if (steps.length && ultimaIndex >= 0) {
      const primer = steps[0].offsetLeft + steps[0].offsetWidth / 2;
      const ultimo = steps[ultimaIndex].offsetLeft + steps[ultimaIndex].offsetWidth / 2;

      // Línea verde (completado)
      const linea = document.createElement("div");
      linea.className = "progreso-linea";
      linea.style.left = `${primer}px`;
      linea.style.width = `${ultimo - primer}px`;
      contenedor.appendChild(linea);

      // Línea amarilla (etapa actual)
      if (ultimaIndex + 1 < steps.length) {
        const siguiente = steps[ultimaIndex + 1].offsetLeft + steps[ultimaIndex + 1].offsetWidth / 2;
        const lineaActual = document.createElement("div");
        lineaActual.className = "progreso-linea-actual";
        lineaActual.style.left = `${ultimo}px`;
        lineaActual.style.width = `${siguiente - ultimo}px`;
        contenedor.appendChild(lineaActual);
      }

      // Marcar la actual en naranja
      steps[ultimaIndex].querySelector(".circle").classList.remove("completed");
      steps[ultimaIndex].querySelector(".circle").classList.add("current");
    }

    // Activar tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));

  } catch (error) {
    console.error("Error en línea de tiempo:", error);
  }
}