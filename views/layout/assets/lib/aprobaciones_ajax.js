$(document).ready(function(){
	$("#btn_cambia_estado_asignacion").click(function(){
		cambiarestadoAsignacion();
	});

	$("#btn_cambia_estado_asignacion_rechaza").click(function(){
		cambiarestadoAsignacionRechaza();
	});
});
var url =$("#id_url_ajax").val()+"libs/aprobaciones_ajax.php";

function verVehiculo(id_vehiculo , id_agrupacion) {
	$("#e_id_vehiculo").val(id_vehiculo);
	$("#ver_vehiculos_title").text("");
	$("#ver_vehiculos_content").html("");
	var params = {
		accion: 'verVehiculo',
		id_vehiculo : id_vehiculo,
		id_agrupacion : id_agrupacion
	};
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			$("#ver_vehiculos_title").text("Agrupación # "+data.title);
			$("#ver_vehiculos_content").html(data.content);
			if ( data.error ) {
				var msg_error = data.error.replace(/\n/g , "</p><p>");
				$(".nexos_messages_popup").html(`
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
					</div>
				`);
				$("#ver_vehiculos").animate({ scrollTop: 0 }, 600);
			}
		}
  }, 'json');  
}

function cambiarestadoAsignacion() {
	$(".nexos-messages").html(`
		<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););">
			<div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;">
				<img src="${ $("#id_url_ajax").val() }public/img/nexos_loading.gif" height="60" width="60">
				<h3>Solicitud en proceso...</h3>
				<h4>Por favor, espere unos segundos.</h4>
			</div>
		</div>
	`);

	var estado = "Propuesto";
	var estado_log = "Flete autorizado";
	if ( $("#estado_asignaciones").length > 0 ) {
		estado = $("#estado_asignaciones").val();
		estado_log = "Respuesta Seguridad - " + $("#estado_asignaciones").val();
	}

	var params = {
		accion: 'cambiarestadoAsignacion',
		estado: estado,
		estado_log: estado_log,
		id_asignacion: $("#e_id_asignacion").val(),
		flete: $("#e_flete").val(),
		tipo_tramite: $("#e_tipo_tramite").val(),
		observaciones: $("#e_observaciones").val(),
		id_vehiculo: $("#e_id_vehiculo").val()
	};
	// console.log(params);
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			$("#btn_cambia_estado_asignacion").attr("data-dismiss","modal");
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
						tipo_actividad 		: data.actividades[i].tipo_actividad,
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
										console.log(data.control);
										console.log(data.error);
									},
						success		: function(data) {
										console.log(data);
						}
					});
				}
				$.ajaxSetup({async: true});
			}else{
				console.log("No se actualiza actividades por que el estado es diferente a Aprobado");
			}
			location.reload();
		}
		else{
			$("#btn_cambia_estado_asignacion").removeAttr("data-dismiss");
		}
	}, 'json');
}

function cambiarestadoAsignacionRechaza() {
	$(".nexos-messages").html(`
		'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););">
			<div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;">
				<img src="${$("#id_url_ajax").val()}public/img/nexos_loading.gif" height="60" width="60">
				<h3>Solicitud en proceso...</h3>
				<h4>Por favor, espere unos segundos.</h4>
			</div>
		</div>'
	`);
	var params = {
		accion: 'cambiarestadoAsignacion',
		estado: "No Aprobado",
		estado_log: "Flete no aprobado",
		id_asignacion: $("#r_id_asignacion").val(),
		id_vehiculo: $("#r_id_vehiculo").val(),
		observaciones: $("#r_observaciones").val(),
		flete: $("#r_flete").val(),
	};
	// console.log(params);
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			$("#btn_cambia_estado_asignacion_rechaza").attr("data-dismiss","modal");
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
						tipo_actividad 		: data.actividades[i].tipo_actividad,
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
										console.log(data.control);
										console.log(data.error);
									},
						success		: function(data) {
										console.log(data);
						}
					});
				}
				$.ajaxSetup({async: true});
			}else{
				console.log("No se actualiza actividades por que el estado es diferente a Aprobado");
			}
			location.reload();
		}
		else{
			$("#btn_cambia_estado_asignacion_rechaza").removeAttr("data-dismiss");
		}
	}, 'json');
}

function enviaridasignacion(id_asignacion){
	$("#c_id_asignacion").val(id_asignacion);
}

function enviaridasignacionestado(id_asignacion, placa , tarifa_transporte){
	$("#e_id_asignacion").val(id_asignacion);
	var params = {
		accion: 'verasignacion',
		id_asignacion: id_asignacion
	};
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			var html_content = `
				<span><strong>Información del flete</strong></span>
				<table class="table">
					<tbody>
						<tr>
							<td class="cell-detail">
								<span>Placa:</span>
								<span class="cell-detail-description">${placa}</span>
							</td>
							<td class="cell-detail">
								<span>Tipo de Trámite:</span>
								<span class="cell-detail-description">${data.content["tipo_tramite"]}</span>
							</td>
							<td class="cell-detail">
								<span>Estado:</span>
								<span class="cell-detail-description">${data.content["estado"]}</span>
							</td>
							<td class="cell-detail">
								<span>Tarifa Transporte:</span>
								<span class="cell-detail-description">$${new Intl.NumberFormat("de-DE").format(tarifa_transporte)}</span>
							</td>
							<td class="cell-detail">
								<span>Flete:</span>
								<span class="cell-detail-description">$${new Intl.NumberFormat("de-DE").format(data.content["flete"])}</span>
							</td>
						</tr>
						<tr><td colspan="5"></td></tr>
					</tbody>
				</table>
			`;

			$("#e_pruebas").html(html_content);
			$("#e_table_content").html(data.content["table"]);

			$("#e_flete").val(data.content["flete"]);
			$("#e_tipo_tramite").val(data.content["tipo_tramite"]);
			$("#e_id_vehiculo").val(data.content["id_vehiculo"]);
		}
	}, 'json');
}

function enviaridasignacionestadorechaza(id_asignacion, placa , tarifa_transporte){
	$("#r_id_asignacion").val(id_asignacion);
	var params = {
		accion: 'verasignacion',
		id_asignacion: id_asignacion
	};
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			var html_content = `
				<span><strong>Información del flete</strong></span>
				<table class="table">
					<tbody>
						<tr>
							<td class="cell-detail">
								<span>Placa:</span>
								<span class="cell-detail-description">${placa}</span>
							</td>
							<td class="cell-detail">
								<span>Tipo de Trámite:</span>
								<span class="cell-detail-description">${data.content["tipo_tramite"]}</span>
							</td>
							<td class="cell-detail">
								<span>Estado:</span>
								<span class="cell-detail-description">${data.content["estado"]}</span>
							</td>
							<td class="cell-detail">
								<span>Tarifa Transporte:</span>
								<span class="cell-detail-description">$${new Intl.NumberFormat("de-DE").format(tarifa_transporte)}</span>
							</td>
							<td class="cell-detail">
								<span>Flete:</span>
								<span class="cell-detail-description">$${new Intl.NumberFormat("de-DE").format(data.content["flete"])}</span>
							</td>
						</tr>
						<tr><td colspan="5"></td></tr>
					</tbody>
				</table>
			`;

			$("#r_pruebas").html(html_content);
			$("#r_table_content").html(data.content["table"]);

			$("#r_flete").val(data.content["flete"]);
			$("#r_tipo_tramite").val(data.content["tipo_tramite"]);
			$("#r_id_vehiculo").val(data.content["id_vehiculo"]);
		}
	}, 'json');
}
