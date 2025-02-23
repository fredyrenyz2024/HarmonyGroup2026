$(document).ready(function(){
	$("#contenedor_dato").css("display", "none");
	$("#tabla_filtro").css("display", "block");	
	$("#buscar_datos").click(function(){
		consultar_tabla();
	});
});	

function consultar_tabla(){
	$("#contenedor_dato").css("display", "none");
	$("#tabla_filtro").css("display", "block");	
	var finicio=$("#fec_incio").val();
	var ffinal=$("#fec_final").val();
	$.post($("#id_url_ajax").val()+'transporte/Consultasubasta','fi='+finicio+'&ff='+ffinal,function(dato){
			//$("#filtro_cliente").html('');
			$("#filtro_subasta").html('');
		if(dato){
			for(var i = 0; i < dato.length; i++){
				var finicio=(dato[i]['fecha_inicio']+' '+dato[i]['hora_inicio']);
				var ffinal=(dato[i]['fecha_finaliza']+' '+dato[i]['hora_finaliza']);
				var statu='';
				var btn_ver='';
				var btn_cancela='';
				var result='';
				var boton='';
				var btn_ver='<button class="btn btn-space btn-secondary btn-sm mdi mdi-eye" title="Consultar"  onClick="Ver_subasta_s('+dato[i]['id']+');"></button>';
				var btn_resultado='<button class="btn btn-space btn-secondary btn-sm mdi mdi-label" title="Estudios seguridad"  onClick="Resultado('+dato[i]['id']+');"></button>';
				var boton='<button class="btn btn-space btn-secondary btn-sm mdi mdi-refresh-alt" title="Automatización"  onClick="Calcular(this);"'+
				'data-id="'+dato[i]['id']+'"  data-id2="'+finicio+'"  data-id3="'+ffinal+'"  data-id4="'+dato[i]['estado']+'"></button>';

				if(dato[i]['estado']==1){
					statu='<td class="nexos-txt-success">'+
						'<center><span class="mdi mdi-dot-circle icon" title="Abierta"></span></center>'+
					'</td>';
					var btn_cancela='<button class="btn btn-space btn-secondary btn-sm mdi mdi-close" title="Cancelar subasta" onClick="Validar_subasta('+dato[i]['id']+');"></button>';
				}
				if(dato[i]['estado']==0){
					statu='<td class="nexos-txt-danger">'+
						'<center><span class="mdi mdi-dot-circle icon" title="Cerrada"></span></center>'+
					'</td>';
				}

				if(dato[i]['estado']==3){
					statu='<td class="nexos-txt-primary">'+
						'<center><span class="mdi mdi-dot-circle icon" title="Finalizada"></span></center>'+
					'</td>';
				}
				//validar fecha de finalizacion vs fecha hoy
				var fhoy=moment().format('YYYY-MM-DD H:mm:ss');
				var ffinal=dato[i]['fecha_finaliza']+' '+
				dato[i]['hora_finaliza'];
				
				//var diferencia=fecha_fin.diff(fhoy,'hours');
				//if(fhoy.valueOf()==ffinal.valueOf()){
					//validar si tiene flete aprobado, si tiene cerrar las solicitudes de servicio
					/*$.post($("#id_url_ajax").val()+'transporte/Consulta_aprobacion','idsubasta='+dato[i]['id'],function(dato){
						if(dato){
							//cerrar solicitudes de servicio
							alert(dato[i]['id']);
							alert(dato[0]['estado']);
							//Status_solicitudes(dato[i]['id'],dato[0]['estado']);
						}
					},'json');*/	
				//}

				$("#filtro_subasta").append('<tr>'+statu+
					'<td>'+dato[i]['id']+'</td>'+
					'<td>'+dato[i]['fecha_inicio']+
					' / '+dato[i]['fecha_finaliza']
					+'</td>'+
					'<td>'+dato[i]['fecha']+'</td>'+
					'<td>'+dato[i]['usuario']+'</td>'+
					'<td>'+
						btn_ver+'&nbsp;&nbsp;'+
						btn_cancela+'&nbsp;&nbsp;'+
						btn_resultado+'&nbsp;&nbsp;'+
						boton+
					'</td>'+
				'</tr>');
			}	
		}
	},'json');
}


function Ver_subasta_s(id){
	$("#tabla_filtro").css("display", "none");
	$("#contenedor_dato").css("display", "block");
	$(".FP").hide();
	$(".FT").hide();
	$(".FM").hide();
	$(".mg_title").html('');
	$(".FP2").html('');
	$.post($("#id_url_ajax").val()+'transporte/Consulta_subasta_vs','id_subasta='+id, function(data){
		if(data){
			$(".mg_title").html('Solicitudes de servicio');
			for(var i = 0; i < data.length; i++){
				$(".FP2").append('<span class="badge badge-dark">'+data[i]['numer_solservicio']+'</span>');
			}
			Ver_subasta(id);
		}
	},'json');
}


function Ver_subasta($id){
	$("#tabla_filtro").css("display", "none");
	$("#contenedor_dato").css("display", "block");
	$(".FP").html('');
	$(".FP").show();
	$(".FT").hide();
	$(".FM").hide();
	$.post($("#id_url_ajax").val()+'transporte/Consulta_subasta_v','id_subasta='+$id, function(data){
		if(data){
		    for(var i = 0; i < data.length; i++){
		    	table='<div class="panel panel-default">'+
      					'<div class="panel-body" id="panel_principal">'+
			       '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
			       	'<label>Solicitud de estudio</label>'+	
			       	'<input type="text" class="form-control input-xs" value="'+data[i]['num_estudioseguridad']+'" readonly="readonly">'+
			       '</div>'+
			        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
			      		'<label>Placa</label>'+
			      		'<input type="text" class="form-control input-xs" value="'+data[i]['placa']+'" readonly="readonly">'+
			       '</div>'+
			        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
			      		'<label>Conductor</label>'+
			      		'<input type="text" class="form-control input-xs" value="'+data[i]['nombre_conductor']+'" readonly="readonly">'+
			       '</div>'+
			       '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
			        	'<label>Flete sugerido</label>'+
			        	'<input type="text" class="form-control input-xs" value="'+data[i]['flete_sugerido']+'" readonly="readonly">'+
			       '</div>'+
			       '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
			        	'<label>Flete propuesto</label>'+
			        	'<input type="text" class="form-control input-xs" value="'+data[i]['flete_propuesto']+'" readonly="readonly">'+
			       '</div>'+
			       '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
			       		'<label>Id</label>'+
			       		'<input type="text" class="form-control input-xs" value="'+data[i]['id']+'" readonly="readonly">'+
			       '</div>'+
			        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
			       		'<label>Estado Flete</label>'+
			       		'<input type="text" class="form-control input-xs" style="font-weight:800; font-size:medium;" value="'+data[i]['estado_flete']+'" readonly="readonly">'+
			       '</div>'+
			        '</div></div>';
		   		 $(".FP").append(table);
		    }
		}
	},'json');
}

function Validar_subasta($id){//validar si la subasta tiene un flete aprobado
	$.post($("#id_url_ajax").val()+'transporte/Valide_subasta','id_subasta='+$id, function(data){
		var id_flete=data[0]['id_suba_flete'];
		var status=data[0]['estado'];
		var valor_sub=data[0]['id_suba'];
		if(id_flete > 0 && status=='aprobado'){
			Cancelar_subasta(id_flete,valor_sub);
		}else{
			alert('Señor usuario esta subasta aún no tiene un flete Aprobado');
		}
	},'json');
}


function Cancelar_subasta(idflete,idsub){
	$.post($("#id_url_ajax").val()+'transporte/Cancelar_subasta','idflete='+idflete+'&id_subasta='+idsub, function(data){
		if(data=='true'){
			alert('Subasta Finalizada Exitosamente!!');
			consultar_tabla();
		}
		if(data=='false'){
			alert('Ha ocurrido un error!!');
		}
	},'json');
}

function Resultado(idsub){
	$.post($("#id_url_ajax").val()+'transporte/Estado_estudio','id_subasta='+idsub, function(data){
		$("#cuerpo_estado").html('');
		$(".mg_title").html('');
		if(data){
			$("#tabla_filtro").css("display", "none");
			$("#contenedor_dato").css("display", "block");
			$(".FM").hide();
			$(".FP").hide();
			$(".FT").show();
			var body='';
			 for(var i = 0; i < data.length; i++){
			 	body='<tr>'+
			 		'<td>'+data[i]['id']+'</td>'+
			 		'<td>'+data[i]['id_suba_servicio']+'</td>'+
			 		'<td>'+data[i]['placa']+'</td>'+
			 		'<td>'+data[i]['nombre']+'</td>'+
			 		'<td>'+data[i]['numero_documento']+'</td>'+
			 		'<td>'+data[i]['num_seguridad']+'</td>'+
			 		'<td>'+data[i]['estado']+'</td>'
			 	+'</tr>';
			 	$("#cuerpo_estado").append(body); 
			 }
		}	
	},'json');
}

function Calcular(element){
	$("#flete_ganador").val('');
	$("#id_fleteg").val('');
	$("#n_subasta").val('');
	$("#splaca").val('');
	$("#estadofle").val('');

	$("#cuerpo_calculo").html('');
	var elemento =$(element);
	var idsub = elemento.data("id");
	var finicio = elemento.data("id2");
	var ffin = elemento.data("id3");
	var estado = elemento.data("id4");//estado de la subasta
	var e='';
	var a;
	if(estado==1){
		//buscar todos los fletes propuestos para esa subasta
		$.post($("#id_url_ajax").val()+'transporte/Consultar_fletes','id_subasta='+idsub, function(data){
			$("#flete_ganador").val('');
			$("#id_fleteg").val('');
			if(data){
				/*$("#flete_ganador").val(data[0]['mfletepropuesto']);
				$("#id_fleteg").val(data[0]['id_flete']);
				$("#n_subasta").val(data[0]['id_suba']);
				$("#splaca").val(data[0]['placa']);*/
				var cantidad=data.length;
				if(cantidad > 1){//trae mas de un flete, comparar
					//encontrar el flete con la mayor cantidad de viajes 
				
					var arreglo= new Array();
					for(var i=0; i < data.length; i++){
						arreglo.push(data[i]['cant_viajes']);
					}
					var maximo=Math.max.apply(Math,arreglo);
					for(var m=0; m < data.length; m++){
						if(data[m]['cant_viajes']==maximo){
							//FLETE FINALIZTA
							var fletepropuesto=data[m]['mfletepropuesto'];
							var flete_cotizado=data[m]['flete_sugerido'];
							var num_estudiosegu=data[m]['num_estudioseguridad'];
							var plak=data[m]['placa'];
							var idflete=data[m]['id_flete'];
							var idsuba=data[m]['id_suba'];
							//Validar si el flete finalizta es mayor o igual al flete cotizado
							if(fletepropuesto >= flete_cotizado){
								$.post($("#id_url_ajax").val()+'transporte/Valida_Vigencia','num_estudio='+num_estudiosegu+'&placa='+plak,function(data){
									if(data){//validar vigencia del estudio de seguridad
										var fhoy=moment();
										var tf=fhoy.diff(data[0]['fecha'],'days');
										if(data[0]['estado']=='Aprobado'  && tf==0){
											$("#flete_ganador").val(fletepropuesto);
											$("#id_fleteg").val(idflete);
											$("#n_subasta").val(idsuba);
											$("#splaca").val(plak);
											$("#estadofle").val('Ganador');
											Actualiza_Flete();
										}
										else{
											alert('El estudio '+num_estudiosegu+' no es vigente');
										}
									}
								},'json');
							}
						}
					}
					//fin
				}

				if(cantidad == 1){//trae el valor mínimo

					//comparar el flete con el flete sugerido
					var tarifa_venta=data[0]['total_tarifa'];
					var idflete=data[0]['id_flete'];
					var idsuba=data[0]['id_suba'];
					var num_estudiosegu=data[0]['num_estudioseguridad'];
					var plak=data[0]['placa'];
					var fletepropuesto=parseFloat(data[0]['mfletepropuesto']);
					var fletecotizado=parseFloat(data[0]['flete_sugerido']);
					if(fletepropuesto <= fletecotizado){
						alert('IF');
						//validar vigencia del estudio de seguridad
						$.post($("#id_url_ajax").val()+'transporte/Valida_Vigencia','num_estudio='+num_estudiosegu+'&placa='+plak,function(data){
							if(data){
								var fhoy=moment();
								var tf=fhoy.diff(data[0]['fecha'],'days');
								if(data[0]['estado']=='Aprobado'  && tf==0){
									$("#flete_ganador").val(fletepropuesto);
									$("#id_fleteg").val(idflete);
									$("#n_subasta").val(idsuba);
									$("#splaca").val(plak);
									$("#estadofle").val('Ganador');
									Actualiza_Flete();
								}else{
									alert('El estudio '+num_estudiosegu+' no es vigente');
								}
							}else{
								alert('No hay estudios de seguridad aprobados');
							}
						},'json');	
					}else{//FLETE OPERACIONES ES MAYOR AL FLETE COTIZACIONES
						//calcular la rentabilidad
						
						var resta=(parseFloat(tarifa_venta)-parseFloat(data[0]['mfletepropuesto']));
						var calculo=(parseFloat(resta)/parseFloat(fletepropuesto));
						var res=(parseFloat(calculo)*100);
						if(res>=15){
							alert('MAYOR A 15');
							$.post($("#id_url_ajax").val()+'transporte/Valida_Vigencia','num_estudio='+num_estudiosegu+'&placa='+plak,function(data){
								if(data){
									var fhoy=moment();
									var tf=fhoy.diff(data[0]['fecha'],'days');
									if(data[0]['estado']=='Aprobado'  && tf==0){

										$("#flete_ganador").val(fletepropuesto);
										$("#id_fleteg").val(idflete);
										$("#n_subasta").val(idsuba);
										$("#splaca").val(plak);
										$("#estadofle").val('Ganador');
										Actualiza_Flete();
										//ENVIO A ORDEN DE CARGUE
									}else{
										alert('El estudio '+num_estudiosegu+' no es vigente');
									}
								}else{
									alert('No hay estudios de seguridad aprobados');
								}
							},'json');	
						}else{
							
							//bandeja de aprobacion gerencial-WILLIAM
							$.post($("#id_url_ajax").val()+'transporte/Valida_Vigencia','num_estudio='+num_estudiosegu+'&placa='+plak,function(data){
								if(data){
									var fhoy=moment();
									var tf=fhoy.diff(data[0]['fecha'],'days');
									alert(data[0]['estado']);
									if(data[0]['estado']=='Aprobado'  && tf==0){
										$("#flete_ganador").val(fletepropuesto);
										$("#id_fleteg").val(idflete);
										$("#n_subasta").val(idsuba);
										$("#splaca").val(plak);
										$("#estadofle").val('pendiente_aprobacion');
										Actualiza_Flete();
										//ENVIO BANDEJA DE GERENCIA
									}else{
										alert('El estudio '+num_estudiosegu+' no es vigente');
									}
								}else{
									alert('No hay estudios de seguridad aprobados');
								}
							},'json');		
						}
					}
				}

				/*if(data[0]['mfletepropuesto']>0 && data[0]['id_flete']>0){
					Actualiza_Flete();
				}else{
					alert('No existe un estudio aprobado para esta subasta');
				}*/
			}
		},'json');
		a='Class="text-success"';
		e='Activo';
	}
	if(estado==0){
		a='Class="text-danger"';
		e='Cancelado';
	}
	if(estado==3){
		a='Class="text-primary"';
		e='Terminada';
	}
	$("#tabla_filtro").css("display", "none");
	$("#contenedor_dato").css("display", "block");
	$(".FP").hide();
	$(".FT").hide();
	$(".FM").show();
	var tabla='<tr>'+
			'<td>'+idsub+'</td>'+
			'<td>'+finicio+'</td>'+
			'<td>'+finicio+'</td>'+
			'<td '+a+'>'+e+'</td>'+
		'</tr>';
	$("#cuerpo_calculo").append(tabla);
}


function Actualiza_Flete(){//FELTE GANADOR
	var fg=$("#flete_ganador").val();
	var idflete=$("#id_fleteg").val();
	var idsub=$("#n_subasta").val();
	var estado=$("#estadofle").val();
	$.post($("#id_url_ajax").val()+'transporte/Actualiza_Subasta','id_subasta='+idsub+'&id_flete='+idflete+'&statu='+estado,function(data){
			if(data==true){
				alert('Datos Ganados!!');
				Calcular();
			}
	},'json');
}

