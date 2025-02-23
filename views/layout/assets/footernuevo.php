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
<script>
  $(document).ready(function() {
    $('#tipo_mercancia').select2({
      placeholder: 'Seleccione una opción',
      allowClear: true,
      dropdownCssClass: 'select2-sm', // Aplica la clase al dropdown
      containerCssClass: 'select2-sm', // Aplica la clase al contenedor
    });
  });
</script>
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

  // function ejecutarJavaScriptDeVentana(id) {
  //   // Aquí puedes agregar lógica específica para cada ventana
  //   switch (id) {
  //     case '1':
  //       cargarScripts(['<?= BASE_URL ?>views/layout/assets/lib/serv_clientecotizaciones_ajax.js']);
  //       break;
  //     case '2':
  //       cargarScripts(['<?= BASE_URL ?>views/serviciocliente/js/prioritarias.js']);
  //       // Lógica específica para la ventana 2
  //       break;
  //     case '4':
  //       // Cargar el archivo JavaScript específico para la ventana 4
  //       cargarScripts(['<?= BASE_URL ?>views/layout/assets/lib/serv_clientecotizaciones_ajax.js',
  //         '<?php echo BASE_URL ?>public/vendors/list.js/list.min.js',
  //         '<?php echo BASE_URL ?>public/vendors/choices/choices.min.js'
  //       ]);
  //       break;
  //     case "5":
  //       cargarScripts(['<?= BASE_URL ?>views/serviciocliente/js/solicitudes.js']);
  //       break;

  //     case "8":
  //       cargarScripts(['<?= BASE_URL ?>/views/prefiltro_nacional/js/prefiltro_nacional.js']);
  //       break;
  //     case "11":
  //       cargarScripts(['<?= BASE_URL ?>/views/prefiltro_nacional/js/prefiltro_nacional.js']);
  //       break;
  //       // Agrega más casos según sea necesario
  //     default:
  //       console.log('Ventana no reconocida');
  //   }
  // }

  // // Función para cargar un archivo JavaScript dinámicamente
  // function cargarScripts(scripts) {
  //   const loadScript = (url) => {
  //     return new Promise((resolve, reject) => {
  //       const script = document.createElement('script');
  //       script.src = url;
  //       script.type = 'text/javascript';
  //       script.onload = resolve;
  //       script.onerror = reject;
  //       document.body.appendChild(script);
  //     });
  //   };

  //   let promise = Promise.resolve();

  //   scripts.forEach(url => {
  //     promise = promise.then(() => loadScript(url));
  //   });
  // }

  // function ejecutarJavaScriptDeVentana(id) {
  //   let scripts = [];

  //   switch (id) {
  //     case '1':
  //       scripts = ['<?= BASE_URL ?>views/layout/assets/lib/serv_clientecotizaciones_ajax.js'];
  //       break;
  //     case '2':
  //       scripts = ['<?= BASE_URL ?>views/serviciocliente/js/prioritarias.js'];
  //       break;
  //     case '4':
  //       scripts = [
  //         '<?= BASE_URL ?>views/layout/assets/lib/serv_clientecotizaciones_ajax.js',
  //         '<?= BASE_URL ?>public/vendors/list.js/list.min.js',
  //         '<?= BASE_URL ?>public/vendors/choices/choices.min.js'
  //       ];
  //       break;
  //     case '5':
  //       scripts = ['<?= BASE_URL ?>views/serviciocliente/js/solicitudes.js'];
  //       break;
  //     case '8':
  //     case '11':
  //       scripts = ['<?= BASE_URL ?>/views/prefiltro_nacional/js/prefiltro_nacional.js'];
  //       break;
  //     default:
  //       console.log('Ventana no reconocida');
  //       return;
  //   }

  //   cargarScripts(scripts, id);
  // }

  // // Función para cargar los archivos JavaScript dinámicamente
  // function cargarScripts(scripts, id) {
  //   const loadScript = (url) => {
  //     return new Promise((resolve, reject) => {
  //       const script = document.createElement('script');
  //       script.src = url;
  //       script.type = 'text/javascript';
  //       script.async = true; // Para no bloquear la carga
  //       script.onload = () => {
  //         console.log(`Cargado: ${url} con ID: ${id}`);
  //         if (typeof window.initScript === 'function') {
  //           window.initScript(id); // Llamar a una función dentro del script cargado si existe
  //         }
  //         resolve();
  //       };
  //       script.onerror = () => {
  //         console.error(`Error al cargar: ${url}`);
  //         reject();
  //       };
  //       document.body.appendChild(script);
  //     });
  //   };

  //   let promise = Promise.resolve();

  //   scripts.forEach(url => {
  //     promise = promise.then(() => loadScript(url));
  //   });
  // }


  function ejecutarJavaScriptDeVentana(id) {
    let scripts = [];

    switch (id) {
      case '1':
        scripts = ['<?= BASE_URL ?>views/layout/assets/lib/serv_clientecotizaciones_ajax.js'];
        break;
      case '2':
        scripts = ['<?= BASE_URL ?>views/serviciocliente/js/prioritarias.js'];
        break;
      case '4':
        scripts = [
          '<?= BASE_URL ?>views/layout/assets/lib/serv_clientecotizaciones_ajax.js',
          '<?= BASE_URL ?>public/vendors/list.js/list.min.js',
          '<?= BASE_URL ?>public/vendors/choices/choices.min.js'
        ];
        break;
      case '5':
        scripts = ['<?= BASE_URL ?>views/serviciocliente/js/solicitudes.js'];
        break;
      case '8':
      case '11':
        scripts = ['<?= BASE_URL ?>/views/prefiltro_nacional/js/prefiltro_nacional.js'];
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
  //       const contenedorCampo = document.getElementById('contenedor-campo');
  //       contenedorCampo.innerHTML = '';

  //       if (data.resultados && Array.isArray(data.resultados)) {
  //         data.resultados.forEach(element => {
  //           const campo = crearCampo(element.tipo_campo, element.label, element.nombre_filtro);
  //           contenedorCampo.appendChild(campo);
  //         });
  //       } else {
  //         console.log('No hay resultados o el formato es incorrecto:', data);
  //       }
  //     })
  //     .catch(error => console.log(error));
  // }

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
  //         data.resultados.forEach(element => {
  //           // const campo = crearCampo(element.tipo_campo, element.label, element.nombre_filtro, data.opciones);
  //           const campo = crearCampo(element.tipo_campo, element.label, element.nombre_filtro, element.opciones || []);
  //           contenedorCampo.appendChild(campo);
  //         });
  //       } else {
  //         console.log('No hay resultados o el formato es incorrecto:', data);
  //       }
  //     })
  //     .catch(error => console.log(error));
  // }



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
        // Seleccionar el contenedor de campos específico para esta ventana
        const contenedorCampo = document.getElementById(`contenedor-campo-${ventana}`);
        contenedorCampo.innerHTML = '';

        if (data.resultados && Array.isArray(data.resultados)) {
          const elementos = []; // Almacenar los elementos en orden

          // Primero agregar los <select>
          data.resultados.forEach(element => {
            if (element.tipo_campo === "select") {
              elementos.push(crearCampo(element.tipo_campo, element.label, element.nombre_filtro, element.opciones || []));
            }
          });

          // Luego agregar los demás filtros (ejemplo: input de fecha o texto)
          data.resultados.forEach(element => {
            if (element.tipo_campo !== "select" && element.tipo_campo !== "button") {
              elementos.push(crearCampo(element.tipo_campo, element.label, element.nombre_filtro));
            }
          });

          // Finalmente agregar el botón de acciones
          data.resultados.forEach(element => {
            if (element.tipo_campo === "button") {
              elementos.push(crearCampo(element.tipo_campo, element.label, element.nombre_filtro));
            }
          });

          // Insertar los elementos en el contenedor en el orden correcto
          elementos.forEach(elemento => {
            contenedorCampo.appendChild(elemento);
          });

        } else {
          console.log('No hay resultados o el formato es incorrecto:', data);
        }
      })
      .catch(error => console.log(error));
  }




  // function crearCampo(tipo, label, nombre) {
  //   const contenedor = document.createElement('div');
  //   contenedor.classList.add('d-flex', 'flex-column', 'me-2'); // Agrega margen a la derecha entre elementos

  //   if (tipo === "button") {
  //     const button = document.createElement('button');
  //     button.type = "button";
  //     button.setAttribute('name', label);
  //     button.setAttribute('id', label);
  //     button.setAttribute('class', 'btn btn-phoenix-success btn-sm');
  //     button.textContent = nombre || "Botón";
  //     button.style.fontSize = "10px";
  //     contenedor.appendChild(button);
  //   } else {
  //     if (tipo === "date") {
  //       const input = document.createElement('input');
  //       input.type = tipo;
  //       input.setAttribute('name', label);
  //       input.setAttribute('id', label);
  //       input.setAttribute('class', 'form-control form-control-sm');
  //       input.style.height = "50%";
  //       contenedor.appendChild(input);
  //     } else {
  //       const input = document.createElement('input');
  //       input.type = tipo;
  //       input.setAttribute('name', label);
  //       input.setAttribute('id', label);
  //       input.setAttribute('class', 'form-control form-control-sm');
  //       input.style.height = "50%";
  //       contenedor.appendChild(input);
  //     }
  //   }

  //   return contenedor;
  // }
  // function crearCampo(tipo, label, nombre) {
  //   const contenedor = document.createElement('div');
  //   contenedor.classList.add('d-flex', 'flex-column', 'me-2'); // Agrega margen a la derecha entre elementos

  //   if (tipo === "button") {
  //     const button = document.createElement('button');
  //     button.type = "button";
  //     button.setAttribute('name', label);
  //     button.setAttribute('id', label);
  //     button.setAttribute('class', 'btn btn-phoenix-success btn-sm');
  //     button.textContent = nombre || "Botón";
  //     button.style.fontSize = "10px";
  //     contenedor.appendChild(button);
  //   } else {
  //     const input = document.createElement('input');
  //     input.type = tipo;
  //     input.setAttribute('name', label);
  //     input.setAttribute('id', label);
  //     input.setAttribute('class', 'form-control form-control-sm');
  //     input.style.height = "50%";

  //     // Si el campo es de tipo "date", asignar la fecha actual
  //     if (tipo === "date") {
  //       const fechaActual = new Date().toISOString().split('T')[0];
  //       input.value = fechaActual;
  //     }

  //     contenedor.appendChild(input);
  //   }

  //   return contenedor;
  // }

  // function crearCampo(tipo, label, nombre) {
  //   const contenedor = document.createElement('div');
  //   contenedor.classList.add('d-flex', 'flex-column', 'me-2'); // Agrega margen a la derecha entre elementos

  //   if (tipo === "button") {
  //     const button = document.createElement('button');
  //     button.type = "button";
  //     button.setAttribute('name', label);
  //     button.setAttribute('id', label);
  //     button.setAttribute('class', 'btn btn-phoenix-success btn-sm');
  //     button.textContent = nombre || "Botón";
  //     button.style.fontSize = "10px";
  //     contenedor.appendChild(button);
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
  function crearCampo(tipo, label, nombre, opciones = []) {
    const contenedor = document.createElement('div');
    contenedor.classList.add('d-flex', 'flex-column', 'me-2'); // Agrega margen a la derecha entre elementos

    const button = document.createElement('button');
    if (tipo === "button") {
      button.type = "button";
      button.setAttribute('name', label);
      button.setAttribute('id', label);
      button.setAttribute('class', 'btn btn-phoenix-success btn-sm');
      button.textContent = nombre || "Botón";
      button.style.fontSize = "10px";
      contenedor.appendChild(button);
    } else if (tipo === "select") {
      // Crear un elemento <select>
      const select = document.createElement('select');
      select.setAttribute('name', label);
      select.setAttribute('id', label);
      // select.setAttribute('class', 'form-select form-select-sm');
      select.style.height = "50%";

      // Agregar la opción "Seleccione" por defecto
      const opcionDefault = document.createElement('option');
      opcionDefault.value = ""; // Valor vacío
      opcionDefault.textContent = "Seleccione filtro"; // Texto que se mostrará
      opcionDefault.disabled = true; // Deshabilitar la opción para que no sea seleccionable
      opcionDefault.selected = true; // Seleccionar esta opción por defecto
      select.appendChild(opcionDefault);

      // Agregar las opciones al <select>
      // Verificar si hay opciones antes de iterar
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
      input.setAttribute('id', label);
      // input.setAttribute('class', 'form-control form-control-sm');
      input.style.height = "50%";

      // Si el campo es de tipo "date" o "datetime-local", establecer la fecha y hora de Colombia
      if (tipo === "date" || tipo === "datetime-local") {
        const fechaActual = new Date();

        // Ajustar la hora a la zona horaria de Colombia (UTC-5)
        fechaActual.setHours(fechaActual.getHours() - 5);

        if (tipo === "date") {
          // Formatear la fecha en YYYY-MM-DD
          const fechaColombia = fechaActual.toISOString().split('T')[0];
          input.value = fechaColombia;
        } else if (tipo === "datetime-local") {
          // Formatear la fecha y hora en YYYY-MM-DDTHH:MM
          const fechaHoraColombia = fechaActual.toISOString().slice(0, 16);
          input.value = fechaHoraColombia;
        }
      }

      contenedor.appendChild(input);
    }

    return contenedor;
  }
</script>


</body>

</html>