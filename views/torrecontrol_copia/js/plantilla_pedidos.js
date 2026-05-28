window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  sessionStorage.clear();
  window.VENTANA = id; // Asigna el ID recibido a la variable global

  window.datos_detalle = {
    detalle: [],
  };

  window.usuarios_responsable = {
    usuario: [],
    fecha: [],
    hora: [],
    costo: [],
    posicion: [],
    valor: [],
  };

  window.contador = 0;

  window.Posiciones = {
    posicion: [],
    valor: [],
  };

  // Crear instancia
  // Usar una variable global o una propiedad en el objeto window
  // if (!window.myOffcanvas) {
  //   window.myOffcanvas = new DynamicOffcanvas({
  //     id: `customOffcanvas${id}`,
  //     title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
  //     content: '<p>Contenido inicial</p>',
  //     scroll: true,
  //     backdrop: false
  //   });
  // } else {
  //   console.log('El offcanvas ya está creado.');
  // }

  Listar_proveedores();
  Listar_tipos_trazabilidad();
  // Inicializar sessionStorage si no existe
  if (!sessionStorage.getItem("ListadoActividaesSeleccionadas")) {
    sessionStorage.setItem("ListadoActividaesSeleccionadas", JSON.stringify([]));
  }

  $(document).on('change', '.select_detalle', function () {
    let resultId = $(this).val(); // Obtener el valor seleccionado
    // Verifica que el valor no esté vacío
    let Id = $(this).attr('data-ElementId');
    let selectDepende = document.getElementById('select_depende_' + Id); // Seleccionar el select asociado
    if (resultId === '4') {
      selectDepende.disabled = false; // Habilitar select
    } else {
      selectDepende.disabled = true; // Habilitar select
    }
  });
  let contadorFilas = 1;
  document.addEventListener('click', async e => {

    if (e.target.matches("#btn-create-plantilla") || e.target.matches("#btn-create-plantilla *")) {
      // Validar el proveedor
      if (document.getElementById('slt_Proveedores').value === '') {
        Swal.fire({
          title: "Advertencia!",
          text: 'Debe seleccionar un proveedor.',
          icon: "warning",
          draggable: true
        });
      }
      if (document.getElementById('slt_Modalidad').value === '') {
        Swal.fire({
          title: "Advertencia!",
          text: 'Debe seleccionar una modalidad de trazabilidad.',
          icon: "warning",
          draggable: true
        });
      }

      // validar parametros de trazabilidad
      var checkboxes = document.querySelectorAll('.chk_trazabilidad');
      // Verificar si al menos uno está seleccionado
      var alMenosUnoSeleccionado = Array.from(checkboxes).some(checkbox => checkbox.checked);

      var checkboxesdetalle = document.querySelectorAll('.chk_detalle');
      var alMenosUnoSeleccionadodetalle = Array.from(checkboxesdetalle).some(checkbox => checkbox.checked);

      var UsuarioResponsable = document.querySelectorAll('.slt_usuario_responsable');
      var Usuario_Responable = Array.from(UsuarioResponsable).some(usuario => $(usuario).val());

      var SelectDestalle = document.querySelectorAll('.select_detalle');
      var DetalleFecha = Array.from(SelectDestalle).some(detalle => $(detalle).val());

      var ValorDetalle = document.querySelectorAll('.input_valor');
      var DetalleValorFecha = Array.from(ValorDetalle).some(valor => $(valor).val());

      // var SelectDependiente =document.querySelectorAll('.select_dependiente');
      // var SelectDependencia = Array.from(SelectDependiente).some(dependiente => $(dependiente).val());

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
      } //else if (SelectDependencia === false) {
      //   Swal.fire({
      //     title: "Advertencia!",
      //     text: 'Debe elegir si la dependencia es si o no.',
      //     icon: "warning",
      //     draggable: true
      //   });
      // }
      else if (document.getElementById('nombre_plantilla').value === '') {
        Swal.fire({
          title: "Advertencia!",
          text: 'Debe indicar un nombre para la plantilla.',
          icon: "warning",
          draggable: true
        });
      }

      let tipos = document.getElementsByName('chk_trazabilidad[]');

      const datos_parametros = {
        tipo: [],
      };
      for (var i = 0; i < tipos.length; i++) {
        var checkbox = tipos[i];
        if (checkbox.checked) {
          var tipo_traz = tipos[i].value;
          datos_parametros.tipo.push(tipo_traz);
        } else {
          datos_parametros.tipo.splice(i, 1); // Elimina el elemento no seleccionado
        }
      }
      var nota = datos_parametros;
      nota = JSON.stringify(nota);

      const rows = document.querySelectorAll('[class^="row trazabilidad_detalle_"]');
      const datos = [];

      rows.forEach(row => {
        const checkbox = row.querySelector('.chk_detalle');
        if (checkbox.checked) {
          const selectDetalle = row.querySelector('.select_detalle');
          const data = {
            id: checkbox?.dataset.idvalor,
            usuario_responsable: row.querySelector('.slt_usuario_responsable')?.value,
            select_detalle: selectDetalle?.value,
            Posicion_avtividad: checkbox?.dataset.idposicion,
            input_valor: row.querySelector('.input_valor')?.value,
            medida_tiempo: row.querySelector('.select_medida_tiempo')?.value,
            select_depende: row.querySelector('.select_depende_')?.value,
            costo_sugerido: row.querySelector('.costo_sugerido')?.value
            // personas_visualizar: Array.from(row.querySelector('.personas_visualizar')?.selectedOptions || []).map(opt => opt.value),
            // actividades_visualizar: Array.from(row.querySelector('.actividades_visualizar')?.selectedOptions || []).map(opt => opt.value)
          };
          datos.push(data);
        }
      });

        const personasVisualizar = document.querySelectorAll('.personas_visualizar');
        const actividadesVisualizar = document.querySelectorAll('.actividades_visualizar');

        let datosVisualizadores = [];

        for (let i = 0; i < personasVisualizar.length; i++) {
          const usuarioId = personasVisualizar[i].value;
          const actividades = Array.from(actividadesVisualizar[i].selectedOptions).map(opt => opt.value);

          if (usuarioId && actividades.length > 0) {
            datosVisualizadores.push({
              usuario_id: usuarioId,
              actividades: actividades
            });
          }
        }

      const result = await Swal.fire({
        title: "Seguro",
        text: "¿Estás seguro de crear la plantilla?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3B71CA",
        cancelButtonColor: "#9FA6B2",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        customClass: {
          popup: "swal2-custom-font",
        },
      });

      // Aquí puedes enviar los datos a tu backend
      if (result.isConfirmed) {
        let dato = new FormData();
        dato.append('proveedor_id', document.getElementById('slt_Proveedores').value);
        dato.append('modalidad', document.getElementById('slt_Modalidad').value);
        dato.append('nombre_plantilla', document.getElementById('nombre_plantilla').value);
        dato.append('datos', JSON.stringify(datos));
        dato.append('visualizadores', JSON.stringify(datosVisualizadores));
        dato.append('nota', nota);
        try {
          const response = await fetch($('#base_url').val() + 'torrecontrol/Crear_plantillas', {
            method: 'POST',
            body: dato,
            cache: 'no-cache',
          });
          const data = await response.json();

          const icono = data.numero === 200 ? 'success' : data.numero === 305 ? 'warning' : 'error';
          const titulo = data.numero === 200 ? 'Mensaje' : data.numero === 305 ? 'Advertencia' : 'Error';

          Swal.fire({
            title: titulo,
            html: data.mensaje || data,
            icon: icono,
            customClass: { popup: 'swal2-custom-font' },
          });

          if (data.numero === 200) {
            setTimeout(() => {
              sessionStorage.clear();
              location.reload(false);
            }, 1000);
          }

        } catch (error) {
          throw error;
        } finally {
          //document.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
        }
      }
    }
    
    if (e.target.matches("#btn-agregar-fila") || e.target.closest("#btn-agregar-fila")) {
      const tbody = document.getElementById("tbody_visualizadores");

      const nuevaFila = document.createElement("tr");
      nuevaFila.innerHTML = `
        <td>${contadorFilas}</td>
        <td style="width: auto; white-space: nowrap;">
          <select class="form-select form-select-sm personas_visualizar" name="personas_visualizar[]" style="width: 100%;"></select>
        </td>
        <td>
          <select class="form-select form-select-sm actividades_visualizar" name="actividades_visualizar[]" multiple style="width: 100%;"></select>
        </td>
        <td style="width: auto; white-space: nowrap;">
          <button type="button" class="btn btn-subtle-danger btn-sm me-1 px-1 py-0 btn-eliminar-fila">
            <span class="uil uil-trash"></span> Eliminar
          </button>
        </td>
      `;

      tbody.appendChild(nuevaFila);
      contadorFilas++;

      // === ACTIVIDADES ===
      const actividadesList = JSON.parse(sessionStorage.getItem("ListadoActividaesSeleccionadas")) || [];
      const selectActividades = nuevaFila.querySelector(".actividades_visualizar");

      selectActividades.innerHTML = '<option value="">Seleccione una actividad</option>';
      actividadesList.forEach((actividad) => {
        const option = document.createElement("option");
        option.value = actividad.id;
        option.textContent = actividad.texto;
        selectActividades.appendChild(option);
      });

      $(selectActividades).select2({
        placeholder: "Seleccione Dependencia",
        allowClear: true
      });

      // === USUARIOS ===
      const selectPersonas = nuevaFila.querySelector(".personas_visualizar");

      // Suplanta con tus propios datos si es necesario
      const dato = [1]; // puede venir de otro lado
      const valor_detalle = 123;

      $.post(
        $('#base_url').val() + 'torrecontrol/Buscar_usuario',
        function (data) {
          selectPersonas.innerHTML = '<option value="">Seleccione</option>';
          selectPersonas.setAttribute('data-idusuario', '');
          selectPersonas.setAttribute('data-dato', parseInt(dato[0]));
          selectPersonas.setAttribute('data-valor_detalle', parseInt(valor_detalle));

          data.forEach(function (element) {
            const option = document.createElement('option');
            option.value = element.id;
            option.textContent = element.nom_usuario;
            selectPersonas.appendChild(option);
          });

          $(selectPersonas).select2({
            placeholder: "Seleccione Visualizador de Actividad",
            allowClear: true
          });
        },
        'json'
      );
    }

    if (e.target.matches(".btn-eliminar-fila") || e.target.closest(".btn-eliminar-fila")) {
      e.target.closest("tr").remove();
    }
  });

};

// async function Listar_tipos_trazabilidad() {
//   await fetch($('#base_url').val() + 'pedidos/Listar_tipos_Seguimiento', {
//     method: 'POST',
//     cache: 'no-cache',
//   })
//     .then(res => (res.ok ? res.json() : Promise.reject(res)))
//     .catch(error => {
//       alert(JSON.stringify(error.length) || 'Error al cargar los tipos de trazabilidad');
//     })
//     .then(response => {
//       let template = '<div class="accordion" id="accordionExample">';
//       response.forEach((element, index) => {
//         template += `
//           <div class="accordion-item">
//             <h2 class="accordion-header d-flex align-items-center" id="heading${index}">
//               <input type="checkbox" id="chk_trazabilidad${index}" name="chk_trazabilidad[]" 
//                 class="chk_trazabilidad me-2" value="${element.id}" 
//                 style="transform: scale(1.5); margin-right: 10px;" 
//                 data-bs-toggle="collapse" 
//                 data-bs-target="#collapse${element.id}" 
//                 aria-expanded="false" 
//                 aria-controls="collapse${element.id}">

//               <button class="accordion-button collapsed" type="button" 
//                 data-bs-toggle="collapse" 
//                 data-bs-target="#collapse${element.id}" 
//                 aria-expanded="false" 
//                 aria-controls="collapse${element.id}">
//                 ${element.nombre_tipo}
//               </button>
//             </h2>

//             <div id="collapse${element.id}" class="accordion-collapse collapse" 
//               aria-labelledby="heading${element.id}" data-bs-parent="#accordionExample">
//               <div class="accordion-body">
//                 <div id="list_detalle${element.id}"></div>
//               </div>
//             </div>
//           </div>
//         `;
//       });
//       template += '</div>';
//       document.getElementById('accordionExample').innerHTML = template;
//     });

//   document.addEventListener('change', async function (e) {
//     if (e.target.matches('.chk_trazabilidad')) {
//       let valor = e.target.value;
//       let collapseElement = document.getElementById('collapse' + valor);
//       let bsCollapse = new bootstrap.Collapse(collapseElement);

//       if (e.target.checked) {
//         bsCollapse.show();
//         // document.getElementById('parametros').style.display = 'block';
//         let data = new FormData();
//         data.append('id', valor);
//         await fetch($('#base_url').val() + 'pedidos/Listar_Opciones', {
//           method: 'POST',
//           cache: 'no-cache',
//           body: data,
//         })
//           .then(res => (res.ok ? res.json() : Promise.reject(res)))
//           .catch(error => {
//             alert(JSON.stringify(error.length) || 'Error al cargar tipo de detalle');
//           })
//           .then(response => {
//             let template_detalle = '';
//             response.forEach(element => {
//               template_detalle += `
//                 <div class="row trazabilidad_detalle_">
//                   <div class="col-12 d-flex align-items-center">
//                     <div class="checkbox">
//                       <div class="form-check form-switch">
//                         <input class="form-check-input chk_detalle" type="checkbox" id="chk_detalle${element.id}" name="chk_detalle[]" value="${element.id}" data-idvalor="${element.id}" />
//                         <label class="form-check-label me-2" for="chk_detalle${element.id}">${element.nombre_opcion}</label>
//                       </div>
//                     </div>
//                     <div class="col-12 col-sm-12 col-md-9 col-lg-9 col-xl-9 col-xxl-9" style="display:none;" id="form_asignacion${element.id}">
//                         <select class="form-select form-select-sm select2 slt_usuario_responsable" name="slt_usuario_responsable[]" id="slt_usuario_responsable${element.id}" style="width:100%;"></select>
//                     </div>
//                   </div>
//                   <div class="col-12">
//                     <hr class="my-1 text-dark">
//                   </div>
//                   <div class="row">
//                     <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
//                       <select class="form-select form-select-sm ms-2 select_detalle" id="select_detalle${element.id}" name="select_detalle[]" data-ElementId="${element.id}" style="width: 100%;" disabled>
//                         <option value="">Fecha Calculo</option>
//                         <option value="1">Fecha Inicial</option>
//                         <option value="2">Fecha Actividad dependiente</option>
//                       </select>
//                     </div>
//                     <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
//                       <input type="text" class="form-control ms-2 form-control-sm input_valor" id="input_valor${element.id}" name="input_valor[]" style="width: 100%;" disabled>
//                     </div>
//                     <!--<div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
//                       <select class="form-select form-select-sm ms-2 select_dependiente" id="select_dependiente${element.id}" name="select_dependiente[]" data-ElementId="${element.id}" style="width: 100%;" disabled>
//                         <option value="">Dependiente</option>
//                         <option value="SI">Si</option>
//                         <option value="NO">No</option>
//                       </select>
//                     </div>-->
//                     <div class="col-12 col-sm-12 col-md-7 col-lg-7 col-xl-7 col-xxl-7">
//                       <select class="form-select form-select-sm ms-2 select_depende_" id="select_depende_${element.id}" name="select_depende_[]" style="width: 100%;" disabled></select>
//                     </div>

//                     <div class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mt-2">
//                       <select class="form-select form-select-sm ms-2 personas_visualizar" id="personas_visualizar${element.id}" name="personas_visualizar[]" multiple="multiple" style="width: 100%;"></select>
//                     </div>

//                     <div class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mt-2">
//                       <select class="form-select form-select-sm ms-2 actividades_visualizar" id="actividades_visualizar${element.id}" name="actividades_visualizar[]" multiple="multiple" style="width: 100%;"></select>
//                     </div>

//                     <div class="col-12">
//                       <hr class="my-1 text-dark">
//                     </div>
//                   </div>
//                 </div>
//               `;
//               document.getElementById('list_detalle' + valor).innerHTML = template_detalle;
//             });
//           });
//       } else {
//         bsCollapse.hide();
//         document.getElementById('list_detalle' + valor).innerHTML = '';
//       }
//     }

//     const secondaryList = document.getElementById('secondaryList');
//     const counterElement = document.getElementById('posicion');

//     if (e.target.matches('.chk_detalle') || e.target.matches('.chk_detalle *')) {
//       // Asegúrate de que Posiciones.posicion esté inicializado
//       if (!Posiciones.posicion) {
//         Posiciones.posicion = [];
//       }

//       let padre = e.target.parentElement.parentElement;
//       let checkDetalle = padre.querySelectorAll('.chk_detalle');
//       for (let i = 0; i < checkDetalle.length; i++) {
//         var checkbox = checkDetalle[i];
//         var valor_detalle = checkDetalle[i].value;

//         var texto = checkDetalle[i].parentElement.textContent;
//         // console.log("🚀 ~ texto:", texto.trim());
//         let Id = checkbox.getAttribute('data-idvalor');
//         if (checkbox.checked) {
//           contador++;
//           checkbox.setAttribute('data-idposicion', contador);

//           // Crear un contenedor para el número y el texto
//           const listItem = document.createElement('div');
//           const puesto = document.createElement('span');
//           puesto.textContent = contador;
//           puesto.style.fontWeight = 'bold';

//           let select = document.getElementById('select_detalle' + Id); // Seleccionar el select asociado
//           // let selectDependiente = document.getElementById('select_dependiente' + Id); // Seleccionar el select asociado
//           // let selectDepende = document.getElementById('select_depende_' + Id); // Seleccionar el select asociado
//           let InputValor = document.getElementById('input_valor' + Id); // Seleccionar el select asociado

//           if (e.target.checked) {
//             select.disabled = false; // Habilitar select
//             // selectDependiente.disabled = false; // Habilitar select
//             // selectDepende.disabled = false; // Habilitar select
//             InputValor.disabled = false; // Habilitar select
//           } else {
//             select.disabled = true;
//             select.value = ''; // Deshabilitar y resetear select
//             InputValor.disabled = true;
//           }

//           listItem.setAttribute('id', 'puesto_id' + Id);
//           // Agregar el número al contenedor
//           listItem.appendChild(puesto);

//           // Agregar el texto al contenedor
//           const textoElement = document.createElement('span');
//           textoElement.textContent = texto;

//           // // 1. Obtener el array actual guardado en sessionStorage (si existe)
//           // let actividades = JSON.parse(sessionStorage.getItem("ListadoActividaesSeleccionadas")) || [];

//           // // 2. Agregar el nuevo texto al array (evitar duplicados si quieres)
//           // actividades.push(texto.trim(), Id.trim());

//           // // 3. Guardar el nuevo array actualizado en sessionStorage
//           // sessionStorage.setItem("ListadoActividaesSeleccionadas", JSON.stringify(actividades));

//           let actividades = JSON.parse(sessionStorage.getItem("ListadoActividaesSeleccionadas")) || [];

//           actividades.push({
//             id: Id.trim(),
//             texto: texto.trim()
//           });

//           sessionStorage.setItem("ListadoActividaesSeleccionadas", JSON.stringify(actividades));



//           listItem.appendChild(textoElement);
//           // Agrega el elemento div con el título y el número al contenedor principal
//           secondaryList.appendChild(listItem);
//           // Modificación: Concatena el Id al final del string del ID
//           const formId = 'form_asignacion' + Id;
//           document.getElementById(formId).style.display = '';
//           // Agrega la posición al array
//           var posicion_array = puesto.parentElement.textContent;
//           var dato = posicion_array.split(' ');
//           // Actualiza el contador
//           updateCounter();

//           /* Buscar usuario responsable para la actividad */
//           $.post(
//             $('#base_url').val() + 'torrecontrol/Buscar_usuario',
//             function (data) {
//               const selectId = '#slt_usuario_responsable' + Id;
//               const selectProveedores = document.querySelector(selectId);

//               if (!selectProveedores) {
//                 console.error("❌ El select no se encontró. Verifica el ID:", selectId);
//                 return;
//               }

//               // Limpiar el select antes de agregar nuevas opciones
//               selectProveedores.innerHTML = '<option value="" selected>Seleccione</option>';
//               selectProveedores.setAttribute('data-idusuario', '');
//               selectProveedores.setAttribute('data-dato', parseInt(dato[0]));
//               selectProveedores.setAttribute('data-valor_detalle', parseInt(valor_detalle));

//               // Recorrer los datos y agregar opciones al select
//               data.forEach(function (element) {
//                 const option = document.createElement('option');
//                 option.value = element.id;
//                 option.textContent = element.nom_usuario;
//                 // selectProveedores.setAttribute('data-idusuario', element.id);
//                 selectProveedores.appendChild(option);
//               });

//               // Forzar la inicialización de select2 después de agregar opciones
//               $(selectId).select2({
//                 placeholder: "Seleccione Responsable",
//                 allowClear: true
//               }).trigger('change'); // Asegurar que los valores se reflejen correctamente

//               // console.log("✅ Select2 inicializado en:", selectId);
//             },
//             'json'
//           );

//           $.post(
//             $('#base_url').val() + 'torrecontrol/Buscar_usuario',
//             function (data) {
//               const selectId = '#personas_visualizar' + Id;
//               const selectProveedores = document.querySelector(selectId);

//               if (!selectProveedores) {
//                 console.error("❌ El select no se encontró. Verifica el ID:", selectId);
//                 return;
//               }

//               // Limpiar el select antes de agregar nuevas opciones
//               selectProveedores.innerHTML = '<option value="" selected>Seleccione</option>';
//               selectProveedores.setAttribute('data-idusuario', '');
//               selectProveedores.setAttribute('data-dato', parseInt(dato[0]));
//               selectProveedores.setAttribute('data-valor_detalle', parseInt(valor_detalle));

//               // Recorrer los datos y agregar opciones al select
//               data.forEach(function (element) {
//                 const option = document.createElement('option');
//                 option.value = element.id;
//                 option.textContent = element.nom_usuario;
//                 selectProveedores.appendChild(option);
//               });

//               // Forzar la inicialización de select2 después de agregar opciones
//               $(selectId).select2({
//                 placeholder: "Seleccione Visualizador de Actividad",
//                 allowClear: true
//               }).trigger('change'); // Asegurar que los valores se reflejen correctamente

//               // console.log("✅ Select2 inicializado en:", selectId);
//             },
//             'json'
//           );

//           /* Listar activiades para la dependencia */
//           // $.post(
//           //   $('#base_url').val() + 'torrecontrol/Listar_activides_dependencia',
//           //   function (data) {
//           //     const selectId = '#select_depende_' + Id;
//           //     const selectActviaddesDependientes = document.querySelector(selectId);

//           //     if (!selectActviaddesDependientes) {
//           //       console.error("❌ El select no se encontró. Verifica el ID:", selectId);
//           //       return;
//           //     }

//           //     // Limpiar el select antes de agregar nuevas opciones
//           //     selectActviaddesDependientes.innerHTML = '<option value="" selected>Seleccione</option>';

//           //     // Recorrer los datos y agregar opciones al select
//           //     data.forEach(function (element) {
//           //       const option = document.createElement('option');
//           //       option.value = element.id;
//           //       option.textContent = element.nombre_opcion;
//           //       selectActviaddesDependientes.appendChild(option);
//           //     });

//           //     // Forzar la inicialización de select2 después de agregar opciones
//           //     $(selectId).select2({
//           //       placeholder: "Seleccione Dependencia",
//           //       allowClear: true
//           //     }).trigger('change'); // Asegurar que los valores se reflejen correctamente

//           //     // console.log("✅ Select2 inicializado en:", selectId);
//           //   },
//           //   'json'
//           // );

//           // Obtener las actividades del sessionStorage para asociar con las personas para visualizar
//           const actividadesList = JSON.parse(sessionStorage.getItem("ListadoActividaesSeleccionadas")) || [];
//           const selectList = document.getElementById("actividades_visualizar" + Id);
//           const selectId = '#select_depende_' + Id;

//           const selectActviaddesDependientes = document.querySelector(selectId);
//           // Limpiar el select (excepto el primer option)
//           selectActviaddesDependientes.innerHTML = '<option value="">Seleccione una actividad</option>';

//           // Recorrer y agregar cada actividad como opción
//           actividadesList.forEach((actividad, index) => {
//             console.log(actividad);

//             const option = document.createElement("option");
//             option.value = actividad.id;
//             option.textContent = actividad.texto;
//             selectActviaddesDependientes.appendChild(option);
//           });

//           // Forzar la inicialización de select2 después de agregar opciones
//           $(selectActviaddesDependientes).select2({
//             placeholder: "Seleccione Dependencia",
//             allowClear: true
//           }).trigger('change'); // Asegurar que los valores se reflejen correctamente


//           // Limpiar el select (excepto el primer option)
//           selectList.innerHTML = '<option value="">Seleccione una actividad</option>';

//           // Recorrer y agregar cada actividad como opción
//           actividadesList.forEach((actividad, index) => {
//             const option = document.createElement("option");
//             option.value = actividad.id;
//             option.textContent = actividad.texto;
//             selectList.appendChild(option);
//           });

//           // Forzar la inicialización de select2 después de agregar opciones
//           $(selectList).select2({
//             placeholder: "Seleccione Dependencia",
//             allowClear: true
//           }).trigger('change'); // Asegurar que los valores se reflejen correctamente

//         } else {
//           const formId = 'form_asignacion' + Id;
//           document.getElementById(formId).style.display = 'none';

//           const PuestoId = 'puesto_id' + Id;
//           document.getElementById(PuestoId).style.display = 'none';

//           var posicion_eliminar = checkbox.getAttribute('data-idposicion');
//           var indice = Posiciones.posicion.indexOf(parseInt(posicion_eliminar));
//           if (indice !== -1) {
//             // El elemento existe en el array, ahora puedes eliminarlo usando splice
//             // console.log('El elemento existe en el array en el índice: ' + indice);
//             Posiciones.posicion.splice(indice, 1);
//             contador--;
//             updateCounter();
//           } else {
//             // console.log('El elemento no existe en el array');
//             Posiciones.posicion.splice(indice, 1);
//             contador--;
//             updateCounter();
//           }
//           // console.log(Posiciones.posicion);
//         }
//       }
//     }

//     function updateCounter() {
//       counterElement.textContent = "Cantidad de actividades: " + secondaryList.children.length;
//       counterElement.style.fontSize = "12px";
//     }
//   });
// }

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

            <div id="collapse${element.id}" class="accordion-collapse collapse" aria-labelledby="heading${element.id}" data-bs-parent="#accordionExample">
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
            response.forEach(element => {
              template_detalle += `
                <div class="row trazabilidad_detalle_">
                  <div class="col-12 d-flex align-items-center">
                    <div class="checkbox">
                      <div class="form-check form-switch">
                        <input class="form-check-input chk_detalle" type="checkbox" id="chk_detalle${element.id}" name="chk_detalle[]" value="${element.id}" data-idvalor="${element.id}" />
                        <label class="form-check-label me-2 text-start" for="chk_detalle${element.id}">${element.nombre_opcion}</label>
                      </div>
                    </div>
                    <div class="row  w-100">
                      <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                        <div class="mb-1">
                          <label class="form-label" for="select_detalle${element.id}">Criterio</label>
                          <select class="form-select form-select-sm ms-2 select_detalle" id="select_detalle${element.id}" name="select_detalle[]" data-ElementId="${element.id}" style="width: 100%;" disabled>
                            <option value="">Seleccione</option>
                            <option value="1">Fecha Inicial</option>
                            <option value="2">Fecha Cargue</option>
                            <option value="3">Fecha Descargue</option>
                            <option value="4">Fecha Actividad dependiente</option>
                          </select>
                        </div>
                      </div>

                      <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4" style="display:none;" id="form_asignacion${element.id}">
                          <label class="form-label" for="slt_usuario_responsable${element.id}">Responsable</label>
                          <select class="form-select form-select-sm select2 slt_usuario_responsable" name="slt_usuario_responsable[]" id="slt_usuario_responsable${element.id}" style="width:100%;"></select>
                      </div>

                      <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                          <label class="form-label" for="input_valor${element.id}">Tiempo</label>
                          <input type="number" class="form-control form-control-sm input_valor" id="input_valor${element.id}" name="input_valor[]" disabled>
                      </div>

                      <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                        <label class="form-label" for="select_medida_tiempo${element.id}">Medida Tiempo</label>
                        <select class="form-select form-select-sm ms-2 select_medida_tiempo" id="select_medida_tiempo${element.id}" name="select_medida_tiempo[]" data-ElementId="${element.id}">
                          <option value="">Seleccione</option>
                          <option value="1">Minutos</option>
                          <option value="2">Horas</option>
                          <option value="3">Dias</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <hr class="my-1 text-dark">
                  </div>
                  <div class="row">
                    <!--<div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                      <select class="form-select form-select-sm ms-2 select_detalle" id="select_detalle${element.id}" name="select_detalle[]" data-ElementId="${element.id}" style="width: 100%;" disabled>
                        <option value="">Fecha Calculo</option>
                        <option value="1">Fecha Inicial</option>
                        <option value="2">Fecha Cargue</option>
                        <option value="3">Fecha Descargue</option>
                        <option value="4">Fecha Actividad dependiente</option>
                      </select>
                    </div>
                    <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                      <input type="text" class="form-control ms-2 form-control-sm input_valor" id="input_valor${element.id}" name="input_valor[]" style="width: 100%;" disabled>
                    </div>
                  <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                      <select class="form-select form-select-sm ms-2 select_dependiente" id="select_dependiente${element.id}" name="select_dependiente[]" data-ElementId="${element.id}" style="width: 100%;" disabled>
                        <option value="">Dependiente</option>
                        <option value="SI">Si</option>
                        <option value="NO">No</option>
                      </select>
                    </div>-->

                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                      <label class="form-label" for="select_dependiente${element.id}">Dependiente</label>
                      <select class="form-select form-select-sm ms-2 select_depende_" id="select_depende_${element.id}" name="select_depende_[]" style="width: 100%;" disabled></select>
                    </div>

                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                      <label class="form-label" for="costo_sugerido${element.id}">Costo Sugerido</label>
                      <input type="number" class="form-control form-control-sm costo_sugerido" id="costo_sugerido${element.id}" name="costo_sugerido[]">
                    </div>

                    <!--<div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                      <label class="form-label" for="personas_visualizar${element.id}">Visualizadores</label>
                      <select class="form-select form-select-sm ms-2 personas_visualizar" id="personas_visualizar${element.id}" name="personas_visualizar[]" multiple="multiple" style="width: 100%;"></select>
                    </div>

                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                      <label class="form-label" for="actividades_visualizar${element.id}">Actividades Visualizar</label>
                      <select class="form-select form-select-sm ms-2 actividades_visualizar" id="actividades_visualizar${element.id}" name="actividades_visualizar[]" multiple="multiple" style="width: 100%;"></select>
                    </div>-->

                    <div class="col-12">
                      <hr class="my-1 text-dark">
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

    const secondaryList = document.getElementById('secondaryList');
    const counterElement = document.getElementById('posicion');

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
          const listItem = document.createElement('div');
          const puesto = document.createElement('span');
          puesto.textContent = contador;
          puesto.style.fontWeight = 'bold';

          let select = document.getElementById('select_detalle' + Id); // Seleccionar el select asociado
          // let selectDependiente = document.getElementById('select_dependiente' + Id); // Seleccionar el select asociado
          // let selectDepende = document.getElementById('select_depende_' + Id); // Seleccionar el select asociado
          let InputValor = document.getElementById('input_valor' + Id); // Seleccionar el select asociado

          if (e.target.checked) {
            select.disabled = false; // Habilitar select
            // selectDependiente.disabled = false; // Habilitar select
            // selectDepende.disabled = false; // Habilitar select
            InputValor.disabled = false; // Habilitar select
          } else {
            select.disabled = true;
            select.value = ''; // Deshabilitar y resetear select
            InputValor.disabled = true;
          }

          listItem.setAttribute('id', 'puesto_id' + Id);
          // Agregar el número al contenedor
          listItem.appendChild(puesto);

          // Agregar el texto al contenedor
          const textoElement = document.createElement('span');
          textoElement.textContent = texto;

          // // 1. Obtener el array actual guardado en sessionStorage (si existe)
          // let actividades = JSON.parse(sessionStorage.getItem("ListadoActividaesSeleccionadas")) || [];

          // // 2. Agregar el nuevo texto al array (evitar duplicados si quieres)
          // actividades.push(texto.trim(), Id.trim());

          // // 3. Guardar el nuevo array actualizado en sessionStorage
          // sessionStorage.setItem("ListadoActividaesSeleccionadas", JSON.stringify(actividades));

          let actividades = JSON.parse(sessionStorage.getItem("ListadoActividaesSeleccionadas")) || [];

          actividades.push({
            id: Id.trim(),
            texto: texto.trim()
          });

          sessionStorage.setItem("ListadoActividaesSeleccionadas", JSON.stringify(actividades));

          listItem.appendChild(textoElement);
          // Agrega el elemento div con el título y el número al contenedor principal
          secondaryList.appendChild(listItem);
          // Modificación: Concatena el Id al final del string del ID
          const formId = 'form_asignacion' + Id;
          document.getElementById(formId).style.display = '';
          // Agrega la posición al array
          var posicion_array = puesto.parentElement.textContent;
          var dato = posicion_array.split(' ');
          // Actualiza el contador
          updateCounter();

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
                placeholder: "Seleccione Responsable",
                allowClear: true
              }).trigger('change'); // Asegurar que los valores se reflejen correctamente

              // console.log("✅ Select2 inicializado en:", selectId);
            },
            'json'
          );

          // $.post(
          //   $('#base_url').val() + 'torrecontrol/Buscar_usuario',
          //   function (data) {
          //     const selectId = '#personas_visualizar' + Id;
          //     const selectProveedores = document.querySelector(selectId);

          //     if (!selectProveedores) {
          //       console.error("❌ El select no se encontró. Verifica el ID:", selectId);
          //       return;
          //     }

          //     // Limpiar el select antes de agregar nuevas opciones
          //     selectProveedores.innerHTML = '<option value="">Seleccione</option>';
          //     selectProveedores.setAttribute('data-idusuario', '');
          //     selectProveedores.setAttribute('data-dato', parseInt(dato[0]));
          //     selectProveedores.setAttribute('data-valor_detalle', parseInt(valor_detalle));

          //     // Recorrer los datos y agregar opciones al select
          //     data.forEach(function (element) {
          //       const option = document.createElement('option');
          //       option.value = element.id;
          //       option.textContent = element.nom_usuario;
          //       selectProveedores.appendChild(option);
          //     });

          //     // Forzar la inicialización de select2 después de agregar opciones
          //     $(selectId).select2({
          //       placeholder: "Seleccione Visualizador de Actividad",
          //       allowClear: true
          //     }).trigger('change'); // Asegurar que los valores se reflejen correctamente

          //     // console.log("✅ Select2 inicializado en:", selectId);
          //   },
          //   'json'
          // );

          /* Listar activiades para la dependencia */
          // $.post(
          //   $('#base_url').val() + 'torrecontrol/Listar_activides_dependencia',
          //   function (data) {
          //     const selectId = '#select_depende_' + Id;
          //     const selectActviaddesDependientes = document.querySelector(selectId);

          //     if (!selectActviaddesDependientes) {
          //       console.error("❌ El select no se encontró. Verifica el ID:", selectId);
          //       return;
          //     }

          //     // Limpiar el select antes de agregar nuevas opciones
          //     selectActviaddesDependientes.innerHTML = '<option value="" selected>Seleccione</option>';

          //     // Recorrer los datos y agregar opciones al select
          //     data.forEach(function (element) {
          //       const option = document.createElement('option');
          //       option.value = element.id;
          //       option.textContent = element.nombre_opcion;
          //       selectActviaddesDependientes.appendChild(option);
          //     });

          //     // Forzar la inicialización de select2 después de agregar opciones
          //     $(selectId).select2({
          //       placeholder: "Seleccione Dependencia",
          //       allowClear: true
          //     }).trigger('change'); // Asegurar que los valores se reflejen correctamente

          //     // console.log("✅ Select2 inicializado en:", selectId);
          //   },
          //   'json'
          // );

          // Obtener las actividades del sessionStorage para asociar con las personas para visualizar
          const actividadesList = JSON.parse(sessionStorage.getItem("ListadoActividaesSeleccionadas")) || [];
          // const selectList = document.getElementById("actividades_visualizar" + Id);
          const selectId = '#select_depende_' + Id;

          const selectActviaddesDependientes = document.querySelector(selectId);
          // Limpiar el select (excepto el primer option)
          selectActviaddesDependientes.innerHTML = '<option value="">Seleccione una actividad</option>';

          // Recorrer y agregar cada actividad como opción
          actividadesList.forEach((actividad, index) => {
            console.log(actividad);

            const option = document.createElement("option");
            option.value = actividad.id;
            option.textContent = actividad.texto;
            selectActviaddesDependientes.appendChild(option);
          });

          // Forzar la inicialización de select2 después de agregar opciones
          $(selectActviaddesDependientes).select2({
            placeholder: "Seleccione Dependencia",
            allowClear: true
          }).trigger('change'); // Asegurar que los valores se reflejen correctamente


          // // Limpiar el select (excepto el primer option)
          // selectList.innerHTML = '<option value="">Seleccione una actividad</option>';

          // // Recorrer y agregar cada actividad como opción
          // actividadesList.forEach((actividad, index) => {
          //   const option = document.createElement("option");
          //   option.value = actividad.id;
          //   option.textContent = actividad.texto;
          //   selectList.appendChild(option);
          // });

          // // Forzar la inicialización de select2 después de agregar opciones
          // $(selectList).select2({
          //   placeholder: "Seleccione Dependencia",
          //   allowClear: true
          // }).trigger('change'); // Asegurar que los valores se reflejen correctamente

        } else {
          const formId = 'form_asignacion' + Id;
          document.getElementById(formId).style.display = 'none';

          const PuestoId = 'puesto_id' + Id;
          document.getElementById(PuestoId).style.display = 'none';

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

async function Listar_proveedores() {
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
}