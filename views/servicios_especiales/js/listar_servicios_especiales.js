window.VENTANA = null;
window.initScript = function (id) {

  $(".filtro_opcion").on("change", function () {

    $(".filtro_opcion").not(this).prop("checked", false);

    window.filtro_tipo = $(this).is(":checked")
      ? $(this).val()
      : null;

    // RESET TOTAL
    $("#campo-documento").hide();
    $("#filtro_clientes").hide();
    $("#filtro_servicio_especial").hide();

    switch (window.filtro_tipo) {

      case "Cliente":
        $("#filtro_clientes").show();
        cargarClientes();
        break;

      case "Servicio Especial":
        $("#filtro_servicio_especial").show();
        cargarServicios();
        break;

      case "Usuario":
        $("#filtro_usuario_creador").show();
        cargarUsuarios();
        break;

      default:
        // Remesa, Manifiesto, Todos
        $("#campo-documento").show();
        break;
    }

  });

  $("#buscar_documentos_servicio_especial").click(function () {
    let fecha_ini = $("#fecha_inicial").val();
    let fecha_fin = $("#fecha_final").val();
    let numdoc = $("#numdoc_documento").val();
    let cliente = $("#select-cliente").val();
    let servicio_especial = $("#select-servicio-especial").val();
    let usuario = $("#select-usuario-creador").val();

    if (!window.filtro_tipo) {
      Swal.fire("Atención", "Debe seleccionar un filtro.", "warning");
      return;
    }

    let datos = new FormData();
    datos.append("tipo", window.filtro_tipo);
    datos.append("fecha_ini", fecha_ini);
    datos.append("fecha_fin", fecha_fin);
    datos.append("numdoc", numdoc);
    datos.append("cliente", cliente);
    datos.append("servicio_especial", servicio_especial);
    datos.append("usuario", usuario);

    ListarServiciosEspeciales(datos);
  });
}

function cargarClientes() {
  $.ajax({
    url: $('#base_url').val() + 'servicios_especiales/listar_clientes',
    type: 'POST',
    dataType: 'json',
    success: function (data) {

      const select = $('#select-cliente');
      select.html('<option value="">Seleccione</option>');

      data.forEach(c => {
        select.append(`<option value="${c.id}">${c.nombre}</option>`);
      });

      $('#select-cliente').select2({
        placeholder: 'Seleccione una opción',
        allowClear: true
      });

    },
    error: function (err) {
      console.error("Error cargando clientes", err);
    }
  });
}

function cargarUsuarios() {
  $.ajax({
    url: `${$("#base_url").val()}servicios_especiales/ConsultaUsuario`,
    method: "POST",
    data: {},
    dataType: "json",
    success: function (data) {
      if (data) {
        data.forEach(element => {
          $("#select-usuario-creador").append(`
						<option value="${element.nom_usuario}" data-id="${element.id}">
							${element.nom_usuario}
						</option>
					`);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR, textStatus, errorThrown);
    }
  });
}

function cargarServicios() {
  $.ajax({
    url: `${$("#base_url").val()}servicios_especiales/ConsultaTipoServicio`,
    method: "POST",
    data: {},
    dataType: "json",
    success: function (data) {
      if (data) {
        data.forEach(element => {
          $("#select-servicio-especial").append(`
						<option value="${element.nombre}" data-id="${element.costo}">
							${element.nombre}
						</option>
					`);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR, textStatus, errorThrown);
    }
  });
}

async function ListarServiciosEspeciales(datos) {
  $('#loading-overlay-nexosapp').css('display', 'flex');
  try {
    const response = await fetch(
      $('#base_url').val() + 'servicios_especiales/ListarServiciosEspeciales',
      {
        method: 'POST',
        body: datos
      }
    );

    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();

    renderTablaResultados(data);

  } catch (error) {
    console.error('Error en ListarServiciosEspeciales:', error);
    Swal.fire("Error", "Hubo un problema al obtener los datos", "error");
  } finally {
    $('#loading-overlay-nexosapp').css('display', 'none');
  }
}

// function renderTablaResultados(data) {

//   const tbody = document.getElementById("tabla_documento_servicios_especiales");
//   tbody.innerHTML = ""; // limpiar tabla

//   if (!Array.isArray(data) || data.length === 0) {
//     tbody.innerHTML = `
//       <tr>
//         <td colspan="8" class="text-center text-danger">No se encontraron resultados</td>
//       </tr>
//     `;
//     return;
//   }

//   let contador = 1;

//   data.forEach(item => {

//     const tr = document.createElement("tr");

//     tr.innerHTML = `
//       <td>${contador++}</td>
//       <td>${item.placa}</td>
//       <td>${item.Poseedor}</td>
//       <td>${item.Origen}</td>
//       <td>${item.Destino}</td>
//       <td>${item.remesa_solicitud}</td>
//       <!--<td>${item.solicitudes}</td>
//       <td>${item.remesas}</td>-->
//       <td>${item.id}</td>
//       <td>${item.Fecha_Expedicion}</td>
//       <td>${item.estado === 1 ? `<span class="badge badge-phoenix badge-phoenix-success">Activo</span>` : '<span class="badge badge-phoenix badge-phoenix-danger">Inactivo</span>'}</td>

//       <td>
//         ${window.filtro_tipo === 'Manifiesto' ? `      
//           <button class="btn btn-primary btn-sm me-1 px-1 py-0" onclick="VerDetalle(${item.id})">
//             Ver Detalle
//           </button>
//           `: `<button class="btn btn-primary btn-sm me-1 px-1 py-0" onclick="VerDetalleRemesa(${item.id})">
//             Ver Detalle
//           </button>`
//       }
//       </td>

//     `;

//     tbody.appendChild(tr);
//   });
// }

function renderTablaResultados(data) {

  const tbody = document.getElementById("tabla_documento_servicios_especiales");
  tbody.innerHTML = "";

  if (!Array.isArray(data) || data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" class="text-center text-danger">
          No se encontraron resultados
        </td>
      </tr>
    `;
    return;
  }

  let contador = 1;

  data.forEach(item => {

    const tieneManifiesto = !!item.Manifiesto;
    const tieneRemesa = !!item.remesa_solicitud;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${contador++}</td>
      <td>${item.placa}</td>
      <td>${item.Poseedor}</td>
      <td>${item.Origen}</td>
      <td>${item.Destino}</td>
      <td>${item.remesa_solicitud ?? '-'}</td>
      <td>${item.Manifiesto ?? '-'}</td>
      <td>${item.Fecha_Expedicion}</td>
      <td>
        ${item.estado == 1
        ? `<span class="badge badge-phoenix badge-phoenix-success">Activo</span>`
        : `<span class="badge badge-phoenix badge-phoenix-danger">Inactivo</span>`
      }
      </td>
       <!--<td class="text-nowrap">

        BOTÓN MANIFIESTO
        <button
          class="btn btn-primary btn-sm me-1 px-1 py-0"
          ${!tieneManifiesto ? 'disabled' : ''}
          onclick="VerDetalle(${item.Manifiesto})"
          title="Ver Manifiesto">
          Manifiesto
        </button>

         BOTÓN REMESA 
        <button
          class="btn btn-success btn-sm px-1 py-0"
          ${!tieneRemesa ? 'disabled' : ''}
          onclick="VerDetalleRemesa(${item.id})"
          title="Ver Remesa">
          Remesa
        </button>

      </td>-->

            <td class="text-nowrap">
        <button class="btn btn-primary btn-sm me-1 px-1 py-0"
                ${item.tipo_documento !== 'Manifiesto' ? 'disabled' : ''}
                onclick="VerDetalle(${item.id})">
          Manifiesto
        </button>

        <button class="btn btn-success btn-sm me-1 px-1 py-0"
                ${item.tipo_documento !== 'Remesa' ? 'disabled' : ''}
                onclick="VerDetalleRemesa(${item.id})">
          Remesa
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

async function VerDetalle(id) {

  // Mostrar cargador
  $('#loading-overlay-nexosapp').css('display', 'flex');

  try {
    const response = await fetch(
      $('#base_url').val() + 'servicios_especiales/VerDetalle',
      {
        method: 'POST',
        body: new URLSearchParams({ id: id })
      }
    );

    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();

    console.log("Detalle:", data);

    renderDetalle(data);

    const offcanvas = new bootstrap.Offcanvas('#offcanvasDetalle');
    offcanvas.show();

  } catch (error) {
    console.error(error);
    Swal.fire("Error", "No fue posible obtener el detalle", "error");
  } finally {
    $('#loading-overlay-nexosapp').css('display', 'none');
  }
}

function VerDetalleRemesa(id) {
  $('#loading-overlay-nexosapp').css('display', 'flex');

  fetch($('#base_url').val() + 'servicios_especiales/VerDetalleRemesa', {
    method: 'POST',
    body: new URLSearchParams({ id: id })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Detalle Remesa:", data);
      renderDetalleRemesa(data);

      const offcanvas = new bootstrap.Offcanvas('#offcanvasDetalle');
      offcanvas.show();
    })
    .catch(err => {
      console.error(err);
      Swal.fire("Error", "No fue posible obtener los datos de la remesa", "error");
    })
    .finally(() => {
      $('#loading-overlay-nexosapp').css('display', 'none');
    });
}

function renderDetalle(data) {
  let html = "";

  html += `
    <h5 class= "text-primary fw-bold" > Datos del Manifiesto</h5>
    <p><strong>ID:</strong> ${data.manifiesto.id}</p>
    <p><strong>Placa:</strong> ${data.manifiesto.placa}</p>
    <p><strong>Origen:</strong> ${data.manifiesto.Origen}</p>
    <p><strong>Destino:</strong> ${data.manifiesto.Destino}</p>
    <hr>
  `;

  // Servicios especiales del manifiesto
  html += `<h5 class="text-success fw-bold">Servicios Especiales del Manifiesto</h5>`;
  if (data.servicios_manifiesto.length === 0) {
    html += `<p class="text-muted">No tiene servicios especiales.</p>`;
  } else {
    html += `<ul>`;
    // data.servicios_manifiesto.forEach(s => {
    //   html += `<li>${s.tipo_servicio} - $${s.valor_total}</li>`;
    // });

    data.servicios_manifiesto.forEach(s => {
      const tieneAvansat = s.numdoc_avansat !== null && s.numdoc_avansat !== '';
      html += `
        <div class="border rounded p-2 mb-2">
          <strong>${s.tipo_servicio}</strong> - $${s.valor_total}
          <div class="input-group input-group-sm mt-2">
            <input type="text" class="form-control" id="avansat-manifiesto-${s.id}" value="${s.numdoc_avansat ?? ''}" ${tieneAvansat ? `disabled` : ``} placeholder="Número Avansat">
            <button class="btn btn-primary" onclick="guardarAvansat(${s.id}, 'manifiesto')" ${tieneAvansat ? `disabled` : ``}>Guardar</button>
          </div>
        </div>
      `;
    });

    html += `</ul>`;
  }

  // Remesas
  html += `<hr> <h5 class="text-primary fw-bold">Remesas Asociadas</h5>`;
  if (data.remesas.length === 0) {
    html += `<p class= "text-muted"> Este manifiesto no tiene remesas.</p> `;
  } else {
    data.remesas.forEach(r => {
      html += `
        <div class= "border p-2 rounded mb-2">
          <p><strong>Remesa:</strong> ${r.id}</p>
          <p><strong>Fecha:</strong> ${r.fecha_creacion}</p>
          <p><strong>Estado:</strong> ${r.estado === 1 ? `<span class="badge badge-phoenix badge-phoenix-success">Activo</span>` : '<span class="badge badge-phoenix badge-phoenix-danger">Inactivo</span>'}</p>
          <h6 class="text-success">Servicios Especiales de la Remesa</h6>
      `;

      if (r.servicios.length === 0) {
        html += `<p class= "text-muted" > Sin servicios especiales.</p> `;
      } else {
        html += `<ul> `;
        // r.servicios.forEach(sr => {
        //   html += `<li> 
        //     ${sr.tipo_servicio} - $${sr.valor_total}
        //       <br>
        //     <small class="text-muted">
        //       Avansat: <strong>${sr.numdoc_avansat ?? 'N/A'}</strong>
        //     </small>
        //   </li>`;
        // });

        r.servicios.forEach(sr => {
          const tieneAvansat = sr.numdoc_avansat !== null && sr.numdoc_avansat !== '';
          html += `
            <div class="border rounded p-2 mb-2">
              <strong>${sr.tipo_servicio}</strong> - $${sr.valor_total}
              <div class="input-group input-group-sm mt-2">
                  <input type="text" class="form-control" id="avansat-remesa-${sr.id}" value="${sr.numdoc_avansat ?? ''}" ${tieneAvansat ? `disabled` : ``} placeholder="Número Avansat">
                  <button class="btn btn-success" onclick="guardarAvansat(${sr.id}, 'remesa')" ${tieneAvansat ? `disabled` : ``}>Guardar</button>
              </div>
            </div>
          `;
        });

        html += `</ul> `;
      }

      html += `</div> `;
    });
  }

  document.getElementById("contenido_detalle").innerHTML = html;
}

function renderDetalleRemesa(data) {
  let r = data.remesa;

  let html = `
        <h4 class="text-primary fw-bold">Detalle de Remesa</h4>
        <p><strong>ID Remesa:</strong> ${r.id}</p>
        <p><strong>Fecha:</strong> ${r.fecha_expedicion} ${r.hora_expedicion}</p>
        <p><strong>Estado:</strong> ${r.estado}</p>
        <hr>
    `;

  html += `<h5 class="text-success fw-bold">Servicios Especiales de la Remesa</h5>`;
  if (data.servicios_remesa.length === 0) {
    html += `<p class="text-muted">Esta remesa no tiene servicios especiales.</p>`;
  } else {
    html += `<ul>`;
    // data.servicios_remesa.forEach(s => {
    //   html += `<li>${s.tipo_servicio} - $${s.valor_total}</li>`;
    // });

    data.servicios_remesa.forEach(s => {
      const tieneAvansat = s.numdoc_avansat !== null && s.numdoc_avansat !== '';
      html += `
        <div class="border rounded p-2 mb-2">
          <strong>${s.tipo_servicio}</strong> - $${s.valor_total}
          <div class="input-group input-group-sm mt-2">
            <input type="text" class="form-control" id="avansat-remesa-${s.id}" value="${s.numdoc_avansat ?? ''}" ${tieneAvansat ? `disabled` : ``} placeholder="Número Avansat">
            <button class="btn btn-success" onclick="guardarAvansat(${s.id}, 'remesa')" ${tieneAvansat ? `disabled` : ``}>Guardar</button>
          </div>
        </div>
      `;
    });

    html += `</ul>`;
  }

  // Si la remesa tiene manifiesto → mostrarlo
  if (r.manifiesto_id) {
    html += `
            <hr>
            <h4 class="text-primary fw-bold">Manifiesto Asociado</h4>
            <p><strong>ID:</strong> ${r.manifiesto_id}</p>
            <p><strong>Placa:</strong> ${r.placa}</p>
            <p><strong>Origen:</strong> ${r.Origen}</p>
            <p><strong>Destino:</strong> ${r.Destino}</p>
            <hr>
            <h5 class="text-success fw-bold">Servicios Especiales del Manifiesto</h5>
        `;

    if (data.servicios_manifiesto.length === 0) {
      html += `<p class="text-muted">El manifiesto no tiene servicios especiales.</p>`;
    } else {
      html += `<ul>`;
      // data.servicios_manifiesto.forEach(s => {
      //   html += `<li>
      //     ${s.tipo_servicio} - $${s.valor_total}
      //     <br>
      //     <small class="text-muted">
      //       Avansat: <strong>${s.numdoc_avansat ?? 'N/A'}</strong>
      //     </small>
      //   </li>`;
      // });

      data.servicios_manifiesto.forEach(s => {
        const tieneAvansat = s.numdoc_avansat !== null && s.numdoc_avansat !== '';
        html += `
          <div class="border rounded p-2 mb-2">
            <strong>${s.tipo_servicio}</strong> - $${s.valor_total}
            <div class="input-group input-group-sm mt-2">
              <input type="text" class="form-control" id="avansat-manifiesto-${s.id}" value="${s.numdoc_avansat ?? ''}" ${tieneAvansat ? `disabled` : ``} placeholder="Número Avansat">
              <button class="btn btn-primary" onclick="guardarAvansat(${s.id}, 'manifiesto')" ${tieneAvansat ? `disabled` : ``}>Guardar</button>
            </div>
          </div>
        `;
      });

      html += `</ul>`;
    }
  }

  document.getElementById("contenido_detalle").innerHTML = html;
}

function guardarAvansat(idServicioEspecial, tipoDocumento) {

  const input = document.getElementById(`avansat-${tipoDocumento}-${idServicioEspecial}`);
  const valor = input.value.trim();

  if (!valor) {
    Swal.fire('Atención', 'Debe ingresar el número Avansat', 'warning');
    return;
  }

  const formData = new FormData();
  formData.append('id', idServicioEspecial);
  formData.append('tipo', tipoDocumento); // 👈 CLAVE
  formData.append('numdoc_avansat', valor);

  fetch($('#base_url').val() + 'servicios_especiales/guardar_avansat', {
    method: 'POST',
    body: formData
  })
    .then(r => r.json())
    .then(resp => {
      if (resp.success) {
        Swal.fire('Éxito', 'Número Avansat guardado', 'success');
      } else {
        Swal.fire('Error', resp.message || 'No se pudo guardar', 'error');
      }
    })
    .catch(() => {
      Swal.fire('Error', 'Error de conexión', 'error');
    });
}
