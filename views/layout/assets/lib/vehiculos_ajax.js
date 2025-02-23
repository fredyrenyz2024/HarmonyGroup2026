let valores = '';
$(document).ready(function () {
  valores = window.location.search;
  // $('.cpe').select2({
  //   width: '100%',
  // });

  // $('#linea').select2({
  //   width: '100%',
  // });

  // $('#configuracion').select2({
  //   width: '80%',
  // });

  // $('#color').select2({
  //   width: '100%',
  // });

  // $('#trailers').select2({
  //   width: '100%',
  // });

  // $('#tipo_combustible').select2({
  //   width: '80%',
  // });

  // $('#clase_v').select2({
  //   width: '100%',
  // });

  // $('#tipo_carroceria').select2({
  //   width: '80%',
  // });

  $('#id_conductor').select2({
    width: '100%',
  });
  $('#id_tenedor').select2({
    width: '100%',
  });
  $('#id_propietario').select2({
    width: '100%',
  });
  // cargarconductor();
  // cargartenedor();
  // cargarpropietario();

  //cargartiposvehiculos();
  //funciones nuevas(n)
  // cargarmarcasn();
  //cargarlineasn();
  // cargarcolorn();
  // cargartipocarrocen();
  // cargarclasen();
  //cargarconfiguracion();
  cargarpropietarion();
  cargarposeedorn();
  cargarconductorn();
  // cargarconfi_completa();
  // cargarempgps();

  // $('#validar_token').click(function () {
  //   // e.PreventDefault();
  //   if ($('#placa_val').val() === '' && $('#token_val').val() == '') {
  //     $('.nexos_messages_popup').html(`
  // 		<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
  // 				<div class="icon"><span class="mdi mdi-info-outline"></span></div>
  // 				<div class="message">
  // 					<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
  // 						<strong>Mensaje!</strong> Debe ingresar el codigo de seguridad y la placa para completar el proceso de hoja de vida del vehiculo.
  // 				</div>
  // 		</div>`);
  //   } else if ($('#placa_val').val() === '') {
  //     $('.nexos_messages_popup').html(`
  // 		<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
  // 				<div class="icon"><span class="mdi mdi-info-outline"></span></div>
  // 				<div class="message">
  // 					<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
  // 						<strong>Mensaje!</strong> Debe ingresar la placa para completar el proceso de hoja de vida del vehiculo.
  // 				</div>
  // 		</div>`);
  //   } else if ($('#token_val').val() == '') {
  //     $('.nexos_messages_popup').html(`
  // 		<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
  // 				<div class="icon"><span class="mdi mdi-info-outline"></span></div>
  // 				<div class="message">
  // 					<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
  // 						<strong>Mensaje!</strong> Debe ingresar el codigo de seguridad para completar el proceso de hoja de vida del vehiculo.
  // 				</div>
  // 		</div>`);
  //   } else {
  //     let data = new FormData();
  //     data.append('placa', $('#placa_val').val());
  //     data.append('token', $('#token_val').val());
  //     // alert($("#placa_val").val() + "  " + $("#token_val").val());
  //     var url = $('#id_url_ajax').val() + 'vehiculos/validar_token_placa';
  //     $.ajax({
  //       url: url,
  //       type: 'POST',
  //       data: data,
  //       cache: false,
  //       processData: false, // Don't process the files
  //       contentType: false, // Set content type to false as jQuery will tell the server its a query string request
  //       dataType: 'json',
  //       success: function (data, textStatus, jqXHR) {
  //         let mensaje = '';
  //         if (data.numero === 400) {
  //           mensaje = `
  // 					<div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
  // 							<div class="icon"><span class="mdi mdi-info-outline"></span></div>
  // 							<div class="message">
  // 								<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
  // 								<strong>Mensaje!</strong> ${data.mensaje}
  // 							</div>
  // 					</div>`;
  //           $('.datos_val').show();
  //           $('#informacion').hide();
  //           $('#acciones').hide();
  //         } else if (data.numero === 200) {
  //           mensaje = `
  // 					<div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
  // 							<div class="icon"><span class="mdi mdi-check"></span></div>
  // 							<div class="message">
  // 								<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
  // 								<strong>Mensaje!</strong> ${data.mensaje}
  // 							</div>
  // 					</div>`;
  //           $('.datos_val').hide();
  //           $('#informacion').show();
  //           $('#acciones').show();
  //         } else {
  //           mensaje = `
  // 					<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
  // 							<div class="icon"><span class="mdi mdi-info-outline"></span></div>
  // 							<div class="message">
  // 								<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
  // 								<strong>Mensaje!</strong> Este vehículo con placa <strong>Texto</strong> no se encuentra creado en el sistema, solicitar prefiltro para su creación.
  // 							</div>
  // 					</div>`;
  //         }
  //         $('.nexos_messages_popup').html(mensaje);
  //       },
  //       error: function (jqXHR, textStatus, errorThrown) {
  //         console.log('error no inserta');
  //         $('#crea_vehiculos').css('display', 'none');
  //         $('.nexos_messages_popup').html(
  //           '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Ha ocurrrido un error ' +
  //             jqXHR.responseText +
  //             '.</div></div>',
  //         );
  //         /*$("html, body").animate({ scrollTop: 0 }, 600);
  // 			setTimeout(function() { location.reload(false);  }, 800);*/
  //         console.log(jqXHR);
  //         console.log(textStatus);
  //         console.log(errorThrown);
  //       },
  //     });
  //   }
  // });

  $('#repotenciado').prop('disabled', true);
  // $('#btn_agregar_vehiculo').click(function () {
  //   if (window.confirm('¿Los datos proporcionado son correctos, para crear el vehiculo?')) {
  //     // Código a ejecutar si el usuario hace clic en "Aceptar"
  //     $('#repotenciado').prop('disabled', true);
  //     $('.nexos_messages_popup').html('');
  //     var msg_error = '';
  //     var msg_error2 = '';

  //     // Se hacen las validaciones del formulario de creación del vehículo
  //     if (!$('#placa').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el Vehículo.</p>';
  //     } else {
  //       if ($('#placa').val().length != 6) {
  //         msg_error += '<p>El campo placa debe tener 6 caracteres, 3 letras y 3 números para poder crear el Vehículo.</p>';
  //       }
  //     }
  //     if (!$('#color').val() && !$('#id_vehiculo_color').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Color</strong> para poder crear el Vehículo.</p>';
  //     }
  //     if (!$('#marca').val() && !$('#id_vehiculo_marca').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Marca</strong> para poder crear el Vehículo.</p>';
  //     }
  //     if (!$('#linea').val() && !$('#id_vehiculo_linea').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Línea</strong> para poder crear el Vehículo.</p>';
  //     }
  //     if (!$('#modelo').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Modelo</strong> para poder crear el Vehículo.</p>';
  //     } else {
  //       if ($('#modelo').val().length != 4) {
  //         msg_error += '<p>El campo <strong>Modelo</strong>debe tener 4 dígitos para poder crear el Vehículo.</p>';
  //       }
  //     }
  //     if (!$('#peso_vacio').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Peso Vacío</strong> para poder crear el Vehículo.</p>';
  //     } else {
  //       if ($('#peso_vacio').val().length < 1 || $('#peso_vacio').val().length > 4) {
  //         msg_error += '<p>El campo <strong>Peso Vacío</strong> debe ser mínimo 1 máximo 4 dígitos para poder crear el Vehículo.</p>';
  //       }
  //     }
  //     if (!$('#numero_poliza').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Número SOAT</strong> para poder crear el Vehículo.</p>';
  //     } else {
  //       if ($('#numero_poliza').val().length > 20) {
  //         msg_error += '<p>El campo <strong>Número SOAT</strong>debe tener máximo 20 caracteres para poder crear el Vehículo.</p>';
  //       }
  //     }
  //     if ($('#numero_polizaRC').val()) {
  //       if ($('#numero_polizaRC').val().length < 11 || $('#numero_polizaRC').val().length > 30) {
  //         msg_error += '<p>El campo <strong>Póliza Responsabilidad Civil</strong> debe tener mínimo 11 ó máximo 30 caracteres para poder crear el Vehículo.</p>';
  //       }
  //     }
  //     if (!$('#soat_vencimiento').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Vencimiento SOAT</strong> para poder crear el Vehículo.</p>';
  //     }
  //     if (!$('#aseguradora').val() && !$('#id_vehiculo_aseguradora').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Aseguradora</strong> para poder crear el Vehículo.</p>';
  //     }
  //     if (!$('#web_satelital').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Web satelital</strong> para poder crear el Vehículo.</p>';
  //     }
  //     if (!$('#usuario_satelital').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Usuario satelital</strong> para poder crear el Vehículo.</p>';
  //     } else {
  //       if ($('#usuario_satelital').val().length > 80) {
  //         msg_error += '<p>El campo <strong>Usuario satelital</strong> debe tener máximo 30 caracteres para poder crear el Vehículo.</p>';
  //       }
  //     }
  //     if (!$('#clave_satelital').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Clave satelital</strong> para poder crear el Vehículo.</p>';
  //     } else {
  //       if ($('#clave_satelital').val().length > 80) {
  //         msg_error += '<p>El campo <strong>Clave satelital</strong> debe tener máximo 30 caracteres para poder crear el Vehículo.</p>';
  //       }
  //     }
  //     if (!$('#num_motor').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Número motor</strong> para poder crear el Vehículo.</p>';
  //     } else {
  //       if ($('#num_motor').val().length < 6 || $('#num_motor').val().length > 40) {
  //         msg_error += '<p>El campo <strong>Número motor</strong> debe tener máximo 40 y mínimo 6 caracteres para poder crear el Vehículo.</p>';
  //       }
  //     }
  //     if (!$('#num_chasis').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Número chasis</strong> para poder crear el Vehículo.</p>';
  //     } else {
  //       if ($('#num_chasis').val().length < 6 || $('#num_chasis').val().length > 40) {
  //         msg_error += '<p>El campo <strong>Número chasis</strong> debe tener máximo 40 y mínimo 6 caracteres para poder crear el Vehículo.</p>';
  //       }
  //     }
  //     if (!$('#tipovinculacion').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Tipo de vinculación</strong> para poder crear el Vehículo.</p>';
  //     }
  //     if (!$('#capacidad_tn').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Capacidad de carga(Kg)</strong> para poder crear el Vehículo.</p>';
  //     } else {
  //       if ($('#capacidad_tn').val().length > 5) {
  //         msg_error += '<p>El campo <strong>Capacidad de carga(Kg)</strong> debe tener 5 dígitos máximo para poder crear el Vehículo.</p>';
  //       }
  //     }
  //     if (!$('#peso_bruto').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Peso Bruto (Kg)</strong> para poder crear el Vehículo.</p>';
  //     }

  //     if (!$('#clase_v').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Clase de Vehículo</strong> para poder crear el Vehículo.</p>';
  //     }

  //     if (!$('#repotencia').val()) {
  //       msg_error += '<p>Por favor seleccione una opción del campo <strong> Repotenciar </strong> para poder crear el Vehículo.</p>';
  //     }

  //     if ($('#repotencia').val() == 1) {
  //       if (!$('#repotenciado').val()) {
  //         msg_error += '<p>Debe diligenciar el campo <strong>repotenciado a:</strong> para poder crear el Vehículo.</p>';
  //       }
  //     }
  //     if ($('#repotencia').val() == 0) {
  //       $('#repotenciado').val('');
  //     }

  //     if (!$('#f_matricula').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Fecha de matrícula</strong> para poder crear el Vehículo.</p>';
  //     }

  //     if (!$('#cant_viaje').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Cant. viajes</strong> para poder crear el Vehículo.</p>';
  //     }
  //     //validar tecnomecanica segun fecha de matricula
  //     if ($('#f_matricula').val()) {
  //       var matri = $('#f_matricula').val();
  //       var fhoy = moment();
  //       var tf = fhoy.diff(matri, 'days');
  //       if (tf >= 730) {
  //         //es obligatorio subir archivo y tecnomecanica
  //         if (!$('#foto_tecno').val()) {
  //           msg_error +=
  //             '<p>Debe ingresar <strong>Archivo Tecnomecánica</strong> para poder crear el Vehículo, ya que la fecha de matrícula es mayor a dos años días(' + tf + ').</p>';
  //         }
  //         if (!$('#tecnomecanica').val()) {
  //           msg_error += '<p>Debe diligenciar el campo <strong>Tecnomecánica</strong> para poder crear el Vehículo días(' + tf + ').</p>';
  //         }
  //       }
  //     }
  //     if (!$('#cedula_propietario').val() && !$('#id_propietario').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Documento Propietario</strong> para poder crear el VehículoS1.</p>';
  //     }
  //     if (!$('#cedula_tenedor').val() && !$('#id_tenedor').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Documento Tenedor</strong> para poder crear el Vehículo.</p>';
  //     }
  //     if (!$('#cedula_conductor').val() && !$('#id_conductor').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Documento Conductor</strong> para poder crear el Vehículo.</p>';
  //     }
  //     if (!$('#id_propietario').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Propietario en Datos Específicos</strong> para poder crear el Vehículo.</p>';
  //     }
  //     if (!$('#id_tenedor').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Poseedor en Datos Específicos</strong> para poder crear el Vehículo.</p>';
  //     }
  //     if (!$('#id_conductor').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Conductor en Datos Específicos</strong> para poder crear el Vehículo.</p>';
  //     }

  //     if (!$('#configuracion').val() && !$('#id_vehiculo_configuracion').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Configuración completa</strong> para poder crear el Vehículo.</p>';
  //     } else {
  //       if (
  //         $('#configuracion').val() != 2 ||
  //         $('#configuracion').val() != 3 ||
  //         $('#configuracion').val() != 4 ||
  //         $('#configuracion').val() != 'CA' ||
  //         $('#configuracion').val() != 'V2' ||
  //         $('#configuracion').val() != 'V3' ||
  //         $('#configuracion').val() != 'V4'
  //       ) {
  //         if (!$('#trailers').val()) {
  //           msg_error += '<p>Debe diligenciar el campo <strong>Trailer</strong> para poder crear el Vehículo.</p>';
  //         }
  //       }
  //     }
  //     if ($('#peso_vacio').val() == 0) {
  //       msg_error += '<p>El campo <strong>Peso Vacío (Kg) </strong> debe ser mayor a cero(0), para poder crear el Vehículo.</p>';
  //     }
  //     if ($('#capacidad_tn').val() == 0) {
  //       msg_error += '<p>El campo <strong>Capacidad carga(Kg) </strong> debe ser mayor a cero(0), para poder crear el Vehículo.</p>';
  //     }
  //     if ($('#peso_bruto').val() == 0) {
  //       msg_error += '<p>El campo <strong>Peso Bruto (Kg) </strong> debe ser mayor a cero(0), para poder crear el Vehículo.</p>';
  //     }
  //     if ($('#fecha_vig_tecno').val()) {
  //       var fhoy = moment().format('YYYY/MM/DD');
  //       if ($('#fecha_vig_tecno').val() <= fhoy) {
  //         msg_error += '<p>El campo <strong>Fecha Vencimiento de Tecnomecánica </strong> debe ser mayor a la fecha actual, para poder crear el Vehículo.</p>';
  //       }
  //     }
  //     if ($('#fecha_tecno').val()) {
  //       var fhoy = moment().format('YYYY/MM/DD');
  //       if ($('#fecha_tecno').val() > fhoy) {
  //         msg_error += '<p>El campo <strong>Fecha de Expedición Tecnomecánica </strong> debe ser menor o igual a la fecha actual, para poder crear el Vehículo.</p>';
  //       }
  //     }
  //     if (!$('#empresa_satelital').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Empresa Satelital</strong> para poder crear el Vehículo.</p>';
  //     }

  //     if ($('#lice_transito').val()) {
  //       if ($('#lice_transito').val().length < 6 || $('#lice_transito').val().length > 30) {
  //         msg_error += '<p>El campo <strong>Licencia Tránsito</strong> debe tener mínimo 6 ó máximo 30 caracteres para poder crear el Vehículo.</p>';
  //       }
  //     }

  //     if (!$('#foto_transi').val()) {
  //       msg_error += '<p>Debe subir el documento de la <strong>Licencia Tránsito</strong> para poder crear el Vehículo.</p>';
  //     }

  //     // if (!$("#foto_tecno").val()) {
  //     // 	msg_error += "<p>Debe subir el documento de la <strong>Tecnomecánica</strong> para poder crear el Vehículo.</p>";
  //     // }

  //     if (!$('#foto_vehiculo').val()) {
  //       msg_error += '<p>Debe subir la  <strong>foto frontal</strong> para poder crear el Vehículo.</p>';
  //     }
  //     if (!$('#foto_vehiculod').val()) {
  //       msg_error += '<p>Debe subir la  <strong>foto derecha</strong> para poder crear el Vehículo.</p>';
  //     }
  //     if (!$('#foto_vehiculoi').val()) {
  //       msg_error += '<p>Debe subir la  <strong>foto Izquierda</strong> para poder crear el Vehículo.</p>';
  //     }
  //     if (!$('#foto_vehiculoa').val()) {
  //       msg_error += '<p>Debe subir la  <strong>foto de la parte de atras</strong> para poder crear el Vehículo.</p>';
  //     }

  //     // Fin - Se hacen las validaciones del formulario de creación del vehículo
  //     if (!msg_error) {
  //       crearVehiculo();
  //       //alert('Puede crear vehiculo');
  //     } else {
  //       $('.nexos_messages_popup').append(
  //         '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
  //           msg_error +
  //           '</div></div>',
  //       );
  //       $('.nexos-content').animate({scrollTop: 0}, 800);
  //     }
  //   } else {
  //     // Código a ejecutar si el usuario hace clic en "Cancelar"
  //     console.log('Acción confirmada.');
  //   }
  // });

  $('#btn_editar_vehiculo').click(function () {
    $('.nexos_messages_popup').html('');
    var msg_error = '';
    // alert('editar vehiculo');
    // Se hacen las validaciones del formulario de edición del vehículo
    if (!$('#e_placa').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el Vehículo.</p>';
    }
    if (!$('#e_configuracion').val() && !$('#e_id_vehiculo_configuracion').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Configuración</strong> para poder crear el Vehículo.</p>';
    }
    if (!$('#e_color').val() && !$('#e_id_vehiculo_color').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Color</strong> para poder crear el Vehículo.</p>';
    }
    if (!$('#e_marca').val() && !$('#e_id_vehiculo_marca').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Marca</strong> para poder crear el Vehículo.</p>';
    }
    if (!$('#e_linea').val() && !$('#e_id_vehiculo_linea').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Línea</strong> para poder crear el Vehículo.</p>';
    }
    if (!$('#e_modelo').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Modelo</strong> para poder crear el Vehículo.</p>';
    }
    if (!$('#e_tipo_vehiculo').val() && !$('#e_id_tipo_vehiculo').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Tipo de Vehículo</strong> para poder crear el Vehículo.</p>';
    }
    // if( !$("#e_tipo_carroceria").val() ){
    // 	msg_error+= "<p>Debe seleccionar un <strong>Tipo Carrocería</strong> para poder crear el Vehículo.</p>";
    // }
    if (!$('#e_peso_vacio').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Peso Vacío</strong> para poder crear el Vehículo.</p>';
    }
    if (!$('#e_cedula_propietario').val() && !$('#e_id_propietario').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Documento Propietario</strong> para poder crear el VehículoS2.</p>';
    }
    if (!$('#e_cedula_tenedor').val() && !$('#e_id_tenedor').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Documento Tenedor</strong> para poder crear el Vehículo.</p>';
    }
    if (!$('#e_cedula_conductor').val() && !$('#e_id_conductor').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Documento Conductor</strong> para poder crear el Vehículo.</p>';
    }
    if (!$('#e_numero_poliza').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Número SOAT</strong> para poder crear el Vehículo.</p>';
    }
    if (!$('#e_soat_vencimiento').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Vencimiento SOAT</strong> para poder crear el Vehículo.</p>';
    }
    if (!$('#e_aseguradora').val() && !$('#e_id_vehiculo_aseguradora').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Aseguradora</strong> para poder crear el Vehículo.</p>';
    }
    // Fin - Se hacen las validaciones del formulario de creación del vehículo

    if (!msg_error) {
      editarVehiculo();
    } else {
      $('.nexos_messages_popup').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          '</div></div>',
      );
      $('#editar_vehiculos').animate({scrollTop: 0}, 600);
    }
  });

  //GUARDAR EDITAR NUEVO
  $('#btn_editar_vehiculonew').click(function () {
    $('.nexos_messages_popup').html('');
    var msg_error = '';
    // alert('editar vehiculo');
    // Se hacen las validaciones del formulario de edición del vehículo
    if (!$('#e_placa').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Placa</strong> para poder actualizar el Vehículo.</p>';
    }
    if (!$('#e_configuracion').val() && !$('#e_id_vehiculo_configuracion').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Configuración</strong> para poder actualizar el Vehículo.</p>';
    }
    if (!$('#e_color').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Color</strong> para poder actualizar el Vehículo.</p>';
    }
    if (!$('#e_marca').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Marca</strong> para poder actualizar el Vehículo.</p>';
    }
    if (!$('#e_linea').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Línea</strong> para poder actualizar el Vehículo.</p>';
    }

    if (!$('#e_modelo').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Módelo</strong> para poder actualizar el Vehículo.</p>';
    } else {
      if ($('#e_modelo').val().length != 4) {
        msg_error += '<p>El campo <strong>Módelo</strong>debe tener 4 dígitos para poder actualizar el Vehículo.</p>';
      } else {
        if ($('#e_modelo').val() <= 1900) {
          msg_error += '<p>El campo <strong>Módelo</strong>debe ser mayor a <strong>1900</strong> para poder actualizar el Vehículo.</p>';
        }
      }
    }

    if (!$('#e_tipo_carroceria').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Tipo Carrocería</strong> para poder actualizar el Vehículo.</p>';
    }
    if (!$('#e_tipo_combustible').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Tipo Combustible</strong> para poder actualizar el Vehículo.</p>';
    }
    if (!$('#e_clasevehiculo').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Clase de vehículo</strong> para poder actualizar el Vehículo.</p>';
    }
    if (!$('#e_numero_poliza').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Número SOAT</strong> para poder actualizar el Vehículo.</p>';
    } else {
      if ($('#e_numero_poliza').val().length > 20) {
        msg_error += '<p>Debe seleccionar un <strong>Número SOAT</strong>debe tener máximo 20 caracteres para poder actualizar el Vehículo.</p>';
      }
    }

    if ($('#e_numerito_polizaRC').val()) {
      if ($('#e_numerito_polizaRC').val().length < 11 || $('#e_numerito_polizaRC').val().length > 30) {
        msg_error += '<p>El campo <strong>Número Responsabilidad civil</strong> debe tener mínimo 11 dígitos ó 30 dígitos máximo para poder actualizar el Vehículo.</p>';
      }
    }

    if (!$('#e_soat_vencimiento').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Vencimiento SOAT</strong> para poder actualizar el Vehículo.</p>';
    }
    if (!$('#e_aseguradora').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Aseguradora</strong> para poder actualizar el Vehículo.</p>';
    }
    if (!$('#e_web_satelital').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Web satélital</strong> para poder actualizar el Vehículo.</p>';
    }
    if (!$('#e_usuario_satelital').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Usuario satelital</strong> para poder actualizar el Vehículo.</p>';
    } else {
      if ($('#e_usuario_satelital').val().length > 80) {
        msg_error += '<p>El campo <strong>Usuario satelital</strong> debe tener 30 dígitos máximo para poder actualizar el Vehículo.</p>';
      }
    }
    if (!$('#e_clave_satelital').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Clave satelital</strong> para poder actualizar el Vehículo.</p>';
    } else {
      if ($('#e_clave_satelital').val().length > 80) {
        msg_error += '<p>El campo <strong>Clave satelital</strong>debe tener 30 dígitos máximo para poder actualizar el Vehículo.</p>';
      }
    }
    if (!$('#e_num_motor').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Número Motor</strong> para poder actualizar el Vehículo.</p>';
    } else {
      if ($('#e_num_motor').val().length < 6 || $('#e_num_motor').val().length > 40) {
        msg_error += '<p>El campo <strong>Número Motor</strong> debe tener mínimo 6 dígitos y máximo 40 para poder actualizar el Vehículo.</p>';
      }
    }
    if (!$('#e_num_chasis').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Número chasis</strong> para poder actualizar el Vehículo.</p>';
    } else {
      if ($('#e_num_chasis').val().length < 6 || $('#e_num_chasis').val().length > 40) {
        msg_error += '<p>El campo <strong>Número chasis</strong> debe tener mínimo 6 y máximo 40 para poder actualizar el Vehículo.</p>';
      }
    }
    if (!$('#e_tipovinculacion').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Tipo Vinculación</strong> para poder actualizar el Vehículo.</p>';
    }
    if (!$('#e_peso_vacio').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Peso Vacío</strong> para poder actualizar el Vehículo.</p>';
    } else {
      if ($('#e_peso_vacio').val().length > 4) {
        msg_error += '<p>El campo <strong>Peso Vacío</strong>debe tener 4 dígitos máximo para poder actualizar el Vehículo.</p>';
      }
    }
    if (!$('#e_bruto_kg').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Peso bruto(Kg)</strong> para poder actualizar el Vehículo.</p>';
    }
    if (!$('#e_capacidad_tn').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Capacidad carga(kg)</strong> para poder actualizar el Vehículo.</p>';
    } else {
      if ($('#e_capacidad_tn').val().length > 5) {
        msg_error += '<p>El campo <strong>Capacidad carga(kg)</strong> debe tener 5 dígitos máximo para poder actualizar el Vehículo.</p>';
      }
    }
    if ($('#e_peso_vacio').val() == 0) {
      msg_error += '<p>El campo <strong> Peso Vacío (Kg) </strong> debe ser mayor a cero(0), para poder actualizar el Vehículo.</p>';
    }
    if ($('#e_capacidad_tn').val() == 0) {
      msg_error += '<p>El campo <strong> Capacidad carga(kg) </strong> debe ser mayor a cero(0), para poder actualizar el Vehículo.</p>';
    }
    if ($('#e_bruto_kg').val() == 0) {
      msg_error += '<p>El campo <strong> Peso bruto(Kg) </strong> debe ser mayor a cero(0), para poder actualizar el Vehículo.</p>';
    }
    if ($('#e_fecha_vig_tecno').val()) {
      var fhoy = moment().format('YYYY-MM-DD');
      if ($('#e_fecha_vig_tecno').val() <= fhoy) {
        msg_error += '<p>El campo <strong>Fecha Vencimiento de Tecnomecánica </strong> debe ser mayor a la fecha actual, para poder actualizar el Vehículo.</p>';
      }
    }
    if ($('#e_fecha_tecno').val()) {
      var fhoy = moment().format('YYYY-MM-DD');
      if ($('#e_fecha_tecno').val() > fhoy) {
        msg_error += '<p>El campo <strong>Fecha de Expedición Tecnomecánica </strong> debe ser menor o igual a la fecha actual, para poder actualizar el Vehículo.</p>';
      }
    }
    if (!$('#e_docpropietario').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Propietario</strong> para poder actualizar el Vehículo.</p>';
    }
    if (!$('#e_doctenedor').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Poseedor</strong> para poder actualizar el Vehículo.</p>';
    }
    if (!$('#e_docconductor').val()) {
      msg_error += '<p>Debe seleccionar un <strong>Conductor</strong> para poder actualizar el Vehículo.</p>';
    }
    if (!$('#e_fecha_matricula').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Fecha Matrícula</strong> para poder actualizar el Vehículo.</p>';
    } else {
      var matri = $('#e_fecha_matricula').val();
      var fhoy = moment();
      var tf = fhoy.diff(matri, 'days');
      if (tf > 730) {
        //es obligatorio subir archivo y tecnomecanica
        if (!$('#e_tecnomecanica').val()) {
          msg_error += '<p>Debe diligenciar el campo <strong>Tecnomecánica</strong> para poder crear el Vehículo días(' + tf + ').</p>';
        }
      }
    }
    // Fin - Se hacen las validaciones del formulario de creación del vehículo
    if (!msg_error) {
      editarvehiculonew();
    } else {
      $('.e_nexos_messages_popup').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          '</div></div>',
      );
      $('#editar_vehiculos').animate({scrollTop: 0}, 600);
    }
  });

  $('#btn_crear_trailer').click(function () {
    $('.nexos_messages_popup').html('');
    var msg_error = '';
    //validaciones del formulario
    if (!$('#placa_trailer').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el Trailer.</p>';
    }

    if (!msg_error) {
      CrearTrailer();
    } else {
      $('.nexos_messages_popup').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          '</div></div>',
      );
      $('#crea_vehiculos').animate({scrollTop: 0}, 600);
    }
  });

  $('#editareltrailer').click(function () {
    EditarTrailer();
  });

  $('#btn_activar_vehiculo').click(function () {
    activarVehiculo();
  });
  $('#btn_inactivar_vehiculo').click(function () {
    inactivarVehiculo();
  });

  // $('#btn_seleccionar_color').click(function () {
  // var id = $('#btn_seleccionar_color').prop('data-id');
  // console.log(id);
  // });

  /******** FUNCIONES DEL FORMULARIO DE CREACCION DE VEHICULO ********/
  $('#placa').focusout(function () {
    // console.log("Entro en funcion de placa") ;
    $('.nexos_messages_popup').html('');
    $('#configuracion').attr('disabled', false);

    // Se busca si el proveedor ya existe en el sistema
    var params = {
      accion: 'verVehiculoPlaca',
      placa: $('#placa').val(),
    };

    $.ajax({
      type: 'POST',
      cache: false,
      url: url,
      data: params,
      dataType: 'json',
      beforeSend: function (jqXHR, settings) {
        $('.nexos-messages').html(
          '<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' +
            $('#id_url_ajax').val() +
            'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>',
        );
      },
      success: function (data) {
        // console.log(data);
        $('.nexos-messages').html('');
        if (data.success) {
          $('.nexos_messages_popup').html(
            '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong><p>El vehículo ya se encuentra registrado, cualquier cambio lo puede realizar editando la información dentro de la lista.</p></div></div>',
          );
          $('#crea_vehiculos').animate({scrollTop: 0}, 600);
          $('#configuracion').val('');
          $('#configuracion').attr('disabled', true);
        }
      },
    });

    //traer datos del satelital
    var sate = {
      action: 'TraerSatelital',
      placa: $('#placa').val(),
    };
    $('#web_satelital').val('');
    $('#usuario_satelital').val('');
    $('#clave_satelital').val('');
    $.ajax({
      url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
      type: 'POST',
      data: sate,
      dataType: 'json',
      success: function (data) {
        console.log('trajo datos del prefiltro');

        if (data.result) {
          $('#web_satelital').prop('disabled', true);
          $('#usuario_satelital').prop('disabled', true);
          $('#clave_satelital').prop('disabled', true);

          $('#web_satelital').val(data.result[0].web_satelital);
          $('#usuario_satelital').val(data.result[0].usuario_satelital);
          $('#clave_satelital').val(data.result[0].clave_satelital);
        } else {
          $('#web_satelital').prop('disabled', false);
          $('#usuario_satelital').prop('disabled', false);
          $('#clave_satelital').prop('disabled', false);
          $('#web_satelital').val('');
          $('#usuario_satelital').val('');
          $('#clave_satelital').val('');
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('no trajo datos del prefiltro');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  });

  $('#cedula_propietario').focusout(function () {
    // console.log("Entro en funcion de cedula de propietario" + $("#id_propietario").val() ) ;
    if ($('#cedula_propietario').val() && $('#id_propietario').val()) {
      getTipoDocumento($('#id_propietario').val(), 'id_tipo_documento_propietario', 'digito_verificacion_propietario');
    }
  });

  $('#cedula_tenedor').focusout(function () {
    // console.log("Entro en funcion de cedula de tenedor - " + $("#id_tenedor").val() ) ;
    if ($('#cedula_tenedor').val() && $('#id_tenedor').val()) {
      getTipoDocumento($('#id_tenedor').val(), 'id_tipo_documento_tenedor', 'digito_verificacion_tenedor');
    }
  });

  $('#cedula_conductor').focusout(function () {
    // console.log("Entro en funcion de cedula de conductor - " + $("#id_conductor").val() ) ;
    if ($('#cedula_conductor').val() && $('#id_conductor').val()) {
      getTipoDocumento($('#id_conductor').val(), 'id_tipo_documento_conductor', 'digito_verificacion_conductor');
    }
  });

  // $('#btn_crea').click(function () {
  //   $('#nexos_messages_popup').html('');
  //   $('.nexos_messages_popup').html('');
  //   $('#caja_configuracion').html('<input type="text" class="typeahead form-control" placeholder="Configuración" id="configuracion">');
  //   rndcCargarVehiculoConfiguracion();
  //   $('#caja_color').html('<input type="text" class="typeahead form-control" placeholder="Color" id="color">');
  //   rndcCargarVehiculoColor();
  //   $('#caja_marca').html('<input type="text" class="typeahead form-control" placeholder="Marca" id="marca">');
  //   rndcCargarVehiculoMarca();
  //   $('#caja_linea').html('<input type="text" class="typeahead form-control" placeholder="Línea" id="linea">');
  //   rndcLineaVehiculo();
  //   $('#linea').blur(function () {
  //     // console.log("Entro en fuincion de blur del campo linea");
  //     if ($('#id_vehiculo_marca').val() && $('#id_vehiculo_linea').val()) {
  //       // console.log("Se puede verificar");
  //       rndc_verificalinea($('#id_vehiculo_marca').val(), $('#id_vehiculo_linea').val());
  //     }
  //   });
  //   $('#caja_carroceria').html('<input type="text" class="typeahead form-control" placeholder="Carrocería" id="carroceria">');
  //   rndcCargarVehiculoCarroceria();
  //   $('#caja_aseguradora').html('<input type="text" class="typeahead form-control" placeholder="Aseguradora" id="aseguradora">');
  //   rndcCargarVehiculoAseguradora();
  // });

  //funciones para la creacion del trailer
  //traer datos al formulario de creacion del trailer
  $('#btn_trailer').click(function () {
    // alert('hi baby');
    //traer marcas
    var datos = {
      action: 'datos_trailer',
    };

    $('#T_marca').html('');
    $('#T_tramite').html('');
    $('#T_configuracion').html('');
    $('#T_propietario').html('');
    $('#T_aseguradora').html('');
    $('#T_carroceria').html('');

    $.ajax({
      url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
      type: 'POST',
      data: datos,
      dataType: 'json',
      success: function (data) {
        // console.log('SI HAY DATOS TRAILER');
        data.result.forEach(function (element, index) {
          $('#T_marca').append('<option value="' + element.codigo + '">' + element.marca + '</option>');
        });

        data.result2.forEach(function (element, index) {
          $('#T_tramite').append('<option value="' + element.id + '">' + element.tramite + '</option>');
        });

        data.result3.forEach(function (element, index) {
          $('#T_configuracion').append('<option value="' + element.id + '">' + element.nombre + '-' + element.descripcion + '</option>');
        });

        data.result4.forEach(function (element, index) {
          $('#T_propietario').append(
            '<option value="' + element.numero_documento + '">' + element.nombre + '-' + element.numero_documento + '-' + element.tipo_documento + '</option>',
          );
        });

        data.result5.forEach(function (element, index) {
          $('#T_aseguradora').append('<option value="' + element.nombre + '">' + element.nombre + '</option>');
        });

        data.result6.forEach(function (element, index) {
          $('#T_carroceria').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // console.log('NO HAY DATOS TRAILER');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  });

  // $('#marca').change(function () {
  //   var marca = $('#marca').val();
  //   if (marca == '') {
  //     $('#linea').html('');
  //     $('#id_vehiculo_marca').val('');
  //     $('#rndc_vehiculo_marca').val('');
  //   } else {
  //     var cm = {
  //       marca: marca,
  //       action: 'cambiomarca',
  //     };
  //     $('#linea').html('');
  //     $.ajax({
  //       url: $('#id_url_ajax').val()+'libs/hojas_de_vida_ajax.php',
  //       type: 'POST',
  //       data: cm,
  //       dataType: 'json',
  //       success: function (data) {
  //         if (data.result) {
  //           $('#id_vehiculo_marca').val(data.result[0].id_marca_pk);
  //           $('#rndc_vehiculo_marca').val(data.result[0].rndc_marca);
  //           data.result.forEach(function (element, index) {
  //             $('#linea').append('<option value="' + element.id_line + '">' + element.descripcion + '</option>');
  //           });
  //         }
  //       },
  //       error: function (jqXHR, textStatus, errorThrown) {
  //         console.log('no trajo marcas');
  //         console.log(jqXHR);
  //         console.log(textStatus);
  //         console.log(errorThrown);
  //       },
  //     });
  //   }
  // });

  // $('#color').change(function () {
  //   var colour = $('#color').val();
  //   if (colour == '') {
  //     $('#id_vehiculo_color').val('');
  //     $('#rndc_vehiculo_color').val('');
  //   } else {
  //     var kl = {
  //       color: colour,
  //       action: 'cambiocolour',
  //     };

  //     $.ajax({
  //       url: $('#id_url_ajax').val()+'libs/hojas_de_vida_ajax.php',
  //       type: 'POST',
  //       data: kl,
  //       dataType: 'json',
  //       success: function (data) {
  //         if (data.result) {
  //           $('#id_vehiculo_color').val(data.result[0].id);
  //           $('#rndc_vehiculo_color').val(data.result[0].rndc_id);
  //         }
  //       },
  //       error: function (jqXHR, textStatus, errorThrown) {
  //         console.log('no trajo ids del color');
  //         console.log(jqXHR);
  //         console.log(textStatus);
  //         console.log(errorThrown);
  //       },
  //     });
  //   }
  // });

  // function cargarcolorn() {
  //   $.ajax({
  //     url: $('#id_url_ajax').val() + 'vehiculos/tipo_color',
  //     type: 'POST',
  //     dataType: 'json',
  //     success: function (data) {
  //       let template = '';
  //       let estado = '';
  //       data.forEach((element) => {
  //         if (element.estado === '1') {
  //           estado = 'Activo';
  //         } else {
  //           estado = 'Inactivo';
  //         }
  //         template = `
  //         <tr class="gradeA odd" role="row">
  //             <td tabindex="0" class="sorting_1">${element.id}</td>
  //             <td>${element.color}</td>
  //             <td>${estado}</td>
  //             <td class="text-center">
  //             <button class="btn btn-space btn-success btn-xs" id="btn_seleccionar_color" data-id="${element.id}" data-rncd="${element.rndc_id}"><i class="fa-solid fa-plus"></i></button>
  //             </td>
  //           </tr>
  //         `;
  //       });
  //       $('#tbl_colores').html(template);
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       console.log('no trajo colores');
  //       console.log(jqXHR);
  //       console.log(textStatus);
  //       console.log(errorThrown);
  //     },
  //   });
  // }

  // function cargarmarcasn() {
  //   var mk = {
  //     action: 'tipo_marca',
  //   };

  //   $.ajax({
  //     url: $('#id_url_ajax').val()+'libs/hojas_de_vida_ajax.php',
  //     type: 'POST',
  //     data: mk,
  //     dataType: 'json',
  //     success: function (data) {
  //       data.result.forEach(function (element, index) {
  //         $('#marca').append('<option value="' + element.id + '">' + element.marca + '</option>');
  //       });
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       console.log('no trajo marcas');
  //       console.log(jqXHR);
  //       console.log(textStatus);
  //       console.log(errorThrown);
  //     },
  //   });
  // }

  // function cargartipocarrocen() {
  //   var carro = {
  //     action: 'tipo_carroceria',
  //   };
  //   $.ajax({
  //     url: $('#id_url_ajax').val()+'libs/hojas_de_vida_ajax.php',
  //     type: 'POST',
  //     data: carro,
  //     dataType: 'json',
  //     success: function (data) {
  //       data.result.forEach(function (element, index) {
  //         $('#tipo_carroceria').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
  //       });
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       console.log('no trajo tipo carroceria');
  //       console.log(jqXHR);
  //       console.log(textStatus);
  //       console.log(errorThrown);
  //     },
  //   });
  // }

  // function cargarclasen() {
  //   var clase = {
  //     action: 'clase_vehiculo',
  //   };
  //   $.ajax({
  //     url: $('#id_url_ajax').val()+'libs/hojas_de_vida_ajax.php',
  //     type: 'POST',
  //     data: clase,
  //     dataType: 'json',
  //     success: function (data) {
  //       console.log('trajo clase');
  //       data.result.forEach(function (element, index) {
  //         $('#clase_v').append('<option value="' + element.id + '">' + element.clase + '</option>');
  //       });
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       console.log('no trajo clase');
  //       console.log(jqXHR);
  //       console.log(textStatus);
  //       console.log(errorThrown);
  //     },
  //   });
  // }

  function cargarpropietarion() {
    var datos = {
      action: 'datos_propietario',
    };
    // $("#nombre_propietario").html('Seleccione una opción');
    $.ajax({
      url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
      type: 'POST',
      data: datos,
      dataType: 'json',
      success: function (data) {
        console.log('trajo propietario');
        data.result.forEach(function (element, index) {
          $('#id_propietario').append(
            '<option value="' +
              element.numdoc_nexos +
              '">' +
              element.nombre +
              ' ' +
              element.apellido1 +
              ' ' +
              element.apellido2 +
              '-' +
              element.numero_documento +
              '/' +
              element.celular +
              '</option>',
          );
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('no trajo propietario');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }

  function cargarposeedorn() {
    var datos = {
      action: 'datos_poseedor',
    };
    // $("#nombre_poseedor").html('Seleccione una opción');
    $.ajax({
      url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
      type: 'POST',
      data: datos,
      dataType: 'json',
      success: function (data) {
        console.log('trajo poseedor');
        data.result.forEach(function (element, index) {
          $('#id_tenedor').append(
            '<option value="' +
              element.numdoc_nexos +
              '">' +
              element.nombre +
              ' ' +
              element.apellido1 +
              ' ' +
              element.apellido2 +
              '-' +
              element.numero_documento +
              '/' +
              element.celular +
              '</option>',
          );
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('no trajo poseedor');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }

  function cargarconductorn() {
    var datos = {
      action: 'datos_conductor',
    };
    $.ajax({
      url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
      type: 'POST',
      data: datos,
      dataType: 'json',
      success: function (data) {
        data.result.forEach(function (element, index) {
          $('#id_conductor').append(
            '<option value="' +
              element.numdoc_nexos +
              '">' +
              element.nombre +
              ' ' +
              element.apellido1 +
              ' ' +
              element.apellido2 +
              '-' +
              element.numero_documento +
              '/' +
              element.celular +
              '</option>',
          );
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('no trajo conductor');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }

  //Configuracion completa
  // function cargarconfi_completa() {
  //   var datos = {
  //     action: 'config_cabezote',
  //   };
  //   $.ajax({
  //     url: $('#id_url_ajax').val()+'libs/hojas_de_vida_ajax.php',
  //     type: 'POST',
  //     data: datos,
  //     dataType: 'json',
  //     success: function (data) {
  //       if (data) {
  //         $('#configuracion').html('<option value="">Seleccionar</option>');
  //         data.result.forEach(function (element, index) {
  //           $('#configuracion').append('<option value="' + element.nombre + '" data-id="' + element.nombre + '">' + element.nombre + ' - ' + element.descripcion + '</option>');
  //         });
  //       }
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       //console.log('no trajo configuracion cabezote');
  //       console.log(jqXHR);
  //       console.log(textStatus);
  //       console.log(errorThrown);
  //     },
  //   });
  // }

  //Empresas GPS
  // function cargarempgps() {
  //   $('#web_satelital').val('');
  //   var dato_gps = {
  //     action: 'carga_empr_gps',
  //   };
  //   $.ajax({
  //     url: $('#id_url_ajax').val()+'libs/hojas_de_vida_ajax.php',
  //     type: 'POST',
  //     data: dato_gps,
  //     dataType: 'json',
  //     success: function (data) {
  //       if (data) {
  //         $('#empresa_satelital').html('<option value="">Seleccionar</option>');
  //         data.result.forEach(function (element, index) {
  //           $('#empresa_satelital').append('<option value="' + element.id + '" data-id2="' + element.url + '">' + element.operador_gps + '</option>');
  //         });
  //       }
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       //console.log('no trajo configuracion cabezote');
  //       console.log(jqXHR);
  //       console.log(textStatus);
  //       console.log(errorThrown);
  //     },
  //   });
  // }

  // $('#empresa_satelital').change(function () {
  //   var url = $(this).find(':selected').data('id2');
  //   $('#web_satelital').val(url);
  // });

  // $('#repotencia').change(function () {
  //   var r = $('#repotencia').val();
  //   if (r == '0') {
  //     $('#repotenciado').prop('disabled', true);
  //     document.getElementById('campo_repotenciado').style.display = 'none';
  //   } else {
  //     $('#repotenciado').prop('disabled', false);
  //     document.getElementById('campo_repotenciado').style.display = 'block';
  //   }
  // });

  //validar el trailer si requiere
  // $('#configuracion').change(function () {
  //   RemueveFoco('#trailers');
  //   $('.nexos_messages_popup').html('');
  //   var nombre = $(this).find(':selected').data('id');
  //   //validar si necesita trailer o no
  //   var datos = {
  //     nombre: nombre,
  //     action: 'traertrailer',
  //   };
  //   $.ajax({
  //     url: $('#id_url_ajax').val()+'libs/hojas_de_vida_ajax.php',
  //     type: 'POST',
  //     data: datos,
  //     dataType: 'json',
  //     success: function (data) {
  //       $('#trailers').html('<option value="">Seleccione</option>');

  //       if (nombre == 2 || nombre == 3 || nombre == 4 || nombre == 'CA' || nombre == 'V2' || nombre == 'V3' || nombre == 'V4') {
  //         $('#trailers').html('<option value="NA">No Aplica</option>');
  //       } else {
  //         if (data.result != null && data.result != '') {
  //           data.result.forEach(function (element, index) {
  //             $('#trailers').append('<option value="' + element.id + '">' + element.placa + ' (' + element.namec + ' ' + element.descc + ')</option>');
  //           });
  //         } else {
  //           msg_error = '<p>Debe crear un trailer para la configuración <strong>' + nombre + '</strong></p>';
  //           AplicaFoco('#trailers');
  //           $('.nexos_messages_popup').html(
  //             '<div role="alert" class="alert alert-primary alert-icon alert-icon-border alert-dismissible"><div class="icon"><i class="fas fa-info"></i></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Mnensaje!</strong>' +
  //               msg_error +
  //               '</div></div>',
  //           );
  //           $('#crea_vehiculos').animate({scrollTop: 0}, 600);
  //         }
  //       }
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       console.log(jqXHR);
  //       console.log(textStatus);
  //       console.log(errorThrown);
  //     },
  //   });
  //   //configuracion completa
  // });

  //configuracion formulario editar
  $('#e_configuracion').change(function () {
    var e_confi = $('#e_configuracion').val();
    var nombre = $(this).find(':selected').data('ide');
    var dato2 = {
      nombre: nombre,
      action: 'traertrailer',
    };
    $.ajax({
      url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
      type: 'POST',
      data: dato2,
      dataType: 'json',
      success: function (data) {
        $('#e_trailers').html('<option value="">Seleccione</option>');
        if (nombre == 2 || nombre == 3 || nombre == 4 || nombre == 'CA' || nombre == 'V2' || nombre == 'V3' || nombre == 'V4') {
          $('#e_trailers').html('<option value="NA">No Aplica</option>');
        } else {
          if (data.result != null && data.result != '') {
            data.result.forEach(function (element, index) {
              $('#e_trailers').append('<option value="' + element.id + '">' + element.placa + ' (' + element.namec + ' ' + element.descc + ')</option>');
            });
          } else {
            msg_error = '<p>Debe crear un trailer para la configuración <strong>' + nombre + '</strong></p>';
            AplicaFoco('#e_trailers');
            $('.e_nexos_messages_popup').html(
              '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
                msg_error +
                '</div></div>',
            );
            $('#editar_vehiculos').animate({scrollTop: 0}, 600);
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  });

  // $('#capacidad_tn').change(function () {
  //   var peso = $('#peso_vacio').val();
  //   var capacidad = $('#capacidad_tn').val();
  //   var suma = parseFloat(peso) + parseFloat(capacidad);
  //   res = suma.toFixed(2);
  //   $('#peso_bruto').val(suma);
  // });

  // $('#peso_vacio').change(function () {
  //   var peso = $('#peso_vacio').val();
  //   var capacidad = $('#capacidad_tn').val();
  //   var suma = parseFloat(peso) + parseFloat(capacidad);
  //   res = suma.toFixed(2);
  //   $('#peso_bruto').val(suma);
  // });
  /******** FIN - FUNCIONES DEL FORMULARIO DE CREACCION DE VEHICULO ********/
});

function crear_vehiculo() {
  window.location = `${$('#id_url_ajax').val()}solicitudes/crear_vehiculos/${valores}`;
}

function Configuracion_Completa() {
  var cb = $('#configuracion_cabezote').val();
  var tr = $('#trailers').val();
  // $('#configuracion').select2({
  //   widt: '80%',
  // });
  var conf = {
    cabezote: cb,
    trailer: tr,
    action: 'confi_vehiculo',
  };
  $('#configuracion').html('');
  $.ajax({
    url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
    type: 'POST',
    data: conf,
    dataType: 'json',
    success: function (data) {
      if (data) {
        data.result.forEach(function (element, index) {
          $('#configuracion').append('<option value="' + element.id + '">' + element.nombre + '-' + element.descripcion + '</option>');
          $('#id_vehiculo_configuracion').val(element.id);
          $('#rndc_vehiculo_configuracion').val(element.rndc_id);
          $('#rndc_sigla').val(element.nombre);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no trajo configuracion');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

// function configu() {
//   $('#rndc_vehiculo_configuracion').val('');
//   $('#id_vehiculo_configuracion').val('');
//   var c = $('#configuracion').val();
//   var rndc_id = {
//     id: c,
//     action: 'traer_crndc_configuracion',
//   };
//   $.ajax({
//     url: $('#id_url_ajax').val()+'libs/hojas_de_vida_ajax.php',
//     type: 'POST',
//     data: rndc_id,
//     dataType: 'json',
//     success: function (data) {
//       console.log('trajo configuracion');
//       if (data) {
//         $('#rndc_vehiculo_configuracion').val(data.result[0].rndc_id);
//         $('#id_vehiculo_configuracion').val(data.result[0].id);
//         $('#rndc_sigla').val(data.result[0].nombre);
//       }
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log('no trajo configuracion');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

var url = $('#id_url_ajax').val() + 'libs/vehiculos_ajax.php';

// var propietarios = [];
// function cargarpropietario() {
//   // alert('cargar propietario autocomplete');
//   var params = {
//     accion: 'cargarpropietario',
//   };

//   propietarios = [];
//   $.ajaxSetup({async: false});
//   $.post(
//     url,
//     params,
//     function (data) {
//       // console.log(data);
//       if (data.success) {
//         for (let x = 0; x < data.content.length; x++) {
//           propietarios.push(data.content[x]['nombre']);
//         }
//         $('#caja_propietario .typeahead').typeahead(
//           {
//             minLength: 1,
//           },
//           {
//             name: 'states',
//             source: substringMatcher(propietarios),
//           },
//         );

//         $.ajaxSetup({async: false});
//         $('#caja_propietario').bind('typeahead:selected', function (obj, datum, name) {
//           var params = {
//             accion: 'obtenerdatosproveedor',
//             numero_documento: datum.split(' - ')[0],
//           };

//           $.post(
//             url,
//             params,
//             function (data) {
//               // console.log(data);
//               if (data.success) {
//                 var nombre = data.content.nombre;
//                 $('#nombre_propietario').val(nombre);
//                 $('#id_propietario').val(data.content.id);
//                 $('#cedula_tenedor').focus();
//               } else {
//                 $('#nombre_propietario').val('');
//               }
//             },
//             'json',
//           );
//         });
//         $.ajaxSetup({async: true});
//         $('#cedula_propietario').focusout(function () {
//           // console.log($.inArray($("#cedula_propietario").val(), propietarios));
//           if ($.inArray($('#cedula_propietario').val(), propietarios) == -1) {
//             //$("#nombre_propietario").val("");
//           } else {
//           }
//         });

//         $('#e_caja_propietario .typeahead').typeahead(
//           {
//             minLength: 1,
//           },
//           {
//             name: 'states',
//             source: substringMatcher(propietarios),
//           },
//         );

//         $.ajaxSetup({async: false});
//         $('#e_caja_propietario').bind('typeahead:selected', function (obj, datum, name) {
//           var params = {
//             accion: 'obtenerdatosproveedor',
//             numero_documento: datum.split(' - ')[0],
//           };

//           $.post(
//             url,
//             params,
//             function (data) {
//               // console.log(data);
//               if (data.success) {
//                 var nombre = data.content.nombre;
//                 $('#e_nombre_propietario').val(nombre);
//                 $('#e_id_propietario').val(data.content.id);
//                 $('#e_cedula_tenedor').focus();
//               } else {
//                 $('#e_nombre_propietario').val('');
//               }
//             },
//             'json',
//           );
//         });
//         $.ajaxSetup({async: true});
//         $('#e_cedula_propietario').focusout(function () {
//           // console.log($.inArray($("#e_cedula_propietario").val(), propietarios));
//           if ($.inArray($('#e_cedula_propietario').val(), propietarios) == -1) {
//             //$("#nombre_propietario").val("");
//           } else {
//           }
//         });
//       } else {
//       }
//     },
//     'json',
//   );
//   $.ajaxSetup({async: true});
// }

// var tenedores = [];
// function cargartenedor() {
//   // alert('cargar tenedor autocomplete');
//   var params = {
//     accion: 'cargartenedor',
//   };

//   tenedores = [];
//   $.ajaxSetup({async: false});
//   $.post(
//     url,
//     params,
//     function (data) {
//       if (data.success) {
//         for (let x = 0; x < data.content.length; x++) {
//           tenedores.push(data.content[x]['nombre']);
//         }
//         // console.log(tenedores);
//         //for(let x=0;x<cantidad_tramo;x++){
//         $('#caja_tenedor .typeahead').typeahead(
//           {
//             minLength: 1,
//           },
//           {
//             name: 'states',
//             source: substringMatcher(tenedores),
//           },
//         );

//         $.ajaxSetup({async: false});
//         $('#caja_tenedor').bind('typeahead:selected', function (obj, datum, name) {
//           var params = {
//             accion: 'obtenerdatosproveedor',
//             numero_documento: datum.split(' - ')[0],
//           };
//           $.post(
//             url,
//             params,
//             function (data) {
//               // console.log(data);
//               if (data.success) {
//                 var nombre = data.content.nombre;
//                 $('#nombre_tenedor').val(nombre);
//                 $('#id_tenedor').val(data.content.id);
//                 $('#cedula_conductor').focus();
//               } else {
//                 $('#nombre_tenedor').val('');
//               }
//             },
//             'json',
//           );
//         });
//         $.ajaxSetup({async: true});

//         $('#cedula_tenedor').focusout(function () {
//           // console.log($.inArray($("#cedula_tenedor").val(), tenedores));
//           if ($.inArray($('#cedula_tenedor').val(), tenedores) == -1) {
//             //$("#nombre_propietario").val("");
//           } else {
//           }
//         });

//         $('#e_caja_tenedor .typeahead').typeahead(
//           {
//             minLength: 1,
//           },
//           {
//             name: 'states',
//             source: substringMatcher(tenedores),
//           },
//         );

//         $.ajaxSetup({async: false});
//         $('#e_caja_tenedor').bind('typeahead:selected', function (obj, datum, name) {
//           var params = {
//             accion: 'obtenerdatosproveedor',
//             numero_documento: datum.split(' - ')[0],
//           };

//           $.post(
//             url,
//             params,
//             function (data) {
//               // console.log(data);
//               if (data.success) {
//                 var nombre = data.content.nombre;
//                 $('#e_nombre_tenedor').val(nombre);
//                 $('#e_id_tenedor').val(data.content.id);
//                 $('#e_cedula_conductor').focus();
//               } else {
//                 $('#e_nombre_tenedor').val('');
//               }
//             },
//             'json',
//           );
//         });
//         $.ajaxSetup({async: true});

//         $('#e_cedula_tenedor').focusout(function () {
//           // console.log($.inArray($("#e_cedula_tenedor").val(), tenedores));
//           if ($.inArray($('#e_cedula_tenedor').val(), tenedores) == -1) {
//             //$("#nombre_propietario").val("");
//           } else {
//           }
//         });
//       } else {
//       }
//     },
//     'json',
//   );
//   $.ajaxSetup({async: true});
// }

// var conductores = [];
// function cargarconductor() {
//   // alert('cargar conductor autocomplete');
//   var params = {
//     accion: 'cargarconductor',
//   };

//   conductores = [];
//   $.ajaxSetup({async: false});
//   $.post(
//     url,
//     params,
//     function (data) {
//       if (data.success) {
//         for (let x = 0; x < data.content.length; x++) {
//           conductores.push(data.content[x]['nombre']);
//         }
//         // console.log(conductores);

//         $('#caja_conductor .typeahead').typeahead(
//           {
//             minLength: 1,
//           },
//           {
//             name: 'states',
//             source: substringMatcher(conductores),
//           },
//         );

//         $.ajaxSetup({async: false});
//         $('#caja_conductor').bind('typeahead:selected', function (obj, datum, name) {
//           var params = {
//             accion: 'obtenerdatosproveedor',
//             numero_documento: datum.split(' - ')[0],
//           };

//           $.post(
//             url,
//             params,
//             function (data) {
//               // console.log(data);
//               if (data.success) {
//                 var nombre = data.content.nombre;
//                 $('#nombre_conductor').val(nombre);
//                 $('#id_conductor').val(data.content.id);
//                 $('#numero_poliza').focus();
//               } else {
//                 $('#nombre_conductor').val('');
//               }
//             },
//             'json',
//           );
//         });
//         $.ajaxSetup({async: true});

//         $('#cedula_conductor').focusout(function () {
//           // console.log($.inArray($("#cedula_conductor").val(), conductores));
//           if ($.inArray($('#cedula_conductor').val(), conductores) == -1) {
//             //$("#nombre_propietario").val("");
//           } else {
//           }
//         });

//         $('#e_caja_conductor .typeahead').typeahead(
//           {
//             minLength: 1,
//           },
//           {
//             name: 'states',
//             source: substringMatcher(conductores),
//           },
//         );

//         $.ajaxSetup({async: false});
//         $('#e_caja_conductor').bind('typeahead:selected', function (obj, datum, name) {
//           var params = {
//             accion: 'obtenerdatosproveedor',
//             numero_documento: datum.split(' - ')[0],
//           };

//           $.post(
//             url,
//             params,
//             function (data) {
//               // console.log(data);
//               if (data.success) {
//                 var nombre = data.content.nombre;
//                 $('#e_nombre_conductor').val(nombre);
//                 $('#e_id_conductor').val(data.content.id);
//                 $('#e_numero_poliza').focus();
//               } else {
//                 $('#e_nombre_conductor').val('');
//               }
//             },
//             'json',
//           );
//         });
//         $.ajaxSetup({async: true});

//         $('#e_cedula_conductor').focusout(function () {
//           // console.log($.inArray($("#e_cedula_conductor").val(), conductores));
//           if ($.inArray($('#e_cedula_conductor').val(), conductores) == -1) {
//             //$("#nombre_propietario").val("");
//           } else {
//           }
//         });
//       } else {
//       }
//     },
//     'json',
//   );
//   $.ajaxSetup({async: true});
// }

// var substringMatcher = function (strs) {
//   return function findMatches(q, cb) {
//     var matches, substringRegex;
//     // an array that will be populated with substring matches
//     matches = [];
//     // regex used to determine if a string contains the substring `q`
//     substrRegex = new RegExp(q, 'i');
//     // iterate through the pool of strings and for any string that
//     // contains the substring `q`, add it to the `matches` array
//     $.each(strs, function (i, str) {
//       if (substrRegex.test(str)) {
//         matches.push(str);
//       }
//     });
//     cb(matches);
//   };
// };

//TRAER DATOS AL FORMULARIO EDITAR
function editartrailer(idvehiculo) {
  // alert('editar trailer');
  var idvehiculo = idvehiculo;
  // alert(idvehiculo);
  // var idvehiculo=$("#idvehiculo_trailer").val();
  var dato = {
    id: idvehiculo,
    action: 'editar_traertrailer',
  };

  $.ajax({
    url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
    type: 'POST',
    data: dato,
    dataType: 'json',
    success: function (data) {
      console.log(data);
      if (data) {
        $('#idtrailer').val(data.result[0].idtrailer);
        $('#e_placa_trailer').val(data.result[0].placa);
        // $("#eT_marca").val(data.result[0].marca);
        var marca = $('#eT_marca').html('');
        data.result[0].lasmarcas.forEach(function (element, index) {
          var tmpSelected = '';
          if (element.selected) {
            tmpSelected = 'selected';
          }
          var marca = $('#eT_marca').append('<option ' + tmpSelected + ' value="' + element.codigo + '">' + element.marca + '</option>');
        });
        $('#eT_peso').val(data.result[0].peso_vacio);
        $('#eT_alto').val(data.result[0].alto);
        $('#eT_volumen').val(data.result[0].volumen);
        var tramite = $('#eT_tramite').html('');
        data.result[0].eltramite.forEach(function (element, index) {
          var tmpSelected = '';
          if (element.selected) {
            tmpSelected = 'selected';
          }
          var tramite = $('#eT_tramite').append('<option ' + tmpSelected + ' value="' + element.id + '">' + element.nombre + '</option>');
        });
        $('#eT_chasis').val(data.result[0].serie_chasis);
        // $("#eT_configuracion").val(data.result[0].configuracion);
        var confi = $('#eT_configuracion').html('');
        data.result[0].configura.forEach(function (element, index) {
          var tmpSelected = '';
          if (element.selected) {
            tmpSelected = 'selected';
          }
          var confi = $('#eT_configuracion').append('<option ' + tmpSelected + ' value="' + element.id + '">' + element.sigla + '-' + element.descrip + '</option>');
        });
        $('#eT_modelo').val(data.result[0].modelo);
        $('#eT_ancho').val(data.result[0].ancho);
        $('#eT_largo').val(data.result[0].largo);
        $('#eT_capacidad').val(data.result[0].capacidad);
        // $("#eT_carroceria").val(data.result[0].carroceria);
        var carroceria = $('#eT_carroceria').html('');
        data.result[0].carroceriatrailer.forEach(function (element, index) {
          var tmpSelected = '';
          if (element.selected) {
            tmpSelected = 'selected';
          }
          var carroceria = $('#eT_carroceria').append('<option ' + tmpSelected + ' value="' + element.id + '">' + element.nombre + '</option>');
        });
        $('#eT_caracteristicas').val(data.result[0].caracteristica);
        //eT_propietario
        var propietario = $('#eT_propietario').html('');
        data.result[0].propietario.forEach(function (element, index) {
          var tmpSelected = '';
          if (element.selected) {
            tmpSelected = 'selected';
          }
          var propietario = $('#eT_propietario').append(
            '<option ' + tmpSelected + ' value="' + element.id + '">' + element.nombre + '-' + element.id + '-' + element.tipo + '</option>',
          );
        });

        $('#eT_civil').val(data.result[0].numero_civil);
        //eT_aseguradora
        var aseguradora = $('#eT_aseguradora').html('');
        data.result[0].aseguratrailer.forEach(function (element, index) {
          var tmpSelected = '';
          if (element.selected) {
            tmpSelected = 'selected';
          }
          var aseguradora = $('#eT_aseguradora').append('<option ' + tmpSelected + ' value="' + element.id + '">' + element.id + '</option>');
        });
        $('#eT_fechavence').val(data.result[0].fecha_vence);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no trajo trailer a editar');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function EditarTrailer() {
  alert('Eidtar trailer');
  var data = null;
  data = new FormData();
  var placatrailer = $('#e_placa_trailer').val();
  if (placatrailer.length != 0) {
    var trailer = document.getElementById('e_foto_trailer').files;
    for (var m = 0; m < trailer.length; m++) {
      data.append('e_foto_trailer' + m, trailer[m]);
    }
    data.append('accion', 'EditarTrailer');
    data.append('eplaca_trailer', $('#e_placa_trailer').val());
    data.append('emarca', $('#eT_marca').val());
    data.append('epeso', $('#eT_peso').val());
    data.append('ealto', $('#eT_alto').val());
    data.append('evolumen', $('#eT_volumen').val());
    data.append('etramite', $('#eT_tramite').val());
    data.append('echasis', $('#eT_chasis').val());
    data.append('econfiguracion', $('#eT_configuracion').val());
    data.append('emodelo', $('#eT_modelo').val());
    data.append('eancho', $('#eT_ancho').val());
    data.append('elargo', $('#eT_largo').val());
    data.append('ecapacidad', $('#eT_capacidad').val());
    data.append('ecarroceria', $('#eT_carroceria').val());
    data.append('ecaracteristicas', $('#eT_caracteristicas').val());
    data.append('epropietario', $('#eT_propietario').val());
    data.append('ecivil', $('#eT_civil').val());
    data.append('easeguradora', $('#eT_aseguradora').val());
    data.append('efechavence', $('#eT_fechavence').val());
    data.append('idtrailer', $('#idtrailer').val());
  }

  var url = $('#id_url_ajax').val() + 'libs/vehiculos_ajax.php';

  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    cache: false,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    dataType: 'json',
    success: function (data, textStatus, jqXHR) {
      console.log('ACTUALIZO TRAILER');
      alert('Datos Actualizados Existosamente!!!');
      $('html, body').animate({scrollTop: 0}, 600);
      setTimeout(function () {
        location.reload(false);
      }, 800);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('NO ACTUALIZO TRAILER');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function CrearTrailer() {
  alert('crear el trailer');
  var data = null;
  data = new FormData();
  //fotos del trailer
  var trailer = document.getElementById('foto_trailer').files;
  for (var m = 0; m < trailer.length; m++) {
    data.append('foto_trailer' + m, trailer[m]);
  }
  //DATOS DEL TRAILER
  var placat = $('#placa_trailer').val();
  if (placat.length != 0) {
    data.append('accion', 'CrearTrailer');
    data.append('placa_trailer', $('#placa_trailer').val());
    data.append('T_marca', $('#T_marca').val());
    data.append('T_peso', $('#T_peso').val());
    data.append('T_alto', $('#T_alto').val());
    data.append('T_volumen', $('#T_volumen').val());
    data.append('T_tramite', $('#T_tramite').val());
    data.append('T_chasis', $('#T_chasis').val());
    data.append('T_configuracion', $('#T_configuracion').val());
    data.append('T_modelo', $('#T_modelo').val());
    data.append('T_ancho', $('#T_ancho').val());
    data.append('T_largo', $('#T_largo').val());
    data.append('T_capacidad', $('#T_capacidad').val());
    data.append('T_carroceria', $('#T_carroceria').val());
    data.append('T_caracteristicas', $('#T_caracteristicas').val());
    data.append('T_propietario', $('#T_propietario').val());
    data.append('T_civil', $('#T_civil').val());
    data.append('T_aseguradora', $('#T_aseguradora').val());
    data.append('T_fechavence', $('#T_fechavence').val());
  }

  var url = $('#id_url_ajax').val() + 'libs/vehiculos_ajax.php';
  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    cache: false,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    dataType: 'json',
    success: function (data, textStatus, jqXHR) {
      console.log('si inserto trailer');
      // console.log(data);
      alert('Datos del trailer registrados Exitosamente');
      $('html, body').animate({scrollTop: 0}, 600);
      setTimeout(function () {
        location.reload(false);
      }, 800);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('error no inserta trailer');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

// function crearVehiculo() {
//   $('.nexos_messages_popup').html('');
//   var data = null;
//   data = new FormData();
//   //ARCHIVOS - frontal
//   // var carro = document.getElementById('foto_vehiculo').files[0];
//   // for (var i = 0; i < carro.length; i++) {
//   //   data.append('foto_vehiculo' + i, carro[i]);
//   // }
//   data.append('foto_vehiculo', document.getElementById('foto_vehiculo').files[0]);

//   // var der = document.getElementById('foto_vehiculod').files;
//   // for (var f = 0; f < der.length; f++) {
//   //   data.append('foto_vehiculod' + f, der[f]);
//   // }
//   data.append('foto_vehiculod', document.getElementById('foto_vehiculod').files[0]);

//   // var izqui = document.getElementById('foto_vehiculoi').files;
//   // for (var a = 0; a < izqui.length; a++) {
//   //   data.append('foto_vehiculoi' + a, izqui[a]);
//   // }
//   data.append('foto_vehiculoi', document.getElementById('foto_vehiculoi').files[0]);

//   // var trase = document.getElementById('foto_vehiculoa').files;
//   // for (var b = 0; b < trase.length; b++) {
//   //   data.append('foto_vehiculoa' + b, trase[b]);
//   // }

//   data.append('foto_vehiculoa', document.getElementById('foto_vehiculoa').files[0]);
//   //soat y tecnomecanica

//   // var soat = document.getElementById('foto_soat').files;
//   // for (var m = 0; m < soat.length; m++) {
//   //   data.append('foto_soat' + m, soat[m]);
//   // }
//   data.append('foto_soat', document.getElementById('foto_soat').files[0]);

//   // var tecno = document.getElementById('foto_tecno').files;
//   // for (var n = 0; n < tecno.length; n++) {
//   //   data.append('foto_tecno' + n, tecno[n]);
//   // }
//   data.append('foto_tecno', document.getElementById('foto_tecno').files[0]);

//   // var transi = document.getElementById('foto_transi').files;
//   // for (var k = 0; k < transi.length; k++) {
//   //   data.append('foto_transi' + k, transi[k]);
//   // }
//   data.append('foto_transi', document.getElementById('foto_transi').files[0]);

//   //DATOS CMX_VEHICULOS
//   // data.append('accion', 'crearVehiculo');
//   data.append('placa', $('#placa').val());
//   data.append('id_propietario', $('#id_propietario').val());
//   data.append('id_tenedor', $('#id_tenedor').val());
//   data.append('id_conductor', $('#id_conductor').val());
//   //data.append("tipo_vehiculo", $("#id_tipo_vehiculo").val());
//   data.append('tipo_carroceria', $('#tipo_carroceria').val());
//   data.append('web_satelital', $('#web_satelital').val());
//   data.append('usuario_satelital', $('#usuario_satelital').val());
//   data.append('clave_satelital', $('#clave_satelital').val());
//   data.append('empresasatelite', $('#empresa_satelital').val());
//   //DATOS CMX_DETALLE_VEHICULO
//   // data.append("num_licencia", $("#num_licencia").val());
//   // data.append("fecha_tarjeta_propiedad", $("#fecha_tarjeta_propiedad").val());
//   // data.append("fechavence_tarjeta_propiedad", $("#fechavence_tarjeta_propiedad").val());
//   data.append('tecnomecanica', $('#tecnomecanica').val());
//   data.append('fecha_tecno', $('#fecha_tecno').val());
//   data.append('fecha_vig_tecno', $('#fecha_vig_tecno').val());
//   //DATOS CMX_VEHICULO2
//   data.append('configuracion', $('#id_vehiculo_configuracion').val());
//   data.append('clase', $('#clase_v').val());
//   data.append('color', $('#color').val());
//   data.append('marca', $('#marca').val());
//   data.append('linea', $('#linea').val());
//   data.append('modelo', $('#modelo').val());
//   data.append('tipo_combustible', $('#tipo_combustible').val());
//   //rndc carroceria en el formulario
//   //data.append("carroceria", $("#carroceria").val());
//   data.append('peso_vacio', $('#peso_vacio').val());
//   //numero soat
//   data.append('numero_poliza', $('#numero_poliza').val());
//   data.append('soat_vencimiento', $('#soat_vencimiento').val());
//   data.append('aseguradora', $('#id_vehiculo_aseguradora').val());
//   data.append('num_motor', $('#num_motor').val());
//   data.append('num_chasis', $('#num_chasis').val());
//   data.append('numero_poliza', $('#numero_poliza').val());
//   data.append('fecha_poliza', $('#fecha_poliza').val());
//   data.append('repotenciado', $('#repotenciado').val());
//   data.append('tipovinculacion', $('#tipovinculacion').val());
//   data.append('fecha_mantenimientogps', $('#fecha_mantenimientogps').val());
//   data.append('capacidad_tn', $('#capacidad_tn').val());
//   data.append('trailers', $('#trailers').val());
//   data.append('peso_bruto', $('#peso_bruto').val());
//   data.append('f_matricula', $('#f_matricula').val());
//   data.append('lice_transito', $('#lice_transito').val());
//   data.append('cant_viaje', $('#cant_viaje').val());

//   //nombres de los documentos
//   data.append('name_frontal', $('#name_frontal').val());
//   data.append('name_derecha', $('#name_derecha').val());
//   data.append('name_izquierda', $('#name_izquierda').val());
//   data.append('name_atras', $('#name_atras').val());
//   data.append('name_soat', $('#name_soat').val());
//   data.append('name_tecno', $('#name_tecno').val());
//   data.append('name_transi', $('#name_transi').val());

//   // var url = $('#id_url_ajax').val() + 'libs/vehiculos_ajax.php';
//   var url = $('#id_url_ajax').val() + 'vehiculos/Insertar_vehiculo';
//   $.ajax({
//     url: url,
//     type: 'POST',
//     data: data,
//     cache: false,
//     processData: false, // Don't process the files
//     contentType: false, // Set content type to false as jQuery will tell the server its a query string request
//     dataType: 'json',
//     beforeSend: function () {
//       //ACCION QUE SUCEDE ANTES DE HACER EL SUBMIT
//       // loadingOverlay.style.display = "flex";
//       $('#loading-overlay').css('display', 'flex');
//     },
//     success: function (data, textStatus, jqXHR) {
//       if (!data.error) {
//         $('#loading-overlay').css('display', 'none');
//         icon = 'check';
//         color = 'success';
//         pal = 'Proceso terminado';
//         mensaje = 'Datos Vehículo Registrado Exitosamente NEXOSAPP';
//         placa = $('#placa').val();
//         crear_Dato_Ministerio(placa); //Envío de datos al Web service
//         crear_Dato_Oet(placa);
//         limpiar_modal_vehiculo(); // colocar funcion de limpiar campos
//       } else {
//         $('#loading-overlay').css('display', 'none');
//         icon = 'close';
//         color = 'danger';
//         pal = 'Error';
//         mensaje = 'Datos Vehículo No Registrado  NEXOSAPP';
//       }
//       $('.nexos_messages_popup').append(
//         '<div role="alert" class="alert alert-' +
//           color +
//           ' alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-' +
//           icon +
//           '"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>' +
//           pal +
//           '!</strong>' +
//           mensaje +
//           '</div></div>',
//       );
//       $('#crea_vehiculos').animate({scrollTop: 0}, 600);
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log('error no inserta');
//       $('#crea_vehiculos').css('display', 'none');
//       $('.nexos_messages_popup').html(
//         '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Ha ocurrrido un error ' +
//           jqXHR.responseText +
//           '.</div></div>',
//       );
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

// function crear_Dato_Ministerio(placa) {
//   proceso = 12;
//   var paquete_transmite = 'placa=' + placa + '&proceso=' + proceso + '&dato=3' + '&filtro=""' + '&tipopro=3';
//   $.post(
//     $('#id_url_ajax').val() + 'web_service/vehiculos',
//     paquete_transmite,
//     function (data) {
//       if (data.status == 'true') {
//         tablas_locales = 'Se Registro Datos Exitosamente RNDC';
//         $('.nexos_messages_popup').append(
//           '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
//             tablas_locales +
//             ' - ' +
//             data.resultado +
//             '</div></div>',
//         );
//         $('#crea_vehiculos').animate({scrollTop: 0}, 600);
//       } else if (data.status == 'false') {
//         tablas_locales = 'No se creo el Vehículo en RNDC';
//         $('.nexos_messages_popup').append(
//           '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
//             tablas_locales +
//             ' - ' +
//             data.resultado +
//             '</div></div>',
//         );
//         $('#crea_vehiculos').animate({scrollTop: 0}, 600);
//       }
//     },
//     'json',
//   );
// }

// function crear_Dato_Oet(placa) {
//   clase = 2;
//   recurso = 6;
//   valor = '&dato_recurso=' + placa;
//   var paquete = 'clase_recurso=' + clase + '&recurso=' + recurso + valor;
//   $.post(
//     $('#id_url_ajax').val() + 'integrar_oet/Consulta_Recurso_Avansat',
//     paquete,
//     function (data) {
//       if (data.status == true || data.status == 'true') {
//         var tablas_locales = 'Se Registro Vehículo Exitosamente GRUPO OET';
//         $('.nexos_messages_popup').append(
//           '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
//             tablas_locales +
//             '</div></div>',
//         );
//         $('#crea_vehiculos').animate({scrollTop: 0}, 600);
//       } else if (data.status == false || data.status == 'false') {
//         var tablas_locales = 'No se creo el Vehículo en GRUPO OET';
//         $('.nexos_messages_popup').append(
//           '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong> ' +
//             tablas_locales +
//             ' - ' +
//             data.error +
//             '</div></div>',
//         );
//         $('#crea_vehiculos').animate({scrollTop: 0}, 600);
//       }
//     },
//     'json',
//   );
// }

function historialconductores(id_vehiculo) {
  var id_vehiculo = id_vehiculo;
  var datos = {
    id: id_vehiculo,
    action: 'historicovehiculo',
  };
  $('#tbproveedor').html('');
  $.ajax({
    url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
    type: 'POST',
    data: datos,
    dataType: 'json',
    success: function (data) {
      console.log(data);
      data.result.forEach(function (element, index) {
        $('#tbproveedor').append(
          '<tr>' +
            '<td>' +
            element.estado +
            '</td>' +
            '<td>' +
            element.numero_documento +
            '/' +
            element.nombre +
            '</td>' +
            '<td>' +
            element.fecha_anterior +
            '</td>' +
            '<td>' +
            element.fecha_actual +
            '</td>' +
            '</tr>',
        );
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no hay historico');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

$('#e_repotencia').change(function () {
  var repotencia = $('#e_repotencia').val();
  if (repotencia == 0) {
    $('#e_repotenciado').prop('disabled', true);
  } else {
    $('#e_repotenciado').prop('disabled', true);
    $('#e_repotenciado').val('');
    $('#e_repotenciado').prop('disabled', false);
  }
});

//TRAER DATOS DEL VEHICULO NUEVO
// function editardatosvehiculonew(id_vehiculo) {
//   //alert('consulta datos vehiculares a editar');
//   var traerdatos = {
//     id: id_vehiculo,
//     action: 'traer_datos_vehiculo',
//   };
//   $.ajax({
//     url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
//     type: 'POST',
//     data: traerdatos,
//     dataType: 'json',
//     success: function (data) {
//       console.log('ok datos del vehiculo');
//       //poner los datos del vehículo
//       console.log(data);
//       if (data.result) {
//         if (data.result[0].estado_proceso == 'bloqueado') {
//           $('.des').prop('disabled', true);
//           $('#idblok').html('<p class="text-danger">Bloqueado</p>');
//           $('#btn_editar_vehiculonew').hide();
//         }
//         if (data.result[0].licencia_transito != null && data.result[0].licencia_transito != '') {
//           licen = data.result[0].licencia_transito;
//         } else if (data.result[0].licencia_transito == '0' || data.result[0].licencia_transito == null || data.result[0].licencia_transito == '') {
//           licen = '000000';
//         }

//         $('#idvehiculo_trailer').val(id_vehiculo);
//         $('#e_placa').val(data.result[0].placa);
//         $('#e_modelo').val(data.result[0].anio_fabricacion);
//         $('#e_peso_vacio').val(data.result[0].peso);
//         $('#e_numero_poliza').val(data.result[0].num_soat);
//         $('#e_soat_vencimiento').val(data.result[0].vence_soat);
//         $('#e_tecnomecanica').val(data.result[0].tecnomecanica);
//         $('#e_fecha_tecno').val(data.result[0].tecno_fecha_expedida);
//         $('#e_fecha_vig_tecno').val(data.result[0].tecno_fecha_vigencia);
//         $('#e_web_satelital').val(data.result[0].web_satelital);
//         $('#e_usuario_satelital').val(data.result[0].usuario_satelital);
//         $('#e_clave_satelital').val(data.result[0].clave_satelital);
//         $('#e_placa_trailer').val(data.result[0].placa_trailer);
//         $('#e_ntransito').val(licen);
//         $('#ecant_viaje').val(data.result[0].cant_viajes);

//         // $("#e_num_licencia").val(data.result[0].numero_licencia);
//         // $("#e_fecha_tarjeta_propiedad").val(data.result[0].fecha_expe_licencia);
//         // $("#e_fechavence_tarjeta_propiedad").val(data.result[0].fecha_vence_licencia);
//         var combustible = data.result[0].cod_tipo_combustible;
//         var c = '';
//         if (combustible == 1) {
//           c = 'Gasolina';
//           $('#e_tipo_combustible').html(
//             '<option value="1">' +
//               c +
//               '</option>' +
//               '<option value="2">GNV</option>' +
//               '<option value="3">Diesel</option>' +
//               '<option value="4">Gas Gasol</option>' +
//               '<option value="5">Electrico</option>' +
//               '<option value="6" disabled="disabled">Hidrogeno</option>' +
//               '<option value="7" disabled="disabled">Etanol</option>' +
//               '<option value="8" disabled="disabled">Biodiesel</option>' +
//               '<option value="9" disabled="disabled">GLP</option>' +
//               '<option value="10" disabled="disabled">Gaso Elec</option>' +
//               '<option value="11" disabled="disabled">Dies Elec</option>' +
//               '<option value="12">ACPM</option>' +
//               '<option value="13">Gas</option>',
//           );
//         }
//         if (combustible == 2) {
//           c = 'GNV';
//           $('#e_tipo_combustible').html(
//             '<option value="2">' +
//               c +
//               '</option>' +
//               '<option value="1">Gasolina</option>' +
//               '<option value="3">Diesel</option>' +
//               '<option value="4" disabled="disabled">Gas Gasol</option>' +
//               '<option value="5">Electrico</option>' +
//               '<option value="6" disabled="disabled">Hidrogeno</option>' +
//               '<option value="7" disabled="disabled">Etanol</option>' +
//               '<option value="8" disabled="disabled">Biodiesel</option>' +
//               '<option value="9" disabled="disabled">GLP</option>' +
//               '<option value="10">Gaso Elec</option>' +
//               '<option value="11" disabled="disabled">Dies Elec</option>' +
//               '<option value="12">ACPM</option>' +
//               '<option value="13" disabled="disabled">Gas</option>',
//           );
//         }
//         if (combustible == 3) {
//           c = 'Diesel';
//           $('#e_tipo_combustible').html(
//             '<option value="3">' +
//               c +
//               '</option>' +
//               '<option value="1">Gasolina</option>' +
//               '<option value="2">GNV</option>' +
//               '<option value="4">Gas Gasol</option>' +
//               '<option value="5">Electrico</option>' +
//               '<option value="6" disabled="disabled">Hidrogeno</option>' +
//               '<option value="7" disabled="disabled">Etanol</option>' +
//               '<option value="8" disabled="disabled">Biodiesel</option>' +
//               '<option value="9" disabled="disabled">GLP</option>' +
//               '<option value="10" disabled="disabled">Gaso Elec</option>' +
//               '<option value="11" disabled="disabled">Dies Elec</option>' +
//               '<option value="12">ACPM</option>' +
//               '<option value="13" disabled="disabled">Gas</option>',
//           );
//         }
//         if (combustible == 4) {
//           c = 'Gas Gasol';
//           $('#e_tipo_combustible').html(
//             '<option value="4" disabled="disabled">' +
//               c +
//               '</option>' +
//               '<option value="1" >Gasolina</option>' +
//               '<option value="2">GNV</option>' +
//               '<option value="3">Diesel</option>' +
//               '<option value="5">Electrico</option>' +
//               '<option value="6" disabled="disabled">Hidrogeno</option>' +
//               '<option value="7" disabled="disabled">Etanol</option>' +
//               '<option value="8" disabled="disabled">Biodiesel</option>' +
//               '<option value="9" disabled="disabled">GLP</option>' +
//               '<option value="10" disabled="disabled">Gaso Elec</option>' +
//               '<option value="11" disabled="disabled">Dies Elec</option>' +
//               '<option value="12">ACPM</option>' +
//               '<option value="13" disabled="disabled">Gas</option>',
//           );
//         }
//         if (combustible == 5) {
//           c = 'Electrico';
//           $('#e_tipo_combustible').html(
//             '<option value="5">' +
//               c +
//               '</option>' +
//               '<option value="1">Gasolina</option>' +
//               '<option value="2">GNV</option>' +
//               '<option value="3">Diesel</option>' +
//               '<option value="4" disabled="disabled">Gas Gasol</option>' +
//               '<option value="6" disabled="disabled">Hidrogeno</option>' +
//               '<option value="7" disabled="disabled">Etanol</option>' +
//               '<option value="8" disabled="disabled">Biodiesel</option>' +
//               '<option value="9" disabled="disabled">GLP</option>' +
//               '<option value="10" disabled="disabled">Gaso Elec</option>' +
//               '<option value="11" disabled="disabled">Dies Elec</option>' +
//               '<option value="12">ACPM</option>' +
//               '<option value="13" disabled="disabled">Gas</option>',
//           );
//         }
//         if (combustible == 6) {
//           c = 'Hidrogeno';
//           $('#e_tipo_combustible').html(
//             '<option value="6" disabled="disabled">' +
//               c +
//               '</option>' +
//               '<option value="1">Gasolina</option>' +
//               '<option value="2">GNV</option>' +
//               '<option value="3">Diesel</option>' +
//               '<option value="4" disabled="disabled">Gas Gasol</option>' +
//               '<option value="5">Electrico</option>' +
//               '<option value="7" disabled="disabled">Etanol</option>' +
//               '<option value="8" disabled="disabled">Biodiesel</option>' +
//               '<option value="9" disabled="disabled">GLP</option>' +
//               '<option value="10" disabled="disabled">Gaso Elec</option>' +
//               '<option value="11" disabled="disabled">Dies Elec</option>' +
//               '<option value="12">ACPM</option>' +
//               '<option value="13" disabled="disabled">Gas</option>',
//           );
//         }
//         if (combustible == 7) {
//           c = 'Etanol';
//           $('#e_tipo_combustible').html(
//             '<option value="7" disabled="disabled">' +
//               c +
//               '</option>' +
//               '<option value="1">Gasolina</option>' +
//               '<option value="2">GNV</option>' +
//               '<option value="3">Diesel</option>' +
//               '<option value="4" disabled="disabled">Gas Gasol</option>' +
//               '<option value="5">Electrico</option>' +
//               '<option value="6" disabled="disabled">Hidrogeno</option>' +
//               '<option value="8" disabled="disabled">Biodiesel</option>' +
//               '<option value="9" disabled="disabled">GLP</option>' +
//               '<option value="10" disabled="disabled">Gaso Elec</option>' +
//               '<option value="11" disabled="disabled">Dies Elec</option>' +
//               '<option value="12">ACPM</option>' +
//               '<option value="13" disabled="disabled">Gas</option>',
//           );
//         }
//         if (combustible == 8) {
//           c = 'Biodiesel';
//           $('#e_tipo_combustible').html(
//             '<option value="8" disabled="disabled">' +
//               c +
//               '</option>' +
//               '<option value="1">Gasolina</option>' +
//               '<option value="2">GNV</option>' +
//               '<option value="3">Diesel</option>' +
//               '<option value="4" disabled="disabled">Gas Gasol</option>' +
//               '<option value="5">Electrico</option>' +
//               '<option value="6" disabled="disabled">Hidrogeno</option>' +
//               '<option value="7" disabled="disabled">Etanol</option>' +
//               '<option value="9" disabled="disabled">GLP</option>' +
//               '<option value="10" disabled="disabled">Gaso Elec</option>' +
//               '<option value="11" disabled="disabled">Dies Elec</option>' +
//               '<option value="12">ACPM</option>' +
//               '<option value="13" disabled="disabled">Gas</option>',
//           );
//         }
//         if (combustible == 9) {
//           c = 'GLP';
//           $('#e_tipo_combustible').html(
//             '<option value="9" disabled="disabled">' +
//               c +
//               '</option>' +
//               '<option value="1">Gasolina</option>' +
//               '<option value="2">GNV</option>' +
//               '<option value="3">Diesel</option>' +
//               '<option value="4" disabled="disabled">Gas Gasol</option>' +
//               '<option value="5">Electrico</option>' +
//               '<option value="6" disabled="disabled">Hidrogeno</option>' +
//               '<option value="7" disabled="disabled">Etanol</option>' +
//               '<option value="8" disabled="disabled">Biodiesel</option>' +
//               '<option value="10" disabled="disabled">Gaso Elec</option>' +
//               '<option value="11" disabled="disabled">Dies Elec</option>' +
//               '<option value="12">ACPM</option>' +
//               '<option value="13" disabled="disabled">Gas</option>',
//           );
//         }
//         if (combustible == 10) {
//           c = 'Gaso Elec';
//           $('#e_tipo_combustible').html(
//             '<option value="10">' +
//               c +
//               '</option>' +
//               '<option value="1">Gasolina</option>' +
//               '<option value="2">GNV</option>' +
//               '<option value="3">Diesel</option>' +
//               '<option value="4" disabled="disabled">Gas Gasol</option>' +
//               '<option value="5">Electrico</option>' +
//               '<option value="6" disabled="disabled">Hidrogeno</option>' +
//               '<option value="7" disabled="disabled">Etanol</option>' +
//               '<option value="8" disabled="disabled">Biodiesel</option>' +
//               '<option value="10" disabled="disabled">Gaso Elec</option>' +
//               '<option value="11" disabled="disabled">Dies Elec</option>' +
//               '<option value="12">ACPM</option>' +
//               '<option value="13" disabled="disabled">Gas</option>',
//           );
//         }
//         if (combustible == 11) {
//           c = 'Gaso Elec';
//           $('#e_tipo_combustible').html(
//             '<option value="11" disabled="disabled">' +
//               c +
//               '</option>' +
//               '<option value="1">Gasolina</option>' +
//               '<option value="2">GNV</option>' +
//               '<option value="3">Diesel</option>' +
//               '<option value="4" disabled="disabled">Gas Gasol</option>' +
//               '<option value="5">Electrico</option>' +
//               '<option value="6" disabled="disabled">Hidrogeno</option>' +
//               '<option value="7" disabled="disabled">Etanol</option>' +
//               '<option value="8" disabled="disabled">Biodiesel</option>' +
//               '<option value="10" disabled="disabled">Gaso Elec</option>' +
//               '<option value="9" disabled="disabled">GLP</option>' +
//               '<option value="12">ACPM</option>' +
//               '<option value="13" disabled="disabled">Gas</option>',
//           );
//         }
//         if (combustible == 12) {
//           c = 'ACPM';
//           $('#e_tipo_combustible').html(
//             '<option value="12">' +
//               c +
//               '</option>' +
//               '<option value="1">Gasolina</option>' +
//               '<option value="2">GNV</option>' +
//               '<option value="3">Diesel</option>' +
//               '<option value="4">Gas Gasol</option>' +
//               '<option value="5">Electrico</option>' +
//               '<option value="6" disabled="disabled">Hidrogeno</option>' +
//               '<option value="7" disabled="disabled">Etanol</option>' +
//               '<option value="8" disabled="disabled">Biodiesel</option>' +
//               '<option value="10" disabled="disabled">Gaso Elec</option>' +
//               '<option value="9" disabled="disabled">GLP</option>' +
//               '<option value="11" disabled="disabled" >Dies Elec</option>' +
//               '<option value="13" disabled="disabled">Gas</option>',
//           );
//         }
//         if (combustible == 13) {
//           c = 'Dies Elec';
//           $('#e_tipo_combustible').html(
//             '<option value="11" disabled="disabled">' +
//               c +
//               '</option>' +
//               '<option value="1">Gasolina</option>' +
//               '<option value="2">GNV</option>' +
//               '<option value="3">Diesel</option>' +
//               '<option value="4" disabled="disabled">Gas Gasol</option>' +
//               '<option value="5">Electrico</option>' +
//               '<option value="6" disabled="disabled">Hidrogeno</option>' +
//               '<option value="7" disabled="disabled">Etanol</option>' +
//               '<option value="8" disabled="disabled">Biodiesel</option>' +
//               '<option value="9" disabled="disabled">GLP</option>' +
//               '<option value="10" disabled="disabled">Gaso Elec</option>' +
//               '<option value="12">ACPM</option>' +
//               '<option value="13" disabled="disabled">Gas</option>',
//           );
//         }
//         $('#id_carro').val(data.result[0].elid);
//         //traer datos para campos que no se editan
//         //$("#e_configuracion").val(data.result[0].v_confi+'-'+data.result[0].v_descri);
//         //$("#e_color").val(data.result[0].color);
//         //$("#e_marca").val(data.result[0].marca);
//         //$("#e_linea").val(data.result[0].linea);

//         //$("#e_tipo_carroceria").val(data.result[0].tipo_carroceria);
//         //$("#e_carroceria").val(data.result[0].cod_rndc_carroceria);
//         if (data.result[0].repotenciado == 0) {
//           $('#e_repotenciado').prop('disbaled', true);
//           $('#e_repotencia').html('<option value="0">No</option>' + '<option value="1">Si</option>');
//         } else {
//           $('#e_repotenciado').prop('disbaled', false);
//           $('#e_repotencia').html('<option value="1">Si</option>' + '<option value="0">No</option>');
//         }
//         $('#e_num_motor').val(data.result[0].num_motor);
//         $('#e_num_chasis').val(data.result[0].num_chasis);
//         $('#e_numerito_poliza').val(data.result[0].poliza_responsabilidad);
//         $('#e_fecha_poliza').val(data.result[0].vence_poliza);
//         $('#e_repotenciado').val(data.result[0].repotenciado);
//         $('#e_fecha_mantenimientogps').val(data.result[0].fecha_mant_gps);
//         $('#e_capacidad_tn').val(data.result[0].capacidad_tn);
//         $('#e_bruto_kg').val(data.result[0].pesobruto_kg);
//         $('#e_fecha_matricula').val(data.result[0].f_matricula);

//         var vincular = data.result[0].tipo_vinculacion;
//         if (vincular == '') {
//           $('#e_tipovinculacion').html(
//             '<option value="">Seleccione</option>' +
//               '<option value="Tercero">Tercero</option>' +
//               '<option value="Propio">Propio</option>' +
//               '<option value="Afiliado">Afiliado</option>' +
//               '<option value="Aliado">Aliado</option>',
//           );
//         }
//         if (vincular == 'Tercero') {
//           $('#e_tipovinculacion').html(
//             '<option value="' +
//               vincular +
//               '">Tercero</option>' +
//               '<option value="Propio">Propio</option>' +
//               '<option value="Afiliado">Afiliado</option>' +
//               '<option value="Aliado">Aliado</option>',
//           );
//         }
//         if (vincular == 'Propio') {
//           $('#e_tipovinculacion').html(
//             '<option value="' +
//               vincular +
//               '">Propio</option>' +
//               '<option value="Tercero">Tercero</option>' +
//               '<option value="Afiliado">Afiliado</option>' +
//               '<option value="Aliado">Aliado</option>',
//           );
//         }
//         if (vincular == 'Afiliado') {
//           $('#e_tipovinculacion').html(
//             '<option value="' +
//               vincular +
//               '">Afiliado</option>' +
//               '<option value="Tercero">Tercero</option>' +
//               '<option value="Propio">Propio</option>' +
//               '<option value="Aliado">Aliado</option>',
//           );
//         }
//         if (vincular == 'Aliado') {
//           $('#e_tipovinculacion').html(
//             '<option value="' +
//               vincular +
//               '">Aliado</option>' +
//               '<option value="Tercero">Tercero</option>' +
//               '<option value="Propio">Propio</option>' +
//               '<option value="Afiliado">Afiliado</option>',
//           );
//         }
//         //ARCHIVOS MOSTRAR LOS QUE YA EXISTEN
//         //vehiculo
//         $('#e_ruta_vehiculo').val(data.result[0].foto_vehiculo);
//         $('#e_caja_vehiculo').html(data.archivos);
//         //trailer
//         $('#e_ruta_trailer').val(data.result[0].foto_trailer);
//         $('#e_caja_trailer').html(data.archivost);

//         //traer campos para los selects que son editables
//         // e_tipovehiculo , Solo servicio al cliente
//         //var tipo=$('#e_tipovehiculo').html('');
//         /*data.result[0].tipo_vehiculo.forEach(function(element,index){
// 					var tmpSelected = "";
// 					if(element.selected){
// 						tmpSelected = "selected";
// 					}
// 					var tipo=$('#e_tipovehiculo').append('<option '+tmpSelected+' value="'+element.tipo_carro+'">'+element.tipo_carron+'</option>');
// 				});*/
//         // e_aseguradora
//         var asegure = $('#e_aseguradora').html('');
//         data.result[0].aseguradora.forEach(function (element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var tipo = $('#e_aseguradora').append('<option ' + tmpSelected + ' value="' + element.idasegure + '">' + element.asegure + '</option>');
//         });

//         //configuracion
//         var confi = $('#e_configuracion').html('');
//         data.result[0].configuracion.forEach(function (element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var conf = $('#e_configuracion').append(
//             '<option ' + tmpSelected + ' value="' + element.id + '" data-ide="' + element.nombre + '">' + element.nombre + '-' + element.descripcion + '</option>',
//           );
//           //$("#eid_vehiculo_configuracion").val(element.id);
//           //$("#erndc_vehiculo_configuracion").val(element.rndc_id);
//         });

//         //color
//         var color = $('#e_color').html('');
//         data.result[0].color.forEach(function (element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var colour = $('#e_color').append('<option ' + tmpSelected + ' value="' + element.idcolor + '">' + element.color + '</option>');
//         });

//         //marca
//         var marca = $('#e_marca').html('');
//         data.result[0].marca.forEach(function (element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var marca = $('#e_marca').append('<option ' + tmpSelected + ' value="' + element.idmarca + '">' + element.marca + '</option>');
//         });

//         //linea
//         var linea = $('#e_linea').html('');
//         data.result[0].line.forEach(function (element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var linea = $('#e_linea').append('<option ' + tmpSelected + ' value="' + element.idlinea + '">' + element.linea + '</option>');
//         });

//         //carroceria
//         //var carro=$("#e_carroceria").html('');
//         var carro = $('#e_tipo_carroceria').html('');
//         data.result[0].carroceria.forEach(function (element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           //var carro=$("#e_carroceria").append('<option '+tmpSelected+' value="'+element.carroceria+'">'+element.carroceria+'</option>');
//           var carro = $('#e_tipo_carroceria').append('<option ' + tmpSelected + ' value="' + element.id_carroceria + '">' + element.carroceria + '</option>');
//         });

//         //tipo carroceria
//         /*var tcarro=$("#e_tipo_carroceria").html('');
// 				data.result[0].tipocarroceria.forEach(function(element,index){
// 					var tmpSelected="";
// 					if(element.selected){
// 						tmpSelected="selected";
// 					}
// 					var tcarcarroceriaro=$("#e_tipo_carroceria").append('<option '+tmpSelected+' value="'+element.tipocarroceria+'">'+element.tipocarroceria+'</option>');
// 				});*/

//         //clase
//         var tclase = $('#e_clasevehiculo').html('');
//         data.result[0].clase.forEach(function (element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var tclase = $('#e_clasevehiculo').append('<option ' + tmpSelected + ' value="' + element.idclase + '">' + element.clase + '</option>');
//         });

//         //e_docpropietario   e_nombre_propietario
//         var propi = $('#e_docpropietario').html('');
//         data.result[0].id_propietario.forEach(function (element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var propi = $('#e_docpropietario').append(
//             '<option ' + tmpSelected + ' value="' + element.propi + '">' + element.propid + '-' + element.propin + ' ' + element.propia1 + ' ' + element.propia2 + '</option>',
//           );
//         });
//         //e_doctenedor   e_nombre_tenedor
//         var tene = $('#e_doctenedor').html('');
//         data.result[0].id_tenedor.forEach(function (element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var tene = $('#e_doctenedor').append(
//             '<option ' + tmpSelected + ' value="' + element.tene + '">' + element.tenedocu + '-' + element.tenename + ' ' + element.teneape1 + ' ' + element.teneape2 + '</option>',
//           );
//         });
//         //e_docconductor    e_nombre_conductor
//         var conductor = $('#e_docconductor').html('');
//         data.result[0].id_conductor.forEach(function (element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var conductor = $('#e_docconductor').append(
//             '<option ' +
//               tmpSelected +
//               ' value="' +
//               element.conductor +
//               '">' +
//               element.conductordocu +
//               '-' +
//               element.conductorname +
//               ' ' +
//               element.conapell1 +
//               '' +
//               element.conapell2 +
//               '</option>',
//           );
//         });
//         //estado de solicitud

//         //trailer, validar si trae o no trailer
//         var trailer = $('#e_trailers').html('<option value="nada" readonly="readonly">Seleccione esta opción para no editar con trailer</option>');
//         data.result[0].id_trailer.forEach(function (element, index) {
//           if (element.selected) {
//             var anterior = $('#trailer_anterior').val(element.idtrailer);
//           }

//           var estado = element.estado_soli;
//           if (estado == 'Disponible') {
//             var color = 'blue';
//           } else if (estado == 'Asignado') {
//             var color = 'red';
//           }
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var trailer = $('#e_trailers').append('<option ' + tmpSelected + ' value="' + element.idtrailer + '" style="color:' + color + ';">' + element.placatrailer + '</option>');
//         });

//         //ARCHIVOS
//         var docu = '';

//         if (data.result[0].name_transito != null && data.result[0].name_transito != '') {
//           docu =
//             '<a  href="http://localhost/mvcLuisMiguel/' +
//             data.result[0].foto_transito +
//             '/' +
//             data.result[0].name_transito +
//             '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
//             '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
//             '</span>' +
//             '</a>';
//           $('#atrasi').html(docu);
//         } else {
//           $('#atrasi').html('<p class="text-danger">No existe archivo</p>');
//         }

//         if (data.result[0].name_soat != null && data.result[0].name_soat != '') {
//           docu =
//             '<a  href="http://localhost/mvcLuisMiguel/' +
//             data.result[0].foto_soat +
//             '/' +
//             data.result[0].name_soat +
//             '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
//             '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
//             '</span>' +
//             '</a>';
//           $('#as').html(docu);
//         } else {
//           $('#as').html('<p class="text-danger">No existe archivo</p>');
//         }

//         if (data.result[0].name_tecno != null && data.result[0].name_tecno != '') {
//           docu =
//             '<a  href="http://localhost/mvcLuisMiguel/' +
//             data.result[0].foto_tecno +
//             '/' +
//             data.result[0].name_tecno +
//             '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
//             '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
//             '</span>' +
//             '</a>';
//           $('#at').html(docu);
//         } else {
//           $('#at').html('<p class="text-danger">No existe archivo</p>');
//         }

//         if (data.result[0].name_frontal != null && data.result[0].name_frontal != '') {
//           docu =
//             '<a  href="http://localhost/mvcLuisMiguel/' +
//             data.result[0].foto_vehiculo +
//             '/' +
//             data.result[0].name_frontal +
//             '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
//             '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
//             '</span>' +
//             '</a>';
//           $('#avf').html(docu);
//         } else {
//           $('#avf').html('<p class="text-danger">No existe archivo</p>');
//         }

//         if (data.result[0].name_derecha != null && data.result[0].name_derecha != '') {
//           docu =
//             '<a  href="http://localhost/mvcLuisMiguel/' +
//             data.result[0].foto_derecha +
//             '/' +
//             data.result[0].name_derecha +
//             '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
//             '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
//             '</span>' +
//             '</a>';
//           $('#avd').html(docu);
//         } else {
//           $('#avd').html('<p class="text-danger">No existe archivo</p>');
//         }

//         if (data.result[0].name_izquierda != null && data.result[0].name_izquierda != '') {
//           docu =
//             '<a  href="http://localhost/mvcLuisMiguel/' +
//             data.result[0].foto_izquierda +
//             '/' +
//             data.result[0].name_izquierda +
//             '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
//             '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
//             '</span>' +
//             '</a>';
//           $('#avi').html(docu);
//         } else {
//           $('#avi').html('<p class="text-danger">No existe archivo</p>');
//         }

//         if (data.result[0].name_atras != null && data.result[0].name_atras != '') {
//           docu =
//             '<a  href="http://localhost/mvcLuisMiguel/' +
//             data.result[0].foto_atras +
//             '/' +
//             data.result[0].name_atras +
//             '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
//             '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
//             '</span>' +
//             '</a>';
//           $('#ava').html(docu);
//         } else {
//           $('#ava').html('<p class="text-danger">No existe archivo</p>');
//         }

//         $('.nexos-messages').html(
//           '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha actualizado el registro con éxito.</div></div>',
//         );
//         $('html, body').animate({scrollTop: 0}, 600);
//       } else {
//         console.log('no hay resultados');
//       }
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log('error datos vehiculo');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
//   //Configuracion
//   var traerconfi = {
//     id: id_vehiculo,
//     action: 'traer_configuracion',
//   };
//   $.ajax({
//     url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
//     type: 'POST',
//     data: traerconfi,
//     dataType: 'json',
//     success: function (data) {},
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log('error configuracion');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

//TRAER DATOS DEL VEHÍCULO ANTERIOR
// function editardatosVehiculo(id_vehiculo) {
//   $('.form-control').val('');
//   $('.hidden-form').val('');

//   $('#e_id_vehiculo').val(id_vehiculo);
//   $('#nexos_messages_popup').html('');
//   $('.nexos_messages_popup').html('');

//   $('#e_placa').attr('disabled', true);
//   $('#e_configuracion').attr('disabled', false);
//   $('#e_color').attr('disabled', false);
//   $('#e_marca').attr('disabled', false);
//   $('#e_linea').attr('disabled', false);
//   $('#e_modelo').attr('disabled', false);
//   $('#e_tipo_combustible').attr('disabled', false);
//   $('#e_carroceria').attr('disabled', false);
//   $('#e_peso_vacio').attr('disabled', false);
//   $('#e_tipo_vehiculo').attr('disabled', false);
//   $('#e_tipo_carroceria').attr('disabled', false);

//   var params = {
//     accion: 'verVehiculo',
//     id_vehiculo: id_vehiculo,
//   };
//   $.post(
//     url,
//     params,
//     function (data) {
//       // console.log(data);
//       if (data.success) {
//         $('#titulo_editar').text('Vehiculo #' + data.content['placa']);
//         $('#e_placa').val(data.content['placa']);
//         $('#e_placa_trailer').val(data.content['placa_trailer']);
//         $('#e_cedula_propietario').val(data.content['documento_propietario'] + ' - ' + data.content['nombre_propietario']);
//         $('#e_id_propietario').val(data.content['id_propietario']);
//         $('#e_id_tipo_documento_propietario').val(data.content['tipo_documento_propietario']);
//         $('#e_digito_verificacion_propietario').val(calcularDigitoVerificacion(data.content['documento_propietario']));
//         $('#e_nombre_propietario').val(data.content['nombre_propietario']);
//         $('#e_cedula_tenedor').val(data.content['documento_tenedor'] + ' - ' + data.content['nombre_tenedor']);
//         $('#e_id_tenedor').val(data.content['id_tenedor']);
//         $('#e_id_tipo_documento_tenedor').val(data.content['tipo_documento_tenedor']);
//         $('#e_digito_verificacion_tenedor').val(calcularDigitoVerificacion(data.content['documento_tenedor']));
//         $('#e_nombre_tenedor').val(data.content['nombre_tenedor']);
//         $('#e_cedula_conductor').val(data.content['documento_conductor'] + ' - ' + data.content['nombre_conductor']);
//         $('#e_id_conductor').val(data.content['id_conductor']);
//         $('#e_id_tipo_documento_conductor').val(data.content['tipo_documento_conductor']);
//         $('#e_digito_verificacion_conductor').val(calcularDigitoVerificacion(data.content['documento_conductor']));
//         $('#e_nombre_conductor').val(data.content['nombre_conductor']);
//         $('#e_tipo_vehiculo').val(data.content['tipo_vehiculo']);
//         // $("#e_tipo_vehiculo").attr("disabled", true);
//         $('#e_id_tipo_vehiculo').val(data.content['id_tipo_vehiculo']);
//         $('#e_tipo_vehiculo_peso').val(data.content['tipo_vehiculo_peso']);
//         $('#e_tipo_carroceria').val(data.content['tipo_carroceria']);
//         if (data.content['tipo_carroceria']) {
//           $('#e_tipo_carroceria').attr('disabled', true);
//         }
//         $('#e_web_satelital').val(data.content['web_satelital']);
//         $('#e_usuario_satelital').val(data.content['usuario_satelital']);
//         $('#e_clave_satelital').val(data.content['clave_satelital']);

//         var msg_error = '';
//         if (!data.content['rndc_propietario']) {
//           msg_error +=
//             '<p>1El <strong>propietario</strong> de este vehículo no se encuentra sincronizado con el <strong>RNDC</strong>, por favor realice el ajuste en el módulo de <strong>proveedores</strong> antes de editar este vehículo.</p>';
//         }
//         if (!data.content['rndc_tenedor']) {
//           msg_error +=
//             '<p>El <strong>tenedor</strong> de este vehículo no se encuentra sincronizado con el <strong>RNDC</strong>, por favor realice el ajuste en el módulo de <strong>proveedores</strong> antes de editar este vehículo.</p>';
//         }
//         if (!data.content['rndc_conductor']) {
//           msg_error +=
//             '<p>El <strong>conductor</strong> de este vehículo no se encuentra sincronizado con el <strong>RNDC</strong>, por favor realice el ajuste en el módulo de <strong>proveedores</strong> antes de editar este vehículo.</p>';
//         }

//         // Se buscan los registros del rndc
//         if (data.content['rndc_result']) {
//           // console.log(data.content["rndc_result"]);

//           // Configuración
//           $('#e_configuracion').val(data.content['rndc_result']['rndc_vehiculo_configuracion']['NOMBRE']);
//           $('#e_id_vehiculo_configuracion').val(data.content['rndc_result']['rndc_vehiculo_configuracion']['id']);
//           $('#e_rndc_vehiculo_configuracion').val(data.content['rndc_result']['rndc_vehiculo_configuracion']['rndc_id']);

//           // Color
//           $('#e_color').val(data.content['rndc_result']['rndc_vehiculo_color']['color']);
//           $('#e_id_vehiculo_color').val(data.content['rndc_result']['rndc_vehiculo_color']['id']);
//           $('#e_rndc_vehiculo_color').val(data.content['rndc_result']['rndc_vehiculo_color']['rndc_id']);

//           // Marca
//           $('#e_marca').val(data.content['rndc_result']['rndc_vehiculo_marca']['marca']);
//           $('#e_id_vehiculo_marca').val(data.content['rndc_result']['rndc_vehiculo_marca']['id']);
//           $('#e_rndc_vehiculo_marca').val(data.content['rndc_result']['rndc_vehiculo_marca']['rndc_id']);

//           // Línea
//           $('#e_linea').val(data.content['rndc_result']['rndc_vehiculo_linea']['descripcion']);
//           $('#e_id_vehiculo_linea').val(data.content['rndc_result']['rndc_vehiculo_linea']['id']);
//           $('#e_rndc_vehiculo_linea').val(data.content['rndc_result']['rndc_vehiculo_linea']['rndc_id']);

//           // Modelo
//           $('#e_modelo').val(data.content['rndc_result']['anofabricacionvehiculocarga']);

//           // tipo de combustible
//           $('#e_tipo_combustible').val(data.content['rndc_result']['codtipocombustible']);

//           // Tipo carrocería
//           $('#e_carroceria').val(data.content['rndc_result']['rndc_vehiculo_carroceria']['descripcion']);
//           $('#e_id_vehiculo_carroceria').val(data.content['rndc_result']['rndc_vehiculo_carroceria']['id']);
//           $('#e_rndc_vehiculo_carroceria').val(data.content['rndc_result']['rndc_vehiculo_carroceria']['rndc_id']);

//           // peso vacío
//           $('#e_peso_vacio').val(data.content['rndc_result']['pesovehiculovacio']);

//           // # SOAT
//           $('#e_numero_poliza').val(data.content['rndc_result']['numsegurosoat']);

//           // # SOAT
//           $('#e_soat_vencimiento').val(data.content['rndc_result']['fechavencimientosoat']);

//           // Aseguradoras
//           $('#e_aseguradora').val(data.content['rndc_result']['rndc_vehiculo_aseguradora']['nombre']);
//           $('#e_id_vehiculo_aseguradora').val(data.content['rndc_result']['rndc_vehiculo_aseguradora']['id']);
//           $('#e_rndc_vehiculo_aseguradora').val(data.content['rndc_result']['rndc_vehiculo_aseguradora']['rndc_id']);

//           // Se inactivan campos que no se deben editar
//           $('#e_configuracion').attr('disabled', true);
//           $('#e_color').attr('disabled', true);
//           $('#e_marca').attr('disabled', true);
//           $('#e_linea').attr('disabled', true);
//           $('#e_modelo').attr('disabled', true);
//           $('#e_tipo_combustible').attr('disabled', true);
//           $('#e_carroceria').attr('disabled', true);
//           $('#e_peso_vacio').attr('disabled', true);
//         } else {
//           if (!data.error) {
//             // Si no se deshabilitan los formularios se genera el listado precargado
//             $('#e_caja_configuracion').html('<input type="text" class="typeahead form-control" placeholder="Configuración" id="e_configuracion">');
//             e_rndcCargarVehiculoConfiguracion();
//             $('#e_caja_color').html('<input type="text" class="typeahead form-control" placeholder="Color" id="e_color">');
//             e_rndcCargarVehiculoColor();
//             $('#e_caja_marca').html('<input type="text" class="typeahead form-control" placeholder="Marca" id="e_marca">');
//             e_rndcCargarVehiculoMarca();
//             $('#e_caja_linea').html('<input type="text" class="typeahead form-control" placeholder="Línea" id="e_linea">');
//             e_rndcLineaVehiculo();
//             $('#e_linea').blur(function () {
//               // console.log("Entro en fuincion de blur del campo linea");
//               if ($('#e_id_vehiculo_marca').val() && $('#e_id_vehiculo_linea').val()) {
//                 // console.log("Se puede verificar");
//                 e_rndc_verificalinea($('#e_id_vehiculo_marca').val(), $('#e_id_vehiculo_linea').val());
//               }
//             });
//             $('#e_caja_carroceria').html('<input type="text" class="typeahead form-control" placeholder="Carrocería" id="e_carroceria">');
//             e_rndcCargarVehiculoCarroceria();
//             $('#e_caja_aseguradora').html('<input type="text" class="typeahead form-control" placeholder="Aseguradora" id="e_aseguradora">');
//             e_rndcCargarVehiculoAseguradora();
//           } else {
//             msg_error += '<p>' + data.error + '</p>';
//           }
//         }

//         if (msg_error) {
//           $('.nexos_messages_popup').html(
//             '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
//               msg_error +
//               '</div></div>',
//           );
//           $('#editar_vehiculos').animate({scrollTop: 0}, 600);
//         }
//       }
//     },
//     'json',
//   );
// }

function verVehiculo(id_vehiculo) {
  $('#vpanel_rndc').html('');
  $('#vpanel_oet').html('');
  $('#e_id_vehiculo').val(id_vehiculo);
  $('#titulo_ver').text('Vehículo # Cargando...');
  $('#ver_vehiculos .form-control').val('Cargando...');
  var params = {
    accion: 'verVehiculo',
    id_vehiculo: id_vehiculo,
  };
  $.post(
    url,
    params,
    function (data) {
      console.log(data);
      if (data.success) {
        $('#titulo_ver').text('Vehículo # ' + data.content['placa']);
        $('#v_placa').html(data.content['placa']);
        $('#v_placa_trailer').val(data.content['placa_trailer']);
        $('#v_cedula_propietario').html(data.content['documento_propietario']);
        $('#v_id_propietario').val(data.content['id_propietario']);
        $('#v_nombre_propietario').html(data.content['nombre_propietario']);
        $('#v_cedula_tenedor').html(data.content['documento_tenedor']);
        $('#v_id_tenedor').val(data.content['id_tenedor']);
        $('#v_nombre_tenedor').html(data.content['nombre_tenedor']);
        $('#v_cedula_conductor').html(data.content['documento_conductor']);
        $('#v_id_conductor').val(data.content['id_conductor']);
        $('#v_nombre_conductor').html(data.content['nombre_conductor']);
        $('#v_clase_vehiculo').html(data.content['clase']);
        $('#v_id_tipo_vehiculo').val(data.content['id_tipo_vehiculo']);
        $('#v_tipo_carroceria').html(data.content['carrov']);
        $('#v_web_satelital').html(data.content['web_satelital']);
        $('#v_usuario_satelital').html(data.content['usuario_satelital']);
        $('#v_clave_satelital').html(data.content['clave_satelital']);

        var combustible = data.content['cod_tipo_combustible'];
        var c = '';
        if (combustible == 1) {
          c = 'Gasolina';
        }
        if (combustible == 2) {
          c = 'GNV';
        }
        if (combustible == 3) {
          c = 'Diesel';
        }
        if (combustible == 4) {
          c = 'Gas Gasol';
        }
        if (combustible == 5) {
          c = 'Electrico';
        }
        if (combustible == 6) {
          c = 'Hidrogeno';
        }
        if (combustible == 7) {
          c = 'Etanol';
        }
        if (combustible == 8) {
          c = 'Biodiesel';
        }
        if (combustible == 9) {
          c = 'GLP';
        }
        if (combustible == 10) {
          c = 'Gaso Elec';
        }
        if (combustible == 11) {
          c = 'Dies Elec';
        }
        if (combustible == 12) {
          c = 'ACPM';
        }
        if (combustible == 13) {
          c = 'Gas';
        }
        $('#v_config').html(data.content['sigla_c'] + '-' + data.content['des_c']);
        $('#v_color').html(data.content['colorv']);
        $('#v_marca').html(data.content['marcav']);
        $('#v_linea').html(data.content['lineav']);
        $('#v_modelo').html(data.content['anio_fabricacion']);
        $('#v_peso').html(data.content['peso']);
        $('#v_combustible').html(c);
        $('#v_tcerroceria').val(data.content['cod_rndc_carroceria']);
        $('#v_soat').html(data.content['num_soat']);
        $('#v_vencesoat').html(data.content['vence_soat']);
        $('#v_asegura').html(data.content['asegv']);
        $('#v_num_motor').html(data.content['num_motor']);
        $('#v_num_chasis').html(data.content['num_chasis']);
        $('#v_vencepoliza').html(data.content['vence_poliza']);
        $('#v_repotenciado').html(data.content['repotenciado']);
        $('#v_vinculacion').html(data.content['tipo_vinculacion']);
        $('#v_poliza').html(data.content['poliza_responsabilidad']);
        $('#v_mantenimiento').html(data.content['fecha_mant_gps']);
        $('#v_capacidad').html(data.content['capacidad_tn']);
        $('#v_bruto').html(data.content['pesobruto_kg']);
        $('#v_tecno').html(data.content['tecnomecanica']);
        $('#v_etecno').html(data.content['tecno_fecha_expedida']);
        $('#v_vitecno').html(data.content['tecno_fecha_vigencia']);
        $('#vempresa_gps').val(data.content['operador_gps']);

        var trailer = data.content['placa_trailer'];
        if (trailer != null || trailer != '') {
          $('#v_trailer').html(data.content['placa_trailer']);
        } else if (trailer == null || trailer == '') {
          $('#v_trailer').html('No aplica');
        }

        //documentos
        var docu = '';
        if (data.content['name_frontal'] != '') {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.content['foto_vehiculo'] +
            '/' +
            data.content['name_frontal'] +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            '</span>' +
            '</a>';
          $('#vf').html(docu);
        } else {
          $('#vf').html('<p class="text-danger">No existe el archivo</p>');
        }

        if (data.content['name_derecha'] != '') {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.content['foto_derecha'] +
            '/' +
            data.content['name_derecha'] +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            '</span>' +
            '</a>';
          $('#vd').html(docu);
        } else {
          $('#vd').html('<p class="text-danger">No existe el archivo</p>');
        }

        if (data.content['name_izquierda'] != '') {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.content['foto_izquierda'] +
            '/' +
            data.content['name_izquierda'] +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            '</span>' +
            '</a>';
          $('#vi').html(docu);
        } else {
          $('#vi').html('<p class="text-danger">No existe el archivo</p>');
        }

        if (data.content['name_atras'] != '') {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.content['foto_atras'] +
            '/' +
            data.content['name_atras'] +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            '</span>' +
            '</a>';
          $('#vt').html(docu);
        } else {
          $('#vt').html('<p class="text-danger">No existe el archivo</p>');
        }

        if (data.content['name_soat'] != '') {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.content['foto_soat'] +
            '/' +
            data.content['name_soat'] +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            '</span>' +
            '</a>';
          $('#vso').html(docu);
        } else {
          $('#vso').html('<p class="text-danger">No existe el archivo</p>');
        }

        if (data.content['name_tecno'] != '') {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.content['foto_tecno'] +
            '/' +
            data.content['name_tecno'] +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            '</span>' +
            '</a>';
          $('#vte').html(docu);
        } else {
          $('#vte').html('<p class="text-danger">No existe el archivo</p>');
        }
        Consulta_Dato_Rndc(data.content['placa']);
        Consulta_Dato_Oet(data.content['placa']);
      } else {
      }
    },
    'json',
  );
}

function Consulta_Dato_Rndc(placa) {
  $('#vpanel_rndc').html('');
  var paquete_transmite = 'placa=' + placa;
  $.post(
    $('#id_url_ajax').val() + 'web_service/Consulta_Vehiculo_Rndc',
    paquete_transmite,
    function (data) {
      var tablas_locales = '';
      if (data.status == 'true') {
        $('#vpanel_rndc').html('<p class="text-center text-success">' + data.resultado + '</p>');
      } else if (data.status == 'false') {
        $('#vpanel_rndc').html('<p class="text-center text-danger">' + data.resultado + '</p>');
      }
    },
    'json',
  );
}

function Consulta_Dato_Oet(placa) {
  $('#vpanel_oet').html('');
  var paquete = 'placa_vehiculo=' + placa;
  //Consulta_Recurso_Avansat
  $.post(
    $('#id_url_ajax').val() + 'integrar_oet/Consulta_Vehiculo',
    paquete,
    function (data) {
      if (data.status == true || data.status == 'true') {
        $('#vpanel_oet').html('<p class="text-center text-success">' + data.resultado + '</p>');
      } else if (data.status == false || data.status == 'false') {
        $('#vpanel_oet').html('<p class="text-center text-danger">' + data.resultado + '</p>');
      }
    },
    'json',
  );
}

function datosinactivarvehiculo(id_vehiculo) {
  $('#i_id_vehiculo').val(id_vehiculo);
  var params = {
    accion: 'verdatosActivarVehiculo',
    id_vehiculo: id_vehiculo,
  };
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        $('#i_num_vehiculo').text('¿Desea inactivar el vehiculo con placas ' + data.content['placa'] + '?');
      } else {
      }
    },
    'json',
  );
}

function datosactivarvehiculo(id_vehiculo) {
  $('#a_id_vehiculo').val(id_vehiculo);
  var params = {
    accion: 'verdatosActivarVehiculo',
    id_vehiculo: id_vehiculo,
  };

  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        $('#a_num_vehiculo').text('¿Desea activar el vehiculo con placas ' + data.content['placa'] + '?');
      } else {
      }
    },
    'json',
  );
}

//EDICION DE DATOS NEUVA
// function editarvehiculonew() {
//   // alert('editese bien ');
//   var data = null;
//   data = new FormData();
//   //ARCHIVOS ACTUALIZAR

//   //foto frontal
//   var archivos = document.getElementById('e_foto_vehiculo').files;
//   for (var i = 0; i < archivos.length; i++) {
//     data.append('e_foto_vehiculo' + i, archivos[i]);
//   }

//   //soat
//   var soat = document.getElementById('f_soat').files;
//   for (var s = 0; s < soat.length; s++) {
//     data.append('f_soat' + s, soat[s]);
//   }
//   //tecnomecanica
//   var tecno = document.getElementById('f_tecno').files;
//   for (var t = 0; t < tecno.length; t++) {
//     data.append('f_tecno' + t, tecno[t]);
//   }

//   //foto derecha
//   var derecha = document.getElementById('f_derecha').files;
//   for (var d = 0; d < derecha.length; d++) {
//     data.append('f_derecha' + d, derecha[d]);
//   }

//   //foto izquierda
//   var izqui = document.getElementById('f_izquierda').files;
//   for (var m = 0; m < izqui.length; m++) {
//     data.append('f_izquierda' + m, izqui[m]);
//   }

//   //foto atras
//   var atras = document.getElementById('f_atras').files;
//   for (var a = 0; a < atras.length; a++) {
//     data.append('f_atras' + a, atras[a]);
//   }

//   //licencia transito
//   var transi = document.getElementById('e_foto_licen').files;
//   for (var k = 0; k < transi.length; k++) {
//     data.append('e_foto_licen' + k, transi[k]);
//   }
//   data.append('accion', 'editarvehiculonew');
//   data.append('idusuario', $('#e_id_usuario').val());
//   data.append('id_vehiculo', $('#id_carro').val());
//   data.append('placa', $('#e_placa').val());
//   //data.append("tipo_vehiculo", $("#e_tipovehiculo").val());
//   data.append('nsoat', $('#e_numero_poliza').val());
//   data.append('fechavence', $('#e_soat_vencimiento').val());
//   data.append('asegura', $('#e_aseguradora').val());
//   data.append('tecno', $('#e_tecnomecanica').val());
//   data.append('expetecno', $('#e_fecha_tecno').val());
//   data.append('vigentecno', $('#e_fecha_vig_tecno').val());
//   data.append('web', $('#e_web_satelital').val());
//   data.append('user', $('#e_usuario_satelital').val());
//   data.append('clave', $('#e_clave_satelital').val());
//   data.append('placat', $('#e_trailers').val());
//   // data.append("licencia", $("#e_num_licencia").val());
//   // data.append("expelicencia", $("#e_fecha_tarjeta_propiedad").val());
//   // data.append("vencelicencia", $("#e_fechavence_tarjeta_propiedad").val());
//   data.append('docpropi', $('#e_docpropietario').val());
//   data.append('doctenedor', $('#e_doctenedor').val());
//   data.append('docconductor', $('#e_docconductor').val());
//   data.append('e_ruta_vehiculo', $('#e_ruta_vehiculo').val());
//   // data.append("e_ruta_trailer", $("#e_ruta_trailer").val());
//   data.append('e_num_motor', $('#e_num_motor').val());
//   data.append('e_num_chasis', $('#e_num_chasis').val());
//   data.append('e_numerito_poliza', $('#e_numerito_poliza').val());
//   data.append('e_fecha_poliza', $('#e_fecha_poliza').val());
//   data.append('e_repotenciado', $('#e_repotenciado').val());
//   data.append('e_tipovinculacion', $('#e_tipovinculacion').val());
//   data.append('e_fecha_mantenimientogps', $('#e_fecha_mantenimientogps').val());
//   data.append('e_capacidad_tn', $('#e_capacidad_tn').val());
//   data.append('e_bruto_kg', $('#e_bruto_kg').val());
//   data.append('e_fecha_matricula', $('#e_fecha_matricula').val());
//   data.append('e_ntransito', $('#e_ntransito').val());

//   data.append('e_configuracion', $('#e_configuracion').val());
//   data.append('e_color', $('#e_color').val());
//   data.append('e_marca', $('#e_marca').val());
//   data.append('e_linea', $('#e_linea').val());
//   data.append('e_modelo', $('#e_modelo').val());
//   data.append('e_tipo_combustible', $('#e_tipo_combustible').val());
//   data.append('e_clasevehiculo', $('#e_clasevehiculo').val());
//   data.append('e_tipo_carroceria', $('#e_tipo_carroceria').val());
//   //data.append("e_carroceria", $("#e_carroceria").val());
//   data.append('e_peso_vacio', $('#e_peso_vacio').val());
//   data.append('ecant_viaje', $('#ecant_viaje').val());

//   //nombres de los archivos
//   data.append('newso', $('#newso').val());
//   data.append('newte', $('#newte').val());
//   data.append('newavf', $('#newavf').val());
//   data.append('newavd', $('#newavd').val());
//   data.append('newavi', $('#newavi').val());
//   data.append('newava', $('#newava').val());
//   data.append('newtransi', $('#newtransi').val());

//   //editar datos del trailer
//   //tres eventos 1 sin trailer,2 con trailer update new ,
//   var trailer = $('#e_trailers').val();
//   if (trailer == 'nada') {
//     data.append('e_trailers', $('#e_trailers').val());
//     // data.append("trailer_anterior", $("#trailer_anterior").val());
//   } else if (trailer.length > 0) {
//     data.append('e_trailers', $('#e_trailers').val());
//     data.append('trailer_anterior', $('#trailer_anterior').val());
//   }

//   var url = $('#id_url_ajax').val() + 'libs/vehiculos_ajax.php';

//   $.ajax({
//     url: url,
//     type: 'POST',
//     data: data,
//     cache: false,
//     processData: false, // Don't process the files
//     contentType: false, // Set content type to false as jQuery will tell the server its a query string request
//     dataType: 'json',
//     success: function (data, textStatus, jqXHR) {
//       if (!data.error) {
//         icon = 'check';
//         color = 'success';
//         pal = 'Proceso terminado';
//         mensaje = 'Datos Vehículo Actualizados Exitosamente NEXOSAPP';
//         placa = $('#e_placa').val();
//         Actualiza_Dato_Ministerio(placa);
//       } else {
//         icon = 'close';
//         color = 'danger';
//         pal = 'Error';
//         mensaje = 'Datos Vehículo No Actualizado  NEXOSAPP';
//       }
//       $('.e_nexos_messages_popup').append(
//         '<div role="alert" class="alert alert-' +
//           color +
//           ' alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-' +
//           icon +
//           '"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>' +
//           pal +
//           '!</strong>' +
//           mensaje +
//           '</div></div>',
//       );
//       $('#editar_vehiculos').animate({scrollTop: 0}, 900);
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log('NO ACTUALIZO VEHICULO');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });

//   // var params = {

//   // accion: 'editarvehiculonew',
//   // idusuario:    $("#e_id_usuario").val(),
//   // id_vehiculo:   $("#id_carro").val(),
//   // placa:         $("#e_placa").val(),
//   //  tipo_vehiculo:    $("#e_tipovehiculo").val(),
//   //  nsoat:            $("#e_numero_poliza").val(),
//   //  fechavence:       $("#e_soat_vencimiento").val(),
//   //  asegura:          $("#e_aseguradora").val(),
//   //  tecno:            $("#e_tecnomecanica").val(),
//   //  expetecno:        $("#e_fecha_tecno").val(),
//   //  vigentecno:       $("#e_fecha_vig_tecno").val(),
//   //  web:              $("#e_web_satelital").val(),
//   //  user:             $("#e_usuario_satelital").val(),
//   //  clave:            $("#e_clave_satelital").val(),
//   //  placat:            $("#e_placa_trailer").val(),
//   //  licencia:         $("#e_num_licencia").val(),
//   //  expelicencia:     $("#e_fecha_tarjeta_propiedad").val(),
//   //  vencelicencia:    $("#e_fechavence_tarjeta_propiedad").val(),
//   // //datos de propietario, tenedor, conductor
//   //  docpropi:         $("#e_docpropietario").val(),
//   //  doctenedor:       $("#e_doctenedor").val(),
//   //  docconductor:     $("#e_docconductor").val(),
//   // };

//   // // $("html, body").animate({ scrollTop: 0 }, 600);
//   // // 		setTimeout(function() { location.reload(false);  }, 800);

//   // $.post(url, params, function (data) {
//   // 	console.log(data);
//   // 	if (!data.error) {
//   // 		$("#editar_vehiculos").css("display","none");
//   // 		$(".nexos-messages").html('<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha actualizado el registro con éxito.</div></div>');
//   // 		$("html, body").animate({ scrollTop: 0 }, 600);
//   // 		setTimeout(function() { location.reload(false);  }, 800);
//   // 	}
//   // 	else {
//   // 		var msg_error = data.error.replace(/\n/g , "</p><p>");
//   // 		$(".nexos_messages_popup").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
//   // 		$("#editar_vehiculos").animate({ scrollTop: 0 }, 600);
//   // 	}
//   // }, 'json');
// }

// function Actualiza_Dato_Ministerio(placa) {
//   proceso = 12;
//   var paquete_transmite = 'placa=' + placa + '&proceso=' + proceso + '&dato=2' + '&filtro=""' + '&tipopro=3';
//   $.post(
//     $('#id_url_ajax').val() + 'web_service/vehiculos',
//     paquete_transmite,
//     function (data) {
//       if (data.status == 'true') {
//         tablas_locales = 'Se Actualizo Datos Exitosamente RNDC';
//         $('.e_nexos_messages_popup').append(
//           '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
//             tablas_locales +
//             ' - ' +
//             data.resultado +
//             '</div></div>',
//         );
//         $('#editar_vehiculos').animate({scrollTop: 0}, 600);
//         Actualiza_Dato_Oet(placa);
//       } else if (data.status == 'false') {
//         tablas_locales = 'No se actualizo el Vehículo en RNDC';
//         $('.e_nexos_messages_popup').append(
//           '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
//             tablas_locales +
//             ' - ' +
//             data.resultado +
//             '</div></div>',
//         );
//         $('#editar_vehiculos').animate({scrollTop: 0}, 600);
//       }
//     },
//     'json',
//   );
//   Actualiza_Dato_Oet(placa);
// }

// function Actualiza_Dato_Oet(placa) {
//   clase = 2;
//   recurso = 6;
//   //valor = '&dato_recurso=' + $("#placa").val();
//   valor = '&dato_recurso=' + placa;
//   var paquete = 'clase_recurso=' + clase + '&recurso=' + recurso + valor;
//   $.post(
//     $('#id_url_ajax').val() + 'integrar_oet/Consulta_Recurso_Avansat',
//     paquete,
//     function (data) {
//       if (data.status == true || data.status == 'true') {
//         var tablas_locales = 'Se Registro Vehículo Exitosamente GRUPO OET';
//         $('.e_nexos_messages_popup').append(
//           '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
//             tablas_locales +
//             '</div></div>',
//         );
//         $('#editar_vehiculos').animate({scrollTop: 0}, 600);
//       } else if (data.status == false || data.status == 'false') {
//         var tablas_locales = 'No se creo el Vehículo en GRUPO OET';
//         $('.e_nexos_messages_popup').append(
//           '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong> ' +
//             tablas_locales +
//             ' - ' +
//             data.error +
//             '</div></div>',
//         );
//         $('#editar_vehiculos').animate({scrollTop: 0}, 600);
//       }
//     },
//     'json',
//   );
// }

//EDICION DE DATOS ANTEIOR
// function editarVehiculo() {
//   var params = {
//     accion: 'editarVehiculo',

//     placa: $('#e_placa').val(),
//     id_vehiculo: $('#e_id_vehiculo').val(),
//     id_propietario: $('#e_id_propietario').val(),
//     id_tenedor: $('#e_id_tenedor').val(),
//     id_conductor: $('#e_id_conductor').val(),
//     tipo_vehiculo: $('#e_id_tipo_vehiculo').val(),
//     tipo_carroceria: $('#e_tipo_carroceria').val(),
//     web_satelital: $('#e_web_satelital').val(),
//     usuario_satelital: $('#e_usuario_satelital').val(),
//     clave_satelital: $('#e_clave_satelital').val(),
//     placa_trailer: $('#e_placa_trailer').val(),

//     // DATOS PARA ELM RNDC
//     rndc_id_tipo_documento_propietario: $('#e_id_tipo_documento_propietario').val(),
//     digito_verificacion_propietario: $('#e_digito_verificacion_propietario').val(),
//     rndc_id_tipo_documento_tenedor: $('#e_id_tipo_documento_tenedor').val(),
//     digito_verificacion_tenedor: $('#e_digito_verificacion_tenedor').val(),
//     rndc_id_tipo_documento_conductor: $('#e_id_tipo_documento_conductor').val(),
//     digito_verificacion_conductor: $('#e_digito_verificacion_conductor').val(),
//     rndc_vehiculo_configuracion: $('#e_rndc_vehiculo_configuracion').val(),
//     rndc_vehiculo_color: $('#e_rndc_vehiculo_color').val(),
//     rndc_vehiculo_marca: $('#e_rndc_vehiculo_marca').val(),
//     rndc_vehiculo_linea: $('#e_rndc_vehiculo_linea').val(),
//     rndc_modelo: $('#e_modelo').val(),
//     rncd_tipo_combustible: $('#e_tipo_combustible').val(),
//     rndc_vehiculo_carroceria: $('#e_rndc_vehiculo_carroceria').val(),
//     rndc_peso_vacio: $('#e_peso_vacio').val(),
//     rndc_capacidad_carga: $('#e_tipo_vehiculo_peso').val(),
//     rndc_numero_poliza: $('#e_numero_poliza').val(),
//     rndc_soat_vencimiento: $('#e_soat_vencimiento').val(),
//     rndc_vehiculo_aseguradora: $('#e_rndc_vehiculo_aseguradora').val(),
//   };
//   arrayRndcCedulaPropietario = $('#e_cedula_propietario').val().split(' - ');
//   params['rndc_cedula_propietario'] = arrayRndcCedulaPropietario[0];
//   arrayRndcCedulaTenedor = $('#e_cedula_tenedor').val().split(' - ');
//   params['rndc_cedula_tenedor'] = arrayRndcCedulaTenedor[0];
//   arrayRndcCedulaConductor = $('#e_cedula_conductor').val().split(' - ');
//   params['rndc_cedula_conductor'] = arrayRndcCedulaConductor[0];

//   $.post(
//     url,
//     params,
//     function (data) {
//       console.log(data);
//       if (!data.error) {
//         $('#editar_vehiculos').css('display', 'none');
//         $('.nexos-messages').html(
//           '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha actualizado el registro con éxito.</div></div>',
//         );
//         $('html, body').animate({scrollTop: 0}, 600);
//         setTimeout(function () {
//           location.reload(false);
//         }, 800);
//       } else {
//         var msg_error = data.error.replace(/\n/g, '</p><p>');
//         $('.nexos_messages_popup').html(
//           '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
//             msg_error +
//             '</div></div>',
//         );
//         $('#editar_vehiculos').animate({scrollTop: 0}, 600);
//       }
//     },
//     'json',
//   );
// }

function inactivarVehiculo() {
  var params = {
    accion: 'inactivarVehiculo',
    id_vehiculo: $('#i_id_vehiculo').val(),
  };

  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        $('#btn_inactivar_vehiculo').attr('data-dismiss', 'modal');
        location.reload();
      } else {
        $('#btn_inactivar_vehiculo').removeAttr('data-dismiss');
      }
    },
    'json',
  );
}

function activarVehiculo() {
  var params = {
    accion: 'activarVehiculo',
    id_vehiculo: $('#a_id_vehiculo').val(),
  };
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        $('#btn_activar_vehiculo').attr('data-dismiss', 'modal');
        location.reload();
      } else {
        $('#btn_activar_vehiculo').removeAttr('data-dismiss');
      }
    },
    'json',
  );
}

function getTipoDocumento(id, form_destino, digito_verificacion) {
  // Se busca la información del tercero
  var params = {
    accion: 'verProveedor',
    id_proveedor: id,
  };
  // console.log( params );
  $.ajax({
    type: 'POST',
    cache: false,
    url: $('#id_url_ajax').val() + 'libs/proveedores_ajax.php',
    data: params,
    dataType: 'json',
    beforeSend: function (jqXHR, settings) {
      $('.nexos-messages').html(
        '<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' +
          $('#id_url_ajax').val() +
          'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>',
      );
    },
    success: function (data) {
      // console.log(data);
      $('.nexos-messages').html('');
      // console.log(data.content.tipo_documento);
      $('#' + form_destino).val(data.content.tipo_documento);
      $('#' + digito_verificacion).val(data.content.digito_verificacion);
    },
  });
}

/******** FUNCIONES PARA CAMPOS RNDC DE CREACION DE VEHÍCULO ********/
function rndcCargarVehiculoConfiguracion() {
  // console.log("Entro en funcion rndcCargarVehiculoConfiguracion");
  $('#id_vehiculo_configuracion').val('');
  $('#rndc_vehiculo_configuracion').val('');
  var params = {
    accion: 'rndc_cargarconfiguracion',
  };

  configuracion = [];
  $.ajaxSetup({async: false});
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        for (let x = 0; x < data.content.length; x++) {
          configuracion.push(data.content[x]['nombre']);
        }
        $('#caja_configuracion .typeahead').typeahead(
          {
            minLength: 1,
          },
          {
            name: 'states',
            source: substringMatcher(configuracion),
          },
        );
        $.ajaxSetup({async: false});
        $('#caja_configuracion').bind('typeahead:selected', function (obj, datum, name) {
          var params = {
            accion: 'rndc_obtenerdatosconfiguracion',
            nombre: datum.split(' - ')[0],
          };
          $.post(
            url,
            params,
            function (data) {
              // console.log(data);
              if (data.success) {
                $('#id_vehiculo_configuracion').val(data.content[0]['id']);
                $('#rndc_vehiculo_configuracion').val(data.content[0]['rndc_id']);
                $('#color').focus();
              } else {
                $('#id_vehiculo_configuracion').val('');
                $('#rndc_vehiculo_configuracion').val('');
              }
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

function rndcCargarVehiculoColor() {
  // console.log("Entro en funcion rndcCargarVehiculoColor");
  $('#id_vehiculo_color').val('');
  $('#rndc_vehiculo_color').val('');
  var params = {
    accion: 'rndc_cargarcolor',
  };

  color = [];
  $.ajaxSetup({async: false});
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        for (let x = 0; x < data.content.length; x++) {
          color.push(data.content[x]['color']);
        }
        $('#caja_color .typeahead').typeahead(
          {
            minLength: 1,
          },
          {
            name: 'states',
            source: substringMatcher(color),
          },
        );
        $.ajaxSetup({async: false});
        $('#caja_color').bind('typeahead:selected', function (obj, datum, name) {
          var params = {
            accion: 'rndc_obtenerdatoscolor',
            color: datum,
          };
          $.post(
            url,
            params,
            function (data) {
              // console.log(data);
              if (data.success) {
                $('#id_vehiculo_color').val(data.content[0]['id']);
                $('#rndc_vehiculo_color').val(data.content[0]['rndc_id']);
                $('#marca').focus();
              } else {
                $('#id_vehiculo_color').val('');
                $('#rndc_vehiculo_color').val('');
              }
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

function rndcCargarVehiculoMarca() {
  // console.log("Entro en funcion rndcCargarVehiculoMarca");
  var params = {
    accion: 'rndc_cargarmarca',
  };

  marca = [];
  $.ajaxSetup({async: false});
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        for (let x = 0; x < data.content.length; x++) {
          marca.push(data.content[x]['marca']);
        }
        $('#caja_marca .typeahead').typeahead(
          {
            minLength: 1,
          },
          {
            name: 'states',
            source: substringMatcher(marca),
          },
        );
        $.ajaxSetup({async: false});
        $('#caja_marca').bind('typeahead:selected', function (obj, datum, name) {
          var params = {
            accion: 'rndc_obtenerdatosmarca',
            marca: datum,
          };
          $.post(
            url,
            params,
            function (data) {
              // console.log(data);
              if (data.success) {
                //$("#id_vehiculo_marca").val(data.content[0]["id"]);
                //$("#rndc_vehiculo_marca").val(data.content[0]["rndc_id"]);

                $('#id_vehiculo_marca').val(data.content[0]['rndc_id']);
                $('#rndc_vehiculo_marca').val(data.content[0]['id']);
                $('#linea').focus();
              } else {
                $('#id_vehiculo_marca').val('');
                $('#rndc_vehiculo_marca').val('');
              }
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

function rndcLineaVehiculo(id_marca_vehiculo) {
  // console.log("Entro en funcion rndcLineaVehiculo");
  $('#id_vehiculo_linea').val('');
  $('#rndc_vehiculo_linea').val('');
  var params = {
    accion: 'rndc_cargarlinea',
    id_marca: id_marca_vehiculo,
  };
  // console.log(params);
  linea = [];
  $.ajaxSetup({async: false});
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        for (let x = 0; x < data.content.length; x++) {
          linea.push(data.content[x]['descripcion']);
        }
        $('#caja_linea .typeahead').typeahead(
          {
            minLength: 1,
          },
          {
            name: 'states',
            source: substringMatcher(linea),
          },
        );
        $.ajaxSetup({async: false});
        $('#caja_linea').bind('typeahead:selected', function (obj, datum, name) {
          var params = {
            accion: 'rndc_obtenerdatoslinea',
            descripcion: datum.split(' - ')[0],
          };
          $.post(
            url,
            params,
            function (data) {
              // console.log(data);
              if (data.success) {
                $('#id_vehiculo_linea').val(data.content[0]['id']);
                $('#rndc_vehiculo_linea').val(data.content[0]['rndc_id']);
              } else {
                $('#id_vehiculo_linea').val('');
                $('#rndc_vehiculo_linea').val('');
              }
              $('#modelo').focus();
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

function rndc_verificalinea(id_vehiculo_marca, id_vehiculo_linea) {
  // console.log("Entro en funcion rndc_verificalinea");
  $('#nexos_messages_popup').html('');
  var params = {
    accion: 'rndc_verificalinea',
    id_vehiculo_marca: id_vehiculo_marca,
    id_vehiculo_linea: id_vehiculo_linea,
  };

  $.ajaxSetup({async: false});
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (!data.success) {
        $('#linea').val('');
        $('#id_vehiculo_linea').val('');
        $('#rndc_vehiculo_linea').val('');
        $('#nexos_messages_popup').html(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong><p>La marca y línea del vehículo seleccionado coinciden con los registrados en el RNDC, por favor seleccione una combinación existente.</p></div></div>',
        );
        $('#crea_vehiculos').animate({scrollTop: 0}, 600);
      }
      $('#modelo').focus();
    },
    'json',
  );
  $.ajaxSetup({async: true});
}

function rndcCargarVehiculoCarroceria() {
  // console.log("Entro en funcion rndcCargarVehiculoCarroceria");
  $('#id_vehiculo_carroceria').val('');
  $('#rndc_vehiculo_carroceria').val('');
  var params = {
    accion: 'rndc_cargarcarroceria',
  };

  carroceria = [];
  $.ajaxSetup({async: false});
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        for (let x = 0; x < data.content.length; x++) {
          carroceria.push(data.content[x]['descripcion']);
        }
        $('#caja_carroceria .typeahead').typeahead(
          {
            minLength: 1,
          },
          {
            name: 'states',
            source: substringMatcher(carroceria),
          },
        );
        $.ajaxSetup({async: false});
        $('#caja_carroceria').bind('typeahead:selected', function (obj, datum, name) {
          var params = {
            accion: 'rndc_obtenerdatoscarroceria',
            descripcion: datum.split(' - ')[0],
          };
          $.post(
            url,
            params,
            function (data) {
              // console.log(data);
              if (data.success) {
                $('#id_vehiculo_carroceria').val(data.content[0]['id']);
                $('#rndc_vehiculo_carroceria').val(data.content[0]['rndc_id']);
              } else {
                $('#id_vehiculo_carroceria').val('');
                $('#rndc_vehiculo_carroceria').val('');
              }
              $('#peso_vacio').focus();
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
    function (data) {
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
        $('#caja_aseguradora').bind('typeahead:selected', function (obj, datum, name) {
          var params = {
            accion: 'rndc_obtenerdatosaseguradora',
            nombre: datum.split(' - ')[0],
          };
          $.post(
            url,
            params,
            function (data) {
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
/******** FIN - FUNCIONES PARA CAMPOS RNDC DE CREACION DE VEHÍCULO ********/

/******** FUNCIONES PARA CAMPOS RNDC DE EDICION DE VEHÍCULO ********/
function e_rndcCargarVehiculoConfiguracion() {
  // console.log("Entro en funcion rndcCargarVehiculoConfiguracion");
  $('#e_id_vehiculo_configuracion').val('');
  $('#e_rndc_vehiculo_configuracion').val('');
  var params = {
    accion: 'rndc_cargarconfiguracion',
  };

  configuracion = [];
  $.ajaxSetup({async: false});
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        for (let x = 0; x < data.content.length; x++) {
          configuracion.push(data.content[x]['nombre']);
        }
        $('#e_caja_configuracion .typeahead').typeahead(
          {
            minLength: 1,
          },
          {
            name: 'states',
            source: substringMatcher(configuracion),
          },
        );
        $.ajaxSetup({async: false});
        $('#e_caja_configuracion').bind('typeahead:selected', function (obj, datum, name) {
          var params = {
            accion: 'rndc_obtenerdatosconfiguracion',
            nombre: datum.split(' - ')[0],
          };
          $.post(
            url,
            params,
            function (data) {
              // console.log(data);
              if (data.success) {
                $('#e_id_vehiculo_configuracion').val(data.content[0]['id']);
                $('#e_rndc_vehiculo_configuracion').val(data.content[0]['rndc_id']);
                $('#e_color').focus();
              } else {
                $('#e_id_vehiculo_configuracion').val('');
                $('#e_rndc_vehiculo_configuracion').val('');
              }
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

function e_rndcCargarVehiculoColor() {
  // console.log("Entro en funcion rndcCargarVehiculoColor");
  $('#e_id_vehiculo_color').val('');
  $('#e_rndc_vehiculo_color').val('');
  var params = {
    accion: 'rndc_cargarcolor',
  };

  color = [];
  $.ajaxSetup({async: false});
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        for (let x = 0; x < data.content.length; x++) {
          color.push(data.content[x]['color']);
        }
        $('#e_caja_color .typeahead').typeahead(
          {
            minLength: 1,
          },
          {
            name: 'states',
            source: substringMatcher(color),
          },
        );
        $.ajaxSetup({async: false});
        $('#e_caja_color').bind('typeahead:selected', function (obj, datum, name) {
          var params = {
            accion: 'rndc_obtenerdatoscolor',
            color: datum,
          };
          $.post(
            url,
            params,
            function (data) {
              // console.log(data);
              if (data.success) {
                $('#e_id_vehiculo_color').val(data.content[0]['id']);
                $('#e_rndc_vehiculo_color').val(data.content[0]['rndc_id']);
                $('#e_marca').focus();
              } else {
                $('#e_id_vehiculo_color').val('');
                $('#e_rndc_vehiculo_color').val('');
              }
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

function e_rndcCargarVehiculoMarca() {
  // console.log("Entro en funcion rndcCargarVehiculoMarca");
  var params = {
    accion: 'rndc_cargarmarca',
  };

  marca = [];
  $.ajaxSetup({async: false});
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        for (let x = 0; x < data.content.length; x++) {
          marca.push(data.content[x]['marca']);
        }
        $('#e_caja_marca .typeahead').typeahead(
          {
            minLength: 1,
          },
          {
            name: 'states',
            source: substringMatcher(marca),
          },
        );
        $.ajaxSetup({async: false});
        $('#e_caja_marca').bind('typeahead:selected', function (obj, datum, name) {
          var params = {
            accion: 'rndc_obtenerdatosmarca',
            marca: datum,
          };
          $.post(
            url,
            params,
            function (data) {
              // console.log(data);
              if (data.success) {
                $('#e_id_vehiculo_marca').val(data.content[0]['id']);
                $('#e_rndc_vehiculo_marca').val(data.content[0]['rndc_id']);
                $('#e_linea').focus();
              } else {
                $('#e_id_vehiculo_marca').val('');
                $('#e_rndc_vehiculo_marca').val('');
              }
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

function e_rndcLineaVehiculo(id_marca_vehiculo) {
  // console.log("Entro en funcion rndcLineaVehiculo");
  $('#e_id_vehiculo_linea').val('');
  $('#e_rndc_vehiculo_linea').val('');
  var params = {
    accion: 'rndc_cargarlinea',
    id_marca: id_marca_vehiculo,
  };
  // console.log(params);
  linea = [];
  $.ajaxSetup({async: false});
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        for (let x = 0; x < data.content.length; x++) {
          linea.push(data.content[x]['descripcion']);
        }
        $('#e_caja_linea .typeahead').typeahead(
          {
            minLength: 1,
          },
          {
            name: 'states',
            source: substringMatcher(linea),
          },
        );
        $.ajaxSetup({async: false});
        $('#e_caja_linea').bind('typeahead:selected', function (obj, datum, name) {
          var params = {
            accion: 'rndc_obtenerdatoslinea',
            descripcion: datum.split(' - ')[0],
          };
          $.post(
            url,
            params,
            function (data) {
              // console.log(data);
              if (data.success) {
                $('#e_id_vehiculo_linea').val(data.content[0]['id']);
                $('#e_rndc_vehiculo_linea').val(data.content[0]['rndc_id']);
              } else {
                $('#e_id_vehiculo_linea').val('');
                $('#e_rndc_vehiculo_linea').val('');
              }
              $('#e_modelo').focus();
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

function e_rndc_verificalinea(id_vehiculo_marca, id_vehiculo_linea) {
  // console.log("Entro en funcion rndc_verificalinea");
  $('#e_nexos_messages_popup').html('');

  var params = {
    accion: 'rndc_verificalinea',
    id_vehiculo_marca: id_vehiculo_marca,
    id_vehiculo_linea: id_vehiculo_linea,
  };

  $.ajaxSetup({async: false});
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (!data.success) {
        $('#e_linea').val('');
        $('#e_id_vehiculo_linea').val('');
        $('#e_rndc_vehiculo_linea').val('');
        $('#e_nexos_messages_popup').html(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong><p>La marca y línea del vehículo seleccionado coinciden con los registrados en el RNDC, por favor seleccione una combinación existente.</p></div></div>',
        );
        $('#e_crea_vehiculos').animate({scrollTop: 0}, 600);
      }
      $('#e_modelo').focus();
    },
    'json',
  );
  $.ajaxSetup({async: true});
}

function e_rndcCargarVehiculoCarroceria() {
  // console.log("Entro en funcion rndcCargarVehiculoCarroceria");
  $('#e_id_vehiculo_carroceria').val('');
  $('#e_rndc_vehiculo_carroceria').val('');
  var params = {
    accion: 'rndc_cargarcarroceria',
  };

  carroceria = [];
  $.ajaxSetup({async: false});
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        for (let x = 0; x < data.content.length; x++) {
          carroceria.push(data.content[x]['descripcion']);
        }
        $('#e_caja_carroceria .typeahead').typeahead(
          {
            minLength: 1,
          },
          {
            name: 'states',
            source: substringMatcher(carroceria),
          },
        );
        $.ajaxSetup({async: false});
        $('#e_caja_carroceria').bind('typeahead:selected', function (obj, datum, name) {
          var params = {
            accion: 'rndc_obtenerdatoscarroceria',
            descripcion: datum.split(' - ')[0],
          };
          $.post(
            url,
            params,
            function (data) {
              // console.log(data);
              if (data.success) {
                $('#e_id_vehiculo_carroceria').val(data.content[0]['id']);
                $('#e_rndc_vehiculo_carroceria').val(data.content[0]['rndc_id']);
              } else {
                $('#e_id_vehiculo_carroceria').val('');
                $('#e_rndc_vehiculo_carroceria').val('');
              }
              $('#e_peso_vacio').focus();
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

function e_rndcCargarVehiculoAseguradora() {
  // console.log("Entro en funcion rndcCargarVehiculoAseguradora");
  $('#e_id_vehiculo_aseguradora').val('');
  $('#e_rndc_vehiculo_aseguradora').val('');
  var params = {
    accion: 'rndc_cargaraseguradora',
  };

  aseguradora = [];
  $.ajaxSetup({async: false});
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        for (let x = 0; x < data.content.length; x++) {
          aseguradora.push(data.content[x]['nombre']);
        }
        $('#e_caja_aseguradora .typeahead').typeahead(
          {
            minLength: 1,
          },
          {
            name: 'states',
            source: substringMatcher(aseguradora),
          },
        );
        $.ajaxSetup({async: false});
        $('#e_caja_aseguradora').bind('typeahead:selected', function (obj, datum, name) {
          var params = {
            accion: 'rndc_obtenerdatosaseguradora',
            nombre: datum.split(' - ')[0],
          };
          $.post(
            url,
            params,
            function (data) {
              // console.log(data);
              if (data.success) {
                $('#e_id_vehiculo_aseguradora').val(data.content[0]['id']);
                $('#e_rndc_vehiculo_aseguradora').val(data.content[0]['rndc_id']);
              } else {
                $('#e_id_vehiculo_aseguradora').val('');
                $('#e_rndc_vehiculo_aseguradora').val('');
              }
              $('#e_placa_trailer').focus();
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

$('#e_peso_vacio').change(function () {
  var peso = $('#e_peso_vacio').val();
  var capacidad = $('#e_capacidad_tn').val();
  var suma = parseFloat(peso) + parseFloat(capacidad);
  res = suma.toFixed(2);
  $('#e_bruto_kg').val(suma);
});

$('#e_capacidad_tn').change(function () {
  var peso = $('#e_peso_vacio').val();
  var capacidad = $('#e_capacidad_tn').val();
  var suma = parseFloat(peso) + parseFloat(capacidad);
  res = suma.toFixed(2);
  $('#e_bruto_kg').val(suma);
});

$('#e_marca').change(function () {
  marca = $('#e_marca').val();
  var cargalinea = {
    marcalin: marca,
    action: 'consulta_lineas',
  };
  $.ajax({
    url: $('#id_url_ajax').val() + 'libs/hojas_de_vida_ajax.php',
    type: 'POST',
    data: cargalinea,
    dataType: 'json',
    success: function (data) {
      if (data) {
        $('#e_linea').html('<option value="">Seleccione</option>');
        data.result.forEach(function (element, index) {
          $('#e_linea').append('<option value="' + element.id + '">' + element.descripcion + '</option>');
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('error configuracion');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
});

// Funcion para limpiar los campos del modal de vehiculos
function limpiar_modal_vehiculo() {
  $('#placa').val('');
  $('#configuracion').val(null).trigger('change');
  $('#trailers').val(null).trigger('change');
  $('#id_vehiculo_configuracion').val('');
  $('#rndc_vehiculo_configuracion').val('');
  $('#rndc_sigla').val('');
  $('#color').val('');
  $('#id_vehiculo_color').val('');
  $('#rndc_vehiculo_color').val('');
  $('#marca').val(null).trigger('change');
  $('#id_vehiculo_marca').val('');
  $('#rndc_vehiculo_marca').val('');
  $('#linea').val(null).trigger('change');
  $('#id_vehiculo_linea').val('');
  $('#rndc_vehiculo_linea').val('');
  $('#tipo_combustible').val('');
  $('#modelo').val('');
  $('#f_matricula').val('');
  $('#clase_v').val(null).trigger('change');
  $('#tipo_carroceria').val(null).trigger('change');
  $('#peso_vacio').val('');
  $('#capacidad_tn').val('');
  $('#peso_bruto').val('');
  $('#tecnomecanica').val('');
  $('#fecha_tecno').val('');
  $('#fecha_vig_tecno').val('');
  $('#num_motor').val('');
  $('#num_chasis').val('');
  $('#repotencia').val('');
  $('#repotenciado').val('');
  $('#tipovinculacion').val('');
  $('#lice_transito').val('');
  $('#cant_viaje').val('');
  // Seccion de Seguros
  $('#numero_polizaRC').val('');
  $('#fecha_poliza').val('');
  $('#numero_poliza').val('');
  $('#soat_vencimiento').val('');
  $('#aseguradora').val('');
  $('#caja_aseguradora').val('');
  $('#id_vehiculo_aseguradora').val('');
  $('#rndc_vehiculo_aseguradora').val('');
  //Seccion Operador Gps
  $('#empresa_satelital').val('');
  $('#web_satelital').val('');
  $('#usuario_satelital').val('');
  $('#clave_satelital').val('');
  $('#fecha_mantenimientogps').val('');

  $('#foto_transi').val(null);
  $('#name_transi').val('');
  $('#foto_soat').val(null);
  $('#name_soat').val('');
  $('#foto_tecno').val(null);
  $('#name_tecno').val('');
  $('#foto_vehiculo').val(null);
  $('#name_frontal').val('');
  $('#foto_vehiculod').val(null);
  $('#name_derecha').val('');
  $('#foto_vehiculoi').val(null);
  $('#name_izquierda').val('');
  $('#foto_vehiculoa').val(null);
  $('#name_atras').val('');
  // Seccion de Documentos
  // var FotoTransito = $('#foto_transi'); // Selecciona el elemento input tipo file
  // var newFotoTransito = $('<input type="file">').attr('id', FotoTransito.attr('id')); // Crea un nuevo elemento de entrada de tipo archivo
  // FotoTransito.replaceWith(newFotoTransito); // Reemplaza el elemento existente con el nuevo
  // FotoTransito = newFotoTransito; // Actualiza el objeto de selección para futuras manipulaciones
  // $("#name_transi").val('');

  // var FotoSoat = $('#foto_soat');
  // var newFotoSoat = $('<input type="file">').attr('id', FotoSoat.attr('id'));
  // FotoSoat.replaceWith(newFotoSoat);
  // FotoSoat = newFotoSoat;
  // $("#name_soat").val('');

  // var FotoTecnoMecanica = $('#foto_tecno');
  // var newFotoTecnoMecanica = $('<input type="file">').attr('id', FotoTecnoMecanica.attr('id'));
  // FotoTecnoMecanica.replaceWith(newFotoTecnoMecanica);
  // FotoTecnoMecanica = newFotoTecnoMecanica;
  // $("#name_tecno").val('');

  // var FotoVehiculoFrontal = $('#foto_vehiculo');
  // var newFotoVehiculoFrontal = $('<input type="file">').attr('id', FotoVehiculoFrontal.attr('id'));
  // FotoVehiculoFrontal.replaceWith(newFotoVehiculoFrontal);
  // FotoVehiculoFrontal = newFotoVehiculoFrontal;
  // $("#name_frontal").val('');

  // var FotoVehiculoDerecha = $('#foto_vehiculod');
  // var newFotoVehiculoDerecha = $('<input type="file">').attr('id', FotoVehiculoDerecha.attr('id'));
  // FotoVehiculoDerecha.replaceWith(newFotoVehiculoDerecha);
  // FotoVehiculoDerecha = newFotoVehiculoDerecha;
  // $("#name_derecha").val('');

  // var FotoVehiculoIzquierda = $('#foto_vehiculoi');
  // var newFotoVehiculoIzquierda = $('<input type="file">').attr('id', FotoVehiculoIzquierda.attr('id'));
  // FotoVehiculoIzquierda.replaceWith(newFotoVehiculoIzquierda);
  // FotoVehiculoIzquierda = newFotoVehiculoIzquierda;
  // $("#name_izquierda").val('');

  // var FotoVehiculoAtras = $('#foto_vehiculoa');
  // var newFotoVehiculoAtras = $('<input type="file">').attr('id', FotoVehiculoAtras.attr('id'));
  // FotoVehiculoAtras.replaceWith(newFotoVehiculoAtras);
  // FotoVehiculoAtras = newFotoVehiculoAtras;
  // $("#name_atras").val('');

  // Seccion Datos Específicos
  $('#id_propietario').val(null).trigger('change');
  $('#id_tenedor').val(null).trigger('change');
  $('#id_conductor').val(null).trigger('change');
}

/******** FIN - FUNCIONES PARA CAMPOS RNDC DE EDICION DE VEHÍCULO ********/
