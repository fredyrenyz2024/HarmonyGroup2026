const d = document;
const w = window;
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();

  $('.select2').select2();
  Lsitar_clientes();

  // Consultar_contactos(2);
  // Consultar_contactos(34);
  try {
    const response = await fetch($('#id_url_ajax').val() + 'parametros/novedades_trafico', {
      method: 'POST',
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error('Error al cargar los Responsables');
    }

    const data = await response.json();

    let template = '';
    data.forEach(value => {
      template += `
        <tr>
            <td style="border: 1px solid #ddd;padding: 1px;font-size: 12px;">${value.id}</td>
            <td style="border: 1px solid #ddd;padding: 1px;font-size: 12px;">${value.novedad}</td>
            <td style="border: 1px solid #ddd;padding: 1px;text-align: center;">
                <input type="checkbox" value="${value.id}" name="reporta_cliente[]" id="reporta_cliente_${value.id}" class="reporta_cliente">
            </td>
            <td style="border: 1px solid #ddd;padding: 1px;text-align: center;">
                <input type="checkbox" value="${value.id}" name="reporta_sac[]" id="reporta_sac_${value.id}" class="reporta_sac">
            </td>
        </tr>
    `;
    });
    d.getElementById('tbl_asignar_configuracion').innerHTML = template;
  } catch (error) {
    alert(error.message || 'Error al cargar los Responsables');
  }

  d.addEventListener('click', async e => {
    if (e.target.matches('#aplicar_filtro') || e.target.matches('#aplicar_filtro *')) {
      let correo_automatico = d.getElementById('correo_automatico');
      let correo_manual = d.getElementById('correo_manual');
      // Selecciona todos los checkboxes de `reporta_cliente` y `reporta_sac`
      const checkboxes = d.querySelectorAll('.reporta_cliente, .reporta_sac');
      // Verifica si al menos uno de los checkboxes está seleccionado
      const algunoSeleccionado = Array.from(checkboxes).some(checkbox => checkbox.checked);

      /* Validaciones para poder crear las configuraciones */
      if (d.getElementById('cliente').value === '') {
        Swal.fire({
          title: 'Advertencia',
          text: 'Seleccionar un cliente para la operación.',
          icon: 'warning',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      } else if (!correo_automatico.checked || !correo_manual.checked) {
        Swal.fire({
          title: 'Advertencia',
          text: 'Seleccionar un metodo de envio de correo.',
          icon: 'warning',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      } else if (!algunoSeleccionado) {
        Swal.fire({
          title: 'Advertencia',
          text: 'Seleccionar minimo una novedad para crear la configuracion.',
          icon: 'warning',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      } else {
        Swal.fire({
          title: 'Mensaje!',
          text: '¿Está seguro de continuar?',
          icon: 'question',
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
            $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
            let formdata = new FormData();

            // Agregar los checkboxes seleccionados al formdata
            checkboxes.forEach(checkbox => {
              if (checkbox.checked) {
                const id = checkbox.value;
                const type = checkbox.classList.contains('reporta_cliente') ? 'reporta_cliente' : 'reporta_sac';
                formdata.append(`novedades[${id}][${type}]`, '1'); // '1' como valor si está seleccionado
              }
            });

            // Agregar otros datos adicionales al formdata
            formdata.append('cliente', d.getElementById('cliente').value);

            formdata.append('correo_automatico', correo_automatico.checked ? 'SI' : 'NO');

            formdata.append('correo_manual', correo_manual.checked ? 'SI' : 'NO');

            try {
              const response = await fetch($('#id_url_ajax').val() + 'parametros/Guardar_configuracion_correo', {
                method: 'POST',
                body: formdata,
                cache: 'no-cache',
              });

              const data = await response.json();
            } catch (error) {
              Swal.fire({
                title: 'Mensaje!',
                text: 'Error en la solicitud de inserción de la información.',
                icon: 'warning',
                customClass: {
                  popup: 'swal2-custom-font',
                },
              });
              throw error;
            } finally {
              $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
              Consultar_contactos(d.getElementById('cliente').value);
            }
          }
        });
      }
    }

    if (e.target.matches('#btn_registrar_configuracion') || e.target.matches('#btn_registrar_configuracion *')) {
      /* VALIDAR SI ESTAN SELEECIONADOS */
      const checkboxes = document.querySelectorAll('.novedades_contacto');

      // Crear un objeto para agrupar los checkboxes y nombres por contacto
      const checkboxesPorContacto = {};

      // Agrupar checkboxes por el valor de su atributo `data-id`
      checkboxes.forEach(checkbox => {
        const contactoId = checkbox.getAttribute('data-id');
        const contactoNombre = checkbox.getAttribute('data-nombre');
        if (!checkboxesPorContacto[contactoId]) {
          checkboxesPorContacto[contactoId] = {
            nombre: contactoNombre,
            checkboxes: [],
          };
        }
        checkboxesPorContacto[contactoId].checkboxes.push(checkbox);
      });

      // Validar que al menos un checkbox esté seleccionado por cada contacto
      let validacionCorrecta = true;
      let NombreContacto = '';

      for (const contactoId in checkboxesPorContacto) {
        const {nombre, checkboxes: checkboxesContacto} = checkboxesPorContacto[contactoId];
        const algunoSeleccionado = checkboxesContacto.some(checkbox => checkbox.checked);

        if (!algunoSeleccionado) {
          validacionCorrecta = false;
          NombreContacto = nombre;
          // console.log(`No hay ningún checkbox seleccionado para el contacto con ID: ${contactoId} y Nombre: ${nombre}`);
          // Aquí puedes mostrar un mensaje de advertencia al usuario si es necesario
          break; // Opcional: salir del bucle al encontrar un contacto sin selección
        }
      }

      if (!validacionCorrecta) {
        Swal.fire({
          title: 'Advertencia',
          // text: 'Seleccionar minimo una novedad para crear la configuracion.',
          text: 'No hay ningún checkbox seleccionado para el contacto: ' + NombreContacto,
          icon: 'warning',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      } else {
        Swal.fire({
          title: 'Mensaje!',
          text: '¿Está seguro de continuar?',
          icon: 'question',
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
            $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
            // Selecciona todos los checkboxes marcados con la clase `novedades_contacto`

            // Crea un array de objetos para almacenar los valores `data-id`, `data-grupo`, y `value` de cada checkbox marcado
            // const novedadesSeleccionadas = Array.from(checkboxes).map(checkbox => ({
            //   contacto_id: checkbox.getAttribute('data-id'),
            //   grupo_id: checkbox.getAttribute('data-grupo'),
            //   novedad_id: checkbox.value,
            // }));

            const novedadesSeleccionadas = []; // Array donde almacenarás los objetos
            checkboxes.forEach(checkbox => {
              if (checkbox.checked) {
                novedadesSeleccionadas.push({
                  contacto_id: checkbox.getAttribute('data-id'),
                  grupo_id: checkbox.getAttribute('data-grupo'),
                  novedad_id: checkbox.value,
                });
              }
            });

            // Envía el array de datos al servidor usando fetch
            fetch($('#id_url_ajax').val() + 'parametros/Guardar_configuracion_contactos', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
              },
              body: JSON.stringify({novedades: novedadesSeleccionadas}),
            })
              .then(response => response.json())
              .then(data => {
                console.log('Novedades guardadas:', data);
                if (data.status === 'success') {
                  Swal.fire({
                    title: 'Éxito!',
                    text: data.message,
                    icon: 'success',
                    showConfirmButton: true,
                    timer: 1500,
                    customClass: {
                      popup: 'swal2-custom-font',
                    },
                  });
                  // Limpia los checkboxes
                  checkboxes.forEach(checkbox => {
                    checkbox.checked = false;
                  });
                  setInterval(() => {
                    w.location.reload();
                  }, 1500);
                } else {
                  Swal.fire({
                    title: 'Advertencia',
                    text: data.message,
                    icon: 'warning',
                    customClass: {
                      popup: 'swal2-custom-font',
                    },
                  });
                }
                // Muestra un mensaje de éxito o realiza acciones adicionales si es necesario
              })
              .catch(error => {
                Swal.fire({
                  title: 'Mensaje!',
                  text: 'Error en la solicitud de inserción de la información.',
                  icon: 'warning',
                  customClass: {
                    popup: 'swal2-custom-font',
                  },
                });
                throw error;
              })
              .finally(() => {
                $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
              });
          }
        });
      }
    }
  });
});

/* Consultar los cntactto de grupo de cliente al momento de ahcer la configruacion */

async function Consultar_contactos(cliente) {
  $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
  let formdata = new FormData();
  formdata.append('cliente', cliente);

  try {
    const response = await fetch($('#id_url_ajax').val() + 'parametros/Consultar_grupo_cliente', {
      method: 'POST',
      body: formdata,
      cache: 'no-cache',
    });

    const data = await response.json();
    // Asignar datos de cliente y grupo
    d.getElementById('nombre_cliente').textContent = data.datos_contactos[0].nombre;
    d.getElementById('nombre_grupo').textContent = data.datos_contactos[0].nombre_grupo;
    d.getElementById('cantidad_contacto').textContent = data.total_contactos[0].total_contactos;
    d.getElementById('config_inicial').style.display = 'none';
    d.getElementById('confgiuracion_contactos').style.display = 'block';

    // Procesar cada contacto y crear el HTML
    let template = '';
    let cont = 1;

    // Crear una lista de promesas para asegurar la ejecución en orden
    const promesasNovedades = [];
    for (const element of data.datos_contactos) {
      template += `
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <table cellpadding="0" cellspacing="0" width="100%" border="0" style="background-color: #332D2D;color:#fff;border-top: 1px #fff solid;">
              <tbody>
                <tr>
                  <td class="celda_titulo2 text-center" style="margin:25px;">
                    <b>Contacto N°-${cont++}</b>
                  </td>
                </tr>
              </tbody>
            </table>
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="background-color: #F5F5F5; width: auto;font-weight: bold;border: 1px solid #ddd;padding: 5px;">Nombre contacto:</th>
                  <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;">${element.nombre_contactos}</td>
                  <th style="background-color: #F5F5F5; width: auto;font-weight: bold;border: 1px solid #ddd;padding: 5px;">Cargo:</th>
                  <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;">${element.cargo}</td>
                </tr>
                <tr>
                  <th style="background-color: #F5F5F5; width: auto;font-weight: bold;border: 1px solid #ddd;padding: 5px;">Área:</th>
                  <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;">${element.areaa}</td>
                  <th style="background-color: #F5F5F5; width: auto;font-weight: bold;border: 1px solid #ddd;padding: 5px;">Correo:</th>
                  <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;">${element.email}</td>
                </tr>
              </thead>
            </table>
            <div id="actividades_cliente_${element.contacto_id}" class="form-check" style="display: flex; flex-wrap: wrap;margin-left:4px;margin-top:4px;"></div>
          </div>
      `;

      // Agregar la llamada de novedades a la lista de promesas
      promesasNovedades.push(Consultar_novedades_cliente(cliente, element.contacto_id, element.grupo_id, element.nombre_contactos));
    }

    d.getElementById('contactos_grupo').innerHTML = template;

    // Esperar a que todas las promesas de novedades se completen
    await Promise.all(promesasNovedades);
  } catch (error) {
    Swal.fire({
      title: 'Mensaje!',
      text: 'Error en la solicitud, información no disponible.',
      icon: 'warning',
      customClass: {
        popup: 'swal2-custom-font',
      },
    });
    throw error;
  } finally {
    $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga
  }
}

async function Consultar_novedades_cliente(cliente, contacto_id, grupo_id, nombre_contactos) {
  let formdata = new FormData();
  formdata.append('cliente', cliente);

  try {
    const response = await fetch($('#id_url_ajax').val() + 'parametros/Consultar_novedades_cliente', {
      method: 'POST',
      body: formdata,
      cache: 'no-cache',
    });

    const data = await response.json();
    let template = '';

    data.forEach(value => {
      template += `
        <div class="custom-control custom-checkbox custom-control-inline text-left" style="flex-basis: 50%; max-width: 60%; box-sizing: border-box;">
          <input class="custom-control-input novedades_contacto" type="checkbox" value="${value.id}"  style="transform: scale(1.5);" data-id="${contacto_id}" data-nombre="${nombre_contactos}" data-grupo="${grupo_id}">
          <label class="custom-control-label" for="check6" style="margin-left:5px;">${value.novedad}</label>
        </div>
      `;
    });

    // Selecciona el elemento del grupo específico por ID dinámico
    d.getElementById(`actividades_cliente_${contacto_id}`).innerHTML = template;
  } catch (error) {
    Swal.fire({
      title: 'Mensaje!',
      text: 'Error en la solicitud, información no disponible.',
      icon: 'warning',
      customClass: {
        popup: 'swal2-custom-font',
      },
    });
    throw error;
  }
}

async function Lsitar_clientes() {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'parametros/Listar_clientes', {
      method: 'POST',
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error('Error al cargar los Responsables');
    }

    const data = await response.json();
    // Limpiar ambos select antes de agregar opciones
    let CLIENTES = d.getElementById('cliente');
    CLIENTES.innerHTML = '<option value="" selected>Seleccioonar..</option>'; // Limpiar opciones anteriores

    data.forEach(value => {
      let {id, nombre, user_log} = value;
      // Crear la opción para 'responsable_actual'
      let optActual = d.createElement('option');
      optActual.value = id;
      optActual.textContent = nombre;
      CLIENTES.appendChild(optActual);
    });
  } catch (error) {
    alert(error.message || 'Error al cargar los Responsables');
  }
}
