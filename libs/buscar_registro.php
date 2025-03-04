<?php 
	include("../application/Config.php");
	include '../application/Conexion.php';

	$_msg_control = "Ingreso al archivo buscar_registro.php\n";

	$Data = new Consultas;
	$table = $_GET['tabla'];

	$_msg_error = "";
	// print_r("Array del GET \n");
	// print_r($_GET);

	// print_r("Array del POST \n");
	// print_r($_POST);

	$sql = '
		SELECT 
			*
		FROM
			' . $table . '
		WHERE 
			' . $_POST["campo"] . ' = ' . $_POST["registro"] . '
	';
	// print_r($sql . "\n");
	$respuesta = $Data->getConsulta($sql);

	if ($respuesta) {
		$datafile["respuesta"] = true;
		$datafile["resultado"] = $respuesta;
	}else{
		$datafile["respuesta"] = false;
	}


	$datafile["control"] = $_msg_control;
	$datafile["error"] = $_msg_error;
	echo json_encode($datafile);
?>
