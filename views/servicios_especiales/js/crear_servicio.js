

$("#busca_documento").click(function(){
	if(!$("#documento").val() && $("#num_documento").val()==''){
		msg_error= "<p>Registrar <strong>los campos </strong> para realizar la búsqueda.</p>";
		$(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
		$(".panel-body").animate({ scrollTop: 0 }, 600);
		
	}else{
		Buscar_Dato();
	}
});


$("#guarda_servicio").click(function(){
	tipo=$("#tipo_servicio").val();
	cant=$("#cantidad").val();
	costo=$("#costo").val().replace(/,/g,"");
	tarifa=$("#tari_unitaria").val().replace(/,/g,"");
	costototal=$("#calcula_costo").val().replace(/,/g,"");
	tarifatotal=$("#calcula_tarifa").val().replace(/,/g,"");
	rentabi=$("#rentabilidad").val().replace(/,/g,"");
	utilidad=$("#utilidad").val().replace(/,/g,"");
	conexion=$("#idpareja").val();

	$.ajax({
		 url: $("#id_url_ajax").val()+'servicios_especiales/CrearServicio',
		 method: "POST",
		 data: {tipo:tipo,cant:cant,costo:costo,tarifa:tarifa,costototal:costototal,tarifatotal:tarifatotal,
		 	rentabi:rentabi,utilidad:utilidad,conexion:conexion},
		 dataType: "json",
		 success: function(data){
		 	if(data==true){
		 		var mensaje="Datos Registrados Exitosamente!!";
		 		$("#msg_tarifa_subasta").html('<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>¡</strong>' + mensaje + '</div></div>');
		 		$("#content_ver").animate({ scrollTop: 0 }, 600);

		 	}else if(data==false){
		 		var mensaje="Datos No Registrados";
		 		$("#msg_tarifa_subasta").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error</strong>' + mensaje + '</div></div>');
		 		$("#content_ver").animate({ scrollTop: 0 }, 600);
		 	}
		 	setTimeout(function() { location.reload(false); }, 2000);
		 },
		 error: function(jqXHR, textStatus, errorThrown){
		 	console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		 }
	});	
});


function Buscar_Dato(){
	var tipodoc=$("#documento").val();
	var numdoc=$("#num_documento").val();
	var clasificacion;
	$("#tabla_documento").html('');
	$.ajax({
		 url: $("#id_url_ajax").val()+'servicios_especiales/ConsultaTabla',
		 method: "POST",
		 data: {tipo_doc:tipodoc,numdoc:numdoc},
		 dataType: "json",
		 success: function(data){
		 	if(data){

		 		if(tipodoc=='cot'){
		 			clasificacion=1;
		 		}else if(tipodoc=='ss'){
		 			clasificacion=2;
		 		}else if(tipodoc=='oc'){
		 			clasificacion=3;
		 		}else if(tipodoc=='rm'){
		 			clasificacion=4;
		 		}else if(tipodoc=='mnf'){
		 			clasificacion=5;
		 		}

		 		var btn_crear='<button id="crear'+data.id+'" class="btn btn-space btn-secondary btn-sm mdi mdi-plus" data-toggle="modal" data-target="#crearmodal" title="Crear Servicios" onClick="CrearServicio('+data.id+','+clasificacion+')"></button>';
				var btn_ver='<button id="ver'+data.id+'" class="btn btn-space btn-secondary btn-sm mdi mdi-eye" data-toggle="modal" data-target="#vermodal" title=Ver Servicios" onClick="VerServicio('+data.id+')"></button>';
		 			
		 		$("#tabla_documento").append('<tr>'+
		 				'<td>'+data.id+'</td>'+
		 				'<td>'+data.estado+'</td>'+
		 				'<td>'+btn_crear+'&nbsp;'+
		 				'</td>'+
		 			'</tr>');

		 	}
		 },
		 error: function(jqXHR, textStatus, errorThrown){
		 	console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		 }
	});
}

function CrearServicio(id,tipo){
	$("#tipo_servicio").html('<option value="">Selecciona</option>');
	$.ajax({
		 url: $("#id_url_ajax").val()+'servicios_especiales/ConsultaTipoServicio',
		 method: "POST",
		 data: {},
		 dataType: "json",
		 success: function(data){
		 	if(data){
		 		data.forEach(function(element,index){
					$("#tipo_servicio").append('<option value="'+element.nombre+'" data-id="'+element.costo+'">'+element.nombre+'</option>');
		 		});
		 	}
		 },
		 error: function(jqXHR, textStatus, errorThrown){
		 	console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		 }
	});
	//pareja origen
	if(tipo==1){
		$.ajax({
		 url: $("#id_url_ajax").val()+'servicios_especiales/Consultapareja',
		 method: "POST",
		 data: {numero:id,tipo:tipo},
		 dataType: "json",
		 success: function(data){
		 	if(data){
		 		data.forEach(function(element,index){
		 			$("#idpareja").append('<option value="'+element.id+'">'+element.id+' '+element.tipo_mercancia+'</option>');
		 		});
		 	}
		 },
		 error: function(jqXHR, textStatus, errorThrown){
		 	console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		 }
		});
	}
	if(tipo==2){
		$.ajax({
		 url: $("#id_url_ajax").val()+'servicios_especiales/Consultapareja',
		 method: "POST",
		 data: {numero:id,tipo:tipo},
		 dataType: "json",
		 success: function(data){
		 	if(data){
		 		data.forEach(function(element,index){
		 			$("#idpareja").append('<option value="'+element.id+'">'+element.id+' '+element.tipo_mercancia+'</option>');
		 		});
		 	}
		 },
		 error: function(jqXHR, textStatus, errorThrown){
		 	console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		 }
		});
	}
	if(tipo==3){
		$.ajax({
		 url: $("#id_url_ajax").val()+'servicios_especiales/Consultapareja',
		 method: "POST",
		 data: {numero:id,tipo:tipo},
		 dataType: "json",
		 success: function(data){
		 	if(data){
		 		data.forEach(function(element,index){
		 			$("#idpareja").append('<option value="'+element.id+'">'+element.id+' '+element.tipo_mercancia+'</option>');
		 		});
		 	}
		 },
		 error: function(jqXHR, textStatus, errorThrown){
		 	console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		 }
		});
	}
	if(tipo==4){
		$.ajax({
		 url: $("#id_url_ajax").val()+'servicios_especiales/Consultapareja',
		 method: "POST",
		 data: {numero:id,tipo:tipo},
		 dataType: "json",
		 success: function(data){
		 	if(data){
		 		data.forEach(function(element,index){
		 			$("#idpareja").append('<option value="'+element.id+'">'+element.id+' '+element.tipo_mercancia+'</option>');
		 		});
		 	}
		 },
		 error: function(jqXHR, textStatus, errorThrown){
		 	console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		 }
		});
	}
	if(tipo==5){
		$.ajax({
		 url: $("#id_url_ajax").val()+'servicios_especiales/Consultapareja',
		 method: "POST",
		 data: {numero:id,tipo:tipo},
		 dataType: "json",
		 success: function(data){
		 	if(data){
		 		data.forEach(function(element,index){
		 			$("#idpareja").append('<option value="'+element.id+'">'+element.id+' '+element.tipo_mercancia+'</option>');
		 		});
		 	}
		 },
		 error: function(jqXHR, textStatus, errorThrown){
		 	console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		 }
		});
	}

}

function VerServicio(){
	$("#tb_consulta").html('');
	$.ajax({
		url: $("#id_url_ajax").val()+'servicios_especiales/ConsultaTabla',
		method: "POST",
		data: {},
		dataType: "json",
		success: function(data){
		},
		error: function(jqXHR, textStatus, errorThrown){
		 console.log(jqXHR);
		 console.log(textStatus);
		 console.log(errorThrown);
		}
	});	
}


$("#tipo_servicio").change(function(){
	var	valor=$("#tipo_servicio").val();
	$.ajax({
		 url: $("#id_url_ajax").val()+'servicios_especiales/Consultavalor',
		 method: "POST",
		 data: {servicio:valor},
		 dataType: "json",
		 success: function(data){
		 	if(data){
		 		$("#costo").val(data.costo);
		 		calcular_valores(data.costo);
		 	}
		 },
		 error: function(jqXHR, textStatus, errorThrown){
		 	console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		 }
	});
});	

$("#tari_unitaria").change(function(){
	var	valor=$("#tipo_servicio").val();
	$.ajax({
		 url: $("#id_url_ajax").val()+'servicios_especiales/Consultavalor',
		 method: "POST",
		 data: {servicio:valor},
		 dataType: "json",
		 success: function(data){
		 	if(data){
		 		$("#costo").val(data.costo);
		 		calcular_valores(data.costo);
		 	}
		 },
		 error: function(jqXHR, textStatus, errorThrown){
		 	console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		 }
	});
});

$("#cantidad").change(function(){
	var	valor=$("#tipo_servicio").val();
	$.ajax({
		 url: $("#id_url_ajax").val()+'servicios_especiales/Consultavalor',
		 method: "POST",
		 data: {servicio:valor},
		 dataType: "json",
		 success: function(data){
		 	if(data){
		 		$("#costo").val(data.costo);
		 		calcular_valores(data.costo);
		 	}
		 },
		 error: function(jqXHR, textStatus, errorThrown){
		 	console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		 }
	});
});


function calcular_valores(costo){
	let cantidad=$("#cantidad").val();
	let costototal=(parseFloat(costo)*parseFloat(cantidad));
	$("#calcula_costo").val(costototal);
	//tarifa
	let tarifau=$("#tari_unitaria").val();
	let taritotal=(parseFloat(tarifau)*parseFloat(cantidad));
	$("#calcula_tarifa").val(taritotal);
	//rentabilidad
	let rentabilidad=(parseFloat(costototal)-parseFloat(taritotal));
	$("#rentabilidad").val(rentabilidad);
	//utilidad
	let util1=(((parseFloat(taritotal)- parseFloat(costototal))/taritotal)*100);
	utitot=util1.toFixed(2);
	$("#utilidad").val(utitot);

	$("#calcula_tarifa").val(parseFloat($("#calcula_tarifa").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
	$("#calcula_costo").val(parseFloat($("#calcula_costo").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
	$("#rentabilidad").val(parseFloat($("#rentabilidad").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
	$("#utilidad").val(parseFloat($("#utilidad").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
}