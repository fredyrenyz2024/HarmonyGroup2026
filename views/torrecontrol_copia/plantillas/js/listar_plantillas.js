// window.VENTANA = null; // Variable global para almacenar el ID
// // Definir la función initScript globalmente
// window.initScript = function (id) {
//   window.VENTANA = id; // Asigna el ID recibido a la variable global
//   Listar_plantillas();
// };


// async function Listar_plantillas() {
//   try {
//     // Realizar la solicitud fetch
//     const response = await fetch($('#base_url').val() + 'torrecontrol/Listar_plantillas_pedidos', {
//       method: 'POST',
//       cache: 'no-cache',
//     });

//     // Convertir la respuesta a JSON
//     const data = await response.json();
//     let tbody = document.getElementById('tbl_plantillas_administrador');
//     tbody.innerHTML = '';


//     data.forEach(element => {
//       const fila = document.createElement('tr');

//       const columnaNundocSolicitud = document.createElement('td');
//       columnaNundocSolicitud.innerHTML = `
//       <div class="dropdown">
//         <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N° ${element.numdoc}</a>
//         <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
//           <a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso_servicio" data-proceso="${element.numdoc}" data-id="${element.numdoc}" data-clienteId="${element.numdoc}"><span class="uil uil-transaction"></span> Detalle Proceso</a>
//         </div>
//       </div>
//       `;

//       const columnaNombrePlantilla = document.createElement('td');
//       columnaNombrePlantilla.innerHTML = element.nombre_plantilla;
//       columnaNombrePlantilla.style.width = 'auto';
//       columnaNombrePlantilla.style.whiteSpace = 'nowrap';

//       const columnaProveedor = document.createElement('td');
//       columnaProveedor.innerHTML = element.razon_social;
//       columnaProveedor.style.width = 'auto';
//       columnaProveedor.style.whiteSpace = 'nowrap';

//       const columnaModalidad = document.createElement('td');
//       columnaModalidad.innerHTML = element.modalidad;
//       columnaModalidad.style.width = 'auto';
//       columnaModalidad.style.whiteSpace = 'nowrap';

//       const columnaFechaRegistro = document.createElement('td');
//       columnaFechaRegistro.innerHTML = element.fecha_hora;
//       columnaFechaRegistro.style.width = 'auto';
//       columnaFechaRegistro.style.whiteSpace = 'nowrap';

//       const columnaEstadoPlantilla = document.createElement('td');
//       columnaEstadoPlantilla.innerHTML = element.estado_plantilla;
//       columnaEstadoPlantilla.style.width = 'auto';
//       columnaEstadoPlantilla.style.whiteSpace = 'nowrap';

//       fila.appendChild(columnaNundocSolicitud);
//       fila.appendChild(columnaNombrePlantilla);
//       fila.appendChild(columnaProveedor);
//       fila.appendChild(columnaModalidad);
//       fila.appendChild(columnaFechaRegistro);
//       fila.appendChild(columnaEstadoPlantilla);
//       tbody.appendChild(fila);
//     });

//   } catch (error) {
//     console.error("Error al cargar los módulos:", error);
//     throw error;
//   } finally {
//     // Ocultar el loading overlay (si lo tienes)
//     // document.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
//   }
// }

window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global
  Listar_plantillas();

  // Crear instancia
  // Usar una variable global o una propiedad en el objeto window
  if (!window.myOffcanvas) {
    window.myOffcanvas = new DynamicOffcanvas({
      id: `customOffcanvas${id}`,
      title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
      content: '<p>Contenido inicial</p>',
      // class: 'offcanvas-bottom',
      scroll: true,
      backdrop: false
    });
  } else {
    console.log('El offcanvas ya está creado.');
  }

  document.addEventListener('click', async function (e) {
    if (e.target.id === 'btn_editar_plantilla' || e.target.id === 'btn_editar_plantilla *') {
      var id = e.target.getAttribute('data-id');
      // window.location.href = '<?= BASE_URL ?>/mvcLuisMiguel/plantillas/editar/' + id;
      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Editar Plantilla N°` + id);
      myOffcanvas.updateContent(`
        <form class="row g-3 mb-6">
          <div class="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
            <div class="mb-4">
              <div class="d-flex flex-wrap mb-2">
                <h5 class="mb-0 text-body-highlight me-2">Proveedores <span style="color:red;"><i>*</i></h5>
              </div>
              <select class="form-select form-select-sm select2" id="slt_Proveedores" style="width:100%;"></select>
            </div>
          </div>
          <div class="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
            <div class="mb-4">
              <div class="d-flex flex-wrap mb-2">
                <h5 class="mb-0 text-body-highlight me-2">Modalidad <span style="color:red;"><i>*</i></h5>
              </div>
              <select class="form-select form-select-sm select2" id="slt_Modalidad" style="width:100%;">
                <option value="" disabled="" selected="">Seleccione</option>
                <option value="NACIONAL">Nacional</option>
                <option value="EXPORTACION">Exportación</option>
              </select>
            </div>
          </div>
          <div class="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
            <div class="mb-4">
              <div class="d-flex flex-wrap mb-2">
                <h5 class="mb-0 text-body-highlight me-2">Nombre Plantilla <span style="color:red;"><i>*</i></h5>
              </div>
              <input type="text" class="form-control form-control-sm" name="nombre_plantilla" id="nombre_plantilla">
            </div>
          </div>
        </form> 

        <div class="col-sm-12 col-md-9 col-lg-9 col-xl-9 col-xxl-9">
          <h4 class="text-center" style="font-weight: bold;background-color: #332D2D;color:#FFFFFF;padding: 12px;">
            Parametros de trazabilidad</h4>
          <div id="accordionExample">
            <!-- Contenido JS -->
          </div>
        </div>
      `);
      Listar_proveedores();
      Listar_tipos_trazabilidad();
      try {
        // Crear un nuevo objeto FormData
        let formData = new FormData();
        // Agregar el ID al FormData
        formData.append("plantillaId", id);
        // Realizar la solicitud fetch
        let response = await fetch($('#base_url').val() + 'torrecontrol/Editar_Plantilla', {
          method: "POST",
          body: formData
        });

        let data = await response.json();

        if (data.cabecera) {
          // Asignar los valores a los campos del formulario
          document.getElementById('slt_Proveedores').value = data.cabecera.proveedor_id;
          document.getElementById('slt_Modalidad').value = data.cabecera.modalidad;
          document.getElementById('nombre_plantilla').value = data.cabecera.nombre_plantilla;
        }

        /* Colocar los parametros que esta checkeados en la plantilla */
        if (data.detalle_parmetros && data.detalle_parmetros.length > 0) {
          const checkboxes = document.querySelectorAll('input[name="chk_trazabilidad[]"]');

          checkboxes.forEach(checkbox => {
            const tipoProcesoId = parseInt(checkbox.value);
            const parametroEncontrado = data.detalle_parmetros.find(item => item.tipo_proceso_id == tipoProcesoId);

            if (parametroEncontrado) {
              // Marcar el checkbox principal
              checkbox.checked = true;
              checkbox.dispatchEvent(new Event('change'));

              // Marcar parámetros secundarios (si aplica)
              obtenerParametrosSecundarios(tipoProcesoId);
              setTimeout(() => {
                let checkboxes1 = document.getElementsByName('chk_detalle[]');
                let select_detalle = document.getElementsByName('select_detalle[]');
                let input_valor = document.getElementsByName('input_valor[]');
                let select_medida_tiempo = document.getElementsByName('select_medida_tiempo[]');
                let select_depende = document.getElementsByName('select_depende_[]');
                let personas_visualizar = document.getElementsByName('personas_visualizar[]');
                let actividades_visualizar = document.getElementsByName('actividades_visualizar[]');
                let select_usuario_responsable = document.getElementsByName('slt_usuario_responsable[]');

                checkboxes1.forEach(checkbox1 => {
                  const parametroSecundarioEncontrado = data.detalle_actividades.find(item => item.detalle_actividad_plantilla == checkbox1.value);
                  if (parametroSecundarioEncontrado) {
                    checkbox1.checked = true;
                    checkbox1.dispatchEvent(new Event('change'));
                    Listar_personas_visualizar(checkbox1.value, data.detalle_actividades.map(item => item.posicion));
                  }
                });

                select_detalle.forEach(select => {
                  const parametroSecundarioEncontrado = data.detalle_actividades.find(item => item.detalle_actividad_plantilla == select.getAttribute('data-elementid'));
                  if (parametroSecundarioEncontrado) {
                    select.disabled = false;
                    select.value = parametroSecundarioEncontrado.criterio_calculo;
                    select.dispatchEvent(new Event('change'));
                  }
                });

                input_valor.forEach(input => {
                  const parametroSecundarioEncontrado = data.detalle_actividades.find(item => item.detalle_actividad_plantilla == input.getAttribute('data-elementid'));
                  if (parametroSecundarioEncontrado) {
                    input.disabled = false;
                    input.value = parametroSecundarioEncontrado.valor_minutos;
                    input.dispatchEvent(new Event('change'));
                  }
                });

                select_medida_tiempo.forEach(select => {
                  const parametroSecundarioEncontrado = data.detalle_actividades.find(item => item.detalle_actividad_plantilla == select.getAttribute('data-elementid'));
                  if (parametroSecundarioEncontrado) {
                    select.disabled = false;
                    select.value = parametroSecundarioEncontrado.medida_tiempo;
                    select.dispatchEvent(new Event('change'));
                  }
                });
                // select_depende.forEach(select => {
                //   const parametroSecundarioEncontrado = data.detalle_actividades.find(item => item.detalle_actividad_plantilla == select.getAttribute('data-elementid'));
                //   if (parametroSecundarioEncontrado) {
                //     select.disabled = false;
                //     select.value = parametroSecundarioEncontrado.dependiente;
                //     select.dispatchEvent(new Event('change'));
                //   }
                // });
                // personas_visualizar.forEach(select => {
                //   const parametroSecundarioEncontrado = data.detalle_actividades.find(item => item.detalle_actividad_plantilla == select.getAttribute('data-elementid'));
                //   if (parametroSecundarioEncontrado) {
                //     select.disabled = false;
                //     select.value = parametroSecundarioEncontrado.visualizadores;
                //     select.dispatchEvent(new Event('change'));
                //   }
                // });
                // actividades_visualizar.forEach(select => {
                //   const parametroSecundarioEncontrado = data.detalle_actividades.find(item => item.detalle_actividad_plantilla == select.getAttribute('data-elementid'));
                //   if (parametroSecundarioEncontrado) {
                //     select.disabled = false;
                //     select.value = parametroSecundarioEncontrado.actividades_visualizar;
                //     select.dispatchEvent(new Event('change'));
                //   }
                // });

                // select_usuario_responsable.forEach(select => {
                //   const parametroSecundarioEncontrado = data.detalle_actividades.find(item => item.detalle_actividad_plantilla == select.getAttribute('data-elementid'));
                //   if (parametroSecundarioEncontrado) {
                //     select.disabled = false;
                //     select.value = parametroSecundarioEncontrado.responsable;
                //     select.dispatchEvent(new Event('change'));
                //   }
                // });

                // console.log(data.detalle_actividades[0].detalle_actividad);

                // data.detalle_actividades.forEach(element => {
                //   const detalleActividad = JSON.parse(element.detalle_actividad);
                //   console.log("🚀 ~ setTimeout ~ detalleActividad:", detalleActividad)
                //   // console.log(element.detalle_actividad);
                //   // console.log("🚀 ~ setTimeout ~ detalleActividad:", detalleActividad.detalle_actividad)
                //   // Resultado: { id: "35", personas_visualizar: ["72", "221"], actividades_visualizar: ["35"] }
                //   // Obtener el contenedor del checkbox relacionado con esta actividad
                //   const checkbox = document.querySelector(`input[name="chk_detalle[]"][value="${detalleActividad.id}"]`);
                //   if (checkbox) {
                //     const contenedor = checkbox.closest('.trazabilidad_detalle_');

                //     // Llenar "personas_visualizar[]"
                //     const selectPersonas = contenedor.querySelector('select[name="personas_visualizar[]"]');
                //     if (selectPersonas && detalleActividad.personas_visualizar) {
                //       detalleActividad.personas_visualizar.forEach(personaId => {
                //         const option = selectPersonas.querySelector(`option[value="${personaId}"]`);
                //         if (option) option.selected = true;
                //       });
                //       $(selectPersonas).trigger('change'); // Actualizar Select2 si lo usas
                //     }

                //     // Llenar "actividades_visualizar[]"
                //     const selectActividades = contenedor.querySelector('select[name="actividades_visualizar[]"]');
                //     if (selectActividades && detalleActividad.actividades_visualizar) {
                //       detalleActividad.actividades_visualizar.forEach(actividadId => {
                //         const option = selectActividades.querySelector(`option[value="${actividadId}"]`);
                //         if (option) option.selected = true;
                //       });
                //       $(selectActividades).trigger('change');
                //     }
                //   }
                // });

                // Pequeña espera para asegurar renderizado (opcional)
                // await new Promise(resolve => setTimeout(resolve, 50));

                // data.detalle_actividades.forEach(element => {
                //   try {
                //     // Parsear el JSON (con manejo de errores)
                //     const detalleActividad = JSON.parse(element.detalle_actividad);
                //     console.log("Procesando actividad:", detalleActividad);

                //     // Usar detalle_actividad_plantilla en lugar de detalleActividad.id
                //     const checkbox = document.querySelector(`input[name="chk_detalle[]"][value="${element.detalle_actividad_plantilla}"]`);

                //     if (!checkbox) {
                //       console.warn(`Checkbox no encontrado para actividad ${element.detalle_actividad_plantilla}`);
                //       return;
                //     }

                //     const contenedor = checkbox.closest('.trazabilidad_detalle_');
                //     if (!contenedor) {
                //       console.warn(`Contenedor no encontrado para actividad ${element.detalle_actividad_plantilla}`);
                //       return;
                //     }

                //     // Marcar el checkbox
                //     checkbox.checked = true;
                //     checkbox.dispatchEvent(new Event('change'));

                //     // Llenar personas_visualizar
                //     const selectPersonas = contenedor.querySelector('select[name="personas_visualizar[]"]');
                //     if (selectPersonas && detalleActividad.personas_visualizar) {
                //       // Limpiar selecciones previas
                //       Array.from(selectPersonas.options).forEach(option => option.selected = false);

                //       detalleActividad.personas_visualizar.forEach(personaId => {
                //         console.log("🚀 ~ setTimeout ~ personaId:", personaId)
                //         const option = selectPersonas.querySelector(`option[value="${personaId}"]`);
                //         if (option) option.selected = true;
                //       });

                //       // Actualizar Select2 si está en uso
                //       if (typeof $(selectPersonas).trigger === 'function') {
                //         $(selectPersonas).trigger('change');
                //       }
                //     }

                //     // Llenar actividades_visualizar
                //     const selectActividades = contenedor.querySelector('select[name="actividades_visualizar[]"]');
                //     if (selectActividades && detalleActividad.actividades_visualizar) {
                //       // Limpiar selecciones previas
                //       Array.from(selectActividades.options).forEach(option => option.selected = false);

                //       detalleActividad.actividades_visualizar.forEach(actividadId => {
                //         const option = selectActividades.querySelector(`option[value="${actividadId}"]`);
                //         if (option) option.selected = true;
                //       });

                //       if (typeof $(selectActividades).trigger === 'function') {
                //         $(selectActividades).trigger('change');
                //       }
                //     }

                //   } catch (error) {
                //     console.error(`Error procesando actividad ${element.detalle_actividad_plantilla}:`, error);
                //   }
                // });


                data.detalle_actividades.forEach(element => {
                  try {
                    const detalleActividad = JSON.parse(element.detalle_actividad);
                    console.log("Procesando actividad:", detalleActividad);
                
                    // Buscar el checkbox usando detalle_actividad_plantilla
                    const checkbox = document.querySelector(`input[name="chk_detalle[]"][value="${element.detalle_actividad_plantilla}"]`);
                    
                    if (!checkbox) {
                      console.warn(`Checkbox no encontrado para actividad ${element.detalle_actividad_plantilla}`);
                      return;
                    }
                
                    const contenedor = checkbox.closest('.trazabilidad_detalle_');
                    if (!contenedor) {
                      console.warn(`Contenedor no encontrado para actividad ${element.detalle_actividad_plantilla}`);
                      return;
                    }
                
                    // Llenar select múltiple de personas_visualizar
                    const selectPersonas = contenedor.querySelector('select[name="personas_visualizar[]"]');
                    if (selectPersonas && detalleActividad.personas_visualizar) {
                      // Convertir a array por si acaso viene string
                      const personasArray = Array.isArray(detalleActividad.personas_visualizar) 
                        ? detalleActividad.personas_visualizar
                        : String(detalleActividad.personas_visualizar).split(',');
                      
                      console.log("IDs de personas a seleccionar:", personasArray);
                
                      // Seleccionar las opciones correspondientes
                      personasArray.forEach(personaId => {
                        const cleanPersonaId = String(personaId).trim();
                        const option = Array.from(selectPersonas.options).find(
                          opt => opt.value === cleanPersonaId
                        );
                        
                        if (option) {
                          option.selected = true;
                          console.log(`Opción ${cleanPersonaId} seleccionada`);
                        } else {
                          console.warn(`Opción no encontrada para personaId: ${cleanPersonaId}`);
                        }
                      });
                
                      // Actualizar Select2 si está en uso
                      if (typeof $(selectPersonas).trigger === 'function') {
                        $(selectPersonas).trigger('change');
                        console.log("Select2 actualizado para personas_visualizar");
                      }
                    }
                
                    // Llenar select múltiple de actividades_visualizar
                    const selectActividades = contenedor.querySelector('select[name="actividades_visualizar[]"]');
                    if (selectActividades && detalleActividad.actividades_visualizar) {
                      const actividadesArray = Array.isArray(detalleActividad.actividades_visualizar)
                        ? detalleActividad.actividades_visualizar
                        : String(detalleActividad.actividades_visualizar).split(',');
                      
                      actividadesArray.forEach(actividadId => {
                        const cleanActividadId = String(actividadId).trim();
                        const option = Array.from(selectActividades.options).find(
                          opt => opt.value === cleanActividadId
                        );
                        
                        if (option) {
                          option.selected = true;
                        }
                      });
                
                      if (typeof $(selectActividades).trigger === 'function') {
                        $(selectActividades).trigger('change');
                      }
                    }
                
                  } catch (error) {
                    console.error(`Error procesando actividad ${element.detalle_actividad_plantilla}:`, error);
                  }
                });
              }, 1500);
            }
          });
        }
      } catch (error) {
        console.error("Error al cargar los módulos:", error);
        throw error;
      }

      myOffcanvas.updateHeight('100vh');
      myOffcanvas.updateWidth('70%');
      myOffcanvas.updateClass('offcanvas-end');
      myOffcanvas.show();
    }

    if (e.target.id === 'btn-inactivar-plantilla' || e.target.id === 'btn-inactivar-plantilla *') {
      var plantillaId = e.target.getAttribute('data-id');

      const result = await Swal.fire({
        title: "Seguro",
        text: "¿Desea Inactivar la plantilla?",
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
      if (result.isConfirmed) {
        // alert("Esta funcionalidad no esta implementada.");
        const btn = document.querySelector("#btn-inactivar-plantilla");

        btn.disabled = true;
        btn.innerHTML = "Subastando... ⏳";

        let formData = new FormData();
        formData.append("plantillaId", plantillaId);
        formData.append("Proceso", 'Inactiva');

        try {
          const response = await fetch($('#base_url').val() + 'torrecontrol/inactivar_plantilla', {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
          });

          const data = await response.json();

          if (data) {
            Swal.fire({
              title: "Mensaje!",
              text: data.message,
              icon: data.success
                ? "success"  // Si success es true, mostrar "success"
                : data.code === 503
                  ? "warning"  // Si el código es 503, mostrar "warning"
                  : "error",// En cualquier otro caso, mostrar "error"
              draggable: true
            }).then((result) => {
              if (result.isConfirmed) {
                Listar_plantillas();
              }
            });
          }

        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Error al enviar datos al servidor.", "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = `<span class="uil uil-play-circle"></span> Asignar Servicios`;
        }
      }
    }

    if (e.target.id === 'btn_activar_plantilla' || e.target.id === 'btn_activar_plantilla *') {
      var plantillaId = e.target.getAttribute('data-id');

      const result = await Swal.fire({
        title: "Seguro",
        text: "¿Desea Activar la plantilla?",
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
      if (result.isConfirmed) {
        // alert("Esta funcionalidad no esta implementada.");
        const btn = document.querySelector("#btn_activar_plantilla");

        btn.disabled = true;
        btn.innerHTML = "Subastando... ⏳";

        let formData = new FormData();
        formData.append("plantillaId", plantillaId);
        formData.append("Proceso", 'Activa');

        try {
          const response = await fetch($('#base_url').val() + 'torrecontrol/inactivar_plantilla', {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
          });

          const data = await response.json();

          if (data) {
            Swal.fire({
              title: "Mensaje!",
              text: data.message,
              icon: data.success
                ? "success"  // Si success es true, mostrar "success"
                : data.code === 503
                  ? "warning"  // Si el código es 503, mostrar "warning"
                  : "error",// En cualquier otro caso, mostrar "error"
              draggable: true
            }).then((result) => {
              if (result.isConfirmed) {
                Listar_plantillas();
              }
            });
          }

        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Error al enviar datos al servidor.", "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = `<span class="uil uil-play-circle"></span> Asignar Servicios`;
        }
      }
    }

  });
};

async function Listar_plantillas() {
  try {
    // Realizar la solicitud fetch
    const response = await fetch($('#base_url').val() + 'torrecontrol/Listar_plantillas_pedidos', {
      method: 'POST',
      cache: 'no-cache',
    });

    // Convertir la respuesta a JSON
    const data = await response.json();
    let tbody = document.getElementById('tbl_plantillas_administrador');
    tbody.innerHTML = '';
    let btnInctivar = '';
    let btnActivar = '';

    data.forEach(element => {
      const fila = document.createElement('tr');

      if (element.estado_plantilla === 'ACTIVA') {
        btnInctivar = `<a class="dropdown-item fw-bold" href="#" id="btn-inactivar-plantilla" data-id="${element.numdoc}"><span class="uil uil-x"></span> Inactivar Plantilla</a>`;
        btnActivar = ``;
      } else {
        btnInctivar = ``;
        btnActivar = `<a class="dropdown-item fw-bold" href="#" id="btn_activar_plantilla" data-id="${element.numdoc}"><span class="uil uil-check-circle"></span> Activar Plantilla</a>`;
      }

      const columnaNundocSolicitud = document.createElement('td');
      columnaNundocSolicitud.innerHTML = `
      <div class="dropdown">
        <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N° ${element.numdoc}</a>
        <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
          <a class="dropdown-item fw-bold" href="#" id="btn_editar_plantilla" data-id="${element.numdoc}"><span class="uil uil-transaction"></span> Editar Plantilla</a>
          ${btnActivar}
          ${btnInctivar}
        </div>
      </div>
      `;

      const columnaNombrePlantilla = document.createElement('td');
      columnaNombrePlantilla.innerHTML = element.nombre_plantilla;
      columnaNombrePlantilla.style.width = 'auto';
      columnaNombrePlantilla.style.whiteSpace = 'nowrap';

      const columnaProveedor = document.createElement('td');
      columnaProveedor.innerHTML = element.razon_social;
      columnaProveedor.style.width = 'auto';
      columnaProveedor.style.whiteSpace = 'nowrap';

      const columnaModalidad = document.createElement('td');
      columnaModalidad.innerHTML = element.modalidad;
      columnaModalidad.style.width = 'auto';
      columnaModalidad.style.whiteSpace = 'nowrap';

      const columnaFechaRegistro = document.createElement('td');
      columnaFechaRegistro.innerHTML = element.fecha_hora;
      columnaFechaRegistro.style.width = 'auto';
      columnaFechaRegistro.style.whiteSpace = 'nowrap';

      const columnaEstadoPlantilla = document.createElement('td');
      columnaEstadoPlantilla.innerHTML = createBadge(element.estado_plantilla, EstadoPlantilla[element.estado_plantilla]);
      columnaEstadoPlantilla.style.width = 'auto';
      columnaEstadoPlantilla.style.whiteSpace = 'nowrap';

      fila.appendChild(columnaNundocSolicitud);
      fila.appendChild(columnaNombrePlantilla);
      fila.appendChild(columnaProveedor);
      fila.appendChild(columnaModalidad);
      fila.appendChild(columnaFechaRegistro);
      fila.appendChild(columnaEstadoPlantilla);
      tbody.appendChild(fila);
    });

  } catch (error) {
    console.error("Error al cargar los módulos:", error);
    throw error;
  } finally {
    // Ocultar el loading overlay (si lo tienes)
    // document.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}

function createBadge(text, type) {
  return `
    <span class="badge badge-phoenix fs-10 badge-phoenix-${type}">
      <span class="badge-label">${text}</span>
      <span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span>
    </span>`;
}

window.EstadoPlantilla = {
  // 'Pendiente': 'secondary',
  // 'Publicado': 'info',
  'INACTIVA': 'danger',
  'ACTIVA': 'success',
  // 'Pendiente Respuesta': 'warning',
  // 'Completado': 'success'
};

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
              <input type="checkbox" id="chk_trazabilidad${index}" name="chk_trazabilidad[]" class="chk_trazabilidad me-2" value="${element.id}" 
                style="transform: scale(1.5); margin-right: 10px;" data-bs-toggle="collapse" data-bs-target="#collapse${element.id}" 
                aria-expanded="false" aria-controls="collapse${element.id}">

              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${element.id}" 
                aria-expanded="false" aria-controls="collapse${element.id}">
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

      // document.addEventListener('change', async function (e) {
      //   if (e.target.matches('.chk_trazabilidad')) {
      //     let valor = e.target.value;
      //     let collapseElement = document.getElementById('collapse' + valor);
      //     let bsCollapse = new bootstrap.Collapse(collapseElement);

      //     if (e.target.checked) {
      //       bsCollapse.show();
      //       // document.getElementById('parametros').style.display = 'block';
      //       let data = new FormData();
      //       data.append('id', valor);
      //       await fetch($('#base_url').val() + 'pedidos/Listar_Opciones', {
      //         method: 'POST',
      //         cache: 'no-cache',
      //         body: data,
      //       })
      //         .then(res => (res.ok ? res.json() : Promise.reject(res)))
      //         .catch(error => {
      //           alert(JSON.stringify(error.length) || 'Error al cargar tipo de detalle');
      //         })
      //         .then(response => {
      //           let template_detalle = '';
      //           response.forEach(element => {
      //             template_detalle += `
      //               <div class="row trazabilidad_detalle_">
      //                 <div class="col-12 d-flex align-items-center">
      //                   <div class="checkbox">
      //                     <div class="form-check form-switch">
      //                       <input class="form-check-input chk_detalle" type="checkbox" id="chk_detalle${element.id}" name="chk_detalle[]" value="${element.id}" data-idvalor="${element.id}" />
      //                       <label class="form-check-label me-2 text-start" for="chk_detalle${element.id}">${element.nombre_opcion}</label>
      //                     </div>
      //                   </div>
      //                   <div class="row  w-100">
      //                     <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
      //                       <div class="mb-1">
      //                         <label class="form-label" for="select_detalle${element.id}">Criterio</label>
      //                         <select class="form-select form-select-sm ms-2 select_detalle" id="select_detalle${element.id}" name="select_detalle[]" data-ElementId="${element.id}" style="width: 100%;" disabled>
      //                           <option value="">Seleccione</option>
      //                           <option value="1">Fecha Inicial</option>
      //                           <option value="2">Fecha Cargue</option>
      //                           <option value="3">Fecha Descargue</option>
      //                           <option value="4">Fecha Actividad dependiente</option>
      //                         </select>
      //                       </div>
      //                     </div>

      //                     <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4" style="display:none;" id="form_asignacion${element.id}">
      //                         <label class="form-label" for="slt_usuario_responsable${element.id}">Responsable</label>
      //                         <select class="form-select form-select-sm select2 slt_usuario_responsable" name="slt_usuario_responsable[]" id="slt_usuario_responsable${element.id}" style="width:100%;"></select>
      //                     </div>

      //                     <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
      //                         <label class="form-label" for="input_valor${element.id}">Tiempo</label>
      //                         <input type="number" class="form-control form-control-sm input_valor" id="input_valor${element.id}" name="input_valor[]" disabled>
      //                     </div>

      //                     <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
      //                       <label class="form-label" for="select_medida_tiempo${element.id}">Medida Tiempo</label>
      //                       <select class="form-select form-select-sm ms-2 select_medida_tiempo" id="select_medida_tiempo${element.id}" name="select_medida_tiempo[]" data-ElementId="${element.id}">
      //                         <option value="">Seleccione</option>
      //                         <option value="1">Minutos</option>
      //                         <option value="2">Horas</option>
      //                         <option value="3">Dias</option>
      //                       </select>
      //                     </div>
      //                   </div>
      //                 </div>

      //                 <div class="col-12">
      //                   <hr class="my-1 text-dark">
      //                 </div>
      //                 <div class="row">
      //                   <!--<div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
      //                     <select class="form-select form-select-sm ms-2 select_detalle" id="select_detalle${element.id}" name="select_detalle[]" data-ElementId="${element.id}" style="width: 100%;" disabled>
      //                       <option value="">Fecha Calculo</option>
      //                       <option value="1">Fecha Inicial</option>
      //                       <option value="2">Fecha Cargue</option>
      //                       <option value="3">Fecha Descargue</option>
      //                       <option value="4">Fecha Actividad dependiente</option>
      //                     </select>
      //                   </div>
      //                   <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
      //                     <input type="text" class="form-control ms-2 form-control-sm input_valor" id="input_valor${element.id}" name="input_valor[]" style="width: 100%;" disabled>
      //                   </div>
      //                 <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
      //                     <select class="form-select form-select-sm ms-2 select_dependiente" id="select_dependiente${element.id}" name="select_dependiente[]" data-ElementId="${element.id}" style="width: 100%;" disabled>
      //                       <option value="">Dependiente</option>
      //                       <option value="SI">Si</option>
      //                       <option value="NO">No</option>
      //                     </select>
      //                   </div>-->

      //                   <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
      //                     <label class="form-label" for="select_dependiente${element.id}">Dependiente</label>
      //                     <select class="form-select form-select-sm ms-2 select_depende_" id="select_depende_${element.id}" name="select_depende_[]" style="width: 100%;" disabled></select>
      //                   </div>

      //                   <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
      //                     <label class="form-label" for="personas_visualizar${element.id}">Visualizadores</label>
      //                     <select class="form-select form-select-sm ms-2 personas_visualizar" id="personas_visualizar${element.id}" name="personas_visualizar[]" multiple="multiple" style="width: 100%;"></select>
      //                   </div>

      //                   <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
      //                     <label class="form-label" for="actividades_visualizar${element.id}">Actividades Visualizar</label>
      //                     <select class="form-select form-select-sm ms-2 actividades_visualizar" id="actividades_visualizar${element.id}" name="actividades_visualizar[]" multiple="multiple" style="width: 100%;"></select>
      //                   </div>

      //                   <div class="col-12">
      //                     <hr class="my-1 text-dark">
      //                   </div>
      //                 </div>
      //               </div>
      //             `;
      //             document.getElementById('list_detalle' + valor).innerHTML = template_detalle;
      //           });
      //         });
      //     } else {
      //       bsCollapse.hide();
      //       document.getElementById('list_detalle' + valor).innerHTML = '';
      //     }
      //   }

      //   const secondaryList = document.getElementById('secondaryList');
      //   const counterElement = document.getElementById('posicion');

      //   if (e.target.matches('.chk_detalle') || e.target.matches('.chk_detalle *')) {
      //     // Asegúrate de que Posiciones.posicion esté inicializado
      //     if (!Posiciones.posicion) {
      //       Posiciones.posicion = [];
      //     }

      //     let padre = e.target.parentElement.parentElement;
      //     let checkDetalle = padre.querySelectorAll('.chk_detalle');
      //     for (let i = 0; i < checkDetalle.length; i++) {
      //       var checkbox = checkDetalle[i];
      //       var valor_detalle = checkDetalle[i].value;

      //       var texto = checkDetalle[i].parentElement.textContent;
      //       let Id = checkbox.getAttribute('data-idvalor');
      //       if (checkbox.checked) {
      //         contador++;
      //         checkbox.setAttribute('data-idposicion', contador);

      //         // Crear un contenedor para el número y el texto
      //         const listItem = document.createElement('div');
      //         const puesto = document.createElement('span');
      //         puesto.textContent = contador;
      //         puesto.style.fontWeight = 'bold';

      //         let select = document.getElementById('select_detalle' + Id); // Seleccionar el select asociado
      //         // let selectDependiente = document.getElementById('select_dependiente' + Id); // Seleccionar el select asociado
      //         // let selectDepende = document.getElementById('select_depende_' + Id); // Seleccionar el select asociado
      //         let InputValor = document.getElementById('input_valor' + Id); // Seleccionar el select asociado

      //         if (e.target.checked) {
      //           select.disabled = false; // Habilitar select
      //           // selectDependiente.disabled = false; // Habilitar select
      //           // selectDepende.disabled = false; // Habilitar select
      //           InputValor.disabled = false; // Habilitar select
      //         } else {
      //           select.disabled = true;
      //           select.value = ''; // Deshabilitar y resetear select
      //           InputValor.disabled = true;
      //         }

      //         listItem.setAttribute('id', 'puesto_id' + Id);
      //         // Agregar el número al contenedor
      //         listItem.appendChild(puesto);

      //         // Agregar el texto al contenedor
      //         const textoElement = document.createElement('span');
      //         textoElement.textContent = texto;

      //         // // 1. Obtener el array actual guardado en sessionStorage (si existe)
      //         // let actividades = JSON.parse(sessionStorage.getItem("ListadoActividaesSeleccionadas")) || [];

      //         // // 2. Agregar el nuevo texto al array (evitar duplicados si quieres)
      //         // actividades.push(texto.trim(), Id.trim());

      //         // // 3. Guardar el nuevo array actualizado en sessionStorage
      //         // sessionStorage.setItem("ListadoActividaesSeleccionadas", JSON.stringify(actividades));

      //         let actividades = JSON.parse(sessionStorage.getItem("ListadoActividaesSeleccionadas")) || [];

      //         actividades.push({
      //           id: Id.trim(),
      //           texto: texto.trim()
      //         });

      //         sessionStorage.setItem("ListadoActividaesSeleccionadas", JSON.stringify(actividades));



      //         listItem.appendChild(textoElement);
      //         // Agrega el elemento div con el título y el número al contenedor principal
      //         secondaryList.appendChild(listItem);
      //         // Modificación: Concatena el Id al final del string del ID
      //         const formId = 'form_asignacion' + Id;
      //         document.getElementById(formId).style.display = '';
      //         // Agrega la posición al array
      //         var posicion_array = puesto.parentElement.textContent;
      //         var dato = posicion_array.split(' ');
      //         // Actualiza el contador
      //         updateCounter();

      //         /* Buscar usuario responsable para la actividad */
      //         $.post(
      //           $('#base_url').val() + 'torrecontrol/Buscar_usuario',
      //           function (data) {
      //             const selectId = '#slt_usuario_responsable' + Id;
      //             const selectProveedores = document.querySelector(selectId);

      //             if (!selectProveedores) {
      //               console.error("❌ El select no se encontró. Verifica el ID:", selectId);
      //               return;
      //             }

      //             // Limpiar el select antes de agregar nuevas opciones
      //             selectProveedores.innerHTML = '<option value="" selected>Seleccione</option>';
      //             selectProveedores.setAttribute('data-idusuario', '');
      //             selectProveedores.setAttribute('data-dato', parseInt(dato[0]));
      //             selectProveedores.setAttribute('data-valor_detalle', parseInt(valor_detalle));

      //             // Recorrer los datos y agregar opciones al select
      //             data.forEach(function (element) {
      //               const option = document.createElement('option');
      //               option.value = element.id;
      //               option.textContent = element.nom_usuario;
      //               // selectProveedores.setAttribute('data-idusuario', element.id);
      //               selectProveedores.appendChild(option);
      //             });

      //             // Forzar la inicialización de select2 después de agregar opciones
      //             $(selectId).select2({
      //               placeholder: "Seleccione Responsable",
      //               allowClear: true
      //             }).trigger('change'); // Asegurar que los valores se reflejen correctamente

      //             // console.log("✅ Select2 inicializado en:", selectId);
      //           },
      //           'json'
      //         );

      //         $.post(
      //           $('#base_url').val() + 'torrecontrol/Buscar_usuario',
      //           function (data) {
      //             const selectId = '#personas_visualizar' + Id;
      //             const selectProveedores = document.querySelector(selectId);

      //             if (!selectProveedores) {
      //               console.error("❌ El select no se encontró. Verifica el ID:", selectId);
      //               return;
      //             }

      //             // Limpiar el select antes de agregar nuevas opciones
      //             selectProveedores.innerHTML = '<option value="" selected>Seleccione</option>';
      //             selectProveedores.setAttribute('data-idusuario', '');
      //             selectProveedores.setAttribute('data-dato', parseInt(dato[0]));
      //             selectProveedores.setAttribute('data-valor_detalle', parseInt(valor_detalle));

      //             // Recorrer los datos y agregar opciones al select
      //             data.forEach(function (element) {
      //               const option = document.createElement('option');
      //               option.value = element.id;
      //               option.textContent = element.nom_usuario;
      //               selectProveedores.appendChild(option);
      //             });

      //             // Forzar la inicialización de select2 después de agregar opciones
      //             $(selectId).select2({
      //               placeholder: "Seleccione Visualizador de Actividad",
      //               allowClear: true
      //             }).trigger('change'); // Asegurar que los valores se reflejen correctamente

      //             // console.log("✅ Select2 inicializado en:", selectId);
      //           },
      //           'json'
      //         );

      //         /* Listar activiades para la dependencia */
      //         // $.post(
      //         //   $('#base_url').val() + 'torrecontrol/Listar_activides_dependencia',
      //         //   function (data) {
      //         //     const selectId = '#select_depende_' + Id;
      //         //     const selectActviaddesDependientes = document.querySelector(selectId);

      //         //     if (!selectActviaddesDependientes) {
      //         //       console.error("❌ El select no se encontró. Verifica el ID:", selectId);
      //         //       return;
      //         //     }

      //         //     // Limpiar el select antes de agregar nuevas opciones
      //         //     selectActviaddesDependientes.innerHTML = '<option value="" selected>Seleccione</option>';

      //         //     // Recorrer los datos y agregar opciones al select
      //         //     data.forEach(function (element) {
      //         //       const option = document.createElement('option');
      //         //       option.value = element.id;
      //         //       option.textContent = element.nombre_opcion;
      //         //       selectActviaddesDependientes.appendChild(option);
      //         //     });

      //         //     // Forzar la inicialización de select2 después de agregar opciones
      //         //     $(selectId).select2({
      //         //       placeholder: "Seleccione Dependencia",
      //         //       allowClear: true
      //         //     }).trigger('change'); // Asegurar que los valores se reflejen correctamente

      //         //     // console.log("✅ Select2 inicializado en:", selectId);
      //         //   },
      //         //   'json'
      //         // );

      //         // Obtener las actividades del sessionStorage para asociar con las personas para visualizar
      //         const actividadesList = JSON.parse(sessionStorage.getItem("ListadoActividaesSeleccionadas")) || [];
      //         const selectList = document.getElementById("actividades_visualizar" + Id);
      //         const selectId = '#select_depende_' + Id;

      //         const selectActviaddesDependientes = document.querySelector(selectId);
      //         // Limpiar el select (excepto el primer option)
      //         selectActviaddesDependientes.innerHTML = '<option value="">Seleccione una actividad</option>';

      //         // Recorrer y agregar cada actividad como opción
      //         actividadesList.forEach((actividad, index) => {
      //           console.log(actividad);

      //           const option = document.createElement("option");
      //           option.value = actividad.id;
      //           option.textContent = actividad.texto;
      //           selectActviaddesDependientes.appendChild(option);
      //         });

      //         // Forzar la inicialización de select2 después de agregar opciones
      //         $(selectActviaddesDependientes).select2({
      //           placeholder: "Seleccione Dependencia",
      //           allowClear: true
      //         }).trigger('change'); // Asegurar que los valores se reflejen correctamente


      //         // Limpiar el select (excepto el primer option)
      //         selectList.innerHTML = '<option value="">Seleccione una actividad</option>';

      //         // Recorrer y agregar cada actividad como opción
      //         actividadesList.forEach((actividad, index) => {
      //           const option = document.createElement("option");
      //           option.value = actividad.id;
      //           option.textContent = actividad.texto;
      //           selectList.appendChild(option);
      //         });

      //         // Forzar la inicialización de select2 después de agregar opciones
      //         $(selectList).select2({
      //           placeholder: "Seleccione Dependencia",
      //           allowClear: true
      //         }).trigger('change'); // Asegurar que los valores se reflejen correctamente

      //       } else {
      //         const formId = 'form_asignacion' + Id;
      //         document.getElementById(formId).style.display = 'none';

      //         const PuestoId = 'puesto_id' + Id;
      //         document.getElementById(PuestoId).style.display = 'none';

      //         var posicion_eliminar = checkbox.getAttribute('data-idposicion');
      //         var indice = Posiciones.posicion.indexOf(parseInt(posicion_eliminar));
      //         if (indice !== -1) {
      //           // El elemento existe en el array, ahora puedes eliminarlo usando splice
      //           // console.log('El elemento existe en el array en el índice: ' + indice);
      //           Posiciones.posicion.splice(indice, 1);
      //           contador--;
      //           updateCounter();
      //         } else {
      //           // console.log('El elemento no existe en el array');
      //           Posiciones.posicion.splice(indice, 1);
      //           contador--;
      //           updateCounter();
      //         }
      //         // console.log(Posiciones.posicion);
      //       }
      //     }
      //   }

      //   function updateCounter() {
      //     counterElement.textContent = "Cantidad de actividades: " + secondaryList.children.length;
      //     counterElement.style.fontSize = "12px";
      //   }
      // });
    });
}

async function obtenerParametrosSecundarios(ParametroId) {
  let data = new FormData();
  data.append('id', ParametroId);
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
                    <select class="form-select form-select-sm select2 slt_usuario_responsable" name="slt_usuario_responsable[]" id="slt_usuario_responsable${element.id}"  data-ElementId="${element.id}" style="width:100%;"></select>
                </div>

                <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                    <label class="form-label" for="input_valor${element.id}">Tiempo</label>
                    <input type="number" class="form-control form-control-sm input_valor" id="input_valor${element.id}" name="input_valor[]"  data-ElementId="${element.id}" disabled>
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
              <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <label class="form-label" for="select_dependiente${element.id}">Dependiente</label>
                <select class="form-select form-select-sm ms-2 select_depende_" id="select_depende_${element.id}" name="select_depende_[]"  data-ElementId="${element.id}" style="width: 100%;" disabled></select>
              </div>

              <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <label class="form-label" for="personas_visualizar${element.id}">Visualizadores</label>
                <select class="form-select form-select-sm ms-2 personas_visualizar" id="personas_visualizar${element.id}" name="personas_visualizar[]"  data-ElementId="${element.id}" multiple="multiple" style="width: 100%;"></select>
              </div>

              <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <label class="form-label" for="actividades_visualizar${element.id}">Actividades Visualizar</label>
                <select class="form-select form-select-sm ms-2 actividades_visualizar" id="actividades_visualizar${element.id}" name="actividades_visualizar[]"  data-ElementId="${element.id}" multiple="multiple" style="width: 100%;"></select>
              </div>

              <div class="col-12">
                <hr class="my-1 text-dark">
              </div>
            </div>
          </div>
        `;
        document.getElementById('list_detalle' + ParametroId).innerHTML = template_detalle;
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

function Listar_personas_visualizar(Id, Posicion) {
  $.post(
    $('#base_url').val() + 'torrecontrol/Buscar_usuario',
    function (data) {
      const selectId = '#personas_visualizar' + Id;
      const selectProveedores = document.querySelector(selectId);

      if (!selectProveedores) {
        console.error("❌ El select no se encontró. Verifica el ID:", selectId);
        return;
      }

      // Limpiar el select antes de agregar nuevas opciones
      selectProveedores.innerHTML = '<option value="">Seleccione</option>';
      selectProveedores.setAttribute('data-idusuario', '');
      selectProveedores.setAttribute('data-dato', parseInt(Posicion));
      selectProveedores.setAttribute('data-valor_detalle', parseInt(Id));

      // Recorrer los datos y agregar opciones al select
      data.forEach(function (element) {
        const option = document.createElement('option');
        option.value = element.id;
        option.textContent = element.nom_usuario;
        selectProveedores.appendChild(option);
      });

      // Forzar la inicialización de select2 después de agregar opciones
      $(selectId).select2({
        placeholder: "Seleccione Visualizador de Actividad",
        allowClear: true
      }).trigger('change'); // Asegurar que los valores se reflejen correctamente

      // console.log("✅ Select2 inicializado en:", selectId);
    },
    'json'
  );
}