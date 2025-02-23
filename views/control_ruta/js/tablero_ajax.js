$(document).ready(function() {
  let codigo_inicio = '';
  //datos de los filtros
  // Datos();

  // new DataTable('#tbl_Manifiestos_seguimiento');
  Tabla_SinFiltro();
  setInterval(Tabla_SinFiltro, 300000);

  $('#Busqueda_Datos').click(function() {
    var num = $('#fnum_manifiesto').val();
    var tipomnf = $('#ftipo_manifiesto').val();
    var ffecha = $('#ffecha').val();
    var agenci = $('#fagencia').val();
    var orign = $('#forigen').val();
    var desti = $('#fdestino').val();
    var fcliente = $('#fcliente').val();
    var fechaultima = $('#fultimanove').val();
    var fconductor = $('#fconductor').val();
    if (num != '' || tipomnf != '' || ffecha != '' || agenci != '' || orign != '' || desti != '' || fcliente != '' || fechaultima != '' || fconductor != '') {
      Busqueda_Datos();
    }
  });

  // JavaScript
  document.getElementById('exportar_excel').addEventListener('click', function() {
    var table = document.getElementById('tbl_Manifiestos_seguimiento');
    if (table) {
      // Clonar la tabla
      var clonedTable = table.cloneNode(true);

      // Indicar qué columnas omitir (por ejemplo, 1 y 3)
      var columnsToOmit = [12]; // Índices base 0

      // Eliminar las columnas no deseadas en el encabezado
      var ths = clonedTable.querySelectorAll('thead th');
      columnsToOmit.slice().reverse().forEach(index => {
        ths[index].remove();
      });

      // Eliminar las columnas no deseadas en las filas del cuerpo
      var rows = clonedTable.querySelectorAll('tbody tr');
      rows.forEach(row => {
        var cells = row.querySelectorAll('td');
        columnsToOmit.slice().reverse().forEach(index => {
          cells[index].remove();
        });
      });

      // Convertir la tabla modificada a libro de Excel
      var wb = XLSX.utils.table_to_book(clonedTable);
      const fechaActual = new Date().toISOString().slice(0, 10);
      const nombreArchivo = `Informe de Manifiesto en Seguimiento_${fechaActual}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    } else {
      console.error("El elemento con el ID 'ordenes_decargue' no existe.");
    }
  });
});

function Datos() {
  //agencia
  $.post(
    $('#id_url_ajax').val() + 'control_ruta/agencias',
    function(data) {
      if (data) {
        $('#fagencia').html('<option value="">Seleccione</option>');
        for (var i = 0; i < data.length; i++) {
          $('#fagencia').append('<option value="' + data[i]['nombre'] + '">' + data[i]['nombre'] + '</option>');
        }
      }
    },
    'json',
  );
  //Origen - Destino
  $.post(
    $('#id_url_ajax').val() + 'control_ruta/filtro_ciudad',
    function(data) {
      if (data) {
        $('#forigen').html('<option value="">Seleccione</option>');
        $('#fdestino').html('<option value="">Seleccione</option>');
        for (var z = 0; z < data.length; z++) {
          $('#forigen').append('<option value="' + data[z]['id'] + '">' + data[z]['municipio'] + ' - ' + data[z]['depto'] + '</option>');
          $('#fdestino').append('<option value="' + data[z]['id'] + '">' + data[z]['municipio'] + ' - ' + data[z]['depto'] + '</option>');
        }
      }
    },
    'json',
  );
  //cliente
  $.post(
    $('#id_url_ajax').val() + 'control_ruta/clientes',
    function(data) {
      if (data) {
        $('#fcliente').html('<option value="">Seleccione</option>');
        for (var t = 0; t < data.length; t++) {
          $('#fcliente').append('<option value="' + data[t]['id'] + '">' + data[t]['nombre'] + '</option>');
        }
      }
    },
    'json',
  );
  //conductor
  $.post(
    $('#id_url_ajax').val() + 'control_ruta/conductor',
    function(data) {
      if (data) {
        $('#fconductor').html('<option value="">Seleccione</option>');
        for (var i = 0; i < data.length; i++) {
          $('#fconductor').append('<option value="' + data[i]['numero_documento'] + '">' + data[i]['nombre'] + '</option>');
        }
      }
    },
    'json',
  );
}

// async function Tabla_SinFiltro() {
//   try {
//     const response = await fetch($('#id_url_ajax').val() + 'control_ruta/Datos_SinFiltro', {
//       method: 'POST',
//       cache: 'no-cache',
//     });
//     const data = await response.json();

//     if (data) {
//       let template = '';
//       let tipo_manifiesto, plan, color;
//       let c = 0;

//       for (let m = 0; m < data.data.length; m++) {
//         c++;
//         const item = data.data[m];
//         // tipo_manifiesto = getTipoManifiesto(item['tipo_manifiesto']);
//         // ({plan, color} = getPlanInfo(item['cod_ini_ruta']));

//         template += `
//                   <tr id="tiempos${c}">
//                       <td style="text-align: center;" id="semaforo${c}">
//                           <a href="#" onClick="Registra_Seguimiento(${item['id']})">${item['id']}</a>
//                       </td>
//                       <td style="color: white;width: auto; white-space: nowrap;color:#000000;" id="tiempo${c}"></td>
//                       <td style="color: white;width: auto; white-space: nowrap;color:#000000;">${item['origen']} - ${item['destino']}</td>
//                       <td style="color: white;width: auto; white-space: nowrap;color:#000000;">${item['placa']}</td>
//                       <td style="color: white;width: auto; white-space: nowrap;color:#000000;">${item['nombre_conductor']} ${item['apellido1']} ${item['apellido2']}</td>
//                       <td style="color: white;width: auto; white-space: nowrap;color:#000000;">${item['celular']}</td>
//                       <td style="color: white;width: auto; white-space: nowrap;color:#000000;">${item['nombre']}</td>
//                       <td style="color: white;width: auto; white-space: nowrap;color:#000000;" id="ultimositio${c}"></td>
//                       <td style="color: white;width: auto; white-space: nowrap;color:#000000;" id="maxhorafecha${c}"></td>
//                       <td style="color: white;width: auto; white-space: nowrap;color:#000000;" id="ultimaobservacion${c}"></td>
//                       <td style="color: white;width: auto; white-space: nowrap;color:#000000;" id="ultimaousuario${c}"></td>
//                   </tr>
//               `;

//         if (item['cod_ini_ruta'] != null) {
//           const codini = item['cod_ini_ruta'];
//           semaforo(codini, c, item['id']);
//           ultimahorafecha(codini, c);
//         }
//       }

//       $('#tablero').html(template);

//       new DataTable('#tbl_Manifiestos_seguimiento', {
//         destroy: true,
//         paging: false,
//         searching: true,
//         ordering: true,
//         order: [[1, 'asc']], // Ordenar la segunda columna (índice 1) en orden descendente
//         info: false,
//         responsive: true,
//         pageLength: 100,
//         dom: '<"row"<"col-sm-10 custom-search"f><"col-sm-2 text-right"B>>' + '<"row"<"col-sm-12"tr>>',
//         buttons: [
//           {
//             extend: 'excelHtml5',
//             text: '<i class="fa-regular fa-file-excel"></i> Exportar a Excel', // Incluye el icono y el texto
//             className: 'btn btn-success input-sm', // Clase de estilo para el botón
//             exportOptions: {
//               columns: ':visible', // Exporta las columnas visibles
//               modifier: {
//                 page: 'all', // Exporta todas las filas
//               },
//             },
//           },
//         ],
//         language: {
//           decimal: ',',
//           thousands: '.',
//           lengthMenu: 'Mostrar _MENU_ registros por página',
//           zeroRecords: 'No se encontraron resultados',
//           info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
//           infoEmpty: 'Mostrando 0 a 0 de 0 registros',
//           infoFiltered: '(filtrado de _MAX_ registros totales)',
//           search: 'Buscar:',
//           paginate: {
//             first: 'Primero',
//             last: 'Último',
//             next: 'Siguiente',
//             previous: 'Anterior',
//           },
//         },
//       });
//     } else {
//       alert('Error al traer los datos');
//     }
//   } catch (error) {
//     console.error('Error en la primera solicitud:', error);
//     throw error;
//   } finally {
//     Tabla_llegada();
//     await Contadores_manifiestos();
//   }
// }

async function Tabla_SinFiltro() {
  try {
    const response = await fetch($('#id_url_ajax').val() + 'control_ruta/Datos_SinFiltro', {
      method: 'POST',
      cache: 'no-cache',
    });
    const data = await response.json();

    if (data) {
      let template = '';
      let promises = [];

      for (let m = 0; m < data.data.length; m++) {
        const item = data.data[m];
        const c = m + 1;

        template += `
          <tr id="tiempos${c}">
              <td style="color: white;width: auto; white-space: nowrap;color:#000000;text-align: center;" id="semaforo${c}">
                  <a href="#" onClick="Registra_Seguimiento(${item['id']})">${item['id']}</a>
              </td>
              <td style="color: white;width: auto; white-space: nowrap;color:#000000;" id="tiempo${c}"></td>
              <td style="color: white;width: auto; white-space: nowrap;color:#000000;">${item['origen']} - ${item['destino']}</td>
              <td style="color: white;width: auto; white-space: nowrap;color:#000000;">${item['placa']}</td>
              <td style="color: white;width: auto; white-space: nowrap;color:#000000;">${item['nombre_conductor']} ${item['apellido1']} ${item['apellido2']}</td>
              <td style="color: white;width: auto; white-space: nowrap;color:#000000;">${item['celular']}</td>
              <td style="color: white;width: auto; white-space: nowrap;color:#000000;">${item['nombre']}</td>
              <td style="color: white;width: auto; white-space: nowrap;color:#000000;" id="ultimositio${c}"></td>
              <td style="color: white;width: auto; white-space: nowrap;color:#000000;" id="maxhorafecha${c}"></td>
              <td style="color: white;width: auto; white-space: nowrap;color:#000000;" id="ultimaobservacion${c}"></td>
              <td style="color: white;width: auto; white-space: nowrap;color:#000000;" id="ultimaousuario${c}"></td>
          </tr>
        `;

        // Llama a ultimahorafecha y almacena la promesa
        if (item['cod_ini_ruta'] != null) {
          promises.push(
            new Promise(resolve => {
              ultimahorafecha(item['cod_ini_ruta'], c);
              resolve();
            }),
          );

          promises.push(
            new Promise(resolve => {
              semaforo(item['cod_ini_ruta'], c);
              resolve();
            }),
          );
        }
      }

      $('#tablero').html(template);

      // Espera a que todas las actualizaciones dinámicas terminen
      await Promise.all(promises);

      // Inicializa DataTables después de actualizar dinámicamente los datos
      new DataTable('#tbl_Manifiestos_seguimiento', {
        destroy: true,
        paging: false,
        searching: true,
        ordering: true,
        order: [[1, 'desc']],
        info: false,
        responsive: true,
        pageLength: 100,
        dom: '<"row"<"col-sm-10 custom-search"f><"col-sm-2 text-right"B>>' + '<"row"<"col-sm-12"tr>>',
        buttons: [
          {
            extend: 'excelHtml5',
            text: '<i class="fa-regular fa-file-excel"></i> Exportar a Excel',
            className: 'btn btn-success input-sm',
            exportOptions: {
              columns: ':visible',
              modifier: {page: 'all'},
            },
          },
        ],
        language: {
          decimal: ',',
          thousands: '.',
          lengthMenu: 'Mostrar _MENU_ registros por página',
          zeroRecords: 'No se encontraron resultados',
          info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
          infoEmpty: 'Mostrando 0 a 0 de 0 registros',
          infoFiltered: '(filtrado de _MAX_ registros totales)',
          search: 'Buscar:',
          paginate: {first: 'Primero', last: 'Último', next: 'Siguiente', previous: 'Anterior'},
        },
      });
    } else {
      alert('Error al traer los datos');
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  } finally {
    Tabla_llegada();
    await Contadores_manifiestos();
  }
}

function getTipoManifiesto(tipo) {
  const tipos = {
    1: 'General',
    2: 'Multiparada',
    3: 'Viaje Vacío',
    4: 'Varios viajes en el Día',
    8: 'Viaje de Ida y Regreso',
  };
  return tipos[tipo] || 'Desconocido';
}

function getPlanInfo(codigo) {
  return codigo ? {plan: 'SI', color: 'success'} : {plan: 'NO', color: 'danger'};
}

function Contadores_manifiestos() {
  return new Promise((resolve, reject) => {
    $.post(
      $('#id_url_ajax').val() + 'control_ruta/Contadores_Manifiestos',
      function(data) {
        if (data) {
          $('#num_vehiculos_seguimiento').html(data.total_manifiestos_seguimiento);
          $('#num_vehiculos_totales').html(data.total_manifiestos_general);
          $('#num_manifiestos_llegada').html(data.total_manifiestos_llegada);
          resolve(data);
        } else {
          reject('No data received');
        }
      },
      'json',
    ).fail((jqXHR, textStatus, errorThrown) => {
      reject(errorThrown);
    });
  });
}

function Tabla_llegada() {
  $.post(
    $('#id_url_ajax').val() + 'control_ruta/Datos_llegada',
    function(data) {
      if (data) {
        $('#tablero_llegada').html('');
        var c = 0;
        var template = '';
        var tipo_manifiesto = '';
        for (var m = 0; m < data.length; m++) {
          c++;
          codigo_inicio = data[m]['cod_ini_ruta'];
          if (data[m]['tipo_manifiesto'] == 1) {
            tipo_manifiesto = 'General';
          } else if (data[m]['tipo_manifiesto'] == 2) {
            tipo_manifiesto = 'Multiparada';
          } else if (data[m]['tipo_manifiesto'] == 3) {
            tipo_manifiesto = 'Viaje Vacío';
          } else if (data[m]['tipo_manifiesto'] == 4) {
            tipo_manifiesto = 'Varios viajes en el Dia';
          } else if (data[m]['tipo_manifiesto'] == 8) {
            tipo_manifiesto = 'Viaje de Ida y Regreso';
          }

          template += `
              <tr id="tiempos${c}">
                <td style="text-align: center;white-space: nowrap;width: auto;" id="semaforo${c}" ><a href="#" onClick="Registra_Seguimiento(${data[m]['id']})">${data[m]['id']}</a></td>
                <td style="white-space: nowrap;width: 65px;">${tipo_manifiesto}</td>
                <td style="white-space: nowrap;width: 127px;">${data[m]['Lugar']}</td>
                <td style="white-space: nowrap;width: auto;">${data[m]['origen']}</td>
                <td style="white-space: nowrap;width: auto;">${data[m]['destino']}</td>
                <td style="white-space: nowrap;width: auto;">${data[m]['mer_producto']}</td>
                <td style="white-space: nowrap;width: auto;">${data[m]['tipo_transporte']}</td>
                <td style="white-space: nowrap;width: auto;" class="cell-detail">${data[m]['placa']}</td>
                <td style="white-space: nowrap;width: auto;" class="cell-detail">${data[m]['apellido1']} ${data[m]['apellido1']}</td>
                <td style="white-space: nowrap;width: auto;" class="cell-detail">${data[m]['celular']}</td>
                <td style="white-space: nowrap;width: auto;" class="cell-detail">${data[m]['nombre']}</td>
                <td style="white-space: nowrap;width: auto;" id="maxnovedad${c}"></td>
                <td style="white-space: nowrap;width: auto;" id="maxhorafecha${c}"></td>
                <td style="white-space: nowrap;width: auto;" id="ultimositio${c}"></td>
                <td nowrap id="ultimaobservacion${c}"></td>
                <td style="white-space: nowrap;width: auto;" id="ultimaousuario${c}"></td>
              </tr>
            `;
          $('#tablero_llegada').html(template);

          if (data[m]['cod_ini_ruta'] != null) {
            var codini = data[m]['cod_ini_ruta'];
            // Actualizar la tabla cada minuto (60000 ms)
            // semaforo(codini, c, data[m]['id']);
            // ultimanovedad(codini, c);
            // ultimahorafecha(codini, c);
            // setInterval(semaforo(codini, c), 60000);
          }
        }
      }
    },
    'json',
  );
}

function Registra_Seguimiento(manifiesto) {
  url = $('#id_url_ajax').val() + 'control_ruta/redireccionar/?idmenu=5&m=' + manifiesto;
  window.open(url, '_self');
}

// Inicializar la variable de tiempo
// var tiempo = -59;

function semaforo(codini, id, manifiesto) {
  var consulta = {codini: codini};

  $.ajax({
    url: $('#id_url_ajax').val() + 'trafico/consulta_semaforo',
    type: 'POST',
    data: consulta,
    dataType: 'json',
    success: function(data) {
      if (data != null) {
        data.forEach(element => {
          var resultado = parseFloat(element.tiempo);
          var texto = resultado.toLocaleString();
          var color = '';

          // Determina el color según el resultado
          if (resultado < 0) {
            color = '#FFFFFF'; // Blanco
          } else if (resultado >= 0 && resultado <= 30) {
            color = '#FFFF6C'; // Amarillo
          } else if (resultado >= 31 && resultado <= 59) {
            color = '#FF9E5E'; // Naranja
          } else if (resultado >= 60 && resultado <= 89) {
            color = '#FF8891'; // Rojo claro
          } else if (resultado >= 90 && resultado <= 119) {
            color = '#DDBBFF'; // Lila
          } else if (resultado >= 120) {
            color = '#DDBBFF'; // Lila
          }

          // Actualiza el semáforo y el tiempo en la tabla
          $(`#semaforo${id}`).css('background-color', color);
          $(`#tiempo${id}`).html(`<p>${texto}</p>`);

          // Actualiza los datos en DataTables
          const table = $('#tbl_Manifiestos_seguimiento').DataTable();
          const rowIndex = table.row(`#tiempos${id}`).index();
          const rowData = table.row(rowIndex).data();

          // Modifica los datos dinámicamente en DataTables
          rowData[1] = `<div style="background-color:${color}; width:100%; height:100%;"></div>`; // Columna del semáforo
          rowData[1] = texto; // Columna del tiempo

          table.row(rowIndex).data(rowData).draw(false); // Actualiza la fila
        });
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error al obtener semáforo:', textStatus, errorThrown);
    },
  });
}

function ultimahorafecha(codini, id) {
  const maximo = {codini: codini};

  $.ajax({
    url: $('#id_url_ajax').val() + 'trafico/consulta_notas',
    type: 'POST',
    data: maximo,
    dataType: 'json',
    success: function(data) {
      if (data != null) {
        data.forEach(element => {
          // Actualiza el contenido dinámico
          $(`#maxhorafecha${id}`).html(`${element.fecha} - ${element.hora}`);
          $(`#ultimositio${id}`).html(`${element.Municipio}`);
          $(`#ultimaobservacion${id}`).html(`${element.observacion}`);
          $(`#ultimaousuario${id}`).html(`${element.usuario}`);

          // Actualiza el estado interno de DataTables
          const table = $('#tbl_Manifiestos_seguimiento').DataTable();
          const rowIndex = table.row(`#tiempos${id}`).index(); // Encuentra el índice de la fila
          const rowData = table.row(rowIndex).data(); // Obtiene los datos de la fila

          // Modifica los datos dinámicamente en el estado de DataTables
          rowData[8] = `${element.fecha} - ${element.hora}`; // Columna maxhorafecha
          rowData[7] = `${element.Municipio}`; // Columna ultimositio
          rowData[9] = `${element.observacion}`; // Columna ultimaobservacion
          rowData[10] = `${element.usuario}`; // Columna ultimaousuario

          table.row(rowIndex).data(rowData).draw(false); // Actualiza la fila
        });
      } else {
        // Manejo de datos en blanco
        $(`#maxhorafecha${id}`).html('<strong>No existe una novedad aún</strong>');
        $(`#ultimositio${id}`).html('<strong>No tiene sitio de control</strong>');
        $(`#ultimaobservacion${id}`).html('<strong>No tiene observaciones</strong>');
        $(`#ultimaousuario${id}`).html('<strong>No tiene usuario</strong>');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error(jqXHR, textStatus, errorThrown);
    },
  });
}

// function ultimahorafecha(codini, id) {
//   var maximo = {
//     codini: codini,
//     // action: "ultima_novedad",
//   };
//   // var url = $("#id_url_ajax").val() + "libs/seguimientoruta_ajax.php";
//   $.ajax({
//     url: $('#id_url_ajax').val() + 'trafico/consulta_notas',
//     type: 'POST',
//     data: maximo,
//     dataType: 'json',
//     success: function(data) {
//       if (data != null) {
//         data.forEach(element => {
//           $('#maxhorafecha' + id).html(element.fecha + '-' + element.hora);
//           $('#ultimositio' + id).html(`${element.Municipio}`);
//           $('#ultimaobservacion' + id).html(`${element.observacion}`);
//           $('#ultimaousuario' + id).html(`${element.usuario}`);
//           $('#maxnovedad' + id).html(`${element.novedad}`);
//         });
//       } else {
//         $('#maxhorafecha' + id).text('<strong>No existe una novedad aún</strong>');
//         $('#ultimositio' + id).text('<strong>No tiene sitio de control</strong>');
//         $('#maxhorafecha' + id).text('<strong>No tiene observaciones</strong>');
//       }
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

function moverFilaAlFinal($fila) {
  var $tabla = $('#table1 tbody');
  $tabla.append($fila);
}
