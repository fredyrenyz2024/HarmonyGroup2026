<?php
include("../application/Config.php");
include '../application/Conexion.php';
// configuracion de la zona horaria
date_default_timezone_set('America/Bogota');

print_r("Entro en archivo gestion_actividades.php\n");
$Data = new Consultas;
$Data2 = new Conexion;
$PDO = $Data2->conectar();

// RECIBO LOS PARAMETROS POR GET
$table = $_GET['tabla'];
// print_r("Se recibe por GET\nTabla - " . $table . "\n");

// Tomo la fecha actual
$fecha_actual = getdate();

// Tomo la fecha/hora de inicio de la actividad
$fecha_inicial = strtotime($_POST["fecha_hora_inicio"]);
// print_r("Fecha inicial en timestamp - " . $fecha_inicial . "\n");

// se fltra el proyecto al cual se esta insertando el entregable
switch ($_GET['proyecto']) {
	case 'ordenes_compra_oc':
		$_id_material_carga = 'id_carga';
		break;

	case 'importaciones':
		$_id_material_carga = 'id_material';
		break;

	default:
		break;
}

// Se saca la diferencia en minutos entre las fechas/horas
if ($fecha_inicial < $fecha_actual[0]) {
	// print_r("Se resta el tiempo\n");
	$tiempo_usado = ($fecha_inicial - $fecha_actual[0]) / 60;
	$tiempo_usado = abs($tiempo_usado);
	$tiempo_usado = floor($tiempo_usado);
	// print_r("Tiempo usado - " . $tiempo_usado . " minutos\n");
} else {
	// print_r("El tempo de ejecucion es 0\n");
	$tiempo_usado = 0;
}

// Se toma la fecha actual para poner la fecha inicial de la siguinete actividad
$fecha_final_actividad = $fecha_actual["year"] . "-" . $fecha_actual["mon"] . "-" . $fecha_actual["mday"] . " " . $fecha_actual["hours"] . ":" . $fecha_actual["minutes"] . ":" . $fecha_actual["seconds"];
// print_r("Tiempo actual - " . $fecha_final_actividad . "\n");


// FILTRO PARA SABER SI LA ACTIVIDAD SE DEBE CONCLUIR
$_falg_gestiona_actividad = true;
if (isset($_POST["tipo_actividad"])) {
	switch ($_POST["tipo_actividad"]) {
		case 'seguimiento':
			$_falg_gestiona_actividad = true;
			if (isset($_POST["seguimiento"])  and  $_POST["seguimiento"] != "") {
				$_falg_gestiona_actividad = false;
			}
			break;

		case 'seguimiento_cliente':
			$_falg_gestiona_actividad = true;
			if (isset($_POST["seguimiento"])  and  $_POST["seguimiento"] != "") {
				$_falg_gestiona_actividad = false;
			}
			break;

		case 'seguimiento_ruta':
			$_falg_gestiona_actividad = true;
			if (isset($_POST["tipo_seguimiento_ruta"])  and  $_POST["tipo_seguimiento_ruta"] != "Llegada Destino") {
				$_falg_gestiona_actividad = false;
			}
			break;

		default:
			$_falg_gestiona_actividad = true;
			break;
	}
}

// Si se debe gestionar la actividad 
if ($_falg_gestiona_actividad) {
	// array para actulizar la actividad actual 
	$array = array();
	// se definen los campos a actualizar de la actividad actual
	if (isset($_POST["costo_real"])) {
		$array["costo_real"] = $_POST["costo_real"];
	}
	$array["tiempo_real"] = $tiempo_usado;
	$array["fecha_hora_finalizacion"] = $fecha_final_actividad;
	$array["respuesta"] = $_POST["respuesta"];
	$array["estado"] = 1;

	// Se actualiza la actividad actual
	$arrayId_actividad = explode(",", $_POST["id"]);
	// print_r($arrayId_actividad);

	// Se pregunta si el material de la actividad está agrupado con material de otro proyecto
	$sql = '
    SELECT cam.id_agrupamiento
    FROM cmx_importacion_actividades cia
    INNER JOIN cmx_importacion_material cim ON cim.id = cia.id_material
    INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cim.id
    WHERE cia.id_importacion != :id_importacion
    AND cia.id = :id_actividad
';

	// Preparar la consulta
	$stmt = $PDO->prepare($sql);

	// Vincular parámetros
	$stmt->bindParam(':id_importacion', $_POST["id_importacion"], PDO::PARAM_INT);
	$stmt->bindParam(':id_actividad', $arrayId_actividad[0], PDO::PARAM_INT);

	// Ejecutar la consulta
	$stmt->execute();

	// Obtener los resultados
	$resul_01 = $stmt->fetchAll(PDO::FETCH_ASSOC);

	// Validar si hay resultados
	if ($resul_01 && count($resul_01) > 0) {
		// Se encontraron materiales agrupados en otros proyectos
		print_r("El material de la actividad está agrupado con marterial de otro proyecto.\n");
		// Se busca las actividades agrupadas 
		foreach ($resul_01 as $key => $value) {
			$sql = '
					SELECT 
						cia.*
					FROM 
						cmx_agrupacion_material cam
						INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto
						INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
					WHERE 
						cam.id_agrupamiento = "' . $value["id_agrupamiento"] . '"
						AND cia.estado = 2;
				';
			// $resul_02 = $Data->getConsulta($sql);
			$resul_02 = $PDO->prepare($sql);
			$resul_02->execute();
			$resul_02 = $resul_02->fetchAll(PDO::FETCH_ASSOC);
			// print_r($sql);
			// print_r($resul_02);

			foreach ($resul_02 as $key_1 => $value_1) {
				// Tomo la fecha/hora de inicio de la actividad
				$fecha_inicial = strtotime($value_1["fecha_hora_inicio"]);
				// print_r("Fecha inicial en timestamp - " . $fecha_inicial . "\n");

				// Se saca la diferencia en minutos entre las fechas/horas
				if ($fecha_inicial < $fecha_actual[0]) {
					// print_r("Se resta el tiempo\n");
					$tiempo_usado = ($fecha_inicial - $fecha_actual[0]) / 60;
					$tiempo_usado = abs($tiempo_usado);
					$tiempo_usado = floor($tiempo_usado);
					// print_r("Tiempo usado - " . $tiempo_usado . " minutos\n");
				} else {
					// print_r("El tempo de ejecucion es 0\n");
					$tiempo_usado = 0;
				}

				// Se toma la fecha actual para poner la fecha inicial de la siguinete actividad
				$fecha_final_actividad = $fecha_actual["year"] . "-" . $fecha_actual["mon"] . "-" . $fecha_actual["mday"] . " " . $fecha_actual["hours"] . ":" . $fecha_actual["minutes"] . ":" . $fecha_actual["seconds"];
				// print_r("Tiempo actual - " . $fecha_final_actividad . "\n");

				if (isset($_POST["costo_real"])) {
					$arrayActividadAgrupada["costo_real"] = $_POST["costo_real"];
				}

				// Se actualiza la actividad actual
				$arrayActividadAgrupada["tiempo_real"] = $tiempo_usado;
				$arrayActividadAgrupada["fecha_hora_finalizacion"] = $fecha_final_actividad;
				$arrayActividadAgrupada["respuesta"] = $_POST["respuesta"];
				$arrayActividadAgrupada["estado"] = 1;
				$resul = $Data->updateRegistro($table, $arrayActividadAgrupada, $value_1["id"]);
				// print_r($arrayActividadAgrupada);

				// Se actualiza la actividad siguiente
				$sql = '
						UPDATE
							' . $table . ' 
						SET 
							estado = 2,
							fecha_hora_inicio = "' . $fecha_final_actividad . '"
						WHERE 
							' . $_id_material_carga . ' = "' . $value_1["id_material"] . '"
							AND orden = "' . ($_POST["orden"] + 1) . '";
					';
				// $resul = $Data->getConsulta($sql);
				$resul = $PDO->prepare($sql);
				$resul->execute();
				// print_r($sql);
				// print_r($resul);

				// Se verifica si la actividad siguiente es simultanea con otra y se activa 
				activaActividadSimultanea();
			}
		}
	} else { // El matrerial de la actividad no esta agrupada con materiales de otro proyecto
		print_r("El material de la actividad NO está agrupado con marterial de otro proyecto.\n");

		/**************** SE GESTIONA LA ACTIVIDAD ACTUAL ***********/
		$_falg_gestiona_actividad_siguiente = false;
		for ($i = 0; $i < (count($arrayId_actividad) - 1); $i++) {
			// print_r($arrayId_actividad[$i] . "\n");

			// Se actualiza la actividad actual
			$resul = $Data->updateRegistro($table, $array, $arrayId_actividad[$i]);

			// Se busca la información de la actividad actual
			$sql = '
				SELECT cia.*
				FROM cmx_importacion_proyecto cip
				INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				WHERE cia.id = :id_actividad
			';

			// Preparar la consulta
			$stmt = $PDO->prepare($sql);
			// Vincular parámetro
			$stmt->bindParam(':id_actividad', $arrayId_actividad[$i], PDO::PARAM_INT);
			// Ejecutar la consulta
			$stmt->execute();
			// Obtener los resultados
			$resul_01 = $stmt->fetch(PDO::FETCH_ASSOC);

			// // Verificar si se encontraron datos
			// if ($resul_01 && isset($resul_01["bloque"]) && $resul_01["bloque"] > 0) {
			// 	/******* SE BUSCA LAS ACTIVIDADES ANTERIORES NO ESTEN GESTIONADAS *******/
			// 	$_flag_material = "";
			// 	if ($resul_01["rowsData"][0]["id_material"]) {
			// 		$_flag_material = ' AND cia.id_material = ' . $resul_01["rowsData"][0]["id_material"] . ' ';
			// 	}

			// 	$sql = '
			// 			SELECT
			// 				COUNT(cia.id) CUANTOS
			// 			FROM 
			// 				cmx_importacion_proyecto cip
			// 				INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
			// 			WHERE
			// 				cip.id = ' . $resul_01["rowsData"][0]["id_importacion"] . '
			// 				AND cia.grupo = ' . $resul_01["rowsData"][0]["grupo"] . '
			// 				AND cia.simultaneo = "' . $resul_01["rowsData"][0]["simultaneo"] . '"
			// 				' . $_flag_material . ' 
			// 				AND cia.orden < ' . $resul_01["rowsData"][0]["orden"] . '
			// 				AND cia.estado != 1;
			// 		';
			// 	$resul_02 = $Data->getConsulta($sql);
			// 	// print_r($sql . "\n");
			// 	// print_r($resul_02);

			// 	print_r("Hay " . $resul_02["rowsData"][0]["CUANTOS"] . " actividades simultaneas gestionadas antes de la actual.\n");

			// 	if ($resul_02["rowsData"][0]["CUANTOS"] == 0) {
			// 		/******* SE BUSCA SI LAS ACTIVIDADES SIMULTANEAS SIGUIENTES NO ESTEN GESTIONADAS *******/
			// 		// Si simultaneo es mayor que 0
			// 		if ($resul_01["rowsData"][0]["simultaneo"] > 0) {
			// 			$_flag_material = "";
			// 			if ($resul_01["rowsData"][0]["id_material"]) {
			// 				$_flag_material = ' AND cia.id_material = ' . $resul_01["rowsData"][0]["id_material"] . ' ';
			// 			}

			// 			$sql = '
			// 					SELECT
			// 						COUNT(cia.id) CUANTOS
			// 					FROM 
			// 						cmx_importacion_proyecto cip
			// 						INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
			// 					WHERE
			// 						cip.id = ' . $resul_01["rowsData"][0]["id_importacion"] . '
			// 						AND cia.grupo = ' . $resul_01["rowsData"][0]["grupo"] . '
			// 						AND cia.simultaneo = "' . $resul_01["rowsData"][0]["simultaneo"] . '"
			// 						' . $_flag_material . ' 
			// 						AND cia.orden > ' . $resul_01["rowsData"][0]["orden"] . '
			// 						AND cia.estado != 1;
			// 				';
			// 			$resul_05 = $Data->getConsulta($sql);
			// 			// print_r($sql . "\n");
			// 			// print_r($resul_02);

			// 			print_r("Hay " . $resul_05["rowsData"][0]["CUANTOS"] . " actividades simultaneas gestionadas después de la actual 1.\n");

			// 			if ($resul_05["rowsData"][0]["CUANTOS"] == 0) {
			// 				$_falg_gestiona_actividad_siguiente = true;
			// 			} else {
			// 				$_flag_material = "";
			// 				if ($resul_01["rowsData"][0]["id_material"]) {
			// 					$_flag_material = ' AND cia.id_material = ' . $resul_01["rowsData"][0]["id_material"] . ' ';
			// 				}

			// 				// Se busca la información de la actividad siguiente
			// 				$sql = '
			// 						SELECT
			// 							cia.*
			// 						FROM 
			// 							cmx_importacion_proyecto cip
			// 							INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
			// 						WHERE
			// 							cip.id = ' . $resul_01["rowsData"][0]["id_importacion"] . '
			// 							AND cia.grupo = ' . $resul_01["rowsData"][0]["grupo"] . '
			// 							' . $_flag_material . ' 
			// 							AND cia.orden = ' . ($resul_01["rowsData"][0]["orden"] + 1) . ';
			// 					';
			// 				$resul_06 = $Data->getConsulta($sql);
			// 				// print_r($sql . "\n");
			// 				// print_r($resul_06);

			// 				if ($resul_01["rowsData"][0]["bloque"] < $resul_06["rowsData"][0]["bloque"]) {
			// 					$_falg_gestiona_actividad_siguiente = true;
			// 				} else {
			// 					if ($resul_06["rowsData"][0]["bloque"] > 1) {
			// 						$_falg_gestiona_actividad_siguiente = true;
			// 					}
			// 				}
			// 			}
			// 		} else {
			// 			print_r("La actividad no es simultanea con otras\n");
			// 			$_falg_gestiona_actividad_siguiente = true;
			// 		}
			// 	} else {
			// 		/******* SI EXISTEN ACTIVIDADES ANTERIORES SIN GESTIONAR SE DEBE PREGUNTAR SI LA SIGUINETE ES DEL BLOQUE *******/
			// 		/******* SE BUSCA LA ACTIVIDAD SIGUIENTE *******/
			// 		$_flag_material = "";
			// 		if ($resul_01["rowsData"][0]["id_material"]) {
			// 			$_flag_material = ' AND cia.id_material = ' . $resul_01["rowsData"][0]["id_material"] . ' ';
			// 		}

			// 		$sql = '
			// 				SELECT
			// 					cia.*
			// 				FROM 
			// 					cmx_importacion_proyecto cip
			// 					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
			// 				WHERE
			// 					cip.id = ' . $resul_01["rowsData"][0]["id_importacion"] . '
			// 					AND cia.grupo = ' . $resul_01["rowsData"][0]["grupo"] . '
			// 					' . $_flag_material . '
			// 					AND cia.orden = ' . ($resul_01["rowsData"][0]["orden"] + 1) . ';
			// 			';
			// 		$resul_03 = $Data->getConsulta($sql);
			// 		// print_r($sql . "\n");
			// 		// print_r($resul_03);

			// 		if ($resul_01["rowsData"][0]["bloque"] < $resul_03["rowsData"][0]["bloque"]) {
			// 			$_falg_gestiona_actividad_siguiente = true;
			// 		} else {
			// 			if ($resul_03["rowsData"][0]["simultaneo"] == 0 and $resul_02["rowsData"][0]["CUANTOS"] == 0) {
			// 				$_falg_gestiona_actividad_siguiente = true;
			// 			} else {
			// 				if ($resul_01["rowsData"][0]["simultaneo"] != $resul_03["rowsData"][0]["simultaneo"] and $resul_02["rowsData"][0]["CUANTOS"] == 0) {
			// 					$_falg_gestiona_actividad_siguiente = true;
			// 				} else {
			// 					/******* SE BUSCA SI LAS ACTIVIDADES SIMULTANEAS SIGUIENTES QUE NO ESTEN GESTIONADAS *******/
			// 					$_flag_material = "";
			// 					if ($resul_01["rowsData"][0]["id_material"]) {
			// 						$_flag_material = ' AND cia.id_material = ' . $resul_01["rowsData"][0]["id_material"] . ' ';
			// 					}

			// 					$sql = '
			// 							SELECT
			// 								COUNT(cia.id) CUANTOS
			// 							FROM 
			// 								cmx_importacion_proyecto cip
			// 								INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
			// 							WHERE
			// 								cip.id = ' . $resul_01["rowsData"][0]["id_importacion"] . '
			// 								AND cia.grupo = ' . $resul_01["rowsData"][0]["grupo"] . '
			// 								' . $_flag_material . '
			// 								AND cia.simultaneo = "' . $resul_01["rowsData"][0]["simultaneo"] . '"
			// 								AND cia.orden > ' . $resul_01["rowsData"][0]["orden"] . '
			// 								AND cia.estado != 1;
			// 						';
			// 					$resul_04 = $Data->getConsulta($sql);
			// 					// print_r($sql . "\n");
			// 					// print_r($resul_02);

			// 					print_r("Hay " . $resul_04["rowsData"][0]["CUANTOS"] . " actividades simultaneas gestionadas después de la actual 2.\n");

			// 					if ($resul_04["rowsData"][0]["CUANTOS"] == 0 and $resul_02["rowsData"][0]["CUANTOS"] == 0) {
			// 						$_falg_gestiona_actividad_siguiente = true;
			// 					}
			// 				}
			// 			}
			// 		}
			// 	}
			// } else {
			// 	$_falg_gestiona_actividad_siguiente = true;
			// }

			// if ($resul_01 && isset($resul_01["bloque"]) && $resul_01["bloque"] > 0) {
			// 	$_flag_material = "";
			// 	if (!empty($resul_01["rowsData"][0]["id_material"])) {
			// 		$_flag_material = ' AND cia.id_material = :id_material ';
			// 	}

			// 	$sql = "
			// 			SELECT COUNT(cia.id) AS CUANTOS
			// 			FROM cmx_importacion_proyecto cip
			// 			INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
			// 			WHERE cip.id = :id_importacion
			// 			AND cia.grupo = :grupo
			// 			AND cia.simultaneo = :simultaneo
			// 			$_flag_material
			// 			AND cia.orden < :orden
			// 			AND cia.estado != 1;
			// 	";

			// 	$stmt = $pdo->prepare($sql);
			// 	$stmt->bindParam(':id_importacion', $resul_01["rowsData"][0]["id_importacion"], PDO::PARAM_INT);
			// 	$stmt->bindParam(':grupo', $resul_01["rowsData"][0]["grupo"], PDO::PARAM_INT);
			// 	$stmt->bindParam(':simultaneo', $resul_01["rowsData"][0]["simultaneo"], PDO::PARAM_STR);
			// 	$stmt->bindParam(':orden', $resul_01["rowsData"][0]["orden"], PDO::PARAM_INT);
			// 	if (!empty($resul_01["rowsData"][0]["id_material"])) {
			// 		$stmt->bindParam(':id_material', $resul_01["rowsData"][0]["id_material"], PDO::PARAM_INT);
			// 	}
			// 	$stmt->execute();
			// 	$resul_02 = $stmt->fetch(PDO::FETCH_ASSOC);

			// 	echo "Hay " . $resul_02["CUANTOS"] . " actividades simultaneas gestionadas antes de la actual.\n";

			// 	if ($resul_02["CUANTOS"] == 0) {
			// 		$_falg_gestiona_actividad_siguiente = true;
			// 	} else {
			// 		$_flag_material = "";
			// 		if (!empty($resul_01["rowsData"][0]["id_material"])) {
			// 			$_flag_material = ' AND cia.id_material = :id_material ';
			// 		}

			// 		$sql = "
			// 					SELECT cia.*
			// 					FROM cmx_importacion_proyecto cip
			// 					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
			// 					WHERE cip.id = :id_importacion
			// 					AND cia.grupo = :grupo
			// 					$_flag_material
			// 					AND cia.orden = :orden;
			// 			";

			// 		$stmt = $pdo->prepare($sql);
			// 		$stmt->bindParam(':id_importacion', $resul_01["rowsData"][0]["id_importacion"], PDO::PARAM_INT);
			// 		$stmt->bindParam(':grupo', $resul_01["rowsData"][0]["grupo"], PDO::PARAM_INT);
			// 		$stmt->bindParam(':orden', $orden_siguiente, PDO::PARAM_INT);
			// 		if (!empty($resul_01["rowsData"][0]["id_material"])) {
			// 			$stmt->bindParam(':id_material', $resul_01["rowsData"][0]["id_material"], PDO::PARAM_INT);
			// 		}
			// 		$stmt->execute();
			// 		$resul_03 = $stmt->fetch(PDO::FETCH_ASSOC);

			// 		if ($resul_01["rowsData"][0]["bloque"] < $resul_03["bloque"]) {
			// 			$_falg_gestiona_actividad_siguiente = true;
			// 		}
			// 	}
			// } else {
			// 	$_falg_gestiona_actividad_siguiente = true;
			// }

			if ($resul_01 && isset($resul_01["bloque"]) && $resul_01["bloque"] > 0) {
				$_flag_material = !empty($resul_01["rowsData"][0]["id_material"]) ? ' AND cia.id_material = :id_material ' : '';

				$sql = "
						SELECT COUNT(cia.id) AS CUANTOS
						FROM cmx_importacion_proyecto cip
						INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
						WHERE cip.id = :id_importacion
						AND cia.grupo = :grupo
						AND cia.simultaneo = :simultaneo
						$_flag_material
						AND cia.orden < :orden
						AND cia.estado != 1;
				";

				$stmt = $PDO->prepare($sql);
				$stmt->bindParam(':id_importacion', $resul_01["rowsData"][0]["id_importacion"], PDO::PARAM_INT);
				$stmt->bindParam(':grupo', $resul_01["rowsData"][0]["grupo"], PDO::PARAM_INT);
				$stmt->bindParam(':simultaneo', $resul_01["rowsData"][0]["simultaneo"], PDO::PARAM_STR);
				$stmt->bindParam(':orden', $resul_01["rowsData"][0]["orden"], PDO::PARAM_INT);

				if (!empty($resul_01["rowsData"][0]["id_material"])) {
					$stmt->bindParam(':id_material', $resul_01["rowsData"][0]["id_material"], PDO::PARAM_INT);
				}

				$stmt->execute();
				$resul_02 = $stmt->fetch(PDO::FETCH_ASSOC);

				echo "Hay " . $resul_02["CUANTOS"] . " actividades simultaneas gestionadas antes de la actual.\n";

				if ($resul_02["CUANTOS"] == 0) {
					$_falg_gestiona_actividad_siguiente = true;
				} else {
					$_flag_material = !empty($resul_01["rowsData"][0]["id_material"]) ? ' AND cia.id_material = :id_material ' : '';

					$sql = "
								SELECT cia.*
								FROM cmx_importacion_proyecto cip
								INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
								WHERE cip.id = :id_importacion
								AND cia.grupo = :grupo
								$_flag_material
								AND cia.orden = :orden;
						";

					$stmt = $PDO->prepare($sql);
					$stmt->bindParam(':id_importacion', $resul_01["rowsData"][0]["id_importacion"], PDO::PARAM_INT);
					$stmt->bindParam(':grupo', $resul_01["rowsData"][0]["grupo"], PDO::PARAM_INT);
					$stmt->bindParam(':orden', $orden_siguiente, PDO::PARAM_INT);

					if (!empty($resul_01["rowsData"][0]["id_material"])) {
						$stmt->bindParam(':id_material', $resul_01["rowsData"][0]["id_material"], PDO::PARAM_INT);
					}

					$stmt->execute();
					$resul_03 = $stmt->fetch(PDO::FETCH_ASSOC);

					if ($resul_01["rowsData"][0]["bloque"] < $resul_03["bloque"]) {
						$_falg_gestiona_actividad_siguiente = true;
					}
				}
			} else {
				$_falg_gestiona_actividad_siguiente = true;
			}
		}
		/**************** FIN SE GESTIONA LA ACTIVIDAD ACTUAL ***********/

		/**************** SE ACTUALIZA LA ACTIVIDAD SIGUIENTE ***********/
		if ($_falg_gestiona_actividad_siguiente) {
			print_r("Se gestiona actividad siguiente\n");
			if (isset($_POST[$_id_material_carga])) {
				// print_r("La actividad tiene materiales registrados\n");
				// // se verifica si la actividad no es de soluciones, debe actualizar la siguiente actividad 
				// $arrayId_carga = explode(",", $_POST[$_id_material_carga]);
				// // Se actualiza las actividades realcionadas al material 
				// for ($i = 0; $i < (count($arrayId_carga) - 1); $i++) {
				// 	// print_r($arrayId_carga[$i] . "\n");

				// 	$_siguiente = 0;
				// 	$_flag_gestionado = false;
				// 	do {
				// 		// print_r("Entro en do while \n");
				// 		$_siguiente++;

				// 		// Se busca la informacion de la actividad siguiente 
				// 		$sql = '
				// 				SELECT
				// 					cia.*
				// 				FROM 
				// 					cmx_importacion_proyecto cip
				// 					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				// 				WHERE
				// 					cia.id_material = ' . $arrayId_carga[$i] . '
				// 					AND cia.orden = "' . ($_POST["orden"] + $_siguiente) . '"
				// 			';
				// 		$resul_01 = $Data->getConsulta($sql);
				// 		// print_r($sql . "\n");
				// 		// print_r($resul_01);

				// 		// Si hay actividades siguientes se busca gestionarla
				// 		if ($resul_01) {
				// 			// Se pregunta si la actividad no esta gestionada
				// 			if ($resul_01["rowsData"][0]["estado"] == 3) {
				// 				print_r("Se gestiona la actividad siguiente \n");
				// 				// Se actualiza la actividad siguiente a la gestionada 
				// 				$sql = '
				// 						UPDATE
				// 							' . $table . ' 
				// 						SET 
				// 							estado = 2,
				// 							fecha_hora_inicio = "' . $fecha_final_actividad . '"
				// 						WHERE 
				// 							' . $_id_material_carga . ' = "' . $arrayId_carga[$i] . '"
				// 							AND orden = "' . ($_POST["orden"] + $_siguiente) . '";
				// 					';
				// 				$resul_02 = $Data->ejecuteRegistro($sql);
				// 				// print_r($sql);
				// 				// print_r($resul_02);

				// 				$_flag_gestionado = true;

				// 				// Se busca si la actividad esta en simultaneo con otra actividad posterior
				// 				foreach ($resul_01["rowsData"] as $keyResult => $valueResult) {
				// 					// Se verifica si la actividad siguiente es simultanea con otra y se activa 
				// 					if ($valueResult["simultaneo"] != 0 and $valueResult["bloque"] == 1) {
				// 						$arraySimultaneo["id"] = $valueResult["id"];
				// 						$arraySimultaneo["id_importacion"] = $valueResult["id_importacion"];
				// 						$arraySimultaneo["grupo"] = $valueResult["grupo"];
				// 						$arraySimultaneo["orden"] = $valueResult["orden"];
				// 						$arraySimultaneo["simultaneo"] = $valueResult["simultaneo"];
				// 						$arraySimultaneo["estado"] = 2;
				// 						$arraySimultaneo["fecha_hora_inicio"] = $fecha_final_actividad;

				// 						activaActividadSimultanea($Data, $arraySimultaneo);
				// 					} else {
				// 						print_r("La actividad no es simultanea con otras\n");
				// 					}
				// 				}
				// 			} else {
				// 				print_r("Actividad ya gestionada - " . $resul_01["rowsData"][0]["nombre"] . "\n");
				// 			}
				// 		} else {
				// 			print_r("Es la última actividad del proyecto \n");
				// 			$_flag_gestionado = true;
				// 		}
				// 	} while (!$_flag_gestionado);
				// }

				print_r("La actividad tiene materiales registrados\n");

				$arrayId_carga = explode(",", $_POST[$_id_material_carga]);

				for ($i = 0; $i < (count($arrayId_carga) - 1); $i++) {
					$_siguiente = 0;
					$_flag_gestionado = false;

					do {
						$_siguiente++;

						$sql = "
            SELECT cia.*
            FROM cmx_importacion_proyecto cip
            INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
            WHERE cia.id_material = :id_material
            AND cia.orden = :orden
        ";

						$stmt = $PDO->prepare($sql);
						$stmt->bindParam(':id_material', $arrayId_carga[$i], PDO::PARAM_INT);
						$orden = $_POST["orden"] + $_siguiente;
						$stmt->bindParam(':orden', $orden, PDO::PARAM_INT);
						$stmt->execute();
						$resul_01 = $stmt->fetchAll(PDO::FETCH_ASSOC);

						if ($resul_01) {
							if ($resul_01[0]["estado"] == 3) {
								print_r("Se gestiona la actividad siguiente \n");

								$sql_update = "
                    UPDATE $table 
                    SET estado = 2, fecha_hora_inicio = :fecha_hora_inicio 
                    WHERE $_id_material_carga = :id_material
                    AND orden = :orden
                ";

								$stmt_update = $PDO->prepare($sql_update);
								$stmt_update->bindParam(':fecha_hora_inicio', $fecha_final_actividad, PDO::PARAM_STR);
								$stmt_update->bindParam(':id_material', $arrayId_carga[$i], PDO::PARAM_INT);
								$stmt_update->bindParam(':orden', $orden, PDO::PARAM_INT);
								$stmt_update->execute();

								$_flag_gestionado = true;

								foreach ($resul_01 as $valueResult) {
									if ($valueResult["simultaneo"] != 0 && $valueResult["bloque"] == 1) {
										$arraySimultaneo = [
											"id" => $valueResult["id"],
											"id_importacion" => $valueResult["id_importacion"],
											"grupo" => $valueResult["grupo"],
											"orden" => $valueResult["orden"],
											"simultaneo" => $valueResult["simultaneo"],
											"estado" => 2,
											"fecha_hora_inicio" => $fecha_final_actividad
										];

										activaActividadSimultanea($pdo, $arraySimultaneo);
									} else {
										print_r("La actividad no es simultanea con otras\n");
									}
								}
							} else {
								print_r("Actividad ya gestionada - " . $resul_01[0]["nombre"] . "\n");
							}
						} else {
							print_r("Es la última actividad del proyecto \n");
							$_flag_gestionado = true;
						}
					} while (!$_flag_gestionado);
				}
			} else {
				// print_r("La actividad no tiene materiales registrados\n");
				// /**** SE ACTUALIZA LA ACTIVIDAD ACTUAL ****/
				// // Se actualiza las actividades realcionadas al proyecto por que no hay material asignado en el proyecto 
				// $sql = '
				// 		SELECT
				// 			cia.id, cia.id_material,
				// 			IF (cia.id_material,
				// 				(	SELECT COUNT(cia1.id)
				// 					FROM cmx_importacion_actividades cia1 
				// 					WHERE cia1.id_importacion = cia.id_importacion
				// 						AND cia1.orden = (cia.orden + 1)
				// 						AND cia1.id_material = cia.id_material
				// 						AND cia1.estado = 3
				// 				)
				// 				,(	SELECT COUNT(cia1.id)
				// 					FROM cmx_importacion_actividades cia1 
				// 					WHERE cia1.id_importacion = cia.id_importacion
				// 						AND cia1.orden = (cia.orden + 1)
				// 						AND cia1.id_material IS NULL
				// 						AND cia.id_material IS NULL
				// 						AND cia1.estado = 3
				// 				)
				// 			) FLAG_SIGUENTE
				// 		FROM 
				// 			cmx_importacion_proyecto cip
				// 			INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				// 		WHERE
				// 			cip.id = ' . $_POST["id_importacion"] . '
				// 			AND cia.orden = "' . $_POST["orden"] . '"
				// 	';
				// $resul = $Data->getConsulta($sql);
				// // print_r($sql . "\n");
				// // print_r($resul);

				// $arrayActividad = array();
				// $arrayActividad["estado"] = 1;
				// $arrayActividad["fecha_hora_finalizacion"] = $fecha_final_actividad;
				// // print_r($arrayActividad);
				// // print_r("\n");

				// foreach ($resul["rowsData"] as $keyResult => $valueResult) {
				// 	$Data->updateRegistro($table, $arrayActividad, $valueResult["id"]);
				// }

				// /**** SE ACTUALIZA LA SIGUINETE ACTIVIDAD ****/
				// foreach ($resul["rowsData"] as $keyResult => $valueResult) {
				// 	$_cant_actividad_siguiente = $valueResult["FLAG_SIGUENTE"];
				// 	if ($_cant_actividad_siguiente > 0) {
				// 		// Se actualiza las actividades realcionadas al proyecto por que no hay material asignado en el proyecto 
				// 		$sql = '
				// 				SELECT
				// 					cia.*
				// 				FROM 
				// 					cmx_importacion_proyecto cip
				// 					INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				// 				WHERE
				// 					cip.id = ' . $_POST["id_importacion"] . '
				// 					AND cia.orden = "' . ($_POST["orden"] + $i) . '"
				// 					AND cia.id_material IS NULL
				// 			';
				// 		if ($valueResult["id_material"]) {
				// 			$sql = '
				// 					SELECT
				// 						cia.*
				// 					FROM 
				// 						cmx_importacion_proyecto cip
				// 						INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				// 					WHERE
				// 						cip.id = ' . $_POST["id_importacion"] . '
				// 						AND cia.orden = "' . ($_POST["orden"] + $i) . '"
				// 						AND cia.id_material = "' . $valueResult["id_material"] . '"
				// 				';
				// 		}
				// 		$resul_01 = $Data->getConsulta($sql);
				// 		// print_r($sql . "\n");
				// 		// print_r($resul);

				// 		$_flag_gestionado = false;
				// 		$j = 1;
				// 		do {
				// 			if ($resul_01) {
				// 				if ($resul_01["rowsData"][0]["estado"] == 3) {
				// 					$arrayActividad = array();
				// 					$arrayActividad["estado"] = 2;
				// 					$arrayActividad["fecha_hora_inicio"] = $fecha_final_actividad;
				// 					// print_r($arrayActividad);
				// 					// print_r("\n");

				// 					foreach ($resul_01["rowsData"] as $keyResult_01 => $valueResult_01) {
				// 						$resul = $Data->updateRegistro($table, $arrayActividad, $valueResult_01["id"]);
				// 						// print_r($resul);

				// 						// Se verifica si la actividad siguiente es simultanea con otra y se activa 
				// 						if (($valueResult_01["simultaneo"] != 0 and $valueResult_01["bloque"] == 1) or ($valueResult_01["simultaneo"] == "0" and $valueResult_01["bloque"] == 1)) {
				// 							$arraySimultaneo["id"] = $valueResult_01["id"];
				// 							$arraySimultaneo["id_importacion"] = $valueResult_01["id_importacion"];
				// 							$arraySimultaneo["grupo"] = $valueResult_01["grupo"];
				// 							$arraySimultaneo["orden"] = $valueResult_01["orden"];
				// 							$arraySimultaneo["simultaneo"] = $valueResult_01["simultaneo"];
				// 							$arraySimultaneo["estado"] = 2;
				// 							$arraySimultaneo["fecha_hora_inicio"] = $fecha_final_actividad;

				// 							activaActividadSimultanea($Data, $arraySimultaneo);
				// 						} else {
				// 							print_r("La actividad no es simultanea con otras\n");
				// 						}
				// 					}
				// 					$_flag_gestionado = true;
				// 				}
				// 			} else {
				// 				$_flag_gestionado = true;
				// 			}
				// 			$j++;
				// 		} while (!$_flag_gestionado);
				// 	}
				// }

				print_r("La actividad no tiene materiales registrados\n");

				// SE ACTUALIZA LA ACTIVIDAD ACTUAL
				$sql = "
    SELECT
        cia.id, cia.id_material,
        IF (cia.id_material,
            (SELECT COUNT(cia1.id)
             FROM cmx_importacion_actividades cia1 
             WHERE cia1.id_importacion = cia.id_importacion
               AND cia1.orden = (cia.orden + 1)
               AND cia1.id_material = cia.id_material
               AND cia1.estado = 3),
            (SELECT COUNT(cia1.id)
             FROM cmx_importacion_actividades cia1 
             WHERE cia1.id_importacion = cia.id_importacion
               AND cia1.orden = (cia.orden + 1)
               AND cia1.id_material IS NULL
               AND cia.id_material IS NULL
               AND cia1.estado = 3)
        ) AS FLAG_SIGUENTE
    FROM cmx_importacion_proyecto cip
    INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
    WHERE cip.id = :id_importacion AND cia.orden = :orden";

				$stmt = $PDO->prepare($sql);
				$stmt->bindParam(':id_importacion', $_POST["id_importacion"], PDO::PARAM_INT);
				$stmt->bindParam(':orden', $_POST["orden"], PDO::PARAM_INT);
				$stmt->execute();
				$resul = $stmt->fetchAll(PDO::FETCH_ASSOC);

				$arrayActividad = [
					"estado" => 1,
					"fecha_hora_finalizacion" => $fecha_final_actividad
				];

				foreach ($resul as $valueResult) {
					$sqlUpdate = "UPDATE $table SET estado = :estado, fecha_hora_finalizacion = :fecha_hora_finalizacion WHERE id = :id";
					$stmtUpdate = $pdo->prepare($sqlUpdate);
					$stmtUpdate->bindParam(':estado', $arrayActividad['estado'], PDO::PARAM_INT);
					$stmtUpdate->bindParam(':fecha_hora_finalizacion', $arrayActividad['fecha_hora_finalizacion']);
					$stmtUpdate->bindParam(':id', $valueResult["id"], PDO::PARAM_INT);
					$stmtUpdate->execute();
				}

				// SE ACTUALIZA LA SIGUIENTE ACTIVIDAD
				foreach ($resul as $valueResult) {
					if ($valueResult["FLAG_SIGUENTE"] > 0) {
						$sql = "
            SELECT cia.*
            FROM cmx_importacion_proyecto cip
            INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
            WHERE cip.id = :id_importacion
              AND cia.orden = :orden";

						if ($valueResult["id_material"]) {
							$sql .= " AND cia.id_material = :id_material";
						} else {
							$sql .= " AND cia.id_material IS NULL";
						}

						$stmt = $PDO->prepare($sql);
						$stmt->bindParam(':id_importacion', $_POST["id_importacion"], PDO::PARAM_INT);
						$stmt->bindParam(':orden', $_POST["orden"], PDO::PARAM_INT);
						if ($valueResult["id_material"]) {
							$stmt->bindParam(':id_material', $valueResult["id_material"], PDO::PARAM_INT);
						}
						$stmt->execute();
						$resul_01 = $stmt->fetchAll(PDO::FETCH_ASSOC);

						$_flag_gestionado = false;
						$j = 1;
						do {
							if ($resul_01) {
								if ($resul_01[0]["estado"] == 3) {
									$arrayActividad = [
										"estado" => 2,
										"fecha_hora_inicio" => $fecha_final_actividad
									];

									foreach ($resul_01 as $valueResult_01) {
										$sqlUpdate = "UPDATE $table SET estado = :estado, fecha_hora_inicio = :fecha_hora_inicio WHERE id = :id";
										$stmtUpdate = $pdo->prepare($sqlUpdate);
										$stmtUpdate->bindParam(':estado', $arrayActividad['estado'], PDO::PARAM_INT);
										$stmtUpdate->bindParam(':fecha_hora_inicio', $arrayActividad['fecha_hora_inicio']);
										$stmtUpdate->bindParam(':id', $valueResult_01["id"], PDO::PARAM_INT);
										$stmtUpdate->execute();

										if (($valueResult_01["simultaneo"] != 0 && $valueResult_01["bloque"] == 1) || ($valueResult_01["simultaneo"] == 0 && $valueResult_01["bloque"] == 1)) {
											$arraySimultaneo = [
												"id" => $valueResult_01["id"],
												"id_importacion" => $valueResult_01["id_importacion"],
												"grupo" => $valueResult_01["grupo"],
												"orden" => $valueResult_01["orden"],
												"simultaneo" => $valueResult_01["simultaneo"],
												"estado" => 2,
												"fecha_hora_inicio" => $fecha_final_actividad
											];
											activaActividadSimultanea($pdo, $arraySimultaneo);
										} else {
											print_r("La actividad no es simultanea con otras\n");
										}
									}
									$_flag_gestionado = true;
								}
							} else {
								$_flag_gestionado = true;
							}
							$j++;
						} while (!$_flag_gestionado);
					}
				}
			}
		} else {
			print_r("No se debe gestionar actividad siguiente\n");
		}
		/**************** FIN DE SE ACTUALIZA LA ACTIVIDAD SIGUIENTE ***********/
	}
}


// switch (isset($_POST["integracion"])) {
// 	case 'soluciones':
// 		if ($_POST["bloque"] == 1) {
// 			print_r("La actividad está integrada al módulo de soluciones\n");
// 			$numero_solicitud = "SLC-" . time();

// 			// se busca la información de la importación para ser exportada a la solicitud de soluciones
// 			$sql = '
// 					SELECT 
// 						cip.id_cliente, 
// 						cia.id ID_ACTIVIDAD, cia.urbaneo,
// 						cip.id ID_IMPORTACION, cip.importacion, cip.tipo_operacion,
// 						IF(cip.tipo_contenedor IS NULL, 0 , 
// 							(SELECT 
// 								ctc.tara
// 							FROM 
// 								cmx_importacion_proyecto cip1
// 								INNER JOIN cmx_tipo_contenedor ctc ON ctc.id = cip1.tipo_contenedor
// 							WHERE 
// 								cip1.id = cip.id
// 							)
// 						) TARA,
// 						SUM(cim.peso_bruto) PESO_BRUTO,
// 						SUM(cim.cantidad) UNIDADES
// 					FROM 
// 						cmx_importacion_proyecto cip
// 						INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
// 						INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
// 					WHERE 
// 						cip.id = ' . $_POST["id_importacion"] . '
// 						AND cia.grupo = ' . $_POST["grupo"] . '
// 						AND cia.orden = ' . $_POST["orden"] . ';
// 				';
// 			$resul = $Data->getConsulta($sql);
// 			// print_r($sql);
// 			// print_r($resul);

// 			// Se filtra el tipo de proyecto de la solicitud del vehículo
// 			// Si la actividad tiene un urbaneo en 1 o 2 se vuelve una solicitud de URBANO
// 			// Si es 1 es un urbano en origen
// 			// Si es 2 es un urbano en destino 
// 			$tipo_operacion = $resul["rowsData"][0]["tipo_operacion"];
// 			if ($resul["rowsData"][0]["urbaneo"] == 1 or $resul["rowsData"][0]["urbaneo"] == 2) {
// 				$tipo_operacion = "URBANO";
// 			}

// 			// // Se filtra el tipo de proyecto de la solicitud del vehículo
// 			// // Si es 2 el origen de la solicitud es el destino urbano de cuando se editó la solicitud nacional 
// 			// $id_origen = $resul["rowsData"][0]["ID_ORIGEN"];
// 			// $origen = $resul["rowsData"][0]["nombre"];
// 			// if ( $resul["rowsData"][0]["urbaneo"] == 2 ) {
// 			// 	// se busca el orgen del tramo urbano en destino 
// 			// 	$sql = '
// 			// 		SELECT 
// 			// 			crd.id ID_ORIGEN, crd.nombre
// 			// 		FROM 
// 			// 			cmx_tramo_urbano ctu
// 			// 			INNER JOIN cmx_remitente_destinatario crd ON crd.id = ctu.id_remitente_destinatario
// 			// 		WHERE 
// 			// 			ctu.id_actividad = ' . $resul["rowsData"][0]["ID_ACTIVIDAD"] . '
// 			// 	';
// 			// 	$resul_01 = $Data->getConsulta($sql);
// 			// 	// print_r($sql);
// 			// 	// print_r($resul_01);

// 			// 	$id_origen = $resul_01["rowsData"][0]["ID_ORIGEN"];
// 			// 	$origen = $resul_01["rowsData"][0]["nombre"];
// 			// }

// 			// Se guarda la información de la importacion en la solicitud de soluciones 
// 			$arraySolicitud = array();
// 			$arraySolicitud["numero_solicitud"] = $numero_solicitud;
// 			$arraySolicitud["id_cliente"] = $resul["rowsData"][0]["id_cliente"];
// 			// $arraySolicitud["origen"] = $origen;
// 			$arraySolicitud["tipo_operacion"] = $tipo_operacion;
// 			$arraySolicitud["estado"] = "Activa";
// 			$arraySolicitud["destino"] = "";
// 			$arraySolicitud["numero_orden"] = $resul["rowsData"][0]["importacion"];
// 			$arraySolicitud["numero_bl"] = "";
// 			$arraySolicitud["tara_contenedor"] = $resul["rowsData"][0]["TARA"];
// 			$arraySolicitud["peso_total"] = $resul["rowsData"][0]["PESO_BRUTO"];
// 			$arraySolicitud["peso_pendiente"] = $resul["rowsData"][0]["PESO_BRUTO"];
// 			$resul_1 = $Data->setRegistro("cmx_solicitudes", $arraySolicitud);
// 			// print_r($arraySolicitud);
// 			// print_r("\n");
// 			// print_r($resul_1);

// 			// Se inserta la información en la tabla usuario solicitud
// 			$arrayUsuario = array();
// 			$arrayUsuario["id_solicitud"] = $resul_1;
// 			$arrayUsuario["id_usuario"] = $_POST["ssn_usuario"];
// 			$arrayUsuario["operacion"] = "Crear";
// 			$arrayUsuario["fecha_hora_operacion"] = $fecha_final_actividad;
// 			$resul_3 = $Data->setRegistro("cmx_usuario_solicitud", $arrayUsuario);
// 			// print_r($arrayUsuario);
// 			// print_r("\n");
// 			// print_r($resul_3);

// 			// Se integra la solicitud a las actividades del proyecto 
// 			foreach ($arrayId_actividad as $valueId_actividad) {
// 				if ($valueId_actividad) {
// 					// Se consulta el bloque de la actividad a integrar
// 					$sql = '
// 							SELECT 
// 								cia.bloque, cia.id_material, cia.orden
// 							FROM 
// 								cmx_importacion_actividades cia 
// 							WHERE
// 								id = ' . $valueId_actividad . ';
// 						';
// 					$resul_31 = $Data->getConsulta($sql);
// 					// print_r($sql);
// 					// print_r($resul_31);

// 					// Se inserta la información en la integracion entre importaciones y soluciones
// 					$arrayIntegracion = array();
// 					$arrayIntegracion["id_solucion"] = $resul_1;
// 					$arrayIntegracion["id_importacion_actividad"] = $valueId_actividad;
// 					$arrayIntegracion["bloque"] = $resul_31["rowsData"][0]["bloque"];
// 					$resul_4 = $Data->setRegistro("cmx_integracion_soluc_import", $arrayIntegracion);
// 					// print_r($arrayIntegracion);
// 					// print_r("\n");
// 					// print_r($resul_4);
// 					// print_r("\n");

// 					// Se integran las actividades de la solucion 
// 					$flag_orden = $resul_31["rowsData"][0]["orden"];
// 					$flag_bloque = true;
// 					$bloque_anterior = 0;
// 					do {
// 						$sql = '
// 								SELECT 
// 									id, bloque
// 								FROM 
// 									' . $table . ' 
// 								WHERE 
// 									' . $_id_material_carga . ' = "' . $resul_31["rowsData"][0]["id_material"] . '"
// 									AND orden = "' . ($flag_orden + 1) . '";
// 							';
// 						$resulBloques = $Data->getConsulta($sql);
// 						// print_r($sql . "\n");
// 						// print_r($resulBloques);
// 						// print_r("\n");

// 						if ($resulBloques["rowsData"][0]["bloque"] > $bloque_anterior) {
// 							$bloque_anterior = $resulBloques["rowsData"][0]["bloque"];
// 							$arrayIntegracionActividades = array();
// 							$arrayIntegracionActividades["id_solucion"] = $resul_1;
// 							$arrayIntegracionActividades["id_importacion_actividad"] = $resulBloques["rowsData"][0]["id"];
// 							$arrayIntegracionActividades["bloque"] = $resulBloques["rowsData"][0]["bloque"];
// 							$Data->setRegistro("cmx_integracion_soluc_import", $arrayIntegracionActividades);
// 							// print_r($arrayIntegracionActividades);
// 							// print_r("\n");
// 							$flag_orden++;
// 						} else {
// 							if ($resulBloques["rowsData"][0]["bloque"] > 1) {
// 								$bloque_anterior = $resulBloques["rowsData"][0]["bloque"];
// 								$arrayIntegracionActividades = array();
// 								$arrayIntegracionActividades["id_solucion"] = $resul_1;
// 								$arrayIntegracionActividades["id_importacion_actividad"] = $resulBloques["rowsData"][0]["id"];
// 								$arrayIntegracionActividades["bloque"] = $resulBloques["rowsData"][0]["bloque"];
// 								$Data->setRegistro("cmx_integracion_soluc_import", $arrayIntegracionActividades);
// 								// print_r($arrayIntegracionActividades);
// 								// print_r("\n");
// 								$flag_orden++;
// 							} else {
// 								$flag_bloque = false;
// 							}
// 						}
// 					} while ($flag_bloque);
// 				}
// 			}

// 			// Se busca los materiales de la importación para ser guardada en la solicitud de soluciones
// 			for ($i = 0; $i < (count($arrayId_carga) - 1); $i++) {
// 				// Se busca la información del material para pasar la información a la tabla cmx_mercancia_solicitud 
// 				$sql = '
// 						SELECT 
// 							*
// 						FROM 
// 							cmx_importacion_material cim 
// 						WHERE 
// 							cim.id = ' . $arrayId_carga[$i] . '
// 					';
// 				$resul_5 = $Data->getConsulta($sql);
// 				// print_r($sql);
// 				// print_r($resul_5);

// 				// Se guarda la información del material de la importación en el material de la solucion
// 				$arrayMaterial = array();
// 				$arrayMaterial["id_solicitud"] = $resul_1;
// 				$arrayMaterial["id_material_proyecto"] = $resul_5["rowsData"][0]["id"];
// 				$arrayMaterial["tipo_mercancia"] = utf8_encode($resul_5["rowsData"][0]["nombre"]);
// 				$arrayMaterial["unidades"] = $resul_5["rowsData"][0]["cantidad"];
// 				$arrayMaterial["peso_total"] = $resul_5["rowsData"][0]["peso_bruto"];
// 				$arrayMaterial["peso_pendiente"] = $resul_5["rowsData"][0]["peso_bruto"];
// 				$arrayMaterial["valor_declarado"] = $resul_5["rowsData"][0]["valor_declarado"];
// 				$arrayMaterial["tipo_movilizacion"] = "";
// 				$arrayMaterial["codigo_UN"] = $resul_5["rowsData"][0]["codigoUN"];
// 				$resul_6 = $Data->setRegistro("cmx_mercancia_solicitud", $arrayMaterial);
// 				// print_r($resul_6);
// 			}

// 			// // Se genera el primer tramo de la solicitud 
// 			// $arrayTramo = array();
// 			// $arrayTramo["id_solicitud"] = $resul_1;
// 			// $arrayTramo["id_remitente_destinatario"] = $id_origen;
// 			// $arrayTramo["tipo_operacion"] = "Cargue";
// 			// $arrayTramo["peso"] = $resul["rowsData"][0]["TARA"] + $resul["rowsData"][0]["PESO_BRUTO"];
// 			// $arrayTramo["unidades"] = $resul["rowsData"][0]["UNIDADES"];
// 			// $arrayTramo["valor_venta"] = 0;
// 			// $arrayTramo["valor_compra"] = 0;
// 			// $arrayTramo["personal"] = 0;
// 			// $arrayTramo["suma_flete"] = 0;
// 			// $resul_4 = $Data->setRegistro("cmx_tramo_solicitud", $arrayTramo);
// 			// // print_r($arrayTramo);
// 			// // print_r("\n");
// 		}
// 		break;

// 	default:
// 		print_r("La actividad no esta integrada a otro módulo");
// 		break;
// }

switch (isset($_POST["integracion"])) {
	case 'soluciones':
		if ($_POST["bloque"] == 1) {
			print_r("La actividad está integrada al módulo de soluciones\n");
			$numero_solicitud = "SLC-" . time();

			// // Conexión PDO (asumiendo que ya existe)
			// $pdo = new PDO('mysql:host=host;dbname=db;charset=utf8', 'user', 'pass');
			// $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

			try {
				// Consulta principal
				$sql = '
									SELECT 
											cip.id_cliente, 
											cia.id ID_ACTIVIDAD, cia.urbaneo,
											cip.id ID_IMPORTACION, cip.importacion, cip.tipo_operacion,
											IF(cip.tipo_contenedor IS NULL, 0 , 
													(SELECT 
															ctc.tara
													FROM 
															cmx_importacion_proyecto cip1
															INNER JOIN cmx_tipo_contenedor ctc ON ctc.id = cip1.tipo_contenedor
													WHERE 
															cip1.id = cip.id
													)
											) TARA,
											SUM(cim.peso_bruto) PESO_BRUTO,
											SUM(cim.cantidad) UNIDADES
									FROM 
											cmx_importacion_proyecto cip
											INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
											INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
									WHERE 
											cip.id = :id_importacion
											AND cia.grupo = :grupo
											AND cia.orden = :orden';

				$stmt = $PDO->prepare($sql);
				$stmt->execute([
					':id_importacion' => $_POST["id_importacion"],
					':grupo' => $_POST["grupo"],
					':orden' => $_POST["orden"]
				]);
				$resul = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$row = $resul[0] ?? [];

				// Determinar tipo de operación
				$tipo_operacion = $row['tipo_operacion'] ?? '';
				if (in_array($row['urbaneo'] ?? null, [1, 2])) {
					$tipo_operacion = "URBANO";
				}

				// Insertar solicitud
				$arraySolicitud = [
					"numero_solicitud" => $numero_solicitud,
					"id_cliente" => $row['id_cliente'],
					"tipo_operacion" => $tipo_operacion,
					"estado" => "Activa",
					"destino" => "",
					"numero_orden" => $row['importacion'],
					"numero_bl" => "",
					"tara_contenedor" => $row['TARA'],
					"peso_total" => $row['PESO_BRUTO'],
					"peso_pendiente" => $row['PESO_BRUTO']
				];

				$columns = implode(', ', array_keys($arraySolicitud));
				$values = ':' . implode(', :', array_keys($arraySolicitud));
				$sql = "INSERT INTO cmx_solicitudes ($columns) VALUES ($values)";
				$stmt = $pdo->prepare($sql);
				$stmt->execute($arraySolicitud);
				$resul_1 = $PDO->lastInsertId();

				// Insertar usuario solicitud
				$arrayUsuario = [
					"id_solicitud" => $resul_1,
					"id_usuario" => $_POST["ssn_usuario"],
					"operacion" => "Crear",
					"fecha_hora_operacion" => $fecha_final_actividad
				];

				$columns = implode(', ', array_keys($arrayUsuario));
				$values = ':' . implode(', :', array_keys($arrayUsuario));
				$sql = "INSERT INTO cmx_usuario_solicitud ($columns) VALUES ($values)";
				$stmt = $PDO->prepare($sql);
				$stmt->execute($arrayUsuario);

				// Procesar actividades
				foreach ($arrayId_actividad as $valueId_actividad) {
					if ($valueId_actividad) {
						$sql = 'SELECT bloque, id_material, orden FROM cmx_importacion_actividades WHERE id = :id';
						$stmt = $PDO->prepare($sql);
						$stmt->execute([':id' => $valueId_actividad]);
						$resul_31 = $stmt->fetch(PDO::FETCH_ASSOC);

						// Insertar integración
						$arrayIntegracion = [
							"id_solucion" => $resul_1,
							"id_importacion_actividad" => $valueId_actividad,
							"bloque" => $resul_31['bloque']
						];

						$columns = implode(', ', array_keys($arrayIntegracion));
						$values = ':' . implode(', :', array_keys($arrayIntegracion));
						$sql = "INSERT INTO cmx_integracion_soluc_import ($columns) VALUES ($values)";
						$stmt = $PDO->prepare($sql);
						$stmt->execute($arrayIntegracion);

						// Procesar bloques
						$flag_orden = $resul_31['orden'];
						$flag_bloque = true;
						$bloque_anterior = 0;

						do {
							$sql = "SELECT id, bloque FROM $table WHERE $_id_material_carga = :id_material AND orden = :orden";
							$stmt = $PDO->prepare($sql);
							$stmt->execute([
								':id_material' => $resul_31['id_material'],
								':orden' => ($flag_orden + 1)
							]);
							$resulBloques = $stmt->fetch(PDO::FETCH_ASSOC);

							if ($resulBloques && $resulBloques['bloque'] > $bloque_anterior) {
								// Insertar actividad
								$arrayIntegracionActividades = [
									"id_solucion" => $resul_1,
									"id_importacion_actividad" => $resulBloques['id'],
									"bloque" => $resulBloques['bloque']
								];

								$columns = implode(', ', array_keys($arrayIntegracionActividades));
								$values = ':' . implode(', :', array_keys($arrayIntegracionActividades));
								$sql = "INSERT INTO cmx_integracion_soluc_import ($columns) VALUES ($values)";
								$stmt = $PDO->prepare($sql);
								$stmt->execute($arrayIntegracionActividades);

								$flag_orden++;
								$bloque_anterior = $resulBloques['bloque'];
							} else {
								$flag_bloque = false;
							}
						} while ($flag_bloque);
					}
				}

				// Procesar materiales
				foreach ($arrayId_carga as $id_carga) {
					$sql = 'SELECT * FROM cmx_importacion_material WHERE id = :id';
					$stmt = $PDO->prepare($sql);
					$stmt->execute([':id' => $id_carga]);
					$resul_5 = $stmt->fetch(PDO::FETCH_ASSOC);

					if ($resul_5) {
						$arrayMaterial = [
							"id_solicitud" => $resul_1,
							"id_material_proyecto" => $resul_5['id'],
							"tipo_mercancia" => $resul_5['nombre'],
							"unidades" => $resul_5['cantidad'],
							"peso_total" => $resul_5['peso_bruto'],
							"peso_pendiente" => $resul_5['peso_bruto'],
							"valor_declarado" => $resul_5['valor_declarado'],
							"tipo_movilizacion" => "",
							"codigo_UN" => $resul_5['codigoUN']
						];

						$columns = implode(', ', array_keys($arrayMaterial));
						$values = ':' . implode(', :', array_keys($arrayMaterial));
						$sql = "INSERT INTO cmx_mercancia_solicitud ($columns) VALUES ($values)";
						$stmt = $PDO->prepare($sql);
						$stmt->execute($arrayMaterial);
					}
				}
			} catch (PDOException $e) {
				// Manejo de errores
				die("Error en la operación: " . $e->getMessage());
			}
		}
		break;

	default:
		print_r("La actividad no esta integrada a otro módulo");
		break;
}

// function activaActividadSimultanea($Data, $array)
// {
// 	print_r("La actividad es simultanea con otra\n");
// 	// print_r($array);
// 	// print_r("\n");

// 	$sql = '
// 			SELECT
// 				cia.*
// 			FROM 
// 				cmx_importacion_actividades cia 
// 			WHERE
// 				cia.id_importacion = ' . $array["id_importacion"] . '
// 				AND cia.simultaneo = "' . $array["simultaneo"] . '"
// 				AND cia.orden > ' . $array["orden"] . '
// 				AND cia.grupo = ' . $array["grupo"] . '
// 				AND cia.bloque = 1;
// 		';
// 	$resul = $Data->getConsulta($sql);
// 	// print_r($sql . "\n");
// 	// print_r($resul);

// 	foreach ($resul["rowsData"] as $key => $value) {
// 		$arrayActividades["estado"] = $array["estado"];
// 		$arrayActividades["fecha_hora_inicio"] = $array["fecha_hora_inicio"];
// 		$Data->updateRegistro("cmx_importacion_actividades", $arrayActividades, $value["id"]);
// 	}
// }

function activaActividadSimultanea($pdo, $array)
{
	print_r("La actividad es simultanea con otra\n");

	try {
		// Consulta SELECT con prepared statement
		$sql = '
					SELECT
							cia.*
					FROM 
							cmx_importacion_actividades cia 
					WHERE
							cia.id_importacion = :id_importacion
							AND cia.simultaneo = :simultaneo
							AND cia.orden > :orden
							AND cia.grupo = :grupo
							AND cia.bloque = 1;
			';

		$stmt = $pdo->prepare($sql);
		$stmt->execute([
			':id_importacion' => $array["id_importacion"],
			':simultaneo' => $array["simultaneo"],
			':orden' => $array["orden"],
			':grupo' => $array["grupo"]
		]);
		$actividades = $stmt->fetchAll(PDO::FETCH_ASSOC);

		// Actualización de registros
		foreach ($actividades as $actividad) {
			$updateSql = '
							UPDATE cmx_importacion_actividades 
							SET 
									estado = :estado,
									fecha_hora_inicio = :fecha_hora_inicio 
							WHERE 
									id = :id';

			$updateStmt = $pdo->prepare($updateSql);
			$updateStmt->execute([
				':estado' => $array["estado"],
				':fecha_hora_inicio' => $array["fecha_hora_inicio"],
				':id' => $actividad["id"]
			]);
		}
	} catch (PDOException $e) {
		// Manejo de errores
		die("Error en activaActividadSimultanea: " . $e->getMessage());
	}
}
