<?php
//include '../application/Conexion.php';
require_once '../application/Config.php';
//session_start();

class planillar_vehiculon
{
	public $user_log;
	public $mensaje;
	public $respuesta;

	public function Creaciondeplanilla(){
		$_msg_error = "";
		$model    = new Conexion;
		$conexion = $model->conectar();
		$cab =$_POST["cab"];
		$mer =$_POST["mer"];
		$preci=$_POST["preci"];

		$fecha=date('Y-m-d');
		$hora=date('G:i:s');
		$user=$_SESSION["usuario"]["nom_usuario"];
		if($cab=='1'){
			$id_estudio=$_POST["id_estudio"];
			$id_estudiouser=$_POST["id_estudiouser"];
			$placa=$_POST["placa"];
			$valor_anti=$_POST["valor_anti"];
			$porce_anti=$_POST["porce_anti"];
			$anti_liquida=$_POST["anti_liquida"];
			$existe_anticipo=$_POST["existe_anticipo"];
			$existe_precinto=$_POST["existe_precinto"];
			$ori_final=$_POST["ori_final"];
			$des_final=$_POST["des_final"];
			$tcarro_final=$_POST["tcarro_final"];
			$n_mani=$_POST["n_mani"];
			$fecha_mani=$_POST["fecha_mani"];
			$num_tarjeta=$_POST["num_tarjeta"];

			$sql="INSERT INTO cmx_planilla(id,id_estudio,placa,precinto,anticipo,valor_anticipo,porcentaje_anticipo,hora,fecha,usuario,anticipo_liquidado,origen_final,destino_final,tvehiculo_final,n_manifiesto,fecha_manifiesto,estado,num_tarjeta)
			VALUES(null,".$id_estudio.",'".$placa."',".$existe_precinto.",".$existe_anticipo.",'".$valor_anti."','".$porce_anti."','".$hora."','".$fecha."','".$user."','".$anti_liquida."','".$ori_final."','".$des_final."','".$tcarro_final."','".$n_mani."','".$fecha_mani."',1,'".$num_tarjeta."')";
			//echo $sql;

			$crear_planilla= $conexion->prepare($sql);
			$result = $crear_planilla->execute();

			$return["success"] = true;
			$return["error"] = $_msg_error;
			return $return;
		}
		
	}

	public function Creacionbloque(){
			$model    = new Conexion;
			$conexion = $model->conectar();
			$fecha=date('Y-m-d');
			$hora=date('G:i:s');
			$user=$_SESSION["usuario"]["nom_usuario"];
			$id_estudio=$_POST["idstudio"]; 
			$sql="SELECT max(id) AS id_planilla
			FROM cmx_planilla
			WHERE id_estudio=".$id_estudio;
			$consulta_solic_vehic = $conexion->prepare($sql);
			$consulta_solic_vehic->execute();
			$datos_proveedor = $consulta_solic_vehic->fetch();
			$id_planilla = $datos_proveedor["id_planilla"];
			if($consulta_solic_vehic){		
			$n_orden=$_POST["n_orden"];
			$fecha_orden=$_POST["fecha_orden"];
			$n_reme=$_POST["n_reme"];
			$fecha_reme=$_POST["fecha_reme"];
			$solicitud=$_POST["solicitud"];

			$sql_b="INSERT INTO cmx_planilla_detalle1
					(id,
					id_planilla,
					orden_cargue,
					fecha_orden,
					remesa,
					fecha_remesa,
					hora,
					fecha,
					usuario,
					id_servicio)
					VALUES(null,
					".$id_planilla.",
					'".$n_orden."',
					'".$fecha_orden."',
					'".$n_reme."',
					'".$fecha_reme."',
					'".$hora."',
					'".$fecha."',
					'".$user."',
					'".$solicitud."');";
					
			$crear_planilla_b = $conexion->prepare($sql_b);
			$result = $crear_planilla_b->execute();
		}					
	}


	public function Creacionprecinto(){
		$model    = new Conexion;
		$conexion = $model->conectar();
		$fecha=date('Y-m-d');
		$hora=date('G:i:s');
		$user=$_SESSION["usuario"]["nom_usuario"];
		$id_estudio=$_POST["idstudio"]; 
		$sql="SELECT max(id) AS id_planilla
			FROM cmx_planilla
			WHERE id_estudio=".$id_estudio;
		$consulta_solic_vehic = $conexion->prepare($sql);
		$consulta_solic_vehic->execute();
		$datos_proveedor = $consulta_solic_vehic->fetch();
		$id_planilla = $datos_proveedor["id_planilla"];
		if($consulta_solic_vehic){
			$num_preci=$_POST["num_preci"];
			$tipo_preci=$_POST["tipo_preci"]; 
			$sql_p="INSERT INTO cmx_planilla_detalle2
			(id,id_planilla,serie_precinto,tipo_precinto,hora,fecha,usuario)VALUES(null,".$id_planilla.",'".$num_preci."','".$tipo_preci."','".$hora."','".$fecha."','".$user."')";
			//echo $sql_p;		
			$crear_planilla_c = $conexion->prepare($sql_p);
			$result = $crear_planilla_c->execute();	
		} 
	}	
			
}


?>