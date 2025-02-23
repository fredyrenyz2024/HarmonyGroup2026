// Define un array para almacenar los elementos seleccionados
const elementosSeleccionados = [];
const elementosEdicion = [];
$(document).ready(function () {
  // alert('ksfhksh');
  $('#div_rp').hide();
  $('.divpanterior').hide();
  $('#anadirpunto').hide();

  if ($('#r_id').val() === '') {
    $('#btn_guadarplan').hide();
  } else {
    $('#btn_guadarplan').show();
  }

  //cargar select de la tabla principal
  cargarorigen();

  //agregar planes
  $('#agregar_fila_prueba').click(function () {
    pruebab();
  });

  $('#agregar_fila').click(function () {
    agregar_plan();
  });

  //agregar mas puntos
  $('#agregar_punto').click(function () {
    $('#anadirpunto').show();
    agregar_punto();
  });

  //registrar mas puntos
  $('#anadirpunto').click(function () {
    var msg_error = '';
    var i;
    for (i = 1; i <= contador_global2; i++) {
      if (typeof $('#sy' + i).val() !== 'undefined') {
        if (!$('#p_ciudadm' + i + '').val()) {
          msg_error += '<p>Debe seleccionar el campo <strong>ubicación ' + i + '</strong> para poder crear el punto.</p>';
          AplicaFoco('#p_ciudadm' + i + '');
        } else {
          RemueveFoco('#p_ciudadm' + i + '');
        }
        if (!$('#p_puntom' + i + '').val()) {
          msg_error += '<p>Debe seleccionar el campo <strong>Nombre punto ' + i + '</strong> para poder crear el punto.</p>';
          AplicaFoco('#p_puntom' + i + '');
        } else {
          RemueveFoco('#p_puntom' + i + '');
        }
        if (!$('#p_tiempom' + i + '').val()) {
          msg_error += '<p>Debe seleccionar el campo <strong>Tiempo estimado ' + i + '</strong> para poder crear el punto.</p>';
          AplicaFoco('#p_tiempom' + i + '');
        } else {
          RemueveFoco('#p_tiempom' + i + '');
        }
        if (!$('#p_descrim' + i + '').val()) {
          msg_error += '<p>Debe seleccionar el campo <strong>Descripción ' + i + '</strong> para poder crear el punto.</p>';
          AplicaFoco('#p_descrim' + i + '');
        } else {
          RemueveFoco('#p_descrim' + i + '');
        }
        if (!$('#km' + i + '')) {
          msg_error += '<p>Debe seleccionar el campo <strong>Kilométros ' + i + '</strong> para poder crear el punto.</p>';
          AplicaFoco('#km' + i + '');
        } else {
          RemueveFoco('#km' + i + '');
        }
        if (!$('#p_tp' + i + '').val()) {
          msg_error += '<p>Debe seleccionar el campo <strong>Tipo punto ' + i + '</strong> para poder crear el punto.</p>';
          AplicaFoco('#p_tp' + i + '');
        } else {
          RemueveFoco('#p_tp' + i + '');
        }
        if (!$('#p_latitud' + i + '').val()) {
          msg_error += '<p>Debe seleccionar el campo <strong>Latitud ' + i + '</strong> para poder crear el punto.</p>';
          AplicaFoco('#p_latitud' + i + '');
        } else {
          RemueveFoco('#p_latitud' + i + '');
        }
        if (!$('#p_longitud' + i + '').val()) {
          msg_error += '<p>Debe seleccionar el campo <strong>Longitud ' + i + '</strong> para poder crear el punto.</p>';
          AplicaFoco('#p_longitud' + i + '');
        } else {
          RemueveFoco('#p_longitud' + i + '');
        }
      }
    }
    if (!msg_error) {
      anadir_punto();
    } else {
      $('#msg_edicion_ac').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          '</div></div>',
      );
      $('#upda_puntos').animate({scrollTop: 0}, 600);
    }
  });

  // Asocia un evento de clic al botón
  $('#agregarBoton').on('click', function () {
    // Muestra los elementos seleccionados en un div
    $('#resultado').text('Elementos seleccionados: ' + elementosSeleccionados.join(', '));
  });
});

var url2 = $('#id_url_ajax').val() + 'libs/trafico2_ajax.php';
var url = $('#id_url_ajax').val() + 'libs/trafico_ajax.php';
function verVehiculo(element) {
  $('#btn_guadarplan').show();
  // alert('elegir');
  var elemento = $(element);
  var id = elemento.data('id'); //ruta
  var origen = elemento.data('id2');
  var destino = elemento.data('id3');
  var observa = elemento.data('id4');
  var origen_l = elemento.data('id5');
  var destino_l = elemento.data('id6');
  var munic = elemento.data('id11');
  var ruta_completa = origen_l + '/' + destino_l;
  //parametros para el mapa de ruta
  var latori = elemento.data('id7');
  var latdes = elemento.data('id8');
  var longori = elemento.data('id9');
  var longdes = elemento.data('id10');
  var tiempotot = elemento.data('id12');
  var kmtot = elemento.data('id13');

  if (latori != '' && latdes != '' && longori != '' && longdes != '') {
    pintar_maparuta(latori, latdes, longori, longdes);
  }
  $('#p_planname').val(munic);
  $('#punto_solito').html(origen_l);
  $('#div_rp').show();
  $('#r_id').val(id);
  $('#r_origen').val(origen);
  $('#r_destino').val(destino);
  $('#r_obser').val(observa);
  $('#rutacompl').html(ruta_completa);
  $('#timeruta').val(tiempotot);
  $('#kilometerruta').val(kmtot);

  //punto de llegada
  $('#p_ciudadfinal').html('<option value="' + destino + '">' + destino_l + '</option>');
  $('#latitudfinal').val(latdes);
  $('#longitudfinal').val(longdes);

  $('#exampleModalLong').modal('hide');
}

function pintar_maparuta(latori, latdes, lonori, londes) {
  var latori_1 = parseFloat(latori);
  var latdes_1 = parseFloat(latdes);
  var lonori_1 = parseFloat(lonori);
  var londes_1 = parseFloat(londes);

  var coord_ori = {lat: latori_1, lng: lonori_1};
  var coord_des = {lat: latdes_1, lng: londes_1};

  var coord_pais = {lat: 8.5709, lng: -74.2973}; //colombia
  var map1 = new google.maps.Map(document.getElementById('mapruta'), {
    zoom: 6,
    center: coord_pais,
    mapTypeId: 'hybrid',
  });

  var marker = new google.maps.Marker({
    position: coord_ori,
    map: map1,
  });

  marker = new google.maps.Marker({
    position: coord_des,
    map: map1,
  });

  var objConfigDR = {map: map1};
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
}

var cotu = 0;
var globalu = 0;
function pruebab() {
  cotu++;
  globalu = contador_global1 + 1;
  $('.menutab').append('<li><a href="#hello' + cotu + '" data-toggle="tab">hello</a></li>');
  $('.contenidoTab').append('<div id="hello' + cotu + '" class="tab-pane active cont">dgdgfgf' + cotu + '</div>');
}

var cont = 0;
var contador_global1 = 0;
function agregar_plan() {
  cont++;
  contador_global1 = contador_global1 + 1;
  var c = contador_global1; //valor máximo
  //consultar municipios
  // var ciudad_base = {
  //   action: "consulta_base",
  // };
  $.ajax({
    // url: url,
    url: $('#id_url_ajax').val() + 'planruta/Consutal_Base_Crear',
    type: 'POST',
    // data: ciudad_base,
    dataType: 'json',
    success: function (data) {
      if (data) {
        data.forEach(function (element, index) {
          $('#base' + cont + '').append('<option value="' + element.id + '">' + element.municipio + ' - ' + element.depto + '</option>');
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no consulto ciudades');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  var name_campo = 'punto';
  var puntos_parametricos = `
	<select id='punto${cont}' class='form-control input-xs' onchange='punto_parametro(this.value,${cont})' style="font-size:90%;">
    <option value="" readonly="readonly">Seleccione</option>
  </select>`;

  var ciudad_base = `<select id='base${cont}' class='form-control input-xs' onchange='ciudad_de_base(this.value,${cont})'>
		<option value="" readonly="readonly">Seleccione</option>
	</select>`;

  var city = `
	<select id='p_ciudad${cont}' class='form-control input-xs'>
		<option value="" readonly="readonly">Seleccione</option>
	</select>`;

  var orden = `<input type='number' id='orden${cont}' class='form-control input-xs' style='font-size:90%;' value='${c}' readonly='readonly'>`;

  var planes = `

			<tr style="text-align:left; color:white; background-color:#332D2D;">
				<th>Ciudad ${cont}</th>
				<th>Puntos paramétricos ${cont}</th>
			</tr>

			<td>${ciudad_base}</td>
			<td>${puntos_parametricos}</td>
			
			<tr style="text-align:left; color:white; background-color:#332D2D;">
				<th>Nombre Punto</th>
				<th>Ubicación</th>
				<th>Tiempo Estimado (minutos)</th>
			</tr>

			<td><input type="text" id="p_punto${cont}" class="form-control input-xs" style="font-size:90%;"></td>
			<td>${city}</td>
			<td><input type="number" id="p_tiempo${cont}" class="form-control input-xs" placeholder="Respecto al punto anterior (min)" title="En minutos" style="font-size:90%;"></td>
			

			<tr style="text-align:left; color:white; background-color:#332D2D;">
				<th>Descripción</th>
				<th>Km estimados <span class="cell-detail-description"> desde el punto anterior</span></th>
				<th>Orden</th>
			</tr>

			
				<td>
					<textarea id="p_descri${cont}" class="form-control input-xs" rows="1" style="font-size:90%;"></textarea>
				</td>
    		<td>
    			<input type="number" id="p_km${cont}" class="form-control input-xs" placeholder="Km estimados desde el punto anterior" style="font-size:90%;">
				</td>
    		<td>${orden}</td>
			

			<tr style="text-align:left; color:white; background-color:#332D2D;">
				<th>Tipo punto</th>
				<th>Latitud</th>
				<th>Longitud</th>
			</tr>

			
				<td>
					<select id="tp${cont}" class="form-control input-xs" style="font-size:90%;">
						<option value="">Seleccione</option>
						<option value="punto geografico">Punto virtual</option>
					</select>
				</td>
				<td> <input type="number" id="latitud${cont}" class="form-control input-xs" style="font-size:90%;"></td>
				<td> <input type="number" id="longitud${cont}" class="form-control input-xs" style="font-size:90%;"></td>
`;

  // $("#tabla_plan").append(planes);
  $('#punto_plan_crear').append(planes);
  var sumfinal = contador_global1 + 1;
  $('#ordenfinal').val(sumfinal);
}

function ciudad_de_base(valor, conteo) {
  //consultar puntos
  var punto = {
    id_ciudad: valor,
    action: 'consulta_puntos',
  };
  $('#punto' + conteo + '').html('<option value="">Seleccione</option>');
  $.ajax({
    url: url,
    type: 'POST',
    data: punto,
    dataType: 'json',
    success: function (data) {
      if (data) {
        data.result.forEach(function (element, index) {
          $('#punto' + conteo + '').append(
            '<option value="' + element.id + '">' + element.municipio + '-' + element.depto + ' | ' + element.nom_punto + '</option>',
          );
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no trajo punto');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function ciudad_de_base2(valor, conteo) {
  //consultar puntos
  var punto = {
    id_ciudad: valor,
    action: 'consulta_puntos',
  };
  $('#punto_v' + conteo + '').html('<option value="">Seleccione</option>');
  $.ajax({
    url: url,
    type: 'POST',
    data: punto,
    dataType: 'json',
    success: function (data) {
      if (data) {
        data.result.forEach(function (element, index) {
          $('#punto_v' + conteo + '').append(
            '<option value="' + element.id + '">' + element.municipio + '-' + element.depto + ' | ' + element.nom_punto + '</option>',
          );
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no trajo punto');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function punto_parametro(valor, id) {
  var datos = {
    id_punto: valor,
    action: 'consultar_punto_para',
  };
  $.ajax({
    url: url,
    type: 'POST',
    data: datos,
    dataType: 'json',
    success: function (data) {
      if (data) {
        $('#p_punto' + id).val(data.result[0].nom_punto);
        $('#p_descri' + id).val(data.result[0].descripcion_punto);
        $('#latitud' + id).val(data.result[0].latitud);
        $('#longitud' + id).val(data.result[0].longitud);
        $('#p_ciudad' + id).html(
          '<option value="' + data.result[0].id_muni + '">' + data.result[0].municipio + ' ' + data.result[0].depto + '</option>',
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no trajo punto');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function punto_parametroe(valor, id) {
  var datos = {
    id_punto: valor,
    // action: "consultar_punto_para",
  };
  $.ajax({
    // url: url,
    url: $('#id_url_ajax').val() + 'planruta/Consultar_punto_para',
    type: 'POST',
    data: datos,
    dataType: 'json',
    success: function (data) {
      // alert(data);
      if (data) {
        $('#p_puntom' + id).val(data.nom_punto);
        $('#p_descrim' + id).val(data.descripcion_punto);
        $('#p_latitud' + id).val(data.latitud);
        $('#p_longitud' + id).val(data.longitud);
        $('#p_ciudadm' + id).html('<option value="' + data.id_muni + '">' + data.municipio + ' ' + data.depto + '</option>');
      }
      // if (data.result) {
      //   $("#p_puntom" + id).val(data.result[0].nom_punto);
      //   $("#p_descrim" + id).val(data.result[0].descripcion_punto);
      //   $("#p_latitud" + id).val(data.result[0].latitud);
      //   $("#p_longitud" + id).val(data.result[0].longitud);
      //   $("#p_ciudadm" + id).html(
      //     '<option value="' + data.result[0].id_muni + '">' + data.result[0].municipio + " " + data.result[0].depto + "</option>",
      //   );
      // }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no trajo punto');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//validaciones del plan
$('#btn_guadarplan').click(function () {
  if (window.confirm('¿Esta seguro de crear los punto para la ruta?')) {
    //validar que los campos tengan información
    var msg_error = '';
    if (!$('#p_planname').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Nombre del plan </strong> para poder crear el Detalle de Ruta.</p>';
      AplicaFoco('#p_planname');
    } else {
      RemueveFoco('#p_planname');
    }
    if (!$('#p_planob').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>detalle del plan</strong> para poder crear el Detalle de Ruta.</p>';
      AplicaFoco('#p_planob');
    } else {
      RemueveFoco('#p_planob');
    }
    if (!$('#r_id').val()) {
      msg_error += '<p>Debe diligenciar el campo <strong>Código de ruta</strong> recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
      AplicaFoco('#r_id');
    } else {
      RemueveFoco('#r_id');
    }
    if (!$('#p_puntofinal').val()) {
      msg_error +=
        '<p>Debe diligenciar el campo <strong>Nombre Punto</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
      AplicaFoco('#p_puntofinal');
    } else {
      RemueveFoco('#p_puntofinal');
    }
    if (!$('#p_tiempofinal').val()) {
      msg_error +=
        '<p>Debe diligenciar el campo <strong>Tiempo Estimado (minutos)</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
      AplicaFoco('#p_tiempofinal');
    } else {
      RemueveFoco('#p_tiempofinal');
    }
    if (!$('#p_ciudadfinal').val()) {
      msg_error +=
        '<p>Debe diligenciar el campo <strong>Ubicación</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
      AplicaFoco('#p_ciudadfinal');
    } else {
      RemueveFoco('#p_ciudadfinal');
    }
    if (!$('#p_descrifinal').val()) {
      msg_error +=
        '<p>Debe diligenciar el campo <strong>Descripción</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
      AplicaFoco('#p_descrifinal');
    } else {
      RemueveFoco('#p_descrifinal');
    }
    if (!$('#p_kmfinal').val()) {
      msg_error +=
        '<p>Debe diligenciar el campo <strong>Km estimados</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
      AplicaFoco('#p_kmfinal');
    } else {
      RemueveFoco('#p_kmfinal');
    }
    if (!$('#ordenfinal').val()) {
      msg_error +=
        '<p>Debe diligenciar el campo <strong>Orden</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
      AplicaFoco('#ordenfinal');
    } else {
      RemueveFoco('#ordenfinal');
    }
    if (!$('#tpfinal').val()) {
      msg_error +=
        '<p>Debe diligenciar el campo <strong>Tipo punto</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
      AplicaFoco('#tpfinal');
    } else {
      RemueveFoco('#tpfinal');
    }
    if (!$('#latitudfinal').val()) {
      msg_error +=
        '<p>Debe diligenciar el campo <strong>Latitud</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
      AplicaFoco('#latitudfinal');
    } else {
      RemueveFoco('#latitudfinal');
    }
    if (!$('#longitudfinal').val()) {
      msg_error +=
        '<p>Debe diligenciar el campo <strong>Longitud</strong> en Punto paramétrico final recuerda elegir una ruta, para poder crear el Detalle de Ruta.</p>';
      AplicaFoco('#longitudfinal');
    } else {
      RemueveFoco('#longitudfinal');
    }
    var i;
    for (i = 1; i <= contador_global1; i++) {
      if (!$('#p_punto' + i + '').val()) {
        msg_error += '<p>Debe diligenciar el campo <strong>Nombre punto ' + i + '</strong> para poder crear el Detalle de Ruta.</p>';
        AplicaFoco('#p_punto' + i + '');
      } else {
        RemueveFoco('#p_punto' + i + '');
      }
      if (!$('#p_ciudad' + i + '').val()) {
        msg_error += '<p>Debe diligenciar el campo <strong>Ubicación ' + i + '</strong> para poder crear el Detalle de Ruta.</p>';
        AplicaFoco('#p_ciudad' + i + '');
      } else {
        RemueveFoco('#p_ciudad' + i + '');
      }
      if (!$('#p_tiempo' + i + '').val()) {
        msg_error += '<p>Debe diligenciar el campo <strong>Tiempo ' + i + '</strong> para poder crear el Detalle de Ruta.</p>';
        AplicaFoco('#p_tiempo' + i + '');
      } else {
        RemueveFoco('#p_tiempo' + i + '');
      }
      if (!$('#p_km' + i + '').val()) {
        msg_error +=
          '<p>Debe diligenciar el campo <strong>Km estimados desde el punto anterior ' + i + '</strong> para poder crear el Plan de Ruta.</p>';
        AplicaFoco('#p_km' + i + '');
      } else {
        RemueveFoco('#p_km' + i + '');
      }
      if (!$('#p_descri' + i + '').val()) {
        msg_error += '<p>Debe diligenciar el campo <strong>Descripción ' + i + '</strong> para poder crear el Detalle de Ruta.</p>';
        AplicaFoco('#p_descri' + i + '');
      } else {
        RemueveFoco('#p_descri' + i + '');
      }
      if (!$('#tp' + i + '').val()) {
        msg_error += '<p>Debe diligenciar el campo <strong>Tipo punto ' + i + '</strong> para poder crear el Detalle de Ruta.</p>';
        AplicaFoco('#tp' + i + '');
      } else {
        RemueveFoco('#tp' + i + '');
      }
      if (!$('#latitud' + i + '').val()) {
        msg_error += '<p>Debe diligenciar el campo <strong>Latitud ' + i + '</strong> para poder crear el Detalle de Ruta.</p>';
        AplicaFoco('#latitud' + i + '');
      } else {
        RemueveFoco('#latitud' + i + '');
      }
      if (!$('#longitud' + i + '').val()) {
        msg_error += '<p>Debe diligenciar el campo <strong>Longitud ' + i + '</strong> para poder crear el Detalle de Ruta.</p>';
        AplicaFoco('#longitud' + i + '');
      } else {
        RemueveFoco('#longitud' + i + '');
      }

      /* Se desabilita este punto de validacion por solicitud de area de seguridad y trafico */
      //validar tiempo
      // var tiempo_valida = $("#p_tiempo" + i + "").val();
      // var suma = 0;
      // if (typeof $("#p_tiempo" + i).val() !== "undefined" && $("#p_tiempo" + i).val() !== "") {
      //   var tf = $("#p_tiempofinal").val();
      //   suma = parseFloat(suma) + parseFloat(tiempo_valida) + parseFloat(tf);
      // }
      // if (suma > $("#timeruta").val()) {
      //   msg_error +=
      //     "<p>La sumatoria de los campos denominados como <strong>total de los Tiempo Estimado (minutos) </strong> supera el <strong>Tiempo total de la ruta </strong></p>";
      // }

      // //validar kilometros
      // var kilome_valida = $("#p_km" + i + "").val();
      // var sumk = 0;
      // if (typeof $("#p_km" + i).val() !== "undefined" && $("#p_km" + i).val() !== "") {
      //   var kmf = $("#p_kmfinal").val();
      //   sumk = parseFloat(sumk) + parseFloat(kilome_valida) + parseFloat(kmf);
      // }
      // if (sumk > $("#kilometerruta").val()) {
      //   msg_error +=
      //     "<p>La sumatoria de los campos denominados como <strong> Km estimados desde el punto anterior </strong> supera el <strong>Kilométro total de la ruta</strong></p>";
      // }
    }
    if (!msg_error) {
      //crear_plan();
      consecutivo_plan();
    } else {
      $('#msg_crear').html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          '</div></div>',
      );
      $('#crear_plan').animate({scrollTop: 0}, 600);
    }
  } else {
    console.log('Operacion Cancelada');
  }
});

function consecutivo_plan() {
  var maestro_detalle = {
    action: 'maestro_detalle_ruta',
  };
  $.ajax({
    url: url,
    type: 'POST',
    data: maestro_detalle,
    dataType: 'json',
    success: function (data) {
      if (data.result != null) {
        data.result.forEach(function (element, index) {
          consecutivo = element.numero_actual;
          crear_plan(consecutivo);
        });
      } else {
        alert('null');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no consulto maestro');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

async function crear_plan(id) {
  if (window.confirm('¿Estás seguro de que deseas guardar el plan de ruta?')) {
    // Código a ejecutar si el usuario hace clic en "Aceptar"
    var data = null;
    data = new FormData();
    // data.append("accion", 'crear_plan');
    data.append('id_ruta', $('#r_id').val());
    data.append('cod_plan', id);
    data.append('name_plan', $('#p_planname').val());
    data.append('detallep', $('#p_planob').val());
    data.append('fplan', $('#p_fechac').val());
    data.append('hplan', $('#p_horac').val());
    data.append('uplan', $('#p_userc').val());
    data.append('cab', $('#cab').val());
    data.append('fin', 9);
    data.append('cab', $('#cab').val());
    data.append('fin', 9);
    //se construye el objeto que almacena los datos
    let element = {
      punto: [],
      city: [],
      // datos: [],
      tiempo: [],
      orden: [],
      descri: [],
      tpunto: [],
      latitud: [],
      longitud: [],
      kilometro: [],
    };
    var i = 0;
    for (i = 1; i <= contador_global1; i++) {
      var punto = $('#p_punto' + i + '').val();
      var city = $('#p_ciudad' + i + '').val();
      var tiempo = $('#p_tiempo' + i + '').val();
      var orden = $('#orden' + i + '').val();
      var descri = $('#p_descri' + i + '').val();
      var tpunto = $('#tp' + i + '').val();
      var latitud = $('#latitud' + i + '').val();
      var longitud = $('#longitud' + i + '').val();
      var kilometro = $('#p_km' + i + '').val();

      element.punto.push(punto);
      element.city.push(city);
      // elementato.datos.push(datos);
      element.tiempo.push(tiempo);
      element.orden.push(orden);
      element.descri.push(descri);
      element.tpunto.push(tpunto);
      element.latitud.push(latitud);
      element.longitud.push(longitud);
      element.kilometro.push(kilometro);
    }

    // Nuevo Array completo
    var nota = element;
    nota = JSON.stringify(nota);
    data.append('notas', nota);
    // var contador_final = contador_global1 + 1;
    // if ($("#ordenfinal").val() == contador_final) {}
    data.append('puntofinal', $('#p_puntofinal').val());
    data.append('tiempofinal', $('#p_tiempofinal').val());
    data.append('descripfinal', $('#p_descrifinal').val());
    data.append('kmfinal', $('#p_kmfinal').val());
    data.append('ordenfinal', $('#ordenfinal').val());
    data.append('tpfinal', $('#tpfinal').val());
    data.append('latitudfinal', $('#latitudfinal').val());
    data.append('longifinal', $('#longitudfinal').val());
    data.append('ubicacion', $('#p_ciudadfinal').val());
    data.append('cab', $('#cab').val(5));
    data.append('punto', $('#puntos').val(5));
    data.append('fin', 3);

    await fetch($('#id_url_ajax').val() + 'planruta/Crear_Plan', {
      method: 'POST',
      body: data,
      cache: 'no-cache',
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(function (response) {
        if (response) {
          alert(response);
        }
        location.reload();
      })
      .catch((error) => {
        alert(error);
      });
  } else {
    // Código a ejecutar si el usuario hace clic en "Cancelar"
    console.log('Acción confirmada.');
  }
}

//agregar mas puntos
var cont2 = 0;
var contador_global2 = 0;
var punto = 0;

function agregar_punto() {
  cont2++;
  contador_global2 = contador_global2 + 1;
  var c = contador_global2; //valor máximo
  var planid = $('#plan_id').val();

  var ultima_posicion;
  //consultar puntos virtuales
  var ciudad_base = {
    // action: 'consulta_base',
    plan_id: planid,
  };
  $.ajax({
    // url: url,
    url: $('#id_url_ajax').val() + 'planruta/Consulta_base',
    type: 'POST',
    data: ciudad_base,
    dataType: 'json',
    success: function (data) {
      var name_campo = 'punto_v';
      // variabvle fija
      var posicion_fija = data.numero;
      var punto_parametro = `<select id='punto_v${posicion_fija}' class='form-control input-xs trp${posicion_fija}' name="punto_v[]" onchange='punto_parametroe(this.value,${posicion_fija})'>
				<option value="" readonly="readonly">Seleccione</option>
			</select>`;

      var ciudad_base = `<select id='base${posicion_fija}' class='form-control input-xs' name="base[]" onchange='ciudad_de_base2(this.value,${posicion_fija})'>
			  <option value="" readonly="readonly">Seleccione</option>
			</select>`;

      var city = `<select id='p_ciudadm${posicion_fija}' class='form-control input-xs trp${posicion_fija}' name="p_ciudadm[]">
				<option value="" readonly="readonly">Seleccione</option>
			</select>`;

      if (cont2 === 1) {
        punto = posicion_fija;
        var orden = `<input type='number' id='orderm${posicion_fija}' name="orderm[]" class='form-control input-xs trp${posicion_fija}' style='font-size:90%;' value='${posicion_fija}'readonly='readonly'>`;

        var ch = `<input type="button" id="r${posicion_fija}" class="btn btn-danger btn-xs borrar6 trp${posicion_fija}" value="Eliminar" onclick="EliminarPunto(${posicion_fija})">
				<input type="hidden" class="identi tr${posicion_fija}" value="1"> <input type="hidden" id="sy${posicion_fija}" value="1">`;
        var planes = `
				<tr class="trp${posicion_fija}" data-pos="${posicion_fija}">

					<tr class="trp${posicion_fija}" style="text-align:center; color:white; background-color:#332D2D;">
						<td class="trp${posicion_fija}">Ciudad ${posicion_fija} ${ciudad_base}</td>
						<td class="trp${posicion_fija}">Punto Paramétrico ${posicion_fija} ${punto_parametro}</td>
					</tr>

					<tr class="trp${posicion_fija}" style="text-align:center; color:white; background-color:#332D2D;">
						<th class="texr-center">Nombre Punto</th>
						<th>Ubicación</th>
						<th>Tiempo Estimado (min)</th>
					</tr>
          
					<td class="trp${posicion_fija}">
						<input type="text" id="p_puntom${posicion_fija}" name="p_puntom[]" class="form-control input-xs trp${posicion_fija}" style="font-size:90%;">
					</td>

					<td class="trp${posicion_fija}">${city}</td>
					<td class="trp${posicion_fija}">
						<input type="number" id="p_tiempom${posicion_fija}" name="p_tiempom[]" class="form-control input-xs trp${posicion_fija}" placeholder="Respecto al punto anterior" title="En minutos" style="font-size:90%;">
					</td>
					
					<tr class="trp${posicion_fija}" style="text-align:left; color:white; background-color:#332D2D;">
						<th class="trp${posicion_fija}">Descripción</th>
						<th class="trp${posicion_fija}">Kilométros desde el punto anterior</th>
						<th class="trp${posicion_fija}">Orden</th>
					</tr>

					<tr class="trp${posicion_fija}">
						<td>
							<textarea id="p_descrim${posicion_fija}" name="p_descrim[]" class="form-control input-xs trp${posicion_fija}" rows="1" style="font-size:90%;"></textarea>
						</td>
						<td class="trp${posicion_fija}">
							<input type="number" id="km${posicion_fija}" name="km[]" class="form-control input-xs trp${posicion_fija}" style="font-size:90%;">
						</td>
						<td class="trp${posicion_fija}">${orden}</td>
					</tr>

					<tr class="trp${posicion_fija}"style="text-align:left; color:white; background-color:#332D2D;">
						<th class="trp${posicion_fija}">Tipo punto</th>
						<th class="trp${posicion_fija}">Latitud</th>
						<th class="trp${posicion_fija}">Longitud</th>
					</tr>

					<tr class="trp${posicion_fija}">
						<td class="trp${posicion_fija}">
							<select id="p_tp${posicion_fija}" name="p_tp[]" class="form-control input-xs trp${posicion_fija}" style="font-size:90%;">
								<option value="">Seleccione</option><option value="punto geografico">Punto virtual</option>
							</select>
						</td>
						<td class="trp${posicion_fija}"> 
							<input type="number" id="p_latitud${posicion_fija}" name="p_latitud[]" class="form-control input-xs trp${posicion_fija}" style="font-size:90%;">
						</td>
						<td class="trp${posicion_fija}">
							<input type="number" id="p_longitud${posicion_fija}" name="p_longitud[]" class="form-control input-xs trp${posicion_fija}" style="font-size:90%;">
						</td>
					</tr>
          
					<tr class="trp${posicion_fija}">
						<td class="trp${posicion_fija} text-right" colspan="3" style="padding-top:10px;">${ch}</td>
					</tr>
				</tr>`;
        $('#punto_plan').append(planes);
        if (data.resultado_base) {
          data.resultado_base.forEach(function (element, index) {
            $('#base' + posicion_fija + '').append('<option value="' + element.id + '">' + element.municipio + ' - ' + element.depto + '</option>');
          });
        }
      } else {
        punto++;
        punto_parametro = `<select id='punto_v${punto}' name="punto_v[]" class='form-control input-xs trp${punto}' onchange='punto_parametroe(this.value,${punto})'>
							<option value="" readonly="readonly">Seleccione</option>
					</select>`;

        city = `<select id='p_ciudadm${punto}' name="p_ciudadm[]" class='form-control input-xs trp${punto}'>
								<option value="" readonly="readonly">Seleccione</option>
							</select>`;

        ciudad_base = `<select id='base${punto}' name="base[]" class='form-control input-xs' onchange='ciudad_de_base2(this.value,${punto})'>
				 								<option value="" readonly="readonly">Seleccione</option>
											</select>`;

        var orden = `<input type='number' id='orderm${punto}' name="orderm[]" class='form-control input-xs trp${punto}' style='font-size:90%;' value='${punto}' readonly='readonly'>`;

        var ch = `<input type="button" id="r${punto}" class="btn btn-danger btn-xs borrar6 trp${punto}" value="Eliminar" onclick="EliminarPunto(${punto})">
				<input type="hidden" class="identi tr${punto}" value="1"> <input type="hidden" id="sy${punto}" value="1">`;
        var planes = `
				<tr class="trp${punto}" data-pos="${punto}">

					<tr class="trp${punto}" style="text-align:center; color:white; background-color:#332D2D;">
						<td class="trp${punto}">Ciudad ${punto} ${ciudad_base}</td>
						<td class="trp${punto}">Punto Paramétrico ${punto} ${punto_parametro} </td>
					</tr>

					<tr class="trp${punto}" style="text-align:center; color:white; background-color:#332D2D;">
						<th class="texr-center">Nombre Punto</th>
						<th>Ubicación</th>
						<th>Tiempo Estimado (min)</th>
					</tr>
					<td class="trp${punto}">
						<input type="text" id="p_puntom${punto}" name="p_puntom[]" class="form-control input-xs trp${punto}" style="font-size:90%;">
					</td>

					<td class="trp${punto}">${city}</td>

					<td class="trp${punto}">
						<input type="number" id="p_tiempom${punto}" name="p_tiempom[]" class="form-control input-xs trp${punto}" placeholder="Respecto al punto anterior" title="En minutos" style="font-size:90%;">
					</td>
					
					<tr class="trp${punto}" style="text-align:left; color:white; background-color:#332D2D;">
						<th class="trp${punto}">Descripción</th>
						<th class="trp${punto}">Kilométros desde el punto anterior</th>
						<th class="trp${punto}">Orden</th>
					</tr>

					<tr class="trp${punto}">
						<td>
							<textarea id="p_descrim${punto}" name="p_descrim[]" class="form-control input-xs trp${punto}" rows="1" style="font-size:90%;"></textarea>
						</td>
						<td class="trp${punto}">
							<input type="number" id="km${punto}" name="km[]" class="form-control input-xs trp${punto}" style="font-size:90%;">
						</td>
						<td class="trp${punto}">${orden}</td>
					</tr>
					<tr class="trp${punto}"style="text-align:left; color:white; background-color:#332D2D;">
						<th class="trp${punto}">Tipo punto</th>
						<th class="trp${punto}">Latitud</th>
						<th class="trp${punto}">Longitud</th>
					</tr>
					<tr class="trp${punto}">
						<td class="trp${punto}">
							<select id="p_tp${punto}" name="p_tp[]" class="form-control input-xs trp${punto}" style="font-size:90%;">
								<option value="">Seleccione</option><option value="punto geografico">Punto virtual</option>
							</select>
						</td>
						<td class="trp${punto}"> 
							<input type="number" id="p_latitud${punto}" name="p_latitud[]" class="form-control input-xs trp${punto}" style="font-size:90%;">
						</td>
						<td class="trp${punto}">
							<input type="number" id="p_longitud${punto}" name="p_longitud[]" class="form-control input-xs trp${punto}" style="font-size:90%;">
						</td>
					</tr>
					<tr class="trp${punto}">
						<td class="trp${punto} text-right" name="trp[]" colspan="3" style="padding-top:10px;">${ch}</td>
					</tr>
				</tr>`;
        $('#punto_plan').append(planes);
        if (data.resultado_base) {
          data.resultado_base.forEach(function (element, index) {
            $('#base' + punto + '').append('<option value="' + element.id + '">' + element.municipio + ' - ' + element.depto + '</option>');
          });
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no consulto ciudades');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//Eliminar la agregacion de mas puntos al plan
function EliminarPunto(id) {
  if (window.confirm('¿Estás seguro de que deseas eliminar este punto? ' + 'Punto a eliminar ' + id)) {
    // Código a ejecutar si el usuario hace clic en "Aceptar"
    event.preventDefault();
    $('.trp' + id).remove();
    // Actualiza las posiciones de las filas restantes
    $('#tbl_puntos .trp' + id).each(function (index) {
      $(this).attr('data-pos', index + 1);
      $(this)
        .find('td:first')
        .text(index + 1);
    });
    $(this).closest('tr').remove();
  } else {
    // Código a ejecutar si el usuario hace clic en "Cancelar"
    console.log('Acción confirmada.');
  }
}

//cargar select de la tabla filtros
function cargarorigen() {
  // alert('cargar punto');
  // $("#Punto").select2({
  //   width: "100%",
  // });
  // var punto = {
  //   action: "consultar_punto",
  // };

  $.ajax({
    // url: url,
    url: $('#id_url_ajax').val() + 'planruta/Consultar_Punto',
    type: 'POST',
    // data: punto,
    dataType: 'json',
    success: function (data) {
      data.forEach(function (element, index) {
        $('#Punto').append('<option value="' + element.cod_ciudad_origen + '">' + element.municipio + '-' + element.depto + '</option>');
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no trajo punto');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//validar el cambio del select origen tabla-filtros
$('#Punto').change(function () {
  var origen = $('#Punto').val();
  // $("#Destino").select2({
  //   width: "100%",
  // });
  $('#Destino').html('');
  var puntob = {
    origen: origen,
    // action: "consultar_punto2",
  };
  $.ajax({
    // url: url,
    url: $('#id_url_ajax').val() + 'planruta/Consultar_Punto_destino',
    type: 'POST',
    data: puntob,
    dataType: 'json',
    success: function (data) {
      console.log('trajo puntos');
      data.forEach(function (element, index) {
        $('#Destino').append('<option value="' + element.cod_ciudad_destino + '">' + element.municipio + '-' + element.depto + '</option>');
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no trajo punto');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
});

//tabla filtros
function delete_pc(idtb, id) {
  if (window.confirm('¿Esta seguro que desea eleiminar el punto del plan de ruta?')) {
    var bo = {
      idtb: idtb,
      // action: "borrar_puntocontrols",
    };
    $.ajax({
      // url: url,
      url: $('#id_url_ajax').val() + 'planruta/Borrar_puntocontrol',
      type: 'POST',
      data: bo,
      dataType: 'json',
      success: function (data) {
        if (data.numero == 200) {
          mensaje = `
          <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-check"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> ${data.mensaje}
              </div>
          </div>`;
          Listado_puntos();
        } else {
          mensaje = `
          <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-info-outline"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> ${data.mensaje}
              </div>
          </div>`;
        }
        document.getElementById('historicos').innerHTML = mensaje;
        // event.preventDefault();
        // $(".tra" + id).remove();
        // $(this).closest("tr").remove();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('no borro punto control');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } else {
    // Código a ejecutar si el usuario hace clic en "Cancelar"
    // console.log("Acción confirmada.");
    alert('Operacón Cancelada');
  }
}

function delete_pg(idtb, id) {
  var bo = {
    idtb: idtb,
    action: 'borrar_puntogeografico',
  };
  $.ajax({
    url: url,
    type: 'POST',
    data: bo,
    dataType: 'json',
    success: function (data) {
      event.preventDefault();
      $('.trb' + id).remove();
      $(this).closest('tr').remove();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no borro punto geografico');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function solicitudes_rutas() {
  // alert('consultar');
  var ori = $('#Punto').val();
  var des = $('#Destino').val();
  if (ori == '' || des == '') {
    alert('Por favor complete todos los campos');
  } else {
    // var url = $("#id_url_ajax").val() + "libs/trafico_ajax.php";
    var consulta = {
      origen_ruta: ori,
      destino_ruta: des,
      // action: "filtro_planes",
    };

    $('#body_esconder').html('');
    $.ajax({
      // url: url,
      url: $('#id_url_ajax').val() + 'planruta/Filtro_PLanes',
      type: 'POST',
      data: consulta,
      dataType: 'json',
      success: function (data) {
        console.log('trajo ruta y plan');
        cuente = 0;
        cont = 0;
        if (data != null) {
          // alert('si hay plan');
          data.forEach(function (element, index) {
            cuente++;
            cont++;
            var btn_ver = '';
            var btn_editar = '';
            var mas_puntos = '';
            var menos_puntos = '';
            //variables d eos botones
            var idruta = element.idruta;
            var idplan = element.cod_plan;
            var origen = element.cod_ciudad_origen;
            var destino = element.cod_ciudad_destino;
            var origenletra = element.o;
            var destinoletra = element.d;
            var estado_plan = element.estado;
            var col_status = '';
            //parametros de ruta
            var latori = element.latitud_origen;
            var latdes = element.latitud_destino;
            var lonori = element.longitud_origen;
            var londes = element.longitud_destino;

            var nomplan = element.nombre_plan + ' ' + element.observacion;
            var tiempo = element.tiempo_tot_ruta;
            var km = element.km_tot_ruta;
            var estado = element.estado;

            //botones
            btn_ver = `<button type="button" class="btn btn-primary btn btn-xs" title="Consultar Plan" id="btnver${cont}" data-toggle="modal" data-target="#ver_puntos"  data-id="${idruta}" 
						data-id2="${idplan}" data-id3="${origenletra}" data-id4="${destinoletra}" data-id5="${latori}"  data-id6="${latdes}" data-id7="${lonori}" data-id8="${londes}" data-id9="${nomplan}" 
						data-id10="${tiempo}" data-id11="${km}" data-id12="${estado}"><i class="far fa-eye"></i></button>`;

            btn_editar = `<button type="button" class="btn btn-warning btn-xs" title="Editar Plan" id="btneditar${cont}"data-toggle="modal" data-target="#upda_puntos"  
						data-id="${idruta}" data-id2="${idplan}" data-id3="${origen}" data-id4="${destino}" data-id5="${estado_plan}"><i class="fas fa-pencil-alt"></i></button>`;

            if (element.estado == 'Activo') {
              col_status =
                '<td class="text-success">' +
                '<center>' +
                '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Habilitada" ></span>' +
                '</center>' +
                '</td>';
              mas_puntos =
                '<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-pin" title="Agregar mas puntos de control" id="btnmas' +
                cont +
                '"   data-toggle="modal" data-target="#mas_puntos"  data-id="' +
                idruta +
                '" data-id2="' +
                idplan +
                '" data-id3="' +
                origen +
                '" data-id4="' +
                destino +
                '"></button>';
            }
            if (element.estado == 'Inactivo') {
              col_status =
                '<td class="text-danger">' +
                '<center>' +
                '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Habilitada" ></span>' +
                '</center>' +
                '</td>';
              mas_puntos =
                '<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-pin" title="Agregar mas puntos de control" id="btnmas' +
                cont +
                '" data-toggle="tooltip" data-placement="bottom" title="No puede agregar mas puntos ya que el plan esta Inactivo"></button>';
            }

            or = element.o;
            ds = element.d;

            $('#body_esconder').append(
              '<tr>' +
                col_status +
                '<td>' +
                element.idruta +
                '/' +
                element.cod_plan +
                ' ' +
                element.nombre_plan +
                ' ' +
                element.observacion +
                '</td>' +
                '<td>' +
                or +
                '</td>' +
                '<td>' +
                ds +
                '</td>' +
                '<td>' +
                element.estado +
                '</td>' +
                '<td>' +
                '<div class="btn-group" role="group" aria-label="...">' +
                btn_ver +
                btn_editar +
                '</div>' +
                '</td>' +
                '</tr>',
            );

            $('#btnver' + cont + '').click(function () {
              // alert('hello');
              // var urlu = $("#id_url_ajax").val() + "libs/trafico_ajax.php";
              var idruta = $(this).attr('data-id');
              var idplan = $(this).attr('data-id2');
              var origen = $(this).attr('data-id3');
              var destino = $(this).attr('data-id4');
              //parametros de la ruta
              var latori = $(this).attr('data-id5');
              var latdes = $(this).attr('data-id6');
              var longori = $(this).attr('data-id7');
              var longdes = $(this).attr('data-id8');

              var nompla = $(this).attr('data-id9');
              var km = $(this).attr('data-id11');
              var time = $(this).attr('data-id10');
              var estado = $(this).attr('data-id12');

              $('#codigo_r').val(idruta);
              $('#codigo_p').val(idplan);
              $('#nombre_p').val(nompla);
              $('#kilop').val(km);
              $('#tiempo_p').val(time);
              $('#estado_p').val(estado);

              var planes = {
                idplan: idplan,
                // action: "puntos_deruta",
              };
              $('#body_puntos').html('');
              $('#body_puntosg').html('');
              var pcarraylat = new Array();
              var pcarraylong = new Array();
              var namepc = new Array();
              var pgarraylat = new Array();
              var pgarraylong = new Array();
              var namepg = new Array();

              $.ajax({
                // url: urlu,
                url: $('#id_url_ajax').val() + 'planruta/Ver_puntos_de_ruta',
                type: 'POST',
                data: planes,
                dataType: 'json',
                success: function (data) {
                  if (data != null) {
                    var g = 0;
                    data.forEach(function (element, index) {
                      $('#body_puntos').append(
                        `<tr>
													<td> ${element.municipio}-${element.depto}</td>
													<td> ${element.nombre_punto}</td>
													<td> ${element.tiempo_estimacion}</td>
													<td> ${element.descripcion_punto}</td>
													<td> ${element.km_estimacion}</td>
													<td> ${element.latitud}</td>
													<td> ${element.longitud}</td>												
												</tr>`,
                      );
                      pcarraylat[g] = [element.latitud];
                      pcarraylong[g] = [element.longitud];
                      namepc[g] = [element.nombre_punto];
                      g++;
                    });
                  }

                  if (data != null) {
                    var d = 0;
                    data.forEach(function (element, index) {
                      $('#body_puntosg').append(
                        `<tr>
													<td>${element.posicion}</td>
													<td>${element.municipio}-${element.depto} <span class="cell-detail-description">${element.nombre_punto}</span></td>
													<td>${element.tiempo_estimacion}</td>
													<td>${element.descripcion_punto}</td>
													<td>${element.km_estimacion}</td>
													<td>${element.latitud}</td>
													<td>${element.longitud}</td>
													<td>${element.usuario}</td>																				
												</tr>`,
                      );
                      pgarraylat[d] = [element.latitud];
                      pgarraylong[d] = [element.longitud];
                      namepg[d] = [element.nombre_punto];
                      d++;
                    });
                  }
                  pintar_mapaplan(
                    latori,
                    latdes,
                    longori,
                    longdes,
                    pcarraylat,
                    pcarraylong,
                    pgarraylat,
                    pgarraylong,
                    namepc,
                    namepg,
                    origen,
                    destino,
                  );
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  console.log('no trajo los planes');
                  console.log(jqXHR);
                  console.log(textStatus);
                  console.log(errorThrown);
                },
              });
            }); //cierre del ver
            //boton editar
            $('#es_e').html('');
            $('#btneditar' + cont + '').click(function () {
              // alert('editar');
              var urlu = $('#id_url_ajax').val() + 'libs/trafico_ajax.php';
              var idruta = $(this).attr('data-id');
              var idplan = $(this).attr('data-id2');
              var origen = $(this).attr('data-id3');
              var destino = $(this).attr('data-id4');
              var estado = $(this).attr('data-id5');
              $('#codigo_e').val(idruta);
              $('#plan_e').val(idplan);
              $('#codigo_rm').val(idruta);
              $('#codigo_pm').val(idplan);
              if (estado == 'Activo') {
                $('#es_e').append('<option value="1">Si</option><option value="0">No</option>');
              }
              if (estado == 'Inactivo') {
                $('#es_e').append('<option value="0">No</option><option value="1">Si</option>');
              }
              $('#plan_id').val(idplan);
              var planes = {
                idplan: idplan,
                // action: 'puntos_derutae'
              };
              $('#body_puntose').html('');
              $('#body_puntoseg').html('');
              $.ajax({
                // url: urlu,
                url: $('#id_url_ajax').val() + 'planruta/puntos_de_ruta',
                type: 'POST',
                data: planes,
                dataType: 'json',
                success: function (data) {
                  if (data != null) {
                    var c = 0;
                    var name;
                    var select = $('<select class="posiciones_list" disabled><option value="0">0</option></select>');
                    var btn_edit = $(
                      `<span class="input-group-btn"><button type="button" class="text-warning btn-xs btn_edit_puntos" style="border:none; background-color: transparent;margin-left:-10px;" data-toggle="tooltip" data-placement="top" title="Editar Posición" data-id="${element.cod_punto}" data-id1="${element.posicion}"><i class="fas fa-pencil-alt"></i></button></span>`,
                    );
                    var btn_update_punto = $(`
												<div class="btn-group">
													<span class="input-group-btn">
														<button type="button" class="text-success btn-xs btn_update_puntos" style="border:none; background-color: transparent;margin-left:-10px;display:none;" data-toggle="tooltip" data-placement="top" title="Guardar Posición"><i class="fas fa-check"></i></button>
														<button type="button" class="text-danger btn-xs btn_cancelar_operacion" style="border:none; background-color: transparent;margin-left:-10px;display:none;" data-toggle="tooltip" data-placement="top" title="Cancelar Operación"><i class="fas fa-times"></i></button>
													</span>
												</div>
											`);

                    data.forEach(function (element, index) {
                      c++;
                      $('#namep_e').val(element.nombre_plan);
                      $('#deta_pe').val(element.observacion);

                      if (element.tipo_punto == 'punto geografico') {
                        name = 'Punto virtual';
                      }
                      if (element.tipo_punto == 'punto control') {
                        name = 'Punto físico';
                      }

                      // Crea un elemento <select>
                      select.append(
                        $('<option>', {
                          // value: element.cod_punto,
                          value: element.posicion,
                          text: element.posicion,
                        }),
                      );

                      $('#body_puntose').append(
                        `<tr class="tra${c}">
													<td  style="font-size:10px;padding:1px 1px 1px;" class="tra${c}"><div class="input-group selects"></div></td>
													<td style="font-size:10px;" id="tra${element.posicion}">${element.posicion}
														<input type="hidden" name="posicion" class="posicion" id="${element.posicion}" value="${element.cod_punto}">
													</td>
													<td style="font-size:10px;" class="tra${c}">${name}</td>
													<td style="font-size:10px;" class="tra${c}">${element.municipio}</td>
													<td  style="font-size:10px;" class="tra${c}"><a class="text-danger tra${c}" id="p${c}" title="Eliminar punto" onclick="delete_pc(${element.cod_punto}, ${c})" href="Javascript:void(0);"> ${element.nombre_punto}</a></td>
													<td style="font-size:10px;" class="tra${c} text-center">${element.tiempo_estimacion}
														<input type="text" name="tiempos" id="tiempo${element.cod_punto}" class="tiempo_nuevo text-center" value="${element.tiempo_estimacion}" style="display:none;width:90px;">
													</td>
													<td  style="font-size:10px;" class="tra${c}">${element.descripcion_punto}</td>
													<td  style="font-size:10px;" class="tra${c}">${element.km_estimacion} km</td>
													<td  style="font-size:10px;" class="tra${c}">${element.latitud}</td>
													<td  style="font-size:10px;" class="tra${c}">${element.longitud}</td>
												</tr>`,
                      );
                      //<td  style="font-size:10px;width: 5px;" class="tra${c}">${btn}</td>
                      select.attr('id', 'sle' + element.cod_punto);
                    });
                    // select.attr("onchange", "posicion(this.value)");
                    btn_edit.attr('onclick', 'edit(this)');
                    $('.selects').append(select);
                    $('.selects').append(btn_edit);
                    $('.selects').append(btn_update_punto);
                  }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  console.log('no trajo los planes');
                  console.log(jqXHR);
                  console.log(textStatus);
                  console.log(errorThrown);
                },
              });
            }); //cierre del editar
            $('#btnmas' + cont + '').click(function () {
              // alert('agregar punto');
              var urlu = $('#id_url_ajax').val() + 'libs/trafico_ajax.php';
              var idruta = $(this).attr('data-id');
              var idplan = $(this).attr('data-id2');
              var origen = $(this).attr('data-id3');
              var destino = $(this).attr('data-id4');
              $('#codigo_pm').val(idplan);
              $('#codigo_rm').val(idruta);
            });
          });
        }
        if (data == null) {
          alert('La ruta seleccionada no esta asociada a ningún plan');
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('no trajo ruta y plan');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }
}

// Variable de control para rastrear si la validación se cumple
var validacionCumplida = false;
var validacionCumplidaTiempo = false;
$('#guardarPunT').click(function () {
  // Crear un array para almacenar los valores seleccionados
  if (window.confirm('¿Estás seguro de actualizar los puntos del plan?')) {
    // Código a ejecutar si el usuario hace clic en "Aceptar"
    var element = {
      posiciones: [],
      cod_puntos: [],
      tiempos: [],
    };
    data = new FormData();
    $('.posicion').each(function () {
      element.cod_puntos.push($(this).val());
    });

    $('.posiciones_list').each(function () {
      if ($('option:selected', this).val() === '0') {
        // if ($(this).val() === 0) {
        validacionCumplida = true; // Establecer la variable de control en verdadero
        return false; // Salir del ciclo each
      } else {
        element.posiciones.push($('option:selected', this).text());
      }
    });

    $('.tiempo_nuevo').each(function () {
      if ($(this).val() === 0) {
        validacionCumplidaTiempo = true; // Establecer la variable de control en verdadero
        return false; // Salir del ciclo each
      } else {
        element.tiempos.push($(this).val());
      }
    });

    // Nuevo Array completo
    var punto = element;
    punto = JSON.stringify(punto);
    data.append('puntos', punto);
    data.append('cod_plan', $('#plan_id').val());
    console.log(data);
    // Mostrar el resultado fuera del ciclo
    if (validacionCumplida) {
      alert('Debe diligenciar todos los puntos para poder realziar la operación');
    } else {
      if (validacionCumplidaTiempo) {
        alert('Debe diligenciar todos los tiempos nuevos');
      } else {
        $.ajax({
          // url: url2,
          url: $('#id_url_ajax').val() + 'planruta/Actualizar_puntos',
          type: 'POST',
          data: data,
          cache: false,
          processData: false, // Don't process the files
          contentType: false, // Set content type to false as jQuery will tell the server its a query string request
          dataType: 'json',
          success: function (data, textStatus, jqXHR) {
            if (data) {
              alert(data);
              Listado_puntos();
            } else {
              alert('error');
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log('no guardo punto');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
      }
    }
  } else {
    // Código a ejecutar si el usuario hace clic en "Cancelar"
    console.log('Acción confirmada.');
  }
});

function posicion(valor) {
  elementosSeleccionados.push(valor);
  var selects = $('.posiciones_list');
  // Obtén el elemento select
  if ($.inArray(valor, elementosSeleccionados) === 1) {
    // Recorre las opciones del select
    selects.find('option').each(function () {
      var opcion = $(this);
      // var valorOpcion = opcion.val();
      opcion.prop('disabled', false);
    });
    // elementosSeleccionados.remove(valor);
    // alert("ya esta");
  } else {
    // Si ya existe, muestra un mensaje de error o realiza alguna otra acción
    // Recorre las opciones del select
    selects.find('option').each(function () {
      var opcion = $(this);
      var valorOpcion = opcion.val();
      // Verifica si el valor de la opción está en el array de valores deshabilitados
      if ($.inArray(valorOpcion, elementosSeleccionados) !== -1) {
        // Si el valor está en el array, deshabilita la opción
        opcion.prop('disabled', true);
        // opcion.css("background-color", "red");
      } else {
        opcion.prop('disabled', false);
      }
    });
  }
}

function edit(boton) {
  // Encuentra el 'select' en la misma fila que el botón clicado
  var selects = $(boton).closest('tr').find('.posiciones_list');
  var boton_edit = $(boton).closest('tr').find('.btn_edit_puntos');
  var boton_update = $(boton).closest('tr').find('.btn_update_puntos');
  var boton_cancel = $(boton).closest('tr').find('.btn_cancelar_operacion');
  var input = $(boton).closest('tr').find('.posicion');
  var tiempo_nuevo = $(boton).closest('tr').find('.tiempo_nuevo');

  // Habilita el select
  selects.prop('disabled', false);
  selects.val($(input).attr('id'));
  tiempo_nuevo.val();
  elementosEdicion.push($(input).attr('id'));
  selects.attr('onchange', 'posicion(this.value)');

  // $(boton_update).css("display", "block");
  $(boton_cancel).css('display', 'block');
  $(boton_edit).css('display', 'none');

  $(boton_cancel).click(function () {
    // Código que se ejecutará cuando se haga clic en el botón
    // $(boton_update).css("display", "none");
    $(tiempo_nuevo).css('display', 'none');
    $(boton_cancel).css('display', 'none');
    $(boton_edit).css('display', 'block');
    selects.prop('disabled', true);
    selects.val(0);
  });

  var valoranterior = selects.val();
  $(selects).change(function () {
    var nuevoValor = $(this).val();
    if (nuevoValor !== valoranterior) {
      $(tiempo_nuevo).css('display', 'block');
    } else {
      alert('valor');
    }
  });
}

//botones de actualizar
$('#btn_editarplan').click(function () {
  if (window.confirm('¿Esta seguro de cambiar el estado del detalle de ruta?')) {
    // alert('actualizar');
    var esp = $('#es_e').val();
    if (esp == '1') {
      var estado = 'Activo';
    }
    if (esp == '0') {
      var estado = 'Inactivo';
    }
    var data = null;
    data = new FormData();
    // data.append("accion", "update_plan");
    data.append('id_plan', $('#plan_e').val());
    data.append('namplan', $('#namep_e').val());
    data.append('detaplan', $('#deta_pe').val());
    data.append('es_plan', estado);
    $.ajax({
      // url: url2,
      url: $('#id_url_ajax').val() + 'planruta/Update_Plan',
      type: 'POST',
      data: data,
      cache: false,
      processData: false, // Don't process the files
      contentType: false, // Set content type to false as jQuery will tell the server its a query string request
      dataType: 'json',
      success: function (data, textStatus, jqXHR) {
        if (data.numero === 200) {
          $('#msg_edicion_ac').html(`<div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><span class="mdi mdi-check"></span></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
						<strong>Mensaje!</strong> ${data.mensaje}
					</div>
				</div>`);
          location.reload();
        } else {
          // alert(data.mensaje);
          $('#msg_edicion_ac').html(`<div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><span class="mdi mdi-check"></span></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
						<strong>Mensaje!</strong> ${data.mensaje}
					</div>
				</div>`);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('no guardo plan');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } else {
    console.log('Operacion cancelada');
  }
});

//añadir mas puntos al plan
function anadir_punto() {
  if (window.confirm('¿Estás seguro de que deseas agregar los puntos al plan de ruta?')) {
    var f = 0;
    var data = null;
    data = new FormData();
    let element = {
      codigo_ruta: [],
      id_plan: [],
      ciudad: [],
      nombrepunto: [],
      tiempo: [],
      decri: [],
      orden: [],
      tipopunto: [],
      lati: [],
      long: [],
      kilome: [],
    };

    if ($('#sy').val() !== 'undefined') {
      var codigo_ruta = $('#codigo_rm').val();
      var id_plan = $('#codigo_pm').val();

      var p_ciudadm = document.getElementsByName('p_ciudadm[]');
      for (var i = 0; i < p_ciudadm.length; i++) {
        var ciudad = p_ciudadm[i].value;
        element.ciudad[i] = ciudad;
        element.codigo_ruta.push(codigo_ruta);
        element.id_plan.push(id_plan);
      }
      var p_puntom = document.getElementsByName('p_puntom[]');
      for (var a = 0; a < p_puntom.length; a++) {
        var nombrepunto = p_puntom[a].value;
        element.nombrepunto[a] = nombrepunto;
      }
      var p_tiempom = document.getElementsByName('p_tiempom[]');
      for (var b = 0; b < p_tiempom.length; b++) {
        var tiempo = p_tiempom[b].value;
        element.tiempo[b] = tiempo;
      }
      var p_descrim = document.getElementsByName('p_descrim[]');
      for (var c = 0; c < p_descrim.length; c++) {
        var decri = p_descrim[c].value;
        element.decri[c] = decri;
      }
      var orderm = document.getElementsByName('orderm[]');
      for (var d = 0; d < orderm.length; d++) {
        var orden = orderm[d].value;
        element.orden[d] = orden;
      }
      var p_tp = document.getElementsByName('p_tp[]');
      for (var e = 0; e < p_tp.length; e++) {
        var tipopunto = p_tp[e].value;
        element.tipopunto[e] = tipopunto;
      }
      var p_latitud = document.getElementsByName('p_latitud[]');
      for (var o = 0; o < p_latitud.length; o++) {
        var lati = p_latitud[o].value;
        element.lati[o] = lati;
      }
      var p_longitud = document.getElementsByName('p_longitud[]');
      for (var u = 0; u < p_longitud.length; u++) {
        var long = p_longitud[u].value;
        element.long[u] = long;
      }
      var km = document.getElementsByName('km[]');
      for (var f = 0; f < km.length; f++) {
        var kilome = km[f].value;
        element.kilome[f] = kilome;
      }

      var punto = element;
      punto = JSON.stringify(punto);
      data.append('puntos', punto);
      console.log(punto);
    }

    $.ajax({
      // url: url2,
      url: $('#id_url_ajax').val() + 'planruta/Agregar_Puntos',
      type: 'POST',
      data: data,
      cache: false,
      processData: false, // Don't process the files
      contentType: false, // Set content type to false as jQuery will tell the server its a query string request
      dataType: 'json',
      success: function (data, textStatus, jqXHR) {
        let mensaje = '';
        if (data.numero === 200) {
          mensaje = `
          <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-check"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> ${data.mensaje}
              </div>
          </div>`;
          $('#punto_plan').empty();
          Listado_puntos();
          $('#anadirpunto').hide();
        } else if (data.numero === 405) {
          mensaje = `
          <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> ${data.mensaje}
              </div>
          </div>`;
          $('#anadirpunto').show();
        } else {
          mensaje = `
          <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-info-outline"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> ${data.mensaje}
              </div>
          </div>`;
          $('#anadirpunto').show();
        }
        document.getElementById('historicos').innerHTML = mensaje;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('no guardo punto');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } else {
    alert('Operacón Cancelada');
  }
}

function Listado_puntos() {
  $('#plan_id').val();
  var planes = {
    idplan: $('#plan_id').val(),
  };
  $.ajax({
    // url: urlu,
    url: $('#id_url_ajax').val() + 'planruta/puntos_de_ruta',
    type: 'POST',
    data: planes,
    dataType: 'json',
    success: function (data) {
      if (data != null) {
        var c = 0;
        var name;
        var select = $('<select class="posiciones_list" disabled><option value="0">0</option></select>');
        var btn_edit = $(
          '<span class="input-group-btn"><button type="button" class="text-warning btn-xs btn_edit_puntos" style="border:none; background-color: transparent;margin-left:-10px;" data-toggle="tooltip" data-placement="top" title="Editar Posición"><i class="fas fa-pencil-alt"></i></button></span>',
        );
        var btn_update_punto = $(`
						<div class="btn-group">
							<span class="input-group-btn">
								<button type="button" class="text-success btn-xs btn_update_puntos" style="border:none; background-color: transparent;margin-left:-10px;display:none;" data-toggle="tooltip" data-placement="top" title="Guardar Posición"><i class="fas fa-check"></i></button>
								<button type="button" class="text-danger btn-xs btn_cancelar_operacion" style="border:none; background-color: transparent;margin-left:-10px;display:none;" data-toggle="tooltip" data-placement="top" title="Cancelar Operación"><i class="fas fa-times"></i></button>
							</span>
						</div>
					`);

        $('#body_puntose').html('');
        data.forEach(function (element, index) {
          c++;
          $('#namep_e').val(element.nombre_plan);
          $('#deta_pe').val(element.observacion);

          if (element.tipo_punto == 'punto geografico') {
            name = 'Punto virtual';
          }

          if (element.tipo_punto == 'punto control') {
            name = 'Punto físico';
          }

          // Crea un elemento <select>
          select.append(
            $('<option>', {
              // value: element.cod_punto,
              value: element.cod_punto,
              text: element.posicion,
            }),
          );

          $('#body_puntose').append(
            `<tr class="tra${c}">
							<td  style="font-size:10px;padding:1px 1px 1px;" class="tra${c}"><div class="input-group selects"></div></td>
							<td style="font-size:10px;" id="tra${element.posicion}">${element.posicion}
							<input type="hidden" name="posicion" class="posicion" id="pos${element.posicion}" value="${element.posicion}">
							</td>
							<td  style="font-size:10px;" class="tra${c}">${name}</td>
							<td  style="font-size:10px;" class="tra${c}">${element.municipio}</td>
							<td  style="font-size:10px;" class="tra${c}"><a class="text-danger tra${c}" id="p${c}" title="Eliminar punto" onclick="delete_pc(${element.cod_punto}, ${c} )" href="Javascript:void(0);"> ${element.nombre_punto}</a></td>
							<td style="font-size:10px;" class="tra${c}">${element.tiempo_estimacion} 
								<input type="text" name="tiempos" id="tiempo${element.cod_punto}" class="tiempo_nuevo text-center" value="${element.tiempo_estimacion}" style="display:none;width:90px;">
							</td>
							<td  style="font-size:10px;" class="tra${c}">${element.descripcion_punto}</td>
							<td  style="font-size:10px;" class="tra${c}">${element.km_estimacion} km</td>
							<td  style="font-size:10px;" class="tra${c}">${element.latitud}</td>
							<td  style="font-size:10px;" class="tra${c}">${element.longitud}</td>
						</tr>`,
          );
          //<td  style="font-size:10px;width: 5px;" class="tra${c}">${btn}</td>
        });
        select.attr('onchange', 'posicion(this.value)');
        btn_edit.attr('onclick', 'edit(this)');
        btn_update_punto.attr('onclick', 'update(this)');
        $('.selects').append(select);
        $('.selects').append(btn_edit);
        $('.selects').append(btn_update_punto);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no trajo los planes');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function pintar_mapaplan(latori, latdes, lonori, londes, pcarraylat, pcarraylong, pgarraylat, pgarraylong, namepc, namepg, origen, destino) {
  var latori_1 = parseFloat(latori);
  var latdes_1 = parseFloat(latdes);
  var lonori_1 = parseFloat(lonori);
  var londes_1 = parseFloat(londes);
  var pcarraylat_1 = pcarraylat;
  var pcarraylong_1 = pcarraylong;
  var origen_a = origen;
  var destino_a = destino;
  var pgarraylat_1 = pgarraylat;
  var pgarraylong_1 = pgarraylong;

  var namepc_1 = namepc;
  var namepg_1 = namepg;

  var coord_ori = {lat: latori_1, lng: lonori_1};
  var coord_des = {lat: latdes_1, lng: londes_1};

  var coord_pais = {lat: 8.5709, lng: -74.2973}; //colombia
  var mapc = new google.maps.Map(document.getElementById('mapcontrol'), {
    zoom: 6,
    center: coord_pais,
    mapTypeId: 'hybrid',
  });

  var marker = new google.maps.Marker({
    position: coord_ori,
    title: origen_a,
    map: mapc,
  });

  marker = new google.maps.Marker({
    position: coord_des,
    title: destino_a,
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
  //punto control
  // var cordenadas;
  // var st, sm;
  // var x;
  // for (var a = 0; a < pcarraylat_1.length; a++) {
  //   st = parseFloat(pcarraylat_1[a]);
  //   sm = parseFloat(pcarraylong_1[a]);
  //   nom = namepc_1[a];
  //   cordenadas = {lat: st, lng: sm};
  //   var marketpc = new google.maps.Marker({
  //     position: cordenadas,
  //     icon: "https://img.icons8.com/windows/32/ffffff/clock--v3.png",
  //     title: "" + nom + "",
  //     map: mapc,
  //   });
  // }
  //puntos geograficos
  var cordenadas2;
  var st2, sm2, nom2;
  for (var b = 0; b < pgarraylat_1.length; b++) {
    st2 = parseFloat(pgarraylat_1[b]);
    sm2 = parseFloat(pgarraylong_1[b]);
    nom2 = namepg_1[b];
    cordenadas2 = {lat: st2, lng: sm2};
    var marketpc2 = new google.maps.Marker({
      position: cordenadas2,
      // icon: "https://img.icons8.com/ios-filled/24/fa314a/home.png",
      icon: 'https://img.icons8.com/external-others-inmotus-design/24/DC4C64/external-Point-basic-web-ui-elements-others-inmotus-design.png',
      title: '' + nom2 + '',
      map: mapc,
    });
  }
}

function abrir_ventana() {
  // URL de la página que deseas abrir en la nueva ventana
  var url = $('#id_url_ajax').val() + 'parametros/parametros/?idmenu=5';
  // Opciones de la ventana emergente (ancho, alto, opciones adicionales)
  var ventanaAncho = 1000;
  var ventanaAlto = 1000;
  // Calcula las coordenadas para centrar la ventana
  var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
  var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
  // Opciones de la ventana emergente (ancho, alto, posición)
  var opcionesVentana =
    'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
  // Utiliza window.open para abrir la nueva ventana
  window.open(url, name, opcionesVentana);
}
