const d = document;
const w = window;
let valores = '';
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  valores = window.location.search;
  listar_colores();
  listar_marcar();
  listar_configuracion();
  Listar_clases_vehiculos();
  cargartipocarrocen();
  cargarempgps();
  rndcCargarVehiculoAseguradora();
  Listar_propietario();
  Listar_poseedor();
  Listar_conductor();

  let buscar = document.getElementById('buscar');
  buscar.addEventListener('input', async e => {
    const searchTerm = buscar.value.trim();
    if (searchTerm != '') {
      $.post(
        $('#id_url_ajax').val() + 'vehiculos/buscar_color',
        {datos: searchTerm},
        function(data) {
          // mostrar_resultados(data);
          let tbody = document.getElementById('tbl_colores');
          tbody.innerHTML = '';
          data.forEach(element => {
            const fila = document.createElement('tr');
            const columnaNumdoc = document.createElement('td');
            columnaNumdoc.textContent = element.id;
            columnaNumdoc.style.textAlign = 'center';

            const columnaColor = document.createElement('td');
            columnaColor.textContent = element.color;
            const columnaEstado = document.createElement('td');
            if (element.estado === '1') {
              columnaEstado.innerHTML = `<span class="label label-success">Activo</span>`;
              columnaEstado.style.textAlign = 'center';
            } else {
              columnaEstado.innerHTML = `<span class="label label-danger">Inactivo</span>`;
              columnaEstado.style.textAlign = 'center';
            }
            const columnaAccion = document.createElement('td');
            columnaAccion.innerHTML = `<button class="btn text-success btn-xs" id="btn_seleccionar_color" data-id="${element.id}" data-rncd="${element.rndc_id}" data-color="${element.color}"><i class="fa-solid fa-plus"></i>Agregar</button>`;
            // columnaAccion.style.width = '100%';
            // columnaAccion.style.margin = 'auto';
            columnaAccion.style.textAlign = 'center';

            fila.appendChild(columnaNumdoc);
            fila.appendChild(columnaColor);
            fila.appendChild(columnaEstado);
            fila.appendChild(columnaAccion);
            tbody.appendChild(fila);
          });
        },
        'json',
      );
    } else {
      listar_colores();
    }
  });

  let buscar_propietario = document.getElementById('buscar_propietario');
  buscar_propietario.addEventListener('input', async e => {
    const searchTerm = buscar_propietario.value.trim();
    if (searchTerm != '') {
      $.post(
        $('#id_url_ajax').val() + 'vehiculos/buscar_propietario',
        {datos: searchTerm},
        function(data) {
          // mostrar_resultados(data);
          let tbody = document.getElementById('tbl_propietarios');
          tbody.innerHTML = '';
          data.forEach(element => {
            const fila = document.createElement('tr');
            const columnaNumdoc = document.createElement('td');
            columnaNumdoc.textContent = element.numdoc_nexos;
            columnaNumdoc.style.textAlign = 'center';
            const columnaDocumento = document.createElement('td');
            columnaDocumento.textContent = element.numero_documento;
            const columnaNombre = document.createElement('td');
            columnaNombre.textContent =
              element.nombre.trim() + ' ' + element.apellido1 === ' ' ? element.apellido1 : element.apellido1.trim() + ' ' + element.apellido2 === ' ' ? element.apellido2 : element.apellido2.trim();
            // columnaNombre.style.textAlign = 'center';
            const columnaDireccion = document.createElement('td');
            columnaDireccion.textContent = element.direccion;
            const columnaCelular = document.createElement('td');
            columnaCelular.textContent = element.celular;
            const columnaAccion = document.createElement('td');
            let nombre_completo = element.nombre.trim() + ' ' + element.apellido1 + ' ' + element.apellido2;
            columnaAccion.innerHTML = `<button class="btn btn-success btn-xs" id="btn_seleccionar_propietario" data-id="${element.numdoc_nexos}" data-nombre_propietario="${nombre_completo}"><i class="far fa-plus-square"></i> Agregar</button>`;
            // columnaAccion.style.margin = 'auto';
            columnaAccion.style.textAlign = 'center';

            fila.appendChild(columnaNumdoc);
            fila.appendChild(columnaDocumento);
            fila.appendChild(columnaNombre);
            fila.appendChild(columnaDireccion);
            fila.appendChild(columnaCelular);
            fila.appendChild(columnaAccion);
            tbody.appendChild(fila);
          });
        },
        'json',
      );
    } else {
      Listar_propietario();
    }
  });

  let buscar_poseedor = document.getElementById('buscar_poseedor');
  buscar_poseedor.addEventListener('input', async e => {
    const searchTerm = buscar_poseedor.value.trim();
    if (searchTerm != '') {
      $.post(
        $('#id_url_ajax').val() + 'vehiculos/buscar_poseedor',
        {datos: searchTerm},
        function(data) {
          // mostrar_resultados(data);
          let tbody = document.getElementById('tbl_poseedor');
          tbody.innerHTML = '';
          data.forEach(element => {
            const fila = document.createElement('tr');
            const columnaNumdoc = document.createElement('td');
            columnaNumdoc.textContent = element.numdoc_nexos;
            columnaNumdoc.style.textAlign = 'center';

            const columnaDocumento = document.createElement('td');
            columnaDocumento.textContent = element.numero_documento;

            const columnaNombre = document.createElement('td');
            columnaNombre.textContent = element.nombre.trim() + ' ' + element.apellido1 + ' ' + element.apellido2;
            // columnaNombre.style.textAlign = 'center';

            const columnaDireccion = document.createElement('td');
            columnaDireccion.textContent = element.direccion;

            const columnaCelular = document.createElement('td');
            columnaCelular.textContent = element.celular;

            const columnaAccion = document.createElement('td');
            let nombre_completo = element.nombre.trim() + ' ' + element.apellido1 + ' ' + element.apellido2;
            columnaAccion.innerHTML = `<button class="btn btn-success btn-xs" id="btn_seleccionar_poseedor" data-id="${element.numdoc_nexos}" data-nombre_poseedor="${nombre_completo}"><i class="far fa-plus-square"></i> Agregar</button>`;
            // columnaAccion.style.margin = 'auto';
            columnaAccion.style.textAlign = 'center';

            fila.appendChild(columnaNumdoc);
            fila.appendChild(columnaDocumento);
            fila.appendChild(columnaNombre);
            fila.appendChild(columnaDireccion);
            fila.appendChild(columnaCelular);
            fila.appendChild(columnaAccion);
            tbody.appendChild(fila);
          });
        },
        'json',
      );
    } else {
      Listar_poseedor();
    }
  });

  let buscar_conductor = document.getElementById('buscar_conductor');
  buscar_conductor.addEventListener('input', async e => {
    const searchTerm = buscar_conductor.value.trim();
    if (searchTerm != '') {
      $.post(
        $('#id_url_ajax').val() + 'vehiculos/buscar_conductor',
        {datos: searchTerm},
        function(data) {
          // mostrar_resultados(data);
          let tbody = document.getElementById('tbl_conductor');
          tbody.innerHTML = '';
          data.forEach(element => {
            const fila = document.createElement('tr');
            const columnaNumdoc = document.createElement('td');
            columnaNumdoc.textContent = element.numdoc_nexos;
            columnaNumdoc.style.textAlign = 'center';

            const columnaDocumento = document.createElement('td');
            columnaDocumento.textContent = element.numero_documento;

            const columnaNombre = document.createElement('td');
            columnaNombre.textContent = element.nombre.trim() + ' ' + element.apellido1 + ' ' + element.apellido2;
            // columnaNombre.style.textAlign = 'center';

            const columnaDireccion = document.createElement('td');
            columnaDireccion.textContent = element.direccion;

            const columnaCelular = document.createElement('td');
            columnaCelular.textContent = element.celular;

            const columnaAccion = document.createElement('td');
            let nombre_completo = element.nombre.trim() + ' ' + element.apellido1 + ' ' + element.apellido2;
            columnaAccion.innerHTML = `<button class="btn btn-success btn-xs" id="btn_seleccionar_conductor" data-id="${element.numdoc_nexos}" data-nombre_conductor="${nombre_completo}"><i class="far fa-plus-square"></i> Agregar</button>`;
            // columnaAccion.style.margin = 'auto';
            columnaAccion.style.textAlign = 'center';

            fila.appendChild(columnaNumdoc);
            fila.appendChild(columnaDocumento);
            fila.appendChild(columnaNombre);
            fila.appendChild(columnaDireccion);
            fila.appendChild(columnaCelular);
            fila.appendChild(columnaAccion);
            tbody.appendChild(fila);
          });
        },
        'json',
      );
    } else {
      Listar_conductor();
    }
  });

  d.addEventListener('change', async e => {
    if (e.target.matches('#configuracion') || e.target.matches('#configuracion *')) {
      let dato = new FormData();
      RemueveFoco('#trailers');
      $('.nexos_messages_popup').html('');
      var padre = e.target.parentElement.parentElement;
      var nombre = padre.querySelector('#configuracion').value;
      dato.append('nombre', nombre);
      try {
        const response = await fetch($('#id_url_ajax').val() + 'vehiculos/traer_trailer', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          $('#trailers').html('<option value="">Seleccione</option>');
          if (nombre == 2 || nombre == 3 || nombre == 4 || nombre == 'CA' || nombre == 'V2' || nombre == 'V3' || nombre == 'V4') {
            $('#trailers').html('<option value="NA">No Aplica</option>');
          } else {
            if (data != null && data != '') {
              data.forEach(function(element, index) {
                $('#trailers').append('<option value="' + element.id + '">' + element.placa + ' (' + element.namec + ' ' + element.descc + ')</option>');
              });
            } else {
              msg_error = '<p>Debe crear un trailer para la configuración <strong>' + nombre + '</strong></p>';
              AplicaFoco('#trailers');
              $('.nexos_messages_popup').html(
                '<div role="alert" class="alert alert-primary alert-icon alert-icon-border alert-dismissible"><div class="icon"><i class="fas fa-info"></i></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Mnensaje!</strong>' +
                  msg_error +
                  '</div></div>',
              );
              $('#crea_vehiculos').animate({scrollTop: 0}, 600);
            }
          }
        } else {
          console.log('else');
        }
      } catch (error) {
        console.error('Error en la primera solicitud:', error);
        console.log('error no inserta');
        throw error;
      } finally {
        // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
      }
    }

    if (e.target.matches('#marca') || e.target.matches('#marca *')) {
      var padre = e.target.parentElement.parentElement;
      var marca = padre.querySelector('#marca').value;
      if (marca == '') {
        $('#linea').html('');
        $('#id_vehiculo_marca').val('');
        $('#rndc_vehiculo_marca').val('');
      } else {
        let dato = new FormData();
        dato.append('marca', marca);
        try {
          const response = await fetch($('#id_url_ajax').val() + 'vehiculos/cambio_marca', {
            method: 'POST',
            body: dato,
            cache: 'no-cache',
          });
          const data = await response.json();
          if (data) {
            $('#id_vehiculo_marca').val(data[0].id_marca_pk);
            $('#rndc_vehiculo_marca').val(data[0].rndc_marca);
            data.forEach(function(element, index) {
              $('#linea').append('<option value="' + element.id_line + '">' + element.descripcion + '</option>');
            });
          } else {
            console.log('else');
          }
        } catch (error) {
          console.error('Error en la primera solicitud:', error);
          console.log('error no inserta');
          throw error;
        } finally {
          // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
        }
      }
    }

    if (e.target.matches('#fecha_poliza') || e.target.matches('#fecha_poliza *')) {
      // console.log('Hola desde la fecha de poliza');
      // Obtener la fecha actual
      var fechaActual = moment();
      // Convertir la fecha almacenada en el registro a un objeto Moment
      var fecha_vencimiento_poliza = moment(d.getElementById('fecha_poliza').value, 'YYYY-MM-DD');
      // Calcula la diferencia en días
      const diferenciaEnDias = fechaActual.diff(fecha_vencimiento_poliza, 'days');
      const diasRestantes = fecha_vencimiento_poliza.diff(fechaActual, 'days');
      if (fechaActual.isAfter(fecha_vencimiento_poliza)) {
        d.getElementById('Mensaje_vigencia').innerHTML = `
          <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
            <div class="icon"><span class="mdi mdi-alert-triangle"></span></div>
            <div class="message">
              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> La Póliza esta vencida hace <b>${diferenciaEnDias}</b> dias, por favor debe subir la actual de este mes.
            </div>
          </div>
        `;
      } else if (fechaActual.isBefore(fecha_vencimiento_poliza)) {
        // console.log('La póliza no está vencida.');
        d.getElementById('Mensaje_vigencia').innerHTML = `
        <div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><span class="mdi mdi-info-outline"></span></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> Faltan <b>${diasRestantes}</b> dias, para que la Póliza venza este mes.
          </div>
        </div>
      `;
      }
    }

    if (e.target.matches('#soat_vencimiento') || e.target.matches('#soat_vencimiento *')) {
      // console.log('Hola desde la fecha de poliza');
      // Obtener la fecha actual
      var fechaActual = moment();
      // Convertir la fecha almacenada en el registro a un objeto Moment
      var fecha_vencimiento_soat = moment(d.getElementById('soat_vencimiento').value, 'YYYY-MM-DD');
      // Calcula la diferencia en días
      const diferenciaEnDias = fechaActual.diff(fecha_vencimiento_soat, 'days');
      const diasRestantes = fecha_vencimiento_soat.diff(fechaActual, 'days');
      if (fechaActual.isAfter(fecha_vencimiento_soat)) {
        d.getElementById('Mensaje_vigencia').innerHTML = `
          <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
            <div class="icon"><span class="mdi mdi-alert-triangle"></span></div>
            <div class="message">
              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> El soat esta vencido hace <b>${diferenciaEnDias}</b> dias, por favor debe subir la actual de este mes.
            </div>
          </div>
        `;
      } else if (fechaActual.isBefore(fecha_vencimiento_soat)) {
        // console.log('La póliza no está vencida.');
        d.getElementById('Mensaje_vigencia').innerHTML = `
        <div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><span class="mdi mdi-info-outline"></span></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> Faltan <b>${diasRestantes}</b> dias, para que el soat venza este mes.
          </div>
        </div>
      `;
      }
    }

    let fecha_vencimiento_tecnomecanica;
    if (e.target.matches('#f_matricula') || e.target.matches('#f_matricula *')) {
      // Obtener la fecha actual
      var fechaActual = moment();
      // Convertir la fecha almacenada en el registro a un objeto Moment
      var fecha_matricula = moment(d.getElementById('f_matricula').value, 'YYYY-MM-DD');
      // Calcula la diferencia en días
      const dias_matricula = fechaActual.diff(fecha_matricula, 'days');
      fecha_vencimiento_tecnomecanica = d.getElementById(`fecha_vig_tecno`);
      if (dias_matricula >= 730) {
        // console.log('Tecnomecanica obligatoria');
        d.getElementById('etiqueta_Expedicion_tecno').innerHTML = `Fecha Ex.Tecnomecánica:&nbsp;<span style="color:red;"><i>(*)</i></span>`;
        d.getElementById('etiqueta_vencimiento_tecno').innerHTML = `Fecha V.Tecnomecánica:&nbsp;<span style="color:red;"><i>(*)</i></span>`;
        d.getElementById('etiqueta_documento_tecno').innerHTML = `Tecnomecánica (documento):&nbsp;<span style="color:red;"><i>(*)</i></span>`;
        $('.nexos_messages_popup').html(
          `<div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
            <div class="icon"><span class="mdi mdi-info-outline"></span></div>
            <div class="message">
              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> Datos de tecnomecanica obligatorios, Por favor diligenciarlos para crear el vehiculo.
            </div>
          </div>`,
        );
        $('.nexos-content').animate({scrollTop: 0}, 600);
        /* Validar si la tecnomecanica esta vencida */
        fecha_vencimiento_tecnomecanica.addEventListener('change', async e => {
          var fecha_vencimiento_tecno = moment(fecha_vencimiento_tecnomecanica.value, 'YYYY-MM-DD');
          const diferenciaEnDias = fechaActual.diff(fecha_vencimiento_tecno, 'days');
          const diasRestantes = fecha_vencimiento_tecno.diff(fechaActual, 'days');
          if (fechaActual.isAfter(fecha_vencimiento_tecno)) {
            d.getElementById('Mensaje_vigencia').innerHTML = `
              <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><span class="mdi mdi-alert-triangle"></span></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> La tecnomecanica vencio hace <b>${diferenciaEnDias}</b> dias, por favor debe diligenciar la actual.
                </div>
              </div>
            `;
          } else if (fechaActual.isBefore(fecha_vencimiento_soat)) {
            // console.log('La póliza no está vencida.');
            d.getElementById('Mensaje_vigencia').innerHTML = `
            <div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-info-outline"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> Faltan <b>${diasRestantes}</b> dias, para que la tecnomecanica venza este mes.
              </div>
            </div>
          `;
          }
        });
      } else {
        d.getElementById('etiqueta_Expedicion_tecno').innerHTML = `Fecha Ex.Tecnomecánica:`;
        d.getElementById('etiqueta_vencimiento_tecno').innerHTML = `Fecha V.Tecnomecánica:`;
        d.getElementById('etiqueta_documento_tecno').innerHTML = `Tecnomecánica (documento):`;
        // console.log('Tecnomecanica no obligatoria');
        $('.nexos_messages_popup').html(
          `<div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><span class="mdi mdi-info-outline"></span></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> Datos de tecnomecanica no requeridos para este vehiculo.
          </div>
        </div>`,
        );
        $('.nexos-content').animate({scrollTop: 0}, 600);
      }
    }

    //Validar tamaño del documento del preopeacional
    if (e.target.matches('#documento_preopeacional') || e.target.matches('#documento_preopeacional *')) {
      var fileInputs = document.getElementById('documento_preopeacional');
      var fileInput = document.getElementById('documento_preopeacional').files[0];
      // Lista de extensiones permitidas
      const extensionesPermitidas = ['pdf'];
      // Obtener el nombre del archivo del input
      const archivo = fileInputs.value;
      // var archivos = licencia_conductor.files[0];
      // Obtener la extensión del archivo
      const extension = archivo.split('.').pop().toLowerCase(); // Obtiene la última parte después del punto y la convierte a minúscula
      // Verificar si la extensión está en la lista de permitidas
      if (extensionesPermitidas.includes(extension)) {
        // Verifica el tamaño del archivo (en este caso, máximo 1MB)
        var maxSize = 1 * 1024 * 1024; // 1MB en bytes
        if (fileInput.size > maxSize) {
          Swal.fire({
            title: 'Advertencia!',
            text: 'El archivo no debe superar el tamaño de 1MB.',
            icon: 'warning',
            customClass: {
              popup: 'swal2-custom-font',
            },
          });

          // msg_error += '<p> El archivo <strong>Preoperacional</strong> no debe superar el tamaño de 1MB.</p>';
          $('#name_preoperacional').val('');
          fileInputs.value = '';
        } else {
          // $('#documentos + p').remove();
          fic = archivo.split('\\');
          if (fic == '' || fic == null) {
            $('#name_preoperacional').val('');
          } else {
            $('#name_preoperacional').val(fic[fic.length - 1]);
          }
        }
        return true;
      } else {
        Swal.fire({
          title: 'Advertencia!',
          text: 'Extensión no permitida: ' + extension,
          icon: 'warning',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
        fileInputs.value = ''; // Vaciar el campo para evitar cargar el archivo
        document.getElementById('name_preoperacional').value = ''; // Vaciar el campo para evitar cargar el archivo
        return false;
      }
    }

    if (e.target.matches('#fecha_expedicion_preoperacional') || e.target.matches('#fecha_expedicion_preoperacional *')) {
      var fecha_expedicion = document.getElementById('fecha_expedicion_preoperacional').value;
      var momentExpedicion = moment(fecha_expedicion, 'YYYY-MM-DD');

      // Calcular la fecha de vencimiento sumando 6 meses a la fecha de expedición
      var momentVencimiento = momentExpedicion.clone().add(6, 'months');

      // Verificar que la diferencia en días sea exactamente 180 días
      // var diferenciaDias = momentVencimiento.diff(momentExpedicion, 'days');
      document.getElementById('fecha_vencimiento_preoperacional').value = momentVencimiento.format('YYYY-MM-DD');
      // document.getElementById('vigencia_prepoeracional').value = diferenciaDias;
    }
  });

  d.addEventListener('click', async e => {
    if (e.target.matches('#btn_seleccionar_color') || e.target.matches('#btn_seleccionar_color *')) {
      var padre = e.target.parentElement.parentElement;
      var Procesos = padre.querySelector('#btn_seleccionar_color');
      var color_id = Procesos.getAttribute('data-id');
      var rncd_id = Procesos.getAttribute('data-rncd');
      var color = Procesos.getAttribute('data-color');
      d.getElementById('id_vehiculo_color').value = color_id;
      d.getElementById('rndc_vehiculo_color').value = rncd_id;
      d.getElementById('color_tabla').value = color;
      d.getElementById('color').value = color_id;
      $('#md-fullWidth').modal('toggle');
      buscar.value = '';
      listar_colores();
    }

    if (e.target.matches('#btn_reload_marcas') || e.target.matches('#btn_reload_marcas *')) {
      listar_marcar();
    } else if (e.target.matches('#btn_reload_trailers') || e.target.matches('#btn_reload_trailers *')) {
      // alert('trailer');
      console.log('Hola trailer');
    } else if (e.target.matches('#btn_reload_gps') || e.target.matches('#btn_reload_gps *')) {
      cargarempgps();
    }

    if (e.target.matches('#btn_agregar_vehiculo') || e.target.matches('#btn_agregar_vehiculo *')) {
      Swal.fire({
        title: 'Mensaje',
        text: '¿Está seguro de continuar con este vehículo?',
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
          // Código a ejecutar si el usuario hace clic en "Aceptar"
          $('#repotenciado').prop('disabled', true);
          $('.nexos_messages_popup').html('');
          var msg_error = '';
          var msg_error2 = '';

          // Se hacen las validaciones del formulario de creación del vehículo
          if (!$('#placa').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el Vehículo.</p>';
          } else {
            if ($('#placa').val().length != 6) {
              msg_error += '<p>El campo placa debe tener 6 caracteres, 3 letras y 3 números para poder crear el Vehículo.</p>';
            }
          }
          if (!$('#color').val() && !$('#id_vehiculo_color').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Color</strong> para poder crear el Vehículo.</p>';
          }
          if (!$('#marca').val() && !$('#id_vehiculo_marca').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Marca</strong> para poder crear el Vehículo.</p>';
          }
          if (!$('#linea').val() && !$('#id_vehiculo_linea').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Línea</strong> para poder crear el Vehículo.</p>';
          }
          if (!$('#modelo').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Modelo</strong> para poder crear el Vehículo.</p>';
          } else {
            if ($('#modelo').val().length != 4) {
              msg_error += '<p>El campo <strong>Modelo</strong>debe tener 4 dígitos para poder crear el Vehículo.</p>';
            }
          }
          if (!$('#peso_vacio').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Peso Vacío</strong> para poder crear el Vehículo.</p>';
          } else {
            if ($('#peso_vacio').val().length < 1 || $('#peso_vacio').val().length > 5) {
              msg_error += '<p>El campo <strong>Peso Vacío</strong> debe ser mínimo 1 máximo 5 dígitos para poder crear el Vehículo.</p>';
            }
          }
          if (!$('#numero_poliza').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Número SOAT</strong> para poder crear el Vehículo.</p>';
          } else {
            if ($('#numero_poliza').val().length > 20) {
              msg_error += '<p>El campo <strong>Número SOAT</strong>debe tener máximo 20 caracteres para poder crear el Vehículo.</p>';
            }
          }
          if ($('#numero_polizaRC').val()) {
            if ($('#numero_polizaRC').val().length < 11 || $('#numero_polizaRC').val().length > 30) {
              msg_error += '<p>El campo <strong>Póliza Responsabilidad Civil</strong> debe tener mínimo 11 ó máximo 30 caracteres para poder crear el Vehículo.</p>';
            }
          }
          if (!$('#soat_vencimiento').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Vencimiento SOAT</strong> para poder crear el Vehículo.</p>';
          } else {
            fecha = $('#soat_vencimiento').val();
            var fhoy = moment();
            var horahoy = moment().format('HH:mm:ss');
            var tf = fhoy.diff(fecha, 'days');
            if (tf > 0) {
              msg_error += '<p>Debe ingresar <strong>Fecha Soat </strong> vigente para poder crear el Vehículo.</p>';
            }
          }

          if (!$('#aseguradora').val() && !$('#id_vehiculo_aseguradora').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Aseguradora</strong> para poder crear el Vehículo.</p>';
          }
          if (!$('#web_satelital').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Web satelital</strong> para poder crear el Vehículo.</p>';
          }
          if (!$('#usuario_satelital').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Usuario satelital</strong> para poder crear el Vehículo.</p>';
          } else {
            if ($('#usuario_satelital').val().length > 80) {
              msg_error += '<p>El campo <strong>Usuario satelital</strong> debe tener máximo 30 caracteres para poder crear el Vehículo.</p>';
            }
          }
          if (!$('#clave_satelital').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Clave satelital</strong> para poder crear el Vehículo.</p>';
          } else {
            if ($('#clave_satelital').val().length > 80) {
              msg_error += '<p>El campo <strong>Clave satelital</strong> debe tener máximo 30 caracteres para poder crear el Vehículo.</p>';
            }
          }
          if (!$('#num_motor').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Número motor</strong> para poder crear el Vehículo.</p>';
          } else {
            if ($('#num_motor').val().length < 6 || $('#num_motor').val().length > 40) {
              msg_error += '<p>El campo <strong>Número motor</strong> debe tener máximo 40 y mínimo 6 caracteres para poder crear el Vehículo.</p>';
            }
          }
          if (!$('#num_chasis').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Número chasis</strong> para poder crear el Vehículo.</p>';
          } else {
            if ($('#num_chasis').val().length < 6 || $('#num_chasis').val().length > 40) {
              msg_error += '<p>El campo <strong>Número chasis</strong> debe tener máximo 40 y mínimo 6 caracteres para poder crear el Vehículo.</p>';
            }
          }
          if (!$('#tipovinculacion').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Tipo de vinculación</strong> para poder crear el Vehículo.</p>';
          }
          if (!$('#capacidad_tn').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Capacidad de carga(Kg)</strong> para poder crear el Vehículo.</p>';
          } else {
            if ($('#capacidad_tn').val().length > 5) {
              msg_error += '<p>El campo <strong>Capacidad de carga(Kg)</strong> debe tener 5 dígitos máximo para poder crear el Vehículo.</p>';
            }
          }
          if (!$('#peso_bruto').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Peso Bruto (Kg)</strong> para poder crear el Vehículo.</p>';
          }

          if (!$('#clase_v').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Clase de Vehículo</strong> para poder crear el Vehículo.</p>';
          }

          if (!$('#repotencia').val()) {
            msg_error += '<p>Por favor seleccione una opción del campo <strong> Repotenciar </strong> para poder crear el Vehículo.</p>';
          }

          if ($('#repotencia').val() == 1) {
            if (!$('#repotenciado').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>repotenciado a:</strong> para poder crear el Vehículo.</p>';
            }
          }
          if ($('#repotencia').val() == 0) {
            $('#repotenciado').val('');
          }

          if (!$('#f_matricula').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Fecha de matrícula</strong> para poder crear el Vehículo.</p>';
          }

          if ($('#cant_viaje').val() === '') {
            msg_error += '<p>Debe diligenciar el campo <strong>Cant. viajes</strong> para poder crear el Vehículo.</p>';
          }

          //validar tecnomecanica segun fecha de matricula
          if ($('#f_matricula').val()) {
            var matri = $('#f_matricula').val();
            var fhoy = moment();
            var tf = fhoy.diff(matri, 'days');
            if (tf >= 730) {
              //es obligatorio subir archivo y tecnomecanica
              if (!$('#foto_tecno').val()) {
                msg_error += '<p>Debe ingresar <strong>Archivo Tecnomecánica</strong> para poder crear el Vehículo, ya que la fecha de matrícula es mayor a dos años días(' + tf + ').</p>';
              }
              if (!$('#tecnomecanica').val()) {
                msg_error += '<p>Debe diligenciar el campo <strong>Tecnomecánica</strong> para poder crear el Vehículo días(' + tf + ').</p>';
              } else {
                if ($('#tecnomecanica').val().length < 2 || $('#tecnomecanica').val().length > 20) {
                  msg_error += '<p>El campo <strong>CaTecnomecanica </strong> debe tener 20 dígitos máximo para poder crear el Vehículo</p>';
                }
              }
            } else {
              if ($('#tecnomecanica').val()) {
                if ($('#tecnomecanica').val().length < 2 || $('#tecnomecanica').val().length > 20) {
                  msg_error += '<p>El campo <strong>CaTecnomecanica </strong> debe tener 20 dígitos máximo para poder crear el Vehículo</p>';
                }
              }
            }
          }
          if (!$('#cedula_propietario').val() && !$('#id_propietario').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Documento Propietario</strong> para poder crear el VehículoS1.</p>';
          }
          if (!$('#cedula_tenedor').val() && !$('#id_tenedor').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Documento Tenedor</strong> para poder crear el Vehículo.</p>';
          }
          if (!$('#cedula_conductor').val() && !$('#id_conductor').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Documento Conductor</strong> para poder crear el Vehículo.</p>';
          }
          if (!$('#id_propietario').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Propietario en Datos Específicos</strong> para poder crear el Vehículo.</p>';
          }
          if (!$('#id_tenedor').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Poseedor en Datos Específicos</strong> para poder crear el Vehículo.</p>';
          }
          if (!$('#id_conductor').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Conductor en Datos Específicos</strong> para poder crear el Vehículo.</p>';
          }

          if (!$('#configuracion').val() && !$('#id_vehiculo_configuracion').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Configuración completa</strong> para poder crear el Vehículo.</p>';
          } else {
            if (
              $('#configuracion').val() != 2 ||
              $('#configuracion').val() != 3 ||
              $('#configuracion').val() != 4 ||
              $('#configuracion').val() != 'CA' ||
              $('#configuracion').val() != 'V2' ||
              $('#configuracion').val() != 'V3' ||
              $('#configuracion').val() != 'V4'
            ) {
              if (!$('#trailers').val()) {
                msg_error += '<p>Debe diligenciar el campo <strong>Trailer</strong> para poder crear el Vehículo.</p>';
              }
            }
          }
          if ($('#peso_vacio').val() == 0) {
            msg_error += '<p>El campo <strong>Peso Vacío (Kg) </strong> debe ser mayor a cero(0), para poder crear el Vehículo.</p>';
          }
          if ($('#capacidad_tn').val() == 0) {
            msg_error += '<p>El campo <strong>Capacidad carga(Kg) </strong> debe ser mayor a cero(0), para poder crear el Vehículo.</p>';
          }
          if ($('#peso_bruto').val() == 0) {
            msg_error += '<p>El campo <strong>Peso Bruto (Kg) </strong> debe ser mayor a cero(0), para poder crear el Vehículo.</p>';
          }
          if ($('#fecha_vig_tecno').val()) {
            var fhoy = moment().format('YYYY-MM-DD');
            if ($('#fecha_vig_tecno').val() <= fhoy) {
              msg_error += '<p>El campo <strong>Fecha Vencimiento de Tecnomecánica </strong> debe ser mayor a la fecha actual, para poder crear el Vehículo.</p>';
            }
          }
          if ($('#fecha_tecno').val()) {
            var fhoy = moment().format('YYYY/MM/DD');
            if ($('#fecha_tecno').val() > fhoy) {
              fecha = $('#fecha_tecno').val();
              var fhoy = moment();
              var horahoy = moment().format('HH:mm:ss');
              var tf = fhoy.diff(fecha, 'days');
              if (tf > 0) {
                msg_error += '<p>Debe ingresar <strong>Fecha Vencimiento de la tecnomecánica </strong> vigente para poder crear el Vehículo.</p>';
              }
            }
          }
          if (!$('#empresa_satelital').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Empresa Satelital</strong> para poder crear el Vehículo.</p>';
          }

          if ($('#lice_transito').val()) {
            if ($('#lice_transito').val().length < 6 || $('#lice_transito').val().length > 30) {
              msg_error += '<p>El campo <strong>Licencia Tránsito</strong> debe tener mínimo 6 ó máximo 30 caracteres para poder crear el Vehículo.</p>';
            }
          } else if ($('#lice_transito').val() === '') {
            msg_error += '<p>El campo <strong>Licencia Tránsito</strong> es obligatrio para poder crear el Vehículo.</p>';
          }

          if (!$('#foto_transi').val()) {
            msg_error += '<p>Debe subir el documento de la <strong>Licencia Tránsito</strong> para poder crear el Vehículo.</p>';
          }

          // if (!$("#foto_tecno").val()) {
          // 	msg_error += "<p>Debe subir el documento de la <strong>Tecnomecánica</strong> para poder crear el Vehículo.</p>";
          // }

          if (!$('#foto_vehiculo').val()) {
            msg_error += '<p>Debe subir la  <strong>foto frontal</strong> para poder crear el Vehículo.</p>';
          }
          if (!$('#foto_vehiculod').val()) {
            msg_error += '<p>Debe subir la  <strong>foto derecha</strong> para poder crear el Vehículo.</p>';
          }
          if (!$('#foto_vehiculoi').val()) {
            msg_error += '<p>Debe subir la  <strong>foto Izquierda</strong> para poder crear el Vehículo.</p>';
          }
          if (!$('#foto_vehiculoa').val()) {
            msg_error += '<p>Debe subir la  <strong>foto de la parte de atras</strong> para poder crear el Vehículo.</p>';
          }

          if (!$('#tipo_carroceria').val()) {
            msg_error += '<p>Debe seleccionar el <strong>Tipo  de Carroceria</strong> para poder crear el Vehículo.</p>';
          }

          /**
           *  Validacion de las fecahs del preoperacioneal 
           **/

          // var fecha_expedicion = document.getElementById('fecha_expedicion_preoperacional').value;
          // var fecha_vencimiento = document.getElementById('fecha_vencimiento_preoperacional').value;

          // if (fecha_expedicion > fecha_vencimiento) {
          //   msg_error += '<p>La fecha de <strong>Expedición</strong> no puede ser mayor a la fecha de <strong>Vencimiento</strong> del preoperacional.</p>';
          // } else if (fecha_expedicion === '' || fecha_vencimiento === '') {
          //   msg_error += '<p>Debe diligenciar las fechas de <strong>Expedición y Vencimiento</strong> del preoperacional.</p>';
          // }

          var fecha_expedicion = document.getElementById('fecha_expedicion_preoperacional').value;
          var fecha_vencimiento = document.getElementById('fecha_vencimiento_preoperacional').value;
          if (fecha_expedicion === '' || fecha_vencimiento === '') {
            msg_error += '<p>Debe diligenciar las fechas de <strong>Expedición y Vencimiento</strong> del preoperacional.</p>';
          } else {
            var momentExpedicion = moment(fecha_expedicion, 'YYYY-MM-DD');
            var momentVencimiento = moment(fecha_vencimiento, 'YYYY-MM-DD');
            if (momentExpedicion.isAfter(momentVencimiento)) {
              msg_error += '<p>La fecha de <strong>Expedición</strong> no puede ser mayor a la fecha de <strong>Vencimiento</strong> del preoperacional.</p>';
            }
          }

          // Validacion del documento del preoperacional
          // var fileInputs = document.getElementById('documento_preopeacional');
          var fileInput = document.getElementById('documento_preopeacional').files[0];
          // Verifica si se ha seleccionado un archivo
          if (!fileInput) {
            msg_error += '<p>Documento <strong>Preoperacional</strong> obligatorio.</p>';
          }

          if (!msg_error) {
            crearVehiculo();
          } else {
            Swal.fire({
              // position: 'top-end',
              position: 'center',
              icon: 'warning',
              title: 'Advertencia!',
              html: msg_error,
              showConfirmButton: true,
              scrollbarPadding: false,
              customClass: {
                popup: 'swal2-custom-font',
              },
              // timer: 1500,
            });
            $('.nexos-content').animate({scrollTop: 0}, 800);
          }
        }
      });
    }

    if (e.target.matches('#btn_seleccionar_propietario') || e.target.matches('#btn_seleccionar_propietario *')) {
      // console.log('Propietario');
      var padre = e.target.parentElement.parentElement;
      var Procesos = padre.querySelector('#btn_seleccionar_propietario');
      var propietario_id = Procesos.getAttribute('data-id');
      var nombre_propietario = Procesos.getAttribute('data-nombre_propietario');
      d.getElementById('id_propietario').value = propietario_id;
      d.getElementById('propietario_tabla').value = nombre_propietario;
      $('#md-propietarios').modal('toggle');
      buscar_propietario.value = '';
      Listar_propietario();
    }

    if (e.target.matches('#btn_seleccionar_poseedor') || e.target.matches('#btn_seleccionar_poseedor *')) {
      // console.log('Propietario');
      var padre = e.target.parentElement.parentElement;
      var Procesos = padre.querySelector('#btn_seleccionar_poseedor');
      var poseedor_id = Procesos.getAttribute('data-id');
      var nombre_poseedor = Procesos.getAttribute('data-nombre_poseedor');
      d.getElementById('id_tenedor').value = poseedor_id;
      d.getElementById('poseedor_tabla').value = nombre_poseedor;
      $('#md-poseedor').modal('toggle');
      buscar_poseedor.value = '';
      Listar_poseedor();
    }

    if (e.target.matches('#btn_seleccionar_conductor') || e.target.matches('#btn_seleccionar_conductor *')) {
      // console.log('Propietario');
      var padre = e.target.parentElement.parentElement;
      var Procesos = padre.querySelector('#btn_seleccionar_conductor');
      var conductor_id = Procesos.getAttribute('data-id');
      var nombre_conductor = Procesos.getAttribute('data-nombre_conductor');
      d.getElementById('id_conductor').value = conductor_id;
      d.getElementById('conductor_tabla').value = nombre_conductor;
      $('#md-conductor').modal('toggle');
      buscar_poseedor.value = '';
      Listar_conductor();
    }

    if (e.target.matches('#validar_token') || e.target.matches('#validar_token *')) {
      // console.log('Bonton de validar');
      if ($('#placa_val').val() === '' && $('#token_val').val() == '' && $('#num_prefiltro').val() == '') {
        $('.menssage_validar_token').html(`
      		<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
      				<div class="icon"><span class="mdi mdi-info-outline"></span></div>
      				<div class="message">
      					<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
      						<strong>Mensaje!</strong> Debe ingresar el numero de prefiltro, codigo de seguridad y la placa para completar el proceso de hoja de vida del vehiculo.
      				</div>
      		</div>`);
      } else if ($('#placa_val').val() === '') {
        $('.menssage_validar_token').html(`
      		<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
      				<div class="icon"><span class="mdi mdi-info-outline"></span></div>
      				<div class="message">
      					<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
      						<strong>Mensaje!</strong> Debe ingresar la placa para completar el proceso de hoja de vida del vehiculo.
      				</div>
      		</div>`);
      } else if ($('#token_val').val() == '') {
        $('.menssage_validar_token').html(`
      		<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
      				<div class="icon"><span class="mdi mdi-info-outline"></span></div>
      				<div class="message">
      					<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
      						<strong>Mensaje!</strong> Debe ingresar el codigo de seguridad para completar el proceso de hoja de vida del vehiculo.
      				</div>
      		</div>`);
      } else if ($('#num_prefiltro').val() == '') {
        $('.menssage_validar_token').html(`
      		<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
      				<div class="icon"><span class="mdi mdi-info-outline"></span></div>
      				<div class="message">
      					<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
      						<strong>Mensaje!</strong> Debe ingresar el numero de prefiltro  para completar el proceso de hoja de vida del vehiculo.
      				</div>
      		</div>`);
      } else {
        let data = new FormData();
        data.append('placa', $('#placa_val').val());
        data.append('token', $('#token_val').val());
        data.append('prefiltro', $('#num_prefiltro').val());
        // alert($("#placa_val").val() + "  " + $("#token_val").val());
        var url = $('#id_url_ajax').val() + 'vehiculos/validar_token_placa';
        $.ajax({
          url: url,
          type: 'POST',
          data: data,
          cache: false,
          processData: false, // Don't process the files
          contentType: false, // Set content type to false as jQuery will tell the server its a query string request
          dataType: 'json',
          success: function(data, textStatus, jqXHR) {
            let mensaje = '';
            if (data.numero === 400) {
              mensaje = `
      					<div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
      							<div class="icon"><span class="mdi mdi-info-outline"></span></div>
      							<div class="message">
      								<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
      								<strong>Mensaje!</strong> ${data.mensaje}
      							</div>
      					</div>`;
              $('.validar_token_form').show();
              $('#form_create').hide();
              $('#acciones').hide();
            } else if (data.numero === 200) {
              mensaje = `
      					<div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
      							<div class="icon"><span class="mdi mdi-check"></span></div>
      							<div class="message">
      								<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
      								<strong>Mensaje!</strong> ${data.mensaje}
      							</div>
      					</div>`;
              $('#validar_token_form').hide();
              $('#form_create').show();
              $('#acciones').show();

              var placaElement = d.getElementById('placa');
              var placaValue = $('#placa_val').val();
              placaElement.value = placaValue;
              placaElement.value = placaElement.value.trim();
              placaElement.disabled = true;
              /* Funcio para cargar de formad direccta los proveedores del vehiculo */
              cargar_proveedores_vehiculos(placaValue);
            } else {
              mensaje = `
      					<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
      							<div class="icon"><span class="mdi mdi-info-outline"></span></div>
      							<div class="message">
      								<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
      								<strong>Mensaje!</strong> Este vehículo con placa <strong>Texto</strong> no se encuentra creado en el sistema, solicitar prefiltro para su creación.
      							</div>
      					</div>`;
            }
            $('.menssage_validar_token').html(mensaje);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('error no inserta');
            $('#crea_vehiculos').css('display', 'none');
            $('.menssage_validar_token').html(
              '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Ha ocurrrido un error ' +
                jqXHR.responseText +
                '.</div></div>',
            );
            /*$("html, body").animate({ scrollTop: 0 }, 600);
      			setTimeout(function() { location.reload(false);  }, 800);*/
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
      }
    }

    /* Funcion para cerrar la venta y volver al tablero principal */
    if (e.target.matches('#btn-cerrar-mensajes') || e.target.matches('#btn-cerrar-mensajes *')) {
      sessionStorage.clear();
      window.location = `${$('#id_url_ajax').val()}solicitudes/vehiculos/${valores}`;
    }

    if (e.target.matches('#cancelar_operacion') || e.target.matches('#cancelar_operacion *')) {
      Swal.fire({
        title: 'Mensaje',
        text: '¿Está seguro de cancelar el registro del vehículo?',
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
          sessionStorage.clear();
          window.location = `${$('#id_url_ajax').val()}solicitudes/vehiculos/${valores}`;
        }
      });
    }

    if (e.target.matches('#btn_cancelar_registro') || e.target.matches('#btn_cancelar_registro *')) {
      Swal.fire({
        title: 'Mensaje',
        text: '¿Está seguro de cancelar el registro del vehículo?',
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
          sessionStorage.clear();
          window.location = `${$('#id_url_ajax').val()}solicitudes/vehiculos/${valores}`;
        }
      });
    }
  });

  $('#empresa_satelital').change(function() {
    var url = $(this).find(':selected').data('id2');
    $('#web_satelital').val(url);
  });

  $('#repotencia').change(function() {
    var r = $('#repotencia').val();
    if (r == '0') {
      $('#repotenciado').prop('disabled', true);
      document.getElementById('campo_repotenciado').style.display = 'none';
    } else {
      $('#repotenciado').prop('disabled', false);
      document.getElementById('campo_repotenciado').style.display = 'block';
    }
  });

  $('#pasar_aseguradora').click(function() {
    if ($('#aseguradora').val() === '') {
      $('.mesanje_error').html(`
			<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
							<strong>Mensaje!</strong> Debe diligenciar una aseguradora para crear el vehiculo.
					</div>
			</div>`);
    } else {
      $('#aseguradora_tabla').val($('#aseguradora').val());
      $('#Modal_aseguradora').modal('toggle');
    }
  });

  $('#capacidad_tn').change(function() {
    var peso = $('#peso_vacio').val();
    var capacidad = $('#capacidad_tn').val();
    var suma = parseFloat(peso) + parseFloat(capacidad);
    res = suma.toFixed(2);
    $('#peso_bruto').val(suma);
  });

  $('#peso_vacio').change(function() {
    var peso = $('#peso_vacio').val();
    var capacidad = $('#capacidad_tn').val();
    var suma = parseFloat(peso) + parseFloat(capacidad);
    res = suma.toFixed(2);
    $('#peso_bruto').val(suma);
  });
});

async function listar_colores() {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'vehiculos/tipo_color', {
      method: 'POST',
      // body: formdata,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tbl_colores');
      tbody.innerHTML = '';
      data.forEach(element => {
        const fila = document.createElement('tr');
        const columnaNumdoc = document.createElement('td');
        columnaNumdoc.textContent = element.id;
        columnaNumdoc.style.textAlign = 'center';

        const columnaColor = document.createElement('td');
        columnaColor.textContent = element.color;
        const columnaEstado = document.createElement('td');
        if (element.estado === '1') {
          columnaEstado.innerHTML = `<span class="label label-success">Activo</span>`;
          columnaEstado.style.textAlign = 'center';
        } else {
          columnaEstado.innerHTML = `<span class="label label-danger">Inactivo</span>`;
          columnaEstado.style.textAlign = 'center';
        }
        const columnaAccion = document.createElement('td');
        columnaAccion.innerHTML = `<button class="btn text-success btn-xs" id="btn_seleccionar_color" data-id="${element.id}" data-rncd="${element.rndc_id}" data-color="${element.color}"><i class="far fa-plus-square"></i> Agregar</button>`;
        // columnaAccion.style.margin = 'auto';
        columnaAccion.style.textAlign = 'center';

        fila.appendChild(columnaNumdoc);
        fila.appendChild(columnaColor);
        fila.appendChild(columnaEstado);
        fila.appendChild(columnaAccion);
        tbody.appendChild(fila);
      });
    } else {
      console.log('else');
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
    // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}

/* Listar Propietario */
async function Listar_propietario() {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'vehiculos/Listar_propietario', {
      method: 'POST',
      // body: formdata,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tbl_propietarios');
      tbody.innerHTML = '';
      data.forEach(element => {
        const fila = document.createElement('tr');

        const columnaNumdoc = document.createElement('td');
        columnaNumdoc.textContent = element.numdoc_nexos;
        columnaNumdoc.style.textAlign = 'center';

        const columnaDocumento = document.createElement('td');
        columnaDocumento.textContent = element.numero_documento;

        const columnaNombre = document.createElement('td');
        // columnaNombre.textContent = element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2;
        columnaNombre.textContent = element.nombre.trim() + ' ' + element.apellido1 + ' ' + element.apellido2;
        // columnaNombre.style.textAlign = 'center';

        const columnaDireccion = document.createElement('td');
        columnaDireccion.textContent = element.direccion;

        const columnaCelular = document.createElement('td');
        columnaCelular.textContent = element.celular;

        const columnaAccion = document.createElement('td');
        let nombre_completo = element.nombre.trim() + ' ' + element.apellido1 + ' ' + element.apellido2;
        columnaAccion.innerHTML = `<button class="btn btn-success btn-xs" id="btn_seleccionar_propietario" data-id="${element.numdoc_nexos}" data-nombre_propietario="${nombre_completo}"><i class="far fa-plus-square"></i> Agregar</button>`;
        // columnaAccion.style.margin = 'auto';
        columnaAccion.style.textAlign = 'center';

        fila.appendChild(columnaNumdoc);
        fila.appendChild(columnaDocumento);
        fila.appendChild(columnaNombre);
        fila.appendChild(columnaDireccion);
        fila.appendChild(columnaCelular);
        fila.appendChild(columnaAccion);
        tbody.appendChild(fila);
      });
    } else {
      console.log('else');
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
    // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}

/* Listar Poseedor */
async function Listar_poseedor() {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'vehiculos/Listar_poseedor', {
      method: 'POST',
      // body: formdata,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tbl_poseedor');
      tbody.innerHTML = '';
      data.forEach(element => {
        const fila = document.createElement('tr');

        const columnaNumdoc = document.createElement('td');
        columnaNumdoc.textContent = element.numdoc_nexos;
        columnaNumdoc.style.textAlign = 'center';

        const columnaDocumento = document.createElement('td');
        columnaDocumento.textContent = element.numero_documento;

        const columnaNombre = document.createElement('td');
        columnaNombre.textContent = element.nombre.trim() + ' ' + element.apellido1 + ' ' + element.apellido2;
        // columnaNombre.style.textAlign = 'center';

        const columnaDireccion = document.createElement('td');
        columnaDireccion.textContent = element.direccion;

        const columnaCelular = document.createElement('td');
        columnaCelular.textContent = element.celular;

        const columnaAccion = document.createElement('td');
        let nombre_completo = element.nombre.trim() + ' ' + element.apellido1 + ' ' + element.apellido2;
        columnaAccion.innerHTML = `<button class="btn btn-success btn-xs" id="btn_seleccionar_poseedor" data-id="${element.numdoc_nexos}" data-nombre_propietario="${nombre_completo}"><i class="far fa-plus-square"></i> Agregar</button>`;
        // columnaAccion.style.margin = 'auto';
        columnaAccion.style.textAlign = 'center';

        fila.appendChild(columnaNumdoc);
        fila.appendChild(columnaDocumento);
        fila.appendChild(columnaNombre);
        fila.appendChild(columnaDireccion);
        fila.appendChild(columnaCelular);
        fila.appendChild(columnaAccion);
        tbody.appendChild(fila);
      });
    } else {
      console.log('else');
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
    // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}

/* Listar Poseedor */
async function Listar_conductor() {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'vehiculos/Listar_conductor', {
      method: 'POST',
      // body: formdata,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tbl_conductor');
      tbody.innerHTML = '';
      data.forEach(element => {
        const fila = document.createElement('tr');

        const columnaNumdoc = document.createElement('td');
        columnaNumdoc.textContent = element.numdoc_nexos;
        columnaNumdoc.style.textAlign = 'center';

        const columnaDocumento = document.createElement('td');
        columnaDocumento.textContent = element.numero_documento;

        const columnaNombre = document.createElement('td');
        columnaNombre.textContent = element.nombre.trim() + ' ' + element.apellido1 + ' ' + element.apellido2;

        const columnaDireccion = document.createElement('td');
        columnaDireccion.textContent = element.direccion;

        const columnaCelular = document.createElement('td');
        columnaCelular.textContent = element.celular;

        const columnaAccion = document.createElement('td');
        let nombre_completo = element.nombre.trim() + ' ' + element.apellido1 + ' ' + element.apellido2;
        columnaAccion.innerHTML = `<button class="btn btn-success btn-xs" id="btn_seleccionar_conductor" data-id="${element.numdoc_nexos}" data-nombre_conductor="${nombre_completo}"><i class="far fa-plus-square"></i> Agregar</button>`;
        // columnaAccion.style.margin = 'auto';
        columnaAccion.style.textAlign = 'center';

        fila.appendChild(columnaNumdoc);
        fila.appendChild(columnaDocumento);
        fila.appendChild(columnaNombre);
        fila.appendChild(columnaDireccion);
        fila.appendChild(columnaCelular);
        fila.appendChild(columnaAccion);
        tbody.appendChild(fila);
      });
    } else {
      console.log('else');
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
    // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}

async function listar_marcar() {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'vehiculos/tipo_marca', {
      method: 'POST',
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      data.forEach(function(element, index) {
        $('#marca').append('<option value="' + element.id + '">' + element.marca + '</option>');
      });
    } else {
      console.log('else');
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
    // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}

async function listar_configuracion() {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'vehiculos/config_cabezote', {
      method: 'POST',
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      data.forEach(function(element, index) {
        $('#configuracion').append('<option value="' + element.nombre + '" data-id="' + element.nombre + '">' + element.nombre + ' - ' + element.descripcion + '</option>');
      });
    } else {
      console.log('else');
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
    // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}

async function Listar_clases_vehiculos() {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'vehiculos/listar_clase', {
      method: 'POST',
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      data.forEach(function(element, index) {
        $('#clase_v').append('<option value="' + element.id + '">' + element.clase + '</option>');
      });
    } else {
      console.log('else');
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
    // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}

function configu() {
  $('#rndc_vehiculo_configuracion').val('');
  $('#id_vehiculo_configuracion').val('');
  var c = $('#configuracion').val();
  var rndc_id = {
    id: c,
    // action: 'traer_crndc_configuracion',
  };
  $.ajax({
    url: $('#id_url_ajax').val() + 'vehiculos/traer_crndc_configuracion',
    // url: 'http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php', traer_crndc_configuracion
    type: 'POST',
    data: rndc_id,
    dataType: 'json',
    success: function(data) {
      console.log('trajo configuracion ' + data.rndc_id);
      if (data) {
        $('#rndc_vehiculo_configuracion').val(data.rndc_id);
        $('#id_vehiculo_configuracion').val(data.id);
        $('#rndc_sigla').val(data.nombre);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no trajo configuracion');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function cargartipocarrocen() {
  $.ajax({
    // url: 'http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php',
    url: $('#id_url_ajax').val() + 'vehiculos/traer_carroceria',
    type: 'POST',
    // data: carro,
    dataType: 'json',
    success: function(data) {
      data.forEach(function(element, index) {
        $('#tipo_carroceria').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no trajo tipo carroceria');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function cargarempgps() {
  $('#web_satelital').val('');
  $.ajax({
    // url: 'http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php',
    url: $('#id_url_ajax').val() + 'vehiculos/traer_empresa_gps',
    type: 'POST',
    // data: dato_gps,
    dataType: 'json',
    success: function(data) {
      if (data) {
        $('#empresa_satelital').html('<option value="">Seleccionar</option>');
        data.forEach(function(element, index) {
          $('#empresa_satelital').append('<option value="' + element.id + '" data-id2="' + element.url + '">' + element.operador_gps + '</option>');
        });
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      //console.log('no trajo configuracion cabezote');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

var url = $('#id_url_ajax').val() + 'libs/vehiculos_ajax.php';
function rndcCargarVehiculoAseguradora() {
  // console.log("Entro en funcion rndcCargarVehiculoAseguradora");
  $('#id_vehiculo_aseguradora').val('');
  $('#rndc_vehiculo_aseguradora').val('');
  var params = {
    accion: 'rndc_cargaraseguradora',
  };
  aseguradora = [];
  $.ajaxSetup({async: false});
  $.post(
    url,
    params,
    function(data) {
      // console.log(data);
      if (data.success) {
        for (let x = 0; x < data.content.length; x++) {
          aseguradora.push(data.content[x]['nombre']);
        }
        $('#caja_aseguradora .typeahead').typeahead(
          {
            minLength: 1,
          },
          {
            name: 'states',
            source: substringMatcher(aseguradora),
          },
        );
        $.ajaxSetup({async: false});
        $('#caja_aseguradora').bind('typeahead:selected', function(obj, datum, name) {
          var params = {
            accion: 'rndc_obtenerdatosaseguradora',
            nombre: datum.split(' - ')[0],
          };
          $.post(
            url,
            params,
            function(data) {
              // console.log(data);
              if (data.success) {
                $('#id_vehiculo_aseguradora').val(data.content[0]['id']);
                $('#rndc_vehiculo_aseguradora').val(data.content[0]['rndc_id']);
              } else {
                $('#id_vehiculo_aseguradora').val('');
                $('#rndc_vehiculo_aseguradora').val('');
              }
              $('#placa_trailer').focus();
            },
            'json',
          );
        });
        $.ajaxSetup({async: true});
      }
    },
    'json',
  );
  $.ajaxSetup({async: true});
}

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;
    // an array that will be populated with substring matches
    matches = [];
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });
    cb(matches);
  };
};

async function crearVehiculo() {
  $('.nexos_messages_popup').html('');
  $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
  var datos = null;
  datos = new FormData();
  //ARCHIVOS - frontal
  datos.append('foto_vehiculo', document.getElementById('foto_vehiculo').files[0]);
  datos.append('foto_vehiculod', document.getElementById('foto_vehiculod').files[0]);
  datos.append('foto_vehiculoi', document.getElementById('foto_vehiculoi').files[0]);
  datos.append('foto_vehiculoa', document.getElementById('foto_vehiculoa').files[0]);
  //soat y tecnomecanica
  datos.append('foto_soat', document.getElementById('foto_soat').files[0]);
  datos.append('foto_tecno', document.getElementById('foto_tecno').files[0]);
  datos.append('foto_transi', document.getElementById('foto_transi').files[0]);

  //DATOS CMX_VEHICULOS
  // data.append('accion', 'crearVehiculo');
  datos.append('placa', $('#placa').val());
  datos.append('id_propietario', $('#id_propietario').val());
  datos.append('id_tenedor', $('#id_tenedor').val());
  datos.append('id_conductor', $('#id_conductor').val());
  datos.append('tipo_carroceria', $('#tipo_carroceria').val());
  datos.append('web_satelital', $('#web_satelital').val());
  datos.append('usuario_satelital', $('#usuario_satelital').val());
  datos.append('clave_satelital', $('#clave_satelital').val());
  datos.append('empresasatelite', $('#empresa_satelital').val());
  datos.append('tecnomecanica', $('#tecnomecanica').val());
  datos.append('fecha_tecno', $('#fecha_tecno').val());
  datos.append('fecha_vig_tecno', $('#fecha_vig_tecno').val());
  //DATOS CMX_VEHICULO2
  datos.append('configuracion', $('#id_vehiculo_configuracion').val());
  datos.append('clase', $('#clase_v').val());
  datos.append('color', $('#color').val());
  datos.append('marca', $('#marca').val());
  datos.append('linea', $('#linea').val());
  datos.append('modelo', $('#modelo').val());
  datos.append('tipo_combustible', $('#tipo_combustible').val());
  //rndc carroceria en el formulario
  //datos.append("carroceria", $("#carroceria").val());
  datos.append('peso_vacio', $('#peso_vacio').val());
  //numero soat
  datos.append('numero_polizaRC', $('#numero_polizaRC').val());
  datos.append('soat_vencimiento', $('#soat_vencimiento').val());
  datos.append('aseguradora', $('#id_vehiculo_aseguradora').val());
  datos.append('num_motor', $('#num_motor').val());
  datos.append('num_chasis', $('#num_chasis').val());
  datos.append('numero_poliza', $('#numero_poliza').val());
  datos.append('fecha_poliza', $('#fecha_poliza').val());
  datos.append('repotenciado', $('#repotencia').val());
  datos.append('tipovinculacion', $('#tipovinculacion').val());
  datos.append('fecha_mantenimientogps', $('#fecha_mantenimientogps').val());
  datos.append('capacidad_tn', $('#capacidad_tn').val());
  datos.append('trailers', $('#trailers').val());
  datos.append('peso_bruto', $('#peso_bruto').val());
  datos.append('f_matricula', $('#f_matricula').val());
  datos.append('lice_transito', $('#lice_transito').val());
  datos.append('cant_viaje', $('#cant_viaje').val());

  //nombres de los documentos
  datos.append('name_frontal', $('#name_frontal').val());
  datos.append('name_derecha', $('#name_derecha').val());
  datos.append('name_izquierda', $('#name_izquierda').val());
  datos.append('name_atras', $('#name_atras').val());
  datos.append('name_soat', $('#name_soat').val());
  datos.append('name_tecno', $('#name_tecno').val());
  datos.append('name_transi', $('#name_transi').val());

  // Datos del preoperacional
  datos.append('fecha_expedicion_preoperacional', $('#fecha_expedicion_preoperacional').val());
  datos.append('fecha_vencimiento_preoperacional', $('#fecha_vencimiento_preoperacional').val());
  datos.append('vigencia_prepoeracional', $('#vigencia_prepoeracional').val());
  datos.append('documento_preopeacional', document.getElementById('documento_preopeacional').files[0]);
  datos.append('name_preoperacional', $('#name_preoperacional').val());

  datos.append('foto_kit_mercancias', document.getElementById('foto_kit_mercancias').files[0]);
  datos.append('name_kit', $('#name_kit').val());

  try {
    const response = await fetch($('#id_url_ajax').val() + 'vehiculos/Insertar_vehiculo', {
      method: 'POST',
      body: datos,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data.numero === 200) {
      var contenidoHTML = `<div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
      <div class="icon"><span class="mdi mdi-check"></span></div>
      <div class="message">
        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> ${data.mensaje}
      </div>
    </div>`;
      sessionStorage.setItem('contenido', contenidoHTML);
      // $('#crea_proveedores').animate({scrollTop: 0}, 600);
    } else if (data.numero === 400) {
      var contenidoHTML = `<div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
      <div class="icon"><i class="fa-solid fa-xmark"></i></div>
      <div class="message">
        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> ${data.mensaje}
      </div>
    </div>`;
      sessionStorage.setItem('contenido', contenidoHTML);
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    var placa = $('#placa').val();
    crear_Dato_Ministerio(placa);
  }
}

async function crear_Dato_Ministerio(placa) {
  $('#loading-overlay-rndc ').css('display', 'flex'); // Mostrar mensaje de carga
  proceso = 12;
  var datos_rndc = new FormData();
  datos_rndc.append('placa', placa);
  datos_rndc.append('proceso', proceso);
  datos_rndc.append('dato', 3);
  datos_rndc.append('filtro', '');
  datos_rndc.append('tipopro', 3);
  try {
    const response = await fetch($('#id_url_ajax').val() + 'web_service/vehiculos', {
      method: 'POST',
      body: datos_rndc,
      cache: 'no-cache',
    });
    const data = await response.json();
    var tablas_locales = 'Se Registro Datos Exitosamente RNDC';
    if (data.status == 'true') {
      var contenidoHTML1 =
        '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
        tablas_locales +
        ' - ' +
        data.resultado +
        '</div></div>';
      sessionStorage.setItem('contenido_rndc', contenidoHTML1);
    } else if (data.status == 'false') {
      tablas_locales = 'No se creo el Tercero en RNDC';
      var contenidoHTML1 =
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
        tablas_locales +
        ' - ' +
        data.resultado +
        '</div></div>';
      sessionStorage.setItem('contenido_rndc', contenidoHTML1);
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-rndc ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    crear_Dato_Oet(placa);
  }
}

async function crear_Dato_Oet(placa) {
  $('#loading-overlay-oet ').css('display', 'flex'); // Mostrar mensaje de carga
  clase = 2;
  recurso = 6;
  let datos_oet = new FormData();
  datos_oet.append('clase_recurso', clase);
  datos_oet.append('recurso', recurso);
  datos_oet.append('dato_recurso', $('#placa').val());
  //Consulta_Recurso_Avansat
  try {
    const response = await fetch($('#id_url_ajax').val() + 'integrar_oet/Consulta_Recurso_Avansat', {
      method: 'POST',
      body: datos_oet,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data.status == true || data.status == 'true') {
      var tablas_locales = 'Se Registro Datos Exitosamente GRUPO OET';
      var contenidoHTML2 =
        '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
        tablas_locales +
        '</div></div>';
      sessionStorage.setItem('contenido_oet', contenidoHTML2);
    } else if (data.status == false || data.status == 'false') {
      var tablas_locales = 'No se creo el Tercero en GRUPO OET';
      var contenidoHTML2 =
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong> ' +
        tablas_locales +
        ' - ' +
        data.error +
        '</div></div>';
      sessionStorage.setItem('contenido_oet', contenidoHTML2);
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-oet ').css('display', 'none'); // Mostrar mensaje de carga
    $('#Modal_Mensajes').modal('toggle');

    // Recuperar HTML de sessionStorage
    var contenidoNEXOS = sessionStorage.getItem('contenido');
    var contenidoOET = sessionStorage.getItem('contenido_oet');
    var contenidoRNDC = sessionStorage.getItem('contenido_rndc');
    // Concatenar ambos contenidos
    var contenidoTotal = contenidoNEXOS + contenidoRNDC + contenidoOET;
    // Mostrar el contenido recuperado en el documento
    document.getElementById('contenedor').innerHTML = contenidoTotal;
  }
}

/* Funcion para cargar de forma predetrminada los proveedores del vehiculos */

async function cargar_proveedores_vehiculos(placa) {
  let formdata = new FormData();
  formdata.append('placa', placa);
  try {
    const response = await fetch($('#id_url_ajax').val() + 'vehiculos/cargar_proveedores', {
      method: 'POST',
      body: formdata,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      data.forEach(element => {
        d.getElementById('propietario_tabla').value = element.nombre_propietario;
        d.getElementById('id_propietario').value = element.propietario_id;
        d.getElementById('btn_cargar_propietario').disabled = true;
        d.getElementById('poseedor_tabla').value = element.nombre_tenedor;
        d.getElementById('id_tenedor').value = element.Poseedor_id;
        d.getElementById('btn_cargar_poseedor').disabled = true;
        d.getElementById('conductor_tabla').value = element.nombre_conductor;
        d.getElementById('id_conductor').value = element.Coductor_id;
        d.getElementById('btn_cargar_conductor').disabled = true;
      });
    } else {
      d.getElementById('propietario_tabla').value = 'Propietario No Creado';
      let btn_propietario = d.getElementById('btn_cargar_propietario');
      btn_propietario.disabled = true;
      d.getElementById('poseedor_tabla').value = 'Poseedor No Creado';
      let btn_poseedor = d.getElementById('btn_cargar_poseedor');
      btn_poseedor.disabled = true;
      d.getElementById('conductor_tabla').value = 'Conductor No Creado';
      let btn_conductor = d.getElementById('btn_cargar_conductor');
      btn_conductor.disabled = true;
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
    // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}
