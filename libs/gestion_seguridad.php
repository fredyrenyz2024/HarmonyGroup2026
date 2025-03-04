<?php
include("../application/Config.php");
include '../application/Conexion.php';
// configuracion de la zona horaria
date_default_timezone_set('America/Bogota');

$return["control"] = "Entro en archivo gestion_seguridad.php\n";
$return["actividades"] = array();
$Data = new Consultas;

// Tomo la fecha actual
$fecha_actual = getdate();
$tiempo_actual = $fecha_actual[0];

$fecha_hora_actual = $fecha_actual["year"] . "-" . $fecha_actual["mon"] . "-" . $fecha_actual["mday"] . " " . $fecha_actual["hours"] . ":" . $fecha_actual["minutes"] . ":" . $fecha_actual["seconds"];

// Se actualiza la actividad actual
if (isset($_POST["id"])) {
	$arrayId_actividad = explode(",", $_POST["id"]);
	// $return["actividades"] = $arrayId_actividad;
}

switch ($_GET["action"]) {
	case 'asignacion_ruta':
		$return["control"] .= "Entro en asignacion_ruta \n";

		// Se asigna el plan de ruta al agrupamiento 
		$arrayPlanRuta = array(
			"id_mapa_ruta" => $_POST["id_plan_ruta"]
		);
		$resul = $Data->updateRegistro("cmx_agrupaciones", $arrayPlanRuta, $_POST["id_agrupamiento"]);

		// Se crea el array de las actividades
		foreach ($arrayId_actividad as $key => $value) {
			if ($value) {
				array_push($return["actividades"], gestiona_actividad($Data, $value, $fecha_actual));
			}
		}
		break;

	case 'seguimiento_carga':
		$return["control"] .= "Entro en seguimiento_carga \n";

		// Se pregunta si ya se cargo todos los origenes de la solicitud 
		$_flag_tramos = valida_carga_tramos($Data, $_POST["id_solicitud"]);
		foreach ($arrayId_actividad as $key => $value) {
			if ($value) {
				// Se inserta el registro del seguimiento
				$arraySeguimiento["id_actividad"] = $value;
				$arraySeguimiento["tipo_seguimiento"] = $_POST["tipo_seguimiento_carga"];
				$arraySeguimiento["observacion"] = trim($_POST["observacion"]);
				$arraySeguimiento["observacion_interna"] = trim($_POST["observacion_interna"]);
				$arraySeguimiento["fecha_hora"] = $fecha_hora_actual;
				$arraySeguimiento["autor"] = $_GET["id_usuario"];

				// Se pregunta si la descarga ya terminó 
				if ($_POST["tipo_seguimiento_carga"] == "Cargue Terminado") {
					if ($_flag_tramos) {
						// Se gestiona la actividad 
						array_push($return["actividades"], gestiona_actividad($Data, $value, $fecha_actual));
					}

					if (isset($_POST["fecha"])) {
						$arraySeguimiento["fecha_hora_finalizacion"] = $_POST["fecha"];
						$arraySeguimiento["id_tramo"] = $_POST["id_origen"];

						// Se pregunta si se debe cambiar el estado de la tabla cmx_tramo_solicitud
						$_flag_cambia_tramo_solicitud = true;
						if ($_POST["flag_valida_gestion_tramo"] == 1) {
							// Se busca los seguimientos del agrupamiento de la actividad de descarga 
							$sql = '
									SELECT 
										cas.id_agrupacion, cts.id_solicitud
									FROM 
										cmx_tramo_solicitud cts
										INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_solicitud = cts.id_solicitud
									WHERE 
										cts.id = ' . $_POST["id_tramo_solicitud"] . '
										AND cas.id_agrupacion != ' . $_POST["id_agrupamiento"] . '
								';
							$result = $Data->getConsulta($sql);
							// $return["sql"]= $result;

							// Si hay otras solicitudes de ese agrupamiento se pregunta si las otras solicitudes ya estan gestionadas  
							if ($result) {
								foreach ($result["rowsData"] as $key_01 => $value_01) {
									$sql = '
											SELECT 
												COUNT(cia.id) CUANTOS
											FROM 
												cmx_agrupacion_solicitudes cas 
												INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = cas.id_agrupacion
												INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud AND cms.id = cam.id_material 
												INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto 
											WHERE 
												cas.id_agrupacion = ' . $value_01["id_agrupacion"] . '
												AND cas.id_solicitud = ' . $value_01["id_solicitud"] . '
												AND cia.estado = 2 
												AND cia.tipo_actividad = "carga_inicial";
										';
									$result_01 = $Data->getConsulta($sql);
									// $return["sql"]= $result_01;

									if ($result_01["rowsData"][0]["CUANTOS"] > 0) {
										$_flag_cambia_tramo_solicitud = false;
									}
								}
							}
						}

						// Se modifica el estado del tramo solicitud
						if ($_flag_cambia_tramo_solicitud) {
							$arrayTramoSolicitud = array(
								"estado" => 1
							);
							$resul = $Data->updateRegistro("cmx_tramo_solicitud", $arrayTramoSolicitud, $_POST["id_origen"]);
						}
					}
				}
				$resul = $Data->setRegistro("cmx_importacion_seguimiento_cargue", $arraySeguimiento);
			}
		}
		break;

	case 'informar_anticipo':
		$return["control"] .= "Entro en informar_anticipo \n";
		// Se gestionan las actividades 
		foreach ($arrayId_actividad as $key => $value) {
			if ($value) {
				array_push($return["actividades"], gestiona_actividad($Data, $value, $fecha_actual));
			}
		}
		break;

	case 'seguimiento_ruta':
		$return["control"] .= "Entro en seguimiento_ruta\n";

		/****** Se guarda el archivo del seguimiento ******/
		if ($_FILES["url_seguimiento"]["name"]) {
			// Se copia el archivo en una carpeta temporal 
			$tmp_file = $_FILES["url_seguimiento"]["tmp_name"];
			$extension = get_extension_archivo($_FILES["url_seguimiento"]["name"]);
			$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
			if (move_uploaded_file($tmp_file, $archivo_temporal)) {
				$_flag_tramos = valida_ruta_tramos($Data, $_POST["id_solicitud"]);
				foreach ($arrayId_actividad as $key => $value) {
					if ($value) {
						$_flag_gestion = valida_actividad_seguimiento_ruta($Data, $value, $_POST["id_agrupamiento"], $_POST["id_solicitud"]);

						if ($_flag_gestion) {
							$carpeta_destino = "../public/files/importaciones";
							if (!file_exists($carpeta_destino)) {
								mkdir($carpeta_destino, 0777, true);
							}

							$carpeta_destino_1 = $carpeta_destino . "/seguimiento_ruta/" . $value;
							if (!file_exists($carpeta_destino_1)) {
								mkdir($carpeta_destino_1, 0777, true);
							}

							$extension = get_extension_archivo($_FILES["url_seguimiento"]["name"]);
							$archivo_destino = $tiempo_actual . "-" . $value . "." . $extension;
							$destino = $carpeta_destino_1 . "/" . $archivo_destino;

							if (copy($archivo_temporal, $destino)) {
								$return["control"] .= "Se copia el archivo \n";

								// Se guarda la información del seguimiento de ruta en la base de datos 
								$arraySeguimiento["id_actividad"] = $value;
								$arraySeguimiento["latitud"] = $_POST["latitud"];
								$arraySeguimiento["longitud"] = $_POST["longitud"];
								$arraySeguimiento["ubicacion"] = $_POST["ubicacion"];
								$arraySeguimiento["tipo_seguimiento_ruta"] = $_POST["tipo_seguimiento_ruta"];
								$arraySeguimiento["velocidad"] = $_POST["velocidad"];
								$arraySeguimiento["observacion"] = trim($_POST["seguimiento"]);
								$arraySeguimiento["observacion_interna"] = trim($_POST["seguimiento_interno"]);
								$arraySeguimiento["url"] = $archivo_destino;
								$arraySeguimiento["fecha_hora"] = $fecha_hora_actual;
								$arraySeguimiento["autor"] = $_GET["id_usuario"];
								$resul = $Data->setRegistro("cmx_importacion_seguimiento_rutas", $arraySeguimiento);

								// Si se selecciona que se llega al destino se debe gestionar la actividad 
								if ($_POST["tipo_seguimiento_ruta"] == "Llegada Destino" and $_flag_tramos) {
									array_push($return["actividades"], gestiona_actividad($Data, $value, $fecha_actual));
								}
							} else {
								$return["control"] .= "No se copia el archivo \n";
							}
						}
					}
				}
				// Se elimina el archivo temporal
				unlink($archivo_temporal);

				// Se actualiza el estado del tramo de descargue seleccionado en caso de que ya haya llegado a destino 
				if ($_POST["tipo_seguimiento_ruta"] == "Llegada Destino") {
					$array = array();
					$array["estado"] = 1;
					$Data->updateRegistro("cmx_tramo_solicitud", $array, (int)$_POST["id_destino"]);
				}
			} else {
				$return["control"] .= "No se copia el archivo temporal \n";
			}
		} else {
			$return["control"] .= "No hay archivo entregable para subir \n";
		}
		/****** Fin - Se guarda el archivo del seguimiento ******/
		break;

	case 'verificar_seguimientos':
		$return["control"] .= "Entro en verificar_seguimientos\n";
		include_once '../application/Model.php';
		$Model = new Model;
		$sql = '
				SELECT 
					cia.id ID_ACTIVIDAD,
					cip.numero_importacion, cip.importacion,  
					cc.nombre NOMBRE_CLIENTE,
					crd.nombre ORIGEN, CONCAT(cm.municipio," (", cm.depto," - ", cm.pais,")") CIUDAD_ORIGEN,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						1,
						0
					) ULTIMO_SEGUIMIENTO,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(SELECT MAX(cisr1.fecha_hora) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id),
						cia.fecha_hora_inicio
					) ULTIMO_SEGUIMIENTO_FECHA,
					TIMESTAMPDIFF(HOUR, 
						IF(
							(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
							(SELECT MAX(cisr1.fecha_hora) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id),
							cia.fecha_hora_inicio
						),
						"' . $fecha_hora_actual . '"
					) DIFERENCIA,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(	SELECT cisr1.ubicacion 
							FROM cmx_importacion_seguimiento_rutas cisr1 
							WHERE 
								cisr1.id_actividad = cia.id 
								AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
						crd.nombre
					) ULTIMO_SEGUIMIENTO_UBICACION,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(	SELECT cisr1.tipo_seguimiento_ruta 
							FROM cmx_importacion_seguimiento_rutas cisr1 
							WHERE 
								cisr1.id_actividad = cia.id 
								AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
						"Sin iniciar ruta"
					) ULTIMO_SEGUIMIENTO_TIPO_SEGUIMIENTO,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(	SELECT cisr1.observacion 
							FROM cmx_importacion_seguimiento_rutas cisr1 
							WHERE 
								cisr1.id_actividad = cia.id 
								AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
						"Sin iniciar ruta"
					) ULTIMO_SEGUIMIENTO_OBSERVACION,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(	SELECT cisr1.observacion_interna 
							FROM cmx_importacion_seguimiento_rutas cisr1 
							WHERE 
								cisr1.id_actividad = cia.id 
								AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
						""
					) ULTIMO_SEGUIMIENTO_OBSERVACION_INTERNA,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(	SELECT cu1.nom_usuario
							FROM cmx_importacion_seguimiento_rutas cisr1 
								INNER JOIN cmx_usuarios cu1 ON cu1.id = cisr1.autor
							WHERE 
								cisr1.id_actividad = cia.id 
								AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
						""
					) ULTIMO_SEGUIMIENTO_AUTOR,
					IF(
						(SELECT COUNT(cisr1.id) FROM cmx_importacion_seguimiento_rutas cisr1 WHERE cisr1.id_actividad = cia.id ) > 0,
						(	SELECT cu1.url_avatar
							FROM cmx_importacion_seguimiento_rutas cisr1 
								INNER JOIN cmx_usuarios cu1 ON cu1.id = cisr1.autor
							WHERE 
								cisr1.id_actividad = cia.id 
								AND cisr1.id = (	SELECT MAX(cisr2.id) 
														FROM cmx_importacion_seguimiento_rutas cisr2 
														WHERE cisr2.id_actividad = cia.id) ),
						""
					) ULTIMO_SEGUIMIENTO_AVATAR,
					SUM( cam.peso ) PESO,
					ctv.nombre TIPO_VEHICULO,
					cia.estado ESTADO_ACTIVIDAD
				FROM 
					cmx_importacion_actividades cia
					INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = cam.id_agrupamiento
					INNER JOIN cmx_vehiculos cv ON cav.id_vehiculo = cv.id
					INNER JOIN cmx_tipo_vehiculos ctv ON ctv.id = cv.tipo_vehiculo
					INNER JOIN cmx_importacion_material cim ON cim.id = cia.id_material
					INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cim.id
					INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cms.id_solicitud
					INNER JOIN cmx_tramos_orden cto ON cto.id_tramo = cts.id
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
				WHERE
					cia.estado = 2 
					AND cia.tipo_actividad = "seguimiento_ruta"
					AND cip.estado NOT IN (0,4)
				GROUP BY cia.id_importacion, cia.grupo
				HAVING DIFERENCIA >= ' . STANDBY_SEGUIMIENTO_HOURS . '
				ORDER BY cia.estado DESC, cia.id_importacion;
			';
		$result = $Data->getConsulta($sql);

		$return["cuantos"] = 0;
		$return["content"] = '';
		if ($result["rowsData"]) {
			$return["cuantos"] = $result["rowsNum"];
			$return["content"] = '';
			foreach ($result["rowsData"] as $key => $value) {
				$_url_image = BASE_URL . 'views/layout/assets/img/logo.png';
				if ($value["ULTIMO_SEGUIMIENTO_AUTOR"]) {
					$_url_image = BASE_URL . 'public/img/users/' . $value["ULTIMO_SEGUIMIENTO_AVATAR"];
				}
				$_tiempo_retrazo = $Model->getTimeDiff($fecha_hora_actual, $value["ULTIMO_SEGUIMIENTO_FECHA"]);
				$return["content"] .= '
						<li class="notification">
							<a href="#">
								<div class="image">
									<img src="' . $_url_image . '" alt="' . $value["ULTIMO_SEGUIMIENTO_AUTOR"] . '">
								</div>
								<div class="notification-info">
									<div class="text">' . $value["ULTIMO_SEGUIMIENTO_AUTOR"] . '</div>
									<span class="date"><strong>' . $value["ULTIMO_SEGUIMIENTO_UBICACION"] . '</strong> - ' . $value["ULTIMO_SEGUIMIENTO_FECHA"] . '</span>
									<div class="text">
										<span class="user-name">' . $value["ULTIMO_SEGUIMIENTO_TIPO_SEGUIMIENTO"] . '</span> 
										' . $value["ULTIMO_SEGUIMIENTO_OBSERVACION"] . '
									</div>
									<div class="text">
										<span class="text-danger">' . $value["ULTIMO_SEGUIMIENTO_OBSERVACION_INTERNA"] . '</span> 
									</div>
									<span class="date">Retrazado por: <strong>' . $_tiempo_retrazo["diferencia_text"] . '</strong></span>
								</div>
							</a>
						</li>
					';
			}
		}
		break;

	case 'seguimiento_descarga':
		$return["control"] .= "Entro en seguimiento_descarga \n";

		// Se pregunta si ya se cargo todos los origenes de la solicitud 
		$_flag_tramos = valida_descarga_tramos($Data, $_POST["id_solicitud"]);
		foreach ($arrayId_actividad as $key => $value) {
			if ($value) {
				// Se inserta el registro del seguimiento
				$arraySeguimiento["id_actividad"] = $value;
				$arraySeguimiento["tipo_seguimiento"] = $_POST["tipo_seguimiento_descarga"];
				$arraySeguimiento["observacion"] = $_POST["observacion"];
				$arraySeguimiento["observacion_interna"] = $_POST["observacion_interna"];
				$arraySeguimiento["fecha_hora"] = $fecha_hora_actual;
				$arraySeguimiento["autor"] = $_GET["id_usuario"];

				// Se pregunta si la descarga ya terminó 
				if ($_POST["tipo_seguimiento_descarga"] == "Descargue Terminado") {
					if ($_flag_tramos) {
						// Se gestiona la actividad 
						array_push($return["actividades"], gestiona_actividad($Data, $value, $fecha_actual));
					}

					if (isset($_POST["fecha"])) {
						$arraySeguimiento["fecha_hora_finalizacion"] = $_POST["fecha"];
						$arraySeguimiento["id_tramo"] = $_POST["id_destino"];

						// Se pregunta si se debe cambiar el estado de la tabla cmx_tramo_solicitud
						$_flag_cambia_tramo_solicitud = true;
						if ($_POST["flag_valida_gestion_tramo"]) {
							// Se busca los seguimientos del agrupamiento de la actividad de descarga 
							$sql = '
									SELECT 
										cas.id_agrupacion, cts.id_solicitud
									FROM 
										cmx_tramo_solicitud cts
										INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_solicitud = cts.id_solicitud
									WHERE 
										cts.id = ' . $_POST["id_tramo_solicitud"] . '
										AND cas.id_agrupacion != ' . $_POST["id_agrupamiento"] . '
								';
							$result = $Data->getConsulta($sql);

							// Si hay otras solicitudes de ese agrupamiento se pregunta si las otras solicitudes ya estan gestionadas  
							if ($result) {
								foreach ($result["rowsData"] as $key_01 => $value_01) {
									$sql = '
											SELECT 
												COUNT(cia.id) CUANTOS
											FROM 
												cmx_agrupacion_solicitudes cas 
												INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = cas.id_agrupacion
												INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud AND cms.id = cam.id_material
												INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
											WHERE 
												cas.id_agrupacion = ' . $value_01["id_agrupacion"] . '
												AND cas.id_solicitud = ' . $value_01["id_solicitud"] . '
												AND cia.estado = 2 
												AND cia.tipo_actividad = "seguimiento_descarga";
										';

									$result_01 = $Data->getConsulta($sql);
									if ($result_01["rowsData"][0]["CUANTOS"] > 0) {
										$_flag_cambia_tramo_solicitud = false;
									}
								}
							}
						}

						// Se modifica el estado del tramo solicitud
						if ($_flag_cambia_tramo_solicitud) {
							$arrayTramoSolicitud = array(
								"estado" => 3
							);
							$resul = $Data->updateRegistro("cmx_tramo_solicitud", $arrayTramoSolicitud, $_POST["id_tramo_solicitud"]);
						}
					}
				}
				$resul = $Data->setRegistro("cmx_importacion_seguimiento_descargue", $arraySeguimiento);
			}
		}
		break;

	default:
		$return["control"] .= "No entro en ninguna de la opciones válidas\n";
		break;
}

echo json_encode($return);

function valida_actividad_seguimiento_ruta($Data, $value, $id_agrupamiento, $id_solicitud)
{
	$_flag_gestion = false;
	// Se busca a información de la actividad 
	$_flag_filter_solicitud = "";
	if ($id_solicitud) {
		$_flag_filter_solicitud = ' AND cas.id_solicitud = ' . $id_solicitud;
	}
	$sql = '
			SELECT 
				COUNT(cia.id) CUANTOS
			FROM 
				cmx_agrupacion_solicitudes cas
				INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = cas.id_agrupacion
				INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud AND cms.id = cam.id_material
				INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cam.id_material_proyecto
				INNER JOIN cmx_importacion_proyecto cip ON cip.id = cia.id_importacion
			WHERE 
				cia.id = ' . $value . '
				AND cas.id_agrupacion = ' . $id_agrupamiento . '
				' . $_flag_filter_solicitud . '
		';
	$result = $Data->getConsulta($sql);
	$cuantas_actividades = $result["rowsData"][0]["CUANTOS"];

	if ($cuantas_actividades > 0) {
		$_flag_gestion = true;
	}
	return $_flag_gestion;
}

function valida_carga_tramos($Data, $id_solicitud)
{
	$_flag_gestion = false;
	if ($id_solicitud) {
		// Se cuentan cuantos tramos tiene pendiente la solicitud 
		$sql = '
				SELECT COUNT(cts.id) CUANTOS
				FROM cmx_tramo_solicitud cts
				WHERE cts.id_solicitud = ' . $id_solicitud . '
					AND cts.tipo_operacion = "Cargue"
					AND cts.estado = 2
			';
		$result = $Data->getConsulta($sql);
		$cuantos_tramos = $result["rowsData"][0]["CUANTOS"];
		if ($cuantos_tramos < 2) {
			$_flag_gestion = true;
		}
	}
	return $_flag_gestion;
}

function valida_ruta_tramos($Data, $id_solicitud)
{
	$_flag_gestion = false;
	if ($id_solicitud) {
		// Se cuentan cuantos tramos tiene pendiente la solicitud 
		$sql = '
				SELECT COUNT(cts.id) CUANTOS
				FROM cmx_tramo_solicitud cts
				WHERE cts.id_solicitud = ' . $id_solicitud . '
					AND cts.tipo_operacion = "Descargue"
					AND cts.estado = 2
			';
		$result = $Data->getConsulta($sql);
		$cuantos_tramos = $result["rowsData"][0]["CUANTOS"];
		if ($cuantos_tramos < 2) {
			$_flag_gestion = true;
		}
	}
	return $_flag_gestion;
}

function valida_descarga_tramos($Data, $id_solicitud)
{
	$_flag_gestion = false;
	if ($id_solicitud) {
		// Se cuentan cuantos tramos tiene pendiente la solicitud 
		$sql = '
				SELECT COUNT(cts.id) CUANTOS
				FROM cmx_tramo_solicitud cts
				WHERE cts.id_solicitud = ' . $id_solicitud . '
					AND cts.tipo_operacion = "Descargue"
					AND cts.estado = 1
			';
		$result = $Data->getConsulta($sql);
		$cuantos_tramos = $result["rowsData"][0]["CUANTOS"];
		if ($cuantos_tramos < 2) {
			$_flag_gestion = true;
		}
	}
	return $_flag_gestion;
}

function gestiona_actividad($Data, $value, $fecha_actual)
{
	$js = "";
	// Se busca a información de la actividad 
	$sql = '
			SELECT 
				cia.*
			FROM 
				cmx_importacion_actividades cia
			WHERE 
				cia.id = ' . $value . ';
		';
	$resul_01 = $Data->getConsulta($sql);

	return $resul_01["rowsData"][0];
}

function get_extension_archivo($nombre_archivo)
{
	$archivo = explode(".", $nombre_archivo);
	return ($archivo[count($archivo) - 1]);
}
