$( document ).ready(function() {
	$("#contenedor_datos").css('display','none');
	$("#contenedor_tabla").css('display','none');

	$("#crear_regla").click(function(){
		$("#contenedor_datos").css('display','block');
		$("#contenedor_tabla").css('display','none');
		Contenedor_Captura();
	});

	$("#busca_reglas").click(function(){
		var msg_error="";
		$("#contenido_tabla").html('');
		if(!$("#modulo_cambio").val()){
			msg_error+="<p>Debe diligenciar el campo <strong>Módulo</strong> para poder buscar la regla.</p>";
		}
		if(!msg_error){
			Busqueda_Datos();
		}else{
			$(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
			$(".panel-body").animate({ scrollTop: 0 }, 600);

		}
	});
});


function Contenedor_Captura(){
	var formu_registro="<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
		"<h4><strong>Registro Reglas</strong></h4>"+
	"</div>"+
	"<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>"+
		"<label>Módulo:</label>"+
		"<select id='re_modulo' class='form-control input-sm'>"+
			"<option value=''>Seleccione</option>"+
			"<option value='CO'>Cotización</option>"+
			"<option value='SS'>Solicitud Servicio</option>"+
			"<option value='SE'>Solicitud de estudio</option>"+
			"<option value='SU'>Subasta</option>"+
			"<option value='ES'>Estudio de seguridad</option>"+
			"<option value='OC'>Orden de cargue</option>"+
			"<option value='RM'>Remesa</option>"+
			"<option value='MNF'>Manifiesto</option>"+
			"<option value='PLR'>Plan de ruta</option>"+
			"<option value='SEG'>Seguimiento</option>"+
			"<option value='SA'>Sálida</option>"+
			"<option value='TC'>Tiempos logísticos de cargue</option>"+
			"<option value='TD'>Tiempos logísticos de descargue</option>"+
			"<option value='LG'>LLegada</option>"+
			"<option value='CU'>Cumplido</option>"+
		"</select>"+
	"</div>"+
	"<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>"+
		"<label>Tipo regla</label>"+
		"<input type='text' id='re_tipo' class='form-control input-sm'>"+
	"</div>"+
	"<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>"+
		"<label>Valor</label>"+
		"<input type='text' id='re_valor' class='form-control input-sm'>"+
	"</div>"+
	"<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
		"<label>Objetivo de la regla:</label>"+
		"<textarea id='re_objetivo' class='form-control input-sm'></textarea>"+
	"</div>"+
	"<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>"+
		"<br><button id='guardar_regla' class='btn-md btn-success' onclick='Guarda_Regla();'>Guardar</button>"+
	"</div>";
	$("#bodycontenido").html(formu_registro);
}

function Guarda_Regla(){
	var msg_error="";
	if(!$("#re_modulo").val()){
		msg_error+="<p>Debe  seleccionar el <strong>Módulo</strong> para poder registrar la regla </p>";
	}
	if(!$("#re_tipo").val()){
		msg_error+="<p>Debe ingresar el <strong>Tipo regla</strong> para poder registrar la regola </p>";
	}
	if(!$("#re_valor").val()){
		msg_error+="<p>Debe ingresar el <strong>Valor</strong> para poder registrar la regla </p>";
	}
	if(!msg_error){
		Registrar_Regla();
	}else{
		$(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
		$(".panel-body").animate({ scrollTop: 0 }, 600);

	}
}

function Registrar_Regla(){
	var modulo=$("#re_modulo").val();
	var tipo=$("#re_tipo").val();
	var valor=$("#re_valor").val();
	var objetivo=$("#re_objetivo").val();
	var paquete="modulo="+modulo+"&tipo="+tipo+"&objetivo="+objetivo+"&valor="+valor;
	$.post($("#id_url_ajax").val()+'parametros/Registro_Regla',paquete,function(data){
		if(data){
			alert('Datos Registrados Exitosamente!!');
			location.reload(); 
		}
	},'json'); 
}

function Busqueda_Datos(){
	$("#contenedor_datos").css('display','none');
	$("#contenedor_tabla").css('display','block');
	modulo=$("#modulo_cambio").val();
	$.post($("#id_url_ajax").val()+'parametros/Consulta_Reglas','modulo='+modulo,function(data){
		$("#contenido_tabla").html('');
		if(data){
			for(var i=0; i < data.length; i++){
				btneditar='<button class="btn btn-space btn-secondary btn-sm mdi mdi-edit" title="Actualiza Regla" onClick="ActualizaRegla('+data[i]['id']+')"></button>';
				if(data[i]['estado']=='Activo'){
					estado = 
					'<td class="text-success">'+
						'<center>'+
						'<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Activo"></span>'+
					'</center>'+
					'</td>';
				}
				if(data[i]['estado']=='Inactivo'){
					estado = 
					'<td class="text-danger">'+
						'<center>'+
						'<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Inactivo"></span>'+
					'</center>'+
					'</td>';
				}
				$("#contenido_tabla").append('<tr>'+estado+
					'<td>'+data[i]['clasificacion']+'</td>'+
					'<td>'+data[i]['valor']+'</td>'+
					'<td>'+data[i]['objetivo']+'</td>'+	
					'<td>'+btneditar+'</td>'+
				'</tr>');	
			}		
		}
	},'json');	
}

function Update_Regla(){
	var modulo=$("#up_modulo").val();
	var tipo=$("#up_tiporegla").val();
	var valor=$("#up_valor").val();		
	var objetivo=$("#up_objetivo").val();
	var id=$("#up_id").val();
	var paquete='modulo='+modulo+'&clase='+tipo+'&valor='+valor+'&objetivo='+objetivo+'&id_tb='+id;
	$.post($("#id_url_ajax").val()+'parametros/Actualiza_Regla',paquete,function(data){
		if(data=='true'){
			alert('Datos Registrados Exitosamente!!');
			location.reload();
		}
	},'json');	
}

function ActualizaRegla(idtabla){
	$("#contenedor_datos").css('display','block');
	$("#contenedor_tabla").css('display','none');
	$.post($("#id_url_ajax").val()+'parametros/Consulta_Regla','id='+idtabla,function(data){
		$("#bodycontenido").html('');
		if(data){
			for(var i=0; i < data.length; i++){
				$("#bodycontenido").append(
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Módulo</label>'+
						'<input type="text" id="up_modulo" class="form-control input-sm" value="'+data[i]['nombre_modulo']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Tipo Regla</label>'+
						'<input type="text" id="up_tiporegla" class="form-control input-sm" value="'+data[i]['clasificacion']+'">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Valor</label>'+
						'<input type="text" id="up_valor" class="form-control input-sm" value="'+data[i]['valor']+'">'+
					'</div>'+
					'<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">'+
						'<label>Objetivo de la regla</label>'+
						'<input type="text" id="up_objetivo" class="form-control input-sm" value="'+data[i]['objetivo']+'">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<input type="hidden" id="up_id" class="form-control input-sm" value="'+data[i]['id']+'" readonly="reaodnly">'+
						'<br><button id="Actualiza_Regla" class="btn-success" onClick="Update_Regla()">Actualizar</button>'+
					'</div>');
			}
		}
	},'json');
}


