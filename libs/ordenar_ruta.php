<?php 
	include("../application/Config.php");
	include '../application/Conexion.php';

	print_r("Entro en ordenar_plantilla.php\n");

	// print_r("Array del post \n");
	// print_r($_POST);

	// print_r("Array del get \n");
	// print_r($_GET);

	$Data = new Consultas;
	$table = $_GET['tabla'];

	switch ($_GET["accion"]) {
		case 'adicionar': // OREDENAMIENTO AL CREAR UN PUNTO DE CONTROL 
			print_r("Entro en adicionar\n");
			if ($_POST['flag_puntos'] == 1) {
				print_r("Ya existen puntos de control creados en la ruta\n");
				$aumento = 1;
				$id_mapa_ruta = $_POST['id_mapa_ruta'];
				$control_previo = $_POST['control_previo'];
				$orden = $_POST['orden'];

				// Se pregunta si existen una puntos de control posteriores  
				$sql = '
					SELECT 
						COUNT(id) CUANTOS
					FROM 
						' . $table . ' 
					WHERE 
						id_mapa_ruta = "' . $id_mapa_ruta . '"
						AND orden > "' . $orden . '"
						AND estado != "0";
				';
				// print_r("\n" . $sql . "\n");
				$result = $Data->getConsulta($sql);

				if ( $result["rowsData"][0]["CUANTOS"] > 0 ) {
					print_r("Hay controles de ruta posteriores\n");
					$sql = '
						UPDATE
							' . $table . ' 
						SET 
							orden = orden + 1,
							control_previo = IF(control_previo >= 0 , control_previo + 1 , control_previo) 
						WHERE 
							id_mapa_ruta = "' . $id_mapa_ruta . '"
							AND orden > "' . $orden . '"
							AND estado != "0";
					';
					// print_r("\n" . $sql . "\n");
					$Data->getConsulta($sql);
				} else {
					print_r("Se insertará como ultima actividad\n");
				}
			} else {
				print_r("Es el primer punto de control creado de la ruta\n");
				$aumento = 0;
			}

			// Se inserta el nuevo punto de control
			$array = Array();
			$array["id_mapa_ruta"] = $_POST["id_mapa_ruta"];
			$array["id_punto_control"] = $_POST["id_punto_control"];
			$array["orden"] = ($_POST["orden"] + $aumento);
			$array["control_previo"] = ($_POST["control_previo"] + $aumento);
			$array["tiempo_estimado"] = $_POST["tiempo_estimado"];
			// print_r("Array a insertar \n");
			// print_r($array);
			$Data->setRegistro($table, $array);

			break;

		// case 'modificar': // OREDENAMIENTO AL MODIFICAR EL ORDEN DE UN PUNTO DE CONTROL 
		// 	print_r("Entro en modificar\n");
		// 	$orden_inicial = $_POST['orden_inicial'];
		// 	$orden_final = $_POST['actividad_previa_deseada'];
		// 	$id_plantilla = $_POST['id_plantilla'];


		// 	// Se consulta si la actividad previa es de bloque
		// 	$sql = '
		// 		SELECT
		// 			cap.bloque
		// 		FROM 
		// 			cmx_actividades_plantilla cap
		// 			INNER JOIN cmx_plantillas cp ON cp.id = cap.id_plantilla
		// 		WHERE
		// 			cp.id = ' . $_POST["id_plantilla"] . '
		// 			AND cap.orden = ' . $orden_inicial . ';
		// 	';
		// 	// print_r($sql);
		// 	$valida_bloque = $Data->getConsulta($sql);
		// 	// print_r($valida_bloque);
		// 	$mueve_actividad = 0;
		// 	if($valida_bloque["rowsData"][0]["bloque"] != 0){
		// 		$mueve_actividad = 2;
		// 	}

		// 	// cuando se pasa la actividad a una posicion menor
		// 	if ($orden_inicial < $orden_final){ 
		// 		$desplaza = $orden_final - $orden_inicial;

		// 		// Si la actividad a ordenar es de bloque
		// 		if($valida_bloque["rowsData"][0]["bloque"] != 0){ 
		// 			$orden_bloque = $orden_inicial + $mueve_actividad;
		// 			$set = '
		// 				orden = orden - ' . ( $mueve_actividad + 1 ) . ',
		// 				actividad_previa = IF(actividad_previa >= 0 , actividad_previa - ' . ( $mueve_actividad + 1 ) . ' , actividad_previa) 
		// 			';
		// 			$where = ' 
		// 				orden BETWEEN "' . ($orden_inicial + $mueve_actividad) . '" AND "' . $orden_final . '" 
		// 				AND orden > "' . ($orden_inicial + $mueve_actividad) . '" 
		// 			';

		// 			$set1 = '
		// 				orden = orden + ' . ($desplaza - $mueve_actividad) . ',
		// 				actividad_previa = actividad_previa + ' . ($desplaza - $mueve_actividad) . ' 
		// 			';
		// 		}
		// 		else{
		// 			$orden_bloque = $orden_inicial;
		// 			$set = '
		// 				orden = orden - 1,
		// 				actividad_previa = IF(actividad_previa >= 0 , actividad_previa - 1 , actividad_previa) 
		// 			';
		// 			$where = ' 
		// 				orden BETWEEN "' . $orden_inicial . '" AND "' . $orden_final . '" 
		// 				AND orden > "' . $orden_inicial . '" 
		// 			';

		// 			$set1 = '
		// 				orden = orden + ' . $desplaza . ',
		// 				actividad_previa = actividad_previa + ' . $desplaza . ' 
		// 			';
		// 		}
		// 	}
		// 	// cuando se pasa la actividad a una posicion mayor
		// 	else{ 
		// 		$desplaza = $orden_inicial - $orden_final;

		// 		// Si la actividad a ordenar es de bloque
		// 		if($valida_bloque["rowsData"][0]["bloque"] != 0){
		// 			$orden_bloque = $orden_inicial + $mueve_actividad;
		// 			$set = '
		// 				orden = orden + ' . ( $mueve_actividad + 1 ) . ',
		// 				actividad_previa = IF(actividad_previa >= 0 , actividad_previa + ' . ( $mueve_actividad + 1 ) . ' , actividad_previa) 
		// 			';
		// 			$where = ' 
		// 				orden BETWEEN "' . ( $orden_final + 1 ) . '" AND "' . ( $orden_inicial - 1 ) . '" 
		// 			';

		// 			$set1 = '
		// 				orden = orden - ' . ( $desplaza - 1 ) . ',
		// 				actividad_previa = actividad_previa - ' . ( $desplaza - 1 ) . ' 
		// 			';
		// 		}
		// 		else{
		// 			$orden_bloque = $orden_inicial;
		// 			$set = '
		// 				orden = orden + ' . ( $mueve_actividad + 1 ) . ',
		// 				actividad_previa = actividad_previa + ' . ( $mueve_actividad + 1 ) . ' 
		// 			';
		// 			$where = ' 
		// 				orden BETWEEN "' . ( $orden_final + 1 ) . '" AND "' . $orden_inicial . '" 
		// 			';

		// 			$set1 = '
		// 				orden = orden - ' . $desplaza . ',
		// 				actividad_previa = actividad_previa - ' . $desplaza . ' 
		// 			';
		// 		}
		// 	}

		// 	// Se selecciona las actividades seleccionadas
		// 	$sql = '
		// 		SELECT 
		// 			caco.id
		// 		FROM
		// 			' . $table . ' caco
		// 		WHERE 
		// 			orden BETWEEN "' . $orden_inicial . '" AND "' . $orden_bloque . '"
		// 			AND id_plantilla = "' . $id_plantilla . '"
		// 			AND estado != 0
		// 		ORDER BY caco.id;
		// 	';
		// 	// print_r($sql);
		// 	$resultado_1 = $Data->getConsulta($sql);
		// 	// print_r($resultado_1);


		// 	// Se acomoda las activades no seleccionadas
		// 	$sql = '
		// 		UPDATE
		// 			' . $table . ' 
		// 		SET 
		// 			' . $set . '
		// 		WHERE 
		// 			' . $where . ' 
		// 			AND id_plantilla = "' . $id_plantilla . '" 
		// 			AND estado != 0;
		// 	';
		// 	// print_r($sql);
		// 	$resultado = $Data->getConsulta($sql);
		// 	// print_r($resultado);

		// 	// SE ACOMODA LA O LAS ACTIVDADES SELECCIONADAS 
		// 	foreach ($resultado_1["rowsData"] as $key => $value) {
		// 		$id_actividad = $resultado_1["rowsData"][$key]["id"];
		// 		$sql = '
		// 			UPDATE
		// 				' . $table . ' 
		// 			SET 
		// 				' . $set1 . '
		// 			WHERE 
		// 				id = "' . $id_actividad . '" 
		// 				AND id_plantilla = "' . $id_plantilla . '" 
		// 				AND estado != 0;
		// 		';
		// 		// print_r($sql);
		// 		$resultado = $Data->getConsulta($sql);
		// 		// print_r($resultado);
		// 	}
		// 	break;

		case 'inactivar': // OREDENAMIENTO AL INACTIVAR UN PUNTO DE CONTROL 
			print_r("Entro en inactivar\n");
			$id = $_POST['id'];
			$id_mapa_ruta = $_POST['id_mapa_ruta'];
			$orden = $_POST['orden'];
			$estado = $_POST['estado'];
			// print_r("id - " . $id . "\n");
			// print_r("id_mapa_ruta - " . $id_mapa_ruta . "\n");
			// print_r("Orden - " . $orden . "\n");
			// print_r("Estado - " . $estado . "\n");

			// Se borra el punto de control
			$Data->setDeleteId($table, $id);

			// Se actualiza los puntos de control restantes 
			$sql = '
				UPDATE
					' . $table . ' 
				SET 
					orden = orden - 1,
					control_previo = IF(control_previo >= 0 , control_previo - 1 , control_previo) 
				WHERE 
					orden > "' . $orden . '"
					AND id_mapa_ruta = "' . $id_mapa_ruta . '";
			';
			// print_r($sql);
			$Data->getConsulta($sql);

			break;
	}

?>
