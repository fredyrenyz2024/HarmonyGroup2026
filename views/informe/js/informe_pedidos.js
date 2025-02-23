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
          // formdata.append('fecha_inicial', /* d.getElementById('fecha_inicial').value */ '');
          // formdata.append('fecha_final', /* d.getElementById('fecha_final').value */ '');
          formdata.append('num_pedido', d.getElementById('num_pedido').value);
          try {
            const response = await fetch($('#id_url_ajax').val() + 'informe/Informe_pedidos', {
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
              // let tbody = d.getElementById('tbody-informes-pedido');
              // tbody.innerHTML = '';

              // // let totalFlete = 0; // Inicializar el total del flete

              // if (data) {
              //   console.log('🚀 ~ data:', data);
              //   // num_placas_responsables
              //   // d.getElementById('num_placas_responsables').innerHTML = data.length; // Mostrar cantidad de placas

              //   data.datos.forEach(element => {
              //     const fila = d.createElement('tr');

              //     const columnaNombreActividad = document.createElement('td');
              //     columnaNombreActividad.innerHTML = element.nombre_opcion;
              //     columnaNombreActividad.style.textAlign = 'left';
              //     columnaNombreActividad.style.borderBottom = '1px solid black';

              //     const columnaFechaRegistro = document.createElement('td');
              //     columnaFechaRegistro.innerHTML = element.Fecha_registro;
              //     columnaFechaRegistro.style.textAlign = 'left';
              //     columnaFechaRegistro.style.borderBottom = '1px solid black';

              //     fila.appendChild(columnaNombreActividad);
              //     fila.appendChild(columnaFechaRegistro);
              //     tbody.appendChild(fila);
              //   });
              // }
              // let tbody = document.getElementById('tbody-informes-pedido');
              // tbody.innerHTML = '';

              // // Verificar si los datos existen
              // if (data && data.length > 0) {
              //   console.log('🚀 ~ data:', data);

              //   data.forEach(element => {
              //     const fila = document.createElement('tr');

              //     const columnaNombreActividad = document.createElement('td');
              //     columnaNombreActividad.innerHTML = element.nombre_opcion || 'N/A';
              //     columnaNombreActividad.style.textAlign = 'left';
              //     columnaNombreActividad.style.borderBottom = '1px solid black';

              //     const columnaFechaRegistro = document.createElement('td');
              //     columnaFechaRegistro.innerHTML = element.fecha_registro || 'N/A';
              //     columnaFechaRegistro.style.textAlign = 'left';
              //     columnaFechaRegistro.style.borderBottom = '1px solid black';

              //     const columnaCostoActividad = document.createElement('td');
              //     columnaCostoActividad.innerHTML = element.costo_actividad || '0';
              //     columnaCostoActividad.style.textAlign = 'left';
              //     columnaCostoActividad.style.borderBottom = '1px solid black';

              //     const columnaCostoPromedio = document.createElement('td');
              //     columnaCostoPromedio.innerHTML = element.costo_promedio || '0';
              //     columnaCostoPromedio.style.textAlign = 'left';
              //     columnaCostoPromedio.style.borderBottom = '1px solid black';

              //     const columnaFechaGestion = document.createElement('td');
              //     columnaFechaGestion.innerHTML = element.fecha_gestion || 'No gestionada';
              //     columnaFechaGestion.style.textAlign = 'left';
              //     columnaFechaGestion.style.borderBottom = '1px solid black';

              //     fila.appendChild(columnaNombreActividad);
              //     fila.appendChild(columnaFechaRegistro);
              //     fila.appendChild(columnaFechaGestion);
              //     fila.appendChild(columnaCostoActividad);
              //     fila.appendChild(columnaCostoPromedio);

              //     tbody.appendChild(fila);
              //   });
              // } else {
              //   console.error('No hay datos disponibles.');
              // }
              let tbody = document.getElementById('tbody-informes-pedido');
              tbody.innerHTML = '';

              // Verificar si los datos existen
              if (data && data.length > 0) {
                console.log('🚀 ~ data:', data);

                data.forEach(element => {
                  const fila = document.createElement('tr');

                  const columnaNombreActividad = document.createElement('td');
                  columnaNombreActividad.innerHTML = element.nombre_opcion || 'N/A';
                  columnaNombreActividad.style.textAlign = 'left';
                  columnaNombreActividad.style.borderBottom = '1px solid black';

                  const columnaFechaRegistro = document.createElement('td');
                  columnaFechaRegistro.innerHTML = element.fecha_registro || 'N/A';
                  columnaFechaRegistro.style.textAlign = 'center';
                  columnaFechaRegistro.style.borderBottom = '1px solid black';

                  const columnaCostoActividad = document.createElement('td');
                  columnaCostoActividad.innerHTML = element.costo_actividad || '0';
                  columnaCostoActividad.style.textAlign = 'center';
                  columnaCostoActividad.style.borderBottom = '1px solid black';

                  const columnaCostoPromedio = document.createElement('td');
                  columnaCostoPromedio.innerHTML = element.costo_promedio || '0';
                  columnaCostoPromedio.style.textAlign = 'center';
                  columnaCostoPromedio.style.borderBottom = '1px solid black';

                  const columnaFechaGestion = document.createElement('td');
                  let fechaGestion = element.fecha_gestion ? moment(element.fecha_gestion, 'YYYY-MM-DD HH:mm:ss') : moment();
                  // let fechaRegistro = moment(element.fecha_registro, 'YYYY-MM-DD HH:mm:ss');

                  columnaFechaGestion.innerHTML = fechaGestion.isValid() ? fechaGestion.format('YYYY-MM-DD HH:mm:ss') : 'No gestionada';
                  columnaFechaGestion.style.textAlign = 'center';
                  columnaFechaGestion.style.borderBottom = '1px solid black';

                  // Calcular diferencia de tiempo
                  // let duracion = moment.duration(fechaGestion.diff(fechaRegistro));
                  // let diferenciaTiempo = `${duracion.days()}d ${duracion.hours()}h ${duracion.minutes()}m ${duracion.seconds()}s`;

                  const columnaDiferencia = document.createElement('td');
                  // columnaDiferencia.innerHTML = duracion.asMilliseconds() > 0 ? diferenciaTiempo : '0d 0h 0m 0s';
                  columnaDiferencia.innerHTML = element.diferencia;
                  columnaDiferencia.style.textAlign = 'center';
                  columnaDiferencia.style.borderBottom = '1px solid black';
                  const columnaEstadoActivdad = document.createElement('td');
                  // columnaEstadoActivdad.innerHTML = duracion.asMilliseconds() > 0 ? diferenciaTiempo : '0d 0h 0m 0s';
                  columnaEstadoActivdad.innerHTML = element.estado_actividad;
                  columnaEstadoActivdad.style.textAlign = 'center';
                  columnaEstadoActivdad.style.borderBottom = '1px solid black';

                  fila.appendChild(columnaNombreActividad);
                  fila.appendChild(columnaFechaRegistro);
                  fila.appendChild(columnaFechaGestion);
                  fila.appendChild(columnaDiferencia);
                  fila.appendChild(columnaCostoPromedio);
                  fila.appendChild(columnaCostoActividad);
                  fila.appendChild(columnaEstadoActivdad);

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
  d.getElementById('exportar_excel').addEventListener('click', function() {
    var table = d.getElementById('informe_pedidos');

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
      {wpx: 200}, // Columna 1 ancho en píxeles
      {wpx: 150}, // Columna 2 ancho en píxeles
      {wpx: 150}, // Ajusta el tamaño de las columnas según el contenido5
      {wpx: 150}, // Columna 2 ancho en píxeles
    ];

    // Crear contenido de archivo con fecha
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Informe Pedidos - ${fechaActual}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  });
});
