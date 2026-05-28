sessionStorage.clear();
// Variables globales accesibles desde cualquier parte
window.intermedio = "";
window.contador_global1 = 0;

window.contador_remitentes = 0;
window.contador_destinatarios = 0;

// Variables sin inicializar pero accesibles globalmente
window.ID = null;
window.VEHICULO = null;
window.REMITENTE = null;
window.DESTINATARIO = null;
window.BLOQUE_MERCANCIA = null;
window.SERVICIO = null;
window.VENTANA = null;

// Arrays globales
window.ORIGEN_ARRAY = [];
window.DESTINO_ARRAY = [];
//Identificar la ventana que se abre cuando se da click
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID de la ventana a la variable global

  // console.log("Script inicializado para la ventana:", typeof window.VENTANA);
  let path = window.location.pathname; // Obtiene el path completo
  let partes = path.split('/'); // Divide el path en partes separadas por "/"
  intermedio = partes[2]; // Obtiene el tercer segmento (índice 2)

  $('.select2').select2({
    placeholder: "Seleccione",
    allowClear: true, // Permite limpiar la selección
  });

  if (window.VENTANA == 4) {
    // VENTANA PARA TRABAJAR EN LA CREACION DE LAS NUEVAS SOLICITUDES DE SERVICIO
    let table = new DataTable('#myTable', {
      language: { // Corrección aquí (antes era 'lenguage')
        "processing": "Procesando...",
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "emptyTable": "Ningún dato disponible en esta tabla",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "search": "Buscar:",
        "loadingRecords": "Cargando...",
        "paginate": {
          "first": "Primero",
          "last": "Último",
          "next": "Siguiente",
          "previous": "Anterior"
        }
      } // Se eliminó la coma extra antes del `)`
    });

    $('#escenarios').html(''); // Limpia el select antes de agregar nuevas opciones
    $('#escenarios').append(`<option value="" selected> Seleccione</option>`);

    $.ajax({
      url: $('#base_url').val() + 'serviciocliente/Traer_Escenarios',
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        if (data) {
          let options = ''; // Almacena las opciones en una variable para mejor rendimiento
          data.forEach(element => {
            options += `
        <option value = "${element.id}"
      data-nombre="${element.escenario}"
      data-vehiculo="${element.vehiculo}"
      data-remitente="${element.remitente}"
      data-destinatario="${element.destinatario}"
      data-bloque_mercancia="${element.bloque_mercancia}"
      data-servicio="${element.servicio}" >
        ${element.escenario + '-' + element.detalle_texto}
              </option>
        `;
          });
          $('#escenarios').append(options); // Inserta todas las opciones en una sola operación
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
      },
    });

    /* Cargar datos de la solictud de servicio */
    $('#agencia').html(''); // Limpia el select antes de agregar nuevas opciones
    // Agrega la opción "Seleccione" como la primera opción y la marca como seleccionada
    $('#agencia').append('<option value="" selected>Seleccione</option>');

    $.ajax({
      url: $('#base_url').val() + 'serviciocliente/Traer_Agencias',
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        if (data) {
          // Itera sobre los datos recibidos y agrega cada opción al select
          data.forEach(function (element, index) {
            $('#agencia').append('<option value="' + element.id + '">' + element.nombre + '</option>');
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });

    // Evento change para capturar los valores de data-*
    $('#escenarios').on('change', function () {
      let selectedOption = $(this).find('option:selected'); // Opción seleccionada
      let escenarioActual = selectedOption.val();

      // Si NO hay escenario guardado en sessionStorage → lo guardamos
      if (!sessionStorage.getItem("escenarioSeleccionado")) {
        sessionStorage.setItem("escenarioSeleccionado", escenarioActual);
      }
      // Si YA hay uno y el nuevo es diferente → mostrar alerta
      else if (sessionStorage.getItem("escenarioSeleccionado") !== escenarioActual) {
        Swal.fire({
          title: "¿Cambiar escenario?",
          text: "El contenido actual se borrará para aplicar el nuevo escenario.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, cambiar",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
            sessionStorage.setItem("escenarioSeleccionado", escenarioActual);
            sessionStorage.clear();
            location.reload(); // Recarga la página
          } else {
            // Volver a la opción previa
            $('#escenarios').val(sessionStorage.getItem("escenarioSeleccionado"));
          }
        });
        return; // Salir para que no siga con la lógica hasta confirmar
      }

      // ======================
      // TU LÓGICA DE ESCENARIOS
      // ======================

      // Asignar valores a las variables globales
      ID = selectedOption.val();
      VEHICULO = selectedOption.data('vehiculo');
      REMITENTE = selectedOption.data('remitente');
      DESTINATARIO = selectedOption.data('destinatario');
      BLOQUE_MERCANCIA = selectedOption.data('bloque_mercancia');
      SERVICIO = selectedOption.data('servicio');

      /* Validaciones para armar los escenarios de solicitud de servicio */
      if (ID === '1' && VEHICULO === 1 && REMITENTE === 1 && DESTINATARIO === 1 && BLOQUE_MERCANCIA === 1 && SERVICIO === 'Expreso') { //Escenario donde todo es uno a uno
        Limpiar_formulario_cambio_escenario();
        document.getElementById("agregar_fila").style.display = 'none';
        agregar();
        document.querySelector(".cantvehiculo").value = 1;
        document.querySelector(".cantvehiculo").disabled = true;
        // document.querySelector(".ts").disabled = true;
        // document.querySelector(".ts").value = 'Expreso';
        document.getElementById("maximo_entregab").value = 1;
        document.getElementById("maximo_entregab").disabled = true;
      } else if (ID === '2' && VEHICULO === 1 && REMITENTE === 1 && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === 1 && SERVICIO === 'Expreso') {
        Limpiar_formulario_cambio_escenario();
        document.getElementById("agregar_fila").style.display = 'none';
        agregar();
        document.querySelector(".cantvehiculo").value = 1;
        document.querySelector(".cantvehiculo").disabled = true;
        document.querySelector(".ts").disabled = true;
        document.querySelector(".ts").value = 'Expreso';
        document.getElementById("maximo_entregab").value = 1;
        document.getElementById("maximo_entregab").disabled = true;
      } else if (ID === '3' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === 1 && BLOQUE_MERCANCIA === 1 && SERVICIO === 'Expreso') {
        Limpiar_formulario_cambio_escenario();
        document.getElementById("agregar_fila").style.display = 'none';
        agregar();
        document.querySelector(".cantvehiculo").value = 1;
        document.querySelector(".cantvehiculo").disabled = true;
        document.querySelector(".ts").disabled = true;
        document.querySelector(".ts").value = 'Expreso';
      } else if (ID === '4' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === 1 && SERVICIO === 'Expreso') {
        Limpiar_formulario_cambio_escenario();
        document.getElementById("agregar_fila").style.display = 'none';
        agregar();
        document.querySelector(".cantvehiculo").value = 1;
        document.querySelector(".cantvehiculo").disabled = true;
        document.querySelector(".ts").disabled = true;
        document.querySelector(".ts").value = 'Expreso';
      } else if (ID === '5' && VEHICULO === 1 && REMITENTE === 1 && DESTINATARIO === 1 && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso') { /* Escenario donde todas las mercancias son distintas */
        Limpiar_formulario_cambio_escenario();
        document.getElementById("agregar_fila").style.display = '';
        agregar();
        document.querySelector(".cantvehiculo").value = 1;
        document.querySelector(".cantvehiculo").disabled = true;
        document.querySelector(".ts").disabled = true;
        document.querySelector(".ts").value = 'Expreso';
        // Agregar un carro por cada bloque de marcancias
        document.getElementById("maximo_entregab").value = 1;
        document.getElementById("maximo_entregab").disabled = true;
      } else if (ID === '6' && VEHICULO === 1 && REMITENTE === 1 && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso') {
        Limpiar_formulario_cambio_escenario();
        document.getElementById("agregar_fila").style.display = '';
        agregar();
        document.querySelector(".cantvehiculo").value = 1;
        document.querySelector(".cantvehiculo").disabled = true;
        document.querySelector(".ts").disabled = true;
        document.querySelector(".ts").value = 'Expreso';
        // Agregar un carro por cada bloque de marcancias
        document.getElementById("maximo_entregab").value = 1;
        document.getElementById("maximo_entregab").disabled = true;
      } else if (ID === '7' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === 1 && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso') {
        Limpiar_formulario_cambio_escenario();
        document.getElementById("agregar_fila").style.display = '';
        agregar();
        document.querySelector(".cantvehiculo").value = 1;
        document.querySelector(".cantvehiculo").disabled = true;
        document.querySelector(".ts").disabled = true;
        document.querySelector(".ts").value = 'Expreso';
        document.getElementById("maximo_entregab").disabled = false;
        /* Validar si el campo de numero de remitente es +1 */
        // document.getElementById("maximo_entregab").disabled = !document.getElementById("maximo_entregab").disabled;
      } else if (ID === '8' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso') {
        Limpiar_formulario_cambio_escenario();
        document.getElementById("agregar_fila").style.display = '';
        agregar();
        document.querySelector(".cantvehiculo").value = 1;
        document.querySelector(".cantvehiculo").disabled = true;
        document.querySelector(".ts").disabled = true;
        document.querySelector(".ts").value = 'Expreso';
        /* Validar si el campo de numero de remitente es +1 */
        // document.getElementById("maximo_entregab").disabled = !document.getElementById("maximo_entregab").disabled;
      } else if (ID === '9' && VEHICULO === '+1' && REMITENTE === 1 && DESTINATARIO === 1 && BLOQUE_MERCANCIA === 1 && SERVICIO === 'Consolidado') {
        Limpiar_formulario_cambio_escenario();
        agregar();
        //OCultarel boton de agregar bloque de mercancia
        document.getElementById("agregar_fila").style.display = 'none';
        // Agregar un carro por cada bloque de marcancias
        document.getElementById("maximo_entregab").value = 1;
        document.getElementById("maximo_entregab").disabled = true;
      } else if (ID === '10' && VEHICULO === '+1' && REMITENTE === 1 && DESTINATARIO === 1 && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Consolidado') {
        Limpiar_formulario_cambio_escenario();
        document.getElementById("agregar_fila").style.display = '';
        agregar();
        // Agregar un carro por cada bloque de marcancias
        document.getElementById("maximo_entregab").value = 1;
        document.getElementById("maximo_entregab").disabled = true;
      } else if (ID === '11' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Consolidado') {
        Limpiar_formulario_cambio_escenario();
        document.getElementById("agregar_fila").style.display = '';
        agregar();
        // Agregar un carro por cada bloque de marcancias
        document.querySelector(".cantvehiculo").value = 1;
        document.querySelector(".cantvehiculo").disabled = true;
        /* Validar si el campo de numero de remitente es +1 */
        document.getElementById("maximo_entregab").disabled = !document.getElementById("maximo_entregab").disabled;
      } else {
        Limpiar_formulario_cambio_escenario();
        document.getElementById("maximo_entregab").disabled = !document.getElementById("maximo_entregab").disabled;
      }
    });

    //agregar filas a la tabla de mercancias
    // $('#agregar_fila').click(function () {
    //   agregar();
    // });

    // $('#btn_agregar_cotizacion').click(function () {
    //   //validaciones
    //   var msg_error = '';

    //   if (!$('#nit_empresa').val()) {
    //     msg_error += '<p>Debe seleccionar un <strong>cliente</strong> para realizar la solicitud de servicio.</p>';
    //     $('#documento').css('background-color', 'rgb(254,242,181)');
    //     $('#nombre_clientes').css('background-color', 'rgb(254,242,181)');
    //     $('#direccion_cliente').css('background-color', 'rgb(254,242,181)');
    //     $('#telefono_cliente').css('background-color', 'rgb(254,242,181)');
    //     $('#correo').css('background-color', 'rgb(254,242,181)');
    //     $('#tipo_documento').css('background-color', 'rgb(254,242,181)');
    //   } else {
    //     $('#documento').css('background-color', 'rgb(255,255,255)');
    //     $('#nombre_clientes').css('background-color', 'rgb(255,255,255)');
    //     $('#direccion_cliente').css('background-color', 'rgb(255,255,255)');
    //     $('#telefono_cliente').css('background-color', 'rgb(255,255,255)');
    //     $('#correo').css('background-color', 'rgb(255,255,255)');
    //     $('#tipo_documento').css('background-color', 'rgb(255,255,255)');
    //   }

    //   $('.tmerca').each(function (index) {
    //     var mercancia = $(this).val();
    //     if (!mercancia) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Mercancía - datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.tmerca').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.tmerca').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.natumer').each(function (index) {
    //     var naturaleza = $(this).val();
    //   });

    //   $('.valor_merca').each(function (index) {
    //     var valor = $(this).val();
    //     if (!valor) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Valor declarado - datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.valor_merca').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.valor_merca').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.ts').each(function (index) {
    //     var tiposervicio = $(this).val();
    //     if (!tiposervicio) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Tipo servicio - datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.ts').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.ts').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.operamer').each(function (index) {
    //     var operacion = $(this).val();
    //     if (!operacion) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Tipo de Operación - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
    //       $('.operamer').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.operamer').blur().css('background-color', 'white');
    //       for (var i = 0; i <= contador_global1; i++) {
    //         if (
    //           typeof document.getElementsByClassName('operamer')[i] !== 'undefined' &&
    //           typeof document.getElementsByClassName('operamer')[i] !== undefined &&
    //           document.getElementsByClassName('empaquemer')[i] !== undefined &&
    //           document.getElementsByClassName('rndcproducto')[i] !== undefined
    //         ) {
    //           let operacion = document.getElementsByClassName('operamer')[i].id;
    //           let empaque = document.getElementsByClassName('empaquemer')[i].id;
    //           let producto = document.getElementsByClassName('rndcproducto')[i].id;
    //           if (typeof operacion != 'undefined' && typeof empaque != 'undefined' && producto != 'undefined') {
    //             if ($('#' + operacion + '').val() === 'V') {
    //               //contenedor vacio
    //               if ($('#' + empaque + '').val() == 8 || $('#' + empaque + '').val() == 9 || $('#' + empaque + '').val() == 10) {
    //               } else {
    //                 msg_error += '<p>El campo <strong>Tipo Empaque - datos de mercancía </strong> debe ser Contenedor por el Tipo Operación: Contenedor Vacío.</p>';
    //               }
    //               if ($('#' + producto + '').val() != '009990') {
    //                 msg_error += '<p>El campo <strong>Mercancía - datos de mercancía </strong> debe ser Contenedor Vacío por el Tipo Operación: Contenedor Vacío.</p>';
    //               }
    //             }

    //             if ($('#' + operacion + '').val() === 'C') {
    //               //contenedor cargado
    //               if ($('#' + empaque + '').val() !== '8' && $('#' + empaque + '').val() !== '9' && $('#' + empaque + '').val() !== '10') {
    //                 //alert('A si debe salir');
    //                 msg_error += '<p>El campo <strong>Tipo Empaque - datos de mercancía </strong> debe ser Contenedor, Tipo Operación: Contenedor Cargado.</p>';
    //               } else {
    //                 //msg_error+= "<p>El campo <strong>Tipo Empaque - datos de mercancía </strong> debe ser Contenedor, Tipo Operación: Contenedor Cargado.</p>";
    //               }
    //               if ($('#' + producto + '').val() == '009990' || $('#' + producto + '').val() == '009880') {
    //                 msg_error += '<p>El campo <strong>Mercancía - datos de mercancía </strong> no debe ser Contenedor vacío ó Miscelaneos contenidos,Tipo Operación: Contenedor Cargado.</p>';
    //               }
    //             }

    //             if ($('#' + operacion + '').val() === 'P') {
    //               //paqueteo
    //               if ($('#' + empaque + '').val() != 11) {
    //                 msg_error += '<p>El campo <strong>Tipo Empaque - datos de mercancía </strong> debe ser (Paquetes) Tipo Operación: Paqueteo.</p>';
    //               }
    //               if ($('#' + producto + '').val() != '009880') {
    //                 msg_error += '<p>El campo <strong>Mercancía - datos de mercancía </strong> debe ser (009880)MISCELANEOS CONTENIDOS EN PAQUETES ( PAQUETEO ) Tipo Operación: Paqueteo.</p>';
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   });

    //   $('.empaquemer').each(function (index) {
    //     var empaque = $(this).val();
    //     if (!empaque) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Tipo de Empaque - datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.empaquemer').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.empaquemer').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.ttransportemer').each(function (index) {
    //     var tipo_transporte = $(this).val();
    //     if (!tipo_transporte) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Tipo de Transporte - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
    //       $('.ttransportemer').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.ttransportemer').blur().css('background-color', 'white');
    //       //validacion
    //       for (var i = 0; i <= contador_global1; i++) {
    //         if (
    //           typeof document.getElementsByClassName('ttransportemer')[i] !== 'undefined' &&
    //           typeof document.getElementsByClassName('ttransportemer')[i] !== undefined &&
    //           document.getElementsByClassName('originario')[i] !== undefined &&
    //           document.getElementsByClassName('destinar')[i] !== undefined
    //         ) {
    //           let tipo_operacion = document.getElementsByClassName('ttransportemer')[i].id;
    //           let origen = document.getElementsByClassName('originario')[i].id;
    //           let destino = document.getElementsByClassName('destinar')[i].id;
    //           if (typeof tipo_operacion != 'undefined' && typeof origen != 'undefined' && typeof destino != 'undefined') {
    //             if ($('#' + tipo_operacion + '').val() == 'Urbano') {
    //               if ($('#' + origen + '').val() != $('#' + destino + '').val()) {
    //                 msg_error += '<p>El Origen y Destino deben ser igual ya que el tipo de Transporte seleccionado es: Urbano</p>';
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   });

    //   $('.originario').each(function (index) {
    //     var origen = $(this).val();
    //     if (!origen) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Origen - datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.originario').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.originario').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.destinar').each(function (index) {
    //     var destino = $(this).val();
    //     if (!destino) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Destino - datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.destinar').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.destinar').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.tipovehiculo').each(function (index) {
    //     var tvehiculo = $(this).val();
    //     if (!tvehiculo) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Tipo Vehículo - datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.tipovehiculo').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.tipovehiculo').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.pesobruto').each(function (index) {
    //     var tvehiculo = $(this).val();
    //     if (!tvehiculo) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Peso Bruto (kg)- datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
    //       $('.pesobruto').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.pesobruto').blur().css('background-color', 'white');
    //       for (var i = 0; i <= contador_global1; i++) {
    //         if (
    //           typeof document.getElementsByClassName('pesobruto')[i] !== 'undefined' &&
    //           typeof document.getElementsByClassName('pesobruto')[i] !== undefined &&
    //           document.getElementsByClassName('pnetomer')[i] !== undefined &&
    //           document.getElementsByClassName('pnetomer')[i] !== undefined
    //         ) {
    //           let pbrutoc = document.getElementsByClassName('pesobruto')[i].id;
    //           let pnetoc = document.getElementsByClassName('pnetomer')[i].id;
    //           let valor1 = $('#' + pbrutoc + '').val().toString().replace(/,/g, '');
    //           let valor2 = $('#' + pnetoc + '').val().toString().replace(/,/g, '');
    //           if (parseFloat(valor1) < parseFloat(valor2)) {
    //             msg_error += '<p>El <strong>Peso bruto </strong> debe ser Mayor al <strong> Peso Neto </strong></p>';
    //           }
    //         }
    //       }
    //     }
    //   });

    //   $('.pnetomer').each(function (index) {
    //     var neto = $(this).val();
    //     if (!neto) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Peso Neto (Kg)- datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.pnetomer').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.pnetomer').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.pesobrutoton').each(function (index) {
    //     var brutotn = $(this).val();
    //     if (!brutotn) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Peso Neto (Tn)- datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.pesobrutoton').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.pesobrutoton').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.cantidadmer').each(function (index) {
    //     var cantidad = $(this).val();
    //     if (!cantidad) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Cantidad(unidades)- datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.cantidadmer').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.cantidadmer').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.altomer').each(function (index) {
    //     var alto = $(this).val();
    //     if (!alto) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Alto - datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.altomer').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.altomer').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.largomer').each(function (index) {
    //     var largo = $(this).val();
    //     if (!$('.largomer').val()) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Largo - datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.largomer').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.largomer').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.volumenmer').each(function (index) {
    //     var volumen = $(this).val();
    //     if (!volumen) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Volumen - datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.volumenmer').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.volumenmer').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.fletemer').each(function (index) {
    //     var flete = $(this).val();
    //     if (flete <= 0) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Costo flete - datos de mercancía mayor a ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.fletemer').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.fletemer').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.tarifamer').each(function (index) {
    //     var tarifa = $(this).val();
    //     if (!tarifa) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Costo flete - datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.tarifamer').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.tarifamer').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.rentamer').each(function (index) {
    //     var rentabilidad = $(this).val();
    //     if (!rentabilidad) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Rentabilidad - datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.rentamer').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.rentamer').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.utilmer').each(function (index) {
    //     var utilidad = $(this).val();
    //     if (!utilidad) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Utilidad - datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.utilmer').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.utilmer').blur().css('background-color', 'white');
    //     }
    //   });

    //   $('.cantvehi').each(function (index) {
    //     var cuanto_vehiculo = $(this).val();
    //     if (!cuanto_vehiculo) {
    //       msg_error += '<p>Debe diligenciar el campo <strong>Cantidad Vehículos - datos de mercancía ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //       $('.cantvehi').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.cantvehi').blur().css('background-color', 'white');
    //     }
    //   });
    //   // FIN VALIDACIONES COTIZACIONES

    //   //VALIDACIONES DE LA SOLICITUD DE SERVICIO
    //   // var msg_error = '';
    //   var peso = $('#pesoneto').val();
    //   var cont_opcion = $('#cnt_opcion').val();
    //   var cont_dias = $('#cnt_dias').val();
    //   var cont_municipio = $('#cnt_municipio').val();
    //   var cont_direccion = $('#cnt_direccion').val();
    //   var cont_tipo = $('#cnt_tipocon').val();
    //   var cont_num = $('#cnt_num').val();
    //   var cont_comodato = $('#cnt_fcomodato').val();
    //   var cont_peso = $('#cnt_peso').val();
    //   var cant_solicitada = $('#cant_vehiculo').val();
    //   var cant_disponible = $('#cant_disponible').val();
    //   var fhoy = moment().format('Y-M-D');
    //   var tipo_transporte = $('#tip_transport').val();

    //   if (!$('#agencia').val()) {
    //     msg_error += '<p>Por favor seleccione la <strong>Agencia</strong> para poder registrar solicitud de servicio</p>';
    //     $('#agencia').focus().css('background-color', 'rgb(254,242,181)');
    //   } else {
    //     $('#agencia').blur().css('background-color', 'white');
    //   }

    //   if (!$('#group').val()) {
    //     msg_error += '<p>Por favor ingrese el <strong>Grupo</strong> para poder registrar solicitud de servicio</p>';
    //     $('#group').focus().css('background-color', 'rgb(254,242,181)');
    //   } else {
    //     $('#group').blur().css('background-color', 'white');
    //   }

    //   if (!$('#houremail').val()) {
    //     msg_error += '<p>Por favor ingrese el <strong>Hora envío email </strong> para poder registrar solicitud de servicio</p>';
    //     $('#hora_ss').focus().css('background-color', 'rgb(254,242,181)');
    //   } else {
    //     $('#hora_ss').focus().css('background-color', 'white');
    //   }

    //   if (cont_opcion == '1') {
    //     if (cont_dias == '') {
    //       msg_error += '<p>Por favor ingrese los <strong>Días del contenedor</strong> para registrar la solicitud de servicio</p>';
    //     }

    //     if (cont_municipio == '') {
    //       msg_error += '<p>Por favor ingrese el <strong>Municipio</strong> para registrar la solicitud de servicio</p>';
    //     }

    //     if (cont_direccion == '') {
    //       msg_error += '<p>Por favor ingrese la <strong>Dirección</strong> para registrar la solicitud de servicio</p>';
    //     }

    //     if (cont_tipo == '') {
    //       msg_error += '<p>Por favor ingrese el <strong>Tipo de contenedor</strong> para registrar la solicitud de servicio</p>';
    //     }

    //     if (cont_num == '') {
    //       msg_error += '<p>Por favor ingrese el <strong>Número de contenedor</strong> para registrar la solicitud de servicio</p>';
    //     }

    //     if (cont_peso == '') {
    //       msg_error += '<p>Por favor ingrese el <strong>Peso vacío de contenedor</strong> para registrar la solicitud de servicio</p>';
    //     }
    //   }

    //   $('.re_cliente').each(function (index) {
    //     var remitente = $(this).val();
    //     if (!remitente) {
    //       msg_error += '<p>Por favor seleccione el <strong>Remitente</strong> para poder registrar solicitudde servicio </p>';
    //     } else {
    //       $('.re_dire').each(function (index) {
    //         var direccion_remitente = $(this).val();
    //         if (!direccion_remitente) {
    //           msg_error += '<p>Por favor ingrese la <strong>Dirección Remitente</strong> para poder registrar la solicitud de servicio</p>';
    //         } else {
    //           // if(direccion_remitente.length == 0 || direccion_remitente.length > 50){
    //           if (direccion_remitente.trim().length > 50) {
    //             msg_error += '<p>La <strong>Dirección Remitente</strong> debe tener maximo 50 caracteres para poder registrar la solicitud de servicio</p>';
    //           }
    //           if (direccion_remitente.trim().length < 3) {
    //             msg_error += '<p>La <strong>Dirección Remitente</strong> debe tener mínimo 3 caracteres para poder registrar la solicitud de servicio</p>';
    //           }
    //         }
    //       });

    //       $('.rlname').each(function (index) {
    //         var rename = $(this).val();
    //         if (rename < 3) {
    //           msg_error += '<p>El <strong>Nombre Remitente</strong> debe tener mínimo 3 caracteres para poder registrar solicitud de servicio</p>';
    //         }
    //         if (rename > 50) {
    //           msg_error += '<p>El <strong>Nombre Remitente</strong> debe tener máximo 50 caracteres para poder registrar solicitud de servicio</p>';
    //         }
    //       });

    //       $('.re_ciudad').each(function (index) {
    //         var ciudad_remitente = $(this).val();
    //         if (!ciudad_remitente) {
    //           msg_error += '<p>Por favor seleccione la <strong>Ciudad Remitente</strong> para poder registrar solicitud de servicio</p>';
    //         }
    //       });

    //       $('.re_telefono').each(function (index) {
    //         var telefono_remitente = $(this).val();
    //         if (!telefono_remitente) {
    //           msg_error += '<p>Por favor ingresa el <strong>Teléfono Remitente</strong> para poder registrar solicitud de servicio</p>';
    //         } else {
    //           if (telefono_remitente.length < 10) {
    //             msg_error += '<p>El <strong>Teléfono Remitente</strong> debe tener 10 dígitos para poder registrar solicitud de servicio</p>';
    //           } else if (telefono_remitente.length > 10) {
    //             msg_error += '<p>El <strong>Teléfono Remitente</strong> debe tener 10 dígitos para poder registrar solicitud de servicio</p>';
    //           } else if (telefono_remitente == '0000000000') {
    //             msg_error += '<p>El <strong>Teléfono Remitente</strong> no es válido</p>';
    //           }
    //         }
    //       });

    //       $('.re_peso').each(function (index) {
    //         var peso_remitente = $(this).val();
    //         if (!peso_remitente) {
    //           msg_error += '<p>Por favor ingresa el <strong>Peso Remitente</strong> para poder registrar solicitud de servicio</p>';
    //         }
    //       });

    //       $('.re_fecha').each(function (index) {
    //         var fecha_remitente = $(this).val();
    //         if (!fecha_remitente) {
    //           msg_error += '<p>Por favor ingresa la <strong>Fecha Remitente</strong> para poder registrar solicitud de servicio</p>';
    //         } else {
    //           var fhoym = moment();
    //           var tf = fhoym.diff(fecha_remitente, 'days');
    //           if (tf > 0) {
    //             msg_error += '<p>Por favor ingrese la <strong>Fecha Remitente</strong> mayor a la fecha actual para registrar la solicitud de servicio</p>';
    //           }
    //         }
    //       });

    //       $('.re_hora').each(function (index) {
    //         var hora_remitente = $(this).val();
    //         if (!hora_remitente) {
    //           msg_error += '<p>Por favor ingresa la <strong>Hora Remitente</strong> para poder registrar solicitud de servicio</p>';
    //         }
    //       });

    //       $('.re_lugar').each(function (index) {
    //         var lugar_remitente = $(this).val();
    //         if (!lugar_remitente) {
    //           msg_error += '<p>Por favor ingresa el <strong>Lugar Remitente</strong> para poder registrar solicitud de servicio</p>';
    //         }
    //       });

    //       //validacines para rndc
    //       $('.est_upgrade').each(function (index) {
    //         var estado_retransmision = $(this).val();
    //         if (estado_retransmision == 0) {
    //           msg_error += '<p>Por favor transmitir el <strong>Remitente</strong> para poder registrar solicitud de servicio</p>';
    //         }
    //       });

    //       $('.re_dire').each(function (index) {
    //         var largo_dire = $(this).val();
    //         if (largo_dire.trim().length < 3) {
    //           msg_error += '<p>La <strong>Dirección Remitente</strong> debe tener mas de 3 caracteres</p>';
    //         }
    //         if (largo_dire.trim().length > 50) {
    //           msg_error += '<p>La <strong>Dirección Remitente</strong> debe tener menos de 50 caracteres</p>';
    //         }
    //       });
    //     }
    //   });
    //   //FIN DE LAS VALIDACIONES PARA LOS REMITENTES

    //   var destinatario = $('.de_cliente').val();
    //   if (!destinatario || destinatario == undefined) {
    //     msg_error += '<p>Por favor selecciona el <strong>Destinatario</strong> para poder registrar solicitud de servicio</p>';
    //   } else {
    //     $('.de_dire').each(function (index) {
    //       var direccion_destinatario = $(this).val();
    //       if (!direccion_destinatario) {
    //         msg_error += '<p>Por favor ingresa la <strong>Dirección Destinatario</strong> para poder registrar solicitud de servicio</p>';
    //       } else {
    //         // if(direccion_destinatario.length == 0 || direccion_destinatario.length > 50){
    //         if (direccion_destinatario.trim().length > 50) {
    //           msg_error += '<p>La <strong>Dirección Destinatario</strong> debe tener maximo 50 caracteres para poder registrar la solicitud de servicio</p>';
    //         }
    //         if (direccion_destinatario.trim().length < 3) {
    //           msg_error += '<p>La <strong>Dirección Destinatario</strong> debe tener mínimo 3 caracteres para poder registrar la solicitud de servicio</p>';
    //         }
    //       }
    //     });

    //     $('.tel_dire').each(function (index) {
    //       var telefono_destinatario = $(this).val();
    //       if (!telefono_destinatario) {
    //         msg_error += '<p>Por favor ingresa la <strong>Teléfono Remitente</strong> para poder registrar solicitud de servicio</p>';
    //       } else {
    //         if (telefono_destinatario.length > 10) {
    //           msg_error += '<p>El <strong>Teléfono Remitente</strong> debe tener 10 dígitos para poder registrar solicitud de servicio</p>';
    //         } else if (telefono_destinatario.length < 10) {
    //           msg_error += '<p>El <strong>Teléfono Remitente</strong> debe tener 10 dígitos para poder registrar solicitud de servicio</p>';
    //         } else if (telefono_destinatario == '0000000000') {
    //           msg_error += '<p>El <strong>Teléfono Remitente</strong> no es válido</p>';
    //         }
    //       }
    //     });

    //     $('.de_ciudad').each(function (index) {
    //       var ciudad_destinatario = $(this).val();
    //       if (!ciudad_destinatario) {
    //         msg_error += '<p>Por favor ingresa la <strong>Ciudad Destinatario</strong> para poder registrar la solicitud de servicio</p>';
    //       }
    //     });

    //     $('.de_fecha').each(function (index) {
    //       var fecha_destinatario = $(this).val();
    //       if (!fecha_destinatario) {
    //         msg_error += '<p>Por favor ingresa la <strong>Fecha Destinatario</strong> para poder registrar solicitud de servicio</p>';
    //       } else {
    //         var fhoym = moment();
    //         var tf = fhoym.diff(fecha_remitente, 'days');
    //         var fecha_remitente = $('.re_fecha').val();
    //         if (fecha_destinatario < fecha_remitente) {
    //           msg_error += '<p>La <strong>Fecha Destinatario</strong> debe ser mayor a la fecha cargue para poder registrar solicitud de servicio</p>';
    //         }
    //       }
    //     });

    //     $('.de_hora').each(function (index) {
    //       var hora_destinatario = $(this).val();
    //       if (!hora_destinatario) {
    //         msg_error += '<p>Por favor ingresa la <strong>Hora Destinatario</strong> para poder registrar solicitud de servicio</p>';
    //       }
    //     });

    //     $('.de_peso').each(function (index) {
    //       var peso_destinatario = $(this).val();
    //       if (!peso_destinatario) {
    //         msg_error += '<p>Por favor ingresa el <strong>Peso Destinatario</strong> para poder registrar solicitud de servicio</p>';
    //       }
    //     });

    //     $('.de_lugar').each(function (index) {
    //       var lugar_destinatario = $(this).val();
    //       if (!lugar_destinatario) {
    //         msg_error += '<p>Por favor ingresa el <strong>Lugar Destinatario</strong> para poder registrar solicitud de servicio</p>';
    //       }
    //     });

    //     //validaciones destinatario punto control rndc
    //     $('.dlestado').each(function (index) {
    //       var estado_retransmisiond = $(this).val();
    //       if (estado_retransmisiond == 0) {
    //         msg_error += '<p>Por favor transmitir el <strong>Destinatario</strong> para poder registrar solicitud de servicio</p>';
    //       }
    //     });

    //     $('.dlname').each(function (index) {
    //       var largo_nombred = $(this).val();
    //       if (largo_nombred < 3) {
    //         msg_error += '<p>El <strong>Nombre Destinatario</strong> debe tener mínimo 3 caracteres para poder registrar solicitud de servicio</p>';
    //       }
    //       if (largo_nombred > 50) {
    //         msg_error += '<p>El <strong>Nombre Destinatario</strong> debe tener máximo 50 caracteres para poder registrar solicitud de servicio</p>';
    //       }
    //     });

    //     $('.de_dire').each(function (index) {
    //       var direccion_destinatario = $(this).val();
    //       // if(direccion_destinatario.length == 0 || direccion_destinatario.length > 50){
    //       if (direccion_destinatario.trim().length > 50) {
    //         msg_error += '<p>La <strong>Dirección Destinatario</strong> debe tener maximo 50 caracteres para poder registrar la solicitud de servicio</p>';
    //       }
    //       if (direccion_destinatario.trim().length < 3) {
    //         msg_error += '<p>La <strong>Dirección Destinatario</strong> debe tener mínimo 3 caracteres para poder registrar la solicitud de servicio</p>';
    //       }
    //     });

    //     //Validar si esta en el escenario mumeor 3 donde los pesos se distribuyen en los remitentes
    //     if (ID === '3' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === 1 && BLOQUE_MERCANCIA === 1 && SERVICIO === 'Expreso' ||
    //       ID === '4' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === 1 && SERVICIO === 'Expreso' ||
    //       ID === '7' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === 1 && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso' ||
    //       ID === '8' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso' ||
    //       ID === '11' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Consolidado') {
    //       let total = 0;
    //       let errores = [];

    //       document.querySelectorAll(".re_peso").forEach(function (input) {
    //         // Convertir valor a número
    //         const valor = parseFloat(input.value) || 0;

    //         // Validaciones individuales (ejemplo)
    //         if (input.value === "") {
    //           errores.push(`El campo ${input.name} está vacío`);
    //         }

    //         if (valor < 0) {
    //           errores.push(`El campo ${input.name} no puede ser negativo`);
    //         }

    //         // Sumar al total
    //         total += valor;
    //       });

    //       // Validación del total
    //       if (total <= 0) {
    //         errores.push("El total debe ser mayor a cero");
    //       }

    //       // Mostrar errores o total
    //       if (errores.length > 0) {
    //         console.error("Errores:", errores);
    //         alert(errores.join("\n"));
    //         return false;
    //       } else {
    //         // console.log("Total calculado:", total);
    //         // return total;
    //         var sumpesod = 0;
    //         $('.de_peso').each(function (index) {
    //           var valor_des = $(this).val();
    //           sumpesod = parseFloat(sumpesod) + parseFloat(valor_des);
    //         });

    //         if (parseFloat(sumpesod) > total) {
    //           msg_error += '<p><strong>El Peso  Total del Destinatario supera el Peso Total del Remitente </strong></p>';
    //         }
    //       }
    //     } else {
    //       //Valida pesos
    //       var sumpeso = 0;
    //       $('.re_peso').each(function (index) {
    //         var valor = $(this).val();
    //         sumpeso = parseFloat(sumpeso) + parseFloat(valor); //peso total del remitente
    //       });
    //       if (parseFloat(sumpeso) > parseFloat(peso)) {
    //         msg_error += '<p><strong>El valor total del Peso Remitente  supera el Peso Neto </strong></p>';
    //       }

    //       var sumpesod = 0;
    //       $('.de_peso').each(function (index) {
    //         var valor_des = $(this).val();
    //         sumpesod = parseFloat(sumpesod) + parseFloat(valor_des);
    //       });

    //       if (parseFloat(sumpesod) > parseFloat(sumpeso)) {
    //         msg_error += '<p><strong>El Peso  Total del Destinatario supera el Peso Total del Remitente </strong></p>';
    //       }
    //     }
    //   }
    //   //FIN VALIDACIONES DE DESTINATARIOS

    //   //HOMOLOGAR DATOS SERVICIOS ESPECIALES
    //   $('.tcostoesp').each(function (index) {
    //     var tipocosto = $(this).val();
    //     if (typeof tipocosto !== 'undefined' || typeof tipocosto !== 'undefined') {
    //       $('.tiposerviespe').each(function (index) {
    //         var tiposervice = $(this).val();
    //         if (!tiposervice) {
    //           msg_error += '<p>Debe diligenciar el campo <strong>Tipo servicio especial  -datos especiales ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //           $('.tiposerviespe').focus().css('background-color', 'rgb(254,242,181)');
    //         } else {
    //           $('.tiposerviespe').blur().css('background-color', 'white');
    //         }
    //       });

    //       $('.cantiespec').each(function (index) {
    //         var canti = $(this).val();
    //         if (canti < 1) {
    //           msg_error += '<p>Debe diligenciar el campo <strong>cantidad  -datos especiales ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //           $('.cantiespec').focus().css('background-color', 'rgb(254,242,181)');
    //         } else {
    //           $('.cantiespec').blur().css('background-color', 'white');
    //         }
    //       });

    //       $('.tarifaespe').each(function (index) {
    //         var tarifa = $(this).val();
    //         if (tarifa <= 0) {
    //           msg_error += '<p>Debe diligenciar el campo <strong>Tarifa unitaria  -datos especiales ' + index + '</strong> para poder crear la solicitud de servicio.</p>';
    //           $('.tarifaespe').focus().css('background-color', 'rgb(254,242,181)');
    //         } else {
    //           $('.tarifaespe').blur().css('background-color', 'white');
    //           if (parseFloat($('#tarifauni' + index).val()) < parseFloat($('#tservi_cliente' + index).val())) {
    //             msg_error += '<p><strong>Tarifa unitaria  </strong> debe ser mayor o igual al valor del <strong> costo unitario  </strong> en servicios especiales.</p>';
    //           }
    //         }
    //       });
    //     }
    //   });

    //   //VALIDACION DE LOS COSOTOS EFICINETS DEL SICETAC
    //   $('.configuracion_vehiculo_sicetac').each(function (index) {
    //     var configuracion_vehiculo_sicetac = $(this).val();
    //     if (!configuracion_vehiculo_sicetac) {
    //       msg_error += '<p>Por favor seleccionar la <strong>Configuración del Vehículo</strong> para poder registrar solicitud de servicio</p>';
    //       $('.configuracion_vehiculo_sicetac').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.configuracion_vehiculo_sicetac').focus().css('background-color', '#FFFFFF');
    //     }
    //   });

    //   $('.unidad_transporte_sicetac').each(function (index) {
    //     var unidad_transporte_sicetac = $(this).val();
    //     if (!unidad_transporte_sicetac) {
    //       msg_error += '<p>Por favor seleccionar la <strong>Unidad de transporte</strong> para poder registrar solicitud de servicio</p>';
    //       $('.unidad_transporte_sicetac').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.unidad_transporte_sicetac').focus().css('background-color', '#FFFFFF');
    //     }
    //   });

    //   $('.tipo_carga_sicetac').each(function (index) {
    //     var tipo_carga_sicetac = $(this).val();
    //     if (!tipo_carga_sicetac) {
    //       msg_error += '<p>Por favor seleccionar el <strong>Tipo de carga</strong> para poder registrar solicitud de servicio</p>';
    //       $('.tipo_carga_sicetac').focus().css('background-color', 'rgb(254,242,181)');
    //     } else {
    //       $('.tipo_carga_sicetac').focus().css('background-color', '#FFFFFF');
    //     }
    //   });

    //   /* Validar si el costo del flete es menor al costos del sicetac */
    //   $('.fletemer').each(function (index) {
    //     // Obtener el valor del input .fletemer y convertirlo a número eliminando comas
    //     var tarifa_flete = $(this).val();
    //     var numTarifaFlete = parseFloat(tarifa_flete.replace(/,/g, ''));

    //     // Obtener el valor correspondiente del input .costo_sicetac y convertirlo a número
    //     // var costo = $('.costo_sicetac').eq(index).val();
    //     // var numCosto = parseFloat(costo.replace(/,/g, ''));

    //     // Si no se ha ingresado un valor (o no es un número válido)
    //     if (!numTarifaFlete || isNaN(numTarifaFlete)) {
    //       msg_error += '<p>Por favor seleccionar el <strong>Tipo de carga</strong> para poder registrar solicitud de servicio</p>';
    //       $(this).focus().css('background-color', 'rgb(254,242,181)');
    //     }
    //     // Si el valor de .fletemer es menor que el valor de .costo_sicetac
    //     // else if (numTarifaFlete < numCosto) {
    //     //   msg_error += '<p>El valor de flete es menora los costos del SICETAC.</p>';
    //     //   $(this).focus().css('background-color', 'rgb(254,242,181)');
    //     // }
    //     // Si todo está bien, restablecer el fondo
    //     else {
    //       $(this).css('background-color', '#FFFFFF');
    //     }
    //   });

    //   // let direcciones_iguales = validarDireccionesIguales();
    //   // Validar direcciones iguales
    //   let origen = $('.re_dire').val().trim();
    //   let destino = $('.de_dire').val().trim();

    //   if (origen !== "" && destino !== "" && origen === destino) {
    //     // errores.push('La <strong>dirección de origen</strong> y la <strong>dirección de destino</strong> no pueden ser iguales');
    //     msg_error += 'La <strong>dirección de origen</strong> y la <strong>dirección de destino</strong> no pueden ser iguales';
    //     // AplicaFoco('.de_dire');
    //     $(this).focus().css('background-color', 'rgb(254,242,181)');
    //   } else {
    //     $(this).css('background-color', '#FFFFFF');
    //     // RemueveFoco('.re_dire');
    //     // RemueveFoco('.de_dire');
    //   }

    //   if (!msg_error) {
    //     Swal.fire({
    //       title: 'Seguro',
    //       text: '¿Desea guardar la Solicitud de Servicio?',
    //       icon: 'warning',
    //       showCancelButton: true,
    //       confirmButtonColor: '#3B71CA',
    //       cancelButtonColor: '#9FA6B2',
    //       confirmButtonText: 'Aceptar',
    //       cancelButtonText: 'Cancelar',
    //       customClass: {
    //         popup: 'swal2-custom-font',
    //       },
    //     }).then(async result => {
    //       if (result.isConfirmed) {
    //         Inserta_Cotizacion(id);
    //       }
    //     });
    //   } else {
    //     Swal.fire({
    //       title: "Advertencia!",
    //       html: msg_error,
    //       icon: "warning",
    //       draggable: true,
    //       showConfirmButton: true,
    //       // timer: 1000,
    //       customClass: {
    //         popup: 'custom-swal-popup', // Clase para el contenedor principal
    //         title: 'custom-swal-title', // Clase para el título
    //         htmlContainer: 'custom-swal-html-container', // Clase para el mensaje
    //       },
    //     });
    //     $('#bloque_formulario').animate({ scrollTop: 0 }, 800);
    //   }
    // });
  }

  //funcion para mostrar el contenido segun el boton seleccionado
  $('#Nacional').change(function () {
    if ($(this).is(':checked')) {
      $('.titulogeneral').show();
      $('.formulario').show();
    } else {
      $('.titulogeneral').hide();
      $('.formulario').hide();
    }
  });

  $('#btn_total').click(function () {
    // alert('click btn total');
    var a = $('#Tservicio_transporte').val();
    var b = $('#Ttarifa_especial').val();
    var opera = parseFloat(a) + parseFloat(b);
    // alert(opera);
    $('.total_oculto').show();
    $('#Ttotal_cotizacion').val(opera);
  });

  // agregar filas a tabla servicio especial
  // agregar filas a tabla servicio especial
  $('#agregar_especial').click(function () {
    //select de mercancia
    if (contador_global1 > 0) {
      agregar_especial();
    } else {
      alert('Debe agregar mercancías a la cotización');
    }
  });

  // $(document).on('select2:select', '.tmerca', function (e) {
  //   const valorSeleccionado = $(this).val();

  //   if (valorSeleccionado) {
  //     if (valorSeleccionado === "CONTENEDOR VACIO") {
  //       $("#devolver_contenedor").show(); // Más legible que .style.display = ""
  //       $("#cnt_opcion, #cnt_tipocon, #cnt_num, #cnt_dias, #cnt_municipio, #cnt_direccion, #cnt_fcomodato, #cnt_peso").prop('disabled', false);

  //       // Limpiar y cargar tipos de contenedor
  //       $('#cnt_tipocon').html('<option value="">Seleccione</option>');
  //       $.ajax({
  //         url: $('#base_url').val() + 'serviciocliente/Consultar_Contenedor',
  //         type: 'POST',
  //         dataType: 'json',
  //         success: function (data) {
  //           data.forEach(element => {
  //             $('#cnt_tipocon').append(`<option value="${element.id}">${element.nombre}</option>`);
  //           });
  //         },
  //         error: function (jqXHR, textStatus, errorThrown) {
  //           console.log('Error al cargar contenedores:', textStatus, errorThrown);
  //         }
  //       });

  //       // Limpiar y cargar municipios
  //       $('#cnt_municipio').html('<option value="">Seleccione</option>');
  //       $.ajax({
  //         url: $('#base_url').val() + 'serviciocliente/Consultar_Municipios',
  //         type: 'POST',
  //         dataType: 'json',
  //         success: function (data) {
  //           data.forEach(element => {
  //             $('#cnt_municipio').append(`<option value="${element.id}">${element.municipio} - ${element.depto}</option>`);
  //           });
  //         },
  //         error: function (jqXHR, textStatus, errorThrown) {
  //           console.log('Error al cargar municipios:', textStatus, errorThrown);
  //         }
  //       });
  //     } else {
  //       console.log("Otra opción seleccionada:", valorSeleccionado);
  //       $("#devolver_contenedor").hide(); // Más legible que .style.display = ""
  //       // $("#cnt_opcion, #cnt_tipocon, #cnt_num, #cnt_dias, #cnt_municipio, #cnt_direccion, #cnt_fcomodato, #cnt_peso").prop('disabled', false);
  //       // Aquí puedes manejar otras opciones
  //     }
  //   } else {
  //     console.log("No se ha seleccionado ninguna opción");
  //   }
  // });

  // $(document).on('select2:select', '.empaquemer', function (e) {
  //   const valorSeleccionado = $(this).val();

  //   if (valorSeleccionado) {
  //     if (valorSeleccionado === "8" || valorSeleccionado === "9" || valorSeleccionado === "10") {
  //       $("#devolver_contenedor").show(); // Más legible que .style.display = ""
  //       $("#cnt_opcion, #cnt_tipocon, #cnt_num, #cnt_dias, #cnt_municipio, #cnt_direccion, #cnt_fcomodato, #cnt_peso").prop('disabled', false);

  //       // Limpiar y cargar tipos de contenedor
  //       $('#cnt_tipocon').html('<option value="">Seleccione</option>');
  //       $.ajax({
  //         url: $('#base_url').val() + 'serviciocliente/Consultar_Contenedor',
  //         type: 'POST',
  //         dataType: 'json',
  //         success: function (data) {
  //           data.forEach(element => {
  //             $('#cnt_tipocon').append(`<option value="${element.id}">${element.nombre}</option>`);
  //           });
  //         },
  //         error: function (jqXHR, textStatus, errorThrown) {
  //           console.log('Error al cargar contenedores:', textStatus, errorThrown);
  //         }
  //       });

  //       // Limpiar y cargar municipios
  //       $('#cnt_municipio').html('<option value="">Seleccione</option>');
  //       $.ajax({
  //         url: $('#base_url').val() + 'serviciocliente/Consultar_Municipios',
  //         type: 'POST',
  //         dataType: 'json',
  //         success: function (data) {
  //           data.forEach(element => {
  //             $('#cnt_municipio').append(`<option value="${element.id}">${element.municipio} - ${element.depto}</option>`);
  //           });
  //         },
  //         error: function (jqXHR, textStatus, errorThrown) {
  //           console.log('Error al cargar municipios:', textStatus, errorThrown);
  //         }
  //       });
  //     } else {
  //       // console.log("Otra opción seleccionada:", valorSeleccionado);
  //       $("#devolver_contenedor").hide(); // Más legible que .style.display = ""
  //       // $("#cnt_opcion, #cnt_tipocon, #cnt_num, #cnt_dias, #cnt_municipio, #cnt_direccion, #cnt_fcomodato, #cnt_peso").prop('disabled', true);
  //       // Aquí puedes manejar otras opciones
  //     }
  //   } else {
  //     console.log("No se ha seleccionado ninguna opción");
  //   }
  // });

  // $('.operamer').on('change', function () {
  //   // Obtener el valor seleccionado
  //   var valorSeleccionado = $(this).val();

  //   // Validar el valor seleccionado
  //   if (valorSeleccionado) {
  //     console.log("Valor seleccionado:", valorSeleccionado);

  //     // Aquí puedes hacer tu validación
  //     if (valorSeleccionado === "C" || valorSeleccionado === "V") {
  //       // console.log("OCONTENEDOR VACIO seleccionada");
  //       document.getElementById("devolver_contenedor").style.display = "block";
  //       document.getElementById("cnt_opcion").disabled = false;
  //       document.getElementById("cnt_tipocon").disabled = false;
  //       /* Ejecutar funcion para cargar la lista de contendores */
  //       /**************************Cargar Cotenedores para crear la solicitud************************/
  //       $('#cnt_tipocon').html('<option value="">Seleccione</option>');
  //       $.ajax({
  //         url: $('#base_url').val() + 'serviciocliente/Consultar_Contenedor',
  //         type: 'POST',
  //         dataType: 'json',
  //         success: function (data) {
  //           if (data) {
  //             data.forEach(function (element, index) {
  //               $('#cnt_tipocon').append('<option value="' + element.id + '">' + element.nombre + '</option>');
  //             });
  //           }
  //         },
  //         error: function (jqXHR, textStatus, errorThrown) {
  //           console.log('no trajo agencia');
  //           console.log(jqXHR);
  //           console.log(textStatus);
  //           console.log(errorThrown);
  //         },
  //       });
  //       document.getElementById("cnt_num").disabled = false;
  //       document.getElementById("cnt_dias").disabled = false;
  //       document.getElementById("cnt_municipio").disabled = false;
  //       /* Cargar Municipios de los contenedores */
  //       $('#cnt_municipio').html('<option value="">Seleccione</option>');
  //       $.ajax({
  //         url: $('#base_url').val() + 'serviciocliente/Consultar_Municipios',
  //         type: 'POST',
  //         dataType: 'json',
  //         success: function (data) {
  //           if (data) {
  //             data.forEach(function (element, index) {
  //               $('#cnt_municipio').append('<option value="' + element.id + '">' + element.municipio + '-' + element.depto + '</option>');
  //             });
  //           }
  //         },
  //         error: function (jqXHR, textStatus, errorThrown) {
  //           console.log('no trajo municipio');
  //           console.log(jqXHR);
  //           console.log(textStatus);
  //           console.log(errorThrown);
  //         },
  //       });
  //       document.getElementById("cnt_direccion").disabled = false;
  //       document.getElementById("cnt_fcomodato").disabled = false;
  //       document.getElementById("cnt_peso").disabled = false;
  //       // document.getElementById("cnt_peso").value = false;
  //       // Lógica para la opción 1
  //     } else if (valorSeleccionado === "2") {
  //       console.log("Opción 2 seleccionada");
  //       // Lógica para la opción 2
  //     } else if (valorSeleccionado === "3") {
  //       console.log("Opción 3 seleccionada");
  //       // Lógica para la opción 3
  //     } else {
  //       console.log("Opción no válida");
  //     }
  //   } else {
  //     console.log("No se ha seleccionado ninguna opción");
  //   }
  // });

  // Puedes acceder a estas variables en cualquier parte del código
  
  document.addEventListener("click", async e => {
    // Verificar si el clic fue en un botón cuyo ID empieza con "btn_edit_cargue"
    // Obtener el botón (incluso si se hace clic en un elemento hijo)
    const btnValidarSicetac = e.target.closest('[id^="btn-validar-sicetac"]');
    if (btnValidarSicetac) {
      // Acceder al data-id
      const dataId = btnValidarSicetac.getAttribute('data-id');
      //VALORES PARA VALIDACIONES SICETAC
      var ArraySicetac = {
        configuracion_vehiculo: [],
        unidad_transporte: [],
        tipo_carga: [],
        origen_sicetac: [],
        destino_sicetac: [],
        costo_sicetac: [],
      }

      $('.configuracion_vehiculo_sicetac').each(function (index) {
        var configuracion_vehiculo = $(this).val();
        ArraySicetac.configuracion_vehiculo[index] = configuracion_vehiculo;
      });

      $('.unidad_transporte_sicetac').each(function (index) {
        var unidad_transporte = $(this).val();
        ArraySicetac.unidad_transporte[index] = unidad_transporte;
      });

      $('.tipo_carga_sicetac').each(function (index) {
        var tipo_carga = $(this).val();
        ArraySicetac.tipo_carga[index] = tipo_carga;
      });

      $('.originario').each(function (index) {
        var origen_sicetac = $(this).val();
        ArraySicetac.origen_sicetac[index] = origen_sicetac;
      });

      $('.destinar').each(function (index) {
        var destino_sicetac = $(this).val();
        ArraySicetac.destino_sicetac[index] = destino_sicetac;
      });

      $('.costo_sicetac').each(function (index) {
        var costo_sicetac = $(this).val();
        ArraySicetac.costo_sicetac[index] = costo_sicetac;
      });

      var CostosEficientesSicetac = ArraySicetac;
      CostosEficientesSicetac = JSON.stringify(CostosEficientesSicetac);

      let datos = new FormData();
      datos.append("CostosEficientesSicetac", CostosEficientesSicetac);
      try {
        // const response = await fetch($("#base_url").val() + "serviciocliente/Validar_tarifa_sicetac", {
        const response = await fetch($("#base_url").val() + "web_service/Validar_Sicetac", {
          method: "POST",
          body: datos,
          cache: "no-cache",
        });
        const data = await response.json();
        if (data) {
          // console.log("🚀 ~ data:", data)
          // if (Array.isArray(data)) {
          //   $('.costo_sicetac').each(function (index) {
          //     if (data[index] !== undefined) {
          //       // Convertir y formatear el valor obtenido
          //       let valorCosto = parseFloat(data[index]);
          //       // Si data[index] está definido, se usa ese valor; de lo contrario se asigna 0.
          //       // let valorCosto = (data.length > 0 || data[index] !== undefined) ? parseFloat(data[index]) : 0;
          //       let valorFormateado = valorCosto.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
          //       $(this).val(valorFormateado);

          //       // Obtener el input .fletemer correspondiente usando el mismo índice
          //       let fletemerInput = $('.fletemer').eq(index);
          //       // Remover comas para convertir correctamente el valor a número
          //       let valorFletemer = parseFloat(fletemerInput.val().replace(/,/g, ''));

          //       // Compara: si el valor en .fletemer es menor que valorCosto...
          //       if (valorFletemer < valorCosto) {
          //         // Se aplica un borde rojo al input
          //         fletemerInput.css('border', '1px solid red');
          //         // Se añade un mensaje de error debajo si no existe ya
          //         if (fletemerInput.next('.error-message').length === 0) {
          //           fletemerInput.after('<div class="error-message" style="color: red; font-size: 12px; font-weight: bold;">El valor ingresado es menor a los costos del SICETAC.</div>');
          //         }
          //       } else {
          //         console.log("entro");
          //         // Si el valor es mayor o igual, se remueve el borde y el mensaje de error
          //         fletemerInput.css('border', '');
          //         fletemerInput.next('.error-message').remove();
          //       }
          //     }
          //   });
          // }
        } else {
          console.log(data.length);
        }
      } catch (error) {
        console.error("Error en la primera solicitud:", error);
        throw error;
      } finally {
      }
    }
  });

  /* Agregar validaciones para ver que filtro escojer */
  $("#agregar_fila_entrega2").click(function () {
    var cliente = $("#id_cliente_seleccionado").val();

    // Verificar si el array ORIGEN_ARRAY está vacío
    if (ORIGEN_ARRAY.length === 0) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        html: "Debe seleccionar al menos un <strong>municipio de origen</strong> antes de agregar remitentes y destinatarios",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    // Validaciones adicionales
    if (!$("#maximo_entregab").val()) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        html: "Por favor ingrese la <strong>cantidad de Remitentes</strong> que requiere para asignar",
        showConfirmButton: false,
        timer: 1500
      });
      document.getElementById("maximo_entregab").focus();
      return;
    }

    if (cliente === "") {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        html: "Por favor debe seleccionar un <strong>cliente</strong> para agregar remitentes y destinatarios",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    Agrega_Remitente(cliente, ORIGEN_ARRAY[0]);
  });

  /* Validar si change de costo flete si el valor si el valor tarifa sietac no esta vacio */
  $(document).on('change', '.fletemer', function () {
    // Obtener el índice del input cambiado
    let index = $('.fletemer').index(this);

    // Capturar y limpiar el valor del input .fletemer
    let fletemerStr = $(this).val();
    // Eliminar comas para parsearlo correctamente
    let fletemerVal = parseFloat(fletemerStr.replace(/,/g, ''));

    // Obtener el valor del input .costo_sicetac correspondiente
    let costoStr = $('.costo_sicetac').eq(index).val();

    // Solo comparar si .costo_sicetac no está vacío
    if (costoStr !== '' && costoStr !== '') {
      let costoVal = parseFloat(costoStr.replace(/,/g, ''));
      if (fletemerVal < costoVal) {
        // Aplica el borde rojo y muestra el mensaje de error si aún no existe
        $(this).css('border', '1px solid red');
        if ($(this).next('.error-message').length === 0) {
          $(this).after('<div class="error-message" style="color: red; font-size: 12px; font-weight: bold;">El valor ingresado es menor a los costos del SICETAC.</div>');
        }
      } else {
        // Si el valor es mayor o igual, se remueven estilos y mensajes de error
        $(this).css('border', '');
        $(this).next('.error-message').remove();
      }
    }
  });


  //***********fin del document ready function***
};

/****************************************************Funciones de los Botones**********************************************************/
function prueba_editar_no(element) {
  $('#estado_actual').html(''); //limpiar el estado actual de cada edición
  $('#eprincipal').html('');
  $('#especialista').html('');

  var elemento = $(element);
  var n_cotizar = elemento.data('id');
  var estado_gerencia = elemento.data('id2');
  color = '';

  if (estado_gerencia == 'autorizado') {
    document.getElementsByClassName('ntarifamer').disabled = false;
    document.getElementById('btn_cambia_stado').disabled = false;
    document.getElementById('btn_no_actualizar').disabled = false;
  }

  if (estado_gerencia == 'por autorizar') {
    document.getElementsByClassName('ntarifamer').disabled = true;
    document.getElementById('btn_cambia_stado').disabled = true;
    document.getElementById('btn_no_actualizar').disabled = true;
  }

  var dato = {
    n_cotizar: n_cotizar,
  };

  $.ajax({
    url: $('#base_url').val() + 'serviciocliente/Cabecera_Editar',
    type: 'POST',
    data: dato,
    dataType: 'json',
    success: function (data) {
      if (data) {
        $('#estado_gerencia').val(data.estado_autorizado);
        var num = $('#no_flag_popup').val(data.n_cotizacion);
        var l = $('#eno_linea').val('');
        var estado = data.estado;
        if (estado == 'F3') {
          var name = 'F3-Ganada';
          $('#eno_estado').html('<option value="' + data.estado + '">' + name + '</option>');
        }

        if (estado == 'F1') {
          var name = 'F1-Realizada';
          $('#eno_estado').html('<option value="' + data.estado + '">' + name + '</option>');
        }

        if (estado == 'F4') {
          var name = 'F4-Perdida';
          $('#eno_estado').html('<option value="' + data.estado + '">' + name + '</option>');
        }

        if (estado == 'F5') {
          var name = 'F5-Cancelada';
          $('#eno_estado').html('<option value="' + data.estado + '">' + name + '</option>');
        }
        if (estado == 'F2') {
          var name = 'F2-Entregada';
          $('#eno_estado').html('<option value="' + data.estado + '">' + name + '</option>');
        }

        /* Definir donde se usa */
        var t = $('#eno_mira').val(data.nit);
        var dig = $('#eno_digito').val(data.digito);
        var nom = $('#eno_cliente').val(data.nombre_cliente);
        var tel = $('#eno_telefono').val(data.telefono);
        var dir = $('#eno_direccion').val(data.direccion);
        var proce = $('#eno_proce').val(data.procedencia_cotizacion);
        var observa = $('#eno_observacion').val(data.observaciones);
        var elaborado = $('#eno_elaborado_por').val(data.elaborado_por);
        var autorizado = $('#eno_autorizado_por').val(data.autorizado_por);

        //costos servicio
        var valortotaltrans = $('#eno_Tservicio_transporte').val(data.total_transporte);
        $('#eno_Tservicio_uti').val(data.tmer_rent);
        $('#eno_Tservicio_ren').val(data.tmer_utili);
        $('#eno_Tservicio_fle').val(data.tmer_flete);
        var valortotalespe = $('#eno_Tservicio_especial').val(data.total_especial);
        $('#eno_Tservicio_tarifa').val(data.tes_tarifa);
        $('#eno_Tservicio_costo').val(data.tes_flete);
        $('#eno_Tservicio_utili').val(data.tes_renta);
        $('#eno_Tservicio_rent').val(data.tes_util);
        $('#eno_totalcotizacion').val(data.total_cotizacion);

        $('#eno_Tservicio_especial').val(parseFloat($('#eno_Tservicio_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#eno_Tservicio_transporte').val(parseFloat($('#eno_Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#eno_Tservicio_uti').val(parseFloat($('#eno_Tservicio_uti').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#eno_Tservicio_ren').val(parseFloat($('#eno_Tservicio_ren').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#eno_Tservicio_fle').val(parseFloat($('#eno_Tservicio_fle').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#eno_Tservicio_tarifa').val(parseFloat($('#eno_Tservicio_tarifa').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#eno_Tservicio_costo').val(parseFloat($('#eno_Tservicio_costo').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#eno_Tservicio_utili').val(parseFloat($('#eno_Tservicio_utili').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#eno_Tservicio_rent').val(parseFloat($('#eno_Tservicio_rent').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#eno_totalcotizacion').val(parseFloat($('#eno_totalcotizacion').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log('error_cabecera_noeditar');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  //MERCANCIAS
  var datos_editm = {
    cotizarm_no: n_cotizar,
  };

  var efila = '';
  var datos_edite = '';
  datos_edite = {
    cotizare_no: n_cotizar,
  };
  $.ajax({
    url: $('#base_url').val() + 'serviciocliente/Consultar_No',
    type: 'POST',
    data: datos_editm,
    dataType: 'json',
    success: function (data) {
      // MERCANCIA
      var estado_gerencia = $('#estado_gerencia').val();
      var co = 0;
      var carga = '';
      data.forEach(function (element, index) {
        co++;
        if (element.tipo_carga == 'G') {
          carga = 'General';
        }

        if (element.tipo_carga == 'P') {
          carga = 'Paqueteo';
        }

        if (element.tipo_carga == 'C') {
          carga = 'Contenedor Cargado';
        }

        if (element.tipo_carga == 'V') {
          carga = 'Contenedor Vacío';
        }

        efila = `
        <div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          <a href='#' class='badge badge-primary' title='mercancia'>${element.item}</a>
        </div>
        <div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
          <span style='font-weight:500; margin-top:20px;'>Pareja origen-destino</span>
          <input type='text' class='form-control input-xs idpareja' value='${element.idm}' readonly style='background-color:white;'>
        </div>
        <div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
          <span style='font-weight:500; margin-top:20px;'>Tipo servicio</span>
          <input type='text' class='form-control input-xs' value='${element.tipo_servicio_mer}' readonly style='background-color:white;'>
        </div>
        <div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
          <span style='font-weight:500; margin-top:20px;'>Tipo Vehículo</span>
          <input type='text' value='${element.nombre}' class='form-control input-xs' readonly style='background-color:white;'>
        </div>
        <div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
          <span style='font-weight:500; margin-top:20px;'>Tipo carga</span>
          <input type='text' class='form-control input-xs' value='${carga}' readonly style='background-color:white;'>
        </div>
        <div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
          <span>Tipo transporte</span>
          <input type='text' class='form-control input-xs' value='${element.tipo_transporte}' readonly style='background-color:white;'>
        </div>
        <div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
          <span style='font-weight:500; margin-top:20px;'>Peso bruto (kg)</span>
          <input type='text' id='npbruto${co}' class='form-control input-xs' value='${element.peso_bruto_kg}' readonly style='background-color:white;'>
        </div>
        <div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
          <span style='font-weight:500; margin-top:20px;'>Peso neto (kg)</span>
          <input type='text' id='epesone${co}' class='form-control input-xs' value='${element.peso_neto_kg}' readonly style='background-color:white;'>
        </div>
        <div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
          <span style='font-weight:500; margin-top:20px;'>Peso Bruto(Tn)</span>
          <input type='text' id='enetotn${co}' class='form-control input-xs' value='${element.peso_neto_tn}' readonly style='background-color:white;'>
        </div>
        <div class='col-xs-6 col-sm-4 col-md-4 col-lg-4'>
          <span style='font-weight:500; margin-top:20px;'>Origen</span>
          <input type='text' class='form-control input-xs' value='${element.o}' readonly style='background-color:white;'>
        </div>
        <div class='col-xs-6 col-sm-4 col-md-4 col-lg-4'>
          <span style='font-weight:500; margin-top:20px;'>Destino</span>
          <input type='text' class='form-control input-xs' value='${element.d}' readonly style='background-color:white;'>
        </div>
        <div class='col-xs-6 col-sm-4 col-md-4 col-lg-4'>
          <span style='font-weight:500; margin-top:20px;'>Alto</span>
          <input type='text' id='nalto${co}' class='form-control input-xs' value='${element.alto}' readonly style='background-color:white;'>
        </div>
        <div class='col-xs-6 col-sm-4 col-md-4 col-lg-4'>
          <span style='font-weight:500; margin-top:20px;'>Largo</span>
          <input type='text' id='nlargo${co}' class='form-control input-xs' value='${element.largo}' readonly style='background-color:white;'>
        </div>
        <div class='col-xs-6 col-sm-4 col-md-4 col-lg-4'>
          <span style='font-weight:500; margin-top:20px;'>Ancho</span>
          <input type='text' id='nancho${co}' class='form-control input-xs' value='${element.ancho}' readonly style='background-color:white;'>
        </div>
        <div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          <span style='font-weight:500; margin-top:20px;'>Observación</span>
          <textarea class='form-control input-xs' readonly style='background-color:white;'>${element.observacion}</textarea>
        </div>
      `;

        //datos especiales

        //});	//cierre del foreach mercancia

        $('#eprincipal').append(efila);

        $('#epesone' + co).val(parseFloat($('#epesone' + co).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        $('#enetotn' + co).val(parseFloat($('#enetotn' + co).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        $('#nalto' + co).val(parseFloat($('#nalto' + co).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        $('#nlargo' + co).val(parseFloat($('#nlargo' + co).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        $('#nancho' + co).val(parseFloat($('#nancho' + co).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        $('#nvolu' + co).val(parseFloat($('#nvolu' + co).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        $('#nutil' + co).val(parseFloat($('#nutil' + co).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        $('#nrent' + co).val(parseFloat($('#nrent' + co).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        $('#nvalor' + co).val(parseFloat($('#nvalor' + co).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        $('#ncant' + co).val(parseFloat($('#ncant' + co).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        $('#npbruto' + co).val(parseFloat($('#npbruto' + co).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        $('#nflete' + co).val(parseFloat($('#nflete' + co).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        $('#ntarifa' + co).val(parseFloat($('#ntarifa' + co).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        if (estado_gerencia == 'No autorizado') {
          document.getElementById('ntarifa' + co).disabled = false;

          $('#ntarifa' + co).css({
            background: '#F0F8FF',
          });
        } else if (estado_gerencia == 'autorizado') {
          document.getElementById('ntarifa' + co).disabled = true;

          $('#ntarifa' + co).css({
            background: 'white',
          });
        }
      });
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log('error mercancia');

      console.log(jqXHR);

      console.log(textStatus);

      console.log(errorThrown);
    },
  });

  //ESPECIALES
  var efila2 = '';
  $('#no_cuerpo_editar_espe').html('');
  $.ajax({
    url: $('#base_url').val() + 'serviciocliente/No_Consulta_E',
    type: 'POST',
    data: datos_edite,
    dataType: 'json',
    success: function (data) {
      if (data.result != '' && data.result != null) {
        c = 0;
        data.forEach(function (element, index) {
          c++;
          //SERVICIO ESPECIAL
          efila2 = `
          <div class="panel panel-default">
            <div class="panel-body">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <label>Servicio especial/ Mercancía a la que pertenece:</label><br>
                <a href="#" class="badge badge-success" title="servicio especial">${element.item_especial}</a> /
                <a href="#" class="badge badge-primary" title="mercancia">${element.item_mercancia}</a>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <h4 class="text-center">Servicios especiales</h4>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <span style="font-weight:500; margin-top:20px;">Tipo servicio</span>
                  <select class="form-control input-sm" readonly="readonly" style="background-color:white;">
                    <option value="${element.tipo_servicio}">${element.tipo_servicio}</option>
                    <option>Excolta</option>
                    <option>Auxiliar Cargue</option>
                    <option>Auxiliar Descargue</option>
                    <option>Auxiliar Cargue y Descargue</option>
                    <option>Montacargas Cargue</option>
                    <option>Montacargas Descargue</option>
                    <option>Montacargas Cargue y Descargue</option>
                    <option>Estibador Manual</option>
                  </select>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <span style="font-weight:500; margin-top:20px;">Cantidad</span>
                  <input type="number" min="0" class="form-control input-sm" value="${element.cantidad}" readonly="readonly" style="background-color:white;">
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <span style="font-weight:500; margin-top:20px;">Costo unitario</span>
                  <input type="text" id="nunitarioe${c}" min="0" class="form-control input-sm" value="${element.valor_unitario}" readonly="readonly" style="background-color:white;">
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <span style="font-weight:500; margin-top:20px;">Tarifa unitaria</span>
                  <input type="text" id="ntarifae${c}" class="form-control input-sm" readonly="readonly" value="${element.tarifa_unitaria}" style="background-color:white;">
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <span style="font-weight:500; margin-top:20px;">Costo servicio</span>
                  <input type="text" id="ntotale${c}" class="form-control input-sm" readonly="readonly" value="${element.total_servicio}" style="background-color:white;">
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <span>Calculo tarifa</span>
                  <input type="text" id="ntari${c}" class="form-control input-sm" readonly="readonly" value="${element.tarifa}" style="background-color:white;">
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <span>Utilidad</span>
                  <input type="text" id="nutili${c}" class="form-control input-sm" readonly="readonly" value="${element.rentabilidad}" style="background-color:white;">
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <span>Rentabilidad</span>
                  <input type="text" id="nrentes${c}" class="form-control input-sm" readonly="readonly" value="${element.utilidad}" style="background-color:white;">
                </div>
              </div>
            </div>
          </div>`;

          $('#especialista').append(efila2);

          //formatear números
          $('#epesone' + c).val(parseFloat($('#epesone' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#nunitarioe' + c).val(parseFloat($('#nunitarioe' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#ntarifae' + c).val(parseFloat($('#ntarifae' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#ntotale' + c).val(parseFloat($('#ntotale' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#ntari' + c).val(parseFloat($('#ntari' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#nutili' + c).val(parseFloat($('#nutili' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#nrentes' + c).val(parseFloat($('#nrentes' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        });
      }
    },
    error: function () { },
  });
}

//CIERRE DE LA FUNCIÓN visualizar
function historico(element, id) {
  var elemento = $(element);
  var nom = elemento.data('id');
  var cotiz = $('#number').val(id);
  //historial de movimientos en cotizacion
  var dato = {
    ncotizar: id,
  };

  $('#cuerpo_historico').html('');
  $('#rta_gerencia').html('');

  $.ajax({
    url: $('#base_url').val() + 'serviciocliente/Historio_Cotizaciones',
    type: 'POST',
    data: dato,
    dataType: 'json',
    success: function (data) {
      console.log('trajo historico');
      if (data) {
        $('#cuerpo_historico').html('');
        data.resultado.forEach(function (element, index) {
          var nomenclatura = element.estado;
          if (nomenclatura == 'F1') {
            var estado = 'F1-Realizada';
            var status = '<td class="text-default">' + '<center>' + '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Realizada" ></span>' + '</center>' + '</td>';
          }

          if (nomenclatura == 'F2') {
            var estado = 'F2-Entregada';
            var status = '<td class="text-success">' + '<center>' + '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Entregada"></span>' + '</center>' + '</td>';
          }

          if (nomenclatura == 'F3') {
            var estado = 'F3-Ganada';
            var status = '<td class="text-warning">' + '<center>' + '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Ganada"></span>' + '</center>' + '</td>';
          }

          if (nomenclatura == 'F4') {
            var estado = 'F4-Perdida';
            var status = '<td class="text-danger">' + '<center>' + '<span class="mdi mdi-dot-circle icon" data-toggle="tooltip" title="Pérdida"  ></span>' + '</center>' + '</td>';
          }

          if (nomenclatura == 'F5') {
            var estado = 'F5-Cancelada';
            var status = '<td class="text-primary">' + '<center>' + '<span class="mdi mdi-dot-circle icon" data-toggle="tooltip" title="Cancelada" ></span>' + '</center>' + '</td>';
          }

          if (nomenclatura == 'F6') {
            var estado = 'F6-Rechazada';
            var status = '<td class="text-danger">' + '<center>' + '<span class="mdi mdi-dot-circle icon" data-toggle="tooltip" title="Rechazada" ></span>' + '</center>' + '</td>';
          }

          $('#cuerpo_historico').append(
            '<tr>' +
            status +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.n_cotizacion +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.item +
            '-' +
            element.pareja +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.tipo_mercancia +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            estado +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.fecha +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.hora +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.user_log +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.proceso +
            '</td>' +
            '</tr>',
          );
        });
      }

      if (data.resultado2) {
        data.resultado2.forEach(function (element, index) {
          $('#rta_gerencia').append(
            '<tr>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.nota +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.idselect +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.usuario +
            '</td>' +
            '</tr>',
          );
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no traho historico');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  //historial de movimientos de solicitudes de servicio adheridas a la cotizacion
  var soli = {
    n_cotizar: id,
  };

  var n_cotizar = id;
  $('#cuerpo_servicio').html('');
  $.ajax({
    url: $('#base_url').val() + 'serviciocliente/T_Solicitud_Servcio',
    type: 'POST',
    data: soli,
    dataType: 'json',
    success: function (data) {
      if (data) {
        $('#t1').show();
        $('#cuerpo_servicio').html('');
        data.forEach(function (element, index) {
          $('#cuerpo_servicio').append(
            '<tr>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.id +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.n_cotizacion +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.item +
            '-' +
            element.pareja +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.tipo_mercancia +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.fecha +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.hora +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.usuario_auditor +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.proceso +
            '</td>' +
            '</tr>',
          );
        });
      } else {
        $('#t1').hide();
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no traho solicitudes');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function tbsolicitudes(element, id) {
  var elemento = $(element);
  var nom = elemento.data('id');
  var cotiz = $('#cotizacion').val(id);
  var tabla = {
    id: id,
  };

  $('#ctb_solicitud').html('');
  $('#tipo_vvisible').html('');
  $.ajax({
    url: $('#base_url').val() + 'serviciocliente/Tabla_Solicitudes',
    type: 'POST',
    data: tabla,
    dataType: 'json',
    success: function (data) {
      if (data) {
        var cont = 0;
        data.forEach(function (element, index) {
          cont++;
          // var idsolicitud = element.soliid;
          var idsolicitud = element.nundoc_solicitud;
          var num = element.n_cotizacion;
          var origen = element.origen;
          var destino = element.destino;
          var peso = element.peso_neto_kg;
          var veh = element.tipo_vehiculo;
          var cliente = element.nombre_cliente;
          var flete = element.flete;
          var parejita = element.parejaod;
          var item = element.item;
          var carga = element.tipo_carga;
          var trans = element.tipo_transporte;
          var cant_solicitada = element.cant_vehiculo;
          var cant_actual = element.cant_gastar;
          var estado_soli = element.idpareja_origen_destino;
          var palabra = '';
          var color = '';
          var estado_solicitud_servicio = element.estado;
          var id_clientecot = element.id_cliente;
          var tipo_transporte = element.tipo_transporte;
          var toltip = '';

          /*alert('estado'+estado_solicitud_servicio + ' id'+estado_soli);*/
          if (estado_solicitud_servicio == null) {
            palabra = 'Pendiente';
            color = 'primary';
          }

          if (estado_solicitud_servicio == 'Pendiente') {
            palabra = 'Realizada';
            color = 'primary';
            toltip = 'Pendiente';
          }

          if (estado_solicitud_servicio == 'Realizada') {
            palabra = 'Realizada';
            color = 'success';
            toltip = 'Realizada';
          }

          if (estado_solicitud_servicio == 'Cancelada') {
            palabra = 'Pendiente';
            color = 'info';
            toltip = 'Pendiente';
          }

          if (estado_solicitud_servicio == 'En_subasta') {
            palabra = 'Realizada_subasta';
            color = 'info';
            toltip = 'En Subasta';
          }

          if (estado_solicitud_servicio == 'asignada') {
            palabra = 'Asignada';
            color = 'warning';
            toltip = 'Asignada solicitud prefiltro';
          }

          if (estado_solicitud_servicio == 'en_tramite') {
            palabra = 'En tramite';
            color = 'warning';
            toltip = 'En tramite solicitud prefiltro';
          }

          if (estado_solicitud_servicio == 'aprobado_prefiltro') {
            palabra = 'Aprobado prefiltro';
            color = 'success';
            toltip = 'Aprobado prefiltro';
          }

          var boton = '';
          var bedite_entrega = '';
          var btn_cancelar = '';
          var boton_consulta = '';

          if (estado_solicitud_servicio == null) {
            //pendiente
            boton =
              '<button type="button"  class="btn btn-secondary btn btn-xs mdi mdi-plus" id="btn_servicio' +
              cont +
              '" data-toggle="modal"data-target="#md-fullWidth"  data-id="' +
              num +
              '" data-id2="' +
              origen +
              '" data-id3="' +
              destino +
              '" data-id4="' +
              peso +
              '" data-id5="' +
              veh +
              '" data-id6="' +
              cliente +
              '"  data-id7="' +
              flete +
              '"  data-id8="' +
              item +
              '" data-id9="' +
              carga +
              '" data-id10="' +
              trans +
              '" data-id11="' +
              cant_solicitada +
              '" data-id12="' +
              cant_actual +
              '" data-id13="' +
              id_clientecot +
              '"  data-id14="' +
              tipo_transporte +
              '" data-placement="top" title="Solicitud pendiente"></button>';
          } else {
            if (estado_solicitud_servicio == 'Cancelada') {
              boton =
                '<button type="button"  class="btn btn-secondary btn btn-xs mdi mdi-plus" id="btn_modal' +
                cont +
                '" data-toggle="modal"data-target="#exampleModal1"  data-id="' +
                num +
                '" data-id2="' +
                origen +
                '" data-id3="' +
                destino +
                '" data-id4="' +
                peso +
                '" data-id5="' +
                veh +
                '" data-id6="' +
                cliente +
                '"  data-id7="' +
                flete +
                '"  data-id8="' +
                item +
                '" data-id9="' +
                carga +
                '" data-id10="' +
                trans +
                '" data-id11="' +
                cant_solicitada +
                '" data-id12="' +
                cant_actual +
                '" data-id13="' +
                id_clientecot +
                '" data-id14="' +
                tipo_transporte +
                '" data-placement="top" title="Solicitud pendiente" > </button>';
            }

            //realizada
            if (
              estado_solicitud_servicio == 'Realizada' ||
              estado_solicitud_servicio == 'Pendiente' ||
              estado_solicitud_servicio == 'En_subasta' ||
              estado_solicitud_servicio == 'asignada' ||
              estado_solicitud_servicio == 'aprobado_prefiltro' ||
              estado_solicitud_servicio == 'en_tramite'
            ) {
              boton =
                '<button type="button"  class="btn btn-warning btn btn-xs" id="btn_nuevo' +
                cont +
                '" data-toggle="modal"data-target="#status"  data-id="' +
                num +
                '" data-id2="' +
                parejita +
                '"  data-id3="' +
                idsolicitud +
                '" data-placement="top" title="Solicitud realizada" ><i class="fas fa-university"></i></button>';

              boton_consulta =
                '<button type="button"  class="btn btn-info btn btn-xs" id="btn_consulta_ss' +
                cont +
                '" data-toggle="modal"data-target="#consulta_solicitud" data-id="' +
                num +
                '" data-id2="' +
                parejita +
                '"  data-id3="' +
                idsolicitud +
                '" data-placement="top" title="Consulta Solicitud"><i class="far fa-eye"></i></button>';
            }
          }

          $('#ctb_solicitud').append(
            '<tr>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            parejita +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.n_cotizacion +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.item +
            ' - ' +
            element.tipo_mercancia +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.nombre_cliente +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            element.estado_autorizado +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            '<span class="label label-' +
            color +
            '" title="' +
            toltip +
            '">' +
            palabra +
            '</span></td>' +
            '<td style="white-space: nowrap;" class="text-center"><div class="btn-group btn-group-xs" role="group" aria-label="...">' +
            boton +
            '&nbsp;' +
            bedite_entrega +
            '&nbsp;' +
            btn_cancelar +
            '&nbsp;' +
            boton_consulta +
            '</div></td>' +
            '</tr>',
          );

          $('#solicitud_servicio').val('');

          //consulta solicitud de servicio - nuevo
          $('#btn_consulta_ss' + cont + '').click(function () {
            $('#consultass_general').html('');
            $('#contener_remitente').html('');
            $('.destinatari').html('');
            var num_cotizacion = $(this).attr('data-id');
            var solicitud_servicio = $(this).attr('data-id3');
            var consulta_solicitud = {
              cotizar: num_cotizacion,
              solicitud: solicitud_servicio,
            };

            $.ajax({
              url: $('#base_url').val() + 'serviciocliente/Consultar_Solicitud_Servcio',
              type: 'POST',
              data: consulta_solicitud,
              dataType: 'json',
              success: function (data) {
                if (data) {
                  $('#consultass_general').html(
                    '<tr>' +
                    '<td class="cell-detail"><span>' +
                    solicitud_servicio +
                    '<br> Cot: ' +
                    element.n_cotizacion +
                    '</span></td>' +
                    '<td class="cell-detail">' +
                    '<span>Cliente:</span>' +
                    '<span class="cell-detail-description">' +
                    element.nombre_cliente +
                    '</span>' +
                    '</td>' +
                    '<td class="cell-detail">' +
                    '<span>Origen - Destino:</span>' +
                    '<span class="cell-detail-description">' +
                    data[0].origen +
                    '</span>' +
                    '<span class="cell-detail-description">' +
                    data[0].destino +
                    '</span></td>' +
                    '<td class="cell-detail">' +
                    '<span>Tipo Vehículo</span>' +
                    '<span class="cell-detail-description">' +
                    data[0].nombre +
                    '</span>' +
                    '</td>' +
                    '<td class="cell-detail">' +
                    '<span> Peso Neto:</span>' +
                    '<span class="cell-detail-description">' +
                    peso +
                    '</span>' +
                    '</td>' +
                    '<td class="cell-detail">' +
                    '<span>Agencia</span>' +
                    '<span class="cell-detail-description">' +
                    data[0].agencia +
                    '</span>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td class="cell-detail">' +
                    '<span>Contenedor</span>' +
                    '<span class="cell-detail-description">' +
                    data[0].devol_numcont +
                    '</span>' +
                    '</td>' +
                    '<td class="cell-detail">' +
                    '<span>Tipo Contenedor</span>' +
                    '<span class="cell-detail-description">' +
                    data[0].devol_tipocont +
                    '</span>' +
                    '</td>' +
                    '<td class="cell-detail">' +
                    '<span>Municipio Devolución</span>' +
                    '<span class="cell-detail-description">' +
                    data[0].devol_municipio +
                    '</span>' +
                    '</td>' +
                    '<td class="cell-detail">' +
                    '<span>Dirección Devolución</span>' +
                    '<span class="cell-detail-description">' +
                    data[0].devol_direccion +
                    '</span>' +
                    '</td>' +
                    '<td class="cell-detail">' +
                    '<span>Fecha Comodato</span>' +
                    '<span class="cell-detail-description">' +
                    data[0].devol_comodato +
                    '</span>' +
                    '</td>' +
                    '</tr>',
                  );
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });

            var consulta_solciitud2 = {
              cotizar: num_cotizacion,
              solicitud: solicitud_servicio,
              // action: 'consulta_remitente',
            };

            $.ajax({
              url: $('#base_url').val() + 'serviciocliente/Consultar_Remitente',
              type: 'POST',
              data: consulta_solciitud2,
              dataType: 'json',
              success: function (data) {
                if (data) {
                  data.resultado.forEach(function (element, index) {
                    var observa = '';

                    if (element.observacion != '') {
                      observa = element.observacion;
                    } else {
                      observa = 'No hay observación';
                    }

                    $('#contener_remitente').append(
                      '<div class="panel panel-default panel-contrast">' +
                      '<div class="panel-heading">' +
                      '<span><u>' +
                      element.nombre +
                      '</u></span>' +
                      '<span class="panel-subtitle">' +
                      '<p>' +
                      element.fecha_estimada_entrega +
                      ' ' +
                      element.hora_estimada +
                      '   ' +
                      element.direccion_entrega +
                      '(' +
                      element.municipio +
                      ')' +
                      '   ' +
                      element.telefono +
                      '  ' +
                      observa +
                      '</p>' +
                      '</span>' +
                      '</div>' +
                      '<div class="panel-body panel-body-contrast">' +
                      '<span><strong>Destinatarios</strong></span>' +
                      '<div id="destinatario' +
                      element.id +
                      '" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 destinatari"></div>' +
                      '</div></div>',
                    );
                  });
                }

                if (data.resultado2 != '') {
                  data.resultado2.forEach(function (element, index) {
                    $('#destinatario' + element.remitente).append(
                      '<hr/><div class="panel-body">' +
                      '<p>Destinatario: ' +
                      element.nombre +
                      '  ' +
                      'Dirección: ' +
                      element.direccion_entrega +
                      '  ' +
                      'Municipio: ' +
                      element.municipio +
                      ' ' +
                      'Fecha Hora: ' +
                      element.fecha_estimada_entrega +
                      ' ' +
                      element.hora_estimada +
                      '  ' +
                      'Peso descargar: ' +
                      element.peso +
                      '  ' +
                      'Teléfono: ' +
                      element.telefono +
                      '</p>' +
                      '</div>',
                    );
                  });
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });
          });

          //CONSULTA DATOS DE SOLICITUD DE SERVICIO
          $('#btn_servicio' + cont + '').click(function () {
            var idcotizar = $(this).attr('data-id');
            var origen = $(this).attr('data-id2');
            var destino = $(this).attr('data-id3');
            var peso = $(this).attr('data-id4');
            var veh = $(this).attr('data-id5');
            var cliente = $(this).attr('data-id6');
            var flete = $(this).attr('data-id7');
            var item = $(this).attr('data-id8');
            var carga = $(this).attr('data-id9');
            var trans = $(this).attr('data-id10');
            var cant_pedida = $(this).attr('data-id11');
            var cant_gasta = $(this).attr('data-id12');
            var idcliente = $(this).attr('data-id13');
            var tipo_transporte = $(this).attr('data-id14');

            $('#titulo_ss').html('<p>Cotización: ' + idcotizar + ' item: ' + item + '</p>');
            $('#cliente').val(cliente);
            $('#id_cliente_ss').val(idcliente);
            $('#origen').val(origen);
            $('#destino').val(destino);
            $('#pesoneto').val(peso);
            $('#cant_vehiculo').val(cant_pedida);
            $('#cant_disponible').val(cant_gasta);
            $('#ncotizar').val(idcotizar);
            $('#tipo_vehiculo').val(veh);
            $('#cliente').val(cliente);
            $('#flete').val(flete);
            $('#pareja').val(parejita);
            $('#item').val(item);
            $('#tip_transport').val(tipo_transporte);

            //consulta datos de cabecera
            var consulta_solicitud = {
              cotizar: idcotizar,
              item: item,
              // action: 'consulta_servicio',
            };

            $.ajax({
              url: $('#base_url').val() + 'serviciocliente/Consulta_servicio',
              type: 'POST',
              data: consulta_solicitud,
              dataType: 'json',
              success: function (data) {
                if (data) {
                  $('#ss_tabledatos').html(
                    '<tr><td class="cell-detail">' +
                    '<span>Cliente:</span>' +
                    '<span class="cell-detail-description">' +
                    cliente +
                    '</span>' +
                    '</td><td class="cell-detail">' +
                    '<span>Origen - Destino:</span>' +
                    '<span class="cell-detail-description">' +
                    data[0].origi +
                    '</span>' +
                    '<span class="cell-detail-description">' +
                    data[0].desti +
                    '</span>' +
                    '</td>' +
                    '<td class="cell-detail">' +
                    '<span>Tipo Vehículo:</span>' +
                    '<span class="cell-detail-description">' +
                    data[0].nombre +
                    '</span>' +
                    '</td>' +
                    '<td class="cell-detail">' +
                    '<span> Peso Neto:</span>' +
                    '<span class="cell-detail-description">' +
                    peso +
                    '</span>' +
                    '</td>' +
                    '<td class="cell-detail">' +
                    '<span> Flete:</span>' +
                    '<span class="cell-detail-description">' +
                    flete +
                    '</span>' +
                    '</td>' +
                    '<td class="cell-detail">' +
                    '<span> Cant. Vehículo:</span>' +
                    '<span class="cell-detail-description">' +
                    cant_pedida +
                    '</span>' +
                    '</td>' +
                    '</tr>',
                  );
                }
              },

              error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });
          });

          //TRAER ORIGENES Y DESTINOS
          $('#btn_modal' + cont + '').click(function () {
            var tcarga = '';
            var idcotizar = $(this).attr('data-id');
            var origen = $(this).attr('data-id2');
            var destino = $(this).attr('data-id3');
            var peso = $(this).attr('data-id4');
            var veh = $(this).attr('data-id5');
            var cliente = $(this).attr('data-id6');
            var flete = $(this).attr('data-id7');
            var item = $(this).attr('data-id8');
            var carga = $(this).attr('data-id9');
            var trans = $(this).attr('data-id10');
            var cant_pedida = $(this).attr('data-id11');
            var cant_gasta = $(this).attr('data-id12');
            var idcliente = $(this).attr('data-id13');

            $('#cant_vehiculo').val(cant_pedida);
            $('#cant_disponible').val(cant_gasta);
            var fecha = moment().format('YYYY-MM-DD');
            var hora = moment().format('HH:mm:ss');
            //TRAER GRUPO
            var gr = {
              cliente: cliente,
              // action: 'Consultar_grupo',
            };

            $('#group').html('');
            $('#houremail').html('');

            $.ajax({
              url: $('#base_url').val() + 'serviciocliente/Consultar_grupo',
              type: 'POST',
              data: gr,
              dataType: 'json',
              success: function (data) {
                if (data.resultado != null) {
                  data.resultado.forEach(function (element, index) {
                    $('#group').append('<option value="' + element.id + '">' + element.nombre_grupo + '</option>');
                  });
                }

                if (data.resultado2 != null) {
                  var c = 0;
                  data.resultado2.forEach(function (element, index) {
                    c++;
                    $('#houremail').append('<option value="' + element.id + '">' + element.nombre + ' - ' + element.hora_envio + '</option>');
                  });
                }
              },

              error: function (jqXHR, textStatus, errorThrown) {
                // console.log('no trajomunis');
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });

            //TRAER E ORIGEN Y DESTINO EN LETRA PARA ESTA

            //SOLICITUD CON SU NUMERO DE COTIZACION
            var municipiostable = {
              origes: origen,
              destinos: destino,
              cotizar: idcotizar,
              // action: 'municipiostable',
            };

            $.ajax({
              url: $('#base_url').val() + 'serviciocliente/Municipio_Table',
              type: 'POST',
              data: municipiostable,
              dataType: 'json',
              success: function (data) {
                data.origen.forEach(function (element, index) {
                  $('#orisoli').html(element.origi);
                });

                data.destino.forEach(function (element, index) {
                  $('#destisoli').html(element.desti);
                });
              },

              error: function (jqXHR, textStatus, errorThrown) {
                // console.log('no trajomunis');
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });

            var vehiculo = {
              veh: veh,
              // action: 'vehiculo_solservi',
            };

            $.ajax({
              url: $('#base_url').val() + 'serviciocliente/Vehiculo_Servicio',
              type: 'POST',
              data: vehiculo,
              dataType: 'json',
              success: function (data) {
                $('#tipo_vvisible').val(data.nombre);
              },
              error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });

            $('#tb_trazabilidad').html('<tr>' + '<td>' + idcotizar + '</td>' + '<td>' + fecha + '</td>' + '<td>' + hora + '</td>' + '<td>' + parejita + '</td>' + '<td>' + item + '</td>' + '</tr>');

            if (carga == 'G') {
              tcarga = 'General';
            }

            if (carga == 'C') {
              tcarga = 'Contenedor Cargado';
            }

            if (carga == 'P') {
              tcarga = 'Paqueteo';
            }

            if (carga == 'V') {
              tcarga = 'Contenedor Vacío';
            }

            $('#ncotizar').val(idcotizar);
            $('#fecha_sistem').val(fecha);
            $('#hora_sistem').val(hora);
            $('#origen').val(origen);
            $('#destino').val(destino);
            $('#peso').val(peso);
            $('#tipo_vehiculo').val(veh);
            $('#cliente').val(cliente);
            $('#flete').val(flete);
            $('#pareja').val(parejita);
            $('#item').val(item);
            $('#cont_carga').val(tcarga);
            $('#cont_transporte').val(trans);
            $('#id_cliente_ss').val(idcliente);

            if (carga == 'C' || carga == 'V') {
              //alert('habilitar');
              $('#cnt_opcion').html('<option value="1">Si</option><option value="0">No</option>');
              $('#cnt_opcion').attr('disabled', false);
              $('#cnt_tipocon').attr('disabled', false);
              $('#cnt_num').attr('disabled', false);
              $('#cnt_dias').attr('disabled', false);
              $('#cnt_municipio').prop('disabled', false);
              $('#cnt_direccion').prop('disabled', false);
              $('#cnt_fcomodato').prop('disabled', false);
              $('#cnt_peso').prop('disbaled', false);
            } else {
              //alert('deshabilitar');
              $('#cnt_opcion').html('<option value="0">No</option>');
              $('#cnt_opcion').attr('disabled', true);
              $('#cnt_tipocon').attr('disabled', true);
              $('#cnt_num').attr('disabled', true);
              $('#cnt_dias').prop('disabled', true);
              $('#cnt_municipio').prop('disabled', true);
              $('#cnt_direccion').prop('disabled', true);
              $('#cnt_fcomodato').prop('disabled', true);
              $('#cnt_peso').prop('disabled', true);
            }
          });

          $('#btn_nuevo' + cont + '').click(function () {
            var idcotizar = $(this).attr('data-id');
            var parejita = $(this).attr('data-id2');
            var idsolicitud = $(this).attr('data-id3');
            var status = {
              idcotizar: idcotizar,
              idpareja: parejita,
              idsolicitud: idsolicitud,
              // action: 'consulte_movimientos',
            };

            $('#movimientos_status').html('');
            $.ajax({
              url: $('#base_url').val() + 'serviciocliente/Consultar_Movimientos',
              type: 'POST',
              data: status,
              dataType: 'json',
              success: function (data) {
                if (data) {
                  data.resultado.forEach(function (element, index) {
                    $('#movimientos_status').append(
                      '<tr><td>' +
                      idsolicitud +
                      '</td>' +
                      '<td style="white-space: nowrap;" class="text-center">' +
                      element.n_cotizacion +
                      '</td>' +
                      '<td style="white-space: nowrap;" class="text-center">' +
                      element.item +
                      '</td>' +
                      '<td style="white-space: nowrap;" class="text-center">' +
                      element.pareja +
                      '</td>' +
                      '<td style="white-space: nowrap;" class="text-center">' +
                      element.fecha +
                      '</td>' +
                      '<td style="white-space: nowrap;" class="text-center">' +
                      element.hora +
                      '</td>' +
                      '<td style="white-space: nowrap;" class="text-center">' +
                      element.usuario_auditor +
                      '</td>' +
                      '<td style="white-space: nowrap;" class="text-center">' +
                      element.estado +
                      '</td>' +
                      '<td style="white-space: nowrap;" class="text-center">' +
                      element.proceso +
                      '</td>' +
                      '</tr>',
                    );
                  });

                  if (data.resultado2) {
                    // movimientos de operaciones
                    data.resultado2.forEach(function (element, index) {
                      $('#movimientos_status').append(
                        '<tr><td>Operaciones</td>' +
                        '<td>' +
                        element.fecha +
                        '</td>' +
                        '<td>' +
                        element.hora +
                        '</td>' +
                        '<td>' +
                        element.usuario_auditor +
                        '</td>' +
                        '<td>' +
                        element.estado +
                        '</td>' +
                        '</tr>',
                      );
                    });
                  }
                }
              },

              error: function (jqXHR, textStatus, errorThrown) {
                console.log('error');
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });

            var status_cot = {
              ncotizar: idcotizar,
              // action: 'historico_cotizacion',
            };

            $('#movimientos_cotizacion').html('');

            $.ajax({
              url: $('#base_url').val() + 'serviciocliente/Historico_Cotizaciones',
              type: 'POST',
              data: status_cot,
              dataType: 'json',
              success: function (data) {
                if (data.resultado) {
                  $('#th1').show();
                  data.resultado.forEach(function (element, index) {
                    var nomenclatura = element.estado;

                    if (nomenclatura == 'F1') {
                      var estado = 'F1-Realizada';
                      var status = '<td class="text-success">' + '<center>' + '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Realizada" ></span>' + '</center>' + '</td>';
                    }

                    if (nomenclatura == 'F2') {
                      var estado = 'F2-Entregada';
                      var status = '<td class="text-success">' + '<center>' + '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Entregada"></span>' + '</center>' + '</td>';
                    }

                    if (nomenclatura == 'F3') {
                      var estado = 'F3-Ganada';
                      var status = '<td class="text-success">' + '<center>' + '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Ganada"></span>' + '</center>' + '</td>';
                    }

                    if (nomenclatura == 'F4') {
                      var estado = 'F4-Perdida';
                      var status = '<td class="text-success">' + '<center>' + '<span class="mdi mdi-dot-circle icon" data-toggle="tooltip" title="Pérdida"  ></span>' + '</center>' + '</td>';
                    }

                    if (nomenclatura == 'F5') {
                      var estado = 'F5-Cancelada';
                      var status = '<td class="text-success">' + '<center>' + '<span class="mdi mdi-dot-circle icon" data-toggle="tooltip" title="Cancelada" ></span>' + '</center>' + '</td>';
                    }

                    $('#movimientos_cotizacion').append(
                      '<tr>' +
                      status +
                      '<td style="white-space: nowrap;" class="text-center">' +
                      element.n_cotizacion +
                      '</td>' +
                      '<td style="white-space: nowrap;" class="text-center">' +
                      element.item +
                      '</td>' +
                      '<td style="white-space: nowrap;" class="text-center">' +
                      element.pareja +
                      '</td>' +
                      '<td style="white-space: nowrap;" class="text-center">' +
                      estado +
                      '</td>' +
                      '<td style="white-space: nowrap;" class="text-center">' +
                      element.fecha +
                      '</td>' +
                      '<td style="white-space: nowrap;" class="text-center">' +
                      element.hora +
                      '</td>' +
                      '<td style="white-space: nowrap;" class="text-center">' +
                      element.user_log +
                      '</td>' +
                      '<td style="white-space: nowrap;" class="text-center"> ' +
                      element.proceso +
                      '</td>' +
                      '</tr>',
                    );
                  });
                } else {
                  $('#th1').hide();
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                console.log('error');
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });
          }); //cierre del result
        });
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no solicitudes');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

/*************************************************Fin funciones de los botones*******************************************************/
var url = $('#base_url').val() + 'libs/serv_clientecotizaciones_ajax.php';
///////////////////////////////CREAR COTIZACIONES
//cantidad de vehículos para esa mercancía
function cuantitativo(cantidad, idc) {
  var msg_error = '';
  if (cantidad > 0) {
    $('#cant_carro' + idc).blur().css('background-color', 'white');
    $('#cant_gastada' + idc).val(cantidad);
  } else {
    $('#cant_carro' + idc).focus().css('background-color', 'red');
    msg_error += '<p>El campo <strong>Cantidad Vehículos ' + idc + '- datos de mercancia </strong>debe ser mayor a cero y no puede ser un número negativo.</p>';
    $('#nexos_messages_popup').html(
      '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
      msg_error +
      '</div></div>',
    );
    $('#crea_cotizacion_sercliente').animate({ scrollTop: 0 }, 600);
  }
}

// //Función para maquetear números
// function currencyMask(ele) {
//   //alert('agua bendita');
//   var elemento = $(ele);
//   elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
// }

// function currencyMask2(elemento) {
//   elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
// }

// //cambiar valor del peso neto total
// function cambio_valor(elem, id2) {
//   var elemento = $(elem);
//   t = elemento.val();
//   var tonelada = 1000;
//   var multi = t / tonelada;
//   $('#pesobruto_cliente' + id2).val(multi);
//   elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   //maquetear peso bruto Tn
//   $('#pesobruto_cliente' + id2).val(parseFloat($('#pesobruto_cliente' + id2).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
// }

// //cambiar valor del peso neto
// function CambioNeto(elem, id2) {
//   var elemento = $(elem);
//   t = elemento.val();
//   elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
// }

// //cambiar valor del volumen total
// function volumen_total(elem, ida) {
//   // a = valor del ancho
//   //ida = id del campo
//   var elemento = $(elem);
//   var to, go, cho;
//   var alto = $('#alto_cliente' + ida).val().replace(/,/g, '');
//   var largo = $('#largo_cliente' + ida).val().replace(/,/g, '');
//   var ancho = elemento.val().replace(/,/g, '');
//   to = alto / 100;
//   go = largo / 100;
//   cho = ancho / 100;
//   if (alto != '' && largo != '') {
//     var operar = go * cho * to;
//     $('#volumen_cliente' + ida).val(operar);
//     //maquetar ancho
//     elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//     //maquetar volumen
//     $('#volumen_cliente' + ida).val(parseFloat($('#volumen_cliente' + ida).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   }
// }

//onchange="total_especial_valor(this.value,this.id);"
function total_especial_valor(v, id) {
  //onchange del campo
  var variable = 0;
  if ($('#total_servespecial' + id).val() > 0) {
    variable = $('#total_servespecial' + id).val();
  } else {
    variable = 0;
  }
  var can = $('#cantidad_servespecial' + id).val();
  var uni = v;
  var unii = parseFloat(uni);
  var operacion = unii * can;
  $('#total_servespecial' + id).val(operacion);
  var m = $('#total_servespecial' + id).val();
  total_especial(m, variable);
}

//total servicio especial
function total_especial(m, variable) {
  var a = m;
  var sum = 0;
  sum = parseFloat($('#Tservicio_especial').val());
  $('#Tservicio_especial').val(parseFloat(a) + parseFloat(sum) - parseFloat(variable));
}

//CALCULAR UTILIDAD datos mercancia
//servicios especiales
function utilidade(id) {
  var resta, calculo, res;
  //alert(valor);
  //calcular tarifa total
  var valord = $('#tarifauni' + id).val().replace(/,/g, '');
  var valor = $('#tarifauni' + id).val();
  $('#tarifauni' + id).val(parseFloat($('#tarifauni' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  var cant = $('#cantidad_servespecial' + id).val().replace(/,/g, '');
  //alert(cant);
  var oper = parseFloat(valor) * cant;
  var tarifa = $('#taries' + id).val(oper);
  $('#taries' + id).val(parseFloat($('#taries' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //calcular utilidad
  var f = $('#total_servespecial' + id).val().replace(/,/g, '');
  resta = parseFloat(oper) - parseFloat(f);
  calculo = parseFloat(resta) / parseFloat(oper);
  res = parseFloat(calculo) * 100;
  res = res.toFixed(2);
  $('#utiles' + id).val(res);
  $('#utiles' + id).val(parseFloat($('#utiles' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //calcular rentabilidad
  var re = parseFloat(oper) - parseFloat(f);
  $('#rente' + id).val(re);
  $('#rente' + id).val(parseFloat($('#rente' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //sumar las tarifas especiales
  recalcula_cifras();

  var bb = $('#Ttarifa_especial').val().replace(/,/g, '');
  var y = parseFloat(oper) + parseFloat(bb);
  $('#Ttarifa_especial').val(y);
  $('#Ttarifa_especial').val(parseFloat($('#Ttarifa_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  var i;
  var vartar;
  var sum = 0;
  for (i = 1; i <= contador_global2; i++) {
    vartar = 0;
    vartar = $('#taries' + i).val().replace(/,/g, '');
    sum = parseFloat(sum) + parseFloat(vartar);
  }
  $('#Ttarifa_especial').val(sum);
  var vtes = $('#Ttarifa_especial').val().replace(/,/g, '');
  var vces = $('#Tcosto_especial').val().replace(/,/g, '');
  var vtem = parseFloat(vtes) - parseFloat(vces);
  var vutl = parseFloat(vtem) / parseFloat(vtes) * 100;
  vutl = vutl.toFixed(2);
  $('#Tutilidad_especial').val(vutl);
  var rtot = parseFloat(vtes) - parseFloat(vces);
  $('#Trenta_especial').val(rtot);
  $('#Trenta_especial').val(parseFloat($('#Trenta_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //total cotizacion
  var tser = $('#Tservicio_transporte').val().replace(/,/g, '');
  var tesp = $('#Ttarifa_especial').val().replace(/,/g, '');
  var totcot = parseFloat(tser) + parseFloat(tesp);
  $('#Ttotal_cotizacion').val(totcot);
  $('#Ttotal_cotizacion').val(parseFloat($('#Ttotal_cotizacion').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Ttarifa_especial').val(parseFloat($('#Ttarifa_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
}

//cambio total tarifa según utilidad
function tarifa(u, id) {
  var variable = 0;
  if ($('#totaltarifa_cliente' + id).val() > 0) {
    variable = $('#totaltarifa_cliente' + id).val();
  } else {
    variable = 0;
  }
  let flete = $('#flete' + id).val();
  let util = u;
  let operacion = flete / 100 * util;
  let total = parseFloat(flete) + parseFloat(operacion);
  //enviar valor a tarifa y a total de servicio de mercancia
  $('#totaltarifa_cliente' + id).val(total);
  var m = $('#totaltarifa_cliente' + id).val();
  total_servicio_transporte(m, variable);
}

//total servicio transporte
function total_servicio_transporte(m, variable) {
  var a = m;
  var sum = 0;
  sum = parseFloat($('#Tservicio_transporte').val());
  // alert('transporte'+a);
  $('#Tservicio_transporte').val(parseFloat(a) + parseFloat(sum) - parseFloat(variable));
}

// JS
// function verVehiculo(element) {
//   // alert('llevar los datos');
//   var elemento = $(element);

//   // Recolección de datos
//   var id = elemento.data('id');
//   var digito = elemento.data('id2');
//   var telefono = elemento.data('id3');
//   var nombre = elemento.data('id4');
//   var dire = elemento.data('id5');
//   var idcliente = elemento.data('id6');
//   var correo = elemento.data('id7');
//   var tipo_documento = elemento.data('id8');
//   var regimen = elemento.data('id9');
//   var empresa_id = elemento.data('id10');
//   // **CAPACIDAD DE ENDEUDAMIENTO (id11 en tu código original, corregido aquí)**
//   var capacidad = parseFloat(elemento.data('id11') || 0); // Lo asumo como ID11
//   // **CARTERA (id12)**
//   var cartera = parseFloat(elemento.data('id12') || 0);

//   // ----------------------------------------------------------------------
//   // 🛑 VALIDACIÓN REQUERIDA: Cartera vs Capacidad de Endeudamiento
//   // ----------------------------------------------------------------------
//   if (capacidad !== 0 && cartera > capacidad) {
//     // La cartera supera la capacidad de endeudamiento.
//     var mensaje = "⚠️ ALERTA DE CRÉDITO ⚠️\n";
//     mensaje += "La Cartera actual del cliente (" + cartera.toFixed(2) + ") ";
//     mensaje += "supera su Capacidad de Endeudamiento (" + capacidad.toFixed(2) + ").";
//     mensaje += "\nConsulte con el área de Crédito y Cartera antes de proceder.";

//     alert(mensaje);
//     // Opcional: Podrías detener la ejecución aquí si el riesgo es alto:
//     // return; 
//   }
//   // ----------------------------------------------------------------------

//   // Asignación de valores (se ejecuta sin importar la alerta)
//   $('#cargar_cliente').val(nombre);
//   $('.nombre').html(nombre);
//   $('#nombre_clientes').val(nombre);
//   $('#nit_empresa').val(id);
//   $('#documento').val(id + '-' + digito);
//   $('#digito_verificacion').val(digito);
//   $('#telefono_cliente').val(telefono);
//   $('.telefono').html(telefono);
//   $('#direccion_cliente').val(dire);
//   $('.ubicacion').html(dire);
//   $('#correo').val(correo);
//   $('#tipo_documento').val(tipo_documento + ' - ' + regimen);
//   $('#id_cliente_cot').val(idcliente);
//   $('#id_cliente_seleccionado').val(idcliente);
//   $('#Nacional').attr('checked', false);
//   $('#Internacional').attr('checked', false);
//   $('#Almacenamiento').attr('checked', false);
//   $('#staticBackdrop').modal('hide');
//   $('#cliente2').html(nombre);
//   $('.linea_negocicito').show();
//   //Asgignar id de empresa seleccionada al cliente
//   $('#empresa_seleccionada_id').val(empresa_id);
//   /* Grupos y horas de envio de correos */
//   $('#group').html(''); // Limpia el select #group
//   $('#houremail').html(''); // Limpia el select #houremail

//   $.ajax({
//     url: $('#base_url').val() + 'serviciocliente/Consultar_grupo',
//     type: 'POST',
//     data: { cliente: document.getElementById("nombre_clientes").value },
//     dataType: 'json',
//     success: function (data) {
//       if (data.resultado != null) {
//         // Itera sobre los datos de "resultado" y agrega opciones al select #group
//         data.resultado.forEach(function (element, index) {
//           $('#group').append('<option value="' + element.id + '">' + element.nombre_grupo + '</option>');
//         });
//       }

//       if (data.resultado2 != null) {
//         // Itera sobre los datos de "resultado2" y agrega opciones al select #houremail
//         data.resultado2.forEach(function (element, index) {
//           $('#houremail').append('<option value="' + element.id + '">' + element.nombre + ' - ' + element.hora_envio + '</option>');
//         });
//       }
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

// JS
/* function verVehiculo(element) {
  // alert('llevar los datos');
  var elemento = $(element);

  // Recolección de datos
  var id = elemento.data('id');
  var digito = elemento.data('id2');
  var telefono = elemento.data('id3');
  var nombre = elemento.data('id4');
  var dire = elemento.data('id5');
  var idcliente = elemento.data('id6');
  var correo = elemento.data('id7');
  var tipo_documento = elemento.data('id8');
  var regimen = elemento.data('id9');
  var empresa_id = elemento.data('id10');
  // **CAPACIDAD DE ENDEUDAMIENTO (id11 en tu código original, corregido aquí)**
  var capacidad = parseFloat(elemento.data('id11') || 0); // Lo asumo como ID11
  // **CARTERA (id12)**
  var cartera = parseFloat(elemento.data('id12') || 0);

  // ----------------------------------------------------------------------
  // 🛑 VALIDACIÓN REQUERIDA: Cartera vs Capacidad de Endeudamiento
  // ----------------------------------------------------------------------
  // if (capacidad === 0 && cartera > capacidad) {
  //   // La cartera supera la capacidad de endeudamiento.
  //   var mensaje = "⚠️ ALERTA DE CRÉDITO ⚠️\n";
  //   mensaje += "La Cartera actual del cliente (" + cartera.toFixed(2) + ") ";
  //   mensaje += "supera su Capacidad de Endeudamiento (" + capacidad.toFixed(2) + ").";
  //   mensaje += "\nConsulte con el área de Crédito y Cartera antes de proceder.";

  //   alert(mensaje);
  //   // Opcional: Podrías detener la ejecución aquí si el riesgo es alto:
  //   return;
  // }

  // JS (Fragmento de la función verVehiculo)

  // if (capacidad === 0 && cartera > capacidad) {
  if (capacidad !== 0 && cartera > capacidad) {
    // La cartera supera la capacidad de endeudamiento.

    // Crear el mensaje formateado para el contenido HTML de SweetAlert
    var mensajeHTML = "La Cartera actual del cliente " +
      "**(" + cartera.toFixed(2) + ")** " +
      "supera su Capacidad de Endeudamiento " +
      "**(" + capacidad.toFixed(2) + ")**.";

    Swal.fire({
      title: '⚠️ ALERTA DE CRÉDITO ⚠️',
      html: mensajeHTML,
      icon: 'warning', // Icono de advertencia
      confirmButtonText: 'Entendido',
      focusConfirm: true,
      // Configuración adicional para enfatizar la gravedad
      customClass: {
        title: 'text-danger', // Opcional: clase CSS para el título en rojo
        confirmButton: 'btn btn-warning' // Opcional: clase para el botón
      }
    }).then((result) => {
      // Opcional: Si necesitas ejecutar código después de que el usuario presione 'Entendido'
      // console.log("Usuario reconoció la alerta de crédito.");
    });

    // Opcional: Si quieres detener el proceso (y la llamada AJAX posterior), 
    // descomenta el 'return' aquí:
    return;
  }

  // ----------------------------------------------------------------------

  // Asignación de valores (se ejecuta sin importar la alerta)
  $('#cargar_cliente').val(nombre);
  $('.nombre').html(nombre);
  $('#nombre_clientes').val(nombre);
  $('#nit_empresa').val(id);
  $('#documento').val(id + '-' + digito);
  $('#digito_verificacion').val(digito);
  $('#telefono_cliente').val(telefono);
  $('.telefono').html(telefono);
  $('#direccion_cliente').val(dire);
  $('.ubicacion').html(dire);
  $('#correo').val(correo);
  $('#tipo_documento').val(tipo_documento + ' - ' + regimen);
  $('#id_cliente_cot').val(idcliente);
  $('#id_cliente_seleccionado').val(idcliente);
  $('#Nacional').attr('checked', false);
  $('#Internacional').attr('checked', false);
  $('#Almacenamiento').attr('checked', false);
  $('#staticBackdrop').modal('hide');
  $('#cliente2').html(nombre);
  $('.linea_negocicito').show();
  //Asgignar id de empresa seleccionada al cliente
  $('#empresa_seleccionada_id').val(empresa_id);
  /* Grupos y horas de envio de correos 
  $('#group').html(''); // Limpia el select #group
  $('#houremail').html(''); // Limpia el select #houremail

  $.ajax({
    url: $('#base_url').val() + 'serviciocliente/Consultar_grupo',
    type: 'POST',
    data: { cliente: document.getElementById("nombre_clientes").value },
    dataType: 'json',
    success: function (data) {
      if (data.resultado != null) {
        // Itera sobre los datos de "resultado" y agrega opciones al select #group
        data.resultado.forEach(function (element, index) {
          $('#group').append('<option value="' + element.id + '">' + element.nombre_grupo + '</option>');
        });
      }

      if (data.resultado2 != null) {
        // Itera sobre los datos de "resultado2" y agrega opciones al select #houremail
        data.resultado2.forEach(function (element, index) {
          $('#houremail').append('<option value="' + element.id + '">' + element.nombre + ' - ' + element.hora_envio + '</option>');
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
} */

//crear datos de mercancia
// var cont = 0;
// var contador_global1 = 0;
// function agregar() {
//   cont++;
//   contador_global1 = contador_global1 + 1;
//   if (ID === '5' && VEHICULO === 1 && REMITENTE === 1 && DESTINATARIO === 1 && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso' ||
//     ID === '6' && VEHICULO === 1 && REMITENTE === 1 && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso' ||
//     ID === '7' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === 1 && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso' ||
//     ID === '8' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso' ||
//     ID === '10' && VEHICULO === '+1' && REMITENTE === 1 && DESTINATARIO === 1 && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Consolidado' ||
//     ID === '11' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Consolidado') {
//     //TRAER LOS DATOS , municipios, tipos vehiculo

//     /* Tipo Mecancia */
//     if (cont !== 1) { btn_elimina = `<a class="fw-bold fs-9 text-decoration-none elimina text-center" id="elimina${cont}" href="#!" tooltip="Eliminar bloque${cont}" onclick="Elimina_Mercancia(this.id,${cont})" style="width: 40%;"><i class="far fa-trash-alt text-black"></i> Eliminar</a>`; linea = ` <hr class="my-1 text-dark"> `; }

//     if ($("#origen_cliente1").val() === "" && $("#destino_cliente1").val() === "") {
//       Swal.fire({
//         position: "top-end",
//         icon: "warning",
//         html: "Por favor debe seleccionar un <strong>Origen y Destino</strong> para agregar un nuevo bloque de mercancias",
//         showConfirmButton: false,
//         timer: 1500
//       });
//       cont--; // Resta 1 a cont
//       contador_global1--; // Resta 1 a contador_global1
//       return;
//     } else {
//       Mercancias(cont);
//       //TABLA MERCANCIA 1
//       const origen = `
//       <select id="origen_cliente${cont}" 
//               class="form-select form-select-sm select2-sm originario" 
//               onchange="lugares(${cont}); Agrega_Remitente(document.getElementById('id_cliente_seleccionado').value, this.value);" 
//               style="width: 100%;">
//           <option value="" readonly>Seleccione</option>
//       </select>`;

//       const destino = `
//       <select id="destino_cliente${cont}" 
//               class="form-select form-select-sm destinar select2-sm" 
//               onchange="lugares(${cont}); Agrega_Destinatariob('',document.getElementById('id_cliente_seleccionado').value, this.value, ${cont});" 
//               style="width: 100%;">
//           <option value="" readonly="readonly">Seleccione</option>
//       </select>`;

//       // Lógica para generar los selects dinámicos
//       var mercancia = `<select id="tipo_mercancia${cont}" class="tmerca form-select form-select-sm select2-sm" style="width: 100%;" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
//                         <option value="">Seleccione</option>
//                       </select>`;

//       var tipo_empaque = '<select style="width: 100%;" id="tipo_empaque' + cont + '" class="form-select form-select-sm select2-sm empaquemer">' + '<option value="">Seleccione</option>' + '</select>';
//       //boton de eliminar
//       var btn_elimina = '';
//       var linea = '';
//       //contador de la fila
//       var htmlTags = `
//           <div class="row tr${cont}">
//                 <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
//                   ${linea}
//                     <div class="d-flex flex-wrap justify-content-start" style="color:#fff;">
//                       <div class="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 col-xxl-10 d-flex align-items-center">
//                         <h6 class="mb-0 text-body-highlight me-2">Bloque de mercancia N° ${cont}</h6>
//                       </div>
//                       <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2 d-flex justify-content-end">
//                         ${btn_elimina}
//                         <input type="hidden" class="form-control input-xs item_merca" readonly="readonly" value="${cont}">
//                       </div>
//                     </div>
//                   <hr class="my-1 text-dark">
//                 </div>

//                 <div  class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                   <div class="mb-1">
//                     <label style="font-size: 12px;">Servicio ITR&nbsp;<span style="color:blue;"><i>(*)</i></span></label> 
//                       <select id="itr${cont}" style="width: 100%;color:#000;" class="form-select form-select-sm itr" Onchange="Validar_operacion_itr(${cont})">
//                         <option value="" readonly="readonly">Seleccione</option>
//                         <option value="Si">Si</option>
//                         <option value="No" selected>No</option>
//                       </select>
//                     </div>
//                 </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Mercancía</label> 
//                   ${mercancia}
//                   <input type="hidden" class="form-control idproducto" id="codmercancia${cont}" readonly="readonly">
//                   <input type="hidden" class="form-control rndcproducto" id="rndcmercancia${cont}" readonly="readonly">
//                   </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Naturaleza</label> 
//                     <select style="width: 100%;" id="natu${cont}" readonly="readonly" class="form-select form-select-sm natumer"></select>
//                   </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Valor Declarado</label> 
//                     <input type="text" id="valor_mercancia${cont}" style="width: 100%;" class="form-control form-control-sm valor_merca" min="0" onChange="javascript:currencyMask(this)">
//                   </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Tipo Servicio</label> 
//                   <select id="servicio_cliente${cont}" style="width: 100%;" class="form-select form-select-sm ts" ${ID === '5' || ID === '6' || ID === '7' || ID === '8' ? 'disabled' : ''}>
//                     <option value="" readonly="readonly">Seleccione</option>
//                     <option value="Expreso"${ID === '5' || ID === '6' || ID === '7' || ID === '8' ? 'selected' : ''}>Expreso - Viaje</option>
//                     <option value="Consolidado">Consolidado - Tonelada</option>
//                   </select>
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Tipo Empaque</label> 
//                     ${tipo_empaque}
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Tipo Operación</label> 
//                     <select style="width: 100%;" id="tipo${cont}" class="form-select form-select-sm operamer">
//                       <option value="">Seleccione</option>
//                       <option value="G">General</option>
//                       <option value="P">Paqueteo</option>
//                       <option value="C">Contenedor Cargado</option>
//                       <option value="V">Contenedor Vacío</option>
//                     </select>
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Tipo Transporte</label> 
//                   <select style="width: 100%;" id="tipotr${cont}" class="form-select form-select-sm ttransportemer">
//                     <option value="">Seleccione</option>
//                     <option value="Importacion">Importación</option>
//                     <option value="Exportacion">Exportación</option>
//                     <option value="Nacional">Nacional</option>
//                     <option value="Urbano">Urbano</option>
//                   </select>
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Origen</label> 
//                   ${origen}
//                     <input type="hidden" id="cant_carro${cont}" class="form-control form-control-sm cantvehi" min="1" style="width:100%;" value="1"  onchange="cuantitativo(this.value,${cont})" readonly>
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Destino</label> 
//                   ${destino}
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Tipo Vehículo</label> 
//                   <!--<select id="vehiculo_cliente${cont}" readonly="readonly" style="width:100%;" class="form-select form-select-sm tipovehiculo" onChange="javascript:obtenerflete(this.value,${cont},${contador_global1});"></select>-->
//                   <select id="vehiculo_cliente${cont}" readonly="readonly" style="width:100%;" class="form-select form-select-sm tipovehiculo"></select>
//                 </div>
//               </div>

//               <!-- Cantidad de vehiculos para la operacióm -->
//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Cantidad Vehículo</label> 
//                   <input type="number" id="cant_vehiculo${cont}" class="form-control form-control-sm cantvehiculo" min="1" style="width:100%;" value="${ID === '5' || ID === '6' | ID === '7' | ID === '8' ? 1 : ''}" ${ID === '5' || ID === '6' | ID === '7' | ID === '8' ? 'disabled' : ''}>
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Peso Bruto(Kg)</label> 
//                   <input type="text" id="peso_client1${cont}" class="form-control form-control-sm pesobruto" min="0" style="width:100%;" onChange="javascript:cambio_valor(this,${cont});">
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Peso Neto(Kg)</label> 
//                   <input type="text" class="form-control form-control-sm p${cont} pnetomer" min="0" style="width:100%;" name="nombre${cont}" id="${cont}" onChange="javascript:CambioNeto(this,${cont});">
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Peso Bruto(Tn)</label> 
//                   <input type="text" class="form-control form-control-sm pesobrutoton" min="0" style="width:100%;" name="nombre${cont}" id="pesobruto_cliente${cont}" readonly>
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Cantidad(unidades)</label> 
//                   <input type="text" id="cantidad${cont}" class="form-control form-control-sm cantidadmer" min="1" style="width:100%;" onChange="javascript:currencyMask(this)">
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Alto(cm)</label> 
//                   <input type="number" id="alto_cliente${cont}" class="form-control form-control-sm altomer" style="width:100%;" min="0" value="0" onChange="javascript:currencyMask(this)">
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Largo(cm)</label> 
//                   <input type="text" id="largo_cliente${cont}"  class="form-control form-control-sm largomer" style="width:100%;" min="0" value="0" onChange="javascript:currencyMask(this)">
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Ancho(cm)</label> 
//                   <input type="text" id="${cont}" name="ancho${cont}"  class="form-control form-control-sm ancho${cont} anchomer" style="width:100%;" min="0" value="0" onChange="volumen_total(this,${cont});">
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Volumen (m3)</label> 
//                     <input type="text" id="volumen_cliente${cont}" readonly="readonly"  class="form-control form-control-sm volumenmer" style="width:100%;" value="0">
//                 </div>
//               </div>

//               <!-- Costo Flete -->
//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Costo Flete</label> 
//                     <input type="text"  id="flete${cont}" class="form-control form-control-sm fletemer" min="0" value="0"  style="width:100%;" onChange="javascript:utilidad_d(this,${cont},${contador_global1})">
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Tarifa venta</label> 
//                     <input type="text" id="totaltarifa_cliente${cont}"  class="form-control form-control-sm tarifamer"  min="0" value="0" style="width:100%;" onChange="javascript:utilidad(this,${cont},${contador_global1});" >
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Rentabilidad %</label> 
//                     <input type="text" id="${cont}"  class="form-control form-control-sm utilidad${cont} utilmer" min="0" style="width:100%;" readonly="readonly">
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Utilidad</label> 
//                     <input type="text" id="renta${cont}" class="form-control form-control-sm rentamer" style="width:100%;"  readonly="readonly">
//                 </div>
//               </div>

//               <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 tr${cont}">
//                 <div class="mb-1">
//                   <label style="font-size: 12px;">Observación</label> 
//                     <textarea id="observa${cont}" class="form-control form-control-sm observamer" style="width:100%;" rows="1"></textarea> <input type="hidden" class="identi tr${cont}" value="1"  style="width:100%;">
//                 </div>
//               </div>

//         <div class="d-flex flex-wrap justify-content-start mt-2">
//           <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
//             <h6 class="mb-0 text-body-highlight me-2">Costos Eficientes SICE TAC</h6>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 tr${cont}">
//           <hr class="my-1 text-dark">
//         </div>

//         <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Configuración de su vehículo &nbsp;<span style="color:red;"><i>(*)</i></label> 
//             <select name="configuracion_vehiculos" id="configuracion_vehiculos${cont}" class="form-control form-control-sm configuracion_vehiculo_sicetac">
//               <option selected="selected" value=""> </option>
//               <option value="2">Camión dos ejes - Sencillo PBV mas de 10500 Kg </option>
//               <option value="2_7_8">Camion dos ejes - Sencillo PBV 7500-8000 Kg </option>
//               <option value="2_8_9">Camion dos ejes - Sencillo PBV 8001-9000 Kg </option>
//               <option value="2_9_105">Camion dos ejes - Sencillo PBV 9001-10500 Kg </option>
//               <option value="2S2">Tractocamión dos ejes - Patineta - Minimula con semiremolque de dos ejes</option>
//               <option value="2S3">Tractocamión dos ejes - Patineta - Minimula con semiremolque de tres ejes</option>
//               <option value="3">Camión tres ejes - Dobletroque </option>
//               <option value="3S2">Tractocamión tres ejes - Tractomula con semiremolque de dos ejes</option>
//               <option value="3S3">Tractocamión tres ejes - Tractomula con semiremolque de tres ejes</option>
//               <option value="V2">Volqueta dos ejes - Sencillo </option>
//               <option value="V3">Volqueta tres ejes - Dobletroque </option>
//               <option value="V4">Volqueta cuatro ejes - Cuatromanos </option>
//             </select>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Unidad de Transporte &nbsp;<span style="color:red;"><i>(*)</i></label> 
//             <select name="unidadtransporte" id="unidadtransporte${cont}" class="form-select form-select-sm unidad_transporte_sicetac">
//               <option selected="selected" value=""> </option>
//               <option value="1">ESTACAS</option>
//               <option value="10">ESTIBAS</option>
//               <option value="1061">TANQUE</option>
//               <option value="2">FURGON</option>
//               <option value="231">PORTACONTENEDORES</option>
//               <option value="36">TRAYLER</option>
//               <option value="4">VOLCO</option>
//               <option value="48">PLATAFORMA</option>
//               <option value="60">FURGON REFRIGERADO</option>
//             </select>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Tipo de Carga &nbsp;<span style="color:red;"><i>(*)</i></label> 
//             <select name="tipocarga" id="tipocarga${cont}" class="form-select form-select-sm tipo_carga_sicetac">
//               <option selected="selected" value=""> </option>
//               <option value="1003">Granel líquido</option>
//               <option value="12">General</option>
//               <option value="13">Contenedor</option>
//               <option value="2">Carga Refrigerada</option>
//               <option value="5">Granel Sólido</option>
//             </select>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Costo sicetac</label>
//               <input type="text" class="typeahead form-control form-control-sm costo_sicetac" id="costo_sicetac${cont}" disabled>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-1 col-lg-1 col-xl-1 col-xxl-1 tr${cont}">
//           <div class="mt-4">
//               <button class="btn btn-subtle-secondary btn-sm me-1 px-1 py-1" id="btn-validar-sicetac${cont}" data-id="${cont}" type="button" style="width: 100%;">Validar Sicetac</button>
//           </div>
//         </div>

//           </div>`;
//       $('#table_mercancia').append(htmlTags);
//       llenaritem();
//     }
//   } else {
//     /* Tipo Mecancia */
//     Mercancias(cont);

//     // TABLA MERCANCIA 1
//     const origen = `
//     <select id="origen_cliente${cont}" 
//             class="form-select form-select-sm select2-sm originario" 
//             onchange="lugares(${cont}); Agrega_Remitente(document.getElementById('id_cliente_seleccionado').value, this.value);" 
//             style="width: 100%;">
//         <option value="" readonly="readonly">Seleccione</option>
//     </select>`;

//     const destino = `
//     <select id="destino_cliente${cont}" 
//             class="form-select form-select-sm destinar select2-sm" 
//            onchange="lugares(${cont}); Agrega_Destinatariob('',document.getElementById('id_cliente_seleccionado').value, this.value, ${cont});" 
//             style="width: 100%;">
//         <option value="" readonly="readonly">Seleccione</option>
//     </select>`;

//     // Lógica para generar los selects dinámicos
//     var mercancia = `<select id="tipo_mercancia${cont}" class="tmerca form-select form-select-sm select2-sm" style="width: 100%;" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
//                       <option value="">Seleccione</option>
//                     </select>`;

//     var tipo_empaque = '<select style="width: 100%;" id="tipo_empaque' + cont + '" class="form-select form-select-sm select2-sm empaquemer">' + '<option value="">Seleccione</option>' + '</select>';
//     //boton de eliminar
//     var btn_elimina = '';
//     var linea = '';
//     if (cont !== 1) { btn_elimina = `<a class="fw-bold fs-9 text-decoration-none elimina text-center" id="elimina${cont}" href="#!" tooltip="Eliminar bloque${cont}" onclick="Elimina_Mercancia(this.id,${cont})" style="width: 40%;"><i class="far fa-trash-alt text-black"></i> Eliminar</a>`; linea = ` <hr class="my-1 text-dark"> `; }
//     //contador de la fila
//     var htmlTags = `
//     <div class="row tr${cont}">
//           <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
//             ${linea}
//               <div class="d-flex flex-wrap justify-content-start" style="color:#fff;">
//                 <div class="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 col-xxl-10 d-flex align-items-center">
//                   <h6 class="mb-0 text-body-highlight me-2">Bloque de mercancia N° ${cont}</h6>
//                 </div>
//                 <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2 d-flex justify-content-end">
//                   ${btn_elimina}
//                   <input type="hidden" class="form-control input-xs item_merca" readonly="readonly" value="${cont}">
//                 </div>
//               </div>
//             <hr class="my-1 text-dark">
//           </div>

//           <div  class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//             <div class="mb-1">
//               <label style="font-size: 12px;">Servicio ITR&nbsp;<span style="color:blue;"><i>(*)</i></span></label> 
//                 <select id="itr${cont}" style="width: 100%;color:#000;" class="form-select form-select-sm itr" Onchange="Validar_operacion_itr(${cont})">
//                   <option value="" readonly="readonly">Seleccione</option>
//                   <option value="Si">Si</option>
//                   <option value="No" selected>No</option>
//                 </select>
//               </div>
//           </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Mercancía</label> 
//             ${mercancia}
//             <input type="hidden" class="form-control idproducto" id="codmercancia${cont}" readonly="readonly">
//             <input type="hidden" class="form-control rndcproducto" id="rndcmercancia${cont}" readonly="readonly">
//             </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Naturaleza</label> 
//               <select style="width: 100%;" id="natu${cont}" readonly="readonly" class="form-select form-select-sm natumer"></select>
//             </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Valor Declarado</label> 
//              <input type="text" id="valor_mercancia${cont}" style="width: 100%;" class="form-control form-control-sm valor_merca" min="0" onChange="javascript:currencyMask(this)">
//             </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Tipo Servicio</label> 
//             <select id="servicio_cliente${cont}" style="width: 100%;" class="form-select form-select-sm ts">
//               <option value="" readonly="readonly">Seleccione</option>
//               <option value="Expreso">Expreso - Viaje</option>
//               <option value="Consolidado">Consolidado - Tonelada</option>
//             </select>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Tipo Empaque</label> 
//               ${tipo_empaque}
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Tipo Operación</label> 
//               <select style="width: 100%;" id="tipo${cont}" class="form-select form-select-sm operamer">
//                 <option value="">Seleccione</option>
//                 <option value="G">General</option>
//                 <option value="P">Paqueteo</option>
//                 <option value="C">Contenedor Cargado</option>
//                 <option value="V">Contenedor Vacío</option>
//               </select>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Tipo Transporte</label> 
//             <select style="width: 100%;" id="tipotr${cont}" class="form-select form-select-sm ttransportemer">
//               <option value="">Seleccione</option>
//               <option value="Importacion">Importación</option>
//               <option value="Exportacion">Exportación</option>
//               <option value="Nacional">Nacional</option>
//               <option value="Urbano">Urbano</option>
//             </select>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Origen</label> 
//             ${origen}
//              <input type="hidden" id="cant_carro${cont}" class="form-control form-control-sm cantvehi" min="1" style="width:100%;" value="1"  onchange="cuantitativo(this.value,${cont})" readonly>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Destino</label> 
//             ${destino}
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Tipo Vehículo</label> 
//             <!--<select id="vehiculo_cliente${cont}" readonly="readonly" style="width:100%;" class="form-select form-select-sm tipovehiculo" onChange="javascript:obtenerflete(this.value,${cont},${contador_global1});"></select>-->
//             <select id="vehiculo_cliente${cont}" readonly="readonly" style="width:100%;" class="form-select form-select-sm tipovehiculo"></select>
//           </div>
//         </div>

//         <!-- Cantidad de vehiculos para la operacióm -->
//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Cantidad Vehículo</label> 
//             <input type="number" id="cant_vehiculo${cont}" class="form-control form-control-sm cantvehiculo" min="1" style="width:100%;">
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Configuración de su vehículo &nbsp;<span style="color:red;"><i>(*)</i></label> 
//             <select name="configuracion_vehiculos" id="configuracion_vehiculos${cont}" class="form-control form-control-sm configuracion_vehiculo_sicetac" onChange="javascript:obtenerflete(this.value,${cont},${contador_global1});">
//               <option selected="selected" value=""> </option>
//               <option value="2">Camión dos ejes - Sencillo PBV mas de 10500 Kg </option>
//               <option value="2_7_8">Camion dos ejes - Sencillo PBV 7500-8000 Kg </option>
//               <option value="2_8_9">Camion dos ejes - Sencillo PBV 8001-9000 Kg </option>
//               <option value="2_9_105">Camion dos ejes - Sencillo PBV 9001-10500 Kg </option>
//               <option value="2S2">Tractocamión dos ejes - Patineta - Minimula con semiremolque de dos ejes</option>
//               <option value="2S3">Tractocamión dos ejes - Patineta - Minimula con semiremolque de tres ejes</option>
//               <option value="3">Camión tres ejes - Dobletroque </option>
//               <option value="3S2">Tractocamión tres ejes - Tractomula con semiremolque de dos ejes</option>
//               <option value="3S3">Tractocamión tres ejes - Tractomula con semiremolque de tres ejes</option>
//               <option value="V2">Volqueta dos ejes - Sencillo </option>
//               <option value="V3">Volqueta tres ejes - Dobletroque </option>
//               <option value="V4">Volqueta cuatro ejes - Cuatromanos </option>
//             </select>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Unidad de Transporte &nbsp;<span style="color:red;"><i>(*)</i></label> 
//             <select name="unidadtransporte" id="unidadtransporte${cont}" class="form-select form-select-sm unidad_transporte_sicetac">
//               <option selected="selected" value=""> </option>
//               <option value="1">ESTACAS</option>
//               <option value="10">ESTIBAS</option>
//               <option value="1061">TANQUE</option>
//               <option value="2">FURGON</option>
//               <option value="231">PORTACONTENEDORES</option>
//               <option value="36">TRAYLER</option>
//               <option value="4">VOLCO</option>
//               <option value="48">PLATAFORMA</option>
//               <option value="60">FURGON REFRIGERADO</option>
//             </select>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Tipo de Carga &nbsp;<span style="color:red;"><i>(*)</i></label> 
//             <select name="tipocarga" id="tipocarga${cont}" class="form-select form-select-sm tipo_carga_sicetac">
//               <option selected="selected" value=""> </option>
//               <option value="1003">Granel líquido</option>
//               <option value="12">General</option>
//               <option value="13">Contenedor</option>
//               <option value="2">Carga Refrigerada</option>
//               <option value="5">Granel Sólido</option>
//             </select>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Costo sicetac</label>
//               <input type="text" class="typeahead form-control form-control-sm costo_sicetac" id="costo_sicetac${cont}" disabled>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-1 col-lg-1 col-xl-1 col-xxl-1 tr${cont}">
//           <div class="mt-4">
//               <button class="btn btn-subtle-secondary btn-sm me-1 px-1 py-1" id="btn-validar-sicetac${cont}" data-id="${cont}" type="button" style="width: 100%;">Validar Sicetac</button>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Peso Bruto(Kg)</label> 
//             <input type="text" id="peso_client1${cont}" class="form-control form-control-sm pesobruto" min="0" style="width:100%;"  onChange="javascript:cambio_valor(this,${cont});">
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Peso Neto(Kg)</label> 
//             <input type="text" class="form-control form-control-sm p${cont} pnetomer" min="0" style="width:100%;" name="nombre${cont}" id="${cont}" onChange="javascript:CambioNeto(this,${cont});">
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Peso Bruto(Tn)</label> 
//             <input type="text" class="form-control form-control-sm pesobrutoton" min="0" style="width:100%;" name="nombre${cont}" id="pesobruto_cliente${cont}" readonly>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Cantidad(unidades)</label> 
//             <input type="text" id="cantidad${cont}" class="form-control form-control-sm cantidadmer" min="1" style="width:100%;" onChange="javascript:currencyMask(this)">
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Alto(cm)</label> 
//             <input type="number" id="alto_cliente${cont}" class="form-control form-control-sm altomer" style="width:100%;" min="0" value="0" onChange="javascript:currencyMask(this)">
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Largo(cm)</label> 
//             <input type="text" id="largo_cliente${cont}"  class="form-control form-control-sm largomer" style="width:100%;" min="0" value="0" onChange="javascript:currencyMask(this)">
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Ancho(cm)</label> 
//             <input type="text" id="${cont}" name="ancho${cont}"  class="form-control form-control-sm ancho${cont} anchomer" style="width:100%;" min="0" value="0" onChange="volumen_total(this,${cont});">
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Volumen (m3)</label> 
//              <input type="text" id="volumen_cliente${cont}" readonly="readonly"  class="form-control form-control-sm volumenmer" style="width:100%;" value="0">
//           </div>
//         </div>

//         <!-- Costo Flete -->
//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="row">
//             <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 tr${cont}">
//               <div class="mb-1">
//                 <label style="font-size: 12px;">Costo Flete</label> 
//                   <input type="text"  id="flete${cont}" class="form-control form-control-sm fletemer" min="0" value="0"  style="width:100%;" onChange="javascript:utilidad_d(this,${cont},${contador_global1})">
//               </div>
//             </div>
//             <!-- <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 tr${cont}">
//               <div class="mb-1">
//                 <label style="font-size: 12px;">Costo Flete</label> 
//                   <input type="text"  id="flete_sicetac${cont}" class="form-control form-control-sm fletemer" min="0" value="0" disabled style="width:100%;" onChange="javascript:utilidad_d(this,${cont},${contador_global1})">
//               </div>
//             </div>-->   
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Tarifa venta</label> 
//               <input type="text" id="totaltarifa_cliente${cont}"  class="form-control form-control-sm tarifamer"  min="0" value="0" style="width:100%;" onChange="javascript:utilidad(this,${cont},${contador_global1});" >
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Rentabilidad %</label> 
//               <input type="text" id="${cont}"  class="form-control form-control-sm utilidad${cont} utilmer" min="0" style="width:100%;" readonly="readonly">
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Utilidad</label> 
//              <input type="text" id="renta${cont}" class="form-control form-control-sm rentamer" style="width:100%;"  readonly="readonly">
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Observación</label> 
//              <textarea id="observa${cont}" class="form-control form-control-sm observamer" style="width:100%;" rows="1"></textarea> <input type="hidden" class="identi tr${cont}" value="1"  style="width:100%;">
//           </div>
//         </div>

//         <!--<div class="d-flex flex-wrap justify-content-start mt-2">
//           <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
//             <h6 class="mb-0 text-body-highlight me-2">Costos Eficientes SICE TAC</h6>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 tr${cont}">
//           <hr class="my-1 text-dark">
//         </div>-->

//         <!--<div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Configuración de su vehículo &nbsp;<span style="color:red;"><i>(*)</i></label> 
//             <select name="configuracion_vehiculos" id="configuracion_vehiculos${cont}" class="form-control form-control-sm configuracion_vehiculo_sicetac">
//               <option selected="selected" value=""> </option>
//               <option value="2">Camión dos ejes - Sencillo PBV mas de 10500 Kg </option>
//               <option value="2_7_8">Camion dos ejes - Sencillo PBV 7500-8000 Kg </option>
//               <option value="2_8_9">Camion dos ejes - Sencillo PBV 8001-9000 Kg </option>
//               <option value="2_9_105">Camion dos ejes - Sencillo PBV 9001-10500 Kg </option>
//               <option value="2S2">Tractocamión dos ejes - Patineta - Minimula con semiremolque de dos ejes</option>
//               <option value="2S3">Tractocamión dos ejes - Patineta - Minimula con semiremolque de tres ejes</option>
//               <option value="3">Camión tres ejes - Dobletroque </option>
//               <option value="3S2">Tractocamión tres ejes - Tractomula con semiremolque de dos ejes</option>
//               <option value="3S3">Tractocamión tres ejes - Tractomula con semiremolque de tres ejes</option>
//               <option value="V2">Volqueta dos ejes - Sencillo </option>
//               <option value="V3">Volqueta tres ejes - Dobletroque </option>
//               <option value="V4">Volqueta cuatro ejes - Cuatromanos </option>
//             </select>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Unidad de Transporte &nbsp;<span style="color:red;"><i>(*)</i></label> 
//             <select name="unidadtransporte" id="unidadtransporte${cont}" class="form-select form-select-sm unidad_transporte_sicetac">
//               <option selected="selected" value=""> </option>
//               <option value="1">ESTACAS</option>
//               <option value="10">ESTIBAS</option>
//               <option value="1061">TANQUE</option>
//               <option value="2">FURGON</option>
//               <option value="231">PORTACONTENEDORES</option>
//               <option value="36">TRAYLER</option>
//               <option value="4">VOLCO</option>
//               <option value="48">PLATAFORMA</option>
//               <option value="60">FURGON REFRIGERADO</option>
//             </select>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Tipo de Carga &nbsp;<span style="color:red;"><i>(*)</i></label> 
//             <select name="tipocarga" id="tipocarga${cont}" class="form-select form-select-sm tipo_carga_sicetac">
//               <option selected="selected" value=""> </option>
//               <option value="1003">Granel líquido</option>
//               <option value="12">General</option>
//               <option value="13">Contenedor</option>
//               <option value="2">Carga Refrigerada</option>
//               <option value="5">Granel Sólido</option>
//             </select>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
//           <div class="mb-1">
//             <label style="font-size: 12px;">Costo sicetac</label>
//               <input type="text" class="typeahead form-control form-control-sm costo_sicetac" id="costo_sicetac${cont}" disabled>
//           </div>
//         </div>

//         <div class="col-12 col-sm-12 col-md-1 col-lg-1 col-xl-1 col-xxl-1 tr${cont}">
//           <div class="mt-4">
//               <button class="btn btn-subtle-secondary btn-sm me-1 px-1 py-1" id="btn-validar-sicetac${cont}" data-id="${cont}" type="button" style="width: 100%;">Validar Sicetac</button>
//           </div>
//         </div>-->

//     </div>`;

//     $('#table_mercancia').append(htmlTags);
//     llenaritem();
//   }
// }

// async function Mercancias(cont) {
//   // Vacía el select antes de llenarlo
//   $('#tipo_mercancia').html('');

//   try {
//     // Realiza la solicitud para obtener los datos
//     const response = await fetch($('#base_url').val() + 'serviciocliente/Tipo_Mercancia', {
//       method: 'POST',
//       dataType: 'json',
//       cache: 'no-cache',
//     });
//     const data = await response.json();

//     // Llena el select con las opciones dinámicas
//     data.forEach(function (element, index) {
//       $('#tipo_mercancia' + cont).append(
//         '<option value="' + element.nombre + '" data-id="' + element.id + '" data-id2="' + element.codigo + '">' + element.nombre + '</option>'
//       );
//     });

//     // Inicializa Select2 en el select de tipo de mercancía
//     $('#tipo_mercancia' + cont).select2({
//       placeholder: 'Seleccione una opción', // Texto del placeholder
//       allowClear: true, // Permite limpiar la selección
//     });

//     // Configura el evento change de Select2
//     $('#tipo_mercancia' + cont).on('change', function () {
//       codigo_mercancia(cont);
//     });
//   } catch (error) {
//     console.error('Error en la solicitud de tipo de mercancía:', error);
//     throw error;
//   } finally {
//     tipo_empaque(cont); // Llama a la función para llenar el tipo de empaque
//   }
// }

// async function tipo_empaque(cont) {
//   // Vacía el select antes de llenarlo
//   $('#tipo_empaque').html('');

//   try {
//     // Realiza la solicitud para obtener los datos
//     const response = await fetch($('#base_url').val() + 'serviciocliente/Tipo_Empaque', {
//       method: 'POST',
//       dataType: 'json',
//       cache: 'no-cache',
//     });
//     const data = await response.json();

//     // Llena el select con las opciones dinámicas
//     data.forEach(function (element, index) {
//       $('#tipo_empaque' + cont).append(
//         '<option value="' + element.id + '">' + element.empaque + '</option>'
//       );
//     });

//     // Inicializa Select2 en el select de tipo de empaque
//     $('#tipo_empaque' + cont).select2({
//       placeholder: 'Seleccione una opción', // Texto del placeholder
//       allowClear: true, // Permite limpiar la selección
//     });
//   } catch (error) {
//     console.error('Error en la solicitud de tipo de empaque:', error);
//     throw error;
//   } finally {
//     Municipios(cont); // Llama a la función para llenar los municipios
//   }
// }

// async function Municipios(cont) {
//   // Vaciar el contenido de los selects específicos usando el identificador dinámico
//   $('#origen_cliente').empty();
//   $('#destino_cliente').empty();

//   try {
//     const response = await fetch($('#base_url').val() + 'serviciocliente/Consulta_Municipios', {
//       method: 'POST',
//       dataType: 'json',
//       cache: 'no-cache'
//     });
//     const data = await response.json();

//     // Si se cumple cierta condición, se agregan opciones fijas
//     if (ID === '5' && VEHICULO === 1 && REMITENTE === 1 && DESTINATARIO === 1 && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso' ||
//       ID === '6' && VEHICULO === 1 && REMITENTE === 1 && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso' ||
//       ID === '7' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === 1 && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso' ||
//       ID === '8' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso' ||
//       ID === '10' && VEHICULO === '+1' && REMITENTE === 1 && DESTINATARIO === 1 && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Consolidado' ||
//       ID === '11' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Consolidado') {

//       document.querySelector(".cantvehiculo").value = 1;
//       document.querySelector(".cantvehiculo").disabled = true;
//       document.querySelector(".ts").disabled = true;
//       document.querySelector(".ts").value = 'Expreso';

//       if (ORIGEN_ARRAY.length > 0 && DESTINO_ARRAY.length > 0) {
//         // Agregar la opción ya seleccionada
//         $('#origen_cliente' + cont).append('<option value="' + ORIGEN_ARRAY[0] + '" selected>' + ORIGEN_ARRAY[1] + '-' + ORIGEN_ARRAY[2] + '</option>');
//         $('#destino_cliente' + cont).append('<option value="' + DESTINO_ARRAY[0] + '" selected>' + DESTINO_ARRAY[1] + '-' + DESTINO_ARRAY[2] + '</option>');

//         // Se inicializan otros selects de la misma forma
//         $('#origen_cliente' + cont).select2({
//           placeholder: 'Seleccione una opción',
//           allowClear: true
//         });
//         $('#destino_cliente' + cont).select2({
//           placeholder: 'Seleccione una opción',
//           allowClear: true
//         });

//         // Configuración adicional
//         document.querySelector(".cantvehiculo").value = 1;
//         document.querySelector(".cantvehiculo").disabled = true;
//       } else {
//         // Agregar opciones con los datos obtenidos
//         data.forEach(function (element) {
//           $('#origen_cliente' + cont).append('<option value="' + element.rndc_codigo_ciudad + '" data-municipio="' + element.municipio + '" data-depto="' + element.depto + '">' + element.municipio + '-' + element.depto + '</option>');
//           $('#destino_cliente' + cont).append('<option value="' + element.rndc_codigo_ciudad + '" data-municipio="' + element.municipio + '" data-depto="' + element.depto + '">' + element.municipio + '-' + element.depto + '</option>');
//         });

//         // Inicializar los selects con Select2
//         $('#origen_cliente' + cont).select2({
//           placeholder: 'Seleccione una opción',
//           allowClear: true
//         });
//         $('#destino_cliente' + cont).select2({
//           placeholder: 'Seleccione una opción',
//           allowClear: true
//         });
//       }
//     } else {
//       // Caso general: llenar los selects con la data obtenida
//       data.forEach(function (element) {
//         $('#origen_cliente' + cont).append('<option value="' + element.rndc_codigo_ciudad + '" data-municipio="' + element.municipio + '" data-depto="' + element.depto + '">' + element.municipio + '-' + element.depto + '</option>');
//         $('#destino_cliente' + cont).append('<option value="' + element.rndc_codigo_ciudad + '" data-municipio="' + element.municipio + '" data-depto="' + element.depto + '">' + element.municipio + '-' + element.depto + '</option>');
//       });
//     }

//     // Inicializar (o reinicializar) los selects con Select2 para ambos casos
//     $('#origen_cliente' + cont).select2({
//       placeholder: 'Seleccione una opción',
//       allowClear: true
//     });
//     $('#destino_cliente' + cont).select2({
//       placeholder: 'Seleccione una opción',
//       allowClear: true
//     });

//   } catch (error) {
//     console.error('Error en la solicitud:', error);
//     throw error;
//   }
// }

// function codigo_mercancia(id) {
//   const selectMercancia = $('#tipo_mercancia' + id);

//   // Obtener el valor seleccionado y los atributos data-*
//   const selectedOption = selectMercancia.find(':selected');
//   const id_mercancia = selectedOption.data('id');
//   const rndc_mercancia = selectedOption.data('id2');

//   $('#codmercancia' + id).val(id_mercancia);
//   $('#rndcmercancia' + id).val(rndc_mercancia);

//   // Llamar a la API para obtener la naturaleza
//   var select_merca = {
//     id_mercancia: id_mercancia,
//   };

//   $.ajax({
//     url: $('#base_url').val() + 'serviciocliente/Consultar_naturaleza',
//     type: 'POST',
//     data: select_merca,
//     dataType: 'json',
//     success: function (data) {
//       console.log(data);
//       if (data != null) {
//         $('#natu' + id).html('');
//         var tipo = data['tipo'];
//         var natural = '';
//         var palabra = '';
//         if (tipo == '00') {
//           natural = '1';
//           palabra = 'Carga normal';
//         }
//         if (tipo == 'CP') {
//           natural = '2';
//           palabra = 'Carga peligrosa';
//         }
//         if (tipo == 'DP') {
//           natural = '5';
//           palabra = 'Desechos peligrosos';
//         }
//         $('#natu' + id).append('<option value="' + natural + '">' + palabra + '</option>');
//       }
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

// //eliminar datos de mercancia
// function Elimina_Mercancia(btn, id) {
//   let confirm = window.confirm('¿Desea eliminar el bloque de mercancia ' + id + '?');
//   if (confirm == true) {
//     event.preventDefault();
//     $('.tr' + id).remove();
//     $(this).closest('tr').remove();
//   }
//   //recalcular totales
//   recalcula_cifras();
//   llenaritem();
// }

// function lugares(id) {
//   console.log("🚀 ~ lugares ~ id:", id)

//   //alert('cambio');
//   $('#vehiculo_cliente' + id).html('');
//   var origen = $('#origen_cliente' + id).val();
//   let selectedOrigen = $('#origen_cliente' + id).find('option:selected'); // Obtiene la opción seleccionada
//   var municipio_origen = selectedOrigen.data('municipio');
//   var depto_origen = selectedOrigen.data('depto');

//   let selectedDestino = $('#destino_cliente' + id).find('option:selected'); // Obtiene la opción seleccionada
//   var destino = $('#destino_cliente' + id).val();
//   var municipio_destino = selectedDestino.data('municipio');
//   var depto_destino = selectedDestino.data('depto');

//   // Agrega_Remitente(document.getElementById('id_cliente_seleccionado').value, origen);
//   $.ajax({
//     url: $('#base_url').val() + 'serviciocliente/Tipo_Vehiculos',
//     type: 'POST',
//     dataType: 'json',
//     success: function (data) {
//       //traer el tipo de vehiculo
//       $('#vehiculo_cliente' + id + '').append('<option value="">Seleccione</option>');
//       data.forEach(function (element, index) {
//         $('#vehiculo_cliente' + id + '').append('<option value="' + element.id + '">' + element.nombre + '</option>');
//         //costo individual

//         //costo total
//         var tot = $('#Tcosto_flete').val(); //capturar el costo total del flete
//         var fle = $('#flete' + id).val(); //traer el valor actual del flete
//         var tf = fle - tot; //restar el total menos el flete actual
//         //poner el actual en cero
//         $('#Tcosto_flete').val(tf); //asignarle el resultado al total
//         $('#flete' + id).val(0);
//         //tarifa total
//         var totarifa = $('#Tservicio_transporte').val();
//         var ta = $('#totaltarifa_cliente' + id).val();
//         var to_ta = totarifa - ta;
//         $('#totaltarifa_cliente' + id).val(0);
//         $('#Tservicio_transporte').val(to_ta);

//         //total cotizacion
//         var tser = $('#Tservicio_transporte').val();
//         var tesp = $('#Ttarifa_especial').val();
//         var totcot = parseFloat(tser) + parseFloat(tesp);
//         $('#Ttotal_cotizacion').val(totcot);

//         $('.utilidad' + id).val(0);
//         $('#renta' + id).val(0);
//         $('#Tutilidad').val(0);
//         $('#Trentabilidad').val(0);
//       });
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log('no entro ');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });

//   // Agregar el origen al array si no existe
//   if (origen && !ORIGEN_ARRAY.includes(origen)) {
//     ORIGEN_ARRAY.push(origen);
//     ORIGEN_ARRAY.push(municipio_origen);
//     ORIGEN_ARRAY.push(depto_origen);
//   }

//   // Agregar el destino al array si no existe
//   if (destino && !DESTINO_ARRAY.includes(destino)) {
//     DESTINO_ARRAY.push(destino);
//     DESTINO_ARRAY.push(municipio_destino);
//     DESTINO_ARRAY.push(depto_destino);
//   }
// }

// /* FUNCION PARA AGREGAR REMITENTE */
// var i = 0; // opcional, si lo usas en otro lado
// var s = 0;
// function Agrega_Remitente(cliente, origen) {
//   // console.log("🚀 ~ Agrega_Remitente ~ origen:", origen)
//   var mensaje = '';
//   var cl = cliente;
//   var idorigen = origen;

//   // --- Ahora que el HTML existe, hacemos el AJAX para llenar #clientea{S}
//   var cliente_datos = {
//     cliente: cl,
//     origen: idorigen,
//     action: 'cliente_puntos1'
//   };

//   $.ajax({
//     url: $("#base_url").val() + "libs/trafico_ajax.php",
//     type: "POST",
//     data: cliente_datos,
//     dataType: 'json',
//     success: function (data) {
//       var $sel = $("#clientea" + s);
//       $sel.html('<option value="">Seleccione</option>');
//       if (data && data.result) {
//         data.result.forEach(function (element) {
//           $sel.append('<option value="' + element.id + '">' + element.nombre + ' |  ' + element.municipio + ' ' + element.depto + '</option>');
//         });
//       }
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.error(jqXHR, textStatus, errorThrown);
//     }
//   });

//   // Si necesitas validaciones adicionales, agrégalas y asigna texto a "mensaje"
//   // ejemplo: if (!cliente) mensaje = 'Debe seleccionar un cliente';
//   if (mensaje) {
//     $("#msg_solicitud_servicio").html(
//       '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
//       mensaje + '</div></div>');
//     $("#md-fullWidth").animate({ scrollTop: 0 }, 600);
//     return;
//   }

//   var m = parseInt($("#maximo_entregab").val(), 10) || 9999; // límite
//   if (s >= m) {
//     document.getElementById("maximo_entregab").disabled = true;
//     document.getElementById("agregar_fila_entrega2").disabled = true;
//     return;
//   }

//   // incrementamos contadores
//   contador_remitentes++;
//   // console.log("🚀 ~ Agrega_Remitente ~ contador_remitentes:", contador_remitentes)

//   s++;
//   i = s; // si usas i en otra parte, mantenerlo sincronizado
//   // activar sólo el primero (igual que tu lógica original)
//   var activo = (s === 1) ? 'active' : '';
//   var aria_selected = (s === 1) ? 'true' : 'false';
//   var tabPaneClass = (s === 1) ? 'tab-pane fade show active' : 'tab-pane fade';

//   // Botón eliminar sólo si hay más de uno
//   var belimina_remi = '';
//   if (s > 1) {
//     belimina_remi = `<button class="btn btn-danger btn-sm me-1 px-1 py-1" data-toggle="tooltip" data-placement="top" title="Borra Remitente ${s}" id="limpiar_remit${s}" onclick="Elimina_Remitente(this.id,${s})">
//                         <i class="far fa-trash-alt"></i>
//                      </button>`;
//   }

//   // Cabeza (nav item)
//   var cabeza = `<li class="nav-item d-flex align-items-center" id="navitem_remit${s}">
//                   <a class="nav-link ${activo} text-body-tertiary fw-bold lh-1 text-nowrap"
//                      data-bs-toggle="tab"
//                      role="tab"
//                      aria-controls="TabRemitente-${s}"
//                      aria-selected="${aria_selected}"
//                      href="#TabRemitente${s}">
//                     Remitente ${s}
//                   </a>
//                   ${belimina_remi}
//                 </li>`;

//   // Ciudad select (vacío, se llenará o por otro script)
//   var city = `
//     <select id='p_ciudad${s}' class='form-select form-select-sm re_ciudad'>
//       <option value="" readonly="readonly">Seleccione</option>
//     </select>`;

//   // Select cliente y hidden para nombre
//   var cliente_select = `<select id='clientea${s}' class='form-select form-select-sm re_cliente' onchange='Cambia_Remitente(${s})'></select>
//                         <input type='hidden' class='form-control input-xs re_nombre' id='re_namecli${s}'>`;

//   var horahoy = moment().format('HH:mm:ss');

//   /* Accion solo para agragr un solo destinatario a varios remitentes */
//   var btn_agregar_destinatario = "";
//   if (typeof ID !== 'undefined' && typeof REMITENTE !== 'undefined' && typeof BLOQUE_MERCANCIA !== 'undefined') {
//     if (ID === '3' && REMITENTE === '+1' && s > 1) {
//       btn_agregar_destinatario = "";
//     } else if (ID === '7' && REMITENTE === '+1' && BLOQUE_MERCANCIA === '+1' && s > 1) {
//       btn_agregar_destinatario = "";
//     } else {
//       btn_agregar_destinatario = `<a href="#" class="text-decoration-none" onclick="Agrega_Destinatariob(this);" title="Seleccione los destinatarios para este remitente" data-id="${s}" data-cliente_id="${cl}" id="agregar_destinatario${s}">
//                                     &nbsp;<span class="mdi mdi-plus"></span> Destinatarios
//                                   </a>`;
//     }
//   } else {
//     // Si alguna variable no existe, dejamos el botón (mantener compatibilidad)
//     btn_agregar_destinatario = `<a href="#" class="text-decoration-none" onclick="Agrega_Destinatariob(this);" title="Seleccione los destinatarios para este remitente" data-id="${s}" data-cliente_id="${cl}" id="agregar_destinatario${s}">
//                                   &nbsp;<span class="mdi mdi-plus"></span> Destinatarios
//                                 </a>`;
//   }

//   // Esqueleto completo (conservé todo tu HTML)
//   var esqueleto = `
//     <div class="${tabPaneClass}" role="tabpanel" aria-labelledby="TabRemitente${s}" id="TabRemitente${s}">
//       <div class="col">
//         <table class="table table-sm table-bordered tre${s} text-center" style="font-size:12px;">
//             <thead>
//               <tr class="tre${s}">
//                 <th class="tre${s}">Remitente-${s} ${btn_agregar_destinatario}
//                   <input type="hidden" id="destinatario${s}" class="desti_remit tre${s}">
//                 </th>
//                 <th class="tre${s}">Dirección</th>
//                 <th class="tre${s}">Ciudad</th>
//               </tr>
//               <tr class="tre${s}">
//                 <td>
//                   ${cliente_select}
//                   <input type="hidden" id="estado_upgrade${s}" class="form-control input-xs est_upgrade">
//                   <input type="hidden" class="form-control input-xs rlname" id="rlname${s}">
//                 </td>
//                 <td>
//                   <!--<button id="btnmascara_direccion${s}" class="btn-xs btn-success mdi mdi-home class=" tre${s}" tittle="Generar dirección" onclick="mascara_dire(${s});"></button>-->
//                   <input type="text" id="dire${s}" class="form-control form-control-sm re_dire" style=" height:14px; font-size:90%;" readonly="readonly">
//                   <input type="hidden" class="form-control input-xs rldire" id="rldire${s}">
//                 </td>
//                 <td class="tre${s}">${city}</td>
//               </tr>

//               <tr class="tre${s}">
//                 <th class="tre${s}">Teléfono</th>
//                 <th class="tre${s}">Observación</th>
//                 <th>Peso Neto(Kg)</th>
//               </tr>

//               <tr class="tre${s}">
//                 <td class="tre${s}">
//                   <input type="number" id="telpunto${s}" class="form-control form-control-sm re_telefono" min="0">
//                   <input type="hidden" id="rltel${s}" class="form-control input-xs rltel">
//                 </td>
//                 <td class="tre${s}">
//                   <textarea id="observa${s}" class="form-control form-control-sm" rows="1"></textarea>
//                 </td>
//                 <td class="tre${s}">
//                   <input type="number" id="peso${s}" class="form-control form-control-sm re_peso">
//                 </td>
//               </tr>

//               <tr class="tre${s}">
//                 <th class="tre${s}">Fecha de recogida</th>
//                 <th class="tre${s}">Hora de recogida</th>
//                 <th class="tre${s}">Lugar de recogida</th>
//               </tr>

//               <tr class="tre${s}">
//                 <td>
//                   <input type="date" id="fecha${s}" class="form-control form-control-sm re_fecha">
//                 </td>
//                 <td class="tre${s}">
//                   <input type="time" id="hora${s}" class="form-control form-control-sm re_hora" value="${horahoy}">
//                 </td>
//                 <td class="tre${s}">
//                   <input type="text" id="lugar${s}" class="form-control form-control-sm re_lugar">
//                   <input type="hidden" id="id_puntorem${s}" class="input_xs id_punto" value="${s}">
//                 </td>
//               </tr>
//             </thead>
//             <tbody></tbody>
//           </table>
//       </div>
//     </div>
//   `;

//   // --- APPEND (no borrar lo previo) ---
//   $("#remitentes_menu").append(cabeza);
//   $("#nav_contenedor").append(esqueleto);

//   // Si quieres que el primer tab sea mostrado automáticamente (bootstrap),
//   // el tabPaneClass y la clase 'active' en el nav-link ya lo hacen.
//   // Si usas tooltips, reinícialos aquí si lo necesitas:
//   // $('[data-toggle="tooltip"]').tooltip();


//   // Si quieres, puedes hacer scroll o activar el tab nuevo automáticamente:
//   // $(`#remitentes_menu a[href="#TabRemitente${s}"]`).tab('show'); // si usas bootstrap JS
// }

// function Elimina_Remitente(btnId, idx) {
//   // eliminar el nav item que contiene el botón
//   $("#" + btnId).closest('li').remove();
//   // eliminar el contenido del tab
//   $("#TabRemitente" + idx).remove();

//   // si borraste el último, decrementar contador para permitir agregar más hasta el máximo
//   if (idx === s) {
//     s--;
//     i = s;
//   }
//   contador_remitentes--;
//   // habilitar botones si antes estaban deshabilitados por llegar al máximo
//   document.getElementById("maximo_entregab").disabled = false;
//   document.getElementById("agregar_fila_entrega2").disabled = false;
// }

// //FUNCION PARA AGREGAR DESTINATARIO
// var d = 0;
// var destino = "";
// var accion_destinatario = 0;
// function Agrega_Destinatariob(element, clienteDestino, destino, cont) {
//   // 1. Reiniciar todos los destinatarios antiguos
//   if (ID !== '8') {
//     ReiniciarDestinatarios();
//   }

//   if (element) {
//     var elemento = $(element);
//     var rem = elemento.data("id");
//     var cliente_id = elemento.data("cliente_id");
//     var horahoy = moment().format('HH:mm:ss');
//     var Mundestino = DESTINO_ARRAY[0];
//   } else {
//     var rem = cont;
//     var cliente_id = clienteDestino;
//     var Mundestino = destino;
//     if (ID === '1' && VEHICULO === 1 && REMITENTE === 1 && DESTINATARIO === 1 && BLOQUE_MERCANCIA === 1 && SERVICIO === 'Expreso') {
//       d = 0;
//     }
//   }

//   if (ID === '1' && VEHICULO === 1 && REMITENTE === 1 && DESTINATARIO === 1 && BLOQUE_MERCANCIA === 1 && SERVICIO === 'Expreso') {
//     document.getElementById("agregar_destinatario" + rem).style.display = "none";
//   } else if (ID === '2' && VEHICULO === 1 && REMITENTE === 1 && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === 1 && SERVICIO === 'Expreso') {
//     document.getElementById("agregar_destinatario" + rem).style.display = "toogle";
//   } else if (ID === '3' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === 1 && BLOQUE_MERCANCIA === 1 && SERVICIO === 'Expreso') {
//     // document.getElementById("agregar_destinatario" + rem).style.display = "none";
//     accion_destinatario++;
//     if (accion_destinatario === 1) {
//       document.getElementById("agregar_destinatario" + rem).style.display = "none";
//     } else {
//       document.getElementById("agregar_destinatario" + rem).style.display = "toogle";
//     }
//   } else if (ID === '4' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === 1 && SERVICIO === 'Expreso') {
//     if (contador_remitentes === contador_destinatarios) {
//       document.getElementById("agregar_destinatario" + rem).style.display = "none";
//     } else {
//       document.getElementById("agregar_destinatario" + rem).style.display = "block";
//     }
//   } else if (ID === '5' && VEHICULO === 1 && REMITENTE === 1 && DESTINATARIO === 1 && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso') {
//     accion_destinatario++;
//     if (accion_destinatario === 1) {
//       document.getElementById("agregar_destinatario" + rem).style.display = "none";
//     } else {
//       document.getElementById("agregar_destinatario" + rem).style.display = "toogle";
//     }
//   } else if (ID === '6' && VEHICULO === 1 && REMITENTE === 1 && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso') {
//     document.getElementById("agregar_destinatario" + rem).style.display = "toogle";
//   } else if (ID === '7' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === 1 && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso') {
//     accion_destinatario++;
//     if (accion_destinatario === 1) {
//       document.getElementById("agregar_destinatario" + rem).style.display = "none";
//     } else {
//       document.getElementById("agregar_destinatario" + rem).style.display = "toogle";
//     }
//   } else if (ID === '8' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso') {
//     document.getElementById("agregar_destinatario" + rem).style.display = "toogle";
//   } else if (ID === '9' && VEHICULO === '+1' && REMITENTE === 1 && DESTINATARIO === 1 && BLOQUE_MERCANCIA === 1 && SERVICIO === 'Consolidado') {
//     accion_destinatario++;
//     if (accion_destinatario === 1) {
//       document.getElementById("agregar_destinatario" + rem).style.display = "none";
//     } else {
//       document.getElementById("agregar_destinatario" + rem).style.display = "toogle";
//     }
//   } else if (ID === '10' && VEHICULO === '+1' && REMITENTE === 1 && DESTINATARIO === 1 && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Consolidado') {
//     accion_destinatario++;
//     if (accion_destinatario === 1) {
//       document.getElementById("agregar_destinatario" + rem).style.display = "none";
//     } else {
//       document.getElementById("agregar_destinatario" + rem).style.display = "toogle";
//     }
//   } else if (ID === '11' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Consolidado') {
//     document.getElementById("agregar_destinatario" + rem).style.display = "toogle";
//   }

//   contador_destinatarios++;
//   d = d + 1;
//   // DESTINO_ARRAY.forEach(function (destino) {});
//   //consultar destinatarios
//   var cliente = {
//     cliente: cliente_id,
//     destino: Mundestino,
//     action: 'cliente_puntos'
//   };

//   $("#clienteb" + d + "").html('');
//   $.ajax({
//     url: $("#base_url").val() + "libs/trafico_ajax.php",
//     type: "POST",
//     data: cliente,
//     dataType: 'json',
//     success: function (data) {
//       $("#clienteb" + d + "").html('<option value="">Seleccione</option>');
//       if (data.result != null) {
//         data.result.forEach(function (element, index) {
//           $("#clienteb" + d + "").append('<option value="' + element.id + '">' + element.nombre + ' | ' + element.municipio + ' ' + element.depto + '</option>');
//         });
//       }
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log('no trajocliente ');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     }
//   });

//   $("#destinatario" + rem).val(d);

//   /* Boton de eleminar destinatario */
//   var btn_elimina_destinatario = '';
//   if (d > 1) {
//     var btn_elimina_destinatario = `<boton id="btnelimina_de${d}" class="btn btn-danger btn-sm mdi mdi-delete" tittle="Borrar Destinatario"  onclick="Elimina_Destinatario(this.id,${d},${rem})" ></button>`;
//   }

//   var city = `<select id='p_ciudadb${d}' class='form-select form-select-sm de_ciudad'>
//                 <option value="" readonly="readonly">Seleccione</option>
//               </select>`;

//   var cliente = `<select id='clienteb${d}' class='form-select form-select-sm de_cliente' onchange='Cambia_Destinatario(${d})'></select>
//                    <input type='hidden' id='de_nombre${d}' class='form-select form-select-sm de_nombre'>`;

//   // $("#destinatarios_menu").html('');
//   var cabeza = `<li class="nav-item"><a class="nav-link text-body-tertiary fw-bold lh-1 text-nowrap" data-bs-toggle="tab" role="tab" aria-controls="TabDestinatario-${s}" aria-selected="false" href="#TabDestinatario${d}">Destinatario ${d} - Remitente ${rem} ${btn_elimina_destinatario}</a></li>`;

//   var contenido = `
//      <div class="tab-pane fade" role="tabpanel" aria-labelledby="TabDestinatario${d}" id="TabDestinatario${d}">
//         <table class="table table-bordered table-sm insercion_destina text-center" style="font-size:12px;">
//           <thead>
//             <tr>
//               <th>Destinatario</th>
//               <th>Dirección
//                 <!--<boton id="btnmascara_direccionb${d}" class="btn-xs btn-success mdi mdi-home" tooltip="top"
//                   tittle="Genera dirección" onclick="mascara_direb(${d});"></boton>-->
//               </th>
//               <th>Ciudad</th>
//             </tr>
//             <tr>
//               <td>${cliente}
//                 <input type="hidden" class="form-control form-control-sm dlname" id="dlname${d}">
//                 <input type="hidden" class="form-control form-control-sm dlestado" id="dlestado${d}">
//               </td>
//               <td>
//                 <input type="text" id="direb${d}" class="form-control form-control-sm de_dire" readonly="readonly">
//                 <input type="hidden" class="form-control form-control-sm dldire" id="dldire${d}">
//               </td>
//               <td>${city}</td>
//             </tr>

//             <tr>
//               <th>Teléfono</th>
//               <th>Lugar</th>
//               <th>Fecha entrega</th>
//             </tr>

//             <tr>
//               <td>
//                 <input type="text" id="telpuntob${d}" class="form-control form-control-sm tel_dire" pattern="[0-9]{8,10}"
//                   maxlength="10">
//                 <input type="hidden" class="form-control form-control-sm dltel" id="dltel${d}">
//               </td>
//               <td>
//                 <input type="text" id="lugarb${d}" class="form-control form-control-sm de_lugar">
//               </td>
//               <td>
//                 <input type="date" id="fechab${d}" class="form-control form-control-sm de_fecha">
//               </td>
//             </tr>
//             <tr>
//               <th>Hora entrega</th>
//               <th>Peso Neto(kg)</th>
//               <th>Orden</th>
//             </tr>
//             <!-- <tr></tr> -->
//             <tr>
//               <td>
//                 <input type="time" id="horab${d}" class="form-control form-control-sm de_hora" value="${horahoy}">
//               </td>
//               <td>
//                 <input type="number" id="pesob${d}" class="form-control form-control-sm de_peso">
//               </td>
//               <td>
//                 <input type="text" id="ordenb${d}" class="form-control form-control-sm de_orden" value="${d}"
//                   readonly="readonly">
//                 <input type="hidden" class="bg-light form-control form-control-sm idrem_d" readonly="readonly" value="${d}">
//               </td>
//             </tr>
//             <!-- </td> -->

//             <!-- <tr>
//               <th colspan="3">Observación</th>
//             </tr>
//             <tr> -->
//             <tr>
//               <td colspan="3">
//                 <input type="text" id="observdesb${d}" class="form-control form-control-sm de_obser"
//                   placeholder="Observación del cliente">
//             </tr>
//           </thead>
//           <tbody></tbody>
//         </table>
//       </div>`;

//   // $("#destinatarios_menu").append(cabeza);
//   // $("#accordion_destinatario").append(contenido);

//   $("#destinatarios_menu").append(cabeza);
//   $("#accordion_destinatario").append(contenido);
// }

/**
 * Reinicia el estado global de la funcionalidad de destinatarios
 * y limpia el HTML generado.
 */
// function ReiniciarDestinatarios() {
//   // 1. Reinicializar las variables globales
//   // Asumo que estas variables son globales y controlan la lógica de la función Agrega_Destinatariob
//   // DEBES asegurarte de que 'contador_destinatarios', 'contador_remitentes' (si aplica) 
//   // y otras variables de control global estén definidas fuera de cualquier función.
//   window.d = 0;
//   window.accion_destinatario = 0;
//   window.contador_destinatarios = 0; // Asumo que existe y lo usas globalmente
//   // window.contador_remitentes = 0; // Si el cambio de servicio afecta a los remitentes, también reinícialo

//   // 2. Limpiar los contenedores HTML de la Vista
//   const menuDestinatarios = document.getElementById("destinatarios_menu");
//   const acordeonDestinatarios = document.getElementById("accordion_destinatario");

//   if (menuDestinatarios) {
//     menuDestinatarios.innerHTML = '';
//     // Opcional: Reinserta la pestaña inicial si la necesitas
//     // Por ejemplo: menuDestinatarios.innerHTML = '<li class="nav-item"><a class="nav-link active..." href="#TabDestinatario1">Destinatario 1</a></li>';
//   }

//   if (acordeonDestinatarios) {
//     acordeonDestinatarios.innerHTML = '';
//   }

//   // 3. Opcional: Habilitar o mostrar el botón inicial de agregar destinatario
//   // (Si tienes un botón para agregar el primer destinatario que pudo haber sido ocultado)
//   // document.getElementById("agregar_destinatario1").style.display = "block";

//   console.log("Reiniciados los contadores y la vista de destinatarios.");
// }

// function Cambia_Remitente(c) {
//   var remite = $("#clientea" + c).val();
//   if (remite != '') {
//     var dato = {
//       idremite: remite,
//       action: 'consulta_datos_remitente'
//     };

//     $.ajax({
//       url: $("#base_url").val() + "libs/servicio_cliente_ajax.php",
//       type: 'POST',
//       data: dato,
//       dataType: 'json',
//       success: function (data) {
//         $("#p_ciudad" + c + "").html('');
//         if (data) {
//           $("#p_ciudad" + c + "").html(
//             '<option value="' + data.result[0].id_municipio + '">' + data.result[0].municipio + '/' + data
//               .result[0].depto + '</option>');
//           $("#dire" + c + "").val(data.result[0].direccion);
//           $("#telpunto" + c + "").val(data.result[0].celular);
//           $("#re_namecli" + c + "").val(data.result[0].nombre);
//           $("#estado_upgrade" + c + "").val(data.result[0].estado_actualizacion_rndc);
//           $("#rlname" + c + "").val(data.result[0].long_name);
//           $("#rldire" + c + "").val(data.result[0].long_address);
//           $("#rltel" + c + "").val(data.result[0].long_cel);
//         }
//       },
//       error: function (jqXHR, textStatus, errorThrown) {
//         console.log('no trajo datos remitente');
//         console.log(jqXHR);
//         console.log(textStatus);
//         console.log(errorThrown);
//       }
//     });
//   }
// }

// function Cambia_Destinatario(c) {
//   var remite = $("#clienteb" + c).val();
//   if (remite != '') {
//     var dato = {
//       idremite: remite,
//       action: 'consulta_datos_remitente'
//     };

//     $.ajax({
//       url: $("#base_url").val() + "libs/servicio_cliente_ajax.php",
//       type: 'POST',
//       data: dato,
//       dataType: 'json',
//       success: function (data) {
//         $("#p_ciudadb" + c + "").html('');
//         if (data) {
//           $("#p_ciudadb" + c + "").html(
//             '<option value="' + data.result[0].id_municipio + '">' + data.result[0].municipio + '/' + data
//               .result[0].depto + '</option>');
//           $("#direb" + c + "").val(data.result[0].direccion);
//           $("#telpuntob" + c + "").val(data.result[0].celular);
//           $("#de_nombre" + c + "").val(data.result[0].nombre);
//           $("#dlname" + c + "").val(data.result[0].long_name);
//           $("#dlestado" + c + "").val(data.result[0].estado_actualizacion_rndc);
//           $("#dldire" + c + "").val(data.result[0].long_address);
//           $("#dltel" + c + "").val(data.result[0].long_cel);
//         }
//       },
//       error: function (jqXHR, textStatus, errorThrown) {
//         console.log('no trajo datos remitente');
//         console.log(jqXHR);
//         console.log(textStatus);
//         console.log(errorThrown);
//       }
//     });
//   }
// }

// //calcula tarifa
// function utilidad(elem, id, max) {
//   var cont = contador_global1;
//   $('#totaltarifa_cliente' + id).val(parseFloat($('#totaltarifa_cliente' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   var valor = $('#totaltarifa_cliente' + id).val().replace(/,/g, '');
//   //trayendo valor tarifa y el id de la tarifa
//   //UTILIDAD INDIVIDUAL
//   var calculo, resta, util, res;
//   var acu = 0;
//   var variable = 0;
//   var f = $('#flete' + id).val().replace(/,/g, '');
//   resta = parseFloat(valor) - parseFloat(f);
//   calculo = parseFloat(resta) / parseFloat(valor);
//   res = parseFloat(calculo) * 100;
//   res = res.toFixed(2);
//   $('.utilidad' + id).val(res);
//   $('.utilidad' + id).val(parseFloat($('.utilidad' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

//   //RENTABILIDAD
//   var rent = parseFloat(valor) - parseFloat(f);
//   $('#renta' + id).val(rent);
//   $('#renta' + id).val(parseFloat($('#renta' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   var i;
//   var sum = 0;
//   var vtemp;
//   $('#Tservicio_transporte').val(0);
//   recalcula_cifras();
//   for (i = 1; i <= cont; i++) {
//     //alert (max);
//     vtemp = 0;
//     vtemp = $('#totaltarifa_cliente' + i).val().replace(/,/g, '');
//     sum = parseFloat(sum) + parseFloat(vtemp);
//   }
//   var vt = $('#Tservicio_transporte').val().replace(/,/g, '');
//   var sumtotal = parseFloat(vt) + parseFloat(sum);
//   $('#Tservicio_transporte').val(sumtotal);
//   //utilidad total
//   var costot = $('#Tcosto_flete').val().replace(/,/g, '');
//   var tartot = $('#Tservicio_transporte').val().replace(/,/g, '');
//   var utitot = (parseFloat(tartot) - parseFloat(costot)) / tartot * 100;
//   utitot = utitot.toFixed(2);
//   $('#Tutilidad').val(utitot);
//   var rentot = parseFloat(tartot) - parseFloat(costot);
//   $('#Trentabilidad').val(rentot);
//   //total cotizacion
//   var tser = $('#Tservicio_transporte').val().replace(/,/g, '');
//   var tesp = $('#Ttarifa_especial').val().replace(/,/g, '');
//   var totcot = parseFloat(tser) + parseFloat(tesp);
//   $('#Ttotal_cotizacion').val(totcot);
//   //maquetar los totales
//   $('#Tservicio_transporte').val(parseFloat($('#Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   //$("#Tcosto_flete").val(parseFloat($("#Tcosto_flete").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
//   $('#Tutilidad').val(parseFloat($('#Tutilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#Trentabilidad').val(parseFloat($('#Trentabilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#Ttotal_cotizacion').val(parseFloat($('#Ttotal_cotizacion').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   //recalcular cifras
//   recalcula_cifras();
// }

// //calcula flete
// function utilidad_d(elem, id, max) {
//   var conte = contador_global1;
//   var valor = $('#totaltarifa_cliente' + id).val().replace(/,/g, '');
//   var calculo, resta, util, res;
//   var acu = 0;
//   var variable = 0;
//   var f = $('#flete' + id).val().replace(/,/g, '');
//   var ff = $('#flete' + id);
//   ff.val(parseFloat(ff.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   //UTILIDAD
//   resta = parseFloat(valor) - parseFloat(f);
//   calculo = parseFloat(resta) / parseFloat(valor);
//   res = parseFloat(calculo) * 100;
//   res = res.toFixed(2);
//   $('.utilidad' + id).val(res);
//   $('.utilidad' + id).val(parseFloat($('.utilidad' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   //RENTABILIDAD
//   var rent = parseFloat(valor) - parseFloat(f);
//   $('#renta' + id).val(rent);
//   $('#renta' + id).val(parseFloat($('#renta' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   //Recalcular la tarifa total
//   var i;
//   var sum = 0;
//   var vtemp;
//   //Recalcular el costo flete total
//   var e;
//   var mas = 0;
//   var vtempd;
//   //SUBTOTALES DE DATOS DE MERCANCIA
//   //Valor total costo del flete
//   recalcula_cifras();
//   $('#Tservicio_transporte').val(0);
//   $('#Tcosto_flete').val(0);
//   for (i = 1; i <= conte; i++) {
//     //alert (max);
//     vtemp = 0;
//     vtemp = $('#totaltarifa_cliente' + i).val().replace(/,/g, '');
//     sum = parseFloat(sum) + parseFloat(vtemp);

//     vtempd = 0;
//     vtempd = $('#flete' + i).val().replace(/,/g, '');
//     mas = parseFloat(mas) + parseFloat(vtempd);
//   }
//   var vt = $('#Tservicio_transporte').val().replace(/,/g, '');
//   var sumtotal = parseFloat(vt) + parseFloat(sum);
//   $('#Tservicio_transporte').val(sumtotal);

//   var vf = $('#Tcosto_flete').val().replace(/,/g, '');
//   var sumftotal = parseFloat(vf) + parseFloat(mas);
//   $('#Tcosto_flete').val(sumftotal);
//   //Utilidad y Rentabilidad total
//   var costot = $('#Tcosto_flete').val().replace(/,/g, '');
//   var tartot = $('#Tservicio_transporte').val().replace(/,/g, '');
//   var utitot = (parseFloat(tartot) - parseFloat(costot)) / tartot * 100;
//   utitot = utitot.toFixed(2);
//   $('#Tutilidad').val(utitot);
//   var rentot = parseFloat(tartot) - parseFloat(costot);
//   $('#Trentabilidad').val(rentot);
//   //Total cotización
//   var tser = $('#Tservicio_transporte').val().replace(/,/g, '');
//   var tesp = $('#Ttarifa_especial').val().replace(/,/g, '');
//   var totcot = parseFloat(tser) + parseFloat(tesp);
//   $('#Ttotal_cotizacion').val(totcot);
//   //maquetar campos
//   $('#Tcosto_flete').val(parseFloat($('#Tcosto_flete').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#Tutilidad').val(parseFloat($('#Tutilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#Trentabilidad').val(parseFloat($('#Trentabilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#Tservicio_transporte').val(parseFloat($('#Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   recalcula_cifras();
// }

// agregar filas DATOS SERVICIOS ESPECIALES
var con = 0;
var contador_global2 = 0;
// function agregar_especial(tablaPintadaMercancia) {
function agregar_especial() {
  //alert('agrego especial');
  con++;
  contador_global2 = contador_global2 + 1;
  //select mercancia
  //traer los tipos de servicio especial
  var select_merca = {
    action: 'traer_especial',
  };
  $('#tservi_cliente' + con + '').html('');
  $.ajax({
    url: $('#base_url').val() + 'libs/servicio_cliente_ajax.php',
    type: 'POST',
    data: select_merca,
    dataType: 'json',
    success: function (data) {
      // $("#"+id+"").html('');
      // console.log('si especial gracie');
      data.result.forEach(function (element, index) {
        $('#tservi_cliente' + con + '').append('<option value="' + element.nombre + '">' + element.nombre + '</option>');
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // console.log('no entro gracie');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
  // var btn_elimina ='<button id="elimina' + cont + '" class="btn btn-danger btn-xs" tooltip="Eliminar bloque ' + con + '"  onclick="Elimina_Especial(this.id,' + con + ')"><i class="far fa-trash-alt"></i></button>';
  var btn_elimina = `<a class="fw-bold fs-9 text-decoration-none elimina text-center" id="elimina${con}" href="#!" tooltip="Eliminar bloque${con}" onclick="Elimina_Especial(this.id,${con})" style="width: 40%;"><i class="far fa-trash-alt"></i> Eliminar Servicio</a>`;
  var lafila = `
    <div class="row tre${con}">
      <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">        
        <div class="d-flex flex-wrap justify-content-start" style="color:#fff;">
          <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8 d-flex align-items-center">
            <!--<select id="select_mercancia${con}" class="form-select form-select-sm" onChange="javascript:cambiomerca(this.value,${con});" style="width: 10%;"></select>-->
            <input type="hidden" id="select_mercancia${con}" disabled class="form-control form-control-sm">
            <span class="badge badge-phoenix badge-phoenix-primary numeral_mer" id="numeral_mer${con}" title="Mercancía"></span>
            <span class="badge badge-phoenix badge-phoenix-success numerale_espe" id="numeral_espe${con}" title="Especial" value="${con}">${con}</span>
          </div>
          <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4 d-flex justify-content-end">
            ${btn_elimina}   
          </div>
        </div>
        <hr class="my-1 text-dark">
      </div>

      <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${con}">
        <div class="mb-3">
            <label style="font-size: 12px;">Tipo Servicio</label> 
            <select id="tservi_cliente${con}" class="form-select form-select-sm tiposerviespe" onChange="javascript:cambio(this,this.value,${con});" style="width:100%;">
                <option value="">Seleccione una opción</option>
            </select>
        </div>
      </div>

      <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${con}">
        <div class="mb-3">
            <label style="font-size: 12px;">Proveedor</label> 
            <select id="tservi_proveedor${con}" class="form-select form-select-sm tiposerviespro" onChange="javascript:tarifa_proveedor(this,this.value,${con});" style="width:100%;">
                <option value="">Seleccione una opción</option>
            </select>
        </div>
      </div>

      <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${con}">
        <div class="mb-3">
            <label style="font-size: 12px;">Cantidad</label> 
            <input type="number" id="cantidad_servespecial${con}" class="form-control form-control-sm cantiespec" min="1" value="1"  onChange="javascript:myFunction(this.value,${con});" style="width:100%;">
        </div>
      </div>
      
      <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${con}">
        <div class="mb-3">
            <label style="font-size: 12px;">Costo Unitario</label> 
            <input type="text" id="${con}"  class="form-control form-control-sm vunitario${con} valoruni" min="0" value="0"  readonly="readonly" onclick="myFunctionf(this.id,this.value);" onchange="total_especial_valor(this.value,this.id);" style="width:100%;">
        </div>
      </div>
      
      <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${con}">
        <div class="mb-3">
            <label style="font-size: 12px;">Tarifa Unitaria</label> 
            <input type="text" id="tarifauni${con}" class="form-control form-control-sm tarifaespe" value="0" onchange="utilidade(${con});" style="width:100%;">
        </div>
      </div>
      
      <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${con}">
        <div class="mb-3">
            <label style="font-size: 12px;">Calculo Costo</label> 
            <input type="text" id="total_servespecial${con}" class="form-control form-control-sm tcostoesp" readonly="readonly" style="width:100%;">
        </div>
      </div>
      
      <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${con}">
        <div class="mb-3">
            <label style="font-size: 12px;">Calculo Tarifa</label> 
            <input type="text" id="taries${con}" class="form-control form-control-sm ttariesp"  readonly="readonly" value="0" style="width:100%;">
        </div>
      </div>

      <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${con}">
        <div class="mb-3">
            <label style="font-size: 12px;">Costo rentabilidad%</label> 
            <input type="text" id="utiles${con}" class="form-control form-control-sm tutiesp" readonly="readonly" style="width:100%;">
        </div>
      </div>
      
      <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${con}">
        <div class="mb-3">
            <label style="font-size: 12px;">Utilidad</label> 
            <input type="text" id="rente${con}" class="form-control form-control-sm trenesp" readonly="readonly" style="width:100%;">
        </div>
      </div>

    </div>
    <hr class="my-1 text-dark">
  `;

  // $('#table_especial').append(lafila);
  // llenaritem(tablaPintadaMercancia);
  // recalcula_cifras();

  $('#table_especial').append(lafila);
  llenaritem();
  recalcula_cifras();
}
//eliminar datos especiales
function Elimina_Especial(btn, id) {
  var confirme = window.confirm('¿Desea eliminar el servicio especial ' + id + '?');
  if (confirme == true) {
    event.preventDefault();
    $('.tre' + id).remove();
    $(this).closest('tr').remove();
  }
  llenaritem();
  recalcula_cifras();
}

// function llenaritem() {
//   var s;
//   if (contador_global1 > 0) {
//     for (b = 1; b <= contador_global2; b++) {
//       $('#select_mercancia' + b).html('');
//       s = '';
//       $('#numeral_mer' + b).html('');
//       for (a = 1; a <= contador_global1; a++) {
//         s = s + '<option value=' + a + '>' + a + '</option>';
//         j = a;
//       }
//       $('#select_mercancia' + b).html(s);
//       $('#numeral_mer' + b).html(j);
//     }
//     //cambiomerca(1,);
//   } else {
//     alert('Debe agregar mercancías a la cotización');
//   }
// }

// function myFunction(valor, id) {
//   var servicio = $('#tservi_cliente' + id).val();
//   var traer_costo = {
//     servicio: servicio,
//     action: 'traer_costo',
//   };

//   $.ajax({
//     url: $('#base_url').val() + 'libs/servicio_cliente_ajax.php',
//     type: 'POST',
//     data: traer_costo,
//     dataType: 'json',
//     success: function (data) {
//       if (data.result) {
//         $('.vunitario' + id).val(data.result[0].costo);
//         $('.vunitario' + id).val(parseFloat($('.vunitario' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//       }
//       //calcular el costo
//       var c = $('#cantidad_servespecial' + id).val().replace(/,/g, '');
//       var costo = parseFloat(data.result[0].costo) * c;
//       $('#total_servespecial' + id).val(costo);
//       $('#total_servespecial' + id).val(parseFloat($('#total_servespecial' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

//       //calcular Tarifa
//       var vtar = $('#tarifauni' + id).val().replace(/,/g, '');
//       var tartot = parseFloat(vtar) * c;
//       $('#taries' + id).val(tartot);
//       $('#taries' + id).val(parseFloat($('#taries' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//       //costo total
//       recalcula_cifras();
//       var i;
//       var sum = 0;
//       var ces;
//       for (i = 1; i <= contador_global2; i++) {
//         ces = 0;
//         ces = $('#total_servespecial' + i).val().replace(/,/g, '');
//         sum = parseFloat(sum) + parseFloat(ces);
//       }
//       $('#Tcosto_especial').val(sum);
//       $('#Tcosto_especial').val(parseFloat($('#Tcosto_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

//       //tarifa total
//       var i2;
//       var sum2 = 0;
//       var tvt;

//       for (i2 = 1; i2 <= contador_global2; i2++) {
//         tvt = 0;
//         tvt = $('#taries' + i2).val().replace(/,/g, '');
//         sum2 = parseFloat(sum2) + parseFloat(tvt);
//       }
//       $('#Ttarifa_especial').val(sum2);
//       $('#Ttarifa_especial').val(parseFloat($('#Ttarifa_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

//       utilidade(id);
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

// function cambio(eleme, valor, id) {
//   //alert(valor);
//   $('#cantidad_servespecial' + id).val(1);
//   var cant = $('#cantidad_servespecial' + id).val();
//   var traer_costo = {
//     servicio: valor,
//   };

//   $.ajax({
//     // url: $('#base_url').val() + 'libs/servicio_cliente_ajax.php',
//     url: $('#base_url').val() + 'serviciocliente/traer_costo',
//     type: 'POST',
//     data: traer_costo,
//     dataType: 'json',
//     success: function (data) {
//       data.forEach(function (element) {
//         $('#tservi_proveedor' + id).append(
//           `<option value="${element.proveedor_id}">${element.razon_social}</option>`
//         );
//       });

//       $('#origen_cliente, #destino_cliente').select2({
//         placeholder: 'Seleccione una opción',
//         allowClear: true
//       });
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
//   //COSTO TOTAL
// }

// function tarifa_proveedor(eleme, valor, id) {
//   $('#cantidad_servespecial' + id).val(1);
//   var cant = $('#cantidad_servespecial' + id).val();
//   var destino = $('#destino_cliente' + id).val();
//   var traer_costo = {
//     proveedor: valor,
//     ciudad: destino,
//     // action: 'traer_costo_proveedor',
//   };

//   $.ajax({
//     // url: $('#base_url').val() + 'libs/servicio_cliente_ajax.php',
//     url: $('#base_url').val() + 'serviciocliente/traer_costo_proveedor',
//     type: 'POST',
//     data: traer_costo,
//     dataType: 'json',
//     success: function (data) {
//       if (data) {
//         $('.vunitario' + id).val(data.costo);
//         $('.vunitario' + id).val(parseFloat($('.vunitario' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//       }

//       $('#tarifauni' + id).val(0);
//       //$("#total_servespecial"+id).val(0);
//       $('#taries' + id).val(0);
//       $('#utiles' + id).val(0);
//       $('#rente' + id).val(0);
//       //calcular el costo
//       var costo = parseFloat(data.costo) * cant;
//       $('#total_servespecial' + id).val(costo);
//       $('#total_servespecial' + id).val(parseFloat($('#total_servespecial' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//       //costo total new
//       //var tu=$("#Tcosto_especial").val(0);
//       var i;
//       var sum = 0;
//       var ces;
//       for (i = 1; i <= contador_global2; i++) {
//         ces = 0;
//         ces = $('#total_servespecial' + i).val().replace(/,/g, '');
//         sum = parseFloat(sum) + parseFloat(ces);
//       }
//       $('#Tcosto_especial').val(sum);
//       $('#Tcosto_especial').val(parseFloat($('#Tcosto_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//       //valor total de cotizacion
//       $('#Ttarifa_especial').val(0);
//       $('#Tutilidad_especial').val(0);
//       $('#Trenta_especial').val(0);
//       var tser = $('#Tservicio_transporte').val().replace(/,/g, '');
//       var tesp = $('#Ttarifa_especial').val().replace(/,/g, '');
//       var totcot = parseFloat(tser) + parseFloat(tesp);
//       $('#Ttotal_cotizacion').val(totcot);
//       $('#Ttotal_cotizacion').val(parseFloat($('#Ttotal_cotizacion').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
//   //COSTO TOTAL
// }

// function cambiomerca(idm, id) {
//   $('#numeral_mer' + id).html('');
//   //alert('cambio');
//   //alert('valor select'+idm);
//   //alert('id '+id);
//   $('#numeral_mer' + id).html(idm);
// }

// var cuente = 0;
// function obtenerflete(valor, id, max) {
//   //alert('cambio de flete');
//   //alert (valor);
//   $('#flete' + id).val(0);
//   var origen = $('#origen_cliente' + id).val();
//   var destino = $('#destino_cliente' + id).val();
//   var tvehiculo = valor;
//   var i;
//   var sum = 0;
//   var dum = 0;

//   Calcular_Tarifa(id, origen, destino);

//   var flete = {
//     origen: origen,
//     destino: destino,
//     vehiculo: tvehiculo,
//     // action: 'traer_flete',
//   };

//   $.ajax({
//     // url: $('#base_url').val() + 'libs/servicio_cliente_ajax.php',
//     url: $('#base_url').val() + 'serviciocliente/Consultar_Flete',
//     type: 'POST',
//     data: flete,
//     dataType: 'json',
//     success: function (data) {
//       if (data) {
//         //$("#Tcosto_flete").val(0);
//         var costoflete = data[0].tarifa;
//         $('#flete' + id + '').val(costoflete);
//         $('#flete' + id + '').val(parseFloat($('#flete' + id + '').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

//         //utilidad
//         var calculo, resta, util, res;
//         var valor = $('#totaltarifa_cliente' + id).val().replace(/,/g, '');
//         resta = parseFloat(valor) - parseFloat(costoflete);
//         calculo = parseFloat(resta) / parseFloat(valor);
//         res = parseFloat(calculo) * 100;
//         res = res.toFixed(2);
//         $('.utilidad' + id).val(res);
//         $('.utilidad' + id).val(parseFloat($('.utilidad' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

//         //rentabilidad
//         recalcula_cifras();
//         var rent = parseFloat(valor) - parseFloat(costoflete);
//         $('#renta' + id).val(rent);
//         $('#renta' + id).val(parseFloat($('#renta' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//         //otros - obtener subtotales de la cotizacion
//         for (i = 1; i <= contador_global1; i++) {
//           var f = $('#flete' + i).val().replace(/,/g, '');
//           var t = $('#totaltarifa_cliente' + i).val().replace(/,/g, '');
//           sum = parseFloat(sum) + parseFloat(f);
//           //var y=parseFloat(sum)+parseFloat(costu);
//           dum = parseFloat(dum) + parseFloat(t);
//         }

//         //var costu=$("#Tcosto_flete").val();//0
//         //var y=parseFloat(sum)+parseFloat(costu);
//         var costot = $('#Tcosto_flete').val(sum);
//         var tartot = $('#Tservicio_transporte').val(dum);
//         //maquetar datos

//         //calcular utilidad total
//         var utitot = (parseFloat(dum) - parseFloat(sum)) / dum * 100;
//         utitot = utitot.toFixed(2);
//         $('#Tutilidad').val(utitot);

//         var rentot = parseFloat(dum) - parseFloat(sum);
//         $('#Trentabilidad').val(rentot);
//         //$("#Trentabilidad").val(parseFloat($("#Trentabilidad").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
//         //total cotización
//         var tesp = $('#Ttarifa_especial').val().replace(/,/g, '');
//         var totcot = parseFloat(dum) + parseFloat(tesp);
//         $('#Ttotal_cotizacion').val(totcot);
//         //$("#Ttotal_cotizacion").val(parseFloat($("#Ttotal_cotizacion").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
//         $('#Tcosto_flete').val(parseFloat($('#Tcosto_flete').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//         $('#Tservicio_transporte').val(parseFloat($('#Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//         $('#Tutilidad').val(parseFloat($('#Tutilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//         $('#Trentabilidad').val(parseFloat($('#Trentabilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//         $('#Ttotal_cotizacion').val(parseFloat($('#Ttotal_cotizacion').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

//         //fin for
//       } else {
//         alert('No existe un flete para esa asociación, por favor creelo.');
//       }
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       // console.log('no trajo flete');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
//   recalcula_cifras();
// }

// function Calcular_Tarifa(id, origen, destino) {
//   // var destino = $('#destino_cliente' + id).val();
//   var cliente = document.getElementById('id_cliente_seleccionado').value

//   var flete = {
//     cliente: cliente,
//     origen: origen,
//     destino: destino,
//   };

//   $.ajax({
//     // url: $('#base_url').val() + 'libs/servicio_cliente_ajax.php',
//     // url: $('#base_url').val() + 'serviciocliente/Consultar_venta_cliente',
//     url: $('#base_url').val() + 'serviciocliente/Consultar_Tarifa_Venta',
//     type: 'POST',
//     data: flete,
//     dataType: 'json',
//     success: function (data) {
//       if (data) {
//         //$("#Tcosto_flete").val(0);
//         var costoflete = data.tarifa;
//         $('#totaltarifa_cliente' + id + '').val(costoflete);
//         $('#totaltarifa_cliente' + id + '').val(parseFloat($('#totaltarifa_cliente' + id + '').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//         recalcula_cifras();
//         //fin for
//       } else {
//         alert('No existe un flete para esa asociación, por favor creelo.');
//       }
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       // console.log('no trajo flete');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

// //funcion para cargar clientes
// function cargar_clientes() {
//   // console.log("Entro en funcion rndcCargarVehiculoAseguradora");
//   $('#nit_cliente').val('');
//   $('#codigo_verifica').val('');
//   var params = {
//     accion: 'cargarclientes',
//   };
//   cargar_cliente = [];
//   $.ajaxSetup({ async: false });
//   $.post(
//     url,
//     params,
//     function (data) {
//       if (data.success) {
//         for (let x = 0; x < data.content.length; x++) {
//           cargar_cliente.push(data.content[x]['nombre']);
//         }
//         $('#caja_cliente.typeahead').typeahead(
//           {
//             minLength: 1,
//           },
//           {
//             name: 'states',
//             source: substringMatcher(cargar_cliente),
//           },
//         );

//         console.log('paso1');
//         $.ajaxSetup({ async: false });
//         $('#caja_cliente').bind('typeahead:selected', function (obj, datum, name) {
//           var params = {
//             accion: 'rndc_obtenerdatosaseguradora',
//             nombre: datum.split(' - ')[0],
//           };
//           console.log('paso2');
//           $.post(
//             url,
//             params,
//             function (data) {
//               // console.log(data);
//               if (data.success) {
//                 $('#nit_cliente').val(data.content[0]['documento']);
//                 $('#codigo_verifica').val(data.content[0]['digito_verificacion']);
//               } else {
//                 $('#nit_cliente').val('');
//                 $('#codigo_verifica').val('');
//               }
//               $('#direccion_cliente').focus();
//             },
//             'json',
//           );
//         });
//         $.ajaxSetup({ async: true });
//       }
//     },
//     'json',
//   );
//   $.ajaxSetup({ async: true });
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

// //funcion maquetear numeros del ver
// function maquetea_numerosb(ele) {
//   //alert('agua bendita');
//   var elemento = $(ele);
//   elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
// }

//calcular totales nuevamente
// function recalcula_cifras() {
//   var resum = 0;
//   let retari = 0;
//   let reutil = 0;
//   let rerenta = 0;
//   //especiales
//   let costoes = 0;
//   let taries = 0;
//   let utiles = 0;
//   let rentaes = 0;
//   $('.fletemer').each(function (index) {
//     var valorfle = $(this).val().replace(/,/g, '');
//     resum = parseFloat(resum) + parseFloat(valorfle);
//     //alert('TOTflete'+resum);
//     $('#Tcosto_flete').val(resum);
//   });
//   $('.tarifamer').each(function (index) {
//     var valortarifa = $(this).val().replace(/,/g, '');
//     retari = parseFloat(retari) + parseFloat(valortarifa);
//     //alert('TOTtari'+retari);
//     $('#Tservicio_transporte').val(retari);
//   });
//   $('.utilmer').each(function (index) {
//     var valorf = $('#Tcosto_flete').val().replace(/,/g, '');
//     var valort = $('#Tservicio_transporte').val().replace(/,/g, '');
//     restaT = parseFloat(valort) - parseFloat(valorf);
//     calculo = parseFloat(restaT) / parseFloat(valort);
//     res_utilidad = parseFloat(calculo) * 100;
//     res_utilidad = res_utilidad.toFixed(2);
//     $('#Tutilidad').val(res_utilidad);
//   });
//   $('.rentamer').each(function (index) {
//     var valorrenta = $(this).val().replace(/,/g, '');
//     rerenta = parseFloat(rerenta) + parseFloat(valorrenta);
//     //alert('TOTren'+rerenta);
//     $('#Trentabilidad').val(rerenta);
//   });
//   /*alert('renta'+retari);
//   alert('uti'+reutil);
//   alert('renta'+rerenta);*/
//   //especiales
//   if (typeof $('.tcostoesp').val() !== 'undefined') {
//     $('.tcostoesp').each(function (index) {
//       var valorcostoe = $(this).val().replace(/,/g, '');
//       costoes = parseFloat(costoes) + parseFloat(valorcostoe);
//       $('#Tcosto_especial').val(costoes);
//     });
//     $('.ttariesp').each(function (index) {
//       var valortari = $(this).val().replace(/,/g, '');
//       taries = parseFloat(taries) + parseFloat(valortari);
//       $('#Ttarifa_especial').val(taries);
//     });
//     $('.tutiesp').each(function () {
//       var valoru = $(this).val().replace(/,/g, '');
//       utiles = parseFloat(utiles) + parseFloat(valoru);
//       $('#Tutilidad_especial').val(utiles);
//     });
//     $('.trenesp').each(function (index) {
//       var valorrentes = $(this).val().replace(/,/g, '');
//       rentaes = parseFloat(rentaes) + parseFloat(valorrentes);
//       $('#Trenta_especial').val(rentaes);
//     });
//   } else {
//     //alert('cero dato especial');
//     //recalcula_cifras();
//     $('#Tcosto_especial').val(0);
//     $('#Ttarifa_especial').val(0);
//     $('#Tutilidad_especial').val(0);
//     $('#Trenta_especial').val(0);
//   }
//   //total cotizacion
//   var tarimer = $('#Tservicio_transporte').val().replace(/,/g, '');
//   var tariespe = $('#Ttarifa_especial').val().replace(/,/g, '');
//   var sumatot = parseFloat(tarimer) + parseFloat(tariespe);
//   $('#Ttotal_cotizacion').val(sumatot);
//   //formatear números
//   // $('.costos_flete').html(parseFloat($('#Tcosto_flete').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#Tcosto_flete').val(parseFloat($('#Tcosto_flete').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   // $('.tarifa_servicio_transporte').html(parseFloat($('#Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#Tservicio_transporte').val(parseFloat($('#Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   // $('.total_utilidad').html(parseFloat($('#Tutilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#Tutilidad').val(parseFloat($('#Tutilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   // $('.Total_rentabilidad').html(parseFloat($('#Trentabilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#Trentabilidad').val(parseFloat($('#Trentabilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   /* Servicios especiales */
//   // $('.costos_especial').html(parseFloat($('#Tcosto_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#Tcosto_especial').val(parseFloat($('#Tcosto_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   // $('.Total_tarifa_especial').html(parseFloat($('#Ttarifa_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#Ttarifa_especial').val(parseFloat($('#Ttarifa_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   // $('.Total_utilidad_especial').html(parseFloat($('#Tutilidad_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#Tutilidad_especial').val(parseFloat($('#Tutilidad_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   // $('.Total_renta_especial').html(parseFloat($('#Tcosto_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#Trenta_especial').val(parseFloat($('#Tcosto_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
//   $('#Ttotal_cotizacion').val(parseFloat($('#Ttotal_cotizacion').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
// }

// async function Inserta_Cotizacion(ventana_id) {
//   $('.nexos-messages').html('');
//   var estado = 'F3';
//   var estado_autorizado = 'autorizado';
//   var nit_empresa = $('#nit_empresa').val();
//   var digito_veri = $('#digito_verificacion').val();
//   var direccion_cotizacion = $('#direccion_cliente').val();
//   var cargar_cliente = $('#cargar_cliente').val();
//   var telefono = $('#telefono_cliente').val();
//   var procede_cliente = $('#procede_cliente').val();
//   var observacion_general = $('.observacion_general').val();
//   // var observacion = $('#observacion').val();
//   var elaborado_por = $('#elaborado_por').val();
//   var Nacional = $('#Nacional').is(':checked');
//   var Internacional = $('#Internacional').is(':checked');
//   var Almacenamiento = $('#Almacenamiento').is(':checked');
//   var user_log = $('#elaborado_por').val();
//   //total mercancia
//   var totalservi = $('#Tservicio_transporte').val().replace(/,/g, '');
//   var totalcoti = $('#Ttotal_cotizacion').val().replace(/,/g, '');
//   var totalcostof = $('#Tcosto_flete').val().replace(/,/g, '');
//   var totalutili = $('#Tutilidad').val().replace(/,/g, '');
//   var totalrenta = $('#Trentabilidad').val().replace(/,/g, '');
//   //total especial
//   var totalespecial = $('#Tcosto_especial').val().replace(/,/g, '');
//   var totaltaespecial = $('#Ttarifa_especial').val().replace(/,/g, '');
//   var totalutilespecial = $('#Tutilidad_especial').val().replace(/,/g, '');
//   var totalrentespecial = $('#Trenta_especial').val().replace(/,/g, '');
//   // var id_cliente = $('#id_cliente_cot').val();
//   var id_cliente = $('#id_cliente_seleccionado').val();
//   var id_empresa = $('#empresa_seleccionada_id').val();
//   var id_escenario = $('#escenarios').val();

//   //datos de negocio
//   var bloque_mercancia = {
//     mercanc: [],
//     natura: [],
//     valor: [],
//     servicio: [],
//     empaque: [],
//     operacion: [],
//     trnsporte: [],
//     cant_vehic: [],
//     origen: [],
//     destino: [],
//     vehiculo: [],
//     pesobruto: [],
//     pesoneto: [],
//     brutotn: [],
//     cantidad: [],
//     alto: [],
//     largo: [],
//     ancho: [],
//     volumen: [],
//     flete: [],
//     tarifa: [],
//     utilidad: [],
//     rentable: [],
//     observa: [],
//     itemm: [],
//     idproducto: [],
//     itr: [],
//   };

//   $('.tmerca').each(function (index) {
//     var a = $(this).val();
//     bloque_mercancia.mercanc[index] = a;
//   });
//   $('.natumer').each(function (index) {
//     var n = $(this).val();
//     bloque_mercancia.natura[index] = n;
//   });
//   $('.valor_merca').each(function (index) {
//     var v = $(this).val().replace(/,/g, '');
//     bloque_mercancia.valor[index] = v;
//   });
//   $('.ts').each(function (index) {
//     var servi = $(this).val();
//     bloque_mercancia.servicio[index] = servi;
//   });
//   $('.empaquemer').each(function (index) {
//     var empaque = $(this).val();
//     bloque_mercancia.empaque[index] = empaque;
//   });
//   $('.operamer').each(function (index) {
//     var operacion = $(this).val();
//     bloque_mercancia.operacion[index] = operacion;
//   });
//   $('.ttransportemer').each(function (index) {
//     var tipotrans = $(this).val();
//     bloque_mercancia.trnsporte[index] = tipotrans;
//   });
//   $('.originario').each(function (index) {
//     var origen = $(this).val();
//     bloque_mercancia.origen[index] = origen;
//   });
//   $('.destinar').each(function (index) {
//     var destino = $(this).val();
//     bloque_mercancia.destino[index] = destino;
//   });
//   $('.tipovehiculo').each(function (index) {
//     var tvehiculo = $(this).val();
//     bloque_mercancia.vehiculo[index] = tvehiculo;
//   });

//   $('.cantvehiculo').each(function (index) {
//     var cant_vehiculo = $(this).val();
//     bloque_mercancia.cant_vehic[index] = cant_vehiculo;
//   });

//   // $('.cantgastamer').each(function (index) {
//   //   var cant_vehiculo = $(this).val();
//   //   bloque_mercancia.cant_vehic[index] = cant_vehiculo;
//   // });

//   $('.pesobruto').each(function (index) {
//     //peso bruto kg
//     var pbruto = $(this).val().replace(/,/g, '');
//     bloque_mercancia.pesobruto[index] = pbruto;
//   });
//   $('.pnetomer').each(function (index) {
//     var pneto = $(this).val().replace(/,/g, '');
//     bloque_mercancia.pesoneto[index] = pneto;
//   });
//   $('.pesobrutoton').each(function (index) {
//     var pbrutotn = $(this).val().replace(/,/g, '');
//     bloque_mercancia.brutotn[index] = pbrutotn;
//   });
//   $('.cantidadmer').each(function (index) {
//     var canti = $(this).val().replace(/,/g, '');
//     bloque_mercancia.cantidad[index] = canti;
//   });
//   $('.altomer').each(function (index) {
//     var altom = $(this).val().replace(/,/g, '');
//     bloque_mercancia.alto[index] = altom;
//   });
//   $('.largomer').each(function (index) {
//     var largom = $(this).val().replace(/,/g, '');
//     bloque_mercancia.largo[index] = largom;
//   });
//   $('.anchomer').each(function (index) {
//     var anchom = $(this).val().replace(/,/g, '');
//     bloque_mercancia.ancho[index] = anchom;
//   });
//   $('.volumenmer').each(function (index) {
//     var volumenm = $(this).val().replace(/,/g, '');
//     bloque_mercancia.volumen[index] = volumenm;
//   });
//   $('.fletemer').each(function (index) {
//     var valflete = $(this).val().replace(/,/g, '');
//     bloque_mercancia.flete[index] = valflete;
//   });
//   $('.tarifamer').each(function (index) {
//     var tarifa = $(this).val().replace(/,/g, '');
//     bloque_mercancia.tarifa[index] = tarifa;
//   });
//   $('.utilmer').each(function (index) {
//     var util = $(this).val().replace(/,/g, '');
//     bloque_mercancia.utilidad[index] = util;
//   });
//   $('.rentamer').each(function (index) {
//     var renta = $(this).val().replace(/,/g, '');
//     bloque_mercancia.rentable[index] = renta;
//   });
//   $('.observamer').each(function (index) {
//     var observacion = $(this).val();
//     bloque_mercancia.observa[index] = observacion;
//   });
//   $('.item_merca').each(function (index) {
//     var itembloquemerca = $(this).val();
//     bloque_mercancia.itemm[index] = itembloquemerca;
//   });

//   $('.idproducto').each(function (index) {
//     var idproducto = $(this).val();
//     bloque_mercancia.idproducto[index] = idproducto;
//   });

//   $('.itr').each(function (index) {
//     var itr = $(this).val();
//     bloque_mercancia.itr[index] = itr;
//   });

//   var mercancias = bloque_mercancia;
//   mercancias = JSON.stringify(mercancias);
//   //datos especiales
//   if (typeof $('.tcostoesp').val() !== 'undefined' || typeof $('.tiposerviespe').val() !== 'undefined') {
//     bloque_especial = {
//       tipo_servicio: [],
//       cant: [],
//       costo_uni: [],
//       tarifa_uni: [],
//       calculo: [],
//       tarifa: [],
//       utilidad: [],
//       rentabi: [],
//       item_mercancia: [],
//       item_especial: [],
//     };

//     $('.tiposerviespe').each(function (index) {
//       var service = $(this).val();
//       bloque_especial.tipo_servicio[index] = service;
//     });
//     $('.cantiespec').each(function (index) {
//       var cant = $(this).val();
//       bloque_especial.cant[index] = cant;
//     });
//     $('.valoruni').each(function (index) {
//       var costo_uni = $(this).val().replace(/,/g, '');
//       bloque_especial.costo_uni[index] = costo_uni;
//     });
//     $('.tarifaespe').each(function (index) {
//       var tarifa = $(this).val().replace(/,/g, '');
//       bloque_especial.tarifa_uni[index] = tarifa;
//     });
//     $('.tcostoesp').each(function (index) {
//       var costo = $(this).val().replace(/,/g, '');
//       bloque_especial.calculo[index] = costo;
//     });
//     $('.ttariesp').each(function (index) {
//       var tarifa = $(this).val().replace(/,/g, '');
//       bloque_especial.tarifa[index] = tarifa;
//     });
//     $('.tutiesp').each(function (index) {
//       var util = $(this).val().replace(/,/g, '');
//       bloque_especial.utilidad[index] = util;
//     });
//     $('.trenesp').each(function (index) {
//       var rentab = $(this).val().replace(/,/g, '');
//       bloque_especial.rentabi[index] = rentab;
//     });
//     $('.numeral_mer').each(function (index) {
//       var itemmerk = $(this).html();
//       bloque_especial.item_mercancia[index] = itemmerk;
//     });
//     $('.numerale_espe').each(function (index) {
//       var itemspecial = $(this).html();
//       bloque_especial.item_especial[index] = itemspecial;
//     });
//     var especiales = bloque_especial;
//     especiales = JSON.stringify(especiales);
//   } else {
//     especiales = '';
//   }

//   /* Variables de solictud de servicio */
//   //registrar
//   var n = undefined;
//   var es = 'Pendiente';
//   // Obtener el valor del primer elemento con la clase .originario
//   var origen = $('.originario').first().val() || "";
//   var ori = origen;

//   // Obtener el valor del primer elemento con la clase .destinar
//   var destino = $('.destinar').first().val() || "";
//   var dest = destino;

//   // Obtener el valor del primer elemento con el id #pnetomer
//   let peso_neto = 0;
//   $('.pnetomer').each(function () {
//     peso_neto = $(this).val() || 0; // Asignar el valor o 0 si está vacío
//   });
//   var peso = parseInt(peso_neto);

//   // Obtener el valor del primer elemento con la clase .tipovehiculo
//   var tvehiculo = 0;
//   $('.tipovehiculo').each(function () {
//     tvehiculo = $(this).val() || 0; // Asignar el valor o 0 si está vacío
//   });
//   var tipo_veh = tvehiculo;
//   // var flete = $('#flete').val();
//   var flete = $('#Tcosto_flete').val().replace(/,/g, '');
//   var cliente = $('#nombre_clientes').val();
//   // var cliente = $('#cliente').val();
//   // var pareja = $('#pareja').val();
//   var pareja = undefined;
//   var observacion = $('#observacion').val();
//   // var observacion_general = $('.observacion_general').val();
//   var agencia = $('#agencia').val();
//   var cont_opcion = $('#cnt_opcion').val();
//   var cont_dias = $('#cnt_dias').val();
//   var cont_municipio = $('#cnt_municipio').val();
//   var cont_direccion = $('#cnt_direccion').val();
//   var cont_tipo = $('#cnt_tipocon').val();
//   var cont_num = $('#cnt_num').val();
//   var cont_comodato = $('#cnt_fcomodato').val();
//   var cont_peso = $('#cnt_peso').val();
//   // var cant_solicitada = $('#cant_vehiculo').val();
//   var cant_solicitada = 1;
//   // var cant_disponible = $('#cant_disponible').val();
//   var cant_disponible = 1;
//   var t = $('#group').val();
//   var hocliente = $('#houremail').val();

//   /***************************Puntos de Entrega(Remitentes)***********************************/
//   var maximo = $('#maximo_entregab').val();
//   var peso_remitente = 0;
//   // if (ID === '3' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === 1 && BLOQUE_MERCANCIA === 1 && SERVICIO === 'Expreso' ||
//   //   ID === '4' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === 1 && SERVICIO === 'Expreso' ||
//   //   ID === '7' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === 1 && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso' ||
//   //   ID === '8' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Expreso' ||
//   //   ID === '11' && VEHICULO === 1 && REMITENTE === '+1' && DESTINATARIO === '+1' && BLOQUE_MERCANCIA === '+1' && SERVICIO === 'Consolidado') {

//   // } else {
//   //   peso_remitente = $('#peso1').val() || '';
//   // }
//   let total = 0;
//   let errores = [];
//   document.querySelectorAll(".re_peso").forEach(function (input) {
//     // Convertir valor a número
//     const valor = parseFloat(input.value) || 0;

//     // Validaciones individuales (ejemplo)
//     if (input.value === "") {
//       errores.push(`El campo ${input.name} está vacío`);
//     }

//     if (valor < 0) {
//       errores.push(`El campo ${input.name} no puede ser negativo`);
//     }

//     // Sumar al total
//     total += valor;
//   });

//   // Validación del total
//   if (total <= 0) {
//     errores.push("El total debe ser mayor a cero");
//   }

//   // Mostrar errores o total
//   if (errores.length > 0) {
//     console.error("Errores:", errores);
//     alert(errores.join("\n"));
//     return false;
//   } else {
//     peso_remitente = total
//   }


//   var dato_Remitente = {
//     idpuntrem: [],
//     mentrega: [],
//     dire: [],
//     clientea: [],
//     fentrega: [],
//     obs: [],
//     hora: [],
//     tipo: [],
//     orden: [],
//     pun: [],
//     telefono: [],
//     pesorem: [],
//     place: [],
//   };

//   for (let i = 1; i <= maximo; i++) {
//     // Obtener valores
//     const idpuntrem = $('#id_puntorem' + i).val() || '';
//     const mentrega = $('#p_ciudad' + i).val() || '';
//     const dire = $('#dire' + i).val() || '';
//     const clientea = $('#clientea' + i).val() || '';
//     const fentrega = $('#fecha' + i).val() || '';
//     const obs = $('#observa' + i).val() || '';
//     const hora = $('#hora' + i).val() || '';
//     const tipo = 'punto recogida';  // Valor fijo
//     const orden = $('#id_puntorem' + i).val() || '';
//     const pun = $('#pun').val() || '';  // ¿Debería ser $('#pun' + i)?
//     const telefono = $('#telpunto' + i).val() || '';
//     const pesorem = $('#peso' + i).val() || '';
//     const place = $('#lugar' + i).val() || '';

//     // Llenar el objeto
//     dato_Remitente.idpuntrem.push(idpuntrem);
//     dato_Remitente.mentrega.push(mentrega);
//     dato_Remitente.dire.push(dire);
//     dato_Remitente.clientea.push(clientea);
//     dato_Remitente.fentrega.push(fentrega);
//     dato_Remitente.obs.push(obs);
//     dato_Remitente.hora.push(hora);
//     dato_Remitente.tipo.push(tipo);
//     dato_Remitente.orden.push(orden);
//     dato_Remitente.pun.push(pun);
//     dato_Remitente.telefono.push(telefono);
//     dato_Remitente.pesorem.push(pesorem);
//     dato_Remitente.place.push(place);
//   }

//   var datos_remitentes = dato_Remitente;
//   datos_remitentes = JSON.stringify(datos_remitentes);

//   /******************************Puntos Entrega (Destinatario)*************************************/
//   var nFilas = $('.insercion_destina').length;
//   // var nFilas = 1;
//   if (nFilas > 0) {
//     var dato_destinatario = {
//       idrem: [],
//       destinatario: [],
//       ciudad: [],
//       direccion: [],
//       telefono: [],
//       fecha: [],
//       //observacion:[],
//       pesobruto: [],
//       lugar: [],
//       hora: [],
//       observacion: [],
//     };

//     $('.idrem_d').each(function (index) {
//       var idremi = $(this).val();
//       dato_destinatario.idrem[index] = idremi;
//     });

//     $('.de_cliente').each(function (index) {
//       var desti = $(this).val();
//       dato_destinatario.destinatario[index] = desti;
//     });

//     $('.de_ciudad').each(function (index) {
//       var ciudaddesti = $(this).val();
//       dato_destinatario.ciudad[index] = ciudaddesti;
//     });

//     $('.de_dire').each(function (index) {
//       var diredesti = $(this).val();
//       dato_destinatario.direccion[index] = diredesti;
//     });

//     $('.tel_dire').each(function (index) {
//       var teldesti = $(this).val();
//       dato_destinatario.telefono[index] = teldesti;
//     });

//     $('.de_fecha').each(function (index) {
//       var fechadesti = $(this).val();
//       dato_destinatario.fecha[index] = fechadesti;
//     });

//     $('.de_peso').each(function (index) {
//       var pbrutodesti = $(this).val();
//       dato_destinatario.pesobruto[index] = pbrutodesti;
//     });

//     $('.de_lugar').each(function (index) {
//       var lugardesti = $(this).val();
//       dato_destinatario.lugar[index] = lugardesti;
//     });

//     $('.de_hora').each(function (index) {
//       var horad = $(this).val();
//       dato_destinatario.hora[index] = horad;
//     });

//     $('.de_obser').each(function (index) {
//       var obsedesti = $(this).val();
//       dato_destinatario.observacion[index] = obsedesti;
//     });

//     var datos_destinatario = dato_destinatario;
//     datos_destinatario = JSON.stringify(datos_destinatario);
//   }

//   var datos_solicitud = {
//     numero: n,
//     estado: es,
//     ori: ori,
//     dest: dest,
//     peso: peso_remitente,
//     tipo_veh: tipo_veh,
//     flete: flete,
//     cliente: cliente,
//     pareja: pareja,
//     observacion: observacion,
//     agencia: agencia,
//     cont_opcion: cont_opcion,
//     cont_dias: cont_dias,
//     cont_municipio: cont_municipio,
//     cont_direccion: cont_direccion,
//     cont_tipo: cont_tipo,
//     cont_num: cont_num,
//     cont_comodato: cont_comodato,
//     cont_peso: cont_peso,
//     grupo: t,
//     horacliente: hocliente,
//     cant_solicitada: cant_solicitada,
//     cant_disponible: cant_disponible,
//     peso: peso,
//     maximo: maximo,
//     datos_destinatario: datos_destinatario,
//     datos_remitentes: datos_remitentes,
//     nFilas: nFilas,
//   };

//   $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
//   // Crear una instancia de FormData
//   let formData = new FormData();

//   // Agregar los parámetros al FormData
//   formData.append('nit', nit_empresa);
//   formData.append('digito', digito_veri);
//   formData.append('direccion_cotizacion', direccion_cotizacion);
//   formData.append('telefono', telefono);
//   formData.append('procedencia', procede_cliente);
//   formData.append('observacion_general', observacion_general);
//   formData.append('usuario_elaborado', elaborado_por); // Cambiar nombre del parámetro
//   formData.append('check', Nacional);
//   formData.append('usuario_log', user_log); // Cambiar nombre del parámetro
//   formData.append('total_transporte', totalservi);
//   formData.append('Ttotal_cotizacion', totalcoti);
//   formData.append('Tcosto_flete', totalcostof);
//   formData.append('Tutilidad', totalutili);
//   formData.append('Trentabilidad', totalrenta);
//   formData.append('Tcosto_especial', totalespecial);
//   formData.append('Ttarifa_especial', totaltaespecial);
//   formData.append('Tutilidad_especial', totalutilespecial);
//   formData.append('Trenta_especial', totalrentespecial);
//   formData.append('name_cliente', cargar_cliente);
//   formData.append('bloques_negocio', mercancias);
//   formData.append('bloque_datoespecial', especiales);
//   formData.append('clienteid', id_cliente);
//   formData.append('escenario_id', id_escenario);
//   // formData.append('CostosEficientesSicetac', CostosEficientesSicetac);
//   //EMPRESA DEL CLIENTE AL QUE SE LE REALIZA LA SOLICITUD DE SERVICIO
//   formData.append('empresa_id', id_empresa);
//   for (const key in datos_solicitud) {
//     if (datos_solicitud.hasOwnProperty(key)) {
//       formData.append(key, datos_solicitud[key]);
//     }
//   }

//   try {
//     const response = await fetch($('#base_url').val() + 'serviciocliente/CrearCotizacion', {
//       method: 'POST',
//       body: formData,
//       cache: 'no-cache',
//     });
//     const data = await response.json();
//     if (data.numero === 200) {
//       Swal.fire({
//         title: "Exito!",
//         html: data.mensaje,
//         icon: "success",
//         draggable: true,
//         showConfirmButton: true,
//       });
//       $('#bloque_formulario').animate({ scrollTop: 0 }, 800);
//       Limpiar_formulario();
//     } else if (data.numero === 400) {
//       Swal.fire({
//         title: "Error!",
//         html: data.mensaje,
//         icon: "error",
//         draggable: true,
//         showConfirmButton: true,
//       });
//       $('#bloque_formulario').animate({ scrollTop: 0 }, 800);
//     }
//   } catch (error) {
//     console.error('Error en la primera solicitud:', error);
//     throw error;
//   } finally {
//     $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
//   }
// }

function Limpiar_formulario() {
  $('#nit_empresa').val('');
  $('#digito_verificacion').val('');
  $('#direccion_cliente').val('');
  $('#telefono_cliente').val('');
  $('#procede_cliente').val('');
  $('.idproducto').val('');
  $('.rndcproducto').val('');
  $('.tmerca').val('').trigger('change');
  $('.natumer').val('');
  $('.valor_merca').val('');
  $('.ts').val('');
  $('.empaquemer').val('').trigger('change');
  $('.operamer').val('');
  $('.ttransportemer').val('');
  $('.cantvehi').val('');
  $('.originario').val('').trigger('change');
  $('.destinar').val('').trigger('change');
  $('.tipovehiculo').val('');
  $('.cantgastamer').val('');
  $('.pesobruto').val('');
  $('.pnetomer').val('');
  $('.pesobrutoton').val('');
  $('.cantidadmer').val('');
  $('.altomer').val('');
  $('.largomer').val('');
  $('.anchomer').val('');
  $('.volumenmer').val('');
  $('.fletemer').val('');
  $('.tarifamer').val('');
  $('.utilmer').val('');
  $('.rentamer').val('');
  $('.observamer').val('');
  $('.tiposerviespe').val('');
  $('.cantiespec').val('');
  $('.valoruni').val('');
  $('.tarifaespe').val('');
  $('.tcostoesp').val('');
  $('.ttariesp').val('');
  $('.tutiesp').val('');
  $('.trenesp').val('');
  $('.cantvehiculo').val('');
  $('#observacion').val('');
  $('#Tcosto_flete').val('');
  $('#Tservicio_transporte').val('');
  $('#Tutilidad').val('');
  $('#Trentabilidad').val('');
  $('#Tcosto_especial').val('');
  $('#Ttarifa_especial').val('');
  $('#Tutilidad_especial').val('');
  $('#Trenta_especial').val('');
  $('#Ttotal_cotizacion').val('');
  $('#observacion').val('');
  $('#identi').val('');
  $('.observacion_general').val('');
  $('#documento').val('');
  $('#nombre_clientes').val('');
  $('#correo').val('');
  $('#tipo_documento').val('');
  // $("#table_mercancia").html("");
  // $("#table_especial").html("");
  cont = 0;
  con = 0;
  //$("#nexos_messages_popup").toggle();
  //$("#nexos_messages_confirmacion").toggle();
  $('#nexos_messages_popup').html('');
  $('#nexos_messages_confirmacion').html('');
  // $("#tbl_cliente").empty();
  $('.documento').empty();
  $('.nombre').empty();
  $('.ubicacion').empty();
  $('.telefono').empty();
  $('.correo').empty();
  $('.tipo_documento').empty();
  $('#tbl_mercancia tbody').empty();
  $('#tbl_especiales tbody').empty();

  //Limpiar remitentes y destinatarios
  $("#remitentes_menu").empty();
  $("#nav_contenedor").empty();
  s = 0;
  $("#destinatarios_menu").empty();
  $("#accordion_destinatario").empty();
  d = 0;
  $("#agencia").val('');
  $('#group').val('').trigger('change');
  $('#houremail').val('').trigger('change');
  $("#table_mercancia").empty();
  contador_global2 = 0;
  $("#maximo_entregab").val('');
  $("#escenarios").val('');
}

function Limpiar_formulario_cambio_escenario() {
  $('#nit_empresa').val('');
  $('#digito_verificacion').val('');
  $('#direccion_cliente').val('');
  $('#telefono_cliente').val('');
  $('#procede_cliente').val('');
  $('.idproducto').val('');
  $('.rndcproducto').val('');
  $('.tmerca').val('').trigger('change');
  $('.natumer').val('');
  $('.valor_merca').val('');
  $('.ts').val('');
  $('.empaquemer').val('').trigger('change');
  $('.operamer').val('');
  $('.ttransportemer').val('');
  $('.cantvehi').val('');
  $('.originario').val('').trigger('change');
  $('.destinar').val('').trigger('change');
  $('.tipovehiculo').val('');
  $('.cantgastamer').val('');
  $('.pesobruto').val('');
  $('.pnetomer').val('');
  $('.pesobrutoton').val('');
  $('.cantidadmer').val('');
  $('.altomer').val('');
  $('.largomer').val('');
  $('.anchomer').val('');
  $('.volumenmer').val('');
  $('.fletemer').val('');
  $('.tarifamer').val('');
  $('.utilmer').val('');
  $('.rentamer').val('');
  $('.observamer').val('');
  $('.tiposerviespe').val('');
  $('.cantiespec').val('');
  $('.valoruni').val('');
  $('.tarifaespe').val('');
  $('.tcostoesp').val('');
  $('.ttariesp').val('');
  $('.tutiesp').val('');
  $('.trenesp').val('');
  $('.cantvehiculo').val('');
  $('#observacion').val('');
  $('#Tcosto_flete').val('');
  $('#Tservicio_transporte').val('');
  $('#Tutilidad').val('');
  $('#Trentabilidad').val('');
  $('#Tcosto_especial').val('');
  $('#Ttarifa_especial').val('');
  $('#Tutilidad_especial').val('');
  $('#Trenta_especial').val('');
  $('#Ttotal_cotizacion').val('');
  $('#observacion').val('');
  $('#identi').val('');
  $('.observacion_general').val('');
  $('#documento').val('');
  $('#nombre_clientes').val('');
  $('#correo').val('');
  $('#tipo_documento').val('');
  // $("#table_mercancia").html("");
  // $("#table_especial").html("");
  cont = 0;
  con = 0;
  //$("#nexos_messages_popup").toggle();
  //$("#nexos_messages_confirmacion").toggle();
  $('#nexos_messages_popup').html('');
  $('#nexos_messages_confirmacion').html('');
  // $("#tbl_cliente").empty();
  $('.documento').empty();
  $('.nombre').empty();
  $('.ubicacion').empty();
  $('.telefono').empty();
  $('.correo').empty();
  $('.tipo_documento').empty();
  $('#tbl_mercancia tbody').empty();
  $('#tbl_especiales tbody').empty();

  //Limpiar remitentes y destinatarios
  $("#remitentes_menu").empty();
  $("#nav_contenedor").empty();
  s = 0;
  $("#destinatarios_menu").empty();
  $("#accordion_destinatario").empty();
  d = 0;
  $("#agencia").val('');
  $('#group').val('').trigger('change');
  $('#houremail').val('').trigger('change');
  $("#table_mercancia").empty();
  contador_global2 = 0;
  $("#maximo_entregab").val('');
  // $("#escenarios").val('');
}

/* Fucion para renderizar el compoenente depues de gaurdar la solicitu de servicio */
function Renderizar_ventana_solicitud() {
  try {
    fetch($('#base_url').val() + 'serviciocliente/nueva')
      .then(response => response.text())
      .then(data => {
        window.location.reload();
        // document.getElementById('contenido_ventana-' + ventana).innerHTML = data;
        // Ejecuta el JavaScript específico de la ventana
        // ejecutarJavaScriptDeVentana(ventana);
      })
      .catch(error => console.log(error));
  } catch (error) {
    console.log(error);
  } finally {
    cargar_filtros(controlador, ventana);
  }
}

function Recargar() {
  location.reload();
}

function Mensaje(Numero, Mensaje) {
  if (Numero === 200) {
    $('#nft-default').modal('show');
    // $mensaje = 'Cotizacion creada en el sistema.';
    $('#nexos_messages_popup2').html(
      '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><i class="fas fa-check"></i></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Mensaje! </strong>' +
      Mensaje +
      '</div></div>',
    );
    contador_global1 = 0;
    contador_global2 = 0;
    $('#nexos_messages_confirmacion2').html(
      `<div role="alert" class="alert alert-primary alert-icon alert-icon-border alert-dismissible">
        <div class="icon"><i class="fas fa-info"></i></div>
          <div class="message">
          <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button>
            <strong>Mensaje!</strong> Desea registrar una nueva cotización.
            <div class="row text-center" >
              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group">
                <button type="button" class="btn btn-success" onclick="Cierra_Mensaje();">Aceptar</button>
                <button type="button" class="btn btn-danger" onClick="Recargar();">Cancelar</button>
              </div>
            </div>
          </div>
      </div>`,
    );
    $('#nexos_messages_popup2').css('display', 'block');
    $('#nexos_messages_confirmacion2').css('display', 'block');
  } else {
    $('#nft-default').modal('show');
    // $mensaje = 'Cotizacion creada en el sistema.';
    $('#nexos_messages_popup2').html(
      `<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert" style="height: 15px;">
                    <div class="icon"><span class="mdi mdi-alert-triangle"></span></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> ${Mensaje}
                    </div>
                  </div>`,
    );
    $('#nexos_messages_popup2').css('display', 'block');
    $('#nexos_messages_confirmacion2').css('display', 'block');
  }
}

function Cierra_Mensaje() {
  Limpiar_formulario();
  $('#nft-default').modal('hide');
}

/* Funciones para valdiar si la solictud es itr y sus reglas */
// function Validar_operacion_itr(id) {
//   if ($('#itr' + id + '').val() === 'Si') {
//     var select = document.getElementById('tipotr' + id);
//     // console.log('🚀 ~ Validar_operacion_itr ~ select:', select);
//     // Establece el valor del select
//     select.value = 'Urbano';
//     // Deshabilita todas las opciones excepto la seleccionada
//     var options = select.options;
//     for (var i = 0; i < options.length; i++) {
//       if (options[i].value !== 'Urbano') {
//         options[i].disabled = true; // Deshabilitar
//       } else {
//         options[i].disabled = false; // Asegurarse de que la seleccionada esté habilitada
//       }
//     }
//     /* Validar el tipo de servicio */
//     var select_tipo_servicio = document.getElementById('servicio_cliente' + id);
//     // Establece el valor del select
//     select_tipo_servicio.value = 'Expreso';
//     // Deshabilita todas las opciones excepto la seleccionada
//     var options_tipo_servicio = select_tipo_servicio.options;
//     for (var i = 0; i < options_tipo_servicio.length; i++) {
//       if (options_tipo_servicio[i].value !== 'Expreso') {
//         options_tipo_servicio[i].disabled = true; // Deshabilitar
//       } else {
//         options_tipo_servicio[i].disabled = false; // Asegurarse de que la seleccionada esté habilitada
//       }
//     }
//   } else {
//     var select = document.getElementById('tipotr' + id);
//     // Establece el valor del select
//     select.value = '';
//     // Deshabilita todas las opciones excepto la seleccionada
//     var options = select.options;
//     for (var i = 0; i < options.length; i++) {
//       if (options[i].value !== '') {
//         options[i].disabled = false; // Deshabilitar
//       } else {
//         options[i].disabled = true; // Asegurarse de que la seleccionada esté habilitada
//       }
//     }

//     /* Validar el tipo de servicio */
//     var select_tipo_servicio = document.getElementById('servicio_cliente' + id);
//     // Establece el valor del select
//     select_tipo_servicio.value = '';
//     // Deshabilita todas las opciones excepto la seleccionada
//     var options_tipo_servicio = select_tipo_servicio.options;
//     for (var i = 0; i < options_tipo_servicio.length; i++) {
//       if (options_tipo_servicio[i].value !== '') {
//         options_tipo_servicio[i].disabled = false; // Deshabilitar
//       } else {
//         options_tipo_servicio[i].disabled = true; // Asegurarse de que la seleccionada esté habilitada
//       }
//     }
//   }
// }

function ir_modulofletes() {
  var url = $("#base_url").val() + 'fletes_nacional/fletes_nacional/?idmenu=3';
  window.open(url, '_blank');
}

function ir_modulotiposervi() {
  var url = $("#base_url").val() + 'tipo_servicio_mercancia/index_tiposervicio/?idmenu=3';
  window.open(url, '_blank');
}

$("#e_agregar_especial").click(function () {
  alert('agregar especial');
  agregar_especial_editar();
});

//Ver solicitud de servicio
function Ver_solicitud(url, numdoc_solicitud) {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      numdoc_solicitud: numdoc_solicitud,
    })
  })
    .then(response => response.text())  // Usa text() si es HTML, o .json() si esperas JSON
    .then(data => {
      document.getElementById('contenido_ventana').innerHTML = data;
    })
    .catch(error => console.log(error));
}