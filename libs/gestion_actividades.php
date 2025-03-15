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
		$array["costo_real"] = $_POST["costo_real"] === "" ? 0 : $_POST["costo_real"];
	}
	$array["tiempo_real"] = $tiempo_usado;
	$array["fecha_hora_finalizacion"] = $fecha_final_actividad;
	$array["respuesta"] = $_POST["respuesta"];
	$array["estado"] = 1;

	// Se actualiza la actividad actual
	$arrayId_actividad = explode(",", $_POST["id"]);

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
			$sql = 'SELECT cia.* FROM cmx_agrupacion_material cam
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

			foreach ($resul_02 as $key_1 => $value_1) {
				// Tomo la fecha/hora de inicio de la actividad
				$fecha_inicial = strtotime($value_1["fecha_hora_inicio"]);

				// Se saca la diferencia en minutos entre las fechas/horas
				if ($fecha_inicial < $fecha_actual[0]) {
					// print_r("Se resta el tiempo\n");
					$tiempo_usado = ($fecha_inicial - $fecha_actual[0]) / 60;
					$tiempo_usado = abs($tiempo_usado);
					$tiempo_usado = floor($tiempo_usado);
				} else {
					$tiempo_usado = 0;
				}

				// Se toma la fecha actual para poner la fecha inicial de la siguinete actividad
				$fecha_final_actividad = $fecha_actual["year"] . "-" . $fecha_actual["mon"] . "-" . $fecha_actual["mday"] . " " . $fecha_actual["hours"] . ":" . $fecha_actual["minutes"] . ":" . $fecha_actual["seconds"];

				if (isset($_POST["costo_real"])) {
					$arrayActividadAgrupada["costo_real"] = $_POST["costo_real"] === "" ? 0 : $_POST["costo_real"];
				}

				// Se actualiza la actividad actual
				$arrayActividadAgrupada["tiempo_real"] = $tiempo_usado;
				$arrayActividadAgrupada["fecha_hora_finalizacion"] = $fecha_final_actividad;
				$arrayActividadAgrupada["respuesta"] = $_POST["respuesta"];
				$arrayActividadAgrupada["estado"] = 1;
				$resul = $Data->updateRegistro($table, $arrayActividadAgrupada, $value_1["id"]);

				// Se actualiza la actividad siguiente
				$sql = 'UPDATE
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

				// Se verifica si la actividad siguiente es simultanea con otra y se activa 
				// activaActividadSimultanea($PDO);
			}
		}
	} else { // El matrerial de la actividad no esta agrupada con materiales de otro proyecto
		print_r("El material de la actividad NO está agrupado con marterial de otro proyecto.\n");

		/**************** SE GESTIONA LA ACTIVIDAD ACTUAL ***********/
		$_falg_gestiona_actividad_siguiente = false;
		for ($i = 0; $i < (count($arrayId_actividad) - 1); $i++) {

			// Se actualiza la actividad actual
			$resul = $Data->updateRegistro($table, $array, $arrayId_actividad[$i]);

			// Se busca la información de la actividad actual
			$sql = 'SELECT cia.* FROM cmx_importacion_proyecto cip
				INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
				WHERE cia.id = :id_actividad';

			// Preparar la consulta
			$stmt = $PDO->prepare($sql);
			// Vincular parámetro
			$stmt->bindParam(':id_actividad', $arrayId_actividad[$i], PDO::PARAM_INT);
			// Ejecutar la consulta
			$stmt->execute();
			// Obtener los resultados
			$resul_01 = $stmt->fetch(PDO::FETCH_ASSOC);

			// print_r($resul_01);

			// // Verificar si se encontraron datos
			if ($resul_01 && isset($resul_01["bloque"]) && $resul_01["bloque"] > 0) {
				$_flag_material = !empty($resul_01["id_material"]) ? ' AND cia.id_material = :id_material ' : '';

				$sql = "SELECT COUNT(cia.id) AS CUANTOS FROM cmx_importacion_proyecto cip
						INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
						WHERE cip.id = :id_importacion
						AND cia.grupo = :grupo AND cia.simultaneo = :simultaneo
						$_flag_material
						AND cia.orden < :orden AND cia.estado != 1;
				";

				$stmt = $PDO->prepare($sql);
				$stmt->bindParam(':id_importacion', $resul_01["id_importacion"], PDO::PARAM_INT);
				$stmt->bindParam(':grupo', $resul_01["grupo"], PDO::PARAM_INT);
				$stmt->bindParam(':simultaneo', $resul_01["simultaneo"], PDO::PARAM_STR);
				$stmt->bindParam(':orden', $resul_01["orden"], PDO::PARAM_INT);

				if (!empty($resul_01["id_material"])) {
					$stmt->bindParam(':id_material', $resul_01["id_material"], PDO::PARAM_INT);
				}

				$stmt->execute();
				$resul_02 = $stmt->fetch(PDO::FETCH_ASSOC);

				echo "Hay " . $resul_02["CUANTOS"] . " actividades simultaneas gestionadas antes de la actual.\n";

				if ($resul_02["CUANTOS"] == 0) {
					$_falg_gestiona_actividad_siguiente = true;
				} else {
					$_flag_material = !empty($resul_01["id_material"]) ? ' AND cia.id_material = :id_material ' : '';

					$sql = "SELECT cia.* FROM cmx_importacion_proyecto cip
								INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
								WHERE cip.id = :id_importacion
								AND cia.grupo = :grupo
								$_flag_material
								AND cia.orden = :orden;
						";

					$stmt = $PDO->prepare($sql);
					$stmt->bindParam(':id_importacion', $resul_01["id_importacion"], PDO::PARAM_INT);
					$stmt->bindParam(':grupo', $resul_01["grupo"], PDO::PARAM_INT);
					$stmt->bindParam(':orden', $orden_siguiente, PDO::PARAM_INT);

					if (!empty($resul_01["id_material"])) {
						$stmt->bindParam(':id_material', $resul_01["id_material"], PDO::PARAM_INT);
					}

					$stmt->execute();
					$resul_03 = $stmt->fetch(PDO::FETCH_ASSOC);

					if ($resul_01["bloque"] < $resul_03["bloque"]) {
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
			if (isset($_id_material_carga)) {
				print_r("La actividad tiene materiales registrados\n");

				$arrayId_carga = explode(",", $_id_material_carga);

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

										activaActividadSimultanea($PDO, $arraySimultaneo);
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
				print_r("La actividad no tiene materiales registrados\n");

				// SE ACTUALIZA LA ACTIVIDAD ACTUAL
				$sql = "	SELECT cia.id, cia.id_material,
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
					$stmtUpdate = $PDO->prepare($sqlUpdate);
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
										$stmtUpdate = $PDO->prepare($sqlUpdate);
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
											activaActividadSimultanea($PDO, $arraySimultaneo);
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

switch (isset($_POST["integracion"])) {
	case 'soluciones':
		if ($_POST["bloque"] == 1) {
			print_r("La actividad está integrada al módulo de soluciones\n");
			$numero_solicitud = "SLC-" . time();

			try {
				// Consulta principal
				$sql = 'SELECT cip.id_cliente, 
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
				$stmt = $PDO->prepare($sql);
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

function activaActividadSimultanea($PDO, $array)
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

		$stmt = $PDO->prepare($sql);
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

			$updateStmt = $PDO->prepare($updateSql);
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
