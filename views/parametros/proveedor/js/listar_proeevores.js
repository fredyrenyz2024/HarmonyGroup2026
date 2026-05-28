window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global
  // Crear instancia
  // Usar una variable global o una propiedad en el objeto window
  if (!window.myOffcanvas) {
    window.myOffcanvas = new DynamicOffcanvas({
      id: `customOffcanvas${id}`,
      title: '<span class="text-dark uil uil-car"></span> Titulo General',
      content: '<p>Contenido inicial</p>',
      scroll: true,
      backdrop: false
    });
  } else {
    console.log('El offcanvas ya esta creado.');
  }

  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1;
  const diaActual = hoy.getDate();
  const mesFormateado = mesActual < 10 ? '0' + mesActual : mesActual;
  const diaFormateado = diaActual < 10 ? '0' + diaActual : diaActual;
  const fechaFormateada = `${hoy.getFullYear()}-${mesFormateado}-${diaFormateado}`;
  // console.log(fechaFormateada);
  Listar_proveedores();

  document.addEventListener("click", async (e) => {
    if (e.target.matches("#btn_ver_clientes_asignados") || e.target.matches("#btn_ver_clientes_asignados *")) {
      let enlace = e.target.closest("#btn_ver_clientes_asignados");
      let ProveedorId = enlace.getAttribute("data-id");
      let NombreProveedor = enlace.getAttribute("data-id2");
      myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Listado de los clientes asignados al proveedor ` + NombreProveedor);
      myOffcanvas.updateContent(`
        <div class="table-responsive scrollbar">
          <table class="table table-sm table-striped" style="font-size:10px;">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Cliente</th>
                <th scope="col">Correo</th>
                <th scope="col">Telefono</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody id="tbody_clientes_asignados"></tbody>
          </table>
      </div>
      `);

      try {
        let formData = new FormData();
        formData.append("ProveedorId", ProveedorId);

        let response = await fetch($('#base_url').val() + 'parametros/listar_clientes_asignados', {
          method: "POST",
          body: formData
        });

        let data = await response.json();
        if (data) {
          let rows = "";
          let estado_actviidad = "";
          let btn_inicio_gestion = "";
          let btn_rechazo_gestion = "";
          let btn_cancelar_gestion = "";
          let btn_postular_servicio = "";

          data.forEach((proveedor, index) => {

            if (proveedor.estado_asignacion === "Activo") {
              estado_actviidad = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${proveedor.estado_asignacion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (proveedor.estado_asignacion === "Inactivo") {
              estado_actviidad = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${proveedor.estado_asignacion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (proveedor.estado_asignacion === "Cancelado") {
              estado_actviidad = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${proveedor.estado_asignacion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (proveedor.estado_asignacion === "Asociado") {
              estado_actviidad = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${proveedor.estado_asignacion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
            }

            rows += `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${proveedor.nombre}</td>
                  <td>${proveedor.email}</td>
                  <td>${proveedor.telefono}</td>
                  <td>${estado_actviidad}</td>
                 <!-- <td>
                  <div class="dropdown">
                    <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <span class="uil-list-ui-alt"></span></a>
                    <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink"> 
                      ${btn_inicio_gestion}
                      ${btn_rechazo_gestion}
                      ${btn_cancelar_gestion}
                      ${btn_postular_servicio}
                    </div>
                  </div>
                  </td>-->
                </tr>
                <!--<tr id="postular_${proveedor.servicio_id}" style="display: none;">
                  <td colspan="8">
                    <div class="lista-servicios"></div>
                  </td>
                </tr>-->
              `;
          });

          document.getElementById("tbody_clientes_asignados").innerHTML = rows;
        } else {
          document.getElementById("tbody_clientes_asignados").innerHTML = `<tr><td colspan="4" class="text-center text-danger">${data.message}</td></tr>`;
        }
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        document.getElementById("tbody_clientes_asignados").innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar proveedores</td></tr>`;
      }

      window.myOffcanvas.show();
    }

    // Dentro del event listener de click en initScript
    if (e.target.matches("#btn_editar_proveedor") || e.target.matches("#btn_editar_proveedor *")) {
      let idProveedor = e.target.closest("#btn_editar_proveedor").getAttribute("data-id");

      myOffcanvas.updateTitle(`<span class="text-primary uil uil-edit"></span> Editar Proveedor`);
      myOffcanvas.updateContent(`<div class="text-center"><img src="${$('#base_url').val()}public/img/nexos_loading.gif" height="50"> Cargando datos...</div>`);
      myOffcanvas.show();

      try {
        const resp = await fetch($('#base_url').val() + 'parametros/obtener_datos_proveedor', {
          method: 'POST',
          body: new URLSearchParams({ id: idProveedor })
        });
        const info = await resp.json();

        // Renderizamos el formulario (puedes reutilizar tu HTML de creación)
        renderizarFormularioEdicion(info);

      } catch (error) {
        console.error(error);
      }
    }

  });

  $(document).on('click', '#btn_actualizar_proveedor', async function () {
    let sedesEditadas = []; // Sedes que ya existen en DB
    let sedesNuevas = [];    // Sedes que se agregaron ahora

    // Recorrer sedes existentes
    // $('.fila-sede-existente').each(function () {
    //   sedesEditadas.push({
    //     id: $(this).data('id'),
    //     nombre_sede: $(this).find('.edit-sede-nombre').val()
    //   });
    // });

    $('.fila-sede-existente').each(function () {
      const fila = $(this);
      sedesEditadas.push({
        id: fila.data('id'),
        nombre_sede: fila.find('.edit-sede-nombre').val(),
        // Agregamos estos campos para que el modelo no falle
        pais: fila.find('input[readonly]').eq(0).val(),
        municipio_id: fila.data('muni-id') // Asegúrate de guardar el ID del muni en un data-attribute al renderizar
      });
    });

    // Recorrer sedes nuevas (clase 'fila-nueva-sede' que definas al agregar)
    $('.fila-nueva-sede').each(function () {
      const idx = $(this).data('index');
      sedesNuevas.push({
        pais: $(`#new_pais_${idx}`).val(),
        municipio_id: $(`#new_muni_${idx}`).val(),
        nombre_sede: $(`#new_nombre_${idx}`).val()
      });
    });

    let formData = new FormData();
    formData.append('id', $('#edit_id_proveedor').val());
    formData.append('razon_social', $('#edit_razon_social').val());
    formData.append('telefono', $('#edit_telefono').val());
    formData.append('correo', $('#edit_correo').val());
    formData.append('direccion', $('#edit_direccion').val());
    formData.append('ciudad_id', $('#edit_slct_ciudad').val());
    formData.append('regimen', $('#edit_regimen').val());
    formData.append('estado_proveedor', $('#edit_estado_proveedor').val());
    formData.append('contacto', $('#edit_contacto').val());
    formData.append('numero_contacto', $('#edit_numero_contacto').val());
    formData.append('tipo_proveedor', $('#edit_tipo_proveedor').val());

    formData.append('sedesEditadas', JSON.stringify(sedesEditadas));
    formData.append('sedesNuevas', JSON.stringify(sedesNuevas));

    try {
      const response = await fetch($('#base_url').val() + 'parametros/actualizar_proveedor_ejecutar', {
        method: 'POST',
        body: formData
      });
      const res = await response.json();
      if (res.status) {
        Swal.fire("¡Éxito!", res.message, "success").then(() => location.reload());
      } else {
        Swal.fire("Error", res.message, "error");
      }
    } catch (e) { console.error(e); }
  });

  // Delegación de eventos para el botón de agregar sede en el EDITAR
  $(document).on('click', '#btn_add_sede_edit', function () {
    let sedeIndexEdit = $('.fila-nueva-sede').length + 1;

    const nuevaFila = `
        <tr class="fila-nueva-sede" data-index="${sedeIndexEdit}">
            <td>
                <select class="form-select form-select-sm slct-pais-tabla" id="new_pais_${sedeIndexEdit}" data-index="${sedeIndexEdit}">
                    <option value="">Seleccione...</option>
                </select>
            </td>
            <td>
                <select class="form-select form-select-sm" id="new_muni_${sedeIndexEdit}">
                    <option value="">País primero...</option>
                </select>
            </td>
            <td>
                <input type="text" class="form-control form-control-sm" id="new_nombre_${sedeIndexEdit}" placeholder="Nombre Sede">
            </td>
            <td class="text-center">
                <button type="button" class="btn btn-link text-danger p-0" onclick="$(this).closest('tr').remove();">
                    <i class="uil uil-trash-alt"></i>
                </button>
            </td>
        </tr>
    `;

    $('#tbody_sedes_edit').append(nuevaFila);


    $(`#new_pais_${sedeIndexEdit}`).select2({
      width: '100%' // Esto fuerza a que tome el ancho del contenedor
    });

    // Llenar los países en el nuevo select
    llenarPaisesTabla(`#new_pais_${sedeIndexEdit}`);
  });
}


// Evento cuando cambia el país EN LA TABLA
$(document).on('change', '.slct-pais-tabla', async function () {
  const index = $(this).data('index');
  const paisId = $(this).val();
  const $selectMuni = $(`#new_muni_${index}`);

  if (!paisId) {
    $selectMuni.empty().append('<option value="">Seleccione país primero</option>');
    return;
  }

  $selectMuni.empty().append('<option value="">Cargando...</option>');

  try {
    const response = await fetch($('#base_url').val() + 'parametros/Consulta_Municipios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ 'pais': paisId }),
      cache: 'no-cache'
    });
    const data = await response.json();

    $selectMuni.empty().append('<option value="">Seleccione municipio</option>');
    data.forEach(element => {
      $selectMuni.append(`<option value="${element.id}">${element.municipio} - ${element.depto}</option>`);
    });

    $(`#new_muni_${index}`).select2({
      width: '100%' // Esto fuerza a que tome el ancho del contenedor
    });
  } catch (error) {
    console.error(error);
    $selectMuni.empty().append('<option value="">Error</option>');
  }
});

// Función auxiliar para llenar países en la tabla
async function llenarPaisesTabla(selector) {
  const response = await fetch($('#base_url').val() + 'parametros/Consulta_Pais', { method: 'POST' });
  const data = await response.json();
  data.forEach(element => {
    $(selector).append(`<option value="${element.pais}">${element.pais}</option>`);
  });
}

// function renderizarFormularioEdicion(data) {
//   const prov = data.proveedor;
//   const sedes = data.sedes || [];

//   let html = `
//     <form id="form_editar_proveedor">
//         <input type="hidden" id="edit_id_proveedor" value="${prov.id}">
//         <div class="row g-3">
//             <div class="col-md-6">
//                 <label class="form-label">Razón Social</label>
//                 <input type="text" class="form-control form-control-sm" id="edit_razon_social" value="${prov.razon_social}">
//             </div>
//             <div class="col-md-6">
//                 <label class="form-label">Tipo Proveedor</label>
//                 <select class="form-select form-select-sm" id="edit_tipo_proveedor" disabled>
//                     <option value="${prov.tipo_proveedor}">${prov.tipo_proveedor}</option>
//                 </select>
//             </div>
//             </div>

//         ${prov.tipo_proveedor === '4Pl' ? `
//             <hr>
//             <h6><span class="uil uil-map-marker"></span> Sedes Registradas</h6>
//             <table class="table table-sm" id="tabla_sedes_edit">
//                 <thead>
//                     <tr>
//                         <th>País</th>
//                         <th>Municipio</th>
//                         <th>Sede/Dirección</th>
//                         <th>Acción</th>
//                     </tr>
//                 </thead>
//                 <tbody id="tbody_sedes_edit">
//                     ${sedes.map((s, i) => `
//                         <tr id="fila_edit_${i}">
//                             <td><input type="text" class="form-control form-control-sm" value="${s.pais}" readonly></td>
//                             <td><input type="text" class="form-control form-control-sm" value="${s.nombre_municipio} - ${s.nombre_departamento}" readonly></td>
//                             <td><input type="text" class="form-control form-control-sm edit-nombre-sede" data-sede-id="${s.id}" value="${s.nombre_sede}"></td>
//                             <td><button type="button" class="btn btn-sm btn-danger" onclick="EliminarSedeBD(${s.id}, ${i})"><span class="uil uil-trash"></span></button></td>
//                         </tr>
//                     `).join('')}
//                 </tbody>
//             </table>
//             <button type="button" class="btn btn-xs btn-success" id="btn_add_sede_edit"> + Agregar Nueva Sede</button>
//         ` : ''}

//         <div class="mt-4 text-end">
//             <button type="button" class="btn btn-primary" id="btn_actualizar_proveedor">Actualizar Datos</button>
//         </div>
//     </form>`;

//   myOffcanvas.updateContent(html);
// }

function renderizarFormularioEdicion(data) {
  const prov = data.proveedor;
  const sedesActuales = data.sedes || [];

  let html = `
    <div class="container-fluid">
        <form id="form_editar_proveedor">
            <input type="hidden" id="edit_id_proveedor" value="${prov.id}">
            <div class="row">
                <div class="form-group col-md-4 mb-3">
                    <label class="control-label">Tipo Proveedor:</label>
                    <input type="text" class="form-control form-control-sm" id="edit_tipo_proveedor" value="${prov.tipo_proveedor}" readonly>
                </div>

                <div class="form-group col-md-4 mb-3">
                    <label class="control-label">(*) Tipo de Documento:</label>
                    <select class="form-control form-control-sm" id="edit_tipo_documento">
                        <option value="Natural" ${prov.tipo_documento == 'Natural' ? 'selected' : ''}>Natural</option>
                        <option value="Juridico" ${prov.tipo_documento == 'Juridico' ? 'selected' : ''}>Juridico</option>
                    </select>
                </div>

                <div class="form-group col-md-4 mb-3">
                    <label class="control-label">NIT / Documento:</label>
                    <input type="text" class="form-control form-control-sm bg-light" value="${prov.documento}" readonly>
                </div>
                <div class="form-group col-md-4 mb-3">
                    <label class="control-label">DV:</label>
                    <input type="text" class="form-control form-control-sm bg-light" value="${prov.digito_verificacion}" readonly>
                </div>

                <div class="form-group col-md-6 mb-3">
                    <label class="control-label">(*) Razón Social:</label>
                    <input type="text" class="form-control form-control-sm" id="edit_razon_social" value="${prov.razon_social}" oninput="this.value = this.value.toUpperCase();">
                </div>

                <div class="form-group col-md-6 mb-3">
                    <label class="control-label">(*) Régimen:</label>
                    <select class="form-select form-select-sm" id="edit_regimen">
                        <option value="Régimen Simplificado" ${prov.regimen == 'Régimen Simplificado' ? 'selected' : ''}>Régimen Simplificado</option>
                        <option value="Régimen Común" ${prov.regimen == 'Régimen Común' ? 'selected' : ''}>Régimen Común</option>
                        <option value="Gran Contribuyente" ${prov.regimen == 'Gran Contribuyente' ? 'selected' : ''}>Gran Contribuyente</option>
                        </select>
                </div>

                <div class="form-group col-md-4 mb-3">
                    <label class="control-label">(*) Ciudad Principal:</label>
                    <select class="form-select form-select-sm select2-edit" id="edit_slct_ciudad">
                        <option value="${prov.ciudad_id}" selected>${prov.nombre_ciudad}</option>
                    </select>
                </div>

                <div class="form-group col-md-8 mb-3">
                    <label class="control-label">(*) Dirección:</label>
                    <input type="text" class="form-control form-control-sm" id="edit_direccion" value="${prov.direccion}">
                </div>

                <div class="form-group col-md-4 mb-3">
                    <label class="control-label">(*) Teléfono:</label>
                    <input type="number" class="form-control form-control-sm" id="edit_telefono" value="${prov.telefono}">
                </div>

                <div class="form-group col-md-4 mb-3">
                    <label class="control-label">(*) Correo:</label>
                    <input type="email" class="form-control form-control-sm" id="edit_correo" value="${prov.correo}">
                </div>

                <div class="form-group col-md-4 mb-3">
                    <label class="control-label">(*) Estado:</label>
                    <select class="form-select form-select-sm" id="edit_estado_proveedor">
                        <option value="Activo" ${prov.estado_proveedor == 'Activo' ? 'selected' : ''}>Activo</option>
                        <option value="Inactivo" ${prov.estado_proveedor == 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                        <option value="Suspendido" ${prov.estado_proveedor == 'Suspendido' ? 'selected' : ''}>Suspendido</option>
                    </select>
                </div>

                <div class="form-group col-md-6 mb-3">
                    <label class="control-label">(*) Contacto:</label>
                    <input type="text" class="form-control form-control-sm" id="edit_contacto" value="${prov.contacto}">
                </div>

                <div class="form-group col-md-6 mb-3">
                    <label class="control-label">(*) Teléfono Contacto:</label>
                    <input type="number" class="form-control form-control-sm" id="edit_numero_contacto" value="${prov.numero_contacto}">
                </div>
            </div>

            ${prov.tipo_proveedor === '4Pl' ? `
                <hr>
                <div class="d-flex justify-content-between mb-2">
                    <h6><i class="uil uil-map-marker"></i> Sedes del Proveedor</h6>
                    <button type="button" class="btn btn-outline-success btn-xs" id="btn_add_sede_edit">
                        <i class="uil uil-plus"></i> Agregar Nueva Sede
                    </button>
                </div>
                <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                        <thead class="table-light">
                            <tr>
                                <th>País</th>
                                <th>Municipio</th>
                                <th>Nombre Sede / Dirección</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody id="tbody_sedes_edit">
                            ${sedesActuales.map((s, i) => `
                                <tr class="fila-sede-existente" data-id="${s.id}" data-muni-id="${s.municipio_id}">
                                    <td><input type="text" class="form-control form-control-sm bg-light" value="${s.pais}" readonly></td>
                                    <td><input type="text" class="form-control form-control-sm bg-light" value="${s.nombre_municipio} - ${s.nombre_departamento}" readonly></td>
                                    <td><input type="text" class="form-control form-control-sm edit-sede-nombre" value="${s.nombre_sede}"></td>
                                    <td class="text-center">
                                        <button type="button" class="btn btn-link text-danger p-0" onclick="borrarFilaEdicion(this)"><i class="uil uil-trash-alt"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : ''}

            <div class="row mt-4">
                <div class="col-12 text-end">
                    <button type="button" class="btn btn-primary" id="btn_actualizar_proveedor">
                        <i class="uil uil-save"></i> Guardar Cambios
                    </button>
                </div>
            </div>
        </form>
    </div>
    `;

  myOffcanvas.updateContent(html);

  // Inicializar Select2 en el campo de ciudad del editor
  $('.select2-edit').select2({ dropdownParent: $('#' + myOffcanvas.settings.id) });
}

async function Listar_proveedores() {
  try {
    const response = await fetch($('#base_url').val() + 'parametros/listar_proveedores_torre_control', {
      method: 'POST',
      // body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tbl_proveedores_torre_control');
      tbody.innerHTML = '';
      let esatdo_autorizado = '';
      let col_estatus_publicacion = '';
      let col_estatus_asignacion = '';
      let btn_Asignacion = "";
      let btn_publicacion = "";
      let col_prioridad = "";

      data.forEach(element => {
        const fila = document.createElement('tr');

        if (element.estado_proveedor === 'Activo') {
          col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado_proveedor}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_proveedor === 'Inactivo') {
          col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.estado_proveedor}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_proveedor === 'Suspendido') {
          col_estatus_publicacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">${element.estado_proveedor}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_proveedor === 'Bloqueado') {
          col_estatus_publicacion = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">${element.estado_proveedor}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        }

        // if (element.estado_asignacion === 'Pendiente') {
        //   col_estatus_asignacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${element.estado_asignacion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        // } else if (element.estado_asignacion === 'Asignado') {
        //   col_estatus_asignacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">${element.estado_asignacion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        // } else if (element.estado_asignacion === 'Cancelado') {
        //   col_estatus_asignacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">${element.estado_asignacion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        // } else if (element.estado_asignacion === 'Aceptado') {
        //   col_estatus_asignacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado_asignacion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        // } else if (element.estado_asignacion === 'Ganador') {
        //   col_estatus_asignacion = ` <span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.estado_asignacion}</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        // }

        const columnaDocumentoProveedor = document.createElement('td');
        // columnaDocumentoProveedor.innerHTML = element.documento_proveedor;
        // columnaDocumentoProveedor.innerHTML = `
        // <div class="dropdown">
        //   <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.documento_proveedor}</a>
        //   <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
        //     <a class="dropdown-item fw-bold" href="#" id="btn_ver_clientes_asignados" data-id="${element.id_proveedor}"  data-id2="${element.razon_social}" ><span class="uil uil-transaction"></span> Clientes Asignados</a>
        //    <!-- <a class="dropdown-item fw-bold" href="#" id="btn_observacion_solicitud_servicio"><span class="uil-wrap-text"></span> Detalle solicitud servicio</a>

        //     <div class="dropdown-divider"></div> 
        //     <a class="dropdown-item fw-bold" id="btn-solicitar-prioridad" href="#" data-id="${element.documento_proveedor}" data-id2="${element.documento_proveedor}"> <span class="uil uil-bell"></span> Solicitar Prioridad </a>-->
        //   </div>
        // </div>
        // `;

        columnaDocumentoProveedor.innerHTML = `
          <div class="dropdown">
            <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.documento_proveedor}</a>
            <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
              <a class="dropdown-item fw-bold" href="#" id="btn_ver_clientes_asignados" data-id="${element.id_proveedor}" data-id2="${element.razon_social}"><span class="uil uil-transaction"></span> Clientes Asignados</a>
              
              <a class="dropdown-item fw-bold text-primary" href="#" id="btn_editar_proveedor" data-id="${element.id_proveedor}"><span class="uil uil-edit"></span> Editar Proveedor</a>
            </div>
          </div>
        `;

        const columnaTipoDocumento = document.createElement('td');
        columnaTipoDocumento.innerHTML = element.tipo_documento;
        const columnaRegimenProveedor = document.createElement('td');
        columnaRegimenProveedor.innerHTML = element.regimen;
        const columnaRazonSocialProveedor = document.createElement('td');
        columnaRazonSocialProveedor.innerHTML = element.razon_social;
        const columnaCiudadProveedor = document.createElement('td');
        columnaCiudadProveedor.innerHTML = element.ciudad_proveedor;
        const columnaDireccionProveedor = document.createElement('td');
        columnaDireccionProveedor.innerHTML = element.direccion;
        const columnaTelefonoProveedor = document.createElement('td');
        columnaTelefonoProveedor.innerHTML = element.telefono;
        const columnaCorreoProveedor = document.createElement('td');
        columnaCorreoProveedor.innerHTML = element.correo;
        const columnaContactoProveedor = document.createElement('td');
        columnaContactoProveedor.innerHTML = element.contacto;
        const columnaNumeroContactoProveedor = document.createElement('td');
        columnaNumeroContactoProveedor.innerHTML = element.contacto;
        const columnaEsatdoProveedor = document.createElement('td');
        columnaEsatdoProveedor.innerHTML = col_estatus_publicacion;

        fila.appendChild(columnaDocumentoProveedor);
        fila.appendChild(columnaTipoDocumento);
        fila.appendChild(columnaRegimenProveedor);
        fila.appendChild(columnaRazonSocialProveedor);
        fila.appendChild(columnaCiudadProveedor);
        fila.appendChild(columnaDireccionProveedor);
        fila.appendChild(columnaTelefonoProveedor);
        fila.appendChild(columnaCorreoProveedor);
        fila.appendChild(columnaContactoProveedor);
        fila.appendChild(columnaNumeroContactoProveedor);
        fila.appendChild(columnaEsatdoProveedor);
        tbody.appendChild(fila);
      });
    } else {
      console.log('else');
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
    // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}

// Construir un OffCanvas
// Constructor del Offcanvas Dinámico
function DynamicOffcanvas(options) {
  // Configuración predeterminada
  var defaults = {
    id: 'dynamicOffcanvas',
    title: 'Default Title',
    content: 'Default Content',
    scroll: true,
    backdrop: false
  };

  // Fusionar opciones con defaults
  this.settings = Object.assign({}, defaults, options);

  // Inicializar
  this.initialize();
}

DynamicOffcanvas.prototype.initialize = function () {
  this.createOffcanvas();
  this.bsOffcanvas = new bootstrap.Offcanvas(this.offcanvasElement);
};

DynamicOffcanvas.prototype.createOffcanvas = function () {
  var offcanvasHTML = `
    <div class="offcanvas offcanvas-end" 
        id="${this.settings.id}" 
        data-bs-scroll="${this.settings.scroll}" 
        data-bs-backdrop="${this.settings.backdrop}" 
        tabindex="-1" 
        aria-labelledby="${this.settings.id}-label" style="width: 800px;">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title fw-bold" id="${this.settings.id}-label">
            ${this.settings.title}
          </h5>
          <button class="btn-close text-reset" type="button" data-bs-dismiss="offcanvas"></button>
        </div>
      <div class="offcanvas-body">
        ${this.settings.content}
      </div>
    </div>
`;

  var container = document.createElement('div');
  container.innerHTML = offcanvasHTML;
  this.offcanvasElement = container.firstElementChild;
  document.body.appendChild(this.offcanvasElement);
};

DynamicOffcanvas.prototype.updateContent = function (newContent) {
  var body = this.offcanvasElement.querySelector('.offcanvas-body');
  body.innerHTML = newContent;
};

DynamicOffcanvas.prototype.updateTitle = function (newTitle) {
  var title = this.offcanvasElement.querySelector('.offcanvas-title');
  title.innerHTML = newTitle;
};

DynamicOffcanvas.prototype.show = function () {
  this.bsOffcanvas.show();
};

DynamicOffcanvas.prototype.hide = function () {
  this.bsOffcanvas.hide();
};