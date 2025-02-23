<?php
include '../application/Conexion.php';
require_once '../application/Config.php';
session_start();
class solicitud_servicio
{

public $user_log;
public $mensaje;
public $respuesta;

public function editaSolicitudservice(){
	$_msg_error = "";
	$model    = new Conexion;
	$conexion = $model->conectar();

	$num_solicitud=$_POST["num_solicitud"];
	$uno=$_POST["uno"];
	$dos=$_POST["dos"];
	$fecha=date('Y-m-d');
	$hora=date('G:i:s');
	$user=$_SESSION["usuario"]["nom_usuario"];

	if($uno=='1'){
			$amunicipio=$_POST["amunicipio"];
			$adireccion=$_POST["adireccion"];
			$afecha=$_POST["afecha"];
			$acliente=$_POST["acliente"];
			$aobservacion=$_POST["aobservacion"];
			$ahora=$_POST["ahora"];
			$apunto=$_POST["apunto"];
			$aidtb=$_POST["aidtb"];
			$estado_solicitud=$_POST["estado_solicitud"];
			$atel=$_POST["atel"];
			$apeso=$_POST["apeso"];
			$alugar=$_POST["alugar"];

			$sql="UPDATE cmx_ruta_puntosentrega 
				SET municipio_entrega='".$amunicipio."',
				direccion_entrega='".$adireccion."',
				cliente='".$acliente."',
				fecha_estimada_entrega='".$afecha."',
				observacion='".$aobservacion."',
				hora_estimada='".$ahora."',
				tipo='".$apunto."',
				telefono='".$atel."',
				peso='".$apeso."',
				lugar='".$alugar."'
				WHERE id=".$aidtb." AND cod_ini_ruta=".$num_solicitud."";

			$crear_puntoa= $conexion->prepare($sql);
			$result = $crear_puntoa->execute();
			if($result){
				if($estado_solicitud=='En_subasta' 
					&& $apunto=='punto recogida'){
					//cambiar la fecha de la subasta y abrirla de nuevo
					$sql2="UPDATE 
					cmx_subasta su
					INNER JOIN cmx_subasta_solicitud_servicio so
					ON su.id=so.id_subasta
					INNER JOIN cmx_estado_subasta esu
					ON su.id=esu.id_subasta
					SET su.fecha_finaliza='".$afecha."', 
					su.hora_finaliza='".$ahora."',
					esu.estado=1
					WHERE 
					so.numer_solservicio=".$num_solicitud;
					
					$edita_subasta= $conexion->prepare($sql2);
					$result2 = $edita_subasta->execute();
				}
			}
	}
	//nuevos
	if($dos=='2'){
		$imunicipio=$_POST["imunicipio"];
		$idireccion=$_POST["idireccion"];
		$ifecha=$_POST["ifecha"];
		$icliente=$_POST["icliente"];
		$iobservacion=$_POST["iobservacion"];
		$ihora=$_POST["ihora"];
		$itipo=$_POST["itipo"];
		$iorden=$_POST["iorden"];
		$itelefono=$_POST["itelefono"];
		$ipeso=$_POST["ipeso"];
		$ilugar=$_POST["ilugar"];

		$sqlm="INSERT INTO cmx_ruta_puntosentrega
			(id,cod_ini_ruta,municipio_entrega,direccion_entrega,cliente,fecha_estimada_entrega,observacion,fecha,hora,usuario,hora_estimada,tipo,orden,telefono,peso,lugar) 
			VALUES(null,".$num_solicitud.",'".$imunicipio."','".$idireccion."','".$icliente."','".$ifecha."','".$iobservacion."','".$fecha."','".$hora."','".$user."','".$ihora."','".$itipo."','".$iorden."','".$itelefono."','".$ipeso."','".$ilugar."')";
			
		$crear_puntob= $conexion->prepare($sqlm);
		$result = $crear_puntob->execute();	
	}

	$return["success"] = true;	
	// $return["error"] = $_msg_error;
	return $return;

}	

}

?>