$(document).ready(function () {
	cargartiposvehiculos();
	// console.log(info_vehiculos);
	$("#btn_buscar_solicitudes_seleccionadas").click(function () {
		buscarsolicitudesseleccionadas();
	});

	$("#btn_crear_agrupacion").click(function(){
		console.log("Entro en archivo agrupaciones_ajax.js - btn_crear_agrupacion");
		$("#error_agrupamiento").html('');
		let errores="";
		let flag_valida_flete = false;

		// Cuando se selecciona mas de una solicitud de la lista
		if(numero_seleccionados>1){
			console.log("Varias solicitudes seleccionadas");

			// Se habilita la gestion de la actividad 
			flag_valida_flete = true; 

			let a_solicitudes= new Array();
			let y=0;
			let cantidad_solicitada_acumulada = 0;
			let temp_tarifa_adicional_otra_ciudad = 0;
			let suma_valor_compra = 0;
			let suma_valor_venta = 0;
			let peso_total_vehiculo=0;
			let peso_total_solicitud_disponible = new Array();
			let peso_total_solicitud_solicitado = new Array();
			let array_valor_prorrateo = new Array();
			let total_valor_vehiculos = 0;
			let arrayListaTarifas = new Array();
			let tarifa_base_transporte = 0;
			let arrayDestinos = new Array();
			// let arrayListaValorProrrateo = new Array();

			$(".check_solicitudes").each(function() {
				if ( $(this).is(':checked') ) {
					let id_solicitud = $(this).val();
					let x = id_solicitud; // Se cuadra el machetazo hecho por el programador anterior
					let cantidad_materiales = $("#cant_materiales_" + id_solicitud).val();
					let valor_compra =  parseInt($("#valor_compra" + id_solicitud).val());
					let valor_venta =  parseInt($("#valor_venta" + id_solicitud).val());
					let peso_total_carga =  parseFloat($("#peso_total_carga" + id_solicitud).val());
					id_contrato = $("#id_contrato" + id_solicitud).val();

					// // Variables que vienen de la seleccion de varias solicitudes
					peso_solicitud= parseFloat($("#peso_solicit" + id_solicitud).val());
					let id_origen = $("#id_origen" + id_solicitud).val();
					let id_ciudad_origen = $("#id_ciudad_origen" + id_solicitud).val();
					let id_tipo_carga = $("#id_tipo_carga" + id_solicitud).val();
					let flete_acumulado = $("#flete_acumulado" + id_solicitud).val();
					let prorrateo_acumulado = $("#prorrateo_acumulado" + id_solicitud).val();

					// SE BUSCA LA TARIFA DEL TRAMO 
					let a_tarifas = new Array();
					let id_ciudad_destino = $("#id_ciudad_destino_" + id_solicitud + "_0").val();

					// Se averigua cuales son los destinos pra tomar la tarifa adicional
					if ( arrayDestinos[ id_ciudad_destino ] ) {
						arrayDestinos[ id_ciudad_destino ]++;
					} else {
						arrayDestinos[ id_ciudad_destino ] = 1;
					}

					a_tarifas = {
						accion: 'buscartarifa',
						id_contrato: id_contrato,
						destino: id_ciudad_destino,
						tipo_carga: id_tipo_carga,
						tipo_vehiculo: $("#id_tipo_vehiculo").val(),
					}
					// console.log(a_tarifas);

					$.ajaxSetup({async: false});
					$.ajax({
						type		: "POST",
						cache		: false,
						url			: url,
						data		: a_tarifas,
						dataType	: "json",
						error: function (jqXHR, textStatus, errorThrown){
							errores+= "<p>" + jqXHR.responseText + "</p>";
							console.log(jqXHR);
							console.log(textStatus);
							console.log(errorThrown);
						},
						success		: function(data) {
							// console.log(data);
							if ( parseInt(data) == 0 ) {
								flag_valida_presupuesto = false;
								errores+= "<p>Tarifa no existente para verificación de flete en la solicitud <strong>" + $("#numero_solicit" + x).val() + "</strong>, por favor genere la tarifa correpondiente.</p>";
							}else{
								if ( tarifa_base_transporte < parseInt(data) ) {
									tarifa_base_transporte = data;
								}
							}
						}
					});
					$.ajaxSetup({async: true});

					// Se acumula el valor de compra de las solicitudes seleccionadas
					suma_valor_compra+= parseInt(valor_compra);
					suma_valor_venta+= parseInt(valor_venta);

					// Se relaciona los materiales de la solicitud
					cantidad_solicitada_acumulada = 0;
					for (var i = 0; i < cantidad_materiales; i++) {
						let id_material = $("#id_material_" + id_solicitud + "_" + i).val();
						let id_material_proyecto = $("#id_material_proyecto_" + id_solicitud + "_" + i).val();
						let id_material_solicitud = $("#id_material_solicitud_" + id_solicitud + "_" + i).val();
						let peso_disponible = $("#disponible_fijo_" + id_material + "_" + x).val();
						let material = $("#tipo_mercancia_" + id_material + "_" + x).val();
						let valor_declarado = $("#valor_declarado_" + id_material + "_" + x).val(); // Corresponde al valor declarado del material
						let peso_total = $("#peso_total_" + id_material + "_" + x).val();
						let unidades_totales = $("#unidades_totales_" + id_material + "_" + x).val();
						let cantidad_solicitada = $("#cantidad_solicitada_" + id_material + "_" + x).val();

						// se suma el peso disponible total de la solicitud
						if (peso_total_solicitud_disponible[$("#num_sol" + x).attr("name")]) {
							peso_total_solicitud_disponible[$("#num_sol" + x).attr("name")] += parseFloat(peso_disponible); 
						} else {
							peso_total_solicitud_disponible[$("#num_sol" + x).attr("name")] = parseFloat(peso_disponible); 
						}

						if ( cantidad_solicitada > 0 ) {
							cantidad_solicitada_acumulada += parseInt(cantidad_solicitada);
							// Se calcula las unidades del material de acuerdo con el peso solicitado 
							var peso_solicitado = cantidad_solicitada * ( peso_total / unidades_totales );

							// Se hace el ajuste al peeso solicitado del material si se va todo el material
							if ( unidades_totales == cantidad_solicitada ) {
								peso_solicitado = peso_disponible;
							}

							$("#peso_disponible_" + id_material + "_" + x).val(peso_solicitado);

							// Se calcula el peso pendiente
							let peso_pendiente = peso_disponible - peso_solicitado;

							// se suma el peso solicitado total de la solicitud 
							if (peso_total_solicitud_solicitado[$("#num_sol" + x).attr("name")]) {
								peso_total_solicitud_solicitado[$("#num_sol" + x).attr("name")] += parseFloat(peso_solicitado); 
							} else {
								peso_total_solicitud_solicitado[$("#num_sol" + x).attr("name")] = parseFloat(peso_solicitado); 
							}

							// Se verifica que el peso solicitado del material no supere el peso disponible
							if ( parseInt(peso_solicitado) > parseInt(peso_disponible) ) {
								errores+='El peso del material <strong>' + material + '</strong> que pertenece a la solicitud <strong>' + $("#numero_solicit" + x).val() + '</strong> es mayor a la cantidad disponible.<br>';
							}

							peso_total_vehiculo = parseFloat(peso_total_vehiculo) + parseFloat(peso_solicitado);

							let valor_declarado_parcial = parseInt( (peso_solicitado * valor_declarado ) / peso_total );
							a_solicitudes[y]={
								id_solicitud:$("#num_sol" + x).attr("name"),
								peso_solicit : peso_solicitado,
								peso_pendiente : peso_pendiente,
								id_material : id_material,
								id_material_proyecto : id_material_proyecto,
								id_material_solicitud : id_material_solicitud,
								valor_declarado : valor_declarado,
								valor_declarado_parcial: valor_declarado_parcial,
								unidades_solicitadas : cantidad_solicitada,
							}
							y++;
						}
					}

					// Se calcula el valor prorrateado del presupuesto de cada solicitud
					array_valor_prorrateo[ $("#num_sol" + x).attr("name") ] = Math.round( ( peso_total_solicitud_solicitado[$("#num_sol" + x).attr("name")] * valor_compra ) / peso_total_carga );

					// Se filtra si se seleccionó materiales de la solicitud 
					if ( cantidad_solicitada_acumulada == 0 ) {
						errores+='<p>Debe seleccionar material para la solicitud <strong>' + $("#numero_solicit" + x).val() + '</strong> y poder continuar con el agrupamiento.</p>';
					}
				}
			});
			// console.log(a_solicitudes);
			// console.log(array_valor_prorrateo);

			let cuenta_cantidad_destinos = 0;
			let temp_tarifa_adicional_urbano = 0; 
			let tarifa_adicional_urbano = 0;
			// Se buscan los trayectos adicionales en una misma ciudad
			for (var i = 0; i < arrayDestinos.length; i++) {
				// console.log(arrayDestinos[i]);
				if ( arrayDestinos[i] ) {
					cuenta_cantidad_destinos++;
					// Si hay mas de un cargue en el destino se aplica la tarifa adcional en la misma cuidad
					if ( arrayDestinos[i] > 1 ) {
						var param_tarifa_adicional = {
							accion: 'buscaTarifaAdicional',
							tipo_vehiculo: $("#id_tipo_vehiculo").val(),
							tipo_entrega: "URBANO"
						}
						// console.log(param_tarifa_adicional);

						$.ajaxSetup({async: false});
						$.ajax({
							type		: "POST",
							cache		: false,
							url			: url,
							data		: param_tarifa_adicional,
							// dataType	: "json",
							error: function (jqXHR, textStatus, errorThrown){
								errores+= "<p>" + jqXHR.responseText + "</p>";
								console.log(jqXHR);
								console.log(textStatus);
								console.log(errorThrown);
							},
							success		: function(data) {
								let arrayData = data.split('"');
								// console.log(arrayData);
								if ( arrayData[1] ) {
									temp_tarifa_adicional_urbano = parseInt( arrayData[1] ); 
								} 
							}
						});
						$.ajaxSetup({async: true});
						tarifa_adicional_urbano = temp_tarifa_adicional_urbano * ( arrayDestinos[i] - 1 );
					}
				}
			}

			// Se buscan los trayectos adicionales en varias ciudades 
			let tarifa_adicional_otra_ciudad = 0; 
			if ( cuenta_cantidad_destinos > 1 ) {
				var param_tarifa_adicional = {
					accion: 'buscaTarifaAdicional',
					tipo_vehiculo: $("#id_tipo_vehiculo").val(),
					tipo_entrega: "OTRA_CUIDAD"
				}
				// console.log(param_tarifa_adicional);

				$.ajaxSetup({async: false});
				$.ajax({
					type		: "POST",
					cache		: false,
					url			: url,
					data		: param_tarifa_adicional,
					// dataType	: "json",
					error: function (jqXHR, textStatus, errorThrown){
						errores+= "<p>" + jqXHR.responseText + "</p>";
						console.log(jqXHR);
						console.log(textStatus);
						console.log(errorThrown);
					},
					success		: function(data) {
						let arrayData = data.split('"');
						// console.log(arrayData);
						if ( arrayData[1] ) {
							temp_tarifa_adicional_otra_ciudad = parseInt( arrayData[1] ); 
						} 
					}
				});
				$.ajaxSetup({async: true});
			}

			if($("#id_tipo_vehiculo").val() == ""){
				errores+="<p>Debe seleccionar un tipo de vehículo.</p>";
			}else{
				tarifa_adicional_otra_ciudad = temp_tarifa_adicional_otra_ciudad * ( cuenta_cantidad_destinos - 1 );
				let peso_max =verificarpesos($("#id_tipo_vehiculo").val());
				if(peso_total_vehiculo>peso_max){
					errores+="<p>El peso de la carga excede el peso máximo de cargue del vehículo seleccionado.</p>";
				}
			}
			// console.log("tarifa_base_transporte - " + tarifa_base_transporte);
			// console.log("tarifa_adicional_urbano - " + tarifa_adicional_urbano);
			// console.log("tarifa_adicional_otra_ciudad - " + tarifa_adicional_otra_ciudad);

			// Se totaliza le costo de l aoperación 
			tarifa_base_transporte = parseInt(tarifa_base_transporte) + parseInt(tarifa_adicional_urbano) + parseInt(tarifa_adicional_otra_ciudad);
			// console.log("tarifa_base_transporte total con adicionales - " + tarifa_base_transporte);

			// Se compara el valor de la tarifa base con el presupuesto de cada una de las solicitudes seleccionadas 
			let arrayEstadoValidacionSolicitudes = new Array();
			$(".check_solicitudes").each(function() {
				let id_solicitud = $(this).val();
				let valor_compra =  parseInt($("#valor_compra" + id_solicitud).val());
				let valor_venta =  parseInt($("#valor_venta" + id_solicitud).val());
				let flete_acumulado = $("#flete_acumulado" + id_solicitud).val();
				let prorrateo_acumulado = $("#prorrateo_acumulado" + id_solicitud).val();
				// console.log("valor_compra - " + valor_compra);
				// console.log("flete_acumulado - " + flete_acumulado);
				// console.log("prorrateo_acumulado - " + prorrateo_acumulado);

				estado = 1;
				if ( ( parseInt(flete_acumulado) + parseInt(tarifa_base_transporte) ) > parseInt(valor_compra) ) {
					estado = 2;
					return false;
					// errores+= "El valor de la tarifa <strong>" + total_valor_vehiculos + "</strong> se pasa del presupuesto del proyecto <strong>" + valor_compra + "</strong>.<br>";
				}
				arrayEstadoValidacionSolicitudes[id_solicitud] = estado;
			});
			// console.log(arrayEstadoValidacionSolicitudes);

			var params = {
				accion: 'agruparsolicitudes',
				tipo_vehiculo: $("#id_tipo_vehiculo").val(),
				solicitudes: a_solicitudes,
				codigo_rojo :  $("#codigo_rojo").is(':checked'),
				peso_disponible_solicitud: peso_total_solicitud_disponible,
				peso_solicitado_solicitud: peso_total_solicitud_solicitado,
				tarifa_transporte: tarifa_base_transporte,
				valor_prorrateo: array_valor_prorrateo,
				estado: estado
			};
			// console.log(params);
		}
		// Cuando se selecciona una solicitud de la lista
		if(numero_seleccionados==1){
			console.log("Una solicitud seleccionada");
  			let a_vehiculos= new Array();
  			let y=0;
			let id_solicitud;
			let valor_compra;
			let valor_venta;
			let id_origen;
			let id_tipo_carga;
			let peso_solicitud=0;
			let incluyeTara = false;

			$(".check_solicitudes").each(function() {
				if ( $(this).is(':checked') ) {
					id_solicitud = $(this).val();
					peso_solicitud= parseFloat($("#peso_solicit" + id_solicitud).val());
					valor_compra =  parseInt($("#valor_compra" + id_solicitud).val());
					valor_venta =  parseInt($("#valor_venta" + id_solicitud).val());
					id_origen = $("#id_origen" + id_solicitud).val();
					id_ciudad_origen = $("#id_ciudad_origen" + id_solicitud).val();
					id_tipo_carga = $("#id_tipo_carga" + id_solicitud).val();
					id_contrato = $("#id_contrato" + id_solicitud).val();
					porcentaje_ganancia = $("#porcentaje_ganancia" + id_solicitud).val();
					flete_acumulado = $("#flete_acumulado" + id_solicitud).val();
					prorrateo_acumulado = $("#prorrateo_acumulado" + id_solicitud).val();
					tara_contenedor = $("#tara_contenedor" + id_solicitud).val();
					peso_total_carga =  parseFloat($("#peso_total_carga" + id_solicitud).val());
				}
			});

			let peso_total_solicitud=0;
			let suma_peso_material = new Array();
			let suma_unidades_material = new Array();
			let valor_declarado_por_material = new Array();
			let peso_total_por_material = new Array();
			let array_id_material = new Array();
			let nombre_material = new Array();
			let peso_por_vehiculo = 0;
			let arrayPeso_por_vehiculo = new Array();
			let peso_disponible_material = new Array();
			let arrayListaTarifas = new Array();
			let arrayListaValorProrrateo = new Array();
			let cantidad_materiales;
			let total_valor_vehiculos = 0;
			let flag_valida_presupuesto = true;

			for (let x = 1; x <= num_vehic_asig; x++) {
				let a_materiales = new Array();

				cantidad_materiales = $("#cant_materiales_" + id_solicitud).val();
				peso_por_vehiculo = 0;
				y++;

				// Se calculan los pesos digitados en el formulario
				for (var i = 0; i < cantidad_materiales; i++) {
					let id_material = $("#id_material_" + id_solicitud + "_" + i).val();
					let id_material_solicitud = $("#id_material_solicitud_" + id_solicitud + "_" + i).val();
					let id_material_proyecto = $("#id_material_proyecto_" + id_solicitud + "_" + i).val();
					let peso_solicitado = $("#peso_disponible_" + id_material + "_" + x).val();
					let peso_disponible = $("#disponible_fijo_" + id_material + "_" + x).val();
					let material = $("#tipo_mercancia_" + id_material + "_" + x).val();
					let valor_declarado = $("#valor_declarado_" + id_material + "_" + x).val();
					let peso_total = $("#peso_total_" + id_material + "_" + x).val();
					let unidades_totales = $("#unidades_totales_" + id_material + "_" + x).val();
					let cantidad_solicitada = $("#cantidad_solicitada_" + id_material + "_" + x).val();

					valor_declarado_por_material[i] = parseInt(valor_declarado);
					peso_total_por_material[i] = parseInt(peso_total);
					array_id_material[i] = parseInt(id_material);
					peso_disponible_material[i] = parseFloat(peso_disponible);
					nombre_material[i] = material;

					// Se suma el peso solicitado filtrado por material
					if (suma_unidades_material[i]) {
						suma_unidades_material[i]+= parseInt(cantidad_solicitada) ;
					}else{
						suma_unidades_material[i] = parseInt(cantidad_solicitada);
					}

					// Se calcula las unidades del material de acuerdo con el peso solicitado 
					var peso_ajustado = calcular_peso(peso_total, unidades_totales, cantidad_solicitada);

					// Se hace el ajuste al peeso solicitado del material
					if ( unidades_totales == cantidad_solicitada ) {
						peso_ajustado = peso_disponible;
					}

					$("#peso_disponible_" + id_material + "_" + x).val(peso_ajustado);

					// Se suma le peso solicitado filtrado por material
					if (suma_peso_material[i]) {
						suma_peso_material[i]+= parseFloat(peso_ajustado) ;
					}else{
						suma_peso_material[i] = parseFloat(peso_ajustado);
					}
					let peso_pendiente = peso_disponible - peso_ajustado;

					// Se suma el peso de material solicitado por vehiculo 
					peso_por_vehiculo += parseFloat(peso_ajustado);

					// Se toma el valor declarado por la cantidad de material solicitado
					valor_declarado_por_material = ( parseFloat(peso_ajustado) * parseInt(valor_declarado)  ) / parseFloat(peso_total);

					a_materiales[i]={
						id_material: id_material,
						id_material_solicitud: id_material_solicitud,
						id_material_proyecto: id_material_proyecto,
						peso: peso_ajustado,
						peso_pendiente: peso_pendiente, 
						valor_declarado: parseInt(valor_declarado_por_material),
						cantidad_solicitada: parseInt(cantidad_solicitada)
					}
				}

				// Se verifica la tarifa del trayecto
				if($("#id_tipo_vehiculo"+x).val()!=""){
					// console.log("se busca la tarifa del servicio");
					for (var j = 0; j < $("#cuenta_tramos_" + id_solicitud + "_" + x).val(); j++) {
						let a_tarifas = new Array();
						let id_ciudad_destino = $("#id_ciudad_destino_" + id_solicitud + "_" + j ).val();
						a_tarifas = {
							accion: 'buscartarifa',
							id_contrato: id_contrato,
							destino: id_ciudad_destino,
							tipo_carga: id_tipo_carga,
							tipo_vehiculo: $("#id_tipo_vehiculo"+x).val(),
						}
						// console.log(a_tarifas);

						$.ajaxSetup({async: false});
						$.ajax({
							type		: "POST",
							cache		: false,
							url			: url,
							data		: a_tarifas,
							dataType	: "json",
							error: function (jqXHR, textStatus, errorThrown){
								errores+= "<p>" + jqXHR.responseText + "</p>";
								console.log(jqXHR);
								console.log(textStatus);
								console.log(errorThrown);
							},
							success		: function(data) {
								// console.log(data);
								if ( parseInt(data) == 0 ) {
									flag_valida_presupuesto = false;
									errores+= "<p>Tarifa para el contrato no existente para verificación de flete.</p>";
								}else{
									total_valor_vehiculos += parseInt(data);
									arrayListaTarifas[x] = parseInt(data);
									// Se prorratea el valor del presupuesto con el peso del material del agrupamiento 
									let valor_prorrateo = Math.round( (peso_por_vehiculo * (valor_compra - prorrateo_acumulado) ) / peso_solicitud );
									arrayListaValorProrrateo[x] = valor_prorrateo;
								}
							}
						});
						$.ajaxSetup({async: true});
					}
				}
				arrayPeso_por_vehiculo[x] = peso_por_vehiculo;

				// Se valida que no existan vehículos sin asignar material 
				if ( peso_por_vehiculo == 0 ) {
					errores+="<p>Debe ingresar pesos de material para el <strong>Vehículo "+y+"</strong>.</p>";
				}

				a_vehiculos[y]={
					peso_vehiculo: arrayPeso_por_vehiculo[x],
					tipo_vehiculo: $("#id_tipo_vehiculo"+x).val(),
					codigo_rojo: $("#codigo_rojo"+x).is(':checked'),
					materiales : a_materiales,
					tarifa_transporte : arrayListaTarifas[x],
					valor_prorrateo : arrayListaValorProrrateo[x]
				}

				var flag_tipo_vehiculo = true;
				if($("#id_tipo_vehiculo"+x).val()==""){
					errores+="<p>Debe seleccionar un tipo de vehículo para el <strong> Vehículo "+y+"</strong>.</p>";
					flag_tipo_vehiculo = false;
				}

				// Se busca el peso máxinmo del tipo de vehículo
				let peso_max =verificarpesos($("#id_tipo_vehiculo"+x).val());

				// Se filta el peso de la carga si se debe sumar la tara 
				var peso_carga = peso_por_vehiculo;

				// Pregunto si solo se está solicitando un vehículo
				if ( num_vehic_asig == 1 ) {
					// Se pregunta si se va a enviar todo el material de la solicitud 
					if ( peso_total_carga == peso_carga ){
						// Se pregunta si el material viene en un contenedor
						if (tara_contenedor > 0 ) {
							var params = {
								accion: 'buscaDesconsolidacion',
								id_solicitud: parseInt(id_solicitud),
							};
							// console.log(params);

							$.ajaxSetup({async: false});
							$.ajax({
								type		: "POST",
								cache		: false,
								url			: url,
								data		: params,
								dataType	: "json",
								success		: function(data) {
									// console.log(data);
									if ( data == 0 ) {
										peso_carga = parseFloat(peso_carga) + parseFloat(tara_contenedor);
										incluyeTara = true;
									}
								}
							});
							$.ajaxSetup({async: true});
						}
					}
				}

				// Se valida la capacidad del vehículo seleccionado  
				if( peso_carga > parseFloat(peso_max) && flag_tipo_vehiculo){
					errores+="<p>El peso para el <strong>Vehículo "+y+"</strong> de <strong>" + parseInt(peso_carga) + " Kg</strong> excede su capacidad máxima de <strong>" + parseFloat(peso_max) + " Kg</strong>.</p>";
					if ( incluyeTara ) {
						errores+="<p>Se debe tener en cuenta el peso de la tara <strong>" + tara_contenedor + " Kg</strong>.</p>";
					}
				}
				peso_total_solicitud+=parseFloat( peso_por_vehiculo );
			}
			$("#peso_total_solicitud").val(peso_total_solicitud);

			// Se valida si los vehículos solicitados no superan el presupuesto inicial de la solicitud y se asigna el estado correspondiente
			let estado = 1;
			if( flag_valida_presupuesto ){
				if ( ( parseInt(flete_acumulado) + parseInt(total_valor_vehiculos) ) > parseInt(valor_venta) ) {
					estado = 2;
				}else{
					// Se calcula la reantabilidad de la operacion 
					let rentabilidad = (( valor_venta - ( parseInt(flete_acumulado) + parseInt(total_valor_vehiculos) ) ) / valor_venta) * 100;
					// Se verifica si la operacion es rentable 
					if ( rentabilidad < porcentaje_ganancia ) {
						estado = 2;
					}
				}
			}

			// Se valida contenido del formulario
			for (var i = 0; i < cantidad_materiales; i++) {
				// se verifica que le peso solicitado no supere el peso disponible
				if ( parseInt(suma_peso_material[i]) > parseInt(peso_disponible_material[i]) ) {
					errores+="<p>El peso total solicitado de " + parseInt(suma_peso_material[i]) + "Kg del material <strong>" + nombre_material[i] + "</strong> es superior a la cantidad disponible de " + parseInt(peso_disponible_material[i]) + "Kg.</p>";
				}
			}

			if( parseInt(peso_total_solicitud) > parseInt(peso_solicitud) ){
				errores+="<p>La suma de los pesos de los vehículos debe ser menor a " + parseFloat(peso_solicitud) + " kg.</p>";
			}

			var params = {
				accion: 'desagruparsolicitudes',
				id_solicitud: parseInt(id_solicitud),
				vehiculos: a_vehiculos,
				cuenta_vehiculos: a_vehiculos.length,
				suma_peso_material: suma_peso_material,
				suma_unidades_material: suma_unidades_material,
				estado: estado
			};
			// console.log(params);
		}

		if(!errores){
			console.log("No hay errores");
			$.ajaxSetup({async: false});
			$.post(url, params, function (data) {
				// console.log(data);
				if (data.success) {
					$(".nexos-messages").html('<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' + $("#id_url_ajax").val() + 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>');
					console.log("Operación exitosa");
					var url_desconsolidar = $("#id_url_ajax").val() + "libs/importaciones.php?action=desconsolidar&origen=agrupaciones&flag_gestion=" + flag_valida_flete;
					var url_gestion_actividad = $("#id_url_ajax").val() + "libs/gestion_actividades.php?tabla=cmx_importacion_actividades&proyecto=importaciones";

					// Se pregunta si hay material restante
					if (data.materiales) {
						console.log("Parámetros de una solicitud a uno o muchos vehículos");
						var array_materiales = data.count_vehiculos.split(",");

						if (array_materiales.length > 2) {
							console.log("Son varios vehículos");
							$.ajaxSetup({async: false});
							var inicia = 0;
							if (data.varios_vehiculos) {
								inicia = 1;
							}

							// Se valida si se desagrupa todo el material de la solicitud 
							if ( parseFloat($("#peso_solicit" + id_solicitud).val()) == $("#peso_total_solicitud").val() ) {
								flag_valida_flete = true;
							}

							for (var i = inicia; i < ( array_materiales.length - 1 ); i++) {
								var params = {
									"id_materiales"			: data.materiales[ array_materiales[i] ].id_materiales,
									"id_importacion"		: data.materiales[ array_materiales[i] ].id_importacion,
									"cant_grupos" 			: data.materiales[ array_materiales[i] ].cant_grupos - inicia,
									"cantidad_solicitada_"	: data.materiales[ array_materiales[i] ].cantidad_solicitada,
									"material_agrupacion"	: data.agrupacion_material,
									"orden"					: data.orden,
									"desagrupa"				: i
								};
								desconsolidar(url_desconsolidar,params);
							}
							$.ajaxSetup({async: true});
						}else{
							console.log("Es un vehículo");
							$.ajaxSetup({async: false});
							for (var i = 0; i < ( array_materiales.length - 1 ); i++) {
								var params = {
									"id_materiales"			: data.materiales[ array_materiales[i] ].id_materiales,
									"id_importacion"		: data.materiales[ array_materiales[i] ].id_importacion,
									"cant_grupos" 			: data.materiales[ array_materiales[i] ].cant_grupos,
									"cantidad_solicitada_"	: data.materiales[ array_materiales[i] ].cantidad_solicitada,
									"material_agrupacion"	: data.agrupacion_material,
									"orden"					: data.orden,
									"desagrupa"				: i
								};
								desconsolidar(url_desconsolidar,params);
							}
							$.ajaxSetup({async: true});
						}
						location.reload();
					}else if(data.material_solicitado){
						console.log("Parámetros de varias solicitudes a un vehículo");
						for (var i = 0; i < data.material_solicitado.length; i++) {
							var params = {
								"id_materiales": data.material_solicitado[i].id_materiales,
								"id_importacion": data.material_solicitado[i].id_importacion,
								"cant_grupos" : data.material_solicitado[i].cant_grupos,
								"orden" : data.material_solicitado[i].orden,
								"cantidad_solicitada_": data.material_solicitado[i].cantidad_solicitada_,
								"material_agrupacion"	: data.agrupacion_material
							};
							desconsolidar(url_desconsolidar,params);
						}
						location.reload();
					}else{
						console.log("No se necesita desconsolidar");
						flag_valida_flete = true;
						location.reload();
					}

					// Se gestionan actividades
					if(data.actividades && flag_valida_flete){
						console.log("Se gestiona las actividades del material solicitado");
						if (data.flag_varias_solicitudes) {
							console.log("Gestión de actividades de varias solicitudes");
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
						} else {
							console.log("Gestión de actividades de una solicitud");
							var params = {
								id 					: data.actividades[0].id,
								id_importacion		: data.actividades[0].id_importacion,
								id_material			: data.actividades[0].id_material,
								orden				: data.actividades[0].orden,
								tipo_actividad 		: data.actividades[0].tipo_actividad,
								fecha_hora_inicio	: data.actividades[0].fecha_hora_inicio,
								costo_real 			: data.actividades[0].costo_real,
								respuesta 			: data.actividades[0].respuesta
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
						location.reload();
					}else{
						console.log("No entra en gestión de actividades por que la actividad se gestiona en la desconsolidación");
					}
				} else {
					console.log("<p>No hace la solicitud ajax.</p>");
				}
			}, 'json');
			$.ajaxSetup({async: true});
		} 

		if(errores) {
			$(".nexos-messages").html('');
			$("#error_agrupamiento").html('<div ><div class="nexos-messages" id="incorrectos"><div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong> </strong>'+errores+'</div></div></div> </div>');
			$("#crea_agrupamiento").animate({scrollTop : 0}, 500);
		}
	});
});

function desconsolidar(url_desconsolidar,params){
	console.log("Entro en function desconsolidar");
	$.ajaxSetup({async: false});
	$.ajax({
		type		: "POST",
		cache		: false,
		url			: url_desconsolidar,
		data		: params,
		beforeSend	: function(jqXHR, settings){
		},
		error 		: function(data){
						console.log(data.error);
					},
		success		: function(data) {
						console.log(data);
						console.log("Desconsolidación completada con éxito.");
		}
	});
	$.ajaxSetup({async: true});
}

function calcular_peso(peso_total, cantidad_total, cantidad_solicitada){
	var peso_solicitado = cantidad_solicitada * ( peso_total / cantidad_total );
	return peso_solicitado
}

/***** FUNCIONES DE VISTA DE LA SOLICITUD *****/
var url = $("#id_url_ajax").val() + "libs/agrupaciones_ajax.php";
var surl = $("#id_url_ajax").val() + "libs/solicitudes_ajax.php";
var solicitud = "";
function verdatossolicitud(id_solicitud) {
	$("#error_content").empty();
	var msg_error = "";
	if (solicitud != id_solicitud) {
		solicitud = id_solicitud;
		var params = {
			accion: 'verdatossolicitud',
			id_solicitud: id_solicitud
		};

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
				var tramo = data.tramo;
				var tramo_material = data.tramo_material;

				/***** Se llena el contenido del popup *****/
				$("#info_content").html( infoSolicitud(info, contrato) );
				$("#accordion_content").html( infoTramo(tramo, tramo_material) );
 				/***** Fin - Se llena el contenido del popup *****/
			}
		});
		$.ajaxSetup({async: true});

		if (msg_error) {
			$(".error_content").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
			$("#ver_solicitud").animate({ scrollTop: 0 }, 600);
		}
	}
}

function infoSolicitud(info, contrato){
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

function infoTramo(tramo, tramo_material){
	var content = ``;
	tramo.forEach(function(element, index){
		let personal = "No";
		if (element.personal == 1) {
			personal = "Si";
		}

		// Se crea la tabla de los materiales del tramo 
		let materiales_content = `
			<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
				<div class="icon">
					<span class="mdi mdi-close"></span>
				</div>
				<div class="message">
					<strong>Atención!</strong>
					<p>No se ha registrado materiales para este tramo...</p>
				</div>
			</div>
		`;
		if (tramo_material[element.id]) {
			materiales_content = `
				<table class="table table-condensed table-striped">
					<thead>
						<tr>
							<th>Material</th>
							<th>Tipo Movilización</th>
							<th>Unidades</th>
							<th>Peso</th>
						</tr>
					</thead>
					<tbody>
			`;
			tramo_material[element.id].forEach(function(element, index){
				let porcentaje = (element.peso_pendiente * 100) / element.peso;
				materiales_content+= `
					<tr>
						<td class="cell-detail">
							<span>${element.nombre}</span>
							<span class="cell-detail-description">${element.codigoUN}</span>
						</td>
						<td class="cell-detail">
							<span>${element.tipo_movilizacion}</span>
						</td>
						<td class="cell-detail">
							<span>${element.unidades}</span>
						</td>
						<td class="milestone">
							<span class="version">${new Intl.NumberFormat("de-DE").format(element.peso_pendiente)} / ${new Intl.NumberFormat("de-DE").format(element.peso)}</span>
							<div class="progress">
								<div style="width: ${porcentaje}%" class="progress-bar progress-bar-default"></div>
							</div>
							<span class="version">Kg.</span>
						</td>
					</tr>
				`;
			});
			materiales_content+= `
					</tbody>
				</table>
			`;
		}

		content+= `
			<div class="panel panel-default panel-border-color panel-border-color-default">
				<div class="panel-heading">
					<h4 class="panel-title">
						<a data-toggle="collapse" data-parent="#accordion_content" href="#panel_tramos_content_${element.id}" class="collapsed">
							<i class="icon mdi mdi-chevron-down"></i> 
							${element.tipo_operacion} - <strong>${element.sigla}</strong> <small>${element.MUNICIPIO}</small>
							<span class="panel-subtitle">${element.direccion} | Peso: <strong>${new Intl.NumberFormat("de-DE").format(element.peso)}</strong> Kg. | Unidades: <strong>${element.unidades}</strong></span>
						</a>
					</h4>
				</div>
				<div id="panel_tramos_content_${element.id}" class="panel-collapse collapse">
					<div class="panel-body">
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-xs-12 col-sm-6 col-md-3">
											<span>Hora Prevista Operación</span>
											<span class="cell-detail-description">${element.fecha_hora_operacion}</span>
										</div>
										<div class="col-xs-12 col-sm-6 col-md-3">
											<span>Requiere personal</span>
											<span class="cell-detail-description">${personal}</span>
										</div>
									</td>
								</tr>
								<tr><td></td></tr>
							</tbody>
						</table>
						${materiales_content}
					</div>
				</div>
			</div>
		`;
	});

	return content;
}
/***** FIN - FUNCIONES DE VISTA DE LA SOLICITUD *****/

function vermaterialsolicitud(id_solicitud, posicion) {
	var html_content = '';
    var params = {
        accion: 'vermaterialsolicitud',
        id_solicitud: id_solicitud
    };
    $.post(url, params, function (data) {
		var html_content = '';
        if (data.success) {
			// console.log(data);
        	let flag_tramo;
        	let peso_solicitud = 0;
        	let cuenta_tramos = 0;
            for (var i = 0; i < data.content.length; i++) {
            	peso_solicitud = peso_solicitud + parseInt(data.content[i]["DISPONIBLE"]) ;

            	if(flag_tramo != data.content[i]["id_tramo"]){
					html_content+= '</tbody></table>';
					html_content+= `
						<input type="hidden" id="id_ciudad_destino_${id_solicitud}_${cuenta_tramos}" value="${data.content[i]["ID_CIUDAD_DESTINO"]}">
						<strong>${data.content[i]["tipo_operacion"]}</strong> - ${data.content[i]["nombre"]} (${data.content[i]["direccion"]})
						<table class=" table table-condensed table-striped table-hover">
							<tbody>
					`;
            		cuenta_tramos++;
            	}

            	var peso_unitario = data.content[i]["peso"] / data.content[i]["unidades"] ;

				html_content+= `
					<tr>
						<td class="cell-detail">
							<span>${data.content[i]["tipo_mercancia"]}<span>
							<span class="cell-detail-description">Peso Unitario ${peso_unitario.toFixed(2)} Kg</span>
						</td>
						<td class="cell-detail col-xs-2 col-sm-2 col-md-2">
							<input type="hidden" id="id_material_${id_solicitud}_${i}" placeholder="" value="${data.content[i]["id"]}">
							<input type="hidden" id="id_material_solicitud_${id_solicitud}_${i}" placeholder="" value="${data.content[i]["id_material"]}">
							<input type="hidden" id="id_material_proyecto_${id_solicitud}_${i}" placeholder="" value="${data.content[i]["id_material_proyecto"]}">
							<input type="hidden" id="tipo_mercancia_${data.content[i]["id"]}_${posicion}" value="${data.content[i]["tipo_mercancia"]}">
							<input type="hidden" id="valor_declarado_${data.content[i]["id"]}_${posicion}" value="${data.content[i]["valor_declarado"]}">
							<input type="hidden" id="peso_total_${data.content[i]["id"]}_${posicion}" value="${data.content[i]["peso"]}">
							<input type="hidden" id="unidades_totales_${data.content[i]["id"]}_${posicion}" value="${data.content[i]["unidades"]}">
							<span class="cell-detail-description">Unidades a enviar</span>
							<input type="number" min="0" max="${data.content[i]["unidades"]}" id="cantidad_solicitada_${data.content[i]["id"]}_${posicion}" value="0" class="form-control input-xs cantidad_solicitada cantidad_solicitada_${data.content[i]["id"]}">
						</td>
						<td class="cell-detail col-xs-2 col-sm-2 col-md-2">
							<span class="cell-detail-description">Peso a enviar (Kg)</span>
							<input type="number" min="0" max="${data.content[i]["DISPONIBLE"]}" id="peso_disponible_${data.content[i]["id"]}_${posicion}" value="0" class="form-control input-xs" disabled>
						</td>
						<td class="cell-detail col-xs-2 col-sm-2 col-md-2">
							<span class="cell-detail-description">Unidades Disponibles </span>
							<input type="number" min="0" id="unid_disponible_${data.content[i]["id"]}_${posicion}" value="${data.content[i]["UNIDADES_DIPONIBLES"]}" class="form-control input-xs unid_disponible_${data.content[i]["id"]}" disabled>
						</td>
						<td class="cell-detail col-xs-2 col-sm-2 col-md-2">
							<span class="cell-detail-description">Peso Disponible (Kg)</span>
							<input type="hidden" min="0" id="disponible_fijo_${data.content[i]["id"]}_${posicion}" value="${data.content[i]["DISPONIBLE"]}" disabled>
							<input type="number" min="0" id="disponible_${data.content[i]["id"]}_${posicion}" value="${data.content[i]["DISPONIBLE"]}" class="form-control input-xs disponible_${data.content[i]["id"]}" disabled>
						</td>
					</tr>
					<script>
						$("#cantidad_solicitada_${data.content[i]["id"]}_${posicion}").keyup( function(){
							$("#peso_disponible_${data.content[i]["id"]}_${posicion}").val( $("#cantidad_solicitada_${data.content[i]["id"]}_${posicion}").val() * ${peso_unitario});
							calular_disponibles( ${data.content[i]["id"]} , ${data.content[i]["UNIDADES_DIPONIBLES"]} , ${peso_unitario} );
						});
						$("#cantidad_solicitada_${data.content[i]["id"]}_${posicion}").change( function(){
							$("#peso_disponible_${data.content[i]["id"]}_${posicion}").val( $("#cantidad_solicitada_${data.content[i]["id"]}_${posicion}").val() * ${peso_unitario});
							calular_disponibles( ${data.content[i]["id"]} , ${data.content[i]["UNIDADES_DIPONIBLES"]} , ${peso_unitario} );
						});
					</script>
				`;

            	if(flag_tramo != data.content[i]["id_tramo"]){
            		flag_tramo = data.content[i]["id_tramo"];
            	}
			}

			html_content+= `
				<input type="hidden" id="cuenta_tramos_${id_solicitud}_${posicion}" value="${cuenta_tramos}">
				<input type="hidden" id="a_peso${id_solicitud}_${posicion}">
				<input type="hidden" id="cant_materiales_${id_solicitud}" value="${i}">
			`;
            $("#lista_materiales_" + id_solicitud + "_" + posicion).html(html_content);
            $("#a_peso" + id_solicitud + "_" + posicion).val(peso_solicitud);
        } else {
            console.log("Error en la entrega");
        }
    }, 'json');
	return html_content;
}

let numero_seleccionados = 0;
let num_vehic_asig = 0;
let numero_solicitudes =0;
function buscarsolicitudesseleccionadas() {
	numero_solicitudes = $("#num_solicitudes").val();
	let html_asignaciones = "";
	let table_materiales = "";
	numero_seleccionados=0;
	num_vehic_asig = 0;

	$(".check_solicitudes").each(function() {
		if ( $(this).is(':checked') ) {
			numero_seleccionados += 1;
			id_solicitud_check = $(this).val();
		}
	});

	if (numero_seleccionados > 1) {
		$("#contenidoagrupamiento").html("");
		html_asignaciones = `
			<div class="row" id="error_agrupamiento"></div>
			<div class="row">
				<div class="form-group col-xs-6">
					<label>Tipo de vehículo:</label>
					<div id="caja_tipo_vehiculo">
						<input type="text" class="typeahead form-control input-sm" placeholder="Tipo de vehículo" id="tipo_vehiculo">
					</div>
					<input type="hidden" id="id_tipo_vehiculo"> 
				</div>
				<div class="form-group col-xs-6" style="text-align: right;"> 
					<div class="be-checkbox"> 
						<input id="codigo_rojo" type="checkbox"> 
						<label for="codigo_rojo">¿Es código rojo?</label> 
					</div> 
				</div> 
			</div>
		`;

		$(".check_solicitudes").each(function() {
			if ( $(this).is(':checked') ) {
				id_solicitud_check = $(this).val();
				html_asignaciones+= `
					<div class="form-group col-xs-12">
						<strong>${$("#numero_solicit" + id_solicitud_check).val()}</strong>
						<div id="lista_materiales_${$("#num_sol" + id_solicitud_check).val()}_${id_solicitud_check}"></div>
					</div>
				`;
				vermaterialsolicitud($("#num_sol" + id_solicitud_check).val(), id_solicitud_check);
			}
		});

		html_asignaciones+= '</div></div>';

		$("#btn_crear_agrupacion").css("display", "inline");
		$("#contenidoagrupamiento").append(html_asignaciones);
		$('#caja_tipo_vehiculo .typeahead').typeahead({
			minLength: 1
		},
		{
			name: 'states',
			source: substringMatcher(tipo_vehiculos),
		});
		// console.log(tipo_vehiculos);

		$.ajaxSetup({async: false});
		$('#caja_tipo_vehiculo').bind('typeahead:selected', function (obj, datum, name) {
			var params = {
				accion: 'obtenerdatosvehiculos',
				nombre: datum
			};

			$.post(url, params, function (data) {
				// console.log(data);
				if (data.success) {
					var nombre = data.content.nombre;
					$("#id_tipo_vehiculo").val(data.content.id);
					$("#btn_crear_agrupacion").focus();
				} else {
					$("#tipo_vehiculo").val("");
				}
			}, 'json');
		});
		$.ajaxSetup({async: true});
		$("#tipo_vehiculo").focusout(function () {
			// console.log($.inArray($("#tipo_vehiculo").val(), tipo_vehiculos));
			if ($.inArray($("#tipo_vehiculo").val(), tipo_vehiculos) == (-1)) {
				$("#id_tipo_vehiculo").val("");
				//$("#nombre_propietario").val("");
			} else {
			}
		});
	}
	if (numero_seleccionados == 1) {
		let html_desagrupar = '';
		num_vehic_asig = 0;
		$("#btn_crear_agrupacion").css("display", "none");
		$("#contenidoagrupamiento").html("");
		let peso_solicitudlbl = 0;

		$(".check_solicitudes").each(function() {
			if ( $(this).is(':checked') ) {
				id_solicitud = $(this).val();
				peso_solicitudlbl = $("#peso_solicit" + id_solicitud ).val();
			}
		});

		html_asignaciones = `
			<div class="row" id="error_agrupamiento"></div>
			<label>Por favor ingrese el número de vehículos que desea asignar para esta solicitud (Peso total ${new Intl.NumberFormat("de-DE").format(peso_solicitudlbl)} Kg)</label>
			<input type="hidden" id="peso_total_solicitud">
			<div class="row">
				<div class="col-md-2 col-sm-3 col-xs-6">
					<input type="number" min="1" value="1" id="num_vehiculos_asignacion" class="form-control input-sm" >
				</div>
				<div class="col-md-2 col-sm-3 col-xs-6">
					<button id="btn_agregar_num_vehic_asign" type="button" class="btn btn-success md-close">Generar</button>
				</div>
			</div>
			<br><div id="contendio_desagrupar" class="row"></div>
		`;

		$("#contenidoagrupamiento").append(html_asignaciones);

		$("#btn_agregar_num_vehic_asign").click(function () {
			$("#error_agrupamiento").html('');
			num_vehic_asig = $("#num_vehiculos_asignacion").val();
			if (num_vehic_asig == 0) {
				$("#contendio_desagrupar").html("");
				$("#btn_crear_agrupacion").css("display", "none");
			} else if (num_vehic_asig > 0) {
				let peso_solicitud=0;
				for (let x = 1; x <= numero_solicitudes; x++) {
					if ($("#num_sol" + x).is(':checked')) {
						peso_solicitud=$("#peso_solicit" + x).val();
						break;
					} 
				}
				$("#contendio_desagrupar").html("");
				html_desagrupar = '';
				for (let x = 1; x <= num_vehic_asig; x++) {
					html_desagrupar+= `
						<div class="row"></div>
						<div class="form-group col-xs-12">
							<h4>Vehículo ${x}</h4>
						</div>
						<div class="form-group col-xs-6">
						<span class="cell-detail-description">Tipo de Vehículo<span> 
							<span style="text-align:left"> 
								<div id="caja_tipo_vehiculo${x}"> 
									<input type="text" class="typeahead form-control input-xs" placeholder="Tipo de vehiculo" id="tipo_vehiculo${x}">
								</div> 
								<input type="hidden" id="id_tipo_vehiculo${x}"> 
							</div>  
						</span> 
						</div>
						<div class="form-group col-xs-6" style="text-align: right;"> 
							<div class="be-checkbox"> 
								<input id="codigo_rojo${x}" type="checkbox"> 
								<label for="codigo_rojo${x}">¿Es codigo rojo?</label> 
							</div> 
						</div> 
						<div class="row"></div><br>
						<div class="form-group col-xs-12" id="lista_materiales_${id_solicitud_check}_${x}"><br></div>
					`;
					vermaterialsolicitud(id_solicitud_check , x);
				}
				$("#btn_crear_agrupacion").css("display", "inline");
				$("#contendio_desagrupar").append(html_desagrupar);

				for (let x = 1; x <= num_vehic_asig; x++) {
					$('#caja_tipo_vehiculo' + x + ' .typeahead').typeahead({
						minLength: 1
					},
					{
						name: 'states',
						source: substringMatcher(tipo_vehiculos),
					});
					// console.log(tipo_vehiculos);

					$.ajaxSetup({async: false});
					$('#caja_tipo_vehiculo' + x + '').bind('typeahead:selected', function (obj, datum, name) {
						var params = {
							accion: 'obtenerdatosvehiculos',
							nombre: datum
						};
						$.post(url, params, function (data) {
							// console.log(data);
							if (data.success) {
								var nombre = data.content.nombre;
								$("#id_tipo_vehiculo"+x).val(data.content.id);
								$("#btn_crear_agrupacion").focus();
							} else {
								$("#tipo_vehiculo"+x).val("");
							}
						}, 'json');
					});
					$.ajaxSetup({async: true});
					$("#tipo_vehiculo"+x).focusout(function () {
						// console.log($.inArray($("#tipo_vehiculo"+x).val(), tipo_vehiculos));
						if ($.inArray($("#tipo_vehiculo"+x).val(), tipo_vehiculos) == (-1)) {
							//$("#nombre_propietario").val("");
						} else {
						}
					});
				}
			}
		});
	}
	if (numero_seleccionados == 0) {
		$("#contenidoagrupamiento").html("");
		html_asignaciones = '<div style="text-align:center"><div class="nexos-messages" id="incorrectos"><div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Advertencia! </strong>Por favor seleccione mínimo una solicitud para crear un grupo.</div></div></div> </div> ';
		$("#btn_crear_agrupacion").css("display", "none");
		$("#contenidoagrupamiento").append(html_asignaciones);
	}
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

var info_vehiculos=[];
var tipo_vehiculos=[];
function cargartiposvehiculos(){
   var params = {
            accion: "cargartiposvehiculos",
        };
        conductores=[];
        $.ajaxSetup({async: false});
        $.post(url, params, function (data) {

            if (data.success) {
              info_vehiculos= data.content;
              // console.log(data);
                for (let x = 0; x < data.content.length; x++) {
                    tipo_vehiculos.push(data.content[x]['nombre']);
                }

            } else {
            }
        }, 'json');
        $.ajaxSetup({async: true});
}

function verificarpesos (tipo_vehiculo){
  peso_max=0;
  for(let i=0;i<info_vehiculos.length;i++){
    if(tipo_vehiculo == info_vehiculos[i]["id"]){
      peso_max = info_vehiculos[i]["peso_maximo"];
    }
  }
  return peso_max;
}

function calular_disponibles(id_material , unidades_disponibles , peso_unitario ){
	// Se recorren los input
	var cuenta_unidades = 0;
	$(".cantidad_solicitada_" + id_material ).each(function(){
		if ($(this).val() != "") {
			cuenta_unidades+= parseInt( $(this).val() );
		}
	});
	result_unidades = unidades_disponibles - cuenta_unidades;
	$(".unid_disponible_" + id_material ).val(result_unidades);
	$(".disponible_" + id_material ).val(result_unidades * peso_unitario);
}