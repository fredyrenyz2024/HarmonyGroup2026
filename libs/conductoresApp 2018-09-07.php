<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

	date_default_timezone_set('America/Bogota');
	include 'Session.php';
	include './Crud.php';


	# Get JSON as a string
	$json_str = file_get_contents('php://input');


	# Get as an object
	$json_obj = json_decode($json_str);
	// echo "<pre>".print_r($json_obj,1)."</pre>";exit;

	$mensaje = "";
	$ContenidoHTML = "";

	switch ( $json_obj->Op ) {
		case 'verificarConductor':
			$model = new Session();
			$documento = $json_obj->documento;
			$model->verificarConductor($documento);
			$respuesta = $model->respuesta;
			if ($respuesta == "GOOD") {
				$filas = $model->listado;
				if (count($filas) > 0){
					$ContenidoHTML = [];
					$x = 0;
					$mensaje = $model->mensaje;
					foreach ($filas as $fila) {
						$ContenidoHTML[$x][0] = $fila["id"];
						$ContenidoHTML[$x][1] = $fila["numero_documento"];
						$ContenidoHTML[$x][2] = $fila["nombre"];
						$x++;
					}
				}
				else{
					$respuesta = "BAD";
				}
			}else{
				$respuesta = "BAD";
			}
			break;

		case 'asignarUbicacionConductor':
			$model = new Session();
			$id = $json_obj->id;
			$latitud = $json_obj->latitud;
			$longitud = $json_obj->longitud;
			$model->asignarUnbicacionConductor($id,$latitud,$longitud);
			$respuesta = $model->respuesta;
			$mensaje = $model->mensaje;
			break;

		default:
			$respuesta = "error_respuesta";
			$mensaje =  "No ingreso en una funcion especifica ";
			$ContenidoHTML = $json_obj;
			break;
	}

	$salidaJSON = array("respuesta" => $respuesta, "mensaje" => $mensaje, "contenido" => $ContenidoHTML);
	echo json_encode($salidaJSON);

?>