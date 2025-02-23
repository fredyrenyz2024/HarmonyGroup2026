const d = document;
const w = window;

d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  try {
    // Realizar la solicitud fetch
    const response = await fetch($('#base_url').val() + 'Pantallas/Cargar_Datos', {
      method: 'POST',
      cache: 'no-cache',
    });

    // Convertir la respuesta a JSON
    const data = await response.json();

    // Verificar si hay datos
    if (data.resultados && data.resultados_menu) {
      // Obtener el elemento <select> (asegúrate de que el ID sea correcto)
      const selectModulos = document.getElementById('selectModulos'); // Cambia 'selectModulos' por el ID de tu <select>
      // Limpiar el <select> antes de agregar nuevas opciones (opcional)
      selectModulos.innerHTML = '<option value="" selected>Seleccione</option>';
      // Recorrer los datos y agregar opciones al <select>
      data.resultados.forEach(function (element, index) {
        // Crear un nuevo elemento <option>
        const option = document.createElement('option');
        // Asignar el valor y el texto de la opción
        option.value = element.id; // Usa el valor correcto de tu JSON (por ejemplo, element.id)
        option.textContent = element.nombre; // Usa el valor correcto de tu JSON (por ejemplo, element.nombre)

        // Agregar la opción al <select>
        selectModulos.appendChild(option);
      });

      /* Menu */

      // Obtener el elemento <select> (asegúrate de que el ID sea correcto)
      const selectMenus = document.getElementById('selectMenu'); // Cambia 'selectModulos' por el ID de tu <select>
      // Limpiar el <select> antes de agregar nuevas opciones (opcional)
      selectMenus.innerHTML = '<option value="" selected>Seleccione</option>';
      // Recorrer los datos y agregar opciones al <select>
      data.resultados_menu.forEach(function (element, index) {
        // Crear un nuevo elemento <option>
        const option = document.createElement('option');
        // Asignar el valor y el texto de la opción
        option.value = element.id; // Usa el valor correcto de tu JSON (por ejemplo, element.id)
        option.textContent = element.titulo + ' - ' + '(' + element.menu + ') '; // Usa el valor correcto de tu JSON (por ejemplo, element.nombre)

        // Agregar la opción al <select>
        selectMenus.appendChild(option);
      });
    } else {
      console.log("No se encontraron datos.");
      // $('#md-footer-primary').modal('toggle'); // Comentado por ahora
    }
  } catch (error) {
    console.error("Error al cargar los módulos:", error);
    throw error;
  } finally {
    // Ocultar el loading overlay (si lo tienes)
    // document.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }

  d.addEventListener("click", async (e) => {
    if (e.target.matches("#btn-save-pantalla") || e.target.matches("#btn-save-pantalla *")) {
      /* Campos */
      let modulo = $('#selectModulos').val();
      let menu = $('#selectMenu').val();
      let nombre_pantalla = $('#nombre_pantalla').val();
      let estado_pantalla = $('#estadoPantalla').val();
      let descripcion_pantalla = $('#descripcion_pantalla').val();
      if (modulo === '' || menu === '' || nombre_pantalla === '' || estado_pantalla === '') {
        Swal.fire({
          title: "Advertencia!",
          text: 'Diligenciar campos obligatorios.',
          icon: "warning",
          draggable: true
        });
      } else {
        Swal.fire({
          title: 'Seguro',
          text: '¿Desea guardar la pantalla?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3B71CA',
          cancelButtonColor: '#9FA6B2',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          customClass: {
            popup: 'swal2-custom-font',
          },
        }).then(async result => {
          if (result.isConfirmed) {
            // $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
            var datos = null;
            datos = new FormData();
            datos.append('modulo', modulo);
            datos.append('menu', menu);
            datos.append('nombre_pantalla', nombre_pantalla);
            datos.append('estado_pantalla', estado_pantalla);
            datos.append('descripcion_pantalla', descripcion_pantalla);
            try {
              const response = await fetch($('#base_url').val() + 'Pantallas/Insertar_pantalla', {
                method: 'POST',
                body: datos,
                cache: 'no-cache',
              });
              const data = await response.json();
              if (data.success === true) {
                Swal.fire({
                  title: "Mensaje!",
                  text: data.message,
                  icon: "success",
                  draggable: true
                });
                resetAll();
              } else {
                Swal.fire({
                  title: "Mensaje!",
                  text: data.message,
                  icon: "error",
                  draggable: true
                });
              }

            } catch (error) {
              console.error('Error en la primera solicitud:', error);
              throw error;
            } finally {
              // $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
            }
          }
        });
      }
    }

    if (e.target.matches("#btn-cancelar") || e.target.matches("#btn-cancelar *")) {
      Swal.fire({
        title: 'Seguro',
        text: '¿Desea cancelar el registro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3B71CA',
        cancelButtonColor: '#9FA6B2',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: 'swal2-custom-font',
        },
      }).then(async result => {
        if (result.isConfirmed) {
          w.location.href = $('#base_url').val() + 'index/index1/?idmenu=3';
        }
      });
    }
  })
});

function resetAll() {
  // Resetea los select que usan Select2
  $('#selectModulos').val('').trigger('change');
  $('#selectMenu').val('').trigger('change');
  $('#nombre_pantalla').val('');
  $('#estadoPantalla').val('');
  $('#descripcion_pantalla').val('');

}