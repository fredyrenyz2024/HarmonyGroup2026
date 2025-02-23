<?php
include '../application/Conexion.php';
require_once '../application/Config.php';
session_start();

class planillar_vehiculo
{


public $user_log;
public $mensaje;
public $respuesta;

/*
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

		$sql="INSERT INTO cmx_planilla(id,id_estudio,placa,precinto,anticipo,valor_anticipo,porcentaje_anticipo,hora,fecha,usuario,anticipo_liquidado,origen_final,destino_final,tvehiculo_final,n_manifiesto,fecha_manifiesto)
		VALUES(null,".$id_estudio.",'".$placa."',".$existe_precinto.",".$existe_anticipo.",'".$valor_anti."','".$porce_anti."','".$hora."','".$fecha."','".$user."','".$anti_liquida."','".$ori_final."','".$des_final."','".$tcarro_final."','".$n_mani."','".$fecha_mani."')";
		$crear_planilla= $conexion->prepare($sql);
		$result = $crear_planilla->execute();
		if($result){
			
			$sql = "SELECT max(id) as 'id' FROM cmx_planilla";
			$consulta_solic_vehic = $conexion->prepare($sql);
			$consulta_solic_vehic->execute();
			$datos_plani = $consulta_solic_vehic->fetch();
			$_SESSION["id_planilla"] = $datos_plani["id"];

			if(empty($_SESSION["id_planilla"])){
				//echo 'entro a 1000';
				$_SESSION["id_planilla"]=$_SESSION["id_planilla"];
			}else{
				//echo 'no entro a 1000';
				$_SESSION["id_planilla"]=$_SESSION["id_planilla"];
			}

		}else{
			$return['success'] = false;
			$_msg_error.= "<p><strong>No registro planilla.</strong></p>";
		}
	}

	if($mer=='2'){
		$id_planilla=$_SESSION["id_planilla"]; 
		$n_orden=$_POST["n_orden"];
		$fecha_orden=$_POST["fecha_orden"];
		$n_reme=$_POST["n_reme"];
		$fecha_reme=$_POST["fecha_reme"];

		$sql_b="INSERT INTO cmx_planilla_detalle1
				(id,
				id_planilla,
				orden_cargue,
				fecha_orden,
				remesa,
				fecha_remesa,
				hora,
				fecha,
				usuario)
				VALUES(null,
				".$id_planilla.",
				'".$n_orden."',
				'".$fecha_orden."',
				'".$n_reme."',
				'".$fecha_reme."',
				'".$hora."',
				'".$fecha."',
				'".$user."');";

				//echo $sql_b;
		$crear_planilla_b = $conexion->prepare($sql_b);
		$result = $crear_planilla_b->execute();
	}

	if($preci=='3'){ 
		$num_preci=$_POST["num_preci"];
		$tipo_preci=$_POST["tipo_preci"];
		$id_planilla=$_SESSION["id_planilla"];  


		$sql_p="INSERT INTO cmx_planilla_detalle2
				(id,id_planilla,serie_precinto,tipo_precinto,hora,fecha,usuario)
				VALUES(null,".$id_planilla.",'".$num_preci."','".$tipo_preci."','".$hora."','".$fecha."','".$user."')";

		//echo $sql_p;		

		$crear_planilla_c = $conexion->prepare($sql_p);
		$result = $crear_planilla_c->execute();		

	}
	
	$return["success"] = true;
	$return["error"] = $_msg_error;
	return $return;
}*/


public function Ediciondeplanilla(){
	$_msg_error = "";
	$model    = new Conexion;
	$conexion = $model->conectar();	
	$_msg_error.= "<p><strong>No actualizo planilla.</strong></p>";

	$fecha=date('Y-m-d');
	$hora=date('G:i:s');
	$user=$_SESSION["usuario"]["nom_usuario"];

	//traer variables
	$num_plantilla=$_POST["num_plantilla"];
	$s_cab=$_POST["s_cab"];
	if($s_cab=='1'){
		//UPDATE
		$preci=$_POST["preci"];
		if(empty($_POST["eanticipo"])){
			//cambiar el estado de anticipo
			$reque_anti=0;
			$eanticipo='';
			$eporcentaje='';
			$ean_liquidado='';
			$eorigen_final=$_POST["eorigen_final"];
			$edestino_final=$_POST["edestino_final"];
			$etv_final=$_POST["etv_final"];
			$en_mani=$_POST["en_mani"];
			$efec_mani=$_POST["efec_mani"];
			$enumtarjeta=$_POST["enumtarjeta"];
		}else{
			$reque_anti=1;
			$eanticipo=$_POST["eanticipo"];
			$eporcentaje=$_POST["eporcentaje"];
			$ean_liquidado=$_POST["ean_liquidado"];
			$eorigen_final=$_POST["eorigen_final"];
			$edestino_final=$_POST["edestino_final"];
			$etv_final=$_POST["etv_final"];
			$en_mani=$_POST["en_mani"];
			$efec_mani=$_POST["efec_mani"];
			$enumtarjeta=$_POST["enumtarjeta"];
		}


		$sql="UPDATE cmx_planilla 
			SET 
				precinto='".$preci."',
				anticipo='".$reque_anti."',
				valor_anticipo='".$eanticipo."',
				porcentaje_anticipo='".$eporcentaje."',	
				anticipo_liquidado='".$ean_liquidado."',
				origen_final='".$eorigen_final."',
				destino_final='".$edestino_final."',
				tvehiculo_final='".$etv_final."',
				n_manifiesto='".$en_mani."',
				fecha_manifiesto='".$efec_mani."',
				num_tarjeta='".$enumtarjeta."'
			WHERE id=".$num_plantilla."";

		$dato_edicion = $conexion->prepare($sql);
		$result=$dato_edicion->execute();
	}

	//asociacion orden cargue-manifiesto-remesa(ACTUALIZAR)
	$asociacion=$_POST["asociacion"];
	if($asociacion=='2'){
		$idtabla=$_POST["idtabla"];
		$n_orden=$_POST["n_orden"];
		$f_orden=$_POST["f_orden"];
		$n_remesa=$_POST["n_remesa"];
		$f_remesa=$_POST["f_remesa"];
		$num_plantilla=$_POST["num_plantilla"];

		$sql="UPDATE cmx_planilla_detalle1 SET
			orden_cargue='".$n_orden."',
			fecha_orden='".$f_orden."',
			remesa='".$n_remesa."',
			fecha_remesa='".$f_remesa."',
			hora='".$hora."',
			fecha='".$fecha."',
			usuario='".$user."'
			WHERE id_planilla='".$num_plantilla."' AND
			id='".$idtabla."'
			";
			$dato_edicion = $conexion->prepare($sql);
			$result=$dato_edicion->execute();
	}

	//asociacion orden cargue-manifiesto-remesa(INSERTAR)
	$asociacion_insert=$_POST["asociacion_insert"];
	if($asociacion_insert=='3'){
		$eorden=$_POST["eorden"];
		$efo=$_POST["efo"];
		$ereme=$_POST["ereme"];
		$efr=$_POST["efr"];
		$num_plantilla=$_POST["num_plantilla"];
		$eservicio=$_POST["eservicio"];

		$sql="INSERT cmx_planilla_detalle1
			(id,id_planilla,orden_cargue,fecha_orden,remesa,
			fecha_remesa,hora,fecha,usuario,id_servicio)
			VALUES(null,'".$num_plantilla."','".$eorden."','".$efo."','".$ereme."','".$efr."','".$hora."','".$fecha."','".$user."','".$eservicio."')";
		$dato_insert = $conexion->prepare($sql);
		$result=$dato_insert->execute();	
	}

	//precintos - actualizar
	$seal=$_POST["seal"];
	if($seal=='4'){
		$idtb_precinto=$_POST["idtb_precinto"];
		$tipo_precinto=$_POST["tipo_precinto"];
		$num_precinto=$_POST["num_precinto"];
		$num_plantilla=$_POST["num_plantilla"];

		$sql="UPDATE cmx_planilla_detalle2 SET
				serie_precinto='".$num_precinto."',
				tipo_precinto='".$tipo_precinto."',
				hora='".$hora."',
				fecha='".$fecha."',
				usuario='".$user."'
				WHERE id_planilla='".$num_plantilla."' AND
				id='".$idtb_precinto."'";
		$edite_precinto = $conexion->prepare($sql);
		$result=$edite_precinto->execute();		
	}

	//precintos - insertar
	$seal_insert=$_POST["seal_insert"];
	if($seal_insert=='6'){
		$eatipo_precinto=$_POST["eatipo_precinto"];
		$eanum_preci=$_POST["eanum_preci"];
		$num_plantilla=$_POST["num_plantilla"];
		$sql="INSERT INTO cmx_planilla_detalle2
			(id,id_planilla,serie_precinto,tipo_precinto,hora,fecha,usuario)
			VALUES(null,'".$num_plantilla."','".$eanum_preci."','".$eatipo_precinto."',
			'".$hora."','".$fecha."','".$user."')";
		$ingrese_precinto = $conexion->prepare($sql);
		$result=$ingrese_precinto->execute();		
	}

	$return["success"] = true;
	$return["error"] = $_msg_error;
	return $return;
}

public function Solicitainicioruta(){
	$_msg_error = "";
	$model    = new Conexion;
	$conexion = $model->conectar();	
	$user=$_SESSION["usuario"]["nom_usuario"];
	$splaca=$_POST["splaca"];
	$snplanilla=$_POST["snplanilla"];
	$sfecha=$_POST["sfecha"];
	$shora=$_POST["shora"];
	$sobserva=$_POST["sobserva"];

	$sql="INSERT INTO  cmx_solicitar_inicio_ruta
			(id,id_planilla,placa,fecha,hora,usuario,estado,observacion)
			VALUES(null,".$snplanilla.",'".$splaca."','".$sfecha."','".$shora."','".$user."','1','".$sobserva."')";

	$crear_solicitud= $conexion->prepare($sql);
	$result = $crear_solicitud->execute();
	if($result){
		$return["success"] = true;
	}else{
		$return["success"] = false;
	}
	$return["error"] = $_msg_error;
	return $return;
}


}


?>