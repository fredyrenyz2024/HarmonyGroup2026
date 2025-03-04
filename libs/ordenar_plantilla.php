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
		case 'adicionar': // OREDENAMIENTO AL CREAR UNA TAREA 
			print_r("Entro en adicionar\n");

			if ($_POST['actividad_previa'] != "vacio") {
				$id_plantilla = $_POST['id_plantilla'];
				$actividad_previa = $_POST['actividad_previa'];

				switch ($_POST['integracion']) {
					case 'soluciones':
						$incrementa = 8;
						break;

					case 'soluciones_importacion':
						$incrementa = 13;
						break;

					default:
						$incrementa = 1;
						break;
				}

				$sql = '
					UPDATE
						' . $table . ' 
					SET 
						orden = orden + ' . $incrementa . ',
						actividad_previa = IF(actividad_previa >= 0 , actividad_previa + ' . $incrementa . ' , actividad_previa) 
					WHERE 
						id_plantilla = "' . $id_plantilla . '"
						AND orden > "' . $actividad_previa . '"
						AND estado != "0";
				';
				// print_r("\n" . $sql . "\n");
				$Data->getConsulta($sql);
			} else {
				print_r("Es la primera actividad creada de la plantilla\n");
			}
			break;

		case 'modificar': // OREDENAMIENTO AL MODIFICAR EL ORDEN DE UNA TAREA 
			print_r("Entro en modificar\n");
			$orden_inicial = $_POST['orden_inicial'];
			$orden_final = $_POST['actividad_previa_deseada'];
			$id_plantilla = $_POST['id_plantilla'];


			// Se consulta si la actividad previa es de bloque
			$sql = '
				SELECT
					cap.bloque
				FROM 
					cmx_actividades_plantilla cap
					INNER JOIN cmx_plantillas cp ON cp.id = cap.id_plantilla
				WHERE
					cp.id = ' . $_POST["id_plantilla"] . '
					AND cap.orden = ' . $orden_inicial . ';
			';
			// print_r($sql);
			$valida_bloque = $Data->getConsulta($sql);
			// print_r($valida_bloque);
			$mueve_actividad = 0;
			if($valida_bloque["rowsData"][0]["bloque"] != 0){
				$mueve_actividad = 2;
			}

			// cuando se pasa la actividad a una posicion menor
			if ($orden_inicial < $orden_final){ 
				$desplaza = $orden_final - $orden_inicial;

				// Si la actividad a ordenar es de bloque
				if($valida_bloque["rowsData"][0]["bloque"] != 0){ 
					$orden_bloque = $orden_inicial + $mueve_actividad;
					$set = '
						orden = orden - ' . ( $mueve_actividad + 1 ) . ',
						actividad_previa = IF(actividad_previa >= 0 , actividad_previa - ' . ( $mueve_actividad + 1 ) . ' , actividad_previa) 
					';
					$where = ' 
						orden BETWEEN "' . ($orden_inicial + $mueve_actividad) . '" AND "' . $orden_final . '" 
						AND orden > "' . ($orden_inicial + $mueve_actividad) . '" 
					';

					$set1 = '
						orden = orden + ' . ($desplaza - $mueve_actividad) . ',
						actividad_previa = actividad_previa + ' . ($desplaza - $mueve_actividad) . ' 
					';
				}
				else{
					$orden_bloque = $orden_inicial;
					$set = '
						orden = orden - 1,
						actividad_previa = IF(actividad_previa >= 0 , actividad_previa - 1 , actividad_previa) 
					';
					$where = ' 
						orden BETWEEN "' . $orden_inicial . '" AND "' . $orden_final . '" 
						AND orden > "' . $orden_inicial . '" 
					';

					$set1 = '
						orden = orden + ' . $desplaza . ',
						actividad_previa = actividad_previa + ' . $desplaza . ' 
					';
				}
			}
			// cuando se pasa la actividad a una posicion mayor
			else{ 
				$desplaza = $orden_inicial - $orden_final;

				// Si la actividad a ordenar es de bloque
				if($valida_bloque["rowsData"][0]["bloque"] != 0){
					$orden_bloque = $orden_inicial + $mueve_actividad;
					$set = '
						orden = orden + ' . ( $mueve_actividad + 1 ) . ',
						actividad_previa = IF(actividad_previa >= 0 , actividad_previa + ' . ( $mueve_actividad + 1 ) . ' , actividad_previa) 
					';
					$where = ' 
						orden BETWEEN "' . ( $orden_final + 1 ) . '" AND "' . ( $orden_inicial - 1 ) . '" 
					';

					$set1 = '
						orden = orden - ' . ( $desplaza - 1 ) . ',
						actividad_previa = actividad_previa - ' . ( $desplaza - 1 ) . ' 
					';
				}
				else{
					$orden_bloque = $orden_inicial;
					$set = '
						orden = orden + ' . ( $mueve_actividad + 1 ) . ',
						actividad_previa = actividad_previa + ' . ( $mueve_actividad + 1 ) . ' 
					';
					$where = ' 
						orden BETWEEN "' . ( $orden_final + 1 ) . '" AND "' . $orden_inicial . '" 
					';

					$set1 = '
						orden = orden - ' . $desplaza . ',
						actividad_previa = actividad_previa - ' . $desplaza . ' 
					';
				}
			}

			// Se selecciona las actividades seleccionadas
			$sql = '
				SELECT 
					caco.id
				FROM
					' . $table . ' caco
				WHERE 
					orden BETWEEN "' . $orden_inicial . '" AND "' . $orden_bloque . '"
					AND id_plantilla = "' . $id_plantilla . '"
					AND estado != 0
				ORDER BY caco.id;
			';
			// print_r($sql);
			$resultado_1 = $Data->getConsulta($sql);
			// print_r($resultado_1);


			// Se acomoda las activades no seleccionadas
			$sql = '
				UPDATE
					' . $table . ' 
				SET 
					' . $set . '
				WHERE 
					' . $where . ' 
					AND id_plantilla = "' . $id_plantilla . '" 
					AND estado != 0;
			';
			// print_r($sql);
			$resultado = $Data->getConsulta($sql);
			// print_r($resultado);

			// SE ACOMODA LA O LAS ACTIVDADES SELECCIONADAS 
			foreach ($resultado_1["rowsData"] as $key => $value) {
				$id_actividad = $resultado_1["rowsData"][$key]["id"];
				$sql = '
					UPDATE
						' . $table . ' 
					SET 
						' . $set1 . '
					WHERE 
						id = "' . $id_actividad . '" 
						AND id_plantilla = "' . $id_plantilla . '" 
						AND estado != 0;
				';
				// print_r($sql);
				$resultado = $Data->getConsulta($sql);
				// print_r($resultado);
			}
			break;

		case 'inactivar': // OREDENAMIENTO AL INACTIVAR UNA TAREA 
			print_r("Entro en inactivar\n");
			$id_plantilla = $_POST['id_plantilla'];
			$orden = $_POST['orden'];
			$estado = $_POST['estado'];

			print_r("id plantilla - " . $id_plantilla . "\n");
			print_r("Orden - " . $orden . "\n");
			print_r("Estado - " . $estado . "\n");

			// Se inactiva la actividad
			$sql = '
				UPDATE
					' . $table . ' 
				SET 
					estado = ' . $estado . ',
					orden = 0, 
					actividad_previa = 0 
				WHERE 
					orden = "' . $orden . '"
					AND id_plantilla = "' . $id_plantilla . '";
			';
			// print_r($sql);
			$Data->getConsulta($sql);

			$sql = '
				UPDATE
					' . $table . ' 
				SET 
					orden = orden - 1,
					actividad_previa = IF(actividad_previa >= 0 , actividad_previa - 1 , actividad_previa) 
				WHERE 
					orden > "' . $orden . '"
					AND id_plantilla = "' . $id_plantilla . '";
			';
			// print_r($sql);
			$Data->getConsulta($sql);

			break;
	}

?>
