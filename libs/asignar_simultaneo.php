<?php 
	print_r("Entro en asignar_simultaneo.php\n");
	include("../application/Config.php");
	include '../application/Conexion.php';

	$Data = new Consultas;
	$table = $_GET['tabla'];

	// print_r($_POST);
	// print_r("\n");

	$_flag_bloque = true;
	$orden = $_POST["orden"];
	do {
		// se pregunta si hay regostros con el id
		$orden++;
		$sql = "
			SELECT 
				id
			FROM 
				" . $table . "
			WHERE 
				id_plantilla = " . $_POST["id_plantilla"] . "
				AND orden = ( " . $orden . " )
				AND bloque > 0;
		";
		$respuesta = $Data->getConsulta($sql);
		if ( $respuesta ) {
			$arraySimultaneo = Array();
			$arraySimultaneo["simultaneo"] = $_POST["simultaneo"];
			$Data->updateRegistro( $table , $arraySimultaneo, (int)$respuesta["rowsData"][0][0] );
		}
		else{
			$_flag_bloque = false;
		}
	} while ( $_flag_bloque );

?>
