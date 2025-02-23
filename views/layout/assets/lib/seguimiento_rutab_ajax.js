var codigoPlan = '';
var codigoInicio = '';
var manifiesti_codigo = '';
/* Vairbales para ejemplo */
var codini = '';
var codigo_plan = '';
var planilla = '';
var placa = '';
var mani = '';
var dcondu = '';
var med = '';
var manifiesto = '';
var solicitud_servicio = new Array();
// Array de ordenes de cargue
var occargue = '';
var ordremesas = '';

$(document).ready(function() {
  //recibir variable de la URL
  let params = new URLSearchParams(location.search);
  var manifi = params.get('m');
  manifiesti_codigo = manifi;

  Tarjeta_Seguimiento(manifi);
  Informacion(manifi);
  $('.panel-collapse').on('show.collapse', function() {
    $(this).siblings('.panel-heading').addClass('active');
  });

  $('.panel-collapse').on('hide.collapse', function() {
    $(this).siblings('.panel-heading').removeClass('active');
  });

  /* Cargar seccion interna de registro de fechas */
  $('#orden-carga').click(function() {
    $('.remesas').removeClass('active');
    $('.orden-carga').addClass('active');
    $('.plan-ruta').removeClass('active');
    $('.trazabilidad').removeClass('active');
    ordenes_carga();
  });

  /* Cargar seccion interna de registro de remesas de fecha */
  $('#remesa').click(function() {
    $('.remesas').addClass('active');
    $('.orden-carga').removeClass('active');
    $('.plan-ruta').removeClass('active');
    remesas();
  });

  /* Cargar seccion interna de plan de ruta */
  $('#plan-ruta').click(function() {
    $('.remesas').removeClass('active');
    $('.orden-carga').removeClass('active');
    $('.plan-ruta').addClass('active');
    $('.trazabilidad').removeClass('active');
    // plan_ruta();
  });

  /* Cargar seccion interna de trazabilidad */
  $('#trazabilidad').click(function() {
    $('.remesas').removeClass('active');
    $('.orden-carga').removeClass('active');
    $('.plan-ruta').removeClass('active');
    $('.trazabilidad').addClass('active');
    trazabilidad();
  });

  /* Cargar los puntos de entrega de ese manifiesto */
  var ent = {
    manifiesto: manifiesti_codigo,
    action: 'consultar_pentrega',
  };
  $('#panel_entrega').html('');
  $.ajax({
    url: url,
    type: 'POST',
    data: ent,
    dataType: 'json',
    success: function(data) {
      if (data) {
        let body = '';
        data.result.forEach(function(element, index) {
          body =
            '<tr>' +
            '<td>' +
            element.cliente +
            '</td>' +
            '<td>' +
            element.nameremi +
            '</td>' +
            '<td>' +
            element.namedest +
            '</td>' +
            '<td>' +
            element.diredest +
            '</td>' +
            '<td>' +
            element.fechadest +
            '/' +
            element.horadest +
            '</td>' +
            '</tr>';
          $('#panel_entrega').append(body);
        });
      } else {
        alert('no entro');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
});

var url = $('#id_url_ajax').val() + 'libs/seguimientoruta_ajax.php';
var url2 = $('#id_url_ajax').val() + 'libs/trafico2_ajax.php';
function Tarjeta_Seguimiento(manifi) {
  //Tarjeta de seguimiento
  var tabla = {
    manifiesto: manifi,
    // action: "consultar_inicioruta",
  };
  $('#body_esconder').html('');
  $.ajax({
    // url: url,
    url: $('#id_url_ajax').val() + 'trafico/Consultar_inicio_ruta',
    type: 'POST',
    data: tabla,
    dataType: 'json',
    success: function(data) {
      if (data) {
        var c = 0;
        data.forEach(function(element, index) {
          c++;
          //var codini=element.id;
          codini = element.cod_inicio;
          codigo_plan = element.cod_plan;
          // plan_ruta(codigo_plan, codini, manifi);
          planilla = element.id_estudio_seguridad;
          placa = element.placa;
          mani = element.med;
          dcondu = element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2;
          med = element.med;
          manifiesto = element.num_manifiesto;
          // ultimanovedad(codini, c);
          let codinin = codini;
          // Informacio_Principal(manifi, codinin);
          // Consulta_Seguimiento_Actual(codini);
          var btngestor;
          if (element.estado != 'Entregado') {
            btngestor =
              '<button type="button" class="btn btn-primary btn btn-md mdi mdi-truck" id="btn_ver' +
              c +
              '"  data-toggle="modal"' +
              'data-target="#ver_gestion"  data-placement="top"  title="Realizar Gestión"  onclick="gestion(this)"' +
              'data-id="' +
              codini +
              '" data-id2="' +
              mani +
              '" data-id3="' +
              placa +
              '" data-id4="' +
              dcondu +
              '" data-id6="' +
              codigo_plan +
              '" data-id7="' +
              med +
              '" data-id8="' +
              planilla +
              '" data-id9="' +
              manifiesto +
              '"></button>';
          } else {
            btngestor =
              '<button type="button" class="btn btn-primary btn btn-md mdi mdi-truck" id="btn_ver' +
              c +
              '"  data-toggle="modal"' +
              'data-target="#"  data-placement="top"  title="Realizar Gestión"  onclick="gestion(this)"' +
              'data-id="' +
              codini +
              '"></button>';
          }

          var cuerpo = `
							<div class="table-responsive">
									<table cellpadding="0" cellspacing="1" width="100%" border="1" style="font-size: 8pt;">
										<thead style="font-size: 8pt;background-color: #EEEEEE;border-bottom: 1px #ddd solid;">
											<tr>
												<th class="text-center">Lugar</th>
												<th class="text-center">Hora/Fecha Control</th>
												<th class="text-center">Novedad</th>
												<th class="text-center" style="width: 350px;">Observación</th>
												<th class="text-center">Usuario</th>
											</tr>
										</thead>
										<tbody id="seguimiento_real"></tbody>
									</table>
							</div>
						`;
          var panel = `${cuerpo}`;
          $('.hcontenedor').append(panel);
          // semaforo(codini, c);
          // ubicacionsemaforo(codini, c);
        });
        plan_ruta(codigo_plan, codini, manifi);
        Informacio_Principal(manifi, codini);
        Consulta_Seguimiento_Actual(codini);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // alert("ocurrio un error en consulta de tabla");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

/* Funcion para llenar información principal de seguimiento */
async function Informacio_Principal(manifi, codinin) {
  $('#loading-overlay-nexosapp ').css('display', 'flex');
  let datos = new FormData();
  datos.append('manifiesto', manifi);

  //Nueva consulta  modificada con el fecht
  try {
    const response = await fetch($('#id_url_ajax').val() + 'trafico/seguimiento_ruta', {
      method: 'POST',
      body: datos,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      data.forEach(function(element, index) {
        var dcondu = element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2;
        codigoPlan = element.cod_plan;
        codigoInicio = element.cod_inicio;
        // plan_ruta(codigoPlan);
        $('.manifiesto').html(element.num_manifiesto);
        // $(".agencia").html(decodeURIComponent(escape(element.Lugar)));
        $('.agencia').html(element.Lugar);
        $('.conductor').html(dcondu);
        $('.documento').html(element.cond_cedula);
        $('.celular').html(element.celular);
        $('.telefono').html(element.celular);
        $('.marca').html(element.marca);
        $('.linea').html(element.descripcion);
        $('.color').html(element.color);
        $('.operador-gps').html(element.operador_gps);
        $('.url-gps').attr('href', element.url);
        $('.url-gps').html(element.url);
        $('.usuario-gps').html(element.usuario_satelital);
        $('.usuario-salida').html(element.usuario);
        $('.remolque').html(element.Placatrailer);

        /* Segunda columna de la tabla de informacioón */
        $('.origen').html(element.origin);
        $('.destino').html(element.destini);
        $('.ruta').html(element.nombre_plan);
        $('.fecha-salida').html(element.fechasalida + '-' + element.horasalida);
        // $(".fecha-llegada").html(element.nombre_plan);
        $('.configuración').html(element.configuracion);
        $('.carroceria').html(element.carrocerias);
        $('.id-gps').html(element.id);
        $('.clave-gps').html(element.clave_satelital);
        $('.placa').html(element.placa);
        $('.modelo').html(element.anio_fabricacion);
        $('.fecha-llegada').html(element.fecha_descargue && element.hora_descargue ? element.fecha_descargue + '-' + element.hora_descargue : 'Sin resgistrar' + ' - ' + 'Sin resgistrar');
      });
    } else {
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    throw error;
  } finally {
    $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    // Puntos_geograficos(codigoPlan, codinin);
  }
}

async function Puntos_geograficos(codigoPlan, codinin) {
  /*Pintar el mapa de la ruta que el vehiculo lleva */
  var cont = {
    id_plan: codigoPlan,
  };
  // $("#panel_geografico").html("");
  var pcarraylat = new Array();
  var pcarraylong = new Array();
  var namepc = new Array();
  $.ajax({
    // url: url,
    url: $('#id_url_ajax').val() + 'trafico/consultar_puntos_geograficos',
    type: 'POST',
    data: cont,
    dataType: 'json',
    success: function(data) {
      if (data) {
        var t = 0;
        data.forEach(function(element, index) {
          pcarraylat[t] = [element.latitud_punto];
          pcarraylong[t] = [element.longitud_punto];
          namepc[t] = [element.nombre_punto];
          t++;
        });

        var latori = data[0].latitud_origen;
        var latdes = data[0].latitud_destino;
        var longori = data[0].longitud_origen;
        var longdes = data[0].longitud_destino;
        //pintar_mapageografico(latori, latdes, longori, longdes, pcarraylat, pcarraylong, namepc);
        initMap(latori, latdes, longori, longdes, pcarraylat, pcarraylong, namepc, codinin);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

/* Funciones para llenar la tabla de informacion de remesa*/
function Informacion(manifi) {
  $.post(
    $('#id_url_ajax').val() + 'tiempo_logistico_cargue/Selecciona_Ordenes',
    'manifiesto=' + manifi,
    function(data) {
      if (data) {
        data.forEach(element => {
          // Primera validación: Verificar órdenes de carga
          $.post(
            $('#id_url_ajax').val() + 'tiempo_logistico_cargue/Verificar_ordenes',
            'orden_cargue=' + element.id + '&manifiesto=' + manifi,
            function(datosOrden) {
              if (datosOrden.length > 0) {
                // Segunda validación: Verificar remesas
                $.post(
                  $('#id_url_ajax').val() + 'tiempo_logistico_descargue/Verificar_ordenes',
                  'remesa=' + element.Remesa + '&manifiesto=' + manifi,
                  function(datosRemesa) {
                    if (datosRemesa.length > 0) {
                      $('#tbl_informacion').append(`
                        <tr>
                          <td style="background-color: #FFFFFF;border-right:1px #ddd solid;">
                            <a href="Javascript:void(0)" onclick="abrir_orden_carga(${manifi},${element.id});" style="font-weight:bold;">[${element.id}]</a>
                            <input type="hidden" name="orden_cargue_id[]" value="${element.id}" class="orden_cargue_id">
                          </td>
                          <td style="background-color: #FFFFFF;border-right:1px #ddd solid;">
                            <a href="Javascript:void(0)" onclick="abrir_remesa(${manifi},${element.Remesa});" style="font-weight:bold;">[${element.Remesa}]</a>
                             <input type="hidden" name="remesa_descargue_id[]" value="${element.Remesa}" class="remesa_descargue_id">
                          </td>
                          <td style="border-right:1px #ddd solid;">0000-00-00 00-00-00</td>
                          <td style="border-right:1px #ddd solid;">${element.peso}Kg</td>
                          <td style="border-right:1px #ddd solid;">Volumen</td>
                          <td style="border-right:1px #ddd solid;">${element.empaque}</td>
                          <td style="border-right:1px #ddd solid;">${element.mer_producto}</td>
                          <td style="border-right:1px #ddd solid;">${element.Cliente}</td>
                          <td style="border-right:1px #ddd solid;">${element.Remitente}</td>
                          <td style="border-right:1px #ddd solid;">${element.Destinatario}</td>
                        </tr>
                      `);
                    } else {
                      $('#tbl_informacion').append(`
                        <tr>
                          <td style="background-color: #FFFFFF;border-right:1px #ddd solid;">
                            <a href="Javascript:void(0)" onclick="abrir_orden_carga(${manifi},${element.id});" style="font-weight:bold;">[${element.id}]</a>
                            <input type="hidden" name="orden_cargue_id[]" value="${element.id}" class="orden_cargue_id">
                          </td>
                          <td style="background-color: #FFCDD2;border-right:1px #ddd solid;">
                            <a href="Javascript:void(0)" onclick="abrir_remesa(${manifi},${element.Remesa});" style="font-weight:bold;">[${element.Remesa}]</a>
                             <input type="hidden" name="remesa_descargue_id[]" value="${element.Remesa}" class="remesa_descargue_id">
                          </td>
                          <td style="border-right:1px #ddd solid;">0000-00-00 00-00-00</td>
                          <td style="border-right:1px #ddd solid;">${element.peso}Kg</td>
                          <td style="border-right:1px #ddd solid;">Volumen</td>
                          <td style="border-right:1px #ddd solid;">${element.empaque}</td>
                          <td style="border-right:1px #ddd solid;">${element.mer_producto}</td>
                          <td style="border-right:1px #ddd solid;">${element.Cliente}</td>
                          <td style="border-right:1px #ddd solid;">${element.Remitente}</td>
                          <td style="border-right:1px #ddd solid;">${element.Destinatario}</td>
                        </tr>
                      `);
                    }
                  },
                  'json',
                );
              } else {
                $('#tbl_informacion').append(`
                  <tr>
                    <td style="background-color: #FFCDD2;border-right:1px #ddd solid;">
                      <a href="Javascript:void(0)" onclick="abrir_orden_carga(${manifi},${element.id});" style="font-weight:bold;">[${element.id}]</a>
                      <input type="hidden" name="orden_cargue_id[]" value="${element.id}" class="orden_cargue_id">
                    </td>
                    <td style="background-color: #FFCDD2;border-right:1px #ddd solid;">
                      <a href="Javascript:void(0)" onclick="abrir_remesa(${manifi},${element.Remesa});" style="font-weight:bold;">[${element.Remesa}]</a>
                       <input type="hidden" name="remesa_descargue_id[]" value="${element.Remesa}" class="remesa_descargue_id">
                    </td>
                    <td style="border-right:1px #ddd solid;">0000-00-00 00-00-00</td>
                    <td style="border-right:1px #ddd solid;">${element.peso}Kg</td>
                    <td style="border-right:1px #ddd solid;">Volumen</td>
                    <td style="border-right:1px #ddd solid;">${element.empaque}</td>
                    <td style="border-right:1px #ddd solid;">${element.mer_producto}</td>
                    <td style="border-right:1px #ddd solid;">${element.Cliente}</td>
                    <td style="border-right:1px #ddd solid;">${element.Remitente}</td>
                    <td style="border-right:1px #ddd solid;">${element.Destinatario}</td>
                  </tr>
                `);
              }
            },
            'json',
          );
        });
      }
    },
    'json',
  );
}

/* Función para cargar el plan de ruta */
function plan_ruta(codigoPlan, codigoInicio, manifi) {
  var cont = {
    id_plan: codigoPlan,
    codigo_ini: codigoInicio,
    manifiesto: manifi,
  };

  var pcarraylat = [];
  var pcarraylong = [];
  var namepc = [];

  $.ajax({
    url: $('#id_url_ajax').val() + 'planruta/Listar_plan_ruta_seguimiento',
    type: 'POST',
    data: cont,
    dataType: 'json',
    success: function(data) {
      if (data) {
        var t = 0;
        var notas = data.notas_puntos;
        var puntos = data.plan_ruta;

        // Ordenar puntos para que "Lugar Llegada" esté siempre al final
        puntos.sort((a, b) => {
          if (a.nombre_punto === 'Lugar Llegada') return 1;
          if (b.nombre_punto === 'Lugar Llegada') return -1;
          return 0;
        });

        $('#panel_control_plan_ruta').html('');
        puntos.forEach(function(element, index) {
          // Determinar clasificación del punto
          var clasificacion = element.tipo_punto === 'punto control' ? 'punto físico' : 'punto virtual';

          // Agregar fila de punto al panel de control
          $('#panel_control_plan_ruta').append(
            `<tr style='border: 1px solid #ddd;padding: 1px;background-color:#fff;' class='punto_control${element.cod_punto}'>
              <td class='control_punto${element.cod_punto}'>
                <a href='Javascript:void(0);' onclick='formulario_seguimiento();'
                  data-lat="${element.latitud}" data-long="${element.longitud}" data-punto="${element.nombre_punto}"
                  data-id="${element.idmunicipio}" data-cod_punto="${element.cod_punto}"  class="puntos_list">
                  ${element.nombre_punto} (${clasificacion})
                </a>
              </td>
              <td class="fecha_control${element.cod_punto}"></td>
              <td class="novedad_control${element.cod_punto}"></td>
              <td>${element.municipio}-${element.depto}</td>
              <td class="usuario_control${element.cod_punto}"></td>
            </tr>`,
          );

          // Guardar datos de punto en arrays
          pcarraylat[t] = [element.latitud];
          pcarraylong[t] = [element.longitud];
          namepc[t] = [element.nombre_punto];
          t++;

          // Agregar controlador de clic a los enlaces de puntos
          $('.puntos_list').on('click', function(event) {
            event.preventDefault();
            var dataPunto = $(this).data('punto');
            var dataLatitud = $(this).data('lat');
            var dataLongitud = $(this).data('long');
            var dataId = $(this).data('id');
            var dataCodPunto = $(this).data('cod_punto');

            // Guardar datos en localStorage
            localStorage.setItem('puntos', dataPunto);
            localStorage.setItem('latitud', dataLatitud);
            localStorage.setItem('longitud', dataLongitud);
            localStorage.setItem('municipio_id', dataId);
            localStorage.setItem('codigo_punto', dataCodPunto);
          });
        });

        notas_control(notas, puntos);
        // pintar_mapacontrol(latori, latdes, longori, longdes, pcarraylat, pcarraylong, namepc);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function notas_control(notas, puntos) {
  var t = 0;
  var longitud = notas.length;
  var longitud_puntos = puntos.length;
  notas.forEach(element => {
    var clasificacion;
    if (element.tipo_punto == 'punto geografico') {
      clasificacion = 'punto virtual';
    }
    if (element.estado_punto === 'CERRADO') {
      $(`.control_punto${element.cod_punto}`).html(`
            <a href='Javascript:void(0);' style="pointer-events: none;cursor: not-allowed;color: #332D2D;">
                ${element.nombre_punto}(${clasificacion})
            </a>
          `);
      $(`.punto_control${element.cod_punto}`).css('backgroundColor', '#d8dfea');
      $(`.fecha_control${element.cod_punto}`).html(element.Hora_gestion);
      $(`.novedad_control${element.cod_punto}`).html(element.novedad);
      $(`.usuario_control${element.cod_punto}`).html(element.usuario);
    }
  });
}

/* Formulario de seguimientos */
function formulario_seguimiento() {
  fetch($('#id_url_ajax').val() + 'views/templates/formulario_seguimiento.phtml')
    .then(response => response.text())
    .then(data => {
      document.getElementById('contenido-controlador').innerHTML = data;
      $(document).ready(function() {
        gestion();
        // listanovedades();
        $('#notas_controlador').css('display', 'none');
        $('#plan_ruta_lista').css('display', 'none');
        $('#mapa_recorrido').css('display', 'none');
        if ($('#ocurrio option:selected').val() === 'En sitio') {
          $('#nota').css('display', 'none');
          $('#accion').css('display', 'block');

          $('#accion').val(localStorage.getItem('puntos'));
          $('#ubilatitud').val(localStorage.getItem('latitud'));
          $('#ubilongitud').val(localStorage.getItem('longitud'));
          $('#accion_id').val(localStorage.getItem('municipio_id'));
          $('#codigo_punto').val(localStorage.getItem('codigo_punto'));
        }

        $('#ocurrio').change(function() {
          $('#ubilatitud').val('');
          $('#ubilongitud').val('');
          var ocurrio = $('#ocurrio').val();
          if (ocurrio === 'En sitio') {
            $('#nota').css('display', 'none');
            $('#accion').css('display', 'block');
            $('#accion').css('disabled', true);
            $('#accion').val(localStorage.getItem('puntos'));
            $('#ubilatitud').val(localStorage.getItem('latitud'));
            $('#ubilongitud').val(localStorage.getItem('longitud'));
            $('#accion_id').val(localStorage.getItem('municipio_id'));
            $('#codigo_punto').val(localStorage.getItem('codigo_punto'));
          } else {
            $('#nota').css('display', 'block');
            $('#accion').css('display', 'none');
            $('#accion').val('');
            $('#ubilatitud').val('');
            $('#ubilongitud').val('');
            $('#accion_id').val('');
            $('#codigo_punto').val('');

            // Seleccionar el campo de entrada
            var $miInput = $('#nota');
            // Seleccionar el elemento donde mostrar el resultado
            var $resultado = document.getElementById('searchResults');
            var currentFocus = -1; // Índice de la selección actual

            // Agregar un controlador de eventos para el evento input
            $miInput.on('input', function() {
              // Obtener el valor actual del campo de entrada
              var valorInput = $miInput.val();
              // Actualizar el contenido del elemento resultado
              if (valorInput !== '') {
                $.post(
                  $('#id_url_ajax').val() + 'planruta/Buscar_Puntos_Control',
                  {datos: valorInput},
                  function(data) {
                    mostrar_resultados(data);
                  },
                  'json',
                );
              } else {
                $resultado.innerHTML = '';
              }
            });

            function mostrar_resultados(results) {
              // Limpiar resultados anteriores
              $resultado.innerHTML = '';
              currentFocus = -1; // Reiniciar el índice de la selección
              // Mostrar los nuevos resultados
              results.forEach(function(result, index) {
                const li = document.createElement('li');
                li.style.padding = '8px';
                li.style.cursor = 'pointer';
                li.style.transition = 'background-color 0.3s';
                li.textContent = result.nom_punto + ' - ' + result.municipio;
                li.setAttribute('data-index', index); // Asignar un índice al elemento
                li.addEventListener('click', function() {
                  seleccionarElemento(result);
                });
                $resultado.appendChild(li);
              });
            }

            function seleccionarElemento(result) {
              // Colocar el valor en el input al hacer clic en un resultado
              $miInput.val(result.nom_punto + ' - ' + result.municipio);
              $('#ubilatitud').val(result.latitud);
              $('#ubilongitud').val(result.longitud);
              $('#accion_id').val(result.cod_ciudad);
              $('#codigo_punto').val(result.id);
              $resultado.innerHTML = '';
            }

            // Manejar eventos de teclado para la navegación
            $miInput.on('keydown', function(e) {
              var items = $resultado.getElementsByTagName('li');
              if (e.key === 'ArrowDown') {
                // Mover hacia abajo en la lista
                currentFocus++;
                if (currentFocus >= items.length) currentFocus = 0;
                addActive(items);
              } else if (e.key === 'ArrowUp') {
                // Mover hacia arriba en la lista
                currentFocus--;
                if (currentFocus < 0) currentFocus = items.length - 1;
                addActive(items);
              } else if (e.key === 'Enter') {
                // Seleccionar el elemento activo
                e.preventDefault();
                if (currentFocus > -1) {
                  if (items) items[currentFocus].click();
                }
              }
            });

            function addActive(items) {
              if (!items) return false;
              removeActive(items);
              if (currentFocus >= items.length) currentFocus = 0;
              if (currentFocus < 0) currentFocus = items.length - 1;
              items[currentFocus].classList.add('autocomplete-active');
            }

            function removeActive(items) {
              for (var i = 0; i < items.length; i++) {
                items[i].classList.remove('autocomplete-active');
              }
            }

            // Estilo para el elemento activo (opcional)
            var style = document.createElement('style');
            style.innerHTML = `.autocomplete-active {background-color: #f39c12 !important;color: white;}`;
            document.head.appendChild(style);
          }
        });

        /* Buscador de novedades para las notas */
        var $searchInput = $('#novedad');
        var $resultado_novedad = document.getElementById('searchResults2');
        var currentFocus = -1; // Índice de la selección actual

        // Buscar usuario responsable para la actividad
        $searchInput.on('input', function() {
          const searchTerm = $searchInput.val().trim();
          // Realizar una solicitud AJAX para obtener resultados desde el servidor
          if (searchTerm !== '') {
            $.post(
              $('#id_url_ajax').val() + 'trafico/Buscar_novedades',
              {datos: searchTerm},
              function(data) {
                mostrar_resultados_notas(data);
              },
              'json',
            );
          } else {
            $resultado_novedad.innerHTML = '';
          }
        });

        function mostrar_resultados_notas(results) {
          // Limpiar resultados anteriores
          $resultado_novedad.innerHTML = '';
          currentFocus = -1; // Reiniciar el índice de la selección
          // Mostrar los nuevos resultados
          results.forEach(function(result, index) {
            const li = document.createElement('li');
            li.style.padding = '8px';
            li.style.cursor = 'pointer';
            li.style.transition = 'background-color 0.3s';
            li.textContent = result.id + ' - ' + result.novedad;
            li.setAttribute('data-index', index); // Asignar un índice al elemento
            li.addEventListener('click', function() {
              seleccionarElemento(result);
            });
            $resultado_novedad.appendChild(li);
          });
        }

        function seleccionarElemento(result) {
          // Colocar el valor en el input al hacer clic en un resultado
          $searchInput.val(result.novedad);
          $resultado_novedad.innerHTML = '';
        }

        // Manejar eventos de teclado para la navegación
        $searchInput.on('keydown', function(e) {
          var items = $resultado_novedad.getElementsByTagName('li');
          if (e.key === 'ArrowDown') {
            // Mover hacia abajo en la lista
            currentFocus++;
            if (currentFocus >= items.length) currentFocus = 0;
            addActive(items);
          } else if (e.key === 'ArrowUp') {
            // Mover hacia arriba en la lista
            currentFocus--;
            if (currentFocus < 0) currentFocus = items.length - 1;
            addActive(items);
          } else if (e.key === 'Enter') {
            // Seleccionar el elemento activo
            e.preventDefault();
            if (currentFocus > -1) {
              if (items) items[currentFocus].click();
            }
          }
        });

        function addActive(items) {
          if (!items) return false;
          removeActive(items);
          if (currentFocus >= items.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = items.length - 1;
          items[currentFocus].classList.add('autocomplete-active');
        }

        function removeActive(items) {
          for (var i = 0; i < items.length; i++) {
            items[i].classList.remove('autocomplete-active');
          }
        }

        // Estilo para el elemento activo (opcional)
        var style = document.createElement('style');
        style.innerHTML = `.autocomplete-active {background-color: #f39c12 !important;color: white;}`;
        document.head.appendChild(style);

        //Boton para volver a la tabla de notas
        $('#btn-volver-notas').click(function() {
          location.reload();
        });

        $('#btn_guadargestion').click(function() {
          if (window.confirm('¿Esta seguro de guardar la nota para este punto?')) {
            var msg_error = '';
            var ocurrioval = $('#ocurrio').val();
            if (ocurrioval == 'En sitio') {
              if (!msg_error) {
                //validar el estado del proceso
                validar_proceso();
                // alert("hola");
              } else {
                $('#msg_editar_gestion').html(
                  '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
                    msg_error +
                    '</div></div>',
                );
                $('#ver_gestion').animate({scrollTop: 0}, 600);
              }
            } else {
              if (!msg_error) {
                //validar el estado del proceso
                Registrar_Gestion();
              } else {
                $('#msg_editar_gestion').html(
                  '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
                    msg_error +
                    '</div></div>',
                );
                $('#ver_gestion').animate({scrollTop: 0}, 600);
              }
            }
          }
        });

        /* Boton para guardar las notas y el envio del correo al cliente */
        // $("#").click(){

        // }



      });
    })
    .catch(error => console.log(error));
}

function trazabilidad() {
  fetch($('#id_url_ajax').val() + 'views/templates/trazabilidad.phtml')
    .then(response => response.text())
    .then(data => {
      document.getElementById('contenedor').innerHTML = data;
      $(document).ready(function() {
        $('#novedad_estado').html('');
        $('#novedad_seguimiento').html('');
        $('#tiempo_descargue').html('');
        $('#tiempo_cargue').html('');
        var estado = {
          codigo_inicio: codigoInicio,
          mani: manifiesti_codigo,
          action: 'consultar_novedades',
        };
        $.ajax({
          url: url,
          type: 'POST',
          data: estado,
          dataType: 'json',
          success: function(data) {
            if (data.result != null) {
              data.result.forEach(function(element, index) {
                var d;
                var st = element.estado;
                if (st == 2) {
                  d = 'Enturnado';
                }
                if (st == 3) {
                  d = 'Cargue';
                }
                if (st == 4) {
                  d = 'Descargue';
                }
                if (st == 5) {
                  d = 'En ruta';
                }
                if (st == 6) {
                  d = 'Cumplido';
                }
                if (st == 7) {
                  d = 'Entregado';
                }
                if (st == 8) {
                  d = 'Devolución';
                }
                if (st == null) {
                  d = '';
                }

                $('#novedad_estado').append(
                  '<tr>' + '<td>' + d + '</td>' + '<td>' + element.fecha + '-' + element.hora + '</td>' + '<td>' + element.reporte_cliente + '</td>' + '<td>' + element.usuario + '</td>' + '</tr>',
                );
              });
            }

            if (data.result2 != null) {
              data.result2.forEach(function(element, index) {
                var clase;
                if (element.tipo_seguimiento == 'punto geografico') {
                  clase = 'Punto virtual';
                } else {
                  clase = 'Punto físico';
                }

                $('#novedad_seguimiento').append(
                  '<tr>' +
                    '<td>' +
                    clase +
                    '</td>' +
                    '<td>' +
                    element.observacion +
                    '</td>' +
                    '<td>' +
                    element.tipo_contacto +
                    '</td>' +
                    '<td>' +
                    element.reporte_cliente +
                    '</td>' +
                    '<td>' +
                    element.id_servicio +
                    '</td>' +
                    '<td>' +
                    element.usuario +
                    '</td>' +
                    '<td>' +
                    element.fecha +
                    '-' +
                    element.hora +
                    '</td>' +
                    '</tr>',
                );
              });
            } else {
              console.log('Hola Mundo');
            }

            if (data.result3 != null) {
              data.result3.forEach(function(element, index) {
                $('#tiempo_cargue').append(
                  '<tr>' +
                    '<td>' +
                    element.id_orden_cargue +
                    '</td>' +
                    '<td>' +
                    element.tipo_fecha +
                    '</td>' +
                    '<td>' +
                    element.fecha_cargue +
                    '</td>' +
                    '<td>' +
                    element.hora_cargue +
                    '</td>' +
                    '</tr>',
                );
              });
            }

            if (data.result4 != null) {
              data.result4.forEach(function(element, index) {
                $('#tiempo_descargue').append(
                  '<tr>' +
                    '<td>' +
                    element.id_remesa +
                    '</td>' +
                    '<td>' +
                    element.tipo_fecha +
                    '</td>' +
                    '<td>' +
                    element.fecha_descargue +
                    '</td>' +
                    '<td>' +
                    element.hora_descargue +
                    '</td>' +
                    '</tr>',
                );
              });
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('no trajo estados');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
      });
    })
    .catch(error => console.log(error));
}

//novedad mas reciente
function ultimanovedad(codini, id) {
  var maximo = {
    codini: codini,
    action: 'ultima_novedad',
  };
  //$("#ulnovedad"+id).html('');
  $.ajax({
    url: url,
    type: 'POST',
    data: maximo,
    dataType: 'json',
    success: function(data) {
      if (data.result != null) {
        var prisma;
        if (data.result[0].genera_alerta == 'NO') {
          prisma = '#CDCDCD';
        }
        if (data.result[0].genera_alerta == 'SI') {
          prisma = '#009B7D';
        }
        $('#campana' + id).css('background-color', prisma);
        $('#ulnovedad' + id).html('<p style="color:' + prisma + '; text-align:center;"><strong>' + data.result[0].novedad + '</strong></p>');
      } else {
        $('#campana' + id).css('background-color', '#CDCDCD');
        $('#ulnovedad' + id).html('<p style="color:#CDCDCD;"><strong>No existe una novedad aún</strong></p>');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function gestion() {
  $('#noveq').val('');
  $('#observa').val('');
  $('#ubilatitud').val('');
  $('#ubilongitud').val('');
  $('#udocumnento').val('');
  $('.solocargue').hide();
  $('#msg_editar_gestion').html('');

  $('.med').html(med);
  $('.ini').html(codini);
  $('.man').html(manifiesti_codigo);
  $('.pk').html(placa);
  $('.conductor').html(dcondu);
  //consultar el último estado registrado
  var ultimo_estado = {
    id: codini,
    action: 'estado_max',
  };

  $.ajax({
    url: url,
    type: 'POST',
    data: ultimo_estado,
    dataType: 'json',
    success: function(data) {
      console.log('trajo estado maximo');
      if (data.result) {
        // alert('estado');
        $('.subtitu2').html(data.result[0].letra);
        $('#actu').val(data.result[0].estado);
        $('#subtitu3').html(data.result[0].letra);
        $('#actu2').val(data.result[0].estado);
        var estado = data.result[0].estado;
        var estados = {
          actual: estado,
          action: 'estado_select',
        };
        $('#estadoq').html('');
        $.ajax({
          url: url,
          type: 'POST',
          data: estados,
          dataType: 'json',
          success: function(data) {
            if (data.result) {
              data.result.forEach(function(element, index) {
                $('#estadoq').append('<option value="' + element.id + '">' + element.estado + '</option>');
              });
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('no trajo estados');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no trajo estado maximo');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
  //consulta para traer las solicitudes de servicio
  var servi = {
    idplanilla: manifiesto,
    action: 'consultar_solicitudes',
  };
  $('#nservicio').html('');
  $.ajax({
    url: url,
    type: 'POST',
    data: servi,
    dataType: 'json',
    success: function(data) {
      if (data.result != null) {
        var t = 0;
        data.result.forEach(function(element, index) {
          solicitud_servicio[t] = element.mer_idservicio;
          t++;
        });
        console.log(solicitud_servicio);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('No trajo solicitudes de servicio');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
// Trazabilidad
function novedad(element) {
  var elemento = $(element);
  var codini = elemento.data('id');
  var mn = elemento.data('id2');
  var p = elemento.data('id3');
  var con = elemento.data('id4');
  var idplan = elemento.data('id6');
  var med = elemento.data('id7');
  $('#novedad_estado').html('');
  $('#novedad_seguimiento').html('');
  $('#tiempo_descargue').html('');
  $('#tiempo_cargue').html('');
  var estado = {
    codigo_inicio: codini,
    mani: mn,
    action: 'consultar_novedades',
  };
  $.ajax({
    url: url,
    type: 'POST',
    data: estado,
    dataType: 'json',
    success: function(data) {
      if (data.result != null) {
        data.result.forEach(function(element, index) {
          var d;
          var st = element.estado;
          if (st == 2) {
            d = 'Enturnado';
          }
          if (st == 3) {
            d = 'Cargue';
          }
          if (st == 4) {
            d = 'Descargue';
          }
          if (st == 5) {
            d = 'En ruta';
          }
          if (st == 6) {
            d = 'Cumplido';
          }
          if (st == 7) {
            d = 'Entregado';
          }
          if (st == 8) {
            d = 'Devolución';
          }
          if (st == null) {
            d = '';
          }

          $('#novedad_estado').append(
            '<tr>' + '<td>' + d + '</td>' + '<td>' + element.fecha + '-' + element.hora + '</td>' + '<td>' + element.reporte_cliente + '</td>' + '<td>' + element.usuario + '</td>' + '</tr>',
          );
        });
      }

      if (data.result2 != null) {
        data.result2.forEach(function(element, index) {
          var clase;
          if (element.tipo_seguimiento == 'punto geografico') {
            clase = 'Punto virtual';
          } else {
            clase = 'Punto físico';
          }

          $('#novedad_seguimiento').append(
            '<tr>' +
              '<td>' +
              clase +
              '</td>' +
              '<td>' +
              element.observacion +
              '</td>' +
              '<td>' +
              element.tipo_contacto +
              '</td>' +
              '<td>' +
              element.reporte_cliente +
              '</td>' +
              '<td>' +
              element.id_servicio +
              '</td>' +
              '<td>' +
              element.usuario +
              '</td>' +
              '<td>' +
              element.fecha +
              '-' +
              element.hora +
              '</td>' +
              '</tr>',
          );
        });
      }

      if (data.result3 != null) {
        data.result3.forEach(function(element, index) {
          $('#tiempo_cargue').append(
            '<tr>' + '<td>' + element.id_orden_cargue + '</td>' + '<td>' + element.tipo_fecha + '</td>' + '<td>' + element.fecha_cargue + '</td>' + '<td>' + element.hora_cargue + '</td>' + '</tr>',
          );
        });
      }

      if (data.result4 != null) {
        data.result4.forEach(function(element, index) {
          $('#tiempo_descargue').append(
            '<tr>' + '<td>' + element.id_remesa + '</td>' + '<td>' + element.tipo_fecha + '</td>' + '<td>' + element.fecha_descargue + '</td>' + '<td>' + element.hora_descargue + '</td>' + '</tr>',
          );
        });
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no trajo estados');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function Consulta_Seguimiento_Actual(codini) {
  var buscar = {
    codini: codini,
  };
  $.ajax({
    url: $('#id_url_ajax').val() + 'trafico/consulta_seguimiento',
    type: 'POST',
    data: buscar,
    dataType: 'json',
    success: function(data) {
      $('#seguimiento_real').html('');
      if (data != null) {
        data.forEach(function(element, index) {
          var tblBody = '';
          let cadena = element.novedad.substr(0, 7);
          let color = '';
          if (cadena === 'NOVEDAD') {
            color = '#D50000';
          } else {
            color = '#000000';
          }

          // /* Vaidar si es nota del punto del plan de ruta o de otro punto o de punto del controlador */ element.punto_controlador
          var punto = '';

          if (element.municipio === null && element.nom_punto === null && element.nombre_punto === null) {
            punto = element.punto_controlador;
          } else if (element.municipio !== null && element.nom_punto === null && element.nombre_punto !== null) {
            punto = element.nombre_punto;
          } else if (element.municipio !== null && element.nom_punto !== null && element.nombre_punto === null) {
            punto = element.municipio + ' - ' + element.nom_punto;
          }

          tblBody = `
						<tr>
							<td style="padding:5px;">
                <span class="cell-detail-description" style='color:${color}'>
                  ${punto}
                </span>
              </td>
							<td style="padding:5px;">
								<span class="cell-detail-description" style='color:${color}'>${element.fecha} - ${element.hora}</span>
							</td>
							<td style="padding:5px;">
								<span class="cell-detail-description" style='color:${color}'>${element.novedad}</span>
							</td>
							<td style="padding:5px;">
								<span class="cell-detail-description" style='color:${color}'> ${element.observacion}</span>
							</td>
							<td style="padding:5px;">
								<span class="cell-detail-description" style='color:${color}'>${element.usuario}</span>
							</td>
						</tr>`;
          $('#seguimiento_real').append(tblBody);
        });
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no trajo seguimientos');
      // console.log(jqXHR);
      // console.log(textStatus);
      // console.log(errorThrown);
    },
  });
}

function initMap(latori, latdes, lonori, londes, pcarraylat, pcarraylong, namepc, codinin) {
  // alert("hola este es el nevo " + codinin);
  // console.log("pruba de esto" + pcarraylat.length);
  var latori_1 = parseFloat(latori);
  var latdes_1 = parseFloat(latdes);
  var lonori_1 = parseFloat(lonori);
  var londes_1 = parseFloat(londes);
  // var pcarraylat_1 = [pcarraylat, pcarraylong];
  var pcarraylat_1 = pcarraylat;
  var pcarraylong_1 = pcarraylong;
  var namepc_1 = namepc;

  var coord_ori = {lat: latori_1, lng: lonori_1};
  var coord_des = {lat: latdes_1, lng: londes_1};

  let map;

  var coord_pais = {lat: 4.70971, lng: -74.06775};
  var code = {lat: 4.70971, lng: -74.06775};
  var mapc = new google.maps.Map(document.getElementById('mapgeografico'), {
    zoom: 3,
    center: code,
    gestureHandling: 'greedy',
    zoomControl: false,
  });

  // Trafico en la rutas
  var trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(mapc);
  const transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(mapc);

  var marker = new google.maps.Marker({
    position: coord_ori,
    map: mapc,
  });
  marker = new google.maps.Marker({
    position: coord_des,
    map: mapc,
  });

  var objConfigDR = {map: mapc};
  var objConfigDS = {
    origin: coord_ori,
    destination: coord_des,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  //calcular la ruta con los datos satelitales de google
  var ds = new google.maps.DirectionsService();
  var dr = new google.maps.DirectionsRenderer(objConfigDR);
  ds.route(objConfigDS, fnRutear);
  function fnRutear(resultados, status) {
    if (status == 'OK') {
      dr.setDirections(resultados);
    }
  }

  // Datos para dibujar punto actual del seguimiento
  var control = {
    codinin: codinin,
  };
  $.ajax({
    url: $('#id_url_ajax').val() + 'trafico/consulta_puntocontrol',
    // url: url,
    type: 'POST',
    data: control,
    dataType: 'json',
    success: function(data) {
      if (data != null) {
        //mapa
        // var latori = data[0].latitud_origen;
        // var latdes = data[0].latitud_destino;
        // var lonori = data[0].longitud_origen;
        // var londes = data[0].longitud_destino;

        //pintar punto actual
        var st, sm, cordenadas;
        st = parseFloat(data[0].latitud);
        sm = parseFloat(data[0].longitud);
        cordenadas = {lat: st, lng: sm};
        var marketpc = new google.maps.Marker({
          position: cordenadas,
          // icon: "https://img.icons8.com/cotton/30/000000/truck--v1.png",
          icon: $('#id_url_ajax').val() + 'views/layout/assets/img/camion-de-carga.png',
          title: '',
          map: mapc,
        });
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  //Calcular tiempo y distancia
  // Llamada a la API de Geocodificación para obtener las coordenadas de los puntos
  var geocoder = new google.maps.Geocoder();
  // Puntos de inicio y destino
  var latlngori = new google.maps.LatLng(coord_ori);
  var latlngdes = new google.maps.LatLng(coord_des);
  geocoder.geocode({latLng: latlngori}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var latitudInicio = results[0].geometry.location.lat();
      var longitudInicio = results[0].geometry.location.lng();

      geocoder.geocode({latLng: latlngdes}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var latitudDestino = results[0].geometry.location.lat();
          var longitudDestino = results[0].geometry.location.lng();

          // Llamada a la API de Direcciones para obtener la distancia y el tiempo de viaje
          var service = new google.maps.DistanceMatrixService();
          service.getDistanceMatrix(
            {
              origins: [{lat: latitudInicio, lng: longitudInicio}],
              destinations: [{lat: latitudDestino, lng: longitudDestino}],
              travelMode: google.maps.TravelMode.DRIVING,
              unitSystem: google.maps.UnitSystem.METRIC,
            },
            function(response, status) {
              if (status == google.maps.DistanceMatrixStatus.OK) {
                var distancia = response.rows[0].elements[0].distance.text;
                var tiempo = response.rows[0].elements[0].duration.text;
                $('.distancia_estimada').html(distancia);
                $('.tiempo_estimado').html(tiempo);
              }
            },
          );
        }
      });
    }
  });

  //punto control
  var cordenadas;
  var st, sm;
  var x;

  // Verificar si la variable 'array' está definida y tiene un valor
  if (typeof pcarraylat_1 !== 'undefined' && pcarraylat_1 !== null && typeof pcarraylong_1 !== 'undefined' && pcarraylong_1 !== null) {
    // Acceder a la propiedad 'length' solo si 'array' es válido
    var length = pcarraylat_1.length;
    var lengthlong = pcarraylong_1.length;
    // Realizar otras operaciones con la longitud
    for (var a = 0; a <= length; a++) {
      st = parseFloat(pcarraylat_1[a]);
      sm = parseFloat(pcarraylong_1[a]);
      nom = namepc_1[a];
      cordenadas = {lat: st, lng: sm};

      const contentString =
        '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h4 id="firstHeading" class="firstHeading">' +
        placa +
        '</h4>' +
        '<div id="bodyContent">' +
        '<p>' +
        nom +
        '</p>' +
        '<p>LAT/LONG:<b>' +
        cordenadas.lat +
        '-' +
        cordenadas.lng +
        '</b></p>' +
        '</div>' +
        '</div>';
      const infowindow = new google.maps.InfoWindow({
        content: contentString,
        // maxWidth: 300,
        ariaLabel: 'Uluru',
      });

      var marker = new google.maps.Marker({
        position: cordenadas,
        map: mapc,
        title: 'Uluru (Ayers Rock)',
      });

      marker.addListener('click', () => {
        infowindow.open({
          anchor: marker,
          map: mapc,
        });
      });
    }
  } else {
    // console.log("No es  array" + length);
    // Manejar el caso cuando 'array' es undefined o null
  }
}
//INSERT
function validar_proceso() {
  //VALIDAR EL SEGUIMIENTO
  // var a = $("#ini").val(); //cod_iniruta
  var a = codini; //cod_iniruta
  // var estad = $("#actu").val(); //estado actual
  var segui = 'punto geografico'; //tipo seguimiento
  var deta = $('#accion_id').val(); //detalle
  var proce = $('#proceso').val(); //proceso
  if (segui !== 'novedad general') {
    var fun = {
      cod_iniruta: a,
      // estado: estad,
      segui: segui,
      detalle: deta,
      proce: proce,
      action: 'validar_tipoproceso',
    };
    $.ajax({
      url: url,
      type: 'POST',
      data: fun,
      dataType: 'json',
      success: function(data) {
        if (data.result != false) {
          data.result.forEach(function(element, index) {
            if (element.tipo_proceso == 'completado') {
              alert('Este seguimiento ya tiene un estado de completado, no puede realizar más seguimientos sobre el mismo');
            } else {
              Registrar_Gestion();
            }
          });
        } else {
          Registrar_Gestion();
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } else {
    Registrar_Gestion();
  }
}

function Registrar_Gestion() {
  // Obtener todos los inputs ocultos con las clases orden_cargue_id y remesa_descargue_id
  const ordenCargueInputs = document.querySelectorAll('input.orden_cargue_id');
  const remesaDescargueInputs = document.querySelectorAll('input.remesa_descargue_id');

  // Inicializar arrays para almacenar los valores
  const ordenCargueArray = [];
  const remesaDescargueArray = [];

  // Recorrer los inputs y almacenar los valores en los arrays
  ordenCargueInputs.forEach(input => {
    ordenCargueArray.push(input.value);
  });

  remesaDescargueInputs.forEach(input => {
    remesaDescargueArray.push(input.value);
  });

  var data = {
    accion: 'crear_gestion',
    accion_completado: $('#procesoq').val(),
    estado_siguiente: $('#estadoq').val(),
    reporte_cliente: $('#reporte').val(),
    observacion: $('#observa').val(),
    nota_punto_controlador: $('#nota').val(),
    solicitud_servicio_nuevo: solicitud_servicio,
    contacto: 'Llamada telefonica',
    tipo_seguimiento: 'punto geografico',
    tipo_detalle: $('#accion_id').val(),
    novedad_general: $('#novedad').val(),
    ocurrio: $('#ocurrio').val(),
    latitud: $('#ubilatitud').val(),
    longitud: $('#ubilongitud').val(),
    documento_evidencia: '',
    // estado_actual: $("#actu").val(),
    id_ini_ruta: codini,
    idmanifiesto: mani,
    tipo_proceso: $('#proceso').val(),
    documento_evidencia: '',
    edocu: '',
    codigo_punto: $('#codigo_punto').val(),
    accion_punto: $('#accion').val(),
    manifiesto: manifiesti_codigo,
    orden_cargue_id: ordenCargueArray,
    remesa_descargue_id: remesaDescargueArray,
  };

  $.ajax({
    url: url2,
    type: 'POST',
    data: JSON.stringify(data),
    cache: false,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    dataType: 'json',
    success: function(data, textStatus, jqXHR) {
      if (data.success === true) {
        // alert(data.message);
        Swal.fire({
          title: 'Exito',
          html: data.message,
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: `¿Quieres realizar otra nota a este manifiesto ${manifiesti_codigo}?`,
          cancelButtonText: 'No, Regresar al tablero',
          customClass: {
            popup: 'swal2-custom-font',
          },
        }).then(result => {
          if (result.isConfirmed) {
            location.reload(true);
          } else {
            $('.hcontenedor').empty();
            var manifi = $('#man').val();
            Tarjeta_Seguimiento(manifi); //bloques
            $('#ver_gestion').modal('hide');
            window.location = $('#id_url_ajax').val() + 'control_ruta/seguir_ruta/?idmenu=5';
          }
        });
      } else {
        Swal.fire({
          // position: 'top-end',
          position: 'center',
          icon: 'warning',
          title: 'Advertencia',
          html: data.message,
          showConfirmButton: true,
          // timer: 1500,
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no guardo seguimiento');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function Registrar_Gestionestado() {
  var data = null;
  data = new FormData();
  data.append('accion', 'crear_gestionestado');
  var gestion = $('#select_gestion').val();
  if (gestion == 1) {
    data.append('id_ini_ruta', $('#ini').val());
    data.append('estadoq', $('#estadoq').val());
    data.append('procesoq', $('#procesoq').val());
    data.append('noveq', $('#noveq').val());
    data.append('reportecliente', $('#reportee').val());
    data.append('gestion', 1);
  }
  $.ajax({
    url: url2,
    type: 'POST',
    data: data,
    cache: false,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    dataType: 'json',
    success: function(data, textStatus, jqXHR) {
      //location.reload();
      $('.hcontenedor').empty();
      var manifi = $('#man').val();
      Tarjeta_Seguimiento(manifi); //bloques
      $('#ver_gestion').modal('hide');
      alert('Ok!!Datos Registrado Exitosamente!!');
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('no guardo seguimiento');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function abrir_orden_carga(manifi, orden) {
  // URL de la página que deseas abrir en la nueva ventana
  var url = $('#id_url_ajax').val() + `tiempo_logistico_cargue/crear_cargue/?manifiesto=${manifi}&orden_cargue=${orden}`;
  // Opciones de la ventana emergente (ancho, alto, opciones adicionales)
  var ventanaAncho = 1000;
  var ventanaAlto = 700;
  // Calcula las coordenadas para centrar la ventana
  var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
  var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
  // Opciones de la ventana emergente (ancho, alto, posición)
  var opcionesVentana = 'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
  // Utiliza window.open para abrir la nueva ventana
  window.open(url, name, opcionesVentana);
}

function abrir_remesa(manifi, remesa) {
  /* Validar si la orden de cargue ya esta diligenciada */

  $.post(
    $('#id_url_ajax').val() + 'tiempo_logistico_cargue/validar_order_cargue',
    'manifiesto=' + manifi,
    function(data) {
      if (data) {
        // URL de la página que deseas abrir en la nueva ventana
        var url = $('#id_url_ajax').val() + `tiempo_logistico_descargue/crear_descargue/?manifiesto=${manifi}&remesa=${remesa}`;
        // Opciones de la ventana emergente (ancho, alto, opciones adicionales)
        var ventanaAncho = 1000;
        var ventanaAlto = 700;
        // Calcula las coordenadas para centrar la ventana
        var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
        var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
        // Opciones de la ventana emergente (ancho, alto, posición)
        var opcionesVentana = 'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
        // Utiliza window.open para abrir la nueva ventana
        window.open(url, name, opcionesVentana);
      } else {
        var mensaje = 'Para llenar los <b>tiempos de descargue</b> debe llenar los <b>tiempos de cargue</b> del manifiesto ' + manifi;
        Swal.fire({
          // position: 'top-end',
          position: 'center',
          icon: 'warning',
          title: 'Advertencia',
          html: mensaje,
          showConfirmButton: true,
          // timer: 1500,
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      }
    },
    'json',
  );

  // var url = $('#id_url_ajax').val() + `tiempo_logistico_descargue/validar_order_cargue`;
  // let data = new FormData();
  // data.append('manifiesto', manifi);
  // $.ajax({
  //   url: url,
  //   type: 'POST',
  //   data: data,
  //   cache: false,
  //   processData: false, // Don't process the files
  //   contentType: false, // Set content type to false as jQuery will tell the server its a query string request
  //   dataType: 'json',
  //   success: function(data, textStatus, jqXHR) {

  //   },
  //   error: function(jqXHR, textStatus, errorThrown) {
  //     var mensaje = 'Para llenar los tiempos de descargue de';
  //     Swal.fire({
  //       // position: 'top-end',
  //       position: 'center',
  //       icon: 'warning',
  //       title: 'Advertencia',
  //       text: mensaje,
  //       showConfirmButton: true,
  //       // timer: 1500,
  //     });
  //   },
  // });
}
