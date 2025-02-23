$(document).ready(function() {

});
var url =$("#id_url_ajax").val()+"libs/calificacion_ajax.php";
function verVehiculo(id_vehiculo) {
  $("#e_id_vehiculo").val(id_vehiculo);
  var params = {
    accion: 'verVehiculo',
    id_vehiculo : id_vehiculo
  };
  $.post(url, params, function (data) {
    console.log(data);
    if (data.success) {
      $("#titulo_ver").text("Vehículo # "+data.content["placa"]);
      $("#v_placa").val(data.content["placa"]);
      $("#v_placa_trailer").val(data.content["placa_trailer"]);
      $("#v_cedula_propietario").val(data.content["documento_propietario"]);
      $("#v_id_propietario").val(data.content["id_propietario"]);
      $("#v_nombre_propietario").val(data.content["nombre_propietario"]);
      $("#v_cedula_tenedor").val(data.content["documento_tenedor"]);
      $("#v_id_tenedor").val(data.content["id_tenedor"]);
      $("#v_nombre_tenedor").val(data.content["nombre_tenedor"]);
      $("#v_cedula_conductor").val(data.content["documento_conductor"]);
      $("#v_id_conductor").val(data.content["id_conductor"]);
      $("#v_nombre_conductor").val(data.content["nombre_conductor"]);
      $("#v_tipo_vehiculo").val(data.content["tipo_vehiculo"]);
      $("#v_tipo_carroceria").val(data.content["tipo_carroceria"]);
      $("#v_web_satelital").val(data.content["web_satelital"]);
      $("#v_usuario_satelital").val(data.content["usuario_satelital"]);
      $("#v_clave_satelital").val(data.content["clave_satelital"]);
    }
    else{
    }
  }, 'json');  
}

function verlistaCalificacion(id_vehiculo,placa_vehiculo) {
 // $("#id_vehiculo").val(id_vehiculo);
 $("#titulo_calificar").text("Servicios prestados por el vehículo con placas #"+placa_vehiculo);
  var params = {
    accion: 'verlistaCalificacion',
    id_vehiculo : id_vehiculo
  };

  $.ajaxSetup({async: false});
  $.post(url, params, function (data) {
    let html_listado_asignaciones="";
    console.log(data);
    if (data.success) {
      if(data.content.length>0){
        for (let i=0;i<data.content.length;i++){
          let  htmlopcionesasignacion="";

          html_listado_asignaciones+="<td></td><td class='cell-detail' ><span >"+data.content[i]["numero_agrupacion"]+"</span></td>";
          html_listado_asignaciones+="<td class='cell-detail' ><span ><input type='number' value ='"+data.content[i]["calificacion"]+"' id= 'calificacion"+i+"'</span></td> \n\
                                      <td class='cell-detail' ><span >"+data.content[i]["fecha_hora_operacion"]+"</span></td> \n\
                                        <td class='actions'> <a href='javascript:' class='cell-detail  hint--top-left' data-hint='Calificar el servicio' >\n\
                                        <span class='icon mdi mdi-check-circle' onclick='calificar_servicio("+data.content[i]["id_agrupacion"]+","+data.content[i]["id_vehiculo"]+","+data.content[i]["id_calificacion"]+","+i+")' data-toggle='modal' data-target='#calificar_servicio'></span></a></td></tr>";
          
        }
         $("#contenido_asignaciones").html("<div class='row' > \n\
        <div class='col-sm-1'></div> \n\
        <div class='col-sm-10'> \n\
          <div  class='table-responsive noSwipe'> \n\
            <table id='table1' class='table table-striped table-hover'> \n\
              <thead> \n\
                <tr class='nexos-encabezado'> \n\
                  <th style='width:10%;'>#</th> \n\
                  <th>Número de agrupación</th> \n\
                  <th>Calificación</th> <th>Fecha y hora</th>  \n\  <th style='width:10%;min-width: 10%;'</th>\n\
                </tr><tbody>"+html_listado_asignaciones+"</table> ");
      }
      else{
         $("#contenido_asignaciones").html("<div class='row' > \n\
        <div class='col-sm-1'></div> \n\
        <div class='col-sm-10'> \n\
          <div  class='table-responsive noSwipe'> \n\
            <table id='table1' class='table table-striped table-hover'> \n\
              <thead> \n\
                <tr class='nexos-encabezado'> \n\
                  <th style='width:10%;'>#</th> \n\
                  <th>Número de agrupación</th> \n\
                  <th>Calificación</th> <th>Fecha y hora</th> <th style='width:10%;min-width: 10%;'</th>\n\
                </tr><tbody><tr><td colspan= '5' style='text-align: center'>No hay servicios asignados para este vehículo</td></tr></tbody></table> ");
      }

    }
    else{

    }
  }, 'json');  
  $.ajaxSetup({async: true});
}

function calificar_servicio(id_agrupacion,id_vehiculo,id_calificacion,posicion){
  var params = {
    accion: 'calificar_servicio',
    id_agrupacion : id_agrupacion,
    id_vehiculo : id_vehiculo,
    id_calificacion : id_calificacion,
    calificacion: $("#calificacion"+posicion).val()
  };
  $.post(url, params, function (data) {
    console.log(data);
    if (data.success) {
      
      location.reload();
    }
    else{

    }
  }, 'json');  

}