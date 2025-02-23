const d = document;
const w = window;
let valores = '';
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  valores = window.location.search;

  Listar_clientes();
  Listar_tipos_trazabilidad();
  // var fecha_inicio = d.getElementById('fecha_inicial').value;
  // var fecha_fin = d.getElementById('fecha_final').value;
  Listar_pedidos();

  if (d.getElementById('tipo_usuario_perfil').value === 'CLIENTES') {
    d.getElementById('btn_crea').style.display = 'none';
  } else {
    // d.getElementById('btn_crea').style.display = 'block';
  }

  // Función para expandir o contraer nodos
  const checkboxes = document.querySelectorAll('.tree input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const ul = this.parentElement.querySelector('ul');
      if (ul) {
        ul.style.display = this.checked ? 'block' : 'none';
      }
    });
  });

  let datos = {
    tipo: [],
  };

  let datos_detalle = {
    detalle: [],
  };

  let usuarios_responsable = {
    usuario: [],
    fecha: [],
    hora: [],
    costo: [],
    posicion: [],
    valor: [],
  };

  var contador = 0;
  let Posiciones = {
    posicion: [],
    valor: [],
  };

  d.addEventListener('change', async e => {
    if (e.target.matches('.chk_trazabilidad') || e.target.matches('.chk_trazabilidad *')) {
      let padre = e.target.parentElement.parentElement;
      let chktrazabilidad = padre.querySelectorAll('.chk_trazabilidad');
      // Itera sobre la lista de checkboxes
      for (var i = 0; i < chktrazabilidad.length; i++) {
        var checkbox = chktrazabilidad[i];
        var valor = chktrazabilidad[i].value;
        // Hacer algo con cada checkbox, por ejemplo, verificar si está marcado
        // Verifica si el checkbox está marcado o desmarcado
        if (checkbox.checked) {
          d.getElementById('parametros').style.display = 'block';
          let data = new FormData();
          data.append('id', valor);
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
              const hoy = new Date(); // Obtener la fecha actual
              const fechaHoy = hoy.toISOString().split('T')[0]; // Formatear como YYYY-MM-DD

              response.forEach(element => {
                template_detalle += `
                  <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div class="checkbox">
                        <label>
                          <input type="checkbox" class="chk_detalle" id="chk_detalle${element.id}" name="chk_detalle[]"
                            value="${element.id}" data-idvalor="${element.id}" style="transform: scale(1.5);margin-right: 2px;">
                            <span class="position"></span>
                            <label style="font-weight: 600;color: #777777;">${element.nombre_opcion}</label>
                        </label>
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div class="form-group" style="display:none;" id="form_asignacion${element.id}">
                        <div class="row">
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <label for="usuario_responsable${element.id}">Usuario responsable</label>
                            <input type="text" class="form-control input-xs usuario_responsable" name="usuario_responsable[]" id="usuario_responsable${element.id}">
                            <ul id="searchResults${element.id}" style="list-style: none;padding: 0;margin: 0;border: 1px solid #ccc;border-radius: 4px;max-height: 150px;overflow-y: auto;"></ul>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <label for="costo_actividad${element.id}">Costo Actividad</label>
                            <input type="number" class="form-control input-xs costo_actividad" name="costo_actividad[]" id="costo_actividad${element.id}">
                          </div>
                        </div>
                        
                        <div class="row">
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div class="form-group">
                              <label for="fecha_vencimiento${element.id}">Fecha vencimiento</label>
                              <input type="date" class="form-control input-xs" name="fecha_vencimiento[]"
                                id="fecha_vencimiento${element.id}" value="${fechaHoy}">
                            </div>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div class="form-group">
                              <label for="hora_vencimiento${element.id}">Hora vencimiento</label>
                              <input type="time" class="form-control input-xs" name="hora_vencimiento[]"
                                id="hora_vencimiento${element.id}">
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
                d.getElementById('list_detalle' + valor).innerHTML = template_detalle;
              });
            });
        } else {
          d.getElementById('list_detalle' + valor).innerHTML = '';
        }
      }
    }

    const secondaryList = d.getElementById('secondaryList');
    const counterElement = d.getElementById('posicion');

    if (e.target.matches('.chk_detalle') || e.target.matches('.chk_detalle *')) {
      // Asegúrate de que Posiciones.posicion esté inicializado
      if (!Posiciones.posicion) {
        Posiciones.posicion = [];
      }
      let padre = e.target.parentElement.parentElement;
      let checkDetalle = padre.querySelectorAll('.chk_detalle');
      for (let i = 0; i < checkDetalle.length; i++) {
        var checkbox = checkDetalle[i];
        var valor_detalle = checkDetalle[i].value;

        var texto = checkDetalle[i].parentElement.textContent;
        let Id = checkbox.getAttribute('data-idvalor');
        const searchInput = d.getElementById('usuario_responsable' + Id);
        const searchResults = d.getElementById('searchResults' + Id);

        if (checkbox.checked) {
          contador++;
          checkbox.setAttribute('data-idposicion', contador);
          // Crear un contenedor para el número y el texto
          const listItem = d.createElement('div');
          const puesto = d.createElement('span');
          puesto.textContent = contador;
          puesto.style.fontWeight = 'bold';
          // listItem.setAttribute('id', 'id' + puesto.textContent);
          // listItem.setAttribute('id', +puesto.textContent);
          listItem.setAttribute('id', 'puesto_id' + Id);
          // Agregar el número al contenedor
          listItem.appendChild(puesto);

          // Agregar el texto al contenedor
          const textoElement = d.createElement('span');
          textoElement.textContent = texto;
          listItem.appendChild(textoElement);
          // Agrega el elemento div con el título y el número al contenedor principal
          secondaryList.appendChild(listItem);
          // Modificación: Concatena el Id al final del string del ID
          const formId = 'form_asignacion' + Id;
          d.getElementById(formId).style.display = 'block';
          // Agrega la posición al array
          var posicion_array = puesto.parentElement.textContent;
          var dato = posicion_array.split(' ');
          // Actualiza el contador
          updateCounter();
          // Posiciones.posicion.push(parseInt(dato[0]) + '/' + parseInt(valor_detalle));
          Posiciones.valor.push(valor_detalle);

          /* Buscar usuario responsable para la actividad */
          searchInput.addEventListener('input', async e => {
            const searchTerm = searchInput.value.trim();
            // Realizar una solicitud AJAX para obtener resultados desde el servidor
            if (searchTerm !== '') {
              // Realizar una solicitud AJAX para obtener resultados desde el servidor
              $.post(
                $('#id_url_ajax').val() + 'pedidos/Buscar_usuario',
                {datos: searchTerm},
                function(data) {
                  mostrar_resultados(data);
                },
                'json',
              );
            } else {
              // Limpiar los resultados si el campo de búsqueda está vacío
              limpiar_resultados();
            }
          });

          function mostrar_resultados(results) {
            // Limpiar resultados anteriores
            limpiar_resultados();
            // Mostrar los nuevos resultados
            results.forEach(function(result) {
              const li = document.createElement('li');
              li.style.padding = '8px';
              li.style.cursor = 'pointer';
              li.style.transition = 'background-color 0.3s';
              li.textContent = result.nom_usuario + '  ' + result.user_log;
              li.addEventListener('click', function() {
                // Colocar el valor en el input al hacer clic en un resultado
                searchInput.value = result.nom_usuario;
                searchInput.setAttribute('data-idusuario', result.id);
                Posiciones.posicion.push(parseInt(dato[0]) + '/' + parseInt(valor_detalle) + '/' + parseInt(result.id));
                limpiar_resultados();
              });
              searchResults.appendChild(li);
            });
          }

          function limpiar_resultados() {
            // Limpiar la lista de resultados
            searchResults.innerHTML = '';
          }

          // console.log(Posiciones.posicion);
        } else {
          const formId = 'form_asignacion' + Id;
          d.getElementById(formId).style.display = 'none';

          const PuestoId = 'puesto_id' + Id;
          d.getElementById(PuestoId).style.display = 'none';

          var posicion_eliminar = checkbox.getAttribute('data-idposicion');
          var indice = Posiciones.posicion.indexOf(parseInt(posicion_eliminar));
          if (indice !== -1) {
            // El elemento existe en el array, ahora puedes eliminarlo usando splice
            // console.log('El elemento existe en el array en el índice: ' + indice);
            Posiciones.posicion.splice(indice, 1);
            contador--;
            updateCounter();
          } else {
            // console.log('El elemento no existe en el array');
            Posiciones.posicion.splice(indice, 1);
            contador--;
            updateCounter();
          }
          // console.log(Posiciones.posicion);
        }
        // console.log('🚀 ~ secondaryList:', secondaryList);
      }
    }

    function updateCounter() {
      counterElement.textContent = `Número de actividades: ${contador}`;
    }

    /**** Radio butons para la craecion del pedido segun el que se elija ****/
    if (e.target.matches('.tipo_pedido') || e.target.matches('.tipo_pedido *')) {
      const tipo_operaciones = d.getElementsByName('tipo_operacion');
      for (const tipo_operacion of tipo_operaciones) {
        if (tipo_operacion.checked) {
          const valorSeleccionado = tipo_operacion.value;
          if (valorSeleccionado === 'Nueva') {
            Listar_tipos_trazabilidad();
            d.getElementById('parametros').style.display = 'block';
            d.getElementById('select_plantilla').style.display = 'none';
            d.getElementById('lista_previsualizacion').style.display = 'block';
            if (datos.tipo.length > 0 && datos_detalle.detalle.length > 0 && usuarios_responsable.usuario.length > 0 && usuarios_responsable.fecha.length > 0 && usuarios_responsable.hora.length > 0) {
              datos.tipo = [];
              datos_detalle.detalle = [];
              usuarios_responsable.usuario = [];
              usuarios_responsable.fecha = [];
              usuarios_responsable.hora = [];
            }
          } else {
            Listar_tipos_trazabilidad();
            d.getElementById('parametros').style.display = 'none';
            d.getElementById('lista_previsualizacion').style.display = 'none';
            d.getElementById('select_plantilla').style.display = 'block';
            if (datos.tipo.length > 0 && datos_detalle.detalle.length > 0 && usuarios_responsable.usuario.length > 0 && usuarios_responsable.fecha.length > 0 && usuarios_responsable.hora.length > 0) {
              datos.tipo = [];
              datos_detalle.detalle = [];
              usuarios_responsable.usuario = [];
              usuarios_responsable.fecha = [];
              usuarios_responsable.hora = [];
            }

            await fetch($('#id_url_ajax').val() + 'pedidos/Listar_Plantillas', {
              method: 'POST',
              cache: 'no-cache',
            })
              .then(res => (res.ok ? res.json() : Promise.reject(res)))
              .catch(error => {
                alert(JSON.stringify(error.length) || 'Error al cargar los Pedidos');
              })
              .then(response => {
                let PLANTILLAS = d.getElementById('plantillas');
                PLANTILLAS.innerHTML = '';

                // Agregar la opción adicional
                let optionDefault = document.createElement('option');
                optionDefault.value = ''; // Establecer el valor según sea necesario
                optionDefault.textContent = 'Selecciona una plantilla'; // Texto de la opción
                PLANTILLAS.appendChild(optionDefault);

                // Iterar sobre las opciones recibidas
                response.forEach(value => {
                  let {id, nombre_plantilla, numdoc} = value;
                  let opt = document.createElement('option');
                  opt.value = numdoc;
                  opt.textContent = nombre_plantilla;
                  PLANTILLAS.appendChild(opt);
                });
              });
          }
        }
      }
    }

    if (e.target.matches('#check_plantilla') || e.target.matches('#check_plantilla *')) {
      let padre = e.target.parentElement.parentElement;
      var checkbox = padre.querySelector('#check_plantilla');
      if (checkbox.checked) {
        d.getElementById('nom_plantilla').style.display = 'block';
      } else {
        d.getElementById('nom_plantilla').style.display = 'none';
      }
    }

    if (e.target.matches('#plantillas') || e.target.matches('#plantillas *')) {
      let padre = e.target.parentElement.parentElement;
      var numdoc_plantilla = padre.querySelector('#plantillas').value;
      // console.log(numdoc_plantilla);
      let data = new FormData();
      data.append('numdoc_plantilla', numdoc_plantilla);
      await fetch($('#id_url_ajax').val() + 'pedidos/Pintar_Plantilla', {
        method: 'POST',
        body: data,
        cache: 'no-cache',
      })
        .then(res => (res.ok ? res.json() : Promise.reject(res)))
        .catch(error => {
          alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
        })
        .then(response => {
          if (response) {
            document.getElementById('parametros').style.display = 'block';
            document.getElementById('check_save_plantilla').style.display = 'none';
            let checkboxes = document.getElementsByName('chk_trazabilidad[]');
            response.forEach(element => {
              // Agregar elementos al array
              datos.tipo.push(element.tipo_proceso_id);
              setTimeout(() => {
                // Recorre los checkboxes y marca aquellos cuyo valor coincida
                checkboxes.forEach(function(checkbox) {
                  if (checkbox.value === element.tipo_proceso_id.toString()) {
                    checkbox.checked = true;
                    checkbox.disabled = true;
                    let dato = checkbox.value;
                    if (checkbox.checked) {
                      Listar_actividaes_plantilla(dato);
                    }
                  } else {
                    checkbox.disabled = true;
                  }
                });
              }, 500);
            });

            // Consultar detalle de porcesos de trazabilidad
            Listado_detalle_actividades_plantilla(numdoc_plantilla)
              .then(resultado => {
                // console.log('Datos recibidos detalles:', resultado);
                let checkboxes1 = d.getElementsByName('chk_detalle[]');
                resultado.forEach(element => {
                  datos_detalle.detalle.push(element.detalle_actividad_plantilla);
                  // Posiciones.posicion.push(element.posicion + '/' + element.detalle_actividad_plantilla);
                  setTimeout(() => {
                    checkboxes1.forEach(function(checkbox1) {
                      let Id = checkbox1.getAttribute('data-idvalor');
                      if (checkbox1.value === element.detalle_actividad_plantilla.toString()) {
                        checkbox1.checked = true;
                        const formId = 'form_asignacion' + Id;
                        d.getElementById(formId).style.display = 'block';
                        // Buscador de los usuarios responsables
                        const searchInput = d.getElementById('usuario_responsable_plantilla' + Id);
                        const searchResults = d.getElementById('searchResults' + Id);
                        /* Buscar usuario responsable para la actividad */
                        searchInput.addEventListener('input', async e => {
                          const searchTerm = searchInput.value.trim();
                          // Realizar una solicitud AJAX para obtener resultados desde el servidor
                          if (searchTerm !== '') {
                            // Realizar una solicitud AJAX para obtener resultados desde el servidor
                            $.post(
                              $('#id_url_ajax').val() + 'pedidos/Buscar_usuario',
                              {datos: searchTerm},
                              function(data) {
                                mostrar_resultados(data);
                              },
                              'json',
                            );
                          } else {
                            // Limpiar los resultados si el campo de búsqueda está vacío
                            limpiar_resultados();
                          }
                        });
                        function mostrar_resultados(results) {
                          // Limpiar resultados anteriores
                          limpiar_resultados();
                          // Mostrar los nuevos resultados
                          results.forEach(function(result) {
                            const li = document.createElement('li');
                            li.style.padding = '8px';
                            li.style.cursor = 'pointer';
                            li.style.transition = 'background-color 0.3s';
                            li.textContent = result.nom_usuario + '  ' + result.user_log;
                            li.addEventListener('click', function() {
                              // Colocar el valor en el input al hacer clic en un resultado
                              searchInput.value = result.nom_usuario;
                              searchInput.setAttribute('data-idusuario', result.id);
                              Posiciones.posicion.push(element.posicion + '/' + element.detalle_actividad_plantilla + '/' + result.id);
                              limpiar_resultados();
                            });
                            searchResults.appendChild(li);
                          });
                        }
                        function limpiar_resultados() {
                          // Limpiar la lista de resultados
                          searchResults.innerHTML = '';
                        }
                        checkbox1.disabled = true;
                      } else {
                        checkbox1.disabled = true;
                      }
                    });
                  }, 1500);
                });
              })
              .catch(error => {
                console.error('Error:', error);
              });
          }
        });
    }
  });

  d.addEventListener('click', async e => {
    if (e.target.matches('#guardar_trazabilidad') || e.target.matches('#guardar_trazabilidad *')) {
      let mensaje = '';
      var checkboxes = d.querySelectorAll('.chk_trazabilidad');
      // Verificar si al menos uno está seleccionado
      var alMenosUnoSeleccionado = Array.from(checkboxes).some(checkbox => checkbox.checked);

      var checkboxesdetalle = d.querySelectorAll('.chk_detalle');
      var alMenosUnoSeleccionadodetalle = Array.from(checkboxesdetalle).some(checkbox => checkbox.checked);

      var UsuarioResponsable = d.querySelectorAll('.usuario_responsable');
      var Usuario_Responable = Array.from(UsuarioResponsable).some(usuario => usuario.value);

      var configurar_plantilla = d.getElementById('check_plantilla');
      const tipos = d.getElementsByName('tipo_operacion');
      for (const tipo of tipos) {
        if (tipo.checked) {
          const tipoSeleccionado = tipo.value;
          if (tipoSeleccionado === 'Nueva') {
            //GUARDAR NUEVO PEDIDO Y TAMBIEN COMO PLANTILLA PARA FUTUROS PEDIDOS
            if (configurar_plantilla.checked) {
              if (d.getElementById('clientes').value === '') {
                mensaje = `
                    <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                        <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                        <div class="message">
                          <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                          <strong>Mensaje!</strong> Debe seleccionar un cliente para realiziar el pedido.
                        </div>
                    </div>`;
                d.getElementById('notificaciones').innerHTML = mensaje;
                d.getElementById('clientes').focus();
              } else if (d.getElementById('referencia').value === '') {
                mensaje = `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> Debe diligenciar un numero de referencia para realiziar el pedido.
                      </div>
                  </div>`;
                d.getElementById('notificaciones').innerHTML = mensaje;
                d.getElementById('referencia').focus();
                d.getElementById('ref').classList.add('has-warning');
              } else if (alMenosUnoSeleccionado === false) {
                mensaje = `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> Debe seleccionar al menos una opcion de trazabilidad para realiziar el pedido.
                      </div>
                  </div>`;
                d.getElementById('notificaciones').innerHTML = mensaje;
                d.getElementById('ref').classList.remove('has-warning');
              } else if (alMenosUnoSeleccionadodetalle === false) {
                mensaje = `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> Debe seleccionar al menos un detalle delos parametros seleccionados para realiziar el pedido.
                      </div>
                  </div>`;
                d.getElementById('notificaciones').innerHTML = mensaje;
                d.getElementById('ref').classList.remove('has-warning');
              } else if (Usuario_Responable === false) {
                mensaje = `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> Debe seleccionar un usaurio responsable para las actividades habilitadas al pedido.
                      </div>
                  </div>`;
                d.getElementById('notificaciones').innerHTML = mensaje;
              } else if (d.getElementById('nombre_plantilla').value === '') {
                mensaje = `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> Debe diligenciar un nombre para la plantilla.
                      </div>
                  </div>`;
                d.getElementById('notificaciones').innerHTML = mensaje;
              } else {
                d.getElementById('notificaciones').style.display = 'none';
                d.getElementById('ref').classList.remove('has-warning');
                if (w.confirm('¿Esta seguro de guardar el pedido?')) {
                  let cliente = d.getElementById('clientes').value;
                  let referencia = d.getElementById('referencia').value;
                  let observacion = d.getElementById('observacion').value;
                  let tipos = d.getElementsByName('chk_trazabilidad[]');
                  let detalles = d.getElementsByName('chk_detalle[]');
                  let USUARIOS = d.getElementsByName('usuario_responsable[]');
                  let FECHAS = d.getElementsByName('fecha_vencimiento[]');
                  let HORAS = d.getElementsByName('hora_vencimiento[]');
                  let COSTOS = d.getElementsByName('costo_actividad[]');

                  for (var i = 0; i < tipos.length; i++) {
                    var checkbox = tipos[i];
                    if (checkbox.checked) {
                      var tipo_traz = tipos[i].value;
                      datos.tipo.push(tipo_traz);
                    } else {
                      datos.tipo.splice(i, 1); // Elimina el elemento no seleccionado
                    }
                  }
                  var nota = datos;
                  nota = JSON.stringify(nota);
                  for (let j = 0; j < detalles.length; j++) {
                    // const element = detalles[j];
                    var checkbox_detalle = detalles[j];
                    if (checkbox_detalle.checked) {
                      var detalles_traz = detalles[j].value;
                      datos_detalle.detalle.push(detalles_traz);
                    } else {
                      datos_detalle.detalle.splice(j, 1); // Elimina el elemento no seleccionado
                    }
                  }
                  var nota_detalle = datos_detalle;
                  nota_detalle = JSON.stringify(nota_detalle);

                  var posiciones_detalle = Posiciones;
                  // posiciones_detalle = JSON.stringify(posiciones_detalle);

                  for (let u = 0; u < USUARIOS.length; u++) {
                    const usuarios = USUARIOS[u].getAttribute('data-idusuario');
                    if (usuarios !== null /* && !usuarios_responsable.usuario.includes(usuarios) */) {
                      usuarios_responsable.usuario.push(usuarios);
                    }
                  }

                  for (let f = 0; f < FECHAS.length; f++) {
                    const fechas = FECHAS[f].value;
                    if (fechas !== '' /* && !usuarios_responsable.fecha.includes(fechas) */) {
                      usuarios_responsable.fecha.push(fechas);
                    }
                  }

                  for (let h = 0; h < HORAS.length; h++) {
                    const horas = HORAS[h].value;
                    if (horas !== '' /* && !usuarios_responsable.hora.includes(horas) */) {
                      usuarios_responsable.hora.push(horas);
                    }
                  }

                  for (let g = 0; g < COSTOS.length; g++) {
                    const costos = COSTOS[g].value;
                    if (costos !== '' /* && !usuarios_responsable.costo.includes(costos) */) {
                      usuarios_responsable.costo.push(costos);
                    }
                  }

                  //Agregar los las posiciones en un solo array
                  // Recorrer con base en la longitud de uno de los arrays
                  for (let m = 0; m < posiciones_detalle.posicion.length; m++) {
                    const posicion = posiciones_detalle.posicion[m];
                    const valor = posiciones_detalle.valor[m];

                    // Verifica si la posición ya existe en Posiciones
                    if (!usuarios_responsable.posicion.includes(posicion) || !usuarios_responsable.valor.includes(valor)) {
                      usuarios_responsable.posicion.push(posicion);
                      usuarios_responsable.valor.push(valor);
                    }
                  }

                  var responsable = usuarios_responsable;
                  responsable = JSON.stringify(responsable);

                  let formdata = new FormData();
                  formdata.append('cliente', cliente);
                  formdata.append('referencia', referencia);
                  formdata.append('observacion', observacion);
                  formdata.append('nota', nota);
                  formdata.append('nota_detalle', nota_detalle);
                  formdata.append('posiciones_detalle', posiciones_detalle);
                  formdata.append('usuarios_responsable', responsable);
                  formdata.append('nombre_plantilla', d.getElementById('nombre_plantilla').value);
                  formdata.append('tipo', tipoSeleccionado);
                  formdata.append('configurar_plantilla', configurar_plantilla.value);

                  try {
                    const response = await fetch($('#id_url_ajax').val() + 'pedidos/Insertar_trazabilidad_pedido', {
                      method: 'POST',
                      body: formdata,
                      cache: 'no-cache',
                    });

                    const data = await response.json();
                    if (data.numero === 200) {
                      Swal.fire({
                        title: 'Mensaje',
                        html: data.mensaje,
                        icon: 'success',
                        customClass: {
                          popup: 'swal2-custom-font',
                        },
                      });
                      setTimeout(function() {
                        location.reload(false);
                      }, 1000);
                    } else {
                      Swal.fire({
                        title: 'Error',
                        html: data.mensaje,
                        icon: 'error',
                        customClass: {
                          popup: 'swal2-custom-font',
                        },
                      });
                    }
                  } catch (error) {
                    console.error('Error en la solicitud:', error);
                  } finally {
                    // d.getElementById('loading-overlay-nexosapp').style.display = 'none';
                  }
                }
              }
            } else {
              /* GUARDAR COMO NUEVO PERO NO COMO UNA PLANTILLA  */
              if (d.getElementById('clientes').value === '') {
                mensaje = `
                    <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                        <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                        <div class="message">
                          <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                          <strong>Mensaje!</strong> Debe seleccionar un cliente para realiziar el pedido.
                        </div>
                    </div>`;
                d.getElementById('notificaciones').innerHTML = mensaje;
                d.getElementById('clientes').focus();
              } else if (d.getElementById('referencia').value === '') {
                mensaje = `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> Debe diligenciar un numero de referencia para realiziar el pedido.
                      </div>
                  </div>`;
                d.getElementById('notificaciones').innerHTML = mensaje;
                d.getElementById('referencia').focus();
                d.getElementById('ref').classList.add('has-warning');
              } else if (alMenosUnoSeleccionado === false) {
                mensaje = `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> Debe seleccionar al menos una opcion de trazabilidad para realiziar el pedido.
                      </div>
                  </div>`;
                d.getElementById('notificaciones').innerHTML = mensaje;
                d.getElementById('ref').classList.remove('has-warning');
              } else if (alMenosUnoSeleccionadodetalle === false) {
                mensaje = `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> Debe seleccionar al menos un detalle delos parametros seleccionados para realiziar el pedido.
                      </div>
                  </div>`;
                d.getElementById('notificaciones').innerHTML = mensaje;
                d.getElementById('ref').classList.remove('has-warning');
              } else if (Usuario_Responable === false) {
                mensaje = `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> Debe seleccionar un usaurio responsable para las actividades habilitadas al pedido.
                      </div>
                  </div>`;
                d.getElementById('notificaciones').innerHTML = mensaje;
              } else {
                d.getElementById('notificaciones').style.display = 'none';
                d.getElementById('ref').classList.remove('has-warning');

                if (w.confirm('¿Esta seguro de guardar el pedido?')) {
                  let cliente = d.getElementById('clientes').value;
                  let referencia = d.getElementById('referencia').value;
                  let observacion = d.getElementById('observacion').value;
                  let tipos = d.getElementsByName('chk_trazabilidad[]');
                  let detalles = d.getElementsByName('chk_detalle[]');
                  let USUARIOS = d.getElementsByName('usuario_responsable[]');
                  let FECHAS = d.getElementsByName('fecha_vencimiento[]');
                  let HORAS = d.getElementsByName('hora_vencimiento[]');
                  let COSTOS = d.getElementsByName('costo_actividad[]');

                  for (var i = 0; i < tipos.length; i++) {
                    var checkbox = tipos[i];
                    if (checkbox.checked) {
                      var tipo_traz = tipos[i].value;
                      datos.tipo.push(tipo_traz);
                    } else {
                      datos.tipo.splice(i, 1); // Elimina el elemento no seleccionado
                    }
                  }
                  var nota = datos;
                  nota = JSON.stringify(nota);

                  for (let j = 0; j < detalles.length; j++) {
                    // const element = detalles[j];
                    var checkbox_detalle = detalles[j];
                    if (checkbox_detalle.checked) {
                      var detalles_traz = detalles[j].value;
                      datos_detalle.detalle.push(detalles_traz);
                    } else {
                      datos_detalle.detalle.splice(j, 1); // Elimina el elemento no seleccionado
                    }
                  }
                  var nota_detalle = datos_detalle;
                  nota_detalle = JSON.stringify(nota_detalle);

                  var posiciones_detalle = Posiciones;
                  // posiciones_detalle = JSON.stringify(posiciones_detalle);

                  for (let u = 0; u < USUARIOS.length; u++) {
                    const usuarios = USUARIOS[u].getAttribute('data-idusuario');
                    if (usuarios !== null /* && !usuarios_responsable.usuario.includes(usuarios) */) {
                      usuarios_responsable.usuario.push(usuarios);
                    }
                  }

                  for (let f = 0; f < FECHAS.length; f++) {
                    const fechas = FECHAS[f].value;
                    if (fechas !== '' /* && !usuarios_responsable.fecha.includes(fechas) */) {
                      usuarios_responsable.fecha.push(fechas);
                    }
                  }

                  for (let h = 0; h < HORAS.length; h++) {
                    const horas = HORAS[h].value;
                    if (horas !== '' /* && !usuarios_responsable.hora.includes(horas) */) {
                      usuarios_responsable.hora.push(horas);
                    }
                  }

                  for (let g = 0; g < COSTOS.length; g++) {
                    const costos = COSTOS[g].value;
                    if (costos !== '' /* && !usuarios_responsable.costo.includes(costos) */) {
                      usuarios_responsable.costo.push(costos);
                    }
                  }

                  //Agregar los las posiciones en un solo array
                  // Recorrer con base en la longitud de uno de los arrays
                  for (let m = 0; m < posiciones_detalle.posicion.length; m++) {
                    const posicion = posiciones_detalle.posicion[m];
                    const valor = posiciones_detalle.valor[m];

                    // Verifica si la posición ya existe en Posiciones
                    if (!usuarios_responsable.posicion.includes(posicion) || !usuarios_responsable.valor.includes(valor)) {
                      usuarios_responsable.posicion.push(posicion);
                      usuarios_responsable.valor.push(valor);
                    }
                  }

                  var responsable = usuarios_responsable;
                  responsable = JSON.stringify(responsable);

                  let formdata = new FormData();
                  formdata.append('cliente', cliente);
                  formdata.append('referencia', referencia);
                  formdata.append('observacion', observacion);
                  formdata.append('nota', nota);
                  formdata.append('nota_detalle', nota_detalle);
                  formdata.append('posiciones_detalle', posiciones_detalle);
                  formdata.append('usuarios_responsable', responsable);
                  formdata.append('nombre_plantilla', d.getElementById('nombre_plantilla').value);
                  formdata.append('tipo', tipoSeleccionado);
                  formdata.append('configurar_plantilla', 'No');

                  try {
                    const response = await fetch($('#id_url_ajax').val() + 'pedidos/Insertar_trazabilidad_pedido', {
                      method: 'POST',
                      body: formdata,
                      cache: 'no-cache',
                    });

                    const data = await response.json();
                    if (data.numero === 200) {
                      // $('#crear_trazabilidad').modal('hide');
                      Swal.fire({
                        title: 'Mensaje',
                        html: data.mensaje,
                        icon: 'success',
                        customClass: {
                          popup: 'swal2-custom-font',
                        },
                      });
                      setTimeout(function() {
                        location.reload(false);
                      }, 1000);
                    } else {
                      // console.error('No se recibieron datos válidos');
                      Swal.fire({
                        title: 'Error',
                        html: data.mensaje,
                        icon: 'error',
                        customClass: {
                          popup: 'swal2-custom-font',
                        },
                      });
                    }
                  } catch (error) {
                    console.error('Error en la solicitud:', error);
                  } finally {
                    // d.getElementById('loading-overlay-nexosapp').style.display = 'none';
                  }
                }
              }
            }
          } else {
            // GUARDAR PEDIDO DESDE UNA PLANTILLA
            var UsuarioResponsablePlantilla = d.querySelectorAll('.usuario_responsable_plantilla');
            var Usuario_Responable_Plantilla = Array.from(UsuarioResponsablePlantilla).some(usuario => usuario.value);
            if (d.getElementById('clientes').value === '') {
              mensaje = `
                  <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> Debe seleccionar un cliente para realiziar el pedido.
                      </div>
                  </div>`;
              d.getElementById('notificaciones').innerHTML = mensaje;
              d.getElementById('clientes').focus();
            } else if (d.getElementById('referencia').value === '') {
              mensaje = `
                <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                    <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong> Debe diligenciar un numero de referencia para realiziar el pedido.
                    </div>
                </div>`;
              d.getElementById('notificaciones').innerHTML = mensaje;
              d.getElementById('referencia').focus();
              d.getElementById('ref').classList.add('has-warning');
            } else if (alMenosUnoSeleccionado === false) {
              mensaje = `
                <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                    <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong> Debe seleccionar al menos una opcion de trazabilidad para realiziar el pedido.
                    </div>
                </div>`;
              d.getElementById('notificaciones').innerHTML = mensaje;
              d.getElementById('ref').classList.remove('has-warning');
            } else if (alMenosUnoSeleccionadodetalle === false) {
              mensaje = `
                <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                    <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong> Debe seleccionar al menos un detalle delos parametros seleccionados para realiziar el pedido.
                    </div>
                </div>`;
              d.getElementById('notificaciones').innerHTML = mensaje;
              d.getElementById('ref').classList.remove('has-warning');
            } else if (Usuario_Responable_Plantilla === false) {
              mensaje = `
                <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                    <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong> Debe seleccionar un usaurio responsable para las actividades habilitadas al pedido.
                    </div>
                </div>`;
              d.getElementById('notificaciones').innerHTML = mensaje;
            } else {
              d.getElementById('notificaciones').style.display = 'none';
              d.getElementById('ref').classList.remove('has-warning');

              if (w.confirm('¿Esta seguro de guardar el pedido?')) {
                let cliente = d.getElementById('clientes').value;
                let referencia = d.getElementById('referencia').value;
                let observacion = d.getElementById('observacion').value;
                let USUARIOS = d.getElementsByName('usuario_responsable_plantilla[]');
                let FECHAS = d.getElementsByName('fecha_vencimiento[]');
                let HORAS = d.getElementsByName('hora_vencimiento[]');
                let COSTOS = d.getElementsByName('costo_actividad_plantila[]');

                var nota = datos;
                nota = JSON.stringify(nota);
                var nota_detalle = datos_detalle;
                nota_detalle = JSON.stringify(nota_detalle);

                var posiciones_detalle = Posiciones;
                // posiciones_detalle = JSON.stringify(posiciones_detalle);

                for (let u = 0; u < USUARIOS.length; u++) {
                  const usuarios = USUARIOS[u].getAttribute('data-idusuario');
                  if (usuarios !== null /* && !usuarios_responsable.usuario.includes(usuarios) */) {
                    usuarios_responsable.usuario.push(usuarios);
                  }
                }

                for (let f = 0; f < FECHAS.length; f++) {
                  const fechas = FECHAS[f].value;
                  if (fechas !== '' /* && !usuarios_responsable.fecha.includes(fechas) */) {
                    usuarios_responsable.fecha.push(fechas);
                  }
                }

                for (let h = 0; h < HORAS.length; h++) {
                  const horas = HORAS[h].value;
                  if (horas !== '' /* && !usuarios_responsable.hora.includes(horas) */) {
                    usuarios_responsable.hora.push(horas);
                  }
                }

                for (let g = 0; g < COSTOS.length; g++) {
                  const costos = COSTOS[g].value;
                  if (costos !== '' /* && !usuarios_responsable.costo.includes(costos) */) {
                    usuarios_responsable.costo.push(costos);
                  }
                }

                //Agregar los las posiciones en un solo array
                // Recorrer con base en la longitud de uno de los arrays
                for (let m = 0; m < posiciones_detalle.posicion.length; m++) {
                  const posicion = posiciones_detalle.posicion[m];
                  const valor = posiciones_detalle.valor[m];
                  // Verifica si la posición ya existe en Posiciones
                  if (!usuarios_responsable.posicion.includes(posicion) || !usuarios_responsable.valor.includes(valor)) {
                    usuarios_responsable.posicion.push(posicion);
                    usuarios_responsable.valor.push(valor);
                  }
                }

                var responsable = usuarios_responsable;
                responsable = JSON.stringify(responsable);

                let formdata = new FormData();
                formdata.append('cliente', cliente);
                formdata.append('referencia', referencia);
                formdata.append('observacion', observacion);
                formdata.append('nota', nota);
                formdata.append('nota_detalle', nota_detalle);
                formdata.append('posiciones_detalle', posiciones_detalle);
                formdata.append('usuarios_responsable', responsable);
                formdata.append('nombre_plantilla', d.getElementById('nombre_plantilla').value);
                formdata.append('tipo', tipoSeleccionado);
                formdata.append('configurar_plantilla', 'No');

                try {
                  const response = await fetch($('#id_url_ajax').val() + 'pedidos/Insertar_trazabilidad_pedido', {
                    method: 'POST',
                    body: formdata,
                    cache: 'no-cache',
                  });

                  const data = await response.json();
                  if (data.numero === 200) {
                    // $('#crear_trazabilidad').modal('hide');
                    Swal.fire({
                      title: 'Mensaje',
                      html: data.mensaje,
                      icon: 'success',
                      customClass: {
                        popup: 'swal2-custom-font',
                      },
                    });
                    setTimeout(function() {
                      location.reload(false);
                    }, 1000);
                  } else {
                    // console.error('No se recibieron datos válidos');
                    Swal.fire({
                      title: 'Error',
                      html: data.mensaje,
                      icon: 'error',
                      customClass: {
                        popup: 'swal2-custom-font',
                      },
                    });
                  }
                } catch (error) {
                  console.error('Error en la solicitud:', error);
                } finally {
                  // d.getElementById('loading-overlay-nexosapp').style.display = 'none';
                }
              }
            }
          }
        }
      }
    }

    if (e.target.matches('#btn_esatdo_pedido') || e.target.matches('#btn_esatdo_pedido *')) {
      let idPedido = e.target.getAttribute('data-id');
      d.getElementById('estado_cancelacion').value = idPedido;
      let numdoc = e.target.getAttribute('data-numdoc');
      d.getElementById('numdoc_pedido').value = numdoc;
      let referecnia = e.target.getAttribute('data-referecnia');
      d.getElementById('referencia_pedido').value = referecnia;
      listar_responsables();
    }

    if (e.target.matches('#cancelacion_trazabilidad') || e.target.matches('#cancelacion_trazabilidad *')) {
      Swal.fire({
        title: 'Cancelar Trazabilidad',
        text: '¿Está seguro de continuar?',
        icon: 'question',
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
          if (d.getElementById('motivo_cancelacion').value === '') {
            Swal.fire({
              title: 'Advertencia!',
              text: 'Debe diligenciar un motivo de cancelación del pedido.',
              icon: 'warning',
              customClass: {
                popup: 'swal2-custom-font',
              },
            });
          } else if (d.getElementById('responsable').value === '') {
            Swal.fire({
              title: 'Advertencia!',
              text: 'Debe seleccionar un responsable para el cancelamiento del pedido.',
              icon: 'warning',
              customClass: {
                popup: 'swal2-custom-font',
              },
            });
          } else {
            $('#loading-overlay-nexosapp ').css('display', 'flex');
            let formdata = new FormData();
            formdata.append('estado_cancelacion', d.getElementById('estado_cancelacion').value);
            formdata.append('numdoc', d.getElementById('numdoc_pedido').value);
            formdata.append('referencia', d.getElementById('referencia_pedido').value);
            formdata.append('motivo_cancelacion', d.getElementById('motivo_cancelacion').value);
            formdata.append('responsable_cancelacion', d.getElementById('responsable').value);
            try {
              const response = await fetch($('#id_url_ajax').val() + 'pedidos/insertar_cancelacio_pedido', {
                method: 'POST',
                body: formdata,
                cache: 'no-cache',
              });

              const data = await response.json();
              if (data.status === 200) {
                Swal.fire({
                  title: 'Confirmación!',
                  html: data.mensaje,
                  icon: 'success',
                  customClass: {
                    popup: 'swal2-custom-font',
                  },
                }).then(() => {
                  setTimeout(function() {
                    location.reload(false);
                  }, 500);
                });
              } else {
                console.error('No se recibieron datos válidos');
              }
            } catch (error) {
              console.error('Error en la solicitud:', error);
            } finally {
              $('#loading-overlay-nexosapp ').css('display', 'none');
            }
          }
        }
      });
    }
  });
  console.log('🚀 ~ posiciones:', posiciones);
});

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
        let {id, documento, nombre} = value;
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
            <div class="panel-heading" style="height:30px;display: flex;align-items: center;">
              <h4 class="panel-title">
                <input type="checkbox" id="chk_trazabilidad[]" name="chk_trazabilidad[]" class="chk_trazabilidad" value="${element.id}" style="transform: scale(1.5);margin-right: 5px;margin-bottom:15px;">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse${element.id}">${element.nombre_tipo}</a>
              </h4>
            </div>
            <div id="collapse${element.id}" class="panel-collapse collapse">
              <div class="panel-body">
                <div style="margin-left: 5px;" id="list_detalle${element.id}"></div>
              </div>
            </div>
          </div>
        `;
        d.getElementById('accordion').innerHTML = template;
      });
    });
}

async function Listar_pedidos() {
  // let data = new FormData();
  // data.append('fecha_inicial', fecha_inicio);
  // data.append('fecha_final', fecha_fin);

  await fetch($('#id_url_ajax').val() + 'pedidos/Listar_pedidos', {
    method: 'POST',
    // body: data,
    cache: 'no-cache',
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res)))
    .catch(error => {
      alert(JSON.stringify(error.length) || 'Error al cargar los pedidos');
    })
    .then(response => {
      let tbody = document.getElementById('body_pedidos');
      tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

      response.forEach(element => {
        const fila = document.createElement('tr');

        // Columna Documento
        const columnaNumdoc = document.createElement('td');
        columnaNumdoc.textContent = element.numdoc;
        columnaNumdoc.style.color = '#000000';
        columnaNumdoc.style.width = 'auto';
        columnaNumdoc.style.whiteSpace = 'nowrap';
        columnaNumdoc.style.textAlignLast = 'center';

        // Columna Referencia con enlace
        const columnaReferencia = document.createElement('td');
        columnaReferencia.innerHTML = `<a href="${$('#id_url_ajax').val()}pedidos/detalle/${element.numdoc}/${valores}">${element.referencia}</a>`;
        columnaReferencia.style.color = '#000000';
        columnaReferencia.style.width = 'auto';
        columnaReferencia.style.whiteSpace = 'nowrap';
        // Columna Cliente
        const columnaCliente = document.createElement('td');
        columnaCliente.textContent = element.nombre;
        columnaCliente.style.color = '#000000';
        columnaCliente.style.width = 'auto';
        columnaCliente.style.whiteSpace = 'nowrap';

        // Columna Fecha
        const columnaFecha = document.createElement('td');
        columnaFecha.textContent = element.fecha_creacion + ' - ' + element.hora_creacion;
        columnaFecha.style.color = '#000000';
        columnaFecha.style.width = 'auto';
        columnaFecha.style.whiteSpace = 'nowrap';

        // Columna Estado con etiquetas
        const columnaEstado = document.createElement('td');
        switch (element.estado) {
          case 'ACTIVO':
            columnaEstado.innerHTML = `<span class="label label-success">${element.estado}</span>`;
            break;
          case 'CANCELADO':
            columnaEstado.innerHTML = `<span class="label label-danger">${element.estado}</span>`;
            break;
          case 'EN PROCESO':
            columnaEstado.innerHTML = `<span class="label label-primary">${element.estado}</span>`;
            break;
          case 'FINALIZADO':
            columnaEstado.innerHTML = `<span class="label label-warning">${element.estado}</span>`;
            break;
          case 'INICIADO':
            columnaEstado.innerHTML = `<span class="label label-success">${element.estado}</span>`;
            break;
          default:
            columnaEstado.innerHTML = `<span class="label label-info">${element.estado}</span>`;
            break;
        }
        columnaEstado.style.color = '#000000';
        columnaEstado.style.width = 'auto';
        columnaEstado.style.whiteSpace = 'nowrap';

        const columnaAcciones = document.createElement('td');
        switch (element.estado) {
          case 'ACTIVO':
            columnaAcciones.innerHTML = `<div class="dropdown">
              <button id="dLabel" type="button" class="btn btn-primary btn-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa-solid fa-gear"></i> 
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dLabel">
                <!--<li><a href="#" disabled data-id="ACTIVO" id="btn_esatdo_pedido">ACTIVO</a></li>-->
                <!--<li><a href="#" disabled data-id="EN PROCESO" id="btn_esatdo_pedido">EN PROCESO</a></li>-->
                <li><a href="#" data-id="CANCELADO" data-numdoc="${element.numdoc}" data-referecnia="${element.referencia}" id="btn_esatdo_pedido"  data-toggle="modal" data-hint="" data-target="#cancelar_trazabilidad" ><i class="fa-solid fa-power-off"></i> Cancelar</a></li>
               <!-- <li><a href="#" disabled data-id="FINALIZADO" id="btn_esatdo_pedido">FINALIZADO</a></li>-->
                <!--<li><a href="#" data-id="" id="btn_esatdo_pedido">INICIADO</a></li>-->
                <!--<li><a href="#" disabled data-id="INACTIVO" id="btn_esatdo_pedido">INACTIVO</a></li>-->
              </ul>
            </div>`;
            break;
          case 'CANCELADO':
            columnaAcciones.innerHTML = ``;
            break;
          case 'EN PROCESO':
            columnaAcciones.innerHTML = `<a id="btn_crea" href="#" data-toggle="modal" class="cell-detail  hint--top btn btn-danger btn-xs" data-hint="" data-target="#crear_trazabilidad"><i class="fa-solid fa-power-off"></i> Cancelar</a>`;
            break;
          case 'FINALIZADO':
            columnaAcciones.innerHTML = ``;
            break;
          case 'INICIADO':
            columnaAcciones.innerHTML = `<a id="btn_crea" href="#" data-toggle="modal" class="cell-detail  hint--top btn btn-danger btn-xs" data-hint="" data-target="#crear_trazabilidad"><i class="fa-solid fa-power-off"></i> Cancelar</a>`;
            break;
          default:
            // columnaAcciones.innerHTML = `<a id="btn_crea" href="#" data-toggle="modal" class="cell-detail  hint--top btn btn-danger btn-xs" data-hint="" data-target="#crear_trazabilidad"><i class="fa-solid fa-power-off"></i> Cancelar</a>`;
            break;
        }
        columnaAcciones.style.color = '#000000';
        columnaAcciones.style.width = 'auto';
        columnaAcciones.style.whiteSpace = 'nowrap';

        // Añadir columnas a la fila
        fila.appendChild(columnaNumdoc);
        fila.appendChild(columnaReferencia);
        fila.appendChild(columnaCliente);
        fila.appendChild(columnaFecha);
        fila.appendChild(columnaEstado);
        fila.appendChild(columnaAcciones);

        // Añadir fila al cuerpo de la tabla
        tbody.appendChild(fila);
      });

      // Inicializar o reinicializar DataTable
      if ($.fn.DataTable.isDataTable('#table1')) {
        $('#table1').DataTable().destroy(); // Destruir la instancia previa
      }

      // Inicializar DataTable
      new DataTable('#table1', {
        destroy: true,
        paging: false,
        searching: true,
        ordering: true,
        order: [[0, 'desc']], // Ordenar por la segunda columna (índice 1) en orden ascendente
        info: false,
        responsive: true,
        pageLength: 25,
        // dom: '<"row"<"col-sm-10 custom-search"f><"col-sm-2 text-right"B>>' + '<"row"<"col-sm-12"tr>>',
        // buttons: [
        //   {
        //     extend: 'excelHtml5',
        //     text: '<i class="fa-regular fa-file-excel"></i> Exportar a Excel',
        //     className: 'btn btn-success input-xs',
        //     exportOptions: {
        //       columns: ':visible',
        //       modifier: {page: 'all'}, // Exportar todas las filas
        //     },
        //   },
        // ],
        language: {
          decimal: ',',
          thousands: '.',
          lengthMenu: 'Mostrar _MENU_ registros por página',
          zeroRecords: 'No se encontraron resultados',
          info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
          infoEmpty: 'Mostrando 0 a 0 de 0 registros',
          infoFiltered: '(filtrado de _MAX_ registros totales)',
          search: 'Buscar:',
          paginate: {
            first: 'Primero',
            last: 'Último',
            next: 'Siguiente',
            previous: 'Anterior',
          },
        },
      });
    });
}

function verificarCampo() {
  var valorCampo = $('#referencia').val();
  if (valorCampo.trim() !== '') {
    $.ajax({
      url: $('#id_url_ajax').val() + 'pedidos/validar_numero_referencia',
      type: 'POST',
      dataType: 'json',
      // data: data,
      data: {referencia: valorCampo, cliente: d.getElementById('clientes').value},
      success: function(response) {
        if (response) {
          $('#mensaje_referencia').text('¡Esta referencia ya está registrada.!');
        } else {
          $('#mensaje_referencia').text('');
        }
      },
    });
  } else {
    // Limpiar el Mensaje si el campo está vacío
    $('#mensaje_referencia').text('');
  }
}

async function Listar_actividaes_plantilla(id) {
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
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="checkbox">
              <label>
                <input type="checkbox" class="chk_detalle" id="chk_detalle${element.id}" name="chk_detalle[]"
                  value="${element.id}" data-idvalor="${element.id}" style="transform: scale(1.5);margin-right: 2px;"><span class="position"></span><label style="font-weight: 600;color: #777777;">${element.nombre_opcion}</label>
              </label>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="form-group" style="display:none;" id="form_asignacion${element.id}">
              <!--<label for="usuario_responsable_plantilla${element.id}">Usuario responsable</label>
              <input type="text" class="form-control input-xs usuario_responsable_plantilla" name="usuario_responsable_plantilla[]" id="usuario_responsable_plantilla${element.id}">
              <ul id="searchResults${element.id}" style="  list-style: none;padding: 0;margin: 0;border: 1px solid #ccc;border-radius: 4px;max-height: 150px;overflow-y: auto;"></ul>-->

              <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <label for="usuario_responsable_plantilla${element.id}">Usuario responsable</label>
                    <input type="text" class="form-control input-xs usuario_responsable_plantilla" name="usuario_responsable_plantilla[]" id="usuario_responsable_plantilla${element.id}">
                    <ul id="searchResults${element.id}" style="  list-style: none;padding: 0;margin: 0;border: 1px solid #ccc;border-radius: 4px;max-height: 150px;overflow-y: auto;"></ul>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <label for="costo_actividad_plantila${element.id}">Costo Actividad</label>
                    <input type="number" class="form-control input-xs costo_actividad_plantila" name="costo_actividad_plantila[]" id="costo_actividad_plantila${element.id}">
                  </div>
              </div>

              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <div class="form-group">
                    <label for="fecha_vencimiento${element.id}">Fecha vencimineto</label>
                    <input type="date" class="form-control input-xs" name="fecha_vencimiento[]"
                      id="fecha_vencimiento${element.id}">
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <div class="form-group">
                    <label for="hora_vencimiento${element.id}">Hora vencimineto</label>
                    <input type="time" class="form-control input-xs" name="hora_vencimiento[]"
                      id="hora_vencimiento${element.id}">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
        d.getElementById('list_detalle' + id).innerHTML = template_detalle;
      });
    });
}

function Listado_detalle_actividades_plantilla(nundoc) {
  let data_detalle = new FormData();
  data_detalle.append('nundoc', nundoc);
  return new Promise((resolve, reject) => {
    fetch($('#id_url_ajax').val() + 'pedidos/Listar_actividades_plantilla', {
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

async function listar_responsables() {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'pedidos/listar_responsables', {
      method: 'POST',
      // body: datos,
      cache: 'no-cache',
    });
    const data = await response.json();
    // console.log('🚀 ~ listar_responsables ~ data:', data);
    var html = '<option value="">Seleccionar cliente</option>';
    data.forEach(function(item) {
      html += `<option value="${item.nom_usuario}">${item.user_log} - ${item.nom_usuario}</option>`;
    });
    $('#responsable').html(html);
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    // $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
  }
}
