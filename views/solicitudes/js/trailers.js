const d = document;
const w = window;
let valores = '';
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  // valores = window.location.search;
  // Obtén la cadena de consulta de la URL
  var queryString = window.location;
  var queryString = window.location.search;
  // Crea un nuevo objeto URLSearchParams con la cadena de consulta
  var params = new URLSearchParams(queryString);
  // Obtiene el valor de la variable 'numproveedor'
  var numTriler = params.get('num_trailer');
  // Obtiene el valor de la variable 'idmenu'
  var valores = params.get('idmenu');

  /* Traer los datos para poder crear los trailers */
  Listar_datos_iniciales();
  Listar_propietario();
  Listar_poseedor();

  /* Crear Trailer */
  if (numTriler === null) {
    d.addEventListener('click', async e => {
      if (e.target.matches('#btn_agregar_trailer') || e.target.matches('#btn_agregar_trailer *')) {
        $('#md-footer-primary').modal('toggle');
        d.getElementById('titulo_alerta').textContent = '¿Estas seguro que deseas gaurdar los datos de este Trailer?';
      }

      if (e.target.matches('#btn_aceptar') || e.target.matches('#btn_aceptar')) {
        $('.nexos_messages_popup').html('');
        var msg_error = '';
        //validaciones del formulario
        if (!$('#inicial_trailer').val()) {
          msg_error += '<p>Debe Seleccionar una <strong>Letra</strong> para poder crear el Tráiler.</p>';
          AplicaFoco('#inicial_trailer');
        } else {
          RemueveFoco('#inicial_trailer');
        }

        if (!$('#conse_trailer').val()) {
          msg_error += '<p>Debe ingresar los <strong>Numeros</strong> de la placa para poder crear el Tráiler.</p>';
          AplicaFoco('#conse_trailer');
        } else {
          RemueveFoco('#conse_trailer');
        }

        if (!$('#placa_trailer').val()) {
          if (!$('#inicial_trailer').val()) {
            msg_error += '<p>Debe seleccionar <strong>una letra de la Placa</strong> para poder crear la placa del Tráiler.</p>';
          }
          if (!$('#conse_trailer').val()) {
            msg_error += '<p>Debe ingresar <strong>un número</strong> para poder crear la placa del Tráiler.</p>';
            AplicaFoco('#placa_trailer');
          } else {
            if ($('#conse_trailer').val().length < 4 || $('#conse_trailer').val().length > 5) {
              msg_error += '<p>El campo <strong>Número Placa</strong> debe tener mínimo 4 ó máximo 5 dígitos para poder crear la placa del Tráiler.</p>';
              AplicaFoco('#placa_trailer');
            }
          }
        } else {
          if ($('#placa_trailer').val().length < 5 || $('#placa_trailer').val().length > 6) {
            msg_error += '<p>El campo <strong>Placa</strong> debe tener mínimo 5 máximo 6 dígitos para poder crear el Tráiler.</p>';
          } else {
            RemueveFoco('#placa_trailer');
          }
        }

        if (!$('#T_marca').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Marca Trailer</strong> para poder crear el Tráiler.</p>';
          AplicaFoco('#T_marca');
        } else {
          RemueveFoco('#T_marca');
        }
        if (!$('#T_peso').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Peso Vacío(Tn) Trailer</strong> para poder crear el Trailer.</p>';
          AplicaFoco('#T_peso');
        } else {
          if ($('#T_peso').val().length < 3 || $('#T_peso').val().length > 5) {
            msg_error += '<p>El campo <strong>Peso Vacío(Tn) Trailer</strong>debet tener mínimo 3 dígitos máximo 5 dígitos para poder crear el Tráiler.</p>';
          } else {
            RemueveFoco('#T_peso');
            if (parseFloat($('#T_peso').val()) <= parseFloat(200) || parseFloat($('#T_peso').val()) >= parseFloat(53000)) {
              msg_error += '<p>El campo <strong>Peso Vacío</strong> debe ser mayor a 200 y menor a 53000 kilogramos  para poder crear el Trailer.</p>';
            }
          }
        }
        if (!$('#T_volumen').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Volumen Trailer (m3)</strong> para poder crear el Trailer.</p>';
          AplicaFoco('#T_volumen');
        } else {
          if ($('#T_volumen').val().length < 1) {
            msg_error += '<p>El campo <strong>Volumen Trailer (m3)</strong>debe tener mínimo 1 dígitos para poder crear el Trailer.</p>';
          } else {
            RemueveFoco('#T_volumen');
          }
        }

        if (!$('#T_configuracion').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Configuración Trailer</strong> para poder crear el Trailer.</p>';
          AplicaFoco('#T_configuracion');
        } else {
          RemueveFoco('#T_configuracion');
        }
        if (!$('#T_modelo').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Módelo Trailer</strong> para poder crear el Trailer.</p>';
          AplicaFoco('#T_modelo');
        } else {
          if ($('#T_modelo').val().length > 4) {
            msg_error += '<p>El campo <strong>Módelo Trailer</strong> debe tener máximo 4 dígitos para poder crear el Trailer.</p>';
          } else {
            if (parseFloat($('#T_modelo').val()) < parseFloat(1900)) {
              msg_error += '<p>El campo <strong>Módelo Trailer</strong> debe ser mayor a 1900 para poder crear el Trailer.</p>';
            }
            RemueveFoco('#T_modelo');
          }
        }
        if (!$('#T_alto').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Alto(m) Trailer</strong> para poder crear el Trailer.</p>';
          AplicaFoco('#T_alto');
        } else {
          if ($('#T_alto').val().length > 10) {
            msg_error += '<p>El campo <strong>Alto(m) Tráiler</strong> debe tener máximo 5 dígitos  para poder crear el Trailer.</p>';
          }
          RemueveFoco('#T_alto');
        }
        if (!$('#T_largo').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Largo Trailer</strong> para poder crear el Trailer.</p>';
          AplicaFoco('#T_largo');
        } else {
          if ($('#T_largo').val().length > 10) {
            msg_error += '<p>El campo <strong>Largo Trailer</strong> debe tener máximo 5 dígitos para poder crear el Trailer.</p>';
          } else {
            RemueveFoco('#T_largo');
          }
        }
        if (!$('#T_ancho').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Ancho Trailer</strong> para poder crear el Trailer.</p>';
          AplicaFoco('#T_ancho');
        } else {
          if ($('#T_ancho').val().length > 10) {
            msg_error += '<p>El campo <strong>Ancho Trailer</strong> debe tener 5 dígitos máximo para poder crear el Trailer.</p>';
          } else {
            RemueveFoco('#T_ancho');
          }
        }
        if (!$('#T_capacidad').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Capacidad Trailer</strong> para poder crear el Trailer.</p>';
          AplicaFoco('#T_capacidad');
        } else {
          if ($('#T_capacidad').val().length > 5 || $('#T_capacidad').val().length < 3) {
            msg_error += '<p>Debe diligenciar el campo <strong>Capacidad Trailer</strong> debe tener máximo 5 dígitos , mínimo 3 dígitos para poder crear el Trailer.</p>';
          } else {
            RemueveFoco('#T_capacidad');
          }
        }
        if (!$('#T_carroceria').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Tipo Carroceria Trailer</strong> para poder crear el Trailer.</p>';
          AplicaFoco('#T_carroceria');
        } else {
          RemueveFoco('#T_carroceria');
        }
        if (!$('#T_propietario').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Propietario</strong> para poder crear el Trailer.</p>';
          AplicaFoco('#propietario_tabla');
        } else {
          RemueveFoco('#propietario_tabla');
        }

        if (!$('#T_poseedor').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Poseedor</strong> para poder crear el Trailer.</p>';
          AplicaFoco('#poseedor_tabla');
        } else {
          RemueveFoco('#poseedor_tabla');
        }

        if (!$('#foto_trailer').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Fotos del trailer</strong> para poder crear el Trailer.</p>';
          AplicaFoco('#foto_trailer');
        } else {
          RemueveFoco('#foto_trailer');
        }
        if (!$('#foto_licencia').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Fotos de la licencia</strong> para poder crear el Trailer.</p>';
          AplicaFoco('#foto_licencia');
        } else {
          RemueveFoco('#foto_licencia');
        }

        if ($('#T_aseguradora').val()) {
          if (!$('#T_civil').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>N° Responsabilidad Civil</strong> para poder crear el Trailer.</p>';
            AplicaFoco('#T_civil');
          } else {
            if ($('#T_civil').val().length > 20) {
              msg_error += '<p>El campo <strong>N° Responsabilidad Civil</strong> debe tener máximo 20 caracteres para poder crear el Trailer.</p>';
            } else {
              RemueveFoco('#T_civil');
            }
          }
          if (!$('#T_fechavence').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Fecha Vencimiento</strong> para poder crear el Trailer.</p>';
            AplicaFoco('#T_fechavence');
          } else {
            RemueveFoco('#T_fechavence');
          }
        }

        if ($('#T_caracteristicas').val()) {
          if ($('#T_caracteristicas').val().length > 255) {
            msg_error += '<p>El campo <strong>Características</strong> debe tener máximo 255 caracteres para poder crear el Trailer.</p>';
          }
        }

        if (!msg_error) {
          CrearTrailer();
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
        }
      }

      if (e.target.matches('#btn_cancelar_registro') || e.target.matches('#btn_cancelar_registro *')) {
        sessionStorage.clear();
        window.location = `${$('#id_url_ajax').val()}solicitudes/trailer/?idmenu=${valores}`;
      }
    });
  } else {
    /* Editar Trailer */
    d.getElementById('loading-overlay-nexosapp').style.display = 'block';
    let formdata = new FormData();
    formdata.append('id_trailer', decodificarBase64(numTriler));
    try {
      const response = await fetch($('#id_url_ajax').val() + 'trailers/traer_datos_trailer', {
        method: 'POST',
        body: formdata,
        cache: 'no-cache',
      });
      const data = await response.json();
      if (data.resultado) {
        d.getElementById('form_trailers').style.display = 'block';
        d.getElementById('mensaje_error_bd').style.display = 'none';

        data.resultado.forEach(element => {
          d.getElementById('inicial_trailer').value = element.letra_placa;
          d.getElementById('conse_trailer').value = element.num_placa;
          d.getElementById('placa_trailer').value = element.placa;
          d.getElementById('T_marca').value = element.marca;
          d.getElementById('T_peso').value = element.peso_vacio;
          d.getElementById('T_volumen').value = element.volumen;
          d.getElementById('T_tramite').value = element.tipo_tramite;
          d.getElementById('T_chasis').value = element.serie_chasis;
          d.getElementById('T_configuracion').value = element.configuracion;
          d.getElementById('T_modelo').value = element.modelo;
          d.getElementById('T_alto').value = element.alto;
          d.getElementById('T_largo').value = element.largo;
          d.getElementById('T_ancho').value = element.ancho;
          d.getElementById('T_capacidad').value = element.capacidad;
          d.getElementById('T_carroceria').value = element.carroceria;
          /* Proveedores */
          d.getElementById('propietario_tabla').value = element.Propietario;
          d.getElementById('T_propietario').value = element.doc_propietario;
          /* Poseedor */
          d.getElementById('poseedor_tabla').value = element.Poseedor;
          d.getElementById('T_poseedor').value = element.doc_poseedor;
          /* Fotos */
          if (element.n_docu_trailer === '' && element.n_docu_trailer === null) {
            d.getElementById('documento_foto_trailer').textContent = 'Sin Documento';
          } else {
            docu = `<a href="${$(
              '#id_url_ajax',
            ).val()}${element.foto_trailer}${element.n_docu_trailer}" target="_blank" class="btn btn-success btn-xs cell-detail hint--top-left" style="width:100%;height:auto;">
                       <span class="icon mdi mdi-file-text data-toggle="modal" title="Documento"></span>
                    </a>`;
            $('#documento_foto_trailer').html(docu);
          }

          /* Foto Licencia */
          if (element.name_licencia === '' && element.name_licencia === null) {
            d.getElementById('documento_foto_licencia').textContent = 'Sin Documento';
          } else {
            docu = `<a href="${$(
              '#id_url_ajax',
            ).val()}${element.foto_licencia}${element.name_licencia}" target="_blank" class="btn btn-success btn-xs cell-detail hint--top-left" style="width:100%;height:auto;">
                       <span class="icon mdi mdi-file-text data-toggle="modal" title="Documento"></span>
                    </a>`;
            $('#documento_foto_licencia').html(docu);
          }
        });
      } else {
        d.getElementById('form_trailers').style.display = 'none';
        d.getElementById('mensaje_error_bd').style.display = 'block';
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
      d.getElementById('loading-overlay-nexosapp').style.display = 'none';
    }
  }

  /* Activar los buscadores */
  let buscar_propietario = document.getElementById('buscar_propietario');
  buscar_propietario.addEventListener('input', async e => {
    const searchTerm = buscar_propietario.value.trim();
    if (searchTerm != '') {
      $.post(
        $('#id_url_ajax').val() + 'trailers/buscar_propietario',
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
            columnaNombre.textContent = element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2;
            // columnaNombre.style.textAlign = 'center';

            const columnaDireccion = document.createElement('td');
            columnaDireccion.textContent = element.direccion;

            const columnaCelular = document.createElement('td');
            columnaCelular.textContent = element.celular;

            const columnaAccion = document.createElement('td');
            let nombre_completo = element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2;
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
        $('#id_url_ajax').val() + 'trailers/buscar_poseedor',
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
            columnaNombre.textContent = element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2;
            // columnaNombre.style.textAlign = 'center';

            const columnaDireccion = document.createElement('td');
            columnaDireccion.textContent = element.direccion;

            const columnaCelular = document.createElement('td');
            columnaCelular.textContent = element.celular;

            const columnaAccion = document.createElement('td');
            let nombre_completo = element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2;
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

  const input = document.getElementById('conse_trailer');
  const mensajeError = document.getElementById('mensajeError');
  input.addEventListener('input', function() {
    const valor = input.value.trim(); // Obtener el valor del input eliminando espacios en blanco al inicio y al final
    if (valor.length !== 5 || isNaN(valor)) {
      // Si la longitud no es 5 o si el valor no es un número, mostrar un mensaje de error
      mensajeError.innerHTML = `<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>
        Debe ingresar exactamente 5 números.
        </div></div>`;
      input.classList.add('error'); // Agregar una clase para resaltar el campo como erróneo
    } else {
      mensajeError.innerHTML = ''; // Limpiar el mensaje de error si la entrada es válida
      input.classList.remove('error'); // Eliminar la clase de error si la entrada es válida
    }
  });

  d.addEventListener('click', async e => {
    if (e.target.matches('#btn_seleccionar_propietario') || e.target.matches('#btn_seleccionar_propietario *')) {
      // console.log('Propietario');
      var padre = e.target.parentElement.parentElement;
      var Procesos = padre.querySelector('#btn_seleccionar_propietario');
      var propietario_id = Procesos.getAttribute('data-id');
      var nombre_propietario = Procesos.getAttribute('data-nombre_propietario');
      d.getElementById('T_propietario').value = propietario_id;
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
      d.getElementById('T_poseedor').value = poseedor_id;
      d.getElementById('poseedor_tabla').value = nombre_poseedor;
      $('#md-poseedor').modal('toggle');
      buscar_poseedor.value = '';
      Listar_poseedor();
    }

    if (e.target.matches('#btn_cargar_marcas') || e.target.matches('#btn_cargar_marcas *')) {
      Listar_datos_iniciales();
    }

    if (e.target.matches('#btn-cerrar-mensajes') || e.target.matches('#btn-cerrar-mensajes *')) {
      setTimeout(function() {
        location.reload(false);
      }, 1000);
    }
  });

  d.addEventListener('change', async e => {
    if (e.target.matches('#conse_trailer')) {
      var numero = $('#conse_trailer').val();
      var letra = $('#inicial_trailer').val();
      if ($('#inicial_trailer').val() && $('#conse_trailer').val().length == 5) {
        var concatena = letra + numero;
        $('#placa_trailer').val(concatena);
        Valid_Placa();
      }
    }
  });
});

/* Listar Propietario */
async function Listar_propietario() {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'trailers/Listar_propietario', {
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
        columnaNombre.textContent = element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2;
        // columnaNombre.style.textAlign = 'center';

        const columnaDireccion = document.createElement('td');
        columnaDireccion.textContent = element.direccion;

        const columnaCelular = document.createElement('td');
        columnaCelular.textContent = element.celular;

        const columnaAccion = document.createElement('td');
        let nombre_completo = element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2;
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
    const response = await fetch($('#id_url_ajax').val() + 'trailers/Listar_poseedor', {
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
        columnaNombre.textContent = element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2;
        // columnaNombre.style.textAlign = 'center';

        const columnaDireccion = document.createElement('td');
        columnaDireccion.textContent = element.direccion;

        const columnaCelular = document.createElement('td');
        columnaCelular.textContent = element.celular;

        const columnaAccion = document.createElement('td');
        let nombre_completo = element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2;
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

/* Esta consulta llena todos los select que se necesitan prar crear el trailer */
function Listar_datos_iniciales() {
  $('#T_marca').html('<option value="">Seleccione</option>');
  $('#T_tramite').html('<option value="">Seleccione</option>');
  $('#T_configuracion').html('<option value="">Seleccione</option>');
  // $('#T_propietario').html('<option value="">Seleccione</option>');
  $('#T_aseguradora').html('<option value="">Seleccione</option>');
  $('#T_carroceria').html('<option value="">Seleccione</option>');
  // $('#T_poseedor').html('<option value="">Seleccione</option>');
  $.ajax({
    url: $('#id_url_ajax').val() + 'trailers/Datos_trailer',
    // url: 'http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php',
    type: 'POST',
    // data: datos,
    dataType: 'json',
    success: function(data) {
      d.getElementById('form_trailers').style.display = 'block';
      d.getElementById('mensaje_error_bd').style.display = 'none';
      // console.log('SI HAY DATOS TRAILER');
      if (data.result != null) {
        $('#T_marca').html('<option value="">Seleccionar</option>');
        data.result.forEach(function(element, index) {
          $('#T_marca').append('<option value="' + element.id + '">' + element.marca + '</option>');
        });
      }
      if (data.result2 != null) {
        $('#T_tramite').html('<option value="">Seleccionar</option>');
        data.result2.forEach(function(element, index) {
          $('#T_tramite').append('<option value="' + element.id + '">' + element.tramite + '</option>');
        });
      }
      if (data.result3 != null) {
        $('#T_configuracion').html('<option value="">Seleccionar</option>');
        data.result3.forEach(function(element, index) {
          $('#T_configuracion').append('<option value="' + element.id + '">' + element.nombre + '-' + element.descripcion + '</option>');
        });
      }

      if (data.result5 != null) {
        $('#T_aseguradora').html('<option value="">Seleccionar</option>');
        data.result5.forEach(function(element, index) {
          $('#T_aseguradora').append('<option value="' + element.id + '">' + element.nombre + '</option>');
        });
      }
      if (data.result6 != null) {
        $('#T_carroceria').html('<option value="">Seleccionar</option>');
        data.result6.forEach(function(element, index) {
          $('#T_carroceria').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
        });
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // console.log('NO HAY DATOS TRAILER');
      d.getElementById('form_trailers').style.display = 'none';
      d.getElementById('mensaje_error_bd').style.display = 'block';
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

/* Validar Placa */
function Valid_Placa() {
  placatrailer = $('#placa_trailer').val();
  var validacion = {
    placatrailer: placatrailer,
  };
  $.ajax({
    url: $('#id_url_ajax').val() + 'trailers/Validar_placa',
    type: 'POST',
    data: validacion,
    dataType: 'json',
    success: function(data) {
      console.log(data);
      if (data) {
        msg_error = '';
        if (data !== null) {
          msg_error = '<p>La placa ya existe, por favor ingrese una placa diferente.</p>';
          $('.nexos_messages_popup').html(
            '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
              msg_error +
              '</div></div>',
          );
          $('#exampleModalLong').animate({scrollTop: 0}, 600);
          $('#btn_crear_trailer').attr('disabled', true);
        } else {
          $('#btn_crear_trailer').attr('disabled', false);
          $('.nexos_messages_popup').html('');
        }
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // alert('no ver trailer');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//crear el trailer
async function CrearTrailer() {
  // alert('crear el trailer');
  $('.nexos_messages_popup').html('');
  $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
  var datos = null;
  datos = new FormData();
  //fotos del trailer
  var trailer = document.getElementById('foto_trailer').files[0];
  datos.append('foto_trailer', trailer);

  var tlicen = document.getElementById('foto_licencia').files[0];
  datos.append('foto_licencia', tlicen);

  //DATOS DEL TRAILER
  var placat = $('#placa_trailer').val();
  if (placat.length != 0) {
    // datos.append('accion', 'CrearTrailer');
    datos.append('placa_trailer', $('#placa_trailer').val());
    datos.append('T_marca', $('#T_marca').val());
    datos.append('T_peso', $('#T_peso').val());
    datos.append('T_alto', $('#T_alto').val());
    datos.append('T_volumen', $('#T_volumen').val());
    datos.append('T_tramite', $('#T_tramite').val());
    datos.append('T_chasis', $('#T_chasis').val());
    datos.append('T_configuracion', $('#T_configuracion').val());
    datos.append('T_modelo', $('#T_modelo').val());
    datos.append('T_ancho', $('#T_ancho').val());
    datos.append('T_largo', $('#T_largo').val());
    datos.append('T_capacidad', $('#T_capacidad').val());
    datos.append('T_carroceria', $('#T_carroceria').val());
    datos.append('T_caracteristicas', $('#T_caracteristicas').val());
    datos.append('T_propietario', $('#T_propietario').val());
    datos.append('T_civil', $('#T_civil').val());
    datos.append('T_aseguradora', $('#T_aseguradora').val());
    datos.append('T_fechavence', $('#T_fechavence').val());
    datos.append('Tlicen', $('#Tlicen').val());
    datos.append('T_poseedor', $('#T_poseedor').val());
    //nombre del documento
    datos.append('name_foto', $('#name_foto').val());
    datos.append('name_licen', $('#name_licen').val());
  }

  try {
    const response = await fetch($('#id_url_ajax').val() + 'trailers/Crear_trailer', {
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
    var placa = $('#placa_trailer').val();
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
    const response = await fetch($('#id_url_ajax').val() + 'web_service/trailers', {
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
  clase = 3;
  recurso = 8;
  let datos_oet = new FormData();
  datos_oet.append('clase_recurso', clase);
  datos_oet.append('recurso', recurso);
  datos_oet.append('dato_recurso', $('#placa_trailer').val());
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

// Función para decodificar Base64
function decodificarBase64(textoCodificado) {
  return atob(textoCodificado);
}
