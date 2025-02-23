$(document).ready(function() {
  $('#aplicar_filtro').click(function() {
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
        generar_informe();
      }
    });
  });

  // Capturar el evento keydown o keypress
  $('#num_remesa').on('keydown', function(event) {
    // Verificar si la tecla presionada es Enter (código 13)
    if (event.keyCode === 13) {
      // Realizar la acción deseada al presionar Enter
      // Por ejemplo, enviar un formulario o ejecutar una función
      event.preventDefault(); // Si se desea evitar el comportamiento predeterminado del Enter
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
          generar_informe();
        }
      });
    }
  });

  $('#num_remision').on('keydown', function(event) {
    if (event.keyCode === 13) {
      event.preventDefault(); // Si se desea evitar el comportamiento predeterminado del Enter
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
          generar_informe();
        }
      });
    }
  });

  // document.getElementById('exportar_excel').addEventListener('click', function() {
  //   var table = document.getElementById('informe_remesas');
  //   var wb = XLSX.utils.table_to_book(table);
  //   // Crear contenido de archivo con fecha
  //   const fechaActual = new Date().toISOString().slice(0, 10);
  //   const nombreArchivo = `Informe Remesas_${fechaActual}.xlsx`; //'Informe Remesas_${fecha.toISOString()}.xlsx '
  //   XLSX.writeFile(wb, nombreArchivo);
  // });

  document.getElementById('exportar_excel').addEventListener('click', function() {
    var table = document.getElementById('informe_remesas');

    // Preprocesar la tabla para asegurar que los valores con formato de moneda sean tratados como texto
    Array.from(table.getElementsByTagName('td')).forEach(function(td) {
      if (td.innerText.includes('$') || td.innerText.includes(',')) {
        td.setAttribute('data-t', 's'); // Marcar como texto
      }
    });

    var wb = XLSX.utils.table_to_book(table);

    // Crear contenido de archivo con fecha
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Informe Remesas_${fechaActual}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  });
});

async function generar_informe(datos) {
  var num_remesa = $('#num_remesa').val();
  var num_remision = $('#num_remision').val();
  var fecha_inicial = $('#fecha_inicial').val();
  var fecha_final = $('#fecha_final').val();
  var estado_remesa = $('#estado_remesa').val();
  $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
  let formdata = new FormData();
  formdata.append('fecha_inicial', fecha_inicial);
  formdata.append('fecha_final', fecha_final);
  formdata.append('num_remesa', num_remesa);
  formdata.append('num_remision', num_remision);
  formdata.append('estado_remesa', estado_remesa);
  try {
    const response = await fetch($('#id_url_ajax').val() + 'informe/Aplicar_Filtro', {
      method: 'POST',
      body: formdata,
      cache: 'no-cache',
    });

    const data = await response.json();
    if (data) {
      tabla_informes(data);
    } else {
      console.error('No se recibieron datos válidos');
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  } finally {
    $('#loading-overlay-nexosapp').css('display', 'none');
    $('#tbl_datos').css('display', 'flex');
  }
}

function tabla_informes(data) {
  var template = '';
  data.forEach(item => {
    template += `
    <tr>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.REMESA_ID}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.MANIFIESTO_ID}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.ESTADO_MANIFIESTO}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-left">${item.NOMBRE_CLIENTE}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.AGENCIA}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center" style="width:110%;">${item.FECHA_REMESA}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.FECHA_CUMPLIDO} / ${item.HORA_CUMPLIDO}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.PESO_CUMPLIDO} kg</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.USUARIO_CUMPLIDO}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.SERIE_PRECINTOS}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">$ ${item.VALOR_DECLARADO}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">$ ${item.VALOR_DECLARADO_REMESA}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">N/A</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.TIPO_SERVICIO}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.PLACA}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.NOMBRES_CONDUCTOR} ${item.PRIMER_APELLIDO} ${item.SEGUNDO_APELLIDO}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.CANTIDAD}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.VOLUMEN_MERCANCIA}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.PESO_REMESA}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.REMITENTE}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.DESTINATARIO}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.CONTADO}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.CONTRA_ENTREGA}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.ORIGEN}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.DESTINO}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.ORDER_SERVICIO}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.ESTADO_REMESA}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.CONTENIDO}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-left">${item.OBSERVACION_DESTINATARIO}</td>
        <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-left">${item.COMERCIAL}</td>
      </td>
    </tr>`;
  });
  $('#tbody-informes').html(template);
}

function limpiar_filtros() {
  $('#num_remesa').val('');
  $('#num_remision').val('');
  $('#fecha_inicial').val('');
  $('#fecha_final').val('');
  $('#estado_remesa').val('');
}
