const d = document;
const w = window;
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  origen_ruta();
  destino_ruta();

  d.addEventListener('click', async e => {
    if (e.target.matches('#btn_guadarruta') || e.target.matches('#btn_guadarruta *')) {
      Swal.fire({
        title: '¿Estas seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Crear Ruta',
        cancelButtonText: 'No, Cancelar',
      }).then(result => {
        if (result.isConfirmed) {
          var msg_error = '';
          if (!$('#origen_c').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Origen</strong> para poder crear la Ruta.</p>';
            AplicaFoco('#origen_c');
          } else {
            RemueveFoco('#origen_c');
          }
          if (!$('#destino_c').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Destino</strong> para poder crear la ruta.</p>';
            AplicaFoco('#destino_c');
          } else {
            RemueveFoco('#destino_c');
          }
          if (!$('#observa_c').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Observación</strong> para poder crear la Ruta.</p>';
            AplicaFoco('#observa_c');
          } else {
            RemueveFoco('#observa_c');
          }
          if (!$('#la_ori').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Latitud origen</strong> para poder crear la Ruta.</p>';
            AplicaFoco('#la_ori');
          } else {
            RemueveFoco('#la_ori');
          }
          if (!$('#la_des').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Latitud destino</strong> para poder crear la Ruta.</p>';
            AplicaFoco('#la_des');
          } else {
            RemueveFoco('#la_des');
          }
          if (!$('#long_ori').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Longitud origen</strong> para poder crear la Ruta.</p>';
            AplicaFoco('#long_ori');
          } else {
            RemueveFoco('#long_ori');
          }
          if (!$('#long_des').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Longitud destino</strong> para poder crear la Ruta.</p>';
            AplicaFoco('#long_des');
          } else {
            RemueveFoco('#long_des');
          }
          if (!$('#tiempo_c').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Tiempo total ruta</strong> para poder crear la Ruta.</p>';
            AplicaFoco('#tiempo_c');
          } else {
            RemueveFoco('#tiempo_c');
          }
          if (!$('#kilometro_c').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Kilometros total de la ruta</strong> para poder crear la Ruta.</p>';
            AplicaFoco('#kilometro_c');
          } else {
            RemueveFoco('#kilometro_c');
          }
          if (!msg_error) {
            validar_ruta();
          } else {
            $('#msg_editar').html(
              '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
                msg_error +
                '</div></div>',
            );
            $('#crear_ruta').animate({scrollTop: 0}, 600);
          }
        }
      });

      // if (w.confirm('¿Estas segurdo de crear la ruta?')) {
      // } else {
      //   console.log('Operacion cancelada');
      // }
    }

    if (e.target.matches('#btn_ver') || e.target.matches('#btn_ver *')) {
      let padre = e.target.parentElement.parentElement;
      var elemento = padre.querySelector('.btn_ver');
      // Obtén el valor del atributo data-id
      var id = elemento.getAttribute('data-id');
      var origen = elemento.getAttribute('data-id2');
      var destino = elemento.getAttribute('data-id3');
      $('#codigo_v').val(id);
      $('#codigo_v').html(id);
      $('#origen_v').val(origen);
      $('#destino_v').val(destino);
      //consultar origenes y destinos
      var consu = {
        id: id,
        origen: origen,
        destino: destino,
        action: 'lugares',
      };
      $.ajax({
        url: $('#id_url_ajax').val() + 'trafico/Lugares',
        type: 'POST',
        data: consu,
        dataType: 'json',
        success: function(data) {
          console.log('trajo ver ruta');
          if (data.Resultado_uno) {
            var ori = data.Resultado_uno[0].municipio + '-' + data.Resultado_uno[0].depto;
            // $("#observa_v").val(data.Resultado_uno[0].observaciones);
            $('#observa_v').html(data.Resultado_uno[0].observaciones);
            // $("#fecha_v").val(data.Resultado_uno[0].fecha);
            $('#fecha_v').html(data.Resultado_uno[0].fecha);
            // $("#hora_v").val(data.Resultado_uno[0].hora);
            $('#hora_v').html(data.Resultado_uno[0].hora);
            // $("#user_v").val(data.Resultado_uno[0].usuario);
            $('#user_v').html(data.Resultado_uno[0].usuario);
            $('#origen_vv').html(ori);
            // $("#vla_ori").val(data.Resultado_uno[0].latitud_origen);
            $('#vla_ori').html(data.Resultado_uno[0].latitud_origen);
            // $("#vla_des").val(data.Resultado_uno[0].latitud_destino);
            $('#vla_des').html(data.Resultado_uno[0].latitud_destino);
            // $("#vlo_ori").val(data.Resultado_uno[0].longitud_origen);
            $('#vlo_ori').html(data.Resultado_uno[0].longitud_origen);
            // $("#vlo_des").val(data.Resultado_uno[0].longitud_destino);
            $('#vlo_des').html(data.Resultado_uno[0].longitud_destino);
            // $("#vtiempo").val(data.Resultado_uno[0].tiempo_tot_ruta);
            $('#vtiempo').html(data.Resultado_uno[0].tiempo_tot_ruta);
            // $("#vkilometro").val(data.Resultado_uno[0].km_tot_ruta);
            $('#vkilometro').html(data.Resultado_uno[0].km_tot_ruta);
            var latori = data.Resultado_uno[0].latitud_origen;
            var latdes = data.Resultado_uno[0].latitud_destino;
            var lonori = data.Resultado_uno[0].longitud_origen;
            var londes = data.Resultado_uno[0].longitud_destino;
            pintar_mapa(latori, latdes, lonori, londes);
          }
          if (data.Resultado_dos) {
            var des = data.Resultado_dos[0].municipio + '-' + data.Resultado_dos[0].depto;
            $('#destino_vv').html(des);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('no trajo ver ruta');
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }

    if (e.target.matches('#btn_editar') || e.target.matches('#btn_editar *')) {
      let padre = e.target.parentElement.parentElement;
      var elemento = padre.querySelector('.btn_editar');
      // Obtén el valor del atributo data-id
      var id = elemento.getAttribute('data-id');
      var origen = elemento.getAttribute('data-id2');
      var destino = elemento.getAttribute('data-id3');
      $('#edite_ruta .form-control').val('Cargando...');
      var edi = {
        id: id,
        origen: origen,
        destino: destino,
        // action: "edit_ruta",
      };
      $('#habil_e').html('');
      $.ajax({
        url: $('#id_url_ajax').val() + 'trafico/Editar_Ruta',
        type: 'POST',
        data: edi,
        dataType: 'json',
        success: function(data) {
          console.log('trajo editar ruta');
          console.log(data);
          if (data) {
            if (data.estado == 'habilitado') {
              $('#habil_e').append('<option value="1">Si</option><option value="0">No</option>');
            }
            if (data.estado == 'inhabilitado') {
              $('#habil_e').append('<option value="0">No</option><option value="1">Si</option>');
            }

            $('#codigo_e').val(id);
            $('#observa_e').val(data.observaciones);
            $('#fecha_e').val(data.fecha);
            $('#hora_e').val(data.hora);
            $('#user_e').val(data.usuario);
            $('#vla_ori_e').val(data.latitud_origen);
            $('#vla_des_e').val(data.latitud_destino);
            $('#vlo_ori_e').val(data.longitud_origen);
            $('#vlo_des_e').val(data.longitud_destino);
            $('#tiempoe').val(data.tiempo_tot_ruta);
            $('#kilometroe').val(data.km_tot_ruta);
            var tipo = $('#destino_e').html('');
            data.cod_ciudad_destino.forEach(function(element, index) {
              var tmpSelected = '';
              if (element.selected) {
                tmpSelected = 'selected';
              }
              var tipo = $('#destino_e').append(
                '<option ' + tmpSelected + ' value="' + element.id_destino + '">' + element.mun_destino + '-' + element.dep_destino + '</option>',
              );
            });

            var tip = $('#origen_e').html('');
            data.cod_ciudad_origen.forEach(function(element, index) {
              var tmpSelected = '';
              if (element.selected) {
                tmpSelected = 'selected';
              }
              var tip = $('#origen_e').append(
                '<option ' + tmpSelected + ' value="' + element.id_origen + '">' + element.mun_origen + '-' + element.dep_origen + '</option>',
              );
            });
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('no trajo ver ruta');
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }

    if (e.target.matches('#btn_updateruta') || e.target.matches('#btn_updateruta *')) {
      Swal.fire({
        title: '¿Estas seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Crear Ruta',
        cancelButtonText: 'No, Cancelar',
      }).then(result => {
        if (result.isConfirmed) {
          var msg_error = '';
          if (!$('#codigo_e').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Código</strong> para poder actualizar la Ruta.</p>';
            AplicaFoco('#codigo_e');
          } else {
            RemueveFoco('#codigo_e');
          }
          if (!$('#origen_e').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Origen</strong> para poder actualizar la Ruta.</p>';
            AplicaFoco('#origen_e');
          } else {
            RemueveFoco('#origen_e');
          }
          if (!$('#destino_e').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Destino</strong> para poder actualizar la Ruta.</p>';
            AplicaFoco('#destino_e');
          } else {
            RemueveFoco('#destino_e');
          }
          if (!$('#vla_ori_e').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Latitud origen</strong> para poder actualizar la Ruta.</p>';
            AplicaFoco('#vla_ori_e');
          } else {
            RemueveFoco('#vla_ori_e');
          }
          if (!$('#vla_des_e').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Latitud destino</strong> para poder actualizar la Ruta.</p>';
            AplicaFoco('#vla_des_e');
          } else {
            RemueveFoco('#vla_des_e');
          }
          if (!$('#vlo_ori_e').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Longitud origen</strong> para poder actualizar la Ruta.</p>';
            AplicaFoco('#vlo_ori_e');
          } else {
            RemueveFoco('#vlo_ori_e');
          }
          if (!$('#vlo_des_e').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Longitud destino</strong> para poder actualizar la Ruta.</p>';
            AplicaFoco('#vlo_des_e');
          } else {
            RemueveFoco('#vlo_des_e');
          }
          if (!$('#tiempoe').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Tiempo total de la ruta</strong> para poder actualizar la Ruta.</p>';
            AplicaFoco('#tiempoe');
          } else {
            RemueveFoco('#tiempoe');
          }
          if (!$('#kilometroe').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Kilometros totales de la ruta</strong> para poder actualizar la Ruta.</p>';
            AplicaFoco('#kilometroe');
          } else {
            RemueveFoco('#kilometroe');
          }
          if (!$('#observa_e').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Kilometros totales de la ruta</strong> para poder actualizar la Ruta.</p>';
            AplicaFoco('#observa_e');
          } else {
            RemueveFoco('#observa_e');
          }
          if (!msg_error) {
            Actualiza_Ruta();
          } else {
            $('#msg_edicion').html(
              '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
                msg_error +
                '</div></div>',
            );
            $('#edite_ruta').animate({scrollTop: 0}, 600);
          }
        }
      });

      // if (window.confirm('¿Estas segurdo de actualizar la ruta?')) {
      // } else {
      //   // Código a ejecutar si el usuario hace clic en "Cancelar"
      //   // $("#btn_updateruta").show();
      //   console.log('Operacion cancelada');
      // }
    }

    if (e.target.matches('#btn_consulta_rutas') || e.target.matches('#btn_consulta_rutas *')) {
      var eleccion = d.getElementById('elegir').value;
      var lugar = d.getElementById('lugares').value;
      // alert("Hola Mundo " + eleccion + " " + lugar);
      let data = new FormData();
      data.append('eleccion', eleccion);
      data.append('lugar', lugar);
      await fetch($('#id_url_ajax').val() + 'trafico/Filtro_Rutas', {
        method: 'POST',
        cache: 'no-cache',
        body: data,
      })
        .then(response => response.json())
        .then(function(data) {
          if (data) {
            $('#body_esconder').html('');
            cuente = 0;
            cont = 0;
            data.forEach(function(element, index) {
              cuente++;
              cont++;
              var btn_ver = '';
              var btn_editar = '';
              //variables para los botones
              var id = element.id;
              var origen = element.cod_ciudad_origen;
              var destino = element.cod_ciudad_destino;

              //botones
              // btn_ver =
              //   '<button type="button" class="btn btn-info btn btn-xs" title="Consultar ruta" id="btn_ver' +
              //   cont +
              //   '"   data-toggle="modal" data-target="#consulte_ruta"  data-id="' +
              //   id +
              //   '" data-id2="' +
              //   origen +
              //   '" data-id3="' +
              //   destino +
              //   '"><i class="far fa-eye"></i></button>';
              // btn_editar =
              //   '<button type="button" class="btn btn-warning btn btn-xs" title="Editar ruta" id="btn_editar' +
              //   cont +
              //   '"   data-toggle="modal" data-target="#edite_ruta"  data-id="' +
              //   id +
              //   '" data-id2="' +
              //   origen +
              //   '" data-id3="' +
              //   destino +
              //   '" ><i class="fas fa-pencil-alt"></i></button>';

              var col_status = '';
              var col_estado = '';
              if (element.estado == 'habilitado') {
                col_status =
                  '<td class="text-success">' +
                  '<center>' +
                  '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Realizada" ></span>' +
                  '</center>' +
                  '</td>';
                col_estado = `<span class="label label-success" title="Ruta Habilitada">${element.estado}</span>`;
              }

              if (element.estado == 'inhabilitado') {
                col_status =
                  '<td class="text-danger">' +
                  '<center>' +
                  '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Realizada" ></span>' +
                  '</center>' +
                  '</td>';
                col_estado = `<span class="label label-danger" title="Ruta Inhabilitada">${element.estado}</span>`;
              }

              var ol = element.om + '-' + element.od;
              var dl = element.od1 + '-' + element.dd;
              // console.log(element);
              $('#body_esconder').append(
                `<tr>
                  ${col_status}
                  <td style="font-size:11px;" class="text-left">${element.id}</td>
                  <td style="font-size:11px;" class="text-center">${ol} </td>
                  <td style="font-size:11px;" class="text-center">${dl}</td>
                  <td style="font-size:11px;" class="text-center">${col_estado}</td>
                  <td style="font-size:11px;width:10px;" class="text-center">
                    <div class="btn-group" role="group" aria-label="...">
                      <button type="button" class="btn btn-primary btn-xs btn_ver" id="btn_ver" data-id="${id}" data-id2="${origen}" data-id3="${destino}" data-toggle="modal" data-target="#consulte_ruta"><i class="far fa-eye"></i></button>
                      <button type="button" class="btn btn-warning btn-xs btn_editar" id="btn_editar" data-toggle="modal" data-target="#edite_ruta" data-id="${id}" data-id2="${origen}" data-id3="${destino}"><i class="fas fa-pencil-alt"></i></button>
                    </div>    
                  </td>						
                </tr>`,
              );
            });
          }
        })
        .catch(error => {
          alert(error);
        });
    }
  });

  d.addEventListener('change', async e => {
    if (e.target.matches('#origen_c') || e.target.matches('#origen_c *')) {
      let padre = e.target.parentElement.parentElement;
      var valor = padre.querySelector('#origen_c').value;
      var dato = {
        id: valor,
      };
      $.ajax({
        url: $('#id_url_ajax').val() + 'trafico/Cordenada_Rutas',
        type: 'POST',
        data: dato,
        dataType: 'json',
        success: function(data) {
          $('#la_ori').val('');
          $('#long_ori').val('');
          if (data) {
            $('#la_ori').val(data.latitud);
            $('#long_ori').val(data.longitud);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('no hay cordenadas');
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }
    if (e.target.matches('#destino_c') || e.target.matches('#destino_c *')) {
      let padre = e.target.parentElement.parentElement;
      var valor = padre.querySelector('#destino_c').value;
      var dato = {
        id: valor,
      };
      $.ajax({
        url: $('#id_url_ajax').val() + 'trafico/Cordenada_Rutas',
        type: 'POST',
        data: dato,
        dataType: 'json',
        success: function(data) {
          $('#la_des').val('');
          $('#long_des').val('');
          if (data) {
            $('#la_des').val(data.latitud);
            $('#long_des').val(data.longitud);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('no hay cordenadas');
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }
    if (e.target.matches('#origen_e') || e.target.matches('#origen_e *')) {
      let padre = e.target.parentElement.parentElement;
      var valor = padre.querySelector('#origen_e').value;
      var dato = {
        id: valor,
      };
      $.ajax({
        url: $('#id_url_ajax').val() + 'trafico/Cordenada_Rutas',
        type: 'POST',
        data: dato,
        dataType: 'json',
        success: function(data) {
          $('#vla_ori_e').val();
          $('#vlo_ori_e').val();
          if (data) {
            $('#vla_ori_e').val(data.latitud);
            $('#vlo_ori_e').val(data.longitud);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('no hay cordenadas');
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }
    if (e.target.matches('#destino_e') || e.target.matches('#destino_e *')) {
      let padre = e.target.parentElement.parentElement;
      var valor = padre.querySelector('#destino_e').value;
      var dato = {
        id: valor,
      };
      $.ajax({
        url: $('#id_url_ajax').val() + 'trafico/Cordenada_Rutas',
        type: 'POST',
        data: dato,
        dataType: 'json',
        success: function(data) {
          $('#vla_des_e').val('');
          $('#vlo_des_e').val('');
          if (data) {
            $('#vla_des_e').val(data.latitud);
            $('#vlo_des_e').val(data.longitud);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('no hay cordenadas');
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }
    if (e.target.matches('#elegir') || e.target.matches('#elegir *')) {
      // var url = $("#id_url_ajax").val() + "libs/trafico_ajax.php"; Elegir_Origen_Ruta
      let padre = e.target.parentElement.parentElement;
      var eleccion = padre.querySelector('#elegir').value;
      // var eleccion = $("#elegir").val();
      if (eleccion == '') {
        alert('por favor seleccione una opción');
        $('#lugares').html('');
      } else {
        if (eleccion == 'Origen') {
          var url = $('#id_url_ajax').val() + 'trafico/Elegir_Origen_Ruta';
        }

        if (eleccion == 'Destino') {
          var url = $('#id_url_ajax').val() + 'trafico/Elegir_Destino_Ruta';
        }

        $('#lugares').html('');
        $.ajax({
          url: url,
          type: 'POST',
          // data: dato,
          dataType: 'json',
          success: function(data) {
            data.forEach(function(element, index) {
              $('#lugares').append('<option value="' + element.id + '" >' + element.municipio + '-' + element.depto + '</option>');
            });
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('no hay lugar filtro');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
      }
    }
  });
});

function validar_ruta() {
  var data = null;
  data = new FormData();
  var origen = $('#origen_c').val();
  var destino = $('#destino_c').val();
  //validar que no exista una ruta con igual origen-destino
  var validar = {
    origen: origen,
    destino: destino,
    // action: "solo_una_ruta",
  };

  $.ajax({
    url: $('#id_url_ajax').val() + 'trafico/Solo_una_ruta',
    type: 'POST',
    data: validar,
    dataType: 'json',
    success: function(data) {
      if (data == 0) {
        crear_ruta();
      } else if (data == 1) {
        // alert('Seleccione otra Ruta, esta ruta ya existe');
        Swal.fire({
          title: 'Advertencia!',
          text: 'Seleccione otra Ruta, esta ruta ya existe',
          icon: 'warning',
        });
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no hay nada');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function crear_ruta() {
  var data = null;
  data = new FormData();
  var origen = $('#origen_c').val();
  var destino = $('#destino_c').val();
  var observacion = $('#observa_c').val();
  var fecha = $('#fecha_c').val();
  var hora = $('#hora_c').val();
  var user = $('#user_c').val();
  var la_ori = $('#la_ori').val();
  var la_des = $('#la_des').val();
  var lon_ori = $('#long_ori').val();
  var lon_des = $('#long_des').val();
  var tiempo_tot = $('#tiempo_c').val();
  var kilo_tot = $('#kilometro_c').val();

  // data.append('accion', 'insertar_ruta');
  data.append('origen', origen);
  data.append('destino', destino);
  data.append('observa', observacion);
  data.append('fecha', fecha);
  data.append('hora', hora);
  data.append('user', user);
  data.append('latitud_origen', la_ori);
  data.append('latitud_destino', la_des);
  data.append('longitud_origen', lon_ori);
  data.append('longitud_destino', lon_des);
  data.append('tiempo_tot', tiempo_tot);
  data.append('kilo_tot', kilo_tot);

  $.ajax({
    url: $('#id_url_ajax').val() + 'trafico/Insertar_ruta',
    type: 'POST',
    data: data,
    cache: false,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    dataType: 'json',
    success: function(data, textStatus, jqXHR) {
      // alert('Ok!! Solicitud Registrada Exitosamente!!');
      Swal.fire({
        title: 'Exito!',
        text: 'Cabecera Creada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        showConfirmButton: true,
        // timer: 1500,
      });
      location.reload();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no inserto ruta');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function origen_ruta() {
  $.ajax({
    url: $('#id_url_ajax').val() + 'trafico/Cargar_origen',
    type: 'POST',
    // data: datos,
    dataType: 'json',
    success: function(data) {
      console.log('trajo origen');
      data.forEach(function(element, index) {
        $('#origen_c').append('<option value="' + element.id + '">' + element.municipio + '-' + element.depto + '</option>');
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no trajo origen');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function destino_ruta() {
  $.ajax({
    url: $('#id_url_ajax').val() + 'trafico/Cargar_destino',
    type: 'POST',
    // data: datos,
    dataType: 'json',
    success: function(data) {
      console.log('trajo destino');
      data.forEach(function(element, index) {
        $('#destino_c').append('<option value="' + element.id + '">' + element.municipio + '-' + element.depto + '</option>');
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no trajo destino');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function pintar_mapa(latori, latdes, lonori, londes) {
  //alert('google maps');
  var latori_1 = parseFloat(latori);
  var latdes_1 = parseFloat(latdes);
  var lonori_1 = parseFloat(lonori);
  var londes_1 = parseFloat(londes);

  var coord_ori = {lat: latori_1, lng: lonori_1};
  var coord_des = {lat: latdes_1, lng: londes_1};

  var coord_pais = {lat: 8.5709, lng: -74.2973}; //colombia
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: coord_pais,
    mapTypeId: 'hybrid',
  });

  var marker = new google.maps.Marker({
    position: coord_ori,
    map: map,
  });

  marker = new google.maps.Marker({
    position: coord_des,
    map: map,
  });

  var objConfigDR = {map: map};
  var objConfigDS = {
    origin: coord_ori,
    destination: coord_des,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  //calcular la ruta con los datos satelitales de google
  var ds = new google.maps.DirectionsService();
  var dr = new google.maps.DirectionsRenderer(objConfigDR);
  ds.route(objConfigDS, fnRutear);

  function fnRutear(resultados, status) {
    if (status == 'OK') {
      dr.setDirections(resultados);
    }
  }
}

function Actualiza_Ruta() {
  var id = $('#codigo_e').val();
  var ori = $('#origen_e').val();
  var des = $('#destino_e').val();
  var obs = $('#observa_e').val();
  var fech = $('#fecha_e').val();
  var hora = $('#hora_e').val();
  var user = $('#user_e').val();
  var es = $('#habil_e').val();
  var tiempoe = $('#tiempoe').val();
  var kilometroe = $('#kilometroe').val();

  var a = $('#habil_e').val();
  if (a == '1') {
    estado = 'habilitado';
  }
  if (a == '0') {
    estado = 'inhabilitado';
  }
  var vla_ori_e = $('#vla_ori_e').val();
  var vla_des_e = $('#vla_des_e').val();
  var vlo_ori_e = $('#vlo_ori_e').val();
  var vlo_des_e = $('#vlo_des_e').val();
  var data = null;
  data = new FormData();
  // data.append("accion", "update_ruta");
  data.append('id', id);
  data.append('origen', ori);
  data.append('destino', des);
  data.append('observa', obs);
  data.append('fecha', fech);
  data.append('hora', hora);
  data.append('user', user);
  data.append('estado', estado);
  data.append('vla_ori_e', vla_ori_e);
  data.append('vla_des_e', vla_des_e);
  data.append('vlo_ori_e', vlo_ori_e);
  data.append('vlo_des_e', vlo_des_e);
  data.append('tiempoe', tiempoe);
  data.append('kilometroe', kilometroe);
  $.ajax({
    url: $('#id_url_ajax').val() + 'trafico/Update_Ruta',
    type: 'POST',
    data: data,
    cache: false,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    dataType: 'json',
    success: function(data, textStatus, jqXHR) {
      // alert('Ok!!Ruta Actualizada Exitosamente!!');
      // location.reload();
      Swal.fire({
        title: 'Exito!',
        text: 'Cabecera actualizada correctamente',
        icon: 'success',
        // confirmButtonText: 'Aceptar',
        // showConfirmButton: true,
        timer: 1500,
      });
      setTimeout(() => {
        location.reload();
      }, 1500);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no actualizo ruta');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
