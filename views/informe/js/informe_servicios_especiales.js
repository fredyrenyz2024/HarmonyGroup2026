const d = document;
const w = window;
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  d.addEventListener('click', async e => {
    if (e.target.matches('#aplicar_filtro') || e.target.matches('# aplicar_filtro*')) {
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

          try {
            const response = await fetch($('#id_url_ajax').val() + 'informe/Informes_servicios_especiales', {
              method: 'POST',
              body: formdata,
              cache: 'no-cache',
            });

            const data = await response.json();
            if (!data) {
              Swal.fire({
                title: 'Información',
                text: 'No hay información para generar el informe.',
                icon: 'info',
                customClass: {
                  popup: 'swal2-custom-font',
                },
              });
            } else {
              // Limpiar la tabla
              // d.getElementById('tbl_informes_servicios_especiales').innerHTML = '';
              // Crear la tabla
              let tbody = d.getElementById('tbl_informe_servicios_especiales');
              tbody.innerHTML = '';
              data.forEach(element => {
                const fila = d.createElement('tr');

                const columnaNudocServicioEspecial = document.createElement('td');
                columnaNudocServicioEspecial.innerHTML = element.numdoc_servicio;
                columnaNudocServicioEspecial.style.textAlign = 'center';
                columnaNudocServicioEspecial.style.borderBottom = '1PX solid black';

                const columnaFechaServicioEspecial = document.createElement('td');
                columnaFechaServicioEspecial.innerHTML = element.fecha_servicio;
                columnaFechaServicioEspecial.style.textAlign = 'center';
                columnaFechaServicioEspecial.style.borderBottom = '1PX solid black';

                const columnaClienteServicioEspecial = document.createElement('td');
                columnaClienteServicioEspecial.innerHTML = element.clientes;
                columnaClienteServicioEspecial.style.textAlign = 'left';
                columnaClienteServicioEspecial.style.borderBottom = '1PX solid black';

                const columnaConceptoServicioEspecial = document.createElement('td');
                columnaConceptoServicioEspecial.innerHTML = element.concepto;
                columnaConceptoServicioEspecial.style.textAlign = 'center';
                columnaConceptoServicioEspecial.style.borderBottom = '1PX solid black';

                const columnaSolicitudServicioEspecial = document.createElement('td');
                columnaSolicitudServicioEspecial.innerHTML = element.nundoc_solicitud;
                columnaSolicitudServicioEspecial.style.textAlign = 'center';
                columnaSolicitudServicioEspecial.style.borderBottom = '1PX solid black';

                const columnaFechaSolicitudServicioEspecial = document.createElement('td');
                columnaFechaSolicitudServicioEspecial.innerHTML = element.fecha_solicitud;
                columnaFechaSolicitudServicioEspecial.style.textAlign = 'center';
                columnaFechaSolicitudServicioEspecial.style.borderBottom = '1PX solid black';

                const columnaManifiestoervicioEspecial = document.createElement('td');
                columnaManifiestoervicioEspecial.innerHTML = element.numdoc_manifiesto;
                columnaManifiestoervicioEspecial.style.textAlign = 'center';
                columnaManifiestoervicioEspecial.style.borderBottom = '1PX solid black';

                const columnaFechaManifiestoServicioEspecial = document.createElement('td');
                columnaFechaManifiestoServicioEspecial.innerHTML = element.fecha_manifiesto;
                columnaFechaManifiestoServicioEspecial.style.textAlign = 'center';
                columnaFechaManifiestoServicioEspecial.style.borderBottom = '1PX solid black';

                const columnaValorServicioEspecial = document.createElement('td');
                columnaValorServicioEspecial.innerHTML = element.valor_servicio.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                });
                columnaValorServicioEspecial.style.textAlign = 'center';
                columnaValorServicioEspecial.style.borderBottom = '1PX solid black';

                fila.appendChild(columnaNudocServicioEspecial);
                fila.appendChild(columnaFechaServicioEspecial);
                fila.appendChild(columnaClienteServicioEspecial);
                fila.appendChild(columnaConceptoServicioEspecial);
                fila.appendChild(columnaSolicitudServicioEspecial);
                fila.appendChild(columnaFechaSolicitudServicioEspecial);
                fila.appendChild(columnaManifiestoervicioEspecial);
                fila.appendChild(columnaFechaManifiestoServicioEspecial);
                fila.appendChild(columnaValorServicioEspecial);

                tbody.appendChild(fila);
              });
            }
          } catch (error) {
            console.error('Error en la primera solicitud:', error);
            throw error;
          } finally {
            $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
          }
        }
      });
    }
  });

  // Botones para exportar las remesas
  d.getElementById('exportar_excel').addEventListener('click', function() {
    var table = d.getElementById('informe_de_servicios_especiales');

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
      {wpx: 120}, // Columna 1 ancho en píxeles
      {wpx: 120}, // Columna 2 ancho en píxeles
      {wpx: 320}, // Ajusta el tamaño de las columnas según el contenido
      {wpx: 120}, // Columna 2 ancho en píxeles
      {wpx: 120}, // Columna 2 ancho en píxeles
      {wpx: 120}, // Columna 2 ancho en píxeles
      {wpx: 120}, // Columna 2 ancho en píxeles
      {wpx: 120}, // Columna 2 ancho en píxeles
      {wpx: 120}, // Columna 2 ancho en píxeles
    ];

    // Crear contenido de archivo con fecha
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Informe_de_servicios_especiales - ${fechaActual}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  });
});
