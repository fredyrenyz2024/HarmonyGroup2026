$(document).ready(function() {
  $('.select2').select2();
  listar_clientes();
  $('#btn-filtro').click(function() {
    var filtro = $('#tipo').val();

    if (filtro === '') {
      Swal.fire({
        title: 'Advertencia!',
        text: 'Debe seleccionar una opción del filtro.',
        icon: 'warning',
        customClass: {
          popup: 'swal2-custom-font',
        },
      });
    } else if (filtro === '2' && $('#num_manifiesto').val() === '') {
      Swal.fire({
        title: 'Advertencia!',
        text: 'Debe ingresar un numero de manifiesto.',
        icon: 'warning',
        customClass: {
          popup: 'swal2-custom-font',
        },
      });
    } else {
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
          // generar_informe();
          var tipo = $('#tipo').val();
          var num_manifiesto = $('#num_manifiesto').val();
          var fecha_final = $('#fecha_final').val();
          var fecha_inicial = $('#fecha_inicial').val();
          var cliente = $('#cliente').val();
          var datos = {tipo: tipo, num_manifiesto: num_manifiesto, fecha_final: fecha_final, fecha_inicial: fecha_inicial, cliente: cliente};
          generar_informe(datos);
        }
      });
    }
  });

  function generar_informe(datos) {
    $('#tbody-informes').html('');
    $.ajax({
      type: 'POST', // TIPO DE PETICION PUEDE SER GET
      // dataType: "json", // EL TIPO DE DATO QUE DEVUELVE PUEDE SER JSON/TEXT/HTML/XML
      url: $('#id_url_ajax').val() + 'control_ruta/Historial_Seguimiento', // DIRECCION DONDE SE ENCUENTRA LA OPERACION A REALIZAR
      data: datos, // DATOS ENVIADOS PUEDE SER TEXT A TRAVEZ DE LA URL O PUEDE SER UN OBJETO
      beforeSend: function() {
        // ACCION QUE SUCEDE ANTES DE HACER EL SUBMIT
        $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
      },
      success: function(response) {
        // ACCION QUE SUCEDE DESPUES DE REALIZAR CORRECTAMENTE LA PETICION EL CUAL NOS TRAE UNA RESPUESTA
        if (response.length > 0) {
          tabla_historial(response);
        } else {
          Swal.fire({
            title: 'Mensaje!',
            text: 'En estas fechas no hay movimientos, por favor intentar con otras fechas.',
            icon: 'info',
            customClass: {
              popup: 'swal2-custom-font',
            },
          });
        }
      },
      error: function() {
        // SI OCURRE UN ERROR
        Swal.fire({
          title: 'Error',
          text: 'El servicio no está disponible, inténtelo más tarde.',
          icon: 'error',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      },
    }).always(function() {
      // FINALMENTE, INDEPENDIENTEMENTE DEL RESULTADO
      $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga
    });
  }

    // Botones para exportar las remesas
    document.getElementById('exportar_excel').addEventListener('click', function() {
      var table = document.getElementById('informe_de_historico_seguimiento');
  
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
        {wpx: 80}, // Columna 1 ancho en píxeles
        {wpx: 80}, // Columna 2 ancho en píxeles
        {wpx: 80}, // Ajusta el tamaño de las columnas según el contenido
        {wpx: 250}, // Ajusta el tamaño de las columnas según el contenido
        {wpx: 250}, // Ajusta el tamaño de las columnas según el contenido
      ];
  
      // Crear contenido de archivo con fecha
      const fechaActual = new Date().toISOString().slice(0, 10);
      const nombreArchivo = `Informe Historico Seguimiento - ${fechaActual}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    });
});

function tabla_historial(data) {
  // Convertir la cadena JSON en un objeto JavaScript
  var arrayJS = JSON.parse(data);
  var template = '';
  arrayJS.forEach(item => {
    template += `
      <tr>
          <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center"><a href="#" onClick="consulta_detalle(${item.id})">${item.id}</a></td>
          <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.placa}</td>
          <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.fecha_expedicion}</td>
          <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.origen + ' - ' + item.destino}</td>
          <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.conductor}</td>
          <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.numero_documento}</td>
           <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${item.celular}</td>
          <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center"><button class="btn btn-space btn-success btn-xs" onClick="decargar_pdf(${item.id})"> <i class="icon icon-left mdi mdi-download"></i> Descargar</button></td>
      </tr>`;
  });
  $('#tbody-informes').html(template);
}

function limpiar_filtros() {
  $('#tipo').val('');
  $('#num_manifiesto').val('');
  $('#fecha_inicial').val('');
  $('#fecha_final').val('');
}

function consulta_detalle(manifiesto) {
  url = $('#id_url_ajax').val() + 'control_ruta/seguimiento_historia/?idmenu=5&m=' + manifiesto;
  window.open(url, '_self');
}

function decargar_pdf(manifiesto) {
  url = $('#id_url_ajax').val() + 'libs/historico_seguimiento.php?manifiesto=' + codificarBase64(manifiesto);
  window.open(url, '_blank');
}

function codificarBase64(texto) {
  return btoa(texto);
}

// Función para decodificar Base64
function decodificarBase64(textoCodificado) {
  return atob(textoCodificado);
}

function listar_clientes() {
  var url = $('#id_url_ajax').val() + 'informe/listar_clientes';
  $.ajax({
    url: url,
    type: 'POST',
    dataType: 'json',
    success: function(response) {
      var html = '<option value="">Seleccionar cliente</option>';
      response.forEach(function(item) {
        html += '<option value="' + item.id + '">' + item.nombre + '</option>';
      });
      $('#cliente').html(html);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    },
  });
}
