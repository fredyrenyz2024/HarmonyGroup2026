const d = document;
const w = window;
d.addEventListener('DOMContentLoaded', e => {
  d.addEventListener('change', e => {
    if (e.target.matches('#filtro') || e.target.matches('#filtro *')) {
      filtro = e.target.value;
      if (filtro === 'Fecha') {
        d.getElementById('criterio_busqueda').disabled = true;
        d.getElementById('criterio_busqueda').value = '';
      } else if (filtro !== 'Fecha') {
        d.getElementById('criterio_busqueda').disabled = false;
      }
    }
  });

  d.addEventListener('click', async e => {
    if (e.target.matches('#filtrar') || e.target.matches('#filtrar *')) {
      // alert("Please enter your");
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
          $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga independientemente del resultado
          let formdata = new FormData();
          formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
          formdata.append('fecha_final', d.getElementById('fecha_final').value);
          formdata.append('criterio', d.getElementById('criterio_busqueda').value);
          // formdata.append('numdoc_predido', numdoc_predido);
          formdata.append('filtro', filtro);
          try {
            const response = await fetch($('#id_url_ajax').val() + 'cliente/Tracking', {
              method: 'POST',
              body: formdata,
              cache: 'no-cache',
            });

            const data = await response.json();

            if (data.result.length > 0) {
              let tbody = d.getElementById('tbody-despachos');
              tbody.innerHTML = '';
              let cont = 1;
              data.result.forEach(element => {
                const fila = d.createElement('tr');

                const columnaPedidos = d.createElement('td');
                columnaPedidos.innerHTML = cont++;
                columnaPedidos.style.textAlign = 'center';
                // columnaPedidos.style.paddingLeft = '15px';

                const columnaOrdenCargue = d.createElement('td');
                columnaOrdenCargue.innerHTML = element.orden_cargue;
                columnaOrdenCargue.style.textAlign = 'center';
                // columnaOrdenCargue.style.paddingLeft = '15px';

                const columnaRemesa = d.createElement('td');
                // columnaRemesa.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
                columnaRemesa.innerHTML = element.remesa;
                columnaRemesa.style.textAlign = 'center';
                // columnaRemesa.style.paddingLeft = '15px';

                const columnaPlanRuta = d.createElement('td');
                // columnaPlanRuta.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
                if (element.plan_ruta === '') {
                  columnaPlanRuta.innerHTML = element.plan_ruta;
                  columnaPlanRuta.style.textAlign = 'center';
                  // columnaPlanRuta.style.paddingLeft = '15px';
                } else {
                  columnaPlanRuta.innerHTML = ` <a href="javascript:void(0);" style="text-decoration:none;" data-numplan="${element.plan_ruta}" id="btn_ver_mapa" Onclick="abrir_trazabilidad('${element.plan_ruta}','${element.manifiesto}')">${element.manifiesto}</a>`;
                  columnaPlanRuta.style.textAlign = 'center';
                  // columnaPlanRuta.style.paddingLeft = '15px';
                }

                const columnaPlaca = d.createElement('td');
                // columnaPlaca.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
                columnaPlaca.innerHTML = element.placa;
                columnaPlaca.style.textAlign = 'center';
                // columnaPlaca.style.paddingLeft = '15px';

                const columnaCumplido = d.createElement('td');
                // columnaCumplido.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
                columnaCumplido.innerHTML = '<b>Origen: </b>' + element.Origen + '<br>' + '<b>Destino: </b>' + element.Destino;
                columnaCumplido.style.textAlign = 'center';
                // columnaCumplido.style.paddingLeft = '15px';

                const columnaFechaCreacion = d.createElement('td');
                // columnaFechaCreacion.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
                columnaFechaCreacion.innerHTML = element.fecha_creacion;
                columnaFechaCreacion.style.textAlign = 'center';
                // columnaFechaCreacion.style.paddingLeft = '15px';

                const columnaUsuarioCreacion = d.createElement('td');
                // columnaUsuarioCreacion.innerHTML = element.fecha_creacion + ' - ' + element.hora_creacion;
                columnaUsuarioCreacion.innerHTML = element.usuario_creacion;
                columnaUsuarioCreacion.style.textAlign = 'center';
                // columnaUsuarioCreacion.style.paddingLeft = '15px';

                fila.appendChild(columnaPedidos);
                fila.appendChild(columnaOrdenCargue);
                fila.appendChild(columnaRemesa);
                fila.appendChild(columnaPlanRuta);
                fila.appendChild(columnaPlaca);
                fila.appendChild(columnaCumplido);
                fila.appendChild(columnaFechaCreacion);
                fila.appendChild(columnaUsuarioCreacion);
                tbody.appendChild(fila);
              });
            } else {
              Swal.fire({
                title: 'Información',
                text: 'No hay información para generar la trazabilidad.',
                icon: 'info',
                customClass: {
                  popup: 'swal2-custom-font',
                },
              });
            }
          } catch (error) {
            console.error('Error en la primera solicitud:', error);
            throw error;
          } finally {
            $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
          }
        }
      });
    }
  });
});

function abrir_trazabilidad(plan_ruta, manifiesto) {
  // URL de la página que deseas abrir en la nueva ventana
  var url = $('#id_url_ajax').val() + `clientes_nuevo/detalle_tracking/?plan_ruta=${plan_ruta}&manifiesto=${manifiesto}`;
  // Opciones de la ventana emergente (ancho, alto, opciones adicionales)
  var ventanaAncho = screen.width;
  var ventanaAlto = screen.height;
  // Calcula las coordenadas para centrar la ventana
  var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
  var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
  // Opciones de la ventana emergente (ancho, alto, posición)
  var opcionesVentana = 'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
  // Utiliza window.open para abrir la nueva ventana
  window.open(url, name, opcionesVentana);
}
