const d = document;
const w = window;

d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();

  //Cargar los tipos de campos en un array
  // Array con los tipos de inputs disponibles
  // const tiposInputs = [
  //   "text", "password", "number", "email", "date", "time",
  //   "color", "range", "checkbox", "radio", "file", "hidden",
  //   "search", "tel", "url", "button","select"
  // ];


  // // Obtener el elemento <select>
  // const select = document.getElementById('tipo_campo');

  // // Generar las opciones del <select>
  // tiposInputs.forEach(tipo => {
  //   const option = document.createElement('option');
  //   option.value = tipo;
  //   option.textContent = tipo;
  //   select.appendChild(option);
  // });


  // Array con los tipos de inputs disponibles
  const tiposInputs = [
    "text", "password", "number", "email", "date", "time",
    "color", "range", "checkbox", "radio", "file", "hidden",
    "search", "tel", "url", "button", "select"
  ];

  const select = document.getElementById('tipo_campo');
  const opcionesContainer = document.getElementById('opciones_select');
  const inputOpcion = document.getElementById('nueva_opcion');
  const listaOpciones = document.getElementById('lista_opciones');
  const botonAgregar = document.getElementById('agregar_opcion');
  // const botonGuardar = document.getElementById('guardar');
  const opcionesInput = document.getElementById("opciones");

  let opcionesSelect = []; // Array para almacenar opciones del select

  // Generar las opciones del <select>
  tiposInputs.forEach(tipo => {
    const option = document.createElement('option');
    option.value = tipo;
    option.textContent = tipo;
    select.appendChild(option);
  });

  // Detectar cuando el usuario selecciona "select"
  select.addEventListener('change', function () {
    if (this.value === "select") {
      opcionesContainer.style.display = "block";
    } else {
      opcionesContainer.style.display = "none";
      opcionesSelect = []; // Limpiar opciones si cambia de tipo
      listaOpciones.innerHTML = "";
    }
  });

  // Agregar opción al select
  botonAgregar.addEventListener('click', function () {
    const valor = inputOpcion.value.trim();
    if (valor && !opcionesSelect.includes(valor)) {
      opcionesSelect.push(valor);
      const li = document.createElement('li');
      li.textContent = valor;
      listaOpciones.appendChild(li);
      listaOpciones.setAttribute('class', 'list-group-item');
      inputOpcion.value = "";
      opcionesInput.value = JSON.stringify(opcionesSelect); // Convertir el array a JSON antes de enviarlo
      input.value = "";
    }
  });

  try {
    // Realizar la solicitud fetch
    const response = await fetch($('#base_url').val() + 'Pantallas/Cargar_ventanas', {
      method: 'POST',
      cache: 'no-cache',
    });

    // Convertir la respuesta a JSON
    const data = await response.json();

    // Verificar si hay datos
    if (data.resultados) {
      // Obtener el elemento <select> (asegúrate de que el ID sea correcto)
      const selectVentanas = document.getElementById('selectVentanas'); // Cambia 'selectVentanas' por el ID de tu <select>
      // Limpiar el <select> antes de agregar nuevas opciones (opcional)
      selectVentanas.innerHTML = '<option value="" selected>Seleccione</option>';
      // Recorrer los datos y agregar opciones al <select>
      data.resultados.forEach(function (element, index) {
        // Crear un nuevo elemento <option>
        const option = document.createElement('option');
        // Asignar el valor y el texto de la opción
        option.value = element.ventana_id; // Usa el valor correcto de tu JSON (por ejemplo, element.id)
        option.textContent = element.nombre_ventana + ' - ' + element.nombre_pantalla; // Usa el valor correcto de tu JSON (por ejemplo, element.nombre)

        // Agregar la opción al <select>
        selectVentanas.appendChild(option);
      });

    } else {
      console.log("No se encontraron datos.");
      // $('#md-footer-primary').modal('toggle'); // Comentado por ahora
    }
  } catch (error) {
    console.error("Error al cargar los filtros:", error);
    throw error;
  } finally {
    // Ocultar el loading overlay (si lo tienes)
    // document.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }

  d.addEventListener("click", async (e) => {
    if (e.target.matches("#btn-save-filtro") || e.target.matches("#btn-save-filtro *")) {
      let ventana = $('#selectVentanas').val();
      let nombre_filtro = $('#nombre_filtro').val();
      let estadoFiltro = $('#estadoFiltro').val();
      let tipo_campo = $('#tipo_campo').val();
      let descripcion_filtro = $('#descripcion_filtro').val();
      let opcionesInputValue = opcionesInput.value; // Obtener el valor del input

      if (ventana === '' || nombre_filtro === '' || estadoFiltro === '' || tipo_campo === '') {
        Swal.fire({
          title: "Advertencia!",
          text: 'Diligenciar campos obligatorios.',
          icon: "warning",
          draggable: true
        });
      } else {
        Swal.fire({
          title: 'Seguro',
          text: '¿Desea guardar la ventana?',
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
            var datos = null;
            const label = nombre_filtro.replace(/ /g, '_'); // Reemplaza todos los espacios por guiones bajos
            datos = new FormData();
            datos.append('ventana', ventana);
            datos.append('nombre_filtro', nombre_filtro);
            datos.append('estadoFiltro', estadoFiltro);
            datos.append('descripcion_filtro', descripcion_filtro);
            datos.append('tipo_campo', tipo_campo);
            datos.append('opcionesInput', opcionesInputValue); // Enviar el valor, no el objeto
            datos.append('label', label.toLowerCase()); // Reemplaza todos los espacios por guiones bajos

            try {
              const response = await fetch($('#base_url').val() + 'Pantallas/Insertar_Filtro', {
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
  $('#selectVentanas').val('').trigger('change');
  $('#nombre_filtro').val('');
  $('#tipo_campo').val('');
  $('#estadoFiltro').val('');
  $('#descripcion_filtro').val('');
}