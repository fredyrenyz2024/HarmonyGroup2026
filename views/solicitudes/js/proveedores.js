const d = document;
const w = window;
// let valores = '';
// Ejemplo de uso
var claveSecreta = 'miClaveSecreta123';
d.addEventListener('DOMContentLoaded', async e => {
  cargarmunicipios();
  // Obtén la cadena de consulta de la URL
  var queryString = window.location;
  var queryString = window.location.search;
  // Crea un nuevo objeto URLSearchParams con la cadena de consulta
  var params = new URLSearchParams(queryString);
  // Obtiene el valor de la variable 'numproveedor'
  var numProveedor = params.get('num_proveedor');
  // Obtiene el valor de la variable 'idmenu'
  var valores = params.get('idmenu');
  paisesinternacional();

  let formdata = new FormData();
  formdata.append('id_proveedor', decodificarBase64(numProveedor));
  try {
    const response = await fetch($('#id_url_ajax').val() + 'proveedores/consultar_actividad_proveedor', {
      method: 'POST',
      body: formdata,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      // console.log(data);
      data.forEach(function(element, index) {
        actividad = element.acti;
        if (actividad == 'Conductor') {
          d.getElementById('tbl_datos_generales').style.display = 'block';
          d.getElementById('tbl_datos_conductor').style.display = 'block';
          d.getElementById('tbl_datos_especificos').style.display = 'block';
          datos_conductor();
          // d.getElementById('tr_foto').style.display = 'block';
        }
        if (actividad === 'Poseedor Vehiculo' || actividad === 'Propietario Vehiculo') {
          d.getElementById('tbl_datos_generales').style.display = 'block';
          // d.getElementById('tr_foto').style.display = 'none';
        }
        if (actividad === 'Poseedor Vehiculo') {
          d.getElementById('tbl_datos_generales').style.display = 'block';
          // d.getElementById('tr_foto').style.display = 'none';
        }
        if (actividad === 'Propietario Vehiculo') {
          d.getElementById('tbl_datos_generales').style.display = 'block';
          // d.getElementById('tr_foto').style.display = 'none';
        }
        if (actividad == 'Proveedor') {
          // d.getElementById('tbl_datos_generales').style.display = 'block';
          d.getElementById('tbl_detalle_proveedor').style.display = 'block';
          // $('#acordeon_proveedor').show();
          // $('#acordeon_conproveedor').show();
        }
      });
      editardatosProveedorn(decodificarBase64(numProveedor));
      d.getElementById('sin_datos').style.display = 'none';
      d.getElementById('datos').style.display = 'block';
    } else {
      d.getElementById('sin_datos').style.display = 'block';
      d.getElementById('datos').style.display = 'none';
      // $('#md-footer-primary').modal('toggle');
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
    d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }

  d.addEventListener('click', async e => {
    if (e.target.matches('#btn_documento_rut') || e.target.matches('#btn_documento_rut *')) {
      var btn_documento = d.getElementById('btn_documento_rut');
      var ruta = btn_documento.getAttribute('data-ruta_rut');
      var nombre = btn_documento.getAttribute('data-name_rut');
      abrir_fotos(ruta, nombre);
    }
    if (e.target.matches('#btn_documento_licencia') || e.target.matches('#btn_documento_licencia *')) {
      var btn_documento = d.getElementById('btn_documento_licencia');
      var ruta = btn_documento.getAttribute('data-ruta_licencia');
      var nombre = btn_documento.getAttribute('data-name_licencia');
      abrir_fotos(ruta, nombre);
    }

    if (e.target.matches('#btn_cancelar_registro') || e.target.matches('#btn_cancelar_registro')) {
      $('#md-footer-primary').modal('toggle');
      d.getElementById('titulo_alerta').textContent = '¿Estas seguro que deseas cancelar la actualización del proveedor?';
    }

    /* Boton para actualizar los datos */
    if (e.target.matches('#btn_editar_proveedornew') || e.target.matches('#btn_editar_proveedornew *')) {
      var tipo_actividades = d.querySelectorAll('.tipo_actividad');
      var cont_val = 0;

      // Datos generales
      if (!$('#rndc_nombre').val()) {
        // msg_error += "<p>Debe diligenciar el campo <strong>Nombre o Razón social</strong> para poder crear el Proveedor.</p>";
        $('#rndc_nombre + p').remove();
        const ERROR = $('<p></p>').text('Debe diligenciar el campo Nombre o Razón social').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
        $('#rndc_nombre').after(ERROR);
        AplicaFoco('#rndc_nombre');
      } else {
        RemueveFoco('#rndc_nombre');
        $('#rndc_nombre + p').remove();
        cont_val++;
      }

      if ($('#tipo_documento').val() === 'Cedula de Ciudadania') {
        if (!$('#primer_apellido').val()) {
          // msg_error += "<p>Debe diligenciar el campo <strong>Nombre o Razón social</strong> para poder crear el Proveedor.</p>";
          $('#primer_apellido + p').remove();
          const ERROR = $('<p></p>').text('Debe diligenciar el campo Nombre o Razón social').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
          $('#primer_apellido').after(ERROR);
          AplicaFoco('#primer_apellido');
        } else {
          RemueveFoco('#primer_apellido');
          $('#primer_apellido + p').remove();
          cont_val++;
        }
      } else {
        cont_val++;
        console.log('Hola desde nit');
      }

      if ($('#celular').val()) {
        var celula = $('#celular').val().toString().length;
        if (celula < 10) {
          // msg_error += '<p>El campo <strong>Celular 1</strong> debe tener 10 dígitos para poder crear el Proveedor.</p>';
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
          cont_val++;
        }
      }

      if (!$('#direccion').val()) {
        $('#direccion + p').remove();
        const ERROR = $('<p></p>').text('Debe diligenciar el campo Dirección').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
        $('#direccion').after(ERROR);
        AplicaFoco('#direccion');
        if (!$('#direccion').val()) {
          $('#direccion + p').remove();
          const ERROR = $('<p></p>').text('Debe diligenciar el campo Dirección').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
          $('#direccion').after(ERROR);
          AplicaFoco('#direccion');
        }
      } else {
        //validar contra mascara
        RemueveFoco('#direccion');
        $('#direccion + p').remove();
        cont_val++;
      }

      if (!$('#municipio_tabla').val()) {
        $('#municipio_tabla + p').remove();
        const ERROR = $('<p></p>').text('Debe diligenciar el campo Municipio').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
        $('#municipio_tabla').after(ERROR);
        AplicaFoco('#municipio_tabla');
      } else {
        RemueveFoco('#municipio_tabla');
        cont_val++;
      }

      tipo_actividades.forEach(element => {
        if (element.checked) {
          if (element.id === 'Conductor') {
            if (d.getElementById('celular2').value !== '') {
              var celula = $('#celular2').val().toString().length;
              if (celula < 10) {
                // msg_error += '<p>El campo <strong>Celular 1</strong> debe tener 10 dígitos para poder crear el Proveedor.</p>';
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
                RemueveFoco('#celular2');
                $('#celular2 + p').remove();
                cont_val++;
              }
            } else {
              $('#celular2 + p').remove();
              const ERROR = $('<p></p>').text('Debe diligenciar el celuar numero 2').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#celular2').after(ERROR);
              AplicaFoco('#celular2');
            }

            if (d.getElementById('numero_licencia').value !== '') {
              RemueveFoco('#numero_licencia');
              $('#numero_licencia + p').remove();
              cont_val++;
            } else {
              $('#numero_licencia + p').remove();
              const ERROR = $('<p></p>').text('Debe diligenciar el campo numero de licencia').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#numero_licencia').after(ERROR);
              AplicaFoco('#numero_licencia');
            }

            if (d.getElementById('vencimiento_licencia').value !== '') {
              RemueveFoco('#vencimiento_licencia');
              $('#vencimiento_licencia + p').remove();
              cont_val++;
            } else {
              $('#vencimiento_licencia + p').remove();
              const ERROR = $('<p></p>').text('Debe diligenciar la fecha de vencimiento de la licencia').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#vencimiento_licencia').after(ERROR);
              AplicaFoco('#vencimiento_licencia');
            }

            // Validar las referencias laborales
            if (d.getElementById('referencias_empresariales1').value !== '') {
              RemueveFoco('#referencias_empresariales1');
              $('#referencias_empresariales1 + p').remove();
              cont_val++;
            } else {
              $('#referencias_empresariales1 + p').remove();
              const ERROR = $('<p></p>').text('Debe diligenciar el nombre la empresa').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#referencias_empresariales1').after(ERROR);
              AplicaFoco('#referencias_empresariales1');
            }

            if (d.getElementById('celular_ref1').value !== '') {
              RemueveFoco('#celular_ref1');
              $('#celular_ref1 + p').remove();
              cont_val++;
            } else {
              $('#celular_ref1 + p').remove();
              const ERROR = $('<p></p>').text('Debe diligenciar el ceular de la empresa').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#celular_ref1').after(ERROR);
              AplicaFoco('#celular_ref1');
            }

            if (d.getElementById('referencias_empresariales2').value !== '') {
              RemueveFoco('#referencias_empresariales2');
              $('#referencias_empresariales2 + p').remove();
              cont_val++;
            } else {
              $('#referencias_empresariales2 + p').remove();
              const ERROR = $('<p></p>').text('Debe diligenciar el nombre la empresa').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#referencias_empresariales2').after(ERROR);
              AplicaFoco('#referencias_empresariales2');
            }

            if (d.getElementById('celular_ref2').value !== '') {
              RemueveFoco('#celular_ref2');
              $('#celular_ref2 + p').remove();
              cont_val++;
            } else {
              $('#celular_ref2 + p').remove();
              const ERROR = $('<p></p>').text('Debe diligenciar el ceular de la empresa').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#celular_ref2').after(ERROR);
              AplicaFoco('#celular_ref2');
            }

            if (d.getElementById('referencias_empresariales3').value !== '') {
              RemueveFoco('#referencias_empresariales3');
              $('#referencias_empresariales3 + p').remove();
              cont_val++;
            } else {
              $('#referencias_empresariales3 + p').remove();
              const ERROR = $('<p></p>').text('Debe diligenciar el nombre la empresa').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#referencias_empresariales3').after(ERROR);
              AplicaFoco('#referencias_empresariales3');
            }

            if (d.getElementById('celular_ref3').value !== '') {
              RemueveFoco('#celular_ref3');
              $('#celular_ref3 + p').remove();
              cont_val++;
            } else {
              $('#celular_ref3 + p').remove();
              const ERROR = $('<p></p>').text('Debe diligenciar el ceular de la empresa').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#celular_ref3').after(ERROR);
              AplicaFoco('#celular_ref3');
            }

            // Validar Referencias Personales
            if (d.getElementById('referencias_personales1').value !== '') {
              RemueveFoco('#referencias_personales1');
              $('#referencias_personales1 + p').remove();
              cont_val++;
            } else {
              $('#referencias_personales1 + p').remove();
              const ERROR = $('<p></p>').text('Debe diligenciar el nombre la persona').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#referencias_personales1').after(ERROR);
              AplicaFoco('#referencias_personales1');
            }

            if (d.getElementById('parenp1').value !== '') {
              RemueveFoco('#parenp1');
              $('#parenp1 + p').remove();
              cont_val++;
            } else {
              $('#parenp1 + p').remove();
              const ERROR = $('<p></p>').text('Debe seleccionar el parentesco').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#parenp1').after(ERROR);
              AplicaFoco('#parenp1');
            }

            if (d.getElementById('telefonop1').value !== '') {
              RemueveFoco('#telefonop1');
              $('#telefonop1 + p').remove();
              cont_val++;
            } else {
              $('#telefonop1 + p').remove();
              const ERROR = $('<p></p>').text('Debe diligenciar el celualr de la persona').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#telefonop1').after(ERROR);
              AplicaFoco('#telefonop1');
            }

            if (d.getElementById('referencias_personales2').value !== '') {
              RemueveFoco('#referencias_personales2');
              $('#referencias_personales2 + p').remove();
              cont_val++;
            } else {
              $('#referencias_personales2 + p').remove();
              const ERROR = $('<p></p>').text('Debe diligenciar el nombre la persona').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#referencias_personales2').after(ERROR);
              AplicaFoco('#referencias_personales2');
            }

            if (d.getElementById('parenp2').value !== '') {
              RemueveFoco('#parenp2');
              $('#parenp2 + p').remove();
              cont_val++;
            } else {
              $('#parenp2 + p').remove();
              const ERROR = $('<p></p>').text('Debe seleccionar el parentesco').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#parenp2').after(ERROR);
              AplicaFoco('#parenp2');
            }

            if (d.getElementById('telefonop2').value !== '') {
              RemueveFoco('#telefonop2');
              $('#telefonop2 + p').remove();
              cont_val++;
            } else {
              $('#telefonop2 + p').remove();
              const ERROR = $('<p></p>').text('Debe diligenciar el celualr de la persona').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#telefonop2').after(ERROR);
              AplicaFoco('#telefonop2');
            }

            if (d.getElementById('foto_frontal').textContent !== 'Sin documento') {
              RemueveFoco('#foto_conductor');
              $('#foto_conductor + p').remove();
              cont_val++;
            } else {
              var input_foto_frontal = document.getElementById('foto_conductor');
              if (input_foto_frontal.files.length === 0) {
                $('#foto_conductor + p').remove();
                const ERROR = $('<p></p>').text('Debe subir la foto frontal del conductor').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#foto_conductor').after(ERROR);
                AplicaFoco('#foto_conductor');
              } else {
                RemueveFoco('#foto_conductor');
                $('#foto_conductor + p').remove();
                cont_val++;
              }
            }

            if (d.getElementById('foto_frontal_derecha').textContent !== 'Sin documento') {
              RemueveFoco('#foto_derecha');
              $('#foto_derecha + p').remove();
              cont_val++;
            } else {
              var input_foto_derecha = document.getElementById('foto_derecha');
              if (input_foto_derecha.files.length === 0) {
                $('#foto_derecha + p').remove();
                const ERROR = $('<p></p>').text('Debe subir la foto derecha del conductor').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#foto_derecha').after(ERROR);
                AplicaFoco('#foto_derecha');
              } else {
                RemueveFoco('#foto_derecha');
                $('#foto_derecha + p').remove();
                cont_val++;
              }
            }

            if (d.getElementById('foto_frontal_izquierda').textContent !== 'Sin documento') {
              RemueveFoco('#foto_izquierda');
              $('#foto_izquierda + p').remove();
              cont_val++;
            } else {
              var input_foto_izquierda = document.getElementById('foto_izquierda');
              if (input_foto_izquierda.files.length === 0) {
                $('#foto_izquierda + p').remove();
                const ERROR = $('<p></p>').text('Debe subir la foto inzquierda del conductor').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#foto_izquierda').after(ERROR);
                AplicaFoco('#foto_izquierda');
              } else {
                RemueveFoco('#foto_izquierda');
                $('#foto_izquierda + p').remove();
                cont_val++;
              }
            }

            if (d.getElementById('foto_indumentaria').textContent !== 'Sin documento') {
              RemueveFoco('#foto_indume');
              $('#foto_indume + p').remove();
              cont_val++;
            } else {
              var input_foto_indume = document.getElementById('foto_indume');
              if (input_foto_indume.files.length === 0) {
                $('#foto_indume + p').remove();
                const ERROR = $('<p></p>').text('Debe subir la foto de indumentaria del conductor').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#foto_indume').after(ERROR);
                AplicaFoco('#foto_indume');
              } else {
                RemueveFoco('#foto_indume');
                $('#foto_indume + p').remove();
                cont_val++;
              }
            }

            if ($('#vence_eps').val()) {
              fecha = $('#vence_eps').val();
              var fhoy = moment();
              var horahoy = moment().format('HH:mm:ss');
              var tf = fhoy.diff(fecha, 'days');
              if (tf > 0) {
                // msg_error += '<p>Debe ingresar <strong>Fecha vencimiento plan seguridad social</strong> vigente para poder crear el Conductor.</p>';
                $('#vence_eps + p').remove();
                const ERROR = $('<p></p>')
                  .text('Debe ingresar Fecha vencimiento plan seguridad social vigente para poder crear el Conductor.')
                  .addClass('bg-danger text-center')
                  .css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#vence_eps').after(ERROR);
                AplicaFoco('#vence_eps');
              } else {
                RemueveFoco('#vence_eps');
                $('#vence_eps + p').remove();
                cont_val++;
              }
            } else {
              AplicaFoco('#vence_eps');
              $('#vence_eps + p').remove();
              const ERROR = $('<p></p>')
                .text('Debe ingresar fecha vencimiento de la planilla de seguridad social.')
                .addClass('bg-danger text-center')
                .css({color: '#FFF', 'font-size': '11px', margin: 0});
              $('#vence_eps').after(ERROR);
            }

            if ($('#vence_curso').val()) {
              fecha = $('#vence_curso').val();
              var fhoy = moment();
              var horahoy = moment().format('HH:mm:ss');
              var tf = fhoy.diff(fecha, 'days');
              if (tf > 0) {
                // msg_error += '<p>Debe ingresar <strong>Fecha Vencimiento del Curso </strong> vigente para poder crear el Conductor.</p>';
              }
            }

            // docu_eps
            if (d.getElementById('documento_seguridad_social').textContent === 'Sin documento') {
              if (!$('#docu_eps').val()) {
                // msg_error += '<p>Debe cargar el <strong>documento</strong> de la planilla de seguridad social.</p>';
                $('#docu_eps + p').remove();
                const ERROR = $('<p></p>').text('Debe cargar el documento  de la planilla de seguridad social.').addClass('bg-danger text-center').css({color: '#FFF', 'font-size': '11px', margin: 0});
                $('#docu_eps').after(ERROR);
                AplicaFoco('#docu_eps');
              } else {
                RemueveFoco('#docu_eps');
                $('#docu_eps + p').remove();
                cont_val++;
              }
            } else {
              RemueveFoco('#docu_eps');
              $('#docu_eps + p').remove();
              cont_val++;
            }
          }
        }
      });
      // Validacion para poder hacer el envio de los datows para actualizar el proveedor
      if (cont_val === 5 || cont_val === 26) {
        $('#md-actualizar').modal('toggle');
        d.querySelector('.titulo_alerta').textContent = '¿Estas seguro que deseas actualizar la información de este proveedor?';
      }
    }

    if (e.target.matches('#btn_aceptar') || e.target.matches('#btn_aceptar')) {
      window.location = `${$('#id_url_ajax').val()}solicitudes/proveedores/?idmenu=${valores}`;
    } else if (e.target.matches('#btn_aceptar_actualizacion') || e.target.matches('#btn_aceptar_actualizacion *')) {
      $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
      var datos = new FormData();
      // Primero se capturan los tipos de actividades que tiene el proveedor asignadas
      datos.append('Conductor', d.getElementById('Conductor').checked);
      datos.append('poseedor_vehiculo', d.getElementById('poseedor_vehiculo').checked);
      datos.append('propietario_vehiculo', d.getElementById('propietario_vehiculo').checked);
      datos.append('Proveedor', d.getElementById('Proveedor').checked);
      datos.append('numdoc_proveedor', decodificarBase64(numProveedor));

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
      datos.append('rndc_nombre', $('#rndc_nombre').val());
      datos.append('rndc_id_municipio', $('#rndc_id_municipio').val());
      datos.append('sexo', $('#sexo').val());

      if ($('#tipo_documento').val() == 'Cedula de Ciudadania' || $('#tipo_documento').val() == 'Cedula de Extranjeria') {
        var apellido1 = $('#primer_apellido').val();
        var apellido2 = $('#segundo_apellido').val();
        datos.append('1apellido', apellido1);
        datos.append('2apellido', apellido2);
      }

      if ($('#Conductor').is(':checked')) {
        datos.append('documentos', document.getElementById('documentos').files[0]);
        //documento licencia
        datos.append('licencia', document.getElementById('licencia').files[0]);
        //documento eps
        datos.append('docu_eps', document.getElementById('docu_eps').files[0]);
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
        datos.append('name_eps', $('#name_eps').val());
        datos.append('vence_eps', $('#vence_eps').val());
        //datos.append("ultimo_eps", $("#ultimo_eps").val());
        //datos.append("name_arl", $("#name_arl").val());
        //datos.append("vence_arl", $("#vence_arl").val());
        //datos.append("ultimo_arl", $("#ultimo_arl").val());
        datos.append('nom_enti', $('#nom_enti').val());
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
        datos.append('ref_id1', $('#ref_id1').val());
        //referencias personales 2
        datos.append('referencias_personales2', $('#referencias_personales2').val());
        datos.append('fecha_personal2', $('#fecha_personal2').val());
        datos.append('parenp2', $('#parenp2').val());
        datos.append('telefonop2', $('#telefonop2').val());
        datos.append('ref_id2', $('#ref_id2').val());
        //demás
        datos.append('sexo', $('#sexo').val());
        datos.append('fecha_nacimiento', $('#fecha_nacimiento').val());
        datos.append('sangre', $('#sangre').val());
        datos.append('fecha_ingreso', $('#fecha_ingreso').val());
        //NOMBRES DE LOS DOCUMENTOS
        // datos.append('name_soporte', $('#name_soporte').val());
        // datos.append('name_soporte2', $('#name_soporte2').val());
        // datos.append('name_soporte3', $('#name_soporte3').val());
        // datos.append('docu_personal1', $('#docu_personal1').val());
        // datos.append('docu_personal2', $('#docu_personal2').val());
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
        const response = await fetch($('#id_url_ajax').val() + 'proveedores/Actualizar_proveedor', {
          method: 'POST',
          body: datos,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data.numero === 200) {
          creacion_proveedor = true;
          // Guardar HTML en sessionStorage
          var contenidoHTML = `<div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-check"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> ${data.mensaje}
              </div>
            </div>`;
          sessionStorage.setItem('contenido', contenidoHTML);
        } else {
          var contenidoHTML = `<div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
            <div class="icon"><span class="mdi mdi-close-circle-o"></span></div>
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
        Actualiza_Dato_Ministerio(creacion_proveedor);
      }
    }

    if (e.target.matches('#btn-cerrar-mensajes') || e.target.matches('#btn-cerrar-mensajes *')) {
      location.reload();
      // Vaciar sessionStorage
      sessionStorage.clear();
    }
  });

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
});

function decryptData(encryptedData, key) {
  var bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Función para codificar en Base64
function codificarBase64(texto) {
  return btoa(texto);
}

// Función para decodificar Base64
function decodificarBase64(textoCodificado) {
  return atob(textoCodificado);
}

function datos_conductor() {
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
          <input type="hidden" style="width:100%;" id="name_docurut" disabled="disabled">
        </tr>
        <tr>
          <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
            Documento:</th>
          <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
            <button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" id="btn_documento_rut"><i class="fas fa-file-pdf"></i> Documento Rut</button>
          </td>
            <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
            Documento Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
            <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;"> <!--accept=".pdf"-->
              <input type="file" name="file-2" id="licencia" data-multiple-caption="{count} archivos seleccionados" multiple style="width: 100%;" onchange="validarExtension(this.value);">
            </td>
            <input type="hidden" style="width:100%;" id="name_doculice" disabled="disabled">
            <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
              Documento</th>
            <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
              <button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" id="btn_documento_licencia"><i class="fas fa-file-pdf"></i> Documento Licencia</button>
            </td>
          <input type="hidden" id="fecha_ingreso" class="form-control input-sm">
        </tr>
      </thead>
    </table>
`);
}

/* Funcion para colocar los datos del proveedor en los campos correspondientes */
async function editardatosProveedorn(id_proveedor) {
  // console.log('Desde la funcion de editar ' + id_proveedor);
  let formdata = new FormData();
  formdata.append('id_proveedor', id_proveedor);
  try {
    const response = await fetch($('#id_url_ajax').val() + 'proveedores/Consultar_datos_proveedor', {
      method: 'POST',
      body: formdata,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      data.resultado_actividad.forEach(function(element, index) {
        actividad = element.acti;
        // console.log('🚀 ~ actividad:', actividad);
        if (actividad == 'Conductor') {
          $('#Conductor').prop('checked', true);
          $('#Conductor').prop('disabled', true);
        } else {
          $('#Conductor').prop('disabled', true);
        }
        if (actividad == 'Poseedor Vehiculo') {
          $('#poseedor_vehiculo').prop('checked', true);
          $('#poseedor_vehiculo').prop('disabled', true);
        } else {
          $('#poseedor_vehiculo').prop('disabled', true);
        }
        if (actividad == 'Propietario Vehiculo') {
          $('#propietario_vehiculo').prop('checked', true);
          $('#propietario_vehiculo').prop('disabled', true);
        } else {
          $('#propietario_vehiculo').prop('disabled', true);
        }
        if (actividad == 'Proveedor') {
          $('#Proveedor').prop('checked', true);
          $('#Proveedor').prop('disabled', true);
          // $('#acordeon_proveedor').show();
        } else {
          $('#Proveedor').prop('disabled', true);
        }
      });

      if (data.resultado_actividad[0].acti !== 'Proveedor') {
        var foto = d.getElementById('fotos_proveedor');
        foto.innerHTML = ` <img style="width: 100%; height: 162px; border-radius: 2px;padding: 1px 1px 1px 15px;" src="${$('#id_url_ajax').val()}views/layout/assets/img/foto perfil.webp">`;
      } else {
        console.log('Sin foto');
        document.getElementById('tbl_contactos').style.display = 'block';
      }

      // Datos generales del proveedor
      d.getElementById('tipo_documento').value = data.resultado[0].tipo_documento;
      d.getElementById('tipo_documento').disabled = true;
      d.getElementById('numero_documento').value = data.resultado[0].numero_documento;
      d.getElementById('numero_documento').disabled = true;
      d.getElementById('rndc_nombre').value = data.resultado[0].nombre;
      d.getElementById('primer_apellido').value = data.resultado[0].apellido1;
      d.getElementById('segundo_apellido').value = data.resultado[0].apellido2;
      d.getElementById('digito_verificacion').value = data.resultado[0].digito_verificacion ? data.resultado[0].digito_verificacion : '';
      d.getElementById('abreviatura').value = data.resultado[0].abreviatura ? data.resultado[0].abreviatura : '';
      d.getElementById('contacto').value = data.resultado[0].contacto ? data.resultado[0].contacto : '';
      d.getElementById('celular').value = data.resultado[0].celular ? data.resultado[0].celular : '';
      d.getElementById('celular2').value = data.resultado[0].celular2 ? data.resultado[0].celular2 : '';
      d.getElementById('email').value = data.resultado[0].email ? data.resultado[0].email : '';
      data.resultado_municipios.forEach(element => {
        // console.log(element);
        if (element.id === data.resultado[0].id_municipio) {
          // console.log('Entro');
          d.getElementById('municipio_tabla').value = element.municipio + ' - ' + element.depto;
          d.getElementById('id_municipio').value = element.id;
          d.getElementById('rndc_id_municipio').value = element.rndc_codigo_ciudad;
        }
      });
      d.getElementById('direccion').value = data.resultado[0].direccion ? data.resultado[0].direccion : '';
      d.getElementById('tipo_identificacion').value = data.resultado[0].tipo_identificacion ? data.resultado[0].tipo_identificacion : '';
      d.getElementById('estado').value = data.resultado[0].estado ? data.resultado[0].estado : '';
      d.getElementById('sexo').value = data.resultado[0].sexo ? data.resultado[0].sexo : '';
      if (data.resultado[0].documentos_soporte !== '' && data.resultado[0].documentos_soporte !== null) {
        d.getElementById('documento').innerHTML = `<button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" id="btn_documento" onclick="abrir_fotos('${data.resultado[0].documentos_soporte}','')" ><i class="fas fa-file-pdf"></i> Cedula Conductor</button>`;
      } else {
        d.getElementById('documento').innerHTML = '<i class="fa-regular fa-id-card"></i> Sin documento';
        d.getElementById('documento').style.color = 'red';
        d.getElementById('documento').style.textAlign = 'center';
      }
      // console.log(data.resultado[0].rndc_numero_licencia);
      // Validar datos si es conductor
      if (data.resultado[0].rndc_numero_licencia !== '' && data.resultado[0].rndc_numero_licencia !== '0' && data.resultado[0].rndc_numero_licencia !== null) {
        // Datos del conductor
        // Colocar foto del proveedor
        var foto = d.getElementById('fotos_proveedor');
        foto.innerHTML = ` <img style="width: 100%; height: 162px; border-radius: 2px;padding: 1px 1px 1px 1px;" src="${$('#id_url_ajax').val() +
          data.resultado[0].foto_conductor +
          data.resultado[0].name_cfrontal}">`;

        d.getElementById('categoria_licencia').value = data.resultado[0].rndc_categoria_licencia ? data.resultado[0].rndc_categoria_licencia : '';
        d.getElementById('numero_licencia').value = data.resultado[0].rndc_numero_licencia ? data.resultado[0].rndc_numero_licencia : '';
        // d.getElementById('numero_licencia').disabled = true;
        d.getElementById('vencimiento_licencia').value = data.resultado[0].rndc_vencimiento_licencia ? data.resultado[0].rndc_vencimiento_licencia : '';
        d.getElementById('fecha_nacimiento').value = data.resultado[0].fecha_nacimiento ? data.resultado[0].fecha_nacimiento : '';
        d.getElementById('sangre').value = data.resultado[0].grupo_sanguineo ? data.resultado[0].grupo_sanguineo : '';
        var btn_rut = d.getElementById('btn_documento_rut');
        btn_rut.setAttribute('data-ruta_rut', data.resultado[0].documento_rut ? data.resultado[0].documento_rut : '');
        btn_rut.setAttribute('data-name_rut', data.resultado[0].n_docu_rut ? data.resultado[0].n_docu_rut : '');
        // Agregar atributo para visuializar la licencia del conductor
        var btn_licencia = d.getElementById('btn_documento_licencia');
        btn_licencia.setAttribute('data-ruta_licencia', data.resultado[0].subir_licencia ? data.resultado[0].subir_licencia : '');
        btn_licencia.setAttribute('data-name_licencia', data.resultado[0].n_docu_licencia ? data.resultado[0].n_docu_licencia : '');

        // Referencias empreseariales
        var cont = 0;
        if (data.resultado_referencia) {
          console.log(data.resultado_referencia);
          data.resultado_referencia.forEach(element => {
            cont++;
            d.getElementById('referencias_empresariales' + cont).value = element.nombre_empresa;
            d.getElementById('fecha_referencia' + cont).value = element.fecha_ingreso !== '0000-00-00' ? element.fecha_ingreso : '';
            d.getElementById('fecha_retiro' + cont).value = element.fecha_retiro !== '0000-00-00' ? element.fecha_retiro : '';
            d.getElementById('contacto_ref' + cont).value = element.persona_contacto;
            d.getElementById('celular_ref' + cont).value = element.celular;
            d.getElementById('cargo_ref' + cont).value = element.cargo;
            d.getElementById('anti_ref' + cont).value = element.antiguedad;
            d.getElementById('idp' + cont).value = element.id;
            // if (element.name_documento !== '' && element.name_documento !== null) {
            //   d.getElementById('documento_refef' + cont).innerHTML = `
            //   <button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" onclick='abrir_fotos(${element.documento_empresarial}, ${element.name_documento})'><i class="fas fa-file-pdf"></i> Documento Referencia 1</button>
            //   `;
            // } else {
            //   d.getElementById('documento_refef' + cont).innerHTML = 'Sin documento';
            //   d.getElementById('documento_refef' + cont).style.color = 'red';
            //   d.getElementById('documento_refef' + cont).style.textAlign = 'center';
            // }
          });
        } else {
          console.log(data.resultado_referencia);
        }

        var ref = 0;
        data.resultado_referencias_personales.forEach(element => {
          ref++;
          d.getElementById('referencias_personales' + ref).value = element.nombre_personal;
          d.getElementById('fecha_personal' + ref).value = element.fecha_personal !== '' ? element.fecha_personal : '';
          d.getElementById('parenp' + ref).value = element.parentezco;
          d.getElementById('telefonop' + ref).value = element.tel_personal;
          d.getElementById('ref_id' + ref).value = element.id;
        });

        // Curso de Seguridad Social
        if (data.resultado[0].n_docu_eps !== '' && data.resultado[0].n_docu_eps !== null) {
          d.getElementById('documento_seguridad_social').innerHTML = `<button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" onclick="abrir_fotos('${data.resultado[0]
            .documento_eps}', '${data.resultado[0].n_docu_eps}')"><i class="fa-regular fa-image"></i> Documento Seguridad Social</button>`;
        } else {
          d.getElementById('documento_seguridad_social').innerHTML = 'Sin documento';
          d.getElementById('documento_seguridad_social').style.color = 'red';
          d.getElementById('documento_seguridad_social').style.textAlign = 'center';
        }
        d.getElementById('vence_eps').value = data.resultado[0].fecha_vence_eps !== '' ? data.resultado[0].fecha_vence_eps : '';
        // Obtener la fecha actual
        var fechaActual = moment();
        // Convertir la fecha almacenada en el registro a un objeto Moment
        var fechaRegistroMomentEps = moment(data.resultado[0].fecha_vence_eps, 'YYYY-MM-DD');

        // Comparar las fechas
        if (fechaActual.isAfter(fechaRegistroMomentEps)) {
          // console.log('La fecha actual es posterior a la fecha registrada.');
          d.getElementById('estado_seguridad_social').innerHTML = 'Vencido';
          d.getElementById('estado_seguridad_social').style.backgroundColor = '#DC4C64';
          d.getElementById('estado_seguridad_social').style.color = '#FFFFFF';
          d.getElementById('estado_seguridad_social').style.textAlign = 'center';
        } else if (fechaActual.isBefore(fechaRegistroMomentEps)) {
          // console.log('La fecha actual es anterior a la fecha registrada.');
          d.getElementById('estado_seguridad_social').innerHTML = 'Vigente';
          d.getElementById('estado_seguridad_social').style.backgroundColor = '#14A44D';
          d.getElementById('estado_seguridad_social').style.color = '#FFFFFF';
          d.getElementById('estado_seguridad_social').style.textAlign = 'center';
        } else {
          // console.log('La fecha actual es igual a la fecha registrada.');
          d.getElementById('estado_seguridad_social').innerHTML = 'Pronto a vencer';
          d.getElementById('estado_seguridad_social').style.backgroundColor = '#E4A11B';
          d.getElementById('estado_seguridad_social').style.color = '#FFFFFF';
          d.getElementById('estado_seguridad_social').style.textAlign = 'center';
        }

        // Curso de mercancias peligrosas
        if (data.resultado[0].n_docu_curso !== '' && data.resultado[0].n_docu_curso !== null) {
          d.getElementById('documento_mercancias_peligrosas').innerHTML = `<button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" onclick="abrir_fotos('${data.resultado[0]
            .carnet_curso}', '${data.resultado[0].n_docu_curso}')"><i class="fa-regular fa-image"></i> Documento Mercancias Peligrosas</button>`;
        } else {
          d.getElementById('documento_mercancias_peligrosas').innerHTML = 'Sin documento';
          d.getElementById('documento_mercancias_peligrosas').style.color = 'red';
          d.getElementById('documento_mercancias_peligrosas').style.textAlign = 'center';
        }
        d.getElementById('vence_curso').value = data.resultado[0].vence_curso ? data.resultado[0].vence_curso : '';

        // Obtener la fecha actual
        // Asegúrate de incluir Moment.js en tu proyecto si no lo has hecho ya
        // Obtener la fecha actual utilizando Moment.js
        var fechaActual = moment();
        // Convertir la fecha almacenada en el registro a un objeto Moment
        var fechaRegistroMoment = moment(data.resultado[0].vence_curso, 'YYYY-MM-DD');

        // Comparar las fechas
        if (fechaActual.isAfter(fechaRegistroMoment)) {
          // console.log('La fecha actual es posterior a la fecha registrada.');
          d.getElementById('estado_mercancias_peligrosas').innerHTML = 'Vencido';
          d.getElementById('estado_mercancias_peligrosas').style.backgroundColor = '#DC4C64';
          d.getElementById('estado_mercancias_peligrosas').style.color = '#FFFFFF';
          d.getElementById('estado_mercancias_peligrosas').style.textAlign = 'center';
        } else if (fechaActual.isBefore(fechaRegistroMoment)) {
          // console.log('La fecha actual es anterior a la fecha registrada.');
          d.getElementById('estado_mercancias_peligrosas').innerHTML = 'Vigente';
          d.getElementById('estado_mercancias_peligrosas').style.backgroundColor = '#14A44D';
          d.getElementById('estado_mercancias_peligrosas').style.color = '#FFFFFF';
          d.getElementById('estado_mercancias_peligrosas').style.textAlign = 'center';
        } else {
          // console.log('La fecha actual es igual a la fecha registrada.');
          d.getElementById('estado_mercancias_peligrosas').innerHTML = 'Pronto a vencer';
          d.getElementById('estado_mercancias_peligrosas').style.backgroundColor = '#E4A11B';
          d.getElementById('estado_mercancias_peligrosas').style.color = '#FFFFFF';
          d.getElementById('estado_mercancias_peligrosas').style.textAlign = 'center';
        }

        if (data.resultado[0].name_cfrontal !== '' && data.resultado[0].name_cfrontal !== null) {
          d.getElementById('foto_frontal').innerHTML = `
          <button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" onclick="abrir_fotos('${data.resultado[0].foto_conductor}', '${data.resultado[0]
            .name_cfrontal}')"><i class="fa-regular fa-image"></i> Foto Frontal</button>
          `;
        } else {
          d.getElementById('foto_frontal').innerHTML = 'Sin documento';
          d.getElementById('foto_frontal').style.color = 'red';
          d.getElementById('foto_frontal').style.textAlign = 'center';
        }

        if (data.resultado[0].name_cderecha !== '' && data.resultado[0].name_cderecha !== null) {
          d.getElementById('foto_frontal_derecha').innerHTML = `
          <button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" onclick="abrir_fotos('${data.resultado[0].foto_derecha}', '${data.resultado[0]
            .name_cderecha}')"><i class="fa-regular fa-image"></i> Foto Derecha</button>
          `;
        } else {
          d.getElementById('foto_frontal_derecha').innerHTML = 'Sin documento';
          d.getElementById('foto_frontal_derecha').style.color = 'red';
          d.getElementById('foto_frontal_derecha').style.textAlign = 'center';
        }

        if (data.resultado[0].name_cizquierda !== '' && data.resultado[0].name_cizquierda !== null) {
          d.getElementById('foto_frontal_izquierda').innerHTML = `
          <button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" onclick="abrir_fotos('${data.resultado[0].foto_izquierda}', '${data.resultado[0]
            .name_cizquierda}')"><i class="fa-regular fa-image"></i> Foto Izquierda</button>
          `;
        } else {
          d.getElementById('foto_frontal_izquierda').innerHTML = 'Sin documento';
          d.getElementById('foto_frontal_izquierda').style.color = 'red';
          d.getElementById('foto_frontal_izquierda').style.textAlign = 'center';
        }

        if (data.resultado[0].name_cindu !== '' && data.resultado[0].name_cindu !== null) {
          d.getElementById('foto_indumentaria').innerHTML = `
          <button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" onclick="abrir_fotos('${data.resultado[0].foto_indumentaria}', '${data.resultado[0]
            .name_cindu}')"><i class="fa-regular fa-image"></i> Foto Indumentaria</button>
          `;
        } else {
          d.getElementById('foto_indumentaria').innerHTML = 'Sin documento';
          d.getElementById('foto_indumentaria').style.color = 'red';
          d.getElementById('foto_indumentaria').style.textAlign = 'center';
        }

        if (data.resultado[0].name_acuerdo1 !== '' && data.resultado[0].name_acuerdo1 !== null) {
          d.getElementById('foto_acuerdo').innerHTML = `
          <button class="btn btn-primary btn-xs" style="width: 100%;height: 100%;" onclick="abrir_fotos('${data.resultado[0].foto_acuerdo1}', '${data.resultado[0]
            .name_acuerdo1}')"><i class="fa-regular fa-image"></i> Mercancias peligrosas</button>
          `;
        } else {
          d.getElementById('foto_acuerdo').innerHTML = 'Sin documento';
          d.getElementById('foto_acuerdo').style.color = 'red';
          d.getElementById('foto_acuerdo').style.textAlign = 'center';
        }
      } else {
        // documento
        d.getElementById('documento').innerHTML = '<i class="fa-regular fa-id-card"></i> Sin documento';
        d.getElementById('documento').style.color = 'red';
        d.getElementById('documento').style.textAlign = 'center';
      }
    } else {
      console.log('Error al traer los campos');
    }

    // Traer datos de los proveedores Internacional
    if (data.result6) {
      var tp = data.result6[0].cod_tipo_proveedor;
      if (tp == 1) {
        $('#nacional').prop('checked', true);
      }
      if (tp == 2) {
        $('#internacional').prop('checked', true);
      }

      var municipio = $('#pv_localizacion').html('');
      data.result6[0].id_municipio.forEach(function(element, index) {
        var tmpSelected = '';
        if (element.selected) {
          tmpSelected = 'selected';
        }
        var municipio = $('#pv_localizacion').append('<option ' + tmpSelected + ' value="' + element.munid + '">' + element.munmun + '-' + element.mundepto + '-' + element.munpais + '</option>');
        $('.zona').show();
      });

      $('#pv_zona').val(data.result6[0].descripcion_zona);
      var ts = data.result6[0].tipo_servicio;
      d.getElementById('pv_tiposervice').value = ts;
      var du = data.result6[0].tipo_servicio_detalle1;
      var dd = data.result6[0].tipo_servicio_detalle2;

      // if (ts == 'Aduana' || ts == 'Impuestos' || ts == 'Adecuaciones' || ts == 'Tramites operativos') {
      //   $('#edetalle1').html('<option value="' + du + '">No aplica</option>');
      //   $('#edetalle2').html('<option value="' + dd + '">No aplica</option>');
      // }

      /* Tipo de servicio para editar */
      if (ts == 'Transporte' && du == 'Aerea') {
        $('#titulo_tservice').html('TIPO SERVICIO: Transporte');
        // pv_via
        d.getElementById('Transporte').style.display = 'block';
        d.getElementById('pv_via').value = du;

        if (dd == 'Aerolinea de carga/pasajeros') {
          $('#pv_select').html(
            `<option value="${dd}">${dd}</option>
            <option value="Courier Internacional">Courier Internacional</option>
            <option value="Agentes aereos">Agentes aereos</option>
            <option value="Aereos nacional">Aereos nacional</option>`,
          );
        }

        if (dd == 'Courier Internacional') {
          $('#pv_select').html(
            `<option value="${dd}">${dd}</option>
            <option value="Aerolinea de carga/pasajeros">Aerolinea de carga/pasajeros</option>
            <option value="Agentes aereos">Agentes aereos</option>
            <option value="Aereos nacional">Aereos nacional</option>`,
          );
        }

        if (dd == 'Agentes aereos') {
          $('#pv_select').html(
            `<option value="${dd}">${dd}</option>
            <option value="Aerolinea de carga/pasajeros">Aerolinea de carga/pasajeros</option>
            <option value="Courier Internacional">Courier Internacional</option>
            <option value="Aereos nacional">Aereos nacional</option>`,
          );
        }

        if (dd == 'Aereos nacional') {
          $('#pv_select').html(
            `<option value="${dd}">${dd}</option>
              <option value="Aerolinea de carga/pasajeros">Aerolinea de carga/pasajeros</option>
              <option value="Courier Internacional">Courier Internacional</option>
              <option value="Agentes aereos">Agentes aereos</option>`,
          );
        }
      } else {
        console.log('No es Area');
      }
      if (ts == 'Transporte' && du == 'Maritima') {
        $('#titulo_tservice').html('TIPO SERVICIO: Transporte');
        // pv_via
        d.getElementById('Transporte').style.display = 'block';
        d.getElementById('pv_via').value = du;
        if (dd == 'Navieras') {
          $('#pv_select').html('<option value="Navieras">Navieras</option>' + '<option value="Agentes maritimos">Agentes maritimos</option>');
        }

        if (dd == 'Agentes maritimos') {
          $('#pv_select').html('<option value="' + dd + '">' + dd + '</option>' + '<option value="Navieras">Navieras</option>');
        }
      } else {
        console.log('No es Maritima');
      }

      if (ts == 'Transporte' && du == 'Terrestre') {
        $('#titulo_tservice').html('TIPO SERVICIO: Transporte');
        // pv_via
        d.getElementById('Transporte').style.display = 'block';
        d.getElementById('pv_via').value = du;
        if (dd == 'Transportadores terrestres') {
          $('#pv_select').html(
            `<option value="Transportadores terrestres">Transportadores terrestres</option>
            <option value="Nacionales">Nacionales</option>
            <option value="Transportadores urbanos">Transportadores urbanos</option>`,
          );
        }

        if (dd == 'Nacionales') {
          $('#pv_select').html(
            `<option value="${dd}">${dd}</option>
            <option value="Transportadores terrestres">Transportadores terrestres</option>
            <option value="Transportadores urbanos">Transportadores urbanos</option>`,
          );
        }

        if (dd == 'Transportadores urbanos') {
          $('#pv_select').html(`
          <option value="${dd}">${dd}</option>
          <option value="Transportadores terrestres">Transportadores terrestres</option>
          <option value="Nacionales">Nacionales</option>
          `);
        }
      } else {
        console.log('No es Terrestre');
      }

      //contactos - proveedor
      if (data.result_contacto_proveedor) {
        var cont = 0;
        data.result_contacto_proveedor.forEach(function(element, index) {
          cont++;

          var ch = '<input type="button" id="p' + cont + '" class="btn-primary" value="Remover"  onclick="delete_asocia(this.id,' + cont + ')"  >';
          var tabla =
            "<tr class='tr" +
            cont +
            "'  > " +
            "<th class='tr" +
            cont +
            "'>Id</th><th class='tr" +
            cont +
            "'>Nombre</th><th class='tr" +
            cont +
            "'>Cargo</th></tr>" +
            "<tr class='tr" +
            cont +
            "'><td class='tr" +
            cont +
            "' > <input type='text' id='idtb" +
            cont +
            "' value=" +
            element.id +
            " disabled='disabled'>   </td> " +
            "<td> <input type='text' id='enombre" +
            cont +
            "' class='form-control input-sm tr" +
            cont +
            "'  value='" +
            element.nombres_apellidos +
            "'  > </td>" +
            "<td> <input type='text' id='ecargo" +
            cont +
            "' class='form-control input-sm tr" +
            cont +
            "' value='" +
            element.cargo +
            "'  > </td>" +
            "</tr><tr class='tr" +
            cont +
            "'>" +
            "<th class='tr" +
            cont +
            "'>Teléfono</th><th class='tr" +
            cont +
            "'>Celular</th>" +
            "</tr><tr class='tr" +
            cont +
            "'>" +
            "<td> <input type='number' id='etelefono" +
            cont +
            "' class='form-control input-sm tr" +
            cont +
            "' value='" +
            element.telefono +
            "' >  </td>" +
            "<td> <input type='number' id='ecelu" +
            cont +
            "' class='form-control input-sm tr" +
            cont +
            "' value='" +
            element.celular +
            "' >  </td>" +
            "</tr><tr class='tr" +
            cont +
            "'>" +
            "<th class='tr" +
            cont +
            "'>Correo</th><th class='tr" +
            cont +
            "'>Critica</th>" +
            "</tr><tr class='tr" +
            cont +
            "'>" +
            "<td> <input type='text' id='ecorreo" +
            cont +
            "' class='form-control input-sm tr" +
            cont +
            "' value='" +
            element.correo +
            "'>  </td>" +
            "<td> <input type='text' id='ecriti" +
            cont +
            "' class='form-control input-sm tr" +
            cont +
            "' value='" +
            element.inf_critica +
            "'  >  </td>" +
            "</tr><tr class='tr" +
            cont +
            "'>" +
            "<th class='tr" +
            cont +
            "'>Referencia</th>" +
            "<td colspan='2'> <input type='text' id='erefe" +
            cont +
            "' class='form-control input-sm tr" +
            cont +
            "'  value='" +
            element.referencias +
            "' > </td>" +
            '<td class="tr' +
            cont +
            '">' +
            ch +
            '<input type="hidden" id="sy' +
            cont +
            '" value="1"></td>' +
            '</tr>';
          $('#etbcontact').append(tabla);
          $('#ecant_contacto').val(cont);
        });
      }
    } else {
      console.log('No es proveedor');
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
  }
}

var municipios = [];
async function cargarmunicipios() {
  municipios = [];
  try {
    const response = await fetch($('#id_url_ajax').val() + 'proveedores/Cargar_Municipios', {
      method: 'POST',
      // body: formdata,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      for (let x = 0; x < data.length; x++) {
        municipios.push(data[x]['MUNICIPIO']);
      }
      // console.log(municipios);
      // $('#caja_municipio .typeahead').typeahead(
      //   {
      //     hint: true,
      //     highlight: true,
      //     minLength: 1,
      //   },
      //   {
      //     name: 'states',
      //     source: substringMatcher(municipios),
      //   },
      // );
      $('#caja_municipio .typeahead').typeahead(
        {
          hint: true,
          highlight: true,
          minLength: 1,
        },
        {
          name: 'states',
          source: substringMatcher(municipios),
          templates: {
            suggestion: function(data) {
              return '<div>' + data + '</div>';
            },
          },
        },
      );

      $('#caja_municipio').bind('typeahead:selected', function(obj, datum, name) {
        var params = {
          municipio: datum,
        };
        $.post(
          $('#id_url_ajax').val() + 'proveedores/obtenerdatosmunicipio',
          params,
          function(data) {
            if (data) {
              var nombre = data.nombre;
              $('#municipio').val(nombre);
              $('#municipio_tabla').val(data.nombre);
              $('#id_municipio').val(data.id);
              $('#rndc_id_municipio').val(data.rndc_codigo_ciudad);
              $('#estado').focus();
            } else {
              $('#municipio').val('');
            }
          },
          'json',
        );
      });
      $('#municipio').focusout(function() {
        $.inArray($('#municipio').val(), municipios) == -1;
      });
    } else {
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
  }
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

// abrir fotos
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

async function Actualiza_Dato_Ministerio(respuesta) {
  var id = $('#numero_documento').val();
  var tipdoc = $('#tipo_documento').val();
  var mintrans = 0;
  tercero_clase = '';
  if (id != '') {
    var datos = new FormData();
    datos.append('num_documento', id);
    datos.append('tercero_clase', tercero_clase);
    // datos.append('tercero_clase', tercero_clase);
    try {
      const response = await fetch($('#id_url_ajax').val() + 'proveedores/crear_transaccion_ministerio', {
        method: 'POST',
        body: datos,
        cache: 'no-cache',
      });
      const data = await response.json();
      if (data) {
        mintrans = 1;
      } else {
        mintrans = 0;
      }
    } catch (error) {
      console.error('Error en la primera solicitud:', error);
      throw error;
    } finally {
      // $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      // Recuperar HTML de sessionStorage
      // var contenidoRecuperado = sessionStorage.getItem('contenido');
      // Mostrar el contenido recuperado en el documento
      // document.getElementById('contenedor').innerHTML = contenidoRecuperado;
      // crear_Dato_Ministerio(creacion_proveedor);
    }

    if ($('#Conductor').is(':checked') || $('#poseedor_vehiculo').is(':checked') || $('#propietario_vehiculo').is(':checked')) {
      $('#loading-overlay-rndc ').css('display', 'flex'); // Mostrar mensaje de carga
      if ($('#Conductor').is(':checked')) {
        var conduce = 1;
      } else {
        var conduce = 0;
      }
      var proceso = 11;
      var tipotercero = '';

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
          // $('#frm_proveedores').animate({scrollTop: 0}, 600);
          // crear_Dato_Oet(true);
        } else if (data.status == 'false') {
          tablas_locales = 'No se creo el Tercero en RNDC';
          var contenidoHTML1 =
            '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong> ' +
            tablas_locales +
            ' - ' +
            data.resultado +
            '</div></div>';
          sessionStorage.setItem('contenido_rndc', contenidoHTML1);
          // $('#frm_proveedores').animate({scrollTop: 0}, 600);
          // crear_Dato_Oet(true);
        }
      } catch (error) {
        console.error('Error en la primera solicitud:', error);
        throw error;
      } finally {
        $('#loading-overlay-rndc ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        Actualiza_Dato_Oet(true);
      }
    }
  }
}

async function Actualiza_Dato_Oet(respuesta) {
  clase = 1;
  recurso = 1;
  // valor = "&dato_recurso=" + $("#numero_documento").val();
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
      // $('#frm_proveedores').animate({scrollTop: 0}, 600);
      //Limpiar campos del modal
      // Limpiar_Modal_proveedores();
    } else if (data.status == false || data.status == 'false') {
      var tablas_locales = 'No se creo el Tercero en GRUPO OET';
      var contenidoHTML2 =
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong> ' +
        tablas_locales +
        ' - ' +
        data.error +
        '</div></div>';
      sessionStorage.setItem('contenido_oet', contenidoHTML2);
      // $('#frm_proveedores').animate({scrollTop: 0}, 600);
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-oet ').css('display', 'none'); // Mostrar mensaje de carga
    $('#Modal_Mensajes').modal('toggle');
    // $('#md-mensajes').modal('toggle');

    // Recuperar HTML de sessionStorage
    var contenidoNEXOS = sessionStorage.getItem('contenido');
    var contenidoRNDC = sessionStorage.getItem('contenido_rndc');
    var contenidoOET = sessionStorage.getItem('contenido_oet');
    // Concatenar ambos contenidos
    var contenidoTotal = contenidoNEXOS + contenidoRNDC + contenidoOET;
    // Mostrar el contenido recuperado en el documento
    document.getElementById('contenedor').innerHTML = contenidoTotal;
    // document.getElementById('md-mensajes').style.display = 'block';
    // var datos_el = JSON.parse(sessionStorage.getItem('datos_valida'));
    // datos_el.elementos--;
    // if (datos_el.elementos === 0) {
    //   $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    //   //Limpiar campos del modal
    //   Limpiar_Modal_proveedores();
    //   sessionStorage.clear();
    //   // location.reload();
    //   setTimeout(() => {
    //     location.reload();
    //   }, 1500);
    // } else {
    //   $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    //   setTimeout(() => {
    //     location.reload();
    //   }, 1500);
    // }
  }
  // clase = 1;
  // recurso = 1;
  // valor = '&dato_recurso=' + $('#e_numero_documento').val();
  // activy1 = '';
  // activy2 = '';
  // activy3 = '';
  // if ($('#e_propietario_vehiculo').is(':checked')) {
  //   activy2 = '3';
  // }
  // if ($('#e_poseedor_vehiculo').is(':checked')) {
  //   activy3 = '5';
  // }
  // if ($('#e_Conductor').is(':checked')) {
  //   activy1 = '4';
  // }
  // filtro = activy2 + activy3 + activy1;
  // var paquete = 'clase_recurso=' + recurso + '&recurso=' + filtro + valor;

  // $.post(
  //   $('#id_url_ajax').val() + 'integrar_oet/Consulta_Recurso_Avansat',
  //   paquete,
  //   function (data) {
  //     if (data.status == true || data.status == 'true') {
  //       var tablas_locales = 'Se Registro Datos Exitosamente GRUPO OET';
  //       $('.nexos-messages_editap').append(
  //         '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
  //           tablas_locales +
  //           '</div></div>',
  //       );
  //       $('#editar_proveedor').animate({scrollTop: 0}, 600);
  //       setTimeout(function () {
  //         location.reload(false);
  //       }, 1000);
  //     } else if (data.status == false || data.status == 'false') {
  //       var tablas_locales = 'No se creo el Tercero en GRUPO OET';
  //       $('.nexos-messages_editap').append(
  //         '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong> ' +
  //           tablas_locales +
  //           ' - ' +
  //           data.error +
  //           '</div></div>',
  //       );
  //       $('#editar_proveedor').animate({scrollTop: 0}, 600);
  //       setTimeout(function () {
  //         location.reload(false);
  //       }, 1000);
  //     }
  //   },
  //   'json',
  // );
}

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
