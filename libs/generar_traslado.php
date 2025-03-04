<?php 
	ini_set('max_execution_time', 120);

	include("../application/Config.php");
	include '../application/Conexion.php';

	print_r("Ingreso al archivo generar_traslado.php\n");

	$Data = new Consultas;

	print_r("Array del post \n");
	print_r($_POST);
	print_r("\n");


	// se inserta el regostro en la tabla cmx_traslados
	$arrayTraslado = array();
	$arrayTraslado["id_embalaje"] = $_POST["id_embalaje"];
	$arrayTraslado["id_ubicacion_origen"] = $_POST["id_ubicacion_origen"];
	$arrayTraslado["id_ubicacion_destino"] = $_POST["id_ubicacion_destino"];
	print_r($Data->setRegistro("cmx_traslados", $arrayTraslado));

	// Se inserta el registro en el log 
	$sql = '
		INSERT INTO cmx_log_material_bodega 
			(id_traslado, id_usuario, qr_leido, tipo_movimiento, fecha_hora) 
		VALUES (
			(SELECT MAX(id) FROM cmx_traslados), ' . $_POST["id_usuario"] . ', "' . $_POST["qr_leido"] . '", "Solicitud Traslado", NOW()
		) ';
	$arrayLogTraslado = $Data->getConsulta($sql);


	$sql = '
		SELECT
			cu.tipo_ubicacion
		FROM 
			cmx_ubicaciones cu
		WHERE 
			cu.id = ' . $_POST["id_ubicacion_destino"] . ';
	';
	$arrayIdIngreso = $Data->getConsulta($sql);

	if ($arrayIdIngreso["rowsData"][0]["tipo_ubicacion"] == "FULL") {
		// se actualiza el estado de la ubicacion a reservado
		$arrayUbicacion = array();
		$arrayUbicacion["estado"] = 2;
		print_r($Data->updateRegistro("cmx_ubicaciones", $arrayUbicacion, $_POST["id_ubicacion_destino"]));
	}


	// se actualiza el estado de la estiba
	$arrayEmbalaje = array();
	$arrayEmbalaje["sub_estado"] = 5;
	$arrayEmbalaje["estado"] = 3;
	print_r($Data->updateRegistro("cmx_embalaje", $arrayEmbalaje, $_POST["id_embalaje"]));

?>
