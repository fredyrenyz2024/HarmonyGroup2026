</main>

<!-- ===============================================-->
<!--    JavaScripts-->
<!-- ===============================================-->

<script src="<?php echo BASE_URL ?>public/vendors/popper/popper.min.js"></script>
<script src="<?php echo BASE_URL ?>public/vendors/bootstrap/bootstrap.min.js"></script>
<script src="<?php echo BASE_URL ?>public/vendors/anchorjs/anchor.min.js"></script>
<script src="<?php echo BASE_URL ?>public/vendors/is/is.min.js"></script>
<script src="<?php echo BASE_URL ?>public/vendors/fontawesome/all.min.js"></script>
<script src="<?php echo BASE_URL ?>public/vendors/lodash/lodash.min.js"></script>
<!-- <script src="https://polyfill.io/v3/polyfill.min.js?features=window.scroll"></script> -->
<script src="<?php echo BASE_URL ?>public/vendors/list.js/list.min.js"></script>
<script src="<?php echo BASE_URL ?>public/vendors/feather-icons/feather.min.js"></script>
<script src="<?php echo BASE_URL ?>public/vendors/dayjs/dayjs.min.js"></script>
<script src="<?php echo BASE_URL ?>public/vendors/choices/choices.min.js"></script>
<script src="<?php echo BASE_URL ?>public/assets/js/phoenix.js"></script>
<script src="<?php echo BASE_URL ?>public/vendors/echarts/echarts.min.js"></script>
<script src="<?php echo BASE_URL ?>public/vendors/leaflet/leaflet.js"></script>
<script src="<?php echo BASE_URL ?>public/vendors/leaflet.markercluster/leaflet.markercluster.js"></script>
<script src="<?php echo BASE_URL ?>public/vendors/leaflet.tilelayer.colorfilter/leaflet-tilelayer-colorfilter.min.js">
</script>
<script src="<?php echo BASE_URL ?>public/assets/js/ecommerce-dashboard.js"></script>
<script src=<?php echo BASE_URL ?>views/layout/assets/lib/jquery/jquery.min.js type="text/javascript"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.27.0/moment.min.js"></script>
<script src="https://cdn.datatables.net/2.2.2/js/dataTables.min.js"></script>
<script src="https://cdn.datatables.net/2.2.2/js/dataTables.bootstrap5.min.js"></script>
<!-- <script>
  $(document).ready(function() {
    $('#tipo_mercancia').select2({
      placeholder: 'Seleccione una opción',
      allowClear: true,
      dropdownCssClass: 'select2-sm', // Aplica la clase al dropdown
      containerCssClass: 'select2-sm', // Aplica la clase al contenedor
    });
  });
</script> -->
<script>
  // JavaScript para manejar el cambio de pestañas y "recargar" el formulario
  // const d = document;
  // const w = window;
  document.addEventListener('DOMContentLoaded', async e => {
    e.preventDefault();
    const tab = document.getElementById('myTab');
    const listItems = tab.getElementsByTagName('li');

    for (let i = 0; i < listItems.length; i++) {
      const anchor = listItems[i].getElementsByTagName('a')[0];
      if (anchor) {
        anchor.addEventListener('click', function(event) {
          event.preventDefault(); // Evita el comportamiento predeterminado del enlace
          // document.getElementById('contenido_ventana').innerHTML = '';
          const id = anchor.id;
          const ventana = anchor.getAttribute('data-id');
          const controlador = anchor.getAttribute('data-controlador');
          const metodo = anchor.getAttribute('data-metodo');
          const metodoConGuionBajo = metodo.replace(/ /g, '_'); // Reemplaza todos los espacios por guiones bajos

          try {
            fetch($('#base_url').val() + controlador + '/' + metodoConGuionBajo.toLowerCase())
              .then(response => response.text())
              .then(data => {
                document.getElementById('contenido_ventana-' + ventana).innerHTML = data;
                // Ejecuta el JavaScript específico de la ventana
                ejecutarJavaScriptDeVentana(ventana);
              })
              .catch(error => console.log(error));
          } catch (error) {
            console.log(error);
          } finally {
            cargar_filtros(controlador, ventana);
          }
        });
      }
    }
  });

  function ejecutarJavaScriptDeVentana(id) {
    let scripts = [];

    switch (id) {
      case '1':
        scripts = ['<?= BASE_URL ?>views/layout/assets/lib/serv_clientecotizaciones_ajax.js'];
        break;

      case '2':
        scripts = ['<?= BASE_URL ?>views/serviciocliente/js/prioritarias.js'];
        // scripts = ['<?= BASE_URL ?>views/layout/assets/lib/serv_clientecotizaciones_ajax.js', '<?= BASE_URL ?>views/serviciocliente/js/prioritarias.js'];
        break;

      case '4':
        scripts = ['<?= BASE_URL ?>views/layout/assets/lib/serv_clientecotizaciones_ajax.js'];
        break;

      case '5':
        // scripts = ['<?= BASE_URL ?>views/serviciocliente/js/solicitudes.js'];
        scripts = ['<?= BASE_URL ?>views/serviciocliente/js/pendientes.js'];
        break;

      case '8':
        scripts = ['<?= BASE_URL ?>/views/prefiltro_nacional/js/prefiltro_nacional.js'];
        break;

      case '11':
        // scripts = ['<?= BASE_URL ?>views/prefiltro_nacional/js/prefiltro_nacional.js', '<?= BASE_URL ?>/views/prefiltro_nacional/js/prioritarias_operaciones.js'];
        scripts = ['<?= BASE_URL ?>/views/prefiltro_nacional/js/prioritarias_operaciones.js'];
        break;

      case '12':
        scripts = ['<?= BASE_URL ?>views/serviciocliente/js/en_curso.js'];
        // scripts = ['<?= BASE_URL ?>views/layout/assets/lib/serv_clientecotizaciones_ajax.js', '<?= BASE_URL ?>views/serviciocliente/js/en_curso.js'];
        break;

      case '13':
        scripts = ['<?= BASE_URL ?>views/prefiltro_nacional/js/pendientes_operaciones.js'];
        // scripts = ['<?= BASE_URL ?>/views/prefiltro_nacional/js/prefiltro_nacional.js', '<?= BASE_URL ?>/views/prefiltro_nacional/js/pendientes_operaciones.js'];
        break;

      case '14':
        scripts = ['<?= BASE_URL ?>views/prefiltro_nacional/js/en_curso_operaciones.js'];
        break;
      default:
        console.log('Ventana no reconocida');
        return;
    }

    cargarScripts(scripts, id);
  }

  // Función para cargar scripts dinámicamente y ejecutar en $(document).ready()
  function cargarScripts(scripts, id) {
    const loadScript = (url) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';
        script.async = true;
        script.onload = () => {
          console.log(`Cargado: ${url} con ID: ${id}`);
          resolve();
        };
        script.onerror = () => {
          console.error(`Error al cargar: ${url}`);
          reject();
        };
        document.body.appendChild(script);
      });
    };

    let promise = Promise.resolve();

    scripts.forEach(url => {
      promise = promise.then(() => loadScript(url));
    });

    // Ejecutar lógica en $(document).ready()
    promise.then(() => {
      $(document).ready(function() {
        if (typeof window.initScript === 'function') {
          window.initScript(id); // Ejecuta initScript en los archivos cargados
        }
      });
    });
  }

  function cargar_filtros(controlador, ventana) {
    fetch($('#base_url').val() + controlador + '/crear_filtro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          param1: ventana,
        })
      })
      .then(response => response.json())
      .then(data => {
        const contenedorCampo = document.getElementById(`contenedor-campo-${ventana}`);
        contenedorCampo.innerHTML = ''; // Limpiar contenedor antes de agregar filtros

        if (data.resultados && Array.isArray(data.resultados)) {
          const elementos = [];

          // Agregar primero los select
          data.resultados.forEach(element => {
            if (element.tipo_campo === "select") {
              elementos.push(crearCampo(ventana, element.tipo_campo, element.label, element.nombre_filtro, element.opciones || []));
            }
          });

          // Luego los inputs de texto, fechas, etc.
          data.resultados.forEach(element => {
            if (element.tipo_campo !== "select" && element.tipo_campo !== "button") {
              elementos.push(crearCampo(ventana, element.tipo_campo, element.label, element.nombre_filtro));
            }
          });

          // Finalmente, los botones
          data.resultados.forEach(element => {
            if (element.tipo_campo === "button") {
              elementos.push(crearCampo(ventana, element.tipo_campo, element.label, element.nombre_filtro));
            }
          });

          // Insertar los elementos en el contenedor
          elementos.forEach(elemento => {
            contenedorCampo.appendChild(elemento);
          });
        } else {
          console.log('No hay resultados o el formato es incorrecto:', data);
        }
      })
      .catch(error => console.log(error));
  }

  function crearCampo(ventana, tipo, label, nombre, opciones = []) {
    const contenedor = document.createElement('div');
    contenedor.classList.add('d-flex', 'flex-column', 'me-2');

    const elementoID = `campo-${ventana}-${label}`; // Generar un ID único para cada ventana

    if (tipo === "button") {
      const button = document.createElement('button');
      button.type = "button";
      button.setAttribute('name', label);
      button.setAttribute('id', elementoID);
      button.setAttribute('class', 'btn btn-phoenix-success btn-sm');
      button.textContent = nombre || "Botón";
      button.style.fontSize = "10px";
      contenedor.appendChild(button);
    } else if (tipo === "select") {
      const select = document.createElement('select');
      select.setAttribute('name', label);
      select.setAttribute('id', elementoID);
      select.setAttribute('class', 'form-select form-select-sm');
      select.style.height = "100%";

      if (label === "clientes") {
        select.style.display = "none";
      } else if (label === "empresas") {
        select.style.display = "none";
      }

      const opcionDefault = document.createElement('option');
      opcionDefault.value = "";
      opcionDefault.textContent = "Seleccione " + label;
      opcionDefault.selected = true;
      select.appendChild(opcionDefault);

      if (Array.isArray(opciones) && opciones.length > 0) {
        opciones.forEach(opcion => {
          const option = document.createElement('option');
          option.value = opcion;
          option.textContent = opcion;
          select.appendChild(option);
        });
      }

      contenedor.appendChild(select);
    } else {
      const input = document.createElement('input');
      input.type = tipo;
      input.setAttribute('name', label);
      input.setAttribute('id', elementoID);
      input.setAttribute('class', 'form-control form-control-sm');
      input.style.height = "50%";

      if (tipo === "date" || tipo === "datetime-local") {
        const fechaActual = new Date();
        fechaActual.setHours(fechaActual.getHours() - 5);

        if (tipo === "date") {
          input.value = fechaActual.toISOString().split('T')[0];
        } else if (tipo === "datetime-local") {
          input.value = fechaActual.toISOString().slice(0, 16);
        }
      }

      contenedor.appendChild(input);
    }

    return contenedor;
  }



  // function cargar_filtros(controlador, ventana) {
  //   fetch($('#base_url').val() + controlador + '/crear_filtro', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       body: new URLSearchParams({
  //         param1: ventana,
  //       })
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //       // Seleccionar el contenedor de campos específico para esta ventana
  //       const contenedorCampo = document.getElementById(`contenedor-campo-${ventana}`);
  //       contenedorCampo.innerHTML = '';

  //       if (data.resultados && Array.isArray(data.resultados)) {
  //         const elementos = []; // Almacenar los elementos en orden

  //         // Primero agregar los <select>
  //         data.resultados.forEach(element => {
  //           if (element.tipo_campo === "select") {
  //             elementos.push(crearCampo(element.tipo_campo, element.label, element.nombre_filtro, element.opciones || []));
  //           }
  //         });

  //         // Luego agregar los demás filtros (ejemplo: input de fecha o texto)
  //         data.resultados.forEach(element => {
  //           if (element.tipo_campo !== "select" && element.tipo_campo !== "button") {
  //             elementos.push(crearCampo(element.tipo_campo, element.label, element.nombre_filtro));
  //           }
  //         });

  //         // Finalmente agregar el botón de acciones
  //         data.resultados.forEach(element => {
  //           if (element.tipo_campo === "button") {
  //             elementos.push(crearCampo(element.tipo_campo, element.label, element.nombre_filtro));
  //           }
  //         });

  //         // Insertar los elementos en el contenedor en el orden correcto
  //         elementos.forEach(elemento => {
  //           contenedorCampo.appendChild(elemento);
  //         });

  //       } else {
  //         console.log('No hay resultados o el formato es incorrecto:', data);
  //       }
  //     })
  //     .catch(error => console.log(error));
  // }

  // function crearCampo(tipo, label, nombre, opciones = []) {
  //   const contenedor = document.createElement('div');
  //   contenedor.classList.add('d-flex', 'flex-column', 'me-2'); // Agrega margen a la derecha entre elementos

  //   const button = document.createElement('button');
  //   if (tipo === "button") {
  //     button.type = "button";
  //     button.setAttribute('name', label);
  //     button.setAttribute('id', label);
  //     button.setAttribute('class', 'btn btn-phoenix-success btn-sm');
  //     button.textContent = nombre || "Botón";
  //     button.style.fontSize = "10px";
  //     contenedor.appendChild(button);
  //   } else if (tipo === "select") {
  //     // Crear un elemento <select>
  //     const select = document.createElement('select');
  //     select.setAttribute('name', label);
  //     select.setAttribute('id', label);
  //     select.setAttribute('class', 'form-select form-select-sm');
  //     select.style.height = "50%";

  //     if (label === "clientes") {
  //       select.style.display = "none";
  //     } else {

  //     }

  //     // Agregar la opción "Seleccione" por defecto
  //     const opcionDefault = document.createElement('option');
  //     opcionDefault.value = ""; // Valor vacío
  //     opcionDefault.textContent = "Seleccione " + label; // Texto que se mostrará
  //     // opcionDefault.disabled = true; // Deshabilitar la opción para que no sea seleccionable
  //     opcionDefault.selected = true; // Seleccionar esta opción por defecto
  //     select.appendChild(opcionDefault);

  //     // Agregar las opciones al <select>
  //     // Verificar si hay opciones antes de iterar
  //     if (Array.isArray(opciones) && opciones.length > 0) {
  //       opciones.forEach(opcion => {
  //         const option = document.createElement('option');
  //         option.value = opcion;
  //         option.textContent = opcion;
  //         select.appendChild(option);
  //       });
  //     }

  //     contenedor.appendChild(select);
  //   } else {
  //     const input = document.createElement('input');
  //     input.type = tipo;
  //     input.setAttribute('name', label);
  //     input.setAttribute('id', label);
  //     input.setAttribute('class', 'form-control form-control-sm');
  //     input.style.height = "50%";

  //     // Si el campo es de tipo "date" o "datetime-local", establecer la fecha y hora de Colombia
  //     if (tipo === "date" || tipo === "datetime-local") {
  //       const fechaActual = new Date();

  //       // Ajustar la hora a la zona horaria de Colombia (UTC-5)
  //       fechaActual.setHours(fechaActual.getHours() - 5);

  //       if (tipo === "date") {
  //         // Formatear la fecha en YYYY-MM-DD
  //         const fechaColombia = fechaActual.toISOString().split('T')[0];
  //         input.value = fechaColombia;
  //       } else if (tipo === "datetime-local") {
  //         // Formatear la fecha y hora en YYYY-MM-DDTHH:MM
  //         const fechaHoraColombia = fechaActual.toISOString().slice(0, 16);
  //         input.value = fechaHoraColombia;
  //       }
  //     }

  //     contenedor.appendChild(input);
  //   }

  //   return contenedor;
  // }
</script>


</body>

</html>