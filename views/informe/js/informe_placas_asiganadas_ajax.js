const d = document;
const w = window;
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();

  d.addEventListener('click', async e => {
    if (e.target.matches('#aplicar_filtro') || e.target.matches('#aplicar_filtro *')) {
      try {
        $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
        let data = new FormData();
        data.append('fecha_inicial', d.getElementById('fecha_inicial').value);
        data.append('fecha_final', d.getElementById('fecha_final').value);
        await fetch($('#id_url_ajax').val() + 'informe/listar_placas_asignadas', {
          method: 'POST',
          cache: 'no-cache',
          body: data,
        })
          .then(response => {
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
          })
          .then(function(data) {
            cont = 0;
            let tbody = d.getElementById('tbl_informe_placa');
            tbody.innerHTML = '';
            if (data != '') {
              data.resultado.forEach(element => {
                const fila = d.createElement('tr');
                // const columnaNumpedido = d.createElement("td");
                // columnaNumpedido.innerHTML = element.numdoc ? element.numdoc : "Sin registro";
                // columnaNumpedido.style.borderBottom = "1px #F5F5F5 solid";
                // columnaNumpedido.style.borderRight = "1px #F5F5F5 solid";
                // columnaNumpedido.style.textAlign = "center";
                // columnaNumpedido.style.fontWeight = "bold";

                const columnaSolicitud = d.createElement('td');
                columnaSolicitud.innerHTML = element.nundoc_solicitud ? element.nundoc_solicitud : 'Sin registro';
                columnaSolicitud.style.borderBottom = '1px #F5F5F5 solid';
                columnaSolicitud.style.borderRight = '1px #F5F5F5 solid';
                columnaSolicitud.style.textAlign = 'center';
                columnaSolicitud.style.fontWeight = 'bold';

                const columnaCliente = d.createElement('td');
                columnaCliente.innerHTML = element.nombre;
                columnaCliente.style.borderBottom = '1px #F5F5F5 solid';
                columnaCliente.style.borderRight = '1px #F5F5F5 solid';
                columnaCliente.style.textAlign = 'center';

                const columnaOrigen = d.createElement('td');
                columnaOrigen.innerHTML = element.ORIGEN ? element.ORIGEN : 'Sin registro';
                columnaOrigen.style.borderBottom = '1px #F5F5F5 solid';
                columnaOrigen.style.borderRight = '1px #F5F5F5 solid';
                columnaOrigen.style.textAlign = 'center';

                const columnaDestino = d.createElement('td');
                columnaDestino.innerHTML = element.DESTINO ? element.DESTINO : 'Sin registro';
                columnaDestino.style.borderBottom = '1px #F5F5F5 solid';
                columnaDestino.style.borderRight = '1px #F5F5F5 solid';
                columnaDestino.style.textAlign = 'center';

                const columnaFechaSolicitudVehiculo = d.createElement('td');
                columnaFechaSolicitudVehiculo.innerHTML = element.fecha_estudio_vehiculos ? element.fecha_estudio_vehiculos : 'Sin registro';
                columnaFechaSolicitudVehiculo.style.borderBottom = '1px #F5F5F5 solid';
                columnaFechaSolicitudVehiculo.style.borderRight = '1px #F5F5F5 solid';
                columnaFechaSolicitudVehiculo.style.textAlign = 'center';

                const columnaFechaAsignacionVehiculo = d.createElement('td');
                columnaFechaAsignacionVehiculo.innerHTML = element.fecha_asignacion_placa ? element.fecha_asignacion_placa : 'Sin registro';
                columnaFechaAsignacionVehiculo.style.borderBottom = '1px #F5F5F5 solid';
                columnaFechaAsignacionVehiculo.style.borderRight = '1px #F5F5F5 solid';
                columnaFechaAsignacionVehiculo.style.textAlign = 'center';

                const columnaFechaManifiesto = d.createElement('td');
                columnaFechaManifiesto.innerHTML = element.fecha_expedicion_manifiesto ? element.fecha_expedicion_manifiesto + ' KG' : 'Sin registro';
                columnaFechaManifiesto.style.borderBottom = '1px #F5F5F5 solid';
                columnaFechaManifiesto.style.borderRight = '1px #F5F5F5 solid';
                columnaFechaManifiesto.style.textAlign = 'center';

                const columnaClase = d.createElement('td');
                // columnaClase.innerHTML = element.clase ? element.clase : "Sin registro";
                if (element.placa) {
                  columnaClase.innerHTML = element.clase;
                } else {
                  columnaClase.style.color = '#E53935';
                  // columnaClase.style.color = '#FFFFFF';
                  columnaClase.innerHTML = 'Sin registro';
                }
                columnaClase.style.borderBottom = '1px #F5F5F5 solid';
                columnaClase.style.borderRight = '1px #F5F5F5 solid';
                columnaClase.style.textAlign = 'center';

                const columnaPlaca = d.createElement('td');
                // columnaPlaca.innerHTML = element.placa ? element.placa : (columnaPlaca.style.backgroundColor = "#000");
                if (element.placa) {
                  columnaPlaca.innerHTML = element.placa;
                } else {
                  columnaPlaca.style.color = '#E53935';
                  // columnaPlaca.style.color = '#FFFFFF';
                  columnaPlaca.innerHTML = 'Sin registro';
                }
                columnaPlaca.style.borderBottom = '1px #F5F5F5 solid';
                columnaPlaca.style.borderRight = '1px #F5F5F5 solid';
                columnaPlaca.style.textAlign = 'center';

                const columnaFlete = d.createElement('td');
                // columnaFlete.innerHTML = element.flete_propuesto ? "$" + element.flete_propuesto : "Sin registro";
                if (element.placa) {
                  columnaFlete.innerHTML = parseFloat(element.flete_subasta).toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                  });
                } else {
                  columnaFlete.style.color = '#E53935';
                  // columnaFlete.style.color = '#FFFFFF';
                  columnaFlete.innerHTML = 'Sin registro';
                }
                columnaFlete.style.borderBottom = '1px #F5F5F5 solid';
                columnaFlete.style.borderRight = '1px #F5F5F5 solid';
                columnaFlete.style.textAlign = 'center';

                const columnaCotizacion = d.createElement('td');
                // columnaCotizacion.innerHTML = element.flete_propuesto ? "$" + element.flete_propuesto : "Sin registro";
                // if (element.placa) {
                //   columnaCotizacion.innerHTML = element.flete_cotizacion;
                // } else {
                //   columnaCotizacion.style.backgroundColor = '#E53935';
                //   columnaCotizacion.style.color = '#FFFFFF';
                //   columnaCotizacion.innerHTML = 'Sin registro';
                // }
                columnaCotizacion.innerHTML = element.flete_propuesto.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                });
                columnaCotizacion.style.borderBottom = '1px #F5F5F5 solid';
                columnaCotizacion.style.borderRight = '1px #F5F5F5 solid';
                columnaCotizacion.style.textAlign = 'center';

                const columnaManifiesto = d.createElement('td');
                if (element.numero_manifiesto) {
                  columnaManifiesto.innerHTML = element.numero_manifiesto;
                } else {
                  columnaManifiesto.style.color = '#E53935';
                  // columnaManifiesto.style.color = '#FFFFFF';
                  columnaManifiesto.innerHTML = 'Sin registro';
                }
                columnaManifiesto.style.borderBottom = '1px #F5F5F5 solid';
                columnaManifiesto.style.borderRight = '1px #F5F5F5 solid';
                columnaManifiesto.style.textAlign = 'center';

                // fila.appendChild(columnaNumpedido);
                fila.appendChild(columnaSolicitud);
                fila.appendChild(columnaCliente);
                fila.appendChild(columnaOrigen);
                fila.appendChild(columnaDestino);
                fila.appendChild(columnaClase);
                fila.appendChild(columnaCotizacion);
                fila.appendChild(columnaFlete);
                fila.appendChild(columnaPlaca);
                fila.appendChild(columnaFechaSolicitudVehiculo);
                fila.appendChild(columnaFechaAsignacionVehiculo);
                fila.appendChild(columnaFechaManifiesto);
                fila.appendChild(columnaManifiesto);

                // Rendreizar la tabla
                tbody.appendChild(fila);
              });
              console.log(data);
              d.getElementById('num_solicitudes').innerHTML = data.resultado_contador;
              d.getElementById('num_solicitudes_diligenciadas').innerHTML = data.resultado_diligenciado;
            } else {
              tbody.innerHTML = '';
              const fila = d.createElement('tr');
              const columnaDatos = d.createElement('td');
              columnaDatos.setAttribute('colspan', '8');
              columnaDatos.classList.add('text-center');
              columnaDatos.textContent = 'No hay resultados de la operación';
              fila.appendChild(columnaDatos);
              // Rendreizar la tabla
              tbody.appendChild(fila);
            }
          })
          .catch(error => {
            alert(error);
          });
      } catch (error) {
        console.error('Error en la primera solicitud:', error);
        throw error;
      } finally {
        $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    }
  });

  // JavaScript
  d.getElementById('exportar_excel').addEventListener('click', function() {
    var table = document.getElementById('informe_placas_asignadas');
    var wb = XLSX.utils.table_to_book(table);
    // Crear contenido de archivo con fecha
    // var fecha = new Date();
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Informe Placas Asignadas_${fechaActual}.xlsx`; //'Informe Remesas_${fecha.toISOString()}.xlsx '
    XLSX.writeFile(wb, nombreArchivo);
  });
});
