
window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  const d = document;
  const w = window;
  $('.select2').select2();
  window.VENTANA = id; // Asigna el ID recibido a la variable global
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

          //Valiadciones de los campos de los puntos del plan de ruta
          if (!$('#p_planname').val()) {
            msg_error += '<p>Debe diligenciar el campo <strong>Nombre del plan </strong> para poder crear el Detalle de Ruta.</p>';
            AplicaFoco('#p_planname');
          } else {
            RemueveFoco('#p_planname');
          }
          // if (!$('#p_planob').val()) {
          //   msg_error += '<p>Debe diligenciar el campo <strong>detalle del plan</strong> para poder crear el Detalle de Ruta.</p>';
          //   AplicaFoco('#p_planob');
          // } else {
          //   RemueveFoco('#p_planob');
          // }
          // if (!$('#r_id').val()) {
          //   msg_error += '<p>Debe diligenciar el campo <strong>Código de ruta</strong> recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
          //   AplicaFoco('#r_id');
          // } else {
          //   RemueveFoco('#r_id');
          // }

          if (!$('#p_puntofinal').val()) {
            msg_error +=
              '<p>Debe diligenciar el campo <strong>Nombre Punto</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
            AplicaFoco('#p_puntofinal');
          } else {
            RemueveFoco('#p_puntofinal');
          }
          if (!$('#p_tiempofinal').val()) {
            msg_error +=
              '<p>Debe diligenciar el campo <strong>Tiempo Estimado (minutos)</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
            AplicaFoco('#p_tiempofinal');
          } else {
            RemueveFoco('#p_tiempofinal');
          }
          if (!$('#p_ciudadfinal').val()) {
            msg_error +=
              '<p>Debe diligenciar el campo <strong>Ubicación</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
            AplicaFoco('#p_ciudadfinal');
          } else {
            RemueveFoco('#p_ciudadfinal');
          }
          if (!$('#p_descrifinal').val()) {
            msg_error +=
              '<p>Debe diligenciar el campo <strong>Descripción</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
            AplicaFoco('#p_descrifinal');
          } else {
            RemueveFoco('#p_descrifinal');
          }
          if (!$('#p_kmfinal').val()) {
            msg_error +=
              '<p>Debe diligenciar el campo <strong>Km estimados</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
            AplicaFoco('#p_kmfinal');
          } else {
            RemueveFoco('#p_kmfinal');
          }
          if (!$('#ordenfinal').val()) {
            msg_error +=
              '<p>Debe diligenciar el campo <strong>Orden</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
            AplicaFoco('#ordenfinal');
          } else {
            RemueveFoco('#ordenfinal');
          }
          if (!$('#tpfinal').val()) {
            msg_error +=
              '<p>Debe diligenciar el campo <strong>Tipo punto</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
            AplicaFoco('#tpfinal');
          } else {
            RemueveFoco('#tpfinal');
          }
          if (!$('#latitudfinal').val()) {
            msg_error +=
              '<p>Debe diligenciar el campo <strong>Latitud</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
            AplicaFoco('#latitudfinal');
          } else {
            RemueveFoco('#latitudfinal');
          }
          if (!$('#longitudfinal').val()) {
            msg_error +=
              '<p>Debe diligenciar el campo <strong>Longitud</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
            AplicaFoco('#longitudfinal');
          } else {
            RemueveFoco('#longitudfinal');
          }
          var i;
          for (i = 1; i <= contador_global1; i++) {
            if (!$('#p_punto' + i + '').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Nombre punto ' + i + '</strong> para poder crear el Detalle de Ruta.</p>';
              AplicaFoco('#p_punto' + i + '');
            } else {
              RemueveFoco('#p_punto' + i + '');
            }
            if (!$('#p_ciudad' + i + '').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Ubicación ' + i + '</strong> para poder crear el Detalle de Ruta.</p>';
              AplicaFoco('#p_ciudad' + i + '');
            } else {
              RemueveFoco('#p_ciudad' + i + '');
            }
            if (!$('#p_tiempo' + i + '').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Tiempo ' + i + '</strong> para poder crear el Detalle de Ruta.</p>';
              AplicaFoco('#p_tiempo' + i + '');
            } else {
              RemueveFoco('#p_tiempo' + i + '');
            }
            if (!$('#p_km' + i + '').val()) {
              msg_error +=
                '<p>Debe diligenciar el campo <strong>Km estimados desde el punto anterior ' + i + '</strong> para poder crear el Plan de Ruta.</p>';
              AplicaFoco('#p_km' + i + '');
            } else {
              RemueveFoco('#p_km' + i + '');
            }
            if (!$('#p_descri' + i + '').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Descripción ' + i + '</strong> para poder crear el Detalle de Ruta.</p>';
              AplicaFoco('#p_descri' + i + '');
            } else {
              RemueveFoco('#p_descri' + i + '');
            }
            if (!$('#tp' + i + '').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Tipo punto ' + i + '</strong> para poder crear el Detalle de Ruta.</p>';
              AplicaFoco('#tp' + i + '');
            } else {
              RemueveFoco('#tp' + i + '');
            }
            if (!$('#latitud' + i + '').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Latitud ' + i + '</strong> para poder crear el Detalle de Ruta.</p>';
              AplicaFoco('#latitud' + i + '');
            } else {
              RemueveFoco('#latitud' + i + '');
            }
            if (!$('#longitud' + i + '').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Longitud ' + i + '</strong> para poder crear el Detalle de Ruta.</p>';
              AplicaFoco('#longitud' + i + '');
            } else {
              RemueveFoco('#longitud' + i + '');
            }

            /* Se desabilita este punto de validacion por solicitud de area de seguridad y trafico */
            //validar tiempo
            var tiempo_valida = $("#p_tiempo" + i + "").val();
            var suma = 0;
            if (typeof $("#p_tiempo" + i).val() !== "undefined" && $("#p_tiempo" + i).val() !== "") {
              var tf = $("#p_tiempofinal").val();
              suma = parseFloat(suma) + parseFloat(tiempo_valida) + parseFloat(tf);
            }
            if (suma > $("#timeruta").val()) {
              msg_error +=
                "<p>La sumatoria de los campos denominados como <strong>total de los Tiempo Estimado (minutos) </strong> supera el <strong>Tiempo total de la ruta </strong></p>";
            }

            //validar kilometros
            var kilome_valida = $("#p_km" + i + "").val();
            var sumk = 0;
            if (typeof $("#p_km" + i).val() !== "undefined" && $("#p_km" + i).val() !== "") {
              var kmf = $("#p_kmfinal").val();
              sumk = parseFloat(sumk) + parseFloat(kilome_valida) + parseFloat(kmf);
            }
            if (sumk > $("#kilometerruta").val()) {
              msg_error +=
                "<p>La sumatoria de los campos denominados como <strong> Km estimados desde el punto anterior </strong> supera el <strong>Kilométro total de la ruta</strong></p>";
            }
          }
          //Fin de la validaciones para los puntos

          if (!msg_error) {
            validar_ruta();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Errores encontrados',
              html: `<ul style="text-align:left;">${msg_error}</ul>`,
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'btn btn-danger'
              },
              buttonsStyling: false
            });
            $('.offcanvas-body').animate({ scrollTop: 0 }, 600);
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
        url: $('#base_url').val() + 'trafico/Lugares',
        type: 'POST',
        data: consu,
        dataType: 'json',
        success: function (data) {
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
        error: function (jqXHR, textStatus, errorThrown) {
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
        url: $('#base_url').val() + 'trafico/Editar_Ruta',
        type: 'POST',
        data: edi,
        dataType: 'json',
        success: function (data) {
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
            data.cod_ciudad_destino.forEach(function (element, index) {
              var tmpSelected = '';
              if (element.selected) {
                tmpSelected = 'selected';
              }
              var tipo = $('#destino_e').append(
                '<option ' + tmpSelected + ' value="' + element.id_destino + '">' + element.mun_destino + '-' + element.dep_destino + '</option>',
              );
            });

            var tip = $('#origen_e').html('');
            data.cod_ciudad_origen.forEach(function (element, index) {
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
        error: function (jqXHR, textStatus, errorThrown) {
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
            $('#edite_ruta').animate({ scrollTop: 0 }, 600);
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

    if (e.target.matches('#btn_consulta_rutas') || e.target.matches('#btn_consulta_rutas *')) { //Migrado
      var eleccion = d.getElementById('elegir').value;
      var lugar = d.getElementById('lugares').value;
      // alert("Hola Mundo " + eleccion + " " + lugar);
      let data = new FormData();
      data.append('eleccion', eleccion);
      data.append('lugar', lugar);
      await fetch($('#base_url').val() + 'trafico/Filtro_Rutas', {
        method: 'POST',
        cache: 'no-cache',
        body: data,
      })
        .then(response => response.json())
        .then(function (data) {
          if (data) {
            $('#body_esconder').html('');
            cuente = 0;
            cont = 0;
            data.forEach(function (element, index) {
              cuente++;
              cont++;
              var btn_ver = '';
              var btn_editar = '';
              //variables para los botones
              var id = element.id;
              var origen = element.cod_ciudad_origen;
              var destino = element.cod_ciudad_destino;

              let col_status = '';
              let col_estado = '';

              if (element.estado === 'habilitado') {
                col_status = `
                  <td class="text-success">
                    <center>
                      <span class="fas fa-circle text-success" data-toggle="tooltip" title="Realizada"></span>
                    </center>
                  </td>
                `;
                col_estado = `
                  <span class="label label-success" title="Ruta Habilitada">${element.estado}</span>
                `;
              }

              if (element.estado === 'inhabilitado') {
                col_status = `
                  <td class="text-danger">
                    <center>
                      <span class="fas fa-circle text-danger" data-toggle="tooltip" title="Realizada"></span>
                    </center>
                  </td>
                `;
                col_estado = `
                <span class="label label-danger" title="Ruta Inhabilitada">${element.estado}</span>
              `;
              }

              var ol = element.om + '-' + element.od;
              var dl = element.od1 + '-' + element.dd;
              // console.log(element);
              $('#body_esconder').append(
                `<tr>
                  ${col_status}
                  <td style='width:auto; white-space: nowrap;'>${element.id}</td>
                  <td style='width:auto; white-space: nowrap;'>${ol} </td>
                  <td style='width:auto; white-space: nowrap;'>${dl}</td>
                  <td style='width:auto; white-space: nowrap;'>${col_estado}</td>
                  <td style='width:auto; white-space: nowrap;'>
                    <div class="btn-group btn-group-sm mt-2" role="group" aria-label="...">
                      <button type="button" class="btn btn-subtle-primary btn-sm me-1 px-1 py-0 btn_ver" id="btn_ver" data-id="${id}" data-id2="${origen}" data-id3="${destino}" data-toggle="modal" data-target="#consulte_ruta"><i class="far fa-eye"></i></button>
                      <button type="button" class="btn btn-subtle-warning btn-sm me-1 px-1 py-0 btn_editar" id="btn_editar" data-toggle="modal" data-target="#edite_ruta" data-id="${id}" data-id2="${origen}" data-id3="${destino}"><i class="fas fa-pencil-alt"></i></button>
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

    /* Guardar nuvo punto de rura que no exista en la aplicacion */
    if (e.target.matches('#btn_guadarpoint') || e.target.matches('#btn_guadarpoint *')) {
      var msg_error = "";

      if (!$("#municipio").val()) {
        msg_error += "<p>Debe diligenciar el campo <strong>Ubicación </strong> para poder crear el Plan de Ruta.</p>";
        AplicaFoco("#municipio");
      } else {
        RemueveFoco("#municipio");
      }

      if (!$("#p_punto").val()) {
        msg_error += "<p>Debe diligenciar el campo <strong>Nombre Punto </strong> para poder crear el Plan de Ruta.</p>";
        AplicaFoco("#p_punto");
      } else {
        RemueveFoco("#p_punto");
      }

      if (!$("#p_descri").val()) {
        msg_error += "<p>Debe diligenciar el campo <strong>Descripción </strong> para poder crear el Plan de Ruta.</p>";
        AplicaFoco("#p_descri");
      } else {
        RemueveFoco("#p_descri");
      }

      if (!$("#latitud").val()) {
        msg_error += "<p>Debe diligenciar el campo <strong>Latitud </strong> para poder crear el Plan de Ruta.</p>";
        AplicaFoco("#latitud");
      } else {
        RemueveFoco("#latitud");
      }

      if (!$("#longitud").val()) {
        msg_error += "<p>Debe diligenciar el campo <strong>Longitud </strong> para poder crear el Plan de Ruta.</p>";
        AplicaFoco("#longitud");
      } else {
        RemueveFoco("#longitud");
      }

      if (!$("#tipo_punto").val()) {
        msg_error += "<p>Debe diligenciar el campo <strong>Tipo Punto </strong> para poder crear el Plan de Ruta.</p>";
        AplicaFoco("#tipo_punto");
      } else {
        RemueveFoco("#tipo_punto");
      }

      if (!msg_error) {
        crear_punto();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Errores en el formulario',
          html: `<ul class="text-start" style="padding-left: 20px;">${msg_error}</ul>`,
          confirmButtonText: 'Entendido',
          customClass: {
            popup: 'swal2-border-radius-md',
            confirmButton: 'btn btn-danger'
          },
          buttonsStyling: false
        });
        $(".offcanvas-body").animate({ scrollTop: 0 }, 600);
      }
    }

    //Click para listar los punos de ruta
    if (e.target.matches('#btn_detalle_puntos') || e.target.matches('#btn_detalle_puntos *')) {
      punto_existente();
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
        url: $('#base_url').val() + 'trafico/Cordenada_Rutas',
        type: 'POST',
        data: dato,
        dataType: 'json',
        success: function (data) {
          $('#la_ori').val('');
          $('#long_ori').val('');
          if (data) {
            $('#la_ori').val(data.latitud);
            $('#long_ori').val(data.longitud);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log('no hay cordenadas');
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
      actualizarNombreRuta(); // <-- aquí también
    }

    if (e.target.matches('#destino_c') || e.target.matches('#destino_c *')) {
      let padre = e.target.parentElement.parentElement;
      var valor = padre.querySelector('#destino_c').value;
      var dato = {
        id: valor,
      };
      $.ajax({
        url: $('#base_url').val() + 'trafico/Cordenada_Rutas',
        type: 'POST',
        data: dato,
        dataType: 'json',
        success: function (data) {
          $('#la_des').val('');
          $('#long_des').val('');
          if (data) {
            $('#la_des').val(data.latitud);
            $('#long_des').val(data.longitud);

            $("#latitudfinal").val(data.latitud);
            $("#longitudfinal").val(data.longitud);

            // ✅ Mostrar texto del option seleccionado
            const ciudadFinal = $("#destino_c option:selected").text();
            $("#p_ciudadfinal").html(`<option selected value='${valor}'>${ciudadFinal}</option>`);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log('no hay cordenadas');
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
      actualizarNombreRuta(); // <-- aquí también
    }


    if (e.target.matches('#origen_e') || e.target.matches('#origen_e *')) {
      let padre = e.target.parentElement.parentElement;
      var valor = padre.querySelector('#origen_e').value;
      var dato = {
        id: valor,
      };
      $.ajax({
        url: $('#base_url').val() + 'trafico/Cordenada_Rutas',
        type: 'POST',
        data: dato,
        dataType: 'json',
        success: function (data) {
          $('#vla_ori_e').val();
          $('#vlo_ori_e').val();
          if (data) {
            $('#vla_ori_e').val(data.latitud);
            $('#vlo_ori_e').val(data.longitud);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
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
        url: $('#base_url').val() + 'trafico/Cordenada_Rutas',
        type: 'POST',
        data: dato,
        dataType: 'json',
        success: function (data) {
          $('#vla_des_e').val('');
          $('#vlo_des_e').val('');
          if (data) {
            $('#vla_des_e').val(data.latitud);
            $('#vlo_des_e').val(data.longitud);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log('no hay cordenadas');
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }

    if (e.target.matches('#elegir') || e.target.matches('#elegir *')) {
      // var url = $("#base_url").val() + "libs/trafico_ajax.php"; Elegir_Origen_Ruta
      let padre = e.target.parentElement.parentElement;
      var eleccion = padre.querySelector('#elegir').value;
      // var eleccion = $("#elegir").val();
      if (eleccion == '') {
        alert('por favor seleccione una opción');
        $('#lugares').html('');
      } else {
        if (eleccion == 'Origen') {
          var url = $('#base_url').val() + 'trafico/Elegir_Origen_Ruta';
        }

        if (eleccion == 'Destino') {
          var url = $('#base_url').val() + 'trafico/Elegir_Destino_Ruta';
        }

        $('#lugares').html('');
        $.ajax({
          url: url,
          type: 'POST',
          // data: dato,
          dataType: 'json',
          success: function (data) {
            data.forEach(function (element, index) {
              $('#lugares').append('<option value="' + element.id + '" >' + element.municipio + '-' + element.depto + '</option>');
            });
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log('no hay lugar filtro');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
      }
    }

    if (e.target.matches('#municipio') || e.target.matches('#municipio *')) {
      var id_muni = $("#municipio").val();
      $.post(
        $("#base_url").val() + "parametros/Consulta_cordenadas",
        "id_muni=" + id_muni,
        function (data) {
          $("#latitud").val("");
          $("#longitud").val("");
          if (data) {
            $("#latitud").val(data["latitud"]);
            $("#longitud").val(data["longitud"]);
          }
        },
        "json",
      );
    }
  });

  document.getElementById('btn_show_form').addEventListener('click', function () {
    const form = document.getElementById('content_editar');
    form.style.display = (form.style.display === 'none') ? '' : 'none';
    $.post(
      $("#base_url").val() + "parametros/Consulta_Municipios",
      function (data) {
        if (data) {
          for (var z = 0; z < data.length; z++) {
            $("#municipio").append('<option value="' + data[z]["id"] + '">' + data[z]["municipio"] + " - " + data[z]["depto"] + "</option>");
          }
        }
      },
      "json",
    );
  });

  document.getElementById('btn_cancelarpoint').addEventListener('click', function () {
    const form = document.getElementById('content_editar');
    form.style.display = (form.style.display === 'none') ? 'none' : 'none';
  });

  $("#consulte").click(function () {
    var muni = $("#Punto").val();
    if (muni == "") {
      alert("Debe seleccionar una ubicación");
    } else {
      Consulta_tabla();
    }
  });
};

// function validar_ruta() {
//   var data = null;
//   data = new FormData();
//   var origen = $('#origen_c').val();
//   var destino = $('#destino_c').val();
//   //validar que no exista una ruta con igual origen-destino
//   var validar = {
//     origen: origen,
//     destino: destino,
//     // action: "solo_una_ruta",
//   };

//   $.ajax({
//     url: $('#base_url').val() + 'trafico/Solo_una_ruta',
//     type: 'POST',
//     data: validar,
//     dataType: 'json',
//     success: function (data) {
//       if (data === 0) {
//         crear_ruta();
//       } else if (data === 1) {
//         // alert('Seleccione otra Ruta, esta ruta ya existe');
//         Swal.fire({
//           title: 'Advertencia!',
//           text: 'Seleccione otra Ruta, esta ruta ya existe',
//           icon: 'warning',
//         });
//       }
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log('no hay nada');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

// function crear_ruta() {
//   var data = null;
//   data = new FormData();
//   var origen = $('#origen_c').val();
//   var destino = $('#destino_c').val();
//   var observacion = $('#observa_c').val();
//   var fecha = $('#fecha_c').val();
//   var hora = $('#hora_c').val();
//   var user = $('#user_c').val();
//   var la_ori = $('#la_ori').val();
//   var la_des = $('#la_des').val();
//   var lon_ori = $('#long_ori').val();
//   var lon_des = $('#long_des').val();
//   var tiempo_tot = $('#tiempo_c').val();
//   var kilo_tot = $('#kilometro_c').val();

//   // data.append('accion', 'insertar_ruta');
//   data.append('origen', origen);
//   data.append('destino', destino);
//   data.append('observa', observacion);
//   data.append('fecha', fecha);
//   data.append('hora', hora);
//   data.append('user', user);
//   data.append('latitud_origen', la_ori);
//   data.append('latitud_destino', la_des);
//   data.append('longitud_origen', lon_ori);
//   data.append('longitud_destino', lon_des);
//   data.append('tiempo_tot', tiempo_tot);
//   data.append('kilo_tot', kilo_tot);

//   $.ajax({
//     url: $('#base_url').val() + 'trafico/Insertar_ruta',
//     type: 'POST',
//     data: data,
//     cache: false,
//     processData: false, // Don't process the files
//     contentType: false, // Set content type to false as jQuery will tell the server its a query string request
//     dataType: 'json',
//     success: function (data, textStatus, jqXHR) {
//       // alert('Ok!! Solicitud Registrada Exitosamente!!');
//       Swal.fire({
//         title: 'Exito!',
//         text: 'Cabecera Creada correctamente',
//         icon: 'success',
//         confirmButtonText: 'Aceptar',
//         showConfirmButton: true,
//         // timer: 1500,
//       });
//       location.reload();
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log('no inserto ruta');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

// /* Funciones para agreagr los puntos al plan de ruta */
// function consecutivo_plan() {
//   $.ajax({
//     url: $('#base_url').val() + 'trafico/maestro_detalle_ruta',
//     type: 'POST',
//     // data: maestro_detalle,
//     dataType: 'json',
//     success: function (data) {
//       if (data.result != null) {
//         data.result.forEach(function (element, index) {
//           consecutivo = element.numero_actual;
//           crear_plan(consecutivo);
//         });
//       } else {
//         alert('null');
//       }
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log('no consulto maestro');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

// async function crear_plan(id) {
//   // Código a ejecutar si el usuario hace clic en "Aceptar"
//   var data = null;
//   data = new FormData();
//   // data.append("accion", 'crear_plan');
//   data.append('id_ruta', $('#r_id').val());
//   data.append('cod_plan', id);
//   data.append('name_plan', $('#p_planname').val());
//   data.append('detallep', $('#p_planob').val());
//   data.append('fplan', $('#p_fechac').val());
//   data.append('hplan', $('#p_horac').val());
//   data.append('uplan', $('#p_userc').val());
//   data.append('cab', $('#cab').val());
//   data.append('fin', 9);
//   data.append('cab', $('#cab').val());
//   data.append('fin', 9);
//   //se construye el objeto que almacena los datos
//   let element = {
//     punto: [],
//     city: [],
//     // datos: [],
//     tiempo: [],
//     orden: [],
//     descri: [],
//     tpunto: [],
//     latitud: [],
//     longitud: [],
//     kilometro: [],
//   };
//   var i = 0;
//   for (i = 1; i <= contador_global1; i++) {
//     var punto = $('#p_punto' + i + '').val();
//     var city = $('#p_ciudad' + i + '').val();
//     var tiempo = $('#p_tiempo' + i + '').val();
//     var orden = $('#orden' + i + '').val();
//     var descri = $('#p_descri' + i + '').val();
//     var tpunto = $('#tp' + i + '').val();
//     var latitud = $('#latitud' + i + '').val();
//     var longitud = $('#longitud' + i + '').val();
//     var kilometro = $('#p_km' + i + '').val();

//     element.punto.push(punto);
//     element.city.push(city);
//     // elementato.datos.push(datos);
//     element.tiempo.push(tiempo);
//     element.orden.push(orden);
//     element.descri.push(descri);
//     element.tpunto.push(tpunto);
//     element.latitud.push(latitud);
//     element.longitud.push(longitud);
//     element.kilometro.push(kilometro);
//   }

//   // Nuevo Array completo
//   var nota = element;
//   nota = JSON.stringify(nota);
//   data.append('notas', nota);
//   // var contador_final = contador_global1 + 1;
//   // if ($("#ordenfinal").val() == contador_final) {}
//   data.append('puntofinal', $('#p_puntofinal').val());
//   data.append('tiempofinal', $('#p_tiempofinal').val());
//   data.append('descripfinal', $('#p_descrifinal').val());
//   data.append('kmfinal', $('#p_kmfinal').val());
//   data.append('ordenfinal', $('#ordenfinal').val());
//   data.append('tpfinal', $('#tpfinal').val());
//   data.append('latitudfinal', $('#latitudfinal').val());
//   data.append('longifinal', $('#longitudfinal').val());
//   data.append('ubicacion', $('#p_ciudadfinal').val());
//   data.append('cab', $('#cab').val(5));
//   data.append('punto', $('#puntos').val(5));
//   data.append('fin', 3);

//   await fetch($('#base_url').val() + 'planruta/Crear_Plan', {
//     method: 'POST',
//     body: data,
//     cache: 'no-cache',
//   })
//     .then((response) => {
//       if (!response.ok) throw new Error(response.statusText);
//       return response.json();
//     })
//     .then(function (response) {
//       if (response) {
//         alert(response);
//       }
//       location.reload();
//     })
//     .catch((error) => {
//       alert(error);
//     });

// }

/* Validar si ya existe la ruta*/
function validar_ruta() {
  const origen = $('#origen_c').val();
  const destino = $('#destino_c').val();

  const validar = { origen, destino };

  Swal.fire({
    title: 'Validando...',
    text: 'Verificando si la ruta ya existe.',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  $.ajax({
    url: $('#base_url').val() + 'trafico/Solo_una_ruta',
    type: 'POST',
    data: validar,
    dataType: 'json',
    success: function (data) {
      Swal.close();
      if (data === 0) {
        // consecutivo_plan();
        crear_ruta();
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia!',
          text: 'Seleccione otra Ruta, esta ruta ya existe',
        });
      }
    },
    error: function () {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo validar la ruta. Intente más tarde.',
      });
    }
  });
}

// Crear una nueva ruta si no existe
async function crear_ruta() {
  Swal.fire({
    title: 'Registrando nueva ruta...',
    text: 'Espere un momento por favor.',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    const origen = document.getElementById('origen_c').value;
    const destino = document.getElementById('destino_c').value;
    const observacion = document.getElementById('observa_c').value;
    const fecha = document.getElementById('fecha_c').value;
    const hora = document.getElementById('hora_c').value;
    const user = document.getElementById('user_c').value;
    const la_ori = document.getElementById('la_ori').value;
    const la_des = document.getElementById('la_des').value;
    const lon_ori = document.getElementById('long_ori').value;
    const lon_des = document.getElementById('long_des').value;
    const tiempo_tot = document.getElementById('tiempo_c').value;
    const kilo_tot = document.getElementById('kilometro_c').value;

    const check = document.getElementById('flexSwitchCheckChecked');
    const tipo_ruta = check.checked ? check.value : 'Segundaria';

    const formdata = new FormData();
    formdata.append('origen', origen);
    formdata.append('destino', destino);
    formdata.append('observa', observacion);
    formdata.append('fecha', fecha);
    formdata.append('hora', hora);
    formdata.append('user', user);
    formdata.append('latitud_origen', la_ori);
    formdata.append('latitud_destino', la_des);
    formdata.append('longitud_origen', lon_ori);
    formdata.append('longitud_destino', lon_des);
    formdata.append('tiempo_tot', tiempo_tot);
    formdata.append('kilo_tot', kilo_tot);
    formdata.append('tipo_ruta', tipo_ruta);

    const baseUrl = document.getElementById('base_url').value;

    const response = await fetch(`${baseUrl}trafico/Insertar_ruta`, {
      method: 'POST',
      body: formdata
    });

    const data = await response.json();

    Swal.close();

    if (data.success) {
      document.getElementById('r_id').value = data.id_ruta;
      consecutivo_plan();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar la ruta.'
      });
    }

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Fallo de conexión',
      text: 'No se pudo registrar la ruta.'
    });
    console.error('Error en la solicitud:', error);
  }
}

// Obtener el consecutivo para el plan de ruta y luego crear el plan
function consecutivo_plan() {
  $.ajax({
    url: $('#base_url').val() + 'trafico/maestro_detalle_ruta',
    type: 'POST',
    dataType: 'json',
    success: function (data) {
      if (data != null) {
        crear_plan(data.numero_actual);
        // data.forEach(function (element) {
        //   crear_plan(element.numero_actual);
        // });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener el número consecutivo del plan.'
        });
      }
    },
    error: function () {
      Swal.fire({
        icon: 'error',
        title: 'Fallo de conexión',
        text: 'No se pudo consultar el maestro de rutas.'
      });
    }
  });
}

// Crear plan de ruta completo
async function crear_plan(id) {
  Swal.fire({
    title: 'Creando plan de ruta',
    text: 'Por favor espere mientras se guarda la información...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    const data = new FormData();

    data.append('id_ruta', $('#r_id').val());
    data.append('cod_plan', id);
    data.append('name_plan', $('#p_planname').val());
    data.append('detallep', $('#p_planob').val());
    data.append('fplan', $('#p_fechac').val());
    data.append('hplan', $('#p_horac').val());
    data.append('uplan', $('#p_userc').val());
    data.append('cab', $('#cab').val());
    data.append('fin', 9);

    let element = {
      punto: [],
      city: [],
      tiempo: [],
      orden: [],
      descri: [],
      tpunto: [],
      latitud: [],
      longitud: [],
      kilometro: [],
    };

    for (let i = 1; i <= contador_global1; i++) {
      element.punto.push($('#p_punto' + i).val());
      element.city.push($('#p_ciudad' + i).val());
      element.tiempo.push($('#p_tiempo' + i).val());
      element.orden.push($('#orden' + i).val());
      element.descri.push($('#p_descri' + i).val());
      element.tpunto.push($('#tp' + i).val());
      element.latitud.push($('#latitud' + i).val());
      element.longitud.push($('#longitud' + i).val());
      element.kilometro.push($('#p_km' + i).val());
    }

    data.append('notas', JSON.stringify(element));

    data.append('puntofinal', $('#p_puntofinal').val());
    data.append('tiempofinal', $('#p_tiempofinal').val());
    data.append('descripfinal', $('#p_descrifinal').val());
    data.append('kmfinal', $('#p_kmfinal').val());
    data.append('ordenfinal', $('#ordenfinal').val());
    data.append('tpfinal', $('#tpfinal').val());
    data.append('latitudfinal', $('#latitudfinal').val());
    data.append('longifinal', $('#longitudfinal').val());
    data.append('ubicacion', $('#p_ciudadfinal').val());
    data.append('cab', $('#cab').val());
    data.append('punto', $('#puntos').val());
    data.append('fin', 3);

    const response = await fetch($('#base_url').val() + 'planruta/Crear_Plan', {
      method: 'POST',
      body: data,
      cache: 'no-cache',
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();

    Swal.fire({
      icon: 'success',
      title: 'Plan de ruta creado correctamente',
      text: 'Se ha registrado el plan de ruta.',
      confirmButtonText: 'Aceptar'
    });

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error al crear el plan',
      text: error.message || 'Ocurrió un error inesperado.'
    });
  } finally {
    // location.reload();
  }
}

/* Fin de la creacion de los puntos del plan de ruta */

function origen_ruta() {
  $.ajax({
    url: $('#base_url').val() + 'trafico/Cargar_origen',
    type: 'POST',
    // data: datos,
    dataType: 'json',
    success: function (data) {
      console.log('trajo origen');
      data.forEach(function (element, index) {
        $('#origen_c').append('<option value="' + element.id + '">' + element.municipio + '-' + element.depto + '</option>');
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no trajo origen');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function destino_ruta() {
  $.ajax({
    url: $('#base_url').val() + 'trafico/Cargar_destino',
    type: 'POST',
    // data: datos,
    dataType: 'json',
    success: function (data) {
      console.log('trajo destino');
      data.forEach(function (element, index) {
        $('#destino_c').append('<option value="' + element.id + '">' + element.municipio + '-' + element.depto + '</option>');
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
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

  var coord_ori = { lat: latori_1, lng: lonori_1 };
  var coord_des = { lat: latdes_1, lng: londes_1 };

  var coord_pais = { lat: 8.5709, lng: -74.2973 }; //colombia
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

  var objConfigDR = { map: map };
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
    url: $('#base_url').val() + 'trafico/Update_Ruta',
    type: 'POST',
    data: data,
    cache: false,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    dataType: 'json',
    success: function (data, textStatus, jqXHR) {
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
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no actualizo ruta');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

/* Detalles del plan de ruta */
var contador_global1 = 0;
function agregar_plan() {
  contador_global1++;
  let cont = contador_global1;

  let puntoHTML = `
    <div class="border rounded p-3 mb-3 bg-light position-relative" id="punto_${cont}">
      <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1 position-absolute top-0 end-0 m-1" onclick="eliminar_punto(${cont})">
        <i class="fa fa-trash-alt"></i> Eliminar
      </button>

      <div class="row mb-2">
        <div class="col-md-6">
          <label class="form-label">Ciudad</label>
          <select id='base${cont}' class='form-control form-control-sm select2' onchange='ciudad_de_base(this.value,${cont})'>
            <option value="">Seleccione</option>
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Puntos paramétricos</label>
          <select id='punto${cont}' class='form-control form-control-sm' onchange='punto_parametro(this.value,${cont})'>
            <option value="">Seleccione</option>
          </select>
        </div>
      </div>

      <div class="row mb-2">
        <div class="col-md-4">
          <label class="form-label">Nombre Punto</label>
          <input type="text" id="p_punto${cont}" class="form-control form-control-sm" disabled>
        </div>
        <div class="col-md-4">
          <label class="form-label">Ubicación</label>
          <select id='p_ciudad${cont}' class='form-control form-control-sm' disabled>
            <option value="">Seleccione</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Tiempo Estimado (minutos)</label>
          <input type="number" id="p_tiempo${cont}" class="form-control form-control-sm" placeholder="Respecto al punto anterior">
        </div>
      </div>

      <div class="row mb-2">
        <div class="col-md-4">
          <label class="form-label">Descripción</label>
          <textarea id="p_descri${cont}" class="form-control form-control-sm" rows="1" disabled></textarea>
        </div>
        <div class="col-md-4">
          <label class="form-label">Km estimados</label>
          <input type="number" id="p_km${cont}" class="form-control form-control-sm" placeholder="desde el punto anterior">
        </div>
        <div class="col-md-4">
          <label class="form-label">Orden</label>
          <input type="number" id="orden${cont}" class="form-control form-control-sm orden-input" value="${cont}" disabled>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4">
          <label class="form-label">Tipo punto</label>
          <select id="tp${cont}" class="form-control form-control-sm" disabled>
            <option value="">Seleccione</option>
            <option value="punto geografico" selected>Punto virtual</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Latitud</label>
          <input type="number" id="latitud${cont}" class="form-control form-control-sm" disabled>
        </div>
        <div class="col-md-4">
          <label class="form-label">Longitud</label>
          <input type="number" id="longitud${cont}" class="form-control form-control-sm" disabled>
        </div>
      </div>
    </div>
  `;

  $('#contenedor_puntos').append(puntoHTML);
  cargar_ciudades(cont);
  actualizar_punto_final();
}

function cargar_ciudades(cont) {
  $.ajax({
    url: $('#base_url').val() + 'planruta/Consutal_Base_Crear',
    type: 'POST',
    dataType: 'json',
    success: function (data) {
      if (data) {
        data.forEach(function (element) {
          $(`#base${cont}`).append(`<option value="${element.id}">${element.municipio} - ${element.depto}</option>`);
        });
      }
    },
    error: function () {
      console.log('No se consultaron ciudades');
    }
  });
}

function punto_parametro(valor, id) {
  var datos = {
    id_punto: valor,
  };
  $.ajax({
    // url: url,
    url: $('#base_url').val() + 'planruta/consultar_punto_para',
    type: 'POST',
    data: datos,
    dataType: 'json',
    success: function (data) {
      if (data) {
        $('#p_punto' + id).val(data.nom_punto);
        $('#p_descri' + id).val(data.descripcion_punto);
        $('#latitud' + id).val(data.latitud);
        $('#longitud' + id).val(data.longitud);
        $('#p_ciudad' + id).html(
          '<option value="' + data.id_muni + '">' + data.municipio + ' ' + data.depto + '</option>',
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no trajo punto');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
  actualizar_punto_final();
}

function eliminar_punto(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Este punto será eliminado de la lista.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    customClass: {
      confirmButton: 'btn btn-danger',
      cancelButton: 'btn btn-secondary'
    },
    buttonsStyling: false
  }).then((result) => {
    if (result.isConfirmed) {
      $(`#punto_${id}`).remove();
      recalcular_ordenes();

      Swal.fire({
        icon: 'success',
        title: 'Punto eliminado',
        text: 'El punto fue eliminado correctamente.',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn btn-success'
        },
        buttonsStyling: false,
        timer: 1000,
        showConfirmButton: false
      });
    }
  });
  actualizar_punto_final();
}

function recalcular_ordenes() {
  let orden = 1;
  $('.orden-input').each(function () {
    $(this).val(orden++);
  });
  $('#ordenfinalpuntos').val(orden);
  contador_global1 = orden - 1;
  actualizar_punto_final();
}

function actualizar_punto_final() {
  // const totalPuntos = contador_global1.length;
  $("#ordenfinal").val(contador_global1 + 1); // Siempre último

}

function ciudad_de_base(valor, conteo) {
  //consultar puntos
  var punto = {
    id_ciudad: valor,
    // action: 'consulta_puntos',
  };
  $('#punto' + conteo + '').html('<option value="">Seleccione</option>');
  $.ajax({
    url: $('#base_url').val() + 'trafico/consulta_puntos',
    type: 'POST',
    data: punto,
    dataType: 'json',
    success: function (data) {
      if (data) {
        data.forEach(function (element, index) {
          $('#punto' + conteo + '').append(
            '<option value="' + element.id + '">' + element.municipio + '-' + element.depto + ' | ' + element.nom_punto + '</option>',
          );
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no trajo punto');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

/* Funcion para guardar nuevos puntos de control */
function crear_punto() {
  var name_punto = $("#p_punto").val();
  var municipio = $("#municipio").val();
  var p_descri = $("#p_descri").val();
  var latitud = $("#latitud").val();
  var longitud = $("#longitud").val();
  var user = $("#user").val();
  var fecha = $("#fecha").val();
  var hora = $("#hora").val();

  var datos =
    "punto=" + encodeURIComponent(name_punto) +
    "&ubicacion=" + encodeURIComponent(municipio) +
    "&descrip=" + encodeURIComponent(p_descri) +
    "&latitud=" + encodeURIComponent(latitud) +
    "&longitud=" + encodeURIComponent(longitud) +
    "&user=" + encodeURIComponent(user) +
    "&fecha=" + encodeURIComponent(fecha) +
    "&hora=" + encodeURIComponent(hora);

  $.post(
    $("#base_url").val() + "parametros/Registro_Punto",
    datos,
    function (data) {
      if (data == "true") {
        Swal.fire({
          icon: 'success',
          title: 'Punto registrado',
          text: 'Los datos fueron registrados exitosamente.',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'btn btn-success'
          },
          buttonsStyling: false
        }).then(() => {
          // Limpiar campos del formulario
          $("#p_punto").val('');
          $("#municipio").val('');
          $("#p_descri").val('');
          $("#latitud").val('');
          $("#longitud").val('');
          $("#tipo_punto").val('');

          // Ocultar contenedor (si aplica)
          const form = document.getElementById('content_editar');
          if (form) {
            form.style.display = 'none';
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: 'No se pudo registrar el punto. Intenta nuevamente.',
          confirmButtonText: 'Cerrar',
          customClass: {
            confirmButton: 'btn btn-danger'
          },
          buttonsStyling: false
        });
      }
    },
    "json"
  ).fail(function () {
    Swal.fire({
      icon: 'error',
      title: 'Fallo de conexión',
      text: 'Ocurrió un error al conectar con el servidor.',
      confirmButtonText: 'Cerrar',
      customClass: {
        confirmButton: 'btn btn-warning'
      },
      buttonsStyling: false
    });
  });
}

function punto_existente() {
  $.post(
    $("#base_url").val() + "parametros/Consulta_Punto",
    function (data) {
      if (data) {
        for (var z = 0; z < data.length; z++) {
          $("#Punto").append('<option value="' + data[z]["id"] + '">' + data[z]["municipio"] + " - " + data[z]["depto"] + "</option>");
        }
      }
    },
    "json",
  );
}

function Consulta_tabla() {
  var munic = $("#Punto").val();
  $.post(
    $("#base_url").val() + "parametros/Consulta_puntos",
    "id_municipio=" + munic,
    function (data) {
      if (data) {
        for (var m = 0; m < data.length; m++) {
          var s, colour;
          if (data[m]["estado"] == 1) {
            s = "<center><span class='mdi mdi-dot-circle icon'></span></center>";
            colour = "class='nexos-txt-success'";
          }
          if (data[m]["estado"] == 0) {
            s = "<center><span class='mdi mdi-dot-circle icon'></span></center>";
            colour = "class='nexos-txt-danger'";
          }

          $("#cuerpo_tabla").append(
            "<tr>" +
            "<td " +
            colour +
            ">" +
            s +
            "</td><td>" +
            data[m]["municipio"] +
            "</td><td>" +
            data[m]["nom_punto"] +
            "</td>" +
            "<td>" +
            data[m]["latitud"] +
            " / " +
            data[m]["longitud"] +
            "</td><td></td>" +
            "</tr>",
          );
        }
      }
    },
    "json",
  );
}

function actualizarNombreRuta() {
  const origenText = $('#origen_c option:selected').text().trim();
  const destinoText = $('#destino_c option:selected').text().trim();

  if (origenText && destinoText) {
    $('#p_planname').val(`${origenText} - ${destinoText}`);
  }
}

function AplicaFoco(idelemento) {
  $(idelemento).focus().css("background-color", "rgb(254,242,181)");
}

function RemueveFoco(idelemento) {
  $(idelemento).blur().css("background-color", "white");
}