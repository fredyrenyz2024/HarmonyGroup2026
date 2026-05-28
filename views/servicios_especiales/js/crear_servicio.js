document.getElementById('exampleModal')
	.addEventListener('hidden.bs.modal', function () {

		const form = document.getElementById('form-create-servicio-especial');

		// Reset HTML form
		form.reset();

		// Limpiar selects dinámicos (si los llenas por AJAX)
		$('#tipo_servicio').val(null).trigger('change');
		$('#proveedor').val(null).trigger('change');
		// $('#idpareja').val(null).trigger('change');

		// Campos calculados
		$('#costo').val('');
		$('#calcula_costo').val('');
		$('#calcula_tarifa').val('');
		$('#rentabilidad').val('');
		$('#utilidad').val('');

		// Documento
		$('#numdoc_documento').val('');
	});


$("#busca_documento").click(function () {
	if (!$("#documento").val() && $("#num_documento").val() == '') {
		msg_error = "<p>Registrar <strong>los campos </strong> para realizar la búsqueda.</p>";
		$(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
		$(".panel-body").animate({ scrollTop: 0 }, 600);

	} else {
		Buscar_Dato();
	}
});

$("#guarda_servicio").click(function () {

	// Tomar valores
	let tipo = $("#tipo_servicio").val();
	let cant = $("#cantidad").val();
	let costo = $("#costo").val().replace(/,/g, "");
	let tarifa = $("#tari_unitaria").val().replace(/,/g, "");
	let costototal = $("#calcula_costo").val().replace(/,/g, "");
	let tarifatotal = $("#calcula_tarifa").val().replace(/,/g, "");
	let rentabi = $("#rentabilidad").val().replace(/,/g, "");
	let utilidad = $("#utilidad").val().replace(/,/g, "");
	// let conexion = $("#idpareja").val();
	let documento = $("#documento").val();
	let numdoc_documento = $("#num_documento").val();
	// let numdoc_documento_avansat = $("#numdoc_documento_avansat").val();

	// if (numdoc_documento_avansat === '') {
	// 	Swal.fire({
	// 		title: "¡Advertencia!",
	// 		text: "Numero documento avansat es requerido",
	// 		icon: "warning"
	// 	});
	// 	return; // ⛔ DETIENE TODO
	// }

	// -------------------------------
	// 1️⃣ CONFIRMAR ANTES DE GUARDAR
	// -------------------------------
	Swal.fire({
		title: "¿Está seguro?",
		text: "Va a registrar un nuevo servicio especial",
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Sí, guardar",
		cancelButtonText: "Cancelar"
	}).then((result) => {
		if (!result.isConfirmed) return;

		// =======================
		// 2️⃣ ENVIAR AJAX
		// =======================
		$.ajax({
			url: $("#base_url").val() + 'servicios_especiales/CrearServicio',
			method: "POST",
			data: {
				tipo: tipo,
				cant: cant,
				costo: costo,
				tarifa: tarifa,
				costototal: costototal,
				tarifatotal: tarifatotal,
				rentabi: rentabi,
				utilidad: utilidad,
				conexion: null,
				documento: documento,
				numdoc_documento: numdoc_documento,
				// numdoc_documento_avansat: numdoc_documento_avansat,
			},
			dataType: "json",

			success: function (data) {

				// -------------------------------
				// 3️⃣ RESPUESTA DEL SERVIDOR
				// -------------------------------
				if (data === true) {

					Swal.fire({
						title: "¡Registrado!",
						text: "El servicio especial fue guardado correctamente.",
						icon: "success",
						timer: 2000,
						showConfirmButton: false
					}).then(() => {
						location.reload(); // Recarga suave
					});

				} else {

					Swal.fire({
						title: "Error",
						text: "No se pudo registrar el servicio.",
						icon: "error"
					});
				}
			},

			error: function (jqXHR, textStatus, errorThrown) {
				console.log(jqXHR, textStatus, errorThrown);

				Swal.fire({
					title: "Error de servidor",
					text: "Hubo un problema en la conexión o el backend dio un error.",
					icon: "error"
				});
			}
		});
	});
});

function Buscar_Dato() {
	const tipodoc = $("#documento").val();
	const numdoc = $("#num_documento").val();
	$("#tabla_documento").html('');

	// mapa de clasificación según tipo doc
	const clasificacionMap = {
		"cot": 1,
		"ss": 2,
		"oc": 3,
		"rm": 4,
		"mnf": 5
	};

	$.ajax({
		url: `${$("#base_url").val()}servicios_especiales/ConsultaTabla`,
		method: "POST",
		data: { tipo_doc: tipodoc, numdoc: numdoc },
		dataType: "json",
		success: function (data) {
			if (data) {
				const clasificacion = clasificacionMap[tipodoc] || 0;

				const btn_crear = `
					<button id="crear${data.id}" 
							class="btn btn-secondary btn-sm me-1 px-1 py-0" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal"
							title="Crear Servicios"  data-documento="${data.id}"
							onClick="CrearServicio(${data.id}, ${clasificacion})">
							<i class="mdi mdi-plus"></i> Crear Servicio
					</button>`;

				const row = `
					<tr>
						<td>${data.id}</td>
						<td>${data.placa}</td>
						<td>${data.Poseedor}</td>
						<td>${data.Origen}</td>
						<td>${data.Destino}</td>
						<td>${data.Fecha_Expedicion}</td>
						<td>${data.estado}</td>
						<td>${btn_crear}&nbsp;${''}</td>
					</tr>`;

				$("#tabla_documento").append(row);
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown);
		}
	});
}

function CrearServicio(id, tipo) {
	// limpiar y cargar tipos de servicio
	$("#tipo_servicio").html('<option value="">Selecciona</option>');
	$.ajax({
		url: `${$("#base_url").val()}servicios_especiales/ConsultaTipoServicio`,
		method: "POST",
		data: {},
		dataType: "json",
		success: function (data) {
			if (data) {
				data.forEach(element => {
					$("#tipo_servicio").append(`
						<option value="${element.nombre}" data-id="${element.costo}" data-documento="${id}">
							${element.nombre}
						</option>
					`);
				});
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown);
		}
	});

	// 🔹 pareja origen/destino
	// if ([1, 2, 3, 4, 5].includes(tipo)) {
	// 	// limpiar select antes de llenarlo
	// 	$("#idpareja").empty().append('<option value="">Selecciona</option>');

	// 	$.ajax({
	// 		url: `${$("#base_url").val()}servicios_especiales/Consultapareja`,
	// 		method: "POST",
	// 		data: { numero: id, tipo: tipo },
	// 		dataType: "json",
	// 		success: function (data) {
	// 			if (data) {
	// 				data.forEach(element => {
	// 					$("#idpareja").append(`
	// 						<option value="${element.id}">
	// 							${element.id} - ${element.tipo_mercancia}
	// 						</option>
	// 					`);
	// 				});
	// 			}
	// 		},
	// 		error: function (jqXHR, textStatus, errorThrown) {
	// 			console.log(jqXHR, textStatus, errorThrown);
	// 		}
	// 	});
	// }

	//Numeor y tipo de documento
	$('#documento').on('change', function () {
		let texto = $("#documento option:selected").text();
		$("#nombre_documento").text(texto);
	});

	$("#numdoc_documento").val(id);
}

function VerServicio(tipodoc, numdoc, id) {
	$("#tb_consulta").html('');
	$.ajax({
		url: $("#base_url").val() + 'servicios_especiales/ConsultaTabla',
		method: "POST",
		data: {},
		dataType: "json",
		success: function (data) {

		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}

$("#tipo_servicio").change(function () {
	var valor = $("#tipo_servicio").val();
	var documento = $("#tipo_servicio option:selected").data("documento");
	var traer_costo = {
		servicio: valor,
	};

	$.ajax({
		// url: $('#base_url').val() + 'libs/servicio_cliente_ajax.php',
		url: $('#base_url').val() + 'serviciocliente/traer_costo',
		type: 'POST',
		data: traer_costo,
		dataType: 'json',
		success: function (data) {
			$('#proveedor').html(`<option value="">Seleccione</option>`);
			data.forEach(function (element) {
				$('#proveedor').append(
					`<option value="${element.proveedor_id}">${element.razon_social}</option>`
				);
			});

			// $('#proveedor').select2({
			// 	placeholder: 'Seleccione una opción',
			// 	allowClear: true
			// });
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		},
	});
});

$("#proveedor").change(function () {
	var valor = $("#proveedor").val();
	$.ajax({
		// url: $("#base_url").val() + 'servicios_especiales/Consultavalor',
		url: $("#base_url").val() + 'serviciocliente/traer_costo_proveedor',
		method: "POST",
		data: { proveedor: valor },
		dataType: "json",
		success: function (data) {
			if (data) {
				$("#costo").val(data.costo);
				calcular_valores(data.costo);
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
});

// $("#tari_unitaria").change(function () {
// var valor = $("#tipo_servicio").val();
// $.ajax({
// 	url: $("#base_url").val() + 'servicios_especiales/Consultavalor',
// 	method: "POST",
// 	data: { servicio: valor },
// 	dataType: "json",
// 	success: function (data) {
// 		if (data) {
// 			$("#costo").val(data.costo);
// 			calcular_valores(data.costo);
// 		}
// 	},
// 	error: function (jqXHR, textStatus, errorThrown) {
// 		console.log(jqXHR);
// 		console.log(textStatus);
// 		console.log(errorThrown);
// 	}
// });

// var valor = $("#proveedor").val();
// $.ajax({
// 	// url: $("#base_url").val() + 'servicios_especiales/Consultavalor',
// 	url: $("#base_url").val() + 'serviciocliente/traer_costo_proveedor',
// 	method: "POST",
// 	data: { proveedor: valor },
// 	dataType: "json",
// 	success: function (data) {
// 		if (data) {
// 			$("#costo").val(data.costo);
// 			calcular_valores(data.costo);
// 		}
// 	},
// 	error: function (jqXHR, textStatus, errorThrown) {
// 		console.log(jqXHR);
// 		console.log(textStatus);
// 		console.log(errorThrown);
// 	}
// });

// calcular_valores(data.costo);
// });

$("#tari_unitaria, #cantidad").on("change keyup", function () {
	const costo = parseFloat($("#costo").val()) || 0;
	const tarifa = parseFloat($("#tari_unitaria").val()) || 0;

	calcular_valores(costo, tarifa);
});

$("#cantidad").change(function () {
	var valor = $("#tipo_servicio").val();
	$.ajax({
		url: $("#base_url").val() + 'servicios_especiales/Consultavalor',
		method: "POST",
		data: { servicio: valor },
		dataType: "json",
		success: function (data) {
			if (data) {
				$("#costo").val(data.costo);
				calcular_valores(data.costo);
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
});

// function calcular_valores(costo) {
// 	let cantidad = $("#cantidad").val();
// 	let costototal = (parseFloat(costo) * parseFloat(cantidad));
// 	$("#calcula_costo").val(costototal);
// 	//tarifa
// 	let tarifau = $("#tari_unitaria").val();
// 	let taritotal = (parseFloat(tarifau) * parseFloat(cantidad));
// 	$("#calcula_tarifa").val(taritotal);
// 	//rentabilidad
// 	let rentabilidad = (parseFloat(costototal) - parseFloat(taritotal));
// 	$("#rentabilidad").val(rentabilidad);
// 	//utilidad
// 	let util1 = (((parseFloat(taritotal) - parseFloat(costototal)) / taritotal) * 100);
// 	utitot = util1.toFixed(2);
// 	$("#utilidad").val(utitot);

// 	$("#calcula_tarifa").val(parseFloat($("#calcula_tarifa").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
// 	$("#calcula_costo").val(parseFloat($("#calcula_costo").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
// 	$("#rentabilidad").val(parseFloat($("#rentabilidad").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
// 	$("#utilidad").val(parseFloat($("#utilidad").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
// }

function calcular_valores(costo) {
	let cantidad = parseFloat($("#cantidad").val()) || 0;
	let costounitario = parseFloat(costo) || 0;
	let tarifau = parseFloat($("#tari_unitaria").val()) || 0;

	// Calculos base
	let costototal = costounitario * cantidad;
	let taritotal = tarifau * cantidad;

	// Rentabilidad (Tarifa - Costo)
	let rentabilidad = taritotal - costototal;

	// Utilidad % respecto a la tarifa
	let utilidad = (taritotal > 0)
		? ((taritotal - costototal) / taritotal) * 100
		: 0;

	// Asignar valores con formato de miles
	$("#calcula_costo").val(formatNumber(costototal));
	$("#calcula_tarifa").val(formatNumber(taritotal));
	$("#rentabilidad").val(formatNumber(rentabilidad));
	$("#utilidad").val(utilidad.toFixed(2));
}

// Función para formatear con separador de miles
function formatNumber(num) {
	return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
