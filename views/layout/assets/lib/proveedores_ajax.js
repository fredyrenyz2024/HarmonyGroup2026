let valores = '';
$(document).ready(function() {
  valores = window.location.search;
  // console.log('🚀 ~ valores:', valores);
  // let loadingOverlay = $("#loading-overlay");
  $('#actividades').hide();
  $('.select2').select2();
  $('#elmodalito2').click(function() {
    $('#actividades').hide();
    $('#num_val').val('');
    $('#token_val').val('');
  });

  var datos = JSON.parse(sessionStorage.getItem('datos_valida'));

  if (sessionStorage.getItem('datos_valida') !== null) {
    $('.datos_val').hide();
    $('#frm_proveedores').css('display', 'block');
    Crear_ventana(datos.estudio, datos.operacion);
  } else {
    $('.datos_val').show();
    $('#frm_proveedores').css('display', 'none');
  }

  /* Validar que tipo de operacion se va a realziar */
  let checkboxes_operaciones = document.querySelectorAll('.operacion');
  checkboxes_operaciones.forEach(checkbox_operacion => {
    checkbox_operacion.addEventListener('change', () => {
      if (checkbox_operacion.checked) {
        const Operacion = checkbox_operacion.value;
        if (Operacion === 'prefiltro') {
          if (document.getElementById('actualizacion').checked) {
            document.getElementById('mensaje_validacion').innerHTML = `
            <div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><i class="fas fa-info"></i></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                    <strong>Mensaje!</strong> Solo puede realizar una operación para crear las hojas de vida.
                </div>
            </div>
            `;
            document.getElementById('prefiltro').checked = false;
          } else {
            document.getElementById('campos_prefiltro_nuevo').style.display = 'block';
          }
        } else if (Operacion === 'actualizacion') {
          if (document.getElementById('prefiltro').checked) {
            document.getElementById('mensaje_validacion').innerHTML = `
            <div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><i class="fas fa-info"></i></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                    <strong>Mensaje!</strong> Solo puede realizar una operación para crear las hojas de vida.
                </div>
            </div>
            `;
            document.getElementById('actualizacion').checked = false;
          } else {
            document.getElementById('datos_prefiltro_actualizar').style.display = 'block';
          }
        }
      } else if (!checkbox_operacion.checked) {
        const Operacionunchecked = checkbox_operacion.value;
        if (Operacionunchecked === 'prefiltro') {
          document.getElementById('campos_prefiltro_nuevo').style.display = 'none';
        } else if (Operacionunchecked === 'actualizacion') {
          document.getElementById('datos_prefiltro_actualizar').style.display = 'none';
        }
      }
    });
  });

  // Contador de campos
  let contadorCampos = 0;
  $('#agregar_campo').click(function() {
    if (contadorCampos < 4) {
      // Verificar el límite de 3 campos
      contadorCampos++;
      // Crear nuevo campo
      const nuevoCampo = document.createElement('div');
      nuevoCampo.classList.add('col-xs-12');
      nuevoCampo.classList.add('col-sm-12');
      nuevoCampo.classList.add('col-md-2');
      nuevoCampo.classList.add('col-lg-2');
      nuevoCampo.classList.add('text-center');
      nuevoCampo.innerHTML = `
        <div class="input-group" id="campos_documentos${contadorCampos}">
          <input type="number" class="form-control input-xs" name="campo" id="documento${contadorCampos}" placeholder="Documento ${contadorCampos}">
          <span class="input-group-btn">
            <button class="btn btn-danger btn-xs btn_delete far fa-trash-alt" id="boton${contadorCampos}" type="button" data-id="${contadorCampos}"></button>
          </span>
        </div>
        `;
      // Agregar nuevo campo al contenedor
      const contenedorCampos = document.getElementById('campos');
      contenedorCampos.appendChild(nuevoCampo);
    } else {
      document.getElementById('mensaje_validacion').innerHTML = `
        <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
            <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
            <div class="message">
              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> No puedes agregar más de 4 campos.
            </div>
        </div>
        `;
    }
  });

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn_delete') || e.target.classList.contains('btn_delete *')) {
      const id = e.target.dataset.id;
      if (window.confirm(`¿Estás seguro de que deseas eliminar el documento ${id}?`)) {
        if (contadorCampos === 3 && id == 1) {
          document.getElementById('mensaje_validacion').innerHTML = `
          <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> No puede eliminar el documento 1 y 2 si haber eliminado el 3.
              </div>
          </div>
          `;
        } else if (contadorCampos === 3 && id == 2) {
          document.getElementById('mensaje_validacion').innerHTML = `
          <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> No puede eliminar el documento 1 y 2 si haber eliminado el 3.
              </div>
          </div>
          `;
        } else if (contadorCampos === 2 && id == 1) {
          document.getElementById('mensaje_validacion').innerHTML = `
          <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> No puede eliminar el documento 2 si haber eliminado el 2.
              </div>
          </div>
          `;
        } else {
          const documento = document.getElementById('documento' + id);
          const boton = document.getElementById('boton' + id);
          documento.remove();
          boton.remove();
          contadorCampos--;
        }
      }
    }
  });

  /* EVentos Change */
  document.addEventListener('keypress', async e => {
    if (e.target.matches('#token_val') || e.target.matches('#token_val *')) {
      // console.log('hola desde el change');
      var padre = e.target.parentElement.parentElement;
      var prefiltro = document.getElementById('num_val').value;
      console.log('🚀 ~ document.addEventListener ~ prefiltro:', prefiltro);
      var token = document.getElementById('token_val').value;
      console.log('🚀 ~ document.addEventListener ~ token:', token);
      let formdata = new FormData();
      formdata.append('prefiltro', prefiltro);
      formdata.append('token', token);
      try {
        const response = await fetch($('#id_url_ajax').val() + 'proveedores/consultar_datos_proveedores', {
          method: 'POST',
          body: formdata,
          cache: 'no-cache',
        });
        const data = await response.json();
        // console.log(data);
        if (data) {
          document.getElementById('campos_documentos').style.display = 'block';
          document.getElementById('boton_validar').style.display = 'block';
          /* Documentos */
          document.getElementById('document_propietario').value = data.documento_propietario;
          document.getElementById('document_propietario').disabled = true;
          document.getElementById('documento_tenedor').value = data.documento_tenedor;
          document.getElementById('documento_tenedor').disabled = true;
          document.getElementById('documen_conductor').value = data.documento_conductor;
          document.getElementById('documen_conductor').disabled = true;
          if (data.documento_propietario_trailer) {
            document.getElementById('documen_propietario_trailer').value = data.documento_propietario_trailer;
            document.getElementById('documen_propietario_trailer').disabled = true;
          } else {
            document.getElementById('documen_propietario_trailer').style.display = 'none';
            document.getElementById('documen_propietario_trailer').value = '';
          }
          $('#mensaje_token').html('');
        } else {
          console.log('error de datos');
          document.getElementById('campos_documentos').style.display = 'none';
          document.getElementById('boton_validar').style.display = 'none';
          $('#mensaje_token').html(`
          <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><span class="mdi mdi-info-outline"></span></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
            <strong>Mensaje!</strong> Numero de prefiltro o Token no son correctos por favor intentarlo nuevamente
          </div>
      </div>`);
        }
      } catch (error) {
        console.error('Error en la primera solicitud:', error);
        console.log('error no inserta');
        $('#crea_vehiculos').css('display', 'none');
        $('#mensaje_token_estudio').html(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><i class="fas fa-times"></i></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Ha ocurrrido un error ' +
            'Error en la primera solicitud:',
          error + '.</div></div>',
        );
        throw error;
      } finally {
        // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
      }
    }
  });

  /* EVENTOS CHANDE PARA VALIDAR LAS EXTECIONES DE LAS IMAGENES Y FORMADOTS */
  // Selecciona el input
  var foto_conductor = document.getElementById('foto_conductor');
  var foto_derecha = document.getElementById('foto_derecha');
  var foto_izquierda = document.getElementById('foto_izquierda');
  var foto_indume = document.getElementById('foto_indume');
  var acuerdo_uno = document.getElementById('acuerdo_uno');
  var documentos = document.getElementById('documentos');
  var licencia_conductor = document.getElementById('licencia');

  if (foto_conductor && foto_derecha && foto_izquierda && foto_indume && acuerdo_uno && documentos) {
    // Agrega el primer controlador de eventos
    foto_conductor.addEventListener('change', async e => {
      // Lista de extensiones permitidas
      const extensionesPermitidas = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
      // Obtener el nombre del archivo del input
      const archivo = foto_conductor.value;
      // Obtener la extensión del archivo
      const extension = archivo.split('.').pop().toLowerCase(); // Obtiene la última parte después del punto y la convierte a minúscula
      // Verificar si la extensión está en la lista de permitidas
      if (extensionesPermitidas.includes(extension)) {
        console.log('Extensión permitida: ' + extension);
        return true;
      } else {
        Swal.fire({
          title: 'Advertencia!',
          text: 'Extensión no permitida: ' + extension,
          icon: 'warning',
        });
        foto_conductor.value = ''; // Vaciar el campo para evitar cargar el archivo
        document.getElementById('name_fontall').value = '';
        return false;
      }
    });

    foto_derecha.addEventListener('change', async e => {
      // Lista de extensiones permitidas
      const extensionesPermitidas = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
      // Obtener el nombre del archivo del input
      const archivo = foto_derecha.value;
      // Obtener la extensión del archivo
      const extension = archivo.split('.').pop().toLowerCase(); // Obtiene la última parte después del punto y la convierte a minúscula
      // Verificar si la extensión está en la lista de permitidas
      if (extensionesPermitidas.includes(extension)) {
        console.log('Extensión permitida: ' + extension);
        return true;
      } else {
        Swal.fire({
          title: 'Advertencia!',
          text: 'Extensión no permitida: ' + extension,
          icon: 'warning',
        });
        foto_derecha.value = ''; // Vaciar el campo para evitar cargar el archivo
        document.getElementById('name_derecha').value = ''; // Vaciar el campo para evitar cargar el archivo
        return false;
      }
    });

    foto_izquierda.addEventListener('change', async e => {
      // Lista de extensiones permitidas
      const extensionesPermitidas = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
      // Obtener el nombre del archivo del input
      const archivo = foto_izquierda.value;
      // Obtener la extensión del archivo
      const extension = archivo.split('.').pop().toLowerCase(); // Obtiene la última parte después del punto y la convierte a minúscula
      // Verificar si la extensión está en la lista de permitidas
      if (extensionesPermitidas.includes(extension)) {
        console.log('Extensión permitida: ' + extension);
        return true;
      } else {
        Swal.fire({
          title: 'Advertencia!',
          text: 'Extensión no permitida: ' + extension,
          icon: 'warning',
        });
        foto_izquierda.value = ''; // Vaciar el campo para evitar cargar el archivo
        document.getElementById('name_izquierda').value = ''; // Vaciar el campo para evitar cargar el archivo
        return false;
      }
    });

    foto_indume.addEventListener('change', async e => {
      // Lista de extensiones permitidas
      const extensionesPermitidas = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
      // Obtener el nombre del archivo del input
      const archivo = foto_indume.value;
      // Obtener la extensión del archivo
      const extension = archivo.split('.').pop().toLowerCase(); // Obtiene la última parte después del punto y la convierte a minúscula
      // Verificar si la extensión está en la lista de permitidas
      if (extensionesPermitidas.includes(extension)) {
        console.log('Extensión permitida: ' + extension);
        return true;
      } else {
        Swal.fire({
          title: 'Advertencia!',
          text: 'Extensión no permitida: ' + extension,
          icon: 'warning',
        });
        foto_indume.value = ''; // Vaciar el campo para evitar cargar el archivo
        document.getElementById('name_indum').value = ''; // Vaciar el campo para evitar cargar el archivo
        return false;
      }
    });

    acuerdo_uno.addEventListener('change', async e => {
      // Lista de extensiones permitidas
      const extensionesPermitidas = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'pdf'];
      // Obtener el nombre del archivo del input
      const archivo = acuerdo_uno.value;
      // Obtener la extensión del archivo
      const extension = archivo.split('.').pop().toLowerCase(); // Obtiene la última parte después del punto y la convierte a minúscula
      // Verificar si la extensión está en la lista de permitidas
      if (extensionesPermitidas.includes(extension)) {
        console.log('Extensión permitida: ' + extension);
        return true;
      } else {
        Swal.fire({
          title: 'Advertencia!',
          text: 'Extensión no permitida: ' + extension,
          icon: 'warning',
        });
        acuerdo_uno.value = ''; // Vaciar el campo para evitar cargar el archivo
        document.getElementById('name_a1').value = ''; // Vaciar el campo para evitar cargar el archivo
        return false;
      }
    });

    documentos.addEventListener('change', async e => {
      // Lista de extensiones permitidas
      const extensionesPermitidas = ['pdf'];
      // Obtener el nombre del archivo del input
      const archivo = documentos.value;
      var archivos = documentos.files[0];
      // Obtener la extensión del archivo
      const extension = archivo.split('.').pop().toLowerCase(); // Obtiene la última parte después del punto y la convierte a minúscula
      // Verificar si la extensión está en la lista de permitidas
      if (extensionesPermitidas.includes(extension)) {
        console.log('Extensión permitida: ' + extension);
        // Verifica el tamaño del archivo (en este caso, máximo 1MB)
        var maxSize = 1 * 1024 * 1024; // 1MB en bytes
        if (archivos.size > maxSize) {
          Swal.fire({
            title: 'Advertencia!',
            text: 'El archivo no debe superar el tamaño de 1MB.',
            icon: 'warning',
          });
          // $('#documentos + p').remove();
          // const ERROR = $('<p></p>').text('El archivo no debe superar el tamaño de 1MB.').addClass('bg-danger text-center').css({
          //   color: '#FFF',
          //   'font-size': '12px',
          //   margin: 0,
          // });
          // $('#documentos').after(ERROR);
          $('#docu_soporte').val('');
          documentos.value = '';
        } else {
          $('#documentos + p').remove();
        }
        return true;
      } else {
        Swal.fire({
          title: 'Advertencia!',
          text: 'Extensión no permitida: ' + extension,
          icon: 'warning',
        });
        documentos.value = ''; // Vaciar el campo para evitar cargar el archivo
        document.getElementById('docu_soporte').value = ''; // Vaciar el campo para evitar cargar el archivo
        return false;
      }
    });
  }

  $('#btn_cancelar_registro').click(function() {
    if (window.confirm('¿Esta seguro que sea cancelar la creación del proveedor?')) {
      sessionStorage.clear();
      // location.reload();
      window.location = `${$('#id_url_ajax').val()}solicitudes/proveedores/${valores}`;
    } else {
    }
  });

  /* Validar token de prefiltro par vehicuslos y proveedores nuevos */
  $('#validar_token').click(async function() {
    if ($('#num_val').val() === '' && $('#token_val').val() == '' && $('#documen_conductor').val() == '' && $('#document_propietario').val() == '' && $('#documento_tenedor').val() == '') {
      $('#mensaje_token').html(`
			<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><span class="mdi mdi-info-outline"></span></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
							<strong>Advertencia!</strong> Debe ingresar el codigo de seguridad y el numero de prefiltro para completar el proceso de hoja de vida del vehiculo.
					</div>
			</div>`);
    } else if ($('#num_val').val() === '') {
      $('#mensaje_token').html(`
			<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><span class="mdi mdi-info-outline"></span></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
							<strong>Mensaje!</strong> Debe ingresar el numero de <strong> prefiltro </strong> para completar el proceso de hoja de vida del vehiculo.
					</div>
			</div>`);
    } else if ($('#token_val').val() == '') {
      $('#mensaje_token').html(`
			<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><span class="mdi mdi-info-outline"></span></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
							<strong>Mensaje!</strong> Debe ingresar el <strong> codigo de seguridad </strong> para completar el proceso de hoja de vida del vehiculo.
					</div>
			</div>`);
    } else if ($('#documen_conductor').val() == '') {
      $('#mensaje_token').html(`
			<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><span class="mdi mdi-info-outline"></span></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
							<strong>Mensaje!</strong> Debe ingresar el documento del <strong> conductor </strong>.
					</div>
			</div>`);
    } else if ($('#document_propietario').val() == '') {
      $('#mensaje_token').html(`
			<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><span class="mdi mdi-info-outline"></span></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
							<strong>Mensaje!</strong> Debe ingresar el documento del  <strong> propietario.</strong>
					</div>
			</div>`);
    } else if ($('#documento_tenedor').val() == '') {
      $('#mensaje_token').html(`
			<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><span class="mdi mdi-info-outline"></span></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
							<strong>Mensaje!</strong> Debe ingresar el documento del <strong> tenedor. </strong>
					</div>
			</div>`);
    } else {
      $('#loading-overlay-nexosapp ').css('display', 'flex');
      let formdata = new FormData();
      formdata.append('prefiltro', $('#num_val').val());
      formdata.append('token', $('#token_val').val());
      formdata.append('conductor', $('#documen_conductor').val());
      formdata.append('propietario', $('#document_propietario').val());
      formdata.append('tenedor', $('#documento_tenedor').val());
      var url = $('#id_url_ajax').val() + 'proveedores/Validar_token';
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: formdata,
          cache: 'no-cache',
        });
        const data = await response.json();
        let mensaje = '';
        if (data.numero === 400) {
          $('#cargando').css('display', 'none');
          mensaje = `
          <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-info-outline"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> ${data.mensaje}
              </div>
          </div>`;
        } else if (data.numero === 200) {
          mensaje = `
          <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-check"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> ${data.mensaje}
              </div>
          </div>`;
          Crear_ventana($('#num_val').val(), 'Prefiltro Nuevo');
          sessionStorage.setItem(
            'datos_valida',
            JSON.stringify({
              propietario: $('#document_propietario').val(),
              propietarioTrailer: $('#documen_propietario_trailer').val(),
              poseedor: $('#documento_tenedor').val(),
              conductor: $('#documen_conductor').val(),
            }),
          );
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
        $('#mensaje_token').html(mensaje);
      } catch (error) {
        console.error('Error en la primera solicitud:', error);
        console.log('error no inserta');
        $('#crea_vehiculos').css('display', 'none');
        $('#mensaje_token_estudio').html(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><i class="fas fa-times"></i></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Ha ocurrrido un error ' +
            'Error en la primera solicitud:',
          error + '.</div></div>',
        );
        throw error;
      } finally {
        $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        // Crear_ventana($("#num_val").val(), "Prefiltro Nuevo");
      }
    }
  });

  /* Validar token de estudio de seguridad en actualizacion para crear recursos a nuevos a vehiculos existentes. */
  $('#validar_token_estudio_nuevo').click(async function() {
    if ($('#num_val_estudio').val() === '' && $('#token_val_estudio').val() === '') {
      $('#mensaje_token_estudio').html(`
      <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Advertencia!</strong> Debe diligenciar todos los campos y agregar los docmentos para hacer optener la autorización para crear la hoja de vida.
          </div>
      </div>`);
    } else if ($('#num_val_estudio').val() === '') {
      $('#mensaje_token_estudio').html(`
      <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Advertencia!</strong> Debe diligenciar el numero de <strong> estudio </strong> para crear la hoja de vida.
          </div>
      </div>`);
    } else if ($('#token_val_estudio').val() === '') {
      $('#mensaje_token_estudio').html(`
      <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Advertencia!</strong> Debe diligenciar el <strong> token </strong> de estudio para crear la hoja de vida.
          </div>
      </div>`);
    } else if ($('#documento1').val() === '' && $('#documento2').val() === '' && $('#documento3').val() === '') {
      $('#mensaje_token_estudio').html(`
      <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Advertencia!</strong> Debe diligenciar los <strong> documentos </strong> de estudio para crear la hoja de vida.
          </div>
      </div>`);
    } else if ($('#documento1').val() === '') {
      $('#mensaje_token_estudio').html(`
      <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Advertencia!</strong> Debe diligenciar el <strong> documento 1 </strong> de estudio para crear la hoja de vida.
          </div>
      </div>`);
    } else if ($('#documento1').val() === '' && $('#documento2').val() === '') {
      $('#mensaje_token_estudio').html(`
      <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Advertencia!</strong> Debe diligenciar el <strong> documento 1 y el documento 2 </strong> de estudio para crear la hoja de vida.
          </div>
      </div>`);
    } else {
      $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
      let formdata = new FormData();
      formdata.append('estudio', $('#num_val_estudio').val());
      formdata.append('token', $('#token_val_estudio').val());
      /* Los tres documentos llenos */
      // Crear un objeto para almacenar los datos
      var datosValidaEstudio = {
        documento1: [],
        documento2: [],
        documento3: [],
        documento4: [],
      };
      if (($('#docmento1').val() !== '' && $('#docmento2').val() !== '' && $('#docmento3').val() !== '') || $('#docmento4').val() !== '') {
        datosValidaEstudio.documento1 = $('#documento1').val();
        datosValidaEstudio.documento2 = $('#documento2').val();
        datosValidaEstudio.documento3 = $('#documento3').val();
        datosValidaEstudio.documento4 = $('#documento4').val();
      } else if ($('#docmento1').val() !== '' && $('#docmento2').val() !== '' && $('#docmento3').val() !== '') {
        datosValidaEstudio.documento1 = $('#documento1').val();
        datosValidaEstudio.documento2 = $('#documento2').val();
        datosValidaEstudio.documento3 = $('#documento3').val();
      } else if ($('#docmento1').val() !== '' && $('#docmento2').val() !== '') {
        datosValidaEstudio.documento1 = $('#documento1').val();
        datosValidaEstudio.documento2 = $('#documento2').val();
      } else if ($('#docmento1').val() !== '') {
        datosValidaEstudio.documento1 = $('#documento1').val();
      }
      formdata.append('documentos', JSON.stringify(datosValidaEstudio));
      try {
        const response = await fetch($('#id_url_ajax').val() + 'proveedores/Validar_token_estudio', {
          method: 'POST',
          body: formdata,
          cache: 'no-cache',
        });
        const data = await response.json();
        let mensaje = '';
        if (data.numero === 400) {
          $('#cargando').css('display', 'none');
          mensaje = `
          <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-info-outline"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> ${data.mensaje}
              </div>
          </div>`;
        } else if (data.numero === 200) {
          mensaje = `
          <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-check"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> ${data.mensaje}
              </div>
          </div>`;
          Crear_ventana($('#num_val_estudio').val(), 'Recurso Nuevo');
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
        $('#mensaje_token_estudio').html(mensaje);
      } catch (error) {
        console.error('Error en la primera solicitud:', error);
        console.log('error no inserta');
        $('#crea_vehiculos').css('display', 'none');
        $('#mensaje_token_estudio').html(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><i class="fas fa-times"></i></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Ha ocurrrido un error ' +
            'Error en la primera solicitud:' +
            error +
            '.</div></div>',
        );
        throw error;
      } finally {
        $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        // Crear_ventana($("#num_val_estudio").val(), "Recurso Nuevo");
      }
    }
  });

  async function Crear_ventana(estudio, operacion) {
    if (operacion === 'Recurso Nuevo') {
      let paquete = new FormData();
      paquete.append('estudio', estudio);
      $('#loading-overlay-oet').css('display', 'flex');
      try {
        const response = await fetch($('#id_url_ajax').val() + 'proveedores/Consulta_Recursos', {
          method: 'POST',
          body: paquete,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          sessionStorage.setItem(
            'datos_valida',
            JSON.stringify({
              propietario: data.resultado.documento_propietario,
              poseedor: data.resultado.documento_poseedor,
              conductor: data.resultado.documento_conductor,
              propietario_trailer: data.resultado.documento_propi_trailer,
              estudio: data.resultado.ESTUDIO,
              operacion: operacion,
            }),
          );
          let datos_proveedores = JSON.parse(sessionStorage.getItem('datos_valida'));
          if ((data.resultado.propietario === '1' && data.resultado.poseedor === '1' && data.resultado.conductor === '1') || data.resultado.trailer === '1') {
            /* Validacion cuando mandes el propietario de trailer */
            if (data.resultado.trailer === '1' && data.resultado.documento_propi_trailer) {
              /* Validar si lo propietarios son iguales o no */
              if (
                data.resultado.documento_propietario === data.resultado.documento_poseedor &&
                data.resultado.documento_propietario === data.resultado.documento_conductor &&
                data.resultado.documento_propietario === data.resultado.documento_propi_trailer
              ) {
                $('.datos_val').hide();
                $('#actividades').show();
                $('#acciones').show();
                $('#frm_proveedores').css('display', 'block');
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#Proveedor').hide();
                $('#propietario_trailer').show();

                if (
                  data.resultado.documento_propietario == data.validar.Propietario &&
                  data.resultado.documento_poseedor == data.validar.Poseedor &&
                  data.resultado.documento_conductor == data.validar.Conductor
                ) {
                  var terceros_existen = `#C8E6C9`;
                  var texto_terceros = 'Terceros ya cuentan con hojas de vida';
                  var validado_terceros = 'SI';
                  $('#Conductor').hide();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').hide();
                  $('#propietario_trailer').show();
                } else {
                  var terceros_existen = `#FFFFFF`;
                  var texto_terceros = 'Terceros no cuentan con hojas de vida';
                  var validado_terceros = 'NO';
                }

                $('#Lista_comprobacion').html(`
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                  <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                    <tr>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background-color:${terceros_existen};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Terceros</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${texto_terceros}</td>
                    </tr>
                  </tbody>
                </table>`);
              } else if (data.resultado.documento_propietario === data.resultado.documento_poseedor && data.resultado.documento_propietario === data.resultado.documento_conductor) {
                $('.datos_val').hide();
                $('#actividades').show();
                $('#acciones').show();
                $('#frm_proveedores').css('display', 'block');
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#Proveedor').hide();

                if (
                  data.resultado.documento_propietario == data.validar.Propietario &&
                  data.resultado.documento_poseedor == data.validar.Poseedor &&
                  data.resultado.documento_conductor == data.validar.Conductor
                ) {
                  var terceros_existen = `#C8E6C9`;
                  var texto_terceros = 'Conductor & Propietario & Poseedor ya cuentan con hojas de vida';
                  var validado_terceros = 'SI';
                  $('#Conductor').hide();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').hide();
                  $('#propietario_trailer').show();
                } else {
                  var terceros_existen = `#FFFFFF`;
                  var texto_terceros = 'Conductor & Propietario & Poseedor no cuentan con hojas de vida';
                  var validado_terceros = 'NO';
                  $('#propietario_trailer').show();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').hide();
                  $('#Conductor').hide();
                }

                if (data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                  var Propietario_Trailer_existe = `#C8E6C9`;
                  var texto_propietario_trailer = 'Propietario Trailer ya cuentan con hoja de vida';
                  var validado_Propietario_trailer = 'SI';
                  $('#propietario_trailer').hide();
                } else {
                  var Propietario_Trailer_existe = `#FFFFFF`;
                  var texto_propietario_trailer = 'Propietario Trailer no cuentan con hoja de vida';
                  var validado_Propietario_trailer = 'NO';
                  $('#propietario_trailer').show();
                }

                $('#Lista_comprobacion').html(`
                  <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                    <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                      <tr>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="fila_conductor" style="background-color:${terceros_existen};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Conductor & Propietario & Poseedor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                      </tr>
                      <tr  class="fila_propietario" style="background-color:${Propietario_Trailer_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Propietario Trailer</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario_trailer}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_propietario_trailer}</td>
                      </tr>
                    </tbody>
                  </table>`);
              } else if (data.resultado.documento_propietario === data.resultado.documento_poseedor && data.resultado.documento_propietario === data.resultado.documento_propi_trailer) {
                if (
                  data.resultado.documento_propietario == data.validar.Propietario &&
                  data.resultado.documento_poseedor == data.validar.Poseedor &&
                  data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer
                ) {
                  var terceros_existen = `#C8E6C9`;
                  var texto_terceros = 'Propietario & Propietario Trailer & Poseedor ya cuentan con hojas de vida';
                  var validado_terceros = 'SI';
                  $('#Conductor').show();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').hide();
                  $('#propietario_trailer').hide();
                } else {
                  var terceros_existen = `#FFFFFF`;
                  var texto_terceros = 'Propietario & Propietario Trailer & Poseedor  no cuentan con hojas de vida';
                  var validado_terceros = 'NO';
                  $('#propietario_trailer').hide();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').hide();
                  $('#Conductor').show();
                }

                if (data.resultado.documento_conductor == data.validar.Conductor) {
                  var Conductor_existe = `#C8E6C9`;
                  var texto_Conductor = 'Conductor ya cuentan con hoja de vida';
                  var validado_Conductor = 'SI';
                  $('#Conductor').hide();
                } else {
                  var Conductor_existe = `#FFFFFF`;
                  var texto_Conductor = 'Conductor no cuentan con hoja de vida';
                  var validado_Conductor = 'NO';
                  $('#Conductor').show();
                }

                $('#Lista_comprobacion').html(`
                  <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                    <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                      <tr>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="fila_conductor" style="background-color:${terceros_existen};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Conductor & Propietario & Poseedor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                      </tr>
                      <tr  class="fila_propietario" style="background-color:${Conductor_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Conductor}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Conductor}</td>
                      </tr>
                    </tbody>
                  </table>`);
              } else if (data.resultado.documento_propietario === data.resultado.documento_conductor && data.resultado.documento_propietario === data.resultado.documento_propi_trailer) {
                if (
                  data.resultado.documento_propietario == data.validar.Propietario &&
                  data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer &&
                  data.resultado.documento_conductor == data.validar.Conductor
                ) {
                  var terceros_existen = `#C8E6C9`;
                  var texto_terceros = 'Propietario & Propietario Trailer & Conductor ya cuentan con hojas de vida';
                  var validado_terceros = 'SI';
                  $('#Conductor').hide();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').show();
                  $('#propietario_trailer').hide();
                } else {
                  var terceros_existen = `#FFFFFF`;
                  var texto_terceros = 'Propietario & Propietario Trailer & Conductor  no cuentan con hojas de vida';
                  var validado_terceros = 'NO';
                  $('#propietario_trailer').hide();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').show();
                  $('#Conductor').hide();
                }

                if (data.resultado.documento_poseedor == data.validar.Poseedor) {
                  var Poseedor_existe = `#C8E6C9`;
                  var texto_Poseedor = 'Poseedor ya cuentan con hoja de vida';
                  var validado_Poseedor = 'SI';
                  $('#poseedor_vehiculo').hide();
                } else {
                  var Poseedor_existe = `#FFFFFF`;
                  var texto_Poseedor = 'Poseedor no cuentan con hoja de vida';
                  var validado_Poseedor = 'NO';
                  $('#poseedor_vehiculo').show();
                }

                $('#Lista_comprobacion').html(`
                  <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                    <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                      <tr>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="fila_conductor" style="background-color:${terceros_existen};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Conductor & Propietario & Poseedor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                      </tr>
                      <tr  class="fila_propietario" style="background-color:${Poseedor_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Poseedor}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
                      </tr>
                    </tbody>
                  </table>`);
              } else if (data.resultado.documento_poseedor === data.resultado.documento_conductor && data.resultado.documento_poseedor === data.resultado.documento_propi_trailer) {
                if (
                  data.resultado.documento_poseedor == data.validar.Poseedor &&
                  data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer &&
                  data.resultado.documento_conductor == data.validar.Conductor
                ) {
                  var terceros_existen = `#C8E6C9`;
                  var texto_terceros = 'Poseedor & Propietario Trailer & Conductor ya cuentan con hojas de vida';
                  var validado_terceros = 'SI';
                  $('#Conductor').hide();
                  $('#propietario_vehiculo').show();
                  $('#poseedor_vehiculo').hide();
                  $('#propietario_trailer').hide();
                } else {
                  var terceros_existen = `#FFFFFF`;
                  var texto_terceros = 'Poseedor & Propietario Trailer & Conductor  no cuentan con hojas de vida';
                  var validado_terceros = 'NO';
                  $('#propietario_trailer').hide();
                  $('#propietario_vehiculo').show();
                  $('#poseedor_vehiculo').hide();
                  $('#Conductor').hide();
                }

                if (data.resultado.documento_propietario == data.validar.Propietario) {
                  var Propietario_existe = `#C8E6C9`;
                  var texto_Propietario = 'Propietario ya cuentan con hoja de vida';
                  var validado_Propietario = 'SI';
                  $('#poseedor_vehiculo').hide();
                } else {
                  var Propietario_existe = `#FFFFFF`;
                  var texto_Propietario = 'Propietario no cuentan con hoja de vida';
                  var validado_Propietario = 'NO';
                  $('#poseedor_vehiculo').show();
                }

                $('#Lista_comprobacion').html(`
                  <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                    <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                      <tr>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="fila_conductor" style="background-color:${terceros_existen};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Conductor & Propietario & Poseedor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                      </tr>
                      <tr  class="fila_propietario" style="background-color:${Propietario_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario}</td>
                      </tr>
                    </tbody>
                  </table>`);
              } else if (data.resultado.documento_propietario === data.resultado.documento_poseedor) {
                if (data.resultado.documento_propietario == data.validar.Propietario && data.resultado.documento_poseedor == data.validar.Poseedor) {
                  var terceros_existen = `#C8E6C9`;
                  var texto_terceros = 'Propietario & Poseedor ya cuentan con hojas de vida';
                  var validado_terceros = 'SI';
                  $('#Conductor').show();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').hide();
                  $('#propietario_trailer').show();
                } else {
                  var terceros_existen = `#FFFFFF`;
                  var texto_terceros = 'Propietario & Poseedor  no cuentan con hojas de vida';
                  var validado_terceros = 'NO';
                  $('#propietario_trailer').show();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').hide();
                  $('#Conductor').show();
                }

                if (data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                  var Propietario_Trailer_existe = `#C8E6C9`;
                  var texto_Propietario_Trailer = 'Propietario Tráiler ya cuentan con hoja de vida';
                  var validado_Propietario_Trailer = 'SI';
                  $('#propietario_trailer').hide();
                } else {
                  var Propietario_Trailer_existe = `#FFFFFF`;
                  var texto_Propietario_Trailer = 'Propietario Tráiler no cuentan con hoja de vida';
                  var validado_Propietario_Trailer = 'NO';
                  $('#propietario_trailer').show();
                }

                if (data.resultado.documento_conductor == data.validar.Conductor) {
                  var Conductor_existe = `#C8E6C9`;
                  var texto_Conductor = 'Conductor ya cuentan con hoja de vida';
                  var validado_Conductor = 'SI';
                  $('#Conductor').hide();
                } else {
                  var Conductor_existe = `#FFFFFF`;
                  var texto_Conductor = 'Conductor no cuentan con hoja de vida';
                  var validado_Conductor = 'NO';
                  $('#Conductor').show();
                }

                $('#Lista_comprobacion').html(`
                  <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                    <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                      <tr>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="fila_conductor" style="background-color:${terceros_existen};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Conductor & Propietario & Poseedor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                      </tr>
                      <tr  class="fila_propietario" style="background-color:${Conductor_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Conductor}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Conductor}</td>
                      </tr>
                      <tr  class="fila_propietario" style="background-color:${Propietario_Trailer_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Propietario Trailer</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario_Trailer}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario_Trailer}</td>
                      </tr>
                    </tbody>
                  </table>`);
              } else if (data.resultado.documento_propietario === data.resultado.documento_conductor) {
                if (data.resultado.documento_propietario == data.validar.Propietario && data.resultado.documento_conductor == data.validar.Conductor) {
                  var terceros_existen = `#C8E6C9`;
                  var texto_terceros = 'Propietario & Conductor ya cuentan con hojas de vida';
                  var validado_terceros = 'SI';
                  $('#Conductor').hide();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').show();
                  $('#propietario_trailer').show();
                } else {
                  var terceros_existen = `#FFFFFF`;
                  var texto_terceros = 'Propietario & Conductor no cuentan con hojas de vida';
                  var validado_terceros = 'NO';
                  $('#propietario_trailer').show();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').show();
                  $('#Conductor').hide();
                }

                if (data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                  var Propietario_Trailer_existe = `#C8E6C9`;
                  var texto_Propietario_Trailer = 'Propietario Tráiler ya cuentan con hoja de vida';
                  var validado_Propietario_Trailer = 'SI';
                  $('#propietario_trailer').hide();
                } else {
                  var Propietario_Trailer_existe = `#FFFFFF`;
                  var texto_Propietario_Trailer = 'Propietario Tráiler no cuentan con hoja de vida';
                  var validado_Propietario_Trailer = 'NO';
                  $('#propietario_trailer').show();
                }

                if (data.resultado.documento_poseedor == data.validar.Poseedor) {
                  var Poseedor_existe = `#C8E6C9`;
                  var texto_Poseedor = 'Poseedor ya cuentan con hoja de vida';
                  var validado_Poseedor = 'SI';
                  $('#poseedor_vehiculo').hide();
                } else {
                  var Poseedor_existe = `#FFFFFF`;
                  var texto_Poseedor = 'Poseedor no cuentan con hoja de vida';
                  var validado_Poseedor = 'NO';
                  $('#poseedor_vehiculo').show();
                }

                $('#Lista_comprobacion').html(`
                  <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                    <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                      <tr>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="fila_conductor" style="background-color:${terceros_existen};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Conductor & Propietario & Poseedor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                      </tr>
                      <tr  class="fila_propietario" style="background-color:${Poseedor_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Poseedor}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
                      </tr>
                      <tr  class="fila_propietario" style="background-color:${Propietario_Trailer_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Propietario Trailer</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario_Trailer}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario_Trailer}</td>
                      </tr>
                    </tbody>
                  </table>`);
              } else if (data.resultado.documento_propietario === data.resultado.documento_propi_trailer) {
                if (data.resultado.documento_propietario == data.validar.Propietario && data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                  var terceros_existen = `#C8E6C9`;
                  var texto_terceros = 'Propietario & Propietario Trailer ya cuentan con hojas de vida';
                  var validado_terceros = 'SI';
                  $('#Conductor').show();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').show();
                  $('#propietario_trailer').hide();
                } else {
                  var terceros_existen = `#FFFFFF`;
                  var texto_terceros = 'Propietario & Propietario Trailer no cuentan con hojas de vida';
                  var validado_terceros = 'NO';
                  $('#propietario_trailer').hide();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').hide();
                  $('#Conductor').show();
                }

                if (data.resultado.documento_poseedor == data.validar.Poseedor) {
                  var Poseedor_existe = `#C8E6C9`;
                  var texto_Poseedor = 'Poseedor ya cuentan con hoja de vida';
                  var validado_Poseedor = 'SI';
                  $('#poseedor_vehiculo').hide();
                } else {
                  var Poseedor_existe = `#FFFFFF`;
                  var texto_Poseedor = 'Poseedor no cuentan con hoja de vida';
                  var validado_Poseedor = 'NO';
                  $('#poseedor_vehiculo').show();
                }

                if (data.resultado.documento_conductor == data.validar.Conductor) {
                  var Conductor_existe = `#C8E6C9`;
                  var texto_Conductor = 'Conductor ya cuentan con hoja de vida';
                  var validado_Conductor = 'SI';
                  $('#Conductor').hide();
                } else {
                  var Conductor_existe = `#FFFFFF`;
                  var texto_Conductor = 'Conductor no cuentan con hoja de vida';
                  var validado_Conductor = 'NO';
                  $('#Conductor').show();
                }

                $('#Lista_comprobacion').html(`
                  <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                    <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                      <tr>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="fila_conductor" style="background-color:${terceros_existen};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Conductor & Propietario & Poseedor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                      </tr>
                      <tr  class="fila_propietario" style="background-color:${Poseedor_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Poseedor}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
                      </tr>
                      <tr  class="fila_propietario" style="background-color:${Conductor_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Conductor}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Conductor}</td>
                      </tr>
                    </tbody>
                  </table>`);
              } else if (data.resultado.documento_poseedor === data.resultado.documento_conductor) {
                if (data.resultado.documento_poseedor == data.validar.Poseedor && data.resultado.documento_conductor == data.validar.Conductor) {
                  var terceros_existen = `#C8E6C9`;
                  var texto_terceros = 'Poseedor & Conductor ya cuentan con hojas de vida';
                  var validado_terceros = 'SI';
                  $('#Conductor').hide();
                  $('#propietario_vehiculo').show();
                  $('#poseedor_vehiculo').hide();
                  $('#propietario_trailer').show();
                } else {
                  var terceros_existen = `#FFFFFF`;
                  var texto_terceros = 'Poseedor & Conductor no cuentan con hojas de vida';
                  var validado_terceros = 'NO';
                  $('#propietario_trailer').show();
                  $('#propietario_vehiculo').show();
                  $('#poseedor_vehiculo').hide();
                  $('#Conductor').hide();
                }

                if (data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                  var Propietario_Trailer_existe = `#C8E6C9`;
                  var texto_propietario_trailer = 'Propietario Trailer ya cuentan con hoja de vida';
                  var validado_Propietario_trailer = 'SI';
                  $('#propietario_trailer').hide();
                } else {
                  var Propietario_Trailer_existe = `#FFFFFF`;
                  var texto_propietario_trailer = 'Propietario Trailer no cuentan con hoja de vida';
                  var validado_Propietario_trailer = 'NO';
                  $('#propietario_trailer').show();
                }

                if (data.resultado.documento_propietario == data.validar.Propietario) {
                  var Propietario_existe = `#C8E6C9`;
                  var texto_Propietario = 'Propietario ya cuentan con hoja de vida';
                  var validado_Propietario = 'SI';
                  $('#propietario_vehiculo').hide();
                } else {
                  var Propietario_existe = `#FFFFFF`;
                  var texto_Propietario = 'Propietario no cuentan con hoja de vida';
                  var validado_Propietario = 'NO';
                  $('#propietario_vehiculo').show();
                }

                $('#Lista_comprobacion').html(`
                  <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                    <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                      <tr>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="fila_conductor" style="background-color:${terceros_existen};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Conductor & Poseedor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                      </tr>
                      <tr  class="fila_propietario" style="background-color:${Propietario_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario}</td>
                      </tr>
                      <tr  class="fila_propietario" style="background-color:${Propietario_Trailer_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Propietario Trailer</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario_trailer}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_propietario_trailer}</td>
                      </tr>
                    </tbody>
                  </table>`);
              } else if (data.resultado.documento_poseedor === data.resultado.documento_propi_trailer) {
                if (data.resultado.documento_poseedor == data.validar.Poseedor && data.resultado.documento_conductor == data.validar.Conductor) {
                  var terceros_existen = `#C8E6C9`;
                  var texto_terceros = 'Poseedor & Propietario Trailer ya cuentan con hojas de vida';
                  var validado_terceros = 'SI';
                  $('#Conductor').show();
                  $('#propietario_vehiculo').show();
                  $('#poseedor_vehiculo').hide();
                  $('#propietario_trailer').hide();
                } else {
                  var terceros_existen = `#FFFFFF`;
                  var texto_terceros = 'Poseedor & Propietario Trailer no cuentan con hojas de vida';
                  var validado_terceros = 'NO';
                  $('#propietario_trailer').hide();
                  $('#propietario_vehiculo').show();
                  $('#poseedor_vehiculo').hide();
                  $('#Conductor').show();
                }

                if (data.resultado.documento_propietario == data.validar.Propietario) {
                  var Propietario_existe = `#C8E6C9`;
                  var texto_Propietario = 'Propietario ya cuentan con hoja de vida';
                  var validado_Propietario = 'SI';
                  $('#propietario_vehiculo').hide();
                } else {
                  var Propietario_existe = `#FFFFFF`;
                  var texto_Propietario = 'Propietario no cuentan con hoja de vida';
                  var validado_Propietario = 'NO';
                  $('#propietario_vehiculo').show();
                }

                if (data.resultado.documento_conductor == data.validar.Conductor) {
                  var Conductor_existe = `#C8E6C9`;
                  var texto_Conductor = 'Conductor ya cuentan con hoja de vida';
                  var validado_Conductor = 'SI';
                  $('#Conductor').hide();
                } else {
                  var Conductor_existe = `#FFFFFF`;
                  var texto_Conductor = 'Conductor no cuentan con hoja de vida';
                  var validado_Conductor = 'NO';
                  $('#Conductor').show();
                }

                $('#Lista_comprobacion').html(`
                  <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                    <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                      <tr>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="fila_conductor" style="background-color:${terceros_existen};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor & Propietario Trailer</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                      </tr>
                      <tr  class="fila_propietario" style="background-color:${Propietario_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario}</td>
                      </tr>
                      <tr  class="fila_propietario" style="background-color:${Conductor_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Conductor}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Conductor}</td>
                      </tr>
                    </tbody>
                  </table>`);
              } else if (data.resultado.documento_conductor === data.resultado.documento_propi_trailer) {
                if (data.resultado.documento_conductor == data.validar.Conductor && data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                  var terceros_existen = `#C8E6C9`;
                  var texto_terceros = 'Conductor & Propietario Trailer ya cuentan con hojas de vida';
                  var validado_terceros = 'SI';
                  $('#Conductor').hide();
                  $('#propietario_vehiculo').show();
                  $('#poseedor_vehiculo').show();
                  $('#propietario_trailer').hide();
                } else {
                  var terceros_existen = `#FFFFFF`;
                  var texto_terceros = 'Conductor & Propietario Trailer no cuentan con hojas de vida';
                  var validado_terceros = 'NO';
                  $('#propietario_trailer').hide();
                  $('#propietario_vehiculo').show();
                  $('#poseedor_vehiculo').show();
                  $('#Conductor').hide();
                }

                if (data.resultado.documento_propietario == data.validar.Propietario) {
                  var Propietario_existe = `#C8E6C9`;
                  var texto_Propietario = 'Propietario ya cuentan con hoja de vida';
                  var validado_Propietario = 'SI';
                  $('#propietario_vehiculo').hide();
                } else {
                  var Propietario_existe = `#FFFFFF`;
                  var texto_Propietario = 'Propietario no cuentan con hoja de vida';
                  var validado_Propietario = 'NO';
                  $('#propietario_vehiculo').show();
                }

                if (data.resultado.documento_poseedor == data.validar.Poseedor) {
                  var Poseedor_existe = `#C8E6C9`;
                  var texto_Poseedor = 'Poseedor ya cuentan con hoja de vida';
                  var validado_Poseedor = 'SI';
                  $('#poseedor_vehiculo').hide();
                } else {
                  var Poseedor_existe = `#FFFFFF`;
                  var texto_Poseedor = 'Poseedor no cuentan con hoja de vida';
                  var validado_Poseedor = 'NO';
                  $('#poseedor_vehiculo').show();
                }

                $('#Lista_comprobacion').html(`
                  <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                    <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                      <tr>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="fila_conductor" style="background-color:${terceros_existen};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor & Propietario Trailer</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                      </tr>
                      <tr  class="fila_propietario" style="background-color:${Poseedor_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Poseedor}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
                      </tr>
                      <tr  class="fila_propietario" style="background-color:${Propietario_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Popietario</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario}</td>
                      </tr>
                    </tbody>
                  </table>`);
              } else {
                $('.datos_val').hide();
                $('#actividades').show();
                $('#acciones').show();
                $('#frm_proveedores').css('display', 'block');
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#Proveedor').hide();
                $('#propietario_trailer').show();

                if (data.resultado.documento_conductor == data.validar.Conductor) {
                  var conductor_existe = `#aed5c0`;
                  var texto_conductor = 'Existe Conductor creado con este documento';
                  var valido_conductor = 'SI';
                  $('#Conductor').hide();
                } else {
                  var conductor_existe = `#FFFFFF`;
                  var texto_conductor = 'NO existe Conductor creado con este documento';
                  var valido_conductor = 'NO';
                  $('#Conductor').show();
                }

                if (data.resultado.documento_propietario == data.validar.Propietario) {
                  var Propietario_existe = `#aed5c0`;
                  var texto_Propietario = 'Existe Conductor creado con este documento';
                  var valido_propietario = 'SI';
                  valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
                  $('#propietario_vehiculo').hide();
                } else {
                  var Propietario_existe = `#FFFFFF`;
                  var texto_Propietario = 'NO existe Conductor creado con este documento';
                  var valido_propietario = 'NO';
                  $('#propietario_vehiculo').show();
                }

                if (data.resultado.documento_poseedor == data.validar.Poseedor) {
                  var Poseedor_existe = `#aed5c0`;
                  var texto_Poseedor = 'Existe Poseedor creado con este documento';
                  var valido_poseedor = 'SI';
                  valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
                  valido_propietario === 'SI' ? $('#propietario_vehiculo').hide() : $('#propietario_vehiculo').show();
                  $('#poseedor_vehiculo').hide();
                } else {
                  var Poseedor_existe = `#FFFFFF`;
                  var texto_Poseedor = 'NO existe Poseedor creado con este documento';
                  var valido_poseedor = 'NO';
                  $('#poseedor_vehiculo').show();
                }

                if (data.resultado.documento_propi_trailer === data.validar.Propietario_Trailer) {
                  var Propietario_trailer_existe = `#aed5c0`;
                  var texto_Propietario_trailer = 'Existe Propietario Trailer creado con este documento';
                  var valido_propietario_trailer = 'SI';
                  valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
                  valido_propietario === 'SI' ? $('#propietario_vehiculo').hide() : $('#propietario_vehiculo').show();
                  $('#propietario_trailer').hide();
                } else {
                  var Propietario_trailer_existe = `#FFFFFF`;
                  var texto_Propietario_trailer = 'NO existe Propietario Trailer creado con este documento';
                  var valido_propietario_trailer = 'NO';
                  $('#propietario_trailer').show();
                }

                $('#Lista_comprobacion').html(`
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                  <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                    <tr>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr style="background-color:${conductor_existe};border-bottom:1px solid #9FA6B2;">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${valido_conductor}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_conductor}</td>
                  </tr>
                  <tr style="background-color:${Propietario_existe};border-bottom:1px solid #9FA6B2;">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${valido_propietario}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario}</td>
                  </tr>
                  <tr style="background-color:${Poseedor_existe};border-bottom:1px solid #9FA6B2;">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${valido_poseedor}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
                  </tr>
                  <tr style="background-color:${Propietario_trailer_existe};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario Trailer</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${valido_propietario_trailer}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario_trailer}</td>
                  </tr>
                  </tbody>
                </table>`);
              }
            } else {
              if (data.resultado.documento_propietario === data.resultado.documento_poseedor && data.resultado.documento_conductor === data.resultado.documento_propietario) {
                $('.datos_val').hide();
                $('#actividades').show();
                $('#acciones').show();
                $('#frm_proveedores').css('display', 'block');
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#Proveedor').hide();

                if (
                  data.resultado.documento_propietario == data.validar.Propietario &&
                  data.resultado.documento_poseedor == data.validar.Poseedor &&
                  data.resultado.documento_conductor == data.validar.Conductor
                ) {
                  var terceros_existen = `#C8E6C9`;
                  var texto_terceros = 'Terceros ya cuentan con hojas de vida';
                  var validado_terceros = 'SI';
                  $('#Conductor').hide();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').hide();
                } else {
                  var terceros_existen = `#FFFFFF`;
                  var texto_terceros = 'Terceros no cuentan con hojas de vida';
                  var validado_terceros = 'NO';
                  $('#Conductor').show();
                  $('#propietario_vehiculo').show();
                  $('#poseedor_vehiculo').show();
                }

                $('#Lista_comprobacion').html(`
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                  <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                    <tr>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background-color:${terceros_existen};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Terceros</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${texto_terceros}</td>
                    </tr>
                  </tbody>
                </table>`);
              } else if (data.resultado.documento_propietario === data.resultado.documento_poseedor && data.resultado.documento_conductor !== data.resultado.documento_propietario) {
                $('.datos_val').hide();
                $('#actividades').show();
                $('#acciones').show();
                $('#frm_proveedores').css('display', 'block');
                $('#Proveedor').hide();

                if (data.resultado.documento_conductor == data.validar.Conductor) {
                  $conductor_existe = `#aed5c0`;
                  $texto = 'Conductor ya cuenta con hoja de vida';
                  $validado = 'SI';
                } else {
                  $texto = 'Conductor no cuenta con hoja de vida';
                  $validado = 'NO';
                }

                if (data.resultado.documento_propietario == data.validar.Propietario && data.resultado.documento_poseedor == data.validar.Poseedor) {
                  $propietario_existe = `#aed5c0`;
                  $texto_propieetario = 'Existen Propietario y Poseedor creados con este documento';
                  $validado_propietario = 'SI';
                  $('#Conductor').hide();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').hide();
                } else {
                  $propietario_existe = `#FFFFFF`;
                  $texto_propieetario = 'NO existen Propietario y Poseedor creados con este documento';
                  $validado_propietario = 'NO';
                  $('#Conductor').hide();
                  $('#propietario_vehiculo').show();
                  $('#poseedor_vehiculo').show();
                }

                $('#Lista_comprobacion').html(`
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                  <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                    <tr>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background-color:${$propietario_existe};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Poseedor</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_propietario}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_propieetario}</td>
                    </tr>
                    <tr style="background-color:${$conductor_existe};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${$validado}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${$texto}</td>
                    </tr>
                  </tbody>
                </table>`);
              } else if (data.resultado.documento_propietario === data.resultado.documento_conductor && data.resultado.documento_poseedor !== data.resultado.documento_propietario) {
                $('.datos_val').hide();
                $('#actividades').show();
                $('#acciones').show();
                $('#frm_proveedores').css('display', 'block');
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#propietario_trailer').hide();
                $('#Proveedor').hide();

                if (data.resultado.documento_propietario == data.validar.Propietario && data.resultado.documento_conductor == data.validar.Conductor) {
                  $terceros_existen = `#aed5c0`;
                  $texto_terceros = 'Existen Propietario y Conductor creados con este documento';
                  $validado_terceros = 'SI';
                  $('#Conductor').hide();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').hide();
                } else {
                  $terceros_existen = `#FFFFFF`;
                  $texto_terceros = 'NO existen Propietario y Conductor creados con este documento';
                  $validado_terceros = 'NO';
                  $('#Conductor').hide();
                  $('#propietario_vehiculo').show();
                  $('#poseedor_vehiculo').show();
                }

                if (data.resultado.documento_conductor == data.validar.Conductor) {
                  var Conductor_existe = `#C8E6C9`;
                  var texto_Conductor = 'Conductor ya cuentan con hoja de vida';
                  var validado_Conductor = 'SI';
                  $('#Conductor').hide();
                } else {
                  var Conductor_existe = `#FFFFFF`;
                  var texto_Conductor = 'Conductor no cuentan con hoja de vida';
                  var validado_Conductor = 'NO';
                  $('#Conductor').show();
                }

                $('#Lista_comprobacion').html(`
                  <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                    <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                      <tr>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="background-color:${$propietario_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Conductor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_terceros}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_terceros}</td>
                      </tr>
                      <tr style="background-color:${$Conductor_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_Conductor}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_Conductor}</td>
                      </tr>
                    </tbody>
                  </table>`);
              } else if (data.resultado.documento_poseedor === data.resultado.documento_conductor) {
                $('.datos_val').hide();
                $('#actividades').show();
                $('#acciones').show();
                $('#frm_proveedores').css('display', 'block');
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#propietario_trailer').hide();
                $('#Proveedor').hide();

                if (data.resultado.documento_poseedor == data.validar.Poseedor && data.resultado.documento_conductor == data.validar.Conductor) {
                  $terceros_existen = `#aed5c0`;
                  $texto_terceros = 'Existen Poseedor y Conductor creados con este documento';
                  $validado_terceros = 'SI';
                  $('#Conductor').hide();
                  $('#propietario_vehiculo').hide();
                  $('#poseedor_vehiculo').hide();
                } else {
                  $terceros_existen = `#FFFFFF`;
                  $texto_terceros = 'NO existen Poseedor y Conductor creados con este documento';
                  $validado_terceros = 'NO';
                  $('#Conductor').hide();
                  $('#propietario_vehiculo').show();
                  $('#poseedor_vehiculo').show();
                }

                if (data.resultado.documento_propietario == data.validar.Propietario) {
                  var Poseedor_existe = `#C8E6C9`;
                  var texto_Poseedor = 'Conductor ya cuentan con hoja de vida';
                  var validado_Poseedor = 'SI';
                  $('#poseedor_vehiculo').hide();
                } else {
                  var Poseedor_existe = `#FFFFFF`;
                  var texto_Poseedor = 'Conductor no cuentan con hoja de vida';
                  var validado_Poseedor = 'NO';
                  $('#poseedor_vehiculo').show();
                }

                $('#Lista_comprobacion').html(`
                  <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                    <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                      <tr>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="background-color:${$propietario_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Conductor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_terceros}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_terceros}</td>
                      </tr>
                      <tr style="background-color:${$Poseedor_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_Poseedor}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_Poseedor}</td>
                      </tr>
                    </tbody>
                  </table>`);
              } else {
                $('.datos_val').hide();
                $('#actividades').show();
                $('#acciones').show();
                $('#frm_proveedores').css('display', 'block');
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#Proveedor').hide();
                $('#propietario_trailer').hide();

                if (data.resultado.documento_conductor == data.validar.Conductor) {
                  var conductor_existe = `#aed5c0`;
                  var texto_conductor = 'Existe Conductor creado con este documento';
                  var valido_conductor = 'SI';
                  $('#Conductor').hide();
                } else {
                  var conductor_existe = `#FFFFFF`;
                  var texto_conductor = 'NO existe Conductor creado con este documento';
                  var valido_conductor = 'NO';
                  $('#Conductor').show();
                }

                if (data.resultado.documento_propietario == data.validar.Propietario) {
                  var Propietario_existe = `#aed5c0`;
                  var texto_Propietario = 'Existe Propietario creado con este documento';
                  var valido_propietario = 'SI';
                  valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
                  $('#propietario_vehiculo').hide();
                } else {
                  var Propietario_existe = `#FFFFFF`;
                  var texto_Propietario = 'NO existe Propietario creado con este documento';
                  var valido_propietario = 'NO';
                  $('#propietario_vehiculo').show();
                }

                if (data.resultado.documento_poseedor == data.validar.Poseedor) {
                  var Poseedor_existe = `#aed5c0`;
                  var texto_Poseedor = 'Existe Poseedor creado con este documento';
                  var valido_poseedor = 'SI';
                  valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
                  valido_propietario === 'SI' ? $('#propietario_vehiculo').hide() : $('#propietario_vehiculo').show();
                  $('#poseedor_vehiculo').hide();
                } else {
                  var Poseedor_existe = `#FFFFFF`;
                  var texto_Poseedor = 'NO existe Poseedor creado con este documento';
                  var valido_poseedor = 'NO';
                  $('#poseedor_vehiculo').show();
                }

                $('#Lista_comprobacion').html(`
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                  <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                    <tr>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr style="background-color:${conductor_existe};border-bottom:1px solid #9FA6B2;">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${valido_conductor}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_conductor}</td>
                  </tr>
                  <tr style="background-color:${Propietario_existe};border-bottom:1px solid #9FA6B2;">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${valido_propietario}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario}</td>
                  </tr>
                  <tr style="background-color:${Poseedor_existe};border-bottom:1px solid #9FA6B2;">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${valido_poseedor}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
                  </tr>
                  </tbody>
                </table>`);
              }
            }
          } else if (data.resultado.propietario === '1' && data.resultado.poseedor === '1' && data.resultado.conductor === '0' && data.resultado.trailer === '1') {
            // return docPropietario !== docPoseedor && docPropietario !== docPropiTrailer && docPoseedor !== docPropiTrailer;
            if (
              data.resultado.documento_propietario === data.resultado.documento_poseedor &&
              data.resultado.documento_propietario === data.resultado.documento_propi_trailer &&
              data.resultado.documento_poseedor === data.resultado.documento_propi_trailer
            ) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#Proveedor').hide();
              $('#propietario_trailer').show();
              if (
                data.resultado.documento_propietario == data.validar.Propietario &&
                data.resultado.documento_poseedor == data.validar.Poseedor &&
                data.resultado.documento_conductor == data.validar.Conductor &&
                data.resultado.documento_propi_trailer == data.validar.Propietario_trailer
              ) {
                var terceros_existen = `#C8E6C9`;
                var texto_terceros = 'Terceros ya cuentan con hojas de vida';
                var validado_terceros = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              } else {
                var terceros_existen = `#FFFFFF`;
                var texto_terceros = 'Terceros no cuentan con hojas de vida';
                var validado_terceros = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#propietario_trailer').show();
              }

              $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background-color:${terceros_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Terceros</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_terceros}</td>
                  </tr>
                </tbody>
              </table>`);
            } else if (data.resultado.documento_propietario === data.resultado.documento_poseedor) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#Proveedor').hide();
              $('#propietario_trailer').show();

              if (data.resultado.documento_propietario == data.validar.Propietario && data.resultado.documento_poseedor == data.validar.Poseedor) {
                var terceros_existen = `#C8E6C9`;
                var texto_terceros = 'Terceros ya cuentan con hojas de vida';
                var validado_terceros = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              } else {
                var terceros_existen = `#FFFFFF`;
                var texto_terceros = 'Terceros no cuentan con hojas de vida';
                var validado_terceros = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#propietario_trailer').show();
              }

              if (data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                var Propietario_Trailer_existe = `#C8E6C9`;
                var texto_propietario_trailer = 'Propietario Trailer ya cuentan con hoja de vida';
                var validado_Propietario_trailer = 'SI';
                $('#propietario_trailer').hide();
              } else {
                var Propietario_Trailer_existe = `#FFFFFF`;
                var texto_propietario_trailer = 'Propietario Trailer no cuentan con hoja de vida';
                var validado_Propietario_trailer = 'NO';
                $('#propietario_trailer').show();
              }

              $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background-color:${terceros_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Poseedor</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_terceros}</td>
                  </tr>
                  <tr style="background-color:${Propietario_Trailer_existe};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario Trailer</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario_trailer}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_propietario_trailer}</td>
                  </tr>
                </tbody>
              </table>`);
            } else if (data.resultado.documento_propietario === data.resultado.documento_propi_trailer) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#propietario_trailer').hide();

              if (data.resultado.documento_propietario == data.validar.Propietario && data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                var terceros_existen = `#C8E6C9`;
                var texto_terceros = 'Terceros ya cuentan con hojas de vida';
                var validado_terceros = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              } else {
                var terceros_existen = `#FFFFFF`;
                var texto_terceros = 'Terceros no cuentan con hojas de vida';
                var validado_terceros = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#propietario_trailer').show();
              }

              if (data.resultado.documento_poseedor == data.validar.Poseedor) {
                var Poseedor_existe = `#C8E6C9`;
                var texto_Poseedor = 'Poseedor ya cuentan con hoja de vida';
                var validado_Poseedor = 'SI';
                $('#poseedor_vehiculo').hide();
              } else {
                var Poseedor_existe = `#FFFFFF`;
                var texto_Poseedor = 'Poseedor no cuentan con hoja de vida';
                var validado_Poseedor = 'NO';
                $('#poseedor_vehiculo').show();
              }

              $('#Lista_comprobacion').html(`
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                  <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                    <tr>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background-color:${terceros_existen};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Propietario Trailer</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${texto_terceros}</td>
                    </tr>

                    <tr style="background-color:${Poseedor_existe};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Poseedor}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
                    </tr>
                  </tbody>
                </table>`);
            } else if (data.resultado.documento_poseedor === data.resultado.documento_propi_trailer) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#propietario_trailer').hide();

              if (data.resultado.documento_poseedor == data.validar.Poseedor && data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                var terceros_existen = `#C8E6C9`;
                var texto_terceros = 'Terceros ya cuentan con hojas de vida';
                var validado_terceros = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              } else {
                var terceros_existen = `#FFFFFF`;
                var texto_terceros = 'Terceros no cuentan con hojas de vida';
                var validado_terceros = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#propietario_trailer').show();
              }

              if (data.resultado.documento_propietario == data.validar.Propietario) {
                var Propietario_existe = `#C8E6C9`;
                var texto_propietario = 'Propietario Trailer ya cuentan con hoja de vida';
                var validado_Propietario = 'SI';
                $('#propietario_trailer').hide();
              } else {
                var Propietario_existe = `#FFFFFF`;
                var texto_propietario = 'Propietario Trailer no cuentan con hoja de vida';
                var validado_Propietario = 'NO';
                $('#propietario_trailer').show();
              }

              $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background-color:${terceros_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario Trailer & Poseedor</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_terceros}</td>
                  </tr>
                  <tr style="background-color:${Propietario_existe};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_propietario}</td>
                  </tr>
                </tbody>
              </table>`);
            } else {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#propietario_trailer').hide();

              if (data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                var Propietario_Trailer_existe = `#aed5c0`;
                var texto_Propietario_Trailer = 'Existe Propietario Trailer creado con este documento';
                var valido_Propietario_Trailer = 'SI';
                $('#propietario_trailer').hide();
              } else {
                var Propietario_Trailer_existe = `#FFFFFF`;
                var texto_Propietario_Trailer = 'NO existe Propietario Trailer creado con este documento';
                var valido_Propietario_Trailer = 'NO';
                $('#propietario_trailer').show();
              }

              if (data.resultado.documento_propietario == data.validar.Propietario) {
                var Propietario_existe = `#aed5c0`;
                var texto_Propietario = 'Existe Propietario creado con este documento';
                var valido_propietario = 'SI';
                valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
                $('#propietario_vehiculo').hide();
              } else {
                var Propietario_existe = `#FFFFFF`;
                var texto_Propietario = 'NO existe Propietario creado con este documento';
                var valido_propietario = 'NO';
                $('#propietario_vehiculo').show();
              }

              if (data.resultado.documento_poseedor == data.validar.Poseedor) {
                var Poseedor_existe = `#aed5c0`;
                var texto_Poseedor = 'Existe Poseedor creado con este documento';
                var valido_poseedor = 'SI';
                valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
                valido_propietario === 'SI' ? $('#propietario_vehiculo').hide() : $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').hide();
              } else {
                var Poseedor_existe = `#FFFFFF`;
                var texto_Poseedor = 'NO existe Poseedor creado con este documento';
                var valido_poseedor = 'NO';
                $('#poseedor_vehiculo').show();
              }

              $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${Propietario_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_propietario}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario}</td>
                </tr>
                <tr style="background-color:${Poseedor_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_poseedor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
                </tr>
                <tr style="background-color:${Propietario_Trailer_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario Trailer|</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_Propietario_Trailer}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario_Trailer}</td>
                </tr>
                </tbody>
              </table>`);
            }
          } else if (data.resultado.propietario === '1' && data.resultado.poseedor === '0' && data.resultado.conductor === '1' && data.resultado.trailer === '1') {
            if (
              data.resultado.documento_propietario === data.resultado.documento_conductor &&
              data.resultado.documento_propietario === data.resultado.documento_propi_trailer &&
              data.resultado.documento_conductor === data.resultado.documento_propi_trailer
            ) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#Proveedor').hide();
              $('#propietario_trailer').show();

              if (
                data.resultado.documento_propietario == data.validar.Propietario &&
                data.resultado.documento_conductor == data.validar.Conductor &&
                data.resultado.documento_propi_trailer == data.validar.Propietario_trailer
              ) {
                var terceros_existen = `#C8E6C9`;
                var texto_terceros = 'Terceros ya cuentan con hojas de vida';
                var validado_terceros = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              } else {
                var terceros_existen = `#FFFFFF`;
                var texto_terceros = 'Terceros no cuentan con hojas de vida';
                var validado_terceros = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#propietario_trailer').show();
              }

              $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background-color:${terceros_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Terceros</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_terceros}</td>
                  </tr>
                </tbody>
              </table>`);
            } else if (data.resultado.documento_propietario === data.resultado.documento_conductor) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#Proveedor').hide();
              $('#propietario_trailer').show();

              if (data.resultado.documento_propietario == data.validar.Propietario && data.resultado.documento_conductor == data.validar.Conductor) {
                var terceros_existen = `#C8E6C9`;
                var texto_terceros = 'Propietario & Conductor ya cuentan con hojas de vida';
                var validado_terceros = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
              } else {
                var terceros_existen = `#FFFFFF`;
                var texto_terceros = 'Propietario & Conductor no cuentan con hojas de vida';
                var validado_terceros = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
              }
              if (data.resultado.documento_propi_trailer == data.validar.Propietario_trailer) {
                var Propietario_Trailer_existen = `#C8E6C9`;
                var texto_Propietario_Trailer = 'Propietario & Conductor ya cuentan con hojas de vida';
                var validado_Propietario_Trailer = 'SI';
                $('#propietario_trailer').hide();
              } else {
                var Propietario_Trailer_existen = `#FFFFFF`;
                var texto_Propietario_Trailer = 'Propietario & Conductor no cuentan con hojas de vida';
                var validado_Propietario_Trailer = 'NO';
                $('#propietario_trailer').show();
              }

              $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background-color:${terceros_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Conductor</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_terceros}</td>
                  </tr>
                  <tr style="background-color:${Propietario_Trailer_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario Trailer</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario_Trailer}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario_Trailer}</td>
                  </tr>
                </tbody>
              </table>`);
            } else if (data.resultado.documento_propietario === data.resultado.documento_propi_trailer) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#Proveedor').hide();
              $('#propietario_trailer').hide();
              if (data.resultado.documento_propietario == data.validar.Propietario && data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                var terceros_existen = `#C8E6C9`;
                var texto_terceros = 'Propietario & Propietaro Trailer ya cuentan con hojas de vida';
                var validado_terceros = 'SI';
                $('#propietario_vehiculo').hide();
                $('#propietario_trailer').hide();
              } else {
                var terceros_existen = `#FFFFFF`;
                var texto_terceros = 'Propietario & Propietaro Trailer no cuentan con hojas de vida';
                var validado_terceros = 'NO';
                $('#propietario_vehiculo').show();
                $('#propietario_trailer').show();
              }
              if (data.resultado.documento_conductor === data.validar.Conductor) {
                var Conductor_existen = `#C8E6C9`;
                var texto_Conductor = 'Propietario & Conductor ya cuentan con hojas de vida';
                var validado_Conductor = 'SI';
                $('#propietario_trailer').hide();
              } else {
                var Conductor_existen = `#FFFFFF`;
                var texto_Conductor = 'Propietario & Conductor no cuentan con hojas de vida';
                var validado_Conductor = 'NO';
                $('#propietario_trailer').show();
              }

              $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background-color:${terceros_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Propietario Trailer</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_terceros}</td>
                  </tr>
                  <tr style="background-color:${Conductor_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Conductor}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Conductor}</td>
                  </tr>
                </tbody>
              </table>`);
            } else if (data.resultado.documento_conductor == data.resultado.documento_propi_trailer) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#Proveedor').hide();
              $('#propietario_trailer').hide();

              if (data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer && data.resultado.documento_conductor == data.validar.Conductor) {
                var terceros_existen = `#C8E6C9`;
                var texto_terceros = 'Conductor & Propietario Trailer ya cuentan con hojas de vida';
                var validado_terceros = 'SI';
                $('#propietario_trailer').hide();
                $('#propietario_vehiculo').hide();
              } else {
                var terceros_existen = `#FFFFFF`;
                var texto_terceros = 'Conductor & Propietario Trailer no cuentan con hojas de vida';
                var validado_terceros = 'NO';
                $('#propietario_trailer').show();
                $('#propietario_vehiculo').show();
              }

              if (data.resultado.documento_propietario == data.validar.Propietario) {
                var Propietario_existen = `#C8E6C9`;
                var texto_Propietario = 'Propietario ya cuentan con hojas de vida';
                var validado_Propietario = 'SI';
                $('#propietario_vehiculo').hide();
              } else {
                var Propietario_existen = `#FFFFFF`;
                var texto_Propietario = 'Propietario no cuentan con hojas de vida';
                var validado_Propietario = 'NO';
                $('#propietario_vehiculo').show();
              }

              $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background-color:${terceros_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Conductor & Propietario Trailer</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_terceros}</td>
                  </tr>
                  <tr style="background-color:${Propietario_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario}</td>
                  </tr>
                </tbody>
              </table>`);
            } else {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#Proveedor').hide();
              $('#propietario_trailer').hide();

              if (data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                var Propietario_Trailer_existe = `#aed5c0`;
                var texto_Propietario_Trailer = 'Existe Propietario Trailer creado con este documento';
                var valido_Propietario_Trailer = 'SI';
                $('#propietario_trailer').hide();
              } else {
                var Propietario_Trailer_existe = `#FFFFFF`;
                var texto_Propietario_Trailer = 'NO existe Propietario Trailer creado con este documento';
                var valido_Propietario_Trailer = 'NO';
                $('#propietario_trailer').show();
              }

              if (data.resultado.documento_propietario == data.validar.Propietario) {
                var Propietario_existe = `#aed5c0`;
                var texto_Propietario = 'Existe Propietario creado con este documento';
                var valido_propietario = 'SI';
                valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
                $('#propietario_vehiculo').hide();
              } else {
                var Propietario_existe = `#FFFFFF`;
                var texto_Propietario = 'NO existe Propietario creado con este documento';
                var valido_propietario = 'NO';
                $('#propietario_vehiculo').show();
              }

              if (data.resultado.documento_conductor == data.validar.Conductor) {
                var Conductor_existe = `#aed5c0`;
                var texto_Conductor = 'Existe Poseedor creado con este documento';
                var valido_Conductor = 'SI';
                valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
                valido_propietario === 'SI' ? $('#propietario_vehiculo').hide() : $('#propietario_vehiculo').show();
                $('#Conductor').hide();
              } else {
                var Conductor_existe = `#FFFFFF`;
                var texto_Conductor = 'NO existe Poseedor creado con este documento';
                var valido_Conductor = 'NO';
                $('#Conductor').show();
              }

              $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${Propietario_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_propietario}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario}</td>
                </tr>
                <tr style="background-color:${Conductor_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_Conductor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
                </tr>
                <tr style="background-color:${Propietario_Trailer_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario Trailer|</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_Propietario_Trailer}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario_Trailer}</td>
                </tr>
                </tbody>
              </table>`);
            }
          } else if (data.resultado.propietario === '0' && data.resultado.poseedor === '1' && data.resultado.conductor === '1' && data.resultado.trailer === '1') {
            if (
              data.resultado.documento_poseedor === data.resultado.documento_propi_trailer &&
              data.resultado.documento_poseedor === data.resultado.documento_conductor &&
              data.resultado.documento_conductor === data.resultado.documento_propi_trailer
            ) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#Proveedor').hide();
              $('#propietario_trailer').hide();

              if (
                data.resultado.documento_poseedor == data.validar.Poseedor &&
                data.resultado.documento_conductor == data.validar.Conductor &&
                data.resultado.documento_propi_trailer == data.validar.Propietario_trailer
              ) {
                var terceros_existen = `#C8E6C9`;
                var texto_terceros = 'Terceros ya cuentan con hojas de vida';
                var validado_terceros = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              } else {
                var terceros_existen = `#FFFFFF`;
                var texto_terceros = 'Terceros no cuentan con hojas de vida';
                var validado_terceros = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#propietario_trailer').show();
              }

              $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background-color:${terceros_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Terceros</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_terceros}</td>
                  </tr>
                </tbody>
              </table>`);
            } else if (data.resultado.documento_poseedor === data.resultado.documento_conductor) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').show();
              $('#Proveedor').hide();
              $('#propietario_trailer').hide();

              if (data.resultado.documento_poseedor == data.validar.Poseedor && data.resultado.documento_conductor == data.validar.Conductor) {
                var terceros_existen = `#C8E6C9`;
                var texto_terceros = 'Terceros ya cuentan con hojas de vida';
                var validado_terceros = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              } else {
                var terceros_existen = `#FFFFFF`;
                var texto_terceros = 'Terceros no cuentan con hojas de vida';
                var validado_terceros = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#propietario_trailer').show();
              }

              if (data.resultado.documento_propi_trailer == data.validar.Propietario_trailer) {
                var Propietario_Trailer_existen = `#C8E6C9`;
                var texto_Propietario_Trailer = 'Propietario Trailer ya cuentan con hojas de vida';
                var validado_Propietario_Trailer = 'SI';
                $('#propietario_trailer').hide();
              } else {
                var Propietario_Trailer_existen = `#FFFFFF`;
                var texto_Propietario_Trailer = 'Propietario Trailer no cuentan con hojas de vida';
                var validado_Propietario_Trailer = 'NO';
                $('#propietario_trailer').show();
              }

              $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background-color:${terceros_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Terceros</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_terceros}</td>
                  </tr>
                  <tr style="background-color:${Propietario_Trailer_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario Trailer</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario_Trailer}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario_Trailer}</td>
                  </tr>
                </tbody>
              </table>`);
            } else if (data.resultado.documento_poseedor == data.resultado.documento_propi_trailer) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').show();
              $('#Proveedor').hide();
              $('#propietario_trailer').hide();

              if (data.resultado.documento_poseedor == data.validar.Poseedor && data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                var terceros_existen = `#C8E6C9`;
                var texto_terceros = 'Terceros ya cuentan con hojas de vida';
                var validado_terceros = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              } else {
                var terceros_existen = `#FFFFFF`;
                var texto_terceros = 'Terceros no cuentan con hojas de vida';
                var validado_terceros = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#propietario_trailer').show();
              }

              if (data.resultado.documento_conductor == data.validar.Conductor) {
                var Conductor_existen = `#C8E6C9`;
                var texto_Conductor = 'Conductor ya cuentan con hojas de vida';
                var validado_Conductor = 'SI';
                $('#propietario_trailer').hide();
              } else {
                var Conductor_existen = `#FFFFFF`;
                var texto_Conductor = 'Conductor no cuentan con hojas de vida';
                var validado_Conductor = 'NO';
                $('#propietario_trailer').show();
              }

              $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background-color:${terceros_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Terceros</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_terceros}</td>
                  </tr>
                  <tr style="background-color:${Conductor_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Conductor}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Conductor}</td>
                  </tr>
                </tbody>
              </table>`);
            } else if (data.resultado.documento_conductor == data.resultado.documento_propi_trailer) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#propietario_trailer').show();

              if (data.resultado.documento_conductor == data.validar.Conductor && data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                var terceros_existen = `#C8E6C9`;
                var texto_terceros = 'Terceros ya cuentan con hojas de vida';
                var validado_terceros = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              } else {
                var terceros_existen = `#FFFFFF`;
                var texto_terceros = 'Terceros no cuentan con hojas de vida';
                var validado_terceros = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#propietario_trailer').show();
              }

              if (data.resultado.documento_poseedor == data.validar.Poseedor) {
                var Poseedor_existen = `#C8E6C9`;
                var texto_Poseedor = 'Poseedor ya cuentan con hojas de vida';
                var validado_Poseedor = 'SI';
                $('#poseedor_vehiculo').hide();
              } else {
                var Poseedor_existen = `#FFFFFF`;
                var texto_Poseedor = 'Poseedor no cuentan con hojas de vida';
                var validado_Poseedor = 'NO';
                $('#poseedor_vehiculo').show();
              }

              $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background-color:${terceros_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Terceros</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_terceros}</td>
                  </tr>
                  <tr style="background-color:${Poseedor_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Poseedor}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
                  </tr>
                </tbody>
              </table>`);
            } else {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#propietario_trailer').hide();
              $('#Proveedor').hide();

              if (data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                var Propietario_Trailer_existe = `#aed5c0`;
                var texto_Propietario_Trailer = 'Existe Propietario Trailer creado con este documento';
                var valido_Propietario_Trailer = 'SI';
                $('#propietario_trailer').hide();
              } else {
                var Propietario_Trailer_existe = `#FFFFFF`;
                var texto_Propietario_Trailer = 'NO existe Propietario Trailer creado con este documento';
                var valido_Propietario_Trailer = 'NO';
                $('#propietario_trailer').show();
              }

              if (data.resultado.documento_poseedor == data.validar.Poseedor) {
                var Poseedor_existe = `#aed5c0`;
                var texto_Poseedor = 'Existe Propietario creado con este documento';
                var valido_Poseedor = 'SI';
                valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
                $('#propietario_vehiculo').hide();
              } else {
                var Poseedor_existe = `#FFFFFF`;
                var texto_Poseedor = 'NO existe Propietario creado con este documento';
                var valido_Poseedor = 'NO';
                $('#propietario_vehiculo').show();
              }

              if (data.resultado.documento_conductor == data.validar.Conductor) {
                var Conductor_existe = `#aed5c0`;
                var texto_Conductor = 'Existe Poseedor creado con este documento';
                var valido_Conductor = 'SI';
                valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
                valido_propietario === 'SI' ? $('#propietario_vehiculo').hide() : $('#propietario_vehiculo').show();
                $('#Conductor').hide();
              } else {
                var Conductor_existe = `#FFFFFF`;
                var texto_Conductor = 'NO existe Poseedor creado con este documento';
                var valido_Conductor = 'NO';
                $('#Conductor').show();
              }

              $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${Poseedor_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_Poseedor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
                </tr>
                <tr style="background-color:${Conductor_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_Conductor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
                </tr>
                <tr style="background-color:${Propietario_Trailer_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario Trailer|</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_Propietario_Trailer}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario_Trailer}</td>
                </tr>
                </tbody>
              </table>`);
            }
          } else if (data.resultado.propietario === '1' && data.resultado.poseedor === '1' && data.resultado.conductor === '1' && data.resultado.trailer === '0') {
            if (data.resultado.documento_propietario == data.resultado.documento_poseedor) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').hide();
              $('#Proveedor').hide();

              if (data.resultado.documento_poseedor == data.validar.Poseedor && data.resultado.documento_propietario == data.validar.Propietario) {
                var terceros_existen = `#C8E6C9`;
                var texto_terceros = 'Propietario & Poseedor ya cuentan con hojas de vida';
                var validado_terceros = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              } else {
                var terceros_existen = `#FFFFFF`;
                var texto_terceros = 'Propietario & Poseedor no cuentan con hojas de vida';
                var validado_terceros = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#propietario_trailer').show();
              }

              $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background-color:${terceros_existen};">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Poseedor</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_terceros}</td>
                  </tr>
                </tbody>
              </table>`);
            } else {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').hide();
              $('#Proveedor').hide();

              if (data.resultado.documento_propietario == data.resultado.documento_propietario) {
                var propietario_existe = `#aed5c0`;
                var texto_propieetario = 'Existen Propietario creados con este documento';
                var validado_propietario = 'SI';
              } else {
                var propietario_existe = `#FFFFFF`;
                var texto_propieetario = 'NO existe Propietario creados con este documento';
                var validado_propietario = 'NO';
              }
              if (data.resultado.documento_poseedor == data.resultado.Poseedor) {
                var poseedor_existe = `#aed5c0`;
                var texto_poseedor = 'Existen Poseedor creados con este documento';
                var validado_Poseedor = 'SI';
              } else {
                var poseedor_existe = `#FFFFFF`;
                var texto_poseedor = 'NO existe Poseedor creados con este documento';
                var validado_Poseedor = 'NO';
              }

              $('#Lista_comprobacion').html(`
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                  <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                    <tr>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr style="background-color:${propietario_existe};" >
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_propietario}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_propieetario}</td>
                  </tr>
                  <tr style="background-color:${poseedor_existe};" >
                    <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${texto_poseedor}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Poseedor}</td>
                  </tr>
                  </tbody>
                </table>`);
            }
          } else if (data.resultado.propietario === '0' && data.resultado.poseedor === '1' && data.resultado.conductor === '1' && data.resultado.trailer === '0') {
            if (data.resultado.documento_poseedor === data.resultado.documento_conductor) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').show();
              $('#Proveedor').hide();

              if (data.resultado.documento_poseedor == data.validar.Poseedor && data.resultado.documento_conductor == data.validar.Conductor) {
                $terceros_existen = `#aed5c0`;
                $texto_terceros = 'Existen Poseedor y Conductor creados con este documento';
                $validado_terceros = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
              } else {
                $terceros_existen = `#FFFFFF`;
                $texto_terceros = 'NO existen Poseedor y Conductor creados con este documento';
                $validado_terceros = 'NO';
                $('#Conductor').hide();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
              }

              $('#Lista_comprobacion').html(`
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                  <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                    <tr>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background-color:${$propietario_existe};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor & Conductor</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_terceros}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_terceros}</td>
                    </tr>
                  </tbody>
                </table>`);
            } else {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').show();
              $('#Proveedor').hide();

              if (data.resultado.documento_poseedor == data.validar.Poseedor) {
                var poseedor_existen = `#aed5c0`;
                var texto_poseedor = 'Existen Poseedor y Conductor creados con este documento';
                var validado_poseedor = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
              } else {
                var poseedor_existen = `#FFFFFF`;
                var texto_poseedor = 'NO existen Poseedor y Conductor creados con este documento';
                var validado_poseedor = 'NO';
                $('#Conductor').hide();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
              }

              if (data.resultado.documento_conductor == data.validar.Conductor) {
                var Conductor_existen = `#aed5c0`;
                var texto_Conductor = 'Existen Poseedor y Conductor creados con este documento';
                var validado_Conductor = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
              } else {
                var Conductor_existen = `#FFFFFF`;
                var texto_Conductor = 'NO existen Poseedor y Conductor creados con este documento';
                var validado_Conductor = 'NO';
                $('#Conductor').hide();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
              }

              $('#Lista_comprobacion').html(`
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                  <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                    <tr>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background-color:${poseedor_existen};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${validado_poseedor}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${texto_poseedor}</td>
                    </tr>
                    <tr style="background-color:${Conductor_existen};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor & Conductor</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Conductor}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Conductor}</td>
                    </tr>
                  </tbody>
                </table>`);
            }
          } else if (data.resultado.propietario === '0' && data.resultado.poseedor === '0' && data.resultado.conductor === '1' && data.resultado.trailer === '1') {
            if (data.resultado.documento_conductor === data.resultado.documento_propi_trailer) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').show();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#Proveedor').hide();
              $('#propietario_trailer').show();

              if (data.resultado.documento_conductor == data.validar.Conductor && data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                $terceros_existen = `#aed5c0`;
                $texto_terceros = 'Existen Propietario Trailer y Conductor creados con este documento';
                $validado_terceros = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              } else {
                $terceros_existen = `#FFFFFF`;
                $texto_terceros = 'NO existen Propietario Trailer y Conductor creados con este documento';
                $validado_terceros = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').show();
              }

              $('#Lista_comprobacion').html(`
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                  <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                    <tr>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background-color:${$propietario_existe};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Propietario Trailer & Conductor</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_terceros}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_terceros}</td>
                    </tr>
                  </tbody>
                </table>`);
            } else {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').show();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#Proveedor').hide();
              $('#propietario_trailer').hide();

              if (data.resultado.documento_conductor == data.validar.Conductor) {
                var Conductor_existen = `#aed5c0`;
                var texto_Conductor = 'Existen Conductor creados con este documento';
                var validado_Conductor = 'SI';
                $('#Conductor').hide();
              } else {
                var Conductor_existen = `#FFFFFF`;
                var texto_Conductor = 'NO existen Conductor creados con este documento';
                var validado_Conductor = 'NO';
                $('#Conductor').show();
              }

              if (data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                var Propietario_Trailer_existen = `#aed5c0`;
                var texto_Propietario_Trailer = 'Existen Propietario Trailer creados con este documento';
                var validado_Propietario_Trailer = 'SI';
                $('#propietario_trailer').hide();
              } else {
                var Propietario_Trailer_existen = `#FFFFFF`;
                var texto_Propietario_Trailer = 'NO existen Propietario Trailer creados con este documento';
                var validado_Propietario_Trailer = 'NO';
                $('#propietario_trailer').show();
              }

              $('#Lista_comprobacion').html(`
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                  <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                    <tr>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background-color:${Conductor_existen};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Conductor}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Conductor}</td>
                    </tr>
                    <tr style="background-color:${Propietario_Trailer_existen};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Propietario Trailer</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario_Trailer}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario_Trailer}</td>
                    </tr>
                  </tbody>
                </table>`);
            }
          } else if (data.resultado.propietario === '1' && data.resultado.poseedor === '0' && data.resultado.conductor === '1' && data.resultado.trailer === '0') {
            if (data.resultado.documento_propietario === data.resultado.documento_conductor) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').show();
              $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').show();
              $('#propietario_trailer').hide();
              $('#Proveedor').hide();

              if (data.resultado.documento_propietario == data.validar.Propietario && data.resultado.documento_conductor == data.validar.Conductor) {
                $terceros_existen = `#aed5c0`;
                $texto_terceros = 'Existen Propietario y Conductor creados con este documento';
                $validado_terceros = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              } else {
                $terceros_existen = `#FFFFFF`;
                $texto_terceros = 'NO existen Propietario y Conductor creados con este documento';
                $validado_terceros = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              }

              $('#Lista_comprobacion').html(`
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                  <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                    <tr>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background-color:${$propietario_existe};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Conductor</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_terceros}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_terceros}</td>
                    </tr>
                  </tbody>
                </table>`);
            } else {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').show();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#propietario_trailer').hide();
              $('#Proveedor').hide();

              if (data.resultado.documento_propietario == data.validar.Propietario) {
                var Propietario_existen = `#aed5c0`;
                var Texto_Propietario = 'Existen Propietario creados con este documento';
                var validado_Propietario = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              } else {
                var Propietario_existen = `#FFFFFF`;
                var Texto_Propietario = 'NO existen Propietario creados con este documento';
                var validado_Propietario = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              }

              if (data.resultado.documento_conductor == data.validar.Conductor) {
                var Conductor_existen = `#aed5c0`;
                var texto_Conductor = 'Existen Conductor creados con este documento';
                var validado_Conductor = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              } else {
                var Conductor_existen = `#FFFFFF`;
                var texto_Conductor = 'NO existen Conductor creados con este documento';
                var validado_Conductor = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              }

              $('#Lista_comprobacion').html(`
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                  <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                    <tr>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background-color:${Propietario_existen};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${Texto_Propietario}</td>
                    </tr>
                    <tr style="background-color:${Conductor_existen};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Conductor}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Conductor}</td>
                    </tr>
                  </tbody>
                </table>`);
            }
          } else if (data.resultado.propietario === '0' && data.resultado.poseedor === '1' && data.resultado.conductor === '0' && data.resultado.trailer === '1') {
            if (data.resultado.documento_poseedor === data.resultado.documento_propi_trailer) {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').show();
              $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').show();
              $('#propietario_trailer').hide();
              $('#Proveedor').hide();

              if (data.resultado.documento_poseedor == data.validar.Poseedor && data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                $terceros_existen = `#aed5c0`;
                $texto_terceros = 'Existen Propietario Trailer y Poseedor creados con este documento';
                $validado_terceros = 'SI';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
                $('#propietario_trailer').hide();
              } else {
                $terceros_existen = `#FFFFFF`;
                $texto_terceros = 'NO existen Propietario Trailer y Poseedor creados con este documento';
                $validado_terceros = 'NO';
                $('#Conductor').hide();
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').show();
                $('#propietario_trailer').show();
              }

              $('#Lista_comprobacion').html(`
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                  <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                    <tr>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background-color:${$propietario_existe};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Conductor</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_terceros}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_terceros}</td>
                    </tr>
                  </tbody>
                </table>`);
            } else {
              $('.datos_val').hide();
              $('#actividades').show();
              $('#acciones').show();
              $('#frm_proveedores').css('display', 'block');
              $('#Conductor').show();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#propietario_trailer').hide();
              $('#Proveedor').hide();

              if (data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
                var Propietario_Trailer_existen = `#aed5c0`;
                var Texto_Propietario_Trailer = 'Existen Propietario Trailer creados con este documento';
                var validado_Propietario_Trailer = 'SI';
                $('#propietario_trailer').hide();
              } else {
                var Propietario_Trailer_existen = `#FFFFFF`;
                var Texto_Propietario_Trailer = 'NO existen Propietario creados con este documento';
                var validado_Propietario_Trailer = 'NO';
                $('#propietario_trailer').show();
              }

              if (data.resultado.documento_poseedor == data.validar.Poseedor) {
                var Poseedor_existen = `#aed5c0`;
                var texto_Poseedor = 'Existen Poseedor creados con este documento';
                var validado_Poseedor = 'SI';
                $('#poseedor_vehiculo').hide();
              } else {
                var Poseedor_existen = `#FFFFFF`;
                var texto_Poseedor = 'NO existen Poseedor creados con este documento';
                var validado_Poseedor = 'NO';
                $('#poseedor_vehiculo').show();
              }

              $('#Lista_comprobacion').html(`
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                  <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                    <tr>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                      <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background-color:${Propietario_Trailer_existen};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Conductor</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_terceros}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${Texto_Propietario_Trailer}</td>
                    </tr>
                    <tr style="background-color:${Poseedor_existen};">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Conductor</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Poseedor}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
                    </tr>
                  </tbody>
                </table>`);
            }
          } else if (data.resultado.propietario === '1' && data.resultado.poseedor === '0' && data.resultado.conductor === '0' && data.resultado.trailer === '0') {
            $('.datos_val').hide();
            $('#actividades').show();
            $('#acciones').show();
            $('#frm_proveedores').css('display', 'block');
            $('#Conductor').hide();
            $('#propietario_vehiculo').show();
            $('#poseedor_vehiculo').hide();
            $('#Proveedor').hide();

            if (data.resultado.documento_propietario == data.validar.Propietario) {
              var Propietario_existe = `#C8E6C9`;
              var texto_Propietario = 'Propietario ya cuentan con hoja de vida';
              var validado_Propietario = 'SI';
              $('#propietario_vehiculo').hide();
            } else {
              var Propietario_existe = `#FFFFFF`;
              var texto_Propietario = 'Propietario no cuentan con hoja de vida';
              var validado_Propietario = 'NO';
              $('#propietario_vehiculo').show();
            }

            $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${Propietario_existe};" >
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario}</td>
                </tr>
                </tbody>
              </table>`);
          } else if (data.resultado.propietario === '0' && data.resultado.poseedor === '1' && data.resultado.conductor === '0' && data.resultado.trailer === '0') {
            $('.datos_val').hide();
            $('#actividades').show();
            $('#acciones').show();
            $('#frm_proveedores').css('display', 'block');
            $('#Conductor').hide();
            $('#propietario_vehiculo').hide();
            $('#poseedor_vehiculo').show();
            $('#Proveedor').hide();

            if (data.resultado.documento_poseedor == data.validar.Poseedor) {
              var Poseedor_existe = `#C8E6C9`;
              var texto_Poseedor = 'Poseedor ya cuentan con hoja de vida';
              var validado_Poseedor = 'SI';
              $('#poseedor_vehiculo').hide();
            } else {
              var Poseedor_existe = `#FFFFFF`;
              var texto_Poseedor = 'Poseedor no cuentan con hoja de vida';
              var validado_Poseedor = 'NO';
              $('#poseedor_vehiculo').show();
            }

            $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${Poseedor_existe};" >
                  <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Poseedor}</td>
                </tr>
                </tbody>
              </table>`);
          } else if (data.resultado.propietario === '0' && data.resultado.poseedor === '0' && data.resultado.conductor === '1' && data.resultado.trailer === '0') {
            $('.datos_val').hide();
            $('#actividades').show();
            $('#acciones').show();
            $('#frm_proveedores').css('display', 'block');
            $('#Conductor').show();
            $('#propietario_vehiculo').hide();
            $('#poseedor_vehiculo').hide();
            $('#Proveedor').hide();

            if (data.resultado.documento_conductor == data.validar.Conductor) {
              var Conductor_existe = `#C8E6C9`;
              var texto_Conductor = 'Conductor ya cuentan con hoja de vida';
              var validado_Conductor = 'SI';
              $('#Conductor').hide();
            } else {
              var Conductor_existe = `#FFFFFF`;
              var texto_Conductor = 'Conductor no cuentan con hoja de vida';
              var validado_Conductor = 'NO';
              $('#Conductor').show();
            }

            $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${Conductor_existe};" >
                  <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Conductor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Conductor}</td>
                </tr>
                </tbody>
              </table>`);
          } else if (data.resultado.propietario === '0' && data.resultado.poseedor === '0' && data.resultado.conductor === '0' && data.resultado.trailer === '1') {
            $('.datos_val').hide();
            $('#actividades').show();
            $('#acciones').show();
            $('#frm_proveedores').css('display', 'block');
            $('#Conductor').hide();
            $('#propietario_vehiculo').hide();
            $('#poseedor_vehiculo').hide();
            $('#Proveedor').hide();
            $('#propietario_trailer').show();

            if (data.resultado.documento_propi_trailer == data.validar.Propietario_Trailer) {
              var Propietario_Trailer_existe = `#C8E6C9`;
              var texto_Propietario_Trailer = 'Propietario Trailer ya cuentan con hoja de vida';
              var validado_Propietario_Trailer = 'SI';
              $('#propietario_trailer').hide();
            } else {
              var Propietario_Trailer_existe = `#FFFFFF`;
              var texto_Propietario_Trailer = 'Propietario Trailer no cuentan con hoja de vida';
              var validado_Propietario_Trailer = 'NO';
              $('#propietario_trailer').show();
            }

            $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${Propietario_Trailer_existe};" >
                  <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario_Trailer}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${validado_Propietario_Trailer}</td>
                </tr>
                </tbody>
              </table>`);
          }
          // else if (data.resultado.propietario === '1' && data.resultado.poseedor === '0' && data.resultado.conductor === '0' && data.resultado.trailer === '0') {
          //   $('.datos_val').hide();
          //   $('#actividades').show();
          //   $('#acciones').show();
          //   $('#frm_proveedores').css('display', 'block');
          //   $('#Conductor').show();
          //   $('#propietario_vehiculo').show();
          //   $('#poseedor_vehiculo').show();
          //   $('#Proveedor').hide();
          //   $('#propietario_trailer').show();
          // }
        }
      } catch (error) {
        console.error('Error en la segunda solicitud:', error);
        throw error;
      } finally {
        $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    } else if (operacion === 'Prefiltro Nuevo') {
      $('#loading-overlay-oet ').css('display', 'flex');
      let paquete = new FormData();
      paquete.append('estudio', estudio);
      try {
        const response = await fetch($('#id_url_ajax').val() + 'proveedores/Consulta_Recursos_Prefiltro', {
          method: 'POST',
          body: paquete,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          let datos_prefiltro = JSON.parse(sessionStorage.getItem('datos_valida'));
          datos_prefiltro['estudio'] = data.prefiltro.ESTUDIO;
          datos_prefiltro['operacion'] = operacion;
          sessionStorage.setItem('datos_valida', JSON.stringify(datos_prefiltro));
          if (
            (datos_prefiltro.propietario === datos_prefiltro.poseedor && datos_prefiltro.conductor === datos_prefiltro.propietario) ||
            datos_prefiltro.propietario === datos_prefiltro.propietarioTrailer
          ) {
            $('.datos_val').hide();
            $('#actividades').show();
            $('#acciones').show();
            $('#frm_proveedores').css('display', 'block');
            $('#Conductor').show();
            $('#propietario_vehiculo').show();
            $('#poseedor_vehiculo').show();
            $('#propietario_trailer').show();
            $('#Proveedor').hide();

            // Agrega un nuevo elemento al objeto JSON
            datos_prefiltro['elementos'] = 1;
            // Almacena el objeto JSON actualizado en sessionStorage
            sessionStorage.setItem('datos_valida', JSON.stringify(datos_prefiltro));
            if (datos_prefiltro.propietario === data.prefiltro.Propietario && datos_prefiltro.poseedor === data.prefiltro.Poseedor && datos_prefiltro.conductor === data.prefiltro.Conductor) {
              var terceros_existen = `#C8E6C9`;
              var texto_terceros = 'Terceros ya cuentan con hojas de vida';
              var validado_terceros = 'SI';
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').hide();
              $('#propietario_trailer').show();
            } else {
              var terceros_existen = `#FFFFFF`;
              var texto_terceros = 'Terceros no cuentan con hojas de vida';
              var validado_terceros = 'NO';
            }

            $('#Lista_comprobacion').html(`
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
              <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                <tr>
                  <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                  <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                  <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background-color:${terceros_existen};">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Terceros</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${validado_terceros}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_terceros}</td>
                </tr>
              </tbody>
            </table>`);
          } else if (datos_prefiltro.propietario === datos_prefiltro.poseedor && datos_prefiltro.conductor !== datos_prefiltro.propietario && datos_prefiltro.poseedor) {
            $('.datos_val').hide();
            $('#actividades').show();
            $('#acciones').show();
            $('#frm_proveedores').css('display', 'block');
            $('#Conductor').show();
            $('#propietario_vehiculo').show();
            $('#poseedor_vehiculo').show();
            $('#Proveedor').hide();
            // Agrega un nuevo elemento al objeto JSON
            datos_prefiltro['elementos'] = 2;
            // Almacena el objeto JSON actualizado en sessionStorage
            sessionStorage.setItem('datos_valida', JSON.stringify(datos_prefiltro));
            document.getElementById('num_element').innerHTML = datos_prefiltro.elementos;
            // Validar que el propietario del trailer este diligenciado para agregar la nueva validación
            if (datos_prefiltro.propietarioTrailer === '') {
              if (datos_prefiltro.conductor === data.prefiltro.Conductor && data.prefiltro.Conductor !== null) {
                var conductor_existe = '#C8E6C9';
                var texto = 'Conductor ya cuenta con hoja de vida';
                var validado = 'SI';
                $('#Conductor').hide();
              } else {
                var conductor_existe = '#FFFFFF';
                var texto = 'Conductor no cuenta con hoja de vida';
                var validado = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
              }

              if (datos_prefiltro.propietario === data.prefiltro.Propietario && datos_prefiltro.poseedor === data.prefiltro.Poseedor) {
                var propietario_existe = '#C8E6C9';
                var texto_propietario = 'Este documento es tanto propietario como poseedor del vehículo';
                var validado_propietario = 'SI'; // O podrías ajustar esto según lo necesites
                if ((validado = 'No')) {
                  $('#Conductor').show();
                } else {
                  $('#Conductor').hide();
                }
                $('#propietario_vehiculo').hide();
                $('#poseedor_vehiculo').hide();
              } else {
                var propietario_existe = '#FFFFFF';
                var texto_propietario = 'NO existen terceros creados con este documentos';
                var validado_propietario = 'NO';
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
              }
              // Hacer algo con las variables conductor_existe, texto, validado, propietario_existe, texto_propietario, validado_propietario
              // Por ejemplo, puedes mostrar estos valores en tu interfaz de usuario o hacer cualquier otra operación necesaria
              $('#Lista_comprobacion').html(`
                    <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                      <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                        <tr>
                          <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                          <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                          <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                        </tr>
                      </thead>
                      <tbody>
                      <tr style="background-color:${conductor_existe};">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto}</td>
                      </tr>
                      <tr style="background-color:${propietario_existe};border-top:1px solid #FFFFFF;">
                        <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Poseedor</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${validado_propietario}</td>
                        <td style="width: auto; white-space: nowrap;" class="text-center">${texto_propietario}</td>
                      </tr>
                      </tbody>
                    </table>`);
            } else {
              if (
                datos_prefiltro.propietario === datos_prefiltro.poseedor &&
                datos_prefiltro.propietario === datos_prefiltro.propietarioTrailer &&
                datos_prefiltro.poseedor === datos_prefiltro.propietarioTrailer
              ) {
                $('.datos_val').hide();
                $('#actividades').show();
                $('#acciones').show();
                $('#frm_proveedores').css('display', 'block');
                $('#Conductor').show();
                $('#propietario_vehiculo').show();
                $('#poseedor_vehiculo').show();
                $('#Proveedor').hide();
                if (datos_prefiltro.propietario === data.prefiltro.Propietario_Trailer && datos_prefiltro.poseedor === data.prefiltro.Propietario_Trailer) {
                  var propietario_poseedor_propietario_trailer_existe = `#aed5c0`;
                  var texto_propietario_poseedor_propietario_trailer = 'Existe Propietario,Poseedor y Propietario Trailer creado con este documento';
                  var valido_propietario_poseedor_propietario_trailer = 'SI';
                  // valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
                  // valido_propietario === 'SI' ? $('#propietario_vehiculo').hide() : $('#propietario_vehiculo').show();
                  $('#propietario_vehiculo').hide();
                  $('#propietario_trailer').hide();
                  $('#poseedor_vehiculo').hide();
                } else {
                  var propietario_poseedor_propietario_trailer_existe = `#FFFFFF`;
                  var texto_propietario_poseedor_propietario_trailer = 'No existe Propietario, Poseedor y Propietario Trailer creado con este documento';
                  var valido_propietario_poseedor_propietario_trailer = 'No';
                  $('#propietario_trailer').show();
                  $('#propietario_vehiculo').show();
                  $('#poseedor_vehiculo').show();
                }

                if (datos_prefiltro.conductor === data.prefiltro.Conductor) {
                  var conductor_existe = `#aed5c0`;
                  var texto_conductor = 'Existe Conductor creado con este documento';
                  var valido_conductor = 'SI';
                  $('#Conductor').hide();
                  // $('#propietario_vehiculo').show();
                  // $('#poseedor_vehiculo').show();
                } else {
                  var conductor_existe = `#FFFFFF`;
                  var texto_conductor = 'No existe Conductor creado con este documento';
                  var valido_conductor = 'NO';
                  $('#Conductor').show();
                  // $('#propietario_vehiculo').show();
                  // $('#poseedor_vehiculo').show();
                }

                $('#Lista_comprobacion').html(`
                  <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                    <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                      <tr>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                        <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                      </tr>
                    </thead>
                    <tbody>
    
                    <tr style="background-color:${propietario_poseedor_propietario_trailer_existe};border-bottom:1px solid #9FA6B2;">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Poseedor & Propietario Trailer</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${valido_propietario_poseedor_propietario_trailer}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${texto_propietario_poseedor_propietario_trailer}</td>
                    </tr>
    
                    <tr style="background-color:${conductor_existe};border-bottom:1px solid #9FA6B2;">
                      <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${valido_conductor}</td>
                      <td style="width: auto; white-space: nowrap;" class="text-center">${texto_conductor}</td>
                    </tr>
         
                    </tbody>
                  </table>`);
              } else {
                alert('ENTRO AQUI PARA EL ELSE');
              }
            }
          } else if (datos_prefiltro.propietario === datos_prefiltro.conductor && datos_prefiltro.poseedor !== datos_prefiltro.propietario) {
            $('.datos_val').hide();
            $('#actividades').show();
            $('#acciones').show();
            $('#frm_proveedores').css('display', 'block');
            $('#Conductor').show();
            $('#propietario_vehiculo').show();
            $('#poseedor_vehiculo').show();
            $('#Proveedor').hide();
            // Agrega un nuevo elemento al objeto JSON
            datos_prefiltro['elementos'] = 2;
            // Almacena el objeto JSON actualizado en sessionStorage
            sessionStorage.setItem('datos_valida', JSON.stringify(datos_prefiltro));
            document.getElementById('num_element').innerHTML = datos_prefiltro.elementos;

            if (datos_prefiltro.propietario === data.prefiltro.Propietario && datos_prefiltro.conductor === data.prefiltro.Conductor) {
              var propietario_conductor_existe = `#C8E6C9`;
              var texto_propieetario_conductor = 'Existen terceros creados con este documento';
              var validado_propietario_conductor = 'SI';
              $('#Conductor').hide();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').show();
            } else {
              var propietario_conductor_existe = `#FFFFFF`;
              var texto_propieetario_conductor = 'NO existen terceros creados con este documento';
              var validado_propietario_conductor = 'NO';
              $('#Conductor').show();
              $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').show();
            }

            if (datos_prefiltro.poseedor === data.prefiltro.Poseedor) {
              var proseedor_existe = `#C8E6C9`;
              var texto_poseedor = 'Existen terceros creados con este documento';
              var validado_proseedor = 'SI';
              $('#Conductor').show();
              $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').hide();
            } else {
              var proseedor_existe = `#FFFFFF`;
              var texto_poseedor = 'NO existen terceros creados con este documento';
              var validado_proseedor = 'NO';
              $('#Conductor').show();
              $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').show();
            }

            $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${propietario_conductor_existe};">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Conductor & Propietario</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${validado_propietario_conductor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_propieetario_conductor}</td>
                </tr>
                <tr style="background-color:${proseedor_existe};">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${validado_proseedor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_poseedor}</td>
                </tr>
                </tbody>
              </table>`);
          } else if (datos_prefiltro.poseedor === datos_prefiltro.conductor && datos_prefiltro.propietario !== datos_prefiltro.conductor) {
            $('.datos_val').hide();
            $('#actividades').show();
            $('#acciones').show();
            $('#frm_proveedores').css('display', 'block');
            $('#Conductor').show();
            $('#propietario_vehiculo').show();
            $('#poseedor_vehiculo').show();
            $('#Proveedor').hide();
            // Agrega un nuevo elemento al objeto JSON
            datos_prefiltro['elementos'] = 2;
            // Almacena el objeto JSON actualizado en sessionStorage
            sessionStorage.setItem('datos_valida', JSON.stringify(datos_prefiltro));
            document.getElementById('num_element').innerHTML = datos_prefiltro.elementos;

            if (datos_prefiltro.poseedor === data.prefiltro.Poseedor && datos_prefiltro.conductor === data.prefiltro.Conductor) {
              var poseedor_conductor_existe = `#C8E6C9`;
              var texto_poseedor_conductor = 'Existen terceros creados con este documento';
              var validado_poseedor_conductor = 'SI';
              $('#Conductor').hide();
              $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').hide();
            } else {
              var poseedor_conductor_existe = `#FFFFFF`;
              var texto_poseedor_conductor = 'NO existen terceros creados con este documento';
              var validado_poseedor_conductor = 'NO';
              $('#Conductor').show();
              $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').show();
            }

            if (datos_prefiltro.propietario === data.prefiltro.Propietario) {
              var propietario_existe = `#C8E6C9`;
              var texto_propietario = 'Existen terceros creados con este documento';
              var validado_propietario = 'SI';
              $('#Conductor').show();
              $('#propietario_vehiculo').hide();
              $('#poseedor_vehiculo').show();
            } else {
              var propietario_existe = `#FFFFFF`;
              var texto_propietario = 'NO existen terceros creados con este documento';
              var validado_propietario = 'NO';
              $('#Conductor').show();
              $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').show();
            }

            $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${poseedor_conductor_existe};">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Conductor & Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${validado_poseedor_conductor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_poseedor_conductor}</td>
                </tr>
                <tr style="background-color:${propietario_existe};">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${validado_propietario}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_propietario}</td>
                </tr>
                </tbody>
              </table>`);
          } else if (
            datos_prefiltro.propietario === datos_prefiltro.propietarioTrailer &&
            datos_prefiltro.propietario !== datos_prefiltro.conductor &&
            datos_prefiltro.propietarioTrailer !== datos_prefiltro.conductor &&
            datos_prefiltro.propietarioTrailer !== datos_prefiltro.poseedor &&
            datos_prefiltro.propietario !== datos_prefiltro.poseedor
          ) {
            /* Validaciones para el propietario del trailer */
            //Propietario vehiculo igual al propietario del trailer
            $('.datos_val').hide();
            $('#actividades').show();
            $('#acciones').show();
            $('#frm_proveedores').css('display', 'block');
            $('#Conductor').show();
            $('#propietario_vehiculo').show();
            $('#poseedor_vehiculo').show();
            $('#Proveedor').hide();
            $('#propietario_trailer').show();

            if (datos_prefiltro.propietario === data.prefiltro.Propietario_Trailer) {
              var propietario_propietario_trailer_existe = `#aed5c0`;
              var texto_propietario_propietario_trailer = 'Existe Propietario y Propietario Trailer creado con este documento';
              var valido_propietario_propietario_trailer = 'SI';
              // valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
              // valido_propietario === 'SI' ? $('#propietario_vehiculo').hide() : $('#propietario_vehiculo').show();
              $('#propietario_trailer').hide();
              $('#propietario_vehiculo').hide();
              // document.getElementById('propietario_vehiculo').style.display = 'none';
            } else {
              var propietario_propietario_trailer_existe = `#FFFFFF`;
              var texto_propietario_propietario_trailer = 'No existe Propietario y Propietario Trailer creado con este documento';
              var valido_propietario_propietario_trailer = 'No';
              $('#propietario_trailer').show();
              $('#propietario_vehiculo').show();
            }

            if (datos_prefiltro.poseedor === data.prefiltro.Poseedor) {
              var Poseedor_existe = `#aed5c0`;
              var texto_Poseedor = 'Existe Poseedor creado con este documento';
              var valido_poseedor = 'SI';
              // valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
              // valido_propietario === 'SI' ? $('#propietario_vehiculo').hide() : $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').hide();
            } else {
              var Poseedor_existe = `#FFFFFF`;
              var texto_Poseedor = 'NO existe Poseedor creado con este documento';
              var valido_poseedor = 'NO';
              // $('#Conductor').show();
              // $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').show();
            }

            if (datos_prefiltro.conductor === data.prefiltro.Conductor) {
              var conductor_existe = `#aed5c0`;
              var texto_conductor = 'Existe Conductor creado con este documento';
              var valido_conductor = 'SI';
              $('#Conductor').hide();
              // $('#propietario_vehiculo').show();
              // $('#poseedor_vehiculo').show();
            } else {
              var conductor_existe = `#FFFFFF`;
              var texto_conductor = 'NO existe Conductor creado con este documento';
              var valido_conductor = 'NO';
              $('#Conductor').show();
              // $('#propietario_vehiculo').show();
              // $('#poseedor_vehiculo').show();
            }

            $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>

                <tr style="background-color:${propietario_propietario_trailer_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Propietario Trailer</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_propietario_propietario_trailer}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_propietario_propietario_trailer}</td>
                </tr>

                <tr style="background-color:${conductor_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_conductor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_conductor}</td>
                </tr>
     
                <tr style="background-color:${Poseedor_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_poseedor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
                </tr>
                </tbody>
              </table>`);
          } else if (
            datos_prefiltro.poseedor === datos_prefiltro.propietarioTrailer &&
            datos_prefiltro.poseedor !== datos_prefiltro.conductor &&
            datos_prefiltro.propietarioTrailer !== datos_prefiltro.conductor &&
            datos_prefiltro.propietarioTrailer !== datos_prefiltro.propietario &&
            datos_prefiltro.poseedor !== datos_prefiltro.propietario
          ) {
            //Poseedor vehiculo igual al propietario del trailer
            $('.datos_val').hide();
            $('#actividades').show();
            $('#acciones').show();
            $('#frm_proveedores').css('display', 'block');
            $('#Conductor').show();
            $('#propietario_vehiculo').show();
            $('#poseedor_vehiculo').show();
            $('#Proveedor').hide();
            $('#propietario_trailer').show();

            if (datos_prefiltro.poseedor === data.prefiltro.Propietario_Trailer) {
              var poseedor_propietario_trailer_existe = `#aed5c0`;
              var texto_poseedor_propietario_trailer = 'Existe Poseedor y Propietario Trailer creado con este documento';
              var valido_poseedor_propietario_trailer = 'SI';
              // valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
              // valido_propietario === 'SI' ? $('#propietario_vehiculo').hide() : $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').hide();
              $('#propietario_trailer').hide();
            } else {
              var poseedor_propietario_trailer_existe = `#FFFFFF`;
              var texto_poseedor_propietario_trailer = 'No existe Poseedor y Propietario Trailer creado con este documento';
              var valido_poseedor_propietario_trailer = 'NO';
              $('#propietario_trailer').show();
              $('#poseedor_vehiculo').show();
            }

            if (datos_prefiltro.conductor === data.prefiltro.Conductor) {
              var conductor_existe = `#aed5c0`;
              var texto_conductor = 'Existe Conductor creado con este documento';
              var valido_conductor = 'SI';
              $('#Conductor').hide();
              // $('#poseedor_vehiculo').show();
            } else {
              var conductor_existe = `#FFFFFF`;
              var texto_conductor = 'No existe Conductor creado con este documento';
              var valido_conductor = 'NO';
              $('#Conductor').show();
              // $('#poseedor_vehiculo').show();
            }

            if (datos_prefiltro.propietario === data.prefiltro.Propietario) {
              var Propietario_existe = `#aed5c0`;
              var texto_Propietario = 'Existe Conductor creado con este documento';
              var valido_propietario = 'SI';
              // $('#Conductor').show();
              // valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
              $('#propietario_vehiculo').hide();
              // $('#poseedor_vehiculo').show();
            } else {
              var Propietario_existe = `#FFFFFF`;
              var texto_Propietario = 'No existe Conductor creado con este documento';
              var valido_propietario = 'NO';
              // $('#Conductor').show();
              $('#propietario_vehiculo').show();
            }

            $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>

                <tr style="background-color:${poseedor_propietario_trailer_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor & Propietario Trailer</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_poseedor_propietario_trailer}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_poseedor_propietario_trailer}</td>
                </tr>

                <tr style="background-color:${Propietario_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_propietario}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario}</td>
                </tr>

                <tr style="background-color:${conductor_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_conductor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_conductor}</td>
                </tr>

                </tbody>
              </table>`);
          } else if (
            datos_prefiltro.conductor === datos_prefiltro.propietarioTrailer &&
            datos_prefiltro.conductor !== datos_prefiltro.poseedor &&
            datos_prefiltro.propietarioTrailer !== datos_prefiltro.poseedor &&
            datos_prefiltro.propietarioTrailer !== datos_prefiltro.propietario &&
            datos_prefiltro.conductor !== datos_prefiltro.propietario
          ) {
            // Conductor igual al propietario del trailer
            $('.datos_val').hide();
            $('#actividades').show();
            $('#acciones').show();
            $('#frm_proveedores').css('display', 'block');
            $('#Conductor').show();
            $('#propietario_vehiculo').show();
            $('#poseedor_vehiculo').show();
            $('#Proveedor').hide();
            $('#propietario_trailer').show();

            // if (datos_prefiltro.Propietario_Trailer === data.prefiltro.Conductor) {
            if (datos_prefiltro.conductor === data.prefiltro.Propietario_Trailer) {
              var conductor_propietario_trailer_existe = `#aed5c0`;
              var texto_conductor_propietario_trailer = 'Existe Conductor y Propietario Trailer creado con este documento';
              var valido_conductor_propietario_trailer = 'SI';
              // valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
              // valido_propietario === 'SI' ? $('#propietario_vehiculo').hide() : $('#propietario_vehiculo').show();
              $('#Conductor').hide();
              $('#propietario_trailer').hide();
            } else {
              var conductor_propietario_trailer_existe = `#FFFFFF`;
              var texto_conductor_propietario_trailer = 'No existe Conductor y Propietario Trailer creado con este documento';
              var valido_conductor_propietario_trailer = 'NO';
              $('#Conductor').show();
              $('#propietario_vehiculo').show();
            }

            if (datos_prefiltro.propietario === data.prefiltro.Propietario) {
              var Propietario_existe = `#aed5c0`;
              var texto_Propietario = 'Existe Conductor creado con este documento';
              var valido_propietario = 'SI';
              valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
              $('#propietario_vehiculo').hide();
              // $('#poseedor_vehiculo').show();
            } else {
              var Propietario_existe = `#FFFFFF`;
              var texto_Propietario = 'No existe Conductor creado con este documento';
              var valido_propietario = 'NO';
              // $('#Conductor').show();
              $('#propietario_vehiculo').show();
              // $('#poseedor_vehiculo').show();
            }

            if (datos_prefiltro.poseedor === data.prefiltro.Poseedor) {
              var Poseedor_existe = `#aed5c0`;
              var texto_Poseedor = 'Existe Poseedor creado con este documento';
              var valido_poseedor = 'SI';
              valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
              valido_propietario === 'SI' ? $('#propietario_vehiculo').hide() : $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').hide();
            } else {
              var Poseedor_existe = `#FFFFFF`;
              var texto_Poseedor = 'No existe Poseedor creado con este documento';
              var valido_poseedor = 'NO';
              // $('#Conductor').show();
              // $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').show();
            }

            $('#Lista_comprobacion').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>

                <tr style="background-color:${conductor_propietario_trailer_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Conductor & Propietario Trailer</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_conductor_propietario_trailer}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_conductor_propietario_trailer}</td>
                </tr>

                <tr style="background-color:${Propietario_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_propietario}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario}</td>
                </tr>
                
                <tr style="background-color:${Poseedor_existe};border-bottom:1px solid #9FA6B2;">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${valido_poseedor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
                </tr>

                </tbody>
              </table>`);
          } else if (
            datos_prefiltro.poseedor !== datos_prefiltro.conductor &&
            datos_prefiltro.propietario !== datos_prefiltro.poseedor &&
            datos_prefiltro.propietarioTrailer !== datos_prefiltro.poseedor &&
            datos_prefiltro.propietarioTrailer !== datos_prefiltro.propietario &&
            datos_prefiltro.propietarioTrailer !== datos_prefiltro.propietario
          ) {
            $('.datos_val').hide();
            $('#actividades').show();
            $('#acciones').show();
            $('#frm_proveedores').css('display', 'block');
            $('#Conductor').show();
            $('#propietario_vehiculo').show();
            $('#poseedor_vehiculo').show();
            $('#Proveedor').hide();
            $('#propietario_trailer').show();
            // Agrega un nuevo elemento al objeto JSON
            datos_prefiltro['elementos'] = 3;
            // Almacena el objeto JSON actualizado en sessionStorage
            sessionStorage.setItem('datos_valida', JSON.stringify(datos_prefiltro));
            document.getElementById('num_element').innerHTML = datos_prefiltro.elementos;

            if (datos_prefiltro.conductor === data.prefiltro.Conductor) {
              var conductor_existe = `#aed5c0`;
              var texto_conductor = 'Existe Conductor creado con este documento';
              var valido_conductor = 'SI';
              $('#Conductor').hide();
              // $('#propietario_vehiculo').show();
              // $('#poseedor_vehiculo').show();
            } else {
              var conductor_existe = `#FFFFFF`;
              var texto_conductor = 'NO existe Conductor creado con este documento';
              var valido_conductor = 'NO';
              $('#Conductor').show();
              // $('#propietario_vehiculo').show();
              // $('#poseedor_vehiculo').show();
            }

            if (datos_prefiltro.propietario === data.prefiltro.Propietario) {
              var Propietario_existe = `#aed5c0`;
              var texto_Propietario = 'Existe Conductor creado con este documento';
              var valido_propietario = 'SI';
              // $('#Conductor').show();
              valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
              $('#propietario_vehiculo').hide();
              // $('#poseedor_vehiculo').show();
            } else {
              var Propietario_existe = `#FFFFFF`;
              var texto_Propietario = 'NO existe Conductor creado con este documento';
              var valido_propietario = 'NO';
              // $('#Conductor').show();
              $('#propietario_vehiculo').show();
              // $('#poseedor_vehiculo').show();
            }

            if (datos_prefiltro.poseedor === data.prefiltro.Poseedor) {
              var Poseedor_existe = `#aed5c0`;
              var texto_Poseedor = 'Existe Poseedor creado con este documento';
              var valido_poseedor = 'SI';
              valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
              valido_propietario === 'SI' ? $('#propietario_vehiculo').hide() : $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').hide();
            } else {
              var Poseedor_existe = `#FFFFFF`;
              var texto_Poseedor = 'NO existe Poseedor creado con este documento';
              var valido_poseedor = 'NO';
              // $('#Conductor').show();
              // $('#propietario_vehiculo').show();
              $('#poseedor_vehiculo').show();
            }

            if (datos_prefiltro.propietarioTrailer === data.prefiltro.Propietario_Trailer) {
              var Propietario_trailer_existe = `#aed5c0`;
              var texto_Propietario_trailer = 'Existe Propietario Trailer creado con este documento';
              var valido_propietario_trailer = 'SI';
              valido_conductor === 'SI' ? $('#Conductor').hide() : $('#Conductor').show();
              valido_propietario === 'SI' ? $('#propietario_vehiculo').hide() : $('#propietario_vehiculo').show();
              $('#propietario_trailer').hide();
            } else {
              var Propietario_trailer_existe = `#FFFFFF`;
              var texto_Propietario_trailer = 'NO existe Propietario Trailer creado con este documento';
              var valido_propietario_trailer = 'NO';
              // $('#Conductor').show();
              // $('#propietario_vehiculo').show();
              // $('#poseedor_vehiculo').show();
              $('#propietario_trailer').show();
            }

            $('#Lista_comprobacion').html(`
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
              <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                <tr>
                  <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                  <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                  <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                </tr>
              </thead>
              <tbody>
              <tr style="background-color:${conductor_existe};border-bottom:1px solid #9FA6B2;">
                <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                <td style="width: auto; white-space: nowrap;" class="text-center">${valido_conductor}</td>
                <td style="width: auto; white-space: nowrap;" class="text-center">${texto_conductor}</td>
              </tr>
              <tr style="background-color:${Propietario_existe};border-bottom:1px solid #9FA6B2;">
                <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                <td style="width: auto; white-space: nowrap;" class="text-center">${valido_propietario}</td>
                <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario}</td>
              </tr>
              <tr style="background-color:${Poseedor_existe};border-bottom:1px solid #9FA6B2;">
                <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                <td style="width: auto; white-space: nowrap;" class="text-center">${valido_poseedor}</td>
                <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Poseedor}</td>
              </tr>
              <tr style="background-color:${Propietario_trailer_existe};">
                <td style="width: auto; white-space: nowrap;" class="text-center">Propietario Trailer</td>
                <td style="width: auto; white-space: nowrap;" class="text-center">${valido_propietario_trailer}</td>
                <td style="width: auto; white-space: nowrap;" class="text-center">${texto_Propietario_trailer}</td>
              </tr>
              </tbody>
            </table>`);
          }
        }
      } catch (error) {
        console.error('Error en la segunda solicitud:', error);
        throw error;
      } finally {
        $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    }
  }

  $('#pasar_municipio').click(function() {
    if ($('#municipio').val() === '') {
      $('.mesanje_error').html(`
			<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
							<strong>Mensaje!</strong> Debe diligenciar un Municipio para el proveedor.
					</div>
			</div>`);
    } else {
      $('#municipio_tabla').val($('#municipio').val());
      $('#Modal_Municipios').modal('toggle');
    }
  });

  $('#elmodalito2').click(function(event) {
    event.preventDefault();
    $('#div_mascara').hide(); //ocultar formato de direccion
    $('#div_complemento').hide();

    //ocultar los datos cuando entre al modal
    // $(".titulogeneral").hide();
    $('#datos_generalest').hide();
    $('.Datosespecificos').hide();
    $('#datos_onlyconductor').hide();
    $('#datos_proveedor').hide();
    $('#datos_contacto').hide();
    $('#datos_financieros').hide();
    $('#civil').hide();
    $('.zona').hide();
    $('#tipos_servicios').hide();
    $('#Transporte').hide();
    $('#agencia_carga').hide();
    $('#acordeon_proveedor').hide();

    //ocultar o mostrar datos si se salio del
    //modal y tiene un checkbox seleccionado
    var tipo_actividad = false;
    $('.tipo_actividad').each(function() {
      if ($(this).is(':checked')) {
        tipo_actividad = true;
        if ($(this).attr('id') == 'Conductor') {
          $('.titulogeneral').show();
          $('#datos_generalest').show();
          $('.Datosespecificos').show();
          $('#datos_onlyconductor').show();
        }
        if ($(this).attr('id') == 'poseedor_vehiculo' || $(this).attr('id') == 'propietario_vehiculo' || $(this).attr('id') == 'Proveedor') {
          $('.titulogeneral').show();
          $('#datos_generalest').show();

          if ($(this).attr('id') == 'Proveedor') {
            $('#datos_proveedor').show();
            $('#datos_contacto').show();
          }
        } else {
        }
      }
    });
  });

  $('#tipo_documento').change(function() {
    // Se busca si el proveedor ya existe en el sistema
    var params = {
      accion: 'verProveedorDoc',
      doc_proveedor: $('#numero_documento').val(),
    };
    $.ajax({
      type: 'POST',
      cache: false,
      url: url,
      data: params,
      dataType: 'json',
      success: function(data) {
        // console.log(data);
        $('.nexos-messages').empty();
        if (data.success) {
          funct_msg_error('#nexos_messages_popup', 'El proveedor ya se encuentra registrado, cualquier cambio lo puede realizar editando la información dentro de la lista.');
          $('#crea_proveedores').animate({scrollTop: 0}, 600);
          $('#rndc_nombre').val('');
          $('#rndc_nombre').attr('disabled', true);
          $('#btn_agregar_proveedor').hide();
        } else {
          if ($('#tipo_documento').val() == 'NIT') {
            $('#digito_verificacion').val(calcularDigitoVerificacion($('#numero_documento').val()));
            $('#btn_agregar_proveedor').show();
          } else {
            $('#digito_verificacion').val(0);
            $('#btn_agregar_proveedor').show();
          }
        }
      },
    });
  });

  $('#btn_agregar_proveedor').click(async function(event) {
    Swal.fire({
      title: '¿Esta seguro de crear este proveedor?',
      text: '¡No podrás revertir esto!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Crear Proveedor',
      cancelButtonText: 'Cancelar',
    }).then(async result => {
      if (result.isConfirmed) {
        $('.nexos-messages').html('');
        b = $('#numero_documento').val().length;
        // Se valida contenido del formulario
        var msg_error = '';
        var flag_primer_apellido = true;
        var flag_abreviatura = true;
        var flag_telefono = true;
        var tipo_actividad = false;
        $('.tipo_actividad').each(function() {
          if ($(this).is(':checked')) {
            tipo_actividad = true;
            if ($(this).attr('id') == 'Conductor') {
              /* 2) Validar el Tipo de documento para crear el proveedor solamente como conductor*/
              if (!$('#tipo_documento').val()) {
                msg_error += '<p>Debe diligenciar el campo <strong>Tipo Documento</strong> para poder crear el Proveedor.</p>';
                AplicaFoco('#tipo_documento');
                $('#tipo_documento + p').remove();
                const ERROR = $('<p></p>').text('Debe seleccionar el tipo de documento').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#tipo_documento').after(ERROR);
                // $("#tipo_documento").before(ERROR);
              } else {
                RemueveFoco('#tipo_documento');
                $('#tipo_documento + p').remove(); // Elimina el mensaje de error si ya existe
              }

              if (!$('#categoria_licencia').val()) {
                // msg_error += "<p>Debe seleccionar una <strong>Catergoría Licencia</strong> para poder crear el Proveedor.</p>";
                $('#categoria_licencia + p').remove();
                const ERROR = $('<p></p>').text('Debe seleccionar una catergoría de Licencia').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#categoria_licencia').after(ERROR);
                AplicaFoco('#categoria_licencia');
              } else {
                RemueveFoco('#categoria_licencia');
                $('#categoria_licencia + p').remove();
              }
              if (!$('#numero_licencia').val()) {
                // msg_error += "<p>Debe diligenciar el campo <strong>Número de Licencia</strong> para poder crear el Proveedor.</p>";
                $('#numero_licencia + p').remove();
                const ERROR = $('<p></p>').text('Debe diligenciar el campo numero de licencia').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#numero_licencia').after(ERROR);
                AplicaFoco('#numero_licencia');
              } else {
                RemueveFoco('#numero_licencia');
                $('#numero_licencia + p').remove();
              }

              if ($('#numero_licencia').val().length < 5) {
                // alert("hola desde menos 5");
                $('#numero_licencia + p').remove();
                const ERROR = $('<p></p>').text('El Número de Licencia debe tener mínimo 5 carácteres').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#numero_licencia').after(ERROR);
                AplicaFoco('#numero_licencia');
              } else if ($('#numero_licencia').val().length > 12) {
                $('#numero_licencia + p').remove();
                const ERROR = $('<p></p>').text('El Número de Licencia debe tener maximo 12 carácteres').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#numero_licencia').after(ERROR);
                AplicaFoco('#numero_licencia');
              } else if ($('#numero_licencia').val() === '00000') {
                $('#numero_licencia + p').remove();
                const ERROR = $('<p></p>').text('El Número de Licencia debe contener ceros').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#numero_licencia').after(ERROR);
                AplicaFoco('#numero_licencia');
              } else if ($('#numero_licencia').val() === '00000000000') {
                $('#numero_licencia + p').remove();
                const ERROR = $('<p></p>').text('El Número de Licencia debe contener ceros').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#numero_licencia').after(ERROR);
                AplicaFoco('#numero_licencia');
              } else if ($('#numero_licencia').val() === '') {
                $('#numero_licencia + p').remove();
                const ERROR = $('<p></p>').text('Debe diligenciar el numero de licencia').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#numero_licencia').after(ERROR);
                AplicaFoco('#numero_licencia');
              } else {
                RemueveFoco('#numero_licencia');
                $('#numero_licencia + p').remove();
              }

              var fileInput = $('#licencia')[0].files[0];
              // Verifica si se ha seleccionado un archivo
              if (!fileInput) {
                $('#licencia + p').remove();
                const ERROR = $('<p></p>').text('Debe seleccionar un documento').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#licencia').after(ERROR);
                AplicaFoco('#licencia');
              } else {
                RemueveFoco('#licencia');
                $('#licencia + p').remove();
              }

              /* 10) Validar el documento de la cedula. */
              var fileInput = $('#documentos')[0].files[0];
              // Verifica si se ha seleccionado un archivo
              if (!fileInput) {
                $('#documentos + p').remove();
                const ERROR = $('<p></p>').text('Debe seleccionar un documento').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#documentos').after(ERROR);
                AplicaFoco('#documentos');
              } else {
                RemueveFoco('#documentos');
                $('#documentos + p').remove();
              }

              if (!$('#vencimiento_licencia').val()) {
                // msg_error += "<p>Debe diligenciar el campo <strong>Vencimiento Licencia</strong> para poder crear el Proveedor.</p>";
                $('#vencimiento_licencia + p').remove();
                const ERROR = $('<p></p>').text('Debe diligenciar el campo vencimiento Licencia').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#vencimiento_licencia').after(ERROR);
                AplicaFoco('#vencimiento_licencia');
              } else {
                fecha_licencia = $('#vencimiento_licencia').val();
                //let puente = validaFechaActual();
                var fhoy = moment();
                var horahoy = moment().format('HH:mm:ss');
                var tf = fhoy.diff(fecha_licencia, 'days');
                if (tf <= 0) {
                  //vigente
                  RemueveFoco('#vencimiento_licencia');
                } else {
                  msg_error += '<p>La <strong> fecha de vencimiento </strong> de la Licencia esta vencida.</p>';
                }
                RemueveFoco('#vencimiento_licencia');
              }

              if ($('#tipo_documento').val() == 'NIT') {
                msg_error += '<p>No se puede crear un conductor registrado con NIT.</p>';
                AplicaFoco('#tipo_documento');
              } else {
                RemueveFoco('#tipo_documento');
              }
              if ($('#tipo_documento').val() == 'Identificacion Tributaria Internacional') {
                msg_error += '<p>No se puede crear un <strong>conductor</strong> registrado con Identificacion Tributaria Internacional.</p>';
                AplicaFoco('#tipo_documento');
              } else {
                RemueveFoco('#tipo_documento');
              }
              if (!$('#celular2').val()) {
                // msg_error += "<p>Debe diligenciar el campo <strong>Celular 2</strong> para poder crear el Proveedor.</p>";
                $('#celular2 + p').remove();
                const ERROR = $('<p></p>').text('Debe diligenciar el campo celular 2').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#celular2').after(ERROR);
                AplicaFoco('#celular2');
              } else {
                if ($('#celular2').length < 7) {
                  // alert("el ceular debe ser mayor a 7 caracteres");
                  $('#celular2 + p').remove();
                  const ERROR = $('<p></p>').text('El ceular debe tener minimo 10 caracteres').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                  $('#celular2').after(ERROR);
                } else if ($('#celular2').length > 30) {
                  $('#celular2 + p').remove();
                  const ERROR = $('<p></p>').text('El ceular no debe supearr los 30 caracteres').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                  $('#celular2').after(ERROR);
                } else if ($('#celular2').val() == '0000000') {
                  $('#celular2 + p').remove();
                  const ERROR = $('<p></p>').text('El ceular no es valido').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                  $('#celular2').after(ERROR);
                } else {
                  RemueveFoco('#celular2');
                  $('#celular2 + p').remove();
                }
              }
              if (!$('#celular').val()) {
                // msg_error += "<p>Debe diligenciar el campo <strong>Celular 1</strong> para poder crear el Proveedor.</p>";
                $('#celular + p').remove();
                const ERROR = $('<p></p>').text('Debe diligenciar el campo celular 1').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#celular').after(ERROR);
                AplicaFoco('#celular');
              } else {
                RemueveFoco('#celular');
                $('#celular + p').remove();
              }
              if (!$('#referencias_empresariales1').val()) {
                msg_error += '<p>Debe seleccionar una <strong>Referencias Empresariales 1</strong> para poder crear el Conductor.</p>';
                AplicaFoco('#referencias_empresariales1');
              } else {
                RemueveFoco('#referencias_empresariales1');
              }
              if (!$('#celular_ref1').val()) {
                msg_error += '<p>Debe ingresar un <strong>Número Empresarial 1</strong> para poder crear el Conductor.</p>';
                AplicaFoco('#celular_ref1');
              } else {
                RemueveFoco('#celular_ref1');
              }
              if (!$('#referencias_empresariales2').val()) {
                msg_error += '<p>Debe ingresar una <strong>Referencia Empresariales 2</strong> para poder crear el Conductor.</p>';
                AplicaFoco('#referencias_empresariales2');
              } else {
                RemueveFoco('#referencias_empresariales2');
              }
              if (!$('#celular_ref2').val()) {
                msg_error += '<p>Debe ingresar un <strong>Número Empresarial 2</strong> para poder crear el Conductor.</p>';
                AplicaFoco('#celular_ref2');
              } else {
                RemueveFoco('#celular_ref2');
              }
              if (!$('#referencias_empresariales3').val()) {
                msg_error += '<p>Debe ingresar una <strong>Referencia Empresarial 3</strong> para poder crear el Conductor.</p>';
                AplicaFoco('#referencias_empresariales3');
              } else {
                RemueveFoco('#referencias_empresariales3');
              }
              if (!$('#celular_ref3').val()) {
                msg_error += '<p>Debe ingresar un <strong>Número Empresarial 3</strong> para poder crear el Conductor.</p>';
                AplicaFoco('#celular_ref3');
              } else {
                RemueveFoco('#celular_ref3');
              }
              if (!$('#referencias_personales1').val()) {
                msg_error += '<p>Debe seleccionar una <strong>Referencias Personales 1</strong> para poder crear el Conductor.</p>';
                AplicaFoco('#referencias_personales1');
              } else {
                RemueveFoco('#referencias_personales1');
              }
              if (!$('#parenp1').val()) {
                msg_error += '<p>Debe seleccionar un <strong>Parentezco Personales 1</strong> para poder crear el Conductor.</p>';
                AplicaFoco('#parenp1');
              } else {
                RemueveFoco('#parenp1');
              }
              if (!$('#telefonop1').val()) {
                msg_error += '<p>Debe ingresar un <strong>Teléfono Personales 1</strong> para poder crear el Conductor.</p>';
                AplicaFoco('#telefonop1');
              } else {
                RemueveFoco('#telefonop1');
              }
              if (!$('#referencias_personales2').val()) {
                msg_error += '<p>Debe ingresar una <strong>Refrencia Personales 2</strong> para poder crear el Conductor.</p>';
                AplicaFoco('#referencias_personales2');
              } else {
                RemueveFoco('#referencias_personales2');
              }
              if (!$('#parenp2').val()) {
                msg_error += '<p>Debe seleccionar un <strong>parentezco Personales 2</strong> para poder crear el Conductor.</p>';
                AplicaFoco('#parenp2');
              } else {
                RemueveFoco('#parenp2');
              }
              if (!$('#telefonop2').val()) {
                msg_error += '<p>Debe ingresar un <strong>Teléfono Personales 2</strong> para poder crear el Conductor.</p>';
                AplicaFoco('#telefonop2');
              } else {
                RemueveFoco('#telefonop2');
              }
              if (!$('#sangre').val()) {
                msg_error += '<p>Debe Seleccionar un <strong> Grupo sanguineo </strong> para poder crear el Conductor.</p>';
                AplicaFoco('#sangre');
              } else {
                RemueveFoco('#sangre');
              }
              // ACUERDO DE SEGURIDAD DEL CONDUCTOR
              if (!$('#acuerdo_uno').val()) {
                msg_error += '<p>Debe seleccionar el <strong>Acuerdo de seguridad</strong> para poder crear el Conductor.</p>';
                AplicaFoco('#acuerdo_uno');
              } else {
                RemueveFoco('#acuerdo_uno');
              }
              if (!$('#sexo').val()) {
                msg_error += '<p>Debe seleccionar el <strong>Género</strong> para poder crear el Conductor.</p>';
                AplicaFoco('#sexo');
              } else {
                RemueveFoco('#sexo');
              }
              if ($('#fecha_retiro1').val() < $('#fecha_referencia1').val()) {
                msg_error += '<p>La Fecha de retiro 1 no puede ser menor a la Fecha de ingreso 1</p>';
              }
              if ($('#fecha_retiro2').val() < $('#fecha_referencia2').val()) {
                msg_error += '<p>La Fecha de retiro 2 no puede ser menor a la Fecha de ingreso 2</p>';
              }
              if ($('#fecha_retiro3').val() < $('#fecha_referencia3').val()) {
                msg_error += '<p>La Fecha de retiro 3 no puede ser menor a la Fecha de ingreso 3</p>';
              }

              if (!$('#foto_conductor').val()) {
                msg_error += '<p>Debe seleccionar la <strong>Foto Frontal(1) del conductor</strong> para poder crear el Conductor.</p>';
              }

              if (!$('#foto_indume').val()) {
                msg_error += '<p>Debe seleccionar la <strong>Foto de  Indumentaria del conductor</strong> para poder crear el Conductor.</p>';
              }

              if (!$('#foto_derecha').val()) {
                msg_error += '<p>Debe seleccionar la <strong>Foto lateral derecho(1) del conductor</strong> para poder crear el Conductor.</p>';
              }

              if (!$('#foto_izquierda').val()) {
                msg_error += '<p>Debe seleccionar la <strong>Foto lateral izquierdo(1) del conductor</strong> para poder crear el Conductor.</p>';
              }

              if ($('#vence_eps').val()) {
                fecha = $('#vence_eps').val();
                var fhoy = moment();
                var horahoy = moment().format('HH:mm:ss');
                var tf = fhoy.diff(fecha, 'days');
                if (tf > 0) {
                  msg_error += '<p>Debe ingresar <strong>Fecha vencimiento plan seguridad social</strong> vigente para poder crear el Conductor.</p>';
                }
              }

              if ($('#vence_curso').val()) {
                fecha = $('#vence_curso').val();
                var fhoy = moment();
                var horahoy = moment().format('HH:mm:ss');
                var tf = fhoy.diff(fecha, 'days');
                if (tf > 0) {
                  msg_error += '<p>Debe ingresar <strong>Fecha Vencimiento del Curso </strong> vigente para poder crear el Conductor.</p>';
                }
              }

              // vence_eps
              if (!$('#vence_eps').val()) {
                msg_error += '<p>Debe ingresar la <strong>fecha de vencimiento </strong> de la planilla de seguridad social.</p>';
                AplicaFoco('#vence_eps');
              } else {
                RemueveFoco('#vence_eps');
              }

              // docu_eps
              if (!$('#docu_eps').val()) {
                msg_error += '<p>Debe cargar el <strong>documento</strong> de la planilla de seguridad social.</p>';
                AplicaFoco('#docu_eps');
              } else {
                RemueveFoco('#docu_eps');
              }
              //fin validaciones del conductor
            } //cierre del conductor

            if ($(this).attr('id') == 'Proveedor') {
              if (!$('#pv_localizacion').val()) {
                msg_error += '<p>Debe seleccionar <strong>Localización operacional</strong> para poder crear el Proveedor.</p>';
                AplicaFoco('#pv_localizacion');
              } else {
                RemueveFoco('#pv_localizacion');
              }
              if (!$('#pv_tiposervice').val()) {
                msg_error += '<p>Debe seleccionar <strong>Tipo de servicio</strong> para poder crear el Proveedor.</p>';
                AplicaFoco('#pv_tiposervice');
              } else {
                RemueveFoco('#pv_tiposervice');
              }
              if ($('#pv_tiposervice').val() == 'Transporte') {
                if (!$('#pv_via').val()) {
                  msg_error += '<p>Debe seleccionar <strong>Vía</strong> para poder crear el Proveedor.</p>';
                  AplicaFoco('#pv_via');
                } else {
                  RemueveFoco('#pv_via');
                }
                if (!$('#pv_select').val()) {
                  msg_error += '<p>Debe seleccionar <strong>Tipificación</strong> para poder crear el Proveedor.</p>';
                  AplicaFoco('#pv_select');
                } else {
                  RemueveFoco('#pv_select');
                }
              } else if ($('#pv_tiposervice').val() == 'Porteadores') {
                if (!$('#detalle_porteador').val()) {
                  msg_error += '<p>Debe seleccionar <strong>Detalle 1</strong> para poder crear el Proveedor.</p>';
                  AplicaFoco('#detalle_porteador');
                } else {
                  RemueveFoco('#detalle_porteador');
                }
              } else if ($('#pv_tiposervice').val() == 'Agenciamiento de carga') {
                if (!$('#detalle_acarga').val()) {
                  msg_error += '<p>Debe seleccionar <strong>Detalle 1</strong> para poder crear el Proveedor.</p>';
                  AplicaFoco('#detalle_acarga');
                } else {
                  RemueveFoco('#detalle_acarga');
                }
              } else if ($('#pv_tiposervice').val() == 'Tramites administrativos') {
                if (!$('#tramite_ad').val()) {
                  msg_error += '<p>Debe seleccionar <strong>Detalle 1</strong> para poder crear el Proveedor.</p>';
                  AplicaFoco('#tramite_ad');
                } else {
                  RemueveFoco('#tramite_ad');
                }
              }
            } //cierre del proveedor
          }
        });

        /* Validaciones de datos generales */
        /* 1) Validacion de seleccionar el tipo de actividad para crear el proveedor */
        if (!tipo_actividad) {
          msg_error += '<p>Debe seleccionar por lo menos un <strong>Tipo de actividad</strong> para poder crear el Proveedor.</p>';
          AplicaFoco('#label_tipoactividad');
        } else {
          RemueveFoco('#label_tipoactividad');
        }

        /* 2) Validar el Tipo de documento para crear el proveedor solamente como propietario o poseedor */
        if (!$('#tipo_documento').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Tipo Documento</strong> para poder crear el Proveedor.</p>';
          AplicaFoco('#tipo_documento');
          $('#tipo_documento + p').remove();
          const ERROR = $('<p></p>').text('Debe seleccionar el tipo de documento').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
          $('#tipo_documento').after(ERROR);
        } else {
          RemueveFoco('#tipo_documento');
          $('#tipo_documento + p').remove(); // Elimina el mensaje de error si ya existe
        }

        if (!$('#tipo_documento').val()) {
          if (!$('#celular').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Celular</strong> para poder crear el Proveedor.</p>';
            $('#celular + p').remove();
            const ERROR = $('<p></p>').text('Debe diligenciar el celular de contacto').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
            $('#celular').after(ERROR);
            AplicaFoco('#celular');
          } else {
            RemueveFoco('#celular');
            $('#celular + p').remove();
          }
        } else {
          if (!$('#celular').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Celular</strong> para poder crear el Proveedor.</p>';
            $('#celular + p').remove();
            const ERROR = $('<p></p>').text('Debe diligenciar el celular de contacto').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
            $('#celular').after(ERROR);
            AplicaFoco('#celular');
          } else {
            RemueveFoco('#celular');
            $('#celular + p').remove();
          }

          if ($('#tipo_documento').val() == 'Cedula de Ciudadania' || $('#tipo_documento').val() == 'Cedula de Extranjeria') {
            if (!$('#primer_apellido').val()) {
              flag_primer_apellido = false;
            }
          }

          if ($('#tipo_documento').val() == 'NIT' || $('#tipo_documento').val() == 'Identificacion Tributaria Internacional') {
            if (!$('#contacto').val()) {
              flag_telefono = false;
              var msg_error_telefono = '<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> para poder crear el Proveedor.</p>';
            }
          }

          //validar longitud de numero de documento según el tipo
          if ($('#tipo_documento').val() === 'Cedula de Ciudadania') {
            if (!$('#numero_documento').val()) {
              $('#numero_documento + p').remove();
              const ERROR = $('<p></p>').text('Debe diligenciar el numero de documento').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#numero_documento').after(ERROR);
              AplicaFoco('#numero_documento');
            } else if ($('#numero_documento').val().length < 8) {
              $('#numero_documento + p').remove();
              const ERROR = $('<p></p>').text('Debe diligenciar minimo 8 caracteres para crear el proveedor').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#numero_documento').after(ERROR);
              AplicaFoco('#numero_documento');
            } else if ($('#numero_documento').val().length > 12) {
              $('#numero_documento + p').remove();
              const ERROR = $('<p></p>').text('Debe diligenciar maximo 12 caracteres para crear el proveedor').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#numero_documento').after(ERROR);
              AplicaFoco('#numero_documento');
            } else if (/^0+$/.test($('#numero_documento').val())) {
              $('#numero_documento + p').remove();
              const ERROR = $('<p></p>').text('El campo no puede contener solo ceros.').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#numero_documento').after(ERROR);
              AplicaFoco('#numero_documento');
            } else if ($('#numero_documento').val() === '000000000000') {
              $('#numero_documento + p').remove();
              const ERROR = $('<p></p>').text('El campo no puede contener solo ceros.').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#numero_documento').after(ERROR);
              AplicaFoco('#numero_documento');
            } else {
              RemueveFoco('#numero_documento');
              $('#numero_documento + p').remove();
            }
          }

          if ($('#tipo_documento').val() == 'Cedula de Extranjeria') {
            if ($('#numero_documento').val().length != 6) {
              msg_error += '<p>El campo <strong>Número de documento</strong> debe tener 6 caracteres para poder crear el Proveedor con Cédula Extranjeria.</p>';
            }
          }

          if ($('#tipo_documento').val() == 'NIT') {
            if ($('#numero_documento').val().length != 9) {
              msg_error += '<p>El campo <strong>Número de documento</strong> debe tener 9 caracteres para poder crear el Proveedor con Nit.</p>';
            }
          }
        }

        /* 3) Validar que el campo tipo documento no este vacio */
        if (!$('#numero_documento').val()) {
          $('#numero_documento + p').remove();
          const ERROR = $('<p></p>').text('Debe diligenciar numero documento').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
          $('#numero_documento').after(ERROR);
          AplicaFoco('#numero_documento');
        }

        /* 4) Validar Nombre o razon social del proveedor */
        if (!$('#rndc_nombre').val()) {
          // msg_error += "<p>Debe diligenciar el campo <strong>Nombre o Razón social</strong> para poder crear el Proveedor.</p>";
          $('#rndc_nombre + p').remove();
          const ERROR = $('<p></p>').text('Debe diligenciar el campo Nombre o Razón social').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
          $('#rndc_nombre').after(ERROR);
          AplicaFoco('#rndc_nombre');
        } else {
          RemueveFoco('#rndc_nombre');
          $('#rndc_nombre + p').remove();
        }

        /* 5) Validar Primer apellido para los datos generales */
        if (!flag_primer_apellido) {
          // msg_error += "<p>Debe diligenciar el campo <strong>Primer Apellido</strong> para poder crear el Proveedor.</p>";
          $('#primer_apellido + p').remove();
          const ERROR = $('<p></p>').text('Debe diligenciar el campo primer apellido').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
          $('#primer_apellido').after(ERROR);
        }

        if (!flag_abreviatura) {
          msg_error += msg_error_abreviatura;
        }

        if (!flag_telefono) {
          msg_error += msg_error_telefono;
        }

        /* 6) Validar la direccion de los datos genrales */
        if (!$('#direccion').val()) {
          // msg_error += "<p>Debe diligenciar el campo <strong>Dirección</strong> para poder crear el Proveedor.</p>";
          $('#direccion + p').remove();
          const ERROR = $('<p></p>').text('Debe diligenciar el campo Dirección').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
          $('#direccion').after(ERROR);
          AplicaFoco('#direccion');
          if (!$('#di_tipovia').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Tipo de vía</strong> del generador de direcciones.</p>';
          }
        } else {
          //validar contra mascara
          RemueveFoco('#direccion');
          $('#direccion + p').remove();
        }

        /* 7) Debe tener un municipio seleccionado */
        if (!$('#id_municipio').val() && !$('#rndc_id_municipio').val()) {
          // msg_error += "<p>Debe seleccionar(Click) <strong>Municipio</strong> para poder crear el Proveedor.</p>";
          $('#municipio_tabla + p').remove();
          const ERROR = $('<p></p>').text('Debe dar (Click) para seleccionar elegir el Municipio').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
          $('#municipio_tabla').after(ERROR);
          // municipio_tabla
          AplicaFoco('#municipio');
          $('#municipio').val(' ');
        } else {
          RemueveFoco('#municipio');
          $('#municipio_tabla + p').remove();
        }
        /* 8) Debe diligenciar el municipio */
        if (!$('#municipio').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Municipio</strong> para poder crear el Proveedor.</p>';
          AplicaFoco('#municipio');
        } else {
          RemueveFoco('#municipio');
        }

        /* 9) Validar el celular de contacto para datos generales */
        if ($('#celular').val()) {
          var celula = $('#celular').val().toString().length;
          if (celula < 10) {
            msg_error += '<p>El campo <strong>Celular 1</strong> debe tener 10 dígitos para poder crear el Proveedor.</p>';
            $('#celular + p').remove();
            const ERROR = $('<p></p>').text('Campo Requerido').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
            $('#celular').after(ERROR);
            AplicaFoco('#celular');
          } else if (celula > 10) {
            $('#celular + p').remove();
            const ERROR = $('<p></p>').text('El campo debe tener maximo 10 caracteres.').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
            $('#celular').after(ERROR);
            AplicaFoco('#celular');
          } else if (/^0+$/.test($('#celular').val())) {
            $('#celular + p').remove();
            const ERROR = $('<p></p>').text('El campo no puede contener solo ceros.').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
            $('#celular').after(ERROR);
            AplicaFoco('#celular');
          } else {
            $('#celular + p').remove();
            RemueveFoco('#celular');
          }
        }

        if ($('#celular2').val()) {
          var celula = $('#celular2').val().toString().length;
          if (celula < 10) {
            msg_error += '<p>El campo <strong>Celular 1</strong> debe tener 10 dígitos para poder crear el Proveedor.</p>';
            $('#celular2 + p').remove();
            const ERROR = $('<p></p>').text('El campo debe tener minimo 10 caracteres.').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
            $('#celular2').after(ERROR);
            AplicaFoco('#celular2');
          } else if (celula > 10) {
            $('#celular2 + p').remove();
            const ERROR = $('<p></p>').text('El campo debe tener maximo 10 caracteres.').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
            $('#celular2').after(ERROR);
            AplicaFoco('#celular2');
          } else if (/^0+$/.test($('#celular2').val())) {
            $('#celular2 + p').remove();
            const ERROR = $('<p></p>').text('El campo no puede contener solo ceros.').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
            $('#celular2').after(ERROR);
            AplicaFoco('#celular2');
          } else {
            $('#celular2 + p').remove();
            RemueveFoco('#celular2');
          }
        }

        // Fin - Se valida contenido del formulario
        if (!msg_error) {
          // var datos = null;
          $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
          var datos = new FormData();
          datos.append('documentos', document.getElementById('documentos').files[0]);

          if ($('#Conductor').is(':checked')) {
            //ARCHIVOS DEL CONDUCTOR
            //documento licencia
            datos.append('licencia', document.getElementById('licencia').files[0]);
            //documento eps
            datos.append('docu_eps', document.getElementById('docu_eps').files[0]);
            //documento empresarial 1
            datos.append('documento_referencia1', document.getElementById('documento_referencia1').files[0]);
            //documento empresarial 2
            datos.append('documento_referencia2', document.getElementById('documento_referencia2').files[0]);
            //documento empresarial 3
            datos.append('documento_referencia3', document.getElementById('documento_referencia3').files[0]);
            //documento personal 1
            datos.append('documento_personal1', document.getElementById('documento_personal1').files[0]);
            //documento personal 2
            datos.append('documento_personal2', document.getElementById('documento_personal2').files[0]);
            //carnet curso mercancias peligrosas
            datos.append('docu_curso', document.getElementById('docu_curso').files[0]);
            //rut
            datos.append('rut', document.getElementById('rut').files[0]);
            //fotos del conductor FRONTAL
            datos.append('foto_conductor', document.getElementById('foto_conductor').files[0]);
            //foto del conductor DERECHA
            datos.append('foto_derecha', document.getElementById('foto_derecha').files[0]);
            //foto del conductor izquierda
            datos.append('foto_izquierda', document.getElementById('foto_izquierda').files[0]);
            //foto de del conductor indumentaria
            datos.append('foto_indume', document.getElementById('foto_indume').files[0]);
            //acuerdo uno
            datos.append('acuerdo_uno', document.getElementById('acuerdo_uno').files[0]);
          }

          var name = $('#rndc_nombre').val();
          // datos.append("accion", "crearProveedor");
          datos.append('tipo_documento', $('#tipo_documento').val());
          datos.append('numero_documento', $('#numero_documento').val());
          datos.append('digito_verificacion', $('#digito_verificacion').val());
          datos.append('tipo_identificacion', $('#tipo_identificacion').val());
          datos.append('nombre', name);
          datos.append('abreviatura', $('#abreviatura').val());
          datos.append('contacto', $('#contacto').val());
          datos.append('celular', $('#celular').val());
          datos.append('direccion', $('#direccion').val());
          datos.append('email', $('#email').val());
          datos.append('municipio', $('#id_municipio').val());
          datos.append('estado', $('#estado').val());
          datos.append('Conductor', $('#Conductor').is(':checked'));
          datos.append('poseedor_vehiculo', $('#poseedor_vehiculo').is(':checked'));
          datos.append('propietario_vehiculo', $('#propietario_vehiculo').is(':checked'));
          datos.append('Proveedor', $('#Proveedor').is(':checked'));
          datos.append('propietario_trailer', $('#propietario_trailer').is(':checked'));
          datos.append('rndc_nombre', $('#rndc_nombre').val());
          datos.append('rndc_id_municipio', $('#rndc_id_municipio').val());
          datos.append('sexo', $('#sexo').val());
          if ($('#tipo_documento').val() == 'Cedula de Ciudadania' || $('#tipo_documento').val() == 'Cedula de Extranjeria') {
            var apellido1 = $('#primer_apellido').val();
            var apellido2 = $('#segundo_apellido').val();
            datos.append('1apellido', apellido1);
            datos.append('2apellido', apellido2);
          }

          if ($('#poseedor_vehiculo').is(':checked') || $('#propietario_vehiculo').is(':checked')) {
            datos.append('actividad_econo', $('#acti_economica').val());
            datos.append('tributarias', $('#tributaria').val());
            datos.append('banco', $('#banco').val());
            datos.append('tipocuenta', $('#tipo_cuenta').val());
            datos.append('numerocuenta', $('#num_cuenta').val());
            document.getElementById('tbl_datos_financieros').style.display = 'block';
          }

          if ($('#Conductor').is(':checked')) {
            // console.log("está seleccionada la opción conductor");
            datos.append('categoria_licencia', $('#categoria_licencia').val());
            datos.append('numero_licencia', $('#numero_licencia').val());
            datos.append('vencimiento_licencia', $('#vencimiento_licencia').val());
            if ($('#primer_apellido').val()) {
              datos.append('primer_apellido', $('#primer_apellido').val());
            }
            if ($('#segundo_apellido').val()) {
              datos.append('segundo_apellido', $('#segundo_apellido').val());
            }
            // alert('conductor datos');
            datos.append('celular2', $('#celular2').val());
            datos.append('vence_eps', $('#vence_eps').val());
            datos.append('vence_curso', $('#vence_curso').val());
            //referencias empresariales 1
            datos.append('referencias_empresariales1', $('#referencias_empresariales1').val());
            datos.append('fecha_referencia1', $('#fecha_referencia1').val());
            datos.append('fecha_retiro1', $('#fecha_retiro1').val());
            datos.append('contacto_ref1', $('#contacto_ref1').val());
            datos.append('celular_ref1', $('#celular_ref1').val());
            datos.append('cargo_ref1', $('#cargo_ref1').val());
            datos.append('anti_ref1', $('#anti_ref1').val());
            datos.append('idp1', $('#idp1').val());
            //referencias empresariales 2
            datos.append('referencias_empresariales2', $('#referencias_empresariales2').val());
            datos.append('fecha_referencia2', $('#fecha_referencia2').val());
            datos.append('fecha_retiro2', $('#fecha_retiro2').val());
            datos.append('contacto_ref2', $('#contacto_ref2').val());
            datos.append('celular_ref2', $('#celular_ref2').val());
            datos.append('cargo_ref2', $('#cargo_ref2').val());
            datos.append('anti_ref2', $('#anti_ref2').val());
            datos.append('idp2', $('#idp2').val());
            //referencias empresariales 3
            datos.append('referencias_empresariales3', $('#referencias_empresariales3').val());
            datos.append('fecha_referencia3', $('#fecha_referencia3').val());
            datos.append('fecha_retiro3', $('#fecha_retiro3').val());
            datos.append('contacto_ref3', $('#contacto_ref3').val());
            datos.append('celular_ref3', $('#celular_ref3').val());
            datos.append('cargo_ref3', $('#cargo_ref3').val());
            datos.append('anti_ref3', $('#anti_ref3').val());
            datos.append('idp3', $('#idp3').val());
            //referencias personales 1
            datos.append('referencias_personales', $('#referencias_personales1').val());
            datos.append('fecha_personal1', $('#fecha_personal1').val());
            datos.append('parenp1', $('#parenp1').val());
            datos.append('telefonop1', $('#telefonop1').val());
            //referencias personales 2
            datos.append('referencias_personales2', $('#referencias_personales2').val());
            datos.append('fecha_personal2', $('#fecha_personal2').val());
            datos.append('parenp2', $('#parenp2').val());
            datos.append('telefonop2', $('#telefonop2').val());
            //demás
            datos.append('sexo', $('#sexo').val());
            datos.append('fecha_nacimiento', $('#fecha_nacimiento').val());
            datos.append('sangre', $('#sangre').val());
            datos.append('fecha_ingreso', $('#fecha_ingreso').val());
            //NOMBRES DE LOS DOCUMENTOS
            datos.append('name_soporte', $('#name_soporte').val());
            datos.append('name_soporte2', $('#name_soporte2').val());
            datos.append('name_soporte3', $('#name_soporte3').val());
            datos.append('docu_personal1', $('#docu_personal1').val());
            datos.append('docu_personal2', $('#docu_personal2').val());
            datos.append('namedocu_eps', $('#namedocu_eps').val());
            datos.append('namedocu_curso', $('#namedocu_curso').val());
            datos.append('name_docurut', $('#name_docurut').val());
            datos.append('name_doculice', $('#name_doculice').val());
            datos.append('name_fontall', $('#name_fontall').val());
            datos.append('name_derecha', $('#name_derecha').val());
            datos.append('name_izquierda', $('#name_izquierda').val());
            datos.append('name_indum', $('#name_indum').val());
            //acuerdos
            datos.append('name_a1', $('#name_a1').val());
          }

          if ($('#Proveedor').is(':checked')) {
            datos.append('tipo_proveedor', $('.tipo_proveedor').val());
            datos.append('nacional', $('#nacional').is(':checked'));
            datos.append('internacional', $('#internacional').is(':checked'));
            datos.append('pv_localizacion', $('#pv_localizacion').val());
            datos.append('pv_zona', $('#pv_zona').val());
            datos.append('pv_tiposervice', $('#pv_tiposervice').val());
            datos.append('pv_via', $('#pv_via').val());
            datos.append('pv_select', $('#pv_select').val());
            datos.append('detalle_porteador', $('#detalle_porteador').val());
            datos.append('detalle_acarga', $('#detalle_acarga').val());
            datos.append('tramite_ad', $('#tramite_ad').val());
            datos.append('verifica', '');
            datos.append('una', 1);
          }

          var creacion_proveedor = false;
          try {
            const response = await fetch($('#id_url_ajax').val() + 'proveedores/Crear_proveedor', {
              method: 'POST',
              body: datos,
              cache: 'no-cache',
            });
            const data = await response.json();
            if (data.numero === 200) {
              creacion_proveedor = true;
              if ($('#Proveedor').is(':checked')) {
                insertcontac();
              }
              var contenidoHTML = `<div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-check"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> ${data.mensaje}
              </div>
            </div>`;
              sessionStorage.setItem('contenido', contenidoHTML);
              // $('#crea_proveedores').animate({scrollTop: 0}, 600);
            } else if (data.numero === 305) {
              var contenidoHTML = `<div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><i class="fa-solid fa-circle-info"></i></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> ${data.mensaje}
              </div>
            </div>`;
              sessionStorage.setItem('contenido', contenidoHTML);
            } else if (data.numero === 400) {
              var contenidoHTML = `<div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><i class="fa-solid fa-xmark"></i></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> ${data.mensaje}
              </div>
            </div>`;
              sessionStorage.setItem('contenido', contenidoHTML);
            } else if (data.numero === 405) {
              Swal.fire({
                // position: 'top-end',
                position: 'center',
                icon: 'warning',
                title: 'Advertencia!',
                text: data.mensaje,
                showConfirmButton: true,
                // timer: 1500,
              });
            }
            $('#nexos_messages_popup2').html('');
          } catch (error) {
            console.error('Error en la primera solicitud:', error);
            throw error;
          } finally {
            $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
            crear_Dato_Ministerio(creacion_proveedor);
          }
        } else {
          Swal.fire({
            // position: 'top-end',
            position: 'center',
            icon: 'warning',
            title: 'Advertencia!',
            html: msg_error,
            showConfirmButton: true,
            // timer: 1500,
          });

          $('#crea_proveedores').animate({scrollTop: 0}, 600);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        /* Read more about handling dismissals below */
        swalWithBootstrapButtons.fire({
          title: 'Cancelado',
          text: 'Verificar información',
          icon: 'info',
        });
      }
    });
  });

  $('#btn_editar_proveedor').click(function() {
    editarProveedor();
  });

  $('#btn_editar_proveedornew').click(function() {
    editarProveedornew();
  });

  $('#btn_activar_proveedor').click(function() {
    activarProveedor();
  });

  $('#btn_inactivar_proveedor').click(function() {
    inactivarProveedor();
  });

  $('#e_numero_documento').blur(function() {
    $('#e_digito_verificacion').val(calcularDigitoVerificacion($('#e_numero_documento').val()));
  });

  cargarmunicipios();
  paisesinternacional();

  $('#tipo_documento').change(function() {
    if ($('#tipo_documento').val() == 'NIT') {
      $('#tipo_identificacion').val('31');
    } else if ($('#tipo_documento').val() == 'Cedula de Ciudadania') {
      $('#tipo_identificacion').val('13');
    } else if ($('#tipo_documento').val() == 'Cedula de Extranjeria') {
      $('#tipo_identificacion').val('22');
    } else if ($('#tipo_documento').val() == 'Identificacion Tributaria Internacional') {
      $('#tipo_identificacion').val('');
    }
  });

  $('#e_tipo_documento').change(function() {
    if ($('#e_tipo_documento').val() == 'NIT') {
      $('#e_tipo_identificacion').val('31');
    } else if ($('#e_tipo_documento').val() == 'Cedula de Ciudadania') {
      $('#e_tipo_identificacion').val('13');
    } else if ($('#e_tipo_documento').val() == 'Cedula de Extranjeria') {
      $('#e_tipo_identificacion').val('22');
    }
  });

  //mostrar segun lo seleccionado

  $('#Conductor').change(function() {
    $('#datos_conductor').html('');
    if ($(this).is(':checked')) {
      /* Consultar datos desde el prefiltro */
      var datos = JSON.parse(sessionStorage.getItem('datos_valida'));
      if (datos.operacion === 'Recurso Nuevo') {
        var consulta_datos = {
          dato: datos.conductor,
          actividad: 'Conductor',
        };
        $.ajax({
          url: $('#id_url_ajax').val() + 'proveedores/Consultar_datos_estudio',
          type: 'POST',
          data: consulta_datos,
          dataType: 'json',
          success: function(data) {
            if (data) {
              $('#numero_documento').val(data.documento_conductor);
              $('#numero_documento').prop('disabled', true);
              $('#numero_licencia').val(data.documento_conductor);
              $('#numero_licencia').prop('disabled', true);
              var Nombre = Organizar_Nombres(data.name_conductor);
              if (Nombre !== false) {
                if (Nombre.logitud === 2) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                } else if (Nombre.logitud === 3) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#segundo_apellido').val(Nombre.apellido2);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                } else if (Nombre.logitud === 4) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#segundo_apellido').val(Nombre.apellido2);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                }
              } else {
                console.log('error');
              }
              // Referencia 1
              $('#referencias_empresariales1').val(data.empresa1);
              $('#referencias_empresariales1').prop('disabled', true);
              $('#fecha_referencia1').val(data.feca1);
              $('#fecha_referencia1').prop('disabled', true);
              $('#fecha_retiro1').val(data.feca2);
              $('#fecha_retiro1').prop('disabled', true);
              $('#contacto_ref1').val(data.persona1);
              $('#contacto_ref1').prop('disabled', true);
              $('#celular_ref1').val(data.cel1);
              $('#celular_ref1').prop('disabled', true);
              $('#cargo_ref1').val(data.cargo1);
              $('#cargo_ref1').prop('disabled', true);
              $('#anti_ref1').val(data.antiguedad1);
              $('#anti_ref1').prop('disabled', true);
              // Referencia 2
              $('#referencias_empresariales2').val(data.empresa2);
              $('#referencias_empresariales2').prop('disabled', true);
              $('#fecha_referencia2').val(data.fecb1);
              $('#fecha_referencia2').prop('disabled', true);
              $('#fecha_retiro2').val(data.fecb2);
              $('#fecha_retiro2').prop('disabled', true);
              $('#contacto_ref2').val(data.persona2);
              $('#contacto_ref2').prop('disabled', true);
              $('#celular_ref2').val(data.cel2);
              $('#celular_ref2').prop('disabled', true);
              $('#cargo_ref2').val(data.cargo2);
              $('#cargo_ref2').prop('disabled', true);
              $('#anti_ref2').val(data.antiguedad2);
              $('#anti_ref2').prop('disabled', true);
              // Referencia 3
              $('#referencias_empresariales3').val(data.empresa3);
              $('#referencias_empresariales3').prop('disabled', true);
              $('#fecha_referencia3').val(data.fecc1);
              $('#fecha_referencia3').prop('disabled', true);
              $('#fecha_retiro3').val(data.fecc2);
              $('#fecha_retiro3').prop('disabled', true);
              $('#contacto_ref3').val(data.persona3);
              $('#contacto_ref3').prop('disabled', true);
              $('#celular_ref3').val(data.cel3);
              $('#celular_ref3').prop('disabled', true);
              $('#cargo_ref3').val(data.cargo3);
              $('#cargo_ref3').prop('disabled', true);
              $('#anti_ref3').val(data.antiguedad3);
              $('#anti_ref3').prop('disabled', true);
              $('#datos_conductor').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
                <thead>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Catergoría Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                        <select id="categoria_licencia" style="width: 100%;">
                          <option value="" selected>Seleccione</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="C1">C1</option>
                          <option value="C2">C2</option>
                          <option value="C3">C3</option>
                        </select>
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Número de Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <input type="text" id="numero_licencia" placeholder="Número de Licencia" style="width: 100%;">
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Fecha vencimiento Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <input  type="date" value="" id="vencimiento_licencia" style="width: 100%;">
                      </td>
                    </tr>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Fecha Nacimiento:</th>
                      <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                        <input type="date" id="fecha_nacimiento" style="width: 100%;">
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Grupo sanguineo: (*)</label></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <select style="width: 100%;" id="sangre">
                          <option value="">Seleccione</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Documento Rut</th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                          <input type="file" name="file-2" id="rut" onchange="Rut(this.value)" data-multiple-caption="{count} archivos seleccionados" multiple style="width: 100%;">
                      </td>
                    </tr>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Nombre Documento Rut:</th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        <input type="text" style="width:100%;" id="name_docurut" disabled="disabled">
                      </td>
                        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Documento Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                        <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;"> <!--accept=".pdf"-->
                          <input type="file" name="file-2" id="licencia" data-multiple-caption="{count} archivos seleccionados" multiple style="width: 100%;" onchange="validarExtension(this.value);">
                        </td>
                        <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                          Nombre Documento Licencia</th>
                        <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                          <input type="text" style="width:100%;" id="name_doculice" disabled="disabled">
                        </td>
                      <input type="hidden" id="fecha_ingreso" class="form-control input-sm">
                    </tr>
                  </thead>
                </table>
              `);
            } else {
              console.log('Error al traer los datos');
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('no trajo datos');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
      } else if (datos.operacion === 'Prefiltro Nuevo') {
        var consulta_datos = {
          dato: datos.conductor,
          proveedor: 'Conductor',
        };
        $.ajax({
          url: $('#id_url_ajax').val() + 'proveedores/Consultar_Datos',
          type: 'POST',
          data: consulta_datos,
          dataType: 'json',
          success: function(data) {
            if (data) {
              $('#numero_documento').val(data.datos.documento_conductor);
              $('#numero_documento').prop('disabled', true);

              // Separar el nombre completo en palabras
              var Nombre = Organizar_Nombres(data.datos.nombre_conductor);
              if (Nombre !== false) {
                if (Nombre.logitud === 2) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                } else if (Nombre.logitud === 3) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#segundo_apellido').val(Nombre.apellido2);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                } else if (Nombre.logitud === 4) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#segundo_apellido').val(Nombre.apellido2);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                }
              } else {
                console.log('error');
              }
              // Referencia 1
              $('#referencias_empresariales1').val(data.referencias[0].nombre_empresa);
              $('#referencias_empresariales1').prop('disabled', true);
              $('#fecha_referencia1').val(data.referencias[0].fecha_ingreso);
              $('#fecha_referencia1').prop('disabled', true);
              $('#fecha_retiro1').val(data.referencias[0].fecha_retiro);
              $('#fecha_retiro1').prop('disabled', true);
              $('#contacto_ref1').val(data.referencias[0].persona_contacto);
              $('#contacto_ref1').prop('disabled', true);
              $('#celular_ref1').val(data.referencias[0].celular);
              $('#celular_ref1').prop('disabled', true);
              $('#cargo_ref1').val(data.referencias[0].cargo);
              $('#cargo_ref1').prop('disabled', true);
              $('#anti_ref1').val(data.referencias[0].antiguedad);
              $('#anti_ref1').prop('disabled', true);
              // Referencia 2
              $('#referencias_empresariales2').val(data.referencias[1].nombre_empresa);
              $('#referencias_empresariales2').prop('disabled', true);
              $('#fecha_referencia2').val(data.referencias[1].fecha_ingreso);
              $('#fecha_referencia2').prop('disabled', true);
              $('#fecha_retiro2').val(data.referencias[1].fecha_retiro);
              $('#fecha_retiro2').prop('disabled', true);
              $('#contacto_ref2').val(data.referencias[1].persona_contacto);
              $('#contacto_ref2').prop('disabled', true);
              $('#celular_ref2').val(data.referencias[1].celular);
              $('#celular_ref2').prop('disabled', true);
              $('#cargo_ref2').val(data.referencias[1].cargo);
              $('#cargo_ref2').prop('disabled', true);
              $('#anti_ref2').val(data.referencias[1].antiguedad);
              $('#anti_ref2').prop('disabled', true);
              // Referencia 3
              $('#referencias_empresariales3').val(data.referencias[2].nombre_empresa);
              $('#referencias_empresariales3').prop('disabled', true);
              $('#fecha_referencia3').val(data.referencias[2].fecha_ingreso);
              $('#fecha_referencia3').prop('disabled', true);
              $('#fecha_retiro3').val(data.referencias[2].fecha_retiro);
              $('#fecha_retiro3').prop('disabled', true);
              $('#contacto_ref3').val(data.referencias[2].persona_contacto);
              $('#contacto_ref3').prop('disabled', true);
              $('#celular_ref3').val(data.referencias[2].celular);
              $('#celular_ref3').prop('disabled', true);
              $('#cargo_ref3').val(data.referencias[2].cargo);
              $('#cargo_ref3').prop('disabled', true);
              $('#anti_ref3').val(data.referencias[2].antiguedad);
              $('#anti_ref3').prop('disabled', true);

              $('#datos_conductor').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
                <thead>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Catergoría Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                        <select id="categoria_licencia" style="width: 100%;">
                          <option value="" disabled selected>Seleccione</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="C1">C1</option>
                          <option value="C2">C2</option>
                          <option value="C3">C3</option>
                        </select>
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Número de Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <input type="text" id="numero_licencia" placeholder="Número de Licencia" style="width: 100%;">
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Fecha vencimiento Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <input  type="date" value="" id="vencimiento_licencia" style="width: 100%;">
                      </td>
                    </tr>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Fecha Nacimiento:</th>
                      <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                        <input type="date" id="fecha_nacimiento" style="width: 100%;">
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Grupo sanguineo: (*)</label></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <select style="width: 100%;" id="sangre">
                          <option value="">Seleccione</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Documento Rut</th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                          <input type="file" name="file-2" id="rut" onchange="Rut(this.value)" data-multiple-caption="{count} archivos seleccionados" multiple style="width: 100%;">
                      </td>
                    </tr>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Nombre Documento Rut:</th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        <input type="text" style="width:100%;" id="name_docurut" disabled="disabled">
                      </td>
                        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Documento Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                        <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;"> <!--accept=".pdf"-->
                          <input type="file" name="file-2" id="licencia" data-multiple-caption="{count} archivos seleccionados" multiple style="width: 100%;" onchange="validarExtension(this.value);">
                        </td>
                        <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                          Nombre Documento Licencia</th>
                        <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                          <input type="text" style="width:100%;" id="name_doculice" disabled="disabled">
                        </td>
                      <input type="hidden" id="fecha_ingreso" class="form-control input-sm">
                    </tr>
                  </thead>
                </table>
              `);
              $('#numero_licencia').val(data.datos.documento_conductor);
              $('#numero_licencia').prop('disabled', true);
            } else {
              $('#datos_conductor').html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
                <thead>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Catergoría Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                        <select id="categoria_licencia" style="width: 100%;">
                          <option value="" disabled selected>Seleccione</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="C1">C1</option>
                          <option value="C2">C2</option>
                          <option value="C3">C3</option>
                        </select>
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Número de Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <input type="text" id="numero_licencia" placeholder="Número de Licencia" style="width: 100%;">
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Fecha vencimiento Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <input  type="date" value="" id="vencimiento_licencia" style="width: 100%;">
                      </td>
                    </tr>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Fecha Nacimiento:</th>
                      <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                        <input type="date" id="fecha_nacimiento" style="width: 100%;">
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Grupo sanguineo: (*)</label></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <select style="width: 100%;" id="sangre">
                          <option value="">Seleccione</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Documento Rut</th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                          <input type="file" name="file-2" id="rut" onchange="Rut(this.value)" data-multiple-caption="{count} archivos seleccionados" multiple style="width: 100%;">
                      </td>
                    </tr>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Nombre Documento Rut:</th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        <input type="text" style="width:100%;" id="name_docurut" disabled="disabled">
                      </td>
                        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Documento Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                        <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;"> <!--accept=".pdf"-->
                          <input type="file" name="file-2" id="licencia" data-multiple-caption="{count} archivos seleccionados" multiple style="width: 100%;" onchange="validarExtension(this.value);">
                        </td>
                        <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                          Nombre Documento Licencia</th>
                        <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                          <input type="text" style="width:100%;" id="name_doculice" disabled="disabled">
                        </td>
                      <input type="hidden" id="fecha_ingreso" class="form-control input-sm">
                    </tr>
                  </thead>
                </table>
           `);
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('no trajo datos');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
      }

      $('.titulogeneral').show();
      $('#datos_generalest').show();
      $('.Datosespecificos').show();
      $('#datos_onlyconductor').show();
      $('#datos_financieros').hide();
      document.getElementById('tbl_datos_conductor').style.display = 'block';
      document.getElementById('tbl_datos_especificos').style.display = 'block';
      document.getElementById('tbl_datos_generales').style.display = 'block';
    } else {
      $('.titulogeneral').hide();
      $('#datos_generalest').hide();
      $('.Datosespecificos').hide();
      $('#datos_onlyconductor').hide();
      $('#datos_proveedor').hide();
      $('#datos_financieros').hide();
      document.getElementById('tbl_datos_conductor').style.display = 'none';
      document.getElementById('tbl_datos_especificos').style.display = 'none';
      if ($('#poseedor_vehiculo').is(':checked') || $('#propietario_vehiculo').is(':checked')) {
        document.getElementById('tbl_datos_generales').style.display = 'block';
      } else {
        document.getElementById('tbl_datos_generales').style.display = 'none';
      }
    }
  });

  $('#poseedor_vehiculo').change(function() {
    if ($(this).is(':checked')) {
      /* Consultar datos desde el prefiltro */
      var datos = JSON.parse(sessionStorage.getItem('datos_valida'));
      if (datos.operacion === 'Recurso Nuevo') {
        var consulta_datos = {
          dato: datos.poseedor,
          actividad: 'Poseedor Vehiculo',
        };
        $.ajax({
          url: $('#id_url_ajax').val() + 'proveedores/Consultar_datos_estudio',
          type: 'POST',
          data: consulta_datos,
          dataType: 'json',
          success: function(data) {
            if (data) {
              $('#numero_documento').val(data.documento_poseedor);
              $('#numero_documento').prop('disabled', true);
              var Nombre = Organizar_Nombres(data.name_poseedor);
              if (Nombre !== false) {
                if (Nombre.logitud === 2) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                } else if (Nombre.logitud === 3) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#segundo_apellido').val(Nombre.apellido2);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                } else if (Nombre.logitud === 4) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#segundo_apellido').val(Nombre.apellido2);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                }
              } else {
                console.log('error');
              }
            } else {
              console.log('Error al traer los datos');
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('no trajo datos');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });

        var consulta_datos = {
          action: 'Consulta_Datos_Financieros',
        };
        $.ajax({
          url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
          type: 'POST',
          data: consulta_datos,
          dataType: 'json',
          success: function(data) {
            $('#banco').html('<option value="">Seleccione</option>');
            $('#tributaria').val();
            $('#acti_economica').val();
            if (data.result) {
              data.result.forEach(function(element, index) {
                $('#banco').append('<option value="' + element.id + '">' + element.abreviatura + '</option>');
              });
            }
            if (data.result2) {
              data.result2.forEach(function(element, index) {
                $('#tributaria').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
              });
            }
            if (data.result3) {
              data.result3.forEach(function(element, index) {
                $('#acti_economica').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
              });
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('no trajo datos');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });

        $('#datos_financieros').html(`
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
          <thead>
              <tr>
                <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Actividad económica CIIU</th>
                <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                  <select id="acti_economica" class="select2" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
              </tr>
          </thead>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
          <thead>
              <tr>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Obligaciones tributarias:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="tributaria" class="select2" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Banco:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="banco" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Tipo de Cuenta:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="tipo_cuenta" style="width: 100%;">
                    <option value="">Seleccione</option>
                    <option value="1">Cuenta de Ahorros</option>
                    <option value="2">Cuenta Corriente</option>
                  </select>	
                </td>
                  <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                    Número de Cuenta:</th>
                  <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                    <input type="number" id="num_cuenta" style="width: 100%;">
                  </td>
              </tr>
            </thead>
          </table>`);
      } else if (datos.operacion === 'Prefiltro Nuevo') {
        var consulta_poseedor = {
          dato: datos.poseedor,
          proveedor: 'Poseedor',
        };
        $.ajax({
          url: $('#id_url_ajax').val() + 'proveedores/Consultar_Datos',
          type: 'POST',
          data: consulta_poseedor,
          dataType: 'json',
          success: function(data) {
            if (data) {
              $('#numero_documento').val(data.datos.documento_tenedor);
              $('#numero_documento').prop('disabled', true);
              // Separar el nombre completo en palabras
              var Nombre = Organizar_Nombres(data.datos.nombre_tenedor);
              if (Nombre !== false) {
                if (Nombre.logitud === 2) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                } else if (Nombre.logitud === 3) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#segundo_apellido').val(Nombre.apellido2);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                } else if (Nombre.logitud === 4) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#segundo_apellido').val(Nombre.apellido2);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                }
              } else {
                console.log('error');
              }
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('no trajo datos');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });

        var consulta_datos = {
          action: 'Consulta_Datos_Financieros',
        };
        $.ajax({
          url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
          type: 'POST',
          data: consulta_datos,
          dataType: 'json',
          success: function(data) {
            $('#banco').html('<option value="">Seleccione</option>');
            $('#tributaria').val();
            $('#acti_economica').val();
            if (data.result) {
              data.result.forEach(function(element, index) {
                $('#banco').append('<option value="' + element.id + '">' + element.abreviatura + '</option>');
              });
            }
            if (data.result2) {
              data.result2.forEach(function(element, index) {
                $('#tributaria').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
              });
            }
            if (data.result3) {
              data.result3.forEach(function(element, index) {
                $('#acti_economica').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
              });
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('no trajo datos');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
        $('#datos_financieros').html(`
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
          <thead>
              <tr>
                <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Actividad económica CIIU</th>
                <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                  <select id="acti_economica" class="select2" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
              </tr>
          </thead>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
          <thead>
              <tr>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Obligaciones tributarias:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="tributaria" class="select2" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Banco:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="banco" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Tipo de Cuenta:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="tipo_cuenta" style="width: 100%;">
                    <option value="">Seleccione</option>
                    <option value="1">Cuenta de Ahorros</option>
                    <option value="2">Cuenta Corriente</option>
                  </select>	
                </td>
                  <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                    Número de Cuenta:</th>
                  <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                    <input type="number" id="num_cuenta" style="width: 100%;">
                  </td>
              </tr>
            </thead>
          </table>`);
      }

      $('.titulogeneral').show();
      $('#datos_generalest').show();
      $('datos_conductor').hide();
      $('#datos_proveedor').hide();
      $('#datos_contacto').hide();
      $('#datos_financieros').show();
      document.getElementById('tbl_datos_financieros').style.display = 'block';
      document.getElementById('tbl_datos_generales').style.display = 'block';
    } else {
      $('.titulogeneral').hide();
      $('#datos_generalest').hide();
      $('datos_conductor').hide();
      $('#datos_proveedor').hide();
      $('#datos_contacto').hide();
      $('#datos_financieros').hide();
      document.getElementById('tbl_datos_financieros').style.display = 'none';
      document.getElementById('tbl_datos_generales').style.display = 'none';
    }
  });

  $('#propietario_vehiculo').change(function() {
    if ($(this).is(':checked')) {
      var datos = JSON.parse(sessionStorage.getItem('datos_valida'));
      if (datos.operacion === 'Recurso Nuevo') {
        var consulta_datos = {
          dato: datos.propietario,
          actividad: 'Propietario Vehiculo',
        };
        $.ajax({
          url: $('#id_url_ajax').val() + 'proveedores/Consultar_datos_estudio',
          type: 'POST',
          data: consulta_datos,
          dataType: 'json',
          success: function(data) {
            if (data) {
              $('#numero_documento').val(data.documento_propietario);
              $('#numero_documento').prop('disabled', true);
              var Nombre = Organizar_Nombres(data.name_propietario);
              if (Nombre !== false) {
                if (Nombre.logitud === 2) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                } else if (Nombre.logitud === 3) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#segundo_apellido').val(Nombre.apellido2);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                } else if (Nombre.logitud === 4) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#segundo_apellido').val(Nombre.apellido2);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                }
              } else {
                console.log('error');
              }
            } else {
              console.log('Error al traer los datos');
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('no trajo datos');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
        var consulta_datos = {
          action: 'Consulta_Datos_Financieros',
        };
        $.ajax({
          url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
          type: 'POST',
          data: consulta_datos,
          dataType: 'json',
          success: function(data) {
            $('#banco').html('');
            $('#tributaria').val();
            $('#acti_economica').val();
            if (data.result) {
              data.result.forEach(function(element, index) {
                $('#banco').append('<option value="' + element.id + '">' + element.abreviatura + '</option>');
              });
            }
            if (data.result2) {
              data.result2.forEach(function(element, index) {
                $('#tributaria').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
              });
            }
            if (data.result3) {
              data.result3.forEach(function(element, index) {
                $('#acti_economica').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
              });
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('no trajo datos');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
        $('#datos_financieros').html(`
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
          <thead>
              <tr>
                <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Actividad económica CIIU</th>
                <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                  <select id="acti_economica" class="select2" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
              </tr>
          </thead>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
          <thead>
              <tr>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Obligaciones tributarias:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="tributaria" class="select2" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Banco:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="banco" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Tipo de Cuenta:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="tipo_cuenta" style="width: 100%;">
                    <option value="">Seleccione</option>
                    <option value="1">Cuenta de Ahorros</option>
                    <option value="2">Cuenta Corriente</option>
                  </select>	
                </td>
                  <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                    Número de Cuenta:</th>
                  <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                    <input type="number" id="num_cuenta" style="width: 100%;">
                  </td>
              </tr>
            </thead>
          </table>`);
      } else if (datos.operacion === 'Prefiltro Nuevo') {
        var consulta_propietario = {
          dato: datos.propietario,
          proveedor: 'Propietario',
        };
        $.ajax({
          url: $('#id_url_ajax').val() + 'proveedores/Consultar_Datos',
          type: 'POST',
          data: consulta_propietario,
          dataType: 'json',
          success: function(data) {
            if (data) {
              $('#numero_documento').val(data.datos.documento_propietario);
              $('#numero_documento').prop('disabled', true);
              // Separar el nombre completo en palabras
              var Nombre = Organizar_Nombres(data.datos.nombre_propietario);
              if (Nombre !== false) {
                if (Nombre.logitud === 2) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                } else if (Nombre.logitud === 3) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#segundo_apellido').val(Nombre.apellido2);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                } else if (Nombre.logitud === 4) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#segundo_apellido').val(Nombre.apellido2);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                }
              } else {
                console.log('error');
              }
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('no trajo datos');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
        var consulta_datos = {
          action: 'Consulta_Datos_Financieros',
        };
        $.ajax({
          url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
          type: 'POST',
          data: consulta_datos,
          dataType: 'json',
          success: function(data) {
            $('#banco').html('<option value="">Seleccione</option>');
            $('#tributaria').val();
            $('#acti_economica').val();
            if (data.result) {
              data.result.forEach(function(element, index) {
                $('#banco').append('<option value="' + element.id + '">' + element.abreviatura + '</option>');
              });
            }
            if (data.result2) {
              data.result2.forEach(function(element, index) {
                $('#tributaria').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
              });
            }
            if (data.result3) {
              data.result3.forEach(function(element, index) {
                $('#acti_economica').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
              });
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('no trajo datos');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
        $('#datos_financieros').html(`
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
          <thead>
              <tr>
                <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Actividad económica CIIU</th>
                <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                  <select id="acti_economica" class="select2" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
              </tr>
          </thead>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
          <thead>
              <tr>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Obligaciones tributarias:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="tributaria" class="select2" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Banco:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="banco" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Tipo de Cuenta:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="tipo_cuenta" style="width: 100%;">
                    <option value="">Seleccione</option>
                    <option value="1">Cuenta de Ahorros</option>
                    <option value="2">Cuenta Corriente</option>
                  </select>	
                </td>
                  <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                    Número de Cuenta:</th>
                  <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                    <input type="number" id="num_cuenta" style="width: 100%;">
                  </td>
              </tr>
            </thead>
          </table>`);
      }
      $('.titulogeneral').show();
      $('#datos_generalest').show();
      $('datos_conductor').hide();
      $('#datos_proveedor').hide();
      $('#datos_contacto').hide();
      $('#datos_financieros').show();
      document.getElementById('tbl_datos_financieros').style.display = 'block';
      document.getElementById('tbl_datos_generales').style.display = 'block';
    } else {
      $('.titulogeneral').hide();
      $('#datos_generalest').hide();
      $('datos_conductor').hide();
      $('#datos_proveedor').hide();
      $('#datos_contacto').hide();
      $('#datos_financieros').hide();
      document.getElementById('tbl_datos_financieros').style.display = 'none';
      document.getElementById('tbl_datos_generales').style.display = 'none';
    }
  });

  $('#Proveedor').change(function() {
    if ($(this).is(':checked')) {
      $('.titulogeneral').show();
      $('#datos_generalest').show();
      $('#datos_proveedor').show();
      $('#datos_contacto').show();
      $('datos_conductor').hide();
      document.getElementById('tbl_detalle_proveedor').style.display = 'block';
      document.getElementById('tbl_contactos').style.display = 'block';
      // document.getElementById('tbl_datos_generales').style.display = 'block';
    } else {
      $('.titulogeneral').hide();
      $('#datos_generalest').hide();
      $('#datos_proveedor').hide();
      $('#datos_contacto').hide();
      $('datos_conductor').hide();
      document.getElementById('tbl_detalle_proveedor').style.display = 'none';
      document.getElementById('tbl_contactos').style.display = 'none';
      // document.getElementById('tbl_datos_generales').style.display = 'none';
    }
  });

  /* Propiertario Trailer */
  $('#propietario_trailer').change(function() {
    if ($(this).is(':checked')) {
      var datos = JSON.parse(sessionStorage.getItem('datos_valida'));
      if (datos.operacion === 'Recurso Nuevo') {
        var consulta_datos = {
          dato: datos.propietario_trailer,
          actividad: 'Propietario Trailer',
        };
        $.ajax({
          url: $('#id_url_ajax').val() + 'proveedores/Consultar_datos_estudio',
          type: 'POST',
          data: consulta_datos,
          dataType: 'json',
          success: function(data) {
            if (data) {
              $('#numero_documento').val(data.documento_propi_trailer);
              $('#numero_documento').prop('disabled', true);
              var Nombre = Organizar_Nombres(data.name_propietario_trailer);
              if (Nombre !== false) {
                if (Nombre.logitud === 2) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                } else if (Nombre.logitud === 3) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#segundo_apellido').val(Nombre.apellido2);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                } else if (Nombre.logitud === 4) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#segundo_apellido').val(Nombre.apellido2);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                }
              } else {
                console.log('error');
              }
            } else {
              console.log('Error al traer los datos');
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('no trajo datos');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
        $('.titulogeneral').show();
        $('#datos_generalest').show();
        $('datos_conductor').hide();
        $('#datos_proveedor').hide();
        $('#datos_contacto').hide();
        $('#datos_financieros').show();
        // document.getElementById('tbl_datos_financieros').style.display = 'block';
        document.getElementById('tbl_datos_generales').style.display = 'block';
      } else if (datos.operacion === 'Prefiltro Nuevo') {
        var consulta_propietario = {
          dato: datos.propietarioTrailer,
          proveedor: 'Propietario_Trailer',
        };
        $.ajax({
          url: $('#id_url_ajax').val() + 'proveedores/Consultar_Datos',
          type: 'POST',
          data: consulta_propietario,
          dataType: 'json',
          success: function(data) {
            if (data) {
              $('#numero_documento').val(data.datos.documento_propietario_trailer);
              $('#numero_documento').prop('disabled', true);
              // Separar el nombre completo en palabras
              var Nombre = Organizar_Nombres(data.datos.nombre_propietario_trailer);
              if (Nombre !== false) {
                if (Nombre.logitud === 2) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                } else if (Nombre.logitud === 3) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#segundo_apellido').val(Nombre.apellido2);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                } else if (Nombre.logitud === 4) {
                  $('#rndc_nombre').val(Nombre.nombres);
                  $('#primer_apellido').val(Nombre.apellido);
                  $('#segundo_apellido').val(Nombre.apellido2);
                  $('#rndc_nombre').prop('disabled', true);
                  $('#primer_apellido').prop('disabled', true);
                  $('#segundo_apellido').prop('disabled', true);
                }
              } else {
                console.log('error');
              }
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('no trajo datos');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
        $('.titulogeneral').show();
        $('#datos_generalest').show();
        $('datos_conductor').hide();
        $('#datos_proveedor').hide();
        $('#datos_contacto').hide();
        $('#datos_financieros').show();
        // document.getElementById('tbl_datos_financieros').style.display = 'block';
        document.getElementById('tbl_datos_generales').style.display = 'block';
      }
    } else {
      $('.titulogeneral').hide();
      $('#datos_generalest').hide();
      $('datos_conductor').hide();
      $('#datos_proveedor').hide();
      $('#datos_contacto').hide();
      $('#datos_financieros').hide();
      // document.getElementById('tbl_datos_financieros').style.display = 'none';
      document.getElementById('tbl_datos_generales').style.display = 'none';
    }
  });
  //final del seleccionado

  //PROVEEDORES INTERNACIONAL
  $('#agregar_fila').click(function() {
    agregar_contacto();
  });

  $('#agregar_filam').click(function() {
    agregar_contactom();
  });

  $('#pv_localizacion').change(function() {
    var local = $('#pv_localizacion').val();
    if (local == '') {
      $('#pv_zona').val('');
      $('.zona').hide();
    } else {
      $('.zona').show();
    }
  });

  $('#pv_tiposervice').change(function() {
    //limpiar los campos de cada tipo de servicio
    var tipo_service = $('#pv_tiposervice').val();
    if (tipo_service == '') {
      $('#pv_via').html('');
      $('#pv_select').html('');
      $('#detalle_porteador').val('');
      $('#detalle_acarga').html('');
      $('#tramite_ad').html('');
      $('#titulo_tservice').html('');
      $('#Transporte').hide();
      $('#porteadores').hide();
      $('#agencia_carga').hide();
      $('#tramite_admin').hide();
    } else {
      $('#tipos_servicios').show();
      if (tipo_service == 'Transporte') {
        //limpiar campos que no pertenecen a este tipo
        $('#detalle_porteador').val('');
        $('#detalle_acarga').val('');
        $('#tramite_ad').val('');
        //segun
        $('#titulo_tservice').html('TIPO SERVICIO: Transporte');
        $('#Transporte').show();
        $('#porteadores').hide();
        $('#agencia_carga').hide();
        $('#tramite_admin').hide();
      }

      if (tipo_service == 'Porteadores') {
        //limpiar campos
        $('#pv_via').val('');
        $('#pv_select').html('');
        $('#detalle_acarga').val('');
        $('#tramite_ad').val('');
        //
        $('#titulo_tservice').html('TIPO SERVICIO: Porteadores');
        $('#Transporte').hide();
        $('#porteadores').show();
        $('#agencia_carga').hide();
        $('#tramite_admin').hide();
      }

      if (tipo_service == 'Agenciamiento de carga') {
        //limpiar campos
        $('#pv_via').val('');
        $('#pv_select').html('');
        $('#detalle_porteador').val('');
        $('#tramite_ad').val('');
        //
        $('#titulo_tservice').html('TIPO SERVICIO: Agenciamiento de carga');
        $('#Transporte').hide();
        $('#porteadores').hide();
        $('#tramite_admin').hide();
        $('#agencia_carga').show();
      }

      if (tipo_service == 'Tramites administrativos') {
        //limpiar campos
        $('#pv_via').val('');
        $('#pv_select').html('');
        $('#detalle_porteador').val('');
        $('#detalle_acarga').val('');
        //
        $('#titulo_tservice').html('TIPO SERVICIO: Trámites Administrativos');
        $('#tramite_admin').show();
        $('#Transporte').hide();
        $('#porteadores').hide();
        $('#agencia_carga').hide();
      }

      if (tipo_service == 'Adecuaciones' || tipo_service == 'Aduana' || tipo_service == 'Impuestos' || tipo_service == 'Tramites operativos') {
        //limpiar campos
        $('#pv_via').val('');
        $('#pv_select').html('');
        $('#detalle_porteador').val('');
        $('#detalle_acarga').val('');
        $('#tramite_ad').val('');
        //
        $('#titulo_tservice').html('');
        $('#tramite_admin').hide();
        $('#Transporte').hide();
        $('#porteadores').hide();
        $('#agencia_carga').hide();
      }
    }
  });

  $('#pv_via').change(function() {
    $('#pv_select').html('');
    var via = $('#pv_via').val();
    if (via == '') {
      $('#pv_select').html('');
    }

    if (via == 'Aerea') {
      $('#pv_select').html(
        '<option value="Aerolinea de carga/pasajeros">Aerolinea de carga/pasajeros</option>' +
          '<option value="Courier Internacional">Courier Internacional</option>' +
          '<option value="Agentes aereos">Agentes aereos</option>' +
          '<option value="Aereos nacional">Aereos nacional</option>',
      );
    }

    if (via == 'Maritima') {
      $('#pv_select').html('<option value="Navieras">Navieras</option>' + '<option value="Agentes maritimos">Agentes maritimos</option>');
    }

    if (via == 'Terrestre') {
      $('#pv_select').html(
        '<option value="Transportadores terrestres">Transportadores terrestres</option>' +
          '<option value="Nacionales">Nacionales</option>' +
          '<option value="Transportadores urbanos">Transportadores urbanos</option>',
      );
    }
  });

  function paisesinternacional() {
    var paises = {
      action: 'localizacion_operacional',
    };
    $('#pv_localizacion').html('<option value="">Seleccione(Municipio-Depto-País)</option>');
    $.ajax({
      url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
      type: 'POST',
      data: paises,
      dataType: 'json',
      success: function(data) {
        data.result.forEach(function(element, index) {
          $('#pv_localizacion').append('<option value="' + element.id + '">' + element.municipio + '  -  ' + element.depto + '  -  ' + element.pais + '</option>');
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('no trajo paises localizacion operacional');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }

  $(document).on('click', '.borrar2', function(event) {
    event.preventDefault();
    $(this).closest('tr').remove();
    var v = this.id;
    //alert('v'+v);
    var x = v.substr(1, 1);
    x = parseInt(x);
    //$("#sk"+x).val();
    var d = $('#sk' + x).val();
  });

  var a = 0;
  var b = 0;
  function agregar_contacto() {
    a++;
    b = b + 1;
    var ch = '<input type="button" id="p' + a + '" class="btn-primary borrar2" value="Eliminar">';
    var contace = `
      <tr>
        <th style="background-color: #54B4D3; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;color:#ffffff;" colspan="6">
          Contacto N°${a}
        </th>
        <input type="hidden" id="sk${a}" value="1" class="form-control input-sm">
      </tr>
      <tr>
        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;" >
          Nombres:</th>
        <td class="text-right" style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;" colspan="6">
          <input type="text" id="nombres${a}" style="width:100%;">
        </td>
      </tr>
      <tr>
        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          Cargo:</th>
        <td class="text-right" style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          <input type="text" id="cargo${a}" style="width:100%;">
        </td>
        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          Teléfono:</th>
        <td class="text-right" style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          <input type="text" id="fijo${a}" style="width:100%;">
        </td>
        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          Celular:</th>
        <td class="text-right" style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          <input type="text" id="celular${a}" style="width:100%;">
        </td>
      </tr>
      <tr>
        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
        Correo:</th>
        <td class="text-right" style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          <input type="email" id="correo${a}" style="width:100%;">
        </td>
        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          Info. crítica:</th>
        <td class="text-right" style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          <textarea id="critica${a}" style="width:100%;" rows="1"></textarea>
        </td>
        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          Referencia:</th>
        <td class="text-right" style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          <textarea id="refe${a}" style="width:100%;" rows="1"></textarea>
        </td>
      </tr>
    `;
    $('#tabla_contacte').append(contace);
    $('#cont_contactos').val(b);
  }

  // Función de ajuste de nombre del proveedor dependiendo el tipo de documento
  $('#tipo_documento').change(function() {
    // Se filtran las validaciones de los campos contacto y celular dependiendo el tipo de documento seleccionado
    $('#contacto').removeAttr('maxlength');
    $('#celular').removeAttr('maxlength');

    if ($('#tipo_documento').val() != 'Identificacion Tributaria Internacional' || $('#tipo_documento').val() != 'NIT') {
      $('#abreviatura').val('');
      $('#abreviatura').attr('disabled', true);
    }

    if ($('#tipo_documento').val() != 'Identificacion Tributaria Internacional') {
      $('#contacto').val('');
      $('#contacto').attr('maxlength', '7');
      $('#celular').val('');
      $('#celular').attr('maxlength', '10');
    }
    // Se filtra la gestión de los campos dependiendo el tipo de documento seleccionado
    $('#primer_apellido').attr('disabled', false);
    $('#segundo_apellido').attr('disabled', false);
    if ($('#tipo_documento').val() == 'NIT' || $('#tipo_documento').val() == 'Identificacion Tributaria Internacional') {
      $('#primer_apellido').val('');
      $('#segundo_apellido').val('');
      $('#abreviatura').val('');
      $('#primer_apellido').attr('disabled', true);
      $('#segundo_apellido').attr('disabled', true);
      $('#abreviatura').attr('disabled', false);
    }
    //llenaNombreProveedor("nombre", "rndc_nombre", "primer_apellido", "segundo_apellido");
  });

  //Agregar datos bancarios a tabla proveedor - poseedor
  var cont_finan = 0;
  $('#adicione_cuenta').click(function() {
    cont_finan++;
    var buscar_datos = {
      action: 'Consulta_Datos_Financieros',
    };
    $.ajax({
      url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
      type: 'POST',
      data: buscar_datos,
      dataType: 'json',
      success: function(data) {
        if (data.result != null) {
          //bancos
          $('#bank' + cont_finan + '').html('<option value="">Seleccione</option>');
          data.result.forEach(function(element, index) {
            $('#bank' + cont_finan + '').append('<option value="' + element.id + '">' + element.abreviatura + '</option>');
          });
        }
        if (data.result2 != null) {
          $('#tributaria' + cont_finan + '').html('<option value="">Seleccione</option>');
          data.result2.forEach(function(element, index) {
            $('#tributaria' + cont_finan + '').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
          });
        }
        if (data.result3 != null) {
          $('#ciuu' + cont_finan + '').html('<option value="">Seleccione</option>');
          data.result3.forEach(function(element, index) {
            $('#ciuu' + cont_finan + '').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
          });
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('no datos bancarios');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
    var tipo_cuenta = '<option value="">Seleccione</option>' + '<option value="1">Cuenta Ahorros</option>' + '<option value="2">Cuenta corriente</option>';
    var mg = '<input type="button" id="r' + cont_finan + '" class="btn-primary ps' + cont_finan + '" value="Eliminar" onclick="delete_cuenta(' + cont_finan + ')">';

    var tabla =
      "<tr class='col" +
      cont_finan +
      "'>" +
      "<td class='col" +
      cont_finan +
      "'>" +
      mg +
      '</td>' +
      '<td col' +
      cont_finan +
      "><select id='ciuu" +
      cont_finan +
      "' class='form-control input-sm rciuu'></select> </td>" +
      '<td col' +
      cont_finan +
      "><select id='tributaria" +
      cont_finan +
      "' class='form-control input-sm rtributaria'></select></td>" +
      '<td col' +
      cont_finan +
      "><select id='bank" +
      cont_finan +
      "' class='form-control input-sm rbanco'></select></td>" +
      '<td col' +
      cont_finan +
      "><select id='tipologiacu" +
      cont_finan +
      "' class='form-control input-sm rtipologia'>" +
      tipo_cuenta +
      '</select></td>' +
      '<td col' +
      cont_finan +
      "><input type='number' id='numcuenta" +
      cont_finan +
      "' class='form-control input-sm rnum'></td>" +
      '</tr col' +
      cont_finan +
      '>';
    $('#dato_bancario').append(tabla);
  });

  $('#btn_crear_cuentas').click(function() {
    var msg_error = '';
    if (!$('.rciuu').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Actividad economica CIIU</strong> para poder crear la cuenta.</p>';
      AplicaFoco('.rciuu');
    } else {
      RemueveFoco('.rciuu');
    }
    if (!$('.rtributaria').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Obligación Tributaria</strong> para poder crear la cuenta.</p>';
      AplicaFoco('.rtributaria');
    } else {
      RemueveFoco('.rtributaria');
    }
    if (!$('.rbanco').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Banco</strong> para poder crear la cuenta.</p>';
      AplicaFoco('.rbanco');
    } else {
      RemueveFoco('.rbanco');
    }
    if (!$('.rtipologia').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Tipo cuenta</strong> para poder crear la cuenta.</p>';
      AplicaFoco('.rtipologia');
    } else {
      RemueveFoco('.rtipologia');
    }
    if (!$('.rnum').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Número cuenta</strong> para poder crear la cuenta.</p>';
      AplicaFoco('.rnum');
    } else {
      RemueveFoco('.rnum');
    }
    if (!msg_error) {
      Crear_Cuenta();
    } else {
      $('#nexos_messages_finan').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          '</div></div>',
      );
      $('#Agrega_Financiero').animate({scrollTop: 0}, 600);
    }
  });
});

$('#btnmascarae_direccion').click(function() {
  $('#div_mascarae').toggle();
});

$('#btnmascara_direccion').click(function() {
  $('#div_mascara').toggle();
});

var url = $('#id_url_ajax').val() + 'libs/proveedores_ajax.php';
//funcion para agregar el nombre del archivo a el input
function Rut(fic) {
  fic = fic.split('\\');
  if (fic == '' || fic == null) {
    $('#name_docurut').val('');
  } else {
    $('#name_docurut').val(fic[fic.length - 1]);
  }
}

function insertcontac() {
  var data = null;
  data = new FormData();
  var canti = $('#cont_contactos').val();
  if (canti > 0) {
    var i;
    for (i = 1; i <= canti; i++) {
      var nombre = $('#nombres' + i).val();
      var cargo = $('#cargo' + i).val();
      var fijo = $('#fijo' + i).val();
      var celular = $('#celular' + i).val();
      var correo = $('#correo' + i).val();
      var critica = $('#critica' + i).val();
      var refe = $('#refe' + i).val();
      // data.append('accion', 'crearContactos');
      data.append('nombre', nombre);
      data.append('cargo', cargo);
      data.append('fijo', fijo);
      data.append('celular', celular);
      data.append('correo', correo);
      data.append('critica', critica);
      data.append('refe', refe);
      data.append('verifica', 2);

      $.ajax({
        url: $('#id_url_ajax').val() + 'proveedores/Crear_Contacto',
        // url: url,
        type: 'POST',
        data: data,
        cache: false,
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
          console.log('si inserto contactos del proveedor');
          // alert('!!Registro Vehiculo exitosamente!!!');
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('no inserto contactos del proveedor');
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }
  }
}

var mintrans = 0;
async function crear_Dato_Ministerio(respuesta) {
  if (respuesta == true) {
    var id = $('#numero_documento').val();
    var tipdoc = $('#tipo_documento').val();
    if (id !== '') {
      //saber si es conductor o no
      var tipotercero = '';
      var tercero_clase = '';
      var driver = '';
      var holder = '';
      var owner = '';
      if ($('#Conductor').is(':checked')) {
        driver = 'Conductor ';
      }
      if ($('#poseedor_vehiculo').is(':checked')) {
        holder = 'Poseedor ';
      }
      if ($('#propietario_vehiculo').is(':checked')) {
        owner = 'Propietario';
      }
      tercero_clase = driver + holder + owner;
      //insertar tabla transaccional del ministerio
      var datos_crear = new FormData();
      datos_crear.append('num_documento', id);
      datos_crear.append('tercero_clase', tercero_clase);
      fetch($('#id_url_ajax').val() + 'proveedores/crear_transaccion_ministerio', {
        method: 'POST',
        body: datos_crear,
        cache: 'no-cache',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // parsea la respuesta como JSON
        })
        .then(data => {
          // Maneja los datos obtenidos
          console.log(data);
          if (data) {
            mintrans = 1;
          } else {
            mintrans = 0;
          }
        })
        .catch(error => {
          // Maneja los errores
          console.error('There was a problem with your fetch operation:', error);
        });
      // console.log('🚀 ~ crear_Dato_Ministerio ~ mintrans:', mintrans);
      if ($('#Conductor').is(':checked') || $('#poseedor_vehiculo').is(':checked') || $('#propietario_vehiculo').is(':checked')) {
        //alert('ENVIAR AL MINISTERIO');
        if ($('#Conductor').is(':checked')) {
          var conduce = 1;
        } else {
          var conduce = 0;
        }
        var proceso = 11;

        $('#loading-overlay-rndc ').css('display', 'flex'); // Mostrar mensaje de carga
        var datos_rndc = new FormData();
        datos_rndc.append('id', id);
        datos_rndc.append('tipdoc', tipdoc);
        datos_rndc.append('dato', 1);
        datos_rndc.append('filtro', tipotercero);
        datos_rndc.append('proceso', proceso);
        datos_rndc.append('tipopro', 2);
        datos_rndc.append('conduce', conduce);
        try {
          const response = await fetch($('#id_url_ajax').val() + 'web_service/terceros', {
            method: 'POST',
            body: datos_rndc,
            cache: 'no-cache',
          });
          const data = await response.json();
          var tablas_locales = '';
          if (data.status == 'true') {
            tablas_locales = 'Se Registro Datos Exitosamente RNDC';
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
          crear_Dato_Oet(true);
        }
      } else if (!$('#Conductor').is(':checked') && !$('#poseedor_vehiculo').is(':checked') && !$('#propietario_vehiculo').is(':checked')) {
        //proveedor
        // alert('Hola');
        setTimeout(function() {
          location.reload(false);
        }, 1000);
      }
    }
  }
}

async function crear_Dato_Oet(respuesta) {
  clase = 1;
  recurso = 1;

  activy1 = '';
  activy2 = '';
  activy3 = '';
  if ($('#propietario_vehiculo').is(':checked')) {
    activy2 = '3';
  }
  if ($('#poseedor_vehiculo').is(':checked')) {
    activy3 = '5';
  }
  if ($('#Conductor').is(':checked')) {
    activy1 = '4';
  }
  filtro = activy2 + activy3 + activy1;
  // var paquete = "clase_recurso=" + recurso + "&recurso=" + filtro + valor;
  $('#loading-overlay-oet ').css('display', 'flex'); // Mostrar mensaje de carga
  let datos_oet = new FormData();
  datos_oet.append('clase_recurso', recurso);
  datos_oet.append('recurso', filtro);
  datos_oet.append('dato_recurso', $('#numero_documento').val());
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
    var datos_el = JSON.parse(sessionStorage.getItem('datos_valida'));
    datos_el.elementos--;
    if (datos_el.elementos === 0) {
      $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      //Limpiar campos del modal
      Limpiar_Modal_proveedores();
      $('#Modal_Mensajes').modal('toggle');
      // $('#md-mensajes').modal('toggle');
      // Recuperar HTML de sessionStorage
      var contenidoNEXOS = sessionStorage.getItem('contenido');
      var contenidoOET = sessionStorage.getItem('contenido_oet');
      var contenidoRNDC = sessionStorage.getItem('contenido_rndc');
      // Concatenar ambos contenidos
      var contenidoTotal = contenidoNEXOS + contenidoRNDC + contenidoOET;
      // Mostrar el contenido recuperado en el documento
      document.getElementById('contenedor').innerHTML = contenidoTotal;
      sessionStorage.clear();
      setTimeout(() => {
        location.reload();
      }, 3000);
    } else {
      $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      $('#Modal_Mensajes').modal('toggle');
      // $('#md-mensajes').modal('toggle');
      // Recuperar HTML de sessionStorage
      var contenidoNEXOS = sessionStorage.getItem('contenido');
      var contenidoOET = sessionStorage.getItem('contenido_oet');
      var contenidoRNDC = sessionStorage.getItem('contenido_rndc');
      // Concatenar ambos contenidos
      var contenidoTotal = contenidoNEXOS + contenidoRNDC + contenidoOET;
      // Mostrar el contenido recuperado en el documento
      document.getElementById('contenedor').innerHTML = contenidoTotal;
      setTimeout(() => {
        location.reload();
      }, 1500);
    }
  }
}

function tipo_service() {
  var tp = $('#e_tiposervicio').val();

  $('#edetalle1').val('');
  $('#edetalle2').val('');

  if (tp == 'Transporte') {
    $('#edetalle1').html('<option value="Aerea">Aerea</option>' + '<option value="Maritima">Maritima</option>' + '<option value="Terrestre">Terrestre</option>');

    $('#edetalle2').html(
      '<option disabled="disabled">AEREA</option>' +
        '<option value="Courier Internacional">Courier Internacional</option>' +
        '<option value="Aerolinea de carga/pasajeros">Aerolinea de carga/pasajeros</option>' +
        '<option value="Agentes aereos">Agentes aereos</option>' +
        '<option value="Aereos nacional">Aereos nacional</option>' +
        '<option disabled="disabled">MARITIMA</option>' +
        '<option value="Navieras">Navieras</option>' +
        '<option value="Agentes maritimos">Agentes maritimos</option>' +
        '<option disabled="disabled">TERRESTRE</option>' +
        '<option value="Transportadores terrestres">Transportadores terrestres</option>' +
        '<option value="Nacionales">Nacionales</option>' +
        '<option value="Transportadores urbanos">Transportadores urbanos</option>',
    );
  }

  if (tp == 'Porteadores') {
    $('#edetalle1').html(
      '<option value="Puertos">Puertos</option>' +
        '<option value="Aeropuertos">Aeropuertos</option>' +
        '<option value="Entes regulatorios">Entes regulatorios</option>' +
        '<option value="Tramites en frontera">Trámites en frontera</option>',
    );
    $('#edetalle2').html('<option value="">No aplica</option>');
  }

  if (tp == 'Adecuaciones' || tp == 'Aduana' || tp == 'Impuestos' || tp == 'Tramites operativos') {
    $('#edetalle1').html('<option value="">No aplica</option>');
    $('#edetalle2').html('<option value="">No aplica</option>');
  }

  if (tp == 'Agenciamiento de carga') {
    $('#edetalle1').html('<option value="Agentes de carga">Agentes de carga</option>' + '<option value="Consolidador neutral">Consolidador neutral</option>');
    $('#edetalle2').html('<option value="">No aplica</option>');
  }

  if (tp == 'Tramites administrativos') {
    $('#edetalle1').html(
      '<option value="Navidad">Navidad</option>' +
        '<option value="Calendarios">Calendarios</option>' +
        '<option value="Dotaciones">Dotaciones</option>' +
        '<option value="Servicios públicos">Servicios públicos</option>',
    );
    $('#edetalle2').html('<option value="">No aplica</option>');
  }
}

function Crear_Cuenta() {
  var id = $('#num_proveedor').val();
  var dato = {
    ciu: [],
    obligacion: [],
    banco: [],
    tcuenta: [],
    ncuenta: [],
  };
  $('.rciuu').each(function(index) {
    var ciu = $(this).val();
    dato.ciu[index] = ciu;
  });
  $('.rtributaria').each(function(index) {
    var tribu = $(this).val();
    dato.obligacion[index] = tribu;
  });
  $('.rbanco').each(function(index) {
    var bank = $(this).val();
    dato.banco[index] = bank;
  });
  $('.rtipologia').each(function(index) {
    var tipo = $(this).val();
    dato.tcuenta[index] = tipo;
  });
  $('.rnum').each(function(index) {
    var numero = $(this).val();
    dato.ncuenta[index] = numero;
  });
  var notanew = dato;
  notanew = JSON.stringify(notanew);
  var envio_paquete = 'idproveedor=' + id + '&dato_bancario=' + notanew;
  $.post(
    $('#id_url_ajax').val() + 'solicitudes/Registro_Cuentas',
    envio_paquete,
    function(data) {
      if (data == 'true') {
        alert('Datos Registrados Exitosamente!!');
        location.reload();
      } else {
        alert('Ocurrio algo');
      }
    },
    'json',
  );
}

function AgregaFinanciero(idproveedor) {
  $('#num_proveedor').val(idproveedor);
}

function delete_cuenta(id) {
  event.preventDefault();
  $('.col' + id).remove();
  $('#ciuu' + id).remove();
  $('#tributaria' + id).remove();
  $('#bank' + id).remove();
  $('#tipologiacu' + id).remove();
  $('#numcuenta' + id).remove();
  $(this).closest('col').remove();
  $(this).closest('tipo_precinto').remove();
  $(this).closest('r').remove();
  $(this).closest('sellos').remove();
  $(this).closest('sk').remove();
  $(this).closest('num_preci').remove();
  alert('Dato Eliminado!!');
}

//Actualizar cuenta bancaria
function update_cuenta(cuenta, idtabla) {
  let ciu = $('#eactividadciu' + cuenta).val();
  let obli = $('#eobligacion' + cuenta).val();
  let bank = $('#banco' + cuenta).val();
  let tipoc = $('#etipocuenta' + cuenta).val();
  let numc = $('#enumcuenta' + cuenta).val();
  var actualiza_cuenta = {
    actividad_economica: ciu,
    obligacion: obli,
    banco: bank,
    tipo_cuenta: tipoc,
    numero_cuenta: numc,
    idtabla: idtabla,
    action: 'Actualiza_Cuenta_Bancaria',
  };
  $.ajax({
    url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
    type: 'POST',
    data: actualiza_cuenta,
    dataType: 'json',
    success: function(data) {
      alert('Datos Actualizados Exitosamente!!');
      location.reload();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

$(document).on('click', '.borrar2', function(event) {
  event.preventDefault();
  $(this).closest('tr').remove();
  var v = this.id;
  //alert('v'+v);
  var x = v.substr(1, 1);
  x = parseInt(x);
  //$("#sk"+x).val();
  var d = $('#sk' + x).val();
});

var m = 0;
var n = 0;
function agregar_contactom() {
  m++;
  n = n + 1;

  var ch = '<input type="button" id="p' + m + '" class="btn-primary" value="Remover"  onclick="delete_cont(this.id,' + m + ')"  >';

  var contace =
    '<tr class="trc' +
    m +
    '">' +
    //'<th>#</th><th>Nombres</th><th>Cargo</th><th>Teléfono</th></tr><tr>'+
    '<td colspan="2" class="info trc' +
    m +
    '" ><label>N°</label><p class="text-center text-primary"><strong>' +
    m +
    '</strong></p><input type="hidden" id="sk' +
    m +
    '" value="1" class="form-control input-sm">  </td>' +
    '</tr><tr class="trc' +
    m +
    '">' +
    '<td colspan="2" class="trc' +
    m +
    '"><label>Nombres</label> <input type="text" id="nombres' +
    m +
    '" class="form-control input-sm trc' +
    m +
    '"></td>' +
    '</tr><tr class="trc' +
    m +
    '">' +
    '<td class="trc' +
    m +
    '"><label>Cargo</label> <input type="text" id="cargo' +
    m +
    '" class="form-control input-xs trc' +
    m +
    '"></td>' +
    '<td class="trc' +
    m +
    '"><label>Teléfono</label> <input type="number" id="fijo' +
    m +
    '" class="form-control input-xs trc' +
    m +
    '"></td>' +
    '<tr class="trc' +
    m +
    '">' +
    '<td class="trc' +
    m +
    '"><label>Celular</label> <input type="number" id="celular' +
    m +
    '" class="form-control input-xs trc' +
    m +
    '">  </td>' +
    '<td class="trc' +
    m +
    '"><label>Correo</label>   <input type="email" id="correo' +
    m +
    '" class="form-control input-xs trc' +
    m +
    '" > </td>' +
    '</tr>' +
    '<tr class="trc' +
    m +
    '">' +
    '<td class="trc' +
    m +
    '"><label>Info. crítica</label> <textarea id="critica' +
    m +
    '" class="form-control input-xs trc' +
    m +
    '"></textarea>   </td>' +
    '<td class="trc' +
    m +
    '"><label>Referencia</label> <textarea id="refe' +
    m +
    '" class="form-control input-xs trc' +
    m +
    '"></textarea>  </td>' +
    '</tr>' +
    '<tr class="trc' +
    m +
    '"><td colspan="2">' +
    ch +
    '</td></tr>' +
    '</tr>';

  $('#mas_contactos').append(contace);
  $('#more_contactos').val(n);
}

//delete agregar
function delete_cont(btn, id) {
  event.preventDefault();
  $('.trc' + id).remove();
  $(this).closest('tr').remove();
}

//delete actualizar
function delete_asocia(btn, id) {
  var idtb = $('#idtb' + id + '').val();
  var delete_conta = {
    idtb: idtb,
    action: 'eliminar_contacto_proveedor',
  };

  $.ajax({
    url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
    type: 'POST',
    data: delete_conta,
    dataType: 'json',
    success: function(data) {
      event.preventDefault();
      $('.tr' + id).remove();
      $(this).closest('tr').remove();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('No elimino contacto');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function historicodatosProveedor(id) {
  //datos de la tabla
  var datos = {
    id: id,
    action: 'historicoproveedor',
  };
  $('#vehiculo').html('');
  $.ajax({
    url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
    type: 'POST',
    data: datos,
    dataType: 'json',
    success: function(data) {
      // console.log('hay historico');
      console.log(data);
      if (data) {
        // console.log('data si');
        if (data.result) {
          data.result.forEach(function(element, index) {
            $('#vehiculo').append(
              '<tr>' + '<td>' + element.estado + '</td>' + '<td>' + element.cod_vehiculo + '</td>' + '<td>' + element.fecha_anterior + '</td>' + '<td>' + element.fecha_actual + '</td>' + '</tr>',
            );
          });
        }
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no hay historico');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//VER PROVEEDOR ANTERIOR
function verProveedor(id_proveedor) {
  //alert(id_proveedor);
  var datos = {
    id: id_proveedor,
    // action: 'traer_datos_proveedorver',
  };
  $('#v_Conductor').html('');
  $('#v_poseedor_vehiculo').html('');
  $('#v_propietario_vehiculo').html('');
  $('#v_Proveedor').html('');
  $('.finan').val('');
  $.ajax({
    // url: $('#id_url_ajax').val() +'libs/hojas_de_vida_ajax.php', traer_datos_proveedorver
    url: $('#id_url_ajax').val() + 'proveedores/traer_datos_proveedorver',
    type: 'POST',
    data: datos,
    dataType: 'json',
    success: function(data) {
      if (data.resultados) {
        Consulta_Dato_Rndc(data.resultados[0].tipo_documento, data.resultados[0].numero_documento, data.resultados[0].digito_verificacion);
        Consulta_Dato_Oet(data.resultados[0].tipo_documento, data.resultados[0].numero_documento, data.resultados[0].digito_verificacion);
        //tipo de actividades
        // Initialize checkboxes to false
        $('#v_Conductor').prop('checked', false);
        $('#v_poseedor_vehiculo').prop('checked', false);
        $('#v_propietario_vehiculo').prop('checked', false);
        $('#v_Proveedor').prop('checked', false);

        data.resultado_actividad.forEach(function(element, index) {
          let actividad = element.acti;

          if (actividad === 'Conductor') {
            $('#v_Conductor').prop('checked', true);
          }
          if (actividad === 'Poseedor Vehiculo') {
            $('#v_poseedor_vehiculo').prop('checked', true);
          }
          if (actividad === 'Propietario Vehiculo') {
            $('#v_propietario_vehiculo').prop('checked', true);
          }
          if (actividad === 'Proveedor') {
            $('#v_Proveedor').prop('checked', true);
          }
        });

        //datos generales
        $('#titulo_ver').text(data.resultados[0].nombre + '-' + data.resultados[0].numero_documento);
        // $('#v_tipo_documento').val(data.resultados[0].tipo_documento);
        $('#v_tipo_documento').html(data.resultados[0].tipo_documento);
        // $('#v_numero_documento').val(data.result[0].numero_documento);
        $('#v_numero_documento').html(data.resultados[0].numero_documento);

        // $('#v_digito_verificacion').val(data.resultados[0].digito_verificacion);
        $('#v_digito_verificacion').html(data.resultados[0].digito_verificacion);
        // $('#v_tipo_regimen').val(data.resultados[0].tipo_regimen);
        $('#v_tipo_regimen').html(data.resultados[0].tipo_regimen);
        // $('#v_tipo_identificacion').val(data.resultados[0].tipo_identificacion);
        $('#v_tipo_identificacion').html(data.resultados[0].tipo_identificacion);
        // $('#v_nombre').val(data.resultados[0].nombre);
        $('#v_nombre').html(data.resultados[0].nombre);
        // $('#v_ape1').val(data.resultados[0].apellido1);
        $('#v_ape1').html(data.resultados[0].apellido1);
        // $('#v_ape2').val(data.resultados[0].apellido2);
        $('#v_ape2').html(data.resultados[0].apellido2);
        // $('#v_abreviatura').val(data.resultados[0].abreviatura);
        $('#v_abreviatura').html(data.resultados[0].abreviatura);
        // $('#v_contacto').val(data.resultados[0].contacto);
        $('#v_contacto').html(data.resultados[0].contacto);
        // $('#v_direccion').val(data.resultados[0].direccion);
        $('#v_direccion').html(data.resultados[0].direccion);
        $('#v_celular').html(data.resultados[0].celular);
        $('#v_celular2').html(data.resultados[0].celular2);
        // $('#v_email').val(data.resultados[0].email);
        $('#v_email').html(data.resultados[0].email);
        // $('#v_municipio').val(data.resultados[0].cipio);
        $('#v_municipio').html(data.resultados[0].cipio);
        // $('#v_estado').val(data.resultados[0].estado);
        $('#v_estado').html(data.resultados[0].estado);
        $('#v_id_municipio').val(data.resultados[0].cipio);
        // $('#v_name_documento').html(data.resultados[0].cipio); documentos_soporte
        document.getElementById('datos_proveedor_internacional').style.display = 'none';
        if (document.getElementById('v_Conductor').checked) {
          document.getElementById('datos_conductor').style.display = 'block';
          document.getElementById('datos_proveedor_internacional').style.display = 'none';
          data.resultado_actividad.forEach(function(element, index) {
            actividad = element.acti;
            //$("#e_primer_apellido").val(data.result[0].acti);
            if (actividad == 'Conductor') {
              // $('#v_Conductor').prop('checked', true);
              document.getElementById('documento').innerHTML = `<button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" id="btn_documento" onclick="abrir_fotos('${data.resultados[0]
                .documentos_soporte}','')" ><i class="fas fa-file-pdf"></i> Cedula Conductor</button>`;
            } else {
              // $('#v_Conductor').prop('checked', false);
              document.getElementById('documento').innerHTML = '<i class="fa-regular fa-id-card"></i> Sin documento';
              document.getElementById('documento').style.color = 'red';
              document.getElementById('documento').style.textAlign = 'center';
            }
          });

          // $('#v_categoria_licencia').val(data.resultados[0].rndc_categoria_licencia);
          $('#v_categoria_licencia').html(data.resultados[0].rndc_categoria_licencia);
          // $('#v_numero_licencia').val(data.resultados[0].rndc_numero_licencia);
          $('#v_numero_licencia').html(data.resultados[0].rndc_numero_licencia);
          // $('#v_fechavencelicencia').val(data.resultados[0].rndc_vencimiento_licencia);
          $('#v_fechavencelicencia').html(data.resultados[0].rndc_vencimiento_licencia);
          /******************************************************************************/
          $('#v_fecha_nacimiento').html(data.resultados[0].fecha_nacimiento);
          $('#v_sangre').html(data.resultados[0].grupo_sanguineo);
          if (data.resultados[0].n_docu_rut !== '' && data.resultados[0].n_docu_rut !== null) {
            document.getElementById('v_documento_rut').innerHTML = `<button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" id="btn_documento" onclick="abrir_fotos('${data
              .resultados[0].documento_rut}','${data.resultados[0].n_docu_rut}')" ><i class="fas fa-file-pdf"></i> Documento Rut</button>`;
          } else {
            document.getElementById('v_documento_rut').innerHTML = '<i class="fa-regular fa-id-card"></i> Sin documento';
            document.getElementById('v_documento_rut').style.color = 'red';
            document.getElementById('v_documento_rut').style.textAlign = 'center';
          }

          if (data.resultados[0].n_docu_licencia !== '' && data.resultados[0].n_docu_licencia !== null) {
            document.getElementById('v_documento_licencia').innerHTML = `<button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" id="btn_documento" onclick="abrir_fotos('${data
              .resultados[0].subir_licencia}','${data.resultados[0].n_docu_licencia}')" ><i class="fas fa-file-pdf"></i> Documento Licencia</button>`;
          } else {
            document.getElementById('v_documento_licencia').innerHTML = '<i class="fa-regular fa-id-card"></i> Sin documento';
            document.getElementById('v_documento_licencia').style.color = 'red';
            document.getElementById('v_documento_licencia').style.textAlign = 'center';
          }

          // $('#v_eps').val(data.resultados[0].nombre_eps); //seguridad social
          // $('#v_fechaeps').val(data.resultados[0].fecha_vence_eps); //seguridad social
          $('#v_fechaeps').html(data.resultados[0].fecha_vence_eps); //seguridad social
          if (data.resultados[0].n_docu_eps !== '' && data.resultados[0].n_docu_eps !== null) {
            document.getElementById('v_documento_seguridad_social').innerHTML = `<button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" onclick="abrir_fotos('${data.resultados[0]
              .documento_eps}', '${data.resultados[0].n_docu_eps}')"><i class="fa-regular fa-image"></i> Documento Seguridad Social</button>`;
          } else {
            document.getElementById('v_documento_seguridad_social').innerHTML = 'Sin documento';
            document.getElementById('v_documento_seguridad_social').style.color = 'red';
            document.getElementById('v_documento_seguridad_social').style.textAlign = 'center';
          }

          // Obtener la fecha actual
          var fechaActual = moment();
          // Convertir la fecha almacenada en el registro a un objeto Moment
          var fechaRegistroMomentEps = moment(data.resultados[0].fecha_vence_eps, 'YYYY-MM-DD');

          // Comparar las fechas
          if (fechaActual.isAfter(fechaRegistroMomentEps)) {
            // console.log('La fecha actual es posterior a la fecha registrada.');
            document.getElementById('v_estado_seguridad_social').innerHTML = 'Vencido';
            document.getElementById('v_estado_seguridad_social').style.backgroundColor = '#DC4C64';
            document.getElementById('v_estado_seguridad_social').style.color = '#FFFFFF';
            document.getElementById('v_estado_seguridad_social').style.textAlign = 'center';
          } else if (fechaActual.isBefore(fechaRegistroMomentEps)) {
            // console.log('La fecha actual es anterior a la fecha registrada.');
            document.getElementById('v_estado_seguridad_social').innerHTML = 'Vigente';
            document.getElementById('v_estado_seguridad_social').style.backgroundColor = '#14A44D';
            document.getElementById('v_estado_seguridad_social').style.color = '#FFFFFF';
            document.getElementById('v_estado_seguridad_social').style.textAlign = 'center';
          } else {
            // console.log('La fecha actual es igual a la fecha registrada.');
            document.getElementById('v_estado_seguridad_social').innerHTML = 'Pronto a vencer';
            document.getElementById('v_estado_seguridad_social').style.backgroundColor = '#E4A11B';
            document.getElementById('v_estado_seguridad_social').style.color = '#FFFFFF';
            document.getElementById('v_estado_seguridad_social').style.textAlign = 'center';
          }
          //$("#v_arl").val(data.resultados[0].nombre_arl);
          //$("#v_fechaarl").val(data.resultados[0].fecha_vence_arl);
          $('#v_curso').val(data.resultados[0].nombre_entidad);
          $('#v_fechacurso').html(data.resultados[0].vence_curso);
          // Curso de mercancias peligrosas
          if (data.resultados[0].n_docu_curso !== '' && data.resultados[0].n_docu_curso !== null) {
            document.getElementById('v_documento_mercancias_peligrosas').innerHTML = `<button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" onclick="abrir_fotos('${data
              .resultados[0].carnet_curso}', '${data.resultados[0].n_docu_curso}')"><i class="fa-regular fa-image"></i> Documento Mercancias Peligrosas</button>`;
          } else {
            document.getElementById('v_documento_mercancias_peligrosas').innerHTML = 'Sin documento';
            document.getElementById('v_documento_mercancias_peligrosas').style.color = 'red';
            document.getElementById('v_documento_mercancias_peligrosas').style.textAlign = 'center';
          }
          // Obtener la fecha actual utilizando Moment.js
          var fechaActual = moment();
          // Convertir la fecha almacenada en el registro a un objeto Moment
          var fechaRegistroMoment = moment(data.resultados[0].vence_curso, 'YYYY-MM-DD');

          // Comparar las fechas
          if (fechaActual.isAfter(fechaRegistroMoment)) {
            // console.log('La fecha actual es posterior a la fecha registrada.');
            document.getElementById('v_estado_mercancias_peligrosas').innerHTML = 'Vencido';
            document.getElementById('v_estado_mercancias_peligrosas').style.backgroundColor = '#DC4C64';
            document.getElementById('v_estado_mercancias_peligrosas').style.color = '#FFFFFF';
            document.getElementById('v_estado_mercancias_peligrosas').style.textAlign = 'center';
          } else if (fechaActual.isBefore(fechaRegistroMoment)) {
            // console.log('La fecha actual es anterior a la fecha registrada.');
            document.getElementById('v_estado_mercancias_peligrosas').innerHTML = 'Vigente';
            document.getElementById('v_estado_mercancias_peligrosas').style.backgroundColor = '#14A44D';
            document.getElementById('v_estado_mercancias_peligrosas').style.color = '#FFFFFF';
            document.getElementById('v_estado_mercancias_peligrosas').style.textAlign = 'center';
          } else {
            // console.log('La fecha actual es igual a la fecha registrada.');
            document.getElementById('v_estado_mercancias_peligrosas').innerHTML = 'Pronto a vencer';
            document.getElementById('v_estado_mercancias_peligrosas').style.backgroundColor = '#E4A11B';
            document.getElementById('v_estado_mercancias_peligrosas').style.color = '#FFFFFF';
            document.getElementById('v_estado_mercancias_peligrosas').style.textAlign = 'center';
          }

          // Agregar atributo para visuializar la licencia del conductor
          // var btn_licencia = document.getElementById('btn_documento_licencia');
          // btn_licencia.setAttribute('data-ruta_licencia', data.resultados[0].subir_licencia ? data.resultados[0].subir_licencia : '');
          // btn_licencia.setAttribute('data-name_licencia', data.resultados[0].n_docu_licencia ? data.resultados[0].n_docu_licencia : '');
          if (data.resultados[0].n_docu_licencia !== '' && data.resultados[0].n_docu_licencia !== null) {
            document.getElementById('v_documento_licencia_pdf').innerHTML = `<button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" onclick="abrir_fotos('${data.resultados[0]
              .subir_licencia}', '${data.resultados[0].n_docu_licencia}')"><i class="fa-regular fa-image"></i> Documento Licencia</button>`;
          } else {
            document.getElementById('v_documento_licencia_pdf').innerHTML = 'Sin documento';
            document.getElementById('v_documento_licencia_pdf').style.color = 'red';
            document.getElementById('v_documento_licencia_pdf').style.textAlign = 'center';
          }

          // Rut
          if (data.resultados[0].n_docu_rut !== '' && data.resultados[0].n_docu_rut !== null) {
            document.getElementById('v_certificado_rut').innerHTML = `<button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" onclick="abrir_fotos('${data.resultados[0]
              .documento_rut}', '${data.resultados[0].n_docu_rut}')"><i class="fa-regular fa-image"></i> Documento Seguridad Social</button>`;
          } else {
            document.getElementById('v_certificado_rut').innerHTML = 'Sin documento';
            document.getElementById('v_certificado_rut').style.color = 'red';
            document.getElementById('v_certificado_rut').style.textAlign = 'center';
          }
          // $('#v_fechacurso').val(data.resultados[0].vence_curso);
          // //
          // $('#v_sexo').val(data.resultados[0].sexo);
          $('#v_sexo').html(data.resultados[0].sexo);
          // $('#v_fecha_nacimiento').val(data.resultados[0].fecha_nacimiento);
          // $('#v_sangre').val(data.resultados[0].grupo_sanguineo);
          $('#v_ingreso').html(data.resultados[0].fecha_ingreso);
          //datos del conductor
          var cont = 0,
            i;
          if (data.resultado_referencias) {
            data.resultado_referencias.forEach(function(element, index) {
              cont++;
              $('#v_referencias_empresariales' + cont).html(element.nombre_empresa);
              $('#v_fechari' + cont).html(element.fecha_ingreso);
              $('#v_fecharr' + cont).html(element.fecha_retiro);
              $('#v_rcontac' + cont).html(element.persona_contacto);
              $('#v_rcelu' + cont).html(element.celular);
              $('#v_rcargo' + cont).html(element.cargo);
              $('#v_ranti' + cont).html(element.antiguedad);
            });
          }

          var contp = 0;
          if (data.resultado_referencias_personales) {
            data.resultado_referencias_personales.forEach(function(element, index) {
              contp++;
              var pare = element.parentezco;
              if (pare == 0) {
                $('#v_pare' + contp).html('SIN REGISTRAR');
              }
              if (pare == 1) {
                $('#v_pare' + contp).html('Amigo/a');
              }

              if (pare == 2) {
                $('#v_pare' + contp).html('Hermano/a');
              }

              if (pare == 3) {
                $('#v_pare' + contp).html('Padre');
              }

              if (pare == 4) {
                $('#v_pare' + contp).html('Madre');
              }

              if (pare == 5) {
                $('#v_pare' + contp).html('Tio/a');
              }

              if (pare == 6) {
                $('#v_pare' + contp).html('Sobrino/a');
              }

              if (pare == 7) {
                $('#v_pare' + contp).html('Hijo/a');
              }

              if (pare == 8) {
                $('#v_pare' + contp).html('Espaso/a');
              }

              $('#v_referencias_personales' + contp).html(element.nombre_personal);
              $('#v_fechap' + contp).html(element.fecha_personal);
              $('#v_ptel' + contp).html(element.tel_personal);
            });
          }
          //DOCUMENTOS.
          if (data.resultados[0].name_cfrontal !== '' && data.resultados[0].name_cfrontal !== null) {
            document.getElementById('foto_frontal').innerHTML = `
        <button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" onclick="abrir_fotos('${data.resultados[0].foto_conductor}', '${data.resultados[0]
              .name_cfrontal}')"><i class="fa-regular fa-image"></i> Foto Frontal</button>
        `;
          } else {
            document.getElementById('foto_frontal').innerHTML = 'Sin documento';
            document.getElementById('foto_frontal').style.color = 'red';
            document.getElementById('foto_frontal').style.textAlign = 'center';
          }

          if (data.resultados[0].name_cderecha !== '' && data.resultados[0].name_cderecha !== null) {
            document.getElementById('foto_frontal_derecha').innerHTML = `
        <button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" onclick="abrir_fotos('${data.resultados[0].foto_derecha}', '${data.resultados[0]
              .name_cderecha}')"><i class="fa-regular fa-image"></i> Foto Derecha</button>
        `;
          } else {
            document.getElementById('foto_frontal_derecha').innerHTML = 'Sin documento';
            document.getElementById('foto_frontal_derecha').style.color = 'red';
            document.getElementById('foto_frontal_derecha').style.textAlign = 'center';
          }

          if (data.resultados[0].name_cizquierda !== '' && data.resultados[0].name_cizquierda !== null) {
            document.getElementById('foto_frontal_izquierda').innerHTML = `
        <button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" onclick="abrir_fotos('${data.resultados[0].foto_izquierda}', '${data.resultados[0]
              .name_cizquierda}')"><i class="fa-regular fa-image"></i> Foto Izquierda</button>
        `;
          } else {
            document.getElementById('foto_frontal_izquierda').innerHTML = 'Sin documento';
            document.getElementById('foto_frontal_izquierda').style.color = 'red';
            document.getElementById('foto_frontal_izquierda').style.textAlign = 'center';
          }

          if (data.resultados[0].name_cindu !== '' && data.resultados[0].name_cindu !== null) {
            document.getElementById('foto_indumentaria').innerHTML = `
        <button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" onclick="abrir_fotos('${data.resultados[0].foto_indumentaria}', '${data.resultados[0]
              .name_cindu}')"><i class="fa-regular fa-image"></i> Foto Indumentaria</button>
        `;
          } else {
            document.getElementById('foto_indumentaria').innerHTML = 'Sin documento';
            document.getElementById('foto_indumentaria').style.color = 'red';
            document.getElementById('foto_indumentaria').style.textAlign = 'center';
          }
        } else {
          document.getElementById('datos_conductor').style.display = 'none';
          document.getElementById('datos_proveedor_internacional').style.display = 'block';
        }
      } else {
        console.log('no hay datos');
      }

      if (document.getElementById('v_Proveedor').checked) {
        document.getElementById('datos_proveedor_internacional').style.display = 'block';
        if (data.resultado_proveedor) {
          //datos del proveedor - internacional
          if (data.resultado_proveedor != null) {
            var tipo = data.resultado_proveedor[0].cod_tipo_proveedor;
            var t = '';
            if (tipo == 1) {
              t = 'Nacional';
            }

            if (tipo == 2) {
              t = 'Internacional';
            }
            // $('#v_proveedorinternacional').val(t);
            $('#v_proveedorinternacional').html(t);
            // $('#v_localizacion').val(data.resultado_proveedor[0].cipio);
            $('#v_localizacion').html(data.resultado_proveedor[0].cipio);
            $('#v_zona').html(data.resultado_proveedor[0].descripcion_zona);
            $('#v_tiposervice').html(data.resultado_proveedor[0].tipo_servicio);
            var servi = data.resultado_proveedor[0].tipo_servicio;
            if (servi == 'Transporte') {
              $('#v_de1').html(data.resultado_proveedor[0].tipo_servicio_detalle1);
              $('#v_de2').html(data.resultado_proveedor[0].tipo_servicio_detalle2);
            } else {
              $('#v_de1').html(data.resultado_proveedor[0].tipo_servicio_detalle1);
              $('#v_de2').html('');
            }
          }
          $('#tcontactos').html('');
          if (data.resultado_contacto != null) {
            data.resultado_contacto.forEach(function(element, index) {
              $('#tcontactos').append(
                '<tr>' +
                  '<td>' +
                  element.nombres_apellidos +
                  '</td>' +
                  '<td>' +
                  element.cargo +
                  '</td>' +
                  '<td>' +
                  element.telefono +
                  '</td>' +
                  '<td>' +
                  element.celular +
                  '</td>' +
                  '<td>' +
                  element.correo +
                  '</td>' +
                  '<td>' +
                  element.inf_critica +
                  '</td>' +
                  '<td>' +
                  element.referencias +
                  '</td>' +
                  +'</tr>',
              );
            });
          } else {
            $('#tcontactos').append(`Sin Contactos`);
          }
        }
      } else {
        console.log('no hay datos');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('error dato proveedor');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//Consulta al  Ministerio
function Consulta_Dato_Rndc(tipo, numero, digito) {
  $('#panel_rndc').html('');
  var paquete_transmite = 'documento=' + numero + '&tdoc=' + tipo + '&digitove=' + digito;
  $.post(
    $('#id_url_ajax').val() + 'web_service/Consulta_Tercero_Rndc',
    paquete_transmite,
    function(data) {
      var tablas_locales = '';
      if (data.status == 'true') {
        $('#panel_rndc').html('<p class="text-center text-success">' + data.resultado + '</p>');
      } else if (data.status == 'false') {
        $('#panel_rndc').html('<p class="text-center text-danger">' + data.resultado + '</p>');
      }
    },
    'json',
  );
}

function Consulta_Dato_Oet(tipo, numero, digito) {
  $('#panel_oet').html('');
  clase = 1;
  recurso = 1;
  valor = '&dato_recurso=' + numero;
  filtro = 5; //poseedor
  var paquete = 'clase_recurso=' + recurso + '&recurso=' + filtro + valor;
  //Consulta_Recurso_Avansat
  $.post(
    $('#id_url_ajax').val() + 'integrar_oet/Consulta_Recurso',
    paquete,
    function(data) {
      console.log(data);
      if (data.status == true || data.status == 'true') {
        $('#panel_oet').html('<p class="text-center text-success">' + data.resultado + '</p>');
      } else if (data.status == false || data.status == 'false') {
        $('#panel_oet').html('<p class="text-center text-danger">' + data.resultado + '</p>');
      }
    },
    'json',
  );
}

//EDITAR PROVEEDOR ANTERIOR
function editarProveedor() {
  $('.nexos-messages').html('');
  // Se valida contenido del formulario
  alert('entro a editarProveedor');
  var msg_error = '';
  var flag_primer_apellido = true;
  var flag_abreviatura = true;
  var flag_telefono = true;
  var tipo_actividad = false;

  $('.e_tipo_actividad').each(function() {
    if ($(this).is(':checked')) {
      tipo_actividad = true;
      if ($(this).attr('id') == 'e_Conductor') {
        if (!$('#e_categoria_licencia').val()) {
          msg_error += '<p>Debe seleccionar una <strong>Catergoría Licencia</strong> para poder editar el Proveedor.</p>';
        }
        if (!$('#e_numero_licencia').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Número de Licencia</strong> para poder editar el Proveedor.</p>';
        }
        if (!$('#e_vencimiento_licencia').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Vencimiento Licencia</strong> para poder editar el Proveedor.</p>';
        } else {
          if (!validaFechaActual($('#e_vencimiento_licencia').val())) {
            msg_error += '<p>El campo <strong>Vencimiento Licencia</strong> debe ser mayor de la fecha actual para poder editar el Proveedor.</p>';
          }
        }
        if ($('#e_tipo_documento').val() == 'NIT') {
          msg_error += '<p>No se puede crear un conductor registrado con NIT.</p>';
        }
      }
    }
  });
  if (!tipo_actividad) {
    msg_error += '<p>Debe seleccionar por lo menos un <strong>Tipo de actividad</strong> para poder editar el Proveedor.</p>';
  }
  if (!$('#e_tipo_documento').val()) {
    msg_error += '<p>Debe seleccionar un <strong>Tipo de documento</strong> para poder editar el Proveedor.</p>';
    if (!$('#e_contacto').val() && !$('#e_celular').val()) {
      flag_telefono = false;
      var msg_error_telefono = '<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> o <strong>Celular Contacto</strong> para poder editar el Proveedor.</p>';
    }
  } else {
    if ($('#e_tipo_documento').val() == 'Cedula de Ciudadania' || $('#e_tipo_documento').val() == 'Cedula de Extranjeria') {
      if (!$('#e_primer_apellido').val()) {
        flag_primer_apellido = false;
      }
      if (!$('#e_contacto').val() && !$('#e_celular').val()) {
        flag_telefono = false;
        var msg_error_telefono = '<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> o <strong>Celular Contacto</strong> para poder editar el Proveedor.</p>';
      }
    }
    if ($('#e_tipo_documento').val() == 'NIT') {
      if (!$('#e_contacto').val()) {
        flag_telefono = false;
        var msg_error_telefono = '<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> para poder editar el Proveedor.</p>';
      }
      if (!$('#e_abreviatura').val()) {
        flag_abreviatura = false;
        var msg_error_abreviatura = '<p>Debe diligenciar el campo <strong>Abreviatura</strong> para poder editar el Proveedor.</p>';
      }
    }
  }
  if (!$('#e_numero_documento').val()) {
    msg_error += '<p>Debe diligenciar el campo <strong>Número de documento</strong> para poder editar el Proveedor.</p>';
  }
  if (!$('#e_tipo_regimen').val()) {
    msg_error += '<p>Debe seleccionar un <strong>Tipo de régimen</strong> para poder editar el Proveedor.</p>';
  }
  if (!$('#e_rndc_nombre').val()) {
    msg_error += '<p>Debe diligenciar el campo <strong>Nombre o Razón social</strong> para poder editar el Proveedor.</p>';
  }
  if (!flag_primer_apellido) {
    msg_error += '<p>Debe diligenciar el campo <strong>Primer Apellido</strong> para poder editar el Proveedor.</p>';
  }
  if (!flag_abreviatura) {
    msg_error += msg_error_abreviatura;
  }
  if (!flag_telefono) {
    msg_error += msg_error_telefono;
  }
  if (!$('#e_direccion').val()) {
    msg_error += '<p>Debe diligenciar el campo <strong>Dirección</strong> para poder editar el Proveedor.</p>';
  }
  if (!$('#e_email').val()) {
    msg_error += '<p>Debe diligenciar el campo <strong>Correo electrónico</strong> para poder editar el Proveedor.</p>';
  }
  if (!$('#e_id_municipio').val()) {
    msg_error += '<p>Debe diligenciar el campo <strong>Municipio</strong> para poder editar el Proveedor.</p>';
  }
  // Fin - Se valida contenido del formulario

  if (!msg_error) {
    var data = null;
    data = new FormData();
    //ARCHIVOS PARA ACTUALIZAR
    var archivos = document.getElementById('e_documentos').files;
    for (var x = 0; x < archivos.length; x++) {
      data.append('documentos' + x, archivos[x]);
    }
    data.append('accion', 'editarProveedor');
    data.append('id_proveedor', $('#e_id_proveedor').val());
    data.append('tipo_documento', $('#e_tipo_documento').val());
    data.append('numero_documento', $('#e_numero_documento').val());
    data.append('digito_verificacion', $('#e_digito_verificacion').val());
    data.append('tipo_regimen', $('#e_tipo_regimen').val());
    data.append('tipo_identificacion', $('#e_tipo_identificacion').val());
    data.append('nombre', $('#e_nombre').val());
    data.append('abreviatura', $('#e_abreviatura').val());
    data.append('contacto', $('#e_contacto').val());
    data.append('celular', $('#e_celular').val());
    data.append('direccion', $('#e_direccion').val());
    data.append('email', $('#e_email').val());
    data.append('municipio', $('#e_id_municipio').val());
    data.append('estado', $('#e_estado').val());
    data.append('referencias_empresariales', $('#e_referencias_empresariales').val());
    data.append('referencias_personales', $('#e_referencias_personales').val());
    data.append('observaciones', $('#e_observaciones').val());
    data.append('Conductor', $('#e_Conductor').is(':checked'));
    data.append('Empleado', $('#e_Empleado').is(':checked'));
    data.append('poseedor_vehiculo', $('#e_poseedor_vehiculo').is(':checked'));
    data.append('propietario_vehiculo', $('#e_propietario_vehiculo').is(':checked'));
    data.append('Proveedor', $('#e_Proveedor').is(':checked'));
    data.append('rndc_nombre', $('#e_rndc_nombre').val());
    data.append('rndc_id_municipio', $('#e_rndc_id_municipio').val());

    if ($('#e_primer_apellido').val()) {
      data.append('primer_apellido', $('#e_primer_apellido').val());
    }
    if ($('#e_segundo_apellido').val()) {
      data.append('segundo_apellido', $('#e_segundo_apellido').val());
    }

    if ($('#e_Conductor').is(':checked')) {
      // console.log("está seleccionada la opción conductor");
      data.append('categoria_licencia', $('#e_categoria_licencia').val());
      data.append('numero_licencia', $('#e_numero_licencia').val());
      data.append('vencimiento_licencia', $('#e_vencimiento_licencia').val());
    }

    $.ajax({
      url: url,
      type: 'POST',
      data: data,
      cache: false,
      processData: false, // Don't process the files
      contentType: false, // Set content type to false as jQuery will tell the server its a query string request
      dataType: 'json',
      beforeSend: function(jqXHR, settings) {
        $('.nexos-messages').html(
          '<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' +
            $('#id_url_ajax').val() +
            'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>',
        );

        console.log(data);
      },
      success: function(data, textStatus, jqXHR) {
        // console.log(data);
        if (!data.error) {
          $('.nexos-messages').html(
            '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha actualizado el registro con éxito.</div></div>',
          );
          $('html, body').animate({scrollTop: 0}, 600);
          setTimeout(function() {
            location.reload(false);
          }, 800);
        } else {
          var msg_error = data.error.replace(/\n/g, '</p><p>');
          $('.nexos-messages').html(
            '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
              msg_error +
              '</div></div>',
          );
          $('html, body').animate({scrollTop: 0}, 600);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } else {
    $('.nexos-messages').html(
      '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
        msg_error +
        '</div></div>',
    );
    $('html, body').animate({scrollTop: 0}, 600);
  }
}

function datosinactivarproveedor(id_proveedor) {
  $('#i_id_proveedor').val(id_proveedor);
  var params = {
    accion: 'verProveedor',
    id_proveedor: id_proveedor,
  };
  $.post(
    url,
    params,
    function(data) {
      // console.log(data);
      if (data.success) {
        // $("#titulo_inactivar").text("¿Desea inactivar el proveedor con numero de documento "+data.content["numero_documento"]+"?");
      } else {
      }
    },
    'json',
  );
}

function datosactivarproveedor(id_proveedor) {
  $('#a_id_proveedor').val(id_proveedor);
  var params = {
    accion: 'verProveedor',
    id_proveedor: id_proveedor,
  };
  $.post(
    url,
    params,
    function(data) {
      // console.log(data);
      if (data.success) {
        // $("#titulo_activar").text("¿Desea activar el proveedor con numero de documento "+data.content["numero_documento"]+"?");
      } else {
      }
    },
    'json',
  );
}

function inactivarProveedor() {
  var params = {
    accion: 'inactivarProveedor',
    id_proveedor: $('#i_id_proveedor').val(),
  };
  $.post(
    url,
    params,
    function(data) {
      // console.log(data);
      if (data.success) {
        $('#btn_inactivar_proveedor').attr('data-dismiss', 'modal');
        location.reload();
      } else {
        $('#btn_inactivar_proveedor').removeAttr('data-dismiss');
      }
    },
    'json',
  );
}

function activarProveedor() {
  var params = {
    accion: 'activarProveedor',
    id_proveedor: $('#a_id_proveedor').val(),
  };
  $.post(
    url,
    params,
    function(data) {
      // console.log(data);
      if (data.success) {
        $('#btn_activar_proveedor').attr('data-dismiss', 'modal');
        location.reload();
      } else {
        $('#btn_activar_proveedor').removeAttr('data-dismiss');
      }
    },
    'json',
  );
}

function calcularDigitoVerificacion(myNit) {
  var vpri, x, y, z;
  // Se limpia el Nit
  myNit = myNit.replace(/\s/g, ''); // Espacios
  myNit = myNit.replace(/,/g, ''); // Comas
  myNit = myNit.replace(/\./g, ''); // Puntos
  myNit = myNit.replace(/-/g, ''); // Guiones

  // Se valida el nit
  if (isNaN(myNit)) {
    console.log("El nit/cédula '" + myNit + "' no es válido(a).");
    return '';
  }

  // Procedimiento
  vpri = new Array(16);
  z = myNit.length;

  vpri[1] = 3;
  vpri[2] = 7;
  vpri[3] = 13;
  vpri[4] = 17;
  vpri[5] = 19;
  vpri[6] = 23;
  vpri[7] = 29;
  vpri[8] = 37;
  vpri[9] = 41;
  vpri[10] = 43;
  vpri[11] = 47;
  vpri[12] = 53;
  vpri[13] = 59;
  vpri[14] = 67;
  vpri[15] = 71;

  x = 0;
  y = 0;
  for (var i = 0; i < z; i++) {
    y = myNit.substr(i, 1);
    // console.log ( y + "x" + vpri[z-i] + ":" ) ;
    x += y * vpri[z - i];
    // console.log ( x ) ;
  }

  y = x % 11;
  // console.log ( y ) ;
  return y > 1 ? 11 - y : y;
}

var municipios = [];
function cargarmunicipios() {
  var data = null;
  data = new FormData();
  data.append('accion', 'cargarmunicipios');
  municipios = [];
  $.ajaxSetup({async: false});
  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    cache: data,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    dataType: 'json',
    success: function(data, textStatus, jqXHR) {
      // console.log(data);
      if (data.success) {
        for (let x = 0; x < data.content.length; x++) {
          municipios.push(data.content[x]['MUNICIPIO']);
        }
        // console.log(municipios);
        $('#caja_municipio .typeahead').typeahead(
          {
            hint: true,
            highlight: true,
            minLength: 1,
          },
          {
            name: 'states',
            source: substringMatcher(municipios),
          },
        );

        $.ajaxSetup({async: false});
        $('#caja_municipio').bind('typeahead:selected', function(obj, datum, name) {
          var params = {
            accion: 'obtenerdatosmunicipio',
            municipio: datum,
          };
          $.post(
            url,
            params,
            function(data) {
              if (data.success) {
                var nombre = data.content.nombre;
                $('#municipio').val(nombre);
                $('#municipio_tabla').val(nombre);
                $('#id_municipio').val(data.content.id);
                $('#rndc_id_municipio').val(data.content.rndc_codigo_ciudad);
                $('#estado').focus();
              } else {
                $('#municipio').val('');
              }
            },
            'json',
          );
        });
        $.ajaxSetup({async: true});
        $('#municipio').focusout(function() {
          if ($.inArray($('#municipio').val(), municipios) == -1) {
          } else {
          }
        });
        $('#e_caja_municipio .typeahead').typeahead(
          {
            minLength: 1,
          },
          {
            name: 'states',
            source: substringMatcher(municipios),
          },
        );

        $.ajaxSetup({async: false});
        $('#e_caja_municipio').bind('typeahead:selected', function(obj, datum, name) {
          var params = {
            accion: 'obtenerdatosmunicipio',
            municipio: datum,
          };
          $.post(
            url,
            params,
            function(data) {
              // console.log(data);
              if (data.success) {
                var nombre = data.content.nombre;
                $('#e_municipio').val(nombre);
                $('#e_id_municipio').val(data.content.id);
                $('#e_rndc_id_municipio').val(data.content.rndc_codigo_ciudad);
                $('#e_estado').focus();
              } else {
                $('#e_municipio').val('');
              }
            },
            'json',
          );
        });
        $.ajaxSetup({async: true});
        $('#e_municipio').focusout(function() {
          // console.log($.inArray($("#e_municipio").val(), municipios));
          if ($.inArray($('#e_municipio').val(), municipios) == -1) {
            //$("#nombre_propietario").val("");
          } else {
          }
        });
      } else {
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
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

function Limpiar_Modal_proveedores() {
  // Conductores
  $('#tipo_documento').val('');
  $('#numero_documento').val('');
  $('#digito_verificacion').val('');
  $('#rndc_nombre').val('');
  $('#nombre').val('');
  $('#primer_apellido').val('');
  $('#segundo_apellido').val('');
  $('#abreviatura').val('');
  $('#contacto').val('');
  $('#celular').val('');
  $('#celular2').val('');
  $('#email').val('');
  $('#municipio').val('');
  $('#id_municipio').val('');
  $('#rndc_id_municipio').val('');
  $('#direccion').val('');
  $('#tipo_identificacion').val('');
  $('#estado').val('');
  $('#sexo').val('');
  $('#documentos').val(null);
  $('#docu_soporte').val('');
  $('#categoria_licencia').val('');
  $('#numero_licencia').val('');
  $('#vencimiento_licencia').val('');
  $('#fecha_nacimiento').val('');
  $('#sangre').val('');
  $('#rut').val(null);
  $('#name_docurut').val('');
  $('#licencia').val(null);
  $('#name_docurut').val('');
  $('#fecha_ingreso').val('');
  // Referencias empresariales
  $('#referencias_empresariales1').val('');
  $('#fecha_referencia1').val('');
  $('#fecha_retiro1').val('');
  $('#contacto_ref1').val('');
  $('#celular_ref1').val('');
  $('#cargo_ref1').val('');
  $('#anti_ref1').val('');
  $('#documento_referencia1').val(null);
  $('#name_soporte').val('');
  $('#idp1').val('');

  $('#referencias_empresariales2').val('');
  $('#fecha_referencia2').val('');
  $('#fecha_retiro2').val('');
  $('#contacto_ref2').val('');
  $('#celular_ref2').val('');
  $('#cargo_ref2').val('');
  $('#anti_ref2').val('');
  $('#documento_referencia2').val(null);
  $('#name_soporte2').val('');
  $('#idp2').val('');

  $('#referencias_empresariales3').val('');
  $('#fecha_referencia3').val('');
  $('#fecha_retiro3').val('');
  $('#contacto_ref3').val('');
  $('#celular_ref3').val('');
  $('#cargo_ref3').val('');
  $('#anti_ref3').val('');
  $('#documento_referencia3').val(null);
  $('#name_soporte3').val('');
  $('#idp3').val('');
  //Referencia personal
  $('#referencias_personales1').val('');
  $('#fecha_personal1').val('');
  $('#parenp1').val('');
  $('#telefonop1').val('');
  $('#documento_personal1').val(null);
  $('#docu_personal1').val('');

  $('#referencias_personales2').val('');
  $('#fecha_personal2').val('');
  $('#parenp2').val('');
  $('#telefonop2').val('');
  $('#documento_personal2').val(null);
  $('#docu_personal2').val('');

  //Seguridad Social
  $('#name_eps').val('');
  $('#vence_eps').val('');
  $('#docu_eps').val(null);
  $('#namedocu_eps').val('');

  // Curso Mercancias peligrosas
  $('#nom_enti').val('');
  $('#vence_curso').val('');
  $('#docu_curso').val('');
  $('#namedocu_curso').val('');

  //Foto Conductor
  $('#foto_conductor').val(null);
  $('#name_fontall').val('');
  $('#foto_derecha').val(null);
  $('#name_derecha').val('');
  $('#foto_izquierda').val(null);
  $('#name_izquierda').val('');
  $('#foto_indume').val(null);
  $('#name_indum').val('');
  $('#acuerdo_uno').val(null);
  $('#name_a1').val('');
}

function crear_proveedor() {
  window.location = `${$('#id_url_ajax').val()}solicitudes/crear_proveedores/${valores}`;
}

function validarExtension(fic) {
  var input = document.getElementById('licencia'); // Reemplaza 'tuInputFile' con el ID de tu input file
  var archivos = input.files[0];

  if (archivos) {
    // Lista de extensiones permitidas
    const extensionesPermitidas = ['pdf'];
    // Obtener el nombre del archivo del input
    const archivo = input.value;
    // var archivos = licencia_conductor.files[0];
    // Obtener la extensión del archivo
    const extension = archivo.split('.').pop().toLowerCase(); // Obtiene la última parte después del punto y la convierte a minúscula
    // Verificar si la extensión está en la lista de permitidas
    if (extensionesPermitidas.includes(extension)) {
      console.log('Extensión permitida: ' + extension);
      // Verifica el tamaño del archivo (en este caso, máximo 1MB)
      var maxSize = 1 * 1024 * 1024; // 1MB en bytes
      if (archivos.size > maxSize) {
        Swal.fire({
          title: 'Advertencia!',
          text: 'El archivo no debe superar el tamaño de 1MB.',
          icon: 'warning',
        });
        $('#name_doculice').val('');
        input.value = '';
      } else {
        // $('#documentos + p').remove();
        fic = fic.split('\\');
        if (fic == '' || fic == null) {
          $('#name_doculice').val('');
        } else {
          $('#name_doculice').val(fic[fic.length - 1]);
        }
      }
      return true;
    } else {
      Swal.fire({
        title: 'Advertencia!',
        text: 'Extensión no permitida: ' + extension,
        icon: 'warning',
      });
      input.value = ''; // Vaciar el campo para evitar cargar el archivo
      document.getElementById('name_doculice').value = ''; // Vaciar el campo para evitar cargar el archivo
      return false;
    }
  }
}

function abrir_fotos(url, name) {
  if (name == '') {
    // URL del PDF que deseas abrir en la nueva ventana
    var urlPDF = $('#id_url_ajax').val() + url;
    // Opciones de la ventana emergente (ancho, alto, posición, etc.)
    var opcionesVentana = 'width=1000,height=1000,scrollbars=yes';
    // Utiliza window.open para abrir el PDF en una nueva ventana
    window.open(urlPDF, '_blank', opcionesVentana);
  } else {
    // URL de la página que deseas abrir en la nueva ventana
    var url = $('#id_url_ajax').val() + url + name;
    // Opciones de la ventana emergente (ancho, alto, opciones adicionales)
    var ventanaAncho = 1000;
    var ventanaAlto = 1000;
    // Calcula las coordenadas para centrar la ventana
    var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
    var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
    // Opciones de la ventana emergente (ancho, alto, posición)
    var opcionesVentana = 'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
    // Utiliza window.open para abrir la nueva ventana
    window.open(url, name, opcionesVentana);
  }
}
