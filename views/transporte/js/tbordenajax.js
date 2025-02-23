/* $(document).ready(function() {
  // $("#contenedor_datos").css("display", "none");
  $('#tabla_datos').css('display', 'block');
  $('.divcliente').hide();
  $('.divfechas').hide();
  $('.divbtnbusqueda').hide();
  //$("#titulo").html('');
  //$("#bodycontenido").html('');

  document.addEventListener('click', async e => {
    e.preventDefault();
    if (e.target.matches('#buscar_orden') || e.target.matches('#buscar_orden *')) {
      TablaOrden();
    }
  });
  // $('#buscar_orden').click(function() {
  //   //consulta de la tabla de ordenes de carga
  //   TablaOrden();
  // });

  $('#btn_imprimir').click(function() {
    var orden_cargue = $('#c_orden').val();
    var urloc = $('#id_url_ajax').val() + 'libs/orden_cargue.php?' + orden_cargue;
    window.open(urloc, '_blank');
  });

  //filtro
  $('#filtro').change(function() {
    var consultar = $('#filtro').val();
    if (consultar == '') {
      $('.divcliente').hide();
      $('.divfechas').hide();
      $('.divbtnbusqueda').hide();
    }
    if (consultar == 1) {
      $('.divcliente').hide();
      $('.divfechas').show();
      $('.divbtnbusqueda').show();
    }
    if (consultar == 2) {
      $('.divcliente').show();
      $('.divfechas').hide();
      $('.divbtnbusqueda').show();
      ConsultaCliente();
    }
    if (consultar == 3) {
      $('.divcliente').show();
      $('.divfechas').show();
      $('.divbtnbusqueda').show();
      ConsultaCliente();
    }
  });

  // JavaScript
  // document.getElementById('exportar_excel').addEventListener('click', function() {
  //   var table = document.getElementById('ordenes_decargue_export');
  //   if (table) {
  //     // Clonar la tabla
  //     var clonedTable = table.cloneNode(true);

  //     // Indicar qué columnas omitir (por ejemplo, 1 y 3)
  //     var columnsToOmit = [0, 7]; // Índices base 0

  //     // Eliminar las columnas no deseadas en el encabezado
  //     var ths = clonedTable.querySelectorAll('thead th');
  //     columnsToOmit.slice().reverse().forEach(index => {
  //       ths[index].remove();
  //     });

  //     // Eliminar las columnas no deseadas en las filas del cuerpo
  //     var rows = clonedTable.querySelectorAll('tbody tr');
  //     rows.forEach(row => {
  //       var cells = row.querySelectorAll('td');
  //       columnsToOmit.slice().reverse().forEach(index => {
  //         cells[index].remove();
  //       });
  //     });

  //     // Convertir la tabla modificada a libro de Excel
  //     var wb = XLSX.utils.table_to_book(clonedTable);
  //     const fechaActual = new Date().toISOString().slice(0, 10);
  //     const nombreArchivo = `Informe Ordenes de Cargue_${fechaActual}.xlsx`;
  //     XLSX.writeFile(wb, nombreArchivo);
  //   } else {
  //     console.error("El elemento con el ID 'ordenes_decargue' no existe.");
  //   }
  // });
});

function AnularOrden(idorden) {
  let confirm = window.confirm('¿Desea Anular la Orden de Cargue N° ' + idorden + ' ?');
  if (confirm == true) {
    //AnularOrden2(idorden);
    validar_anulacion(idorden);
  }
}

function validar_anulacion(idorden) {
  $.post(
    $('#id_url_ajax').val() + 'transporte/ValidaAnulacionOrden',
    'idorden=' + idorden,
    function(datu) {
      if (datu) {
        alert('Esta Orden ya esta asoaciada a una remesa activa!!');
      } else {
        AnularOrden2(idorden);
      }
    },
    'json',
  );
}

function AnularOrden2(idorden) {
  $.post(
    $('#id_url_ajax').val() + 'transporte/AnularOrden',
    'idorden=' + idorden,
    function(datu) {
      if (datu == 'true') {
        alert('Orden Anulada Exitosamente!!');
        TablaOrden();
      }
    },
    'json',
  );
}

function ConsultaOrden(idorden, idservicio) {
  $('.campov').val('');
  $('#tabla_cremitente').html('');
  $('#tabla_datos').css('display', 'none');
  $('#contenedor_datos').css('display', 'block');
  //traer datos de la orden de cargue-cabecera
  $.post(
    $('#id_url_ajax').val() + 'transporte/ConsultaOrden',
    'numorden=' + idorden,
    function(data) {
      if (data) {
        var trailer = '';
        if (data['placatrailer'] != null) {
          trailer = data['placatrailer'];
        }
        $('#titulo').html('Orden de cargue N° ' + data['id']);
        $('#c_orden').val(data['id']);
        $('.c_orden').html(data['id']);
        $('#c_placa').val(data['placa']);
        $('.c_placa').html(data['placa']);
        $('#c_nombre').val(data['nombre'] + ' ' + data['apellido1'] + ' ' + data['apellido2']);
        $('.c_nombre').html(data['nombre'] + ' ' + data['apellido1'] + ' ' + data['apellido2']);
        $('#c_numero').val(data['numero_documento']);
        $('.c_numero').html(data['numero_documento']);
        $('#c_celular').val(data['celular']);
        $('.c_celular').html(data['celular']);
        $('#c_carroceria').val(data['tipo_carroceria']);
        $('.c_carroceria').html(data['tipo_carroceria']);
        $('#c_marca').val(data['marca']);
        $('.c_marca').html(data['marca']);
        $('#c_modelo').val(data['anio_fabricacion']);
        $('.c_modelo').html(data['anio_fabricacion']);
        $('#c_color').val(data['color']);
        $('.c_color').html(data['color']);
        $('#c_tipovin').val(data['tipo_vinculacion']);
        $('.c_tipovin').html(data['tipo_vinculacion']);
        $('#c_clase').val(data['clase']);
        $('.c_clase').html(data['clase']);
        $('#c_remolque').val(trailer);
        $('.c_remolque').html(trailer);
        $('#c_flete').val(data['ve_fletecotizacion']);
        $('.c_flete').html(data['ve_fletecotizacion']);
        $('#c_fletep').val(data['ve_fletepactado']);
        $('.c_fletep').html(data['ve_fletepactado']);
        $('#c_producto').val(data['mer_producto']);
        $('#c_empaque').val(data['mer_empaque']);
        $('#c_cant').val(data['mer_cantidad']);
        $('#c_volumen').val(data['mer_volumen']);
        $('#c_pesom').val(data['mer_pesomercancia']);
        $('#c_con1').val(data['mer_contenedor1']);
        $('#c_con2').val(data['mer_contenedor2']);
        $('#c_obs').val(data['ca_observacion']);
        $('#c_condi').val(data['ca_condiciones']);
        $('#c_laje').val(data['ca_embalaje']);
      }
    },
    'json',
  );
  //traer datos del remitente + destinatario
  $.post(
    $('#id_url_ajax').val() + 'transporte/ConsultaRemitente',
    'numorden=' + idservicio + '&idorden=' + idorden,
    function(datm) {
      if (datm) {
        for (var v = 0; v < datm.length; v++) {
          var clase;
          if (datm[v]['tipo'] == 'punto entrega') {
            clase = 'Destinatario';
          }
          if (datm[v]['tipo'] == 'punto recogida') {
            clase = 'Remitente';
          }

          $('#tabla_cremitente').append(
            '<tr style="border-bottom: 1px #000 solid;" id="fila' +
              v +
              '">' +
              "<td style='font-size: 10px;white-space: nowrap;'>" +
              datm[v]['nombre'] +
              '</td>' +
              "<td style='font-size: 10px;white-space: nowrap;'>" +
              datm[v]['municipio'] +
              '-' +
              datm[v]['depto'] +
              '</td>' +
              "<td style='font-size: 10px;white-space: nowrap;'>" +
              datm[v]['direccion_entrega'] +
              '</td>' +
              "<td style='font-size: 10px;white-space: nowrap;'>" +
              datm[v]['fecha_estimada_entrega'] +
              '</td>' +
              "<td style='font-size: 10px;white-space: nowrap;'>" +
              datm[v]['hora_estimada'] +
              '</td>' +
              "<td style='font-size: 10px;white-space: nowrap;'>" +
              datm[v]['observacion'] +
              '</td>' +
              "<td style='font-size: 10px;white-space: nowrap;'>" +
              clase +
              '</td></tr>',
          );
        }
      }
    },
    'json',
  );
  //traer datos del destinatario
  $.post(
    $('#id_url_ajax').val() + 'transporte/ConsultaDestinatario',
    'numorden=' + idservicio + '&idorden=' + idorden,
    function(datm) {
      if (datm) {
        for (var v = 0; v < datm.length; v++) {
          $('#tabla_cremitente').append(
            '<tr id="fila' +
              v +
              '">' +
              '<td>' +
              datm[v]['destinatario'] +
              '</td>' +
              '<td>' +
              datm[v]['municipio'] +
              '-' +
              datm[v]['depto'] +
              '</td>' +
              '<td>' +
              datm[v]['direccion_entrega'] +
              '</td>' +
              '<td>' +
              datm[v]['fecha_estimada_entrega'] +
              '</td>' +
              '<td>' +
              datm[v]['hora_estimada'] +
              '</td>' +
              '<td>' +
              datm[v]['observacion'] +
              '</td>' +
              '<td>Destinatario</td></tr>',
          );
        }
      }
    },
    'json',
  );
  Consultar_Dato_Oet(idorden);
}

function ConsultaCliente() {
  $.post(
    $('#id_url_ajax').val() + 'transporte/ConsultaCliente',
    function(data) {
      $('#clientefiltro').html('<option value="">Seleccionar</option>');
      if (data) {
        for (var i = 0; i < data.length; i++) {
          $('#clientefiltro').append('<option value="' + data[i]['id'] + '">' + data[i]['nombre'] + '</option>');
        }
      } else {
        $('#clientefiltro').html('<option value="">Seleccionar</option>');
      }
    },
    'json',
  );
}

function ImprimirPdf(id) {
  let numeroorden = id;
  var urloc = $('#id_url_ajax').val() + 'libs/orden_cargue.php?' + 'n_orden=' + codificarBase64(numeroorden);
  window.open(urloc, '_blank');
}

function codificarBase64(texto) {
  return btoa(texto);
}

// Función para decodificar Base64
function decodificarBase64(textoCodificado) {
  return atob(textoCodificado);
}

function TablaOrden() {
  //limpiar campos y mostrar contendio
  $('#contenedor_datos').css('display', 'none');
  $('#tabla_datos').css('display', 'block');
  $('.campov').val('');
  $('#tabla_cremitente').html('');
  var filtrarpor = $('#filtro').val();
  var fecha, fechab, cliente;
  if (filtrarpor == 1) {
    fecha = $('#finicial').val();
    fechab = $('#ffinal').val();
    cliente = '';
  }
  if (filtrarpor == 2) {
    fecha = '';
    fechab = '';
    cliente = $('#clientefiltro').val();
  }
  if (filtrarpor == 3) {
    fecha = $('#finicial').val();
    fechab = $('#ffinal').val();
    cliente = $('#clientefiltro').val();
  }
  $.post(
    $('#id_url_ajax').val() + 'transporte/Consulta_Ordenes',
    'finicia=' + fecha + '&ffinal=' + fechab + '&cliente=' + cliente + '&filtro=' + filtrarpor,
    function(data) {
      $('#ordenbody').html('');
      if (data.ordenes) {
        $('.badge').html(data.total_ordenes);
        for (var a = 0; a < data.ordenes.length; a++) {
          //estado
          var status = '';
          var btnanular, btneditar, btnconsultar, btnpdf;
          btnconsultar = `<button class="btn btn-info btn-xs" title="ver orden" onClick="ConsultaOrden(${data.ordenes[a]['id']},${data.ordenes[a][
            'mer_idservicio'
          ]})"><i class="fa-regular fa-eye"></i></button>`;
          if (data.ordenes[a]['estado'] == 1) {
            status = '<td class="nexos-txt-success">' + '<center><span class="mdi mdi-dot-circle icon" title="Activo"></span></center>' + '</td>';
            //botones
            btnanular = `<button class="btn btn-danger btn-xs" title="Anular orden" onClick="AnularOrden(${data.ordenes[a]['id']})"><i class="fa-solid fa-ban"></i></button>`;
            btneditar = `<button class="btn btn-warning btn-xs" title="Editar orden" onClick="ConsultaOrden(${data.ordenes[a]['id']},${data.ordenes[a][
              'mer_idservicio'
            ]})"><i class="fa-solid fa-pencil"></i></button>`;
            btnpdf = `<button class="btn btn-success btn-xs" title="Immprimir Orden" onClick="ImprimirPdf(${data.ordenes[a]['id']})"><i class="fa-solid fa-print"></i></button>`;
          }
          if (data.ordenes[a]['estado'] == 0) {
            status = '<td class="nexos-txt-danger">' + '<center><span class="mdi mdi-dot-circle icon" title="Inactivo"></span></center>' + '</td>';
            btnanular = '';
            btneditar = '';
            btnpdf = '';
          }

          $('#ordenbody').append(
            `<tr>${status}
									<td class="text-center" style="font-size: 11px;white-space: nowrap;">${data.ordenes[a]['id']}</td>
									<td class="text-center" style="font-size: 11px;white-space: nowrap;">${data.ordenes[a]['cliente']}</td>
									<td class="text-center" style="font-size: 11px;white-space: nowrap;">${data.ordenes[a]['placa']}</td> 
									<td class="text-center" style="font-size: 11px;white-space: nowrap;">${data.ordenes[a]['nombre']} ${data.ordenes[a]['apellido1']} ${data.ordenes[a]['apellido2']}</td>
									<td class="text-center" style="font-size: 11px;white-space: nowrap;">
										<span>Peso: ${data.ordenes[a]['ca_pesocargue']}</span>
									</td>
									<td class="text-center" style="font-size: 11px;white-space: nowrap;">${data.ordenes[a]['ca_condiciones']}</td>
									<td class="text-right" style="font-size: 11px;white-space: nowrap;"> 
                    <div class="btn-group" role="group" aria-label="..." >
                      ${btnconsultar}
                      ${btnanular}
                      ${btneditar}
                      ${btnpdf}
										</div>
									</td>
						 </tr>
						`,
          );
        }
      }
      if (data) {
      }
    },
    'json',
  );
}

function Consultar_Dato_Oet(idorden) {
  $('#panel_oet').html('');
  var paquete = 'numero=' + idorden;
  $.post(
    $('#id_url_ajax').val() + 'integrar_oet/Consulta_Orden_Oet',
    paquete,
    function(data) {
      if (data.status == true || data.status == 'true') {
        $('#panel_oet').html('<p class="text-center text-success">' + data.resultado + '</p>');
      } else if (data.status == false || data.status == 'false') {
        $('#panel_oet').html('<p class="text-center text-danger">' + data.resultado + '</p>');
      }
    },
    'json',
  );
}
 */