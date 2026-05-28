window.VENTANA = null; // Variable global para almacenar el ID
window.map;
// Definir la función initScript globalmente tbl_trazabilidad_recursos_tr
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

  const hoy = new Date();
  const opciones = { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" };

  // Formatear la fecha a "YYYY-MM-DD"
  const fechaColombia = new Intl.DateTimeFormat("es-CO", opciones)
    .format(hoy)
    .split("/")
    .reverse()
    .join("-");

  Listar_trazabilidad(fechaColombia, fechaColombia, window.VENTANA);

  document.addEventListener("click", async (e) => {

    if (e.target.matches(`#campo-${window.VENTANA}-buscar`) || e.target.matches(`#campo-${window.VENTANA}-buscar *`)) {

      let fecha_inicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value;
      let fecha_final = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value;
      Listar_trazabilidad(fecha_inicial, fecha_final);
    }

    if (e.target.matches("#btn_detalle_trazabilidad") || e.target.matches("#btn_detalle_trazabilidad *")) {
      let Enlace = e.target.closest("#btn_detalle_trazabilidad");
      let numdoc_trazabilidad = Enlace.getAttribute("data-id");
      let ServicioId = Enlace.getAttribute("data-ServicioId");
      let RecursoId = Enlace.getAttribute("data-RecursoId");

      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Detalle de solicitud de servicio N°` + numdoc_trazabilidad);
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
                  <td class='text-center' style='color:black;width: auto; white-space: nowrap;'>${servicio.fecha_hora_seguimiento}</td>
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

          //   map = new Map(document.getElementById("map"), {
          //     center: { lat: 4.5709, lng: -74.2973 },
          //     zoom: 5.5,
          //     gestureHandling: "greedy",
          //     mapId: 'db5350020424d6c4'
          //   });

          //   data.forEach(function (punto) {
          //     console.log("🚀 ~ punto:", parseFloat(punto.latitud))

          //     new AdvancedMarkerElement({
          //       position: { lat: parseFloat(punto.latitud), lng: parseFloat(punto.longitud) },
          //       map: map,
          //       title: punto.sitio_seguimiento,
          //     });
          //   });
          // }

          // let map;

          // async function initMap() {
          //   const { Map } = await google.maps.importLibrary("maps");
          //   const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

          //   map = new Map(document.getElementById("map"), {
          //     center: { lat: 4.5709, lng: -74.2973 }, // Colombia
          //     zoom: 5.5,
          //     gestureHandling: "greedy",
          //     mapId: "db5350020424d6c4"
          //   });

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
          // }

          // async function initMap() {
          //   const { Map, Polyline } = await google.maps.importLibrary("maps");
          //   const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

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

          //   // Crear el array de coordenadas para el Polyline
          //   const path = data.map(punto => ({
          //     lat: parseFloat(punto.latitud),
          //     lng: parseFloat(punto.longitud)
          //   }));

          //   // Dibujar la línea
          //   const ruta = new google.maps.Polyline({
          //     path: path,
          //     geodesic: true,
          //     strokeColor: "#FF0000",   // Color rojo
          //     strokeOpacity: 1.0,
          //     strokeWeight: 2,
          //   });

          //   ruta.setMap(map);
          // }

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
          //       title: punto.fecha_hora,
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

          // initMap();

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


    if (e.target.matches("#btn_detalle_trazabilidad_peididos") || e.target.matches("#btn_detalle_trazabilidad_peididos *")) {
      let Enlace = e.target.closest("#btn_detalle_trazabilidad_peididos");
      let RecursoId = Enlace.getAttribute("data-RecursoId");

      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Detalle de solicitud de servicio N°` + RecursoId);

      try {
        let formData = new FormData();
        formData.append("RecursoId", RecursoId);

        let response = await fetch($('#base_url').val() + 'torrecontrol/detalle_trazabilidad_pedidos', {
          method: "POST",
          body: formData
        });

        let data = await response.json();
        if (data && data.length > 0) {
          let accordionHTML = `<div class="accordion" id="accordionExample">`;

          data.forEach((pedido, index) => {
            const cleanId = `collapse${pedido.numdoc_solicitud}`; // ID único para cada pedido

            accordionHTML += `
              <div class="accordion-item">
                <h2 class="accordion-header" id="heading${pedido.numdoc_solicitud}">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${cleanId}" aria-expanded="false" aria-controls="${cleanId}" Onclick="accionesDetalleTrazabilidad(this,${pedido.numdoc_solicitud})">
                    Pedido: ${pedido.referencia_pedido}
                  </button>
                </h2>
                <div id="${cleanId}" class="accordion-collapse collapse" aria-labelledby="heading${pedido.numdoc_solicitud}" data-bs-parent="#accordionExample">
                  <div class="accordion-body pt-0">
                    <!-- Aquí puedes agregar más información interna si quieres 
                    <p><strong>Solicitud #:</strong> ${pedido.numdoc_solicitud}</p>-->

                    <div class="table-responsive scrollbar">
                      <table id='table2' class='table table-bordered table-sm' data-page-length='100' style="font-size:11px;">
                        <thead>
                          <tr>
                            <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Referencia</th>
                            <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Tipo Trazabilidad</th>
                            <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Observación</th>
                            <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Usuario</th>
                            <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Fecha</th>
                            <th class='text-center' style='color:black;width: auto; white-space: nowrap;'>Soporte</th>
                          </tr>
                        </thead>
                        <tbody id='tbl_trazabilidad_pedidos_tr${pedido.numdoc_solicitud}' class='text-center'>
                          <tr>
                            <td colspan="11" class="text-center" style="font-size:15px;font-weight:bold;">
                              <img src="<?= BASE_URL ?>public/img/nexos_loading.gif" height="25" width="25" id="load_info2" style="display: none;"> Esperando Información
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            `;
          });

          accordionHTML += `</div>`;

          myOffcanvas.updateContent(accordionHTML);
        } else {
          myOffcanvas.updateContent(`<div class="text-danger text-center">No hay pedidos asociados.</div>`);
        }

        myOffcanvas.show();
      } catch (error) {
        console.error("Error al obtener detalle de pedidos:", error);
        myOffcanvas.updateContent(`<div class="text-danger text-center">Error al cargar pedidos del recurso</div>`);
      }


      myOffcanvas.show();

    } else {
      console.log('else');
    }

  });

  document.addEventListener('change', async e => {
    if (e.target.matches(`#campo-${window.VENTANA}-modalidad`) || e.target.matches(`#campo-${window.VENTANA}-modalidad *`)) {
      let valor = document.getElementById(`campo-${window.VENTANA}-modalidad`).value.trim();
      let fechaInicio = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`).value.trim();
      let fechaFinal = document.getElementById(`campo-${window.VENTANA}-fecha_final`).value.trim();
      Listar_trazabilidad(fechaInicio, fechaFinal, valor);
    }
  });

};

async function Listar_trazabilidad(fecha_inicial, fecha_final, valor) {
  /* Funcion para enviar los datos */
  let dato = new FormData();
  dato.append('fecha_inicial', fecha_inicial);
  dato.append('fecha_final', fecha_final);
  dato.append('valor', valor === 'undefined' ? '' : document.getElementById(`campo-${window.VENTANA}-modalidad`).value.trim());
  // dato.append('ventana', ventana);
  // dato.append('proveedor_id', document.getElementById('proveedor_id').value);
  try {
    const response = await fetch($('#base_url').val() + 'torrecontrol/listar_trazabilidad', {
      method: 'POST',
      body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tbl_trazabilidad_recursos_tr');
      tbody.innerHTML = '';
      // let tbody1 = document.getElementById('tbl_trazabilidad_pedidos_tr');
      // tbody1.innerHTML = '';

      data.resultado_recursos.forEach(element => {
        const fila = document.createElement('tr');

        const columnaNundocSolicitud = document.createElement('td');
        columnaNundocSolicitud.innerHTML = `
          <div class="dropdown">
            <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.referencias_pedido}</a>
            <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
              <a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad" data-id="${element.numdoc_trazabilidad}" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.ServicioId}"><span class="uil uil-transaction"></span> Detalle trazabilidad</a>
              <a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad_peididos" data-RecursoId="${element.maestro_id}" ><span class="uil uil-transaction"></span> Detalle trazabilidad pedidos</a>
            </div>
          </div>
          `;

        const columnaModalidad = document.createElement('td');
        columnaModalidad.innerHTML = element.modalidad;
        columnaModalidad.style.width = 'auto';
        columnaModalidad.style.whiteSpace = 'nowrap';

        const columnaRecurso = document.createElement('td');
        columnaRecurso.innerHTML = element.recurso_id;
        columnaRecurso.style.width = 'auto';
        columnaRecurso.style.whiteSpace = 'nowrap';

        const columnaProceso = document.createElement('td');
        columnaProceso.innerHTML = element.tipo_servicio;
        columnaProceso.style.width = 'auto';
        columnaProceso.style.whiteSpace = 'nowrap';

        const columnaReferencia = document.createElement('td');
        columnaReferencia.innerHTML = element.referencia;
        columnaReferencia.style.width = 'auto';
        columnaReferencia.style.whiteSpace = 'nowrap';

        const columnaCedula = document.createElement('td');
        columnaCedula.innerHTML = element.cedula_conductor;
        columnaCedula.style.width = 'auto';
        columnaCedula.style.whiteSpace = 'nowrap';

        const columnaNombreConductor = document.createElement('td');
        columnaNombreConductor.innerHTML = element.nombre_conductor;
        columnaNombreConductor.style.width = 'auto';
        columnaNombreConductor.style.whiteSpace = 'nowrap';

        const columnaNotaSeguimiento = document.createElement('td');
        columnaNotaSeguimiento.innerHTML = element.nota_seguimiento;
        columnaNotaSeguimiento.style.width = 'auto';
        columnaNotaSeguimiento.style.whiteSpace = 'nowrap';

        const columnaSitioSeguimiento = document.createElement('td');
        columnaSitioSeguimiento.innerHTML = element.sitio_seguimiento;
        columnaSitioSeguimiento.style.width = 'auto';
        columnaSitioSeguimiento.style.whiteSpace = 'nowrap';

        const columnaFecha = document.createElement('td');
        columnaFecha.innerHTML = element.fecha_ultima, '-', element.hora_ultima;
        columnaFecha.style.width = 'auto';
        columnaFecha.style.whiteSpace = 'nowrap';

        // const columnaFecha = document.createElement('td');
        // columnaFecha.innerHTML = element.Fecha_trazabilidad;
        // columnaFecha.style.width = 'auto';
        // columnaFecha.style.whiteSpace = 'nowrap';

        fila.appendChild(columnaNundocSolicitud);
        fila.appendChild(columnaModalidad);
        fila.appendChild(columnaProceso);
        fila.appendChild(columnaReferencia);
        fila.appendChild(columnaCedula);
        fila.appendChild(columnaNombreConductor);
        fila.appendChild(columnaNotaSeguimiento);
        fila.appendChild(columnaSitioSeguimiento);
        fila.appendChild(columnaFecha);
        // fila.appendChild(columnaProceso);
        // fila.appendChild(columnaRecurso);
        // fila.appendChild(columnaFecha);
        tbody.appendChild(fila);
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


async function accionesDetalleTrazabilidad(param, SolicitudeId) {
  /* Funcion para enviar los datos */
  let dato = new FormData();
  dato.append('SolicitudeId', SolicitudeId);

  try {
    const response = await fetch($('#base_url').val() + 'torrecontrol/Listar_detalle_trazabilidad_pedidos', {
      method: 'POST',
      body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById(`tbl_trazabilidad_pedidos_tr${SolicitudeId}`);
      tbody.innerHTML = '';

      /* Trazabilidad de los pedidos */
      data.forEach(element => {
        const fila2 = document.createElement('tr');

        // Columna Referencia
        const columnaReferencia = document.createElement('td');
        columnaReferencia.innerHTML = `N° ${element.referencia}`;

        // Columna Proceso
        const columnaTipoTrazabilidad = document.createElement('td');
        columnaTipoTrazabilidad.textContent = element.tipo_trazabilidad;
        columnaTipoTrazabilidad.style.whiteSpace = 'nowrap';

        const columnaObservacion = document.createElement('td');
        columnaObservacion.textContent = element.observacion;
        columnaObservacion.style.whiteSpace = 'nowrap';

        // Columna Fecha y Hora
        const columnaFechaHora = document.createElement('td');
        columnaFechaHora.textContent = element.hora_registro;
        columnaFechaHora.style.whiteSpace = 'nowrap';

        // Columna Usuario
        const columnaUsuario = document.createElement('td');
        columnaUsuario.textContent = element.usuario;
        columnaUsuario.style.whiteSpace = 'nowrap';

        // Columna Documento (Evidencia)
        const columnaEvidencia = document.createElement('td');
        if (element.evidencia) {
          columnaEvidencia.innerHTML = `
                  <a href="${$('#base_url').val()}${element.evidencia}" target="_blank" class="btn btn-outline-primary btn-sm me-1 px-1 py-0">
                    <i class="uil-file-download-alt"></i> Ver Documento
                  </a>
                `;
        } else {
          columnaEvidencia.innerHTML = `<span class="badge bg-secondary">Sin Documento</span>`;
        }

        // Agregar todas las columnas a la fila2
        fila2.appendChild(columnaReferencia);
        fila2.appendChild(columnaTipoTrazabilidad);
        fila2.appendChild(columnaObservacion);
        fila2.appendChild(columnaFechaHora);
        fila2.appendChild(columnaUsuario);
        fila2.appendChild(columnaEvidencia);

        // Agregar fila2 al tbody
        tbody.appendChild(fila2);
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
