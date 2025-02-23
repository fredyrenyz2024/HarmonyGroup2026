$(document).ready(function() {
  $('#content_vehiculo').hide();
  $('#content_conductor').hide();
  $('#content_risk').hide();
  $('#select_option').hide();
  $('#title').hide();
  $('#recoger_trailer').hide();
  $('#recoger_trailer2').hide();
  $('#divdatopreestudio').hide();

  //var urle =$("#id_url_ajax").val() + "public/files/estudioseguridad";

  var urle = 'public/files/estudioseguridad';

  //FUNCION PARA CARGAR EL SELECT DE TIPOS DE ESTUDIO
  cargarselect();
  //FUNCION AL CERRAR EL MODAL DE LISTA COMPROBACION

  //OPCIONES DEL BOTON DE INICIO
  $('#inicio_estudio').click(function() {
    //alert('iniciarESTUDIO DE SEGURIDAD');
    inicio_estudio();
  });
  //STATUS

  //OPCIONES DEL SELECT
  $('#select_option').change(function() {
    // alert('select');
    //traer el valor del select é imprimir el contenedor
    var valor = $('#select_option').val();
    $('#evi_plataforma').val('');
    $('#name_eviden').val('');
    $('#obse_todo').val('');
    $('#obse_condu').val('');
    $('#observeheciulo').val('');
    // alert(valor);
    if (valor == '0') {
      $('#content_vehiculo').hide();
      $('#content_conductor').hide();
      $('#content_risk').hide();
      $('#divdatopreestudio').hide();
    }

    if (valor == '1') {
      $('#content_vehiculo').show();
      $('#content_conductor').hide();
      $('#divdatopreestudio').hide();
      $('#content_risk').hide();
      $('#id_tvehiculo').val(1);
      $('#botonescar').html(
        '<button class="btn btn-sm btn-success" id="aprobarv1">Aprobar vehículo</button>' +
          '<button class="btn btn-sm btn-danger" id="noaprobarv1">Rechazar vehículo</button>',
      );
      verVehiculo();
    }

    if (valor == '2') {
      $('#content_conductor').show();
      $('#content_vehiculo').hide();
      $('#divdatopreestudio').hide();
      $('#content_risk').hide();
      $('#id_tconductor').val(2);
      $('#botondriver').html(
        '<button class="btn btn-sm btn-success" id="aprobarc1">Aprobar conductor</button>' +
          '<button class="btn btn-sm btn-danger" id="noaprobarc1">Rechazar conductor</button>',
      );
      verConductor();
    }

    if (valor == '3') {
      // alert('risk');
      var tipo = 'risck';
      var ruta = urle + '/risck';
      $('#divdatopreestudio').hide();
      $('#content_risk').show();
      $('#content_vehiculo').hide();
      $('#content_conductor').hide();
      $('#tipo_plataforma').val(tipo);
      $('#ruta_eviden').val(ruta);
      $('#id_totros').val(3);
      $('#losbototnes').html(
        '<button class="btn btn-sm btn-success" id="aprobarr1">Aprobar</button>' +
          '<button class="btn btn-sm btn-danger" id="noaprobarr1">Rechazar</button>',
      );
    }

    if (valor == '4') {
      // alert('siplaft');
      var tipo = 'siplaft';
      var ruta = urle + '/siplaft';
      $('#divdatopreestudio').hide();
      $('#content_risk').show();
      $('#content_vehiculo').hide();
      $('#content_conductor').hide();
      $('#tipo_plataforma').val(tipo);
      $('#ruta_eviden').val(ruta);
      $('#id_totros').val(4);
    }

    if (valor == '5') {
      // alert('runt');
      var tipo = 'runt';
      var ruta = urle + '/runt';
      $('#divdatopreestudio').hide();
      $('#content_vehiculo').hide();
      $('#content_conductor').hide();
      $('#content_risk').show();
      $('#tipo_plataforma').val(tipo);
      $('#ruta_eviden').val(ruta);
      $('#id_totros').val(5);
      $('#losbototnes').html(
        '<button class="btn btn-sm btn-success" id="aprobarr2">Aprobar</button>' +
          '<button class="btn btn-sm btn-danger" id="noaprobarr2">Rechazar</button>',
      );
    }

    if (valor == '6') {
      // alert('policia');
      var tipo = 'policia';
      var ruta = urle + '/policia';
      $('#divdatopreestudio').hide();
      $('#content_risk').show();
      $('#content_vehiculo').hide();
      $('#content_conductor').hide();
      $('#tipo_plataforma').val(tipo);
      $('#ruta_eviden').val(ruta);
      $('#id_totros').val(6);
      $('#losbototnes').html(
        '<button class="btn btn-sm btn-success" id="aprobarr3">Aprobar</button>' +
          '<button class="btn btn-sm btn-danger" id="noaprobarr3">Rechazar</button>',
      );
    }

    if (valor == '7') {
      // alert('procuraduria');
      var tipo = 'procuraduria';
      var ruta = urle + '/procuraduria';
      $('#divdatopreestudio').hide();
      $('#content_risk').show();
      $('#content_vehiculo').hide();
      $('#content_conductor').hide();
      $('#tipo_plataforma').val(tipo);
      $('#ruta_eviden').val(ruta);
      $('#id_totros').val(7);
      $('#losbototnes').html(
        '<button class="btn btn-sm btn-success" id="aprobarr4">Aprobar</button>' +
          '<button class="btn btn-sm btn-danger" id="noaprobarr4">Rechazar</button>',
      );
    }

    if (valor == '8') {
      // alert('simit');
      var tipo = 'simit';
      var ruta = urle + '/simit';
      $('#divdatopreestudio').hide();
      $('#content_risk').show();
      $('#content_vehiculo').hide();
      $('#content_conductor').hide();
      $('#tipo_plataforma').val(tipo);
      $('#ruta_eviden').val(ruta);
      $('#id_totros').val(8);
      $('#losbototnes').html(
        '<button class="btn btn-sm btn-success" id="aprobarr5">Aprobar</button>' +
          '<button class="btn btn-sm btn-danger" id="noaprobarr5">Rechazar</button>',
      );
    }

    if (valor == '9') {
      // alert('siscom');
      var ruta = urle + '/siscomn';
      var tipo = 'siscomn';
      $('#divdatopreestudio').hide();
      $('#content_risk').show();
      $('#content_vehiculo').hide();
      $('#content_conductor').hide();
      $('#tipo_plataforma').val(tipo);
      $('#ruta_eviden').val(ruta);
      $('#id_totros').val(9);
      $('#losbototnes').html(
        '<button class="btn btn-sm btn-success" id="aprobarr6">Aprobar</button>' +
          '<button class="btn btn-sm btn-danger" id="noaprobarr6">Rechazar</button>',
      );
    }

    if (valor == '10') {
      // alert('adres');
      var tipo = 'adres';
      var ruta = urle + '/adres';
      $('#divdatopreestudio').hide();
      $('#content_risk').show();
      $('#content_vehiculo').hide();
      $('#content_conductor').hide();
      $('#tipo_plataforma').val(tipo);
      $('#ruta_eviden').val(ruta);
      $('#id_totros').val(10);
      $('#losbototnes').html(
        '<button class="btn btn-sm btn-success" id="aprobarr7">Aprobar</button>' +
          '<button class="btn btn-sm btn-danger" id="noaprobarr7">Rechazar</button>',
      );
    }
    if (valor == '11') {
      var tipo = 'Gps';
      var ruta = urle + '/gps';
      $('#divdatopreestudio').hide();
      $('#content_risk').show();
      $('#content_vehiculo').hide();
      $('#content_conductor').hide();
      $('#tipo_plataforma').val(tipo);
      $('#ruta_eviden').val(ruta);
      $('#id_totros').val(11);
      $('#losbototnes').html(
        '<button class="btn btn-sm btn-success" id="aprobarr8">Aprobar</button>' +
          '<button class="btn btn-sm btn-danger" id="noaprobarr8">Rechazar</button>',
      );
    }

    if (valor == '12') {
      var tipo = 'Dato preestudio';
      var ruta = urle + '/dato_preestudio';
      //traer el preestudio

      $('#content_risk').show();
      $('#divdatopreestudio').hide();
      $('#content_vehiculo').hide();
      $('#content_conductor').hide();
      $('#tipo_plataforma').val(tipo);
      $('#ruta_eviden').val(ruta);
      $('#id_totros').val(12);
      $('#losbototnes').html(
        '<button class="btn btn-sm btn-success" id="aprobarr9">Aprobar</button>' +
          '<button class="btn btn-sm btn-danger" id="noaprobarr9">Rechazar</button>',
      );
    }

    //hojas de vida del vehiculo
    $('#aprobarv1').click(function() {
      //alert('entro a aprobar hv vehiculo VEHICULO');
      aprobar_vehiculo();
    });

    $('#noaprobarv1').click(function() {
      // alert('entro a NO aprobar hv vehiculo VEHICULO');
      desaprobar_vehiculo();
    });
    //hoja de vida del conductor
    $('#aprobarc1').click(function() {
      aprobar_conductor();
    });

    $('#noaprobarc1').click(function() {
      desaprobar_conductor();
    });
    //risk
    $('#aprobarr1').click(function() {
      aprobar_risk();
    });

    $('#noaprobarr1').click(function() {
      desaprobar_risk();
    });

    //runt
    $('#aprobarr2').click(function() {
      aprobar_risk();
    });

    $('#noaprobarr2').click(function() {
      desaprobar_risk();
    });
    //policia
    $('#aprobarr3').click(function() {
      aprobar_risk();
    });

    $('#noaprobarr3').click(function() {
      desaprobar_risk();
    });

    //procuraduria
    $('#aprobarr4').click(function() {
      aprobar_risk();
    });

    $('#noaprobarr4').click(function() {
      desaprobar_risk();
    });

    //simit
    $('#aprobarr5').click(function() {
      aprobar_risk();
    });

    $('#noaprobarr5').click(function() {
      desaprobar_risk();
    });

    //siscomn
    $('#aprobarr6').click(function() {
      aprobar_risk();
    });

    $('#noaprobarr6').click(function() {
      desaprobar_risk();
    });

    //adres
    $('#aprobarr7').click(function() {
      aprobar_risk();
    });

    $('#noaprobarr7').click(function() {
      desaprobar_risk();
    });

    //gps
    $('#aprobarr8').click(function() {
      aprobar_risk();
    });

    $('#noaprobarr8').click(function() {
      desaprobar_risk();
    });

    //datos preestudio
    $('#aprobarr9').click(function() {
      aprobar_risk();
    });

    $('#noaprobarr9').click(function() {
      desaprobar_risk();
    });
  });

  //LISTA COMPROBACION - validar select para que aparezacan los botones
  $('#aprobar_estudio_total').hide();

  $('#estado_estu').change(function() {
    var select = $('#estado_estu').val();
    if (select == '') {
      $('#aprobar_estudio_total').hide();
    }
    //validar el estado y que tenga todo aprobado
    if (select == 'Aprobado') {
      var idvehiculo = $('#idvehiculo').val();
      var idconductor = $('#idconductor').val();
      var idestudio = $('#idstudy').val();
      if (idvehiculo.length > '0' && idconductor.length > '0' && idestudio.length > '0') {
        $('#aprobar_estudio_total').show();
      } else {
        alert('No puede aprobar el estudio falta algún dato de la primera hilera');
      }
    }

    if (select == 'Pendiente') {
      var idvehiculo = $('#idvehiculo').val();
      var idconductor = $('#idconductor').val();
      var idestudio = $('#idstudy').val();
      if (idvehiculo.length > '0' && idconductor.length > '0' && idestudio.length > '0') {
        $('#aprobar_estudio_total').show();
      } else {
        alert('No puede aprobar el estudio falta algún dato de la primera hilera');
      }
    }

    if (select == 'Rechazado') {
      var idvehiculo = $('#idvehiculo').val();
      var idconductor = $('#idconductor').val();
      var idestudio = $('#idstudy').val();
      if (idvehiculo.length > '0' && idconductor.length > '0' && idestudio.length > '0') {
        $('#aprobar_estudio_total').show();
      } else {
        alert('No puede aprobar el estudio falta algún dato de la primera hilera');
      }
    }

    if (select == 'Rechazado_modificar') {
      var idvehiculo = $('#idvehiculo').val();
      var idconductor = $('#idconductor').val();
      var idestudio = $('#idstudy').val();
      if (idvehiculo.length > '0' && idconductor.length > '0' && idestudio.length > '0') {
        $('#aprobar_estudio_total').show();
      } else {
        alert('No puede aprobar el estudio falta algún dato de la primera hilera');
      }
    }
  });

  $('#aprobar_estudio_total').click(function() {
    var select = $('#estado_estu').val();
    var idvehiculo = $('#idvehiculo').val();
    var idconductor = $('#idconductor').val();
    var idestudio = $('#idstudy').val();
    var estado = $('#estado_estu').val();
    var obse = $('#obse_estu').val();
    var usuario = $('#ee_usuario').val();
    var id_preestudio = $('#id_preestudioc').val();

    //if(idvehiculo.length>0 && idconductor.length>0 && idestudio.length >0 && select=='Aprobado'){
    if (select == 'Aprobado') {
      //validar requeridos
      var sw2 = 's';
      var tipoestu = {
        idestudio: idestudio,
        action: 'tipos_estudio',
      };
      $.ajax({
        url: 'http://20.75.48.126/principal/libs/seguridad_estudio2_ajax.php',
        type: 'POST',
        data: tipoestu,
        dataType: 'json',
        success: function(data) {
          if (data.result) {
            //resultado de tb aprobaciones x seguridad

            var tmp = Array();
            tmp = data.result;
            var c = tmp.length;

            var sw = 0;
            for (i = 0; i <= c; i++) {
              //alert(tmp[i][0]+tmp[i][1]+tmp[i][2]+tmp[i][3] );
              idtipos = tmp[i][1];
              if (tmp[i][2] == 0 && tmp[i][3] == 1) {
                sw = 1;
                alert('No es posible aprobar el estudio completo cuando tiene tipos de estudio rechazados que son obligatorios: ' + tmp[i][5]);
              }
              //alert(sw);
              //alert(i);
              if (tmp[i][2] == null && tmp[i][3] == 1) {
                sw = 1;
                alert('No es posible aprobar el estudio completo cuando tiene tipos de estudio  que son obligatorios sin contestar ' + tmp[i][5]);
              }
              if (sw == 0 && i == c - 1) {
                //alert('Es posible guardar');
                var url = $('#id_url_ajax').val() + 'libs/seguridad_estudio_ajax.php';
                var data = null;
                data = new FormData();
                data.append('accion', 'aprobacioncompleta');
                data.append('idcarro', $('#idvehiculo').val());
                data.append('idcondu', $('#idconductor').val());
                data.append('idestudio', $('#idstudy').val());
                data.append('obser', $('#obse_estu').val());
                data.append('user', $('#ee_usuario').val());
                data.append('proceso', $('#proceso').val());
                data.append('proceso_estudio', $('#proceso_estudio').val());
                data.append('estado', 'Aprobado');
                $.ajax({
                  url: url,
                  type: 'POST',
                  data: data,
                  cache: false,
                  processData: false, // Don't process the files
                  contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                  dataType: 'json',
                  success: function(data, textStatus, jqXHR) {
                    // console.log('si inserto hoja vida conductor');
                    alert('Datos del Estudio Registrados Exitosamente ');
                    /*$("html, body").animate({ scrollTop: 0 }, 600);
												setTimeout(function() { location.reload(false);  }, 800);*/

                    $('#ver_lista').modal('hide');
                    solicitudes();
                  },
                  error: function(jqXHR, textStatus, errorThrown) {
                    alert('Datos del Estudio Registrados Exitosamente');
                    /*$("html, body").animate({ scrollTop: 0 }, 600);
												setTimeout(function() { location.reload(false);  }, 800);*/
                    $('#ver_lista').modal('hide');
                    solicitudes();
                    console.log('no inserto hv conductor');
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                  },
                });
              }
            }
          } //termina data.result
        },
        error: function(jqXHR, textStatus, errorThrown) {
          alert('ocurrio un error');
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }

    if (select == 'Rechazado') {
      var url = $('#id_url_ajax').val() + 'libs/seguridad_estudio_ajax.php';
      var data = null;
      data = new FormData();
      data.append('accion', 'aprobacioncompleta');
      data.append('idcarro', $('#idvehiculo').val());
      data.append('idcondu', $('#idconductor').val());
      data.append('idestudio', $('#idstudy').val());
      data.append('obser', $('#obse_estu').val());
      data.append('user', $('#ee_usuario').val());
      data.append('proceso', $('#proceso').val());
      data.append('proceso_estudio', $('#proceso_estudio').val());
      data.append('estado', 'Rechazado');
      data.append('id_de_preestudio', $('#id_preestudioc').val());
      $.ajax({
        url: url,
        type: 'POST',
        data: data,
        cache: false,
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
          // console.log('si inserto hoja vida conductor');
          alert('Datos del Estudio Registrados Exitosamente ');
          /*$("html, body").animate({ scrollTop: 0 }, 600);
						setTimeout(function() { location.reload(false);  }, 800);*/
          $('#ver_lista').modal('hide');
          solicitudes();
        },
        error: function(jqXHR, textStatus, errorThrown) {
          alert('Datos del Estudio Registrados Exitosamente');
          /*$("html, body").animate({ scrollTop: 0 }, 600);
						setTimeout(function() { location.reload(false);  }, 800);*/
          $('#ver_lista').modal('hide');
          solicitudes();
          console.log('no inserto hv conductor');
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }

    if (select == 'Pendiente') {
      var url = $('#id_url_ajax').val() + 'libs/seguridad_estudio_ajax.php';
      var data = null;
      data = new FormData();
      data.append('accion', 'aprobacioncompleta');
      data.append('idcarro', $('#idvehiculo').val());
      data.append('idcondu', $('#idconductor').val());
      data.append('idestudio', $('#idstudy').val());
      data.append('obser', $('#obse_estu').val());
      data.append('user', $('#ee_usuario').val());
      data.append('proceso', $('#proceso').val());
      data.append('proceso_estudio', $('#proceso_estudio').val());
      data.append('estado', 'Pendiente');
      $.ajax({
        url: url,
        type: 'POST',
        data: data,
        cache: false,
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
          // console.log('si inserto hoja vida conductor');
          alert('Datos del Estudio Registrados Exitosamente ');
          /*$("html, body").animate({ scrollTop: 0 }, 600);
						setTimeout(function() { location.reload(false);  }, 800);*/
          $('#ver_lista').modal('hide');
          solicitudes();
        },
        error: function(jqXHR, textStatus, errorThrown) {
          alert('Datos del Estudio Registrados Exitosamente');
          /*$("html, body").animate({ scrollTop: 0 }, 600);
						setTimeout(function() { location.reload(false);  }, 800);*/
          $('#ver_lista').modal('hide');
          solicitudes();
          console.log('no inserto hv conductor');
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }

    if (select == 'Rechazado_modificar') {
      if (!$('#obse_estu').val()) {
        alert('Debe diligenciar la observación, por favor escriba brevemente los motivos del rechazo para modificar');
      } else {
        var url = $('#id_url_ajax').val() + 'libs/seguridad_estudio_ajax.php';
        var data = null;
        data = new FormData();
        data = new FormData();
        data.append('accion', 'aprobacioncompleta');
        data.append('idcarro', $('#idvehiculo').val());
        data.append('idcondu', $('#idconductor').val());
        data.append('idestudio', $('#idstudy').val());
        data.append('obser', $('#obse_estu').val());
        data.append('user', $('#ee_usuario').val());
        data.append('proceso', $('#proceso').val());
        data.append('proceso_estudio', $('#proceso_estudio').val());
        data.append('estado', 'Rechazado_modificar');

        $.ajax({
          url: url,
          type: 'POST',
          data: data,
          cache: false,
          processData: false, // Don't process the files
          contentType: false, // Set content type to false as jQuery will tell the server its a query string request
          dataType: 'json',
          success: function(data, textStatus, jqXHR) {
            // console.log('si inserto hoja vida conductor');
            alert('Datos del Estudio Registrados Exitosamente ');
            /*$("html, body").animate({ scrollTop: 0 }, 600);
						setTimeout(function() { location.reload(false);  }, 800);*/
            $('#ver_lista').modal('hide');
            solicitudes();
          },
          error: function(jqXHR, textStatus, errorThrown) {
            alert('Datos del Estudio Registrados Exitosamente');
            /*$("html, body").animate({ scrollTop: 0 }, 600);
						setTimeout(function() { location.reload(false);  }, 800);*/
            $('#ver_lista').modal('hide');
            solicitudes();
            console.log('no inserto hv conductor');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
      }
    }
  });
});

//DEMÁS FUNCIONES
var url = $('#id_url_ajax').val() + 'libs/seguridad_estudio_ajax.php';

//status
//CARGAR SELECT
function cargarselect() {
  // alert('cargue el select');
  var dato1s = {
    action: 'cargue_select',
  };
  $('#select_option').html('<option value="0">Seleccione una opcion</option>');
  $.ajax({
    url: 'http://20.75.48.126/principal/libs/seguridad_estudio2_ajax.php',
    type: 'POST',
    data: dato1s,
    dataType: 'json',
    success: function(data) {
      if (data.result) {
        data.result.forEach(function(element, index) {
          $('#select_option').append('<option value="' + element.id + '">' + element.nombre + '</option>');
        });
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no cargo el select');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
//VALIDACIONES DEL BOTON estudio de vehiculo
function verDatos(id, idc, idsoli) {
  /*alert('hola ');
	 alert(id);
	 alert(idc);*/
  alert('hello' + idsoli);
  $('#valor_vehiculo').val(id);
  $('#valor_conductor').val(idc);
  $('#id_soli').val(idsoli);
  //validar si existe un estudio iniciado en cabecra y completado
  //para mostrar el select o el boton
  var datos2 = {
    id_soli: idsoli,
    action: 'verifiar_boton',
  };
  //si ya existe un estudio de seguridad en la tabla cmx_completo
  //dejarle ver el select
  $.ajax({
    url: 'http://20.75.48.126/principal/libs/seguridad_estudio2_ajax.php',
    type: 'POST',
    data: datos2,
    dataType: 'json',
    success: function(data) {
      // console.log(data);
      if (data.result) {
        //si trae algo APARECER EL SELECT Y DESAPARECER EL BOTON
        var estado = data.result[0].estado;
        if (estado == 'iniciado') {
          $('#inicio_estudio').hide();
          $('#title').show();
          $('#select_option').show();
        }
        if (estado == 'completado') {
          alert('debe aparecer otra cosa , estadocompletado');
        }
      } else {
        //si no trae nada, APARECER el boton y desaparece el select
        $('#inicio_estudio').show();
        $('#title').hide();
        $('#select_option').hide();
        //ocultar todos los contenedores
        $('#content_vehiculo').hide();
        $('#content_conductor').hide();
        $('#content_risk').hide();
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('oh ohoh');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//iniciar el estudio de seguridad
function inicio_estudio() {
  //registrar en la tabla de cabecra y completo
  //alert('iniciar estudio de seguridad');
  var id_soli = $('#id_soli').val();
  var idv = $('#valor_vehiculo').val();
  var idc = $('#valor_conductor').val();
  var id_preestudio = $('#id_preestudioc').val();
  // alert('soli'+id_soli);
  // alert('vehiculo'+idv);
  // alert('conductor'+idc);
  //validar que no exista un estudio con ese id de estudio
  var dato = {
    idsoli: id_soli,
    action: 'validar_inicio',
  };
  $.ajax({
    url: 'http://20.75.48.126/principal/libs/seguridad_estudio2_ajax.php',
    type: 'POST',
    data: dato,
    dataType: 'json',
    success: function(data) {
      if (data.result) {
        alert('ya existe un estudio de seguridad iniciado  con ese numero, por favor realice el estudio de seguridad');
        // $("html, body").animate({ scrollTop: 0 }, 600);
        // setTimeout(function() { location.reload(false);  }, 800);
        // 	$("#inicio").hide();
        // $("#title").show();
        // $("#select_option").show();
      } else {
        //alert('no existe estudio con ese numero');
        // var data = null;
        data = new FormData();
        data.append('accion', 'iniciostudy');
        data.append('solicitud', id_soli);
        data.append('fecha', $('#fechag').val());
        data.append('hora', $('#horag').val());
        data.append('user', $('#usuariog').val());
        data.append('vehiculo', idv);
        data.append('conductor', idc);
        $.ajax({
          url: url,
          type: 'POST',
          data: data,
          cache: false,
          processData: false, // Don't process the files
          contentType: false, // Set content type to false as jQuery will tell the server its a query string request
          dataType: 'json',
          success: function(data, textStatus, jqXHR) {
            // console.log('si inserto inicio estudio');

            /*$("html, body").animate({ scrollTop: 0 }, 600);
								 setTimeout(function() { location.reload(false);  }, 800);*/
            solicitudes();
            lista(idv, idc, id_soli, id_preestudio);
            alert('Inicio Exitosamente el estudio de seguridad');
            //APARECER EL SELECT Y DESAPARECER EL BOTON
            // $("#inicio").hide();
            // $("#title").show();
            // $("#select_option").show();
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('no inserto inicio');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
//CONSULTAR EL VEHÍCULO
function verVehiculo() {
  // alert('entro a ver vehiculo');
  var id = $('#valor_vehiculo').val();
  // var params = {
  // 	accion: 'verVehiculo',
  // 	id_vehiculo : id
  // };

  // $.post(url, params, function (data){
  // 	if(data.success){
  // 		console.log('OK SI TRAE DATOS');
  // 	}
  // }, 'json');

  var params = {
    action: 'verVehiculo',
    id_vehiculo: id,
  };
  $('#fotos_vehiculo').html('');
  $.ajax({
    url: 'http://20.75.48.126/principal/libs/seguridad_estudio2_ajax.php',
    type: 'POST',
    data: params,
    dataType: 'json',
    success: function(data) {
      // console.log('si hayyyy');
      // console.log(data);
      if (data.result) {
        //alert('entroooo');
        //alert(data.result[0].cod_tipo_combustible);
        var combustible = '';
        //alert(configurar);
        $('#placa').val(data.result[0].placa);
        $('#confi').val(data.result[0].configure);
        $('#color').val(data.result[0].color);
        $('#marca').val(data.result[0].marca);
        if (data.result[0].cod_tipo_combustible == 1) {
          combustible = 'Diesel o ACPM';
        }
        if (data.result[0].cod_tipo_combustible == 2) {
          combustible = 'Gasolina';
        }
        if (data.result[0].cod_tipo_combustible == 3) {
          combustible = 'Gas';
        }
        if (data.result[0].cod_tipo_combustible == 4) {
          combustible = 'Gas/Gasolina';
        }

        $('#tip_combustible').val(combustible);
        $('#linea').val(data.result[0].linea);
        $('#anio').val(data.result[0].anio_fabricacion);
        // $("#tipo_vehi").val(data.result[0].tipo_carron);
        $('#tipo_caro').val(data.result[0].tipo_carroceria);
        $('#carroceria').val(data.result[0].cod_rndc_carroceria);
        $('#peso').val(data.result[0].peso);
        $('#capacidad').val(data.result[0].capacidad_tn);
        $('#peso_bruto').val(data.result[0].pesobruto_kg);
        $('#nsoat').val(data.result[0].num_soat);
        $('#vsoat').val(data.result[0].vence_soat);
        $('#ase').val(data.result[0].aseguradora);
        $('#tecno').val(data.result[0].tecnomecanica);
        $('#vtecno').val(data.result[0].tecno_fecha_vigencia);
        $('#webs').val(data.result[0].web_satelital);
        $('#usuarios').val(data.result[0].usuario_satelital);
        $('#claves').val(data.result[0].clave_satelital);
        $('#clase_vehi').val(data.result[0].clase);
        $('#licen_vehi').val(data.result[0].licencia_transito);
        //traer datos de propietario y tenedor
        $('#nom_propi').val(data.result[0].nom_te + ' ' + data.result[0].proape1 + ' ' + data.result[0].proape2);
        $('#docu_propi').val(data.result[0].docu_te);
        $('#celular_propietario').val(data.result[0].celular_propietario);
        //tenedor
        $('#nom_pose').val(data.result[0].nom_pro + ' ' + data.result[0].teape1 + ' ' + data.result[0].teape2);
        $('#docu_pose').val(data.result[0].docu_pro);
        $('#celular_tenedor').val(data.result[0].celular_tenedor);
        //FOTOS DEL VEHÍCULO
        var docu = '';
        var nombre = '';
        var tipo = '';

        if (data.result[0].name_frontal != '' && data.result[0].name_frontal != null) {
          docu =
            '<a  href="http://20.75.48.126/principal/' +
            data.result[0].foto_vehiculo +
            '/' +
            data.result[0].name_frontal +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            '</span>' +
            '</a>';
          nombre = data.result[0].name_frontal;
          tipo = 'Frontal';
          $('#fotos_vehiculo').append('<tr><td>1</td><td>' + docu + '</td><td>' + data.result[0].name_frontal + '</td><td>Frontal</td></tr>');
        }

        if (data.result[0].name_derecha != '' && data.result[0].name_derecha != null) {
          docu =
            '<a  href="http://20.75.48.126/principal/' +
            data.result[0].foto_derecha +
            '/' +
            data.result[0].name_derecha +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            '</span>' +
            '</a>';
          nombre = data.result[0].name_derecha;
          tipo = 'Derecha';
          $('#fotos_vehiculo').append('<tr><td>2</td><td>' + docu + '</td><td>' + data.result[0].name_derecha + '</td><td>Derecha</td></tr>');
        }

        if (data.result[0].name_izquierda != '' && data.result[0].name_izquierda != null) {
          docu =
            '<a  href="http://20.75.48.126/principal/' +
            data.result[0].foto_izquierda +
            '/' +
            data.result[0].name_izquierda +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            '</span>' +
            '</a>';
          $('#fotos_vehiculo').append('<tr><td>3</td><td>' + docu + '</td><td>' + data.result[0].name_izquierda + '</td><td>Izquierda</td></tr>');
        }

        if (data.result[0].name_atras != '' && data.result[0].name_atras != null) {
          docu =
            '<a  href="http://20.75.48.126/principal/' +
            data.result[0].foto_atras +
            '/' +
            data.result[0].name_atras +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            '</span>' +
            '</a>';
          $('#fotos_vehiculo').append('<tr><td>4</td><td>' + docu + '</td><td>' + data.result[0].name_atras + '</td><td>Trasera</td></tr>');
        }
      } else {
        console.log('no hay vehiculo');
      }

      if (data.result2) {
        $('#recoger_trailer').show();
        $('#recoger_trailer2').show();
        //trailer
        $('#ptrailer').val(data.result2[0].placa);
        $('#tra_placa').val(data.result2[0].placa);
        $('#tra_anio').val(data.result2[0].modelo);
        $('#tra_marca').val(data.result2[0].mark);
        $('#tra_peso').val(data.result2[0].peso_vacio);
        $('#tra_alto').val(data.result2[0].alto);
        $('#tra_volu').val(data.result2[0].volumen);
        $('#tra_tramite').val(data.result2[0].tramitee);
        $('#tra_confi').val(data.result2[0].confi);
        $('#tra_chasis').val(data.result2[0].serie_chasis);
        $('#tra_ancho').val(data.result2[0].ancho);
        $('#tra_largo').val(data.result2[0].largo);
        $('#tra_capacidad').val(data.result2[0].capacidad);
        $('#tra_carroceria').val(data.result2[0].ceria);
        $('#tra_caracteris').val(data.result2[0].caracteristica);
        $('#tra_aseguradora').val(data.result2[0].aseguradora);
        $('#tra_civil').val(data.result2[0].numero_civil);
        $('#tra_vence').val(data.result2[0].fecha_vence);
        $('#tra_liencia').val(data.result[0].n_licencia);

        if (data.result2[0].n_docu_trailer != null && data.result2[0].n_docu_trailer != '') {
          $('#tra_foto').html(
            '<a  href="http://20.75.48.126/principal/' +
              data.result2[0].foto_trailer +
              '/' +
              data.result2[0].n_docu_trailer +
              '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
              '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
              '</span>' +
              '</a>',
          );
        } else {
          $('#tra_foto').html('<p class="text-danger">No existe archivo</p>');
        }

        //licencia trailer

        if (data.result2[0].name_licencia != null && data.result2[0].name_licencia != '') {
          $('#tra_licen_foto').html(
            '<a  href="http://20.75.48.126/principal/' +
              data.result2[0].foto_licencia +
              '/' +
              data.result2[0].name_licencia +
              '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
              '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
              '</span>' +
              '</a>',
          );
        } else {
          $('#tra_licen_foto').html('<p class="text-danger">No existe archivo</p>');
        }
      } else {
        $('#ptrailer').val('No posee trailer asociado');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no hayyyy');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
//CONSULTAR EL CONDUCTOR
function verConductor() {
  // alert('entro a ver conductor');
  var idc = $('#valor_conductor').val();
  var params2 = {
    action: 'verconductor',
    id_conductor: idc,
  };
  $('#fotos_conductor').html('');
  $('#foto_indumentaria').html('');
  $('#documentos_licencia').html('');
  $('#documentos_rut').html('');
  $('#documentos_eps').html('');
  $('#documentos_peligro').html('');
  $('#documentos_acuerdo').html('');
  $.ajax({
    url: 'http://20.75.48.126/principal/libs/seguridad_estudio2_ajax.php',
    type: 'POST',
    data: params2,
    dataType: 'json',
    success: function(data) {
      // console.log('si hayyyy conductor');
      console.log(data);
      if (data) {
        $('#name').val(data.result[0].nombre + ' ' + data.result[0].apellido1 + ' ' + data.result[0].apellido2);
        $('#tdocumento').val(data.result[0].tipo_documento);
        $('#documento').val(data.result[0].numero_documento);
        $('#numero').val('(' + data.result[0].celular + ')(' + data.result[0].celular2 + ')');
        $('#contacto').val(data.result[0].contacto);
        $('#dire').val(data.result[0].direccion);
        $('#muni').val(data.result[0].cipio);
        $('#email').val(data.result[0].email);
        $('#num_li').val(data.result[0].rndc_numero_licencia);
        $('#cate_li').val(data.result[0].rndc_categoria_licencia);
        $('#eps').val(data.result[0].nombre_eps);
        $('#veps').val(data.result[0].fecha_vence_eps);
        $('#ultimoeps').val(data.result[0].ultimo_eps);
        $('#arl').val(data.result[0].nombre_arl);
        $('#varl').val(data.result[0].fecha_vence_arl);
        $('#ultimoarl').val(data.result[0].ultimo_arl);

        //fotos conductor

        if (
          data.result[0].name_cfrontal != '' &&
          data.result[0].name_cfrontal != null &&
          data.result[0].name_cderecha != '' &&
          data.result[0].name_cderecha != null &&
          data.result[0].name_cizquierda != '' &&
          data.result[0].name_cizquierda != null
        ) {
          $('#fotos_conductor').append(
            '<tr><td>1</td>' +
              '<td>' +
              '<a  href="http://20.75.48.126/principal/' +
              data.result[0].foto_conductor +
              '/' +
              data.result[0].name_cfrontal +
              '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
              '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
              '</span>' +
              '</a>' +
              '</td>' +
              '<td>' +
              data.result[0].name_cfrontal +
              '</td><td>Frontal</td></tr>' +
              '<tr><td>2</td><td>' +
              '<a  href="http://20.75.48.126/principal/' +
              data.result[0].foto_derecha +
              '/' +
              data.result[0].name_cderecha +
              '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
              '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
              '</span>' +
              '</a>' +
              '</td><td>' +
              data.result[0].name_cderecha +
              '</td><td>Derecha</td></tr>' +
              '<tr><td>3</td><td>' +
              '<a  href="http://20.75.48.126/principal/' +
              data.result[0].foto_izquierda +
              '/' +
              data.result[0].name_cizquierda +
              '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
              '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
              '</span>' +
              '</a>' +
              '</td><td>' +
              data.result[0].name_cizquierda +
              '</td><td>Izquierda</td></tr>',
          );
        } else {
          var f, d, iz;
          if (data.result[0].name_cfrontal == '' || data.result[0].name_cfrontal == null) {
            f = '<tr><td><p class="text-danger"><strong>No existe foto frontal</strong></p></td><td></td><td></td></tr>';
          } else {
            f =
              '<tr><td>1</td><td>' +
              '<a  href="http://20.75.48.126/principal/' +
              data.result[0].foto_conductor +
              '/' +
              data.result[0].name_cfrontal +
              '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
              '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
              '</span>' +
              '</a>' +
              '</td><td>' +
              data.result[0].name_cfrontal +
              '</td><td>Frontal</td></tr>';
          }
          if (data.result[0].name_cderecha == '' || data.result[0].name_cderecha == null) {
            d = '<tr><td><p class="text-danger"><strong>No existe foto derecha</strong></p></td><td></td><td></td></tr>';
          } else {
            d =
              '<tr><td>2</td><td>' +
              '<a  href="http://20.75.48.126/principal/' +
              data.result[0].foto_derecha +
              '/' +
              data.result[0].name_cderecha +
              '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
              '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
              '</span>' +
              '</a>' +
              '</td><td>' +
              data.result[0].name_cderecha +
              '</td><td>Derecha</td></tr>';
          }
          if (data.result[0].name_cizquierda == '' || data.result[0].name_cizquierda == null) {
            iz = '<tr><td><p class="text-danger"><strong>No existe foto izquierda</strong></p></td><td></td><td></td></tr>';
          } else {
            iz =
              '<tr><td>3</td><td>' +
              '<a  href="http://20.75.48.126/principal/' +
              data.result[0].foto_izquierda +
              '/' +
              data.result[0].name_cizquierda +
              '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
              '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
              '</span>' +
              '</a>' +
              '</td><td>' +
              data.result[0].name_cizquierda +
              '</td><td>Izquierda</td></tr>';
          }

          $('#fotos_conductor').append(f + d + iz);
        }

        //licencia
        if (data.result[0].name_cindu != '' && data.result[0].name_cindu != null) {
          $('#foto_indumentaria').append(
            '<tr><td>1</td>' +
              '<td>' +
              '<a  href="http://20.75.48.126/principal/' +
              data.result[0].foto_indumentaria +
              '/' +
              data.result[0].name_cindu +
              '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
              '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
              '</span>' +
              '</a>' +
              '</td>' +
              '<td>' +
              data.result[0].name_cindu +
              '</td></tr>',
          );
        } else {
          $('#foto_indumentaria').html('<tr><td><p class="text-danger"><strong>No existe el archivo</strong></p></td><td></td><td></td></tr>');
        }

        //licencia
        if (data.result[0].n_docu_licencia != '' && data.result[0].n_docu_licencia != null) {
          $('#documentos_licencia').append(
            '<tr><td>1</td>' +
              '<td>' +
              '<a  href="http://20.75.48.126/principal/' +
              data.result[0].subir_licencia +
              '/' +
              data.result[0].n_docu_licencia +
              '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
              '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
              '</span>' +
              '</a>' +
              '</td>' +
              '<td>' +
              data.result[0].n_docu_licencia +
              '</td></tr>',
          );
        } else {
          $('#documentos_licencia').html('<tr><td><p class="text-danger"><strong>No existe el archivo</strong></p></td><td></td><td></td></tr>');
        }

        //Rut
        if (data.result[0].n_docu_rut != '' && data.result[0].n_docu_rut != null) {
          $('#documentos_rut').append(
            '<tr><td>1</td>' +
              '<td>' +
              '<a  href="http://20.75.48.126/principal/' +
              data.result[0].documento_rut +
              '/' +
              data.result[0].n_docu_rut +
              '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
              '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
              '</span>' +
              '</a>' +
              '</td>' +
              '<td>' +
              data.result[0].n_docu_rut +
              '</td></tr>',
          );
        } else {
          $('#documentos_rut').html('<tr><td><p class="text-danger"><strong>No existe el archivo</strong></p></td><td></td><td></td></tr>');
        }

        //EPS
        if (data.result[0].n_docu_eps != '' && data.result[0].n_docu_eps != null) {
          $('#documentos_eps').append(
            '<tr><td>1</td>' +
              '<td>' +
              '<a  href="http://20.75.48.126/principal/' +
              data.result[0].documento_eps +
              '/' +
              data.result[0].n_docu_eps +
              '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
              '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
              '</span>' +
              '</a>' +
              '</td>' +
              '<td>' +
              data.result[0].n_docu_eps +
              '</td></tr>',
          );
        } else {
          $('#documentos_eps').html('<tr><td><p class="text-danger"><strong>No existe el archivo</strong></p></td><td></td><td></td></tr>');
        }

        //CURSO MERCANCIA PELIGROSA
        if (data.result[0].n_docu_curso != '' && data.result[0].n_docu_curso != null) {
          $('#documentos_peligro').append(
            '<tr><td>1</td>' +
              '<td>' +
              '<a  href="http://20.75.48.126/principal/' +
              data.result[0].carnet_curso +
              '/' +
              data.result[0].n_docu_curso +
              '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
              '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
              '</span>' +
              '</a>' +
              '</td>' +
              '<td>' +
              data.result[0].n_docu_curso +
              '</td></tr>',
          );
        } else {
          $('#documentos_peligro').html('<tr><td><p class="text-danger"><strong>No existe el archivo</strong></p></td><td></td><td></td></tr>');
        }

        //ACUERDO

        if (data.result[0].name_acuerdo1 != '' && data.result[0].name_acuerdo1 != null) {
          $('#documentos_acuerdo').append(
            '<tr><td>1</td>' +
              '<td>' +
              '<a  href="http://20.75.48.126/principal/' +
              data.result[0].foto_acuerdo1 +
              '/' +
              data.result[0].name_acuerdo1 +
              '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
              '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
              '</span>' +
              '</a>' +
              '</td>' +
              '<td>' +
              data.result[0].name_acuerdo1 +
              '</td></tr>',
          );
        } else {
          $('#documentos_acuerdo').html('<tr><td><p class="text-danger"><strong>No existe el archivo</strong></p></td><td></td><td></td></tr>');
        }

        if (data.result2) {
          var cont = 0;
          var d = 0;
          $('#documentos_laborales').html('');
          data.result2.forEach(function(element, index) {
            cont++;
            $('#refl' + cont).val(element.nombre_empresa);
            $('#fechal' + cont).val(element.fecha_ingreso);
            $('#fechafinall' + cont).val(element.fecha_retiro);
            $('#contactol' + cont).val(element.persona_contacto);
            $('#cel' + cont).val(element.celular);
            $('#cargo' + cont).val(element.cargo);
            $('#antig' + cont).val(element.antiguedad);

            if (element.name_documento != null) {
              d++;
              var docu, name;
              if (element.name_documento != null && element.name_documento != '') {
                docu =
                  '<a  href="http://20.75.48.126/principal/' +
                  element.documento_empresarial +
                  '/' +
                  element.name_documento +
                  '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                  '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
                  '</span>' +
                  '</a>';
                name = element.name_documento;
                $('#documentos_laborales').append(
                  '<tr><td>' +
                    d +
                    '<input type="hidden" id="idr' +
                    d +
                    '" value="' +
                    element.id +
                    '" style="width:10px;" ></td>' +
                    '<td>' +
                    docu +
                    '</td>' +
                    '<td>' +
                    name +
                    '</td></tr>',
                );
              }
            }
          });
        }

        if (data.result3) {
          var cue = 0;
          var p = 0;
          $('#documentos_personal').html('');
          data.result3.forEach(function(element, index) {
            cue++;

            var pare = element.parentezco;
            if (pare == '1') {
              $('#parenp' + cue).val('Amigo/a');
            }

            if (pare == '2') {
              $('#parenp' + cue).val('Hermano/a');
            }
            if (pare == '3') {
              $('#parenp' + cue).val('Padre');
            }
            if (pare == '4') {
              $('#parenp' + cue).val('Madre');
            }
            if (pare == '5') {
              $('#parenp' + cue).val('Tio/a');
            }
            if (pare == '6') {
              $('#parenp' + cue).val('Sobrino/a');
            }
            if (pare == '7') {
              $('#parenp' + cue).val('Hijo/a');
            }
            if (pare == '8') {
              $('#parenp' + cue).val('Espaso/a');
            }

            $('#refp' + cue).val(element.nombre_personal);
            $('#fechap' + cue).val(element.fecha_personal);
            $('#telp' + cue).val(element.tel_personal);

            //documentos personales
            if (element.name_documento != null && element.name_documento != '') {
              p++;

              $('#documentos_personal').append(
                '<tr><td>' +
                  p +
                  '<input type="hidden" id="idp' +
                  p +
                  '" value="' +
                  element.id +
                  '" style="width:10px;" ></td>' +
                  '<td>' +
                  '<a  href="http://20.75.48.126/principal/' +
                  element.documento_personal +
                  '/' +
                  element.name_documento +
                  '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                  '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
                  '</span>' +
                  '</a>' +
                  '</td>' +
                  '<td>' +
                  element.name_documento +
                  '</td></tr>',
              );
            }
          });
        }
      } else {
        console.log('no hay datos conductor');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no hayyyy conductor');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

var url = $('#id_url_ajax').val() + 'libs/seguridad_estudio_ajax.php';

//lista de comprobacion

function lista(idv, idc, idsoli, id_preestudio) {
  $('#valor_vehiculo').val(idv);
  $('#valor_conductor').val(idc);
  $('#id_soli').val(idsoli);
  $('#id_preestudioc').val(id_preestudio);
  var datos2 = {
    id_soli: idsoli,
    action: 'verifiar_boton',
  };
  $.ajax({
    url: 'http://20.75.48.126/principal/libs/seguridad_estudio2_ajax.php',
    type: 'POST',
    data: datos2,
    dataType: 'json',
    success: function(data) {
      // console.log(data);

      if (data.result) {
        //si trae algo APARECER EL SELECT Y DESAPARECER EL BOTON
        var estado = data.result[0].estado;
        if (estado == 'iniciado') {
          $('#inicio_estudio').hide();
          $('#title').show();
          $('#select_option').show();
        }
        if (estado == 'completado') {
          alert('debe aparecer otra cosa , estadocompletado');
        }
      } else {
        //si no trae nada, APARECER el boton y desaparece el select
        $('#inicio_estudio').show();
        $('#title').hide();
        $('#select_option').hide();
        //ocultar todos los contenedores
        $('#content_vehiculo').hide();
        $('#content_conductor').hide();
        $('#content_risk').hide();
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('oh ohoh');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  //LISTA DE COMPROBACION
  $('#idvehiculo').val(idv);
  $('#idconductor').val(idc);
  $('#cuerpo_estudio').html('');
  $('#estadostudy').val('');
  var datos = {
    idv: idv,
    idc: idc,
    idsoli: idsoli,
    action: 'verestudio',
  };
  // $("#body_estudio").html('');
  $('#idstudy').val('');
  if (!$('#idstudy').val()) {
    $('#estado_estu').prop('disabled', true);
    $('#obse_estu').prop('disabled', true);
  }

  //BORRAR COLUMNAS DE TABLA LISTA
  $('#apro').html('');
  $('#capro').html('');
  $('#rapro').html('');
  $('#ruapro').html('');
  $('#poapro').html('');
  $('#proapro').html('');
  $('#sipro').html('');
  $('#siscompro').html('');
  $('#adrpro').html('');
  $('#gpro').html('');
  $('#prepro').html('');
  $('#obse_estu').val('');
  //$("#estado_estu").html('<option value="">Seleccione</option>');
  $('#aevi').html('');
  $('#cevi').html('');
  $('#revi').html('');
  $('#ruevi').html('');
  $('#poevi').html('');
  $('#proevi').html('');
  $('#smevi').html('');
  $('#sievi').html('');
  $('#aevi').html('');
  $('#gevi').html('');
  $('#previ').html('');

  $.ajax({
    url: 'http://20.75.48.126/principal/libs/seguridad_estudio2_ajax.php',
    type: 'POST',
    data: datos,
    dataType: 'json',
    success: function(data, textStatus, jqXHR) {
      // alert('entro a data LISTA COMPROBACION');
      if (data.result) {
        // alert('empezo estudio de seguridad');
        data.result.forEach(function(element, index) {
          $('#idstudy').val(element.id_estudio);
          var etotal = element.estadototal;
          if (etotal == 'gray') {
            $('#estadostudy').val('sin respuesta');
          }
          if (etotal !== 'gray') {
            $('#estadostudy').val(etotal);
          }
          //$("#estadostudy").val(element.estadototal);
          if (element.estadototal == 'Aprobado' || element.estadototal == 'Rechazado_modificar' || element.estadototal == 'Rechazado') {
            $('#estado_estu').prop('disabled', true);
            $('#aprobar_estudio_total').hide();
          } else {
            $('#estado_estu').prop('disabled', false);
            $('#obse_estu').prop('disabled', false);
            $('#aprobar_estudio_total').show();
          }

          var tipo = element.estudio;
          var aprobado = element.estado;
          var status = '';
          var requerido = '';
          var e = '';
          $requerido = '<span class="text-primary mdi mdi-star-half icon"></span>';

          if (tipo == 'hoja de vida vehiculo') {
            iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';

            if (aprobado == '1') {
              status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            } else if (aprobado == '0') {
              status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
            }
            //evidencia subida por seguridad
            if (element.name_evidencia != '' && element.name_evidencia != null) {
              e =
                '<a  href="http://20.75.48.126/principal/' +
                element.ruta_evidencia +
                element.name_evidencia +
                '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                '<span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="' +
                element.observacion +
                '" >' +
                '</span>' +
                '</a>';
            } else {
              e = '<p class="text-primary text-center" title="' + element.observacion + '">Sin archivo</p>';
            }
            //impirimir el inicado
            $('#ini').html('' + iniciado2 + '');
            $('#apro').html('' + status + '');
            $('#aevi').html('' + e + '');
          }

          if (tipo == 'hoja de vida conductor') {
            iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            if (aprobado == '1') {
              status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            } else if (aprobado == '0') {
              status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
            }

            if (element.name_evidencia != '' && element.name_evidencia != null) {
              e =
                '<a  href="http://20.75.48.126/principal/' +
                element.ruta_evidencia +
                element.name_evidencia +
                '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                '<span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="' +
                element.observacion +
                '" >' +
                '</span>' +
                '</a>';
            } else {
              e = '<p class="text-primary text-center" title="' + element.observacion + '">Sin archivo</p>';
            }
            $('#cini').html('' + iniciado2 + '');
            $('#capro').html('' + status + '');
            $('#cevi').html('' + e + '');
          }

          if (tipo == 'risck') {
            iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            if (aprobado == '1') {
              status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            } else if (aprobado == '0') {
              status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
            }
            if (element.name_evidencia != '' && element.name_evidencia != null) {
              e =
                '<a  href="http://20.75.48.126/principal/' +
                element.ruta_evidencia +
                element.name_evidencia +
                '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                '<span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="' +
                element.observacion +
                '" >' +
                '</span>' +
                '</a>';
            } else {
              e = '<p class="text-primary text-center" title="' + element.observacion + '">Sin archivo</p>';
            }
            $('#rini').html('' + iniciado2 + '');
            $('#rapro').html('' + status + '');
            $('#revi').html('' + e + '');
          }

          if (tipo == 'siplaft') {
            iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            if (aprobado == '1') {
              status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            } else if (aprobado == '0') {
              status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
            }

            $('#sini').html('' + iniciado2 + '');
            $('#sapro').html('' + status + '');
          }

          if (tipo == 'runt') {
            iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            if (aprobado == '1') {
              status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            } else if (aprobado == '0') {
              status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
            }

            if (element.name_evidencia != '' && element.name_evidencia != null) {
              e =
                '<a  href="http://20.75.48.126/principal/' +
                element.ruta_evidencia +
                element.name_evidencia +
                '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                '<span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="' +
                element.observacion +
                '" >' +
                '</span>' +
                '</a>';
            } else {
              e = '<p class="text-primary text-center" title="' + element.observacion + '">Sin archivo</p>';
            }

            $('#ruini').html('' + iniciado2 + '');
            $('#ruapro').html('' + status + '');
            $('#ruevi').html('' + e + '');
          }

          if (tipo == 'policia') {
            iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            if (aprobado == '1') {
              status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            } else if (aprobado == '0') {
              status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
            }

            if (element.name_evidencia != '' && element.name_evidencia != null) {
              e =
                '<a  href="http://20.75.48.126/principal/' +
                element.ruta_evidencia +
                element.name_evidencia +
                '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                '<span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="' +
                element.observacion +
                '" >' +
                '</span>' +
                '</a>';
            } else {
              e = '<p class="text-primary text-center" title="' + element.observacion + '">Sin archivo</p>';
            }

            $('#pini').html('' + iniciado2 + '');
            $('#poapro').html('' + status + '');
            $('#poevi').html('' + e + '');
          }

          if (tipo == 'procuraduria') {
            iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            if (aprobado == '1') {
              status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            } else if (aprobado == '0') {
              status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
            }

            if (element.name_evidencia != '' && element.name_evidencia != null) {
              e =
                '<a  href="http://20.75.48.126/principal/' +
                element.ruta_evidencia +
                element.name_evidencia +
                '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                '<span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="' +
                element.observacion +
                '" >' +
                '</span>' +
                '</a>';
            } else {
              e = '<p class="text-primary text-center" title="' + element.observacion + '">Sin archivo</p>';
            }

            $('#proini').html('' + iniciado2 + '');
            $('#proapro').html('' + status + '');
            $('#proevi').html('' + e + '');
          }

          if (tipo == 'simit') {
            iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            if (aprobado == '1') {
              status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            } else if (aprobado == '0') {
              status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
            }
            if (element.name_evidencia != '' && element.name_evidencia != null) {
              e =
                '<a  href="http://20.75.48.126/principal/' +
                element.ruta_evidencia +
                element.name_evidencia +
                '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                '<span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="' +
                element.observacion +
                '" >' +
                '</span>' +
                '</a>';
            } else {
              e = '<p class="text-primary text-center" title="' + element.observacion + '">Sin archivo</p>';
            }
            $('#smini').html('' + iniciado2 + '');
            $('#sipro').html('' + status + '');
            $('#smevi').html('' + e + '');
          }

          if (tipo == 'siscomn') {
            iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            if (aprobado == '1') {
              status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            } else if (aprobado == '0') {
              status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
            }
            if (element.name_evidencia != '' && element.name_evidencia != null) {
              e =
                '<a  href="http://20.75.48.126/principal/' +
                element.ruta_evidencia +
                element.name_evidencia +
                '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                '<span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="' +
                element.observacion +
                '" >' +
                '</span>' +
                '</a>';
            } else {
              e = '<p class="text-primary text-center" title="' + element.observacion + '">Sin archivo</p>';
            }

            $('#siscini').html('' + iniciado2 + '');
            $('#siscompro').html('' + status + '');
            $('#sievi').html('' + e + '');
          }

          if (tipo == 'adres') {
            iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            iniciado = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            if (aprobado == '1') {
              status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            } else if (aprobado == '0') {
              status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
            }
            if (element.name_evidencia != '' && element.name_evidencia != null) {
              e =
                '<a  href="http://20.75.48.126/principal/' +
                element.ruta_evidencia +
                element.name_evidencia +
                '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                '<span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="' +
                element.observacion +
                '" >' +
                '</span>' +
                '</a>';
            } else {
              e = '<p class="text-primary text-center" title="' + element.observacion + '">Sin archivo</p>';
            }

            $('#aini').html('' + iniciado2 + '');
            $('#adrpro').html('' + status + '');
            $('#adevi').html('' + e + '');
          }

          if (tipo == 'Gps') {
            iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            iniciado = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            if (aprobado == '1') {
              status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            } else if (aprobado == '0') {
              status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
            }
            if (element.name_evidencia != '' && element.name_evidencia != null) {
              e =
                '<a  href="http://20.75.48.126/principal/' +
                element.ruta_evidencia +
                element.name_evidencia +
                '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                '<span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="' +
                element.observacion +
                '" >' +
                '</span>' +
                '</a>';
            } else {
              e = '<p class="text-primary text-center" title="' + element.observacion + '">Sin archivo</p>';
            }

            $('#gini').html('' + iniciado2 + '');
            $('#gpro').html('' + status + '');
            $('#gevi').html('' + e + '');
          }

          if (tipo == 'Dato preestudio') {
            iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            iniciado = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            if (aprobado == '1') {
              status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
            } else if (aprobado == '0') {
              status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
            }
            if (element.name_evidencia != '' && element.name_evidencia != null) {
              e =
                '<a  href="http://20.75.48.126/principal/' +
                element.ruta_evidencia +
                element.name_evidencia +
                '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                '<span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="' +
                element.observacion +
                '" >' +
                '</span>' +
                '</a>';
            } else {
              e = '<p class="text-primary text-center" title="' + element.observacion + '">Sin archivo</p>';
            }
            $('#preini').html('' + iniciado2 + '');
            $('#prepro').html('' + status + '');
            $('#previ').html('' + e + '');
          }
          //OBSERVACIONES
          var palabra;
          if (element.estado == '1') {
            palabra = 'Aceptado';
          }
          if (element.estado == '0') {
            palabra = 'No aceptado';
          }

          $('#cuerpo_estudio').append(
            '<tr>' +
              '<td>' +
              element.estudio +
              '</td>' +
              '<td>' +
              palabra +
              '</td>' +
              '<td>' +
              element.observacion +
              '</td>' +
              '<td>' +
              element.usuario +
              '</td>' +
              '<td>' +
              element.fecha +
              '</td>' +
              '<td>' +
              element.hora +
              '</td></tr>',
          );
        });
      } else {
        //alert('Aun no ha empezado estudio de seguridad');
        iniciado = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
        $('#ini').html('' + iniciado + '');
        $('#cini').html('' + iniciado + '');
        $('#rini').html('' + iniciado + '');
        $('#sini').html('' + iniciado + '');
        $('#ruini').html('' + iniciado + '');
        $('#pini').html('' + iniciado + '');
        $('#proini').html('' + iniciado + '');
        $('#smini').html('' + iniciado + '');
        $('#siscini').html('' + iniciado + '');
        $('#aini').html('' + iniciado + '');
        $('#gini').html('' + iniciado + '');
        $('#preini').html('' + iniciado + '');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // alert('no trajo los tipos de estudio');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  $('#ver_lista').show();
}

//GUARDAR LOS DATOS
//aprobar la hoja de vida del vehiculo
function aprobar_vehiculo() {
  // alert('entro a aprobar hv vehiculo VEHICULO');
  var idsoli = $('#id_soli').val();
  //validar que  la hoja del vehiculo este o no aprobada
  var idv = $('#valor_vehiculo').val();
  var idc = $('#valor_conductor').val();
  var id_preestudio = $('#id_preestudioc').val();

  var data = null;
  data = new FormData();
  data.append('accion', 'aprobarHVvehiculo');
  data.append('fecha', $('#fechag').val());
  data.append('hora', $('#horag').val());
  data.append('user', $('#usuariog').val());
  data.append('observeheciulo', $('#observeheciulo').val());
  data.append('id_vehiculo', $('#valor_vehiculo').val());
  data.append('id_conductor', $('#valor_conductor').val());
  data.append('idsoli', idsoli);
  data.append('idtipo', $('#id_tvehiculo').val());

  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    cache: false,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    dataType: 'json',
    success: function(data, textStatus, jqXHR) {
      console.log('si inserto hv vehiculo');
      alert('Aprobo Exitosamente esta hoja de vida');
      /*$("html, body").animate({ scrollTop: 0 }, 600);
				 setTimeout(function() { location.reload(false);  }, 800);*/
      $('#content_risk').hide();
      $('#content_conductor').hide();
      $('#content_vehiculo').hide();
      lista(idv, idc, idsoli, id_preestudio);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no inserto hv vehiculo');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
//desaprobar la hoja de vida del vehiculo
function desaprobar_vehiculo() {
  // alert('desaprobar vehiculo');
  var idsoli = $('#id_soli').val();
  var idv = $('#valor_vehiculo').val();
  var idc = $('#valor_conductor').val();
  var estado = $('#estadostudy').val();
  var id_preestudio = $('#id_preestudioc').val();
  var data = null;
  data = new FormData();
  data.append('accion', 'desaprobarHVvehiculo');
  data.append('fecha', $('#fechag').val());
  data.append('hora', $('#horag').val());
  data.append('user', $('#usuariog').val());
  data.append('observeheciulo', $('#observeheciulo').val());
  data.append('id_vehiculo', $('#valor_vehiculo').val());
  data.append('id_conductor', $('#valor_conductor').val());
  data.append('idsoli', idsoli);
  data.append('idtipo', $('#id_tvehiculo').val());

  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    cache: false,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    dataType: 'json',
    success: function(data) {
      // console.log('si inserto no hv vehiculo no aprobada');
      alert('La hoja de vida del Vehículo no ha sido aprobada, sus Datos han sido registrados exitosamente');
      /*$("html, body").animate({ scrollTop: 0 }, 600);
				 setTimeout(function() { location.reload(false);  }, 800);*/
      $('#content_risk').hide();
      $('#content_conductor').hide();
      $('#content_vehiculo').hide();
      lista(idv, idc, idsoli, id_preestudio);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no inserto hv vehiculo no aprobada');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
//aprobar la hoja de vida del coductor
function aprobar_conductor() {
  // alert('aprobar conductor');
  var idsoli = $('#id_soli').val();

  var idv = $('#valor_vehiculo').val();
  var idc = $('#valor_conductor').val();
  var id_preestudio = $('#id_preestudioc').val();
  var data = null;
  data = new FormData();
  data.append('accion', 'aprobarhvconductor');
  data.append('fech', $('#fechag').val());
  data.append('hor', $('#horag').val());
  data.append('usuari', $('#usuariog').val());
  data.append('id_vehiculo', $('#valor_vehiculo').val());
  data.append('id_conductor', $('#valor_conductor').val());
  data.append('obse_condu', $('#obse_condu').val());
  // data.append("obse_propi", $("#obse_propi").val());
  // data.append("obse_pose", $("#obse_pose").val());
  data.append('idsoli', idsoli);
  data.append('idtipo', $('#id_tconductor').val());

  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    cache: false,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    dataType: 'json',
    success: function(data, textStatus, jqXHR) {
      // console.log('si inserto hoja vida conductor');
      alert('Aprobo Exitosamente la hoja de Vida del Conductor');
      /*$("html, body").animate({ scrollTop: 0 }, 600);
					setTimeout(function() { location.reload(false);  }, 800);*/
      //$("#ver_lista").hide();
      $('#content_vehiculo').hide();
      $('#content_conductor').hide();
      $('#content_risk').hide();
      lista(idv, idc, idsoli, id_preestudio);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no inserto hv conductor');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
//desarpobar la hoja de vida del conductor
function desaprobar_conductor() {
  // alert('desaprobar conductor');
  var idsoli = $('#id_soli').val();
  var idv = $('#valor_vehiculo').val();
  var idc = $('#valor_conductor').val();
  var id_preestudio = $('#id_preestudioc').val();
  var data = null;
  data = new FormData();
  data.append('accion', 'desaprobarhvconductor');
  data.append('fecha', $('#fechag').val());
  data.append('hora', $('#horag').val());
  data.append('usuario', $('#usuariog').val());
  data.append('id_vehiculo', $('#valor_vehiculo').val());
  data.append('id_conductor', $('#valor_conductor').val());
  data.append('obse_condu', $('#obse_condu').val());
  data.append('idsoli', idsoli);
  data.append('idtipo', $('#id_tconductor').val());
  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    cache: false,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    dataType: 'json',
    success: function(data) {
      // console.log('si inserto no hv vehiculo no aprobada');
      alert('La hoja de vida no se ha aprobado, sus datos han sido registrados exitosamente!!');
      /*$("html, body").animate({ scrollTop: 0 }, 600);
				 setTimeout(function() { location.reload(false);  }, 800);*/
      $('#content_risk').hide();
      $('#content_conductor').hide();
      $('#content_vehiculo').hide();
      lista(idv, idc, idsoli, id_preestudio);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no inserto hv conductor no aprobada');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
//aprobar riskc
function aprobar_risk() {
  // alert('aprobar riskc');
  var idsoli = $('#id_soli').val();
  var idv = $('#valor_vehiculo').val();
  var idc = $('#valor_conductor').val();
  var id_preestudio = $('#id_preestudioc').val();
  var data = null;
  data = new FormData();
  var evidencia = document.getElementById('evi_plataforma').files;
  for (var i = 0; i < evidencia.length; i++) {
    data.append('evi_plataforma' + i, evidencia[i]);
  }

  data.append('accion', 'aprobar_risk');
  data.append('fecha', $('#fechar').val());
  data.append('hora', $('#horar').val());
  data.append('usuario', $('#userr').val());
  data.append('id_vehiculo', $('#valor_vehiculo').val());
  data.append('id_conductor', $('#valor_conductor').val());
  data.append('tipo_estudio', $('#tipo_plataforma').val());
  data.append('obse_todo', $('#obse_todo').val());
  data.append('name_eviden', $('#name_eviden').val());
  data.append('ruta_eviden', $('#ruta_eviden').val());
  data.append('idsoli', idsoli);
  data.append('idtipo', $('#id_totros').val());
  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    cache: false,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    dataType: 'json',
    success: function(data) {
      // console.log('si inserto no hv vehiculo no aprobada');
      alert('Plataforma ha sido Aprobado exitosamente!!');
      /*$("html, body").animate({ scrollTop: 0 }, 600);
				 setTimeout(function() { location.reload(false);  }, 800);*/
      $('#content_risk').hide();
      $('#content_conductor').hide();
      $('#content_vehiculo').hide();
      lista(idv, idc, idsoli, id_preestudio);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no inserto risck aprobada');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
//desaprobar risck
function desaprobar_risk() {
  // alert('desaprobar risk');
  var idsoli = $('#id_soli').val();
  var idv = $('#valor_vehiculo').val();
  var idc = $('#valor_conductor').val();
  var id_preestudio = $('#id_preestudioc').val();
  var data = null;
  data = new FormData();

  var evidencia = document.getElementById('evi_plataforma').files;
  for (var i = 0; i < evidencia.length; i++) {
    data.append('evi_plataforma' + i, evidencia[i]);
  }

  data.append('accion', 'desaprobar_risk');
  data.append('fecha', $('#fechar').val());
  data.append('hora', $('#horar').val());
  data.append('usuario', $('#userr').val());
  data.append('id_vehiculo', $('#valor_vehiculo').val());
  data.append('id_conductor', $('#valor_conductor').val());
  data.append('tipo_estudio', $('#tipo_plataforma').val());
  data.append('obse_todo', $('#obse_todo').val());
  data.append('name_eviden', $('#name_eviden').val());
  data.append('ruta_eviden', $('#ruta_eviden').val());
  data.append('idsoli', idsoli);
  data.append('idtipo', $('#id_totros').val());
  // alert('desaprobar risk');
  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    cache: false,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    dataType: 'json',
    success: function(data) {
      // console.log('inserto no aprobar risk');
      alert('La Plataforma fue rechazada, sus datos han sido registrados exitosamente!!');
      /*$("html, body").animate({ scrollTop: 0 }, 600);
				 setTimeout(function() { location.reload(false);  }, 800);*/
      $('#content_risk').hide();
      $('#content_conductor').hide();
      $('#content_vehiculo').hide();
      lista(idv, idc, idsoli, id_preestudio);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no inserto risck no aprobado');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function status(idvehi, id_conductor, idsoli) {
  // alert('hola baby');
  // alert('solicitud de servivio'+idsoli);
  // alert(id_conductor);
  // alert(idvehi);

  //cabecera de la cotizacion
  var coti = {
    idsoli: idsoli,
    action: 'cotizacion_es',
  };
  $.ajax({
    url: 'http://20.75.48.126/principal/libs/seguridad_estudio2_ajax.php',
    type: 'POST',
    data: coti,
    dataType: 'json',
    success: function(data) {
      // console.log('ok datos status');
      if (data.result) {
        $('#titlu').html('<h3 class="text-center"><strong>Número de Cotizacion:' + data.result[0].n_cotizacion + '</strong></h3>');
        $('#linea').val(data.result[0].linea_negocio);
        $('#cuerpo_cliente').html(
          '<tr>' +
            '<td>' +
            data.result[0].nombre_cliente +
            '</td>' +
            '<td>' +
            data.result[0].nit +
            '-' +
            data.result[0].digito +
            '</td>' +
            '<td>' +
            data.result[0].direccion +
            '</td>' +
            '<td>' +
            data.result[0].telefono +
            '</td>' +
            '<td>' +
            data.result[0].procedencia_cotizacion +
            '</td>' +
            '</tr>',
        );
        $('#costos').html(
          '<tr>' +
            '<td>' +
            data.result[0].total_transporte +
            '</td>' +
            '<td>' +
            data.result[0].tmer_flete +
            '</td>' +
            '<td>' +
            data.result[0].tmer_utili +
            '</td>' +
            '<td>' +
            data.result[0].tmer_rent +
            '</td>' +
            '</tr>',
        );

        $('#costos1').html(
          '<tr>' +
            '<td>' +
            data.result[0].tes_tarifa +
            '</td>' +
            '<td>' +
            data.result[0].tes_flete +
            '</td>' +
            '<td>' +
            data.result[0].tes_util +
            '</td>' +
            '<td>' +
            data.result[0].tes_renta +
            '</td>' +
            '</tr>',
        );

        $('#total').html('<tr>' + '<td class="text-center">' + data.result[0].total_cotizacion + '</td></tr>');

        $('#cuerpo_adicional').html(
          '<tr>' +
            '<td>' +
            data.result[0].tipo_mercancia +
            '</td>' +
            '<td>' +
            data.result[0].valor_mercancia +
            '</td>' +
            '<td>' +
            data.result[0].observaciones +
            '</td>' +
            '<td>' +
            data.result[0].elaborado_por +
            '</td>' +
            '<td>' +
            data.result[0].autorizado_por +
            '</td>' +
            '</tr>',
        );
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('error status');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  //mercancia
  var dato1 = {
    idsoli: idsoli,
    action: 'ver_mer',
  };
  $('#cuerpo_mer1').html('');
  $('#cuerpo_mer2').html('');
  $('#muniorigen').html('');
  $('#munidestino').html('');
  $.ajax({
    url: 'http://20.75.48.126/principal/libs/seguridad_estudio2_ajax.php',
    type: 'POST',
    data: dato1,
    dataType: 'json',
    success: function(data) {
      // console.log(data.result);
      data.result.forEach(function(element, index) {
        // console.log(element);
        // console.log('OKI');
        //  if(id == element.n_cotizacion){
        $('#cuerpo_mer1').append(
          '<tr>' +
            '<td class="text-primary">' +
            element.n_cotizacion +
            '-' +
            element.item +
            '</td>' +
            '<td>' +
            element.tipo_servicio_mer +
            '</td>' +
            '<td>' +
            element.nombre +
            '</td>' +
            '<td>' +
            element.tipo_carga +
            '</td>' +
            '<td>' +
            element.tipo_transporte +
            '</td>' +
            '<td>' +
            element.peso_bruto_kg +
            '</td>' +
            '<td>' +
            element.peso_neto_kg +
            '</td>' +
            '<td>' +
            element.peso_neto_tn +
            '</td>' +
            '</tr>',
        );

        $('#cuerpo_mer2').append(
          '<tr>' +
            '<td>' +
            element.n_cotizacion +
            '-' +
            element.item +
            '</td>' +
            '<td>' +
            element.alto +
            '</td>' +
            '<td>' +
            element.largo +
            '</td>' +
            '<td>' +
            element.ancho +
            '</td>' +
            '<td>' +
            element.volumen_total +
            '</td>' +
            '<td>' +
            element.flete +
            '</td>' +
            '<td>' +
            element.utilidad +
            '</td>' +
            '<td>' +
            element.total_tarifa +
            '</td>' +
            '<td>' +
            element.rentabilidad +
            '</td>' +
            '</tr>',
        );
        // }
        $('#muniorigen').append('<tr>' + '<td>' + element.n_cotizacion + '-' + element.item + '</td>' + '<td>' + element.orig + '</td>' + '</tr>');

        $('#munidestino').append('<tr>' + '<td>' + element.n_cotizacion + '-' + element.item + '</td>' + '<td>' + element.dest + '</td>' + '</tr>');
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('error');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  //especial

  var dato2 = {
    idsoli: idsoli,
    action: 'ver_espe',
  };

  $('#cuerpo_especial').html('');
  $.ajax({
    url: 'http://20.75.48.126/principal/libs/seguridad_estudio2_ajax.php',
    type: 'POST',
    data: dato2,
    dataType: 'json',
    success: function(data) {
      // console.log(data.result);
      data.result.forEach(function(element, index) {
        //  if(id == element.n_cotizacion){
        $('#cuerpo_especial').append(
          '<tr>' +
            '<td>' +
            element.n_cotizacion +
            '-<span class="text-primary">' +
            element.item_mercancia +
            '</span>' +
            '-' +
            element.item_especial +
            ' </td>' +
            '<td>' +
            element.tipo_servicio +
            '</td>' +
            '<td>' +
            element.cantidad +
            '</td>' +
            '<td>' +
            element.valor_unitario +
            '</td>' +
            '<td>' +
            element.total_servicio +
            '</td>' +
            '<td>' +
            element.tarifa +
            '</td>' +
            '<td>' +
            element.utilidad +
            '</td>' +
            '<td>' +
            element.rentabilidad +
            '</td>' +
            '</tr>',
        );
        // }
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('error');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  //solicitud de servicio

  var soli = {
    idsoli: idsoli,
    action: 'solicitud_servicio',
  };

  $('#cuerpo_solicitud').html('');
  $.ajax({
    url: 'http://20.75.48.126/principal/libs/seguridad_estudio2_ajax.php',
    type: 'POST',
    data: soli,
    dataType: 'json',
    success: function(data) {
      // console.log(data.result);
      data.result.forEach(function(element, index) {
        $('#cuerpo_solicitud').append(
          '<tr>' +
            '<td>' +
            element.id +
            '</td>' +
            '<td>' +
            element.tipo_empaque +
            '</td>' +
            '<td>' +
            element.cantidad_empaque +
            '</td>' +
            '<td>' +
            element.fecha +
            '/' +
            element.hora +
            '</td>' +
            '<td>' +
            element.usuario_auditor +
            '</td>' +
            '<td>' +
            element.proceso +
            '</td>' +
            '</tr>',
        );
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('error');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  //solicitud de preestudio
  var prees = {
    idsoli: idsoli,
    action: 'solicitudpreestudio',
  };
  $('#cuerpo_preestudio').html('');
  $.ajax({
    url: 'http://20.75.48.126/principal/libs/seguridad_estudio2_ajax.php',
    type: 'POST',
    data: prees,
    dataType: 'json',
    success: function(data) {
      // console.log(data.result);
      if (data.result) {
        data.result.forEach(function(element, index) {
          $('#cuerpo_preestudio').append(
            '<tr>' +
              '<td>' +
              element.id_preestudio +
              '</td>' +
              '<td>' +
              element.serv +
              '</td>' +
              '<td>' +
              element.fecha +
              '</td>' +
              '<td>' +
              element.hora +
              '</td>' +
              '<td>' +
              element.usuario +
              '</td>' +
              '<td>' +
              element.proceso +
              '</td>' +
              '</tr>',
          );
        });
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('error');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  //movimientos de areas
  var movi = {
    idsoli: idsoli,
    idc: id_conductor,
    idv: idvehi,
    action: 'status_security',
  };
  $('#movimientos_status').html('');
  $.ajax({
    url: 'http://20.75.48.126/principal/libs/seguridad_estudio2_ajax.php',
    type: 'POST',
    data: movi,
    dataType: 'json',
    success: function(data) {
      // console.log('ok datos status');
      if (data) {
        $('#movimientos_status').append(
          '<tr><td>Operaciones</td>' +
            '<td>' +
            data.result[0].fecha_asignacion +
            '</td>' +
            '<td>' +
            data.result[0].hora_asignacion +
            '</td>' +
            '<td>' +
            data.result[0].user_log +
            '</td>' +
            '<td>' +
            data.result[0].observacion +
            '</td>' +
            '</tr>',
        );
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('error status');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
