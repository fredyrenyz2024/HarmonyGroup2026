$(document).ready(function () {
	$("#diveditardatos").hide();
	$("#edite_carro").hide();
	$("#registre_carro").hide();
	$("#edite_carro").hide();
	$("#divdatos").hide();
	$("#crear").hide();
	$("#solicitud").hide();
	$("#crear_preestudio").hide();
	$("#crear_preestudio2").hide();
	//$(".panel_referenciahv").hide();
	$(".panel_papeles_actualiza").hide();
	$(".panel_papeles_habilitar").hide();

	$("#tbsolicitudes").hide();
});
var url = $("#id_url_ajax").val() + "libs/preestudio_ajax.php";
var url2 = $("#id_url_ajax").val() + "libs/preestudio2_ajax.php";

function mayuscula(elemento) {
	let texto = elemento.value;
	elemento.value = texto.toUpperCase();
}

// Referencias Laborales
// empresa_crear1 = document.getElementById("empresa_crear1"),
// celular_ref1 = document.getElementById("celular_ref1"),
// referencias_empresariales2 = document.getElementById("referencias_empresariales2"),
// celular_ref2 = document.getElementById("celular_ref2"),
// referencias_empresariales3 = document.getElementById("referencias_empresariales3"),
// celular_ref3 = document.getElementById("celular_ref3");

//Esta funcion valida las variables de negocio que tienen que ver con la solcitud de vehiculo
// function ValidacionReglaNegocio() {
// 	Vencimientoprefiltro();
// 	Limpiarmodal();

// 	d.getElementById("historico").style.display = "block";
// 	placa = $("#placa").val().trim();
// 	$("#historico").html('');
// 	$.post($("#id_url_ajax").val() + 'validacionparametros/busqueda_vehiculo', 'placa=' + placa, function (data) {
// 		var mensaje = "";
// 		let estado_Vehiculo = data.estado_vehiculo;
// 		$("#nexos_messages_b1").html('');
// 		$("#nexos_messages_b2").html('');
// 		// estado_comodin = data[0]['estado_vehiculo'];
// 		// $("#estado_vehiculo").val(estado_comodin);
// 		//Validacion del tipo de operacion para saber si se puede escoger una o mas solicitudes de servicio
// 		if (data) {
// 			mensaje = `
// 			<div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
// 					<div class="icon"><span class="mdi mdi-notifications"></span></div>
// 					<div class="message">
// 						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
// 						<strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> se encuentra creado en el sistema con estado <strong>${data.estado_vehiculo}</strong>, solicitar prefiltro.
// 					</div>
// 			</div>`;
// 			// Ocular notificacion
// 			setTimeout(() => { d.getElementById("historico").style.display = "none"; }, 5000);
// 			if ($("#tipo_base").val() == 'Expreso') {
// 				$("#btn_soli").prop('disabled', true);
// 			}
// 			if ($("#tipo_base").val() == 'Consolidado') {
// 				$("#btn_soli").prop('disabled', false);
// 			}
// 			// Consultar estados del conductor y del vehiculo
// 			/*
// 			$.post($("#id_url_ajax").val() + 'validacionparametros/Consultar_Estdo_Vehiuclo', 'placa=' + placa, function (paramsv) {		
// 			});*/
// 			// let estado = new FormData();
// 			// estado.append("placa", placa);
// 			// fetch($("#id_url_ajax").val() + 'validacionparametros/Consultar_Estdo_Coductor', {
// 			// 	method: "POST",
// 			// 	body: estado,
// 			// 	// headers: {
// 			// 	//   "Content-Type": "application/json",
// 			// 	// },
// 			// }).then((response) => {
// 			// 	if (!response.ok)
// 			// 		throw new Error(response.statusText);
// 			// 	return response.json();
// 			// }).then(function (estados) {
// 			// 	if (estados) {
// 			// 		estados.forEach((estadov) => {
// 			// 			// alert(estado.tipo_objeto);
// 			// 			if (estadov.tipo_objeto == "proveedor" && estadov.estado_proceso == "desbloqueado" && estadov.tipo_objeto === "vehiculo" && estadov.estado_proceso === "desbloqueado") {
// 			// 				// if (estadov.tipo_objeto === "vehiculo" && estadov.estado_proceso === "desbloqueado") {} else {
// 			// 				// 	alert("Vehiculo Bloqueado");
// 			// 				// }
// 			// 			} else {
// 			// 				alert("Conductor Bloqueado");
// 			// 			}
// 			// 		});
// 			// 	} else {
// 			// 		mensaje = `
// 			// 				<div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
// 			// 						<div class="icon"><span class="mdi mdi-info-outline"></span></div>
// 			// 						<div class="message">
// 			// 							<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
// 			// 							<strong>Mensaje error</strong> Datos del vehiculo con la placa <strong>${placa}</strong>  no encontrados.
// 			// 						</div>
// 			// 				</div>`;
// 			// 	}
// 			// }).catch((error) => {
// 			// 	alert(error);
// 			// });
// 		} else {
// 			//buscar el estado actual del prefiltro + fecha actual
// 			$.post($("#id_url_ajax").val() + 'validacionparametros/buscar_estado_prefiltro', 'placa=' + placa, function (data) {
// 				var fhoy = moment();
// 				var tf = fhoy.diff(data['fecha'], 'days');

// 				if (data['estado'] == null || data['estado'] == 'cancelado' || data['estado'] == 'vencida') {
// 					mensaje = `
// 					<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
// 							<div class="icon"><span class="mdi mdi-info-outline"></span></div>
// 							<div class="message">
// 								<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
// 								<strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> no se encuentra creado en el sistema, solicitar prefiltro para su creación.
// 							</div>
// 					</div>`;
// 					// Ocular notificacion
// 					setTimeout(() => { d.getElementById("historico").style.display = "none"; }, 5000);
// 					let op = 'NEW';
// 					accordion1desbloqueado(op);
// 					radionuevo();
// 					referencias_nuevo_des();
// 					// referencias_ah_des2(data.id_conductor);
// 					datossolicitudes_des();
// 					documento_nuevo_des();
// 					// flete_desbloquear();
// 					boton_guardar_des();
// 				} else {
// 					//validaciones de estado y fecha
// 					if (data['estado'] == 'pendiente_iniciar' || data['estado'] == 'iniciado' || data['estado'] == 'pendiente'
// 						|| data['estado'] == 'rechazado para modificar' || data['estado'] == 'aprobado') {
// 						//calcular fecha prefiltro con la fecha actual
// 						var fhoy = moment();
// 						var horahoy = moment().format('HH:mm:ss');
// 						var tf = fhoy.diff(data['fecha'], 'days');
// 						if (data['estado'] != 'aprobado' && tf == 0){//son de hoy
// 							mensaje = `
// 							<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
// 									<div class="icon"><span class="mdi mdi-info-outline"></span></div>
// 									<div class="message">
// 										<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
// 										<strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> tiene prefiltro ` + data['id_preestudio'] + ` , estado: ` + data['estado'] + ` .
// 									</div>
// 							</div>`;
// 						} else if (data['estado'] == 'aprobado' && tf == 0) {//estado aprobado de hoy mostar msg
// 							mensaje = `
// 							<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
// 									<div class="icon"><span class="mdi mdi-info-outline"></span></div>
// 									<div class="message">
// 										<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
// 										<strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> tiene prefiltro ` + data['id_preestudio'] + ` , estado: ` + data['estado'] + ` .
// 									</div>
// 							</div>`;
// 						} else if (data['estado'] == 'aprobado' && tf > 0) {//estado aprobado y no he de hoy registrar
// 							let op = 'NEW';
// 							accordion1desbloqueado(op);
// 							radionuevo();
// 							referencias_nuevo_des();
// 							// referencias_ah_des2(data.id_conductor);
// 							datossolicitudes_des();
// 							documento_nuevo_des();
// 							// flete_desbloquear();
// 							boton_guardar_des();
// 						}
// 					} else if (data['estado'] == 'rechazado') {
// 						mensaje = `
// 						<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
// 								<div class="icon"><span class="mdi mdi-info-outline"></span></div>
// 								<div class="message">
// 									<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
// 									<strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> tiene prefiltro ` + data['id_preestudio'] + ` , estado: ` + data['estado'] + `
// 									no esta autorizado para cargar con Nexos Cargo.
// 								</div>
// 						</div>`;
// 					}
// 					$("#historico").html(mensaje);
// 					setTimeout(() => { d.getElementById("historico").style.display = "none"; }, 10000);
// 				}
// 			}, 'json');
// 		}
// 	}, 'json');
// }

// function Vencimientoprefiltro() {
// 	$.post($("#id_url_ajax").val() + 'validacionparametros/vencimientoprefiltro', function (data) {
// 		if (data) {
// 			console.log(data[0]);
// 		} else {
// 			console.log(data[0]);
// 		}
// 	}, 'json');
// }

// function Limpiarmodal(){
// 	$("#historico").html('');
// 	$("#diveditardatos").hide();
// 	$("#edite_carro").hide();
// 	$("#registre_carro").hide();
// 	$("#edite_carro").hide();
// 	$("#divdatos").hide();
// 	$("#crear").hide();
// 	$("#solicitud").hide();
// 	$("#crear_preestudio").hide();
// 	$("#crear_preestudio2").hide();
// 	//$(".panel_referenciahv").hide();
// 	$(".panel_papeles_actualiza").hide();
// 	$(".panel_papeles_habilitar").hide();

// }





//REGISTRO DE DATOS
// $("#crear_preestudio").click(function () {
// 	//NUEVO NUNCA HA EXISTIDO
// 	if (comprobar() !== true) {
// 		//registrar datos del vehiculo
// 		if ($("#nuevo").is(':checked') && $("#estado_prefiltron").val() == '') {
// 			// data.append("accion", 'insertar_preestudio_solo');
// 			//data.append("cliente",$("#nombre_cliente").val());
// 			data.append("placa", $("#placag").val());
// 			data.append("trailer", $("#placat").val());
// 			data.append("propietario", $("#nompro").val());
// 			data.append("documento_pro", $("#docupro").val());
// 			data.append("tenedor", $("#nomtene").val());
// 			data.append("documento_tene", $("#docutene").val());
// 			data.append("conductor", $("#nomcondu").val());
// 			data.append("documento_condu", $("#docucondu").val());
// 			data.append("web", $("#web").val());
// 			data.append("user_satelite", $("#user_satelite").val());
// 			data.append("clave", $("#clave").val());
// 			data.append("tipologianuevo", $("#nuevo").val());
// 			data.append("tipologiahabilte", $("#habilite").val());
// 			data.append("tipologiaactualice", $("#actualice").val());
// 			data.append("tipo_operacion", operacion);
// 			data.append("fecha", $("#fpree").val());
// 			data.append("hora", $("#hpree").val());
// 			data.append("usuario", $("#userpree").val());
// 			data.append("observacion", $("#obserpree").val());
// 			data.append("cab", 1);
// 			data.append("ref", 10);
// 			data.append("soli_total", 10);
// 			data.append("segu_actu", 10);
// 			data.append("upda_estado", 10);
// 			data.append("habilitacion", 10);
// 			data.append("update_referencia", 10);
// 			data.append("update_personal", 10);
// 			data.append("actualizar_documentos", 10);
// 			data.append("Papel", 10);
// 			// data.append("update_vehiculo_preestudio", 222);
// 			// data.append("insert_vehiculo_preestudio", 111);
// 			// data.append("insert_habil_preestudio", 10);
// 			// data.append("insert_actualiza_preestudio", 222);
// 			//insert cabecera
// 			$.ajax({
// 				url: $("#id_url_ajax").val() + 'validacionparametros/Insertar_preestudio_nuevo',
// 				type: 'POST',
// 				data: data,
// 				cache: false,
// 				processData: false, // Don't process the files
// 				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 				dataType: 'json',
// 				success: function (data, textStatus, jqXHR) {
// 					console.log('si inserto preestudio CABECERA solo');
// 					// alert('!!Registro Vehiculo exitosamente!!!');
// 				},
// 				error: function (jqXHR, textStatus, errorThrown) {
// 					console.log('no inserto preestudio CABECERA solo');
// 					console.log(jqXHR);
// 					console.log(textStatus);
// 					console.log(errorThrown);
// 				}
// 			});
// 		}

// 		//referencias laborales NUEVO
// 		// if ($("#nuevo").is(':checked') && $("#estado_prefiltron").val() == '') {
// 		// 	var i = 0;
// 		// 	for (i = 1; i <= contador_global1; i++) {
// 		// 		var empresa = $("#empresa_crear" + i + "").val();
// 		// 		var ingreso = $("#fingreso_crear" + i + "").val();
// 		// 		var retiro = $("#fretiro_crear" + i + "").val();
// 		// 		var contacto = $("#contacto_crear" + i + "").val();
// 		// 		var numero = $("#numero_crear" + i + "").val();
// 		// 		var cargo = $("#cargo_crear" + i + "").val();
// 		// 		var anti = $("#antiguedad_crear" + i).val();
// 		// 		data.append("placa2", $("#placag").val());
// 		// 		data.append("docucondu", $("#docucondu").val());
// 		// 		data.append("empre", empresa);
// 		// 		data.append("ingreso", ingreso);
// 		// 		data.append("retiro", retiro);
// 		// 		data.append("persona", contacto);
// 		// 		data.append("num", numero);
// 		// 		data.append("cargo", cargo);
// 		// 		data.append("anti", anti);
// 		// 		data.append("ref", 2);
// 		// 		data.append("cab", 10);
// 		// 		data.append("soli_total", 10);
// 		// 		data.append("segu_actu", 10);
// 		// 		data.append("upda_estado", 10);
// 		// 		data.append("habilitacion", 10);
// 		// 		data.append("update_referencia", 10);
// 		// 		data.append("update_personal", 10);
// 		// 		data.append("actualizar_documentos", 10);
// 		// 		data.append("Papel", 10);
// 		// 		// data.append("update_vehiculo_preestudio", 222);
// 		// 		// data.append("insert_vehiculo_preestudio", 222);
// 		// 		// data.append("insert_habil_preestudio", 10);
// 		// 		// data.append("insert_actualiza_preestudio", 222);
// 		// 		$.ajax({
// 		// 			url: url,
// 		// 			type: 'POST',
// 		// 			data: data,
// 		// 			cache: false,
// 		// 			processData: false, // Don't process the files
// 		// 			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 		// 			dataType: 'json',
// 		// 			success: function (data, textStatus, jqXHR) {
// 		// 				console.log('inserto preestudio REFERENCIA solo');
// 		// 			},
// 		// 			error: function (jqXHR, textStatus, errorThrown) {
// 		// 				console.log('no inserto preestudio REFERENCIA solo');
// 		// 				console.log(jqXHR);
// 		// 				console.log(textStatus);
// 		// 				console.log(errorThrown);
// 		// 			}
// 		// 		});
// 		// 	}
// 		// }

//documentos de  preestudio SOLO CREACION
// if ($("#nuevo").is(':checked') && $("#estado_prefiltron").val() == '') {
// 	//ARCHIVOS
// 	var cantp = $("#cont_papel").val();
// 	if (cantp > 0) {
// 		var u;
// 		for (u = 1; u <= cantp; u++) {
// 			//var sw=$("#sk"+u).val();
// 			if (typeof $("#sk" + u).val() !== 'undefined') {

// 				var tipohv_docu = $("#tipohoja" + u + "").val();
// 				var ruta = $("#ruta" + u + "").val();
// 				var namearchivo = $("#namearchivo" + u + "").val();
// 				var clase = $("#clase" + u + "").val();
// 				var documento = $("#documento" + u + "").val();

// 				// data.append("accion", 'insertar_preestudio_solo');
// 				data.append("tipohv_docu", tipohv_docu);
// 				data.append("ruta", ruta);
// 				data.append("namearchivo", namearchivo);
// 				data.append("clase", clase);
// 				data.append("segu_actu", 10);
// 				data.append("ref", 10);
// 				data.append("cab", 10);
// 				data.append("soli_total", 10);
// 				//data.append("upda_estado", 10);
// 				// data.append("habilitacion", 10);
// 				// data.append("update_referencia", 10);
// 				// data.append("update_personal", 10);
// 				// data.append("actualizar_documentos", 10);
// 				// data.append("update_vehiculo_preestudio", 222);
// 				// data.append("insert_vehiculo_preestudio", 222);
// 				// data.append("insert_habil_preestudio", 10);
// 				// data.append("insert_actualiza_preestudio", 222);
// 				//data.append("Papel", $("#papeles").is(':checked'));
// 				data.append("Papel", $("#valor_documento").val());
// 				var papeles = document.getElementById('documento' + u + '').files;
// 				for (var a = 0; a < papeles.length; a++) {
// 					data.append("papeles" + a, papeles[a]);
// 				}
// 				$.ajax({
// 					url: $("#id_url_ajax").val() + 'validacionparametros/Insertar_preestudio_nuevo',
// 					type: 'POST',
// 					data: data,
// 					cache: false,
// 					processData: false, // Don't process the files
// 					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 					dataType: 'json',
// 					success: function (data, textStatus, jqXHR) {
// 						console.log('inserto documentos preestudio');
// 					},
// 					error: function (jqXHR, textStatus, errorThrown) {
// 						console.log('no inserto documentos preestudio');
// 						console.log(jqXHR);
// 						console.log(textStatus);
// 						console.log(errorThrown);
// 					}
// 				});
// 			}//cierre if diferentes	
// 		}
// 	}
// }
// }

// });

//
function consultar_placa() {
	//limpiar todo el modal
	//1. consultar si la placa tiene hojas de vida
	pq = $("#placa").val();
	var placa = pq.trim();

	var tienehv = {
		placa: placa,
		action: 'buscar_hv'
	};
	$("#historico").html('');
	$.ajax({
		url: url2,
		type: 'POST',
		data: tienehv,
		dataType: 'json',
		success: function (data) {
			console.log(data.result);
			if (data.result != null) {
				alert("Existe el vehiculo y entro aqui " + data.result[0].placa);
				//ESTUDIOS DE SEGURIDAD
				//OPCION1: el vehiculo tiene placa y no tiene estudios de seguridad
				var pkk = data.result[0].placa;
				var sestu = data.result[0].id_solictud;
				//alert('Existe');
				//$("#historico").html('Vehículo y Conductor con hojas de vida activas');
				//3.. hbilitar y actualizar xq existe una hoja de vida
				//1. aquí se puede controlar el estados de bloqueado y desbloqueado
				//2. consultar_placa2(); consutrucci
				var estado_estudio = data.result[0].estado;
				var id_soli = data.result[0].id_solictud;
				var fechita = data.result[0].fecha;
				var num_solestudio = data.result[0].idestudio;
				var nb = $("#tipo_base").val();
				if ($("#tipo_base").val() == 'Expreso') {
					$("#btn_soli").prop('disabled', true);
				}
				if ($("#tipo_base").val() == 'Consolidado') {
					$("#btn_soli").prop('disabled', false);
				}
				var block = {
					id: placa,
					action: 'consultar_bloqueo'
				};
				$("#nexos_messages_b1").html('');
				$("#nexos_messages_b2").html('');
				$("#tiporadio").val('');
				$.ajax({
					url: url2,
					type: 'POST',
					data: block,
					dataType: 'json',
					success: function (data) {

						if (data.result != null && data.result2 != null) {
							var estado_vehiculo = data.result[0].estado_vehiculo;
							var estado_conductor = data.result2[0].estado_conductor;

							if (estado_vehiculo == 'desbloqueado' && estado_conductor == 'desbloqueado') {
								if (pkk != null && sestu != null) {
									//tiene algo 
									if (estado_estudio == null) {
										$("#historico").html('<p style="color:red;">* El vehículo de placa ' + placa + ' tiene en la actualidad un estudio de seguridad N° ' + id_soli + ' y  solicitud de estudio de seguridad N°  ' + num_solestudio + '  en estado pendiente por iniciar</p>');
									}

									if (estado_estudio == 'Aprobado') {
										var fhoy = moment();
										var horahoy = moment().format('HH:mm:ss');
										var tf = fhoy.diff(fechita, 'days');
										//alert(tf);
										if (tf == 0) {
											$("#historico").html('<p style="color:red;">* El vehículo de placa ' + placa + ' tiene en la actualidad un estudio de seguridad N° ' + id_soli + ' y N° solicitud de estudio de seguridad ' + num_solestudio + '  en estado Aprobado para planillar </p>');
											$("#tiporadio").val(0);

										} else {
											$("#tiporadio").val(1);
											$("#historico").html('<p style="color:red;">* El vehículo de placa ' + placa + ' tiene en la actualidad el preestudio de seguridad N° ' + id_soli + ' y N° solicitud de estudio de seguridad ' + num_solestudio + '  en estado Aprobado mayor a un dia</p>');
											radionuevo_bloc();
											radioactu();
											/*accordion1desbloqueado();
											referencias_ah_des();
											datossolicitudes_des();	
											documentos_ah_des();*/
											//consultar_placa2();
											//funcion para traer los datos y el boton a los campos, solo para habilitar y actualizar
											/*consultar_hojadevida();*/
											boton_guardar_des();
										}
									}

									if (estado_estudio == 'Rechazado') {
										var fhoy = moment();
										var horahoy = moment().format('HH:mm:ss');
										var tf = fhoy.diff(fechita, 'days');
										//alert(tf);
										if (tf == 0) {
											$("#historico").html('<p style="color:red;">* El vehículo de placa ' + placa + ' tiene en la actualidad un estudio de seguridad N° ' + id_soli + ' y  solicitud de estudio de seguridad N° ' + num_solestudio + '  en estado Rechazado para planillar </p>');
											$("#tiporadio").val(0);
											radionuevo_bloc();
											radioactu();
											boton_guardar_des();
										} else {
											$("#tiporadio").val(1);
											$("#historico").html('<p style="color:red;">* El vehículo de placa ' + placa + ' tiene en la actualidad el preestudio de seguridad N° ' + id_soli + ' y  solicitud de estudio de seguridad N°  ' + num_solestudio + '  en estado Rechazado</p>');

											radionuevo_bloc();
											radioactu();
											/*accordion1desbloqueado();
											referencias_ah_des();
											datossolicitudes_des();	
											documentos_ah_des();*/
											//consultar_placa2();
											//funcion para traer los datos y el boton a los campos, solo para habilitar y actualizar
											/*consultar_hojadevida();*/
											boton_guardar_des();
										}
									}

									if (estado_estudio == 'Pendiente') {
										var fhoy = moment();
										var horahoy = moment().format('HH:mm:ss');
										var tf = fhoy.diff(fechita, 'days');
										//alert(tf);
										if (tf == 0) {
											$("#historico").html('<p style="color:red;">* El vehículo de placa ' + placa + ' tiene en la actualidad un estudio de seguridad N° ' + id_soli + ' y  solicitud de estudio de seguridad N° ' + num_solestudio + '  en estado Pendiente )</p>');
											$("#tiporadio").val(0);

										} else {
											$("#tiporadio").val(1);
											$("#historico").html('<p style="color:red;">* El vehículo de placa ' + placa + ' tiene en la actualidad el preestudio de seguridad N° ' + id_soli + ' y  solicitud de estudio de seguridad N° ' + num_solestudio + '  en estado Pendiente</p>');

											radionuevo_bloc();
											radioactu();
											/*accordion1desbloqueado();
											referencias_ah_des();
											datossolicitudes_des();	
											documentos_ah_des();*/
											//consultar_placa2();
											//funcion para traer los datos y el boton a los campos, solo para habilitar y actualizar
											/*consultar_hojadevida();*/
											boton_guardar_des();
										}
									}

									if (estado_estudio == 'iniciado') {
										var fhoy = moment();
										var horahoy = moment().format('HH:mm:ss');
										var tf = fhoy.diff(fechita, 'days');
										if (tf == 0) {
											$("#historico").html('<p style="color:red;">* El vehículo de placa ' + placa + ' tiene en la actualidad un estudio de seguridad N° ' + id_soli + ' y  solicitud de estudio de seguridad N° ' + num_solestudio + '  en estado Iniciado </p>');
											$("#tiporadio").val(0);

										} else {
											$("#tiporadio").val(1);
											$("#historico").html('<p style="color:red;">* El vehículo de placa ' + placa + ' tiene en la actualidad el preestudio de seguridad N° ' + id_soli + ' y  solicitud de estudio de seguridad N° ' + num_solestudio + '  en estado Iniciado</p>');
											radionuevo_bloc();
											radioactu();
											/*accordion1desbloqueado();
											referencias_ah_des();
											datossolicitudes_des();	
											documentos_ah_des();*/
											//consultar_placa2();
											//funcion para traer los datos y el boton a los campos, solo para habilitar y actualizar
											/*consultar_hojadevida();*/
											boton_guardar_des();
										}
									}

									if (estado_estudio == 'Rechazado_modificar') {
										var fhoy = moment();
										var horahoy = moment().format('HH:mm:ss');
										var tf = fhoy.diff(fechita, 'days');
										//alert(tf);
										if (tf == 0) {
											$("#historico").html('<p style="color:red;">* El vehículo de placa ' + placa + ' tiene en la actualidad un estudio de seguridad N° ' + id_soli + ' y  solicitud de estudio de seguridad  N°' + num_solestudio + '  en estado Rechazado para modificar)</p>');
											$("#tiporadio").val(0);
										} else {
											//si es rechazado para modificar y la fecha ya caduco osea esta vencida, puede registrar de nuevo
											$("#tiporadio").val(1);
											$("#historico").html('<p style="color:red;">* El vehículo de placa ' + placa + ' tiene en la actualidad el preestudio de seguridad N° ' + id_soli + ' y  solicitud de estudio de seguridad N° ' + num_solestudio + '  en estado Rechazado para modificar</p>');
											radionuevo_bloc();
											radioactu();
											/*accordion1desbloqueado();
											referencias_ah_des();
											datossolicitudes_des();	
											documentos_ah_des();*/
											//consultar_placa2();
											//funcion para traer los datos y el boton a los campos, solo para habilitar y actualizar
											/*consultar_hojadevida();*/
											boton_guardar_des();
										}
									}

								} else {
									$("#tiporadio").val(3);
									//no trae nada
									$("#historico").html('Vehículo y Conductor con hojas de vida activas<br>');
									$("#historico").append('<p style="color:red;">* El vehículo de placa ' + pkk + ' no tiene  ninguna actividad en la compañía y por tanto no ha tenido estudios de seguridad</p>');
									radionuevo_bloc();
									radioactu();
									boton_guardar_des();
								}
							} else {
								if (estado_vehiculo) {
									$("#nexos_messages_b1").html('<p class="text-danger text-left">Vehículo ' + estado_vehiculo + '</p>');
								}

								if (estado_conductor) {
									$("#nexos_messages_b2").html('<p class="text-danger text-left">Conductor ' + estado_conductor + '</p>');
								}
							}
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log('no hay nada, bloqueos');
						console.log(jqXHR);
						console.log(textStatus);
						console.log(errorThrown);
					}
				});
			} else {
				alert("Entro en vehiculo no existente")
				//NUEVOS
				if ($("#tipo_base").val() == 'Expreso') {
					$("#btn_soli").prop('disabled', true);
				}
				if ($("#tipo_base").val() == 'Consolidado') {
					$("#btn_soli").prop('disabled', false);
				}
				if (data.result2 == null) {
					var soll = 1;
					var estadoo = 'No existe';
				} else {
					var sol = data.result2[0].id;
					$("#solianterior").val(sol);
					var estado = data.result2[0].estado;//estado actual de la solicitud
					$("#estado_prefiltron").val(estado);
					if (data.result2[0].estado == 'aprobado') {//Autorizado para registrar hv
						var fhoy = moment();
						var horahoy = moment().format('HH:mm:ss');
						var fecha_es = data.result2[0].fechaes;
						var tf = fhoy.diff(fecha_es, 'days');
						//alert(tf);

						if (tf == 0) {
							$("#historico").html('<p style="color:red;">* El vehículo de placa ' + data.result2[0].placa_vehiculo + ' tiene en la actualidad el preestudio de seguridad N° ' + data.result2[0].id + ' vigente en estado Autorizado para registrar HV  </p>');
						} else {
							$("#historico").html('<p style="color:red;">* El vehículo de placa ' + data.result2[0].placa_vehiculo + ' tiene en la actualidad el preestudio de seguridad N° ' + data.result2[0].id + ' vencido en estado Autorizado mayor a un día</p>');
							var op = 'AR';
							var docuconductor = data.result2[0].documento_conductor;
							accordion1desbloqueado(op);
							radionuevo();
							referencias_ah_des2(docuconductor);
							datossolicitudes_des();
							documento_nuevo_des();
							flete_desbloquear();
							boton_guardar_des();
						}
					}

					if (data.result2[0].estado == 'pendiente') {
						var fhoy = moment();
						var horahoy = moment().format('HH:mm:ss');
						var fecha_es = data.result2[0].fechaes;
						var tf = fhoy.diff(fecha_es, 'days');
						//alert(tf);
						if (tf == 0) {
							$("#historico").html('<p style="color:red;">* El vehículo de placa ' + data.result2[0].placa_vehiculo + ' tiene en la actualidad el preestudio de seguridad N° ' + data.result2[0].id + ' vigente en estado pendiente, es necesario que valide los documentos y datos faltantes</p>');
						} else {

							$("#historico").html('<p style="color:red;">* El vehículo de placa ' + data.result2[0].placa_vehiculo + ' tiene en la actualidad el preestudio de seguridad N° ' + data.result2[0].id + '  vencido en estado pendiente mayor a un día</p>');
							var op = 'AR';
							var docuconductor = data.result2[0].documento_conductor;
							accordion1desbloqueado(op);
							radionuevo();
							referencias_ah_des2(docuconductor);
							datossolicitudes_des();
							documento_nuevo_des();
							boton_guardar_des();
						}
					}

					if (data.result2[0].estado == 'pendiente_iniciar') {
						var fhoy = moment();
						var horahoy = moment().format('HH:mm:ss');
						var fecha_es = data.result2[0].fechaes;
						var tf = fhoy.diff(fecha_es, 'days');
						//alert(tf);
						if (tf == 0) {
							$("#historico").html('<p style="color:red;">* El vehículo de placa ' + data.result2[0].placa_vehiculo + ' tiene en la actualidad el preestudio de seguridad N° ' + data.result2[0].id + ' vigente en estado pendiente iniciar </p>');
						} else {

							$("#historico").html('<p style="color:red;">* El vehículo de placa ' + data.result2[0].placa_vehiculo + ' tiene en la actualidad el preestudio de seguridad N° ' + data.result2[0].id + '  vencido en estado pendiente iniciar mayor a un día</p>');
							var op = 'AR';
							var docuconductor = data.result2[0].documento_conductor;
							accordion1desbloqueado(op);
							radionuevo();
							referencias_ah_des2(docuconductor);
							datossolicitudes_des();
							documento_nuevo_des();
							boton_guardar_des();
						}
					}

					if (data.result2[0].estado == 'rechazado para modificar') {
						var fhoy = moment();
						var horahoy = moment().format('HH:mm:ss');
						var fecha_es = data.result2[0].fechaes;
						var tf = fhoy.diff(fecha_es, 'days');
						if (tf == 0) {
							$("#historico").html('<p style="color:red;">* El vehículo de placa ' + data.result2[0].placa_vehiculo + ' tiene en la actualidad el preestudio de seguridad N° ' + data.result2[0].id + ' vigente en estado rechazado para modificar</p>');
						} else {
							$("#historico").html('<p style="color:red;">* El vehículo de placa ' + data.result2[0].placa_vehiculo + ' tiene en la actualidad el preestudio de seguridad N° ' + data.result2[0].id + ' vencido en estado rechazado para modificar </p>');
							var op = 'AR';
							var docuconductor = data.result2[0].documento_conductor;
							accordion1desbloqueado(op);
							radionuevo();
							referencias_ah_des2(docuconductor);
							datossolicitudes_des();
							documento_nuevo_des();
							boton_guardar_des();
						}
					}

					if (data.result2[0].estado == 'iniciado') {
						var fhoy = moment();
						var horahoy = moment().format('HH:mm:ss');
						var fecha_es = data.result2[0].fechaes;
						var tf = fhoy.diff(fecha_es, 'days');
						if (tf == 0) {
							$("#historico").html('<p style="color:red;">* El vehículo de placa ' + data.result2[0].placa_vehiculo + ' tiene en la actualidad el preestudio N° ' + data.result2[0].id + ' vigente en estado iniciado por seguridad</p>');
						} else {
							$("#historico").html('<p style="color:red;">* El vehículo de placa ' + data.result2[0].placa_vehiculo + ' tiene en la actualidad el preestudio N° ' + data.result2[0].id + ' vencido en estado iniciado por seguridad</p>');
							var op = 'AR';
							var docuconductor = data.result2[0].documento_conductor;
							accordion1desbloqueado(op);
							radionuevo();
							referencias_ah_des2(docuconductor);
							datossolicitudes_des();
							documento_nuevo_des();
							boton_guardar_des();
						}
					}

					if (data.result2[0].estado == 'cancelado') {
						$("#historico").html('<p style="color:red;">* El vehículo de placa ' + data.result2[0].placa_vehiculo + ' tiene en la actualidad el preestudio de seguridad N° ' + data.result2[0].id + '  en estado cancelado</p>');
						var op = 'CA';
						var docuconductor = data.result2[0].documento_conductor;
						accordion1desbloqueado(op);
						radionuevo();
						referencias_ah_des2(docuconductor);
						datossolicitudes_des();
						documento_nuevo_des();
						boton_guardar_des();
					}

					if (data.result2[0].estado == 'rechazado') {//
						//CREAR PREESTUDIO NUEVO
						//inactivar la solictud de preestudio anterior
						//alert('NO existe');
						$("#historico").html('<p style="color:red;">* El vehículo de placa ' + data.result2[0].placa_vehiculo + ' tiene una solicitud de preestudio N° ' + data.result2[0].id + ' que  fue rechazada en la siguiente fecha ' + data.result2[0].fechaes + ' y hora ' + data.result2[0].horaes + ' </p>');
						var op = 'R';
						var docuconductor = data.result2[0].documento_conductor;
						accordion1desbloqueado(op);
						radionuevo();
						datossolicitudes_des();
						//referencias_nuevo_des();
						referencias_ah_des2(docuconductor);
						documento_nuevo_des();
						boton_guardar_des();
					}

					if (data.result2[0].estado == 'vencida') {//
						//CREAR PREESTUDIO NUEVO
						//inactivar la solictud de preestudio anterior
						//alert('NO existe');
						$("#historico").html('<p style="color:red;">* El vehículo de placa ' + data.result2[0].placa_vehiculo + '  se encuentra con una solicitud de preestudio N° ' + data.result2[0].id + ' en estado vencida desde la fecha ' + data.result2[0].fechaes + ' y la hora ' + data.result2[0].horaes + '  </p>');
						var op = 'R';
						var docuconductor = data.result2[0].documento_conductor;
						accordion1desbloqueado(op);
						radionuevo();
						datossolicitudes_des();
						//referencias_nuevo_des();
						referencias_ah_des2(docuconductor);
						documento_nuevo_des();
						boton_guardar_des();
					}
				}
				if (soll == 1) {
					$("#historico").html('<p style="color:red;">* El vehículo de placa ' + placa + ' es nuevo en el sistema y no ha tenido trazabilidad</p>');
					var op = 'NEW';
					accordion1desbloqueado(op);
					radionuevo();
					referencias_nuevo_des();
					datossolicitudes_des();
					documento_nuevo_des();
					flete_desbloquear();
					boton_guardar_des();
				}
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log('no hay nada, vp');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}

function accordion1bloqueado() {
	$(".thv").hide();
	$("#hvpreestudio").hidden();
}

//CONSULTA VEHÍCULOS ESTADO:NUEVO
function accordion1desbloqueado(op) {
	$("#divdatos").show();
	var opcion = op;
	//$("#habil").hide();
	//$("#update").hide();
	$("#hvpreestudio").show();
	var pk = $("#placa").val();
	$("#placag").val(pk);
	$("#su_placa").val(pk);

	if (opcion == 'R') {
		//alert('traer datos');
		var t = {
			placa: pk,
			action: 'consultavprees'
		};

		$.ajax({
			url: url2,
			type: 'POST',
			data: t,
			dataType: 'json',
			success: function (data) {
				if (data.result != null) {

					$("#placat").val(data.result[0].placa_trailer);
					$("#web").val(data.result[0].web_satelital);
					$("#user_satelite").val(data.result[0].usuario_satelital);
					$("#clave").val(data.result[0].clave_satelital);
					$("#nompro").val(data.result[0].nombre_propietario);
					$("#docupro").val(data.result[0].documento_propietario);
					$("#nomtene").val(data.result[0].nombre_tenedor);
					$("#docutene").val(data.result[0].documento_tenedor);
					$("#nomcondu").val(data.result[0].nombre_conductor);
					$("#docucondu").val(data.result[0].documento_conductor);
					$("#deta_condu").val(data.result[0].id_detacondu);
				}

			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}

	if (opcion == 'CA') {
		//alert('traer datos');
		var t = {
			placa: pk,
			action: 'consultavprees'
		};

		$.ajax({
			url: url2,
			type: 'POST',
			data: t,
			dataType: 'json',
			success: function (data) {
				if (data.result != null) {

					$("#placat").val(data.result[0].placa_trailer);
					$("#web").val(data.result[0].web_satelital);
					$("#user_satelite").val(data.result[0].usuario_satelital);
					$("#clave").val(data.result[0].clave_satelital);
					$("#nompro").val(data.result[0].nombre_propietario);
					$("#docupro").val(data.result[0].documento_propietario);
					$("#nomtene").val(data.result[0].nombre_tenedor);
					$("#docutene").val(data.result[0].documento_tenedor);
					$("#nomcondu").val(data.result[0].nombre_conductor);
					$("#docucondu").val(data.result[0].documento_conductor);
					$("#deta_condu").val(data.result[0].id_detacondu);


				}

			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}

	if (opcion == 'AR') {
		//alert('traer datos');
		var t = {
			placa: pk,
			action: 'consultavprees'
		};

		$.ajax({
			url: url2,
			type: 'POST',
			data: t,
			dataType: 'json',
			success: function (data) {
				if (data.result != null) {

					$("#placat").val(data.result[0].placa_trailer);
					$("#web").val(data.result[0].web_satelital);
					$("#user_satelite").val(data.result[0].usuario_satelital);
					$("#clave").val(data.result[0].clave_satelital);
					$("#nompro").val(data.result[0].nombre_propietario);
					$("#docupro").val(data.result[0].documento_propietario);
					$("#nomtene").val(data.result[0].nombre_tenedor);
					$("#docutene").val(data.result[0].documento_tenedor);
					$("#nomcondu").val(data.result[0].nombre_conductor);
					$("#docucondu").val(data.result[0].documento_conductor);
					$("#deta_condu").val(data.result[0].id_detacondu);


				}

			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}

	if (opcion == 'PE') {
		//alert('traer datos');
		var t = {
			placa: pk,
			action: 'consultavprees'
		};

		$.ajax({
			url: url2,
			type: 'POST',
			data: t,
			dataType: 'json',
			success: function (data) {
				if (data.result != null) {

					$("#placat").val(data.result[0].placa_trailer);
					$("#web").val(data.result[0].web_satelital);
					$("#user_satelite").val(data.result[0].usuario_satelital);
					$("#clave").val(data.result[0].clave_satelital);
					$("#nompro").val(data.result[0].nombre_propietario);
					$("#docupro").val(data.result[0].documento_propietario);
					$("#nomtene").val(data.result[0].nombre_tenedor);
					$("#docutene").val(data.result[0].documento_tenedor);
					$("#nomcondu").val(data.result[0].nombre_conductor);
					$("#docucondu").val(data.result[0].documento_conductor);
					$("#deta_condu").val(data.result[0].id_detacondu);
				}

			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}
}

function boton_guardar_des() {
	$("#divdatos").show();
	$("#crear_preestudio").show();
}

function boton_guardar_bloc() {
	$("#crear_preestudio").hidden();
}

function documento_nuevo_des() {
	$("#panel_papeles").show();
}

function documento_nuevo_bloc() {
	$("#panel_papeles").hidden();
}

function referencias_nuevo_bloc() {
	$("#panel_referenciaNEW").hidden();
}

function referencias_nuevo_des() {
	$("#panel_referenciaNEW").show();
}

function datossolicitudes_des() {
	$("#divdatos").show();
	$("#panel_solicitudes").show();
}

function datossolicitudes_bloc() {
	$("#panel_solicitudes").hidden();
}

//referecnias laborales actualizar y habilitar
function referencias_ah_des() {
	$("#panel_referenciahv").show();
	$("#panel_refepersonal").show();
}

function flete_desbloquear() {
	$("#panel_fletepk").css("display", 'block');
}

function referencias_ah_des2(docuconductor) {
	$("#panel_referenciahv").show();

	var b = {
		docuconductor: docuconductor,
		action: 'consultar_refe_R'
	};

	$.ajax({
		url: url2,
		type: 'POST',
		data: b,
		dataType: 'json',
		success: function (data) {

			if (data.result != null) {
				var cun = 0;
				data.result.forEach(function (element, index) {
					cun++;
					$("#idconductor").val(element.id_conductor);
					$("#idrl" + cun).val(element.id);
					$("#referencias_empresariales" + cun).val(element.nombre_empresa);
					$("#fingreso" + cun).val(element.fecha_ingreso);
					$("#fretiro" + cun).val(element.fecha_retiro);
					$("#contacto_ref" + cun).val(element.persona_contacto);
					$("#celular_ref" + cun).val(element.celular);
					$("#cargo_ref" + cun).val(element.cargo);
					$("#anti_ref" + cun).val(element.antiguedad);
				});
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}

function referencias_ah_bloc() {
	$("#panel_referenciahv").hide();
	$("#panel_refepersonal").hide();
}

function documentos_ah_des() {
	$("#panel_papeles_habilitar").show();
}

function documentos_ah_bloc() {
	$("#panel_papeles_habilitar").hide();
}

function radionuevo() {//mostrar el tipo de operacion
	$(".thv").show();
	$("#divnuevo").show();
}

function radionuevo_bloc() {
	$("#divnuevo").hide();
}

function radioactu() {
	$(".thv").show();
	$("#divhabil").show();
	$("#divactualiza").show();
}

function radioactu_bloc() {
	$("#divhabil").hide();
	$("#divactualiza").hide();
}

function campos_ah_des() {
	$("#panel_seguridad").show();
}

function campos_ah_bloc() {
	$("#panel_seguridad").hide();
}

function accion(element) {
	var elemento = $(element);
	var estado = elemento.data("id");
	var idsoli = elemento.data("id2");
	//alert(estado);
	$("#diveditardatos").show();

	//No existe placa en la tabla principal de vehiculos, entonces buscarla en 
	if (estado == 'pendiente') {

		var b = {
			id: idsoli,
			action: 'consultar_vp2'
		};
		$.ajax({
			url: url2,
			type: 'POST',
			data: b,
			dataType: 'json',
			success: function (data) {
				if (data.result != null) {
					consultar_placa3();
					//ESTA PLACA TIENE UN PREESTUDIO no existe en cmx_vehiculos
					alert('existe el vehiculo en preestudio');
					$("#nuevo").hide();
					$("#habil").hide();
					$("#update").hide();
					$("#nuevo2").hide();
					$("#habil2").hide();
					$("#update2").hide();

					$(".panel_referenciahv").hide();
					$(".panel_referenciaNEW").hide();
					$(".panel_refepersonal").hide();
					$("#crear").show();

					if (data) {//traer datos de cabecera
						if (data.result[0].estado_vehiculo === 'Desbloquear') {
							//CABECERA
							//$("#diveditardatos").show();
							$("#e_consecutivo").val(data.result[0].idv);
							$("#e_placa").val(data.result[0].placa_vehiculo);
							$("#e_trailer").val(data.result[0].placa_trailer);
							$("#e_web").val(data.result[0].web_satelital);
							$("#e_usuario").val(data.result[0].usuario_satelital);
							$("#e_clave").val(data.result[0].clave_satelital);
							$("#e_propietario").val(data.result[0].nombre_propietario);
							$("#e_numpro").val(data.result[0].documento_propietario);
							$("#e_tenedor").val(data.result[0].nombre_tenedor);
							$("#e_numtene").val(data.result[0].documento_tenedor);
							$("#e_conductor").val(data.result[0].nombre_conductor);
							$("#e_numcondu").val(data.result[0].documento_conductor);
							$("#sconsecutivo").val(data.result[0].idsolu);
							$("#sobserve").val(data.result[0].observacion);
							$("#sconsecutivo_antes").val(data.result[0].idsolu);
							//manejar estado de la solicitud esto debe salir cuando este cancelado

							/*$("#update_sol").hide();
						 $("#btn_editarpreestudio").hide();
						 $("#new_sol").show();
						 $("#scliente_new").val(data.result[0].cliente);
						 $("#sconsecutivo_antes").val(data.result[0].idsolu);*/

							//SOLICITUDES DE SERVICO
							//if(data.result[0].estado=='rechazado para modificar'  && data.result[0].estado_actual==='1'){
							if (data.result2) {
								data.result2.forEach(function (element, index) {
									$("#tmoda_servicio").append('<tr>' +
										'<td>' + element.nombre_cliente + '</td>' +
										'<td>' + element.orige + '</td>' +
										'<td>' + element.dest + '</td>' +
										'<td>' + element.peso_kg + '/' + element.tipo_vehiculo + '</td>' +
										'<td>' + element.usuario_auditor + '</td>' +
										'<td>' + element.fecha + '-' + element.hora + '</td>' +
										'</tr>');
								});
							}
							//}		

							//referencias
							var conteo = 0;
							var contador_edicion = 0;
							$("#editar_table_ref").html('');
							if (data.result3) {
								data.result3.forEach(function (element, index) {
									conteo++;
									contador_edicion = contador_edicion + 1;
									var id_indi = element.id;
									var e_referencias = '<tr>' +
										'<tr style="text-align:left; color:white; background-color:#33b5e5;"><th>Empresa</th><th>Fecha Ingreso</th><th>Fecha Retiro</th></tr>' +
										'<td><input type="text" id="eempresa' + conteo + '" class="form-control" value="' + element.nombre_empresa + '" style="width:310px; height:14px; font-size:90%; margin-left:1px; "></td>' +
										'<td><input type="date" id="efingreso' + conteo + '" class="form-control" value="' + element.fecha_ingreso + '" style=" height:14px; font-size:90%;"></td>' +
										'<td><input type="date" id="efretiro' + conteo + '" class="form-control" value="' + element.fecha_retiro + '" style=" height:14px; font-size:90%;"></td></tr>' +
										'<tr><th>Contacto</th><th>Teléfono</th><th>Cargo</th></tr>' +
										'<tr><td><input type="text" id="econtacto' + conteo + '"  class="form-control"  value="' + element.persona_contacto + '" style="width:310px; height:14px; font-size:90%;"></td>' +
										'<td><input type="number" id="enumero' + conteo + '" class="form-control" value="' + element.celular + '" style="width:169px; height:14px; font-size:90%; "></td>' +
										'<td><input type="text" id="ecargo' + conteo + '" class="form-control" value="' + element.cargo + '" style="width:169px; height:14px; font-size:90%; "></td>' +
										'<td><input type="hidden" id="eid' + conteo + '" class="form-control" value="' + id_indi + '" style="width:65px; height:14px; font-size:69%;" readonly="readonly"></td>' +
										'</tr>  <tr style="width:10px;background-color:blue;margin-top:2px;"><hr></hr></tr>';
									$("#editar_table_ref").append(e_referencias);
								});

							}
							$("#total_edicion").val(contador_edicion);
							console.log('contador_edicion' + contador_edicion);

						}
					}
				}
				if (data.result == null) {
					alert('No existe el vehiculo en preestudio');
					//INGRESAR COMO NUEVO
					consultar_placa2();
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log('no hay nada, vp');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}

}

function consultar_placa3() {
	alert('consultar placa3');
	//$(".positivo").hide('');
	$("#registre_carro").hide();
	$(".thv").hide();
	$("#divdatos").hide();
}

//FUNCION PARA CONSULTAR LOS DATOS DEL VEHÍCULO EN HV
function consultar_hojadevida() {
	//traer los datos a los campos 
	//alert('1123');
	placa = $("#placa").val();
	var dato = {
		id: placa,
		action: 'consultar_preestudio2'
	};

	$.ajax({
		url: url2,
		type: 'POST',
		data: dato,
		dataType: 'json',
		beforeSend: function (jqXHR, settings) {
			$("html, body").animate({ scrollTop: 0 }, 600);
			// setTimeout(function() { location.reload(false);  }, 800);
		},
		success: function (data) {

			if (data.result != null) {
				//EXISTE UN VEHICULO EN HOJA DE VIDA
				$("#placag").val(placa);
				$("#su_placa").val(placa);
				$("#placat").val(data.result[0].placa_trailer);
				$("#web").val(data.result[0].web_satelital);
				$("#user_satelite").val(data.result[0].usuario_satelital);
				$("#clave").val(data.result[0].clave_satelital);
				$("#nompro").val(data.result[0].nombre_propietario + ' ' + data.result[0].proape1 + ' ' + data.result[0].proape2);
				$("#docupro").val(data.result[0].documento_propietario);
				$("#nomtene").val(data.result[0].nombre_tenedor + ' ' + data.result[0].teape1 + ' ' + data.result[0].teape2);
				$("#docutene").val(data.result[0].documento_tenedor);
				$("#nomcondu").val(data.result[0].nombre_conductor + ' ' + data.result[0].coape1 + ' ' + data.result[0].coape2);
				$("#docucondu").val(data.result[0].documento_conductor);
				$("#deta_condu").val(data.result[0].id_detacondu);
				$("#capa_carga_vh").val(data.result[0].capacidad_tn);


				//licencia
				if (data.result[0].n_docu_licencia != '' && data.result[0].n_docu_licencia != null) {
					var newd = '<input type="file" class="form-control input-xs" name="' + data.result[0].id_conductor + '" id="docuupdatepli1"   onchange="li(this.value)" disabled="disabled"><input type="text" class="form-control input-xs" readonly="readonly" id="namedupdateli1"> ';
					$("#documentos_licencia").append('<tr><td>1</td>' +
						'<td>' +
						'<a  href="http://localhost/mvcLuisMiguel/' + data.result[0].subir_licencia + '/' + data.result[0].n_docu_licencia + '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
						'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
						'</span>' +
						'</a>'
						+ '</td>' +
						'<td>' + data.result[0].n_docu_licencia + '</td>' +
						'<td>' + newd + '</td>'
						+ '</tr>');
				}

				//Rut
				if (data.result[0].n_docu_rut != '' && data.result[0].n_docu_rut != null) {
					var newd = '<input type="file" class="form-control input-xs" name="' + data.result[0].id_conductor + '" id="docuupdatepru1" onchange="rut(this.value)" disabled="disabled"><input type="text" class="form-control input-xs" readonly="readonly" id="namedupdateru1"> ';
					$("#documentos_rut").append('<tr><td>1</td>' +
						'<td>' +
						'<a  href="http://localhost/mvcLuisMiguel/' + data.result[0].documento_rut + '/' + data.result[0].n_docu_rut + '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
						'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
						'</span>' +
						'</a>'
						+ '</td>' +
						'<td>' + data.result[0].n_docu_rut + '</td>' +
						'<td>' + newd + '</td>'
						+ '</tr>');
				}

				//EPS
				if (data.result[0].n_docu_eps != '' && data.result[0].n_docu_eps != null) {
					var newd = '<input type="file" class="form-control input-xs" name="' + data.result[0].id_conductor + '" id="docuupdateeps1" onchange="eps(this.value)" disabled="disabled"><input type="text" class="form-control input-xs" readonly="readonly" id="namedupdateeps1"> ';
					$("#documentos_eps").append('<tr><td>1</td>' +
						'<td>' +
						'<a  href="http://localhost/mvcLuisMiguel/' + data.result[0].documento_eps + '/' + data.result[0].n_docu_eps + '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
						'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
						'</span>' +
						'</a>'
						+ '</td>' +
						'<td>' + data.result[0].n_docu_eps + '</td>' +
						'<td>' + newd + '</td>'
						+ '</tr>');
				}

				//ARL
				if (data.result[0].n_docu_arl != '' && data.result[0].n_docu_arl != null) {
					var newd = '<input type="file" class="form-control input-xs" name="' + data.result[0].id_conductor + '" id="docuupdatearl1" onchange="arl(this.value)" disabled="disabled"><input type="text" class="form-control input-xs" readonly="readonly" id="namedupdatearl1"> ';

					$("#documentos_arl").append('<tr><td>1</td>' +
						'<td>' +
						'<a  href="http://localhost/mvcLuisMiguel/' + data.result[0].documento_arl + '/' + data.result[0].n_docu_arl + '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
						'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
						'</span>' +
						'</a>'
						+ '</td>' +
						'<td>' + data.result[0].n_docu_arl + '</td>' +
						'<td>' + newd + '</td>'
						+ '</tr>');
				}

				//CURSO MERCANCIA PELIGROSA
				if (data.result[0].n_docu_curso != '' && data.result[0].n_docu_curso != null) {
					var newd = '<input type="file" class="form-control input-xs" name="' + data.result[0].id_conductor + '" id="docuupdatecurso1" onchange="curso(this.value)" disabled="disabled"><input type="text" class="form-control input-xs" readonly="readonly" id="namedupdatecurso1"> ';
					$("#documentos_peligro").append('<tr><td>1</td>' +
						'<td>' +
						'<a  href="http://localhost/mvcLuisMiguel/' + data.result[0].carnet_curso + '/' + data.result[0].n_docu_curso + '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
						'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
						'</span>' +
						'</a>'
						+ '</td>' +
						'<td>' + data.result[0].n_docu_curso + '</td>' +
						'<td>' + newd + '</td>'
						+ '</tr>');
				}


			}

			//referencias laborales de la hoja de vida
			var cun = 0;
			var d = 0;
			$("#consulta_documentos").html('');
			if (data.result3 != null) {

				data.result3.forEach(function (element, index) {

					cun++
					$("#idconductor").val(element.id_conductor);
					$("#idrl" + cun).val(element.id);
					$("#referencias_empresariales" + cun).val(element.nombre_empresa);
					$("#fingreso" + cun).val(element.fecha_ingreso);
					$("#fretiro" + cun).val(element.fecha_retiro);
					$("#contacto_ref" + cun).val(element.persona_contacto);
					$("#celular_ref" + cun).val(element.celular);
					$("#cargo_ref" + cun).val(element.cargo);
					$("#anti_ref" + cun).val(element.antiguedad);

					if (element.name_documento != null) {
						d++
						var docu, name, newd;
						if (element.name_documento != null && element.name_documento != '') {
							docu = '<a  href="http://localhost/mvcLuisMiguel/' + element.documento_empresarial + '/' + element.name_documento + '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
								'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
								'</span>' +
								'</a>';
							name = element.name_documento;
							newd = '<input type="file" class="form-control input-xs" name="' + element.id + '" id="docuupdate' + d + '" onchange="doclab(this.value,' + d + ')"  disabled="disabled"><input type="text" class="form-control input-xs" readonly="readonly" id="namedupdate' + d + '"> ';
							$("#consulta_documentos").append('<tr><td>' + d + '<input type="hidden" id="idr' + d + '" value="' + element.id + '" style="width:10px;" ></td>' +
								'<td>' + docu + '</td>' + '<td>' + name + '</td><td>' + newd + '</td></tr>');
						}
					}
				});
			}

			//referencias personales de la hoja de vida
			var per = 0;
			var p = 0;
			$("#documentos_personal").html('');
			if (data.result33 != null) {
				data.result33.forEach(function (element, index) {
					per++
					var pare = element.parentezco;
					if (pare == '1') {
						$("#parenp" + per).html('<option value="' + pare + '">Amigo/a</option>' +
							'<option value="2">Hermano/a</option>' +
							'<option value="3">Padre</option>' +
							'<option value="4">Madre</option>' +
							'<option value="5">Tio/a</option>' +
							'<option value="6">Sobrino/a</option>' +
							'<option value="7">Hijo/a</option>' +
							'<option value="8">Espaso/a</option>');
					}

					if (pare == '2') {
						$("#parenp" + per).html('<option value="' + pare + '">Hermano/a</option>' +
							'<option value="1">Amigo/a</option>' +
							'<option value="3">Padre</option>' +
							'<option value="4">Madre</option>' +
							'<option value="5">Tio/a</option>' +
							'<option value="6">Sobrino/a</option>' +
							'<option value="7">Hijo/a</option>' +
							'<option value="8">Espaso/a</option>');
					}
					if (pare == '3') {
						$("#parenp" + per).html('<option value="' + pare + '">Padre</option>' +
							'<option value="1">Amigo/a</option>' +
							'<option value="2">Hermano/a</option>' +
							'<option value="4">Madre</option>' +
							'<option value="5">Tio/a</option>' +
							'<option value="6">Sobrino/a</option>' +
							'<option value="7">Hijo/a</option>' +
							'<option value="8">Espaso/a</option>');
					}
					if (pare == '4') {
						$("#parenp" + per).html('<option value="' + pare + '">Madre</option>' +
							'<option value="1">Amigo/a</option>' +
							'<option value="2">Hermano/a</option>' +
							'<option value="3">Padre</option>' +
							'<option value="5">Tio/a</option>' +
							'<option value="6">Sobrino/a</option>' +
							'<option value="7">Hijo/a</option>' +
							'<option value="8">Espaso/a</option>');
					}
					if (pare == '5') {
						$("#parenp" + per).html('<option value="' + pare + '">Tio/a</option>' +
							'<option value="1">Amigo/a</option>' +
							'<option value="2">Hermano/a</option>' +
							'<option value="3">Padre</option>' +
							'<option value="4">Madre</option>' +
							'<option value="6">Sobrino/a</option>' +
							'<option value="7">Hijo/a</option>' +
							'<option value="8">Espaso/a</option>');
					}
					if (pare == '6') {
						$("#parenp" + per).html('<option value="' + pare + '">Sobrino/a</option>' +
							'<option value="1">Amigo/a</option>' +
							'<option value="2">Hermano/a</option>' +
							'<option value="3">Padre</option>' +
							'<option value="4">Madre</option>' +
							'<option value="5">Tio/a</option>' +
							'<option value="7">Hijo/a</option>' +
							'<option value="8">Espaso/a</option>');
					}
					if (pare == '7') {
						$("#parenp" + per).html('<option value="' + pare + '">Hijo/a</option>' +
							'<option value="1">Amigo/a</option>' +
							'<option value="2">Hermano/a</option>' +
							'<option value="3">Padre</option>' +
							'<option value="4">Madre</option>' +
							'<option value="5">Tio/a</option>' +
							'<option value="6">Sobrino/a</option>' +
							'<option value="8">Espaso/a</option>');
					}
					if (pare == '8') {
						$("#parenp" + per).html('<option value="' + pare + '">Espaso/a</option>' +
							'<option value="1">Amigo/a</option>' +
							'<option value="2">Hermano/a</option>' +
							'<option value="3">Padre</option>' +
							'<option value="4">Madre</option>' +
							'<option value="5">Tio/a</option>' +
							'<option value="6">Sobrino/a</option>' +
							'<option value="7">Hijo/a</option>');
					}
					$("#referencias_personales" + per).val(element.nombre_personal);
					$("#fecha_personal" + per).val(element.fecha_personal);
					//$("#parenp"+per).val(element.parentezco);
					$("#telefonop" + per).val(element.tel_personal);
					$("#idrper" + per).val(element.id);
					var newd;
					if (element.name_documento != null && element.name_documento != '') {
						p++
						newd = '<input type="file" class="form-control input-xs" name="' + element.id + '" id="docuupdatep' + p + '"  onchange="docper(this.value,' + p + ')" disabled="disabled"><input type="text" class="form-control input-xs" readonly="readonly" id="namedupdatep' + p + '"> ';
						$("#documentos_personal").append('<tr><td>' + p + '<input type="hidden" id="idp' + p + '" value="' + element.id + '" style="width:10px;" ></td>' +
							'<td>' +
							'<a  href="http://localhost/mvcLuisMiguel/' + element.documento_personal + '/' + element.name_documento + '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
							'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
							'</span>' +
							'</a>'
							+ '</td>' +
							'<td>' + element.name_documento + '</td>' +
							'<td>' + newd + '</td>'
							+ '</tr>');
					}
				});
			}

		},
		error(jqXHR, textStatus, errorThrown) {
			console.log('no hay nada');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}

/*
function consultar_placa2(){
	placa=$("#placa").val();
	// alert(placa);
	if(placa!=''){
	// alert('si hay placa ene l campo ');
	var dato={
		id:placa,
		action:'consultar_preestudio'
	};
	$.ajax({
		url:url2,
		type:'POST',
		data:dato,
		dataType:'json',
		beforeSend: function(jqXHR, settings){
		$("html, body").animate({ scrollTop: 0 }, 600);
		// setTimeout(function() { location.reload(false);  }, 800);
		},
		success: function(data){
		console.log(data);
		if(data.result2==null){
			console.log('no hay vehiculo en tb principal');
			//insertar en presestudio_vehiculo
			$(".thv").show();
			$("#placag").val(placa);
			$("#registre_carro").show();
			$("#sms").html('<p>No existe un Vehiculo con esta Placa</p>');
			$("#crear_preestudio").show();
			$("#crear_preestudio2").hide();
			//poner radio button de vehiculo nuevo seleccionado
			$("#nuevo").prop("disabled", false);
			$("#habil").prop('disabled', true );
			$("#update").prop('disabled', true);
			$("#nuevo").prop("checked", true);
			$("#habil").prop("checked", false);
			$("#update").prop("checked", false);
			//ocultar y mostrar acordeones de acuerdo al resultado del sql
			$(".thv").show();
			$("#nuevo").show();
			$("#nuevo2").show();
			$("#habil").hide();
			$("#update").hide();
			$("#habil2").hide();
			$("#update2").hide();
			$(".panel_referenciahv").hide();
			$(".panel_referenciaNEW").show();
			$(".panel_refepersonal").hide();
			$(".panel_papeles_actualiza").hide();
			$(".panel_papeles_habilitar").hide();
			$("#papeles").show();

			
		}else if(data.result2!=null){
			console.log('si hay vehiculo ');
			alert('hola entro aqui');
			//insert en preestudio y update cmx_vehiculo
			//SI EXISTE UN VEHICULO en cmx_vehiculos
			//validación de radiobutton 
			$("#nuevo").prop("disabled", true);
			$("#update").prop('disabled', false );
			$("#habil").prop('disabled', false);
			$("#nuevo").prop("checked", false);
			$("#update").prop("checked", false);
			$("#habil").prop("checked", true);
			$(".thv").show();
			//radiobutton de tipo de operacion
			$("#nuevo").hide();
			$("#habil").show();
			$("#update").show();
			$("#nuevo2").hide();
			$("#habil2").show();
			$("#update2").show();
			$(".panel_referenciahv").show();
			$(".panel_referenciaNEW").hide();
			$(".panel_refepersonal").show();
			$(".panel_papeles_actualiza").remove();
			$(".panel_papeles_habilitar").show();

			$("#placag").val(placa);
			$("#placat").val(data.result2[0].placa_trailer);
			$("#web").val(data.result2[0].web_satelital);
			$("#user_satelite").val(data.result2[0].usuario_satelital);
			$("#clave").val(data.result2[0].clave_satelital);
			$("#nompro").val(data.result2[0].nombre_propietario);
			$("#docupro").val(data.result2[0].documento_propietario);
			$("#nomtene").val(data.result2[0].nombre_tenedor);
			$("#docutene").val(data.result2[0].documento_tenedor);
			$("#nomcondu").val(data.result2[0].nombre_conductor);	
			$("#docucondu").val(data.result2[0].documento_conductor);
			$("#deta_condu").val(data.result2[0].id_detacondu);
			
			// insert_preestudioupdatecarro();
			$("#registre_carro").show();
			$("#crear_preestudio2").hide();
			$("#crear_preestudio").show();

			//referencias laborales de la hoja de vida
			var cun=0;
			var d=0;
			$("#consulta_documentos").html('');
			if(data.result3!=null){
				data.result3.forEach(function(element,index){
					cun++
					$("#idconductor").val(element.id_conductor);
					$("#idrl"+cun).val(element.id);
					$("#referencias_empresariales"+cun).val(element.nombre_empresa);
					$("#fingreso"+cun).val(element.fecha_ingreso);
					$("#fretiro"+cun).val(element.fecha_retiro);
					$("#contacto_ref"+cun).val(element.persona_contacto);
					$("#celular_ref"+cun).val(element.celular);
					$("#cargo_ref"+cun).val(element.cargo);
					$("#anti_ref"+cun).val(element.antiguedad);
					
					if(element.name_documento!=null){
							d++
							var docu, name, newd;
							if(element.name_documento!=null && element.name_documento!=''){
								 docu='<a  href="http://localhost/mvcLuisMiguel/'+element.documento_empresarial+'/'+element.name_documento+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
								name=element.name_documento;
								newd='<input type="file" class="form-control input-xs" name="'+element.id+'" id="docuupdate'+d+'" onchange="doclab(this.value,'+d+')"><input type="text" class="form-control input-xs" readonly="readonly" id="namedupdate'+d+'"> ';
								$("#consulta_documentos").append('<tr><td>'+d+'<input type="hidden" id="idr'+d+'" value="'+element.id+'" style="width:10px;" ></td>'+
											'<td>'+docu+'</td>'+'<td>'+name+'</td><td>'+newd+'</td></tr>');
							}	
					}
				});
			}

			//referencias personales de la hoja de vida
			var per=0;
			var p=0;
			$("#documentos_personal").html('');
			if(data.result33!=null){
				data.result33.forEach(function(element,index){
					per++
					var pare=element.parentezco;
							if(pare=='1'){
								$("#parenp"+per).html('<option value="'+pare+'">Amigo/a</option>'+
									'<option value="2">Hermano/a</option>'+
									'<option value="3">Padre</option>'+
									'<option value="4">Madre</option>'+
									'<option value="5">Tio/a</option>'+
									'<option value="6">Sobrino/a</option>'+
									'<option value="7">Hijo/a</option>'+
									'<option value="8">Espaso/a</option>');
							}

							if(pare=='2'){
								$("#parenp"+per).html('<option value="'+pare+'">Hermano/a</option>'+
									'<option value="1">Amigo/a</option>'+
									'<option value="3">Padre</option>'+
									'<option value="4">Madre</option>'+
									'<option value="5">Tio/a</option>'+
									'<option value="6">Sobrino/a</option>'+
									'<option value="7">Hijo/a</option>'+
									'<option value="8">Espaso/a</option>');
								}
								if(pare=='3'){
								$("#parenp"+per).html('<option value="'+pare+'">Padre</option>'+
									'<option value="1">Amigo/a</option>'+
									'<option value="2">Hermano/a</option>'+
									'<option value="4">Madre</option>'+
									'<option value="5">Tio/a</option>'+
									'<option value="6">Sobrino/a</option>'+
									'<option value="7">Hijo/a</option>'+
									'<option value="8">Espaso/a</option>');
						 }
						 if(pare=='4'){
								$("#parenp"+per).html('<option value="'+pare+'">Madre</option>'+
									'<option value="1">Amigo/a</option>'+
									'<option value="2">Hermano/a</option>'+
									'<option value="3">Padre</option>'+
									'<option value="5">Tio/a</option>'+
									'<option value="6">Sobrino/a</option>'+
									'<option value="7">Hijo/a</option>'+
									'<option value="8">Espaso/a</option>');
						 }
							if(pare=='5'){
								$("#parenp"+per).html('<option value="'+pare+'">Tio/a</option>'+
									'<option value="1">Amigo/a</option>'+
									'<option value="2">Hermano/a</option>'+
									'<option value="3">Padre</option>'+
									'<option value="4">Madre</option>'+
									'<option value="6">Sobrino/a</option>'+
									'<option value="7">Hijo/a</option>'+
									'<option value="8">Espaso/a</option>');
						 }
						 if(pare=='6'){
								$("#parenp"+per).html('<option value="'+pare+'">Sobrino/a</option>'+
									'<option value="1">Amigo/a</option>'+
									'<option value="2">Hermano/a</option>'+
									'<option value="3">Padre</option>'+
									'<option value="4">Madre</option>'+
									'<option value="5">Tio/a</option>'+
									'<option value="7">Hijo/a</option>'+
									'<option value="8">Espaso/a</option>');
						 }
						 if(pare=='7'){
								$("#parenp"+per).html('<option value="'+pare+'">Hijo/a</option>'+
									'<option value="1">Amigo/a</option>'+
									'<option value="2">Hermano/a</option>'+
									'<option value="3">Padre</option>'+
									'<option value="4">Madre</option>'+
									'<option value="5">Tio/a</option>'+
									'<option value="6">Sobrino/a</option>'+
									'<option value="8">Espaso/a</option>');
						 }
							if(pare=='8'){
								$("#parenp"+per).html('<option value="'+pare+'">Espaso/a</option>'+
									'<option value="1">Amigo/a</option>'+
									'<option value="2">Hermano/a</option>'+
									'<option value="3">Padre</option>'+
									'<option value="4">Madre</option>'+
									'<option value="5">Tio/a</option>'+
									'<option value="6">Sobrino/a</option>'+
									'<option value="7">Hijo/a</option>');
						 }
					$("#referencias_personales"+per).val(element.nombre_personal);
					$("#fecha_personal"+per).val(element.fecha_personal);
					//$("#parenp"+per).val(element.parentezco);
					$("#telefonop"+per).val(element.tel_personal);
					$("#idrper"+per).val(element.id);
					var newd;
					if(element.name_documento!=null && element.name_documento!='' ){
						p++
						newd='<input type="file" class="form-control input-xs" name="'+element.id+'" id="docuupdatep'+p+'"  onchange="docper(this.value,'+p+')"><input type="text" class="form-control input-xs" readonly="readonly" id="namedupdatep'+p+'"> ';
						$("#documentos_personal").append('<tr><td>'+p+'<input type="hidden" id="idp'+p+'" value="'+element.id+'" style="width:10px;" ></td>'+
							'<td>'+
								'<a  href="http://localhost/mvcLuisMiguel/'+element.documento_personal+'/'+element.name_documento+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>'
							+'</td>'+
							'<td>'+element.name_documento+'</td>'+
							'<td>'+newd+'</td>'
						+'</tr>');
					}
				});
			}

			//licencia
			if(data.result2[0].n_docu_licencia!='' && data.result2[0].n_docu_licencia!=null){
				var newd='<input type="file" class="form-control input-xs" name="'+data.result2[0].id_conductor+'" id="docuupdatepli1"   onchange="li(this.value)" ><input type="text" class="form-control input-xs" readonly="readonly" id="namedupdateli1"> ';
				$("#documentos_licencia").append('<tr><td>1</td>'+
							'<td>'+
								'<a  href="http://localhost/mvcLuisMiguel/'+data.result2[0].subir_licencia+'/'+data.result2[0].n_docu_licencia+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>'
							+'</td>'+
							'<td>'+data.result2[0].n_docu_licencia+'</td>'+
							'<td>'+newd+'</td>'
						+'</tr>');
			}

			//Rut
			if(data.result2[0].n_docu_rut!='' && data.result2[0].n_docu_rut!=null){
				var newd='<input type="file" class="form-control input-xs" name="'+data.result2[0].id_conductor+'" id="docuupdatepru1" onchange="rut(this.value)"><input type="text" class="form-control input-xs" readonly="readonly" id="namedupdateru1"> ';
				$("#documentos_rut").append('<tr><td>1</td>'+
							'<td>'+
								'<a  href="http://localhost/mvcLuisMiguel/'+data.result2[0].documento_rut+'/'+data.result2[0].n_docu_rut+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>'
							+'</td>'+
							'<td>'+data.result2[0].n_docu_rut+'</td>'+
							'<td>'+newd+'</td>'
						+'</tr>');
			}

			//EPS
			if(data.result2[0].n_docu_eps!='' && data.result2[0].n_docu_eps!=null){
				var newd='<input type="file" class="form-control input-xs" name="'+data.result2[0].id_conductor+'" id="docuupdateeps1" onchange="eps(this.value)" ><input type="text" class="form-control input-xs" readonly="readonly" id="namedupdateeps1"> ';
				$("#documentos_eps").append('<tr><td>1</td>'+
							'<td>'+
								'<a  href="http://localhost/mvcLuisMiguel/'+data.result2[0].documento_eps+'/'+data.result2[0].n_docu_eps+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>'
							+'</td>'+
							'<td>'+data.result2[0].n_docu_eps+'</td>'+
							'<td>'+newd+'</td>'
						+'</tr>');
			}

			//ARL
			if(data.result2[0].n_docu_arl!='' && data.result2[0].n_docu_arl!=null){
				var newd='<input type="file" class="form-control input-xs" name="'+data.result2[0].id_conductor+'" id="docuupdatearl1" onchange="arl(this.value)" ><input type="text" class="form-control input-xs" readonly="readonly" id="namedupdatearl1"> ';

				$("#documentos_arl").append('<tr><td>1</td>'+
							'<td>'+
								'<a  href="http://localhost/mvcLuisMiguel/'+data.result2[0].documento_arl+'/'+data.result2[0].n_docu_arl+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>'
							+'</td>'+
							'<td>'+data.result2[0].n_docu_arl+'</td>'+
							'<td>'+newd+'</td>'
						+'</tr>');
			}

			//CURSO MERCANCIA PELIGROSA
			if(data.result2[0].n_docu_curso!='' && data.result2[0].n_docu_curso!=null){
				var newd='<input type="file" class="form-control input-xs" name="'+data.result2[0].id_conductor+'" id="docuupdatecurso1" onchange="curso(this.value)"><input type="text" class="form-control input-xs" readonly="readonly" id="namedupdatecurso1"> ';
				$("#documentos_peligro").append('<tr><td>1</td>'+
							'<td>'+
								'<a  href="http://localhost/mvcLuisMiguel/'+data.result2[0].carnet_curso+'/'+data.result2[0].n_docu_curso+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>'
							+'</td>'+
							'<td>'+data.result2[0].n_docu_curso+'</td>'+
							'<td>'+newd+'</td>'
						+'</tr>');
			}
		}
		if(data.result==null){
			console.log('is null');
			//NO EXISTEN SOLICITUD DE PREESTUDIO
		}else if(data.result!=null){
			//EXISTE SOLICITUD DE PREESTUDIO PARA LA PLACA
			console.log('no es nulo');
			console.log(data);
			$("#rad8").prop("disabled", true);
			$("#rad9").prop('disabled', true );
			$("#rad6").prop('disabled', false);
			$("#rad8").prop("checked", false);
			$("#rad9").prop("checked", false);
			$("#rad6").prop("checked", true);
			$("#controles_tipo").show();
			$("#nuevo").hide();
			$("#habil").show();
			$("#update").show();
			$("#nuevo2").hide();
			$("#habil2").show();
			$("#update2").show();

			$(".panel_referenciahv").show();
			$(".panel_referenciaNEW").hide();
			$(".panel_refepersonal").show();

			if(data.result[0].estado_vehiculo==='Desbloquear'){
				console.log('habil');
				//entonces desplegar datos para insert en  la solicitud 
				// $("#solicitud").show();
				// $("#edite_carro").show();
				$("#registre_carro").hide();//boton
				//traer datos del vehiculo
				$("#diveditardatos").show();
				$("#e_consecutivo").val(data.result[0].idv);
				$("#e_placa").val(data.result[0].placa_vehiculo);
				$("#e_trailer").val(data.result[0].placa_trailer);
				$("#e_web").val(data.result[0].web_satelital);
				$("#e_usuario").val(data.result[0].usuario_satelital);
				$("#e_clave").val(data.result[0].clave_satelital);
				$("#e_propietario").val(data.result[0].nombre_propietario);
				$("#e_numpro").val(data.result[0].documento_propietario);
				$("#e_tenedor").val(data.result[0].nombre_tenedor);
				$("#e_numtene").val(data.result[0].documento_tenedor);
				$("#e_conductor").val(data.result[0].nombre_conductor);
				$("#e_numcondu").val(data.result[0].documento_conductor);
				//referencias
				var conteo=0;
				var contador_edicion=0;
				$("#editar_table_ref").html('');
				if(data.result3){
					data.result3.forEach(function(element,index){
					conteo++;
					contador_edicion=contador_edicion+1;
					var id_indi=element.id;
					var e_referencias='<tr>'+
						'<tr style="text-align:left; color:white; background-color:#33b5e5;"><th>Empresa</th><th>Fecha Ingreso</th><th>Fecha Retiro</th></tr>'+
					'<td><input type="text" id="eempresa'+conteo+'" class="form-control" value="'+element.nombre_empresa+'" style="width:310px; height:14px; font-size:90%; margin-left:1px; "></td>'+
					'<td><input type="date" id="efingreso'+conteo+'" class="form-control" value="'+element.fecha_ingreso+'" style=" height:14px; font-size:90%;"></td>'+
					'<td><input type="date" id="efretiro'+conteo+'" class="form-control" value="'+element.fecha_retiro+'" style=" height:14px; font-size:90%;"></td></tr>'+
					'<tr><th>Contacto</th><th>Teléfono</th><th>Cargo</th></tr>'+
					'<tr><td><input type="text" id="econtacto'+conteo+'"  class="form-control"  value="'+element.persona_contacto+'" style="width:310px; height:14px; font-size:90%;"></td>'+
					'<td><input type="number" id="enumero'+conteo+'" class="form-control" value="'+element.celular+'" style="width:169px; height:14px; font-size:90%; "></td>'+
					'<td><input type="text" id="ecargo'+conteo+'" class="form-control" value="'+element.cargo+'" style="width:169px; height:14px; font-size:90%; "></td>'+
					'<td><input type="hidden" id="eid'+conteo+'" class="form-control" value="'+id_indi+'" style="width:65px; height:14px; font-size:69%;" readonly="readonly"></td>'+
					'</tr>  <tr style="width:10px;background-color:blue;margin-top:2px;"><hr></hr></tr>';
					$("#editar_table_ref").append(e_referencias);
					});
				}
				
				$("#total_edicion").val(contador_edicion);
				console.log('contador_edicion'+contador_edicion);
				if(data.result[0].estado=='rechazado para modificar'  && data.result[0].estado_actual==='1'){
					console.log('rechazado para modificar');
					//actualizar solicitud anterior
					$("#crear").hide();//acordeon crear 
					$("#new_sol").hide();//acordeon nueva solicitud
						$("#sconsecutivo").val(data.result[0].idsolu);
						$("#sobserve").val(data.result[0].observacion);

						//solicitudes de servicio al cliente
						if(data.result4){
							data.result4.forEach(function(element,index){
							$("#tmoda_servicio").append('<tr>'+
								'<td>'+element.nombre_cliente+'</td>'+
								'<td>'+element.orige+'</td>'+
								'<td>'+element.dest+'</td>'+
								'<td>'+element.peso_kg+'/'+element.tipo_vehiculo+'</td>'+
								'<td>'+element.usuario_auditor+'</td>'+
								'<td>'+element.fecha+'-'+element.hora+'</td>'+
							'</tr>');
							});
						}
			}

			if(data.result[0].estado=='aprobado'  || data.result[0].estado=='rechazado' || data.result[0].estado=='cancelado' && data.result[0].estado_actual==='1'){
				console.log('aprobado , rechazado, cancelado');
				//solicitud nueva, update vehiculopreestudio anterior
				$("#update_sol").hide();
				$("#btn_editarpreestudio").hide();
				$("#new_sol").show();
				$("#scliente_new").val(data.result[0].cliente);
				$("#sconsecutivo_antes").val(data.result[0].idsolu);
				$("#crear").hide();
				$("#nuevo").hide();
				$("#habil").hide();
				$("#update").hide();
				$("#nuevo2").hide();
				$("#habil2").hide();
				$("#update2").hide();
				$("#mensaje_inciado").show();
				$("#mensaje_inciado").html('<p class="text-center text-primary"><strong>Esta placa a tiene una solicitud de preestudio asociada</strong></p>');
			}

			if(data.result[0].estado=='iniciado' || data.result[0].estado=='pendiente' && data.result[0].estado_actual==='1'){
				//desaparecer todo y mostrar mensaje
				var ee=data.result[0].estado;
				$("#diveditardatos").hide();
				$("#crear").hide();//acordeon crear 
				$("#new_sol").hide();//acordeon nueva solicitud
				$("#update_sol").hide();
				$("#btn_editarpreestudio").hide();
				$("#mensaje_inciado").show();
				$("#mensaje_inciado").html('<p class="text-center text-primary"><strong>No puede actualizar porque ya esta '+ee+' por seguridad</strong></p>');
			}

			}
			if(data.result[0].estado_vehiculo==='Bloquear'){
				console.log('no habil');
				$("#registre_carro").hide();
				$("#mensaje_vehiculo_bloquear").html('<br><p style="font-size:16pt; font-weight:500; color:#2E2E2E;">Este Vehículo esta inhabilitado por favor comuniquese con seguridad</p>');
				$(".editedatosvehiculo").show();
			}  
		}
	},
		error(jqXHR, textStatus, errorThrown){
			console.log('no hay nada');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
		});	


}else{
	alert('Por favor registre la placa');
}
} */

//funciones para traer los nombres de los documentos a actualizar
function doclab(fic, id) {
	fic = fic.split('\\');
	if (fic == '' || fic == null) {
		$("#namedupdate" + id).val('');
	} else {
		$("#namedupdate" + id).val(fic[fic.length - 1]);
	}
}

function docper(fic, id) {
	fic = fic.split('\\');
	if (fic == '' || fic == null) {
		$("#namedupdatep" + id).val('');
	} else {
		$("#namedupdatep" + id).val(fic[fic.length - 1]);
	}
}


function li(fic) {
	fic = fic.split('\\');
	if (fic == '' || fic == null) {
		$("#namedupdateli").val('');
	} else {
		$("#namedupdateli").val(fic[fic.length - 1]);
	}
}

function rut(fic) {
	fic = fic.split('\\');
	if (fic == '' || fic == null) {
		$("#namedupdateru1").val('');
	} else {
		$("#namedupdateru1").val(fic[fic.length - 1]);
	}
}

function eps(fic) {
	fic = fic.split('\\');
	if (fic == '' || fic == null) {
		$("#namedupdateeps1").val('');
	} else {
		$("#namedupdateeps1").val(fic[fic.length - 1]);
	}
}

function arl(fic) {
	fic = fic.split('\\');
	if (fic == '' || fic == null) {
		$("#namedupdatearl1").val('');
	} else {
		$("#namedupdatearl1").val(fic[fic.length - 1]);
	}
}

function curso(fic) {
	fic = fic.split('\\');
	if (fic == '' || fic == null) {
		$("#namedupdatecurso1").val('');
	} else {
		$("#namedupdatecurso1").val(fic[fic.length - 1]);
	}
}

//agregar referencias para crear solicitud
// numero = 0;
// $("#agregar_fila").click(function () {
// 	// 	if($("#valor_vehiculo").val()==''){

// 	// 	// }
// 	// 	//validar que loc campos del vehiculo esten llenos
// 	// 	var msg_error='';
// 	// 	if(!$("#placag").val()){
// 	// 		msg_error+= "<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el vehículo.</p>";
// 	// 	}
// 	// 	if(!$("#web").val()){
// 	// 		msg_error+= "<p>Debe diligenciar el campo <strong>Web satélital</strong> para poder crear el vehículo.</p>";
// 	// 	}
// 	// 	if(!$("#user_satelite").val()){
// 	// 		msg_error+= "<p>Debe diligenciar el campo <strong>usuario</strong> para poder crear el vehículo.</p>";
// 	// 	}
// 	// 	if(!$("#clave").val()){
// 	// 		msg_error+= "<p>Debe diligenciar el campo <strong>Clave</strong> para poder crear el vehículo.</p>";
// 	// 	}
// 	// 	if(!$("#nompro").val()){
// 	// 		msg_error+= "<p>Debe diligenciar el campo <strong>Nombre de Propietario</strong> para poder crear el vehículo.</p>";
// 	// 	}
// 	// 	if(!$("#docupro").val()){
// 	// 		msg_error+= "<p>Debe diligenciar el campo <strong>Documento de Propietario</strong> para poder crear el vehículo.</p>";

// 	// 	}
// 	// 	if(!$("#nomtene").val()){
// 	// 	msg_error+= "<p>Debe diligenciar el campo <strong>Nombre de Tenedor</strong> para poder crear el vehículo.</p>";
// 	// 	}
// 	// 	if(!$("#docutene").val()){
// 	// 		msg_error+= "<p>Debe diligenciar el campo <strong>Documento de Tenedor</strong> para poder crear el vehículo.</p>";

// 	// 	}
// 	// 	if(!$("#nomcondu").val()){
// 	// 		msg_error+= "<p>Debe diligenciar el campo <strong>Nombre de Conductor</strong> para poder crear el vehículo.</p>";

// 	// 	}
// 	// 	if(!$("#docucondu").val()){
// 	// 		msg_error+= "<p>Debe diligenciar el campo <strong>Documento de Conductor</strong> para poder crear el vehículo.</p>";
// 	// 	}
// 	// 	if(!$("#nombre_cliente").val()){
// 	// 		msg_error+= "<p>Debe diligenciar el campo <strong>Nombre del Cliente</strong> para poder crear el vehículo.</p>";
// 	// 	}
// 	// 	if(!$("#obserpree").val()){
// 	// 		msg_error+= "<p>Debe diligenciar el campo <strong>Observaciones </strong> para poder crear el vehículo.</p>";
// 	// 	}
// 	// 	if(!msg_error){
// 	// 		 // alert('ok todo los campos llenos');
// 	// 		 //crear el vehiculo
// 	// 		 insert_vehiculo();
// 	// 		 //traer el id del vehiculos preestudio
// 	// 		 var selct={
// 	// 		 	action:'id_vehic'
// 	// 		 };
// 	// 		 $.ajax({
// 	// 			url:url2,
// 	// 			type:'POST',
// 	// 			data:selct,
// 	// 			dataType:'json',
// 	// 			success:function(data){
// 	// 				//sitraer id ponerlo en el campo
// 	// 				console.log('si trajo id');
// 	// 				if(data.result[0]!=null){
// 	// 					$("#valor_vehiculo").val(data.result[0].id);
// 	// 				}else{
// 	// 					msg_error+= "<p>No hay id del vehiculo</p>";
// 	// 				}
// 	// 			},
// 	// 			error:function(jqXHR, textStatus, errorThrown){
// 	// 				console.log('no hay ningun id');
// 	// 				console.log(jqXHR);
// 	// 				console.log(textStatus);
// 	// 				console.log(errorThrown);
// 	// 			}	
// 	// 		});



// 	// 	}else{
// 	// 		$("#nexos_messages_popup").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
// 	// 		$("#crea_vehiculopreestudio").animate({ scrollTop: 0 }, 600);
// 	// 	}

// 	// }

// 	// if($("#valor_vehiculo").val()!==''){
// 	//agregar();
// 	// }
// 	// agregar();
// 	numero = numero + 1;
// 	if (numero <= 3) {
// 		agregar();
// 	} else {
// 		alert('Señor usuario ha superado el máximo de referencias laborales!!');
// 	}
// });


$("#btn_editarpreestudio").click(function () {
	//update preestudio, solicitud y estados
	update_todo();
});


// var cont = 0;
// var m = 0;
// var contador_global1 = 0;
// function agregar() {
// 	cont++;
// 	m++;
// 	contador_global1 = contador_global1 + 1;
// 	var hoy = moment().format('YYYY-MM-DD');
// 	// alert(hoy);
// 	var referencias = '<tr id="tr' + cont + '">' +
// 		'<tr style="text-align:left; color:white; background-color:#33b5e5; height:20px; "><th>Empresa&nbsp;<span style="color:red;"><i>(*)</i></span></th><th>Fecha Ingreso</th><th>Fecha Retiro</th></tr>' +
// 		'<td><input type="text" id="empresa_crear' + cont + '" class="form-control" style="width:310px; height:14px; font-size:90%; margin-left:1px; "></td>' +
// 		'<td><input type="date" id="fingreso_crear' + cont + '" class="form-control" style=" height:14px; font-size:90%;" value="' + hoy + '"></td>' +
// 		'<td><input type="date" id="fretiro_crear' + cont + '" class="form-control" style=" height:14px; font-size:90%;" value="' + hoy + '"  ></td></tr>' +
// 		'<tr><th>Contacto (Nombres y Apellidos)</th><th>Teléfono&nbsp;<span style="color:red;"><i>(*)</i></span></th><th>Cargo</th></tr>' +
// 		'<tr><td><input type="text" id="contacto_crear' + cont + '"  class="form-control" style="width:310px; height:14px; font-size:90%;"></td>' +
// 		'<td><input type="number" id="numero_crear' + cont + '" class="form-control" style="width:169px; height:14px; font-size:90%; "></td>' +
// 		'<td><input type="text" id="cargo_crear' + cont + '" class="form-control" style="width:169px; height:14px; font-size:90%; "></td>' +
// 		'' +
// 		'</tr>' +
// 		'<tr><th>Antiguedad</th><th>Id</th></tr>' +
// 		'<td><input type="number" id="antiguedad_crear' + cont + '"  class="form-control" min="0" style="width:169px; height:14px; font-size:90%;"></td>' +
// 		'<td style="width:10%;"><input type="text" id="" value="' + m + '" class="form-control" style="height:14px; font-size:90%; width:15%;" readonly="readonly"></td>' +
// 		'<tr style="width:10px;background-color:blue;margin-top:2px;"><div></div></tr>';
// 	$("#table_mercancia").append(referencias);
// }

$("#registre_carro").click(function () {
	alert('ingresar vehiculo');
	$("#divdatos").show();
});

// var contt = 0;
// $("#crear_preestudio").click(function () {
// 	//FECHA CARGUE
// 	var actuali = moment().format('YYYY-MM-DD h:mm:ss');
// 	var sw = 0;
// 	var arreglo = new Array();
// 	$(".fo").each(function (index) {
// 		var a = $(this).val();
// 		//a=parseFloat(a);
// 		arreglo.push(a);
// 	});
// 	var maximo = Math.min.apply(Math, arreglo);
// 	//alert('getmin'+maximo);
// 	for (e = 1; e <= $('#cuerpo_fechas tr').length; e++) {
// 		for (n = 1; n <= e; n++) {
// 			var cant = $("#oculto" + n).val();
// 			if (cant == maximo) {
// 				var idsolicitud = $("#serv" + n).val();
// 				var fechac = $("#fecha" + n).val();
// 				var peso = $("#peso" + n).val();
// 			}
// 		}
// 	}
// 	var msg_error = '';
// 	//validar los documentos 
// 	if ($("#papeles").is(':checked')) {
// 		//alert(b);
// 		var p;
// 		for (p = 1; p == b; p++) {
// 			//var papeles = document.getElementById('documento'+i+'').files;
// 			if (!$("#tipohoja" + p + "").val()) {
// 				msg_error += "<p>Debe diligenciar el campo <strong>Tipo hoja de vida  en la fila " + p + "</strong> para poder crear el prefiltro.</p>";
// 			}
// 			if (!$("#ruta" + p + "").val()) {
// 				msg_error += "<p>Debe seleccionar el campo <strong>Tipo hoja de vida  en la fila " + p + "</strong> para que aparezca una ruta y poder crear el prefiltro.</p>";
// 			}
// 			if (!$("#namearchivo" + p + "").val()) {
// 				msg_error += "<p>Debe seleccionar un  <strong>(1) Archivo  en la fila " + p + " </strong> para poder crear el prefiltro.</p>";
// 			}
// 		}
// 	}

// 	if (!$("#placag").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el vehículo.</p>";
// 		AplicaFoco("#placag");
// 	} else {
// 		RemueveFoco("#placag");
// 	}
// 	if (!$("#web").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>Web satélital</strong> para poder crear el vehículo.</p>";
// 		AplicaFoco("#web");
// 	} else {
// 		RemueveFoco("#web");
// 	}
// 	if (!$("#user_satelite").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>usuario</strong> para poder crear el vehículo.</p>";
// 		AplicaFoco("#user_satelite");
// 	} else {
// 		RemueveFoco("#user_satelite");
// 	}
// 	if (!$("#clave").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>Clave</strong> para poder crear el vehículo.</p>";
// 		AplicaFoco("#clave");
// 	} else {
// 		RemueveFoco("#clave");
// 	}
// 	if (!$("#nompro").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>Nombre de Propietario</strong> para poder crear el vehículo.</p>";
// 		AplicaFoco("#nompro");
// 	} else {
// 		RemueveFoco("#nompro");
// 	}
// 	if (!$("#docupro").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>Documento de Propietario</strong> para poder crear el vehículo.</p>";
// 		AplicaFoco("#docupro");
// 	} else {
// 		RemueveFoco("#docupro");
// 	}
// 	if (!$("#nomtene").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>Nombre de Tenedor</strong> para poder crear el vehículo.</p>";
// 		AplicaFoco("#nomtene");
// 	} else {
// 		RemueveFoco("#nomtene");
// 	}
// 	if (!$("#docutene").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>Documento de Tenedor</strong> para poder crear el vehículo.</p>";
// 		AplicaFoco("#docutene");
// 	} else {
// 		RemueveFoco("#docutene");
// 	}
// 	if (!$("#nomcondu").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>Nombre de Conductor</strong> para poder crear el vehículo.</p>";
// 		AplicaFoco("#nomcondu");
// 	} else {
// 		RemueveFoco("#nomcondu");
// 	}
// 	if (!$("#docucondu").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>Documento de Conductor</strong> para poder crear el vehículo.</p>";
// 		AplicaFoco("#docucondu");
// 	} else {
// 		RemueveFoco("#docucondu");
// 	}

// 	if (!$("#su_propuesto").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>Flete propuesto </strong>en datos de la solicitud para poder crear el vehículo.</p>";
// 		AplicaFoco("#su_propuesto");
// 	} else {
// 		RemueveFoco("#su_propuesto");
// 	}

// 	if (!$('input[name=gender]').is(':checked')) {
// 		msg_error += "<p>Debe diligenciar el <strong>Tipo de operación</strong> para poder crear el vehículo.</p>";
// 	}

// 	if (!$("#total_pesos").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>Total Peso(Kg) </strong>en datos de la solicitud para poder crear el vehículo.</p>";
// 		AplicaFoco("#total_pesos");
// 	} else {
// 		RemueveFoco("#total_pesos");
// 	}

// 	if (!$("#capa_carga_vh").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>Capacidad carga(Kg)</strong>en datos de la solicitud para poder crear el vehículo.</p>";
// 		AplicaFoco("#capa_carga_vh");
// 	} else {
// 		if ($("#capa_carga_vh").val().length > 5) {
// 			msg_error += "<p>El campo <strong>Capacidad carga(Kg)</strong> debe tener máximo 5 dígitos.</p>";
// 		} else {
// 			RemueveFoco("#capa_carga_vh");
// 		}
// 	}
// 	if ($("#total_pesos").val() != '' && $("#capa_carga_vh").val() != '') {
// 		var tpeso = ($("#total_pesos").val()).replace(/,/g, "");
// 		var capacidad = ($("#capa_carga_vh").val()).replace(/,/g, "");
// 		if (parseFloat(tpeso) > parseFloat(capacidad)) {
// 			msg_error += "<p>El <strong>Total sumatoria Peso(Kg) </strong> debe ser menor o igual a la <strong>Capacidad de carga vehículo(Kg)</strong></p>";
// 			AplicaFoco("#total_pesos");
// 			AplicaFoco("#capa_carga_vh");
// 		} else {
// 			RemueveFoco("#total_pesos");
// 			RemueveFoco("#capa_carga_vh");
// 		}
// 	}

// 	if ($("#nuevo").is(':checked') && $("#estado_prefiltron").val() == '') {
// 		if (contador_global1 < 3) {
// 			msg_error += "<p>Debe diligenciar mínimo <strong>tres referencias laborales</strong> para poder crear la referencia.</p>";
// 		}
// 		var m;
// 		for (m = 1; m <= contador_global1; m++) {

// 			if (!$("#empresa_crear" + m + "").val()) {
// 				msg_error += "<p>Debe diligenciar el campo <strong>Empresa " + m + " </strong> para poder crear la referencia.</p>";
// 				AplicaFoco("#empresa_crear" + m + "");
// 			} else {
// 				RemueveFoco("#empresa_crear" + m + "");
// 			}

// 			if (!$("#numero_crear" + m + "").val()) {
// 				msg_error += "<p>Debe diligenciar el campo <strong>Teléfono " + m + " </strong> para poder crear la referencia.</p>";
// 				AplicaFoco("#numero_crear" + m + "");
// 			} else {
// 				if ($("#numero_crear" + m + "").val().length !== 10) {
// 					msg_error += "<p>El campo <strong>Teléfono " + m + " </strong> debe tener 10 dígitos.</p>";
// 				} else {
// 					RemueveFoco("#numero_crear" + m + "");
// 				}
// 			}
// 		}
// 	}

// 	if ($("#nuevo").is(':checked') && $("#estado_prefiltron").val() == 'rechazado') {
// 		var t;
// 		for (t = 1; t <= 3; t++) {
// 			if (!$("#referencias_empresariales" + t).val()) {
// 				msg_error += "<p>Debe diligenciar el campo <strong>Empresa " + t + "</strong>en Referencias laborales para poder crear el vehículo.</p>";
// 				AplicaFoco("#referencias_empresariales" + t);
// 			} else {
// 				RemueveFoco("#referencias_empresariales" + t);
// 			}
// 			if (!$("#celular_ref" + t).val()) {
// 				msg_error += "<p>Debe diligenciar el campo <strong>Celular " + t + "</strong>en Referencias laborales para poder crear el vehículo.</p>";
// 				AplicaFoco("#celular_ref" + t);
// 			} else {
// 				RemueveFoco("#celular_ref" + t);
// 			}
// 		}

// 	}

// 	if ($("#update").is(':checked')) {
// 		//validar referencias laborales y personales para actualizar
// 		var t;
// 		for (t = 1; t <= 3; t++) {
// 			if (!$("#referencias_empresariales" + t).val()) {
// 				msg_error += "<p>Debe diligenciar el campo <strong>Empresa " + t + "</strong>en Referencias laborales para poder crear el vehículo.</p>";
// 				AplicaFoco("#referencias_empresariales" + t);
// 			} else {
// 				RemueveFoco("#referencias_empresariales" + t);
// 			}
// 			if (!$("#celular_ref" + t).val()) {
// 				msg_error += "<p>Debe diligenciar el campo <strong>Celular " + t + "</strong>en Referencias laborales para poder crear el vehículo.</p>";
// 				AplicaFoco("#celular_ref" + t);
// 			} else {
// 				RemueveFoco("#celular_ref" + t);
// 			}
// 		}

// 		var p;
// 		for (p = 1; p <= 2; p++) {
// 			if (!$("#referencias_personales" + p).val()) {
// 				msg_error += "<p>Debe diligenciar el campo <strong>Nombre Persona " + p + "</strong>en Referencias personales para poder crear el vehículo.</p>";
// 				AplicaFoco("#referencias_personales" + p);
// 			} else {
// 				RemueveFoco("#referencias_personales" + p);
// 			}
// 			if (!$("#parenp" + p).val()) {
// 				msg_error += "<p>Debe diligenciar el campo <strong>Parentezco " + p + "</strong>en Referencias personales para poder crear el vehículo.</p>";
// 				AplicaFoco("#parenp" + p);
// 			} else {
// 				RemueveFoco("#parenp" + p);
// 			}
// 			if (!$("#telefonop" + p).val()) {
// 				msg_error += "<p>Debe diligenciar el campo <strong>Teléfono" + p + "</strong>en Referencias personales para poder crear el vehículo.</p>";
// 				AplicaFoco("#telefonop" + p);
// 			} else {
// 				RemueveFoco("#telefonop" + p);
// 			}
// 		}
// 		if (!$("#valortb").val()) {
// 			msg_error += "<p>Debe diligenciar mínimo <strong>un dato para el área de seguridad</strong> en Actualiza seguridad para poder crear el vehículo.</p>";
// 		}
// 	}
// 	if ($("#habil").is(':checked')) {
// 		//validar referencias laborales
// 		var t;
// 		for (t = 1; t <= 3; t++) {
// 			if (!$("#referencias_empresariales" + t).val()) {
// 				msg_error += "<p>Debe diligenciar el campo <strong>Empresa " + t + "</strong>en Referencias laborales para poder crear el vehículo.</p>";
// 				AplicaFoco("#referencias_empresariales" + t);
// 			} else {
// 				RemueveFoco("#referencias_empresariales" + t);
// 			}
// 			if (!$("#celular_ref" + t).val()) {
// 				msg_error += "<p>Debe diligenciar el campo <strong>Celular " + t + "</strong>en Referencias laborales para poder crear el vehículo.</p>";
// 				AplicaFoco("#celular_ref" + t);
// 			} else {
// 				RemueveFoco("#celular_ref" + t);
// 			}
// 		}
// 		//validar referencias personales
// 		var p;
// 		for (p = 1; p <= 2; p++) {
// 			if (!$("#referencias_personales" + p).val()) {
// 				msg_error += "<p>Debe diligenciar el campo <strong>Nombre Persona " + p + "</strong>en Referencias personales para poder crear el vehículo.</p>";
// 				AplicaFoco("#referencias_personales" + p);
// 			} else {
// 				RemueveFoco("#referencias_personales" + p);
// 			}

// 			if (!$("#parenp" + p).val()) {
// 				msg_error += "<p>Debe diligenciar el campo <strong>Parentezco " + p + "</strong>en Referencias personales para poder crear el vehículo.</p>";
// 				AplicaFoco("#parenp" + p);
// 			} else {
// 				RemueveFoco("#parenp" + p);
// 			}
// 			if (!$("#telefonop" + p).val()) {
// 				msg_error += "<p>Debe diligenciar el campo <strong>Teléfono" + p + "</strong>en Referencias personales para poder crear el vehículo.</p>";
// 				AplicaFoco("#telefonop" + p);
// 			} else {
// 				RemueveFoco("#telefonop" + p);
// 			}
// 		}
// 	}
// 	//validar radiobuttons
// 	if (!msg_error) {
// 		//guardar referencias
// 		var data = null;
// 		data = new FormData();
// 		var operacion;
// 		if ($("#update").is(':checked')) {
// 			operacion = 'Actualizar';
// 		}

// 		if ($("#nuevo").is(':checked')) {
// 			operacion = 'Nuevo';
// 		}
// 		if ($("#habil").is(':checked')) {
// 			operacion = 'Habilitar';
// 		}

// 		//lo mismo para todoslos estados
// 		data.append("accion", 'insertar_preestudio_solo');
// 		//data.append("cliente",$("#nombre_cliente").val());
// 		data.append("placa", $("#placag").val());
// 		data.append("trailer", $("#placat").val());
// 		data.append("propietario", $("#nompro").val());
// 		data.append("documento_pro", $("#docupro").val());
// 		data.append("tenedor", $("#nomtene").val());
// 		data.append("documento_tene", $("#docutene").val());
// 		data.append("conductor", $("#nomcondu").val());
// 		data.append("documento_condu", $("#docucondu").val());
// 		data.append("web", $("#web").val());
// 		data.append("user_satelite", $("#user_satelite").val());
// 		data.append("clave", $("#clave").val());
// 		data.append("tipologianuevo", $("#nuevo").val());
// 		data.append("tipologiahabilte", $("#habilite").val());
// 		data.append("tipologiaactualice", $("#actualice").val());
// 		data.append("tipo_operacion", operacion);
// 		data.append("fecha", $("#fpree").val());
// 		data.append("hora", $("#hpree").val());
// 		data.append("usuario", $("#userpree").val());
// 		data.append("observacion", $("#obserpree").val());
// 		data.append("su_sumatorianeto", $("#su_sumatorianeto").val());
// 		data.append("cab", 10);
// 		data.append("ref", 10);
// 		data.append("soli_total", 10);
// 		data.append("segu_actu", 10);
// 		data.append("upda_estado", 10);
// 		data.append("habilitacion", 10);
// 		data.append("update_referencia", 10);
// 		data.append("update_personal", 10);
// 		data.append("actualizar_documentos", 10);
// 		data.append("Papel", 10);
// 		data.append("update_vehiculo_preestudio", 222);
// 		data.append("insert_vehiculo_preestudio", 222);
// 		//insert cabecera
// 		$.ajax({
// 			url: url,
// 			type: 'POST',
// 			data: data,
// 			cache: false,
// 			processData: false, // Don't process the files
// 			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 			dataType: 'json',
// 			success: function (data, textStatus, jqXHR) {
// 				console.log('si inserto preestudio CABECERA solo');
// 				// alert('!!Registro Vehiculo exitosamente!!!');
// 			},
// 			error: function (jqXHR, textStatus, errorThrown) {
// 				console.log('no inserto preestudio CABECERA solo');
// 				console.log(jqXHR);
// 				console.log(textStatus);
// 				console.log(errorThrown);
// 			}
// 		});


// 		var esprefiltro = $("#estado_prefiltron").val();//Estado actual del vehículo en PREFILTRO

// 		if ($("#nuevo").is(':checked') && esprefiltro == 'rechazado') {
// 			data.append("soli_anterior", $("#solianterior").val());
// 			data.append("segu_actu", 10);
// 			data.append("ref", 10);
// 			data.append("cab", 1);
// 			data.append("update_vehiculo_preestudio", 555);
// 			data.append("soli_total", 10);
// 			data.append("upda_estado", 10);
// 			data.append("habilitacion", 10);
// 			data.append("update_referencia", 10);
// 			data.append("update_personal", 10);
// 			data.append("actualizar_documentos", 10);
// 			data.append("Papel", 10);
// 			data.append("insert_vehiculo_preestudio", 222);
// 			data.append("insert_habil_preestudio", 10);
// 			data.append("insert_actualiza_preestudio", 222);
// 			//ajax para actualizar datos de vehiculo preestudio
// 			$.ajax({
// 				url: url,
// 				type: 'POST',
// 				data: data,
// 				cache: false,
// 				processData: false, // Don't process the files
// 				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 				dataType: 'json',
// 				success: function (data, textStatus, jqXHR) {
// 					console.log('si inserto preestudio CABECERA solo');
// 					// alert('!!Registro Vehiculo exitosamente!!!');
// 				},
// 				error: function (jqXHR, textStatus, errorThrown) {
// 					console.log('no inserto preestudio CABECERA solo');
// 					console.log(jqXHR);
// 					console.log(textStatus);
// 					console.log(errorThrown);
// 				}
// 			});

// 		}

// 		if ($("#nuevo").is(':checked') && esprefiltro == 'rechazado') {
// 			//Ajax para actualizar referencias 
// 			var f;
// 			for (f = 1; f <= 3; f++) {
// 				var empresa = $("#referencias_empresariales" + f).val();
// 				var fingreso = $("#fingreso" + f).val();
// 				var fretiro = $("#fretiro" + f).val();
// 				var contac = $("#contacto_ref" + f).val();
// 				var celular = $("#celular_ref" + f).val();
// 				var cargo = $("#cargo_ref" + f).val();
// 				var antiguedad = $("#anti_ref" + f).val();
// 				var idrefe = $("#idrl" + f).val();

// 				data.append("accion", 'insertar_preestudio_solo');
// 				data.append("idconductor", $("#idconductor").val());
// 				data.append("id_referencia", idrefe);
// 				data.append("empresa", empresa);
// 				data.append("ingreso", fingreso);
// 				data.append("fretiro", fretiro);
// 				data.append("contac", contac);
// 				data.append("celular", celular);
// 				data.append("cargo", cargo);
// 				data.append("antiguedad", antiguedad);
// 				data.append("segu_actu", 10);
// 				data.append("ref", 10);
// 				data.append("cab", 10);
// 				data.append("soli_total", 10);
// 				data.append("upda_estado", 10);
// 				data.append("habilitacion", 10);
// 				data.append("update_referencia", 21);
// 				data.append("update_personal", 10);
// 				data.append("actualizar_documentos", 10);
// 				data.append("insert_vehiculo_preestudio", 222);
// 				data.append("insert_habil_preestudio", 10);
// 				data.append("insert_actualiza_preestudio", 222);
// 				data.append("Papel", 10);
// 				$.ajax({
// 					url: url,
// 					type: 'POST',
// 					data: data,
// 					cache: false,
// 					processData: false, // Don't process the files
// 					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 					dataType: 'json',
// 					success: function (data, textStatus, jqXHR) {

// 						console.log('actualizo referencias');

// 					},
// 					error: function (jqXHR, textStatus, errorThrown) {
// 						console.log('no actualizo referencias');
// 						console.log(jqXHR);
// 						console.log(textStatus);
// 						console.log(errorThrown);
// 					}
// 				});
// 			}
// 		}

// 		//ARCHIVOS NUEVO Para rechazado
// 		if ($("#nuevo").is(':checked') && esprefiltro == 'rechazado') {
// 			//ARCHIVOS
// 			var cantp = $("#cont_papel").val();
// 			if (cantp > 0) {
// 				var u;
// 				for (u = 1; u <= cantp; u++) {
// 					//var sw=$("#sk"+u).val();
// 					if (typeof $("#sk" + u).val() !== 'undefined') {

// 						var tipohv_docu = $("#tipohoja" + u + "").val();
// 						var ruta = $("#ruta" + u + "").val();
// 						var namearchivo = $("#namearchivo" + u + "").val();
// 						var clase = $("#clase" + u + "").val();
// 						var documento = $("#documento" + u + "").val();


// 						data.append("accion", 'insertar_preestudio_solo');
// 						data.append("tipohv_docu", tipohv_docu);
// 						data.append("ruta", ruta);
// 						data.append("namearchivo", namearchivo);
// 						data.append("clase", clase);
// 						data.append("segu_actu", 10);
// 						data.append("ref", 10);
// 						data.append("cab", 10);
// 						data.append("soli_total", 10);
// 						data.append("upda_estado", 10);
// 						data.append("habilitacion", 10);
// 						data.append("update_referencia", 10);
// 						data.append("update_personal", 10);
// 						data.append("actualizar_documentos", 10);
// 						data.append("update_vehiculo_preestudio", 222);
// 						data.append("insert_vehiculo_preestudio", 222);
// 						data.append("insert_habil_preestudio", 10);
// 						data.append("insert_actualiza_preestudio", 222);
// 						//data.append("Papel", $("#papeles").is(':checked'));
// 						data.append("Papel", $("#valor_documento").val());
// 						var papeles = document.getElementById('documento' + u + '').files;
// 						for (var a = 0; a < papeles.length; a++) {
// 							data.append("papeles" + a, papeles[a]);
// 						}

// 						$.ajax({
// 							url: url,
// 							type: 'POST',
// 							data: data,
// 							cache: false,
// 							processData: false, // Don't process the files
// 							contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 							dataType: 'json',
// 							success: function (data, textStatus, jqXHR) {

// 								console.log('inserto documentos preestudio');

// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('no inserto documentos preestudio');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});
// 					}//cierre if diferentes	

// 				}
// 			}
// 		}

// 		//CANCELADO
// 		if ($("#nuevo").is(':checked') && esprefiltro == 'cancelado') {
// 			data.append("soli_anterior", $("#solianterior").val());
// 			data.append("segu_actu", 10);
// 			data.append("ref", 10);
// 			data.append("cab", 1);
// 			data.append("update_vehiculo_preestudio", 555);
// 			data.append("soli_total", 10);
// 			data.append("upda_estado", 10);
// 			data.append("habilitacion", 10);
// 			data.append("update_referencia", 10);
// 			data.append("update_personal", 10);
// 			data.append("actualizar_documentos", 10);
// 			data.append("Papel", 10);
// 			data.append("insert_vehiculo_preestudio", 222);
// 			data.append("insert_habil_preestudio", 10);
// 			data.append("insert_actualiza_preestudio", 222);
// 			//ajax para actualizar datos de vehiculo preestudio
// 			$.ajax({
// 				url: url,
// 				type: 'POST',
// 				data: data,
// 				cache: false,
// 				processData: false, // Don't process the files
// 				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 				dataType: 'json',
// 				success: function (data, textStatus, jqXHR) {
// 					console.log('si inserto preestudio CABECERA solo');
// 					// alert('!!Registro Vehiculo exitosamente!!!');
// 				},
// 				error: function (jqXHR, textStatus, errorThrown) {
// 					console.log('no inserto preestudio CABECERA solo');
// 					console.log(jqXHR);
// 					console.log(textStatus);
// 					console.log(errorThrown);
// 				}
// 			});

// 		}

// 		if ($("#nuevo").is(':checked') && esprefiltro == 'cancelado') {
// 			//Ajax para actualizar referencias 
// 			var f;
// 			for (f = 1; f <= 3; f++) {
// 				var empresa = $("#referencias_empresariales" + f).val();
// 				var fingreso = $("#fingreso" + f).val();
// 				var fretiro = $("#fretiro" + f).val();
// 				var contac = $("#contacto_ref" + f).val();
// 				var celular = $("#celular_ref" + f).val();
// 				var cargo = $("#cargo_ref" + f).val();
// 				var antiguedad = $("#anti_ref" + f).val();
// 				var idrefe = $("#idrl" + f).val();

// 				data.append("accion", 'insertar_preestudio_solo');
// 				data.append("idconductor", $("#idconductor").val());
// 				data.append("id_referencia", idrefe);
// 				data.append("empresa", empresa);
// 				data.append("ingreso", fingreso);
// 				data.append("fretiro", fretiro);
// 				data.append("contac", contac);
// 				data.append("celular", celular);
// 				data.append("cargo", cargo);
// 				data.append("antiguedad", antiguedad);
// 				data.append("segu_actu", 10);
// 				data.append("ref", 10);
// 				data.append("cab", 10);
// 				data.append("soli_total", 10);
// 				data.append("upda_estado", 10);
// 				data.append("habilitacion", 10);
// 				data.append("update_referencia", 21);
// 				data.append("update_personal", 10);
// 				data.append("actualizar_documentos", 10);
// 				data.append("Papel", 10);
// 				data.append("insert_vehiculo_preestudio", 222);
// 				data.append("insert_habil_preestudio", 10);
// 				data.append("insert_actualiza_preestudio", 222);
// 				$.ajax({
// 					url: url,
// 					type: 'POST',
// 					data: data,
// 					cache: false,
// 					processData: false, // Don't process the files
// 					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 					dataType: 'json',
// 					success: function (data, textStatus, jqXHR) {

// 						console.log('actualizo referencias');

// 					},
// 					error: function (jqXHR, textStatus, errorThrown) {
// 						console.log('no actualizo referencias');
// 						console.log(jqXHR);
// 						console.log(textStatus);
// 						console.log(errorThrown);
// 					}
// 				});
// 			}
// 		}

// 		//ARCHIVOS NUEVO Para rechazado
// 		if ($("#nuevo").is(':checked') && esprefiltro == 'cancelado') {
// 			//ARCHIVOS
// 			var cantp = $("#cont_papel").val();
// 			if (cantp > 0) {
// 				var u;
// 				for (u = 1; u <= cantp; u++) {
// 					//var sw=$("#sk"+u).val();
// 					if (typeof $("#sk" + u).val() !== 'undefined') {

// 						var tipohv_docu = $("#tipohoja" + u + "").val();
// 						var ruta = $("#ruta" + u + "").val();
// 						var namearchivo = $("#namearchivo" + u + "").val();
// 						var clase = $("#clase" + u + "").val();
// 						var documento = $("#documento" + u + "").val();


// 						data.append("accion", 'insertar_preestudio_solo');
// 						data.append("tipohv_docu", tipohv_docu);
// 						data.append("ruta", ruta);
// 						data.append("namearchivo", namearchivo);
// 						data.append("clase", clase);
// 						data.append("segu_actu", 10);
// 						data.append("ref", 10);
// 						data.append("cab", 10);
// 						data.append("soli_total", 10);
// 						data.append("upda_estado", 10);
// 						data.append("habilitacion", 10);
// 						data.append("update_referencia", 10);
// 						data.append("update_personal", 10);
// 						data.append("actualizar_documentos", 10);
// 						data.append("update_vehiculo_preestudio", 222);
// 						data.append("insert_vehiculo_preestudio", 222);
// 						data.append("insert_habil_preestudio", 10);
// 						data.append("insert_actualiza_preestudio", 222);
// 						//data.append("Papel", $("#papeles").is(':checked'));
// 						data.append("Papel", $("#valor_documento").val());
// 						var papeles = document.getElementById('documento' + u + '').files;
// 						for (var a = 0; a < papeles.length; a++) {
// 							data.append("papeles" + a, papeles[a]);
// 						}

// 						$.ajax({
// 							url: url,
// 							type: 'POST',
// 							data: data,
// 							cache: false,
// 							processData: false, // Don't process the files
// 							contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 							dataType: 'json',
// 							success: function (data, textStatus, jqXHR) {

// 								console.log('inserto documentos preestudio');

// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('no inserto documentos preestudio');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});
// 					}//cierre if diferentes	

// 				}
// 			}
// 		}

// 		//AUTORIZADO PARA REGISTRAR HV
// 		if ($("#nuevo").is(':checked') && esprefiltro == 'aprobado') {
// 			data.append("soli_anterior", $("#solianterior").val());
// 			data.append("segu_actu", 10);
// 			data.append("ref", 10);
// 			data.append("cab", 1);
// 			data.append("update_vehiculo_preestudio", 555);
// 			data.append("soli_total", 10);
// 			data.append("upda_estado", 10);
// 			data.append("habilitacion", 10);
// 			data.append("update_referencia", 10);
// 			data.append("update_personal", 10);
// 			data.append("actualizar_documentos", 10);
// 			data.append("Papel", 10);
// 			data.append("insert_vehiculo_preestudio", 222);
// 			data.append("insert_habil_preestudio", 10);
// 			data.append("insert_actualiza_preestudio", 222);
// 			//ajax para actualizar datos de vehiculo preestudio
// 			$.ajax({
// 				url: url,
// 				type: 'POST',
// 				data: data,
// 				cache: false,
// 				processData: false, // Don't process the files
// 				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 				dataType: 'json',
// 				success: function (data, textStatus, jqXHR) {
// 					console.log('si inserto preestudio CABECERA solo');
// 					// alert('!!Registro Vehiculo exitosamente!!!');
// 				},
// 				error: function (jqXHR, textStatus, errorThrown) {
// 					console.log('no inserto preestudio CABECERA solo');
// 					console.log(jqXHR);
// 					console.log(textStatus);
// 					console.log(errorThrown);
// 				}
// 			});

// 		}

// 		if ($("#nuevo").is(':checked') && esprefiltro == 'aprobado') {
// 			//Ajax para actualizar referencias 
// 			var f;
// 			for (f = 1; f <= 3; f++) {
// 				var empresa = $("#referencias_empresariales" + f).val();
// 				var fingreso = $("#fingreso" + f).val();
// 				var fretiro = $("#fretiro" + f).val();
// 				var contac = $("#contacto_ref" + f).val();
// 				var celular = $("#celular_ref" + f).val();
// 				var cargo = $("#cargo_ref" + f).val();
// 				var antiguedad = $("#anti_ref" + f).val();
// 				var idrefe = $("#idrl" + f).val();

// 				data.append("accion", 'insertar_preestudio_solo');
// 				data.append("idconductor", $("#idconductor").val());
// 				data.append("id_referencia", idrefe);
// 				data.append("empresa", empresa);
// 				data.append("ingreso", fingreso);
// 				data.append("fretiro", fretiro);
// 				data.append("contac", contac);
// 				data.append("celular", celular);
// 				data.append("cargo", cargo);
// 				data.append("antiguedad", antiguedad);
// 				data.append("segu_actu", 10);
// 				data.append("ref", 10);
// 				data.append("cab", 10);
// 				data.append("soli_total", 10);
// 				data.append("upda_estado", 10);
// 				data.append("habilitacion", 10);
// 				data.append("update_referencia", 21);
// 				data.append("update_personal", 10);
// 				data.append("actualizar_documentos", 10);
// 				data.append("Papel", 10);
// 				data.append("insert_vehiculo_preestudio", 222);
// 				data.append("insert_habil_preestudio", 10);
// 				data.append("insert_actualiza_preestudio", 222);
// 				$.ajax({
// 					url: url,
// 					type: 'POST',
// 					data: data,
// 					cache: false,
// 					processData: false, // Don't process the files
// 					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 					dataType: 'json',
// 					success: function (data, textStatus, jqXHR) {

// 						console.log('actualizo referencias');

// 					},
// 					error: function (jqXHR, textStatus, errorThrown) {
// 						console.log('no actualizo referencias');
// 						console.log(jqXHR);
// 						console.log(textStatus);
// 						console.log(errorThrown);
// 					}
// 				});
// 			}
// 		}

// 		//ARCHIVOS NUEVO Para rechazado
// 		if ($("#nuevo").is(':checked') && esprefiltro == 'aprobado') {
// 			//ARCHIVOS
// 			var cantp = $("#cont_papel").val();
// 			if (cantp > 0) {
// 				var u;
// 				for (u = 1; u <= cantp; u++) {
// 					//var sw=$("#sk"+u).val();
// 					if (typeof $("#sk" + u).val() !== 'undefined') {

// 						var tipohv_docu = $("#tipohoja" + u + "").val();
// 						var ruta = $("#ruta" + u + "").val();
// 						var namearchivo = $("#namearchivo" + u + "").val();
// 						var clase = $("#clase" + u + "").val();
// 						var documento = $("#documento" + u + "").val();


// 						data.append("accion", 'insertar_preestudio_solo');
// 						data.append("tipohv_docu", tipohv_docu);
// 						data.append("ruta", ruta);
// 						data.append("namearchivo", namearchivo);
// 						data.append("clase", clase);
// 						data.append("segu_actu", 10);
// 						data.append("ref", 10);
// 						data.append("cab", 10);
// 						data.append("soli_total", 10);
// 						data.append("upda_estado", 10);
// 						data.append("habilitacion", 10);
// 						data.append("update_referencia", 10);
// 						data.append("update_personal", 10);
// 						data.append("actualizar_documentos", 10);
// 						data.append("update_vehiculo_preestudio", 222);
// 						data.append("insert_vehiculo_preestudio", 222);
// 						data.append("insert_habil_preestudio", 10);
// 						data.append("insert_actualiza_preestudio", 222);
// 						//data.append("Papel", $("#papeles").is(':checked'));
// 						data.append("Papel", $("#valor_documento").val());
// 						var papeles = document.getElementById('documento' + u + '').files;
// 						for (var a = 0; a < papeles.length; a++) {
// 							data.append("papeles" + a, papeles[a]);
// 						}

// 						$.ajax({
// 							url: url,
// 							type: 'POST',
// 							data: data,
// 							cache: false,
// 							processData: false, // Don't process the files
// 							contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 							dataType: 'json',
// 							success: function (data, textStatus, jqXHR) {

// 								console.log('inserto documentos preestudio');

// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('no inserto documentos preestudio');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});
// 					}//cierre if diferentes	

// 				}
// 			}
// 		}

// 		//PENDIENTE
// 		if ($("#nuevo").is(':checked') && esprefiltro == 'pendiente') {
// 			data.append("soli_anterior", $("#solianterior").val());
// 			data.append("segu_actu", 10);
// 			data.append("ref", 10);
// 			data.append("cab", 1);
// 			data.append("update_vehiculo_preestudio", 555);
// 			data.append("soli_total", 10);
// 			data.append("upda_estado", 10);
// 			data.append("habilitacion", 10);
// 			data.append("update_referencia", 10);
// 			data.append("update_personal", 10);
// 			data.append("actualizar_documentos", 10);
// 			data.append("Papel", 10);
// 			data.append("insert_vehiculo_preestudio", 222);
// 			data.append("insert_habil_preestudio", 10);
// 			data.append("insert_actualiza_preestudio", 222);
// 			//ajax para actualizar datos de vehiculo preestudio
// 			$.ajax({
// 				url: url,
// 				type: 'POST',
// 				data: data,
// 				cache: false,
// 				processData: false, // Don't process the files
// 				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 				dataType: 'json',
// 				success: function (data, textStatus, jqXHR) {
// 					console.log('si inserto preestudio CABECERA solo');
// 					// alert('!!Registro Vehiculo exitosamente!!!');
// 				},
// 				error: function (jqXHR, textStatus, errorThrown) {
// 					console.log('no inserto preestudio CABECERA solo');
// 					console.log(jqXHR);
// 					console.log(textStatus);
// 					console.log(errorThrown);
// 				}
// 			});

// 		}

// 		if ($("#nuevo").is(':checked') && esprefiltro == 'pendiente') {
// 			//Ajax para actualizar referencias 
// 			var f;
// 			for (f = 1; f <= 3; f++) {
// 				var empresa = $("#referencias_empresariales" + f).val();
// 				var fingreso = $("#fingreso" + f).val();
// 				var fretiro = $("#fretiro" + f).val();
// 				var contac = $("#contacto_ref" + f).val();
// 				var celular = $("#celular_ref" + f).val();
// 				var cargo = $("#cargo_ref" + f).val();
// 				var antiguedad = $("#anti_ref" + f).val();
// 				var idrefe = $("#idrl" + f).val();

// 				data.append("accion", 'insertar_preestudio_solo');
// 				data.append("idconductor", $("#idconductor").val());
// 				data.append("id_referencia", idrefe);
// 				data.append("empresa", empresa);
// 				data.append("ingreso", fingreso);
// 				data.append("fretiro", fretiro);
// 				data.append("contac", contac);
// 				data.append("celular", celular);
// 				data.append("cargo", cargo);
// 				data.append("antiguedad", antiguedad);
// 				data.append("segu_actu", 10);
// 				data.append("ref", 10);
// 				data.append("cab", 10);
// 				data.append("soli_total", 10);
// 				data.append("upda_estado", 10);
// 				data.append("habilitacion", 10);
// 				data.append("update_referencia", 21);
// 				data.append("update_personal", 10);
// 				data.append("actualizar_documentos", 10);
// 				data.append("Papel", 10);
// 				data.append("insert_vehiculo_preestudio", 222);
// 				data.append("insert_habil_preestudio", 10);
// 				data.append("insert_actualiza_preestudio", 222);
// 				$.ajax({
// 					url: url,
// 					type: 'POST',
// 					data: data,
// 					cache: false,
// 					processData: false, // Don't process the files
// 					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 					dataType: 'json',
// 					success: function (data, textStatus, jqXHR) {

// 						console.log('actualizo referencias');

// 					},
// 					error: function (jqXHR, textStatus, errorThrown) {
// 						console.log('no actualizo referencias');
// 						console.log(jqXHR);
// 						console.log(textStatus);
// 						console.log(errorThrown);
// 					}
// 				});
// 			}
// 		}

// 		//ARCHIVOS NUEVO Para rechazado
// 		if ($("#nuevo").is(':checked') && esprefiltro == 'pendiente') {
// 			//ARCHIVOS
// 			var cantp = $("#cont_papel").val();
// 			if (cantp > 0) {
// 				var u;
// 				for (u = 1; u <= cantp; u++) {
// 					//var sw=$("#sk"+u).val();
// 					if (typeof $("#sk" + u).val() !== 'undefined') {

// 						var tipohv_docu = $("#tipohoja" + u + "").val();
// 						var ruta = $("#ruta" + u + "").val();
// 						var namearchivo = $("#namearchivo" + u + "").val();
// 						var clase = $("#clase" + u + "").val();
// 						var documento = $("#documento" + u + "").val();


// 						data.append("accion", 'insertar_preestudio_solo');
// 						data.append("tipohv_docu", tipohv_docu);
// 						data.append("ruta", ruta);
// 						data.append("namearchivo", namearchivo);
// 						data.append("clase", clase);
// 						data.append("segu_actu", 10);
// 						data.append("ref", 10);
// 						data.append("cab", 10);
// 						data.append("soli_total", 10);
// 						data.append("upda_estado", 10);
// 						data.append("habilitacion", 10);
// 						data.append("update_referencia", 10);
// 						data.append("update_personal", 10);
// 						data.append("actualizar_documentos", 10);
// 						data.append("update_vehiculo_preestudio", 222);
// 						data.append("insert_vehiculo_preestudio", 222);
// 						data.append("insert_habil_preestudio", 10);
// 						data.append("insert_actualiza_preestudio", 222);
// 						//data.append("Papel", $("#papeles").is(':checked'));
// 						data.append("Papel", $("#valor_documento").val());
// 						var papeles = document.getElementById('documento' + u + '').files;
// 						for (var a = 0; a < papeles.length; a++) {
// 							data.append("papeles" + a, papeles[a]);
// 						}

// 						$.ajax({
// 							url: url,
// 							type: 'POST',
// 							data: data,
// 							cache: false,
// 							processData: false, // Don't process the files
// 							contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 							dataType: 'json',
// 							success: function (data, textStatus, jqXHR) {

// 								console.log('inserto documentos preestudio');

// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('no inserto documentos preestudio');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});
// 					}//cierre if diferentes	

// 				}
// 			}
// 		}

// 		//vencidas

// 		if ($("#nuevo").is(':checked') && esprefiltro == 'vencida') {
// 			//Ajax para actualizar referencias 
// 			var f;
// 			for (f = 1; f <= 3; f++) {
// 				var empresa = $("#referencias_empresariales" + f).val();
// 				var fingreso = $("#fingreso" + f).val();
// 				var fretiro = $("#fretiro" + f).val();
// 				var contac = $("#contacto_ref" + f).val();
// 				var celular = $("#celular_ref" + f).val();
// 				var cargo = $("#cargo_ref" + f).val();
// 				var antiguedad = $("#anti_ref" + f).val();
// 				var idrefe = $("#idrl" + f).val();

// 				data.append("accion", 'insertar_preestudio_solo');
// 				data.append("idconductor", $("#idconductor").val());
// 				data.append("id_referencia", idrefe);
// 				data.append("empresa", empresa);
// 				data.append("ingreso", fingreso);
// 				data.append("fretiro", fretiro);
// 				data.append("contac", contac);
// 				data.append("celular", celular);
// 				data.append("cargo", cargo);
// 				data.append("antiguedad", antiguedad);
// 				data.append("segu_actu", 10);
// 				data.append("ref", 10);
// 				data.append("cab", 10);
// 				data.append("soli_total", 10);
// 				data.append("upda_estado", 10);
// 				data.append("habilitacion", 10);
// 				data.append("update_referencia", 21);
// 				data.append("update_personal", 10);
// 				data.append("actualizar_documentos", 10);
// 				data.append("Papel", 10);
// 				data.append("insert_vehiculo_preestudio", 222);
// 				data.append("insert_habil_preestudio", 10);
// 				data.append("insert_actualiza_preestudio", 222);
// 				$.ajax({
// 					url: url,
// 					type: 'POST',
// 					data: data,
// 					cache: false,
// 					processData: false, // Don't process the files
// 					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 					dataType: 'json',
// 					success: function (data, textStatus, jqXHR) {

// 						console.log('actualizo referencias');

// 					},
// 					error: function (jqXHR, textStatus, errorThrown) {
// 						console.log('no actualizo referencias');
// 						console.log(jqXHR);
// 						console.log(textStatus);
// 						console.log(errorThrown);
// 					}
// 				});
// 			}
// 		}

// 		//ARCHIVOS NUEVO Para vencida
// 		if ($("#nuevo").is(':checked') && esprefiltro == 'vencida') {
// 			//ARCHIVOS
// 			var cantp = $("#cont_papel").val();
// 			if (cantp > 0) {
// 				var u;
// 				for (u = 1; u <= cantp; u++) {
// 					//var sw=$("#sk"+u).val();
// 					if (typeof $("#sk" + u).val() !== 'undefined') {

// 						var tipohv_docu = $("#tipohoja" + u + "").val();
// 						var ruta = $("#ruta" + u + "").val();
// 						var namearchivo = $("#namearchivo" + u + "").val();
// 						var clase = $("#clase" + u + "").val();
// 						var documento = $("#documento" + u + "").val();


// 						data.append("accion", 'insertar_preestudio_solo');
// 						data.append("tipohv_docu", tipohv_docu);
// 						data.append("ruta", ruta);
// 						data.append("namearchivo", namearchivo);
// 						data.append("clase", clase);
// 						data.append("segu_actu", 10);
// 						data.append("ref", 10);
// 						data.append("cab", 10);
// 						data.append("soli_total", 10);
// 						data.append("upda_estado", 10);
// 						data.append("habilitacion", 10);
// 						data.append("update_referencia", 10);
// 						data.append("update_personal", 10);
// 						data.append("actualizar_documentos", 10);
// 						data.append("update_vehiculo_preestudio", 222);
// 						data.append("insert_vehiculo_preestudio", 222);
// 						data.append("insert_habil_preestudio", 10);
// 						data.append("insert_actualiza_preestudio", 222);
// 						//data.append("Papel", $("#papeles").is(':checked'));
// 						data.append("Papel", $("#valor_documento").val());
// 						var papeles = document.getElementById('documento' + u + '').files;
// 						for (var a = 0; a < papeles.length; a++) {
// 							data.append("papeles" + a, papeles[a]);
// 						}

// 						$.ajax({
// 							url: url,
// 							type: 'POST',
// 							data: data,
// 							cache: false,
// 							processData: false, // Don't process the files
// 							contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 							dataType: 'json',
// 							success: function (data, textStatus, jqXHR) {

// 								console.log('inserto documentos preestudio');

// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('no inserto documentos preestudio');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});
// 					}//cierre if diferentes	

// 				}
// 			}
// 		}

// 		//actualizar vehículos preestudio
// 		if ($("#nuevo").is(':checked') && esprefiltro == 'vencida') {
// 			data.append("soli_anterior", $("#solianterior").val());
// 			data.append("segu_actu", 10);
// 			data.append("ref", 10);
// 			data.append("cab", 1);
// 			data.append("update_vehiculo_preestudio", 555);
// 			data.append("soli_total", 10);
// 			data.append("upda_estado", 10);
// 			data.append("habilitacion", 10);
// 			data.append("update_referencia", 10);
// 			data.append("update_personal", 10);
// 			data.append("actualizar_documentos", 10);
// 			data.append("Papel", 10);
// 			data.append("insert_vehiculo_preestudio", 222);
// 			data.append("insert_habil_preestudio", 10);
// 			data.append("insert_actualiza_preestudio", 222);
// 			//ajax para actualizar datos de vehiculo preestudio
// 			$.ajax({
// 				url: url,
// 				type: 'POST',
// 				data: data,
// 				cache: false,
// 				processData: false, // Don't process the files
// 				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 				dataType: 'json',
// 				success: function (data, textStatus, jqXHR) {
// 					console.log('si inserto preestudio CABECERA solo');
// 					// alert('!!Registro Vehiculo exitosamente!!!');
// 				},
// 				error: function (jqXHR, textStatus, errorThrown) {
// 					console.log('no inserto preestudio CABECERA solo');
// 					console.log(jqXHR);
// 					console.log(textStatus);
// 					console.log(errorThrown);
// 				}
// 			});

// 		}

// 		//rechazado para modificar

// 		if ($("#nuevo").is(':checked') && esprefiltro == 'rechazado para modificar') {
// 			data.append("soli_anterior", $("#solianterior").val());
// 			data.append("segu_actu", 10);
// 			data.append("ref", 10);
// 			data.append("cab", 1);
// 			data.append("update_vehiculo_preestudio", 555);
// 			data.append("soli_total", 10);
// 			data.append("upda_estado", 10);
// 			data.append("habilitacion", 10);
// 			data.append("update_referencia", 10);
// 			data.append("update_personal", 10);
// 			data.append("actualizar_documentos", 10);
// 			data.append("Papel", 10);
// 			data.append("insert_vehiculo_preestudio", 222);
// 			data.append("insert_habil_preestudio", 10);
// 			data.append("insert_actualiza_preestudio", 222);
// 			//ajax para actualizar datos de vehiculo preestudio
// 			$.ajax({
// 				url: url,
// 				type: 'POST',
// 				data: data,
// 				cache: false,
// 				processData: false, // Don't process the files
// 				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 				dataType: 'json',
// 				success: function (data, textStatus, jqXHR) {
// 					console.log('si inserto preestudio CABECERA solo');
// 					// alert('!!Registro Vehiculo exitosamente!!!');
// 				},
// 				error: function (jqXHR, textStatus, errorThrown) {
// 					console.log('no inserto preestudio CABECERA solo');
// 					console.log(jqXHR);
// 					console.log(textStatus);
// 					console.log(errorThrown);
// 				}
// 			});

// 		}

// 		if ($("#nuevo").is(':checked') && esprefiltro == 'rechazado para modificar') {
// 			//Ajax para actualizar referencias 
// 			var f;
// 			for (f = 1; f <= 3; f++) {
// 				var empresa = $("#referencias_empresariales" + f).val();
// 				var fingreso = $("#fingreso" + f).val();
// 				var fretiro = $("#fretiro" + f).val();
// 				var contac = $("#contacto_ref" + f).val();
// 				var celular = $("#celular_ref" + f).val();
// 				var cargo = $("#cargo_ref" + f).val();
// 				var antiguedad = $("#anti_ref" + f).val();
// 				var idrefe = $("#idrl" + f).val();

// 				data.append("accion", 'insertar_preestudio_solo');
// 				data.append("idconductor", $("#idconductor").val());
// 				data.append("id_referencia", idrefe);
// 				data.append("empresa", empresa);
// 				data.append("ingreso", fingreso);
// 				data.append("fretiro", fretiro);
// 				data.append("contac", contac);
// 				data.append("celular", celular);
// 				data.append("cargo", cargo);
// 				data.append("antiguedad", antiguedad);
// 				data.append("segu_actu", 10);
// 				data.append("ref", 10);
// 				data.append("cab", 10);
// 				data.append("soli_total", 10);
// 				data.append("upda_estado", 10);
// 				data.append("habilitacion", 10);
// 				data.append("update_referencia", 21);
// 				data.append("update_personal", 10);
// 				data.append("actualizar_documentos", 10);
// 				data.append("Papel", 10);
// 				data.append("insert_vehiculo_preestudio", 222);
// 				data.append("insert_habil_preestudio", 10);
// 				data.append("insert_actualiza_preestudio", 222);
// 				$.ajax({
// 					url: url,
// 					type: 'POST',
// 					data: data,
// 					cache: false,
// 					processData: false, // Don't process the files
// 					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 					dataType: 'json',
// 					success: function (data, textStatus, jqXHR) {

// 						console.log('actualizo referencias');

// 					},
// 					error: function (jqXHR, textStatus, errorThrown) {
// 						console.log('no actualizo referencias');
// 						console.log(jqXHR);
// 						console.log(textStatus);
// 						console.log(errorThrown);
// 					}
// 				});
// 			}
// 		}

// 		//ARCHIVOS NUEVO Para rechazado
// 		if ($("#nuevo").is(':checked') && esprefiltro == 'rechazado para modificar') {
// 			//ARCHIVOS
// 			var cantp = $("#cont_papel").val();
// 			if (cantp > 0) {
// 				var u;
// 				for (u = 1; u <= cantp; u++) {
// 					//var sw=$("#sk"+u).val();
// 					if (typeof $("#sk" + u).val() !== 'undefined') {

// 						var tipohv_docu = $("#tipohoja" + u + "").val();
// 						var ruta = $("#ruta" + u + "").val();
// 						var namearchivo = $("#namearchivo" + u + "").val();
// 						var clase = $("#clase" + u + "").val();
// 						var documento = $("#documento" + u + "").val();


// 						data.append("accion", 'insertar_preestudio_solo');
// 						data.append("tipohv_docu", tipohv_docu);
// 						data.append("ruta", ruta);
// 						data.append("namearchivo", namearchivo);
// 						data.append("clase", clase);
// 						data.append("segu_actu", 10);
// 						data.append("ref", 10);
// 						data.append("cab", 10);
// 						data.append("soli_total", 10);
// 						data.append("upda_estado", 10);
// 						data.append("habilitacion", 10);
// 						data.append("update_referencia", 10);
// 						data.append("update_personal", 10);
// 						data.append("actualizar_documentos", 10);
// 						data.append("update_vehiculo_preestudio", 222);
// 						data.append("insert_vehiculo_preestudio", 222);
// 						data.append("insert_habil_preestudio", 10);
// 						data.append("insert_actualiza_preestudio", 222);
// 						//data.append("Papel", $("#papeles").is(':checked'));
// 						data.append("Papel", $("#valor_documento").val());
// 						var papeles = document.getElementById('documento' + u + '').files;
// 						for (var a = 0; a < papeles.length; a++) {
// 							data.append("papeles" + a, papeles[a]);
// 						}

// 						$.ajax({
// 							url: url,
// 							type: 'POST',
// 							data: data,
// 							cache: false,
// 							processData: false, // Don't process the files
// 							contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 							dataType: 'json',
// 							success: function (data, textStatus, jqXHR) {

// 								console.log('inserto documentos preestudio');

// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('no inserto documentos preestudio');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});
// 					}//cierre if diferentes	

// 				}
// 			}
// 		}

// 		//NUEVO NUNCA HA EXISTIDO
// 		//registrar datos del vehiculo
// 		// if ($("#nuevo").is(':checked') && $("#estado_prefiltron").val() == '') {
// 		// 	data.append("accion", 'insertar_preestudio_solo');
// 		// 	//data.append("cliente",$("#nombre_cliente").val());
// 		// 	data.append("placa", $("#placag").val());
// 		// 	data.append("trailer", $("#placat").val());
// 		// 	data.append("propietario", $("#nompro").val());
// 		// 	data.append("documento_pro", $("#docupro").val());
// 		// 	data.append("tenedor", $("#nomtene").val());
// 		// 	data.append("documento_tene", $("#docutene").val());
// 		// 	data.append("conductor", $("#nomcondu").val());
// 		// 	data.append("documento_condu", $("#docucondu").val());
// 		// 	data.append("web", $("#web").val());
// 		// 	data.append("user_satelite", $("#user_satelite").val());
// 		// 	data.append("clave", $("#clave").val());
// 		// 	data.append("tipologianuevo", $("#nuevo").val());
// 		// 	data.append("tipologiahabilte", $("#habilite").val());
// 		// 	data.append("tipologiaactualice", $("#actualice").val());
// 		// 	data.append("tipo_operacion", operacion);
// 		// 	data.append("fecha", $("#fpree").val());
// 		// 	data.append("hora", $("#hpree").val());
// 		// 	data.append("usuario", $("#userpree").val());
// 		// 	data.append("observacion", $("#obserpree").val());
// 		// 	data.append("cab", 1);
// 		// 	data.append("ref", 10);
// 		// 	data.append("soli_total", 10);
// 		// 	data.append("segu_actu", 10);
// 		// 	data.append("upda_estado", 10);
// 		// 	data.append("habilitacion", 10);
// 		// 	data.append("update_referencia", 10);
// 		// 	data.append("update_personal", 10);
// 		// 	data.append("actualizar_documentos", 10);
// 		// 	data.append("Papel", 10);
// 		// 	data.append("update_vehiculo_preestudio", 222);
// 		// 	data.append("insert_vehiculo_preestudio", 111);
// 		// 	data.append("insert_habil_preestudio", 10);
// 		// 	data.append("insert_actualiza_preestudio", 222);
// 		// 	//insert cabecera
// 		// 	$.ajax({
// 		// 		url: url,
// 		// 		type: 'POST',
// 		// 		data: data,
// 		// 		cache: false,
// 		// 		processData: false, // Don't process the files
// 		// 		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 		// 		dataType: 'json',
// 		// 		success: function (data, textStatus, jqXHR) {
// 		// 			console.log('si inserto preestudio CABECERA solo');
// 		// 			// alert('!!Registro Vehiculo exitosamente!!!');
// 		// 		},
// 		// 		error: function (jqXHR, textStatus, errorThrown) {
// 		// 			console.log('no inserto preestudio CABECERA solo');
// 		// 			console.log(jqXHR);
// 		// 			console.log(textStatus);
// 		// 			console.log(errorThrown);
// 		// 		}
// 		// 	});
// 		// }

// 		// //referencias laborales NUEVO
// 		// if ($("#nuevo").is(':checked') && $("#estado_prefiltron").val() == '') {
// 		// 	var i = 0;
// 		// 	for (i = 1; i <= contador_global1; i++) {
// 		// 		var empresa = $("#empresa_crear" + i + "").val();
// 		// 		var ingreso = $("#fingreso_crear" + i + "").val();
// 		// 		var retiro = $("#fretiro_crear" + i + "").val();
// 		// 		var contacto = $("#contacto_crear" + i + "").val();
// 		// 		var numero = $("#numero_crear" + i + "").val();
// 		// 		var cargo = $("#cargo_crear" + i + "").val();
// 		// 		var anti = $("#antiguedad_crear" + i).val();
// 		// 		data.append("placa2", $("#placag").val());
// 		// 		data.append("docucondu", $("#docucondu").val());
// 		// 		data.append("empre", empresa);
// 		// 		data.append("ingreso", ingreso);
// 		// 		data.append("retiro", retiro);
// 		// 		data.append("persona", contacto);
// 		// 		data.append("num", numero);
// 		// 		data.append("cargo", cargo);
// 		// 		data.append("anti", anti);
// 		// 		data.append("ref", 2);
// 		// 		data.append("cab", 10);
// 		// 		data.append("soli_total", 10);
// 		// 		data.append("segu_actu", 10);
// 		// 		data.append("upda_estado", 10);
// 		// 		data.append("habilitacion", 10);
// 		// 		data.append("update_referencia", 10);
// 		// 		data.append("update_personal", 10);
// 		// 		data.append("actualizar_documentos", 10);
// 		// 		data.append("Papel", 10);
// 		// 		data.append("update_vehiculo_preestudio", 222);
// 		// 		data.append("insert_vehiculo_preestudio", 222);
// 		// 		data.append("insert_habil_preestudio", 10);
// 		// 		data.append("insert_actualiza_preestudio", 222);
// 		// 		$.ajax({
// 		// 			url: url,
// 		// 			type: 'POST',
// 		// 			data: data,
// 		// 			cache: false,
// 		// 			processData: false, // Don't process the files
// 		// 			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 		// 			dataType: 'json',
// 		// 			success: function (data, textStatus, jqXHR) {

// 		// 				console.log('inserto preestudio REFERENCIA solo');

// 		// 			},
// 		// 			error: function (jqXHR, textStatus, errorThrown) {
// 		// 				console.log('no inserto preestudio REFERENCIA solo');
// 		// 				console.log(jqXHR);
// 		// 				console.log(textStatus);
// 		// 				console.log(errorThrown);
// 		// 			}
// 		// 		});
// 		// 	}
// 		// }

// 		// //documentos de  preestudio SOLO CREACION
// 		// if ($("#nuevo").is(':checked') && $("#estado_prefiltron").val() == '') {
// 		// 	//ARCHIVOS
// 		// 	var cantp = $("#cont_papel").val();
// 		// 	if (cantp > 0) {
// 		// 		var u;
// 		// 		for (u = 1; u <= cantp; u++) {
// 		// 			//var sw=$("#sk"+u).val();
// 		// 			if (typeof $("#sk" + u).val() !== 'undefined') {

// 		// 				var tipohv_docu = $("#tipohoja" + u + "").val();
// 		// 				var ruta = $("#ruta" + u + "").val();
// 		// 				var namearchivo = $("#namearchivo" + u + "").val();
// 		// 				var clase = $("#clase" + u + "").val();
// 		// 				var documento = $("#documento" + u + "").val();


// 		// 				data.append("accion", 'insertar_preestudio_solo');
// 		// 				data.append("tipohv_docu", tipohv_docu);
// 		// 				data.append("ruta", ruta);
// 		// 				data.append("namearchivo", namearchivo);
// 		// 				data.append("clase", clase);
// 		// 				data.append("segu_actu", 10);
// 		// 				data.append("ref", 10);
// 		// 				data.append("cab", 10);
// 		// 				data.append("soli_total", 10);
// 		// 				data.append("upda_estado", 10);
// 		// 				data.append("habilitacion", 10);
// 		// 				data.append("update_referencia", 10);
// 		// 				data.append("update_personal", 10);
// 		// 				data.append("actualizar_documentos", 10);
// 		// 				data.append("update_vehiculo_preestudio", 222);
// 		// 				data.append("insert_vehiculo_preestudio", 222);
// 		// 				data.append("insert_habil_preestudio", 10);
// 		// 				data.append("insert_actualiza_preestudio", 222);
// 		// 				//data.append("Papel", $("#papeles").is(':checked'));
// 		// 				data.append("Papel", $("#valor_documento").val());
// 		// 				var papeles = document.getElementById('documento' + u + '').files;
// 		// 				for (var a = 0; a < papeles.length; a++) {
// 		// 					data.append("papeles" + a, papeles[a]);
// 		// 				}

// 		// 				$.ajax({
// 		// 					url: url,
// 		// 					type: 'POST',
// 		// 					data: data,
// 		// 					cache: false,
// 		// 					processData: false, // Don't process the files
// 		// 					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 		// 					dataType: 'json',
// 		// 					success: function (data, textStatus, jqXHR) {
// 		// 						console.log('inserto documentos preestudio');
// 		// 					},
// 		// 					error: function (jqXHR, textStatus, errorThrown) {
// 		// 						console.log('no inserto documentos preestudio');
// 		// 						console.log(jqXHR);
// 		// 						console.log(textStatus);
// 		// 						console.log(errorThrown);
// 		// 					}
// 		// 				});
// 		// 			}//cierre if diferentes	
// 		// 		}
// 		// 	}
// 		// }


// 		//tablas de cabecera 1 solo registro
// 		if ($("#habil").is(':checked')) {
// 			data.append("cab", 1);
// 			data.append("insert_habil_preestudio", 444);
// 			data.append("placa", $("#placag").val());
// 			data.append("segu_actu", 10);
// 			data.append("ref", 10);
// 			data.append("soli_total", 10);
// 			data.append("upda_estado", 10);
// 			data.append("habilitacion", 10);
// 			data.append("update_referencia", 10);
// 			data.append("update_personal", 10);
// 			data.append("actualizar_documentos", 10);
// 			data.append("Papel", 10);
// 			data.append("update_vehiculo_preestudio", 222);
// 			data.append("insert_vehiculo_preestudio", 222);
// 			data.append("insert_actualiza_preestudio", 222);
// 			$.ajax({
// 				url: url,
// 				type: 'POST',
// 				data: data,
// 				cache: false,
// 				processData: false, // Don't process the files
// 				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 				dataType: 'json',
// 				success: function (data, textStatus, jqXHR) {
// 					console.log('inserto habilitacion');
// 				},
// 				error: function (jqXHR, textStatus, errorThrown) {
// 					console.log('no inserto habilitacion');
// 					console.log(jqXHR);
// 					console.log(textStatus);
// 					console.log(errorThrown);
// 				}
// 			});
// 		}

// 		//UPDATE crear prefiltro
// 		if ($("#update").is(':checked')) {
// 			data.append("accion", 'insertar_preestudio_solo');
// 			data.append("cab", 1);
// 			data.append("insert_actualiza_preestudio", 1414);
// 			data.append("placa", $("#placag").val());
// 			data.append("segu_actu", 10);
// 			data.append("ref", 10);
// 			data.append("soli_total", 10);
// 			data.append("upda_estado", 10);
// 			data.append("habilitacion", 10);
// 			data.append("update_referencia", 10);
// 			data.append("update_personal", 10);
// 			data.append("actualizar_documentos", 10);
// 			data.append("Papel", 10);
// 			data.append("update_vehiculo_preestudio", 222);
// 			data.append("insert_vehiculo_preestudio", 222);
// 			data.append("insert_habil_preestudio", 222);
// 			$.ajax({
// 				url: url,
// 				type: 'POST',
// 				data: data,
// 				cache: false,
// 				processData: false, // Don't process the files
// 				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 				dataType: 'json',
// 				success: function (data, textStatus, jqXHR) {
// 					console.log('inserto habilitacion');

// 				},
// 				error: function (jqXHR, textStatus, errorThrown) {
// 					console.log('no inserto habilitacion');
// 					console.log(jqXHR);
// 					console.log(textStatus);
// 					console.log(errorThrown);
// 				}
// 			});
// 		}
// 		//validacion de los radiobutton para capturar actualizaciones a seguridad
// 		if ($("#update").is(':checked')) {
// 			var cantp = $("#valortb").val();
// 			if (cantp > 0) {
// 				//if(typeof $("#sa"+u).val() !== 'undefined'){
// 				var e, n;
// 				for (e = 1; e <= cantp; e++) {
// 					if (typeof $("#sa" + e).val() !== 'undefined') {
// 						var tipohv = $('#fila' + e + '').find('td').eq(1).html();
// 						var campo = $('#fila' + e + '').find('td').eq(2).html();
// 						var dato = $('#fila' + e + '').find('td').eq(3).html();
// 						var papeles = document.getElementById('arc' + e + '').files;
// 						for (var a = 0; a < papeles.length; a++) {
// 							data.append("papeles" + a, papeles[a]);
// 						}
// 						var namea = $("#nam" + e + "").val();
// 						data.append("placa", $("#placag").val());
// 						data.append("tipohv", tipohv);
// 						data.append("campo", campo);
// 						data.append("dato", dato);
// 						data.append("name_doc", namea);
// 						data.append("segu_actu", 9);
// 						data.append("ref", 10);
// 						data.append("cab", 10);
// 						data.append("soli_total", 10);
// 						data.append("upda_estado", 10);
// 						data.append("habilitacion", 10);
// 						data.append("update_referencia", 10);
// 						data.append("update_personal", 10);
// 						data.append("actualizar_documentos", 10);
// 						data.append("Papel", 10);
// 						data.append("update_vehiculo_preestudio", 222);
// 						data.append("insert_vehiculo_preestudio", 222);
// 						data.append("insert_habil_preestudio", 10);
// 						data.append("insert_actualiza_preestudio", 222);
// 						$.ajax({
// 							url: url,
// 							type: 'POST',
// 							data: data,
// 							cache: false,
// 							processData: false, // Don't process the files
// 							contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 							dataType: 'json',
// 							success: function (data, textStatus, jqXHR) {

// 								console.log('inserto preestudio actualizacion seguridad');

// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('no inserto preestudio actualizacion seguridad');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});
// 					}
// 				}
// 			}
// 		}


// 		var solimax = $("#maxservi").val();
// 		var su_valida = $("#su_valida").val();
// 		/*
// 		//REGISTRAR SUBASTA
// 		var su_valida=$("#su_valida").val();
// 		if(su_valida==1){
// 			//alert(fechac);
// 			//traer todas las solicitudes de servicio
// 			//var cant_tbfecha=$('#cuerpo_fechas tr').length;
// 			var cant_tbfecha=$('#cuerpo_lista2 tr').length;
// 			//var cant_tbfecha=$("#maxservi").val();
// 			data.append("accion", 'insertar_subasta');
// 			data.append("su_placa", $("#su_placa").val());
// 			//data.append("su_servicio", $("#su_servicio").val());
// 			var solicitudes= new Array();
// 		$(".fserva").each(function(index){
// 					var a=$(this).val();
// 					solicitudes.push(a);
// 		});
// 		data.append("su_servicio", solicitudes);
// 			data.append("su_fletecot", $("#su_fletecot").val().replace(/,/g,""));
// 			data.append("su_propuesto", $("#su_propuesto").val().replace(/,/g,""));
// 			data.append("su_estado", $("#su_estado").val());
// 			data.append("su_user", $("#su_user").val());
// 			data.append("su_fecha", $("#su_fecha").val());
// 			data.append("su_hora", $("#su_hora").val())
// 			data.append("su_numsubasta", $("#su_numsubasta").val());
// 			data.append("su_final_cargue", fechac);
// 			data.append("cant_filas", cant_tbfecha);
// 			data.append("su_tarifacot", $("#su_tarifacot").val());
// 			$.ajax({
// 			url: url,
// 			type: 'POST',
// 			data: data,
// 			cache: false,
// 			processData: false, // Don't process the files
// 			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 			dataType: 'json',
// 			success: function (data, textStatus, jqXHR)
// 			{
// 				console.log('inserto subasta');
// 			},
// 			error: function (jqXHR, textStatus, errorThrown)
// 			{
// 				console.log('no inserto subasta');
// 				console.log(jqXHR);
// 				console.log(textStatus);
// 				console.log(errorThrown);
// 			}
// 		});
// 		}

// 		//solicitud de servicio
// 	//var solimax=$('#cuerpo_lista2 tr').length;
// 	var m=0;
// 	for(m=1; m<=solimax; m++){
// 		var ser=$("#servicio"+m+"").val();
// 		var soli=$("#soli").val();
// 		if(ser!=0){
// 			//alert('Solicitud de Servicio'+ser);
// 			data.append("accion", 'insertar_preestudio_ss');
// 			data.append("placa2", $("#placag").val());
// 			data.append("solicitud", ser);
// 			data.append("su_subasta", $("#su_numsubasta").val());

// 			data.append("ref", 10);
// 			data.append("cab", 10);
// 			data.append("soli_total", 3);
// 			data.append("segu_actu", 10);
// 			data.append("upda_estado", 10);
// 			data.append("habilitacion", 10);
// 			data.append("update_referencia", 10);
// 			data.append("update_personal", 10);
// 			data.append("actualizar_documentos", 10);
// 			data.append("Papel", 10);
// 			data.append("update_vehiculo_preestudio", 222);
// 			data.append("insert_vehiculo_preestudio", 222);
// 			data.append("insert_habil_preestudio", 222);
// 			data.append("insert_actualiza_preestudio", 222);
// 			$.ajax({
// 					url: url,
// 					type: 'POST',
// 					data: data,
// 					cache: false,
// 					processData: false, // Don't process the files
// 					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 					dataType: 'json',
// 					success: function (data, textStatus, jqXHR)
// 					{

// 						console.log('inserto solicitudes');

// 					},
// 					error: function (jqXHR, textStatus, errorThrown)
// 					{
// 						console.log('no inserto solicitudes');
// 						console.log(jqXHR);
// 						console.log(textStatus);
// 						console.log(errorThrown);
// 					}
// 			});
// 		}
// 	}*/

// 		//asignar_solicitudes_servicio();
// 		alert('Ok!! Datos Registrados Exitosamente!!');
// 		Registro_ss(solimax);
// 		Registro_Subasta(su_valida);
// 		location.reload();
// 	} else {
// 		$("#nexos_messages_popup").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
// 		$("#crea_vehiculopreestudio").animate({ scrollTop: 0 }, 600);
// 	}

// });

function Registro_ss(solimax) {
	var data = null;
	data = new FormData();
	//alert('REGISTRA SOLICITUD DE SERVICIO'+solimax);
	var m = 0;
	for (m = 1; m <= solimax; m++) {
		var ser = $("#servicio" + m + "").val();
		var soli = $("#soli").val();
		if (ser != 0) {
			//alert('Solicitud de Servicio'+ser);
			data.append("accion", 'insertar_preestudio_ss');
			data.append("placa2", $("#placag").val());
			data.append("solicitud", ser);
			data.append("su_subasta", $("#su_numsubasta").val());
			data.append("ref", 10);
			data.append("cab", 10);
			data.append("soli_total", 3);
			data.append("segu_actu", 10);
			data.append("upda_estado", 10);
			data.append("habilitacion", 10);
			data.append("update_referencia", 10);
			data.append("update_personal", 10);
			data.append("actualizar_documentos", 10);
			data.append("Papel", 10);
			data.append("update_vehiculo_preestudio", 222);
			data.append("insert_vehiculo_preestudio", 222);
			data.append("insert_habil_preestudio", 222);
			data.append("insert_actualiza_preestudio", 222);
			$.ajax({
				url: url,
				type: 'POST',
				data: data,
				cache: false,
				processData: false, // Don't process the files
				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				dataType: 'json',
				success: function (data, textStatus, jqXHR) {

				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log('no inserto solicitudes');
					console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
		}
	}
}

function Registro_Subasta(su_valida) {
	var sw = 0;
	var arreglo = new Array();
	$(".fo").each(function (index) {
		var a = $(this).val();
		//a=parseFloat(a);
		arreglo.push(a);
	});
	var maximo = Math.min.apply(Math, arreglo);
	for (e = 1; e <= $('#cuerpo_fechas tr').length; e++) {
		for (n = 1; n <= e; n++) {
			var cant = $("#oculto" + n).val();
			if (cant == maximo) {
				var idsolicitud = $("#serv" + n).val();
				var fechac = $("#fecha" + n).val();
				var peso = $("#peso" + n).val();
			}
		}
	}
	var data = null;
	data = new FormData();
	//alert('REGISTRA SOLICITUD DE SERVICIO'+su_valida);
	if (su_valida == 1) {
		//alert(fechac);
		//traer todas las solicitudes de servicio
		//var cant_tbfecha=$('#cuerpo_fechas tr').length;
		var cant_tbfecha = $('#cuerpo_lista2 tr').length;
		//var cant_tbfecha=$("#maxservi").val();
		data.append("accion", 'insertar_subasta');
		data.append("su_placa", $("#su_placa").val());
		//data.append("su_servicio", $("#su_servicio").val());
		var solicitudes = new Array();
		$(".fserva").each(function (index) {
			var a = $(this).val();
			solicitudes.push(a);
		});
		data.append("su_servicio", solicitudes);
		data.append("su_fletecot", $("#su_fletecot").val().replace(/,/g, ""));
		data.append("su_propuesto", $("#su_propuesto").val().replace(/,/g, ""));
		data.append("su_estado", $("#su_estado").val());
		data.append("su_user", $("#su_user").val());
		data.append("su_fecha", $("#su_fecha").val());
		data.append("su_hora", $("#su_hora").val())
		data.append("su_numsubasta", $("#su_numsubasta").val());
		data.append("su_final_cargue", fechac);
		data.append("cant_filas", cant_tbfecha);
		data.append("su_tarifacot", $("#su_tarifacot").val());
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			cache: false,
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			dataType: 'json',
			success: function (data, textStatus, jqXHR) {
				console.log('inserto subasta');
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log('no inserto subasta');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}
}

function insert_vehiculo() {
	var data = null;
	data = new FormData();
	data.append("accion", 'insertar_preestudio_solo');
	data.append("cliente", $("#nombre_cliente").val());
	data.append("placa", $("#placag").val());
	data.append("trailer", $("#placat").val());
	data.append("propietario", $("#nompro").val());
	data.append("documento_pro", $("#docupro").val());
	data.append("tenedor", $("#nomtene").val());
	data.append("documento_tene", $("#docutene").val());
	data.append("conductor", $("#nomcondu").val());
	data.append("documento_condu", $("#docucondu").val());
	data.append("web", $("#web").val());
	data.append("user_satelite", $("#user_satelite").val());
	data.append("clave", $("#clave").val());
	data.append("tipologianuevo", $("#nuevo").val());
	data.append("tipologiahabilte", $("#habilite").val());
	data.append("tipologiaactualice", $("#actualice").val());
	data.append("fecha", $("#fpree").val());
	data.append("hora", $("#hpree").val());
	data.append("usuario", $("#userpree").val());
	data.append("observacion", $("#obserpree").val());
	data.append("cab", $("#cab").val());
	//insert cabecera
	$.ajax({
		url: url,
		type: 'POST',
		data: data,
		cache: false,
		processData: false, // Don't process the files
		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		dataType: 'json',
		success: function (data, textStatus, jqXHR) {
			console.log('si inserto preestudio CABECERA solo');
			// alert('!!Registro Vehiculo exitosamente!!!');
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log('no inserto preestudio CABECERA solo');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});

}
// });

// $("#crear_preestudio2").click(function(){
//  // alert('insert preestudio update vehiculo');
// 	//traer datos
// 	var data = null;
// 	data = new FormData();
// 	data.append("accion", 'insertar_preestudio_con');
// 	data.append("cliente",$("#nombre_cliente").val());
// 	data.append("placa", $("#placag").val());
// 	data.append("trailer", $("#placat").val());
// 	data.append("propietario", $("#nompro").val());
// 	data.append("documento_pro", $("#docupro").val());	
// 	data.append("tenedor", $("#nomtene").val());
// 	data.append("documento_tene", $("#docutene").val());	
// 	data.append("conductor", $("#nomcondu").val());
// 	data.append("documento_condu", $("#docucondu").val());	
// 	data.append("web", $("#web").val());
// 	data.append("user_satelite", $("#user_satelite").val());
// 	data.append("clave", $("#clave").val());
// 	data.append("tipologianuevo", $("#nuevo").val());
// 	data.append("tipologiahabilte", $("#habilite").val());
// 	data.append("tipologiaactualice",  $("#actualice").val());
// 	data.append("fecha",  $("#fpree").val());
// 	data.append("hora", $("#hpree").val());
// 	data.append("usuario", $("#userpree").val());
// 	data.append("cab", $("#cab").val());
// 	data.append("observacion", $("#obserpree").val());
// 	//insert cabecera
// 	$.ajax({
// 		url: url,
// 		type: 'POST',
// 		data: data,
// 		cache: false,
// 		processData: false, // Don't process the files
// 		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 		dataType: 'json',
// 		success: function (data, textStatus, jqXHR)
// 		{
// 			console.log('si inserto preestudio CABECERA solo');
// 		},
// 		error: function (jqXHR, textStatus, errorThrown)
// 		{
// 			console.log('no inserto preestudio CABECERA solo');
// 			console.log(jqXHR);
// 			console.log(textStatus);
// 			console.log(errorThrown);
// 		}
// 	});	
// 	//referencias
// 	var i=0;
// 	for(i=1; i<=contador_global1; i++){
// 		var empresa=$("#empresa"+i+"").val();
// 		var ingreso=$("#fingreso"+i+"").val();
// 		var retiro=$("#fretiro"+i+"").val();
// 		var contacto=$("#contacto"+i+"").val();
// 		var numero=$("#numero"+i+"").val();
// 		var cargo=$("#cargo"+i+"").val();


// 		data.append("empre",empresa);
// 		data.append("ingreso",ingreso);
// 		data.append("retiro",retiro);
// 		data.append("persona",contacto);
// 		data.append("num", numero);
// 		data.append("cargo",cargo);
// 		data.append("cab", $("#cab").val(5));
// 		data.append("ref", $("#ref").val());
// 		 $.ajax({
// 				url: url,
// 				type: 'POST',
// 				data: data,
// 				cache: false,
// 				processData: false, // Don't process the files
// 				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 				dataType: 'json',
// 				success: function (data, textStatus, jqXHR)
// 				{

// 					console.log('inserto preestudio REFERENCIA solo');

// 				},
// 				error: function (jqXHR, textStatus, errorThrown)
// 				{
// 					console.log('no inserto preestudio REFERENCIA solo');
// 					console.log(jqXHR);
// 					console.log(textStatus);
// 					console.log(errorThrown);
// 				}
// 			});
// 	}
// 	//mensaje de confirmacion
// 	// alert('Ok!! Solicitud Registrada Exitosamente!!');
// 	// location.reload(); 
// });


function update_todo() {
	var urlu = $("#id_url_ajax").val() + "libs/preestudio_ajax.php";
	// alert('actualizar todo');
	var id_preestudio = $("#e_consecutivo").val();
	var placa = $("#e_placa").val();
	var trailer = $("#e_trailer").val();
	var web = $("#e_web").val();
	var usuerweb = $("#e_usuario").val();
	var clave = $("#e_clave").val();
	var propi = $("#e_propietario").val();
	var num_propi = $("#e_numpro").val();
	var tene = $("#e_tenedor").val();
	var num_tene = $("#e_numtene").val();
	var condu = $("#e_conductor").val();
	var num_condu = $("#e_numcondu").val();
	// //datos de la solictud a actualizar
	var id_solicitud = $("#sconsecutivo").val();
	var cliente = $("#scliente").val();
	var fecha = $("#sfecha").val();
	var hora = $("#shora").val();
	var usuario = $("#suser").val();
	var observacion = $("#sobserve").val();
	var data = null;
	data = new FormData();
	data.append("accion", 'update_sol');
	data.append("id_preestudio", id_preestudio);
	data.append("placa", placa);
	data.append("trailer", trailer);
	data.append("web", web);
	data.append("usuerweb", usuerweb);
	data.append("clave", clave);
	data.append("propi", propi);
	data.append("num_propi", num_propi);
	data.append("tene", tene);
	data.append("num_tene", num_tene);
	data.append("condu", condu);
	data.append("num_condu", num_condu);
	data.append("id_solicitud", id_solicitud);
	data.append("cliente", cliente);
	data.append("fecha", fecha);
	data.append("hora", hora);
	data.append("usuario", usuario);
	data.append("observacion", observacion);
	data.append("cab", $("#ecab").val());
	$.ajax({
		url: urlu,
		type: 'POST',
		data: data,
		cache: false,
		processData: false, // Don't process the files
		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		dataType: 'json',
		success: function (data, textStatus, jqXHR) {
			console.log(' solicitud update');
			// alert('Ok!! Solicitud Actualizada Exitosamente!!');
			// location.reload(); 
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log('solicitud update');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});

	//referencias
	var total_edicion = $("#total_edicion").val();
	var i = 0;
	for (i = 1; i <= total_edicion; i++) {
		var e_empresa = $("#eempresa" + i + "").val();
		var e_ingreso = $("#efingreso" + i + "").val();
		var e_retiro = $("#efretiro" + i + "").val();
		var e_contacto = $("#econtacto" + i + "").val();
		var e_telefono = $("#enumero" + i + "").val();
		var e_crgo = $("#ecargo" + i + "").val();
		var e_id = $("#eid" + i + "").val();
		// alert(e_empresa);
		// alert(e_ingreso);
		// alert(e_retiro);
		data.append("edit_empre", e_empresa);
		data.append("edit_ingreso", e_ingreso);
		data.append("edit_retiro", e_retiro);
		data.append("edit_contacto", e_contacto);
		data.append("edit_telefono", e_telefono);
		data.append("edit_cargo", e_crgo);
		data.append("edit_id", e_id);
		data.append("cab", $("#ecab").val(5));
		data.append("ref", $("#refi").val());
		$.ajax({
			url: urlu,
			type: 'POST',
			data: data,
			cache: false,
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			dataType: 'json',
			success: function (data, textStatus, jqXHR) {

				console.log('guardo referencias editar');
				// alert('Ok!! Solicitud Actualizada Exitosamente!!');
				// location.reload(); 

			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log('no guardo referencias editar');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}//cierre del if de referencias
	alert('Ok!! Solicitud Actualizada Exitosamente!!');
	location.reload();
}//cierre de la funcion


//CREAR SOLICITUD
$("#crear").click(function () {
	var url = $("#id_url_ajax").val() + "libs/preestudio_ajax.php";
	//alert('Bienvenido a crear solicitud new');
	//alert('validar si la solicitud ya esta creada');
	//traer datos del vehiculo
	var id_preestudio = $("#e_consecutivo").val();
	var placa = $("#e_placa").val();
	var trailer = $("#e_trailer").val();
	var web = $("#e_web").val();
	var usuerweb = $("#e_usuario").val();
	var clave = $("#e_clave").val();
	var propi = $("#e_propietario").val();
	var num_propi = $("#e_numpro").val();
	var tene = $("#e_tenedor").val();
	var num_tene = $("#e_numtene").val();
	var condu = $("#e_conductor").val();
	var num_condu = $("#e_numcondu").val();
	//datos de la solicitud preestudio
	var solicitud_anterior, fecha, hora, user_new, observacion_new;
	solicitud_anterior = $("#sconsecutivo_antes").val();
	fechanew = $("#fecha_new").val();
	horanew = $("#hora_new").val();
	user_new = $("#user_new").val();
	observacion_new = $("#observacion_new").val();
	var data = null;
	data = new FormData();
	data.append("accion", 'insertar_nueva_solicitud');
	data.append("id_preestudio", id_preestudio);
	data.append("placa", placa);
	data.append("trailer", trailer);
	data.append("web", web);
	data.append("usuerweb", usuerweb);
	data.append("clave", clave);
	data.append("propi", propi);
	data.append("num_propi", num_propi);
	data.append("tene", tene);
	data.append("num_tene", num_tene);
	data.append("condu", condu);
	data.append("num_condu", num_condu);
	//datos de la solicitud
	data.append("solicitud_anterior", solicitud_anterior);
	data.append("fechanew", fechanew);
	data.append("horanew", horanew);
	data.append("observacion_new", observacion_new);
	data.append("user_new", user_new);
	data.append("ecab", $("#ecab").val());
	$.ajax({
		url: url,
		type: 'POST',
		data: data,
		cache: false,
		processData: false, // Don't process the files
		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		dataType: 'json',
		success: function (data, textStatus, jqXHR) {
			console.log('inserto solicitud nueva');
			// alert('Ok!! Registro Guardado Exitosamente!!');
			// 	location.reload(); 
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log('no inserto solicitud nueva');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
	//actualizar referencias

	var i;
	var total_refe = $("#total_edicion").val();

	for (i = 1; i <= total_refe; i++) {
		var eempresa = $("#eempresa" + i + "").val();
		var efingreso = $("#efingreso" + i + "").val();
		var efretiro = $("#efretiro" + i + "").val();
		var econtacto = $("#econtacto" + i + "").val();
		var enumero = $("#enumero" + i + "").val();
		var ecargo = $("#ecargo" + i + "").val();
		var eid = $("#eid" + i + "").val();
		data.append("eempresa", eempresa);
		data.append("efingreso", efingreso);
		data.append("efretiro", efretiro);
		data.append("econtacto", econtacto);
		data.append("enumero", enumero);
		data.append("ecargo", ecargo);
		data.append("id_ref", eid);
		data.append("ecab", $("#ecab").val(8));
		data.append("refi", $("#refi").val());
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			cache: false,
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			dataType: 'json',
			success: function (data, textStatus, jqXHR) {
				console.log('update referencias, soli new');
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log('no update referencias, soli new');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}

	//datos de la solicitud nueva
	var solimax = $("#maxservi2").val();
	var m = 0;
	for (m = 1; m <= solimax; m++) {
		//alert('contador'+m);
		var ser = $("#servicio" + m + "").val();
		var soli = $("#soli2").val();
		//alert('n solicitudes servicio'+ser);
		data.append("solicitud", ser);
		data.append("soli2", $("#soli2").val());
		data.append("ecab", $("#ecab").val(8));
		data.append("refi", $("#refi").val(9));
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			cache: false,
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			dataType: 'json',
			success: function (data, textStatus, jqXHR) {

				console.log('inserto solicitudes new');

			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log('no inserto solicitudes new');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}
	//refresacar pagina
	alert('Ok!! Solicitud Nueva Registrada Exitosamente!!');
	location.reload();
});



function namefile(fic, m) {
	fic = fic.split('\\');
	if (fic == '' || fic == null) {
		$("#new_docu" + m + "").val('');
		$("#r" + m + "").val('');
	} else {

		$("#new_docu" + m + "").val(fic[fic.length - 1]);
		$("#r" + m + "").val(m);
	}
}


// $("#btn_respuestaope").click(function () {
// 	var msg_error = '';
// 	if (!$("#op_estudio").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>Estudio</strong> para poder generar la respuesta a seguridad.</p>";
// 	}
// 	if (!$("#op_ntipo").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>N° tipo</strong> para poder generar la respuesta a seguridad.</p>";
// 	}
// 	if (!$("#op_nestudio").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>N° estudio</strong> para poder generar la respuesta a seguridad.</p>";
// 	}
// 	if (!$("#op_respuesta").val()) {
// 		msg_error += "<p>Debe diligenciar el campo <strong>Respuesta</strong> para poder generar la respuesta a seguridad.</p>";
// 	}
// 	if (!msg_error) {
// 		guardar_respuesta();
// 	} else {
// 		$("#msg_lista").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
// 		$("#ver_lista_segu").animate({ scrollTop: 0 }, 600);
// 	}
// });


// function guardar_respuesta() {
// 	var urlm = $("#id_url_ajax").val() + "libs/preestudio_ajax.php";
// 	var data = null;
// 	data = new FormData();

// 	var archivo = document.getElementById('op_archivo').files;
// 	for (var s = 0; s < archivo.length; s++) {
// 		data.append("op_archivo" + s, archivo[s]);
// 	}
// 	var nestudio = $("#op_nestudio").val();
// 	var estudio = $("#op_estudio").val();
// 	var ntipo = $("#op_ntipo").val();
// 	var rta = $("#op_respuesta").val();
// 	var nom = $("#op_nomarchivo").val();
// 	data.append("accion", 'registrar_respuesta_operacion');
// 	data.append("nestudio", nestudio);
// 	data.append("ntipo", ntipo);
// 	data.append("rta", rta);
// 	data.append("nomarchivo", nom);
// 	data.append("estudio", estudio);
// 	$.ajax({
// 		url: urlm,
// 		type: 'POST',
// 		data: data,
// 		cache: false,
// 		processData: false, // Don't process the files
// 		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 		dataType: 'json',
// 		success: function (data, textStatus, jqXHR) {
// 			alert('Ok!! Registro Guardado Exitosamente!!');
// 			tb_respuestas_op();
// 		},
// 		error: function (jqXHR, textStatus, errorThrown) {
// 			alert('!! No se registro su respuesta!!');
// 			console.log('no inserto referencias');
// 			console.log(jqXHR);
// 			console.log(textStatus);
// 			console.log(errorThrown);
// 		}
// 	});
// }

//tabla de respuestas de operaciones
// function tb_respuestas_op() {
// 	var idstu = $("#idstu").val();
// 	var dato = {
// 		idstu: idstu,
// 		action: 'consultar_respuesta_operaciones'
// 	};
// 	$("#tbr_opera").html('');
// 	$.ajax({
// 		url: url2,
// 		type: 'POST',
// 		data: dato,
// 		dataType: 'json',
// 		success: function (data) {
// 			if (data.result !== null) {
// 				data.result.forEach(function (element, index) {
// 					var doc = '';
// 					if (element.nom_archivo != null && element.nom_archivo != '') {
// 						doc = '<a  href="http://principal.nexosapp.com/' + element.archivo + element.nom_archivo + '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
// 							'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
// 							'</span>' +
// 							'</a>';
// 					} else {
// 						doc = '<label>Sin archivo</label>';
// 					}

// 					$("#tbr_opera").append('<tr>' +
// 						'<td>' + element.estudio_letra + '</td>' +
// 						'<td>' + element.fecha + '</td>' +
// 						'<td>' + element.hora + '</td>' +
// 						'<td>' + element.nota + '</td>' +
// 						'<td>' + doc + '</td></tr>');
// 				});
// 			} else {
// 				$("#tbr_opera").append('<tr>' +
// 					'<td colspan="5" style="text-align: center;" ><b>Sin respuesta de operaciones</b></td>' +
// 					'</tr>');
// 			}
// 		},
// 		error: function (jqXHR, textStatus, errorThrown) {
// 			console.log('error tabla operaciones respuestas');
// 			console.log(jqXHR);
// 			console.log(textStatus);
// 			console.log(errorThrown);
// 		}
// 	});

// }

//consultar la tabla filtros
// function solicitudes() {
// 	//alert('hola');
// 	var tipo, fi, ff, datos;
// 	tipo = $("#cotice").val();
// 	fi = $("#fecha_inicial").val();
// 	ff = $("#fecha_final").val();
// 	// alert(tipo);
// 	// alert(fi);
// 	// alert(ff);
// 	if (tipo == '' || fi == '' || ff == '') {
// 		alert('Por favor ingrese información en cada campo');
// 	} else {
// 		//continuar
// 		if (tipo == 't') {
// 			tip = 't';
// 		} else {
// 			tip = tipo;
// 		}
// 		datos = {
// 			tipo: tip,
// 			fini: fi,
// 			ffin: ff,
// 			action: 'consulte_solicitud'
// 		};
// 		$("#body_esconder").html('');
// 		$.ajax({
// 			url: url2,
// 			type: 'POST',
// 			data: datos,
// 			dataType: 'json',
// 			success: function (data) {
// 				console.log('sisirvio');
// 				console.log(data);

// 				cuente = 0;
// 				cont = 0;
// 				data.result.forEach(function (element, index) {
// 					cuente++;
// 					cont++;
// 					var consecutivo = 1;//idpreestudio
// 					var solicitud = element.esoli;//solicitud preestudio
// 					var placa = element.placa;
// 					//alert(placa);
// 					var fecha = element.fecha;
// 					var estado = element.estado;
// 					var estado_actual = element.estado_actual;

// 					var boton_ver = '';
// 					// boton_ver='<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-eye" id="btn_ver'+cont+'" data-toggle="modal" data-target="#versolicitud"  data-id="'+consecutivo+'" data-id2="'+solicitud+'"></button>';
// 					var boton_edite = '';
// 					var mas_referencia = '';
// 					var btnrespuesta_seguridad = '';
// 					var icono = '';
// 					var btn_status = '';
// 					var hv_vehi = ''; var hv_pro = ''; var hv_con = ''; var hv_tene = '';
// 					var e_securi = '';//boton estudio de seguridad
// 					//datos de propietario - conductor - tenedor

// 					var propietario = element.documento_propietario;
// 					var tenedor = element.documento_tenedor;
// 					var conductor = element.documento_conductor;

// 					//validacion para la lista de comprobación
// 					//var idvehi=element.idvehi;
// 					//var es=element.estadoestudio;
// 					//alert(es);
// 					btn_status = '<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-balance" id="btn_trazo' + cont + '" data-toggle="modal" data-target="#vertrazo"  data-id="' + consecutivo + '" data-id2="' + solicitud + '" data-id3="' + estado + '" data-placement="top"  title="Status"></button>';
// 					boton_ver = '<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-eye" id="btn_ver' + cont + '" data-toggle="modal" data-target="#versolicitud"  data-id2="' + solicitud + '" data-id3="' + estado + '" data-id4="' + placa + '"    data-placement="top"  title="Consultar preestudio"></button>';

// 					//Acciones
// if (element.operacion == 'Nuevo' || element.operacion == 'Habilitar' || element.operacion == 'Actualizar') {
// 	var rmodificar2 = '';
// 	var planilla = '';
// 	var lista_comprobacion, color, rmodificar;
// 	color = '#00C851'; var id_soli = element.idsoliestudio;
// 	if (element.operacion == 'Nuevo') {
// 		btnrespuesta_seguridad = '<button type="button" class="btn-secondary btn btn-xs"  <a href="javascript:" id="btn_res_seguridad' + cont + '"  data-id="' + placa + '" data-id2="' + solicitud + '"   class="cell-detail  hint--top-left"> <span class="icon mdi mdi-assignment"  data-toggle="modal" data-target="#respuesta_seguridad" title="Respuestas de seguridad (prefiltro)"  style="color:#00C851"></span></a> </button>';
// 		if (element.estado == 'aprobado' || element.estado == 'iniciado' || element.estado == 'rechazado' || element.estado == 'cancelado' || element.estado == 'pendiente' || element.estado == 'rechazado para modificar' && element.estado_actual == '1') {
// 			if (element.estado == 'aprobado' && element.estado_actual == '1' && element.operacion == 'Nuevo') {
// 				if (element.estudiosegu == 'NO') {
// 					e_securi = '<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-plus" id="btn_secury' + cont + '" data-toggle="modal" data-target="#estudio_seguridad"  data-id="" data-id2="' + solicitud + '" data-id3="' + estado + '" data-id4="' + placa + '" data-id5="' + propietario + '"  data-id6="' + tenedor + '"  data-id7="' + conductor + '" data-placement="top"  title="Crear hojas de vida" ></button>';
// 				} else {
// 					e_securi = '';
// 				}
// 			} else if (element.estado == 'rechazado para modificar' && element.estado_actual === '1') {
// 				rmodificar2 = '<button type="button" class="btn-secondary btn btn-xs"  <a href="javascript:" id="modifye2' + cont + '"  data-id="' + element.esoli + '" data-id2="' + element.estado + '" data-id3="' + element.ide + '" data-id4="' + element.placa + '"   class="cell-detail  hint--top-left"> <span class="icon mdi mdi-sun"  data-toggle="modal" data-target="#habilitar_pendientepre" title="Habilitar prestudio"  style="color:purple;"></span></a> </button>';
// 				boton_edite = '<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-edit" id="btn_edite' + cont + '" data-toggle="modal" data-target="#editesolicitud"  data-id="' + placa + '" data-id2="' + solicitud + '" data-id3="' + estado + '"  data-placement="top"  title="Editar preestudio" ></button>';
// 				mas_referencia = '<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-file-plus" id="btn_refe' + cont + '" data-toggle="modal" data-target="#mas_referencias"  data-id="" data-id2="' + solicitud + '"  data-placement="top"  title="Agregar mas referencias al preestudio" ></button>';
// 			} else if (element.estado == 'pendiente' && element.estado_actual === '1') {
// 				rmodificar2 = '<button type="button" class="btn-secondary btn btn-xs"  <a href="javascript:" id="modifye2' + cont + '"  data-id="' + element.esoli + '" data-id2="' + element.estado + '" data-id3="' + element.ide + '" data-id4="' + element.placa + '"   class="cell-detail  hint--top-left"> <span class="icon mdi mdi-sun"  data-toggle="modal" data-target="#habilitar_pendientepre" title="Habilitar prestudio"  style="color:purple;"></span></a> </button>';
// 				boton_edite = '<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-edit" id="btn_edite' + cont + '" data-toggle="modal" data-target="#editesolicitud"  data-id="' + placa + '" data-id2="' + solicitud + '" data-id3="' + estado + '"  data-placement="top"  title="Editar preestudio" ></button>';
// 			}
// 		}
// 		if (element.estudiosegu == 'SI' && element.estado == 'aprobado') {
// 			lista_comprobacion = '<button type="button" class="btn-secondary btn btn-xs"  <a href="javascript:"id="listado' + cont + '"  data-id="' + element.idvehi + '" data-id2="' + element.id_conductor + '" data-id3="' + id_soli + '" data-id4="' + solicitud + '" class="cell-detail  hint--top-left"> <span class="icon mdi mdi-assignment"  data-toggle="modal" data-target="#ver_lista_segu" title="Lista Comprobación (Estudio seguridad)"  style="color:' + color + '"></span></a> </button>';
// 			if (element.estado_seguridad == 'Rechazado_modificar' || element.estado_seguridad == 'Pendiente' && element.estado_actu == 1) {
// 				rmodificar = '<button type="button" class="btn-secondary btn btn-xs"  <a href="javascript:" id="	' + cont + '"  data-id="' + element.esoli + '" data-id2="' + element.placa + '" data-id3="' + element.idsoliestudio + '"  data-id4="' + element.id_conductor + '"  data-id5="' + element.idvehi + '" data-id6="' + element.idvcompleto + '"  data-id7="' + element.vobse + '"   class="cell-detail  hint--top-left"> <span class="icon mdi mdi-sun"  data-toggle="modal" data-target="#habilitar_pendiente" title="Habilitar estudio"  style="color:purple;"></span></a> </button>';
// 			} else {
// 				rmodificar = '';
// 			}
// 		} else {
// 			rmodificar = '';

// 			lista_comprobacion = '';
// 		}
// 	}
// 	if (element.operacion == 'Habilitar' || element.operacion == 'Actualizar') {
// 		lista_comprobacion = ' <a class="btn-secondary btn btn-xs" role="button" href="javascript:"id="listado' + cont + '"  data-id="' + element.idvehi + '" data-id2="' + element.id_conductor + '" data-id3="' + id_soli + '" data-id4="' + solicitud + '" class="cell-detail  hint--top-left"> <span class="icon mdi mdi-assignment"  data-toggle="modal" data-target="#ver_lista_segu" title="Lista Comprobación (Estudio seguridad)"  style="color:' + color + '"></span></a>';
// 		if (element.estado_seguridad == 'Rechazado_modificar' || element.estado_seguridad == 'Pendiente' && element.estado_actu == 1) {
// 			rmodificar = '<button type="button" class="btn-secondary btn btn-xs"  <a href="javascript:" id="modifye' + cont + '"  data-id="' + element.esoli + '" data-id2="' + element.placa + '" data-id3="' + element.idsoliestudio + '"  data-id4="' + element.id_conductor + '"  data-id5="' + element.idvehi + '" data-id6="' + element.idvcompleto + '"  data-id7="' + element.vobse + '"   class="cell-detail  hint--top-left"> <span class="icon mdi mdi-sun"  data-toggle="modal" data-target="#habilitar_pendiente" title="Habilitar estudio"  style="color:purple;"></span></a> </button>';
// 			planilla = '';
// 		} else {
// 			rmodificar = '';
// 		}
// 	}
// }

//estados
// var status = '';
// var status_e = '';
// var status_es = '';
// if (element.operacion == 'Nuevo') {
// 	if (element.estado == 'aprobado') {
// 		status =
// 			'<td class="text-success" >' +
// 			'<center>' +
// 			'<span class="mdi mdi-dot-circle icon" title="prefiltro aprobado"></span>' +
// 			'</center>' +
// 			'</td>';
// 	}
// 	if (element.estado == 'pendiente') {
// 		status =
// 			'<td class="text" style="color:blue;" >' +
// 			'<center>' +
// 			'<span class="mdi mdi-dot-circle icon" title="prefiltro pendiente"></span>' +
// 			'</center>' +
// 			'</td>';
// 	}

// 	if (element.estado == 'vencida') {
// 		status =
// 			'<td class="text" style="color:brown;" >' +
// 			'<center>' +
// 			'<span class="mdi mdi-dot-circle icon" title="prefiltro vencido"></span>' +
// 			'</center>' +
// 			'</td>';
// 	}

// 	if (element.estado == 'pendiente_iniciar') {
// 		status =
// 			'<td class="text" style="color:black;" >' +
// 			'<center>' +
// 			'<span class="mdi mdi-dot-circle icon" title="prefiltro pendiente por iniciar"></span>' +
// 			'</center>' +
// 			'</td>';
// 	}

// 	if (element.estado == 'iniciado') {
// 		status =
// 			'<td class="text" style="color:yellow;" >' +
// 			'<center>' +
// 			'<span class="mdi mdi-dot-circle icon" title="prefiltro iniciado"></span>' +
// 			'</center>' +
// 			'</td>';
// 	}

// 	if (element.estado == 'rechazado') {
// 		status =
// 			'<td class="text" style="color:red;" >' +
// 			'<center>' +
// 			'<span class="mdi mdi-dot-circle icon" title="prefiltro rechazado"></span>' +
// 			'</center>' +
// 			'</td>';
// 	}

// 	if (element.estado == 'cancelado') {
// 		status =
// 			'<td class="text" style="color:orange;" >' +
// 			'<center>' +
// 			'<span class="mdi mdi-dot-circle icon" title="prefiltro cancelado"></span>' +
// 			'</center>' +
// 			'</td>';
// 	}

// 	if (element.estado == 'rechazado para modificar') {
// 		status =
// 			'<td class="text" style="color:red;" >' +
// 			'<center>' +
// 			'<span class="mdi mdi-dot-circle icon" title="prefiltro rechazado para modificar"></span>' +
// 			'</center>' +
// 			'</td>';
// 	}
// 	status_e += element.campo;
// 	status_es += element.estado_seguridad;
// }

// 					if (element.operacion == 'Habilitar' || element.operacion == 'Actualizar') {
// 						status_e += element.campo;
// 						status_es += element.estado_seguridad;

// 						if (element.estado_seguridad == 'Sin iniciar') {
// 							status =
// 								'<td class="text" style="color:gray;" >' +
// 								'<center>' +
// 								'<span class="mdi mdi-dot-circle icon" title="Estudio sin iniciar"></span>' +
// 								'</center>' +
// 								'</td>';
// 						}

// 						if (element.estado_seguridad == 'iniciado') {
// 							status =
// 								'<td class="text" style="color:blue;" >' +
// 								'<center>' +
// 								'<span class="mdi mdi-dot-circle icon" title="Estudio iniciado"></span>' +
// 								'</center>' +
// 								'</td>';
// 						}

// 						if (element.estado_seguridad == 'Pendiente') {
// 							status =
// 								'<td class="text" style="color:yellow;" >' +
// 								'<center>' +
// 								'<span class="mdi mdi-dot-circle icon" title="Estudio Pendiente"></span>' +
// 								'</center>' +
// 								'</td>';
// 						}

// 						if (element.estado_seguridad == 'Rechazado_modificar') {
// 							status =
// 								'<td class="text" style="color:orange;" >' +
// 								'<center>' +
// 								'<span class="mdi mdi-dot-circle icon" title="Estudio Rechazado Modificar"></span>' +
// 								'</center>' +
// 								'</td>';
// 						}

// 						if (element.estado_seguridad == 'Rechazado') {
// 							status =
// 								'<td class="text" style="color:red;">' +
// 								'<center>' +
// 								'<span class="mdi mdi-dot-circle icon" title=" Estudio Rechazado"></span>' +
// 								'</center>' +
// 								'</td>';
// 						}

// 						if (element.estado_seguridad == 'Aprobado') {
// 							status =
// 								'<td class="text" style="color:green;" >' +
// 								'<center>' +
// 								'<span class="mdi mdi-dot-circle icon" title="Estudio Aprobado"></span>' +
// 								'</center>' +
// 								'</td>';
// 						}
// 					}

// 					$("#body_esconder").append(
// 						'<tr>' + status +
// 						'<td>' + element.esoli + '</td>' +
// 						'<td>' + element.fecha + '</td>' +
// 						'<td>' + element.hora + '</td>' +
// 						'<td>' + element.placa + '</td>' +
// 						'<td>' + status_e + '</td>' +
// 						'<td>' + element.operacion + '</td>' +
// 						'<td>' + element.estudiosegu + '</td>' +
// 						'<td>' + status_es + '</td>' +
// 						'<td>' + boton_ver + '&nbsp;&nbsp;' + boton_edite + '&nbsp;&nbsp;' +
// 						btnrespuesta_seguridad + '&nbsp;&nbsp;' + e_securi +
// 						'&nbsp;&nbsp;' + lista_comprobacion + '&nbsp;&nbsp;'
// 						+ rmodificar + '&nbsp;&nbsp;' + rmodificar2 + '</td></tr>');
// 					//boton no ediitar

// 					$("#btn_editeNO" + cont + "").click(function () {
// 						alert('Por favor revisé el status , y envie los soportes por correo. Gracias');
// 					});

// 					//boton ver
// 					$("#btn_ver" + cont + "").click(function () {
// 						//alert('ok');
// 						// alert('hola ver');
// 						var placa = $(this).attr('data-id4');
// 						var id2 = $(this).attr('data-id2');
// 						var estado = $(this).attr('data-id3');
// 						//alert('pree'+id); alert('sol'+id2);
// 						$("#estado_ver").html('Estado: ' + estado);
// 						// alert(id);
// 						var dato = {
// 							placa: placa,
// 							solicitud: id2,
// 							action: 'vsolicitud_preestudio'
// 						};
// 						$("#consulta_referencia").html('');
// 						$("#consulta_tbservicio").html('');
// 						$.ajax({
// 							url: url2,
// 							type: 'POST',
// 							data: dato,
// 							dataType: 'json',
// 							success: function (data) {
// 								console.log('si se puede ver');
// 								console.log(data);
// 								if (data.result) {
// 									$("#vid").val(data.result[0].id);
// 									$("#vplaca").val(data.result[0].placa);
// 									$("#vtrailer").val(data.result[0].placa_trailer);
// 									$("#vconse").val(data.result[0].id_preestudio);
// 									$("#vfecha").val(data.result[0].fecha);
// 									$("#vhora").val(data.result[0].hora);
// 									$("#vuser").val(data.result[0].usuario);
// 									$("#vcliente").val(data.result[0].nombre_cliente);
// 									$("#vpropi").val(data.result[0].nombre_propietario);
// 									$("#vpdocumento").val(data.result[0].documento_propietario);
// 									$("#vtene").val(data.result[0].nombre_tenedor);
// 									$("#vtdocumento").val(data.result[0].documento_tenedor);
// 									$("#vcondu").val(data.result[0].nombre_conductor);
// 									$("#vcdocumento").val(data.result[0].documento_conductor);
// 									$("#vweb").val(data.result[0].web_satelital);
// 									$("#vwuser").val(data.result[0].usuario_satelital);
// 									$("#vwclave").val(data.result[0].clave_satelital);
// 								}

// 								if (data.result2) {
// 									data.result2.forEach(function (element, index) {
// 										$("#consulta_referencia").append('<tr>' +
// 											'<td>' + element.nombre_empresa + '</td>' +
// 											'<td>' + element.fecha_ingreso + '</td>' +
// 											'<td>' + element.fecha_retiro + '</td>' +
// 											'<td>' + element.persona_contacto + '</td>' +
// 											'<td>' + element.celular + '</td>' +
// 											'<td>' + element.cargo + '</td>' +
// 											'</tr>');
// 									});
// 								}

// 								if (data.result3) {
// 									data.result3.forEach(function (element, index) {
// 										$("#consulta_tbservicio").append('<tr>' +
// 											'<td>' + element.id + '</td>' +
// 											'<td>' + element.nombre_cliente + '</td>' +
// 											'<td>' + element.orige + '</td>' +
// 											'<td>' + element.dest + '</td>' +
// 											'<td>' + element.peso_kg + '/' + element.tipo_vehiculo + '</td>' +
// 											'<td>' + element.usuario_auditor + '</td>' +
// 											'<td>' + element.fecha + '-' + element.hora + '</td>' +
// 											'</tr>');
// 									});
// 								}

// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('no error');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});

// 						//consulta datos a actualizar enviados x operaciones
// 						var campo_actu = {
// 							placa: placa,
// 							soli: id2,
// 							action: 'campos_actu'
// 						};

// 						$("#consulta_datoupdate").html('');
// 						$.ajax({
// 							url: url2,
// 							type: 'POST',
// 							data: campo_actu,
// 							dataType: 'json',
// 							success: function (data) {
// 								if (data) {
// 									var z = 0;
// 									data.result.forEach(function (element, index) {
// 										z++;
// 										$("#consulta_datoupdate").append('<tr>' +
// 											'<td>' + z + '</td>' +
// 											'<td>' + element.tipo_hv + '</td>' +
// 											'<td>' + element.tipo_campo + '</td>' +
// 											'<td>' + element.info_campo + '</td>' +
// 											'<td>' + element.usuario + '</td>' +
// 											'<td>' + element.fecha + '/' + element.hora + '</td>' + '</tr>');
// 									});
// 								}
// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('error en consultar campos actualizar');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});

// 						//consultar documentos
// 						var documentos = {
// 							placa: placa,
// 							soli: id2,
// 							action: 'documentos_actu'
// 						};
// 						$("#consulta_documentos").html('');
// 						$.ajax({
// 							url: url2,
// 							type: 'POST',
// 							data: documentos,
// 							dataType: 'json',
// 							success: function (data) {
// 								if (data) {
// 									data.result.forEach(function (element, index) {
// 										$("#consulta_documentos").append('<tr>' +
// 											'<td>' + element.tipo_hv + '</td>' +
// 											'<td>' + element.clase + '</td>' +
// 											'<td>' +
// 											'<a  href="http://localhost/mvcLuisMiguel/' + element.ruta + '/' + element.nombre_archivo + '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
// 											'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
// 											'</span>' +
// 											'</a>'
// 											+ ' </td>' +
// 											'<td>' + element.usuario + '</td>' +
// 											'<td>' + element.fecha + '/' + element.hora + '</td>' +
// 											'</tr>');

// 									});
// 								}
// 							},
// 							error(jqXHR, textStatus, errorThrown) {
// 								console.log('error en consultar documentos');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});


// 					});//cierre del click function
// 					//boton traer los datos al editar

// 					$("#btn_edite" + cont + "").click(function () {
// 						//alert('hola edicion');
// 						var placa = $(this).attr('data-id');
// 						var id2 = $(this).attr('data-id2');
// 						var estado = $(this).attr('data-id3');
// 						$("#estado_edi").html('Estado: ' + estado);
// 						// alert(id);
// 						var dato = {
// 							placa: placa,
// 							solicitud: id2,
// 							action: 'esolicitud_preestudio'
// 						};
// 						$("#editar_table_actual").html('');
// 						$("#edit_tbservicio").html('');
// 						$("#edit_documents").html('');
// 						$.ajax({
// 							url: url2,
// 							type: 'POST',
// 							data: dato,
// 							dataType: 'json',
// 							success: function (data) {
// 								console.log('si se puede ver');
// 								console.log(data);
// 								if (data.result) {
// 									$("#eid").val(data.result[0].id);//
// 									$("#eplaca").val(data.result[0].placa);
// 									$("#etrailer").val(data.result[0].placa_trailer);
// 									$("#econse").val(data.result[0].id_preestudio);//
// 									$("#efecha").val(data.result[0].fecha);
// 									$("#ehora").val(data.result[0].hora);
// 									$("#euser").val(data.result[0].usuario);
// 									$("#ecliente").val(data.result[0].cliente);
// 									$("#epropi").val(data.result[0].nombre_propietario);
// 									$("#epdocumento").val(data.result[0].documento_propietario);
// 									$("#etene").val(data.result[0].nombre_tenedor);
// 									$("#etdocumento").val(data.result[0].documento_tenedor);
// 									$("#econdu").val(data.result[0].nombre_conductor);
// 									$("#ecdocumento").val(data.result[0].documento_conductor);
// 									$("#eweb").val(data.result[0].web_satelital);
// 									$("#ewuser").val(data.result[0].usuario_satelital);
// 									$("#ewclave").val(data.result[0].clave_satelital);
// 								}
// 								//traer referencias laborales
// 								var cuente = 0;
// 								var total_refe = 0;
// 								if (data.result2) {
// 									console.log(data);
// 									data.result2.forEach(function (element, index) {
// 										cuente++;
// 										total_refe = total_refe + 1;
// 										$("#editar_table_actual").append('<tr>' +
// 											'<tr style="text-align:left; color:white; background-color:#33b5e5;"><th>Empresa</th><th>Fecha ingreso</th><th>Fecha retiro</th></tr>' +
// 											'<tr><td><input type="text" id="empresa_a' + cuente + '" class="form-control" value="' + element.nombre_empresa + '" style="width:310px; height:14px; font-size:90%; margin-left:1px; "></td>' +
// 											'<td><input type="date" id="ingreso_a' + cuente + '" class="form-control" value="' + element.fecha_ingreso + '" style="width:120px; height:14px; font-size:90%;"></td>' +
// 											'<td><input type="date" id="retiro_a' + cuente + '" class="form-control" value="' + element.fecha_retiro + '" style="width:120px; height:14px; font-size:90%;"></td></tr>' +
// 											'<tr><th>Contacto</th><th>Teléfono</th><th>Cargo</th></tr>' +
// 											'<tr><td><input type="text" id="contacto_a' + cuente + '"  class="form-control"  value="' + element.persona_contacto + '" style="width:310px; height:14px; font-size:90%;"></td>' +
// 											'<td><input type="number" id="numero_a' + cuente + '" class="form-control" value="' + element.celular + '" style="width:150px; height:14px; font-size:90%; "></td>' +
// 											'<td><input type="text" id="cargo_a' + cuente + '" class="form-control" value="' + element.cargo + '" style="width:150px; height:14px; font-size:90%; "></td>' +
// 											'<td><input type="hidden" id="id_a' + cuente + '" class="form-control" value="' + element.id + '" style="width:65px; height:14px; font-size:69%;" readonly="readonly"></td>' +
// 											'</tr>');
// 									});
// 									$("#s_total_refe").val(total_refe);
// 								}
// 								c = 0;
// 								if (data.result3) {
// 									data.result3.forEach(function (element, index) {
// 										c++;
// 										$("#edit_tbservicio").append('<tr>' +
// 											'<td>' +
// 											"<button  class=' form-control btn btn-xs mdi mdi-minus input-xs text-center' title='Remover Solicitud' style='color:gray;' id='e" + c + "' value='" + element.id + "' onclick='e_servi(this.value,this.id);' > " +
// 											"</button>" +
// 											'</td>' +
// 											'<td>' + element.nombre_cliente + '</td>' +
// 											'<td>' + element.orige + '</td>' +
// 											'<td>' + element.dest + '</td>' +
// 											'<td>' + element.peso_kg + '/' + element.tipo_vehiculo + '</td>' +
// 											'<td>' + element.usuario_auditor + '</td>' +
// 											'<td>' + element.fecha + '-' + element.hora + '</td>' +
// 											'</tr>');
// 									});
// 								}

// 								if (data.result4) {
// 									$("#obser_edit").val(data.result4[0].observacion);
// 								}
// 								var m = 0;
// 								var f = 0;
// 								if (data.result5) {
// 									data.result5.forEach(function (element, index) {
// 										m++
// 										f = f + 1;
// 										$("#cant_docmentos").val(f);
// 										var idd = '<input type="text" id="iddo' + m + '"  value="' + element.id + '" class="form-control input-sm text-center" disabled="disabled" title="' + element.id + '">';
// 										var docu = '<a  href="http://localhost/mvcLuisMiguel/' + element.ruta + '/' + element.nombre_archivo + '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
// 											'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
// 											'</span>' +
// 											'</a>';

// 										var kl = '<input type="file" id="actu_file' + m + '" class="form-control input-sm"        onchange="namefile(this.value,' + m + ')">';

// 										var t = '<input type="text" class="form-control input-sm" id="new_docu' + m + '" disabled="disabled"  >';

// 										var ru = '<input type="text" id="rutad' + m + '" class="form-control input-sm" disabled="disabled" value="' + element.ruta + '">';

// 										var c = '<input type="text" id="r' + m + '" class="form-control input-sm" disabled="disabled">';


// 										$("#edit_documents").append('<tr>' +
// 											'<td>' + idd + '</td>' +
// 											'<td>' + element.tipo_hv + '</td>' +
// 											'<td>' + element.clase + '</td>' +
// 											'<td>' + ru + '</td>' +
// 											'<td>' + docu + '</td>' +
// 											'<td>' + kl + '</td>' +
// 											'<td>' + t + '</td>' +
// 											'<td>' + c + '</td></tr>');
// 									});
// 								}



// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('no error');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});

// 					});

// 					//boton agregar mas referencias a la solicitud
// 					$("#btn_refe" + cont + "").click(function () {
// 						// alert('agregar mas referencias');
// 						var prees = $(this).attr('data-id');
// 						var idsoli = $(this).attr('data-id2');
// 						// alert(prees);
// 						// alert(idsoli);
// 						$("#num_preestudio").val(prees);
// 						//traer refrencias
// 						var trae = {
// 							prees: prees,
// 							action: 'traer_fila'
// 						};
// 						$("#elimine_ref").html('');

// 						$.ajax({
// 							url: url2,
// 							type: 'POST',
// 							data: trae,
// 							dataType: 'json',
// 							success: function (data) {

// 								console.log('si trajo filas');
// 								console.log(data);
// 								if (data.result) {
// 									var c = 0;
// 									data.result.forEach(function (element, index) {

// 										$("#elimine_ref").append('<tr>' +
// 											'<td>' +
// 											"<button  class=' form-control btn btn-xs mdi mdi-minus input-xs text-center' title='Remover referencia' style='color:gray;' id='e" + c + "' value='" + element.id + "' onclick='e(this.value,this.id);' > " +
// 											"</button>" +
// 											'</td>' +
// 											'<td>' + element.nombre_empresa + '</td>' +
// 											'<td>' + element.fecha_ingreso + '</td>' +
// 											'<td>' + element.fecha_retiro + '</td>' +
// 											'<td>' + element.persona_contacto + '</td>' +
// 											'<td>' + element.celular + '</td>' +
// 											'<td>' + element.cargo + '</td>' +
// 											+'</tr>');
// 									});
// 								}
// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('error no trajo filas');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});
// 					});

// 					//boton respuestas seguridad
// 					$("#btn_res_seguridad" + cont + "").click(function () {

// 						var placa = $(this).attr('data-id');
// 						var solicitud = $(this).attr('data-id2');
// 						$("#rplaca").html(placa);

// 						// d.getElementById("numplaca").value = placa;
// 						//consultar respuestas de seguridad
// 						var answer = {
// 							num_solicitud: solicitud,
// 							action: 'consultar_respuesta_seguridad'
// 						};
// 						$("#respuestas_seguridad").html('');
// 						$.ajax({
// 							url: url2,
// 							type: 'POST',
// 							data: answer,
// 							dataType: 'json',
// 							success: function (data) {
// 								console.log('si trajo respuesta seguridad');
// 								console.log(data);
// 								if (data.result) {
// 									data.result.forEach(function (element, index) {
// 										var causa = '';
// 										if (element.respuesta == null) {
// 											causa = '';
// 										} else {
// 											causa = element.respuesta;
// 										}

// 										if (element.token === null) {
// 											$("#token").html("");
// 										} else {
// 											$("#token").html(element.token);
// 										}

// 										if (element.token === null) {
// 											$("#fechaexpiracion").html("");
// 										} else {
// 											$("#fechaexpiracion").html(element.token_valido);
// 										}

// 										$("#respuestas_seguridad").append('<tr>' +
// 											'<td>' + element.estado + '</td>' +
// 											'<td>' + causa + '</td>' +
// 											'<td>' + element.observacion + '</td>' +
// 											'<td>' + element.usuario + '</td>' +
// 											'<td>' + element.fecha + '/<br>' + element.hora + '</td>' +
// 											'</tr>');
// 									});

// 								}
// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('error respuestas seguridad');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});


// 					});

// 					//boton trazabilidad (usado tambien en seguridad)
// 					$("#btn_trazo" + cont + "").click(function () {
// 						// alert('hello');
// 						var pree = $(this).attr('data-id');
// 						var soli = $(this).attr('data-id2');
// 						var estado = $(this).attr('data-id3');

// 						var coti = {
// 							soli: soli,
// 							action: 'buscar_cotizacion'
// 						};
// 						$("#body_cotizacion").html('');
// 						$("#body_servicio").html('');
// 						$("#body_preestu").html('');
// 						$.ajax({
// 							url: url2,
// 							type: 'POST',
// 							data: coti,
// 							dataType: 'json',
// 							success: function (data) {
// 								console.log('si cotizacion');
// 								console.log(data);
// 								//preestudio
// 								if (data) {
// 									data.result.forEach(function (element, index) {
// 										$("#body_cotizacion").append('<tr>' +
// 											'<td>' + element.n_cotizacion + '</td>' +
// 											'<td>' + element.item + '</td>' +
// 											'<td>' + element.idpareja_origen_destino + '</td>' +
// 											'<td>' + element.estado_autorizado + '</td>' +
// 											'<td>' + element.fecha + '</td>' +
// 											'<td>' + element.hora + '</td>' +
// 											'<td>' + element.user_log + '</td>' +
// 											'<td>' + element.pcoti + '</td>' +
// 											+'</tr>');

// 										$("#body_servicio").append('<tr>' +
// 											'<td>' + element.id + '</td>' +
// 											'<td>' + element.n_cotizacion + '</td>' +
// 											'<td>' + element.item + '</td>' +
// 											'<td>' + element.fecha + '</td>' +
// 											'<td>' + element.hora + '</td>' +
// 											'<td>' + element.user_log + '</td>' +
// 											'<td>' + element.pprees + '</td>' +
// 											+'</tr>');

// 										$("#body_preestu").append('<tr>' +
// 											'<td>' + element.id_preestudio + '</td>' +
// 											'<td>' + element.id + '</td>' +
// 											'<td>' + element.fecha + '</td>' +
// 											'<td>' + element.hora + '</td>' +
// 											'<td>' + element.usuario + '</td>' +
// 											'<td>' + element.prepro + '</td>' +
// 											+'</tr>');


// 									});

// 								}
// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('no cotizacion');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});

// 						//estados de la cotizacion
// 						var dati = {
// 							pree: pree,
// 							soli: soli,
// 							action: 'status_seguridad'
// 						};
// 						$("#body_status").html('');
// 						$.ajax({
// 							url: url2,
// 							type: 'POST',
// 							data: dati,
// 							dataType: 'json',
// 							success: function (data) {
// 								console.log('si status');
// 								console.log(data);
// 								//preestudio
// 								if (data) {
// 									data.result.forEach(function (element, index) {
// 										$("#body_status").append('<tr>' +
// 											'<td>' + element.area + '</td>' +
// 											'<td>' + element.estado + '</td>' +
// 											'<td>' + element.fecha + '</td>' +
// 											'<td>' + element.hora + '</td>' +
// 											'<td>' + element.usuario + '</td>' +
// 											'</tr>');
// 									});
// 								}
// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('no status');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});

// 						//respuestas de seguridad

// 						//consultar respuestas de seguridad
// 						//alert(soli);
// 						var answer = {
// 							num_solicitud: soli,
// 							action: 'consultar_respuesta_seguridad'
// 						};

// 						$("#respuestas_seguridad2").html('');
// 						$.ajax({
// 							url: url2,
// 							type: 'POST',
// 							data: answer,
// 							dataType: 'json',
// 							success: function (data) {
// 								console.log('si trajo respuesta seguridad');
// 								console.log(data);
// 								if (data.result) {
// 									data.result.forEach(function (element, index) {
// 										var causa = '';
// 										if (element.respuesta == null) {
// 											causa = '';
// 										} else {
// 											causa = element.respuesta;
// 										}

// 										$("#respuestas_seguridad2").append('<tr>' +
// 											'<td>' + element.estado + '</td>' +
// 											'<td>' + causa + '</td>' +
// 											'<td>' + element.usuario + '</td>' +
// 											'<td>' + element.fecha + '/<br>' + element.hora + '</td>' +
// 											'<td>' + element.observacion + '<td>' +
// 											'</tr>');
// 									});

// 								}
// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('error respuestas seguridad');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});

// 						//respuestas edicion
// 						var respu = {
// 							id: solicitud,
// 							action: 'respuesta_operaciones'
// 						};
// 						$("#respuestas_operacion").html('');
// 						$.ajax({
// 							url: url2,
// 							type: 'POST',
// 							data: respu,
// 							dataType: 'json',
// 							success: function (data) {
// 								console.log('si trajo respuesta operaciones');
// 								if (data.result) {
// 									data.result.forEach(function (element, index) {
// 										$("#respuestas_operacion").append('<tr>' +
// 											'<td>' + element.id_Solicitud + '</td>' +
// 											'<td>' + element.edicion + '</td>' +
// 											'<td>' + element.usuario + '</td>' +
// 											'<td>' + element.fecha + '</td>' +
// 											'<td>' + element.hora + '</td>' +
// 											'<td>' + element.observacion + '</td>'
// 											+ '</tr>');
// 									});
// 								}

// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('error respuestas operaciones');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});
// 					});

// 					//lista de comprobacion para seguridad
// 					$("#listado" + cont).click(function () {
// 						//alert('HOLAAAA FAUNO');

// 						var idvehiculo = $(this).attr('data-id');
// 						var idconductor = $(this).attr('data-id2');
// 						var idsoli = $(this).attr('data-id3');
// 						var id_preestudio = $(this).attr('data-id4');

// 						$("#idvehi").val(idvehiculo);
// 						$("#idcondu").val(idconductor);
// 						$("#idstu").val(idsoli);

// 						var datos = {
// 							idv: idvehiculo,
// 							idc: idconductor,
// 							idsoli: idsoli,
// 							action: 'verestudio_operaciones'
// 						};

// 						$("#apro").html('');
// 						$("#capro").html('');
// 						$("#rapro").html('');
// 						$("#ruapro").html('');
// 						$("#poapro").html('');
// 						$("#proapro").html('');
// 						$("#sipro").html('');
// 						$("#siscompro").html('');
// 						$("#adrpro").html('');
// 						$("#gpro").html('');
// 						$("#prepro").html('');
// 						$("#cuerpo_estudio").html('');
// 						$.ajax({
// 							url: url2,
// 							type: 'POST',
// 							data: datos,
// 							dataType: 'json',
// 							success: function (data, textStatus, jqXHR) {
// 								// alert('entro a data LISTA COMPROBACION');
// 								if (data.result) {
// 									// alert('empezo estudio de seguridad');
// 									tb_respuestas_op();//tabla respuestas de operaciones a seguridad
// 									$("#caja_rtaopera").hide();



// 									var cunt = 0;
// 									data.result.forEach(function (element, index) {
// 										cunt++;

// 										$("#idstu").val(element.id_estudio);

// 										var etotal = element.estadototal;
// 										if (etotal == 'gray') {
// 											$("#estadostudy").val('sin respuesta');
// 										}

// 										if (etotal !== 'gray') {
// 											$("#estadostudy").val(etotal);
// 										}

// 										//$("#estadostudy").val(element.estadototal);

// 										if (element.estadototal == 'Aprobado') {
// 											$("#estado_estu").prop('disabled', true);
// 											$("#aprobar_estudio_total").hide();
// 										} else {
// 											$("#estado_estu").prop('disabled', false);
// 											$("#obse_estu").prop('disabled', false);
// 											$("#aprobar_estudio_total").show();
// 										}

// 										var tipo = element.estudio;
// 										var aprobado = element.estado;
// 										var status = '';
// 										var requerido = '';
// 										$requerido = '<span class="text-primary mdi mdi-star-half icon"></span>';

// 										if (tipo == 'hoja de vida vehiculo') {
// 											iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 												'</span></center>';

// 											if (aprobado == '1') {
// 												status = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											} else if (aprobado == '0') {
// 												status = '<center><span class="text-danger mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											}
// 											//impirimir el inicado
// 											$("#ini").html('' + iniciado2 + '');
// 											$("#apro").html('' + status + '');
// 										}

// 										if (tipo == 'hoja de vida conductor') {
// 											iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 												'</span></center>';
// 											if (aprobado == '1') {
// 												status = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											} else if (aprobado == '0') {
// 												status = '<center><span class="text-danger mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											}
// 											$("#cini").html('' + iniciado2 + '');
// 											$("#capro").html('' + status + '');
// 										}

// 										if (tipo == 'risck') {
// 											iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 												'</span></center>';
// 											if (aprobado == '1') {
// 												status = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											} else if (aprobado == '0') {
// 												status = '<center><span class="text-danger mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											}
// 											$("#rini").html('' + iniciado2 + '');
// 											$("#rapro").html('' + status + '');
// 										}

// 										if (tipo == 'siplaft') {
// 											iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 												'</span></center>';
// 											if (aprobado == '1') {
// 												status = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											} else if (aprobado == '0') {
// 												status = '<center><span class="text-danger mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											}
// 											$("#sini").html('' + iniciado2 + '');
// 											$("#sapro").html('' + status + '');
// 										}

// 										if (tipo == 'runt') {
// 											iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 												'</span></center>';
// 											if (aprobado == '1') {
// 												status = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											} else if (aprobado == '0') {
// 												status = '<center><span class="text-danger mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											}
// 											$("#ruini").html('' + iniciado2 + '');
// 											$("#ruapro").html('' + status + '');
// 										}

// 										if (tipo == 'policia') {
// 											iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 												'</span></center>';
// 											if (aprobado == '1') {
// 												status = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											} else if (aprobado == '0') {
// 												status = '<center><span class="text-danger mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											}
// 											$("#pini").html('' + iniciado2 + '');
// 											$("#poapro").html('' + status + '');
// 										}

// 										if (tipo == 'procuraduria') {
// 											iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 												'</span></center>';
// 											if (aprobado == '1') {
// 												status = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											} else if (aprobado == '0') {
// 												status = '<center><span class="text-danger mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											}
// 											$("#proini").html('' + iniciado2 + '');
// 											$("#proapro").html('' + status + '');
// 										}

// 										if (tipo == 'simit') {
// 											iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 												'</span></center>';
// 											if (aprobado == '1') {
// 												status = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											} else if (aprobado == '0') {
// 												status = '<center><span class="text-danger mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											}
// 											$("#smini").html('' + iniciado2 + '');
// 											$("#sipro").html('' + status + '');
// 										}

// 										if (tipo == 'siscomn') {
// 											iniciado2 = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 												'</span></center>';
// 											if (aprobado == '1') {
// 												status = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											} else if (aprobado == '0') {
// 												status = '<center><span class="text-danger mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											}
// 											$("#siscini").html('' + iniciado2 + '');
// 											$("#siscompro").html('' + status + '');
// 										}

// 										if (tipo == 'adres') {
// 											iniciado = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 												'</span></center>';
// 											if (aprobado == '1') {
// 												status = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											} else if (aprobado == '0') {
// 												status = '<center><span class="text-danger mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											}
// 											$("#aini").html('' + iniciado + '');
// 											$("#adrpro").html('' + status + '');
// 										}

// 										if (tipo == 'Gps') {
// 											iniciado = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 												'</span></center>';
// 											if (aprobado == '1') {
// 												status = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											} else if (aprobado == '0') {
// 												status = '<center><span class="text-danger mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											}
// 											$("#gini").html('' + iniciado + '');
// 											$("#gpro").html('' + status + '');
// 										}

// 										if (tipo == 'Dato preestudio') {
// 											iniciado = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 												'</span></center>';
// 											if (aprobado == '1') {
// 												status = '<center><span class="text-success mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											} else if (aprobado == '0') {
// 												status = '<center><span class="text-danger mdi mdi-dot-circle icon">' +
// 													'</span></center>';
// 											}
// 											$("#preini").html('' + iniciado + '');
// 											$("#prepro").html('' + status + '');
// 										}

// 										//OBSERVACIONES
// 										var btn_estudio = '';

// 										var palabra, d;
// 										if (element.estado == '1') {
// 											palabra = 'Aceptado';
// 										}
// 										if (element.estado == '0') {
// 											palabra = 'No aceptado';

// 											btn_estudio = '<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-sun" title="edicion operaciones"' +
// 												'style="color:#008F39;" id="res_operacion' + cunt + '" data-id="' + element.id_estudio + '" data-id2="' + element.id + '" data-id3="' + element.estudio + '" ></button>';

// 										}

// 										$("#cuerpo_estudio").append('<tr>' +
// 											'<td>' + element.estudio + '</td>' +
// 											'<td>' + palabra + '</td>' +
// 											'<td>' + element.observacion + '</td>' +
// 											'<td>' + element.usuario + '</td>' +
// 											'<td>' + element.fecha + '_' + element.hora + '</td>' +
// 											'<td>' + btn_estudio + '</td>' +
// 											'</tr>');


// 										$("#op_estudio").val('');
// 										$("#op_ntipo").val('');
// 										$("#op_nestudio").val('');
// 										$("#op_respuesta").val('');
// 										$("#op_archivo").val('');
// 										$("#op_nomarchivo").val('');
// 										$("#res_operacion" + cunt + "").click(function () {
// 											$("#caja_rtaopera").show();
// 											var id_estudio = $(this).attr('data-id');
// 											var idtipo = $(this).attr('data-id2');
// 											var estudio = $(this).attr('data-id3');
// 											$("#op_estudio").val(estudio);
// 											$("#op_ntipo").val(idtipo);
// 											$("#op_nestudio").val(id_estudio);
// 										});

// 									});
// 								} else {
// 									//alert('Aun no ha empezado estudio de seguridad');
// 									iniciado = '<center><span class="text-danger mdi mdi-dot-circle icon">' +
// 										'</span></center>';
// 									$("#ini").html('' + iniciado + '');
// 									$("#cini").html('' + iniciado + '');
// 									$("#rini").html('' + iniciado + '');
// 									$("#sini").html('' + iniciado + '');
// 									$("#ruini").html('' + iniciado + '');
// 									$("#pini").html('' + iniciado + '');
// 									$("#proini").html('' + iniciado + '');
// 									$("#smini").html('' + iniciado + '');
// 									$("#siscini").html('' + iniciado + '');
// 									$("#aini").html('' + iniciado + '');
// 									$("#gini").html('' + iniciado + '');
// 									$("#preini").html('' + iniciado + '');
// 								}

// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								// alert('no trajo los tipos de estudio');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});
// 					});

// 					//rehabilitar estudio de seguridad rechazado para modificar
// 					$("#modifye" + cont + "").click(function () {
// 						var npreestudio = $(this).attr('data-id');
// 						var plak = $(this).attr('data-id2');
// 						var nestudio = $(this).attr('data-id3');
// 						var idcondu = $(this).attr('data-id4');
// 						var idvehi = $(this).attr('data-id5');
// 						var idtb = $(this).attr('data-id6');
// 						var obser = $(this).attr('data-id7');
// 						$("#pk").val(plak);
// 						$("#npree").val(npreestudio);
// 						$("#nestu").val(nestudio);
// 						$("#idcc").val(idcondu);
// 						$("#idvv").val(idvehi);
// 						$("#idtb").val(idtb);
// 						$("#obss").val(obser);
// 					});

// 					$("#modifye2" + cont + "").click(function () {
// 						var npreestudio = $(this).attr('data-id');
// 						var estado = $(this).attr('data-id2');
// 						var idestado = $(this).attr('data-id3');
// 						var plak = $(this).attr('data-id4');

// 						$("#pkk").val(plak);
// 						$("#nprees").val(npreestudio);//idpreestudio
// 						$("#pestado").val(estado);
// 						$("#idestado").val(idestado);
// 					});

// 					//boton validar creacion de datos
// 					$("#btn_secury" + cont + "").click(function () {
// 						$("#estudio_se").hide();
// 						//alert('validacion para continuar a estudio seguridad');
// 						var placa = $(this).attr('data-id4');
// 						var idprees = $(this).attr('data-id');
// 						var sol_preest = $(this).attr('data-id2');
// 						var propietario = $(this).attr('data-id5');
// 						var tenedor = $(this).attr('data-id6');
// 						var conductor = $(this).attr('data-id7');

// 						$("#prees").val(sol_preest);
// 						$("#plack").val(placa);
// 						$("#placa_es").val(placa);
// 						$(".placa_es").html(placa);
// 						$("#numplaca").val(placa);
// 						$("#popietario_es").val(propietario);
// 						$(".popietario_es").html(propietario);
// 						$("#tenedor_es").val(tenedor);
// 						$(".tenedor_es").html(tenedor);
// 						$("#conductor_es").val(conductor);
// 						$(".conductor_es").html(conductor);

// 						//validar placa
// 						var mensaje = '';
// 						var propi = '';
// 						var tene = '';
// 						var condu = '';
// 						var vincular = '';
// 						var fila = '';
// 						//VALIDAR VEHICULO
// 						$("#cuerpo_valida").html('');
// 						var vplaca = {
// 							placa: placa,
// 							action: 'valida_placa'
// 						};
// 						var hv_vehi2;
// 						$.ajax({
// 							url: url2,
// 							type: 'POST',
// 							data: vplaca,
// 							dataType: 'json',
// 							success: function (data) {
// 								if (data.result == null) {
// 									//no hay nada
// 									hv_vehi = '<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-truck" id="hv_vehiculono' + cont + '" onclick="carro(this);"  data-id="' + placa + '"   data-placement="top"  title="Hoja de vida del vehículo" onclick="hvvehiculo();"></button>';
// 									fila = '<tr><td>Vehículo</td><td>NO</td><td><p>No existe una hoja de vida vehícular creada con esta placa</p></td><td class="text-center">' + hv_vehi + '</td></tr>';
// 									$("#vehiculo").val(0);
// 								}
// 								if (data.result != null) {
// 									//alert('existe hoja de vida con esa placa');
// 									//var placa='ABC';
// 									hv_vehi2 = '<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-truck" id="hv_vehiculosi' + cont + '"  onclick="carro(this);"  data-id="' + placa + '"  data-placement="top"  title="Hoja de vida del vehículo"></button>';
// 									fila = '<tr><td>Vehículo</td><td>SI</td> <td><p>Existe una hoja de vida vehícular creada con esta placa</p></td><td class="text-center">' + hv_vehi2 + '</td></tr>';
// 									$("#vehiculo").val(1);
// 								}
// 								$("#cuerpo_valida").append(fila);
// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('no valida placa, error');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});


// 						//VALIDAR CONDUCTOR
// 						condu = {
// 							conductor: conductor,
// 							action: 'valida_condu'
// 						};
// 						$.ajax({
// 							url: url2,
// 							type: 'POST',
// 							data: condu,
// 							dataType: 'json',
// 							success: function (data) {
// 								if (data.result == null) {
// 									//no hay conductor creado
// 									hv_con = '<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-accounts-outline" id="hv_conduno' + cont + '" onclick="conductor(this);"   data-id="' + conductor + '"  data-placement="top"  title="Hoja de vida del conductor"></button>';
// 									fila = '<tr><td>Conductor</td><td>NO</td><td>NO existe un conductor creado con este documento</td><td class="text-center">' + hv_con + '</td></tr>';
// 									$("#conductor").val(0);
// 								}
// 								if (data.result != null) {
// 									//alert('existe conductor con ese numero');
// 									var hv_con2 = '<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-accounts-outline" id="hv_condusi' + cont + '" onclick="conductor(this);"  data-id="' + conductor + '"  data-placement="top"  title="Hoja de vida del conductor"></button>';
// 									fila = '<tr><td>Conductor</td><td>SI</td><td>Existe un conductor creado con este documento</td><td class="text-center">' + hv_con2 + '</td></tr>';
// 									$("#conductor").val(1);
// 								}
// 								$("#cuerpo_valida").append(fila);
// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('no valida conductor, error');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});

// 						//PROPIETARIO
// 						propi = {
// 							propietario: propietario,
// 							action: 'valida_propi'
// 						};
// 						$.ajax({
// 							url: url2,
// 							type: 'POST',
// 							data: propi,
// 							dataType: 'json',
// 							success: function (data) {
// 								if (data.result == null) {
// 									hv_pro = '<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-accounts-outline" id="hv_propi' + cont + '" onclick="propietario(this);" data-id="' + propietario + '"  data-placement="top"  title="Hoja de vida del propietario"></button>';
// 									fila = '<tr><td>Propietario</td><td>NO</td><td><p>NO existe un propietario creado con este documento</p></td><td class="text-center">' + hv_pro + '</td></tr>';
// 									$("#propietario").val(0);
// 								}
// 								if (data.result != null) {
// 									//alert('existe propietario creado con este documento');
// 									var hv_pro2 = '<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-accounts-outline" id="hv_propi' + cont + '" onclick="propietario(this);"  data-id="' + propietario + '"  data-placement="top"  title="Hoja de vida del propietario"></button>';
// 									fila = '<tr><td>Propietario</td><td>SI</td><td><p>Existe un propietario creado con este documento</p></td><td class="text-center">' + hv_pro2 + '</td></tr>';
// 									$("#propietario").val(1);
// 								}
// 								$("#cuerpo_valida").append(fila);
// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('no valida propietario, error');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});

// 						//TENEDOR
// 						tene = {
// 							tenedor: tenedor,
// 							action: 'valida_tenedor'
// 						};
// 						$.ajax({
// 							url: url2,
// 							type: 'POST',
// 							data: tene,
// 							dataType: 'json',
// 							success: function (data) {
// 								if (data.result == null) {
// 									hv_tene = '<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-accounts-outline" onclick="tenedor(this);" id="hv_tene' + cont + '"  data-id="' + tenedor + '"  data-placement="top"  title="Hoja de vida del tenedor"></button>';
// 									fila = '<tr><td>Tenedor</td><td>NO</td><td><p>NO existe un tenedor creado con este documento</p></td><td class="text-center">' + hv_tene + '</td></tr>';
// 									$("#tenedor").val(0);
// 								}
// 								if (data.result != null) {
// 									var hv_tene2 = '<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-accounts-outline" onclick="tenedor(this);" id="hv_tene' + cont + '"  data-id="' + tenedor + '"  data-placement="top"  title="Hoja de vida del tenedor"></button>';
// 									fila = '<tr><td>Tenedor</td><td>SI</td> <td><p>Existe un tenedor creado con este documento</p></td><td class="text-center">' + hv_tene2 + '</td></tr>';
// 									$("#tenedor").val(1);
// 								}
// 								$("#cuerpo_valida").append(fila);
// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('no valida tenedor,error');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});

// 						//VINCULAR
// 						var vincular = {
// 							placa: placa,
// 							propietario: propietario,
// 							conductor: conductor,
// 							tenedor: tenedor,
// 							action: 'vincular'
// 						};

// 						$.ajax({
// 							url: url2,
// 							type: 'POST',
// 							data: vincular,
// 							dataType: 'json',
// 							success: function (data) {

// 								if (data.result == null) {
// 									fila = '<tr><td>Vinculación</td><td>NO</td><td><p>La asociación de Propietario, tenedor y conductor con esta placa no existe</p></td><td></td></tr>';
// 									$("#vincula").val(0);
// 								}
// 								if (data.result != null) {
// 									fila = '<tr><td>Vinculación</td><td>SI</td><td><p>Los datos de Propietario, tenedor , y conductor asociados a la placa son correctos</p></td><td></td></tr>';
// 									$("#vincula").val(1);
// 								}
// 								$("#cuerpo_valida").append(fila);
// 							},
// 							error: function (jqXHR, textStatus, errorThrown) {
// 								console.log('no valida vinculacion,error');
// 								console.log(jqXHR);
// 								console.log(textStatus);
// 								console.log(errorThrown);
// 							}
// 						});
// 						valida();
// 					});
// 					//onchange de input files para editar documento prefiltro
// 				});
// 			},
// 			error: function (jqXHR, textStatus, errorThrown) {
// 				console.log('no sirvio');
// 				console.log(jqXHR);
// 				console.log(textStatus);
// 				console.log(errorThrown);
// 			}
// 		});
// 	}
// }


// function carro(element) {
// 	//alert('vehiculo');
// 	var elemento = $(element);
// 	var p = elemento.data("id");
// 	//?placa='"+p+"'
// 	var url = $("#id_url_ajax").val() + "solicitudes/vehiculos/?idmenu=3&placa=" + p + "&sw=1";
// 	window.open(url, '_blank');
// }

function conductor(element) {
	//alert('conductor ');
	var elemento = $(element);
	var con = elemento.data("id");
	//alert(con);
	var urlc = $("#id_url_ajax").val() +
		"solicitudes/proveedores/?idmenu=3&conductor=" + con + "";
	window.open(urlc, '_blank');

}

function tenedor(element) {
	//alert('tenedor');
	var elemento = $(element);
	var t = elemento.data("id");
	// alert(t);
	var urlt = $("#id_url_ajax").val() +
		"solicitudes/proveedores/?idmenu=3&tenedor=" + t + "";
	window.open(urlt, '_blank');

}

function propietario(element) {
	//alert('propietario');
	var elemento = $(element);
	var pro = elemento.data("id");
	//alert(pro);
	var urlp = $("#id_url_ajax").val() +
		"solicitudes/proveedores/?idmenu=3&propi=" + pro + " ";
	window.open(urlp, '_blank');

}


function valida() {
	var v = $("#vehiculo").val();
	var c = $("#conductor").val();
	var p = $("#propietario").val();
	var t = $("#tenedor").val();
	var vin = $("#vincula").val();
	//alert (v+c+pt,vin);
	if ((v == '1') && (c == '1') && (p == '1') && (t == '1') && (vin == '1')) {
		$("#estudio_se").show();
	}

}

// $("#validar_solicitud").click(function () {
// 	var v = $("#vehiculo").val();
// 	var c = $("#conductor").val();
// 	var p = $("#propietario").val();
// 	var t = $("#tenedor").val();
// 	var vin = $("#vincula").val();
// 	if ((v == '1') && (c == '1') && (p == '1') && (t == '1') && (vin == '1')) {
// 		$("#estudio_se").show();
// 	} else {
// 		alert('No puede solicitar estudio de seguridad');
// 	}

// });

function e_servi(valor, id) {
	var idservi = valor;
	var remove = {
		idservi: idservi,
		action: 'inactivasol_servicio'
	};
	$.ajax({
		url: url2,
		type: 'POST',
		data: remove,
		dataType: 'json',
		success: function (data) {
			alert('Ok!! Inactivo Solicitud de servicio Exitosamente!!');
			location.reload();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log('error no inactivo solicitud servicio');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}


function e(valor, id) {
	var id_refe = valor;
	var eliminar = {
		id_refe: id_refe,
		action: 'inactivar_referencia'
	};
	$.ajax({
		url: url2,
		type: 'POST',
		data: eliminar,
		dataType: 'json',
		success: function (data) {
			alert('Ok!! Inactivo Referencia Exitosamente!!');
			location.reload();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log('error no trajo filas');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}


//agregar mas referencias
$("#agregar_fila_edit").click(function () {
	agregas_mas();
});


var contmas = 0;
var cont_global2 = 0;
function agregas_mas() {
	// alert('masssss');
	contmas++;
	cont_global2 = cont_global2 + 1;
	var masreferencias = '<tr>' +
		'<tr style="text-align:left;color:white; background-color:#33b5e5;" "><th>Empresa</th><th>Fecha Ingreso</th><th>Fecha Retiro</th></tr>' +
		'<td><input type="text" id="empresa_m' + contmas + '" class="form-control" style="width:310px; height:14px; font-size:90%; margin-left:1px; "></td>' +
		'<td><input type="date" id="fingreso_m' + contmas + '" class="form-control" style="width:120px; height:14px; font-size:90%;"></td>' +
		'<td><input type="date" id="fretiro_m' + contmas + '" class="form-control" style="width:120px; height:14px; font-size:90%;"></td></tr>' +

		'<tr><th>Contacto</th><th>Teléfono</th><th>Cargo</th></tr>' +
		'<tr><td><input type="text" id="contacto_m' + contmas + '"  class="form-control" style="width:310px; height:14px; font-size:90%;"></td>' +
		'<td><input type="number" id="numero_m' + contmas + '" class="form-control" style="width:150px; height:14px; font-size:90%; "></td>' +
		'<td><input type="text" id="cargo_m' + contmas + '" class="form-control" style="width:150px; height:14px; font-size:90%; "></td>' +
		'</tr>';
	$("#masreferencia").append(masreferencias);
}

//Insertar referencias 
$("#aumento_referencia").click(function () {
	var urlm = $("#id_url_ajax").val() + "libs/preestudio_ajax.php";
	// alert('guardarreferencias');
	var solicitud = $("#num_preestudio").val();
	var data = null;
	data = new FormData();
	data.append("accion", 'insertar_mas_referencias');
	var i;
	for (i = 1; i <= cont_global2; i++) {
		var empresa = $("#empresa_m" + i + "").val();
		var ingrese = $("#fingreso_m" + i + "").val();
		var retiro = $("#fretiro_m" + i + "").val();
		var contacto = $("#contacto_m" + i + "").val();
		var numero = $("#numero_m" + i + "").val();
		var cargo = $("#cargo_m" + i + "").val();
		data.append("empresa", empresa);
		data.append("fingreso", ingrese);
		data.append("fretiro", retiro);
		data.append("contacto", contacto);
		data.append("telefono", numero);
		data.append("cargo", cargo);
		data.append("idpreestudio", solicitud);
		$.ajax({
			url: urlm,
			type: 'POST',
			data: data,
			cache: false,
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			dataType: 'json',
			success: function (data, textStatus, jqXHR) {
				// console.log('si inserto referencias');
				alert('Ok!! Registro Guardado Exitosamente!!');
				location.reload();
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log('no inserto referencias');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}
});


//actualizar solicitud tabla filtros
$("#actualizar_solicitud").click(function () {
	// alert(x);
	// alert('actualiza la solicitud');
	//validar campos obligatorios
	//traer datos
	var urle = $("#id_url_ajax").val() + "libs/preestudio_ajax.php";
	var id_solicitud;
	id_solicitud = $("#eid").val();
	var placa = $("#eplaca").val();
	var trailer = $("#etrailer").val();
	var preestudi = $("#econse").val();
	var fecha = $("#efecha").val();
	var hora = $("#ehora").val();
	var user = $("#euser").val();
	var propi = $("#epropi").val();
	var docup = $("#epdocumento").val();
	var tene = $("#etene").val();
	var docut = $("#etdocumento").val();
	var condu = $("#econdu").val();
	var docuc = $("#ecdocumento").val();
	var web = $("#eweb").val();
	var wuser = $("#ewuser").val();
	var claveweb = $("#ewclave").val();

	var data = null;
	data = new FormData();

	data.append("accion", 'update_solicitud');
	data.append("idsolicitud", id_solicitud);
	data.append("placa", placa);
	data.append("trailer", trailer);
	data.append("preestudi", preestudi);
	data.append("fecha", fecha);
	data.append("hora", hora);
	data.append("usuario", user);
	data.append("propi", propi);
	data.append("docu_propi", docup);
	data.append("tenedor", tene);
	data.append("docu_tenedor", docut);
	data.append("conductor", condu);
	data.append("docu_condu", docuc);
	data.append("web", web);
	data.append("user_web", wuser);
	data.append("user_clave", claveweb);
	data.append("s_cab", $("#s_cab").val());
	data.append("x", x);
	data.append("observacion_ope", y);
	data.append("s_docu", 10);
	$.ajax({
		url: urle,
		type: 'POST',
		data: data,
		cache: false,
		processData: false, // Don't process the files
		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		dataType: 'json',
		success: function (data, textStatus, jqXHR) {
			console.log('update vehiculo');
			// alert('Ok!! Registro Guardado Exitosamente!!');
			// location.reload(); 
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log('no update vehiculo');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});

	//actualizar referencias

	var ntotal_referencia = $("#s_total_refe").val();
	var m = 0;
	for (m = 1; m <= ntotal_referencia; m++) {
		var empresa = $("#empresa_a" + m + "").val();
		var ingreso = $("#ingreso_a" + m + "").val();
		var retiro = $("#retiro_a" + m + "").val();
		var contacto = $("#contacto_a" + m + "").val();
		var telefono = $("#numero_a" + m + "").val();
		var cargo = $("#cargo_a" + m + "").val();
		var id = $("#id_a" + m + "").val();
		data.append("empre", empresa);
		data.append("ingreso", ingreso);
		data.append("retiro", retiro);
		data.append("contacto", contacto);
		data.append("telefono", telefono);
		data.append("cargo", cargo);
		data.append("id", id);
		data.append("s_cab", $("#s_cab").val(5));
		data.append("s_ref", $("#s_ref").val());
		data.append("s_docu", 10);
		$.ajax({
			url: urle,
			type: 'POST',
			data: data,
			cache: false,
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			dataType: 'json',
			success: function (data, textStatus, jqXHR) {

				console.log('guardo referencias editar');
				// alert('Ok!! Solicitud Actualizada Exitosamente!!');
				// location.reload(); 

			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log('no guardo referencias editar');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}
	//actualizar documentos

	var d = $("#cant_docmentos").val();
	if (d > 0) {//existe documentos
		var i;
		for (i = 1; i <= d; i++) {
			var r = $("#r" + i + "").val();
			if (r != '') {
				var docu = document.getElementById('actu_file' + r + '').files;
				for (var a = 0; a < docu.length; a++) {
					data.append("papel" + a, docu[a]);
				}

				var ruta = $("#rutad" + r + "").val();//ruta todas las rutas
				var nd = $("#new_docu" + r + "").val();//nombre documento
				var idpres = $("#eid").val();//numero solicitud preestudio
				var iddocu = $("#iddo" + r + "").val();//id del documento

				data.append("r", r);
				data.append("name_documento", nd);
				data.append("soli_prees", idpres);
				data.append("id_docu", iddocu);
				data.append("rutad", ruta);
				data.append("s_cab", 10);
				data.append("s_ref", 10);
				data.append("s_docu", 8);


				$.ajax({
					url: urle,
					type: 'POST',
					data: data,
					cache: false,
					processData: false, // Don't process the files
					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {

						console.log('guardo referencias editar');
						// alert('Ok!! Solicitud Actualizada Exitosamente!!');
						// location.reload(); 

					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log('no guardo referencias editar');
						console.log(jqXHR);
						console.log(textStatus);
						console.log(errorThrown);
					}
				});
			}
		}
	}


	alert('Ok!! Solicitud Actualizada Exitosamente!!');
	location.reload();
});

//rehabilitar el estado:rechazado para modificar ESTUDIO SEGURIDAD
// $("#guarde_rehabil").click(function () {
// 	var urle = $("#id_url_ajax").val() + "libs/preestudio_ajax.php";
// 	var placa = $("#pk").val();
// 	var npree = $("#npree").val();
// 	var nestu = $("#nestu").val();
// 	var idco = $("#idcc").val();
// 	var idve = $("#idvv").val();
// 	var idtb = $("#idtb").val();

// 	data = new FormData();
// 	data.append("accion", 'reactivar_estudio');
// 	data.append("placa", placa);
// 	data.append("npree", npree);
// 	data.append("nestu", nestu);
// 	data.append("idco", idco);
// 	data.append("idve", idve);
// 	data.append("idtb", idtb)
// 	$.ajax({
// 		url: urle,
// 		type: 'POST',
// 		data: data,
// 		cache: false,
// 		processData: false, // Don't process the files
// 		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
// 		dataType: 'json',
// 		success: function (data, textStatus, jqXHR) {
// 			alert('Ok!! Registro Guardado Exitosamente!!');
// 			location.reload();
// 		},
// 		error: function (jqXHR, textStatus, errorThrown) {
// 			console.log('no update vehiculo');
// 			console.log(jqXHR);
// 			console.log(textStatus);
// 			console.log(errorThrown);
// 		}
// 	});
// });

//rehabilitar el estado pendiente en PREFILTRO
$("#guarde_rehabil2").click(function () {
	var urle = $("#id_url_ajax").val() + "libs/preestudio_ajax.php";
	var placa = $("#pkk").val();
	var npree = $("#nprees").val();
	var estado = $("#pestado").val();
	var idestado = $("#idestado").val();
	data = new FormData();
	data.append("accion", 'reactivar_estudio2');
	data.append("placa", placa);
	data.append("npree", npree);
	data.append("estado", estado);
	data.append("idestado", idestado);
	$.ajax({
		url: urle,
		type: 'POST',
		data: data,
		cache: false,
		processData: false, // Don't process the files
		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		dataType: 'json',
		success: function (data, textStatus, jqXHR) {

			alert('Ok!! Registro Guardado Exitosamente!!');
			$("#habilitar_pendientepre").modal('hide');
			solicitudes();

		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log('no update vehiculo');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
});