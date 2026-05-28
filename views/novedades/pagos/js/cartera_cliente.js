window.VENTANA = null;

window.initScript = function (id) {
  window.VENTANA = id;
  Lista_general_manifiestos();

  // JS (Listener Corregido)

  document.addEventListener("click", async e => {

    if (e.target.matches(`#btn-detalle-remesas`) || e.target.matches(`#btn-detalle-remesas *`)) {
      let Boton = e.target.closest(`#btn-detalle-remesas`);
      const nitTitular = Boton.getAttribute('data-nit-titular');
      const Nombre_Cliente = Boton.getAttribute('data-Nombre_Cliente');
      const Celular = Boton.getAttribute('data-celular');
      const Ciudad = Boton.getAttribute('data-Ciudad');
      const IdCliente = Boton.getAttribute('data-IdCliente'); // 🛑 Variable Obtenida

      if (!nitTitular || !IdCliente) {
        Swal.fire('Error', 'Falta el NIT/CC o el ID de Cliente.', 'error');
        return;
      }

      Swal.fire({
        title: 'Cargando Detalle...',
        icon: 'info',
        showConfirmButton: false
      });

      try {
        const formData = new FormData();
        // 🛑 CORRECCIÓN DE ENVÍO: Enviamos el ID del cliente. El backend debe esperar 'cliente_id'.
        // Mantengo 'nit_titular' como clave para no cambiar el backend, pero envío el ID del cliente.
        formData.append('nit_titular', IdCliente);

        const response = await fetch($('#base_url').val() + 'novedades/obtenerDetalleRemesas', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        Swal.close();

        if (result.status === true) {
          // 🛑 CORRECCIÓN DE LLAMADA: Pasamos las variables que TENEMOS.
          // Usamos los datos del botón (Nombre, Celular, Ciudad) para el encabezado.
          const htmlDetalle = generarHtmlDetalleRemesas(
            result.data,
            nitTitular, // Documento del cliente (para el título)
            Nombre_Cliente,
            Ciudad,
            Celular
            // No se pasan variables indefinidas como 'tenedor', 'conductor', etc.
          );

          // 2. Inyectar y mostrar el offcanvas
          const offcanvasEl = document.getElementById('offcanvasDetalleCarteraClientes');
          const contentDiv = document.getElementById('detalleManifiestoContent');

          if (contentDiv) {
            contentDiv.innerHTML = htmlDetalle;

            // Actualizar el título del offcanvas
            document.getElementById('offcanvasDetalleLabel').textContent = `Remesas de ${Nombre_Cliente} (${nitTitular})`;

            // Mostrar el offcanvas (asumiendo Bootstrap 5)
            const bsOffcanvas = new bootstrap.Offcanvas(offcanvasEl);
            bsOffcanvas.show();

          } else {
            Swal.fire('Error', 'Contenedor de detalle no encontrado.', 'error');
          }

        } else {
          Swal.fire('Error', result.message || 'No se pudo cargar el detalle de remesas.', 'error');
        }

      } catch (error) {
        Swal.fire('Error de Conexión', 'Fallo al comunicarse con el servidor.', 'error');
        console.error('Fetch error:', error);
      }
    }

    if (e.target.matches('#btn-moviento-cartera') || e.target.matches('#btn-moviento-cartera *')) {
      const IdCliente = e.target.getAttribute('data-IdCliente');

      if (!IdCliente) {
        Swal.fire('Error', 'ID de cliente no disponible para ver el histórico.', 'error');
        return;
      }

      Swal.fire({ title: 'Cargando Histórico...', icon: 'info', showConfirmButton: false, allowOutsideClick: false });

      try {
        const formData = new FormData();
        formData.append('id_cliente', IdCliente);

        const response = await fetch($('#base_url').val() + 'novedades/obtenerHistoricoMovimientos', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        Swal.close();

        if (result.status === true) {
          // 1. Renderizar el informe en el offcanvas
          renderizarInformeMovimientos(result.data);

          // 2. Mostrar el offcanvas
          const offcanvasEl = document.getElementById('offcanvasHistoricoCartera');
          if (offcanvasEl) {
            const bsOffcanvas = new bootstrap.Offcanvas(offcanvasEl);
            bsOffcanvas.show();
          }

        } else {
          Swal.fire('Error', result.message || 'No se pudo cargar el historial de movimientos.', 'error');
        }

      } catch (error) {
        Swal.fire('Error de Conexión', 'Fallo al comunicarse con el servidor.', 'error');
        console.error('Fetch error:', error);
      }
    }
  });


  // --------------------------------------------------------------------------------------------------
  // 🛑 AÑADE ESTE LISTENER DE BÚSQUEDA EN TU SCRIPT PRINCIPAL (donde tienes document.addEventListener)
  // --------------------------------------------------------------------------------------------------

  // JS (Listener de Filtro Instantáneo)

  document.addEventListener('input', function (e) {
    if (e.target.matches('#input-buscar-remesa')) {
      const query = e.target.value.toLowerCase().trim();
      const tabla = document.getElementById('tabla-remesas-detalle');

      if (!tabla) return;

      const filas = tabla.querySelectorAll('tbody tr');
      let filasVisibles = 0;

      filas.forEach(fila => {
        // Unir el texto de las celdas clave (Remesa, Placa, Origen, Destino, Agencia)
        // 🛑 NOTA: Los índices deben coincidir con tu tabla (Remesa es td[1], Placa es td[3], etc.)
        const contenidoFila = [
          fila.cells[1]?.textContent, // Remesa
          fila.cells[3]?.textContent, // Placa
          fila.cells[5]?.textContent, // Origen
          fila.cells[6]?.textContent, // Destino
          fila.cells[7]?.textContent  // Agencia
        ].join(' ').toLowerCase();

        // Lógica de mostrar/ocultar
        const esVisible = contenidoFila.includes(query);
        fila.style.display = esVisible ? '' : 'none';

        if (esVisible) {
          filasVisibles++;
        }
      });

      // Opcional: Actualizar el mensaje de conteo
      console.log(`Filtro aplicado: ${filasVisibles} remesas visibles.`);

      // 🛑 Lógica adicional: Re-evaluar el total si las filas ocultas no están deseleccionadas
      // (Esto es CRÍTICO para un filtro cliente-side, se debe llamar a recalcular)
      recalcularTotalRemesas();
    }
  });

}

// JavaScript (JS)
function Lista_general_manifiestos() {

  const tbody = document.getElementById("tbody-clientes-general");
  const baseUrl = $("#base_url").val(); // Asumo que tienes jQuery cargado

  // 1. Placeholder de carga
  tbody.innerHTML = `<tr><td colspan="7" class="text-muted">⏳ Cargando listado de pagos generales...</td></tr>`;

  // 2. Fetch al Controlador
  fetch(baseUrl + 'novedades/obtenerListaGeneralRemesas', {
    method: 'POST',
    cache: 'no-cache',
    // No enviamos body porque el modelo no necesita parámetros
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor: ' + response.statusText);
      }
      return response.json();
    })
    .then(result => {
      if (result.status && result.data && result.data.length > 0) {

        let template = '';
        let totalRemesas = 0; // 👈 Inicializar contador
        let col_estatus_trazabilidad = "";
        // 3. Generar filas de la tabla
        result.data.forEach(element => {
          const estado = obtenerEstadoTrazabilidad(element.Estado_Cliente);
          col_estatus_trazabilidad = createBadge(estado.texto, estado.color);

          // Sumar la cantidad para el total general
          totalRemesas += parseInt(element.Total_Remesas);
          template += `
                    <tr>
                        <td>
                            <!--<a class="text-decoration-none fw-bold" href='#' id='btn-detalle-remesas' data-nit-titular='${element.Documento_Cliente}' data-Nombre_Cliente='${element.Nombre_Cliente}' 
                            data-celular='${element.telefono}' data-Ciudad='${element.Ciudad}' data-IdCliente='${element.ID_Cliente}'>${element.Documento_Cliente}</a>-->

                          <div class="dropdown">
                            <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${element.Documento_Cliente}</a>
                            <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
                              <a class="dropdown-item fw-bold" href="#" id='btn-detalle-remesas' data-nit-titular='${element.Documento_Cliente}' data-Nombre_Cliente='${element.Nombre_Cliente}' 
                                  data-celular='${element.telefono}' data-Ciudad='${element.Ciudad}' data-IdCliente='${element.ID_Cliente}'>Gestionar Cartera</a>

                              <a class="dropdown-item fw-bold" href="#" id="btn-moviento-cartera" data-nit-titular='${element.Documento_Cliente}' data-Nombre_Cliente='${element.Nombre_Cliente}' 
                                  data-celular='${element.telefono}' data-Ciudad='${element.Ciudad}' data-IdCliente='${element.ID_Cliente}'>Movimientos Cartera</a>

                              <!--<a class="dropdown-item fw-bold" href="#">Something else here</a>

                              <div class="dropdown-divider"></div>
                              <a class="dropdown-item fw-bold" href="#">Separated link</a>-->
                            </div>
                          </div>
                    
                        </td>
                        <td>${element.Nombre_Cliente}</td>
                        <td>${element.direccion}</td>
                        <td>${element.telefono}</td>
                        <td>${element.Ciudad}</td>
                        <td>${col_estatus_trazabilidad}</td>
                        <td class="fw-bold">${element.Total_Remesas}</td>
                    </tr>
                  `;
        });

        tbody.innerHTML = template;

        // 🚨 ASIGNAR EL TOTAL AL FOOTER
        document.getElementById('total-remesas-general').textContent = totalRemesas.toLocaleString();

      } else {
        // Sin datos
        tbody.innerHTML = `<tr><td colspan="7" class="alert alert-info">No se encontraron manifiestos con pagos.</td></tr>`;
      }
    })
    .catch(error => {
      console.error("Fetch Error:", error);
      tbody.innerHTML = `<tr><td colspan="7" class="alert alert-danger">Error al cargar la lista: ${error.message}</td></tr>`;
    });
}

// Función para obtener el estado corregido
function obtenerEstadoTrazabilidad(tipoTrazabilidad) {
  let textoTrazabilidad = tipoTrazabilidad;

  // Devolvemos el texto corregido y el color
  return {
    texto: textoTrazabilidad,
    color: window.estadosTrazabilidad[textoTrazabilidad] || 'secondary'
  };
}

window.estadosTrazabilidad = {
  'Activo': 'success',
  'Inactivo': 'danger',
};

// Función para crear badge
function createBadge(text, type) {
  return `
    <span class="badge badge-phoenix fs-10 badge-phoenix-${type}">
      <span class="badge-label">${text}</span>
      <span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span>
    </span>`;
}

// JS

/**
 * Genera el HTML del detalle de remesas (tabla de manifiestos/pagos).
 *
 * @param {Array} manifiestos - Datos de manifiestos/pagos/remesas.
 * @param {string} nit_cliente - Documento del cliente (del botón).
 * @param {string} nombre_cliente - Nombre del cliente (del botón).
 * @param {string} ciudad_cliente - Ciudad del cliente (del botón).
 * @param {string} telefono_cliente - Teléfono del cliente (del botón).
 * @returns {string} HTML del detalle.
 */
function generarHtmlDetalleRemesas(manifiestos, nit_cliente, nombre_cliente, ciudad_cliente, telefono_cliente) {

  if (manifiestos.length === 0) {
    return `<div class="alert alert-warning">No se encontraron manifiestos asociados al documento ${nit_cliente}.</div>`;
  }

  // 1. ESTRUCTURA DEL ENCABEZADO Y ÁREA DE TOTALIZACIÓN
  let headerHTML = `
        <h5 class="fw-bold text-primary mb-3">${nombre_cliente} (${nit_cliente})</h5>
        <table class="table table-sm mb-4 detail-header-table" style="font-size: 0.9rem;">
            <tbody>
                <tr>
                    <td class="fw-bold" style="width: 20%;">Teléfono:</td>
                    <td style="width: 30%;">${telefono_cliente || 'N/A'}</td>
                    <td class="fw-bold" style="width: 20%;">Ciudad:</td>
                    <td>${ciudad_cliente || 'N/A'}</td>
                </tr>
            </tbody>
        </table>
        
        <!--<div id="contenedor-pago-dinamico" class="d-flex justify-content-end p-2 border rounded bg-light mb-3" style="display: none;">
            <div class="d-flex align-items-center">
                <span class="fw-bold me-3">TOTAL: <span id="total-seleccionado" class="text-success fs-5">$0</span></span>
                <button class="btn btn-success btn-sm px-4" id="btn-procesar-pago" type="button">Pagar Seleccionado</button>
            </div>
        </div>-->

        <div id="contenedor-pago-dinamico" class="alert alert-secondary d-flex justify-content-between align-items-center p-2 mb-3" style="display: none;">
            <span class="fw-bold">TOTAL SELECCIONADO: <span id="total-seleccionado" class="text-primary fs-5">$0</span></span>
            <button class="btn btn-success btn-sm px-4" id="btn-procesar-pago" type="button">Pagar Remesas Seleccionadas</button>
        </div>
        
        <div class="d-flex justify-content-between align-items-center mb-3">
            
            <h5 class="fw-bold text-primary my-0">Remesas Asociadas: (${manifiestos.length})</h5>
            
            <div style="width: 280px; flex-shrink: 0;">
                <input type="text" id="input-buscar-remesa" class="form-control form-control-sm" placeholder="Buscar Remesa, Placa o Ruta...">
            </div>
            
        </div>
    `;

  // 2. ESTRUCTURA DE LA TABLA DE MANIFIESTOS
  let tableHTML = `
        <div class="table-responsive">
            <table class="table table-bordered table-striped table-sm text-center" style="font-size: 0.85rem;" id="tabla-remesas-detalle">
                <thead class="table-primary">
                    <tr>
                        <th style="width: 50px; white-space: nowrap;"></th>
                        <th style="width: auto; white-space: nowrap;">Remesa</th>
                        <th style="width: auto; white-space: nowrap;">Total Remesa</th>
                        <th style="width: auto; white-space: nowrap;">Placa</th>
                        <th style="width: auto; white-space: nowrap;">Fecha Exp.</th>
                        <th style="width: auto; white-space: nowrap;">Origen</th>
                        <th style="width: auto; white-space: nowrap;">Destino</th>
                        <th style="width: auto; white-space: nowrap;">Agencia</th>
                    </tr>
                </thead>
                <tbody>
    `;

  // 3. Llenado de filas
  manifiestos.forEach(m => {
    // Formatear la tarifa para el atributo de datos
    const tarifaLimpia = parseFloat(m.total_tarifa || 0);

    tableHTML += `
            <tr>
                <td style="width: auto; white-space: nowrap;">
                    <div class="form-check form-switch">
                      <input class="form-check-input remesa-check" 
                             type="checkbox" 
                             data-remesa-id="${m.ID_Remesa}"
                             data-valor="${tarifaLimpia}" 
                             data-manifiesto-id="${m.id}" /> 
                    </div>
                </td>
                <td style="width: auto; white-space: nowrap;">${m.ID_Remesa}</td>
                <td class="remesa-valor" data-valor-display="${tarifaLimpia}" style="width: auto; white-space: nowrap;">
                    ${tarifaLimpia.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                </td>
                <td style="width: auto; white-space: nowrap;">${m.placa}</td>
                <td style="width: auto; white-space: nowrap;">${m.fecha_expedicion}</td>
                <td style="width: auto; white-space: nowrap;">${m.Origen}</td>
                <td style="width: auto; white-space: nowrap;">${m.Destino}</td>
                <td style="width: auto; white-space: nowrap;">${m.Agencia}</td>
            </tr>
        `;
  });

  tableHTML += `</tbody></table></div>`; // Cierre de tabla y div responsive

  // 4. Devolver el encabezado y la tabla combinados
  // 🛑 IMPORTANTE: Retornamos el HTML y, al final del listener de clic, inicializamos la lógica.
  return headerHTML + tableHTML;
}

// -----------------------------------------------------------------------------------
// 🛑 FUNCIONES DE CÁLCULO Y MANEJO DE EVENTOS (Debe ir en tu archivo principal JS)
// -----------------------------------------------------------------------------------

/**
 * Recalcula el total de las remesas seleccionadas y actualiza la UI.
 */
function recalcularTotalRemesas() {
  let total = 0;
  const checksSeleccionados = document.querySelectorAll('#tabla-remesas-detalle .remesa-check:checked');
  const contenedorPago = $('#contenedor-pago-dinamico');

  checksSeleccionados.forEach(check => {
    const valor = parseFloat(check.dataset.valor);
    if (!isNaN(valor)) {
      total += valor;
    }
  });

  // 1. Actualizar el display del total
  $('#total-seleccionado').text(total.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }));

  // 2. Mostrar/Ocultar el área de pago
  if (total > 0) {
    contenedorPago.slideDown(200);
  } else {
    contenedorPago.slideUp(200);
  }
}

// 🛑 Listener de Cambio de Checkbox (Debe ir en el document.addEventListener("click",...) principal)
// Se inicializa después de que el offcanvas se haya mostrado y el HTML se haya inyectado.
document.addEventListener('change', function (e) {
  if (e.target.matches('.remesa-check')) {
    recalcularTotalRemesas();
  }
});

// 🛑 Listener del Botón de Pagar (Guarda el total y los IDs)
// JS (Fragmento del Listener de Pago Completo)

// 🛑 Listener del Botón de Pagar (Guarda el total y los IDs)
document.addEventListener('click', function (e) {
  if (e.target.matches('#btn-procesar-pago')) {
    const checksSeleccionados = document.querySelectorAll('#tabla-remesas-detalle .remesa-check:checked');
    const remesasIds = Array.from(checksSeleccionados).map(check => check.dataset.remesaId);
    const manifiestosIds = Array.from(checksSeleccionados).map(check => check.dataset.manifiestoId);

    // 🛑 CLAVE: Obtener los valores individuales limpios (data-valor)
    const remesasValores = Array.from(checksSeleccionados).map(check => parseFloat(check.dataset.valor));

    // El totalFinal (formateado) se usa solo para el Swal
    const totalFinalDisplay = $('#total-seleccionado').text();

    // 🛑 Obtener el ID del cliente del primer elemento que lo contenga (ej. el botón de detalle)
    const nitTitular = document.querySelector('[data-nit-titular]').getAttribute('data-nit-titular');
    const idCliente = document.querySelector('[data-idcliente]').getAttribute('data-idcliente');

    // Sumar los valores limpios para tener el total numérico exacto
    const totalPagadoLimpio = remesasValores.reduce((sum, value) => sum + value, 0);

    if (remesasIds.length > 0) {
      Swal.fire({
        title: `Confirmar Pago`,
        html: `¿Desea procesar el pago por un total de <strong>${totalFinalDisplay}</strong> para ${remesasIds.length} remesa(s)?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, Pagar',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {

          // 🛑 LLAMADA FINAL CON VALORES INDIVIDUALES Y ID DEL CLIENTE
          // Debemos llamar a una función que contenga el fetch
          procesarPagoMasivoFetch(
            idCliente,
            remesasIds,
            manifiestosIds,
            remesasValores,
            totalPagadoLimpio
          );
        }
      });
    }
  }
});

// 🛑 ADAPTAR LA FUNCIÓN FETCH PARA ENVIAR TODOS LOS DATOS
async function procesarPagoMasivoFetch(idCliente, remesasIds, manifiestosIds, remesasValores, totalPagadoLimpio) {
  const formData = new FormData();
  // Enviamos los arrays de IDs y el total
  formData.append('id_cliente', idCliente); // 🛑 ID del Cliente
  formData.append('remesas_ids', JSON.stringify(remesasIds));
  formData.append('manifiestos_ids', JSON.stringify(manifiestosIds));
  formData.append('remesas_valores', JSON.stringify(remesasValores)); // 🛑 Valores individuales
  formData.append('total_pagado', totalPagadoLimpio); // Total numérico

  Swal.fire({
    title: 'Procesando pago...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    const response = await fetch($('#base_url').val() + 'novedades/procesarPagoMasivo', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    Swal.close();

    if (result.status === true) {
      Swal.fire('¡Pago Exitoso!', result.message, 'success');

      // 🛑 ACCIÓN CLAVE: Recargar el detalle de remesas para que las pagadas desaparezcan
      const nitTitular = document.querySelector('[data-nit-titular]').getAttribute('data-nit-titular'); // Obtener NIT actual

      // 🛑 ACCIÓN 1: CERRAR EL OFFCANVAS
      const offcanvasEl = document.getElementById('offcanvasDetalleCarteraClientes');
      if (offcanvasEl) {
        // Obtener o crear la instancia de Bootstrap Offcanvas
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl);
        bsOffcanvas.hide();
      }

      // 🛑 ACCIÓN 2: LISTAR LA TABLA GENERAL
      // Esta función recarga la tabla de la vista principal, mostrando el saldo actualizado.
      Lista_general_manifiestos();

    } else {
      Swal.fire('Error de Pago', result.message, 'error');
    }
  } catch (error) {
    Swal.close();
    Swal.fire('Error de Conexión', 'Fallo al comunicarse con el servidor para el pago.', 'error');
    console.error('Error en procesarPagoMasivo:', error);
  }
}

// JS

// 🛑 FUNCIÓN DE RENDERIZADO DEL INFORME
// JS

// 🛑 FUNCIÓN DE RENDERIZADO DEL INFORME
function renderizarInformeMovimientos(data) {
  const contenedor = document.getElementById('historicoCarteraContent');

  if (!data || data.length === 0) {
    contenedor.innerHTML = '<div class="alert alert-info">No se encontraron movimientos de cartera para este cliente.</div>';
    return;
  }

  // 🛑 Mostrar información general del cliente (Obtenida del primer registro)
  const primerItem = data[0];
  let infoClienteHTML = `
        <div class="alert alert-dark p-2 mb-3">
            <span class="fw-bold me-3">CLIENTE:</span> ${primerItem.Nombre_Cliente} 
            <span class="text-muted ms-3">| NIT/CC:</span> ${primerItem.Documento_Cliente}
        </div>
    `;

  let html = `
        <table class='table table-bordered table-striped table-sm' id="tabla-movimientos-cartera" style="font-size: 11px;">
            <thead class="table-dark">
                <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Saldo Anterior</th>
                    <th>Valor Mov.</th>
                    <th>Saldo Nuevo</th>
                    <th>Usuario</th>
                </tr>
            </thead>
            <tbody>
    `;

  data.forEach(item => {
    const valorMovimiento = Number(item.valor_movimiento).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 });
    const saldoAnterior = Number(item.saldo_anterior).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 });
    const saldoNuevo = Number(item.saldo_nuevo).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 });

    const isPago = item.tipo_movimiento === 'PAGO';
    const colorClass = isPago ? 'text-danger fw-bold' : 'text-success fw-bold';

    let detalleRemesasHTML = '';

    // 🛑 Lógica para el DETALLE DE REMESAS (Subtabla)
    if (isPago && item.detalle_remesas.length > 0) {
      let remesasRows = '';
      let totalRemesasPagadas = 0;

      item.detalle_remesas.forEach(remesa => {
        const valor = Number(remesa.valor_remesa).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 });
        totalRemesasPagadas += Number(remesa.valor_remesa);
        remesasRows += `
                    <tr>
                        <td>#${remesa.id_remesa}</td>
                        <td>Manif: #${remesa.id_manifiesto}</td>
                        <td class="text-end">${valor}</td>
                    </tr>
                `;
      });

      detalleRemesasHTML = `
                <div class="p-2 bg-white border mt-1">
                    <p class="fw-bold mb-1 text-primary">Remesas Pagadas (${item.detalle_remesas.length}):</p>
                    <table class="table table-sm mb-0 table-borderless" style="font-size: 10px;">
                        <thead class="bg-light"><th>Remesa</th><th>Manifiesto</th><th>Valor</th></thead>
                        <tbody>${remesasRows}</tbody>
                        <tfoot>
                            <tr class="fw-bold text-success">
                                <td colspan="2">TOTAL PAGO:</td>
                                <td class="text-end">${Number(totalRemesasPagadas).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 })}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `;
    }

    html += `
            <tr class="${isPago ? 'table-warning' : ''}">
                <td>${item.fecha_movimiento}</td>
                <td><span class="badge bg-secondary">${item.tipo_movimiento}</span></td>
                <td>${saldoAnterior}</td>
                <td class="${colorClass}">${valorMovimiento}</td>
                <td>${saldoNuevo}</td>
                <td>${item.usuario_gestion}</td>
            </tr>
            ${detalleRemesasHTML ? `<tr class="bg-light"><td colspan="6">${detalleRemesasHTML}</td></tr>` : ''}
        `;
  });

  html += `</tbody></table>`;
  contenedor.innerHTML = infoClienteHTML + html;
}


// JS

// ----------------------------------------------------------------------
// 🛑 FUNCIONES DE EXPORTACIÓN
// ----------------------------------------------------------------------

/**
 * Exporta el contenido visible de la tabla de movimientos a un archivo Excel (.xlsx).
 * Requiere la librería SheetJS (xlsx.js).
 */
function exportarMovimientosAExcel() {
  // 1. Obtener la tabla por su ID
  const tabla = document.getElementById('tabla-movimientos-cartera');

  if (!tabla || typeof XLSX === 'undefined') {
    Swal.fire('Error', 'La tabla o la librería XLSX no están disponibles.', 'error');
    return;
  }

  // 2. Clonar la tabla para manipular y excluir filas de detalle (opcional)
  const clonedTable = tabla.cloneNode(true);

  // Si tienes filas de detalle anidadas (<tr> con colspan > 1), debes limpiarlas
  // En tu caso, las filas de detalle de remesas anidadas deben ser eliminadas.
  const detailRows = clonedTable.querySelectorAll('tr[class="bg-light"]');
  detailRows.forEach(row => row.remove());

  // 3. Crear el libro de trabajo (Workbook) y exportar
  var wb = XLSX.utils.table_to_book(clonedTable, {
    sheet: "Movimientos",
    raw: false, // Mantener formato si es necesario
    dateNF: 'yyyy-mm-dd'
  });

  const fechaActual = new Date().toISOString().slice(0, 10);
  const nombreArchivo = `Historico_Cartera_${fechaActual}.xlsx`;

  XLSX.writeFile(wb, nombreArchivo);
  Swal.fire('Éxito', 'Exportación a Excel iniciada.', 'success');
}


/**
 * Exporta el contenido de la tabla de movimientos a un archivo PDF.
 * Requiere las librerías jsPDF y html2canvas.
 */
// function exportarMovimientosAPDF() {
//   const tabla = document.getElementById('tabla-movimientos-cartera');

//   if (!tabla || typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
//     Swal.fire('Error', 'Las librerías de exportación (jsPDF/html2canvas) no están disponibles.', 'error');
//     return;
//   }

//   Swal.fire({ title: 'Generando PDF...', showConfirmButton: false, allowOutsideClick: false, didOpen: () => Swal.showLoading() });

//   // Clonar y limpiar las filas de detalle antes de la impresión
//   const clonedTable = tabla.cloneNode(true);
//   const detailRows = clonedTable.querySelectorAll('tr[class="bg-light"]');
//   detailRows.forEach(row => row.remove());

//   html2canvas(clonedTable, {
//     scale: 2, // Aumenta la calidad
//     ignoreElements: (element) => element.tagName === 'BUTTON' // Ignorar botones
//   }).then(canvas => {
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jspdf.jsPDF('l', 'mm', 'a4'); // 'l' = landscape, A4
//     const imgWidth = 280; // Ancho para landscape A4
//     const pageHeight = 210;
//     const imgHeight = canvas.height * imgWidth / canvas.width;
//     let heightLeft = imgHeight;

//     let position = 0;

//     pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
//     heightLeft -= pageHeight;

//     while (heightLeft >= 0) {
//       position = heightLeft - imgHeight + 10;
//       pdf.addPage();
//       pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }

//     Swal.close();
//     const fechaActual = new Date().toISOString().slice(0, 10);
//     pdf.save(`Historico_Cartera_${fechaActual}.pdf`);
//   }).catch(error => {
//     Swal.fire('Error', 'Fallo al generar el PDF.', 'error');
//     console.error('PDF Generation Error:', error);
//   });
// }

// // ----------------------------------------------------------------------
// // 🛑 LISTENERS DE EXPORTACIÓN (Conexión con los botones del Offcanvas)
// // ----------------------------------------------------------------------

// document.addEventListener('click', function (e) {
//   if (e.target.matches('#btn-exportar-excel-movs')) {
//     exportarMovimientosAExcel();
//   }
//   if (e.target.matches('#btn-exportar-pdf-movs')) {
//     exportarMovimientosAPDF();
//   }
// });