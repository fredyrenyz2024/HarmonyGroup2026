$(document).ready(function(){
	$("#contenedor_datos").css("display", "none");
	$("#contenedor_tabla").css("display", "block");
	$("#Buscar_Dato").click(function(){
		var msg_error="";
		if(!$("#modulo_cambio").val()){
			msg_error+="<p>Debe seleccionar el <strong>Módulo de cambio</strong> para realizar la búsqueda.</p>";
		}
		if(!$("#numero_documento").val()){
			msg_error+="<p>Debe diligenciar el campo <strong>Número de Documento</strong> para realizar la búsqueda.</p>";
		}
		if(!msg_error){
			Buscar_Proceso();
		}else{
			$(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>').fadeIn(3000);
			$(".panel-body").animate({ scrollTop: 0 }, 600);
			$(".nexos-messages").fadeOut(3000);
		}
	});

	$("#modulo_cambio").change(function(){
		$("#numero_documento").val('');
		$("#body_documento").html('');
		$("#bodycontenido").html('');
		$("#contenedor_datos").css("display", "none");
	});
});

function Buscar_Proceso(){
	$("#contenedor_datos").css("display", "none");
	$("#contenedor_tabla").css("display", "block");
	var modulo = $("#modulo_cambio").val();
	var id_tabla = $("#numero_documento").val();
	$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Consulta_Documento','modulo='+modulo+'&id_tabla='+id_tabla,function(data){
		if(data){
			$("#body_documento").html('');
			for(i=0; i < data.length; i++){
				var btconsultar, btnrecalcular;
				btnconsultar='<button class="btn btn-space btn-secondary btn-sm mdi mdi-eye" title="Ver Documento" data-id="'+modulo+'" onClick="Consulta_Documento('+data[i]['id']+',this)"></button>';
				btnrecalcular='<button class="btn btn-space btn-secondary btn-sm mdi mdi-refresh" title="Recalcula Documento" onClick="Recalcula_Documento('+data[i]['id']+','+modulo+')"></button>';
				$("#body_documento").append('<tr>'+
					'<td>'+data[i].id+'</td>'+
					'<td>'+modulo+'</td>'+	
					'<td>'+data[i].cliente+'</td>'+
					'<td>'+data[i].fecha_realizacion+'</td>'+
					'<td>'+
						btnconsultar+'&nbsp;'+
						btnrecalcular
					+'</td>'+
				'</tr>');
			}
		}
	},'json');	
}

function Consulta_Documento(iddocumento,element){
	$("#contenedor_tabla").css("display", "none");
	$("#contenedor_datos").css("display", "block");
	var elemento = $(element);
	var modulo = elemento.data("id");
	$("#bodycontenido").html('');
	if(modulo=='CO'){
		$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Ver_Cotizacion','modulo='+modulo+'&id_documento='+iddocumento,function(data){
			if(data){
				for(a=0; a < data.length; a++){
					$("#bodycontenido").append('<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 "> <strong>COTIZACIÓN: </strong> '+data[a]['id']+'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Cliente</label>'+
						'<input type="text" id="" class="form-control input-sm" value="'+data[a]['nombre_cliente']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Nit</label>'+
						'<input type="text" id="" class="form-control input-sm" value="'+data[a]['nit']+' '+data[a]['digito']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Dirección</label>'+
						'<input type="text" id="" class="form-control input-sm" value="'+data[a]['direccion']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Teléfono</label>'+
						'<input type="text" id="" class="form-control input-sm" value="'+data[a]['telefono']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Procedencia</label>'+
						'<input type="text" id="" class="form-control input-sm" value="'+data[a]['procedencia_cotizacion']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Elaborado por</label>'+
						'<input type="text" id="" class="form-control input-sm" value="'+data[a]['elaborado_por']+'" readonly="readonly">'+
					'</div>'+'<hr>'+
					'<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><strong>TOTALES</strong></div>'+
					'<div class="col-xs-3 col-md-3 col-sm-3 col-lg-3">'+
						'<label>Total tarifa venta</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['total_transporte']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-3 col-md-3 col-sm-3 col-lg-3">'+
						'<label>Total costo flete</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['tmer_flete']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-3 col-md-3 col-sm-3 col-lg-3">'+
						'<label>Total utilidad</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['tmer_utili']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-3 col-md-3 col-sm-3 col-lg-3">'+
						'<label>Total Rentabilidad</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['tmer_rent']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-3 col-md-3 col-sm-3 col-lg-3">'+
						'<label>Total costo especial</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['tes_flete']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-3 col-md-3 col-sm-3 col-lg-3">'+
						'<label>Total tarifa especial</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['tes_tarifa']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-3 col-md-3 col-sm-3 col-lg-3">'+
						'<label>Total utilidad especial</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['tes_util']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-3 col-md-3 col-sm-3 col-lg-3">'+
						'<label>Total rentabilidad especial</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['tes_renta']+'" readonly="readonly">'+
					'</div>');
				}
			}
		},'json');	
		$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Ver_Cotizacion2','modulo='+modulo+'&id_documento='+iddocumento,function(data){
			if(data){
				for(a=0; a < data.length; a++){
					$("#bodycontenido").append('<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><strong>DATOS MERCANCÍA</strong></div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Pareja origen destino</label>'+
						'<input type="text" id="" class="form-control input-sm" value="'+data[a]['id']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Tipo Vehículo</label>'+
						'<input type="" class="form-control input-sm" value="'+data[a]['nombre']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-5 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Tipo carga</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['tipo_carga']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Tipo servicio</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['tipo_servicio_mer']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Tipo transporte</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['tipo_transporte']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Peso bruto (Kg)</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['peso_bruto_kg']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Peso neto (Kg)</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['peso_neto_kg']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Peso bruto (Tn)</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['peso_neto_tn']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Alto</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['alto']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Largo</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['largo']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Ancho</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['ancho']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Volumen total</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['volumen_total']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Costo flete</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['flete']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Tarifa venta</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['total_tarifa']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Rentabilidad</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['utilidad']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Utilidad</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['rentabilidad']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Tipo mercancía</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['tipo_mercancia']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Valor mercancía</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['valor_mercancia']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Tipo empaque</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['empaque']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Cantidad empaque</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['cantidad_empaque']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Origen</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['orig']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Destino</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['dest']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Observación</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['observacion']+'" readonly="readonly">'+
					'</div></hr>');
				}
			}
		},'json');	
		$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Ver_Cotizacion3','modulo='+modulo+'&id_documento='+iddocumento,function(data){
			if(data){
				for(a=0; a < data.length; a++){
					$("#bodycontenido").append('<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"> <strong>DATOS ESPECIALES</strong></div>'+
						'<div class="co-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Tipo servicio</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[a]['tipo_servicio']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Cantidad</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[a]['cantidad']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Costo unitario</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[a]['valor_unitario']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Tarifa unitaria</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[a]['tarifa']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Calcula costo</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[a]['total_servicio']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Calcula tarifa</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[a]['tarifa_unitaria']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Utilidad</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[a]['rentabilidad']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Rentabilidad</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[a]['utilidad']+'" readonly="readonly">'+
						'</div>');
				}
			}
		},'json');	
	}
	if(modulo=='SS'){
		$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Ver_SolicitudServ','modulo='+modulo+'&id_documento='+iddocumento,function(data){
			if(data){
				for(a=0; a < data.length; a++){
				$("#bodycontenido").append('<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><strong>SOLICITUD SERVICIO</strong></div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Número Solicitud</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['id']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Número cotización</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['n_cotizacion']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Cliente</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['nombre_cliente']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Origen</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['origen']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Destino</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['destino']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Tipo Vehículo</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['nombre']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Flete</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[a]['flete']+'" readonly="readonly">'+
					'</div>');
				}
			}
		},'json');	
		$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Ver_SolicitudServ2','modulo='+modulo+'&id_documento='+iddocumento,function(data){
			if(data){
				for(r=0; r < data.length; r++){
					$("#bodycontenido").append('<br><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><strong>REMITENTE</strong></div> '+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Remitente '+data[r]['id_punto']+' </label>'+
						'<input type="text" class="form-control input-sm" value="'+data[r]['nombre']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Teléfono</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[r]['telefono']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Municipio</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[r]['municipio']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Dirección</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[r]['direccion_entrega']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Fecha estimada recogida</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[r]['fecha_estimada_entrega']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Hora estimada recogida</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[r]['hora_estimada']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Lugar</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[r]['lugar']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Peso</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[r]['peso']+'" readonly="readonly">'+
					'</div>');
				}
			}
		},'json');	
		$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Ver_SolicitudServ3','modulo='+modulo+'&id_documento='+iddocumento,function(data){
			if(data){
				for(d=0; d < data.length; d++){
					$("#bodycontenido").html('<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><strong>DESTINATARIO</strong></div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Destinatario '+data[d]['id_punto']+' </label>'+
						'<input type="text" class="form-control input-sm" value="'+data[d]['nombre']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Teléfono</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[d]['telefono']+'" readonly="">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Fecha estimada entrega</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[d]['fecha_estimada_entrega']+'" readonly="">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Hora estimada entrega</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[d]['hora_estimada']+'" readonly="">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Municipio</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[d]['municipio']+'" readonly="">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Peso</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[d]['peso']+'" readonly="">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Lugar</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[d]['lugar']+'" readonly="">'+
					'</div>');
				}
			}
		},'json');	
	}
	if(modulo=='ES'){
		$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Ver_Estudio','modulo='+modulo+'&id_documento='+iddocumento,function(data){
			if(data){
				for(e=0; e < data.length; e++){
					var estado;
					if(data[e]['estado']==1){
						estado='Aprobado';
					}
					if(data[e]['estado']==0){
						estado='No aprobado';
					}
					$("#bodycontenido").append('<div class="col-xs-4 col-sm-4 col-md-4">'+
						'<label><strong>Estudio:</strong> '+data[e]['estudio']+'</label>'+
						'<input type="text" class="form-control input-sm" value="'+estado+'" readonly="readonly">'+
						'</div><div class="col-xs-5 col-sm-5 col-md-5 col-lg-5">'+
						'<label>Fecha:</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[e]['fecha']+' '+data[e]['hora']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">'+
							'<label>Usuario</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[e]['usuario']+'" readonly="readonly">'+
						'</div>');
				}
			}
		},'json');	
	}
	if(modulo=='OC'){
		var table='';
		$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Ver_Orden','modulo='+modulo+'&id_documento='+iddocumento,function(data){
			if(data){
				for(o=0; o < data.length; o++){
					var ape1, ape2;
					ape1=data[o]['apellido1'];
					ape2=data[o]['apellido2'];
					$("#bodycontenido").append(
						'<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><strong>DATOS BÁSICOS</strong><hr/></div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Orden</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[o]['id']+'" readonly="readonly">'+	
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Placa</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[o]['placa']+'" readonly="readonly">'+ 
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Color</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[o]['color']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Marca</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[o]['marca']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Carrocería</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[o]['tipo_carroceria']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Módelo</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[o]['anio_fabricacion']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Conductor</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[o]['nombre']+''+ape1+' '+ape2+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Número identificación</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[o]['numero_documento']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Número celular</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[o]['celular']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Tipo vinculación</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[o]['tipo_vinculacion']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Clase del vehículo</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[o]['clase']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Remolque</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[o]['placatrailer']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Valor Flete</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[o]['ve_fletecotizacion']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Valor Flete Pactado</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[o]['ve_fletepactado']+'" readonly="readonly">'+
					'</div><br>');
				}
			}
		},'json');
		$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Ver_Orden_Rem','modulo='+modulo+'&id_documento='+iddocumento,function(data){
			if(data){
				table+='<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><strong>REMITENTE - DESTINATARIO</strong><hr/></div>';
				table+='<table class="table table-bordered"><thead><tr>'+
						'<td>Cliente</td>'+
						'<td>Origen</td>'+
						'<td>Dirección</td>'+
						'<td>Fecha</td>'+
						'<td>Hora</td>'+
						'<td>Observación</td>'+
						'<td>Tipo</td>'+
					'</tr></thead><tbody>';
				for(or=0; or< data.length; or++){
					table+='<tr>'+
						'<td>'+data[or]['nombre']+'</td>'+
						'<td>'+data[or]['municipio']+'</td>'+
						'<td>'+data[or]['direccion_entrega']+'</td>'+
						'<td>'+data[or]['fecha_estimada_entrega']+'</td>'+
						'<td>'+data[or]['hora_estimada']+'</td>'+
						'<td>'+data[or]['observacion']+'</td>'+
						'<td>Remitente</td></tr>';
				}
			}
		},'json');	
		$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Ver_Orden_Des','modulo='+modulo+'&id_documento='+iddocumento,function(data){
			if(data){
				for(od=0; od < data.length; od++){

					table+='<tr>'+
						'<td>'+data[od]['destinatario']+'</td>'+
						'<td>'+data[od]['municipio']+'</td>'+
						'<td>'+data[od]['direccion_entrega']+'</td>'+
						'<td>'+data[od]['fecha_estimada_entrega']+'</td>'+
						'<td>'+data[od]['hora_estimada']+'</td>'+
						'<td>'+data[od]['observacion']+'</td>'+
						'<td>Destinatario</td>'
						'</tr>';
				}
				table+='</tbody></table>';
				$("#bodycontenido").append(table);
			}
		},'json');	
	}
	if(modulo=='RM'){
		$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Ver_Remesa','modulo='+modulo+'&id_documento='+iddocumento,function(data){
			if(data){
				for(rm=0; rm < data.length; rm++){
					var ape1=data[rm]['apellido1'];
					var ape2=data[rm]['apellido2'];
					$("#bodycontenido").append(
						'<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><strong>REMESA</strong><hr/></div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Remesa</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['id_remesa']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Orden</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['id_orden_cargue']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Fecha</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['fecha_creacion']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Oficina</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['agencia']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Placa</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['placa']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Conductor</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['nombre']+' '+ape1+' '+ape2+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Número identificación</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['numero_documento']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Valor declarado</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['valor_declarado']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Producto transportado</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['tipo_mercancia']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Naturaleza</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['naturaleza']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Aplica seguro</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['aplica_seguro']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Remesa contado</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['remesa_contado']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Remesa contra entrega</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['remesa_contraentrega']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Descripción novedad</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['descripcion_novedad']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><strong>Destinatario</strong></div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Nombre</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['desnombre']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Ciudad</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['descity']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4s">'+
						'<label>Dirección</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[rm]['desdireccion']+'" readonly="readonly">'+
					'</div>'
					);
				}
			}
		},'json');	
	}
	if(modulo=='MNF'){
		$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Ver_Manifiesto','modulo='+modulo+'&id_documento='+iddocumento,function(data){
			if(data){
				for(m=0; m < data.length; m++){
				$("#bodycontenido").append(
					'<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><strong>DATOS BÁSICOS</strong><hr/></div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Número Manifiesto</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['id']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Tipo Manifiesto</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['tipo_manifiesto']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Origen</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['origen']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Destino</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['destino']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Conductor</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['conductor']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Número documento</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['numero_documento']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Dirección</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['direccion']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Teléfono</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['celular']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>N° Licencia</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['rndc_catrgoria_licencia']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Ciudad</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['cityconductor']+'" readonly="readonly">'+
					'</div>'+
					'<div><strong>Poseedor</strong></div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Nombre</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['nombre']+''+data[m]['apellido1']+' '+data[m]['apellido2']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Número identificación</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['docten']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Dirección</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['direten']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Teléfono</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['celten']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Ciudad</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['citytensss']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Placa</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['placa']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Marca</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['marca']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Configuración</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['configuracion']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Peso</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['peso']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Póliza</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['num_soat']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Seguro</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['aseguradora']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Fecha vencimiento</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['vence_soat']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Remolque</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['placa_trailer']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Lugar</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['Lugar']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Fecha pago</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['fecha_pago']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Cargue pagado</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['cargue_pagado']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Descargue pagado</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['descargue_pagado']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">'+
						'<label>Observación</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['observacion']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><strong>Valores</strong></div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Valor total</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['valor_total_viaje']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Retefuente</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['retencion_fuente']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Reteica</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['rete_ica']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Valor neto</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['neto_pagar']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Saldo a pagar</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[m]['saldo']+'" readonly="readonly">'+
					'</div>');

				}
			}
		},'json');	
		$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Ver_Manifiesto2','modulo='+modulo+'&id_documento='+iddocumento,function(data){
			if(data){
				for(rmn=0; rmn < data.length; rmn++){
					$("#bodycontenido").append(
						'<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><strong>REMESA</strong><hr/></div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label><strong>Remesa</strong></label>'+
							'<input type="text" class="form-control input-sm" value="'+data[rmn]['id']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Unidad</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[rmn]['tipo_servicio_mer']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Cantidad</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[rmn]['cantidad_empaque']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Naturaleza</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[rmn]['naturaleza']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Producto</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[rmn]['tipo_mercancia']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Remitente</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[rmn]['nomrem']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Destinatario</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[rmn]['nomdest']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Origen</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[rmn]['origen_rem']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Destino</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[rmn]['destino_rem']+'" readonly="readonly">'+
						'</div>'
						);
				}
			}
		},'json');		
	}
	if(modulo=='CU'){
		$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Ver_Cumplido','modulo='+modulo+'&id_documento='+iddocumento,function(data){
			if(data){
				for(cu=0; cu < data.length; cu++){
				$("#bodycontenido").append(
					'<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><strong>DATOS BÁSICOS</strong><hr/></div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
					'<label>Número cumplido</label>'+
					'<input type="text" class="form-control input-sm" value="'+data[cu]['id']+'" readonly="readonly">'+	
				'</div>'+
				'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
					'<label>Placa</label>'+
					'<input type="text" class="form-control input-sm" value="'+data[cu]['placa']+'" readonly="readonly">'
				+'</div>'+
				'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
					'<label>Manifiesto</label>'+
					'<input type="text" class="form-control input-sm" value="'+data[cu]['manifiesto']+'" readonly="readonly">'
				+'</div>'+
				'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
					'<label>Conductor</label>'+
					'<input type="text" class="form-control input-sm" value="'+data[cu]['namecondu']+' '+data[cu]['conape1']+' '+data[cu]['conape2']+'" readonly="readonly">'
				+'</div>'+
				'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
					'<label>Número identificación</label>'+
					'<input type="text" class="form-control input-sm" value="'+data[cu]['doccondu']+'" readonly="readonly">'
				+'</div>'+
				'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
					'<label>Propietario</label>'+
					'<input type="text" class="form-control input-sm" value="'+data[cu]['namepro']+' '+data[cu]['proape1']+' '+data[cu]['proape2']+'" readonly="readonly">'
				+'</div>'+
				'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
					'<label>Número identificación</label>'+
					'<input type="text" class="form-control input-sm" value="'+data[cu]['docprop']+'" readonly="readonly">'
				+'</div>'+
				'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
					'<label>Poseedor</label>'+
					'<input type="text" class="form-control input-sm" value="'+data[cu]['namete']+' '+data[cu]['teape1']+' '+data[cu]['teape2']+'" readonly="readonly">'
				+'</div>'+
				'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
					'<label>Número de identificación</label>'+
					'<input type="text" class="form-control input-sm" value="'+data[cu]['docte']+'" readonly="readonly">'
				+'</div>'+
				'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
					'<label>Novedad</label>'+
					'<input type="text" class="form-control input-sm" value="'+data[cu]['novedad']+'" readonly="readonly">'
				+'</div>');
				}
			}
		},'json');	
		$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Ver_Cumplido2','modulo='+modulo+'&id_documento='+iddocumento,function(data){
			if(data){
				for(c=0; c < data.length; c++){
					$("#bodycontenido").append(
						'<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><strong>TIEMPOS LOGÍSTICOS DESCARGUE</strong><hr/></div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Remesa</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[c]['id_remesa']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Fecha</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[c]['fecha']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Hora</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[c]['hora']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Observación</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[c]['observacion']+'" readonly="readonly">'+
					'</div>'+
					'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
						'<label>Tipo</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[c]['tipo_fecha']+'" readonly="readonly">'+
					'</div>'
					);
				}
			}
		},'json');	
	}
	if(modulo=='SB'){
		$.post($("#id_url_ajax").val()+'gestion_cambio_proceso/Subasta','modulo='+modulo+'&id_documento='+iddocumento,function(data){
			if(data){
				for(su=0; su < data.length; su++){
					$("#bodycontenido").append(
						'<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><strong>VEHÍCULO PROPUESTO</strong><hr/></div>'+
						'<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">'+
							'<label>Subasta</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[su]['id_suba']+'" readonly="readonly">'+
						'</div>'+	
						'<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">'+
							'<label>Número estudio</label>'+
						'<input type="text" class="form-control input-sm" value="'+data[su]['num_estudioseguridad']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Placa</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[su]['placa']+'" readonly="readonly">'+
						'</div>'+
						'<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
							'<label>Estado</label>'+
							'<input type="text" class="form-control input-sm" value="'+data[su]['estado_flete']+'" readonly="readonly">'+
						'</div>');
				}
			}
		},'json');		
	}
}