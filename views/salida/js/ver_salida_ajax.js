$( document ).ready(function() {
    $("#contenedor_datos").hide();
    $(".fecha").hide();
    $(".mani").hide();
    $(".pk").hide();
    $(".boton_busca").hide();

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

    $("#buscar_manifies").click(function(){
        Tabla_Salidas();
     });   

});


function Tabla_Salidas(){
    var filtro=$("#filtrar").val();
    var mnf=$("#num_mnf").val();
    var fecha1=$("#finicial").val();
    var fecha2=$("#ffinal").val();
    var placaf=$("#placa_filtro").val();
    $(".datob").val('');
    $("#contenedor_datos").hide();
    $("#tabla_datos").show();
    $.ajaxSetup({async: false});
    $.post($("#id_url_ajax").val()+'salida/Consulta_Salidas_Tabla','filtro='+filtro+'&mnf='+mnf+'&fec1='+fecha1+'&fec2='+fecha2+'&placa='+placaf,function(data){
        $("#manfbody").html(''); 
        if(data){
            for(var m=0; m < data.length; m++){
                var temp;
                var btnanular='', btneditar='', btnconsultar='';
                var estado=data[m]['estado'];
                if(estado==1){
                    temp="<td class='nexos-txt-success'>"+
                        "<center><span class='mdi mdi-dot-circle icon' title='Salida Activa'></span></center>"+
                        "</td>";
                }
                if(estado==2){
                    temp="<td class='nexos-txt-warning'>"+
                        "<center><span class='mdi mdi-dot-circle icon' title='Salida Pendiente'></span></center>"+
                        "</td>";
                }
                if(estado==0){
                     temp="<td class='nexos-txt-danger'>"+
                        "<center><span class='mdi mdi-dot-circle icon' title='Salida Inactiva'></span></center>"+
                        "</td>";
                }
                btnconsultar='<button class="btn btn-space btn-secondary btn-sm mdi mdi-eye" title="Consulta salida" onClick="ConsultaSal('+data[m]['id']+')"></button>';
                if(estado==1){
                    btneditar='<button class="btn btn-space btn-secondary btn-sm mdi mdi-edit" title="Edita salida" onClick="EditaSalida('+data[m]['id']+')"></button>';
                   // btnanular='<button class="btn btn-space btn-secondary btn-sm mdi mdi-block" title="Anula salida" onClick="AnularSal('+data[m]['id']+')" ></button>';
                    btnanula=' <div class="btn-group btn-hspace">'+
                      '<button type="button" data-toggle="dropdown" class="btn btn-default dropdown-toggle">Anular<span class="icon-dropdown mdi mdi-chevron-down"></span></button>'+
                      '<ul role="menu" class="dropdown-menu">'+
                        '<li><a href="#">No</a></li>'+
                        '<li><a onClick="AnularSal('+data[m]['id']+')">Si</a></li>'+
                      '</ul>'+
                    '</div>';

                }else if(estado==0){
                     btneditar='';
                     btnanular='';
                     btnanula='';
                }

                 $("#manfbody").append('<tr>'+
                    temp+
                    '<td>'+data[m]['id']+'/ '+data[m]['num_manifiesto']+'</td>'+
                    '<td>'+data[m]['placa']+'</td>'+
                    '<td>'+data[m]['conductor']+'</td>'+
                    '<td>'+data[m]['fecha_salida']+' '+data[m]['hora_salida']+'</td>'+
                    '<td>'+
                    btnconsultar+'&nbsp;&nbsp;'+
                    btneditar+'&nbsp;&nbsp;'+
                    btnanular+'&nbsp;&nbsp;'+
                    btnanula+
                    '</td>'+
                    '</tr>');
            }
        }else{
            var mensaje="No hay  <strong>salidas registradas</strong> con este filtro, por favor intente nuevamente";
            $("#manfbody").html('');
            $(".msg_present").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + mensaje + '</div></div>');
            $(".panel-body").animate({ scrollTop: 5 }, 600);
        }
    },'json');        
    $.ajaxSetup({async: true});
}

$("#actualizar_salida").click(function(){
    var msg_error='';
    if(!$("#ve_fesalpro").val()){
      msg_error+="<p>Debe diligenciar el <strong>Fecha salida programada</strong> para actualizar salida</p>";
    }
    if(!$("#ve_hosalpro").val()){
        msg_error+="<p>Debe diligenciar el <strong>Hora salida programada</strong> para actualizar salida</p>";
    }
    if(!$("#ve_num_manifiesto").val()){
        msg_error+="<p>Debe diligenciar el <strong>Número de Manifiesto</strong> para actualizar salida</p>";
    }
    if(!$("#numsalida").val()){
        msg_error+="<p>El <strong>Número de salida debe existir</strong> para actualizar salida</p>";
    }
    //validar hora y fecha actual
    var horahoy=moment().format('HH:mm:ss');
    var fhoy=moment().format('YYYY-MM-DD');
    if($("#ve_hosalpro").val() > horahoy){
        msg_error+="<p>La <strong>Hora de la salida</strong> no debe ser mayor a la hora actual</p>";
    }
    if($("#ve_fesalpro").val() > fhoy){
       msg_error+="<p>La <strong>Fecha de salida</strong> no debe ser mayor a la fecha actual</p>";
    }
    if(!msg_error){
        Actualizar_Salida();
    }else{
      $(".msg_present").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
      $(".panel-body").animate({ scrollTop: 1 }, 600);
    }  
});


function ConsultaSal(id_salida){
    $(".datob").val('');
    $("#contenedor_datos").show();
    $("#tabla_datos").hide();
    //consulta datos de la salida
    $.post($("#id_url_ajax").val()+'salida/Busca_Salida_Invidual','id_salida='+id_salida,function(data){
        if(data){
            $("#numsalida").val(id_salida);
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
            $("#ve_fesalpro").val(data['fecha_salida']);
            $("#ve_hosalpro").val(data['hora_salida']);
            $("#ve_obs").val(data['observacion']);
            $("#ve_fesalpro").attr('readonly', true);
            $("#ve_hosalpro").attr('readonly', true);
            $("#ve_obs").attr('readonly', true);
            $("#actualizar_salida").attr('disabled', true);
            $("#actualizar_salida").hide();

        }else{
            $(".datob").val('');
        }
    },'json');       
}

function EditaSalida(id_salida){
    $(".datob").val('');
    $("#contenedor_datos").show();
    $("#tabla_datos").hide();
    //consulta datos de la salida
    $.post($("#id_url_ajax").val()+'salida/Busca_Salida_Invidual','id_salida='+id_salida,function(data){
        if(data){
            $("#numsalida").val(id_salida);
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
            $("#ve_plan").val(data['']);
            $("#ve_fesalpro").val(data['fecha_salida']);
            $("#ve_hosalpro").val(data['hora_salida']);
             $("#ve_obs").val(data['observacion']);
            $("#ve_fesalpro").attr('readonly', false);
            $("#ve_hosalpro").attr('readonly', false);
            $("#ve_obs").attr('readonly', false);
            $("#actualizar_salida").attr('disabled', false);
            $("#actualizar_salida").show();

        }else{
            $(".datob").val('');
        }
    },'json'); 
}

function AnularSal(id_salida){
    //Anular salida
    $.post($("#id_url_ajax").val()+'salida/Anular','id_salida='+id_salida,function(data){
        if(data=='true'){
            alert('Salida Anulada Exitosamente!!');
            Tabla_Salidas();
        }
   },'json');  
}

function Actualizar_Salida(){
    var fechapro=$("#ve_fesalpro").val();
    var horapro=$("#ve_hosalpro").val();
    var nummnf=$("#ve_num_manifiesto").val();
    var numsali=$("#numsalida").val();
    var observa=$("#ve_obs").val();
    var dato="num_salida="+numsali+"&num_mani="+nummnf+"&fechapro="+fechapro+"&horapro="+horapro+"&obs="+observa;

    $.post($("#id_url_ajax").val()+'salida/Actualizar',dato,function(data){
        if(data=='true'){
            alert('Datos Actualizados Exitosamente!!');
            Tabla_Salidas();
        }
    },'json');   
}