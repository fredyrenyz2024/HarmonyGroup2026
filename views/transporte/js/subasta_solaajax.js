$(document).ready(function() {
  $('#contenedor_dato').css('display', 'none');
  $('#tabla_filtro').css('display', 'block');
  $('#seccion_placa').css('display', 'none');
  $('#seccion_ss').css('display', 'none');
  $('#filtro_subastaa').change(function() {
    let filtro = $('#filtro_subastaa').val();
    if (filtro === 'fecha') {
      $('#seccion_placa').css('display', 'none');
      $('#seccion_ss').css('display', 'none');
      $('#seccion_fecha').css('display', 'block');
    }
    if (filtro === 'placa') {
      $('#seccion_ss').css('display', 'none');
      $('#seccion_fecha').css('display', 'none');
      $('#seccion_placa').css('display', 'block');
    }
    if (filtro === 'ss') {
      $('#seccion_placa').css('display', 'none');
      $('#seccion_fecha').css('display', 'none');
      $('#seccion_ss').css('display', 'block');
    }
  });
  $('#buscar_datos').click(function() {
    consultar_tabla2();
  });
});

function consultar_tabla2() {
  $('#contenedor_dato').css('display', 'none');
  $('#tabla_filtro').css('display', 'block');
  $('#tbl_subasta').html('');
  var filtro = $('#filtro_subastaa').val();
  var finicio = $('#fec_incio').val();
  var ffinal = $('#fec_final').val();
  var placa = $('#placa').val();
  var sservicio = $('#sservicio').val();

  $.post(
    $('#id_url_ajax').val() + 'transporte/Consultasubasta2',
    'filtro=' + filtro + '&fi=' + finicio + '&ff=' + ffinal + '&placa=' + placa + '&servicio=' + sservicio,
    function(dato) {
      if (dato && dato[0].length > 0) {
        //tabla principal
        for (var i = 0; i < dato[0].length; i++) {
          var statu = '';
          var btn_ver = '';
          var btn_cancela = '';
          var btn_resultado = '';
          var boton = '';
          var placas_sub = '';
          var estado_subasta = '';

          if (dato[0][i].estado == 1) {
            if (dato[0][i].subasta_vencida === 1) {
              statu = '<td class="nexos-txt-success">' + '<center><span class="mdi mdi-dot-circle icon" title="Abierta"></span></center>' + '</td>';
              btn_cancela = `<button class="btn btn-space btn-danger btn-sm mdi mdi-close" title="Cancelar subasta" onClick="Validar_subasta(${dato[0][i].id});"></button>`;
              estado_subasta = '<span class="badge badge-danger float-right">Vencida</span>';
              boton = ``;
            } else {
              statu = '<td class="nexos-txt-success">' + '<center><span class="mdi mdi-dot-circle icon" title="Abierta"></span></center>' + '</td>';
              btn_cancela = `<button class="btn btn-space btn-danger btn-sm mdi mdi-close" title="Cancelar subasta" onClick="Validar_subasta(${dato[0][i].id});"></button>`;
              estado_subasta = '<span class="badge badge-primary float-right">Activa</span>';
            }

            // '<button class="btn btn-space btn-secondary btn-sm mdi mdi-close" title="Cancelar subasta" onClick="Validar_subasta(' +dato[0][i].id +');"></button>';
          } else if (dato[0][i].estado == 0) {
            statu = '<td class="nexos-txt-danger">' + '<center><span class="mdi mdi-dot-circle icon" title="Cerrada"></span></center>' + '</td>';
            estado_subasta = '<span class="badge badge-danger float-right">Cancelada</span>';
          } else if (dato[0][i].estado == 3) {
            statu = '<td class="nexos-txt-primary">' + '<center><span class="mdi mdi-dot-circle icon" title="Finalizada"></span></center>' + '</td>';
            estado_subasta = '<span class="badge badge-warning float-right">Finalizada</span>';
          }

          var fecha = moment().format('YYYY-MM-DD');
          var fec_fin_sub = dato[2][i].fecha_cargue;
          var cant = moment(fec_fin_sub).diff(fecha, 'hours');
          var estado_subasta_solicitud = cant >= 0 ? '<span class="badge badge-success float-right">Activa</span>' : '<span class="badge badge-danger float-right">Vencida</span>';

          // Calcular el estado para la subasta
          // var fecha_subasta = moment().format('YYYY-MM-DD');
          // var fecha_subasta = moment().format('YYYY-MM-DD HH:mm:ss');
          // var fec_sub = dato[0][i].fecha + '-' + dato[1][i].hora;
          // var fec_sub = dato[0][i].fecha + ' ' + '11:10:00';
          // var fec_sub = dato[0][i].fecha;
          // var cant_subasta = moment(fec_sub).diff(fecha_subasta, 'hours');
          // var cant_subasta = moment(fec_sub).diff(fecha_subasta, 'minutes');
          // var estado_subasta = cant_subasta >= 0 ? '<span class="badge badge-primary float-right">Activa</span>' : '<span class="badge badge-danger float-right">Vencida</span>';
          // var estado_subasta = cant_subasta != 0 ? '<span class="badge badge-primary float-right">Activa</span>' : '<span class="badge badge-danger float-right">Vencida</span>';

          var fecha_hora = moment().format('YYYY-MM-DD HH:mm:ss');
          var fec_fin_solicitud = dato[2][i].fecha_cargue + ' ' + dato[2][i].hora_cargue;
          var cant_vencimiento = moment(fec_fin_solicitud).diff(fecha_hora, 'minutes');

          // alert(cant_subasta);
          if (cant >= 0 && dato[0][i].estado != 3) {
            if (cant >= 0 && dato[0][i].estado == 0) {
              boton = ``;
            } else {
              if (cant_vencimiento - 15 > 0) {
                if (dato[0][i].subasta_vencida === 1) {
                  boton = ``;
                } else {
                  boton = `<button class="btn btn-space btn-success btn-sm mdi mdi-refresh-alt" title="Automatización" onClick="Calculo_Nuevo(this);" data-id="${dato[0][i]
                    .id}" data-id2="${finicio}" data-id3="${ffinal}" data-id4="${dato[0][i].estado}"></button>`;
                }
              } else {
                boton = ``;
                estado_subasta_solicitud = '<span class="badge badge-danger float-right">Fecha de cargue vencida</span>';
              }
            }
          }

          btn_ver = `<button class="btn btn-space btn-primary btn-sm mdi mdi-eye" title="Consultar" onClick="Ver_subasta_s(${dato[0][i].id});"></button>`;

          btn_resultado = `<button class="btn btn-space btn-warning btn-sm mdi mdi-label" title="Estudios seguridad"  onClick="Resultado(${dato[0][i].id});"></button>`;

          //placas
          var arrayplaca = [];
          for (var p = 0; p < dato[1].length; p++) {
            if (dato[0][i].id == dato[1][p].id_suba) {
              arrayplaca.push(dato[1][p].placa);
            }
          }
          var placas_acumuladas = arrayplaca.join(', ');

          // Solicitudes de servicio
          var array_solicitudes = [];

          for (let b = 0; b < dato[2].length; b++) {
            if (dato[0][i].id == dato[2][b].subasta_id) {
              array_solicitudes.push(dato[2][b].solicitud_servicio);
            }
          }
          var solicitudes_acumuladas = array_solicitudes.join(', ');

          $('#tbl_subasta').append(`
            <tr>
              ${statu}
              <td class="text-center">${dato[0][i].id}</td>
              <td class="text-center">
                ${dato[0][i].fecha_inicio} ${dato[0][i].hora_inicio}
                  <br>
                ${dato[0][i].fecha_finaliza} ${dato[0][i].hora_finaliza}
              </td>
              <td class="text-center">
                ${dato[0][i].usuario}
                <br>
                ${dato[0][i].fecha}
              </td>
              <td class="text-center"><span class="badge badge-secondary float-right">${solicitudes_acumuladas}</span></td>
              <td class="text-center"><span class="badge badge-secondary float-right">${placas_acumuladas}</span></td>
              <td class="text-center">${estado_subasta_solicitud}</td>
              <td class="text-center">${estado_subasta}</td>
              <td class="actions text-center" style="font-size: 10px; white-space: nowrap;">
                <div class="btn-group btn-group-xs" role="group">
                  ${btn_ver}
                  ${btn_cancela}
                  ${btn_resultado}
                  ${boton}
                </div>
              </td>
            </tr>
          `);
        }
      } else {
        $('#tbl_subasta').html('<tr colspan="7" class="text-center"><td>No hay datos</td></tr>');
      }
    },
    'json',
  );
}

function Ver_subasta_s(id) {
  $('#tabla_filtro').css('display', 'none');
  $('#contenedor_dato').css('display', 'block');
  $('.FP').hide();
  $('.FT').hide();
  $('.FM').hide();
  $('.mg_title').html('');
  $('.FP2').html('');
  $.post(
    $('#id_url_ajax').val() + 'transporte/Consulta_subasta_vs',
    'id_subasta=' + id,
    function(data) {
      if (data) {
        $('.mg_title').html('Solicitudes de servicio');
        for (var i = 0; i < data.length; i++) {
          $('.FP2').append('<span class="badge badge-dark">' + data[i]['numer_solservicio'] + '</span>');
        }
        Ver_subasta(id);
      }
    },
    'json',
  );
}

function Ver_subasta(id) {
  $('#tabla_filtro').css('display', 'none');
  $('#contenedor_dato').css('display', 'block');
  $('#tabla_placas').html('');
  $('.FP').show();
  $('.FT').hide();
  $('.FM').hide();
  $.post(
    $('#id_url_ajax').val() + 'transporte/Consulta_subasta_v',
    'id_subasta=' + id,
    function(data) {
      if (data) {
        for (var i = 0; i < data.length; i++) {
          let readonly = '';
          let boton;
          let tabla_placas = '';
          let campo_flete = '';
          if (data[i]['estado_flete'] == 'no_aprueba_flete_sac') {
            readonly = '';
            boton = '<button id="rta_sac" class="btn btn-xs mdi mdi-mail-send btn-primary"  onClick="rta_sac(' + i + ',' + id + ')"></button>';
            campo_flete = "<input type='text' id='fpro" + i + "' class='form-control input-xs' value='" + data[i]['flete_propuesto'] + "' onChange='calcula_flete(this," + i + " )' >";
          } else {
            readonly = 'readonly="readonly"';
            boton = '';
            campo_flete = "<input type='text' id='fpro" + i + "' class='form-control input-xs' value='" + data[i]['flete_propuesto'] + "' readonly  onChange='calcula_flete(this," + i + " )' >";
          }
          //boton='<button id="rta_sac" class="btn btn-xs mdi mdi-mail-send btn-primary"  onClick="rta_sac('+i+')"></button>';
          //calcular rentabilidad
          var tari = data[i]['tarifa_promedio'].replace(/,/g, '');
          var flete = data[i]['flete_propuesto'].replace(/,/g, '');
          let rent = parseFloat(tari) - parseFloat(flete);
          let calculo = parseFloat(rent) / parseFloat(tari);
          let res = parseFloat(calculo) * 100;
          let util = res.toFixed(2);
          tabla_placas = `
          <tr>
            <td>
              <input type='text' class='form-control input-xs' value="${data[i]['placa']} - ${data[i]['nombre_conductor']} - ${data[i]['num_estudioseguridad']}" readonly='readonly'>
              <input type='hidden' class='form-control input-xs text-center' value="${data[i]['num_estudioseguridad']}" readonly='readonly'>
              <input type='hidden' id='placa${i}' class='form-control input-xs text-center' value='${data[i]['placa']}' readonly='readonly'>
              <input type='hidden' class='form-control input-xs text-center' value='${data[i]['nombre_conductor']}' readonly='readonly'> 
            </td>
            <td>${campo_flete}</td>
            <td> <input type='text' id='fsu${i}' class='form-control input-xs' value='${data[i]['flete_sugerido']}' readonly='readonly'></td>
            <td> 
              <input type='text' class='form-control input-xs' style='font-weight:800; font-size:medium;' value='${data[i]['estado_flete']}' readonly='readonly'>
              <input type='hidden' id='subasta${i}' class='form-control input-xs' value='${data[i]['id']}' readonly='readonly'>
            </td>
            <td> 
              <input type='text' class='form-control input-xs' value='Sac_acepta flete("${data[i]['acepta_flete']}") Sac_tarifa('${data[i]['estado_sac']}')  Estado Final("${data[i][
            'estado_final'
          ]}")' readonly='readonly'>
              <input type='hidden' class='' id='tarif${i}' value='${data[i]['tarifa_promedio']}'>
              <input type='hidden' class='' id='rent${i}' value='${rent}'>
              <input type='hidden' class='' id='util${i}' value='${util}'>
              ${boton}
             </td>
             <td><input type='text' class='form-control input-xs' value='${data[i]['usuario']}' readonly='readonly'></td>
             <td><button class="btn btn-space btn-danger btn-xs" onClick="cancelar_vehiculo()"> <i class="icon icon-left mdi mdi-alert-circle"></i></button></td>
          </tr>
          `;

          //           tabla_placas =
          //             '<tr>' +
          //            /*  '<td> ' +
          //             "<input type='text' class='form-control input-xs' value='" +
          //             data[i]['placa'] +
          //             ' - ' +
          //             data[i]['nombre_conductor'] +
          //             ' - ' +
          //             data[i]['num_estudioseguridad'] +
          //             "' readonly='readonly'>" +
          //             "<input type='hidden' class='form-control input-xs text-center' value='" +
          //             data[i]['num_estudioseguridad'] +
          //             "' readonly='readonly'>" +
          //             "<input type='hidden' id='placa" +
          //             i +
          //             "'  class='form-control input-xs text-center' value='" +
          //             data[i]['placa'] +
          //             "' readonly='readonly'>" +
          //             "<input type='hidden' class='form-control input-xs text-center' value='" +
          //             data[i]['nombre_conductor'] +
          //             "' readonly='readonly'>  " +
          //             '</td>' + */
          //             // '<td>' +
          //             // campo_flete +
          //             // '</td>' +
          // /*             "<td> <input type='text' id='fsu" +
          //             i +
          //             "' class='form-control input-xs' value='" +
          //             data[i]['flete_sugerido'] +
          //             "' readonly='readonly'></td>" +
          //             "<td> <input type='text' class='form-control input-xs' style='font-weight:800; font-size:medium;' value='" +
          //             data[i]['estado_flete'] +
          //             "' readonly='readonly'>" +
          //             "<input type='hidden' id='subasta" +
          //             i +
          //             "' class='form-control input-xs' value='" +
          //             data[i]['id'] +
          //             "' readonly='readonly'>" +
          //             '</td>' + */
          //             // "<td> <input type='text' class='form-control input-xs' value='Sac_acepta flete(" +
          //             // data[i]['acepta_flete'] +
          //             // ')   Sac_tarifa(' +
          //             // data[i]['estado_sac'] +
          //             // ')  Estado Final(' +
          //             // data[i]['estado_final'] +
          //             // " )'  readonly='readonly'>" +
          //             // "<input type='hidden' class='' id='tarif" +
          //             // i +
          //             // "' value='" +
          //             // data[i]['tarifa_promedio'] +
          //             // "'>" +
          //             // "<input type='hidden' class='' id='rent" +
          //             // i +
          //             // "' value='" +
          //             // rent +
          //             // "'>" +
          //             // "<input type='hidden' class='' id='util" +
          //             // i +
          //             // "' value='" +
          //             // util +
          //             // "'>" +
          //             // boton +
          //             // '</td>' +
          //             // "<td><input type='text' class='form-control input-xs' value='" +
          //             // data[i]['usuario'] +
          //             // "' readonly='readonly'></td>" +
          //             // '</tr>';
          $('#tabla_placas').append(tabla_placas);
          $('#fsu' + i).val(parseFloat($('#fsu' + i).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#fpro' + i).val(parseFloat($('#fpro' + i).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        }
      }
    },
    'json',
  );
}

function calcula_flete(elem, id) {
  prop = $('#fpro' + id).val();
  tari = $('#tarif' + id).val();
  var tari = tari.replace(/,/g, '');
  var flete = prop.replace(/,/g, '');
  let rent = parseFloat(tari) - parseFloat(prop);
  let calculo = parseFloat(rent) / parseFloat(tari);
  let res = parseFloat(calculo) * 100;
  let util = res.toFixed(2);
  $('#rent' + id).val(rent);
  $('#util' + id).val(util);
}

function rta_sac(id, numsubasta) {
  prop = $('#fpro' + id).val().replace(/,/g, '');
  tari = $('#tarif' + id).val().replace(/,/g, '');
  rent = $('#rent' + id).val().replace(/,/g, '');
  util = $('#util' + id).val();
  sub = $('#subasta' + id).val();
  placa = $('#placa' + id).val();
  //guardar
  $.ajax({
    url: $('#id_url_ajax').val() + 'transporte/respuesta_operacion',
    method: 'POST',
    data: {subasta: sub, prop: prop, tari: tari, rent: rent, util: util, placa: placa, numsubasta: numsubasta},
    dataType: 'json',
    success: function(data) {
      if (data == 'true') {
        alert('Registro existosamente!!');
        consultar_tabla2();
      } else if (data == 'false') {
        alert('Registro existosamente!!');
        consultar_tabla2();
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function Validar_subasta(id) {
  //validar si la subasta tiene un flete aprobado
  // if (confirm('¿Seguro desea cancelar esta subasta?') == true) {}
  Swal.fire({
    title: '¿Estas seguro?',
    text: 'Desea cancelar esta subasta!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Cancelar Subasta',
    cancelButtonText: 'No, Cencelar',
    customClass: {
      popup: 'swal2-custom-font',
    },
  }).then(result => {
    if (result.isConfirmed) {
      $.post(
        $('#id_url_ajax').val() + 'transporte/Valide_subasta',
        'id_subasta=' + id,
        function(data) {
          var id_flete = data[0]['id_suba_flete'];
          var status = data[0]['estado'];
          var valor_sub = data[0]['id_suba'];
          if (id_flete > 0 || status == 'aprobado' || status == 'pendiente') {
            Cancelar_subasta(id_flete, valor_sub);
          } else {
            alert('Señor usuario esta subasta aún no tiene un flete Aprobado o Ganador');
          }
        },
        'json',
      );
    }
  });
}

function Cancelar_subasta(idflete, idsub) {
  $.post(
    $('#id_url_ajax').val() + 'transporte/Cancelar_subasta',
    'idflete=' + idflete + '&id_subasta=' + idsub,
    function(data) {
      if (data.success === true) {
        // alert('Subasta Finalizada Exitosamente!!');
        Swal.fire({
          title: 'Exito!',
          // text: 'Subasta Finalizada Exitosamente.',
          text: data.message,
          icon: 'success',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
        consultar_tabla2();
      } else if (data == 'false') {
        alert('Ha ocurrido un error!!');
      }
    },
    'json',
  );
}

function Resultado(idsub) {
  $.post(
    $('#id_url_ajax').val() + 'transporte/Estado_estudio',
    'id_subasta=' + idsub,
    function(data) {
      $('#cuerpo_estado').html('');
      $('.mg_title').html('');
      if (data) {
        $('.mg_title').html('Solicitudes de servicio');
        $('#tabla_filtro').css('display', 'none');
        $('#contenedor_dato').css('display', 'block');
        $('.FM').hide();
        $('.FP').hide();
        $('.FT').show();
        var body = '';
        for (var i = 0; i < data.length; i++) {
          body =
            '<tr>' +
            '<td>' +
            data[i]['id'] +
            '</td>' +
            '<td>' +
            data[i]['id_suba_servicio'] +
            '</td>' +
            '<td>' +
            data[i]['placa'] +
            '</td>' +
            '<td class="cell-detail">' +
            data[i]['nombre'] +
            '<span class="cell-detail-description">' +
            data[i]['numero_documento'] +
            '</span>' +
            '</td>' +
            '<td>' +
            data[i]['id_estudio'] +
            '</td>' +
            '<td>' +
            data[i]['estado'] +
            '</td>' +
            '</tr>';
          $('#cuerpo_estado').append(body);
        }
      }
    },
    'json',
  );
}

function Calcular(element) {
  $('#flete_ganador').val('');
  $('#id_fleteg').val('');
  $('#n_subasta').val('');
  $('#splaca').val('');
  $('#estadofle').val('');

  $('#cuerpo_calculo').html('');
  var elemento = $(element);
  var idsub = elemento.data('id');
  var finicio = elemento.data('id2');
  var ffin = elemento.data('id3');
  var estado = elemento.data('id4'); //estado de la subasta
  var e = '';
  var a;
  if (estado == 1) {
    //buscar todos los fletes propuestos para esa subasta con estudio APROBADO
    $.post(
      $('#id_url_ajax').val() + 'transporte/Consultar_fletes',
      'id_subasta=' + idsub,
      function(data) {
        $('#flete_ganador').val('');
        $('#id_fleteg').val('');
        if (data) {
          var cantidad = data.length;
          alert(cantidad);
          if (cantidad > 1) {
            //trae mas de un flete, comparar
            //encontrar el flete con la mayor cantidad de viajes

            var arreglo = new Array();
            for (var i = 0; i < data.length; i++) {
              arreglo.push(data[i]['cant_viajes']);
            }
            var maximo = Math.max.apply(Math, arreglo);

            for (var m = 0; m < data.length; m++) {
              if (data[m]['cant_viajes'] == maximo) {
                //FLETE FINALIZTA

                var fletepropuesto = data[m]['mfletepropuesto'];
                var flete_cotizado = data[m]['flete_sugerido'];
                var num_estudiosegu = data[m]['num_estudioseguridad'];
                var plak = data[m]['placa'];
                var idflete = data[m]['id_flete'];
                var idsuba = data[m]['id_suba'];
                //Validar si el flete finalizta es mayor o igual al flete cotizado
                if (fletepropuesto >= flete_cotizado) {
                  $.post(
                    $('#id_url_ajax').val() + 'transporte/Valida_Vigencia',
                    'num_estudio=' + num_estudiosegu + '&placa=' + plak,
                    function(data) {
                      if (data) {
                        //validar vigencia del estudio de seguridad
                        var fhoy = moment();
                        var tf = fhoy.diff(data[0]['fecha'], 'days');
                        if (data[0]['estado'] == 'Aprobado' && tf == 0) {
                          $('#flete_ganador').val(fletepropuesto);
                          $('#id_fleteg').val(idflete);
                          $('#n_subasta').val(idsuba);
                          $('#splaca').val(plak);
                          $('#estadofle').val('Ganador');
                          Actualiza_Flete();
                        } else {
                          alert('El estudio ' + num_estudiosegu + ' no es vigente');
                        }
                      }
                    },
                    'json',
                  );
                } else {
                  var tarifa_venta = data[m]['total_tarifa'];
                  var resta = parseFloat(tarifa_venta) - parseFloat(data[m]['mfletepropuesto']);
                  var calculo = parseFloat(resta) / parseFloat(fletepropuesto);
                  var res = parseFloat(calculo) * 100;

                  if (res >= 15) {
                    $.post(
                      $('#id_url_ajax').val() + 'transporte/Valida_Vigencia',
                      'num_estudio=' + num_estudiosegu + '&placa=' + plak,
                      function(data) {
                        if (data) {
                          var fhoy = moment();
                          var tf = fhoy.diff(data[0]['fecha'], 'days');
                          if (data[0]['estado'] == 'Aprobado' && tf == 0) {
                            $('#flete_ganador').val(fletepropuesto);
                            $('#id_fleteg').val(idflete);
                            $('#n_subasta').val(idsuba);
                            $('#splaca').val(plak);
                            $('#estadofle').val('Ganador');
                            Actualiza_Flete();
                            //ENVIO A ORDEN DE CARGUE
                          } else {
                            alert('El estudio ' + num_estudiosegu + ' no es vigente');
                          }
                        } else {
                          alert('No hay estudios de seguridad aprobados');
                        }
                      },
                      'json',
                    );
                  } else {
                    //bandeja de aprobacion gerencial-WILLIAM
                    $.post(
                      $('#id_url_ajax').val() + 'transporte/Valida_Vigencia',
                      'num_estudio=' + num_estudiosegu + '&placa=' + plak,
                      function(data) {
                        if (data) {
                          var fhoy = moment();
                          var tf = fhoy.diff(data[0]['fecha'], 'days');

                          if (data[0]['estado'] == 'Aprobado' && tf == 0) {
                            $('#flete_ganador').val(fletepropuesto);
                            $('#id_fleteg').val(idflete);
                            $('#n_subasta').val(idsuba);
                            $('#splaca').val(plak);
                            $('#estadofle').val('pendiente_aprobacion');
                            Actualiza_Flete();
                            //ENVIO BANDEJA DE GERENCIA
                          } else {
                            alert('El estudio ' + num_estudiosegu + ' no es vigente');
                          }
                        } else {
                          alert('No hay estudios de seguridad aprobados');
                        }
                      },
                      'json',
                    );
                  }
                } //cierre del else
              }
            }
            //fin
          }

          if (cantidad == 1) {
            //trae el valor mínimo

            //comparar el flete con el flete sugerido
            var tarifa_venta = data[0]['total_tarifa'];
            var idflete = data[0]['id_flete'];
            var idsuba = data[0]['id_suba'];
            var num_estudiosegu = data[0]['num_estudioseguridad'];
            var plak = data[0]['placa'];
            var fletepropuesto = parseFloat(data[0]['mfletepropuesto']);
            var fletecotizado = parseFloat(data[0]['flete_sugerido']);
            alert(tarifa_venta);
            if (fletepropuesto <= fletecotizado) {
              //validar vigencia del estudio de seguridad
              $.post(
                $('#id_url_ajax').val() + 'transporte/Valida_Vigencia',
                'num_estudio=' + num_estudiosegu + '&placa=' + plak,
                function(data) {
                  if (data) {
                    var fhoy = moment();
                    var tf = fhoy.diff(data[0]['fecha'], 'days');
                    if (data[0]['estado'] == 'Aprobado' && tf == 0) {
                      $('#flete_ganador').val(fletepropuesto);
                      $('#id_fleteg').val(idflete);
                      $('#n_subasta').val(idsuba);
                      $('#splaca').val(plak);
                      $('#estadofle').val('Ganador');
                      Actualiza_Flete();
                    } else {
                      alert('El estudio ' + num_estudiosegu + ' no es vigente');
                    }
                  } else {
                    alert('No hay estudios de seguridad aprobados');
                  }
                },
                'json',
              );
            } else {
              //FLETE OPERACIONES ES MAYOR AL FLETE COTIZACIONES
              //calcular la rentabilidad

              var resta = parseFloat(tarifa_venta) - parseFloat(data[0]['mfletepropuesto']);
              var calculo = parseFloat(resta) / parseFloat(fletepropuesto);
              var res = parseFloat(calculo) * 100;
              if (res >= 15) {
                $.post(
                  $('#id_url_ajax').val() + 'transporte/Valida_Vigencia',
                  'num_estudio=' + num_estudiosegu + '&placa=' + plak,
                  function(data) {
                    if (data) {
                      var fhoy = moment();
                      var tf = fhoy.diff(data[0]['fecha'], 'days');
                      if (data[0]['estado'] == 'Aprobado' && tf == 0) {
                        $('#flete_ganador').val(fletepropuesto);
                        $('#id_fleteg').val(idflete);
                        $('#n_subasta').val(idsuba);
                        $('#splaca').val(plak);
                        $('#estadofle').val('Ganador');
                        Actualiza_Flete();
                        //ENVIO A ORDEN DE CARGUE
                      } else {
                        alert('El estudio ' + num_estudiosegu + ' no es vigente');
                      }
                    } else {
                      alert('No hay estudios de seguridad aprobados');
                    }
                  },
                  'json',
                );
              } else {
                //bandeja de aprobacion gerencial-WILLIAM
                $.post(
                  $('#id_url_ajax').val() + 'transporte/Valida_Vigencia',
                  'num_estudio=' + num_estudiosegu + '&placa=' + plak,
                  function(data) {
                    if (data) {
                      var fhoy = moment();
                      var tf = fhoy.diff(data[0]['fecha'], 'days');

                      if (data[0]['estado'] == 'Aprobado' && tf == 0) {
                        $('#flete_ganador').val(fletepropuesto);
                        $('#id_fleteg').val(idflete);
                        $('#n_subasta').val(idsuba);
                        $('#splaca').val(plak);
                        $('#estadofle').val('pendiente_aprobacion');
                        Actualiza_Flete();
                        //ENVIO BANDEJA DE GERENCIA
                      } else {
                        alert('El estudio ' + num_estudiosegu + ' no es vigente');
                      }
                    } else {
                      alert('No hay estudios de seguridad aprobados');
                    }
                  },
                  'json',
                );
              }
            }
          }
        }
      },
      'json',
    );
    a = 'Class="text-success"';
    e = 'Activo';
  }
  if (estado == 0) {
    a = 'Class="text-danger"';
    e = 'Cancelado';
  }
  if (estado == 3) {
    a = 'Class="text-primary"';
    e = 'Terminada';
  }
  $('#tabla_filtro').css('display', 'none');
  $('#contenedor_dato').css('display', 'block');
  $('.FP').hide();
  $('.FT').hide();
  $('.FM').show();
  var tabla = '<tr>' + '<td>' + idsub + '</td>' + '<td>' + finicio + '</td>' + '<td>' + finicio + '</td>' + '<td ' + a + '>' + e + '</td>' + '</tr>';
  $('#cuerpo_calculo').append(tabla);
}

function Calculo_Nuevo(element) {
  if (confirm('¿Desea efectuar esta subasta?') == true) {
    $('#contenedor_dato').css('display', 'block');
    $('#tabla_filtro').css('display', 'none');
    $('.FP').hide();
    $('.FT').hide();
    $('.FM').show();
    var elemento = $(element);
    var idsub = elemento.data('id');
    var finicio = elemento.data('id2');
    var ffin = elemento.data('id3');
    var estado = elemento.data('id4');
    var fecha_actual = moment().format('YYYY-MM-DD hh:mm:ss');
    //alert(ffin);
    //alert(fecha_actual);
    //if(ffin > fecha_actual){//SUBASTA VIGENTE
    //if(ffin == fecha_actual){
    if (estado == 1) {
      a = 'Class="text-success"';
      e = 'Activo';
    }
    if (estado == 0) {
      a = 'Class="text-danger"';
      e = 'Cancelado';
    }
    if (estado == 3) {
      a = 'Class="text-primary"';
      e = 'Terminada';
    }
    var tabla = '<tr>' + '<td>' + idsub + '</td>' + '<td>' + finicio + '</td>' + '<td>' + finicio + '</td>' + '<td ' + a + '>' + e + '</td>' + '</tr>';
    $('#cuerpo_calculo').append(tabla);
    //CONSULTA TODOS LOS VEHÍCULOS QUE ENTRAN EN LA SUBASTA
    $.post(
      $('#id_url_ajax').val() + 'transporte/Estado_estudio',
      'id_subasta=' + idsub,
      function(data) {
        $('#cuerpo_estado2').html('');
        if (data) {
          var body = '';
          for (var i = 0; i < data.length; i++) {
            let valor = parseFloat(data[i]['flete_propuesto'], 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString();

            if (data[i]['estado'] == 'Aprobado') {
              estad = 'class="text-success';
              fila = 'success';
            } else {
              estad = 'class="text-success"';
              fila = '';
            }
            body =
              '<tr class="' +
              fila +
              '">' +
              '<td>' +
              data[i]['id_suba_servicio'] +
              '</td>' +
              '<td>' +
              data[i]['placa'] +
              '</td>' +
              '<td class="cell-detail">' +
              data[i]['nombre'] +
              '<span class="cell-detail-description">' +
              data[i]['numero_documento'] +
              '</span>' +
              '</td>' +
              '<td>' +
              data[i]['id_estudio'] +
              '</td>' +
              '<td>' +
              valor +
              '</td>' +
              '<td>' +
              data[i]['estado'] +
              '</td></tr>';
            $('#cuerpo_estado2').append(body);
          }
        }
      },
      'json',
    );
    //CONSULTA EL MENOR FLETE PROPUESTO
    $.post(
      $('#id_url_ajax').val() + 'transporte/Consultar_fletes',
      'id_subasta=' + idsub,
      function(data) {
        if (data) {
          var cantidad = data.length;
          if (cantidad > 1) {
            //trae varios fletes
            //validar el vehiculo con mayor cantidad de viaje
            var arreglo = new Array();
            for (var i = 0; i < data.length; i++) {
              arreglo.push(data[i]['cant_viajes']);
            }
            var maximo = Math.max.apply(Math, arreglo);
            for (var m = 0; m < data.length; m++) {
              if (data[m]['cant_viajes'] == maximo) {
                var fecha_estudio = data[m]['fecha'];
                var fhoy = moment();
                var tf = fhoy.diff(fecha_estudio, 'hour');
                //var horas_estudio = Buscar_Regla();
                var horas_estudio = 60;
                if (parseInt(tf) <= parseInt(horas_estudio)) {
                  //Validar vigencia estudio seguridad
                  var fpro = data[0]['mfletepropuesto'].replace(/,/g, '');
                  var fsug = data[0]['flete_sugerido'].replace(/,/g, '');
                  var fletepropuesto = fpro;
                  var flete_cotizado = fsug;
                  var num_estudiosegu = data[m]['num_estudioseguridad'];
                  var plak = data[m]['placa'];
                  var idflete = data[m]['id_flete'];
                  var idsuba = data[m]['id_suba'];
                  var tarifa_venta = data[m]['total_tarifa'].replace(/,/g, '');
                  var resta = parseFloat(tarifa_venta) - parseFloat(fpro);
                  var calculo = parseFloat(resta) / parseFloat(fletepropuesto);
                  var res = parseFloat(calculo) * 100;
                  if (fletepropuesto <= fletecotizado) {
                    $('#flete_ganador').val(fletepropuesto);
                    $('#id_fleteg').val(idflete);
                    $('#n_subasta').val(idsuba);
                    $('#splaca').val(plak);
                    if (parseFloat(res) >= parseFloat(15)) {
                      $('#estadofle').val('Ganador');
                    } else {
                      $('#estadofle').val('pendiente_aprobacion');
                    }
                    Actualiza_Flete();
                  } else {
                    $('#flete_ganador').val(fletepropuesto);
                    $('#id_fleteg').val(idflete);
                    $('#n_subasta').val(idsuba);
                    $('#splaca').val(plak);
                    $('#estadofle').val('pendiente_aprobacion');
                    Actualiza_Flete();
                  }
                } else {
                  //El estudio supero el tiempo de vigencia,
                  //SE PODRIA ESCOGER EN VEHICULO ANTECESOR DE E GANADOR
                  alert('el vehículo con flete ganador ' + data[0]['num_estudioseguridad'] + ' supero el tiempo de vigencia del estudio de seguridad');
                }
              } //cierre de el maximo numero cantidad de viajes
            }
          }
          if (cantidad == 1) {
            //trae el valor mínimo
            //validar la vigencia de los estudios
            var fecha_estudio = data[0]['fecha'];
            var fhoy = moment();
            var tf = fhoy.diff(fecha_estudio, 'hour');
            //var horas_estudio = Buscar_Regla();
            var horas_estudio = 60;
            if (parseInt(tf) <= parseInt(horas_estudio)) {
              //EL flete esta dentro del tiempo de vigencia del estudio
              var fpro = data[0]['mfletepropuesto'].replace(/,/g, '');
              var fsug = data[0]['flete_sugerido'].replace(/,/g, '');
              var fletepropuesto = parseFloat(fpro);
              var fletecotizado = parseFloat(fsug);
              var tarifa_venta = data[0]['total_tarifa'].replace(/,/g, '');
              var idflete = data[0]['id_flete'];
              var idsuba = data[0]['id_suba'];
              var num_estudiosegu = data[0]['num_estudioseguridad'];
              var plak = data[0]['placa'];
              var resta = parseFloat(tarifa_venta) - parseFloat(data[0]['mfletepropuesto']);
              var calculo = parseFloat(resta) / parseFloat(fletepropuesto);
              var res = parseFloat(calculo) * 100; //valor de  la rentabilidad
              if (fletepropuesto <= fletecotizado) {
                //Flete propuesto es menor al flete cotizado
                $('#flete_ganador').val(data[0]['mfletepropuesto']);
                $('#id_fleteg').val(idflete);
                $('#n_subasta').val(idsuba);
                $('#splaca').val(plak);
                if (parseFloat(res) >= parseFloat(15)) {
                  $('#estadofle').val('Ganador');
                } else {
                  $('#estadofle').val('pendiente_aprobacion');
                }
                Actualiza_Flete();
              } else {
                //Flete propuesto operaciones es mayor al flete cotizado
                //calcula rentabilidad
                $('#flete_ganador').val(data[0]['mfletepropuesto']);
                $('#id_fleteg').val(idflete);
                $('#n_subasta').val(idsuba);
                $('#splaca').val(plak);
                $('#estadofle').val('pendiente_aprobacion');
                Actualiza_Flete();
              }
            } else {
              //El estudio supero el tiempo de vigencia
              alert('el vehículo con flete ganador ' + data[0]['num_estudioseguridad'] + ' supero el tiempo de vigencia del estudio de seguridad');
            }
          }
        }
      },
      'json',
    );
  }
}

function Actualiza_Flete() {
  //FLETE GANADOR
  var fg = $('#flete_ganador').val();
  var idflete = $('#id_fleteg').val();
  var idsub = $('#n_subasta').val();
  var estado = $('#estadofle').val();
  var placa = $('#splaca').val();
  $.post(
    $('#id_url_ajax').val() + 'transporte/Actualiza_Subasta',
    'id_subasta=' + idsub + '&id_flete=' + idflete + '&statu=' + estado + '&placa=' + placa,
    function(data) {
      if (data == true) {
        alert('Datos Ganados!!');
        //Calcular();
        //Calculo_Nuevo();
      }
    },
    'json',
  );
}

function Buscar_Regla() {
  $.post(
    $('#id_url_ajax').val() + 'transporte/Consultar_Regla',
    function(data) {
      if (data) {
        var respuesta = data['valor'];
        return respuesta;
      }
    },
    'json',
  );
}
