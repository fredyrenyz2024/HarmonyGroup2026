$( document ).ready(function(){
    $("#contenedor_datos").css("display", "none");
    $("#tabla_datos").css("display", "block");
    $(".divbusqueda").hide();
    $(".inputnumero").hide();
    $(".inputletra").hide();
    $("#recurso").change(function(){
        $("#filtro").html('');
        var tmpselec=$("#recurso").val();
        if(tmpselec==1){
            $(".divbusqueda").show();
            $(".inputnumero").hide();
            $(".inputletra").hide();
            $("#filtro").append('<option value="">Seleccionar</option>'+
                '<option value="1">Clientes</option>'+
                '<option value="3">Propietario</option>'+
                '<option value="4">Conductor</option>'+
                '<option value="5">Poseedor</option>');
        }
        if(tmpselec==2){
            $(".divbusqueda").show();
            $(".inputnumero").hide();
            $(".inputletra").hide();
             $("#filtro").append('<option value="">Seleccionar</option>'+
                '<option value="6">Placa</option>'+
                '<option value="7">Número documento propietario</option>');
        }
        if(tmpselec==3){
            $(".divbusqueda").show();
            $(".inputnumero").hide();
            $(".inputletra").hide();
            $("#filtro").append('<option value="">Seleccionar</option>'+
                '<option value="8">Placa tráiler</option>'+
                '<option value="9">Número documento propietario</option>'); 
        }
    });
    $("#filtro").change(function(){

        var filtro=$("#filtro").val();
        if(filtro!=6){
            $("#documento").val('');
            $(".inputnumero").show();
            $(".inputletra").hide();  
        }
        if(filtro==6){
            $("#placa").val('');
            $(".inputnumero").hide();
            $(".inputletra").show();
        }
        if(filtro==8 || filtro==9){//busca por placa ,numero documento
            $("#placa").val('');
            $(".inputnumero").hide();
            $(".inputletra").show();
        }
    });

    $("#buscar_datos").click(function(){
       //validaciones
    var msg_error='';
      var recurso= $("#recurso").val();
      var filtro= $("#filtro").val();
      if(recurso==1){
        if(!$("#filtro").val()){
            msg_error+="<p>Debe diligenciar la <strong>Búsqueda</strong> para realizar su consulta</p>";
        }else{
           if(!$("#documento").val()){
                msg_error+="<p>Debe diligenciar el <strong>Número</strong> para realizar su consulta</p>";
           } 
           if($("#documento").val().length < 5 || $("#documento").val().length > 12){
                msg_error+="<p>La cantidad de dígitos no es válida</p>";
           }
        }
      }
      if(recurso==2){
        if(!$("#filtro").val()){
            msg_error+="<p>Debe diligenciar la <strong>Búsqueda</strong> para realizar su consulta</p>";
        }else{
            if(!$("#placa").val()){
               msg_error+="<p>Debe diligenciar la <strong>Placa</strong> para realizar su consulta</p>";
            }
            if($("#placa").val().length > 6  || $("#placa").val().length < 6){
                msg_error+="<p>La cantidad de caracteres no es válida</p>";
            }
        }
      }

      if(!msg_error){
        Consultar_Recurso();
      }else{
            $(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
            $(".panel-body").animate({ scrollTop: 0 }, 600);
            $("#table_recursos").html('');
      }
    });
});

function Consultar_Recurso(){
    $("#tabla_datos").css("display", "block");
    $("#contenedor_datos").css("display", "none");
    $("#bodycontenido").html('');
    var recurso= $("#recurso").val();
    var filtro= $("#filtro").val();
    var num=$("#documento").val();
    var plc=$("#placa").val();
    $("#table_recursos").html('');
    $.post($("#id_url_ajax").val()+'integrar_oet/Consulta_parametros','recurso='+recurso+'&filtro='+filtro+'&numero='+num+'&placa='+plc,function(data){
        if(data){
            var btnconsultar='';
            var  btn_consulta_oet='';
            if(recurso==1){
                $("#cabecera_general").html('<tr>'+
                    '<td>Nombre</td>'+ 
                    '<td>Tipo Documento</td>'+ 
                    '<td>Documento</td>'+ 
                    '<td>Teléfono</td>'+ 
                    '<td>Dirección</td>'+ 
                    '<td>Email</td>'+ 
                    '<td>Dato interes</td>'+
                    '<td>#</td>' 
                +'</tr>');
            }
            if(recurso==2){
                 $("#cabecera_general").html('<tr>'+
                    '<td>Placa</td>'+ 
                    '<td>Propietario</td>'+ 
                    '<td>Poseedor</td>'+ 
                    '<td>Conductor</td>'+ 
                    '<td>Carroceria</td>'+ 
                    '<td>#</td>' 
                +'</tr>');
            }
            if(recurso==3){
                 $("#cabecera_general").html('<tr>'+
                    '<td>Placa</td>'+ 
                    '<td>Propietario</td>'+ 
                    '<td>Poseedor</td>'+ 
                    '<td>Conductor</td>'+ 
                    '<td>Carroceria</td>'+ 
                    '<td>#</td>' 
                +'</tr>');
            }
            for(var a=0; a < data.length; a++){
                var interes='';
                var correo='';
                btnconsultar='<button class="btn btn-space btn-secondary btn-sm mdi mdi-eye" title="ver datos" onClick="ConsultaDatos('+data[a]['id']+')"></button>';
                if(filtro!=='2'){
                  btn_conectar_oet='<button class="btn btn-space btn-secondary btn-sm mdi mdi-refresh" title="OET" onClick="Conexion_Oet('+data[a]['id']+')"></button>';
                // btn_conectar_oet='<button class="btn btn-space btn-secondary btn-sm mdi mdi-refresh" title="OET" onClick="Conexion_Oet_PRUEBA('+data[a]['id']+')"></button>';
                } 
                //btn_consulta_oet='<button class="btn btn-space btn-secondary btn-sm mdi mdi-refresh" title="OET" onClick="ConsultaDatosOet('+data[a]['id']+')"></button>';
                if(filtro==1 || filtro==2){
                   interes=data[a]['descripcion_actividad'];
                }
                if(filtro==4){
                    interes=data[a]['rndc_categoria_licencia']+'<br>'+data[a]['rndc_numero_licencia']+'<br>'+data[a]['rndc_vencimiento_licencia'];
                }
                if(filtro==5 || filtro==3){
                    interes='';
                }

                if(data[a]['email']!=undefined){
                    correo=data[a]['email'];
                }else{
                    correo='';
                }

                if(recurso==1){
                    $("#table_recursos").append('<tr>'+
                        '<td>'+data[a]['nombre']+'</td>'+
                        '<td>'+data[a]['tipo_documento']+'</td>'+
                        '<td>'+data[a]['documento']+' '+
                            data[a]['digito_verificacion']+'</td>'+
                        '<td>'+data[a]['telefono']+'</td>'+
                        '<td>'+data[a]['direccion']+'</td>'+
                        '<td>'+correo+'</td>'+
                        '<td>'+interes+'</td>'+
                        '<td>'+btnconsultar+'&nbsp;'+btn_conectar_oet+'</td>'+
                    '</tr>');
                }
                if(recurso==2){
                    $("#table_recursos").append('<tr>'+
                    '<td>'+data[a]['placa']+'</td>'+
                    '<td>'+data[a]['nombre']+'</td>'+
                    '<td>'+data[a]['poseedor']+'</td>'+
                    '<td>'+data[a]['conductor']+'</td>'+
                    '<td>'+data[a]['carroceria']+'</td>'+
                    '<td>'+btnconsultar+'&nbsp;'+btn_conectar_oet+'</td>'+
                    '</tr>');
                }
                if(recurso==3){
                     $("#table_recursos").append('<tr>'+
                    '<td>'+data[a]['placa']+'</td>'+
                    '<td>'+data[a]['nombre']+'</td>'+
                    '<td></td>'+
                    '<td></td>'+
                    '<td>'+data[a]['rndc_carroceria']+'</td>'+
                    '<td>'+btnconsultar+'&nbsp;'+btn_conectar_oet+'</td>'+
                    '</tr>');
                }
            }
        }else{
            $(".nexos-messages").html(data);
            $("#table_recursos").html('');
        }
    },'json');
}


function ConsultaDatos(id){
    $("#tabla_datos").css("display", "none");
    $("#contenedor_datos").css("display", "block");
    $("#bodycontenido").html('');
    var recurso= $("#recurso").val();
    var filtro= $("#filtro").val();
    var num=$("#documento").val();
    var plc=$("#placa").val();
    $.post($("#id_url_ajax").val()+'integrar_oet/Consulta_cada_Tipo','recurso='+recurso+'&filtro='+filtro+'&numero='+num+'&placa='+plc,function(data){
        if(data){
            for(var a=0; a < data.length; a++){
                if(recurso==1 && filtro==1){
                    $("#bodycontenido").html('<div class="row">'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Nombre</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['nombre']+'" readonly="readonly">'+
                        '</div><div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                        '<label>Tipo Documento</label>'+
                        '<input type="text" class="form-control input-sm" value="'+data[a]['tipo_documento']+'" readonly="readonly"></div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Documento</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['documento']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Actividad</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['descripcion_actividad']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Dirección</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['direccion']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Teléfono</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['telefono']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Email</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['email']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Ciudad</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['lugar']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Régimen</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['regimen']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Ciiu</label>'+
                            '<input type="" class="form-control input-sm" value="'+data[a]['ciiu_principal']+'" readonly="readonly">'+
                        '</div>'+
                         '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Actividad</label>'+
                            '<input type="" class="form-control input-sm" value="Cliente" readonly="readonly">'+
                        '</div>'+
                    '</div>');
                }
                if(recurso==1 && filtro==2){
                     $("#bodycontenido").html('<div class="row">'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Nombre</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['nombre']+'" readonly="readonly">'+
                        '</div><div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                        '<label>Tipo Documento</label>'+
                        '<input type="text" class="form-control input-sm" value="'+data[a]['tipo_documento']+'" readonly="readonly"></div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Documento</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['documento']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Actividad</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['descripcion_actividad']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Dirección</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['direccion']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Teléfono</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['telefono']+'" readonly="readonly">'+
                        '</div>'+
                         '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Actividad</label>'+
                            '<input type="" class="form-control input-sm" value="Remitente / Destinatario" readonly="readonly">'+
                        '</div>'+
                    '</div>');

                }
                if(recurso==1 && filtro==3){
                     $("#bodycontenido").html('<div class="row">'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Nombre</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['nombre']+' '+data[a]['apellido1']+' '+data[a]['apellido2']+'" readonly="readonly">'+
                        '</div><div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                        '<label>Tipo Documento</label>'+
                        '<input type="text" class="form-control input-sm" value="'+data[a]['tipo_documento']+'" readonly="readonly"></div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Documento</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['documento']+' '+data[a]['digito_verificacion']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Dirección</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['direccion']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Teléfono</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['telefono']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Email</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['email']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Abreviatura</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['abreviatura']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Teléfono Fijo</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['contacto']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Municipio</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['lugar']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Actividad</label>'+
                            '<input type="text" class="form-control input-sm" value="Propietario Vehículo" readonly="readonly">'+
                        '</div>'+
                    '</div>');
                     Consulta_Dato_Especifico(3,data[a]['id']);
                }

                if(recurso==1 && filtro==5){
                     $("#bodycontenido").html('<div class="row">'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Nombre</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['nombre']+' '+data[a]['apellido1']+' '+data[a]['apellido2']+'" readonly="readonly">'+
                        '</div><div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                        '<label>Tipo Documento</label>'+
                        '<input type="text" class="form-control input-sm" value="'+data[a]['tipo_documento']+'" readonly="readonly"></div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Documento</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['documento']+' '+data[a]['digito_verificacion']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Dirección</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['direccion']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Teléfono</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['telefono']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Email</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['email']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Abreviatura</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['abreviatura']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Teléfono Fijo</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['contacto']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Municipio</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['lugar']+'" readonly="readonly">'+
                        '</div>'+
                         '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Actividad</label>'+
                            '<input type="" class="form-control input-sm" value="Poseedor Vehículo" readonly="readonly">'+
                        '</div>'+
                    '</div>');
                      Consulta_Dato_Especifico(5,data[a]['id']);
                }

                if(recurso==1 && filtro==4 ){
                    $("#bodycontenido").html('<div class="row">'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Nombre</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['nombre']+' '+data[a]['apellido1']+' '+data[a]['apellido2']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Tipo Documento</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['tipo_documento']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Número Documento</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['numero_documento']+' '+data[a]['digito_verificacion']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Contacto</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['contacto']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Celular</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['celular']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Municipio</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['municipio']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Dirección</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['direccion']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Categoria</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['rndc_categoria_licencia']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Número Licencia</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['rndc_numero_licencia']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Fecha Vencimiento</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['rndc_vencimiento_licencia']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Sexo</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['sexo']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Grupo Sanguineo</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['grupo_sanguineo']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Fecha Nacimiento</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['fecha_nacimiento']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Planilla seguridad</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['nombre_eps']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Vencimiento planilla</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['fecha_vence_eps']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Correo</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['email']+'" readonly>'+
                        '</div>'+
                         '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Actividad</label>'+
                            '<input type="" class="form-control input-sm" value="Conductor" readonly="readonly">'+
                        '</div>'+
                    '</div>');
                     Consulta_Dato_Especifico(4,data[a]['id']);
                }

                if(recurso==2 && filtro==6){
                    $("#bodycontenido").html('<div class="row">'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Placa</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['placa']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Propietario</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['nombre']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Poseedor</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['poseedor']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Propietario</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['conductor']+'" readonly="readonly">'+
                        '</div>'+
                         '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Documento propietario</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['docpro']+'" readonly="readonly">'+
                        '</div>'+
                         '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Documento Poseedor</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['docten']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Documento Conductor</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['doccondu']+'" readonly="readonly">'+
                        '</div>'+
                        '<div></div>'+
                        '<div></div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Satelital</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['web_satelital']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Usuario satelital</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['usuario_satelital']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Carrocería</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['carroceria']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>GPS</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['gpss']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Año</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['anio_fabricacion']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Configuración</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['configuracion']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Marca</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['marca']+' '+data[a]['descripcion']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Línea</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['descripcion']+'" readonly="readonly">'+
                        '</div>'+
                         '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Color</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['color']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Peso (Kg)</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['pesobruto_kg']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Chasis</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['num_chasis']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Capacidad (Tn)</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['capacidad_tn']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Aseguradora</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['aseguradora']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                           '<label>Tecnomecánica</label>'+
                           '<input type="text" class="form-control input-sm" value="'+data[a]['tecnomecanica']+'" readonly="readonly">'+ 
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Fecha Expedición</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['tecno_fecha_expedida']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Fecha Vigencia</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['tecno_fecha_vigencia']+'" readonly="readonlys">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Nit empresa GPS</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['nit_gps']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Número motor</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['num_motor']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Número soat</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['num_soat']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Fecha vencimiento soat</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['vence_soat']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Año Fabricación</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['anio_fabricacion']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Tipo combustible</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[a]['cod_tipo_combustible']+'" readonly="readonly">'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"></div>'
                    +'</div>');
                    Consulta_Dato_Especifico(6,data[a]['id']);
                }
            }
        }
    },'json');
}


function  Consulta_Dato_Especifico(id_filtro,numero){
    
    if(id_filtro==3){
        $.post($("#id_url_ajax").val()+'integrar_oet/Consulta_Especifica','numero='+numero+'&person=0&id_filtro='+id_filtro,function(data){
            if(data){
                for(var m=0; m < data.length; m++){
                    var tpcuenta;
                    if(data[m]['tipo_cuenta']==1){
                        tpcuenta='Cuenta corriente';
                    }
                    if(data[m]['tipo_cuenta']==2){
                        tpcuenta='Cuenta Ahorros';
                    }
                    $("#bodycontenido").append('<div class="row">'+
                        '<div><hr></div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Tipo cuenta '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+tpcuenta+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Fecha ingreso '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['numero_cuenta']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Fecha retiro '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['tributaria']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Persona contacto '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['nombre']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Celular '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['descripcion']+'" readonly>'+
                        '</div>'
                    +'</div>');
                }
            }
        },'json');    
    }
    if(id_filtro==5){
        $.post($("#id_url_ajax").val()+'integrar_oet/Consulta_Especifica','numero='+numero+'&person=0&id_filtro='+id_filtro,function(data){
                if(data){
                for(var m=0; m < data.length; m++){
                    var tpcuenta;
                    if(data[m]['tipo_cuenta']==1){
                        tpcuenta='Cuenta corriente';
                    }
                    if(data[m]['tipo_cuenta']==2){
                        tpcuenta='Cuenta Ahorros';
                    }
                    $("#bodycontenido").append('<div class="row">'+
                        '<div><hr></div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Tipo cuenta '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+tpcuenta+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Fecha ingreso '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['numero_cuenta']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Fecha retiro '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['tributaria']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Persona contacto '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['nombre']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Celular '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['descripcion']+'" readonly>'+
                        '</div>'
                    +'</div>');
                }
            }
        },'json');    
    }
    if(id_filtro==4){//conductor
        $.post($("#id_url_ajax").val()+'integrar_oet/Consulta_Especifica','numero='+numero+'&person=0&id_filtro='+id_filtro,function(data){
              if(data){
                for(var m=0; m < data.length; m++){
                    $("#bodycontenido").append('<div class="row">'+
                        '<div><hr></div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Nombre empresa '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['nombre_empresa']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Fecha ingreso '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['fecha_ingreso']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Fecha retiro '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['fecha_retiro']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Persona contacto '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['persona_contacto']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Celular '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['celular']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Cargo '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['cargo']+'" readonly>'+
                        '</div>'+
                    '</div>');
                }
            }
        },'json');
        $.post($("#id_url_ajax").val()+'integrar_oet/Consulta_Especifica','numero='+numero+'&person=1&id_filtro='+id_filtro,function(data){
              if(data){
                for(var m=0; m < data.length; m++){
                    $("#bodycontenido").append('<div class="row">'+
                        '<div><hr></div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Nombre persona '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['nombre_personal']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Fecha'+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['fecha_personal']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Parentezco '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['parentezco']+'" readonly>'+
                        '</div>'+
                        '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                            '<label>Teléfono '+m+'</label>'+
                            '<input type="text" class="form-control input-sm" value="'+data[m]['tel_personal']+'" readonly>'+
                        '</div>'+
                    '</div>');
                }
            }
        },'json');
    }
    if(id_filtro==6){//trailer
        $.post($("#id_url_ajax").val()+'integrar_oet/Consulta_Especifica','numero='+numero+'&id_filtro='+id_filtro,function(data){
            if(data){
                 $("#bodycontenido").append('<div class="row">'+
                    '<div><hr></div>'+
                    '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">'+
                        '<label>Placa Tráiler</label>'+
                        '<input type="text" class="form-control input-sm" value="'+data[0]['placa_trailer']+'" readonly="readonly">'+
                    '</div>'+
                '</div>');
            }
        },'json');     
    }

}


function Conexion_Oet(id){
    alert('conexion a oet'+id);
    var valor;
    var recurso=$("#recurso").val();
    var filtro=$("#filtro").val();
    var documento=$("#documento").val();
    var placa=$("#placa").val();
    if(recurso==1){
        valor='&dato_recurso='+documento;
    }else if(recurso==2){
        valor='&dato_recurso='+placa;
    }else if(recurso==3){
        valor='&dato_recurso='+placa;
    }
     alert(valor);
    var paquete='clase_recurso='+recurso+'&recurso='+filtro+valor;

    //enviar a php
    $.post($("#id_url_ajax").val()+'integrar_oet/Consulta_Recurso_Avansat',paquete,function(data){
        if(data){
            alert(data);
        }
    },'json');    
}

/*
function Conexion_Oet_PRUEBA(id){
    alert('consulta datos oet'+id);
    var recurso=$("#recurso").val();
    var filtro=$("#filtro").val();
    var documento=$("#documento").val();
    var token='token123';
    var paquete='clase_recurso='+recurso+'&recurso='+filtro+'&dato_recurso='+documento+'&token='+token;
   $.post($("#id_url_ajax").val()+'integrar_oet/Mediador_TerceroPrueba',paquete,function(data){
        if(data){
            alert(data);
        }
    },'json'); 
}
*/