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
          formdata.append('num_pedido', d.getElementById('num_pedido').value);
          try {
            const response = await fetch($('#id_url_ajax').val() + 'informe/Informe_Cumplidos', {
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
              let tbody = document.getElementById('tbody-informes-cumplido');
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

                  const columnaManifiesto = document.createElement('td');
                  columnaManifiesto.innerHTML = element.manifesto || 'N/A';
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
                  columnaRemesa.innerHTML = element.remesa || 'N/A';
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

                  const columnaPlanillador = document.createElement('td');
                  columnaPlanillador.innerHTML = element.Planillador || '0';
                  columnaPlanillador.style.textAlign = 'center';
                  columnaPlanillador.style.borderBottom = '1px solid black';
                  columnaPlanillador.style.width = 'width';
                  columnaPlanillador.style.whiteSpace = 'nowrap';
                  columnaPlanillador.style.paddingFeft = '5px';

                  // /* Comprobar los estados de los documentos para definir si esta anualdo o vigente por cumplir o cumplido */
                  if (
                    element.Estado_Manifiesto === 1 &&
                    element.Estado_Remesa === 1 &&
                    element.Estado_Orden_Cargue === 1 &&
                    element.cumplido !== null &&
                    element.fecha_cumplido !== null &&
                    element.usuario !== null
                  ) {
                    Estado = '<span class="badge badge-success float-right">Cumplido</span>';
                  } else if (
                    element.Estado_Manifiesto === 1 &&
                    element.Estado_Remesa === 1 &&
                    element.Estado_Orden_Cargue === 1 &&
                    element.cumplido === null &&
                    element.fecha_cumplido === null &&
                    element.usuario === null
                  ) {
                    // Otra lógica aquí
                    Estado = '<span class="badge badge-info float-right">Por Cumplir</span>';
                  } else if (
                    element.Estado_Manifiesto === 0 &&
                    element.Estado_Remesa === 0 &&
                    element.Estado_Orden_Cargue === 0 &&
                    element.cumplido === null &&
                    element.fecha_cumplido === null &&
                    element.usuario === null
                  ) {
                    Estado = '<span class="badge badge-danger float-right">Anulado</span>';
                  } else if (
                    element.Estado_Manifiesto === 0 &&
                    element.Estado_Remesa === 0 &&
                    element.Estado_Orden_Cargue === 0 &&
                    element.cumplido !== null &&
                    element.fecha_cumplido !== null &&
                    element.usuario !== null
                  ) {
                    Estado = '<span class="badge badge-danger float-right">Anulado</span>';
                  }
                  const columnaEstado = document.createElement('td');
                  columnaEstado.innerHTML = Estado || '0';
                  columnaEstado.style.textAlign = 'center';
                  columnaEstado.style.borderBottom = '1px solid black';
                  columnaEstado.style.width = 'width';
                  columnaEstado.style.whiteSpace = 'nowrap';
                  columnaEstado.style.paddingFeft = '5px';

                  const columnaCumplido = document.createElement('td');
                  columnaCumplido.innerHTML = element.cumplido || '0';
                  columnaCumplido.style.textAlign = 'center';
                  columnaCumplido.style.borderBottom = '1px solid black';
                  columnaCumplido.style.width = 'width';
                  columnaCumplido.style.whiteSpace = 'nowrap';
                  columnaCumplido.style.paddingFeft = '5px';

                  const columnaFechaCumplido = document.createElement('td');
                  columnaFechaCumplido.innerHTML = element.fecha_cumplido || '0';
                  columnaFechaCumplido.style.textAlign = 'center';
                  columnaFechaCumplido.style.borderBottom = '1px solid black';
                  columnaFechaCumplido.style.width = 'width';
                  columnaFechaCumplido.style.whiteSpace = 'nowrap';
                  columnaFechaCumplido.style.paddingFeft = '5px';

                  const columnaUsuarioCumplido = document.createElement('td');
                  columnaUsuarioCumplido.innerHTML = element.usuario || 'N/A';
                  columnaUsuarioCumplido.style.textAlign = 'center';
                  columnaUsuarioCumplido.style.borderBottom = '1px solid black';
                  columnaUsuarioCumplido.style.width = 'width';
                  columnaUsuarioCumplido.style.whiteSpace = 'nowrap';
                  columnaUsuarioCumplido.style.paddingFeft = '5px';


                  const columnaObservacionCumplido = document.createElement('td');
                  columnaObservacionCumplido.innerHTML = element.observacion || 'N/A';
                  columnaObservacionCumplido.style.textAlign = 'left';
                  columnaObservacionCumplido.style.borderBottom = '1px solid black';
                  columnaObservacionCumplido.style.width = 'width';
                  columnaObservacionCumplido.style.whiteSpace = 'nowrap';
                  columnaObservacionCumplido.style.paddingFeft = '5px';


                  // const columnaDocumento = document.createElement('td');
                  // columnaDocumento.innerHTML = `
                  // <a href="JavaScript:void(0);" onClick="imprimir_cumplido(${element.cumplido})" style="text-decoration: none;cursor: pointer;color: #332D2D;">
                  //   <img src="${$('#id_url_ajax').val()}public/img/pdf.png" alt="Pdf" width="25px"> <span style="font-size: 13px;"></span>
                  // </a>`;
                  // columnaDocumento.style.textAlign = 'center';
                  // columnaDocumento.style.borderBottom = '1px solid black';

                  fila.appendChild(columnaPlaca);
                  fila.appendChild(columnaManifiesto);
                  fila.appendChild(columnaFechaExpedicionManifiesto);
                  fila.appendChild(columnaRemesa);
                  fila.appendChild(columnaCliente);
                  fila.appendChild(columnaOrigen);
                  fila.appendChild(columnaDestino);
                  fila.appendChild(columnaAgencia);
                  fila.appendChild(columnaPlanillador);
                  fila.appendChild(columnaCumplido);
                  fila.appendChild(columnaUsuarioCumplido);
                  fila.appendChild(columnaObservacionCumplido);
                  fila.appendChild(columnaFechaCumplido);
                  fila.appendChild(columnaEstado);
                  // fila.appendChild(columnaDocumento);

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
    var table = d.getElementById('informe_cumplidos');

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
    const nombreArchivo = `Informe Cumplidos - ${fechaActual}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  });

  document.getElementById('num_pedido').addEventListener('keydown', function (event) {
    // Verificar si la tecla presionada es "Enter" (código 13)
    if (event.key === 'Enter' || event.keyCode === 13) {
      // Evitar el comportamiento por defecto (como enviar un formulario)
      event.preventDefault();

      // Llamar a la función que deseas ejecutar
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
          formdata.append('num_pedido', d.getElementById('num_pedido').value);
          try {
            const response = await fetch($('#id_url_ajax').val() + 'informe/Informe_Cumplidos', {
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
              let tbody = document.getElementById('tbody-informes-cumplido');
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

                  const columnaManifiesto = document.createElement('td');
                  columnaManifiesto.innerHTML = element.manifesto || 'N/A';
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
                  columnaRemesa.innerHTML = element.remesa || 'N/A';
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

                  const columnaPlanillador = document.createElement('td');
                  columnaPlanillador.innerHTML = element.Planillador || '0';
                  columnaPlanillador.style.textAlign = 'center';
                  columnaPlanillador.style.borderBottom = '1px solid black';
                  columnaPlanillador.style.width = 'width';
                  columnaPlanillador.style.whiteSpace = 'nowrap';
                  columnaPlanillador.style.paddingFeft = '5px';

                  // /* Comprobar los estados de los documentos para definir si esta anualdo o vigente por cumplir o cumplido */
                  if (
                    element.Estado_Manifiesto === 1 &&
                    element.Estado_Remesa === 1 &&
                    element.Estado_Orden_Cargue === 1 &&
                    element.cumplido !== null &&
                    element.fecha_cumplido !== null &&
                    element.usuario !== null &&
                    element.estado_seguimiento !== 'ANULADO'
                  ) {
                    Estado = '<span class="badge badge-success float-right">Cumplido</span>';
                  } else if (
                    element.Estado_Manifiesto === 1 &&
                    element.Estado_Remesa === 1 &&
                    element.Estado_Orden_Cargue === 1 &&
                    element.cumplido === null &&
                    element.fecha_cumplido === null &&
                    element.usuario === null &&
                    element.estado_seguimiento !== 'ANULADO'
                  ) {
                    // Otra lógica aquí
                    Estado = '<span class="badge badge-info float-right">Por Cumplir</span>';
                  } else if (
                    element.Estado_Manifiesto === 0 &&
                    element.Estado_Remesa === 0 &&
                    element.Estado_Orden_Cargue === 0 &&
                    element.cumplido === null &&
                    element.fecha_cumplido === null &&
                    element.usuario === null &&
                    element.estado_seguimiento === 'ANULADO'
                  ) {
                    Estado = '<span class="badge badge-danger float-right">Anulado</span>';
                  } else if (
                    element.Estado_Manifiesto === 1 &&
                    element.Estado_Remesa === 1 &&
                    element.Estado_Orden_Cargue === 1 &&
                    element.cumplido === null &&
                    element.fecha_cumplido === null &&
                    element.usuario === null &&
                    element.estado_seguimiento === 'ANULADO'
                  ) {
                    Estado = '<span class="badge badge-danger float-right">Anulado</span>';
                  } else if (
                    element.Estado_Manifiesto === 0 &&
                    element.Estado_Remesa === 0 &&
                    element.Estado_Orden_Cargue === 0 &&
                    element.cumplido !== null &&
                    element.fecha_cumplido !== null &&
                    element.usuario !== null &&
                    element.estado_seguimiento === 'ANULADO'
                  ) {
                    Estado = '<span class="badge badge-danger float-right">Anulado</span>';
                  }
                  const columnaEstado = document.createElement('td');
                  columnaEstado.innerHTML = Estado || '0';
                  columnaEstado.style.textAlign = 'center';
                  columnaEstado.style.borderBottom = '1px solid black';
                  columnaEstado.style.width = 'width';
                  columnaEstado.style.whiteSpace = 'nowrap';
                  columnaEstado.style.paddingFeft = '5px';

                  const columnaCumplido = document.createElement('td');
                  columnaCumplido.innerHTML = element.cumplido || 'N/A';
                  columnaCumplido.style.textAlign = 'center';
                  columnaCumplido.style.borderBottom = '1px solid black';
                  columnaCumplido.style.width = 'width';
                  columnaCumplido.style.whiteSpace = 'nowrap';
                  columnaCumplido.style.paddingFeft = '5px';

                  const columnaFechaCumplido = document.createElement('td');
                  columnaFechaCumplido.innerHTML = element.fecha_cumplido || 'N/A';
                  columnaFechaCumplido.style.textAlign = 'center';
                  columnaFechaCumplido.style.borderBottom = '1px solid black';
                  columnaFechaCumplido.style.width = 'width';
                  columnaFechaCumplido.style.whiteSpace = 'nowrap';
                  columnaFechaCumplido.style.paddingFeft = '5px';

                  const columnaUsuarioCumplido = document.createElement('td');
                  columnaUsuarioCumplido.innerHTML = element.usuario || 'N/A';
                  columnaUsuarioCumplido.style.textAlign = 'center';
                  columnaUsuarioCumplido.style.borderBottom = '1px solid black';
                  columnaUsuarioCumplido.style.width = 'width';
                  columnaUsuarioCumplido.style.whiteSpace = 'nowrap';
                  columnaUsuarioCumplido.style.paddingFeft = '5px';

                  // const columnaDocumento = document.createElement('td');
                  // columnaDocumento.innerHTML = `
                  // <a href="JavaScript:void(0);" onClick="imprimir_cumplido(${element.cumplido})" style="text-decoration: none;cursor: pointer;color: #332D2D;">
                  //   <img src="${$('#id_url_ajax').val()}public/img/pdf.png" alt="Pdf" width="25px"> <span style="font-size: 13px;"></span>
                  // </a>`;
                  // columnaDocumento.style.textAlign = 'center';
                  // columnaDocumento.style.borderBottom = '1px solid black';

                  fila.appendChild(columnaPlaca);
                  fila.appendChild(columnaManifiesto);
                  fila.appendChild(columnaFechaExpedicionManifiesto);
                  fila.appendChild(columnaRemesa);
                  fila.appendChild(columnaCliente);
                  fila.appendChild(columnaOrigen);
                  fila.appendChild(columnaDestino);
                  fila.appendChild(columnaAgencia);
                  fila.appendChild(columnaPlanillador);
                  fila.appendChild(columnaCumplido);
                  fila.appendChild(columnaUsuarioCumplido);
                  fila.appendChild(columnaFechaCumplido);
                  fila.appendChild(columnaEstado);
                  // fila.appendChild(columnaDocumento);

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

function imprimir_cumplido(cumplido) {
  $.ajax({
    url: $('#id_url_ajax').val() + 'transporte/CumplidoPdf',
    method: 'POST',
    data: { idcumplido: cumplido },
    dataType: 'json',
    success: function (data) {
      if (data) {
        cumplido = data[0]['id'];
        placa = data[0]['placa'];
        poseedor = data[0]['namete'] + ' ' + data[0]['teape1'] + ' ' + data[0]['teape2'];
        // poseedor = '';
        poseedor_documento = data[0]['docte'];
        conductor = data[0]['namecondu'] + ' ' + data[0]['conape1'] + ' ' + data[0]['conape2'];
        // conductor = '';
        conductor_documento = data[0]['doccondu'];
        condu_celular = data[0]['celular_condu'];
        marca = data[0]['marca'];
        modelo = data[0]['anio_fabricacion'];
        cant_multa = data[0]['cantidad_multa'];
        manifiesto = data[0]['manifiesto'];
        origen = data[0]['origen'];
        destino = data[0]['destino'];
        novedad = data[0]['novedad'];
        td_propie = data[0]['tipo_documento'];
        pesototal = data[0]['total_peso'];
        pesovolumen = data[0]['total_volumen'];
        fecha_pago = data[0]['nueva_fecha'];

        pdf_cumple =
          'numcumplido=' +
          cumplido +
          '&placa=' +
          placa +
          '&poseedor=' +
          poseedor +
          '&docposee=' +
          poseedor_documento +
          '&conductor=' +
          conductor +
          '&doccondu=' +
          conductor_documento +
          '&cel=' +
          condu_celular +
          '&marca=' +
          marca +
          '&modelo=' +
          modelo +
          '&cantmulta=' +
          cant_multa +
          '&manifiesto=' +
          manifiesto +
          '&origen=' +
          origen +
          '&destino=' +
          destino +
          '&novedad=' +
          novedad +
          '&tipodocp=' +
          td_propie +
          '&pesototal=' +
          pesototal +
          '&volumentotal=' +
          pesovolumen +
          '&fecha_pago=' +
          fecha_pago;

        var url = $('#id_url_ajax').val() + 'libs/cumplido_pdf.php?' + pdf_cumple;
        window.open(url, '_blank');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
