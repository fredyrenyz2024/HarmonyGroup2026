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
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

<script>
  // JavaScript para manejar el cambio de pestañas y "recargar" el formulario
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

    function ejecutarJavaScriptDeVentana(id) {
      let scripts = [];

      switch (id) {
        case '1':
          scripts = [
            // '<?= BASE_URL ?>views/layout/assets/lib/serv_clientecotizaciones_ajax.js',
            '<?= BASE_URL ?>views/serviciocliente/js/todos.js',
            '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '2':
          scripts = [
            '<?= BASE_URL ?>views/serviciocliente/js/prioritarias.js',
            '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '4':
          scripts = ['<?= BASE_URL ?>views/layout/assets/lib/serv_clientecotizaciones_ajax.js'];
          break;

        case '5':
          scripts = ['<?= BASE_URL ?>views/serviciocliente/js/pendientes.js',
            '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '7':
          scripts = ['<?= BASE_URL ?>views/serviciocliente/js/completadas.js',
            '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '8':
          scripts = ['<?= BASE_URL ?>/views/prefiltro_nacional/js/prefiltro_nacional.js',
            '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '11':
          scripts = [
            '<?= BASE_URL ?>/views/prefiltro_nacional/js/prioritarias_operaciones.js',
            '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '12':
          scripts = ['<?= BASE_URL ?>views/serviciocliente/js/en_curso.js',
            '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '13':
          scripts = [
            '<?= BASE_URL ?>views/prefiltro_nacional/js/pendientes_operaciones.js',
            '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '14':
          scripts = [
            '<?= BASE_URL ?>views/prefiltro_nacional/js/en_curso_operaciones.js',
            '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '16':
          scripts = [
            '<?= BASE_URL ?>views/torrecontrol/js/administrador_pedidos.js',
            '<?= BASE_URL ?>views/torrecontrol/js/helper_torre_control.js',
          ];
          break;

        case '17':
          scripts = [
            '<?= BASE_URL ?>views/torrecontrol/js/prioritarias_pedidos.js',
            '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '18':
          scripts = [
            '<?= BASE_URL ?>views/torrecontrol/js/pendientes_pedidos.js',
            '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '19':
          scripts = [
            '<?= BASE_URL ?>views/torrecontrol/js/en_curso_pedidos.js',
            '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '21':
          scripts = [
            '<?= BASE_URL ?>views/torrecontrol/js/nuevo_pedido.js'
          ];
          break;

        case '22':
          scripts = [
            '<?= BASE_URL ?>views/torrecontrol/proveedor/js/proveedor_pedidos.js',
            '<?= BASE_URL ?>views/torrecontrol/proveedor/js/helper_proveedor_torre_control.js',
            // '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '23':
          scripts = [
            '<?= BASE_URL ?>views/torrecontrol/proveedor/js/proveedor_prioritarias.js',
            '<?= BASE_URL ?>views/torrecontrol/proveedor/js/helper_proveedor_torre_control.js',
            // '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '24':
          scripts = [
            '<?= BASE_URL ?>views/torrecontrol/proveedor/js/proveedor_pendientes.js',
            '<?= BASE_URL ?>views/torrecontrol/proveedor/js/helper_proveedor_torre_control.js',
            // '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '25':
          scripts = [
            '<?= BASE_URL ?>views/torrecontrol/proveedor/js/proveedor_en_curso.js',
            '<?= BASE_URL ?>views/torrecontrol/proveedor/js/helper_proveedor_torre_control.js',
            // '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '26':
          scripts = [
            '<?= BASE_URL ?>views/torrecontrol/proveedor/js/proveedor_completadas.js',
            '<?= BASE_URL ?>views/torrecontrol/proveedor/js/helper_proveedor_torre_control.js',
            // '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '27':
          scripts = [
            '<?= BASE_URL ?>views/torrecontrol/cliente/js/clientes_todos.js',
            '<?= BASE_URL ?>views/torrecontrol/cliente/js/helper_cliente_torre_control.js',
            // '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '32':
          scripts = [
            '<?= BASE_URL ?>views/torrecontrol/cliente/js/clientes_nuevo_pedido.js',
            '<?= BASE_URL ?>views/torrecontrol/cliente/js/helper_cliente_torre_control.js',
            // '<?= BASE_URL ?>public/helpers/helpers.js',
          ];
          break;

        case '34':
          scripts = [
            '<?= BASE_URL ?>views/parametros/proveedor/js/nuevo_proeevor.js'
          ];
          break;

        case '33':
          scripts = [
            '<?= BASE_URL ?>views/parametros/proveedor/js/listar_proeevores.js'
          ];
          break;

        case '35':
          scripts = [
            '<?= BASE_URL ?>views/parametros/proveedor/js/asignar_proveedor.js'
          ];
          break;

        case '37':
          scripts = [
            '<?= BASE_URL ?>views/parametros/servicios/js/nuevo_servicio.js'
          ];
          break;

        case '36':
          scripts = [
            '<?= BASE_URL ?>views/parametros/servicios/js/listar_servicio.js'
          ];
          break;

        case '38':
          scripts = [
            '<?= BASE_URL ?>views/parametros/servicios/js/nuevo_servicio.js'
          ];
          break;

        case '39':
          scripts = [
            '<?= BASE_URL ?>views/torrecontrol/js/recurso_torre_control.js',
            '<?= BASE_URL ?>views/torrecontrol/js/helper_torre_control.js',
          ];
          break;

          case '41':
          scripts = [
            '<?= BASE_URL ?>views/torrecontrol/proveedor/js/recurso_proveedor_torre_control.js',
            // '<?= BASE_URL ?>views/torrecontrol/js/helper_torre_control.js',
            // '<?= BASE_URL ?>views/torrecontrol/proveedor/js/helper_proveedor_torre_control.js',
          ];
          break;

        default:
          console.log('Ventana no reconocida');
          return;
      }

      cargarScripts(scripts, id);
    }

    function cargarScripts(scripts, id) {
      // Eliminar los scripts existentes con el mismo data-ventana-id
      const previousScripts = document.querySelectorAll(`script[data-ventana-id="${id}"]`);
      previousScripts.forEach(script => {
        script.parentNode.removeChild(script);
        console.log(`Script eliminado con data-ventana-id: ${id}`);
      });

      const loadScript = (url) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = url;
          script.type = 'text/javascript';
          script.async = true;

          // Asigna el ID como atributo para identificarlo
          script.setAttribute('data-ventana-id', id);

          script.onload = () => {
            console.log(`Script cargado: ${url} con ID: ${id}`);
            resolve();
          };

          script.onerror = () => {
            console.error(`Error cargando: ${url}`);
            reject();
          };

          document.body.appendChild(script);
        });
      };

      const currentId = parseInt(id, 10);

      // Cargar los scripts en secuencia
      scripts.reduce((promise, url) => {
        return promise.then(() => loadScript(url));
      }, Promise.resolve()).then(() => {
        if (typeof window.initScript === 'function') {
          window.initScript(currentId);
        }
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
      contenedor.setAttribute('id', `contenedor_${ventana}_${label}`)

      const elementoID = `campo-${ventana}-${label}`; // Generar un ID único para cada ventana

      if (tipo === "button") {
        const button = document.createElement('button');
        // button.type = "button";
        // button.setAttribute('name', label);
        // button.setAttribute('id', elementoID);
        // button.setAttribute('class', 'btn btn-phoenix-success btn-sm');
        // button.textContent = nombre === "CARRITO" ? '' : nombre || "Botón";
        // button.style.fontSize = "10px";
        // contenedor.appendChild(button);
        button.type = "button";
        button.setAttribute('name', label);
        button.setAttribute('id', elementoID);
        button.setAttribute('class', 'btn btn-phoenix-success btn-sm');
        button.style.fontSize = "10px";

        // Crear un ícono en lugar de texto si el nombre es "CARRITO"
        if (nombre === "CARRITO") {
          button.setAttribute('class', 'btn btn-phoenix-primary btn-sm');
          const icono = document.createElement("i");
          icono.setAttribute("class", "uil uil-shopping-cart-alt");

          // Crear el contador dentro del botón
          const contador = document.createElement("span");
          contador.setAttribute("id", "contadorCarrito");
          contador.textContent = "0"; // Inicializar en 0
          contador.style.marginLeft = "5px"; // Espaciado entre icono y número

          button.appendChild(icono);
          button.appendChild(contador);

          // Aplicar estilos adicionales
          button.style.fontSize = "10px";
          button.style.display = "flex";
          button.style.alignItems = "center";
          button.style.gap = "5px"; // Espaciado entre icono y número
          button.style.display = "none";
        } else {
          button.textContent = nombre || "Botón";
        }

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
        } else if (label === "estados") {
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
  });
</script>


</body>

</html>