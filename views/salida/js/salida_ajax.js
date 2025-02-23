$( document ).ready(function() {
  //cargar los manifiestos que tienen plan de ruta, activos y vehículos activos
   $.post($("#id_url_ajax").val()+'salida/Seleccione_Manifiesto',function(data){
     $("#vehiculos_mnf").html('<option value="">Seleccione</option>');
      if(data){
        for(var i = 0; i < data.length; i++){
           var mnf=data[i]['n_manifiesto'];
           var pk=data[i]['placa']; 
           var plan=data[i]['plan'];
           $("#vehiculos_mnf").append('<option value="'+data[i]['n_manifiesto']+'" data-id="'+pk+'" data-id2="'+plan+'" >'+data[i]['placa']+'</option>');
        }
      }
    },'json');

});

$("#vehiculos_mnf").change(function(){
  var manifiesto=$("#vehiculos_mnf").val();
  if(manifiesto!=''){
    var placa=$(this).find(':selected').data("id");
    var plan=$(this).find(':selected').data("id2");
    //consulta datos
    $.post($("#id_url_ajax").val()+'salida/Buscar_Datos','mnf='+manifiesto,function(data){
      if(data){
      $("#sa_num_manifiesto").val(data['num_manifiesto']);
      $("#sa_origen").val(data['mnorigen']+' '+data['mndepto']);
      $("#sa_destino").val(data['mn2origen']+' '+data['mn2depto']);
      $("#sa_placa").val(data['placa']);
      $("#sa_conductor").val(data['nombre']+' '+data['apellido1']+' '+data['apellido2']+' '+data['numero_documento']);
      $("#sa_celular").val(data['celular']);
      $("#sa_trailer").val(data['trailer']);
      $("#sa_marca").val(data['marca']);
      $("#sa_linea").val(data['linea']);
      $("#sa_carroceria").val(data['tipo_carroceria']);
      $("#sa_gps").val(data['web_satelital']);
      $("#sa_plan").val(data['cod_plan']+''+data['nombre_plan']);
      $("#sa_fecsalidat").val(data['fechasalida']);
      $("#sa_horasalidat").val(data['horasalida']);
      $("#sa_agencia").val(data['Lugar']);
      $("#origen_num").val(data['origennum']);
      $("#destino_num").val(data['destinonum']);
      $("#doc_conductor").val(data['numero_documento']);
      $("#sa_detalle_ruta").val(data['nombre_plan']);
      $("#detalle_num").val(data['cod_plan']);
      }
    },'json'); 
    //consulta de remesas
    $.post($("#id_url_ajax").val()+'salida/Buscar_Remesa','mnf='+manifiesto,function(rem){
      $("#remesa").html('');
      if(rem){
        for(var i=0; i < rem.length; i++){
             $("#remesa").append('<tr>'+
              '<td>'+rem[i]['id']+' '+rem[i]['id_orden_cargue']+'</td>'+
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
  }else{
    $("#sa_num_manifiesto").val('');
    $("#sa_origen").val('');
    $("#sa_destino").val('');
    $("#sa_placa").val('');
    $("#sa_conductor").val('');
    $("#sa_celular").val('');
    $("#sa_trailer").val('');
    $("#sa_marca").val('');
    $("#sa_linea").val('');
    $("#sa_carroceria").val('');
    $("#sa_gps").val('');
    $("#sa_agencia").val('');
    $("#sa_plan").val('');
    $("#remesa").html('');
    $("#sa_fecsalidat").val('');
    $("#sa_horasalidat").val('');
    $("#sa_fechasalidap").val('');
    $("#sa_horasalidap").val('');
    $("#observar").val('');
    $("#sa_agencia").val('');
    $("#origen_num").val('');
    $("#destino_num").val('');
    $("#doc_conductor").val('');
    $("#sa_detalle_ruta").val('');
    $("#detalle_num").val('');
  }
});

$("#Registrar_Salida").click(function(){
    var msg_error='';
    if(!$("#sa_num_manifiesto").val()){
      msg_error+="<p>Debe diligenciar el <strong>Número de Manifiesto</strong> para registrar salida</p>";
    }
    if(!$("#sa_origen").val()){
        msg_error+="<p>Debe diligenciar el <strong>Origen</strong> para registrar salida</p>";
    }
    if(!$("#sa_destino").val()){
      msg_error+="<p>Debe diligenciar el <strong>Destino</strong> para registrar salida</p>";
    }
    if(!$("#sa_placa").val()){
      msg_error+="<p>Debe diligenciar el <strong>Placa</strong> para registrar salida</p>";
    }
    if(!$("#sa_conductor").val()){
      msg_error+="<p>Debe diligenciar el <strong>Conductor</strong> para registrar salida</p>";
    }
    if(!$("#sa_celular").val()){
      msg_error+="<p>Debe diligenciar el <strong>Conductor</strong> para registrar salida</p>";
    }
    if(!$("#sa_marca").val()){
      msg_error+="<p>Debe diligenciar el <strong>Marca</strong> para registrar salida</p>";
    }
    if(!$("#sa_linea").val()){
      msg_error+="<p>Debe diligenciar el <strong>Línea</strong> para registrar salida</p>";

    }
    if(!$("#sa_carroceria").val()){
      msg_error+="<p>Debe diligenciar el <strong>Carrocería</strong> para registrar salida</p>";
    }
    if(!$("#sa_gps").val()){
      msg_error+="<p>Debe diligenciar el <strong>GPS</strong> para registrar salida</p>";
    }
    if(!$("#sa_agencia").val()){
      msg_error+="<p>Debe diligenciar el <strong>Agencia</strong> para registrar salida</p>";
    }
    if(!$("#sa_plan").val()){
      msg_error+="<p>Debe diligenciar el <strong>Plan de ruta</strong> para registrar salida</p>";
    }
    if(!$("#sa_fechasalidap").val()){
      msg_error+="<p>Debe diligenciar la <strong>Fecha programada salida</strong> para registrar salida</p>";
    }
    if(!$("#sa_horasalidap").val()){
      msg_error+="<p>Debe diligenciar la <strong>Hora programada de salida</strong> para registrar salida</p>";
    }
    if(!$("#observar").val()){
      msg_error+="<p>Debe diligenciar la <strong>Observación</strong> para registrar salida</p>";
    }
    var horahoy=moment().format('HH:mm:ss');
    if($("#sa_horasalidap").val() > horahoy){
      msg_error+="<p>La Hora programada de salida no puede ser <strong> mayor </strong>a la hora actual</p>";
    }
    var fhoy=moment();
    if($("#sa_fechasalidap").val() > fhoy){
      msg_error+="<p>La Fecha programada de salida no puede ser <strong> mayor </strong>a la fecha actual</p>";
    }
    let filas_remesa = $("#remesa").find('tbody tr').length;
    /*if(filas_remesa==0){
      msg_error+="<p>Debe existir mínimo <strong>1 remesa</strong> para registrar salida</p>";
    }*/
    if(!msg_error){
      Crear_Salida();
    }else{
      $("#msg_present").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
      $(".panel-body").animate({ scrollTop: 1 }, 600);
    }  
});


function Crear_Salida(){
    var num_mnf=$("#sa_num_manifiesto").val();
    var orig=$("#sa_origen").val();
    var desti=$("#sa_destino").val();
    var placa=$("#sa_placa").val();
    var condu=$("#sa_conductor").val();
    var cel=$("#sa_celular").val();
    var trail=$("#sa_trailer").val();
    var marca=$("#sa_marca").val();
    var linea=$("#sa_linea").val();
    var carroc=$("#sa_carroceria").val();
    var gps=$("#sa_gps").val();
    var agencia=$("#sa_agencia").val();
    var plan=$("#sa_plan").val();
    var fec1=$("#sa_fecsalidat").val();
    var hor1=$("#sa_horasalidat").val();
    var fec2=$("#sa_fechasalidap").val();
    var hor2=$("#sa_horasalidap").val();
    var obs=$("#observar").val();

    var num_org=$("#origen_num").val();
    var num_des=$("#destino_num").val();
    var docu_condu=$("#doc_conductor").val();
    var detalle_ruta=$("#detalle_num").val();
    var detalle_nom=$("#sa_detalle_ruta").val();

    var datos="manifi="+num_mnf+"&orig="+orig+"&desti="+desti+"&placa="+placa+"&condu="+condu+
    "&celular="+cel+"&trail="+trail+"&marca="+marca+"&line="+linea+"&carroc="+carroc+
    "&gps="+gps+"&agenci="+agencia+"&plan="+plan+"&fec1="+fec1+"&hora1="+"&fec2="+fec2+"&hora2="+hor2+
    "&observa="+obs+"&num_ori="+num_org+"&num_des="+num_des+"&documento_condu="+docu_condu+"&numdetalle="+detalle_ruta+
    "&nomdetalle="+detalle_nom;

    $.post($("#id_url_ajax").val()+'salida/Registro_Salida',datos,function(data){
      if(data=='true'){
        alert('Datos Registrados Exitosamente!!');
        //$(location).prop('href','salida/salida_ruta/?idmenu=5');
        location.reload();
      }
    },'json');  
}