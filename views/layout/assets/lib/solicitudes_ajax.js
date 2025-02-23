$(document).ready(function () {
	$("#btn_agregar_solicitud").click(function () {
		crearSolicitud();
	});
	$("#btn_e_actualizar_solicitud").click(function () {
		editarSolicitud();
	});
	$("#btn_cancelar_solicitud").click(function () {
		cancelarSolicitud();
	});
	$("#btn_agregar_tramo_solicitud").click(function () {
		agregarTramoSolicitud();
	});
	$("#btn_agregar_asignacion").click(function () {
		crearsolicitudVehiculo();
	});
	$("#btn_editar_asignacion").click(function () {
		editarsolicitudVehiculo();
	});
	$("#btn_finalizar_solicitud").click(function () {
		finalizarSolicitud();
	});

	$("#tipo_operacion").change(function () {
		let tipo_operacion = $("#tipo_operacion").val();
		if (tipo_operacion == "") {
			$("#caja_tipo_operacion").html("");
			$("#caja_tipo_operacion").css("display", "none");
		} else if (tipo_operacion == "IMPORTACION") {
			$("#caja_tipo_operacion").html("");
			$("#caja_tipo_operacion").html('< div class="row"><div class="form-group col-xs-6"><label>Orden de compra:</label><input type="text" id="orden_compra" placeholder="Orden de compra" class="form-control"><label id="error_orden_compra"></label></div><div class="form-group col-xs-6"><label>No de BL:</label><input type="text" id="num_bl" placeholder="No de BL" class="form-control"></div></div>');
			$("#caja_tipo_operacion").css("display", "block");
		} else if (tipo_operacion == "EXPORTACION") {
			$("#caja_tipo_operacion").html("");
			$("#caja_tipo_operacion").html('< div class="row"><div class="form-group col-xs-6"><label>Orden de compra:</label><input type="text" id="orden_compra" placeholder="Orden de compra" class="form-control"><label id="error_orden_compra"></label></div></div>');
			$("#caja_tipo_operacion").css("display", "block");
		} else if (tipo_operacion == "NACIONAL") {
			$("#caja_tipo_operacion").html("");
			$("#caja_tipo_operacion").html('< div class="row"><div class="form-group col-xs-6"><label>Orden de compra:</label><input type="text" id="orden_compra" placeholder="Orden de compra" class="form-control"><label id="error_orden_compra"></label></div></div> ');
			$("#caja_tipo_operacion").css("display", "block");
		} else if (tipo_operacion == "URBANO") {
			$("#caja_tipo_operacion").html("");
			$("#caja_tipo_operacion").html('< div class="row"><div class="form-group col-xs-6"><label>Orden de compra:</label><input type="text" id="orden_compra" placeholder="Orden de compra" class="form-control"><label id="error_orden_compra"></label></div></div> ');
			$("#caja_tipo_operacion").css("display", "block");
		}
	});

	$("#btn_agregar_mercancia").click(function () {
		cantidad_mercancia += 1;
		$("#caja_adicionar_mercancia").append('<div class="panel panel-border panel-contrast " id="caja_mercancia' + cantidad_mercancia + '"> <div class="panel-heading panel-heading-contrast" > <div class="tools"> <a href="#" class="cell-detail hint--top" onclick="removermercancia(' + cantidad_mercancia + ')" data-hint="Eliminar mercancía"><span class="icon mdi mdi-minus"></span></a> </div> Mercancia ' + cantidad_mercancia + '</span> </div> <div class="row" style="padding: 20px 20px 0 20px;" > <div class="form-group col-xs-6"> <label>Tipo de mercancía:</label> <input type="text" id="tipo_mercancia' + cantidad_mercancia + '" placeholder="Tipo de mercancía" class="form-control"> <label id="error_tipo_mercancia' + cantidad_mercancia + '"></label> </div> <div class="form-group col-xs-6"> <label>Tara de contenedor:</label> <input type="text" id="tara_contenedor' + cantidad_mercancia + '" placeholder="Tara de contenedor" class="form-control"> <label id="error_tara_contenedor' + cantidad_mercancia + '"></label> </div> </div> <div class="row" style="padding: 20px 20px 0 20px;"> <div class="form-group col-xs-6"> <label>Peso total:</label> <input type="number" id="peso_total' + cantidad_mercancia + '" placeholder="Peso total" class="form-control"> <label id="error_peso_total' + cantidad_mercancia + '"></label> </div> <div class="form-group col-xs-6"> <label>Unidades:</label> <input type="number" id="unidades' + cantidad_mercancia + '" placeholder="Unidades" class="form-control"> <label id="error_unidades' + cantidad_mercancia + '"></label> </div> </div> < div class="row"> <div class="form-group col-xs-6"> <label>Valor declarado:</label> <input type="number" id="valor_declarado' + cantidad_mercancia + '" placeholder="Valor declarado" class="form-control"> <label id="error_valor_declarado' + cantidad_mercancia + '"></label> </div> <div class="form-group col-xs-6"> <label>Tipo de movilización:</label> <select id="tipo_movilizacion' + cantidad_mercancia + '" class="form-control"> <option value="">Seleccione la movilización</option> <option value="EXPRESO">EXPRESO</option> <option value="CONSOLIDADO">CONSOLIDADO</option> </select> <label id="error_tipo_movilizacion' + cantidad_mercancia + '"></label> </div> </div> </div> ');
	});

	$("#btn_e_agregar_mercancia").click(function () {
		e_cantidad_mercancia += 1;
		$("#e_caja_adicionar_mercancia").append('<div class="panel panel-border panel-contrast " id="e_caja_mercancia' + e_cantidad_mercancia + '"> <div class="panel-heading panel-heading-contrast" > <div class="tools"> <a href="#" class="cell-detail hint--top" onclick="e_removermercancia(' + e_cantidad_mercancia + ')" data-hint="Eliminar mercancía"><span class="icon mdi mdi-minus"></span></a> </div> Mercancia ' + e_cantidad_mercancia + '</span> </div> <div class="row"> <div class="form-group col-xs-6"> <label>Tipo de mercancía:</label> <input type="text" id="e_tipo_mercancia' + e_cantidad_mercancia + '" placeholder="Tipo de mercancía" class="form-control"> <label id="e_error_tipo_mercancia' + e_cantidad_mercancia + '"></label> </div> <div class="form-group col-xs-6"> <label>Tara de contenedor:</label> <input type="text" id="e_tara_contenedor' + e_cantidad_mercancia + '" placeholder="Tara de contenedor" class="form-control"> <label id="e_error_tara_contenedor' + e_cantidad_mercancia + '"></label> </div> </div> <div class="row" style="padding: 20px 20px 0 20px;"> <div class="form-group col-xs-6"> <label>Peso total:</label> <input type="number" id="e_peso_total' + e_cantidad_mercancia + '" placeholder="Peso total" class="form-control"> <label id="e_error_peso_total' + e_cantidad_mercancia + '"></label> </div> <div class="form-group col-xs-6"> <label>Unidades:</label> <input type="number" id="e_unidades' + e_cantidad_mercancia + '" placeholder="Unidades" class="form-control"> <label id="e_error_unidades' + e_cantidad_mercancia + '"></label> </div> </div> < div class="row"> <div class="form-group col-xs-6"> <label>Valor declarado:</label> <input type="number" id="e_valor_declarado' + e_cantidad_mercancia + '" placeholder="Valor declarado" class="form-control"> <label id="e_error_valor_declarado' + e_cantidad_mercancia + '"></label> </div> <div class="form-group col-xs-6"> <label>Tipo de movilización:</label> <select id="e_tipo_movilizacion' + e_cantidad_mercancia + '" class="form-control"> <option value="">Seleccione la movilización</option> <option value="EXPRESO">EXPRESO</option> <option value="CONSOLIDADO">CONSOLIDADO</option> </select> <label id="e_error_tipo_movilizacion' + e_cantidad_mercancia + '"></label> </div> </div> </div> ');
	});

	var currentdate = new Date();
	$("#btn_agregar_tramo").click(function () {
		cantidad_tramo += 1;
		$("#caja_adicionar_tramo").append('\n\
			<div class="panel panel-border panel-contrast " id="caja_tramo' + cantidad_tramo + '" > \
				<div class="panel-heading panel-heading-contrast" > <div class="tools"> <a href="#" class="cell-detail hint--top" onclick="removertramo(' + cantidad_tramo + ')" data-hint="Eliminar mercancía"><span class="icon mdi mdi-minus"></span></a> </div>\n\
					Sección de cargues-descargues #' + cantidad_tramo + ' \n\
					<span class="panel-subtitle"></span>\n\
				</div>\n\
				<div class="row" style="padding: 20px 20px 0 20px;" >\n\
				<div class="form-group col-xs-6">\n\
					<label>Tipo:</label>\n\
					<select id="tipo_tramo' + cantidad_tramo + '" class="form-control">\n\
						<option value="CARGUE">CARGUE</option>\n\
						<option value="DESCARGUE">DESCARGUE</option>\n\
					</select>\n\
					<label id="error_tipo_tramo"></label>\n\
				</div >\n\
				<div class="form-group col-xs-6">\n\
					<label>Remitente/Destinatario:</label>\n\
					<div id="caja_remitente' + cantidad_tramo + '"> \n\
						<input type="text" id="remitente_destinatario' + cantidad_tramo + '" placeholder="Remitente/Destinatario" class="typeahead form-control">\n\
					</div> \n\
					<input type="hidden" id="id_remitente_destinatario' + cantidad_tramo + '">\n\
					<label id="error_remitente_destinatario"></label>\n\
				</div> \n\
			</div> \n\
			<div class="row" style="padding: 0px 20px 0 20px;">\n\
				<div class="form-group col-xs-6">\n\
					<label>Dirección:</label>\n\
					<input type="text" id="direccion' + cantidad_tramo + '" placeholder="Dirección" class="form-control">\n\
					<label id="error_direccion"></label>\n\
				</div> \n\
				<div class="form-group col-xs-6">\n\
					<label>Contacto:</label>\n\
					<input type="text" id="contacto' + cantidad_tramo + '" placeholder="Contacto" class="form-control">\n\
					<label id="error_contacto"></label>\n\
				</div> \n\
			</div>\n\
			<div class="row" style="padding: 0px 20px 0 20px;">\n\
				<div class="form-group col-xs-6">\n\
					<label>Peso:</label>\n\
					<input type="text" id="peso_tramo' + cantidad_tramo + '" placeholder="Peso total" class="form-control">\n\
					<label id="error_peso_tramo"></label>\n\
				</div> \n\
				<div class="form-group col-xs-6">\n\
					<label>Unidades:</label>\n\
					<input type="text" id="unidades_tramo' + cantidad_tramo + '" placeholder="Unidades" class="form-control">\n\
					<label id="error_unidades_tramo"></label>\n\
				</div> \n\
			</div>\n\
			<div class="row" style="padding: 0px 20px 0 20px;">\n\
				<div class="form-group col-xs-6">\n\
					<label>Fecha Hora (AAAA-MM-DD HH:MM):</label>\n\
					<div data-date="" data-date-format="yyyy-mm-dd hh:ii" data-link-field="dtp_input1" class="input-group date datetimepicker">\n\
						<input size="16" type="text" value="" class="form-control" id="fecha_hora_tramo' + cantidad_tramo + '"><span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>\n\
					</div>\n\
					<label id="error_fecha_hora"></label>\n\
				</div>\n\
			</div>\n\
			<div class="row">\n\
				<div class="form-group col-xs-6">\n\
					<label>Valor de venta:</label>\n\
					<input type="text" id="valor_venta_tramo' + cantidad_tramo + '" placeholder="Valor de venta" class="form-control">\n\
					<label id="error_valor_venta"></label>\n\
				</div> \n\
				<div class="form-group col-xs-6">\n\
					<label>Valor de compra:</label>\n\
					<input type="text" id="valor_compra_tramo' + cantidad_tramo + '" placeholder="Valor de compra" class="form-control">\n\
					<label id="error_valor_compra"></label>\n\
				</div> \n\
			</div>\n\
			<div class="row" style="padding: 0px 20px 0 20px;">\n\
				<div class="form-group col-xs-6">\n\
					<div class="be-checkbox">\n\
						<input id="personal' + cantidad_tramo + '" type="checkbox">\n\
						<label for="personal' + cantidad_tramo + '">Se Necesita personal?</label>\n\
					</div>\n\
					<div class="be-checkbox">\n\
						<input id="sumaflete' + cantidad_tramo + '" type="checkbox">\n\
						<label for="sumaflete' + cantidad_tramo + '">Este valor se le suma al flete?</label>\n\
					</div>\n\
				</div> \n\
			</div>\n\
		');
		
		$('#caja_remitente' + cantidad_tramo + ' .typeahead').typeahead({
			minLength: 1
		},
		{
			name: 'states',
			source: substringMatcher(states)
		});
		$("#remitente_destinatario" + cantidad_tramo).focusout(function () {
			if ($.inArray($("#remitente_destinatario" + cantidad_tramo).val(), states) == (-1)) {
				$("#direccion" + cantidad_tramo).val("");
				$("#contacto" + cantidad_tramo).val("");
				$("#id_remitente_destinatario" + cantidad_tramo).val("");
			} else {}
		});
		$('#fecha_hora_tramo'+cantidad_tramo).data("datetimepicker");
		$('#fecha_hora_tramo'+cantidad_tramo).datetimepicker();

		$('#caja_remitente' + cantidad_tramo).bind('typeahead:selected', function (obj, datum, name, id) {
			var params = {
				accion: 'obtenerdatosremitente',
				nombre_remitente: datum,
				id_cliente: $("#cliente").val()
			};

			$.post(url, params, function (data) {
				// console.log(data);
				if (data.success) {
					$("#direccion" + cantidad_tramo).val(data.content.direccion);
					$("#contacto" + cantidad_tramo).val(data.content.contacto);
					$("#id_remitente_destinatario" + cantidad_tramo).val(data.content.id);
					$("#peso_tramo" + cantidad_tramo).focus();
				} else {
				}
			}, 'json');
		});
		// campospersonal();
	});
	
	$("#btn_e_agregar_tramo").click(function () {
		e_cantidad_tramo += 1;

		let id_ciudad = "";
		if ( $("#e_tipo_operacion").val() == "URBANO" ) {
			id_ciudad = $("#e_id_ciudad").val();
		}

		cargarmunicipios(e_cantidad_tramo, id_ciudad);

		$("#e_cant_tramos").val(e_cantidad_tramo);

		// Se crea la tabla con la lista de materiales de la solicitud
		htmleditarmercancia = '<table class=" table table-striped table-hover"> \n\
			<tbody> \n\
				<tr> \n\
					<td colspan= "4" style="padding:2px 5px;"></td><td colspan="1" class="cell-detail" style="text-align=center;padding:0px 5px;" > \n\
						<span class="cell-detail-description">Tipo de movilización \n\
							<span> \n\
								<span> \n\
									<div class="be-radio "> \n\
										<input type="radio" name="e_rad_t" id="e_expreso_total_' + e_cantidad_tramo + '"> \n\
										<label for="e_expreso_total_' + e_cantidad_tramo + '">Expreso</label> \n\
									</div> \n\
									<div class="be-radio "> \n\
										<input type="radio" name="e_rad_t" id="e_consolidado_total_' + e_cantidad_tramo + '"> \n\
										<label for="e_consolidado_total_' + e_cantidad_tramo + '">Consolidado</label> \n\
									</div> \n\
								</span> \n\
							</span>\n\
						</span>\n\
					</td>\n\
				</tr> \n\
		';

		for (let y = 0; y < lista_mercancia.length; y++) {
			htmleditarmercancia += '\n\
				<tr> \n\
					<td class="cell-detail" style="padding:0px 5px;" style="padding:0px 5px;"> \n\
						<span class="cell-detail-description">Material\n\
							<span> \n\
								<span> \n\
									<input type="text" id="e_tipo_mercancia_' + e_cantidad_tramo + '_' + (y + 1) + '" disabled value="' + lista_mercancia[y]["tipo_mercancia"] + '" placeholder="Tipo de mercancía" class="form-control input-xs"> \n\
									<input type="hidden" id="e_codigo_UN_' + e_cantidad_tramo + '_' + (y + 1) + '" disabled value="' + lista_mercancia[y]["codigo_UN"] + '" class="form-control input-xs"> \n\
									<input type="hidden" id="e_id_' + e_cantidad_tramo + '_' + (y + 1) + '" disabled value="' + lista_mercancia[y]["id"] + '" class="form-control input-xs"> \n\
									<input type="hidden" id="e_id_material_proyecto_' + e_cantidad_tramo + '_' + (y + 1) + '" disabled value="' + lista_mercancia[y]["id_material_proyecto"] + '" class="form-control input-xs"> \n\
								</span> \n\
							</span>\n\
						</span>\n\
					</td> \n\
					<td class="cell-detail" style="padding:0px 5px;"> \n\
						<span class="cell-detail-description">Valor declarado \n\
							<span> \n\
								<span> \n\
									<input type="number" id="e_valor_declarado_' + e_cantidad_tramo + '_' + (y + 1) + '" disabled value="' + lista_mercancia[y]["valor_declarado"] + '" placeholder="Valor declarado" class="form-control input-xs"> \n\
								</span> \n\
							</span>\n\
						</span>\n\
					</td> \n\
					<td class="cell-detail" style="padding:0px 5px;"> \n\
						<span class="cell-detail-description">Peso (Kg)\n\
							<span> \n\
								<span> \n\
									<input type="number" id="e_peso_total_' + e_cantidad_tramo + '_' + (y + 1) + '" disabled value="' + lista_mercancia[y]["peso_total"] + '" placeholder="Peso total" class="form-control input-xs"> \n\
								</span> \n\
							</span>\n\
						</span>\n\
					</td> \n\
					<td class="cell-detail" style="padding:0px 5px;"> \n\
						<span class="cell-detail-description">Unidades \n\
							<span> \n\
								<span> \n\
									<input type="number" id="e_unidades_' + e_cantidad_tramo + '_' + (y + 1) + '" min="0" max="' + lista_mercancia[y]["unidades"] + '" value="' + lista_mercancia[y]["unidades"] + '" placeholder="Unidades" class="form-control input-xs"> \n\
								</span> \n\
							</span>\n\
						</span>\n\
					</td> \n\
			';

			htmleditarmercancia += '\n\
				<td class="cell-detail" style="padding:0px 5px;" > \n\
					<span> \n\
						<div class="be-radio "> \n\
							<input type="radio" name="rad_' + e_cantidad_tramo + '_' + (y + 1) + '" id="e_expreso_' + e_cantidad_tramo + '_' + (y + 1) + '"\n\
			';

			if (lista_mercancia[y]["tipo_movilizacion"] == "EXPRESO") {
				htmleditarmercancia += " checked ";
			}
			htmleditarmercancia += '> \n\
					<label for="e_expreso_' + e_cantidad_tramo + '_' + (y + 1) + '">Expreso</label> \n\
				</div> \n\
				<div class="be-radio "> \n\
					<input type="radio" name="rad_' + e_cantidad_tramo + '_' + (y + 1) + '" id="e_consolidado_' + e_cantidad_tramo + '_' + (y + 1) + '"\n\
			';

			if (lista_mercancia[y]["tipo_movilizacion"] == "CONSOLIDADO") {
				htmleditarmercancia += " checked ";
			}
			htmleditarmercancia += '> \n\
								<label for="e_consolidado_' + e_cantidad_tramo + '_' + (y + 1) + '">Consolidado</label> \n\
							</div> \n\
						</span> \n\
					</span>\n\
				</span></td></tr>\n\
			';
			// Se calcula las unidades disponibles restantes 
			htmleditarmercancia += '\n\
				<script type="text/javascript">\n\
					calcula_unidades( ' + e_cantidad_tramo + ' , ' + (y + 1) + ' );\n\
				</script>\n\
			';
		}
		htmleditarmercancia += '</tbody> \n\
		</table>';

		// Se valida si el formulario debe mostrar el check de solicitud de urbano
		let style_check_urbano = "";
		if ( $("#e_tipo_operacion").val() == "URBANO" ) {
			style_check_urbano = ' style="display: none;" ';
		}

		$("#e_caja_adicionar_tramo").append('\n\
			<div class="panel panel-border panel-contrast " id="e_caja_tramo' + e_cantidad_tramo + '" > \
				<div class="panel-heading panel-heading-contrast" >\n\
					<div class="tools">\n\
						<a href="#" class="cell-detail hint--top" onclick="e_removertramo(' + e_cantidad_tramo + ')" data-hint="Eliminar mercancía"><span class="icon mdi mdi-minus"></span></a>\n\
					</div>\n\
					Sección de cargues-descargues #' + e_cantidad_tramo + ' \n\
					<span class="panel-subtitle"></span>\n\
				</div>\n\
				<div class="panel-body">\n\
					<div class="row">\n\
					</div>\n\
					<div class="col-xs-6">\n\
						<label>Tipo:</label>\n\
						<select id="e_tipo_tramo' + e_cantidad_tramo + '" class="form-control">\n\
							<option value="CARGUE" disabled>CARGUE</option>\n\
							<option value="DESCARGUE" selected>DESCARGUE</option>\n\
						</select>\n\
						<label id="e_error_tipo_tramo"></label>\n\
					</div> \n\
					<div class="col-xs-6">\n\
						<label>Remitente/Destinatario:</label>\n\
						<div id="e_caja_remitente' + e_cantidad_tramo + '" > \n\
							<input type="text" id="e_remitente_destinatario' + e_cantidad_tramo + '" placeholder="Remitente/Destinatario" class="typeahead form-control">\n\
						</div> \n\
						<input type="hidden" id="e_id_remitente_destinatario' + e_cantidad_tramo + '">\n\
						<label id="e_error_remitente_destinatario"></label>\n\
					</div> \n\
					<div class="col-xs-6">\n\
						<label>Dirección:</label>\n\
						<input type="text" id="e_direccion' + e_cantidad_tramo + '" placeholder="Dirección" class="form-control" readonly>\n\
						<label id="e_error_direccion"></label>\n\
					</div> \n\
					<div class="col-xs-6">\n\
						<label>Ciudad:</label>\n\
						<div id="e_caja_ciudades' + e_cantidad_tramo + '" > \n\
							<input type="text" id="e_ciudades' + e_cantidad_tramo + '" placeholder="Ciudad" class="typeahead form-control" disabled>\n\
						</div> \n\
						<input type="hidden" id="e_id_ciudades' + e_cantidad_tramo + '">\n\
						<label id="e_error_ciudades"></label>\n\
					</div> \n\
					<div class="col-xs-6">\n\
						<label>Contacto:</label>\n\
						<input type="text" id="e_contacto' + e_cantidad_tramo + '" placeholder="Contacto" class="form-control" readonly>\n\
						<label id="e_error_contacto"></label>\n\
					</div> \n\
					<div class="col-xs-6">\n\
						<label>Fecha Hora (AAAA-MM-DD HH:MM):</label>\n\
						<div data-date="" data-date-format="yyyy-mm-dd hh:ii" data-link-field="dtp_input1" class="input-group date datetimepicker">\n\
							<input size="16" type="text" value="" class="form-control" id="e_fecha_hora_operacion' + e_cantidad_tramo + '" placeholder="Fecha Hora Operación" readonly><span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>\n\
						</div>\n\
						<label id="e_error_fecha_hora"></label>\n\
					</div>\n\
					<div class="form-group col-xs-6" ' + style_check_urbano + '>\n\
						<div class="be-checkbox">\n\
							<input id="e_solicita_urbano' + e_cantidad_tramo + '" type="checkbox" class="form-control">\n\
							<label for="e_solicita_urbano' + e_cantidad_tramo + '">Solicitud urbano</label>\n\
						</div>\n\
					</div>\n\
					<div class="col-xs-6" id="e_caja_ciudad_urbano_destino' + e_cantidad_tramo + '"></div>\n\
					<div class="row"> </div>\n\
					<div class="col-xs-6">\n\
						<label>Valor de venta:</label>\n\
						<input type="text" id="e_valor_venta_tramo' + e_cantidad_tramo + '" placeholder="Valor de venta" class="form-control">\n\
						<label id="e_error_valor_venta"></label>\n\
					</div> \n\
					<div class="col-xs-6">\n\
						<label>Valor de compra:</label>\n\
						<input type="text" id="e_valor_compra_tramo' + e_cantidad_tramo + '" placeholder="Valor de compra" class="form-control">\n\
						<label id="e_error_valor_compra"></label>\n\
					</div> \n\
					<div class="col-xs-6">\n\
						<div class="be-checkbox">\n\
							<input id="e_personal' + e_cantidad_tramo + '" type="checkbox">\n\
							<label for="e_personal' + e_cantidad_tramo + '">Se Necesita personal?</label>\n\
						</div>\n\
						<div class="be-checkbox">\n\
							<input id="e_sumaflete' + e_cantidad_tramo + '" type="checkbox">\n\
							<label for="e_sumaflete' + e_cantidad_tramo + '">Este valor se le suma al flete?</label>\n\
						</div>\n\
					</div> \n\
					<div class="row">\n\
						<div class="col-xs-12">\n\
							' + htmleditarmercancia + '\n\
						</div>\n\
					</div>\n\
				</div>\n\
				</div>\n\
			</div>\n\
		');

		// console.log(states);

		$('#e_caja_remitente' + e_cantidad_tramo + ' .typeahead').typeahead({
			minLength: 1
		},
		{
			name: 'states',
			source: substringMatcher(states)
		});

		$("#e_remitente_destinatario" + e_cantidad_tramo).focusout(function () {
			if ($.inArray($("#e_remitente_destinatario" + e_cantidad_tramo).val(), states) == (-1)) {
				$("#e_direccion" + e_cantidad_tramo).val("");
				$("#e_contacto" + e_cantidad_tramo).val("");
				$("#e_ciudades" + e_cantidad_tramo).val("");
				$("#e_id_ciudades" + e_cantidad_tramo).val("");
				$("#e_id_remitente_destinatario" + e_cantidad_tramo).val("");
			} else {}
		});

		$('#e_caja_remitente' + e_cantidad_tramo).bind('typeahead:selected', function (obj, datum, name, id) {
			var params = {
				accion: 'obtenerdatosremitente',
				nombre_remitente: datum,
				id_cliente: $("#e_cliente").val()
			};

			$("#e_direccion" + e_cantidad_tramo).val("");
			$("#e_contacto" + e_cantidad_tramo).val("");
			$("#e_ciudades" + e_cantidad_tramo).val("");
			$("#e_id_ciudades" + e_cantidad_tramo).val("");
			$("#e_id_remitente_destinatario" + e_cantidad_tramo).val("");

			$("#e_solicita_urbano" + e_cantidad_tramo ).prop('checked', false);
			$("#e_caja_ciudad_urbano_destino" + e_cantidad_tramo ).html("");

			$.post(url, params, function (data) {
				// console.log(data);
				if (data.success) {
					$("#e_direccion" + e_cantidad_tramo).val(data.content.direccion);
					$("#e_contacto" + e_cantidad_tramo).val(data.content.contacto);
					$("#e_id_remitente_destinatario" + e_cantidad_tramo).val(data.content.id);
					$("#e_ciudades" + e_cantidad_tramo).val(data.content.CIUDAD);
					$("#e_id_ciudades" + e_cantidad_tramo).val(data.content.ID_CIUDAD);
					$("#e_peso_tramo" + e_cantidad_tramo).focus();
				} else {
					console.log("Error en consulta de remitente");
				}
			}, 'json');
		});

		// Funciones para funcionamiento del campo multiple de ciudades 
		$('#e_caja_ciudades' + e_cantidad_tramo + ' .typeahead').typeahead(
			{
				minLength: 1
			},
			{
				id: 'id',
				name: 'ciudades',
				source: substringMatcher(ciudades)
			}
		);
	
		$('#e_caja_ciudades' + e_cantidad_tramo).bind('typeahead:selected', function (obj, datum, name, id) {
			// console.log("Entro en funcion de blin e_caja_ciudades");

			// Se toma las datos de ciudad y departamento
			var info = datum.split(" - ");
			var ciudad = info[0];
			var arraydepartamento = info[1].split("(");
			var departamento = arraydepartamento[1];

			var params = {
				accion: 'obtenerdatosmunicipio',
				ciudad: ciudad,
				departamento: departamento
			};

			$("#e_id_ciudades" + e_cantidad_tramo).val("");

			$.post(url, params, function (data) {
				console.log(data);
				if (data.success) {
					$("#e_id_ciudades" + e_cantidad_tramo).val(data.content[0].id);
				} else {
					console.log("No realiza el ajax");
				}
			}, 'json');
		});

		$("#e_expreso_total_" + e_cantidad_tramo ).click(function () {
			if ($("#e_expreso_total_" + e_cantidad_tramo ).is(':checked')) {
				for (let y = 0; y < lista_mercancia.length; y++) {
					$("#e_expreso_" + e_cantidad_tramo + "_" + (y + 1)).prop("checked", true);
				}
			}
		});

		$("#e_consolidado_total_" + e_cantidad_tramo ).click(function () {
			if ($("#e_consolidado_total_"+e_cantidad_tramo).is(':checked')) {
				for (let y = 0; y < lista_mercancia.length; y++) {
					$("#e_consolidado_" + e_cantidad_tramo + "_" + (y + 1)).prop("checked", true);
				}
			}
		});

		// Funcion de agragacion de campo destino de urbano cuando se selecciona la solicitud de urbano 
		$("#e_solicita_urbano" + e_cantidad_tramo ).change(function () {
			$("#e_caja_ciudad_urbano_destino" + e_cantidad_tramo ).html("")
			if ($( "#e_solicita_urbano" + e_cantidad_tramo ).is(':checked')) {
				if ( $("#e_id_ciudades" + e_cantidad_tramo ).val() ) {
					// Se crea la lista de destinos para urbaneo disponibles 
					var params = {
						accion: "cargarremitente",
						id_cliente: $("#e_cliente").val(),
						id_ciudad: $("#e_id_ciudades" + e_cantidad_tramo).val()
					};
					$.ajaxSetup({async: false});
					$.post(url, params, function (data) {
						states_1 = [];
						if (data.success) {
							for (let x = 0; x < data.content.length; x++) {
								states_1.push(data.content[x]['nombre']);
							}
						} else {}
					}, 'json');
					$.ajaxSetup({async: true});

					$("#e_caja_ciudad_urbano_destino" + e_cantidad_tramo ).append('\n\
						<label>Destino Urbaneo:</label>\n\
						<div id="e_caja_destino_urbaneo' + e_cantidad_tramo + '" > \n\
							<input type="text" id="e_destinatario_urbaneo' + e_cantidad_tramo + '" placeholder="Remitente/Destinatario" class="typeahead form-control">\n\
						</div> \n\
						<input type="hidden" id="e_flag_destino_urbaneo' + e_cantidad_tramo + '">\n\
						<label id="e_error_remitente_destinatario"></label>\n\
					');
					$('#e_caja_destino_urbaneo' + e_cantidad_tramo + ' .typeahead').typeahead({
						minLength: 1
					},
					{
						name: 'states_1',
						source: substringMatcher(states_1),
					});
					$("#e_destinatario_urbaneo" + e_cantidad_tramo).focusout(function () {
						console.log($.inArray($("#e_destinatario_urbaneo" + e_cantidad_tramo).val(), states_1));
						$("#e_flag_destino_urbaneo" + e_cantidad_tramo).val( $.inArray($("#e_destinatario_urbaneo" + e_cantidad_tramo).val(), states_1) );
					});
				} else {
					$("#e_caja_ciudad_urbano_destino" + e_cantidad_tramo ).append('<p class="text-danger">Primero debe seleccionar el destino del tramo para seleccionar la bodega en el destino</p>')
				}
			}else{
				$("#e_caja_ciudad_urbano_destino" + e_cantidad_tramo ).append("")
			}
		});
		App.formElements();
	});

	$("#desconsolidacion1").click(function () {
		if ($("#desconsolidacion1").is(':checked')) {
			$("#caja_desconsolidacion1").css("display", "block");
		} else {
			$("#caja_desconsolidacion1").css("display", "none");
		}
	});

	$("#satelital1").click(function () {
		if ($("#satelital1").is(':checked')) {
			$("#caja_satelital1").css("display", "block");
		} else {
			$("#caja_satelital1").css("display", "none");
		}
	});

	$("#escoltas1").click(function () {
		if ($("#escoltas1").is(':checked')) {
			$("#caja_escoltas1").css("display", "block");
		} else {
			$("#caja_escoltas1").css("display", "none");
		}
	});

	$("#almacenamiento1").click(function () {
		if ($("#almacenamiento1").is(':checked')) {
			$("#caja_almacenamiento1").css("display", "block");
		} else {
			$("#caja_almacenamiento1").css("display", "none");
		}
	});

	$("#montacarga1").click(function () {
		if ($("#montacarga1").is(':checked')) {
			$("#caja_montacarga1").css("display", "block");
		} else {
			$("#caja_montacarga1").css("display", "none");
		}
	});

	$("#e_desconsolidacion1").click(function () {
		if ($("#e_desconsolidacion1").is(':checked')) {
			$("#e_caja_desconsolidacion1").css("display", "block");
		} else {
			$("#e_caja_desconsolidacion1").css("display", "none");
		}
	});

	$("#e_satelital1").click(function () {
		if ($("#e_satelital1").is(':checked')) {
			$("#e_caja_satelital1").css("display", "block");
		} else {
			$("#e_caja_satelital1").css("display", "none");
		}
	});

	$("#e_escoltas1").click(function () {
		if ($("#e_escoltas1").is(':checked')) {
			$("#e_caja_escoltas1").css("display", "block");
		} else {
			$("#e_caja_escoltas1").css("display", "none");
		}
	});

	$("#e_almacenamiento1").click(function () {
		if ($("#e_almacenamiento1").is(':checked')) {
			$("#e_caja_almacenamiento1").css("display", "block");
		} else {
			$("#e_caja_almacenamiento1").css("display", "none");
		}
	});

	$("#e_montacarga1").click(function () {
		if ($("#e_montacarga1").is(':checked')) {
			$("#e_caja_montacarga1").css("display", "block");
		} else {
			$("#e_caja_montacarga1").css("display", "none");
		}
	});

	$("#cliente").change(function () {
		var params = {
			accion: "cargarremitente",
			id_cliente: $("#cliente").val()
		};

		$.post(url, params, function (data) {
			states = [];
			if (data.success) {
				for (let x = 0; x < data.content.length; x++) {
					states.push(data.content[x]['nombre']);
				}
				console.log(cantidad_tramo);
				$('#caja_remitente1 .typeahead').typeahead({
					minLength: 1
				},
				{
					name: 'states',
					source: substringMatcher(states),
				});

				$("#remitente_destinatario1").focusout(function () {
					console.log($.inArray($("#remitente_destinatario1").val(), states));
					if ($.inArray($("#remitente_destinatario1").val(), states) == (-1)) {
						$("#direccion1").val("");
						$("#contacto1").val("");
						$("#id_remitente_destinatario1").val("");
					} else {}
				});

				$('#caja_remitente1').bind('typeahead:selected', function (obj, datum, name) {
					var params = {
						accion: 'obtenerdatosremitente',
						nombre_remitente: datum,
						id_cliente: $("#cliente").val()
					};

					$.post(url, params, function (data) {
						if (data.success) {
							$("#direccion1").val(data.content.direccion);
							$("#contacto1").val(data.content.contacto);
							$("#id_remitente_destinatario1").val(data.content.id);
							$("#peso_tramo1").focus();
						} else {
							$("#direccion1").val("");
							$("#contacto1").val("");
							$("#id_remitente_destinatario1").val("");
						}
					}, 'json');
				});
			} else {}
		}, 'json');
	});
});

var proveedores=[];
function cargarprovedores(){
	var params = {
		accion: "cargarprovedores",
	};

	proveedores=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				proveedores.push(data.content[x]['nombre']);
			}
			$('#e_caja_proveedor_desconsolidacion1 .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(proveedores),
			});

			$.ajaxSetup({async: false});
			$('#e_caja_proveedor_desconsolidacion1').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'obtenerdatosproveedor',
					numero_documento: datum.split(" - ")[0]
				};

				$.post(url, params, function (data) {
					console.log(data);
					if (data.success) {
						$("#e_id_proveedor_desconsolidacion1").val(data.content.id);
						// $("#btn_e_actualizar_solicitud2").focus();
					} else {
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});
			$("#e_proveedor_desconsolidacion1").focusout(function () {
				console.log($.inArray($("#e_proveedor_desconsolidacion1").val(), proveedores));
				if ($.inArray($("#e_proveedor_desconsolidacion1").val(), proveedores) == (-1)) {
					//$("#nombre_propietario").val("");
				} else {
				}
			});

			$('#e_caja_proveedor_almacenamiento1 .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(proveedores),
			});
			$.ajaxSetup({async: false});
			$('#e_caja_proveedor_almacenamiento1').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'obtenerdatosproveedor',
					numero_documento: datum.split(" - ")[0]
				};
				$.post(url, params, function (data) {
					console.log(data);
					if (data.success) {
						$("#e_id_proveedor_almacenamiento1").val(data.content.id);
						// $("#btn_e_actualizar_solicitud2").focus();
					} else {
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});
			$("#e_proveedor_almacenamiento1").focusout(function () {
				console.log($.inArray($("#e_proveedor_almacenamiento1").val(), proveedores));
				if ($.inArray($("#e_proveedor_almacenamiento1").val(), proveedores) == (-1)) {
					//$("#nombre_propietario").val("");
				} else {
				}
			});

			$('#e_caja_proveedor_satelital1 .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(proveedores),
			});
			$.ajaxSetup({async: false});

			$('#e_caja_proveedor_satelital1').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'obtenerdatosproveedor',
					numero_documento: datum.split(" - ")[0]
				};
				$.post(url, params, function (data) {
					console.log(data);
					if (data.success) {
						$("#e_id_proveedor_satelital1").val(data.content.id);
						// $("#btn_e_actualizar_solicitud2").focus();
					} else {
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});

			$("#e_proveedor_satelital1").focusout(function () {
				console.log($.inArray($("#e_proveedor_satelital1").val(), proveedores));
				if ($.inArray($("#e_proveedor_satelital1").val(), proveedores) == (-1)) {
					//$("#nombre_propietario").val("");
				} else {
				}
			});

			$('#e_caja_proveedor_escoltas1 .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(proveedores),
			});

			$.ajaxSetup({async: false});
			$('#e_caja_proveedor_escoltas1').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'obtenerdatosproveedor',
					numero_documento: datum.split(" - ")[0]
				};
				$.post(url, params, function (data) {
					console.log(data);
					if (data.success) {
						$("#e_id_proveedor_escoltas1").val(data.content.id);
						// $("#btn_e_actualizar_solicitud2").focus();
					} else {
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});

			$("#e_proveedor_escoltas1").focusout(function () {
				console.log($.inArray($("#e_proveedor_escoltas1").val(), proveedores));
				if ($.inArray($("#e_proveedor_escoltas1").val(), proveedores) == (-1)) {
					//$("#nombre_propietario").val("");
				} else {
				}
			});

			$('#e_caja_proveedor_montacarga1 .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(proveedores),
			});
			$.ajaxSetup({async: false});

			$('#e_caja_proveedor_montacarga1').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'obtenerdatosproveedor',
					numero_documento: datum.split(" - ")[0]
				};
				$.post(url, params, function (data) {
					console.log(data);
					if (data.success) {
						$("#e_id_proveedor_montacarga1").val(data.content.id);
						// $("#btn_e_actualizar_solicitud2").focus();
					} else {
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});

			$("#e_proveedor_montacarga1").focusout(function () {
				console.log($.inArray($("#e_proveedor_montacarga1").val(), proveedores));
				if ($.inArray($("#e_proveedor_montacarga1").val(), proveedores) == (-1)) {
					//$("#nombre_propietario").val("");
				} else {
				}
			});
		} else {
			console.log("hay un error en el ajax");
		}
	}, 'json');
	$.ajaxSetup({async: true}); 
}

var tipos_vehiculos=[];
function cargartiposvehiculos(){
	var params = {
		accion: "cargartiposvehiculos",
	};
	tipos_vehiculos=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				tipos_vehiculos.push(data.content[x]['nombre']);
			}
			$('#e_caja_tipo_vehiculo .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(tipos_vehiculos),
			});
			$.ajaxSetup({async: false});
			$('#e_caja_tipo_vehiculo').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'obtenerdatosvehiculos',
					nombre: datum
				};
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						var nombre = data.content.nombre;
						$("#e_id_tipo_vehiculo").val(data.content.id);
						$("#e_tipo_carroceria").focus();
					} else {
						$("#e_tipo_vehiculo").val("");
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});
			$("#e_tipo_vehiculo").focusout(function () {
				// console.log($.inArray($("#e_tipo_vehiculo").val(), tipos_vehiculos));
				if ($.inArray($("#e_tipo_vehiculo").val(), tipos_vehiculos) == (-1)) {
					//$("#nombre_propietario").val("");
				} else {}
			});
		} else {}
	}, 'json');
	$.ajaxSetup({async: true});
}

var tipos_carrocerias=[];
function cargartiposcarroceria(){
	var params = {
		accion: "cargartiposcarroceria",
	};
	tipos_carrocerias=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				tipos_carrocerias.push(data.content[x]['descripcion']);
			}
			$('#e_caja_tipo_carroceria .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(tipos_carrocerias),
			});
			$.ajaxSetup({async: false});
			$('#e_caja_tipo_carroceria').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'obtenerdatoscarroceria',
					nombre: datum
				};
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						var nombre = data.content.nombre;
						$("#e_id_tipo_carroceria").val(data.content.id);
						$("#e_fecha_hora_operacion1").focus();
					} else {
						$("#e_tipo_carroceria").val("");
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});
			$("#e_tipo_carroceria").focusout(function () {
				// console.log($.inArray($("#e_tipo_carroceria").val(), tipos_carrocerias));
				if ($.inArray($("#e_tipo_carroceria").val(), tipos_carrocerias) == (-1)) {
					//$("#nombre_propietario").val("");
				} else {}
			});
		} else {}
	}, 'json');
	$.ajaxSetup({async: true});
}

function cargarmunicipios(tramo, id_ciudad){
	if ( id_ciudad ) {
		var params = {
			accion: "cargarmunicipios",
			id_ciudad: id_ciudad
		};
	} else {
		var params = {
			accion: "cargarmunicipios",
		};
	}

	ciudades=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				ciudades.push(data.content[x]['MUNICIPIO']);
			}
			$('#e_ciudades' + tramo + ' .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(ciudades),
			});
		} else {
			console.log("Error en ejecución de ajax...");
		}
	}, 'json');
	$.ajaxSetup({async: true});
}

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

var url = $("#id_url_ajax").val() + "libs/solicitudes_ajax.php";
var states = [];

var cantidad_tramo = 1;
var cantidad_mercancia = 1;
function campospersonal() {
	for (let i = 1; i <= (cantidad_tramo + 1); i++) {
		$("#personal" + i).click(function () {
			if ($('#personal' + i).is(':checked')) {
				$("#caja_suma_flete" + i).css("display", 'block');
			} else {
				$("#caja_suma_flete" + i).css("display", 'none');
			}
		});
	}
}

let arraymercancia = [];
var num_pulsacionesmercancia;
function removermercancia(num_mercancia) {
 $("#caja_mercancia" + num_mercancia).css("display", "none");
 arraymercancia.push(num_mercancia);
 num_pulsacionesmercancia += 1;
}

let arraytramo = [];
var num_pulsacionestramo;
function removertramo(num_tramo) {
 $("#caja_tramo" + num_tramo).css("display", "none");
 arraytramo.push(num_tramo);
 num_pulsacionestramo += 1;
}

function crearSolicitud() {
 let tipo_operacion = $("#tipo_operacion").val();
 let mercancia = new Object();

 let num_errores = 0;
 for (let i = 1; i <= cantidad_mercancia; i++) {
 var existe = true;
 for (let j = 0; j <= arraymercancia.length; j++) {
 if (arraymercancia[j] == i) {
 existe = false;
 num_errores += 1;
 }

 }
 if (existe) {
 mercancia[(i - 1) - num_errores] = {tipo_mercancia: $("#tipo_mercancia" + i).val(),
 tara_contenedor: $("#tara_contenedor" + i).val(),
 peso_total: $("#peso_total" + i).val(),
 unidades: $("#unidades" + i).val(),
 valor_declarado: $("#valor_declarado" + i).val(),
 tipo_movilizacion: $("#tipo_movilizacion" + i).val()
 }
 }
 }
 let tramos = new Object();
 let num_errores_tramos = 0;
 for (let i = 1; i <= cantidad_tramo; i++) {
 let existe_tramo = true;
 for (let j = 0; j <= arraytramo.length; j++) {
 if (arraytramo[j] == i) {
 existe_tramo = false;
 num_errores_tramos += 1;
 }

 }
 if (existe_tramo) {
 tramos[(i - 1) - num_errores_tramos] = {tipo_tramo: $("#tipo_tramo" + i).val(),
 id_remitente_destinatario: $("#id_remitente_destinatario" + i).val(),
 remitente_destinatario: $("#remitente_destinatario" + i).val(),
 direccion: $("#direccion" + i).val(),
 contacto: $("#contacto" + i).val(),
 peso_tramo: $("#peso_tramo" + i).val(),
 unidades_tramo: $("#unidades_tramo" + i).val(),
 fecha_hora_tramo: $("#fecha_hora_tramo" + i).val(),
 valor_venta_tramo: $("#valor_venta_tramo" + i).val(),
 valor_compra_tramo: $("#valor_compra_tramo" + i).val(),
 personal: $("#personal" + i).is(':checked'),
 sumaflete: $("#sumaflete" + i).is(':checked')
 }

 }
 }
 let adicionales = new Object();
 adicionales[0] = {tipo_servicio: "Transporte",
 valor_venta: $("#valor_venta").val(),
 valor_compra: $("#valor_compra").val()
 };
 var num_adicionales = 1;
 if ($('#desconsolidacion1').is(':checked')) {
 adicionales[num_adicionales] = {tipo_servicio: "Desconsolidacion",
 valor_venta: $("#valor_venta_desconsolidacion1").val(),
 valor_compra: $("#valor_compra_desconsolidacion1").val()
 }
 num_adicionales += 1;
 }
 if ($('#satelital1').is(':checked')) {
 adicionales[num_adicionales] = {tipo_servicio: "Satelital",
 valor_venta: $("#valor_venta_satelital1").val(),
 valor_compra: $("#valor_compra_satelital1").val()
 }
 num_adicionales += 1;
 }
 if ($('#escoltas1').is(':checked')) {
 adicionales[num_adicionales] = {tipo_servicio: "Escoltas",
 valor_venta: $("#valor_venta_escoltas1").val(),
 valor_compra: $("#valor_compra_escoltas1").val()
 }
 num_adicionales += 1;
 }
 if ($('#almacenamiento1').is(':checked')) {
 adicionales[num_adicionales] = {tipo_servicio: "Almacenamiento",
 valor_venta: $("#valor_venta_almacenamiento1").val(),
 valor_compra: $("#valor_compra_almacenamiento1").val()
 }
 num_adicionales += 1;
 }
 if ($('#montacarga1').is(':checked')) {
 adicionales[num_adicionales] = {tipo_servicio: "Montacarga",
 valor_venta: $("#valor_venta_montacarga1").val(),
 valor_compra: $("#valor_compra_montacarga1").val()
 }
 num_adicionales += 1;
 }
 console.log(tramos);

 if (tipo_operacion == "IMPORTACION") {
 var params = {
 accion: 'crearSolicitud',
 cliente: $("#cliente").val(),
 origen: $("#origen").val(),
 destino: $("#destino").val(),
 tipo_operacion: $("#tipo_operacion").val(),
 tipo_vehiculo: $("#tipo_vehiculo").val(),
 orden_compra: $("#orden_compra").val(),
 num_bl: $("#num_bl").val(),
 mercancia: mercancia,
 tramos: tramos,
 adicionales: adicionales
 };
 } else if (tipo_operacion == "EXPORTACION") {
 var params = {
 accion: 'crearSolicitud',
 cliente: $("#cliente").val(),
 origen: $("#origen").val(),
 destino: $("#destino").val(),
 tipo_operacion: $("#tipo_operacion").val(),
 tipo_vehiculo: $("#tipo_vehiculo").val(),
 orden_compra: $("#orden_compra").val(),
 num_bl: "",
 mercancia: mercancia,
 tramos: tramos,
 adicionales: adicionales
 };
 } else {
 var params = {
 accion: 'crearSolicitud',
 cliente: $("#cliente").val(),
 origen: $("#origen").val(),
 destino: $("#destino").val(),
 tipo_operacion: $("#tipo_operacion").val(),
 tipo_vehiculo: $("#tipo_vehiculo").val(),
 orden_compra: $("#orden_compra").val(),
 num_bl: "",
 mercancia: mercancia,
 tramos: tramos,
 adicionales: adicionales
 };
 }
 $.post(url, params, function (data) {
 if (data.success) {
 $("#btn_agregar_solicitud").attr("data-dismiss", "modal");
 location.reload();
 } else {
 $("#btn_agregar_solicitud").removeAttr("data-dismiss");
 }
 }, 'json');
}

function listarSolicitudes() {
	var params = {
		accion: 'listarSolicitudes',
	};
	//window.location="../../../principal/libs/solicitudes_ajax.php";
	$.post(url, params, function (data) {
		//$("#tabla_solicitudes").html("");
	}, 'json');
}

function verdatossolicitud(id_solicitud) {
	var params = {
		accion: 'verdatossolicitud',
		id_solicitud: id_solicitud
	};
	$.post(url, params, function (data) {
		console.log(data);
		if (data.success) {
			let tipo_operacion = data.content["tipo_operacion"];
			if (tipo_operacion == "") {
				$("#v_caja_tipo_operacion").html("");
				$("#v_caja_tipo_operacion").css("display", "none");
			} else if (tipo_operacion == "IMPORTACION") {
				$("#v_caja_tipo_operacion").html("");
				$("#v_caja_tipo_operacion").html('<div class="row"><div class="form-group col-xs-6"><label>Orden de compra:</label><input type="text" id="v_orden_compra" value= "' + data.content["numero_orden"] + '" placeholder="Orden de compra" class="form-control"><label id="error_orden_compra"></label></div></div><div class="row" style="padding: 0 20px 20px 20px;"><div class="form-group col-xs-6"><label>No de BL:</label><input type="text" id="v_num_bl" value="' + data.content["numero_bl"] + '" placeholder="No de BL" class="form-control"></div></div>');
				$("#v_caja_tipo_operacion").css("display", "block");
			} else if (tipo_operacion == "EXPORTACION") {
				$("#v_caja_tipo_operacion").html("");
				$("#v_caja_tipo_operacion").html('<div class="row"><div class="form-group col-xs-6"><label>Orden de compra:</label><input type="text" id="v_orden_compra" value= "' + data.content["numero_orden"] + '" placeholder="Orden de compra" class="form-control"><label id="error_orden_compra"></label></div></div>');
				$("#v_caja_tipo_operacion").css("display", "block");
			} else if (tipo_operacion == "NACIONAL") {
				$("#v_caja_tipo_operacion").html("");
				$("#v_caja_tipo_operacion").html('<div class="row"><div class="form-group col-xs-6"><label>Orden de compra:</label><input type="text" id="v_orden_compra" value= "' + data.content["numero_orden"] + '" placeholder="Orden de compra" class="form-control"><label id="error_orden_compra"></label></div></div> ');
				$("#v_caja_tipo_operacion").css("display", "block");
			} else if (tipo_operacion == "URBANO") {
				$("#v_caja_tipo_operacion").html("");
				$("#v_caja_tipo_operacion").html('<div class="row"><div class="form-group col-xs-6"><label>Orden de compra:</label><input "type="text" id="v_orden_compra" value= "' + data.content["numero_orden"] + '" placeholder="Orden de compra" class="form-control"><label id="error_orden_compra"></label></div></div> ');
				$("#v_caja_tipo_operacion").css("display", "block");
			}
			$("#v_num_solicitud").html("Solicitud # " + data.content["numero_solicitud"])
			$("#v_cliente").val(data.content["nombre_cliente"]);
			$("#v_tipo_operacion").val(data.content["tipo_operacion"]);
			$("#v_tara_contenedor").val(data.content["tara_contenedor"]);
			$("#v_origen").val(data.content["origen"]);
			$("#v_destino").val(data.content["destino"]);
			$("#v_usuario").val(data.content["nombre_usuario"]);
			$("#v_estado").val(data.content["estado"]);
			$("#v_tipo_vehiculo").val(data.content["tipo_vehiculo"]);
			if (data.totalmercancia > 0) {
				var e_contenido_mercancia = '\n\
					<table class=" table table-striped table-hover"> \n\
						<tbody> \n\
				';

				$("#v_caja_adicionar_mercancia").html("");
				for (let x = 0; x < data.mercancia.length; x++) {
					e_contenido_mercancia += '\n\
						<tr> \n\
							<td class="cell-detail"> \n\
								<span class="cell-detail-description">Material\n\
									<span> \n\
										<span> \n\
											<input type="text" id="v_tipo_mercancia' + (x + 1) + '" disabled value="' + data.mercancia[x]["tipo_mercancia"] + '" placeholder="Tipo de mercancía" class="form-control input-xs"> \n\
										</span> \n\
									</span>\n\
								</span>\n\
							</td> \n\
							<td class="cell-detail"> \n\
								<span class="cell-detail-description">Peso (Kg)\n\
									<span> \n\
										<span> \n\
											<input type="number" id="v_peso_total' + (x + 1) + '" disabled value="' + data.mercancia[x]["peso_total"] + '" placeholder="Peso total" class="form-control input-xs"> \n\
										</span> \n\
									</span>\n\
								</span>\n\
							</td> \n\
							<td class="cell-detail"> \n\
								<span class="cell-detail-description">Unidades\n\
									<span> \n\
										<span> \n\
											<input type="number" id="v_unidades' + (x + 1) + '" disabled value="' + data.mercancia[x]["unidades"] + '" placeholder="Unidades" class="form-control input-xs"> \n\
										</span> \n\
									</span>\n\
								</span>\n\
							</td> \n\
							<td class="cell-detail"> \n\
								<span class="cell-detail-description">Valor declarado\n\
									<span> \n\
										<span> \n\
											<input type="number" id="v_valor_declarado' + (x + 1) + '" disabled value="' + data.mercancia[x]["valor_declarado"] + '" placeholder="Valor declarado" class="form-control input-xs"> \n\
										</span> \n\
									</span>\n\
								</span>\n\
							</td> \n\
							<td class="cell-detail"> \n\
								<span class="cell-detail-description">Tipo de movilización\n\
									<span> \n\
										<span> \n\
											<input type="text" id="v_tipo_movilizacion' + (x + 1) + '" disabled value="' + data.mercancia[x]["tipo_movilizacion"] + '" placeholder="Tipo de movilización" class="form-control input-xs"> \n\
										</span> \n\
									</span>\n\
								</span>\n\
							</td>\n\
						</tr>\n\
					';
				}
				e_contenido_mercancia += '</tbody> \n\
					</table>';
				$("#v_caja_adicionar_mercancia").append(e_contenido_mercancia);
			}
			if (data.totaltramo > 0) {
				$("#v_caja_adicionar_tramo").html("");
				let contenido = '';
				for (let x = 0; x < data.tramos.length; x++) {
					contenido = '';
					contenido = '\n\
						<div class="panel panel-border panel-contrast " id="caja_tramo' + (x + 1) + '" > \
							<div class="panel-heading panel-heading-contrast" > \n\
								Sección de cargues-descargues #' + (x + 1) + ' \n\
								<span class="panel-subtitle"></span>\n\
							</div>\n\
							<div class="row" style="padding: 20px 20px 0 20px;" >\n\
								<div class="form-group col-xs-6">\n\
									<label>Tipo:</label>\n\
									<input id="v_tipo_tramo' + (x + 1) + '" value = "' + data.tramos[x]["tipo_operacion"] + '"class="form-control">\n\
									<label id="v_error_tipo_tramo"></label>\n\
								</div>\n\
								<div class="form-group col-xs-6">\n\
									<label>Remitente/Destinatario:</label>\n\
									<input type="text" id="v_remitente_destinatario' + (x + 1) + '" value= "' + data.tramos[x]["nombre_r_d"] + '" placeholder="Remitente/Destinatario" class="form-control">\n\
									<label id="v_error_remitente_destinatario"></label>\n\
								</div> \n\
							</div> \n\
							<div class="row" style="padding: 0px 20px 0 20px;">\n\
								<div class="form-group col-xs-6">\n\
									<label>Dirección:</label>\n\
									<input type="text" id="v_direccion' + (x + 1) + '" value= "' + data.tramos[x]["direccion"] + '" placeholder="Dirección" class="form-control">\n\
									<label id="v_error_direccion"></label>\n\
								</div> \n\
								<div class="form-group col-xs-6">\n\
									<label>Contacto:</label>\n\
									<input type="text" id="v_contacto' + (x + 1) + '" value= "' + data.tramos[x]["contacto"] + '" placeholder="Contacto" class="form-control">\n\
									<label id="v_error_contacto"></label>\n\
								</div> \n\
							</div>\n\
							<div class="row" style="padding: 0px 20px 0 20px;">\n\
								<div class="form-group col-xs-6">\n\
									<label>Peso:</label>\n\
									<input type="text" id="v_peso_tramo' + (x + 1) + '" value= "' + data.tramos[x]["peso"] + '" placeholder="Peso total" class="form-control">\n\
									<label id="v_error_peso_tramo"></label>\n\
								</div> \n\
								<div class="form-group col-xs-6">\n\
									<label>Unidades:</label>\n\
									<input type="text" id="v_unidades_tramo' + (x + 1) + '" value= "' + data.tramos[x]["unidades"] + '" placeholder="Unidades" class="form-control">\n\
									<label id="v_error_unidades_tramo"></label>\n\
								</div> \n\
							</div>\n\
							<div class="row" style="padding: 0px 20px 0 20px;">\n\
								<div class="form-group col-xs-6">\n\
									<label>Fecha Hora (AAAA-MM-DD HH:MM):</label>\n\
									<div data-date="" data-date-format="yyyy-mm-dd hh:ii" data-link-field="dtp_input1" class="input-group date datetimepicker"> \n\
										<input type="text" id="v_fecha_hora_operacion' + (x + 1) + '" value= "' + data.tramos[x]["fecha_hora_operacion"] + '" placeholder="Fecha Hora Operación" class="form-control">\n\
										<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span> \n\
									</div> \n\
									<label id="error_fecha_hora"></label>\n\
								</div>\n\
							</div>\n\
							<div class="row">\n\
								<div class="form-group col-xs-6">\n\
									<label>Valor de venta:</label>\n\
									<input type="text" id="v_valor_venta_tramo' + (x + 1) + '" value= "' + data.tramos[x]["valor_venta"] + '" placeholder="Valor de venta" class="form-control">\n\
									<label id="error_valor_venta"></label>\n\
								</div> \n\
								<div class="form-group col-xs-6">\n\
									<label>Valor de compra:</label>\n\
									<input type="text" id="v_valor_compra_tramo' + (x + 1) + '" value= "' + data.tramos[x]["valor_compra"] + '" placeholder="Valor de compra" class="form-control">\n\
									<label id="error_valor_compra"></label>\n\
								</div> \n\
							</div>\n\
							<div class="row" style="padding: 0px 20px 0 20px;">\n\
								<div class="form-group col-xs-6">\n\
									<div class="be-checkbox">\n\
										<input id="v_personal' + (x + 1) + '" type="checkbox"';
										if (data.tramos[x]["personal"] == "1") {
											contenido += " checked ";
										}
										contenido += '>\n\
										<label for="personal' + (x + 1) + '">Se Necesita personal?</label>\n\
									</div>\n\
								<div class="be-checkbox">\n\
									<input id="v_sumaflete' + (x + 1) + '" type="checkbox" ';
									if (data.tramos[x]["suma_flete"] == "1") {
										contenido += " checked ";
									}
									contenido += '>\n\
									<label for="sumaflete' + (x + 1) + '">Este valor se le suma al flete?</label>\n\
								</div>\n\
							</div> \n\
						</div>\n\
					';
					$("#v_caja_adicionar_tramo").append(contenido);
				}
			}
			if (data.totaladicionales) {
				$("#v_caja_servicios_adicionales").html("");
				let contenido_adicionales = '';
				for (let x = 0; x < data.adicionales.length; x++) {
					contenido_adicionales = '';
					if (data.adicionales[x]["tipo_servicio"] != "Transporte") {
						contenido_adicionales = '\n\
							<div class="row" style="padding: 0 20px 20px 20px;"> \
								<div class="col-xs-3"> \n\
									<div class="row"> \n\
										<div class=" form-group col-xs-12"> \n\
											<div class="be-checkbox "> \n\
												<input id="v_' + data.adicionales[x]["tipo_servicio"] + '1" type="checkbox" checked> \n\
												<label for="v_' + data.adicionales[x]["tipo_servicio"] + '1">' + data.adicionales[x]["tipo_servicio"] + '</label> \n\
											</div> \n\
										</div> \n\
									</div> \n\
								</div> \n\
								<div class="col-xs-9" id="v_caja_' + data.adicionales[x]["tipo_servicio"] + '1" > \n\
									<div class="row"> \n\
										<div class="form-group col-xs-4"> \n\
											<label>Valor de venta:</label> \n\
											<input type="text" id="v_valor_venta_' + data.adicionales[x]["tipo_servicio"] + '1" placeholder="Valor de venta" value="' + data.adicionales[x]["valor_venta"] + '" class="form-control input-xs"> \n\
										</div> \n\
										<div class="form-group col-xs-4"> \n\
											<label>Valor de compra:</label> \n\
											<input type="text" id="v_valor_compra_' + data.adicionales[x]["tipo_servicio"] + '1" placeholder="Valor de compra" value="' + data.adicionales[x]["valor_compra"] + '" class="form-control input-xs"> \n\
										</div> \n\
									</div> \n\
								</div> \n\
							</div>\n\
						';
						$("#v_caja_servicios_adicionales").append(contenido_adicionales);
					} else if (data.adicionales[x]["tipo_servicio"] == "Transporte") {
						$("#v_valor_venta").val(data.adicionales[x]["valor_venta"]);
						$("#v_valor_compra").val(data.adicionales[x]["valor_compra"]);
					}
				}
			}
		} else {
			alert("error");
		}
	}, 'json');
}

let e_arraymercancia = [];
let e_cantidad_mercancia;
function e_removermercancia(num_mercancia) {
	$("#e_caja_mercancia" + num_mercancia).css("display", "none");
	e_arraymercancia.push(num_mercancia);
	//num_pulsacionesmercancia+=1;
}

let e_arraytramo = [];
var e_cantidad_tramo;
function e_removertramo(num_tramo) {
	console.log(num_tramo);
	$("#e_caja_tramo" + num_tramo).css("display", "none");
	e_arraytramo.push(num_tramo);
	console.log(e_arraytramo);
}

let lista_mercancia = "";
var solicitud = "";
var lista_proveedores;
function editardatossolicitud(id_solicitud) {
	$("#errores_solicitud").html("");
	var msg_error = "";
	if (solicitud != id_solicitud) {
		solicitud = id_solicitud;

		var lista_materiales;
		var lista_tramos;
		var lista_serv_adicionales;

		$("#ver_detalle").prop("checked", false);
		$("#e_encabezado_content").html("");
		$("#e_materiales_content").html("");
		$("#accordion_content").html("");

		var params = {
			accion: 'verdatossolicitud',
			id_solicitud: id_solicitud
		};
		// console.log(params);
		$.ajaxSetup({async: false});
		$.ajax({
			url: url,
			type: 'POST',
			data: params,
			cache: false,
			dataType: 'json',
			beforeSend	: function(jqXHR, settings){
				$(".nexos-messages").html('<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' + $("#id_url_ajax").val() + 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>');
			},
			error: function (jqXHR, textStatus, errorThrown){
				$(".nexos-messages").html('');
				msg_error+= "<p>" + jqXHR.responseText + "</p>";
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			},
			success: function (data, textStatus, jqXHR){
				$(".nexos-messages").html('');
				// console.log(data);

				var info = data.info_general;
				var contrato = data.contrato;
				var material = data.material;
				var tramos = data.contrato.tramos;
				var serv_adicionales = data.serv_adicionales;
				var proveedores = data.proveedores.content;
				var tipos_carroceria = data.tipos_carroceria.content;
				var tipos_vehiculo = data.tipos_vehiculo.content;
				if (contrato.tipos_vehiculo.rowsData.length > 0) {
					tipos_vehiculo = contrato.tipos_vehiculo.rowsData;
				}

				lista_proveedores = proveedores;
				lista_materiales = material;
				lista_tramos = tramos;
				lista_serv_adicionales = serv_adicionales;
				
				// Se pregunta la información para determinar el valor de venta del proyecto
				let cant_viajes = 1;
				if (contrato.condiciones.rowsData) {
					contrato.condiciones.rowsData.forEach(function(element, index){
						if(element.id_condicion == 1){
							cant_viajes = element.descripcion;
							return false;
						}
					});
				}
				let valores_contrato = {
					tipo_contrato: contrato.info.tipo_contrato,
					valor_contrato: contrato.info.valor,
					porcentaje_ganancia: contrato.info.porcentaje_ganancia,
					cant_viajes: cant_viajes
				}
				// Fin - Se pregunta la información para determinar el valor de venta del proyecto

				/***** Se llena el contenido del popup *****/
				$("#e_num_solicitud").html(`Editar Solicitud - ${info.numero_solicitud}`);
				$("#e_encabezado_content").html( formEditaSolicitudEncabezado(info, contrato) );
				$("#e_encabezado_content").hide();
				$("#e_materiales_content").html( formEditaSolicitudMaterial(material.rowsData) );
				$("#accordion_content").html( formDatosGenerales(tipos_vehiculo, tipos_carroceria, valores_contrato) + formEditaSolicitudOrigenes(tramos) + formEditaSolicitudDestinos(tramos) + formEditaAdicionales(serv_adicionales, proveedores, "accordion_content", "general") );
				$(".servicio_especial_content").hide();
				/***** Fin - Se llena el contenido del popup *****/
				App.formElements();
			}
		});
		$.ajaxSetup({async: true});
	}
	if (msg_error) {
		$("#errores_solicitud").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
		$("#editar_solicitud").animate({ scrollTop: 0 }, 600);
	}

	$(".slct_remi_dest_origenes").change(function(){
		$("#materiales_origen").empty();

		// Se reinicia el contenido de la columna de unidades disponibles de carga de la tabla de materiales
		$(".material").each(function(){
			let id_material = $(this).data("id");
			$("#unidades_carga_" + id_material ).text( $(this).data("unidades") ).attr("class", "unidades_carga_disponibles_" + id_material );
		});

		let flag = true;
		var param_tipo_tramo = "carga";
		var total_materiales = $("#total_material");
		let panel = $(this).parents("#panel_origenes");
		let remi_dest = panel.find(".slct_remi_dest_origenes");
		remi_dest.each(function(){
			if (!$(this).val()) {
				flag = false;
			}
		});

		// Se valida el semáforo de que todos los origenes están diligenciados
		panel.attr("class", "panel panel-border panel-contrast panel-border-color");
		if (flag) {
			panel.attr("class", "panel panel-border panel-contrast panel-border-color panel-border-color-warning");

			// Se crea la lista de materiales por remitente destinatario para editar las cargas del material
			let lista_material_content = `<div id="accordion_carga" class="panel-group accordion">`;
			remi_dest.each(function(){
				let id_ciudad = $(this).data("id_ciudad");
				$(this).val().forEach(function(tramo, index){
					let indice = lista_tramos.remi_dest[id_ciudad].findIndex(fnd_tramo => fnd_tramo.id === tramo);
					let info_tramo = lista_tramos.remi_dest[id_ciudad][indice];
					lista_material_content+= listarMaterialesTramo(info_tramo, lista_materiales.rowsData, param_tipo_tramo, lista_serv_adicionales, lista_proveedores);
				});
			});
			lista_material_content+= `</div>`;

			$("#materiales_origen").html( lista_material_content );
			App.formElements();

			// Función para calcular y totalizar las unidades y peso del material a enviar por tramo 
			$(".unidades_material_" + param_tipo_tramo).blur(function(){
				let panel_material = $(this).parents(".panel_material");
				let unidades = panel_material.find(".unidades_material_" + param_tipo_tramo);
				let flag_panel_material = true;

				// Se suman las cantidades de material a mover
				let total_unidades = 0;
				let total_peso = 0;
				unidades.each(function(){
					let cantidad = 0
					if ($(this).val()) {
						cantidad = $(this).val();
					}
					total_unidades+= parseInt( cantidad );

					// Se busca el el material a modificar
					let id_material = $(this).data("id");
					let tipo_tramo = $(this).data("tipo_tramo");
					let material = "#info_material_" + id_material;
					let unidades_material = ".unidades_material_" + id_material;
					let unidades_disponibles = ".unidades_" + tipo_tramo + "_disponibles_" + id_material;
					let peso_disponible = ".peso_" + tipo_tramo + "_disponible_" + id_material;
					let unidades_disponibles_color = "#unidades_" + tipo_tramo + "_" + id_material;

					// Se resta la cantidad solicitada de material del total disponible
					let cantidad_solicitada_material = 0;
					panel.find(unidades_material).each(function(){
						if ( $(this).val() ) {
							cantidad_solicitada_material+= parseInt( $(this).val() );
						}
					});
					let cant_disponible = parseInt( $(material).data("unidades") ) - cantidad_solicitada_material;

					// Se calcula el peso disponible del material
					let text_peso_pendiente = parseFloat(0);
					if (cant_disponible > 0) {
						text_peso_pendiente = (cant_disponible * $(material).data("peso_total")) / $(material).data("unidades");
					}
					$(peso_disponible).attr("data-peso_pendiente", text_peso_pendiente).text(new Intl.NumberFormat("de-DE").format(text_peso_pendiente) + " Kg.");

					// Se calcula el peso del tramo
					let peso_solicitado = 0;
					if ($(this).val() && cant_disponible >= 0 ) {
						peso_solicitado = (cantidad * $(material).data("peso_total")) / $(material).data("unidades");
					}
					total_peso+= peso_solicitado;

					// Se valida el color del texto de las unidades disponibles 
					$(unidades_disponibles_color).attr("class", "unidades_" + tipo_tramo + "_disponibles unidades_" + tipo_tramo + "_disponibles_" + id_material);
					if (cant_disponible == 0) {
						$(unidades_disponibles_color).attr("class", "text-success unidades_" + tipo_tramo + "_disponibles unidades_" + tipo_tramo + "_disponibles_" + id_material);
					}
					if (cant_disponible < 0) {
						$(unidades_disponibles_color).attr("class", "text-danger unidades_" + tipo_tramo + "_disponibles unidades_" + tipo_tramo + "_disponibles_" + id_material);
						if ($(this).val()) {
							flag_panel_material = false;
						}
					}
					$(unidades_disponibles).text(cant_disponible);
				});
				panel_material.find(".total_unidades_tramo").text(total_unidades);
				panel_material.find(".total_peso_tramo").data("peso_tramo", total_peso).text(new Intl.NumberFormat("de-DE").format(total_peso) + " Kg.");

				// Se cambia el color del panel según el resultado
				panel_material.attr("class","panel panel-default panel-border-color panel-border-color-default panel_material");
				if (total_unidades > 0) {
					panel_material.attr("class","panel panel-default panel-border-color panel-border-color-success panel_material");
				}
				if (!flag_panel_material) {
					panel_material.attr("class","panel panel-default panel-border-color panel-border-color-danger panel_material");
				}

				// Se valida el color del semáforo del contenedor de los origenes
				let unidades_solicitadas = 0;
				let flag_solicitado = true;
				panel.find(".total_unidades_tramo").each(function(){
					unidades_solicitadas+= parseInt( $(this).text() );
					if ($(this).text() == 0) {
						flag_solicitado = false;
					}
				});

				panel.attr("class", "panel panel-border panel-contrast panel-border-color panel-border-color-warning");
				if (!flag_solicitado) {
					if (total_materiales.data("total_unidades") == unidades_solicitadas) {
						panel.attr("class", "panel panel-border panel-contrast panel-border-color panel-border-color-danger");
					}
				} else if (total_materiales.data("total_unidades") == unidades_solicitadas) {
					panel.attr("class", "panel panel-border panel-contrast panel-border-color panel-border-color-success");
				}
			});

			// Función para generar los servicios adicionales del tramo de origen
			$(".slct_serv_adicional_" + param_tipo_tramo).change(function(){

				let element = $(this);
				let panel = element.parents(".panel-body");
				formServiciosAdicionales(element, panel)
			});
		}
	});

	$(".slct_remi_dest_destinos").change(function(){
		$("#materiales_destino").empty();

		// Se reinicia el contenido de la columna de unidades disponibles de carga de la tabla de materiales
		$(".material").each(function(){
			let id_material = $(this).data("id");
			$("#unidades_descarga_" + id_material ).text( $(this).data("unidades") ).attr("class", "unidades_descarga_disponibles_" + id_material );
		});

		let flag = true;
		var param_tipo_tramo = "descarga";
		var total_materiales = $("#total_material");
		let panel = $(this).parents("#panel_destinos");
		let remi_dest = panel.find(".slct_remi_dest_destinos");
		remi_dest.each(function(){
			if (!$(this).val()) {
				flag = false;
			}
		});

		// Se valida el semáforo de que todos los origenes están diligenciados
		panel.attr("class", "panel panel-border panel-contrast panel-border-color");
		if (flag) {
			panel.attr("class", "panel panel-border panel-contrast panel-border-color panel-border-color-warning");

			// Se crea la lista de materiales por remitente destinatario para editar las cargas del material
			let lista_material_content = `<div id="accordion_descarga" class="panel-group accordion">`;
			remi_dest.each(function(){
				let id_ciudad = $(this).data("id_ciudad");
				$(this).val().forEach(function(tramo, index){
					let indice = lista_tramos.remi_dest[id_ciudad].findIndex(fnd_tramo => fnd_tramo.id === tramo);
					let info_tramo = lista_tramos.remi_dest[id_ciudad][indice];
					lista_material_content+= listarMaterialesTramo(info_tramo, lista_materiales.rowsData, param_tipo_tramo, lista_serv_adicionales, lista_proveedores);
				});
			});
			lista_material_content+= `</div>`;
			$("#materiales_destino").html( lista_material_content );
			App.formElements();

			// Función para calcular y totalizar las unidades y peso del material a enviar por tramo 
			$(".unidades_material_" + param_tipo_tramo).blur(function(){
				let panel_material = $(this).parents(".panel_material");
				let unidades = panel_material.find(".unidades_material_" + param_tipo_tramo);
				let flag_panel_material = true;

				// Se suman las cantidades de material a mover
				let total_unidades = 0;
				let total_peso = 0;
				unidades.each(function(){
					let cantidad = 0
					if ($(this).val()) {
						cantidad = $(this).val();
					}
					total_unidades+= parseInt( cantidad );

					// Se busca el el material a modificar
					let id_material = $(this).data("id");
					let tipo_tramo = $(this).data("tipo_tramo");
					let material = "#info_material_" + id_material;
					let unidades_material = ".unidades_material_" + id_material;
					let unidades_disponibles = ".unidades_" + tipo_tramo + "_disponibles_" + id_material;
					let peso_disponible = ".peso_" + tipo_tramo + "_disponible_" + id_material;
					let unidades_disponibles_color = "#unidades_" + tipo_tramo + "_" + id_material;

					// Se resta la cantidad solicitada de material del total disponible
					let cantidad_solicitada_material = 0;
					panel.find(unidades_material).each(function(){
						if ( $(this).val() ) {
							cantidad_solicitada_material+= parseInt( $(this).val() );
						}
					});
					let cant_disponible = parseInt( $(material).data("unidades") ) - cantidad_solicitada_material;

					// Se calcula el peso disponible del material
					let text_peso_pendiente = parseFloat(0);
					if (cant_disponible > 0) {
						text_peso_pendiente = (cant_disponible * $(material).data("peso_total")) / $(material).data("unidades");
					}
					$(peso_disponible).attr("data-peso_pendiente", text_peso_pendiente).text(new Intl.NumberFormat("de-DE").format(text_peso_pendiente) + " Kg.");

					// Se calcula el peso del tramo
					let peso_solicitado = 0;
					if ($(this).val() && cant_disponible >= 0 ) {
						peso_solicitado = (cantidad * $(material).data("peso_total")) / $(material).data("unidades");
					}
					total_peso+= peso_solicitado;

					// Se valida el color del texto de las unidades disponibles 
					$(unidades_disponibles_color).attr("class", "unidades_" + tipo_tramo + "_disponibles unidades_" + tipo_tramo + "_disponibles_" + id_material);
					if (cant_disponible == 0) {
						$(unidades_disponibles_color).attr("class", "text-success unidades_" + tipo_tramo + "_disponibles unidades_" + tipo_tramo + "_disponibles_" + id_material);
					}
					if (cant_disponible < 0) {
						$(unidades_disponibles_color).attr("class", "text-danger unidades_" + tipo_tramo + "_disponibles unidades_" + tipo_tramo + "_disponibles_" + id_material);
						if ($(this).val()) {
							flag_panel_material = false;
						}
					}
					$(unidades_disponibles).text(cant_disponible);
				});
				panel_material.find(".total_unidades_tramo").text(total_unidades);
				panel_material.find(".total_peso_tramo").data("peso_tramo", total_peso).text(new Intl.NumberFormat("de-DE").format(total_peso) + " Kg.");

				// Se cambia el color del panel según el resultado
				panel_material.attr("class","panel panel-default panel-border-color panel-border-color-default panel_material");
				if (total_unidades > 0) {
					panel_material.attr("class","panel panel-default panel-border-color panel-border-color-success panel_material");
				}
				if (!flag_panel_material) {
					panel_material.attr("class","panel panel-default panel-border-color panel-border-color-danger panel_material");
				}

				// Se valida el color del semáforo del contenedor de los origenes
				let unidades_solicitadas = 0;
				let flag_solicitado = true;
				panel.find(".total_unidades_tramo").each(function(){
					unidades_solicitadas+= parseInt( $(this).text() );
					if ($(this).text() == 0) {
						flag_solicitado = false;
					}
				});

				panel.attr("class", "panel panel-border panel-contrast panel-border-color panel-border-color-warning");
				if (!flag_solicitado) {
					if (total_materiales.data("total_unidades") == unidades_solicitadas) {
						panel.attr("class", "panel panel-border panel-contrast panel-border-color panel-border-color-danger");
					}
				} else if (total_materiales.data("total_unidades") == unidades_solicitadas) {
					panel.attr("class", "panel panel-border panel-contrast panel-border-color panel-border-color-success");
				}
			});

			// Función para generar los servicios adicionales del tramo de destino
			$(".slct_serv_adicional_" + param_tipo_tramo).change(function(){
				let element = $(this);
				let panel = element.parents(".panel-body");
				formServiciosAdicionales(element, panel)
			});
		}
	});

	$(".tipo_movilizacion_general").change(function(){
		$(".tipo_movilizacion").val( $(this).val() );
	});

	$(".slct_serv_adicional_general").change(function(){
		let element = $(this);
		let panel = element.parents(".panel-body");
		formServiciosAdicionales(element, panel);
	});
}

/***** FUNCIONES PARA PINTAR EL CONTENIDO EN LA EDICIÓN DE LA SOLICITUD *****/
$("#ver_detalle").change(function(){
	$("#e_encabezado_content").slideToggle("fast");
});

function cargaProveedores(proveedores){
	// Se crea la función para adicionar los proveedores de los servicios especiales 
	if ($(".tt-input").length > 0) {
		let servicio_proveedores = [];
		proveedores.forEach(function(element, index){
			servicio_proveedores.push(element.nombre);
		});
		$(".tt-input").each(function(){
			let id = $(this).data("id");
			let element_id = $(this).attr("id");
			let id_elemet_proveedor = "e_id_proveedor_servicio_" + id;
			let caja_id = "e_caja_proveedor_servicio_" + id;

			$('#' + caja_id +  ' .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(servicio_proveedores),
			});
			$.ajaxSetup({async: false});
			$('#' + caja_id).bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'obtenerdatosproveedor',
					numero_documento: datum.split(" - ")[0]
				};
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						$("#" + id_elemet_proveedor).val(data.content.id);
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});
			$("#" + element_id).focusout(function () {
				// console.log($.inArray($("#" + element_id).val(), servicio_proveedores));
				if ($.inArray($("#" + element_id).val(), servicio_proveedores) == (-1)) {
					$("#" + id_elemet_proveedor).val("");
				}
			});
		});
	}
}

function formEditaSolicitudEncabezado(info, contrato){
	let tara_content = '';
	if (info.tara_contenedor > 0) {
		tara_content = `<span class="cell-detail-description">Tara: <strong>${new Intl.NumberFormat("de-DE").format(info.tara_contenedor)}</strong> Kg.</span>`;
	}
	let content = `
		<strong>Solicitud</strong>
		<table class="table" id="info_solicitud" data-id_solicitud="${info.ID_SOLICITUD}" data-id_cliente="${info.id_cliente}" data-id_contrato="${info.id_contrato}" data-numero_bl="${info.numero_bl}" data-id_proyecto="${info.ID_PROYECTO}">
			<tbody>
				<tr>
					<td class="user-avatar cell-detail user-info">
						<div class="col-xs-12 col-sm-6 col-md-3">
							<span>${info.numero_solicitud}</span>
							<span class="cell-detail-description">${info.numero_orden}</span>

						</div>
						<div class="col-xs-12 col-sm-6 col-md-3">
							<span>${info.NOMBRE_CLIENTE}</span>
							<span class="cell-detail-description">${info.tipo_operacion}</span>
						</div>
						<div class="col-xs-12 col-sm-6 col-md-3">
							<span>Peso Carga</span>
							<span class="cell-detail-description">Total: <strong id="e_peso_total">${new Intl.NumberFormat("de-DE").format(info.peso_total)}</strong> Kg.</span>
							<span class="cell-detail-description">Pendiente: <strong id="e_peso_pendiente">${new Intl.NumberFormat("de-DE").format(info.peso_pendiente)}</strong> Kg.</span>
							${tara_content}
						</div>
						<div class="col-xs-12 col-sm-6 col-md-3">
							<img src="${$("#id_url_ajax").val()}views/layout/assets/img/${info.url_avatar}">
							<span>${info.NOMBRE_USUARIO}</span>
							<span class="cell-detail-description">${info.fecha_solicitud}</span>
						</div>
					</td>
				</tr>
				<tr><td></td></tr>
			</tbody>
		</table>
	`;

	if (contrato) {
		// Se busca la información general del contrato 
		let info_contrato = contrato.info;

		// Se busca los tipos de vehículo del contrato
		let vehiculos_contrato = contrato.tipos_vehiculo.rowsData;
		let vehiculos = "";
		let _flag_primer_vehiculo = true;

		vehiculos_contrato.forEach(function(vehiculo, index){
			if (_flag_primer_vehiculo) {
				_flag_primer_vehiculo = false;
				vehiculos+= vehiculo.nombre;
			} else {
				vehiculos+= `, ${vehiculo.nombre}`;
			}
		});
		let vehiculos_content = `
			<div class="form-group col-xs-12 col-sm-4 col-md-4">
				<span>Tipos de vehículo</span>
				<span class="cell-detail-description">${vehiculos}</span>
			</div>
		`;

		// Se buscan las condiciones del contrato 
		let condiciones_content = "";
		if (contrato.condiciones) {
			let condiciones_contrato = contrato.condiciones.rowsData;
			condiciones_contrato.forEach(function(condicion, index){
				condiciones_content+= `
					<div class="form-group col-xs-12 col-sm-4 col-md-4">
						<span>${condicion.nombre}</span>
						<span class="cell-detail-description">${condicion.descripcion}</span>
					</div>
				`;
			});
		}

		// Se buscan los tramos del contrato
		let tramos_contrato = contrato.tramos.ciudades.rowsData;
		let origenes = "";
		let destinos = "";
		tramos_contrato.forEach(function(tramo, index){
			switch(tramo.tipo_tramo){
				case 'Cargue':
					origenes+= `<span class="cell-detail-description">${tramo.MUNICIPIO}</span>`;
					break;

				case 'Descargue':
					destinos+= `<span class="cell-detail-description">${tramo.MUNICIPIO}</span>`;
					break;
			}
		});

		let origenes_content = `
			<div class="form-group col-xs-12 col-sm-6 col-md-6">
				<span>Origenes</span>
				${origenes}
			</div>
		`;
		let destinos_content = `
			<div class="form-group col-xs-12 col-sm-6 col-md-6">
				<span>Destinos</span>
				${destinos}
			</div>
		`;

		content+= `
			<strong>Contrato</strong>
			<table class="table">
				<tbody>
					<tr>
						<td class="cell-detail">
							<div class="form-group col-xs-12 col-sm-4 col-md-4">
								<span>${info_contrato.cod_contrato}</span>
								<span class="cell-detail-description">${info_contrato.nombre}</span>
							</div>
							<div class="form-group col-xs-12 col-sm-4 col-md-4">
								<span>Valor Contrato</span>
								<span class="cell-detail-description">${new Intl.NumberFormat("de-DE").format(info_contrato.valor)}</span>
							</div>
							<div class="form-group col-xs-12 col-sm-4 col-md-4">
								<span>Fechas Contrato</span>
								<span class="cell-detail-description">Inicial: <strong>${info_contrato.fecha_inicio}</strong></span>
								<span class="cell-detail-description">Final: <strong>${info_contrato.fecha_fin}</strong></span>
							</div>
							${vehiculos_content}
							${condiciones_content}
							<div class="row"></div>
							${origenes_content}
							${destinos_content}
						</td>
					</tr>
					<tr><td></td></tr>
				</tbody>
			</table>
		`;
	}
	return content;
}

function formEditaSolicitudMaterial(material){
	var content = `
		<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
			<div class="icon">
				<span class="mdi mdi-close"></span>
			</div>
			<div class="message">
				<strong>Atención!</strong>
				<p>No se ha registrado materiales para esta solicitud...</p>
			</div>
		</div>
	`;
	let table_content = "";
	var total_unidades = 0;
	var total_peso = 0;
	material.forEach(function(material, index){
		total_unidades+= parseInt(material.unidades);
		total_peso+= parseFloat(material.peso_total);
		table_content+= `
			<tr>
				<td class="cell-detail">
					<span class="material" id="info_material_${material.id}" data-id="${material.id}" data-id_material_proyecto="${material.id_material_proyecto}" data-valor_declarado="${material.valor_declarado}" data-unidades="${material.unidades}" data-peso_total="${material.peso_total}" data-peso_pendiente="${material.peso_pendiente}">${material.tipo_mercancia}</span>
					<span class="cell-detail-description">${material.codigo_UN}</span>
				</td>
				<td class="cell-detail text-center">
					<strong><span id="unidades_carga_${material.id}" class="unidades_carga_disponibles unidades_carga_disponibles_${material.id}">${material.unidades}</span></strong>
				</td>
				<td class="cell-detail text-center">
					<strong><span id="unidades_descarga_${material.id}" class="unidades_descarga_disponibles unidades_descarga_disponibles_${material.id}">${material.unidades}</span></strong>
				</td>
				<td class="cell-detail text-center">
					<strong><span>${material.unidades}</span></strong>
				</td>
				<td class="cell-detail text-right">
					<span>${new Intl.NumberFormat("de-DE").format(material.peso_total)} Kg.</span>
				</td>
				<td>
					<select class="form-control input-xs tipo_movilizacion" data-id="${material.id}" id="tipo_movilizacion_${material.id}">
						<option value="EXPRESO">EXPRESO</option>
						<option value="CONSOLIDADO">CONSOLIDADO</option>
					</select>
				</td>
			</tr>
		`;
	});

	if (table_content) {
		var content = `
			<strong>Materiales</strong>
			<table class="table table-condensed table-striped" id="total_material" data-total_unidades="${total_unidades}" data-total_peso="${total_peso}">
				<thead>
					<tr class="nexos-encabezado">
						<th class="col-xs-4 col-sm-4 col-md-4 text-center"><small>Material</small></th>
						<th class="text-center"><small>Disponibles Origen</small></th>
						<th class="text-center"><small>Disponibles Destino</small></th>
						<th class="text-center"><small>Unidades Totales</small></th>
						<th class="text-center"><small>Peso Total</small></th>
						<th>
							<small>Tipo Movilización</small>
							<select class="form-control input-xs tipo_movilizacion_general">
								<option value="EXPRESO">EXPRESO</option>
								<option value="CONSOLIDADO">CONSOLIDADO</option>
							</select>
						</th>
					</tr>
				</thead>
				<tbody>
					${table_content}
					<tr>
						<td class="cell-detail text-right"><strong>Total</strong></td>
						<td class="cell-detail text-center" colspan="2"><strong><span id="total_unidades">${total_unidades}</span></strong></td>
						<td class="cell-detail text-center" colspan="2"><strong><span id="total_peso" data-total_peso="${total_peso}">${new Intl.NumberFormat("de-DE").format(total_peso)} Kg.</span></strong></td>
						<td class="cell-detail text-right"></td>
					</tr>
				</tbody>
			</table>
		`;
	}
	return content;
}

function formDatosGenerales(tipos_vehiculo, tipos_carroceria, valores_contrato){
	// Se determina el valor de venta del proyecto 
	let valor_venta;
	switch(valores_contrato.tipo_contrato){
		case "1": // Mensual
			valor_venta = parseInt( valores_contrato.valor_contrato / valores_contrato.cant_viajes);
			break;

		case "2": // Semanal
			valor_venta = parseInt( valores_contrato.valor_contrato / valores_contrato.cant_viajes);
			break;

		case "3": // Por operacion 
			valor_venta = parseInt(valores_contrato.valor_contrato);
			break;

		case "4": // Quincenal
			valor_venta = parseInt( valores_contrato.valor_contrato / valores_contrato.cant_viajes);
			break;

		default: // Si no existe
			valor_venta = "";
			break;
	}
	let valor_compra = parseInt( (( 100 - valores_contrato.porcentaje_ganancia ) * valor_venta ) / 100 );
	let content = `
		<div class="panel panel-default panel-border-color panel-border-color-default">
			<div class="panel-heading">
				<h4 class="panel-title">
					<a data-toggle="collapse" data-parent="#accordion_content" href="#panel_generalidades" class="collapsed">
						<i class="icon mdi mdi-chevron-down"></i> 
						Datos de Transporte
						<span class="panel-subtitle">Establece generalidades de la solicitud.</span>
					</a>
				</h4>
			</div>
			<div id="panel_generalidades" class="panel-collapse collapse">
				<div class="panel-body">
					<div class="form-group col-xs-12 col-sm-6 col-md-3">
						<label>(*) Valor de venta:</label>
						<input type="text" id="e_valor_venta" placeholder="Valor de venta" class="form-control input-sm" onload="getFormatoNumeroDecimal(this)" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)" value="${new Intl.NumberFormat("de-DE").format(valor_venta)},00" readonly="readonly">
					</div>	
					<div class="form-group col-xs-12 col-sm-6 col-md-3">
						<label>(*) Valor de compra:</label>
						<input type="text" id="e_valor_compra" placeholder="Valor de compra" class="form-control input-sm" onload="getFormatoNumeroDecimal(this)" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)" value="${new Intl.NumberFormat("de-DE").format(valor_compra)},00" readonly="readonly">
					</div>
					<div class="form-group col-xs-12 col-sm-6 col-md-3">
						<label>Sugerencia tipo de vehículo:</label>
						${slctTiposVehiculo_sm(tipos_vehiculo)}
					</div>
					<div class="form-group col-xs-12 col-sm-6 col-md-3">
						<label>Sugerencia tipo de carrocería:</label>
						${slctTiposCarroceria_sm(tipos_carroceria)}
					</div>
				</div>
			</div>
		</div>
	`;
	return content;
}

function slctTiposVehiculo_sm(tipos_vehiculo){
	let content = `
		<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
			<div class="icon">
				<span class="mdi mdi-close"></span>
			</div>
			<div class="message">
				<strong>Atención!</strong>
				<p>No se encuentran tipos de vehículo registrados...</p>
			</div>
		</div>
	`;
	if (tipos_vehiculo.length > 0) {
		content = `
			<select class="form-control input-sm" name="id_tipo_vehiculo" id="e_tipo_vehiculo">
				<option value="" selected="" disabled="">Seleccione</option>
		`;
		tipos_vehiculo.forEach(function(element,index){
			content+= `<option value="${element.id_vehiculo}">${element.nombre}</option>`;
		});
		content+= `</select>`;
	}
	return content;
}

function slctTiposCarroceria_sm(tipos_vehiculo){
	let content = `
		<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
			<div class="icon">
				<span class="mdi mdi-close"></span>
			</div>
			<div class="message">
				<strong>Atención!</strong>
				<p>No se encuentran tipos de carrocería registrados...</p>
			</div>
		</div>
	`;
	if (tipos_vehiculo.length > 0) {
		content = `
			<select class="form-control input-sm" name="id_tipo_carroceria" id="e_tipo_carroceria">
				<option value="" selected="" disabled="">Seleccione</option>
		`;
		tipos_vehiculo.forEach(function(element,index){
			content+= `<option value="${element.id}">${element.descripcion}</option>`;
		});
		content+= `</select>`;
	}
	return content;
}

function formEditaSolicitudOrigenes(tramos){
	let origenes = tramos.ciudades.rowsData;
	let remi_dest = tramos.remi_dest;

	let content = `
		<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
			<div class="icon">
				<span class="mdi mdi-close"></span>
			</div>
			<div class="message">
				<strong>Atención!</strong>
				<p>No se encuentran ciudades de origen para este contrato...</p>
			</div>
		</div>
	`;

	if (origenes) {
		let panel_content = "";
		origenes.forEach(function(origen, index){
			if ( origen.tipo_tramo == "Cargue" ) {
				panel_content+= `
					<div class="form-group col-xs-12 col-xs-12 col-xs-12" id="form_municipio_${origen.id_ciudad}">
						<strong class="municipio">${origen.MUNICIPIO}</strong>
						${slctRemidest_multi(origen.id_ciudad, remi_dest[origen.id_ciudad], origen.MUNICIPIO, "origenes")}
					</div>
				`;
			}
		});
		content = `
			<div class="panel panel-default panel-border-color panel-border-color-default" id="panel_origenes">
				<div class="panel-heading">
					<h4 class="panel-title">
						<a data-toggle="collapse" data-parent="#accordion_content" href="#panel_origenes_content" class="collapsed">
							<i class="icon mdi mdi-chevron-down"></i> 
							Origenes
							<span class="panel-subtitle">Ciudades de donde se cargará los materiales de envío</span>
						</a>
					</h4>
				</div>
				<div id="panel_origenes_content" class="panel-collapse collapse">
					<div class="panel-body">
						${panel_content}
						<div class="col-xs-12 col-xs-12 col-xs-12" id="materiales_origen"></div>
					</div>
				</div>
			</div>
		`;
	}
	return content;
}

function formEditaSolicitudDestinos(tramos){
	let destinos = tramos.ciudades.rowsData;
	let remi_dest = tramos.remi_dest;

	let content = `
		<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
			<div class="icon">
				<span class="mdi mdi-close"></span>
			</div>
			<div class="message">
				<strong>Atención!</strong>
				<p>No se encuentran ciudades de origen para este contrato...</p>
			</div>
		</div>
	`;

	if (destinos) {
		let panel_content = "";
		destinos.forEach(function(destino, index){
			if ( destino.tipo_tramo == "Descargue" ) {
				panel_content+= `
					<div class="form-group col-xs-12 col-xs-12 col-xs-12">
						<strong class="municipio">${destino.MUNICIPIO}</strong>
						${slctRemidest_multi(destino.id_ciudad, remi_dest[destino.id_ciudad], destino.MUNICIPIO, "destinos")}
					</div>
				`;
			}
		});
		content = `
			<div class="panel panel-default panel-border-color panel-border-color-default" id="panel_destinos">
				<div class="panel-heading">
					<h4 class="panel-title">
						<a data-toggle="collapse" data-parent="#accordion_content" href="#panel_destinos_content" class="collapsed">
							<i class="icon mdi mdi-chevron-down"></i> 
							Destinos
							<span class="panel-subtitle">Ciudades de donde se entregarán los materiales de envío</span>
						</a>
					</h4>
				</div>
				<div id="panel_destinos_content" class="panel-collapse collapse">
					<div class="panel-body">
						${panel_content}
						<div class="col-xs-12 col-xs-12 col-xs-12" id="materiales_destino"></div>
					</div>
				</div>
			</div>
		`;
	}
	return content;
}

function formEditaAdicionales(serv_adicionales, proveedores, id_accordion, clase, id_tramo = null){
	let tramo = "";
	if (id_tramo) {
		tramo = id_tramo;
	}
	let content = `
		<div class="panel panel-default panel-border-color panel-border-color-default">
			<div class="panel-heading">
				<h4 class="panel-title">
					<a data-toggle="collapse" data-parent="#${id_accordion}" href="#${id_accordion}_panel" class="collapsed">
						<i class="icon mdi mdi-chevron-down"></i> 
						Servicios Adicionales
						<span class="panel-subtitle">Se establece los servicios adicionales de la operación.</span>
					</a>
				</h4>
			</div>
			<div id="${id_accordion}_panel" class="panel-collapse collapse">
				<div class="panel-body" data-id_tramo="${id_tramo}">
					<div class="form-group col-xs-12 col-sm-12 col-md-12">${slctServAdicional_multi(serv_adicionales, clase)}</div>
					<div id="lista_servicios_${tramo}"></div>
				</div>
			</div>
		</div>
	`;
	return content;
}

// Función para traer los servicios adicionales de la operación
function slctServAdicional_multi(serv_adicionales, clase){
	let content = `
		<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
			<div class="icon">
				<span class="mdi mdi-close"></span>
			</div>
			<div class="message">
				<strong>Atención!</strong>
				<p>No se encontraron servicios adicionales para generarlos en la solicitud...</p>
			</div>
		</div>
	`;

	if (serv_adicionales) {
		content = `
			<label>Servicios Adicionales</label>
			<select multiple="" class="select2 slct_serv_adicional slct_serv_adicional_${clase} select2-hidden-accessible" name="remi_dest" id="slct_remi_dest" aria-hidden="true" tabindex="-1">
		`;
		serv_adicionales.forEach(function(serv_adicionales, index){
			content+= `<option value="${serv_adicionales.id}">${serv_adicionales.nom_servicios_especial}</option>`;
		});
		content+= `</select>`;
	}
	return content;
}

// Función para crear un select de remitentes destinatarios
function slctRemidest_multi(id_ciudad, remi_dest, municipio, tipo_tramo){
	let content = `
		<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
			<div class="icon">
				<span class="mdi mdi-close"></span>
			</div>
			<div class="message">
				<strong>Atención!</strong>
				<p>No se encontraron remitentes destinatarios registrados en esta ciudad...</p>
			</div>
		</div>
	`;

	if (remi_dest) {
		content = `<select multiple="" class="select2 slct_remi_dest slct_remi_dest_${tipo_tramo} select2-hidden-accessible" name="remi_dest" id="slct_remi_dest_${id_ciudad}" data-id_ciudad="${id_ciudad}" data-municipio="${municipio}" aria-hidden="true" tabindex="-1">`;
		remi_dest.forEach(function(remi_dest, index){
			content+= `<option value="${remi_dest.id}">${remi_dest.nombre}</option>`;
		});
		
		content+= `</select>`;
	}
	return content;
}

// Función para crear la lista de materiales por tramo 
function listarMaterialesTramo(tramo, materiales, tipo_tramo, lista_serv_adicionales, lista_proveedores){
	// Se crea la tabla de matariales para el tramo 
	let table_content = `
		<table class="table table-condensed table-striped">
			<thead>
				<tr>
					<th>Material</th>
					<th class="col-xs-2 col-sm-2 col-md-2 text-center">Unid. a Cargar</th>
					<th class="col-xs-1 col-sm-1 col-md-1 text-center">Unid. Disponibles</th>
					<th class="col-xs-2 col-sm-2 col-md-2 text-center">Peso Disponible</th>
				</tr>
			</thead>
			<tbody>
	`;
	materiales.forEach(function(material, index){
		table_content+= `
			<tr>
				<td>${material.tipo_mercancia}</td>
				<td>
					<input type="number" class="form-control input-xs unidades_material_${tipo_tramo} unidades_material_${material.id}" name="unidades_material" id="unidades_material_${tramo.id}_${material.id}" min="0" data-id="${material.id}" data-tipo_tramo="${tipo_tramo}">
				</td>
				<td class="cell-detail text-center">
					<span class="unidades_${tipo_tramo}_disponibles_${material.id}">${material.unidades}</span>
				</td>
				<td class="text-right peso_pendiente peso_${tipo_tramo}_disponible_${material.id}" data-peso_pendiente="${material.peso_pendiente}">${new Intl.NumberFormat("de-DE").format(material.peso_pendiente)} Kg.</td>
			</tr>
		`;
	});
	table_content+= `
				<tr>
					<td class="text-right"><strong>Total unidades</strong></td>
					<td>
						<span class="total_unidades_tramo">0</span>
					</td>
					<td class="text-right" colspan="2">
						<strong>Peso Tramo</strong> <span class="total_peso_tramo" data-peso_tramo="0">0 Kg.</span>
					</td>
				</tr>
			</tbody>
		</table>
	`;

	let content = `
		<div class="panel panel-default panel-border-color panel-border-color-default panel_material" data-id="${tramo.id}">
			<div class="panel-heading">
				<h4 class="panel-title">
					<a data-toggle="collapse" data-parent="#accordion_${tipo_tramo}" href="#panel_tramo_${tramo.id}" class="collapsed">
						<i class="icon mdi mdi-chevron-down"></i> 
						${tramo.sigla} <small><strong>${tramo.MUNICIPIO}</strong></small>
						<span class="panel-subtitle">${tramo.direccion}</span>
					</a>
				</h4>
			</div>
			<div id="panel_tramo_${tramo.id}" class="panel-collapse collapse">
				<div class="panel-body">
					<div class="col-xs-12 col-sm-4 col-md-4">
						<span>Fecha Hora Operación:</span>
						<div data-start-view="2" data-date="" data-date-format="yyyy-mm-dd hh:ii" data-link-field="dtp_input1" class="input-group date datetimepicker"> 
							<input type="text" id="e_fecha_hora_operacion_${tramo.id}" value="" placeholder="Fecha Hora Operación" class="form-control input-sm fecha_hora_operacion fecha_hora_operacion_${tipo_tramo}" readonly="">
							<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span> 
						</div> 
					</div>
					<div class="col-xs-6 col-sm-4 col-md-4">
						<label>Valor de venta:</label>
						<input type="text" id="e_valor_venta_tramo_${tramo.id}" placeholder="Valor de venta" class="form-control input-sm valor_venta_tramo" onload="getFormatoNumeroDecimal(this)" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)">
					</div>
					<div class="col-xs-6 col-sm-4 col-md-4">
						<label>Valor de compra:</label>
						<input type="text" id="e_valor_compra_tramo_${tramo.id}" placeholder="Valor de compra" class="form-control input-sm valor_compra_tramo" onload="getFormatoNumeroDecimal(this)" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)">
					</div>
					<div class="row"></div>
					<div class="col-xs-12 col-sm-6 col-md-6">
						<div class="be-checkbox">
							<input id="e_personal_${tramo.id}" type="checkbox" class="personal">
							<label for="e_personal_${tramo.id}">Se Necesita personal?</label>
						</div>
					</div>
					<div class="col-xs-12 col-sm-6 col-md-6">
						<div class="be-checkbox">
							<input id="e_sumaflete_${tramo.id}" type="checkbox" class="suma_flete">
							<label for="e_sumaflete_${tramo.id}">Este valor se le suma al flete?</label>
						</div>
					</div>
					${table_content}
					<!-- CREACIÓN DE SERVICIOS ADICIONALES POR TRAMO
						SE DEJA COMENTARIADO YA QUE GENERA INCONVENIENTES DE EN LA CARGA DE LOS SELECT DE SERVICIOS ADICIONALES 
					-->
					<!--
						<div id="accordion_servicios_${tramo.id}" class="panel-group accordion">
							${formEditaAdicionales(lista_serv_adicionales, lista_proveedores, "accordion_servicios_" + tramo.id, tipo_tramo, tramo.id)}
						</div>
					-->
				</div>
			</div>
		</div>
	`;
	return content;
}

// Función para crear los formularios de creación de servicios adicionales
function formServiciosAdicionales(element, panel){
	let id_tramo = "";
	if (panel.data("id_tramo")) {
		id_tramo = panel.data("id_tramo");
	}
	panel.find("#lista_servicios_" + id_tramo).empty();
	let content = "";
	element.find("option:selected").each(function(){
		let index = $(this).val();
		let title = $(this).text()
		content+= `
			<div class="form-group col-xs-12 col-sm-12 col-md-12">
				<div class="col-xs-12 col-sm-12 col-md-12"><strong>${title}</strong></div>
				<div class="col-xs-2 col-sm-2 col-md-2">
					<label><small class="text-muted">Se cobra al cliente</small></label>
					<div class="be-checkbox">
						<input class="check_sobrecosto" id="sobrecosto_${index}" type="checkbox">
						<label for="sobrecosto_${index}"></label>
					</div>
				</div>
				<div class="col-xs-6 col-sm-3 col-md-3">
					<label>(*) Valor de venta:</label>
					<input type="text" id="e_valor_venta_servicio_${index}" placeholder="Valor de venta" class="form-control input-xs" onload="getFormatoNumeroDecimal(this)" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)" data-title="Valor de venta">
				</div>
				<div class="col-xs-6 col-sm-3 col-md-3">
					<label>(*) Valor de compra:</label>
					<input type="text" id="e_valor_compra_servicio_${index}" placeholder="Valor de compra" class="form-control input-xs" onload="getFormatoNumeroDecimal(this)" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)" data-title="Valor de compra">
				</div>
				<div class="col-xs-12 col-sm-4 col-md-4">
					<label>(*) Proveedor:</label>
					<div id="e_caja_proveedor_servicio_${index}">
						<span class="twitter-typeahead" style="position: relative; display: inline-block;">
							<input type="text" class="typeahead form-control input-xs tt-input" placeholder="Proveedor" id="e_proveedor_servicio_${index}" autocomplete="off" spellcheck="false" dir="auto" style="position: relative; vertical-align: top; background-color: transparent;" data-id="${index}">
							<pre aria-hidden="true" style="position: absolute; visibility: hidden; white-space: pre; font-family: Roboto, Arial, sans-serif; font-size: 12px; font-style: normal; font-variant: normal; font-weight: 400; word-spacing: 0px; letter-spacing: 0px; text-indent: 0px; text-rendering: auto; text-transform: none;"></pre>
							<div class="tt-menu" style="position: absolute; top: 100%; left: 0px; z-index: 100; display: none;">
								<div class="tt-dataset tt-dataset-states"></div>
							</div>
						</span>
					</div>
					<input type="hidden" id="e_id_proveedor_servicio_${index}" data-title="Proveedor">
				</div>
			</div>
		`;
	});
	panel.find("#lista_servicios_" + id_tramo).html(content);
	cargaProveedores(lista_proveedores);
}
/***** FIN - FUNCIONES PARA PINTAR EL CONTENIDO EN LA EDICIÓN DE LA SOLICITUD *****/


function buscartramossolicitud(id_solicitud, numero_solicitud, id_cliente) {
	var params = {
		accion: 'buscartramossolicitud',
		id_solicitud: id_solicitud
	};
	$("#t_num_solicitud").text("Solicitud #" + numero_solicitud);
	$("#t_id_solicitud").val(numero_solicitud);
	$("#t_id_cliente").val(id_cliente);
	$.post(url, params, function (data) {
		if (data.success) {
		} else {
			$("#tabla_tramos").html(data.content);
		}
	}, 'json');
}

function cancelardatossolicitud(id_solicitud) {
	var params = {
		accion: 'obtenerdatossolicitud',
		id_solicitud: id_solicitud
	};
	$.post(url, params, function (data) {
		if (data.success) {
			$("#d_num_solicitud").text(" ¿Desea cancelar la Solicitud #" + data.content["numero_solicitud"] + " ?")
			$("#d_id_solicitud").val(data.content["id_solicitud"]);
		} else {
			alert("error");
		}
	}, 'json');
}

function editarSolicitud() {
	$("#errores_solicitud").empty();
	let msg_error = "";

	/***** Se valida el contenido de la pestaña "Datos de transporte" *****/
	tipo_vehiculo = $("#e_tipo_vehiculo").val();
	tipo_carroceria = $("#e_tipo_carroceria").val();
	valor_venta_servicio = $("#e_valor_venta").val();
	valor_compra_servicio = $("#e_valor_compra").val();

	if(!valor_venta_servicio){
		msg_error+= '<p>Debe diligenciar el campo <strong>Valor de Venta</strong> para editar la solicitud</p>';
	}
	if(!valor_compra_servicio){
		msg_error+= '<p>Debe diligenciar el campo <strong>Valor de Compra</strong> para editar la solicitud</p>';
	}
	/***** Fin - Se valida el contenido de la pestaña "Datos de transporte" *****/

	// Se instancia el array de los tramos de la solicitud
	var tramos_solicitud = Array();
	var tramos_ciudad, flag_tramos, total_peso_material_solicitado = 0;

	/***** Se valida el contenido de la pestaña "Origenes" *****/
	var tramos_content = $("#panel_origenes");
	// Se valida la selección de los destinos de las ciudades del contrato 
	tramos_ciudad = tramos_content.find(".slct_remi_dest_origenes");
	flag_tramos = true;
	tramos_ciudad.each(function(){
		element = $(this);
		if (!element.val()) {
			msg_error+= `<p>No se han seleccionado las cargas de <strong>${element.data("municipio")}</strong></p>`;
			flag_tramos = false;
		}
	});

	// Se valida el contenido del acordeón de cargas
	if (flag_tramos) {
		var flag_disponibles_carga = true;
		tramos_content.find(".panel_material").each(function(){
			let element_tramo = $(this);
			let id_tramo = element_tramo.data("id");
			let nombre_tramo = element_tramo.find(".panel-title");
			let fecha_operacion = element_tramo.find(".fecha_hora_operacion");
			let valor_venta = element_tramo.find(".valor_venta_tramo");
			let valor_compra = element_tramo.find(".valor_compra_tramo");
			let unidades_tramo = element_tramo.find(".total_unidades_tramo");
			let peso_tramo = element_tramo.find(".total_peso_tramo");
			total_peso_material_solicitado+= peso_tramo.data("peso_tramo");

			// Se valida el contenido del formulario
			if ( !fecha_operacion.val() ) {
				msg_error+= `<p>Debe diligenciar el campo <strong>${fecha_operacion.attr("placeholder")}</strong> del tramo <strong>${nombre_tramo.text()}</strong>.</p>`;
			}
			if ( parseInt(unidades_tramo.text()) == 0 ) {
				flag_disponibles_carga = false;
				msg_error+= `<p>Debe seleccionar material para el tramo <strong>${nombre_tramo.text()}</strong>.</p>`;
			}

			/***** Se crea el array con los datos del tramo *****/
			// Se filtra el contenido para el arreglo
			let _valor_venta = 0;
			if ( valor_venta.val() ) {
				let _valor_venta = valor_venta.val();
			}
			let _valor_compra = 0;
			if ( valor_compra.val() ) {
				let _valor_compra = valor_compra.val();
			}
			let personal = 0;
			if (element_tramo.find(".personal").is(":checked")) {
				personal = 1;
			}
			let suma_flete = 0;
			if (element_tramo.find(".suma_flete").is(":checked")) {
				suma_flete = 1;
			}

			// Se crea el arreglo del material del tramo seleccionado 
			arrayMaterialTramo = Array();
			element_tramo.find(".unidades_material_carga").each(function(){
				let element = $(this);
				if (element.val() && element.val() > 0) {
					let id_material = element.data("id");
					let material = $("#info_material_" + id_material);
					let peso_material = (element.val() * $(material).data("peso_total")) / $(material).data("unidades");
					let valor_declarado = (element.val() * $(material).data("valor_declarado")) / $(material).data("unidades");
					let tipo_movilizacion = $("#tipo_movilizacion_" + id_material);

					let array = {
						id_material: id_material,
						id_material_proyecto: material.data("id_material_proyecto"),
						unidades: element.val(),
						peso: peso_material,
						peso_pendiente: peso_material,
						valor_declarado: valor_declarado,
						tipo_movilizacion: tipo_movilizacion.val()
					}
					arrayMaterialTramo.push(array);
				}
			});

			let arrayTramosDescarga = {
				id_remitente_destinatario: id_tramo,
				fecha_hora_operacion: fecha_operacion.val(),
				tipo_operacion: "Cargue",
				peso: peso_tramo.data("peso_tramo"),
				unidades: unidades_tramo.text(),
				valor_venta: _valor_venta,
				valor_compra: _valor_compra,
				personal: personal,
				suma_flete: suma_flete,
				cmx_tramo_material: arrayMaterialTramo
			}
			tramos_solicitud.push(arrayTramosDescarga);
			/***** Fin - Se crea el array con los datos del tramo *****/
		});
	}
	/***** Fin - Se valida el contenido de la pestaña "Origenes" *****/

	/***** Se valida el contenido de la pestaña "Destinos" *****/
	tramos_content = $("#panel_destinos");
	// Se valida la selección de los destinos de las ciudades del contrato 
	tramos_ciudad = tramos_content.find(".slct_remi_dest_destinos");
	flag_tramos = true;
	tramos_ciudad.each(function(){
		element = $(this);
		if (!element.val()) {
			msg_error+= `<p>No se han seleccionado las descargas de <strong>${element.data("municipio")}</strong></p>`;
			flag_tramos = false;
		}
	});

	// Se valida el contenido del acordeón de descargas
	if (flag_tramos) {
		var flag_disponibles_descarga = true;
		tramos_content.find(".panel_material").each(function(){
			let element_tramo = $(this);
			let id_tramo = element_tramo.data("id");
			let nombre_tramo = element_tramo.find(".panel-title");
			let fecha_operacion = element_tramo.find(".fecha_hora_operacion");
			let valor_venta = element_tramo.find(".valor_venta_tramo");
			let valor_compra = element_tramo.find(".valor_compra_tramo");
			let unidades_tramo = element_tramo.find(".total_unidades_tramo");
			let peso_tramo = element_tramo.find(".total_peso_tramo");
			total_peso_material_solicitado+= peso_tramo.data("peso_tramo");

			// Se valida el contenido del formulario
			if ( !fecha_operacion.val() ) {
				msg_error+= `<p>Debe diligenciar el campo <strong>${fecha_operacion.attr("placeholder")}</strong> del tramo <strong>${nombre_tramo.text()}</strong>.</p>`;
			}
			if ( parseInt(unidades_tramo.text()) == 0 ) {
				flag_disponibles_descarga = false;
				msg_error+= `<p>Debe seleccionar material para el tramo <strong>${nombre_tramo.text()}</strong>.</p>`;
			}

			/***** Se crea el array con los datos del tramo *****/
			// Se filtra el contenido para el arreglo
			let _valor_venta = 0;
			if ( valor_venta.val() ) {
				let _valor_venta = valor_venta.val();
			}
			let _valor_compra = 0;
			if ( valor_compra.val() ) {
				let _valor_compra = valor_compra.val();
			}
			let personal = 0;
			if (element_tramo.find(".personal").is(":checked")) {
				personal = 1;
			}
			let suma_flete = 0;
			if (element_tramo.find(".suma_flete").is(":checked")) {
				suma_flete = 1;
			}

			// Se crea el arreglo del material del tramo seleccionado 
			arrayMaterialTramo = Array();
			element_tramo.find(".unidades_material_descarga").each(function(){
				let element = $(this);
				if (element.val() && element.val() > 0) {
					let id_material = element.data("id");
					let material = $("#info_material_" + id_material);
					let peso_material = (element.val() * $(material).data("peso_total")) / $(material).data("unidades");
					let valor_declarado = (element.val() * $(material).data("valor_declarado")) / $(material).data("unidades");
					let tipo_movilizacion = $("#tipo_movilizacion_" + id_material);

					let array = {
						id_material: id_material,
						id_material_proyecto: material.data("id_material_proyecto"),
						unidades: element.val(),
						peso: peso_material,
						peso_pendiente: peso_material,
						valor_declarado: valor_declarado,
						tipo_movilizacion: tipo_movilizacion.val()
					}
					arrayMaterialTramo.push(array);
				}
			});

			let arrayTramosDescarga = {
				id_remitente_destinatario: id_tramo,
				fecha_hora_operacion: fecha_operacion.val(),
				tipo_operacion: "Descargue",
				peso: peso_tramo.data("peso_tramo"),
				unidades: unidades_tramo.text(),
				valor_venta: _valor_venta,
				valor_compra: _valor_compra,
				personal: personal,
				suma_flete: suma_flete,
				cmx_tramo_material: arrayMaterialTramo
			}
			tramos_solicitud.push(arrayTramosDescarga);
			/***** Fin - Se crea el array con los datos del tramo *****/
		});
	}
	/***** Fin - Se valida el contenido de la pestaña "Destinos" *****/

	/****** Se valida si se selecciono todo el material para la carga ******/
	$(".unidades_carga_disponibles").each(function(){
		if ( flag_disponibles_carga && parseInt($(this).text()) != 0 ) {
			msg_error+= `<p>El cantidad de material solicitado para <strong>cargar</strong> no corresponde al cantidad de material de la solicitud.</p>`;
			return false;
		}
	});
	/****** fin - Se valida si se selecciono todo el material para la carga ******/

	/****** Se valida si se selecciono todo el material para la descarga ******/
	$(".unidades_descarga_disponibles").each(function(){
		if ( flag_disponibles_descarga && parseInt($(this).text()) != 0 ) {
			msg_error+= `<p>El cantidad de material solicitado para <strong>descargar</strong> no corresponde al cantidad de material de la solicitud.</p>`;
			return false;
		}
	});
	/****** Fin - Se valida si se selecciono todo el material para la descarga ******/

	/***** Se valida el contenido de la pestaña "Servicios Especiales Adicionales" *****/
	var arrayServAdicionales = new Array();
	if ( $(".slct_serv_adicional").length > 0 ) {
		$(".slct_serv_adicional").each(function(){
			let element = $(this);
			let id_tramo = element.parents(".panel-body").data("id_tramo");
			element.find("option:selected").each(function(){
				let index = $(this).val();
				let nom_servicio = $(this).text();
				let _flag_valida_prveedor = true; 

				let sobrecosto = 0;
				if ( $("#sobrecosto_" + index).is(":checked") ) {
					sobrecosto = 1;
				}
				let valor_venta = $("#e_valor_venta_servicio_" + index);
				let valor_compra = $("#e_valor_compra_servicio_" + index);
				let id_proveedor = $("#e_id_proveedor_servicio_" + index);

				if (!valor_venta.val()) {
					msg_error+= `<p>Debe diligenciar el campo <strong>${valor_venta.attr("placeholder")}</strong> del servicio <strong>${nom_servicio}</strong>.</p>`;
				}
				if (!valor_compra.val()) {
					msg_error+= `<p>Debe diligenciar el campo <strong>${valor_compra.attr("placeholder")}</strong> del servicio <strong>${nom_servicio}</strong>.</p>`;
				}else if (valor_compra.val() == 0) {
					_flag_valida_prveedor = false; 

				}
				if (!id_proveedor.val() && _flag_valida_prveedor) {
					msg_error+= `<p>Debe diligenciar el campo <strong>Proveedor</strong> del servicio <strong>${nom_servicio}</strong>.</p>`;
				}

				// Se adicionan los datos del servicio adicional
				let array = {
					id_tramo: id_tramo,
					id_servicio: index,
					sobrecosto: sobrecosto,
					valor_venta: valor_venta.val(),
					valor_compra: valor_compra.val(),
					id_proveedor: id_proveedor.val(),
				}
				arrayServAdicionales.push(array);
			});
		});
	}
	/***** Fin - Se valida el contenido de la pestaña "Servicios Especiales Adicionales" *****/

	if (!msg_error) {
		let info_solicitud = $("#info_solicitud")
		let cmx_solicitudes = {
			id_solicitud: info_solicitud.data("id_solicitud"),
			id_cliente: info_solicitud.data("id_cliente"),
			numero_bl: info_solicitud.data("numero_bl"),
			valor_venta: valor_venta_servicio,
			valor_compra: valor_compra_servicio,
			tipo_vehiculo: tipo_vehiculo,
			tipo_carroceria: tipo_carroceria,
			estado: "En proceso"
		}

		// Se busca el tipo de movilización del material de la solicitud
		let cmx_mercancia_solicitud = new Array();
		$(".tipo_movilizacion").each(function(){
			let tipo_movilizacion = $(this);
			let array = {
				id: tipo_movilizacion.data("id"),
				tipo_movilizacion: tipo_movilizacion.val()
			}
			cmx_mercancia_solicitud.push(array);
		});

		let params = {
			accion: 'editarSolicitud_1',
			cmx_solicitudes: cmx_solicitudes,
			cmx_servicio_adicional: arrayServAdicionales,
			cmx_tramo_solicitud: tramos_solicitud,
			cmx_mercancia_solicitud: cmx_mercancia_solicitud
		}
		// console.log(params);

		$.ajaxSetup({async: false});
		$.ajax({
			url: url,
			type: 'POST',
			data: params,
			cache: false,
			dataType: 'json',
			beforeSend	: function(jqXHR, settings){
				$(".nexos-messages").html('<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' + $("#id_url_ajax").val() + 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>');
			},
			error: function (jqXHR, textStatus, errorThrown){
				$(".nexos-messages").html('');
				msg_error+= "<p>" + jqXHR.responseText + "</p>";
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			},
			success: function (data, textStatus, jqXHR){
				// console.log(data);
				$(".nexos-messages").html('');
				if (!data.error) {
					$("#btn_e_actualizar_solicitud").attr("data-dismiss", "modal");
					var url_gestion_actividad = $("#id_url_ajax").val() + "libs/gestion_actividades.php?tabla=cmx_importacion_actividades&proyecto=importaciones";
					var params = {
						id 					: data.actividades.id,
						id_importacion		: data.actividades.id_importacion,
						id_material			: data.actividades.id_material,
						orden				: data.actividades.orden,
						tipo_actividad 		: data.actividades.tipo_actividad,
						fecha_hora_inicio	: data.actividades.fecha_hora_inicio,
						costo_real 			: data.actividades.costo_real,
						respuesta 			: data.actividades.respuesta
					};
					// console.log(params);
					$.ajax({
						type		: "POST",
						cache		: false,
						url			: url_gestion_actividad,
						data		: params,
						beforeSend	: function(jqXHR, settings){
						},
						error 		: function(jqXHR, textStatus, errorThrown){
							$(".nexos-messages").html('');
							msg_error+= "<p>" + jqXHR.responseText + "</p>";
							console.log(jqXHR);
							console.log(textStatus);
							console.log(errorThrown);
						},
						success		: function(data, textStatus, jqXHR) {
						// console.log(data);
						}
					});
					$("#errores_solicitud").html('<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado! </strong>Se ha creado el registro con éxito.</div></div>');
					$("#editar_solicitud").animate({ scrollTop: 0 }, 600);
					setTimeout(function() { location.reload(false);  }, 800);
				} else {
					msg_error+= data.error;
				}
			}
		});
		$.ajaxSetup({async: true});
	}

	if (msg_error) {
		$("#errores_solicitud").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
		$("#editar_solicitud").animate({ scrollTop: 0 }, 600);
	}
}

function cancelarSolicitud() {
	var params = {
		accion: 'cancelarSolicitud',
		id_solicitud: $("#d_id_solicitud").val(),
		razon_cancelacion: $("#d_razon_cancelacion").val()
	};
	$.post(url, params, function (data) {
		if (data.success) {
			$("#btn_cancelar_solicitud").attr("data-dismiss", "modal");
			location.reload();
		} else {
			$("#btn_cancelar_solicitud").removeAttr("data-dismiss");
		}
	}, 'json');
}

function agregarTramoSolicitud() {
	var params = {
		accion: 'agregarTramoSolicitud',
		id_solicitud: $("#t_id_solicitud").val(),
		nom_remitente: $("#t_a_remitente").val(),
		direccion: $("#t_a_direccion").val(),
		contacto: $("#t_a_contacto").val(),
		peso: $("#t_a_peso").val(),
		unidades: $("#t_a_unidades").val()
	};
	$.post(url, params, function (data) {
		if (data.success) {
			$("#btn_agregar_tramo_solicitud").attr("data-dismiss", "modal");
			location.reload();
		} else {
			$("#btn_agregar_tramo_solicitud").removeAttr("data-dismiss");
		}
	}, 'json');
}

function verrazoncancelacion(id_solicitud) {
	var params = {
		accion: 'obtenerdatossolicitud',
		id_solicitud: id_solicitud
	};
	$.post(url, params, function (data) {
		if (data.success) {
			$("#caja_razon_cancelacion").html(' La razon de la cancelación fue: </label> <br><br> ' + data.content["razon_cancelacion"] + '</label>');
			$("#cancel_num_solicitud").text("Solicitud # " + data.content["numero_solicitud"]);
		} else {
			alert("error");
		}
	}, 'json');
}

var vehiculos = [];
function buscarvehiculos(id_solicitud) {
	$("#asig_id_solicitud").val(id_solicitud);
	var params = {
		accion: 'cargarsolicitudesvehiculos',
		id_solicitud: id_solicitud
	};
	$("#tabla_asignaciones").html("");
	$("#tabla_asignaciones").append("\n\
		<div class='table-responsive noSwipe'> \n\
			<table id='table2' class='table table-striped table-hover'>\n\
				<thead>\n\
					<tr class='nexos-encabezado'>\n\
						<th style='width:10%;'>#</th>\n\
						<th>Placa vehiculo</th>\n\
						<th>Flete</th>\n\
						<th>Tipo vehiculo</th>\n\
						<th>Fecha postulación</th>\n\
						<th>Calificación</th>\n\
						<th style='width:10%;min-width: 10%;'>\n\
						</th>\n\
					</tr>\n\
				</thead>\n\
				<tbody>\n\
					<tr> \n\
						<td colspan='7' style='text-align:center;'>No hay registros en esta tabla </td>\n\
					</tr> \n\
				</tbody>\n\
			</table>\n\
		</div>\n\
	");
	$.ajaxSetup({async: false});
	var param = {
		accion: "cargarvehiculos",
		id_solicitud: id_solicitud
	};
	$.post(url, param, function (data) {
		vehiculos = [];
		console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				vehiculos.push(data.content[x]['placa']);
			}
			$('#caja_vehiculo .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(vehiculos),
			});

			console.log(vehiculos)
			$("#placa_vehiculo").focusout(function () {
				console.log($.inArray($("#placa_vehiculo").val(), states));
				if ($.inArray($("#placa_vehiculo").val(), states) == (-1)) {
					$("#id_caja_vehiculo").val("");
				} else {}
			});

			$('#caja_vehiculo').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'obtenerdatosvehiculo',
					placa: datum
				};
				$.post(url, params, function (data) {
					if (data.success) {
						$("#id_vehiculo").val(data.content.id);
						$("#flete").focus();
					} else {
						$("#id_vehiculo").val("");
					}
					console.log("paso1");
				}, 'json');
			});
		} else {}
	}, 'json');
	$.ajaxSetup({async: true});
	console.log("paso2");
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		if (data.success) {
			console.log(data.content);
			$("#tabla_asignaciones").html("");
			let contenido = "";
			contenido += "\n\
				<div class='table-responsive noSwipe'> \n\
					<table id='table2' class='table table-striped table-hover'>\n\
						<thead>\n\
							<tr class='nexos-encabezado'>\n\
								<th style='width:10%;'>#</th>\n\
								<th>Placa vehiculo</th>\n\
								<th>Flete</th>\n\
								<th>Tipo vehiculo</th>\n\
								<th>Fecha postulación</th>\n\
								<th>Calificación</th>\n\
								<th style='width:10%;min-width: 10%;'></th>\n\
							</tr>\n\
						</thead>\n\
						<tbody>\n\
			";
			for (let i = 0; i < data.content.length; i++) {
				if (data.content[i]["estado"] == "Asignado") {
					contenido += "\n\
						<td class='nexos-txt-default'> \n\
							<span class='mdi mdi-dot-circle icon'></span> \n\
							</td>\n\
					";
				} else if (data.content[i]["estado"] == "Aprobado") {
					contenido += "\n\
						<td class='nexos-txt-success'> \n\
							<span class='mdi mdi-dot-circle icon'></span> \n\
						</td>\n\
					";
				} else if (data.content[i]["estado"] == "Preaprobado") {
					contenido += "\n\
						<td class='nexos-txt-warning'> \n\
							<span class='mdi mdi-dot-circle icon'></span> \n\
							</td>\n\
						";
					} else if (data.content[i]["estado"] == "Pendiente") {
						contenido += "\n\
							<td class='nexos-txt-warning'> \n\
								<span class='mdi mdi-dot-circle icon'></span> \n\
							</td>\n\
						";
					} else if (data.content[i]["estado"] == "No Aprobado") {
						contenido += "\n\
							<td class='nexos-txt-danger'> \n\
								<span class='mdi mdi-dot-circle icon'></span> \n\
							</td>\n\
						";
					} else if (data.content[i]["estado"] == "Cancelado") {
						contenido += "\n\
							<td class='nexos-txt-primary'> \n\
								<span class='mdi mdi-dot-circle icon'></span> \n\
							</td>\n\
						";
					}
					contenido += "\n\
							<td class='cell-detail' ><span >" + data.content[i]["placa"] + "</span></td> \n\
						<td class='cell-detail' ><span >" + data.content[i]["flete"] + "</span></td> \n\
						<td class='cell-detail' ><span >" + data.content[i]["tipo_vehiculo"] + "</span></td> \n\
						<td class='cell-detail' ><span >" + data.content[i]["fecha_postulacion"] + "</span></td> \n\
						<td class='cell-detail' ><span >" + data.content[i]["calificacion"] + "</span></td> \n\
						<td class='actions'>\n\
							<a href='javascript:' class='cell-detail hint--top-left' data-hint='Editar y ver informacion' onclick='editardatossolicitudvehiculos(" + data.content[i]["id"] + ")' ><span class='icon mdi mdi-edit' data-toggle='modal' data-target='#editar_asignaciones'></span></a>\n\
						</td> \n\
					</tr>\n\
				";
			}
			contenido += "</tbody> \n\
				 </table> \n\
				 </div> \n\
				 </div> \n\
				 </div>";
			$("#tabla_asignaciones").append(contenido);
		} else {}
	}, 'json');
	$.ajaxSetup({async: true});
}

function crearsolicitudVehiculo() {
	var params = {
		accion: 'crearsolicitudVehiculo',
		id_vehiculo: $("#id_vehiculo").val(),
		cedula_tenedor: $("#cedula_tenedor").val(),
		nombre_tenedor: $("#nombre_tenedor").val(),
		cedula_conductor: $("#cedula_conductor").val(),
		nombre_conductor: $("#nombre_conductor").val(),
		referencias_empresariales: $("#referencias_empresariales").val(),
		referencias_personales: $("#referencias_personales").val(),
		calificacion: $("#calificacion").val(),
		estado: $("#estado").val(),
		pendientes: $("#pendientes").val()
	};
	var data = null;
	data = new FormData();
	var archivos = document.getElementById('documentos').files;
	for (var x = 0; x < archivos.length; x++) {
		data.append("documentos" + x, archivos[x]);
	}

	data.append("accion", 'crearsolicitudVehiculo');
	data.append("id_vehiculo", $("#id_vehiculo").val());
	data.append("flete", $("#flete").val());
	data.append("cedula_tenedor", $("#cedula_tenedor").val());
	data.append("nombre_tenedor", $("#nombre_tenedor").val());
	data.append("cedula_conductor", $("#cedula_conductor").val());
	data.append("nombre_conductor", $("#nombre_conductor").val());
	data.append("referencias_empresariales", $("#referencias_empresariales").val());
	data.append("referencias_personales", $("#referencias_personales").val());
	data.append("calificacion", $("#calificacion").val());
	data.append("estado", $("#estado_asignacion").val());
	data.append("pendientes", $("#info_pendientes").val());
	data.append("id_solicitud", $("#asig_id_solicitud").val());

	$.ajax({
		url: url,
		type: 'POST',
		data: data,
		cache: false,
		processData: false, // Don't process the files
		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		dataType: 'json',
		success: function (data, textStatus, jqXHR)
		{
			console.log(data);
			if (data.success) {
				location.reload();
			} else {}
		},
		error: function (jqXHR, textStatus, errorThrown)
		{}
	});
}

var e_vehiculos = [];
function editardatossolicitudvehiculos(id_solicitud_vehiculo) {
	$("#e_caja_enlaces_documentos").html("");
	$("#e_id_solicitud_vehiculo").val(id_solicitud_vehiculo);
	var params = {
		accion: 'editardatossolicitudvehiculos',
		id_solicitud_vehiculo: id_solicitud_vehiculo
	};
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		if (data.success) {
			$("#e_placa_vehiculo").val(data.content["placa"]);
			$("#e_id_vehiculo").val(data.content["id_vehiculo"]);
			$("#e_flete").val(data.content["flete"]);
			$("#e_cedula_tenedor").val(data.content["cedula_tenedor"]);
			$("#e_nombre_tenedor").val(data.content["nombre_tenedor"]);
			$("#e_cedula_conductor").val(data.content["cedula_conductor"]);
			$("#e_nombre_conductor").val(data.content["nombre_conductor"]);
			$("#e_referencias_empresariales").val(data.content["referencias_empresariales"]);
			$("#e_referencias_personales").val(data.content["referencias_personales"]);
			$("#e_documentos_soporte").val(data.content["documentos_soporte"]);
			$("#e_info_pendientes").val(data.content["pendientes"]);
			$("#e_calificacion").val(data.content["calificacion"]);
			$("#e_estado_asignacion").val(data.content["estado"]);
			$("#e_caja_enlaces_documentos").html(data.archivos);
		} else {}
	}, 'json');
	$.ajaxSetup({async: true});
	$.ajaxSetup({async: false});
	var param = {
		accion: "cargarvehiculos",
		id_solicitud: $("#asig_id_solicitud").val()
	};
	$.post(url, param, function (data) {
		e_vehiculos = [];
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				e_vehiculos.push(data.content[x]['placa']);
			}
			$('#e_caja_vehiculo .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(e_vehiculos),
			});
			console.log(e_vehiculos);
			$("#e_placa_vehiculo").focusout(function () {
				console.log($.inArray($("#e_placa_vehiculo").val(), states));
				if ($.inArray($("#e_placa_vehiculo").val(), states) == (-1)) {
					$("#e_id_caja_vehiculo").val("");
				} else {}
			});

			$('#e_caja_vehiculo').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'obtenerdatosvehiculo',
					placa: datum
				};
				$.post(url, params, function (data) {
					if (data.success) {
						$("#e_id_vehiculo").val(data.content.id);
						$("#e_flete").focus();
					} else {
						$("#e_id_vehiculo").val("");
					}
				}, 'json');
			});
		} else {}
	}, 'json');
	$.ajaxSetup({async: true});
}

function editarsolicitudVehiculo() {
	var data = null;
	data = new FormData();
	var archivos = document.getElementById('e_documentos').files;
	console.log(archivos.length);
	for (var x = 0; x < archivos.length; x++) {
		data.append("documentos" + x, archivos[x]);
	}

	data.append("accion", 'editarsolicitudVehiculo');
	data.append("id_solicitud_vehiculo", $("#e_id_solicitud_vehiculo").val());
	data.append("id_vehiculo", $("#e_id_vehiculo").val());
	data.append("flete", $("#e_flete").val());
	data.append("cedula_tenedor", $("#e_cedula_tenedor").val());
	data.append("nombre_tenedor", $("#e_nombre_tenedor").val());
	data.append("cedula_conductor", $("#e_cedula_conductor").val());
	data.append("nombre_conductor", $("#e_nombre_conductor").val());
	data.append("referencias_empresariales", $("#e_referencias_empresariales").val());
	data.append("referencias_personales", $("#e_referencias_personales").val());
	data.append("calificacion", $("#e_calificacion").val());
	data.append("estado", $("#e_estado_asignacion").val());
	data.append("pendientes", $("#e_info_pendientes").val());
	data.append("documentos_soporte", $("#e_documentos_soporte").val());
	data.append("id_solicitud", $("#asig_id_solicitud").val());
	$.ajax({
		url: url,
		type: 'POST',
		data: data,
		cache: false,
		processData: false, // Don't process the files
		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		dataType: 'json',
		success: function (data, textStatus, jqXHR)
		{
			console.log(data);
			if (data.success) {
				location.reload();
			} else {}
		},
		error: function (jqXHR, textStatus, errorThrown)
		{}
	});
}

function finalizardatossolicitud(id_solicitud) {
	var params = {
		accion: 'obtenerdatossolicitud',
		id_solicitud: id_solicitud
	};
	$.post(url, params, function (data) {
		if (data.success) {
			$("#f_num_solicitud").text(" ¿Desea finalizar la Solicitud #" + data.content["numero_solicitud"] + " ?")
			$("#f_id_solicitud").val(data.content["id_solicitud"]);
		} else {
			alert("error");
		}
	}, 'json');
}

function finalizarSolicitud() {
	var params = {
		accion: 'finalizarSolicitud',
		id_solicitud: $("#f_id_solicitud").val()
	};
	$.post(url, params, function (data) {
		if (data.success) {
			$("#btn_finalizar_solicitud").attr("data-dismiss", "modal");
			location.reload();
		} else {
			$("#btn_finalizar_solicitud").removeAttr("data-dismiss");
		}
	}, 'json');
}

function calcula_unidades( tramo , posicion_material ){
	// Tomo la cantidad inicial del material 
	var cantidad_inicial = $("#e_unidades_1_" + posicion_material).val();
	var flag_resta = false;
	var cuenta_tramos = 0;
	var ultima_cantidad = "";
	for (var i = 2; i <= tramo; i++) {
		if ($("#e_caja_tramo" + i ).css("display") == "block") {
			cuenta_tramos++;
			if (flag_resta) {
				cantidad_a_restar+= parseInt( $("#e_unidades_" + i + "_" + posicion_material).val() );
				ultima_cantidad = parseInt( $("#e_unidades_" + i + "_" + posicion_material).val() );
			}else{
				var cantidad_a_restar = parseInt( $("#e_unidades_" + i + "_" + posicion_material).val() );
				flag_resta = true;
			}
		}
	}

	if ( cuenta_tramos > 1 ) {
		var disponibles = cantidad_inicial - cantidad_a_restar + ultima_cantidad;
		$("#e_unidades_" + ( i - 1 ) + "_" + posicion_material).val(disponibles);
	}
}