const d = document;
const w = window;
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
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  Listar_tipos_trazabilidad();

  try {
    // Realizar la solicitud fetch
    const response = await fetch($('#base_url').val() + 'torrecontrol/Listar_proveedores_torre_control', {
      method: 'POST',
      cache: 'no-cache',
    });

    // Convertir la respuesta a JSON
    const data = await response.json();

    // Verificar si hay datos
    if (data.length > 0) {
      // Obtener el elemento <select> (asegúrate de que el ID sea correcto)
      const selectProveedores = document.getElementById('slt_Proveedores'); // Cambia 'selectProveedores' por el ID de tu <select>
      // Limpiar el <select> antes de agregar nuevas opciones (opcional)
      selectProveedores.innerHTML = '<option value="" selected>Seleccione</option>';
      // Recorrer los datos y agregar opciones al <select>
      data.forEach(function (element, index) {
        // Crear un nuevo elemento <option>
        const option = document.createElement('option');
        // Asignar el valor y el texto de la opción
        option.value = element.id; // Usa el valor correcto de tu JSON (por ejemplo, element.id)
        option.textContent = element.razon_social; // Usa el valor correcto de tu JSON (por ejemplo, element.nombre)

        // Agregar la opción al <select>
        selectProveedores.appendChild(option);
      });

    } else {
      console.log("No se encontraron datos.");
      // $('#md-footer-primary').modal('toggle'); // Comentado por ahora
    }
  } catch (error) {
    console.error("Error al cargar los módulos:", error);
    throw error;
  } finally {
    // Ocultar el loading overlay (si lo tienes)
    // document.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }

  $(document).on('change', '.slt_usuario_responsable', function () {
    let resultId = $(this).val(); // Obtener el valor seleccionado
    // let valor_detalle = $(this).find(':selected').data('detalle'); // Suponiendo que tienes un `data-detalle`
    let dato = $(this).attr('data-dato'); // Obtener el ID del select
    let valor_detalle = $(this).attr('data-valor_detalle'); // Obtener el ID del select
    // let resultId = $(this).attr('data-idusuario'); // Obtener el ID del select

    // Verifica que el valor no esté vacío
    if (resultId) {
      // Posiciones.posicion.push('/' + resultId);
      Posiciones.posicion.push(parseInt(dato) + '/' + parseInt(valor_detalle) + '/' + resultId + '/');
      console.log("🚀 Posiciones actualizadas:", Posiciones.posicion);
    }
  });

  $(document).on('change', '.select_detalle', function () {
    let DetalleId = $(this).val(); // Obtener el valor seleccionado
    if (DetalleId) {
      Posiciones.posicion.push(DetalleId); // Agregar nuevo valor
      console.log("🚀 Posiciones actualizadas:", Posiciones.posicion);
    }
  });

  $(document).on('change', '.input_valor', function () {
    let ValorCalculo = $(this).val(); // Obtener el valor seleccionado
    if (ValorCalculo) {
      Posiciones.posicion.push(ValorCalculo); // Agregar nuevo valor
      console.log("🚀 Posiciones actualizadas:", Posiciones.posicion);
    }
  });

  $(document).on('change', '.select_dependiente', function () {
    let Dependencia = $(this).val(); // Obtener el valor seleccionado
    if (Dependencia) {
      Posiciones.posicion.push(Dependencia); // Agregar nuevo valor
      console.log("🚀 Posiciones actualizadas:", Posiciones.posicion);
    }
  });



  d.addEventListener('click', async e => {
    if (e.target.matches("#btn-create-plantilla") || e.target.matches("#btn-create-plantilla *")) {

      // Validar el proveedor
      if (d.getElementById('slt_Proveedores').value === '') {
        Swal.fire({
          title: "Advertencia!",
          text: 'Debe seleccionar un proveedor.',
          icon: "warning",
          draggable: true
        });
      }

      // validar parametros de trazabilidad
      var checkboxes = d.querySelectorAll('.chk_trazabilidad');
      // Verificar si al menos uno está seleccionado
      var alMenosUnoSeleccionado = Array.from(checkboxes).some(checkbox => checkbox.checked);

      var checkboxesdetalle = d.querySelectorAll('.chk_detalle');
      var alMenosUnoSeleccionadodetalle = Array.from(checkboxesdetalle).some(checkbox => checkbox.checked);

      var UsuarioResponsable = d.querySelectorAll('.slt_usuario_responsable');
      var Usuario_Responable = Array.from(UsuarioResponsable).some(usuario => $(usuario).val());

      var SelectDestalle = d.querySelectorAll('.select_detalle');
      var DetalleFecha = Array.from(SelectDestalle).some(detalle => $(detalle).val());

      var ValorDetalle = d.querySelectorAll('.input_valor');
      var DetalleValorFecha = Array.from(ValorDetalle).some(valor => $(valor).val());

      var SelectDependiente = d.querySelectorAll('.select_dependiente');
      var SelectDependencia = Array.from(SelectDependiente).some(dependiente => $(dependiente).val());

      if (alMenosUnoSeleccionado === false) {
        Swal.fire({
          title: "Advertencia!",
          text: 'Debe seleccionar al menos una opcion de trazabilidad para realiziar el pedido.',
          icon: "warning",
          draggable: true
        });
      } else if (alMenosUnoSeleccionadodetalle === false) {
        Swal.fire({
          title: "Advertencia!",
          text: ' Debe seleccionar al menos un detalle delos parametros seleccionados para realiziar el pedido.',
          icon: "warning",
          draggable: true
        });
      } else if (Usuario_Responable === false) {
        Swal.fire({
          title: "Advertencia!",
          text: 'Debe seleccionar un usaurio responsable para las actividades habilitadas al pedido.',
          icon: "warning",
          draggable: true
        });
      } else if (DetalleFecha === false) {
        Swal.fire({
          title: "Advertencia!",
          text: 'Debe seleccionar una opcion para la fecha de calculo.',
          icon: "warning",
          draggable: true
        });
      } else if (DetalleValorFecha === false) {
        Swal.fire({
          title: "Advertencia!",
          text: 'Debe ingresar un valor para la fecha de calculo de vencimineto.',
          icon: "warning",
          draggable: true
        });
      } else if (SelectDependencia === false) {
        Swal.fire({
          title: "Advertencia!",
          text: 'Debe elegir si la dependencia es si o no.',
          icon: "warning",
          draggable: true
        });
      }
      else if (d.getElementById('nombre_plantilla').value === '') {
        Swal.fire({
          title: "Advertencia!",
          text: 'Debe indicar un nombre para la plantilla.',
          icon: "warning",
          draggable: true
        });
      }

      let tipos = d.getElementsByName('chk_trazabilidad[]');
      let detalles = d.getElementsByName('chk_detalle[]');
      // let USUARIOS = d.getElementsByName('slt_usuario_responsable[]');

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
      console.log("🚀 ~ nota:", nota)

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
      console.log("🚀 ~ nota_detalle:", nota_detalle)

      var posiciones_detalle = Posiciones;
      console.log("🚀 ~ posiciones_detalle:", posiciones_detalle)
      // posiciones_detalle = JSON.stringify(posiciones_detalle);

      // for (let u = 0; u < USUARIOS.length; u++) {
      //   const usuarios = USUARIOS[u].getAttribute('data-idusuario');
      //   if (usuarios !== null /* && !usuarios_responsable.usuario.includes(usuarios) */) {
      //     usuarios_responsable.usuario.push(usuarios);
      //   }
      // }

      // var responsable = usuarios_responsable;
      // responsable = JSON.stringify(responsable);
      // console.log("🚀 ~ responsable:", responsable)
    }
  });


});

async function Listar_tipos_trazabilidad() {
  await fetch($('#base_url').val() + 'pedidos/Listar_tipos_Seguimiento', {
    method: 'POST',
    cache: 'no-cache',
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res)))
    .catch(error => {
      alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
    })
    .then(response => {
      let template = '<div class="accordion" id="accordionExample">';
      response.forEach((element, index) => {
        template += `
          <div class="accordion-item">
            <h2 class="accordion-header d-flex align-items-center" id="heading${index}">
              <input type="checkbox" id="chk_trazabilidad${index}" name="chk_trazabilidad[]" 
                class="chk_trazabilidad me-2" value="${element.id}" 
                style="transform: scale(1.5); margin-right: 10px;" 
                data-bs-toggle="collapse" 
                data-bs-target="#collapse${element.id}" 
                aria-expanded="false" 
                aria-controls="collapse${element.id}">

              <button class="accordion-button collapsed" type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#collapse${element.id}" 
                aria-expanded="false" 
                aria-controls="collapse${element.id}">
                ${element.nombre_tipo}
              </button>
            </h2>

            <div id="collapse${element.id}" class="accordion-collapse collapse" 
              aria-labelledby="heading${element.id}" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <div id="list_detalle${element.id}"></div>
              </div>
            </div>
          </div>
        `;
      });
      template += '</div>';
      document.getElementById('accordionExample').innerHTML = template;
    });

  document.addEventListener('change', async function (e) {
    if (e.target.matches('.chk_trazabilidad')) {
      let valor = e.target.value;
      let collapseElement = document.getElementById('collapse' + valor);
      let bsCollapse = new bootstrap.Collapse(collapseElement);

      if (e.target.checked) {
        bsCollapse.show();
        // document.getElementById('parametros').style.display = 'block';
        let data = new FormData();
        data.append('id', valor);
        await fetch($('#base_url').val() + 'pedidos/Listar_Opciones', {
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
            const hoy = new Date();
            const fechaHoy = hoy.toISOString().split('T')[0];
            response.forEach(element => {
              template_detalle += `
                <div class="row">
                  <div class="col-12 d-flex align-items-center">
                    <div class="checkbox">
                      <div class="form-check form-switch">
                        <input class="form-check-input chk_detalle" type="checkbox" id="chk_detalle${element.id}" name="chk_detalle[]" value="${element.id}" data-idvalor="${element.id}" />
                        <label class="form-check-label me-2" for="chk_detalle${element.id}">${element.nombre_opcion}</label>
                      </div>
                    </div>
                    <select class="form-select form-select-sm ms-2 select_detalle" id="select_detalle${element.id}" name="select_detalle[]" style="width: 200px;" disabled>
                      <option value="">Fecha Calculo</option>
                      <option value="1">Fecha Inicial</option>
                      <option value="2">Fecha Archivo Cargue</option>
                      <option value="3">Fecha Cita</option>
                    </select>
                    <input type="number" class="form-control ms-2 form-control-sm input_valor" id="input_valor${element.id}" name="input_valor[]" placeholder="Valor" style="width: 100px;">
                    <select class="form-select form-select-sm ms-2 select_dependiente" id="select_dependiente${element.id}" name="select_dependiente[]" style="width: 200px;" disabled>
                      <option value="">Dependiente</option>
                      <option value="Si">Si</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <hr class="my-1 text-dark">
                  </div>
                  <div class="col-12">
                    <div class="form-group" style="display:none;" id="form_asignacion${element.id}">
                      <div class="row">
                        <div class="col-md-12">
                          <label for="usuario_responsable${element.id}"style="font-size: 12px;">Usuario responsable</label>
                          <select class="form-select form-select-sm select2 slt_usuario_responsable" name="slt_usuario_responsable[]" id="slt_usuario_responsable${element.id}" style="width:100%;font-size: 10px !important;"></select>
                        </div>
                        <div class="col-12">
                          <hr class="my-1 text-dark">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              `;
              document.getElementById('list_detalle' + valor).innerHTML = template_detalle;
            });
          });
      } else {
        bsCollapse.hide();
        document.getElementById('list_detalle' + valor).innerHTML = '';
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
        if (checkbox.checked) {
          contador++;
          checkbox.setAttribute('data-idposicion', contador);

          // Crear un contenedor para el número y el texto
          const listItem = d.createElement('div');
          const puesto = d.createElement('span');
          puesto.textContent = contador;
          puesto.style.fontWeight = 'bold';

          let select = document.getElementById('select_detalle' + Id); // Seleccionar el select asociado
          let selectDependiente = document.getElementById('select_dependiente' + Id); // Seleccionar el select asociado

          if (e.target.checked) {
            select.disabled = false; // Habilitar select
            selectDependiente.disabled = false; // Habilitar select
          } else {
            select.disabled = true;
            select.value = ''; // Deshabilitar y resetear select
            selectDependiente.disabled = true;
            selectDependiente.value = ''; // Deshabilitar y resetear select
          }
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
          // Posiciones.valor.push(valor_detalle);

          /* Buscar usuario responsable para la actividad */
          $.post(
            $('#base_url').val() + 'torrecontrol/Buscar_usuario',
            function (data) {
              const selectId = '#slt_usuario_responsable' + Id;
              const selectProveedores = document.querySelector(selectId);

              if (!selectProveedores) {
                console.error("❌ El select no se encontró. Verifica el ID:", selectId);
                return;
              }

              // Limpiar el select antes de agregar nuevas opciones
              selectProveedores.innerHTML = '<option value="" selected>Seleccione</option>';
              selectProveedores.setAttribute('data-idusuario', '');
              selectProveedores.setAttribute('data-dato', parseInt(dato[0]));
              selectProveedores.setAttribute('data-valor_detalle', parseInt(valor_detalle));


              // Recorrer los datos y agregar opciones al select
              data.forEach(function (element) {
                const option = document.createElement('option');
                option.value = element.id;
                option.textContent = element.nom_usuario;
                // selectProveedores.setAttribute('data-idusuario', element.id);
                selectProveedores.appendChild(option);
              });

              // Forzar la inicialización de select2 después de agregar opciones
              $(selectId).select2({
                placeholder: "Seleccione",
                allowClear: true
              }).trigger('change'); // Asegurar que los valores se reflejen correctamente

              // console.log("✅ Select2 inicializado en:", selectId);
            },
            'json'
          );

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
      }
    }

    function updateCounter() {
      counterElement.textContent = "Cantidad de actividades: " + secondaryList.children.length;
      counterElement.style.fontSize = "12px";
    }
  });
}

