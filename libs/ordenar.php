<?php 
	include("../application/Config.php");
	include '../application/Conexion.php';

	print_r("Entro en ordenar.php\n");
	$Data = new Consultas;
	$table = $_GET['tabla'];

	$array = array();

	print_r("Accion " . $_GET["accion"] . "\n");

	switch ($_GET["accion"]) {
		case 'adicionar': // OREDENAMIENTO AL CREAR UNA TAREA 
			print_r("Entro en adicionar\n");
			$actividad_previa = $_POST['actividad_previa'];
			$id_carga = $_POST['id_carga'];

			print_r("Maxima actividad previa " . $actividad_previa . "\n");

			$arrayId_carga = explode(",", $id_carga);
			print_r($arrayId_carga);

			for ($i=0; $i < (count($arrayId_carga) - 1) ; $i++) { 
				$array["orden"] = "(orden + 1)";
				$array["actividad_previa"] = "(actividad_previa + 1)";

				$sql = '
					UPDATE
						' . $table . ' 
					SET 
						orden = orden + 1,
						actividad_previa = IF(actividad_previa >= 0 , actividad_previa + 1 , actividad_previa) 
					WHERE 
						id_carga = "' . $arrayId_carga[$i] . '"
						AND orden > "' . $actividad_previa . '"
						AND estado != "0";
				';
				$Data->getConsulta($sql);

				print_r("Carga afectada " . $arrayId_carga[$i] . "\n");
			}
			break;
		
		case 'modificar': // OREDENAMIENTO AL MODIFICAR EL ORDEN DE UNA TAREA 
			print_r("Entro en modificar\n");
			$orden_inicial = $_POST['orden_inicial'];
			$orden_final = $_POST['actividad_previa_deseada'];
			$id_carga = $_POST['id_carga'];

			print_r("Orden inicial " . $orden_inicial . "\n");
			print_r("Orden final " . $orden_final . "\n");

			$arrayId_carga = explode(",", $id_carga);
			// print_r($arrayId_carga);

			for ($i=0; $i < (count($arrayId_carga) - 1) ; $i++) { 

				// Se consulta si la actividad previa es de bloque
				$sql = '
					SELECT
						caco.bloque
					FROM 
						cmx_actividades_carga_oc caco
					WHERE
						caco.id_carga = ' . $arrayId_carga[$i] . '
						AND caco.orden = ' . $orden_inicial . ';
				';
				// print_r($sql);
				$valida_bloque = $Data->getConsulta($sql);
				// print_r($valida_bloque);
				$mueve_actividad = 0;
				if($valida_bloque["rowsData"][0]["bloque"] != 0){
					$mueve_actividad = 2;
				}

				if ($orden_inicial < $orden_final){ // cuando se pasa la actividad a una posicion menor
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
				}else{ // cuando se pasa la actividad a una posicion mayor
					print_r("Entro en else\n");
					$desplaza = $orden_inicial - $orden_final;
					print_r("Valor a desplazar " . $desplaza . "\n");

					// Si la actividad a ordenar es de bloque
					if($valida_bloque["rowsData"][0]["bloque"] != 0){
						print_r("Es actividad en bloque\n");
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
						print_r("No es actividad en bloque\n");
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

				$sql = '
					SELECT 
						caco.id
					FROM
						' . $table . ' caco
					WHERE 
						orden BETWEEN "' . $orden_inicial . '" AND "' . $orden_bloque . '"
						AND id_carga = "' . $arrayId_carga[$i] . '"
						AND estado != 0;
				';
				print_r($sql);
				$resultado_1 = $Data->getConsulta($sql);
				// print_r($resultado_1);

				$sql = '
					UPDATE
						' . $table . ' 
					SET 
						' . $set . '
					WHERE 
						' . $where . ' 
						AND id_carga = "' . $arrayId_carga[$i] . '" 
						AND estado != 0;
				';
				// print_r($sql);
				$Data->getConsulta($sql);


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
							AND id_carga = "' . $arrayId_carga[$i] . '" 
							AND estado != 0;
					';
					// print_r($sql);
					$Data->getConsulta($sql);
				}

				// print_r("Carga afectada " . $arrayId_carga[$i] . "\n");
			}
			break;

		case 'inactivar': // OREDENAMIENTO AL INACTIVAR UNA TAREA 
			print_r("Entro en inactivar\n");
			$id_carga = $_POST['id_carga'];
			$id_actividad = $_POST['id_actividad'];
			$orden = $_POST['orden'];
			$estado = $_POST['estado'];


			$arrayId_carga = explode(",", $id_carga);
			// print_r($arrayId_carga);

			// se reacomodan las actividades no inactivadas
			for ($i=0; $i < (count($arrayId_carga) - 1) ; $i++) { 
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
						AND id_carga = "' . $arrayId_carga[$i] . '";
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
						AND id_carga = "' . $arrayId_carga[$i] . '";
				';
				// print_r($sql);
				$Data->getConsulta($sql);

			}


			break;
	}

?>
