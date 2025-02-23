const d = document;
const w = window;
let valores = '';
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  const valores = window.location;
  const url = new URL(valores);

  const partesRuta = url.pathname.split('/');
  const nundoc = partesRuta[4];
  // actualizar_responsable();
  Numero_actividades(nundoc);

  /* Cargar tabla de las actividades segun el orden estipulado */
  listar_Activiades_Compartidas(nundoc)
    .then(resultado => {
      // console.log('Datos recibidos:', resultado);
      let tbody = d.getElementById('tbody_actividades_compartidas');
      tbody.innerHTML = '';
      resultado.forEach(element => {
        setTimeout(() => {
          const fila = d.createElement('tr');
          const columnaPosicion = d.createElement('td');
          columnaPosicion.textContent = element.posicion;

          const columnaParametro = d.createElement('td');
          columnaParametro.textContent = element.nombre_tipo;
          const columnaActividad = d.createElement('td');
          // columnaActividad.textContent = element.nombre_opcion;
          columnaActividad.innerHTML = `<span class="text-primary">${element.nombre_opcion}</span>`;
          const columnaResponsable = d.createElement('td');
          columnaResponsable.textContent = element.nom_usuario;
          const columnaVencimiento = d.createElement('td');
          columnaVencimiento.textContent = element.fecha_inicio + ' - ' + element.hora_inicio;
          const columnaEstdo = d.createElement('td');
          if (element.estado_actividad === 'SIN INICIAR') {
            columnaEstdo.innerHTML = `<span class="label label-warning">${element.estado_actividad}</span>`;
          } else if (element.estado_actividad === 'EN GESTION') {
            columnaEstdo.innerHTML = `<span class="label label-info">${element.estado_actividad}</span>`;
          } else if (element.estado_actividad === 'COMPLETADO') {
            columnaEstdo.innerHTML = `<span class="label label-success">${element.estado_actividad}</span>`;
          } else if (element.estado_actividad === 'CANCELADO') {
            columnaEstdo.innerHTML = `<span class="label label-danger">${element.estado_actividad}</span>`;
          } else if (element.estado_actividad === 'PAUSADO') {
            columnaEstdo.innerHTML = `<span class="label label-info">${element.estado_actividad}</span>`;
          }
          const columnaAcciones = d.createElement('td');
          // if (element.estado_actividad === 'SIN INICIAR' || element.estado_actividad === 'EN GESTION' || element.estado_actividad === 'PAUSADO') {
          //   columnaAcciones.innerHTML = `
          //   <div class="btn-group btn-group-xs" role="group" aria-label="...">
          //     <button type="button" class="btn btn-success" title="Gestionar actividad" id="btn_gestion_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}" ><i class="fas fa-tasks"></i></button>
          //     <button type="button" class="btn btn-primary " title="Detalle Gestión actividad" id="btn_detalle_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-eye"></i></button>
          //     <button type="button" class="btn btn-danger "><i class="far fa-file-pdf"></i></button>
          //   </div>`;
          // } else if (element.estado_actividad === 'COMPLETADO' || element.estado_actividad === 'CANCELADO') {
          //   columnaAcciones.innerHTML = `
          //   <div class="btn-group btn-group-xs" role="group" aria-label="...">
          //    <!-- <button type="button" class="btn btn-success" title="Gestionar actividad" id="btn_gestion_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}" ><i class="fas fa-tasks"></i></button>-->
          //     <button type="button" class="btn btn-primary " title="Detalle Gestión actividad" id="btn_detalle_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-eye"></i></button>
          //     <button type="button" class="btn btn-danger "><i class="far fa-file-pdf"></i></button>
          //   </div>`;
          // }

          if (element.estado_actividad === 'SIN INICIAR' || element.estado_actividad === 'EN GESTION' || element.estado_actividad === 'PAUSADO') {
            // Verificamos si la actividad actual tiene una actividad dependiente completada
            if (element.actividad_dependiente !== null) {
              // Buscamos la actividad dependiente y verificamos su estado
              const actividadDependiente = resultado.find(act => act.actividad_id === element.actividad_dependiente);

              if (actividadDependiente && actividadDependiente.estado_actividad === 'COMPLETADO') {
                // Si la actividad dependiente está completada, desbloqueamos la actividad actual
                if (d.getElementById('tipo_perfil').value == 1 || d.getElementById('tipo_perfil').value === 8) {
                  //Validar el tipo de perfil para mostrara la opcion de editar
                  columnaAcciones.innerHTML = `
                  <div class="btn-group btn-group-xs" role="group" aria-label="...">
                    <button type="button" class="btn btn-success" title="Gestionar actividad" id="btn_gestion_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-tasks"></i></button>
                    <button type="button" class="btn btn-primary" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-eye"></i></button>
                    <button type="button" class="btn btn-danger"><i class="far fa-file-pdf"></i></button>
                    <button type="button" class="btn btn-warning"  data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}" data-responsable="${element.responsable_actividad_id}" id="btn_editar_responsable" data-toggle="modal" data-target="#myModal" Onclick="actualizar_responsable(${element.actividad_id},${element.responsable_actividad_id});"><i class="fas fa-user-edit"></i></button>
                  </div>`;
                } else {
                  columnaAcciones.innerHTML = `
                  <div class="btn-group btn-group-xs" role="group" aria-label="...">
                    <button type="button" class="btn btn-success" title="Gestionar actividad" id="btn_gestion_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-tasks"></i></button>
                    <button type="button" class="btn btn-primary" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-eye"></i></button>
                    <button type="button" class="btn btn-danger"><i class="far fa-file-pdf"></i></button>
                  </div>`;
                }
              } else {
                if (d.getElementById('tipo_perfil').value == 1 || d.getElementById('tipo_perfil').value === 8) {
                  // Si no está completada, dejamos la actividad bloqueada
                  columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-xs" role="group" aria-label="...">
                  <button type="button" class="btn btn-success" title="Gestionar actividad" id="btn_gestion_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}" disabled><i class="fas fa-tasks"></i></button>
                  <button type="button" class="btn btn-primary" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-eye"></i></button>
                  <button type="button" class="btn btn-danger"><i class="far fa-file-pdf"></i></button>
                  <button type="button" class="btn btn-warning"  data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}" data-responsable="${element.responsable_actividad_id}" id="btn_editar_responsable" data-toggle="modal" data-target="#myModal" Onclick="actualizar_responsable(${element.actividad_id},${element.responsable_actividad_id});"><i class="fas fa-user-edit"></i></button>
                </div>`;
                } else {
                  // Si no está completada, dejamos la actividad bloqueada
                  columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-xs" role="group" aria-label="...">
                  <button type="button" class="btn btn-success" title="Gestionar actividad" id="btn_gestion_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}" disabled><i class="fas fa-tasks"></i></button>
                  <button type="button" class="btn btn-primary" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-eye"></i></button>
                  <button type="button" class="btn btn-danger"><i class="far fa-file-pdf"></i></button>
                </div>`;
                }
              }
            } else {
              // Si no tiene dependencia, se puede gestionar sin restricciones
              if (d.getElementById('tipo_perfil').value == 1 || d.getElementById('tipo_perfil').value === 8) {
                columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-xs" role="group" aria-label="...">
                  <button type="button" class="btn btn-success" title="Gestionar actividad" id="btn_gestion_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-tasks"></i></button>
                  <button type="button" class="btn btn-primary" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-eye"></i></button>
                  <button type="button" class="btn btn-danger"><i class="far fa-file-pdf"></i></button>
                  <button type="button" class="btn btn-warning"  data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}" data-responsable="${element.responsable_actividad_id}" id="btn_editar_responsable" data-toggle="modal" data-target="#myModal" Onclick="actualizar_responsable(${element.actividad_id},${element.responsable_actividad_id});"><i class="fas fa-user-edit"></i></button>
                </div>`;
              } else {
                columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-xs" role="group" aria-label="...">
                  <button type="button" class="btn btn-success" title="Gestionar actividad" id="btn_gestion_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-tasks"></i></button>
                  <button type="button" class="btn btn-primary" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-eye"></i></button>
                  <button type="button" class="btn btn-danger"><i class="far fa-file-pdf"></i></button>
                </div>`;
              }
            }
          } else if (element.estado_actividad === 'COMPLETADO' || element.estado_actividad === 'CANCELADO') {
            // Si la actividad ya está completada o cancelada
            columnaAcciones.innerHTML = `
            <div class="btn-group btn-group-xs" role="group" aria-label="...">
              <button type="button" class="btn btn-primary" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-eye"></i></button>
              <button type="button" class="btn btn-danger"><i class="far fa-file-pdf"></i></button>
            </div>`;
          }

          const fila2 = d.createElement('tr');
          fila2.style.display = 'none';
          fila2.setAttribute('id', `columnaproceso${element.actividad_id}`);

          const columnaFormulario = d.createElement('td');
          columnaFormulario.setAttribute('id', `celdaproceso${element.actividad_id}`);
          columnaFormulario.setAttribute('colspan', 7);
          // columnaFormulario.style.border = "none";
          columnaFormulario.innerHTML = `
          <div id="proceso_numero${element.num_proceso}" style="padding:1px 1px 1px;" data-idnum_proceso="${element.num_proceso}" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div id="mensaje${element.actividad_id}"></div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-right">
              <div class="form-group">
                <div class="checkbox">
                  <label style="font-weight: bold;font-size: 15px;">
                    <input type="checkbox" id="publicar${element.actividad_id}" name="publicar" style="transform: scale(1.5);margin-right: 5px;">
                    Publicar Gestion al Cliente
                  </label>
                </div>
              </div>
            </div>
            <input class="form-control input-xs" type="hidden" id="parametros_pedido${element.actividad_id}" name="parametros_pedido" value="${element.proceso_id}" data-id_parametros_pedido="${element.proceso_id}" readonly>
            <input class="form-control input-xs" type="hidden" id="parametros_punto_pedido_opcion${element.actividad_id}" name="parametros_punto_pedido_opcion" value="${element.actividad_id}" data-id_parametros_punto_pedido_opcion="${element.actividad_id}" readonly>

            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <div class="form-group">
              <label for="" style="font-weight: bold;">Documento</label>
              <input type="file" name="documento" id="documento${element.actividad_id}" class="form-control input-xs">
            </div>
          </div>

          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
          <div class="form-group">
            <label for="" style="font-weight: bold;">Seleccionar Estado</label>
            <select name="estado_actividad" id="estado_actividad${element.actividad_id}" class="form-control input-xs">
              <option value="">Selecciones</option>
              <option value="SIN INICIAR">SIN INICIAR</option>
              <option value="EN GESTION">EN GESTION</option>
              <option value="COMPLETADO">COMPLETADO</option>
              <option value="CANCELADO">CANCELADO</option>
              <option value="PAUSADO">PAUSADO</option>
            </select>
          </div>
        </div>

            <div class="col-xs-6 col-sm-6 col-md-12 col-lg-12">
              <div class="form-group">
                <label for="" style="font-weight: bold;">Observación</label>
                <textarea name="observacion_gestion" id="observacion_gestion${element.actividad_id}" cols="30" rows="5"
                  class="form-control input-xs"></textarea>
              </div>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-right">
              <div class="btn-group btn-group-xs" role="group" aria-label="...">
              <button type="button" class="btn btn-danger" style="margin-right:5px;" id="btn_cancelar_gestion${element.actividad_id}"><i class="fas fa-times"></i> Cancelar Gestión</button>
              <button type="button" class="btn btn-success" id="btn_guardar_gestion${element.actividad_id}"><i class="far fa-save"></i> Guardar Gestión</button>
              </div>
            </div>
          </div>
        `;
          const fila3 = d.createElement('tr');
          fila3.style.display = 'none';
          fila3.setAttribute('id', `columnadetalleactividad${element.actividad_id}`);
          const columnaGestionActvidad = d.createElement('td');
          columnaGestionActvidad.setAttribute('id', `columnadetalleactividad${element.actividad_id}`);
          columnaGestionActvidad.setAttribute('colspan', 7);
          columnaGestionActvidad.innerHTML = `
          <div id="detalle_actividad_numero${element.num_proceso}" style="padding:1px 1px 1px;" data-idnum_proceso="${element.num_proceso}" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div id="mensaje_publicado${element.actividad_id}"></div>
            <div class="bs-example" data-example-id="simple-table">
              <table class="table table-condensed table-hover">
                <thead style="background-color:#FFFFFF;color:#332D2D;text-align:center;">
                  <tr>
                    <th>#</th>
                    <!--<th>Actividad</th>-->
                    <th>Fecha</th>
                    <th>Observación</th>
                    <th>Responsable</th>
                    <th>publicado</th>
                    <th width="100px" >Evidencia</th>
                  </tr>
                </thead>
                <tbody id="tbl_detalle_gestion${element.actividad_id}"></tbody>
                <tfoot>
                <tr>
                  <td colspan="6" class="text-right"><button type="button" class="btn btn-danger btn-xs" style="margin-right:5px;" id="btn_cerrar_detalle${element.actividad_id}"><i class="fas fa-times"></i> Cerrar</button></td>
                </tr>
                </tfoot>
              </table>
            </div>
          </div>
          `;
          fila.appendChild(columnaPosicion);
          fila.appendChild(columnaParametro);
          fila.appendChild(columnaActividad);
          fila.appendChild(columnaResponsable);
          fila.appendChild(columnaVencimiento);
          fila.appendChild(columnaEstdo);
          fila.appendChild(columnaAcciones);

          fila2.appendChild(columnaFormulario);
          fila3.appendChild(columnaGestionActvidad);
          // tbody.appendChild(fila, fila2, fila3);
          tbody.appendChild(fila);
          tbody.appendChild(fila2);
          tbody.appendChild(fila3);
        }, 500);
      });
      // console.log(JSON.stringify(datos));
    })
    .catch(error => {
      console.error('Error:', error);
    });

  d.addEventListener('click', async e => {
    // Detalle de gestion vista
    if (e.target.matches('#btn_detalle_gestion') || e.target.matches('#btn_detalle_gestion *')) {
      d.getElementById('btn_cerrar_gestion').style.display = 'block';
      d.getElementById('btn_detalle_gestion').style.display = 'none';
      d.getElementById('btn_agregar_solicitud').style.display = 'none';
      d.getElementById('acordeones_parametros').style.display = 'none';
      d.getElementById('gestion_pedido').style.display = 'none';
      d.getElementById('tabla_gestion_actividades').style.display = 'none';
      d.getElementById('btn_editar_pedido').style.display = 'block';
      // d.getElementById("btn_inicio_gestion").style.display = "block";
      Detalles_gestion_vista(nundoc);
    }

    if (e.target.matches('#btn_cerrar_gestion') || e.target.matches('#btn_cerrar_gestion *')) {
      // alert("hola");
      d.getElementById('btn_cerrar_gestion').style.display = 'none';
      d.getElementById('btn_detalle_gestion').style.display = 'block';
      d.getElementById('btn_agregar_solicitud').style.display = 'block';
      d.getElementById('acordeones_parametros').style.display = 'block';
      d.getElementById('tabla_gestion_actividades').style.display = 'block';
      d.getElementById('btn_editar_pedido').style.display = 'block';
      // d.getElementById("btn_inicio_gestion").style.display = "block";
      var contenido = document.getElementById('detalle_gestion');
      contenido.innerHTML = ''; // Elimina el contenido
    }

    let Boton_cancelar;
    let Boton_guardar_gestion;
    // let Boton_detalle_actividad;
    if (e.target.matches('#btn_gestion_actividad') || e.target.matches('#btn_gestion_actividad *')) {
      var padre = e.target.parentElement.parentElement;
      var Procesos = padre.querySelector('#btn_gestion_actividad');
      var proceso_id = Procesos.getAttribute('data-idproceso');
      var actividad_id = Procesos.getAttribute('data-idactividad');
      // console.log("Proceso: " + proceso_id + " Actividad: " + actividad_id);
      var form_gestio = d.getElementById(`proceso_numero${actividad_id}`);
      var numero_proceso = form_gestio.getAttribute('data-idnum_proceso');
      // console.log("Numero de proceso del formulario: " + numero_proceso);
      Boton_cancelar = d.getElementById(`btn_cancelar_gestion${actividad_id}`);
      Boton_guardar_gestion = d.getElementById(`btn_guardar_gestion${actividad_id}`);
      // Boton_detalle_actividad = d.getElementById(`btn_guardar_gestion${actividad_id}`);

      /* Validar las actividades dependientes para la gestion de los despachos activos */
      // alert(proceso_id);
      // if (proceso_id === 3 || proceso_id === 4 || proceso_id === 9 || proceso_id === 10 || proceso_id === 11 || proceso_id === 12) {
      // }

      if (actividad_id === numero_proceso) {
        d.getElementById(`columnaproceso${numero_proceso}`).style.display = d.getElementById(`columnaproceso${numero_proceso}`).style.display === 'none' ? 'table-row' : 'none';
        Boton_cancelar.addEventListener('click', async e => {
          d.getElementById(`columnaproceso${numero_proceso}`).style.display = 'none';
        });
        Boton_guardar_gestion.addEventListener('click', async e => {
          if (d.getElementById('estado_actividad' + actividad_id).value === '') {
            mensaje = `
            <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> Debe seleccionar un estado para este pedido
                </div>
            </div>`;
            d.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
          } else if (d.getElementById('observacion_gestion' + actividad_id).value === '') {
            mensaje = `
            <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> Debe diligenciar una obsrvación  para poder gaurdar la gestión
                </div>
            </div>`;
            d.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
            d.getElementById('observacion_gestion' + actividad_id).focus();
          } else {
            if (w.confirm('¿Esta seguro de realizar la operación de gestion?')) {
              let data = new FormData();
              data.append('nundoc', nundoc);
              data.append('parametros_pedido', d.getElementById('parametros_pedido' + actividad_id).value);
              data.append('parametros_punto_pedido_opcion', d.getElementById('parametros_punto_pedido_opcion' + actividad_id).value);
              data.append('observacion', d.getElementById('observacion_gestion' + actividad_id).value);
              data.append('estado_actividad', d.getElementById('estado_actividad' + actividad_id).value);
              var documentos = d.getElementById('documento' + actividad_id).files[0];
              if (documentos !== undefined) {
                data.append('documento', documentos);
              } else {
                data.append('documento', 'Sin_evidencia');
              }
              // data.append("documento", d.getElementById("documento").files[0]);
              var publicar = d.getElementById('publicar' + actividad_id);
              if (publicar.checked) {
                data.append('publicar', 'SI');
              } else {
                data.append('publicar', 'NO');
              }
              await fetch($('#id_url_ajax').val() + 'pedidos/Insertar_gestion_pedido', {
                method: 'POST',
                body: data,
                cache: 'no-cache',
              })
                .then(res => (res.ok ? res.json() : Promise.reject(res)))
                .catch(error => {
                  alert(JSON.stringify(error.length) || 'Error al cargar las solicitudes');
                })
                .then(response => {
                  if (response.numero === 200) {
                    mensaje = `
                    <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
                        <div class="icon"><span class="mdi mdi-check"></span></div>
                        <div class="message">
                          <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                          <strong>Mensaje!</strong> ${response.mensaje}
                        </div>
                    </div>`;
                    Numero_actividades(nundoc);
                  } else {
                    mensaje = `
                    <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
                        <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                        <div class="message">
                          <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                          <strong>Mensaje!</strong> ${response.mensaje}
                        </div>
                    </div>`;
                  }
                  setTimeout(function() {
                    location.reload(false);
                    d.getElementById('mensaje' + actividad_id).innerHTML = mensaje;
                  }, 1000);
                  // d.getElementById("mensaje").innerHTML = mensaje;
                });
            }
          }
        });
      }
    }

    let Boton_cerrar_detalle;
    if (e.target.matches('#btn_detalle_actividad') || e.target.matches('#btn_detalle_actividad *')) {
      var padre = e.target.parentElement.parentElement;
      var Procesos = padre.querySelector('#btn_detalle_actividad');
      var proceso_id = Procesos.getAttribute('data-idproceso');
      var actividad_id = Procesos.getAttribute('data-idactividad');
      // console.log("Proceso: " + proceso_id + " Actividad: " + actividad_id);
      var form_gestio = d.getElementById(`detalle_actividad_numero${actividad_id}`);
      var numero_proceso = form_gestio.getAttribute('data-idnum_proceso');
      Boton_cerrar_detalle = d.getElementById(`btn_cerrar_detalle${actividad_id}`);
      if (actividad_id === numero_proceso) {
        d.getElementById(`columnadetalleactividad${numero_proceso}`).style.display = d.getElementById(`columnadetalleactividad${numero_proceso}`).style.display === 'none' ? 'table-row' : 'none';
        Detalles_actividaes(nundoc, actividad_id);
        Boton_cerrar_detalle.addEventListener('click', async e => {
          d.getElementById(`columnadetalleactividad${numero_proceso}`).style.display = 'none';
        });
      }
    }
    // Verificar si el clic ocurrió en el botón o dentro de un hijo del botón
    if (e.target.matches('#btn_guardar_actualizacion') || e.target.closest('#btn_guardar_actualizacion')) {
      const actividad_id = e.target.closest('#btn_guardar_actualizacion').getAttribute('data-id');
      // const responsable_actividad = e.target.closest('#btn_guardar_actualizacion').getAttribute('data-responsable');
      // Aquí puedes continuar con la lógica de actualización
      let formdata = new FormData();
      formdata.append('actividad_id', actividad_id);
      formdata.append('responsable_actividad', d.getElementById('responsable_actual').value);
      formdata.append('nuevo_responsable', d.getElementById('nuevo_responsable').value);

      try {
        const response = await fetch($('#id_url_ajax').val() + 'pedidos/actualizar_responsable', {
          method: 'POST',
          body: formdata,
          cache: 'no-cache',
        });

        const data = await response.json();
        if (data.status === 200) {
          alert(data.mensaje);
          w.location.reload(false);
        } else {
          alert('Error al actualizar responsable' + data.mensaje);
          // console.error('No se recibieron datos válidos');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      } finally {
        $('#loading-overlay-nexosapp ').css('display', 'none');
      }
    }
  });
});

function listar_Activiades_Compartidas(nundoc) {
  let data = new FormData();
  data.append('nundoc', nundoc);
  return new Promise((resolve, reject) => {
    fetch($('#id_url_ajax').val() + 'pedidos/Listar_actividades_gestion_compartidos', {
      method: 'POST',
      cache: 'no-cache',
      body: data,
    })
      .then(res => (res.ok ? res.json() : Promise.reject(res)))
      .catch(error => {
        alert(JSON.stringify(error.length) || 'Error al cargar tipo de detalle');
        reject(error);
      })
      .then(response => {
        resolve(response);
      });
  });
}

/**
 * SECCION INTERNA APRA VER LOS DETALLES DE LAS ACTIVIDADES
 * **/

async function Detalles_actividaes(nundoc, actividad_id) {
  let data = new FormData();
  data.append('nundoc', nundoc);
  data.append('actividad', actividad_id);
  await fetch($('#id_url_ajax').val() + 'pedidos/ver_detalle_actividad', {
    method: 'POST',
    body: data,
    cache: 'no-cache',
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res)))
    .catch(error => {
      alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
    })
    .then(response => {
      let tbody = d.getElementById('tbl_detalle_gestion' + actividad_id);
      tbody.innerHTML = '';
      if (response) {
        response.forEach(element => {
          setTimeout(() => {
            const fila = d.createElement('tr');
            fila.style.fontSize = '12px';
            const columnaNumero = d.createElement('td');
            columnaNumero.textContent = element.detalle_id;
            // const columnaParametro = d.createElement("td");
            // // columnaParametro.textContent = element.nombre_tipo;
            // columnaParametro.textContent = element.nombre_tipo;
            // const columnaConcepto = d.createElement("td");
            // columnaConcepto.innerHTML = `<span class="text-primary">${element.nombre_opcion}</span>`;
            const columnaFecha = d.createElement('td');
            columnaFecha.textContent = element.fecha;
            const columnaObservacion = d.createElement('td');
            columnaObservacion.textContent = element.observacion;
            const columnaResponsable = d.createElement('td');
            columnaResponsable.textContent = element.usuario;
            const columnaPublicado = d.createElement('td');
            if (element.se_publica === 'SI') {
              columnaPublicado.innerHTML = `
              <select style="background-color:#14A44D;color:#FFFFFF;border-radiud:15px;" onchange="Publicado(this,${actividad_id},${nundoc},${element.detalle_id})" class="select_publicados" id="select_publicado${actividad_id}" data-id="${element.detalle_id}">
                      <option value="${element.se_publica}">${element.se_publica}</option>
                      <option value="NO">NO</option>
              </select>`;
            } else {
              columnaPublicado.innerHTML = `
              <select style="background-color:#DC4C64;color:#FFFFFF;" onchange="Publicado(this,${actividad_id},${nundoc},${element.detalle_id})" class="select_publicados" id="select_publicado${actividad_id}" data-id="${element.detalle_id}">
                <option value="${element.se_publica}">${element.se_publica}</option>
                <option value="SI">SI</option>
              </select>`;
            }
            columnaPublicado.style.textAlign = 'center';
            const columnaEvidencia = d.createElement('td');
            if (element.nombre_archivo !== 'Sin_evidencia') {
              columnaEvidencia.innerHTML = `
            <div class="btn-group" role="group" aria-label="...">
              <button type="button" class="btn btn-primary btn-xs" onclick="abrir_fotos('${element.documento}' , '${element.nombre_archivo}')"><i class="fas fa-file-image"></i></button>
             <!--<button type="button" class="btn btn-warning btn-xs" onclick="abrir_fotos('${element.documento}' , '${element.nombre_archivo}')"><i class="far fa-edit"></i></button>-->
             </div>
            `;
            } else {
              columnaEvidencia.innerHTML = `<span class="text-primary">Sin evidencia</span>`;
            }

            fila.appendChild(columnaNumero);
            // fila.appendChild(columnaParametro);
            // fila.appendChild(columnaConcepto);
            fila.appendChild(columnaFecha);
            fila.appendChild(columnaObservacion);
            fila.appendChild(columnaResponsable);
            fila.appendChild(columnaPublicado);
            fila.appendChild(columnaEvidencia);
            tbody.appendChild(fila);
          }, 500);
        });
      } else {
        const columnaSindatos = d.createElement('td');
        columnaSindatos.innerHTML = `Parametro sin Gestión`;
        fila.appendChild(columnaSindatos);
        tbody.appendChild(fila);
      }
    });
}

async function Numero_actividades(nundoc) {
  let data = new FormData();
  data.append('nundoc', nundoc);
  await fetch($('#id_url_ajax').val() + 'pedidos/Progreso_pedido', {
    method: 'POST',
    body: data,
    cache: 'no-cache',
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res)))
    .catch(error => {
      alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
    })
    .then(response => {
      var objeto = response.cantidad_actividades;
      var cantidadActividades = objeto.Cantidad_actividades;
      var totalActividades = parseInt(cantidadActividades);
      var porcentajePorActividad = 100 / totalActividades;
      var progresoActual = 0;
      response.estado_actividades.forEach(element => {
        // console.log(element);
        if (element.estado_actividad === 'COMPLETADO') {
          progresoActual++;
          // totalActividadesCompletas;
        }
      });
      // Calcular el ancho de la barra de progreso
      // var ancho = (progresoActual / totalActividades) * 100;
      var ancho = 100 * progresoActual / totalActividades;
      // console.log(ancho);
      // Actualizar la barra de progreso
      $('.progress-bar').css('width', ancho + '%');
      // $(".progress-bar").html(ancho.toFixed(2) + "%"); // Redondear el porcentaje a dos decimales
      ancho = Math.round(ancho * 100) / 100; // Redondear a dos decimales
      $('.progress-bar').html(ancho + '%'); // Redondear el porcentaje a dos decimales
    });
}

function abrir_fotos(url, name) {
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
}

// async function actualizar_responsable(actividad_id, responsable_actividad_id) {
//   try {
//     const response = await fetch($('#id_url_ajax').val() + 'pedidos/listar_usuarios_responsables', {
//       method: 'POST',
//       cache: 'no-cache',
//     });

//     if (!response.ok) {
//       throw new Error('Error al cargar los Responsables');
//     }

//     const data = await response.json();

//     // Limpiar ambos select antes de agregar opciones
//     let RESPONSABLE_ACTUAL = document.getElementById('responsable_actual');
//     let NUEVO_RESPONSABLE = document.getElementById('nuevo_responsable');
//     RESPONSABLE_ACTUAL.innerHTML = ''; // Limpiar opciones anteriores
//     NUEVO_RESPONSABLE.innerHTML = ''; // Limpiar opciones anteriores

//     data.forEach(value => {
//       let {id, nom_usuario, user_log} = value;

//       // Crear la opción para 'responsable_actual'
//       let optActual = document.createElement('option');
//       optActual.value = id;
//       optActual.textContent = user_log + ' - ' + nom_usuario;
//       RESPONSABLE_ACTUAL.appendChild(optActual);

//       // Crear la opción para 'nuevo_responsable'
//       let optNuevo = document.createElement('option');
//       optNuevo.value = id;
//       optNuevo.textContent = user_log + ' - ' + nom_usuario;
//       NUEVO_RESPONSABLE.appendChild(optNuevo);
//     });
//   } catch (error) {
//     alert(error.message || 'Error al cargar los Responsables');
//   }
// }

async function actualizar_responsable(actividad_id, responsable_actividad_id) {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'pedidos/listar_usuarios_responsables', {
      method: 'POST',
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error('Error al cargar los Responsables');
    }

    const data = await response.json();

    // Limpiar ambos select antes de agregar opciones
    let RESPONSABLE_ACTUAL = d.getElementById('responsable_actual');
    let NUEVO_RESPONSABLE = d.getElementById('nuevo_responsable');
    RESPONSABLE_ACTUAL.innerHTML = ''; // Limpiar opciones anteriores
    NUEVO_RESPONSABLE.innerHTML = ''; // Limpiar opciones anteriores

    data.forEach(value => {
      let {id, nom_usuario, user_log} = value;

      // Crear la opción para 'responsable_actual'
      let optActual = d.createElement('option');
      optActual.value = id;
      // optActual.textContent = user_log + ' - ' + nom_usuario;
      optActual.textContent = nom_usuario;
      RESPONSABLE_ACTUAL.appendChild(optActual);

      // Crear la opción para 'nuevo_responsable'
      let optNuevo = d.createElement('option');
      optNuevo.value = id;
      // optNuevo.textContent = user_log + ' - ' + nom_usuario;
      optNuevo.textContent = nom_usuario;
      NUEVO_RESPONSABLE.appendChild(optNuevo);
    });

    // Asignar el data-id al botón de guardar
    d.getElementById('btn_guardar_actualizacion').setAttribute('data-id', actividad_id);
    d.getElementById('btn_guardar_actualizacion').setAttribute('data-responsable', responsable_actividad_id);
  } catch (error) {
    alert(error.message || 'Error al cargar los Responsables');
  }
}
