let valores = '';
$(document).ready(function() {
  valores = window.location.search;
  //validar mascara placa crear
  $('#inicial_trailer').change(function() {
    var letra = $('#inicial_trailer').val();
    var numero = $('#conse_trailer').val();
    if ($('#inicial_trailer').val() && $('#conse_trailer').val().length == 5) {
      var concatena = letra + numero;
      $('#placa_trailer').val(concatena);
      Valid_Placa();
    }
  });
  $('#conse_trailer').change(function() {
    var numero = $('#conse_trailer').val();
    var letra = $('#inicial_trailer').val();
    if ($('#inicial_trailer').val() && $('#conse_trailer').val().length == 5) {
      var concatena = letra + numero;
      $('#placa_trailer').val(concatena);
      Valid_Placa();
    }
  });
  //validar placa - editar
  $('#einiciar_trailer').change(function() {
    var eletra = $('#einiciar_trailer').val();
    var num = $('#econse_trailer').val();
    if ($('#einiciar_trailer').val() && num) {
      var econcatena = eletra + num;
      $('#e_placa_trailer').val(econcatena);
    }
  });
  $('#econse_trailer').change(function() {
    var eletra = $('#einiciar_trailer').val();
    var num = $('#econse_trailer').val();
    if ($('#einiciar_trailer').val() && num) {
      var econcatena = eletra + num;
      $('#e_placa_trailer').val(econcatena);
    }
  });

  //validaciones antes de crear el trailer
  // $('#btn_crear_trailer').click(function () {
  //   // alert('hola');
  //   $('.nexos_messages_popup').html('');
  //   var msg_error = '';
  //   //validaciones del formulario
  //   if (!$('#placa_trailer').val()) {
  //     if (!$('#inicial_trailer').val()) {
  //       msg_error += '<p>Debe seleccionar <strong>una letra de la Placa</strong> para poder crear la placa del Tráiler.</p>';
  //     }
  //     if (!$('#conse_trailer').val()) {
  //       msg_error += '<p>Debe ingresar <strong>un número</strong> para poder crear la placa del Tráiler.</p>';
  //     } else {
  //       if ($('#conse_trailer').val().length < 4 || $('#conse_trailer').val().length > 5) {
  //         msg_error += '<p>El campo <strong>Número Placa</strong> debe tener mínimo 4 ó máximo 5 dígitos para poder crear la placa del Tráiler.</p>';
  //       }
  //     }
  //     //msg_error+= "<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el Trailer.</p>";
  //     //AplicaFoco("#placa_trailer");
  //   } else {
  //     if ($('#placa_trailer').val().length < 5 || $('#placa_trailer').val().length > 6) {
  //       msg_error += '<p>El campo <strong>Placa</strong> debe tener mínimo 5 máximo 6 dígitos para poder crear el Tráiler.</p>';
  //     } else {
  //       RemueveFoco('#placa_trailer');
  //     }
  //   }
  //   if (!$('#T_marca').val()) {
  //     msg_error += '<p>Debe diligenciar el campo <strong>Marca Trailer</strong> para poder crear el Tráiler.</p>';
  //     AplicaFoco('#T_marca');
  //   } else {
  //     RemueveFoco('#T_marca');
  //   }
  //   if (!$('#T_peso').val()) {
  //     msg_error += '<p>Debe diligenciar el campo <strong>Peso Vacío(Tn) Trailer</strong> para poder crear el Trailer.</p>';
  //     AplicaFoco('#T_peso');
  //   } else {
  //     if ($('#T_peso').val().length < 3 || $('#T_peso').val().length > 5) {
  //       msg_error += '<p>El campo <strong>Peso Vacío(Tn) Trailer</strong>debet tener mínimo 3 dígitos máximo 5 dígitos para poder crear el Tráiler.</p>';
  //     } else {
  //       RemueveFoco('#T_peso');
  //       if (parseFloat($('#T_peso').val()) <= parseFloat(200) || parseFloat($('#T_peso').val()) >= parseFloat(53000)) {
  //         msg_error += '<p>El campo <strong>Peso Vacío</strong> debe ser mayor a 200 y menor a 53000 kilogramos  para poder crear el Trailer.</p>';
  //       }
  //     }
  //   }
  //   if (!$('#T_volumen').val()) {
  //     msg_error += '<p>Debe diligenciar el campo <strong>Volumen Trailer (m3)</strong> para poder crear el Trailer.</p>';
  //     AplicaFoco('#T_volumen');
  //   } else {
  //     if ($('#T_volumen').val().length < 1) {
  //       msg_error += '<p>El campo <strong>Volumen Trailer (m3)</strong>debe tener mínimo 1 dígitos para poder crear el Trailer.</p>';
  //     } else {
  //       RemueveFoco('#T_volumen');
  //     }
  //   }

  //   /*
  // 	if($("#T_chasis").val()){
  // 		if($("#T_chasis").val().length > 4){
  // 			msg_error+= "<p>El campo <strong>Serie Chasis Trailer</strong> debe tener máximo 4 dígitos para poder crear el Trailer.</p>";
  // 		}else{
  // 			RemueveFoco("#T_chasis");
  // 		}
  // 	}
  // 	*/

  //   if (!$('#T_configuracion').val()) {
  //     msg_error += '<p>Debe diligenciar el campo <strong>Configuración Trailer</strong> para poder crear el Trailer.</p>';
  //     AplicaFoco('#T_configuracion');
  //   } else {
  //     RemueveFoco('#T_configuracion');
  //   }
  //   if (!$('#T_modelo').val()) {
  //     msg_error += '<p>Debe diligenciar el campo <strong>Módelo Trailer</strong> para poder crear el Trailer.</p>';
  //     AplicaFoco('#T_modelo');
  //   } else {
  //     if ($('#T_modelo').val().length > 4) {
  //       msg_error += '<p>El campo <strong>Módelo Trailer</strong> debe tener máximo 4 dígitos para poder crear el Trailer.</p>';
  //     } else {
  //       if (parseFloat($('#T_modelo').val()) < parseFloat(1900)) {
  //         msg_error += '<p>El campo <strong>Módelo Trailer</strong> debe ser mayor a 1900 para poder crear el Trailer.</p>';
  //       }
  //       RemueveFoco('#T_modelo');
  //     }
  //   }
  //   if (!$('#T_alto').val()) {
  //     msg_error += '<p>Debe diligenciar el campo <strong>Alto(m) Trailer</strong> para poder crear el Trailer.</p>';
  //     AplicaFoco('#T_alto');
  //   } else {
  //     if ($('#T_alto').val().length > 10) {
  //       msg_error += '<p>El campo <strong>Alto(m) Tráiler</strong> debe tener máximo 5 dígitos  para poder crear el Trailer.</p>';
  //     }
  //     RemueveFoco('#T_alto');
  //   }
  //   if (!$('#T_largo').val()) {
  //     msg_error += '<p>Debe diligenciar el campo <strong>Largo Trailer</strong> para poder crear el Trailer.</p>';
  //     AplicaFoco('#T_largo');
  //   } else {
  //     if ($('#T_largo').val().length > 10) {
  //       msg_error += '<p>El campo <strong>Largo Trailer</strong> debe tener máximo 5 dígitos para poder crear el Trailer.</p>';
  //     } else {
  //       RemueveFoco('#T_largo');
  //     }
  //   }
  //   if (!$('#T_ancho').val()) {
  //     msg_error += '<p>Debe diligenciar el campo <strong>Ancho Trailer</strong> para poder crear el Trailer.</p>';
  //     AplicaFoco('#T_ancho');
  //   } else {
  //     if ($('#T_ancho').val().length > 10) {
  //       msg_error += '<p>El campo <strong>Ancho Trailer</strong> debe tener 5 dígitos máximo para poder crear el Trailer.</p>';
  //     } else {
  //       RemueveFoco('#T_ancho');
  //     }
  //   }
  //   if (!$('#T_capacidad').val()) {
  //     msg_error += '<p>Debe diligenciar el campo <strong>Capacidad Trailer</strong> para poder crear el Trailer.</p>';
  //     AplicaFoco('#T_capacidad');
  //   } else {
  //     if ($('#T_capacidad').val().length > 5 || $('#T_capacidad').val().length < 3) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Capacidad Trailer</strong> debe tener máximo 5 dígitos , mínimo 3 dígitos para poder crear el Trailer.</p>';
  //     } else {
  //       RemueveFoco('#T_capacidad');
  //     }
  //   }
  //   if (!$('#T_carroceria').val()) {
  //     msg_error += '<p>Debe diligenciar el campo <strong>Tipo Carroceria Trailer</strong> para poder crear el Trailer.</p>';
  //     AplicaFoco('#T_carroceria');
  //   } else {
  //     RemueveFoco('#T_carroceria');
  //   }
  //   if (!$('#T_propietario').val()) {
  //     msg_error += '<p>Debe diligenciar el campo <strong>propietario</strong> para poder crear el Trailer.</p>';
  //     AplicaFoco('#T_propietario');
  //   } else {
  //     RemueveFoco('#T_propietario');
  //   }
  //   if (!$('#foto_trailer').val()) {
  //     msg_error += '<p>Debe diligenciar el campo <strong>Fotos del trailer</strong> para poder crear el Trailer.</p>';
  //     AplicaFoco('#foto_trailer');
  //   } else {
  //     RemueveFoco('#foto_trailer');
  //   }
  //   if ($('#T_aseguradora').val()) {
  //     if (!$('#T_civil').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>N° Responsabilidad Civil</strong> para poder crear el Trailer.</p>';
  //       AplicaFoco('#T_civil');
  //     } else {
  //       if ($('#T_civil').val().length > 20) {
  //         msg_error += '<p>El campo <strong>N° Responsabilidad Civil</strong> debe tener máximo 20 caracteres para poder crear el Trailer.</p>';
  //       } else {
  //         RemueveFoco('#T_civil');
  //       }
  //     }
  //     if (!$('#T_fechavence').val()) {
  //       msg_error += '<p>Debe diligenciar el campo <strong>Fecha Vencimiento</strong> para poder crear el Trailer.</p>';
  //       AplicaFoco('#T_fechavence');
  //     } else {
  //       RemueveFoco('#T_fechavence');
  //     }
  //   }
  //   if ($('#T_caracteristicas').val()) {
  //     if ($('#T_caracteristicas').val().length > 255) {
  //       msg_error += '<p>El campo <strong>Características</strong> debe tener máximo 255 caracteres para poder crear el Trailer.</p>';
  //     }
  //   }
  //   if (!msg_error) {
  //     CrearTrailer();
  //   } else {
  //     $('.nexos_messages_popup').html(
  //       '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
  //         msg_error +
  //         '</div></div>',
  //     );
  //     $('#exampleModalLong').animate({scrollTop: 0}, 600);
  //   }
  // });

  //validaciones antes de editar el trailer
  $('#editareltrailer').click(function() {
    // alert('hdsjhbd');
    $('.enexos_messages_popup').html('');
    var msg_error = '';
    if (!$('#e_placa_trailer').val()) {
      if (!$('#einiciar_trailer').val()) {
        msg_error += '<p>Ingrese el campo <strong>Letra placa</strong> para poder actualizar el Trailer.</p>';
      }
      if (!$('#econse_trailer').val()) {
        msg_error += '<p>Ingrese el campo <strong>números de la placa</strong> para poder actualizar el Trailer.</p>';
      } else {
        if ($('#econse_trailer').val().length == 5) {
          msg_error += '<p>El campo <strong>números de la placa</strong>debe tener 5 dígitos para poder actualizar el Trailer.</p>';
        }
      }
      msg_error += '<p>Debe diligenciar el campo <strong>Placa trailer</strong> para poder actualizar el Trailer.</p>';
      AplicaFoco('#e_placa_trailer');
    } else {
      if (!$('#einiciar_trailer').val()) {
        msg_error += '<p>Ingrese el campo <strong>Letra placa</strong> para poder actualizar el Trailer.</p>';
      }
      if (!$('#econse_trailer').val()) {
        msg_error += '<p>Ingrese el campo <strong>números de la placa</strong> para poder actualizar el Trailer.</p>';
      } else {
        if ($('#econse_trailer').val().length != 5) {
          msg_error += '<p>El campo <strong>números de la placa</strong> debe tener 5 dígitos para poder actualizar el Trailer.</p>';
        }
      }
      if ($('#e_placa_trailer').val().length < 5 || $('#e_placa_trailer').val().length > 6) {
        msg_error += '<p>El campo <strong>Placa trailer</strong> debe tener mínimo 5 ó máximo 6 caracteres para poder actualizar el Trailer.</p>';
      } else {
        RemueveFoco('#e_placa_trailer');
      }
    }
    if (!$('#eT_marca').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Marca Trailer</strong> para poder actualizar el Trailer.</p>';
      AplicaFoco('#eT_marca');
    } else {
      RemueveFoco('#eT_marca');
    }
    if (!$('#eT_peso').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Peso Vacío(Tn) Trailer</strong> para poder actualizar el Trailer.</p>';
      AplicaFoco('#eT_peso');
    } else {
      if ($('#eT_peso').val().length < 3 || $('#eT_peso').val().length > 5) {
        msg_error += '<p>El campo <strong>Peso Vacío(Tn) Trailer</strong>debet tener mínimo 3 dígitos máximo 5 dígitos para poder crear el Tráiler.</p>';
      } else {
        RemueveFoco('#eT_peso');
        if (parseFloat($('#eT_peso').val()) <= parseFloat(200) || parseFloat($('#eT_peso').val()) >= parseFloat(53000)) {
          msg_error += '<p>El campo <strong>Peso Vacío</strong> debe ser mayor a 200 y menor a 53000 kilogramos  para poder crear el Trailer.</p>';
        }
      }
    }
    if (!$('#eT_alto').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Alto(m) Trailer</strong> para poder actualizar el Trailer.</p>';
      AplicaFoco('#eT_alto');
    } else {
      if ($('#eT_alto').val().length > 10) {
        msg_error += '<p>El campo <strong>Alto(m) Trailer</strong> debe tener 5 dígitos para poder actualizar el Trailer.</p>';
      } else {
        RemueveFoco('#eT_alto');
      }
    }
    if (!$('#eT_volumen').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Volumen Trailer (m3)</strong> para poder actualizar el Trailer.</p>';
      AplicaFoco('#eT_volumen');
    } else {
      RemueveFoco('#eT_volumen');
    }

    /*if(!$("#eT_chasis").val()){
			msg_error+= "<p>Debe diligenciar el campo <strong>Serie Chasis Trailer</strong> para poder actualizar el Trailer.</p>";
			AplicaFoco("#eT_chasis");
		}else{
			if($("#eT_chasis").val().length > 4){
				msg_error+= "<p>El campo <strong>Serie Chasis Trailer</strong> debe tener máximo 4 dígitos para poder actualizar el Trailer.</p>";
			}else{
				RemueveFoco("#eT_chasis");
			}
		}*/
    if (!$('#eT_configuracion').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Configuración Trailer</strong> para poder actualizar el Trailer.</p>';
      AplicaFoco('#eT_configuracion');
    } else {
      RemueveFoco('#eT_configuracion');
    }
    if (!$('#eT_modelo').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Módelo Trailer</strong> para poder actualizar el Trailer.</p>';
      AplicaFoco('#eT_modelo');
    } else {
      if ($('#eT_modelo').val().length != 4) {
        msg_error += '<p>El campo <strong>Módelo Trailer</strong> debe tener 4 dígitos para poder actualizar el Trailer.</p>';
      } else {
        RemueveFoco('#eT_modelo');
      }
    }
    if (!$('#eT_ancho').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Ancho Trailer</strong> para poder actualizar el Trailer.</p>';
      AplicaFoco('#eT_ancho');
    } else {
      if ($('#eT_ancho').val().length > 10) {
        msg_error += '<p>El campo <strong>Ancho Trailer</strong> debe tener 5 dígitos máximo para poder actualizar el Trailer.</p>';
      } else {
        RemueveFoco('#eT_ancho');
      }
    }
    if (!$('#eT_largo').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Largo Trailer</strong> para poder actualizar el Trailer.</p>';
      AplicaFoco('#eT_largo');
    } else {
      if ($('#eT_largo').val().length > 10) {
        msg_error += '<p>El campo <strong>Largo Trailer</strong> debe tener 5 dígitos para poder actualizar el Trailer.</p>';
      } else {
        RemueveFoco('#eT_largo');
      }
    }
    if (!$('#eT_capacidad').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Capacidad Trailer</strong> para poder actualizar el Trailer.</p>';
      AplicaFoco('#eT_capacidad');
    } else {
      if ($('#eT_capacidad').val().length > 5) {
        msg_error += '<p>El campo <strong>Capacidad Trailer</strong> debe tener 5 dígitos para poder actualizar el Trailer.</p>';
      } else {
        RemueveFoco('#eT_capacidad');
      }
    }
    if (!$('#eT_carroceria').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Tipo Carroceria Trailer</strong> para poder actualizar el Trailer.</p>';
      AplicaFoco('#eT_carroceria');
    } else {
      RemueveFoco('#eT_carroceria');
    }
    if (!$('#eT_propietario').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Propietario</strong> para poder actualizar el Trailer.</p>';
      AplicaFoco('#eT_propietario');
    } else {
      RemueveFoco('#eT_propietario');
    }
    if (!$('#eT_poseedor').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Poseedor</strong> para poder actualizar el Trailer.</p>';
      AplicaFoco('#eT_poseedor');
    } else {
      RemueveFoco('#eT_poseedor');
    }
    if ($('#eT_caracteristicas').val()) {
      if ($('#eT_caracteristicas').val().length > 255) {
        msg_error += '<p>El campo <strong>Características</strong> debe tener máximo 255 caracteres para poder actualizar el Trailer.</p>';
      }
    }

    if (!msg_error) {
      EditarTrailer();
    } else {
      $('.enexos_messages_popup').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          '</div></div>',
      );
      $('#exampleModalLong').animate({scrollTop: 0}, 600);
    }
  });

  $('#btn_crear_trailer').click(function() {
    window.location = `${$('#id_url_ajax').val()}solicitudes/crear_trailer/${valores}`;
  });
});

var url = $('#id_url_ajax').val() + 'libs/trailer_ajax.php';

//ver trailer
function vertrailer(idtrailer) {
  $('#panel_rndc').html('');
  $('#panel_oet').html('');
  var dato = {
    id: idtrailer,
    action: 'vertrailer',
  };
  $.ajax({
    url: $('#id_url_ajax').val() + 'trailers/ver_trailer',
    type: 'POST',
    data: dato,
    dataType: 'json',
    success: function(data) {
      console.log(data);
      // alert('si ver trailer');
      if (data) {
        if (data.result3 != null && data.result3 != '') {
          var tramite = data.result3[0].tramite;
        } else {
          var tramite = '';
        }
        $('#vplacat').html(data.result.placa);
        $('#vmarca').html(data.result2);
        $('#vpeso_vacio').html(data.result.peso_vacio + 'KG');

        $('#valto').html(data.result.alto);
        $('#vvolumen').html(data.result.volumen);
        $('#vtipo_tramite').html(data.result.tramite);
        $('#vchasis').html(data.result.serie_chasis);

        $('#vconfiguracion').html(data.result4.nombre);
        $('#vmodelo').html(data.result.modelo);
        $('#vancho').html(data.result.ancho);
        $('#vlargo').html(data.result.largo);

        $('#vcapacidad').html(data.result.capacidad);
        $('#vcarroceria').html(data.result5.descripcion);
        $('#vcivil').html(data.result.numero_civil);
        $('#vcarateristica').html(data.result.caracteristica);

        $('#vpropietario').html(data.result6);
        $('#vaposeedor').html(data.result6);
        $('#vestado').html(data.result.estado);

        if (data.result7 != '' && data.result7 != null) {
          $('#vaseguradora').html(data.result7[0].nombre);
          $('#vfecha_vencimiento').html(data.result[0].fecha_vence);
        } else {
          $('#vaseguradora').html('');
          $('#vfecha_vencimiento').html('');
        }

        if (data.result.n_docu_trailer != '' && data.result.n_docu_trailer != null) {
          docu = `<a href="${$('#id_url_ajax').val()}${data.result.foto_trailer}${data.result.n_docu_trailer}"  target="_blank" class="cell-detail hint--top-left" data-hint="">
                    <span class="icon mdi mdi-file-text data-toggle="modal" title="Documento"></span>
                  </a>`;
          $('#vfoto_trailer').html(docu);
        } else {
          $('#vfoto_trailer').html('<p class="text-danger">No existe archivo</p>');
        }

        if (data.result.name_licencia != '' && data.result.name_licencia != null) {
          docu = `<a href="${$('#id_url_ajax').val()}${data.result.foto_licencia}${data.result.name_licencia}"  target="_blank" class="cell-detail hint--top-left" data-hint="">
                    <span class="icon mdi mdi-file-text data-toggle="modal" title="Documento"></span>
                  </a>`;
          $('#vfoto_licencia').html(docu);
        } else {
          $('#vfoto_licencia').html('<p class="text-danger">No existe archivo</p>');
        }

        consulta_trailer_Rndc(data.result.placa);
        Consulta_Dato_Oet(data.result.placa);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('Error en consulta trailer');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//historico del trailer
function historicotrailer(idtrailer) {
  var dato = {
    id: idtrailer,
    action: 'historicotrailer',
  };
  $('#tbhistorico').html('');
  $.ajax({
    url: $('#id_url_ajax').val() + 'trailers/Historico_Trailer',
    type: 'POST',
    data: dato,
    dataType: 'json',
    success: function(data) {
      console.log(data);
      data.forEach(function(element, index) {
        var col = element.estado;
        if (col == '1') {
          status = '<td class="nexos-txt-success">' + '<center><span class="mdi mdi-dot-circle icon" title="Activo"></span></center>' + '</td>';
          p = 'Activo';
        }
        if (col == '0') {
          status = '<td class="nexos-txt-secondary">' + '<center><span class="mdi mdi-dot-circle icon" title="Inactivo"></span></center>' + '</td>';
          p = 'Inactivo';
        }
        $('#tbhistorico').append('<tr>' + status + '<td>' + element.pvehiculo + '</td>' + '<td>' + element.ptrailer + '</td>' + '<td>' + p + '</td>' + '</tr>');
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('no historico');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
//traer los datos a el formulario de editar
// function editartrailer(idtrailer) {
//   var idtrailer = idtrailer;
//   var dato = {
//     id: idtrailer,
//     action: 'editar_traertrailerunico',
//   };
//   $.ajax({
//     url: 'http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php',
//     type: 'POST',
//     data: dato,
//     dataType: 'json',
//     success: function(data) {
//       console.log(data);
//       if (data) {
//         $('#e_id').val(data.result[0].id);
//         //PLACA
//         if (data.result[0].letra_placa == 'R') {
//           $('#einiciar_trailer').html('<option value="' + data.result[0].letra_placa + '">' + data.result[0].letra_placa + '</option>' + '<option value="S">S</option>');
//         } else if (data.result[0].letra_placa == 'S') {
//           $('#einiciar_trailer').html('<option value="' + data.result[0].letra_placa + '">' + data.result[0].letra_placa + '</option>' + '<option value="R">R</option>');
//         }
//         $('#econse_trailer').val(data.result[0].num_placa);
//         $('#e_placa_trailer').val(data.result[0].placa);
//         // $("#eT_marca").val(data.result[0].marca);
//         var marca = $('#eT_marca').html('');
//         $('#eT_marca').html('<option value="">Seleccione</option>');
//         data.result[0].lasmarcas.forEach(function(element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var marca = $('#eT_marca').append('<option ' + tmpSelected + ' value="' + element.codigo + '">' + element.marca + '</option>');
//         });
//         $('#eT_peso').val(data.result[0].peso_vacio);
//         $('#eT_alto').val(data.result[0].alto);
//         $('#eT_volumen').val(data.result[0].volumen);
//         var tramite = $('#eT_tramite').html('');
//         $('#eT_tramite').html('<option value="">Seleccione</option>');
//         data.result[0].eltramite.forEach(function(element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var tramite = $('#eT_tramite').append('<option ' + tmpSelected + ' value="' + element.id + '">' + element.nombre + '</option>');
//         });
//         $('#eT_chasis').val(data.result[0].serie_chasis);
//         // $("#eT_configuracion").val(data.result[0].configuracion);
//         var confi = $('#eT_configuracion').html('');
//         data.result[0].configura.forEach(function(element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var confi = $('#eT_configuracion').append('<option ' + tmpSelected + ' value="' + element.id + '">' + element.sigla + '-' + element.descrip + '</option>');
//         });
//         $('#eT_modelo').val(data.result[0].modelo);
//         $('#eT_ancho').val(data.result[0].ancho);
//         $('#eT_largo').val(data.result[0].largo);
//         $('#eT_capacidad').val(data.result[0].capacidad);
//         $('#e_licencia').val(data.result[0].n_licencia);
//         // $("#eT_carroceria").val(data.result[0].carroceria);
//         var carroceria = $('#eT_carroceria').html('');
//         $('#eT_carroceria').html('<option value="">Seleccione</option>');
//         data.result[0].carroceriatrailer.forEach(function(element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var carroceria = $('#eT_carroceria').append('<option ' + tmpSelected + ' value="' + element.id + '">' + element.nombre + '</option>');
//         });
//         $('#eT_caracteristicas').val(data.result[0].caracteristica);
//         //eT_propietario
//         var propietario = $('#eT_propietario').html('');
//         data.result[0].propietario.forEach(function(element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var propietario = $('#eT_propietario').append('<option ' + tmpSelected + ' value="' + element.numdoc_nexos + '">' + element.nombre + '-' + element.id + '-' + element.tipo + '</option>');
//         });
//         //Poseedor
//         var poseedor = $('#eT_poseedor').html('');
//         data.result[0].poseedor.forEach(function(element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var propietario = $('#eT_poseedor').append('<option ' + tmpSelected + ' value="' + element.numdoc_nexos + '">' + element.nombre + '-' + element.id + '-' + element.tipo + '</option>');
//         });

//         $('#eT_civil').val(data.result[0].numero_civil);
//         //eT_aseguradora
//         var aseguradora = $('#eT_aseguradora').html('');
//         $('#eT_aseguradora').html('<option value="">Seleccione</option>');
//         data.result[0].aseguratrailer.forEach(function(element, index) {
//           var tmpSelected = '';
//           if (element.selected) {
//             tmpSelected = 'selected';
//           }
//           var aseguradora = $('#eT_aseguradora').append('<option ' + tmpSelected + ' value="' + element.id + '">' + element.nom + '</option>');
//         });
//         $('#eT_fechavence').val(data.result[0].fecha_vence);
//         var estado = data.result[0].estado;
//         if (estado == 'Activo') {
//           $('#e_estado').html('<option value="Activo">Activo</option>' + '<option value="Inactivo">Inactivo</option>');
//         } else if (estado == 'Inactivo') {
//           $('#e_estado').html('<option value="Inactivo">Inactivo</option>' + '<option value="Activo">Activo</option>');
//         }

//         if (data.result[0].n_docu_trailer != '' && data.result[0].n_docu_trailer != null) {
//           docu =
//             '<a  href="http://localhost/mvcLuisMiguel/' +
//             data.result[0].foto_trailer +
//             '/' +
//             data.result[0].n_docu_trailer +
//             '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
//             '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
//             '</span>' +
//             '</a>';
//           $('#docuactual').html(docu);
//         } else {
//           $('#docuactual').html('<p class="text-danger">No existe archivo</p>');
//         }

//         if (data.result[0].name_licencia != '' && data.result[0].name_licencia != null) {
//           docu =
//             '<a  href="http://localhost/mvcLuisMiguel/' +
//             data.result[0].foto_licencia +
//             '/' +
//             data.result[0].name_licencia +
//             '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
//             '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
//             '</span>' +
//             '</a>';
//           $('#docuactuall').html(docu);
//         } else {
//           $('#docuactuall').html('<p class="text-danger">No existe archivo</p>');
//         }
//       }
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       // console.log('no trajo trailer a editar');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }
//actualizar datos del trailer
// function EditarTrailer() {
//   var data = null;
//   data = new FormData();
//   var placatrailer = $('#e_placa_trailer').val();
//   if (placatrailer.length != 0) {
//     var trailer = document.getElementById('e_foto_trailer').files;
//     for (var m = 0; m < trailer.length; m++) {
//       data.append('e_foto_trailer' + m, trailer[m]);
//     }
//     var tlicen = document.getElementById('e_foto_licencia').files;
//     for (var y = 0; y < tlicen.length; y++) {
//       data.append('e_foto_licencia' + y, tlicen[y]);
//     }
//     data.append('accion', 'EditarTrailer');
//     data.append('eplaca_trailer', $('#e_placa_trailer').val());
//     data.append('emarca', $('#eT_marca').val());
//     data.append('epeso', $('#eT_peso').val());
//     data.append('ealto', $('#eT_alto').val());
//     data.append('evolumen', $('#eT_volumen').val());
//     data.append('etramite', $('#eT_tramite').val());
//     data.append('echasis', $('#eT_chasis').val());
//     data.append('econfiguracion', $('#eT_configuracion').val());
//     data.append('emodelo', $('#eT_modelo').val());
//     data.append('eancho', $('#eT_ancho').val());
//     data.append('elargo', $('#eT_largo').val());
//     data.append('ecapacidad', $('#eT_capacidad').val());
//     data.append('ecarroceria', $('#eT_carroceria').val());
//     data.append('ecaracteristicas', $('#eT_caracteristicas').val());
//     data.append('epropietario', $('#eT_propietario').val());
//     data.append('ecivil', $('#eT_civil').val());
//     data.append('easeguradora', $('#eT_aseguradora').val());
//     data.append('efechavence', $('#eT_fechavence').val());
//     data.append('e_id', $('#e_id').val());
//     data.append('estado', $('#e_estado').val());
//     data.append('namenew', $('#namenew').val()); //nombre del archivo actual
//     data.append('e_licencia', $('#e_licencia').val());
//     //nombre actual de nuevo archivo licencia
//     data.append('namenlic', $('#namenlic').val());
//     data.append('eposeedor', $('#eT_poseedor').val());
//   }
//   // var url =$("#id_url_ajax").val() + "libs/vehiculos_ajax.php";
//   $.ajax({
//     url: url,
//     type: 'POST',
//     data: data,
//     cache: false,
//     processData: false, // Don't process the files
//     contentType: false, // Set content type to false as jQuery will tell the server its a query string request
//     dataType: 'json',
//     success: function(data, textStatus, jqXHR) {
//       if (!data.error) {
//         placa = $('#e_placa_trailer').val();
//         mensaje = 'Datos del Tráiler Actualizados Exitosamente NexosAPP';
//         icon = 'check';
//         color = 'success';
//         pal = 'Proceso terminado';
//         paquete_transmite = '';
//         actualizar_Dato_Ministerio(placa);
//       } else {
//         mensaje = 'Datos del Tráiler No Actualizados NexosAPP';
//         icon = 'close';
//         color = 'danger';
//         pal = 'Error';
//       }
//       $('.enexos_messages_popup').append(
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
//       $('#editartrailer').animate({scrollTop: 0}, 900);
//       if (data.error) {
//         setTimeout(function() {
//           location.reload(false);
//         }, 800);
//       }
//       //setTimeout(function() { location.reload(false);  }, 800);
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       console.log('NO ACTUALIZO TRAILER');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

function actualizar_Dato_Ministerio(placa) {
  proceso = 12;
  var paquete_transmite = 'placa=' + placa + '&proceso=' + proceso + '&dato=3' + '&filtro=""' + '&tipopro=3';
  $.post(
    $('#id_url_ajax').val() + 'web_service/trailers',
    paquete_transmite,
    function(data) {
      if (data.status == 'true') {
        tablas_locales = 'Se Registro Datos Exitosamente RNDC';
        $('.enexos_messages_popup').append(
          '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
            tablas_locales +
            ' - ' +
            data.resultado +
            '</div></div>',
        );
        $('#editartrailer').animate({scrollTop: 0}, 600);
        actualizar_Dato_Oet(placa);
      } else if (data.status == 'false') {
        tablas_locales = 'No se creo el Tráiler en RNDC';
        $('.enexos_messages_popup').append(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
            tablas_locales +
            ' - ' +
            data.resultado +
            '</div></div>',
        );
        $('#editartrailer').animate({scrollTop: 0}, 600);
        //setTimeout(function() { location.reload(false); }, 800);
        actualizar_Dato_Oet(placa);
      }
    },
    'json',
  );
}

function actualizar_Dato_Oet(placa) {
  clase = 3;
  recurso = 8;
  valor = '&dato_recurso=' + placa;
  var paquete = 'clase_recurso=' + clase + '&recurso=' + recurso + valor;
  $.post(
    $('#id_url_ajax').val() + 'integrar_oet/Consulta_Recurso_Avansat',
    paquete,
    function(data) {
      if (data.status == true || data.status == 'true') {
        var tablas_locales = 'Se Actualizo Tráiler Exitosamente GRUPO OET';
        $('.enexos_messages_popup').append(
          '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
            tablas_locales +
            '</div></div>',
        );
        $('#editartrailer').animate({scrollTop: 0}, 600);
        //setTimeout(function() { location.reload(false);  }, 800);
      } else if (data.status == false || data.status == 'false') {
        var tablas_locales = 'No se Actualizo Tráiler en GRUPO OET';
        $('.enexos_messages_popup').append(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
            tablas_locales +
            ' - ' +
            data.error +
            '</div></div>',
        );
        $('#editartrailer').animate({scrollTop: 0}, 600);
        //setTimeout(function() { location.reload(false);  }, 800); ss
      }
    },
    'json',
  );
}

function consulta_trailer_Rndc(placa) {
  $('#panel_rndc').html('');
  var paquete_transmite = 'documento=' + placa;
  $.post(
    $('#id_url_ajax').val() + 'web_service/Consulta_Trailer_Rndc',
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

function Consulta_Dato_Oet(placa) {
  $('#panel_oet').html('');
  var paquete = 'placa_trailer=' + placa;
  //Consulta_Recurso_Avansat
  $.post(
    $('#id_url_ajax').val() + 'integrar_oet/Consulta_Trailer',
    paquete,
    function(data) {
      if (data.status == true || data.status == 'true') {
        $('#panel_oet').html('<p class="text-center text-success">' + data.resultado + '</p>');
      } else if (data.status == false || data.status == 'false') {
        $('#panel_oet').html('<p class="text-center text-danger">' + data.resultado + '</p>');
      }
    },
    'json',
  );
}
