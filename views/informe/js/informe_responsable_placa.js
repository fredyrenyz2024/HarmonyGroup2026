// Informes_responsables_placas

const d = document;
const w = window;
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  Lsitar_responsables();

  d.addEventListener('click', async e => {
    if (e.target.matches('#aplicar_filtro') || e.target.matches('#aplicar_filtro *')) {
      Swal.fire({
        title: 'Informe',
        text: '¿Está seguro de continuar?',
        icon: 'warning',
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
          $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
          /* Definir las variables para los filtros */
          let formdata = new FormData();
          formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
          formdata.append('fecha_final', d.getElementById('fecha_final').value);
          formdata.append('responsable', d.getElementById('responsable').value);

          try {
            const response = await fetch($('#id_url_ajax').val() + 'informe/Informes_responsables_placas', {
              method: 'POST',
              body: formdata,
              cache: 'no-cache',
            });

            const data = await response.json();
            if (!data || data.length === 0) {
              Swal.fire({
                title: 'Información',
                text: 'No hay información para generar el informe.',
                icon: 'info',
                customClass: {
                  popup: 'swal2-custom-font',
                },
              });
            } else {
              let tbody = document.getElementById('tbl_informe_responsable_placa');
              tbody.innerHTML = '';

              let totalFlete = 0; // Inicializar el total del flete

              if (data) {
                // num_placas_responsables
                d.getElementById('num_placas_responsables').innerHTML = data.length; // Mostrar cantidad de placas

                data.forEach(element => {
                  const fila = d.createElement('tr');

                  const columnaSolicituServicio = document.createElement('td');
                  columnaSolicituServicio.innerHTML = element.numdoc_manifiesto;
                  columnaSolicituServicio.style.textAlign = 'center';
                  columnaSolicituServicio.style.borderBottom = '1px solid black';

                  const columnaFechaManifiesto = document.createElement('td');
                  columnaFechaManifiesto.innerHTML = element.fecha_manifiesto;
                  columnaFechaManifiesto.style.textAlign = 'center';
                  columnaFechaManifiesto.style.borderBottom = '1px solid black';

                  const columnaCliente = document.createElement('td');
                  columnaCliente.innerHTML = element.nombre_cliente;
                  columnaCliente.style.textAlign = 'center';
                  columnaCliente.style.borderBottom = '1px solid black';

                  const columnaPlaca = document.createElement('td');
                  columnaPlaca.innerHTML = element.placa;
                  columnaPlaca.style.textAlign = 'center';
                  columnaPlaca.style.borderBottom = '1px solid black';

                  const columnaTipoVehiculo = document.createElement('td');
                  columnaTipoVehiculo.innerHTML = element.tipo_vehiculo;
                  columnaTipoVehiculo.style.textAlign = 'center';
                  columnaTipoVehiculo.style.borderBottom = '1px solid black';

                  const columnaRuta = document.createElement('td');
                  columnaRuta.innerHTML = '<b>Origen: </b>' + element.Origen + ' - ' + '<b>Destino: </b>' + element.Destino;
                  columnaRuta.style.textAlign = 'center';
                  columnaRuta.style.borderBottom = '1px solid black';

                  const columnaResponsable = document.createElement('td');
                  columnaResponsable.innerHTML = element.responsable;
                  columnaResponsable.style.textAlign = 'center';
                  columnaResponsable.style.borderBottom = '1px solid black';

                  const columnaFlete = document.createElement('td');
                  // columnaFlete.innerHTML = element.Flete;
                  let flete = parseFloat(element.Flete);
                  columnaFlete.innerHTML = flete.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                  });
                  columnaFlete.style.textAlign = 'center';
                  columnaFlete.style.borderBottom = '1px solid black';

                  // Acumular el total del flete
                  totalFlete += flete;

                  fila.appendChild(columnaSolicituServicio);
                  fila.appendChild(columnaFechaManifiesto);
                  fila.appendChild(columnaCliente);
                  fila.appendChild(columnaPlaca);
                  fila.appendChild(columnaTipoVehiculo);
                  fila.appendChild(columnaResponsable);
                  fila.appendChild(columnaRuta);
                  fila.appendChild(columnaFlete);
                  tbody.appendChild(fila);
                });

                // Mostrar el total del flete al final
                let totalRow = document.createElement('tr');
                totalRow.innerHTML = `<td colspan="6" style="text-align: right;"><strong>Total Flete:</strong></td>
                                      <td style="text-align: center;">${totalFlete.toLocaleString('es-CO', {
                                        style: 'currency',
                                        currency: 'COP',
                                        minimumFractionDigits: 0,
                                      })}</td>`;
                tbody.appendChild(totalRow);
              }
            }
          } catch (error) {
            console.error('Error en la primera solicitud:', error);
            throw error;
          } finally {
            $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
          }
        }
      });
    }

    // if (e.target.matches('#aplicar_filtro') || e.target.matches('#aplicar_filtro *')) {
    //   Swal.fire({
    //     title: 'Informe',
    //     text: '¿Está seguro de continuar?',
    //     icon: 'warning',
    //     showCancelButton: true,
    //     cancelButtonColor: '#9FA6B2',
    //     confirmButtonColor: '#14A44D',
    //     confirmButtonText: 'Si',
    //     cancelButtonText: 'No',
    //     customClass: {
    //       popup: 'swal2-custom-font',
    //     },
    //   }).then(async result => {
    //     if (result.isConfirmed) {
    //       $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
    //       /* Definir las variables para los filtros */
    //       let formdata = new FormData();
    //       formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
    //       formdata.append('fecha_final', d.getElementById('fecha_final').value);
    //       formdata.append('responsable', d.getElementById('responsable').value);

    //       try {
    //         const response = await fetch($('#id_url_ajax').val() + 'informe/Informes_responsables_placas', {
    //           method: 'POST',
    //           body: formdata,
    //           cache: 'no-cache',
    //         });

    //         const data = await response.json();
    //         if (!data || data.length === 0) {
    //           Swal.fire({
    //             title: 'Información',
    //             text: 'No hay información para generar el informe.',
    //             icon: 'info',
    //             customClass: {
    //               popup: 'swal2-custom-font',
    //             },
    //           });
    //         } else {
    //           let tbody = document.getElementById('tbl_informe_responsable_placa');
    //           tbody.innerHTML = '';
    //           if (data) {
    //             // num_placas_responsables
    //             d.getElementById('num_placas_responsables').innerHTML = data;
    //             data.forEach(element => {
    //               const fila = d.createElement('tr');

    //               const columnaSolicituServicio = document.createElement('td');
    //               columnaSolicituServicio.innerHTML = element.nundoc_solicitud;
    //               columnaSolicituServicio.style.textAlign = 'center';
    //               columnaSolicituServicio.style.borderBottom = '1px solid black';

    //               const columnaCliente = document.createElement('td');
    //               columnaCliente.innerHTML = element.nombre_cliente;
    //               columnaCliente.style.textAlign = 'center';
    //               columnaCliente.style.borderBottom = '1px solid black';

    //               const columnaPlaca = document.createElement('td');
    //               columnaPlaca.innerHTML = element.placa;
    //               columnaPlaca.style.textAlign = 'center';
    //               columnaPlaca.style.borderBottom = '1px solid black';

    //               const columnaTipoVehiculo = document.createElement('td');
    //               columnaTipoVehiculo.innerHTML = element.tipo_vehiculo;
    //               columnaTipoVehiculo.style.textAlign = 'center';
    //               columnaTipoVehiculo.style.borderBottom = '1px solid black';

    //               const columnaRuta = document.createElement('td');
    //               columnaRuta.innerHTML = '<b>Origen: </b>' + element.Origen + '<br>' + '<b>Destino: </b>' + element.Destino;
    //               columnaRuta.style.textAlign = 'center';
    //               columnaRuta.style.borderBottom = '1px solid black';

    //               const columnaResponsable = document.createElement('td');
    //               columnaResponsable.innerHTML = element.responsable;
    //               columnaResponsable.style.textAlign = 'center';
    //               columnaResponsable.style.borderBottom = '1px solid black';

    //               const columnaFlete = document.createElement('td');
    //               // columnaFlete.innerHTML = element.Flete;
    //               columnaFlete.innerHTML = parseFloat(element.Flete).toLocaleString('es-CO', {
    //                 style: 'currency',
    //                 currency: 'COP',
    //                 minimumFractionDigits: 0,
    //               });
    //               columnaFlete.style.textAlign = 'center';
    //               columnaFlete.style.borderBottom = '1px solid black';

    //               fila.appendChild(columnaSolicituServicio);
    //               fila.appendChild(columnaCliente);
    //               fila.appendChild(columnaPlaca);
    //               fila.appendChild(columnaTipoVehiculo);
    //               fila.appendChild(columnaResponsable);
    //               fila.appendChild(columnaRuta);
    //               fila.appendChild(columnaFlete);
    //               tbody.appendChild(fila);
    //             });
    //           } else {
    //           }
    //         }
    //       } catch (error) {
    //         console.error('Error en la primera solicitud:', error);
    //         throw error;
    //       } finally {
    //         $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    //       }
    //     }
    //   });
    // }
  });

  // Botones para exportar las remesas
  d.getElementById('exportar_excel').addEventListener('click', function() {
    var table = d.getElementById('informe_responsable_placas');

    // Preprocesar la tabla para asegurar que los valores con formato de moneda sean tratados como texto
    Array.from(table.getElementsByTagName('td')).forEach(function(td) {
      if (td.innerText.includes('$') || td.innerText.includes(',')) {
        td.setAttribute('data-t', 's'); // Marcar como texto
      }
    });

    // Crear el libro de Excel a partir de la tabla
    var wb = XLSX.utils.table_to_book(table);

    // Aplicar estilo al thead (color de fondo y otros)
    var ws = wb.Sheets[wb.SheetNames[0]];

    // Definir estilo para el thead
    var rangoEncabezado = XLSX.utils.decode_range(ws['!ref']); // Obtener el rango de la tabla
    for (let C = rangoEncabezado.s.c; C <= rangoEncabezado.e.c; ++C) {
      var cell = ws[XLSX.utils.encode_cell({r: 0, c: C})]; // Fila 0 es el thead
      if (!cell.s) cell.s = {};
      cell.s.fill = {
        patternType: 'solid',
        fgColor: {rgb: '3B71CA'}, // Color de fondo amarillo
      };
    }

    // Añadir filtros al thead
    ws['!autofilter'] = {
      ref: XLSX.utils.encode_range(rangoEncabezado),
    };

    // Ajustar ancho de las columnas
    ws['!cols'] = [
      {wpx: 100}, // Columna 1 ancho en píxeles
      {wpx: 100}, // Columna 2 ancho en píxeles
      {wpx: 100}, // Ajusta el tamaño de las columnas según el contenido
      {wpx: 100}, // Columna 2 ancho en píxeles
    ];

    // Crear contenido de archivo con fecha
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Informe Responsable Vehiculo - ${fechaActual}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  });
});

async function Lsitar_responsables() {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'informe/Consultar_responsables_vehiculo', {
      method: 'POST',
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error('Error al cargar los Responsables');
    }

    const data = await response.json();
    // Limpiar ambos select antes de agregar opciones
    let RESPONSABLE = d.getElementById('responsable');
    RESPONSABLE.innerHTML = '<option value="" selected>Seleccioonar..</option>'; // Limpiar opciones anteriores

    data.forEach(value => {
      let {usuario_responsable_id, nom_usuario, user_log} = value;
      // Crear la opción para 'responsable_actual'
      let optActual = d.createElement('option');
      optActual.value = usuario_responsable_id;
      // optActual.textContent = user_log + ' - ' + nom_usuario;
      optActual.textContent = nom_usuario;
      RESPONSABLE.appendChild(optActual);
    });
  } catch (error) {
    alert(error.message || 'Error al cargar los Responsables');
  }
}
