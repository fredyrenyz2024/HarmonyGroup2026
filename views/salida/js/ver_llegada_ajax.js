$(document).ready(function(){
	$(".fecha").hide();
	$(".mani").hide();
	$(".pk").hide();
	$("#contenedor_datos").hide();

	$("#filtrar").change(function(){
		var filtro=$("#filtrar").val();
		if(filtro==''){
            $("#contenedor_datos").hide();
            $(".fecha").hide();
            $(".mani").hide();
            $(".pk").hide();
            $(".boton_busca").hide();
        }
        if(filtro==1){
            $("#contenedor_datos").hide();
            $(".fecha").show();
            $(".mani").hide();
            $(".pk").hide();
            $(".boton_busca").show();
        }
        if(filtro==2){
            $("#contenedor_datos").hide();
            $(".fecha").hide();
            $(".pk").hide();
            $(".mani").show();
            $(".boton_busca").show();
        }
        if(filtro==3){
            $("#contenedor_datos").hide();
            $(".fecha").hide();
            $(".pk").show();
            $(".mani").hide();
            $(".boton_busca").show();
        }
	});

	$("#buscar_datos").click(function(){
        Tabla_LLegada();
     }); 

});


function Tabla_LLegada(){
	var filtro=$("#filtrar").val();
    var mnf=$("#num_mnf").val();
    var fecha1=$("#finicial").val();
    var fecha2=$("#ffinal").val();
    var placaf=$("#placa_filtro").val();
    $(".datob").val('');
    $("#contenedor_datos").hide();
    $("#tabla_datos").show();
    $.ajaxSetup({async: false});
    $.post($("#id_url_ajax").val()+'salida/Consulta_LLegada_Tabla','filtro='+filtro+'&mnf='+mnf+'&fec1='+fecha1+'&fec2='+fecha2+'&placa='+placaf,function(data){
    	$("#tabladatos").html(''); 
    	if(data){
            for(var m=0; m < data.length; m++){

                var estado;
                var btnanular='', btneditar='', btnconsultar='';
                btnconsultar='<button class="btn btn-space btn-secondary btn-sm mdi mdi-eye" title="Consulta llegada" onClick="ConsultaLLeg('+data[m]['id']+')"></button>';

                if(data[m]['estado']==1){
                    estado="<td class='nexos-txt-success'>"+
                        "<center><span class='mdi mdi-dot-circle icon' title='LLegada Activa'></span></center>"+
                        "</td>";
                    btneditar='<button class="btn btn-space btn-secondary btn-sm mdi mdi-edit" title="Edita salida" onClick="EditaLLegada('+data[m]['id']+')"></button>';
                    btnanula=' <div class="btn-group btn-hspace">'+
                      '<button type="button" data-toggle="dropdown" class="btn btn-default dropdown-toggle">Anular<span class="icon-dropdown mdi mdi-chevron-down"></span></button>'+
                      '<ul role="menu" class="dropdown-menu">'+
                        '<li><a href="#">No</a></li>'+
                        '<li><a onClick="AnularLLeg('+data[m]['id']+')">Si</a></li>'+
                      '</ul>'+
                    '</div>';
                }
                if(data[m]['estado']==0){
                     estado="<td class='nexos-txt-danger'>"+
                        "<center><span class='mdi mdi-dot-circle icon' title='LLegada Inactiva'></span></center>"+
                        "</td>";
                }
                if(data[m]['estado']==2){
                      estado="<td class='nexos-txt-warning'>"+
                        "<center><span class='mdi mdi-dot-circle icon' title='LLegada Pendiente'></span></center>"+
                        "</td>";
                }
                $("#tabladatos").append('<tr>'+
                    estado+
                    '<td>'+data[m]['id']+'/ '+data[m]['id_salida']+data[m]['num_manifiesto']+'</td>'+
                    '<td>'+data[m]['placa']+'</td>'+
                     '<td>'+data[m]['fecha_llegada']+' '+data[m]['hora_llegada']+'</td>'+
                    '<td>'+
                    btnconsultar+'&nbsp;&nbsp;'+
                    btneditar+'&nbsp;&nbsp;'+
                    btnanula+'&nbsp;&nbsp;'
                    +'</td>'+ 
                '</tr>');
            }
    	}
    },'json'); 
    $.ajaxSetup({async: true});

    //actualizar validaciones

    $("#actualizar_llegada").click(function(){
         var msg_error='';
         if(!$("#id_llegada").val()){
            msg_error+="<p>El <strong>Número interno de llegada</strong> debe existir para actualizar llegada</p>";
         }
         if(!$("#numsalida").val()){
            msg_error+="<p>El <strong>Número de salida</strong> debe existir para actualizar llegada del vehículo</p>";
         }
         if(!$("#ve_num_manifiesto").val()){
            msg_error+="<p>El <strong>Número de manifiesto</strong> debe existir para actualizar llegada del vehículo</p>";
         }
         if(!$("#ve_fellegpro").val()){
            msg_error+="<p>Debe diligenciar la <strong>Fecha de llegada</strong> para actualizar llegada del vehículo</p>";
         }
         if(!$("#ve_horallegpro").val()){
            msg_error+="<p>Debe diligenciar la <strong>Hora de llegada</strong> para actualizar llegada del vehículo</p>";
         }
         if(!$("#ve_obs").val()){
            msg_error+="<p>Debe diligenciar la <strong>Observación de llegada</strong> para actualizar llegada del vehículo</p>";
         }

        if(!msg_error){
            Actualizar_LLegada($("#id_llegada").val());
        }else{
            $(".msg_present").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
            $(".panel-body").animate({ scrollTop: 1 }, 600);
        }  


    });


}


function ConsultaLLeg(idllegada){
    $(".datob").val('');
    $("#contenedor_datos").show();
    $("#tabla_datos").hide();
    //consulta datos de la llegada
    $.post($("#id_url_ajax").val()+'salida/Busca_LLegada_Invidual','id_llegada='+idllegada,function(data){
        if(data){
            $("#ve_num_manifiesto").val(data['num_manifiesto']);
            $("#ve_origen").val(data['origen']);
            $("#ve_destino").val(data['destino']);
            $("#ve_placa").val(data['placa']);
            $("#ve_conductor").val(data['conductor']); 
            $("#ve_celular").val(data['telefono']);
            $("#ve_trailer").val(data['placa_trailer']); 
            $("#ve_marca").val(data['marca']);
            $("#ve_linea").val(data['linea']);
            $("#ve_carroceria").val(data['carroceria']); 
            $("#ve_gps").val(data['GPS']);
            $("#ve_agencia").val(data['agencia']);
            $("#ve_detalleplan").val(data['detalle_ruta_nom']);
            $("#ve_fellegpro").val(data['fecha_llegada']); 
            $("#ve_horallegpro").val(data['hora_llegada']);
            $("#ve_obs").val(data['observacion']);
            $("#numsalida").val(data['id_salida']);
            $("#id_llegada").val(idllegada);
            $("#ve_fellegpro").attr('readonly', true);
            $("#ve_horallegpro").attr('readonly', true);
            $("#ve_obs").attr('readonly', true);
            $("#actualizar_llegada").attr('disabled', true);
            $("#actualizar_llegada").hide();

        }else{
             $(".datob").val('');
        }
    },'json');    

}

function EditaLLegada(idllegada){
    $(".datob").val('');
    $("#contenedor_datos").show();
    $("#tabla_datos").hide();
    //consulta datos de la llegada
    $.post($("#id_url_ajax").val()+'salida/Busca_LLegada_Invidual','id_llegada='+idllegada,function(data){
        if(data){
            $("#ve_num_manifiesto").val(data['num_manifiesto']);
            $("#ve_origen").val(data['origen']);
            $("#ve_destino").val(data['destino']);
            $("#ve_placa").val(data['placa']);
            $("#ve_conductor").val(data['conductor']); 
            $("#ve_celular").val(data['telefono']);
            $("#ve_trailer").val(data['placa_trailer']); 
            $("#ve_marca").val(data['marca']);
            $("#ve_linea").val(data['linea']);
            $("#ve_carroceria").val(data['carroceria']); 
            $("#ve_gps").val(data['GPS']);
            $("#ve_agencia").val(data['agencia']);
            $("#ve_detalleplan").val(data['detalle_ruta_nom']);
            $("#ve_fellegpro").val(data['fecha_llegada']); 
            $("#ve_horallegpro").val(data['hora_llegada']);
            $("#ve_obs").val(data['observacion']);
            $("#numsalida").val(data['id_salida']);
            $("#id_llegada").val(idllegada);
            $("#ve_fellegpro").attr('readonly', false);
            $("#ve_horallegpro").attr('readonly', false);
            $("#ve_obs").attr('readonly', false);
            $("#actualizar_llegada").attr('disabled', false);
            $("#actualizar_llegada").show();

        }else{
             $(".datob").val('');
        }
    },'json');    

}

function Actualizar_LLegada(idllegada){
    var id_salida=$("#numsalida").val();
    var num_manifiesto=$("#ve_num_manifiesto").val();
    var fecha=$("#ve_fellegpro").val();
    var hora=$("#ve_horallegpro").val();
    var observa=$("#ve_obs").val();
    var dato="idllegada="+idllegada+"&idsalida="+id_salida+"&num_manifie="+
    num_manifiesto+"&fec_lleg="+fecha+"&hora_lleg="+hora+"&observa="+observa;
    $.post($("#id_url_ajax").val()+'salida/Actualizar_LLegada',dato,function(data){
        if(data=='true'){
            alert('Datos Actualizados Exitosamente!!');
            Tabla_LLegada();
        }
    },'json');     
}

function AnularLLeg(idllegada){
    $.post($("#id_url_ajax").val()+'salida/Anular_Llegada','id_llegada='+idllegada,function(data){
        if(data=='true'){
            alert('LLegada Anulada Exitosamente!!');
            Tabla_LLegada();
        }
    },'json');      
}



