<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';
session_start();
$Data = new Consultas;

switch($_REQUEST['action']) {

	//INCIO casos para preestudio seguridad

	case 'consulta_planillas':
		$sql="SELECT * FROM cmx_planilla";
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;



}
$return["result"] = $result["rowsData"];
echo json_encode($return);
?>