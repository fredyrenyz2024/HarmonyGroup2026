$(document).ready(function () {
	$(".divnum").hide();
	$(".divbtnbusqueda").hide();
	$(".divfiltrob").hide();
	$(".divfec").hide();
	$("#filtro").change(function () {
		var tipo_documento = $("#filtro").val();
		$("#numero_documento").val('');
		$("#fecha_documento").val('');
		$(".divfiltrob").show();
		$(".divnum").hide();
		$(".divfec").hide();
		if ($("#filtro").val() == '') {
			$("#numero_documento").val('');
			$("#fecha_documento").val('');
			$(".divfiltrob").show();
			$(".divnum").hide();
			$(".divfec").hide();
		} else if ($("#filtro").val() == 5 || $("#filtro").val() == 6 || $("#filtro").val() == 7 || $("#filtro").val() == 8) {
			$("#opcion1").attr("disabled", true);
		} else {
			$("#opcion1").attr("disabled", false);
		}
	});

	$("#filtrob").change(function () {
		$("#numero_documento").val('');
		$("#fecha_documento").val('');
		var docu = $("#filtro").val();
		var opcion = $("#filtrob").val();
		if (opcion == 'f') {
			$(".divfec").show();
			$(".divnum").hide();
			$(".divbtnbusqueda").show();
		}
		if (opcion == 'n') {
			$(".divfec").hide();
			$(".divnum").show();
			$(".divbtnbusqueda").show();
		}
	});

	$("#buscar_datos").click(function () {
		var msg_error = '';
		var recurso = $("#filtro").val();
		var numero = $("#numero_documento").val();
		var recursob = $("#filtrob").val();
		if (!$("#filtro").val()) {
			msg_error += "<p>Debe diligenciar el <strong>Tipo documento</strong> para realizar su consulta</p>"
		} else {
			if (recurso == 7 || recurso == 8) {//trailer y vehiculo
				if (recursob == 'n') {
					if (numero.length !== 6) {
						msg_error += "<p>El <strong>Número de Documento</strong> debe tener mínimo 6 caracteres</p>";
					}
				}
			}

			if (recurso == 5 || recurso == 6) {
				if (recursob == 'n') {
					if (numero.length < 5 || numero.length > 11) {
						msg_error += "<p>El <strong>Número de Documento</strong> debe tener mínimo 5 máximo 11 dígitos</p>";
					}
				}
			} else {
				if (recurso && recursob == 'f') {
					if (!$("#fecha_documento").val()) {
						msg_error += "<p>Debe diligenciar la <strong>Fecha Documento</strong> para realizar su consulta</p>";
					}
				}
				if (recurso && recursob == 'n') {
					if (!$("#numero_documento").val()) {
						msg_error += "<p>Debe diligenciar el <strong>Número Documento</strong> para realizar su consulta</p>";
					}
				}
			}
		}
		if (!msg_error) {
			Consultar_Documento();
		} else {
			$(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
			$(".panel-body").animate({ scrollTop: 0 }, 600);
			$("#tabla_general").html('');
		}
	});
});

function Consultar_Documento() {
	var recurso = $("#filtro").val();
	var recursob = $("#filtrob").val();
	var numero = $("#numero_documento").val();
	var fecha = $("#fecha_documento").val();
	$("#tabla_datos").show();
	$("#contenedor_datos").css("display", "none");
	$("#bodycontenido").html('');
	$.post($("#id_url_ajax").val() + 'integrar_oet/Consulta_Documento_Carga2', 'filtro=' + recurso + '&filtrob=' + recursob + '&fecha=' + fecha + '&numero=' + numero, function (data) {
		$("#cabecera_general").html('');
		$("#tabla_general").html('');
		if (data) {
			let tipo_documento;
			let btn_consulta_oet = '';
			let nombre = '';
			let digito = '';
			$("#cabecera_general").html('<tr><td>Documento carga</td><td>Número</td><td>Respuesta Oet</td><td>Acción</td></tr>');
			for (var a = 0; a < data.length; a++) {
				//btnconsultar = '<button class="btn btn-space btn-secondary btn-sm mdi mdi-eye" title="ver datos" onClick="ConsultaDatos(' + data[a]['id'] + ')"></button>';

				if (data[a]['estado_envio_oet'] == 0 || data[a]['estado_envio_oet'] == '' || data[a]['estado_envio_oet'] == null) {
					btn_consulta_oet = `<button class="btn btn-space btn-success btn-sm mdi mdi-refresh" title="OET" onClick="Consulta_parametro_Oet('${data[a]['valor']}')">Retransmitir</button>`;
				} else {
					btn_consulta_oet = '<button class="btn btn-success btn-sm">Transmitido</button>';
				}

				if (recurso == 1) {
					tipo_documento = 'Orden cargue';
				} else if (recurso == 2) {
					tipo_documento = 'Remesa';
				} else if (recurso == 3) {
					tipo_documento = 'Manifiesto';
				} else if (recurso == 4) {
					tipo_documento = 'Cumplido';
				} else if (recurso == 5) {
					tipo_documento = 'Cliente';
					nombre = data[a]['namet'];
					digito = ' - ' + data[a]['digito'];
				} else if (recurso == 6) {
					tipo_documento = 'Tercero';
					nombre = data[a]['namet'];
					digito = ' - ' + data[a]['digito'];
				} else if (recurso == 7) {
					tipo_documento = 'Trailer';
				} else if (recurso == 8) {
					tipo_documento = 'Vehiculo';
				}

				$("#tabla_general").append('<tr>' +
					'<td>' + tipo_documento + '</td>' +
					'<td class="cell-detail">' +
					nombre + '<span>' + data[a]['numero'] + digito + '</span></td>' +
					'<td>' + data[a]['rta_oet'] + '</td>' +
					'<td>' + btn_consulta_oet + '</td>' +
					'</tr>');
			}
		}
	}, 'json');
}

function Consulta_parametro_Oet(id) {//Retransmitir a oet 
	recurso = $("#filtro").val();
	var paquete = 'recurso=' + recurso + '&numero=' + id;
	$.post($("#id_url_ajax").val() + 'integrar_oet/Retransmite_Datos', paquete, function (data) {
		if (data['status'] == true || data['status'] == "true") {
			$(".nexos-messages").html('<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Respuesta!</strong>Proceso transmitido a OET</div></div>');
			$(".nexos-content").animate({ scrollTop: 0 }, 600);
			$("#tabla_general").html('');
		} else if (data['status'] == false || data['status'] == "false") {
			$(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + data['error'] + '</div></div>');
			$(".nexos-content").animate({ scrollTop: 0 }, 600);
			$("#tabla_general").html('');
		}
	}, 'json');


	/*
	var recurso, numero;
	recurso = $("#filtro").val();
	numero = $("#numero_documento").val();
	var paquete = 'recurso=' + recurso + '&numero=' + numero;
	//enviar a php
	$.post($("#id_url_ajax").val() + 'integrar_oet/Consulta_Transacciones', paquete, function (data) {
		if (data) {
			alert(data);

		}
	}, 'json');*/
}
