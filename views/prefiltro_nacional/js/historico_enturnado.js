window.VENTANA = null;
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID de la ventana a la variable global
  listarVehiculosEnturnados();
}

async function listarVehiculosEnturnados() {
  try {
    const response = await fetch($('#base_url').val() + 'prefiltro_nacional/Listar_Vehiculos_Historico_Enturnados');
    const json = await response.json();

    const tbody = document.getElementById('tbl-vehiculos-enturnado-historico');
    tbody.innerHTML = '';

    if (json.status && json.data.length > 0) {
      json.data.forEach(v => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                    <td>${v.placa_vehiculo || '-'}</td>
                    <td>${v.conductor || '-'}</td>
                    <td>${v.celular || '-'}</td>
                    <td>${v.ubicacion_actual || '-'}</td>
                    <td>${v.agencia || '-'}</td>
                    <!--<td>${v.solicitud_servicio || '-'}</td>-->
                    <td>${v.Origen || '-'}</td>
                    <td>${v.Destino || '-'}</td>
                    <td>${v.usuario || '-'}</td>
                    <td>${v.estado || '-'}</td>
                `;
        tbody.appendChild(tr);
      });
    } else {
      tbody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center text-muted">No hay vehículos enturnados.</td>
                </tr>`;
    }
  } catch (error) {
    console.error('Error al listar:', error);
  }
}
