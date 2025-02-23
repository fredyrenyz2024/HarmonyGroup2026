<?php

include '../application/Conexion.php';
require_once '../application/Config.php';
    session_start();
class Calificacion
{

    public $user_log;
    public $pass;
    public $mensaje;
    public $respuesta;
    public $email;
    public $listado;


    public function listarVehiculos (){
        $id_usuario = $_SESSION["usuario"]["id_usuario"];
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "  SELECT * FROM cmx_vehiculos";
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_solicitudes = $consulta->fetch()) {
                    $this->listado[] = $datos_solicitudes;
            }
        }   
    }

    public function verVehiculo (){
        $id_usuario = $_SESSION["usuario"]["id_usuario"];
        $id_vehiculo = $_POST["id_vehiculo"];
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "   SELECT cv.*,cp.numero_documento as 'documento_propietario', cp.nombre as 'nombre_propietario'
                        ,cp1.numero_documento as 'documento_tenedor', cp1.nombre as 'nombre_tenedor'
                        ,cp2.numero_documento as 'documento_conductor', cp2.nombre as 'nombre_conductor'
                        FROM cmx_vehiculos cv, cmx_proveedores cp,cmx_proveedores cp1,cmx_proveedores cp2
                        WHERE cv.id = $id_vehiculo 
                        AND cp.id = cv.id_propietario
                        AND cp1.id = cv.id_tenedor
                        AND cp2.id = cv.id_conductor
                        GROUP BY cv.id
                        LIMIT 1";
        $buscar_vehiculo = $conexion->prepare($sql);
        $buscar_vehiculo->execute();
        $total         = $buscar_vehiculo->rowCount();
        $datos_vehiculos = $buscar_vehiculo->fetch();
        if ($buscar_vehiculo) {
            $sql      = " INSERT INTO cmx_log_vehiculos (id_vehiculo, id_usuario, operacion, fecha_hora_operacion) VALUES ($id_vehiculo,$id_usuario,'Ver',NOW()) ";
            $crear_oper_vehi = $conexion->prepare($sql);
            $result=$crear_oper_vehi->execute();
            $return['success'] = true;
            if($datos_vehiculos["tipo_vehiculo"]== ""){
                    $datos_vehiculos["tipo_vehiculo"] = "";
                }
                else{
                    $sql      = " SELECT * FROM cmx_tipo_vehiculos WHERE id = ".$datos_vehiculos["tipo_vehiculo"]." LIMIT 1";
                    $consulta_vehiculo = $conexion->prepare($sql);
                    $consulta_vehiculo->execute();
                    $total_vehiculo = $consulta_vehiculo->rowCount();
                    $datos_vehiculo = $consulta_vehiculo->fetch();
                    
                    if($total_vehiculo == 0){
                        $datos_vehiculos["tipo_vehiculo"]="";
                    }
                    else{
                        $datos_vehiculos["tipo_vehiculo"]=$datos_vehiculo["nombre"];
                    }
                    
                }
            $return['content']= $datos_vehiculos;
        } else {
            $return['success'] = false;
            $return['error'] = "Error al generar la solicitud";
        }
        return $return;
    }  

    public function verlistaCalificacion (){
        $id_usuario = $_SESSION["usuario"]["id_usuario"];
        $id_vehiculo = $_POST["id_vehiculo"];
        $model    = new Conexion;
        $conexion = $model->conectar();
        $sql      = "   SELECT ca.numero_agrupacion, cav.id,cav.id_agrupacion,cav.id_vehiculo,cav.estado FROM  cmx_vehiculos cv , cmx_agrupaciones ca, cmx_agrupaciones_vehiculos cav
                        WHERE cv.id = cav.id_vehiculo AND cav.id_agrupacion = ca.id AND cav.estado = 'Aprobado' and cav.id_vehiculo = $id_vehiculo ";
        $buscar_servicios = $conexion->prepare($sql);
        $buscar_servicios->execute();
        $total         = $buscar_servicios->rowCount();
            $return['content']= array();
            $sql      = "   SELECT *,id as 'id_calificacion' FROM cmx_calificacion_vehiculos_servicios WHERE id_vehiculo = $id_vehiculo AND id_agrupacion IS NULL ORDER BY id ASC LIMIT 1 ";
                $buscar_calificacion = $conexion->prepare($sql);
                $buscar_calificacion->execute();
                if($buscar_calificacion->rowCount()>0){
                $datos_calificacion = $buscar_calificacion->fetch();
                $datos_calificacion["id_agrupacion"]='0';
                $datos_calificacion["numero_agrupacion"]='Calificacion inicial';
                $return['content'][]= $datos_calificacion;
                }
            while ($datos_servicios = $buscar_servicios->fetch()) {
                $sql      = "   SELECT * FROM cmx_calificacion_vehiculos_servicios WHERE id_vehiculo = $id_vehiculo AND id_agrupacion = ".$datos_servicios["id_agrupacion"]." LIMIT 1 ";
                $buscar_calificacion = $conexion->prepare($sql);
                $buscar_calificacion->execute();
                $datos_calificacion = $buscar_calificacion->fetch();
                $total_calificacion         = $buscar_calificacion->rowCount();
                if($total_calificacion == 0){
                    $datos_servicios["calificacion"]="0";
                    $datos_servicios["fecha_hora_operacion"]="No hay fecha de calificación";
                    $datos_servicios["id_calificacion"]="0";
                }
                else{
                    $datos_servicios["calificacion"]=$datos_calificacion["calificacion"];
                    $datos_servicios["fecha_hora_operacion"]=$datos_calificacion["fecha_hora_operacion"];
                    $datos_servicios["id_calificacion"]=$datos_calificacion["id"];
                
                }
                $return['content'][]= $datos_servicios;
            }
             $return['success'] = true;
        
        return $return;
    }  
    public function calificar_servicio (){
        $id_agrupacion = $_POST["id_agrupacion"];
        $id_vehiculo = $_POST["id_vehiculo"];
        $id_calificacion = $_POST["id_calificacion"];
        $calificacion = $_POST["calificacion"];
        if($calificacion ==""){
            $calificacion =0;
        }
        $model    = new Conexion;
        $conexion = $model->conectar(); 
        if($id_calificacion=="0"){
            $sql      = " INSERT INTO cmx_calificacion_vehiculos_servicios (id_vehiculo,calificacion,id_agrupacion,fecha_hora_operacion) VALUES ($id_vehiculo,$calificacion,$id_agrupacion,NOW())";
            $crearcalificacion = $conexion->prepare($sql);
            $crearcalificacion->execute();
        }
        else if ($id_agrupacion== "0") {
            $sql      = " UPDATE cmx_calificacion_vehiculos_servicios SET calificacion = $calificacion WHERE id =$id_calificacion AND id_vehiculo = $id_vehiculo";
            $crearcalificacion = $conexion->prepare($sql);
            $crearcalificacion->execute();
        }
        else if ($id_agrupacion != "0" && $id_calificacion != "0" ) {
            $sql      = " UPDATE cmx_calificacion_vehiculos_servicios SET calificacion = $calificacion WHERE id =$id_calificacion AND id_vehiculo = $id_vehiculo AND id_agrupacion = $id_agrupacion ";
            $crearcalificacion = $conexion->prepare($sql);
            $crearcalificacion->execute();
        }
       
        $return["success"]= true;
        return $return;
    }
}

