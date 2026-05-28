const d = document;
const w = window;
let placas = '',
  conductor = '',
  propietario = '',
  tenedor = '';

const loadingOverlay = d.getElementById('loading-overlay');
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();

  setInterval(() => {
    listar_solicitudes_operaciones();
  }, 120000);

  d.addEventListener('click', async e => {
    // e.preventDefault();
    const radioButtons = d.getElementsByName('operacion');

    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        const valorSeleccionado = radioButton.value;

        if (valorSeleccionado === 'prefiltro_seguridad') {
          d.querySelector('.campos').style.display = 'block';
          d.getElementById('list_prefiltro').style.display = 'block';
          d.getElementById('list_estudio_seguridad').style.display = 'none';
        } else {
          d.querySelector('.campos').style.display = 'block';
          d.getElementById('list_prefiltro').style.display = 'none';
          d.getElementById('list_estudio_seguridad').style.display = 'block';
        }
        break;
        // No es necesario seguir buscando una vez que se encuentra el seleccionado
      }
    }

    // if (e.target.matches('#validar_token') || e.target.matches('#validar_token *')) {
    //   let padre = e.target.parentElement.parentElement;
    //   let placas = padre.querySelector('#plac_id').value;
    //   let tokens = d.getElementById('tokenval').value;
    //   let numsoli = padre.querySelector('#solic_id').value;
    //   let propietario = padre.querySelector('#propietario_idtk').value;
    //   let conductor = padre.querySelector('#conductor_idtk').value;
    //   let poseedor = padre.querySelector('#poseedor_idtk').value;
    //   if (tokens === '') {
    //     mensaje = `
    //           <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
    //               <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //               <div class="message">
    //                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                 <strong>Mensaje!</strong> Debe ingresar el codigo de seguridad para completar el proceso de hoja de vida para la placa <strong>${placas}</strong>
    //               </div>
    //           </div>`;
    //     d.querySelector('.input-token').classList.add('has-warning');
    //     d.querySelector('#tokenval').focus();
    //   } else {
    //     d.querySelector('.input-token').classList.remove('has-warning');
    //     let data = new FormData();
    //     data.append('placa', placas);
    //     data.append('token', tokens);
    //     data.append('numsoli', numsoli);
    //     data.append('propietario', propietario);
    //     data.append('conductor', conductor);
    //     data.append('tenedor', poseedor);
    //     fetch($('#id_url_ajax').val() + 'validacionparametros/validar_token', {
    //       method: 'POST',
    //       cache: 'no-cache',
    //       body: data,
    //     })
    //       .then(response => response.json())
    //       .then(function(data) {
    //         let mensaje = '';

    //         if (data.numero === 400) {
    //           mensaje = `

    //           <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">

    //               <div class="icon"><span class="mdi mdi-info-outline"></span></div>

    //               <div class="message">

    //                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>

    //                 <strong>Mensaje!</strong> ${data.mensaje}

    //               </div>

    //           </div>`;

    //           d.querySelector('.input-token').classList.add('has-error');

    //           d.querySelector('#tokenval').focus();
    //         } else if (data.numero === 200) {
    //           mensaje = `

    //           <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">

    //               <div class="icon"><span class="mdi mdi-check"></span></div>

    //               <div class="message">

    //                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>

    //                 <strong>Mensaje!</strong> ${data.mensaje}

    //               </div>

    //           </div>`;

    //           d.querySelector('.datos_val').style.display = 'none';

    //           d.querySelector('.sol_estu').style.display = 'Block';
    //         } else {
    //           mensaje = `

    //           <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">

    //               <div class="icon"><span class="mdi mdi-info-outline"></span></div>

    //               <div class="message">

    //                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>

    //                 <strong>Mensaje!</strong> Este vehículo con placa <strong>Texto</strong> no se encuentra creado en el sistema, solicitar prefiltro para su creación.

    //               </div>

    //           </div>`;
    //         }

    //         d.getElementById('historico').innerHTML = mensaje;
    //       })
    //       .catch(error => {
    //         alert(error);
    //       });
    //   }

    //   d.getElementById('historico').innerHTML = mensaje;
    // }

    if (e.target.matches('#consulta_solicitudes') || e.target.matches('#consulta_solicitudes *')) {
      listar_solicitudes_operaciones();
    }

    // if (e.target.matches('#btn_ver') || e.target.matches('#btn_ver *')) {
    //   let padre = e.target.parentElement.parentElement;
    //   let solicitud_id = padre.querySelector('.soli_id').value;
    //   let placa_id = padre.querySelector('.pla_id').value;
    //   var boton = d.getElementById('btn_ver');
    //   let solicitud = boton.getAttribute('data-id2');
    //   let estado = boton.getAttribute('data-id3');
    //   let placa = boton.getAttribute('data-id4');

    //   let data = new FormData();
    //   data.append('placa', placa_id);
    //   data.append('solicitud', solicitud_id);

    //   await fetch($('#id_url_ajax').val() + 'validacionparametros/vsolicitud_preestudio', {
    //     method: 'POST',
    //     cache: 'no-cache',
    //     body: data,
    //   })
    //     .then(response => response.json())
    //     .then(function(data) {
    //       if (data) {
    //         $('#vid').html(data.ver_seguridad.id);
    //         $('#vcliente').html(data.ver_seguridad.nombre_cliente);
    //         $('#vplaca').html(data.ver_seguridad.placa + ' - ' + data.ver_seguridad.placa_trailer);
    //         $('#vconse').html(data.ver_seguridad.id_preestudio);
    //         $('#vfecha').html(data.ver_seguridad.fecha);
    //         $('#vhora').html(data.ver_seguridad.hora);
    //         $('#vuser').html(data.ver_seguridad.usuario_operaciones);

    //         if (data.ver_seguridad.documento_propietario === data.ver_seguridad.Propietario) {
    //           $('#vpropi').html(data.ver_seguridad.nombre_propietario);
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
    //           $('#estado_tercero_conductor').html('<i class="fas fa-user-times"></i> Tercero Pendiente');
    //           $('#estado_tercero_conductor').css('backgroundColor', '#FFFFFF');
    //           $('#vcondu').css('backgroundColor', '#FFFFFF');
    //           $('#vcondu').css('Color', '#000000');
    //           $('#vcdocumento').css('backgroundColor', '#FFFFFF');
    //           $('#vcdocumento').css('Color', '#000000');
    //           $('#vcondu').html(data.ver_seguridad.nombre_conductor);
    //           $('#vcdocumento').html(data.ver_seguridad.documento_conductor);
    //         }

    //         // if (data.ver_seguridad.documento_propietario_trailer === data.ver_seguridad.Propietario_Trailer) {
    //         //   $('#ptcondu').html(data.ver_seguridad.nombre_propietario_trailer);
    //         //   $('#ptcondu').css('backgroundColor', '#A5D6A7');
    //         //   $('#ptcondu').css('Color', '#FFFFFF');
    //         //   $('#ptcdocumento').css('backgroundColor', '#A5D6A7');
    //         //   $('#ptcdocumento').css('Color', '#FFFFFF');
    //         //   $('#ptcdocumento').html(data.ver_seguridad.documento_propietario_trailer);
    //         //   $('#estado_tercero_pro_trailer').html('<i class="fas fa-user-check"></i> Tercero Creado');
    //         //   $('#estado_tercero_pro_trailer').css('backgroundColor', '#A5D6A7');
    //         // } else {
    //         //   $('#ptcondu').css('backgroundColor', '#FFFFFF');
    //         //   $('#ptcondu').css('Color', '#000000');
    //         //   $('#ptcdocumento').css('backgroundColor', '#FFFFFF');
    //         //   $('#ptcdocumento').css('Color', '#000000');
    //         //   $('#ptcondu').html(data.ver_seguridad.nombre_propietario_trailer);
    //         //   $('#ptcdocumento').html(data.ver_seguridad.documento_propietario_trailer);
    //         //   $('#estado_tercero_pro_trailer').html('<i class="fas fa-user-check"></i> Tercero Pendiente');
    //         //   $('#estado_tercero_pro_trailer').css('backgroundColor', '#FFFFFF');
    //         // }

    //         if (data.ver_seguridad.documento_propietario_trailer !== '') {
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
    //             $('#estado_tercero_pro_trailer').html('<i class="fas fa-user-check"></i> Tercero Pendiente');
    //             $('#estado_tercero_pro_trailer').css('backgroundColor', '#FFFFFF');
    //           }
    //         } else {
    //           console.log('Sin pripietario de trailer');
    //         }

    //         $('#vweb').html(data.ver_seguridad.web_satelital);
    //         $('#vwuser').html(data.ver_seguridad.usuario_satelital);
    //         $('#vwclave').html(data.ver_seguridad.clave_satelital);
    //         $('#vuser').html(data.ver_seguridad.usuario);
    //         // Listar Referencias
    //         $('#consulta_referencia').html('');

    //         if (data.resultado_referencias) {
    //           data.resultado_referencias.forEach(function(element) {
    //             $('#consulta_referencia').append(
    //               `<tr>
    //                   <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.nombre_empresa}</td>
    //                   <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.fecha_ingreso}</td>
    //                   <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.fecha_retiro}</td>
    //                   <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.persona_contacto}</td>
    //                   <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.celular}</td>
    //                   <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.cargo}</td>
    //               </tr>`,
    //             );
    //           });
    //         } else {
    //           $('#consulta_referencia').html(
    //             `<tr>
    //             <td></td>
    //             <td></td>
    //             <td>No hay Referencias</td>
    //             <td></td>
    //             <td></td>
    //             <td></td>
    //         </tr>`,
    //           );
    //         }

    //         $('#consulta_tbservicio').html('');

    //         if (data.resultado_preestudio) {
    //           data.resultado_preestudio.forEach(function(element) {
    //             $('#consulta_tbservicio').append(
    //               ` <tr>
    //               <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.nundoc_solicitud}</td>
    //               <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.nombre_cliente}</td>
    //               <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;" colspan="2"><b>Origen:</b> ${element.orige}  <b>Destino:</b> ${element.dest}</td>
    //               <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.peso_kg} / ${element.tipo_vehiculo}</td>
    //               <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.usuario_auditor}</td>
    //               <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.fecha} - ${element.hora}</td>
    //               '</tr>'`,
    //             );
    //           });
    //         }

    //         $('#consulta_documentos').html('');

    //         if (data.resultado_documentos) {
    //           data.resultado_documentos.forEach(function(element, index) {
    //             $('#consulta_documentos').append(
    //               `<tr>
    //               <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.tipo_hv}</td>
    //               <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.clase}</td>
    //               <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;"> <a href="#" onclick="abrir_fotos('${element.ruta}' , '${element.nombre_archivo}')" class="cell-detail hint--top-left" data-hint="">
    //               <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="Documento"></span>
    //               </a></td>
    //               <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.usuario}</td>
    //               <td class="text-center" style="font-size:10px;border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">${element.fecha} - ${element.hora}</td>
    //             </tr>`,
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

    //   // Actualizar campos

    //   let formdata = new FormData();

    //   formdata.append('placa', placa_id);

    //   formdata.append('solicitud', solicitud_id);

    //   await fetch($('#id_url_ajax').val() + 'validacionparametros/vasolicitud_preestudio', {
    //     method: 'POST',

    //     cache: 'no-cache',

    //     body: formdata,
    //   })
    //     .then(response => response.json())
    //     .then(function(data) {
    //       if (data) {
    //         var z = 0;
    //         $('#consulta_datoupdate').html('');
    //         data.forEach(function(element, index) {
    //           z++;
    //           $('#consulta_datoupdate').append(
    //             ` <tr>
    //             <td> ${z}</td>
    //             <td>${element.tipo_hv} </td>
    //             <td>${element.tipo_campo} </td>
    //             <td> ${element.info_campo} </td>
    //             <td>${element.usuario}</td>
    //             <td> ${element.fecha} / ${element.hora} </td>
    //           </tr>`,
    //           );
    //         });
    //       } else {
    //         $('#consulta_datoupdate').append(
    //           `<tr>
    //             <td></td>
    //             <td></td>
    //             <td>No hay Referencias</td>
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

    //   // Documentos campos
    //   let formdatadocumento = new FormData();
    //   formdatadocumento.append('placa', placa_id);
    //   formdatadocumento.append('solicitud', solicitud_id);

    //   await fetch($('#id_url_ajax').val() + 'validacionparametros/Documentos_Actualizar', {
    //     method: 'POST',
    //     cache: 'no-cache',
    //     body: formdatadocumento,
    //   })
    //     .then(response => response.json())
    //     .then(function(data) {
    //       if (data) {
    //         data.resultado_documento_actualizar.forEach(function(element, index) {
    //           $('#consulta_datoupdate').append(
    //             `<tr>

    //               <td>${element.tipo_hv}</td>

    //               <td>${element.clase}</td>

    //               <td> <a href="#" onclick="abrir_fotos('${element.ruta}' , '${element.nombre_archivo}')" class="cell-detail hint--top-left" data-hint="">

    //               <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="Documento"></span>

    //               </a></td>

    //               <td>${element.usuario}</td>

    //               <td>${element.fecha} - ${element.hora}</td>

    //             </tr>

    //             `,
    //           );
    //         });
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

    // if (e.target.matches('#btn_res_seguridad') || e.target.matches('#btn_res_seguridad *')) {
    //   let padre = e.target.parentElement.parentElement;
    //   let solicitud_id = padre.querySelector('.soli_id').value;
    //   let placa_id = padre.querySelector('.pla_id').value;

    //   $('#rplaca').html(placa_id);
    //   let data = new FormData();
    //   data.append('placa', placa_id);
    //   data.append('solicitud', solicitud_id);
    //   await fetch($('#id_url_ajax').val() + 'validacionparametros/consultar_respuesta_seguridad', {
    //     method: 'POST',
    //     cache: 'no-cache',
    //     body: data,
    //   })
    //     .then(response => response.json())
    //     .then(function(data) {
    //       if (data) {
    //         // Listar Referencias

    //         $('#respuestas_seguridad').html('');
    //         data.forEach(function(element) {
    //           var causa = '';

    //           if (element.respuesta == null) {
    //             causa = '';
    //           } else {
    //             causa = element.respuesta;
    //           }

    //           if (element.token === null) {
    //             $('#token').html('');
    //           } else {
    //             $('#token').html(element.token);
    //           }

    //           if (element.token === null) {
    //             $('#fechaexpiracion').html('');
    //           } else {
    //             $('#fechaexpiracion').html(element.token_valido);
    //           }

    //           $('#respuestas_seguridad').append(
    //             '<tr>' +
    //               "<td style='width: auto; white-space: nowrap;'>" +
    //               element.estado +
    //               '</td>' +
    //               "<td style='width: auto; white-space: nowrap;'>" +
    //               element.observacion +
    //               '</td>' +
    //               "<td style='width: auto; white-space: nowrap;'>" +
    //               element.usuario +
    //               '</td>' +
    //               "<td style='width: auto; white-space: nowrap;'>" +
    //               element.fecha +
    //               ' / ' +
    //               element.hora +
    //               '</td>' +
    //               '</tr>',
    //           );
    //         });
    //       } else {
    //         $('#consulta_referencia').append(
    //           `<tr>

    //           <td></td>

    //           <td></td>

    //           <td>No hay Referencias</td>

    //           <td></td>

    //           <td></td>

    //           <td></td>

    //       </tr>`,
    //         );
    //       }
    //     })
    //     .catch(error => {
    //       alert(error);
    //     });
    // }

    if (e.target.matches('#btn_secury') || e.target.matches('#btn_secury *')) {
      $('#estudio_se').hide();
      d.querySelector('.datos_val').style.display = 'Block';
      d.querySelector('.sol_estu').style.display = 'none';
      d.getElementById('tokenval').value = '';
      let padre = e.target.parentElement.parentElement;
      placas = padre.querySelector('.pla_id').value;
      let numsoli = padre.querySelector('.soli_id').value;
      propietario = padre.querySelector('.propietario').value;
      tenedor = padre.querySelector('.tenedor').value;
      conductor = padre.querySelector('.conductor').value;
      placa_trailer_nuevo = padre.querySelector('.placa_trailer_nuevo').value;
      documento_propietario_trailer = padre.querySelector('.documento_propietario_trailer').value;
      proceso_prefiltro_itr = padre.querySelector('.proceso_prefiltro_itr').value;
      observacion_prefiltro = padre.querySelector('.observacion_prefiltro').value;
      responsable_vehiculo = padre.querySelector('.responsable_vehiculo').value;

      /* VARIABLES PARA EL TOKEN */
      d.getElementById('plac_id').value = placas;
      d.getElementById('solic_id').value = numsoli;
      d.getElementById('propietario_idtk').value = propietario;
      d.getElementById('conductor_idtk').value = conductor;
      d.getElementById('poseedor_idtk').value = tenedor;
      d.getElementById('propietario_trailer_idtk').value = documento_propietario_trailer;
      d.getElementById('trailer_idtk').value = placa_trailer_nuevo;
      // datos para eivar a lavidar las hojas de vidda

      d.getElementById('propietario_id').value = propietario;
      d.getElementById('tenedor_id').value = tenedor;
      d.getElementById('conductor_id').value = conductor;
      d.getElementById('propietario_trailer_id').value = documento_propietario_trailer;
      d.getElementById('trailer_id').value = placa_trailer_nuevo;
      d.getElementById('vehiculo_id').value = placas;

      $('#prees').val(numsoli);
      $('#proceso_estu_itr').val(proceso_prefiltro_itr);
      $('#observacion_prefiltro').val(observacion_prefiltro);
      $('#plack').val(placas);
      $('#placa_es').val(placas);
      $('.placa_es').html(placas);
      $('#numplaca').val(placas);
      $('#popietario_es').val(propietario);
      $('.popietario_es').html(propietario);
      $('#tenedor_es').val(tenedor);
      $('.tenedor_es').html(tenedor);
      $('#conductor_es').val(conductor);
      $('.conductor_es').html(conductor);
      $('.placa_trailer').html(placa_trailer_nuevo);
      $('.prodpietario_trailer').html(documento_propietario_trailer);
      $('#responsable_vehiculo').val(responsable_vehiculo);
      var mensaje = '';
      //  Copiar Funcion
      // Hojas_de_vida(placas, conductor, propietario, tenedor);
      Hojas_de_vida(placas, conductor, propietario, tenedor, documento_propietario_trailer, placa_trailer_nuevo);
    }

    // Botones para los enlaces de hojas de vida
    if (e.target.matches('#hv_terceos') || e.target.matches('#hv_terceos *')) {
      let padre = e.target.parentElement.parentElement;

      let conductor_hv = padre.querySelector('.conductor_hv').value;

      let propietario_hv = padre.querySelector('.propietario_hv').value;

      let tenedor_hv = padre.querySelector('.tenedor_hv').value;

      var url = $('#id_url_ajax').val() + 'solicitudes/proveedores/?idmenu=3&conductor=' + conductor_hv + '&tenedor=' + tenedor_hv + '&propietario=' + propietario_hv + '&sw=1';

      window.open(url, 'Crear Hoja de vida de terceros', 'with=1000,height=1000');
    }

    if (e.target.matches('#hv_propi_tene') || e.target.matches('#hv_propi_tene *')) {
      let padre = e.target.parentElement.parentElement;

      let propietario_hv = padre.querySelector('.propietario_hv').value;

      let tenedor_hv = padre.querySelector('.tenedor_hv').value;

      var url = $('#id_url_ajax').val() + 'solicitudes/proveedores/?idmenu=3&tenedor=' + tenedor_hv + '&propietario=' + propietario_hv + '&sw=1';

      window.open(url, 'Crear Hoja de vida de terceros', 'with=1000,height=1000');
    }

    if (e.target.matches('#hv_propi_cond') || e.target.matches('#hv_propi_cond *')) {
      let padre = e.target.parentElement.parentElement;

      let propietario_hv = padre.querySelector('.propietario_hv').value;

      let conductor_hv = padre.querySelector('.conductor_hv').value;

      var url = $('#id_url_ajax').val() + 'solicitudes/proveedores/?idmenu=3&conductor=' + conductor_hv + '&propietario=' + propietario_hv + '&sw=1';

      window.open(url, 'Crear Hoja de vida de terceros', 'with=1000,height=1000');
    }

    if (e.target.matches('#hv_propi_poss') || e.target.matches('#hv_propi_poss *')) {
      let padre = e.target.parentElement.parentElement;

      let tenedor_hv = padre.querySelector('.tenedor_hv').value;

      let conductor_hv = padre.querySelector('.conductor_hv').value;

      var url = $('#id_url_ajax').val() + 'solicitudes/proveedores/?idmenu=3&conductor=' + conductor_hv + '&tenedor=' + tenedor_hv + '&sw=1';

      window.open(url, 'Crear Hoja de vida de terceros', 'with=1000,height=1000');
    }

    // Enlaces para cada tercerro de la hoja de vida
    if (e.target.matches('#hv_vehiculono') || e.target.matches('#hv_vehiculono *')) {
      let padre = e.target.parentElement.parentElement;

      let placa_vehiculo = padre.querySelector('.placa_vehiculo').value;

      var url = $('#id_url_ajax').val() + 'solicitudes/vehiculos/?idmenu=3&placa_vehiculo=' + placa_vehiculo + '&sw=1';

      window.open(url, 'Crear Hoja de vida de Vehiculos', 'with=1000,height=1000');
    }

    // propietario
    if (e.target.matches('#hv_propi') || e.target.matches('#hv_propi *')) {
      let padre = e.target.parentElement.parentElement;

      let propietario_hv = padre.querySelector('.propietario_hv').value;

      var url = $('#id_url_ajax').val() + 'solicitudes/proveedores/?idmenu=3&propietario=' + propietario_hv + '&sw=1';

      window.open(url, 'Crear Hoja de vida de Vehiculos', 'with=1000,height=1000');
    }

    // poseedor
    if (e.target.matches('#hv_tene') || e.target.matches('#hv_tene *')) {
      let padre = e.target.parentElement.parentElement;

      let tenedor_hv = padre.querySelector('.tenedor_hv').value;

      var url = $('#id_url_ajax').val() + 'solicitudes/proveedores/?idmenu=3&tenedor=' + tenedor_hv + '&sw=1';

      window.open(url, 'Crear Hoja de vida de Vehiculos', 'with=1000,height=1000');
    }

    // conductor
    if (e.target.matches('#hv_conduno') || e.target.matches('#hv_conduno *')) {
      let padre = e.target.parentElement.parentElement;

      let conductor_hv = padre.querySelector('.conductor_hv').value;

      var url = $('#id_url_ajax').val() + 'solicitudes/proveedores/?idmenu=3&conductor=' + conductor_hv + '&sw=1';

      window.open(url, 'Crear Hoja de vida de Conductor', 'with=1000,height=1000');
    }

    // Boton ´para solicitar el estudio validar_solicitud
    // if (e.target.matches('#validar_hojasv') || e.target.matches('#validar_hojasv *')) {
    //   let padre = e.target.parentElement.parentElement;
    //   let propietario_id = padre.querySelector('#propietario_id').value;
    //   let tenedor_id = padre.querySelector('#tenedor_id').value;
    //   let conductor_id = padre.querySelector('#conductor_id').value;
    //   let placa_id = d.getElementById('plac_id').value;
    //   let propietario_trailer_id = d.getElementById('propietario_trailer_id').value;
    //   let trailer_id = d.getElementById('trailer_id').value;

    //   let mensaje = '';
    //   $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga

    //   let datos = new FormData();
    //   datos.append('propietario', propietario_id);
    //   datos.append('tenedor', tenedor_id);
    //   datos.append('conductor', conductor_id);
    //   datos.append('placa', placa_id);
    //   datos.append('propietario_trailer', propietario_trailer_id);
    //   datos.append('trailer', trailer_id);

    //   try {
    //     const response = await fetch($('#id_url_ajax').val() + 'validacionparametros/validar_hojas_vida', {
    //       method: 'POST',
    //       body: datos,
    //       cache: 'no-cache',
    //     });
    //     const data = await response.json();
    //     if (data.numero === 400) {
    //       mensaje = `
    //         <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //             <div class="icon"><span class="mdi mdi-check"></span></div>
    //             <div class="message">
    //               <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //               <strong>Mensaje!</strong> ${data.mensaje}
    //             </div>
    //         </div>`;
    //       d.getElementById('solicitar_hv').style.display = 'none';
    //       d.getElementById('validar_hv').style.display = 'block';
    //       // d.getElementById('historico').innerHTML = mensaje;
    //     } else if (data.numero === 200) {
    //       mensaje = `
    //     <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
    //         <div class="icon"><span class="mdi mdi-check-circle"></span></div>
    //         <div class="message">
    //           <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //           <strong>Mensaje!</strong> ${data.mensaje}
    //         </div>
    //     </div>`;
    //       d.getElementById('solicitar_hv').style.display = 'block';
    //       d.getElementById('validar_hv').style.display = 'none';
    //       // d.getElementById('historico').innerHTML = mensaje;
    //     }
    //   } catch (error) {
    //     console.error('Error en la primera solicitud:', error);
    //     throw error;
    //   } finally {
    //     $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    //     d.getElementById('historico').innerHTML = mensaje;
    //     // crear_Dato_Ministerio(creacion_proveedor);
    //   }

    //   try {
    //     // loadingOverlay.style.display = 'flex';
    //     await Hojas_de_vida(placa_id, conductor_id, propietario_id, tenedor_id, propietario_trailer_id, trailer_id);
    //   } catch (error) {
    //     console.error('Error en la petición:', error);
    //   } finally {
    //     // Ocultar el overlay de loading
    //     // loadingOverlay.style.display = 'none';
    //   }
    // }

    // if (e.target.matches('#btn_validar_datos_prefiltro') || e.target.matches('#btn_validar_datos_prefiltro *')) {
    //   if (w.confirm('¿Esta seguro de validar el nuvo recurso?')) {
    //     let padre = e.target.parentElement.parentElement;
    //     var btn = padre.querySelector('#btn_validar_datos_prefiltro');
    //     // Accede al valor del atributo data-id
    //     var token = btn.getAttribute('data-token');
    //     var estado = btn.getAttribute('data-estado');
    //     var estudio = btn.getAttribute('data-estudio');
    //     var propietario = btn.getAttribute('data-propietario');
    //     var poseedor = btn.getAttribute('data-poseedor');
    //     var conductor = btn.getAttribute('data-conductor');
    //     var Propietario_Trailer = btn.getAttribute('data-propietarioTrailer');
    //     // var placa = btn.getAttribute('data-placa');
    //     // console.log(conductor);
    //     // crear el formulario
    //     $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
    //     let datos = new FormData();
    //     datos.append('propietario', propietario);
    //     datos.append('poseedor', poseedor);
    //     datos.append('conductor', conductor);
    //     datos.append('Propietario_Trailer', Propietario_Trailer);
    //     // datos.append('placa', placa);
    //     datos.append('estudio', estudio);
    //     datos.append('token', token);
    //     datos.append('estado', estado);
    //     try {
    //       const response = await fetch($('#id_url_ajax').val() + 'validacionparametros/validar_hojas_prefiltro_recurso_nuevo', {
    //         method: 'POST',
    //         body: datos,
    //         cache: 'no-cache',
    //       });
    //       const data = await response.json();
    //       if (data === true) {
    //         d.getElementById('validado_token_prefiltro_nuevo').innerHTML = `<i class="fa-solid fa-user-check" style="color:#FFF;"></i>`;
    //         d.getElementById('validado_token_prefiltro_nuevo').style.backgroundColor = '#81C784';
    //         d.getElementById('mensaje_validacion').innerHTML = `
    //           <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
    //             <div class="icon"><span class="mdi mdi-check"></span></div>
    //             <div class="message">
    //               <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Menssaje!</strong> Operaciión validada conrrectamente.
    //             </div>
    //           </div>
    //         `;

    //         var titulo_puhs = `Plataforma NexosApp`;
    //         var mensaje_puhs = `El o recursos creado para el estudio ${estudio} \n relizar actualización de la hoja de vida.`;

    //         Push.Permission.request();
    //         Push.create(titulo_puhs, {
    //           body: mensaje_puhs,
    //           // body: 'El proceso ' + estudio + ' Con la respuesta: ' + estado + ' Tipo ' + estado,
    //           icon: $('#id_url_ajax').val() + 'public/img/logo.png',
    //           timeout: 2500000,
    //           vibrate: [100, 100, 100],
    //           onClick: function() {
    //             window.location = $('#id_url_ajax').val() + 'preestudiov/nacional_preestudio/?idmenu=1';
    //             console.log(this);
    //           },
    //         });
    //       } else {
    //         d.getElementById('validado_token_prefiltro_nuevo').innerHTML = `<i class="fa-solid fa-user-xmark" style="color:#FFF;"></i>`;
    //         d.getElementById('validado_token_prefiltro_nuevo').style.backgroundColor = '#E57373';
    //         d.getElementById('mensaje_validacion').innerHTML = `
    //         <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //           <div class="icon"><span class="mdi mdi-close-circle-o"></span></div>
    //           <div class="message">
    //             <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Mensaje!</strong> Error de operacion, token no peretece a este prefiltro o recurso no creado en el sistema.
    //           </div>
    //         </div>
    //       `;
    //       }
    //     } catch (error) {
    //       console.error('Error en la primera solicitud:', error);
    //       throw error;
    //     } finally {
    //       $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    //     }
    //   }
    // }

    // if (e.target.matches('#validar_solicitud') || e.target.matches('#validar_solicitud *')) {
    //   let padre = e.target.parentElement.parentElement;
    //   let placa = padre.querySelector('#plack').value;
    //   let idprees = padre.querySelector('#prees').value;
    //   let user = padre.querySelector('#usuario_estu').value;
    //   let fecha = padre.querySelector('#fecha_estu').value;
    //   let hora = padre.querySelector('#hora_estu').value;
    //   let proceso = padre.querySelector('#proceso_estu').value;
    //   let proceso_prefiltro_itr = padre.querySelector('#proceso_estu_itr').value;
    //   let observacion_prefiltro = padre.querySelector('#observacion_prefiltro').value;
    //   let responsable_vehiculo = padre.querySelector('#responsable_vehiculo').value;

    //   // crear el formulario
    //   let data = new FormData();

    //   data.append('placa', placa);
    //   data.append('idprees', idprees);
    //   data.append('user', user);
    //   data.append('fecha', fecha);
    //   data.append('hora', hora);
    //   data.append('proceso', proceso);
    //   data.append('proceso_prefiltro_itr', proceso_prefiltro_itr);
    //   data.append('observacion_prefiltro', observacion_prefiltro);
    //   data.append('responsable_vehiculo', responsable_vehiculo);
    //   await fetch($('#id_url_ajax').val() + 'validacionparametros/Crear_estudio_seguridad', {
    //     method: 'POST',

    //     cache: 'no-cache',

    //     body: data,
    //   })
    //     .then(response => {
    //       if (!response.ok) throw new Error(response.statusText);

    //       return response.json();
    //     })
    //     .then(function(data) {
    //       if (data.numero === 400) {
    //         loadingOverlay.style.display = 'none';

    //         mensaje = `

    //           <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">

    //               <div class="icon"><span class="mdi mdi-info-outline"></span></div>

    //               <div class="message">

    //                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>

    //                 <strong>Mensaje!</strong> ${data.mensaje}

    //               </div>

    //           </div>`;
    //       } else if (data.numero == 200) {
    //         loadingOverlay.style.display = 'none';

    //         mensaje = `

    //       <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">

    //           <div class="icon"><span class="mdi mdi-check-circle"></span></div>

    //           <div class="message">

    //             <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>

    //             <strong>Mensaje!</strong> ${data.mensaje}

    //           </div>

    //       </div>`;

    //         $('#estudio_seguridad').modal('hide');

    //         listar_solicitudes_operaciones();
    //       }

    //       d.getElementById('historico').innerHTML = mensaje;
    //     })
    //     .catch(error => {
    //       alert(error);
    //     });
    // }

    // Boton para lista de comprobacion
    // if (e.target.matches('#btn_listado') || e.target.matches('#btn_listado *')) {
    //   let padre = e.target.parentElement.parentElement;

    //   let placa = padre.querySelector('.pla_id').value;
    //   let num_solicitud = padre.querySelector('.soli_id').value;
    //   let nombre = padre.querySelector('.nombre').value;
    //   let apellido = padre.querySelector('.apellido').value;
    //   let conductor_id = padre.querySelector('.conductor_id').value;
    //   let vehiculo_id = padre.querySelector('.vehiculo_id').value;
    //   d.getElementById('idvehi').innerHTML = placa;
    //   d.getElementById('idcondu').innerHTML = nombre + ' ' + apellido;
    //   d.querySelector('.idstu').innerHTML = num_solicitud;
    //   d.getElementById('idstu').value = num_solicitud;
    //   var datos = {
    //     idv: vehiculo_id,
    //     idc: conductor_id,
    //     idsoli: num_solicitud,
    //     action: 'verestudio_operaciones',
    //   };
    //   $('#ini').html('');
    //   $('#apro').html('');
    //   $('#cini').html('');
    //   $('#capro').html('');
    //   $('#rini').html('');
    //   $('#rapro').html('');
    //   $('#ruini').html('');
    //   $('#ruapro').html('');
    //   $('#pini').html('');
    //   $('#poapro').html('');
    //   $('#proini').html('');
    //   $('#proapro').html('');
    //   $('#smini').html('');
    //   $('#sipro').html('');
    //   $('#siscini').html('');
    //   $('#siscompro').html('');
    //   $('#aini').html('');
    //   $('#adrpro').html('');
    //   $('#gini').html('');
    //   $('#gpro').html('');
    //   $('#preini').html('');
    //   $('#prepro').html('');
    //   $('#cuerpo_estudio').html('');
    //   //$("#tbr_opera").html('');

    //   $.ajax({
    //     url: $('#id_url_ajax').val() + 'validacionparametros/ver_estudio_operaciones',

    //     type: 'POST',

    //     data: datos,

    //     dataType: 'json',

    //     success: function(data, textStatus, jqXHR) {
    //       // alert('entro a data LISTA COMPROBACION');

    //       if (data) {
    //         // alert('empezo estudio de seguridad');

    //         $('#caja_rtaopera').hide();

    //         var cunt = 0;

    //         data.resultado.forEach(function(element, index) {
    //           cunt++;

    //           $('#idstu').val(element.id_estudio);

    //           $('#op_nestudio').val(element.id_estudio);

    //           var etotal = element.estadototal;

    //           if (etotal == 'gray') {
    //             $('#estadostudy').val('sin respuesta');
    //           }

    //           if (etotal !== 'gray') {
    //             $('#estadostudy').val(etotal);
    //           }

    //           //$("#estadostudy").val(element.estadototal);
    //           if (element.estadototal == 'Aprobado') {
    //             $('#estado_estu').prop('disabled', true);

    //             $('#aprobar_estudio_total').hide();
    //           } else {
    //             $('#estado_estu').prop('disabled', false);

    //             $('#obse_estu').prop('disabled', false);

    //             $('#aprobar_estudio_total').show();
    //           }

    //           tb_respuestas_op(); //tabla respuestas de operaciones a seguridad

    //           var tipo = element.estudio;

    //           var aprobado = element.estado;

    //           var status = '';

    //           var requerido = '';

    //           $requerido = '<span class="text-primary mdi mdi-star-half icon"></span>';

    //           if (tipo == 'hoja de vida vehiculo') {
    //             iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';

    //             if (aprobado == '1') {
    //               status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
    //             } else if (aprobado == '0') {
    //               status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
    //             }

    //             //impirimir el inicado

    //             $('#ini').html('' + iniciado2 + '');

    //             $('#apro').html('' + status + '');
    //           }

    //           if (tipo == 'hoja de vida conductor') {
    //             iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';

    //             if (aprobado == '1') {
    //               status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
    //             } else if (aprobado == '0') {
    //               status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
    //             }

    //             $('#cini').html('' + iniciado2 + '');

    //             $('#capro').html('' + status + '');
    //           }

    //           if (tipo == 'risck') {
    //             iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';

    //             if (aprobado == '1') {
    //               status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
    //             } else if (aprobado == '0') {
    //               status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
    //             }

    //             $('#rini').html('' + iniciado2 + '');

    //             $('#rapro').html('' + status + '');
    //           }

    //           if (tipo == 'siplaft') {
    //             iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';

    //             if (aprobado == '1') {
    //               status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
    //             } else if (aprobado == '0') {
    //               status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
    //             }

    //             $('#sini').html('' + iniciado2 + '');

    //             $('#sapro').html('' + status + '');
    //           }

    //           if (tipo == 'runt') {
    //             iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';

    //             if (aprobado == '1') {
    //               status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
    //             } else if (aprobado == '0') {
    //               status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
    //             }

    //             $('#ruini').html('' + iniciado2 + '');

    //             $('#ruapro').html('' + status + '');
    //           }

    //           if (tipo == 'policia') {
    //             iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';

    //             if (aprobado == '1') {
    //               status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
    //             } else if (aprobado == '0') {
    //               status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
    //             }

    //             $('#pini').html('' + iniciado2 + '');

    //             $('#poapro').html('' + status + '');
    //           }

    //           if (tipo == 'procuraduria') {
    //             iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';

    //             if (aprobado == '1') {
    //               status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
    //             } else if (aprobado == '0') {
    //               status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
    //             }

    //             $('#proini').html('' + iniciado2 + '');

    //             $('#proapro').html('' + status + '');
    //           }

    //           if (tipo == 'simit') {
    //             iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';

    //             if (aprobado == '1') {
    //               status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
    //             } else if (aprobado == '0') {
    //               status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
    //             }

    //             $('#smini').html('' + iniciado2 + '');

    //             $('#sipro').html('' + status + '');
    //           }

    //           if (tipo == 'siscomn') {
    //             iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';

    //             if (aprobado == '1') {
    //               status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
    //             } else if (aprobado == '0') {
    //               status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
    //             }

    //             $('#siscini').html('' + iniciado2 + '');

    //             $('#siscompro').html('' + status + '');
    //           }

    //           if (tipo == 'adres') {
    //             iniciado = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';

    //             if (aprobado == '1') {
    //               status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
    //             } else if (aprobado == '0') {
    //               status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
    //             }

    //             $('#aini').html('' + iniciado + '');

    //             $('#adrpro').html('' + status + '');
    //           }

    //           if (tipo == 'Gps') {
    //             iniciado = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';

    //             if (aprobado == '1') {
    //               status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
    //             } else if (aprobado == '0') {
    //               status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
    //             }

    //             $('#gini').html('' + iniciado + '');

    //             $('#gpro').html('' + status + '');
    //           }

    //           if (tipo == 'Dato preestudio') {
    //             iniciado = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';

    //             if (aprobado == '1') {
    //               status = '<center><span class="text-success mdi mdi-dot-circle icon">' + '</span></center>';
    //             } else if (aprobado == '0') {
    //               status = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';
    //             }

    //             $('#preini').html('' + iniciado + '');

    //             $('#prepro').html('' + status + '');
    //           }

    //           //OBSERVACIONES

    //           var btn_estudio = '';

    //           var palabra, d;

    //           if (element.estado == '1') {
    //             palabra = 'Aceptado';
    //           }

    //           if (element.estado == '0') {
    //             palabra = 'No aceptado';

    //             btn_estudio =
    //               '<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-sun" title="edicion operaciones"' +
    //               'style="color:#008F39;" id="res_operacion' +
    //               cunt +
    //               '" data-id="' +
    //               element.id_estudio +
    //               '" data-id2="' +
    //               element.id +
    //               '" data-id3="' +
    //               element.estudio +
    //               '" ></button>';
    //           }

    //           $('#cuerpo_estudio').append(
    //             '<tr>' +
    //               '<td>' +
    //               element.estudio +
    //               '</td>' +
    //               '<td>' +
    //               palabra +
    //               '</td>' +
    //               '<td>' +
    //               element.observacion +
    //               '</td>' +
    //               '<td>' +
    //               element.usuario +
    //               '</td>' +
    //               '<td>' +
    //               element.fecha +
    //               '_' +
    //               element.hora +
    //               '</td>' +
    //               '<td>' +
    //               btn_estudio +
    //               '</td>' +
    //               '</tr>',
    //           );

    //           $('#op_estudio').val('');

    //           $('#op_ntipo').val('');

    //           $('#op_nestudio').val('');

    //           $('#op_respuesta').val('');

    //           $('#op_archivo').val('');

    //           $('#op_nomarchivo').val('');

    //           $('#res_operacion' + cunt + '').click(function() {
    //             $('#caja_rtaopera').show();

    //             var id_estudio = $(this).attr('data-id');

    //             var idtipo = $(this).attr('data-id2');

    //             var estudio = $(this).attr('data-id3');

    //             $('#op_estudio').val(estudio);

    //             $('#op_ntipo').val(idtipo);

    //             $('#op_nestudio').val(id_estudio);
    //           });
    //         });

    //         $('#tbr_observaciones').html('');
    //         data.resultado_observacion.forEach(element => {
    //           $('#tbr_observaciones').append(
    //             '<tr>' +
    //               "<td style='font-size: 11px;'>" +
    //               element.id +
    //               '</td>' +
    //               "<td style='font-size: 11px;'>" +
    //               element.observacion +
    //               '</td>' +
    //               // "<td style='font-size: 11px;'>" +
    //               // element.causalidad +
    //               // "</td>" +
    //               "<td style='font-size: 11px;'>" +
    //               element.fecha +
    //               '-' +
    //               element.hora +
    //               '</td>' +
    //               "<td style='font-size: 11px;'>" +
    //               element.usuario +
    //               '</td>' +
    //               "<td style='font-size: 11px;'>" +
    //               element.estado +
    //               '</td>' +
    //               +'</tr>',
    //           );
    //           // tbr_observaciones
    //         });
    //       } else {
    //         //alert('Aun no ha empezado estudio de seguridad');

    //         iniciado = '<center><span class="text-danger mdi mdi-dot-circle icon">' + '</span></center>';

    //         $('#ini').html('' + iniciado + '');

    //         $('#cini').html('' + iniciado + '');

    //         $('#rini').html('' + iniciado + '');

    //         $('#sini').html('' + iniciado + '');

    //         $('#ruini').html('' + iniciado + '');

    //         $('#pini').html('' + iniciado + '');

    //         $('#proini').html('' + iniciado + '');

    //         $('#smini').html('' + iniciado + '');

    //         $('#siscini').html('' + iniciado + '');

    //         $('#aini').html('' + iniciado + '');

    //         $('#gini').html('' + iniciado + '');

    //         $('#preini').html('' + iniciado + '');
    //       }
    //     },

    //     error: function(jqXHR, textStatus, errorThrown) {
    //       console.log(jqXHR);

    //       console.log(textStatus);

    //       console.log(errorThrown);
    //     },
    //   });

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
    //     .then(function(data) {
    //       $('#consulta_datoupdate').html('');

    //       if (data) {
    //         data.resultado_documento_actualizar.forEach(function(element, index) {
    //           $('#consulta_datoupdate').append(
    //             `<tr>

    //                     <td>${element.tipo_hv}</td>

    //                     <td>${element.tipo_campo}</td>

    //                     <td> 

    //                     ${element.name_archivo !== ''
    //                       ? `

    //                      <a href="#" onclick="abrir_fotos('${element.ruta_archivo}' , '${element.name_archivo}')" class="cell-detail hint--top-left" data-hint="">

    //                       <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="Documento"></span>

    //                       </a>`
    //                       : `Sin archivos`}

    //                     </td>

    //                     <td>${element.info_campo}</td>

    //                     <td>${element.usuario}</td>

    //                     <td>${element.fecha} - ${element.hora}</td>

    //                   </tr>

    //                   `,
    //           );
    //         });

    //         $('#consulta_tbservicio_estudio').html('');
    //         if (data.resultado_preestudio) {
    //           data.resultado_preestudio.forEach(function(element) {
    //             $('#consulta_tbservicio_estudio').append(
    //               ` <tr>
    //               <td>${element.nundoc_solicitud}</td>
    //               <td style="font-size:10px;">${element.nombre_cliente}</td>
    //               <td style="font-size:10px;" colspan="2"><b>Origen:</b> ${element.orige} <br> <b>Destino:</b> ${element.dest}</td>
    //               <td style="font-size:10px;">${element.peso_kg} / ${element.tipo_vehiculo}</td>
    //               <td style="font-size:10px;">${element.usuario_auditor}</td>
    //               <td style="font-size:10px;">${element.fecha} - ${element.hora}</td>
    //               +'</tr>'`,
    //             );
    //           });
    //         }
    //       } else {
    //         $('#consulta_datoupdate').append(
    //           `<tr>

    //                 <td></td>

    //                 <td></td>

    //                 <td>No hay Documentos</td>

    //                 <td></td>

    //                 <td></td>

    //                 <td></td>

    //             </tr>`,
    //         );
    //       }
    //     })
    //     .catch(error => {
    //       alert(error);
    //     });
    // }

    /* Prefiltro de nuevo recurso para actualizar */
    if (e.target.matches('#btn_listado_nuevo') || e.target.matches('#btn_listado_nuevo *')) {
      let padre = e.target.parentElement.parentElement;
      let solicitud_id = padre.querySelector('.soli_id').value;
      // d.getElementById("num_solicitud_prefiltro_nuevo").value = solicitud_id;
      let placa = padre.querySelector('.pla_id').value;
      Listar_datos_prefiltro_nuevo_recurso(solicitud_id, placa);
    }

    if (e.target.matches('#btn_modificar_pendiente') || e.target.matches('#btn_modificar_pendiente *')) {
      let padre = e.target.parentElement.parentElement;

      let placa = padre.querySelector('.pla_id').value;

      let num_solicitud = padre.querySelector('.soli_id').value;

      let conductor_id = padre.querySelector('.conductor_id').value;

      let vehiculo_id = padre.querySelector('.vehiculo_id').value;

      let observacion = padre.querySelector('.observacion').value;

      let estudio_id_c = padre.querySelector('.estudio_id_c').value;

      // let estudio_id_c = padre.querySelector(".estudio_id_c").value;

      $('#pk').val(placa);

      $('.pk').html(placa);

      $('#nestu').val(num_solicitud);

      $('.nestu').html(num_solicitud);

      $('#obss').val(observacion);

      $('#idcc').val(conductor_id);

      $('#idvv').val(vehiculo_id);

      $('#idec').val(estudio_id_c);
    }

    // if (e.target.matches('#guarde_rehabil') || e.target.matches('#guarde_rehabil *')) {
    //   var nestu = $('#nestu').val();
    //   var idco = $('#idcc').val();
    //   var idve = $('#idvv').val();
    //   var idec = $('#idec').val();
    //   var obss = $('#obss').val();

    //   data = new FormData();
    //   data.append('num_estudio', nestu);
    //   data.append('id_conductor', idco);
    //   data.append('id_vehiculo', idve);
    //   data.append('id_estudio_c', idec);
    //   data.append('observacion', obss);
    //   $.ajax({
    //     url: $('#id_url_ajax').val() + 'validacionparametros/reactivar_estudio',
    //     type: 'POST',
    //     data: data,
    //     cache: false,
    //     processData: false, // Don't process the files
    //     contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    //     dataType: 'json',
    //     success: function(data, textStatus, jqXHR) {
    //       // alert('Ok!! Registro Guardado Exitosamente!!');
    //       if (data.numero === 400) {
    //         loadingOverlay.style.display = 'none';
    //         mensaje = `
    //             <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
    //                 <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //                 <div class="message">
    //                   <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //                   <strong>Mensaje!</strong> ${data.mensaje}
    //                 </div>
    //             </div>`;
    //       } else if (data.numero == 200) {
    //         loadingOverlay.style.display = 'none';
    //         mensaje = `
    //         <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
    //             <div class="icon"><span class="mdi mdi-check-circle"></span></div>
    //             <div class="message">
    //               <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //               <strong>Mensaje!</strong> ${data.mensaje}
    //             </div>
    //         </div>`;
    //         $('#estudio_seguridad').modal('hide');
    //         listar_solicitudes_operaciones();
    //         $('#habilitar_pendiente').modal('hide');
    //         // location.reload();
    //       }
    //       d.getElementById('historico_retornar').innerHTML = mensaje;
    //     },
    //     error: function(jqXHR, textStatus, errorThrown) {
    //       console.log('no update vehiculo');
    //       console.log(jqXHR);
    //       console.log(textStatus);
    //       console.log(errorThrown);
    //     },
    //   });
    // }

    // if (e.target.matches('#btn_respuestaope') || e.target.matches('#btn_respuestaope *')) {
    //   if (window.confirm('¿Estas seguro de enviar la respuesta?')) {
    //     // Código a ejecutar si el usuario hace clic en "Aceptar"
    //     var mensaje = '';
    //     if (!$('#op_estudio').val()) {
    //       mensaje = `
    //       <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
    //           <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //           <div class="message">
    //             <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //             <strong>Mensaje!</strong> Debe diligenciar el campo <strong>Estudio</strong> para poder generar la respuesta a seguridad.
    //           </div>
    //       </div>`;
    //     }

    //     if (!$('#op_ntipo').val()) {
    //       mensaje = `
    //       <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
    //           <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //           <div class="message">
    //             <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //             <strong>Mensaje!</strong> Debe diligenciar el campo <strong>N° tipo</strong> para poder generar la respuesta a seguridad.
    //           </div>
    //       </div>`;
    //     }

    //     if (!$('#op_nestudio').val()) {
    //       mensaje = `
    //       <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
    //           <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //           <div class="message">
    //             <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //             <strong>Mensaje!</strong> Debe diligenciar el campo <strong>N° estudio</strong> para poder generar la respuesta a seguridad.
    //           </div>
    //       </div>`;
    //     }

    //     if (!$('#op_respuesta').val()) {
    //       // msg_error += "<p>Debe diligenciar el campo <strong>Respuesta</strong> para poder generar la respuesta a seguridad.</p>";
    //       mensaje = `
    //       <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
    //           <div class="icon"><span class="mdi mdi-info-outline"></span></div>
    //           <div class="message">
    //             <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //             <strong>Mensaje!</strong> Debe diligenciar el campo <strong>Respuesta</strong> para poder generar la respuesta a seguridad.
    //           </div>
    //       </div>`;
    //     }

    //     if (!mensaje) {
    //       guardar_respuesta();
    //     } else {
    //       $('#ver_lista_segu').animate({scrollTop: 0}, 600);
    //     }
    //     d.getElementById('historico_retornar').innerHTML = mensaje;
    //   } else {
    //     // Código a ejecutar si el usuario hace clic en "Cancelar"
    //     console.log('Acción confirmada.');
    //   }
    // }

    //Boton cancelar solicitud de estudio
    if (e.target.matches('#btn_cancelar') || e.target.matches('#btn_cancelar *')) {
      let padre = e.target.parentElement.parentElement;
      let tsolic = padre.querySelector('.soli_idcb').value;
      let tplaca = padre.querySelector('.pla_idcb').value;
      $('#cancela_prestudio').val(tsolic);
      $('#cancela_placa').val(tplaca);
    }

    /* Bton para listar la placa y solictud a cancelar  nombre_accion*/
    // if (e.target.matches('#btn_anular_estudio') || e.target.matches('#btn_anular_estudio *')) {
    //   let padre = e.target.parentElement.parentElement;
    //   let tsolic = padre.querySelector('.soli_id').value;
    //   let tplaca = padre.querySelector('.pla_id').value;
    //   let nombre_accion = padre.querySelector('.nombre_accion').value;
    //   let estudio_id_c = padre.querySelector('.estudio_id_c').value;
    //   let vehiculo_id = padre.querySelector('.vehiculo_id').value;
    //   let conductor_id = padre.querySelector('.conductor_id').value;
    //   $('#cancela_prestudio').val(tsolic);
    //   $('#cancela_placa').val(tplaca);
    //   $('#accion_actividad').val(nombre_accion);
    //   $('#estudioc').val(estudio_id_c);
    //   $('#vehiculo_cancelar').val(vehiculo_id);
    //   $('#coductor_cancelar').val(conductor_id);
    // }

    if (e.target.matches('#Boton_cancelacion') || e.target.matches('#Boton_cancelacion *')) {
      if (w.confirm('¿Esta seguro de cancelar o anular esta solicitud de estudio?')) {
        let accion = $('#accion_actividad').val();
        var mensaje = '';
        if (accion === 'Estudio de Seguridad') {
          if (!$('#cancela_motivo').val()) {
            mensaje = `
                <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> Debe diligenciar el campo <strong>Motivo</strong> para poder generar la cancelación.
                </div>`;
          }

          if (!$('#cancela_nota').val()) {
            mensaje = `
                <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> Debe diligenciar el campo <strong>Nota</strong> para poder generar la cancelación.
                </div>`;
          }
          if (!mensaje) {
            registrar_cancelacion();
          } else {
            $('#nexos_messages_popup_cancel').html(
              '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
                mensaje +
                '</div></div>',
            );
            $('#cancelar_estudio').animate({scrollTop: 0}, 600);
          }
        } else {
          if (!$('#cancela_motivo').val()) {
            mensaje = `
                <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> Debe diligenciar el campo <strong>Motivo</strong> para poder generar la cancelación.
                </div>`;
          }

          if (!$('#cancela_nota').val()) {
            mensaje = `
                <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> Debe diligenciar el campo <strong>Nota</strong> para poder generar la cancelación.
                </div>`;
          }

          if (!mensaje) {
            registrar_cancelacion();
          } else {
            $('#nexos_messages_popup_cancel').html(
              '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
                mensaje +
                '</div></div>',
            );
            $('#cancelar_estudio').animate({scrollTop: 0}, 600);
          }
        }
      } else {
        console.log('operacion cancelada');
      }
    }
  });
});

// function abrir_fotos(url, name) {
//   // URL de la página que deseas abrir en la nueva ventana
//   var url = $('#id_url_ajax').val() + url + name;
//   // Opciones de la ventana emergente (ancho, alto, opciones adicionales)
//   var ventanaAncho = 1000;
//   var ventanaAlto = 1000;
//   // Calcula las coordenadas para centrar la ventana
//   var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
//   var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
//   // Opciones de la ventana emergente (ancho, alto, posición)
//   var opcionesVentana = 'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
//   // Utiliza window.open para abrir la nueva ventana
//   window.open(url, name, opcionesVentana);
// }

// async function guardar_respuesta() {
//   // var urlm = $('#id_url_ajax').val() + 'libs/preestudio_ajax.php';
//   $('#loading-overlay-nexosapp').css('display', 'block');
//   var datos = null;
//   datos = new FormData();
//   var archivo = document.getElementById('op_archivo').files[0];
//   datos.append('op_archivo', archivo);
//   var nestudio = $('#op_nestudio').val();
//   var estudio = $('#op_estudio').val();
//   var ntipo = $('#op_ntipo').val();
//   var rta = $('#op_respuesta').val();
//   var nom = $('#op_nomarchivo').val();

//   datos.append('accion', 'registrar_respuesta_operacion');
//   datos.append('nestudio', nestudio);
//   datos.append('ntipo', ntipo);
//   datos.append('rta', rta);
//   datos.append('nomarchivo', nom);
//   datos.append('estudio', estudio);

//   try {
//     const response = await fetch($('#id_url_ajax').val() + 'libs/preestudio_ajax.php', {
//       method: 'POST',
//       body: datos,
//       headers: {
//         'X-Requested-With': 'XMLHttpRequest', // Agregar este encabezado
//       },
//       cache: 'no-cache',
//       // dataType: 'json',
//     });
//     const data = await response.json();
//     // alert("Ok!! Registro Guardado Exitosamente!!");
//     let mensaje = '';
//     if (data) {
//       mensaje = `
//           <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
//               <div class="icon"><span class="mdi mdi-info-outline"></span></div>
//               <div class="message">
//                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
//                 <strong>Mensaje!</strong> Respuesta Guardada Exitosamente!.
//               </div>
//           </div>`;
//       d.getElementById('mensaje_respuesta').innerHTML = mensaje;
//       tb_respuestas_op();
//       push(nestudio, estudio, ntipo, rta);
//     } else {
//       mensaje = `
//           <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
//               <div class="icon"><span class="mdi mdi-info-outline"></span></div>
//               <div class="message">
//                 <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
//                 <strong>Mensaje!</strong> Respuesta no guardada.
//               </div>
//           </div>`;
//       d.getElementById('mensaje_respuesta').innerHTML = mensaje;
//     }
//   } catch (error) {
//     console.error('Error en la primera solicitud:', error);
//     throw error;
//   } finally {
//     $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
//     // Actualiza_Dato_Oet(true);
//   }
// }

// function tb_respuestas_op() {
//   var idstu = $('#op_nestudio').val();
//   var dato = {
//     idestudio: idstu,
//     // action: 'consultar_respuesta_operaciones'
//   };
//   $('#tbr_opera').html('');
//   $.ajax({
//     url: $('#id_url_ajax').val() + 'validacionparametros/consultar_respuesta_operaciones',
//     type: 'POST',
//     data: dato,
//     dataType: 'json',
//     success: function(data) {
//       $('#tbr_opera').html('');
//       if (data !== null) {
//         data.respuesta_operaciones.forEach(function(element, index) {
//           var doc = '';
//           if (element.nom_archivo != null && element.nom_archivo != '') {
//             doc = `<a href="Javascript:void(0);" class="cell-deta" onclick="abrir_fotos('${element.archivo}' , '${element.nom_archivo}')" il hint--top-left" data-hint="">
//                   <span class="icon mdi mdi-file-text data-toggle="modal" title="Documento"></span>
//               </a>`;
//           } else {
//             doc = '<label>Sin archivo</label>';
//           }

//           $('#tbr_opera').append(
//             '<tr>' + '<td>' + element.estudio_letra + '</td>' + '<td>' + element.fecha + '</td>' + '<td>' + element.hora + '</td>' + '<td>' + element.nota + '</td>' + '<td>' + doc + '</td></tr>',
//           );
//         });
//       } else {
//         $('#tbr_opera').append('<tr>' + '<td colspan="5" style="text-align: center;" ><b>Sin respuesta de operaciones</b></td>' + '</tr>');
//       }
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       console.log('error tabla operaciones respuestas');
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

// async function Hojas_de_vida(placas, conductor, propietario, tenedor, propietario_trailer, trailer) { // Pasar
//   //validar placa
//   var fila = '';
//   //VALIDAR ESTUDIO DE SEGURIDAD
//   $('#cuerpo_valida').html('');
//   return new Promise(resolve => {
//     setTimeout(() => {
//       let data = new FormData();
//       data.append('placa', placas);
//       data.append('conductor', conductor);
//       data.append('propietario', propietario);
//       data.append('tenedor', tenedor);
//       data.append('propietario_trailer', propietario_trailer);
//       data.append('trailer', trailer);

//       fetch($('#id_url_ajax').val() + 'validacionparametros/Estados_preestudio', {
//         method: 'POST',
//         cache: 'no-cache',
//         body: data,
//       })
//         .then(response => response.json())
//         .then(function(data) {
//           $('#cuerpo_valida').html('');

//           if (
//             propietario === tenedor &&
//             propietario === conductor &&
//             tenedor === conductor &&
//             tenedor === propietario &&
//             conductor === tenedor &&
//             conductor === propietario &&
//             propietario_trailer === conductor &&
//             propietario_trailer === tenedor &&
//             propietario_trailer === propietario
//           ) {
//             if (data.respuesta_vehiculo === false) {
//               fila = `
//               <tr>
//                 <td class="text-center">Vehículo</td>
//                 <td class="text-center">NO</td>
//                 <td class="text-center"><p>No existe una hoja de vida vehícular creada con esta placa</p></td>
//                 <td class="text-center"></td>  
//               </tr>
//               `;
//               $('#vehiculo').val(0);
//               $('#cuerpo_valida').append(fila);
//             } else {
//               fila = `
//                   <tr class="success">
//                     <td class="text-center">Vehículo</td>
//                     <td class="text-center">SI</td> 
//                     <td class="text-center"><p>Existe una hoja de vida vehícular creada con esta placa</p></td>
//                     <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                   </tr>
//               `;
//               $('#vehiculo').val(1);
//               $('#cuerpo_valida').append(fila);
//             }

//             if (data.respuesta_conductor === false && data.respuesta_propietario === false && data.respuesta_tenedor === false && data.respuesta_propietario_trailer === false) {
//               fila = `
//               <tr>
//                 <td class="text-center">Terceros</td>
//                 <td class="text-center">NO</td>
//                 <td class="text-center">NO existen terceros creados con este documento</td>
//                 <td class="text-center"> </td>
//               </tr> `;
//               $('#terceros').val(0);
//               $('#cuerpo_valida').append(fila);
//             } else {
//               fila = `
//               <tr class="success">
//                 <td class="text-center">Terceros</td>
//                 <td class="text-center">SI</td>
//                 <td class="text-center">Si existen terceros creados con este documento</td>
//                 <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//               </tr> `;
//               $('#terceros').val(1);
//               $('#cuerpo_valida').append(fila);
//             }
//           } else {
//             // VALIDACIONES DE LOS TERCEROS DIFERENTES SEGUN EL ROL
//             if (propietario === tenedor) {
//               if (propietario_trailer === '') {
//                 //Terceros propiestario y poseedor
//                 if (data.respuesta_propietario === false && data.respuesta_tenedor === false) {
//                   //no hay nada
//                   fila = `
//                   <tr>
//                     <td class="text-center">Propietario<br>Poseedor</td>
//                     <td class="text-center">NO</td>
//                     <td class="text-center">NO existen terceros creados con este documento</td>
//                     <td class="text-center"></td>
//                   </tr> `;
//                   $('#propi_tene').val(0);
//                   $('#cuerpo_valida').append(fila);
//                 } else {
//                   fila = `
//                   <tr class="success">
//                     <td class="text-center">Propietario<br>Poseedor</td>
//                     <td class="text-center">SI</td>
//                     <td class="text-center">S existen terceros creados con este documento</td>
//                     <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                   </tr> `;
//                   $('#propi_tene').val(1);
//                   $('#cuerpo_valida').append(fila);
//                 }
//                 if (data.respuesta_conductor === false) {
//                   //no hay conductor cread
//                   fila = `
//                     <tr>
//                       <td class="text-center">Conductor</td>
//                       <td class="text-center">NO</td>
//                       <td class="text-center">NO existe un conductor creado con este documento</td>
//                       <td class="text-center"></td>
//                     </tr> `;
//                   $('#conductor').val(0);
//                   $('#cuerpo_valida').append(fila);
//                 } else {
//                   fila = `
//                     <tr class="success">
//                       <td class="text-center">Conductor</td>
//                       <td class="text-center">SI</td>
//                       <td class="text-center">Existe un conductor creado con este documento</td>
//                       <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                     </tr>
//                 `;
//                   $('#conductor').val(1);
//                   $('#cuerpo_valida').append(fila);
//                 }
//                 if (data.respuesta_vehiculo === false) {
//                   //no hay nada
//                   fila = `
//                     <tr>
//                       <td class="text-center">Vehículo</td>
//                       <td class="text-center">NO</td>
//                       <td class="text-center"><p>No existe una hoja de vida vehícular creada con esta placa</p></td>
//                       <td class="text-center"></td>
//                     </tr>
//                   `;
//                   $('#vehiculo').val(0);
//                   $('#cuerpo_valida').append(fila);
//                 } else {
//                   fila = `
//                     <tr class="success">
//                       <td class="text-center">Vehículo</td>
//                       <td class="text-center">SI</td>
//                       <td class="text-center"><p>Existe una hoja de vida vehícular creada con esta placa</p></td>
//                       <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                     </tr>
//                 `;
//                   $('#vehiculo').val(1);
//                   $('#cuerpo_valida').append(fila);
//                 }
//               } else {
//                 if (propietario === tenedor && tenedor === propietario_trailer) {
//                   if (data.respuesta_propietario === false && data.respuesta_tenedor === false && data.respuesta_propietario_trailer === false) {
//                     fila = `
//                       <tr>
//                         <td class="text-center">Propietario<br>Tenedor<br>Propietario Trailer</td>
//                         <td class="text-center">NO</td>
//                         <td class="text-center">No existen terceros creados con este documento</td>
//                         <td class="text-center"></td>
//                       </tr>
//                     `;
//                     $('#prop_pose_propit').val(0);
//                     $('#cuerpo_valida').append(fila);
//                   } else {
//                     fila = `
//                       <tr class="success">
//                         <td class="text-center">Propietario<br>Tenedor<br>Propietario Trailer</td>
//                         <td class="text-center">SI</td>
//                         <td class="text-center">Si existen terceros creados con este documento</td>
//                         <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                       </tr>
//                     `;
//                     $('#prop_pose_propit').val(1);
//                     $('#cuerpo_valida').append(fila);
//                   }
//                   if (data.respuesta_conductor === false) {
//                     fila = `
//                       <tr>
//                         <td class="text-center">Conductor</td>
//                         <td class="text-center">NO</td>
//                         <td class="text-center">NO existe un conductor creado con este documento</td>
//                         <td class="text-center"></td>
//                       </tr>
//                     `;
//                     $('#conductor').val(0);
//                     $('#cuerpo_valida').append(fila);
//                   } else {
//                     fila = `
//                       <tr class="success">
//                         <td class="text-center">Conductor</td>
//                         <td class="text-center">SI</td>
//                         <td class="text-center">Existe un conductor creado con este documento</td>
//                         <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                       </tr>
//                     `;
//                     $('#conductor').val(1);
//                     $('#cuerpo_valida').append(fila);
//                   }

//                   if (data.respuesta_trailer === false) {
//                     //no hay nada
//                     fila = `
//                       <tr>
//                         <td class="text-center">Trailer</td>
//                         <td class="text-center">NO</td>
//                         <td class="text-center"><p>No existe una hoja de vida del trailer creada con esta placa</p></td>
//                         <td class="text-center"></td>  
//                       </tr>
//                   `;

//                     $('#trailer').val(0);
//                     $('#cuerpo_valida').append(fila);
//                   } else {
//                     fila = `
//                       <tr class="success">
//                         <td class="text-center">Trailer</td>
//                         <td class="text-center">SI</td> 
//                         <td class="text-center"><p>Existe una hoja de vida del trailer creada con esta placa</p></td>
//                         <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                       </tr>
//                   `;

//                     $('#trailer').val(1);
//                     $('#cuerpo_valida').append(fila);
//                   }

//                   if (data.respuesta_vehiculo === false) {
//                     fila = `
//                       <tr>
//                         <td class="text-center">Vehículo</td>
//                         <td class="text-center">NO</td>
//                         <td class="text-center"><p>No existe una hoja de vida vehicular creada con esta placa</p></td>
//                         <td class="text-center"></td>
//                       </tr>
//                     `;
//                     $('#vehiculo').val(0);
//                     $('#cuerpo_valida').append(fila);
//                   } else {
//                     fila = `
//                       <tr class="success">
//                         <td class="text-center">Vehículo</td>
//                         <td class="text-center">SI</td>
//                         <td class="text-center"><p>Existe una hoja de vida vehicular creada con esta placa</p></td>
//                         <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                       </tr>
//                     `;
//                     $('#vehiculo').val(1);
//                     $('#cuerpo_valida').append(fila);
//                   }
//                 } else {
//                   console.log('Las condiciones no se cumplen.');
//                 }
//               }
//             } else {
//               //Terceros Coductor y Propietario
//               if (conductor === propietario) {
//                 if (data.respuesta_vehiculo === false) {
//                   //no hay nada
//                   fila = `
//                     <tr>
//                       <td class="text-center">Vehículo</td>
//                       <td class="text-center">NO</td>
//                       <td class="text-center"><p>No existe una hoja de vida vehícular creada con esta placa</p></td>
//                       <td class="text-center"></td>  
//                     </tr>
//                   `;

//                   $('#vehiculo').val(0);
//                   $('#cuerpo_valida').append(fila);
//                 } else {
//                   fila = `
//                     <tr class="success">
//                       <td class="text-center">Vehículo</td>
//                       <td class="text-center">SI</td> 
//                       <td class="text-center"><p>Existe una hoja de vida vehícular creada con esta placa</p></td>
//                       <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                     </tr>
//                 `;

//                   $('#vehiculo').val(1);
//                   $('#cuerpo_valida').append(fila);
//                 }

//                 if (data.respuesta_conductor === false && data.respuesta_propietario === false) {
//                   //no hay nada
//                   fila = `
//                   <tr>
//                     <td class="text-center">Conductor<br>Propietario</td>
//                     <td class="text-center">NO</td>
//                     <td class="text-center">NO existen terceros creados con este documento</td>
//                     <td class="text-center"></td>
//                   </tr> `;

//                   $('#propi_cond').val(0);
//                   $('#cuerpo_valida').append(fila);
//                 } else {
//                   //no hay nada
//                   fila = `
//                     <tr class="success">
//                       <td class="text-center">Propietario<br>Poseedor</td>
//                       <td class="text-center">SI</td>
//                       <td class="text-center">S existen terceros creados con este documento</td>
//                       <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                     </tr> `;

//                   $('#propi_cond').val(1);
//                   $('#cuerpo_valida').append(fila);
//                 }

//                 if (data.respuesta_tenedor === false) {
//                   //no hay Tenedor creado
//                   fila = `
//                     <tr>
//                       <td class="text-center">Tenedor</td>
//                       <td class="text-center">NO</td>
//                       <td class="text-center"><p>NO existe un tenedor creado con este documento</p></td>
//                       <td class="text-center"> </td>
//                     </tr>
//                   `;

//                   $('#tenedor').val(0);
//                   $('#cuerpo_valida').append(fila);
//                 } else {
//                   fila = `
//                     <tr class="success">
//                       <td class="text-center>Tenedor</td>
//                       <td class="text-center>SI</td> 
//                       <td class="text-center><p>Existe un tenedor creado con este documento</p></td>
//                       <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                     </tr>
//                 `;

//                   $('#tenedor').val(1);
//                   $('#cuerpo_valida').append(fila);
//                 }
//               } else {
//                 // Conductor y poseedor
//                 if (conductor === tenedor) {
//                   if (data.respuesta_vehiculo === false) {
//                     //no hay nada
//                     fila = `
//                       <tr>
//                         <td class="text-center">Vehículo</td>
//                         <td class="text-center">NO</td>
//                         <td class="text-center"><p>No existe una hoja de vida vehícular creada con esta placa</p></td>
//                         <td class="text-center"></td>  
//                       </tr>
//                   `;

//                     $('#vehiculo').val(0);
//                     $('#cuerpo_valida').append(fila);
//                   } else {
//                     fila = `
//                       <tr class="success">
//                         <td class="text-center">Vehículo</td>
//                         <td class="text-center">SI</td> 
//                         <td class="text-center"><p>Existe una hoja de vida vehícular creada con esta placa</p></td>
//                         <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                       </tr>
//                   `;

//                     $('#vehiculo').val(1);
//                     $('#cuerpo_valida').append(fila);
//                   }

//                   if (data.respuesta_conductor === false && data.respuesta_tenedor === false) {
//                     fila = `
//                       <tr>
//                         <td class="text-center">Conductor<br>Poseedor</td>
//                         <td class="text-center">NO</td>
//                         <td class="text-center">NO existen terceros creados con este documento</td>
//                         <td class="text-center"></td>
//                       </tr> 
//                     `;

//                     $('#propi_posee').val(0);
//                     $('#cuerpo_valida').append(fila);
//                   } else {
//                     fila = `
//                       <tr class="success">
//                         <td class="text-center">Propietario<br>Poseedor</td>
//                         <td class="text-center">SI</td>
//                         <td class="text-center">S existen terceros creados con este documento</td>
//                         <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                       </tr> 
//                     `;

//                     $('#propi_posee').val(1);
//                     $('#cuerpo_valida').append(fila);
//                   }

//                   if (data.respuesta_propietario === false) {
//                     //no hay propietario creado
//                     fila = `
//                     <tr>
//                       <td  class="text-center">Propietario</td>
//                       <td  class="text-center">NO</td>
//                       <td  class="text-center"><p>NO existe un propietario creado con este documento</p></td>
//                       <td class="text-center"></td>
//                     </tr>
//                     `;

//                     $('#propietario').val(0);
//                     $('#cuerpo_valida').append(fila);
//                   } else {
//                     fila = `
//                     <tr class="success">
//                       <td class="text-center">Propietario</td>
//                       <td class="text-center">SI</td>
//                       <td class="text-center"><p>Existe un propietario creado con este documento</p></td>
//                       <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                     </tr>
//                   `;

//                     $('#propietario').val(1);
//                     $('#cuerpo_valida').append(fila);
//                   }
//                 } else {
//                   /* Propietario de trailer y sus convinaciones */
//                   if (propietario === propietario_trailer) {
//                     if (data.respuesta_propietario === false && data.respuesta_propietario_trailer === false) {
//                       fila = `
//                       <tr>
//                         <td class="text-center">Propietario<br>Propietario Trailer</td>
//                         <td class="text-center">NO</td>
//                         <td class="text-center">NO existen terceros creados con este documento</td>
//                         <td class="text-center"></td>
//                       </tr> 
//                     `;
//                       $('#propi_propit').val(0);
//                       $('#cuerpo_valida').append(fila);
//                     } else {
//                       fila = `
//                       <tr class="success">
//                         <td class="text-center">Propietario<br>Propietario Trailer</td>
//                         <td class="text-center">SI</td>
//                         <td class="text-center">Si existen terceros creados con este documento</td>
//                         <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                       </tr> 
//                     `;

//                       $('#propi_propit').val(1);
//                       $('#cuerpo_valida').append(fila);
//                     }

//                     if (data.respuesta_tenedor === false) {
//                       //no hay Tenedor creado
//                       fila = `
//                         <tr>
//                           <td class="text-center">Tenedor</td>
//                           <td class="text-center">NO</td>
//                           <td class="text-center"><p>NO existe un tenedor creado con este documento</p></td>
//                           <td class="text-center"> </td>
//                         </tr>
//                       `;

//                       $('#tenedor').val(0);
//                       $('#cuerpo_valida').append(fila);
//                     } else {
//                       fila = `
//                         <tr class="success">
//                           <td class="text-center>Tenedor</td>
//                           <td class="text-center>SI</td> 
//                           <td class="text-center><p>Existe un tenedor creado con este documento</p></td>
//                           <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                         </tr>
//                     `;

//                       $('#tenedor').val(1);
//                       $('#cuerpo_valida').append(fila);
//                     }

//                     if (data.respuesta_conductor === false) {
//                       //no hay conductor cread
//                       fila = `
//                         <tr>
//                           <td class="text-center">Conductor</td>
//                           <td class="text-center">NO</td>
//                           <td class="text-center">NO existe un conductor creado con este documento</td>
//                           <td class="text-center"></td>
//                         </tr> `;
//                       $('#conductor').val(0);
//                       $('#cuerpo_valida').append(fila);
//                     } else {
//                       fila = `
//                         <tr class="success">
//                           <td class="text-center">Conductor</td>
//                           <td class="text-center">SI</td>
//                           <td class="text-center">Existe un conductor creado con este documento</td>
//                           <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                         </tr>
//                     `;
//                       $('#conductor').val(1);
//                       $('#cuerpo_valida').append(fila);
//                     }

//                     if (data.respuesta_trailer === false) {
//                       //no hay nada
//                       fila = `
//                         <tr>
//                           <td class="text-center">Trailer</td>
//                           <td class="text-center">NO</td>
//                           <td class="text-center"><p>No existe una hoja de vida del trailer creada con esta placa</p></td>
//                           <td class="text-center"></td>  
//                         </tr>
//                     `;

//                       $('#trailer').val(0);
//                       $('#cuerpo_valida').append(fila);
//                     } else {
//                       fila = `
//                         <tr class="success">
//                           <td class="text-center">Trailer</td>
//                           <td class="text-center">SI</td> 
//                           <td class="text-center"><p>Existe una hoja de vida del trailer creada con esta placa</p></td>
//                           <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                         </tr>
//                     `;

//                       $('#trailer').val(1);
//                       $('#cuerpo_valida').append(fila);
//                     }

//                     if (data.respuesta_vehiculo === false) {
//                       //no hay nada
//                       fila = `
//                         <tr>
//                           <td class="text-center">Vehículo</td>
//                           <td class="text-center">NO</td>
//                           <td class="text-center"><p>No existe una hoja de vida vehícular creada con esta placa</p></td>
//                           <td class="text-center"></td>  
//                         </tr>
//                     `;

//                       $('#vehiculo').val(0);
//                       $('#cuerpo_valida').append(fila);
//                     } else {
//                       fila = `
//                         <tr class="success">
//                           <td class="text-center">Vehículo</td>
//                           <td class="text-center">SI</td> 
//                           <td class="text-center"><p>Existe una hoja de vida vehícular creada con esta placa</p></td>
//                           <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                         </tr>
//                     `;

//                       $('#vehiculo').val(1);
//                       $('#cuerpo_valida').append(fila);
//                     }
//                   } else {
//                     /* Tenedor igual al propietario del trailer */
//                     if (tenedor === propietario_trailer) {
//                       if (data.respuesta_tenedor === false && data.respuesta_propietario_trailer === false) {
//                         fila = `
//                           <tr>
//                             <td class="text-center">Tenedor<br>Propietario Trailer</td>
//                             <td class="text-center">NO</td>
//                             <td class="text-center">No existen terceros creados con este documento</td>
//                             <td class="text-center"></td>
//                           </tr> 
//                         `;
//                         $('#tenedor_propit').val(0);
//                         $('#cuerpo_valida').append(fila);
//                       } else {
//                         fila = `
//                         <tr class="success">
//                           <td class="text-center">Tnedor<br>Propietario Trailer</td>
//                           <td class="text-center">SI</td>
//                           <td class="text-center">Si existen terceros creados con este documento</td>
//                           <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                         </tr> 
//                       `;
//                         $('#tenedor_propit').val(1);
//                         $('#cuerpo_valida').append(fila);
//                       }

//                       if (data.respuesta_propietario === false) {
//                         //no hay propietario creado
//                         fila = `
//                         <tr>
//                           <td class="text-center">Propietario</td>
//                           <td class="text-center">NO</td>
//                           <td class="text-center"><p>NO existe un propietario creado con este documento</p></td>
//                           <td class="text-center"></td>
//                         </tr>
//                         `;

//                         $('#propietario').val(0);
//                         $('#cuerpo_valida').append(fila);
//                       } else {
//                         fila = `
//                         <tr class="success">
//                           <td class="text-center">Propietario</td>
//                           <td class="text-center">SI</td>
//                           <td class="text-center"><p>Existe un propietario creado con este documento</p></td>
//                           <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                         </tr>
//                       `;

//                         $('#propietario').val(1);
//                         $('#cuerpo_valida').append(fila);
//                       }

//                       if (data.respuesta_conductor === false) {
//                         //no hay conductor cread
//                         fila = `
//                           <tr>
//                             <td class="text-center">Conductor</td>
//                             <td class="text-center">NO</td>
//                             <td class="text-center">NO existe un conductor creado con este documento</td>
//                             <td class="text-center"></td>
//                           </tr> `;
//                         $('#conductor').val(0);
//                         $('#cuerpo_valida').append(fila);
//                       } else {
//                         fila = `
//                           <tr class="success">
//                             <td class="text-center">Conductor</td>
//                             <td class="text-center">SI</td>
//                             <td class="text-center">Existe un conductor creado con este documento</td>
//                             <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                           </tr>
//                       `;
//                         $('#conductor').val(1);
//                         $('#cuerpo_valida').append(fila);
//                       }

//                       if (data.respuesta_trailer === false) {
//                         //no hay nada
//                         fila = `
//                           <tr>
//                             <td class="text-center">Trailer</td>
//                             <td class="text-center">NO</td>
//                             <td class="text-center"><p>No existe una hoja de vida del trailer creada con esta placa</p></td>
//                             <td class="text-center"></td>  
//                           </tr>
//                       `;

//                         $('#trailer').val(0);
//                         $('#cuerpo_valida').append(fila);
//                       } else {
//                         fila = `
//                           <tr class="success">
//                             <td class="text-center">Trailer</td>
//                             <td class="text-center">SI</td> 
//                             <td class="text-center"><p>Existe una hoja de vida del trailer creada con esta placa</p></td>
//                             <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                           </tr>
//                       `;

//                         $('#trailer').val(1);
//                         $('#cuerpo_valida').append(fila);
//                       }

//                       if (data.respuesta_vehiculo === false) {
//                         fila = `
//                           <tr>
//                             <td class="text-center">Vehículo</td>
//                             <td class="text-center">NO</td>
//                             <td class="text-center"><p>No existe una hoja de vida vehícular creada con esta placa</p></td>
//                             <td class="text-center"></td>  
//                           </tr>
//                         `;

//                         $('#vehiculo').val(0);
//                         $('#cuerpo_valida').append(fila);
//                       } else {
//                         fila = `
//                           <tr class="success">
//                             <td class="text-center">Vehículo</td>
//                             <td class="text-center">SI</td> 
//                             <td class="text-center"><p>Existe una hoja de vida vehícular creada con esta placa</p></td>
//                             <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                           </tr>
//                       `;

//                         $('#vehiculo').val(1);
//                         $('#cuerpo_valida').append(fila);
//                       }
//                     } else {
//                       /* Conductor Propietario Trailer */
//                       if (conductor === propietario_trailer) {
//                         if (data.respuesta_conductor === false && data.respuesta_propietario_trailer === false) {
//                           fila = `
//                             <tr>
//                               <td class="text-center">Conductor<br>Propietario Trailer</td>
//                               <td class="text-center">NO</td>
//                               <td class="text-center">No existen terceros creados con este documento</td>
//                               <td class="text-center"></td>
//                             </tr> 
//                           `;
//                           $('#conductor_propit').val(0);
//                           $('#cuerpo_valida').append(fila);
//                         } else {
//                           fila = `
//                           <tr class="success">
//                             <td class="text-center">Conductor<br>Propietario Trailer</td>
//                             <td class="text-center">SI</td>
//                             <td class="text-center">Si existen terceros creados con este documento</td>
//                             <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                           </tr>
//                           `;
//                           $('#conductor_propit').val(1);
//                           $('#cuerpo_valida').append(fila);
//                         }

//                         if (data.respuesta_propietario === false) {
//                           //no hay propietario creado
//                           fila = `
//                           <tr>
//                             <td class="text-center">Propietario</td>
//                             <td class="text-center">NO</td>
//                             <td class="text-center"><p>NO existe un propietario creado con este documento</p></td>
//                             <td class="text-center"></td>
//                           </tr>
//                           `;

//                           $('#propietario').val(0);
//                           $('#cuerpo_valida').append(fila);
//                         } else {
//                           fila = `
//                           <tr class="success">
//                             <td class="text-center">Propietario</td>
//                             <td class="text-center">SI</td>
//                             <td class="text-center"><p>Existe un propietario creado con este documento</p></td>
//                             <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                           </tr>
//                         `;

//                           $('#propietario').val(1);
//                           $('#cuerpo_valida').append(fila);
//                         }

//                         if (data.respuesta_tenedor === false) {
//                           //no hay Tenedor creado
//                           fila = `
//                             <tr>
//                               <td class="text-center">Tenedor</td>
//                               <td class="text-center">NO</td>
//                               <td class="text-center"><p>NO existe un tenedor creado con este documento</p></td>
//                               <td class="text-center"> </td>
//                             </tr>
//                           `;

//                           $('#tenedor').val(0);
//                           $('#cuerpo_valida').append(fila);
//                         } else {
//                           fila = `
//                             <tr class="success">
//                               <td class="text-center>Tenedor</td>
//                               <td class="text-center>SI</td> 
//                               <td class="text-center><p>Existe un tenedor creado con este documento</p></td>
//                               <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                             </tr>
//                         `;

//                           $('#tenedor').val(1);
//                           $('#cuerpo_valida').append(fila);
//                         }

//                         if (data.respuesta_trailer === false) {
//                           //no hay nada
//                           fila = `
//                             <tr>
//                               <td class="text-center">Trailer</td>
//                               <td class="text-center">NO</td>
//                               <td class="text-center"><p>No existe una hoja de vida del trailer creada con esta placa</p></td>
//                               <td class="text-center"></td>  
//                             </tr>
//                         `;

//                           $('#trailer').val(0);
//                           $('#cuerpo_valida').append(fila);
//                         } else {
//                           fila = `
//                             <tr class="success">
//                               <td class="text-center">Trailer</td>
//                               <td class="text-center">SI</td> 
//                               <td class="text-center"><p>Existe una hoja de vida del trailer creada con esta placa</p></td>
//                               <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                             </tr>
//                         `;

//                           $('#trailer').val(1);
//                           $('#cuerpo_valida').append(fila);
//                         }

//                         if (data.respuesta_vehiculo === false) {
//                           fila = `
//                             <tr>
//                               <td class="text-center">Vehículo</td>
//                               <td class="text-center">NO</td>
//                               <td class="text-center"><p>No existe una hoja de vida vehícular creada con esta placa</p></td>
//                               <td class="text-center"></td>  
//                             </tr>
//                           `;

//                           $('#vehiculo').val(0);
//                           $('#cuerpo_valida').append(fila);
//                         } else {
//                           fila = `
//                             <tr class="success">
//                               <td class="text-center">Vehículo</td>
//                               <td class="text-center">SI</td> 
//                               <td class="text-center"><p>Existe una hoja de vida vehícular creada con esta placa</p></td>
//                               <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                             </tr>
//                         `;

//                           $('#vehiculo').val(1);
//                           $('#cuerpo_valida').append(fila);
//                         }
//                       } else {
//                         /* Este es el ulyimo codigo a colocar en el else de la ultima convinación */
//                         // Todos independientes
//                         if (data.respuesta_propietario === false) {
//                           //no hay propietario creado
//                           fila = `
//                             <tr>
//                               <td  class="text-center">Propietario</td>
//                               <td  class="text-center">NO</td>
//                               <td  class="text-center"><p>NO existe un propietario creado con este documento</p></td>
//                               <td class="text-center"></td>
//                             </tr>
//                           `;
//                           $('#propietario').val(0);
//                           $('#cuerpo_valida').append(fila);
//                         } else {
//                           fila = `
//                           <tr class="success">
//                             <td class="text-center">Propietario</td>
//                             <td class="text-center">SI</td>
//                             <td class="text-center"><p>Existe un propietario creado con este documento</p></td>
//                             <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                           </tr>
//                         `;
//                           $('#propietario').val(1);
//                           $('#cuerpo_valida').append(fila);
//                         }

//                         if (data.respuesta_tenedor === false) {
//                           //no hay Tenedor creado
//                           fila = `
//                             <tr>
//                               <td class="text-center">Tenedor</td>
//                               <td class="text-center">NO</td>
//                               <td class="text-center"><p>NO existe un tenedor creado con este documento</p></td>
//                               <td class="text-center"> </td>
//                             </tr>
//                           `;
//                           $('#tenedor').val(0);
//                           $('#cuerpo_valida').append(fila);
//                         } else {
//                           fila = `
//                             <tr class="success">
//                               <td class="text-center">Tenedor</td>
//                               <td class="text-center">SI</td>
//                               <td class="text-center"><p>Existe un tenedor creado con este documento</p></td>
//                               <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                             </tr>
//                           `;
//                           $('#tenedor').val(1);
//                           $('#cuerpo_valida').append(fila);
//                         }

//                         if (data.respuesta_conductor === false) {
//                           //no hay conductor cread
//                           fila = `
//                             <tr>
//                               <td class="text-center">Conductor</td>
//                               <td class="text-center">NO</td>
//                               <td class="text-center">NO existe un conductor creado con este documento</td>
//                               <td class="text-center"></td>
//                             </tr>
//                           `;
//                           $('#conductor').val(0);
//                           $('#cuerpo_valida').append(fila);
//                         } else {
//                           fila = `
//                         <tr class="success">
//                           <td class="text-center">Conductor</td>
//                           <td class="text-center">SI</td>
//                           <td class="text-center">Existe un conductor creado con este documento</td>
//                           <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                         </tr>
//                         `;
//                           $('#conductor').val(1);
//                           $('#cuerpo_valida').append(fila);
//                         }

//                         if (data.respuesta_propietario_trailer === false) {
//                           //no hay conductor cread
//                           fila = `
//                             <tr>
//                               <td class="text-center">Propietario Trailer</td>
//                               <td class="text-center">NO</td>
//                               <td class="text-center">NO existe un Propietario Trailer creado con este documento</td>
//                               <td class="text-center"></td>
//                             </tr>
//                           `;
//                           $('#propietario_trailer').val(0);
//                           $('#cuerpo_valida').append(fila);
//                         } else {
//                           fila = `
//                         <tr class="success">
//                           <td class="text-center">Propietario Trailer</td>
//                           <td class="text-center">SI</td>
//                           <td class="text-center">Existe un Propietario Trailer creado con este documento</td>
//                           <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                         </tr>
//                         `;
//                           $('#propietario_trailer').val(1);
//                           $('#cuerpo_valida').append(fila);
//                         }

//                         if (trailer === '') {
//                           console.log('Sin trailer no se');
//                         } else {
//                           if (data.respuesta_trailer === false) {
//                             //no hay nada
//                             fila = `
//                               <tr>
//                                 <td class="text-center">Trailer</td>
//                                 <td class="text-center">NO</td>
//                                 <td class="text-center"><p>No existe una hoja de vida del trailer creada con esta placa</p></td>
//                                 <td class="text-center"></td>  
//                               </tr>
//                           `;

//                             $('#trailer').val(0);
//                             $('#cuerpo_valida').append(fila);
//                           } else {
//                             fila = `
//                               <tr class="success">
//                                 <td class="text-center">Trailer</td>
//                                 <td class="text-center">SI</td> 
//                                 <td class="text-center"><p>Existe una hoja de vida del trailer creada con esta placa</p></td>
//                                 <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                               </tr>
//                           `;

//                             $('#trailer').val(1);
//                             $('#cuerpo_valida').append(fila);
//                           }
//                         }

//                         if (data.respuesta_vehiculo === false) {
//                           //no hay nada
//                           fila = `
//                             <tr>
//                               <td class="text-center">Vehículo</td>
//                               <td class="text-center">NO</td>
//                               <td class="text-center"><p>No existe una hoja de vida vehícular creada con esta placa</p>
//                               </td>
//                               <td class="text-center"></td>
//                             </tr>
//                         `;
//                           $('#vehiculo').val(0);
//                           $('#cuerpo_valida').append(fila);
//                         } else {
//                           fila = `
//                             <tr class="success">
//                               <td class="text-center">Vehículo</td>
//                               <td class="text-center">SI</td>
//                               <td class="text-center"><p>Existe una hoja de vida vehícular creada con esta placa</p></td>
//                               <td class="text-center"><span class="mdi mdi-badge-check"></span></td>
//                             </tr>
//                         `;
//                           $('#vehiculo').val(1);
//                           $('#cuerpo_valida').append(fila);
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         })
//         .catch(error => {
//           alert(error);
//         });

//       resolve();
//     }, 5000); // Simular una petición de 2 segundos
//   });
// }

async function listar_solicitudes_operaciones() {
  try {
    let data = new FormData();
    data.append('estado', d.getElementById('cotice').value);
    data.append('fecha_inicial', d.getElementById('fecha_inicial').value);
    data.append('fecha_final', d.getElementById('fecha_final').value);

    if (d.getElementById('prefiltro_seguridad').checked) {
      data.append('prefiltro_seguridad', d.getElementById('prefiltro_seguridad').value);
    } else if (d.getElementById('estudio_seguridad_id').checked) {
      data.append('estudio_seguridad', d.getElementById('estudio_seguridad_id').value);
    }

    await fetch($('#id_url_ajax').val() + 'validacionparametros/Consultar_solicitudes_operaciones', {
      method: 'POST',

      cache: 'no-cache',

      body: data,
    })
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);

        return response.json();
      })
      .then(function(data) {
        let tbody = d.getElementById('body_esconder');

        tbody.innerHTML = '';

        if (data.length > 0) {
          data.forEach(element => {
            let solicitud = element.esoli ? element.esoli : element.id_estudio; //solicitud preestudio
            let placa = element.placa;
            let fecha = element.fecha;
            let estado = element.estado;
            let estado_actual = element.estado_actual;
            let operacion = element.operacion;
            let nombre = element.nombre;
            let apellido = element.apellido1;
            let status_e = '';
            let status_es = '';
            let status_ests = '';
            let boton_cancela = '';
            let boton_negro = '';
            let col_status = '';
            let title = '';
            let status = '';
            let tiene_estudio = '';
            let id_estudio_c = element.id_estudio_c;
            let vehiculo_id = element.vehiculo_id;
            let conductor_id = element.conductor_id;
            let itr = '';

            if (element.operacio_ejecutada === 'Estudio_de_Seguridad') {
              // if (operacion === 'Habilitar' || operacion === 'Actualizar') {
              if (operacion === 'Nuevo' || operacion === 'Habilitar' || operacion === 'Actualizar') {
                /* Validar si esta activo de la creacion de recurso nuevopara cambiar la etiqueda */
                if (operacion === 'Actualizar') {
                  if (element.estado_prefiltro === 'Pendiente' || element.estado_prefiltro === 'Iniciado' || element.estado_prefiltro === 'Rechazado' || element.estado_prefiltro === 'Aprobado') {
                    if (element.estado_creacion === 'TERCERO CREADO') {
                      col_status = '#0D47A1';
                      title = 'Recurso Creado';
                      status = "<span class='label label-success'  style='background-color:#0D47A1;'>Nuevo recurso creado</span>";
                    } else {
                      if (element.estado_prefiltro === 'Aprobado') {
                        col_status = '#14A44D';
                        title = 'Nuevo recurso Aprobado';
                        status = "<span class='label label-success'>Nuevo recurso Aprobado</span>";
                      } else if (element.estado_prefiltro === 'Pendiente') {
                        col_status = '#E4A11B';
                        title = 'Nuevo recurso Pendiente';
                        status = "<span class='label label-warning' style='color:#000;'>Nuevo recurso Pendiente</span>";
                      } else if (element.estado_prefiltro === 'Iniciado') {
                        col_status = '#0D47A1';
                        title = 'Nuevo recurso Iniciado';
                        status = "<span class='label label-danger' style='background-color:#0D47A1;'>Nuevo recurso Iniciado</span>";
                      } else if (element.estado_prefiltro === 'Rechazado') {
                        col_status = '#F44336';
                        title = 'Nuevo recurso Rechazado';
                        status = "<span class='label label-warning' style='color:#000;background-color:#F44336;'>Nuevo recurso Rechazado</span>";
                      }
                    }
                    status_es = status;
                  } else {
                    if (element.estado == 'Aprobado') {
                      col_status = '#14A44D';
                      title = 'Estudio de seguridad aprobado';
                      status = "<span class='label label-success'>Estudio Aprobado</span>";
                    } else if (element.estado == 'Pendiente') {
                      col_status = '#E4A11B';
                      title = 'Estudio de seguridad Pendiente';
                      status = "<span class='label label-warning' style='color:#000;'>Estudio Pendiente</span>";
                    } else if (element.estado == 'vencida') {
                      col_status = '#F44336';
                      title = 'Estudio de seguridad Vencido';
                      status = "<span class='label label-danger' style='background-color:#F44336;'>Estudio Vencido</span>";
                    } else if (element.estado == 'pendiente_iniciar') {
                      col_status = '#E4A11B';
                      title = 'Estudio de seguridad Pendiente por iniciar';
                      status = "<span class='label label-warning' style='color:#000;background-color:#E4A11B;'>Estudio Pendiente Iniciar</span>";
                    } else if (element.estado == 'iniciado') {
                      col_status = '#0D47A1';
                      title = 'Estudio de seguridad iniciado';
                      status = "<span class='label label-success'>Estudio Iniciado</span>";
                    } else if (element.estado == 'Rechazado') {
                      col_status = '#F44336';
                      title = 'Estudio de seguridad rechazado';
                      status = "<span class='label label-danger' style='background-color:#F44336;' >Estudio Rechazado</span>";
                    } else if (element.estado == 'cancelado') {
                      col_status = '#D50000';
                      title = 'Estudio de seguridad cancelado';
                      status = "<span class='label label-danger'>Estudio Cancelado</span>";
                    } else if (element.estado == 'Rechazado_modificar') {
                      col_status = '#F44336';
                      title = 'Estudio de seguridad rechazado para modificar';
                      status = "<span class='label label-warning' style='color:#FFF;background-color:#F44336;'>Estudio Rechazado para modificar</span>";
                    }
                    status_es = status;
                  }
                } else {
                  if (element.estado == 'Aprobado') {
                    col_status = '#14A44D';
                    title = 'Estudio de seguridad aprobado';
                    status = "<span class='label label-success'>Estudio Aprobado</span>";
                  } else if (element.estado == 'Pendiente') {
                    col_status = '#E4A11B';
                    title = 'Estudio de seguridad Pendiente';
                    status = "<span class='label label-warning' style='color:#000;'>Estudio Pendiente</span>";
                  } else if (element.estado == 'vencida') {
                    col_status = '#F44336';
                    title = 'Estudio de seguridad Vencido';
                    status = "<span class='label label-danger' style='background-color:#F44336;'>Estudio Vencido</span>";
                  } else if (element.estado == 'pendiente_iniciar') {
                    col_status = '#E4A11B';
                    title = 'Estudio de seguridad Pendiente por iniciar';
                    status = "<span class='label label-warning' style='color:#000;background-color:#E4A11B;'>Estudio Pendiente Iniciar</span>";
                  } else if (element.estado == 'iniciado') {
                    col_status = '#0D47A1';
                    title = 'Estudio de seguridad iniciado';
                    status = "<span class='label label-success'>Estudio Iniciado</span>";
                  } else if (element.estado == 'Rechazado') {
                    col_status = '#F44336';
                    title = 'Estudio de seguridad rechazado';
                    status = "<span class='label label-danger' style='background-color:#F44336;' >Estudio Rechazado</span>";
                  } else if (element.estado == 'Cancelado') {
                    col_status = '#D50000';
                    title = 'Estudio de seguridad cancelado';
                    status = "<span class='label label-danger'>Estudio Cancelado</span>";
                  } else if (element.estado == 'Rechazado_modificar') {
                    col_status = '#F44336';
                    title = 'Estudio de seguridad rechazado para modificar';
                    status = "<span class='label label-warning' style='color:#FFF;background-color:#F44336;'>Estudio Rechazado para modificar</span>";
                  }
                  status_es = status;
                }
              }
            } else {
              if (operacion === 'Nuevo') {
                if (element.estado == 'aprobado') {
                  col_status = '#14A44D';
                  title = 'Prefiltro aprobado Autoriza HV';
                  status = "<span class='label label-success'>Prefiltro Aprobado</span>";
                } else if (element.estado == 'pendiente') {
                  col_status = '#E4A11B';
                  title = 'Prefiltro Pendiente';
                  status = "<span class='label label-warning'>Prefiltro Pendiente</span>";
                } else if (element.estado == 'vencida') {
                  col_status = '#5D4037';
                  title = 'Prefiltro Vencido';
                  status = "<span class='label label-danger'>Prefiltro Vencido</span>";
                } else if (element.estado == 'pendiente_iniciar') {
                  col_status = '#332D2D';
                  title = 'Prefiltro Pendiente por iniciar';
                  status = "<span class='label label-warning'>Prefiltro Pendiente Iniciar</span>";
                } else if (element.estado == 'iniciado') {
                  col_status = '#0D47A1';
                  title = 'Prefiltro iniciado';
                  status = "<span class='label label-success'>Prefiltro Iniciado</span>";
                } else if (element.estado == 'rechazado') {
                  col_status = '#E4A11B';
                  title = 'Prefiltro rechazado';
                  status = "<span class='label label-danger'>Prefiltro Rechazado</span>";
                } else if (element.estado == 'cancelado') {
                  col_status = '#D50000';
                  title = 'Prefiltro cancelado';
                  status = "<span class='label label-danger'>Prefiltro Cancelado</span>";
                } else if (element.estado == 'rechazado para modificar') {
                  col_status = '#F44336';
                  title = 'Prefiltro rechazado para modificar';
                  status = "<span class='label label-warning'>Prefiltro Rechazado para modificar</span>";
                }
                status_e = element.campo;
                status_es = status;
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
            columnaEstado.style.color = `${col_status} `;
            columnaEstado.innerHTML = `<span class="mdi mdi-dot-circle icon" title = "${title}" ></span> `;
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
            const columnaResponsableVehiculo = d.createElement('td');
            columnaResponsableVehiculo.textContent = element.responsable_vehiculo;
            const columnaOperacion = d.createElement('td');
            columnaOperacion.textContent = element.operacion;
            const columnaEstudioseguridad = d.createElement('td');
            columnaEstudioseguridad.innerHTML = status_es;

            /* Columna de acciones */
            const columnaAcciones = d.createElement('td');
            if (element.operacion === 'Nuevo' || element.operacion === 'Habilitar' || element.operacion === 'Actualizar') {
              if (element.operacion === 'Nuevo' && element.operacio_ejecutada === 'Estudio_de_Seguridad' && element.estado_actual === 1) {
                //pendiente por iniciar
                if (element.estado === 'Rechazado_modificar' || element.estado === 'Pendiente') {
                  columnaAcciones.innerHTML = `
                  <div class="btn-group btn-space">
                    <div class="btn-group" role="group" aria-label="Basic example"> 
                        <button type="button" class="btn btn-success  btn-sm" title="Lista comprobación (Estudio Seguridad)" id="btn_listado" 
                              data-toggle="modal" data-target="#ver_lista_segu" data-id="#" data-id2="${solicitud}"  data-id3="#" ><span class="mdi mdi-collection-text"></span>
                              <input type="hidden" class="soli_id" value="${solicitud}">
                              <input type="hidden" class="pla_id" value="${placa}">
                              <input type="hidden" class="nombre" value="${nombre}">
                              <input type="hidden" class="apellido" value="${apellido}">
                              <input type="hidden" class="vehiculo_id" value="${element.vehiculo_id}"> 
                              <input type="hidden" class="conductor_id" value="${element.conductor_id}">
                        </button>

                        <button type="button" class="btn btn-warning btn-sm" title="Respuestas de operaciones (Estudio de seguridad)" id="btn_modificar_pendiente"
                            data-toggle="modal" data-target="#habilitar_pendiente" data-id="#" data-id2="${solicitud}" data-id3="#"><span class="mdi mdi-sun"></span>
                            <input type="hidden" class="soli_id" value="${solicitud}">
                            <input type="hidden" class="pla_id" value="${placa}">
                            <input type="hidden" class="nombre" value="${nombre}">
                            <input type="hidden" class="apellido" value="${apellido}">
                            <input type="hidden" class="estado_actual" value="${estado}">
                            <input type="hidden" class="conductor_id" value="${element.id_conductor}">
                            <input type="hidden" class="vehiculo_id" value="${element.id_vehiculo}">
                            <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                            <input type="hidden" class="observacion" value="${element.observacion}">
                        </button> 

                        <button type="button" class="btn btn-danger  btn-sm" title="Anular Estudio (Estudio Seguridad)" id="btn_anular_estudio" 
                          data-toggle="modal" data-target="#cancelar_estudio" data-id="#" data-id2="${solicitud}"  data-id3="#" ><i class="far fa-times-circle"></i>
                          <input type="hidden" class="soli_id" value="${solicitud}">
                          <input type="hidden" class="pla_id" value="${placa}">
                          <input type="hidden" class="nombre" value="${nombre}">
                          <input type="hidden" class="apellido" value="${apellido}">
                          <input type="hidden" class="estado_actual" value="${estado}">
                          <input type="hidden" class="estado_estudio" value="${element.estado}">
                          <input type="hidden" class="conductor_id" value="${element.id_conductor}">
                          <input type="hidden" class="conductor_num_documento" value="${element.numero_documento}">
                          <input type="hidden" class="vehiculo_id" value="${element.id_vehiculo}">
                          <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                          <input type="hidden" class="nombre_accion" value="Estudio de Seguridad">
                        </button>
                    </div>
                  </div>`;
                } else {
                  columnaAcciones.innerHTML = `
                <div class="btn-group btn-space">
                  <div class="btn-group" role="group" aria-label="Basic example"> 
                      <button type="button" class="btn btn-success  btn-sm" title="Lista comprobación (Estudio Seguridad)" id="btn_listado" 
                            data-toggle="modal" data-target="#ver_lista_segu" data-id="#" data-id2="${solicitud}"  data-id3="#" ><span class="mdi mdi-collection-text"></span>
                            <input type="hidden" class="soli_id" value="${solicitud}">
                            <input type="hidden" class="pla_id" value="${placa}">
                            <input type="hidden" class="nombre" value="${nombre}">
                            <input type="hidden" class="apellido" value="${apellido}">
                            <input type="hidden" class="vehiculo_id" value="${element.vehiculo_id}"> 
                            <input type="hidden" class="conductor_id" value="${element.conductor_id}">
                      </button>
                  </div>
                </div>`;
                }
              } else if (element.operacion === 'Habilitar' || (element.operacion === 'Actualizar' && element.operacio_ejecutada === 'Estudio_de_Seguridad' && element.estado_actual === 1)) {
                if (element.estado === 'Rechazado_modificar' || element.estado === 'Pendiente') {
                  columnaAcciones.innerHTML = `

                <div class="btn-group btn-space">
                  <div class="btn-group" role="group" aria-label="Basic example"> 
                      <button type="button" class="btn btn-success  btn-sm" title="Lista comprobación (Estudio Seguridad)" id="btn_listado" 
                            data-toggle="modal" data-target="#ver_lista_segu" data-id="#" data-id2="${solicitud}"  data-id3="#" ><span class="mdi mdi-collection-text"></span>
                            <input type="hidden" class="soli_id" value="${solicitud}">
                            <input type="hidden" class="pla_id" value="${placa}">
                            <input type="hidden" class="nombre" value="${nombre}">
                            <input type="hidden" class="apellido" value="${apellido}">
                            <input type="hidden" class="estado_actual" value="${estado}">
                            <input type="hidden" class="estado_estudio" value="${element.estado}">
                            <input type="hidden" class="conductor_id" value="${element.id_conductor}">
                            <input type="hidden" class="conductor_num_documento" value="${element.numero_documento}">
                            <input type="hidden" class="vehiculo_id" value="${element.id_vehiculo}">
                            <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                      </button> 

                      <button type="button" class="btn btn-warning btn-sm" title="Respuestas de operaciones (Estudio de seguridad)" id="btn_modificar_pendiente"
                          data-toggle="modal" data-target="#habilitar_pendiente" data-id="#" data-id2="${solicitud}" data-id3="#"><span class="mdi mdi-sun"></span>
                          <input type="hidden" class="soli_id" value="${solicitud}">
                          <input type="hidden" class="pla_id" value="${placa}">
                          <input type="hidden" class="nombre" value="${nombre}">
                          <input type="hidden" class="apellido" value="${apellido}">
                          <input type="hidden" class="estado_actual" value="${estado}">
                          <input type="hidden" class="conductor_id" value="${element.id_conductor}">
                          <input type="hidden" class="vehiculo_id" value="${element.id_vehiculo}">
                          <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                          <input type="hidden" class="observacion" value="${element.observacion}">
                      </button> 
                  </div>
                </div>`;
                } else {
                  if (element.estado_prefiltro === 'Pendiente' || element.estado_prefiltro === 'Iniciado' || element.estado_prefiltro === 'Rechazado' || element.estado_prefiltro === 'Aprobado') {
                    /* VALIDAR PARA MOSTRAR EL BOTON DEL LISTADO DE LOS RECURSOS NUEVOS SOLO CUANDO SEGURIDAD APRUEBE EL PREFILTRO DEL NUEVO RECURSO */
                    if (element.estado_prefiltro === 'Aprobado') {
                      columnaAcciones.innerHTML = `
                        <div class="btn-group btn-space">
                          <div class="btn-group" role="group" aria-label="Basic example"> 
                              <button type="button" class="btn btn-success  btn-sm" title="Lista comprobación (Estudio Seguridad)" id="btn_listado" 
                                    data-toggle="modal" data-target="#ver_lista_segu" data-id="#" data-id2="${solicitud}"  data-id3="#" ><span class="mdi mdi-collection-text"></span>
                                    <input type="hidden" class="soli_id" value="${solicitud}">
                                    <input type="hidden" class="pla_id" value="${placa}">
                                    <input type="hidden" class="nombre" value="${nombre}">
                                    <input type="hidden" class="apellido" value="${apellido}">
                                    <input type="hidden" class="estado_actual" value="${estado}">
                                    <input type="hidden" class="estado_estudio" value="${element.estado}">
                                    <input type="hidden" class="conductor_id" value="${element.id_conductor}">
                                    <input type="hidden" class="conductor_num_documento" value="${element.numero_documento}">
                                    <input type="hidden" class="vehiculo_id" value="${element.id_vehiculo}">
                                    <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                              </button>
                              <button type="button" class="btn btn-danger btn-sm" title="Listado de prefiltro nuevo recurso" id="btn_listado_nuevo"
                                data-toggle="modal" data-target="#ver_lista_prefiltro_nuevo_recurso"><i class="fas fa-clipboard-list"></i>
                                <input type="hidden" class="soli_id" value="${solicitud}">
                                <input type="hidden" class="pla_id" value="${placa}">
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
                                    data-toggle="modal" data-target="#ver_lista_segu" data-id="#" data-id2="${solicitud}"  data-id3="#" ><span class="mdi mdi-collection-text"></span>
                              <input type="hidden" class="soli_id" value="${solicitud}">
                              <input type="hidden" class="pla_id" value="${placa}">
                              <input type="hidden" class="nombre" value="${nombre}">
                              <input type="hidden" class="apellido" value="${apellido}">
                              <input type="hidden" class="estado_actual" value="${estado}">
                              <input type="hidden" class="estado_estudio" value="${element.estado}">
                              <input type="hidden" class="conductor_id" value="${element.id_conductor}">
                              <input type="hidden" class="conductor_num_documento" value="${element.numero_documento}">
                              <input type="hidden" class="vehiculo_id" value="${element.id_vehiculo}">
                              <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                              </button>

                            <button type="button" class="btn btn-danger  btn-sm" title="Anular Estudio (Estudio Seguridad)" id="btn_anular_estudio" 
                                data-toggle="modal" data-target="#cancelar_estudio" data-id="#" data-id2="${solicitud}"  data-id3="#" ><i class="far fa-times-circle"></i>
                                <input type="hidden" class="soli_id" value="${solicitud}">
                                <input type="hidden" class="pla_id" value="${placa}">
                                <input type="hidden" class="nombre" value="${nombre}">
                                <input type="hidden" class="apellido" value="${apellido}">
                                <input type="hidden" class="estado_actual" value="${estado}">
                                <input type="hidden" class="estado_estudio" value="${element.estado}">
                                <input type="hidden" class="conductor_id" value="${element.id_conductor}">
                                <input type="hidden" class="conductor_num_documento" value="${element.numero_documento}">
                                <input type="hidden" class="vehiculo_id" value="${element.id_vehiculo}">
                                <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                                <input type="hidden" class="nombre_accion" value="Estudio de Seguridad">
                            </button>
                          </div>
                        </div>`;
                    }
                  } else {
                    columnaAcciones.innerHTML = `
                  <div class="btn-group btn-space">
                    <div class="btn-group" role="group" aria-label="Basic example"> 
                        <button type="button" class="btn btn-success  btn-sm" title="Lista comprobación (Estudio Seguridad)" id="btn_listado" data-toggle="modal" data-target="#ver_lista_segu" data-id="#" data-id2="${solicitud}"  data-id3="#" ><span class="mdi mdi-collection-text"></span>
                              <input type="hidden" class="soli_id" value="${solicitud}">
                              <input type="hidden" class="pla_id" value="${placa}">
                              <input type="hidden" class="nombre" value="${nombre}">
                              <input type="hidden" class="apellido" value="${apellido}">
                              <input type="hidden" class="estado_actual" value="${estado}">
                              <input type="hidden" class="estado_estudio" value="${element.estado}">
                              <input type="hidden" class="conductor_id" value="${element.id_conductor}">
                              <input type="hidden" class="conductor_num_documento" value="${element.numero_documento}">
                              <input type="hidden" class="vehiculo_id" value="${element.id_vehiculo}">
                              <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                        </button>

                        <button type="button" class="btn btn-danger  btn-sm" title="Anular Estudio (Estudio Seguridad)" id="btn_anular_estudio" 
                            data-toggle="modal" data-target="#cancelar_estudio" data-id="#" data-id2="${solicitud}"  data-id3="#" ><i class="far fa-times-circle"></i>
                            <input type="hidden" class="soli_id" value="${solicitud}">
                            <input type="hidden" class="pla_id" value="${placa}">
                            <input type="hidden" class="nombre" value="${nombre}">
                            <input type="hidden" class="apellido" value="${apellido}">
                            <input type="hidden" class="estado_actual" value="${estado}">
                            <input type="hidden" class="estado_estudio" value="${element.estado}">
                            <input type="hidden" class="conductor_id" value="${element.id_conductor}">
                            <input type="hidden" class="conductor_num_documento" value="${element.numero_documento}">
                            <input type="hidden" class="vehiculo_id" value="${element.id_vehiculo}">
                            <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                            <input type="hidden" class="nombre_accion" value="Estudio de Seguridad">
                        </button>
                    </div>
                  </div>`;
                  }
                }
              } else if (element.operacion === 'Habilitar' || (element.operacion === 'Actualizar' && element.operacio_ejecutada === 'Estudio_de_Seguridad' && element.estado_actual === 1)) {
                if (element.estado === 'Rechazado_modificar' || element.estado === 'Pendiente') {
                  columnaAcciones.innerHTML = `
                <div class="btn-group btn-space">
                  <div class="btn-group" role="group" aria-label="Basic example"> 
                      <button type="button" class="btn btn-success  btn-sm" title="Lista comprobación (Estudio Seguridad)" id="btn_listado" 
                            data-toggle="modal" data-target="#ver_lista_segu" data-id="#" data-id2="${solicitud}"  data-id3="#" ><span class="mdi mdi-collection-text"></span>
                            <input type="hidden" class="soli_id" value="${solicitud}">
                            <input type="hidden" class="pla_id" value="${placa}">
                            <input type="hidden" class="nombre" value="${nombre}">
                            <input type="hidden" class="apellido" value="${apellido}">
                            <input type="hidden" class="estado_actual" value="${estado}">
                            <input type="hidden" class="estado_estudio" value="${element.estado}">
                            <input type="hidden" class="conductor_num_documento" value="${element.numero_documento}">
                            <input type="hidden" class="vehiculo_id" value="${element.vehiculo_id}">
                            <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                            <input type="hidden" class="conductor_id" value="${element.conductor_id}">
                      </button> 

                      <button type="button" class="btn btn-warning btn-sm" title="Respuestas de operaciones (Estudio de seguridad)" id="btn_modificar_pendiente"
                          data-toggle="modal" data-target="#habilitar_pendiente" data-id="#" data-id2="${solicitud}" data-id3="#"><span class="mdi mdi-sun"></span>
                          <input type="hidden" class="soli_id" value="${solicitud}">
                          <input type="hidden" class="pla_id" value="${placa}">
                          <input type="hidden" class="nombre" value="${nombre}">
                          <input type="hidden" class="apellido" value="${apellido}">
                          <input type="hidden" class="estado_actual" value="${estado}">
                          <input type="hidden" class="conductor_id" value="${element.id_conductor}">
                          <input type="hidden" class="vehiculo_id" value="${element.id_vehiculo}">
                          <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                          <input type="hidden" class="observacion" value="${element.observacion}">
                      </button> 
                  </div>
                </div>`;
                } else {
                  columnaAcciones.innerHTML = `
                <div class="btn-group btn-space">
                  <div class="btn-group" role="group" aria-label="Basic example"> 
                      <button type="button" class="btn btn-success  btn-sm" title="Lista comprobación (Estudio Seguridad)" id="btn_listado" 
                            data-toggle="modal" data-target="#ver_lista_segu" data-id="#" data-id2="${solicitud}"  data-id3="#" ><span class="mdi mdi-collection-text"></span>
                            <input type="hidden" class="soli_id" value="${solicitud}">
                            <input type="hidden" class="pla_id" value="${placa}">
                            <input type="hidden" class="nombre" value="${nombre}">
                            <input type="hidden" class="apellido" value="${apellido}">
                            <input type="hidden" class="estado_actual" value="${estado}">
                            <input type="hidden" class="estado_estudio" value="${element.estado}">
                            <input type="hidden" class="conductor_id" value="${element.conductor_id}">
                            <input type="hidden" class="conductor_num_documento" value="${element.numero_documento}">
                            <input type="hidden" class="vehiculo_id" value="${element.vehiculo_id}">
                            <input type="hidden" class="estudio_id_c" value="${id_estudio_c}">
                      </button>                       
                  </div>
                </div>`;
                }
              } else {
                if (element.estado === 'pendiente_iniciar' && element.estado_actual === 1) {
                  columnaAcciones.innerHTML += `
                        <div class="btn-group btn-space">
                          <div class="btn-group" role="group" aria-label="Basic example">
                              <button type="button" class="btn btn-info btn-sm" title="consultar preestudio" id="btn_ver"
                                data-toggle="modal" data-toggle="modal" data-target="#versolicitud" data-id2="${solicitud}" data-id3="${estado}" data-id4="${placa}" data-placement="top" title="Consultar prefiltro" ><i class="mdi mdi-eye"></i>
                                <input type="hidden" class="soli_id" value="${solicitud}">
                                <input type="hidden" class="pla_id" value="${placa}">
                              </button>

                              <button type="button" class="btn btn-warning btn-sm" title="Cancelar Preestudio" id="btn_cancelar"
                                data-toggle="modal" data-toggle="modal" data-target="#cancelar_estudio" data-id2="${solicitud}" data-id3="${estado}" data-id4="${placa}" data-placement="top"><i class="mdi mdi-close-circle-o"></i>
                                <input type="hidden" class="soli_idcb" value="${solicitud}">
                                <input type="hidden" class="pla_idcb" value="${placa}">
                              </button>
                          </div>
                        </div>`;
                } else {
                  columnaAcciones.innerHTML += `
                  <div class="btn-group btn-space">
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-secondary btn-sm" title="consultar preestudio" id="btn_ver"
                          data-toggle="modal" data-toggle="modal" data-target="#versolicitud" data-id2="${solicitud}" data-id3="${estado}" data-id4="${placa}" data-placement="top" title="Consultar prefiltro vencido" ><i class="mdi mdi-eye"></i>
                          <input type="hidden" class="soli_id" value="${solicitud}">
                          <input type="hidden" class="pla_id" value="${placa}">
                        </button>
                    </div>
                  </div>`;
                }

                if (
                  element.estado === 'aprobado' ||
                  element.estado === 'iniciado' ||
                  element.estado === 'rechazado' ||
                  element.estado === 'cancelado' ||
                  element.estado === 'pendiente' ||
                  (element.estado === 'rechazado_para_modificar' && element.estado_actual === 1)
                ) {
                  if (element.estado == 'aprobado') {
                    if (element.existe_estudio == 0) {
                      boton_cancela = `<button type="button" class="btn btn-warning btn-sm" title="Cancelar Preestudio" id="btn_cancelar"
                      data-toggle="modal" data-toggle="modal" data-target="#cancelar_estudio" data-id2="${solicitud}" data-id3="${estado}" data-id4="${placa}" data-placement="top"><i class="mdi mdi-close-circle-o"></i>
                        <input type="hidden" class="soli_idcb" value="${solicitud}">
                        <input type="hidden" class="pla_idcb" value="${placa}">
                      </button>`;

                      boton_negro = ` <button type="button" class="btn btn-color btn-github btn-sm" title="Solicitar Estudio" id="btn_secury"
                        data-toggle="modal" data-toggle="modal" data-target="#estudio_seguridad" data-id2="${solicitud}" data-id3="${estado}" data-id4="${placa}" data-placement="top" title="Crear hojas de vida"><i class="mdi mdi-plus-circle-o"></i>
                        <input type="hidden" class="soli_id" value="${solicitud}">
                        <input type="hidden" class="pla_id" value="${placa}">
                        <input type="hidden" class="proceso_prefiltro_itr" value="${element.itr}">
                        <input type="hidden" class="propietario" value="${element.documento_propietario}">
                        <input type="hidden" class="tenedor" value="${element.documento_tenedor}">
                        <input type="hidden" class="conductor" value="${element.documento_conductor}">
                        <input type="hidden" class="placa_trailer_nuevo" value="${element.placa_trailer}">
                        <input type="hidden" class="documento_propietario_trailer" value="${element.documento_propietario_trailer}">
                        <input type="hidden" class="observacion_prefiltro" value="${element.observacion}">
                        <input type="hidden" class="responsable_vehiculo" value="${element.usuario_responsable_vehiculo}">
                      </button>`;
                    }
                  }

                  columnaAcciones.innerHTML = `
                  <div class="btn-group btn-space">
                    <div class="btn-group" role="group" aria-label="Basic example"> 
                        <button type="button" class="btn btn-info btn-sm" title="consultar preestudio" id="btn_ver"
                          data-toggle="modal" data-toggle="modal" data-target="#versolicitud" data-id2="${solicitud}" data-id3="${estado}" data-id4="${placa}" data-placement="top" title="Consultar preestudio" ><i class="mdi mdi-eye"></i>
                          <input type="hidden" class="soli_id" value="${solicitud}">
                          <input type="hidden" class="pla_id" value="${placa}">
                        </button>

                        <button type="button" class="btn btn-success btn-sm" title="Respuestas de seguridad (prefiltro)" id="btn_res_seguridad" 
                              data-toggle="modal" data-target="#respuesta_seguridad" data-id="#" data-id2="${solicitud}"  data-id3="#" ><span class="mdi mdi-collection-text"></span>
                              <input type="hidden" class="soli_id" value="${solicitud}">
                              <input type="hidden" class="pla_id" value="${placa}">
                        </button> 
                        ${boton_negro}
                        ${boton_cancela}
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
            fila.appendChild(columnaResponsableVehiculo);
            fila.appendChild(columnaOperacion);
            fila.appendChild(columnaEstudioseguridad);
            fila.appendChild(columnaAcciones);
            // Rendreizar la tabla
            tbody.appendChild(fila);
          });
        } else {
          const fila = d.createElement('tr');
          const sindatos = d.createElement('td');
          sindatos.classList.add('colspan', '10');
          sindatos.innerHTML = 'Sin reigistros en la tabla';
          tbody.appendChild(fila);
        }
      })
      .catch(error => {
        alert(error);
      });
  } catch (error) {
    console.log(error);
  }
}

// async function Listar_datos_prefiltro_nuevo_recurso(solicitud_id, placa) {
//   let data = new FormData();
//   data.append('solicitud_id', solicitud_id);
//   fetch($('#id_url_ajax').val() + 'validacionparametros/verificar_datos_nuevos', {
//     method: 'POST',
//     cache: 'no-cache',
//     body: data,
//   })
//     .then(response => response.json())
//     .then(function(data) {
//       // d.getElementById('tbl_datos').innerHTML = '';
//       if (data) {
//         /* VALIDART LOS ESTADOS DEL PREFILTRO NUEVO */
//         var btn_validar = d.getElementById('btn_validar_datos_prefiltro');
//         /* VALIDART LOS ESTADOS DEL PREFILTRO NUEVO */
//         if (data.estado_prefiltro === 'Pendiente') {
//           d.getElementById('estado_prefiltro_recurso_nuevo').innerHTML = data.estado_prefiltro;
//           d.getElementById('estado_prefiltro_recurso_nuevo').style.backgroundColor = '#E4A11B';
//           d.getElementById('estado_prefiltro_recurso_nuevo').style.color = '#FFFFFF';
//           d.getElementById('token_prefiltro_nuevo').innerHTML = 'Sin respuesta';
//           d.getElementById('vigencia_token_prefiltro_nuevo').innerHTML = 'Sin respuesta';
//           d.getElementById('estado_token_prefiltro_nuevo').innerHTML = 'Sin respuesta';
//           d.getElementById('boton-validar').style.display = 'none';
//         } else if (data.estado_prefiltro === 'Iniciado') {
//           d.getElementById('estado_prefiltro_recurso_nuevo').innerHTML = data.estado_prefiltro;
//           d.getElementById('estado_prefiltro_recurso_nuevo').style.backgroundColor = '#54B4D3';
//           d.getElementById('estado_prefiltro_recurso_nuevo').style.color = '#FFFFFF';
//           d.getElementById('token_prefiltro_nuevo').innerHTML = 'Sin respuesta';
//           d.getElementById('vigencia_token_prefiltro_nuevo').innerHTML = 'Sin respuesta';
//           d.getElementById('estado_token_prefiltro_nuevo').innerHTML = 'Sin respuesta';
//           d.getElementById('boton-validar').style.display = 'none';
//         } else if (data.estado_prefiltro === 'Rechazado') {
//           d.getElementById('estado_prefiltro_recurso_nuevo').innerHTML = data.estado_prefiltro;
//           d.getElementById('estado_prefiltro_recurso_nuevo').style.backgroundColor = '#DC4C64';
//           d.getElementById('estado_prefiltro_recurso_nuevo').style.color = '#FFFFFF';
//           d.getElementById('token_prefiltro_nuevo').innerHTML = 'Sin respuesta';
//           d.getElementById('vigencia_token_prefiltro_nuevo').innerHTML = 'Sin respuesta';
//           d.getElementById('estado_token_prefiltro_nuevo').innerHTML = 'Sin respuesta';
//           d.getElementById('boton-validar').style.display = 'none';
//         } else if (data.estado_prefiltro === 'Aprobado') {
//           d.getElementById('estado_prefiltro_recurso_nuevo').innerHTML = data.estado_prefiltro;
//           d.getElementById('estado_prefiltro_recurso_nuevo').style.backgroundColor = '#14A44D';
//           d.getElementById('estado_prefiltro_recurso_nuevo').style.color = '#FFFFFF';
//           /* Datos del token de seguridad para crear los recursos */
//           if (data.token_actual) {
//             d.getElementById('token_prefiltro_nuevo').innerHTML = data.token_actual;
//             d.getElementById('vigencia_token_prefiltro_nuevo').innerHTML = data.fecha_vigencia;
//             d.getElementById('estado_token_prefiltro_nuevo').innerHTML = data.estado_token;
//             // Agrega el atributo data-id al botón y asigna un valor
//             btn_validar.setAttribute('data-token', data.token_actual);
//             btn_validar.setAttribute('data-estado', data.estado_token);
//             btn_validar.setAttribute('data-estudio', data.id_estudio);
//             d.getElementById('boton-validar').style.display = 'block';
//           } else {
//             btn_validar.setAttribute('data-token', 'Sin respuesta');
//             btn_validar.setAttribute('data-estado', 'Sin respuesta');
//             btn_validar.setAttribute('data-estudio', 'Sin respuesta');
//             d.getElementById('boton-validar').style.display = 'none';

//             d.getElementById('token_prefiltro_nuevo').innerHTML = 'Sin respuesta';
//             d.getElementById('vigencia_token_prefiltro_nuevo').innerHTML = 'Sin respuesta';
//             d.getElementById('estado_token_prefiltro_nuevo').innerHTML = 'Sin respuesta';
//           }
//         }

//         d.getElementById('num_solicitud').innerHTML = data.id_estudio;
//         d.getElementById('placa_solicitud').innerHTML = data.placa_vehiculo;
//         d.getElementById('solicitud_fecha').innerHTML = data.fecha;
//         d.getElementById('solicitud_hora').innerHTML = data.hora;
//         d.getElementById('solicitud_user').innerHTML = data.usuario;

//         var tabla_datos = d.getElementById('tbl_datos');
//         tabla_datos.innerHTML = '';
//         /* Propietario */
//         if (data.propietario === '1') {
//           const filasp = d.createElement('tr');
//           const columnaTituloPropietario = d.createElement('th');
//           columnaTituloPropietario.innerHTML = 'Nombre Propietario';
//           columnaTituloPropietario.style.backgroundColor = '#F5F5F5';
//           columnaTituloPropietario.style.fontWeight = 'bold';
//           columnaTituloPropietario.style.fontSize = '12px';
//           columnaTituloPropietario.style.border = '1px solid #ddd';
//           columnaTituloPropietario.style.width = 'auto';
//           columnaTituloPropietario.style.whiteSpace = 'nowrap';
//           const columnaNombrePropietario = d.createElement('td');
//           columnaNombrePropietario.textContent = data.name_propietario;
//           const columnaTitulo2Propietario = d.createElement('th');
//           columnaTitulo2Propietario.innerHTML = 'Documento';
//           columnaTitulo2Propietario.style.backgroundColor = '#F5F5F5';
//           columnaTitulo2Propietario.style.fontWeight = 'bold';
//           columnaTitulo2Propietario.style.fontSize = '12px';
//           columnaTitulo2Propietario.style.border = '1px solid #ddd';
//           columnaTitulo2Propietario.style.width = 'auto';
//           columnaTitulo2Propietario.style.whiteSpace = 'nowrap';
//           const columnaDocumentoPropietario = d.createElement('td');
//           columnaDocumentoPropietario.textContent = data.documento_propietario;
//           filasp.appendChild(columnaTituloPropietario);
//           filasp.appendChild(columnaNombrePropietario);
//           filasp.appendChild(columnaTitulo2Propietario);
//           filasp.appendChild(columnaDocumentoPropietario);
//           // Rendreizar la tabla
//           tabla_datos.appendChild(filasp);
//           btn_validar.setAttribute('data-propietario', data.documento_propietario);
//         } else {
//           btn_validar.setAttribute('data-propietario', 'Sin Datos');
//         }

//         // /* Poseedor */
//         if (data.poseedor === '1') {
//           const filaspos = d.createElement('tr');
//           const columnaTituloPoseedor = d.createElement('th');
//           columnaTituloPoseedor.innerHTML = 'Nombre Poseedor';
//           columnaTituloPoseedor.style.backgroundColor = '#F5F5F5';
//           columnaTituloPoseedor.style.fontWeight = 'bold';
//           columnaTituloPoseedor.style.fontSize = '12px';
//           columnaTituloPoseedor.style.border = '1px solid #ddd';
//           columnaTituloPoseedor.style.width = 'auto';
//           columnaTituloPoseedor.style.whiteSpace = 'nowrap';
//           const columnaNombrePoseedor = d.createElement('td');
//           columnaNombrePoseedor.textContent = data.name_poseedor;
//           const columnaTitulo2Poseedor = d.createElement('th');
//           columnaTitulo2Poseedor.innerHTML = 'Documento';
//           columnaTitulo2Poseedor.style.backgroundColor = '#F5F5F5';
//           columnaTitulo2Poseedor.style.fontWeight = 'bold';
//           columnaTitulo2Poseedor.style.fontSize = '12px';
//           columnaTitulo2Poseedor.style.border = '1px solid #ddd';
//           columnaTitulo2Poseedor.style.width = 'auto';
//           columnaTitulo2Poseedor.style.whiteSpace = 'nowrap';
//           const columnaDocumentoPoseedor = d.createElement('td');
//           columnaDocumentoPoseedor.textContent = data.documento_poseedor;
//           filaspos.appendChild(columnaTituloPoseedor);
//           filaspos.appendChild(columnaNombrePoseedor);
//           filaspos.appendChild(columnaTitulo2Poseedor);
//           filaspos.appendChild(columnaDocumentoPoseedor);
//           // Rendreizar la tabla
//           tabla_datos.appendChild(filaspos);
//           btn_validar.setAttribute('data-poseedor', data.documento_poseedor);
//         } else {
//           btn_validar.setAttribute('data-poseedor', 'Sin Datos');
//         }

//         // /* Conductor */
//         if (data.conductor === '1') {
//           const filascond = d.createElement('tr');
//           const columnaTituloConductor = d.createElement('th');
//           columnaTituloConductor.innerHTML = 'Nombre Conductor';
//           columnaTituloConductor.style.backgroundColor = '#F5F5F5';
//           columnaTituloConductor.style.fontWeight = 'bold';
//           columnaTituloConductor.style.fontSize = '12px';
//           columnaTituloConductor.style.border = '1px solid #ddd';
//           columnaTituloConductor.style.width = 'auto';
//           columnaTituloConductor.style.whiteSpace = 'nowrap';
//           const columnaNombreConductor = d.createElement('td');
//           columnaNombreConductor.textContent = data.name_conductor;
//           const columnaTitulo2Conductor = d.createElement('th');
//           columnaTitulo2Conductor.innerHTML = 'Documento';
//           columnaTitulo2Conductor.style.backgroundColor = '#F5F5F5';
//           columnaTitulo2Conductor.style.fontWeight = 'bold';
//           columnaTitulo2Conductor.style.fontSize = '12px';
//           columnaTitulo2Conductor.style.border = '1px solid #ddd';
//           columnaTitulo2Conductor.style.width = 'auto';
//           columnaTitulo2Conductor.style.whiteSpace = 'nowrap';
//           const columnaDocumentoConductor = d.createElement('td');
//           columnaDocumentoConductor.textContent = data.documento_conductor;
//           filascond.appendChild(columnaTituloConductor);
//           filascond.appendChild(columnaNombreConductor);
//           filascond.appendChild(columnaTitulo2Conductor);
//           filascond.appendChild(columnaDocumentoConductor);
//           // Rendreizar la tabla
//           tabla_datos.appendChild(filascond);
//           btn_validar.setAttribute('data-conductor', data.documento_conductor);
//           /* Tabla de referencias labaroales */
//           let tbody = d.getElementById('referencias_nuevas');
//           tbody.textContent = '';
//           const fila = d.createElement('tr');
//           const columnaEmpresa1 = d.createElement('td');
//           columnaEmpresa1.textContent = data.empresa1;
//           const columnaIngreso1 = d.createElement('td');
//           columnaIngreso1.textContent = data.feca1;
//           const columnaRetiro1 = d.createElement('td');
//           columnaRetiro1.textContent = data.feca2;
//           const columnaContacto1 = d.createElement('td');
//           columnaContacto1.textContent = data.persona1;
//           const columnaCelular1 = d.createElement('td');
//           columnaCelular1.textContent = data.cel1;
//           const columnaCargo1 = d.createElement('td');
//           columnaCargo1.textContent = data.cargo1;
//           fila.appendChild(columnaEmpresa1);
//           fila.appendChild(columnaIngreso1);
//           fila.appendChild(columnaRetiro1);
//           fila.appendChild(columnaContacto1);
//           fila.appendChild(columnaCelular1);
//           fila.appendChild(columnaCargo1);
//           const fila2 = d.createElement('tr');
//           const columnaEmpresa2 = d.createElement('td');
//           columnaEmpresa2.textContent = data.empresa2;
//           const columnaIngreso2 = d.createElement('td');
//           columnaIngreso2.textContent = data.fecb1;
//           const columnaRetiro2 = d.createElement('td');
//           columnaRetiro2.textContent = data.fecb2;
//           const columnaContacto2 = d.createElement('td');
//           columnaContacto2.textContent = data.persona2;
//           const columnaCelular2 = d.createElement('td');
//           columnaCelular2.textContent = data.cel2;
//           const columnaCargo2 = d.createElement('td');
//           columnaCargo2.textContent = data.cargo2;
//           fila2.appendChild(columnaEmpresa2);
//           fila2.appendChild(columnaIngreso2);
//           fila2.appendChild(columnaRetiro2);
//           fila2.appendChild(columnaContacto2);
//           fila2.appendChild(columnaCelular2);
//           fila2.appendChild(columnaCargo2);

//           const fila3 = d.createElement('tr');
//           const columnaEmpresa3 = d.createElement('td');
//           columnaEmpresa3.textContent = data.empresa3;
//           const columnaIngreso3 = d.createElement('td');
//           columnaIngreso3.textContent = data.fecc1;
//           const columnaRetiro3 = d.createElement('td');
//           columnaRetiro3.textContent = data.fecc2;
//           const columnaContacto3 = d.createElement('td');
//           columnaContacto3.textContent = data.persona3;
//           const columnaCelular3 = d.createElement('td');
//           columnaCelular3.textContent = data.cel3;
//           const columnaCargo3 = d.createElement('td');
//           columnaCargo3.textContent = data.cargo3;
//           fila3.appendChild(columnaEmpresa3);
//           fila3.appendChild(columnaIngreso3);
//           fila3.appendChild(columnaRetiro3);
//           fila3.appendChild(columnaContacto3);
//           fila3.appendChild(columnaCelular3);
//           fila3.appendChild(columnaCargo3);
//           // Rendreizar la tabla
//           tbody.appendChild(fila);
//           tbody.appendChild(fila2);
//           tbody.appendChild(fila3);
//           d.getElementById('tbl_referencias').style.display = 'block';
//         } else {
//           let tbody = d.getElementById('referencias_nuevas');
//           tbody.innerHTML = '';
//           d.getElementById('tbl_referencias').style.display = 'none';
//           btn_validar.setAttribute('data-conductor', 'Sin Datos');
//         }

//         // /* Trailer */
//         if (data.trailer === '1') {
//           const filasTrailer = d.createElement('tr');
//           const columnaTituloTrailer = d.createElement('th');
//           columnaTituloTrailer.innerHTML = 'Placa Trailer';
//           columnaTituloTrailer.style.backgroundColor = '#F5F5F5';
//           columnaTituloTrailer.style.fontWeight = 'bold';
//           columnaTituloTrailer.style.fontSize = '12px';
//           columnaTituloTrailer.style.border = '1px solid #ddd';
//           columnaTituloTrailer.style.width = 'auto';
//           columnaTituloTrailer.style.whiteSpace = 'nowrap';
//           const columnaPlacaTraileer = d.createElement('td');
//           columnaPlacaTraileer.textContent = data.placa_trailer;
//           const columnaTitulo2Trailer = d.createElement('th');
//           columnaTitulo2Trailer.innerHTML = 'Propietario Trailer';
//           columnaTitulo2Trailer.style.backgroundColor = '#F5F5F5';
//           columnaTitulo2Trailer.style.fontWeight = 'bold';
//           columnaTitulo2Trailer.style.fontSize = '12px';
//           columnaTitulo2Trailer.style.border = '1px solid #ddd';
//           columnaTitulo2Trailer.style.width = 'auto';
//           columnaTitulo2Trailer.style.whiteSpace = 'nowrap';
//           const columnaPropetarioTrailer = d.createElement('td');
//           columnaPropetarioTrailer.textContent = data.name_propietario_trailer;
//           filasTrailer.appendChild(columnaTituloTrailer);
//           filasTrailer.appendChild(columnaPlacaTraileer);
//           filasTrailer.appendChild(columnaTitulo2Trailer);
//           filasTrailer.appendChild(columnaPropetarioTrailer);

//           /* Nombre */
//           const filasDocTrailer = d.createElement('tr');
//           const columnaTitulo3Trailer = d.createElement('th');
//           columnaTitulo3Trailer.innerHTML = 'Documento Propietario Trailer';
//           columnaTitulo3Trailer.style.backgroundColor = '#F5F5F5';
//           columnaTitulo3Trailer.style.fontWeight = 'bold';
//           columnaTitulo3Trailer.style.fontSize = '12px';
//           columnaTitulo3Trailer.style.border = '1px solid #ddd';
//           columnaTitulo3Trailer.style.width = 'auto';
//           columnaTitulo3Trailer.style.whiteSpace = 'nowrap';
//           const columnaDocumentoTraileer = d.createElement('td');
//           columnaDocumentoTraileer.textContent = data.documento_propi_trailer;
//           btn_validar.setAttribute('data-propietarioTrailer', data.documento_propi_trailer);
//           // Rendreizar la tabla
//           filasTrailer.appendChild(columnaTitulo3Trailer);
//           filasTrailer.appendChild(columnaDocumentoTraileer);

//           tabla_datos.appendChild(filasTrailer);
//           tabla_datos.appendChild(filasTrailer);
//         } else {
//           btn_validar.setAttribute('data-propietarioTrailer', 'Sin Datos');
//         }
//       } else {
//         alert('Error de operación');
//       }
//     })
//     .catch(error => {
//       alert(JSON.stringify(error));
//     });

//   /* Traer los datos actuales del vehiculos al que se le va hacer la actualización */
//   let datos = new FormData();
//   datos.append('placa_consulta', placa);
//   fetch($('#id_url_ajax').val() + 'validacionparametros/verificar_datos_actuales', {
//     method: 'POST',
//     cache: 'no-cache',
//     body: datos,
//   })
//     .then(response => response.json())
//     .then(function(data) {
//       if (data) {
//         d.getElementById('propietario_actual').innerHTML = data.Propietario;
//         d.getElementById('documento_propietario_actual').innerHTML = data.cedula_propietario;
//         d.getElementById('tenedor_actual').innerHTML = data.Poseedor;
//         d.getElementById('documento_tenedor_actual').innerHTML = data.cedula_poseedor;
//         d.getElementById('conductor_actual').innerHTML = data.Conductor;
//         d.getElementById('documento_conductor_actual').innerHTML = data.cedula_conductor;

//         /* DATOS DEL TRAILER ACTUAL */
//         if (data.Placa_Trailer) {
//           d.getElementById('actual_placa_trailer').innerHTML = data.Placa_Trailer;
//           d.getElementById('actual_propietario_trailer').innerHTML = data.Propietario_Trailer;
//           d.getElementById('documento_actual_propietario_trailer').innerHTML = data.cedula_propietario_trailer;
//         } else {
//           d.getElementById('actual_placa_trailer').textContent = 'No Aplica';
//           d.getElementById('actual_propietario_trailer').textContent = '';
//           d.getElementById('documento_actual_propietario_trailer').textContent = '';
//         }

//         /* Datos del satelital del vehiculo */
//         d.getElementById('web_satelital').innerHTML = `<a href="${data.web_satelital}" target=”_blank”>${data.web_satelital}</a>`;
//         d.getElementById('usuario_satelital').innerHTML = data.usuario_satelital;
//         d.getElementById('clave_satelital').innerHTML = data.clave_satelital;
//       } else {
//         alert('Error de operación');
//       }
//     })
//     .catch(error => {
//       alert(error);
//     });

//   /* Listar los log del vehiculo segun el estado */
//   let formdatos = new FormData();
//   formdatos.append('placa_consulta', placa);
//   formdatos.append('solicitud_id', solicitud_id);
//   fetch($('#id_url_ajax').val() + 'validacionparametros/listar_logs_prefiltro_nuevo', {
//     method: 'POST',
//     cache: 'no-cache',
//     body: formdatos,
//   })
//     .then(response => response.json())
//     .then(function(data) {
//       if (data) {
//         // Seleccionar el elemento <ul>
//         var ul = document.getElementById('lista_log_estdo');
//         ul.innerHTML = '';
//         data.forEach(element => {
//           // Crear un elemento <li>
//           var li = document.createElement('li');
//           // Establecer el texto del elemento <li>
//           li.textContent = 'Estado: ' + element.estado + ' Observacion: ' + element.observacion + ' Usuario: ' + element.usuario + ' Fecha: ' + element.fecha + '-' + element.hora;
//           // Agregar el elemento <li> al elemento <ul>
//           ul.appendChild(li);
//         });
//       } else {
//         alert('Error de operación');
//       }
//     })
//     .catch(error => {
//       alert(error);
//     });
// }

// async function registrar_cancelacion() {
//   try {
//     let data = new FormData();
//     data.append('preestudio', d.getElementById('cancela_prestudio').value);
//     data.append('placa', d.getElementById('cancela_placa').value);
//     data.append('motivo', d.getElementById('cancela_motivo').value);
//     data.append('anotacion', d.getElementById('cancela_nota').value);
//     data.append('accion_actividad', d.getElementById('accion_actividad').value);
//     data.append('estudioc', d.getElementById('estudioc').value);
//     data.append('vehiculo_cancelar', d.getElementById('vehiculo_cancelar').value);
//     data.append('coductor_cancelar', d.getElementById('coductor_cancelar').value);

//     await fetch($('#id_url_ajax').val() + 'validacionparametros/Cancelacion_preestudio', {
//       method: 'POST',
//       cache: 'no-cache',
//       body: data,
//     })
//       .then(response => {
//         if (!response.ok) throw new Error(response.statusText);
//         return response.json();
//       })
//       .then(function(data) {
//         if (data) {
//           alert('Realizo cancelación exitosamente');
//           // $('#nexos_messages_popup_cancel').append(``);
//           $('#cancelar_estudio').modal('hide');
//           listar_solicitudes_operaciones();
//         }
//       })
//       .catch(error => {
//         alert(error);
//       });
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function push(nestudio, estudio, ntipo, rta, placa_push, nombre_push, num_solicitud_push) {
//   Push.Permission.request();
//   Push.create('Respuesta de operaciones al proceso ' + nestudio, {
//     body: 'El proceso ' + nestudio + ' Con la respuesta: ' + rta + ' Tipo ' + ntipo,
//     icon: $('#id_url_ajax').val() + 'public/img/logo.png',
//     timeout: 2500000,
//     vibrate: [100, 100, 100],
//     onClick: function() {
//       window.location = $('#id_url_ajax').val() + 'preestudiov/nacional_preestudio/?idmenu=1';
//       console.log(this);
//     },
//   });
// }
