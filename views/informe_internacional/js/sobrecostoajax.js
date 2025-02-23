$(document ).ready(function() {
	/*$(".fi").show();
	$(".ff").show();
	$(".btn").show();*/

	$("#buscar").click(function(){
		var fi=$("#fechainicio").val();
		var ff=$("#fechafin").val();
		consultar_sobrecostos(fi,ff);
	});

	//consultar_sobrecostos();
});

function consultar_sobrecostos(fi,ff){
	alert(fi);
	alert(ff);
	$.post($("#id_url_ajax").val()+'informe_internacional/Consulta_sobrecosto','inicia='+fi+'&fin='+ff,function(dato){
		$("#body_general").html('');
		if(dato){
			for(var i = 0; i < dato.length; i++){
				//alert('si hay'+datu[1]['nombre']);
				$("#body_general").append('<tr>'+
					'<td class="cell-detail">'+
						'<span>'+dato[i]['do']+'</span>'+
						'<span class="cell-detail-description">'+dato[i]['nombre']+'</span>'+
					'</td>'+
					'<td class="cell-detail">'+
						'<span>'+dato[i]['nomproveedor']+'</span>'+
					'</td>'+
					'<td class="cell-detail">'+
						'<span class="">'+dato[i]['fecha_cotizacion']+'</span>'+
						'<span class="cell-detail-description">Sobrecosto: '+dato[i]['sobrecosto']+'</span>'+
					'</td>'+
					'<td class="cell-detail">'+
						'<span>'+dato[i]['num_factura']+'</span>'+
						'<span class="cell-detail-description">'+dato[i]['valor']+' '+dato[i]['codigo']+'</span>'+
					'</td>'+
					'<td>'+
						'<span>'+dato[i]['valor_cliente']+'</span>'+
					'</td>'+
					'<td class="cell-detail">'+
						'<span>'+dato[i]['num_factura']+'</span>'+
						'<span class="cell-detail-description">'+dato[i]['total']+'</span>'+	
					'</td>'
				+'</tr>');
			}
		}

	},'json');
}