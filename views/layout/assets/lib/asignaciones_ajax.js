$(document).ready(function() {
	$("#btn_crear_asignaciones").click(function(){
		$("#crea_asignaciones_msg").html("");
		// Se valida el contenido del formulario 
		var msg_error = "";
		if ( !$("#flete").val() ) {
			msg_error+= "<p>Debe diligenciar el campo <strong>Flete</strong> para poder asignar el vehículo.</p>";
		}else if ($("#flete").val() == 0) {
			msg_error+= "<p>El campo <strong>Flete</strong> debe ser mayor de 0 para poder asignar el vehículo.</p>";
		}
		if ( !$("#tipo_tramite").val() ) {
			msg_error+= "<p>Debe seleccionar un <strong>Tipo de tramite</strong> para poder asignar el vehículo.</p>";
		}
		if ( !$("#placa_vehiculo").val() ) {
			msg_error+= "<p>Debe diligenciar el campo <strong>Placa vehículo</strong> para poder asignar el vehículo.</p>";
		}

		if ( !msg_error ) {
			crearAsignacion();
		}
		if ( msg_error ) {
			$("#crea_asignaciones_msg").html(`
				<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
					<div class="icon">
						<span class="mdi mdi-close"></span>
					</div>
					<div class="message">
						<button type="button" data-dismiss="alert" aria-label="Close" class="close">
							<span aria-hidden="true" class="mdi mdi-close"></span>
						</button>
						<strong>Error!</strong>${msg_error}
					</div>
				</div>'
			`);
		}
	});

	$("#btn_cancela_asignaciones").click(function(){
		$("#cancela_asignaciones_msg").html("");
		var msg_error = "";
		if ( !$("#c_observacion").val() ) {
			msg_error+= "<p>Debe diligenciar el campo <strong>Observaciones</strong> para poder cancelar el vehículo.</p>";
		}

		if ( !msg_error ) {
			cancelarAsignacion();
		}
		if ( msg_error ) {
			$("#cancela_asignaciones_msg").html(`
				<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
					<div class="icon">
						<span class="mdi mdi-close"></span>
					</div>
					<div class="message">
						<button type="button" data-dismiss="alert" aria-label="Close" class="close">
							<span aria-hidden="true" class="mdi mdi-close"></span>
						</button>
						<strong>Error!</strong>${msg_error}
					</div>
				</div>'
			`);
		}
	});

	$("#btn_cambia_estado_asignacion").click(function(){
		$("#cambia_estado_asignaciones_msg").html("");
		// Se valida el contenido del formulario 
		var msg_error = "";
		if ( !$("#e_tipo_tramite").val() ) {
			msg_error+= "<p>Debe seleccionar un <strong>Tipo de tramite</strong> para poder asignar el vehículo.</p>";
		}
		if ( !$("#e_flete").val() ) {
			msg_error+= "<p>Debe diligenciar el campo <strong>Flete</strong> para poder asignar el vehículo.</p>";
		}else if ($("#e_flete").val() == 0) {
			msg_error+= "<p>El campo <strong>Flete</strong> debe ser mayor de 0 para poder asignar el vehículo.</p>";
		}

		if ( !msg_error ) {
			cambiarestadoAsignacion();
		}
		if ( msg_error ) {
			$("#cambia_estado_asignaciones_msg").html(`
				<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
					<div class="icon">
						<span class="mdi mdi-close"></span>
					</div>
					<div class="message">
						<button type="button" data-dismiss="alert" aria-label="Close" class="close">
							<span aria-hidden="true" class="mdi mdi-close"></span>
						</button><strong>Error!</strong>${msg_error}
					</div>
				</div>
			`);
		}
	});
});
var url =$("#id_url_ajax").val()+"libs/asignaciones_ajax.php";

var substringMatcher = function (strs) {
	return function findMatches(q, cb) {
		var matches, substringRegex;

		// an array that will be populated with substring matches
		matches = [];

		// regex used to determine if a string contains the substring `q`
		substrRegex = new RegExp(q, 'i');

		// iterate through the pool of strings and for any string that
		// contains the substring `q`, add it to the `matches` array
		$.each(strs, function (i, str) {
			if (substrRegex.test(str)) {
				matches.push(str);
			}
		});
		cb(matches);
	};
};

var vehiculo=[];
function buscarvehiculos(id_agrupacion,numero_agrupacion) {
	$("#id_asignacion_agrupamiento").val(id_agrupacion);
	$("#tools_crear_asignacion").css("display","block");
	$("contenido_asignaciones").html("");
	$("#titulo_asignar").text("Asignación # "+numero_agrupacion);
	var params = {
		accion: 'buscarAgrupamientovehiculos',
		id_agrupacion : id_agrupacion
	};

	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		let html_listado_asignaciones="";
		// console.log(data);
		if (data.success) {
			if(data.content.length>0){
				for (let i=0;i<data.content.length;i++){
					let  htmlopcionesasignacion="";

					switch(data.content[i]["estado"]) {
						case "Asignado":
							html_listado_asignaciones+= `
								<tr>
									<td class='actions-nexos hint--top-right' data-hint='${data.content[i]["estado"]}'>
										<span class='mdi mdi-dot-circle icon'></span>
									</td>
							`;
							htmlopcionesasignacion=`
								<a href='javascript:' class='cell-detail  hint--top-left' data-hint='Cancela asignación' >
									<span class='icon mdi mdi-close-circle' onclick='enviaridasignacion(${data.content[i]["id"]})' data-toggle='modal' data-target='#cancela_asignaciones'></span>
								</a>
								<a href='javascript:' class='cell-detail  hint--top-left' data-hint='Cambiar estado asignación' >
									<span class='icon mdi mdi-edit' onclick='enviaridasignacionestado(${data.content[i]['id']})' data-toggle='modal' data-target='#cambia_estado_asignaciones'></span>
								</a>
							`;
							break;

						case "Propuesto":
							html_listado_asignaciones+=`
								<tr>
									<td class='actions-nexos hint--top-right' data-hint='${data.content[i]["estado"]}'>
										<span class='mdi mdi-dot-circle icon'></span>
									</td>
							`;
							htmlopcionesasignacion=`
								<a href='javascript:' class='cell-detail  hint--top-left' data-hint='Cancela asignación' >
									<span class='icon mdi mdi-close-circle' onclick='enviaridasignacion(${data.content[i]["id"]})' data-toggle='modal' data-target='#cancela_asignaciones'></span>
								</a>
								<a href='javascript:' class='cell-detail  hint--top-left' data-hint='Cambiar estado asignación' >
									<span class='icon mdi mdi-edit' onclick='enviaridasignacionestado(${data.content[i]['id']})' data-toggle='modal' data-target='#cambia_estado_asignaciones'></span>
								</a>
							`;
							break;

						case "Verificacion Flete":
							html_listado_asignaciones+=`
								<tr>
									<td class='actions-nexos hint--top-right' data-hint='${data.content[i]["estado"]}'>
										<span class='mdi mdi-dot-circle icon'></span>
									</td>
							`;
							htmlopcionesasignacion=`
								<a href='javascript:' class='cell-detail  hint--top-left' data-hint='Cancela asignación' >
									<span class='icon mdi mdi-close-circle' onclick='enviaridasignacion(${data.content[i]["id"]})' data-toggle='modal' data-target='#cancela_asignaciones'></span>
								</a>
								<a href='javascript:' class='cell-detail  hint--top-left' data-hint='Cambiar estado asignación' >
									<span class='icon mdi mdi-edit' onclick='enviaridasignacionestado(${data.content[i]['id']})' data-toggle='modal' data-target='#cambia_estado_asignaciones'></span>
								</a>
							`;
							break;

						case "Aprobado":
							$("#tools_crear_asignacion").css("display","none");
							html_listado_asignaciones+=`
								<tr>
									<td class='nexos-txt-success hint--top-right text-center' data-hint='${data.content[i]["estado"]}'>
										<center><span class='mdi mdi-dot-circle icon'></span></center>
									</td>
							`;
							break;
						
						case "Preaprobado":
							html_listado_asignaciones+=`
								<tr>
									<td class='nexos-txt-warning hint--top-right text-center' data-hint='${data.content[i]["estado"]}'>
										<center><span class='mdi mdi-dot-circle icon'></span></center>
									</td>
							`;
							htmlopcionesasignacion=`
								<a href='javascript:' class='cell-detail  hint--top-left' data-hint='Cancela asignación' >
									<span class='icon mdi mdi-close-circle' onclick='enviaridasignacion(${data.content[i]["id"]})' data-toggle='modal' data-target='#cancela_asignaciones'></span>
								</a>
								<a href='javascript:' class='cell-detail  hint--top-left' data-hint='Cambiar estado asignación' >
									<span class='icon mdi mdi-check-circle' onclick='enviaridasignacionestado(${data.content[i]['id']})' data-toggle='modal' data-target='#cambia_estado_asignaciones'></span>
								</a>
							`;
							break;

						case "Pendiente":
							html_listado_asignaciones+=`
								<tr>
									<td class='nexos-txt-warning hint--top-right text-center' data-hint='${data.content[i]["estado"]}'>
										<center><span class='mdi mdi-dot-circle icon'></span></center>
									</td>
							`;
							htmlopcionesasignacion=`
								<a href='javascript:' class='cell-detail  hint--top-left' data-hint='Cancela asignación' >
									<span class='icon mdi mdi-close-circle' onclick='enviaridasignacion(${data.content[i]["id"]})' data-toggle='modal' data-target='#cancela_asignaciones'></span>
								</a>
								<a href='javascript:' class='cell-detail  hint--top-left' data-hint='Cambiar estado asignación' >
									<span class='icon mdi mdi-edit' onclick='enviaridasignacionestado(${data.content[i]['id']})' data-toggle='modal' data-target='#cambia_estado_asignaciones'></span>
								</a>
							`;
							break;

						case "No Aprobado":
							htmlopcionesasignacion=`
								<a href='javascript:' class='cell-detail  hint--top-left' data-hint='Ver Log de eventos' >
									<span class='icon mdi mdi-eye' onclick='veridasignacion(${data.content[i]["id"]})' data-toggle='modal' data-target='#ver_log'></span>
								</a>
							`;
							html_listado_asignaciones+=`
								<tr>
									<td class='nexos-txt-danger hint--top-right text-center' data-hint='${data.content[i]["estado"]}'>
										<center><span class='mdi mdi-dot-circle icon'></span></center>
									</td>
							`;
							break;

						case "Cancelado":
							htmlopcionesasignacion=`
								<a href='javascript:' class='cell-detail  hint--top-left' data-hint='Ver Log de eventos' >
									<span class='icon mdi mdi-eye' onclick='veridasignacion(${data.content[i]["id"]})' data-toggle='modal' data-target='#ver_log'></span>
								</a>
							`;
							html_listado_asignaciones+=`
								<tr>
									<td class='nexos-txt-danger hint--top-right text-center' data-hint='${data.content[i]["estado"]}'>
										<center><span class='mdi mdi-dot-circle icon'></span></center>
									</td>
							`;
							break;

						default:
							html_listado_asignaciones+=`
								<tr>
									<td class='actions-nexos'>
										<center><span class='mdi mdi-dot-circle icon'></span></center>
									</td>
							`;
							break;
					}

					html_listado_asignaciones+=`
						<td class='cell-detail'><span>${data.content[i]["placa"]}</span></td>
						<td class='cell-detail text-right'><span>$${new Intl.NumberFormat("de-DE").format(data.content[i]["flete"])}</span></td>
						<td class='cell-detail'><span>${data.content[i]["tipo_tramite"]}</span></td>
						<td class='cell-detail'><span>${data.content[i]["fecha_hora_operacion"]}</span></td>
						<td class='cell-detail'><span>${data.content[i]["estado"]}</span></td>
						<td class='actions'>${htmlopcionesasignacion}</td></tr>
					`;
				}

				$('#contenido_asignaciones').html(`
					<div class="col-sm-12">
						<table id="table1" class="table table-striped table-condensed table-hover">
							<thead>
								<tr class="nexos-encabezado">
									<th style="width:5%;">#</th>
									<th>Placa vehículo</th>
									<th>Flete</th>
									<th>Tipo de trámite</th>
									<th>Fecha postulación</th>
									<th>Estado</th>
									<th style="width:10%;min-width: 10%;"</th>
								</tr>
							</thead>
							<tbody>
								${html_listado_asignaciones}
							</tbody>
						</table>
					</div>
				`);

				var params = {
					accion: "cargarvehiculos",
					id_agrupacion: id_agrupacion
				};

				vehiculo=[];
				$.ajaxSetup({async: false});
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						for (let x = 0; x < data.content.length; x++) {
							vehiculo.push(data.content[x]['placa']);
						}

						$('#caja_vehiculo .typeahead').typeahead({
							minLength: 1
						},
						{
							name: 'states',
							source: substringMatcher(vehiculo),
						});

						$.ajaxSetup({async: false});
						$('#caja_vehiculo').bind('typeahead:selected', function (obj, datum, name) {
							var params = {
								accion: 'obtenerdatosvehiculos',
								placa: datum
							};

							$.post(url, params, function (data) {
								// console.log(data);
								if (data.success) {
									var nombre = data.content.nombre;
									$("#id_vehiculo").val(data.content.id);
									$("#btn_crear_asignaciones").focus();
								} else {
								}
							}, 'json');
						});
						$.ajaxSetup({async: true});
						$("#placa_vehiculo").focusout(function () {
							// console.log($.inArray($("#placa_vehiculo").val(), vehiculo));
							if ($.inArray($("#placa_vehiculo").val(), vehiculo) == (-1)) {
								//$("#nombre_propietario").val("");
							} else {
							}
						});
					} else {
					}
				}, 'json');
				$.ajaxSetup({async: true});
			}else{
				$("#contenido_asignaciones").html(`
					<div class='row' >
					<div class='col-sm-1'></div>
						<div class='col-sm-10'>
							<div  class='table-responsive noSwipe'>
								<table id='table1' class='table table-striped table-hover'>
									<thead>
										<tr class='nexos-encabezado'>
											<th style='width:10%;'>#</th>
											<th>Placa Vehículo</th>
											<th>Fecha hora</th> <th>Estado</th> <th style='width:10%;min-width: 10%;'</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td colspan= '5' style='text-align: center'>No hay vehículos asociados a este agrupamiento</td>
										</tr>
									</tbody>
								</table>
				`);
				vehiculo=[];
				var params = {
					accion: "cargarvehiculos",
					id_agrupacion: id_agrupacion
				};
				$.ajaxSetup({async: false});
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						for (let x = 0; x < data.content.length; x++) {
							vehiculo.push(data.content[x]['placa']);
						}
						$('#caja_vehiculo .typeahead').typeahead({
							minLength: 1
						},
						{
							name: 'states',
							source: substringMatcher(vehiculo),
						});

						$.ajaxSetup({async: false});
						$('#caja_vehiculo').bind('typeahead:selected', function (obj, datum, name) {
							var params = {
								accion: 'obtenerdatosvehiculos',
								placa: datum
							};
							$.post(url, params, function (data) {
								console.log(data);
								if (data.success) {
									var nombre = data.content.nombre;
									$("#id_vehiculo").val(data.content.id);
									$("#btn_crear_asignaciones").focus();
								} else {
								}
							}, 'json');
						});
						$.ajaxSetup({async: true});

						$("#placa_vehiculo").focusout(function () {
							console.log($.inArray($("#placa_vehiculo").val(), vehiculo));
							if ($.inArray($("#placa_vehiculo").val(), vehiculo) == (-1)) {
								// $("#nombre_propietario").val("");
							} else {
							}
						});
					} else {
					}
				}, 'json');
				$.ajaxSetup({async: true});
			}
		}else{
		}
	}, 'json');  
	$.ajaxSetup({async: true});
}

function crearAsignacion() {
	$(".nexos-messages").html('<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' + $("#id_url_ajax").val() + 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>');
	var params = {
		accion: 'crearAsignacion',
		id_agrupacion: $("#id_asignacion_agrupamiento").val(),
		id_vehiculo: $("#id_vehiculo").val(),
		flete: $("#flete").val(),
		tipo_tramite: $("#tipo_tramite").val(),
		cant_solicitudes_agrupamiento: $("#cant_solicitudes_agrupamiento_" + $("#id_asignacion_agrupamiento").val() ).val(),
		tarifa_transporte: $("#tarifa_transporte_" + $("#id_asignacion_agrupamiento").val() ).val()
	};
	// console.log(params);
	$.post(url, params, function (data) {
		console.log("Entro en crear asignación");
		if (data.success) {
			// console.log(data);
			$("#btn_crear_asignaciones").attr("data-dismiss","modal");
			// Se gestina la actividades en el proyecto 
			if (data.actividades) {
				var url_gestion_actividad = $("#id_url_ajax").val() + "libs/gestion_actividades.php?tabla=cmx_importacion_actividades&proyecto=importaciones";
				$.ajaxSetup({async: false});
				for (var i = 0; i < data.actividades.length; i++) {
					var params = {
						id 					: data.actividades[i].id,
						id_importacion		: data.actividades[i].id_importacion,
						id_material			: data.actividades[i].id_material,
						orden				: data.actividades[i].orden,
						tipo_actividad		: data.actividades[i].tipo_actividad,
						fecha_hora_inicio	: data.actividades[i].fecha_hora_inicio,
						costo_real 			: data.actividades[i].costo_real,
						respuesta 			: data.actividades[i].respuesta
					};
					// console.log(params);
					$.ajax({
						type		: "POST",
						cache		: false,
						url			: url_gestion_actividad,
						data		: params,
						// dataType	: "json",
						beforeSend	: function(jqXHR, settings){
						},
						error 		: function(data){
										console.log(data);
									},
						success		: function(data) {
										console.log(data);
						}
					});
				}
				$.ajaxSetup({async: true});
			}else{
				console.log("Actividad de proyecto ya actualizada");
			}
			location.reload();
		}else{
			$("#btn_crear_asignaciones").removeAttr("data-dismiss");
		}
	}, 'json');
}

function cancelarAsignacion() {
	var params = {
		accion: 'cancelarAsignacion',
		id_asignacion: $("#c_id_asignacion").val(),
		observacion: $("#c_observacion").val()
	};
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			$("#btn_cancela_asignaciones").attr("data-dismiss","modal");
			location.reload();
		}
		else{
			$("#btn_cancela_asignaciones").removeAttr("data-dismiss");
		}
	}, 'json');
}

function cambiarestadoAsignacion() {
	var params = {
		accion: 'cambiarestadoAsignacion',
		estado: $("#estado_asignaciones").val(),
		id_asignacion: $("#e_id_asignacion").val(),
		flete: $("#e_flete").val(),
		tipo_tramite: $("#e_tipo_tramite").val(),
		observaciones: $("#e_observaciones").val()
	};
	$.post(url, params, function (data) {
		console.log(data);
		$(".nexos-messages").html('<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' + $("#id_url_ajax").val() + 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>');
		if (data.success) {
			$("#btn_cambia_estado_asignacion").attr("data-dismiss","modal");
			location.reload();
		}
		else{
			$("#btn_cambia_estado_asignacion").removeAttr("data-dismiss");
		}
	}, 'json');
}

function enviaridasignacion(id_asignacion){
	$("#c_id_asignacion").val(id_asignacion);
}

function enviaridasignacionestado(id_asignacion){
	$("#e_id_asignacion").val(id_asignacion);
	var params = {
		accion: 'verasignacion',
		id_asignacion: id_asignacion
	};

	$.post(url, params, function (data) {
		// console.log(data);
		$("#e_table_content").empty();
		if (data.success) {
			$("#estado_asignaciones").val(data.content["estado"]);
			$("#e_flete").val(data.content["flete"]);
			$("#e_tipo_tramite").val(data.content["tipo_tramite"]);
			$("#e_observaciones").val(data.content["observaciones"]);
			$("#e_table_content").html(data.content["table"]);
		}
		else{}
	}, 'json');
}

function verdatossolicitud(id_asignacion) {
	var params = {
		accion: 'verSolicitudesAsignacion',
		id_asignacion: id_asignacion
	};

	$.post(url, params, function (data) {
		if (data.success) {
			// console.log("Entro en funcion verdatossolicitud en archivo js");
			// console.log(data);

			var contenido = '';
			for (var i = 0; i < data.content.length; i++) {
				contenido+= '\n\
					<div class="panel panel-border panel-contrast">\n\
						<div class="panel-heading panel-heading-contrast">\n\
							Solicitud # ' + data.content[i][0][0]["numero_solicitud"] + '\n\
							<span class="panel-subtitle"></span>\n\
						</div>\n\
					<div class="panel-body">\n\
				';

				// Muestra información de la solicitud
				var carroceria = "";
				if ( data.content[i][0][0]["CARROCERIA"] ) {
					var carroceria = "(" + data.content[i][0][0]["CARROCERIA"] + ")";
				}
				var contenedor = "";
				if ( data.content[i][0][0]["CONTENEDOR"] ) {
					contenedor = '\n\
						<div class="col-sm-3">\n\
							<span>Contenedor</span>\n\
							<span class="cell-detail-description">' + data.content[i][0][0]["CONTENEDOR"] + '</span>\n\
						</div>\n\
						<div class="col-sm-3">\n\
							<span>Tara Contenedor</span>\n\
							<span class="cell-detail-description">' + new Intl.NumberFormat("de-DE").format( data.content[i][0][0]["tara_contenedor"] ) + ' Kg.</span>\n\
						</div>\n\
					';
				}

				contenido+= '\n\
					<strong>Información Solicitud</strong>\n\
					<table class="table">\n\
						<tbody>\n\
							<tr>\n\
								<td class="cell-detail">\n\
									<div class="row">\n\
										<div class="col-sm-3">\n\
											<span>Cliente</span>\n\
											<span class="cell-detail-description">' + data.content[i][0][0]["NOM_CLIENTE"] + '</span>\n\
										</div>\n\
										<div class="col-sm-3">\n\
											<span>Origen</span>\n\
											<span class="cell-detail-description">' + data.content[i][0][0]["origen"] + '</span>\n\
										</div>\n\
										<div class="col-sm-3">\n\
											<span>Tipo Operación</span>\n\
											<span class="cell-detail-description">' + data.content[i][0][0]["tipo_operacion"] + '</span>\n\
										</div>\n\
										<div class="col-sm-3">\n\
											<span># Orden</span>\n\
											<span class="cell-detail-description">' + data.content[i][0][0]["numero_orden"] + '</span>\n\
										</div>\n\
										<div class="row"></div><br>\n\
										<div class="col-sm-3">\n\
											<span>Tipo Vehículo Propuesto</span>\n\
											<span class="cell-detail-description">' + data.content[i][0][0]["NOM_TIPO_VEHICULO"] + ' ' + carroceria + '</span>\n\
										</div>\n\
										<div class="col-sm-3">\n\
											<span># BL</span>\n\
											<span class="cell-detail-description">' + data.content[i][0][0]["numero_bl"] + '</span>\n\
										</div>\n\
										' + contenedor + '\n\
									</div>\n\
								</td>\n\
							</tr>\n\
							<tr><td></td></tr>\n\
						</tbody>\n\
					</table>\n\
				';
				// Muestra información de la solicitud

				// Se muestra el material de la solicitud
				contenido+= '\n\
					<strong>Material Solicitud</strong>\n\
					<table class="table">\n\
						<thead>\n\
							<tr>\n\
								<th>Material</th>\n\
								<th>Código UN</th>\n\
								<th>Peso</th>\n\
								<th>Cantidad</th>\n\
								<th>Valor Declarado</th>\n\
								<th>Tipo Movilización</th>\n\
							</tr>\n\
						</thead>\n\
						<tbody>\n\
				';
				for (var j = 0; j < data.content[i][1].length; j++) {
					contenido+= '\n\
						<tr>\n\
							<td class="cell-detail">\n\
							' + data.content[i][1][j]["tipo_mercancia"] + '\n\
							</td>\n\
							<td class="cell-detail text-center">\n\
							' + data.content[i][1][j]["codigo_UN"] + '\n\
							</td>\n\
							<td class="cell-detail text-right">\n\
							' +  new Intl.NumberFormat("de-DE").format( data.content[i][1][j]["peso_bruto"] ) + ' Kg.\n\
							</td>\n\
							<td class="cell-detail text-center">\n\
							' + data.content[i][1][j]["cantidad"] + '\n\
							</td>\n\
							<td class="cell-detail text-right">\n\
							$ ' + new Intl.NumberFormat("de-DE").format( data.content[i][1][j]["VLR_DECLARADO"] ) + '\n\
							</td>\n\
							<td class="cell-detail">\n\
							' + data.content[i][1][j]["tipo_movilizacion"] + '\n\
							</td>\n\
						</tr>\n\
					';
				}
				contenido+= '\n\
							<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>\n\
						</tbody>\n\
					</table>\n\
				';
				// Fin muestra el material de la solicitud

				// Se muestra los tramos de la solicitud
				contenido+= '\n\
					<strong>Tramos Solicitud</strong>\n\
					<table class="table">\n\
						<thead>\n\
							<tr>\n\
							<th>Operación</th>\n\
							<th>Remitente/Destinatario</th>\n\
							<th>Fecha Hora Movilización</th>\n\
							<th>Peso</th>\n\
							<th>Cantidad</th>\n\
							<th>Valor Venta</th>\n\
							<th>Valor Compra</th>\n\
							<th>Personal</th>\n\
						</tr>\n\
					</thead>\n\
					<tbody>\n\
				';
				for (var j = 0; j < data.content[i][2].length; j++) {
					var personal = "No";
					if (data.content[i][2][j]["codigo_UN"] == 1) {
						personal = "Si";
					}
					contenido+= '\n\
						<tr>\n\
							<td class="cell-detail">\n\
								' + data.content[i][2][j]["tipo_operacion"] + '\n\
							</td>\n\
							<td class="cell-detail">\n\
								' + data.content[i][2][j]["nombre"] + '\n\
							</td>\n\
							<td class="cell-detail">\n\
								' + data.content[i][2][j]["fecha_hora_operacion"] + '\n\
							</td>\n\
							<td class="cell-detail text-right">\n\
								' + new Intl.NumberFormat("de-DE").format( data.content[i][2][j]["peso"] ) + ' Kg.\n\
							</td>\n\
							<td class="cell-detail text-center">\n\
								' + data.content[i][2][j]["unidades"] + '\n\
							</td>\n\
							<td class="cell-detail text-right">\n\
								$ ' + new Intl.NumberFormat("de-DE").format( data.content[i][2][j]["valor_venta"] ) + '\n\
							</td>\n\
							<td class="cell-detail text-right">\n\
								$ ' + new Intl.NumberFormat("de-DE").format( data.content[i][2][j]["valor_compra"] ) + '\n\
							</td>\n\
							<td class="cell-detail text-center">\n\
								' + personal + '\n\
							</td>\n\
						</tr>\n\
					';
				}
				contenido+= '\n\
							<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>\n\
						</tbody>\n\
					</table>\n\
				';
				// Fin muestra los tramos de la solicitud

				contenido+= '\n\
						</div>\n\
					</div>\n\
				';
			}

			// Contenido del título
			$("#ver_info_solicitud_title").html("Información del Agrupamiento # " + data.content[0][0][0]["numero_agrupacion"]);

			// Contenido del body del popup
			$("#ver_info_solicitud_conten").html(contenido);
		} else {
			alert("error");
		}
	}, 'json');
}

function veridasignacion(id_asignacion){
	var params = {
		accion: 'veridasignacion',
		id_asignacion: id_asignacion
	};
	$.post(url, params, function (data) {
		$("#ver_log_conten").html(data.content);
	}, 'json');
}
