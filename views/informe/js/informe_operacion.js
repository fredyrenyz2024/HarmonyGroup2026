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

          try {
            const response = await fetch($('#id_url_ajax').val() + 'informe/generar_informe_operacion', {
              method: 'POST',
              body: formdata,
              cache: 'no-cache',
            });
            const data = await response.json();
            cont = 0;
            let tbody = document.getElementById('tbody-informe-operacion');
            tbody.innerHTML = '';
            if (data) {
              data.resultado.forEach(element => {
                const fila = document.createElement('tr');
                const columnaManifiesto = document.createElement('td'); //manifiesto
                columnaManifiesto.innerHTML = element.Manifiesto;
                columnaManifiesto.style.textAlign = 'center';
                columnaManifiesto.style.width = 'auto';
                columnaManifiesto.style.whiteSpace = 'nowrap';
                columnaManifiesto.style.paddingLeft = '5px';

                const columnaFechaExpedicionManifiesto = document.createElement('td'); //manifiesto
                columnaFechaExpedicionManifiesto.innerHTML = element.Fecha_Espedicion;
                columnaFechaExpedicionManifiesto.style.textAlign = 'center';
                columnaFechaExpedicionManifiesto.style.width = 'auto';
                columnaFechaExpedicionManifiesto.style.whiteSpace = 'nowrap';
                columnaFechaExpedicionManifiesto.style.paddingLeft = '5px';

                const columnaPlacaManifiesto = document.createElement('td'); //manifiesto
                columnaPlacaManifiesto.innerHTML = element.placa;
                columnaPlacaManifiesto.style.textAlign = 'center';
                columnaPlacaManifiesto.style.width = 'auto';
                columnaPlacaManifiesto.style.whiteSpace = 'nowrap';
                columnaPlacaManifiesto.style.paddingLeft = '5px';

                const columnaPropietarioManifiesto = document.createElement('td'); //Propietario
                columnaPropietarioManifiesto.innerHTML = element.Propietario;
                columnaPropietarioManifiesto.style.textAlign = 'left';
                columnaPropietarioManifiesto.style.width = 'auto';
                columnaPropietarioManifiesto.style.whiteSpace = 'nowrap';
                columnaPropietarioManifiesto.style.paddingLeft = '5px';

                const columnaCelularPropietarioManifiesto = document.createElement('td'); //Celular propietario
                columnaCelularPropietarioManifiesto.innerHTML = element.Celular_Propietario;
                columnaCelularPropietarioManifiesto.style.textAlign = 'center';
                columnaCelularPropietarioManifiesto.style.width = 'auto';
                columnaCelularPropietarioManifiesto.style.whiteSpace = 'nowrap';
                columnaCelularPropietarioManifiesto.style.paddingLeft = '5px';

                const columnaConductorManifiesto = document.createElement('td'); //Conductor
                columnaConductorManifiesto.innerHTML = element.Conductor;
                columnaConductorManifiesto.style.textAlign = 'left';
                columnaConductorManifiesto.style.width = 'auto';
                columnaConductorManifiesto.style.whiteSpace = 'nowrap';
                columnaConductorManifiesto.style.paddingLeft = '5px';

                const columnaCelularConductorManifiesto = document.createElement('td'); //Celular Conductor
                columnaCelularConductorManifiesto.innerHTML = element.Celular_Conductor;
                columnaCelularConductorManifiesto.style.textAlign = 'center';
                columnaCelularConductorManifiesto.style.width = 'auto';
                columnaCelularConductorManifiesto.style.whiteSpace = 'nowrap';
                columnaCelularConductorManifiesto.style.paddingLeft = '5px';

                const columnaClienteManifiesto = document.createElement('td'); //Cliente
                columnaClienteManifiesto.innerHTML = element.Cliente;
                columnaClienteManifiesto.style.textAlign = 'left';
                columnaClienteManifiesto.style.width = 'auto';
                columnaClienteManifiesto.style.whiteSpace = 'nowrap';
                columnaClienteManifiesto.style.paddingLeft = '5px';

                const columnaAgenciaManifiesto = document.createElement('td'); //Agencia
                columnaAgenciaManifiesto.innerHTML = element.Agencia;
                columnaAgenciaManifiesto.style.textAlign = 'center';
                columnaAgenciaManifiesto.style.width = 'auto';
                columnaAgenciaManifiesto.style.whiteSpace = 'nowrap';
                columnaAgenciaManifiesto.style.paddingLeft = '5px';

                const columnaOrigenManifiesto = document.createElement('td'); //Origen
                columnaOrigenManifiesto.innerHTML = element.Origen;
                columnaOrigenManifiesto.style.textAlign = 'center';
                columnaOrigenManifiesto.style.width = 'auto';
                columnaOrigenManifiesto.style.whiteSpace = 'nowrap';
                columnaOrigenManifiesto.style.paddingLeft = '5px';

                const columnaDestinoManifiesto = document.createElement('td'); //Destino
                columnaDestinoManifiesto.innerHTML = element.Destino;
                columnaDestinoManifiesto.style.textAlign = 'center';
                columnaDestinoManifiesto.style.width = 'auto';
                columnaDestinoManifiesto.style.whiteSpace = 'nowrap';
                columnaDestinoManifiesto.style.paddingLeft = '5px';

                const columnaFleteManifiesto = document.createElement('td'); //Flete
                // Remover las comas del valor.
                let flete = element.Flete.replace(/,/g, '');
                // Convertir el valor a un número de punto flotante.
                let totalFlete = parseFloat(flete);
                columnaFleteManifiesto.innerHTML = totalFlete.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                });
                // columnaFleteManifiesto.innerHTML = parseInt(element.Flete, 10).toLocaleString('es-CO', {
                //   style: 'currency',
                //   currency: 'COP',
                //   minimumFractionDigits: 0,
                // });
                columnaFleteManifiesto.style.textAlign = 'center';
                columnaFleteManifiesto.style.width = 'auto';
                columnaFleteManifiesto.style.whiteSpace = 'nowrap';
                columnaFleteManifiesto.style.paddingLeft = '5px';

                fila.appendChild(columnaManifiesto);
                fila.appendChild(columnaFechaExpedicionManifiesto);
                fila.appendChild(columnaPlacaManifiesto);
                fila.appendChild(columnaPropietarioManifiesto);
                fila.appendChild(columnaCelularPropietarioManifiesto);
                fila.appendChild(columnaConductorManifiesto);
                fila.appendChild(columnaCelularConductorManifiesto);
                fila.appendChild(columnaClienteManifiesto);
                fila.appendChild(columnaAgenciaManifiesto);
                fila.appendChild(columnaOrigenManifiesto);
                fila.appendChild(columnaDestinoManifiesto);
                fila.appendChild(columnaFleteManifiesto);
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

  // document.getElementById('exportar_excel').addEventListener('click', function() {
  //   var table = document.getElementById('informe_operacion');
  //   var wb = XLSX.utils.table_to_book(table);
  //   // Crear contenido de archivo con fecha
  //   const fechaActual = new Date().toISOString().slice(0, 10);
  //   const nombreArchivo = `Informe Operación_${fechaActual}.xlsx`; //'Informe Remesas_${fecha.toISOString()}.xlsx '
  //   XLSX.writeFile(wb, nombreArchivo);
  // });

  document.getElementById('exportar_excel').addEventListener('click', function() {
    var table = document.getElementById('informe_operacion');

    // Preprocesar la tabla para asegurar que los valores con formato de moneda sean tratados como texto
    Array.from(table.getElementsByTagName('td')).forEach(function(td) {
      if (td.innerText.includes('$') || td.innerText.includes(',')) {
        td.setAttribute('data-t', 's'); // Marcar como texto
      }
    });

    var wb = XLSX.utils.table_to_book(table);

    // Crear contenido de archivo con fecha
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Informe Operación_${fechaActual}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  });
});
