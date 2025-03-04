<?php
include("../application/Config.php");
include '../application/Conexion.php';
// configuracion de la zona horaria
date_default_timezone_set('America/Bogota');

print_r("Entro en gestion_entregables.php\n");
$Data = new Consultas;
$Data2 = new Conexion;
$PDO = $Data2->conectar();

// // RECIBO LOS PARAMETROS POR POST
// print_r("Array del POST\n");
// print_r($_POST);

// // RECIBO LOS PARAMETROS POR GET
// print_r("Array del GET\n");
// print_r($_GET);

// // RECIBO LOS PARAMETROS DEL FILE
// print_r("Array del FILES\n");
// print_r($_FILES);

$ahora = getdate();
$tiempo_actual = $ahora[0];

// se fltra el proyecto al cual se esta insertando el entregable
switch ($_GET['proyecto']) {
	case 'ordenes_compra_oc':
		$table = 'cmx_entregable_actividad_oc';
		$table_verificacion = '';
		break;

	case 'importaciones':
		$table = 'cmx_importacion_entregables';
		$table_verificacion = 'cmx_importacion_imagen_actividad';
		break;

	default:
		# code...
		break;
}

/***** SE FILTRA SI LA GESTION DE LA ACTIVIDAD TIENE ARCHIVO ENTREGABLE *****/

switch ($_POST["tipo_actividad"]) {
	case 'seguimiento':
		$_flag_sube_archivo = true;
		if ($_POST["seguimiento"]) {
			$_flag_sube_archivo = false;
		}
		break;

	case 'seguimiento_cliente':
		$_flag_sube_archivo = true;
		if ($_POST["seguimiento"]) {
			$_flag_sube_archivo = false;
		}
		break;

	default:
		$_flag_sube_archivo = true;
		break;
}

if (isset($_FILES["url_entregable"]["name"]) and $_flag_sube_archivo) {
	// print_r($_FILES["url_entregable"]);

	// Se copia el archivo en una carpeta temporal 
	$tmp_file = $_FILES["url_entregable"]["tmp_name"];
	$extension = get_extension_archivo($_FILES["url_entregable"]["name"]);
	$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
	if (move_uploaded_file($tmp_file, $archivo_temporal)) {
		// print_r("Se copia el archivo temporal \n");
		$arrayId_actividad = explode(",", $_POST['id']);
		$arrayEntregable = array();
		for ($i = 0; $i < (count($arrayId_actividad) - 1); $i++) {

			$carpeta_destino = "../public/files/" . $_GET['proyecto'];
			if (!file_exists($carpeta_destino)) {
				mkdir($carpeta_destino, 0777, true);
				// print_r("Si se pudo crear la carpeta \n");
			}

			$carpeta_destino_1 = $carpeta_destino . "/entregables/" . $arrayId_actividad[$i];
			if (!file_exists($carpeta_destino_1)) {
				mkdir($carpeta_destino_1, 0777, true);
				// print_r("Si se pudo crear la carpeta \n");
			}

			$extension = get_extension_archivo($_FILES["url_entregable"]["name"]);
			$archivo_destino = $tiempo_actual . "-" . $arrayId_actividad[$i] . "." . $extension;
			$destino = $carpeta_destino_1 . "/" . $archivo_destino;

			$arrayEntregable[$i]["id_actividad"] = $arrayId_actividad[$i];
			$arrayEntregable[$i]["url"] = $archivo_destino;
			$arrayEntregable[$i]["fecha_subida"] = date('Y-m-d H:i:s', time());

			if (copy($archivo_temporal, $destino)) {
				print_r("Se copia el archivo \n");

				// Se guarda la informacion del entregable en la base de datos 
				$resul = $Data->setRegistro($table, $arrayEntregable[$i]);
				// print_r($resul);
			} else {
				print_r("No se copia el archivo \n");
			}
		}
		// Se elimina el archivo temporal
		unlink($archivo_temporal);
	} else {
		print_r("No se copia el archivo temporal \n");
	}
} else {
	print_r("No hay archivo entregable para subir \n");
}
/***** FIN DE FILTRO SI LA GESTION DE LA ACTIVIDAD TIENE ARCHIVO ENTREGABLE *****/

if (isset($_POST["tipo_actividad"])) {
	switch ($_POST["tipo_actividad"]) {
		case 'fecha':
			// print_r("Entro en tipo de actividad fecha\n");

			// $arrayId_actividad_fecha = explode(",", $_POST["id"]);
			// // Se actualiza las actividades realcionadas al material 
			// for ($i=0; $i < (count($arrayId_actividad_fecha) - 1) ; $i++) { 
			// 	$sql = '
			// 		SELECT
			// 			COUNT(cie.id) CUANTOS
			// 		FROM 
			// 			cmx_importacion_entregables cie
			// 		WHERE
			// 			cie.id_actividad = ' . $arrayId_actividad_fecha[$i] . '
			// 	';
			// 	// print_r($sql . "\n");
			// 	// $resul = $Data->getConsulta($sql);
			// 	$resul = $PDO->prepare($sql);
			// 	$resul->execute();

			// 	// print_r($resul);

			// 	if ($resul["rowsData"][0]["CUANTOS"] > 0 ) {
			// 		// print_r("se actualiza entregable\n");
			// 		$sql = '
			// 			UPDATE
			// 				cmx_importacion_entregables 
			// 			SET 
			// 				fecha = "' . $_POST["fecha"] . '"
			// 			WHERE 
			// 				id_actividad = ' . $arrayId_actividad_fecha[$i] . '
			// 		;';
			// 		// print_r($sql);
			// 		$resul_1 = $Data->getConsulta($sql);
			// 		// print_r($resul_1);

			// 	} else {
			// 		// Se guarda la información del material de la importación en el material de la solucion
			// 		$arrayEntregableFecha = array();
			// 		$arrayEntregableFecha["id_actividad"] = $arrayId_actividad_fecha[$i];
			// 		$arrayEntregableFecha["fecha"] = $_POST["fecha"];
			// 		$resul_1 = $Data->setRegistro("cmx_importacion_entregables", $arrayEntregableFecha);
			// 		// print_r($resul_1);
			// 	}
			// }
			print_r("Entro en tipo de actividad fecha\n");

			$arrayId_actividad_fecha = explode(",", $_POST["id"]);
			$fecha = $_POST["fecha"];

			for ($i = 0; $i < (count($arrayId_actividad_fecha) - 1); $i++) {
				$id_actividad = $arrayId_actividad_fecha[$i];

				// Verificar si hay registros con ese id_actividad
				$sql = "SELECT COUNT(id) AS CUANTOS FROM cmx_importacion_entregables WHERE id_actividad = :id_actividad";
				$stmt = $PDO->prepare($sql);
				$stmt->bindParam(":id_actividad", $id_actividad, PDO::PARAM_INT);
				$stmt->execute();
				$resul = $stmt->fetch();

				if ($resul["CUANTOS"] > 0) {
					// Actualizar la fecha si existe el registro
					$sql = "UPDATE cmx_importacion_entregables SET fecha = :fecha WHERE id_actividad = :id_actividad";
					$stmt = $PDO->prepare($sql);
					$stmt->bindParam(":fecha", $fecha);
					$stmt->bindParam(":id_actividad", $id_actividad, PDO::PARAM_INT);
					$stmt->execute();
					print_r("Se actualizó el entregable con id_actividad: $id_actividad\n");
				} else {
					// Insertar nuevo registro si no existe
					$sql = "INSERT INTO cmx_importacion_entregables (id_actividad, fecha) VALUES (:id_actividad, :fecha)";
					$stmt = $PDO->prepare($sql);
					$stmt->bindParam(":id_actividad", $id_actividad, PDO::PARAM_INT);
					$stmt->bindParam(":fecha", $fecha);
					$stmt->execute();
					print_r("Se insertó nuevo entregable con id_actividad: $id_actividad\n");
				}
			}
			break;

		case 'verificacion_mercancia':
			print_r("Entro en tipo de actividad verificacion_mercancia\n");

			/******* se verifica si la actividad tiene observaciones *******/
			$arrayId_materiales = explode(",", $_POST["id_material"]);
			for ($i = 0; $i < (count($arrayId_materiales) - 1); $i++) {
				if (isset($_POST["observacion_material_" . $arrayId_materiales[$i]])) {
					$arrayId_actividadObservaciones = explode(",", $_POST["id"]);
					for ($j = 0; $j < (count($arrayId_actividadObservaciones) - 1); $j++) {
						$arrayObservacionMaterial["id_actividad"] = $arrayId_actividadObservaciones[$j];
						$arrayObservacionMaterial["id_material"] = $arrayId_materiales[$i];
						$arrayObservacionMaterial["observacion"] = $_POST["observacion_material_" . $arrayId_materiales[$i]];
						$resul = $Data->setRegistro("cmx_importacion_obsevacion_material", $arrayObservacionMaterial);
						// print_r($resul);
					}
				}
			}
			/******* fin se verifica si la actividad tiene observaciones *******/

			/******* Se incluye las imagenes de la actividad *******/
			// Se crean las carpetas de guardado de imagenes de la actividad 
			$carpeta_destino = "../public/files/importaciones/";
			if (!file_exists($carpeta_destino)) {
				mkdir($carpeta_destino, 0777, true);
				// print_r("Si se pudo crear la carpeta \n");
			}

			$carpeta_verificacion = $carpeta_destino . "verificacion/";
			if (!file_exists($carpeta_verificacion)) {
				mkdir($carpeta_verificacion, 0777, true);
				// print_r("Si se pudo crear la carpeta \n");
			}

			// Se crean los archivos temporales de la imagenes de la actividad  
			$_flag_img = true;
			$_i = 0;
			do {
				if (isset($_FILES["imagen_" . $_i])) {
					$tmp_file = $_FILES["imagen_" . $_i]["tmp_name"];
					$extension = get_extension_archivo($_FILES["imagen_" . $_i]["name"]);
					$archivo_temporal = "../public/files/tmp/tmp_file_" . $_i . "." . $extension;
					move_uploaded_file($tmp_file, $archivo_temporal);
				} else {
					$_flag_img = false;
				}
				$_i++;
			} while ($_flag_img);

			// Se copian los archivo de la actividad y se crea el registro en la base de datos
			$arrayId_actividad = explode(",", $_GET['id_actividades']);
			for ($i = 0; $i < (count($arrayId_actividad) - 1); $i++) {
				// print_r("Entro en el id actividad " . $arrayId_actividad[$i] . "\n");

				$carpeta_actividad = $carpeta_verificacion . $arrayId_actividad[$i] . "/";
				if (!file_exists($carpeta_actividad)) {
					mkdir($carpeta_actividad, 0777, true);
					// print_r("Si se pudo crear la carpeta \n");
				}

				$ahora = getdate();
				$tiempo_actual = $ahora[0];
				for ($j = 0; $j < ($_i - 1); $j++) {
					$tmp_file = $_FILES["imagen_" . $j]["tmp_name"];
					$extension = get_extension_archivo($_FILES["imagen_" . $j]["name"]);
					$archivo_temporal = "../public/files/tmp/tmp_file_" . $j . "." . $extension;

					$extension = get_extension_archivo($_FILES["imagen_" . $j]["name"]);
					$archivo_destino = $tiempo_actual . "-" . $j . "." . $extension;
					$destino = $carpeta_actividad . "/" . $archivo_destino;

					$arrayVerificacion[$i]["id_actividad"] = $arrayId_actividad[$i];
					$arrayVerificacion[$i]["url"] = $archivo_destino;

					if (copy($archivo_temporal, $destino)) {
						// Se guarda la informacion de la verificacion en la base de datos 
						$resul = $Data->setRegistro($table_verificacion, $arrayVerificacion[$i]);
						// print_r($resul);
					}
				}
			}

			// se eliminan los archivos temporales
			for ($j = 0; $j < ($_i - 1); $j++) {
				$tmp_file = $_FILES["imagen_" . $j]["tmp_name"];
				$extension = get_extension_archivo($_FILES["imagen_" . $j]["name"]);
				$archivo_temporal = "../public/files/tmp/tmp_file_" . $j . "." . $extension;
				unlink($archivo_temporal);
			}
			/******* Fin Se incluye las imagenes de la actividad *******/
			break;

		case 'carga_inicial':
			print_r("Entro en tipo de actividad carga_inicial\n");

			$arrayId_tramos = explode(",", $_POST["lista_tramos"]);
			// Se actualiza las actividades realcionadas al material 
			for ($i = 0; $i < (count($arrayId_tramos) - 1); $i++) {

				if ($_POST["fecha_" . $arrayId_tramos[$i]]) {
					$arrayTramo = array();
					$arrayTramo["fecha_hora_operacion"] = $_POST["fecha_" . $arrayId_tramos[$i]];
					$arrayTramo["estado"] = 1;
					// print_r($arrayTramo);
					// print_r("\n");

					$resul = $Data->updateRegistro("cmx_tramo_solicitud", $arrayTramo, $arrayId_tramos[$i]);
					// print_r($resul);
				}
			}
			break;

		case 'seguimiento':
			print_r("Entro en tipo de actividad seguimiento\n");

			if ($_POST["seguimiento"]) {
				// Se toma la fecha actual para poner la fecha inicial de la siguinete actividad
				$tiempo_actual = $ahora["year"] . "-" . $ahora["mon"] . "-" . $ahora["mday"] . " " . $ahora["hours"] . ":" . $ahora["minutes"] . ":" . $ahora["seconds"];

				$arrayId_actividad = explode(",", $_POST["id"]);
				// Se actualiza las actividades realcionadas al material 
				for ($i = 0; $i < (count($arrayId_actividad) - 1); $i++) {
					// Se guarda la información del material de la importación en el material de la solucion
					$arraySeguimiento = array();
					$arraySeguimiento["id_actividad"] = $arrayId_actividad[$i];
					$arraySeguimiento["observacion"] = $_POST["seguimiento"];
					$arraySeguimiento["fecha_hora"] = $tiempo_actual;
					$arraySeguimiento["autor"] = $_POST["id_usuario"];

					if (isset($_POST["id_seguimiento"])) {
						$arraySeguimiento["id_seguimiento"] = $_POST["id_seguimiento"];
					}
					$id_seguimiento = $Data->setRegistro("cmx_importacion_seguimiento", $arraySeguimiento);
					// print_r($id_seguimiento);

					if (isset($_FILES["url_entregable"]["name"]) and !$_flag_sube_archivo) {
						print_r("Se debe guardar el archivo en el entregable de la solicitud\n");
						// Se copia el archivo en una carpeta temporal 
						$tmp_file = $_FILES["url_entregable"]["tmp_name"];
						$extension = get_extension_archivo($_FILES["url_entregable"]["name"]);
						$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
						if (move_uploaded_file($tmp_file, $archivo_temporal)) {
							// print_r("Se copia el archivo temporal \n");

							$archivo = $id_seguimiento . "-" . time() . "." . $extension;

							$carpeta_destino = "../public/files/importaciones/seguimiento/" . $arraySeguimiento["id_actividad"];
							if (!file_exists($carpeta_destino)) {
								mkdir($carpeta_destino, 0777, true);
								// print_r("Si se pudo crear la carpeta \n");
							}

							$archivo_destino = $archivo;
							$destino = $carpeta_destino . "/" . $archivo_destino;

							if (copy($archivo_temporal, $destino)) {
								print_r("Se copia el archivo \n");

								// Se crea los datos del archivo del seguimiento 
								$array = array();
								$array["url"] = $archivo;

								// Se guarda la informacion del entregable de segumineto en la base de datos 
								$resul = $Data->updateRegistro("cmx_importacion_seguimiento", $array, (int)$id_seguimiento);
							} else {
								print_r("No se copia el archivo \n");
							}

							// Se elimina el archivo temporal
							unlink($archivo_temporal);
						} else {
							print_r("No se copia el archivo temporal \n");
						}
					} else {
						print_r("No se debe guardar el archivo en el entregable de la solicitud\n");
					}
				}
			}
			break;

		case 'seguimiento_cliente':
			print_r("Entro en tipo de actividad seguimiento_cliente\n");

			if ($_POST["seguimiento"]) {
				// Se toma la fecha actual para poner la fecha inicial de la siguinete actividad
				$tiempo_actual = $ahora["year"] . "-" . $ahora["mon"] . "-" . $ahora["mday"] . " " . $ahora["hours"] . ":" . $ahora["minutes"] . ":" . $ahora["seconds"];
				$arrayId_actividad = explode(",", $_POST["id"]);
				// Se actualiza las actividades realcionadas al material 
				for ($i = 0; $i < (count($arrayId_actividad) - 1); $i++) {
					// Se guarda la información del material de la importación en el material de la solucion
					$arraySeguimiento = array();
					$arraySeguimiento["id_actividad"] = $arrayId_actividad[$i];
					$arraySeguimiento["observacion"] = $_POST["seguimiento"];
					$arraySeguimiento["fecha_hora"] = $tiempo_actual;
					$arraySeguimiento["autor"] = $_POST["id_usuario"];
					$id_seguimiento = $Data->setRegistro("cmx_importacion_seguimiento", $arraySeguimiento);
					// print_r($resul_1);

					if ($_FILES["url_entregable"]["name"] and !$_flag_sube_archivo) {
						print_r("Se debe guardar el archivo en el entregable de la solicitud\n");
						// Se copia el archivo en una carpeta temporal 
						$tmp_file = $_FILES["url_entregable"]["tmp_name"];
						$extension = get_extension_archivo($_FILES["url_entregable"]["name"]);
						$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
						if (move_uploaded_file($tmp_file, $archivo_temporal)) {
							// print_r("Se copia el archivo temporal \n");

							$archivo = $id_seguimiento . "-" . time() . "." . $extension;

							$carpeta_destino = "../public/files/importaciones/seguimiento/" . $arraySeguimiento["id_actividad"];
							if (!file_exists($carpeta_destino)) {
								mkdir($carpeta_destino, 0777, true);
								// print_r("Si se pudo crear la carpeta \n");
							}

							$archivo_destino = $archivo;
							$destino = $carpeta_destino . "/" . $archivo_destino;

							if (copy($archivo_temporal, $destino)) {
								print_r("Se copia el archivo \n");

								// Se crea los datos del archivo del seguimiento 
								$array = array();
								$array["url"] = $archivo;

								// Se guarda la informacion del entregable de segumineto en la base de datos 
								$resul = $Data->updateRegistro("cmx_importacion_seguimiento", $array, (int)$id_seguimiento);
							} else {
								print_r("No se copia el archivo \n");
							}

							// Se elimina el archivo temporal
							unlink($archivo_temporal);
						} else {
							print_r("No se copia el archivo temporal \n");
						}
					} else {
						print_r("No se debe guardar el archivo en el entregable de la solicitud\n");
					}
				}
			}
			break;

		case 'seguimiento_ruta':
			print_r("Entro en tipo de actividad seguimiento_ruta\n");

			// Se toma la fecha actual para poner la fecha inicial de la siguinete actividad
			$tiempo_actual = $ahora["year"] . "-" . $ahora["mon"] . "-" . $ahora["mday"] . " " . $ahora["hours"] . ":" . $ahora["minutes"] . ":" . $ahora["seconds"];

			$arrayId_actividad = explode(",", $_POST["id"]);
			// Se actualiza las actividades realcionadas al material 
			for ($i = 0; $i < (count($arrayId_actividad) - 1); $i++) {
				// Se guarda la información del material de la importación en el material de la solucion
				$arraySeguimientoRuta = array();
				$arraySeguimientoRuta["id_actividad"] = $arrayId_actividad[$i];
				$arraySeguimientoRuta["tipo_seguimiento_ruta"] = $_POST["tipo_seguimiento_ruta"];
				$arraySeguimientoRuta["observacion"] = $_POST["seguimiento"];
				$arraySeguimientoRuta["observacion_interna"] = $_POST["seguimiento_interno"];
				$arraySeguimientoRuta["latitud"] = $_POST["latitud"];
				$arraySeguimientoRuta["longitud"] = $_POST["longitud"];
				$arraySeguimientoRuta["ubicacion"] = $_POST["ubicacion"];
				$arraySeguimientoRuta["fecha_hora"] = $tiempo_actual;
				$resul_1 = $Data->setRegistro("cmx_importacion_seguimiento_rutas", $arraySeguimientoRuta);
				// print_r($resul_1);
			}
			break;

		case 'intr_oferta_comercial':
			// print_r("Entro en tipo de actividad intr_oferta_comercial\n");

			// $arrayId_actividad_fecha = explode(",", $_POST["id"]);
			// // Se actualiza las actividades realcionadas al material 
			// for ($i = 0; $i < (count($arrayId_actividad_fecha) - 1); $i++) {

			// 	// Se busca el id del prroyecto internacional 
			// 	$sql = '
			// 			SELECT 
			// 				cis.id
			// 			FROM 
			// 				cmx_importacion_actividades cia
			// 				INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cia.id_importacion
			// 			WHERE 
			// 				cia.id = ' . $arrayId_actividad_fecha[$i] . '
			// 		';
			// 	$resul = $Data->getConsulta($sql);
			// 	// print_r($sql . "\n");
			// 	// print_r($resul);

			// 	if ($resul) {
			// 		$id_intr_protecto = $resul["rowsData"][0][0];

			// 		// Se busca las ofertas comerciales anteriores 
			// 		$sql = '
			// 				SELECT 
			// 					cioc.id
			// 				FROM 
			// 					cmx_intr_oferta_comercial cioc
			// 				WHERE 
			// 					cioc.id_intr_proyecto = ' . $id_intr_protecto . '
			// 			';
			// 		$resul = $Data->getConsulta($sql);
			// 		// print_r($sql . "\n");
			// 		// print_r($resul);

			// 		// Si existen ofertas comerciales se anulan 
			// 		if ($resul) {
			// 			foreach ($resul["rowsData"] as $key => $value) {
			// 				$array = array();
			// 				$array["estado"] = 0;
			// 				$Data->updateRegistro("cmx_intr_oferta_comercial", $array, (int)$value[0]);
			// 				// print_r($resul);
			// 			}
			// 		}

			// 		// Se guarda la información de la nueva oferta comercial
			// 		$array = array();
			// 		$array["id_intr_proyecto"] = $id_intr_protecto;
			// 		$array["fecha"] = $_POST["fecha_oferta"];
			// 		$array["id_moneda"] = $_POST["moneda_oferta"];
			// 		$array["valor"] = (float)str_replace(",", ".", str_replace(".", "", $_POST["valor_oferta"]));
			// 		$id_oferta_comercial = $Data->setRegistro("cmx_intr_oferta_comercial", $array);

			// 		// Se genera la información del archivo de la oferta comercial
			// 		// Se saca el nombre del archivo de la cotización 
			// 		$file = $_FILES["url_oferta"];
			// 		$extension = get_extension_archivo($file["name"]);

			// 		$archivo = $id_intr_protecto . "-" . $id_oferta_comercial . "-" . $_POST["fecha_oferta"] . "." . $extension;

			// 		// Se actualiza el dato del archivo de la oferta comercial
			// 		$array = array();
			// 		$array["url"] = $archivo;
			// 		$Data->updateRegistro("cmx_intr_oferta_comercial", $array, (int)$id_oferta_comercial);

			// 		// Se guarda el archivo en el servidor 
			// 		if ($file["error"] == 0) {
			// 			$tmp_file = $file["tmp_name"];
			// 			$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
			// 			if (move_uploaded_file($tmp_file, $archivo_temporal)) {
			// 				// Se crean las carpetas de destino del archivo
			// 				$carpeta_destino = "../public/files/internacional/oferta_comercial/" . $id_intr_protecto;
			// 				if (!file_exists($carpeta_destino)) {
			// 					mkdir($carpeta_destino, 0777, true);
			// 					// print_r("Si se pudo crear la carpeta \n");
			// 				}

			// 				$destino = $carpeta_destino . "/" . $archivo;

			// 				if (copy($archivo_temporal, $destino)) {
			// 					$return["copy_file_result"] = true;
			// 				} else {
			// 					$return["copy_file_result"] = false;
			// 				}
			// 			}
			// 			if (file_exists($archivo_temporal)) {
			// 				unlink($archivo_temporal);
			// 			}
			// 		} else {
			// 			$return["copy_file_result"] = false;
			// 		}
			// 		// print_r($return);
			// 	}
			// }

			print_r("Entro en tipo de actividad intr_oferta_comercial\n");

			$arrayId_actividad_fecha = explode(",", $_POST["id"]);

			for ($i = 0; $i < (count($arrayId_actividad_fecha) - 1); $i++) {
				$id_actividad = $arrayId_actividad_fecha[$i];

				// Obtener el id del proyecto internacional
				$sql = "SELECT cis.id 
                FROM cmx_importacion_actividades cia
                INNER JOIN cmx_intr_solicitudes cis ON cis.id_proyecto = cia.id_importacion
                WHERE cia.id = :id_actividad";
				$stmt = $PDO->prepare($sql);
				$stmt->bindParam(":id_actividad", $id_actividad, PDO::PARAM_INT);
				$stmt->execute();
				$resul = $stmt->fetch();

				if ($resul) {
					$id_intr_proyecto = $resul["id"];

					// Buscar ofertas comerciales anteriores
					$sql = "SELECT id FROM cmx_intr_oferta_comercial WHERE id_intr_proyecto = :id_intr_proyecto";
					$stmt = $PDO->prepare($sql);
					$stmt->bindParam(":id_intr_proyecto", $id_intr_proyecto, PDO::PARAM_INT);
					$stmt->execute();
					$ofertas = $stmt->fetchAll();

					// Anular ofertas comerciales anteriores
					if ($ofertas) {
						foreach ($ofertas as $oferta) {
							$sql = "UPDATE cmx_intr_oferta_comercial SET estado = 0 WHERE id = :id_oferta";
							$stmt = $PDO->prepare($sql);
							$stmt->bindParam(":id_oferta", $oferta["id"], PDO::PARAM_INT);
							$stmt->execute();
						}
					}

					// Insertar nueva oferta comercial
					$sql = "INSERT INTO cmx_intr_oferta_comercial (id_intr_proyecto, fecha, id_moneda, valor) 
                    VALUES (:id_intr_proyecto, :fecha, :id_moneda, :valor)";
					$stmt = $PDO->prepare($sql);
					$stmt->bindParam(":id_intr_proyecto", $id_intr_proyecto, PDO::PARAM_INT);
					$stmt->bindParam(":fecha", $_POST["fecha_oferta"]);
					$stmt->bindParam(":id_moneda", $_POST["moneda_oferta"], PDO::PARAM_INT);
					$valor = (float)str_replace(",", ".", str_replace(".", "", $_POST["valor_oferta"]));
					$stmt->bindParam(":valor", $valor);
					$stmt->execute();
					$id_oferta_comercial = $PDO->lastInsertId();

					// Procesar archivo adjunto
					$file = $_FILES["url_oferta"];
					if ($file["error"] == 0) {
						$extension = pathinfo($file["name"], PATHINFO_EXTENSION);
						$archivo = "{$id_intr_proyecto}-{$id_oferta_comercial}-{$_POST['fecha_oferta']}.$extension";

						// Actualizar la URL en la BD
						$sql = "UPDATE cmx_intr_oferta_comercial SET url = :archivo WHERE id = :id_oferta_comercial";
						$stmt = $PDO->prepare($sql);
						$stmt->bindParam(":archivo", $archivo);
						$stmt->bindParam(":id_oferta_comercial", $id_oferta_comercial, PDO::PARAM_INT);
						$stmt->execute();

						// Mover archivo al servidor
						$tmp_file = $file["tmp_name"];
						$archivo_temporal = "../public/files/tmp/tmp_file.$extension";

						if (move_uploaded_file($tmp_file, $archivo_temporal)) {
							$carpeta_destino = "../public/files/internacional/oferta_comercial/$id_intr_proyecto";

							if (!file_exists($carpeta_destino)) {
								mkdir($carpeta_destino, 0777, true);
							}

							$destino = "$carpeta_destino/$archivo";

							if (copy($archivo_temporal, $destino)) {
								$return["copy_file_result"] = true;
							} else {
								$return["copy_file_result"] = false;
							}

							unlink($archivo_temporal);
						} else {
							$return["copy_file_result"] = false;
						}
					} else {
						$return["copy_file_result"] = false;
					}
				}
			}
			break;

		default:
			print_r("Tipo de actividad genérica\n");
			break;
	}
}

function get_extension_archivo($nombre_archivo)
{
	$archivo = explode(".", $nombre_archivo);
	return ($archivo[count($archivo) - 1]);
}
