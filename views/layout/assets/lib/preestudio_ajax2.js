$(document).ready(function() {	
	// $("#btn_crea").click

// $("#a2").prop('disabled', 'disabled');

$("#diveditardatos").hide();
$("#edite_carro").hide();
$("#registre_carro").hide();
$("#edite_carro").hide();
$("#divdatos").hide();
$("#crear").hide();
$("#solicitud").hide();
$("#crear_preestudio").hide();
$("#crear_preestudio2").hide();
});	
var url =$("#id_url_ajax").val() + "libs/preestudio_ajax.php";
var url2 =$("#id_url_ajax").val() + "libs/preestudio2_ajax.php";


function consultar_placa(){
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
			$("#placag").val(placa);
			$("#registre_carro").show();

			$("#sms").html('<p>No existe un Vehiculo con esta Placa</p>');
			$("#crear_preestudio").show();
			$("#crear_preestudio2").hide();
			//poner radio button de vehiculo nuevo seleccionado
			$("#rad1").prop("disabled", false);
			$("#rad2").prop('disabled', true );
			$("#rad3").prop('disabled', true);
			$("#rad1").prop("checked", true);
			$("#rad2").prop("checked", false);
			$("#rad3").prop("checked", false);
			
		}else if(data.result2!=null){
			console.log('si hay vehiculo ');
			//insert en preestudio y update cmx_vehiculo
			$("#rad8").prop("disabled", true);
			$("#rad9").prop('disabled', true );
			$("#rad6").prop('disabled', false);
			$("#rad8").prop("checked", false);
			$("#rad9").prop("checked", false);
			$("#rad6").prop("checked", true);
			$("#placag").val(placa);
			$("#web").val(data.result2[0].web_satelital);
			$("#user").val(data.result2[0].usuario_satelital);
			$("#clave").val(data.result2[0].clave_satelital);
			$("#nompro").val(data.result2[0].nombre_propietario);
			$("#docupro").val(data.result2[0].documento_propietario);
			$("#nomtene").val(data.result2[0].nombre_tenedor);
			$("#docutene").val(data.result2[0].documento_tenedor);
			$("#nomcondu").val(data.result2[0].nombre_conductor);	
			$("#docucondu").val(data.result2[0].documento_conductor);
			// insert_preestudioupdatecarro();
			$("#registre_carro").show();


			$("#crear_preestudio2").hide();
			$("#crear_preestudio").show();

		}
		if(data.result==null){
		console.log('is null');
		//existen datos de preestudio-solicitud
		}else if(data.result!=null){//existe una solicitud
			console.log('no es nulo');
			console.log(data);
			$("#rad8").prop("disabled", true);
			$("#rad9").prop('disabled', true );
			$("#rad6").prop('disabled', false);
			$("#rad8").prop("checked", false);
			$("#rad9").prop("checked", false);
			$("#rad6").prop("checked", true);
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
				//vehiculo nuevo refrencias y solictud 


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
				if(data.result[0].estado=='pendiente'  && data.result[0].estado_actual==='1'){
					console.log('pendiente');
					//actualizar solicitud anterior
					$("#crear").hide();//acordeon crear 
					$("#new_sol").hide();//acordeon nueva solicitud
					 $("#scliente").val(data.result[0].cliente);
				 	$("#sconsecutivo").val(data.result[0].idsolu);
				 	$("#sobserve").val(data.result[0].observacion);
				}

			if(data.result[0].estado=='aprobado'  || data.result[0].estado=='rechazado' || data.result[0].estado=='cancelado' && data.result[0].estado_actual==='1'){
				console.log('aprobado , rechazado, cancelado');
				//solicitud nueva, update vehiculopreestudio anterior
				$("#update_sol").hide();
				$("#btn_editarpreestudio").hide();
				$("#new_sol").show();
				$("#scliente_new").val(data.result[0].cliente);
				$("#sconsecutivo_antes").val(data.result[0].idsolu);
				$("#crear").show();
			}

			if(data.result[0].estado=='iniciado' && data.result[0].estado_actual==='1'){
				//desaparecer todo y mostrar mensaje
				$("#diveditardatos").hide();
				$("#crear").hide();//acordeon crear 
				$("#new_sol").hide();//acordeon nueva solicitud
				$("#update_sol").hide();
				$("#btn_editarpreestudio").hide();
				$("#mensaje_inciado").show();
				$("#mensaje_inciado").html('<p class="text-center text-primary"><strong>NO PUEDE ACTUALIZAR PORQUE ESTA SOLICITUD YA ESTA INICIADA POR SEGURIDAD</strong></p>');

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
}

//crear cabecera
$("#btn_cab").click(function(){
	alert('cabecera');
	//validar la cabecera
	var msg_error='';

	if(!$("#placag").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#web").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Web satélital</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#user_satelite").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>usuario</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#clave").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Clave</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#nompro").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Nombre de Propietario</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#docupro").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Documento de Propietario</strong> para poder crear el vehículo.</p>";

	}
	if(!$("#nomtene").val()){
	msg_error+= "<p>Debe diligenciar el campo <strong>Nombre de Tenedor</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#docutene").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Documento de Tenedor</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#nomcondu").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Nombre de Conductor</strong> para poder crear el vehículo.</p>";

	}
	if(!$("#docucondu").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Documento de Conductor</strong> para poder crear el vehículo.</p>";
	}
	
	if(!msg_error){
		alert('insertar solo cabecera');
		crear_cabecera();

	}else{
		$("#nexos_messages_popup").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
		$("#crea_vehiculopreestudio").animate({ scrollTop: 0 }, 600);
	}

});



//cerrar modal creacion de solicitud (+)
$("#crea_vehiculopreestudio").on('hidden.bs.modal', function() {
	location.reload();
});

//agregar referencias para crear solicitud
$("#agregar_fila").click(function(){
// 	if($("#valor_vehiculo").val()==''){
	agregar();
});


$("#btn_editarpreestudio").click(function(){
	//update preestudio, solicitud y estados
	update_todo();
});


var cont=0;
var contador_global1=0;
function agregar(){
 cont++;
 contador_global1=contador_global1+1;
 var referencias='<tr id="tr'+cont+'">'+
 	'<tr style="text-align:left; color:white; background-color:#33b5e5; height:20px; "><th>Empresa</th><th>Fecha Ingreso</th><th>Fecha Retiro</th></tr>'+
	'<td><input type="text" id="empresa'+cont+'" class="form-control" style="width:310px; height:14px; font-size:90%; margin-left:1px; "></td>'+
	'<td><input type="date" id="fingreso'+cont+'" class="form-control" style=" height:14px; font-size:90%;"></td>'+
	'<td><input type="date" id="fretiro'+cont+'" class="form-control" style=" height:14px; font-size:90%;"></td></tr>'+
	
	'<tr><th>Contacto</th><th>Teléfono</th><th>Cargo</th></tr>'+
	'<tr><td><input type="text" id="contacto'+cont+'"  class="form-control" style="width:310px; height:14px; font-size:90%;"></td>'+
	'<td><input type="number" id="numero'+cont+'" class="form-control" style="width:169px; height:14px; font-size:90%; "></td>'+
	'<td><input type="text" id="cargo'+cont+'" class="form-control" style="width:169px; height:14px; font-size:90%; "></td>'+
	'</tr>  <tr style="width:10px;background-color:blue;margin-top:2px;"><div></div></tr>';
 	$("#table_mercancia").append(referencias);
}


$("#registre_carro").click(function(){
	$("#divdatos").show();
	$("#a2").hide();
	$("#s3").hide();
});

//CREAR CABAECERA-- solo vehiculo
function crear_cabecera(){

		var data = null;
		data = new FormData();
		data.append("accion", 'insertar_cabecera');
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
		data.append("tipologiaactualice",  $("#actualice").val());
		data.append("fecha",  $("#fpree").val());
		data.append("hora", $("#hpree").val());
		data.append("usuario", $("#userpree").val());
		
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
			success: function (data, textStatus, jqXHR)
			{
				console.log('si inserto preestudio CABECERA solo');
				// alert('Ok!! Datos Registrados Exitosamente!!');
				// location.reload(); 
				//consultar id 

			



			},
			error: function (jqXHR, textStatus, errorThrown)
			{
				console.log('no inserto preestudio CABECERA solo');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});	

}

//FIN DE CABECERA
var contt=0;
 $("#crear_preestudio").click(function(){
	//guardar referencias
	var msg_error='';

	if(!$("#placag").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#web").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Web satélital</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#user_satelite").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>usuario</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#clave").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Clave</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#nompro").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Nombre de Propietario</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#docupro").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Documento de Propietario</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#nomtene").val()){
	msg_error+= "<p>Debe diligenciar el campo <strong>Nombre de Tenedor</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#docutene").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Documento de Tenedor</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#nomcondu").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Nombre de Conductor</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#docucondu").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Documento de Conductor</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#nombre_cliente").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Nombre del Cliente</strong> para poder crear el vehículo.</p>";
	}
	if(!$("#obserpree").val()){
		msg_error+= "<p>Debe diligenciar el campo <strong>Observaciones </strong> para poder crear el vehículo.</p>";
	}
	var m=0;
	for(m=1; m<=contador_global1; m++){
		var empresa=$("#empresa"+m+"").val();
		var ingreso=$("#fingreso"+m+"").val();
		var retiro=$("#fretiro"+m+"").val();
		var contacto=$("#contacto"+m+"").val();
		var numero=$("#numero"+m+"").val();
		var cargo=$("#cargo"+m+"").val();
		if(!empresa){
			msg_error+= "<p>Debe diligenciar el campo <strong>Empresa</strong> para poder crear la referencia.</p>";
		}
		if(!ingreso){
			msg_error+= "<p>Debe diligenciar el campo <strong>Fecha de Ingreso</strong> para poder crear la referencia.</p>";
		}
		if(!retiro){
			msg_error+= "<p>Debe diligenciar el campo <strong>Fecha de Retiro</strong> para poder crear la referencia.</p>";

		}
		if(!contacto){
			msg_error+= "<p>Debe diligenciar el campo <strong>Contacto</strong> para poder crear la referencia.</p>";

		}
		if(!numero){
			msg_error+= "<p>Debe diligenciar el campo <strong>Teléfono</strong> para poder crear la referencia.</p>";

		}
		if(!cargo){
			msg_error+= "<p>Debe diligenciar el campo <strong>Cargo</strong> para poder crear la referencia.</p>";
		}
		if(contador_global1<3){
			msg_error+= "<p>Debe diligenciar mínimo <strong>tres referencias laborales</strong> para poder crear la referencia.</p>";
		}
	}
	if(!msg_error){
		 // alert('ok todo los campos llenos');
		 alert('entro a todos campos llenos');
		var data = null;
		data = new FormData();
		data.append("accion", 'insertar_preestudio_solo');
		data.append("cliente",$("#nombre_cliente").val());
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
		data.append("tipologiaactualice",  $("#actualice").val());
		data.append("fecha",  $("#fpree").val());
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
			success: function (data, textStatus, jqXHR)
			{
				console.log('si inserto preestudio CABECERA solo');
				// alert('!!Registro Vehiculo exitosamente!!!');
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
				console.log('no inserto preestudio CABECERA solo');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});	

		var i=0;
		for(i=1; i<=contador_global1; i++){
			var empresa=$("#empresa"+i+"").val();
			var ingreso=$("#fingreso"+i+"").val();
			var retiro=$("#fretiro"+i+"").val();
			var contacto=$("#contacto"+i+"").val();
			var numero=$("#numero"+i+"").val();
			var cargo=$("#cargo"+i+"").val();
			var ref=$("#ref").val();
			// alert(ref);
			
			data.append("empre",empresa);
			data.append("ingreso",ingreso);
			data.append("retiro",retiro);
			data.append("persona",contacto);
			data.append("num", numero);
			data.append("cargo",cargo);
			data.append("cab", $("#cab").val(5));
			data.append("ref", ref);
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

						console.log('inserto preestudio REFERENCIA solo');

					},
					error: function (jqXHR, textStatus, errorThrown)
					{
						console.log('no inserto preestudio REFERENCIA solo');
						console.log(jqXHR);
						console.log(textStatus);
						console.log(errorThrown);
					}
			});
		}
		// alert('Ok!! Datos Registrados Exitosamente!!');
		// location.reload(); 

	}else{
		$("#nexos_messages_popup").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
		$("#crea_vehiculopreestudio").animate({ scrollTop: 0 }, 600);
	}

});

function insert_vehiculo(){
	var data = null;
	data = new FormData();
	data.append("accion", 'insertar_preestudio_solo');
	data.append("cliente",$("#nombre_cliente").val());
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
	data.append("tipologiaactualice",  $("#actualice").val());
	data.append("fecha",  $("#fpree").val());
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
		success: function (data, textStatus, jqXHR)
		{
			console.log('si inserto preestudio CABECERA solo');
			// alert('!!Registro Vehiculo exitosamente!!!');
		},
		error: function (jqXHR, textStatus, errorThrown)
		{
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


function update_todo(){
	var urlu =$("#id_url_ajax").val() + "libs/preestudio_ajax.php";
	// alert('actualizar todo');
	var id_preestudio=$("#e_consecutivo").val();
	var placa=$("#e_placa").val();
	var trailer=$("#e_trailer").val();
	var web=$("#e_web").val();
	var usuerweb=$("#e_usuario").val();
	var clave=$("#e_clave").val();
	var propi=$("#e_propietario").val();
	var num_propi=$("#e_numpro").val();
	var tene=$("#e_tenedor").val();
	var num_tene=$("#e_numtene").val();
	var condu=$("#e_conductor").val();
	var num_condu=$("#e_numcondu").val();
	// //datos de la solictud a actualizar
	var id_solicitud=$("#sconsecutivo").val();
	var cliente=$("#scliente").val();
	var fecha=$("#sfecha").val();
	var hora=$("#shora").val();
	var usuario=$("#suser").val();
	var observacion=$("#sobserve").val();
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
	data.append("num_propi",num_propi);
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
		success: function (data, textStatus, jqXHR)
		{
			console.log(' solicitud update');
			// alert('Ok!! Solicitud Actualizada Exitosamente!!');
			// location.reload(); 
		},
		error: function (jqXHR, textStatus, errorThrown)
		{
			console.log('solicitud update');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});

	//referencias
	var total_edicion=$("#total_edicion").val();
	var i=0;
	for (i=1; i<=total_edicion; i++){
		var e_empresa=$("#eempresa"+i+"").val();
		var e_ingreso=$("#efingreso"+i+"").val();
		var e_retiro=$("#efretiro"+i+"").val();
		var e_contacto=$("#econtacto"+i+"").val();
		var e_telefono=$("#enumero"+i+"").val();
		var e_crgo=$("#ecargo"+i+"").val();
		var e_id=$("#eid"+i+"").val();
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
				success: function (data, textStatus, jqXHR)
				{

					console.log('guardo referencias editar');
				// alert('Ok!! Solicitud Actualizada Exitosamente!!');
				// location.reload(); 

				},
				error: function (jqXHR, textStatus, errorThrown)
				{
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
$("#crear").click(function(){
	var url =$("#id_url_ajax").val() + "libs/preestudio_ajax.php";
	alert('Bienvenido a crear solicitud');
	alert('validar si la solicitud ya esta creada');
	//traer datos del vehiculo
	var id_preestudio=$("#e_consecutivo").val();
	var placa=$("#e_placa").val();
	var trailer=$("#e_trailer").val();
	var web=$("#e_web").val();
	var usuerweb=$("#e_usuario").val();
	var clave=$("#e_clave").val();
	var propi=$("#e_propietario").val();
	var num_propi=$("#e_numpro").val();
	var tene=$("#e_tenedor").val();
	var num_tene=$("#e_numtene").val();
	var condu=$("#e_conductor").val();
	var num_condu=$("#e_numcondu").val();
	 //datos de la solicitud
	var cliente,solicitud_anterior,fecha,hora,user_new,observacion_new;
	clientenew=$("#scliente_new").val();
	solicitud_anterior=$("#sconsecutivo_antes").val();
	fechanew=$("#fecha_new").val();
	horanew=$("#hora_new").val();
	user_new=$("#user_new").val();
	observacion_new=$("#observacion_new").val();
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
	 data.append("clientenew", clientenew);
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
			success: function (data, textStatus, jqXHR)
			{
				console.log('inserto solicitud nueva');
				// alert('Ok!! Registro Guardado Exitosamente!!');
				// 	location.reload(); 
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
				console.log('no inserto solicitud nueva');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
	});
	//actualizar referencias

	var i;
	var total_refe=$("#total_edicion").val();

	for (i=1; i<=total_refe;  i++) {
		var eempresa=$("#eempresa"+i+"").val();
		var efingreso=$("#efingreso"+i+"").val();
		var efretiro=$("#efretiro"+i+"").val();
		var econtacto=$("#econtacto"+i+"").val();
		var enumero=$("#enumero"+i+"").val();
		var ecargo=$("#ecargo"+i+"").val();
		var eid=$("#eid"+i+"").val();
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
				success: function (data, textStatus, jqXHR)
				{
					console.log('update referencias, soli new');
				},
				error: function (jqXHR, textStatus, errorThrown)
				{
					console.log('no update referencias, soli new');
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

//consultar la tabla filtros
function solicitudes(){
	var tipo,fi,ff,datos;
		tipo=$("#cotice").val();
		fi=$("#fecha_inicial").val();
		ff=$("#fecha_final").val();
		// alert(tipo);
		// alert(fi);
		// alert(ff);
	if(tipo=='' || fi=='' || ff==''){
		alert('Por favor ingrese información en cada campo');
	}else{
		//continuar
		if(tipo=='t'){
			tip='t';
		}else{
			tip=tipo;
		}
		datos={
			tipo:tip,
			fini:fi,
			ffin:ff,
			action:'consulte_solicitud'
		};
		$("#body_esconder").html('');
		$.ajax({
			url:url2,
			type:'POST',
			data:datos,
			dataType:'json',
			success:function(data){
			console.log('sisirvio');
			console.log(data);
			cuente=0;
	 		cont=0;
	 		data.result.forEach(function(element,index){
	 			cuente++;
	 			cont++;
	 			var consecutivo=element.id_preestudio;//idpreestudio
	 			var solicitud=element.esoli;//solicitud
	 			var placa=element.placa;
	 			var fecha=element.fecha;
	 			var estado=element.estado;
	 			var estado_actual=element.estado_actual;
	 			var boton_ver='';
	 			// boton_ver='<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-eye" id="btn_ver'+cont+'" data-toggle="modal" data-target="#versolicitud"  data-id="'+consecutivo+'" data-id2="'+solicitud+'"></button>';
	 			var boton_edite='';
	 			var mas_referencia='';
	 			var btnrespuesta_seguridad='';
	 			var icono='';
	 			var btn_status='';
	 			btn_status='<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-balance"    id="btn_trazo'+cont+'"   data-toggle="modal" data-target="#vertrazo"  data-id="'+consecutivo+'" data-id2="'+solicitud+'" data-id3="'+estado+'"></button>';
	 
	 			if(element.estado=='aprobado' || element.estado=='iniciado' || element.estado=='rechazado' || element.estado=='cancelado' && element.estado_actual=='1'){
	 				boton_edite='<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-edit" data-toggle="tooltip"  data-placement="top" title="No puede Actualizar porque esta solicitud  ya esta '+  element.estado  +'por seguridad."></button>';
	 				boton_ver='<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-eye" id="btn_ver'+cont+'" data-toggle="modal" data-target="#versolicitud"  data-id="'+consecutivo+'" data-id2="'+solicitud+'" data-id3="'+estado+'"></button>';
	 				btnrespuesta_seguridad='<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-key" id="btn_res_seguridad'+cont+'" data-toggle="modal" data-target="#respuesta_seguridad"  data-id="'+placa+'"  data-id2="'+solicitud+'"  ></button>';
	 			}else if(element.estado=='pendiente' && element.estado_actual==='1' ){
	 				boton_edite='<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-edit" id="btn_edite'+cont+'" data-toggle="modal" data-target="#editesolicitud"  data-id="'+consecutivo+'" data-id2="'+solicitud+'" data-id3="'+estado+'"></button>';
	 				boton_ver='<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-eye" id="btn_ver'+cont+'" data-toggle="modal" data-target="#versolicitud"  data-id="'+consecutivo+'" data-id2="'+solicitud+'" data-id3="'+estado+'"></button>';
	 				mas_referencia='<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-file-plus" id="btn_refe'+cont+'" data-toggle="modal" data-target="#mas_referencias"  data-id="'+consecutivo+'" data-id2="'+solicitud+'"></button>';
	 				if(element.area=='seguridad'){
	 					btnrespuesta_seguridad='<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-key" id="btn_res_seguridad'+cont+'" data-toggle="modal" data-target="#respuesta_seguridad"  data-id="'+placa+'"  data-id2="'+solicitud+'"  ></button>';
	 				}
	 			}
	 			//estados

	 			$col_status='';
	 			if(element.estado=='aprobado'){
	 				$_col_status=
					'<td class="text-success" >'+
						'<center>'+
						'<span class="mdi mdi-dot-circle icon"></span>'+
						'</center>'+
					'</td>';
	 			}

	 			if(element.estado=='pendiente'){
	 				$_col_status=
					'<td class="text" style="color:blue;" >'+
						'<center>'+
						'<span class="mdi mdi-dot-circle icon"></span>'+
						'</center>'+
					'</td>';
	 			}

	 			if(element.estado=='iniciado'){
	 				$_col_status=
					'<td class="text" style="color:yellow;" >'+
						'<center>'+
						'<span class="mdi mdi-dot-circle icon"></span>'+
						'</center>'+
					'</td>';
	 			}

	 			if(element.estado=='rechazado'){
	 				$_col_status=
					'<td class="text" style="color:red;" >'+
						'<center>'+
						'<span class="mdi mdi-dot-circle icon"></span>'+
						'</center>'+
					'</td>';
	 			}

	 			if(element.estado=='cancelado'){
	 				$_col_status=
					'<td class="text" style="color:orange;" >'+
						'<center>'+
						'<span class="mdi mdi-dot-circle icon"></span>'+
						'</center>'+
					'</td>';
	 			}

	 			$("#body_esconder").append(
	 			'<tr>'+$_col_status+
	 			'<td>'+element.esoli+'</td>'+
	 			'<td>'+element.cliente+'</td>'+
	 			'<td>'+element.fecha+'</td>'+
	 			'<td>'+element.placa+'</td>'+
	 			'<td>'+element.estado+'</td>'+
	 			'<td>'+boton_ver+'&nbsp;&nbsp;'+boton_edite+'&nbsp;'
	 			+mas_referencia+'&nbsp;&nbsp;'+btnrespuesta_seguridad+'&nbsp;&nbsp;'+btn_status+'</td>'+
	 				'</tr>');
	 			//boton ver
	 			$("#btn_ver"+cont+"").click(function(){
	 				// alert('hola ver');
	 				var id=$(this).attr('data-id');
	 				var id2=$(this).attr('data-id2');
	 				var estado=$(this).attr('data-id3');
	 				$("#estado_ver").html('Estado: '+estado);
	 				// alert(id);
	 				var dato={
	 					consecutivo:id,
	 					solicitud:id2,
	 					action:'vsolicitud_preestudio'
	 				};
	 				$("#consulta_referencia").html('');
	 				$.ajax({
	 				 	url:url2,
	 				 	type:'POST',
	 				 	data:dato,
	 				 	dataType:'json',
	 				 	success: function(data){
	 				 		console.log('si se puede ver');
	 				 		console.log(data);
	 				 		if(data.result){
	 				 		$("#vid").val(data.result[0].id);
	 				 		$("#vplaca").val(data.result[0].placa);
	 				 		$("#vconse").val(data.result[0].id_preestudio);
	 				 		$("#vfecha").val(data.result[0].fecha);
	 				 		$("#vhora").val(data.result[0].hora);
	 				 		$("#vuser").val(data.result[0].usuario);
	 				 		$("#vcliente").val(data.result[0].cliente);
	 				 		$("#vpropi").val(data.result[0].nombre_propietario);
	 				 		$("#vpdocumento").val(data.result[0].documento_propietario);
	 				 		$("#vtene").val(data.result[0].nombre_tenedor);
	 				 		$("#vtdocumento").val(data.result[0].documento_tenedor);
	 				 		$("#vcondu").val(data.result[0].nombre_conductor);
	 				 		$("#vcdocumento").val(data.result[0].documento_conductor);
	 				 		$("#vweb").val(data.result[0].web_satelital);
	 				 		$("#vwuser").val(data.result[0].usuario_satelital);
							$("#vwclave").val(data.result[0].clave_satelital);
	 				 		}

	 				 		if(data.result2){
	 				 			data.result2.forEach(function(element,index){
	 				 				$("#consulta_referencia").append('<tr>'+
	 				 					'<td>'+element.nombre_empresa+'</td>'+
	 				 					'<td>'+element.fecha_ingreso+'</td>'+
	 				 					'<td>'+element.fecha_retiro+'</td>'+
	 				 					'<td>'+element.persona_contacto+'</td>'+
	 				 					'<td>'+element.celular+'</td>'+
	 				 					'<td>'+element.cargo+'</td>'+
	 				 					'</tr>');
	 				 			});
	 				 		}
	 				
	 				 	},
	 				 	error: function(jqXHR, textStatus, errorThrown){
	 				 		console.log('no error');	
	 				 		console.log(jqXHR);
                      		console.log(textStatus);
                      		console.log(errorThrown);
	 				 	}
	 				 });

	 			});//cierre del click function
	 			//boton traer los datos al editar
	 			$("#btn_edite"+cont+"").click(function(){
	 				// alert('hola edicion');
	 				var id=$(this).attr('data-id');
	 				var id2=$(this).attr('data-id2');
	 				var estado=$(this).attr('data-id3');
	 				$("#estado_edi").html('Estado: '+estado);
	 				// alert(id);
	 				var dato={
	 					consecutivo:id,
	 					solicitud:id2,
	 					action:'esolicitud_preestudio'
	 				};
	 				$("#editar_table_actual").html('');
	 					$.ajax({
	 				 	url:url2,
	 				 	type:'POST',
	 				 	data:dato,
	 				 	dataType:'json',
	 				 	success: function(data){
	 				 		console.log('si se puede ver');
	 				 		console.log(data);
	 				 		if(data.result){
	 				 		$("#eid").val(data.result[0].id);//
	 				 		$("#eplaca").val(data.result[0].placa);
	 				 		$("#etrailer").val(data.result[0].placa_trailer);
	 				 		$("#econse").val(data.result[0].id_preestudio);//
	 				 		$("#efecha").val(data.result[0].fecha);
	 				 		$("#ehora").val(data.result[0].hora);
	 				 		$("#euser").val(data.result[0].usuario);
	 				 		$("#ecliente").val(data.result[0].cliente);
	 				 		$("#epropi").val(data.result[0].nombre_propietario);
	 				 		$("#epdocumento").val(data.result[0].documento_propietario);
	 				 		$("#etene").val(data.result[0].nombre_tenedor);
	 				 		$("#etdocumento").val(data.result[0].documento_tenedor);
	 				 		$("#econdu").val(data.result[0].nombre_conductor);
	 				 		$("#ecdocumento").val(data.result[0].documento_conductor);
	 				 		$("#eweb").val(data.result[0].web_satelital);
	 				 		$("#ewuser").val(data.result[0].usuario_satelital);
							$("#ewclave").val(data.result[0].clave_satelital);
	 				 		}
	 					//traer referencias laborales
	 					var cuente=0;
	 					var total_refe=0;
	 					 if(data.result2){
	 					 	console.log(data);
	 						data.result2.forEach(function(element,index){
	 						 	cuente++;
	 						 	total_refe=total_refe+1;
	 							$("#editar_table_actual").append('<tr>'+
	 								'<tr style="text-align:left; color:white; background-color:#33b5e5;"><th>Empresa</th><th>Fecha ingreso</th><th>Fecha retiro</th></tr>'+
	 								'<tr><td><input type="text" id="empresa_a'+cuente+'" class="form-control" value="'+element.nombre_empresa+'" style="width:310px; height:14px; font-size:90%; margin-left:1px; "></td>'+
	 								'<td><input type="date" id="ingreso_a'+cuente+'" class="form-control" value="'+element.fecha_ingreso+'" style="width:120px; height:14px; font-size:90%;"></td>'+
	 								'<td><input type="date" id="retiro_a'+cuente+'" class="form-control" value="'+element.fecha_retiro+'" style="width:120px; height:14px; font-size:90%;"></td></tr>'+
	 								'<tr><th>Contacto</th><th>Teléfono</th><th>Cargo</th></tr>'+
	 								'<tr><td><input type="text" id="contacto_a'+cuente+'"  class="form-control"  value="'+element.persona_contacto+'" style="width:310px; height:14px; font-size:90%;"></td>'+
	 								'<td><input type="number" id="numero_a'+cuente+'" class="form-control" value="'+element.celular+'" style="width:150px; height:14px; font-size:90%; "></td>'+
	 								'<td><input type="text" id="cargo_a'+cuente+'" class="form-control" value="'+element.cargo+'" style="width:150px; height:14px; font-size:90%; "></td>'+
	 								'<td><input type="hidden" id="id_a'+cuente+'" class="form-control" value="'+element.id+'" style="width:65px; height:14px; font-size:69%;" readonly="readonly"></td>'+
	 							'</tr>');
	 						});
	 						$("#s_total_refe").val(total_refe);
	 				 	}
	 				 },
	 				 	error: function(jqXHR, textStatus, errorThrown){
	 				 		console.log('no error');	
	 				 		console.log(jqXHR);
                      		console.log(textStatus);
                      		console.log(errorThrown);
	 				 	}
	 				 });

	 			});
	 			//boton agregar mas referencias a la solicitud
	 			
	 			$("#btn_refe"+cont+"").click(function(){
	 				// alert('agregar mas referencias');
	 				var prees=$(this).attr('data-id');
	 				var idsoli=$(this).attr('data-id2');
	 				 // alert(prees);
	 				 // alert(idsoli);
	 				$("#num_preestudio").val(prees);
	 				//traer refrencias
	 				var trae={
	 					prees:prees,
	 					action:'traer_fila'
	 				};
	 				$("#elimine_ref").html('');
	 				
	 				$.ajax({
	 				 	url:url2,
	 				 	type:'POST',
	 				 	data:trae,
	 				 	dataType:'json',
	 				 	success: function(data){
	 				 		
	 				 		console.log('si trajo filas');
	 				 		console.log(data);
	 				 		if(data.result){
	 				 			var c=0;
	 				 			data.result.forEach(function(element,index){
	 				 				
	 				 				$("#elimine_ref").append('<tr>'+
	 				 					'<td>'+
	 				 						"<button  class=' form-control btn btn-xs mdi mdi-minus input-xs text-center' style='color:gray;' id='e"+c+"' value='"+element.id+"' onclick='e(this.value,this.id);' > "+
	 				 						 "</button>"+
	 				 					'</td>'+
	 				 					'<td>'+element.nombre_empresa+'</td>'+
	 				 					'<td>'+element.fecha_ingreso+'</td>'+
	 				 					'<td>'+element.fecha_retiro+'</td>'+
	 				 					'<td>'+element. persona_contacto+'</td>'+
	 				 					'<td>'+element.celular+'</td>'+
	 				 					'<td>'+element.cargo+'</td>'+
	 				 				+'</tr>');
	 				 			});
	 				 		}
	 				 	},
	 				 	error: function(jqXHR, textStatus, errorThrown){
	 				 		console.log('error no trajo filas');
				 			console.log(jqXHR);
							console.log(textStatus);
							console.log(errorThrown);
	 				 	}	
	 				});
	 			});

	 			//boton respuestas seguridad
	 			$("#btn_res_seguridad"+cont+"").click(function(){
	 				// alert('respuestas_seguridad');
	 				var placa=$(this).attr('data-id');
	 				var solicitud=$(this).attr('data-id2');
	 				$("#rplaca").val(placa);
	 				//consultar respuestas de seguridad
	 				var answer={
	 					num_solicitud:solicitud,
	 					action:'consultar_respuesta_seguridad'
	 				};
	 				$("#respuestas_seguridad").html('');
	 				$.ajax({
	 				 	url:url2,
	 				 	type:'POST',
	 				 	data:answer,
	 				 	dataType:'json',
	 				 	success: function(data){
	 				 		console.log('si trajo respuesta seguridad');
	 				 		console.log(data);
	 				 		if(data.result){
	 				 			data.result.forEach(function(element,index){
	 				 				var causa='';
		 				 			if(element.respuesta==null){
		 				 				causa='';
		 				 			}else{
		 				 				causa=element.respuesta;
		 				 			}

		 				 			$("#respuestas_seguridad").append('<tr>'+
	 				 				'<td>'+element.estado+'</td>'+
	 				 				'<td>'+causa+'</td>'+
	 				 				'<td>'+element.usuario+'</td>'+
	 				 				'<td>'+element.fecha+'/<br>'+element.hora+'</td>'+
	 				 				'</tr>');
	 				 			});

	 				 			}
	 				 	},
	 				 	error: function(jqXHR, textStatus, errorThrown){
	 				 		console.log('error respuestas seguridad');
				 			console.log(jqXHR);
							console.log(textStatus);
							console.log(errorThrown);
	 				 	}	
	 				});


	 			});
	 			//boton trazabilidad (usado tambien en seguridad)
	 			$("#btn_trazo"+cont+"").click(function(){
	 				// alert('hello');
	 				var pree=$(this).attr('data-id');
	 				var soli=$(this).attr('data-id2');
	 				var estado=$(this).attr('data-id3');
	 				var dati={
	 					pree:pree,
	 					soli:soli,
	 					action:'status_seguridad'
	 				};
	 				$("#body_status").html('');
	 				$.ajax({
	 				 	url:url2,
	 				 	type:'POST',
	 				 	data:dati,
	 				 	dataType:'json',
	 				 	success: function(data){
	 				 		console.log('si status');
	 				 		console.log(data);
	 				 		if(data){
	 				 		data.result.forEach(function(element,index){
	 				 			$("#body_status").append('<tr>'+
	 				 			'<td>'+element.area+'</td>'+
	 				 			'<td>'+element.estado+'</td>'+
	 				 			'<td>'+element.fecha+'</td>'+
	 				 			'<td>'+element.hora+'</td>'+
	 				 			'<td>'+element.usuario+'</td>'+
	 				 			'</tr>');	
	 				 		});
	 				 		}
	 				 	},
	 				 	error: function(jqXHR, textStatus, errorThrown){
	 				 		console.log('no status');	
	 				 		console.log(jqXHR);
                      		console.log(textStatus);
                      		console.log(errorThrown);
	 				 	}
	 				});
	 			});

	 		});
			},
			error:function(jqXHR, textStatus, errorThrown){
				console.log('no sirvio');
	 			console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}	
		});
	}
}

function e(valor,id){
var id_refe=valor;
var eliminar={
id_refe:id_refe,
action:'inactivar_referencia'
};
$.ajax({
url:url2,
type:'POST',
data:eliminar,
dataType:'json',
success: function(data){ 
	 alert('Ok!! Inactivo Referencia Exitosamente!!');
	 location.reload(); 
},
error: function(jqXHR, textStatus, errorThrown){
	console.log('error no trajo filas');
	console.log(jqXHR);
	console.log(textStatus);
	console.log(errorThrown);
}	
});

}



//agregar mas referencias
$("#agregar_fila_edit").click(function(){
	agregas_mas();
});


var contmas=0;
var cont_global2=0;
function agregas_mas(){
	// alert('masssss');
	contmas++;
	cont_global2=cont_global2+1;
	var masreferencias='<tr>'+
 	'<tr style="text-align:left;color:white; background-color:#33b5e5;" "><th>Empresa</th><th>Fecha Ingreso</th><th>Fecha Retiro</th></tr>'+
	'<td><input type="text" id="empresa_m'+contmas+'" class="form-control" style="width:310px; height:14px; font-size:90%; margin-left:1px; "></td>'+
	'<td><input type="date" id="fingreso_m'+contmas+'" class="form-control" style="width:120px; height:14px; font-size:90%;"></td>'+
	'<td><input type="date" id="fretiro_m'+contmas+'" class="form-control" style="width:120px; height:14px; font-size:90%;"></td></tr>'+
	
	'<tr><th>Contacto</th><th>Teléfono</th><th>Cargo</th></tr>'+
	'<tr><td><input type="text" id="contacto_m'+contmas+'"  class="form-control" style="width:310px; height:14px; font-size:90%;"></td>'+
	'<td><input type="number" id="numero_m'+contmas+'" class="form-control" style="width:150px; height:14px; font-size:90%; "></td>'+
	'<td><input type="text" id="cargo_m'+contmas+'" class="form-control" style="width:150px; height:14px; font-size:90%; "></td>'+
	'</tr>';
	$("#masreferencia").append(masreferencias);
}

//Insertar referencias 
$("#aumento_referencia").click(function(){
	var urlm =$("#id_url_ajax").val() + "libs/preestudio_ajax.php";
	// alert('guardarreferencias');
	var solicitud=$("#num_preestudio").val();
	var data = null;
	data = new FormData();
	data.append("accion", 'insertar_mas_referencias');
	var i;
	for(i=1; i<=cont_global2; i++){
		var empresa=$("#empresa_m"+i+"").val();
		var ingrese=$("#fingreso_m"+i+"").val();
		var retiro=$("#fretiro_m"+i+"").val();
		var contacto=$("#contacto_m"+i+"").val();
		var numero=$("#numero_m"+i+"").val();
		var cargo=$("#cargo_m"+i+"").val();
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
		success: function (data, textStatus, jqXHR)
		{
			// console.log('si inserto referencias');
			alert('Ok!! Registro Guardado Exitosamente!!');
			location.reload(); 
		},
		error: function (jqXHR, textStatus, errorThrown)
		{
			console.log('no inserto referencias');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});	
	}
});


//actualizar solicitud tabla filtros
$("#actualizar_solicitud").click(function(){
	 // alert('actualiza la solicitud');
	//validar campos obligatorios
	//traer datos
	var urle =$("#id_url_ajax").val() + "libs/preestudio_ajax.php";
	var id_solicitud;
	id_solicitud=$("#eid").val();
	var placa=$("#eplaca").val();
	var preestudi=$("#econse").val();
	var fecha=$("#efecha").val();
	var hora=$("#ehora").val();
	var user=$("#euser").val();
	var cliente=$("#ecliente").val();
	var propi=$("#epropi").val();
	var docup=$("#epdocumento").val();
	var tene=$("#etene").val();
	var docut=$("#etdocumento").val();
	var condu=$("#econdu").val();
	var docuc=$("#ecdocumento").val();
	var web=$("#eweb").val();
	var wuser=$("#ewuser").val();
	var claveweb=$("#ewclave").val();
	var data = null;
	data = new FormData();
	data.append("accion", 'update_solicitud');
	data.append("idsolicitud", id_solicitud);
	data.append("placa",placa);
	data.append("preestudi", preestudi);
	data.append("fecha", fecha);
	data.append("hora", hora);
	data.append("usuario", user);
	data.append("cliente", cliente);
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
	$.ajax({
		url: urle,
		type: 'POST',
		data: data,
		cache: false,
		processData: false, // Don't process the files
		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		dataType: 'json',
		success: function (data, textStatus, jqXHR)
		{
			console.log('update vehiculo');
			// alert('Ok!! Registro Guardado Exitosamente!!');
			// location.reload(); 
		},
		error: function (jqXHR, textStatus, errorThrown)
		{
			console.log('no update vehiculo');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});

	//actualizar referencias

	var ntotal_referencia=$("#s_total_refe").val();
	var m=0;
	for(m=1; m<=ntotal_referencia; m++){
		var empresa=$("#empresa_a"+m+"").val();
		var ingreso=$("#ingreso_a"+m+"").val();
		var retiro=$("#retiro_a"+m+"").val();
		var contacto=$("#contacto_a"+m+"").val();
		var telefono=$("#numero_a"+m+"").val();
		var cargo=$("#cargo_a"+m+"").val();
		var id=$("#id_a"+m+"").val();
		data.append("empre",empresa);
		data.append("ingreso",ingreso);
		data.append("retiro", retiro);
		data.append("contacto", contacto);
		data.append("telefono", telefono);
		data.append("cargo", cargo);
		data.append("id", id);
		data.append("s_cab", $("#s_cab").val(5));
		data.append("s_ref", $("#s_ref").val());
		$.ajax({
				url: urle,
				type: 'POST',
				data: data,
				cache: false,
				processData: false, // Don't process the files
				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				dataType: 'json',
				success: function (data, textStatus, jqXHR)
				{

				console.log('guardo referencias editar');
				// alert('Ok!! Solicitud Actualizada Exitosamente!!');
				// location.reload(); 

				},
				error: function (jqXHR, textStatus, errorThrown)
				{
					console.log('no guardo referencias editar');
					console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
	}	
	alert('Ok!! Solicitud Actualizada Exitosamente!!');
	location.reload(); 
});




