<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';

$Data = new Consultas;

switch($_REQUEST['action']) {
	case 'consultar_tipo_vehiculo':
	// echo 'entro a crear tipo vejiculo';
				$tipo=$_REQUEST["tipo"];
				$sql='
					SELECT * FROM cmx_para_tipo_vehiculo
					 WHERE nombre="'.$tipo.'"   ';		
				$result = $Data->getConsulta($sql);
			 	$return["result"] = $result["rowsData"];
	break;

	case 'crear_tipo_vehiculo':
	// echo 'entro a crear tipo vejiculo';
				$tipo=$_REQUEST["tipo"];
				$estado=$_REQUEST["estado"];
				$sql='
					INSERT INTO cmx_para_tipo_vehiculo
					(id,nombre,estado)
					VALUES(null,"'.$tipo.'", "'.$estado.'");   ';		
				$result = $Data->ejecuteRegistro($sql);
			 	$return["result"] = $result["rowsData"];
	break;

	case 'actualizar':
	// echo 'entro a crear tipo vejiculo';
				$id=$_REQUEST["id"];
				$nom=$_REQUEST["nom"];
				$estado=$_REQUEST["estado"];
				$sql='
					UPDATE cmx_para_tipo_vehiculo 
					SET nombre="'.$nom.'", estado="'.$estado.'"

					WHERE id='.$id.'   ; ';		
				$result = $Data->ejecuteRegistro($sql);
			 	$return["result"] = $result["rowsData"];
	break;

	default:
	break;
}

$return["result"] = $result["rowsData"];
echo json_encode($return);



?>