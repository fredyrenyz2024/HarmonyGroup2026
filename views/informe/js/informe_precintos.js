const d = document;
const w = window;
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  d.addEventListener('click', async e => {
    if (e.target.matches('#filtrar') || e.target.matches('#filtrar *')) {
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
          // formdata.append('clientes', d.getElementById('clientes').value);
          // formdata.append('filtro', d.getElementById('filtro').value); resultado

          try {
            const response = await fetch($('#id_url_ajax').val() + 'informe/generar_informe_precintos', {
              method: 'POST',
              body: formdata,
              cache: 'no-cache',
            });
            const data = await response.json();
            cont = 0;
            let tbody = document.getElementById('tbody-informe-precintos');
            tbody.innerHTML = '';
            if (data) {
              data.resultado.forEach(element => {
                const fila = document.createElement('tr');
                const columnaManifiesto = document.createElement('td'); //manifiesto
                columnaManifiesto.innerHTML = element.MANIFIESTO;
                columnaManifiesto.style.textAlign = 'center';
                columnaManifiesto.style.width = 'auto';
                columnaManifiesto.style.whiteSpace = 'nowrap';
                columnaManifiesto.style.paddingLeft = '5px';

                const columnaOrdenCarguePrecinto = document.createElement('td'); //manifiesto
                columnaOrdenCarguePrecinto.innerHTML = element.ORDEN_CARGUE;
                columnaOrdenCarguePrecinto.style.textAlign = 'center';
                columnaOrdenCarguePrecinto.style.width = 'auto';
                columnaOrdenCarguePrecinto.style.whiteSpace = 'nowrap';
                columnaOrdenCarguePrecinto.style.paddingLeft = '5px';

                const columnaPrecintos = document.createElement('td'); //manifiesto
                columnaPrecintos.innerHTML = element.PRECINTOS;
                columnaPrecintos.style.textAlign = 'center';
                columnaPrecintos.style.width = 'auto';
                columnaPrecintos.style.whiteSpace = 'nowrap';
                columnaPrecintos.style.paddingLeft = '5px';

                const columnaTipoPrecintos = document.createElement('td'); 
                columnaTipoPrecintos.innerHTML = element.TIPO_PRECINTO;
                columnaTipoPrecintos.style.textAlign = 'left';
                columnaTipoPrecintos.style.width = 'auto';
                columnaTipoPrecintos.style.whiteSpace = 'nowrap';
                columnaTipoPrecintos.style.paddingLeft = '5px';

                const columnaPlacaPrecinto = document.createElement('td'); 
                columnaPlacaPrecinto.innerHTML = element.PLACA;
                columnaPlacaPrecinto.style.textAlign = 'center';
                columnaPlacaPrecinto.style.width = 'auto';
                columnaPlacaPrecinto.style.whiteSpace = 'nowrap';
                columnaPlacaPrecinto.style.paddingLeft = '5px';

                const columnaFechaPrecinto = document.createElement('td'); 
                columnaFechaPrecinto.innerHTML = element.FECHA_PRECINTO;
                columnaFechaPrecinto.style.textAlign = 'left';
                columnaFechaPrecinto.style.width = 'auto';
                columnaFechaPrecinto.style.whiteSpace = 'nowrap';
                columnaFechaPrecinto.style.paddingLeft = '5px';

                const columnaOrigenManifiesto = document.createElement('td'); //Origen
                columnaOrigenManifiesto.innerHTML = element.ORIGEN;
                columnaOrigenManifiesto.style.textAlign = 'center';
                columnaOrigenManifiesto.style.width = 'auto';
                columnaOrigenManifiesto.style.whiteSpace = 'nowrap';
                columnaOrigenManifiesto.style.paddingLeft = '5px';

                const columnaDestinoManifiesto = document.createElement('td'); //Destino
                columnaDestinoManifiesto.innerHTML = element.DESTINO;
                columnaDestinoManifiesto.style.textAlign = 'center';
                columnaDestinoManifiesto.style.width = 'auto';
                columnaDestinoManifiesto.style.whiteSpace = 'nowrap';
                columnaDestinoManifiesto.style.paddingLeft = '5px';

                const columnaAgenciaManifiesto = document.createElement('td'); //Agencia
                columnaAgenciaManifiesto.innerHTML = element.AGENCIA;
                columnaAgenciaManifiesto.style.textAlign = 'center';
                columnaAgenciaManifiesto.style.width = 'auto';
                columnaAgenciaManifiesto.style.whiteSpace = 'nowrap';
                columnaAgenciaManifiesto.style.paddingLeft = '5px';

                fila.appendChild(columnaManifiesto);
                fila.appendChild(columnaOrdenCarguePrecinto);
                fila.appendChild(columnaPrecintos);
                fila.appendChild(columnaTipoPrecintos);
                fila.appendChild(columnaPlacaPrecinto);
                fila.appendChild(columnaFechaPrecinto);
                fila.appendChild(columnaOrigenManifiesto);
                fila.appendChild(columnaDestinoManifiesto);
                fila.appendChild(columnaAgenciaManifiesto);
                tbody.appendChild(fila);
              });
            } else {
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

  document.getElementById('exportar_excel').addEventListener('click', function() {
    var table = document.getElementById('informe_precintos');

    // Preprocesar la tabla para asegurar que los valores con formato de moneda sean tratados como texto
    Array.from(table.getElementsByTagName('td')).forEach(function(td) {
      if (td.innerText.includes('$') || td.innerText.includes(',')) {
        td.setAttribute('data-t', 's'); // Marcar como texto
      }
    });

    var wb = XLSX.utils.table_to_book(table);

    // Crear contenido de archivo con fecha
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Informe Precintos_${fechaActual}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  });
});
