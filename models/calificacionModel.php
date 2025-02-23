<?php

	class calificacionModel extends Model
	{
		
		public function __construct(){
			parent::__construct();
		}

		public function getMonedas(){
			$monedas = $this->_db->getConsulta("SELECT * FROM cmx_vehiculos ");
			return $monedas;
		}

		public function getTabla(){
			$monedas = $this->_db->getConsulta("SELECT * FROM cmx_vehiculos ");
			return $monedas;
		}



	}

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
        $sql      = "  SELECT cv.*,cp.numero_documento as 'documento_propietario', cp.nombre as 'nombre_propietario'
                        ,cp1.numero_documento as 'documento_tenedor', cp1.nombre as 'nombre_tenedor'
                        ,cp2.numero_documento as 'documento_conductor', cp2.nombre as 'nombre_conductor'
                        FROM cmx_vehiculos cv, cmx_proveedores cp,cmx_proveedores cp1,cmx_proveedores cp2
                        WHERE cp.id = cv.id_propietario
                        AND cp1.id = cv.id_tenedor
                        AND cp2.id = cv.id_conductor
                        GROUP BY cv.id";
        $consulta = $conexion->prepare($sql);
        $consulta->execute();
        $total         = $consulta->rowCount();
        $this->mensaje = $total;
        if ($total == 0) {
            $this->respuesta = "BAD";
        } else {
            $this->respuesta = "GOOD";
            while ($datos_vehiculos = $consulta->fetch()) {
                    $sql      = " SELECT (SUM(calificacion)/COUNT(*)) as 'calificacion' FROM cmx_calificacion_vehiculos_servicios WHERE id_vehiculo = ".$datos_vehiculos["id"]." ";
                    $calificacion = $conexion->prepare($sql);
                    $calificacion->execute();
                    $datos_calificacion = $calificacion->fetch();
                    $datos_vehiculos["calificacion"]=$datos_calificacion["calificacion"];
                    if($datos_vehiculos["calificacion"]==""){
                        $datos_vehiculos["calificacion"]="0.0000";
                    }
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
                    $this->listado[] = $datos_vehiculos;
            }
        }   
    }

   
}



?>