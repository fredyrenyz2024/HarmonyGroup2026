
const web = document.querySelector('#web'),
  user_satelite = document.querySelector('#user_satelite'),
  clave = document.querySelector('#clave'),
  nompro = document.querySelector('#nompro'),
  docupro = document.querySelector('#docupro'),
  nomtene = document.querySelector('#nomtene'),
  docutene = document.querySelector('#docutene'),
  nomcondu = document.querySelector('#nomcondu'),
  docucondu = document.querySelector('#docucondu');

// document.addEventListener('DOMContentLoaded', async e => {
$(document).ready(function () {
  // e.preventDefault();
  // $('.select2').select2();
  // const SELECTFILTRO = document.querySelector('#filtro_estado');
  // const BTN_FILTRAR = document.querySelector('#btn-filtrar');
  const SELECTFILTRO = "todos";
  Filtro();

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

  let numero = 0;
  // document.getElementById("#buscar").addEventListener('click', Filtro);
  // SELECTFILTRO.addEventListener("change", Filtro);
  $('#buscar').click(async function () {
    Filtro();
  });
  /**
   * Filtro es una funcion asincrona que se encarga de mostrar las solicitudes de servicio
   * segun el filtro seleccionado por el usuario.
   * 
   * @author RICARDO ANDRES CELY GAITAN
   * @since 2020-12-15
   * @version 1.0
   * @param {string} SELECTFILTRO - El valor del select que contiene el filtro seleccionado por el usuario.
   * @param {string} fecha_inicial - La fecha inicial del rango de fechas a consultar.
   * @param {string} fecha_final - La fecha final del rango de fechas a consultar.
   * @returns {void}
   */

  async function Filtro() {
    if (SELECTFILTRO !== '') {
      $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
      try {
        let data = new FormData();
        data.append('filtro', SELECTFILTRO);
        data.append('fecha_inicial', document.getElementById('fecha_inicial').value);
        data.append('fecha_final', document.getElementById('fecha_final').value);
        // await fetch($('#base_url').val() + 'prefiltro_nacional/Consultar_Solicitudes', {
        await fetch($('#base_url').val() + 'prefiltro_nacional/Consultar_Solicitudes', {
          method: 'POST',
          body: data,
        })
          .then(response => {
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
          })
          .then(function (data) {
            let tbody = document.getElementById('tbl-solicitudes');
            let clase_btn = '';
            let estado = '';
            let template = '';
            let toltip = '';
            let estadobtn = '';
            let itr = '';
            if (data) {
              console.log(data);
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
                  // } else if (element.esoli === null) {
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
                  // itr = '<span class="badge badge-success float-right">SI</span>';
                  itr = '<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">SI</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>';
                } else {
                  // itr = '<span class="badge badge-primary float-right">NO</span>';
                  itr = '<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">NO</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>';
                }
                template += `
              <tr>
                <!--<td class='text-${clase_btn}'>
                   <center>
                    <span class="mdi mdi-dot-circle icon" data-toggle="tooltip" title="${element.esoli !== null ? element.esoli : 'Pendiente'}"></span>
                   </center> data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop"
                </td>-->

                <td  class="cell-detail">
                      <a href="#" class="text-decoration-none fw-bold"  onclick="preestudio(this);" data-id="${element.n_cotizacion}" 
                        data-id2="${element.nundoc_solicitud}" data-id3="${element.nombre_cliente}" data-id4="${element.item}" data-id5="${element.tipo_mercancia}"
                        data-id6="${element.flete}" data-id7="${element.peso_neto_tn}" data-id8="${element.tipo_servicio_mer}"  data-id9="${element.total_tarifa}"
                        data-id10=""${element.origen_rndc}"  data-id11="${element.itr}" onclick="reiniciar_contador();" ${estadobtn}>N°${element.elid}</a> 
                          <!--COT-SS-BN
                    <span>${element.n_cotizacion} - ${element.elid} - ${element.item} </span>
                    <span class="text-success" style="font-weight:800;">${element.tipo_servicio_mer}</span>-->
                </td>
                <td  class="cell-detail">
                  <span class="text-success" style="font-weight:800;">${element.tipo_servicio_mer}</span>   
                </td>

                <td class="cell-detail">
                  <span>${itr}</span>
                </td>

                <td class="cell-detail">
                    <span> ${element.nombre_cliente} ${element.nit}</span>
                </td>

                <td class="cell-detail" style="text-align: left;vertical-align: middle;font-size: 9px;" >
                    <span>${element.tipo_mercancia}</span>
                </td>

                <td class="cell-detail" >
                    <span>${element.nombre}</span>
                </td>

                <td class="cell-detail" style="text-align: left;vertical-align: middle;font-size: 9px;width: 10px;">
                  <span title="Peso Neto kg">${formatNum(element.peso_kg)} kg</span>
                </td>

                <td class="cell-detail" style="font-size: 9px;width:100px;" >
                  <span><b>Origén:</b> ${element.origen_solicitud} <br> <b>Destino:</b> ${element.destino_solicitud}</span>
                </td>

                <td class="cell-detail text-center"
                  <span>${element.fecha}<br>${element.hora_creacion} </span>
                </td>
              
                <td class="cell-detail">
                      <span class="badge badge-phoenix badge-phoenix-${clase_btn}" title="${toltip}">${element.numero_placas > 0 ? 'Placas asignadas' : 'Sin asignar'}</span>
                </td>

                <!--<td  class="cell-detail"  style="text-align: center;vertical-align: middle;width: auto;white-space: nowrap;">
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-success" type="button" onclick="preestudio(this);" data-id="${element.n_cotizacion}" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop"
                        data-id2="${element.nundoc_solicitud}" data-id3="${element.nombre_cliente}" data-id4="${element.item}" data-id5="${element.tipo_mercancia}"
                        data-id6="${element.flete}" data-id7="${element.peso_neto_tn}" data-id8="${element.tipo_servicio_mer}"  data-id9="${element.total_tarifa}"
                        data-id10=""${element.origen_rndc}"  data-id11="${element.itr}" onclick="reiniciar_contador();" ${estadobtn}>
                        <span class="text-white uil uil-plus-square"></span>
                      </button>

                     <button class="btn btn-info" type="button" onclick="consulta_coti(this)"; data-hint="" data-id="${element.n_cotizacion}"  data-id2="${element.nundoc_solicitud}"  
                      data-id3="${element.idnegocio}" data-id4="${element.cant_vehiculo}" data-id5="${element.cant_disponible}">
                        <span class="icon mdi mdi-eye input-md" data-toggle="modal"data-target="#consulta_solicitud" title="Consultar solicitud de servicio"></span>
                     </button>

                     <button type="button" class="btn btn-warning mdi mdi-edit" data-placement="top" onclick="status(this)"; data-hint="" data-id="${element.n_cotizacion}"  data-id2="${element.nundoc_solicitud}">
                        <span class="icon mdi mdi-balance input-md"data-toggle="modal" data-target="#status" title="status"></span>
                    </button>
                    </div>
                </td>-->
            </tr>`;
                tbody.innerHTML = template;
              });
            } else {
              tbody.innerHTML = '';
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
  document.addEventListener('change', async e => {
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
      let checkboxes = document.querySelectorAll('.recursos_checbox');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            const valorSeleccionado = checkbox.value;
            if (valorSeleccionado === 'nuevo_recurso') {
              document.getElementById('creacion_nuevo_recuro').style.display = 'block';
              document.getElementById('inexistente_actividades').style.display = 'block';
            } else if (valorSeleccionado === 'datos_dinamicos') {
              document.getElementById('datos_dinamicos').style.display = 'block';
            }
          } else if (!checkbox.checked) {
            const valorunchecked = checkbox.value;
            if (valorunchecked === 'nuevo_recurso') {
              document.getElementById('creacion_nuevo_recuro').style.display = 'none';
              document.getElementById('inexistente_actividades').style.display = 'none';
            } else if (valorunchecked === 'datos_dinamicos') {
              document.getElementById('datos_dinamicos').style.display = 'none';
            }
          }
        });
      });

      /* Elegir el tipo de de recurso que se queire crear */
      let checkboxes_recursos = document.querySelectorAll('.chebox_recurso');
      checkboxes_recursos.forEach(checkbox_recurso => {
        checkbox_recurso.addEventListener('change', () => {
          if (checkbox_recurso.checked) {
            const Recurso = checkbox_recurso.value;
            if (Recurso === 'Propietario') {
              document.getElementById('inexistente_propietario').style.display = 'block';
            } else if (Recurso === 'Poseedor') {
              document.getElementById('inexistente_poseedor').style.display = 'block';
            } else if (Recurso === 'Conductor') {
              document.getElementById('inexistente_conductor').style.display = 'block';
            } else if (Recurso === 'Trailer') {
              document.getElementById('inexistente_trailer').style.display = 'block';
            } else if (Recurso === 'Vehículo') {
              document.getElementById('inexistente_vehiculo').style.display = 'block';
            }
          } else if (!checkbox_recurso.checked) {
            const Recursounchecked = checkbox_recurso.value;
            if (Recursounchecked === 'Propietario') {
              document.getElementById('inexistente_propietario').style.display = 'none';
            } else if (Recursounchecked === 'Poseedor') {
              document.getElementById('inexistente_poseedor').style.display = 'none';
            } else if (Recursounchecked === 'Conductor') {
              document.getElementById('inexistente_conductor').style.display = 'none';
            } else if (Recursounchecked === 'Trailer') {
              document.getElementById('inexistente_trailer').style.display = 'none';
            } else if (Recursounchecked === 'Vehículo') {
              document.getElementById('inexistente_vehiculo').style.display = 'none';
            }
          }
        });
      });
    }
    // Validar si el propietario ya esta registardo en la base de datos
    if (e.target.matches('#docupro') || e.target.matches('#docupro *')) {
      let documento = document.getElementById('docupro').value;
      let dato = new FormData();
      dato.append('documento', documento);
      try {
        const response = await fetch($('#base_url').val() + 'validacionparametros/Validar_Propietario', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          // document.getElementById('docupro').disabled = true;
          document.getElementById('nompro').value = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
          // document.getElementById('nompro').disabled = true;
          document.getElementById('mensaje_propietario_existe').innerHTML = `
                <p class="bg-success text-center" style='color:#FFF'>Este Propietario ya esta registrado en el sistema.</p>
              `;
        } else {
          document.getElementById('docupro').disabled = false;
          document.getElementById('nompro').disabled = false;
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
      let documento = document.getElementById('docutene').value;
      let dato = new FormData();
      dato.append('documento', documento);
      try {
        const response = await fetch($('#base_url').val() + 'validacionparametros/Validar_Poseedor', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          // document.getElementById('docutene').disabled = true;
          document.getElementById('nomtene').value = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
          // document.getElementById('nomtene').value = data.Nombre;
          // document.getElementById('nomtene').disabled = true;
          document.getElementById('mensaje_poseedor_existe').innerHTML = `
                <p class="bg-success text-center" style='color:#FFF'>Este Poseedor ya esta registrado en el sistema.</p>
              `;
        } else {
          document.getElementById('docutene').disabled = false;
          document.getElementById('nomtene').disabled = false;
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
      let documento = document.getElementById('docucondu').value;
      let dato = new FormData();
      dato.append('documento', documento);
      try {
        const response = await fetch($('#base_url').val() + 'validacionparametros/Validar_Conductor', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          // document.getElementById('docucondu').disabled = true;
          document.getElementById('nomcondu').value = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
          // document.getElementById('nomcondu').value = data.Nombre;
          // document.getElementById('nomcondu').disabled = true;
          document.getElementById('mensaje_conductor_existe').innerHTML = `
                <p class="bg-success text-center" style='color:#FFF'>Este Conductor ya esta registrado en el sistema.</p>
              `;
        } else {
          document.getElementById('docucondu').disabled = false;
          document.getElementById('nomcondu').disabled = false;
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
      let placa = document.getElementById('placat').value;
      let dato = new FormData();
      dato.append('placa_trailer', placa);
      try {
        const response = await fetch($('#base_url').val() + 'validacionparametros/Validar_Trailer', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          document.getElementById('placat').disabled = true;
          document.getElementById('docproptrailer').value = data.numero_documento;
          document.getElementById('nomproptrailer').value = data.Nombre_propietario;
          // document.getElementById('docproptrailer').disabled = true;
          // document.getElementById('nomproptrailer').disabled = true;
          document.getElementById('mensaje_trailer_existe').innerHTML = `
            <p class="bg-success text-center" style='color:#FFF'>Este Trailer ya esta registrado en el sistema, con el vehiculo de placa: ${data.placa_vehiculo}</p>
          `;
        } else {
          document.getElementById('placat').disabled = false;
          document.getElementById('docproptrailer').disabled = false;
          document.getElementById('nomproptrailer').disabled = false;
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
      let documento = document.getElementById('number_propietario').value;
      let dato = new FormData();
      dato.append('documento', documento);
      try {
        const response = await fetch($('#base_url').val() + 'validacionparametros/Validar_Propietario', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          // document.getElementById('number_propietario').disabled = true;
          $('#crea_vehiculopreestudio').modal('hide');
          $('#mensaje_notificacion').html('<b>Advertencia!</b>');
          const name_propietario = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
          let actividad = 'Propietario';
          $('#texto_notificacion').html(
            `Este <b>${actividad}</b> ya esta registrado en NexosApp como: <b>${name_propietario}</b> la actualizacion de campos diferentes a documentos y placas debe ser por datos dinamicos`,
          );
          $('#mod-warning').modal('toggle');
        } else {
          document.getElementById('number_propietario').disabled = false;
          document.getElementById('name_propietario').disabled = false;
        }
      } catch (error) {
        console.error('Error en la segunda solicitud:', error);
        throw error;
      } finally {
        $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    }

    if (e.target.matches('#number_poseedor') || e.target.matches('#number_poseedor *')) {
      let documento = document.getElementById('number_poseedor').value;
      let dato = new FormData();
      dato.append('documento', documento);
      try {
        const response = await fetch($('#base_url').val() + 'validacionparametros/Validar_Poseedor', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          // document.getElementById('number_propietario').disabled = true;
          $('#crea_vehiculopreestudio').modal('hide');
          $('#mensaje_notificacion').html('<b>Advertencia!</b>');
          const name_pOSEEDOR = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
          let actividad = 'Poseedor';
          $('#texto_notificacion').html(
            `Este <b>${actividad}</b> ya esta registrado en NexosApp como: <b>${name_pOSEEDOR}</b> la actualizacion de campos diferentes a documentos y placas debe ser por datos dinamicos`,
          );
          $('#mod-warning').modal('toggle');
        } else {
          document.getElementById('number_poseedor').disabled = false;
          document.getElementById('name_propietario').disabled = false;
        }
      } catch (error) {
        console.error('Error en la segunda solicitud:', error);
        throw error;
      } finally {
        $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    }

    if (e.target.matches('#number_conductor') || e.target.matches('#number_conductor *')) {
      let documento = document.getElementById('number_conductor').value;
      let dato = new FormData();
      dato.append('documento', documento);
      try {
        const response = await fetch($('#base_url').val() + 'validacionparametros/Validar_Conductor', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          // document.getElementById('number_propietario').disabled = true;
          $('#crea_vehiculopreestudio').modal('hide');
          $('#mensaje_notificacion').html('<b>Advertencia!</b>');
          const name_pOSEEDOR = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
          let actividad = 'Conductor';
          $('#texto_notificacion').html(
            `Este <b>${actividad}</b> ya esta registrado en NexosApp como: <b>${name_pOSEEDOR}</b> la actualizacion de campos diferentes a documentos y placas debe ser por datos dinamicos`,
          );
          $('#mod-warning').modal('toggle');
        } else {
          document.getElementById('number_conductor').disabled = false;
          document.getElementById('name_propietario').disabled = false;
        }
      } catch (error) {
        console.error('Error en la segunda solicitud:', error);
        throw error;
      } finally {
        $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    }

    if (e.target.matches('#propidocu_trailer') || e.target.matches('#propidocu_trailer *')) {
      let documento = document.getElementById('propidocu_trailer').value;
      let dato = new FormData();
      dato.append('documento', documento);
      try {
        const response = await fetch($('#base_url').val() + 'validacionparametros/Validar_Conductor', {
          method: 'POST',
          body: dato,
          cache: 'no-cache',
        });
        const data = await response.json();
        if (data) {
          // document.getElementById('number_propietario').disabled = true;
          $('#crea_vehiculopreestudio').modal('hide');
          $('#mensaje_notificacion').html('<b>Advertencia!</b>');
          const name_pOSEEDOR = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
          let actividad = 'Conductor';
          $('#texto_notificacion').html(
            `Este <b>${actividad}</b> ya esta registrado en NexosApp como: <b>${name_pOSEEDOR}</b> la actualizacion de campos diferentes a documentos y placas debe ser por datos dinamicos`,
          );
          $('#mod-warning').modal('toggle');
        } else {
          document.getElementById('propidocu_trailer').disabled = false;
          document.getElementById('name_propietario').disabled = false;
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
  document.addEventListener('click', async e => {
    //Validar propietario para ITR
    if (e.target.matches('#si_propietario') || e.target.matches('#si_propietario *')) {
      document.getElementById('accion_propietario').innerHTML = 'Validado';
      document.getElementById('accion_propietario').style.backgroundColor = '#14A44D';
      document.getElementById('accion_propietario').style.color = '#FFFFFF';
      datos_validado++;
    } else if (e.target.matches('#no_propietario') || e.target.matches('#no_propietario *')) {
      actualizar_itr();
    }

    // Validar poseedor de ITR
    if (e.target.matches('#si_poseedor') || e.target.matches('#si_poseedor *')) {
      document.getElementById('accion_poseedor').innerHTML = 'Validado';
      document.getElementById('accion_poseedor').style.backgroundColor = '#14A44D';
      document.getElementById('accion_poseedor').style.color = '#FFFFFF';
      datos_validado++;
    } else if (e.target.matches('#no_poseedor') || e.target.matches('#no_poseedor *')) {
      actualizar_itr();
    }

    // Validar conductor de ITR
    if (e.target.matches('#si_conductor') || e.target.matches('#si_conductor *')) {
      document.getElementById('accion_conductor').innerHTML = 'Validado';
      document.getElementById('accion_conductor').style.backgroundColor = '#14A44D';
      document.getElementById('accion_conductor').style.color = '#FFFFFF';
      datos_validado++;
    } else if (e.target.matches('#no_conductor') || e.target.matches('#no_conductor *')) {
      actualizar_itr();
    }

    // Validar propietario del tráiler para ITR
    if (e.target.matches('#si_propietario_trailer') || e.target.matches('#si_propietario_trailer *')) {
      document.getElementById('accion_propietario_trailer').innerHTML = 'Validado';
      document.getElementById('accion_propietario_trailer').style.backgroundColor = '#14A44D';
      document.getElementById('accion_propietario_trailer').style.color = '#FFFFFF';
      datos_validado++;
    } else if (e.target.matches('#no_propietario_trailer') || e.target.matches('#no_propietario_trailer *')) {
      actualizar_itr();
    }

    /* Validar los click antes de precionar el boton de guarfar prefiltro para mostrar el boton */
    if (document.getElementById('proceso_itr') === 'Si') {
    } else {
    }

    // if (document.getElementById('accion_propietario_trailer').textContent === 'No Aplica') {
    //   if (datos_validado >= 3) {
    //     $('#crear_preestudio').show();
    //   } else {
    //   }
    // } else {
    //   if (datos_validado >= 4) {
    //     $('#crear_preestudio').show();
    //   } else {
    //   }
    // }

    /* Guardar registros de prefiltro */
    if (e.target.matches('#crear_preestudio') || e.target.matches('#crear_preestudio *')) {
      // alert('boton guardar');
      let proceso_itr = document.getElementById('proceso_itr').value;
      if (proceso_itr === 'Si') {
        if (datos_validado === 0) {
          // Primer viaje
          if (document.getElementById('placa').value !== '') {
            // $("#crear_preestudio").hide();
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
                `<div class="alert alert-outline-danger d-flex align-items-center" role="alert">
                    <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                    <p class="mb-0 flex-1">${msg_error}</br></p>
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`
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
                msg_error += '<p>Debe seleccionar un <strong>Responsable </strong> del vehículo para poder crear la solicitudocument.</p>';
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
                if (document.getElementById('nuevo').checked) {
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
                if (document.getElementById('propietario_obligatorio').checked) {
                  if (document.getElementById('placat').value === '') {
                    // console.log('campos obligatorios');
                    $('#placat + p').remove();
                    const ERROR = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                    $('#placat').after(ERROR);
                    AplicaFoco('#placat');
                    msg_error += '<p>Debe diligenciar <strong>placa</strong> del trailer para poder crear la solicitudocument.</p>';
                  } else {
                    $('#placat + p').remove();
                    RemueveFoco('#placat');
                  }

                  if (document.getElementById('docproptrailer').value === '') {
                    $('#docproptrailer + p').remove();
                    const ERROR2 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                    $('#docproptrailer').after(ERROR2);
                    AplicaFoco('#docproptrailer');
                    msg_error += '<p>Debe diligenciar <strong>Documento Propietario trailer</strong> para poder crear la solicitudocument.</p>';
                  } else {
                    $('#docproptrailer + p').remove();
                    RemueveFoco('#docproptrailer');
                  }

                  if (document.getElementById('nomproptrailer').value === '') {
                    $('#nomproptrailer + p').remove();
                    const ERROR3 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                    $('#nomproptrailer').after(ERROR3);
                    AplicaFoco('#nomproptrailer');
                    msg_error += '<p>Debe diligenciar <strong>Nombre Propietario Trailer</strong> para poder crear la solicitudocument.</p>';
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

                if (document.getElementById('habil').checked || document.getElementById('update').checked) {
                  if (!$('#referencias_empresariales1').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Referencias laboral 1</strong> para poder crear la solicitudocument.</p>';
                  }
                  if (!$('#celular_ref1').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Celular laboral 1</strong> para poder crear la solicitudocument.</p>';
                  }
                  if (!$('#referencias_empresariales2').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Referencias laboral 2</strong> para poder crear la solicitudocument.</p>';
                  }
                  if (!$('#celular_ref2').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Celular laboral 2</strong> para poder crear la solicitudocument.</p>';
                  }
                  if (!$('#referencias_empresariales3').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Referencias laboral 3</strong> para poder crear la solicitudocument.</p>';
                  }
                  if (!$('#celular_ref3').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Celular laboral 3</strong> para poder crear la solicitudocument.</p>';
                  }
                  //personales
                  if (!$('#referencias_personales1').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Nombre persona 1</strong> para poder crear la solicitudocument.</p>';
                  }
                  if (!$('#parenp1').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Parentezco 1</strong> para poder crear la solicitudocument.</p>';
                  }
                  if (!$('#telefonop1').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Teléfono 1</strong> en ref. personal para poder crear la solicitudocument.</p>';
                  }
                  if (!$('#referencias_personales2').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Nombre persona 2</strong> en ref. personal para poder crear la solicitudocument.</p>';
                  }
                  if (!$('#parenp2').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Parentezco 2</strong> para poder crear la solicitudocument.</p>';
                  }
                  if (!$('#telefonop2').val()) {
                    msg_error += '<p>Debe diligenciar <strong>Teléfono 2</strong> para poder crear la solicitudocument.</p>';
                  }

                  if (document.getElementById('update').checked) {
                    if (!document.getElementById('cbox1').checked && !document.getElementById('cbox2').checked) {
                      msg_error += '<p>Debe seleccionar <strong>una opción de recurso</strong> para poder crear la solicitud (Actualiza seguridad).</p>';
                    } else {
                      if (document.getElementById('cbox1').checked) {
                        //registrar campos nuevos
                        if (
                          !document.getElementById('cbpre1').checked &&
                          !document.getElementById('cbpre2').checked &&
                          !document.getElementById('cbpre3').checked &&
                          !document.getElementById('cbpre4').checked &&
                          !document.getElementById('cbpre5').checked
                        ) {
                          msg_error += '<p>Por favor seleccione el recurso a crear , opción seleccionada <strong>Recursos inexistentes</strong>.</p>';
                        } else {
                          if (document.getElementById('cbpre1').checked) {
                            //propietario
                            if (!$('#name_propietario').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Nombre Propietario</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#number_propietario').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Documento Propietario</strong> para poder crear la solicitudocument.</p>';
                            }
                          }

                          if (document.getElementById('cbpre2').checked) {
                            //poseedor
                            if (!$('#name_poseedor').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Nombre Poseedor</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#number_poseedor').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Documento Poseedor</strong> para poder crear la solicitudocument.</p>';
                            }
                          }

                          if (document.getElementById('cbpre3').checked) {
                            //conductor
                            if (!$('#name_conductor').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Nombre Conductor</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#number_conductor').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Documento Conductor</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#referencias_empresariales1pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Nombre referencia 1</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#contacto_ref1pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Persona contacto 1</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#celular_ref1pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Celular empresa 1</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#referencias_empresariales2pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Nombre referencia 2</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#contacto_ref2pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Persona contacto 2</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#celular_ref2pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Celular empresa 2</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#referencias_empresariales3pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Nombre referencia 3</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#contacto_ref3pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Persona contacto 3</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#celular_ref3pre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Celular empresa 3</strong> para poder crear la solicitudocument.</p>';
                            }
                          }

                          if (document.getElementById('cbpre4').checked) {
                            //trailer
                            if (!$('#placa_trailerpre').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Placa tráiler</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#propi_trailer').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Nombre propietario tráiler</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#propidocu_trailer').val()) {
                              msg_error += '<p>Debe diligenciar <strong>Documento propietario tráiler</strong> para poder crear la solicitudocument.</p>';
                            }
                          }
                        }
                      }
                      if (document.getElementById('cbox2').checked) {
                        //campos dinamicos
                        var idfila = $('#cuerpo_actu tr').length; //cantidad de filas de la tabla
                        if (idfila == 0) {
                          msg_error += '<p>Debe ingresar <strong>Mínimo 1 dato </strong> en bloque actualizar seguridad para poder crear la solicitudocument.</p>';
                        }
                      }
                    }
                  }
                }
              }
              if (!msg_error && $('#estado_prefiltron').val() == '') {
                if (comprobar() === false) {
                  if (document.getElementById('nuevo').checked) {
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
                    data.append('placa', document.getElementById('placag').value);
                    // Datos del propietario del vehiculo
                    data.append('trailer', document.getElementById('placat').value);
                    data.append('documento_propietario_trailer', document.getElementById('docproptrailer').value);
                    data.append('propietario_trailer', document.getElementById('nomproptrailer').value);
                    data.append('propietario', document.getElementById('nompro').value);
                    data.append('documento_pro', document.getElementById('docupro').value);
                    data.append('tenedor', document.getElementById('nomtene').value);
                    data.append('documento_tene', document.getElementById('docutene').value);
                    data.append('conductor', document.getElementById('nomcondu').value);
                    data.append('documento_condu', document.getElementById('docucondu').value);
                    data.append('web', document.getElementById('web').value);
                    data.append('user_satelite', document.getElementById('user_satelite').value);
                    data.append('clave', document.getElementById('clave').value);
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

                    // Obtener los valores de los inputs de tipo array
                    var empresa = document.getElementsByName('empresa_crear[]');
                    for (var i = 0; i < empresa.length; i++) {
                      data.append('empresa_crear[]', empresa[i].value);
                    }
                    var ingreso = document.getElementsByName('fingreso_crear[]');
                    for (var i = 0; i < ingreso.length; i++) {
                      data.append('fingreso_crear[]', ingreso[i].value);
                    }
                    var retiro = document.getElementsByName('fretiro_crear[]');
                    for (var i = 0; i < retiro.length; i++) {
                      data.append('fretiro_crear[]', retiro[i].value);
                    }
                    var persona = document.getElementsByName('contacto_crear[]');
                    for (var i = 0; i < persona.length; i++) {
                      data.append('contacto_crear[]', persona[i].value);
                    }
                    var num = document.getElementsByName('numero_crear[]');
                    for (var i = 0; i < num.length; i++) {
                      data.append('numero_crear[]', num[i].value);
                    }
                    var cargo = document.getElementsByName('cargo_crear[]');
                    for (var i = 0; i < cargo.length; i++) {
                      data.append('cargo_crear[]', cargo[i].value);
                    }
                    var anti = document.getElementsByName('antiguedad_crear[]');
                    for (var i = 0; i < anti.length; i++) {
                      data.append('antiguedad_crear[]', anti[i].value);
                    }
                    // Solicitudes de servicio
                    var solicitudes = document.getElementsByName('fserva[]');
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
                      var tipohj = document.getElementsByName('tipohoja[]');
                      for (var i = 0; i < tipohj.length; i++) {
                        var tipo = tipohj[i].value;
                        datos.tipohoja[i] = tipo;
                      }
                      var clase = document.getElementsByName('clase[]');
                      for (var i = 0; i < clase.length; i++) {
                        var clas = clase[i].value;
                        datos.clase[i] = clas;
                      }

                      var ruta = document.getElementsByName('ruta[]');
                      for (var i = 0; i < ruta.length; i++) {
                        var rut = ruta[i].value;
                        datos.ruta[i] = rut;
                      }

                      var documento = document.getElementsByName('documento[]');
                      for (var i = 0; i < documento.length; i++) {
                        var doc = documento[i].value;
                        datos.documento[i] = doc;
                      }

                      var namearchivo = document.getElementsByName('namearchivo[]');
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
                    await fetch($('#base_url').val() + 'validacionparametros/Insertar_preestudio_nuevo', {
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

                if (document.getElementById('habil').checked || document.getElementById('update').checked) {
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
                  data.append('placa', document.getElementById('placag').value);
                  data.append('flete_subasta', fletef);
                  data.append('tarifa_subasta', tarifaf);
                  data.append('fecha', $('#fpree').val());
                  data.append('hora', $('#hpree').val());
                  data.append('usuario', $('#userpree').val());
                  data.append('papeles', 'sin_datos');
                  data.append('observacion', $('#obserpree').val());
                  data.append('responsable_vehiculo', $('#responsable_vehiculo').val());
                  // Solicitudes de servicio
                  var solicitudes = document.getElementsByName('fserva[]');
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
                    if (document.getElementById('cbox2').checked) {
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
                            var papeles = document.getElementById('arc' + e + '').files[0];
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
                    if (document.getElementById('cbox1').checked) {
                      data.append('nuevos_recursos', 'si');
                      if (document.getElementById('cbpre1').checked) {
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
                      if (document.getElementById('cbpre2').checked) {
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
                      if (document.getElementById('cbpre3').checked) {
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

                      if (document.getElementById('cbpre4').checked) {
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
                  await fetch($('#base_url').val() + 'validacionparametros/Insert_estudio_itr', {
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
                        mensaje = `<div class="alert alert-outline-success d-flex align-items-center" role="alert">
                          <span class="fas fa-check-circle text-success fs-5 me-3"></span>
                          <p class="mb-0 flex-1"> ${data.mensaje}</p>
                          <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                <strong>Mensaje!</strong> ${data.mensaje}
                              </div>
                          </div>`;
                        $('#crear_preestudio').show();
                      }
                      document.getElementById('historicos').innerHTML = mensaje;
                    })
                    .catch(error => {
                      alert(error);
                      $('#crear_preestudio').show();
                    });
                }
              } else {
                $('#nexos_messages_popup').html(`<div class="alert alert-outline-danger d-flex align-items-center" role="alert">
                    <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                    <p class="mb-0 flex-1">${msg_error}</br></p>
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`);
                // $('#nexos_messages_popup').html(
                //   '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
                //   msg_error +
                //   '</div></div>',
                // );
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
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                    <strong>Mensaje!</strong> Debes diligenciar la placa para la solicitud de servicio
                  </div>
              </div>`;
            document.getElementById('historicos').innerHTML = mensaje;
            // alert("debe diligenciar la placa para la solicitud");
            $('#crear_preestudio').show();
          }
        } else {
          /* Seundo viaje en adelante */
          if (document.getElementById('accion_propietario_trailer').textContent === 'No Aplica') {
            if (datos_validado >= 3) {
              var radio = document.getElementById('habil');
              radio.checked = true; // Marcar como seleccionado
              if (document.getElementById('placa').value !== '') {
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
                    `<div class="alert alert-outline-danger d-flex align-items-center" role="alert">
                    <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                    <p class="mb-0 flex-1">${msg_error}</br></p>
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`
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
                    msg_error += '<p>Debe seleccionar un <strong>Responsable </strong> del vehículo para poder crear la solicitudocument.</p>';
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
                    if (document.getElementById('nuevo').checked) {
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
                    if (document.getElementById('propietario_obligatorio').checked) {
                      if (document.getElementById('placat').value === '') {
                        // console.log('campos obligatorios');
                        $('#placat + p').remove();
                        const ERROR = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                        $('#placat').after(ERROR);
                        AplicaFoco('#placat');
                        msg_error += '<p>Debe diligenciar <strong>placa</strong> del trailer para poder crear la solicitudocument.</p>';
                      } else {
                        $('#placat + p').remove();
                        RemueveFoco('#placat');
                      }

                      if (document.getElementById('docproptrailer').value === '') {
                        $('#docproptrailer + p').remove();
                        const ERROR2 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                        $('#docproptrailer').after(ERROR2);
                        AplicaFoco('#docproptrailer');
                        msg_error += '<p>Debe diligenciar <strong>Documento Propietario trailer</strong> para poder crear la solicitudocument.</p>';
                      } else {
                        $('#docproptrailer + p').remove();
                        RemueveFoco('#docproptrailer');
                      }

                      if (document.getElementById('nomproptrailer').value === '') {
                        $('#nomproptrailer + p').remove();
                        const ERROR3 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                        $('#nomproptrailer').after(ERROR3);
                        AplicaFoco('#nomproptrailer');
                        msg_error += '<p>Debe diligenciar <strong>Nombre Propietario Trailer</strong> para poder crear la solicitudocument.</p>';
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

                    if (document.getElementById('habil').checked) {
                      if (!$('#referencias_empresariales1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Referencias laboral 1</strong> para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#celular_ref1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Celular laboral 1</strong> para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#referencias_empresariales2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Referencias laboral 2</strong> para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#celular_ref2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Celular laboral 2</strong> para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#referencias_empresariales3').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Referencias laboral 3</strong> para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#celular_ref3').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Celular laboral 3</strong> para poder crear la solicitudocument.</p>';
                      }
                      //personales
                      if (!$('#referencias_personales1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Nombre persona 1</strong> para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#parenp1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Parentezco 1</strong> para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#telefonop1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Teléfono 1</strong> en ref. personal para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#referencias_personales2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Nombre persona 2</strong> en ref. personal para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#parenp2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Parentezco 2</strong> para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#telefonop2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Teléfono 2</strong> para poder crear la solicitudocument.</p>';
                      }
                    }
                  }
                  if (!msg_error && $('#estado_prefiltron').val() == '') {
                    if (document.getElementById('habil').checked) {
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
                      data.append('placa', document.getElementById('placag').value);
                      data.append('flete_subasta', fletef);
                      data.append('tarifa_subasta', tarifaf);
                      data.append('fecha', $('#fpree').val());
                      data.append('hora', $('#hpree').val());
                      data.append('usuario', $('#userpree').val());
                      data.append('papeles', 'sin_datos');
                      data.append('solicitud', document.getElementById('servicio_base').value);
                      // Solicitudes de servicio
                      var solicitudes = document.getElementsByName('fserva[]');
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

                      await fetch($('#base_url').val() + 'validacionparametros/Insert_estudio_itr_subasta', {
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
                            mensaje = `<div class="alert alert-outline-success d-flex align-items-center" role="alert">
                              <span class="fas fa-check-circle text-success fs-5 me-3"></span>
                              <p class="mb-0 flex-1"> ${data.mensaje}</p>
                              <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                    <strong>Mensaje!</strong> ${data.mensaje}
                                  </div>
                              </div>`;
                            $('#crear_preestudio').show();
                          }
                          document.getElementById('historicos').innerHTML = mensaje;
                        })
                        .catch(error => {
                          alert(error);
                          $('#crear_preestudio').show();
                        });
                    }
                  } else {
                    $('#nexos_messages_popup').html(`<div class="alert alert-outline-danger d-flex align-items-center" role="alert">
                    <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                    <p class="mb-0 flex-1">${msg_error}</br></p>
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`,
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
                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                        <strong>Mensaje!</strong> Debes diligenciar la placa para la solicitud de servicio
                      </div>
                  </div>`;
                document.getElementById('historicos').innerHTML = mensaje;
                // alert("debe diligenciar la placa para la solicitud");
                $('#crear_preestudio').show();
              }
            } else {
              // console.log('debe diligenciar la validacion de parametros');
              document.getElementById('mensaje_itr').innerHTML = `
              <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><span class="mdi mdi-alert-triangle"></span></div>
                <div class="message">
                  <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><strong>Advertencia!</strong> Debe verificar los datos para poder generar la orden de cargue nuevamente.
                </div>
              </div>`;
            }
          } else {
            if (datos_validado >= 4) {
              var radio = document.getElementById('habil');
              radio.checked = true; // Marcar como seleccionado
              if (document.getElementById('placa').value !== '') {
                if (window.confirm('¿Estas seguro de realizar la operación de solicitud de vehiculo?')) {
                  // Código a ejecutar si el usuario hace clic en "Aceptar"
                  var msg_error = '';
                  if ($('#papeles').is(':checked')) {
                    var p;
                    for (p = 1; p == b; p++) {
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
                    `<div class="alert alert-outline-danger d-flex align-items-center" role="alert">
                    <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                    <p class="mb-0 flex-1">${msg_error}</br></p>
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`
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
                    msg_error += '<p>Debe seleccionar un <strong>Responsable </strong> del vehículo para poder crear la solicitudocument.</p>';
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
                    if (document.getElementById('nuevo').checked) {
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
                    if (document.getElementById('propietario_obligatorio').checked) {
                      if (document.getElementById('placat').value === '') {
                        // console.log('campos obligatorios');
                        $('#placat + p').remove();
                        const ERROR = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                        $('#placat').after(ERROR);
                        AplicaFoco('#placat');
                        msg_error += '<p>Debe diligenciar <strong>placa</strong> del trailer para poder crear la solicitudocument.</p>';
                      } else {
                        $('#placat + p').remove();
                        RemueveFoco('#placat');
                      }

                      if (document.getElementById('docproptrailer').value === '') {
                        $('#docproptrailer + p').remove();
                        const ERROR2 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                        $('#docproptrailer').after(ERROR2);
                        AplicaFoco('#docproptrailer');
                        msg_error += '<p>Debe diligenciar <strong>Documento Propietario trailer</strong> para poder crear la solicitudocument.</p>';
                      } else {
                        $('#docproptrailer + p').remove();
                        RemueveFoco('#docproptrailer');
                      }

                      if (document.getElementById('nomproptrailer').value === '') {
                        $('#nomproptrailer + p').remove();
                        const ERROR3 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                        $('#nomproptrailer').after(ERROR3);
                        AplicaFoco('#nomproptrailer');
                        msg_error += '<p>Debe diligenciar <strong>Nombre Propietario Trailer</strong> para poder crear la solicitudocument.</p>';
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

                    if (document.getElementById('habil').checked) {
                      if (!$('#referencias_empresariales1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Referencias laboral 1</strong> para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#celular_ref1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Celular laboral 1</strong> para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#referencias_empresariales2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Referencias laboral 2</strong> para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#celular_ref2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Celular laboral 2</strong> para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#referencias_empresariales3').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Referencias laboral 3</strong> para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#celular_ref3').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Celular laboral 3</strong> para poder crear la solicitudocument.</p>';
                      }
                      //personales
                      if (!$('#referencias_personales1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Nombre persona 1</strong> para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#parenp1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Parentezco 1</strong> para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#telefonop1').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Teléfono 1</strong> en ref. personal para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#referencias_personales2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Nombre persona 2</strong> en ref. personal para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#parenp2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Parentezco 2</strong> para poder crear la solicitudocument.</p>';
                      }
                      if (!$('#telefonop2').val()) {
                        msg_error += '<p>Debe diligenciar <strong>Teléfono 2</strong> para poder crear la solicitudocument.</p>';
                      }
                    }
                  }
                  if (!msg_error && $('#estado_prefiltron').val() == '') {
                    if (document.getElementById('habil').checked) {
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
                      data.append('placa', document.getElementById('placag').value);
                      data.append('flete_subasta', fletef);
                      data.append('tarifa_subasta', tarifaf);
                      data.append('fecha', $('#fpree').val());
                      data.append('hora', $('#hpree').val());
                      data.append('usuario', $('#userpree').val());
                      data.append('papeles', 'sin_datos');
                      data.append('solicitud', document.getElementById('servicio_base').value);
                      // Solicitudes de servicio
                      var solicitudes = document.getElementsByName('fserva[]');
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

                      await fetch($('#base_url').val() + 'validacionparametros/Insert_estudio_itr_subasta', {
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
                            mensaje = `<div class="alert alert-outline-success d-flex align-items-center" role="alert">
                          <span class="fas fa-check-circle text-success fs-5 me-3"></span>
                          <p class="mb-0 flex-1"> ${data.mensaje}</p>
                          <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                    <strong>Mensaje!</strong> ${data.mensaje}
                                  </div>
                              </div>`;
                            $('#crear_preestudio').show();
                          }
                          document.getElementById('historicos').innerHTML = mensaje;
                        })
                        .catch(error => {
                          alert(error);
                          $('#crear_preestudio').show();
                        });
                    }
                  } else {
                    $('#nexos_messages_popup').html(`<div class="alert alert-outline-danger d-flex align-items-center" role="alert">
                    <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                    <p class="mb-0 flex-1">${msg_error}</br></p>
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`,
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
                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                        <strong>Mensaje!</strong> Debes diligenciar la placa para la solicitud de servicio
                      </div>
                  </div>`;
                document.getElementById('historicos').innerHTML = mensaje;
                // alert("debe diligenciar la placa para la solicitud");
                $('#crear_preestudio').show();
              }
            } else {
              // console.log('debe diligenciar la validacion de parametros');
              document.getElementById('mensaje_itr').innerHTML = `
              <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><span class="mdi mdi-alert-triangle"></span></div>
                <div class="message">
                  <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><strong>Advertencia!</strong> Debe verificar los datos para poder generar la orden de cargue nuevamente.
                </div>
              </div>`;
            }
          }
        }
      } else {
        if (document.getElementById('placa').value !== '') {
          // $("#crear_preestudio").hide();
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
              `<div class="alert alert-outline-danger d-flex align-items-center" role="alert">
                    <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                    <p class="mb-0 flex-1">${msg_error}</br></p>
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`
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
              msg_error += '<p>Debe seleccionar un <strong>Responsable </strong> del vehículo para poder crear la solicitudocument.</p>';
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
              if (document.getElementById('nuevo').checked) {
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
              if (document.getElementById('propietario_obligatorio').checked) {
                if (document.getElementById('placat').value === '') {
                  // console.log('campos obligatorios');
                  $('#placat + p').remove();
                  const ERROR = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                  $('#placat').after(ERROR);
                  AplicaFoco('#placat');
                  msg_error += '<p>Debe diligenciar <strong>placa</strong> del trailer para poder crear la solicitudocument.</p>';
                } else {
                  $('#placat + p').remove();
                  RemueveFoco('#placat');
                }

                if (document.getElementById('docproptrailer').value === '') {
                  $('#docproptrailer + p').remove();
                  const ERROR2 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                  $('#docproptrailer').after(ERROR2);
                  AplicaFoco('#docproptrailer');
                  msg_error += '<p>Debe diligenciar <strong>Documento Propietario trailer</strong> para poder crear la solicitudocument.</p>';
                } else {
                  $('#docproptrailer + p').remove();
                  RemueveFoco('#docproptrailer');
                }

                if (document.getElementById('nomproptrailer').value === '') {
                  $('#nomproptrailer + p').remove();
                  const ERROR3 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                  $('#nomproptrailer').after(ERROR3);
                  AplicaFoco('#nomproptrailer');
                  msg_error += '<p>Debe diligenciar <strong>Nombre Propietario Trailer</strong> para poder crear la solicitudocument.</p>';
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

              if (document.getElementById('habil').checked || document.getElementById('update').checked) {
                if (!$('#referencias_empresariales1').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Referencias laboral 1</strong> para poder crear la solicitudocument.</p>';
                }
                if (!$('#celular_ref1').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Celular laboral 1</strong> para poder crear la solicitudocument.</p>';
                }
                if (!$('#referencias_empresariales2').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Referencias laboral 2</strong> para poder crear la solicitudocument.</p>';
                }
                if (!$('#celular_ref2').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Celular laboral 2</strong> para poder crear la solicitudocument.</p>';
                }
                if (!$('#referencias_empresariales3').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Referencias laboral 3</strong> para poder crear la solicitudocument.</p>';
                }
                if (!$('#celular_ref3').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Celular laboral 3</strong> para poder crear la solicitudocument.</p>';
                }
                //personales
                if (!$('#referencias_personales1').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Nombre persona 1</strong> para poder crear la solicitudocument.</p>';
                }
                if (!$('#parenp1').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Parentezco 1</strong> para poder crear la solicitudocument.</p>';
                }
                if (!$('#telefonop1').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Teléfono 1</strong> en ref. personal para poder crear la solicitudocument.</p>';
                }
                if (!$('#referencias_personales2').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Nombre persona 2</strong> en ref. personal para poder crear la solicitudocument.</p>';
                }
                if (!$('#parenp2').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Parentezco 2</strong> para poder crear la solicitudocument.</p>';
                }
                if (!$('#telefonop2').val()) {
                  msg_error += '<p>Debe diligenciar <strong>Teléfono 2</strong> para poder crear la solicitudocument.</p>';
                }
                if (document.getElementById('update').checked) {
                  if (!document.getElementById('cbox1').checked && !document.getElementById('cbox2').checked) {
                    msg_error += '<p>Debe seleccionar <strong>una opción de recurso</strong> para poder crear la solicitud (Actualiza seguridad).</p>';
                  } else {
                    if (document.getElementById('cbox1').checked) {
                      //registrar campos nuevos
                      if (
                        !document.getElementById('cbpre1').checked &&
                        !document.getElementById('cbpre2').checked &&
                        !document.getElementById('cbpre3').checked &&
                        !document.getElementById('cbpre4').checked &&
                        !document.getElementById('cbpre5').checked
                      ) {
                        msg_error += '<p>Por favor seleccione el recurso a crear , opción seleccionada <strong>Recursos inexistentes</strong>.</p>';
                      } else {
                        if (document.getElementById('cbpre1').checked) {
                          //propietario
                          if (!$('#name_propietario').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Nombre Propietario</strong> para poder crear la solicitudocument.</p>';
                          }
                          if (!$('#number_propietario').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Documento Propietario</strong> para poder crear la solicitudocument.</p>';
                          }
                        }

                        if (document.getElementById('cbpre2').checked) {
                          //poseedor
                          if (!$('#name_poseedor').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Nombre Poseedor</strong> para poder crear la solicitudocument.</p>';
                          }
                          if (!$('#number_poseedor').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Documento Poseedor</strong> para poder crear la solicitudocument.</p>';
                          }
                        }

                        if (document.getElementById('cbpre3').checked) {
                          //conductor
                          if (!$('#name_conductor').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Nombre Conductor</strong> para poder crear la solicitudocument.</p>';
                          }
                          if (!$('#number_conductor').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Documento Conductor</strong> para poder crear la solicitudocument.</p>';
                          }
                          if (!$('#referencias_empresariales1pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Nombre referencia 1</strong> para poder crear la solicitudocument.</p>';
                          }
                          if (!$('#contacto_ref1pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Persona contacto 1</strong> para poder crear la solicitudocument.</p>';
                          }
                          if (!$('#celular_ref1pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Celular empresa 1</strong> para poder crear la solicitudocument.</p>';
                          }
                          if (!$('#referencias_empresariales2pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Nombre referencia 2</strong> para poder crear la solicitudocument.</p>';
                          }
                          if (!$('#contacto_ref2pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Persona contacto 2</strong> para poder crear la solicitudocument.</p>';
                          }
                          if (!$('#celular_ref2pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Celular empresa 2</strong> para poder crear la solicitudocument.</p>';
                          }
                          if (!$('#referencias_empresariales3pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Nombre referencia 3</strong> para poder crear la solicitudocument.</p>';
                          }
                          if (!$('#contacto_ref3pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Persona contacto 3</strong> para poder crear la solicitudocument.</p>';
                          }
                          if (!$('#celular_ref3pre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Celular empresa 3</strong> para poder crear la solicitudocument.</p>';
                          }
                        }

                        if (document.getElementById('cbpre4').checked) {
                          //trailer
                          if (!$('#placa_trailerpre').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Placa tráiler</strong> para poder crear la solicitudocument.</p>';
                          }
                          if (!$('#propi_trailer').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Nombre propietario tráiler</strong> para poder crear la solicitudocument.</p>';
                          }
                          if (!$('#propidocu_trailer').val()) {
                            msg_error += '<p>Debe diligenciar <strong>Documento propietario tráiler</strong> para poder crear la solicitudocument.</p>';
                          }
                        }

                        // if (document.getElementById("cbpre5").checked) {
                        //   //vehiculo
                        //   if (!$("#placa_vehiculosat").val()) {
                        //     msg_error += "<p>Debe diligenciar <strong>Placa vehículo</strong> para poder crear la solicitudocument.</p>";
                        //   }
                        //   if (!$("#url_sat").val()) {
                        //     msg_error += "<p>Debe diligenciar <strong>URL satélital</strong> para poder crear la solicitudocument.</p>";
                        //   }
                        //   if (!$("#user_sat").val()) {
                        //     msg_error += "<p>Debe diligenciar <strong>Usuario satélital</strong> para poder crear la solicitudocument.</p>";
                        //   }
                        //   if (!$("#pass_sat").val()) {
                        //     msg_error += "<p>Debe diligenciar <strong>Clave satélital</strong> para poder crear la solicitudocument.</p>";
                        //   }
                        // }
                      }
                    }
                    if (document.getElementById('cbox2').checked) {
                      //campos dinamicos
                      var idfila = $('#cuerpo_actu tr').length; //cantidad de filas de la tabla
                      if (idfila == 0) {
                        msg_error += '<p>Debe ingresar <strong>Mínimo 1 dato </strong> en bloque actualizar seguridad para poder crear la solicitudocument.</p>';
                      }
                    }
                  }
                }
              }
            }
            if (!msg_error && $('#estado_prefiltron').val() == '') {
              if (comprobar() === false) {
                if (document.getElementById('nuevo').checked) {
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
                  data.append('placa', document.getElementById('placag').value);
                  // Datos del propietario del vehiculo
                  data.append('trailer', document.getElementById('placat').value);
                  data.append('documento_propietario_trailer', document.getElementById('docproptrailer').value);
                  data.append('propietario_trailer', document.getElementById('nomproptrailer').value);
                  data.append('propietario', document.getElementById('nompro').value);
                  data.append('documento_pro', document.getElementById('docupro').value);
                  data.append('tenedor', document.getElementById('nomtene').value);
                  data.append('documento_tene', document.getElementById('docutene').value);
                  data.append('conductor', document.getElementById('nomcondu').value);
                  data.append('documento_condu', document.getElementById('docucondu').value);
                  data.append('web', document.getElementById('web').value);
                  data.append('user_satelite', document.getElementById('user_satelite').value);
                  data.append('clave', document.getElementById('clave').value);
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
                  /* Responsable vehiculo */
                  data.append('responsable_vehiculo', $('#responsable_vehiculo').val());

                  // Obtener los valores de los inputs de tipo array
                  var empresa = document.getElementsByName('empresa_crear[]');
                  for (var i = 0; i < empresa.length; i++) {
                    data.append('empresa_crear[]', empresa[i].value);
                  }
                  var ingreso = document.getElementsByName('fingreso_crear[]');
                  for (var i = 0; i < ingreso.length; i++) {
                    data.append('fingreso_crear[]', ingreso[i].value);
                  }
                  var retiro = document.getElementsByName('fretiro_crear[]');
                  for (var i = 0; i < retiro.length; i++) {
                    data.append('fretiro_crear[]', retiro[i].value);
                  }
                  var persona = document.getElementsByName('contacto_crear[]');
                  for (var i = 0; i < persona.length; i++) {
                    data.append('contacto_crear[]', persona[i].value);
                  }
                  var num = document.getElementsByName('numero_crear[]');
                  for (var i = 0; i < num.length; i++) {
                    data.append('numero_crear[]', num[i].value);
                  }
                  var cargo = document.getElementsByName('cargo_crear[]');
                  for (var i = 0; i < cargo.length; i++) {
                    data.append('cargo_crear[]', cargo[i].value);
                  }
                  var anti = document.getElementsByName('antiguedad_crear[]');
                  for (var i = 0; i < anti.length; i++) {
                    data.append('antiguedad_crear[]', anti[i].value);
                  }
                  // Solicitudes de servicio
                  var solicitudes = document.getElementsByName('fserva[]');
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
                    var tipohj = document.getElementsByName('tipohoja[]');
                    for (var i = 0; i < tipohj.length; i++) {
                      var tipo = tipohj[i].value;
                      datos.tipohoja[i] = tipo;
                    }
                    var clase = document.getElementsByName('clase[]');
                    for (var i = 0; i < clase.length; i++) {
                      var clas = clase[i].value;
                      datos.clase[i] = clas;
                    }

                    var ruta = document.getElementsByName('ruta[]');
                    for (var i = 0; i < ruta.length; i++) {
                      var rut = ruta[i].value;
                      datos.ruta[i] = rut;
                    }

                    var documento = document.getElementsByName('documento[]');
                    for (var i = 0; i < documento.length; i++) {
                      var doc = documento[i].value;
                      datos.documento[i] = doc;
                    }

                    var namearchivo = document.getElementsByName('namearchivo[]');
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
                  await fetch($('#base_url').val() + 'validacionparametros/Insertar_preestudio_nuevo', {
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

              if (document.getElementById('habil').checked || document.getElementById('update').checked) {
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
                data.append('placa', document.getElementById('placag').value);
                data.append('flete_subasta', fletef);
                data.append('tarifa_subasta', tarifaf);
                data.append('fecha', $('#fpree').val());
                data.append('hora', $('#hpree').val());
                data.append('usuario', $('#userpree').val());
                data.append('papeles', 'sin_datos');
                data.append('observacion', $('#obserpree').val());
                /* Responsable vehiculo */
                data.append('responsable_vehiculo', $('#responsable_vehiculo').val());
                // Solicitudes de servicio
                var solicitudes = document.getElementsByName('fserva[]');
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
                  if (document.getElementById('cbox2').checked) {
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
                  if (document.getElementById('cbox1').checked) {
                    data.append('nuevos_recursos', 'si');
                    if (document.getElementById('cbpre1').checked) {
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
                    if (document.getElementById('cbpre2').checked) {
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
                    if (document.getElementById('cbpre3').checked) {
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

                    if (document.getElementById('cbpre4').checked) {
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

                await fetch($('#base_url').val() + 'validacionparametros/Insert_estudio', {
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
                      mensaje = `<div class="alert alert-outline-success d-flex align-items-center" role="alert">
                          <span class="fas fa-check-circle text-success fs-5 me-3"></span>
                          <p class="mb-0 flex-1"> ${data.mensaje}</p>
                          <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                              <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                              <strong>Mensaje!</strong> ${data.mensaje}
                            </div>
                        </div>`;
                      $('#crear_preestudio').show();
                    }
                    document.getElementById('historicos').innerHTML = mensaje;
                  })
                  .catch(error => {
                    alert(error);
                    $('#crear_preestudio').show();
                  });
              }
            } else {
              $('#nexos_messages_popup').html(`<div class="alert alert-outline-danger d-flex align-items-center" role="alert">
                    <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                    <p class="mb-0 flex-1">${msg_error}</br></p>
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`);
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
                  <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                  <strong>Mensaje!</strong> Debes diligenciar la placa para la solicitud de servicio
                </div>
            </div>`;
          document.getElementById('historicos').innerHTML = mensaje;
          // alert("debe diligenciar la placa para la solicitud");
          $('#crear_preestudio').show();
        }
      }
    }

    //boton agregar referencias para nuevo

    if (e.target.matches('#agregar_fila') || e.target.matches('#agregar_fila *')) {
      // agregar();
      numero++;
      if (numero <= 3) {
        agregar();
      } else {
        alert('Señor usuario ha superado el máximo de referencias laborales!!');
      }
    }

    if (e.target.matches('#btn_cerrar') || e.target.matches('#btn_cerrar')) {
      $('#placa').prop('disabled', false);
    }

    if (e.target.matches('#btn_cerrar_notificaciones')) {
      $('#mod-warning').modal('hide');
      $('#crea_vehiculopreestudio').modal('toggle');
      document.getElementById('number_propietario').value = '';
      document.getElementById('number_poseedor').value = '';
      document.getElementById('number_conductor').value = '';
      document.getElementById('propidocu_trailer').value = '';
    }

    // Verificar si el evento fue en el checkbox o en un hijo del checkbox
    if (e.target.matches('#propietario_obligatorio') || e.target.matches('#propietario_obligatorio *')) {
      // Obtener el checkbox, en caso de que el evento venga de un hijo
      const checkbox = document.getElementById('propietario_obligatorio');
      // Verificar si está marcado
      if (checkbox.checked) {
        // console.log('El checkbox está marcado');
        // document.getElementById('placat').style.readonly = false;
        $('#placat').prop('disabled', false);
        $('#docproptrailer').prop('disabled', false);
        $('#nomproptrailer').prop('disabled', false);
        document.getElementById('mensaje_trailer_obligatorio').innerHTML = `
        <div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><span class="mdi mdi-notifications"></span></div>
          <div class="message">
            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><strong>Información!</strong> Los campos del trailer son obligatorios.
          </div>
        </div>
        `;
        document.getElementById('etiqueta_placa_trailer').innerHTML = `Placa Trailer&nbsp;<span style="color:red;"><i>(*)</i></span>`;
        document.getElementById('etiqueta_documento_trailer').innerHTML = `Documento Propietario Trailer&nbsp;<span style="color:red;"><i>(*)</i></span>`;
        document.getElementById('estiqueta_propietario_trailer').innerHTML = `Nombre Propietario Trailer&nbsp;<span style="color:red;"><i>(*)</i></span>`;
      } else {
        $('#placat').prop('disabled', true);
        $('#docproptrailer').prop('disabled', true);
        $('#nomproptrailer').prop('disabled', true);
        document.getElementById('mensaje_trailer_obligatorio').innerHTML = `
        <div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><span class="mdi mdi-notifications"></span></div>
          <div class="message">
            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><strong>Información!</strong> Los campos del trailer no requeridos.
          </div>
        </div>
        `;
        document.getElementById('etiqueta_placa_trailer').innerHTML = `Placa Trailer`;
        document.getElementById('etiqueta_documento_trailer').innerHTML = `Documento Propietario Trailer`;
        document.getElementById('estiqueta_propietario_trailer').innerHTML = `Nombre Propietario Trailer`;
      }
    }
  });

  // // Validar campos para el registro de vehiculos nuevos
  // web.addEventListener('blur', validar_formulario);
  // user_satelite.addEventListener('blur', validar_formulario);
  // clave.addEventListener('blur', validar_formulario);
  // // nompro.addEventListener('blur', validar_formulario);
  // docupro.addEventListener('blur', validar_formulario);
  // // nomtene.addEventListener('blur', validar_formulario);
  // docutene.addEventListener('blur', validar_formulario);
  // // nomcondu.addEventListener('blur', validar_formulario);
  // docucondu.addEventListener('blur', validar_formulario);

  // Selecciona los elementos por su ID y asigna el evento 'blur'
  $('#web, #user_satelite, #clave, #docupro, #docutene, #docucondu').on('blur', validar_formulario);

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
}

function preestudio(element) {
  $('#cuerpo_lista2').html('');
  $('#totalfle').val('');
  $('#tottarifa').val('');
  let offcanvas = new bootstrap.Offcanvas(document.getElementById('staticBackdrop'));
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
  listar_responsables();
  /* Validar si la solicitud de servicio esta vigente */
  let datos = new FormData();
  datos.append('solicitud_servicio_id', num);
  fetch($('#base_url').val() + 'validacionparametros/Validar_solicitud_vigencia', {
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
        if (cant - 15 > 0) {
          // $('#crea_vehiculopreestudio').modal('show');

          offcanvas.show();
          if (itr === 'Si') {
            // console.log('seRVICIO ITR');
            document.getElementById('mensaje_itr').innerHTML = `
            <div class="alert alert-contrast alert-warning alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-alert-triangle"></span></div>
              <div class="message">
                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><strong>Advertencia!</strong> Este Vehiculo sera clasificada como proceso ITR esta seguro.
              </div>
            </div>`;
            document.getElementById('proceso_itr').value = itr;
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
          $('#cuerpo_lista2').html(
            '<tr class="prin' +
            num +
            '"><td>1</td><td><input type="hidden" id="servicio1" value="' +
            num +
            '" class="fserva" name="fserva[]">' +
            num +
            '</td>' +
            '<td>' +
            cotiza +
            ' (' +
            item +
            ') ' +
            pareja +
            '</td>' +
            '<td>' +
            cliente +
            '</td>' +
            '<td><input type="text" id="fl' +
            num +
            '" class="form-control input-xs tflete" value="' +
            flete +
            '" readonly="readonly" onChange="javascript:currencyMask(this)"></td>' +
            '<td style="display:none"><input type="text" class="form-control input-xs tneto2" value="' +
            pesoneto +
            '" readonly="readonly"></td>' +
            '<td><input type="hidden" id="tari' +
            num +
            '" class="form-control input-xs ttarifa" value="' +
            tarifa +
            '" readonly="readonly"></td>' +
            '<td>' +
            tipo_servicio +
            '</td></tr>',
          );
          $('#totalizar').html(
            '<tr><td><input type="text" id="totalfle" class="form-control input-xs" value="' +
            flete +
            '" readonly="readonly"></td><td style="display:none;"><input type="text" id="totalneto" class="form-control input-xs" value="' +
            pesoneto +
            '" readonly="readonly"></td>' +
            '<td><input type="hidden" id="tottarifa" class="form-control input-xs" value="' +
            tarifa +
            '" readonly="readonly"></td>' +
            '</tr>',
          );
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
          fetch($('#base_url').val() + 'validacionparametros/Validar_solicitud_agrupacion', {
            method: 'POST',
            cache: 'no-cache',
            body: formdata,
          })
            .then(response => response.json())
            .then(function (data) {
              if (data !== false) {
                document.getElementById('id_consolidacion').value = data.agrupacion;
                consulta_solicitudes_anidadas(data.agrupacion, num);
                fechas_cargue(data.agrupacion, num);
              } else {
                document.getElementById('id_consolidacion').value = '';
                fechas_cargue(0, num);
              }
            })
            .catch(error => {
              alert(error);
            });
        } else {
          offcanvas.hide();
          Swal.fire({
            title: "Mensaje!",
            text: 'Por favor solicitar al area de servico al clientes, actualizacion de fecha de cargue',
            icon: "info",
            draggable: true,
            showConfirmButton: true,
            // timer: 1000,
            // customClass: {
            //   popup: 'custom-swal-popup', // Clase para el contenedor principal
            //   title: 'custom-swal-title', // Clase para el título
            //   htmlContainer: 'custom-swal-html-container', // Clase para el mensaje
            // },
          });
          // document.getElementById('mensaje_vigencia').innerHTML = 'Por favor solicitar al area de servico al clientes, actualizacion de fecha de cargue';
          // $('#md-footer-primary').modal('show');
          // $('#crea_vehiculopreestudio').modal('hide');
        }
      }
    })
    .catch(error => {
      alert("hola" + error);
    });
}

function consulta_solicitudes_anidadas(id_agrupacion, numservi) {
  let formdata = new FormData();
  formdata.append('id_agrupacion', id_agrupacion);
  formdata.append('num_servicio', numservi);
  fetch($('#base_url').val() + 'validacionparametros/Consulta_solicitudes_anidadas', {
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
  fetch($('#base_url').val() + 'validacionparametros/Consultar_fecha_cargue', {
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
  let texto = document.getElementById('placa').value;
  document.getElementById('placa').value = texto.toUpperCase();
});

/* FUNCIONPARA SUBIR AL SERVIDOR PRINCIPAL EL DIA DE HOY */
async function ValidacionReglaNegocio() {
  /* Nueva funcion para valdiar los tipos de documentos para definir la operacion a realziazr */
  $('#loading-overlay-nexosapp').css('display', 'flex');
  document.getElementById('historico').style.display = 'block';
  placa = $('#placa').val().trim();
  proceso_itr = $('#proceso_itr').val().trim();
  let datos = new FormData();
  datos.append('placa', placa);
  try {
    const response = await fetch($('#base_url').val() + 'validacionparametros/busqueda_datos_vencimiento', {
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

      // Construir el mensaje final para mostrar los documento vencidos
      let mensajeFinal;
      if (mensajes.length === 4) {
        mensaje = `
        <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
            <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
            <div class="message">
              <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
          $('#base_url').val() + 'validacionparametros/busqueda_vehiculo',
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
                      <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                          <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                          <div class="message">
                            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                            <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> esta Bloqueado.
                          </div>
                      </div>`;
                radionuevo_bloc();
                radiohv_bloc();
              } else if (data['estado_vigencia'] == 'seguimiento') {
                mensaje += `
                        <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                            <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                            <div class="message">
                              <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                    document.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    document.getElementById('accion_propietario').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Poseedor
                    document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    document.getElementById('accion_poseedor').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Conductor
                    document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    document.getElementById('accion_conductor').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      document.getElementById('ptcondu').innerHTML = 'No Aplica';
                      document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      document.getElementById('cpropt').innerHTML = 'No Aplica';
                      document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      document.getElementById('accion_propietario_trailer').innerHTML = `
                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                </div>
                              `;
                    }
                  } else {
                    mensaje += `
                            <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                              <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                              <div class="message">
                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                    document.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    document.getElementById('accion_propietario').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Poseedor
                    document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    document.getElementById('accion_poseedor').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Conductor
                    document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    document.getElementById('accion_conductor').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      document.getElementById('ptcondu').innerHTML = 'No Aplica';
                      document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      document.getElementById('cpropt').innerHTML = 'No Aplica';
                      document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      document.getElementById('accion_propietario_trailer').innerHTML = `
                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                </div>
                              `;
                    }
                  } else {
                    mensaje += `
                          <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                              <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                              <div class="message">
                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                document.getElementById('historico').style.display = 'none';
              }, 10000);
            }
          },
          'json',
        );
      } else if (mensajes.length === 3) {
        mensaje = `
          <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
            <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
            <div class="message">
              <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
          $('#base_url').val() + 'validacionparametros/busqueda_vehiculo',
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
                              <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                                  <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                                  <div class="message">
                                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                    <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> esta Bloqueado.
                                  </div>
                              </div>`;
                radionuevo_bloc();
                radiohv_bloc();
              } else if (data['estado_vigencia'] == 'seguimiento') {
                mensaje += `
                                <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                                    <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                                    <div class="message">
                                      <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                    document.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    document.getElementById('accion_propietario').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Poseedor
                    document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    document.getElementById('accion_poseedor').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Conductor
                    document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    document.getElementById('accion_conductor').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      document.getElementById('ptcondu').innerHTML = 'No Aplica';
                      document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      document.getElementById('cpropt').innerHTML = 'No Aplica';
                      document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      document.getElementById('accion_propietario_trailer').innerHTML = `
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
                                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                    document.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    document.getElementById('accion_propietario').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Poseedor
                    document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    document.getElementById('accion_poseedor').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Conductor
                    document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    document.getElementById('accion_conductor').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      document.getElementById('ptcondu').innerHTML = 'No Aplica';
                      document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      document.getElementById('cpropt').innerHTML = 'No Aplica';
                      document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      document.getElementById('accion_propietario_trailer').innerHTML = `
                                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                        </div>
                                      `;
                    }
                  } else {
                    mensaje += `
                                  <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                                        <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                                      <div class="message">
                                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                document.getElementById('historico').style.display = 'none';
              }, 10000);
            }
          },
          'json',
        );
      } else if (mensajes.length === 2) {
        mensaje = `
          <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
            <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
            <div class="message">
              <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
          $('#base_url').val() + 'validacionparametros/busqueda_vehiculo',
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
                              <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                                  <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                                  <div class="message">
                                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                    <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> esta Bloqueado.
                                  </div>
                              </div>`;
                radionuevo_bloc();
                radiohv_bloc();
              } else if (data['estado_vigencia'] == 'seguimiento') {
                mensaje += `
                                <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                                    <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                                    <div class="message">
                                      <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                    document.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    document.getElementById('accion_propietario').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Poseedor
                    document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    document.getElementById('accion_poseedor').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Conductor
                    document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    document.getElementById('accion_conductor').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      document.getElementById('ptcondu').innerHTML = 'No Aplica';
                      document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      document.getElementById('cpropt').innerHTML = 'No Aplica';
                      document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      document.getElementById('accion_propietario_trailer').innerHTML = `
                                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                        </div>
                                      `;
                    }
                  } else {
                    mensaje += `
                                  <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                                      <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                                      <div class="message">
                                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                    document.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    document.getElementById('accion_propietario').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Poseedor
                    document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    document.getElementById('accion_poseedor').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Conductor
                    document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    document.getElementById('accion_conductor').innerHTML = `
                                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                      </div>
                                    `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      document.getElementById('ptcondu').innerHTML = 'No Aplica';
                      document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      document.getElementById('cpropt').innerHTML = 'No Aplica';
                      document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      document.getElementById('accion_propietario_trailer').innerHTML = `
                                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                        </div>
                                      `;
                    }
                  } else {
                    mensaje += `
                                  <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                                      <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                                      <div class="message">
                                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                document.getElementById('historico').style.display = 'none';
              }, 10000);
            }
          },
          'json',
        );
      } else if (mensajes.length === 1) {
        mensaje = `
        <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
            <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
            <div class="message">
              <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
              <strong>Mensaje!</strong> ${mensajes[0]}.
            </div>
        </div>`;
        $('#historico_vencido').html(mensaje);
        /* Solo colocar la opcion de actualizar */
        Vencimientoprefiltro();
        Limpiarmodal();
        Ocultarbloque();
        $('#historico').html('');
        $.post($('#base_url').val() + 'validacionparametros/busqueda_vehiculo',
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
                      <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                          <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                          <div class="message">
                            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                            <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> esta Bloqueado.
                          </div>
                      </div>`;
                radionuevo_bloc();
                radiohv_bloc();
              } else if (data['estado_vigencia'] == 'seguimiento') {
                mensaje += `
                        <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                            <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                            <div class="message">
                              <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                    document.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    document.getElementById('accion_propietario').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Poseedor
                    document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    document.getElementById('accion_poseedor').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Conductor
                    document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    document.getElementById('accion_conductor').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      document.getElementById('ptcondu').innerHTML = 'No Aplica';
                      document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      document.getElementById('cpropt').innerHTML = 'No Aplica';
                      document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      document.getElementById('accion_propietario_trailer').innerHTML = `
                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                </div>
                              `;
                    }
                  } else {
                    mensaje += `
                          <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                              <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                              <div class="message">
                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                    document.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    document.getElementById('accion_propietario').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Poseedor
                    document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    document.getElementById('accion_poseedor').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Conductor
                    document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    document.getElementById('accion_conductor').innerHTML = `
                              <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                  <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                  <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                              </div>
                            `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      document.getElementById('ptcondu').innerHTML = 'No Aplica';
                      document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      document.getElementById('cpropt').innerHTML = 'No Aplica';
                      document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      document.getElementById('accion_propietario_trailer').innerHTML = `
                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                </div>
                              `;
                    }
                  } else {
                    mensaje += `
                          <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                              <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                              <div class="message">
                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                document.getElementById('historico').style.display = 'none';
              }, 10000);
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
          $('#base_url').val() + 'validacionparametros/busqueda_vehiculo',
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
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                    <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> esta Bloqueado.
                  </div>
              </div>`;
                radionuevo_bloc();
                radiohv_bloc();
              } else if (data['estado_vigencia'] == 'seguimiento') {
                mensaje += `
                <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                    <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                    <div class="message">
                      <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                    document.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    document.getElementById('accion_propietario').innerHTML = `
                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                      </div>
                    `;
                    // Poseedor
                    document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    document.getElementById('accion_poseedor').innerHTML = `
                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                      </div>
                    `;
                    // Conductor
                    document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    document.getElementById('accion_conductor').innerHTML = `
                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                      </div>
                    `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      document.getElementById('ptcondu').innerHTML = 'No Aplica';
                      document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      document.getElementById('cpropt').innerHTML = 'No Aplica';
                      document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      document.getElementById('accion_propietario_trailer').innerHTML = `
                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                        </div>
                      `;
                    }
                  } else {
                    mensaje += `
                  <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                      <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                      <div class="message">
                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                    document.getElementById('datos_proveedores').style.display = 'block';
                    // Propietario
                    document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                    document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                    document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                    document.getElementById('accion_propietario').innerHTML = `
                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                      </div>
                    `;
                    // Poseedor
                    document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                    document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                    document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                    document.getElementById('accion_poseedor').innerHTML = `
                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                      </div>
                    `;
                    // Conductor
                    document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                    document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                    document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                    document.getElementById('accion_conductor').innerHTML = `
                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                      </div>
                    `;
                    // Propietario trailer
                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                      document.getElementById('ptcondu').innerHTML = 'No Aplica';
                      document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                      document.getElementById('cpropt').innerHTML = 'No Aplica';
                      document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                    } else {
                      document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                      document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                      document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                      document.getElementById('accion_propietario_trailer').innerHTML = `
                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                        </div>
                      `;
                    }
                  } else {
                    mensaje += `
                      <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                          <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                          <div class="message">
                            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                document.getElementById('historico').style.display = 'none';
              }, 10000);
            }
            if (data['evaluacion'] === 'prefiltro') {
              var fhoy = moment();
              var tf = fhoy.diff(data['respuesta']['fecha'], 'days');
              if (data['respuesta']['estado'] == null || data['respuesta']['estado'] == 'rechazado' || data['respuesta']['estado'] == 'vencida' || data['respuesta']['estado'] == 'cancelado') {
                mensaje = `
                <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                    <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                    <div class="message">
                      <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                  <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                      <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                      <div class="message">
                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                  <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                      <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                      <div class="message">
                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                  <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                      <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                      <div class="message">
                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                document.getElementById('historico').style.display = 'none';
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
        $('#base_url').val() + 'validacionparametros/busqueda_vehiculo',
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
            <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                <div class="message">
                  <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                  <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> esta Bloqueado.
                </div>
            </div>`;
              radionuevo_bloc();
              radiohv_bloc();
            } else if (data['estado_vigencia'] == 'seguimiento') {
              mensaje += `
              <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                  <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                  <div class="message">
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                  document.getElementById('datos_proveedores').style.display = 'block';
                  // Propietario
                  document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                  document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                  document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                  document.getElementById('accion_propietario').innerHTML = `
                    <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                        <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                        <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                    </div>
                  `;
                  // Poseedor
                  document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                  document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                  document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                  document.getElementById('accion_poseedor').innerHTML = `
                    <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                        <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                        <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                    </div>
                  `;
                  // Conductor
                  document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                  document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                  document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                  document.getElementById('accion_conductor').innerHTML = `
                    <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                        <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                        <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                    </div>
                  `;
                  // Propietario trailer
                  if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                    document.getElementById('ptcondu').innerHTML = 'No Aplica';
                    document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                    document.getElementById('cpropt').innerHTML = 'No Aplica';
                    document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                  } else {
                    document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                    document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                    document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                    document.getElementById('accion_propietario_trailer').innerHTML = `
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
                      <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                  document.getElementById('datos_proveedores').style.display = 'block';
                  // Propietario
                  document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                  document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                  document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                  document.getElementById('accion_propietario').innerHTML = `
                    <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                        <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                        <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                    </div>
                  `;
                  // Poseedor
                  document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                  document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                  document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                  document.getElementById('accion_poseedor').innerHTML = `
                    <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                        <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                        <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                    </div>
                  `;
                  // Conductor
                  document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                  document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                  document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                  document.getElementById('accion_conductor').innerHTML = `
                    <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                        <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                        <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                    </div>
                  `;
                  // Propietario trailer
                  if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                    document.getElementById('ptcondu').innerHTML = 'No Aplica';
                    document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                    document.getElementById('cpropt').innerHTML = 'No Aplica';
                    document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                  } else {
                    document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                    document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                    document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                    document.getElementById('accion_propietario_trailer').innerHTML = `
                      <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                          <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                          <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                      </div>
                    `;
                  }
                } else {
                  mensaje += `
                <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                    <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                    <div class="message">
                      <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
              document.getElementById('historico').style.display = 'none';
            }, 10000);
          }
          if (data['evaluacion'] === 'prefiltro') {
            var fhoy = moment();
            var tf = fhoy.diff(data['respuesta']['fecha'], 'days');
            if (data['respuesta']['estado'] == null || data['respuesta']['estado'] == 'rechazado' || data['respuesta']['estado'] == 'vencida' || data['respuesta']['estado'] == 'cancelado') {
              mensaje = `
              <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                  <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                  <div class="message">
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                    <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                    <div class="message">
                      <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                    <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                    <div class="message">
                      <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
                <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                    <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                    <div class="message">
                      <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
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
              document.getElementById('historico').style.display = 'none';
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
    $('#base_url').val() + 'validacionparametros/vencimientoprefiltro',
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
  document.getElementById('datos_proveedores').style.display = 'none';
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
    $('#base_url').val() + 'validacionparametros/Consulta_Preestudio',
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
    $('#base_url').val() + 'validacionparametros/Consulta_Referencia',
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
    $('#base_url').val() + 'validacionparametros/Consulta_Rpersonal',
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
  if (document.getElementById('nuevo').checked) {
    if ($('#nuevo').is(':checked')) {
      contador_global1 = 0;
      var documento_conductor = $('#docucondu').val();
      $.post(
        $('#base_url').val() + 'validacionparametros/busqueda_referencias',
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
            numero = 0;
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
    const response = await fetch($('#base_url').val() + 'validacionparametros/listar_responsables_vehiculo', {
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
function sumatoria() { //Fletes y pesos netos
  var suma = 0; //acumulador
  var suman = 0;
  var sumapes = 0;
  var sumntarifa = 0;
  $(".tflete").each(function () {
    var valor = ($(this).val()).replace(/,/g, "");
    suma += parseFloat(valor);
  });
  var canserv = $("#cuerpo_lista2").find('tr').length;
  var div = parseFloat(suma) / parseFloat(canserv);
  // $("#totalfle").val(suma);
  $(".tneto2").each(function () {
    var peso = ($(this).val()).replace(/,/g, "");
    suman += parseFloat(peso);
  });
  //sumar pesos netos , vienen del remitente
  $(".fp").each(function () {
    var valpeso = ($(this).val()).replace(/,/g, "");
    sumapes += parseFloat(valpeso);
  });
  //sumas tarifas
  $(".ttarifa").each(function () {
    var valtarifa = ($(this).val()).replace(/,/g, "");
    sumntarifa += parseFloat(valtarifa);
  });
  //var totari=parseFloat(sumntarifa)/parseFloat(canserv);
  $('#totalfle').val(suma);
  $("#tottarifa").val(sumntarifa);
  $("#totalneto").val(suman);
  $("#su_fletecot").val(suma);
  $("#su_neto").val(suman);
  $("#total_pesos").val(sumapes);
  $("#su_sumatorianeto").val(sumapes);
  $("#su_tarifacot").val(sumntarifa);
  //formatear numeros
  $('#totalfle').val(parseFloat($('#totalfle').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
  $('#totalneto').val(parseFloat($('#totalneto').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    .toString());
  $('#su_fletecot').val(parseFloat($('#su_fletecot').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    .toString());
  $('#su_neto').val(parseFloat($('#su_neto').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
  $('#total_pesos').val(parseFloat($('#total_pesos').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    .toString());
  $('#su_sumatorianeto').val(parseFloat($('#su_sumatorianeto').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g,
    "$1,").toString());
  $("#tottarifa").val(parseFloat($('#tottarifa').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    .toString());
  $("#su_tarifacot").val(parseFloat($('#su_tarifacot').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    .toString());
}


function AplicaFoco(idelemento) {
  $(idelemento).focus().css("background-color", "rgb(254,242,181)");
}

function RemueveFoco(idelemento) {
  $(idelemento).blur().css("background-color", "white");
}