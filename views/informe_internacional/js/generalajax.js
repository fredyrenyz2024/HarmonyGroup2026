$(document ).ready(function() {
	//consultar_cliente();
	//$("#filtro_tipi").show();
	$(".ft0").show();
	$(".ft").hide();
	$(".fc").hide();
	$(".ff").hide();
	$(".do").hide();
	$(".btn").hide();

	$("#filtro_tipi0").change(function(){
		var fil_principal=$("#filtro_tipi0").val();
		if(fil_principal==0){
			$(".ft").hide();
			$(".fc").hide();
			$(".ff").hide();
			$(".do").hide();
			$(".btn").hide();
			$(".ft0").show();
		}
		if(fil_principal==1){
			$(".ft").show();
			$(".fc").hide();
			$(".ff").hide();
			$(".do").hide();
			$(".btn").hide();
			$(".ft0").show();
		}
		if(fil_principal==2){
			$(".ft").show();
			$(".fc").hide();
			$(".ff").hide();
			$(".do").hide();
			$(".btn").hide();
			$(".ft0").show();
		}

	});

	$("#filtro_tipi").change(function(){
		var filtro=$("#filtro_tipi").val();
		if(filtro==0){
			$(".fc").hide();
			$(".ff").hide();
			$(".btn").hide();
			$(".do").hide();
		}
		if(filtro==1){
			$(".fc").show();
			$(".ff").hide();
			$(".btn").show();
			$(".do").hide();
			consultar_cliente();
		}
		if(filtro==2){
			$(".fc").hide();
			$(".ff").show();
			$(".do").hide();
			$(".btn").show();
		}
		if(filtro==3){
			$(".fc").hide();
			$(".ff").hide();
			$(".do").show();
			$(".btn").show();
		}
		if(filtro==4){
			$(".fc").show();
			$(".ff").show();
			$(".btn").show();
			$(".do").hide();
			consultar_cliente();
		}
	});

	$("#buscar_informe").click(function(){
		var filtro=$("#filtro_tipi").val();
		var fl=$("#filtro_tipi").val();
		var filtop=$("#filtro_tipi0").val();
		if(filtro==1){
			var dot=$("#filtro_cliente").val();
			var dotb='';
			var dotc='';
		}
		if(filtro==2){
			var dot=$("#filtro_fecha").val();
			var dotb=$("#filtro_fecha2").val();
			var dotc='';
		}
		if(filtro==3){
			var dot=$("#filtro_do").val();
			var dotb='';
			var dotc='';
		}
		if(filtro==4){
			var dot=$("#filtro_fecha").val();
			var dotb=$("#filtro_fecha2").val();
			var dotc=$("#filtro_cliente").val();
		}

		consultar_informe(fl,dot,dotb,dotc,filtop);
	});

	//consultar_informe();
});

function consultar_cliente(){
	$.post($("#id_url_ajax").val()+'informe_internacional/ConsultaCliente',function(dato){
		//$("#filtro_cliente").html('');
		if(dato){
			for(var i = 0; i < dato.length; i++){
				$("#filtro_cliente").append('<option value="'+dato[i]['id']+'">'+dato[i]['nombre']+'</option>');
			}
		}
	},'json');
}

function currencyMask(ele)
{
  var elemento =  $(ele);
  elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());

}


function consultar_informe(fl,dot,dotb,dotc,filtop){
		$.post($("#id_url_ajax").val()+'informe_internacional/Consulta_informe','filtro='+fl+'&dato='+dot+'&datob='+dotb+'&datoc='+dotc+'&filtop='+filtop,function(datu){
			$("#body_general").html('');
			if(datu){
				//DETALLE
				if(filtop==1){
					if(fl!=4){
						for(var i = 0; i < datu.length; i++){
						
							$("#body_general").append('<tr>'+
							'<td class="cell-detail">'+
								'<span class="">'+datu[i]['do']+'</span>'+
								'<span class="cell-detail-description">'+datu[i]['cliente']+'</span>'+
							'</td>'+
							'<td class="cell-detail">'+
								'<span>'+datu[i]['monedaoferta']+'<input type="text" id="valor" class="form-control input-xs ol" readonly="readonly" value="'+datu[i]['valor_oferta']+'" onChange="javascript:currencyMask(this)"></span>'+
							'</td>'+
							'<td class="cell-detail">'+
								'<span>Número: '+datu[i]['num_fac_cliente']+'</span>'+
								'<span class="cell-detail-description"><input type="text" class="form-control input-xs ol" value="'+datu[i]['valor_factura_cliente']+'" readonly="readonly" onChange="javascript:currencyMask(this)"></span>'+
							'</td>'+
							'<td class="cell-detail">'+
								'<span>'+datu[i]['prove_coti']+'</span>'+
								'<span><input type="text" class="form-control input-xs ol" readonly="readonly" value="'+datu[i]['val_coti_prove']+'" onChange="javascript:currencyMask(this)">' +datu[i]['moneda_coti']+'</span>'+
							'</td>'+
							'<td></td>'+
							'<td></td>'+
							'<td class="cell-detail">'+
								'<span>'+datu[i]['prove_factu']+'</span><br>'+
								'<span class="cell-detail-description"><input type="text" class="form-control input-xs ol" readonly="readonly" value="'+datu[i]['val_factu_prove']+'" onChange="javascript:currencyMask(this)">'+datu[i]['moneda_factu']+'</span>'+
							'</td>'+
							'<td class="cell-detail">'+
								'<span class="cell-detail-description"><input type="text" class="form-control input-xs ol" readonly="readonly" value="'+datu[i]['valor_egreso']+'" onChange="javascript:currencyMask(this)"></span>'+
							'</td>'+
						'</tr>');
						}
					}

					if(fl==4){
						for(var i = 0; i < datu.length; i++){
							$("#body_general").append('<tr>'+
							'<td class="cell-detail">'+
								'<span class="">'+datu[i]['do']+'</span>'+
								'<span class="cell-detail-description">'+datu[i]['cliente']+'</span>'+
							'</td>'+
							'<td class="cell-detail">'+
								'<span>'+datu[i]['monedaoferta']+'<input type="text" id="valor" class="form-control input-xs ol" readonly="readonly" value="'+datu[i]['valor_oferta']+'" onChange="javascript:currencyMask(this)"></span>'+
							'</td>'+
							'<td class="cell-detail">'+
								'<span>Número: '+datu[i]['num_fac_cliente']+'</span>'+
								'<span class="cell-detail-description"><input type="text" class="form-control input-xs ol" value="'+datu[i]['valor_factura_cliente']+'" readonly="readonly" onChange="javascript:currencyMask(this)"></span>'+
							'</td>'+
							'<td class="cell-detail">'+
								'<span>'+datu[i]['prove_coti']+'</span>'+
								'<span><input type="text" class="form-control input-xs ol" readonly="readonly" value="'+datu[i]['val_coti_prove']+'" onChange="javascript:currencyMask(this)">' +datu[i]['moneda_coti']+'</span>'+
							'</td>'+
							'<td></td>'+
							'<td></td>'+
							'<td class="cell-detail">'+
								'<span>'+datu[i]['prove_factu']+'</span><br>'+
								'<span class="cell-detail-description"><input type="text" class="form-control input-xs ol" readonly="readonly" value="'+datu[i]['val_factu_prove']+'" onChange="javascript:currencyMask(this)">'+datu[i]['moneda_factu']+'</span>'+
							'</td>'+
							'<td class="cell-detail">'+
								'<span class="cell-detail-description"><input type="text" class="form-control input-xs ol" readonly="readonly" value="'+datu[i]['valor_egreso']+'" onChange="javascript:currencyMask(this)"></span>'+
							'</td>'+
						'</tr>');
						}
					}
				}
				//CONSOLIDADO
				if(filtop==2){
					
					for(var i = 0; i < datu.length; i++){

							$("#body_general").append('<tr>'+
								'<td class="cell-detail">'+
									'<span class="">'+datu[i]['do']+'</span>'+
									'<span class="cell-detail-description">'+datu[i]['cliente']+'</span>'+
								'</td>'+
								'<td class="cell-detail">'+
									'<span class="cell-detail-description">'+
									'<input type="text" id="valorof" class="form-control input-xs ol" readonly="readonly" value="'+datu[i]['valor_oferta']+'" onChange="javascript:currencyMask(this)">'+
									datu[i]['monedaoferta']+'</span>'+
								'</td>'+
								'<td class="cell-detail">'+
									'<span class="cell-detail-description">'+
									'<input type="text" id="valorcliente" class="form-control input-xs ol" readonly="readonly" value="'+datu[i]['valor_factura_cliente']+'" onChange="javascript:currencyMask(this)">'+
									'</span>'+
									'<span>N° '+datu[i]['num_fac_cliente']+'</span>'+
									'</td>'+

								'<td id="cop'+i+'" class="cell-detail">'+
									'<span class="cell-detail-description">'+
									'<input type="text" id="copv'+i+'" class="form-control input-xs ol" readonly="readonly" value="'+datu[i]['valor_pesos']+'"  onChange="javascript:currencyMask(this)">  COP  </span>'+
								'</td>'+

								'<td id="usd'+i+'" class="cell-detail"><span class="cell-detail-description"> <input type="text" id="usdvalor'+i+'" class="form-control input-xs" readonly="readonly"   value="'+datu[i]['valor_dolar']+'">  USD </span></td>'+
								'<td id="eur'+i+'" class="cell-detail"><span class="cell-detail-description">  <input type="text" id="eurvalor'+i+'"  class="form-control input-xs" readonly="readonly" value="'+datu[i]['valor_euro']+'">  EUR </span></td>'+

								'<td class="cell-detail">'+
									'<span class="cell-detail-description">'+
									'<input type="text" id="valorfactu" class="form-control input-xs ol" readonly="readonly" value="'+datu[i]['val_factu_prove']+'" onChange="javascript:currencyMask(this)">'+
									 datu[i]['moneda_factu']+'</span>'+
								'</td>'+
								'<td class="cell-detail">'+
										'<span class="cell-detail-description">'+
									'<input type="text" id="valoregreso" class="form-control input-xs ol" readonly="readonly" value="'+datu[i]['valor_egreso']+'" onChange="javascript:currencyMask(this)">'+
								
								'<br></span></td>'+'</tr>');
					}


				}

				$(".ol").trigger('change');
			}
		},'json');
}