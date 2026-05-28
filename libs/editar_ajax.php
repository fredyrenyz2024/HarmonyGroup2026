<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';
$_msg_error = "";
$_msg_control = "Entro en editar_ajax.php\n";
$_array_result = [];

$Model = new Model;
$Data = new Consultas;

// $return["get"] = $_GET;
$return["post"] = $_POST;

if ($_POST["tabla"] and $_POST["id"]) {

	// print_r($_POST);

	$array = [];
	foreach ($_POST as $key => $value) {
		if ($key != "tabla" and $key != "id") {
			$array[$key] = $Model->limpiaTexto($value);
		}
	}

	// print_r("<pre>");
	// print_r($array);
	// print_r("</pre>");
	// exit();

	if (!$Data->updateRegistro($_POST["tabla"], $array, (int) $_POST["id"])) {
		$_msg_error .= '<p>Error al actualizar el registro.</p>';
	}
} else {
	$_msg_error .= '<p>Datos mal recibidos para la ejecutar la actualización.</p>';
}

$return["control"] = $_msg_control;
if ($_msg_error) {
	$return["error"] = $_msg_error;
}
if ($_array_result) {
	$return["result"] = $_array_result;
}
echo json_encode($return);