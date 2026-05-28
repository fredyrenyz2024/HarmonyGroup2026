const d = document;
const w = window;
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  d.addEventListener('click', async e => {
    if (e.target.matches('#aplicar_filtro_instruccion') || e.target.matches('#aplicar_filtro_instruccion *')) {
      // alert("HOLA MUNDO DESDE AQUI");
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
          formdata.append('fecha_inicial', d.getElementById('fecha_inicial_instruccion').value);
          formdata.append('fecha_final', d.getElementById('fecha_final_instruccion').value);
          formdata.append('criterio_busqueda', d.getElementById('criterio_busqueda').value);

          try {
            const response = await fetch($('#id_url_ajax').val() + 'informe/generar_informe_instruccion_facturacion', {
              method: 'POST',
              body: formdata,
              cache: 'no-cache',
            });
            const data = await response.json();
            cont = 0;
            let tbody = document.getElementById('tbl-instrucciones-facturacion');
            tbody.innerHTML = '';

            if (data && data.length > 0) {
              data.forEach(element => {
                const fila = document.createElement('tr');

                const columnaCliente = document.createElement('td');
                columnaCliente.innerHTML = element.Cliente || 'N/A';
                columnaCliente.style.textAlign = 'center';
                columnaCliente.style.borderBottom = '1px solid black';
                columnaCliente.style.width = 'width';
                columnaCliente.style.whiteSpace = 'nowrap';
                columnaCliente.style.paddingFeft = '5px';

                const columnaRemesa = document.createElement('td');
                columnaRemesa.innerHTML = element.Remesa || 'N/A';
                columnaRemesa.style.textAlign = 'center';
                columnaRemesa.style.borderBottom = '1px solid black';
                columnaRemesa.style.width = 'width';
                columnaRemesa.style.whiteSpace = 'nowrap';
                columnaRemesa.style.paddingFeft = '5px';

                const columnaManifiesto = document.createElement('td');
                columnaManifiesto.innerHTML = element.Manifiesto || 'N/A';
                columnaManifiesto.style.textAlign = 'center';
                columnaManifiesto.style.borderBottom = '1px solid black';
                columnaManifiesto.style.width = 'width';
                columnaManifiesto.style.whiteSpace = 'nowrap';
                columnaManifiesto.style.paddingFeft = '5px';

                const columnaFechaRemesa = document.createElement('td');
                columnaFechaRemesa.innerHTML = element.Fecha_Remesa || 'N/A';
                columnaFechaRemesa.style.textAlign = 'center';
                columnaFechaRemesa.style.borderBottom = '1px solid black';
                columnaFechaRemesa.style.width = 'width';
                columnaFechaRemesa.style.whiteSpace = 'nowrap';
                columnaFechaRemesa.style.paddingFeft = '5px';

                const columnaNumeroInstruccion = document.createElement('td');
                columnaNumeroInstruccion.innerHTML = element.Instruccion || 'N/A';
                columnaNumeroInstruccion.style.textAlign = 'center';
                columnaNumeroInstruccion.style.borderBottom = '1px solid black';
                columnaNumeroInstruccion.style.width = 'width';
                columnaNumeroInstruccion.style.whiteSpace = 'nowrap';
                columnaNumeroInstruccion.style.paddingFeft = '5px';

                const columnaFechaInstruccion = document.createElement('td');
                columnaFechaInstruccion.innerHTML = element.Fecha_Instruccion || 'N/A';
                columnaFechaInstruccion.style.textAlign = 'center';
                columnaFechaInstruccion.style.borderBottom = '1px solid black';
                columnaFechaInstruccion.style.width = 'width';
                columnaFechaInstruccion.style.whiteSpace = 'nowrap';
                columnaFechaInstruccion.style.paddingFeft = '5px';

                const columnaEstadoInstruccion = document.createElement('td');
                columnaEstadoInstruccion.innerHTML = element.Estado_Instruccion || 'N/A';
                columnaEstadoInstruccion.style.textAlign = 'center';
                columnaEstadoInstruccion.style.borderBottom = '1px solid black';
                columnaEstadoInstruccion.style.width = 'width';
                columnaEstadoInstruccion.style.whiteSpace = 'nowrap';
                columnaEstadoInstruccion.style.paddingFeft = '5px';

                fila.appendChild(columnaCliente);
                fila.appendChild(columnaRemesa);
                fila.appendChild(columnaManifiesto);
                fila.appendChild(columnaFechaRemesa);
                fila.appendChild(columnaNumeroInstruccion);
                fila.appendChild(columnaFechaInstruccion);
                fila.appendChild(columnaEstadoInstruccion);
                tbody.appendChild(fila);
              });
            }

          } catch (error) {
            console.error('Error en la primera solicitud:', error);
            throw error;
          } finally {
            $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
            $('#tbl_datos').css('display', 'flex');
          }
        }
      });
    }
  });

  // Botones para exportar las remesas
  d.getElementById('exportar_excel_instrucciones').addEventListener('click', function () {
    var table = d.getElementById('informe_instrucciones');

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
      { wpx: 100 }, // Columna 1 ancho en píxeles
      { wpx: 100 }, // Columna 2 ancho en píxeles
      { wpx: 100 }, // Ajusta el tamaño de las columnas según el contenido5
      { wpx: 250 }, // Columna 2 ancho en píxeles
    ];

    // Crear contenido de archivo con fecha
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Informe Instrucciones Facturación - ${fechaActual}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  });
});