$(document).ready(function() {
  //buscar los manifiestos que ya tienen salida
  $.post($("#id_url_ajax").val()+'salida/Manifiesto_Salidos',function(data){
     $("#vehiculos_lle").html('<option value="">Seleccione</option>');
      if(data){
        for(var i = 0; i < data.length; i++){
           var mnf=data[i]['n_manifiesto'];
           var pk=data[i]['placa']; 
           var plan=data[i]['plan'];
           var salida=data[i]['salida'];
           $("#vehiculos_lle").append('<option value="'+data[i]['n_manifiesto']+'" data-id="'+pk+'" data-id2="'+plan+'"  data-id3="'+salida+'">'+data[i]['placa']+' Mnf:'+data[i]['n_manifiesto']+'</option>');
        }
      }
  },'json');

  $("#vehiculos_lle").change(function(){
    var manifiesto=$("#vehiculos_lle").val();
    if(manifiesto!=''){
      var placa=$(this).find(':selected').data("id");
      var plan=$(this).find(':selected').data("id2");
      var salida=$(this).find(':selected').data("id3");
      //consultar datos
      $.post($("#id_url_ajax").val()+'salida/Buscar_Datos_Salida','mnf='+manifiesto+'&idsalida='+salida,function(data){
        if(data){
          $("#ll_num_manifiesto").val(data['num_manifiesto']);
          $("#ll_origen").val(data['origen']);
          $("#ll_destino").val(data['destino']);
          $("#ll_placa").val(data['placa']);
          $("#ll_conductor").val(data['conductor']+' '+data['documento_conductor']);
          $("#ll_celular").val(data['telefono']);
          $("#ll_trailer").val(data['placa_trailer']);
          $("#ll_marca").val(data['marca']);
          $("#ll_linea").val(data['linea']);
          $("#ll_carroceria").val(data['carroceria']);
          $("#ll_gps").val(data['GPS']);
          $("#ll_plan").val(data['cod_plan_ruta']);
          $("#ll_fecsalidat").val(data['fecha_tentativa']);
          $("#ll_horasalidat").val(data['hora_tentativa']);
          $("#ll_fechasalidap").val(data['fecha_salida']);
          $("#ll_horasalidap").val(data['hora_salida']);
          $("#ll_agencia").val(data['agencia']);
          $("#ll_origennum").val(data['origen_num']);
          $("#ll_destinonum").val(data['destino_num']);
          $("#ll_doccondu").val(data['documento_conductor']);
          $("#ll_detalle_ruta").val(data['detalle_ruta_nom']);
          $("#ll_detalle_ruta_id").val(data['detalle_ruta']);
          $("#ll_observar").val(data['observacion']);
          $("#ll_idsalida").val(data['idsalida']);
        }
      },'json'); 
      //consultar_remesas
      $.post($("#id_url_ajax").val()+'salida/Buscar_Remesa_llegada','mnf='+manifiesto,function(rem){
        $("#remesa").html('');
        if(rem){
          for(var i=0; i < rem.length; i++){
              var check='';
              check='<input id="ch'+rem[i]['id']+'"  class="chorden"  type="checkbox" data-id="'+rem[i]['id']+'" data-id2='+i+' value="'+rem[i]['id']+'" >'; 
               $("#remesa").append('<tr>'+
                '<td>'+check+'</td>'+
                '<td>'+rem[i]['id']+'</td>'+
                '<td>'+rem[i]['tipo_mercancia']+'</td>'+
                '<td>'+rem[i]['empaque']+'</td>'+
                '<td>'+rem[i]['cantidad_empaque']+'</td>'+
                '<td>'+rem[i]['remitente']+'</td>'+
                '<td>'+rem[i]['destinatario']+'</td>'
              +'</tr>');
          }
        }else{
            $("#remesa").html(''); 
        }
      },'json');
      //consultar id tiempo
       $.post($("#id_url_ajax").val()+'salida/Buscar_Idtiempo_Descargue','mnf='+manifiesto+'&idsalida='+salida,function(data){
         if(data){
          $("#id_tiempo").val(data['id']);
         }else{
          $("#id_tiempo").val('');
         }
       },'json');

    }else{
          $("#ll_num_manifiesto").val('');
          $("#ll_origen").val('');
          $("#ll_destino").val('');
          $("#ll_placa").val('');
          $("#ll_conductor").val('');
          $("#ll_celular").val('');
          $("#ll_trailer").val('');
          $("#ll_marca").val('');
          $("#ll_linea").val('');
          $("#ll_carroceria").val('');
          $("#ll_gps").val('');
          $("#ll_plan").val('');
          $("#ll_fecsalidat").val('');
          $("#ll_horasalidat").val('');
          $("#ll_fechasalidap").val('');
          $("#ll_horasalidap").val('');
          $("#ll_agencia").val('');
          $("#ll_origennum").val('');
          $("#ll_destinonum").val('');
          $("#ll_doccondu").val('');
          $("#ll_detalle_ruta").val('');
          $("#ll_detalle_ruta_id").val('');
          $("#ll_observar").val('');
          $("#ll_idsalida").val('');
          $("#remesa").html('');
          $("#id_tiempo").val('');
    }
  });


  $("#Registrar_llegada").click(function(){
     var msg_error='';
    if(!$("#vehiculos_lle").val()){
      msg_error+="<p>Debe seleccionar el <strong>Vehículo</strong> para registrar LLegada</p>";
    }
    if(!$("#fecha_llegada_programada").val()){
      msg_error+="<p>Debe diligenciar la <strong>Fecha programada llegada</strong> para registrar LLegada</p>";
    }
    if(!$("#hora_llegada_programada").val()){
      msg_error+="<p>Debe diligenciar la <strong>Hora programada llegada</strong> para registrar LLegada</p>";
    }
    if(!$("#observa_llegada").val()){
      msg_error+="<p>Debe diligenciar la <strong>Observación de la llegada</strong> para registrar LLegada</p>";
    }
    if(!$("#ll_placa").val()){
      msg_error+="<p>Debe encontrarse la <strong>Placa</strong> para registrar LLegada</p>";
    }
    if(!$("#ll_doccondu").val()){
      msg_error+="<p>Debe diligenciar el<strong>Conductor</strong> para registrar LLegada</p>";
    }
    if(!msg_error){
      Crear_LLegada();
    }else{
      $("#msg_present").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
      $(".panel-body").animate({ scrollTop: 1 }, 600);
    }  
  });
});



function Crear_LLegada(){
  var fecha_llegada=$("#fecha_llegada_programada").val();
  var hora_llegada=$("#hora_llegada_programada").val();
  var observa_llegada=$("#observa_llegada").val();
  var vehiculos_lle=$("#vehiculos_lle").val();
  var num_manifiesto=$("#ll_num_manifiesto").val();
  var placa=$("#ll_placa").val();
  var doc_conductor=$("#ll_conductor").val();
  var id_salida=$("#ll_idsalida").val();
  var id_tiempo=$("#id_tiempo").val();
  //recoger remesas
  var arreglo= new Array();
  $(".chorden:checked").each(function(){
    var numero_orden=$(this).val();
    arreglo.push(numero_orden);
  });
  remesas=arreglo;

  //alert(doc_conductor);
  //alert($("#ll_doccondu").val() );

  var paquete="salida="+id_salida+"&fecha_llegada="+fecha_llegada+"&hora_llegada="+hora_llegada+
  "&observacion="+observa_llegada+"&manifiesto="+num_manifiesto+"&placa="+placa+
  "&doc_conductor="+doc_conductor+"&remi="+remesas+"&idtiempo="+id_tiempo;



  $.post($("#id_url_ajax").val()+'salida/Registro_LLegada',paquete,function(data){
    if(data=='true'){
      alert('Datos Registrados Exitosamente!!');
      //$(location).prop('href','salida/llegada_crear/?idmenu=5');
      location.reload();
    }
  },'json'); 


}