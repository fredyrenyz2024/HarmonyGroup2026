$(document).ready(function() {	
	//Ocultar los contenedores	
	$("#cont_precinto").hide();
	$("#cont_antici").hide();
	$("#editar_precinto_agregar").hide();
	$("#eagregar_preci").prop('disabled', true);
	$("#agregar_asoci_mas").prop('disabled', true);
	//cargar select de origen y destino final
	cargar_select();


	//validar si selecciono si
	$("#requiere_precinto").change(function(){
		var preci=$("#requiere_precinto").val();
		if(preci==1){
			$("#cont_precinto").show();
		}else if(preci==0){
			$("#cont_precinto").hide();
		}else if(preci==''){
			$("#cont_precinto").hide();
		}

	});

	$("#requiere_anticipo").change(function(){
		var antici=$("#requiere_anticipo").val();
		if(antici==0){
			$("#cont_antici").hide();
			$("#an_flete").val('');
			$("#an_porcentaje").val('');
			$("#an_vanticipo").val('');
		}else if(antici==1){
			//traer el valor del flete segun la combinación
			var origen=$("#ori_final").val();
			var destino=$("#dest_final").val();
			var vehiculo=$("#tv_final").val();

			if(origen!='' && destino!='' && vehiculo!=''){
				$("#cont_antici").show();
				var sele={
					origen:origen,
					destino:destino,
					vhiculo:vehiculo,
					action:'cargar_flete'
				};

				$.ajax({
					url: $("#id_url_ajax").val() +"libs/lista_planillas_ajax.php",
			            type: "POST",
			            data:sele,
			            dataType:'json',
			             success: function(data)
			             {
			                // console.log(data.result);
			                $("#an_flete").val(data.result[0].tarifa);

			             },
			             error: function(jqXHR, textStatus, errorThrown){
			             		console.log(jqXHR);
								console.log(textStatus);
								console.log(errorThrown);
			             }
				});
			}else{
				var msg_error= "<p>Debe seleccionar todos los campos del <strong>bloque Origen y Destino Final</strong> para poder crear la planilla.</p>";
				$("#nexos_messages_popup_md").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
				$("#planillar_vehiculo").animate({ scrollTop: 0 }, 600);
			}
		}else if(antici==''){
			$("#cont_antici").hide();
			$("#an_flete").val('');
			$("#an_porcentaje").val('');
			$("#an_vanticipo").val('');
		}
	});

	//EDITAR
	$("#erque_anticipo").change(function(){
		var r=$("#erque_anticipo").val();
		if(r==0){
			$("#ean_flete").val(0);
			$("#ean_porcentaje").val(0);
			$("#ean_liquidado").val(0);
		}
		if(r==1){
			var ori=$("#eorigen_final").val();
			var des=$("#edestino_final").val();
			var car=$("#etv_final").val();
			recalcular_anticipo(ori,des,car);
		}
	});

	$("#ean_porcentaje").change(function(){
		var valor=$("#ean_flete").val();
		var p=$("#ean_porcentaje").val();
		var multi=(parseInt(p)*parseInt(valor));
		var res=(multi/100);
		$("#ean_liquidado").val(res);
	});

	$("#e_requireprecinto").change(function(){
		var re=$("#e_requireprecinto").val();
		if(re==''){
			$("#eagregar_preci").prop('disabled', true);
		}
		if(re==1){
			$("#eagregar_preci").prop('disabled', false);
		}

		if(re==0){
			$("#eagregar_preci").prop('disabled', true);
		}
	});

	$("#emas_asoci").change(function(){
		var re=$("#emas_asoci").val();
		if(re==''){
			$("#agregar_asoci_mas").prop('disabled', true);
		}
		if(re==1){
			$("#agregar_asoci_mas").prop('disabled', false);
		}

		if(re==0){
			$("#agregar_asoci_mas").prop('disabled', true);
		}
	});

	$("#eagregar_preci").click(function(){
		agregar_precinto_editar();
	});

	//botones dinamicos	
	$("#agregar_asoci").click(function(){
		agregar_asociacion();
	});

	$("#agregar_preci").click(function(){
		agregar_precinto();
	});

	$("#agregar_asoci_mas").click(function(){
		agregar_asociacionm();
	});

	//validaciones del botón guardar
	$("#btn_crear_planilla").click(function(){
		var msg_error = "";
		//validar q la solicitud no se repita
		var cantidad=$("#cantidad_orden").val();
		var i;
		var a;
		if(cantidad>0){
			for(i=1; i<=cantidad; i++){
				if(typeof $("#st"+i).val() !== 'undefined'){					
					var valida=$("#validaservi"+i).val();
					var pu=0;
					for(a=1; a<=cantidad; a++){
						if(valida==$("#validaservi"+a).val()){
							pu=pu+1;

						}
					}
				}
			}
			if(pu>1){
				msg_error+= "<p>Debe revisar la asignación de  solicitudes de servicio, no puede haber duplicidad. Campo: <strong>N° solicitud</strong></p>";
			}
		}



		if(!$("#requiere_precinto").val()){
			msg_error+= "<p>Debe seleccionar el campo <strong>¿Requiere precinto?</strong> para poder crear la planilla.</p>";
		}
		if(!$("#requiere_anticipo").val()){
		msg_error+= "<p>Debe seleccionar el campo <strong>¿Requiere anticipo?</strong> para poder crear la planilla.</p>";
		}
		if(!$("#cantidad_orden").val()){
			msg_error+= "<p>Debe agregar mínimo 1 bloque en <strong>Añadir asociación (orden cargue- manifiesto - remesa)</strong> para poder crear la planilla.</p>";
		}
		if(!$("#ori_final").val()){
			msg_error+= "<p>Debe seleccionar el campo <strong>Origen final</strong> para poder crear la planilla.</p>";
		}
		if(!$("#dest_final").val()){
			msg_error+= "<p>Debe seleccionar el campo <strong>Destino Final</strong> para poder crear la planilla.</p>";
		}
		if(!$("#tv_final").val()){
			msg_error+= "<p>Debe seleccionar el campo <strong>Tipo de vehículo Final</strong> para poder crear la planilla.</p>";
		}
		if(!$("#n_mani").val()){
			msg_error+= "<p>Debe seleccionar el campo <strong>N° manifiesto</strong> para poder crear la planilla.</p>";
		}
		if(!$("#fecha_mani").val()){
			msg_error+= "<p>Debe seleccionar el campo <strong>Fecha manifiesto</strong> para poder crear la planilla.</p>";
		}
		if(!$("#num_tarjeta").val()){
			msg_error+= "<p>Debe ingresar el campo <strong>Número tarjeta</strong> para poder crear la planilla.</p>";
		}
		var m;
		if(b>0){
			for(m=1; m<=b; m++){
				if(typeof $("#st"+m).val() !== 'undefined'){
					if(!$("#orden"+m+"").val()){
						msg_error+= "<p>Debe seleccionar el campo <strong>Orden cargue"+m+"</strong> para poder crear la planilla.</p>";
					}
					if(!$("#fo"+m+"").val()){
						msg_error+= "<p>Debe seleccionar el campo <strong>Fecha orden"+m+"</strong> para poder crear la planilla.</p>";
					}

					if(!$("#reme"+m+"").val()){
						msg_error+= "<p>Debe seleccionar el campo <strong>Remesa"+m+"</strong> para poder crear la planilla.</p>";
					}
					if(!$("#fr"+m+"").val()){
						msg_error+= "<p>Debe seleccionar el campo <strong> Fecha remesa "+m+"</strong> para poder crear la planilla.</p>";
					}
					if(!$("#soliservicio"+m+"").val()){
						msg_error+= "<p>Debe seleccionar el campo <strong>N° solicitud "+m+"</strong> para poder crear la planilla.</p>";
					}
				}
			}
		}

		var p;
		if(contador_global1>0){
			for(p=1; p<=contador_global1; p++){
				if(typeof $("#sk"+p).val() !== 'undefined'){
					if(!$("#tipo_precinto"+p+"").val()){
						msg_error+= "<p>Debe seleccionar el campo <strong>Tipo precinto "+p+"</strong> para poder crear la planilla.</p>";
					}
					if(!$("#num_preci"+p+"").val()){
						msg_error+= "<p>Debe ingresar el campo <strong>Código precinto "+p+"</strong> para poder crear la planilla.</p>";
					}
				}
			}
		}

		if(!msg_error){
		 	Crear_Planilla();
		}else{
			$("#nexos_messages_popup_md").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
			$("#planillar_vehiculo").animate({ scrollTop: 0 }, 600);
		}
	});

	//validaciones del botón editar
	$("#btn_editar_planilla").click(function(){
		//validaciones 
		//ordenes
		var msg_error = "";
		if(!$("#eorigen_final").val()){
			msg_error+= "<p>Debe seleccionar el campo <strong>Origen final</strong> para poder actualizar la planilla.</p>";
		}
		if(!$("#edestino_final").val()){
			msg_error+= "<p>Debe seleccionar el campo <strong>Destino final</strong> para poder actualizar la planilla.</p>";
		}
		if(!$("#etv_final").val()){
			msg_error+= "<p>Debe seleccionar el campo <strong>Tipo vehículo final</strong> para poder actualizar la planilla.</p>";
		}
		if(!$("#en_mani").val()){
			msg_error+= "<p>Debe seleccionar el campo <strong>N° manifiesto</strong> para poder actualizar la planilla.</p>";
		}
		if(!$("#efec_mani").val()){
			msg_error+= "<p>Debe seleccionar el campo <strong>Fecha manifiesto</strong> para poder actualizar la planilla.</p>";
		}
		if(!$("#enumtarjeta").val()){
			msg_error+= "<p>Debe seleccionar el campo <strong>Número tarjeta</strong> para poder actualizar la planilla.</p>";
		}




		//ordenes actualizar

		/*var cao=$("#sd"+s).size();
			var e=$(".identi").size();
			var gu=$("#mcantidad_orden").val();
			var h;
			for(h=1; h<=gu; h++){
				if(typeof $("#sd"+h).val()!=='undefined'){

				}
			}
			if((e==0 || e=='undefined' || e=='') && (cao==0 || cao=='undefined' || cao=='')){
				msg_error+= "<p> mínimo debe tener un bloque de <strong>asociacion orden - manifiesto - remesa</strong> para poder actualizar la planilla.</p>";
		}*/

		var d=$("#ecant_orden").val();
		var e=$(".identi").size();
		var z;
		if(e>0){
			for(z=1; z<=d; z++){
				if(typeof $("#sy"+z).val()!=='undefined'){
					if(!$("#n_orden"+z+"").val()){
						msg_error+= "<p>Debe seleccionar el campo <strong>N° orden "+z+"</strong> para poder actualizar la planilla.</p>";
					}
					if(!$("#f_orden"+z+"").val()){
						msg_error+= "<p>Debe seleccionar el campo <strong>Fecha orden "+z+"</strong> para poder actualizar la planilla.</p>";
					}
					if(!$("#n_remesa"+z+"").val()){
						msg_error+= "<p>Debe seleccionar el campo <strong>N° remesa "+z+"</strong> para poder actualizar la planilla.</p>";
					}
					if(!$("#f_remesa"+z+"").val()){
						msg_error+= "<p>Debe seleccionar el campo <strong>Fecha remesa "+z+"</strong> para poder actualizar la planilla.</p>";
					}
				}	
			}
		}
		
		//ordenes agregar
		var c=$("#mcantidad_orden").val();
		for(s=1; s<=c; s++){
			if(typeof $("#sd"+s).val()!=='undefined'){
				if(!$("#eorden"+s+"").val()){
					msg_error+= "<p>Debe seleccionar el campo <strong>N° orden "+s+"</strong>en agregar asociacion para poder actualizar la planilla.</p>";
				}
				if(!$("#efo"+s+"").val()){
					msg_error+= "<p>Debe seleccionar el campo <strong>Fecha orden "+s+"</strong>en agregar asociacion para poder actualizar la planilla.</p>";
				}
				if(!$("#ereme"+s+"").val()){
					msg_error+= "<p>Debe seleccionar el campo <strong>N° remesa "+s+"</strong>en agregar asociacion para poder actualizar la planilla.</p>";
				}
				if(!$("#efr"+s+"").val()){
					msg_error+= "<p>Debe seleccionar el campo <strong>Fecha remesa "+s+"</strong>en agregar asociacion para poder actualizar la planilla.</p>";
				}
				if(!$("#eservicio"+s+"").val()){
					msg_error+= "<p>Debe seleccionar el campo <strong>N° servicio "+s+"</strong>en agregar asociacion para poder actualizar la planilla.</p>";
				}
			}
		}

		//precintos actualizar
		var t;
		var cp=$(".identip").size();
		var pt=$("#e_totprecintos").val();
		if(cp>0){
			for (t=1; t<=pt; t++) {
				if(typeof $("#sz"+t).val()!=='undefined'){
					if(!$("#num_precinto"+t+"").val()){
					msg_error+= "<p>Debe seleccionar el campo <strong>N° precinto "+t+"</strong> para poder actualizar la planilla.</p>";
					}
					if(!$("#tipo_precinto"+t+"").val()){
						msg_error+= "<p>Debe seleccionar el campo <strong>Tipo precinto "+t+"</strong> para poder actualizar la planilla.</p>";
					}
				}	
			}
		}

		//precintos agregar
		var d=$("#ep").val();
		var g;
		for(g=1; g<=d; g++){
			if(typeof $("#sm"+g).val()!=='undefined'){
				if(!$("#eatipo_precinto"+g+"").val()){
					msg_error+= "<p>Debe seleccionar el campo <strong>Tipo precinto "+g+"</strong> para poder actualizar la planilla.</p>";
				}
				if(!$("#eanum_preci"+g+"").val()){
					msg_error+= "<p>Debe seleccionar el campo <strong>N° precinto "+g+"</strong> para poder actualizar la planilla.</p>";
				}
			}	
		}	

		if(!msg_error){
		 	Editar_planilla();
		}else{
			$("#enexos_messages_popup_md").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
			$("#editar_planilla").animate({ scrollTop: 0 }, 600);
		}
	});


	//boton solicitar inicio ruta
	$("#btn_solicitar").click(function(){
		var msg_error = "";
		if(!$("#splaca").val()){
			msg_error+= "<p>Debe existir datos en el campo <strong>Placa</strong> para poder solicitar inicio de ruta.</p>";
		}

		if(!$("#sconductor").val()){
			msg_error+= "<p>Debe existir datos en el campo <strong>Conductor</strong> para poder solicitar inicio de ruta.</p>";
		}

		if(!$("#sestudio").val()){
			msg_error+= "<p>Debe existir datos en el campo <strong>Estudio</strong> para poder solicitar inicio de ruta.</p>";
		}

		if(!$("#snplanilla").val()){
			msg_error+= "<p>Debe existir datos en el campo <strong>Planilla</strong> para poder solicitar inicio de ruta.</p>";
		}

		if(!$("#smanifies").val()){
			msg_error+= "<p>Debe existir datos el campo <strong>Manifiesto</strong> para poder solicitar inicio de ruta.</p>";
		}
		if(!$("#sobserva").val()){
			msg_error+= "<p>Debe existir datos el campo <strong>Observación</strong> para poder solicitar inicio de ruta.</p>";
		}

		if(!msg_error){
		 	Solicitar_Inicioruta();
		}else{
			$("#nexos_messages_solicitud").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
			$("#solicita_iniruta").animate({ scrollTop: 0 }, 600);
		}
	});

	//boton editar solicitud
	$("#btn_esolicitud").click(function(){
		var msg_error = "";
		if(!$("#observa_ru").val()){
			msg_error+= "<p>Debe existir datos en el campo <strong>Observación</strong> para poder solicitar inicio de ruta.</p>";
		}
		if(!msg_error){
		 	Editar_solicitud();
		}else{
			$("#edite_nexos_messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
			$("#solicita_iniruta_edite").animate({ scrollTop: 0 }, 600);
		}
	});	


});	


function cargar_select(){
	var sele={
		action:'cargar_od_final'
	};
	$("#ori_final").html('<option value="">Seleccione</option>');
	$("#dest_final").html('<option value="">Seleccione</option>');
	$.ajax({
		 	url: $("#id_url_ajax").val() +"libs/lista_planillas_ajax.php",
            type: "POST",
            data:sele,
            dataType:'json',
             success: function(data)
             {
                // console.log(data.result);
                if(data){
                	data.result.forEach(function(element,index){
                		$("#ori_final").append('<option value="'+element.rndc_codigo_ciudad+'">'+element.municipio+'-'+element.depto+'</option>');
                		$("#dest_final").append('<option value="'+element.rndc_codigo_ciudad+'">'+element.municipio+'-'+element.depto+'</option>');
                	});		
                } 
             },
             error: function(jqXHR, textStatus, errorThrown){
             		console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
             }
    });


	var tv_final={
		action:'tipo_vehiculo'
	};
	$("#tv_final").html('<option value="">Seleccione</option>');
	$.ajax({
		url: $("#id_url_ajax").val() +"libs/lista_planillas_ajax.php",
            type: "POST",
            data:tv_final,
            dataType:'json',
             success: function(data)
             {
                // console.log(data.result);
                if(data){
                	data.result.forEach(function(element,index){
                		$("#tv_final").append('<option value="'+element.id+'" >'+element.nombre+'</option>');
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

//Eliminar bloques de asociacion(orden cargue-manifiesto-remesa)
$(document).on('click','.borrar3',function(event){
	event.preventDefault();
	$(this).closest('tr').find('td').remove();
	var v=this.id;
	//alert('v'+v);
	var x=v.substr(1,1);
	x=parseInt(x);
	//$("#sk"+x).val();
	var d=$("#st"+x).val();
});



var a=0;
var b=0;
function agregar_asociacion(){
	a++;
	b=b+1;
	var ch='<input type="button" id="p'+a+'" class="btn-primary borrar3" value="Eliminar">';
	//SOLICITUD DE SERVICIO
    var tipo='<select id="soliservicio'+a+'" class="form-control input-sm"  onchange="cambioservicio(this,'+a+');" >'+
    '</select>';
	
	var anadir='<tr>'+
		'<td <input type="hidden" id="st'+a+'" value="1">'+
			'<label>N° solicitud</label>'+tipo+
			'<label>Orden cargue</label> <input type="number" id="orden'+a+'" class="form-control input-sm">'+
			'<label>Fecha Orden cargue</label> <input type="date" id="fo'+a+'" class="form-control input-xs">'
		+'</td>'+
		'<td <input type="hidden" id="st'+a+'" value="1">'+
			'<label>Remesa</label> <input type="number" id="reme'+a+'" class="form-control input-xs">'+
			'<label>Fecha Remesa</label> <input type="date" id="fr'+a+'" class="form-control input-xs">'
			+'</td>'+
		'<td><input type="hidden" id="validaservi'+a+'" class="form-control input-sm">'+ch+'</td>'
		'</tr>';	
	//cargarselect(nestu,a);	
	$("#tabla_orden").append(anadir);
	$("#cantidad_orden").val(b);

	var nestu=$("#n_estudiouser").val();
	var cons={
		num_estudio:nestu,
		action:'cargar_solicitudes_servicio2'
	};
	$.ajax({
		url:$("#id_url_ajax").val() +"libs/lista_planillas_ajax.php",
        type: "POST",
        data:cons,
        dataType:'json',
        success: function(data)
        {

        	$("#soliservicio"+a+"").html('<option value="">Elija</option>');
            data.result.forEach(function(element,index){	
                	$("#soliservicio"+a+"").append('<option value="'+element.id_servicio_cliente+'">'+element.id_servicio_cliente+'</option>');
            });
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('tipo empaque no');
            console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
        }
    });

}


//Agregar mas precintos al Editar
$(document).on('click','.borrar6',function(event){
	event.preventDefault();
	$(this).closest('tr').find('td').remove();
	var v=this.id;
	//alert('v'+v);
	var x=v.substr(1,1);
	x=parseInt(x);
	//$("#sk"+x).val();
	var d=$("#sd"+x).val();
});
var t=0;
var j=0;
function agregar_asociacionm(){
	t++;
	j=j+1;
	var ch='<input type="button" id="r'+t+'" class="btn-primary borrar6" value="Eliminar">';
	var tipo='<select id="eservicio'+t+'" class="form-control input-sm"></select>';
	var anadir='<tr>'+
		'<td <input type="hidden" id="sd'+t+'" value="1">'+
			'<label>N° servicio</label>'+tipo+
			'<label>Orden cargue</label> <input type="number" id="eorden'+t+'" class="form-control input-sm">'+
			'<label>Fecha Orden cargue</label> <input type="date" id="efo'+t+'" class="form-control input-xs">'
		+'</td>'+
		'<td <input type="hidden" id="st'+t+'" value="1">'+
			'<label>Remesa</label> <input type="number" id="ereme'+t+'" class="form-control input-xs">'+
			'<label>Fecha Remesa</label> <input type="date" id="efr'+t+'" class="form-control input-xs">'
		+'</td>'+
		'<td>'+ch+'</td>'
		'</tr>';	
	$("#tabla_orden_mas").append(anadir);
	$("#mcantidad_orden").val(j);

	var nestu=$("#n_estudiouser2").val();
	var cons={
		num_estudio:nestu,
		action:'cargar_solicitudes_servicio2'
	};
	$("#eservicio"+t+"").html('');
	$.ajax({
		url:$("#id_url_ajax").val() +"libs/lista_planillas_ajax.php",
        type: "POST",
        data:cons,
        dataType:'json',
        success: function(data)
        {
            data.result.forEach(function(element,index){
                $("#eservicio"+t+"").append('<option value="'+element.id_servicio_cliente+'">'+element.id_servicio_cliente+'</option>');
            });
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('tipo empaque no');
            console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
        }
    });

}


//Eliminar Precintos
$(document).on('click','.borrar2',function(event){
	event.preventDefault();
	$(this).closest('tr').remove();
	var v=this.id;
	//alert('v'+v);
	var x=v.substr(1,1);
	x=parseInt(x);
	//$("#sk"+x).val();
	var d=$("#sk"+x).val();
});

//agregar bloques de precinto dinamicos
var conta=0;
var contador_global1=0;
function agregar_precinto(){
	conta++;
	contador_global1=contador_global1+1;
	//TIPO DE PRECINTO
	var select_tipo={
		action:'traer_tipo_precinto'
	};
	$("#tipo_precinto"+cont+"").html('');
	/*$.ajax({
		 	url: $("#id_url_ajax").val() +"libs/lista_planillas_ajax.php",
            type: "POST",
            data:select_tipo,
            dataType:'json',
             success: function(data)
             {
                // console.log(data.result);
                data.result.forEach(function(element,index){
                	alert(element.tipo);
                	$("#tipo_mercancia"+cont+"").
                	append('<option value="'+element.tipo+'">'+element.tipo+'</option>');
                });
             },
             error: function(jqXHR, textStatus, errorThrown){
             		console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
             }
    });*/
    var precinto='<select id="tipo_precinto'+conta+'" class="form-control input-xs">'+
		'<option value="">Seleccione</option>'+
		'<option value="Botella">Botella</option>'+
		'<option value="Plastico">Plastico</option>'+
		'<option value="Metalico">Metalico</option>'
		+'</select>';

	var ch='<input type="button" id="p'+conta+'" class="btn-primary borrar2" value="Eliminar">';
	
	var agrega='<tr>'+
		'<td ><p><strong>'+conta+'</strong></p><input type="hidden" id="sk'+conta+'" value="1"></td>'+
		'<td><input type="number" id="num_preci'+conta+'" class="form-control input-xs" min="0"  > </td>'+
	  	'<td>'+ precinto +'</td><td>'+ch+'</td></tr>';

	$("#tabla_precinto").append(agrega);
	$("#cantidad_preci").val(contador_global1);
}

//Eliminar Precintos al bloque de agregar mas
$(document).on('click','.borrar4',function(event){
	event.preventDefault();
	$(this).closest('tr').remove();
	var v=this.id;
	//alert('v'+v);
	var x=v.substr(1,1);
	x=parseInt(x);
	//$("#sk"+x).val();
	var d=$("#sm"+x).val();
});

var econt=0;
var econtador_global=0;
function agregar_precinto_editar(){
	econt++;
	econtador_global=econtador_global+1;
	 var precinto='<select id="eatipo_precinto'+econt+'" class="form-control input-xs">'+
		'<option value="">Seleccione</option>'+
		'<option value="Botella">Botella</option>'+
		'<option value="Plastico">Plastico</option>'+
		'<option value="Metalico">Metalico</option>'
		+'</select>';
	var ch='<input type="button" id="eap'+econt+'" class="btn-primary borrar4" value="Eliminar">';
	var agrega='<tr>'+
		'<td ><p><strong>'+econt+'</strong></p><input type="hidden" id="sm'+econt+'" value="1"></td>'+
		'<td><input type="number" id="eanum_preci'+econt+'" class="form-control input-xs" min="0"  > </td>'+
	  	'<td>'+ precinto +'</td><td>'+ch+'</td></tr>';	
	 $("#eagrega_precinto").append(agrega);
	$("#ep").val(econtador_global); 	
}


//liquidacion de anticipo - cálculo
function liquida_anticipo(){
	var valor=$("#an_flete").val();
	var p=$("#an_porcentaje").val();
	var multi=(parseInt(p)*parseInt(valor));
	var res=(multi/100);
	$("#an_vanticipo").val(res);
}



var ur =$("#id_url_ajax").val() + "libs/planilla_ajax.php";

//Eliminar BD - orden cargue(Editar)

function delete_asocia(btn,id){
	//1. eliminar de la Bd
	var msg_error = "";
	var e=$(".identi").size();
	if(e==1 &&  $("#mcantidad_orden").val()==0){
		msg_error+= "<p>No puede remover este bloque , debe agregar otro documento: Orden de cargue - remesa - manifiesto .</p>";
		$("#enexos_messages_popup_md").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
		$("#editar_planilla").animate({ scrollTop: 0 }, 600);
	}else{
		var codigo=$("#id_orden"+id+"").val();
		var dele_orden={
			codigo:codigo,
			action:'eliminar_asociacion'
		};
		$.ajax({
			url:$("#id_url_ajax").val() +"libs/lista_planillas_ajax.php",
	        type:"POST",
	        data:dele_orden,
	        dataType:'json',
	        success: function(data)
	        {
	        	event.preventDefault();
				$('.tr'+id).remove();
				$(this).closest('tr').remove();
	        },
	        error: function(jqXHR, textStatus, errorThrown){
	        	alert('No elimino asociacion');
	        	console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
	        }	
	    });  
	}
}

//Eiminar BD- precinto(Editar)
function delete_precinto(btn,id){
	//dp(event,id);
	//1. eliminar el precinto de la BD
	var codig=$("#idtb_precinto"+id+"").val();
	var delete_preci={
		codig:codig,
		action:'eliminar_precinto'
	};
	$.ajax({
		url:$("#id_url_ajax").val() +"libs/lista_planillas_ajax.php",
        type:"POST",
        data:delete_preci,
        dataType:'json',
        success: function(data)
        {
        	event.preventDefault();
			$('.trp'+id).remove();
			$(this).closest('tr').remove();
        },
        error: function(jqXHR, textStatus, errorThrown){
        	alert('No elimino el precinto');
        	console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
        }	
    }); 
}


//traer datos de tablas solicitud de sevicio y vehículo
function realizar_planilla(){
	var finicia=$("#fecha_inicial").val();
	var ffina=$("#fecha_final").val();
	var dato={
		fecha_uno:finicia,
		fecha_dos:ffina,
		action:'cargar_estudios_aprobados'
	};

	$("#principal_cuerpo").html('');
	$.ajaxSetup({async: false});
	$("#principal_cuerpo").html('');
	$.ajax({
		url:$("#id_url_ajax").val() + "libs/lista_planillas_ajax.php",
	 	type:'POST',
	 	data:dato,
	 	dataType:'json',
	 	success: function(data){
	 		cuente=0;
	 		cont=0;
	 		if(data.result==null){
	 			funct_msg_error("#nexos_messages_popup_tb", 'No hay estudios aprobados con el filtro seleccionado.');
	 		}

	 		if(data.result!=null){
	 			//mostrar los datos de la tabla
	 			var P_a=$("#permiso_agregar").val();
	 			data.result.forEach(function(element,index){
	 				cuente++;
	 				cont++;
	 				var pl=element.placa;
	 				var condu=element.nombre;
	 				var tra=element.trailer;
	 				var n_estudio=element.idestudi;
	 				var n_estud_usuario=element.id_solictud;
	 				var n_planilla=element.idplanilla;
	 				var need_precinto=element.precinto;
	 				var need_anticipo=element.anticipo;
	 				var tipo_vehiculo=element.clase;
	 				var num_condu=element.numero_documento;
	 				var nmani=element.manifiesto;
	 				var tp=element.num_tarjeta;
	 				var inicioruta=element.inicioruta;

	 				var btn_agrega=''; btn_ver=''; btn_editar=''; icon_p=''; icon_an=''; btn_ruta='';
	 				var ir;	
	 				//variables de permiso
	 				var fhoy=moment();
					var horahoy=moment().format('HH:mm:ss');
					var tf=fhoy.diff(element.fecha,'days');
	 				
	 				if(element.precinto!=null && element.precinto!='' && element.anticipo!='' && element.anticipo!=null){
	 							var status='<td class="text-success" title="Planillado">'+
				 				'<center><span class="mdi mdi-dot-circle icon"></span></center>'+
				 				'</td>';
				 				if(tf==0){
		 							btn_editar='<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-edit" id="btn_edite'+cont+'"'+
									' data-toggle="modal"data-target="#editar_planilla" data-id="'+n_estud_usuario+'"'+
									'data-id2="'+pl+'"  data-id3="'+condu+'" data-id4="'+tra+'" data-id5="'+n_estudio+'"  data-id6="'+n_planilla+'"  '+
									'data-id7="'+need_precinto+'" data-id8="'+need_anticipo+'"  data-id9="'+tipo_vehiculo+'" data-id10="'+num_condu+'"'+
									'data-id11="'+tp+'" data-placement="top" title="Editar Planilla de vehículo" ></button>';		


									if(element.idiniruta==0){
										btn_ruta='<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-assignment" id="btn_sruta'+cont+'"'+
										' data-toggle="modal"data-target="#solicita_iniruta" data-id="'+n_estud_usuario+'"'+
										'data-id2="'+pl+'"  data-id3="'+condu+'" data-id4="'+tra+'" data-id5="'+n_estudio+'"  data-id6="'+n_planilla+'"  '+
										'data-id7="'+need_precinto+'" data-id8="'+need_anticipo+'"  data-id9="'+tipo_vehiculo+'" data-id10="'+num_condu+'"  data-id11="'+nmani+'"  '+ 
										' data-placement="top" title="Solicitar inicio ruta" ></button>';		
									}else if(element.idiniruta!=0){
										btn_ruta='<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-assignment" id="btn_Esruta'+cont+'"'+
										' data-toggle="modal"data-target="#solicita_iniruta_edite" data-id="'+element.idiniruta+'"'+
										' data-placement="top" title="Actualizar inicio ruta" ></button>';		
									}
								
								}else{
									btn_editar='<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-edit"'+
										'data-placement="top" title="Esta vencida la aprobación de este estudio,no puede actualizar la planilla">'+
									'</button>';
								}
	 				}else{
		 				var status='<td class="text-warning" title="Pendiente por planillar">'+
				 				'<center><span class="mdi mdi-dot-circle icon"></span></center>'+
				 				'</td>';

	 					if(P_a==1){// si tiene permiso de planillar y además es un estudio aprobado el mismi día , puede hacerlo
	 						//si es un estudio aprobado el día anterior no puede
								if(tf==0){
									btn_agrega='<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-plus" id="btn_agregue'+cont+'"'+
									' data-toggle="modal"data-target="#planillar_vehiculo"  data-id="'+n_estud_usuario+'"'+
									'data-id2="'+pl+'"  data-id3="'+condu+'" data-id4="'+tra+'" data-id5="'+n_estudio+'"'+
									'data-id6="'+tipo_vehiculo+'" data-id7="'+num_condu+'" '+
									' data-placement="top" title="Planillar vehículo" ></button>';		
								}else{
									btn_agrega='<button type="button" class="btn btn-secondary btn btn-sm mdi mdi-plus"'+
										'data-placement="top" title="Esta vencida la aprobación de este estudio,por lo tanto no puede generar una planillar">'+
									'</button>';
								}	
	 					}
	 				}
	 				
	 					btn_ver='<button type="button"  class="btn btn-secondary btn btn-sm mdi mdi-eye" id="btn_ver'+cont+'"'+
									' data-toggle="modal"data-target="#ver_planilla" data-id="'+n_estud_usuario+'"'+
									'data-id2="'+pl+'"  data-id3="'+condu+'" data-id4="'+tra+'" data-id5="'+n_estudio+'"  data-id6="'+n_planilla+'"  '+ 
									'data-id7="'+tipo_vehiculo+'"  data-id8="'+num_condu+'" data-id9="'+tp+'" '+
									' data-placement="top" title="Consultar Planilla de vehículo" ></button>';	

						var re_precinto=element.precinto;
						var re_anticipo=element.anticipo;
						if(element.precinto!=null && element.precinto!='' && element.anticipo!='' && element.anticipo!=null){
							if(element.precinto==1){
								icon_p='<td>Si</td>';
							}	

							if(re_precinto==0){
								icon_p='<td>No</td>';
							}	

							if(element.anticipo==1){
								icon_an='<td>Si</td>';
							}	

							if(re_anticipo==0){
								icon_an='<td>No</td>';
							}
						}else{
							icon_p='<td></td>';
							icon_an='<td></td>';
						}

			
						if(element.inicioruta==0){
							ir='<td>No</td>';
						}else{
							ir='<td>Si</td>';
						}

			 			$("#principal_cuerpo").append('<tr>'+status+
			 					'<td class="cell-detail">'+element.placa+'</td>'+
			 					'<td class="cell-detail">'+element.estado+'</td>'+
			 					'<td class="cell-detail">'+element.fecha+'</td>'+
			 					'<td class="cell-detail">'+element.hora+'</td>'+
			 					'<td class="cell-detail">'+element.nombre+'</td>'+
			 					ir+
			 					icon_p+
			 					icon_an+
			 					'<td class="cell-detail">'+
			 							btn_agrega+'&nbsp;&nbsp;'+
			 							btn_editar+'&nbsp;&nbsp;'+
			 							btn_ver+'&nbsp;&nbsp;'+
			 							btn_ruta+'&nbsp;&nbsp;'+
			 							'</td>'+'</tr>');
			 	//limpiar tablas
			 	$("#tb_vehiculo").html('');	
			 	//agregar 	
				$("#btn_agregue"+cont+"").click(function(){
					var n_estudio_user=$(this).attr('data-id');
					var placa=$(this).attr('data-id2');
					var name_condu=$(this).attr('data-id3');
					var trailer=$(this).attr('data-id4');
					var n_estudio_real=$(this).attr('data-id5');
					var tipo_carro=$(this).attr('data-id6');
					var n_condu=$(this).attr('data-id7');
					
					$("#plak").val(placa);
					$("#n_estudioreal").val(n_estudio_real);
					$("#n_estudiouser").val(n_estudio_user);
					//alert(n_estudio_user);
					var t='';
					if(trailer==null){
						t='No aplica';
					}
					if(trailer!=null){
						t=trailer;
					}

					$("#tb_vehiculo").html('<tr>'+
						'<td>'+placa+'</td>'+
						'<td>'+tipo_carro+'</td>'+
						'<td>'+t+'</td>'+
						'<td>'+name_condu+'</td>'+
						'<td>'+n_condu+'</td>'+'</tr>');
					//traer solicitudes de servicio
					var dato={
						n_estudio_user:n_estudio_user,
						action:'cargar_solicitudes_servicio'
					};
					$("#tb_solicitudes").html('');
					$.ajax({
						url:$("#id_url_ajax").val() + "libs/lista_planillas_ajax.php",
			 			type:'POST',
			 			data:dato,
			 			dataType:'json',
			 			success: function(data){
			 				data.result.forEach(function(element,index){
			 					var conf;
			 					var conten=element.devol_contenedor;
			 					if(conten==1){
			 						conf='Si';
			 					}else{
			 						conf='No';
			 					}

			 					$("#tb_solicitudes").append('<tr>'+
			 						'<td>'+element.id_servicio_cliente+'</td>'+
			 						'<td>'+element.nombre_cliente+'</td>'+
			 						'<td>'+element.tipo_mercancia+'</td>'+
			 						'<td>'+element.peso_bruto_kg+'-'+element.peso_neto_kg+'</td>'+
			 						'<td>'+element.flete+'</td>'+
			 						'<td>'+conf+'</td>'+
			 						'<td>'+element.m1+'</td>'+
			 						'<td>'+element.m2+'</td></tr>');
			 				 });
			 			},
			 			error: function(jqXHR, textStatus, errorThrown){
			 				console.log('no trajo solicitudes');
			 				console.log(jqXHR);
							console.log(textStatus);
							console.log(errorThrown);
			 			}
	 				});
				});	
				//editar
				$("#erque_anticipo").val('');
				$("#btn_edite"+cont+"").click(function(){
					var n_estudio_user=$(this).attr('data-id');
					var placa=$(this).attr('data-id2');
					var name_condu=$(this).attr('data-id3');
					var trailer=$(this).attr('data-id4');
					var n_estudio_real=$(this).attr('data-id5');
					var n_planilla=$(this).attr('data-id6');
					var preci=$(this).attr('data-id7');
					var anti=$(this).attr('data-id8');
					var tipo_carro=$(this).attr('data-id9');
					var doc_condu=$(this).attr('data-id10');
					var tp=$(this).attr('data-id11');
					$("#n_estudiouser2").val(n_estudio_user);
					$("#enumtarjeta").val(tp);
					if(preci==1){
						//editar el que esta
						$("#poner_precinto").val('A');
						$("#editar_precinto").show();
						$("#editar_precinto_agregar").show();
					}else{
						//agregar datos y crear
						$("#poner_precinto").val('B');
						$("#editar_precinto").show();
						$("#editar_precinto_agregar").show();
						
					}

					if(anti==1){
						$("#erque_anticipo").append('<option value="1">Si</option>'+
							'<option value="0">No</option>');
						$("#ean_flete").prop("disabled", false);
						$("#ean_porcentaje").prop("disabled", false);
						$("#ean_liquidado").prop("disabled", false);
					}else{
						$("#erque_anticipo").append('<option value="0">No</option>'+
							'<option value="1">Si</option>');
						$("#ean_flete").prop("disabled", false);
						$("#ean_porcentaje").prop("disabled", false);
						$("#ean_liquidado").prop("disabled", false);
					}

					$("#num_plantilla").val(n_planilla);
					$("#etb_vehiculo").html('<tr>'+
						'<td>'+placa+'</td>'+
						'<td>'+tipo_carro+'</td>'+
						'<td>'+trailer+'</td>'+
						'<td>'+name_condu+'</td>'+
						'<td>'+doc_condu+'</td>'
					+'</tr>');
					//consultar solicitudes de servicio
					var dato={
						n_estudio_user:n_estudio_user,
						action:'cargar_solicitudes_servicio'
					};
					$("#etb_solicitudes").html('');
					$.ajax({
						url:$("#id_url_ajax").val() + "libs/lista_planillas_ajax.php",
			 			type:'POST',
			 			data:dato,
			 			dataType:'json',
			 			success: function(data){
			 				data.result.forEach(function(element,index){
			 					var conf;
			 					var conten=element.devol_contenedor;
			 					if(conten==1){
			 						conf='Si';
			 					}else{
			 						conf='No';
			 					}
			 					$("#etb_solicitudes").append('<tr>'+
			 						'<td>'+element.id_servicio_cliente+'</td>'+
			 						'<td>'+element.nombre_cliente+'</td>'+
			 						'<td>'+element.tipo_mercancia+'</td>'+
			 						'<td>'+element.peso_bruto_kg+'<br>'+element.peso_neto_kg+'</td>'+
			 						'<td>'+element.flete+'</td>'+
			 						'<td>'+conf+'</td>'+
			 						'<td>'+element.m1+'</td>'+
			 						'<td>'+element.m2+'</td>'+'</tr>');
			 				 });
			 			},
			 			error: function(jqXHR, textStatus, errorThrown){
			 				console.log('no trajo solicitudes');
			 				console.log(jqXHR);
							console.log(textStatus);
							console.log(errorThrown);
			 			}
	 				});
					//consultar ordenes de cargue
					var orden={
						n_planilla:n_planilla,
						action:'ecargar_datos_planilla'
					};
					$("#etabla_ordenes").html('');
					$("#etabla_precinto").html('');

					$.ajax({
						url:$("#id_url_ajax").val() + "libs/lista_planillas_ajax.php",
			 			type:'POST',
			 			data:orden,
			 			dataType:'json',
			 			success: function(data){
			 				console.log(data);
			 				if(data){
			 					var a=0; b=0; c=0;
			 					if(data.result!=null){
			 						$("#ean_flete").val(data.result[0].valor_anticipo);
			 						$("#ean_porcentaje").val(data.result[0].porcentaje_anticipo);
			 						$("#ean_liquidado").val(data.result[0].anticipo_liquidado);
			 						$("#en_mani").val(data.result[0].n_manifiesto);
			 						$("#efec_mani").val(data.result[0].fecha_manifiesto);

			 						//finales
			 						var ori=$("#eorigen_final").val('');
			 						data.result[0].origen_final.forEach(function(element,index){
			 							var tmpselected;
			 							if(element.selected){
			 								tmpselected="selected";
			 							}
			 							ori=$("#eorigen_final").append('<option '+tmpselected+' value="'+element.rndc_codigo_ciudad+'">'+element.municipio+'-'+element.depto+'</option>');

			 						});	

			 						var des=$("#edestino_final").val('');
			 						data.result[0].destino_final.forEach(function(element,index){
			 							var tmpselected;
			 							if(element.selected){
			 								tmpselected="selected";
			 							}
			 							ori=$("#edestino_final").append('<option '+tmpselected+' value="'+element.rndc_codigo_ciudad+'">'+element.municipio+'-'+element.depto+'</option>');

			 						});	

			 						var car=$("#etv_final").val('');
			 						data.result[0].tvehiculo_final.forEach(function(element,index){
			 							var tmpselected;
			 							if(element.selected){
			 								tmpselected="selected";
			 							}
			 							car=$("#etv_final").append('<option '+tmpselected+' value="'+element.id_vehiculo+'">'+element.vehiculo+'</option>');

			 						});	
			 					}	

			 					if(data.result2!=null){
			 						data.result2.forEach(function(element,index){
			 							b++;
			 							$("#e_totordenes").val(b);

			 							var ch='<input type="button" id="p'+b+'" class="btn-primary" value="Remover"  onclick="delete_asocia(this.id,'+b+')"  >';

			 							$("#etabla_ordenes").append('<tr id="tbo'+b+'" class="tr'+b+'"><tr id="mnf'+b+'" class="tr'+b+'">'+
			 								'<label>#</label><td colspan="2"><input type="text" id="id_orden'+b+'" class="form-control input-xs text-center tr'+b+'" value="'+element.id+'" disabled="disabled">'+
			 								'<label>N° solicitud</label><input type="text" id="servi'+b+'" class="form-control input-sm text-center" value="'+element.id_servicio+'" disabled="disabled"></td>'+
			 								'</tr><tr class="tr'+b+'">'+
			 								'<th class="tr'+b+'">N° orden</th><th class="tr'+b+'">Fecha orden</th>'+
			 								'</tr><tr class="tr'+b+'">'+
			 								'<td> <input type="number" id="n_orden'+b+'" class="form-control input-xs tr'+b+'" value="'+element.orden_cargue+'"></td>'+
			 								'<td> <input type="date" id="f_orden'+b+'" class="form-control input-xs tr'+b+'" value="'+element.fecha_orden+'"></td>'+
			 								'</tr><tr class="tr'+b+'">'+
			 								'<th class="tr'+b+'">N° remesa</th><th class="tr'+b+'">Fecha remesa</th>'+
			 								'</tr><tr class="tr'+b+'">'+
			 								'<td> <input type="number" id="n_remesa'+b+'" class="form-control input-xs tr'+b+'" value="'+element.remesa+'" ></td>'+
			 								'<td> <input type="date" id="f_remesa'+b+'" class="form-control input-xs tr'+b+'" value="'+element.fecha_remesa+'"></td>'+
			 								'<td>'+ch+'<input type="hidden" class="identi tr'+b+'" value="1"> <input type="hidden" id="sy'+b+'" value="1">  </td>'+'</tr></tr>');
			 							$("#ecant_orden").val(b);
			 							
			 						});
			 					}

			 					if(data.result3!=null){
			 						data.result3.forEach(function(element,index){
			 							c++;

			 							$("#e_totprecintos").val(c);
			 							var tipifica='';
			 							if(element.tipo_precinto=='Botella'){
			 								tipifica='<select id="tipo_precinto'+c+'" class="form-control input-sm trp'+c+'">'+
			 								'<option value="'+element.tipo_precinto+'">'+element.tipo_precinto+'</option>'+
			 								'<option value="Plastico">Platico</option>'+
			 								'<option value="Metalico">Metalico</option>'+
			 								'</select>';
			 							}

			 							if(element.tipo_precinto=='Plastico'){
			 								tipifica='<select id="tipo_precinto'+c+'" class="form-control input-sm trp'+c+'">'+
			 								'<option value="'+element.tipo_precinto+'">'+element.tipo_precinto+'</option>'+
			 								'<option value="Botella">Botella</option>'+
			 								'<option value="Metalico">Metalico</option>'+
			 								'</select>';
			 							}

			 							if(element.tipo_precinto=='Metalico'){
			 								tipifica='<select id="tipo_precinto'+c+'" class="form-control input-sm trp'+c+'">'+
			 								'<option value="'+element.tipo_precinto+'">'+element.tipo_precinto+'</option>'+
			 								'<option value="Botella">Botella</option>'+
			 								'<option value="Plastico">Plastico</option>'+
			 								'</select>';
			 							}

			 							var ch='<input type="button" id="pr'+c+'" class="btn-primary trp'+c+'" value="Remover"  onclick="delete_precinto(this.id,'+c+')"  >';
			 							$("#etabla_precinto").append('<tr class="trp'+c+'">'+
			 							'<td> <input type="text" id="idtb_precinto'+c+'" class="form-control input-xs trp'+c+'" value="'+element.id+'" disabled="disabled"> </td>'+	
			 							'<td> <input type="text" id="num_precinto'+c+'" class="form-control input-sm trp'+c+'" value="'+element.serie_precinto+'"> </td>'+
			 							'<td>'+tipifica+'</td>'+
			 							'<td>'+ch+'<input type="hidden" class="identip" value="1"> <input type="hidden" id="sz'+c+'" value="1"> </td>'+
			 							'</tr>');
			 							$("#e_totprecintos").val(c);
			 						});
			 					}
			 				}
			 			},
			 			error:function(jqXHR, textStatus, errorThrown){
			 				console.log(jqXHR);
							console.log(textStatus);
							console.log(errorThrown);
			 			}	
			 		});	
				});
				//ver 
				$("#btn_ver"+cont+"").click(function(){
					var n_estudio_user=$(this).attr('data-id');
					var placa=$(this).attr('data-id2');
					var name_condu=$(this).attr('data-id3');
					var trailer=$(this).attr('data-id4');
					var n_estudio_real=$(this).attr('data-id5');
					var n_planilla=$(this).attr('data-id6');
					var tipo_carro=$(this).attr('data-id7');
					var n_condu=$(this).attr('data-id8');
					var tarjeta=$(this).attr('data-id9');

					$("#vnum_plantilla").val(n_planilla);
					$("#vtarjeta").val(tarjeta);
					$("#vtb_vehiculo").html('<tr>'+
						'<td>'+placa+'</td>'+
						'<td>'+tipo_carro+'</td>'+
						'<td>'+trailer+'</td>'+
						'<td>'+name_condu+'</td>'+
						'<td>'+n_condu+'</td>'+
					+'</tr>');
					//consultar solicitudes de servicio
					var dato={
						n_estudio_user:n_estudio_user,
						action:'cargar_solicitudes_servicio'
					};
					$("#vtb_solicitudes").html('');
					$.ajax({
						url:$("#id_url_ajax").val() + "libs/lista_planillas_ajax.php",
			 			type:'POST',
			 			data:dato,
			 			dataType:'json',
			 			success: function(data){
			 				data.result.forEach(function(element,index){
			 					var conf;
			 					var conten=element.devol_contenedor;
			 					if(conten==1){
			 						conf='Si';
			 					}else{
			 						conf='No';
			 					}
			 					$("#vtb_solicitudes").append('<tr>'+
			 						'<td>'+element.id_servicio_cliente+'</td>'+
			 						'<td>'+element.nombre_cliente+'</td>'+
			 						'<td>'+element.tipo_mercancia+'</td>'+
			 						'<td>'+element.peso_bruto_kg+'<br>'+element.peso_neto_kg+'</td>'+
			 						'<td>'+element.flete+'</td>'+
			 						'<td>'+conf+'</td>'+
			 						'<td>'+element.m1+'</td>'+
			 						'<td>'+element.m2+'</td>'+'</tr>');
			 				 });
			 			},
			 			error: function(jqXHR, textStatus, errorThrown){
			 				console.log('no trajo solicitudes');
			 				console.log(jqXHR);
							console.log(textStatus);
							console.log(errorThrown);
			 			}
	 				});
	 				//consultar ordenes de cargue
					var orden={
						n_planilla:n_planilla,
						action:'cargar_datos_planilla'
					};
					$("#vtabla_ordenes").html('');
					$("#vtabla_precinto").html('');
					$("#vori_final").val('');
					$("#vdes_final").val('');
					$("#vtv_final").val('');
					$.ajax({
						url:$("#id_url_ajax").val() + "libs/lista_planillas_ajax.php",
			 			type:'POST',
			 			data:orden,
			 			dataType:'json',
			 			success: function(data){
			 				if(data){
			 					var a=0; b=0; c=0;
			 					if(data.result!=null){
			 						$("#van_flete").val(data.result[0].valor_anticipo);
			 						$("#van_porcentaje").val(data.result[0].porcentaje_anticipo);
			 						$("#van_vanticipo").val(data.result[0].anticipo_liquidado);
			 						$("#vori_final").val(data.result[0].origen);
			 						$("#vdes_final").val(data.result[0].destino);
			 						$("#vtv_final").val(data.result[0].nombre);
			 						$("#v_manifiesto").val(data.result[0].n_manifiesto);
			 						$("#v_fmanifiesto").val(data.result[0].fecha_manifiesto);

			 					}	

			 					if(data.result2!=null){
			 						data.result2.forEach(function(element,index){
			 							b++;
			 							$("#vtabla_ordenes").append('<tr>'+
			 								'<label>#</label><td colspan="2"><input type="text" id="vid_orden'+b+'" class="form-control input-xs text-center" value="'+element.id+'" disabled="disabled">'+
			 								'<label>N° servicio</label><input type="text" id="vservi'+b+'" class="form-control input-sm text-center"  value="'+element.id_servicio+'" disabled="disabled"></td>'+
			 								'</tr><tr>'+
			 								'<th>N° orden</th><th>Fecha orden</th>'+
			 								'</tr><tr>'+
			 								'<td>'+element.orden_cargue+'</td>'+
			 								'<td>'+element.fecha_orden+'</td>'+
			 								'</tr><tr>'+
			 								'<th>N° remesa</th><th>Fecha remesa</th>'+
			 								'</tr><tr>'+
			 								'<td>'+element.remesa+'</td>'+
			 								'<td>'+element.fecha_remesa+'</td>'+
			 								'</tr></tr>');
			 						});
			 					}

			 					if(data.result3!=null){
			 						data.result3.forEach(function(element,index){
			 							c++;
			 							$("#vtabla_precinto").append('<tr>'+
			 							'<td>'+element.id+'</td>'+	
			 							'<td>'+element.serie_precinto+'</td>'+
			 							'<td>'+element.tipo_precinto+'</td>'+
			 							'</tr>');
			 						});
			 					}
			 				}
			 			},
			 			error:function(jqXHR, textStatus, errorThrown){
			 				console.log(jqXHR);
							console.log(textStatus);
							console.log(errorThrown);
			 			}	
			 		});	
				});
				//solicitar ruta
				$("#btn_sruta"+cont+"").click(function(){
					var n_estudio_user=$(this).attr('data-id');
					var placa=$(this).attr('data-id2');
					var name_condu=$(this).attr('data-id3');
					var trailer=$(this).attr('data-id4');
					var n_estudio_real=$(this).attr('data-id5');
					var n_planilla=$(this).attr('data-id6');
					var preci=$(this).attr('data-id7');
					var anti=$(this).attr('data-id8');
					var tipo_carro=$(this).attr('data-id9');
					var doc_condu=$(this).attr('data-id10');
					var mani=$(this).attr('data-id11');

					$("#splaca").val(placa);
					$("#snconductor").val(name_condu);
					$("#sconductor").val(doc_condu);
					$("#sestudio").val(n_estudio_user);
					$("#snplanilla").val(n_planilla);
					$("#smanifies").val(mani);
				});

				//editar solicitud de inicio ruta
				$("#btn_Esruta"+cont+"").click(function(){
					var nruta=$(this).attr('data-id');
					$("#idruta").val(nruta);
					var datoa={
						nruta:nruta,
						action:'consultar_solicitud_ruta'
					};
					$("#tb_uno").html('');
					$("#estado_ru").html('');
					$("#observa_ru").val('');
					$.ajax({
						url:$("#id_url_ajax").val() + "libs/lista_planillas_ajax.php",
			 			type:'POST',
			 			data:datoa,
			 			dataType:'json',
			 			success: function(data){
			 				if(data){
			 					var status;
			 					if(data.result[0].estado==1){
			 						status='Activo';
			 						$("#estado_ru").html('<option value="1">Activo</option>'+
			 							'<option value="0">Inactivo</option>');
			 					}

			 					if(data.result[0].estado==0){
			 						status='Inactivo';
			 						$("#estado_ru").html('<option value="0">Inactivo</option>'+
			 							'<option value="1">Activo</option>');
			 					}

			 					$("#observa_ru").val(data.result[0].observacion);

			 					data.result.forEach(function(element,index){
			 						$("#tb_uno").append('<tr>'+
			 						'<td>'+element.id_planilla+'</td>'+
			 						'<td>'+element.placa+'</td>'+
			 						'<td>'+
			 							'<span>'+element.fecha+'</span><br>'+
			 							'<span class="cell-detail-description">'+
			 							element.hora+'</span>'+
			 						'</td>'+
			 						'<td>'+element.usuario+'</td>'+
			 						'<td>'+status+'</td></tr>');
			 					});
			 				}
			 			},
			 			error: function(jqXHR, textStatus, errorThrown){
			 				console.log(jqXHR);
							console.log(textStatus);
							console.log(errorThrown);
			 			}	
			 		});	
				});


				//CIERRE DEL FOREACH DE LA TABLA PRINCIPAL
	 			});
	 		}
	 	},
	 	error: function(jqXHR, textStatus, errorThrown){

	 		if(jqXHR.status === 0){
	 			funct_msg_error("#nexos_messages_popup", 'Ha ocurrido un error en la consulta, Not connect: Verify Network');
	 		}else if(textStatus === 'parsererror'){
	 			funct_msg_error("#nexos_messages_popup", 'Ha ocurrido un error en la consulta, Requested JSON parse failed');
	 		}else if (textStatus === 'timeout') {
	 			funct_msg_error("#nexos_messages_popup", 'Ha ocurrido un error en la consulta, Time out error');
	 		}else if (jqXHR.status == 500) {
	 			funct_msg_error("#nexos_messages_popup", 'Ha ocurrido un error en la consulta, Internal Server Error [500].');
	 		}else if (textStatus === 'abort') {
	 			funct_msg_error("#nexos_messages_popup", 'Ha ocurrido un error en la consulta, Ajax request aborted');
	 		}else{
	 			funct_msg_error("#nexos_messages_popup", 'Ha ocurrido un error en la consulta, Ajax request aborted'+ jqXHR.responseText);
	 		}

	 	}	
	});			
	
}

//EDITAR
//si cambia algun dato poner el anticipo en 0
$("#eorigen_final").change(function(){
	$("#ean_flete").val('');
	$("#ean_porcentaje").val('');
	$("#ean_liquidado").val('');
	var ori=$("#eorigen_final").val();
	var des=$("#edestino_final").val();
	var car=$("#etv_final").val();
	recalcular_anticipo(ori,des,car);
});

$("#edestino_final").change(function(){
	$("#ean_flete").val('');
	$("#ean_porcentaje").val('');
	$("#ean_liquidado").val('');
	var ori=$("#eorigen_final").val();
	var des=$("#edestino_final").val();
	var car=$("#etv_final").val();
	recalcular_anticipo(ori,des,car);
});

$("#etv_final").change(function(){
	$("#ean_flete").val('');
	$("#ean_porcentaje").val('');
	$("#ean_liquidado").val('');
	var ori=$("#eorigen_final").val();
	var des=$("#edestino_final").val();
	var car=$("#etv_final").val();
	recalcular_anticipo(ori,des,car);
});


function recalcular_anticipo(ori,des,car){
	var calcule={
		ori:ori,
		des:des,
		car:car,
		action:'recalcular_anticipo'
	};

	$.ajax({
		url: $("#id_url_ajax").val() +"libs/lista_planillas_ajax.php",
		type: "POST",
		data:calcule,
		dataType:'json',
		success: function(data)
		{
			// console.log(data.result);
			if(data.result!=null){
				$("#ean_flete").val(data.result[0].tarifa);
			}else if(data.result==null){
				$("#ean_flete").val('');
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}

function Crear_Planilla(){

	var data = null;
	data = new FormData();
	data.append("accion", 'Creaciondeplanilla');
	//insertar cabecera datos del vehiculo + anticipo
	data.append("id_estudio", $("#n_estudioreal").val());
	data.append("id_estudiouser", $("#n_estudiouser").val());
	data.append("placa", $("#plak").val());
	data.append("valor_anti", $("#an_flete").val());
	data.append("porce_anti", $("#an_porcentaje").val());
	data.append("anti_liquida", $("#an_vanticipo").val());
	data.append("existe_anticipo", $("#requiere_anticipo").val());
	data.append("existe_precinto", $("#requiere_precinto").val());

	data.append("ori_final", $("#ori_final").val());
	data.append("des_final", $("#dest_final").val());
	data.append("tcarro_final", $("#tv_final").val());
	data.append("n_mani", $("#n_mani").val());
	data.append("fecha_mani", $("#fecha_mani").val());
	data.append("num_tarjeta", $("#num_tarjeta").val());
	data.append("cab", $("#cab").val());
	data.append("mer", 5);
	data.append("preci", 5);
	var idstudy=$("#n_estudioreal").val();
	$.ajax({
		url: ur,
		type: 'POST',
		data: data,
		cache: false,
		processData: false, // Don't process the files
		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		dataType: 'json',
		success: function (data, textStatus, jqXHR)
		{
			console.log('si inserto cabecera de planilla');	
			crearbloque(idstudy);	
			crearprecinto(idstudy);
			// alert('!!Registro Vehiculo exitosamente!!!');
		},
		/*error: function (jqXHR, textStatus, errorThrown)
		{
			var msg_error = data.error.replace(/\n/g , "</p><p>");
			$("#nexos_messages_popup_md").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
			$("#planillar_vehiculo").animate({ scrollTop: 0 }, 600);
			console.log('no inserto cabecera de planilla');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}*/
	});

	//insertar ordenes-remesa-manifiestos
	/*var f=$("#cantidad_orden").val();
	var i;
	for(i=1; i<=f; i++ ){
		if(typeof $("#st"+i).val() !== 'undefined'){
			var orden=$("#orden"+i+"").val();
			var fo=$("#fo"+i+"").val();
			var reme=$("#reme"+i+"").val();
			var freme=$("#fr"+i+"").val();
			var servi=$("#soliservicio"+i+"").val();
			data.append("n_orden", orden);
			data.append("fecha_orden", fo);
			data.append("n_reme", reme);
			data.append("fecha_reme", freme);
			data.append("solicitud", servi);
			data.append("mer", 2);
			data.append("cab", 5);
			data.append("preci", 5);
			$.ajax({
				url: ur,
				type: 'POST',
				data: data,
				cache: false,
				processData: false, // Don't process the files
				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				dataType: 'json',
				success: function (data, textStatus, jqXHR)
				{
					console.log('si inserto ordenes');
					// alert('!!Registro Vehiculo exitosamente!!!');
				},
				error: function (jqXHR, textStatus, errorThrown)
				{
					console.log('no inserto ordenes');
					console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
		}
	}*/

	//insertar precintos
	/*var p;
	for(p=1; p<=contador_global1; p++){
		if(typeof $("#sk"+p).val() !== 'undefined'){
			var num_preci=$("#num_preci"+p+"").val();
			var tipo_preci=$("#tipo_precinto"+p+"").val();
			data.append("num_preci", num_preci);
			data.append("tipo_preci", tipo_preci);
			data.append("preci", 3);
			data.append("mer", 5);
			data.append("cab", 5);
		
			$.ajax({
					url: ur,
					type: 'POST',
					data: data,
					cache: false,
					processData: false, // Don't process the files
					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
					dataType: 'json',
					success: function (data, textStatus, jqXHR)
					{
						console.log('si inserto precintos');
						// alert('!!Registro Vehiculo exitosamente!!!');
					},
					error: function (jqXHR, textStatus, errorThrown)
					{
						console.log('no inserto precintos');
						console.log(jqXHR);
						console.log(textStatus);
						console.log(errorThrown);
					}
			});
		}
	}*/

	//validar si todo esta ok
	//alert('Ok!! Registro Guardado Exitosamente!!');
	//location.reload(); 
}


function crearbloque(idstudio){
	var data = null;
	data = new FormData();
	data.append("accion", 'Creacionbloque');
	//insertar ordenes-remesa-manifiestos
	var f=$("#cantidad_orden").val();
	var i;
	for(i=1; i<=f; i++ ){
		if(typeof $("#st"+i).val() !== 'undefined'){
			var orden=$("#orden"+i+"").val();
			var fo=$("#fo"+i+"").val();
			var reme=$("#reme"+i+"").val();
			var freme=$("#fr"+i+"").val();
			var servi=$("#soliservicio"+i+"").val();
			data.append("n_orden", orden);
			data.append("fecha_orden", fo);
			data.append("n_reme", reme);
			data.append("fecha_reme", freme);
			data.append("solicitud", servi);
			data.append("idstudio", idstudio);
			data.append("mer", 2);
			data.append("cab", 5);
			data.append("preci", 5);
			$.ajax({
				url: ur,
				type: 'POST',
				data: data,
				cache: false,
				processData: false, // Don't process the files
				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				dataType: 'json',
				success: function (data, textStatus, jqXHR)
				{
					console.log('si inserto ordenes');
					// alert('!!Registro Vehiculo exitosamente!!!');
				},
				error: function (jqXHR, textStatus, errorThrown)
				{
					console.log('no inserto ordenes');
					console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
		}
	}

}


function crearprecinto(idstudio){
	var data = null;
	data = new FormData();
	data.append("accion", 'Creacionprecinto');
	//insertar precintos
	var p;
	for(p=1; p<=contador_global1; p++){
		if(typeof $("#sk"+p).val() !== 'undefined'){
			var num_preci=$("#num_preci"+p+"").val();
			var tipo_preci=$("#tipo_precinto"+p+"").val();
			data.append("num_preci", num_preci);
			data.append("tipo_preci", tipo_preci);
			data.append("idstudio", idstudio);
			data.append("preci", 3);
			data.append("mer", 5);
			data.append("cab", 5);
		
			$.ajax({
					url: ur,
					type: 'POST',
					data: data,
					cache: false,
					processData: false, // Don't process the files
					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
					dataType: 'json',
					success: function (data, textStatus, jqXHR)
					{
						console.log('si inserto precintos');
						// alert('!!Registro Vehiculo exitosamente!!!');
					},
					error: function (jqXHR, textStatus, errorThrown)
					{
						console.log('no inserto precintos');
						console.log(jqXHR);
						console.log(textStatus);
						console.log(errorThrown);
					}
			});
		}
	}

	alert('!!Registro Vehiculo exitosamente!!!');
	location.reload();

}





function cambioservicio(element,id){
	var soliactual=$("#soliservicio"+id).val();
	$("#validaservi"+id).val(soliactual);
}



function Editar_planilla(){
	
	
	var data = null;
	data = new FormData();
	var preci='';
	var accion=$("#poner_precinto").val();
	if($(".identip").size()>0){
		preci=1;
	}else if($("#ep").val()>0){
		preci=1;
	}else{
		preci=0;
	}

	data.append("accion", 'Ediciondeplanilla');
	data.append("num_plantilla", $("#num_plantilla").val());
	data.append("eanticipo", $("#ean_flete").val());
	data.append("eporcentaje", $("#ean_porcentaje").val());
	data.append("ean_liquidado", $("#ean_liquidado").val());
	//finales
	data.append("eorigen_final", $("#eorigen_final").val());
	data.append("edestino_final", $("#edestino_final").val());
	data.append("etv_final", $("#etv_final").val());
	data.append("en_mani", $("#en_mani").val());
	data.append("efec_mani", $("#efec_mani").val());
	data.append("enumtarjeta", $("#enumtarjeta").val());

	data.append("preci", preci);
	data.append("s_cab", 1);
	data.append("asociacion", 5);
	data.append("asociacion_insert", 5);
	data.append("seal", 5);

	$.ajax({
		url: ur,
		type: 'POST',
		data: data,
		cache: false,
		processData: false, // Don't process the files
		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		dataType: 'json',
		success: function (data, textStatus, jqXHR)
		{
			
		},
		error: function (jqXHR, textStatus, errorThrown)
		{
			console.log('no edito planilla');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});

	//ordenes de cargue actualizar
	var cant_ordenes=$(".identi").size();
	var d=$("#ecant_orden").val();
	if(cant_ordenes>0){
		var i;
		for(i=1;i<=d;i++){
			if(typeof $("#sy"+i).val()!=='undefined'){
				var idtabla=$("#id_orden"+i+"").val();
				var n_orden=$("#n_orden"+i+"").val();
				var f_orden=$("#f_orden"+i+"").val();
				var n_remesa=$("#n_remesa"+i+"").val();
				var f_remesa=$("#f_remesa"+i+"").val();
				data.append("idtabla", idtabla);
				data.append("n_orden", n_orden);
				data.append("f_orden", f_orden);
				data.append("n_remesa", n_remesa);
				data.append("f_remesa", f_remesa);
				data.append("num_plantilla", $("#num_plantilla").val());
				data.append("asociacion", 2);
				data.append("asociacion_insert", 5);
				data.append("s_cab", 5);
				data.append("seal", 5);
				data.append("seal_insert", 5);
				$.ajax({
					url: ur,
					type: 'POST',
					data: data,
					cache: false,
					processData: false, // Don't process the files
					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
					dataType: 'json',
					success: function (data, textStatus, jqXHR)
					{
						console.log('guardo asociacion editar');
						// alert('Ok!! Solicitud Actualizada Exitosamente!!');
						// location.reload(); 
					},
					error: function (jqXHR, textStatus, errorThrown)
					{
						console.log('no guardo asociacion editar');
						console.log(jqXHR);
						console.log(textStatus);
						console.log(errorThrown);
					}
				});
			}
		}
	}

	//ordenes de cargue insertar
	var k=$("#mcantidad_orden").val();
	var s;
	for(s=1; s<=k; s++){
		if(typeof $("#sd"+s).val() !=='undefined'){
			var eorden=$("#eorden"+s+"").val();
			var efo=$("#efo"+s+"").val();
			var ereme=$("#ereme"+s+"").val();
			var efr=$("#efr"+s+"").val();
			var eservi=$("#eservicio"+s+"").val();
			data.append("eorden", eorden);
			data.append("efo", efo);
			data.append("ereme", ereme);
			data.append("efr", efr);
			data.append("eservicio", eservi);
			data.append("num_plantilla", $("#num_plantilla").val());
			data.append("asociacion_insert", 3);
			data.append("asociacion", 5);
			data.append("s_cab", 5);
			data.append("seal", 5);
			data.append("seal_insert", 5);

			$.ajax({
				url: ur,
				type: 'POST',
				data: data,
				cache: false,
				processData: false, // Don't process the files
				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				dataType: 'json',
				success: function (data, textStatus, jqXHR)
				{
					console.log('guardo asociacion inser editar');
					// alert('Ok!! Solicitud Actualizada Exitosamente!!');
					// location.reload(); 
				},
				error: function (jqXHR, textStatus, errorThrown)
				{
					console.log('no guardo asociacion inser editar');
					console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
		}	
	}

	//precintos - actualizar
	var cpre=$(".identip").size();
	var pt=$("#e_totprecintos").val();
	if(cpre>0){
		var f;
		for(f=1; f<=pt; f++){
			if(typeof $("#sz"+f).val()!=='undefined'){
				var idtb_precinto=$("#idtb_precinto"+f+"").val();
				var tipo_precinto=$("#tipo_precinto"+f+"").val();
				var num_precinto=$("#num_precinto"+f+"").val();
				data.append("idtb_precinto", idtb_precinto);
				data.append("tipo_precinto", tipo_precinto);
				data.append("num_precinto", num_precinto);
				data.append("num_plantilla", $("#num_plantilla").val());
				data.append("seal", 4);
				data.append("seal_insert", 5);
				data.append("asociacion_insert", 5);
				data.append("asociacion", 5);
				data.append("s_cab", 5);
				$.ajax({
					url: ur,
					type: 'POST',
					data: data,
					cache: false,
					processData: false, // Don't process the files
					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
					dataType: 'json',
					success: function (data, textStatus, jqXHR)
					{
						console.log('guardo precintos editar');
						// alert('Ok!! Solicitud Actualizada Exitosamente!!');
						// location.reload(); 
					},
					error: function (jqXHR, textStatus, errorThrown)
					{
						console.log('no guardo precintos editar');
						console.log(jqXHR);
						console.log(textStatus);
						console.log(errorThrown);
					}
				});
			}
		}
	}

	//precintos - agregar mas
	var pr=$("#ep").val();
	var g;
	for(g=1; g<=pr; g++){
		if(typeof $("#sm"+g).val() !=='undefined'){
			var eatipo_precinto=$("#eatipo_precinto"+g+"").val();
			var eanum_preci=$("#eanum_preci"+g+"").val();
			data.append("eatipo_precinto", eatipo_precinto);
			data.append("eanum_preci", eanum_preci);
			data.append("num_plantilla", $("#num_plantilla").val());
			data.append("seal_insert", 6);
			data.append("seal", 5);
			data.append("asociacion_insert", 5);
			data.append("asociacion", 5);
			data.append("s_cab", 5);
			$.ajax({
				url: ur,
				type: 'POST',
				data: data,
				cache: false,
				processData: false, // Don't process the files
				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				dataType: 'json',
				success: function (data, textStatus, jqXHR)
				{
					console.log('guardo insercion precintos editar');
					// alert('Ok!! Solicitud Actualizada Exitosamente!!');
					// location.reload(); 
				},
				error: function (jqXHR, textStatus, errorThrown)
				{
					console.log('no guardo insercion precintos editar');
					console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
		}
	}

	alert('Ok!! Solicitud Actualizada Exitosamente!!');
	location.reload(); 
}


function Solicitar_Inicioruta(){
	var data = null;
	data = new FormData();
	data.append("accion", 'Solicitainicioruta');
	data.append("splaca", $("#splaca").val());
	data.append("sconductor", $("#sconductor").val());
	data.append("sestudio", $("#sestudio").val());
	data.append("snplanilla", $("#snplanilla").val());
	data.append("smanifies", $("#smanifies").val());
	data.append("sfecha", $("#sfecha").val());
	data.append("shora", $("#shora").val());
	data.append("sobserva", $("#sobserva").val());

	$.ajax({
		url: ur,
		type: 'POST',
		data: data,
		cache: false,
		processData: false, // Don't process the files
		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		dataType: 'json',
		success: function (data, textStatus, jqXHR)
		{
			alert('Ok!! Se Registro Exitosamente!!');
			location.reload(); 
		},
		error: function (jqXHR, textStatus, errorThrown)
		{
			alert('No registro incio de ruta');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
	
}

function Editar_solicitud(){
	var idruta=$("#idruta").val();
	var estado=$("#estado_ru").val();
	var ob=$("#observa_ru").val();
	var datos={
		idruta:idruta,
		estado:estado,
		ob:ob,
		action:'actualizar_soliruta'
	};

	$.ajax({
		url: $("#id_url_ajax").val() +"libs/lista_planillas_ajax.php",
		type: "POST",
		data:datos,
		dataType:'json',
		success: function(data)
		{
			if(data){
				alert('¡¡¡Registro Solicitud Exitosamente!!!');
				location.reload(); 
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});


}