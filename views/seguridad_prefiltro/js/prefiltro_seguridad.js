// import {Retransmitir_Dato_Ministerio} from '../../../public/helpers/helper.js';
const d = document;
const w = window;
let num_solicitud = '';

d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();

  var prefiltro = d.getElementById('prefiltro_seguridad');
  var estudio = d.getElementById('estudio_seguridad_id');
  // Almacena el HTML original de la tabla al cargar la página
  let originalTableHTML = document.getElementById('tbl_recursos_sistema').innerHTML;
  // Guarda el valor por defecto del select
  const defaultSelectValue = document.getElementById('estado_estu').value;
  setInterval(() => {
    if (prefiltro.checked || estudio.checked) {
      Litar_solicitudes();
      // alert('hola mundo nuevo');
    } else {
      console.log('El radio button no está marcado.');
    }
  }, 120000);

  $('#content_vehiculo').hide();
  $('#content_conductor').hide();
  $('#content_risk').hide();
  $('#select_option').hide();
  $('#title').hide();
  $('#recoger_trailer').hide();
  $('#recoger_trailer2').hide();
  $('#divdatopreestudio').hide();

  d.addEventListener('click', async e => {
    const radioButtons = d.getElementsByName('operacion');

    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        const valorSeleccionado = radioButton.value;
        if (valorSeleccionado === 'prefiltro_seguridad') {
          d.querySelector('.campos').style.display = 'Block';
          d.getElementById('list_prefiltro').style.display = 'Block';
          d.getElementById('list_estudio_seguridad').style.display = 'none';
        } else {
          d.querySelector('.campos').style.display = 'Block';
          d.getElementById('list_prefiltro').style.display = 'none';
          d.getElementById('list_estudio_seguridad').style.display = 'Block';
        }
        break;
        // No es necesario seguir buscando una vez que se encuentra el seleccionado
      }
    }

    if (e.target.matches('#consulta_solicitudes') || e.target.matches('#consulta_solicitudes *')) {
      if (d.getElementById('estadotb').value === 'Placa_e') {
        if (d.getElementById('placa_filtro').value === '') {
          // alert('Campo placa no debe estar vacio');
          d.getElementById('mensaje_validacion').innerHTML = 'Campo placa no debe estar vacio';
          $('#md-footer-warning').modal('show');
        } else {
          Litar_solicitudes();
        }
      } else {
        Litar_solicitudes();
      }
    }

    // if (e.target.matches('#iniciacion_preestudio') || e.target.matches('#iniciacion_preestudio *')) {
    //   let padre = e.target.parentElement.parentElement;
    //   let solicitud_id = padre.querySelector('#solicitud_id').value;
    //   let vehiculo_id = padre.querySelector('#vehiculo_id').value;

    //   let data = new FormData();
    //   data.append('solicitud_id', solicitud_id);
    //   fetch($('#id_url_ajax').val() + 'validacionparametros/Validar_inicio_prefiltro', {
    //     method: 'POST',
    //     cache: 'no-cache',
    //     body: data,
    //   })
    //     .then(response => response.json())
    //     .then(function (data) {
    //       if (data) {
    //         Litar_solicitudes();
    //         consultarvehiculo(solicitud_id, vehiculo_id);
    //       } else {
    //         alert('Error de operación');
    //       }
    //     })
    //     .catch(error => {
    //       alert(error);
    //     });
    // }

    // Boton de ver informacion de prefiltro de seguirdad
    // if (e.target.matches('#btn_ver') || e.target.matches('#btn_ver *')) {
    //   let padre = e.target.parentElement.parentElement;
    //   let solicitud_id = padre.querySelector('.soli_id').value;
    //   let preestudio_id = padre.querySelector('.pre_id').value;
    //   // var boton = d.getElementById("btn_ver");
    //   let preestudio = padre.getAttribute('data-id');
    //   let solicitud = padre.getAttribute('data-id2');
    //   let estado = padre.getAttribute('data-id3');
    //   //  $('#tbl_datos_prefiltro').html('');
    //   if (estado === 'pendiente_iniciar') {
    //     d.getElementById('estado_ver_seguridad').innerHTML = 'Estado: ' + 'Peniente de Iniciar';
    //   }
    //   let data = new FormData();
    //   data.append('preestudio', preestudio_id);
    //   data.append('solicitud', solicitud_id);
    //   fetch($('#id_url_ajax').val() + 'validacionparametros/Ver_Seguridad', {
    //     method: 'POST',
    //     cache: 'no-cache',
    //     body: data,
    //   })
    //     .then(response => response.json())
    //     .then(function (data) {
    //       $('#consulta_referencia').html('');
    //       $('#consulta_referencia').html('');

    //       if (data) {
    //         $('#vid').html(data.ver_seguridad.id);
    //         $('#vplaca').html(data.ver_seguridad.placa + ' - ' + data.ver_seguridad.placa_trailer);
    //         $('#vconse').html(data.ver_seguridad.id_preestudio);
    //         $('#vfecha').html(data.ver_seguridad.fecha);
    //         $('#vhora').html(data.ver_seguridad.hora);
    //         $('#vuser').html(data.ver_seguridad.usuario);
    //         if (data.ver_seguridad.documento_propietario === data.ver_seguridad.Propietario) {
    //           $('#vpropi').html(data.ver_seguridad.nombre_propietario);
    //           //  $('#vpropi').css('backgroundColor', #A5D6A7');
    //           $('#vpropi').css('backgroundColor', '#A5D6A7');
    //           $('#vpropi').css('Color', '#FFFFFF');
    //           $('#vpdocumento').css('backgroundColor', '#A5D6A7');
    //           $('#vpdocumento').css('Color', '#FFFFFF');
    //           $('#vpdocumento').html(data.ver_seguridad.documento_propietario);
    //           $('#estado_tercero_propietario').html('<i class="fas fa-user-check"></i> Tercero Creado');
    //           $('#estado_tercero_propietario').css('backgroundColor', '#A5D6A7');
    //         } else {
    //           $('#estado_tercero_propietario').html('<i class="fas fa-user-times"></i> Tercero Pendiente');
    //           $('#estado_tercero_propietario').css('backgroundColor', '#FFFFFF');
    //           $('#vpropi').css('backgroundColor', '#FFFFFF');
    //           $('#vpropi').css('Color', '#000000');
    //           $('#vpdocumento').css('backgroundColor', '#FFFFFF');
    //           $('#vpdocumento').css('Color', '#000000');
    //           $('#vpropi').html(data.ver_seguridad.nombre_propietario);
    //           $('#vpdocumento').html(data.ver_seguridad.documento_propietario);
    //         }

    //         if (data.ver_seguridad.documento_tenedor === data.ver_seguridad.Poseedor) {
    //           $('#vtene').html(data.ver_seguridad.nombre_tenedor);
    //           $('#vtene').css('backgroundColor', '#A5D6A7');
    //           $('#vtene').css('Color', '#FFFFFF');
    //           $('#vtdocumento').css('backgroundColor', '#A5D6A7');
    //           $('#vtdocumento').css('Color', '#FFFFFF');
    //           $('#vtdocumento').html(data.ver_seguridad.documento_tenedor);
    //           $('#estado_tercero_poseedor').html('<i class="fas fa-user-check"></i> Tercero Creado');
    //           $('#estado_tercero_poseedor').css('backgroundColor', '#A5D6A7');
    //         } else {
    //           $('#estado_tercero_poseedor').html('<i class="fas fa-user-times"></i> Tercero Pendiente');
    //           $('#estado_tercero_poseedor').css('backgroundColor', '#FFFFFF');
    //           $('#vtene').css('backgroundColor', '#FFFFFF');
    //           $('#vtene').css('Color', '#000000');
    //           $('#vtdocumento').css('backgroundColor', '#FFFFFF');
    //           $('#vtdocumento').css('Color', '#000000');
    //           $('#vtene').html(data.ver_seguridad.nombre_tenedor);
    //           $('#vtdocumento').html(data.ver_seguridad.documento_tenedor);
    //         }

    //         if (data.ver_seguridad.documento_conductor === data.ver_seguridad.Conductor) {
    //           $('#vcondu').html(data.ver_seguridad.nombre_conductor);
    //           $('#vcondu').css('backgroundColor', '#A5D6A7');
    //           $('#vcondu').css('Color', '#FFFFFF');
    //           $('#vcdocumento').css('backgroundColor', '#A5D6A7');
    //           $('#vcdocumento').css('Color', '#FFFFFF');
    //           $('#vcdocumento').html(data.ver_seguridad.documento_conductor);
    //           $('#estado_tercero_conductor').html('<i class="fas fa-user-check"></i> Tercero Creado');
    //           $('#estado_tercero_conductor').css('backgroundColor', '#A5D6A7');
    //         } else {
    //           $('#estado_tercero_conductor').html('<i class="fas fa-user-times"></i> Tercero Pendiente');
    //           $('#estado_tercero_conductor').css('backgroundColor', '#FFFFFF');
    //           $('#vcondu').css('backgroundColor', '#FFFFFF');
    //           $('#vcondu').css('Color', '#000000');
    //           $('#vcdocumento').css('backgroundColor', '#FFFFFF');
    //           $('#vcdocumento').css('Color', '#000000');
    //           $('#vcondu').html(data.ver_seguridad.nombre_conductor);
    //           $('#vcdocumento').html(data.ver_seguridad.documento_conductor);
    //         }

    //         if (data.ver_seguridad.documento_propietario_trailer === '') {
    //           $('#ptcondu').css('backgroundColor', '#FFFFFF');
    //           $('#ptcondu').css('Color', '#000000');
    //           $('#ptcdocumento').css('backgroundColor', '#FFFFFF');
    //           $('#ptcdocumento').css('Color', '#000000');
    //           $('#ptcondu').html('');
    //           $('#ptcdocumento').html('');
    //           $('#estado_tercero_pro_trailer').html('');
    //           $('#estado_tercero_pro_trailer').css('backgroundColor', '#FFFFFF');
    //         } else {
    //           if (data.ver_seguridad.documento_propietario_trailer === data.ver_seguridad.Propietario_Trailer) {
    //             $('#ptcondu').html(data.ver_seguridad.nombre_propietario_trailer);
    //             $('#ptcondu').css('backgroundColor', '#A5D6A7');
    //             $('#ptcondu').css('Color', '#FFFFFF');
    //             $('#ptcdocumento').css('backgroundColor', '#A5D6A7');
    //             $('#ptcdocumento').css('Color', '#FFFFFF');
    //             $('#ptcdocumento').html(data.ver_seguridad.documento_propietario_trailer);
    //             $('#estado_tercero_pro_trailer').html('<i class="fas fa-user-check"></i> Tercero Creado');
    //             $('#estado_tercero_pro_trailer').css('backgroundColor', '#A5D6A7');
    //           } else {
    //             $('#ptcondu').css('backgroundColor', '#FFFFFF');
    //             $('#ptcondu').css('Color', '#000000');
    //             $('#ptcdocumento').css('backgroundColor', '#FFFFFF');
    //             $('#ptcdocumento').css('Color', '#000000');
    //             $('#ptcondu').html(data.ver_seguridad.nombre_propietario_trailer);
    //             $('#ptcdocumento').html(data.ver_seguridad.documento_propietario_trailer);
    //             $('#estado_tercero_pro_trailer').html('<i class="fas fa-user-times"></i> Tercero Pendiente');
    //             $('#estado_tercero_pro_trailer').css('backgroundColor', '#FFFFFF');
    //           }
    //         }

    //         $('#vweb').html(data.ver_seguridad.web_satelital);
    //         $('#vwuser').html(data.ver_seguridad.usuario_satelital);
    //         $('#vwclave').html(data.ver_seguridad.clave_satelital);

    //         /* Observaciones operaciones */
    //         d.getElementById('observacion_operaciones').value = data.ver_seguridad.observacion;

    //         // Listar Referencias
    //         if (data.resultado_referencias) {
    //           data.resultado_referencias.forEach(function (element) {
    //             $('#consulta_referencia').append(
    //               `<tr>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.nombre_empresa}</td>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.fecha_ingreso}</td>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.fecha_retiro}</td>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.persona_contacto}</td>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.celular}</td>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.cargo}</td>
    //               </tr>`,
    //             );
    //           });
    //         } else {
    //           $('#consulta_referencia').append(
    //             `<tr>
    //             <td></td>
    //             <td></td>
    //             <td>No hay Referencias</td>
    //             <td></td>
    //             <td></td>
    //             <td></td>
    //           </tr>`,
    //           );
    //         }

    //         $('#consulta_servicio').html('');
    //         if (data.resultado_preestudio) {
    //           data.resultado_preestudio.forEach(function (element) {
    //             $('#consulta_servicio').append(
    //               `<tr>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.nundoc_solicitud}</td>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.nombre_cliente}</td>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;" colspan="2"> <b>Origen:</b> ${element.orige}    <b >Destino:</b> ${element.dest}</td>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.peso_kg} / ${element.tipo_vehiculo}</td>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.usuario_auditor}</td>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.fecha} - ${element.hora}</td>
    //                </tr>`,
    //             );
    //             d.getElementById('observacion_servicio_cliente').value = element.observaciones;
    //           });
    //           /* Datos del contenedor para la solicitud */
    //           $('#datos_contenedor').html('');
    //           if (data.nombre_contenedor != '' && Array.isArray(data.nombre_contenedor)) {
    //             data.nombre_contenedor.forEach(function (contenedor) {
    //               $('#datos_contenedor').append(
    //                 `<tr>
    //                   <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${contenedor.devol_numcont}</td>
    //                   <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${data.nombre_contenedor}</td>
    //                   <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${contenedor.devol_dias}</td>
    //                   <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${contenedor.devolucion_contenedor}</td>
    //                   <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${contenedor.devol_direccion}</td>
    //                  </tr>`,
    //               );
    //             });
    //           } else {
    //             $('#datos_contenedor').append(
    //               `<tr>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;" colspan='5'>No tiene contendor</td>
    //                </tr>`,
    //             );
    //           }
    //         }

    //         $('#consulta_documentos').html('');
    //         if (data.resultado_documentos) {
    //           data.resultado_documentos.forEach(function (element, index) {
    //             $('#consulta_documentos').append(
    //               `<tr>
    //               <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.tipo_hv}</td>
    //               <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.clase}</td>
    //               <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;"> <a href="#" onclick="abrir_fotos('${element.ruta}' , '${element.nombre_archivo}')" class="cell-detail hint--top-left" data-hint="">
    //               <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="Documento"></span>
    //               </a></td>
    //               <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.usuario}</td>
    //               <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.fecha} - ${element.hora}</td>
    //             </tr>
    //             `,
    //             );
    //           });
    //         }

    //         $('#tbl_observaciones').html('');
    //         if (data.resultado_observacion) {
    //           data.resultado_observacion.forEach(function (element, index) {
    //             $('#tbl_observaciones').append(
    //               `<tr>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.id}</td>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px;">${element.observacion}</td>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.fecha}-${element.hora}</td>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.usuario}</td>
    //               </tr>
    //             `,
    //             );
    //           });
    //         }
    //       } else {
    //         alert('Error de operación');
    //       }
    //     })
    //     .catch(error => {
    //       alert(error);
    //     });

    //   // alert("Solicitud: " + solicitud_id + " -- " + "Prefiltllro: " + pree + " -- " + "Solicitid 2: " + soli + " -- " + " Estado: " + estado);
    // }

    /* Prefiltro de nuevo recurso para actualizar */
    // if (e.target.matches('#btn_listado_nuevo') || e.target.matches('#btn_listado_nuevo *')) {
    //   let padre = e.target.parentElement.parentElement;
    //   let solicitud_id = padre.querySelector('.soli_id').value;
    //   d.getElementById('num_solicitud_prefiltro_nuevo').value = solicitud_id;
    //   let placa = padre.querySelector('.pla_id').value;
    //   d.getElementById('plac_solicitud_prefiltro_nuevo').value = placa;
    //   Listar_datos_prefiltro_nuevo_recurso(solicitud_id, placa);
    // }

    /* Guardar estudio de prefiltro de nuevo rescurso para actualizar */
    // if (e.target.matches('#btn_guardar_prefiltro_nuevo') || e.target.matches('#btn_guardar_prefiltro_nuevo *')) {
    //   let padre = e.target.parentElement.parentElement;
    //   let solicitudId = padre.querySelector('#num_solicitud_prefiltro_nuevo').value;
    //   let plac = padre.querySelector('#plac_solicitud_prefiltro_nuevo').value;

    //   if (w.confirm('¿Esta seguro de realizar la operación para el prefriltro?')) {
    //     if (d.getElementById('estado_prefiltro_nuevo').value === '') {
    //       mensaje = `
    //       <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
    //           <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //           <div class="message">
    //             <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //             <strong>Mensaje!</strong> Debes seleccionar un estado para poder guardar el prefiltro
    //           </div>
    //       </div>`;
    //       d.getElementById('historicos').innerHTML = mensaje;
    //       $('.modal-body').animate({ scrollTop: 0 }, 600);
    //     } else {
    //       let formdata = new FormData();
    //       formdata.append('solicitud_id', padre.querySelector('#num_solicitud_prefiltro_nuevo').value);
    //       formdata.append('estado', d.getElementById('estado_prefiltro_nuevo').value);
    //       formdata.append('observacion', d.getElementById('observacion_prefiltro_nuevo').value);
    //       formdata.append('placa', padre.querySelector('#plac_solicitud_prefiltro_nuevo').value);
    //       await fetch($('#id_url_ajax').val() + 'validacionparametros/Guardar_prefiltro_nuevo', {
    //         method: 'POST',
    //         cache: 'no-cache',
    //         body: formdata,
    //       })
    //         .then(response => response.json())
    //         .then(function (data) {
    //           if (data) {
    //             if (data.numero === 200) {
    //               notificacion = `
    //               <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
    //                   <div class="icon"><i class="fas fa-check"></i></div>
    //                   <div class="message">
    //                     <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                     <strong>Mensaje!</strong> ${data.mensaje}
    //                   </div>
    //               </div>`;
    //               d.getElementById('historicos').innerHTML = notificacion;
    //               $('.modal-body').animate({ scrollTop: 0 }, 600);
    //               Listar_datos_prefiltro_nuevo_recurso(solicitudId, plac);
    //             } else {
    //               notificacion = `
    //               <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //                   <div class="icon"><i class="fas fa-times"></i></div>
    //                   <div class="message">
    //                     <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                     <strong>Mensaje!</strong> ${mensaje}
    //                   </div>
    //               </div>`;
    //               d.getElementById('historicos').innerHTML = notificacion;
    //               $('.modal-body').animate({ scrollTop: 0 }, 600);
    //             }
    //           } else {
    //             alert('Error de operación');
    //           }
    //         })
    //         .catch(error => {
    //           alert(error);
    //         });
    //     }
    //   }
    // }

    if (e.target.matches('#btn-lista') | e.target.matches('#btn-lista *')) {
      let padre = e.target.parentElement.parentElement;
      let solicitud_id = padre.querySelector('.soli_id').value;
      let preestudio_id = padre.querySelector('.pre_id').value;
      let placa = padre.querySelector('.placa_id').value;
      num_solicitud = solicitud_id;
      // Pasar id
      d.getElementById('solicitud_id').value = solicitud_id;
      d.getElementById('vehiculo_id').value = solicitud_id;
      console.log(placa);
      $('#iniciaprefiltro').show();
      let formdata = new FormData();
      formdata.append('preestudio_id', preestudio_id);
      formdata.append('solicitud_id', solicitud_id);
      fetch($('#id_url_ajax').val() + 'validacionparametros/Validar_prefriltro', {
        method: 'POST',
        cache: 'no-cache',
        body: formdata,
      })
        .then(response => response.json())
        .then(function (data) {
          if (data) {
            var estado = data.estado;
            if (estado === 'iniciado' || estado === 'pendiente' /* || estado === 'aprobado' */) {
              consultarvehiculo(solicitud_id, preestudio_id, estado);
              // traer_soli(id_solicitud, id_vpreestudio, placa, estado);
            } else if (estado === 'pendiente_iniciar' || estado === 'rechazado para modificar') {
              traer_soli(solicitud_id, preestudio_id, placa, estado);
            }
          } else {
            alert('Error de operación');
          }
        })
        .catch(error => {
          alert(error);
        });
    }

    // if (e.target.matches('#enviar_seguridad') || e.target.matches('#enviar_seguridad *')) {
    //   if (window.confirm('¿Estás seguro de enviar la respuesta del prefiltro?')) {
    //     // Código a ejecutar si el usuario hace clic en "Aceptar"
    //     let formdata = new FormData();
    //     formdata.append('solicitud', num_solicitud);
    //     formdata.append('estado', d.getElementById('estado_seguridad').value);
    //     formdata.append('proceso', d.getElementById('procesoprefiltro').value);
    //     formdata.append('observacion', d.getElementById('seguridad_observa').value);
    //     fetch($('#id_url_ajax').val() + 'validacionparametros/Enviar_Prefiltro', {
    //       method: 'POST',
    //       cache: 'no-cache',
    //       body: formdata,
    //     })
    //       .then(response => response.json())
    //       .then(function (data) {
    //         if (data) {
    //           alert(data);
    //           $('#ver_lista_prefiltro').modal('hide');
    //           Litar_solicitudes();
    //         } else {
    //           alert('Error de operación');
    //         }
    //       })
    //       .catch(error => {
    //         alert(error);
    //       });
    //   } else {
    //     // Código a ejecutar si el usuario hace clic en "Cancelar"
    //     console.log('Acción confirmada.');
    //   }
    // }

    // Estudio de seguridad
    // if (e.target.matches('#btn_listado') || e.target.matches('#btn_listado *')) {
    //   let padre = e.target.parentElement.parentElement;

    //   d.getElementById('content_vehiculo').style.display = 'none';
    //   d.getElementById('content_conductor').style.display = 'none';
    //   d.getElementById('content_risk').style.display = 'none';
    //   d.getElementById('recoger_trailer').style.display = 'none';
    //   d.getElementById('recoger_trailer2').style.display = 'none';

    //   let placa = padre.querySelector('.pla_id').value;
    //   let num_solicitud = padre.querySelector('.soli_id').value;
    //   let nombre = padre.querySelector('.nombre').value;
    //   let apellido = padre.querySelector('.apellido').value;
    //   let estado_actual = padre.querySelector('.estado_actual').value;
    //   let conductor_id = padre.querySelector('.conductor_id').value;
    //   let conductor_num_doc = padre.querySelector('.conductor_num_documento').value;
    //   let vehiculo_id = padre.querySelector('.vehiculo_id').value;
    //   let estudio_id_c = padre.querySelector('.estudio_id_c').value;
    //   let estado_estudio = padre.querySelector('.estado_estudio').value;
    //   let observacion_general = padre.querySelector('.observacion_general').value;
    //   let escenarioId = padre.querySelector('.escenarioId').value;

    //   //

    //   d.getElementById('observacion_operaciones_estudio').value = observacion_general;
    //   //----------------------------------------------------------------//

    //   d.querySelector('.idvehiculo').innerHTML = placa;
    //   d.querySelector('.idconductor').innerHTML = nombre + ' ' + apellido;
    //   d.querySelector('.idstudy').innerHTML = num_solicitud;
    //   d.querySelector('.estadostudy').innerHTML = estado_actual;

    //   //----------------------------------------------------------------//

    //   d.getElementById('idvehiculo').value = vehiculo_id;
    //   d.getElementById('idconductor').value = conductor_id;
    //   d.getElementById('idstudy').value = num_solicitud;
    //   d.getElementById('estadostudy').value = estado_actual;

    //   //----------------------------------------------------------------//

    //   d.querySelector('.id_soli').innerHTML = num_solicitud;
    //   d.getElementById('id_soli').value = num_solicitud;
    //   d.getElementById('solicitudg').value = num_solicitud;
    //   d.getElementById('id_conductor').value = conductor_id;
    //   d.getElementById('id_vehiculo').value = vehiculo_id;
    //   d.getElementById('id_estudio').value = estudio_id_c;
    //   d.getElementById('id_escenario').value = escenarioId;
    //   // d.getElementById('id_solicitud').value = num_solicitud;

    //   //----------------------------------------------------------------//

    //   $('#valor_vehiculo').val(vehiculo_id);
    //   $('#valor_conductor').val(conductor_num_doc);
    //   $('#conductor_id').val(conductor_id);
    //   lista_hojas_de_vida(vehiculo_id, conductor_id, num_solicitud);

    //   //----------------------------------------------------------------//

    //   if (estado_estudio === 'Aprobado') {
    //     d.getElementById('inicio_estudio').style.display = 'none';
    //     d.getElementById('estado_estu').disabled = true;
    //     d.getElementById('obse_estu').disabled = true;
    //   } else if (estado_estudio === 'Pendiente') {
    //     d.getElementById('inicio_estudio').style.display = 'none';
    //     d.getElementById('estado_estu').disabled = false;
    //     d.getElementById('obse_estu').disabled = false;
    //     $('#title').show();
    //     $('#select_option').show();
    //     cargarselect();
    //   } else if (estado_estudio === 'vencida') {
    //     d.getElementById('inicio_estudio').style.display = 'none';
    //     d.getElementById('select_estados').style.display = 'none';
    //     d.getElementById('input_proceso').style.display = 'none';
    //     d.getElementById('textarea_observacion').style.display = 'none';
    //     d.getElementById('aprobar_estudio_total').style.display = 'none';

    //     // $("#aprobar_estudio_total").hide();
    //     d.getElementById('estado_estu').disabled = true;
    //     d.getElementById('obse_estu').disabled = true;
    //   } else if (estado_estudio === 'pendiente_iniciar') {
    //     d.getElementById('inicio_estudio').style.display = 'block';
    //     d.getElementById('estado_estu').disabled = true;
    //     d.getElementById('obse_estu').disabled = true;
    //     $('#title').hide();
    //     $('#select_option').hide();
    //   } else if (estado_estudio === 'iniciado') {
    //     d.getElementById('inicio_estudio').style.display = 'none';
    //     $('#title').show();
    //     $('#select_option').show();
    //     d.getElementById('estado_estu').disabled = false;
    //     d.getElementById('obse_estu').disabled = false;
    //     cargarselect();
    //   } else if (estado_estudio === 'Rechazado') {
    //     d.getElementById('inicio_estudio').style.display = 'none';
    //     $('#title').hide();
    //     $('#select_option').hide();
    //   } else if (estado_estudio === 'cancelado') {
    //     d.getElementById('inicio_estudio').style.display = 'none';
    //     d.getElementById('estado_estu').disabled = true;
    //     d.getElementById('obse_estu').disabled = true;
    //   } else if (estado_estudio === 'Rechazado_modificar') {
    //     d.getElementById('inicio_estudio').style.display = 'block';
    //     $('#title').show();
    //     $('#select_option').show();
    //     d.getElementById('estado_estu').disabled = false;
    //     d.getElementById('obse_estu').disabled = false;
    //     cargarselect();
    //   }
    //   // Restaura el HTML de la tabla al estado original guardado
    //   document.getElementById('tbl_recursos_sistema').innerHTML = originalTableHTML;
    //   document.getElementById('mensaje_error_validacion').innerHTML = '';
    //   // Establece el valor del select de vuelta al valor por defecto
    //   document.getElementById('estado_estu').value = defaultSelectValue;

    //   // Documentos campos
    //   let formdatadocumento = new FormData();
    //   formdatadocumento.append('placa', placa);
    //   formdatadocumento.append('solicitud', num_solicitud);
    //   await fetch($('#id_url_ajax').val() + 'validacionparametros/Documentos_Actualizar', {
    //     method: 'POST',
    //     cache: 'no-cache',
    //     body: formdatadocumento,
    //   })
    //     .then(response => response.json())
    //     .then(function (data) {
    //       $('#consulta_datoupdate').html('');
    //       if (data) {
    //         data.resultado_documento_actualizar.forEach(function (element, index) {
    //           $('#consulta_datoupdate').append(
    //             `<tr>
    //                 <td>${element.tipo_hv}</td>
    //                 <td>${element.tipo_campo}</td>
    //                 <td> 
    //                 ${element.name_archivo !== ''
    //               ? `<a href="#" onclick="abrir_fotos('${element.ruta_archivo}' , '${element.name_archivo}')" class="cell-detail hint--top-left" data-hint="">
    //                   <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="Documento"></span>
    //                   </a>`
    //               : `Sin archivos`}
    //                 </td>
    //                 <td>${element.info_campo}</td>
    //                 <td>${element.usuario}</td>
    //                 <td>${element.fecha} - ${element.hora}</td>
    //             </tr> `,
    //           );
    //         });

    //         $('#consulta_tbservicio_estudio').html('');
    //         $('#observacion_servicio_cliente_estudio').html('');
    //         // $('#observacion_operaciones_estudio').html(''); //observacion
    //         if (data.resultado_preestudio) {
    //           data.resultado_preestudio.forEach(function (element) {
    //             document.getElementById("aprobar_estudio_total").setAttribute('data-SolicitudId', JSON.stringify({ solicitudes: [element.nundoc_solicitud] }));
    //             $('#consulta_tbservicio_estudio').append(
    //               `<tr>
    //                 <td>${element.nundoc_solicitud}</td>
    //                 <td style="font-size:10px;">${element.nombre_cliente}</td>
    //                 <td style="font-size:10px;" colspan="2"><b>Origen:</b> ${element.orige} <br> <b>Destino:</b> ${element.dest}</td>
    //                 <td style="font-size:10px;">${element.peso_kg} / ${element.tipo_vehiculo}</td>
    //                 <td style="font-size:10px;">${element.usuario_auditor}</td>
    //                 <td style="font-size:10px;">${element.fecha} - ${element.hora}</td>
    //               </tr>`,
    //             );
    //             d.getElementById('observacion_servicio_cliente_estudio').value = element.observaciones;
    //             // d.getElementById('observacion_operaciones_estudio').value = element.observacion;
    //           });
  
    //           /* Datos del contenedor para la solicitud */
    //           $('#datos_contenedor_estudio').html('');
    //           if (data.nombre_contenedor) {
    //             data.resultado_preestudio.forEach(function (contenedor) {
    //               $('#datos_contenedor_estudio').append(
    //                 `<tr>
    //                   <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${contenedor.devol_numcont}</td>
    //                   <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${data.nombre_contenedor}</td>
    //                   <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${contenedor.devol_dias}</td>
    //                   <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${contenedor.devolucion_contenedor}</td>
    //                   <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${contenedor.devol_direccion}</td>
    //                 </tr>`,
    //               );
    //             });
    //           } else {
    //             $('#datos_contenedor_estudio').append(
    //               `<tr>
    //                 <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;" colspan='5'>No tiene contendor</td>
    //               </tr>`,
    //             );
    //           }
    //         }
    //       } else {
    //         $('#consulta_datoupdate').append(
    //           `<tr>
    //             <td></td>
    //             <td></td>
    //             <td>No hay Documentos</td>
    //             <td></td>
    //             <td></td>
    //             <td></td>
    //           </tr>`,
    //         );
    //       }
    //     })
    //     .catch(error => {
    //       alert(error);
    //     });
    // }

    // Inicio de estudio se seguridad
    // if (e.target.matches('#inicio_estudio') || e.target.matches('#inicio_estudio *')) {
    //   let padre = e.target.parentElement.parentElement;
    //   let numsoli = padre.querySelector('#solicitudg').value;
    //   let fechag = padre.querySelector('#fechag').value;
    //   let horag = padre.querySelector('#horag').value;
    //   let usuariog = padre.querySelector('#usuariog').value;
    //   let id_conductor = padre.querySelector('#id_conductor').value;
    //   let id_vehiculo = padre.querySelector('#id_vehiculo').value;
    //   let estudio_id_c = padre.querySelector('#id_estudio').value;

    //   // Datos a enviar
    //   let data = new FormData();
    //   data.append('numsoli', numsoli);
    //   data.append('fechag', fechag);
    //   data.append('horag', horag);
    //   data.append('usuariog', usuariog);
    //   data.append('id_conductor', id_conductor);
    //   data.append('id_vehiculo', id_vehiculo);
    //   data.append('estudio_id_c', estudio_id_c);

    //   await fetch($('#id_url_ajax').val() + 'validacionparametros/Inicio_Estudio_seguridad', {
    //     method: 'POST',
    //     cache: 'no-cache',
    //     body: data,
    //   })
    //     .then(response => {
    //       if (!response.ok) throw new Error(response.statusText);
    //       return response.json();
    //     })
    //     .then(function (data) {
    //       if (data.numero === 200) {
    //         mensaje = `
    //       <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
    //           <div class="icon"><span class="mdi mdi-check"></span></div>
    //           <div class="message">
    //             <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //             <strong>Mensaje!</strong> ${data.mensaje}
    //           </div>
    //       </div>`;

    //         Litar_solicitudes();
    //         $('#title').show();
    //         $('#select_option').show();
    //         $('#ver_lista').modal('show');
    //         lista_hojas_de_vida(id_vehiculo, id_conductor, numsoli);
    //         $('#inicio_estudio').hide();
    //         cargarselect();
    //         // $('#ver_lista').modal('hide');
    //       } else {
    //         mensaje = `
    //       <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //           <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //           <div class="message">
    //             <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //             <strong>Mensaje!</strong> ${data.mensaje}
    //           </div>
    //       </div>`;
    //       }
    //       d.getElementById('msg_lista').innerHTML = mensaje;
    //     })
    //     .catch(error => {
    //       alert(error);
    //     });
    // }

    // if (e.target.matches('#aprobarv1') || e.target.matches('#aprobarv1')) {
    //   aprobar_vehiculo();
    // } else if (e.target.matches('#noaprobarv1') || e.target.matches('#noaprobarv1')) {
    //   desaprobar_vehiculo();
    // }

    // if (e.target.matches('#aprobarc1') || e.target.matches('#aprobarc1')) {
    //   aprobar_conductor();
    // } else if (e.target.matches('#noaprobarc1') || e.target.matches('#noaprobarc1')) {
    //   desaprobar_conductor();
    // }

    // //risk
    // if (e.target.matches('#aprobarr1') || e.target.matches('#aprobarr1')) {
    //   aprobar_risk();
    // } else if (e.target.matches('#noaprobarr1') || e.target.matches('#noaprobarr1')) {
    //   desaprobar_risk();
    // }

    // //runt
    // if (e.target.matches('#aprobarr2') || e.target.matches('#aprobarr2')) {
    //   aprobar_risk();
    // } else if (e.target.matches('#noaprobarr2') || e.target.matches('#noaprobarr2')) {
    //   desaprobar_risk();
    // }

    // //policia
    // if (e.target.matches('#aprobarr3') || e.target.matches('#aprobarr3')) {
    //   aprobar_risk();
    // } else if (e.target.matches('#noaprobarr3') || e.target.matches('#noaprobarr3')) {
    //   desaprobar_risk();
    // }

    // //procuraduria
    // if (e.target.matches('#aprobarr4') || e.target.matches('#aprobarr4')) {
    //   aprobar_risk();
    // } else if (e.target.matches('#noaprobarr4') || e.target.matches('#noaprobarr4')) {
    //   desaprobar_risk();
    // }

    // //simit
    // if (e.target.matches('#aprobarr5') || e.target.matches('#aprobarr5')) {
    //   aprobar_risk();
    // } else if (e.target.matches('#noaprobarr5') || e.target.matches('#noaprobarr5')) {
    //   desaprobar_risk();
    // }

    // //siscomn
    // if (e.target.matches('#aprobarr6') || e.target.matches('#aprobarr6')) {
    //   aprobar_risk();
    // } else if (e.target.matches('#noaprobarr6') || e.target.matches('#noaprobarr6')) {
    //   desaprobar_risk();
    // }

    // //adres
    // if (e.target.matches('#aprobarr7') || e.target.matches('#aprobarr7')) {
    //   aprobar_risk();
    // } else if (e.target.matches('#noaprobarr7') || e.target.matches('#noaprobarr7')) {
    //   desaprobar_risk();
    // }

    // //gps
    // if (e.target.matches('#aprobarr8') || e.target.matches('#aprobarr8')) {
    //   aprobar_risk();
    // } else if (e.target.matches('#noaprobarr8') || e.target.matches('#noaprobarr8')) {
    //   desaprobar_risk();
    // }

    // //datos preestudio
    // if (e.target.matches('#aprobarr9') || e.target.matches('#aprobarr9')) {
    //   aprobar_risk();
    // } else if (e.target.matches('#noaprobarr9') || e.target.matches('#noaprobarr9')) {
    //   desaprobar_risk();
    // }

    // if (e.target.matches('#aprobar_estudio_total') || e.target.matches('#aprobar_estudio_total *')) {
    //   let BtnAprobacionTotal = e.target.closest('#aprobar_estudio_total');
    //   let SolicitudId = BtnAprobacionTotal.getAttribute('data-SolicitudId');
    //   //SolicitudId
    //   if (window.confirm('¿Estás seguro de enviar esta respuesta?')) {
    //     // Código a ejecutar si el usuario hace clic en "Aceptar"

    //     var select = $('#estado_estu').val();
    //     var idvehiculo = $('#idvehiculo').val();
    //     var idconductor = $('#idconductor').val();
    //     var idestudio = $('#idstudy').val();
    //     var estado = $('#estado_estu').val();
    //     var obse = $('#obse_estu').val();
    //     var usuario = $('#ee_usuario').val();
    //     var id_preestudio = $('#id_preestudioc').val();

    //     if (select === 'Aprobado') {
    //       //validar requeridos
    //       var sw2 = 's';
    //       var tipoestu = {
    //         idestudio: idestudio,
    //         // action: 'tipos_estudio'
    //       };

    //       $.ajax({
    //         url: $('#id_url_ajax').val() + 'validacionparametros/tipos_estudios',
    //         type: 'POST',
    //         data: tipoestu,
    //         dataType: 'json',
    //         success: function (data) {
    //           if (data != '') {
    //             //resultado de tb aprobaciones x seguridad
    //             var tmp = Array();
    //             tmp = data;
    //             var c = tmp.length;
    //             var sw = 0;
    //             for (i = 0; i <= c; i++) {
    //               // idtipos = tmp[i][1];
    //               if (tmp[i][2] == 0 && tmp[i][3] == 1) {
    //                 sw = 1;
    //                 // alert('No es posible aprobar el estudio completo cuando tiene tipos de estudio rechazados que son obligatorios: ' + tmp[i][5]);
    //                 mensaje = `
    //                 <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //                     <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //                     <div class="message">
    //                       <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                       <strong>Mensaje!</strong> No es posible aprobar el estudio completo cuando tiene tipos de estudio rechazados que son obligatorios: ${tmp[i][5]}
    //                     </div>
    //                 </div>`;
    //                 d.getElementById('historico_estudios').innerHTML = mensaje;
    //               }

    //               if (tmp[i][2] == null && tmp[i][3] == 1) {
    //                 sw = 1;
    //                 // alert('No es posible aprobar el estudio completo cuando tiene tipos de estudio que son obligatorios sin contestar ' + tmp[i][5]);
    //                 mensaje = `
    //                 <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //                     <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //                     <div class="message">
    //                       <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                       <strong>Mensaje!</strong> No es posible aprobar el estudio completo cuando tiene tipos de estudio que son obligatorios sin contestar ${tmp[i][5]}
    //                     </div>
    //                 </div>`;
    //                 d.getElementById('historico_estudios').innerHTML = mensaje;
    //               }

    //               if (sw == 0 && i == c - 1) {
    //                 var data = null;

    //                 data = new FormData();
    //                 data.append('idcarro', $('#idvehiculo').val());
    //                 data.append('idcondu', $('#idconductor').val());
    //                 data.append('idestudio', $('#idstudy').val());
    //                 data.append('obser', $('#obse_estu').val());
    //                 data.append('user', $('#ee_usuario').val());
    //                 data.append('proceso', $('#proceso').val());
    //                 data.append('proceso_estudio', $('#proceso_estudio').val());
    //                 data.append('estado', 'Aprobado');
    //                 data.append('id_estudio_c', $('#id_estudio').val());
    //                 data.append('id_escenario', $('#id_escenario').val());
    //                 data.append('SolicitudId', SolicitudId);

    //                 // data.append("causalidad", $("#causalidad").val());

    //                 $.ajax({
    //                   url: $('#id_url_ajax').val() + 'validacionparametros/Aprobacion_total',
    //                   type: 'POST',
    //                   data: data,
    //                   cache: false,
    //                   processData: false, // Don't process the files
    //                   contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    //                   dataType: 'json',
    //                   success: function (data, textStatus, jqXHR) {
    //                     // alert('Datos del Estudio Registrados Exitosamente');
    //                     if (data.numero === 200) {
    //                       mensaje = `
    //                       <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
    //                           <div class="icon"><span class="mdi mdi-check"></span></div>
    //                           <div class="message">
    //                             <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                             <strong>Mensaje!</strong> ${data.mensaje}
    //                           </div>
    //                       </div>`;

    //                       Litar_solicitudes();
    //                       $('#title').show();
    //                       $('#select_option').show();
    //                       $('#ver_lista').modal('hide');

    //                       // push(idvehiculo, idconductor, idestudio, estado, obse, usuario);
    //                     } else {
    //                       mensaje = `
    //                       <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //                           <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //                           <div class="message">
    //                             <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                             <strong>Mensaje!</strong> ${data.mensaje}
    //                           </div>
    //                       </div>`;

    //                       Litar_solicitudes();
    //                       $('#title').show();
    //                       $('#select_option').show();
    //                       $('#ver_lista').modal('hide');
    //                     }
    //                     d.querySelector('.nexos-messages').innerHTML = mensaje;
    //                     // solicitudes();
    //                   },

    //                   error: function (jqXHR, textStatus, errorThrown) {
    //                     // alert('Datos del Estudio Registrados Exitosamente');
    //                     $('#ver_lista').modal('hide');
    //                     // solicitudes();
    //                     console.log('no inserto hv conductor');
    //                     console.log(jqXHR);
    //                     console.log(textStatus);
    //                     console.log(errorThrown);
    //                   },
    //                 });
    //               }
    //             }
    //           } else {
    //             mensaje = `
    //             <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //                 <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //                 <div class="message">
    //                   <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                   <strong>Mensaje!</strong> No es posible aprobar el estudio completo cuando tiene tipos de estudio que son obligatorios sin contestar
    //                 </div>
    //             </div>`;
    //             d.getElementById('historico_estudios').innerHTML = mensaje;
    //             // $("#ver_lista").animate({ scrollTop: 0 }, 900);
    //           } //termina data.result
    //         },
    //         error: function (jqXHR, textStatus, errorThrown) {
    //           alert('ocurrio un error');
    //           console.log(jqXHR);
    //           console.log(textStatus);
    //           console.log(errorThrown);
    //         },
    //       });
    //     }

    //     if (select === 'Rechazado') {
    //       var url = $('#id_url_ajax').val() + 'validacionparametros/Aprobacion_total';

    //       var data = null;

    //       data = new FormData();

    //       data.append('idcarro', $('#idvehiculo').val());
    //       data.append('idcondu', $('#idconductor').val());
    //       data.append('idestudio', $('#idstudy').val());
    //       data.append('obser', $('#obse_estu').val());
    //       data.append('user', $('#ee_usuario').val());
    //       data.append('proceso', $('#proceso').val());
    //       data.append('proceso_estudio', $('#proceso_estudio').val());
    //       data.append('estado', 'Rechazado');
    //       data.append('id_estudio_c', $('#id_estudio').val());
    //       data.append('causalidad', $('#causalidad').val());
    //       data.append('id_escenario', $('#id_escenario').val());
    //       data.append('SolicitudId', SolicitudId);

    //       $.ajax({
    //         url: url,
    //         type: 'POST',
    //         data: data,
    //         cache: false,
    //         processData: false, // Don't process the files
    //         contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    //         dataType: 'json',

    //         success: function (data, textStatus, jqXHR) {
    //           if (data.numero === 200) {
    //             mensaje = `
    //             <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
    //                 <div class="icon"><span class="mdi mdi-check"></span></div>
    //                 <div class="message">
    //                   <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                   <strong>Mensaje!</strong> ${data.mensaje}
    //                 </div>
    //             </div>`;
    //             $('#ver_lista').modal('hide');
    //             Litar_solicitudes();
    //             // push(idvehiculo, idconductor, idestudio, estado, obse, usuario);
    //           } else {
    //             mensaje = `
    //             <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //                 <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //                 <div class="message">
    //                   <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                   <strong>Mensaje!</strong> ${data.mensaje}
    //                 </div>
    //             </div>`;
    //             $('#ver_lista').modal('hide');
    //           }
    //           d.getElementById('historico_estudios').innerHTML = mensaje;
    //           // solicitudes();
    //         },

    //         error: function (jqXHR, textStatus, errorThrown) {
    //           alert('Datos del Estudio Registrados Exitosamente');
    //           solicitudes();
    //           console.log('no inserto hv conductor');
    //           console.log(jqXHR);
    //           console.log(textStatus);
    //           console.log(errorThrown);
    //         },
    //       });
    //     }

    //     // if (select === 'Pendiente') {
    //     //   //validar requeridos
    //     //   var sw2 = 's';
    //     //   var tipoestu = {
    //     //     idestudio: idestudio,
    //     //     // action: 'tipos_estudio'
    //     //   };

    //     //   $.ajax({
    //     //     url: $('#id_url_ajax').val() + 'validacionparametros/tipos_estudios',
    //     //     type: 'POST',
    //     //     data: tipoestu,
    //     //     dataType: 'json',
    //     //     success: function (data) {
    //     //       if (data != '') {
    //     //         //resultado de tb aprobaciones x seguridad
    //     //         var tmp = Array();
    //     //         tmp = data;
    //     //         console.log("🚀 ~ tmp:", tmp)
    //     //         var c = tmp.length;
    //     //         var sw = 0;
    //     //         for (i = 0; i <= c; i++) {
    //     //           // idtipos = tmp[i][1];
    //     //           // console.log("🚀 ~ tmp[i][2]:", tmp[i][2])
    //     //           if (tmp[i][2] == 0 && tmp[i][3] == 1) {
    //     //             sw = 1;
    //     //             // alert('No es posible aprobar el estudio completo cuando tiene tipos de estudio rechazados que son obligatorios: ' + tmp[i][5]);
    //     //             mensaje = `
    //     //             <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //     //                 <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //     //                 <div class="message">
    //     //                   <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //     //                   <strong>Mensaje!</strong> No es posible aprobar el estudio completo cuando tiene tipos de estudio rechazados que son obligatorios: ${tmp[i][5]}
    //     //                 </div>
    //     //             </div>`;
    //     //             d.getElementById('historico_estudios').innerHTML = mensaje;
    //     //           }

    //     //           if (tmp[i][2] == null && tmp[i][3] == 1) {
    //     //             sw = 1;
    //     //             // alert('No es posible aprobar el estudio completo cuando tiene tipos de estudio que son obligatorios sin contestar ' + tmp[i][5]);
    //     //             mensaje = `
    //     //             <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //     //                 <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //     //                 <div class="message">
    //     //                   <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //     //                   <strong>Mensaje!</strong> No es posible aprobar el estudio completo cuando tiene tipos de estudio que son obligatorios sin contestar ${tmp[i][5]}
    //     //                 </div>
    //     //             </div>`;
    //     //             d.getElementById('historico_estudios').innerHTML = mensaje;
    //     //           }

    //     //           if (sw == 0 && i == c - 1) {
    //     //             var url = $('#id_url_ajax').val() + 'validacionparametros/Aprobacion_total';
    //     //             var data = null;
    //     //             data = new FormData();

    //     //             // data.append("accion", 'aprobacioncompleta');

    //     //             data.append('idcarro', $('#idvehiculo').val());
    //     //             data.append('idcondu', $('#idconductor').val());
    //     //             data.append('idestudio', $('#idstudy').val());
    //     //             data.append('obser', $('#obse_estu').val());
    //     //             data.append('user', $('#ee_usuario').val());
    //     //             data.append('proceso', $('#proceso').val());
    //     //             data.append('proceso_estudio', $('#proceso_estudio').val());
    //     //             data.append('estado', 'Pendiente');
    //     //             data.append('id_estudio_c', $('#id_estudio').val());
    //     //             data.append('causalidad', $('#causalidad').val());
    //     //             data.append('id_escenario', $('#id_escenario').val());
    //     //             data.append('SolicitudId', SolicitudId);

    //     //             $.ajax({
    //     //               url: url,
    //     //               type: 'POST',
    //     //               data: data,
    //     //               cache: false,
    //     //               processData: false, // Don't process the files
    //     //               contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    //     //               dataType: 'json',

    //     //               success: function (data, textStatus, jqXHR) {
    //     //                 if (data.numero === 200) {
    //     //                   mensaje = `
    //     //                   <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
    //     //                       <div class="icon"><span class="mdi mdi-check"></span></div>
    //     //                       <div class="message">
    //     //                         <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //     //                         <strong>Mensaje!</strong> ${data.mensaje}
    //     //                       </div>
    //     //                   </div>`;
    //     //                   $('#ver_lista').modal('hide');
    //     //                   Litar_solicitudes();
    //     //                   // push(idvehiculo, idconductor, idestudio, estado, obse, usuario);
    //     //                 } else {
    //     //                   mensaje = `
    //     //                   <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //     //                       <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //     //                       <div class="message">
    //     //                         <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //     //                         <strong>Mensaje!</strong> ${data.mensaje}
    //     //                       </div>
    //     //                   </div>`;
    //     //                   $('#ver_lista').modal('hide');
    //     //                 }
    //     //                 d.getElementById('historico_estudios').innerHTML = mensaje;
    //     //                 // solicitudes();
    //     //               },

    //     //               error: function (jqXHR, textStatus, errorThrown) {
    //     //                 // alert('Datos del Estudio Registrados Exitosamente');
    //     //                 // $('#ver_lista').modal('hide');
    //     //                 // solicitudes();
    //     //                 // console.log('no inserto hv conductor');
    //     //                 console.log(jqXHR);
    //     //                 console.log(textStatus);
    //     //                 console.log(errorThrown);
    //     //               },
    //     //             });
    //     //           }
    //     //         }
    //     //       } else {
    //     //         mensaje = `
    //     //         <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //     //             <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //     //             <div class="message">
    //     //               <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //     //               <strong>Mensaje!</strong> No es posible aprobar el estudio completo cuando tiene tipos de estudio que son obligatorios sin contestar
    //     //             </div>
    //     //         </div>`;
    //     //         d.getElementById('historico_estudios').innerHTML = mensaje;
    //     //         // $("#ver_lista").animate({ scrollTop: 0 }, 900);
    //     //       } //termina data.result
    //     //     },
    //     //     error: function (jqXHR, textStatus, errorThrown) {
    //     //       alert('ocurrio un error');
    //     //       console.log(jqXHR);
    //     //       console.log(textStatus);
    //     //       console.log(errorThrown);
    //     //     },
    //     //   });
    //     // }

    //     if (select === 'Pendiente') {
    //       var tipoestu = {
    //         idestudio: idestudio
    //       };

    //       $.ajax({
    //         url: $('#id_url_ajax').val() + 'validacionparametros/tipos_estudios',
    //         type: 'POST',
    //         data: tipoestu,
    //         dataType: 'json',
    //         success: function (data) {
    //           if (data && data.length > 0) {
    //             let tmp = data;
    //             let sw = 0;

    //             for (let i = 0; i < tmp.length; i++) {
    //               const tipo = tmp[i];

    //               if (tipo.estado === 0 && tipo.requerido === 1) {
    //                 sw = 1;
    //                 let mensaje = `
    //                     <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //                         <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //                         <div class="message">
    //                           <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                           <strong>Mensaje!</strong> No es posible aprobar el estudio completo cuando tiene tipos de estudio rechazados que son obligatorios: ${tipo.estudio}
    //                         </div>
    //                     </div>`;
    //                 document.getElementById('historico_estudios').innerHTML = mensaje;
    //                 break;
    //               }

    //               if ((tipo.estado === null || tipo.estado === undefined) && tipo.requerido === 1) {
    //                 sw = 1;
    //                 let mensaje = `
    //                   <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //                       <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //                       <div class="message">
    //                         <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                         <strong>Mensaje!</strong> No es posible aprobar el estudio completo cuando tiene tipos de estudio que son obligatorios sin contestar: ${tipo.estudio}
    //                       </div>
    //                   </div>`;
    //                 document.getElementById('historico_estudios').innerHTML = mensaje;
    //                 break;
    //               }

    //               // Si termina el ciclo sin problemas
    //               if (sw === 0 && i === tmp.length - 1) {
    //                 let url = $('#id_url_ajax').val() + 'validacionparametros/Aprobacion_total';
    //                 let formData = new FormData();

    //                 formData.append('idcarro', $('#idvehiculo').val());
    //                 formData.append('idcondu', $('#idconductor').val());
    //                 formData.append('idestudio', $('#idstudy').val());
    //                 formData.append('obser', $('#obse_estu').val());
    //                 formData.append('user', $('#ee_usuario').val());
    //                 formData.append('proceso', $('#proceso').val());
    //                 formData.append('proceso_estudio', $('#proceso_estudio').val());
    //                 formData.append('estado', 'Pendiente');
    //                 formData.append('id_estudio_c', $('#id_estudio').val());
    //                 formData.append('causalidad', $('#causalidad').val());
    //                 formData.append('id_escenario', $('#id_escenario').val());
    //                 formData.append('SolicitudId', SolicitudId);

    //                 $.ajax({
    //                   url: url,
    //                   type: 'POST',
    //                   data: formData,
    //                   cache: false,
    //                   processData: false,
    //                   contentType: false,
    //                   dataType: 'json',
    //                   success: function (data) {
    //                     let mensaje = '';
    //                     if (data.numero === 200) {
    //                       mensaje = `
    //                         <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
    //                             <div class="icon"><span class="mdi mdi-check"></span></div>
    //                             <div class="message">
    //                               <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                               <strong>Mensaje!</strong> ${data.mensaje}
    //                             </div>
    //                         </div>`;
    //                       $('#ver_lista').modal('hide');
    //                       Litar_solicitudes();
    //                     } else {
    //                       mensaje = `
    //                         <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //                             <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //                             <div class="message">
    //                               <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                               <strong>Mensaje!</strong> ${data.mensaje}
    //                             </div>
    //                         </div>`;
    //                       $('#ver_lista').modal('hide');
    //                     }
    //                     document.getElementById('historico_estudios').innerHTML = mensaje;
    //                   },
    //                   error: function (jqXHR, textStatus, errorThrown) {
    //                     alert('Ocurrió un error al aprobar el estudio');
    //                     console.error(jqXHR, textStatus, errorThrown);
    //                   }
    //                 });
    //               }
    //             }
    //           } else {
    //             let mensaje = `
    //               <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //                   <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //                   <div class="message">
    //                     <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                     <strong>Mensaje!</strong> No es posible aprobar el estudio completo cuando tiene tipos de estudio que son obligatorios sin contestar
    //                   </div>
    //               </div>`;
    //             document.getElementById('historico_estudios').innerHTML = mensaje;
    //           }
    //         },
    //         error: function (jqXHR, textStatus, errorThrown) {
    //           alert('Ocurrió un error en la validación de tipos de estudio');
    //           console.error(jqXHR, textStatus, errorThrown);
    //         }
    //       });
    //     }

    //     if (select === 'Rechazado_modificar') {
    //       if (!$('#obse_estu').val()) {
    //         alert('Debe diligenciar la observación, por favor escriba brevemente los motivos del rechazo para modificar');
    //       } else {
    //         // var url = $("#id_url_ajax").val() + "libs/seguridad_estudio_ajax.php";

    //         var url = $('#id_url_ajax').val() + 'validacionparametros/Aprobacion_total';

    //         var data = null;

    //         data = new FormData();
    //         data.append('idcarro', $('#idvehiculo').val());
    //         data.append('idcondu', $('#idconductor').val());
    //         data.append('idestudio', $('#idstudy').val());
    //         data.append('obser', $('#obse_estu').val());
    //         data.append('user', $('#ee_usuario').val());
    //         data.append('proceso', $('#proceso').val());
    //         data.append('proceso_estudio', $('#proceso_estudio').val());
    //         data.append('estado', 'Rechazado_modificar');
    //         data.append('id_estudio_c', $('#id_estudio').val());
    //         data.append('causalidad', $('#causalidad').val());
    //         data.append('id_escenario', $('#id_escenario').val());
    //         data.append('SolicitudId', SolicitudId);

    //         $.ajax({
    //           url: url,
    //           type: 'POST',
    //           data: data,
    //           cache: false,
    //           processData: false, // Don't process the files
    //           contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    //           dataType: 'json',

    //           success: function (data, textStatus, jqXHR) {
    //             if (data.numero === 200) {
    //               mensaje = `
    //               <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
    //                   <div class="icon"><span class="mdi mdi-check"></span></div>
    //                   <div class="message">
    //                     <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                     <strong>Mensaje!</strong> ${data.mensaje}
    //                   </div>
    //               </div>`;
    //               $('#ver_lista').modal('hide');
    //               Litar_solicitudes();
    //               // push(idvehiculo, idconductor, idestudio, estado, obse, usuario);
    //             } else {
    //               mensaje = `
    //               <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //                   <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //                   <div class="message">
    //                     <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                     <strong>Mensaje!</strong> ${data.mensaje}
    //                   </div>
    //               </div>`;
    //               $('#ver_lista').modal('hide');
    //             }
    //             d.getElementById('historico_estudios').innerHTML = mensaje;
    //             // solicitudes();
    //           },

    //           error: function (jqXHR, textStatus, errorThrown) {
    //             // alert('Datos del Estudio Registrados Exitosamente');
    //             $('#ver_lista').modal('hide');
    //             solicitudes();
    //             console.log('no inserto hv conductor');
    //             console.log(jqXHR);
    //             console.log(textStatus);
    //             console.log(errorThrown);
    //           },
    //         });
    //       }
    //     }
    //   } else {
    //     // Código a ejecutar si el usuario hace clic en "Cancelar"
    //     console.log('Acción confirmada.');
    //   }
    // }

    // if (e.target.matches('#btn_respuestas_operaciones') || e.target.matches('#btn_respuestas_operaciones *')) {
    //   let padre = e.target.parentElement.parentElement;
    //   let num_solicitud = padre.querySelector('.soli_id').value;
    //   var dato = {
    //     idestudio: num_solicitud,
    //   };

    //   $('#tbr_opera').html('');
    //   $('#tbr_seguri').html('');
    //   $('#msg_rta_opera').html('');

    //   $.ajax({
    //     url: $('#id_url_ajax').val() + 'validacionparametros/Consultar_respuesta_operaciones',
    //     type: 'POST',
    //     data: dato,
    //     dataType: 'json',

    //     success: function (data) {
    //       if (data !== null) {
    //         data.respuesta_operaciones.forEach(function (element, index) {
    //           var doc = '';
    //           if (element.nom_archivo != null && element.nom_archivo != '') {
    //             doc = `<a  href="#" onclick="abrir_fotos('${element.archivo}' , '${element.nom_archivo}')" class="cell-detail hint--top-left" data-hint="">
    //             <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="Documento"></span>
    //             </a>`;
    //           } else {
    //             doc = '<label>Sin archivo</label>';
    //           }

    //           $('#tbr_opera').append(
    //             '<tr>' +
    //             '<td>' +
    //             element.estudio_letra +
    //             '</td>' +
    //             '<td>' +
    //             element.fecha +
    //             '</td>' +
    //             '<td>' +
    //             element.hora +
    //             '</td>' +
    //             '<td>' +
    //             element.usuario +
    //             '</td>' +
    //             '<td>' +
    //             element.nota +
    //             '</td>' +
    //             '<td>' +
    //             doc +
    //             '</td></tr>',
    //           );
    //         });
    //       } else if (data == null) {
    //         var msg_error = '';

    //         msg_error += '<p>Aún no hay respuestas por parte de operaciones para este estudio.</p>';

    //         $('#msg_rta_opera').html(
    //           '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Aviso!</strong>' +
    //           msg_error +
    //           '</div></div>',
    //         );

    //         $('#ver_rta_operaciones').animate(
    //           {
    //             scrollTop: 0,
    //           },
    //           600,
    //         );

    //         $('#tbr_opera').html('');
    //       }

    //       if (data !== null) {
    //         data.respuesta_seguridad.forEach(function (element, index) {
    //           var doc = '';

    //           if (element.name_evidencia != null && element.name_evidencia != '') {
    //             doc = `<a  href="#" onclick="abrir_fotos('${element.ruta_evidencia}' , '${element.name_evidencia}')" class="cell-detail hint--top-left" data-hint="">

    //             <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="Documento"></span>

    //             </a>`;
    //           } else {
    //             doc = '<label>Sin archivo</label>';
    //           }

    //           var abc = '';

    //           if (element.estado == 1) {
    //             abc = 'Aprobado';
    //           } else if (element.estado == 0) {
    //             abc = 'Rechazado';
    //           }

    //           $('#tbr_seguri').append(
    //             '<tr>' +
    //             '<td>' +
    //             element.estudio +
    //             '</td>' +
    //             '<td>' +
    //             element.fecha +
    //             '</td>' +
    //             '<td>' +
    //             element.hora +
    //             '</td>' +
    //             '<td>' +
    //             element.usuario +
    //             '</td>' +
    //             '<td>' +
    //             element.observacion +
    //             '</td>' +
    //             '<td>' +
    //             abc +
    //             '</td>' +
    //             '<td>' +
    //             doc +
    //             '</td>' +
    //             +'</tr>',
    //           );
    //         });
    //       } else if (data == null) {
    //         var msg_error = '';

    //         msg_error += '<p>Aún no hay respuestas por parte de seguridad para este estudio.</p>';

    //         $('#msg_rta_opera').html(
    //           '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Aviso!</strong>' +
    //           msg_error +
    //           '</div></div>',
    //         );

    //         $('#ver_rta_operaciones').animate(
    //           {
    //             scrollTop: 0,
    //           },
    //           600,
    //         );

    //         $('#tbr_seguri').html('');
    //       }

    //       if (data !== null) {
    //         $('#tbr_observaciones').html('');

    //         data.resultado_observacion.forEach(element => {
    //           $('#tbr_observaciones').append(
    //             '<tr>' +
    //             "<td style='font-size: 11px;'>" +
    //             element.id +
    //             '</td>' +
    //             "<td style='font-size: 11px;'>" +
    //             element.observacion +
    //             '</td>' +
    //             "<td style='font-size: 11px;'>" +
    //             element.fecha +
    //             '-' +
    //             element.hora +
    //             '</td>' +
    //             "<td style='font-size: 11px;'>" +
    //             element.usuario +
    //             '</td>' +
    //             "<td style='font-size: 11px;'>" +
    //             element.estado +
    //             '</td>' +
    //             +'</tr>',
    //           );

    //           // tbr_observaciones
    //         });
    //       }
    //     },
    //     error: function (jqXHR, textStatus, errorThrown) {
    //       console.log('error tabla operaciones respuestas');
    //       console.log(jqXHR);
    //       console.log(textStatus);
    //       console.log(errorThrown);
    //     },
    //   });
    // }

    // /* Bonton para envair directamente a la edicion de los vehiculos */
    // if (e.target.matches('#btn_editar_vehiculo') || e.target.matches('#btn_editar_vehiculo *')) {
    //   // alert('Hola Mundo');
    //   var vehiculo = d.getElementById('btn_editar_vehiculo');
    //   var vehiculo_id = vehiculo.getAttribute('data-idvehiculo');
    //   var ventanaAncho = screen.width; // Ancho de la pantalla
    //   var ventanaAlto = screen.height; // Alto de la pantalla
    //   var ventanaIzquierda = 0; // Posición izquierda
    //   var ventanaArriba = 0; // Posición superior

    //   // Opciones para la ventana emergente
    //   var opcionesVentana = `width=${ventanaAncho},height=${ventanaAlto},left=${ventanaIzquierda},top=${ventanaArriba},scrollbars=yes,fullscreen=yes`;

    //   // URL a abrir
    //   var url = $('#id_url_ajax').val() + `solicitudes/editar_vehiculo/?num_vehiculo=${codificarBase64(vehiculo_id)}&idmenu=3`;

    //   // Abre la ventana emergente
    //   window.open(url, '_blank', opcionesVentana);
    // }

    // /* Boton para editar al condutor */
    // if (e.target.matches('#btn_editar_conductor') || e.target.matches('#btn_editar_conductor *')) {
    //   var conductor = d.getElementById('btn_editar_conductor');
    //   var conductor_id = conductor.getAttribute('data-idconductor');

    //   var ventanaAncho = screen.width; // Ancho de la pantalla
    //   var ventanaAlto = screen.height; // Alto de la pantalla
    //   var ventanaIzquierda = 0; // Posición izquierda
    //   var ventanaArriba = 0; // Posición superior

    //   // Opciones para la ventana emergente
    //   var opcionesVentana = `width=${ventanaAncho},height=${ventanaAlto},left=${ventanaIzquierda},top=${ventanaArriba},scrollbars=yes,fullscreen=yes`;

    //   // URL a abrir  http://principal.nexosapp.com/solicitudes/editar_proveedor/?num_proveedor=OTQ4NA==&idmenu=3
    //   var url = $('#id_url_ajax').val() + `solicitudes/editar_proveedor/?num_proveedor=${codificarBase64(conductor_id)}&idmenu=3`;

    //   // Abre la ventana emergente
    //   window.open(url, '_blank', opcionesVentana);
    // }
  });

  /* EVENTO CHANGE */
  d.addEventListener('change', async e => {
    if (d.getElementById('estadotb').value === 'Placa_e' || d.getElementById('estadotb').value === 'placa') {
      // d.getElementById('filtro_fecha').style.display = 'none';
      d.getElementById('buscar_placa').style.display = 'block';
    } else {
      // d.getElementById('filtro_fecha').style.display = 'block';
      d.getElementById('buscar_placa').style.display = 'none';
    }
  });

  // var urle = 'public/files/estudioseguridad';
  //OPCIONES DEL SELECT

  // $('#select_option').change(function () {
  //   //traer el valor del select é imprimir el contenedor
  //   var valor = $('#select_option').val();
  //   $('#evi_plataforma').val('');
  //   $('#name_eviden').val('');
  //   $('#obse_todo').val('');
  //   $('#obse_condu').val('');
  //   $('#observeheciulo').val('');

  //   // alert(valor);
  //   if (valor == '0') {
  //     $('#content_vehiculo').hide();
  //     $('#content_conductor').hide();
  //     $('#content_risk').hide();
  //     $('#divdatopreestudio').hide();
  //   }

  //   if (valor == '1') {
  //     $('#content_vehiculo').show();
  //     $('#content_conductor').hide();
  //     $('#divdatopreestudio').hide();
  //     $('#content_risk').hide();
  //     $('#id_tvehiculo').val(1);
  //     $('#botonescar').html(
  //       '<button class="btn btn-sm btn-success" id="aprobarv1" disabled>Aprobar vehículo</button>' + '<button class="btn btn-sm btn-danger" id="noaprobarv1">Rechazar vehículo</button>',
  //     );
  //     verVehiculo();
  //   }

  //   if (valor == '2') {
  //     $('#content_conductor').show();
  //     $('#content_vehiculo').hide();
  //     $('#divdatopreestudio').hide();
  //     $('#content_risk').hide();
  //     $('#id_tconductor').val(2);
  //     $('#botondriver').html('<button class="btn btn-sm btn-success" id="aprobarc1">Aprobar conductor</button>' + '<button class="btn btn-sm btn-danger" id="noaprobarc1">Rechazar conductor</button>');
  //     verConductor();
  //   }

  //   if (valor == '3') {
  //     var tipo = 'risck';
  //     var ruta = urle + '/risck';
  //     $('#divdatopreestudio').hide();
  //     $('#content_risk').show();
  //     $('#content_vehiculo').hide();
  //     $('#content_conductor').hide();
  //     $('#tipo_plataforma').val(tipo);
  //     $('#ruta_eviden').val(ruta);
  //     $('#id_totros').val(3);
  //     $('#losbototnes').html('<button class="btn btn-sm btn-success" id="aprobarr1">Aprobar</button>' + '<button class="btn btn-sm btn-danger" id="noaprobarr1">Rechazar</button>');
  //   }

  //   if (valor == '4') {
  //     var tipo = 'siplaft';
  //     var ruta = urle + '/siplaft';
  //     $('#divdatopreestudio').hide();
  //     $('#content_risk').show();
  //     $('#content_vehiculo').hide();
  //     $('#content_conductor').hide();
  //     $('#tipo_plataforma').val(tipo);
  //     $('#ruta_eviden').val(ruta);
  //     $('#id_totros').val(4);
  //   }

  //   if (valor == '5') {
  //     var tipo = 'runt';
  //     var ruta = urle + '/runt';
  //     $('#divdatopreestudio').hide();
  //     $('#content_vehiculo').hide();
  //     $('#content_conductor').hide();
  //     $('#content_risk').show();
  //     $('#tipo_plataforma').val(tipo);
  //     $('#ruta_eviden').val(ruta);
  //     $('#id_totros').val(5);
  //     $('#losbototnes').html('<button class="btn btn-sm btn-success" id="aprobarr2">Aprobar</button>' + '<button class="btn btn-sm btn-danger" id="noaprobarr2">Rechazar</button>');
  //   }

  //   if (valor == '6') {
  //     var tipo = 'policia';
  //     var ruta = urle + '/policia';
  //     $('#divdatopreestudio').hide();
  //     $('#content_risk').show();
  //     $('#content_vehiculo').hide();
  //     $('#content_conductor').hide();
  //     $('#tipo_plataforma').val(tipo);
  //     $('#ruta_eviden').val(ruta);
  //     $('#id_totros').val(6);
  //     $('#losbototnes').html('<button class="btn btn-sm btn-success" id="aprobarr3">Aprobar</button>' + '<button class="btn btn-sm btn-danger" id="noaprobarr3">Rechazar</button>');
  //   }

  //   if (valor == '7') {
  //     var tipo = 'procuraduria';
  //     var ruta = urle + '/procuraduria';
  //     $('#divdatopreestudio').hide();
  //     $('#content_risk').show();
  //     $('#content_vehiculo').hide();
  //     $('#content_conductor').hide();
  //     $('#tipo_plataforma').val(tipo);
  //     $('#ruta_eviden').val(ruta);
  //     $('#id_totros').val(7);
  //     $('#losbototnes').html('<button class="btn btn-sm btn-success" id="aprobarr4">Aprobar</button>' + '<button class="btn btn-sm btn-danger" id="noaprobarr4">Rechazar</button>');
  //   }

  //   if (valor == '8') {
  //     var tipo = 'simit';
  //     var ruta = urle + '/simit';
  //     $('#divdatopreestudio').hide();
  //     $('#content_risk').show();
  //     $('#content_vehiculo').hide();
  //     $('#content_conductor').hide();
  //     $('#tipo_plataforma').val(tipo);
  //     $('#ruta_eviden').val(ruta);
  //     $('#id_totros').val(8);
  //     $('#losbototnes').html('<button class="btn btn-sm btn-success" id="aprobarr5">Aprobar</button>' + '<button class="btn btn-sm btn-danger" id="noaprobarr5">Rechazar</button>');
  //   }

  //   if (valor == '9') {
  //     var ruta = urle + '/siscomn';
  //     var tipo = 'siscomn';
  //     $('#divdatopreestudio').hide();
  //     $('#content_risk').show();
  //     $('#content_vehiculo').hide();
  //     $('#content_conductor').hide();
  //     $('#tipo_plataforma').val(tipo);
  //     $('#ruta_eviden').val(ruta);
  //     $('#id_totros').val(9);
  //     $('#losbototnes').html('<button class="btn btn-sm btn-success" id="aprobarr6">Aprobar</button>' + '<button class="btn btn-sm btn-danger" id="noaprobarr6">Rechazar</button>');
  //   }

  //   if (valor == '10') {
  //     var tipo = 'adres';
  //     var ruta = urle + '/adres';
  //     $('#divdatopreestudio').hide();
  //     $('#content_risk').show();
  //     $('#content_vehiculo').hide();
  //     $('#content_conductor').hide();
  //     $('#tipo_plataforma').val(tipo);
  //     $('#ruta_eviden').val(ruta);
  //     $('#id_totros').val(10);
  //     $('#losbototnes').html('<button class="btn btn-sm btn-success" id="aprobarr7">Aprobar</button>' + '<button class="btn btn-sm btn-danger" id="noaprobarr7">Rechazar</button>');
  //   }

  //   if (valor == '11') {
  //     var tipo = 'Gps';
  //     var ruta = urle + '/gps';
  //     $('#divdatopreestudio').hide();
  //     $('#content_risk').show();
  //     $('#content_vehiculo').hide();
  //     $('#content_conductor').hide();
  //     $('#tipo_plataforma').val(tipo);
  //     $('#ruta_eviden').val(ruta);
  //     $('#id_totros').val(11);
  //     $('#losbototnes').html('<button class="btn btn-sm btn-success" id="aprobarr8">Aprobar</button>' + '<button class="btn btn-sm btn-danger" id="noaprobarr8">Rechazar</button>');
  //   }

  //   if (valor == '12') {
  //     var tipo = 'Dato preestudio';

  //     var ruta = urle + '/dato_preestudio';

  //     //traer el preestudio

  //     $('#content_risk').show();

  //     $('#divdatopreestudio').hide();

  //     $('#content_vehiculo').hide();

  //     $('#content_conductor').hide();

  //     $('#tipo_plataforma').val(tipo);

  //     $('#ruta_eviden').val(ruta);

  //     $('#id_totros').val(12);

  //     $('#losbototnes').html('<button class="btn btn-sm btn-success" id="aprobarr9">Aprobar</button>' + '<button class="btn btn-sm btn-danger" id="noaprobarr9">Rechazar</button>');
  //   }
  // });

  // $('#aprobar_estudio_total').hide();

  // $('#estado_estu').change(function () {
  //   var select = $('#estado_estu').val();

  //   if (select == '') {
  //     $('#aprobar_estudio_total').hide();
  //   }

  //   //validar el estado y que tenga todo aprobado
  //   if (select == 'Aprobado') {
  //     var idvehiculo = $('#idvehiculo').val();

  //     var idconductor = $('#idconductor').val();

  //     var idestudio = $('#idstudy').val();

  //     if (idvehiculo.length > '0' && idconductor.length > '0' && idestudio.length > '0') {
  //       $('#aprobar_estudio_total').show();
  //     } else {
  //       alert('No puede aprobar el estudio falta algún dato de la primera hilera');
  //     }
  //   }

  //   if (select == 'Pendiente') {
  //     var idvehiculo = $('#idvehiculo').val();

  //     var idconductor = $('#idconductor').val();

  //     var idestudio = $('#idstudy').val();

  //     if (idvehiculo.length > '0' && idconductor.length > '0' && idestudio.length > '0') {
  //       $('#aprobar_estudio_total').show();

  //       $('#causalidad').attr('disabled', false);

  //       $('#causalidad').focus();
  //     } else {
  //       alert('No puede poner pendien el estudio falta algún dato de la primera hilera');
  //     }
  //   }

  //   if (select == 'Rechazado') {
  //     var idvehiculo = $('#idvehiculo').val();

  //     var idconductor = $('#idconductor').val();

  //     var idestudio = $('#idstudy').val();

  //     if (idvehiculo.length > '0' && idconductor.length > '0' && idestudio.length > '0') {
  //       $('#aprobar_estudio_total').show();

  //       $('#causalidad').attr('disabled', false);

  //       $('#causalidad').focus();
  //     } else {
  //       alert('No puede rechazar el estudio falta algún dato de la primera hilera');
  //     }
  //   }

  //   if (select == 'Rechazado_modificar') {
  //     var idvehiculo = $('#idvehiculo').val();
  //     var idconductor = $('#idconductor').val();
  //     var idestudio = $('#idstudy').val();

  //     if (idvehiculo.length > '0' && idconductor.length > '0' && idestudio.length > '0') {
  //       $('#aprobar_estudio_total').show();

  //       $('#causalidad').attr('disabled', false);

  //       $('#causalidad').focus();
  //     } else {
  //       alert('No puede poner rechazado para modificar el estudio falta algún dato de la primera hilera');
  //     }
  //   }

  // });
});

async function Litar_solicitudes() {
  try {
    let data = new FormData();
    data.append('estado', d.getElementById('estadotb').value);
    data.append('fecha_inicial', d.getElementById('fecha_inicial').value);
    data.append('fecha_final', d.getElementById('fecha_final').value);
    data.append('placa', d.getElementById('placa_filtro').value);

    if (d.getElementById('prefiltro_seguridad').checked) {
      data.append('prefiltro_seguridad', d.getElementById('prefiltro_seguridad').value);
    } else if (d.getElementById('estudio_seguridad_id').checked) {
      data.append('estudio_seguridad', d.getElementById('estudio_seguridad_id').value);
    }

    await fetch($('#id_url_ajax').val() + 'validacionparametros/Consutar_solicitudes_seguridad', {
      method: 'POST',
      cache: 'no-cache',
      body: data,
    })
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);

        return response.json();
      })
      .then(function (data) {
        cont = 0;

        let tbody = d.getElementById('body_esconder');

        tbody.innerHTML = '';

        if (data != '') {
          data.forEach(element => {
            // d.getElementById('observacion_operaciones_estudio').value = element.observacion_general;
            d.getElementById('solicitud_id').value = element.esoli;
            d.getElementById('vehiculo_id').value = element.idv;

            let col_status = '';
            let title = '';
            let estade = element.estado;
            let operacion = element.operacion;
            let nombre = element.nombre;
            let apellido = element.apellido1;
            let consecutivo = element.id_preestudio; //idpreestudio
            let solicitud = element.esoli ? element.esoli : element.id_estudio; //solicitud preestudio
            let pk = element.placa;
            let id_estudio_c = element.id_estudio_c;

            let estado = '';
            let itr = '';
            let status_es = '';

            if (element.operacio_ejecutada === 'Estudio_de_Seguridad') {
              if (operacion === 'Nuevo' || operacion === 'Habilitar' || operacion === 'Actualizar') {
                /* Validar si esta activo de la creacion de recurso nuevo para cambiar la etiqueda */
                if (operacion === 'Actualizar') {
                  if (element.estado_prefiltro === 'Pendiente' || element.estado_prefiltro === 'Iniciado' || element.estado_prefiltro === 'Rechazado' || element.estado_prefiltro === 'Aprobado') {
                    if (element.estado_creacion === 'TERCERO CREADO') {
                      col_status = '#0D47A1';
                      title = 'Recurso Creado';
                      estado = "<span class='label label-success'  style='background-color:#0D47A1;'>Nuevo recurso creado</span>";
                    } else {
                      if (element.estado_prefiltro === 'Aprobado') {
                        col_status = '#14A44D';
                        title = 'Nuevo recurso Aprobado';
                        estado = "<span class='label label-success'>Nuevo recurso Aprobado</span>";
                      } else if (element.estado_prefiltro === 'Pendiente') {
                        col_status = '#E4A11B';
                        title = 'Nuevo recurso Pendiente';
                        estado = "<span class='label label-warning' style='color:#000;'>Nuevo recurso Pendiente</span>";
                      } else if (element.estado_prefiltro === 'Iniciado') {
                        col_status = '#0D47A1';
                        title = 'Nuevo recurso Iniciado';
                        estado = "<span class='label label-danger' style='background-color:#0D47A1;'>Nuevo recurso Iniciado</span>";
                      } else if (element.estado_prefiltro === 'Rechazado') {
                        col_status = '#F44336';
                        title = 'Nuevo recurso Rechazado';
                        estado = "<span class='label label-warning' style='color:#000;background-color:#F44336;'>Nuevo recurso Rechazado</span>";
                      }
                    }
                    status_es = estado;
                  } else {
                    if (element.estado == 'Aprobado') {
                      col_status = '#14A44D';
                      title = 'Estudio de seguridad aprobado';
                      estado = "<span class='label label-success'>Estudio Aprobado</span>";
                    } else if (element.estado == 'Pendiente') {
                      col_status = '#E4A11B';
                      title = 'Estudio de seguridad Pendiente';
                      estado = "<span class='label label-warning' style='color:#000;'>Estudio Pendiente</span>";
                    } else if (element.estado == 'vencida') {
                      col_status = '#F44336';
                      title = 'Estudio de seguridad Vencido';
                      estado = "<span class='label label-danger' style='background-color:#F44336;'>Estudio Vencido</span>";
                    } else if (element.estado == 'pendiente_iniciar') {
                      col_status = '#E4A11B';
                      title = 'Estudio de seguridad Pendiente por iniciar';
                      estado = "<span class='label label-warning' style='color:#000;background-color:#E4A11B;'>Estudio Pendiente Iniciar</span>";
                    } else if (element.estado == 'iniciado') {
                      col_status = '#0D47A1';
                      title = 'Estudio de seguridad iniciado';
                      estado = "<span class='label label-primary'>Estudio Iniciado</span>";
                    } else if (element.estado == 'Rechazado') {
                      col_status = '#F44336';
                      title = 'Estudio de seguridad rechazado';
                      estado = "<span class='label label-danger' style='background-color:#F44336;' >Estudio Rechazado</span>";
                    } else if (element.estado == 'cancelado') {
                      col_status = '#D50000';
                      title = 'Estudio de seguridad cancelado';
                      estado = "<span class='label label-danger'>Estudio Cancelado</span>";
                    } else if (element.estado == 'Rechazado_modificar') {
                      col_status = '#F44336';
                      title = 'Estudio de seguridad rechazado para modificar';
                      estado = "<span class='label label-warning' style='color:#FFF;background-color:#F44336;'>Estudio Rechazado para modificar</span>";
                    }
                    status_es = estado;
                  }
                } else {
                  if (element.estado == 'Aprobado') {
                    col_status = '#14A44D';
                    title = 'Estudio de seguridad aprobado';
                    estado = "<span class='label label-success'>Estudio Aprobado</span>";
                  } else if (element.estado == 'Pendiente') {
                    col_status = '#E4A11B';
                    title = 'Estudio de seguridad Pendiente';
                    estado = "<span class='label label-warning' style='color:#000;'>Estudio Pendiente</span>";
                  } else if (element.estado == 'vencida') {
                    col_status = '#F44336';
                    title = 'Estudio de seguridad Vencido';
                    estado = "<span class='label label-danger' style='background-color:#F44336;'>Estudio Vencido</span>";
                  } else if (element.estado == 'pendiente_iniciar') {
                    col_status = '#E4A11B';
                    title = 'Estudio de seguridad Pendiente por iniciar';
                    estado = "<span class='label label-warning' style='color:#000;background-color:#E4A11B;'>Estudio Pendiente Iniciar</span>";
                  } else if (element.estado == 'iniciado') {
                    col_status = '#0D47A1';
                    title = 'Estudio de seguridad iniciado';
                    estado = "<span class='label label-primary'>Estudio Iniciado</span>";
                  } else if (element.estado == 'Rechazado') {
                    col_status = '#F44336';
                    title = 'Estudio de seguridad rechazado';
                    estado = "<span class='label label-danger' style='background-color:#F44336;' >Estudio Rechazado</span>";
                  } else if (element.estado == 'cancelado') {
                    col_status = '#D50000';
                    title = 'Estudio de seguridad cancelado';
                    estado = "<span class='label label-danger'>Estudio Cancelado</span>";
                  } else if (element.estado == 'Rechazado_modificar') {
                    col_status = '#F44336';
                    title = 'Estudio de seguridad rechazado para modificar';
                    estado = "<span class='label label-warning' style='color:#FFF;background-color:#F44336;'>Estudio Rechazado para modificar</span>";
                  }
                  status_es = estado;
                }
              }
            } else {
              if (operacion === 'Nuevo') {
                if (element.estado == 'aprobado') {
                  col_status = '#14A44D';
                  title = 'Prefiltro aprobado Autoriza HV';
                  estado = "<span class='label label-success'>Prefiltro Aprobado</span>";
                } else if (element.estado == 'pendiente') {
                  col_status = '#E4A11B';
                  title = 'Prefiltro Pendiente';
                  estado = "<span class='label label-warning'>Prefiltro Pendiente</span>";
                } else if (element.estado == 'vencida') {
                  col_status = '#5D4037';
                  title = 'Prefiltro Vencido';
                  estado = "<span class='label label-danger'>Prefiltro Vencido</span>";
                } else if (element.estado == 'pendiente_iniciar') {
                  col_status = '#332D2D';
                  title = 'Prefiltro Pendiente por iniciar';
                  estado = "<span class='label label-warning'>Prefiltro Pendiente Iniciar</span>";
                } else if (element.estado == 'iniciado') {
                  col_status = '#0D47A1';
                  title = 'Prefiltro iniciado';
                  estado = "<span class='label label-success'>Prefiltro Iniciado</span>";
                } else if (element.estado == 'rechazado') {
                  col_status = '#DC4C64';
                  title = 'Prefiltro rechazado';
                  estado = "<span class='label label-danger'>Prefiltro Rechazado</span>";
                } else if (element.estado == 'cancelado') {
                  col_status = '#D50000';
                  title = 'Prefiltro cancelado';
                  estado = "<span class='label label-danger'>Prefiltro Cancelado</span>";
                } else if (element.estado == 'Rechazado_modificar') {
                  col_status = '#F44336';
                  title = 'Prefiltro rechazado para modificar';
                  estado = "<span class='label label-warning'>Prefiltro Rechazado para modificar</span>";
                }
                status_e = element.campo;
                status_es = estado;
              }
            }

            /* Validar si es Itr */
            if (element.itr === 'SI') {
              itr = '<span class="label label-success">Si</span>';
            } else {
              itr = '<span class="label label-danger">No</span>';
            }

            const fila = d.createElement('tr');
            const columnaEstado = d.createElement('td');
            columnaEstado.style.color = `${col_status}`;
            columnaEstado.innerHTML = `<span class="mdi mdi-dot-circle icon" title="${title}"></span>`;
            const columnaSolicitud = d.createElement('td');
            columnaSolicitud.textContent = element.esoli ? element.esoli : element.id_estudio;
            const columnaItr = d.createElement('td');
            columnaItr.innerHTML = itr;
            const columnaFecha = d.createElement('td');
            columnaFecha.textContent = element.fecha;
            const columnaHora = d.createElement('td');
            columnaHora.textContent = element.hora;
            const columnaPlaca = d.createElement('td');
            columnaPlaca.textContent = element.placa;
            const columnaOperacion = d.createElement('td');
            columnaOperacion.textContent = element.operacion;
            const columnaSolicitudEstudio = d.createElement('td');
            columnaSolicitudEstudio.innerHTML = status_es;
            columnaSolicitudEstudio.setAttribute('width', '120px');
            columnaSolicitudEstudio.classList.add('text-center');
            /* Columna de acciones */

            const columnaAcciones = d.createElement('td');
            // Validamos is el prefiltro esta en pediente de iniciar
            if (element.operacion === 'Nuevo' || element.operacion === 'Habilitar' || element.operacion === 'Actualizar') {
              if (element.operacion === 'Nuevo' && element.operacio_ejecutada === 'Estudio_de_Seguridad' && element.estado_actual === 1) {
                if (element.estado === 'Rechazado_modificar' || element.estado === 'Pendiente') {
                  columnaAcciones.innerHTML = `
                  <div class="btn-group btn-space">
                    <div class="btn-group" role="group" aria-label="Basic example"> 
                        <button type="button" class="btn btn-success  btn-sm" title="Lista comprobación (Estudio Seguridad)" id="btn_listado" 
                        data-toggle="modal" data-target="#ver_lista" data-id="#" data-id2="${solicitud}"  data-id3="#" ><span class="mdi mdi-key"></span>
                          <input type="hidden" class="soli_id" value="${solicitud}">
                          <input type="hidden" class="pla_id" value="${pk}">
                          <input type="hidden" class="nombre" value="${nombre}">
                          <input type="hidden" class="apellido" value="${apellido}">
                          <input type="hidden" class="estado_actual" value="${estado}">
                          <input type="hidden" class="estado_estudio" value="${element.estado}">
                          <input type="hidden" class="conductor_num_documento" value="${element.numero_documento}">
                          <input type="hidden" class="conductor_id" value="${element.id_conductor}">
                          <input type="hidden" class="vehiculo_id" value="${element.id_vehiculo}">
                          <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                          <input type="hidden" class="estado_estudio" value="${element.estado}">
                          <input type="hidden" class="observacion_general" value="${element.observacion_general}">
                          <input type="hidden" class="escenarioId" value="${element.escenario_id}">
                        </button>  

                        <button type="button" class="btn btn-warning btn-sm" title="Respuestas de operaciones (Estudio de seguridad)" id="btn_respuestas_operaciones"
                            data-toggle="modal" data-target="#ver_rta_operaciones" data-id="#" data-id2="${solicitud}"  data-id3="#" ><span class="mdi mdi-balance"></span>
                            <input type="hidden" class="soli_id" value="${solicitud}">
                            <input type="hidden" class="pla_id" value="${pk}">
                            <input type="hidden" class="nombre" value="${nombre}">
                            <input type="hidden" class="apellido" value="${apellido}">
                            <input type="hidden" class="estado_actual" value="${estado}">
                        </button> 
                    </div>
                  </div>`;
                } else {
                  columnaAcciones.innerHTML = `
                  <div class="btn-group btn-space">
                    <div class="btn-group" role="group" aria-label="Basic example"> 
                        <button type="button" class="btn btn-success  btn-sm" title="Lista comprobación (Estudio Seguridad)" id="btn_listado" 
                              data-toggle="modal" data-target="#ver_lista" data-id="#" data-id2="${solicitud}"  data-id3="#" ><span class="mdi mdi-key"></span>
                            <input type="hidden" class="soli_id" value="${solicitud}">
                            <input type="hidden" class="pla_id" value="${pk}">
                            <input type="hidden" class="nombre" value="${nombre}">
                            <input type="hidden" class="apellido" value="${apellido}">
                            <input type="hidden" class="estado_actual" value="${estado}">
                            <input type="hidden" class="estado_estudio" value="${element.estado}">
                            <input type="hidden" class="conductor_num_documento" value="${element.numero_documento}">
                            <input type="hidden" class="conductor_id" value="${element.id_conductor}">
                            <input type="hidden" class="vehiculo_id" value="${element.id_vehiculo}">
                            <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                            <input type="hidden" class="observacion_general" value="${element.observacion_general}">
                            <input type="hidden" class="escenarioId" value="${element.escenario_id}">
                        </button>  

                        <button type="button" class="btn btn-warning btn-sm" title="Respuestas de operaciones (Estudio de seguridad)" id="btn_respuestas_operaciones"
                            data-toggle="modal" data-target="#ver_rta_operaciones" data-id="#" data-id2="${solicitud}"  data-id3="#" ><span class="mdi mdi-balance"></span>
                            <input type="hidden" class="soli_id" value="${solicitud}">
                            <input type="hidden" class="pla_id" value="${pk}">
                            <input type="hidden" class="nombre" value="${nombre}">
                            <input type="hidden" class="apellido" value="${apellido}">
                            <input type="hidden" class="estado_actual" value="${estado}">
                        </button>
                    </div>
                  </div>`;
                }
              } else if (element.operacion === 'Habilitar' || (element.operacion === 'Actualizar' && element.operacio_ejecutada === 'Estudio_de_Seguridad' && element.estado_actual === 1)) {
                if (element.estado === 'Rechazado_modificar' || element.estado === 'Pendiente') {
                  let upnuevo;
                  if (
                    element.operacio_ejecutada === 'Estudio_de_Seguridad' &&
                    element.operacion === 'Actualizar' &&
                    element.estado_actual === '1' &&
                    element.estado === 'Pendiente' &&
                    element.estado === 'Rechazado_modificar'
                  ) {
                    upnuevo = `<button type="button" class="btn btn-danger btn-sm" title="Listado de prefiltro nuevo recurso" id="btn_listado_nuevo"
                    data-toggle="modal" data-target="#ver_lista_prefiltro_nuevo_recurso"><i class="fas fa-clipboard-list"></i>
                    <input type="hidden" class="soli_id" value="${solicitud}">
                    <input type="hidden" class="pla_id" value="${pk}">
                    <input type="hidden" class="nombre" value="${nombre}">
                    <input type="hidden" class="apellido" value="${apellido}">
                    <input type="hidden" class="estado_actual" value="${estado}">`;
                  } else {
                    upnuevo = '';
                  }
                  columnaAcciones.innerHTML = `
                <div class="btn-group btn-space">
                  <div class="btn-group" role="group" aria-label="Basic example"> 
                      <button type="button" class="btn btn-success btn-sm" title="Lista comprobación (Estudio Seguridad)" id="btn_listado" 
                            data-toggle="modal" data-target="#ver_lista" data-id="#" data-id2="${solicitud}" data-id3="#"><span class="mdi mdi-key"></span>
                          <input type="hidden" class="soli_id" value="${solicitud}">
                          <input type="hidden" class="pla_id" value="${pk}">
                          <input type="hidden" class="nombre" value="${nombre}">
                          <input type="hidden" class="apellido" value="${apellido}">
                          <input type="hidden" class="estado_actual" value="${estado}">
                          <input type="hidden" class="estado_estudio" value="${element.estado}">
                          <input type="hidden" class="conductor_id" value="${element.id_conductor}">
                          <input type="hidden" class="conductor_num_documento" value="${element.numero_documento}">
                          <input type="hidden" class="vehiculo_id" value="${element.id_vehiculo}">
                          <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                          <input type="hidden" class="observacion_general" value="${element.observacion_general}">
                          <input type="hidden" class="escenarioId" value="${element.escenario_id}">
                      </button> 

                      <button type="button" class="btn btn-warning btn-sm" title="Respuestas de operaciones (Estudio de seguridad)" id="btn_respuestas_operaciones"
                          data-toggle="modal" data-target="#ver_rta_operaciones" data-id="#" data-id2="${solicitud}" data-id3="#"><span class="mdi mdi-balance"></span>
                        <input type="hidden" class="soli_id" value="${solicitud}">
                        <input type="hidden" class="pla_id" value="${pk}">
                        <input type="hidden" class="nombre" value="${nombre}">
                        <input type="hidden" class="apellido" value="${apellido}">
                        <input type="hidden" class="estado_actual" value="${estado}">
                      </button> 
                       ${upnuevo} 
                  </div>
                </div>`;
                } else {
                  if (element.estado_prefiltro === 'Pendiente' || element.estado_prefiltro === 'Iniciado') {
                    let upnuevo;
                    if (
                      (element.operacio_ejecutada === 'Estudio_de_Seguridad' && element.operacion === 'Actualizar' && element.estado_actual === 1 && element.estado === 'Pendiente') ||
                      element.estado === 'Rechazado_modificar'
                    ) {
                      upnuevo = `<button type="button" class="btn btn-danger btn-sm" title="Listado de prefiltro nuevo recurso" id="btn_listado_nuevo"
                        data-toggle="modal" data-target="#ver_lista_prefiltro_nuevo_recurso"><i class="fas fa-clipboard-list"></i>
                        <input type="hidden" class="soli_id" value="${solicitud}">
                        <input type="hidden" class="pla_id" value="${pk}">
                        <input type="hidden" class="nombre" value="${nombre}">
                        <input type="hidden" class="apellido" value="${apellido}">
                        <input type="hidden" class="estado_actual" value="${estado}">`;
                    } else {
                      // upnuevo = '';
                      upnuevo = `<button type="button" class="btn btn-danger btn-sm" title="Listado de prefiltro nuevo recurso" id="btn_listado_nuevo"
                        data-toggle="modal" data-target="#ver_lista_prefiltro_nuevo_recurso"><i class="fas fa-clipboard-list"></i>
                        <input type="hidden" class="soli_id" value="${solicitud}">
                        <input type="hidden" class="pla_id" value="${pk}">
                        <input type="hidden" class="nombre" value="${nombre}">
                        <input type="hidden" class="apellido" value="${apellido}">
                        <input type="hidden" class="estado_actual" value="${estado}">`;
                    }
                    columnaAcciones.innerHTML = `
                      <div class="btn-group btn-space">
                        <div class="btn-group" role="group" aria-label="Basic example"> 
                            <button type="button" class="btn btn-warning btn-sm" title="Respuestas de operaciones (Estudio de seguridad)" id="btn_respuestas_operaciones"
                              data-toggle="modal" data-target="#ver_rta_operaciones" data-id="#" data-id2="${solicitud}" data-id3="#"><span class="mdi mdi-balance"></span>
                              <input type="hidden" class="soli_id" value="${solicitud}">
                              <input type="hidden" class="pla_id" value="${pk}">
                              <input type="hidden" class="nombre" value="${nombre}">
                              <input type="hidden" class="apellido" value="${apellido}">
                              <input type="hidden" class="estado_actual" value="${estado}">
                            </button>
                            <button type="button" class="btn btn-danger btn-sm" title="Listado de prefiltro nuevo recurso" id="btn_listado_nuevo"
                              data-toggle="modal" data-target="#ver_lista_prefiltro_nuevo_recurso"><i class="fas fa-clipboard-list"></i>
                              <input type="hidden" class="soli_id" value="${solicitud}">
                              <input type="hidden" class="pla_id" value="${pk}">
                              <input type="hidden" class="nombre" value="${nombre}">
                              <input type="hidden" class="apellido" value="${apellido}">
                              <input type="hidden" class="estado_actual" value="${estado}">
                          </button>
                          
                      </div>
                    </div>`;
                  } else if (element.estado_prefiltro === 'Aprobado' || element.estado_prefiltro === 'Rechazado') {
                    columnaAcciones.innerHTML = `
                    <div class="btn-group btn-space">
                      <div class="btn-group" role="group" aria-label="Basic example"> 
                          <button type="button" class="btn btn-success  btn-sm" title="Lista comprobación (Estudio Seguridad)" id="btn_listado" 
                                data-toggle="modal" data-target="#ver_lista" data-id="#" data-id2="${solicitud}"  data-id3="#" ><span class="mdi mdi-key"></span>
                              <input type="hidden" class="soli_id" value="${solicitud}">
                              <input type="hidden" class="pla_id" value="${pk}">
                              <input type="hidden" class="nombre" value="${nombre}">
                              <input type="hidden" class="apellido" value="${apellido}">
                              <input type="hidden" class="estado_actual" value="${estado}">
                              <input type="hidden" class="estado_estudio" value="${element.estado}">
                              <input type="hidden" class="conductor_id" value="${element.id_conductor}">
                              <input type="hidden" class="conductor_num_documento" value="${element.numero_documento}">
                              <input type="hidden" class="vehiculo_id" value="${element.id_vehiculo}">
                              <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                              <input type="hidden" class="observacion_general" value="${element.observacion_general}">
                              <input type="hidden" class="escenarioId" value="${element.escenario_id}">
                          </button>
                          <button type="button" class="btn btn-warning btn-sm" title="Respuestas de operaciones (Estudio de seguridad)" id="btn_respuestas_operaciones"
                            data-toggle="modal" data-target="#ver_rta_operaciones" data-id="#" data-id2="${solicitud}" data-id3="#"><span class="mdi mdi-balance"></span>
                            <input type="hidden" class="soli_id" value="${solicitud}">
                            <input type="hidden" class="pla_id" value="${pk}">
                            <input type="hidden" class="nombre" value="${nombre}">
                            <input type="hidden" class="apellido" value="${apellido}">
                            <input type="hidden" class="estado_actual" value="${estado}">
                          </button>
                          <button type="button" class="btn btn-danger btn-sm" title="Listado de prefiltro nuevo recurso" id="btn_listado_nuevo"
                            data-toggle="modal" data-target="#ver_lista_prefiltro_nuevo_recurso"><i class="fas fa-clipboard-list"></i>
                            <input type="hidden" class="soli_id" value="${solicitud}">
                            <input type="hidden" class="pla_id" value="${pk}">
                            <input type="hidden" class="nombre" value="${nombre}">
                            <input type="hidden" class="apellido" value="${apellido}">
                            <input type="hidden" class="estado_actual" value="${estado}">
                        </button>
                      </div>
                    </div>`;
                  } else {
                    columnaAcciones.innerHTML = `
                    <div class="btn-group btn-space">
                      <div class="btn-group" role="group" aria-label="Basic example"> 
                          <button type="button" class="btn btn-success  btn-sm" title="Lista comprobación (Estudio Seguridad)" id="btn_listado" 
                                data-toggle="modal" data-target="#ver_lista" data-id="#" data-id2="${solicitud}"  data-id3="#" ><span class="mdi mdi-key"></span>
                              <input type="hidden" class="soli_id" value="${solicitud}">
                              <input type="hidden" class="pla_id" value="${pk}">
                              <input type="hidden" class="nombre" value="${nombre}">
                              <input type="hidden" class="apellido" value="${apellido}">
                              <input type="hidden" class="estado_actual" value="${estado}">
                              <input type="hidden" class="estado_estudio" value="${element.estado}">
                              <input type="hidden" class="conductor_id" value="${element.id_conductor}">
                              <input type="hidden" class="conductor_num_documento" value="${element.numero_documento}">
                              <input type="hidden" class="vehiculo_id" value="${element.id_vehiculo}">
                              <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                              <input type="hidden" class="observacion_general" value="${element.observacion_general}">
                              <input type="hidden" class="escenarioId" value="${element.escenario_id}">
                          </button>
                          <button type="button" class="btn btn-warning btn-sm" title="Respuestas de operaciones (Estudio de seguridad)" id="btn_respuestas_operaciones"
                            data-toggle="modal" data-target="#ver_rta_operaciones" data-id="#" data-id2="${solicitud}" data-id3="#"><span class="mdi mdi-balance"></span>
                            <input type="hidden" class="soli_id" value="${solicitud}">
                            <input type="hidden" class="pla_id" value="${pk}">
                            <input type="hidden" class="nombre" value="${nombre}">
                            <input type="hidden" class="apellido" value="${apellido}">
                            <input type="hidden" class="estado_actual" value="${estado}">
                        </button>
                      </div>
                    </div>`;
                  }
                  {
                  }
                }
              } else {
                //prefiltro
                if (element.estado === 'pendiente_iniciar' || (element.estado === 'rechazado para modificar' && element.estado_actual === 1)) {
                  $('#iniciaprefiltro').show();
                  columnaAcciones.innerHTML = `
                <div class="btn-group btn-space">
                   <div class="btn-group" role="group" aria-label="Basic example"> 
                      <button type="button" class="btn btn-info btn-sm" title="consultar preestudio" id="btn_ver" 
                        data-toggle="modal" data-target="#consultesolicitud" data-id="${consecutivo}" data-id2="${solicitud}"  data-id3="${estade}" ><i class="mdi mdi-eye"></i>
                        <input type="hidden" class="soli_id" value="${solicitud}">
                        <input type="hidden" class="pre_id" value="${consecutivo}">
                      </button> 

                      <button type="button" class="btn btn-warning btn-sm" data-hint="Lista comrpobacion prefiltro" data-id="${element.esoli}" id="btn-lista"
                          data-id2="${element.idv}" data-id3="${element.placa}" data-toggle="modal" data-target="#ver_lista_prefiltro" ><i class="mdi mdi-assignment"></i>
                          <input type="hidden" class="soli_id" value="${solicitud}">
                          <input type="hidden" class="pre_id" value="${consecutivo}">
                          <input type="hidden" class="placa_id" value="${element.placa}">
                       </button> 
                   </div>
                </div>`;
                } else if (element.estado === 'iniciado' && element.estado_actual === 1) {
                  columnaAcciones.innerHTML = `
                <div class="btn-group btn-space">
                   <div class="btn-group" role="group" aria-label="Basic example">
                      <button type="button" class="btn btn-info btn-sm" title="consultar preestudio" id="btn_ver" 
                        data-toggle="modal" data-target="#consultesolicitud"  data-id="${consecutivo}" data-id2="${solicitud}" data-id3="${estade}" ><i class="mdi mdi-eye"></i>
                        <input type="hidden" class="soli_id" value="${solicitud}">
                        <input type="hidden" class="pre_id" value="${consecutivo}">
                      </button> 

                      <button type="button" class="btn btn-warning btn-sm" data-hint="Lista comrpobacion prefiltro" data-id="${element.esoli}"
                          data-id2="${element.idv}" data-id3="${element.placa}" data-toggle="modal" data-target="#ver_lista_prefiltro" id="btn-lista"><span class="mdi mdi-calendar-note"></span>
                          <input type="hidden" class="soli_id" value="${solicitud}">
                          <input type="hidden" class="pre_id" value="${consecutivo}">
                          <input type="hidden" class="placa_id" value="${element.placa}">
                      </button> 
                   </div>
                </div>`;
                } else if (element.estado === 'pendiente' && element.estado_actual === 1) {
                  columnaAcciones.innerHTML = `

                <div class="btn-group btn-space">
                   <div class="btn-group" role="group" aria-label="Basic example"> 
                      <button type="button" class="btn btn-info btn-sm" title="consultar preestudio" id="btn_ver" 
                        data-toggle="modal" data-target="#consultesolicitud"  data-id="${consecutivo}" data-id2="${solicitud}" data-id3="${estade}" ><i class="mdi mdi-eye"></i>
                        <input type="hidden" class="soli_id" value="${solicitud}">
                        <input type="hidden" class="pre_id" value="${consecutivo}">
                      </button> 

                      <button type="button" class="btn btn-warning btn-sm" data-hint="Lista comrpobacion prefiltro" data-id="${element.esoli}"
                          data-id2="${element.idv}" data-id3="${element.placa}" data-toggle="modal" data-target="#ver_lista_prefiltro" id="btn-lista"><span class="mdi mdi-calendar-note"></span>
                          <input type="hidden" class="soli_id" value="${solicitud}">
                          <input type="hidden" class="pre_id" value="${consecutivo}">
                          <input type="hidden" class="placa_id" value="${element.placa}">
                      </button> 
                   </div>
                </div>`;
                } else if (element.estado === 'aprobado' && element.estado_actual === 1) {
                  if (element.soli_estudio === 'NO') {
                    columnaAcciones.innerHTML = `
                  <div class="btn-group btn-space">
                     <div class="btn-group" role="group" aria-label="Basic example"> 
                        <button type="button" class="btn btn-info btn-sm" title="consultar preestudio" id="btn_ver" 
                          data-toggle="modal" data-target="#consultesolicitud"  data-id="${consecutivo}" data-id2="${solicitud}" data-id3="${estade}" ><i class="mdi mdi-eye"></i>
                          <input type="hidden" class="soli_id" value="${solicitud}">
                          <input type="hidden" class="pre_id" value="${consecutivo}">
                        </button> 
                     </div>
                  </div>`;
                  } else {
                    columnaAcciones.innerHTML = `
                  <div class="btn-group btn-space">
                     <div class="btn-group" role="group" aria-label="Basic example"> 
                        <button type="button" class="btn btn-info btn-sm" title="consultar preestudio" id="btn_ver" 
                          data-toggle="modal" data-target="#consultesolicitud"  data-id="${consecutivo}" data-id2="${solicitud}" data-id3="${estade}" ><i class="mdi mdi-eye"></i>
                          <input type="hidden" class="soli_id" value="${solicitud}">
                          <input type="hidden" class="pre_id" value="${consecutivo}">
                        </button> 
                     </div>
                  </div>`;
                  }
                } else if (element.estado === 'cancelado' && element.estado_actual === 1) {
                  columnaAcciones.innerHTML = `
                <div class="btn-group btn-space">
                   <div class="btn-group" role="group" aria-label="Basic example"> 
                      <button type="button" class="btn btn-info btn-sm" title="consultar preestudio" id="btn_ver" 
                        data-toggle="modal" data-target="#consultesolicitud" data-id="${consecutivo}" data-id2="${solicitud}"  data-id3="${estade}" ><i class="mdi mdi-eye"></i>
                        <input type="hidden" class="soli_id" value="${solicitud}">
                        <input type="hidden" class="pre_id" value="${consecutivo}">
                      </button>
                   </div>
                </div>`;
                } else if (element.estado === 'rechazado' && element.estado_actual === 1) {
                  columnaAcciones.innerHTML = `
                <div class="btn-group btn-space">
                   <div class="btn-group" role="group" aria-label="Basic example"> 
                      <button type="button" class="btn btn-info btn-sm" title="consultar preestudio" id="btn_ver" 
                        data-toggle="modal" data-target="#consultesolicitud" data-id="${consecutivo}" data-id2="${solicitud}"  data-id3="${estade}" ><i class="mdi mdi-eye"></i>
                        <input type="hidden" class="soli_id" value="${solicitud}">
                        <input type="hidden" class="pre_id" value="${consecutivo}">
                      </button>
                   </div>
                </div>`;
                }
              }
            }
            fila.appendChild(columnaEstado);
            fila.appendChild(columnaSolicitud);
            fila.appendChild(columnaItr);
            fila.appendChild(columnaFecha);
            fila.appendChild(columnaHora);
            fila.appendChild(columnaPlaca);
            fila.appendChild(columnaOperacion);
            fila.appendChild(columnaSolicitudEstudio);
            fila.appendChild(columnaAcciones);
            // Rendreizar la tabla
            tbody.appendChild(fila);
          });
        } else {
          tbody.innerHTML = '';
          const fila = d.createElement('tr');
          const columnaDatos = d.createElement('td');
          columnaDatos.setAttribute('colspan', '8');
          columnaDatos.classList.add('text-center');
          columnaDatos.textContent = 'No hay resultados de la operación';
          fila.appendChild(columnaDatos);
          // Rendreizar la tabla
          tbody.appendChild(fila);
        }
      })
      .catch(error => {
        alert(error);
      });
  } catch (error) { }
}

async function Listar_datos_prefiltro_nuevo_recurso(solicitud_id, placa) {
  let data = new FormData();
  data.append('solicitud_id', solicitud_id);
  fetch($('#id_url_ajax').val() + 'validacionparametros/verificar_datos_nuevos', {
    method: 'POST',
    cache: 'no-cache',
    body: data,
  })
    .then(response => response.json())
    .then(function (data) {
      // d.getElementById('tbl_datos').innerHTML = '';
      if (data) {
        /* VALIDART LOS ESTADOS DEL PREFILTRO NUEVO */
        if (data.estado_prefiltro === 'Pendiente') {
          d.getElementById('estado_prefiltro_recurso_nuevo').innerHTML = data.estado_prefiltro;
          d.getElementById('estado_prefiltro_recurso_nuevo').style.backgroundColor = '#E4A11B';
          d.getElementById('estado_prefiltro_recurso_nuevo').style.color = '#FFFFFF';
          var select = document.getElementById('estado_prefiltro_nuevo');
          select.disabled = false;
          var options = select.options;
          for (var i = 0; i < options.length; i++) {
            if (options[i].value === data.estado_prefiltro) {
              options[i].disabled = true;
              break; // Terminar el bucle ya que hemos encontrado la opción correspondiente
            } else {
              options[i].disabled = false;
            }
          }
          var btn = document.getElementById('btn_guardar_prefiltro_nuevo');
          btn.disabled = false;
        } else if (data.estado_prefiltro === 'Iniciado') {
          d.getElementById('estado_prefiltro_recurso_nuevo').innerHTML = data.estado_prefiltro;
          d.getElementById('estado_prefiltro_recurso_nuevo').style.backgroundColor = '#54B4D3';
          d.getElementById('estado_prefiltro_recurso_nuevo').style.color = '#FFFFFF';
          var select = document.getElementById('estado_prefiltro_nuevo');
          select.disabled = false;
          var options = select.options;
          for (var i = 0; i < options.length; i++) {
            if (options[i].value === data.estado_prefiltro) {
              options[i].disabled = true;
              break; // Terminar el bucle ya que hemos encontrado la opción correspondiente
            }
          }
          Litar_solicitudes();
          var btn = document.getElementById('btn_guardar_prefiltro_nuevo');
          btn.disabled = false;
        } else if (data.estado_prefiltro === 'Rechazado') {
          d.getElementById('estado_prefiltro_recurso_nuevo').innerHTML = data.estado_prefiltro;
          d.getElementById('estado_prefiltro_recurso_nuevo').style.backgroundColor = '#DC4C64';
          d.getElementById('estado_prefiltro_recurso_nuevo').style.color = '#FFFFFF';
          var select = document.getElementById('estado_prefiltro_nuevo');
          select.disabled = true;
          Litar_solicitudes();
          var btn = document.getElementById('btn_guardar_prefiltro_nuevo');
          btn.disabled = true;
        } else if (data.estado_prefiltro === 'Aprobado') {
          d.getElementById('estado_prefiltro_recurso_nuevo').innerHTML = data.estado_prefiltro;
          d.getElementById('estado_prefiltro_recurso_nuevo').style.backgroundColor = '#14A44D';
          d.getElementById('estado_prefiltro_recurso_nuevo').style.color = '#FFFFFF';
          var select = document.getElementById('estado_prefiltro_nuevo');
          select.disabled = true;
          Litar_solicitudes();
          var btn = document.getElementById('btn_guardar_prefiltro_nuevo');
          btn.disabled = true;
        }

        d.getElementById('num_solicitud').innerHTML = data.id_estudio;
        d.getElementById('placa_solicitud').innerHTML = data.placa_vehiculo;
        d.getElementById('solicitud_fecha').innerHTML = data.fecha;
        d.getElementById('solicitud_hora').innerHTML = data.hora;
        d.getElementById('solicitud_user').innerHTML = data.usuario;

        var tabla_datos = d.getElementById('tbl_datos');
        tabla_datos.innerHTML = '';
        /* Propietario */
        if (data.propietario === '1') {
          const filasp = d.createElement('tr');
          const columnaTituloPropietario = d.createElement('th');
          columnaTituloPropietario.innerHTML = 'Nombre Propietario';
          columnaTituloPropietario.style.backgroundColor = '#F5F5F5';
          columnaTituloPropietario.style.fontWeight = 'bold';
          columnaTituloPropietario.style.fontSize = '12px';
          columnaTituloPropietario.style.border = '1px solid #ddd';
          columnaTituloPropietario.style.width = 'auto';
          columnaTituloPropietario.style.whiteSpace = 'nowrap';
          const columnaNombrePropietario = d.createElement('td');
          columnaNombrePropietario.textContent = data.name_propietario;
          const columnaTitulo2Propietario = d.createElement('th');
          columnaTitulo2Propietario.innerHTML = 'Documento';
          columnaTitulo2Propietario.style.backgroundColor = '#F5F5F5';
          columnaTitulo2Propietario.style.fontWeight = 'bold';
          columnaTitulo2Propietario.style.fontSize = '12px';
          columnaTitulo2Propietario.style.border = '1px solid #ddd';
          columnaTitulo2Propietario.style.width = 'auto';
          columnaTitulo2Propietario.style.whiteSpace = 'nowrap';
          const columnaDocumentoPropietario = d.createElement('td');
          columnaDocumentoPropietario.textContent = data.documento_propietario;
          filasp.appendChild(columnaTituloPropietario);
          filasp.appendChild(columnaNombrePropietario);
          filasp.appendChild(columnaTitulo2Propietario);
          filasp.appendChild(columnaDocumentoPropietario);
          // Rendreizar la tabla
          tabla_datos.appendChild(filasp);
        } else {
          // d.getElementById('propietario_nuevo').textContent = '';
          // d.getElementById('documento_propietario_nuevo').textContent = '';
          // d.getElementById('tr_propietario').style.display = 'none';
          // d.getElementById('tr_propietarion').style.display = 'none';
          // d.getElementById('tr_propietariod').style.display = 'none';
        }

        // /* Poseedor */
        if (data.poseedor === '1') {
          const filaspos = d.createElement('tr');
          const columnaTituloPoseedor = d.createElement('th');
          columnaTituloPoseedor.innerHTML = 'Nombre Poseedor';
          columnaTituloPoseedor.style.backgroundColor = '#F5F5F5';
          columnaTituloPoseedor.style.fontWeight = 'bold';
          columnaTituloPoseedor.style.fontSize = '12px';
          columnaTituloPoseedor.style.border = '1px solid #ddd';
          columnaTituloPoseedor.style.width = 'auto';
          columnaTituloPoseedor.style.whiteSpace = 'nowrap';
          const columnaNombrePoseedor = d.createElement('td');
          columnaNombrePoseedor.textContent = data.name_poseedor;
          const columnaTitulo2Poseedor = d.createElement('th');
          columnaTitulo2Poseedor.innerHTML = 'Documento';
          columnaTitulo2Poseedor.style.backgroundColor = '#F5F5F5';
          columnaTitulo2Poseedor.style.fontWeight = 'bold';
          columnaTitulo2Poseedor.style.fontSize = '12px';
          columnaTitulo2Poseedor.style.border = '1px solid #ddd';
          columnaTitulo2Poseedor.style.width = 'auto';
          columnaTitulo2Poseedor.style.whiteSpace = 'nowrap';
          const columnaDocumentoPoseedor = d.createElement('td');
          columnaDocumentoPoseedor.textContent = data.documento_poseedor;
          filaspos.appendChild(columnaTituloPoseedor);
          filaspos.appendChild(columnaNombrePoseedor);
          filaspos.appendChild(columnaTitulo2Poseedor);
          filaspos.appendChild(columnaDocumentoPoseedor);
          // Rendreizar la tabla
          tabla_datos.appendChild(filaspos);
        } else {
          // d.getElementById('tr_poseedorn').style.display = 'none';
          // d.getElementById('tr_poseedord').style.display = 'none';
          // d.getElementById('tenedor_nuevo').textContent = '';
          // d.getElementById('documento_tenedor_nuevo').textContent = '';
        }

        // /* Conductor */
        if (data.conductor === '1') {
          const filascond = d.createElement('tr');
          const columnaTituloConductor = d.createElement('th');
          columnaTituloConductor.innerHTML = 'Nombre Conductor';
          columnaTituloConductor.style.backgroundColor = '#F5F5F5';
          columnaTituloConductor.style.fontWeight = 'bold';
          columnaTituloConductor.style.fontSize = '12px';
          columnaTituloConductor.style.border = '1px solid #ddd';
          columnaTituloConductor.style.width = 'auto';
          columnaTituloConductor.style.whiteSpace = 'nowrap';
          const columnaNombreConductor = d.createElement('td');
          columnaNombreConductor.textContent = data.name_conductor;
          const columnaTitulo2Conductor = d.createElement('th');
          columnaTitulo2Conductor.innerHTML = 'Documento';
          columnaTitulo2Conductor.style.backgroundColor = '#F5F5F5';
          columnaTitulo2Conductor.style.fontWeight = 'bold';
          columnaTitulo2Conductor.style.fontSize = '12px';
          columnaTitulo2Conductor.style.border = '1px solid #ddd';
          columnaTitulo2Conductor.style.width = 'auto';
          columnaTitulo2Conductor.style.whiteSpace = 'nowrap';
          const columnaDocumentoConductor = d.createElement('td');
          columnaDocumentoConductor.textContent = data.documento_conductor;
          filascond.appendChild(columnaTituloConductor);
          filascond.appendChild(columnaNombreConductor);
          filascond.appendChild(columnaTitulo2Conductor);
          filascond.appendChild(columnaDocumentoConductor);
          // Rendreizar la tabla
          tabla_datos.appendChild(filascond);
          /* Tabla de referencias labaroales */
          let tbody = d.getElementById('referencias_nuevas');
          tbody.textContent = '';
          const fila = d.createElement('tr');
          const columnaEmpresa1 = d.createElement('td');
          columnaEmpresa1.textContent = data.empresa1;
          const columnaIngreso1 = d.createElement('td');
          columnaIngreso1.textContent = data.feca1;
          const columnaRetiro1 = d.createElement('td');
          columnaRetiro1.textContent = data.feca2;
          const columnaContacto1 = d.createElement('td');
          columnaContacto1.textContent = data.persona1;
          const columnaCelular1 = d.createElement('td');
          columnaCelular1.textContent = data.cel1;
          const columnaCargo1 = d.createElement('td');
          columnaCargo1.textContent = data.cargo1;
          fila.appendChild(columnaEmpresa1);
          fila.appendChild(columnaIngreso1);
          fila.appendChild(columnaRetiro1);
          fila.appendChild(columnaContacto1);
          fila.appendChild(columnaCelular1);
          fila.appendChild(columnaCargo1);
          const fila2 = d.createElement('tr');
          const columnaEmpresa2 = d.createElement('td');
          columnaEmpresa2.textContent = data.empresa2;
          const columnaIngreso2 = d.createElement('td');
          columnaIngreso2.textContent = data.fecb1;
          const columnaRetiro2 = d.createElement('td');
          columnaRetiro2.textContent = data.fecb2;
          const columnaContacto2 = d.createElement('td');
          columnaContacto2.textContent = data.persona2;
          const columnaCelular2 = d.createElement('td');
          columnaCelular2.textContent = data.cel2;
          const columnaCargo2 = d.createElement('td');
          columnaCargo2.textContent = data.cargo2;
          fila2.appendChild(columnaEmpresa2);
          fila2.appendChild(columnaIngreso2);
          fila2.appendChild(columnaRetiro2);
          fila2.appendChild(columnaContacto2);
          fila2.appendChild(columnaCelular2);
          fila2.appendChild(columnaCargo2);

          const fila3 = d.createElement('tr');
          const columnaEmpresa3 = d.createElement('td');
          columnaEmpresa3.textContent = data.empresa3;
          const columnaIngreso3 = d.createElement('td');
          columnaIngreso3.textContent = data.fecc1;
          const columnaRetiro3 = d.createElement('td');
          columnaRetiro3.textContent = data.fecc2;
          const columnaContacto3 = d.createElement('td');
          columnaContacto3.textContent = data.persona3;
          const columnaCelular3 = d.createElement('td');
          columnaCelular3.textContent = data.cel3;
          const columnaCargo3 = d.createElement('td');
          columnaCargo3.textContent = data.cargo3;
          fila3.appendChild(columnaEmpresa3);
          fila3.appendChild(columnaIngreso3);
          fila3.appendChild(columnaRetiro3);
          fila3.appendChild(columnaContacto3);
          fila3.appendChild(columnaCelular3);
          fila3.appendChild(columnaCargo3);
          // Rendreizar la tabla
          tbody.appendChild(fila);
          tbody.appendChild(fila2);
          tbody.appendChild(fila3);
          d.getElementById('tbl_referencias').style.display = 'block';
        } else {
          let tbody = d.getElementById('referencias_nuevas');
          tbody.innerHTML = '';
          d.getElementById('tbl_referencias').style.display = 'none';
        }

        // /* Trailer */
        if (data.trailer === '1') {
          const filasTrailer = d.createElement('tr');
          const columnaTituloTrailer = d.createElement('th');
          columnaTituloTrailer.innerHTML = 'Placa Trailer';
          columnaTituloTrailer.style.backgroundColor = '#F5F5F5';
          columnaTituloTrailer.style.fontWeight = 'bold';
          columnaTituloTrailer.style.fontSize = '12px';
          columnaTituloTrailer.style.border = '1px solid #ddd';
          columnaTituloTrailer.style.width = 'auto';
          columnaTituloTrailer.style.whiteSpace = 'nowrap';
          const columnaPlacaTraileer = d.createElement('td');
          columnaPlacaTraileer.textContent = data.placa_trailer;
          const columnaTitulo2Trailer = d.createElement('th');
          columnaTitulo2Trailer.innerHTML = 'Propietario Trailer';
          columnaTitulo2Trailer.style.backgroundColor = '#F5F5F5';
          columnaTitulo2Trailer.style.fontWeight = 'bold';
          columnaTitulo2Trailer.style.fontSize = '12px';
          columnaTitulo2Trailer.style.border = '1px solid #ddd';
          columnaTitulo2Trailer.style.width = 'auto';
          columnaTitulo2Trailer.style.whiteSpace = 'nowrap';
          const columnaPropetarioTrailer = d.createElement('td');
          columnaPropetarioTrailer.textContent = data.name_propietario_trailer;
          filasTrailer.appendChild(columnaTituloTrailer);
          filasTrailer.appendChild(columnaPlacaTraileer);
          filasTrailer.appendChild(columnaTitulo2Trailer);
          filasTrailer.appendChild(columnaPropetarioTrailer);

          /* Nombre */
          const filasDocTrailer = d.createElement('tr');
          const columnaTitulo3Trailer = d.createElement('th');
          columnaTitulo3Trailer.innerHTML = 'Documento Propietario Trailer';
          columnaTitulo3Trailer.style.backgroundColor = '#F5F5F5';
          columnaTitulo3Trailer.style.fontWeight = 'bold';
          columnaTitulo3Trailer.style.fontSize = '12px';
          columnaTitulo3Trailer.style.border = '1px solid #ddd';
          columnaTitulo3Trailer.style.width = 'auto';
          columnaTitulo3Trailer.style.whiteSpace = 'nowrap';
          const columnaDocumentoTraileer = d.createElement('td');
          columnaDocumentoTraileer.textContent = data.documento_propi_trailer;
          // Rendreizar la tabla
          filasTrailer.appendChild(columnaTitulo3Trailer);
          filasTrailer.appendChild(columnaDocumentoTraileer);

          tabla_datos.appendChild(filasTrailer);
          tabla_datos.appendChild(filasTrailer);
        } else {
          // d.getElementById('tr_trailer').style.display = 'none';
          // d.getElementById('tr_propietario_trailer').style.display = 'none';
        }
      } else {
        alert('Error de operación');
      }
    })
    .catch(error => {
      alert(error);
    });

  /* Traer los datos actuales del vehiculos al que se le va hacer la actualización */
  let datos = new FormData();
  datos.append('placa_consulta', placa);
  fetch($('#id_url_ajax').val() + 'validacionparametros/verificar_datos_actuales', {
    method: 'POST',
    cache: 'no-cache',
    body: datos,
  })
    .then(response => response.json())
    .then(function (data) {
      if (data) {
        d.getElementById('propietario_actual').innerHTML = data.Propietario;
        d.getElementById('documento_propietario_actual').innerHTML = data.cedula_propietario;
        d.getElementById('tenedor_actual').innerHTML = data.Poseedor;
        d.getElementById('documento_tenedor_actual').innerHTML = data.cedula_poseedor;
        d.getElementById('conductor_actual').innerHTML = data.Conductor;
        d.getElementById('documento_conductor_actual').innerHTML = data.cedula_conductor;

        /* DATOS DEL TRAILER ACTUAL */
        if (data.Placa_Trailer) {
          d.getElementById('actual_placa_trailer').innerHTML = data.Placa_Trailer;
          d.getElementById('actual_propietario_trailer').innerHTML = data.Propietario_Trailer;
          d.getElementById('documento_actual_propietario_trailer').innerHTML = data.cedula_propietario_trailer;
        } else {
          d.getElementById('actual_placa_trailer').textContent = 'No Aplica';
          d.getElementById('actual_propietario_trailer').textContent = '';
          d.getElementById('documento_actual_propietario_trailer').textContent = '';
        }

        /* Datos del satelital del vehiculo */
        d.getElementById('web_satelital').innerHTML = `<a href="${data.web_satelital}" target=”_blank”>${data.web_satelital}</a>`;
        d.getElementById('usuario_satelital').innerHTML = data.usuario_satelital;
        d.getElementById('clave_satelital').innerHTML = data.clave_satelital;
      } else {
        alert('Error de operación');
      }
    })
    .catch(error => {
      alert(error);
    });

  /* Listar los log del vehiculo segun el estado */
  let formdatos = new FormData();
  formdatos.append('placa_consulta', placa);
  formdatos.append('solicitud_id', solicitud_id);
  fetch($('#id_url_ajax').val() + 'validacionparametros/listar_logs_prefiltro_nuevo', {
    method: 'POST',
    cache: 'no-cache',
    body: formdatos,
  })
    .then(response => response.json())
    .then(function (data) {
      if (data) {
        // Seleccionar el elemento <ul>
        var ul = document.getElementById('lista_log_estdo');
        ul.innerHTML = '';
        data.forEach(element => {
          // Crear un elemento <li>
          var li = document.createElement('li');
          // Establecer el texto del elemento <li>
          li.textContent = 'Estado: ' + element.estado + ' Observacion: ' + element.observacion + ' Usuario: ' + element.usuario + ' Fecha: ' + element.fecha + '-' + element.hora;
          // Agregar el elemento <li> al elemento <ul>
          ul.appendChild(li);
        });
      } else {
        alert('Error de operación');
      }
    })
    .catch(error => {
      alert(error);
    });
}

function lista_hojas_de_vida(vehiculo_id, conductor_id, num_solicitud) {
  // Listar los estados de las hojas de vida en el estudio de segurodad
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

  var datos = {
    idv: vehiculo_id,
    idc: conductor_id,
    idsoli: num_solicitud,
  };

  $.ajax({
    url: $('#id_url_ajax').val() + 'validacionparametros/Ver_Estudio_Seguridad',
    type: 'POST',
    data: datos,
    dataType: 'json',

    success: function (data, textStatus, jqXHR) {
      if (data != '') {
        data.forEach(function (element, index) {
          $('#idstudy').val(element.id_estudio);

          var etotal = element.estadototal;

          if (etotal == 'gray') {
            $('#estadostudy').val('sin respuesta');
          }

          if (etotal !== 'gray') {
            $('#estadostudy').val(etotal);
          }

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
              e = `<a   href="#" onclick="abrir_fotos('${element.ruta_evidencia}' , '${element.name_evidencia}')" class="cell-detail hint--top-left" data-hint="">
                <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="${element.observacion}"></span>
                </a>`;
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
              e = `<a  href="#" onclick="abrir_fotos('${element.ruta_evidencia}' , '${element.name_evidencia}')" class="cell-detail hint--top-left" data-hint="">

                <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="${element.observacion}" ></span>

                </a>`;
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
              e = `<a  href="#" onclick="abrir_fotos('${element.ruta_evidencia}' , '${element.name_evidencia}')" class="cell-detail hint--top-left" data-hint="">

              <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="${element.observacion}" ></span>

                </a>`;

              // return e;
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
              e = `<a   href="#" onclick="abrir_fotos('${element.ruta_evidencia}' , '${element.name_evidencia}')" class="cell-detail hint--top-left" data-hint="">

              <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="${element.observacion}"></span>

              </a>`;
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
              e = `<a   href="#" onclick="abrir_fotos('${element.ruta_evidencia}' , '${element.name_evidencia}')" class="cell-detail hint--top-left" data-hint="">

                <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="${element.observacion}"></span>

                </a>`;
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
              e = `<a   href="#" onclick="abrir_fotos('${element.ruta_evidencia}' , '${element.name_evidencia}')" class="cell-detail hint--top-left" data-hint="">

                <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="${element.observacion}"></span>

                </a>`;
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
              e = `<a   href="#" onclick="abrir_fotos('${element.ruta_evidencia}' , '${element.name_evidencia}')" class="cell-detail hint--top-left" data-hint="">

                <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="${element.observacion}"></span>

                </a>`;
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
              e = `<a   href="#" onclick="abrir_fotos('${element.ruta_evidencia}' , '${element.name_evidencia}')" class="cell-detail hint--top-left" data-hint="">

                <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="${element.observacion}"></span>

                </a>`;
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
              e = `<a   href="#" onclick="abrir_fotos('${element.ruta_evidencia}' , '${element.name_evidencia}')" class="cell-detail hint--top-left" data-hint="">

                <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="${element.observacion}"></span>

                </a>`;
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
              e = `<a   href="#" onclick="abrir_fotos('${element.ruta_evidencia}' , '${element.name_evidencia}')" class="cell-detail hint--top-left" data-hint="">

                <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="${element.observacion}"></span>

                </a>`;
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
              e = `<a   href="#" onclick="abrir_fotos('${element.ruta_evidencia}' , '${element.name_evidencia}')" class="cell-detail hint--top-left" data-hint="">

                <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="${element.observacion}"></span>

                </a>`;
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

    error: function (jqXHR, textStatus, errorThrown) {
      // alert('no trajo los tipos de estudio');

      console.log(jqXHR);

      console.log(textStatus);

      console.log(errorThrown);
    },
  });

  $('#ver_lista').show();
}

function cargarselect() {
  // alert('cargue el select');

  $('#select_option').html('');

  var dato1s = {
    action: 'cargue_select',
  };

  $('#select_option').html('<option value="0">Seleccione una opcion</option>');

  $.ajax({
    url: $('#id_url_ajax').val() + 'libs/seguridad_estudio2_ajax.php',
    type: 'POST',
    data: dato1s,
    dataType: 'json',
    success: function (data) {
      if (data.result) {
        data.result.forEach(function (element, index) {
          $('#select_option').append('<option value="' + element.id + '">' + element.nombre + '</option>');
        });
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no cargo el select');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//CONSULTAR EL VEHÍCULO
function verVehiculo() {
  var placa_vehiculo = '';
  var placa_trailer = '';
  var documentos = {
    documento: [],
    actividad: [],
    tipo_documento: [],
  };

  var id = $('#valor_vehiculo').val();
  /* Boton para tomar el id del vehiculo */
  var btn = document.getElementById('btn_editar_vehiculo');
  btn.setAttribute('data-idvehiculo', id);
  var params = {
    id_vehiculo: id,
  };

  $('#fotos_vehiculo').html('');
  $('#fotos_vehiculo_documentos').html('');
  $.ajax({
    url: $('#id_url_ajax').val() + 'validacionparametros/ver_vehiculo',
    type: 'POST',
    data: params,
    dataType: 'json',
    success: function (data) {
      if (data.vehiculo) {
        var combustible = '';
        placa_vehiculo = data.vehiculo.placa;
        $('#placa').val(data.vehiculo.placa);
        $('#confi').val(data.vehiculo.configure);
        $('#color').val(data.vehiculo.color);
        $('#marca').val(data.vehiculo.marca);

        if (data.vehiculo.cod_tipo_combustible == 1) {
          combustible = 'Gasolina';
        } else if (data.vehiculo.cod_tipo_combustible == 2) {
          combustible = 'GNV';
        } else if (data.vehiculo.cod_tipo_combustible == 3) {
          combustible = 'Diesel';
        } else if (data.vehiculo.cod_tipo_combustible == 4) {
          combustible = 'Gas/Gasol';
        } else if (data.vehiculo.cod_tipo_combustible == 5) {
          combustible = 'Electrico';
        } else if (data.vehiculo.cod_tipo_combustible == 12) {
          combustible = 'ACPM';
        } else if (data.vehiculo.cod_tipo_combustible == 13) {
          combustible = 'Gas';
        }

        $('#tip_combustible').val(combustible);
        $('#linea').val(data.vehiculo.linea);
        $('#anio').val(data.vehiculo.anio_fabricacion);
        // $("#tipo_vehi").val(data.vehiculo.tipo_carron);
        $('#tipo_caro').val(data.vehiculo.tipo_carroceria);
        $('#carroceria').val(data.vehiculo.cod_rndc_carroceria);
        $('#peso').val(data.vehiculo.peso);
        $('#capacidad').val(data.vehiculo.capacidad_tn);
        $('#peso_bruto').val(data.vehiculo.pesobruto_kg);
        $('#nsoat').val(data.vehiculo.num_soat);
        $('#vsoat').val(data.vehiculo.vence_soat);
        $('#ase').val(data.vehiculo.aseguradora);
        $('#tecno').val(data.vehiculo.tecnomecanica);
        $('#vtecno').val(data.vehiculo.tecno_fecha_vigencia);
        $('#webs').val(data.vehiculo.web_satelital);
        $('#usuarios').val(data.vehiculo.usuario_satelital);
        $('#claves').val(data.vehiculo.clave_satelital);
        $('#clase_vehi').val(data.vehiculo.clase);
        $('#licen_vehi').val(data.vehiculo.licencia_transito);

        //traer datos de propietario y tenedor
        $('#nom_propi').val(data.vehiculo.nom_pro + ' ' + data.vehiculo.proape1 + ' ' + data.vehiculo.proape2);
        $('#docu_propi').val(data.vehiculo.docu_pro);
        // documentos.documento.push(data.vehiculo.docu_pro + data.vehiculo.Digito_verificacion_propietario);
        documentos.documento.push(data.vehiculo.docu_pro);
        documentos.tipo_documento.push(data.vehiculo.Tipo_documento_propietario);
        documentos.actividad.push('Propietario');
        $('#celular_propietario').val(data.vehiculo.celular_propietario);

        //tenedor
        $('#nom_pose').val(data.vehiculo.nom_te + ' ' + data.vehiculo.teape1 + ' ' + data.vehiculo.teape2);
        $('#docu_pose').val(data.vehiculo.docu_te);
        documentos.documento.push(data.vehiculo.docu_te);
        documentos.tipo_documento.push(data.vehiculo.Tipo_documento_tenedor);
        documentos.actividad.push('Poseedor');
        $('#celular_tenedor').val(data.vehiculo.celular_tenedor);

        //Conductor
        documentos.documento.push(data.vehiculo.docu_cond);
        documentos.tipo_documento.push(data.vehiculo.Tipo_documento_conductor);
        documentos.actividad.push('Conductor');
        //demas datos
        $('#fecha_matriculall').val(data.vehiculo.f_matricula);
        $('#fetecnoll').val(data.vehiculo.tecno_fecha_expedida);
        $('#motorll').val(data.vehiculo.num_motor);
        $('#chasisll').val(data.vehiculo.num_chasis);
        $('#repotenciadoll').val(data.vehiculo.repotenciado);
        $('#vinculacionll').val(data.vehiculo.tipo_vinculacion);
        $('#cantidadviajell').val(data.vehiculo.cant_viajes);
        $('#polresponll').val(data.vehiculo.poliza_responsabilidad);
        $('#empresagpsll').val(data.vehiculo.operador_gps);
        $('#mantenimientogpsll').val(data.vehiculo.fecha_mant_gps);

        //FOTOS DEL VEHÍCULO
        var docu = '';
        var nombre = '';
        var tipo = '';

        if (data.vehiculo.name_frontal != '' && data.vehiculo.name_frontal != null) {
          docu = `<a  href="#" onclick="abrir_fotos('${data.vehiculo.foto_vehiculo}' , '${data.vehiculo.name_frontal}')" class="cell-detail hint--top-left" data-hint="">
            <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="Documento"></span>
            </a>`;
          nombre = data.vehiculo.name_frontal;
          tipo = 'Frontal';
          $('#fotos_vehiculo').append('<tr><td>1</td><td>' + docu + '</td><td>' + data.vehiculo.name_frontal + '</td><td>Frontal</td></tr>');
        }

        if (data.vehiculo.name_derecha != '' && data.vehiculo.name_derecha != null) {
          docu = `<a  href="#" onclick="abrir_fotos('${data.vehiculo.foto_derecha}' , '${data.vehiculo.name_derecha}')" class="cell-detail hint--top-left" data-hint="">
          <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="Documento"></span>
          </a>`;

          docu = `<a  href="#" onclick="abrir_fotos('${data.vehiculo.foto_derecha}' , '${data.vehiculo.name_derecha}')" class="cell-detail hint--top-left" data-hint="">
            <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="Documento"></span>
            </a>`;
          nombre = data.vehiculo.name_derecha;
          tipo = 'Derecha';
          $('#fotos_vehiculo').append('<tr><td>2</td><td>' + docu + '</td><td>' + data.vehiculo.name_derecha + '</td><td>Derecha</td></tr>');
        }

        if (data.vehiculo.name_izquierda != '' && data.vehiculo.name_izquierda != null) {
          docu = `<a  href="#" onclick="abrir_fotos('${data.vehiculo.foto_izquierda}' , '${data.vehiculo.name_izquierda}')" class="cell-detail hint--top-left" data-hint="">
          <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="Documento"></span>
          </a>`;

          $('#fotos_vehiculo').append('<tr><td>3</td><td>' + docu + '</td><td>' + data.vehiculo.name_izquierda + '</td><td>Izquierda</td></tr>');
        }

        if (data.vehiculo.name_atras != '' && data.vehiculo.name_atras != null) {
          docu = `<a  href="#" onclick="abrir_fotos('${data.vehiculo.foto_atras}' , '${data.vehiculo.name_atras}')" class="cell-detail hint--top-left" data-hint="">
          <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="Documento"></span>
          </a>`;
          $('#fotos_vehiculo').append('<tr><td>4</td><td>' + docu + '</td><td>' + data.vehiculo.name_atras + '</td><td>Trasera</td></tr>');
        }
      } else {
        console.log('no hay vehiculo');
      }

      if (data.vehiculo.foto_soat !== '' && data.vehiculo.name_soat !== '') {
        docu = `<a  href="#" onclick="abrir_fotos('${data.vehiculo.foto_soat}' , '${data.vehiculo.name_soat}')" class="cell-detail hint--top-left" data-hint="">
        <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="Documento"></span>
        </a>`;
        nombre = data.vehiculo.name_frontal;
        tipo = 'Soat';
        $('#fotos_vehiculo_documentos').append('<tr><td>1</td><td>' + docu + '</td><td>' + data.vehiculo.name_soat + '</td><td>Soat</td></tr>');
      } else {
        $('#fotos_vehiculo_documentos').append("<tr><td>1</td><td colspan='3' class='text-center'>No aplica Soat</td></tr>");
      }

      if (data.vehiculo.foto_tecno !== '' && data.vehiculo.name_tecno !== '' && data.vehiculo.name_tecno !== null) {
        docu = `<a  href="#" onclick="abrir_fotos('${data.vehiculo.foto_tecno}' , '${data.vehiculo.name_tecno}')" class="cell-detail hint--top-left" data-hint="">
        <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="Documento"></span>
        </a>`;
        nombre = data.vehiculo.name_frontal;
        tipo = 'Soat';
        $('#fotos_vehiculo_documentos').append('<tr><td>2</td><td>' + docu + '</td><td>' + data.vehiculo.name_tecno + '</td><td>Tecnomecanica</td></tr>');
      } else {
        $('#fotos_vehiculo_documentos').append("<tr><td>2</td><td colspan='3' class='text-center'>No aplica tecnomecánica</td></tr>");
      }

      if (data.vehiculo.foto_transito !== '' && data.vehiculo.name_transito !== '') {
        docu = `<a  href="#" onclick="abrir_fotos('${data.vehiculo.foto_transito}' , '${data.vehiculo.name_transito}')" class="cell-detail hint--top-left" data-hint="">
        <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="Documento"></span> </a>`;
        nombre = data.vehiculo.name_frontal;
        tipo = 'Soat';
        $('#fotos_vehiculo_documentos').append('<tr><td>3</td><td>' + docu + '</td><td>' + data.vehiculo.name_transito + '</td><td>Licencia de transito</td></tr>');
      } else {
        $('#fotos_vehiculo_documentos').append("<tr><td>3</td><td colspan='3' class='text-center'>No tiene foto de licencia  Transito</td></tr>");
      }

      //Kit de mercancias peligrosas
      if (data.vehiculo.documento_kit !== '' && data.vehiculo.nombre_kit !== '') {
        docu = `<a  href="#" onclick="abrir_fotos('${data.vehiculo.documento_kit}' , '${data.vehiculo.nombre_kit}')" class="cell-detail hint--top-left" data-hint="">
        <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="Documento"></span> </a>`;
        nombre = data.vehiculo.name_frontal;
        tipo = 'Kit de mercancias peligrosas';
        $('#fotos_vehiculo_documentos').append('<tr><td>4</td><td>' + docu + '</td><td>' + data.vehiculo.nombre_kit + '</td><td>Kit de mercancias peligrosas</td></tr>');
      } else {
        $('#fotos_vehiculo_documentos').append("<tr><td>4</td><td colspan='3' class='text-center'>No tiene Kit de mercancias peligrosas</td></tr>");
      }

      // Documento Preoperacional
      if (data.vehiculo.documento_preopeacional !== '' && data.vehiculo.nombre_preopeacional !== '') {
        docu = `<a  href="#" onclick="abrir_fotos('${data.vehiculo.documento_preopeacional}' , '${data.vehiculo.nombre_preopeacional}')" class="cell-detail hint--top-left" data-hint="">
        <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="Documento"></span> </a>`;
        nombre = data.vehiculo.name_frontal;
        tipo = 'Documento Preoperacional';
        $('#fotos_vehiculo_documentos').append('<tr><td>5</td><td>' + docu + '</td><td>' + data.vehiculo.nombre_preopeacional + '</td><td>Documento Preoperacional</td></tr>');
      } else {
        $('#fotos_vehiculo_documentos').append("<tr><td>5</td><td colspan='3' class='text-center'>No tiene documento Preoperacional</td></tr>");
      }

      if (data.trailer) {
        $('#recoger_trailer').show();
        $('#recoger_trailer2').show();

        //trailer
        $('#ptrailer').val(data.trailer.placa);
        placa_trailer = data.trailer.placa;
        $('#tra_placa').val(data.trailer.placa);
        $('#tra_anio').val(data.trailer.modelo);
        $('#tra_marca').val(data.trailer.mark);
        $('#tra_peso').val(data.trailer.peso_vacio);
        $('#tra_alto').val(data.trailer.alto);
        $('#tra_volu').val(data.trailer.volumen);
        $('#tra_tramite').val(data.trailer.tramitee);
        $('#tra_confi').val(data.trailer.confi);
        $('#tra_chasis').val(data.trailer.serie_chasis);
        $('#tra_ancho').val(data.trailer.ancho);
        $('#tra_largo').val(data.trailer.largo);
        $('#tra_capacidad').val(data.trailer.capacidad);
        $('#tra_carroceria').val(data.trailer.ceria);
        $('#tra_caracteris').val(data.trailer.caracteristica);
        $('#tra_aseguradora').val(data.trailer.aseguradora);
        $('#tra_civil').val(data.trailer.numero_civil);
        $('#tra_vence').val(data.trailer.fecha_vence);
        //Propietario de trailer
        documentos.documento.push(data.trailer.docu_prot);
        documentos.tipo_documento.push(data.trailer.Tipo_documento_propietario_trailer);
        documentos.actividad.push('Propietario Trailer');

        // if (typeof data.result.n_licencia !== 'undefined' && data.result.n_licencia !== '') {
        //   $('#tra_liencia').val(data.result.n_licencia);
        // } else {
        //   $('#tra_liencia').val('');
        // }

        if (data.trailer.n_docu_trailer != null && data.trailer.n_docu_trailer != '') {
          $('#tra_foto').html(`<a  href="#" onclick="abrir_fotos('${data.vehiculo.foto_trailer}' , '${data.vehiculo.n_docu_trailer}')" class="cell-detail hint--top-left" data-hint="">
          <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="Documento"></span>
          </a>`);
        } else {
          $('#tra_foto').html('<p class="text-danger">No existe archivo</p>');
        }

        //licencia trailer
        if (data.trailer.name_licencia != null && data.trailer.name_licencia != '') {
          $('#tra_licen_foto').html(`<a  href="#" onclick="abrir_fotos('${data.trailer.foto_licencia}' , '${data.trailer.name_licencia}')" class="cell-detail hint--top-left" data-hint="">
          <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="Documento"></span>
          </a>`);
        } else {
          $('#tra_licen_foto').html('<p class="text-danger">No existe archivo</p>');
        }
      } else {
        $('#ptrailer').val('No posee trailer asociado');
        placa_trailer = '';
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no hayyyy');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
    complete: function () {
      // Código que se ejecuta siempre al final de la solicitud
      crear_Proveedores_Ministerio(documentos, placa_vehiculo, placa_trailer);
    },
  });
}

async function crear_Proveedores_Ministerio(documentos, placa, trailer) {
  var conduce = 0;
  var proceso = 11;
  var tipotercero = '';
  // Mostrar todas las imágenes con la clase 'load_rndc'
  const loadRndcImages = document.querySelectorAll('.load_rndc');
  // const ColloadRndcImages = document.querySelectorAll('.col_rndc');

  loadRndcImages.forEach(image => {
    image.style.display = 'inline-block'; // o 'block' dependiendo de tu preferencia
  });

  // Crear un array de promesas y un array para almacenar los mensajes de cada iteración
  const promesas = [];
  const mensajes = [];
  for (var i = 0; i < documentos.documento.length; i++) {
    mensajes.push({ documento: documentos.documento[i], tipo_documento: documentos.tipo_documento[i], actividad: documentos.actividad[i], mensaje: 'Sin Resultado', codigoError: 0 });
    var datos_rndc = new FormData();
    datos_rndc.append('id', documentos.documento[i]);
    datos_rndc.append('tipdoc', documentos.tipo_documento[i]);
    datos_rndc.append('dato', 1);
    datos_rndc.append('filtro', tipotercero);
    datos_rndc.append('proceso', proceso);
    datos_rndc.append('tipopro', 2);
    datos_rndc.append('conduce', conduce);
    (function (index) {
      promesas.push(
        fetch($('#id_url_ajax').val() + 'web_service/terceros', {
          method: 'POST',
          body: datos_rndc,
          cache: 'no-cache',
        })
          .then(response => response.json())
          .then(data => {
            if (data.status == 'true') {
              const errorCodeMatch = data.resultado.match(/TER\d{3}/);
              const errorCode = errorCodeMatch ? errorCodeMatch[0] : null;
              if (errorCode) {
                mensajes.push({
                  documento: documentos.documento[index],
                  tipo_documento: documentos.tipo_documento[index],
                  actividad: documentos.actividad[index],
                  mensaje: data.resultado,
                  codigoError: errorCode,
                });
              } else {
                mensajes.push({
                  documento: documentos.documento[index],
                  tipo_documento: documentos.tipo_documento[index],
                  actividad: documentos.actividad[index],
                  mensaje: data.resultado,
                  codigoError: null,
                });
              }
            } else if (data.status == 'false') {
              const errorCodeMatch = data.resultado.match(/TER\d{3}/);
              const errorCode = errorCodeMatch ? errorCodeMatch[0] : null;

              if (errorCode) {
                mensajes.push({
                  documento: documentos.documento[index],
                  tipo_documento: documentos.tipo_documento[index],
                  actividad: documentos.actividad[index],
                  mensaje: data.resultado,
                  codigoError: errorCode,
                });
              } else {
                mensajes.push({
                  documento: documentos.documento[index],
                  tipo_documento: documentos.tipo_documento[index],
                  actividad: documentos.actividad[index],
                  mensaje: data.resultado,
                  codigoError: null,
                });
              }
            } else {
              mensajes.push({
                documento: documentos.documento[index],
                tipo_documento: documentos.tipo_documento[index],
                actividad: documentos.actividad[index],
                mensaje: 'Sin Resultado',
                codigoError: 0,
              });
            }
          })
          .catch(error => {
            console.error('Error en alguna de las solicitudes:', error.message.includes('SOAP-ERROR: Parsing WSDL'));
            throw error; // O puedes decidir no lanzar el error de nuevo dependiendo del caso de uso
          }),
      );
    })(i); // Llamamos la IIFE con el valor actual de i
  }

  try {
    await Promise.all(promesas);
  } catch (error) {
    if (error.message.includes('SOAP-ERROR: Parsing WSDL')) {
      // Mostrar un mensaje específico o realizar una acción
      // alert('Error al cargar el servicio SOAP del RNDC. Por favor, verifica la conexión o la URL del RNDC.');
      for (let i = 0; i < mensajes.length; i++) {
        const { documento, tipo_documento, mensaje, actividad, codigoError } = mensajes[i];
        document.querySelectorAll('.id_ministerio_propietario').forEach(elemento => {
          elemento.setAttribute('id', `td_propietario_ministerio_${documento}`);
        });

        document.querySelectorAll('.id_ministerio_poseedor').forEach(elemento => {
          elemento.setAttribute('id', `td_poseedor_ministerio_${documento}`);
        });

        document.querySelectorAll('.id_ministerio_conductor').forEach(elemento => {
          elemento.setAttribute('id', `td_conductor_ministerio_${documento}`);
        });

        document.querySelectorAll('.id_ministerio_propietario_trailer').forEach(elemento => {
          elemento.setAttribute('id', `td_propietario_trailer_ministerio_${documento}`);
        });

        document.querySelectorAll('.tr_pripietario').forEach(elemento => {
          elemento.setAttribute('id', `tr_${documento}`);
        });

        document.querySelectorAll('.tr_poseedor').forEach(elemento => {
          elemento.setAttribute('id', `tr_${documento}`);
        });

        document.querySelectorAll('.tr_conductor').forEach(elemento => {
          elemento.setAttribute('id', `tr_${documento}`);
        });

        document.querySelectorAll('.tr_propietario_trailer').forEach(elemento => {
          elemento.setAttribute('id', `tr_${documento}`);
        });
        if (actividad === 'Conductor') {
          // Acción para otros códigos de error si es necesario
          // Selecciona el contenedor específico para el documento
          const elementoContenedor_Ministerio = document.querySelector(`#td_conductor_ministerio_${documento}`);
          // Encuentra el contenedor del span (asegúrate de que elementoContenedor_Ministerio sea el span o su contenedor)
          var spanElement = elementoContenedor_Ministerio;
          // Encuentra la fila que contiene el spanElement
          var fila = spanElement.closest('tr');
          // Verifica si se encontró la fila
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#DC4C64';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Crea el botón
            var butto_conductor = document.createElement('a');
            butto_conductor.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
            butto_conductor.className = 'icon btn_retransmitir_endpoint';
            // Asigna el evento onclick directamente
            butto_conductor.onclick = async function () {
              try {
                // Espera la respuesta de la función asincrónica
                var respuesta_oet_retransmision = await Retransmitir_Dato_Ministerio(documento, tipo_documento, actividad);
                // Itera sobre la respuesta
                respuesta_oet_retransmision.forEach(element => {
                  if (element.codigoError === '1000' && element.codigoError === '1999') {
                    document.getElementById('id_conductor_ministerio').value = 1;
                    document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
                    butto_conductor.style.display = 'none';
                  } else if (element.codigoError === '1999') {
                    document.getElementById('id_conductor_ministerio').value = 0;
                    document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
                  } else if (element.codigoError === '1000') {
                    document.getElementById('id_conductor_ministerio').value = 1;
                    document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
                    butto_conductor.style.display = 'none';
                  } else if (element.codigoError === '6001') {
                    document.getElementById('id_conductor_ministerio').value = 0;
                    document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
                  } else {
                    console.log('Codigo de error: ' + element.codigoError);
                  }
                });
              } catch (error) {
                // Maneja el error
                console.error('Error al retransmitir datos OET:', error);
                alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
              }
            };
            // Estilos del botón
            butto_conductor.style.textDecoration = 'none';
            butto_conductor.style.color = '#E4A11B';
            butto_conductor.style.paddingLeft = '10px';
            butto_conductor.setAttribute('data-toggle', 'tooltip');
            butto_conductor.setAttribute('title', `Retransmitir ${actividad}`);
            butto_conductor.setAttribute('data-placement', 'bottom');
            // Crea el elemento <span> dentro del <a> para el icono
            var iconSpan = document.createElement('span');
            iconSpan.className = 'mdi mdi-mail-send';
            // Añade el <span> al <a>
            butto_conductor.appendChild(iconSpan);
            // Añade el botón a la nueva celda
            nuevaCelda.appendChild(butto_conductor);
            // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.error('El elemento span no se encontró.');
          }
        } else if (actividad === 'Propietario') {
          // Selecciona el contenedor específico para el documento
          const elementopPropietario_Ministerio = document.querySelector(`#td_propietario_ministerio_${documento}`);
          // Encuentra el contenedor del span (asegúrate de que elementopPropietario_Ministerio sea el span o su contenedor)
          var spanElement = elementopPropietario_Ministerio;
          // Encuentra la fila que contiene el spanElement
          var fila = spanElement.closest('tr');
          // Verifica si se encontró la fila
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#DC4C64';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Crea el botón
            var butto_propietario_ministerio = document.createElement('a');
            butto_propietario_ministerio.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
            butto_propietario_ministerio.className = 'icon btn_retransmitir_endpoint';
            // Asigna el evento onclick directamente
            butto_propietario_ministerio.onclick = async function () {
              try {
                // Espera la respuesta de la función asincrónica
                var respuesta_oet_retransmision = await Retransmitir_Dato_Ministerio(documento, tipo_documento, actividad);
                // Itera sobre la respuesta
                respuesta_oet_retransmision.forEach(element => {
                  if (element.codigoError === '1000' && element.codigoError === '1999') {
                    document.getElementById('id_propietario_ministerio').value = 1;
                    document.querySelector('.id_ministerio_propietario').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
                    butto_propietario_ministerio.style.display = 'none';
                  } else if (element.codigoError === '1999') {
                    document.getElementById('id_propietario_ministerio').value = 0;
                    document.querySelector('.id_ministerio_propietario').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
                  } else if (element.codigoError === '1000') {
                    document.getElementById('id_propietario_ministerio').value = 1;
                    document.querySelector('.id_ministerio_propietario').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
                    butto_propietario_ministerio.style.display = 'none';
                  } else if (element.codigoError === '6001') {
                    document.getElementById('id_propietario_ministerio').value = 0;
                    document.querySelector('.id_ministerio_propietario').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
                  } else {
                    console.log('Codigo de error: ' + element.codigoError);
                  }
                });
              } catch (error) {
                // Maneja el error
                console.error('Error al retransmitir datos OET:', error);
                alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
              }
            };
            // Estilos del botón
            butto_propietario_ministerio.style.textDecoration = 'none';
            butto_propietario_ministerio.style.color = '#E4A11B';
            butto_propietario_ministerio.style.paddingLeft = '10px';
            butto_propietario_ministerio.setAttribute('data-toggle', 'tooltip');
            butto_propietario_ministerio.setAttribute('title', `Retransmitir ${actividad}`);
            butto_propietario_ministerio.setAttribute('data-placement', 'bottom');
            // Crea el elemento <span> dentro del <a> para el icono
            var iconSpan = document.createElement('span');
            iconSpan.className = 'mdi mdi-mail-send';
            // Añade el <span> al <a>
            butto_propietario_ministerio.appendChild(iconSpan);
            // Añade el botón a la nueva celda
            nuevaCelda.appendChild(butto_propietario_ministerio);
            // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.error('El elemento span no se encontró.');
          }
        } else if (actividad === 'Poseedor') {
          // Selecciona el contenedor específico para el documento
          const elementopPoseedor_Ministerio = document.querySelector(`#td_poseedor_ministerio_${documento}`);
          // Encuentra el contenedor del span (asegúrate de que elementopPoseedor_Ministerio sea el span o su contenedor)
          var spanElement = elementopPoseedor_Ministerio;
          // Encuentra la fila que contiene el spanElement
          var fila = spanElement.closest('tr');
          // Verifica si se encontró la fila
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#DC4C64';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Crea el botón
            var butto_poseedor_ministerio = document.createElement('a');
            butto_poseedor_ministerio.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
            butto_poseedor_ministerio.className = 'icon btn_retransmitir_endpoint';
            // Asigna el evento onclick directamente
            butto_poseedor_ministerio.onclick = async function () {
              try {
                // Espera la respuesta de la función asincrónica
                var respuesta_oet_retransmision = await Retransmitir_Dato_Ministerio(documento, tipo_documento, actividad);
                // Itera sobre la respuesta
                respuesta_oet_retransmision.forEach(element => {
                  if (element.codigoError === '1000' && element.codigoError === '1999') {
                    document.getElementById('id_poseedor_ministerio').value = 1;
                    document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
                    butto_poseedor_ministerio.style.display = 'none';
                  } else if (element.codigoError === '1999') {
                    document.getElementById('id_poseedor_ministerio').value = 0;
                    document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
                  } else if (element.codigoError === '1000') {
                    document.getElementById('id_poseedor_ministerio').value = 1;
                    document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
                    butto_poseedor_ministerio.style.display = 'none';
                  } else if (element.codigoError === '6001') {
                    document.getElementById('id_poseedor_ministerio').value = 0;
                    document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
                  } else {
                    console.log('Codigo de error: ' + element.codigoError);
                  }
                });
              } catch (error) {
                // Maneja el error
                console.error('Error al retransmitir datos OET:', error);
                alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
              }
            };
            // Estilos del botón
            butto_poseedor_ministerio.style.textDecoration = 'none';
            butto_poseedor_ministerio.style.color = '#E4A11B';
            butto_poseedor_ministerio.style.paddingLeft = '10px';
            butto_poseedor_ministerio.setAttribute('data-toggle', 'tooltip');
            butto_poseedor_ministerio.setAttribute('title', `Retransmitir ${actividad}`);
            butto_poseedor_ministerio.setAttribute('data-placement', 'bottom');
            // Crea el elemento <span> dentro del <a> para el icono
            var iconSpan = document.createElement('span');
            iconSpan.className = 'mdi mdi-mail-send';
            // Añade el <span> al <a>
            butto_poseedor_ministerio.appendChild(iconSpan);
            // Añade el botón a la nueva celda
            nuevaCelda.appendChild(butto_poseedor_ministerio);
            // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.error('El elemento span no se encontró.');
          }
        } else if (actividad === 'Propietario Trailer') {
          // Selecciona el contenedor específico para el documento
          const elementopPropietario_Trailer_Ministerio = document.querySelector(`#td_propietario_trailer_ministerio_${documento}`);
          // Encuentra el contenedor del span (asegúrate de que elementopPropietario_Trailer_Ministerio sea el span o su contenedor)
          var spanElement = elementopPropietario_Trailer_Ministerio;
          // Encuentra la fila que contiene el spanElement
          var fila = spanElement.closest('tr');
          // Verifica si se encontró la fila
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#DC4C64';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Crea el botón
            var butto_propieatrio_trailer_ministerio = document.createElement('a');
            butto_propieatrio_trailer_ministerio.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
            butto_propieatrio_trailer_ministerio.className = 'icon btn_retransmitir_endpoint';
            // Asigna el evento onclick directamente
            butto_propieatrio_trailer_ministerio.onclick = async function () {
              try {
                // Espera la respuesta de la función asincrónica
                var respuesta_oet_retransmision = await Retransmitir_Dato_Ministerio(documento, tipo_documento, actividad);
                // Itera sobre la respuesta
                respuesta_oet_retransmision.forEach(element => {
                  if (element.codigoError === '1000' && element.codigoError === '1999') {
                    document.getElementById('id_poseedor_ministerio').value = 1;
                    document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
                    butto_propieatrio_trailer_ministerio.style.display = 'none';
                  } else if (element.codigoError === '1999') {
                    document.getElementById('id_poseedor_ministerio').value = 0;
                    document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
                  } else if (element.codigoError === '1000') {
                    document.getElementById('id_poseedor_ministerio').value = 1;
                    document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
                    butto_propieatrio_trailer_ministerio.style.display = 'none';
                  } else if (element.codigoError === '6001') {
                    document.getElementById('id_poseedor_ministerio').value = 0;
                    document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
                  } else {
                    console.log('Codigo de error: ' + element.codigoError);
                  }
                });
              } catch (error) {
                // Maneja el error
                console.error('Error al retransmitir datos OET:', error);
                alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
              }
            };
            // Estilos del botón
            butto_propieatrio_trailer_ministerio.style.textDecoration = 'none';
            butto_propieatrio_trailer_ministerio.style.color = '#E4A11B';
            butto_propieatrio_trailer_ministerio.style.paddingLeft = '10px';
            butto_propieatrio_trailer_ministerio.setAttribute('data-toggle', 'tooltip');
            butto_propieatrio_trailer_ministerio.setAttribute('title', `Retransmitir ${actividad}`);
            butto_propieatrio_trailer_ministerio.setAttribute('data-placement', 'bottom');
            // Crea el elemento <span> dentro del <a> para el icono
            var iconSpan = document.createElement('span');
            iconSpan.className = 'mdi mdi-mail-send';
            // Añade el <span> al <a>
            butto_propieatrio_trailer_ministerio.appendChild(iconSpan);
            // Añade el botón a la nueva celda
            nuevaCelda.appendChild(butto_propieatrio_trailer_ministerio);
            // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.error('El elemento span no se encontró.');
          }
        }
      }
      document.getElementById('mensaje_error_validacion').innerHTML = `<div role="alert" class="alert alert-info alert-icon alert-icon-border alert-dismissible">
        <div class="icon"><span class="mdi mdi-alert-triangle"></span></div><div class="message">
            <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button>
            <strong>Información!</strong> Error al cargar el servicio SOAP del RNDC. Por favor, verifica la conexión o la URL del RNDC.
          </div>
        </div>`;
      // ejecutar_retransmision(fila, placa, '', actividad);
    } else {
      // Manejar otros errores
      // alert('Ocurrió un error inesperado. Intenta de nuevo.');
      // alert('Error al cargar el servicio SOAP del RNDC. Por favor, verifica la conexión o la URL del RNDC.');
      for (let i = 0; i < mensajes.length; i++) {
        const { documento, tipo_documento, mensaje, actividad, codigoError } = mensajes[i];
        document.querySelectorAll('.id_ministerio_propietario').forEach(elemento => {
          elemento.setAttribute('id', `td_propietario_ministerio_${documento}`);
        });

        document.querySelectorAll('.id_ministerio_poseedor').forEach(elemento => {
          elemento.setAttribute('id', `td_poseedor_ministerio_${documento}`);
        });

        document.querySelectorAll('.id_ministerio_conductor').forEach(elemento => {
          elemento.setAttribute('id', `td_conductor_ministerio_${documento}`);
        });

        document.querySelectorAll('.id_ministerio_propietario_trailer').forEach(elemento => {
          elemento.setAttribute('id', `td_propietario_trailer_ministerio_${documento}`);
        });

        document.querySelectorAll('.tr_pripietario').forEach(elemento => {
          elemento.setAttribute('id', `tr_${documento}`);
        });

        document.querySelectorAll('.tr_poseedor').forEach(elemento => {
          elemento.setAttribute('id', `tr_${documento}`);
        });

        document.querySelectorAll('.tr_conductor').forEach(elemento => {
          elemento.setAttribute('id', `tr_${documento}`);
        });

        document.querySelectorAll('.tr_propietario_trailer').forEach(elemento => {
          elemento.setAttribute('id', `tr_${documento}`);
        });

        if (actividad === 'Conductor') {
          // Acción para otros códigos de error si es necesario
          // Selecciona el contenedor específico para el documento
          const elementoContenedor_Ministerio = document.querySelector(`#td_conductor_ministerio_${documento}`);
          // Encuentra el contenedor del span (asegúrate de que elementoContenedor_Ministerio sea el span o su contenedor)
          var spanElement = elementoContenedor_Ministerio;
          // Encuentra la fila que contiene el spanElement
          var fila = spanElement.closest('tr');
          // Verifica si se encontró la fila
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#DC4C64';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Crea el botón
            var butto_conductor = document.createElement('a');
            butto_conductor.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
            butto_conductor.className = 'icon btn_retransmitir_endpoint';
            // Asigna el evento onclick directamente
            butto_conductor.onclick = async function () {
              try {
                // Espera la respuesta de la función asincrónica
                var respuesta_oet_retransmision = await Retransmitir_Dato_Ministerio(documento, tipo_documento, actividad);
                // Itera sobre la respuesta
                respuesta_oet_retransmision.forEach(element => {
                  if (element.codigoError === '1000' && element.codigoError === '1999') {
                    document.getElementById('id_conductor_ministerio').value = 1;
                    document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
                    butto_conductor.style.display = 'none';
                  } else if (element.codigoError === '1999') {
                    document.getElementById('id_conductor_ministerio').value = 0;
                    document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
                  } else if (element.codigoError === '1000') {
                    document.getElementById('id_conductor_ministerio').value = 1;
                    document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
                    butto_conductor.style.display = 'none';
                  } else if (element.codigoError === '6001') {
                    document.getElementById('id_conductor_ministerio').value = 0;
                    document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
                  } else {
                    console.log('Codigo de error: ' + element.codigoError);
                  }
                });
              } catch (error) {
                // Maneja el error
                console.error('Error al retransmitir datos OET:', error);
                alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
              }
            };
            // Estilos del botón
            butto_conductor.style.textDecoration = 'none';
            butto_conductor.style.color = '#E4A11B';
            butto_conductor.style.paddingLeft = '10px';
            butto_conductor.setAttribute('data-toggle', 'tooltip');
            butto_conductor.setAttribute('title', `Retransmitir ${actividad}`);
            butto_conductor.setAttribute('data-placement', 'bottom');
            // Crea el elemento <span> dentro del <a> para el icono
            var iconSpan = document.createElement('span');
            iconSpan.className = 'mdi mdi-mail-send';
            // Añade el <span> al <a>
            butto_conductor.appendChild(iconSpan);
            // Añade el botón a la nueva celda
            nuevaCelda.appendChild(butto_conductor);
            // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.error('El elemento span no se encontró.');
          }
        } else if (actividad === 'Propietario') {
          // Selecciona el contenedor específico para el documento
          const elementopPropietario_Ministerio = document.querySelector(`#td_propietario_ministerio_${documento}`);
          // Encuentra el contenedor del span (asegúrate de que elementopPropietario_Ministerio sea el span o su contenedor)
          var spanElement = elementopPropietario_Ministerio;
          // Encuentra la fila que contiene el spanElement
          var fila = spanElement.closest('tr');
          // Verifica si se encontró la fila
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#DC4C64';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Crea el botón
            var butto_propietario_ministerio = document.createElement('a');
            butto_propietario_ministerio.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
            butto_propietario_ministerio.className = 'icon btn_retransmitir_endpoint';
            // Asigna el evento onclick directamente
            butto_propietario_ministerio.onclick = async function () {
              try {
                // Espera la respuesta de la función asincrónica
                var respuesta_oet_retransmision = await Retransmitir_Dato_Ministerio(documento, tipo_documento, actividad);
                // Itera sobre la respuesta
                respuesta_oet_retransmision.forEach(element => {
                  if (element.codigoError === '1000' && element.codigoError === '1999') {
                    document.getElementById('id_propietario_ministerio').value = 1;
                    document.querySelector('.id_ministerio_propietario').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
                    butto_propietario_ministerio.style.display = 'none';
                  } else if (element.codigoError === '1999') {
                    document.getElementById('id_propietario_ministerio').value = 0;
                    document.querySelector('.id_ministerio_propietario').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
                  } else if (element.codigoError === '1000') {
                    document.getElementById('id_propietario_ministerio').value = 1;
                    document.querySelector('.id_ministerio_propietario').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
                    butto_propietario_ministerio.style.display = 'none';
                  } else if (element.codigoError === '6001') {
                    document.getElementById('id_propietario_ministerio').value = 0;
                    document.querySelector('.id_ministerio_propietario').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
                  } else {
                    console.log('Codigo de error: ' + element.codigoError);
                  }
                });
              } catch (error) {
                // Maneja el error
                console.error('Error al retransmitir datos OET:', error);
                alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
              }
            };
            // Estilos del botón
            butto_propietario_ministerio.style.textDecoration = 'none';
            butto_propietario_ministerio.style.color = '#E4A11B';
            butto_propietario_ministerio.style.paddingLeft = '10px';
            butto_propietario_ministerio.setAttribute('data-toggle', 'tooltip');
            butto_propietario_ministerio.setAttribute('title', `Retransmitir ${actividad}`);
            butto_propietario_ministerio.setAttribute('data-placement', 'bottom');
            // Crea el elemento <span> dentro del <a> para el icono
            var iconSpan = document.createElement('span');
            iconSpan.className = 'mdi mdi-mail-send';
            // Añade el <span> al <a>
            butto_propietario_ministerio.appendChild(iconSpan);
            // Añade el botón a la nueva celda
            nuevaCelda.appendChild(butto_propietario_ministerio);
            // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.error('El elemento span no se encontró.');
          }
        } else if (actividad === 'Poseedor') {
          // Selecciona el contenedor específico para el documento
          const elementopPoseedor_Ministerio = document.querySelector(`#td_poseedor_ministerio_${documento}`);
          // Encuentra el contenedor del span (asegúrate de que elementopPoseedor_Ministerio sea el span o su contenedor)
          var spanElement = elementopPoseedor_Ministerio;
          // Encuentra la fila que contiene el spanElement
          var fila = spanElement.closest('tr');
          // Verifica si se encontró la fila
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#DC4C64';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Crea el botón
            var butto_poseedor_ministerio = document.createElement('a');
            butto_poseedor_ministerio.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
            butto_poseedor_ministerio.className = 'icon btn_retransmitir_endpoint';
            // Asigna el evento onclick directamente
            butto_poseedor_ministerio.onclick = async function () {
              try {
                // Espera la respuesta de la función asincrónica
                var respuesta_oet_retransmision = await Retransmitir_Dato_Ministerio(documento, tipo_documento, actividad);
                // Itera sobre la respuesta
                respuesta_oet_retransmision.forEach(element => {
                  if (element.codigoError === '1000' && element.codigoError === '1999') {
                    document.getElementById('id_poseedor_ministerio').value = 1;
                    document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
                    butto_poseedor_ministerio.style.display = 'none';
                  } else if (element.codigoError === '1999') {
                    document.getElementById('id_poseedor_ministerio').value = 0;
                    document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
                  } else if (element.codigoError === '1000') {
                    document.getElementById('id_poseedor_ministerio').value = 1;
                    document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
                    butto_poseedor_ministerio.style.display = 'none';
                  } else if (element.codigoError === '6001') {
                    document.getElementById('id_poseedor_ministerio').value = 0;
                    document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
                  } else {
                    console.log('Codigo de error: ' + element.codigoError);
                  }
                });
              } catch (error) {
                // Maneja el error
                console.error('Error al retransmitir datos OET:', error);
                alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
              }
            };
            // Estilos del botón
            butto_poseedor_ministerio.style.textDecoration = 'none';
            butto_poseedor_ministerio.style.color = '#E4A11B';
            butto_poseedor_ministerio.style.paddingLeft = '10px';
            butto_poseedor_ministerio.setAttribute('data-toggle', 'tooltip');
            butto_poseedor_ministerio.setAttribute('title', `Retransmitir ${actividad}`);
            butto_poseedor_ministerio.setAttribute('data-placement', 'bottom');
            // Crea el elemento <span> dentro del <a> para el icono
            var iconSpan = document.createElement('span');
            iconSpan.className = 'mdi mdi-mail-send';
            // Añade el <span> al <a>
            butto_poseedor_ministerio.appendChild(iconSpan);
            // Añade el botón a la nueva celda
            nuevaCelda.appendChild(butto_poseedor_ministerio);
            // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.error('El elemento span no se encontró.');
          }
        } else if (actividad === 'Propietario Trailer') {
          // Selecciona el contenedor específico para el documento
          const elementopPropietario_Trailer_Ministerio = document.querySelector(`#td_propietario_trailer_ministerio_${documento}`);
          // Encuentra el contenedor del span (asegúrate de que elementopPropietario_Trailer_Ministerio sea el span o su contenedor)
          var spanElement = elementopPropietario_Trailer_Ministerio;
          // Encuentra la fila que contiene el spanElement
          var fila = spanElement.closest('tr');
          // Verifica si se encontró la fila
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#DC4C64';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Crea el botón
            var butto_propieatrio_trailer_ministerio = document.createElement('a');
            butto_propieatrio_trailer_ministerio.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
            butto_propieatrio_trailer_ministerio.className = 'icon btn_retransmitir_endpoint';
            // Asigna el evento onclick directamente
            butto_propieatrio_trailer_ministerio.onclick = async function () {
              try {
                // Espera la respuesta de la función asincrónica
                var respuesta_oet_retransmision = await Retransmitir_Dato_Ministerio(documento, tipo_documento, actividad);
                // Itera sobre la respuesta
                respuesta_oet_retransmision.forEach(element => {
                  if (element.codigoError === '1000' && element.codigoError === '1999') {
                    document.getElementById('id_poseedor_ministerio').value = 1;
                    document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
                    butto_propieatrio_trailer_ministerio.style.display = 'none';
                  } else if (element.codigoError === '1999') {
                    document.getElementById('id_poseedor_ministerio').value = 0;
                    document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
                  } else if (element.codigoError === '1000') {
                    document.getElementById('id_poseedor_ministerio').value = 1;
                    document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
                    butto_propieatrio_trailer_ministerio.style.display = 'none';
                  } else if (element.codigoError === '6001') {
                    document.getElementById('id_poseedor_ministerio').value = 0;
                    document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                    // document.querySelector('.estado_ministerio_propietario').innerHTML = element.mensaje;
                    // document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
                  } else {
                    console.log('Codigo de error: ' + element.codigoError);
                  }
                });
              } catch (error) {
                // Maneja el error
                console.error('Error al retransmitir datos OET:', error);
                alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
              }
            };
            // Estilos del botón
            butto_propieatrio_trailer_ministerio.style.textDecoration = 'none';
            butto_propieatrio_trailer_ministerio.style.color = '#E4A11B';
            butto_propieatrio_trailer_ministerio.style.paddingLeft = '10px';
            butto_propieatrio_trailer_ministerio.setAttribute('data-toggle', 'tooltip');
            butto_propieatrio_trailer_ministerio.setAttribute('title', `Retransmitir ${actividad}`);
            butto_propieatrio_trailer_ministerio.setAttribute('data-placement', 'bottom');
            // Crea el elemento <span> dentro del <a> para el icono
            var iconSpan = document.createElement('span');
            iconSpan.className = 'mdi mdi-mail-send';
            // Añade el <span> al <a>
            butto_propieatrio_trailer_ministerio.appendChild(iconSpan);
            // Añade el botón a la nueva celda
            nuevaCelda.appendChild(butto_propieatrio_trailer_ministerio);
            // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.error('El elemento span no se encontró.');
          }
        }
      }
      document.getElementById('mensaje_error_validacion').innerHTML = `<div role="alert" class="alert alert-info alert-icon alert-icon-border alert-dismissible">
        <div class="icon"><span class="mdi mdi-alert-triangle"></span></div><div class="message">
          <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button>
          <strong>Información!</strong> Error al cargar el servicio SOAP del RNDC. Por favor, verifica la conexión o la URL del RNDC.
        </div>
      </div>`;
      // ejecutar_retransmision(fila, placa, '', actividad);
    }
  } finally {
    // Ejemplo de comparación para el código TER015 y la palabra DUPLICADO
    for (let i = 0; i < mensajes.length; i++) {
      const { documento, tipo_documento, mensaje, actividad, codigoError } = mensajes[i];

      document.querySelectorAll('.id_ministerio_propietario').forEach(elemento => {
        elemento.setAttribute('id', `td_propietario_ministerio_${documento}`);
      });

      document.querySelectorAll('.id_ministerio_poseedor').forEach(elemento => {
        elemento.setAttribute('id', `td_poseedor_ministerio_${documento}`);
      });

      document.querySelectorAll('.id_ministerio_conductor').forEach(elemento => {
        elemento.setAttribute('id', `td_conductor_ministerio_${documento}`);
      });

      document.querySelectorAll('.id_ministerio_propietario_trailer').forEach(elemento => {
        elemento.setAttribute('id', `td_propietario_trailer_ministerio_${documento}`);
      });

      document.querySelectorAll('.tr_pripietario').forEach(elemento => {
        elemento.setAttribute('id', `tr_${documento}`);
      });

      document.querySelectorAll('.tr_poseedor').forEach(elemento => {
        elemento.setAttribute('id', `tr_${documento}`);
      });

      document.querySelectorAll('.tr_conductor').forEach(elemento => {
        elemento.setAttribute('id', `tr_${documento}`);
      });

      document.querySelectorAll('.tr_propietario_trailer').forEach(elemento => {
        elemento.setAttribute('id', `tr_${documento}`);
      });

      /* VALIDAR POR LA ACTIVIDADES QUE SE VALLAN A VALIDAR */
      if (actividad === 'Conductor') {
        // Selecciona el contenedor específico para el documento
        const elementoContenedor_Ministerio = document.querySelector(`#td_conductor_ministerio_${documento}`);
        // Encuentra el contenedor del span (asegúrate de que elementoContenedor_Ministerio sea el span o su contenedor)
        var spanElement = elementoContenedor_Ministerio;
        // Encuentra la fila que contiene el spanElement
        var fila = spanElement.closest('tr');

        if (codigoError === 'TER015' && mensaje.includes('DUPLICADO') && codigoError !== 'TER220') {
          document.getElementById('id_conductor_ministerio').value = 1;
          document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          // Aquí puedes realizar una acción específica si ambos están presentes
          document.querySelector('.estado_ministerio_conductor').innerHTML = mensaje;
          document.querySelector('.estado_ministerio_conductor').style.color = '#14A44D';
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
        } else if (codigoError === 'TER220') {
          document.getElementById('id_conductor_ministerio').value = 0;
          document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
          document.querySelector('.estado_ministerio_conductor').innerHTML = mensaje;
          document.querySelector('.estado_ministerio_conductor').style.color = '#DC4C64';
          ejecutar_retransmision(fila, documento, tipo_documento, actividad);
        } else if (codigoError === null) {
          document.getElementById('id_conductor_ministerio').value = 1;
          document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          document.querySelector('.estado_ministerio_conductor').innerHTML = mensaje;
          document.querySelector('.estado_ministerio_conductor').style.color = '#14A44D';
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
        } else if (mensaje.includes('DUPLICADO')) {
          document.getElementById('id_conductor_ministerio').value = 1;
          document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          document.querySelector('.estado_ministerio_conductor').innerHTML = mensaje;
          document.querySelector('.estado_ministerio_conductor').style.color = '#14A44D';
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
          // Acción si solo se encuentra la palabra 'DUPLICADO'
        } else if (codigoError !== null && codigoError !== 'TER015' && mensaje.includes('DUPLICADO') && codigoError !== 'TER220') {
          // console.log(`Documento ${documento}: Se encontró otro código de error: ${codigoError}`);
          document.getElementById('id_conductor_ministerio').value = 0;
          document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
          document.querySelector('.estado_ministerio_conductor').innerHTML = mensaje;
          document.querySelector('.estado_ministerio_conductor').style.color = '#DC4C64';
          // Acción para otros códigos de error si es necesario
          ejecutar_retransmision(fila, documento, tipo_documento, actividad);
        }
      } else if (actividad === 'Propietario') {
        const elementopPropietario_Ministerio = document.querySelector(`#td_propietario_ministerio_${documento}`);
        // Encuentra el contenedor del span (asegúrate de que elementopPropietario_Ministerio sea el span o su contenedor)
        var spanElement = elementopPropietario_Ministerio;
        // Encuentra la fila que contiene el spanElement
        var fila = spanElement.closest('tr');

        if (codigoError === 'TER015' || mensaje.includes('DUPLICADO')) {
          document.getElementById('id_propietario_ministerio').value = 1;
          document.querySelector('.id_ministerio_propietario').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          // Aquí puedes realizar una acción específica si ambos están presentes
          document.querySelector('.estado_ministerio_propietario').innerHTML = decodeISO88591(mensaje);
          document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
        } else if (codigoError === null) {
          document.getElementById('id_propietario_ministerio').value = 1;
          document.querySelector('.id_ministerio_propietario').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          // console.log(`Documento ${documento}: No se encontró código de error.`);
          document.querySelector('.estado_ministerio_propietario').innerHTML = decodeISO88591(mensaje);
          document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
        } else if (mensaje.includes('DUPLICADO')) {
          document.getElementById('id_propietario_ministerio').value = 1;
          document.querySelector('.id_ministerio_propietario').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          // Acción si solo se encuentra la palabra 'DUPLICADO'
          document.querySelector('.estado_ministerio_propietario').innerHTML = decodeISO88591(mensaje);
          document.querySelector('.estado_ministerio_propietario').style.color = '#14A44D';
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
        } else if (codigoError !== null && codigoError !== 'TER015' && mensaje.includes('DUPLICADO') && codigoError !== 'TER220') {
          // console.log(`Documento ${documento}: Se encontró otro código de error: ${codigoError}`);
          document.getElementById('id_propietario_ministerio').value = 0;
          document.querySelector('.id_ministerio_propietario').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
          // Acción para otros códigos de error si es necesario
          document.querySelector('.estado_ministerio_propietario').innerHTML = decodeISO88591(mensaje);
          document.querySelector('.estado_ministerio_propietario').style.color = '#DC4C64';
          // Verifica si se encontró la fila
          ejecutar_retransmision(fila, documento, tipo_documento, actividad);
        }
      } else if (actividad === 'Poseedor') {
        // Selecciona el contenedor específico para el documento
        const elementopPoseedor_Ministerio = document.querySelector(`#td_poseedor_ministerio_${documento}`);
        // Encuentra el contenedor del span (asegúrate de que elementopPoseedor_Ministerio sea el span o su contenedor)
        var spanElement = elementopPoseedor_Ministerio;
        // Encuentra la fila que contiene el spanElement
        var fila = spanElement.closest('tr');

        if (codigoError === 'TER015' || mensaje.includes('DUPLICADO')) {
          document.getElementById('id_poseedor_ministerio').value = 1;
          document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          // Aquí puedes realizar una acción específica si ambos están presentes
          document.querySelector('.estado_ministerio_poseedor').innerHTML = decodeISO88591(mensaje);
          document.querySelector('.estado_ministerio_poseedor').style.color = '#14A44D';
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
        } else if (codigoError === null) {
          document.getElementById('id_poseedor_ministerio').value = 1;
          document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          // console.log(`Documento ${documento}: No se encontró código de error.`);
          document.querySelector('.estado_ministerio_poseedor').innerHTML = decodeISO88591(mensaje);
          document.querySelector('.estado_ministerio_poseedor').style.color = '#14A44D';
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
        } else if (mensaje.includes('DUPLICADO')) {
          document.getElementById('id_poseedor_ministerio').value = 1;
          document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          // Acción si solo se encuentra la palabra 'DUPLICADO'
          document.querySelector('.estado_ministerio_poseedor').innerHTML = decodeISO88591(mensaje);
          document.querySelector('.estado_ministerio_poseedor').style.color = '#14A44D';
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
        } else if (codigoError !== 'TER015' && codigoError !== null && mensaje.includes('DUPLICADO')) {
          // console.log(`Documento ${documento}: Se encontró otro código de error: ${codigoError}`);
          document.getElementById('id_poseedor_ministerio').value = 0;
          document.querySelector('.id_ministerio_poseedor').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
          document.querySelector('.estado_ministerio_poseedor').innerHTML = decodeISO88591(mensaje);
          document.querySelector('.estado_ministerio_poseedor').style.color = '#DC4C64';
          // Verifica si se encontró la fila
          ejecutar_retransmision(fila, documento, tipo_documento, actividad);
        }
      } else if (actividad === 'Propietario Trailer') {
        // Selecciona el contenedor específico para el documento
        const elementopPropietario_Trailer_Ministerio = document.querySelector(`#td_propietario_trailer_ministerio_${documento}`);
        // Encuentra el contenedor del span (asegúrate de que elementopPropietario_Trailer_Ministerio sea el span o su contenedor)
        var spanElement = elementopPropietario_Trailer_Ministerio;

        // Encuentra la fila que contiene el spanElement
        var fila = spanElement.closest('tr');

        if (codigoError === 'TER015' && mensaje.includes('DUPLICADO')) {
          document.getElementById('id_propietario_trailer_ministerio').value = 1;
          document.querySelector('.id_ministerio_propietario_trailer').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          // Aquí puedes realizar una acción específica si ambos están presentes
          document.querySelector('.estado_ministerio_propietario_trailer').innerHTML = decodeISO88591(mensaje);
          document.querySelector('.estado_ministerio_propietario_trailer').style.color = '#14A44D';
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
        } else if (codigoError === null) {
          document.getElementById('id_propietario_trailer_ministerio').value = 1;
          document.querySelector('.id_ministerio_propietario_trailer').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          // console.log(`Documento ${documento}: No se encontró código de error.`);
          document.querySelector('.estado_ministerio_propietario_trailer').innerHTML = decodeISO88591(mensaje);
          document.querySelector('.estado_ministerio_propietario_trailer').style.color = '#14A44D';
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
        } else if (mensaje.includes('DUPLICADO')) {
          document.getElementById('id_propietario_trailer_ministerio').value = 1;
          document.querySelector('.id_ministerio_propietario_trailer').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          // Acción si solo se encuentra la palabra 'DUPLICADO'
          document.querySelector('.estado_ministerio_propietario_trailer').innerHTML = decodeISO88591(mensaje);
          document.querySelector('.estado_ministerio_propietario_trailer').style.color = '#14A44D';
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
        } else if (codigoError !== 'TER015' && mensaje.includes('DUPLICADO') && codigoError !== null) {
          // console.log(`Documento ${documento}: Se encontró otro código de error: ${codigoError}`);
          document.getElementById('id_propietario_trailer_ministerio').value = 0;
          document.querySelector('.id_ministerio_propietario_trailer').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
          // Acción para otros códigos de error si es necesario
          document.querySelector('.estado_ministerio_propietario_trailer').innerHTML = decodeISO88591(mensaje);
          document.querySelector('.estado_ministerio_propietario_trailer').style.color = '#DC4C64';
          ejecutar_retransmision(fila, documento, tipo_documento, actividad);
        }
      }
    }

    loadRndcImages.forEach(image => {
      image.style.display = 'none'; // o 'block' dependiendo de tu preferencia
    });

    document.getElementById('col_rndc_propietario').style.display = 'none';
    document.getElementById('col_rndc_poseedor').style.display = 'none';
    document.getElementById('col_rndc_conductor').style.display = 'none';
    document.getElementById('col_rndc_conductor').style.display = 'none';
    document.getElementById('col_rndc_propietario_trailer').style.display = 'none';

    // ColloadRndcImages.forEach(image => {
    //   image.style.display = 'none'; // o 'block' dependiendo de tu preferencia
    // });

    crear_Proveedores_Oet(documentos, placa, trailer);
  }
}

// Decodificar la parte que contiene los caracteres incorrectos
function decodeISO88591(input) {
  // Convertir la cadena a un Uint8Array asumiendo que es ISO-8859-1
  const bytes = new Uint8Array(input.split('').map(char => char.charCodeAt(0)));
  // Decodificar utilizando TextDecoder para ISO-8859-1
  const decoder = new TextDecoder('ISO-8859-1');
  return decoder.decode(bytes);
}

//Crear datos en OET
async function crear_Proveedores_Oet(documentos, placa, trailer) {
  const actividades = ['3', '5', '4']; // Orden de actividades: 3, 5 para los dos primeros documentos, y 4 para el último
  const promesas = [];
  const mensajes = [];
  // Mostrar todas las imágenes con la clase 'load_oet'
  const loadOetImages = document.querySelectorAll('.load_oet');
  // const ColloadOetImages = document.querySelectorAll('.col_oet');

  loadOetImages.forEach(image => {
    image.style.display = 'inline-block'; // o 'block' dependiendo de tu preferencia
  });
  document.getElementById('col_oet_propietario').style.display = 'block';
  document.getElementById('col_oet_poseedor').style.display = 'block';
  document.getElementById('col_oet_conductor').style.display = 'block';

  // ColloadOetImages.forEach(image => {
  //   image.style.display = 'inline-block'; // o 'block' dependiendo de tu preferencia
  // });

  // Iterar sobre los documentos
  for (let i = 0; i < documentos.documento.length; i++) {
    let actividad = i < 2 ? actividades[i] : actividades[2]; // Usar '3', '5' para los dos primeros, '4' para el último
    let datos_oet = new FormData();
    datos_oet.append('clase_recurso', 1); // Suponiendo que clase y recurso son fijos
    datos_oet.append('recurso', actividad);
    datos_oet.append('dato_recurso', documentos.documento[i]);
    (function (index) {
      promesas.push(
        fetch($('#id_url_ajax').val() + 'integrar_oet/Consulta_Recurso_Avansat', {
          method: 'POST',
          body: datos_oet,
          cache: 'no-cache',
        })
          .then(response => response.json())
          .then(data => {
            let tablas_locales = '';
            if (data.status == true || data.status == 'true') {
              if (data.codigo === '1000') {
                mensajes.push({
                  documento: documentos.documento[index],
                  tipo_documento: documentos.tipo_documento[index],
                  actividad: documentos.actividad[index],
                  mensaje: data.error,
                  codigoError: data.codigo,
                });
              } else {
                mensajes.push({
                  documento: documentos.documento[index],
                  tipo_documento: documentos.tipo_documento[index],
                  actividad: documentos.actividad[index],
                  mensaje: data.error,
                  codigoError: data.codigo,
                });
              }
            } else if (data.status == false || data.status == 'false') {
              mensajes.push({
                documento: documentos.documento[index],
                tipo_documento: documentos.tipo_documento[index],
                actividad: documentos.actividad[index],
                mensaje: data.error,
                codigoError: data.codigo,
              });
            }
          })
          .catch(error => {
            console.error('Error en la solicitud:', error);
            throw error;
          })
          .finally(() => {
            // Hacer algo al finalizar
          }),
      );
    })(i); // Llamamos la IIFE con el valor actual de i
  }

  try {
    await Promise.all(promesas);
  } catch (error) {
    console.error('Error en alguna de las solicitudes:', error);
  } finally {
    // Hacer algo al finalizar
    for (let i = 0; i < mensajes.length; i++) {
      const { documento, tipo_documento, mensaje, actividad, codigoError } = mensajes[i];
      // Selecciona todos los elementos con las clases deseadas
      document.querySelectorAll('.id_oet_propietario').forEach(elemento => {
        elemento.setAttribute('id', `td_propietario_${documento}`);
      });

      document.querySelectorAll('.id_oet_poseedor').forEach(elemento => {
        elemento.setAttribute('id', `td_poseedor_${documento}`);
      });

      document.querySelectorAll('.id_oet_conductor').forEach(elemento => {
        elemento.setAttribute('id', `td_conductor_${documento}`);
      });

      document.querySelectorAll('.tr_pripietario').forEach(elemento => {
        elemento.setAttribute('id', `tr_${documento}`);
      });

      document.querySelectorAll('.tr_poseedor').forEach(elemento => {
        elemento.setAttribute('id', `tr_${documento}`);
      });

      document.querySelectorAll('.tr_conductor').forEach(elemento => {
        elemento.setAttribute('id', `tr_${documento}`);
      });

      // Manipula solo los elementos en el contenedor específico
      if (actividad === 'Conductor') {
        // Selecciona el contenedor específico para el documento
        const elementoContenedor = document.querySelector(`#td_conductor_${documento}`);
        // Encuentra el contenedor del span (asegúrate de que elementoContenedor sea el span o su contenedor)
        var spanElement = elementoContenedor;

        // Encuentra la fila que contiene el spanElement
        var fila = spanElement.closest('tr');
        if (codigoError === '1000' && codigoError !== '1999') {
          document.getElementById('id_conductor_oet').value = 1;
          document.querySelector('.id_oet_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          document.querySelector('.estado_oet_conductor').innerHTML = mensaje;
          document.querySelector('.estado_oet_conductor').style.color = '#14A44D';
          // Aquí puedes realizar una acción específica si ambos están presentes
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
        } else if (codigoError === '1999') {
          document.getElementById('id_conductor_oet').value = 0;
          document.querySelector('.id_oet_conductor').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
          if (mensaje === 'NO HAY TIPO DE DOCUMENTO DEFINIDO') {
            document.querySelector('.estado_oet_conductor').innerHTML = mensaje;
          } else {
            /* Hologacion de los mensajes de oet */
            // Usamos map para iterar sobre cada elemento del array
            const campos = mensaje.map(msg => {
              // Dividimos la cadena por 'Campo - ' y tomamos la segunda parte
              const campoPart = msg.split('Campo - ')[1];
              // Luego, dividimos por ',' para obtener solo la parte que contiene 'num_placax' o 'num_polirc'
              return campoPart.split(',')[0].trim();
            });
            let variables = Hologacion_respuestas(campos, 'Conductor');
            document.querySelector('.estado_oet_conductor').innerHTML = variables;
          }
          document.querySelector('.estado_oet_conductor').style.color = '#DC4C64';
          // console.log(`Documento ${documento}: No se encontró código de error.`);
        } else if (codigoError === '1000') {
          document.getElementById('id_conductor_oet').value = 1;
          document.querySelector('.id_oet_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          document.querySelector('.estado_oet_conductor').innerHTML = mensaje;
          document.querySelector('.estado_oet_conductor').style.color = '#14A44D';
          // Aquí puedes realizar una acción específica si ambos están presentes
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
        } else if (codigoError === '6001') {
          // console.log(`Documento ${documento}: Se encontró otro código de error: ${codigoError}`);
          document.getElementById('id_conductor_oet').value = 0;
          document.querySelector('.id_oet_conductor').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
          if (mensaje === 'NO HAY TIPO DE DOCUMENTO DEFINIDO') {
            document.querySelector('.estado_oet_conductor').innerHTML = 'Verificar el espacio en los campos de nombres o apellidos';
          } else {
            /* Hologacion de los mensajes de oet */
            // Usamos map para iterar sobre cada elemento del array
            const campos = mensaje.map(msg => {
              // Dividimos la cadena por 'Campo - ' y tomamos la segunda parte
              const campoPart = msg.split('Campo - ')[1];
              // Luego, dividimos por ',' para obtener solo la parte que contiene 'num_placax' o 'num_polirc'
              return campoPart.split(',')[0].trim();
            });
            let variables = Hologacion_respuestas(campos, 'Conductor');
            document.querySelector('.estado_oet_conductor').innerHTML = variables;
          }
          document.querySelector('.estado_oet_conductor').style.color = '#DC4C64';
          // Acción para otros códigos de error si es necesario

          // Verifica si se encontró la fila
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#DC4C64';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente

            // Crea el botón
            var butto_conductor = document.createElement('a');
            butto_conductor.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
            butto_conductor.className = 'icon btn_retransmitir_endpoint';

            // Asigna el evento onclick directamente
            butto_conductor.onclick = async function () {
              try {
                // Espera la respuesta de la función asincrónica
                var respuesta_oet_retransmision = await Retransmitir_Dato_Oet(documento, actividad);

                // Itera sobre la respuesta
                respuesta_oet_retransmision.forEach(element => {
                  if (element.codigoError === '1000' && element.codigoError === '1999') {
                    document.getElementById('id_conductor_oet').value = 1;
                    document.querySelector('.id_oet_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    document.querySelector('.estado_oet_conductor').innerHTML = element.mensaje;
                    document.querySelector('.estado_oet_conductor').style.color = '#14A44D';
                    butto_conductor.style.display = 'none';
                  } else if (element.codigoError === '1999') {
                    document.getElementById('id_conductor_oet').value = 0;
                    document.querySelector('.id_oet_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    document.querySelector('.estado_oet_conductor').innerHTML = element.mensaje;
                    document.querySelector('.estado_oet_conductor').style.color = '#DC4C64';
                  } else if (element.codigoError === '1000') {
                    document.getElementById('id_conductor_oet').value = 1;
                    document.querySelector('.id_oet_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    document.querySelector('.estado_oet_conductor').innerHTML = element.mensaje;
                    document.querySelector('.estado_oet_conductor').style.color = '#14A44D';
                    butto_conductor.style.display = 'none';
                  } else if (element.codigoError === '6001') {
                    document.getElementById('id_conductor_oet').value = 0;
                    document.querySelector('.id_oet_conductor').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                    document.querySelector('.estado_oet_conductor').innerHTML = element.mensaje;
                    document.querySelector('.estado_oet_conductor').style.color = '#DC4C64';
                  } else {
                    console.log('Codigo de error: ' + element.codigoError);
                  }
                });
              } catch (error) {
                // Maneja el error
                console.error('Error al retransmitir datos OET:', error);
                alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
              }
            };

            // Estilos del botón
            butto_conductor.style.textDecoration = 'none';
            butto_conductor.style.color = '#14A44D';
            butto_conductor.style.paddingLeft = '10px';
            butto_conductor.setAttribute('data-toggle', 'tooltip');
            butto_conductor.setAttribute('title', `Retransmitir ${actividad}`);
            butto_conductor.setAttribute('data-placement', 'bottom');

            // Crea el elemento <span> dentro del <a> para el icono
            var iconSpan = document.createElement('span');
            iconSpan.className = 'mdi mdi-mail-send';

            // Añade el <span> al <a>
            butto_conductor.appendChild(iconSpan);

            // Añade el botón a la nueva celda
            nuevaCelda.appendChild(butto_conductor);

            // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.error('El elemento span no se encontró.');
          }
        }
      } else if (actividad === 'Propietario') {
        // Selecciona el contenedor específico para el documento
        const elementoContenedor1 = document.querySelector(`#td_propietario_${documento}`);
        // Encuentra el contenedor del span (asegúrate de que elementoContenedor1 sea el span o su contenedor)
        var spanElement = elementoContenedor1;

        // Encuentra la fila que contiene el spanElement
        var fila = spanElement.closest('tr');
        if (codigoError === '1000' && codigoError !== '1999') {
          document.getElementById('id_propietario_oet').value = 1;
          document.querySelector('.id_oet_propietario').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          document.querySelector('.estado_oet_propietario').innerHTML = mensaje;
          document.querySelector('.estado_oet_propietario').style.color = '#14A44D';
          // Aquí puedes realizar una acción específica si ambos están presentes
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
          // Aquí puedes realizar una acción específica si ambos están presentes
        } else if (codigoError === '1999') {
          document.getElementById('id_propietario_oet').value = 1;
          document.querySelector('.id_oet_propietario').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          document.querySelector('.estado_oet_propietario').innerHTML = mensaje;
          document.querySelector('.estado_oet_propietario').style.color = '#14A44D';
          // Aquí puedes realizar una acción específica si ambos están presentes
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
          // console.log(`Documento ${documento}: No se encontró código de error.`);
        } else if (codigoError === '1000') {
          document.getElementById('id_propietario_oet').value = 1;
          document.querySelector('.id_oet_propietario').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          document.querySelector('.estado_oet_propietario').innerHTML = mensaje;
          document.querySelector('.estado_oet_propietario').style.color = '#14A44D';
          // Aquí puedes realizar una acción específica si ambos están presentes
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
          // Acción si solo se encuentra la palabra 'DUPLICADO'
        } else if (codigoError === '6001') {
          // console.log(`Documento ${documento}: Se encontró otro código de error: ${codigoError}`);
          document.getElementById('id_propietario_oet').value = 0;
          document.querySelector('.id_oet_propietario').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
          document.querySelector('.id_oet_conductor').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
          if (mensaje === 'NO HAY TIPO DE DOCUMENTO DEFINIDO') {
            document.querySelector('.estado_oet_propietario').innerHTML = 'Verificar el espacio en los campos de nombres o apellidos';
          } else {
            /* Hologacion de los mensajes de oet */
            // Usamos map para iterar sobre cada elemento del array
            const campos = mensaje.map(msg => {
              // Dividimos la cadena por 'Campo - ' y tomamos la segunda parte
              const campoPart = msg.split('Campo - ')[1];
              // Luego, dividimos por ',' para obtener solo la parte que contiene 'num_placax' o 'num_polirc'
              return campoPart.split(',')[0].trim();
            });
            let variables = Hologacion_respuestas(campos, 'Conductor');
            document.querySelector('.estado_oet_propietario').innerHTML = variables;
          }
          // document.querySelector('.estado_oet_propietario').innerHTML = mensaje;
          document.querySelector('.estado_oet_propietario').style.color = '#DC4C64';
          // Acción para otros códigos de error si es necesario
          // Verifica si se encontró la fila
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#DC4C64';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente

            // Crea el botón
            var butto_propietario = document.createElement('a');
            butto_propietario.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
            butto_propietario.className = 'icon btn_retransmitir_endpoint';

            // Asigna el evento onclick directamente
            butto_propietario.onclick = async function () {
              try {
                // Espera la respuesta de la función asincrónica
                var respuesta_oet_retransmision = await Retransmitir_Dato_Oet(documento, actividad);

                // Itera sobre la respuesta
                respuesta_oet_retransmision.forEach(element => {
                  if (element.codigoError === '1000' && element.codigoError === '1999') {
                    document.getElementById('id_propietario_oet').value = 1;
                    document.querySelector('.id_oet_propietario').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    document.querySelector('.estado_oet_propietario').innerHTML = element.mensaje;
                    document.querySelector('.estado_oet_propietario').style.color = '#14A44D';
                    butto_propietario.style.display = 'none';
                  } else if (element.codigoError === '1999') {
                    document.getElementById('id_propietario_oet').value = 0;
                    document.querySelector('.id_oet_propietario').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    document.querySelector('.estado_oet_propietario').innerHTML = element.mensaje;
                    document.querySelector('.estado_oet_propietario').style.color = '#DC4C64';
                  } else if (element.codigoError === '1000') {
                    document.getElementById('id_propietario_oet').value = 1;
                    document.querySelector('.id_oet_propietario').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    document.querySelector('.estado_oet_propietario').innerHTML = element.mensaje;
                    document.querySelector('.estado_oet_propietario').style.color = '#14A44D';
                    butto_propietario.style.display = 'none';
                  } else if (element.codigoError === '6001') {
                    document.getElementById('id_propietario_oet').value = 0;
                    document.querySelector('.id_oet_propietario').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                    document.querySelector('.estado_oet_propietario').innerHTML = element.mensaje;
                    document.querySelector('.estado_oet_propietario').style.color = '#DC4C64';
                  } else {
                    console.log('Codigo de error: ' + element.codigoError);
                  }
                });
              } catch (error) {
                // Maneja el error
                console.error('Error al retransmitir datos OET:', error);
                alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
              }
            };

            // Estilos del botón
            butto_propietario.style.textDecoration = 'none';
            butto_propietario.style.color = '#14A44D';
            butto_propietario.style.paddingLeft = '10px';
            butto_propietario.setAttribute('data-toggle', 'tooltip');
            butto_propietario.setAttribute('title', `Retransmitir ${actividad}`);
            butto_propietario.setAttribute('data-placement', 'bottom');

            // Crea el elemento <span> dentro del <a> para el icono
            var iconSpan = document.createElement('span');
            iconSpan.className = 'mdi mdi-mail-send';

            // Añade el <span> al <a>
            butto_propietario.appendChild(iconSpan);

            // Añade el botón a la nueva celda
            nuevaCelda.appendChild(butto_propietario);

            // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.error('El elemento span no se encontró.');
          }
        }
      } else if (actividad === 'Poseedor') {
        // Selecciona el contenedor específico para el documento
        const elementoContenedor2 = document.querySelector(`#td_poseedor_${documento}`);
        // Encuentra el contenedor del span (asegúrate de que elementoContenedor2 sea el span o su contenedor)
        var spanElement = elementoContenedor2;

        // Encuentra la fila que contiene el spanElement
        var fila = spanElement.closest('tr');
        if (codigoError === '1000' && codigoError !== '1999') {
          document.getElementById('id_poseedor_oet').value = 1;
          document.querySelector('.id_oet_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          document.querySelector('.estado_oet_poseedor').innerHTML = mensaje;
          document.querySelector('.estado_oet_poseedor').style.color = '#14A44D';
          // Aquí puedes realizar una acción específica si ambos están presentes
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
          // Aquí puedes realizar una acción específica si ambos están presentes
        } else if (codigoError === '1999') {
          document.getElementById('id_poseedor_oet').value = 1;
          document.querySelector('.id_oet_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          document.querySelector('.estado_oet_poseedor').innerHTML = mensaje;
          document.querySelector('.estado_oet_poseedor').style.color = '#14A44D';
          // Aquí puedes realizar una acción específica si ambos están presentes
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
          // console.log(`Documento ${documento}: No se encontró código de error.`);
        } else if (codigoError === '1000') {
          document.getElementById('id_poseedor_oet').value = 1;
          document.querySelector('.id_oet_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
          document.querySelector('.estado_oet_poseedor').innerHTML = mensaje;
          document.querySelector('.estado_oet_poseedor').style.color = '#14A44D';
          // Aquí puedes realizar una acción específica si ambos están presentes
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#14A44D';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
            // Añade el botón a la nueva celda
            nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
            //<i class="far fa-times-circle"></i>
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.log('Error no se creo la fila');
          }
          // Acción si solo se encuentra la palabra 'DUPLICADO'
        } else if (codigoError === '6001') {
          // console.log(`Documento ${documento}: Se encontró otro código de error: ${codigoError}`);
          document.getElementById('id_poseedor_oet').value = 0;
          document.querySelector('.id_oet_poseedor').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
          if (mensaje === 'NO HAY TIPO DE DOCUMENTO DEFINIDO') {
            document.querySelector('.estado_oet_poseedor').innerHTML = 'Verificar el espacio en los campos de nombres o apellidos';
          } else {
            /* Hologacion de los mensajes de oet */
            // Usamos map para iterar sobre cada elemento del array
            const campos = mensaje.map(msg => {
              // Dividimos la cadena por 'Campo - ' y tomamos la segunda parte
              const campoPart = msg.split('Campo - ')[1];
              // Luego, dividimos por ',' para obtener solo la parte que contiene 'num_placax' o 'num_polirc'
              return campoPart.split(',')[0].trim();
            });
            let variables = Hologacion_respuestas(campos, 'Conductor');
            document.querySelector('.estado_oet_poseedor').innerHTML = variables;
          }
          // document.querySelector('.estado_oet_poseedor').innerHTML = mensaje;
          document.querySelector('.estado_oet_poseedor').style.color = '#DC4C64';
          // Acción para otros códigos de error si es necesario
          // Verifica si se encontró la fila
          if (fila) {
            // Crea el nuevo elemento <td>
            var nuevaCelda = document.createElement('td');
            nuevaCelda.style.color = '#DC4C64';
            nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente

            // Crea el botón
            var butto_poseedor = document.createElement('a');
            butto_poseedor.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
            butto_poseedor.className = 'icon btn_retransmitir_endpoint';

            // Asigna el evento onclick directamente
            butto_poseedor.onclick = async function () {
              try {
                // Espera la respuesta de la función asincrónica
                var respuesta_oet_retransmision = await Retransmitir_Dato_Oet(documento, actividad);

                // Itera sobre la respuesta
                respuesta_oet_retransmision.forEach(element => {
                  if (element.codigoError === '1000' && element.codigoError === '1999') {
                    document.getElementById('id_poseedor_oet').value = 1;
                    document.querySelector('.id_oet_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    document.querySelector('.estado_oet_poseedor').innerHTML = element.mensaje;
                    document.querySelector('.estado_oet_poseedor').style.color = '#14A44D';
                    butto_poseedor.style.display = 'none';
                  } else if (element.codigoError === '1999') {
                    document.getElementById('id_poseedor_oet').value = 0;
                    document.querySelector('.id_oet_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    document.querySelector('.estado_oet_poseedor').innerHTML = element.mensaje;
                    document.querySelector('.estado_oet_poseedor').style.color = '#DC4C64';
                  } else if (element.codigoError === '1000') {
                    document.getElementById('id_poseedor_oet').value = 1;
                    document.querySelector('.id_oet_poseedor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                    document.querySelector('.estado_oet_poseedor').innerHTML = element.mensaje;
                    document.querySelector('.estado_oet_poseedor').style.color = '#14A44D';
                    butto_poseedor.style.display = 'none';
                  } else if (element.codigoError === '6001') {
                    document.getElementById('id_poseedor_oet').value = 0;
                    document.querySelector('.id_oet_poseedor').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                    document.querySelector('.estado_oet_poseedor').innerHTML = element.mensaje;
                    document.querySelector('.estado_oet_poseedor').style.color = '#DC4C64';
                  } else {
                    console.log('Codigo de error: ' + element.codigoError);
                  }
                });
              } catch (error) {
                // Maneja el error
                console.error('Error al retransmitir datos OET:', error);
                alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
              }
            };

            // Estilos del botón
            butto_poseedor.style.textDecoration = 'none';
            butto_poseedor.style.color = '#14A44D';
            butto_poseedor.style.paddingLeft = '10px';
            butto_poseedor.setAttribute('data-toggle', 'tooltip');
            butto_poseedor.setAttribute('title', `Retransmitir ${actividad}`);
            butto_poseedor.setAttribute('data-placement', 'bottom');

            // Crea el elemento <span> dentro del <a> para el icono
            var iconSpan = document.createElement('span');
            iconSpan.className = 'mdi mdi-mail-send';

            // Añade el <span> al <a>
            butto_poseedor.appendChild(iconSpan);

            // Añade el botón a la nueva celda
            nuevaCelda.appendChild(butto_poseedor);

            // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
            var columnas = fila.querySelectorAll('td');
            if (columnas.length > 4) {
              // Añade la nueva celda antes de la última columna
              fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
            }
          } else {
            console.error('El elemento span no se encontró.');
          }
        }
      } else if (actividad === 'Propietario Trailer') {
      }
    }

    loadOetImages.forEach(image => {
      image.style.display = 'none'; // o 'block' dependiendo de tu preferencia
    });

    document.getElementById('col_oet_propietario').style.display = 'none';
    document.getElementById('col_oet_poseedor').style.display = 'none';
    document.getElementById('col_oet_conductor').style.display = 'none';

    // ColloadOetImages.forEach(image => {
    //   image.style.display = 'none'; // o 'block' dependiendo de tu preferencia
    // });

    crear_Dato_Ministerio(placa, trailer);
  }
}

async function crear_Dato_Ministerio(placa, trailer) {
  document.querySelector('.id_ministerio_vehiculo').setAttribute('id', `td_vehiculo_ministerio_${placa}`);
  document.querySelector('.tr_vehiculo').setAttribute('id', `tr_${placa}`);
  const loadRndcImages = document.querySelectorAll('.load_rndc');
  // const ColloadRndcImages = document.querySelectorAll('.col_rndc');

  loadRndcImages.forEach(image => {
    image.style.display = 'inline-block'; // o 'block' dependiendo de tu preferencia
  });
  document.getElementById('col_rndc_vehiculo').style.display = 'block';

  const mensajes = [];
  // Selecciona el contenedor específico para el documento
  const elementoVehiculo = document.querySelector(`#td_vehiculo_ministerio_${placa}`);
  // Encuentra el contenedor del span (asegúrate de que elementoVehiculo sea el span o su contenedor)
  var spanElement = elementoVehiculo;

  // Encuentra la fila que contiene el spanElement
  var fila = spanElement.closest('tr');

  proceso = 12;
  var datos_rndc = new FormData();
  datos_rndc.append('placa', placa);
  datos_rndc.append('proceso', proceso);
  datos_rndc.append('dato', 3);
  datos_rndc.append('filtro', '');
  datos_rndc.append('tipopro', 3);
  try {
    const response = await fetch($('#id_url_ajax').val() + 'web_service/vehiculos', {
      method: 'POST',
      body: datos_rndc,
      cache: 'no-cache',
    });
    const data = await response.json();
    // var tablas_locales = 'Se Registro Datos Exitosamente RNDC';
    if (data.status == 'true') {
      const errorCodeMatch = data.resultado.match(/VEH\d{3}/);
      const errorCode = errorCodeMatch ? errorCodeMatch[0] : null;
      if (errorCode) {
        mensajes.push({ documento: documentos.documento[index], actividad: documentos.actividad[index], mensaje: data.resultado, codigoError: errorCode });
      } else {
        mensajes.push({ documento: documentos.documento[index], actividad: documentos.actividad[index], mensaje: data.resultado, codigoError: null });
      }
      document.getElementById('id_vehiculo_minsterio').value = 1;
      document.querySelector('.id_ministerio_vehiculo').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
      document.querySelector('.estado_ministerio_vehiculo').innerHTML = errorCodeMatch.input;
      document.querySelector('.estado_ministerio_vehiculo').style.color = '#14A44D';
      // Aquí puedes realizar una acción específica si ambos están presentes
      if (fila) {
        // Crea el nuevo elemento <td>
        var nuevaCelda = document.createElement('td');
        nuevaCelda.style.color = '#14A44D';
        nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
        // Añade el botón a la nueva celda
        nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
        //<i class="far fa-times-circle"></i>
        var columnas = fila.querySelectorAll('td');
        if (columnas.length > 4) {
          // Añade la nueva celda antes de la última columna
          fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
        }
      } else {
        console.log('Error no se creo la fila');
      }
    } else if (data.status == 'false') {
      const errorCodeMatch = data.resultado.match(/VEH\d{3}/);
      const errorCode = errorCodeMatch ? errorCodeMatch[0] : null;
      if (errorCode === 'VEH015') {
        document.getElementById('id_vehiculo_minsterio').value = 1;
        document.querySelector('.id_ministerio_vehiculo').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
        document.querySelector('.estado_ministerio_vehiculo').innerHTML = errorCodeMatch.input;
        document.querySelector('.estado_ministerio_vehiculo').style.color = '#14A44D';
        // Aquí puedes realizar una acción específica si ambos están presentes
        if (fila) {
          // Crea el nuevo elemento <td>
          var nuevaCelda = document.createElement('td');
          nuevaCelda.style.color = '#14A44D';
          nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
          // Añade el botón a la nueva celda
          nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
          //<i class="far fa-times-circle"></i>
          var columnas = fila.querySelectorAll('td');
          if (columnas.length > 4) {
            // Añade la nueva celda antes de la última columna
            fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
          }
        } else {
          console.log('Error no se creo la fila');
        }
      } else {
        document.getElementById('id_vehiculo_minsterio').value = 0;
        document.querySelector('.id_ministerio_vehiculo').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
        document.querySelector('.estado_ministerio_vehiculo').innerHTML = mensaje;
        document.querySelector('.estado_ministerio_vehiculo').style.color = '#DC4C64';
        ejecutar_retransmision(fila, placa, '', 'Vehiculo');
      }
    }
  } catch (error) {
    if (error.message.includes('SOAP-ERROR: Parsing WSDL')) {
      // Mostrar un mensaje específico o realizar una acción
      document.getElementById('mensaje_error_validacion').innerHTML = `<div role="alert" class="alert alert-info alert-icon alert-icon-border alert-dismissible">
      <div class="icon"><span class="mdi mdi-alert-triangle"></span></div><div class="message">
        <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button>
        <strong>Información!</strong> Error al cargar el servicio SOAP del RNDC. Por favor, verifica la conexión o la URL del RNDC.
      </div>
    </div>`;
      ejecutar_retransmision(fila, placa, '', 'Vehiculo');
    } else {
      // Manejar otros errores
      document.getElementById('mensaje_error_validacion').innerHTML = `<div role="alert" class="alert alert-info alert-icon alert-icon-border alert-dismissible">
      <div class="icon"><span class="mdi mdi-alert-triangle"></span></div><div class="message">
        <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button>
        <strong>Información!</strong> Error al cargar el servicio SOAP del RNDC. Por favor, verifica la conexión o la URL del RNDC.
      </div>
    </div>`;
      ejecutar_retransmision(fila, placa, '', 'Vehiculo');
    }
  } finally {
    document.getElementById('col_rndc_vehiculo').style.display = 'none';
    loadRndcImages.forEach(image => {
      image.style.display = 'none'; // o 'block' dependiendo de tu preferencia
    });
    crear_Dato_Oet(placa, trailer);
  }
}

async function crear_Dato_Oet(placa, trailer) {
  document.querySelector('.id_oet_vehiculo').setAttribute('id', `td_vehiculo_${placa}`);
  document.querySelector('.tr_vehiculo').setAttribute('id', `tr_${placa}`);

  document.getElementById('col_oet_vehiculo').style.display = 'block';
  const loadOetImages = document.querySelectorAll('.load_oet');
  loadOetImages.forEach(image => {
    image.style.display = 'inline-block'; // o 'block' dependiendo de tu preferencia
  });

  // Selecciona el contenedor específico para el documento
  const elementoVehiculo = document.querySelector(`#td_vehiculo_${placa}`);
  // Encuentra el contenedor del span (asegúrate de que elementoVehiculo sea el span o su contenedor)
  var spanElement = elementoVehiculo;

  // Encuentra la fila que contiene el spanElement
  var fila = spanElement.closest('tr');

  clase = 2;
  recurso = 6;
  let datos_oet = new FormData();
  datos_oet.append('clase_recurso', clase);
  datos_oet.append('recurso', recurso);
  datos_oet.append('dato_recurso', placa);
  //Consulta_Recurso_Avansat
  try {
    const response = await fetch($('#id_url_ajax').val() + 'integrar_oet/Consulta_Recurso_Avansat', {
      method: 'POST',
      body: datos_oet,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data.status == true || data.status == 'true') {
      if (data.codigo === '1000') {
        document.getElementById('id_vehiculo_oet').value = 1;
        document.querySelector('.id_oet_vehiculo').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
        document.querySelector('.estado_oet_vehiculo').innerHTML = data.error;
        document.querySelector('.estado_oet_vehiculo').style.color = '#14A44D';
        // Aquí puedes realizar una acción específica si ambos están presentes
        if (fila) {
          // Crea el nuevo elemento <td>
          var nuevaCelda = document.createElement('td');
          nuevaCelda.style.color = '#14A44D';
          nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
          // Añade el botón a la nueva celda
          nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
          //<i class="far fa-times-circle"></i>
          var columnas = fila.querySelectorAll('td');
          if (columnas.length > 4) {
            // Añade la nueva celda antes de la última columna
            fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
          }
        } else {
          console.log('Error no se creo la fila');
        }
      } else {
        document.getElementById('id_vehiculo_oet').value = 0;
        document.querySelector('.id_oet_vehiculo').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
        /* Hologacion de los mensajes de oet */
        // Usamos map para iterar sobre cada elemento del array
        const campos = data.error.map(msg => {
          // Dividimos la cadena por 'Campo - ' y tomamos la segunda parte
          const campoPart = msg.split('Campo - ')[1];
          // Luego, dividimos por ',' para obtener solo la parte que contiene 'num_placax' o 'num_polirc'
          return campoPart.split(',')[0].trim();
        });

        let variables = Hologacion_respuestas(campos, 'Vehiculo');
        document.querySelector('.estado_oet_vehiculo').innerHTML = data.error;
        document.querySelector('.estado_oet_vehiculo').style.color = '#DC4C64';
        // Verifica si se encontró la fila
        if (fila) {
          // Crea el nuevo elemento <td>
          var nuevaCelda = document.createElement('td');
          nuevaCelda.style.color = '#DC4C64';
          nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente

          // Crea el botón
          var butto_conductor = document.createElement('a');
          butto_conductor.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
          butto_conductor.className = 'icon btn_retransmitir_endpoint';

          // Asigna el evento onclick directamente
          butto_conductor.onclick = async function () {
            try {
              // Espera la respuesta de la función asincrónica
              var respuesta_oet_retransmision = await Retransmitir_Vehiculo_Oet(placa);

              // Itera sobre la respuesta
              respuesta_oet_retransmision.forEach(element => {
                if (element.codigoError === '1000' && element.codigoError === '1999') {
                  document.getElementById('id_vehiculo_oet').value = 1;
                  document.querySelector('.id_oet_vehiculo').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                  document.querySelector('.estado_oet_vehiculo').innerHTML = element.mensaje;
                  document.querySelector('.estado_oet_vehiculo').style.color = '#14A44D';
                  // Aquí puedes realizar una acción específica si ambos están presentes
                  if (fila) {
                    // Crea el nuevo elemento <td>
                    var nuevaCelda = document.createElement('td');
                    nuevaCelda.style.color = '#14A44D';
                    nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
                    // Añade el botón a la nueva celda
                    nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
                    //<i class="far fa-times-circle"></i>
                    var columnas = fila.querySelectorAll('td');
                    if (columnas.length > 4) {
                      // Añade la nueva celda antes de la última columna
                      fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
                    }
                  } else {
                    console.log('Error no se creo la fila');
                  }
                } else if (element.codigoError === '1999') {
                  document.getElementById('id_vehiculo_oet').value = 0;
                  document.querySelector('.id_oet_vehiculo').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                  document.querySelector('.estado_oet_vehiculo').innerHTML = element.mensaje;
                  document.querySelector('.estado_oet_vehiculo').style.color = '#DC4C64';
                } else if (element.codigoError === '1000') {
                  document.getElementById('id_vehiculo_oet').value = 1;
                  document.querySelector('.id_oet_vehiculo').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                  document.querySelector('.estado_oet_vehiculo').innerHTML = element.mensaje;
                  document.querySelector('.estado_oet_vehiculo').style.color = '#14A44D';
                  // Aquí puedes realizar una acción específica si ambos están presentes
                  if (fila) {
                    // Crea el nuevo elemento <td>
                    var nuevaCelda = document.createElement('td');
                    nuevaCelda.style.color = '#14A44D';
                    nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
                    // Añade el botón a la nueva celda
                    nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
                    //<i class="far fa-times-circle"></i>
                    var columnas = fila.querySelectorAll('td');
                    if (columnas.length > 4) {
                      // Añade la nueva celda antes de la última columna
                      fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
                    }
                  } else {
                    console.log('Error no se creo la fila');
                  }
                } else if (element.codigoError === '6001') {
                  document.getElementById('id_vehiculo_oet').value = 0;
                  document.querySelector('.id_oet_vehiculo').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                  document.querySelector('.estado_oet_vehiculo').innerHTML = element.mensaje;
                  document.querySelector('.estado_oet_vehiculo').style.color = '#DC4C64';
                } else {
                  console.log('Codigo de error: ' + element.codigoError);
                }
              });
            } catch (error) {
              // Maneja el error
              console.error('Error al retransmitir datos OET:', error);
              alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
            }
          };

          // Estilos del botón
          butto_conductor.style.textDecoration = 'none';
          butto_conductor.style.color = '#14A44D';
          butto_conductor.style.paddingLeft = '10px';
          butto_conductor.setAttribute('data-toggle', 'tooltip');
          butto_conductor.setAttribute('title', `Retransmitir Vehículo`);
          butto_conductor.setAttribute('data-placement', 'bottom');

          // Crea el elemento <span> dentro del <a> para el icono
          var iconSpan = document.createElement('span');
          iconSpan.className = 'mdi mdi-mail-send';

          // Añade el <span> al <a>
          butto_conductor.appendChild(iconSpan);

          // Añade el botón a la nueva celda
          nuevaCelda.appendChild(butto_conductor);

          // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
          var columnas = fila.querySelectorAll('td');
          if (columnas.length > 4) {
            // Añade la nueva celda antes de la última columna
            fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
          }
        } else {
          console.error('El elemento span no se encontró.');
        }
      }
    } else if (data.status == false || data.status == 'false') {
      document.getElementById('id_vehiculo_oet').value = 0;
      document.querySelector('.id_oet_vehiculo').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
      /* Hologacion de los mensajes de oet */
      // Usamos map para iterar sobre cada elemento del array
      const campos = data.error.map(msg => {
        // Dividimos la cadena por 'Campo - ' y tomamos la segunda parte
        const campoPart = msg.split('Campo - ')[1];
        // Luego, dividimos por ',' para obtener solo la parte que contiene 'num_placax' o 'num_polirc'
        return campoPart.split(',')[0].trim();
      });
      let variables = Hologacion_respuestas(campos, 'Vehiculo');

      // document.querySelector('.estado_oet_vehiculo').innerHTML = data.error;
      document.querySelector('.estado_oet_vehiculo').innerHTML = variables;
      document.querySelector('.estado_oet_vehiculo').style.color = '#DC4C64';
      // Selecciona el contenedor específico para el documento
      const elementoVehiculo = document.querySelector(`#td_vehiculo_${placa}`);
      // Encuentra el contenedor del span (asegúrate de que elementoVehiculo sea el span o su contenedor)
      var spanElement = elementoVehiculo;

      // Encuentra la fila que contiene el spanElement
      var fila = spanElement.closest('tr');
      // Verifica si se encontró la fila
      if (fila) {
        // Crea el nuevo elemento <td>
        var nuevaCelda = document.createElement('td');
        nuevaCelda.style.color = '#DC4C64';
        nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente

        // Crea el botón
        var butto_conductor = document.createElement('a');
        butto_conductor.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
        butto_conductor.className = 'icon btn_retransmitir_endpoint';

        // Asigna el evento onclick directamente
        butto_conductor.onclick = async function () {
          try {
            // Espera la respuesta de la función asincrónica
            var respuesta_oet_retransmision = await Retransmitir_Vehiculo_Oet(placa);

            // Itera sobre la respuesta
            respuesta_oet_retransmision.forEach(element => {
              if (element.codigoError === '1000' && element.codigoError === '1999') {
                document.getElementById('id_vehiculo_oet').value = 1;
                document.querySelector('.id_oet_vehiculo').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                document.querySelector('.estado_oet_vehiculo').innerHTML = element.mensaje;
                document.querySelector('.estado_oet_vehiculo').style.color = '#14A44D';
                // Aquí puedes realizar una acción específica si ambos están presentes
                if (fila) {
                  // Crea el nuevo elemento <td>
                  var nuevaCelda = document.createElement('td');
                  nuevaCelda.style.color = '#14A44D';
                  nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
                  // Añade el botón a la nueva celda
                  nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
                  //<i class="far fa-times-circle"></i>
                  var columnas = fila.querySelectorAll('td');
                  if (columnas.length > 4) {
                    // Añade la nueva celda antes de la última columna
                    fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
                  }
                } else {
                  console.log('Error no se creo la fila');
                }
              } else if (element.codigoError === '1999') {
                document.getElementById('id_vehiculo_oet').value = 0;
                document.querySelector('.id_oet_vehiculo').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                document.querySelector('.estado_oet_vehiculo').innerHTML = element.mensaje;
                document.querySelector('.estado_oet_vehiculo').style.color = '#DC4C64';
              } else if (element.codigoError === '1000') {
                document.getElementById('id_vehiculo_oet').value = 1;
                document.querySelector('.id_oet_vehiculo').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                document.querySelector('.estado_oet_vehiculo').innerHTML = element.mensaje;
                document.querySelector('.estado_oet_vehiculo').style.color = '#14A44D';
                // Aquí puedes realizar una acción específica si ambos están presentes
                if (fila) {
                  // Crea el nuevo elemento <td>
                  var nuevaCelda = document.createElement('td');
                  nuevaCelda.style.color = '#14A44D';
                  nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
                  // Añade el botón a la nueva celda
                  nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
                  //<i class="far fa-times-circle"></i>
                  var columnas = fila.querySelectorAll('td');
                  if (columnas.length > 4) {
                    // Añade la nueva celda antes de la última columna
                    fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
                  }
                } else {
                  console.log('Error no se creo la fila');
                }
              } else if (element.codigoError === '6001') {
                document.getElementById('id_vehiculo_oet').value = 0;
                document.querySelector('.id_oet_vehiculo').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                document.querySelector('.estado_oet_vehiculo').innerHTML = element.mensaje;
                document.querySelector('.estado_oet_vehiculo').style.color = '#DC4C64';
              } else {
                console.log('Codigo de error: ' + element.codigoError);
              }
            });
          } catch (error) {
            // Maneja el error
            console.error('Error al retransmitir datos OET:', error);
            alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
          }
        };

        // Estilos del botón
        butto_conductor.style.textDecoration = 'none';
        butto_conductor.style.color = '#14A44D';
        butto_conductor.style.paddingLeft = '10px';
        butto_conductor.setAttribute('data-toggle', 'tooltip');
        butto_conductor.setAttribute('title', `Retransmitir Vehículo`);
        butto_conductor.setAttribute('data-placement', 'bottom');

        // Crea el elemento <span> dentro del <a> para el icono
        var iconSpan = document.createElement('span');
        iconSpan.className = 'mdi mdi-mail-send';

        // Añade el <span> al <a>
        butto_conductor.appendChild(iconSpan);

        // Añade el botón a la nueva celda
        nuevaCelda.appendChild(butto_conductor);

        // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
        var columnas = fila.querySelectorAll('td');
        if (columnas.length > 4) {
          // Añade la nueva celda antes de la última columna
          fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
        }
      } else {
        console.error('El elemento span no se encontró.');
      }
    }
    // document.getElementById('mensaje_oet').innerHTML += contenidoHTML2;
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    if (trailer === '') {
      let Propietario = document.getElementById('id_propietario_oet').value;
      let Poseedor = document.getElementById('id_poseedor_oet').value;
      let Conductor = document.getElementById('id_conductor_oet').value;
      let Vehiculo = document.getElementById('id_vehiculo_oet').value;
      /* Datos validados en el ministerio */
      let Propietario_ministerio = document.getElementById('id_propietario_ministerio').value;
      let Poseedor_ministerio = document.getElementById('id_poseedor_ministerio').value;
      let Conductor_ministerio = document.getElementById('id_conductor_ministerio').value;
      let Vehiculo_ministerio = document.getElementById('id_vehiculo_minsterio').value;
      /* Colocar el texto cuando el trailer no aplica */
      document.querySelector('.id_oet_trailer').innerHTML = `No aplica el trailer`;
      document.querySelector('.id_ministerio_trailer').innerHTML = `No aplica el trailer`;
      document.querySelector('.estado_ministerio_trailer').innerHTML = `No aplica el trailer`;
      document.querySelector('.estado_oet_trailer').innerHTML = `No aplica el trailer`;

      if (
        Propietario === '1' &&
        Poseedor === '1' &&
        Conductor === '1' &&
        Vehiculo === '1' &&
        Propietario_ministerio === '1' &&
        Poseedor_ministerio === '1' &&
        Conductor_ministerio === '1' &&
        Vehiculo_ministerio === '1'
      ) {
        let btn_aprobar = document.getElementById('aprobarv1');
        btn_aprobar.disabled = false;
      } else {
        document.getElementById('mensaje_error_validacion').innerHTML = `<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
          <div class="icon"><span class="mdi mdi-alert-triangle"></span></div><div class="message">
            <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button>
            <strong>Advertencia!</strong> No se puede aprobar la hoja de vida, alguno de los recursos fallo al momento de ser retransmitido.
          </div>
        </div>`;
      }
    } else {
      crear_trailer_Ministerio(trailer);
    }
    document.getElementById('col_oet_vehiculo').style.display = 'none';
    loadOetImages.forEach(image => {
      image.style.display = 'none'; // o 'block' dependiendo de tu preferencia
    });
  }
}

async function crear_trailer_Ministerio(placa) {
  document.querySelector('.id_ministerio_trailer').setAttribute('id', `td_trailer_ministerio${placa}`);
  document.querySelector('.tr_trailer').setAttribute('id', `tr_${placa}`);
  const loadRndcImages = document.querySelectorAll('.load_rndc');
  // const ColloadRndcImages = document.querySelectorAll('.col_rndc');

  loadRndcImages.forEach(image => {
    image.style.display = 'inline-block'; // o 'block' dependiendo de tu preferencia
  });
  document.getElementById('col_rndc_trailer').style.display = 'block';
  //
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
    // var tablas_locales = 'Se Registro Datos Exitosamente RNDC';
    if (data.status == 'true') {
      // var contenidoHTML1 =
      //   '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
      //   tablas_locales +
      //   ' - ' +
      //   data.resultado +
      //   '</div></div>';
      // // sessionStorage.setItem('mensaje_oet', contenidoHTML1);
    } else if (data.status == 'false') {
      // Selecciona el contenedor específico para el documento
      const elementoVehiculo = document.querySelector(`#td_trailer_ministerio${placa}`);
      // Encuentra el contenedor del span (asegúrate de que elementoVehiculo sea el span o su contenedor)
      var spanElement = elementoVehiculo;

      // Encuentra la fila que contiene el spanElement
      var fila = spanElement.closest('tr');
      // Verifica si se encontró la fila
      if (fila) {
        // Crea el nuevo elemento <td>
        var nuevaCelda = document.createElement('td');
        nuevaCelda.style.color = '#DC4C64';
        nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente

        // Crea el botón
        var butto_vehiculo = document.createElement('a');
        butto_vehiculo.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
        butto_vehiculo.className = 'icon btn_retransmitir_endpoint';

        // Asigna el evento onclick directamente
        butto_vehiculo.onclick = async function () {
          try {
            // Espera la respuesta de la función asincrónica
            var respuesta_oet_retransmision = await Retransmite_Trailer_Ministerio(placa);

            // Itera sobre la respuesta
            respuesta_oet_retransmision.forEach(element => {
              if (element.codigoError === null) {
                document.getElementById('id_trailer_ministerio').value = 1;
                document.querySelector('.id_ministerio_trailer').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                // document.querySelector('.estado_oet_vehiculo').innerHTML = element.mensaje;
                // document.querySelector('.estado_oet_vehiculo').style.color = '#14A44D';
                // Aquí puedes realizar una acción específica si ambos están presentes
                if (fila) {
                  // Crea el nuevo elemento <td>
                  var nuevaCelda = document.createElement('td');
                  nuevaCelda.style.color = '#14A44D';
                  nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
                  // Añade el botón a la nueva celda
                  nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
                  //<i class="far fa-times-circle"></i>
                  var columnas = fila.querySelectorAll('td');
                  if (columnas.length > 4) {
                    // Añade la nueva celda antes de la última columna
                    fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
                  }
                } else {
                  console.log('Error no se creo la fila');
                }
              } else if (element.codigoError === 'VEH') {
                document.getElementById('id_trailer_ministerio').value = 0;
                document.querySelector('.id_ministerio_trailer').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                // document.querySelector('.estado_oet_vehiculo').innerHTML = element.mensaje;
                // document.querySelector('.estado_oet_vehiculo').style.color = '#DC4C64';
              } else {
                console.log('Codigo de error: ' + element.codigoError);
              }
            });
          } catch (error) {
            // Maneja el error
            console.error('Error al retransmitir datos OET:', error);
            alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
          }
        };

        // Estilos del botón
        butto_vehiculo.style.textDecoration = 'none';
        butto_vehiculo.style.color = '#E4A11B';
        butto_vehiculo.style.paddingLeft = '10px';
        butto_vehiculo.setAttribute('data-toggle', 'tooltip');
        butto_vehiculo.setAttribute('title', `Retransmitir Vehículo`);
        butto_vehiculo.setAttribute('data-placement', 'bottom');

        // Crea el elemento <span> dentro del <a> para el icono
        var iconSpan = document.createElement('span');
        iconSpan.className = 'mdi mdi-mail-send';

        // Añade el <span> al <a>
        butto_vehiculo.appendChild(iconSpan);

        // Añade el botón a la nueva celda
        nuevaCelda.appendChild(butto_vehiculo);

        // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
        var columnas = fila.querySelectorAll('td');
        if (columnas.length > 4) {
          // Añade la nueva celda antes de la última columna
          fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
        }
      } else {
        console.error('El elemento span no se encontró.');
      }
    }
    // document.getElementById('mensaje_rndc').innerHTML += contenidoHTML1;
  } catch (error) {
    //   errorHandled = true; // Marcar que el error ha sido manejado
    if (error.message.includes('SOAP-ERROR: Parsing WSDL')) {
      // Mostrar un mensaje específico o realizar una acción
      alert('Error al cargar el servicio SOAP del RNDC. Por favor, verifica la conexión o la URL del RNDC.');
      // Selecciona el contenedor específico para el documento
      const elementoVehiculo = document.querySelector(`#td_trailer_ministerio${placa}`);
      // Encuentra el contenedor del span (asegúrate de que elementoVehiculo sea el span o su contenedor)
      var spanElement = elementoVehiculo;

      // Encuentra la fila que contiene el spanElement
      var fila = spanElement.closest('tr');
      // Verifica si se encontró la fila
      if (fila) {
        // Crea el nuevo elemento <td>
        var nuevaCelda = document.createElement('td');
        nuevaCelda.style.color = '#DC4C64';
        nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente

        // Crea el botón
        var butto_vehiculo = document.createElement('a');
        butto_vehiculo.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
        butto_vehiculo.className = 'icon btn_retransmitir_endpoint';

        // Asigna el evento onclick directamente
        butto_vehiculo.onclick = async function () {
          try {
            // Espera la respuesta de la función asincrónica
            var respuesta_oet_retransmision = await Retransmite_Trailer_Ministerio(placa);

            // Itera sobre la respuesta
            respuesta_oet_retransmision.forEach(element => {
              if (element.codigoError === null) {
                document.getElementById('id_trailer_ministerio').value = 1;
                document.querySelector('.id_ministerio_trailer').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                // document.querySelector('.estado_oet_vehiculo').innerHTML = element.mensaje;
                // document.querySelector('.estado_oet_vehiculo').style.color = '#14A44D';
                // Aquí puedes realizar una acción específica si ambos están presentes
                if (fila) {
                  // Crea el nuevo elemento <td>
                  var nuevaCelda = document.createElement('td');
                  nuevaCelda.style.color = '#14A44D';
                  nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
                  // Añade el botón a la nueva celda
                  nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
                  //<i class="far fa-times-circle"></i>
                  var columnas = fila.querySelectorAll('td');
                  if (columnas.length > 4) {
                    // Añade la nueva celda antes de la última columna
                    fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
                  }
                } else {
                  console.log('Error no se creo la fila');
                }
              } else if (element.codigoError === 'VEH') {
                document.getElementById('id_trailer_ministerio').value = 0;
                document.querySelector('.id_ministerio_trailer').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                // document.querySelector('.estado_oet_vehiculo').innerHTML = element.mensaje;
                // document.querySelector('.estado_oet_vehiculo').style.color = '#DC4C64';
              } else {
                console.log('Codigo de error: ' + element.codigoError);
              }
            });
          } catch (error) {
            // Maneja el error
            console.error('Error al retransmitir datos OET:', error);
            alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
          }
        };

        // Estilos del botón
        butto_vehiculo.style.textDecoration = 'none';
        butto_vehiculo.style.color = '#E4A11B';
        butto_vehiculo.style.paddingLeft = '10px';
        butto_vehiculo.setAttribute('data-toggle', 'tooltip');
        butto_vehiculo.setAttribute('title', `Retransmitir Vehículo`);
        butto_vehiculo.setAttribute('data-placement', 'bottom');

        // Crea el elemento <span> dentro del <a> para el icono
        var iconSpan = document.createElement('span');
        iconSpan.className = 'mdi mdi-mail-send';

        // Añade el <span> al <a>
        butto_vehiculo.appendChild(iconSpan);

        // Añade el botón a la nueva celda
        nuevaCelda.appendChild(butto_vehiculo);

        // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
        var columnas = fila.querySelectorAll('td');
        if (columnas.length > 4) {
          // Añade la nueva celda antes de la última columna
          fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
        }
      } else {
        console.error('El elemento span no se encontró.');
      }
    } else {
      // Manejar otros errores
      // alert('Ocurrió un error inesperado. Intenta de nuevo.');
      alert('Error al cargar el servicio SOAP del RNDC. Por favor, verifica la conexión o la URL del RNDC.');
      // Selecciona el contenedor específico para el documento
      const elementoVehiculo = document.querySelector(`#td_trailer_ministerio${placa}`);
      // Encuentra el contenedor del span (asegúrate de que elementoVehiculo sea el span o su contenedor)
      var spanElement = elementoVehiculo;

      // Encuentra la fila que contiene el spanElement
      var fila = spanElement.closest('tr');
      // Verifica si se encontró la fila
      if (fila) {
        // Crea el nuevo elemento <td>
        var nuevaCelda = document.createElement('td');
        nuevaCelda.style.color = '#DC4C64';
        nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente

        // Crea el botón
        var butto_vehiculo = document.createElement('a');
        butto_vehiculo.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
        butto_vehiculo.className = 'icon btn_retransmitir_endpoint';

        // Asigna el evento onclick directamente
        butto_vehiculo.onclick = async function () {
          try {
            // Espera la respuesta de la función asincrónica
            var respuesta_oet_retransmision = await Retransmite_Trailer_Ministerio(placa);

            // Itera sobre la respuesta
            respuesta_oet_retransmision.forEach(element => {
              if (element.codigoError === null) {
                document.getElementById('id_trailer_ministerio').value = 1;
                document.querySelector('.id_ministerio_trailer').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                // document.querySelector('.estado_oet_vehiculo').innerHTML = element.mensaje;
                // document.querySelector('.estado_oet_vehiculo').style.color = '#14A44D';
                // Aquí puedes realizar una acción específica si ambos están presentes
                if (fila) {
                  // Crea el nuevo elemento <td>
                  var nuevaCelda = document.createElement('td');
                  nuevaCelda.style.color = '#14A44D';
                  nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
                  // Añade el botón a la nueva celda
                  nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
                  //<i class="far fa-times-circle"></i>
                  var columnas = fila.querySelectorAll('td');
                  if (columnas.length > 4) {
                    // Añade la nueva celda antes de la última columna
                    fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
                  }
                } else {
                  console.log('Error no se creo la fila');
                }
              } else if (element.codigoError === 'VEH') {
                document.getElementById('id_trailer_ministerio').value = 0;
                document.querySelector('.id_ministerio_trailer').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                // document.querySelector('.estado_oet_vehiculo').innerHTML = element.mensaje;
                // document.querySelector('.estado_oet_vehiculo').style.color = '#DC4C64';
              } else {
                console.log('Codigo de error: ' + element.codigoError);
              }
            });
          } catch (error) {
            // Maneja el error
            console.error('Error al retransmitir datos OET:', error);
            alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
          }
        };

        // Estilos del botón
        butto_vehiculo.style.textDecoration = 'none';
        butto_vehiculo.style.color = '#E4A11B';
        butto_vehiculo.style.paddingLeft = '10px';
        butto_vehiculo.setAttribute('data-toggle', 'tooltip');
        butto_vehiculo.setAttribute('title', `Retransmitir Trailer`);
        butto_vehiculo.setAttribute('data-placement', 'bottom');

        // Crea el elemento <span> dentro del <a> para el icono
        var iconSpan = document.createElement('span');
        iconSpan.className = 'mdi mdi-mail-send';

        // Añade el <span> al <a>
        butto_vehiculo.appendChild(iconSpan);

        // Añade el botón a la nueva celda
        nuevaCelda.appendChild(butto_vehiculo);

        // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
        var columnas = fila.querySelectorAll('td');
        if (columnas.length > 4) {
          // Añade la nueva celda antes de la última columna
          fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
        }
      } else {
        console.error('El elemento span no se encontró.');
      }
    }
  } finally {
    document.getElementById('col_rndc_trailer').style.display = 'none';
    loadRndcImages.forEach(image => {
      image.style.display = 'none'; // o 'block' dependiendo de tu preferencia
    });
    crear_trailer_Oet(placa);
  }
}

async function crear_trailer_Oet(placa) {
  document.querySelector('.id_oet_trailer').setAttribute('id', `td_trailer_${placa}`);
  document.querySelector('.tr_trailer').setAttribute('id', `tr_${placa}`);
  clase = 3;
  recurso = 8;
  let datos_oet = new FormData();
  datos_oet.append('clase_recurso', clase);
  datos_oet.append('recurso', recurso);
  datos_oet.append('dato_recurso', placa);
  //Consulta_Recurso_Avansat
  try {
    const response = await fetch($('#id_url_ajax').val() + 'integrar_oet/Consulta_Recurso_Avansat', {
      method: 'POST',
      body: datos_oet,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data.status == true || data.status == 'true') {
      if (data.codigo === '1000') {
        document.getElementById('id_trailer_oet').value = 1;
        document.querySelector('.id_oet_trailer').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
        document.querySelector('.estado_oet_trailer').innerHTML = data.error;
        document.querySelector('.estado_oet_trailer').style.color = '#14A44D';
        // Aquí puedes realizar una acción específica si ambos están presentes
        if (fila) {
          // Crea el nuevo elemento <td>
          var nuevaCelda = document.createElement('td');
          nuevaCelda.style.color = '#14A44D';
          nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
          // Añade el botón a la nueva celda
          nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
          //<i class="far fa-times-circle"></i>
          var columnas = fila.querySelectorAll('td');
          if (columnas.length > 4) {
            // Añade la nueva celda antes de la última columna
            fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
          }
        } else {
          console.log('Error no se creo la fila');
        }
      } else {
        document.getElementById('id_trailer_oet').value = 0;
        document.querySelector('.id_oet_trailer').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
        document.querySelector('.estado_oet_trailer').innerHTML = data.error;
        document.querySelector('.estado_oet_trailer').style.color = '#DC4C64';

        // Selecciona el contenedor específico para el documento
        const elementoTrailer = document.querySelector(`#td_trailer_${placa}`);
        // Encuentra el contenedor del span (asegúrate de que elementoTrailer sea el span o su contenedor)
        var spanElement = elementoTrailer;

        // Encuentra la fila que contiene el spanElement
        var fila = spanElement.closest('tr');
        // Verifica si se encontró la fila
        if (fila) {
          // Crea el nuevo elemento <td>
          var nuevaCelda = document.createElement('td');
          nuevaCelda.style.color = '#DC4C64';
          nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente

          // Crea el botón
          var butto_conductor = document.createElement('a');
          butto_conductor.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
          butto_conductor.className = 'icon btn_retransmitir_endpoint';

          // Asigna el evento onclick directamente
          butto_conductor.onclick = async function () {
            try {
              // Espera la respuesta de la función asincrónica
              var respuesta_oet_retransmision = await Retransmitir_Trailer_Oet(placa);

              // Itera sobre la respuesta
              respuesta_oet_retransmision.forEach(element => {
                if (element.codigoError === '1000' && element.codigoError === '1999') {
                  document.getElementById('id_trailer_oet').value = 1;
                  document.querySelector('.id_oet_trailer').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                  document.querySelector('.estado_oet_trailer').innerHTML = element.mensaje;
                  document.querySelector('.estado_oet_trailer').style.color = '#14A44D';
                  // Aquí puedes realizar una acción específica si ambos están presentes
                  if (fila) {
                    // Crea el nuevo elemento <td>
                    var nuevaCelda = document.createElement('td');
                    nuevaCelda.style.color = '#14A44D';
                    nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
                    // Añade el botón a la nueva celda
                    nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
                    //<i class="far fa-times-circle"></i>
                    var columnas = fila.querySelectorAll('td');
                    if (columnas.length > 4) {
                      // Añade la nueva celda antes de la última columna
                      fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
                    }
                  } else {
                    console.log('Error no se creo la fila');
                  }
                } else if (element.codigoError === '1999') {
                  document.getElementById('id_trailer_oet').value = 0;
                  document.querySelector('.id_oet_trailer').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                  document.querySelector('.estado_oet_trailer').innerHTML = element.mensaje;
                  document.querySelector('.estado_oet_trailer').style.color = '#DC4C64';
                } else if (element.codigoError === '1000') {
                  document.getElementById('id_trailer_oet').value = 1;
                  document.querySelector('.id_oet_trailer').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                  document.querySelector('.estado_oet_trailer').innerHTML = element.mensaje;
                  document.querySelector('.estado_oet_trailer').style.color = '#14A44D';
                  // Aquí puedes realizar una acción específica si ambos están presentes
                  if (fila) {
                    // Crea el nuevo elemento <td>
                    var nuevaCelda = document.createElement('td');
                    nuevaCelda.style.color = '#14A44D';
                    nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
                    // Añade el botón a la nueva celda
                    nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
                    //<i class="far fa-times-circle"></i>
                    var columnas = fila.querySelectorAll('td');
                    if (columnas.length > 4) {
                      // Añade la nueva celda antes de la última columna
                      fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
                    }
                  } else {
                    console.log('Error no se creo la fila');
                  }
                } else if (element.codigoError === '6001') {
                  document.getElementById('id_trailer_oet').value = 0;
                  document.querySelector('.id_oet_trailer').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                  document.querySelector('.estado_oet_trailer').innerHTML = element.mensaje;
                  document.querySelector('.estado_oet_trailer').style.color = '#DC4C64';
                } else {
                  console.log('Codigo de error: ' + element.codigoError);
                }
              });
            } catch (error) {
              // Maneja el error
              console.error('Error al retransmitir datos OET:', error);
              alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
            }
          };

          // Estilos del botón
          butto_conductor.style.textDecoration = 'none';
          butto_conductor.style.color = '#14A44D';
          butto_conductor.style.paddingLeft = '10px';
          butto_conductor.setAttribute('data-toggle', 'tooltip');
          butto_conductor.setAttribute('title', `Retransmitir Trailer`);
          butto_conductor.setAttribute('data-placement', 'bottom');

          // Crea el elemento <span> dentro del <a> para el icono
          var iconSpan = document.createElement('span');
          iconSpan.className = 'mdi mdi-mail-send';

          // Añade el <span> al <a>
          butto_conductor.appendChild(iconSpan);

          // Añade el botón a la nueva celda
          nuevaCelda.appendChild(butto_conductor);

          // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
          var columnas = fila.querySelectorAll('td');
          if (columnas.length > 4) {
            // Añade la nueva celda antes de la última columna
            fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
          }
        } else {
          console.error('El elemento span no se encontró.');
        }
      }
    } else if (data.status == false || data.status == 'false') {
      document.getElementById('id_trailer_oet').value = 0;
      document.querySelector('.id_oet_trailer').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
      document.querySelector('.estado_oet_trailer').innerHTML = data.error;
      document.querySelector('.estado_oet_trailer').style.color = '#DC4C64';

      // Selecciona el contenedor específico para el documento
      const elementoTrailer = document.querySelector(`#td_trailer_${placa}`);
      // Encuentra el contenedor del span (asegúrate de que elementoTrailer sea el span o su contenedor)
      var spanElement = elementoTrailer;

      // Encuentra la fila que contiene el spanElement
      var fila = spanElement.closest('tr');
      // Verifica si se encontró la fila
      if (fila) {
        // Crea el nuevo elemento <td>
        var nuevaCelda = document.createElement('td');
        nuevaCelda.style.color = '#DC4C64';
        nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente

        // Crea el botón
        var butto_conductor = document.createElement('a');
        butto_conductor.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
        butto_conductor.className = 'icon btn_retransmitir_endpoint';

        // Asigna el evento onclick directamente
        butto_conductor.onclick = async function () {
          try {
            // Espera la respuesta de la función asincrónica
            var respuesta_oet_retransmision = await Retransmitir_Trailer_Oet(placa);

            // Itera sobre la respuesta
            respuesta_oet_retransmision.forEach(element => {
              if (element.codigoError === '1000' && element.codigoError === '1999') {
                document.getElementById('id_trailer_oet').value = 1;
                document.querySelector('.id_oet_trailer').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                document.querySelector('.estado_oet_trailer').innerHTML = element.mensaje;
                document.querySelector('.estado_oet_trailer').style.color = '#14A44D';
                // Aquí puedes realizar una acción específica si ambos están presentes
                if (fila) {
                  // Crea el nuevo elemento <td>
                  var nuevaCelda = document.createElement('td');
                  nuevaCelda.style.color = '#14A44D';
                  nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
                  // Añade el botón a la nueva celda
                  nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
                  //<i class="far fa-times-circle"></i>
                  var columnas = fila.querySelectorAll('td');
                  if (columnas.length > 4) {
                    // Añade la nueva celda antes de la última columna
                    fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
                  }
                } else {
                  console.log('Error no se creo la fila');
                }
              } else if (element.codigoError === '1999') {
                document.getElementById('id_trailer_oet').value = 0;
                document.querySelector('.id_oet_trailer').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                document.querySelector('.estado_oet_trailer').innerHTML = element.mensaje;
                document.querySelector('.estado_oet_trailer').style.color = '#DC4C64';
              } else if (element.codigoError === '1000') {
                document.getElementById('id_trailer_oet').value = 1;
                document.querySelector('.id_oet_trailer').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
                document.querySelector('.estado_oet_trailer').innerHTML = element.mensaje;
                document.querySelector('.estado_oet_trailer').style.color = '#14A44D';
                // Aquí puedes realizar una acción específica si ambos están presentes
                if (fila) {
                  // Crea el nuevo elemento <td>
                  var nuevaCelda = document.createElement('td');
                  nuevaCelda.style.color = '#14A44D';
                  nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
                  // Añade el botón a la nueva celda
                  nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
                  //<i class="far fa-times-circle"></i>
                  var columnas = fila.querySelectorAll('td');
                  if (columnas.length > 4) {
                    // Añade la nueva celda antes de la última columna
                    fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
                  }
                } else {
                  console.log('Error no se creo la fila');
                }
              } else if (element.codigoError === '6001') {
                document.getElementById('id_trailer_oet').value = 0;
                document.querySelector('.id_oet_trailer').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
                document.querySelector('.estado_oet_trailer').innerHTML = element.mensaje;
                document.querySelector('.estado_oet_trailer').style.color = '#DC4C64';
              } else {
                console.log('Codigo de error: ' + element.codigoError);
              }
            });
          } catch (error) {
            // Maneja el error
            console.error('Error al retransmitir datos OET:', error);
            alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
          }
        };

        // Estilos del botón
        butto_conductor.style.textDecoration = 'none';
        butto_conductor.style.color = '#14A44D';
        butto_conductor.style.paddingLeft = '10px';
        butto_conductor.setAttribute('data-toggle', 'tooltip');
        butto_conductor.setAttribute('title', `Retransmitir Trailer`);
        butto_conductor.setAttribute('data-placement', 'bottom');

        // Crea el elemento <span> dentro del <a> para el icono
        var iconSpan = document.createElement('span');
        iconSpan.className = 'mdi mdi-mail-send';

        // Añade el <span> al <a>
        butto_conductor.appendChild(iconSpan);

        // Añade el botón a la nueva celda
        nuevaCelda.appendChild(butto_conductor);

        // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
        var columnas = fila.querySelectorAll('td');
        if (columnas.length > 4) {
          // Añade la nueva celda antes de la última columna
          fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
        }
      } else {
        console.error('El elemento span no se encontró.');
      }
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    let Propietario = document.getElementById('id_propietario_oet').value;
    let Poseedor = document.getElementById('id_poseedor_oet').value;
    let Conductor = document.getElementById('id_conductor_oet').value;
    let Vehiculo = document.getElementById('id_vehiculo_oet').value;
    let Trailer = document.getElementById('id_trailer_oet').value;

    /* Datos validados en el ministerio */
    let Propietario_ministerio = document.getElementById('id_propietario_ministerio').value;
    let Poseedor_ministerio = document.getElementById('id_poseedor_ministerio').value;
    let Conductor_ministerio = document.getElementById('id_conductor_ministerio').value;
    let Vehiculo_ministerio = document.getElementById('id_vehiculo_minsterio').value;
    let Trailer_ministerio = document.getElementById('id_trailer_ministerio').value;

    if (
      Propietario === '1' &&
      Poseedor === '1' &&
      Conductor === '1' &&
      Vehiculo === '1' &&
      Trailer === '1' &&
      Propietario_ministerio === '1' &&
      Poseedor_ministerio === '1' &&
      Conductor_ministerio === '1' &&
      Vehiculo_ministerio === '1' &&
      Trailer_ministerio === '1'
    ) {
      let btn_aprobar = document.getElementById('aprobarv1');
      btn_aprobar.disabled = false;
    } else {
      document.getElementById('mensaje_error_validacion').innerHTML = `<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
        <div class="icon"><span class="mdi mdi-alert-triangle"></span></div><div class="message">
          <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button>
          <strong>Advertencia!</strong> No se puede aprobar la hoja de vida, alguno de los recursos fallo al momento de ser retransmitido.
        </div>
      </div>`;
    }
  }
}

async function ejecutar_retransmision(fila, documento, tipo_documento, actividad) {
  if (actividad === 'Conductor' || actividad === 'Propietario' || actividad === 'Poseedor' || actividad === 'Propietario Trailer') {
    if (fila) {
      // Crea el nuevo elemento <td>
      var nuevaCelda = document.createElement('td');
      nuevaCelda.style.color = '#DC4C64';
      nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente

      // Crea el botón
      var butto_conductor = document.createElement('a');
      butto_conductor.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
      butto_conductor.className = 'icon btn_retransmitir_endpoint';

      // Asigna el evento onclick directamente
      butto_conductor.onclick = async function () {
        try {
          // Espera la respuesta de la función asincrónica
          var respuesta_oet_retransmision = await Retransmitir_Dato_Ministerio(documento, tipo_documento, actividad);
          // Itera sobre la respuesta
          respuesta_oet_retransmision.forEach(element => {
            if (element.codigoError === 'TER015' && element.mensaje.includes('DUPLICADO') && element.codigoError !== 'TER220') {
              document.getElementById('id_conductor_ministerio').value = 1;
              document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
              document.querySelector('.estado_ministerio_conductor').innerHTML = mensaje;
              document.querySelector('.estado_ministerio_conductor').style.color = '#14A44D';
              if (fila) {
                // Crea el nuevo elemento <td>
                var nuevaCelda = document.createElement('td');
                nuevaCelda.style.color = '#14A44D';
                nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
                // Añade el botón a la nueva celda
                nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
                var columnas = fila.querySelectorAll('td');
                if (columnas.length > 4) {
                  // Añade la nueva celda antes de la última columna
                  fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
                }
              } else {
                console.log('Error no se creo la fila');
              }
              butto_conductor.style.display = 'none';
            } else if (element.codigoError === 'TER220') {
              document.getElementById('id_conductor_ministerio').value = 0;
              document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
              document.querySelector('.estado_ministerio_conductor').innerHTML = mensaje;
              document.querySelector('.estado_ministerio_conductor').style.color = '#DC4C64';
              butto_conductor.style.display = 'block';
            } else if (element.codigoError === null) {
              document.getElementById('id_conductor_ministerio').value = 1;
              document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
              document.querySelector('.estado_ministerio_conductor').innerHTML = mensaje;
              document.querySelector('.estado_ministerio_conductor').style.color = '#14A44D';
              if (fila) {
                // Crea el nuevo elemento <td>
                var nuevaCelda = document.createElement('td');
                nuevaCelda.style.color = '#14A44D';
                nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
                // Añade el botón a la nueva celda
                nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
                //<i class="far fa-times-circle"></i>
                var columnas = fila.querySelectorAll('td');
                if (columnas.length > 4) {
                  // Añade la nueva celda antes de la última columna
                  fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
                }
              } else {
                console.log('Error no se creo la fila');
              }
              butto_conductor.style.display = 'none';
            } else if (element.mensaje.includes('DUPLICADO')) {
              document.getElementById('id_conductor_ministerio').value = 1;
              document.querySelector('.id_ministerio_conductor').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
              document.querySelector('.estado_ministerio_conductor').innerHTML = mensaje;
              document.querySelector('.estado_ministerio_conductor').style.color = '#14A44D';
              if (fila) {
                // Crea el nuevo elemento <td>
                var nuevaCelda = document.createElement('td');
                nuevaCelda.style.color = '#14A44D';
                nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente
                // Añade el botón a la nueva celda
                nuevaCelda.innerHTML = `<i class="far fa-check-circle"></i>`;
                var columnas = fila.querySelectorAll('td');
                if (columnas.length > 4) {
                  // Añade la nueva celda antes de la última columna
                  fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
                }
              } else {
                console.log('Error no se creo la fila');
              }
            } else {
              // console.log('Codigo de error: ' + element.codigoError);
              butto_conductor.style.display = 'block';
            }
          });
        } catch (error) {
          // Maneja el error
          console.error('Error al retransmitir datos OET:', error);
          alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
        }
      };

      // Estilos del botón
      butto_conductor.style.textDecoration = 'none';
      butto_conductor.style.color = '#E4A11B';
      butto_conductor.style.paddingLeft = '10px';
      butto_conductor.setAttribute('data-toggle', 'tooltip');
      butto_conductor.setAttribute('title', `Retransmitir ${actividad}`);
      butto_conductor.setAttribute('data-placement', 'bottom');

      // Crea el elemento <span> dentro del <a> para el icono
      var iconSpan = document.createElement('span');
      iconSpan.className = 'mdi mdi-mail-send';

      // Añade el <span> al <a>
      butto_conductor.appendChild(iconSpan);

      // Añade el botón a la nueva celda
      nuevaCelda.appendChild(butto_conductor);

      // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
      var columnas = fila.querySelectorAll('td');
      if (columnas.length > 4) {
        // Añade la nueva celda antes de la última columna
        fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
      }
    } else {
      console.error('El elemento span no se encontró.');
    }
  } else if (actividad === 'Vehiculo') {
    // Verifica si se encontró la fila
    if (fila) {
      // Crea el nuevo elemento <td>
      var nuevaCelda = document.createElement('td');
      nuevaCelda.style.color = '#DC4C64';
      nuevaCelda.className = 'text-center'; // Asegúrate de que se alineen correctamente

      // Crea el botón
      var butto_vehiculo = document.createElement('a');
      butto_vehiculo.href = '#'; // Enlace, puedes cambiarlo si necesitas un destino real
      butto_vehiculo.className = 'icon btn_retransmitir_endpoint';

      // Asigna el evento onclick directamente
      butto_vehiculo.onclick = async function () {
        try {
          // Espera la respuesta de la función asincrónica
          var respuesta_oet_retransmision = await Retransmitir_Vehiculo_Ministerio(placa);

          // Itera sobre la respuesta
          respuesta_oet_retransmision.forEach(element => {
            if (element.codigoError === 'VEH015' && element.codigoError !== 'VEH015') {
              document.getElementById('id_vehiculo_minsterio').value = 1;
              document.querySelector('.id_ministerio_vehiculo').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
              document.querySelector('.estado_ministerio_vehiculo').innerHTML = element.mensaje;
              document.querySelector('.estado_ministerio_vehiculo').style.color = '#14A44D';
            } else if (element.codigoError !== 'VEH015') {
              document.getElementById('id_vehiculo_minsterio').value = 0;
              document.querySelector('.id_ministerio_vehiculo').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
              document.querySelector('.estado_ministerio_vehiculo').innerHTML = element.mensaje;
              document.querySelector('.estado_ministerio_vehiculo').style.color = '#DC4C64';
            } else if (element.codigoError === null) {
              document.getElementById('id_vehiculo_minsterio').value = 1;
              document.querySelector('.id_ministerio_vehiculo').innerHTML = `<span class="text-success mdi mdi-dot-circle icon"></span>`;
              document.querySelector('.estado_ministerio_vehiculo').innerHTML = element.mensaje;
              document.querySelector('.estado_ministerio_vehiculo').style.color = '#14A44D';
            } else if (element.codigoError !== 'VEH015' && element.codigoError !== null) {
              document.getElementById('id_vehiculo_minsterio').value = 0;
              document.querySelector('.id_ministerio_vehiculo').innerHTML = `<span class="text-danger mdi mdi-dot-circle icon"></span>`;
              document.querySelector('.estado_ministerio_vehiculo').innerHTML = element.mensaje;
              document.querySelector('.estado_ministerio_vehiculo').style.color = '#DC4C64';
            } else {
              console.log('Codigo de error: ' + element.codigoError);
            }
          });
        } catch (error) {
          // Maneja el error
          console.error('Error al retransmitir datos OET:', error);
          alert('Ocurrió un error al retransmitir los datos. Por favor, intenta nuevamente.');
        }
      };

      // Estilos del botón
      butto_vehiculo.style.textDecoration = 'none';
      butto_vehiculo.style.color = '#E4A11B';
      butto_vehiculo.style.paddingLeft = '10px';
      butto_vehiculo.setAttribute('data-toggle', 'tooltip');
      butto_vehiculo.setAttribute('title', `Retransmitir Vehículo`);
      butto_vehiculo.setAttribute('data-placement', 'bottom');

      // Crea el elemento <span> dentro del <a> para el icono
      var iconSpan = document.createElement('span');
      iconSpan.className = 'mdi mdi-mail-send';

      // Añade el <span> al <a>
      butto_vehiculo.appendChild(iconSpan);

      // Añade el botón a la nueva celda
      nuevaCelda.appendChild(butto_vehiculo);

      // Encuentra la columna "Mensaje Oet" (asumiendo que es la penúltima columna)
      var columnas = fila.querySelectorAll('td');
      if (columnas.length > 4) {
        // Añade la nueva celda antes de la última columna
        fila.insertBefore(nuevaCelda, columnas[columnas.length + 1]);
      }
    } else {
      console.error('El elemento span no se encontró.');
    }
  }
}

// //aprobar la hoja de vida del vehiculo
// function aprobar_vehiculo() {
//   if (window.confirm('¿Estás seguro de que desea aprobar el vehículo?')) {
//     // Código a ejecutar si el usuario hace clic en "Aceptar"
//     var idsoli = $('#id_soli').val();
//     //validar que  la hoja del vehiculo este o no aprobada
//     var idv = $('#valor_vehiculo').val();
//     var idc = $('#conductor_id').val();
//     var data = null;

//     data = new FormData();
//     data.append('fecha', $('#fechag').val());
//     data.append('hora', $('#horag').val());
//     data.append('user', $('#usuariog').val());
//     data.append('observeheciulo', $('#observeheciulo').val());
//     data.append('id_vehiculo', idv);
//     data.append('id_conductor', idc);
//     data.append('idsoli', idsoli);
//     data.append('idtipo', $('#id_tvehiculo').val());

//     $.ajax({
//       url: $('#id_url_ajax').val() + 'validacionparametros/Aprobar_vehiculo_estudio',
//       type: 'POST',
//       data: data,
//       cache: false,
//       processData: false, // Don't process the files
//       contentType: false, // Set content type to false as jQuery will tell the server its a query string request
//       dataType: 'json',

//       success: function (data, textStatus, jqXHR) {
//         if (data.numero === 200) {
//           mensaje = `

//           <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role = "alert">

//               <div class="icon"><span class="mdi mdi-check"></span></div>

//               <div class="message">

//                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>

//                 <strong>Mensaje!</strong> ${data.mensaje}

//               </div>

//           </div>`;

//           lista_hojas_de_vida(idv, idc, idsoli);
//         } else {
//           mensaje = `

//           <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role = "alert">

//               <div class="icon"><span class="mdi mdi-info-outline"></span></div>

//               <div class="message">

//                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>

//                 <strong>Mensaje!</strong> ${data.mensaje}

//               </div>

//           </div>`;

//           lista_hojas_de_vida(idv, idc, idsoli);
//         }

//         d.getElementById('historico_estudios').innerHTML = mensaje;

//         $('#content_risk').hide();

//         $('#content_conductor').hide();

//         $('#content_vehiculo').hide();
//       },

//       error: function (jqXHR, textStatus, errorThrown) {
//         console.log('no inserto hv vehiculo');

//         console.log(jqXHR);

//         console.log(textStatus);

//         console.log(errorThrown);
//       },
//     });
//   } else {
//     // Código a ejecutar si el usuario hace clic en "Cancelar"

//     console.log('Acción confirmada.');
//   }
// }

// function desaprobar_vehiculo() {
//   if (window.confirm('¿Estás seguro de que desea rechazar el vehículo?')) {
//     // Código a ejecutar si el usuario hace clic en "Aceptar"

//     var idsoli = $('#id_soli').val();

//     var idv = $('#valor_vehiculo').val();

//     var idc = $('#conductor_id').val();

//     var estado = $('#estadostudy').val();

//     var data = null;

//     data = new FormData();

//     // data.append("accion", 'desaprobarHVvehiculo');

//     data.append('fecha', $('#fechag').val());

//     data.append('hora', $('#horag').val());

//     data.append('user', $('#usuariog').val());

//     data.append('observeheciulo', $('#observeheciulo').val());

//     data.append('id_vehiculo', idv);

//     data.append('id_conductor', idc);

//     data.append('idsoli', idsoli);

//     data.append('idtipo', $('#id_tvehiculo').val());

//     $.ajax({
//       url: $('#id_url_ajax').val() + 'validacionparametros/Desaprobar_vehiculo_estudio',

//       type: 'POST',

//       data: data,

//       cache: false,

//       processData: false, // Don't process the files

//       contentType: false, // Set content type to false as jQuery will tell the server its a query string request

//       dataType: 'json',

//       success: function (data) {
//         if (data.numero === 200) {
//           mensaje = `

//           <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role = "alert">

//               <div class="icon"><span class="mdi mdi-check"></span></div>

//               <div class="message">

//                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>

//                 <strong>Mensaje!</strong> ${data.mensaje}</div></div>`;

//           lista_hojas_de_vida(idv, idc, idsoli);
//         } else {
//           mensaje = `

//           <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role = "alert">

//               <div class="icon"><span class="mdi mdi-info-outline"></span></div>

//               <div class="message">

//                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>

//                 <strong>Mensaje!</strong> ${data.mensaje}</div></div>`;

//           lista_hojas_de_vida(idv, idc, idsoli);
//         }

//         d.getElementById('historico_estudios').innerHTML = mensaje;

//         $('#content_risk').hide();

//         $('#content_conductor').hide();

//         $('#content_vehiculo').hide();

//         // lista(idv, idc, idsoli, id_preestudio);
//       },

//       error: function (jqXHR, textStatus, errorThrown) {
//         console.log('no inserto hv vehiculo no aprobada');

//         console.log(jqXHR);

//         console.log(textStatus);

//         console.log(errorThrown);
//       },
//     });
//   } else {
//     // Código a ejecutar si el usuario hace clic en "Cancelar"

//     console.log('Acción confirmada.');
//   }
// }

// Datos vehiculos
// function verConductor() {
//   var num_doc = $('#valor_conductor').val();

//   var idc = $('#conductor_id').val();
//   /* Boton para editar el conductor */
//   var btn = document.getElementById('btn_editar_conductor');
//   btn.setAttribute('data-idconductor', idc);

//   var params2 = {
//     id_conductor: idc,
//     num_documento: num_doc,
//   };

//   $('#fotos_conductor').html('');

//   $('#foto_indumentaria').html('');

//   $('#documentos_licencia').html('');

//   $('#documentos_rut').html('');

//   $('#documentos_eps').html('');

//   $('#documentos_peligro').html('');

//   $('#documentos_acuerdo').html('');
//   $('#fotos_cedulas').html('');

//   $.ajax({
//     // url: "http://localhost/mvcLuisMiguel/libs/seguridad_estudio2_ajax.php",

//     url: $('#id_url_ajax').val() + 'validacionparametros/ver_conductor',

//     type: 'POST',

//     data: params2,

//     dataType: 'json',

//     success: function (data) {
//       // console.log('si hayyyy conductor');

//       // console.log(data);

//       if (data.proveedores) {
//         $('#name').val(data.proveedores.nombre + ' ' + data.proveedores.apellido1 + ' ' + data.proveedores.apellido2);

//         $('#tdocumento').val(data.proveedores.tipo_documento);

//         $('#documento').val(data.proveedores.numero_documento);

//         $('#numero').val(data.proveedores.celular);

//         $('#numero2').val(data.proveedores.celular2);

//         $('#contacto').val(data.proveedores.contacto);

//         $('#dire').val(data.proveedores.direccion);

//         $('#muni').val(data.proveedores.cipio);

//         // $("#email").val(data.proveedores.email);

//         $('#num_li').val(data.proveedores.rndc_numero_licencia);

//         $('#cate_li').val(data.proveedores.rndc_categoria_licencia);

//         $('#fecha_vencimiento_licencia').val(data.proveedores.rndc_vencimiento_licencia);

//         // $("#eps").val(data.proveedores.nombre_eps);

//         $('#veps').val(data.proveedores.fecha_vence_eps);

//         $('#ultimoeps').val(data.proveedores.ultimo_eps);

//         $('#arl').val(data.proveedores.nombre_arl);

//         $('#varl').val(data.proveedores.fecha_vence_arl);

//         $('#ultimoarl').val(data.proveedores.ultimo_arl);

//         //
//         $('#fijocll').val(data.proveedores.contacto);
//         $('#emailcll').val(data.proveedores.email);
//         $('#plantillacll').val(data.proveedores.nombre_eps);
//         $('#fecha_vencimiento_plantilla').val(data.proveedores.fecha_vence_eps);
//         $('#curso_peligrosocll').val(data.proveedores.nombre_entidad);
//         $('#fecha_vencimiento_curso').val(data.proveedores.vence_curso);
//         $('#sexo').val(data.proveedores.sexo);
//         $('#fecha_nacimiento').val(data.proveedores.fecha_nacimiento);
//         $('#grupo_sanguineo').val(data.proveedores.grupo_sanguineo);
//         $('#estado_civil').val(data.proveedores.estado_civil);
//         $('#fecha_ingreso').val(data.proveedores.fecha_ingreso);

//         //fotos conductor

//         if (
//           data.proveedores.name_cfrontal != '' &&
//           data.proveedores.name_cfrontal != null &&
//           data.proveedores.name_cderecha != '' &&
//           data.proveedores.name_cderecha != null &&
//           data.proveedores.name_cizquierda != '' &&
//           data.proveedores.name_cizquierda != null
//         ) {
//           $('#fotos_conductor').append(
//             `<tr>

//                 <td>1</td>

//                 <td>

//                   <a href="javascript:void(0);" onclick="abrir_fotos('${data.proveedores.foto_conductor}','${data.proveedores.name_cfrontal}')" class="cell-detail hint--top-left" data-hint="">

//                       <span class="icon mdi mdi-file-text data-toggle="modal" title="Documento"></span>

//                   </a>

//                 </td>

//                 <td>${data.proveedores.name_cfrontal}</td>

//                 <td>Frontal</td>

//              </tr>    

//              <tr>

//                 <td>2</td>

//                 <td>

//                   <a href="javascript:void(0);" onclick="abrir_fotos('${data.proveedores.foto_derecha}','${data.proveedores.name_cderecha}')" class="cell-detail hint--top-left" data-hint="">

//                       <span class="icon mdi mdi-file-text data-toggle="modal" title="Documento"></span>

//                   </a>

//                 </td>

//                 <td>${data.proveedores.name_cderecha}</td>

//                 <td>Derecha</td>

//             </tr>

//              <tr>

//                 <td>3</td>

//                 <td>

//                   <a href="javascript:void(0);" onclick="abrir_fotos('${data.proveedores.foto_izquierda}','${data.proveedores.name_cizquierda}')" class="cell-detail hint--top-left" data-hint="">

//                       <span class="icon mdi mdi-file-text data-toggle="modal" title="Documento"></span>

//                   </a>

//                 </td>

//                 <td>${data.proveedores.name_cizquierda}</td>

//                 <td>Izquierda</td>

//             </tr>

//            `,
//           );
//         } else {
//           var f, d, iz;

//           if (data.proveedores.name_cfrontal == '' || data.proveedores.name_cfrontal == null) {
//             f = '<tr><td><p class="text-danger"><strong>No existe foto frontal</strong></p></td><td></td><td></td></tr>';
//           } else {
//             f =
//               '<tr><td>1</td><td>' +
//               '<a onclick="abrir_fotos(' +
//               data.proveedores.foto_conductor +
//               ' , ' +
//               data.proveedores.name_cfrontal +
//               ')" class="cell-detail hint--top-left" data-hint="">' +
//               '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
//               '</span>' +
//               '</a>' +
//               '</td><td>' +
//               data.proveedores.name_cfrontal +
//               '</td><td>Frontal</td></tr>';
//           }

//           if (data.proveedores.name_cderecha == '' || data.proveedores.name_cderecha == null) {
//             d = '<tr><td><p class="text-danger"><strong>No existe foto derecha</strong></p></td><td></td><td></td></tr>';
//           } else {
//             d =
//               '<tr><td>2</td><td>' +
//               '<a onclick="abrir_fotos(' +
//               data.proveedores.foto_derecha +
//               ' , ' +
//               data.proveedores.name_cderecha +
//               ')" class="cell-detail hint--top-left" data-hint="">' +
//               '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
//               '</span>' +
//               '</a>' +
//               '</td><td>' +
//               data.proveedores.name_cderecha +
//               '</td><td>Derecha</td></tr>';
//           }

//           if (data.proveedores.name_cizquierda == '' || data.proveedores.name_cizquierda == null) {
//             iz = '<tr><td><p class="text-danger"><strong>No existe foto izquierda</strong></p></td><td></td><td></td></tr>';
//           } else {
//             iz =
//               '<tr><td>3</td><td>' +
//               '<a onclick="abrir_fotos(' +
//               data.proveedores.foto_izquierda +
//               ' , ' +
//               data.proveedores.name_cizquierda +
//               ')" class="cell-detail hint--top-left" data-hint="">' +
//               '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
//               '</span>' +
//               '</a>' +
//               '</td><td>' +
//               data.proveedores.name_cizquierda +
//               '</td><td>Izquierda</td></tr>';
//           }

//           $('#fotos_conductor').append(f + d + iz);
//         }

//         // Cedula Conductor
//         if (data.proveedores.documentos_soporte != '') {
//           $('#fotos_cedulas').append(
//             `<tr>

//                 <td>1</td>

//                 <td>

//                   <a href="javascript:void(0);" onclick="abrir_fotos('${data.proveedores.documentos_soporte}','')" class="cell-detail hint--top-left" data-hint="">

//                       <span class="icon mdi mdi-file-text data-toggle="modal" title="Documento"></span>

//                   </a>

//                 </td>

//                 <td>${data.proveedores.name_cfrontal}</td>

//             </tr>`,
//           );
//         } else {
//           $('#fotos_cedulas').html('<tr><td><p class="text-danger"><strong>No existe el archivo</strong></p></td><td></td><td></td></tr>');
//         }

//         //licencia

//         if (data.proveedores.name_cindu != '' && data.proveedores.name_cindu != null) {
//           $('#foto_indumentaria').append(
//             `<tr>

//                 <td>1</td>

//                 <td>

//                   <a href="javascript:void(0);" onclick="abrir_fotos('${data.proveedores.foto_indumentaria}','${data.proveedores.name_cindu}')" class="cell-detail hint--top-left" data-hint="">

//                       <span class="icon mdi mdi-file-text data-toggle="modal" title="Documento"></span>

//                   </a>

//                 </td>

//                 <td>${data.proveedores.name_cfrontal}</td>

//             </tr>`,
//           );
//         } else {
//           $('#foto_indumentaria').html('<tr><td><p class="text-danger"><strong>No existe el archivo</strong></p></td><td></td><td></td></tr>');
//         }

//         //licencia

//         if (data.proveedores.n_docu_licencia != '' && data.proveedores.n_docu_licencia != null) {
//           $('#documentos_licencia').append(
//             `<tr>

//             <td>1</td>

//             <td>

//               <a href="javascript:void(0);" onclick="abrir_fotos('${data.proveedores.subir_licencia}','${data.proveedores.n_docu_licencia}')" class="cell-detail hint--top-left" data-hint="">

//                   <span class="icon mdi mdi-file-text data-toggle="modal" title="Documento"></span>

//               </a>

//             </td>

//             <td>${data.proveedores.name_cfrontal}</td>
//         </tr>`,
//           );
//         } else {
//           $('#documentos_licencia').html('<tr><td><p class="text-danger"><strong>No existe el archivo</strong></p></td><td></td><td></td></tr>');
//         }
//         //Rut

//         if (data.proveedores.n_docu_rut != '' && data.proveedores.n_docu_rut != null) {
//           $('#documentos_rut').append(
//             '<tr><td>1</td>' +
//             '<td>' +
//             '<a href="javascript:void(0);" onclick="abrir_fotos(' +
//             data.proveedores.documento_rut +
//             ' / ' +
//             data.proveedores.n_docu_rut +
//             ')" class="cell-detail hint--top-left" data-hint="">' +
//             '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
//             '</span>' +
//             '</a>' +
//             '</td>' +
//             '<td>' +
//             data.proveedores.n_docu_rut +
//             '</td></tr>',
//           );
//         } else {
//           $('#documentos_rut').html('<tr><td><p class="text-danger"><strong>No existe el archivo</strong></p></td><td></td><td></td></tr>');
//         }

//         //EPS

//         if (data.proveedores.n_docu_eps != '' && data.proveedores.n_docu_eps != null) {
//           $('#documentos_eps').append(
//             `<tr>
//                 <td>1</td>
//                 <td> 
//                   <a href="javascript:void(0);" onclick="abrir_fotos('${data.proveedores.documento_eps}' , '${data.proveedores.n_docu_eps}')" class="cell-detail hint--top-left" data-hint="">
//                     <span class="icon mdi mdi-file-text data-toggle="modal" title="Documento"></span>
//                   </a>
//                 </td>
//                <td>${data.proveedores.n_docu_eps}</td>
//             </tr>
//             `,
//             // '<tr><td>1</td>' +
//             //   '<td>' +
//             //   '<a href="javascript:void(0);" onclick="abrir_fotos(' +
//             //   data.proveedores.documento_eps +
//             //   ' , ' +
//             //   data.proveedores.n_docu_eps +
//             //   ')" class="cell-detail hint--top-left" data-hint="">' +
//             //   '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
//             //   '</span>' +
//             //   '</a>' +
//             //   '</td>' +
//             //   '<td>' +
//             //   data.proveedores.n_docu_eps +
//             //   '</td></tr>',
//           );
//         } else {
//           $('#documentos_eps').html('<tr><td><p class="text-danger"><strong>No existe el archivo</strong></p></td><td></td><td></td></tr>');
//         }

//         //CURSO MERCANCIA PELIGROSA
//         if (data.proveedores.n_docu_curso != '' && data.proveedores.n_docu_curso != null) {
//           $('#documentos_peligro').append(
//             `<tr>
//                 <td>1</td>' 
//                 <td>
//                   <a  href="javascript:void(0);" onclick="abrir_fotos('${data.proveedores.carnet_curso}' , '${data.proveedores.n_docu_curso}')" class="cell-detail hint--top-left" data-hint="">
//                     <span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" ></span>
//                   </a>
//                 </td>
//                 <td>${data.proveedores.n_docu_curso}</td>
//               </tr>`,
//           );
//         } else {
//           $('#documentos_peligro').html('<tr><td><p class="text-danger"><strong>No existe el archivo</strong></p></td><td></td><td></td></tr>');
//         }

//         //ACUERDO

//         if (data.proveedores.name_acuerdo1 != '' && data.proveedores.name_acuerdo1 != null) {
//           $('#documentos_acuerdo').append(
//             `<tr>

//               <td>1</td>

//               <td>

//                 <a href="Javascript:Void(0);" onclick="abrir_fotos('${data.proveedores.foto_acuerdo1}','${data.proveedores.name_acuerdo1}')" class="cell-detail hint--top-left" data-hint="">

//                   <span class="icon mdi mdi-file-text data-toggle="modal" title="Documento"></span>

//                 </a>

//               </td>

//               <td> ${data.proveedores.name_acuerdo1}</td>

//             </tr>`,
//           );
//         } else {
//           $('#documentos_acuerdo').html('<tr><td><p class="text-danger"><strong>No existe el archivo</strong></p></td><td></td><td></td></tr>');
//         }

//         if (data.referencia_laboral) {
//           var cont = 0;

//           var d = 0;

//           $('#documentos_laborales').html('');

//           data.referencia_laboral.forEach(function (element, index) {
//             cont++;

//             $('#refl' + cont).val(element.nombre_empresa);

//             $('#fechal' + cont).val(element.fecha_ingreso);

//             $('#fechafinall' + cont).val(element.fecha_retiro);

//             $('#contactol' + cont).val(element.persona_contacto);

//             $('#cel' + cont).val(element.celular);

//             $('#cargo' + cont).val(element.cargo);

//             $('#antig' + cont).val(element.antiguedad);

//             if (element.name_documento != null) {
//               d++;

//               var docu, name;

//               if (element.name_documento != null && element.name_documento != '') {
//                 docu = `<a href="Javascript:Void(0);" onclick="abrir_fotos('${element.documento_empresarial}','${element.name_documento}')" class="cell-detail hint--top-left" data-hint="">

//                   <span class="icon mdi mdi-file-text data-toggle="modal" title="Documento"></span>

//                   </a>`;

//                 name = element.name_documento;

//                 $('#documentos_laborales').append(
//                   '<tr><td>' + d + '<input type="hidden" id="idr' + d + '" value="' + element.id + '" style="width:10px;" ></td>' + '<td>' + docu + '</td>' + '<td>' + name + '</td></tr>',
//                 );
//               }
//             }
//           });
//         }

//         if (data.referencia_personales) {
//           var cue = 0;

//           var p = 0;

//           $('#documentos_personal').html('');

//           data.referencia_personales.forEach(function (element, index) {
//             cue++;

//             var pare = element.parentezco;

//             if (pare == '1') {
//               $('#parenp' + cue).val('Amigo/a');
//             }

//             if (pare == '2') {
//               $('#parenp' + cue).val('Hermano/a');
//             }

//             if (pare == '3') {
//               $('#parenp' + cue).val('Padre');
//             }

//             if (pare == '4') {
//               $('#parenp' + cue).val('Madre');
//             }

//             if (pare == '5') {
//               $('#parenp' + cue).val('Tio/a');
//             }

//             if (pare == '6') {
//               $('#parenp' + cue).val('Sobrino/a');
//             }

//             if (pare == '7') {
//               $('#parenp' + cue).val('Hijo/a');
//             }

//             if (pare == '8') {
//               $('#parenp' + cue).val('Espaso/a');
//             }

//             $('#refp' + cue).val(element.nombre_personal);

//             $('#fechap' + cue).val(element.fecha_personal);

//             $('#telp' + cue).val(element.tel_personal);

//             //documentos personales

//             if (element.name_documento != null && element.name_documento != '') {
//               p++;

//               $('#documentos_personal').append(
//                 '<tr><td>' +
//                 p +
//                 '<input type="hidden" id="idp' +
//                 p +
//                 '" value="' +
//                 element.id +
//                 '" style="width:10px;" ></td>' +
//                 '<td>' +
//                 '<a onclick="abrir_fotos(' +
//                 element.documento_personal +
//                 ' / ' +
//                 element.name_documento +
//                 ')" class="cell-detail hint--top-left" data-hint="">' +
//                 '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
//                 '</span>' +
//                 '</a>' +
//                 '</td>' +
//                 '<td>' +
//                 element.name_documento +
//                 '</td></tr>',
//               );
//             }
//           });
//         }
//       } else {
//         console.log('no hay datos conductor');
//       }
//     },

//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log('no hayyyy conductor');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

// //aprobar la hoja de vida del coductor
// function aprobar_conductor() {
//   if (window.confirm('¿Estás seguro de que deseas aprobar al conductor?')) {
//     // Código a ejecutar si el usuario hace clic en "Aceptar"

//     var idsoli = $('#id_soli').val();
//     var idv = $('#valor_vehiculo').val();
//     var idc = $('#conductor_id').val();
//     var data = null;

//     data = new FormData();
//     data.append('fech', $('#fechag').val());
//     data.append('hor', $('#horag').val());
//     data.append('usuari', $('#usuariog').val());
//     data.append('id_vehiculo', idv);
//     data.append('id_conductor', idc);
//     data.append('obse_condu', $('#obse_condu').val());
//     data.append('idsoli', idsoli);
//     data.append('idtipo', $('#id_tconductor').val());

//     $.ajax({
//       url: $('#id_url_ajax').val() + 'validacionparametros/Aprobar_conductor_estudio',
//       type: 'POST',
//       data: data,
//       cache: false,
//       processData: false, // Don't process the files
//       contentType: false, // Set content type to false as jQuery will tell the server its a query string request
//       dataType: 'json',
//       success: function (data, textStatus, jqXHR) {
//         if (data.numero === 200) {
//           mensaje = `
//           <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role = "alert">
//               <div class="icon"><span class="mdi mdi-check"></span></div>
//               <div class="message">
//                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
//                 <strong>Mensaje!</strong> ${data.mensaje}
//               </div>
//           </div> `;
//           lista_hojas_de_vida(idv, idc, idsoli);
//         } else {
//           mensaje = `
//           <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role = "alert"
//               <div class="icon"><span class="mdi mdi-info-outline"></span></div>
//               <div class="message">
//                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
//                 <strong>Mensaje!</strong> ${data.mensaje}
//               </div>
//           </div>`;
//           lista_hojas_de_vida(idv, idc, idsoli);
//         }
//         d.getElementById('historico_estudios').innerHTML = mensaje;
//         $('#content_vehiculo').hide();

//         $('#content_conductor').hide();
//         $('#content_risk').hide();
//       },
//       error: function (jqXHR, textStatus, errorThrown) {
//         console.log('no inserto hv conductor');
//         console.log(jqXHR);
//         console.log(textStatus);
//         console.log(errorThrown);
//       },
//     });
//   } else {
//     // Código a ejecutar si el usuario hace clic en "Cancelar"

//     console.log('Acción confirmada.');
//   }
// }

// function desaprobar_conductor() {
//   if (window.confirm('¿Estás seguro de que deseas rechazar al conductor?')) {
//     // Código a ejecutar si el usuario hace clic en "Aceptar"
//     var idsoli = $('#id_soli').val();
//     var idv = $('#valor_vehiculo').val();
//     var idc = $('#conductor_id').val();
//     var data = null;

//     data = new FormData();
//     data.append('fech', $('#fechag').val());
//     data.append('hor', $('#horag').val());
//     data.append('usuari', $('#usuariog').val());
//     data.append('id_vehiculo', idv);
//     data.append('id_conductor', idc);
//     data.append('obse_condu', $('#obse_condu').val());
//     data.append('idsoli', idsoli);
//     data.append('idtipo', $('#id_tconductor').val());

//     $.ajax({
//       url: $('#id_url_ajax').val() + 'validacionparametros/Desaprobar_conductor_estudio',
//       type: 'POST',
//       data: data,
//       cache: false,
//       processData: false, // Don't process the files
//       contentType: false, // Set content type to false as jQuery will tell the server its a query string request
//       dataType: 'json',
//       success: function (data) {
//         if (data.numero === 200) {
//           mensaje = `
//           <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role = "alert">
//               <div class="icon"><span class="mdi mdi-check"></span></div>
//               <div class="message">
//                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
//                 <strong>Mensaje!</strong> ${data.mensaje}
//               </div>
//           </div>`;
//           lista_hojas_de_vida(idv, idc, idsoli);
//         } else {
//           mensaje = `
//           <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role = "alert">
//               <div class="icon"><span class="mdi mdi-info-outline"></span></div>
//               <div class="message">
//                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
//                 <strong>Mensaje!</strong> ${data.mensaje}
//               </div>
//           </div>`;
//           lista_hojas_de_vida(idv, idc, idsoli);
//         }
//         d.getElementById('historico_estudios').innerHTML = mensaje;
//         $('#content_risk').hide();
//         $('#content_conductor').hide();
//         $('#content_vehiculo').hide();
//       },
//       error: function (jqXHR, textStatus, errorThrown) {
//         console.log('no inserto hv conductor no aprobada');
//         console.log(jqXHR);
//         console.log(textStatus);
//         console.log(errorThrown);
//       },
//     });
//   } else {
//     // Código a ejecutar si el usuario hace clic en "Cancelar"
//     console.log('Acción confirmada.');
//   }
// }

// // aprobar riskc
// function aprobar_risk() {
//   var idsoli = $('#id_soli').val();
//   var idv = $('#valor_vehiculo').val();
//   var idc = $('#conductor_id').val();
//   var data = null;
//   data = new FormData();
//   var evidencia = document.getElementById('evi_plataforma').files;
//   if (evidencia.length === 0) {
//     data.append('evi_plataforma', 'Sin_datos');
//   } else {
//     // Aquí puedes realizar acciones adicionales, como enviar el archivo al servidor
//     for (var i = 0; i < evidencia.length; i++) {
//       data.append('evi_plataforma' + i, evidencia[i]);
//     }
//   }

//   data.append('fecha', $('#fechar').val());
//   data.append('hora', $('#horar').val());
//   data.append('usuario', $('#userr').val());
//   data.append('id_vehiculo', idv);
//   data.append('id_conductor', idc);
//   data.append('tipo_estudio', $('#tipo_plataforma').val());
//   data.append('obse_todo', $('#obse_todo').val());
//   data.append('name_eviden', $('#name_eviden').val());
//   data.append('ruta_eviden', $('#ruta_eviden').val());
//   data.append('idsoli', idsoli);
//   data.append('idtipo', $('#id_totros').val());

//   $.ajax({
//     url: $('#id_url_ajax').val() + 'validacionparametros/Aprobar_risk',
//     type: 'POST',
//     data: data,
//     cache: false,
//     processData: false, // Don't process the files
//     contentType: false, // Set content type to false as jQuery will tell the server its a query string request
//     dataType: 'json',
//     success: function (data) {
//       if (data.numero === 200) {
//         mensaje = `<div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
//             <div class="icon"><span class="mdi mdi-check"></span></div>
//               <div class="message">
//                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
//                 <strong>Mensaje!</strong> ${data.mensaje}
//               </div>
//             </div>`;
//         lista_hojas_de_vida(idv, idc, idsoli);
//       } else {
//         mensaje = `<div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role ="alert">
//             <div class="icon"><span class="mdi mdi-info-outline"></span></div>
//                 <div class="message">
//                   <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
//                   <strong>Mensaje!</strong> ${data.mensaje}
//                 </div>
//             </div>`;
//         lista_hojas_de_vida(idv, idc, idsoli);
//       }
//       d.getElementById('historico_estudios').innerHTML = mensaje;
//       $('#content_risk').hide();
//       $('#content_conductor').hide();
//       $('#content_vehiculo').hide();
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log('no inserto risck aprobada');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

// //desaprobar risck
// function desaprobar_risk() {
//   var idsoli = $('#id_soli').val();
//   var idv = $('#valor_vehiculo').val();
//   var idc = $('#conductor_id').val();
//   var data = null;
//   data = new FormData();
//   var evidencia = document.getElementById('evi_plataforma').files;
//   if (evidencia.length === 0) {
//     data.append('evi_plataforma', 'Sin_datos');
//   } else {
//     // Aquí puedes realizar acciones adicionales, como enviar el archivo al servidor
//     for (var i = 0; i < evidencia.length; i++) {
//       data.append('evi_plataforma' + i, evidencia[i]);
//     }
//   }

//   data.append('fecha', $('#fechar').val());
//   data.append('hora', $('#horar').val());
//   data.append('usuario', $('#userr').val());
//   data.append('id_vehiculo', idv);
//   data.append('id_conductor', idc);
//   data.append('tipo_estudio', $('#tipo_plataforma').val());
//   data.append('obse_todo', $('#obse_todo').val());
//   data.append('name_eviden', $('#name_eviden').val());
//   data.append('ruta_eviden', $('#ruta_eviden').val());
//   data.append('idsoli', idsoli);
//   data.append('idtipo', $('#id_totros').val());

//   $.ajax({
//     url: $('#id_url_ajax').val() + 'validacionparametros/Desaprobar_risk',
//     type: 'POST',
//     data: data,
//     cache: false,
//     processData: false, // Don't process the files
//     contentType: false, // Set content type to false as jQuery will tell the server its a query string request
//     dataType: 'json',
//     success: function (data) {
//       if (data.numero === 200) {
//         mensaje = `<div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role = "alert">
//               <div class="icon"><span class="mdi mdi-check"></span></div>
//               <div class="message">
//                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
//                 <strong>Mensaje!</strong> ${data.mensaje}
//               </div>
//           </div> `;
//         lista_hojas_de_vida(idv, idc, idsoli);
//       } else {
//         mensaje = `<div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
//             <div class="icon"><span class="mdi mdi-info-outline"></span></div>
//             <div class="message">
//               <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
//               <strong>Mensaje!</strong> ${data.mensaje}</div></div>`;
//         lista_hojas_de_vida(idv, idc, idsoli);
//       }
//       d.getElementById('historico_estudios').innerHTML = mensaje;
//       $('#content_risk').hide();
//       $('#content_conductor').hide();
//       $('#content_vehiculo').hide();
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log('no inserto risck no aprobado');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

$('#idsolici').val('');
function traer_soli(id_solicitud, id_vpreestudio, placa, estado) {
  $('#respondeprefiltro').hide();
  $('#iniciaprefiltro').show();
  var id_solicitud = id_solicitud;
  var id_vpreestudio = id_vpreestudio;
  d.getElementById('idsolici').value = id_solicitud;
  d.getElementById('idsolici').innerHTML = id_solicitud;
  d.getElementById('idvehiculoini').innerHTML = id_vpreestudio;
  d.getElementById('idplacaini').innerHTML = placa;
  let estate = '';
  if (estado === 'pendiente_iniciar') {
    estate = `<span class="label label-warning" title = "Prefiltro pendiente por iniciar"> <b>Pendiente de Iniciar</b></span>`;
  }
  d.getElementById('solover').innerHTML = estate;
}

function consultarvehiculo(id_solicitud, id_vpreestudio, estado) {
  $('#iniciaprefiltro').hide();
  $('#respondeprefiltro').show();
  $('#estado_ver').html('Estado: ' + estado);
  //validar si trae preestudio y validar el inicio del preestudio
  let formdata = new FormData();
  formdata.append('solicitud_id', id_solicitud);

  fetch($('#id_url_ajax').val() + 'validacionparametros/Consultar_Solicitudes', {
    method: 'POST',
    cache: 'no-cache',
    body: formdata,
  })
    .then(response => response.json())
    .then(function (data) {
      if (data.resultado_solicitudes) {
        $('#p_nsoli').html(data.resultado_solicitudes.id);
        $('#p_fecha').html(data.resultado_solicitudes.fecha);
        $('#p_hora').html(data.resultado_solicitudes.hora);
        $('#p_user').html(data.resultado_solicitudes.usuario);
        $('#p_cliente').html(data.resultado_solicitudes.cliente);
        $('#p_propi').html(data.resultado_solicitudes.nombre_propietario);
        $('#p_docupropi').html(data.resultado_solicitudes.documento_propietario);
        $('#p_tenedor').html(data.resultado_solicitudes.nombre_tenedor);
        $('#p_docutenedor').html(data.resultado_solicitudes.documento_tenedor);
        $('#p_condu').html(data.resultado_solicitudes.nombre_conductor);
        $('#p_docucondu').html(data.resultado_solicitudes.documento_conductor);
        $('#p_web').html(data.resultado_solicitudes.web_satelital);
        $('#p_userweb').html(data.resultado_solicitudes.usuario_satelital);
        $('#p_claveweb').html(data.resultado_solicitudes.clave_satelital);
        $('#p_placa').html(data.resultado_solicitudes.placa_vehiculo);
        $('#p_placat').html(data.resultado_solicitudes.placa_trailer);
      } else {
        alert('Error de operación');
      }

      if (data.resultado_referencias) {
        let tbody = d.getElementById('p_refe');
        let template = '';
        tbody.innerHTML = '';
        data.resultado_referencias.forEach(function (element) {
          template += `<tr>
          <td style="font-size:10px;">${element.nombre_empresa}</td>
          <td style="font-size:10px;">${element.fecha_ingreso}</td>
          <td style="font-size:10px;">${element.fecha_retiro}</td>
          <td style="font-size:10px;">${element.persona_contacto}</td>
          <td style="font-size:10px;">${element.celular}</td>
          <td style="font-size:10px;">${element.cargo}</td>
          </tr>`;
          tbody.innerHTML = template;
        });
      } else {
        alert('Error de operación');
      }

      if (data.resultado_preestudio) {
        let tbody = d.getElementById('p_servi');
        let template = '';
        template.innerHTML = '';

        data.resultado_preestudio.forEach(function (element) {
          template += `<tr>
            <td style="font-size:10px;">${element.nundoc_solicitud}</td>
            <td style="font-size:10px;">${element.nombre_cliente}</td>
            <td style="font-size:10px;" colspan="2"><b>Origen:</b> ${element.orige} <br> <b>Destino:</b> ${element.dest}</td>
            <td style="font-size:10px;">${element.peso_kg} / ${element.tipo_carro}</td>
            <td style="font-size:10px;">${element.usuario_auditor}</td>
            <td style="font-size:10px;">${element.fecha}-${element.hora}</td>
          </tr>`;
          tbody.innerHTML = template;
        });
      } else {
        alert('Error de operación');
      }
    })
    .catch(error => {
      alert(error);
    });
}

function inserta_subasta() {
  alert('insertar subasta');
  numero_estudio = 1033;
  let data = new FormData();
  data.append('numero_estudio', numero_estudio);
  $.post(
    $('#id_url_ajax').val() + 'validacionparametros/Registra_subasta_final',
    function (data) {
      if (data) {
        alert('OK subasta');
      } else {
        alert('NO subasta');
      }
    },
    'json',
  );
}

function abrir_fotos(url, name) {
  if (url != '' && name != '') {
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
  } else {
    // URL de la página que deseas abrir en la nueva ventana
    var url = $('#id_url_ajax').val() + url;
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

// // Función para codificar en Base64
// function codificarBase64(texto) {
//   return btoa(texto);
// }

// // Función para decodificar Base64
// function decodificarBase64(textoCodificado) {
//   return atob(textoCodificado);
// }
