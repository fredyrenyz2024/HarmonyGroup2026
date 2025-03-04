<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';

$Data = new Consultas;

switch($_REQUEST['action']) {

	case 'consultar_tipo_estudio':
		$tipo=$_REQUEST["tipo"];
		$sql="
			SELECT * FROM cmx_tipo_estudio
			WHERE nombre='".$tipo."'
		";
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'crear_tipo_estudio':
	 // echo 'entro a crear tipo merca';
				$tipo=$_REQUEST["tipo"];
				$estado=$_REQUEST["estado"];
				$requerido=$_REQUEST["requerido"];
				$sql='
					INSERT INTO cmx_tipo_estudio
					(id,nombre,estado,requerido)
					VALUES(null,"'.$tipo.'", "'.$estado.'",'.$requerido.')';
				$result = $Data->ejecuteRegistro($sql);
			 	$return["result"] = $result["rowsData"];
	break;

	case 'actualizar':
	// echo 'entro a crear tipo vejiculo';
				$id=$_REQUEST["id"];
				$nom=$_REQUEST["nom"];
				$estado=$_REQUEST["estado"];
				$requer=$_REQUEST["requerido"];
				$sql='
					UPDATE cmx_tipo_estudio
					SET nombre="'.$nom.'", estado="'.$estado.'",
					requerido="'.$requer.'"
					WHERE id='.$id.'    ';		
				$result = $Data->ejecuteRegistro($sql);
			 	$return["result"] = $result["rowsData"];
	break;


	default:
	break;
}

$return["result"] = $result["rowsData"];
echo json_encode($return);

?>