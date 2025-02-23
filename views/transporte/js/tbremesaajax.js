$(document).ready(function() {
  $('#contenedor_datos').css('display', 'none');
  $('#tabla_datos').css('display', 'block');
  $('.divcliente').hide();
  $('.divfechas').hide();
  $('.divbtnbusqueda').hide();

  $('#buscar_remesa').click(function() {
    //consulta de la tabla de remesas
    TablaRemesa();
  });

  $('#btn_actualizar').click(function() {
    Actualizar_Remesa();
  });

  $('#btn_imprimir').click(function() {
    var idr = $('#c_remesa').val();
    var ido = $('#c_orden').val();
    var url = $('#id_url_ajax').val() + 'libs/remesa_pdf.php?' + 'remesa=' + codificarBase64(idr) + '&orden=' + codificarBase64(ido);
    window.open(url, '_blank');
  });

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
  document.getElementById('exportar_excel').addEventListener('click', function() {
    var table = document.getElementById('ordenes_remesa_export');
    if (table) {
      // Clonar la tabla
      var clonedTable = table.cloneNode(true);

      // Indicar qué columnas omitir (por ejemplo, 1 y 3)
      var columnsToOmit = [0, 6]; // Índices base 0

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
      const nombreArchivo = `Informe de Remesas_${fechaActual}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    } else {
      console.error("El elemento con el ID 'ordenes_decargue' no existe.");
    }
  });
});

function ConsultaRemesa_e(idremesa, idorden) {
  $('.btn2').hide();
  $('.btn1').show();
  $('.campov').val('');
  $('#tabla_datos').css('display', 'none');
  $('#contenedor_datos').css('display', 'block');
  //traer datos de la remesa
  $.post(
    $('#id_url_ajax').val() + 'transporte/Consulta_Dato_Remesa',
    'rem=' + idremesa + '&ord=' + idorden,
    function(data) {
      if (data) {
        var seguro, contado, contra, nat;
        if (data['aplica_seguro'] == 1) {
          seguro = '<option value="1">Si</option>' + '<option value="0">No</option>';
        }
        if (data['aplica_seguro'] == 0) {
          seguro = '<option value="0">No</option>' + '<option value="1">Si</option>';
        }
        if (data['remesa_contado'] == 1) {
          contado = '<option value="1">Si</option>' + '<option value="0">No</option>';
        }
        if (data['remesa_contado'] == 0) {
          contado = '<option value="0">No</option>' + '<option value="1">Si</option>';
        }
        if (data['remesa_contraentrega'] == 1) {
          contra = '<option value="1">Si</option>' + '<option value="0">No</option>';
        }
        if (data['remesa_contraentrega'] == 0) {
          contra = '<option value="0">No</option>' + '<option value="1">Si</option>';
        }

        if (data['naturaleza'] == 1) {
          nat = 'Carga normal';
        }
        if (data['naturaleza'] == 2) {
          nat = 'Carga peligrosa';
        }
        if (data['naturaleza'] == 3) {
          nat = 'Carga extradimensionada';
        }
        if (data['naturaleza'] == 4) {
          nat = 'Carga extrapesada';
        }
        if (data['naturaleza'] == 5) {
          nat = 'Residuos Peligrosos';
        }
        if (data['naturaleza'] == 6) {
          nat = 'Semovientes';
        }
        if (data['naturaleza'] == 7) {
          nat = 'Refrigerada';
        }

        $('#c_remesa').val(data['id_remesa']);
        $('#c_orden').val(data['id_orden_cargue']);
        $('#c_fecha').val(data['fecha_creacion']);
        $('#c_oficina').val(data['agencia']);
        $('#c_placa').val(data['placa']);
        $('#c_nombre').val(data['nombre'] + ' ' + data['apellido1'] + ' ' + data['apellido2']);
        $('#c_numero').val(data['numero_documento']);
        $('#c_remitente').val(data['remnombre']);
        $('#c_remciudad').val(data['remcity']);
        $('#c_remdireccion').val(data['remdireccion']);
        $('#c_destinatario').val(data['desnombre']);
        $('#c_desciudad').val(data['descity']);
        $('#c_desdireccion').val(data['desdireccion']);
        $('#c_flete').val(data['valor_declarado']);
        $('#c_producto').val(data['tipo_mercancia']);
        $('#c_natu').val(nat);
        $('#c_seguro').html(seguro);
        $('#c_remesac').html(contado);
        $('#c_remcontra').html(contra);
        $('#c_descripcion').val(data['descripcion_novedad']);
        //
        $('#c_seguro').attr('readonly', false);
        $('#c_remesac').attr('readonly', false);
        $('#c_remcontra').attr('readonly', false);
      }
    },
    'json',
  );
}

function ConsultaRemesa(idremesa, idorden) {
  $('#panel_oet').html('');
  $('.btn2').show();
  $('.btn1').hide();
  $('.campov').val('');
  $('#tabla_datos').css('display', 'none');
  $('#contenedor_datos').css('display', 'block');
  //traer datos de la remesa
  $.post(
    $('#id_url_ajax').val() + 'transporte/Consulta_Dato_Remesa',
    'rem=' + idremesa + '&ord=' + idorden,
    function(data) {
      if (data) {
        var seguro, contra, contado, nat;
        if (data['aplica_seguro'] == 1) {
          seguro = '<option value="1">Si</option>' + '<option value="0">No</option>';
        }
        if (data['aplica_seguro'] == 0) {
          seguro = '<option value="0">No</option>' + '<option value="1">Si</option>';
        }
        if (data['remesa_contado'] == 1) {
          contado = '<option value="1">Si</option>' + '<option value="0">No</option>';
        }
        if (data['remesa_contado'] == 0) {
          contado = '<option value="0">No</option>' + '<option value="1">Si</option>';
        }
        if (data['remesa_contraentrega'] == 1) {
          contra = '<option value="1">Si</option>' + '<option value="0">No</option>';
        }
        if (data['remesa_contraentrega'] == 0) {
          contra = '<option value="0">No</option>' + '<option value="1">Si</option>';
        }

        if (data['naturaleza'] == 1) {
          nat = 'Carga normal';
        }
        if (data['naturaleza'] == 2) {
          nat = 'Carga peligrosa';
        }
        if (data['naturaleza'] == 3) {
          nat = 'Carga extradimensionada';
        }
        if (data['naturaleza'] == 4) {
          nat = 'Carga extrapesada';
        }
        if (data['naturaleza'] == 5) {
          nat = 'Residuos Peligrosos';
        }
        if (data['naturaleza'] == 6) {
          nat = 'Semovientes';
        }
        if (data['naturaleza'] == 7) {
          nat = 'Refrigerada';
        }

        $('#c_remesa').val(data['id_remesa']);
        $('#c_orden').val(data['id_orden_cargue']);
        $('#c_fecha').val(data['fecha_creacion']);
        $('#c_oficina').val(data['agencia']);
        $('#c_placa').val(data['placa']);
        $('#c_nombre').val(data['nombre'] + ' ' + data['apellido1'] + ' ' + data['apellido2']);
        $('#c_numero').val(data['numero_documento']);
        $('#c_remitente').val(data['remnombre']);
        $('#c_remciudad').val(data['remcity']);
        $('#c_remdireccion').val(data['remdireccion']);
        $('#c_destinatario').val(data['desnombre']);
        $('#c_desciudad').val(data['descity']);
        $('#c_desdireccion').val(data['desdireccion']);
        $('#c_flete').val(data['valor_declarado']);
        $('#c_producto').val(data['tipo_mercancia']);
        $('#c_natu').val(nat);
        $('#c_seguro').html(seguro);
        $('#c_remesac').html(contado);
        $('#c_remcontra').html(contra);
        $('#c_descripcion').val(data['descripcion_novedad']);
        $('#id_servicio').val(data['id']);
        if (data['nombre_archivo'] != '' && data['nombre_archivo'] != '') {
          var docu =
            '<a  href="' +
            $('#id_url_ajax').val() +
            data['soporte_novedad'] +
            '/' +
            data['nombre_archivo'] +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            '</span>' +
            '</a>';
          $('#documento').html(docu);
        } else {
          $('#documento').html('<p>No existe un archivo en la ubicación</p>');
        }
        /*$("#c_seguro").attr('readonly', true);
			$("#c_remesac").attr('readonly', true);
			$("#c_remcontra").attr('readonly', true);*/
        Consulta_Remesa_oet(data['id_remesa']);
      }
    },
    'json',
  );
}

function AnularRemesa(idremesa) {
  //validar anulacion de remesa
  $.post(
    $('#id_url_ajax').val() + 'transporte/ValidarRemesa',
    'id_remesa=' + idremesa,
    function(datu) {
      if (datu) {
        alert('Esta remesa tiene un Manifiesto Activo');
      } else {
        Anule_Remesa(idremesa);
      }
    },
    'json',
  );
}

function Anule_Remesa(numremesa) {
  $.post(
    $('#id_url_ajax').val() + 'transporte/AnularRemesa',
    'id_remesa=' + numremesa,
    function(datu) {
      if (datu == 'true') {
        alert('Remesa Anulada Exitosamente!!');
        TablaRemesa();
      }
    },
    'json',
  );
}

function Actualizar_Remesa() {
  var id = $('#c_remesa').val();
  var seguro = $('#c_seguro').val();
  var contado = $('#c_remesac').val();
  var contraentrega = $('#c_remcontra').val();

  var dato = 'id_remesa=' + id + '&seguro=' + seguro + '&contado=' + contado + '&contra=' + contraentrega;
  $.post(
    $('#id_url_ajax').val() + 'transporte/ActualizaRemesa',
    dato,
    function(datu) {
      if (datu == 'true') {
        alert('Remesa Actualizada Exitosamente!!');
        TablaRemesa();
      }
    },
    'json',
  );
}

function TablaRemesa() {
  $('#contenedor_datos').css('display', 'none');
  $('#tabla_datos').css('display', 'block');
  $('#tabla_cremitente').html('');
  var filtrarpor = $('#filtro').val();
  var fecha, fechab, cliente;
  if (filtrarpor == 1) {
    ini = $('#finicial').val();
    fin = $('#ffinal').val();
    cliente = '';
  }
  if (filtrarpor == 2) {
    ini = '';
    fin = '';
    cliente = $('#clientefiltro').val();
  }
  if (filtrarpor == 3) {
    ini = $('#finicial').val();
    fin = $('#ffinal').val();
    cliente = $('#clientefiltro').val();
  }
  $.post(
    $('#id_url_ajax').val() + 'transporte/Consulta_Remesas_TB',
    'finicia=' + ini + '&ffinal=' + fin + '&cliente=' + cliente + '&filtro=' + filtrarpor,
    function(data) {
      $('.badge').html(data.total_remesas);
      $('#remesabody').html('');
      if (data.remesas) {
        for (var a = 0; a < data.remesas.length; a++) {
          var status = '';
          var btnanular, btneditar, btnconsultar, btnpdf;
          if (data.remesas[a]['estado'] == 1) {
            status = '<td class="nexos-txt-success">' + '<center><span class="mdi mdi-dot-circle icon" title="Activo"></span></center>' + '</td>';
            //botones
            btnanular = `<button class="btn btn-danger btn-sm mdi mdi-block" title="Anular remesa" onClick="AnularRemesa(${data.remesas[a]['id_remesa']})"></button>`;
            // '<button class="btn btn-danger btn-sm mdi mdi-block" title="Anular remesa" onClick="AnularRemesa(' + data.remesas[a]["id_remesa"] +')"></button>';
            btneditar = `<button class="btn btn-warning btn-sm mdi mdi-edit" title="Editar remesa" onClick="ConsultaRemesa_e(${data.remesas[a]['id_remesa']},${data.remesas[a][
              'id_orden_cargue'
            ]})"></button>`;
            // '<button class="btn btn-warning btn-sm mdi mdi-edit" title="Editar remesa" onClick="ConsultaRemesa_e(' + data.remesas[a]["id_remesa"] + "," + data.remesas[a]["id_orden_cargue"] +')"></button>';
            btnconsultar = `<button class="btn btn-info btn-sm mdi mdi-eye" title="ver remesa" onClick="ConsultaRemesa(${data.remesas[a]['id_remesa']},${data.remesas[a][
              'id_orden_cargue'
            ]})"></button>`;
            // '<button class="btn btn-info btn-sm mdi mdi-eye" title="ver remesa" onClick="ConsultaRemesa(' + data.remesas[a]["id_remesa"] +"," + data.remesas[a]["id_orden_cargue"] +')"></button>';
            btnpdf = `<button class="btn btn-success btn-sm" title="Immprimir Remesa" onClick="ImprimirPdf(${data.remesas[a]['id_remesa']},${data.remesas[a][
              'id_orden_cargue'
            ]})"><i class="fa-solid fa-file-pdf"></i></button>`;
          }
          if (data.remesas[a]['estado'] == 0) {
            status = '<td class="nexos-txt-danger">' + '<center><span class="mdi mdi-dot-circle icon" title="Inactivo"></span></center>' + '</td>';
            btnanular = '';
            btneditar = '';
            btnconsultar = '';
            btnpdf = '';
          }

          $('#remesabody').append(`<tr>${status}
  				<td>${data.remesas[a]['id_remesa']} / ${data.remesas[a]['id_orden_cargue']}</td> 
  				<td>${data.remesas[a]['placa']}</td> 
  				<td>${data.remesas[a]['nombre']} ${data.remesas[a]['apellido1']} ${data.remesas[a]['apellido2']}</td>
  				<td class="cell-detail">
  					<span>${data.remesas[a]['descripcion_novedad']}</span>
  				</td>
  				<td>${data.remesas[a]['fecha_creacion']} - ${data.remesas[a]['hora_creacion']}</td>
  				<td style="width: 150px;">
							<div class="btn-group" role="group" aria-label="..." >
										${btnanular}
										${btneditar}
										${btnconsultar}
										${btnpdf}
							</div>
  				</td>
  				</tr>`);
        }
      }
    },
    'json',
  );
}

function ImprimirPdf(id, or) {
  var url = $('#id_url_ajax').val() + 'libs/remesa_pdf.php?' + 'remesa=' + codificarBase64(id) + '&orden=' + codificarBase64(or);
  window.open(url, '_blank');
}

function ConsultaCliente() {
  $.post(
    $('#id_url_ajax').val() + 'transporte/ConsultaClienter',
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

function Consulta_Remesa_oet(idremesa) {
  $('#panel_oet').html('NO HAY ENDPOINT PARA REALIZAR CONSULTA DE REMESA');
}

function codificarBase64(texto) {
  return btoa(texto);
}

// Función para decodificar Base64
function decodificarBase64(textoCodificado) {
  return atob(textoCodificado);
}
