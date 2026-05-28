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
          formdata.append('criterio_busqueda', d.getElementById('criterio_busqueda').value);
          try {
            const response = await fetch($('#id_url_ajax').val() + 'informe/Historico_Seguimiento', {
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
              let tbody = document.getElementById('tbody-informes-historico-despachos');
              tbody.innerHTML = '';
              let Estado = '';
              if (data && data.length > 0) {
                // Verificar si los datos existen
                const totalViajes = data.reduce((acumulador, fila) => acumulador + fila.Total_Viajes, 0);
                // Mostrar el resultado
                console.log('Total de viajes:', totalViajes);
                d.getElementById('totalViajes').innerHTML = totalViajes;
                data.forEach(element => {
                  const fila = document.createElement('tr');

                  const columnaPlaca = document.createElement('td');
                  columnaPlaca.innerHTML = element.placa || 'N/A';
                  columnaPlaca.style.textAlign = 'center';
                  columnaPlaca.style.borderBottom = '1px solid black';
                  columnaPlaca.style.width = 'width';
                  columnaPlaca.style.whiteSpace = 'nowrap';
                  columnaPlaca.style.paddingFeft = '5px';

                  const columnaManifiesto = document.createElement('td');
                  columnaManifiesto.innerHTML = element.Manifiesto || 'N/A';
                  columnaManifiesto.style.textAlign = 'center';
                  columnaManifiesto.style.borderBottom = '1px solid black';
                  columnaManifiesto.style.width = 'width';
                  columnaManifiesto.style.whiteSpace = 'nowrap';
                  columnaManifiesto.style.paddingFeft = '5px';

                  const columnaFechaExpedicionManifiesto = document.createElement('td');
                  columnaFechaExpedicionManifiesto.innerHTML = element.fecha_expedicion || 'N/A';
                  columnaFechaExpedicionManifiesto.style.textAlign = 'center';
                  columnaFechaExpedicionManifiesto.style.borderBottom = '1px solid black';
                  columnaFechaExpedicionManifiesto.style.width = 'width';
                  columnaFechaExpedicionManifiesto.style.whiteSpace = 'nowrap';
                  columnaFechaExpedicionManifiesto.style.paddingFeft = '5px';

                  const columnaRemesa = document.createElement('td');
                  columnaRemesa.innerHTML = element.Remesa || 'N/A';
                  columnaRemesa.style.textAlign = 'center';
                  columnaRemesa.style.borderBottom = '1px solid black';
                  columnaRemesa.style.width = 'width';
                  columnaRemesa.style.whiteSpace = 'nowrap';
                  columnaRemesa.style.paddingFeft = '5px';

                  const columnaCliente = document.createElement('td');
                  columnaCliente.innerHTML = element.Cliente || '0';
                  columnaCliente.style.textAlign = 'center';
                  columnaCliente.style.borderBottom = '1px solid black';
                  columnaCliente.style.width = 'width';
                  columnaCliente.style.whiteSpace = 'nowrap';
                  columnaCliente.style.paddingFeft = '5px';

                  const columnaOrigen = document.createElement('td');
                  columnaOrigen.innerHTML = element.Origen || '0';
                  columnaOrigen.style.textAlign = 'center';
                  columnaOrigen.style.borderBottom = '1px solid black';
                  columnaOrigen.style.width = 'width';
                  columnaOrigen.style.whiteSpace = 'nowrap';
                  columnaOrigen.style.paddingFeft = '5px';

                  const columnaDestino = document.createElement('td');
                  columnaDestino.innerHTML = element.Destino || '0';
                  columnaDestino.style.textAlign = 'center';
                  columnaDestino.style.borderBottom = '1px solid black';
                  columnaDestino.style.width = 'width';
                  columnaDestino.style.whiteSpace = 'nowrap';
                  columnaDestino.style.paddingFeft = '5px';

                  const columnaAgencia = document.createElement('td');
                  columnaAgencia.innerHTML = element.Agencia || '0';
                  columnaAgencia.style.textAlign = 'center';
                  columnaAgencia.style.borderBottom = '1px solid black';
                  columnaAgencia.style.width = 'width';
                  columnaAgencia.style.whiteSpace = 'nowrap';
                  columnaAgencia.style.paddingFeft = '5px';

                  const columnaConductor = document.createElement('td');
                  columnaConductor.innerHTML = element.Conductor || '0';
                  columnaConductor.style.textAlign = 'center';
                  columnaConductor.style.borderBottom = '1px solid black';
                  columnaConductor.style.width = 'width';
                  columnaConductor.style.whiteSpace = 'nowrap';
                  columnaConductor.style.paddingFeft = '5px';

                  fila.appendChild(columnaManifiesto);
                  fila.appendChild(columnaRemesa);
                  fila.appendChild(columnaCliente);
                  fila.appendChild(columnaPlaca);
                  fila.appendChild(columnaConductor);
                  fila.appendChild(columnaFechaExpedicionManifiesto);
                  fila.appendChild(columnaOrigen);
                  fila.appendChild(columnaDestino);
                  fila.appendChild(columnaAgencia);

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
    var table = d.getElementById('informe_historico_seguimiento');

    // Preprocesar la tabla: evitar que fechas se interpreten mal
    Array.from(table.getElementsByTagName('td')).forEach(function (td) {
      const text = td.innerText.trim();

      // Detectar valores con $ o formatos de fecha ISO
      const esFecha = /^\d{4}-\d{2}-\d{2}$/.test(text); // Formato YYYY-MM-DD

      if (esFecha) {
        td.setAttribute('data-t', 's'); // Marcar como texto para Excel
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
      { wpx: 100 }, // Columna 1 ancho en píxeles
      { wpx: 100 }, // Columna 2 ancho en píxeles
      { wpx: 100 }, // Ajusta el tamaño de las columnas según el contenido5
      { wpx: 250 }, // Columna 2 ancho en píxeles
    ];

    // Crear contenido de archivo con fecha
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Historico Despachos - ${fechaActual}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  });

  d.getElementById('criterio_busqueda').addEventListener('keydown', function (event) {
    // Verificar si la tecla presionada es "Enter" (código 13)
    if (event.key === 'Enter' || event.keyCode === 13) {
      // Evitar el comportamiento por defecto (como enviar un formulario)
      event.preventDefault();
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
          formdata.append('fecha_inicial', '');
          formdata.append('fecha_final', '');
          formdata.append('criterio_busqueda', d.getElementById('criterio_busqueda').value);
          try {
            const response = await fetch($('#id_url_ajax').val() + 'informe/Historico_Seguimiento', {
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
              let tbody = document.getElementById('tbody-informes-historico-despachos');
              tbody.innerHTML = '';
              let Estado = '';
              // Verificar si los datos existen
              if (data && data.length > 0) {
                // Verificar si los datos existen
                const totalViajes = data.reduce((acumulador, fila) => acumulador + fila.Total_Viajes, 0);
                // Mostrar el resultado
                console.log('Total de viajes:', totalViajes);
                d.getElementById('totalViajes').innerHTML = totalViajes;
                data.forEach(element => {
                  const fila = document.createElement('tr');

                  const columnaPlaca = document.createElement('td');
                  columnaPlaca.innerHTML = element.placa || 'N/A';
                  columnaPlaca.style.textAlign = 'center';
                  columnaPlaca.style.borderBottom = '1px solid black';
                  columnaPlaca.style.width = 'width';
                  columnaPlaca.style.whiteSpace = 'nowrap';
                  columnaPlaca.style.paddingFeft = '5px';

                  const columnaManifiesto = document.createElement('td');
                  columnaManifiesto.innerHTML = element.Manifiesto || 'N/A';
                  columnaManifiesto.style.textAlign = 'center';
                  columnaManifiesto.style.borderBottom = '1px solid black';
                  columnaManifiesto.style.width = 'width';
                  columnaManifiesto.style.whiteSpace = 'nowrap';
                  columnaManifiesto.style.paddingFeft = '5px';

                  const columnaFechaExpedicionManifiesto = document.createElement('td');
                  columnaFechaExpedicionManifiesto.innerHTML = element.fecha_expedicion || 'N/A';
                  columnaFechaExpedicionManifiesto.style.textAlign = 'center';
                  columnaFechaExpedicionManifiesto.style.borderBottom = '1px solid black';
                  columnaFechaExpedicionManifiesto.style.width = 'width';
                  columnaFechaExpedicionManifiesto.style.whiteSpace = 'nowrap';
                  columnaFechaExpedicionManifiesto.style.paddingFeft = '5px';

                  const columnaRemesa = document.createElement('td');
                  columnaRemesa.innerHTML = element.Remesa || 'N/A';
                  columnaRemesa.style.textAlign = 'center';
                  columnaRemesa.style.borderBottom = '1px solid black';
                  columnaRemesa.style.width = 'width';
                  columnaRemesa.style.whiteSpace = 'nowrap';
                  columnaRemesa.style.paddingFeft = '5px';

                  const columnaCliente = document.createElement('td');
                  columnaCliente.innerHTML = element.Cliente || '0';
                  columnaCliente.style.textAlign = 'center';
                  columnaCliente.style.borderBottom = '1px solid black';
                  columnaCliente.style.width = 'width';
                  columnaCliente.style.whiteSpace = 'nowrap';
                  columnaCliente.style.paddingFeft = '5px';

                  const columnaOrigen = document.createElement('td');
                  columnaOrigen.innerHTML = element.Origen || '0';
                  columnaOrigen.style.textAlign = 'center';
                  columnaOrigen.style.borderBottom = '1px solid black';
                  columnaOrigen.style.width = 'width';
                  columnaOrigen.style.whiteSpace = 'nowrap';
                  columnaOrigen.style.paddingFeft = '5px';

                  const columnaDestino = document.createElement('td');
                  columnaDestino.innerHTML = element.Destino || '0';
                  columnaDestino.style.textAlign = 'center';
                  columnaDestino.style.borderBottom = '1px solid black';
                  columnaDestino.style.width = 'width';
                  columnaDestino.style.whiteSpace = 'nowrap';
                  columnaDestino.style.paddingFeft = '5px';

                  const columnaAgencia = document.createElement('td');
                  columnaAgencia.innerHTML = element.Agencia || '0';
                  columnaAgencia.style.textAlign = 'center';
                  columnaAgencia.style.borderBottom = '1px solid black';
                  columnaAgencia.style.width = 'width';
                  columnaAgencia.style.whiteSpace = 'nowrap';
                  columnaAgencia.style.paddingFeft = '5px';

                  const columnaConductor = document.createElement('td');
                  columnaConductor.innerHTML = element.Conductor || '0';
                  columnaConductor.style.textAlign = 'center';
                  columnaConductor.style.borderBottom = '1px solid black';
                  columnaConductor.style.width = 'width';
                  columnaConductor.style.whiteSpace = 'nowrap';
                  columnaConductor.style.paddingFeft = '5px';

                  fila.appendChild(columnaManifiesto);
                  fila.appendChild(columnaRemesa);
                  fila.appendChild(columnaCliente);
                  fila.appendChild(columnaPlaca);
                  fila.appendChild(columnaConductor);
                  fila.appendChild(columnaFechaExpedicionManifiesto);
                  fila.appendChild(columnaOrigen);
                  fila.appendChild(columnaDestino);
                  fila.appendChild(columnaAgencia);

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
});
