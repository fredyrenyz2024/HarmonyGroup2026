$(document).ready(function(){
	$("#contenedor_dato").css("display", "none");
	$("#tabla_filtro").css("display", "block");	
  $(".Impdato").hide();
  $("#tipo").change(function(){
  	var tipo=$("#tipo").val();
  	if(tipo==''){
  		$(".Impdato").hide();
  		$("#dato").val('');
  	}
  	if(tipo==1){
  		$(".Impdato").show();
  	}
  });
  $("#buscar_datos").click(function(){
  		consultar_tabla();
  });
});


function consultar_tabla(){
	$("#contenedor_dato").css("display", "none");
	$("#tabla_filtro").css("display", "block");
	var valor=$("#dato").val();
	$.post($("#id_url_ajax").val()+'transporte/Consultatbsubasta','dato='+valor,function(dato){
		$("#filtro_subasta").html('');
		if(dato){
			for(var i = 0; i < dato.length; i++){
				var btn_editar, btn_ver, btn_fin='';	

				btn_editar='<button class="btn btn-space btn-secondary btn-sm mdi mdi-edit" title="Editar subasta" onClick="Editasubasta('+dato[i]['id']+','+dato[i]['numer_solservicio']+','+dato[i]['num_estudioseguridad']+')"></button>';
				btn_ver='<button class="btn btn-space btn-secondary btn-sm mdi mdi-eye" title="ver subasta" onClick="Consultasubasta('+dato[i]['id']+','+dato[i]['numer_solservicio']+','+dato[i]['num_estudioseguridad']+')"></button>';
				//validar el último estado del flete	

				$.post($("#id_url_ajax").val()+'transporte/Validafletesub','dato='+dato[i]['id'],function(dato){
					if(dato){
						if(dato['uestado']=='pendiente' || dato['uestado']=='aprobado'){
							btn_fin+='<button class="btn btn-space btn-secondary btn-sm mdi mdi-power" title="Finalizar subasta" onClick="Finsubasta('+dato[i]['id']+','+dato[i]['numer_solservicio']+')"></button>';
						}
					}
				},'json');	

				
					//btn_fin='<button class="btn btn-space btn-secondary btn-sm mdi mdi-power" title="Finalizar subasta" onClick="Finsubasta('+dato[i]['id']+','+dato[i]['numer_solservicio']+')"></button>';
				
				$("#filtro_subasta").append('<tr>'+
					'<td>'+dato[i]["id"]+'</td>'+
					'<td>'+dato[i]["fecha_inicio"]+ 
						' / '+dato[i]["fecha_finaliza"]+
					'</td>'+
					'<td>'+dato[i]["diferencia"]+'</td>'+
					'<td>'+dato[i]["usuario"]+'</td>'+
					'<td class="cell-detail">'+
						'<span class="">'+dato[i]["numer_solservicio"]+'</span>'+
						'<span class="cell-detail-description">'+dato[i]["placa"]+'</span>'+
						'<span class="cell-detail-description">'+dato[i]["flete_propuesto"]+'</span>'+
					'</td>'+
					'<td>'+
						btn_editar+'&nbsp;&nbsp;'+
						btn_ver+'&nbsp;&nbsp;'+
						btn_fin+
					'</td>'+	
				'</tr>');
			}
		}
	},'json');
}


function Consultasubasta(id, numservice, numseguridad){
	$("#tabla_filtro").css("display", "none");
	$("#contenedor_dato").css("display", "block");
	$.post($("#id_url_ajax").val()+'transporte/Consultaflete','numservice='+id+'&numsegu='+numseguridad,function(data){
		$(".FP").html('');
		if(data){
			$(".FP").html(
				'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
					'<input type="text" class="form-control input-sm" value="'+data['id']+'" readonly="readonly">'+	
				'</div>'+
				'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
					'<input type="text" id="" class="form-control input-sm" value="'+data['placa']+'" readonly="readonly" >'
				+'</div>'+
				'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
					'<input type="text" id="" class="form-control input-sm" value="'+data['flete_propuesto']+'" readonly="readonly">'+
				'</div>'+
				'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"></div>');	
		}
	},'json');
}

function Editasubasta(id, numservice, numseguridad){
	$("#tabla_filtro").css("display", "none");
	$("#contenedor_dato").css("display", "block");
	$.post($("#id_url_ajax").val()+'transporte/Consultaflete','numservice='+id+'&numsegu='+numseguridad,function(data){
		$(".FP").html('');
		if(data){
			$(".FP").html(
				'<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">'+
					'<input type="text" id="eid_flete" class="form-control input-sm" value="'+data['id']+'" readonly="readonly">'+	
				'</div>'+
				'<div class="col-xs-4 col-sm-2 col-md-2 col-lg-2">'+
					'<input type="text" id="eplaca" class="form-control input-sm" value="'+data['placa']+'" readonly="readonly" >'
				+'</div>'+
				'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
					'<input type="text" id="eflete" class="form-control input-sm" value="'+data['flete_propuesto']+'">'+
				'</div>'+
				'<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">'+
					'<button id="actu" onClick="ActualizarFlete()" class="btn-sm btn-primary">Actualizar</button>'+
				'</div>');	
		}
	},'json');
}

function ActualizarFlete(){
	var idflete=$("#eid_flete").val();
	$("#eplaca").val();
	var fleten=$("#eflete").val();
	$.post($("#id_url_ajax").val()+'transporte/ActualizarFlete','idflete='+idflete+'&flete='+fleten,function(datu){
		if(datu=='true'){
			alert('Dato Actualizado Exitosamente!!');
			consultar_tabla();
		}
	},'json');
}

function Finsubasta(idsubasta, numservice){
	/*$.post($("#id_url_ajax").val()+'transporte/Validasubasta','idsuba='+idsubasta,function(datu){
		if(datu){
			alert('Si dato');
			
		}else{
			alert('No else');
		}
	},'json');*/
	subasta_finalizada();
}


function subasta_finalizada(){
	$.post($("#id_url_ajax").val()+'transporte/Finalizarsubasta','idsuba='+idsubasta,function(datu){
		if(datu=='true'){
			alert('Subasta Finalizada Exitosamente!!');
			consultar_tabla();
		}
	},'json');

}
