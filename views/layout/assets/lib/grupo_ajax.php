<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';
session_start();
$Data = new Consultas;

switch($_REQUEST['action']) {
	case 'consultar_cliente':
		$sql="SELECT * FROM cmx_clientes WHERE estado='Activo'";
		$result=$Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;


}
$return["result"] = $result["rowsData"];
echo json_encode($return);
?>