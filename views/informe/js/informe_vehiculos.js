const d = document;
const w = window;
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
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
          // alert('hola mundo desde aqui');
          $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
          let formdata = new FormData();
          formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
          formdata.append('fecha_final', d.getElementById('fecha_final').value);
          // formdata.append('num_pedido', d.getElementById('num_pedido').value);
          try {
            const response = await fetch($('#id_url_ajax').val() + 'informe/Informe_Vehiculos_Activos', {
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
              let tbody = document.getElementById('tbody-informes-vehiculos');
              tbody.innerHTML = '';
              let Estado = '';
              // Verificar si los datos existen
              if (data && data.length > 0) {
                data.forEach(element => {
                  const fila = document.createElement('tr');

                  const columnaPlaca = document.createElement('td');
                  columnaPlaca.innerHTML = element.placa || 'N/A';
                  columnaPlaca.style.textAlign = 'center';
                  columnaPlaca.style.borderBottom = '1px solid black';
                  columnaPlaca.style.width = 'width';
                  columnaPlaca.style.whiteSpace = 'nowrap';
                  columnaPlaca.style.paddingFeft = '5px';

                  const columnaClaseVehiculo = document.createElement('td');
                  columnaClaseVehiculo.innerHTML = element.clase || 'N/A';
                  columnaClaseVehiculo.style.textAlign = 'center';
                  columnaClaseVehiculo.style.borderBottom = '1px solid black';
                  columnaClaseVehiculo.style.width = 'width';
                  columnaClaseVehiculo.style.whiteSpace = 'nowrap';
                  columnaClaseVehiculo.style.paddingFeft = '5px';

                  const columnaTipoVehiculo = document.createElement('td');
                  columnaTipoVehiculo.innerHTML = element.tipo_vehiculo || 'N/A';
                  columnaTipoVehiculo.style.textAlign = 'center';
                  columnaTipoVehiculo.style.borderBottom = '1px solid black';
                  columnaTipoVehiculo.style.width = 'width';
                  columnaTipoVehiculo.style.whiteSpace = 'nowrap';
                  columnaTipoVehiculo.style.paddingFeft = '5px';

                  const columnaConfiguracion = document.createElement('td');
                  columnaConfiguracion.innerHTML = element.configuracion || 'N/A';
                  columnaConfiguracion.style.textAlign = 'center';
                  columnaConfiguracion.style.borderBottom = '1px solid black';
                  columnaConfiguracion.style.width = 'width';
                  columnaConfiguracion.style.whiteSpace = 'nowrap';
                  columnaConfiguracion.style.paddingFeft = '5px';

                  const columnaConductor = document.createElement('td');
                  columnaConductor.innerHTML = element.Conductor || 'N/A';
                  columnaConductor.style.textAlign = 'center';
                  columnaConductor.style.borderBottom = '1px solid black';
                  columnaConductor.style.width = 'width';
                  columnaConductor.style.whiteSpace = 'nowrap';
                  columnaConductor.style.paddingFeft = '5px';

                  const columnaCelularConductor = document.createElement('td');
                  columnaCelularConductor.innerHTML = element.Celular || 'N/A';
                  columnaCelularConductor.style.textAlign = 'center';
                  columnaCelularConductor.style.borderBottom = '1px solid black';
                  columnaCelularConductor.style.width = 'width';
                  columnaCelularConductor.style.whiteSpace = 'nowrap';
                  columnaCelularConductor.style.paddingFeft = '5px';

                  const columnaPoseedor = document.createElement('td');
                  columnaPoseedor.innerHTML = element.Poseedor || 'N/A';
                  columnaPoseedor.style.textAlign = 'center';
                  columnaPoseedor.style.borderBottom = '1px solid black';
                  columnaPoseedor.style.width = 'width';
                  columnaPoseedor.style.whiteSpace = 'nowrap';
                  columnaPoseedor.style.paddingFeft = '5px';

                  const columnaCelularPoseedor = document.createElement('td');
                  columnaCelularPoseedor.innerHTML = element.Celular_Poseedor || 'N/A';
                  columnaCelularPoseedor.style.textAlign = 'center';
                  columnaCelularPoseedor.style.borderBottom = '1px solid black';
                  columnaCelularPoseedor.style.width = 'width';
                  columnaCelularPoseedor.style.whiteSpace = 'nowrap';
                  columnaCelularPoseedor.style.paddingFeft = '5px';

                  const columnaEstado = document.createElement('td');

                  const estado = element.estado || 'N/A';
                  let claseBadge = 'badge-secondary'; // Clase por defecto

                  switch (estado) {
                    case 'Activo':
                      claseBadge = 'badge-success';
                      break;
                    case 'Inactivo':
                      claseBadge = 'badge-secondary';
                      break;
                    case 'Pendiente':
                      claseBadge = 'badge-warning';
                      break;
                    case 'Suspendido':
                      claseBadge = 'badge-danger';
                      break;
                    case 'Por Cumplir':
                      claseBadge = 'badge-info';
                      break;
                    // puedes agregar más casos si hay más estados
                  }

                  columnaEstado.innerHTML = `<span class="badge ${claseBadge} float-right">${estado}</span>`;
                  columnaEstado.style.textAlign = 'center';
                  columnaEstado.style.borderBottom = '1px solid black';
                  columnaEstado.style.whiteSpace = 'nowrap';
                  columnaEstado.style.paddingLeft = '5px'; // corregido de nuevo

                  fila.appendChild(columnaPlaca);
                  fila.appendChild(columnaClaseVehiculo);
                  fila.appendChild(columnaTipoVehiculo);
                  fila.appendChild(columnaConfiguracion);
                  fila.appendChild(columnaConductor);
                  fila.appendChild(columnaCelularConductor);
                  fila.appendChild(columnaPoseedor);
                  fila.appendChild(columnaCelularPoseedor);
                  fila.appendChild(columnaEstado);

                  tbody.appendChild(fila);
                });
              } else {
                console.error('No hay datos disponibles.');
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
  });

  // Botones para exportar las remesas
  d.getElementById('exportar_excel').addEventListener('click', function () {
    var table = d.getElementById('informe_vehiculos');

    // Preprocesar la tabla para asegurar que los valores con formato de moneda sean tratados como texto
    Array.from(table.getElementsByTagName('td')).forEach(function (td) {
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
      var cell = ws[XLSX.utils.encode_cell({ r: 0, c: C })]; // Fila 0 es el thead
      if (!cell.s) cell.s = {};
      cell.s.fill = {
        patternType: 'solid',
        fgColor: { rgb: '3B71CA' }, // Color de fondo amarillo
      };
    }

    // Añadir filtros al thead
    ws['!autofilter'] = {
      ref: XLSX.utils.encode_range(rangoEncabezado),
    };

    // Ajustar ancho de las columnas
    ws['!cols'] = [
      { wpx: 150 }, // Columna 1 ancho en píxeles
      { wpx: 150 }, // Columna 2 ancho en píxeles
      { wpx: 200 }, // Ajusta el tamaño de las columnas según el contenido5
      { wpx: 150 }, // Columna 2 ancho en píxeles
      { wpx: 150 }, // Columna 2 ancho en píxeles
      { wpx: 250 }, // Columna 2 ancho en píxeles
      { wpx: 150 }, // Columna 2 ancho en píxeles
      { wpx: 150 }, // Columna 2 ancho en píxeles
    ];

    // Crear contenido de archivo con fecha
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Informe Vehiculos - ${d.getElementById('fecha_inicial').value} - ${d.getElementById('fecha_final').value}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  });
});