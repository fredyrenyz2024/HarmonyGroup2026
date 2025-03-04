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
			$pass = $json_obj->pass;
			$model->verificarConductor($documento,$pass);
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
						$ContenidoHTML[$x][3] = $fila["estado"];
						$ContenidoHTML[$x][4] = $fila["TURNO"];
						$ContenidoHTML[$x][5]["ruta"] = "Bogotá - Cali";
						$ContenidoHTML[$x][5]["estado"] = "yaCargue";
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
			$ContenidoHTML = $model->contenido;
			break;

		// Modulo de registros de conductor 
		case 'listarGuiasConductor':
			$model = new Session();
			$id = $json_obj->id;
			$latitud = $json_obj->latitud;
			$longitud = $json_obj->longitud;

			$respuesta = "GOOD";
			$mensaje = "Esto está quemado en listarGuiasConductor";
			$array = Array();
			$array[0]["guia"] = 654654;
			$array[0]["manifiesto"] = 9879321;
			$array[0]["origen"] = "origen 1";
			$array[0]["destino"] = "destino 1";

			$array[1]["guia"] = 339943;
			$array[1]["manifiesto"] = 9964524;
			$array[1]["origen"] = "origen 2";
			$array[1]["destino"] = "destino 2";

			$array[2]["guia"] = 658782;
			$array[2]["manifiesto"] = 9964524;
			$array[2]["origen"] = "origen 3";
			$array[2]["destino"] = "destino 3";
			$ContenidoHTML = $array;
			break;

		case 'llegueAOrigen':
			$model = new Session();
			$id = $json_obj->id;
			$latitud = $json_obj->latitud;
			$longitud = $json_obj->longitud;

			$respuesta = "GOOD";
			$mensaje = "Esto está quemado en llegueAOrigen";
			$ContenidoHTML = "OK";
			break;

		case 'yaCargue':
			$model = new Session();
			$id = $json_obj->id;
			$latitud = $json_obj->latitud;
			$longitud = $json_obj->longitud;

			$respuesta = "GOOD";
			$mensaje = "Esto está quemado en yaCargue";
			$ContenidoHTML = "OK";
			break;

		case 'llegueADestino':
			$model = new Session();
			$id = $json_obj->id;
			$latitud = $json_obj->latitud;
			$longitud = $json_obj->longitud;

			$respuesta = "GOOD";
			$mensaje = "Esto está quemado en llegueADestino";
			$ContenidoHTML = "OK";
			break;

		case 'yaDescargue':
			$model = new Session();
			$id = $json_obj->id;
			$latitud = $json_obj->latitud;
			$longitud = $json_obj->longitud;

			$respuesta = "GOOD";
			$mensaje = "Esto está quemado en yaDescargue";
			$ContenidoHTML = "OK";
			break;

		default:
			$respuesta = "error_respuesta";
			$mensaje =  "No ingresó en una función específica ";
			$ContenidoHTML = $json_obj;
			break;
	}

	$salidaJSON = array("respuesta" => $respuesta, "mensaje" => $mensaje, "contenido" => $ContenidoHTML);
	echo json_encode($salidaJSON);
?>