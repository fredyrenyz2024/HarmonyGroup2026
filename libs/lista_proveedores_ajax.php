<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';
include '../models/proveedoresModel.php';

$_msg_error = "";
$_msg_content = "";
$_msg_control = "Entro en lista_proveedores_ajax.php\n";
$_array_result = array();

$Data = new Consultas;
$Proveedores = new proveedoresModel;

// $return["post"] = $_POST;

switch ($_GET["action"]) {

	case 'cargar_proveedores':
		$tipo = $_POST["tipo"];
		$valor = $_POST["valor"];
		$name = $_POST["name"];
		$docu = $_POST["docu"];
		$param1 = $_POST["param1"];
		$param2 = $_POST["param2"];
		$_msg_control .= "Entro en opción cargar_proveedores\n";
		$arrayProveedores = $Proveedores->getProveedores($tipo, $valor, $name, $docu, $param1, $param2);

		if ($arrayProveedores > 1) {
			$return["sql"] = $arrayProveedores["rowsData"];
		} else {
			$return["sql"] = $arrayProveedores;
		}
		// var_dump($return["sql"]);
		// exit();
		break;

	default:
		$_msg_error .= "Funcion no especificada";
		break;
}

$return["control"] = $_msg_control;
if ($_msg_error) {
	$return["error"] = $_msg_error;
}
if ($_array_result) {
	if ($return["result"] > 1) {
		$return["result"] = $_array_result;
	} else {
		$return["result"] = $_array_result;
	}
}
if ($_msg_content) {
	$return["content"] = $_msg_content;
}

echo json_encode($return);
