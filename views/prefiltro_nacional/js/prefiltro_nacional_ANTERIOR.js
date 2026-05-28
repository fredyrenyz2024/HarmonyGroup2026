const d = document;
const w = window;
const web = document.querySelector('#web'),
  user_satelite = document.querySelector('#user_satelite'),
  clave = document.querySelector('#clave'),
  nompro = document.querySelector('#nompro'),
  docupro = document.querySelector('#docupro'),
  nomtene = document.querySelector('#nomtene'),
  docutene = document.querySelector('#docutene'),
  nomcondu = document.querySelector('#nomcondu'),
  docucondu = document.querySelector('#docucondu');

d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  // alert('DOCUMENTO');
  const SELECTFILTRO = d.querySelector('#filtro_estado');
  const BTN_FILTRAR = d.querySelector('#btn-filtrar');
  // Filtro();

  // let datosnuevos = {
  //   web: '',
  //   user_satelite: '',
  //   clave: '',
  //   nompro: '',
  //   docupro: '',
  //   nomtene: '',
  //   docutene: '',
  //   nomcondu: '',
  //   docucondu: '',
  // };


  let datosnuevos = {
    web: '',
    user_satelite: '',
    clave: '',
    // nompro: '',
    docupro: '',
    // nomtene: '',
    docutene: '',
    // nomcondu: '',
    docucondu: '',
  };

  // let numero = 0;
  BTN_FILTRAR.addEventListener('click', Filtro);
  // SELECTFILTRO.addEventListener("change", Filtro);
  async function Filtro() {
    // alert('asj');
    if (SELECTFILTRO.value !== '') {
      $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
      try {
        let formdata = new FormData();
        formdata.append('filtro', SELECTFILTRO.value);
        formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
        formdata.append('fecha_final', d.getElementById('fecha_final').value);

        await fetch($('#id_url_ajax').val() + 'prefiltro_nacional/Consultar_Solicitudes', {
          method: 'POST',
          body: formdata,
        })
          .then(response => {
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
          })
          .then(function (data) {
            let tbody = d.getElementById('tbl-solicitudes');
            let clase_btn = '';
            let estado = '';
            let template = '';
            let toltip = '';
            let estadobtn = '';
            let itr = '';
            if (data.length > 0) {
              template.innerHTML = '';
              data.forEach(element => {
                if (element.esoli === 'Realizada') {
                  clase_btn = 'success';
                  estado = 'Realizada';
                  toltip = 'Realizada';
                  estadobtn = 'disabled';
                } else if (element.esoli === 'En_subasta') {
                  clase_btn = 'info';
                  estado = 'Subasta';
                  toltip = 'Subasta';
                  estadobtn = '';
                } else if (element.esoli === 'Pendiente') {
                  // Se usar el estado pendiente porque este proviene de la tabla de solicitudes de servicio.
                  clase_btn = 'warning';
                  estado = 'Pendiente';
                  toltip = 'Pendiente';
                  estadobtn = '';
                } else if (element.esoli === 'asignada') {
                  clase_btn = 'warning';
                  estado = 'Asignada';
                  toltip = 'Asignada Solicitud Prefiltro';
                  estadobtn = '';
                } else if (element.esoli === 'en_tramite') {
                  clase_btn = 'warning';
                  estado = 'En tramite';
                  toltip = 'En tramite solicitud prefiltro';
                  estadobtn = '';
                } else if (element.esoli === 'aprobado_prefiltro') {
                  clase_btn = 'success';
                  estado = 'Aprobado prefiltro';
                  toltip = 'Aprobado prefiltro';
                  estadobtn = '';
                }
                if (element.itr === 'Si') {
                  itr = '<span class="badge badge-success float-right">SI</span>';
                } else {
                  itr = '<span class="badge badge-primary float-right">NO</span>';
                }
                template += `
              <tr>
                <td class='text-${clase_btn}'>
                   <center>
                    <span class="mdi mdi-dot-circle icon" data-toggle="tooltip" title="${element.esoli !== null ? element.esoli : 'Pendiente'}"></span>
                   </center>
                </td>

                <td class="cell-detail  text-center">
                  <span>Escenario ${element.escenario_id}</span>
                </td>

                <td  class="cell-detail">
                          COT-                     SS-            BN
                    <span>${element.n_cotizacion} - ${element.elid} - ${element.item} </span>
                    <span class="text-success" style="font-weight:800;">${element.tipo_servicio_mer}</span>
                </td>

                <td class="cell-detail">
                  <span>${itr}</span>
                </td>

            <!--<td  class="cell-detail">
                  <span class="badge badge-light">Solicitado:  ${element.cant_vehiculo}</span>
                  <span class="badge badge-light"> Disponible: ${element.cant_disponible}</span>
                </td>-->

                <td class="cell-detail">
                    <span> ${element.nombre_cliente} ${element.nit}</span>
                </td>

                <td class="cell-detail" style="text-align: left;vertical-align: middle;" >
                    <span>${element.tipo_mercancia}</span>
                </td>

                <td class="cell-detail"  >
                    <span>${element.nombre}</span>
                </td>

                <td class="cell-detail" style="text-align: left;vertical-align: middle;width: 10px;">
                  <span title="Peso Neto kg">${formatNum(element.peso_kg)} kg</span>
                </td>

                <td class="cell-detail" style="width:100px;" >
                  <span><b>Origén:</b> ${element.origen_solicitud} <br> <b>Destino:</b> ${element.destino_solicitud}</span>
                </td>

                <td class="cell-detail text-center">
                  <span>${element.fecha}<br>${element.hora_creacion} </span>
                </td>
              
                <td class="cell-detail">
                      <span class="label label-${clase_btn}" title="${toltip}">${element.numero_placas > 0 ? 'Placas asignadas' : 'Sin asignar'}</span>
                </td>
                <td  class="cell-detail"  style="text-align: center;vertical-align: middle;width: 100px;">
                    <div class="btn-group btn-space">
                    
                      <button class="btn btn-success btn-xs" type="button" onclick="preestudio(this);" data-id="${element.n_cotizacion}"
                        data-id2="${element.nundoc_solicitud}" data-id3="${element.nombre_cliente}" data-id4="${element.item}" data-id5="${element.tipo_mercancia}"
                        data-id6="${element.flete}"   data-id7="${element.peso_neto_tn}" data-id8="${element.tipo_servicio_mer}"  data-id9="${element.total_tarifa}"
                        data-id10=""${element.origen_rndc}"  data-id11="${element.itr}" data-id12='${element.escenario_id}' onclick="reiniciar_contador();" ${estadobtn}>
                        <span class="icon mdi mdi-plus input-md" style="color:black;" title="solicitud preestudio"></span>
                      </button>

                      <button class="btn btn-info btn-xs" type="button" onclick="consulta_coti(this)"; data-hint="" data-id="${element.n_cotizacion}"  data-id2="${element.nundoc_solicitud}"  
                      data-id3="${element.idnegocio}" data-id4="${element.cant_vehiculo}" data-id5="${element.cant_disponible}">
                        <span class="icon mdi mdi-eye input-md" data-toggle="modal"data-target="#consulta_solicitud" title="Consultar solicitud de servicio"></span>
                     </button>

                     <button type="button" class="btn btn-warning btn-xs mdi mdi-edit" data-placement="top" onclick="status(this)"; data-hint="" data-id="${element.n_cotizacion}"  data-id2="${element.nundoc_solicitud}">
                        <span class="icon mdi mdi-balance input-md"data-toggle="modal" data-target="#status" title="status"></span>
                    </button>
                    </div>
                </td>
            </tr>`;
                tbody.innerHTML = template;
              });
            } else {
              tbody.innerHTML = '<tr><td colspan="15" class="text-center"><i class="fas fa-database"></i> No hay resultados en la plataforma</td></tr>';
              // tbody.innerHTML = '';
            }
          })
          .catch(error => {
            alert(error);
          });
      } catch (error) {
        alert('Error de trucaht' + error);
      } finally {
        $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    }
  }

  /* Checked de tipo de estudio de seguridad */
  d.addEventListener('change', async e => {
    if (e.target.matches('#update') || e.target.matches('#update *')) {
      op = '';
      accordion1desbloqueado(op);
      referencias_ah_des();
      datossolicitudes_des();
      //documentos_ah_des();
      campos_ah_bloc();
      consultar_hojadevida();
      readonly_campos();
      flete_desbloquear();
      campos_ah_des();
      $('#inexistente_propietario').hide();
      $('#inexistente_poseedor').hide();
      $('#inexistente_conductor').hide();
      $('#inexistente_vehiculo').hide();
      $('#inexistente_trailer').hide();
      $('#inexistente_actividades').hide();
      /* Acciones para elegir el tipo de operación */
      let checkboxes = d.querySelectorAll('.recursos_checbox');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            const valorSeleccionado = checkbox.value;
            if (valorSeleccionado === 'nuevo_recurso') {
              d.getElementById('creacion_nuevo_recuro').style.display = 'block';
              d.getElementById('inexistente_actividades').style.display = 'block';
            } else if (valorSeleccionado === 'datos_dinamicos') {
              d.getElementById('datos_dinamicos').style.display = 'block';
            }
          } else if (!checkbox.checked) {
            const valorunchecked = checkbox.value;
            if (valorunchecked === 'nuevo_recurso') {
              d.getElementById('creacion_nuevo_recuro').style.display = 'none';
              d.getElementById('inexistente_actividades').style.display = 'none';
            } else if (valorunchecked === 'datos_dinamicos') {
              d.getElementById('datos_dinamicos').style.display = 'none';
            }
          }
        });
      });

      /* Elegir el tipo de de recurso que se queire crear */
      let checkboxes_recursos = d.querySelectorAll('.chebox_recurso');
      checkboxes_recursos.forEach(checkbox_recurso => {
        checkbox_recurso.addEventListener('change', () => {
          if (checkbox_recurso.checked) {
            const Recurso = checkbox_recurso.value;
            if (Recurso === 'Propietario') {
              d.getElementById('inexistente_propietario').style.display = 'block';
            } else if (Recurso === 'Poseedor') {
              d.getElementById('inexistente_poseedor').style.display = 'block';
            } else if (Recurso === 'Conductor') {
              d.getElementById('inexistente_conductor').style.display = 'block';
            } else if (Recurso === 'Trailer') {
              d.getElementById('inexistente_trailer').style.display = 'block';
            } else if (Recurso === 'Vehículo') {
              d.getElementById('inexistente_vehiculo').style.display = 'block';
            }
          } else if (!checkbox_recurso.checked) {
            const Recursounchecked = checkbox_recurso.value;
            if (Recursounchecked === 'Propietario') {
              d.getElementById('inexistente_propietario').style.display = 'none';
            } else if (Recursounchecked === 'Poseedor') {
              d.getElementById('inexistente_poseedor').style.display = 'none';
            } else if (Recursounchecked === 'Conductor') {
              d.getElementById('inexistente_conductor').style.display = 'none';
            } else if (Recursounchecked === 'Trailer') {
              d.getElementById('inexistente_trailer').style.display = 'none';
            } else if (Recursounchecked === 'Vehículo') {
              d.getElementById('inexistente_vehiculo').style.display = 'none';
            }
          }
        });
      });
    }
    // Validar si el propietario ya esta registardo en la base de datos
    if (e.target.matches('#docupro') || e.target.matches('#docupro *')) {
      let documento = d.getElementById('docupro').value;
      let dato = new FormData();
      dato.append('documento', documento);
      try {
        const response = await fetch($('#id_url_ajax').val() + 'validacionparametros/Validar_Propietario', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          // d.getElementById('docupro').disabled = true;
          d.getElementById('nompro').value = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
          // d.getElementById('nompro').disabled = true;
          d.getElementById('mensaje_propietario_existe').innerHTML = `
                <p class="bg-success text-center" style='color:#FFF'>Este Propietario ya esta registrado en el sistema.</p>
              `;
        } else {
          d.getElementById('docupro').disabled = false;
          d.getElementById('nompro').disabled = false;
        }
      } catch (error) {
        console.error('Error en la segunda solicitud:', error);
        throw error;
      } finally {
        $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    }
    // Validar si el poseedor existe en la base de datos
    if (e.target.matches('#docutene') || e.target.matches('#docutene *')) {
      let documento = d.getElementById('docutene').value;
      let dato = new FormData();
      dato.append('documento', documento);
      try {
        const response = await fetch($('#id_url_ajax').val() + 'validacionparametros/Validar_Poseedor', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          // d.getElementById('docutene').disabled = true;
          d.getElementById('nomtene').value = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
          // d.getElementById('nomtene').value = data.Nombre;
          // d.getElementById('nomtene').disabled = true;
          d.getElementById('mensaje_poseedor_existe').innerHTML = `
                <p class="bg-success text-center" style='color:#FFF'>Este Poseedor ya esta registrado en el sistema.</p>
              `;
        } else {
          d.getElementById('docutene').disabled = false;
          d.getElementById('nomtene').disabled = false;
        }
      } catch (error) {
        console.error('Error en la segunda solicitud:', error);
        throw error;
      } finally {
        $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    }
    // Validar si el conductor existe en la base de datos
    if (e.target.matches('#docucondu') || e.target.matches('#docucondu *')) {
      let documento = d.getElementById('docucondu').value;
      let dato = new FormData();
      dato.append('documento', documento);
      try {
        const response = await fetch($('#id_url_ajax').val() + 'validacionparametros/Validar_Conductor', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          // d.getElementById('docucondu').disabled = true;
          d.getElementById('nomcondu').value = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
          // d.getElementById('nomcondu').value = data.Nombre;
          // d.getElementById('nomcondu').disabled = true;
          d.getElementById('mensaje_conductor_existe').innerHTML = `
                <p class="bg-success text-center" style='color:#FFF'>Este Conductor ya esta registrado en el sistema.</p>
              `;
        } else {
          d.getElementById('docucondu').disabled = false;
          d.getElementById('nomcondu').disabled = false;
        }
      } catch (error) {
        console.error('Error en la segunda solicitud:', error);
        throw error;
      } finally {
        $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    }

    // Validar si la placa del trailer esta cread y asosiada a un vehiculo
    if (e.target.matches('#placat') || e.target.matches('#placat *')) {
      let placa = d.getElementById('placat').value;
      let dato = new FormData();
      dato.append('placa_trailer', placa);
      try {
        const response = await fetch($('#id_url_ajax').val() + 'validacionparametros/Validar_Trailer', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          d.getElementById('placat').disabled = true;
          d.getElementById('docproptrailer').value = data.numero_documento;
          d.getElementById('nomproptrailer').value = data.Nombre_propietario;
          // d.getElementById('docproptrailer').disabled = true;
          // d.getElementById('nomproptrailer').disabled = true;
          d.getElementById('mensaje_trailer_existe').innerHTML = `
            <p class="bg-success text-center" style='color:#FFF'>Este Trailer ya esta registrado en el sistema, con el vehiculo de placa: ${data.placa_vehiculo}</p>
          `;
        } else {
          d.getElementById('placat').disabled = false;
          d.getElementById('docproptrailer').disabled = false;
          d.getElementById('nomproptrailer').disabled = false;
        }
      } catch (error) {
        console.error('Error en la segunda solicitud:', error);
        throw error;
      } finally {
        $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    }

    /* Validar los numeros de documentos de los recursos nuevos para verificar y notificar al usaurio por que caminio es. */
    if (e.target.matches('#number_propietario') || e.target.matches('#number_propietario *')) {
      let documento = d.getElementById('number_propietario').value;
      let dato = new FormData();
      dato.append('documento', documento);
      try {
        const response = await fetch($('#id_url_ajax').val() + 'validacionparametros/Validar_Propietario', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          // d.getElementById('number_propietario').disabled = true;
          $('#crea_vehiculopreestudio').modal('hide');
          $('#mensaje_notificacion').html('<b>Advertencia!</b>');
          const name_propietario = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
          let actividad = 'Propietario';
          $('#texto_notificacion').html(
            `Este <b>${actividad}</b> ya esta registrado en NexosApp como: <b>${name_propietario}</b> la actualizacion de campos diferentes a documentos y placas debe ser por datos dinamicos`,
          );
          $('#mod-warning').modal('toggle');
        } else {
          d.getElementById('number_propietario').disabled = false;
          d.getElementById('name_propietario').disabled = false;
        }
      } catch (error) {
        console.error('Error en la segunda solicitud:', error);
        throw error;
      } finally {
        $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    }

    if (e.target.matches('#number_poseedor') || e.target.matches('#number_poseedor *')) {
      let documento = d.getElementById('number_poseedor').value;
      let dato = new FormData();
      dato.append('documento', documento);
      try {
        const response = await fetch($('#id_url_ajax').val() + 'validacionparametros/Validar_Poseedor', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          // d.getElementById('number_propietario').disabled = true;
          $('#crea_vehiculopreestudio').modal('hide');
          $('#mensaje_notificacion').html('<b>Advertencia!</b>');
          const name_pOSEEDOR = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
          let actividad = 'Poseedor';
          $('#texto_notificacion').html(
            `Este <b>${actividad}</b> ya esta registrado en NexosApp como: <b>${name_pOSEEDOR}</b> la actualizacion de campos diferentes a documentos y placas debe ser por datos dinamicos`,
          );
          $('#mod-warning').modal('toggle');
        } else {
          d.getElementById('number_poseedor').disabled = false;
          d.getElementById('name_propietario').disabled = false;
        }
      } catch (error) {
        console.error('Error en la segunda solicitud:', error);
        throw error;
      } finally {
        $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    }

    if (e.target.matches('#number_conductor') || e.target.matches('#number_conductor *')) {
      let documento = d.getElementById('number_conductor').value;
      let dato = new FormData();
      dato.append('documento', documento);
      try {
        const response = await fetch($('#id_url_ajax').val() + 'validacionparametros/Validar_Conductor', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          // d.getElementById('number_propietario').disabled = true;
          $('#crea_vehiculopreestudio').modal('hide');
          $('#mensaje_notificacion').html('<b>Advertencia!</b>');
          const name_pOSEEDOR = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
          let actividad = 'Conductor';
          $('#texto_notificacion').html(
            `Este <b>${actividad}</b> ya esta registrado en NexosApp como: <b>${name_pOSEEDOR}</b> la actualizacion de campos diferentes a documentos y placas debe ser por datos dinamicos`,
          );
          $('#mod-warning').modal('toggle');
        } else {
          d.getElementById('number_conductor').disabled = false;
          d.getElementById('name_propietario').disabled = false;
        }
      } catch (error) {
        console.error('Error en la segunda solicitud:', error);
        throw error;
      } finally {
        $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    }

    if (e.target.matches('#propidocu_trailer') || e.target.matches('#propidocu_trailer *')) {
      let documento = d.getElementById('propidocu_trailer').value;
      let dato = new FormData();
      dato.append('documento', documento);
      try {
        const response = await fetch($('#id_url_ajax').val() + 'validacionparametros/Validar_Conductor', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          // d.getElementById('number_propietario').disabled = true;
          $('#crea_vehiculopreestudio').modal('hide');
          $('#mensaje_notificacion').html('<b>Advertencia!</b>');
          const name_pOSEEDOR = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
          let actividad = 'Conductor';
          $('#texto_notificacion').html(
            `Este <b>${actividad}</b> ya esta registrado en NexosApp como: <b>${name_pOSEEDOR}</b> la actualizacion de campos diferentes a documentos y placas debe ser por datos dinamicos`,
          );
          $('#mod-warning').modal('toggle');
        } else {
          d.getElementById('propidocu_trailer').disabled = false;
          d.getElementById('name_propietario').disabled = false;
        }
      } catch (error) {
        console.error('Error en la segunda solicitud:', error);
        throw error;
      } finally {
        $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    }
  });

  let datos_validado = 0;
  d.addEventListener('click', async e => {
    //Validar propietario para ITR
    if (e.target.matches('#si_propietario') || e.target.matches('#si_propietario *')) {
      d.getElementById('accion_propietario').innerHTML = 'Validado';
      d.getElementById('accion_propietario').style.backgroundColor = '#14A44D';
      d.getElementById('accion_propietario').style.color = '#FFFFFF';
      datos_validado++;
    } else if (e.target.matches('#no_propietario') || e.target.matches('#no_propietario *')) {
      actualizar_itr();
    }

    // Validar poseedor de ITR
    if (e.target.matches('#si_poseedor') || e.target.matches('#si_poseedor *')) {
      d.getElementById('accion_poseedor').innerHTML = 'Validado';
      d.getElementById('accion_poseedor').style.backgroundColor = '#14A44D';
      d.getElementById('accion_poseedor').style.color = '#FFFFFF';
      datos_validado++;
    } else if (e.target.matches('#no_poseedor') || e.target.matches('#no_poseedor *')) {
      actualizar_itr();
    }

    // Validar conductor de ITR
    if (e.target.matches('#si_conductor') || e.target.matches('#si_conductor *')) {
      d.getElementById('accion_conductor').innerHTML = 'Validado';
      d.getElementById('accion_conductor').style.backgroundColor = '#14A44D';
      d.getElementById('accion_conductor').style.color = '#FFFFFF';
      datos_validado++;
    } else if (e.target.matches('#no_conductor') || e.target.matches('#no_conductor *')) {
      actualizar_itr();
    }

    // Validar propietario del tráiler para ITR
    if (e.target.matches('#si_propietario_trailer') || e.target.matches('#si_propietario_trailer *')) {
      d.getElementById('accion_propietario_trailer').innerHTML = 'Validado';
      d.getElementById('accion_propietario_trailer').style.backgroundColor = '#14A44D';
      d.getElementById('accion_propietario_trailer').style.color = '#FFFFFF';
      datos_validado++;
    } else if (e.target.matches('#no_propietario_trailer') || e.target.matches('#no_propietario_trailer *')) {
      actualizar_itr();
    }

    /* Validar los click antes de precionar el boton de guarfar prefiltro para mostrar el boton */
    if (d.getElementById('proceso_itr') === 'Si') {
    } else {
    }
    
    if (d.getElementById('accion_propietario_trailer').textContent === 'No Aplica') {
      if (datos_validado >= 3) {
        $('#crear_preestudio').show();
      }
    } else {
      if (datos_validado >= 4) {
        $('#crear_preestudio').show();
      }
    }

    /* Guardar registros de prefiltro */
    if (e.target.matches('#crear_preestudio') || e.target.matches('#crear_preestudio *')) {
      let BtnPreestudio = e.target.closest('#crear_preestudio');
      let EscenarioId = BtnPreestudio.getAttribute('data-escenarioId');

      let proceso_itr = d.getElementById('proceso_itr').value;
      if (proceso_itr === 'Si') {
        if (datos_validado === 0) {
          // Primer viaje
          if (d.getElementById('placa').value !== '') {
            if (window.confirm('¿Estas seguro de realizar la operación de solicitud de vehiculo?')) {
              // Código a ejecutar si el usuario hace clic en "Aceptar"
              var msg_error = '';
              if ($('#papeles').is(':checked')) {
                var p;
                for (p = 1; p == b; p++) {
                  //var papeles = document.getElementById('documento'+i+'').files;
                  if (!$('#tipohoja' + p + '').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Tipo hoja de vida  en la fila ' + p + '</strong> para poder crear el prefiltro.</p>';
                  }
                  if (!$('#ruta' + p + '').val()) {
                    msg_error += '<p>Debe seleccionar el campo <strong>Tipo hoja de vida  en la fila ' + p + '</strong> para que aparezca una ruta y poder crear el prefiltro.</p>';
                  }
                  if (!$('#namearchivo' + p + '').val()) {
                    msg_error += '<p>Debe seleccionar un  <strong>(1) Archivo  en la fila ' + p + ' </strong> para poder crear el prefiltro.</p>';
                  }
                }
              }
              if (!$('#placag').val()) {
                msg_error += '<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el vehículo.</p>';
                AplicaFoco('#placag');
              } else {
                RemueveFoco('#placag');
              }
              if (!$('#web').val()) {
                msg_error += '<p>Debe diligenciar el campo <strong>Web satélital</strong> para poder crear el vehículo.</p>';
                AplicaFoco('#web');
              } else {
                RemueveFoco('#web');
              }
              if (!$('#user_satelite').val()) {
                msg_error += '<p>Debe diligenciar el campo <strong>usuario</strong> para poder crear el vehículo.</p>';
                AplicaFoco('#user_satelite');
              } else {
                RemueveFoco('#user_satelite');
              }
              if (!$('#clave').val()) {
                msg_error += '<p>Debe diligenciar el campo <strong>Clave</strong> para poder crear el vehículo.</p>';
                AplicaFoco('#clave');
              } else {
                RemueveFoco('#clave');
              }
              if (!$('#nompro').val()) {
                msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Propietario</strong> para poder crear el vehículo.</p>';
                AplicaFoco('#nompro');
              } else {
                RemueveFoco('#nompro');
              }
              if (!$('#docupro').val()) {
                msg_error += '<p>Debe diligenciar el campo <strong>Documento de Propietario</strong> para poder crear el vehículo.</p>';
                AplicaFoco('#docupro');
              } else {
                RemueveFoco('#docupro');
              }
              if (!$('#nomtene').val()) {
                msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Tenedor</strong> para poder crear el vehículo.</p>';
                AplicaFoco('#nomtene');
              } else {
                RemueveFoco('#nomtene');
              }
              if (!$('#docutene').val()) {
                msg_error += '<p>Debe diligenciar el campo <strong>Documento de Tenedor</strong> para poder crear el vehículo.</p>';
                AplicaFoco('#docutene');
              } else {
                RemueveFoco('#docutene');
              }
              if (!$('#nomcondu').val()) {
                msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Conductor</strong> para poder crear el vehículo.</p>';
                AplicaFoco('#nomcondu');
              } else {
                RemueveFoco('#nomcondu');
              }
              if (!$('#docucondu').val()) {
                msg_error += '<p>Debe diligenciar el campo <strong>Documento de Conductor</strong> para poder crear el vehículo.</p>';
                AplicaFoco('#docucondu');
              } else {
                RemueveFoco('#docucondu');
              }
              if (!$('#su_propuesto').val()) {
                msg_error += '<p>Debe diligenciar el campo <strong>Flete propuesto </strong>en datos de la subasta para poder crear el vehículo.</p>';
                AplicaFoco('#su_propuesto');
              } else {
                RemueveFoco('#su_propuesto');
              }

              if (!$('#responsable_vehiculo').val()) {
                //campos dinamicos
                msg_error += '<p>Debe seleccionar un <strong>Responsable </strong> del vehículo para poder crear la solicitud.</p>';
                AplicaFoco('#responsable_vehiculo');
              } else {
                RemueveFoco('#responsable_vehiculo');
              }

              if (!$('input[name=gender]').is(':checked')) {
                msg_error += '<p>Debe diligenciar el <strong>Tipo de operación</strong> para poder crear el vehículo.</p>';
              }

              if (!$('#total_pesos').val()) {
                msg_error += '<p>Debe diligenciar el campo <strong>Total Peso(Kg) </strong>en datos de la solicitud para poder crear el vehículo.</p>';
                AplicaFoco('#total_pesos');
              } else {
                RemueveFoco('#total_pesos');
              }

              if (!$('#capa_carga_vh').val()) {
                msg_error += '<p>Debe diligenciar el campo <strong>Capacidad carga(Kg)</strong>en datos de la solicitud para poder crear el vehículo.</p>';
                AplicaFoco('#capa_carga_vh');
              } else {
                if ($('#capa_carga_vh').val().length > 5) {
                  msg_error += '<p>El campo <strong>Capacidad carga(Kg)</strong> debe tener máximo 5 dígitos.</p>';
                } else {
                  RemueveFoco('#capa_carga_vh');
                }
              }
              if ($('#total_pesos').val() != '' && $('#capa_carga_vh').val() != '') {
                var tpeso = $('#total_pesos').val().replace(/,/g, '');
                var capacidad = $('#capa_carga_vh').val().replace(/,/g, '');
                if (parseFloat(tpeso) > parseFloat(capacidad)) {
                  msg_error += '<p>El <strong>Total sumatoria Peso(Kg) </strong> debe ser menor o igual a la <strong>Capacidad de carga vehículo(Kg)</strong></p>';
                  AplicaFoco('#total_pesos');
                  AplicaFoco('#capa_carga_vh');
                } else {
                  RemueveFoco('#total_pesos');
                  RemueveFoco('#capa_carga_vh');
                }
              }
              if ($('#estado_prefiltron').val() == '') {
                if (d.getElementById('nuevo').checked) {
                  if (contador_global1 < 3) {
                    msg_error += '<p>Debe diligenciar mínimo <strong>tres referencias laborales</strong> para poder crear la referencia.</p>';
                  }
                  var m;
                  for (m = 1; m <= contador_global1; m++) {
                    if (!$('#empresa_crear' + m + '').val()) {
                      msg_error += '<p>Debe diligenciar el campo <strong>Empresa ' + m + ' </strong> para poder crear la referencia.</p>';
                      AplicaFoco('#empresa_crear' + m + '');
                    } else {
                      RemueveFoco('#empresa_crear' + m + '');
                    }

                    if (!$('#numero_crear' + m + '').val()) {
                      msg_error += '<p>Debe diligenciar el campo <strong>Teléfono ' + m + ' </strong> para poder crear la referencia.</p>';
                      AplicaFoco('#numero_crear' + m + '');
                    } else {
                      if ($('#numero_crear' + m + '').val().length !== 10) {
                        msg_error += '<p>El campo <strong>Teléfono ' + m + ' </strong> debe tener 10 dígitos.</p>';
                      } else {
                        RemueveFoco('#numero_crear' + m + '');
                      }
                    }
                  }
                }

                /* Validar si esta checkd el campo de trailers */
                if (d.getElementById('propietario_obligatorio').checked) {
                  if (d.getElementById('placat').value === '') {
                    // console.log('campos obligatorios');
                    $('#placat + p').remove();
                    const ERROR = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                    $('#placat').after(ERROR);
                    AplicaFoco('#placat');
                    msg_error += '<p>Debe diligenciar <strong>placa</strong> del trailer para poder crear la solicitud.</p>';
                  } else {
                    $('#placat + p').remove();
                    RemueveFoco('#placat');
                  }

                  if (d.getElementById('docproptrailer').value === '') {
                    $('#docproptrailer + p').remove();
                    const ERROR2 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                    $('#docproptrailer').after(ERROR2);
                    AplicaFoco('#docproptrailer');
                    msg_error += '<p>Debe diligenciar <strong>Documento Propietario trailer</strong> para poder crear la solicitud.</p>';
                  } else {
                    $('#docproptrailer + p').remove();
                    RemueveFoco('#docproptrailer');
                  }

                  if (d.getElementById('nomproptrailer').value === '') {
                    $('#nomproptrailer + p').remove();
                    const ERROR3 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                    $('#nomproptrailer').after(ERROR3);
                    AplicaFoco('#nomproptrailer');
                    msg_error += '<p>Debe diligenciar <strong>Nombre Propietario Trailer</strong> para poder crear la solicitud.</p>';
                  } else {
                    $('#nomproptrailer + p').remove();
                    RemueveFoco('#nomproptrailer');
                  }
                } else {
                  // console.log('campos no obligatorios');
                  $('#placat + p').remove();
                  $('#docproptrailer + p').remove();
                  $('#nomproptrailer + p').remove();
                  RemueveFoco('#placat');
                  RemueveFoco('#docproptrailer');
                  RemueveFoco('#nomproptrailer');
                }

                if (d.getElementById('habil').checked || d.getElementById('update').checked) {
                  if (!$('#referencias_empresariales1').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Referencias laboral 1</strong> para poder crear la solicitud.</p>';
                  }
                  if (!$('#celular_ref1').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Celular laboral 1</strong> para poder crear la solicitud.</p>';
                  }
                  if (!$('#referencias_empresariales2').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Referencias laboral 2</strong> para poder crear la solicitud.</p>';
                  }
                  if (!$('#celular_ref2').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Celular laboral 2</strong> para poder crear la solicitud.</p>';
                  }
                  if (!$('#referencias_empresariales3').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Referencias laboral 3</strong> para poder crear la solicitud.</p>';
                  }
                  if (!$('#celular_ref3').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Celular laboral 3</strong> para poder crear la solicitud.</p>';
                  }
                  //personales
                  if (!$('#referencias_personales1').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Nombre persona 1</strong> para poder crear la solicitud.</p>';
                  }
                  if (!$('#parenp1').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Parentezco 1</strong> para poder crear la solicitud.</p>';
                  }
                  if (!$('#telefonop1').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Teléfono 1</strong> en ref. personal para poder crear la solicitud.</p>';
                  }
                  if (!$('#referencias_personales2').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Nombre persona 2</strong> en ref. personal para poder crear la solicitud.</p>';
                  }
                  if (!$('#parenp2').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Parentezco 2</strong> para poder crear la solicitud.</p>';
                  }
                  if (!$('#telefonop2').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Teléfono 2</strong> para poder crear la solicitud.</p>';
                  }
                  if (d.getElementById('update').checked) {
                    if (!d.getElementById('cbox1').checked && !d.getElementById('cbox2').checked) {
                      msg_error += '<p>Debe seleccionar <strong>una opción de recurso</strong> para poder crear la solicitud (Actualiza seguridad).</p>';
                    } else {
                      if (d.getElementById('cbox1').checked) {
                        //registrar campos nuevos
                        if (
                          !d.getElementById('cbpre1').checked &&
                          !d.getElementById('cbpre2').checked &&
                          !d.getElementById('cbpre3').checked &&
                          !d.getElementById('cbpre4').checked &&
                          !d.getElementById('cbpre5').checked
                        ) {
                          msg_error += '<p>Por favor seleccione el recurso a crear , opción seleccionada <strong>Recursos inexistentes</strong>.</p>';
                        } else {
                          if (d.getElementById('cbpre1').checked) {
                            //propietario
                            if (!$('#name_propietario').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Nombre Propietario</strong> para poder crear la solicitud.</p>';
                            }
                            if (!$('#number_propietario').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Documento Propietario</strong> para poder crear la solicitud.</p>';
                            }
                          }

                          if (d.getElementById('cbpre2').checked) {
                            //poseedor
                            if (!$('#name_poseedor').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Nombre Poseedor</strong> para poder crear la solicitud.</p>';
                            }
                            if (!$('#number_poseedor').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Documento Poseedor</strong> para poder crear la solicitud.</p>';
                            }
                          }

                          if (d.getElementById('cbpre3').checked) {
                            //conductor
                            if (!$('#name_conductor').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Nombre Conductor</strong> para poder crear la solicitud.</p>';
                            }
                            if (!$('#number_conductor').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Documento Conductor</strong> para poder crear la solicitud.</p>';
                            }
                            if (!$('#referencias_empresariales1pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Nombre referencia 1</strong> para poder crear la solicitud.</p>';
                            }
                            if (!$('#contacto_ref1pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Persona contacto 1</strong> para poder crear la solicitud.</p>';
                            }
                            if (!$('#celular_ref1pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Celular empresa 1</strong> para poder crear la solicitud.</p>';
                            }
                            if (!$('#referencias_empresariales2pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Nombre referencia 2</strong> para poder crear la solicitud.</p>';
                            }
                            if (!$('#contacto_ref2pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Persona contacto 2</strong> para poder crear la solicitud.</p>';
                            }
                            if (!$('#celular_ref2pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Celular empresa 2</strong> para poder crear la solicitud.</p>';
                            }
                            if (!$('#referencias_empresariales3pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Nombre referencia 3</strong> para poder crear la solicitud.</p>';
                            }
                            if (!$('#contacto_ref3pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Persona contacto 3</strong> para poder crear la solicitud.</p>';
                            }
                            if (!$('#celular_ref3pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Celular empresa 3</strong> para poder crear la solicitud.</p>';
                            }
                          }

                          if (d.getElementById('cbpre4').checked) {
                            //trailer
                            if (!$('#placa_trailerpre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Placa tráiler</strong> para poder crear la solicitud.</p>';
                            }
                            if (!$('#propi_trailer').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Nombre propietario tráiler</strong> para poder crear la solicitud.</p>';
                            }
                            if (!$('#propidocu_trailer').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Documento propietario tráiler</strong> para poder crear la solicitud.</p>';
                            }
                          }
                        }
                      }
                      if (d.getElementById('cbox2').checked) {
                        //campos dinamicos
                        var idfila = $('#cuerpo_actu tr').length; //cantidad de filas de la tabla
                        if (idfila == 0) {
                          msg_error += '<p>Debe ingresar <strong>Mínimo 1 dato </strong> en bloque actualizar seguridad para poder crear la solicitud.</p>';
                        }
                      }
                    }
                  }
                }
              }
              if (!msg_error && $('#estado_prefiltron').val() == '') {
                if (comprobar() === false) {
                  if (d.getElementById('nuevo').checked) {
                    let data = new FormData();
                    var operacion;
                    if ($('#update').is(':checked')) {
                      operacion = 'Actualizar';
                    }

                    if ($('#nuevo').is(':checked')) {
                      operacion = 'Nuevo';
                    }
                    if ($('#habil').is(':checked')) {
                      operacion = 'Habilitar';
                    }
                    let fletef = $('#su_propuesto').val().split(',').join('');
                    let tarifaf = $('#su_tarifacot').val().split(',').join('');
                    data.append('placa', d.getElementById('placag').value);
                    // Datos del propietario del vehiculo
                    data.append('trailer', d.getElementById('placat').value);
                    data.append('documento_propietario_trailer', d.getElementById('docproptrailer').value);
                    data.append('propietario_trailer', d.getElementById('nomproptrailer').value);
                    data.append('propietario', d.getElementById('nompro').value);
                    data.append('documento_pro', d.getElementById('docupro').value);
                    data.append('tenedor', d.getElementById('nomtene').value);
                    data.append('documento_tene', d.getElementById('docutene').value);
                    data.append('conductor', d.getElementById('nomcondu').value);
                    data.append('documento_condu', d.getElementById('docucondu').value);
                    data.append('web', d.getElementById('web').value);
                    data.append('user_satelite', d.getElementById('user_satelite').value);
                    data.append('clave', d.getElementById('clave').value);
                    data.append('tipologianuevo', $('#nuevo').val());
                    data.append('tipologiahabilte', $('#habilite').val());
                    data.append('tipologiaactualice', $('#actualice').val());
                    data.append('tipo_operacion', operacion);
                    data.append('fecha', $('#fpree').val());
                    data.append('hora', $('#hpree').val());
                    data.append('usuario', $('#userpree').val());
                    data.append('observacion', $('#obserpree').val());
                    data.append('su_sumatorianeto', $('#su_sumatorianeto').val());
                    data.append('total_peso', $('#total_peso').val());
                    data.append('flete_subasta', fletef);
                    data.append('tarifa_subasta', tarifaf);
                    data.append('propietario_obligatorio', $('#propietario_obligatorio').is(':checked'));
                    data.append('proceso_itr', proceso_itr);
                    /* Responsable de vehiculo */
                    data.append('responsable_vehiculo', $('#responsable_vehiculo').val());
                    data.append('EscenarioId', EscenarioId);

                    // Obtener los valores de los inputs de tipo array
                    var empresa = d.getElementsByName('empresa_crear[]');
                    for (var i = 0; i < empresa.length; i++) {
                      data.append('empresa_crear[]', empresa[i].value);
                    }
                    var ingreso = d.getElementsByName('fingreso_crear[]');
                    for (var i = 0; i < ingreso.length; i++) {
                      data.append('fingreso_crear[]', ingreso[i].value);
                    }
                    var retiro = d.getElementsByName('fretiro_crear[]');
                    for (var i = 0; i < retiro.length; i++) {
                      data.append('fretiro_crear[]', retiro[i].value);
                    }
                    var persona = d.getElementsByName('contacto_crear[]');
                    for (var i = 0; i < persona.length; i++) {
                      data.append('contacto_crear[]', persona[i].value);
                    }
                    var num = d.getElementsByName('numero_crear[]');
                    for (var i = 0; i < num.length; i++) {
                      data.append('numero_crear[]', num[i].value);
                    }
                    var cargo = d.getElementsByName('cargo_crear[]');
                    for (var i = 0; i < cargo.length; i++) {
                      data.append('cargo_crear[]', cargo[i].value);
                    }
                    var anti = d.getElementsByName('antiguedad_crear[]');
                    for (var i = 0; i < anti.length; i++) {
                      data.append('antiguedad_crear[]', anti[i].value);
                    }
                    // Solicitudes de servicio
                    var solicitudes = d.getElementsByName('fserva[]');
                    for (var i = 0; i < solicitudes.length; i++) {
                      data.append('fserva[]', solicitudes[i].value);
                    }

                    //se construye el objeto que almacena los datos
                    let datos = {
                      tipohoja: [],
                      clase: [],
                      ruta: [],
                      documento: [],
                      namearchivo: [],
                      papeles: [],
                    };

                    //Archivos
                    var cantp = $('#cont_papel').val();
                    if (cantp > 0) {
                      var tipohj = d.getElementsByName('tipohoja[]');
                      for (var i = 0; i < tipohj.length; i++) {
                        var tipo = tipohj[i].value;
                        datos.tipohoja[i] = tipo;
                      }
                      var clase = d.getElementsByName('clase[]');
                      for (var i = 0; i < clase.length; i++) {
                        var clas = clase[i].value;
                        datos.clase[i] = clas;
                      }

                      var ruta = d.getElementsByName('ruta[]');
                      for (var i = 0; i < ruta.length; i++) {
                        var rut = ruta[i].value;
                        datos.ruta[i] = rut;
                      }

                      var documento = d.getElementsByName('documento[]');
                      for (var i = 0; i < documento.length; i++) {
                        var doc = documento[i].value;
                        datos.documento[i] = doc;
                      }

                      var namearchivo = d.getElementsByName('namearchivo[]');
                      for (var i = 0; i < namearchivo.length; i++) {
                        var name = namearchivo[i].value;
                        datos.namearchivo[i] = name;
                      }

                      var u;
                      for (u = 1; u <= cantp; u++) {
                        data.append('Papel', $('#papeles').is(':checked'));
                        var papeles = document.getElementById('documento' + u + '').files;
                        if (papeles.length > 0) {
                          for (var a = 0; a < papeles.length; a++) {
                            data.append('papeles[]', papeles[a]);
                            // var doc = documento[a].value;
                            // datos.papeles[a] = papeles[a];
                          }
                        } else {
                          data.append('papeles', 'sin_datos');
                        }
                      }
                      // Nuevo Array completo
                      var nota = datos;
                      nota = JSON.stringify(nota);
                      data.append('notas', nota);
                    }
                    await fetch($('#id_url_ajax').val() + 'validacionparametros/Insertar_preestudio_nuevo', {
                      method: 'POST',
                      body: data,
                      cache: 'no-cache',
                    })
                      .then(response => {
                        if (!response.ok) throw new Error(response.statusText);
                        return response.json();
                      })
                      .then(function (datas) {
                        console.log(datas);
                        if (datas) {
                          alert(datas);
                          $('#crea_vehiculopreestudio').modal('hide');
                          Filtro();
                          Limpiarmodal();
                          Ocultarbloque();
                          $('#crear_preestudio').show();
                        } else {
                          alert('error');
                          $('#crear_preestudio').show();
                        }
                      })
                      .catch(error => {
                        alert(error);
                        $('#crear_preestudio').show();
                      });
                  }
                }

                if (d.getElementById('habil').checked || d.getElementById('update').checked) {
                  let data = new FormData();
                  var operacion;
                  if ($('#update').is(':checked')) {
                    operacion = 'Actualizar';
                  }
                  if ($('#habil').is(':checked')) {
                    operacion = 'Habilitar';
                  }
                  let fletef = $('#su_propuesto').val().split(',').join('');
                  let tarifaf = $('#su_tarifacot').val().split(',').join('');
                  data.append('tipo_operacion', operacion);
                  data.append('placa', d.getElementById('placag').value);
                  data.append('flete_subasta', fletef);
                  data.append('tarifa_subasta', tarifaf);
                  data.append('fecha', $('#fpree').val());
                  data.append('hora', $('#hpree').val());
                  data.append('usuario', $('#userpree').val());
                  data.append('papeles', 'sin_datos');
                  data.append('observacion', $('#obserpree').val());
                  /* Responsable de vehiculo */
                  data.append('responsable_vehiculo', $('#responsable_vehiculo').val());
                  data.append('EscenarioId', EscenarioId);
                  // Solicitudes de servicio
                  var solicitudes = d.getElementsByName('fserva[]');
                  for (var i = 0; i < solicitudes.length; i++) {
                    data.append('fserva[]', solicitudes[i].value);
                  }

                  //se construye el objeto que almacena los datos
                  let element = {
                    tipohojahv: [],
                    campos: [],
                    datos: [],
                    namearchivo: [],
                  };

                  if ($('#update').is(':checked')) {
                    //insercion de datos dinamicos
                    if (d.getElementById('cbox2').checked) {
                      data.append('dinamicos', 'si');
                      var cantp = $('#valortb').val();
                      if (cantp > 0) {
                        var e, n;
                        for (e = 1; e <= cantp; e++) {
                          if (typeof $('#sa' + e).val() !== 'undefined') {
                            var tipohv = $('#fila' + e + '').find('td').eq(1).html();
                            var campo = $('#fila' + e + '').find('td').eq(2).html();
                            var dato = $('#fila' + e + '').find('td').eq(3).html();
                            var namea = $('#nam' + e + '').val();
                            var papeles = document.getElementById('arc' + e + '').files;
                            if (papeles.length > 0) {
                              for (var a = 0; a < papeles.length; a++) {
                                data.append('papeles[]', papeles[a]);
                              }
                            } else {
                              data.append('papeles', 'Sin_datos');
                            }
                            element.tipohojahv.push(tipohv);
                            element.campos.push(campo);
                            element.namearchivo.push(namea);
                            element.datos.push(dato);
                            // Nuevo Array completo
                            var nota = element;
                            nota = JSON.stringify(nota);
                            data.append('notas', nota);
                          }
                        }
                      }
                    } else {
                      data.append('dinamicos', 'no');
                    }

                    //inserción de recursos inexistentes es decir, nuevos
                    if (d.getElementById('cbox1').checked) {
                      data.append('nuevos_recursos', 'si');
                      if (d.getElementById('cbpre1').checked) {
                        //propietario
                        tipologia = 'propietario';
                        var name_propie = $('#name_propietario').val();
                        var tipohv = 'Propietario';
                        var docu_propi = $('#number_propietario').val();
                        data.append('propietario_check', $('#cbpre1').is(':checked'));
                        data.append('tipo_propi', tipologia);
                        data.append('nombre_propietario', name_propie);
                        data.append('docu_propi', docu_propi);
                      } else {
                        data.append('propietario_check', $('#cbpre1').is(':checked'));
                      }
                      if (d.getElementById('cbpre2').checked) {
                        //poseedor
                        tipologia = 'tenedor';
                        campo = 'Nombre';
                        name_posee = $('#name_poseedor').val();
                        data.append('poseedor_check', $('#cbpre2').is(':checked'));
                        docu_posee = $('#number_poseedor').val();
                        data.append('tipo_posee', tipologia);
                        data.append('nombre_poseedor', name_posee);
                        data.append('docu_posee', docu_posee);
                      } else {
                        data.append('poseedor_check', $('#cbpre2').is(':checked'));
                      }
                      if (d.getElementById('cbpre3').checked) {
                        //conductor
                        tipologia = 'conductor';
                        campo = 'Nombre';
                        cedula = $('#number_conductor').val();
                        nombre = $('#name_conductor').val();
                        ref1 = $('#referencias_empresariales1pre').val();
                        per1 = $('#contacto_ref1pre').val();
                        cel1 = $('#celular_ref1pre').val();
                        cargo1 = $('#cargo_ref1pre').val();
                        fec1 = $('#fingresoa1pre').val();
                        fec11 = $('#fretiroa3pre').val();
                        anti = $('#anti_ref1pre').val();
                        //
                        ref2 = $('#referencias_empresariales2pre').val();
                        per2 = $('#contacto_ref2pre').val();
                        cel2 = $('#celular_ref2pre').val();
                        cargo2 = $('#cargo_ref2pre').val();
                        fec2 = $('#fingresob1pre').val();
                        fec22 = $('#fretirob3pre').val();
                        anti2 = $('#anti_ref2pre').val();
                        //
                        ref3 = $('#referencias_empresariales3pre').val();
                        per3 = $('#contacto_ref3pre').val();
                        cel3 = $('#celular_ref3pre').val();
                        cargo3 = $('#cargo_ref3pre').val();
                        fec3 = $('#fingresoc1pre').val();
                        fec33 = $('#fretiroc3pre').val();
                        anti3 = $('#anti_ref3pre').val();

                        data.append('conductor_check', $('#cbpre3').is(':checked'));
                        data.append('tipo_condu', tipologia);
                        data.append('nombre_conductor', nombre);
                        data.append('docu_condu', cedula);
                        data.append('refe1', ref1);
                        data.append('contacto1', per1);
                        data.append('celular1', cel1);
                        data.append('cargo1', cargo1);
                        data.append('fechaa1', $('#fingresoa1pre').val());
                        data.append('fechaa2', fec11);
                        data.append('anti1', anti);
                        data.append('refe2', ref2);
                        data.append('contacto2', per2);
                        data.append('celular2', cel2);
                        data.append('cargo2', cargo2);
                        data.append('fechab1', fec2);
                        data.append('fechab2', fec22);
                        data.append('anti2', anti2);
                        data.append('refe3', ref3);
                        data.append('contacto3', per3);
                        data.append('celular3', cel3);
                        data.append('cargo3', cargo3);
                        data.append('fechac1', fec3);
                        data.append('fechac2', $('#fretiroc3pre').val());
                        data.append('anti3', anti3);
                      } else {
                        data.append('conductor_check', $('#cbpre3').is(':checked'));
                      }

                      if (d.getElementById('cbpre4').checked) {
                        //trailer
                        tipologia = 'trailer';
                        campo = 'Nombre';
                        placa = $('#placa_trailerpre').val();
                        propi = $('#propi_trailer').val();
                        docupropit = $('#propidocu_trailer').val();
                        data.append('trailer_check', $('#cbpre4').is(':checked'));
                        data.append('tipo_trai', tipologia);
                        data.append('placa_trailer', placa);
                        data.append('propi_trailer', propi);
                        data.append('propidoc_trailer', docupropit);
                      } else {
                        data.append('trailer_check', $('#cbpre4').is(':checked'));
                      }
                    }
                  }
                  await fetch($('#id_url_ajax').val() + 'validacionparametros/Insert_estudio_itr', {
                    method: 'POST',
                    body: data,
                    cache: 'no-cache',
                  })
                    .then(response => {
                      if (!response.ok) throw new Error(response.statusText);
                      return response.json();
                    })
                    .then(function (data) {
                      if (data.numero === 200) {
                        mensaje = `
                          <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
                              <div class="icon"><span class="mdi mdi-check"></span></div>
                              <div class="message">
                                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                <strong>Mensaje!</strong> ${data.mensaje}
                              </div>
                          </div>`;
                        $('#crea_vehiculopreestudio').modal('hide');
                        Filtro();
                        Limpiarmodal();
                        Ocultarbloque();
                      } else {
                        mensaje = `
                          <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
                              <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                              <div class="message">
                                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                <strong>Mensaje!</strong> ${data.mensaje}
                              </div>
                          </div>`;
                        $('#crear_preestudio').show();
                      }
                      d.getElementById('historicos').innerHTML = mensaje;
                    })
                    .catch(error => {
                      alert(error);
                      $('#crear_preestudio').show();
                    });
                }
              } else {
                $('#nexos_messages_popup').html(
                  '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
                  msg_error +
                  '</div></div>',
                );
                $('#crea_vehiculopreestudio').animate({ scrollTop: 0 }, 600);
                $('#crear_preestudio').show();
              }
            } else {
              // Código a ejecutar si el usuario hace clic en "Cancelar"
              $('#crear_preestudio').show();
            }
          } else {
            mensaje = `
              <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                  <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                  <div class="message">
                    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                    <strong>Mensaje!</strong> Debes diligenciar la placa para la solicitud de servicio
                  </div>
              </div>`;
            d.getElementById('historicos').innerHTML = mensaje;
            // alert("debe diligenciar la placa para la solicitud");
            $('#crear_preestudio').show();
          }
        } else {
          /* Seunfo viaje en adelante */
          if (d.getElementById('accion_propietario_trailer').textContent === 'No Aplica') {
            if (datos_validado >= 3) {
              var radio = d.getElementById('habil');
              radio.checked = true; // Marcar como seleccionado
              if (d.getElementById('placa').value !== '') {
                if (window.confirm('¿Estas seguro de realizar la operación de solicitud de vehiculo?')) {
                  // Código a ejecutar si el usuario hace clic en "Aceptar"
                  var msg_error = '';
                  if ($('#papeles').is(':checked')) {
                    var p;
                    for (p = 1; p == b; p++) {
                      //var papeles = document.getElementById('documento'+i+'').files;
                      if (!$('#tipohoja' + p + '').val()) {
                        msg_error += '<p>Debe diligenciar el campo <strong>Tipo hoja de vida  en la fila ' + p + '</strong> para poder crear el prefiltro.</p>';
                      }
                      if (!$('#ruta' + p + '').val()) {
                        msg_error += '<p>Debe seleccionar el campo <strong>Tipo hoja de vida  en la fila ' + p + '</strong> para que aparezca una ruta y poder crear el prefiltro.</p>';
                      }
                      if (!$('#namearchivo' + p + '').val()) {
                        msg_error += '<p>Debe seleccionar un  <strong>(1) Archivo  en la fila ' + p + ' </strong> para poder crear el prefiltro.</p>';
                      }
                    }
                  }
                  if (!$('#placag').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#placag');
                  } else {
                    RemueveFoco('#placag');
                  }
                  if (!$('#web').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Web satélital</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#web');
                  } else {
                    RemueveFoco('#web');
                  }
                  if (!$('#user_satelite').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>usuario</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#user_satelite');
                  } else {
                    RemueveFoco('#user_satelite');
                  }
                  if (!$('#clave').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Clave</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#clave');
                  } else {
                    RemueveFoco('#clave');
                  }
                  if (!$('#nompro').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Propietario</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#nompro');
                  } else {
                    RemueveFoco('#nompro');
                  }
                  if (!$('#docupro').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Documento de Propietario</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#docupro');
                  } else {
                    RemueveFoco('#docupro');
                  }
                  if (!$('#nomtene').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Tenedor</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#nomtene');
                  } else {
                    RemueveFoco('#nomtene');
                  }
                  if (!$('#docutene').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Documento de Tenedor</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#docutene');
                  } else {
                    RemueveFoco('#docutene');
                  }
                  if (!$('#nomcondu').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Conductor</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#nomcondu');
                  } else {
                    RemueveFoco('#nomcondu');
                  }
                  if (!$('#docucondu').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Documento de Conductor</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#docucondu');
                  } else {
                    RemueveFoco('#docucondu');
                  }
                  if (!$('#su_propuesto').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Flete propuesto </strong>en datos de la subasta para poder crear el vehículo.</p>';
                    AplicaFoco('#su_propuesto');
                  } else {
                    RemueveFoco('#su_propuesto');
                  }
                  if (!$('#responsable_vehiculo').val()) {
                    //campos dinamicos
                    msg_error += '<p>Debe seleccionar un <strong>Responsable </strong> del vehículo para poder crear la solicitud.</p>';
                    AplicaFoco('#responsable_vehiculo');
                  } else {
                    RemueveFoco('#responsable_vehiculo');
                  }

                  if (!$('input[name=gender]').is(':checked')) {
                    msg_error += '<p>Debe diligenciar el <strong>Tipo de operación</strong> para poder crear el vehículo.</p>';
                  }

                  if (!$('#total_pesos').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Total Peso(Kg) </strong>en datos de la solicitud para poder crear el vehículo.</p>';
                    AplicaFoco('#total_pesos');
                  } else {
                    RemueveFoco('#total_pesos');
                  }

                  if (!$('#capa_carga_vh').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Capacidad carga(Kg)</strong>en datos de la solicitud para poder crear el vehículo.</p>';
                    AplicaFoco('#capa_carga_vh');
                  } else {
                    if ($('#capa_carga_vh').val().length > 5) {
                      msg_error += '<p>El campo <strong>Capacidad carga(Kg)</strong> debe tener máximo 5 dígitos.</p>';
                    } else {
                      RemueveFoco('#capa_carga_vh');
                    }
                  }
                  if ($('#total_pesos').val() != '' && $('#capa_carga_vh').val() != '') {
                    var tpeso = $('#total_pesos').val().replace(/,/g, '');
                    var capacidad = $('#capa_carga_vh').val().replace(/,/g, '');
                    if (parseFloat(tpeso) > parseFloat(capacidad)) {
                      msg_error += '<p>El <strong>Total sumatoria Peso(Kg) </strong> debe ser menor o igual a la <strong>Capacidad de carga vehículo(Kg)</strong></p>';
                      AplicaFoco('#total_pesos');
                      AplicaFoco('#capa_carga_vh');
                    } else {
                      RemueveFoco('#total_pesos');
                      RemueveFoco('#capa_carga_vh');
                    }
                  }
                  if ($('#estado_prefiltron').val() == '') {
                    if (d.getElementById('nuevo').checked) {
                      if (contador_global1 < 3) {
                        msg_error += '<p>Debe diligenciar mínimo <strong>tres referencias laborales</strong> para poder crear la referencia.</p>';
                      }
                      var m;
                      for (m = 1; m <= contador_global1; m++) {
                        if (!$('#empresa_crear' + m + '').val()) {
                          msg_error += '<p>Debe diligenciar el campo <strong>Empresa ' + m + ' </strong> para poder crear la referencia.</p>';
                          AplicaFoco('#empresa_crear' + m + '');
                        } else {
                          RemueveFoco('#empresa_crear' + m + '');
                        }

                        if (!$('#numero_crear' + m + '').val()) {
                          msg_error += '<p>Debe diligenciar el campo <strong>Teléfono ' + m + ' </strong> para poder crear la referencia.</p>';
                          AplicaFoco('#numero_crear' + m + '');
                        } else {
                          if ($('#numero_crear' + m + '').val().length !== 10) {
                            msg_error += '<p>El campo <strong>Teléfono ' + m + ' </strong> debe tener 10 dígitos.</p>';
                          } else {
                            RemueveFoco('#numero_crear' + m + '');
                          }
                        }
                      }
                    }

                    /* Validar si esta checkd el campo de trailers */
                    if (d.getElementById('propietario_obligatorio').checked) {
                      if (d.getElementById('placat').value === '') {
                        // console.log('campos obligatorios');
                        $('#placat + p').remove();
                        const ERROR = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                        $('#placat').after(ERROR);
                        AplicaFoco('#placat');
                        msg_error += '<p>Debe diligenciar <strong>placa</strong> del trailer para poder crear la solicitud.</p>';
                      } else {
                        $('#placat + p').remove();
                        RemueveFoco('#placat');
                      }

                      if (d.getElementById('docproptrailer').value === '') {
                        $('#docproptrailer + p').remove();
                        const ERROR2 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                        $('#docproptrailer').after(ERROR2);
                        AplicaFoco('#docproptrailer');
                        msg_error += '<p>Debe diligenciar <strong>Documento Propietario trailer</strong> para poder crear la solicitud.</p>';
                      } else {
                        $('#docproptrailer + p').remove();
                        RemueveFoco('#docproptrailer');
                      }

                      if (d.getElementById('nomproptrailer').value === '') {
                        $('#nomproptrailer + p').remove();
                        const ERROR3 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                        $('#nomproptrailer').after(ERROR3);
                        AplicaFoco('#nomproptrailer');
                        msg_error += '<p>Debe diligenciar <strong>Nombre Propietario Trailer</strong> para poder crear la solicitud.</p>';
                      } else {
                        $('#nomproptrailer + p').remove();
                        RemueveFoco('#nomproptrailer');
                      }
                    } else {
                      // console.log('campos no obligatorios');
                      $('#placat + p').remove();
                      $('#docproptrailer + p').remove();
                      $('#nomproptrailer + p').remove();
                      RemueveFoco('#placat');
                      RemueveFoco('#docproptrailer');
                      RemueveFoco('#nomproptrailer');
                    }

                    if (d.getElementById('habil').checked) {
                      if (!$('#referencias_empresariales1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Referencias laboral 1</strong> para poder crear la solicitud.</p>';
                      }
                      if (!$('#celular_ref1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Celular laboral 1</strong> para poder crear la solicitud.</p>';
                      }
                      if (!$('#referencias_empresariales2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Referencias laboral 2</strong> para poder crear la solicitud.</p>';
                      }
                      if (!$('#celular_ref2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Celular laboral 2</strong> para poder crear la solicitud.</p>';
                      }
                      if (!$('#referencias_empresariales3').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Referencias laboral 3</strong> para poder crear la solicitud.</p>';
                      }
                      if (!$('#celular_ref3').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Celular laboral 3</strong> para poder crear la solicitud.</p>';
                      }
                      //personales
                      if (!$('#referencias_personales1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Nombre persona 1</strong> para poder crear la solicitud.</p>';
                      }
                      if (!$('#parenp1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Parentezco 1</strong> para poder crear la solicitud.</p>';
                      }
                      if (!$('#telefonop1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Teléfono 1</strong> en ref. personal para poder crear la solicitud.</p>';
                      }
                      if (!$('#referencias_personales2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Nombre persona 2</strong> en ref. personal para poder crear la solicitud.</p>';
                      }
                      if (!$('#parenp2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Parentezco 2</strong> para poder crear la solicitud.</p>';
                      }
                      if (!$('#telefonop2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Teléfono 2</strong> para poder crear la solicitud.</p>';
                      }
                    }
                  }
                  if (!msg_error && $('#estado_prefiltron').val() == '') {
                    if (d.getElementById('habil').checked) {
                      let data = new FormData();
                      var operacion;
                      if ($('#update').is(':checked')) {
                        operacion = 'Actualizar';
                      }
                      if ($('#habil').is(':checked')) {
                        operacion = 'Habilitar';
                      }
                      let fletef = $('#su_propuesto').val().split(',').join('');
                      let tarifaf = $('#su_tarifacot').val().split(',').join('');
                      data.append('tipo_operacion', operacion);
                      data.append('placa', d.getElementById('placag').value);
                      data.append('flete_subasta', fletef);
                      data.append('tarifa_subasta', tarifaf);
                      data.append('fecha', $('#fpree').val());
                      data.append('hora', $('#hpree').val());
                      data.append('usuario', $('#userpree').val());
                      data.append('papeles', 'sin_datos');
                      data.append('solicitud', d.getElementById('servicio_base').value);
                      data.append('responsable_vehiculo', $('#responsable_vehiculo').val());
                      data.append('EscenarioId', EscenarioId); ss
                      // Solicitudes de servicio
                      var solicitudes = d.getElementsByName('fserva[]');
                      for (var i = 0; i < solicitudes.length; i++) {
                        data.append('fserva[]', solicitudes[i].value);
                      }

                      //se construye el objeto que almacena los datos
                      let element = {
                        tipohojahv: [],
                        campos: [],
                        datos: [],
                        namearchivo: [],
                      };

                      await fetch($('#id_url_ajax').val() + 'validacionparametros/Insert_estudio_itr_subasta', {
                        method: 'POST',
                        body: data,
                        cache: 'no-cache',
                      })
                        .then(response => {
                          if (!response.ok) throw new Error(response.statusText);
                          return response.json();
                        })
                        .then(function (data) {
                          if (data.numero === 200) {
                            mensaje = `
                              <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
                                  <div class="icon"><span class="mdi mdi-check"></span></div>
                                  <div class="message">
                                    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                    <strong>Mensaje!</strong> ${data.mensaje}
                                  </div>
                              </div>`;
                            $('#crea_vehiculopreestudio').modal('hide');
                            Filtro();
                            Limpiarmodal();
                            Ocultarbloque();
                          } else {
                            mensaje = `
                              <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
                                  <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                                  <div class="message">
                                    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                    <strong>Mensaje!</strong> ${data.mensaje}
                                  </div>
                              </div>`;
                            $('#crear_preestudio').show();
                          }
                          d.getElementById('historicos').innerHTML = mensaje;
                        })
                        .catch(error => {
                          alert(error);
                          $('#crear_preestudio').show();
                        });
                    }
                  } else {
                    $('#nexos_messages_popup').html(
                      '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
                      msg_error +
                      '</div></div>',
                    );
                    $('#crea_vehiculopreestudio').animate({ scrollTop: 0 }, 600);
                    $('#crear_preestudio').show();
                  }
                } else {
                  // Código a ejecutar si el usuario hace clic en "Cancelar"
                  $('#crear_preestudio').show();
                }
              } else {
                mensaje = `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> Debes diligenciar la placa para la solicitud de servicio
                      </div>
                  </div>`;
                d.getElementById('historicos').innerHTML = mensaje;
                // alert("debe diligenciar la placa para la solicitud");
                $('#crear_preestudio').show();
              }
            } else {
              // console.log('debe diligenciar la validacion de parametros');
              d.getElementById('mensaje_itr').innerHTML = `
              <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><span class="mdi mdi-alert-triangle"></span></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Advertencia!</strong> Debe verificar los datos para poder generar la orden de cargue nuevamente.
                </div>
              </div>`;
            }
          } else {
            if (datos_validado >= 4) {
              var radio = d.getElementById('habil');
              radio.checked = true; // Marcar como seleccionado
              if (d.getElementById('placa').value !== '') {
                if (window.confirm('¿Estas seguro de realizar la operación de solicitud de vehiculo?')) {
                  // Código a ejecutar si el usuario hace clic en "Aceptar"
                  var msg_error = '';
                  if ($('#papeles').is(':checked')) {
                    var p;
                    for (p = 1; p == b; p++) {
                      //var papeles = document.getElementById('documento'+i+'').files;
                      if (!$('#tipohoja' + p + '').val()) {
                        msg_error += '<p>Debe diligenciar el campo <strong>Tipo hoja de vida  en la fila ' + p + '</strong> para poder crear el prefiltro.</p>';
                      }
                      if (!$('#ruta' + p + '').val()) {
                        msg_error += '<p>Debe seleccionar el campo <strong>Tipo hoja de vida  en la fila ' + p + '</strong> para que aparezca una ruta y poder crear el prefiltro.</p>';
                      }
                      if (!$('#namearchivo' + p + '').val()) {
                        msg_error += '<p>Debe seleccionar un  <strong>(1) Archivo  en la fila ' + p + ' </strong> para poder crear el prefiltro.</p>';
                      }
                    }
                  }
                  if (!$('#placag').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#placag');
                  } else {
                    RemueveFoco('#placag');
                  }
                  if (!$('#web').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Web satélital</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#web');
                  } else {
                    RemueveFoco('#web');
                  }
                  if (!$('#user_satelite').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>usuario</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#user_satelite');
                  } else {
                    RemueveFoco('#user_satelite');
                  }
                  if (!$('#clave').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Clave</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#clave');
                  } else {
                    RemueveFoco('#clave');
                  }
                  if (!$('#nompro').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Propietario</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#nompro');
                  } else {
                    RemueveFoco('#nompro');
                  }
                  if (!$('#docupro').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Documento de Propietario</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#docupro');
                  } else {
                    RemueveFoco('#docupro');
                  }
                  if (!$('#nomtene').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Tenedor</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#nomtene');
                  } else {
                    RemueveFoco('#nomtene');
                  }
                  if (!$('#docutene').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Documento de Tenedor</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#docutene');
                  } else {
                    RemueveFoco('#docutene');
                  }
                  if (!$('#nomcondu').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Conductor</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#nomcondu');
                  } else {
                    RemueveFoco('#nomcondu');
                  }
                  if (!$('#docucondu').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Documento de Conductor</strong> para poder crear el vehículo.</p>';
                    AplicaFoco('#docucondu');
                  } else {
                    RemueveFoco('#docucondu');
                  }
                  if (!$('#su_propuesto').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Flete propuesto </strong>en datos de la subasta para poder crear el vehículo.</p>';
                    AplicaFoco('#su_propuesto');
                  } else {
                    RemueveFoco('#su_propuesto');
                  }

                  if (!$('#responsable_vehiculo').val()) {
                    //campos dinamicos
                    msg_error += '<p>Debe seleccionar un <strong>Responsable </strong> del vehículo para poder crear la solicitud.</p>';
                    AplicaFoco('#responsable_vehiculo');
                  } else {
                    RemueveFoco('#responsable_vehiculo');
                  }

                  if (!$('input[name=gender]').is(':checked')) {
                    msg_error += '<p>Debe diligenciar el <strong>Tipo de operación</strong> para poder crear el vehículo.</p>';
                  }

                  if (!$('#total_pesos').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Total Peso(Kg) </strong>en datos de la solicitud para poder crear el vehículo.</p>';
                    AplicaFoco('#total_pesos');
                  } else {
                    RemueveFoco('#total_pesos');
                  }

                  if (!$('#capa_carga_vh').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Capacidad carga(Kg)</strong>en datos de la solicitud para poder crear el vehículo.</p>';
                    AplicaFoco('#capa_carga_vh');
                  } else {
                    if ($('#capa_carga_vh').val().length > 5) {
                      msg_error += '<p>El campo <strong>Capacidad carga(Kg)</strong> debe tener máximo 5 dígitos.</p>';
                    } else {
                      RemueveFoco('#capa_carga_vh');
                    }
                  }
                  if ($('#total_pesos').val() != '' && $('#capa_carga_vh').val() != '') {
                    var tpeso = $('#total_pesos').val().replace(/,/g, '');
                    var capacidad = $('#capa_carga_vh').val().replace(/,/g, '');
                    if (parseFloat(tpeso) > parseFloat(capacidad)) {
                      msg_error += '<p>El <strong>Total sumatoria Peso(Kg) </strong> debe ser menor o igual a la <strong>Capacidad de carga vehículo(Kg)</strong></p>';
                      AplicaFoco('#total_pesos');
                      AplicaFoco('#capa_carga_vh');
                    } else {
                      RemueveFoco('#total_pesos');
                      RemueveFoco('#capa_carga_vh');
                    }
                  }
                  if ($('#estado_prefiltron').val() == '') {
                    if (d.getElementById('nuevo').checked) {
                      if (contador_global1 < 3) {
                        msg_error += '<p>Debe diligenciar mínimo <strong>tres referencias laborales</strong> para poder crear la referencia.</p>';
                      }
                      var m;
                      for (m = 1; m <= contador_global1; m++) {
                        if (!$('#empresa_crear' + m + '').val()) {
                          msg_error += '<p>Debe diligenciar el campo <strong>Empresa ' + m + ' </strong> para poder crear la referencia.</p>';
                          AplicaFoco('#empresa_crear' + m + '');
                        } else {
                          RemueveFoco('#empresa_crear' + m + '');
                        }

                        if (!$('#numero_crear' + m + '').val()) {
                          msg_error += '<p>Debe diligenciar el campo <strong>Teléfono ' + m + ' </strong> para poder crear la referencia.</p>';
                          AplicaFoco('#numero_crear' + m + '');
                        } else {
                          if ($('#numero_crear' + m + '').val().length !== 10) {
                            msg_error += '<p>El campo <strong>Teléfono ' + m + ' </strong> debe tener 10 dígitos.</p>';
                          } else {
                            RemueveFoco('#numero_crear' + m + '');
                          }
                        }
                      }
                    }

                    /* Validar si esta checkd el campo de trailers */
                    if (d.getElementById('propietario_obligatorio').checked) {
                      if (d.getElementById('placat').value === '') {
                        // console.log('campos obligatorios');
                        $('#placat + p').remove();
                        const ERROR = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                        $('#placat').after(ERROR);
                        AplicaFoco('#placat');
                        msg_error += '<p>Debe diligenciar <strong>placa</strong> del trailer para poder crear la solicitud.</p>';
                      } else {
                        $('#placat + p').remove();
                        RemueveFoco('#placat');
                      }

                      if (d.getElementById('docproptrailer').value === '') {
                        $('#docproptrailer + p').remove();
                        const ERROR2 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                        $('#docproptrailer').after(ERROR2);
                        AplicaFoco('#docproptrailer');
                        msg_error += '<p>Debe diligenciar <strong>Documento Propietario trailer</strong> para poder crear la solicitud.</p>';
                      } else {
                        $('#docproptrailer + p').remove();
                        RemueveFoco('#docproptrailer');
                      }

                      if (d.getElementById('nomproptrailer').value === '') {
                        $('#nomproptrailer + p').remove();
                        const ERROR3 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                        $('#nomproptrailer').after(ERROR3);
                        AplicaFoco('#nomproptrailer');
                        msg_error += '<p>Debe diligenciar <strong>Nombre Propietario Trailer</strong> para poder crear la solicitud.</p>';
                      } else {
                        $('#nomproptrailer + p').remove();
                        RemueveFoco('#nomproptrailer');
                      }
                    } else {
                      // console.log('campos no obligatorios');
                      $('#placat + p').remove();
                      $('#docproptrailer + p').remove();
                      $('#nomproptrailer + p').remove();
                      RemueveFoco('#placat');
                      RemueveFoco('#docproptrailer');
                      RemueveFoco('#nomproptrailer');
                    }

                    if (d.getElementById('habil').checked) {
                      if (!$('#referencias_empresariales1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Referencias laboral 1</strong> para poder crear la solicitud.</p>';
                      }
                      if (!$('#celular_ref1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Celular laboral 1</strong> para poder crear la solicitud.</p>';
                      }
                      if (!$('#referencias_empresariales2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Referencias laboral 2</strong> para poder crear la solicitud.</p>';
                      }
                      if (!$('#celular_ref2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Celular laboral 2</strong> para poder crear la solicitud.</p>';
                      }
                      if (!$('#referencias_empresariales3').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Referencias laboral 3</strong> para poder crear la solicitud.</p>';
                      }
                      if (!$('#celular_ref3').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Celular laboral 3</strong> para poder crear la solicitud.</p>';
                      }
                      //personales
                      if (!$('#referencias_personales1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Nombre persona 1</strong> para poder crear la solicitud.</p>';
                      }
                      if (!$('#parenp1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Parentezco 1</strong> para poder crear la solicitud.</p>';
                      }
                      if (!$('#telefonop1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Teléfono 1</strong> en ref. personal para poder crear la solicitud.</p>';
                      }
                      if (!$('#referencias_personales2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Nombre persona 2</strong> en ref. personal para poder crear la solicitud.</p>';
                      }
                      if (!$('#parenp2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Parentezco 2</strong> para poder crear la solicitud.</p>';
                      }
                      if (!$('#telefonop2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Teléfono 2</strong> para poder crear la solicitud.</p>';
                      }
                    }
                  }
                  if (!msg_error && $('#estado_prefiltron').val() == '') {
                    if (d.getElementById('habil').checked) {
                      let data = new FormData();
                      var operacion;
                      if ($('#update').is(':checked')) {
                        operacion = 'Actualizar';
                      }
                      if ($('#habil').is(':checked')) {
                        operacion = 'Habilitar';
                      }
                      let fletef = $('#su_propuesto').val().split(',').join('');
                      let tarifaf = $('#su_tarifacot').val().split(',').join('');
                      data.append('tipo_operacion', operacion);
                      data.append('placa', d.getElementById('placag').value);
                      data.append('flete_subasta', fletef);
                      data.append('tarifa_subasta', tarifaf);
                      data.append('fecha', $('#fpree').val());
                      data.append('hora', $('#hpree').val());
                      data.append('usuario', $('#userpree').val());
                      data.append('papeles', 'sin_datos');
                      data.append('solicitud', d.getElementById('servicio_base').value);
                      data.append('responsable_vehiculo', $('#responsable_vehiculo').val());
                      data.append('EscenarioId', EscenarioId);
                      // Solicitudes de servicio
                      var solicitudes = d.getElementsByName('fserva[]');
                      for (var i = 0; i < solicitudes.length; i++) {
                        data.append('fserva[]', solicitudes[i].value);
                      }
                      //se construye el objeto que almacena los datos
                      let element = {
                        tipohojahv: [],
                        campos: [],
                        datos: [],
                        namearchivo: [],
                      };

                      await fetch($('#id_url_ajax').val() + 'validacionparametros/Insert_estudio_itr_subasta', {
                        method: 'POST',
                        body: data,
                        cache: 'no-cache',
                      })
                        .then(response => {
                          if (!response.ok) throw new Error(response.statusText);
                          return response.json();
                        })
                        .then(function (data) {
                          if (data.numero === 200) {
                            mensaje = `
                              <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
                                  <div class="icon"><span class="mdi mdi-check"></span></div>
                                  <div class="message">
                                    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                    <strong>Mensaje!</strong> ${data.mensaje}
                                  </div>
                              </div>`;
                            $('#crea_vehiculopreestudio').modal('hide');
                            Filtro();
                            Limpiarmodal();
                            Ocultarbloque();
                          } else {
                            mensaje = `
                              <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
                                  <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                                  <div class="message">
                                    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                    <strong>Mensaje!</strong> ${data.mensaje}
                                  </div>
                              </div>`;
                            $('#crear_preestudio').show();
                          }
                          d.getElementById('historicos').innerHTML = mensaje;
                        })
                        .catch(error => {
                          alert(error);
                          $('#crear_preestudio').show();
                        });
                    }
                  } else {
                    $('#nexos_messages_popup').html(
                      '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
                      msg_error +
                      '</div></div>',
                    );
                    $('#crea_vehiculopreestudio').animate({ scrollTop: 0 }, 600);
                    $('#crear_preestudio').show();
                  }
                } else {
                  // Código a ejecutar si el usuario hace clic en "Cancelar"
                  $('#crear_preestudio').show();
                }
              } else {
                mensaje = `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> Debes diligenciar la placa para la solicitud de servicio
                      </div>
                  </div>`;
                d.getElementById('historicos').innerHTML = mensaje;
                // alert("debe diligenciar la placa para la solicitud");
                $('#crear_preestudio').show();
              }
            } else {
              // console.log('debe diligenciar la validacion de parametros');
              d.getElementById('mensaje_itr').innerHTML = `
              <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><span class="mdi mdi-alert-triangle"></span></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Advertencia!</strong> Debe verificar los datos para poder generar la orden de cargue nuevamente.
                </div>
              </div>`;
            }
          }
        }
      } else {
        if (d.getElementById('placa').value !== '') {
          if (window.confirm('¿Estas seguro de realizar la operación de solicitud de vehiculo?')) {
            // Código a ejecutar si el usuario hace clic en "Aceptar"
            var msg_error = '';
            if ($('#papeles').is(':checked')) {
              var p;
              for (p = 1; p == b; p++) {
                //var papeles = document.getElementById('documento'+i+'').files;
                if (!$('#tipohoja' + p + '').val()) {
                  msg_error += '<p>Debe diligenciar el campo <strong>Tipo hoja de vida  en la fila ' + p + '</strong> para poder crear el prefiltro.</p>';
                }
                if (!$('#ruta' + p + '').val()) {
                  msg_error += '<p>Debe seleccionar el campo <strong>Tipo hoja de vida  en la fila ' + p + '</strong> para que aparezca una ruta y poder crear el prefiltro.</p>';
                }
                if (!$('#namearchivo' + p + '').val()) {
                  msg_error += '<p>Debe seleccionar un  <strong>(1) Archivo  en la fila ' + p + ' </strong> para poder crear el prefiltro.</p>';
                }
              }
            }
            if (!$('#placag').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el vehículo.</p>';
              AplicaFoco('#placag');
            } else {
              RemueveFoco('#placag');
            }
            if (!$('#web').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Web satélital</strong> para poder crear el vehículo.</p>';
              AplicaFoco('#web');
            } else {
              RemueveFoco('#web');
            }
            if (!$('#user_satelite').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>usuario</strong> para poder crear el vehículo.</p>';
              AplicaFoco('#user_satelite');
            } else {
              RemueveFoco('#user_satelite');
            }
            if (!$('#clave').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Clave</strong> para poder crear el vehículo.</p>';
              AplicaFoco('#clave');
            } else {
              RemueveFoco('#clave');
            }
            if (!$('#nompro').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Propietario</strong> para poder crear el vehículo.</p>';
              AplicaFoco('#nompro');
            } else {
              RemueveFoco('#nompro');
            }
            if (!$('#docupro').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Documento de Propietario</strong> para poder crear el vehículo.</p>';
              AplicaFoco('#docupro');
            } else {
              RemueveFoco('#docupro');
            }
            if (!$('#nomtene').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Tenedor</strong> para poder crear el vehículo.</p>';
              AplicaFoco('#nomtene');
            } else {
              RemueveFoco('#nomtene');
            }
            if (!$('#docutene').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Documento de Tenedor</strong> para poder crear el vehículo.</p>';
              AplicaFoco('#docutene');
            } else {
              RemueveFoco('#docutene');
            }
            if (!$('#nomcondu').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Conductor</strong> para poder crear el vehículo.</p>';
              AplicaFoco('#nomcondu');
            } else {
              RemueveFoco('#nomcondu');
            }
            if (!$('#docucondu').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Documento de Conductor</strong> para poder crear el vehículo.</p>';
              AplicaFoco('#docucondu');
            } else {
              RemueveFoco('#docucondu');
            }
            if (!$('#su_propuesto').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Flete propuesto </strong>en datos de la subasta para poder crear el vehículo.</p>';
              AplicaFoco('#su_propuesto');
            } else {
              RemueveFoco('#su_propuesto');
            }

            if (!$('#responsable_vehiculo').val()) {
              //campos dinamicos
              msg_error += '<p>Debe seleccionar un <strong>Responsable </strong> del vehículo para poder crear la solicitud.</p>';
              AplicaFoco('#responsable_vehiculo');
            } else {
              RemueveFoco('#responsable_vehiculo');
            }

            if (!$('input[name=gender]').is(':checked')) {
              msg_error += '<p>Debe diligenciar el <strong>Tipo de operación</strong> para poder crear el vehículo.</p>';
            }

            if (!$('#total_pesos').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Total Peso(Kg) </strong>en datos de la solicitud para poder crear el vehículo.</p>';
              AplicaFoco('#total_pesos');
            } else {
              RemueveFoco('#total_pesos');
            }

            if (!$('#capa_carga_vh').val()) {
              msg_error += '<p>Debe diligenciar el campo <strong>Capacidad carga(Kg)</strong>en datos de la solicitud para poder crear el vehículo.</p>';
              AplicaFoco('#capa_carga_vh');
            } else {
              if ($('#capa_carga_vh').val().length > 5) {
                msg_error += '<p>El campo <strong>Capacidad carga(Kg)</strong> debe tener máximo 5 dígitos.</p>';
              } else {
                RemueveFoco('#capa_carga_vh');
              }
            }
            if ($('#total_pesos').val() != '' && $('#capa_carga_vh').val() != '') {
              var tpeso = $('#total_pesos').val().replace(/,/g, '');
              var capacidad = $('#capa_carga_vh').val().replace(/,/g, '');
              if (parseFloat(tpeso) > parseFloat(capacidad)) {
                msg_error += '<p>El <strong>Total sumatoria Peso(Kg) </strong> debe ser menor o igual a la <strong>Capacidad de carga vehículo(Kg)</strong></p>';
                AplicaFoco('#total_pesos');
                AplicaFoco('#capa_carga_vh');
              } else {
                RemueveFoco('#total_pesos');
                RemueveFoco('#capa_carga_vh');
              }
            }
            if ($('#estado_prefiltron').val() == '') {
              if (d.getElementById('nuevo').checked) {
                if (contador_global1 < 3) {
                  msg_error += '<p>Debe diligenciar mínimo <strong>tres referencias laborales</strong> para poder crear la referencia.</p>';
                }
                var m;
                for (m = 1; m <= contador_global1; m++) {
                  if (!$('#empresa_crear' + m + '').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Empresa ' + m + ' </strong> para poder crear la referencia.</p>';
                    AplicaFoco('#empresa_crear' + m + '');
                  } else {
                    RemueveFoco('#empresa_crear' + m + '');
                  }

                  if (!$('#numero_crear' + m + '').val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Teléfono ' + m + ' </strong> para poder crear la referencia.</p>';
                    AplicaFoco('#numero_crear' + m + '');
                  } else {
                    if ($('#numero_crear' + m + '').val().length !== 10) {
                      msg_error += '<p>El campo <strong>Teléfono ' + m + ' </strong> debe tener 10 dígitos.</p>';
                    } else {
                      RemueveFoco('#numero_crear' + m + '');
                    }
                  }
                }
              }

              /* Validar si esta checkd el campo de trailers */
              if (d.getElementById('propietario_obligatorio').checked) {
                if (d.getElementById('placat').value === '') {
                  // console.log('campos obligatorios');
                  $('#placat + p').remove();
                  const ERROR = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                  $('#placat').after(ERROR);
                  AplicaFoco('#placat');
                  msg_error += '<p>Debe diligenciar <strong>placa</strong> del trailer para poder crear la solicitud.</p>';
                } else {
                  $('#placat + p').remove();
                  RemueveFoco('#placat');
                }

                if (d.getElementById('docproptrailer').value === '') {
                  $('#docproptrailer + p').remove();
                  const ERROR2 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                  $('#docproptrailer').after(ERROR2);
                  AplicaFoco('#docproptrailer');
                  msg_error += '<p>Debe diligenciar <strong>Documento Propietario trailer</strong> para poder crear la solicitud.</p>';
                } else {
                  $('#docproptrailer + p').remove();
                  RemueveFoco('#docproptrailer');
                }

                if (d.getElementById('nomproptrailer').value === '') {
                  $('#nomproptrailer + p').remove();
                  const ERROR3 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                  $('#nomproptrailer').after(ERROR3);
                  AplicaFoco('#nomproptrailer');
                  msg_error += '<p>Debe diligenciar <strong>Nombre Propietario Trailer</strong> para poder crear la solicitud.</p>';
                } else {
                  $('#nomproptrailer + p').remove();
                  RemueveFoco('#nomproptrailer');
                }
              } else {
                // console.log('campos no obligatorios');
                $('#placat + p').remove();
                $('#docproptrailer + p').remove();
                $('#nomproptrailer + p').remove();
                RemueveFoco('#placat');
                RemueveFoco('#docproptrailer');
                RemueveFoco('#nomproptrailer');
              }

              if (d.getElementById('habil').checked || d.getElementById('update').checked) {
                if (!$('#referencias_empresariales1').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Referencias laboral 1</strong> para poder crear la solicitud.</p>';
                }
                if (!$('#celular_ref1').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Celular laboral 1</strong> para poder crear la solicitud.</p>';
                }
                if (!$('#referencias_empresariales2').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Referencias laboral 2</strong> para poder crear la solicitud.</p>';
                }
                if (!$('#celular_ref2').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Celular laboral 2</strong> para poder crear la solicitud.</p>';
                }
                if (!$('#referencias_empresariales3').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Referencias laboral 3</strong> para poder crear la solicitud.</p>';
                }
                if (!$('#celular_ref3').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Celular laboral 3</strong> para poder crear la solicitud.</p>';
                }
                //personales
                if (!$('#referencias_personales1').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Nombre persona 1</strong> para poder crear la solicitud.</p>';
                }
                if (!$('#parenp1').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Parentezco 1</strong> para poder crear la solicitud.</p>';
                }
                if (!$('#telefonop1').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Teléfono 1</strong> en ref. personal para poder crear la solicitud.</p>';
                }
                if (!$('#referencias_personales2').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Nombre persona 2</strong> en ref. personal para poder crear la solicitud.</p>';
                }
                if (!$('#parenp2').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Parentezco 2</strong> para poder crear la solicitud.</p>';
                }
                if (!$('#telefonop2').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Teléfono 2</strong> para poder crear la solicitud.</p>';
                }
                if (d.getElementById('update').checked) {
                  if (!d.getElementById('cbox1').checked && !d.getElementById('cbox2').checked) {
                    msg_error += '<p>Debe seleccionar <strong>una opción de recurso</strong> para poder crear la solicitud (Actualiza seguridad).</p>';
                  } else {
                    if (d.getElementById('cbox1').checked) {
                      //registrar campos nuevos
                      if (
                        !d.getElementById('cbpre1').checked &&
                        !d.getElementById('cbpre2').checked &&
                        !d.getElementById('cbpre3').checked &&
                        !d.getElementById('cbpre4').checked &&
                        !d.getElementById('cbpre5').checked
                      ) {
                        msg_error += '<p>Por favor seleccione el recurso a crear , opción seleccionada <strong>Recursos inexistentes</strong>.</p>';
                      } else {
                        if (d.getElementById('cbpre1').checked) {
                          //propietario
                          if (!$('#name_propietario').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Nombre Propietario</strong> para poder crear la solicitud.</p>';
                          }
                          if (!$('#number_propietario').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Documento Propietario</strong> para poder crear la solicitud.</p>';
                          }
                        }

                        if (d.getElementById('cbpre2').checked) {
                          //poseedor
                          if (!$('#name_poseedor').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Nombre Poseedor</strong> para poder crear la solicitud.</p>';
                          }
                          if (!$('#number_poseedor').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Documento Poseedor</strong> para poder crear la solicitud.</p>';
                          }
                        }

                        if (d.getElementById('cbpre3').checked) {
                          //conductor
                          if (!$('#name_conductor').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Nombre Conductor</strong> para poder crear la solicitud.</p>';
                          }
                          if (!$('#number_conductor').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Documento Conductor</strong> para poder crear la solicitud.</p>';
                          }
                          if (!$('#referencias_empresariales1pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Nombre referencia 1</strong> para poder crear la solicitud.</p>';
                          }
                          if (!$('#contacto_ref1pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Persona contacto 1</strong> para poder crear la solicitud.</p>';
                          }
                          if (!$('#celular_ref1pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Celular empresa 1</strong> para poder crear la solicitud.</p>';
                          }
                          if (!$('#referencias_empresariales2pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Nombre referencia 2</strong> para poder crear la solicitud.</p>';
                          }
                          if (!$('#contacto_ref2pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Persona contacto 2</strong> para poder crear la solicitud.</p>';
                          }
                          if (!$('#celular_ref2pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Celular empresa 2</strong> para poder crear la solicitud.</p>';
                          }
                          if (!$('#referencias_empresariales3pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Nombre referencia 3</strong> para poder crear la solicitud.</p>';
                          }
                          if (!$('#contacto_ref3pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Persona contacto 3</strong> para poder crear la solicitud.</p>';
                          }
                          if (!$('#celular_ref3pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Celular empresa 3</strong> para poder crear la solicitud.</p>';
                          }
                        }

                        if (d.getElementById('cbpre4').checked) {
                          //trailer
                          if (!$('#placa_trailerpre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Placa tráiler</strong> para poder crear la solicitud.</p>';
                          }
                          if (!$('#propi_trailer').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Nombre propietario tráiler</strong> para poder crear la solicitud.</p>';
                          }
                          if (!$('#propidocu_trailer').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Documento propietario tráiler</strong> para poder crear la solicitud.</p>';
                          }
                        }
                      }
                    }
                    if (d.getElementById('cbox2').checked) {
                      //campos dinamicos
                      var idfila = $('#cuerpo_actu tr').length; //cantidad de filas de la tabla
                      if (idfila == 0) {
                        msg_error += '<p>Debe ingresar <strong>Mínimo 1 dato </strong> en bloque actualizar seguridad para poder crear la solicitud.</p>';
                      }
                    }
                  }
                }
              }
            }
            if (!msg_error && $('#estado_prefiltron').val() == '') {
              if (comprobar() === false) {
                if (d.getElementById('nuevo').checked) {
                  let data = new FormData();
                  var operacion;
                  if ($('#update').is(':checked')) {
                    operacion = 'Actualizar';
                  }

                  if ($('#nuevo').is(':checked')) {
                    operacion = 'Nuevo';
                  }
                  if ($('#habil').is(':checked')) {
                    operacion = 'Habilitar';
                  }
                  let fletef = $('#su_propuesto').val().split(',').join('');
                  let tarifaf = $('#su_tarifacot').val().split(',').join('');
                  data.append('placa', d.getElementById('placag').value);
                  // Datos del propietario del vehiculo
                  data.append('trailer', d.getElementById('placat').value);
                  data.append('documento_propietario_trailer', d.getElementById('docproptrailer').value);
                  data.append('propietario_trailer', d.getElementById('nomproptrailer').value);
                  data.append('propietario', d.getElementById('nompro').value);
                  data.append('documento_pro', d.getElementById('docupro').value);
                  data.append('tenedor', d.getElementById('nomtene').value);
                  data.append('documento_tene', d.getElementById('docutene').value);
                  data.append('conductor', d.getElementById('nomcondu').value);
                  data.append('documento_condu', d.getElementById('docucondu').value);
                  data.append('web', d.getElementById('web').value);
                  data.append('user_satelite', d.getElementById('user_satelite').value);
                  data.append('clave', d.getElementById('clave').value);
                  data.append('tipologianuevo', $('#nuevo').val());
                  data.append('tipologiahabilte', $('#habilite').val());
                  data.append('tipologiaactualice', $('#actualice').val());
                  data.append('tipo_operacion', operacion);
                  data.append('fecha', $('#fpree').val());
                  data.append('hora', $('#hpree').val());
                  data.append('usuario', $('#userpree').val());
                  data.append('observacion', $('#obserpree').val());
                  data.append('su_sumatorianeto', $('#su_sumatorianeto').val());
                  data.append('total_peso', $('#total_peso').val());
                  data.append('flete_subasta', fletef);
                  data.append('tarifa_subasta', tarifaf);
                  data.append('propietario_obligatorio', $('#propietario_obligatorio').is(':checked'));
                  /* Responsable de vehiculo */
                  data.append('responsable_vehiculo', $('#responsable_vehiculo').val());
                  data.append('EscenarioId', EscenarioId);

                  // Obtener los valores de los inputs de tipo array
                  var empresa = d.getElementsByName('empresa_crear[]');
                  for (var i = 0; i < empresa.length; i++) {
                    data.append('empresa_crear[]', empresa[i].value);
                  }
                  var ingreso = d.getElementsByName('fingreso_crear[]');
                  for (var i = 0; i < ingreso.length; i++) {
                    data.append('fingreso_crear[]', ingreso[i].value);
                  }
                  var retiro = d.getElementsByName('fretiro_crear[]');
                  for (var i = 0; i < retiro.length; i++) {
                    data.append('fretiro_crear[]', retiro[i].value);
                  }
                  var persona = d.getElementsByName('contacto_crear[]');
                  for (var i = 0; i < persona.length; i++) {
                    data.append('contacto_crear[]', persona[i].value);
                  }
                  var num = d.getElementsByName('numero_crear[]');
                  for (var i = 0; i < num.length; i++) {
                    data.append('numero_crear[]', num[i].value);
                  }
                  var cargo = d.getElementsByName('cargo_crear[]');
                  for (var i = 0; i < cargo.length; i++) {
                    data.append('cargo_crear[]', cargo[i].value);
                  }
                  var anti = d.getElementsByName('antiguedad_crear[]');
                  for (var i = 0; i < anti.length; i++) {
                    data.append('antiguedad_crear[]', anti[i].value);
                  }
                  // Solicitudes de servicio
                  var solicitudes = d.getElementsByName('fserva[]');
                  for (var i = 0; i < solicitudes.length; i++) {
                    data.append('fserva[]', solicitudes[i].value);
                  }

                  //se construye el objeto que almacena los datos
                  let datos = {
                    tipohoja: [],
                    clase: [],
                    ruta: [],
                    documento: [],
                    namearchivo: [],
                    papeles: [],
                  };

                  //Archivos
                  var cantp = $('#cont_papel').val();
                  if (cantp > 0) {
                    var tipohj = d.getElementsByName('tipohoja[]');
                    for (var i = 0; i < tipohj.length; i++) {
                      var tipo = tipohj[i].value;
                      datos.tipohoja[i] = tipo;
                    }
                    var clase = d.getElementsByName('clase[]');
                    for (var i = 0; i < clase.length; i++) {
                      var clas = clase[i].value;
                      datos.clase[i] = clas;
                    }

                    var ruta = d.getElementsByName('ruta[]');
                    for (var i = 0; i < ruta.length; i++) {
                      var rut = ruta[i].value;
                      datos.ruta[i] = rut;
                    }

                    var documento = d.getElementsByName('documento[]');
                    for (var i = 0; i < documento.length; i++) {
                      var doc = documento[i].value;
                      datos.documento[i] = doc;
                    }

                    var namearchivo = d.getElementsByName('namearchivo[]');
                    for (var i = 0; i < namearchivo.length; i++) {
                      var name = namearchivo[i].value;
                      datos.namearchivo[i] = name;
                    }

                    var u;
                    for (u = 1; u <= cantp; u++) {
                      data.append('Papel', $('#papeles').is(':checked'));
                      var papeles = document.getElementById('documento' + u + '').files;
                      if (papeles.length > 0) {
                        for (var a = 0; a < papeles.length; a++) {
                          data.append('papeles[]', papeles[a]);
                          // var doc = documento[a].value;
                          // datos.papeles[a] = papeles[a];
                        }
                      } else {
                        data.append('papeles', 'sin_datos');
                      }
                    }
                    // Nuevo Array completo
                    var nota = datos;
                    nota = JSON.stringify(nota);
                    data.append('notas', nota);
                  }
                  await fetch($('#id_url_ajax').val() + 'validacionparametros/Insertar_preestudio_nuevo', {
                    method: 'POST',
                    body: data,
                    cache: 'no-cache',
                  })
                    .then(response => {
                      if (!response.ok) throw new Error(response.statusText);
                      return response.json();
                    })
                    .then(function (datas) {
                      console.log(datas);
                      if (datas) {
                        alert(datas);
                        $('#crea_vehiculopreestudio').modal('hide');
                        Filtro();
                        Limpiarmodal();
                        Ocultarbloque();
                        $('#crear_preestudio').show();
                      } else {
                        alert('error');
                        $('#crear_preestudio').show();
                      }
                    })
                    .catch(error => {
                      alert(error);
                      $('#crear_preestudio').show();
                    });
                }
              }

              if (d.getElementById('habil').checked || d.getElementById('update').checked) {
                let data = new FormData();
                var operacion;
                if ($('#update').is(':checked')) {
                  operacion = 'Actualizar';
                }
                if ($('#habil').is(':checked')) {
                  operacion = 'Habilitar';
                }
                let fletef = $('#su_propuesto').val().split(',').join('');
                let tarifaf = $('#su_tarifacot').val().split(',').join('');
                data.append('tipo_operacion', operacion);
                data.append('placa', d.getElementById('placag').value);
                data.append('flete_subasta', fletef);
                data.append('tarifa_subasta', tarifaf);
                data.append('fecha', $('#fpree').val());
                data.append('hora', $('#hpree').val());
                data.append('usuario', $('#userpree').val());
                data.append('papeles', 'sin_datos');
                data.append('observacion', $('#obserpree').val());
                /* Responsable de vehiculo */
                data.append('responsable_vehiculo', $('#responsable_vehiculo').val());
                data.append('EscenarioId', EscenarioId);

                // Solicitudes de servicio
                var solicitudes = d.getElementsByName('fserva[]');
                for (var i = 0; i < solicitudes.length; i++) {
                  data.append('fserva[]', solicitudes[i].value);
                }

                //se construye el objeto que almacena los datos
                let element = {
                  tipohojahv: [],
                  campos: [],
                  datos: [],
                  namearchivo: [],
                };

                if ($('#update').is(':checked')) {
                  //insercion de datos dinamicos
                  if (d.getElementById('cbox2').checked) {
                    data.append('dinamicos', 'si');
                    var cantp = $('#valortb').val();
                    if (cantp > 0) {
                      var e, n;
                      for (e = 1; e <= cantp; e++) {
                        if (typeof $('#sa' + e).val() !== 'undefined') {
                          var tipohv = $('#fila' + e + '').find('td').eq(1).html();
                          var campo = $('#fila' + e + '').find('td').eq(2).html();
                          var dato = $('#fila' + e + '').find('td').eq(3).html();
                          var namea = $('#nam' + e + '').val();
                          var papeles = document.getElementById('arc' + e + '').files;
                          if (papeles.length > 0) {
                            for (var a = 0; a < papeles.length; a++) {
                              data.append('papeles[]', papeles[a]);
                            }
                          } else {
                            data.append('papeles', 'Sin_datos');
                          }
                          element.tipohojahv.push(tipohv);
                          element.campos.push(campo);
                          element.namearchivo.push(namea);
                          element.datos.push(dato);
                          // Nuevo Array completo
                          var nota = element;
                          nota = JSON.stringify(nota);
                          data.append('notas', nota);
                        }
                      }
                    }
                  } else {
                    data.append('dinamicos', 'no');
                  }

                  //inserción de recursos inexistentes es decir, nuevos
                  if (d.getElementById('cbox1').checked) {
                    data.append('nuevos_recursos', 'si');
                    if (d.getElementById('cbpre1').checked) {
                      //propietario
                      tipologia = 'propietario';
                      var name_propie = $('#name_propietario').val();
                      var tipohv = 'Propietario';
                      var docu_propi = $('#number_propietario').val();
                      data.append('propietario_check', $('#cbpre1').is(':checked'));
                      data.append('tipo_propi', tipologia);
                      data.append('nombre_propietario', name_propie);
                      data.append('docu_propi', docu_propi);
                    } else {
                      data.append('propietario_check', $('#cbpre1').is(':checked'));
                    }
                    if (d.getElementById('cbpre2').checked) {
                      //poseedor
                      tipologia = 'tenedor';
                      campo = 'Nombre';
                      name_posee = $('#name_poseedor').val();
                      data.append('poseedor_check', $('#cbpre2').is(':checked'));
                      docu_posee = $('#number_poseedor').val();
                      data.append('tipo_posee', tipologia);
                      data.append('nombre_poseedor', name_posee);
                      data.append('docu_posee', docu_posee);
                    } else {
                      data.append('poseedor_check', $('#cbpre2').is(':checked'));
                    }
                    if (d.getElementById('cbpre3').checked) {
                      //conductor
                      tipologia = 'conductor';
                      campo = 'Nombre';
                      cedula = $('#number_conductor').val();
                      nombre = $('#name_conductor').val();
                      ref1 = $('#referencias_empresariales1pre').val();
                      per1 = $('#contacto_ref1pre').val();
                      cel1 = $('#celular_ref1pre').val();
                      cargo1 = $('#cargo_ref1pre').val();
                      fec1 = $('#fingresoa1pre').val();
                      fec11 = $('#fretiroa3pre').val();
                      anti = $('#anti_ref1pre').val();
                      //
                      ref2 = $('#referencias_empresariales2pre').val();
                      per2 = $('#contacto_ref2pre').val();
                      cel2 = $('#celular_ref2pre').val();
                      cargo2 = $('#cargo_ref2pre').val();
                      fec2 = $('#fingresob1pre').val();
                      fec22 = $('#fretirob3pre').val();
                      anti2 = $('#anti_ref2pre').val();
                      //
                      ref3 = $('#referencias_empresariales3pre').val();
                      per3 = $('#contacto_ref3pre').val();
                      cel3 = $('#celular_ref3pre').val();
                      cargo3 = $('#cargo_ref3pre').val();
                      fec3 = $('#fingresoc1pre').val();
                      fec33 = $('#fretiroc3pre').val();
                      anti3 = $('#anti_ref3pre').val();

                      data.append('conductor_check', $('#cbpre3').is(':checked'));
                      data.append('tipo_condu', tipologia);
                      data.append('nombre_conductor', nombre);
                      data.append('docu_condu', cedula);
                      data.append('refe1', ref1);
                      data.append('contacto1', per1);
                      data.append('celular1', cel1);
                      data.append('cargo1', cargo1);
                      data.append('fechaa1', $('#fingresoa1pre').val());
                      data.append('fechaa2', fec11);
                      data.append('anti1', anti);
                      data.append('refe2', ref2);
                      data.append('contacto2', per2);
                      data.append('celular2', cel2);
                      data.append('cargo2', cargo2);
                      data.append('fechab1', fec2);
                      data.append('fechab2', fec22);
                      data.append('anti2', anti2);
                      data.append('refe3', ref3);
                      data.append('contacto3', per3);
                      data.append('celular3', cel3);
                      data.append('cargo3', cargo3);
                      data.append('fechac1', fec3);
                      data.append('fechac2', $('#fretiroc3pre').val());
                      data.append('anti3', anti3);
                    } else {
                      data.append('conductor_check', $('#cbpre3').is(':checked'));
                    }

                    if (d.getElementById('cbpre4').checked) {
                      //trailer
                      tipologia = 'trailer';
                      campo = 'Nombre';
                      placa = $('#placa_trailerpre').val();
                      propi = $('#propi_trailer').val();
                      docupropit = $('#propidocu_trailer').val();
                      data.append('trailer_check', $('#cbpre4').is(':checked'));
                      data.append('tipo_trai', tipologia);
                      data.append('placa_trailer', placa);
                      data.append('propi_trailer', propi);
                      data.append('propidoc_trailer', docupropit);
                    } else {
                      data.append('trailer_check', $('#cbpre4').is(':checked'));
                    }
                  }
                }

                await fetch($('#id_url_ajax').val() + 'validacionparametros/Insert_estudio', {
                  method: 'POST',
                  body: data,
                  cache: 'no-cache',
                })
                  .then(response => {
                    if (!response.ok) throw new Error(response.statusText);
                    return response.json();
                  })
                  .then(function (data) {
                    if (data.numero === 200) {
                      mensaje = `
                        <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
                            <div class="icon"><span class="mdi mdi-check"></span></div>
                            <div class="message">
                              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                              <strong>Mensaje!</strong> ${data.mensaje}
                            </div>
                        </div>`;
                      $('#crea_vehiculopreestudio').modal('hide');
                      Filtro();
                      Limpiarmodal();
                      Ocultarbloque();
                    } else {
                      mensaje = `
                        <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
                            <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                            <div class="message">
                              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                              <strong>Mensaje!</strong> ${data.mensaje}
                            </div>
                        </div>`;
                      $('#crear_preestudio').show();
                    }
                    d.getElementById('historicos').innerHTML = mensaje;
                  })
                  .catch(error => {
                    alert(error);
                    $('#crear_preestudio').show();
                  });
              }
            } else {
              $('#nexos_messages_popup').html(
                '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
                msg_error +
                '</div></div>',
              );
              $('#crea_vehiculopreestudio').animate({ scrollTop: 0 }, 600);
              $('#crear_preestudio').show();
            }
          } else {
            // Código a ejecutar si el usuario hace clic en "Cancelar"
            $('#crear_preestudio').show();
          }
        } else {
          mensaje = `
            <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> Debes diligenciar la placa para la solicitud de servicio
                </div>
            </div>`;
          d.getElementById('historicos').innerHTML = mensaje;
          $('#crear_preestudio').show();
        }
      }
    }

    //boton agregar referencias para nuevo
    if (e.target.matches('#agregar_fila') || e.target.matches('#agregar_fila *')) {
      agregar();
      // numero++;
      // if (numero <= 3) {
      // } else {
      //   alert('Señor usuario ha superado el máximo de referencias laborales!!');
      // }
    }

    if (e.target.matches('#btn_cerrar') || e.target.matches('#btn_cerrar')) {
      $('#placa').prop('disabled', false);
    }

    if (e.target.matches('#btn_cerrar_notificaciones')) {
      $('#mod-warning').modal('hide');
      $('#crea_vehiculopreestudio').modal('toggle');
      d.getElementById('number_propietario').value = '';
      d.getElementById('number_poseedor').value = '';
      d.getElementById('number_conductor').value = '';
      d.getElementById('propidocu_trailer').value = '';
    }

    // Verificar si el evento fue en el checkbox o en un hijo del checkbox
    if (e.target.matches('#propietario_obligatorio') || e.target.matches('#propietario_obligatorio *')) {
      // Obtener el checkbox, en caso de que el evento venga de un hijo
      const checkbox = document.getElementById('propietario_obligatorio');
      // Verificar si está marcado
      if (checkbox.checked) {
        // console.log('El checkbox está marcado');
        // d.getElementById('placat').style.readonly = false;
        $('#placat').prop('disabled', false);
        $('#docproptrailer').prop('disabled', false);
        $('#nomproptrailer').prop('disabled', false);
        d.getElementById('mensaje_trailer_obligatorio').innerHTML = `
        <div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><span class="mdi mdi-notifications"></span></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Información!</strong> Los campos del trailer son obligatorios.
          </div>
        </div>
        `;
        d.getElementById('etiqueta_placa_trailer').innerHTML = `Placa Trailer&nbsp;<span style="color:red;"><i>(*)</i></span>`;
        d.getElementById('etiqueta_documento_trailer').innerHTML = `Documento Propietario Trailer&nbsp;<span style="color:red;"><i>(*)</i></span>`;
        d.getElementById('estiqueta_propietario_trailer').innerHTML = `Nombre Propietario Trailer&nbsp;<span style="color:red;"><i>(*)</i></span>`;
      } else {
        $('#placat').prop('disabled', true);
        $('#docproptrailer').prop('disabled', true);
        $('#nomproptrailer').prop('disabled', true);
        d.getElementById('mensaje_trailer_obligatorio').innerHTML = `
        <div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><span class="mdi mdi-notifications"></span></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Información!</strong> Los campos del trailer no requeridos.
          </div>
        </div>
        `;
        d.getElementById('etiqueta_placa_trailer').innerHTML = `Placa Trailer`;
        d.getElementById('etiqueta_documento_trailer').innerHTML = `Documento Propietario Trailer`;
        d.getElementById('estiqueta_propietario_trailer').innerHTML = `Nombre Propietario Trailer`;
      }
    }
  });

  // Validar campos para el registro de vehiculos nuevos
  web.addEventListener('blur', validar_formulario);
  user_satelite.addEventListener('blur', validar_formulario);
  clave.addEventListener('blur', validar_formulario);
  nompro.addEventListener('blur', validar_formulario);
  docupro.addEventListener('blur', validar_formulario);
  nomtene.addEventListener('blur', validar_formulario);
  docutene.addEventListener('blur', validar_formulario);
  nomcondu.addEventListener('blur', validar_formulario);
  docucondu.addEventListener('blur', validar_formulario);

  function validar_formulario(e) {
    if (e.target.value.trim() === '') {
      MostrarMensaje(`El campo es obligatorio`, e.target.parentElement);
      datosnuevos[e.target.name] = '';
      comprobar();
      return;
    }
    limpiaralerta(e.target.parentElement);
    //Asignar valores
    datosnuevos[e.target.name] = e.target.value.trim().toLowerCase();
    comprobar();
  }

  function MostrarMensaje(mensaje, referencia) {
    limpiaralerta(referencia);
    const ERROR = document.createElement('P');
    ERROR.textContent = mensaje;
    ERROR.classList.add('bg-danger', "style='color:#FFF'", 'text-center', 'w-100');
    ERROR.style.fontSize = '12px';
    referencia.appendChild(ERROR);
  }

  function limpiaralerta(referencia) {
    const ALERTA = referencia.querySelector('.bg-danger');
    if (ALERTA) {
      ALERTA.remove();
    }
  }

  function comprobar() {
    console.log(Object.values(datosnuevos).includes(''));
    if (Object.values(datosnuevos).includes('')) {
      return true;
    } else {
      return false;
    }
  }
});

// Agregar Filas
var cont = 0;
var m = 0;
var contador_global1 = 0;

function agregar() {
  cont++;
  m++;
  contador_global1 = contador_global1 + 1;
  var hoy = moment().format('YYYY-MM-DD');

  if (contador_global1 <= 3) {
    var referencias = `
    <tr id="tr${cont}">
      <tr style="text-align:left; color:white; background-color:#332D2D;margin-top: 10px;">
        <th style="text-align:center;" >Empresa&nbsp;<span style="color:#DC4C64;"><i>(*)</i></span></th>
        <th style="text-align:center;">Fecha Ingreso</th>
        <th style="text-align:center;">Fecha Retiro</th>
      </tr>
      <td>
        <input type="text" id="empresa_crear${cont}" name="empresa_crear[]" class="form-control input-sm">
      </td>
      <td>
        <input type="date" id="fingreso_crear${cont}" name="fingreso_crear[]" class="form-control input-sm" value="${hoy}">
      </td>
      <td>
        <input type="date" id="fretiro_crear${cont}" name="fretiro_crear[]"  class="form-control input-sm" value="${hoy}"  >
      </td>
    </tr>
    <tr style="text-align:left; color:white; background-color:#332D2D;margin-top: 10px;">
      <th>Contacto (Nombres y Apellidos)</th>
      <th>Teléfono&nbsp;<span style="color:#DC4C64;"><i>(*)</i></span></th>
      <th>Cargo</th>
    </tr>
    <tr>
      <td>
        <input type="text" id="contacto_crear${cont}" name="contacto_crear[]" class="form-control input-sm">
      </td>
      <td>
        <input type="number" id="numero_crear${cont}" name="numero_crear[]" class="form-control input-sm">
      </td>
      <td>
        <input type="text" id="cargo_crear${cont}" name="cargo_crear[]" class="form-control input-sm">
      </td>
    </tr>
    <tr>
      <th>Antiguedad</th>
    </tr>
    <td>
      <input type="number" id="antiguedad_crear${cont}" name="antiguedad_crear[]"  class="form-control input-sm" min="0" >
    </td>
    <td style="width:10%;">
      <input type="hidden" id="" value="${m}" class="form-control" readonly="readonly">
    </td>
    <tr style="width:10px;background-color:blue;margin-top:2px;">
    <div></div>
    </tr>`;
    $('#table_mercancia').append(referencias);
  } else {
    alert('Señor usuario ha superado el máximo de referencias laborales!!');
  }
}

function preestudio(element) {
  $('#cuerpo_lista2').html('');
  $('#totalfle').val('');
  $('#tottarifa').val('');
  var elemento = $(element);
  var cotiza = elemento.data('id');
  var num = elemento.data('id2');
  var cliente = elemento.data('id3');
  var item = elemento.data('id4');
  var pareja = elemento.data('id5');
  var flete = elemento.data('id6');
  var pesoneto = elemento.data('id7'); //peso bruto tonelada
  var tipo_servicio = elemento.data('id8');
  var tarifa = elemento.data('id9');
  var origen = elemento.data('id10');
  var itr = elemento.data('id11');
  var escenario = elemento.data('id12');
  document.getElementById('crear_preestudio').setAttribute('data-escenarioId', escenario);
  listar_responsables();
  /* Validar si la solicitud de servicio esta vigente */
  let datos = new FormData();
  datos.append('solicitud_servicio_id', num);
  fetch($('#id_url_ajax').val() + 'validacionparametros/Validar_solicitud_vigencia', {
    method: 'POST',
    cache: 'no-cache',
    body: datos,
  })
    .then(response => response.json())
    .then(function (data) {
      if (data) {
        var fecha = moment().format('YYYY-MM-DD HH:mm:ss');
        var fec_fin_solicitud = data.fecha_cargue + ' ' + data.hora_cargue;
        var cant = moment(fec_fin_solicitud).diff(fecha, 'minutes');

        if (10146 - cant > 0) {
          $('#crea_vehiculopreestudio').modal('show');
          if (itr === 'Si') {
            // console.log('seRVICIO ITR');
            d.getElementById('mensaje_itr').innerHTML = `
            <div class="alert alert-contrast alert-warning alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-alert-triangle"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Advertencia!</strong> Este Vehiculo sera clasificada como proceso ITR esta seguro.
              </div>
            </div>`;
            d.getElementById('proceso_itr').value = itr;
          }

          $('#servicio_base').val(num);
          $('#tipo_base').val(tipo_servicio);
          $('#origen_base').val(origen);
          $('#su_fletecot').val(flete);
          $('#su_servicio').val(num);
          $('#su_neto').val(pesoneto);
          $('#su_tarifacot').val(tarifa);
          if (tipo_servicio == 'Expreso') {
            document.getElementById('btn_soli').disabled = true;
          } else if (tipo_servicio == 'Consolidado') {
            document.getElementById('btn_soli').disabled = false;
          }
          $('#listamodal').html('<span class="badge badge-primary badge-pill" >' + num + '</span>');

          $('#cuerpo_lista2').html(`
            <tr class="prin${num}">
              <td>1</td>
              <td>
                <input type="hidden" id="servicio1" value="${num}" class="fserva" name="fserva[]">
                ${num}
              </td>
              <td>
                ${cotiza} (${item}) ${pareja}
              </td>
              <td>${cliente}</td>
              <td>
                <input type="text" id="fl${num}" class="form-control input-xs tflete" value="${flete}" readonly="readonly" onChange="javascript:currencyMask(this)">
              </td>
              <td style="display:none">
                <input type="text" class="form-control input-xs tneto2" value="${pesoneto}" readonly="readonly">
              </td>
              <td>
                <input type="hidden" id="tari${num}" class="form-control input-xs ttarifa" value="${tarifa}" readonly="readonly">
              </td>
              <td>${tipo_servicio}</td>
            </tr>
          `);

          $('#totalizar').html(`
            <tr>
              <td>
                <input type="text" id="totalfle" class="form-control input-xs" value="${flete}" readonly="readonly">
              </td>
              <td style="display:none;">
                <input type="text" id="totalneto" class="form-control input-xs" value="${pesoneto}" readonly="readonly">
              </td>
              <td>
                <input type="hidden" id="tottarifa" class="form-control input-xs" value="${tarifa}" readonly="readonly">
              </td>
            </tr>
          `);
          //formatear
          $('#fl' + num).val(parseFloat($('#fl' + num).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#totalfle').val(parseFloat($('#totalfle').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#su_fletecot').val(parseFloat($('#su_fletecot').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#tari' + num).val(parseFloat($('#tari' + num).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#tottarifa').val(parseFloat($('#tottarifa').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#su_tarifacot').val(parseFloat($('#su_tarifacot').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

          //VALIDAR SOLICITUD DE SERVICIO ANIDADAS
          let formdata = new FormData();
          formdata.append('solicitud_servicio_id', num);
          fetch($('#id_url_ajax').val() + 'validacionparametros/Validar_solicitud_agrupacion', {
            method: 'POST',
            cache: 'no-cache',
            body: formdata,
          })
            .then(response => response.json())
            .then(function (data) {
              if (data !== false) {
                d.getElementById('id_consolidacion').value = data.agrupacion;
                consulta_solicitudes_anidadas(data.agrupacion, num);
                fechas_cargue(data.agrupacion, num);
              } else {
                d.getElementById('id_consolidacion').value = '';
                fechas_cargue(0, num);
              }
            })
            .catch(error => {
              alert(error);
            });
        } else {
          d.getElementById('mensaje_vigencia').innerHTML = 'Por favor solicitar al area de servico al clientes, actualizacion de fecha de cargue';
          $('#md-footer-primary').modal('show');
          $('#crea_vehiculopreestudio').modal('hide');
        }
      }
    })
    .catch(error => {
      alert(error);
    });
}

function consulta_solicitudes_anidadas(id_agrupacion, numservi) {
  let formdata = new FormData();
  formdata.append('id_agrupacion', id_agrupacion);
  formdata.append('num_servicio', numservi);
  fetch($('#id_url_ajax').val() + 'validacionparametros/Consulta_solicitudes_anidadas', {
    method: 'POST',
    cache: 'no-cache',
    body: formdata,
  })
    .then(response => response.json())
    .then(function (data) {
      console.log(data);
      if (data.result !== null) {
        document.getElementById('btn_soli').disabled = true;
        var cont = 1;
        data.forEach(function (element, index) {
          cont++;
          $('#cuerpo_lista2').append(
            '<tr class=" prin' +
            cont +
            '">' +
            '<td>' +
            cont +
            '</td>' +
            '<td><input type="hidden" id="servicio' +
            cont +
            '" value="' +
            element.solicitud_servicio +
            '" class="fserva" name="fserva[]" >' +
            element.solicitud_servicio +
            '</td>' +
            '<td>' +
            element.n_cotizacion +
            '(' +
            element.item +
            ')' +
            element.tipo_mercancia +
            '</td>' +
            '<td>' +
            element.nombre_cliente +
            '</td>' +
            '<td><input type="text" id="fl' +
            element.numer_solservicio +
            '" class="form-control input-xs tflete" value="' +
            element.flete +
            '" readonly="readonly"></td>' +
            '<td  style="display:none"><input type="text" class="form-control input-xs tneto2" value="' +
            element.peso_neto_tn +
            '" readonly="readonly"></td>' +
            '<td>' +
            '<input type="hidden" id="tari' +
            cont +
            '" class="form-control input-xs ttarifa" value="' +
            element.total_tarifa +
            '" readonly="readonly">' +
            '</td>' +
            '<td>' +
            element.tipo_servicio_mer +
            '</td></tr>' +
            '</tr>',
          );

          if ($('.tflete').val() > 0) {
            $('.tflete').val(parseFloat($('.tflete').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          }

          $('#maxservi').val(cont);
          $('#maxservi2').val(cont);
        });
        sumatoria();
      }
    })
    .catch(error => {
      alert(error);
    });
}

function fechas_cargue(id_agrupacion, numservi) {
  let formdatafechas = new FormData();
  formdatafechas.append('id_agrupacion', id_agrupacion);
  formdatafechas.append('solicitud_servicio_id', numservi);
  fetch($('#id_url_ajax').val() + 'validacionparametros/Consultar_fecha_cargue', {
    method: 'POST',
    cache: 'no-cache',
    body: formdatafechas,
  })
    .then(response => response.json())
    .then(function (data) {
      if (data) {
        $('#cuerpo_fechas').html('');
        //$("#cuerpo_fechas").html('');
        data.forEach(function (element, index) {
          var datec = element.fecha_estimada_entrega + ' ' + element.hora_estimada;
          var actuali = moment().format('YYYY-MM-DD h:mm:ss');
          var cant = moment(datec).diff(actuali, 'hours');
          $('#cuerpo_fechas').append(
            '<tr id="fil1" class="' +
            element.cod_ini_ruta +
            '">' +
            '<td>' +
            '<input type="hidden" id="oculto1" value="' +
            cant +
            '" class="fo" readonly="readonly">' +
            '<input type="text" id="serv1" class="form-control input-xs fserv" value="' +
            element.cod_ini_ruta +
            '" readonly="readonly"></td>' +
            '<td><input type="text" id="fecha1" class="form-control input-xs cp" value="' +
            element.fecha_estimada_entrega +
            ' ' +
            element.hora_estimada +
            '" readonly="readonly"></td>' +
            '<td><input type="text" id="peso1" class="form-control input-xs fp" value="' +
            element.peso +
            '" readonly="readonly"></td>' +
            '<td><input type="text" class="form-control input-xs" value="' +
            element.lugar +
            ' (' +
            element.direccion_entrega +
            ')' +
            '" readonly="readonly" title="' +
            element.direccion_entrega +
            '" title="' +
            element.direccion_entrega +
            '" ><input type="text" class="form-control input-xs" value="' +
            element.muni +
            '" readonly="readonly"></td>' +
            '</tr>',
          );
          /*$('#peso1').val(parseFloat($('#peso1').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());*/
          sumatoria();
        });
      }
    })
    .catch(error => {
      alert(error);
    });
}

/******************************    VALIDACION DE BOTON  buscar EN SOLICITUDES DE SERVICIO    **********************************************/

$('#placa').keyup(function () {
  let texto = d.getElementById('placa').value;
  d.getElementById('placa').value = texto.toUpperCase();
});

async function ValidacionReglaNegocio() {
  /* Nueva funcion para valdiar los tipos de documentos para definir la operacion a realziazr */
  $('#loading-overlay-nexosapp').css('display', 'flex');
  d.getElementById('historico').style.display = 'block';
  placa = $('#placa').val().trim();
  proceso_itr = $('#proceso_itr').val().trim();
  let datos = new FormData();
  datos.append('placa', placa);
  try {
    const response = await fetch($('#id_url_ajax').val() + 'validacionparametros/busqueda_datos_vencimiento', {
      method: 'POST',
      body: datos,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      // Obtener la fecha actual
      let today = moment();

      // Validar si las fechas están vencidas
      function isExpired(date) {
        return moment(date).isBefore(today, 'day');
      }

      // Función para calcular los días vencidos
      function daysExpired(date) {
        let expirationDate = moment(date);
        if (expirationDate.isBefore(today, 'day')) {
          return today.diff(expirationDate, 'days');
        }
        return 0; // No está vencida
      }
      // Calcular los días vencidos para cada fecha
      let diasVencidosLicencia = daysExpired(data.rndc_vencimiento_licencia);
      let diasVencidosTecno = daysExpired(data.tecno_fecha_vigencia);
      let diasVencidosSoat = daysExpired(data.vence_soat);
      let diasVencidosPreoperacional = daysExpired(data.fecha_vencimiento_preoperacional);

      // Construir el mensaje basado en las fechas vencidas
      let mensajes = [];

      if (diasVencidosLicencia > 0) {
        mensajes.push(
          `El conductor <strong>${data.Conductor}</strong> con numero de documento <strong>${data.numero_documento}</strong> se cuentra con la licencia vencida hace <strong> ${diasVencidosLicencia} </strong> dias, por favor solicitar la actualización de este dato en la hoja de vida del conductor`,
        );
      }

      if (diasVencidosTecno > 0) {
        mensajes.push(
          `Este vehículo con placa <strong>${placa}</strong> cuenta con la tecnomecanica vencida hace <strong> ${diasVencidosTecno} </strong> dias, por favor solicitar la actualización de este dato en la hoja de vida del vehiculo`,
        );
      }

      if (diasVencidosSoat > 0) {
        mensajes.push(
          `Este vehículo con placa <strong>${placa}</strong> cuenta con el SOAT vencido hace <strong> ${diasVencidosSoat} </strong> dias, por favor solicitar la actualización de este dato en la hoja de vida del vehiculo`,
        );
      }

      if (diasVencidosPreoperacional > 0) {
        mensajes.push(
          `Este vehículo con placa <strong>${placa}</strong> cuenta con el Preoperacional vencido hace <strong> ${diasVencidosSoat} </strong> dias, por favor solicitar la actualización de este dato en la hoja de vida del vehiculo`,
        );
      } else if (data.fecha_vencimiento_preoperacional === null || data.fecha_vencimiento_preoperacional === '') {
        mensajes.push(
          `Este vehículo con placa <strong>${placa}</strong> no cuenta con el <strong>Preoperacional</strong> diligenciado, por favor solicitar la actualización de este dato en la hoja de vida del vehiculo`,
        );
      }

      // Construir el mensaje final
      let mensajeFinal;

      if (mensajes.length === 4) {
        mensaje = `
        <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
            <div class="icon"><span class="mdi mdi-info-outline"></span></div>
            <div class="message">
              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Mensaje!</strong> ${mensajes.join(', ')}.
            </div>
        </div>`;
        $('#historico_vencido').html(mensaje);
        /* Solo colocar la opcion de actualizar */
        Vencimientoprefiltro();
        Limpiarmodal();
        Ocultarbloque();
        $('#historico').html('');
        $.post(
          $('#id_url_ajax').val() + 'validacionparametros/busqueda_vehiculo',
          'placa=' + placa + '&proceso_itr=' + proceso_itr,
          function (data) {
            var mensaje = '';
            let estado_Vehiculo = data.estado_vehiculo;
            $('#nexos_messages_b1').html('');
            $('#nexos_messages_b2').html('');
            //Validacion del tipo de operacion para saber si se puede escoger una o mas solicitudes de servicio
            if (data['evaluacion'] == 'estudio') {
              if (data['estado_vigencia'] == 'bloqueado') {
                mensaje = `
                      <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                          <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                          <div class="message">
                            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                            <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> esta Bloqueado.
                          </div>
                      </div>`;
                radionuevo_bloc();
                radiohv_bloc();
              } else if (data['estado_vigencia'] == 'seguimiento') {
                mensaje += `
                        <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                            <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                            <div class="message">
                              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                              <strong>Mensaje!</strong> ${data['mensaje']} .
                            </div>
                        </div>`;
                $('#historico').html(mensaje);
                radionuevo_bloc();
                radiohv_bloc();
                radioitrblock();
              } else if (data['estado_vigencia'] == 'desbloqueado') {
                if (data['mensaje'] == 'autorizado') {
                  console.log('ENTRO AQUI NUEVAMENTE PARA VER SI TODO ESTA BIEN');
                  radionuevo_bloc();
                  // radioactu();
                  radioactu_vencido();
                } else {
                  if (data['itr'] && data['itr'] !== '') {
                    $('#crear_preestudio').hide();
                    radioitr();
                    /* Mostar tabla de verificacion de datos */
                    d.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    d.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    d.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    d.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    d.getElementById('accion_propietario').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Poseedor
                    d.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    d.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    d.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    d.getElementById('accion_poseedor').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Conductor
                    d.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    d.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    d.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    d.getElementById('accion_conductor').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      d.getElementById('ptcondu').innerHTML = 'No Aplica';
                      d.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      d.getElementById('cpropt').innerHTML = 'No Aplica';
                      d.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      d.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      d.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      d.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      d.getElementById('accion_propietario_trailer').innerHTML = `
                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                </div>
                              `;
                    }
                  } else {
                    mensaje += `
                          <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                              <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                              <div class="message">
                                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                <strong>Mensaje!</strong> ${data['mensaje']} .
                              </div>
                          </div>`;
                    radionuevo_bloc();
                    radiohv_bloc();
                    $('#crear_preestudio').show();
                  }
                }
              } else {
                //Validaciones estudio
                if (data['mensaje'] == 'autorizado') {
                  radionuevo_bloc();
                  radioactu_vencido();
                } else {
                  if (data['itr'] !== '') {
                    $('#crear_preestudio').hide();
                    radioitr();
                    /* Mostar tabla de verificacion de datos */
                    d.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    d.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    d.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    d.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    d.getElementById('accion_propietario').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Poseedor
                    d.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    d.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    d.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    d.getElementById('accion_poseedor').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Conductor
                    d.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    d.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    d.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    d.getElementById('accion_conductor').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      d.getElementById('ptcondu').innerHTML = 'No Aplica';
                      d.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      d.getElementById('cpropt').innerHTML = 'No Aplica';
                      d.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      d.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      d.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      d.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      d.getElementById('accion_propietario_trailer').innerHTML = `
                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                </div>
                              `;
                    }
                  } else {
                    mensaje += `
                          <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                              <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                              <div class="message">
                                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                <strong>Mensaje!</strong> ${data['mensaje']} .
                              </div>
                          </div>`;
                    radionuevo_bloc();
                    radiohv_bloc();
                    $('#crear_preestudio').show();
                  }
                }
              }
              $('#historico').html(mensaje);
              setTimeout(() => {
                d.getElementById('historico').style.display = 'none';
              }, 10000);
            }
          },
          'json',
        );
      } else if (mensajes.length === 3) {
        mensaje = `
        <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
            <div class="icon"><span class="mdi mdi-info-outline"></span></div>
            <div class="message">
              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Mensaje!</strong> ${mensajes.join(' y ')}.
            </div>
        </div>`;
        $('#historico_vencido').html(mensaje);
        /* Solo colocar la opcion de actualizar */
        Vencimientoprefiltro();
        Limpiarmodal();
        Ocultarbloque();
        $('#historico').html('');
        $.post(
          $('#id_url_ajax').val() + 'validacionparametros/busqueda_vehiculo',
          'placa=' + placa + '&proceso_itr=' + proceso_itr,
          function (data) {
            var mensaje = '';
            let estado_Vehiculo = data.estado_vehiculo;
            $('#nexos_messages_b1').html('');
            $('#nexos_messages_b2').html('');
            //Validacion del tipo de operacion para saber si se puede escoger una o mas solicitudes de servicio
            if (data['evaluacion'] == 'estudio') {
              if (data['estado_vigencia'] == 'bloqueado') {
                mensaje = `
                              <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                                  <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                                  <div class="message">
                                    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                    <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> esta Bloqueado.
                                  </div>
                              </div>`;
                radionuevo_bloc();
                radiohv_bloc();
              } else if (data['estado_vigencia'] == 'seguimiento') {
                mensaje += `
                                <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                                    <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                                    <div class="message">
                                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                      <strong>Mensaje!</strong> ${data['mensaje']} .
                                    </div>
                                </div>`;
                $('#historico').html(mensaje);
                radionuevo_bloc();
                radiohv_bloc();
                radioitrblock();
              } else if (data['estado_vigencia'] == 'desbloqueado') {
                if (data['mensaje'] == 'autorizado') {
                  console.log('ENTRO AQUI NUEVAMENTE PARA VER SI TODO ESTA BIEN');
                  radionuevo_bloc();
                  // radioactu();
                  radioactu_vencido();
                } else {
                  if (data['itr'] && data['itr'] !== '') {
                    $('#crear_preestudio').hide();
                    radioitr();
                    /* Mostar tabla de verificacion de datos */
                    d.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    d.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    d.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    d.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    d.getElementById('accion_propietario').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Poseedor
                    d.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    d.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    d.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    d.getElementById('accion_poseedor').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Conductor
                    d.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    d.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    d.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    d.getElementById('accion_conductor').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      d.getElementById('ptcondu').innerHTML = 'No Aplica';
                      d.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      d.getElementById('cpropt').innerHTML = 'No Aplica';
                      d.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      d.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      d.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      d.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      d.getElementById('accion_propietario_trailer').innerHTML = `
                                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                        </div>
                                      `;
                    }
                  } else {
                    mensaje += `
                                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                                      <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                                      <div class="message">
                                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                        <strong>Mensaje!</strong> ${data['mensaje']} .
                                      </div>
                                  </div>`;
                    radionuevo_bloc();
                    radiohv_bloc();
                    $('#crear_preestudio').show();
                  }
                }
              } else {
                //Validaciones estudio
                if (data['mensaje'] == 'autorizado') {
                  radionuevo_bloc();
                  radioactu_vencido();
                } else {
                  if (data['itr'] !== '') {
                    $('#crear_preestudio').hide();
                    radioitr();
                    /* Mostar tabla de verificacion de datos */
                    d.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    d.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    d.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    d.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    d.getElementById('accion_propietario').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Poseedor
                    d.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    d.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    d.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    d.getElementById('accion_poseedor').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Conductor
                    d.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    d.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    d.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    d.getElementById('accion_conductor').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      d.getElementById('ptcondu').innerHTML = 'No Aplica';
                      d.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      d.getElementById('cpropt').innerHTML = 'No Aplica';
                      d.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      d.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      d.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      d.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      d.getElementById('accion_propietario_trailer').innerHTML = `
                                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                        </div>
                                      `;
                    }
                  } else {
                    mensaje += `
                                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                                      <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                                      <div class="message">
                                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                        <strong>Mensaje!</strong> ${data['mensaje']} .
                                      </div>
                                  </div>`;
                    radionuevo_bloc();
                    radiohv_bloc();
                    $('#crear_preestudio').show();
                  }
                }
              }
              $('#historico').html(mensaje);
              setTimeout(() => {
                d.getElementById('historico').style.display = 'none';
              }, 10000);
            }
          },
          'json',
        );
      } else if (mensajes.length === 2) {
        mensaje = `
        <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
            <div class="icon"><span class="mdi mdi-info-outline"></span></div>
            <div class="message">
              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Mensaje!</strong> ${mensajes.join(' y ')}.
            </div>
        </div>`;
        $('#historico_vencido').html(mensaje);
        /* Solo colocar la opcion de actualizar */
        Vencimientoprefiltro();
        Limpiarmodal();
        Ocultarbloque();
        $('#historico').html('');
        $.post(
          $('#id_url_ajax').val() + 'validacionparametros/busqueda_vehiculo',
          'placa=' + placa + '&proceso_itr=' + proceso_itr,
          function (data) {
            var mensaje = '';
            let estado_Vehiculo = data.estado_vehiculo;
            $('#nexos_messages_b1').html('');
            $('#nexos_messages_b2').html('');
            //Validacion del tipo de operacion para saber si se puede escoger una o mas solicitudes de servicio
            if (data['evaluacion'] == 'estudio') {
              if (data['estado_vigencia'] == 'bloqueado') {
                mensaje = `
                              <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                                  <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                                  <div class="message">
                                    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                    <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> esta Bloqueado.
                                  </div>
                              </div>`;
                radionuevo_bloc();
                radiohv_bloc();
              } else if (data['estado_vigencia'] == 'seguimiento') {
                mensaje += `
                                <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                                    <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                                    <div class="message">
                                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                      <strong>Mensaje!</strong> ${data['mensaje']} .
                                    </div>
                                </div>`;
                $('#historico').html(mensaje);
                radionuevo_bloc();
                radiohv_bloc();
                radioitrblock();
              } else if (data['estado_vigencia'] == 'desbloqueado') {
                if (data['mensaje'] == 'autorizado') {
                  console.log('ENTRO AQUI NUEVAMENTE PARA VER SI TODO ESTA BIEN');
                  radionuevo_bloc();
                  // radioactu();
                  radioactu_vencido();
                } else {
                  if (data['itr'] && data['itr'] !== '') {
                    $('#crear_preestudio').hide();
                    radioitr();
                    /* Mostar tabla de verificacion de datos */
                    d.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    d.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    d.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    d.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    d.getElementById('accion_propietario').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Poseedor
                    d.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    d.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    d.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    d.getElementById('accion_poseedor').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Conductor
                    d.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    d.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    d.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    d.getElementById('accion_conductor').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      d.getElementById('ptcondu').innerHTML = 'No Aplica';
                      d.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      d.getElementById('cpropt').innerHTML = 'No Aplica';
                      d.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      d.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      d.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      d.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      d.getElementById('accion_propietario_trailer').innerHTML = `
                                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                        </div>
                                      `;
                    }
                  } else {
                    mensaje += `
                                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                                      <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                                      <div class="message">
                                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                        <strong>Mensaje!</strong> ${data['mensaje']} .
                                      </div>
                                  </div>`;
                    radionuevo_bloc();
                    radiohv_bloc();
                    $('#crear_preestudio').show();
                  }
                }
              } else {
                //Validaciones estudio
                if (data['mensaje'] == 'autorizado') {
                  radionuevo_bloc();
                  radioactu_vencido();
                } else {
                  if (data['itr'] !== '') {
                    $('#crear_preestudio').hide();
                    radioitr();
                    /* Mostar tabla de verificacion de datos */
                    d.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    d.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    d.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    d.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    d.getElementById('accion_propietario').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Poseedor
                    d.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    d.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    d.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    d.getElementById('accion_poseedor').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Conductor
                    d.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    d.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    d.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    d.getElementById('accion_conductor').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      d.getElementById('ptcondu').innerHTML = 'No Aplica';
                      d.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      d.getElementById('cpropt').innerHTML = 'No Aplica';
                      d.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      d.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      d.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      d.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      d.getElementById('accion_propietario_trailer').innerHTML = `
                                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                        </div>
                                      `;
                    }
                  } else {
                    mensaje += `
                                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                                      <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                                      <div class="message">
                                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                        <strong>Mensaje!</strong> ${data['mensaje']} .
                                      </div>
                                  </div>`;
                    radionuevo_bloc();
                    radiohv_bloc();
                    $('#crear_preestudio').show();
                  }
                }
              }
              $('#historico').html(mensaje);
              setTimeout(() => {
                d.getElementById('historico').style.display = 'none';
              }, 10000);
            }
          },
          'json',
        );
      } else if (mensajes.length === 1) {
        console.log("entro en 1");

        mensaje = `
        <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
            <div class="icon"><span class="mdi mdi-info-outline"></span></div>
            <div class="message">
              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Mensaje!</strong> ${mensajes[0]}.
            </div>
        </div>`;
        $('#historico_vencido').html(mensaje);
        /* Solo colocar la opcion de actualizar */
        Vencimientoprefiltro();
        Limpiarmodal();
        Ocultarbloque();
        $('#historico').html('');
        $.post(
          $('#id_url_ajax').val() + 'validacionparametros/busqueda_vehiculo',
          'placa=' + placa + '&proceso_itr=' + proceso_itr,
          function (data) {
            var mensaje = '';
            let estado_Vehiculo = data.estado_vehiculo;
            $('#nexos_messages_b1').html('');
            $('#nexos_messages_b2').html('');
            //Validacion del tipo de operacion para saber si se puede escoger una o mas solicitudes de servicio
            if (data['evaluacion'] == 'estudio') {
              if (data['estado_vigencia'] == 'bloqueado') {
                mensaje = `
                      <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                          <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                          <div class="message">
                            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                            <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> esta Bloqueado.
                          </div>
                      </div>`;
                radionuevo_bloc();
                radiohv_bloc();
              } else if (data['estado_vigencia'] == 'seguimiento') {
                mensaje += `
                        <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                            <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                            <div class="message">
                              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                              <strong>Mensaje!</strong> ${data['mensaje']} .
                            </div>
                        </div>`;
                $('#historico').html(mensaje);
                radionuevo_bloc();
                radiohv_bloc();
                radioitrblock();
              } else if (data['estado_vigencia'] == 'desbloqueado') {
                if (data['mensaje'] == 'autorizado') {
                  console.log('ENTRO AQUI NUEVAMENTE PARA VER SI TODO ESTA BIEN');
                  radionuevo_bloc();
                  // radioactu();
                  radioactu_vencido();
                } else {
                  if (data['itr'] && data['itr'] !== '') {
                    $('#crear_preestudio').hide();
                    radioitr();
                    /* Mostar tabla de verificacion de datos */
                    d.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    d.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    d.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    d.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    d.getElementById('accion_propietario').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Poseedor
                    d.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    d.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    d.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    d.getElementById('accion_poseedor').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Conductor
                    d.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    d.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    d.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    d.getElementById('accion_conductor').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      d.getElementById('ptcondu').innerHTML = 'No Aplica';
                      d.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      d.getElementById('cpropt').innerHTML = 'No Aplica';
                      d.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      d.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      d.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      d.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      d.getElementById('accion_propietario_trailer').innerHTML = `
                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                </div>
                              `;
                    }
                  } else {
                    mensaje += `
                          <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                              <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                              <div class="message">
                                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                <strong>Mensaje!</strong> ${data['mensaje']} .
                              </div>
                          </div>`;
                    radionuevo_bloc();
                    radiohv_bloc();
                    $('#crear_preestudio').show();
                  }
                }
              } else {
                //Validaciones estudio
                if (data['mensaje'] == 'autorizado') {
                  radionuevo_bloc();
                  radioactu_vencido();
                } else {
                  if (data['itr'] !== '') {
                    $('#crear_preestudio').hide();
                    radioitr();
                    /* Mostar tabla de verificacion de datos */
                    d.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    d.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    d.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    d.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    d.getElementById('accion_propietario').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Poseedor
                    d.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    d.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    d.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    d.getElementById('accion_poseedor').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Conductor
                    d.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    d.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    d.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    d.getElementById('accion_conductor').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      d.getElementById('ptcondu').innerHTML = 'No Aplica';
                      d.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      d.getElementById('cpropt').innerHTML = 'No Aplica';
                      d.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      d.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      d.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      d.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      d.getElementById('accion_propietario_trailer').innerHTML = `
                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                </div>
                              `;
                    }
                  } else {
                    mensaje += `
                          <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                              <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                              <div class="message">
                                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                                <strong>Mensaje!</strong> ${data['mensaje']} .
                              </div>
                          </div>`;
                    radionuevo_bloc();
                    radiohv_bloc();
                    $('#crear_preestudio').show();
                  }
                }
              }
              $('#historico').html(mensaje);
              setTimeout(() => {
                d.getElementById('historico').style.display = 'none';
              }, 10000);
            } else {
              console.log('PREFILTRO');
            }
          },
          'json',
        );
      } else {
        Vencimientoprefiltro();
        Limpiarmodal();
        Ocultarbloque();
        $('#historico').html('');
        $.post(
          $('#id_url_ajax').val() + 'validacionparametros/busqueda_vehiculo',
          'placa=' + placa + '&proceso_itr=' + proceso_itr,
          function (data) {
            var mensaje = '';
            let estado_Vehiculo = data.estado_vehiculo;
            $('#nexos_messages_b1').html('');
            $('#nexos_messages_b2').html('');
            //Validacion del tipo de operacion para saber si se puede escoger una o mas solicitudes de servicio
            if (data['evaluacion'] == 'estudio') {
              if (data['estado_vigencia'] == 'bloqueado') {
                mensaje = `
              <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                  <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                  <div class="message">
                    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                    <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> esta Bloqueado.
                  </div>
              </div>`;
                radionuevo_bloc();
                radiohv_bloc();
              } else if (data['estado_vigencia'] == 'seguimiento') {
                mensaje += `
                <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                    <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong> ${data['mensaje']} .
                    </div>
                </div>`;
                $('#historico').html(mensaje);
                radionuevo_bloc();
                radiohv_bloc();
                radioitrblock();
              } else if (data['estado_vigencia'] == 'desbloqueado') {
                if (data['mensaje'] == 'autorizado') {
                  radionuevo_bloc();
                  radioactu();
                } else {
                  if (data['itr'] && data['itr'] !== '') {
                    $('#crear_preestudio').hide();
                    radioitr();
                    /* Mostar tabla de verificacion de datos */
                    d.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    d.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    d.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    d.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    d.getElementById('accion_propietario').innerHTML = `
                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                      </div>
                    `;
                    // Poseedor
                    d.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    d.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    d.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    d.getElementById('accion_poseedor').innerHTML = `
                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                      </div>
                    `;
                    // Conductor
                    d.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    d.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    d.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    d.getElementById('accion_conductor').innerHTML = `
                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                      </div>
                    `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      d.getElementById('ptcondu').innerHTML = 'No Aplica';
                      d.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      d.getElementById('cpropt').innerHTML = 'No Aplica';
                      d.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      d.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      d.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      d.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      d.getElementById('accion_propietario_trailer').innerHTML = `
                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                        </div>
                      `;
                    }
                  } else {
                    mensaje += `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> ${data['mensaje']} .
                      </div>
                  </div>`;
                    radionuevo_bloc();
                    radiohv_bloc();
                    $('#crear_preestudio').show();
                  }
                }
              } else {
                //Validaciones estudio
                if (data['mensaje'] == 'autorizado') {
                  radionuevo_bloc();
                  radioactu();
                } else {
                  if (data['itr'] !== '') {
                    $('#crear_preestudio').hide();
                    radioitr();
                    /* Mostar tabla de verificacion de datos */
                    d.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    d.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    d.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    d.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    d.getElementById('accion_propietario').innerHTML = `
                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                      </div>
                    `;
                    // Poseedor
                    d.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    d.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    d.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    d.getElementById('accion_poseedor').innerHTML = `
                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                      </div>
                    `;
                    // Conductor
                    d.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    d.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    d.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    d.getElementById('accion_conductor').innerHTML = `
                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                      </div>
                    `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      d.getElementById('ptcondu').innerHTML = 'No Aplica';
                      d.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      d.getElementById('cpropt').innerHTML = 'No Aplica';
                      d.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      d.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      d.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      d.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      d.getElementById('accion_propietario_trailer').innerHTML = `
                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                        </div>
                      `;
                    }
                  } else {
                    mensaje += `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> ${data['mensaje']} .
                      </div>
                  </div>`;
                    radionuevo_bloc();
                    radiohv_bloc();
                    $('#crear_preestudio').show();
                  }
                }
              }
              $('#historico').html(mensaje);
              setTimeout(() => {
                d.getElementById('historico').style.display = 'none';
              }, 10000);
            }
            if (data['evaluacion'] === 'prefiltro') {
              var fhoy = moment();
              var tf = fhoy.diff(data['respuesta']['fecha'], 'days');
              if (data['respuesta']['estado'] == null || data['respuesta']['estado'] == 'rechazado' || data['respuesta']['estado'] == 'vencida' || data['respuesta']['estado'] == 'cancelado') {
                mensaje = `
                <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                    <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> no se encuentra creado en el sistema, solicitar prefiltro para su creación.
                    </div>
                </div>`;
                let op = 'NEW';
                accordion1desbloqueado(op);
                radiohv_bloc();
                radionuevo();
                referencias_nuevo_des();
                // referencias_ah_des2(data.id_conductor);
                datossolicitudes_des();
                documento_nuevo_des();
                flete_desbloquear();
                boton_guardar_des();
              } else {
                if (
                  data['respuesta']['estado'] == 'pendiente_iniciar' ||
                  data['respuesta']['estado'] == 'iniciado' ||
                  data['respuesta']['estado'] == 'pendiente' ||
                  data['respuesta']['estado'] == 'rechazado para modificar' ||
                  data['respuesta']['estado'] == 'aprobado'
                ) {
                  //calcular fecha prefiltro con la fecha actual
                  var fhoy = moment();
                  var horahoy = moment().format('HH:mm:ss');
                  var tf = fhoy.diff(data['respuesta']['fecha'], 'days');
                  if (data['respuesta']['estado'] != 'aprobado' && tf == 0) {
                    //son de hoy
                    mensaje =
                      `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> tiene prefiltro ` +
                      data['respuesta']['id_preestudio'] +
                      ` , estado: ` +
                      data['respuesta']['estado'] +
                      ` .
                      </div>
                  </div>`;
                  } else if (data['respuesta']['estado'] == 'aprobado' && tf == 0) {
                    //estado aprobado de hoy mostar msg
                    mensaje =
                      `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> tiene prefiltro ` +
                      data['respuesta']['id_preestudio'] +
                      ` , estado: ` +
                      data['respuesta']['estado'] +
                      ` .
                      </div>
                  </div>`;
                  } else if (data['respuesta']['estado'] == 'aprobado' && tf > 0) {
                    //estado aprobado y no he de hoy registrar
                    let op = 'NEW';
                    accordion1desbloqueado(op);
                    radiohv_bloc();
                    radionuevo();
                    referencias_nuevo_des();
                    // referencias_ah_des2(data.id_conductor);
                    datossolicitudes_des();
                    documento_nuevo_des();
                    flete_desbloquear();
                    boton_guardar_des();
                  }
                } else if (data['respuesta']['estado'] == 'cancelado' && tf == 0) {
                  mensaje =
                    `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> tiene prefiltro ` +
                    data['respuesta']['id_preestudio'] +
                    ` , estado: ` +
                    data['respuesta']['estado'] +
                    `
                        no esta autorizado para cargar con Nexos Cargo.
                      </div>
                  </div>`;
                }
              }
              $('#historico').html(mensaje);
              setTimeout(() => {
                d.getElementById('historico').style.display = 'none';
              }, 10000);
            }
          },
          'json',
        );
      }
    } else {
      Vencimientoprefiltro();
      Limpiarmodal();
      Ocultarbloque();
      $('#historico').html('');
      $.post(
        $('#id_url_ajax').val() + 'validacionparametros/busqueda_vehiculo',
        'placa=' + placa + '&proceso_itr=' + proceso_itr,
        function (data) {
          var mensaje = '';
          let estado_Vehiculo = data.estado_vehiculo;
          $('#nexos_messages_b1').html('');
          $('#nexos_messages_b2').html('');
          //Validacion del tipo de operacion para saber si se puede escoger una o mas solicitudes de servicio
          if (data['evaluacion'] == 'estudio') {
            if (data['estado_vigencia'] == 'bloqueado') {
              mensaje = `
            <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> esta Bloqueado.
                </div>
            </div>`;
              radionuevo_bloc();
              radiohv_bloc();
            } else if (data['estado_vigencia'] == 'seguimiento') {
              mensaje += `
              <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                  <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                  <div class="message">
                    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                    <strong>Mensaje!</strong> ${data['mensaje']} .
                  </div>
              </div>`;
              $('#historico').html(mensaje);
              radionuevo_bloc();
              radiohv_bloc();
              radioitrblock();
            } else if (data['estado_vigencia'] == 'desbloqueado') {
              if (data['mensaje'] == 'autorizado') {
                radionuevo_bloc();
                radioactu();
              } else {
                if (data['itr'] && data['itr'] !== '') {
                  $('#crear_preestudio').hide();
                  radioitr();
                  /* Mostar tabla de verificacion de datos */
                  d.getElementById('datos_proveedores').style.display = 'block';
                  // Propietario
                  d.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                  d.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                  d.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                  d.getElementById('accion_propietario').innerHTML = `
                    <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                        <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                        <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                    </div>
                  `;
                  // Poseedor
                  d.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                  d.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                  d.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                  d.getElementById('accion_poseedor').innerHTML = `
                    <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                        <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                        <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                    </div>
                  `;
                  // Conductor
                  d.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                  d.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                  d.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                  d.getElementById('accion_conductor').innerHTML = `
                    <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                        <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                        <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                    </div>
                  `;
                  // Propietario trailer
                  if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                    d.getElementById('ptcondu').innerHTML = 'No Aplica';
                    d.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                    d.getElementById('cpropt').innerHTML = 'No Aplica';
                    d.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                  } else {
                    d.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                    d.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                    d.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                    d.getElementById('accion_propietario_trailer').innerHTML = `
                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                      </div>
                    `;
                  }
                } else {
                  mensaje += `
                <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                    <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong> ${data['mensaje']} .
                    </div>
                </div>`;
                  radionuevo_bloc();
                  radiohv_bloc();
                  $('#crear_preestudio').show();
                }
              }
            } else {
              //Validaciones estudio
              if (data['mensaje'] == 'autorizado') {
                radionuevo_bloc();
                radioactu();
              } else {
                if (data['itr'] !== '') {
                  $('#crear_preestudio').hide();
                  radioitr();
                  /* Mostar tabla de verificacion de datos */
                  d.getElementById('datos_proveedores').style.display = 'block';
                  // Propietario
                  d.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                  d.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                  d.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                  d.getElementById('accion_propietario').innerHTML = `
                    <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                        <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                        <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                    </div>
                  `;
                  // Poseedor
                  d.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                  d.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                  d.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                  d.getElementById('accion_poseedor').innerHTML = `
                    <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                        <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                        <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                    </div>
                  `;
                  // Conductor
                  d.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                  d.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                  d.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                  d.getElementById('accion_conductor').innerHTML = `
                    <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                        <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                        <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                    </div>
                  `;
                  // Propietario trailer
                  if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                    d.getElementById('ptcondu').innerHTML = 'No Aplica';
                    d.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                    d.getElementById('cpropt').innerHTML = 'No Aplica';
                    d.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                  } else {
                    d.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                    d.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                    d.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                    d.getElementById('accion_propietario_trailer').innerHTML = `
                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                      </div>
                    `;
                  }
                } else {
                  mensaje += `
                <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                    <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong> ${data['mensaje']} .
                    </div>
                </div>`;
                  radionuevo_bloc();
                  radiohv_bloc();
                  $('#crear_preestudio').show();
                }
              }
            }
            $('#historico').html(mensaje);
            setTimeout(() => {
              d.getElementById('historico').style.display = 'none';
            }, 10000);
          }
          if (data['evaluacion'] === 'prefiltro') {
            var fhoy = moment();
            var tf = fhoy.diff(data['respuesta']['fecha'], 'days');
            if (data['respuesta']['estado'] == null || data['respuesta']['estado'] == 'rechazado' || data['respuesta']['estado'] == 'vencida' || data['respuesta']['estado'] == 'cancelado') {
              mensaje = `
              <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                  <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                  <div class="message">
                    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                    <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> no se encuentra creado en el sistema, solicitar prefiltro para su creación.
                  </div>
              </div>`;
              let op = 'NEW';
              accordion1desbloqueado(op);
              radiohv_bloc();
              radionuevo();
              referencias_nuevo_des();
              // referencias_ah_des2(data.id_conductor);
              datossolicitudes_des();
              documento_nuevo_des();
              flete_desbloquear();
              boton_guardar_des();
            } else {
              if (
                data['respuesta']['estado'] == 'pendiente_iniciar' ||
                data['respuesta']['estado'] == 'iniciado' ||
                data['respuesta']['estado'] == 'pendiente' ||
                data['respuesta']['estado'] == 'rechazado para modificar' ||
                data['respuesta']['estado'] == 'aprobado'
              ) {
                //calcular fecha prefiltro con la fecha actual
                var fhoy = moment();
                var horahoy = moment().format('HH:mm:ss');
                var tf = fhoy.diff(data['respuesta']['fecha'], 'days');
                if (data['respuesta']['estado'] != 'aprobado' && tf == 0) {
                  //son de hoy
                  mensaje =
                    `
                <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                    <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> tiene prefiltro ` +
                    data['respuesta']['id_preestudio'] +
                    ` , estado: ` +
                    data['respuesta']['estado'] +
                    ` .
                    </div>
                </div>`;
                } else if (data['respuesta']['estado'] == 'aprobado' && tf == 0) {
                  //estado aprobado de hoy mostar msg
                  mensaje =
                    `
                <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                    <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> tiene prefiltro ` +
                    data['respuesta']['id_preestudio'] +
                    ` , estado: ` +
                    data['respuesta']['estado'] +
                    ` .
                    </div>
                </div>`;
                } else if (data['respuesta']['estado'] == 'aprobado' && tf > 0) {
                  //estado aprobado y no he de hoy registrar
                  let op = 'NEW';
                  accordion1desbloqueado(op);
                  radiohv_bloc();
                  radionuevo();
                  referencias_nuevo_des();
                  // referencias_ah_des2(data.id_conductor);
                  datossolicitudes_des();
                  documento_nuevo_des();
                  flete_desbloquear();
                  boton_guardar_des();
                }
              } else if (data['respuesta']['estado'] == 'cancelado' && tf == 0) {
                mensaje =
                  `
                <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                    <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> tiene prefiltro ` +
                  data['respuesta']['id_preestudio'] +
                  ` , estado: ` +
                  data['respuesta']['estado'] +
                  `
                      no esta autorizado para cargar con Nexos Cargo.
                    </div>
                </div>`;
              }
            }
            $('#historico').html(mensaje);
            setTimeout(() => {
              d.getElementById('historico').style.display = 'none';
            }, 10000);
          }
        },
        'json',
      );
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
  }
}

function Vencimientoprefiltro() {
  $.post(
    $('#id_url_ajax').val() + 'validacionparametros/vencimientoprefiltro',
    function (data) {
      if (data == 1) {
        console.log(data);
      } else {
        console.log(data);
      }
    },
    'json',
  );
}

function Limpiarmodal() {
  document.getElementById('habil').checked = false;
  document.getElementById('update').checked = false;
  document.getElementById('nuevo').checked = false;
  limpiacampos_datosvehiculos1();
  limpiacampos_referencia();
  limpiacampos_solicitud();
  limpia_archivoprefiltro();
  limpia_referencias_hv();
  limpia_actualza();
  limpia_subasta();
}

function Ocultarbloque() {
  document.getElementById('divdatos').style.display = 'none';
  document.getElementById('panel_referenciaNEW').style.display = 'none';
  document.getElementById('panel_solicitudes').style.display = 'none';
  document.getElementById('panel_papeles').style.display = 'none';
  document.getElementById('panel_referenciahv').style.display = 'none';
  document.getElementById('panel_refepersonal').style.display = 'none';
  document.getElementById('panel_seguridad').style.display = 'none';
  document.getElementById('panel_fletepk').style.display = 'none';
  radiohv_bloc();
  radionuevo_bloc();
}

/***********************************  Función para mostar/ocultar bloque datos   **************************************************/
//Colocar Formato moneda
function formatNum(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//Consulta vehículos segun estado
function accordion1desbloqueado(op) {
  $('#divdatos').show();
  var opcion = op;
  //$("#habil").hide();
  //$("#update").hide();
  $('#hvpreestudio').show();
  var pk = $('#placa').val();
  $('#placag').val(pk);
  $('#su_placa').val(pk);

  if (opcion == 'R') {
    //alert('traer datos');
    var t = {
      placa: pk,
      action: 'consultavprees',
    };
    $.ajax({
      url: url2,
      type: 'POST',
      data: t,
      dataType: 'json',
      success: function (data) {
        if (data.result != null) {
          $('#placat').val(data.result[0].placa_trailer);
          $('#web').val(data.result[0].web_satelital);
          $('#user_satelite').val(data.result[0].usuario_satelital);
          $('#clave').val(data.result[0].clave_satelital);
          $('#nompro').val(data.result[0].nombre_propietario);
          $('#docupro').val(data.result[0].documento_propietario);
          $('#nomtene').val(data.result[0].nombre_tenedor);
          $('#docutene').val(data.result[0].documento_tenedor);
          $('#nomcondu').val(data.result[0].nombre_conductor);
          $('#docucondu').val(data.result[0].documento_conductor);
          $('#deta_condu').val(data.result[0].id_detacondu);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }

  if (opcion == 'CA') {
    //alert('traer datos');
    var t = {
      placa: pk,
      action: 'consultavprees',
    };

    $.ajax({
      url: url2,
      type: 'POST',
      data: t,
      dataType: 'json',
      success: function (data) {
        if (data.result != null) {
          $('#placat').val(data.result[0].placa_trailer);
          $('#web').val(data.result[0].web_satelital);
          $('#user_satelite').val(data.result[0].usuario_satelital);
          $('#clave').val(data.result[0].clave_satelital);
          $('#nompro').val(data.result[0].nombre_propietario);
          $('#docupro').val(data.result[0].documento_propietario);
          $('#nomtene').val(data.result[0].nombre_tenedor);
          $('#docutene').val(data.result[0].documento_tenedor);
          $('#nomcondu').val(data.result[0].nombre_conductor);
          $('#docucondu').val(data.result[0].documento_conductor);
          $('#deta_condu').val(data.result[0].id_detacondu);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }

  if (opcion == 'AR') {
    //alert('traer datos');
    var t = {
      placa: pk,
      action: 'consultavprees',
    };

    $.ajax({
      url: url2,
      type: 'POST',
      data: t,
      dataType: 'json',
      success: function (data) {
        if (data.result != null) {
          $('#placat').val(data.result[0].placa_trailer);
          $('#web').val(data.result[0].web_satelital);
          $('#user_satelite').val(data.result[0].usuario_satelital);
          $('#clave').val(data.result[0].clave_satelital);
          $('#nompro').val(data.result[0].nombre_propietario);
          $('#docupro').val(data.result[0].documento_propietario);
          $('#nomtene').val(data.result[0].nombre_tenedor);
          $('#docutene').val(data.result[0].documento_tenedor);
          $('#nomcondu').val(data.result[0].nombre_conductor);
          $('#docucondu').val(data.result[0].documento_conductor);
          $('#deta_condu').val(data.result[0].id_detacondu);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }

  if (opcion == 'PE') {
    //alert('traer datos');
    var t = {
      placa: pk,
      action: 'consultavprees',
    };

    $.ajax({
      url: url2,
      type: 'POST',
      data: t,
      dataType: 'json',
      success: function (data) {
        if (data.result != null) {
          $('#placat').val(data.result[0].placa_trailer);
          $('#web').val(data.result[0].web_satelital);
          $('#user_satelite').val(data.result[0].usuario_satelital);
          $('#clave').val(data.result[0].clave_satelital);
          $('#nompro').val(data.result[0].nombre_propietario);
          $('#docupro').val(data.result[0].documento_propietario);
          $('#nomtene').val(data.result[0].nombre_tenedor);
          $('#docutene').val(data.result[0].documento_tenedor);
          $('#nomcondu').val(data.result[0].nombre_conductor);
          $('#docucondu').val(data.result[0].documento_conductor);
          $('#deta_condu').val(data.result[0].id_detacondu);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }
}

function radionuevo() {
  $('.thv').show();
  $('#divnuevo').show();
  $('#placa').prop('disabled', true);
}

function radionuevo_bloc() {
  $('#tiporadio').val('');
  $('#divnuevo').hide();
  $('#capa_carga_vh').attr('disabled', false);
}

/* Actializar */
function radioactu() {
  $('#tiporadio').val('');
  $('.thv').show();
  $('#divhabil').show();
  $('#divactualiza').show();
  $('#placa').prop('disabled', true);
}

/* Actualizar solo cuando algo este vencido */
function radioactu_vencido() {
  $('#tiporadio').val('');
  $('.thv').show();
  // $('#divhabil').show();
  $('#divactualiza').show();
  $('#placa').prop('disabled', true);
}

/* Actializar Itr*/
function actualizar_itr() {
  $('#tiporadio').val('');
  $('.thv').show();
  $('#divactualiza').show();
  $('#placa').prop('disabled', true);
  d.getElementById('datos_proveedores').style.display = 'none';
  $('#crear_preestudio').show();
}

/* Itr */
function radioitr() {
  $('#tiporadio').val('');
  $('.thv').show();
  $('#placa').prop('disabled', true);
  op = '';
  accordion1desbloqueado(op);
  referencias_ah_des();
  datossolicitudes_des();
  //documentos_ah_des();
  campos_ah_bloc();
  consultar_hojadevida();
  readonly_campos();
  limpia_actualza();
  flete_desbloquear();
  $('#inexistente_propietario').hide();
  $('#inexistente_poseedor').hide();
  $('#inexistente_conductor').hide();
  $('#inexistente_vehiculo').hide();
  $('#inexistente_trailer').hide();
}

/* Itr block */
function radioitrblock() {
  $('.thv').show();
  $('#tiporadio').val('');
  $('#divhabil').hide();
  $('#divactualiza').hide();
}

function radiohv_bloc() {
  $('.thv').show();
  $('#tiporadio').val('');
  $('#divhabil').hide();
  $('#divactualiza').hide();
}

function referencias_nuevo_des() {
  $('#panel_referenciaNEW').show();
}

function datossolicitudes_des() {
  $('#divdatos').show();
  $('#panel_solicitudes').show();
}

function documento_nuevo_des() {
  $('#panel_papeles').show();
}

function boton_guardar_des() {
  $('#divdatos').show();
  $('#crear_preestudio').show();
}

function referencias_ah_des() {
  $('#panel_referenciahv').show();
  $('#panel_refepersonal').show();
}

function documentos_ah_des() {
  $('#panel_papeles_habilitar').show();
}

function campos_ah_bloc() {
  $('#panel_seguridad').hide();
}

function flete_desbloquear() {
  $('#panel_fletepk').css('display', 'block');
}

function campos_ah_des() {
  $('#panel_seguridad').show();
}

/*********************************************Función para limpiar campos v nuevos*********************************/
function limpiacampos_datosvehiculos1() {
  $('#web').val('');
  $('#user_satelite').val('');
  $('#clave').val('');
  $('#nompro').val('');
  $('#docupro').val('');
  $('#nomtene').val('');
  $('#docutene').val('');
  $('#nomcondu').val('');
  $('#docucondu').val('');
  $('#obserpree').val('');
}

function limpiacampos_datosvehiculo() {
  $('#placa').val('');
  $('#placag').val('');
  $('#placat').val('');
  $('#web').val('');
  $('#user_satelite').val('');
  $('#clave').val('');
  $('#nompro').val('');
  $('#docupro').val('');
  $('#nomtene').val('');
  $('#docutene').val('');
  $('#nomcondu').val('');
  $('#docucondu').val('');
}

function limpiacampos_referencia() {
  $('#empresa_crear1').val('');
  $('#fingreso_crear1').val('');
  $('#fretiro_crear1').val('');
  $('#contacto_crear1').val('');
  $('#numero_crear1').val('');
  $('#cargo_crear1').val('');
  $('#antiguedad_crear1').val('');

  $('#empresa_crear2').val('');
  $('#fingreso_crear2').val('');
  $('#fretiro_crear2').val('');
  $('#contacto_crear2').val('');
  $('#numero_crear2').val('');
  $('#cargo_crear2').val('');
  $('#antiguedad_crear2').val('');

  $('#empresa_crear3').val('');
  $('#fingreso_crear3').val('');
  $('#fretiro_crear3').val('');
  $('#contacto_crear3').val('');
  $('#numero_crear3').val('');
  $('#cargo_crear3').val('');
  $('#antiguedad_crear3').val('');
}

function limpiacampos_solicitud() {
  $('#capa_carga_vh').val('');
}

function limpia_archivoprefiltro() {
  $('#tabla_papeles').html('');
}

function limpia_referencias_hv() {
  $('#referencias_empresariales1').val();
  $('#fingreso1').val('');
  $('#fretiro1').val('');
  $('#contacto_ref1').val('');
  $('#celular_ref1').val('');
  $('#cargo_ref1').val('');
  $('#anti_ref1').val('');

  $('#referencias_empresariales2').val();
  $('#fingreso2').val('');
  $('#fretiro2').val('');
  $('#contacto_ref2').val('');
  $('#celular_ref2').val('');
  $('#cargo_ref2').val('');
  $('#anti_ref2').val('');

  $('#referencias_empresariales3').val();
  $('#fingreso3').val('');
  $('#fretiro13').val('');
  $('#contacto_ref3').val('');
  $('#celular_ref3').val('');
  $('#cargo_ref3').val('');
  $('#anti_ref3').val('');

  $('#referencias_personales1').val();
  $('#fecha_personal1').val();
  $('#parenp1').blur();
  $('#telefonop1').val('');

  $('#referencias_personales2').val('');
  $('#fecha_personal2').val('');
  $('#parenp2').blur();
  $('#telefonop2').val('');
}

function limpia_actualza() {
  //update
  $('#cuerpo_actu').html('');
  $('#dato').val('');
  $('#detalle').val('');
  $('#label').val('');
}

function limpia_subasta() {
  $('#su_propuesto').val('');
}

function readonly_campos() {
  $('#placag').prop('disabled', true);
  $('#placat').prop('disabled', true);
  $('#web').prop('disabled', true);
  $('#user_satelite').prop('disabled', true);
  $('#clave').prop('disabled', true);
  $('#nompro').prop('disabled', true);
  $('#docupro').prop('disabled', true);
  $('#nomtene').prop('disabled', true);
  $('#docutene').prop('disabled', true);
  $('#nomcondu').prop('disabled', true);
  $('#docucondu').prop('disabled', true);
  $('#capa_carga_vh').prop('disabled', false);
  $('#obserpree').attr('disabled', false);
  $('#capa_carga_vh').attr('disabled', true);
  var i;
  for (i = 1; i <= 3; i++) {
    $('#idrl' + i).prop('disabled', false);
    $('#referencias_empresariales' + i).prop('disabled', true);
    $('#fingreso' + i).prop('disabled', true);
    $('#fretiro' + i).prop('disabled', true);
    $('#contacto_ref' + i).prop('disabled', true);
    $('#celular_ref' + i).prop('disabled', true);
    $('#cargo_ref' + i).prop('disabled', true);
    $('#anti_ref' + i).prop('disabled', true);
    //deshabilitar los input file para actualizar documentos
    $('#docuupdate' + i).prop('disabled', true);
  }
}

function consultar_hojadevida() {
  let placa = $('#placag').val();
  $.post(
    $('#id_url_ajax').val() + 'validacionparametros/Consulta_Preestudio',
    'placa=' + placa,
    function (data) {
      if (data) {
        $('#placag').val(data[0].placa);
        $('#placat').val(data[0].placa_trailer);
        $('#web').val(data[0].web_satelital);
        $('#user_satelite').val(data[0].usuario_satelital);
        $('#clave').val(data[0].clave_satelital);
        $('#nompro').val(data[0].nombre_propietario + ' ' + data[0].proape1 + ' ' + data[0].proape2);
        $('#docupro').val(data[0].documento_propietario);
        $('#nomtene').val(data[0].nombre_tenedor + ' ' + data[0].teape1 + ' ' + data[0].teape2);
        $('#docutene').val(data[0].documento_tenedor);
        $('#nomcondu').val(data[0].nombre_conductor + ' ' + data[0].coape1 + ' ' + data[0].coape2);
        $('#docucondu').val(data[0].documento_conductor);
        $('#capa_carga_vh').val(data[0].capacidad_tn);
        $('#docproptrailer').val(data[0].documento_propietario_trailer);
        $('#nomproptrailer').val(data[0].nombre_propietario_trailer + ' ' + data[0].protape1 + ' ' + data[0].protape2);
        //Campos actualizar acordeon
        $('#veh_vehiculo').val('Placa:' + data[0].placa + '  Trailer:' + data[0].placa_trailer);
        $('#veh_conduc').val('Nombre: ' + data[0].nombre_conductor + ' ' + data[0].coape1 + ' ' + data[0].coape2 + '   Documento:' + data[0].documento_conductor);
        $('#veh_propiet').val('Nombre: ' + data[0].nombre_propietario + ' ' + data[0].proape1 + ' ' + data[0].proape2 + '    Documento:' + data[0].documento_propietario);
        $('#veh_poseed').val('Nombre: ' + data[0].nombre_tenedor + ' ' + data[0].teape1 + ' ' + data[0].teape2 + '   Documento:' + data[0].documento_tenedor);
      }
    },
    'json',
  );

  $.post(
    $('#id_url_ajax').val() + 'validacionparametros/Consulta_Referencia',
    'placa=' + placa,
    function (data) {
      if (data) {
        let cun = 0;
        for (var i = 0; i < data.length; i++) {
          cun++;
          $('#idconductor').val(data[i].id_conductor);
          $('#idrl' + cun).val(data[i].id);
          $('#referencias_empresariales' + cun).val(data[i].nombre_empresa);
          $('#fingreso' + cun).val(data[i].fecha_ingreso);
          $('#fretiro' + cun).val(data[i].fecha_retiro);
          $('#contacto_ref' + cun).val(data[i].persona_contacto);
          $('#celular_ref' + cun).val(data[i].celular);
          $('#cargo_ref' + cun).val(data[i].cargo);
          $('#anti_ref' + cun).val(data[i].antiguedad);
        }
      }
    },
    'json',
  );

  $.post(
    $('#id_url_ajax').val() + 'validacionparametros/Consulta_Rpersonal',
    'placa=' + placa,
    function (data) {
      if (data) {
        let con = 0;
        for (var i = 0; i < data.length; i++) {
          con++;
          $('#referencias_personales' + con).val(data[i].nombre_personal);
          $('#fecha_personal' + con).val(data[i].fecha);
          $('#parenp' + con).val(data[i].parentezco);
          $('#telefonop' + con).val(data[i].tel_personal);
        }
      }
    },
    'json',
  );
}

function referencias_prefiltro() {
  if (d.getElementById('nuevo').checked) {
    if ($('#nuevo').is(':checked')) {
      contador_global1 = 0;
      var documento_conductor = $('#docucondu').val();
      $.post(
        $('#id_url_ajax').val() + 'validacionparametros/busqueda_referencias',
        'documento_conductor=' + documento_conductor,
        function (data) {
          var mensaje = '';
          if (data != null && data != '') {
            $('#table_mercancia').html('');
            $('#agregar_fila').hide();
            var hoy = moment().format('YYYY-MM-DD');
            for (i = 0; i <= 2; i++) {
              contador_global1 = contador_global1 + 1;
              let c = i + 1;
              var referencias = `
              <tr id="tr${b}">
                <tr style="text-align:left; color:white; background-color:#332D2D;margin-top: 10px;">
                  <th style="text-align:center;" >Empresa&nbsp;<span style="color:#DC4C64;"><i>(*)</i></span></th>
                  <th style="text-align:center;">Fecha Ingreso</th>
                  <th style="text-align:center;">Fecha Retiro</th>
                </tr>
                <td>
                  <input type="text" id="empresa_crear${c}" name="empresa_crear[]" class="form-control input-sm" value="${data[i]['nombre_empresa']}">
                </td>
                <td>
                  <input type="date" id="fingreso_crear${c}" name="fingreso_crear[]" class="form-control input-sm" value="${hoy}">
                </td>
                <td>
                  <input type="date" id="fretiro_crear${c}" name="fretiro_crear[]"  class="form-control input-sm" value="${hoy}"  >
                </td>
              </tr>
              <tr style="text-align:left; color:white; background-color:#332D2D;margin-top: 10px;">
                <th>Contacto (Nombres y Apellidos)</th>
                <th>Teléfono&nbsp;<span style="color:#DC4C64;"><i>(*)</i></span></th>
                <th>Cargo</th>
              </tr>
              <tr>
                <td>
                  <input type="text" id="contacto_crear${c}" name="contacto_crear[]" class="form-control input-sm" value="${data[i]['persona_contacto']}">
                </td>
                <td>
                  <input type="number" id="numero_crear${c}" name="numero_crear[]" class="form-control input-sm" value="${data[i]['celular']}">
                </td>
                <td>
                  <input type="text" id="cargo_crear${c}" name="cargo_crear[]" class="form-control input-sm" value="${data[i]['cargo']}">
                </td>
              </tr>
              <tr>
                <th>Antiguedad</th>
              </tr>
              <td>
                <input type="number" id="antiguedad_crear${c}" name="antiguedad_crear[]"  class="form-control input-sm" min="0"  value="${data[i]['antiguedad']}">
              </td>
              <td style="width:10%;">
                <input type="hidden" id="" value="${c}" class="form-control" readonly="readonly">
              </td>
              <tr style="width:10px;background-color:blue;margin-top:2px;">
              <div></div>
              </tr>
            `;
              $('#table_mercancia').append(referencias);
            }
          } else {
            $('#table_mercancia').html('');
            $('#agregar_fila').show();
            contador_global1 = 0;
          }
        },
        'json',
      );
    }
  }
}

/*************************** Función para ubicar bloque de datos segun radio seleccionado *********************/
$('#habil').change(function () {
  if ($(this).is(':checked')) {
    op = '';
    accordion1desbloqueado(op);
    referencias_ah_des();
    datossolicitudes_des();
    //documentos_ah_des();
    campos_ah_bloc();
    consultar_hojadevida();
    readonly_campos();
    limpia_actualza();
    flete_desbloquear();
    $('#inexistente_propietario').hide();
    $('#inexistente_poseedor').hide();
    $('#inexistente_conductor').hide();
    $('#inexistente_vehiculo').hide();
    $('#inexistente_trailer').hide();
  }
});

async function listar_responsables() {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'validacionparametros/listar_responsables_vehiculo', {
      method: 'POST',
      // body: datos,
      cache: 'no-cache',
    });
    const data = await response.json();
    // console.log('🚀 ~ listar_responsables ~ data:', data);
    var html = '<option value="">Seleccionar cliente</option>';
    data.forEach(function (item) {
      html += `<option value="${item.usuario_responsable_id}">${item.user_log} - ${item.nom_usuario}</option>`;
    });
    $('#responsable_vehiculo').html(html);
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    // $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
  }
}
