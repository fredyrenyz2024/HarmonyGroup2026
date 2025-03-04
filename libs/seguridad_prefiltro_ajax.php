<?php 
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';
$Data = new Consultas;

switch($_REQUEST['action']) {
	case 'ver_espe':
	break;

	default:
	break;
}
$return["result"] = $result["rowsData"];
echo json_encode($return);
?>