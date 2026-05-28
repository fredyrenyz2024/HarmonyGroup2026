window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global
  ListarRespuesasFacturas();
}


function ListarRespuesasFacturas() {
  const tbody = document.getElementById("tbody-facturas-dsnube");
  const baseUrl = $("#base_url").val(); // Asumo que tienes jQuery cargado

  // 1. Placeholder de carga
  tbody.innerHTML = `<tr><td colspan="7" class="text-muted">⏳ Cargando listado de facturas...</td></tr>`;

  // 2. Fetch al Controlador
  fetch(baseUrl + 'novedades/GetFacturacionDs', {
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
        // let totalManifiestos = 0; // 👈 Inicializar contador

        // 3. Generar filas de la tabla
        result.data.forEach((element, i) => {
          // Sumar la cantidad para el total general
          // totalManifiestos += parseInt(element.cantidad_manifiesto);
          template += `
                    <tr>
                        <td class="text-muted">${i + 1}</td>
                        <td>
                            <!--<a class="text-decoration-none fw-bold" href='#' id='btn-detalle-manifiestos'>${element.numero_factura}</a>-->
                          <div class="dropdown">
                                <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    ${element.numero_factura}
                                </a>
                                <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
                                    <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" data-ClienteId="${element.numero_factura}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDetalleFactura" aria-controls="offcanvasDetalleFactura" onclick="verDetalleFactura(${element.id})">
                                        <i class="fas fa-eye"></i> <span>Detalle Factura</span>
                                    </a>
                                    <!--<div class="dropdown-divider"></div>
                                      <a class="dropdown-item fw-bold d-flex align-items-center gap-2" href="#" data-ClienteId="${element.numero_factura}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasConfiguracionEnvios" aria-controls="offcanvasConfiguracionEnvios" id="btn_configuracion_envios">
                                          <i class="fas fa-cogs"></i> <span>Configuración Notificaciones</span>
                                      </a>-->
                                </div>
                            </div>
                        </td>
                        <td>${element.estado_instruccion}</td>
                        <td>${element.estado_rndc}</td>
                        <td>${element.numero_documento}</td>
                        <td>${element.nombre}</td>
                        <td>${element.agencia_nombre}</td>
                        <td>${element.Fecha_Instruccion}</td>
                        <td>${element.fecha_emision}</td>
                        <td class="fw-bold">${formatCOP(element.valor_total_factura)}</td>
                        <td>${element.usuario}</td>
                    </tr>
                `;
        });

        tbody.innerHTML = template;

        // 🚨 ASIGNAR EL TOTAL AL FOOTER
        // document.getElementById('total-manifiestos-general').textContent = totalManifiestos.toLocaleString();

      } else {
        // Sin datos
        tbody.innerHTML = `<tr><td colspan="7" class="alert alert-info">No se encontraron facturas.</td></tr>`;
      }
    })
    .catch(error => {
      console.error("Fetch Error:", error);
      tbody.innerHTML = `<tr><td colspan="7" class="alert alert-danger">Error al cargar la lista: ${error.message}</td></tr>`;
    });
}

function formatCOP(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor);
}


// function verDetalleFactura(idFactura) {

//   const baseUrl = $("#base_url").val();
//   const offcanvas = new bootstrap.Offcanvas('#offcanvasDetalleFactura');

//   // ============================
//   // 1️⃣ Crear FormData
//   // ============================
//   const formData = new FormData();
//   formData.append('factura_id', idFactura);

//   // ============================
//   // 2️⃣ Fetch con POST
//   // ============================
//   fetch(baseUrl + 'facturacion/GetDetalleFactura', {
//     method: 'POST',
//     body: formData
//     // headers: {
//     //   'X-Requested-With': 'XMLHttpRequest' // Laravel friendly
//     // }
//   })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Error al consultar el detalle de la factura');
//       }
//       return response.json();
//     })
//     .then(data => {

//       // ============================
//       // 3️⃣ Cabecera
//       // ============================
//       document.getElementById('df-numero').textContent = data.factura.numero;
//       document.getElementById('df-fecha').textContent = data.factura.fecha;
//       document.getElementById('df-cliente').textContent = data.factura.cliente;
//       document.getElementById('df-nit').textContent = data.factura.nit;
//       document.getElementById('df-ciudad').textContent = data.factura.ciudad;
//       document.getElementById('df-telefono').textContent = data.factura.telefono;
//       document.getElementById('df-vencimiento').textContent = data.factura.vencimiento;
//       document.getElementById('df-usuario').textContent = data.factura.usuario;

//       // ============================
//       // 4️⃣ Detalle
//       // ============================
//       let rows = '';
//       data.detalle.forEach((d, i) => {
//         rows += `
//         <tr>
//           <td>${i + 1}</td>
//           <td>${d.remesa}</td>
//           <td>${d.fecha}</td>
//           <td>${d.descripcion}</td>
//           <td class="text-end">${formatCOP(d.valor_unitario)}</td>
//           <td class="text-end">${d.cantidad}</td>
//           <td class="text-end fw-bold">${formatCOP(d.valor)}</td>
//         </tr>
//       `;
//       });
//       document.getElementById('df-detalle').innerHTML = rows;

//       // ============================
//       // 5️⃣ Totales
//       // ============================
//       document.getElementById('df-subtotal').textContent = formatCOP(data.totales.subtotal);
//       document.getElementById('df-retencion').textContent = formatCOP(data.totales.retencion);
//       document.getElementById('df-ica').textContent = formatCOP(data.totales.ica);
//       document.getElementById('df-iva').textContent = formatCOP(data.totales.iva);
//       document.getElementById('df-reteiva').textContent = formatCOP(data.totales.reteiva);
//       document.getElementById('df-total').textContent = formatCOP(data.totales.total);

//       document.getElementById('df-observaciones').textContent = data.observaciones;

//       offcanvas.show();
//     })
//     .catch(error => {
//       console.error(error);
//       alert('No fue posible cargar el detalle de la factura');
//     });
// }


function verDetalleFactura(idFactura) {

  const baseUrl = $("#base_url").val();
  const offcanvas = new bootstrap.Offcanvas('#offcanvasDetalleFactura');

  const formData = new FormData();
  formData.append('factura_id', idFactura);

  fetch(baseUrl + 'novedades/GetDetalleFactura', {
    method: 'POST',
    body: formData
  })
    .then(r => r.json())
    .then(data => {

      if (!data.success) {
        alert(data.message);
        return;
      }

      // Cabecera
      document.getElementById('df-numero').textContent = data.factura.numero_factura;
      document.getElementById('df-fecha').textContent = data.factura.fecha_emision;
      document.getElementById('df-cliente').textContent = data.factura.cliente;
      document.getElementById('df-nit').textContent = data.factura.numero_documento;
      document.getElementById('df-ciudad').textContent = data.factura.ciudad;
      document.getElementById('df-telefono').textContent = data.factura.telefono;
      document.getElementById('df-usuario').textContent = data.factura.usuario;

      // Detalle
      let rows = '';
      data.detalle.forEach((d, i) => {
        rows += `
        <tr>
          <td>${i + 1}</td>
          <td>${d.numero_remesa}</td>
          <td>${d.fecha}</td>
          <td>${d.descripcion}</td>
          <td class="text-end">${formatCOP(d.valor_unitario)}</td>
          <td class="text-end">${d.cantidad}</td>
          <td class="text-end fw-bold">${formatCOP(d.valor_unitario)}</td>
        </tr>
      `;
      });
      document.getElementById('df-detalle').innerHTML = rows;

      // Totales
      document.getElementById('df-subtotal').textContent = formatCOP(data.totales.subtotal);
      document.getElementById('df-total').textContent = formatCOP(data.totales.total);

      document.getElementById('df-observaciones').textContent = data.observaciones;

      offcanvas.show();
    });
}
