const d = document;
const w = window;
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  // alert('Hola Mundo');
  despachos_activos();
  setInterval(() => {
    despachos_activos();
  }, 60000);
  // CARAGR LOS DESPACHOS ACTIVOS POR EL CLIENTE

  /* Verificar que filtro se va a trabajar para crear el informe */
  d.addEventListener('change', async e => {
    if (e.target.matches('#despachos') || e.target.matches('#despachos *')) {
      let padre = e.target.parentElement.parentElement;
      let numdoc_solicitud = padre.querySelector('#despachos').value;
      var filtro = d.getElementById('filtro').value;
      if (filtro === 'Fecha') {
        $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga independientemente del resultado
        let formdata = new FormData();
        formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
        formdata.append('fecha_final', d.getElementById('fecha_final').value);
        formdata.append('numdoc_solicitud', numdoc_solicitud);
        formdata.append('cliente_id', d.getElementById('cliente_id').value);
        formdata.append('filtro', d.getElementById('filtro').value);
        try {
          const response = await fetch($('#id_url_ajax').val() + 'cliente/List_detalles_Despachos', {
            method: 'POST',
            body: formdata,
            cache: 'no-cache',
          });

          const data = await response.json();
          let tbody = d.getElementById('tbody-despachos');
          tbody.innerHTML = '';
          data.forEach(element => {
            const fila = d.createElement('tr');

            const columnaPedidos = d.createElement('td');
            columnaPedidos.innerHTML = element.referencia;
            columnaPedidos.style.textAlign = 'left';
            // columnaPedidos.style.paddingLeft = '15px';

            const columnaOrdenCargue = d.createElement('td');
            columnaOrdenCargue.innerHTML = element.orden_cargue;
            columnaOrdenCargue.style.textAlign = 'left';
            // columnaOrdenCargue.style.paddingLeft = '15px';

            const columnaRemesa = d.createElement('td');
            // columnaRemesa.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
            columnaRemesa.innerHTML = element.remesa;
            columnaRemesa.style.textAlign = 'left';
            // columnaRemesa.style.paddingLeft = '15px';

            const columnaPlanRuta = d.createElement('td');
            // columnaPlanRuta.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
            if (element.plan_ruta === '') {
              columnaPlanRuta.innerHTML = element.plan_ruta;
              columnaPlanRuta.style.textAlign = 'left';
              // columnaPlanRuta.style.paddingLeft = '15px';
            } else {
              columnaPlanRuta.innerHTML = ` <a href="javascript:void(0);" style="text-decoration:none;" data-numplan="${element.plan_ruta}" id="btn_ver_mapa" Onclick="Cordenadas_plan_ruta('${element.plan_ruta}','${element.manifiesto}','${element.referencia}')">${element.manifiesto}</a>`;
              columnaPlanRuta.style.textAlign = 'left';
              // columnaPlanRuta.style.paddingLeft = '15px';
            }

            const columnaCumplido = d.createElement('td');
            // columnaCumplido.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
            columnaCumplido.innerHTML = 'Cumplido';
            columnaCumplido.style.textAlign = 'left';
            // columnaCumplido.style.paddingLeft = '15px';

            const columnaFechaCreacion = d.createElement('td');
            // columnaFechaCreacion.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
            columnaFechaCreacion.innerHTML = element.fecha_creacion;
            columnaFechaCreacion.style.textAlign = 'left';
            // columnaFechaCreacion.style.paddingLeft = '15px';

            const columnaUsuarioCreacion = d.createElement('td');
            // columnaUsuarioCreacion.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
            columnaUsuarioCreacion.innerHTML = element.usuario_creacion;
            columnaUsuarioCreacion.style.textAlign = 'left';
            // columnaUsuarioCreacion.style.paddingLeft = '15px';

            fila.appendChild(columnaPedidos);
            fila.appendChild(columnaOrdenCargue);
            fila.appendChild(columnaRemesa);
            fila.appendChild(columnaPlanRuta);
            fila.appendChild(columnaCumplido);
            fila.appendChild(columnaFechaCreacion);
            fila.appendChild(columnaUsuarioCreacion);
            tbody.appendChild(fila);
          });
        } catch (error) {
          console.error('Error en la primera solicitud:', error);
          throw error;
        } finally {
          $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
          // ListarDespachos(d.getElementById('fecha_inicial').value, d.getElementById('fecha_final').value, d.getElementById('cliente_id').value, d.getElementById('numdoc_predido').value, filtro);
        }
      } else if (filtro === 'Pedido') {
        $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga independientemente del resultado
        let formdata = new FormData();
        // formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
        // formdata.append('fecha_final', d.getElementById('fecha_final').value);
        formdata.append('numdoc_solicitud', numdoc_solicitud);
        formdata.append('cliente_id', d.getElementById('cliente_id').value);
        formdata.append('filtro', d.getElementById('filtro').value);
        try {
          const response = await fetch($('#id_url_ajax').val() + 'cliente/List_detalles_Despachos', {
            method: 'POST',
            body: formdata,
            cache: 'no-cache',
          });

          const data = await response.json();
          let tbody = d.getElementById('tbody-despachos');
          tbody.innerHTML = '';
          data.forEach(element => {
            const fila = d.createElement('tr');

            const columnaPedidos = d.createElement('td');
            columnaPedidos.innerHTML = element.referencia;
            columnaPedidos.style.textAlign = 'left';
            // columnaPedidos.style.paddingLeft = '15px';

            const columnaOrdenCargue = d.createElement('td');
            columnaOrdenCargue.innerHTML = element.orden_cargue;
            columnaOrdenCargue.style.textAlign = 'left';
            // columnaOrdenCargue.style.paddingLeft = '15px';

            const columnaRemesa = d.createElement('td');
            // columnaRemesa.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
            columnaRemesa.innerHTML = element.remesa;
            columnaRemesa.style.textAlign = 'left';
            // columnaRemesa.style.paddingLeft = '15px';

            const columnaPlanRuta = d.createElement('td');
            // columnaPlanRuta.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
            if (element.plan_ruta === '') {
              columnaPlanRuta.innerHTML = element.plan_ruta;
              columnaPlanRuta.style.textAlign = 'left';
              // columnaPlanRuta.style.paddingLeft = '15px';
            } else {
              columnaPlanRuta.innerHTML = ` <a href="javascript:void(0);" style="text-decoration:none;" data-numplan="${element.plan_ruta}" id="btn_ver_mapa" Onclick="Cordenadas_plan_ruta('${element.plan_ruta}','${element.manifiesto}','${element.referencia}')">${element.manifiesto}</a>`;
              columnaPlanRuta.style.textAlign = 'left';
              // columnaPlanRuta.style.paddingLeft = '15px';
            }

            const columnaCumplido = d.createElement('td');
            // columnaCumplido.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
            columnaCumplido.innerHTML = 'Cumplido';
            columnaCumplido.style.textAlign = 'left';
            // columnaCumplido.style.paddingLeft = '15px';

            const columnaFechaCreacion = d.createElement('td');
            // columnaFechaCreacion.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
            columnaFechaCreacion.innerHTML = element.fecha_creacion;
            columnaFechaCreacion.style.textAlign = 'left';
            // columnaFechaCreacion.style.paddingLeft = '15px';

            const columnaUsuarioCreacion = d.createElement('td');
            // columnaUsuarioCreacion.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
            columnaUsuarioCreacion.innerHTML = element.usuario_creacion;
            columnaUsuarioCreacion.style.textAlign = 'left';
            // columnaUsuarioCreacion.style.paddingLeft = '15px';

            fila.appendChild(columnaPedidos);
            fila.appendChild(columnaOrdenCargue);
            fila.appendChild(columnaRemesa);
            fila.appendChild(columnaPlanRuta);
            fila.appendChild(columnaCumplido);
            fila.appendChild(columnaFechaCreacion);
            fila.appendChild(columnaUsuarioCreacion);
            tbody.appendChild(fila);
          });
        } catch (error) {
          console.error('Error en la primera solicitud:', error);
          throw error;
        } finally {
          $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
          // ListarDespachos(d.getElementById('fecha_inicial').value, d.getElementById('fecha_final').value, d.getElementById('cliente_id').value, d.getElementById('numdoc_predido').value, filtro);
        }
      }
    }
  });

  d.addEventListener('click', async e => {
    if (e.target.matches('#filtrar') || e.target.matches('#filtrar *')) {
      var filtro = d.getElementById('filtro').value;
      if (filtro === '') {
        Swal.fire({
          title: 'Advertencia!',
          text: 'Debe seleccionar una opción del filtro.',
          icon: 'warning',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      } else {
        Swal.fire({
          title: 'Trazabilidad',
          text: '¿Está seguro de continuar?',
          icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#9FA6B2',
          confirmButtonColor: '#14A44D',
          confirmButtonText: 'Si',
          cancelButtonText: 'No',
          customClass: {
            popup: 'swal2-custom-font',
          },
        }).then(async result => {
          if (result.isConfirmed) {
            if (filtro === 'Fecha') {
              $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga independientemente del resultado
              let formdata = new FormData();
              formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
              formdata.append('fecha_final', d.getElementById('fecha_final').value);
              formdata.append('cliente_id', d.getElementById('cliente_id').value);
              // formdata.append('numdoc_predido', d.getElementById('numdoc_predido').value);
              formdata.append('filtro', d.getElementById('filtro').value);
              try {
                const response = await fetch($('#id_url_ajax').val() + 'cliente/list_pedidos', {
                  method: 'POST',
                  body: formdata,
                  cache: 'no-cache',
                });

                const data = await response.json();
                let tbody = d.getElementById('tbody-pedidos');
                tbody.innerHTML = '';
                data.forEach(element => {
                  const fila = d.createElement('tr');

                  const columnaPedidos = d.createElement('td');
                  columnaPedidos.innerHTML = element.numdoc;
                  columnaPedidos.style.textAlign = 'left';
                  // columnaPedidos.style.paddingLeft = '15px';

                  const columnaReferencia = d.createElement('td');
                  // columnaReferencia.innerHTML = element.referencia;
                  columnaReferencia.innerHTML = `<a  target="_black" href="${$('#id_url_ajax').val()}clientes_nuevo/detalle_pedidos/?cliente=${codificarBase64(
                    d.getElementById('cliente_id').value,
                  )}&numdoc=${codificarBase64(element.numdoc)}&solicitud_id=${codificarBase64(element.solicitud_id)}&idmenu=10" style="text-decoration:none;" data-numdoc="${codificarBase64(
                    element.numdoc,
                  )}" id="btn_ver_detalles_parametros_pedidos">${element.referencia}</a>`;
                  // columnaReferencia.innerHTML = `<a  target="_black" href="${$('#id_url_ajax').val()}clientes_nuevo/detalle_pedidos/?cliente=${codificarBase64(
                  //   d.getElementById('cliente_id').value,
                  // )}&numdoc=${codificarBase64(element.numdoc)}&solicitud_id=${codificarBase64(element.solicitud_id)}" style="text-decoration:none;" data-numdoc="${codificarBase64(
                  //   element.numdoc,
                  // )}" id="btn_ver_detalles_parametros_pedidos">${element.referencia}</a>`;
                  columnaReferencia.style.textAlign = 'left';
                  // columnaReferencia.style.paddingLeft = '15px';

                  const columnaFecha = d.createElement('td');
                  columnaFecha.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
                  columnaFecha.style.textAlign = 'left';
                  // columnaFecha.style.paddingLeft = '15px';

                  const columnaEstado = d.createElement('td');
                  columnaEstado.innerHTML = element.estado;
                  columnaEstado.style.textAlign = 'left';
                  if (element.estado === 'ACTIVO') {
                    columnaEstado.innerHTML = `<span class="label label-success">${element.estado}</span>`;
                  } else if (element.estado === 'CANCELADO') {
                    columnaEstado.innerHTML = `<span class="label label-danger">${element.estado}</span>`;
                  } else if (element.estado === 'EN PROCESO') {
                    columnaEstado.innerHTML = `<span class="label label-primary">${element.estado}</span>`;
                  } else if (element.estado === 'FINALIZADO') {
                    columnaEstado.innerHTML = `<span class="label label-warning">${element.estado}</span>`;
                  } else if (element.estado === 'INICIADO') {
                    columnaEstado.innerHTML = `<span class="label label-success">${element.estado}</span>`;
                  } else {
                    columnaEstado.innerHTML = `<span class="label label-info">${element.estado}</span>`;
                  }
                  // columnaEstado.style.paddingLeft = '15px';

                  fila.appendChild(columnaPedidos);
                  fila.appendChild(columnaReferencia);
                  fila.appendChild(columnaFecha);
                  fila.appendChild(columnaEstado);
                  tbody.appendChild(fila);
                });
              } catch (error) {
                console.error('Error en la primera solicitud:', error);
                throw error;
              } finally {
                $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
                ListarDespachos(d.getElementById('fecha_inicial').value, d.getElementById('fecha_final').value, d.getElementById('cliente_id').value, d.getElementById('numdoc_predido').value, filtro);
              }
            } else if (filtro === 'Pedido') {
              if (d.getElementById('numdoc_predido').value === '') {
                Swal.fire({
                  title: 'Advertencia!',
                  text: 'Debe ingresar un número de pedido.',
                  icon: 'warning',
                  customClass: {
                    popup: 'swal2-custom-font',
                  },
                });
                return;
              } else {
                $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga independientemente del resultado
                let formdata = new FormData();
                formdata.append('cliente_id', d.getElementById('cliente_id').value);
                formdata.append('numdoc_predido', d.getElementById('numdoc_predido').value);
                formdata.append('filtro', d.getElementById('filtro').value);
                try {
                  const response = await fetch($('#id_url_ajax').val() + 'cliente/list_pedidos', {
                    method: 'POST',
                    body: formdata,
                    cache: 'no-cache',
                  });

                  const data = await response.json();
                  let tbody = d.getElementById('tbody-pedidos');
                  tbody.innerHTML = '';
                  data.forEach(element => {
                    const fila = d.createElement('tr');

                    const columnaPedidos = d.createElement('td');
                    columnaPedidos.innerHTML = element.numdoc;
                    columnaPedidos.style.textAlign = 'left';
                    // columnaPedidos.style.paddingLeft = '15px';

                    const columnaReferencia = d.createElement('td');
                    // columnaReferencia.innerHTML = element.referencia;
                    columnaReferencia.innerHTML = `<a  target="_black" href="${$('#id_url_ajax').val()}clientes_nuevo/detalle_pedidos/?cliente=${codificarBase64(
                      d.getElementById('cliente_id').value,
                    )}&numdoc=${codificarBase64(element.numdoc)}&solicitud_id=${codificarBase64(element.solicitud_id)}&idmenu=10" style="text-decoration:none;" data-numdoc="${codificarBase64(
                      element.numdoc,
                    )}" id="btn_ver_detalles_parametros_pedidos">${element.referencia}</a>`;
                    // columnaReferencia.innerHTML = `<a  target="_black" href="${$('#id_url_ajax').val()}clientes_nuevo/detalle_pedidos/?cliente=${codificarBase64(
                    //   d.getElementById('cliente_id').value,
                    // )}&numdoc=${codificarBase64(element.numdoc)}&solicitud_id=${codificarBase64(element.solicitud_id)}" style="text-decoration:none;" data-numdoc="${codificarBase64(
                    //   element.numdoc,
                    // )}" id="btn_ver_detalles_parametros_pedidos">${element.referencia}</a>`;
                    columnaReferencia.style.textAlign = 'left';
                    // columnaReferencia.style.paddingLeft = '15px';

                    const columnaFecha = d.createElement('td');
                    columnaFecha.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
                    columnaFecha.style.textAlign = 'left';
                    // columnaFecha.style.paddingLeft = '15px';

                    const columnaEstado = d.createElement('td');
                    columnaEstado.innerHTML = element.estado;
                    columnaEstado.style.textAlign = 'left';
                    if (element.estado === 'ACTIVO') {
                      columnaEstado.innerHTML = `<span class="label label-success">${element.estado}</span>`;
                    } else if (element.estado === 'CANCELADO') {
                      columnaEstado.innerHTML = `<span class="label label-danger">${element.estado}</span>`;
                    } else if (element.estado === 'EN PROCESO') {
                      columnaEstado.innerHTML = `<span class="label label-primary">${element.estado}</span>`;
                    } else if (element.estado === 'FINALIZADO') {
                      columnaEstado.innerHTML = `<span class="label label-warning">${element.estado}</span>`;
                    } else if (element.estado === 'INICIADO') {
                      columnaEstado.innerHTML = `<span class="label label-success">${element.estado}</span>`;
                    } else {
                      columnaEstado.innerHTML = `<span class="label label-info">${element.estado}</span>`;
                    }
                    // columnaEstado.style.paddingLeft = '15px';

                    fila.appendChild(columnaPedidos);
                    fila.appendChild(columnaReferencia);
                    fila.appendChild(columnaFecha);
                    fila.appendChild(columnaEstado);
                    tbody.appendChild(fila);
                  });
                } catch (error) {
                  console.error('Error en la primera solicitud:', error);
                  throw error;
                } finally {
                  $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
                  // ListarDespachos(fecha_inicial, fecha_final, d.getElementById('cliente_id').value, d.getElementById('numdoc_predido').value, filtro);
                  ListarDespachos(
                    d.getElementById('fecha_inicial').value,
                    d.getElementById('fecha_final').value,
                    d.getElementById('cliente_id').value,
                    d.getElementById('numdoc_predido').value,
                    filtro,
                  );
                }
              }
            }
          }
        });
      }
    }
  });
});

async function ListarDespachos(fecha_inicial, fecha_final, cliente, numdoc_predido, filtro) {
  let formdata = new FormData();
  formdata.append('fecha_inicial', fecha_inicial);
  formdata.append('fecha_final', fecha_final);
  formdata.append('cliente_id', cliente);
  formdata.append('numdoc_predido', numdoc_predido);
  formdata.append('filtro', filtro);
  try {
    const response = await fetch($('#id_url_ajax').val() + 'cliente/list_despachos', {
      method: 'POST',
      body: formdata,
      cache: 'no-cache',
    });

    const data = await response.json();

    // Corregir el atributo selected en la opción por defecto
    document.getElementById('despachos').innerHTML = '<option value="" selected="selected">Seleccione despacho</option>';

    // Llenar el select con las opciones de la respuesta
    data.forEach(element => {
      $('#despachos').append('<option value="' + element.nundoc_solicitud + '">' + element.nundoc_solicitud + ' - PEDIDO:' + element.referencia + '</option>');
    });
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
  }
}

async function Cordenadas_plan_ruta(plan_ruta, manifiesto, referencia) {
  $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga independientemente del resultado
  let formdata = new FormData();
  formdata.append('plan_ruta', plan_ruta);
  formdata.append('manifiesto', manifiesto);
  formdata.append('referencia', referencia);
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
    d.getElementById('titulo_referencia').innerHTML = data.datos.referencia;
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

function codificarBase64(texto) {
  return btoa(texto);
}

// Función para decodificar Base64
function decodificarBase64(textoCodificado) {
  return atob(textoCodificado);
}

async function despachos_activos() {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'cliente/list_despachos_activos', {
      method: 'POST',
      // body: formdata,
      cache: 'no-cache',
    });

    const data = await response.json();
    // console.log('🚀 ~ data:', data);
    let tbody = d.getElementById('tbody-pedidos-activos');
    tbody.innerHTML = '';
    data.result.forEach(element => {
      const fila = d.createElement('tr');

      const columnaPedidos = d.createElement('td');
      columnaPedidos.innerHTML = element.referencia;
      columnaPedidos.style.textAlign = 'center';

      const columnaRuta = d.createElement('td');
      columnaRuta.innerHTML = element.nombre_plan;
      columnaRuta.style.textAlign = 'center';

      const columnaPlaca = d.createElement('td');
      columnaPlaca.innerHTML = element.placa;
      columnaPlaca.style.textAlign = 'center';
      // columnaRuta.style.paddingLeft = '15px';

      const columnaEstado = d.createElement('td');
      if (element.trazabilidad_id === 3 && element.estado_actividad === 'EN GESTION') {
        columnaEstado.innerHTML = `Vehiculo en Punto de Cargue`;
        columnaEstado.style.backgroundColor = `#E4A11B`;
      } else if (element.trazabilidad_id === 4 && element.estado_actividad === 'EN GESTION') {
        columnaEstado.innerHTML = `Vehiculo Cargando`;
        columnaEstado.style.backgroundColor = `#54B4D3`;
      } else if (element.trazabilidad_id === 9 && element.estado_actividad === 'EN GESTION') {
        columnaEstado.innerHTML = `Vehiculo Inicio Ruta`;
        columnaEstado.style.backgroundColor = `#90CAF9`;
        // columnaEstado.style.color = `#FFFFFF`;
        columnaEstado.style.fontSize = `15px`;
      } else if (element.trazabilidad_id === 10 && element.estado_actividad === 'EN GESTION') {
        columnaEstado.innerHTML = `Vehiculo en Transito`;
        columnaEstado.style.backgroundColor = `#DCE775`;
        // columnaEstado.style.color = `#FFFFFF`;
        columnaEstado.style.fontSize = `15px`;
      } else if (element.trazabilidad_id === 11 && element.estado_actividad === 'EN GESTION') {
        columnaEstado.innerHTML = `Vehiculo en Punto de Descargue`;
        columnaEstado.style.backgroundColor = `#18FFFF`;
        // columnaEstado.style.color = `#FFFFFF`;
        columnaEstado.style.fontSize = `15px`;
      } else if (element.trazabilidad_id === 12 && element.estado_actividad === 'EN GESTION') {
        columnaEstado.innerHTML = `Vehiculo en proceso de Descargue`;
        columnaEstado.style.backgroundColor = `#FFD54F`;
        // columnaEstado.style.color = `#FFFFFF`;
        columnaEstado.style.fontSize = `15px`;
      } else if (
        
        element.estado_actividad === 'COMPLETADO'
      ) {
        columnaEstado.innerHTML = `Finalizado`;
        columnaEstado.style.backgroundColor = `#14A44D`;
        // columnaEstado.style.color = `#FFFFFF`;
        columnaEstado.style.fontSize = `15px`;
      }else{
        alert("hola mundo");
      }
      columnaEstado.style.textAlign = 'center';
      // columnaRuta.style.paddingLeft = '15px';

      fila.appendChild(columnaPedidos);
      fila.appendChild(columnaRuta);
      fila.appendChild(columnaPlaca);
      fila.appendChild(columnaEstado);
      // fila.appendChild(columnaFecha);
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    // $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
  }
}
