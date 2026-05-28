$(document).ready(function () {
  // $('#contenedor_datos').css('display', 'none');
  // $('#tabla_datos').css('display', 'block');
  // $('.divcliente').hide();
  // $('.divfechas').hide();
  // $('.divbtnbusqueda').hide();
  //$("#titulo").html('');
  //$("#bodycontenido").html('');
  $('#buscar_orden').click(function () {
    //consulta de la tabla de ordenes de carga
    TablaOrden();
  });

  // $('#btn_imprimir').click(function() {
  //   var id = $('#c_orden').val();
  //   $.ajax({
  //     url: $('#id_url_ajax').val() + 'transporte/ConsultaPdfVer',
  //     method: 'POST',
  //     data: {numeroorden: id},
  //     dataType: 'json',
  //     success: function(data) {
  //       if (data) {
  //         //
  //         var orden = data[0]['id'];
  //         var cliente = data[0]['cliente'];
  //         var identifica = data[0]['documento'];
  //         var producto = data[0]['mer_producto'];
  //         var volumen = data[0]['mer_volumen'];
  //         var cantidad = data[0]['mer_cantidad'];
  //         var peso_mercancia = data[0]['mer_pesomercancia'];
  //         //var marca=data['marca'];
  //         var marca = data[0]['marca_letra'];
  //         var placa = data[0]['placa'];
  //         var modelo = data[0]['anio_fabricacion'];
  //         var remolque = data[0]['placatrailer'];
  //         var color = data[0]['color_texto'];
  //         var conductor = data[0]['nombreconductor'] + ' ' + data[0]['apellido1'] + ' ' + data[0]['apellido2'];
  //         var doc_conductor = data[0]['numero_documento'];
  //         var condici = data[0]['ca_condiciones'];
  //         var observacio = data[0]['ca_observacion'];
  //         //datos del remitente
  //         var nameremi = data[0]['nombre'];
  //         var direremi = data[0]['direccion_entrega'];
  //         var telremi = data[0]['telefono'];
  //         var origen = data[0]['origen'];
  //         //datos de destinatario
  //         var namedesti = data[0]['destinatario'];
  //         var diredesti = data[0]['dire_destinatario'];
  //         var teldesti = data[0]['tel_destinatario'];
  //         var destino = data[0]['destino'];
  //         //precintos
  //         var tot_precinto = data[1].length;
  //         var arraypreci = new Array(2);
  //         for (var m = 0; m < data[1].length; m++) {
  //           arraypreci[m] = data[1][m].serie_precinto;
  //         }
  //         var notanew = arraypreci;
  //         my_li = JSON.stringify(notanew);
  //         var notanew = JSON.parse(my_li);
  //         var agencia = data[0]['Nombre_Agencia'];
  //         var datos_pdf =
  //           'n_orden=' +
  //           orden +
  //           '&cliente=' +
  //           cliente +
  //           '&nit=' +
  //           identifica +
  //           '&producto=' +
  //           producto +
  //           '&vol=' +
  //           volumen +
  //           '&cant=' +
  //           cantidad +
  //           '&peso=' +
  //           peso_mercancia +
  //           '&mark=' +
  //           marca +
  //           '&plak=' +
  //           placa +
  //           '&modelo=' +
  //           modelo +
  //           '&trailer=' +
  //           remolque +
  //           '&color=' +
  //           color +
  //           '&conductor=' +
  //           conductor +
  //           '&cedula=' +
  //           doc_conductor +
  //           '&condici=' +
  //           condici +
  //           '&obscargue=' +
  //           observacio +
  //           '&remitente=' +
  //           nameremi +
  //           '&remdire=' +
  //           direremi +
  //           '&remtel=' +
  //           telremi +
  //           '&remorigen=' +
  //           origen +
  //           '&destinatario=' +
  //           namedesti +
  //           '&destidire=' +
  //           diredesti +
  //           '&destitel=' +
  //           teldesti +
  //           '&destino=' +
  //           destino +
  //           '&precintos=' +
  //           notanew +
  //           '&agencia=' +
  //           agencia;

  //         var urloc = $('#id_url_ajax').val() + 'libs/orden_cargue.php?' + datos_pdf;
  //         window.open(urloc, '_blank');
  //       }
  //     },
  //     error: function(jqXHR, textStatus, errorThrown) {
  //       $('#tabla_remesas').html('');
  //       console.log(jqXHR);
  //       console.log(textStatus);
  //       console.log(errorThrown);
  //     },
  //   });
  // });

  $('#btn_imprimir').click(function () {
    var orden_cargue = $('#c_orden').val();
    var urloc = $('#id_url_ajax').val() + 'libs/orden_cargue.php?' + orden_cargue;
    window.open(urloc, '_blank');
  });

  //filtro
  $('#filtro').change(function () {
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

  document.getElementById('exportar_excel').addEventListener('click', function () {
    var table = document.getElementById('ordenes_decargue_export');
    if (table) {
      // Clonar la tabla
      var clonedTable = table.cloneNode(true);

      // Indicar quÃ© columnas omitir (por ejemplo, 1 y 3)
      var columnsToOmit = [0, 7]; // Ãndices base 0

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
      const nombreArchivo = `Informe Ordenes de Cargue_${fechaActual}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    } else {
      console.error("El elemento con el ID 'ordenes_decargue' no existe.");
    }
  });
});

function AnularOrden(idorden) {
  let confirm = window.confirm('Â¿Desea Anular la Orden de Cargue NÂ° ' + idorden + ' ?');
  if (confirm == true) {
    //AnularOrden2(idorden);
    validar_anulacion(idorden);
  }
}

function validar_anulacion(idorden) {
  $.post(
    $('#id_url_ajax').val() + 'transporte/ValidaAnulacionOrden',
    'idorden=' + idorden,
    function (datu) {
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
    function (datu) {
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
    function (data) {
      if (data) {
        var trailer = '';
        if (data['placatrailer'] != null) {
          trailer = data['placatrailer'];
        }
        $('#titulo').html('Orden de cargue NÂ° ' + data['id']);
        $('#c_orden').val(data['id']);
        $('#c_placa').val(data['placa']);
        $('#c_nombre').val(data['nombre'] + ' ' + data['apellido1'] + ' ' + data['apellido2']);
        $('#c_numero').val(data['numero_documento']);
        $('#c_celular').val(data['celular']);
        $('#c_carroceria').val(data['tipo_carroceria']);
        $('#c_marca').val(data['marca']);
        $('#c_modelo').val(data['anio_fabricacion']);
        $('#c_color').val(data['color']);
        $('#c_tipovin').val(data['tipo_vinculacion']);
        $('#c_clase').val(data['clase']);
        $('#c_remolque').val(trailer);
        $('#c_flete').val(data['ve_fletecotizacion']);
        $('#c_fletep').val(data['ve_fletepactado']);
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
    function (datm) {
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
            '<tr id="fila' +
            v +
            '">' +
            '<td>' +
            datm[v]['nombre'] +
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
            '<td>' +
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
    function (datm) {
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
    function (data) {
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
  // var id = $("#c_orden").val();
  let numeroorden = id;
  var urloc = $('#id_url_ajax').val() + 'libs/orden_cargue.php?' + 'n_orden=' + codificarBase64(numeroorden);
  window.open(urloc, '_blank');
}

function codificarBase64(texto) {
  return btoa(texto);
}

// FunciÃ³n para decodificar Base64
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
    function (data) {
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

// function TablaOrden() {
//   //limpiar campos y mostrar contendio
//   $("#contenedor_datos").css("display", "none");
//   $("#tabla_datos").css("display", "block");
//   $(".campov").val("");
//   $("#tabla_cremitente").html("");
//   var filtrarpor = $("#filtro").val();
//   var fecha, fechab, cliente;
//   if (filtrarpor == 1) {
//     fecha = $("#finicial").val();
//     fechab = $("#ffinal").val();
//     cliente = "";
//   }
//   if (filtrarpor == 2) {
//     fecha = "";
//     fechab = "";
//     cliente = $("#clientefiltro").val();
//   }
//   if (filtrarpor == 3) {
//     fecha = $("#finicial").val();
//     fechab = $("#ffinal").val();
//     cliente = $("#clientefiltro").val();
//   }
//   $.post(
//     $("#id_url_ajax").val() + "transporte/Consulta_Ordenes",
//     "finicia=" + fecha + "&ffinal=" + fechab + "&cliente=" + cliente + "&filtro=" + filtrarpor,
//     function (data) {
//       $("#ordenbody").html("");
//       if (data) {
//         for (var a = 0; a < data.length; a++) {
//           //estado
//           var status = "";
//           var btnanular, btneditar, btnconsultar, btnpdf;
//           btnconsultar = `<button class="btn btn-info btn-sm mdi mdi-eye" title="ver orden" onClick="ConsultaOrden(${data[a]["id"]},${data[a]["mer_idservicio"]})"></button>`;
//           // '<button class="btn btn-space btn-secondary btn-sm mdi mdi-eye" title="ver orden" onClick="ConsultaOrden(' +data[a]["id"] +"," + data[a]["mer_idservicio"] +')"></button>';
//           if (data[a]["estado"] == 1) {
//             status = '<td class="nexos-txt-success">' + '<center><span class="mdi mdi-dot-circle icon" title="Activo"></span></center>' + "</td>";
//             //botones
//             btnanular = `<button class="btn btn-danger btn-sm mdi mdi-block" title="Anular orden" onClick="AnularOrden(${data[a]["id"]})"></button>`;
//             btneditar = `<button class="btn btn-warning btn-sm mdi mdi-edit" title="Editar orden" onClick="ConsultaOrden(${data[a]["id"]},${data[a]["mer_idservicio"]})"></button>`;
//             btnpdf = `<button class="btn btn-success btn-sm" title="Immprimir Orden" onClick="ImprimirPdf(${data[a]["id"]})"><i class="fa-solid fa-file-pdf"></i></button>`;
//           }
//           if (data[a]["estado"] == 0) {
//             status = '<td class="nexos-txt-danger">' + '<center><span class="mdi mdi-dot-circle icon" title="Inactivo"></span></center>' + "</td>";
//             btnanular = "";
//             btneditar = "";
//             btnpdf = "";
//           }
//           $("#ordenbody").append(
//             `<tr>${status}
// 									<td>${data[a]["id"]}</td>
// 									<td>${data[a]["cliente"]}</td>
// 									<td>${data[a]["placa"]}</td>
// 									<td>${data[a]["nombre"]} ${data[a]["apellido1"]} ${data[a]["apellido2"]}</td>
// 									<td class="cell-detail">
// 										<span>Peso: ${data[a]["ca_pesocargue"]}</span>
// 									</td>
// 									<td>${data[a]["ca_condiciones"]}</td>
// 									<td  style="width: 150px;">
// 										<div class="btn-group" role="group" aria-label="..." >
// 										${btnanular}
// 										${btneditar}
// 										${btnconsultar}
// 										${btnpdf}
// 										</div>
// 									</td>
// 						 </tr>
// 						`,
//           );
//           // $("#ordenbody").append('<tr>'+status+
//           // '<td>'+data[a]['id']+'</td>'+
//           // '<td>'+data[a]['cliente']+'</td>'+
//           // ' <td>'+data[a]['placa']+'</td> '+
//           // '<td>'+data[a]['nombre']+' '+data[a]['apellido1']+' '+data[a]['apellido2']+'</td>'+
//           // '<td class="cell-detail">'+
//           // 	'<span>Peso: '+data[a]['ca_pesocargue']+'</span>'+
//           // '</td>'+
//           // '<td>'+data[a]['ca_condiciones']+'</td>'+
//           // '<td>'+
//           // 	btnanular+'&nbsp;'+
//           // 	btneditar+'&nbsp;'+
//           // 	btnconsultar+
//           // '</td>'+
//           // '</tr>');
//         }
//       }
//       if (data) {
//       }
//     },
//     "json",
//   );
// }

function Consultar_Dato_Oet(idorden) {
  $('#panel_oet').html('');
  var paquete = 'numero=' + idorden;
  $.post(
    $('#id_url_ajax').val() + 'integrar_oet/Consulta_Orden_Oet',
    paquete,
    function (data) {
      if (data.status == true || data.status == 'true') {
        $('#panel_oet').html('<p class="text-center text-success">' + data.resultado + '</p>');
      } else if (data.status == false || data.status == 'false') {
        $('#panel_oet').html('<p class="text-center text-danger">' + data.resultado + '</p>');
      }
    },
    'json',
  );
}
