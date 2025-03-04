<?php
	// include("../application/Config.php");
	// include '../application/Conexion.php';

	// $Data = new Consultas;

	// SE DEFINE EL ARRAY DE MATERIALES
	if (isset($_SERVER['HTTP_ORIGIN'])) {
		header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
		header('Access-Control-Allow-Credentials: true');
		header('Access-Control-Max-Age: 86400');    // cache for 1 day
	}
 
    // Access-Control headers are received during OPTIONS requests
	if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
		if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])){
			header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
		}
		if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])){
			header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
		}
		exit(0);
	}
 
	$arrayPedidos = Array();
	// Material 1
	$arrayPedidos[0]["material"] = "1234556";
	$arrayPedidos[0]["pedido"] = "3132654";
	$arrayPedidos[0]["lote"] = "852456";
	// Material 2
	$arrayPedidos[1]["material"] = "321654";
	$arrayPedidos[1]["pedido"] = "3132654";
	$arrayPedidos[1]["lote"] = "963321";
	// Material 3
	$arrayPedidos[2]["material"] = "741258";
	$arrayPedidos[2]["pedido"] = "3132654";
	$arrayPedidos[2]["lote"] = "852963";

	$JSON = $_POST['qrtext'];
	if(isset($_POST)){
		
		$request = $_POST['qrtext'];
		//echo  $request;

		$flag = false;
		$qrtext = $request;
		$arrayQR = reversarKey($qrtext);
		foreach ($arrayPedidos as $key => $value) {
			if ($arrayPedidos[$key]["material"] == $arrayQR[0] AND $arrayPedidos[$key]["pedido"] == $arrayQR[1] AND $arrayPedidos[$key]["lote"] == $arrayQR[2] ) {
				$flag = true;
				break;
			}
 		}

 		if ($flag) {
 			$return = true;
 		}else{
 			$return = false;
 		}

 		/*$arrayRespuesta = Array();
 		$arrayRespuesta["respuesta"] = $return;
		echo json_encode($arrayRespuesta);*/
		echo json_encode($return);
	}

	// decodificar qrtext
    function reversarKey($key) {
        $key = html_entity_decode($key);
        $key = strrev($key);
        $key = base64_decode($key);
        return explode('-', $key);
    }


?>