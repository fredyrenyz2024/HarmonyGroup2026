const d = document;
const w = window;

document.addEventListener('DOMContentLoaded', e => {
  let params1 = new URLSearchParams(location.search);
  let plan_ruta = params1.get('plan_ruta');
  console.log('🚀 ~ plan_ruta:', plan_ruta);
  let manifiesto = params1.get('manifiesto');
  console.log('🚀 ~ manifiesto:', manifiesto);
  Cordenadas_plan_ruta(plan_ruta, manifiesto);
});

async function Cordenadas_plan_ruta(plan_ruta, manifiesto) {
  $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga independientemente del resultado
  let formdata = new FormData();
  formdata.append('plan_ruta', plan_ruta);
  formdata.append('manifiesto', manifiesto);
  // formdata.append('referencia', referencia);
  try {
    const response = await fetch($('#id_url_ajax').val() + 'cliente/plan_ruta', {
      method: 'POST',
      body: formdata,
      cache: 'no-cache',
    });

    const data = await response.json();
    let map;
    let markers = [];

    let latori, latdes, longori, longdes, codigo_pla;
    let isFirst = true;
    let pcarraylat = [];
    let pcarraylong = [];
    let namepc = [];
    var st, sm;

    var t = 0;
    data.cordenadas.forEach(element => {
      if (isFirst) {
        latori = element.latitud_origen;
        latdes = element.latitud_destino;
        longori = element.longitud_origen;
        longdes = element.longitud_destino;
        codigo_pla = element.cod_plan;

        /* Punto actual */
        st = parseFloat(element.latitud_actual);
        sm = parseFloat(element.longitud_actual);
        isFirst = false;
      }

      pcarraylat[t] = [element.lat];
      pcarraylong[t] = [element.lng];
      namepc[t] = [element.nombre_punto];
      t++;
    });
    // console.log(data.datos.referencia);
    d.getElementById('titulo_referencia').innerHTML = manifiesto;
    if (data.datos.result) {
      d.getElementById('nombre_plan').innerHTML = data.datos.result[0].nombre_plan;
    } else {
      d.getElementById('nombre_plan').innerHTML = 'Esperando Información';
    }

    /* Pintas todas las notas del controlador */
    let tbody = d.getElementById('tbody_tiempos');
    tbody.innerHTML = '';
    data.datos.result.forEach(element => {
      const fila = d.createElement('tr');

      const columnaIdPunto = d.createElement('td');
      columnaIdPunto.innerHTML = element.id;
      columnaIdPunto.style.textAlign = 'left';
      // columnaIdPunto.style.paddingLeft = '15px';

      const columnaTipoSeguimiento = d.createElement('td');
      columnaTipoSeguimiento.innerHTML = element.tipo_seguimiento;
      columnaTipoSeguimiento.style.textAlign = 'left';
      // columnaTipoSeguimiento.style.paddingLeft = '15px';

      const columnaNombrePunto = d.createElement('td');
      columnaNombrePunto.innerHTML = element.nombre_punto;
      columnaNombrePunto.style.textAlign = 'left';
      // columnaNombrePunto.style.paddingLeft = '15px';

      const columnaFechaNota = d.createElement('td');
      columnaFechaNota.innerHTML = element.fecha_nota;
      columnaFechaNota.style.textAlign = 'left';
      // columnaFechaNota.style.paddingLeft = '15px';

      const columnaUsuarioNota = d.createElement('td');
      columnaUsuarioNota.innerHTML = element.usuario;
      columnaUsuarioNota.style.textAlign = 'left';
      // columnaUsuarioNota.style.paddingLeft = '15px';

      fila.appendChild(columnaIdPunto);
      fila.appendChild(columnaTipoSeguimiento);
      fila.appendChild(columnaNombrePunto);
      fila.appendChild(columnaFechaNota);
      fila.appendChild(columnaUsuarioNota);
      tbody.appendChild(fila);
    });

    initMap(latori, latdes, longori, longdes, pcarraylat, pcarraylong, namepc, codigo_pla, st, sm);
    setInterval(initMap(latori, latdes, longori, longdes, pcarraylat, pcarraylong, namepc, codigo_pla, st, sm), 60000);

    // data.forEach(element => {});
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    // ListarDespachos(d.getElementById('fecha_inicial').value, d.getElementById('fecha_final').value, d.getElementById('cliente_id').value, d.getElementById('numdoc_predido').value, filtro);
  }
}

let map;
let markers = [];
async function initMap(latori, latdes, lonori, londes, pcarraylat, pcarraylong, namepc, codigo_pla, st, sm) {
  var latori_1 = parseFloat(latori);
  var latdes_1 = parseFloat(latdes);
  var lonori_1 = parseFloat(lonori);
  var londes_1 = parseFloat(londes);

  var pcarraylat_1 = pcarraylat;
  var pcarraylong_1 = pcarraylong;
  var namepc_1 = namepc;

  var coord_ori = {
    lat: latori_1,
    lng: lonori_1,
  };
  var coord_des = {
    lat: latdes_1,
    lng: londes_1,
  };

  let map;

  var coord_pais = {
    lat: 4.70971,
    lng: -74.06775,
  };
  var code = {
    lat: 4.70971,
    lng: -74.06775,
  };

  const {AdvancedMarkerElement, PinElement} = await google.maps.importLibrary('marker');

  var mapc = new google.maps.Map(document.getElementById('mapgeografico'), {
    zoom: 3,
    center: code,
    gestureHandling: 'greedy',
    zoomControl: false,
  });

  // Trafico en la rutas
  var trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(mapc);
  const transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(mapc);

  var marker = new google.maps.marker.AdvancedMarkerElement({
    position: coord_ori,
    map: mapc,
  });

  marker = new google.maps.marker.AdvancedMarkerElement({
    position: coord_des,
    map: mapc,
  });

  var lati;
  var longi;
  var objConfigDR = {
    map: mapc,
  };

  for (let b = 0; b < pcarraylat_1.length; b++) {
    lati = parseFloat(pcarraylat_1[b]);
    longi = parseFloat(pcarraylong_1[b]);
    var puntosIntermedios = [
      {
        location: new google.maps.LatLng(lati, longi),
      }, // Ejemplo de punto intermedio
      // Agrega más puntos intermedios según sea necesario
    ];
    var objConfigDS = {
      origin: coord_ori,
      destination: coord_des,
      waypoints: puntosIntermedios,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    //calcular la ruta con los datos satelitales de google
    var ds = new google.maps.DirectionsService();
    var dr = new google.maps.DirectionsRenderer(objConfigDR);
    ds.route(objConfigDS, fnRutear);

    function fnRutear(resultados, status) {
      if (status == 'OK') {
        dr.setDirections(resultados);
      }
    }
  }

  cordenadas = {
    lat: st,
    lng: sm,
  };

  // // Datos para dibujar punto actual del seguimiento
  // marker = new google.maps.marker.AdvancedMarkerElement({
  //   position: cordenadas
  //     // , icon: 'http://localhost/mvcLuisMiguel/views/layout/assets/img/camion-de-carga.png'
  //   , title: ''
  //   , map: mapc
  // , });

  var marketpc = new google.maps.Marker({
    position: cordenadas,
    icon: $('#id_url_ajax').val() + 'views/layout/assets/img/camion-de-carga.png',
    title: '',
    map: mapc,
  });

  // // Verificar si la variable 'array' está definida y tiene un valor
  // Verificar si la variable 'array' está definida y tiene un valor
  if (typeof pcarraylat_1 !== 'undefined' && pcarraylat_1 !== null && typeof pcarraylong_1 !== 'undefined' && pcarraylong_1 !== null) {
    // Acceder a la propiedad 'length' solo si 'array' es válido
    var length = pcarraylat_1.length;
    var lengthlong = pcarraylong_1.length;
    // Realizar otras operaciones con la longitud

    for (var a = 0; a <= length; a++) {
      st = parseFloat(pcarraylat_1[a]);
      sm = parseFloat(pcarraylong_1[a]);
      nom = String(namepc_1[a]);
      cordenadas = {
        lat: st,
        lng: sm,
      };
      const contentString = `
      <div id="content">
        <div id="siteNotice"><h4 id="firstHeading" class="firstHeading">${nom}</h4></div>
          <div id="bodyContent"><b>Punto: </b>${namepc_1[a]}
          <p><b>Latitud: </b>${cordenadas.lat} | <b>Longitud: </b> ${cordenadas.lng}</p>
        </div>
      </div>
      `;
      const infowindow = new google.maps.InfoWindow({
        content: contentString,
        // maxWidth: 300,
        ariaLabel: 'Uluru',
      });

      var marker = new google.maps.Marker({
        position: cordenadas,
        map: mapc,
        title: nom,
      });

      marker.addListener('click', () => {
        infowindow.open({
          anchor: marker,
          map: mapc,
        });
      });
    }
  }
  // punto_control(codigo_pla);
}
