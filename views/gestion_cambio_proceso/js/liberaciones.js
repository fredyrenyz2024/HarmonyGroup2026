const w = window;
const d = document;

d.addEventListener('DOMContentLoaded', async e => {
  3;
  e.preventDefault();
  d.addEventListener('click', async e => {
    if (e.target.matches('#btn_buscar_placa') || e.target.matches('#btn_buscar_placa *')) {
      var padre = e.target.parentElement.parentElement;
      var placa = d.getElementById('placat').value;

      if (placa === '') {
        alert('Debediligencoiar una placa para la operación');
      } else {
        listar_placas_tralier(placa);
      }
    }
    // Comprueba si el evento ocurrió en el botón o dentro del botón
    if (e.target.matches('.btn_liberar') || e.target.closest('.btn_liberar')) {
      if (w.confirm('¿Esta seeguro de liberar este trailer para asiganarlo a otro vehiculo?')) {
        // Obtén el botón que fue clickeado
        let btn = e.target.closest('.btn_liberar');
        if (btn) {
          let trailerId = btn.getAttribute('data-id'); // Obtiene el ID del tráiler
          let vehiculoId = btn.getAttribute('data-idvehiculo'); // Obtiene el ID del vehículo
          let trailerPlaca = btn.getAttribute('data-idplaca'); // Obtiene la Placa del vehículo
          try {
            let formdata = new FormData();
            formdata.append('trailerId', trailerId);
            formdata.append('vehiculoId', vehiculoId);
            const response = await fetch($('#id_url_ajax').val() + 'gestion_cambio_proceso/Liberar_trailers', {
              method: 'POST',
              body: formdata,
              cache: 'no-cache',
            });
            const data = await response.json();
            if (data.numero === 200) {
              d.getElementById('mensaje_liberacion').innerHTML = `
              <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
                    <div class="icon"><span class="mdi mdi-check"></span></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> ${data.mensaje}
                    </div>
                  </div>
              `;
              listar_placas_tralier(trailerPlaca);
            } else {
              d.getElementById(
                'mensaje_liberacion',
              ).innerHTML = `<div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-close-circle-o"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> ${data.mensaje}
              </div>
            </div>`;
              listar_placas_tralier(trailerPlaca);
            }
          } catch (error) {
            console.error('Error en la primera solicitud:', error);
            console.log('error no inserta');
            throw error;
          } finally {
          }
        }
      }
    }
  });
});

async function listar_placas_tralier(placa) {
  try {
    let formdata = new FormData();
    formdata.append('placa', placa);
    const response = await fetch($('#id_url_ajax').val() + 'gestion_cambio_proceso/Consultar_placa_trailer', {
      method: 'POST',
      body: formdata,
      cache: 'no-cache',
    });
    const data = await response.json();
    let tbody = d.getElementById('tbody_vehiculos_trailers');
    tbody.innerHTML = '';
    if (data) {
      data.forEach(element => {
        if (element.estado_asociacion === 1) {
          // estado_asociacion = 'Activo';
          estado_asociacion = `<span class="label label-danger">Asignada</span>`;
          btn_accion = `<button class="btn btn-space btn-secondary btn-xs btn_liberar" id="btn_liberar" data-id="${element.numdoc_trailer}" data-idvehiculo="${element.numdoc_vehiculo}" data-idplaca="${element.placa}"><i class="fa-solid fa-repeat"></i> Liberar</button>`;
        } else {
          estado_asociacion = `<span class="label label-info">Historico</span>`;
          btn_accion = `<button class="btn btn-space btn-secondary btn-xs"></button>`;
        }
        if (element.estado === 'Activo') {
          estado_trailer = `<span class="label label-success">Activo</span>`;
        } else {
          estado_trailer = `<span class="label label-danger">Inactivo</span>`;
        }
        const fila = d.createElement('tr');
        const columnanumdoc = d.createElement('td');
        columnanumdoc.textContent = element.numdoc_trailer;
        const columnaPlacaTrailer = d.createElement('td');
        columnaPlacaTrailer.textContent = element.placa;
        const columnaPlaca = d.createElement('td');
        columnaPlaca.textContent = element.placa_vehiculo;
        const columnaConductor = d.createElement('td');
        columnaConductor.textContent = element.nombre + '' + element.apellido1 + ' ' + element.apellido2;
        const columnaEsatdoTrailer = d.createElement('td');
        columnaEsatdoTrailer.innerHTML = estado_trailer;
        const columnaEsatdoAsociacion = d.createElement('td');
        columnaEsatdoAsociacion.innerHTML = estado_asociacion;
        const columnaAcciones = d.createElement('td');
        columnaAcciones.innerHTML = btn_accion;

        fila.appendChild(columnanumdoc);
        fila.appendChild(columnaPlacaTrailer);
        fila.appendChild(columnaPlaca);
        fila.appendChild(columnaConductor);
        fila.appendChild(columnaEsatdoTrailer);
        fila.appendChild(columnaEsatdoAsociacion);
        fila.appendChild(columnaAcciones);
        // Rendreizar la tabla
        tbody.appendChild(fila);
      });
    } else {
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
  }
}
