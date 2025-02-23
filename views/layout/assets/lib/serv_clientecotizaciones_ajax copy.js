$(document).ready(function() {
  var tipo = $('#tipotb').val();
  var fecha_inicial = $('#fecha_incia').val();
  var fecha_final = $('#fecha_fin').val();
  listar_cotizaciones(tipo, fecha_inicial, fecha_final);

  $('#btn_aceptar').click(function(e) {
    e.preventDefault();
    location.reload();
  });

  $('#btn_cancelar').click(function(e) {
    e.preventDefault();
    $('#md-fullWidth').modal('show');
    $('#md-footer-mensaje').modal('hide');
    $('#tb_solicitud').modal('hide');
  });

  $('#btn_crear').on('click', function(e) {
    e.preventDefault();
    if (document.getElementById('tabla_lista_cotizaciones')) {
      document.getElementById('filtro_busqueda').style.display = 'none';
      document.getElementById('tabla_lista_cotizaciones').style.display = 'none';
      document.getElementById('bloque_formulario').style.display = 'block';
    } else {
      document.getElementById('filtro_busqueda').style.display = 'none';
      // document.getElementById("tabla_lista_cotizaciones").style.display = "none";
      document.getElementById('bloque_formulario').style.display = 'block';
    }
  });

  $('#btn_crea').click(function() {
    $('.titulogeneral').hide();
    $('.formulario').hide();
    $('.datosconductor').hide();
    $('.total_oculto').hide();

    // cargarmunicipios();
    $('#cliente2').html('');
    $('#cargar_cliente').val('');
    $('#caja_cliente').html('<input type="text"  placeholder="Cliente"   class="typeahead form-control input-sm" id="nombre_cliente">');
    cargar_clientes();
  });

  $('#btn_agregar_cotizacion').click(function() {
    //validaciones
    var msg_error = '';

    if (!$('#nit_empresa').val()) {
      msg_error += '<p>Debe seleccionar un <strong>cliente</strong> para realizarla cotización.</p>';
      $('.documento').css('background-color', 'rgb(254,242,181)');
      $('.nombre').css('background-color', 'rgb(254,242,181)');
      $('.ubicacion').css('background-color', 'rgb(254,242,181)');
      $('.telefono').css('background-color', 'rgb(254,242,181)');
      $('.correo').css('background-color', 'rgb(254,242,181)');
      $('.tipo_documento').css('background-color', 'rgb(254,242,181)');
    } else {
      $('.documento').css('background-color', 'rgb(255,255,255)');
      $('.nombre').css('background-color', 'rgb(255,255,255)');
      $('.ubicacion').css('background-color', 'rgb(255,255,255)');
      $('.telefono').css('background-color', 'rgb(255,255,255)');
      $('.correo').css('background-color', 'rgb(255,255,255)');
      $('.tipo_documento').css('background-color', 'rgb(255,255,255)');
    }

    if (!$('#procede_cliente').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Procedencia</strong> para poder crear la cotización.</p>';
      $('#procede_cliente').focus().css('background-color', 'rgb(254,242,181)');
    } else {
      $('#procede_cliente').blur().css('background-color', 'white');
    }

    $('.tmerca').each(function(index) {
      var mercancia = $(this).val();
      if (!mercancia) {
        //alert(document.getElementsByClassName("tmerca")[0].id);
        msg_error += '<p>Debe diligenciar el campo <strong>Mercancía - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.tmerca').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.tmerca').blur().css('background-color', 'white');
      }
    });

    $('.natumer').each(function(index) {
      var naturaleza = $(this).val();
    });

    $('.valor_merca').each(function(index) {
      var valor = $(this).val();
      if (!valor) {
        msg_error +=
          '<p>Debe diligenciar el campo <strong>Valor declarado - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.valor_merca').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.valor_merca').blur().css('background-color', 'white');
      }
    });

    $('.ts').each(function(index) {
      var tiposervicio = $(this).val();
      if (!tiposervicio) {
        msg_error +=
          '<p>Debe diligenciar el campo <strong>Tipo servicio - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.ts').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.ts').blur().css('background-color', 'white');
      }
    });

    //operacion
    $('.operamer').each(function(index) {
      var operacion = $(this).val();
      if (!operacion) {
        msg_error +=
          '<p>Debe diligenciar el campo <strong>Tipo de Operación - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.operamer').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.operamer').blur().css('background-color', 'white');
        for (var i = 0; i <= contador_global1; i++) {
          if (
            typeof document.getElementsByClassName('operamer')[i] !== 'undefined' &&
            typeof document.getElementsByClassName('operamer')[i] !== undefined &&
            document.getElementsByClassName('empaquemer')[i] !== undefined &&
            document.getElementsByClassName('rndcproducto')[i] !== undefined
          ) {
            let operacion = document.getElementsByClassName('operamer')[i].id;
            let empaque = document.getElementsByClassName('empaquemer')[i].id;
            let producto = document.getElementsByClassName('rndcproducto')[i].id;
            if (typeof operacion != 'undefined' && typeof empaque != 'undefined' && producto != 'undefined') {
              if ($('#' + operacion + '').val() === 'V') {
                //contenedor vacio
                if ($('#' + empaque + '').val() == 8 || $('#' + empaque + '').val() == 9 || $('#' + empaque + '').val() == 10) {
                } else {
                  msg_error +=
                    '<p>El campo <strong>Tipo Empaque - datos de mercancía </strong> debe ser Contenedor por el Tipo Operación: Contenedor Vacío.</p>';
                }
                if ($('#' + producto + '').val() != '009990') {
                  msg_error +=
                    '<p>El campo <strong>Mercancía - datos de mercancía </strong> debe ser Contenedor Vacío por el Tipo Operación: Contenedor Vacío.</p>';
                }
              }

              if ($('#' + operacion + '').val() === 'C') {
                //contenedor cargado
                //alert('operacion'+$("#"+operacion+"").val());
                //alert('empaque'+$("#"+empaque+"").val());
                if ($('#' + empaque + '').val() !== '8' && $('#' + empaque + '').val() !== '9' && $('#' + empaque + '').val() !== '10') {
                  //alert('A si debe salir');
                  msg_error +=
                    '<p>El campo <strong>Tipo Empaque - datos de mercancía </strong> debe ser Contenedor, Tipo Operación: Contenedor Cargado.</p>';
                } else {
                  //alert('B no debe salir nada');
                  //msg_error+= "<p>El campo <strong>Tipo Empaque - datos de mercancía </strong> debe ser Contenedor, Tipo Operación: Contenedor Cargado.</p>";
                }
                if ($('#' + producto + '').val() == '009990' || $('#' + producto + '').val() == '009880') {
                  msg_error +=
                    '<p>El campo <strong>Mercancía - datos de mercancía </strong> no debe ser Contenedor vacío ó Miscelaneos contenidos,Tipo Operación: Contenedor Cargado.</p>';
                }
              }

              if ($('#' + operacion + '').val() === 'P') {
                //paqueteo
                if ($('#' + empaque + '').val() != 11) {
                  msg_error += '<p>El campo <strong>Tipo Empaque - datos de mercancía </strong> debe ser (Paquetes) Tipo Operación: Paqueteo.</p>';
                }
                if ($('#' + producto + '').val() != '009880') {
                  msg_error +=
                    '<p>El campo <strong>Mercancía - datos de mercancía </strong> debe ser (009880)MISCELANEOS CONTENIDOS EN PAQUETES ( PAQUETEO ) Tipo Operación: Paqueteo.</p>';
                }
              }
            }
          }
        }
      }
    });

    $('.empaquemer').each(function(index) {
      var empaque = $(this).val();
      if (!empaque) {
        msg_error +=
          '<p>Debe diligenciar el campo <strong>Tipo de Empaque - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.empaquemer').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.empaquemer').blur().css('background-color', 'white');
      }
    });

    $('.ttransportemer').each(function(index) {
      var tipo_transporte = $(this).val();
      if (!tipo_transporte) {
        msg_error +=
          '<p>Debe diligenciar el campo <strong>Tipo de Transporte - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.ttransportemer').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.ttransportemer').blur().css('background-color', 'white');
        //validacion
        for (var i = 0; i <= contador_global1; i++) {
          if (
            typeof document.getElementsByClassName('ttransportemer')[i] !== 'undefined' &&
            typeof document.getElementsByClassName('ttransportemer')[i] !== undefined &&
            document.getElementsByClassName('originario')[i] !== undefined &&
            document.getElementsByClassName('destinar')[i] !== undefined
          ) {
            let tipo_operacion = document.getElementsByClassName('ttransportemer')[i].id;
            let origen = document.getElementsByClassName('originario')[i].id;
            let destino = document.getElementsByClassName('destinar')[i].id;
            if (typeof tipo_operacion != 'undefined' && typeof origen != 'undefined' && typeof destino != 'undefined') {
              if ($('#' + tipo_operacion + '').val() == 'Urbano') {
                if ($('#' + origen + '').val() != $('#' + destino + '').val()) {
                  msg_error += '<p>El Origen y Destino deben ser igual ya que el tipo de Transporte seleccionado es: Urbano</p>';
                }
              }
            }
          }
        }
      }
    });

    $('.originario').each(function(index) {
      var origen = $(this).val();
      if (!origen) {
        msg_error += '<p>Debe diligenciar el campo <strong>Origen - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.originario').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.originario').blur().css('background-color', 'white');
      }
    });

    $('.destinar').each(function(index) {
      var destino = $(this).val();
      if (!destino) {
        msg_error += '<p>Debe diligenciar el campo <strong>Destino - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.destinar').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.destinar').blur().css('background-color', 'white');
      }
    });

    $('.tipovehiculo').each(function(index) {
      var tvehiculo = $(this).val();
      if (!tvehiculo) {
        msg_error +=
          '<p>Debe diligenciar el campo <strong>Tipo Vehículo - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.tipovehiculo').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.tipovehiculo').blur().css('background-color', 'white');
      }
    });

    $('.pesobruto').each(function(index) {
      var tvehiculo = $(this).val();
      if (!tvehiculo) {
        msg_error +=
          '<p>Debe diligenciar el campo <strong>Peso Bruto (kg)- datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.pesobruto').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.pesobruto').blur().css('background-color', 'white');
        for (var i = 0; i <= contador_global1; i++) {
          if (
            typeof document.getElementsByClassName('pesobruto')[i] !== 'undefined' &&
            typeof document.getElementsByClassName('pesobruto')[i] !== undefined &&
            document.getElementsByClassName('pnetomer')[i] !== undefined &&
            document.getElementsByClassName('pnetomer')[i] !== undefined
          ) {
            let pbrutoc = document.getElementsByClassName('pesobruto')[i].id;
            let pnetoc = document.getElementsByClassName('pnetomer')[i].id;
            let valor1 = $('#' + pbrutoc + '').val().toString().replace(/,/g, '');
            let valor2 = $('#' + pnetoc + '').val().toString().replace(/,/g, '');
            if (parseFloat(valor1) < parseFloat(valor2)) {
              msg_error += '<p>El <strong>Peso bruto </strong> debe ser Mayor al <strong> Peso Neto </strong></p>';
            }
          }
        }
      }
    });

    $('.pnetomer').each(function(index) {
      var neto = $(this).val();
      if (!neto) {
        msg_error +=
          '<p>Debe diligenciar el campo <strong>Peso Neto (Kg)- datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.pnetomer').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.pnetomer').blur().css('background-color', 'white');
      }
    });

    $('.pesobrutoton').each(function(index) {
      var brutotn = $(this).val();
      if (!brutotn) {
        msg_error +=
          '<p>Debe diligenciar el campo <strong>Peso Neto (Tn)- datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.pesobrutoton').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.pesobrutoton').blur().css('background-color', 'white');
      }
    });

    $('.cantidadmer').each(function(index) {
      var cantidad = $(this).val();
      if (!cantidad) {
        msg_error +=
          '<p>Debe diligenciar el campo <strong>Cantidad(unidades)- datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.cantidadmer').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.cantidadmer').blur().css('background-color', 'white');
      }
    });

    $('.altomer').each(function(index) {
      var alto = $(this).val();
      if (!alto) {
        msg_error += '<p>Debe diligenciar el campo <strong>Alto - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.altomer').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.altomer').blur().css('background-color', 'white');
      }
    });

    $('.largomer').each(function(index) {
      var largo = $(this).val();
      if (!$('.largomer').val()) {
        msg_error += '<p>Debe diligenciar el campo <strong>Largo - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.largomer').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.largomer').blur().css('background-color', 'white');
      }
    });

    $('.volumenmer').each(function(index) {
      var volumen = $(this).val();
      if (!volumen) {
        msg_error += '<p>Debe diligenciar el campo <strong>Volumen - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.volumenmer').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.volumenmer').blur().css('background-color', 'white');
      }
    });

    $('.fletemer').each(function(index) {
      var flete = $(this).val();
      if (flete <= 0) {
        msg_error +=
          '<p>Debe diligenciar el campo <strong>Costo flete - datos de mercancía mayor a ' + index + '</strong> para poder crear la cotización.</p>';
        $('.fletemer').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.fletemer').blur().css('background-color', 'white');
      }
    });

    $('.tarifamer').each(function(index) {
      var tarifa = $(this).val();
      if (!tarifa) {
        msg_error +=
          '<p>Debe diligenciar el campo <strong>Costo flete - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.tarifamer').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.tarifamer').blur().css('background-color', 'white');
      }
    });

    $('.rentamer').each(function(index) {
      var rentabilidad = $(this).val();
      if (!rentabilidad) {
        msg_error +=
          '<p>Debe diligenciar el campo <strong>Rentabilidad - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.rentamer').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.rentamer').blur().css('background-color', 'white');
      }
    });

    $('.utilmer').each(function(index) {
      var utilidad = $(this).val();
      if (!utilidad) {
        msg_error += '<p>Debe diligenciar el campo <strong>Utilidad - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.utilmer').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.utilmer').blur().css('background-color', 'white');
      }
    });

    $('.cantvehi').each(function(index) {
      var cuanto_vehiculo = $(this).val();
      if (!cuanto_vehiculo) {
        msg_error +=
          '<p>Debe diligenciar el campo <strong>Cantidad Vehículos - datos de mercancía ' + index + '</strong> para poder crear la cotización.</p>';
        $('.cantvehi').focus().css('background-color', 'rgb(254,242,181)');
      } else {
        $('.cantvehi').blur().css('background-color', 'white');
      }
    });

    //HOMOLOGAR DATOS SERVICIOS ESPECIALES
    $('.tcostoesp').each(function(index) {
      var tipocosto = $(this).val();
      if (typeof tipocosto !== 'undefined' || typeof tipocosto !== 'undefined') {
        $('.tiposerviespe').each(function(index) {
          var tiposervice = $(this).val();
          if (!tiposervice) {
            msg_error +=
              '<p>Debe diligenciar el campo <strong>Tipo servicio especial  -datos especiales ' +
              index +
              '</strong> para poder crear la cotización.</p>';
            $('.tiposerviespe').focus().css('background-color', 'rgb(254,242,181)');
          } else {
            $('.tiposerviespe').blur().css('background-color', 'white');
          }
        });

        $('.cantiespec').each(function(index) {
          var canti = $(this).val();
          if (canti < 1) {
            msg_error +=
              '<p>Debe diligenciar el campo <strong>cantidad  -datos especiales ' + index + '</strong> para poder crear la cotización.</p>';
            $('.cantiespec').focus().css('background-color', 'rgb(254,242,181)');
          } else {
            $('.cantiespec').blur().css('background-color', 'white');
          }
        });

        $('.tarifaespe').each(function(index) {
          var tarifa = $(this).val();
          if (tarifa <= 0) {
            msg_error +=
              '<p>Debe diligenciar el campo <strong>Tarifa unitaria  -datos especiales ' + index + '</strong> para poder crear la cotización.</p>';
            $('.tarifaespe').focus().css('background-color', 'rgb(254,242,181)');
          } else {
            $('.tarifaespe').blur().css('background-color', 'white');
            if (parseFloat($('#tarifauni' + index).val()) < parseFloat($('#tservi_cliente' + index).val())) {
              msg_error +=
                '<p><strong>Tarifa unitaria  </strong> debe ser mayor o igual al valor del <strong> costo unitario  </strong> en servicios especiales.</p>';
            }
          }
        });
      }
    });

    if (!msg_error) {
      if (window.confirm('¿Deseas guardar esta cotiación en el sistema?')) {
        Inserta_Cotizacion();
      }
    } else {
      $('#nexos_messages_popup').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          '</div></div>',
      );
      $('#bloque_formulario').animate({scrollTop: 0}, 600);
    }
  });

  //funcion para mostrar el contenido segun el boton seleccionado
  $('#Nacional').change(function() {
    if ($(this).is(':checked')) {
      $('.titulogeneral').show();
      $('.formulario').show();
    } else {
      $('.titulogeneral').hide();
      $('.formulario').hide();
    }
  });

  $('#btn_total').click(function() {
    // alert('click btn total');
    var a = $('#Tservicio_transporte').val();
    var b = $('#Ttarifa_especial').val();
    var opera = parseFloat(a) + parseFloat(b);
    // alert(opera);
    $('.total_oculto').show();
    $('#Ttotal_cotizacion').val(opera);
  });

  //agregar filas a la tabla de mercancias
  $('#agregar_fila').click(function() {
    agregar();
  });
  // agregar filas a tabla servicio especial
  $('#agregar_especial').click(function() {
    //select de mercancia
    if (contador_global1 > 0) {
      agregar_especial();
    } else {
      alert('Debe agregar mercancías a la cotización');
    }
  });

  /************************** Funcion para buscar Cotizaciones ******************************/

  $('#buscar_coti').click(async function() {
    var tipo = $('#tipotb').val();
    var fecha_inicial = $('#fecha_incia').val();
    var fecha_final = $('#fecha_fin').val();
    listar_cotizaciones(tipo, fecha_inicial, fecha_final);
  });

  /* Guardad solicitud de servicio */

  $('#boton_pedir_carro2').click(async function() {
    var msg_error = '';
    var peso = $('#pesoneto').val();
    var cont_opcion = $('#cnt_opcion').val();
    var cont_dias = $('#cnt_dias').val();
    var cont_municipio = $('#cnt_municipio').val();
    var cont_direccion = $('#cnt_direccion').val();
    var cont_tipo = $('#cnt_tipocon').val();
    var cont_num = $('#cnt_num').val();
    var cont_comodato = $('#cnt_fcomodato').val();
    var cont_peso = $('#cnt_peso').val();
    var cant_solicitada = $('#cant_vehiculo').val();
    var cant_disponible = $('#cant_disponible').val();
    var fhoy = moment().format('Y-M-D');
    var tipo_transporte = $('#tip_transport').val();

    if (s <= 0) {
      msg_error += '<p>Debe ingresar un bloque de remitente.</p>';
    }

    if (!$('#maximo_entregab').val()) {
      msg_error += '<p>Por favor ingrese la <strong>cantidad de puntos de entrega</strong> que requiera</p>';
      $('#maximo_entregab').focus().css('background-color', 'rgb(254,242,181)');
    } else {
      $('#maximo_entregab').blur().css('background-color', 'white');
    }

    if (!$('#group').val()) {
      msg_error += '<p>Por favor ingrese el <strong>Grupo</strong> para poder registrar solicitud</p>';

      $('#grupo_ss').focus().css('background-color', 'rgb(254,242,181)');
    } else {
      $('#grupo_ss').blur().css('background-color', 'white');
    }

    if (!$('#houremail').val()) {
      msg_error += '<p>Por favor ingrese el <strong>Hora envío email </strong> para poder registrar solicitud</p>';

      $('#hora_ss').focus().css('background-color', 'rgb(254,242,181)');
    } else {
      $('#hora_ss').focus().css('background-color', 'white');
    }

    if (cont_opcion == '1') {
      if (cont_dias == '') {
        msg_error += '<p>Por favor ingrese los <strong>Días del contenedor</strong> para registrar la solicitud</p>';
      }

      if (cont_municipio == '') {
        msg_error += '<p>Por favor ingrese el <strong>Municipio</strong> para registrar la solicitud</p>';
      }

      if (cont_direccion == '') {
        msg_error += '<p>Por favor ingrese la <strong>Dirección</strong> para registrar la solicitud</p>';
      }

      if (cont_tipo == '') {
        msg_error += '<p>Por favor ingrese el <strong>Tipo de contenedor</strong> para registrar la solicitud</p>';
      }

      if (cont_num == '') {
        msg_error += '<p>Por favor ingrese el <strong>Número de contenedor</strong> para registrar la solicitud</p>';
      }

      if (cont_peso == '') {
        msg_error += '<p>Por favor ingrese el <strong>Peso vacío de contenedor</strong> para registrar la solicitud</p>';
      }
    }

    if ($('#maximo_entregab').val()) {
      var cuanto = $('#maximo_entregab').val();
      $('.re_dire').each(function(index) {
        var direccion_remitente = $(this).val();
        if (!direccion_remitente) {
          msg_error += '<p>Por favor ingrese la <strong>Dirección Remitente</strong> para poder registrar solicitud</p>';
        } else {
          // if(direccion_remitente.length == 0 || direccion_remitente.length > 50){
          if (direccion_remitente.trim().length > 50) {
            msg_error += '<p>La <strong>Dirección Remitente</strong> debe tener maximo 50 caracteres para poder registrar la solicitud</p>';
          }
          if (direccion_remitente.trim().length < 3) {
            msg_error += '<p>La <strong>Dirección Remitente</strong> debe tener mínimo 3 caracteres para poder registrar la solicitud</p>';
          }
        }
      });

      $('.re_cliente').each(function(index) {
        var remitente = $(this).val();
        if (!remitente) {
          msg_error += '<p>Por favor seleccione el <strong>Remitente</strong> para poder registrar solicitud</p>';
        }
      });
      $('.rlname').each(function(index) {
        var rename = $(this).val();
        if (rename < 3) {
          msg_error += '<p>El <strong>Nombre Remitente</strong> debe tener mínimo 3 caracteres para poder registrar solicitud</p>';
        }
        if (rename > 50) {
          msg_error += '<p>El <strong>Nombre Remitente</strong> debe tener máximo 50 caracteres para poder registrar solicitud</p>';
        }
      });
      $('.re_ciudad').each(function(index) {
        var ciudad_remitente = $(this).val();
        if (!ciudad_remitente) {
          msg_error += '<p>Por favor seleccione la <strong>Ciudad Remitente</strong> para poder registrar solicitud</p>';
        }
      });

      $('.re_telefono').each(function(index) {
        var telefono_remitente = $(this).val();
        if (!telefono_remitente) {
          msg_error += '<p>Por favor ingresa el <strong>Teléfono Remitente</strong> para poder registrar solicitud</p>';
        } else {
          if (telefono_remitente.length < 10) {
            msg_error += '<p>El <strong>Teléfono Remitente</strong> debe tener 10 dígitos para poder registrar solicitud</p>';
          } else if (telefono_remitente.length > 10) {
            msg_error += '<p>El <strong>Teléfono Remitente</strong> debe tener 10 dígitos para poder registrar solicitud</p>';
          } else if (telefono_remitente == '0000000000') {
            msg_error += '<p>El <strong>Teléfono Remitente</strong> no es válido</p>';
          }
        }
      });

      $('.re_peso').each(function(index) {
        var peso_remitente = $(this).val();
        if (!peso_remitente) {
          msg_error += '<p>Por favor ingresa el <strong>Peso Remitente</strong> para poder registrar solicitud</p>';
        }
      });

      $('.re_fecha').each(function(index) {
        var fecha_remitente = $(this).val();
        if (!fecha_remitente) {
          msg_error += '<p>Por favor ingresa la <strong>Fecha Remitente</strong> para poder registrar solicitud</p>';
        } else {
          var fhoym = moment();
          var tf = fhoym.diff(fecha_remitente, 'days');
          if (tf > 0) {
            msg_error += '<p>Por favor ingrese la <strong>Fecha Remitente</strong> mayor a la fecha actual para registrar la solicitud</p>';
          }
        }
      });

      $('.re_hora').each(function(index) {
        var hora_remitente = $(this).val();
        if (!hora_remitente) {
          msg_error += '<p>Por favor ingresa la <strong>Hora Remitente</strong> para poder registrar solicitud</p>';
        }
      });

      $('.re_lugar').each(function(index) {
        var lugar_remitente = $(this).val();
        if (!lugar_remitente) {
          msg_error += '<p>Por favor ingresa el <strong>Lugar Remitente</strong> para poder registrar solicitud</p>';
        }
      });

      //validacines para rndc
      $('.est_upgrade').each(function(index) {
        var estado_retransmision = $(this).val();
        if (estado_retransmision == 0) {
          msg_error += '<p>Por favor transmitir el <strong>Remitente</strong> para poder registrar solicitud</p>';
        }
      });

      $('.re_dire').each(function(index) {
        var largo_dire = $(this).val();
        if (largo_dire.trim().length < 3) {
          msg_error += '<p>La <strong>Dirección Remitente</strong> debe tener mas de 3 caracteres</p>';
        }
        if (largo_dire.trim().length > 50) {
          msg_error += '<p>La <strong>Dirección Remitente</strong> debe tener menos de 50 caracteres</p>';
        }
      });

      //validaciones del destinatario
      $('.re_cliente').each(function(index) {
        var destinatario = $('.de_cliente').val();
        var cantidad_remitente = document.getElementsByClassName('re_cliente').length;
        for (var i = 1; i <= cantidad_remitente; i++) {
          var destiExists = document.getElementsByClassName('acor_destinatario' + i + '').length;
          if (destiExists <= 0) {
            msg_error +=
              '<p>Por favor Ingrese <strong>Destinatario del Remitente ' +
              i +
              ' </strong> para poder registrar solicitud, <strong>Mínimo 1 destinatario por remitente</strong></p>';
          }
        }
        if (destinatario == undefined) {
          msg_error += '<p>Por favor Ingrese <strong>Destinatario</strong> para poder registrar solicitud</p>';
        }
        if (!destinatario) {
          //validar que los destinatarios que existan esten seleccionados
          msg_error += '<p>Por favor selecciona el <strong>Destinatario</strong> para poder registrar solicitud</p>';
        }
      });

      $('.de_dire').each(function(index) {
        var direccion_destinatario = $(this).val();
        if (!direccion_destinatario) {
          msg_error += '<p>Por favor ingresa la <strong>Dirección Destinatario</strong> para poder registrar solicitud</p>';
        } else {
          // if(direccion_destinatario.length == 0 || direccion_destinatario.length > 50){
          if (direccion_destinatario.trim().length > 50) {
            msg_error += '<p>La <strong>Dirección Destinatario</strong> debe tener maximo 50 caracteres para poder registrar la solicitud</p>';
          }
          if (direccion_destinatario.trim().length < 3) {
            msg_error += '<p>La <strong>Dirección Destinatario</strong> debe tener mínimo 3 caracteres para poder registrar la solicitud</p>';
          }
        }
      });

      $('.tel_dire').each(function(index) {
        var telefono_destinatario = $(this).val();
        if (!telefono_destinatario) {
          msg_error += '<p>Por favor ingresa la <strong>Teléfono Remitente</strong> para poder registrar solicitud</p>';
        } else {
          if (telefono_destinatario.length > 10) {
            msg_error += '<p>El <strong>Teléfono Remitente</strong> debe tener 10 dígitos para poder registrar solicitud</p>';
          } else if (telefono_destinatario.length < 10) {
            msg_error += '<p>El <strong>Teléfono Remitente</strong> debe tener 10 dígitos para poder registrar solicitud</p>';
          } else if (telefono_destinatario == '0000000000') {
            msg_error += '<p>El <strong>Teléfono Remitente</strong> no es válido</p>';
          }
        }
      });

      $('.de_ciudad').each(function(index) {
        var ciudad_destinatario = $(this).val();
        if (!ciudad_destinatario) {
          msg_error += '<p>Por favor ingresa la <strong>Ciudad Destinatario</strong> para poder registrar solicitud</p>';
        }
      });

      $('.de_fecha').each(function(index) {
        var fecha_destinatario = $(this).val();
        if (!fecha_destinatario) {
          msg_error += '<p>Por favor ingresa la <strong>Fecha Destinatario</strong> para poder registrar solicitud</p>';
        } else {
          var fhoym = moment();
          var tf = fhoym.diff(fecha_remitente, 'days');
          var fecha_remitente = $('.re_fecha').val();
          if (fecha_destinatario < fecha_remitente) {
            msg_error += '<p>La <strong>Fecha Destinatario</strong> debe ser mayor a la fecha cargue para poder registrar solicitud</p>';
          }
        }
      });

      $('.de_hora').each(function(index) {
        var hora_destinatario = $(this).val();
        if (!hora_destinatario) {
          msg_error += '<p>Por favor ingresa la <strong>Hora Destinatario</strong> para poder registrar solicitud</p>';
        }
      });

      $('.de_peso').each(function(index) {
        var peso_destinatario = $(this).val();
        if (!peso_destinatario) {
          msg_error += '<p>Por favor ingresa el <strong>Peso Destinatario</strong> para poder registrar solicitud</p>';
        }
      });

      $('.de_lugar').each(function(index) {
        var lugar_destinatario = $(this).val();
        if (!lugar_destinatario) {
          msg_error += '<p>Por favor ingresa el <strong>Lugar Destinatario</strong> para poder registrar solicitud</p>';
        }
      });

      //validaciones destinatario punto control rndc
      $('.dlestado').each(function(index) {
        var estado_retransmisiond = $(this).val();
        if (estado_retransmisiond == 0) {
          msg_error += '<p>Por favor transmitir el <strong>Destinatario</strong> para poder registrar solicitud</p>';
        }
      });

      $('.dlname').each(function(index) {
        var largo_nombred = $(this).val();
        if (largo_nombred < 3) {
          msg_error += '<p>El <strong>Nombre Destinatario</strong> debe tener mínimo 3 caracteres para poder registrar solicitud</p>';
        }
        if (largo_nombred > 50) {
          msg_error += '<p>El <strong>Nombre Destinatario</strong> debe tener máximo 50 caracteres para poder registrar solicitud</p>';
        }
      });

      $('.de_dire').each(function(index) {
        var direccion_destinatario = $(this).val();
        // if(direccion_destinatario.length == 0 || direccion_destinatario.length > 50){
        if (direccion_destinatario.trim().length > 50) {
          msg_error += '<p>La <strong>Dirección Destinatario</strong> debe tener maximo 50 caracteres para poder registrar la solicitud</p>';
        }
        if (direccion_destinatario.trim().length < 3) {
          msg_error += '<p>La <strong>Dirección Destinatario</strong> debe tener mínimo 3 caracteres para poder registrar la solicitud</p>';
        }
      });

      //Valida pesos
      var sumpeso = 0;
      $('.re_peso').each(function(index) {
        var valor = $(this).val();
        sumpeso = parseFloat(sumpeso) + parseFloat(valor); //peso total del remitente
      });
      if (parseFloat(sumpeso) > parseFloat(peso)) {
        msg_error += '<p><strong>El valor total del Peso Remitente  supera el Peso Neto </strong></p>';
      }

      var sumpesod = 0;
      $('.de_peso').each(function(index) {
        var valor_des = $(this).val();
        sumpesod = parseFloat(sumpesod) + parseFloat(valor_des);
      });

      if (parseFloat(sumpesod) > parseFloat(sumpeso)) {
        msg_error += '<p><strong>El Peso  Total del Destinatario supera el Peso Total del Remitente </strong></p>';
      }
    }

    if (!msg_error) {
      if (window.confirm('¿Esta seguro de guardar la solicitud de servicio?')) {
        //registrar
        var n = $('#ncotizar').val();
        var es = 'Pendiente';
        var ori = $('#origen').val();
        var dest = $('#destino').val();
        var peso = $('#pesoneto').val();
        var tipo_veh = $('#tipo_vehiculo').val();
        var flete = $('#flete').val();
        var cliente = $('#cliente').val();
        var pareja = $('#pareja').val();
        var observacion = $('#observacion').val();
        var agencia = $('#agencia').val();
        var cont_opcion = $('#cnt_opcion').val();
        var cont_dias = $('#cnt_dias').val();
        var cont_municipio = $('#cnt_municipio').val();
        var cont_direccion = $('#cnt_direccion').val();
        var cont_tipo = $('#cnt_tipocon').val();
        var cont_num = $('#cnt_num').val();
        var cont_comodato = $('#cnt_fcomodato').val();
        var cont_peso = $('#cnt_peso').val();
        var cant_solicitada = $('#cant_vehiculo').val();
        var cant_disponible = $('#cant_disponible').val();
        var t = $('#group').val();
        var hocliente = $('#houremail').val();

        /***************************Puntos de Entrega(Remitentes)***********************************/
        var maximo = $('#maximo_entregab').val();
        // var solicitud_servicio1 = numero_solicitud;
        var idpuntrem = $('#id_puntorem' + i + '').val();
        var mentrega = $('#p_ciudad' + i + '').val();
        var dire = $('#dire' + i + '').val();
        var clientea = $('#clientea' + i + '').val();
        var fentrega = $('#fecha' + i + '').val();
        var obs = $('#observa' + i + '').val();
        var hora = $('#hora' + i + '').val();
        var tipo = 'punto recogida';
        //var orden=$("#orden"+i+"").val();
        var orden = $('#id_puntorem' + i + '').val();
        var pun = $('#pun').val();
        var telefono = $('#telpunto' + i + '').val();
        var peso = $('#peso' + i + '').val();
        var place = $('#lugar' + i + '').val();

        /******************************Puntos Entrega (Destinatario)*************************************/
        var nFilas = $('.insercion_destina').length;
        if (nFilas > 0) {
          var dato_destinatario = {
            idrem: [],
            destinatario: [],
            ciudad: [],
            direccion: [],
            telefono: [],
            fecha: [],
            pesobruto: [],
            lugar: [],
            hora: [],
            observacion: [],
          };

          $('.idrem_d').each(function(index) {
            var idremi = $(this).val();
            dato_destinatario.idrem[index] = idremi;
          });

          $('.de_cliente').each(function(index) {
            var desti = $(this).val();
            dato_destinatario.destinatario[index] = desti;
          });

          $('.de_ciudad').each(function(index) {
            var ciudaddesti = $(this).val();
            dato_destinatario.ciudad[index] = ciudaddesti;
          });

          $('.de_dire').each(function(index) {
            var diredesti = $(this).val();
            dato_destinatario.direccion[index] = diredesti;
          });

          $('.tel_dire').each(function(index) {
            var teldesti = $(this).val();
            dato_destinatario.telefono[index] = teldesti;
          });

          $('.de_fecha').each(function(index) {
            var fechadesti = $(this).val();
            dato_destinatario.fecha[index] = fechadesti;
          });

          $('.de_peso').each(function(index) {
            var pbrutodesti = $(this).val();
            dato_destinatario.pesobruto[index] = pbrutodesti;
          });

          $('.de_lugar').each(function(index) {
            var lugardesti = $(this).val();
            dato_destinatario.lugar[index] = lugardesti;
          });

          $('.de_hora').each(function(index) {
            var horad = $(this).val();
            dato_destinatario.hora[index] = horad;
          });

          $('.de_obser').each(function(index) {
            var obsedesti = $(this).val();
            dato_destinatario.observacion[index] = obsedesti;
          });

          var datos_destinatario = dato_destinatario;
          datos_destinatario = JSON.stringify(datos_destinatario);
        }

        var datos_solicitud = {
          numero: n,
          estado: es,
          ori: ori,
          dest: dest,
          peso: peso,
          tipo_veh: tipo_veh,
          flete: flete,
          cliente: cliente,
          pareja: pareja,
          observacion: observacion,
          agencia: agencia,
          cont_opcion: cont_opcion,
          cont_dias: cont_dias,
          cont_municipio: cont_municipio,
          cont_direccion: cont_direccion,
          cont_tipo: cont_tipo,
          cont_num: cont_num,
          cont_comodato: cont_comodato,
          cont_peso: cont_peso,
          grupo: t,
          horacliente: hocliente,
          cant_solicitada: cant_solicitada,
          cant_disponible: cant_disponible,
          // action: 'solicitud_vehiculo',
          // solicitud_servicio1: solicitud_servicio1,
          idpuntrem: idpuntrem,
          mentrega: mentrega,
          dire: dire,
          clientea: clientea,
          fentrega: fentrega,
          obs: obs,
          hora: hora,
          tipo: tipo,
          orden: orden,
          pun: pun,
          telefono: telefono,
          peso: peso,
          sitio: place,
          maximo: maximo,
          datos_destinatario: datos_destinatario,
          nFilas: nFilas,
        };

        $('#loading-overlay-nexosapp').css('display', 'flex'); // Ocultar mensaje de carga independientemente del resultado
        const formData = new FormData();
        for (const key in datos_solicitud) {
          if (datos_solicitud.hasOwnProperty(key)) {
            formData.append(key, datos_solicitud[key]);
          }
        }

        let isSuccessful = false;
        let numero_solicitud = 0;
        try {
          const response = await fetch($('#id_url_ajax').val() + 'serviciocliente/Solicitud_Vehiculo', {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
          });
          const data = await response.json();
          if (data.numero === 200) {
            // alert(data.mensaje + ' ' + data.numero_solicitud);
            $('#md-footer-mensaje').modal('show');
            $('#md-fullWidth').modal('hide');
            $('#tb_solicitud').modal('hide');
            document.getElementById('icono_success').style.display = 'block';
            document.getElementById('icono_warning').style.display = 'none';
            document.getElementById('titulo_mensaje').innerHTML = 'Exito';
            document.getElementById('texto_mensaje').innerHTML = data.mensaje + ' ' + data.numero_solicitud;
            document.getElementById('btn_aceptar').style.display = 'block';
            document.getElementById('btn_cancelar').style.display = 'none';
            isSuccessful = true; // Marca la solicitud como exitosa
          } else if (data.numero === 400) {
            $('#md-footer-mensaje').modal('show');
            $('#md-fullWidth').modal('hide');
            $('#tb_solicitud').modal('hide');
            document.getElementById('icono_warning').style.display = 'block';
            document.getElementById('icono_success').style.display = 'none';
            document.getElementById('titulo_mensaje').innerHTML = 'Advertencia';
            document.getElementById('texto_mensaje').innerHTML = data.mensaje + ' ' + data.numero_solicitud;
            document.getElementById('btn_aceptar').style.display = 'none';
            document.getElementById('btn_cancelar').style.display = 'block';
            alert(data.mensaje);
          }
        } catch (error) {
          console.error('Error en la primera solicitud:', error);
          throw error;
        } finally {
          $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
          if (isSuccessful) {
            // Inserta_puntoentrega(numero_solicitud); // Llama a la función adicional si la solicitud fue exitosa
          }
        }
      }
    } else {
      $('#msg_solicitud_servicio').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          '</div></div>',
      );
      $('#md-fullWidth').animate(
        {
          scrollTop: 0,
        },
        600,
      );
    }
  });

  //***********fin del document ready function***
});

async function listar_cotizaciones(tipo, fecha_inicial, fecha_final) {
  /* Funcion para enviar los datos */
  let dato = new FormData();
  dato.append('tipo', tipo);
  dato.append('fecha_inicial', fecha_inicial);
  dato.append('fecha_final', fecha_final);
  try {
    const response = await fetch($('#id_url_ajax').val() + 'serviciocliente/consultar_cotizaciones', {
      method: 'POST',
      body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tbl_cotizaciones');
      tbody.innerHTML = '';
      let esatdo_autorizado = '';
      let col_estatus = '';
      let cot_itr = '';
      let n_cotizacion = '';
      let btn_editar = '';

      // document.querySelector('.badge').innerHTML = data.resultado_cantidad['total_cotizaciones'];
      $('.badge').html(data.resultado_cantidad['total_cotizaciones']);

      data.resultado.forEach(element => {
        const fila = document.createElement('tr');
        if (element.estado_autorizado === 'autorizado') {
          col_estatus = `<span  data-toggle="tooltip" style="color:purple;">${element.estado_autorizado}</span>`;
        } else if (element.estado_autorizado === 'por autorizar') {
          col_estatus = `<span  data-toggle="tooltip" style="color:red;">${element.estado_autorizado}</span>`;
        } else {
          col_estatus = `<td class="text"></td>`;
        }
        /* Consultas de estado de las solicitudes */
        if (element.estado === 'F1') {
          esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-default"  data-toggle="tooltip" title="Realizada" ></span>`;
        } else if (element.estado === 'F2') {
          esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-success"  data-toggle="tooltip" title="Entregada"></span>`;
        } else if (element.estado === 'F4') {
          esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-danger" data-toggle="tooltip" title="Pérdida"></span>`;
        } else if (element.estado === 'F3') {
          esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-warning"  data-toggle="tooltip" title="Ganada"></span>`;
        } else if (element.estado === 'F5') {
          esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-primary" data-toggle="tooltip" title="Cancelada"></span>`;
        } else if (element.estado === 'F6') {
          esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-gray" data-toggle="tooltip" title="Rechazada"></span>`;
        }
        /* Validar si la solicitud es Itr */
        if (element.itr === 'Si') {
          cot_itr = `<span class="badge badge-success float-right">SI</span>`;
        } else {
          cot_itr = `<span class="badge badge-primary float-right">NO</span>`;
        }

        const columnaEstado = document.createElement('td');
        columnaEstado.innerHTML = col_estatus;
        const columnaEstado_Autorizacion = document.createElement('td');
        columnaEstado_Autorizacion.innerHTML = esatdo_autorizado;
        const columnaItr = document.createElement('td');
        columnaItr.innerHTML = cot_itr;
        const columnaNum_Cotizacion = document.createElement('td');
        columnaNum_Cotizacion.innerHTML = 'N°' + element.n_cotizacion;
        const columnaCliente = document.createElement('td');
        columnaCliente.innerHTML = element.nombre_cliente;
        const columnaMercancia = document.createElement('td');
        columnaMercancia.innerHTML = element.tipo_mercancia;
        const columnaPeso = document.createElement('td');
        columnaPeso.innerHTML = element.peso_neto_kg + 'Kg';
        const columnafecha = document.createElement('td');
        columnafecha.innerHTML = element.fecha_creacion;
        const columnaAcciones = document.createElement('td');

        /* Acciones para los botones */
        if (element.n_cotizacion) {
          n_cotizacion = element.n_cotizacion;
          if (element.estado === 'cancelada' || element.estado === 'autorizado') {
            btn_editar = `
              <button  class="btn btn-warning btn-xs cell-detail hint--top-left" data-toggle="modal" data-target="#no_editar_cotizacion" title="Editar Cotización" data-toogle="tooltip" data-placement="top" onclick="prueba_editar_no(this)" data-hint="" data-id="${n_cotizacion}" data-id2="${element.estado_autorizado}">
                  <span class="icon mdi mdi-edit" style="color:#ffffff;"></span>
              </button>`;
          } else if (element.estado !== 'cancelada' || element.estado !== 'autorizado') {
            btn_editar = `
            <button onclick="prueba_editar_no(this)" class="btn btn-warning btn-xs cell-detail hint--top-left" data-hint="" data-id="${n_cotizacion}" data-id2="${element.estado_autorizado}">
              <span class="icon mdi mdi-edit" data-toggle="modal" data-target="#no_editar_cotizacion" title="Editar Cotización"></span>
            </button>`;
          }
          columnaAcciones.innerHTML = `
          <div class="btn-group btn-group-xs" role="group" aria-label="...">
            ${btn_editar}
            <button onclick="Visualizar(this)"; data-placement="top" class="btn btn-info btn-xs cell-detail hint--top-left" data-hint="" data-id="${n_cotizacion}" data-toggle="modal" data-target="#ver_cotizacion" title="Ver Cotización">
              <span class="icon mdi mdi-eye" style="color:#ffffff;"></span>
            </button>
            <button data-toggle="modal" data-target="#ver_historico" title="Historico" data-placement="top" onclick="historico(this,${n_cotizacion})";  class="btn btn-secondary btn-xs cell-detail hint--top-left" data-hint="" data-id="${element.nombre_cliente}">
              <span class="icon mdi mdi-balance"></span>
            </button>
            <button data-placement="top" data-toggle="modal" data-target="#tb_solicitud" title="Solicitud de servicio" onclick="tbsolicitudes(this,${n_cotizacion})";  class="btn btn-success btn-xs cell-detail hint--top-left" data-hint="" data-id="${element.nombre_cliente}">
               <span class="icon mdi mdi-account-circle" style="color:#ffffff;"></span>
             </button>
          </div>
          `;
        } else {
        }

        fila.appendChild(columnaEstado_Autorizacion);
        fila.appendChild(columnaEstado);
        fila.appendChild(columnaItr);
        fila.appendChild(columnaNum_Cotizacion);
        fila.appendChild(columnaCliente);
        fila.appendChild(columnaMercancia);
        fila.appendChild(columnaPeso);
        fila.appendChild(columnafecha);
        fila.appendChild(columnaAcciones);
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
    url: $('#id_url_ajax').val() + 'serviciocliente/Cabecera_Editar',
    type: 'POST',
    data: dato,
    dataType: 'json',
    success: function(data) {
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

        $('#eno_Tservicio_especial').val(
          parseFloat($('#eno_Tservicio_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString(),
        );
        $('#eno_Tservicio_transporte').val(
          parseFloat($('#eno_Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString(),
        );
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

    error: function(jqXHR, textStatus, errorThrown) {
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
    url: $('#id_url_ajax').val() + 'serviciocliente/Consultar_No',
    type: 'POST',
    data: datos_editm,
    dataType: 'json',
    success: function(data) {
      // MERCANCIA
      var estado_gerencia = $('#estado_gerencia').val();
      var co = 0;
      var carga = '';
      data.forEach(function(element, index) {
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

        efila =
          "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
          "<a href='#' class='badge badge-primary' title='mercancia'>" +
          element.item +
          '</a>' +
          '</div>' +
          "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>" +
          "<span style='font-weight:500; margin-top:20px;'>Pareja origen-destino</span><input type='text' class='form-control input-xs idpareja' value='" +
          element.idm +
          "' readonly='readonly' style='background-color:white;'>" +
          '</div>' +
          "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>" +
          "<span style='font-weight:500; margin-top:20px;'>Tipo servicio</span><input type='text' class='form-control input-xs' value='" +
          element.tipo_servicio_mer +
          "' readonly='readonly' style='background-color:white;'>" +
          '</div>' +
          "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>" +
          "<span style='font-weight:500; margin-top:20px;'>Tipo Vehículo</span><input type='text' value='" +
          element.nombre +
          "' class='form-control input-xs' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Tipo carga</span><input type='text' class='form-control input-xs' value='" +
          carga +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span>Tipo transporte</span><input type='text' class='form-control input-xs' value='" +
          element.tipo_transporte +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Peso bruto (kg)</span><input type='text' id='npbruto" +
          co +
          "' class='form-control input-xs' value='" +
          element.peso_bruto_kg +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Peso neto (kg)</span><input type='text' id='epesone" +
          co +
          "' class='form-control input-xs' value='" +
          element.peso_neto_kg +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Peso Bruto(Tn)</span><input type='text' id='enetotn" +
          co +
          "' class='form-control input-xs' value='" +
          element.peso_neto_tn +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-6 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Origen</span><input type='text' class='form-control input-xs' value='" +
          element.o +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-6 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Destino</span><input type='text' class='form-control input-xs' value='" +
          element.d +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-6 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Alto</span><input type='text' id='nalto" +
          co +
          "' class='form-control input-xs' value='" +
          element.alto +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-6 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Largo</span><input type='text' id='nlargo" +
          co +
          "' class='form-control input-xs' value='" +
          element.largo +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-6 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Ancho</span><input type='text' id='nancho" +
          co +
          "' class='form-control input-xs' value='" +
          element.ancho +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-6 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Volumen total</span><input type='text' id='nvolu" +
          co +
          "' class='form-control input-xs' value='" +
          element.volumen_total +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-6 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Costo flete</span><input type='text' id='nflete" +
          co +
          "' class='form-control input-xs nfletemer' value='" +
          element.flete +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-6 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Total tarifa</span><input type='text' id='ntarifa" +
          co +
          "' class='form-control input-xs ntarifamer' value='" +
          element.total_tarifa +
          "' onChange='javascript:nutilidad(this," +
          co +
          ")' style='font-weight:800;'></div>" +
          "<div class='col-xs-6 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>rentabilidad%</span><input type='text' id='nutil" +
          co +
          "' class='form-control input-xs nutilidad' value='" +
          element.utilidad +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-6 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>utilidad</span><input type='text' id='nrent" +
          co +
          "' class='form-control input-xs nrenta' value='" +
          element.rentabilidad +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-6 col-sm-6 col-md-6 col-lg-6'><span style='font-weight:500; margin-top:20px;'>Tipo Mercancía</span><input type='text' class='form-control input-xs' value='" +
          element.tipo_mercancia +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-6 col-sm-6 col-md-6 col-lg-6'><span style='font-weight:500; margin-top:20px;'>Valor Mercancía</span><input type='text' id='nvalor" +
          co +
          "' class='form-control input-xs' value='" +
          element.valor_mercancia +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-6 col-sm-6 col-md-6 col-lg-6'><span style='font-weight:500; margin-top:20px;'>Tipo Empaque</span><input type='text' class='form-control input-xs' value='" +
          element.empaque +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-6 col-sm-6 col-md-6 col-lg-6'><span style='font-weight:500; margin-top:20px;'>Cantidad Empaque</span><input type='text' id='ncant" +
          co +
          "' class='form-control input-xs' value='" +
          element.cantidad_empaque +
          "' readonly='readonly' style='background-color:white;'></div>" +
          "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
          "<span style='font-weight:500; margin-top:20px;'>Observación</span>" +
          "<textarea class='form-control input-xs' readonly='readonly' style='background-color:white;'>" +
          element.observacion +
          '</textarea>';

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

    error: function(jqXHR, textStatus, errorThrown) {
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
    url: $('#id_url_ajax').val() + 'serviciocliente/No_Consulta_E',
    type: 'POST',
    data: datos_edite,
    dataType: 'json',
    success: function(data) {
      if (data.result != '' && data.result != null) {
        c = 0;
        data.forEach(function(element, index) {
          c++;
          //SERVICIO ESPECIAL
          efila2 =
            '<div class="panel panel-default">' +
            '<div class="panel-body">' +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
            '<label>Servicio especial/ Mercancia a la que pertenece:</label><br>' +
            "<a href='#' class='badge badge-success' title='servicio especial'>" +
            element.item_especial +
            '</a>' +
            '/' +
            "<a href='#' class='badge badge-primary' title='mercancia'>" +
            element.item_mercancia +
            '</a>' +
            '</div>' +
            '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><h4 class="text-center">Servicios especiales</h4>' +
            '<td></td>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Tipo servicio</span>' +
            '<select id="" class="form-control input-sm" readonly="readonly" style="background-color:white;">' +
            '<option value="' +
            element.tipo_servicio +
            '">' +
            element.tipo_servicio +
            '</option>' +
            '<option>Excolta</option>' +
            '<option>Auxiliar Cargue</option>' +
            '<option>Auxiliar Descargue</option>' +
            '<option>Auxiliar Cargue y Descargue</option>' +
            '<option>Montacargas Cargue</option>' +
            '<option>Montacargas Descargue</option>' +
            '<option>Montacargas Cargue y Descargue</option>' +
            '<option>Estibador Manual</option>' +
            '</select></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Cantidad</span><input type="number" id="" min="0" class="form-control input-sm" value="' +
            element.cantidad +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '<div  class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Costo unitario</span><input type="text" id="nunitarioe' +
            c +
            '" min="0" class="form-control input-sm" value="' +
            element.valor_unitario +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Tarifa unitaria</span><input type="text" id="ntarifae' +
            c +
            '" class="form-control input-sm" readonly="readonly" value="' +
            element.tarifa_unitaria +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Costo servicio</span><input type="text" id="ntotale' +
            c +
            '" class="form-control input-sm" readonly="readonly" value="' +
            element.total_servicio +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span>Calculo tarifa</span><input type="text" id="ntari' +
            c +
            '" class="form-control input-sm" readonly="readonly" value="' +
            element.tarifa +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span>Utilidad</span><input type="text" id="nutili' +
            c +
            '" class="form-control input-sm" readonly="readonly" value="' +
            element.rentabilidad +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span>Rentabilidad</span><input type="text" id="nrentes' +
            c +
            '" class="form-control input-sm" readonly="readonly" value="' +
            element.utilidad +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '</div></div></div>';

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
    error: function() {},
  });
}

//funcion para hacer el ver de la cotizacion
function Visualizar(element) {
  //alert('ver coizacion');
  var elemento = $(element);
  var id = elemento.data('id');
  //CABECERA
  var dato = {
    ncotizar: id,
    // action: 'ver',
  };

  $('#panel_principal').html('');
  $('#panel_secundario').html('');

  $.ajax({
    url: $('#id_url_ajax').val() + 'serviciocliente/Ver_cotizacion',
    type: 'POST',
    data: dato,
    dataType: 'json',
    success: function(data) {
      if (data) {
        $('#titlu').html('<h3 class="text-center"><strong>Cotizacion Número: ' + data.n_cotizacion + '</strong></h3>');
        $('#linea').val('');

        $('#cuerpo_cliente').html(
          '<tr>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            data.nombre_cliente +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            data.nit +
            '-' +
            data.digito +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            data.direccion +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            data.telefono +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            data.procedencia_cotizacion +
            '</td>' +
            '</tr>',
        );

        $('#costos').html(
          '<tr>' +
            '<td style="white-space: nowrap;" class="text-center"><input type="text" id="tottari" class="form-control input-xs text-center" readonly="readonly" value="' +
            data.total_transporte +
            '" style="background-color:white;"></td>' +
            '<td style="white-space: nowrap;" class="text-center"><input type="text" id="totfle" class="form-control input-xs text-center" readonly="readonly" value="' +
            data.tmer_flete +
            '" style="background-color:white;"></td>' +
            '<td style="white-space: nowrap;" class="text-center"><input type="text" id="totutil" class="form-control input-xs text-center" readonly="readonly" value="' +
            data.tmer_rent +
            '" style="background-color:white;"></td>' +
            '<td style="white-space: nowrap;" class="text-center"><input type="text" id="totren" class="form-control input-xs text-center maqu" value="' +
            data.tmer_utili +
            '" readonly="readonly" style="background-color:white;"></td>' +
            '</tr>',
        );

        $('#costos1').html(
          '<tr>' +
            '<td style="white-space: nowrap;" class="text-center"><input type="text" id="flees" class="form-control input-xs text-center" value="' +
            data.tes_flete +
            '" readonly="readonly" style="background-color:white;"></td>' +
            '<td style="white-space: nowrap;" class="text-center"><input type="text" id="tarespe" class="form-control input-xs text-center" value="' +
            data.tes_tarifa +
            '" readonly="readonly" style="background-color:white;">  </td>' +
            '<td style="white-space: nowrap;" class="text-center"><input type="text" id="totuties" class="form-control input-xs text-center" value="' +
            data.tes_renta +
            '" readonly="readonly" style="background-color:white;"></td>' +
            '<td style="white-space: nowrap;" class="text-center"><input type="text" id="totrenes" class="form-control input-xs text-center  bg-white text-dark" value="' +
            data.tes_util +
            '" readonly="readonly"  style="background-color:white;"></td></tr>',
        );

        $('#totcotiza').html(
          '<tr>' +
            '<td style="white-space: nowrap;" class="text-center"><input type="text" id="totalcoti" class="form-control input-xs text-center" value="' +
            data.total_cotizacion +
            '" readonly="readonly" style="background-color:white;">    </td></tr>',
        );

        $('#cuerpo_adicional').html(
          '<tr>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            data.observaciones +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            data.elaborado_por +
            '</td>' +
            '<td style="white-space: nowrap;" class="text-center">' +
            data.autorizado_por +
            '</td>' +
            '</tr>',
        );
      }

      //Formatear números	totales - bloques
      $('#totalcoti').val(parseFloat($('#totalcoti').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#totfle').val(parseFloat($('#totfle').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#tottari').val(parseFloat($('#tottari').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#totutil').val(parseFloat($('#totutil').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#totren').val(parseFloat($('#totren').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

      //Formatear números	totales - especiales

      $('#flees').val(parseFloat($('#flees').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#tarespe').val(parseFloat($('#tarespe').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#totuties').val(parseFloat($('#totuties').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#totrenes').val(parseFloat($('#totrenes').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
    },

    error: function(jqXHR, textStatus, errorThrown) {
      // console.log(data.result);
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  //MERCANCIAS
  var dato1 = {
    ncotizar1: id,
  };

  $('#cuerpo_mer1').html('');
  $('#cuerpo_mer2').html('');
  $('#muniorigen').html('');
  $('#munidestino').html('');
  var htm, fila;

  $.ajax({
    url: $('#id_url_ajax').val() + 'serviciocliente/Ver_Merncancia',
    type: 'POST',
    data: dato1,
    dataType: 'json',
    success: function(data) {
      // console.log(data.result);
      var c = 0;
      var contador = 0;
      var carga = '';
      data.forEach(function(element, index) {
        c++;
        contador = contador + 1;
        if (c <= contador) {
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

          var idorigen = element.origen;

          var iddestino = element.destino;

          fila =
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
            "<a href='#' class='badge badge-primary' title='servicio mercancia'  >" +
            c +
            '</a>' +
            '</div>' +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>" +
            "<span style='font-weight:500; margin-top:20px;'>Pareja origen-destino</span>" +
            "<input type='text' class='form-control input-xs' value='" +
            element.id +
            "' readonly='readonly' style='background-color:white;'>" +
            "<span style='font-weight:500; margin-top:20px;'>Tipo servicio</span>" +
            "<input type='text' class='form-control input-xs' value='" +
            element.tipo_servicio_mer +
            "' readonly='readonly'  style='background-color:white;'>" +
            "</div><div  class='col-xs-6 col-sm-4 col-md-4 col-lg-4'>" +
            "<span style='font-weight:500; margin-top:20px;'>Tipo vehículo</span>" +
            "<input type='text' id='' class='form-control input-xs' value='" +
            element.nombre +
            "' readonly='readonly' style='background-color:white;'>" +
            '</div>' +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Tipo carga</span><input type='text' class='form-control input-xs' value='" +
            carga +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Tipo transporte</span><input type='text' class='form-control input-xs' value='" +
            element.tipo_transporte +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Peso  bruto (kg)</span><input type='text'     id='pbruto" +
            c +
            "' class='form-control input-xs maq' value='" +
            element.peso_bruto_kg +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Peso neto (kg)</span><input type='text' id='pneto" +
            c +
            "' class='form-control input-xs' value='" +
            element.peso_neto_kg +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Peso Bruto(Tn)</span><input type='text' id='netotn" +
            c +
            "' class='form-control input-xs' value='" +
            element.peso_neto_tn +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Alto</span><input type='text' class='form-control input-xs' id='valto" +
            c +
            "' value='" +
            element.alto +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Largo</span><input type='text' id='vlargo" +
            c +
            "' class='form-control input-xs' value='" +
            element.largo +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Ancho</span><input type='text' id='vancho" +
            c +
            "' class='form-control input-xs maqu' value='" +
            element.ancho +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Volumen total</span><input type='text' id='vvolum" +
            c +
            "' class='form-control input-xs' value='" +
            element.volumen_total +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Costo flete</span><input type='text' id='vflete" +
            c +
            "' class='form-control input-xs' value='" +
            element.flete +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Tarifa venta</span><input type='text' id='vtarifa" +
            c +
            "' class='form-control input-xs' value='" +
            element.total_tarifa +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Rentabilidad%</span><input type='text' id='vutil" +
            c +
            "' class='form-control input-xs' value='" +
            element.utilidad +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Utilidad</span><input type='text' id='vrent" +
            c +
            "' class='form-control input-xs' value='" +
            element.rentabilidad +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Tipo Mercancía</span><input type='text' class='form-control input-xs' value='" +
            element.tipo_mercancia +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Valor Mercancía</span><input type='text' id='vmerca" +
            c +
            "' class='form-control input-xs' value='" +
            element.valor_mercancia +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-6 col-sm-6 col-md-6 col-lg-6'><span style='font-weight:500; margin-top:20px;'>Tipo empaque</span><input type='text' class='form-control input-xs' value='" +
            element.empaque +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><span style='font-weight:500; margin-top:20px;'>Cantidad Empaque</span><input type='text' id='vcant" +
            c +
            "' class='form-control input-xs' value='" +
            element.cantidad_empaque +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-6 col-sm-6 col-md-6 col-lg-6'><span style='font-weight:500; margin-top:20px;'>Origen</span><input type='text' class='form-control input-xs' value='" +
            element.orig +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-6 col-sm-6 col-md-6 col-lg-6'><span style='font-weight:500; margin-top:20px;'>Destino</span><input type='text' class='form-control input-xs' value='" +
            element.dest +
            "' readonly='readonly' style='background-color:white;'></div>" +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'><span style='font-weight:500; margin-top:20px;'>Observación</span><textarea  class='form-control input-sm' readonly='readonly' style='background-color:white;'>" +
            element.observacion +
            '</textarea></div>';

          $('#panel_principal').append(fila);

          //$(".maq").trigger('change');//formatea números

          //FORMATEAR NUMEROS
          $('#pbruto' + c).val(parseFloat($('#pbruto' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#pneto' + c).val(parseFloat($('#pneto' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#netotn' + c).val(parseFloat($('#netotn' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#valto' + c).val(parseFloat($('#valto' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vlargo' + c).val(parseFloat($('#vlargo' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vancho' + c).val(parseFloat($('#vancho' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vvolum' + c).val(parseFloat($('#vvolum' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vflete' + c).val(parseFloat($('#vflete' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vtarifa' + c).val(parseFloat($('#vtarifa' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vutil' + c).val(parseFloat($('#vutil' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vrent' + c).val(parseFloat($('#vrent' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vmerca' + c).val(parseFloat($('#vmerca' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vcant' + c).val(parseFloat($('#vcant' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        } //cierre del if
      });
    }, //succes ver

    error: function(jqXHR, textStatus, errorThrown) {
      console.log('error ver');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  //SERVICIOS ESPECIALES
  var dato2 = {
    ncotizar2: id,
  };

  fila_espe = '';
  $.ajax({
    url: $('#id_url_ajax').val() + 'serviciocliente/Ver_Servicios_Especiales',
    type: 'POST',
    data: dato2,
    dataType: 'json',
    success: function(data) {
      ce = 0;
      htm = '';
      if (data.length === 0) {
        htm = "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>Sin servicios especiales</div>";
      } else {
        data.forEach(function(element, index) {
          ce++;
          htm +=
            '<div class="panel panel-default"><div class="panel-body">' +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
            '<label>Servicio especial/ Mercancia a la que pertenece:</label><br>' +
            "<a href='#' class='badge badge-success' title='servicio especial'   >" +
            element.item_especial +
            '</a>' +
            '/' +
            "<a href='#' class='badge badge-primary' title='servicio mercancia'   >" +
            element.item_mercancia +
            '</a>' +
            '<h4>Servicios especiales</h4>' +
            '</div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">' +
            '<span style="font-weight:500; margin-top:20px;">Tipo servicio </span><input type="text" class="form-control input-xs" value="' +
            element.tipo_servicio +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Cantidad</span><input type="text"  class="form-control input-xs" value="' +
            element.cantidad +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Costo unitario</span><input type="text" id="valores' +
            ce +
            '" class="form-control input-xs" value="' +
            element.valor_unitario +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Tarifa unitaria</span><input type="text" id="taries' +
            ce +
            '" class="form-control input-xs maqu" value="' +
            element.tarifa_unitaria +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Cálculo costo</span><input type="text" id="totes' +
            ce +
            '" value="' +
            element.total_servicio +
            '" class="form-control input-xs" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Calculo tarifa</span><input type="text" id="tarifaes' +
            ce +
            '" class="form-control input-xs" value="' +
            element.tarifa +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Utilidad</span><input type="text" id="uties' +
            ce +
            '" value="' +
            element.rentabilidad +
            '" class="form-control input-xs" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Rentabilidad%</span><input type="text" id="rentes' +
            ce +
            '" class="form-control input-xs" value="' +
            element.utilidad +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '</div></div>'; // }
        });
      }

      $('#panel_secundario').append(htm);

      //$(".maqu").trigger('change');//formatea números
      $('#valores' + ce).val(parseFloat($('#valores' + ce).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#taries' + ce).val(parseFloat($('#taries' + ce).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#totes' + ce).val(parseFloat($('#totes' + ce).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#tarifaes' + ce).val(parseFloat($('#tarifaes' + ce).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#uties' + ce).val(parseFloat($('#uties' + ce).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#rentes' + ce).val(parseFloat($('#rentes' + ce).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('error');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
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
    url: $('#id_url_ajax').val() + 'serviciocliente/Historio_Cotizaciones',
    type: 'POST',
    data: dato,
    dataType: 'json',
    success: function(data) {
      console.log('trajo historico');
      if (data) {
        // let fecha = '';
        $('#cuerpo_historico').html('');
        data.resultado.forEach(function(element, index) {
          // console.log(element.fecha);
          var nomenclatura = element.estado;
          // let fecha = element.fecha;
          if (nomenclatura == 'F1') {
            var estado = 'F1-Realizada';
            var status =
              '<td class="text-default">' +
              '<center>' +
              '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Realizada" ></span>' +
              '</center>' +
              '</td>';
          }

          if (nomenclatura == 'F2') {
            var estado = 'F2-Entregada';
            var status =
              '<td class="text-success">' +
              '<center>' +
              '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Entregada"></span>' +
              '</center>' +
              '</td>';
          }

          if (nomenclatura == 'F3') {
            var estado = 'F3-Ganada';
            var status =
              '<td class="text-warning">' +
              '<center>' +
              '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Ganada"></span>' +
              '</center>' +
              '</td>';
          }

          if (nomenclatura == 'F4') {
            var estado = 'F4-Perdida';
            var status =
              '<td class="text-danger">' +
              '<center>' +
              '<span class="mdi mdi-dot-circle icon" data-toggle="tooltip" title="Pérdida"  ></span>' +
              '</center>' +
              '</td>';
          }

          if (nomenclatura == 'F5') {
            var estado = 'F5-Cancelada';
            var status =
              '<td class="text-primary">' +
              '<center>' +
              '<span class="mdi mdi-dot-circle icon" data-toggle="tooltip" title="Cancelada" ></span>' +
              '</center>' +
              '</td>';
          }

          if (nomenclatura == 'F6') {
            var estado = 'F6-Rechazada';
            var status =
              '<td class="text-danger">' +
              '<center>' +
              '<span class="mdi mdi-dot-circle icon" data-toggle="tooltip" title="Rechazada" ></span>' +
              '</center>' +
              '</td>';
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
        data.resultado2.forEach(function(element, index) {
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
    error: function(jqXHR, textStatus, errorThrown) {
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
    url: $('#id_url_ajax').val() + 'serviciocliente/T_Solicitud_Servcio',
    type: 'POST',
    data: soli,
    dataType: 'json',
    success: function(data) {
      if (data) {
        $('#t1').show();
        $('#cuerpo_servicio').html('');
        data.forEach(function(element, index) {
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

    error: function(jqXHR, textStatus, errorThrown) {
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
    // action: 'tabla_solicitudes',
  };

  $('#ctb_solicitud').html('');
  $('#tipo_vvisible').html('');
  $.ajax({
    url: $('#id_url_ajax').val() + 'serviciocliente/Tabla_Solicitudes',
    type: 'POST',
    data: tabla,
    dataType: 'json',
    success: function(data) {
      if (data) {
        var cont = 0;
        data.forEach(function(element, index) {
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
          $('#btn_consulta_ss' + cont + '').click(function() {
            $('#consultass_general').html('');
            $('#contener_remitente').html('');
            $('.destinatari').html('');
            var num_cotizacion = $(this).attr('data-id');
            var solicitud_servicio = $(this).attr('data-id3');
            var consulta_solicitud = {
              cotizar: num_cotizacion,
              solicitud: solicitud_servicio,
            };

            // $.ajax({
            //   url: $('#id_url_ajax').val() + 'serviciocliente/Consultar_Solicitud_Servcio',
            //   type: 'POST',
            //   data: consulta_solicitud,
            //   dataType: 'json',
            //   success: function(data) {
            //     if (data) {
            //       $('#consultass_general').html(
            //         '<tr>' +
            //           '<td class="cell-detail"><span>' +
            //           solicitud_servicio +
            //           '<br> Cot: ' +
            //           element.n_cotizacion +
            //           '</span></td>' +
            //           '<td class="cell-detail">' +
            //           '<span>Cliente:</span>' +
            //           '<span class="cell-detail-description">' +
            //           data.nombre_cliente +
            //           '</span>' +
            //           '</td>' +
            //           '<td class="cell-detail">' +
            //           '<span>Origen - Destino:</span>' +
            //           '<span class="cell-detail-description">' +
            //           data.origen +
            //           '</span>' +
            //           '<span class="cell-detail-description">' +
            //           data.destino +
            //           '</span></td>' +
            //           '<td class="cell-detail">' +
            //           '<span>Tipo Vehículo</span>' +
            //           '<span class="cell-detail-description">' +
            //           data.nombre +
            //           '</span>' +
            //           '</td>' +
            //           '<td class="cell-detail">' +
            //           '<span> Peso Neto:</span>' +
            //           '<span class="cell-detail-description">' +
            //           peso +
            //           '</span>' +
            //           '</td>' +
            //           '<td class="cell-detail">' +
            //           '<span>Agencia</span>' +
            //           '<span class="cell-detail-description">' +
            //           data.agencia +
            //           '</span>' +
            //           '</td>' +
            //           '</tr>' +
            //           '<tr>' +
            //           '<td class="cell-detail">' +
            //           '<span>Contenedor</span>' +
            //           '<span class="cell-detail-description">' +
            //           data.devol_numcont +
            //           '</span>' +
            //           '</td>' +
            //           '<td class="cell-detail">' +
            //           '<span>Tipo Contenedor</span>' +
            //           '<span class="cell-detail-description">' +
            //           data.devol_tipocont +
            //           '</span>' +
            //           '</td>' +
            //           '<td class="cell-detail">' +
            //           '<span>Municipio Devolución</span>' +
            //           '<span class="cell-detail-description">' +
            //           data.devol_municipio +
            //           '</span>' +
            //           '</td>' +
            //           '<td class="cell-detail">' +
            //           '<span>Dirección Devolución</span>' +
            //           '<span class="cell-detail-description">' +
            //           data.devol_direccion +
            //           '</span>' +
            //           '</td>' +
            //           '<td class="cell-detail">' +
            //           '<span>Fecha Comodato</span>' +
            //           '<span class="cell-detail-description">' +
            //           data.devol_comodato +
            //           '</span>' +
            //           '</td>' +
            //           '</tr>',
            //       );
            //     }
            //   },
            //   error: function(jqXHR, textStatus, errorThrown) {
            //     console.log(jqXHR);
            //     console.log(textStatus);
            //     console.log(errorThrown);
            //   },
            // });

            $.ajax({
              url: $('#id_url_ajax').val() + 'serviciocliente/Consultar_Solicitud_Servcio',
              type: 'POST',
              data: consulta_solicitud,
              dataType: 'json',
              success: function(data) {
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
              error: function(jqXHR, textStatus, errorThrown) {
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
              url: $('#id_url_ajax').val() + 'serviciocliente/Consultar_Remitente',
              type: 'POST',
              data: consulta_solciitud2,
              dataType: 'json',
              success: function(data) {
                if (data) {
                  data.resultado.forEach(function(element, index) {
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
                  data.resultado2.forEach(function(element, index) {
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
              error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });
          });

          // $('#btn_esol' + cont + '').click(function() {
          //   var idcotizar = $(this).attr('data-id');
          //   var parejita = $(this).attr('data-id2');
          //   var idsolicitud = $(this).attr('data-id3');
          //   var cliente = $(this).attr('data-id4');
          //   var estado = $(this).attr('data-id5');
          //   $('#solicitud_servicio').val(idsolicitud);
          //   $('#mcliente').val(cliente);
          //   $('#estado_solicitud').val(estado);
          //   //datos de la solicitud
          //   var dato = {
          //     idsolicitud: idsolicitud,
          //     // action: 'consultar_solicitud_servicio',
          //   };

          //   $('#datos_servi').html('');
          //   $('#tb_puntoentrega').html('');
          //   $('#egroup').html('');
          //   $.ajax({
          //     url: $('#id_url_ajax').val() + 'serviciocliente/Consulta_Solicitud_Servicio',
          //     type: 'POST',
          //     data: dato,
          //     dataType: 'json',
          //     success: function(data) {
          //       if (data.resultado != null) {
          //         $('#peso_validar').val(data.resultado.peso_kg);
          //         var a = data.resultado.agencia;
          //         var agency;
          //         if (a == 1) {
          //           agency = 'Bogotá';
          //         }

          //         if (a == 2) {
          //           agency = 'Cartagena';
          //         }

          //         if (a == 4) {
          //           agency = 'Buenaventura';
          //         }

          //         $('#datos_servi').append(
          //           '<tr>' +
          //             '<td>' +
          //             data.resultado.id +
          //             '</td>' +
          //             '<td>' +
          //             data.resultado.n_cotizacion +
          //             '</td>' +
          //             '<td>' +
          //             data.resultado.origenes +
          //             '</td>' +
          //             '<td>' +
          //             data.resultado.destinos +
          //             '</td>' +
          //             '<td>' +
          //             data.resultado.peso_kg +
          //             '</td>' +
          //             '<td>' +
          //             agency +
          //             '</td>' +
          //             '</tr>',
          //         );
          //       }

          //       if (data.resultado2 != null) {
          //         var co = 0;
          //         data.resultado2.forEach(function(element, index) {
          //           co++;
          //           alert(co);
          //           var ch =
          //             '<input type="button" id="p' +
          //             co +
          //             '" class="btn-primary tr' +
          //             co +
          //             '" value="Remover"  onclick="delete_punto(this.id,' +
          //             co +
          //             ')">';

          //           $('.contenedor_actual').append(
          //             ' <div class="panel panel-full-warning">' +
          //               '<div class="panel-heading">' +
          //               '<h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion2" href="#modal' +
          //               co +
          //               '" class="collapsed"><i class="icon mdi mdi-chevron-down"></i>' +
          //               element.nombre +
          //               '</a></h4>' +
          //               '</div>' +
          //               '<div id="modal' +
          //               co +
          //               '" class="panel-collapse collapse">' +
          //               '<div class="panel-body">' +
          //               '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">' +
          //               '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><label><strong>Datos Remitente</strong></label>   ' +
          //               ch +
          //               '</div>' +
          //               '<div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">' +
          //               '<label>Dirección</label><input type="text" id="pdire' +
          //               co +
          //               '" class="form-control input-sm tr' +
          //               co +
          //               '" value="' +
          //               element.direccion_entrega +
          //               '">' +
          //               '</div>' +
          //               '<div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">' +
          //               '<label>Teléfono</label><input type="number" id="ptel' +
          //               co +
          //               '" class="form-control input-sm tr' +
          //               co +
          //               '" value="' +
          //               element.telefono +
          //               '">' +
          //               '</div>' +
          //               '<div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">' +
          //               '<label>Observación</label><input type="text" id="pobs' +
          //               co +
          //               '" class="form-control input-sm tr' +
          //               co +
          //               '" value="' +
          //               element.observacion +
          //               '"></td>' +
          //               '<td class="tr' +
          //               co +
          //               '">' +
          //               '</div>' +
          //               '<div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">' +
          //               '<label>Peso bruto(Kg)</label><input type="number" id="ppeso' +
          //               co +
          //               '" class="form-control input-sm tr' +
          //               co +
          //               '" value="' +
          //               element.peso +
          //               '">' +
          //               '</div>' +
          //               '<div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">' +
          //               '<label>Lugar</label><input type="text" id="plugar' +
          //               co +
          //               '"class="form-control input-sm tr' +
          //               co +
          //               '" value="' +
          //               element.lugar +
          //               '">' +
          //               '</div>' +
          //               '<div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">' +
          //               '<label>Hora</label><input type="time" id="ephora' +
          //               co +
          //               '" class="form-control input-sm tr' +
          //               co +
          //               '" value="' +
          //               element.hora_estimada +
          //               '">' +
          //               '</div></div>' +
          //               '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">' +
          //               '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">AQUI HAY QUE REALIZAR CONSULTA PARA TRAER DESTINATARIOS DE CADA REMITNETE</div>' +
          //               '</div>' +
          //               '</div>' +
          //               '</div>' +
          //               '</div>',
          //           );
          //         });
          //       }

          //       if (data.resultado3 != null) {
          //         data.resultado3.forEach(function(element, index) {
          //           $('#egroup').append('<option value="' + element.id_grupo + '">' + element.nombre_grupo + '</option>');
          //         });
          //       }
          //     },
          //     error: function(jqXHR, textStatus, errorThrown) {
          //       console.log(jqXHR);
          //       console.log(textStatus);
          //       console.log(errorThrown);
          //     },
          //   });
          // });

          //CONSULTA DATOS DE SOLICITUD DE SERVICIO

          $('#btn_servicio' + cont + '').click(function() {
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

            /* Ejecutar funcion para cargar la lista de contendores */
            /**************************Cargar Cotenedores para crear la solicitud************************/
            $('#cnt_tipocon').html('<option value="">Seleccione</option>');
            $.ajax({
              url: $('#id_url_ajax').val() + 'serviciocliente/Consultar_Contenedor',
              type: 'POST',
              dataType: 'json',
              success: function(data) {
                if (data) {
                  data.forEach(function(element, index) {
                    $('#cnt_tipocon').append('<option value="' + element.id + '">' + element.nombre + '</option>');
                  });
                }
              },
              error: function(jqXHR, textStatus, errorThrown) {
                console.log('no trajo agencia');
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });

            /* Cargar Municipios de los contenedores */
            $('#cnt_municipio').html('<option value="">Seleccione</option>');
            $.ajax({
              url: $('#id_url_ajax').val() + 'serviciocliente/Consultar_Municipios',
              type: 'POST',
              dataType: 'json',
              success: function(data) {
                if (data) {
                  data.forEach(function(element, index) {
                    $('#cnt_municipio').append('<option value="' + element.id + '">' + element.municipio + '-' + element.depto + '</option>');
                  });
                }
              },
              error: function(jqXHR, textStatus, errorThrown) {
                console.log('no trajo municipio');
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });

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
            };

            $.ajax({
              url: $('#id_url_ajax').val() + 'serviciocliente/Consulta_servicio',
              type: 'POST',
              data: consulta_solicitud,
              dataType: 'json',
              success: function(data) {
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

              error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });

            //consulta grupo y hora de correo

            var gr = {
              cliente: cliente,
              // action: 'Consultar_grupo',
            };

            $('#group').html('');
            $('#houremail').html('');
            $.ajax({
              url: $('#id_url_ajax').val() + 'serviciocliente/Consultar_grupo',
              type: 'POST',
              data: gr,
              dataType: 'json',
              success: function(data) {
                if (data.resultado != null) {
                  data.resultado.forEach(function(element, index) {
                    $('#group').append('<option value="' + element.id + '">' + element.nombre_grupo + '</option>');
                  });
                }

                if (data.resultado2 != null) {
                  var c = 0;
                  data.resultado2.forEach(function(element, index) {
                    c++;
                    $('#houremail').append('<option value="' + element.id + '">' + element.nombre + ' - ' + element.hora_envio + '</option>');
                  });
                }
              },

              error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });

            //agencia
            // var agencia = {
            //   action: 'traer_agencia',
            // };

            $('#agencia').html('');
            $.ajax({
              url: $('#id_url_ajax').val() + 'serviciocliente/Traer_Agencias',
              type: 'POST',
              // data: agencia,
              dataType: 'json',
              success: function(data) {
                if (data) {
                  data.forEach(function(element, index) {
                    $('#agencia').append('<option value="' + element.id + '" >' + element.nombre + '</option>');
                  });
                }
              },
              error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });

            //Validaciones del contenedor
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

            if (carga == 'C' || carga == 'V') {
              //Contenedor Cargado o Contenedor Vacío
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

          //TRAER ORIGENES Y DESTINOS

          $('#btn_modal' + cont + '').click(function() {
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
              url: $('#id_url_ajax').val() + 'serviciocliente/Consultar_grupo',
              type: 'POST',
              data: gr,
              dataType: 'json',
              success: function(data) {
                if (data.resultado != null) {
                  data.resultado.forEach(function(element, index) {
                    $('#group').append('<option value="' + element.id + '">' + element.nombre_grupo + '</option>');
                  });
                }

                if (data.resultado2 != null) {
                  var c = 0;
                  data.resultado2.forEach(function(element, index) {
                    c++;
                    $('#houremail').append('<option value="' + element.id + '">' + element.nombre + ' - ' + element.hora_envio + '</option>');
                  });
                }
              },

              error: function(jqXHR, textStatus, errorThrown) {
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
              url: $('#id_url_ajax').val() + 'serviciocliente/Municipio_Table',
              type: 'POST',
              data: municipiostable,
              dataType: 'json',
              success: function(data) {
                data.origen.forEach(function(element, index) {
                  $('#orisoli').html(element.origi);
                });

                data.destino.forEach(function(element, index) {
                  $('#destisoli').html(element.desti);
                });
              },

              error: function(jqXHR, textStatus, errorThrown) {
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
              url: $('#id_url_ajax').val() + 'serviciocliente/Vehiculo_Servicio',
              type: 'POST',
              data: vehiculo,
              dataType: 'json',
              success: function(data) {
                $('#tipo_vvisible').val(data.nombre);
              },
              error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });

            $('#tb_trazabilidad').html(
              '<tr>' +
                '<td>' +
                idcotizar +
                '</td>' +
                '<td>' +
                fecha +
                '</td>' +
                '<td>' +
                hora +
                '</td>' +
                '<td>' +
                parejita +
                '</td>' +
                '<td>' +
                item +
                '</td>' +
                '</tr>',
            );

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

          $('#btn_nuevo' + cont + '').click(function() {
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
              url: $('#id_url_ajax').val() + 'serviciocliente/Consultar_Movimientos',
              type: 'POST',
              data: status,
              dataType: 'json',
              success: function(data) {
                if (data) {
                  data.resultado.forEach(function(element, index) {
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
                    data.resultado2.forEach(function(element, index) {
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

              error: function(jqXHR, textStatus, errorThrown) {
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
              url: $('#id_url_ajax').val() + 'serviciocliente/Historico_Cotizaciones',
              type: 'POST',
              data: status_cot,
              dataType: 'json',
              success: function(data) {
                if (data.resultado) {
                  $('#th1').show();
                  data.resultado.forEach(function(element, index) {
                    var nomenclatura = element.estado;

                    if (nomenclatura == 'F1') {
                      var estado = 'F1-Realizada';
                      var status =
                        '<td class="text-success">' +
                        '<center>' +
                        '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Realizada" ></span>' +
                        '</center>' +
                        '</td>';
                    }

                    if (nomenclatura == 'F2') {
                      var estado = 'F2-Entregada';
                      var status =
                        '<td class="text-success">' +
                        '<center>' +
                        '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Entregada"></span>' +
                        '</center>' +
                        '</td>';
                    }

                    if (nomenclatura == 'F3') {
                      var estado = 'F3-Ganada';
                      var status =
                        '<td class="text-success">' +
                        '<center>' +
                        '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Ganada"></span>' +
                        '</center>' +
                        '</td>';
                    }

                    if (nomenclatura == 'F4') {
                      var estado = 'F4-Perdida';
                      var status =
                        '<td class="text-success">' +
                        '<center>' +
                        '<span class="mdi mdi-dot-circle icon" data-toggle="tooltip" title="Pérdida"  ></span>' +
                        '</center>' +
                        '</td>';
                    }

                    if (nomenclatura == 'F5') {
                      var estado = 'F5-Cancelada';
                      var status =
                        '<td class="text-success">' +
                        '<center>' +
                        '<span class="mdi mdi-dot-circle icon" data-toggle="tooltip" title="Cancelada" ></span>' +
                        '</center>' +
                        '</td>';
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
              error: function(jqXHR, textStatus, errorThrown) {
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

    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no solicitudes');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

/*************************************************Fin funciones de los botones*******************************************************/

var url = $('#id_url_ajax').val() + 'libs/serv_clientecotizaciones_ajax.php';
///////////////////////////////CREAR COTIZACIONES
//cantidad de vehículos para esa mercancía
function cuantitativo(cantidad, idc) {
  var msg_error = '';
  if (cantidad > 0) {
    $('#cant_carro' + idc).blur().css('background-color', 'white');
    $('#cant_gastada' + idc).val(cantidad);
  } else {
    $('#cant_carro' + idc).focus().css('background-color', 'red');
    msg_error +=
      '<p>El campo <strong>Cantidad Vehículos ' + idc + '- datos de mercancia </strong>debe ser mayor a cero y no puede ser un número negativo.</p>';
    $('#nexos_messages_popup').html(
      '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
        msg_error +
        '</div></div>',
    );
    $('#crea_cotizacion_sercliente').animate({scrollTop: 0}, 600);
  }
}
//Función para maquetear números
function currencyMask(ele) {
  //alert('agua bendita');
  var elemento = $(ele);
  elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
}

function currencyMask2(elemento) {
  elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
}

//cambiar valor del peso neto total
function cambio_valor(elem, id2) {
  var elemento = $(elem);
  t = elemento.val();
  var tonelada = 1000;
  var multi = t / tonelada;
  $('#pesobruto_cliente' + id2).val(multi);
  elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //maquetear peso bruto Tn
  $('#pesobruto_cliente' + id2).val(parseFloat($('#pesobruto_cliente' + id2).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
}
//cambiar valor del peso neto
function CambioNeto(elem, id2) {
  var elemento = $(elem);
  t = elemento.val();
  elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
}
//cambiar valor del volumen total
function volumen_total(elem, ida) {
  // a = valor del ancho
  //ida = id del campo
  var elemento = $(elem);
  var to, go, cho;
  var alto = $('#alto_cliente' + ida).val().replace(/,/g, '');
  var largo = $('#largo_cliente' + ida).val().replace(/,/g, '');
  var ancho = elemento.val().replace(/,/g, '');
  to = alto / 100;
  go = largo / 100;
  cho = ancho / 100;
  if (alto != '' && largo != '') {
    var operar = go * cho * to;
    $('#volumen_cliente' + ida).val(operar);
    //maquetar ancho
    elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
    //maquetar volumen
    $('#volumen_cliente' + ida).val(parseFloat($('#volumen_cliente' + ida).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  }
}

function myFunctionf(id, valor) {}
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

function verVehiculo(element) {
  // alert('llevar los datos');
  var elemento = $(element);
  var id = elemento.data('id');
  var digito = elemento.data('id2');
  var telefono = elemento.data('id3');
  var nombre = elemento.data('id4');
  var dire = elemento.data('id5');
  var idcliente = elemento.data('id6');
  var correo = elemento.data('id7');
  var tipo_documento = elemento.data('id8');
  var regimen = elemento.data('id9');
  $('#cargar_cliente').val(nombre);
  $('.nombre').html(nombre);
  $('#nit_empresa').val(id);
  $('.documento').html(id + '-' + digito);
  $('#digito_verificacion').val(digito);
  $('#telefono_cliente').val(telefono);
  $('.telefono').html(telefono);
  $('#direccion_cliente').val(dire);
  $('.ubicacion').html(dire);
  $('.correo').html(correo);
  $('.tipo_documento').html(tipo_documento + ' - ' + regimen);
  $('#id_cliente_cot').val(idcliente);
  $('#Nacional').attr('checked', false);
  $('#Internacional').attr('checked', false);
  $('#Almacenamiento').attr('checked', false);
  $('#exampleModalLong').modal('hide');
  $('#cliente2').html(nombre);
  $('.linea_negocicito').show();
}

//crear datos de mercancia
var cont = 0;
var contador_global1 = 0;
function agregar() {
  cont++;
  contador_global1 = contador_global1 + 1;
  //TRAER LOS DATOS , municipios, tipos vehiculo
  /* Tipo Mecancia */
  Mercancias(cont);

  //TABLA MERCANCIA 1
  var origen =
    "<select id='origen_cliente" +
    cont +
    "' class='originario' onchange='lugares(" +
    cont +
    ");' style='width: 100%;' >" +
    '<option value="" readonly="readonly">Seleccione</option>' +
    '</select>';
  var destino =
    '<select id="destino_cliente' +
    cont +
    '" class="destinar" onchange="lugares(' +
    cont +
    ');"  style="width: 100%;"  >' +
    '<option value="" readonly="readonly">Seleccione</option>' +
    '</select>';
  var mercancia = `<select id="tipo_mercancia${cont}" class="tmerca" onchange="codigo_mercancia(${cont})" style="width: 100%;" >
    <option value="">Seleccione</option>
  </select>`;

  var tipo_empaque =
    '<select style="width: 100%;" id="tipo_empaque' + cont + '" class="empaquemer">' + '<option value="">Seleccione</option>' + '</select>';
  //boton de eliminar
  var btn_elimina = '';
  if (cont != 1) {
    btn_elimina =
      '<button id="elimina' +
      cont +
      '" class="btn btn-danger btn-xs elimina" tooltip="Eliminar bloque ' +
      cont +
      '"  onclick="Elimina_Mercancia(this.id,' +
      cont +
      ')"><i class="far fa-trash-alt"></i></button>';
  }
  //contador de la fila
  var htmlTags = `
  <tr class="tr${cont}">
      <tr style="background-color: #14A44D;color:#fff;" colspan="8" class="tr${cont}">
        <th colspan="4"> N° ${cont}</th>
        <th colspan="4" class="text-right">${btn_elimina} <input type="hidden" class="form-control input-xs item_merca" readonly="readonly" value="${cont}"></th>
      </tr>
      <tr colspan="8" class="tr${cont}">
          <th style="color:#000000;" ><b> Servicio ITR&nbsp;<span style="color:blue;"><i>(*)</i></span></b></th> 
          <td class="text-right" style="padding: 1px;">
            <select id="itr${cont}" style="width: 100%;color:#000;" class="itr" Onchange="Validar_operacion_itr(${cont})">
              <option value="" readonly="readonly">Seleccione</option>
              <option value="Si">Si</option>
              <option value="No" selected>No</option>
            </select>
          </td>
      </tr>

      <tr class="tr${cont}">
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;">Mercancía:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width:160px;">${mercancia}
          <input type="hidden" class="form-control idproducto" id="codmercancia${cont}" readonly="readonly">
          <input type="hidden" class="form-control rndcproducto" id="rndcmercancia${cont}" readonly="readonly">
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;">Naturaleza:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <select style="width: 100%;" id="natu${cont}" readonly="readonly" class="natumer"></select>
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;">Valor Declarado:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text" id="valor_mercancia${cont}" style="width: 100%;" class="valor_merca" min="0" onChange="javascript:currencyMask(this)">
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;">Tipo Servicio:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <select id="servicio_cliente${cont}" style="width: 100%;" class="ts">
            <option value="" readonly="readonly">Seleccione</option>
            <option value="Expreso">Expreso - Viaje</option>
            <option value="Consolidado">Consolidado - Tonelada</option>
          </select>
        </td>
      </tr>

      <tr class="tr${cont}">
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Tipo Empaque:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width:160px;">${tipo_empaque}</td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Tipo Operación:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <select style="width: 100%;" id="tipo${cont}" class="operamer">
            <option value="">Seleccione</option>
            <option value="G">General</option>
            <option value="P">Paqueteo</option>
            <option value="C">Contenedor Cargado</option>
            <option value="V">Contenedor Vacío</option>
          </select>
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Tipo Transporte:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <select style="width: 100%;" id="tipotr${cont}" class="ttransportemer">
            <option value="">Seleccione</option>
            <option value="Importacion">Importación</option>
            <option value="Exportacion">Exportación</option>
            <option value="Nacional">Nacional</option>
            <option value="Urbano">Urbano</option>
          </select>
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Cantidad Vehículos:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="number" id="cant_carro${cont}" class="cantvehi" min="1" style="width:100%;" value="1"  onchange="cuantitativo(this.value,${cont})" readonly="readonly">
        </td>
      </tr>

      <tr class="tr${cont}">
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Origen:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width:160px;">${origen}</td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Destino:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">${destino}</td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Tipo Vehículo:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <select id="vehiculo_cliente${cont}" readonly="readonly" style="width:100%;" class="tipovehiculo" onChange="javascript:obtenerflete(this.value,${cont},${contador_global1});"></select>
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Cant. actual:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="number" id="cant_gastada${cont}" class="cantgastamer" min="1" style="width:100%;" readonly="readonly" value="1">
        </td>
      </tr>
      
      <tr class="tr${cont}">
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Peso Bruto(Kg):</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width:160px;">
          <input type="text" id="peso_client1${cont}" class="pesobruto" min="0" style="width:100%;"  onChange="javascript:cambio_valor(this,${cont});">
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Peso Neto(Kg):</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text" class="p${cont} pnetomer" min="0" style="width:100%;" name="nombre${cont}" id="${cont}" onChange="javascript:CambioNeto(this,${cont});">
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Peso Bruto(Tn):</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text" class="pesobrutoton" min="0" style="width:100%;" name="nombre${cont}" id="pesobruto_cliente${cont}" readonly=""> 
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Cantidad(unidades):</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text" id="cantidad${cont}" class="cantidadmer" min="1" style="width:100%;" onChange="javascript:currencyMask(this)">
        </td>
      </tr>

      <tr class="tr${cont}">
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Alto(cm):</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width:160px;">
          <input type="number" id="alto_cliente${cont}" class="altomer" style="width:100%;" min="0" value="0" onChange="javascript:currencyMask(this)">
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Largo(cm):</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text" id="largo_cliente${cont}"  class="largomer" style="width:100%;" min="0" value="0" onChange="javascript:currencyMask(this)">
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Ancho(cm):</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text" id="${cont}" name="ancho${cont}"  class="ancho${cont} anchomer" style="width:100%;" min="0" value="0" onChange="volumen_total(this,${cont});">
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Volumen (m3):</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text" id="volumen_cliente${cont}" readonly="readonly"  class="volumenmer" style="width:100%;" value="0">
        </td>
      </tr>

      <tr class="tr${cont}">
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Costo Flete:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text"  id="flete${cont}" class="fletemer" min="0" value="0"  style="width:100%;" onChange="javascript:utilidad_d(this,${cont},${contador_global1})">
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Tarifa venta:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text" id="totaltarifa_cliente${cont}"  class="tarifamer"  min="0" value="0" style="width:100%;" onChange="javascript:utilidad(this,${cont},${contador_global1});" >
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Rentabilidad %:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text" id="${cont}"  class="utilidad${cont} utilmer" min="0" style="width:100%;" readonly="readonly">
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Utilidad:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text" id="renta${cont}" class="rentamer" style="width:100%;"  readonly="readonly">
        </td>
      </tr>

      <tr class="tr${cont}">
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Observación:</th>
        <td class="tr${cont}" style="border: 1px solid #ddd;padding: 1px;" colspan="7">
          <textarea id="observa${cont}" class="observamer" style="width:100%;" rows="1"></textarea> <input type="hidden" class="identi tr${cont}" value="1"  style="width:100%;">
        </td>
      </tr>
  </tr>`;

  $('#table_mercancia').append(htmlTags);
  //TABLA MERCANCIA 2
  llenaritem();
}

async function Mercancias(cont) {
  //TIPO DE MERCANCIA
  $('#tipo_mercancia' + cont + '').html('');
  try {
    const response = await fetch($('#id_url_ajax').val() + 'serviciocliente/Tipo_Mercancia', {
      method: 'POST',
      dataType: 'json',
      cache: 'no-cache',
    });
    const data = await response.json();
    data.forEach(function(element, index) {
      $('#tipo_mercancia' + cont + '').append(
        '<option value="' + element.nombre + '" data-id="' + element.id + '" data-id2="' + element.codigo + '">' + element.nombre + '</option>',
      );
    });
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    tipo_empaque(cont);
  }
}

async function tipo_empaque(cont) {
  $('#tipo_empaque' + cont + '').val(''); //TIPO EMPAQUE
  try {
    const response = await fetch($('#id_url_ajax').val() + 'serviciocliente/Tipo_Empaque', {
      method: 'POST',
      dataType: 'json',
      cache: 'no-cache',
    });
    const data = await response.json();
    data.forEach(function(element, index) {
      $('#tipo_empaque' + cont + '').append('<option value="' + element.id + '">' + element.empaque + '</option>');
    });
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    Municipios(cont);
  }
}

async function Municipios(cont) {
  //datos de los municipios
  $('#flete' + cont).html('');
  $('#origen_cliente' + cont + '').html('');
  $('#destino_cliente').html('');
  try {
    const response = await fetch($('#id_url_ajax').val() + 'serviciocliente/Consulta_Municipios', {
      method: 'POST',
      dataType: 'json',
      cache: 'no-cache',
    });
    const data = await response.json();
    data.forEach(function(element, index) {
      $('#origen_cliente' + cont + '').append(
        '<option value="' + element.rndc_codigo_ciudad + '">' + element.municipio + '-' + '' + element.depto + '' + '</option>',
      );

      $('#destino_cliente' + cont + '').append(
        '<option value="' + element.rndc_codigo_ciudad + '">' + element.municipio + '-' + '' + element.depto + '' + '</option>',
      );
    });
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
  }
}

async function name(params) {}

function codigo_mercancia(id) {
  var id_mercancia = $('#tipo_mercancia' + id + '').find(':selected').data('id');
  var rndc_mercancia = $('#tipo_mercancia' + id + '').find(':selected').data('id2');
  $('#codmercancia' + id + '').val(id_mercancia);
  $('#rndcmercancia' + id + '').val(rndc_mercancia);
  //naturaleza
  var msg_error = '';
  //TIPO DE MERCANCIA
  var select_merca = {
    id_mercancia: id_mercancia,
    // action: 'traer_naturaleza',
  };
  //$("#natu"+id+"").html('<option value="">Seleccione</option>');
  $.ajax({
    url: $('#id_url_ajax').val() + 'serviciocliente/Consultar_naturaleza',
    type: 'POST',
    data: select_merca,
    dataType: 'json',
    success: function(data) {
      console.log(data);
      if (data != null) {
        $('#natu' + id + '').html('');
        var tipo = data['tipo'];
        var natural = '';
        var palabra = '';
        if (tipo == '00') {
          natural = '1';
          palabra = 'Carga normal';
        }
        if (tipo == 'CP') {
          natural = '2';
          palabra = 'Carga peligrosa';
        }
        if (tipo == 'DP') {
          natural = '5';
          palabra = 'Desechos peligrosos';
        }
        $('#natu' + id).append('<option value="' + natural + '">' + palabra + '</option>');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//eliminar datos de mercancia
function Elimina_Mercancia(btn, id) {
  let confirm = window.confirm('¿Desea eliminar el bloque de mercancia ' + id + '?');
  if (confirm == true) {
    event.preventDefault();
    $('.tr' + id).remove();
    $(this).closest('tr').remove();
  }
  //recalcular totales
  recalcula_cifras();
  llenaritem();
}

function lugares(id) {
  //alert('cambio');
  $('#vehiculo_cliente' + id).html('');
  $.ajax({
    url: $('#id_url_ajax').val() + 'serviciocliente/Tipo_Vehiculos',
    type: 'POST',
    dataType: 'json',
    success: function(data) {
      //traer el tipo de vehiculo
      $('#vehiculo_cliente' + id + '').append('<option value="">Seleccione</option>');
      data.forEach(function(element, index) {
        $('#vehiculo_cliente' + id + '').append('<option value="' + element.id + '">' + element.nombre + '</option>');
        //costo individual

        //costo total
        var tot = $('#Tcosto_flete').val(); //capturar el costo total del flete
        var fle = $('#flete' + id).val(); //traer el valor actual del flete
        var tf = fle - tot; //restar el total menos el flete actual
        //poner el actual en cero
        $('#Tcosto_flete').val(tf); //asignarle el resultado al total
        $('#flete' + id).val(0);
        //tarifa total
        var totarifa = $('#Tservicio_transporte').val();
        var ta = $('#totaltarifa_cliente' + id).val();
        var to_ta = totarifa - ta;
        $('#totaltarifa_cliente' + id).val(0);
        $('#Tservicio_transporte').val(to_ta);

        //total cotizacion
        var tser = $('#Tservicio_transporte').val();
        var tesp = $('#Ttarifa_especial').val();
        var totcot = parseFloat(tser) + parseFloat(tesp);
        $('#Ttotal_cotizacion').val(totcot);

        $('.utilidad' + id).val(0);
        $('#renta' + id).val(0);
        $('#Tutilidad').val(0);
        $('#Trentabilidad').val(0);

        //utilidad
        //$(".utilidad"+id).val();
        //$(".utilidad"+id).val();
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no entro ');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//calcula tarifa
function utilidad(elem, id, max) {
  var cont = contador_global1;
  $('#totaltarifa_cliente' + id).val(
    parseFloat($('#totaltarifa_cliente' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString(),
  );
  var valor = $('#totaltarifa_cliente' + id).val().replace(/,/g, '');
  //trayendo valor tarifa y el id de la tarifa
  //UTILIDAD INDIVIDUAL
  var calculo, resta, util, res;
  var acu = 0;
  var variable = 0;
  var f = $('#flete' + id).val().replace(/,/g, '');
  resta = parseFloat(valor) - parseFloat(f);
  calculo = parseFloat(resta) / parseFloat(valor);
  res = parseFloat(calculo) * 100;
  res = res.toFixed(2);
  $('.utilidad' + id).val(res);
  $('.utilidad' + id).val(parseFloat($('.utilidad' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

  //RENTABILIDAD
  var rent = parseFloat(valor) - parseFloat(f);
  $('#renta' + id).val(rent);
  $('#renta' + id).val(parseFloat($('#renta' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  var i;
  var sum = 0;
  var vtemp;
  $('#Tservicio_transporte').val(0);
  recalcula_cifras();
  for (i = 1; i <= cont; i++) {
    //alert (max);
    vtemp = 0;
    vtemp = $('#totaltarifa_cliente' + i).val().replace(/,/g, '');
    sum = parseFloat(sum) + parseFloat(vtemp);
  }
  var vt = $('#Tservicio_transporte').val().replace(/,/g, '');
  var sumtotal = parseFloat(vt) + parseFloat(sum);
  $('#Tservicio_transporte').val(sumtotal);
  //utilidad total
  var costot = $('#Tcosto_flete').val().replace(/,/g, '');
  var tartot = $('#Tservicio_transporte').val().replace(/,/g, '');
  var utitot = (parseFloat(tartot) - parseFloat(costot)) / tartot * 100;
  utitot = utitot.toFixed(2);
  $('#Tutilidad').val(utitot);
  var rentot = parseFloat(tartot) - parseFloat(costot);
  $('#Trentabilidad').val(rentot);
  //total cotizacion
  var tser = $('#Tservicio_transporte').val().replace(/,/g, '');
  var tesp = $('#Ttarifa_especial').val().replace(/,/g, '');
  var totcot = parseFloat(tser) + parseFloat(tesp);
  $('#Ttotal_cotizacion').val(totcot);
  //maquetar los totales
  $('#Tservicio_transporte').val(parseFloat($('#Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //$("#Tcosto_flete").val(parseFloat($("#Tcosto_flete").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
  $('#Tutilidad').val(parseFloat($('#Tutilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Trentabilidad').val(parseFloat($('#Trentabilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Ttotal_cotizacion').val(parseFloat($('#Ttotal_cotizacion').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //recalcular cifras
  recalcula_cifras();
}

//calcula flete
function utilidad_d(elem, id, max) {
  var conte = contador_global1;
  var valor = $('#totaltarifa_cliente' + id).val().replace(/,/g, '');
  var calculo, resta, util, res;
  var acu = 0;
  var variable = 0;
  var f = $('#flete' + id).val().replace(/,/g, '');
  var ff = $('#flete' + id);
  ff.val(parseFloat(ff.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //UTILIDAD
  resta = parseFloat(valor) - parseFloat(f);
  calculo = parseFloat(resta) / parseFloat(valor);
  res = parseFloat(calculo) * 100;
  res = res.toFixed(2);
  $('.utilidad' + id).val(res);
  $('.utilidad' + id).val(parseFloat($('.utilidad' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //RENTABILIDAD
  var rent = parseFloat(valor) - parseFloat(f);
  $('#renta' + id).val(rent);
  $('#renta' + id).val(parseFloat($('#renta' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //Recalcular la tarifa total
  var i;
  var sum = 0;
  var vtemp;
  //Recalcular el costo flete total
  var e;
  var mas = 0;
  var vtempd;
  //SUBTOTALES DE DATOS DE MERCANCIA
  //Valor total costo del flete
  recalcula_cifras();
  $('#Tservicio_transporte').val(0);
  $('#Tcosto_flete').val(0);
  for (i = 1; i <= conte; i++) {
    //alert (max);
    vtemp = 0;
    vtemp = $('#totaltarifa_cliente' + i).val().replace(/,/g, '');
    sum = parseFloat(sum) + parseFloat(vtemp);

    vtempd = 0;
    vtempd = $('#flete' + i).val().replace(/,/g, '');
    mas = parseFloat(mas) + parseFloat(vtempd);
  }
  var vt = $('#Tservicio_transporte').val().replace(/,/g, '');
  var sumtotal = parseFloat(vt) + parseFloat(sum);
  $('#Tservicio_transporte').val(sumtotal);

  var vf = $('#Tcosto_flete').val().replace(/,/g, '');
  var sumftotal = parseFloat(vf) + parseFloat(mas);
  $('#Tcosto_flete').val(sumftotal);
  //Utilidad y Rentabilidad total
  var costot = $('#Tcosto_flete').val().replace(/,/g, '');
  var tartot = $('#Tservicio_transporte').val().replace(/,/g, '');
  var utitot = (parseFloat(tartot) - parseFloat(costot)) / tartot * 100;
  utitot = utitot.toFixed(2);
  $('#Tutilidad').val(utitot);
  var rentot = parseFloat(tartot) - parseFloat(costot);
  $('#Trentabilidad').val(rentot);
  //Total cotización
  var tser = $('#Tservicio_transporte').val().replace(/,/g, '');
  var tesp = $('#Ttarifa_especial').val().replace(/,/g, '');
  var totcot = parseFloat(tser) + parseFloat(tesp);
  $('#Ttotal_cotizacion').val(totcot);
  //maquetar campos
  $('#Tcosto_flete').val(parseFloat($('#Tcosto_flete').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Tutilidad').val(parseFloat($('#Tutilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Trentabilidad').val(parseFloat($('#Trentabilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Tservicio_transporte').val(parseFloat($('#Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  recalcula_cifras();
}

// agregar filas DATOS SERVICIOS ESPECIALES
var con = 0;
var contador_global2 = 0;
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
    url: $('#id_url_ajax').val() + 'libs/servicio_cliente_ajax.php',
    type: 'POST',
    data: select_merca,
    dataType: 'json',
    success: function(data) {
      // $("#"+id+"").html('');
      // console.log('si especial gracie');
      data.result.forEach(function(element, index) {
        $('#tservi_cliente' + con + '').append('<option value="' + element.nombre + '">' + element.nombre + '</option>');
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // console.log('no entro gracie');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
  var btn_elimina =
    '<button id="elimina' +
    cont +
    '" class="btn btn-danger btn-xs" tooltip="Eliminar bloque ' +
    con +
    '"  onclick="Elimina_Especial(this.id,' +
    con +
    ')"><i class="far fa-trash-alt"></i></button>';

  var lafila = `
    <tr class="tre${con}">

      <tr style="background-color: #332D2D;color:#fff;border-top: 1px #fff solid;" class="tre${con}" colspan="8">
          <td class="tr${con}" colspan="4">
            <select id="select_mercancia${con}" onChange="javascript:cambiomerca(this.value,${con});"></select>
            <span class="badge badge-primary numeral_mer" id="numeral_mer${con}" title="Mercancía"></span>
            <span class="badge badge-success numerale_espe" id="numeral_espe${con}" title="Especial" value="${con}">${con}</span>
          </td>
          <td class="tr${con} text-right" colspan="4">
            ${btn_elimina}
          </td>
      </tr>

      <tr class="tre${con}">
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Tipo Servicio:</th>
        <td class="tr${con}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <select id="tservi_cliente${con}" class="tiposerviespe" onChange="javascript:cambio(this,this.value,${con});" style="width:100%;">
              <option value="">Seleccione una opción</option>
          </select>
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Cantidad:</th>
        <td class="tr${con}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="number" id="cantidad_servespecial${con}" class="cantiespec" min="1" value="1"  onChange="javascript:myFunction(this.value,${con});" style="width:100%;">
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Costo Unitario:</th>
        <td class="tr${con}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text" id="${con}"  class="vunitario${con} valoruni" min="0" value="0"  readonly="readonly" onclick="myFunctionf(this.id,this.value);" onchange="total_especial_valor(this.value,this.id);" style="width:100%;">
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Tarifa Unitaria:</th>
        <td class="tr${con}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text" id="tarifauni${con}" class="tarifaespe" value="0" onchange="utilidade(${con});" style="width:100%;">
        </td>
      </tr>

      <tr class="tre${con}">
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Calculo Costo:</th>
        <td class="tr${con}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text" id="total_servespecial${con}" class="tcostoesp" readonly="readonly" style="width:100%;">
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Calculo Tarifa:</th>
        <td class="tr${con}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text" id="taries${con}" class="ttariesp"  readonly="readonly" value="0" style="width:100%;">
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Costo entabilidad%:</th>
        <td class="tr${con}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text" id="utiles${con}" class="tutiesp" readonly="readonly" style="width:100%;">
        </td>
        <th style="background-color: #F5F5F5; font-weight: bold;border: 1px solid #ddd;padding: 1px; color: #000000;width: auto; white-space: nowrap;">Utilidad:</th>
        <td class="tr${con}" style="border: 1px solid #ddd;padding: 1px;width: 160px;">
          <input type="text" id="rente${con}" class="trenesp" readonly="readonly" style="width:100%;">
        </td>
      </tr>
    </tr>
  `;

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

function llenaritem() {
  var s;
  if (contador_global1 > 0) {
    for (b = 1; b <= contador_global2; b++) {
      $('#select_mercancia' + b).html('');
      s = '';
      $('#numeral_mer' + b).html('');
      for (a = 1; a <= contador_global1; a++) {
        s = s + '<option value=' + a + '>' + a + '</option>';
        j = a;
      }
      $('#select_mercancia' + b).html(s);
      $('#numeral_mer' + b).html(j);
    }
    //cambiomerca(1,);
  } else {
    alert('Debe agregar mercancías a la cotización');
  }
}

function myFunction(valor, id) {
  var servicio = $('#tservi_cliente' + id).val();
  var traer_costo = {
    servicio: servicio,
    action: 'traer_costo',
  };

  $.ajax({
    url: $('#id_url_ajax').val() + 'libs/servicio_cliente_ajax.php',
    type: 'POST',
    data: traer_costo,
    dataType: 'json',
    success: function(data) {
      if (data.result) {
        $('.vunitario' + id).val(data.result[0].costo);
        $('.vunitario' + id).val(parseFloat($('.vunitario' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      }
      //calcular el costo
      var c = $('#cantidad_servespecial' + id).val().replace(/,/g, '');
      var costo = parseFloat(data.result[0].costo) * c;
      $('#total_servespecial' + id).val(costo);
      $('#total_servespecial' + id).val(
        parseFloat($('#total_servespecial' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString(),
      );

      //calcular Tarifa
      var vtar = $('#tarifauni' + id).val().replace(/,/g, '');
      var tartot = parseFloat(vtar) * c;
      $('#taries' + id).val(tartot);
      $('#taries' + id).val(parseFloat($('#taries' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      //costo total
      recalcula_cifras();
      var i;
      var sum = 0;
      var ces;
      for (i = 1; i <= contador_global2; i++) {
        ces = 0;
        ces = $('#total_servespecial' + i).val().replace(/,/g, '');
        sum = parseFloat(sum) + parseFloat(ces);
      }
      $('#Tcosto_especial').val(sum);
      $('#Tcosto_especial').val(parseFloat($('#Tcosto_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

      //tarifa total
      var i2;
      var sum2 = 0;
      var tvt;

      for (i2 = 1; i2 <= contador_global2; i2++) {
        tvt = 0;
        tvt = $('#taries' + i2).val().replace(/,/g, '');
        sum2 = parseFloat(sum2) + parseFloat(tvt);
      }
      $('#Ttarifa_especial').val(sum2);
      $('#Ttarifa_especial').val(parseFloat($('#Ttarifa_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

      utilidade(id);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function cambio(eleme, valor, id) {
  //alert(valor);
  $('#cantidad_servespecial' + id).val(1);
  var cant = $('#cantidad_servespecial' + id).val();
  var traer_costo = {
    servicio: valor,
    action: 'traer_costo',
  };

  $.ajax({
    url: $('#id_url_ajax').val() + 'libs/servicio_cliente_ajax.php',
    type: 'POST',
    data: traer_costo,
    dataType: 'json',
    success: function(data) {
      if (data.result) {
        $('.vunitario' + id).val(data.result[0].costo);
        $('.vunitario' + id).val(parseFloat($('.vunitario' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      }

      $('#tarifauni' + id).val(0);
      //$("#total_servespecial"+id).val(0);
      $('#taries' + id).val(0);
      $('#utiles' + id).val(0);
      $('#rente' + id).val(0);
      //calcular el costo
      var costo = parseFloat(data.result[0].costo) * cant;
      $('#total_servespecial' + id).val(costo);
      $('#total_servespecial' + id).val(
        parseFloat($('#total_servespecial' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString(),
      );
      //costo total new
      //var tu=$("#Tcosto_especial").val(0);
      var i;
      var sum = 0;
      var ces;
      for (i = 1; i <= contador_global2; i++) {
        ces = 0;
        ces = $('#total_servespecial' + i).val().replace(/,/g, '');
        sum = parseFloat(sum) + parseFloat(ces);
      }
      $('#Tcosto_especial').val(sum);
      $('#Tcosto_especial').val(parseFloat($('#Tcosto_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      //valor total de cotizacion
      $('#Ttarifa_especial').val(0);
      $('#Tutilidad_especial').val(0);
      $('#Trenta_especial').val(0);
      var tser = $('#Tservicio_transporte').val().replace(/,/g, '');
      var tesp = $('#Ttarifa_especial').val().replace(/,/g, '');
      var totcot = parseFloat(tser) + parseFloat(tesp);
      $('#Ttotal_cotizacion').val(totcot);
      $('#Ttotal_cotizacion').val(parseFloat($('#Ttotal_cotizacion').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
  //COSTO TOTAL
}

function cambiomerca(idm, id) {
  $('#numeral_mer' + id).html('');
  //alert('cambio');
  //alert('valor select'+idm);
  //alert('id '+id);
  $('#numeral_mer' + id).html(idm);
}

var cuente = 0;
function obtenerflete(valor, id, max) {
  //alert('cambio de flete');
  //alert (valor);
  $('#flete' + id).val(0);
  var origen = $('#origen_cliente' + id).val();
  var destino = $('#destino_cliente' + id).val();
  var tvehiculo = valor;
  var i;
  var sum = 0;
  var dum = 0;

  var flete = {
    origen: origen,
    destino: destino,
    vehiculo: tvehiculo,
    // action: 'traer_flete',
  };

  $.ajax({
    // url: $('#id_url_ajax').val() + 'libs/servicio_cliente_ajax.php',
    url: $('#id_url_ajax').val() + 'serviciocliente/Consultar_Flete',
    type: 'POST',
    data: flete,
    dataType: 'json',
    success: function(data) {
      if (data === true) {
        //$("#Tcosto_flete").val(0);
        var costoflete = data.result[0].tarifa;
        $('#flete' + id + '').val(costoflete);
        $('#flete' + id + '').val(parseFloat($('#flete' + id + '').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        //utilidad
        var calculo, resta, util, res;
        var valor = $('#totaltarifa_cliente' + id).val().replace(/,/g, '');
        resta = parseFloat(valor) - parseFloat(costoflete);
        calculo = parseFloat(resta) / parseFloat(valor);
        res = parseFloat(calculo) * 100;
        res = res.toFixed(2);
        $('.utilidad' + id).val(res);
        $('.utilidad' + id).val(parseFloat($('.utilidad' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        //rentabilidad
        recalcula_cifras();
        var rent = parseFloat(valor) - parseFloat(costoflete);
        $('#renta' + id).val(rent);
        $('#renta' + id).val(parseFloat($('#renta' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        //otros - obtener subtotales de la cotizacion
        for (i = 1; i <= contador_global1; i++) {
          var f = $('#flete' + i).val().replace(/,/g, '');
          var t = $('#totaltarifa_cliente' + i).val().replace(/,/g, '');
          sum = parseFloat(sum) + parseFloat(f);
          //var y=parseFloat(sum)+parseFloat(costu);
          dum = parseFloat(dum) + parseFloat(t);
        }
        //var costu=$("#Tcosto_flete").val();//0
        //var y=parseFloat(sum)+parseFloat(costu);
        var costot = $('#Tcosto_flete').val(sum);
        var tartot = $('#Tservicio_transporte').val(dum);
        //maquetar datos
        //$("#Tcosto_flete").val(parseFloat($("#Tcosto_flete").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
        //$("#Tservicio_transporte").val(parseFloat($("#Tservicio_transporte").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
        //calcular utilidad total
        var utitot = (parseFloat(dum) - parseFloat(sum)) / dum * 100;
        utitot = utitot.toFixed(2);
        $('#Tutilidad').val(utitot);

        var rentot = parseFloat(dum) - parseFloat(sum);
        $('#Trentabilidad').val(rentot);
        //$("#Trentabilidad").val(parseFloat($("#Trentabilidad").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
        //total cotización
        var tesp = $('#Ttarifa_especial').val().replace(/,/g, '');
        var totcot = parseFloat(dum) + parseFloat(tesp);
        $('#Ttotal_cotizacion').val(totcot);
        //$("#Ttotal_cotizacion").val(parseFloat($("#Ttotal_cotizacion").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
        $('#Tcosto_flete').val(parseFloat($('#Tcosto_flete').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#Tservicio_transporte').val(parseFloat($('#Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#Tutilidad').val(parseFloat($('#Tutilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#Trentabilidad').val(parseFloat($('#Trentabilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#Ttotal_cotizacion').val(parseFloat($('#Ttotal_cotizacion').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        /*var f=$("#flete"+id).val();
						var costu=$("#Tcosto_flete").val();//0
						var y=parseFloat(f)+parseFloat(costu);
						$("#Tcosto_flete").val(y); */
        //fin for
      } else {
        alert('No existe un flete para esa asociación, por favor creelo.');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // console.log('no trajo flete');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
  recalcula_cifras();
}
//funcion para cargar clientes
function cargar_clientes() {
  // console.log("Entro en funcion rndcCargarVehiculoAseguradora");
  $('#nit_cliente').val('');
  $('#codigo_verifica').val('');
  var params = {
    accion: 'cargarclientes',
  };
  cargar_cliente = [];
  $.ajaxSetup({async: false});
  $.post(
    url,
    params,
    function(data) {
      if (data.success) {
        for (let x = 0; x < data.content.length; x++) {
          cargar_cliente.push(data.content[x]['nombre']);
        }
        $('#caja_cliente.typeahead').typeahead(
          {
            minLength: 1,
          },
          {
            name: 'states',
            source: substringMatcher(cargar_cliente),
          },
        );

        console.log('paso1');
        $.ajaxSetup({async: false});
        $('#caja_cliente').bind('typeahead:selected', function(obj, datum, name) {
          var params = {
            accion: 'rndc_obtenerdatosaseguradora',
            nombre: datum.split(' - ')[0],
          };
          console.log('paso2');
          $.post(
            url,
            params,
            function(data) {
              // console.log(data);
              if (data.success) {
                $('#nit_cliente').val(data.content[0]['documento']);
                $('#codigo_verifica').val(data.content[0]['digito_verificacion']);
              } else {
                $('#nit_cliente').val('');
                $('#codigo_verifica').val('');
              }
              $('#direccion_cliente').focus();
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
//
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
//funcion maquetear numeros del ver
function maquetea_numerosb(ele) {
  //alert('agua bendita');
  var elemento = $(ele);
  elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
}

//calcular totales nuevamente
function recalcula_cifras() {
  var resum = 0;
  let retari = 0;
  let reutil = 0;
  let rerenta = 0;
  //especiales
  let costoes = 0;
  let taries = 0;
  let utiles = 0;
  let rentaes = 0;
  $('.fletemer').each(function(index) {
    var valorfle = $(this).val().replace(/,/g, '');
    resum = parseFloat(resum) + parseFloat(valorfle);
    //alert('TOTflete'+resum);
    $('#Tcosto_flete').val(resum);
  });
  $('.tarifamer').each(function(index) {
    var valortarifa = $(this).val().replace(/,/g, '');
    retari = parseFloat(retari) + parseFloat(valortarifa);
    //alert('TOTtari'+retari);
    $('#Tservicio_transporte').val(retari);
  });
  $('.utilmer').each(function(index) {
    var valorf = $('#Tcosto_flete').val().replace(/,/g, '');
    var valort = $('#Tservicio_transporte').val().replace(/,/g, '');
    restaT = parseFloat(valort) - parseFloat(valorf);
    calculo = parseFloat(restaT) / parseFloat(valort);
    res_utilidad = parseFloat(calculo) * 100;
    res_utilidad = res_utilidad.toFixed(2);
    $('#Tutilidad').val(res_utilidad);
  });
  $('.rentamer').each(function(index) {
    var valorrenta = $(this).val().replace(/,/g, '');
    rerenta = parseFloat(rerenta) + parseFloat(valorrenta);
    //alert('TOTren'+rerenta);
    $('#Trentabilidad').val(rerenta);
  });
  /*alert('renta'+retari);
	alert('uti'+reutil);
	alert('renta'+rerenta);*/
  //especiales
  if (typeof $('.tcostoesp').val() !== 'undefined') {
    $('.tcostoesp').each(function(index) {
      var valorcostoe = $(this).val().replace(/,/g, '');
      costoes = parseFloat(costoes) + parseFloat(valorcostoe);
      $('#Tcosto_especial').val(costoes);
    });
    $('.ttariesp').each(function(index) {
      var valortari = $(this).val().replace(/,/g, '');
      taries = parseFloat(taries) + parseFloat(valortari);
      $('#Ttarifa_especial').val(taries);
    });
    $('.tutiesp').each(function() {
      var valoru = $(this).val().replace(/,/g, '');
      utiles = parseFloat(utiles) + parseFloat(valoru);
      $('#Tutilidad_especial').val(utiles);
    });
    $('.trenesp').each(function(index) {
      var valorrentes = $(this).val().replace(/,/g, '');
      rentaes = parseFloat(rentaes) + parseFloat(valorrentes);
      $('#Trenta_especial').val(rentaes);
    });
  } else {
    //alert('cero dato especial');
    //recalcula_cifras();
    $('#Tcosto_especial').val(0);
    $('#Ttarifa_especial').val(0);
    $('#Tutilidad_especial').val(0);
    $('#Trenta_especial').val(0);
  }
  //total cotizacion
  var tarimer = $('#Tservicio_transporte').val().replace(/,/g, '');
  var tariespe = $('#Ttarifa_especial').val().replace(/,/g, '');
  var sumatot = parseFloat(tarimer) + parseFloat(tariespe);
  $('#Ttotal_cotizacion').val(sumatot);
  //formatear números
  $('#Tcosto_flete').val(parseFloat($('#Tcosto_flete').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Tservicio_transporte').val(parseFloat($('#Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Tutilidad').val(parseFloat($('#Tutilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Trentabilidad').val(parseFloat($('#Trentabilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Tcosto_especial').val(parseFloat($('#Tcosto_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Ttarifa_especial').val(parseFloat($('#Ttarifa_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Tutilidad_especial').val(parseFloat($('#Tutilidad_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Trenta_especial').val(parseFloat($('#Tcosto_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Ttotal_cotizacion').val(parseFloat($('#Ttotal_cotizacion').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
}

async function Inserta_Cotizacion() {
  $('.nexos-messages').html('');
  var estado = 'F3';
  var estado_autorizado = 'autorizado';
  var nit_empresa = $('#nit_empresa').val();
  var digito_veri = $('#digito_verificacion').val();
  var direccion = $('#direccion_cliente').val();
  var cargar_cliente = $('#cargar_cliente').val();
  var telefono = $('#telefono_cliente').val();
  var procede_cliente = $('#procede_cliente').val();
  // var observacion = $('#observacion').val();
  var observacion_general = $('.observacion_general').val();
  var elaborado_por = $('#elaborado_por').val();
  var Nacional = $('#Nacional').is(':checked');
  var Internacional = $('#Internacional').is(':checked');
  var Almacenamiento = $('#Almacenamiento').is(':checked');
  var user_log = $('#elaborado_por').val();
  //total mercancia
  var totalservi = $('#Tservicio_transporte').val().replace(/,/g, '');
  var totalcoti = $('#Ttotal_cotizacion').val().replace(/,/g, '');
  var totalcostof = $('#Tcosto_flete').val().replace(/,/g, '');
  var totalutili = $('#Tutilidad').val().replace(/,/g, '');
  var totalrenta = $('#Trentabilidad').val().replace(/,/g, '');
  //total especial
  var totalespecial = $('#Tcosto_especial').val().replace(/,/g, '');
  var totaltaespecial = $('#Ttarifa_especial').val().replace(/,/g, '');
  var totalutilespecial = $('#Tutilidad_especial').val().replace(/,/g, '');
  var totalrentespecial = $('#Trenta_especial').val().replace(/,/g, '');
  var id_cliente = $('#id_cliente_cot').val();
  //datos de negocio
  var bloque_mercancia = {
    mercanc: [],
    natura: [],
    valor: [],
    servicio: [],
    empaque: [],
    operacion: [],
    trnsporte: [],
    cant_vehic: [],
    origen: [],
    destino: [],
    vehiculo: [],
    pesobruto: [],
    pesoneto: [],
    brutotn: [],
    cantidad: [],
    alto: [],
    largo: [],
    ancho: [],
    volumen: [],
    flete: [],
    tarifa: [],
    utilidad: [],
    rentable: [],
    observa: [],
    itemm: [],
    idproducto: [],
    itr: [],
  };
  $('.tmerca').each(function(index) {
    var a = $(this).val();
    bloque_mercancia.mercanc[index] = a;
  });
  $('.natumer').each(function(index) {
    var n = $(this).val();
    bloque_mercancia.natura[index] = n;
  });
  $('.valor_merca').each(function(index) {
    var v = $(this).val().replace(/,/g, '');
    bloque_mercancia.valor[index] = v;
  });
  $('.ts').each(function(index) {
    var servi = $(this).val();
    bloque_mercancia.servicio[index] = servi;
  });
  $('.empaquemer').each(function(index) {
    var empaque = $(this).val();
    bloque_mercancia.empaque[index] = empaque;
  });
  $('.operamer').each(function(index) {
    var operacion = $(this).val();
    bloque_mercancia.operacion[index] = operacion;
  });
  $('.ttransportemer').each(function(index) {
    var tipotrans = $(this).val();
    bloque_mercancia.trnsporte[index] = tipotrans;
  });
  $('.originario').each(function(index) {
    var origen = $(this).val();
    bloque_mercancia.origen[index] = origen;
  });
  $('.destinar').each(function(index) {
    var destino = $(this).val();
    bloque_mercancia.destino[index] = destino;
  });
  $('.tipovehiculo').each(function(index) {
    var tvehiculo = $(this).val();
    bloque_mercancia.vehiculo[index] = tvehiculo;
  });
  $('.cantgastamer').each(function(index) {
    var cant_vehiculo = $(this).val();
    bloque_mercancia.cant_vehic[index] = cant_vehiculo;
  });
  $('.pesobruto').each(function(index) {
    //peso bruto kg
    var pbruto = $(this).val().replace(/,/g, '');
    bloque_mercancia.pesobruto[index] = pbruto;
  });
  $('.pnetomer').each(function(index) {
    var pneto = $(this).val().replace(/,/g, '');
    bloque_mercancia.pesoneto[index] = pneto;
  });
  $('.pesobrutoton').each(function(index) {
    var pbrutotn = $(this).val().replace(/,/g, '');
    bloque_mercancia.brutotn[index] = pbrutotn;
  });
  $('.cantidadmer').each(function(index) {
    var canti = $(this).val().replace(/,/g, '');
    bloque_mercancia.cantidad[index] = canti;
  });
  $('.altomer').each(function(index) {
    var altom = $(this).val().replace(/,/g, '');
    bloque_mercancia.alto[index] = altom;
  });
  $('.largomer').each(function(index) {
    var largom = $(this).val().replace(/,/g, '');
    bloque_mercancia.largo[index] = largom;
  });
  $('.anchomer').each(function(index) {
    var anchom = $(this).val().replace(/,/g, '');
    bloque_mercancia.ancho[index] = anchom;
  });
  $('.volumenmer').each(function(index) {
    var volumenm = $(this).val().replace(/,/g, '');
    bloque_mercancia.volumen[index] = volumenm;
  });
  $('.fletemer').each(function(index) {
    var valflete = $(this).val().replace(/,/g, '');
    bloque_mercancia.flete[index] = valflete;
  });
  $('.tarifamer').each(function(index) {
    var tarifa = $(this).val().replace(/,/g, '');
    bloque_mercancia.tarifa[index] = tarifa;
  });
  $('.utilmer').each(function(index) {
    var util = $(this).val().replace(/,/g, '');
    bloque_mercancia.utilidad[index] = util;
  });
  $('.rentamer').each(function(index) {
    var renta = $(this).val().replace(/,/g, '');
    bloque_mercancia.rentable[index] = renta;
  });
  $('.observamer').each(function(index) {
    var observacion = $(this).val();
    bloque_mercancia.observa[index] = observacion;
  });
  $('.item_merca').each(function(index) {
    var itembloquemerca = $(this).val();
    bloque_mercancia.itemm[index] = itembloquemerca;
  });

  $('.idproducto').each(function(index) {
    var idproducto = $(this).val();
    bloque_mercancia.idproducto[index] = idproducto;
  });

  $('.itr').each(function(index) {
    var itr = $(this).val();
    bloque_mercancia.itr[index] = itr;
  });

  var mercancias = bloque_mercancia;
  mercancias = JSON.stringify(mercancias);
  //datos especiales
  if (typeof $('.tcostoesp').val() !== 'undefined' || typeof $('.tiposerviespe').val() !== 'undefined') {
    bloque_especial = {
      tipo_servicio: [],
      cant: [],
      costo_uni: [],
      tarifa_uni: [],
      calculo: [],
      tarifa: [],
      utilidad: [],
      rentabi: [],
      item_mercancia: [],
      item_especial: [],
    };

    $('.tiposerviespe').each(function(index) {
      var service = $(this).val();
      bloque_especial.tipo_servicio[index] = service;
    });
    $('.cantiespec').each(function(index) {
      var cant = $(this).val();
      bloque_especial.cant[index] = cant;
    });
    $('.valoruni').each(function(index) {
      var costo_uni = $(this).val().replace(/,/g, '');
      bloque_especial.costo_uni[index] = costo_uni;
    });
    $('.tarifaespe').each(function(index) {
      var tarifa = $(this).val().replace(/,/g, '');
      bloque_especial.tarifa_uni[index] = tarifa;
    });
    $('.tcostoesp').each(function(index) {
      var costo = $(this).val().replace(/,/g, '');
      bloque_especial.calculo[index] = costo;
    });
    $('.ttariesp').each(function(index) {
      var tarifa = $(this).val().replace(/,/g, '');
      bloque_especial.tarifa[index] = tarifa;
    });
    $('.tutiesp').each(function(index) {
      var util = $(this).val().replace(/,/g, '');
      bloque_especial.utilidad[index] = util;
    });
    $('.trenesp').each(function(index) {
      var rentab = $(this).val().replace(/,/g, '');
      bloque_especial.rentabi[index] = rentab;
    });
    $('.numeral_mer').each(function(index) {
      var itemmerk = $(this).html();
      bloque_especial.item_mercancia[index] = itemmerk;
    });
    $('.numerale_espe').each(function(index) {
      var itemspecial = $(this).html();
      bloque_especial.item_especial[index] = itemspecial;
    });
    var especiales = bloque_especial;
    especiales = JSON.stringify(especiales);
  } else {
    especiales = '';
  }

  $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
  // Crear una instancia de FormData
  let formData = new FormData();

  // Agregar los parámetros al FormData
  formData.append('nit', nit_empresa);
  formData.append('digito', digito_veri);
  formData.append('dire', direccion);
  formData.append('telefono', telefono);
  formData.append('procedencia', procede_cliente);
  formData.append('observacion_general', observacion_general);
  formData.append('usuario_elaborado', elaborado_por); // Cambiar nombre del parámetro
  formData.append('check', Nacional);
  formData.append('usuario_log', user_log); // Cambiar nombre del parámetro
  formData.append('total_transporte', totalservi);
  formData.append('Ttotal_cotizacion', totalcoti);
  formData.append('Tcosto_flete', totalcostof);
  formData.append('Tutilidad', totalutili);
  formData.append('Trentabilidad', totalrenta);
  formData.append('Tcosto_especial', totalespecial);
  formData.append('Ttarifa_especial', totaltaespecial);
  formData.append('Tutilidad_especial', totalutilespecial);
  formData.append('Trenta_especial', totalrentespecial);
  formData.append('name_cliente', cargar_cliente);
  formData.append('bloques_negocio', mercancias);
  formData.append('bloque_datoespecial', especiales);
  formData.append('clienteid', id_cliente);

  try {
    const response = await fetch($('#id_url_ajax').val() + 'serviciocliente/CrearCotizacion', {
      method: 'POST',
      body: formData,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data.numero === 200) {
      Mensaje(data.numero, data.mensaje);
    } else if (data.numero === 400) {
      Mensaje(data.numero, data.mensaje);
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
  }
}

function Limpiar_formulario() {
  $('#nit_empresa').val('');
  $('#digito_verificacion').val('');
  $('#direccion_cliente').val('');
  $('#telefono_cliente').val('');
  $('#procede_cliente').val('');
  $('.idproducto').val('');
  $('.rndcproducto').val('');
  $('.tmerca').val('');
  $('.natumer').val('');
  $('.valor_merca').val('');
  $('.ts').val('');
  $('.empaquemer').val('');
  $('.operamer').val('');
  $('.ttransportemer').val('');
  $('.cantvehi').val('');
  $('.originario').val('');
  $('.destinar').val('');
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
  $('#observacion').val('');
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
function Validar_operacion_itr(id) {
  if ($('#itr' + id + '').val() === 'Si') {
    var select = document.getElementById('tipotr' + id);
    console.log('🚀 ~ Validar_operacion_itr ~ select:', select);
    // Establece el valor del select
    select.value = 'Urbano';
    // Deshabilita todas las opciones excepto la seleccionada
    var options = select.options;
    for (var i = 0; i < options.length; i++) {
      if (options[i].value !== 'Urbano') {
        options[i].disabled = true; // Deshabilitar
      } else {
        options[i].disabled = false; // Asegurarse de que la seleccionada esté habilitada
      }
    }
    /* Validar el tipo de servicio */
    var select_tipo_servicio = document.getElementById('servicio_cliente' + id);
    // Establece el valor del select
    select_tipo_servicio.value = 'Expreso';
    // Deshabilita todas las opciones excepto la seleccionada
    var options_tipo_servicio = select_tipo_servicio.options;
    for (var i = 0; i < options_tipo_servicio.length; i++) {
      if (options_tipo_servicio[i].value !== 'Expreso') {
        options_tipo_servicio[i].disabled = true; // Deshabilitar
      } else {
        options_tipo_servicio[i].disabled = false; // Asegurarse de que la seleccionada esté habilitada
      }
    }
  } else {
    var select = document.getElementById('tipotr' + id);
    // Establece el valor del select
    select.value = '';
    // Deshabilita todas las opciones excepto la seleccionada
    var options = select.options;
    for (var i = 0; i < options.length; i++) {
      if (options[i].value !== '') {
        options[i].disabled = false; // Deshabilitar
      } else {
        options[i].disabled = true; // Asegurarse de que la seleccionada esté habilitada
      }
    }

    /* Validar el tipo de servicio */
    var select_tipo_servicio = document.getElementById('servicio_cliente' + id);
    // Establece el valor del select
    select_tipo_servicio.value = '';
    // Deshabilita todas las opciones excepto la seleccionada
    var options_tipo_servicio = select_tipo_servicio.options;
    for (var i = 0; i < options_tipo_servicio.length; i++) {
      if (options_tipo_servicio[i].value !== '') {
        options_tipo_servicio[i].disabled = false; // Deshabilitar
      } else {
        options_tipo_servicio[i].disabled = true; // Asegurarse de que la seleccionada esté habilitada
      }
    }
  }
}
