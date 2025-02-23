const d = document;
const w = window;
d.addEventListener('DOMContentLoaded', async (e) => {
  e.preventDefault();
  Listar_citas();

  // Obtener la hora actual en formato LT (hora local, como 3:30 PM)
  // const currentTime = moment().format('LT');

  // // Asignar esta hora al campo de entrada
  // document.getElementById('timeInput').value = currentTime;

  let manifiesto = d.getElementById('manifiesto');
  manifiesto.addEventListener('input', async (e) => {
    // console.log('hola mundo: ' + e.target.value);
    const searchTerm = manifiesto.value.trim();
    if (searchTerm != '') {
      $.post(
        $('#id_url_ajax').val() + 'transporte/Validar_manifiesto',
        {manifiesto: searchTerm},
        function (data) {
          // mostrar_resultados(data);
          if (data) {
            d.getElementById('valdiar_manifiesto').innerHTML = 'Manifiesto existe en NexosApp';
            d.getElementById('valdiar_manifiesto').style.color = '#14A44D';
          } else {
            // console.log('no exixte el manifiesto');
            d.getElementById('valdiar_manifiesto').innerHTML = 'Manifiesto no existe en NexosApp';
            d.getElementById('valdiar_manifiesto').style.color = '#DC4C64';
          }
        },
        'json',
      );
    } else {
      d.getElementById('valdiar_manifiesto').innerHTML = '';
    }
  });

  d.addEventListener('click', async (e) => {
    d.getElementById('documento_cita').addEventListener('change', function (event) {
      const file = event.target.files[0];
      if (file) {
        const fileURL = URL.createObjectURL(file); // Crea una URL temporal para el archivo
        d.getElementById('pdfPreview').src = fileURL; // Establece la fuente del <embed>
      }
    });

    /* validar el numero de manifiesto exista en necos y no este en seguimiento */
    if (e.target.matches('#btn_guardar_asignacion') || e.target.matches('#btn_guardar_asignacion *')) {
      var padre = e.target.parentElement.parentElement;
      if (d.getElementById('valdiar_manifiesto').innerHTML === 'Manifiesto no existe en NexosApp') {
        Swal.fire({
          title: 'Error',
          text: 'No puede guardar la cita con numero de manifiesto invalido.',
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: '¿Estas seguro?',
          text: '¡No podrás revertir esto!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Guardar Cita',
          cancelButtonText: 'Cancelar',
        }).then(async (result) => {
          if (result.isConfirmed) {
            // alert('Guardar asignacion');
            let formdata = new FormData();
            formdata.append('puerto', d.getElementById('puerto').value);
            formdata.append('numero_cita', d.getElementById('numero_cita').value);
            formdata.append('fecha_cita', d.getElementById('fecha_cita').value);
            formdata.append('hora_cita', d.getElementById('hora_cita').value);
            formdata.append('manifiesto', d.getElementById('manifiesto').value);
            formdata.append('documento_cita', d.getElementById('documento_cita').files[0]);
            try {
              const response = await fetch($('#id_url_ajax').val() + 'transporte/Guardar_asignacion', {
                method: 'POST',
                body: formdata,
                cache: 'no-cache',
              });
              const data = await response.json();
              if (data.numero === 400) {
                if (
                  data.campo === 'puerto' ||
                  data.campo === 'numero_cita' ||
                  data.campo === 'fecha_cita' ||
                  data.campo === 'hora_cita' ||
                  data.campo === 'manifiesto' ||
                  data.campo === 'documento_cita'
                ) {
                  d.getElementById(data.campo).style.borderColor = 'red';
                }
                Swal.fire({
                  title: data.titulo,
                  text: data.mensaje,
                  icon: 'warning',
                });
              } else if (data.numero === 200) {
                $('#form-bp1').modal('hide');
                Listar_citas();
                Swal.fire({
                  title: data.titulo,
                  text: data.mensaje,
                  icon: 'success',
                });
              }
            } catch (error) {
              console.error('Error en la primera solicitud:', error);
              console.log('error no inserta');
              throw error;
            } finally {
              // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
            }
          }
        });
      }
    }

    // Verificar si el evento es en el botón o en cualquier parte dentro del botón
    if (e.target.matches('#btn_cancelar_cita') || e.target.matches('#btn_cancelar_cita *')) {
      // Recorrer hacia arriba para encontrar el botón que tiene la clase btn_cancelar_cita
      var botonCancelar = e.target.closest('.btn_cancelar_cita');
      if (botonCancelar) {
        var num_cita = botonCancelar.getAttribute('data-id'); // Obtener el data-id
        Swal.fire({
          title: '¿Estas seguro de cancelar la cita?',
          text: '¡No podrás revertir esto!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Cancelar Cita',
          cancelButtonText: 'Cerrar',
        }).then(async (result) => {
          if (result.isConfirmed) {
            // alert('Guardar asignacion');
            let formdata = new FormData();
            formdata.append('num_cita', num_cita);
            try {
              const response = await fetch($('#id_url_ajax').val() + 'transporte/Cancelar_cita', {
                method: 'POST',
                body: formdata,
                cache: 'no-cache',
              });
              const data = await response.json();
              if (data.numero === 400) {
                Swal.fire({
                  title: data.titulo,
                  text: data.mensaje,
                  icon: 'warning',
                });
              } else if (data.numero === 200) {
                Listar_citas();
                Swal.fire({
                  title: data.titulo,
                  text: data.mensaje,
                  icon: 'success',
                });
              }
            } catch (error) {
              console.error('Error en la primera solicitud:', error);
              console.log('error no inserta');
              throw error;
            } finally {
              // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
            }
          }
        });
      }
    }

    if (e.target.matches('#btn_confirmar_cita') || e.target.matches('#btn_confirmar_cita *')) {
      // Recorrer hacia arriba para encontrar el botón que tiene la clase btn_cancelar_cita
      var botonConfirmar = e.target.closest('.btn_confirmar_cita');
      if (botonConfirmar) {
        var num_cita = botonConfirmar.getAttribute('data-id'); // Obtener el data-id
        Swal.fire({
          title: '¿Estas seguro de confirmar la cita?',
          text: '¡No podrás revertir esto!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Confirmar Cita',
          cancelButtonText: 'Cerrar',
        }).then(async (result) => {
          if (result.isConfirmed) {
            // alert('Guardar asignacion');
            let formdata = new FormData();
            formdata.append('num_cita', num_cita);
            try {
              const response = await fetch($('#id_url_ajax').val() + 'transporte/Confirmar_Cita', {
                method: 'POST',
                body: formdata,
                cache: 'no-cache',
              });
              const data = await response.json();
              if (data.numero === 400) {
                Swal.fire({
                  title: data.titulo,
                  text: data.mensaje,
                  icon: 'warning',
                });
              } else if (data.numero === 200) {
                Listar_citas();
                Swal.fire({
                  title: data.titulo,
                  text: data.mensaje,
                  icon: 'success',
                });
              }
            } catch (error) {
              console.error('Error en la primera solicitud:', error);
              console.log('error no inserta');
              throw error;
            } finally {
              // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
            }
          }
        });
      }
    }

    if (e.target.matches('#busqueda') || e.target.matches('#busqueda *')) {
      var tipo = d.getElementById('tipo').value;
      var buscador = d.getElementById('buscador').value;
      let formdata = new FormData();
      formdata.append('tipo', tipo);
      formdata.append('buscador', buscador);
      try {
        const response = await fetch($('#id_url_ajax').val() + 'transporte/buscar_citas', {
          method: 'POST',
          body: formdata,
          cache: 'no-cache',
        });
        const data = await response.json();
        // mostrar_resultados(data);
        if (data !== '') {
          let tbody = document.getElementById('tbody_citas_puerto');
          tbody.innerHTML = '';
          data.forEach((element) => {
            const fila = document.createElement('tr');
            const columnaId = document.createElement('td');
            columnaId.textContent = element.id;
            columnaId.style.textAlign = 'center';
            const columnaManfiesto = document.createElement('td');
            columnaManfiesto.textContent = element.manifiesto;
            columnaManfiesto.style.textAlign = 'center';
            const columnaPuerto = document.createElement('td');
            columnaPuerto.textContent = element.puerto;
            columnaPuerto.style.textAlign = 'center';
            const columnaNumeroCita = document.createElement('td');
            columnaNumeroCita.textContent = element.numero_cita;
            columnaNumeroCita.style.textAlign = 'center';
            const columnaFechaCita = document.createElement('td');
            columnaFechaCita.textContent = element.fecha_cita;
            columnaFechaCita.style.textAlign = 'center';
            const columnaHoraCita = document.createElement('td');
            columnaHoraCita.textContent = element.hora_cita;
            columnaHoraCita.style.textAlign = 'center';
            const columnaEstado = document.createElement('td');

            if (element.esatdo_cita === 'ACTIVO') {
              // Fecha y hora actual
              var fecha = moment().format('YYYY-MM-DD HH:mm:ss');
              // Fecha y hora de la cita (ejemplo)
              var fec_fin_solicitud = data.fecha_cita + ' ' + data.hora_cita; // Actualiza esto según tus datos
              var fecha_cita = moment(fec_fin_solicitud);
              // Diferencia en minutos entre la fecha de la cita y la fecha actual
              var cant = fecha_cita.diff(fecha, 'minutes');
              if (cant < 0) {
                // columnaEstado.innerHTML = `Cita Vencida`;
                // columnaEstado.style.backgroundColor = '#DC4C64';
                // columnaEstado.style.color = '#FFFFFF';
                // columnaEstado.style.textAlign = 'center';
                actualiar_estado(element.id);
              } else {
                columnaEstado.innerHTML = `Cita Vigente`;
                columnaEstado.style.backgroundColor = '#14A44D';
                columnaEstado.style.color = '#FFFFFF';
                columnaEstado.style.textAlign = 'center';

                if (cant <= 60) {
                  columnaEstado.innerHTML = `Queda 1 hora o menos para la cita`;
                  columnaEstado.style.backgroundColor = '#E4A11B';
                  columnaEstado.style.color = '#FFFFFF';
                  columnaEstado.style.textAlign = 'center';
                }

                if (cant <= 30) {
                  columnaEstado.innerHTML = `Quedan 30 minutos o menos para la cita`;
                  columnaEstado.style.backgroundColor = '#E4A11B';
                  columnaEstado.style.color = '#FFFFFF';
                  columnaEstado.style.textAlign = 'center';
                }
              }
            } else if (element.esatdo_cita === 'CANCELADO') {
              columnaEstado.innerHTML = `Cita Cancelada`;
              columnaEstado.style.backgroundColor = '#DC4C64';
              columnaEstado.style.color = '#FFFFFF';
              columnaEstado.style.textAlign = 'center';
            } else if (element.esatdo_cita === 'VENCIDA') {
              columnaEstado.innerHTML = `Cita Vencida`;
              columnaEstado.style.backgroundColor = '#DC4C64';
              columnaEstado.style.color = '#FFFFFF';
              columnaEstado.style.textAlign = 'center';
            }

            const columnaFecha = document.createElement('td');
            columnaFecha.textContent = element.fecha + element.hora;
            columnaFecha.style.textAlign = 'center';
            const columnaDocumento = document.createElement('td');
            columnaDocumento.innerHTML = `<a  href="#" onclick="abrir_fotos('${element.ruta_documento}','${element.documento}')"><i class="far fa-file-pdf"></i> Documento</a>`;
            columnaDocumento.style.textAlign = 'center';
            const columnaUsuario = document.createElement('td');
            columnaUsuario.textContent = element.usuario;
            columnaUsuario.style.textAlign = 'center';
            const columnaAcciones = document.createElement('td');
            if (element.esatdo_cita === 'ACTIVO') {
              columnaAcciones.innerHTML = `
              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group">
                <button type="button" class="btn btn-success btn_confirmar_cita  hint--top" id='btn_confirmar_cita' data-hint="Confirmar Cita" data-id='${element.id}'><i class="far fa-calendar-check"></i></button>
                <button type="button" class="btn btn-danger btn_cancelar_cita hint--top" id='btn_cancelar_cita' data-hint="Cancelar Cita" data-id='${element.id}'><i class="far fa-calendar-times"></i></button>
                <button type="button" class="btn btn-primary hint--top" data-hint="Ver Cita" data-id='${element.id}'><i class="far fa-eye"></i></button>
              </div>
              `;
            } else {
              columnaAcciones.innerHTML = `
              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group">
                <button type="button" class="btn btn-primary hint--top" data-hint="Ver Cita"><i class="far fa-eye"></i></button>
                <!--<button type="button" class="btn btn-default">Right</button>-->
              </div>
              `;
            }

            fila.appendChild(columnaId);
            fila.appendChild(columnaManfiesto);
            fila.appendChild(columnaPuerto);
            fila.appendChild(columnaNumeroCita);
            fila.appendChild(columnaFechaCita);
            fila.appendChild(columnaHoraCita);
            fila.appendChild(columnaEstado);
            fila.appendChild(columnaFecha);
            fila.appendChild(columnaDocumento);
            fila.appendChild(columnaUsuario);
            fila.appendChild(columnaAcciones);
            tbody.appendChild(fila);
          });
        } else {
          Listar_citas();
        }
      } catch (error) {
        console.error('Error en la primera solicitud:', error);
        console.log('error no inserta');
        throw error;
      } finally {
        // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
      }
    }
  });
});

async function Listar_citas() {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'transporte/listar_citas', {
      method: 'POST',
      // body: formdata,
      cache: 'no-cache',
    });
    const data = await response.json();
    // mostrar_resultados(data);
    let tbody = document.getElementById('tbody_citas_puerto');
    tbody.innerHTML = '';
    data.forEach((element) => {
      const fila = document.createElement('tr');
      const columnaId = document.createElement('td');
      columnaId.textContent = element.id;
      columnaId.style.textAlign = 'center';
      const columnaManfiesto = document.createElement('td');
      columnaManfiesto.textContent = element.manifiesto;
      columnaManfiesto.style.textAlign = 'center';
      const columnaPuerto = document.createElement('td');
      columnaPuerto.textContent = element.puerto;
      columnaPuerto.style.textAlign = 'center';
      const columnaNumeroCita = document.createElement('td');
      columnaNumeroCita.textContent = element.numero_cita;
      columnaNumeroCita.style.textAlign = 'center';
      const columnaFechaCita = document.createElement('td');
      columnaFechaCita.textContent = element.fecha_cita;
      columnaFechaCita.style.textAlign = 'center';
      const columnaHoraCita = document.createElement('td');
      columnaHoraCita.textContent = element.hora_cita;
      columnaHoraCita.style.textAlign = 'center';
      const columnaEstado = document.createElement('td');

      if (element.esatdo_cita === 'ACTIVO') {
        // Fecha y hora actual
        var fecha = moment().format('YYYY-MM-DD HH:mm:ss');
        // Fecha y hora de la cita (ejemplo)
        var fec_fin_solicitud = data.fecha_cita + ' ' + data.hora_cita; // Actualiza esto según tus datos
        var fecha_cita = moment(fec_fin_solicitud);
        // Diferencia en minutos entre la fecha de la cita y la fecha actual
        var cant = fecha_cita.diff(fecha, 'minutes');
        if (cant < 0) {
          // columnaEstado.innerHTML = `Cita Vencida`;
          // columnaEstado.style.backgroundColor = '#DC4C64';
          // columnaEstado.style.color = '#FFFFFF';
          // columnaEstado.style.textAlign = 'center';
          actualiar_estado(element.id);
        } else {
          columnaEstado.innerHTML = `Cita Vigente`;
          columnaEstado.style.backgroundColor = '#14A44D';
          columnaEstado.style.color = '#FFFFFF';
          columnaEstado.style.textAlign = 'center';

          if (cant <= 60) {
            columnaEstado.innerHTML = `Queda 1 hora o menos para la cita`;
            columnaEstado.style.backgroundColor = '#E4A11B';
            columnaEstado.style.color = '#FFFFFF';
            columnaEstado.style.textAlign = 'center';
          }

          if (cant <= 30) {
            columnaEstado.innerHTML = `Quedan 30 minutos o menos para la cita`;
            columnaEstado.style.backgroundColor = '#E4A11B';
            columnaEstado.style.color = '#FFFFFF';
            columnaEstado.style.textAlign = 'center';
          }
        }
      } else if (element.esatdo_cita === 'CANCELADO') {
        columnaEstado.innerHTML = `Cita Cancelada`;
        columnaEstado.style.backgroundColor = '#DC4C64';
        columnaEstado.style.color = '#FFFFFF';
        columnaEstado.style.textAlign = 'center';
      } else if (element.esatdo_cita === 'VENCIDA') {
        columnaEstado.innerHTML = `Cita Vencida`;
        columnaEstado.style.backgroundColor = '#DC4C64';
        columnaEstado.style.color = '#FFFFFF';
        columnaEstado.style.textAlign = 'center';
      }

      const columnaFecha = document.createElement('td');
      columnaFecha.textContent = element.fecha + element.hora;
      columnaFecha.style.textAlign = 'center';
      const columnaDocumento = document.createElement('td');
      columnaDocumento.innerHTML = `<a  href="#" onclick="abrir_fotos('${element.ruta_documento}','${element.documento}')"><i class="far fa-file-pdf"></i> Documento</a>`;
      columnaDocumento.style.textAlign = 'center';
      const columnaUsuario = document.createElement('td');
      columnaUsuario.textContent = element.usuario;
      columnaUsuario.style.textAlign = 'center';
      const columnaAcciones = document.createElement('td');
      if (element.esatdo_cita === 'ACTIVO' && element.confirmacion === 'No Confirmada') {
        columnaAcciones.innerHTML = `
        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group">
        <button type="button" class="btn btn-success btn_confirmar_cita  hint--top" id='btn_confirmar_cita' data-hint="Confirmar Cita" data-id='${element.id}'><i class="far fa-calendar-check"></i></button>
          <button type="button" class="btn btn-danger btn_cancelar_cita hint--top" id='btn_cancelar_cita' data-hint="Cancelar Cita" data-id='${element.id}'><i class="far fa-calendar-times"></i></button>
          <button type="button" class="btn btn-primary hint--top" data-hint="Ver Cita" data-id='${element.id}'><i class="far fa-eye"></i></button>
        </div>
        `;
      } else if (element.confirmacion === 'Confirmada') {
        columnaAcciones.innerHTML = `Cita Confirmada`;
        columnaAcciones.style.backgroundColor = '#14A44D';
        columnaAcciones.style.color = '#FFFFFF';
        columnaAcciones.style.textAlign = 'center';
      } else {
        columnaAcciones.innerHTML = `
        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group">
          <button type="button" class="btn btn-primary hint--top" data-hint="Ver Cita"><i class="far fa-eye"></i></button>
          <!--<button type="button" class="btn btn-default">Right</button>-->
        </div>
        `;
      }

      fila.appendChild(columnaId);
      fila.appendChild(columnaManfiesto);
      fila.appendChild(columnaPuerto);
      fila.appendChild(columnaNumeroCita);
      fila.appendChild(columnaFechaCita);
      fila.appendChild(columnaHoraCita);
      fila.appendChild(columnaEstado);
      fila.appendChild(columnaFecha);
      fila.appendChild(columnaDocumento);
      fila.appendChild(columnaUsuario);
      fila.appendChild(columnaAcciones);
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
    // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}

async function actualiar_estado(id) {
  let formdata = new FormData();
  formdata.append('num_cita', num_cita);
  try {
    const response = await fetch($('#id_url_ajax').val() + 'transporte/Vencer_cita', {
      method: 'POST',
      body: formdata,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data.numero === 400) {
      Swal.fire({
        title: data.titulo,
        text: data.mensaje,
        icon: 'warning',
      });
    } else if (data.numero === 200) {
      Listar_citas();
      Swal.fire({
        title: data.titulo,
        text: data.mensaje,
        icon: 'success',
      });
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
    // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}

function abrir_fotos(url, name) {
  // URL de la página que deseas abrir en la nueva ventana
  var url = $('#id_url_ajax').val() + url + name;
  // Opciones de la ventana emergente (ancho, alto, opciones adicionales)
  var ventanaAncho = 1000;
  var ventanaAlto = 1000;
  // Calcula las coordenadas para centrar la ventana
  var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
  var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
  // Opciones de la ventana emergente (ancho, alto, posición)
  var opcionesVentana =
    'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
  // Utiliza window.open para abrir la nueva ventana
  window.open(url, name, opcionesVentana);
}
