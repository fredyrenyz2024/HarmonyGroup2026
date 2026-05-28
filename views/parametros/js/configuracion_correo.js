// const d = document;
// const w = window;
window.contador = 1;
window.contadorHoras = 1;
// d.addEventListener('DOMContentLoaded', async e => {});
// e.preventDefault();
window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global
  // console.log("🚀 ~ window.VENTANA:", window.VENTANA)
  // let boton = document.getElementById(`campo-${window.VENTANA}-nueva_configuracion`);

  let boton = document.getElementById(`nueva_configuracion`);
  // console.log("🚀 ~ boton:", boton)
  if (boton) {
    const atributos = {
      "data-bs-toggle": "offcanvas",
      "data-bs-target": "#offcanvasNuevaNotificaicones",
      "aria-controls": "offcanvasNuevaNotificaicones"
    };

    for (let key in atributos) {
      boton.setAttribute(key, atributos[key]);
    }
  }

  // $('.select2').select2();
  Listar_configuraciones();
  Lsitar_clientes();

  document.addEventListener('click', async e => {
    if (e.target.matches('#btn_guardar_configuracion_cliente') || e.target.matches('#btn_guardar_configuracion_cliente *')) {
      const btn = e.target.closest('#btn_guardar_configuracion_cliente');
      const configuracionId = btn.getAttribute('data-configuracionId');
      const GrupoId = btn.getAttribute('data-GrupoId');

      let correo_automatico = document.getElementById('correo_automatico');
      let correo_manual = document.getElementById('correo_manual');
      let mensaje_whatsapp = document.getElementById('mensaje_whatsapp');
      let importacion = document.getElementById('importacion');
      let exportacion = document.getElementById('exportacion');
      let nacional = document.getElementById('nacional');
      let urbano = document.getElementById('urbano');
      let torre_control = document.getElementById('torre_control');
      // Selecciona todos los checkboxes de `reporta_cliente` y `reporta_sac`
      const checkboxes = document.querySelectorAll('.reporta_cliente, .reporta_sac');
      // Verifica si al menos uno de los checkboxes está seleccionado
      // const algunoSeleccionado = Array.from(checkboxes).some(checkbox => checkbox.checked);

      let datos = {
        nombre: [],
        correo: [],
        celular: []
      };

      Array.from(document.getElementsByName('nombre[]')).forEach(element => {
        datos.nombre.push(element.value);
      });

      Array.from(document.getElementsByName('correo[]')).forEach(element => {
        datos.correo.push(element.value);
      });

      Array.from(document.getElementsByName('celular[]')).forEach(element => {
        datos.celular.push(element.value); // corregido aquí
      });

      let dato = JSON.stringify({ datos });
      // console.log("🚀 ~ dato:", dato)

      let datosHoras = {
        hora: []
      }

      Array.from(document.getElementsByName('hora[]')).forEach(element => {
        datosHoras.hora.push(element.value); // corregido aquí
      });

      let datoHora = JSON.stringify({ datosHoras });

      /* Validaciones para poder crear las configuraciones */
      const seleccionados = document.querySelectorAll(".check_tipo_operacion:checked");
      const seleccionadosTipoEnvios = document.querySelectorAll(".check_tipo_envio:checked");

      if (seleccionados.length === 0) {
        Swal.fire({
          title: 'Advertencia',
          text: 'Seleccionar minimo un tipo de opración para crear el grupo.',
          icon: 'warning',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      } else if (document.getElementById('cliente').value === '') {
        Swal.fire({
          title: 'Advertencia',
          text: 'Seleccionar un cliente para la operación.',
          icon: 'warning',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      } else if (!seleccionadosTipoEnvios.length === 0) {
        Swal.fire({
          title: 'Advertencia',
          text: 'Seleccionar un metodo de envio de correo.',
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
            formdata.append('cliente', document.getElementById('cliente').value);
            formdata.append('nombre_grupo', document.getElementById('nombre_grupo').value);
            formdata.append('correo_automatico', correo_automatico.checked ? 'SI' : 'NO');
            formdata.append('correo_manual', correo_manual.checked ? 'SI' : 'NO');
            formdata.append('mensaje_whatsapp', mensaje_whatsapp.checked ? 'SI' : 'NO');
            formdata.append('importacion', importacion.checked ? 'SI' : 'NO');
            formdata.append('exportacion', exportacion.checked ? 'SI' : 'NO');
            formdata.append('nacional', nacional.checked ? 'SI' : 'NO');
            formdata.append('urbano', urbano.checked ? 'SI' : 'NO');
            formdata.append('torre_control', torre_control.checked ? 'SI' : 'NO');
            formdata.append('dato', dato);
            formdata.append('dato_hora', datoHora);
            formdata.append('configuracionId', configuracionId);
            formdata.append('GrupoId', GrupoId);

            /* Determinar que proceso se va ahcer si actualizacion o insercion de nueva configuracion */
            let url_operacion = '';
            if (configuracionId) {
              url_operacion = $('#base_url').val() + 'parametros/Actualizar_configuracion_correo';
            } else {
              url_operacion = $('#base_url').val() + 'parametros/Guardar_configuracion_correo';
            }

            try {
              const response = await fetch(url_operacion, {
                method: 'POST',
                body: formdata,
                cache: 'no-cache',
              });

              const data = await response.json();
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
                // setInterval(() => {
                //   window.location.reload();
                // }, 1500);
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
              // Consultar_contactos(d.getElementById('cliente').value);
            }
          }
        });
      }
    }

    // if (e.target.matches('#btn_editar_configuracion') || e.target.matches('#btn_editar_configuracion *')) {
    //   const btn = e.target.closest('#btn_editar_configuracion');
    //   const configuracionId = btn.getAttribute('data-id');
    //   document.getElementById("btn_guardar_configuracion_cliente").setAttribute("data-configuracionId", configuracionId);
    //   // Enviar por AJAX
    //   $.ajax({
    //     url: $('#base_url').val() + 'parametros/Editar_Configuraciones',
    //     type: "POST",
    //     data: {
    //       // contactos: JSON.stringify(contactos),
    //       configuracion_id: configuracionId
    //     },
    //     success: function (res) {
    //       let resp = JSON.parse(res);
    //       if (resp.configuracion) {
    //         // showToast("success", "Configuración Guardada", "Usuarios registrados correctamente");
    //         resp.configuracion.importacion === "SI" ? document.getElementById("importacion").checked = true : document.getElementById("importacion").checked = false;
    //         resp.configuracion.exportacion === "SI" ? document.getElementById("exportacion").checked = true : document.getElementById("exportacion").checked = false;
    //         resp.configuracion.nacional === "SI" ? document.getElementById("nacional").checked = true : document.getElementById("nacional").checked = false;
    //         resp.configuracion.urbano === "SI" ? document.getElementById("urbano").checked = true : document.getElementById("urbano").checked = false;
    //         /* Clientes y nombre de grupo */
    //         document.getElementById("cliente").value = resp.configuracion.cliente_id;
    //         document.getElementById("nombre_grupo").value = resp.configuracion.nombre_grupo;
    //         /* Opciones de envio de notificaiones para los usuarios */
    //         resp.configuracion.envio_automatico === "SI" ? document.getElementById("correo_automatico").checked = true : document.getElementById("correo_automatico").checked = false;
    //         resp.configuracion.envio_manual === "SI" ? document.getElementById("correo_manual").checked = true : document.getElementById("correo_manual").checked = false;
    //         resp.configuracion.envio_whatsapp === "SI" ? document.getElementById("mensaje_whatsapp").checked = true : document.getElementById("mensaje_whatsapp").checked = false;

    //         const tbody_datos = document.getElementById('tbody_datos');
    //         tbody_datos.innerHTML = "";
    //         resp.contactos.forEach(element => {
    //           const fila = document.createElement('tr');
    //           fila.innerHTML = `
    //             <td style="width: auto; white-space: nowrap;"> ${contador} </td>
    //             <td style="width: auto; white-space: nowrap;"> <input type="text" name="nombre[]" placeholder="Nombre" class="form-control form-control-sm" value="${element.nombre}"> </td>
    //             <td style="width: auto; white-space: nowrap;"> <input type="email" name="correo[]" placeholder="Correo" class="form-control form-control-sm" value="${element.correo}"> </td>
    //             <td style="width: auto; white-space: nowrap;"> <input type="number" name="celular[]" placeholder="Celular" class="form-control form-control-sm" value="${element.celular}"> </td>
    //             <td style="width: auto; white-space: nowrap;"> <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1 btnEliminar"><i class="fas fa-trash-alt"></i></button> </td>
    //           `;

    //           tbody_datos.appendChild(fila);
    //           contador++;
    //         });

    //         /* Horas de envio */
    //         const tbody = document.getElementById('tbody_horas_envio');
    //         tbody.innerHTML = "";
    //         resp.horas.forEach(element1 => {
    //           const fila = document.createElement('tr');
    //           fila.innerHTML = `
    //             <td style="width: auto; white-space: nowrap;"> ${contadorHoras} </td>
    //             <td style="width: auto; white-space: nowrap;"> <input type="time" name="hora[]" placeholder="Hora" class="form-control form-control-sm" value="${element1.hora_envio}"> </td>
    //             <td style="width: auto; white-space: nowrap;"> <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1 btnEliminar"><i class="fas fa-trash-alt"></i></button> </td>
    //           `;
    //           tbody.appendChild(fila);
    //           contadorHoras++;
    //         });
    //       } else {
    //         showToast("danger", "Error", "No se pudo guardar");
    //       }
    //     }
    //   });
    //   // console.log("ID:", id);
    // }

    if (e.target.matches('#btn_editar_configuracion') || e.target.matches('#btn_editar_configuracion *')) {
      const btn = e.target.closest('#btn_editar_configuracion');
      const configuracionId = btn.getAttribute('data-id');
      document.getElementById("btn_guardar_configuracion_cliente").setAttribute("data-configuracionId", configuracionId);
      // Enviar por AJAX
      $.ajax({
        url: $('#base_url').val() + 'parametros/Editar_Configuraciones',
        type: "POST",
        data: {
          // contactos: JSON.stringify(contactos),
          configuracion_id: configuracionId
        },
        success: function (res) {
          let resp = JSON.parse(res);
          if (resp.configuracion) {
            document.getElementById(`btn_guardar_configuracion_cliente`).setAttribute('data-GrupoId', resp.configuracion.grupo_id);
            // showToast("success", "Configuración Guardada", "Usuarios registrados correctamente");
            resp.configuracion.importacion === "SI" ? document.getElementById("importacion").checked = true : document.getElementById("importacion").disabled = true;
            resp.configuracion.exportacion === "SI" ? document.getElementById("exportacion").checked = true : document.getElementById("exportacion").disabled = true;
            resp.configuracion.nacional === "SI" ? document.getElementById("nacional").checked = true : document.getElementById("nacional").disabled = true;
            resp.configuracion.urbano === "SI" ? document.getElementById("urbano").checked = true : document.getElementById("urbano").disabled = true;
            resp.configuracion.torre_control === "SI" ? document.getElementById("torre_control").checked = true : document.getElementById("torre_control").disabled = true;
            /* Clientes y nombre de grupo */
            // document.getElementById("cliente").value = resp.configuracion.cliente_id;
            const slct_cliente = document.getElementById('cliente');
            const Cliente_Id = resp.configuracion.cliente_id.toLocaleString();
            // Buscar opción que tenga ese texto
            let optionValue_tipo = null;
            for (let option of slct_cliente.options) {
              if (option.value === Cliente_Id) {
                optionValue_tipo = option.value; // asignar el value correspondiente
                break;
              }
            }

            // Si encontramos la opción, seleccionarla con Select2
            if (optionValue_tipo) {
              $('#cliente').val(optionValue_tipo).trigger('change');
            }

            document.getElementById("nombre_grupo").value = resp.configuracion.nombre_grupo;
            /* Opciones de envio de notificaiones para los usuarios */
            resp.configuracion.envio_automatico === "SI" ? document.getElementById("correo_automatico").checked = true : document.getElementById("correo_automatico").checked = false;
            resp.configuracion.envio_manual === "SI" ? document.getElementById("correo_manual").checked = true : document.getElementById("correo_manual").checked = false;
            resp.configuracion.envio_whatsapp === "SI" ? document.getElementById("mensaje_whatsapp").checked = true : document.getElementById("mensaje_whatsapp").checked = false;

            const tbody_datos = document.getElementById('tbody_datos');
            tbody_datos.innerHTML = "";
            resp.contactos.forEach(element => {
              const fila = document.createElement('tr');
              fila.innerHTML = `
                <td style="width: auto; white-space: nowrap;"> ${contador} </td>
                <td style="width: auto; white-space: nowrap;"> <input type="text" name="nombre[]" placeholder="Nombre" class="form-control form-control-sm" value="${element.nombre}"> </td>
                <td style="width: auto; white-space: nowrap;"> <input type="email" name="correo[]" placeholder="Correo" class="form-control form-control-sm" value="${element.correo}"> </td>
                <td style="width: auto; white-space: nowrap;"> <input type="number" name="celular[]" placeholder="Celular" class="form-control form-control-sm" value="${element.celular}"> </td>
                <td style="width: auto; white-space: nowrap;"> <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1 btnEliminar"><i class="fas fa-trash-alt"></i></button> </td>
              `;

              tbody_datos.appendChild(fila);
              contador++;
            });

            /* Horas de envio */
            const tbody = document.getElementById('tbody_horas_envio');
            tbody.innerHTML = "";
            resp.horas.forEach(element1 => {
              const fila = document.createElement('tr');
              fila.innerHTML = `
                <td style="width: auto; white-space: nowrap;"> ${contadorHoras} </td>
                <td style="width: auto; white-space: nowrap;"> <input type="time" name="hora[]" placeholder="Hora" class="form-control form-control-sm" value="${element1.hora_envio}"> </td>
                <td style="width: auto; white-space: nowrap;"> <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1 btnEliminar"><i class="fas fa-trash-alt"></i></button> </td>
              `;
              tbody.appendChild(fila);
              contadorHoras++;
            });
          } else {
            showToast("danger", "Error", "No se pudo guardar");
          }
        }
      });
      // console.log("ID:", id);
    }

    if (e.target.matches("#btn_probar") || e.target.matches("#btn_probar *")) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/consulta-tercero/9000625968', {
          method: 'GET',
          cache: 'no-cache',
        });

        if (!response.ok) {
          throw new Error('Error al cargar los Responsables');
        }

        const data = await response.json();

        // contenedor
        const responseDiv = document.getElementById("response");
        responseDiv.innerHTML = "";

        // creo tabla
        let table = document.createElement("table");
        table.className = "table table-striped table-bordered"; // estilos bootstrap
        table.innerHTML = `
      <thead>
        <tr>
          <th>Ingreso ID</th>
          <th>Fecha Ingreso</th>
          <th>Nombre</th>
          <th>Nombre Alterno</th>
          <th>Dirección</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

        const tbody = table.querySelector("tbody");

        // recorro los terceros
        data.terceros.forEach(element => {
          const row = document.createElement("tr");
          row.innerHTML = `
        <td>${element.ingreso_id || ''}</td>
        <td>${element.fecha_ing || ''}</td>
        <td>${element.nombre || ''}</td>
        <td>${element.nombre_alt || ''}</td>
        <td>${element.direccion || ''}</td>
      `;
          tbody.appendChild(row);
        });

        responseDiv.appendChild(table);

      } catch (error) {
        alert(error.message || 'Error al cargar los Responsables');
      }
    }

    if (e.target.matches(`#btn_consultar_contactos`) || e.target.matches(`#btn_consultar_contactos *`)) {
      const btnConsultar = e.target.closest('#btn_consultar_contactos');
      const GrupoId = btnConsultar.getAttribute('data-GrupoId');
      const ClienteId = btnConsultar.getAttribute('data-ClienteId');
      const NombreGrupo = btnConsultar.getAttribute('data-NombreGrupo');

      document.getElementById(`nombre_grupo`).disabled = true;
      document.getElementById(`nombre_grupo`).value = NombreGrupo;

      document.getElementById(`btn_guardar_configuracion_cliente`).setAttribute('data-GrupoId', GrupoId);

      let formdata = new FormData();
      formdata.append('GrupoId', GrupoId);

      try {
        const response = await fetch($('#base_url').val() + 'parametros/Consultar_Contactos_Clientes', {
          method: 'POST',
          cache: 'no-cache',
          body: formdata,
        });

        if (!response.ok) {
          throw new Error('Error al cargar los Responsables');
        }

        const data = await response.json();
        // console.log("🚀 ~ data:", data)

        const tbody = document.getElementById('tbody_datos');
        tbody.innerHTML = ''; // limpia antes de llenar
        let contador = 1;

        // ✅ Recorremos y agregamos cada fila
        data.forEach((element) => {
          const fila = document.createElement('tr');

          fila.innerHTML = `
            <td style="width: auto; white-space: nowrap;"> ${contador} </td>
            <td style="width: auto; white-space: nowrap;">
              <input type="text" name="nombre[]" placeholder="Nombre" class="form-control form-control-sm" value='${element.nombre_contactos ?? ''}'>
            </td>
            <td style="width: auto; white-space: nowrap;">
              <input type="email" name="correo[]" placeholder="Correo" class="form-control form-control-sm" value='${element.email ?? ''}'>
            </td>
            <td style="width: auto; white-space: nowrap;">
              <input type="number" name="celular[]" placeholder="Celular" class="form-control form-control-sm" value='${element.telefono ?? ''}'>
            </td>
            <td style="width: auto; white-space: nowrap;">
              <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1 btnEliminar">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          `;

          // ✅ Agregar evento eliminar
          fila.querySelector('.btnEliminar').addEventListener('click', function () {
            fila.remove();
            // Recalcular numeración
            let filas = tbody.querySelectorAll('tr');
            filas.forEach((tr, i) => tr.querySelector('td').textContent = i + 1);
            contador = filas.length + 1;
          });

          tbody.appendChild(fila);
          contador++;
        });

      } catch (error) {
        alert(error.message || 'Error al cargar los Responsables');
      }
    }
  });

  // JavaScript (JS) - MODIFICADO

  // Función auxiliar para habilitar/deshabilitar elementos
  const toggleElementosFormulario = (deshabilitar) => {
    // 1. Botones
    document.getElementById('btnAgregar').disabled = deshabilitar;
    document.getElementById('btnAgregarContacto').disabled = deshabilitar;
    document.getElementById('btn_guardar_configuracion_cliente').disabled = deshabilitar;

    // 2. Inputs con la clase check_tipo_envio
    const inputsTipoEnvio = document.querySelectorAll('.check_tipo_envio');
    inputsTipoEnvio.forEach(input => {
      input.disabled = deshabilitar;
    });
  };


  $('#cliente').on('change.select2', async function (e) {
    const Cliente = $(this).val();

    document.getElementById(`nombre_grupo`).disabled = false;
    document.getElementById(`nombre_grupo`).value = '';

    // Limpiar tabla de contactos del cliente anterior (ajustado a tbody_datos)
    document.getElementById('tbody_datos').innerHTML = '';
    document.getElementById('tbody_datos_grupos').innerHTML = ''; // Limpiamos la tabla de grupos

    // Inicialmente, habilitamos todos los elementos antes de la petición (por si vienen de un estado deshabilitado)
    toggleElementosFormulario(false);

    let formdata = new FormData();
    formdata.append('Cliente', Cliente);

    try {
      const response = await fetch($('#base_url').val() + 'parametros/Consultar_Grupos_Clientes', {
        method: 'POST',
        cache: 'no-cache',
        body: formdata,
      });

      if (!response.ok) {
        throw new Error('Error al cargar los Responsables');
      }

      const data = await response.json();

      // =========================================================================
      // 🎯 VALIDACIÓN REQUERIDA: Verificar si el array de grupos está vacío
      // =========================================================================
      if (data.length === 0) {
        // Mostrar mensaje de alerta
        Swal.fire({
          title: '¡Atención!',
          html: `
            Debe crear grupo base para configurar envíos. <br><br>
            <a href="http://localhost/mvcLuisMiguel/Grupos/grupo_contacto?idmenu=3&submenu=128" class="swal2-confirm swal2-styled text-decoration-none" target='_blank' style="display:inline-block;">
              Ir a Grupo
            </a>
          `,
          icon: 'warning',
          showConfirmButton: false, // 👈 quita el botón default
          customClass: {
            popup: 'swal2-custom-font',
          }
        });

        // Deshabilitar los elementos de la Vista
        toggleElementosFormulario(true);

        return; // Terminar la ejecución aquí
      }
      // =========================================================================

      // Si hay datos, nos aseguramos de que los elementos estén habilitados (por si acaso)
      toggleElementosFormulario(false);

      // Proceso de llenado de la tabla (solo si hay datos)
      const tbodyGrupos = document.getElementById('tbody_datos_grupos');
      tbodyGrupos.innerHTML = '';

      data.forEach((element, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>
              <div class="dropdown">
                <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none"
                    href="#" role="button" data-bs-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">${element.nombre_grupo}</a>
                <div class="dropdown-menu dropdown-menu-end py-0">
                  <a class="dropdown-item fw-bold py-0" href="#" data-GrupoId='${element.id}' data-ClienteId='${Cliente}' data-NombreGrupo='${element.nombre_grupo}' id="btn_consultar_contactos" data-bs-toggle="modal" data-bs-target="#verticallyCentered">Seleccionar</a>
                </div>
              </div>
            </td>
            <td>${element.nombre}</td>
            `;
        tbodyGrupos.appendChild(tr);
      });

    } catch (error) {
      // En caso de error en la petición, también se recomienda deshabilitar los elementos.
      toggleElementosFormulario(true);
      alert(error.message || 'Error al cargar los Responsables');
    }
  });

  document.getElementById('btnAgregar').addEventListener('click', function () {
    const tbody = document.getElementById('tbody_datos');
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td style="width: auto; white-space: nowrap;"> ${contador} </td>
      <td style="width: auto; white-space: nowrap;"> <input type="text" name="nombre[]" placeholder="Nombre" class="form-control form-control-sm"> </td>
      <td style="width: auto; white-space: nowrap;"> <input type="email" name="correo[]" placeholder="Correo" class="form-control form-control-sm"> </td>
      <td style="width: auto; white-space: nowrap;"> <input type="number" name="celular[]" placeholder="Celular" class="form-control form-control-sm"> </td>
      <td style="width: auto; white-space: nowrap;"> <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1 btnEliminar"><i class="fas fa-trash-alt"></i></button> </td>
    `;

    tbody.appendChild(fila);
    contador++;

    // Asignar evento eliminar a este botón
    fila.querySelector('.btnEliminar').addEventListener('click', function () {
      fila.remove();
      // Recalcular numeración
      let filas = tbody.querySelectorAll('tr');
      filas.forEach((tr, index) => tr.querySelector('td').textContent = index + 1);
      contador = filas.length + 1;
    });
  });

  document.getElementById('btnAgregarContacto').addEventListener('click', function () {
    const tbody = document.getElementById('tbody_horas_envio');

    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td style="width: auto; white-space: nowrap;"> ${contadorHoras} </td>
      <td style="width: auto; white-space: nowrap;"> <input type="time" name="hora[]" placeholder="Hora" class="form-control form-control-sm"> </td>
      <td style="width: auto; white-space: nowrap;"> <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1 btnEliminar"><i class="fas fa-trash-alt"></i></button> </td>
    `;

    tbody.appendChild(fila);
    contadorHoras++;

    // Asignar evento eliminar a este botón
    fila.querySelector('.btnEliminar').addEventListener('click', function () {
      fila.remove();
      // Recalcular numeración
      let filas = tbody.querySelectorAll('tr');
      filas.forEach((tr, index) => tr.querySelector('td').textContent = index + 1);
      contadorHoras = filas.length + 1;
    });
  });

  // JavaScript (JS)
  document.addEventListener('change', async e => {
    // Verificamos si el evento ocurrió en un checkbox de tipo de operación
    if (e.target.matches('.check_tipo_operacion')) {
      const checkedCheckbox = e.target;
      // Obtenemos todos los checkboxes con la clase 'check_tipo_operacion'
      const allCheckboxes = document.querySelectorAll('.check_tipo_operacion');

      if (checkedCheckbox.checked) {
        // Caso 1: Se ha SELECCIONADO un checkbox

        // Deshabilitar todos los demás
        allCheckboxes.forEach(checkbox => {
          if (checkbox !== checkedCheckbox) {
            checkbox.disabled = true;
          }
        });

      } else {
        // Caso 2: Se ha DESELECCIONADO el checkbox

        // Habilitar todos los checkboxes
        allCheckboxes.forEach(checkbox => {
          checkbox.disabled = false;
        });
      }
    }
  });

}

/* Consultar los cntactto de grupo de cliente al momento de ahcer la configruacion */
async function Lsitar_clientes() {
  try {
    const response = await fetch($('#base_url').val() + 'parametros/Listar_clientes', {
      method: 'POST',
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error('Error al cargar los Responsables');
    }

    const data = await response.json();
    // Limpiar ambos select antes de agregar opciones
    let CLIENTES = document.getElementById('cliente');
    CLIENTES.innerHTML = '<option value="" selected>Seleccioonar..</option>'; // Limpiar opciones anteriores

    data.forEach(value => {
      let { id, nombre, user_log } = value;
      // Crear la opción para 'responsable_actual'
      let optActual = document.createElement('option');
      optActual.value = id;
      optActual.textContent = nombre;
      CLIENTES.appendChild(optActual);
    });

    $(`#cliente`).select2({
      placeholder: 'Seleccione un municipio',
      // allowClear: true,
      width: '100%',
      // dropdownParent: $('#verticallyCentered') // 👈 forzar que se pinte dentro del modal
    });
  } catch (error) {
    alert(error.message || 'Error al cargar los Responsables');
  }
}

async function Listar_configuraciones() {
  const totalColumnas = $('#manThead th').length || 8;

  // Mostrar spinner de carga
  $('#tbodyGrupos').html(`
        <tr>
            <td colspan="${totalColumnas}" class="text-center py-4">
                <div class="spinner-border text-success" role="status"></div>
                <p class="mt-2 text-muted">Consultando manifiestos en seguimiento...</p>
            </td>
        </tr>
    `);

  $.post($('#base_url').val() + 'parametros/Listar_Configuraciones', function (data) {
    $('#tbodyGrupos').empty();

    if (data && data.length > 0) {
      let cont = 1;
      const filas = data.map((mnf) => {
        // Estado (puedes cambiar la lógica según tu backend)
        const estado = mnf.estado_configuracion == 'ACTIVO'
          ? `<span class="badge badge-phoenix badge-phoenix-success">${mnf.estado_configuracion}</span>`
          : `<span class="badge badge-phoenix badge-phoenix-warning">${mnf.estado_configuracion}</span>`;

        return `
              <tr>
                <td>${cont++}</td>
                <td>${mnf.nombre}</td>
                    <td>
                        <div class="dropdown">
                            <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                ${mnf.nombre_grupo}
                            </a>
                            <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">

                                <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" id="btn_editar_configuracion" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNuevaNotificaicones" aria-controls="offcanvasNuevaNotificaicones" data-id="${mnf.configuracion_id}">
                                    <i class="fas fa-edit"></i> <span>Editar Configuración</span>
                                </a>

                                <!--<div class="dropdown-divider"></div>
                                <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" data-ClienteId="${mnf.Cliente_Id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasConfiguracionEnvios" aria-controls="offcanvasConfiguracionEnvios" id="btn_configuracion_envios">
                                    <i class="fas fa-cogs"></i> <span>Configuración Notificaciones</span>
                                </a>

                                <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" data-ClienteId="${mnf.Cliente_Id}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNotificacionesEnviadas" aria-controls="offcanvasNotificacionesEnviadas">
                                    <i class="fas fa-eye"></i> <span>Ver Registros enviados</span>
                                </a>-->
                            </div>
                        </div>
                    </td>
                    
                    <td>${mnf.envio_automatico}</td>
                    <td>${mnf.envio_manual}</td>
                    <td>${mnf.envio_whatsapp}</td>
                    <td>${mnf.Tipo_Transporte}</td>
                    <td>${estado}</td>
               </tr>`;
      });

      $('#tbodyGrupos').html(filas.join(''));
    } else {
      $('#tbodyGrupos').html(`
                <tr>
                    <td colspan="${totalColumnas}" class="text-center text-muted py-4">
                        No se encontraron manifiestos en seguimiento.
                    </td>
                </tr>
            `);
    }
  }, 'json').fail(function () {
    $('#tbodyGrupos').html(`
            <tr>
                <td colspan="${totalColumnas}" class="text-center text-danger py-4">
                    Error al cargar los manifiestos. Intenta nuevamente.
                </td>
            </tr>
        `);
  });
}