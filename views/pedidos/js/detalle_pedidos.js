const d = document;
const w = window;
let dato = '';
let datos_detalle = '';
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  // const valores = window.location.search;
  const valores = window.location;
  const url = new URL(valores);

  const partesRuta = url.pathname.split('/');
  const nundoc = partesRuta[4];

  Listar_tipos_trazabilidad();
  Listar_detalle_tipo_trazabilidad(dato);

  let datos = {
    tipo: [],
  };

  datos_detalle = {
    detalle: [],
  };

  Numero_actividades(nundoc);

  /* Cargar tabla de las actividades segun el orden estipulado */
  listar_Activiades(nundoc)
    .then(resultado => {
      console.log('Datos recibidos:', resultado);
      let tbody = d.getElementById('tbody_actividades');
      let usuario = d.getElementById('id_usuario').value;
      tbody.innerHTML = '';
      resultado.forEach(element => {
        setTimeout(() => {
          const fila = d.createElement('tr');
          const columnaPosicion = d.createElement('td');
          columnaPosicion.textContent = element.posicion;
          const columnaParametro = d.createElement('td');
          columnaParametro.textContent = element.nombre_tipo;

          const columnaCostoActividad = d.createElement('td');
          if (element.costo_actividad === null) {
            columnaCostoActividad.innerHTML = `<input type="number" class="costo_actividad text-center" id="costo_actividad${element.actividad_id}">`;
          } else {
            columnaCostoActividad.innerHTML = `<input type="number" class="costo_actividad text-center" id="costo_actividad${element.actividad_id}" value="${element.costo_actividad}">`;
          }
          columnaCostoActividad.style.textAlign = 'center';

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
          /* Eejcuatr consualtr de dependcias */
          const columnaAcciones = d.createElement('td');

          if (element.estado_actividad === 'SIN INICIAR' || element.estado_actividad === 'EN GESTION' || element.estado_actividad === 'PAUSADO') {
            // Verificamos si la actividad actual tiene una actividad dependiente completada
            if (element.actividad_dependiente !== null) {
              // Buscamos la actividad dependiente y verificamos su estado
              const actividadDependiente = resultado.find(act => act.actividad_id === element.actividad_dependiente);

              if (actividadDependiente && actividadDependiente.estado_actividad === 'COMPLETADO') {
                // Si la actividad dependiente está completada, desbloqueamos la actividad actual
                if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
                  columnaAcciones.innerHTML = `
                  <div class="btn-group btn-group-xs" role="group" aria-label="...">
                    <button type="button" class="btn btn-primary" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-eye"></i></button>
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
                // Si no está completada, dejamos la actividad bloqueada
                if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
                  columnaAcciones.innerHTML = `
                  <div class="btn-group btn-group-xs" role="group" aria-label="...">
                    <button type="button" class="btn btn-primary" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-eye"></i></button>
                  </div>`;
                } else {
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
              if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
                columnaAcciones.innerHTML = `
                <div class="btn-group btn-group-xs" role="group" aria-label="...">
                  <button type="button" class="btn btn-primary" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-eye"></i></button>
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
            if (usuario === "404" || usuario === "403" || usuario === "400" || usuario === "401" || usuario === "402") {
              columnaAcciones.innerHTML = `
              <div class="btn-group btn-group-xs" role="group" aria-label="...">
                <button type="button" class="btn btn-primary" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-eye"></i></button>
              </div>`;
            } else {
              columnaAcciones.innerHTML = `
              <div class="btn-group btn-group-xs" role="group" aria-label="...">
                <button type="button" class="btn btn-primary" title="Detalle Gestión actividad" id="btn_detalle_actividad" data-idproceso="${element.proceso_id}" data-idactividad="${element.actividad_id}"><i class="fas fa-eye"></i></button>
                <button type="button" class="btn btn-danger"><i class="far fa-file-pdf"></i></button>
              </div>`;
            }
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
          fila.appendChild(columnaCostoActividad);
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

          // Selecciona el input por su id
          document.getElementById(`costo_actividad${element.actividad_id}`).addEventListener('keydown', async function (event) {
            // Verifica si la tecla presionada es Enter
            if (event.key === 'Enter') {
              // Evita la acción predeterminada del Enter (como el envío de formulario)
              event.preventDefault();

              Swal.fire({
                title: 'Actualizar Costo',
                text: '¿Está seguro de continuar?',
                icon: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#9FA6B2',
                confirmButtonColor: '#14A44D',
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
                customClass: {
                  popup: 'swal2-custom-font',
                },
              }).then(async result => {
                if (result.isConfirmed) {
                  // Toma el valor del input
                  let valorInput = this.value;
                  let formdata = new FormData();
                  formdata.append('actvidad_id', element.actividad_id);
                  formdata.append('valor', valorInput);
                  formdata.append('nundoc', nundoc);
                  try {
                    const response = await fetch($('#id_url_ajax').val() + 'pedidos/actualizar_costo', {
                      method: 'POST',
                      body: formdata,
                      cache: 'no-cache',
                    });

                    const data = await response.json();
                    if (data.status === 200) {
                      Swal.fire({
                        title: 'Exito!',
                        // text: 'No hay información para generar la trazabilidad.',
                        html: data.mensaje,
                        icon: 'success',
                        customClass: {
                          popup: 'swal2-custom-font',
                        },
                      });
                      // location.reload(false);
                      setInterval(() => {
                        location.reload(false);
                      }, 500);
                    } else {
                      Swal.fire({
                        title: 'Error!',
                        // text: 'No hay información para generar la trazabilidad.',
                        html: data.mensaje,
                        icon: 'error',
                        customClass: {
                          popup: 'swal2-custom-font',
                        },
                      });
                    }
                  } catch (error) {
                    console.error('Error en la primera solicitud:', error);
                    throw error;
                  } finally {
                    // $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
                  }
                }
              });
            }
          });
        }, 500);
      });
      // console.log(JSON.stringify(datos));
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // Uso de la promesa
  DetallePedido(nundoc)
    .then(resultado => {
      console.log('Datos recibidos:', resultado);
      let checkboxes = d.getElementsByName('chk_trazabilidad[]');
      // let checkboxes1 = d.getElementsByName("chk_detalle[]");
      resultado.forEach(element => {
        d.getElementById('clientes').innerHTML = element.nombre;
        d.getElementById('cliente_id').value = element.cliente;
        d.getElementById('referencia').innerHTML = element.referencia;
        d.getElementById('observacion').innerHTML = element.observacion;
        d.getElementById('acciones').innerHTML = `
        <div class="btn-group" role="group" aria-label="...">
          <button type="button" class="btn btn-success btn-xs" id="btn_agregar_solicitud" data-toggle="modal" data-target="#myModal" onclick="Listar_solicitudes_cliente();"><i class="far fa-plus-square"></i> Agregar Solicitud</button>
          <button type="button" class="btn btn-primary btn-xs" id="btn_detalle_gestion"><i class="far fa-eye"></i> Ver detalle</button>
          <button type="button" class="btn btn-danger btn-xs" id="btn_cerrar_gestion" style="display:none;"><i class="fas fa-times"></i> Cerrar detalle</button>
        </div>
        `;
        // d.getElementById("observacion").disabled = true;
        datos.tipo.push(element.tipo_procesos_id);
        setTimeout(() => {
          d.getElementById('cargando_gif').style.display = 'none';
          // d.getElementById("accordion").style.display = "block";
          // Recorre los checkboxes y marca aquellos cuyo valor coincida
          checkboxes.forEach(function (checkbox) {
            if (checkbox.value === element.tipo_procesos_id) {
              checkbox.checked = true;
              checkbox.disabled = true;
              dato = checkbox.value;
              if (checkbox.checked) {
                Listar_detalle_tipo_trazabilidad(dato);
              }
            } else {
              checkbox.disabled = true;
            }
          });
        }, 500);
      });
      // console.log(JSON.stringify(datos));
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // Consultar detalle de porcesos de trazabilidad
  Listado_detalle_parametros(nundoc)
    .then(resultado => {
      console.log('Datos recibidos detalles:', resultado);
      let checkboxes1 = d.getElementsByName('chk_detalle[]');
      resultado.forEach(element => {
        datos_detalle.detalle.push(element.detalle_proceso);
        setTimeout(() => {
          checkboxes1.forEach(function (checkbox1) {
            if (checkbox1.value === element.detalle_proceso) {
              checkbox1.checked = true;
              checkbox1.disabled = true;
            } else {
              checkbox1.disabled = true;
            }
          });
        }, 3500);
      });
      // console.log(JSON.stringify(datos_detalle));
    })
    .catch(error => {
      console.error('Error:', error);
    });

  d.addEventListener('click', async e => {
    if (e.target.matches('#btn_editar_pedido') || e.target.matches('#btn_editar_pedido *')) {
      if (w.confirm('¿Esta seguro de editar el pedido? ' + nundoc)) {
        d.getElementById('btn_cancelar_edicion').style.display = 'block';
        d.getElementById('btn_guardar_pedido').style.display = 'block';
        d.getElementById('btn_editar_pedido').style.display = 'none';
        // Listar de prametros (acordeon)
        let checkboxes = d.getElementsByName('chk_trazabilidad[]');
        checkboxes.forEach(function (checkbox) {
          let btnEditarDetalles = d.getElementById('btn_editar_detalles' + checkbox.value);
          var miElemento2 = d.getElementById('list_detalle' + checkbox.value);
          var miElemento3 = d.querySelector('.chk_detalle' + checkbox.value);
          if (checkbox.checked) {
            checkbox.disabled = false;
            // Mostrar el botón en cada acordeón
            if (btnEditarDetalles) {
              btnEditarDetalles.style.display = 'block';
              btnEditarDetalles.addEventListener('click', async e => {
                let padre = e.target.parentElement.parentElement;
                // Obtener el elemento
                var miElemento = padre.querySelector('#btn_editar_detalles' + checkbox.value);
                // Obtener el valor de data-id usando getAttribute
                var valorDataId = miElemento.getAttribute('data-id');
                // Lita detalle
                var valorDataId2 = miElemento2.getAttribute('data-id2');
                if (valorDataId === valorDataId2) {
                  // Lita detalle
                  let checkboxesDetalle = d.querySelectorAll('.chk_detalle' + checkbox.value);
                  var valorDataId3 = miElemento3.getAttribute('data-id3');
                  // console.log(valorDataId3);
                  checkboxesDetalle.forEach(function (checkboxdetalle) {
                    if (valorDataId3 === checkbox.value) {
                      if (checkboxdetalle.checked) {
                        checkboxdetalle.disabled = false;
                        btnEditarDetalles.style.display = 'none';
                      } else {
                        checkboxdetalle.disabled = false;
                      }
                    }
                  });
                }
              });
            }
          } else {
            checkbox.disabled = false;
          }
        });
      }
    }

    if (e.target.matches('#btn_cancelar_edicion') || e.target.matches('#btn_cancelar_edicion *')) {
      if (w.confirm('¿Esta seguro de cancelar la edcion del pedido? ' + nundoc)) {
        d.getElementById('btn_cancelar_edicion').style.display = 'none';
        d.getElementById('btn_guardar_pedido').style.display = 'none';
        d.getElementById('btn_editar_pedido').style.display = 'block';
        // Listar de prametros (acordeon)
        let checkboxes = d.getElementsByName('chk_trazabilidad[]');
        checkboxes.forEach(function (checkbox) {
          let btnEditarDetalles = d.getElementById('btn_editar_detalles' + checkbox.value);
          if (checkbox.checked) {
            // Mostrar el botón en cada acordeón
            if (btnEditarDetalles) {
              btnEditarDetalles.style.display = 'none';
            }
            checkbox.disabled = true;
          } else {
            checkbox.disabled = true;
          }
        });
        // Lista detalles(tipo desatlle)
        let checkboxes1 = d.getElementsByName('chk_detalle[]');
        checkboxes1.forEach(function (checkbox1) {
          if (checkbox1.checked) {
            // checkbox1.checked = true;
            checkbox1.disabled = true;
          } else {
            checkbox1.disabled = true;
          }
        });
      }
    }

    if (e.target.matches('#btn_guardar_pedido') || e.target.matches('#btn_guardar_pedido *')) {
      if (w.confirm('¿Deseas guardar los cambios al pedido? ' + nundoc)) {
        var nota = datos;
        nota = JSON.stringify(nota);
        // console.log("Datos detalle 1 " + nota);

        var nota_detalle = datos_detalle;
        nota_detalle = JSON.stringify(nota_detalle);
        // console.log("Datos detalle 2 " + nota_detalle);
        // console.log("Numdoc " + nundoc);

        let data = new FormData();
        data.append('nundoc', nundoc);
        data.append('nota', nota);
        data.append('nota_detalle', nota_detalle);

        await fetch($('#id_url_ajax').val() + 'pedidos/Actualizar_trazabilidad_pedido', {
          method: 'POST',
          body: data,
          cache: 'no-cache',
        })
          .then(res => (res.ok ? res.json() : Promise.reject(res)))
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
              $('#crear_trazabilidad').modal('hide');
              setTimeout(function () {
                location.reload(false);
                d.getElementById('mensaje').innerHTML = mensaje;
              }, 1500);
            } else {
              mensaje = `
              <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
                  <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                  <div class="message">
                    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                    <strong>Mensaje!</strong> ${response.mensaje}
                  </div>
              </div>`;
              d.getElementById('mensaje').innerHTML = mensaje;
            }
            // location.reload();
            // setTimeout(function () {
            //   location.reload(false);
            // }, 1500);
          })
          .catch(error => {
            alert(JSON.stringify(error.length) || 'Error al insertar la trazabilidad');
          });
      }
    }

    if (e.target.matches('#btn_guardar_asosiacion') || e.target.matches('#btn_guardar_asosiacion *')) {
      if (w.confirm('¿Deseas guardar la asociacion? ' + nundoc)) {
        let data = new FormData();
        data.append('pedido', nundoc);
        data.append('solicitud', d.getElementById('solicitudes_cliente').value);
        await fetch($('#id_url_ajax').val() + 'pedidos/Insertar_solicitud_pedido', {
          method: 'POST',
          body: data,
          cache: 'no-cache',
        })
          .then(res => (res.ok ? res.json() : Promise.reject(res)))
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
              $('#myModal').modal('hide');
              // setTimeout(function () {
              //   location.reload(false);
              //   d.getElementById("mensaje").innerHTML = mensaje;
              // }, 1500);
            } else {
              mensaje = `
              <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
                  <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                  <div class="message">
                    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                    <strong>Mensaje!</strong> ${response.mensaje}
                  </div>
              </div>`;
              $('#myModal').modal('hide');
            }
            d.getElementById('mensaje').innerHTML = mensaje;
          })
          .catch(error => {
            alert(JSON.stringify(error.length) || 'Error al insertar la trazabilidad');
          });
      }
    }

    if (e.target.matches('#btn_inicio_gestion') || e.target.matches('#btn_inicio_gestion *')) {
      d.getElementById('gestion_pedido').style.display = 'block';
      d.getElementById('acordeones_parametros').style.display = 'none';
      d.getElementById('btn_editar_pedido').style.display = 'none';
      d.getElementById('btn_agregar_solicitud').style.display = 'none';
      // d.getElementById("btn_cancelar_gestion").style.display = "block";
      d.getElementById('btn_inicio_gestion').style.display = 'none';
      // d.getElementById("detalle_gestion").style.display = "block";
      d.getElementById('btn_cerrar_gestion').style.display = 'none';
      d.getElementById('btn_detalle_gestion').style.display = 'block';

      await fetch($('#id_url_ajax').val() + 'views/pedidos/template/gestion.phtml')
        .then(response => response.text()) // convierte la respuesta a texto
        .then(html => {
          d.getElementById('gestion_pedido').innerHTML = html;
          Listar_parametros_gestion(nundoc);
        })
        .catch(error => console.error('Error al cargar el archivo HTML:', error));
    }

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
                  setTimeout(function () {
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
  });

  d.addEventListener('change', async e => {
    var valor = '';
    if (e.target.matches('.chk_trazabilidad') || e.target.matches('.chk_trazabilidad *')) {
      let padre = e.target.parentElement.parentElement;
      let chktrazabilidad = padre.querySelectorAll('.chk_trazabilidad');
      for (var i = 0; i < chktrazabilidad.length; i++) {
        var checkbox = chktrazabilidad[i];
        valor = checkbox.value;
        // Comprueba si el checkbox está marcado y el valor está en el array 'datos.tipo'
        if (checkbox.checked && datos.tipo.includes(valor)) {
          console.log('El valor del checkbox está en datos.tipo:', valor);
          console.log(JSON.stringify(datos));
        } else if (checkbox.checked) {
          Listar_detalle_tipo_trazabilidad(valor);
          console.log('El valor se agrero en datos.tipo:', valor);
          datos.tipo.push(valor);
          console.log(JSON.stringify(datos));
        } else if (!checkbox.checked && datos.tipo.includes(valor)) {
          // Si el checkbox no está marcado y el valor está en el array 'datos.tipo', elimínalo
          if (w.confirm('¿Desae quitar todos los detalles de este parametro en el pedido? ' + nundoc)) {
            const checkboxesSecundarios = document.querySelectorAll('.chk_detalle' + valor);
            var indice = datos.tipo.indexOf(valor);
            if (indice !== -1) {
              datos.tipo.splice(indice, 1);
              console.log('El valor fue eliminado del array:', valor);
              console.log(JSON.stringify(datos));
              // Eliminar los detalles para el iten seleccionado
              for (var i = 0; i < checkboxesSecundarios.length; i++) {
                checkboxesSecundarios[i].checked = false;
                checkboxesSecundarios[i].disabled = false;
                var checkbox_detalle = checkboxesSecundarios[i];
                var valor_detalle = checkbox_detalle.value;
                if (!checkbox_detalle.checked && datos_detalle.detalle.includes(valor_detalle)) {
                  var indice_detalle = datos_detalle.detalle.indexOf(valor_detalle);
                  if (indice_detalle !== -1) {
                    datos_detalle.detalle.splice(indice_detalle, 1);
                    console.log('El valor fue eliminado del array:', valor_detalle);
                  }
                }
              }
              console.log(JSON.stringify(datos_detalle));
            }
          } else {
            checkbox.checked = true;
          }
        }
      }
    }

    if (e.target.matches('#chk_detalle') || e.target.matches('#chk_detalle')) {
      let padre = e.target.parentElement.parentElement;
      let miElemento = padre.querySelector('#chk_detalle');
      var valor = miElemento.getAttribute('data-id3');
      let chkdetalle = padre.querySelectorAll('.chk_detalle' + valor);
      for (var i = 0; i < chkdetalle.length; i++) {
        var checkbox = chkdetalle[i];
        var valordetalle = checkbox.value;
        // Comprueba si el checkbox está marcado y el valor está en el array 'datos.tipo'
        if (checkbox.checked && datos_detalle.detalle.includes(valordetalle)) {
          console.log('El valor del checkbox está en datos_detalle.detalle:', valordetalle);
          console.log(JSON.stringify(datos_detalle));
        } else if (checkbox.checked) {
          // Listar_detalle_tipo_trazabilidad(valor);
          console.log('El valor se agrero en datos_detalle.detalle:', valordetalle);
          datos_detalle.detalle.push(valordetalle);
          console.log(JSON.stringify(datos_detalle));
        } else if (!checkbox.checked && datos_detalle.detalle.includes(valordetalle)) {
          // Si el checkbox no está marcado y el valor está en el array 'datos.tipo', elimínalo
          var indice = datos_detalle.detalle.indexOf(valordetalle);
          if (indice !== -1) {
            datos_detalle.detalle.splice(indice, 1);
            console.log('El valor fue eliminado del array:', valordetalle);
          }
        }
      }
      console.log(JSON.stringify(datos_detalle));
    }

    if (e.target.matches('#parametros_pedido') || e.target.matches('#parametros_pedido')) {
      let padre = e.target.parentElement.parentElement;
      let trazabilidad_id = padre.querySelector('#parametros_pedido').value;
      Listar_opcion_parametros_gestion(nundoc, trazabilidad_id);
    }

    if (e.target.matches('.select_publicado')) {
      let padre = e.target.parentElement.parentElement;
      if (w.confirm('¿Esta seguro de cambair el estado de publicación de este punto?')) {
        let valor = padre.querySelector('.select_publicado').value;
        // const newValue = selectElement.value;
        let select_id = padre.querySelector('.select_publicado');
        var valor_id = select_id.getAttribute('data-id');
        $.ajax({
          url: $('#id_url_ajax').val() + 'pedidos/Actualizar_publicado',
          type: 'POST',
          dataType: 'json',
          // data: data,
          data: { publicado: valor, id: valor_id },
          success: function (response) {
            if (response.numero === 200) {
              mensaje = `
              <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
                  <div class="icon"><span class="mdi mdi-check"></span></div>
                  <div class="message">
                    <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                    <strong>Mensaje!</strong> ${response.mensaje}
                  </div>
              </div>`;
              Detalles_gestion_vista(nundoc);
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
            d.getElementById('mensaje').innerHTML = mensaje;
          },
        });
      }
    }
  });
});

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

function Publicado(elemento, actividad, nundoc, detalle) {
  if (w.confirm('¿Esta seguro de cambair el estado de publicación de este punto?')) {
    // let valores = d.getElementById("select_publicado" + actividad).value;
    var valorElemento = elemento.value;
    // // const newValue = selectElement.value;
    // let select_id = d.getElementById("select_publicado" + actividad);
    // var valor_id = select_id.getAttribute("data-id");
    $.ajax({
      url: $('#id_url_ajax').val() + 'pedidos/Actualizar_publicado',
      type: 'POST',
      dataType: 'json',
      // data: data,
      data: { publicado: valorElemento, id: detalle },
      success: function (response) {
        if (response.numero === 200) {
          mensaje = `
            <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><span class="mdi mdi-check"></span></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> ${response.mensaje}
                </div>
            </div>`;
          // Detalles_gestion_vista(nundoc);
          Detalles_actividaes(nundoc, actividad);
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
        d.getElementById('mensaje_publicado' + actividad).innerHTML = mensaje;
      },
    });
  }
}

/**
 * FIN SECCION INTERNA APRA VER LOS DETALLES DE LAS ACTIVIDADES
 * **/

async function Listar_clientes() {
  await fetch($('#id_url_ajax').val() + 'pedidos/Listar_Clientes', {
    method: 'POST',
    cache: 'no-cache',
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res)))
    .catch(error => {
      alert(JSON.stringify(error.length) || 'Error al cargar los Clientes');
    })
    .then(response => {
      let CLIENTES = d.getElementById('clientes');
      response.forEach(value => {
        let { id, documento, nombre } = value;
        let opt = document.createElement('option');
        opt.value = id;
        // opt.textContent = documento + " | " + nombre;
        opt.textContent = nombre;
        CLIENTES.appendChild(opt);
      });
    });
}

async function Listar_tipos_trazabilidad() {
  await fetch($('#id_url_ajax').val() + 'pedidos/Listar_tipos_Seguimiento', {
    method: 'POST',
    cache: 'no-cache',
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res)))
    .catch(error => {
      alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
    })
    .then(response => {
      let template = '';
      response.forEach(element => {
        template += `
        <div class="panel panel-default">
        <div class="row">
          <div class="panel-heading" style="height:30px;display: flex;align-items: center;">
            <div class="col-xs-11 col-sm-11 col-md-11 col-lg-11">
              <h4 class="panel-title">
                <input type="checkbox" id="chk_trazabilidad[]" name="chk_trazabilidad[]" class="chk_trazabilidad"
                  value="${element.id}" style="transform: scale(1.5);margin-right: 5px;margin-bottom:15px;">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse${element.id}">${element.nombre_tipo}</a>
              </h4>
            </div>
            <div class="ccol-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1" style="margin-right: 25px;">
                <button type="button" class="btn btn-warning btn-xs" data-id="${element.id}" id="btn_editar_detalles${element.id}" style="margin-bottom:12px;display:none;"><i class="fas fa-pencil-alt"></i> Editar detalles</button>
            </div>
          </div>
        </div>
        <div id="collapse${element.id}" class="panel-collapse collapse">
          <div class="panel-body">
            <div style="margin-left: 5px;" id="list_detalle${element.id}" data-id2="${element.id}"></div>
          </div>
        </div>
      </div>
        `;
        d.getElementById('accordion').innerHTML = template;
      });
    });
}

async function Listar_detalle_tipo_trazabilidad(id) {
  let data = new FormData();
  data.append('id', id);
  await fetch($('#id_url_ajax').val() + 'pedidos/Listar_Opciones', {
    method: 'POST',
    cache: 'no-cache',
    body: data,
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res)))
    .catch(error => {
      alert(JSON.stringify(error.length) || 'Error al cargar tipo de detalle');
    })
    .then(response => {
      let template_detalle = '';
      response.forEach(element => {
        template_detalle += `
          <div class="checkbox">
            <label>
                <input type="checkbox" class="chk_detalle${id}" id="chk_detalle" data-id3="${id}" name="chk_detalle[]" value="${element.id}" style="transform: scale(1.5);margin-right: 5px;"><label style="font-weight: 600;color: #777777;">${element.nombre_opcion}</label>
            </label>
          </div>
          `;
        d.getElementById('list_detalle' + id).innerHTML = template_detalle;
      });
    });
}

function DetallePedido(nundoc) {
  let data = new FormData();
  data.append('nundoc', nundoc);
  // Devolver una nueva promesa
  return new Promise((resolve, reject) => {
    // Realizar la consulta a través de Fetch
    fetch($('#id_url_ajax').val() + 'pedidos/Ver_detalle_pedidos', {
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

function Listado_detalle_parametros(nundoc) {
  let data_detalle = new FormData();
  data_detalle.append('nundoc', nundoc);
  return new Promise((resolve, reject) => {
    fetch($('#id_url_ajax').val() + 'pedidos/Ver_detalle_tipo_pedidos', {
      method: 'POST',
      cache: 'no-cache',
      body: data_detalle,
    })
      .then(res => (res.ok ? res.json() : Promise.reject(res)))
      .catch(error => {
        alert(JSON.stringify(error.length) || 'Error al cargar tipo de detalle');
      })
      .then(response => {
        resolve(response);
      });
  });
}

async function Listar_solicitudes_cliente() {
  let data = new FormData();
  data.append('cliente_id', d.getElementById('cliente_id').value);
  await fetch($('#id_url_ajax').val() + 'pedidos/Asosiar_solicitud_pedido', {
    method: 'POST',
    body: data,
    cache: 'no-cache',
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res)))
    .catch(error => {
      alert(JSON.stringify(error.length) || 'Error al cargar las solicitudes');
    })
    .then(response => {
      let SOLICITUDES = d.getElementById('solicitudes_cliente');
      response.forEach(value => {
        let { solicitud_servicio, PESO, MERCANCIA } = value;
        let opt = document.createElement('option');
        if (solicitud_servicio !== ' ') {
          opt.value = solicitud_servicio;
          opt.textContent = 'Solicitud:' + solicitud_servicio + ' - Peso:' + PESO + ' - Mercancia: ' + MERCANCIA;
        } else {
          opt.value = '';
          opt.textContent = 'Sin solicitudes';
        }
        SOLICITUDES.appendChild(opt);
      });
    });
}

async function Listar_parametros_gestion(nundoc) {
  let data = new FormData();
  data.append('nundoc', nundoc);
  await fetch($('#id_url_ajax').val() + 'pedidos/listar_puntos_parametros_gestion', {
    method: 'POST',
    body: data,
    cache: 'no-cache',
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res)))
    .catch(error => {
      alert(JSON.stringify(error.length) || 'Error al cargar las solicitudes');
    })
    .then(response => {
      let PEDIDOS = d.getElementById('parametros_pedido');
      PEDIDOS.innerHTML = '';
      response.forEach(value => {
        let { nombre_tipo, id } = value;
        let opt = document.createElement('option');
        opt.value = id;
        opt.textContent = nombre_tipo;
        PEDIDOS.appendChild(opt);
      });
    });
}

async function Listar_opcion_parametros_gestion(nundoc, trazabilidad_id) {
  let data = new FormData();
  data.append('nundoc', nundoc);
  data.append('trazabilidad_id', trazabilidad_id);
  await fetch($('#id_url_ajax').val() + 'pedidos/Listar_Puntos_opcion_parametro_gestion', {
    method: 'POST',
    body: data,
    cache: 'no-cache',
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res)))
    .catch(error => {
      alert(JSON.stringify(error.length) || 'Error al cargar las solicitudes');
    })
    .then(response => {
      let PEDIDOS = d.getElementById('parametros_punto_pedido_opcion');
      PEDIDOS.innerHTML = '';
      response.forEach(value => {
        let { nombre_opcion, id } = value;
        let opt = document.createElement('option');
        opt.value = id;
        opt.textContent = nombre_opcion;
        PEDIDOS.appendChild(opt);
      });
    });
}

function Detalle_gestion(nundoc) {
  let data_detalle = new FormData();
  data_detalle.append('nundoc', nundoc);
  return new Promise((resolve, reject) => {
    fetch($('#id_url_ajax').val() + 'pedidos/Ver_Detalle_gestion', {
      method: 'POST',
      cache: 'no-cache',
      body: data_detalle,
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

/* Vsitas */
async function Detalles_gestion_vista(nundoc) {
  await fetch($('#id_url_ajax').val() + 'views/pedidos/template/detalle_gestion.phtml')
    .then(response => response.text()) // convierte la respuesta a texto
    .then(html => {
      d.getElementById('detalle_gestion').innerHTML = html;
      Detalle_gestion(nundoc)
        .then(resultado => {
          let tbody = d.getElementById('tbl_detalle_gestion');
          tbody.innerHTML = '';
          if (resultado) {
            resultado.forEach(element => {
              setTimeout(() => {
                const fila = d.createElement('tr');
                fila.style.fontSize = '12px';
                const columnaNumero = d.createElement('td');
                columnaNumero.textContent = element.detalle_id;
                const columnaParametro = d.createElement('td');
                // columnaParametro.textContent = element.nombre_tipo;
                columnaParametro.innerHTML = `<span class="text-primary">${element.nombre_tipo}</span>`;
                const columnaConcepto = d.createElement('td');
                columnaConcepto.textContent = element.nombre_opcion;
                const columnaFecha = d.createElement('td');
                columnaFecha.textContent = element.fecha;
                const columnaObservacion = d.createElement('td');
                columnaObservacion.textContent = element.observacion;
                const columnaResponsable = d.createElement('td');
                columnaResponsable.textContent = element.usuario;
                const columnaPublicado = d.createElement('td');
                if (element.se_publica === 'SI') {
                  columnaPublicado.innerHTML = `<select style="background-color:#14A44D;color:#FFFFFF;border-radiud:15px;" class="select_publicado" data-id="${element.detalle_id}">
                <option value="${element.se_publica}">${element.se_publica}</option>
                <option value="NO">NO</option>
              </select>`;
                } else {
                  columnaPublicado.innerHTML = `<select style="background-color:#DC4C64;color:#FFFFFF;" class="select_publicado" data-id="${element.detalle_id}">
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
                 </div>
                `;
                } else {
                  columnaEvidencia.innerHTML = `<span class="text-primary">Sin evidencia</span>`;
                }

                fila.appendChild(columnaNumero);
                fila.appendChild(columnaParametro);
                fila.appendChild(columnaConcepto);
                fila.appendChild(columnaFecha);
                fila.appendChild(columnaObservacion);
                fila.appendChild(columnaResponsable);
                fila.appendChild(columnaPublicado);
                fila.appendChild(columnaEvidencia);
                tbody.appendChild(fila);
              }, 1000);
              // d.getElementById("cargando").style.display = "none";
            });
          } else {
            const columnaSindatos = d.createElement('td');
            columnaSindatos.innerHTML = `Parametro sin Gestión`;
            fila.appendChild(columnaSindatos);
            tbody.appendChild(fila);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    })
    .catch(error => console.error('Error al cargar el archivo HTML:', error));
}

function listar_Activiades(nundoc) {
  let data = new FormData();
  data.append('nundoc', nundoc);
  return new Promise((resolve, reject) => {
    fetch($('#id_url_ajax').val() + 'pedidos/Listar_actividades_gestion', {
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

/***
 *
 * FUNMCION PARA DARLE DINAMISMO A LA BARRA DE PROGRESO DEL PEDIDO SEGUN EL ESTADO DE LAS ACTVIDADES
 *
 * ***/
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
      console.log(ancho);
      // Actualizar la barra de progreso
      $('.progress-bar').css('width', ancho + '%');
      // $(".progress-bar").html(ancho.toFixed(2) + "%"); // Redondear el porcentaje a dos decimales
      ancho = Math.round(ancho * 100) / 100; // Redondear a dos decimales
      $('.progress-bar').html(ancho + '%'); // Redondear el porcentaje a dos decimales
    });
}

// async function Validar_dependencias(actvidad_id) {
// try {
//   const response = await fetch($('#id_url_ajax').val() + 'pedidos/validar_dependencias', {
//     method: 'POST',
//     // body: formdata,
//     cache: 'no-cache',
//   });

//   const data = await response.json();

// } catch (error) {
//   console.error('Error en la primera solicitud:', error);
//   throw error;
// } finally {
//   // $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
//   // ListarDespachos(d.getElementById('fecha_inicial').value, d.getElementById('fecha_final').value, d.getElementById('cliente_id').value, d.getElementById('numdoc_predido').value, filtro);
// }
// let data = new FormData();
// data.append('actvidad_id', actvidad_id);
//   return new Promise((resolve, reject) => {
//     fetch($('#id_url_ajax').val() + 'pedidos/validar_dependencias', {
//       method: 'POST',
//       cache: 'no-cache',
//       body: data,
//     })
//       .then(res => (res.ok ? res.json() : Promise.reject(res)))
//       .catch(error => {
//         alert(JSON.stringify(error.length) || 'Error al cargar tipo de detalle');
//         reject(error);
//       })
//       .then(response => {
//         resolve(response);
//       });
//   });
// }
