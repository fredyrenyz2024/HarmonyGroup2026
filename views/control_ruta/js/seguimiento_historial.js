document.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  let params = new URLSearchParams(location.search);
  var manifi = params.get('m');
  Informacio_Principal(manifi);
  Informacion_Historica(manifi);

  // Botones para exportar las remesas
  document.getElementById('exportar_excel').addEventListener('click', function() {
    var table = document.getElementById('historial_seguimiento');

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
      {wpx: 350}, // Ajusta el tamaño de las columnas según el contenido
      {wpx: 150}, // Ajusta el tamaño de las columnas según el contenido
      {wpx: 80}, // Ajusta el tamaño de las columnas según el contenido
      {wpx: 80}, // Ajusta el tamaño de las columnas según el contenido
      {wpx: 150}, // Ajusta el tamaño de las columnas según el contenido
    ];

    // Crear contenido de archivo con fecha
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Informe Historico Seguimiento - ${fechaActual}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  });
});

function Informacio_Principal(manifi) {
  var tabla = {
    manifiesto: manifi,
  };
  $.ajax({
    // url: url,
    url: $('#id_url_ajax').val() + 'control_ruta/seguimiento_cabecera',
    type: 'POST',
    data: tabla,
    dataType: 'json',
    beforeSend: function() {
      // window.modal1.showModal();
    },
    success: function(data) {
      if (data) {
        data.forEach(function(element, index) {
          $('.manifiesto').html(element.id);
          $('.placa').html(element.placa);
          $('.origen').html(element.origen);
          $('.destino').html(element.destino);
          $('.conductor').html(element.conductor);
          $('.identificacion').html(element.numero_documento);
          $('.marca').html(element.marca);
          $('.configuracion').html(element.configuracion);
          $('.aseguradora').html(element.aseguradora);
          $('.remolque').html(element.placa_trailer);
        });
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('ocurrio un error en consulta de tabla');
    },
  });
}

function Informacion_Historica(manifi) {
  $('#historial').html('');
  var tabla_histo = {
    manifiesto: manifi,
  };
  $.ajax({
    // url: url,
    url: $('#id_url_ajax').val() + 'control_ruta/seguimiento_historial',
    type: 'POST',
    data: tabla_histo,
    dataType: 'json',
    beforeSend: function() {
      // window.modal1.showModal();
    },
    success: function(data) {
      if (data) {
        data.forEach(function(element, index) {
          tblBody = `
              <tr style="border-bottom: 1px solid #000;">  
                  <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${element.Municipio}</td>
                  <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${element.tipo_seguimiento}</td>
                  <td style="width: 400px; padding-left: 5px; " class="text-left">${element.observacion}</td>
                  <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${element.Municipio}</td>
                  <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${element.fecha_nota}</td>
                 <!-- <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${element.hora}</td>-->
                  <td style="width: auto; white-space: nowrap; padding-left: 5px; " class="text-center">${element.usuario}</td>
              </tr>
                     `;
          $('.historial').append(tblBody);
        });
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('ocurrio un error en consulta de tabla');
    },
  });
}
