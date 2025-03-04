<?php


include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';
include '../models/clientesModel.php';
// configuracion de la zona horaria
date_default_timezone_set('America/Bogota');

$_msg_error = "";
$_msg_control = "\nIngreso al archivo importaciones.php\n";

$return["post"] = $_POST;
$return["get"] = $_GET;
$return["file"] = $_FILES;

$Data = new Consultas;
$Data2 = new Conexion;
$Clientes = new clientesModel;

// Tomo la fecha actual
$fecha_actual = getdate();
$time = time();
$conectar = $Data2->conectar();

switch ($_GET["action"]) {
	
	case 'insertar_nacional':
		$_msg_control .= "Entro en insertar_nacional\n";
		$numero_importacion = time();

		$arrayProyecto = array();
		if (!isset($_POST["id_contrato"]) or $_POST["id_contrato"] != "otro") {
			$arrayProyecto["id_contrato"] = $_POST["id_contrato"];
		}
		$arrayProyecto["importacion"] = trim($_POST["importacion"]);
		$arrayProyecto["numero_importacion"] = $numero_importacion;
		$arrayProyecto["rndc_material"] = $_POST["id_rndc_material"];
		$arrayProyecto["tipo_operacion"] = $_POST["tipo_operacion"];
		$arrayProyecto["id_cliente"] = $_POST["id_cliente"];
		$arrayProyecto["id_tipo_carga"] = $_POST["id_tipo_carga"];
		$arrayProyecto["descripcion"] = trim($_POST["descripcion_proyecto"]);
		$arrayProyecto["estado"] = 1;
		if ($arrayProyecto["id_tipo_carga"] == 1) {
			$arrayProyecto["tipo_contenedor"] = $_POST["tipo_contenedor_1"];
			$arrayProyecto["contenedor"] = trim($_POST["contenedor_1"]);
			if (isset($_POST["devolucion_1"])) {
				$arrayProyecto["devolucion"] = $_POST["devolucion_1"];
			}
		}
		// Se guarda la informacion del proyecto en la base de datos 
		$id_proyecto = $Data->setRegistro("cmx_importacion_proyecto", $arrayProyecto);

		if ($id_proyecto) {
			// Se adiciona el Contrato
			if (isset($_POST["id_contrato"]) and $_POST["id_contrato"] == "otro") {
				$cod_contrato = 'CTR-' . time();

				$array_valor = explode(",", $_POST["valor_contrato"]);
				$_valor = str_replace(".", "", $array_valor[0]);

				$array = array(
					'cod_contrato' => $cod_contrato,
					'id_cliente' => $_POST["id_cliente"],
					'tipo_contrato' => $_POST["tipo_contrato"],
					'valor' => $_valor,
					'fecha_inicio' => $_POST["inicio_contrato"],
					'fecha_fin' => $_POST["fin_contrato"]
				);
				$result = $Data->setRegistro("cmx_contrato_cliente", $array);

				if ($result) {
					$array = array(
						'id_contrato' => $result,
					);
					$result_01 = $Data->updateRegistro("cmx_importacion_proyecto", $array, $id_proyecto);
				}
			}

			// Se verifica si existen contenedores dentro de proyecto
			if ($arrayProyecto["id_tipo_carga"] == 1) {
				if ($_POST["cant_contenedores"] > 0) {
					for ($i = 1; $i <= $_POST["cant_contenedores"]; $i++) {
						$arrayContenedores = array();
						$arrayContenedores["id_proyecto"] = $id_proyecto;
						$arrayContenedores["tipo_contenedor"] = $_POST["tipo_contenedor_" . $i];
						$arrayContenedores["contenedor"] = $_POST["contenedor_" . $i];
						if (isset($_POST["devolucion_" . $i])) {
							$tmp_file = $_FILES["url_comodato_" . $i]["tmp_name"];
							$extension = $Clientes->get_extension_archivo($_FILES["url_comodato_" . $i]["name"]);
							$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
							if (move_uploaded_file($tmp_file, $archivo_temporal)) {
								// Se crean las carpetas de destino del archivo
								$carpeta_destino = "../public/files/importaciones/contenedores";
								if (!file_exists($carpeta_destino)) {
									mkdir($carpeta_destino, 0777, true);
									// print_r("Si se pudo crear la carpeta\n");
								}

								$contenedor = "CNT-" . time();
								$archivo_destino = $contenedor . "." . $extension;
								$destino = $carpeta_destino . "/" . $archivo_destino;
								if (copy($archivo_temporal, $destino)) {
									$arrayContenedores["devolucion"] = $_POST["devolucion_" . $i];
									$arrayContenedores["fecha_devolucion"] = $_POST["devolucion_contenedor_" . $i];
									$arrayContenedores["fecha_comodato"] = $_POST["fecha_comodato_" . $i];
									$arrayContenedores["url_comodato"] = $archivo_destino;
									$arrayContenedores["numero_remesa"] = $contenedor;
								}
							}
							if (file_exists($archivo_temporal)) {
								unlink($archivo_temporal);
							}
						}
						// Se guarda la informacion de los contenedores  
						$resul = $Data->setRegistro("cmx_importacion_contenedores", $arrayContenedores);
					}
				}
			}
		} else {
			$_msg_error .= '<p>Problemas al crear el contrato...</p>';
		}
		break;

	// case 'insertar_internacional':
	// 	$_msg_control .= "Entro en insertar_internacional\n";
	// 	$numero_importacion = time();

	// 	// Se guarda la información del proyecto
	// 	$arrayProyecto = [];
	// 	$arrayProyecto["importacion"] = trim($_POST["importacion"]);
	// 	$arrayProyecto["numero_importacion"] = $numero_importacion;
	// 	$arrayProyecto["tipo_operacion"] = $_POST["tipo_operacion"];
	// 	$arrayProyecto["id_cliente"] = $_POST["id_cliente"];
	// 	$arrayProyecto["id_tipo_carga"] = $_POST["id_tipo_carga"];
	// 	$arrayProyecto["descripcion"] = trim($_POST["descripcion_proyecto"]);
	// 	$arrayProyecto["estado"] = 1;
	// 	// Se pregunta si el proyecto tiene contenedor por registrar
	// 	if ($arrayProyecto["id_tipo_carga"] == 1) {
	// 		$arrayProyecto["tipo_contenedor"] = $_POST["tipo_contenedor_1"];
	// 		$arrayProyecto["contenedor"] = trim($_POST["contenedor_1"]);
	// 		if (isset($_POST["devolucion_1"])) {
	// 			$arrayProyecto["devolucion"] = $_POST["devolucion_1"];
	// 		}
	// 	}
	// 	// Se busca el origen del proyecto
	// 	$_flag_tramo = true;
	// 	$i = 0;
	// 	do {
	// 		$i++;
	// 		if (isset($_POST["tipo_tramo_" . $i]) and isset($_POST["rem_dest_" . $i])) {
	// 			if ($_POST["tipo_tramo_" . $i] == "Cargue") {
	// 				$arrayProyecto["id_origen"] = $_POST["rem_dest_" . $i];
	// 				$_flag_tramo = false;
	// 			}
	// 		} else {
	// 			$_flag_tramo = false;
	// 		}
	// 	} while ($_flag_tramo);

	// 	// Se guarda la información del proyecto en la base de datos 
	// 	$id_proyecto = $Data->setRegistro("cmx_importacion_proyecto", $arrayProyecto);
	// 	$return["arrayProyecto"] = $arrayProyecto;

	// 	// Se verifica si existen contenedores dentro de proyecto
	// 	if ($arrayProyecto["id_tipo_carga"] == 1) {
	// 		if ($_POST["cant_contenedores"] > 0) {
	// 			for ($i = 1; $i <= $_POST["cant_contenedores"]; $i++) {
	// 				$arrayContenedores = [];
	// 				$arrayContenedores["id_proyecto"] = $id_proyecto;
	// 				$arrayContenedores["tipo_contenedor"] = $_POST["tipo_contenedor_" . $i];
	// 				$arrayContenedores["contenedor"] = trim($_POST["contenedor_" . $i]);
	// 				if (isset($_POST["devolucion_" . $i])) {
	// 					$arrayContenedores["devolucion"] = $_POST["devolucion_" . $i];
	// 				}

	// 				// Se guarda la información de los contenedores en la base de datos 
	// 				$Data->setRegistro("cmx_importacion_contenedores", $arrayContenedores);
	// 				$return["arrayContenedores"][$i] = $arrayContenedores;
	// 			}
	// 		}
	// 	}

	// 	// Se guarda la información del proyecto internacional en la base de datos
	// 	$arrayIntrSolicitud = [];
	// 	$arrayIntrSolicitud["id_proyecto"] = $id_proyecto;
	// 	$arrayIntrSolicitud["tipo_transporte"] = $_POST["tipo_transporte"];
	// 	$arrayIntrSolicitud["incoterm"] = $_POST["incoterm"];

	// 	// Si se registra el valor declara del material 
	// 	if (isset($_POST["valor_declarado"]) and isset($_POST["id_moneda"])) {
	// 		$arrayIntrSolicitud["valor_declarado"] = (float) str_replace(",", ".", str_replace(".", "", $_POST["valor_declarado"]));
	// 		$arrayIntrSolicitud["id_moneda"] = (int) $_POST["id_moneda"];
	// 	}

	// 	// Se pregunta si se diligencia el campo comodin 
	// 	if (isset($_POST["intr_comodin_facturacion"]) and $_POST["intr_comodin_facturacion"] != "") {
	// 		$arrayIntrSolicitud["comodin_facturacion"] = trim($_POST["intr_comodin_facturacion"]);
	// 	}

	// 	// Se guarda la informacion del proyecto inrternacional en la base de datos 
	// 	$id_intr_proyecto = $Data->setRegistro("cmx_intr_solicitudes", $arrayIntrSolicitud);
	// 	// $return["arrayIntrSolicitud"] = $arrayIntrSolicitud;

	// 	// Se guarda la información de los tramos del proyecto internacional
	// 	$_flag_tramo = true;
	// 	$i = 0;
	// 	do {
	// 		$i++;
	// 		if (isset($_POST["tipo_tramo_" . $i]) and isset($_POST["rem_dest_" . $i])) {
	// 			$arrayTramo = [];
	// 			$arrayTramo["id_intr_proyecto"] = $id_intr_proyecto;
	// 			$arrayTramo["id_remitente_destinatario"] = $_POST["rem_dest_" . $i];
	// 			$arrayTramo["tipo_tramo"] = $_POST["tipo_tramo_" . $i];

	// 			// Se guarda la informacion de los tramos del proyecto inrternacional en la base de datos 
	// 			$Data->setRegistro("cmx_intr_tramos", $arrayTramo);
	// 			// $return["arrayTramo"][$i] = $arrayTramo;
	// 		} else {
	// 			$_flag_tramo = false;
	// 		}
	// 	} while ($_flag_tramo);
	// 	break;

	case 'insertar_internacional':
		$_msg_control .= "Entro en insertar_internacional\n";
		$numero_importacion = time();

		// Se guarda la información del proyecto
		$arrayProyecto = [];
		$arrayProyecto["importacion"] = trim($_POST["importacion"] ?? '');
		$arrayProyecto["numero_importacion"] = $numero_importacion;
		$arrayProyecto["tipo_operacion"] = $_POST["tipo_operacion"] ?? '';
		$arrayProyecto["id_cliente"] = (int) ($_POST["id_cliente"] ?? 0);
		$arrayProyecto["id_tipo_carga"] = (int) ($_POST["id_tipo_carga"] ?? 0);
		$arrayProyecto["descripcion"] = trim($_POST["descripcion_proyecto"] ?? '');
		$arrayProyecto["estado"] = 1;

		// Manejo de contenedores principales
		if ($arrayProyecto["id_tipo_carga"] == 1) {
			$arrayProyecto["tipo_contenedor"] = $_POST["tipo_contenedor_1"] ?? '';
			$arrayProyecto["contenedor"] = trim($_POST["contenedor_1"] ?? '');
			if (isset($_POST["devolucion_1"])) {
				$arrayProyecto["devolucion"] = (int) $_POST["devolucion_1"];
			}
		}

		// Búsqueda de origen mejorada
		$_flag_tramo = true;
		$i = 0;
		while ($_flag_tramo) {
			$i++;
			$tipo_tramo = $_POST["tipo_tramo_" . $i] ?? null;
			$rem_dest = $_POST["rem_dest_" . $i] ?? null;

			if ($tipo_tramo && $rem_dest) {
				if ($tipo_tramo === "Cargue") {
					$arrayProyecto["id_origen"] = (int) $rem_dest;
					$_flag_tramo = false;
				}
			} else {
				$_flag_tramo = false;
			}
		}

		// Guardar proyecto
		$id_proyecto = $Data->setRegistro("cmx_importacion_proyecto", $arrayProyecto);
		$return["arrayProyecto"] = $arrayProyecto;

		// Manejo de contenedores adicionales
		if ($arrayProyecto["id_tipo_carga"] == 1) {
			$cant_contenedores = (int) ($_POST["cant_contenedores"] ?? 0);
			if ($cant_contenedores > 0) {
				for ($i = 1; $i <= $cant_contenedores; $i++) {
					$arrayContenedores = [
						"id_proyecto" => $id_proyecto,
						"tipo_contenedor" => $_POST["tipo_contenedor_" . $i] ?? '',
						"contenedor" => trim($_POST["contenedor_" . $i] ?? ''),
						"devolucion" => isset($_POST["devolucion_" . $i]) ? (int) $_POST["devolucion_" . $i] : null
					];

					$Data->setRegistro("cmx_importacion_contenedores", $arrayContenedores);
					$return["arrayContenedores"][$i] = $arrayContenedores;
				}
			}
		}

		// Proyecto internacional
		$arrayIntrSolicitud = [
			"id_proyecto" => $id_proyecto,
			"tipo_transporte" => $_POST["tipo_transporte"] ?? '',
			"incoterm" => $_POST["incoterm"] ?? ''
		];

		if (isset($_POST["valor_declarado"], $_POST["id_moneda"])) {
			$valor = str_replace([',', '.'], ['', '.'], $_POST["valor_declarado"]);
			$arrayIntrSolicitud["valor_declarado"] = (float) $valor;
			$arrayIntrSolicitud["id_moneda"] = (int) $_POST["id_moneda"];
		}

		if (!empty($_POST["intr_comodin_facturacion"])) {
			$arrayIntrSolicitud["comodin_facturacion"] = trim($_POST["intr_comodin_facturacion"]);
		}

		$id_intr_proyecto = $Data->setRegistro("cmx_intr_solicitudes", $arrayIntrSolicitud);

		// Tramos internacionales
		$i = 0;
		while (true) {
			$i++;
			$tipo_tramo = $_POST["tipo_tramo_" . $i] ?? null;
			$rem_dest = $_POST["rem_dest_" . $i] ?? null;

			if (!$tipo_tramo || !$rem_dest)
				break;

			$arrayTramo = [
				"id_intr_proyecto" => $id_intr_proyecto,
				"id_remitente_destinatario" => (int) $rem_dest,
				"tipo_tramo" => $tipo_tramo
			];

			$Data->setRegistro("cmx_intr_tramos", $arrayTramo);
		}
		break;

	// case 'actividades_proyecto':
	// 	$_msg_control .= "Entro en actividades_proyecto\n";

	// 	$sql = 'SELECT MAX(id) FROM cmx_importacion_proyecto';
	// 	// $respuesta = $Data->getConsulta($sql);
	// 	$sqlrespuesta = $conectar->prepare($sql);
	// 	$sqlrespuesta->execute();
	// 	$respuesta = $sqlrespuesta->fetch(PDO::FETCH_ASSOC);

	// 	$arrayActividadProyecto = [];
	// 	$arrayActividadProyecto["id_importacion"] = $respuesta;
	// 	$arrayActividadProyecto["nombre"] = $_POST["nombre"];
	// 	$arrayActividadProyecto["descripcion"] = $_POST["descripcion"];
	// 	$arrayActividadProyecto["actividad_previa"] = $_POST["actividad_previa"];
	// 	$arrayActividadProyecto["orden"] = $_POST["orden"];
	// 	$arrayActividadProyecto["documentos"] = $_POST["documentos"];
	// 	$arrayActividadProyecto["tiempo_aprobado"] = $_POST["tiempo_aprobado"];
	// 	$arrayActividadProyecto["costo_aprobado"] = $_POST["costo_aprobado"];
	// 	$arrayActividadProyecto["moneda"] = $_POST["moneda"];
	// 	$arrayActividadProyecto["perfil_responsable"] = $_POST["perfil_responsable"];
	// 	$arrayActividadProyecto["integracion"] = $_POST["integracion"];
	// 	$arrayActividadProyecto["sub_integracion"] = $_POST["sub_integracion"];
	// 	$arrayActividadProyecto["tipo_actividad"] = $_POST["tipo_actividad"];
	// 	$arrayActividadProyecto["adjunto"] = $_POST["adjunto"];
	// 	$arrayActividadProyecto["fecha_creacion"] = $fecha_actual["year"] . "-" . $fecha_actual["mon"] . "-" . $fecha_actual["mday"] . " " . $fecha_actual["hours"] . ":" . $fecha_actual["minutes"] . ":" . $fecha_actual["seconds"];

	// 	if ($_POST["id_centro_costo"] != 0) {
	// 		$arrayActividadProyecto["id_centro_costo"] = $_POST["id_centro_costo"];
	// 	}
	// 	$arrayActividadProyecto["bloque"] = $_POST["bloque"];
	// 	$arrayActividadProyecto["simultaneo"] = $_POST["simultaneo"];
	// 	$arrayActividadProyecto["grupo"] = $_POST["grupo"];
	// 	$arrayActividadProyecto["urbaneo"] = $_POST["urbaneo"];
	// 	$return["arrayActividad"] = $arrayActividadProyecto;

	// 	// Se guarda la informacion del proyecto en la base de datos 
	// 	$resul = $Data->setRegistro("cmx_importacion_actividades", $arrayActividadProyecto);
	// 	// print_r($resul);
	// 	break;

	// case 'actividades_proyecto':
	// 	$_msg_control .= "Entro en actividades_proyecto\n";

	// 	try {
	// 		// Obtener MAX(id)
	// 		$sql = 'SELECT MAX(id) as max_id FROM cmx_importacion_proyecto';
	// 		$stmt = $conectar->prepare($sql);
	// 		$stmt->execute();
	// 		$respuesta = $stmt->fetch(PDO::FETCH_ASSOC);

	// 		$id_importacion = $respuesta['max_id'] ?? 0;

	// 		// Preparar array de datos
	// 		$arrayActividadProyecto = [
	// 			":id_importacion" => $id_importacion,
	// 			":nombre" => $_POST["nombre"],
	// 			":descripcion" => $_POST["descripcion"],
	// 			":actividad_previa" => $_POST["actividad_previa"],
	// 			":orden" => $_POST["orden"],
	// 			":documentos" => $_POST["documentos"],
	// 			":tiempo_aprobado" => $_POST["tiempo_aprobado"],
	// 			":costo_aprobado" => $_POST["costo_aprobado"],
	// 			":moneda" => $_POST["moneda"],
	// 			":perfil_responsable" => $_POST["perfil_responsable"],
	// 			":integracion" => $_POST["integracion"],
	// 			":sub_integracion" => $_POST["sub_integracion"],
	// 			":tipo_actividad" => $_POST["tipo_actividad"],
	// 			":adjunto" => $_POST["adjunto"],
	// 			":fecha_creacion" => date('Y-m-d H:i:s'),  // Usamos date() directamente
	// 			":bloque" => $_POST["bloque"],
	// 			":simultaneo" => $_POST["simultaneo"],
	// 			":grupo" => $_POST["grupo"],
	// 			":urbaneo" => $_POST["urbaneo"] ?? 0
	// 		];

	// 		// Manejar campo opcional
	// 		if ($_POST["id_centro_costo"] != 0) {
	// 			$arrayActividadProyecto[":id_centro_costo"] = $_POST["id_centro_costo"];
	// 			$centro_costo_field = ", id_centro_costo";
	// 			$centro_costo_value = ", :id_centro_costo";
	// 		} else {
	// 			$centro_costo_field = "";
	// 			$centro_costo_value = "";
	// 		}

	// 		// Construir SQL
	// 		$sql = "INSERT INTO cmx_importacion_actividades (
	//                   id_importacion, nombre, descripcion, actividad_previa, orden, 
	//                   documentos, tiempo_aprobado, costo_aprobado, moneda, 
	//                   perfil_responsable, integracion, sub_integracion, 
	//                   tipo_actividad, adjunto, fecha_creacion, bloque, 
	//                   simultaneo, grupo, urbaneo $centro_costo_field
	//               ) VALUES (
	//                   :id_importacion, :nombre, :descripcion, :actividad_previa, :orden, 
	//                   :documentos, :tiempo_aprobado, :costo_aprobado, :moneda, 
	//                   :perfil_responsable, :integracion, :sub_integracion, 
	//                   :tipo_actividad, :adjunto, :fecha_creacion, :bloque, 
	//                   :simultaneo, :grupo, :urbaneo $centro_costo_value
	//               )";

	// 		// Ejecutar inserción
	// 		$stmt = $conectar->prepare($sql);
	// 		$resultado = $stmt->execute($arrayActividadProyecto);

	// 		// Verificar resultado
	// 		if ($resultado) {
	// 			$return['success'] = true;
	// 			$return['message'] = "Registro insertado correctamente";
	// 			$return['lastInsertId'] = $conectar->lastInsertId();
	// 		} else {
	// 			$error = $stmt->errorInfo();
	// 			throw new Exception("Error al insertar: " . $error[2]);
	// 		}

	// 	} catch (Exception $e) {
	// 		$return['success'] = false;
	// 		$return['message'] = "Error: " . $e->getMessage();
	// 	}

	// 	$return["arrayActividad"] = $arrayActividadProyecto;
	// 	break;

	case 'actividades_proyecto':
		$_msg_control .= "Entro en actividades_proyecto\n";

		try {
			// Obtener MAX(id)
			$sql = 'SELECT MAX(id) as max_id FROM cmx_importacion_proyecto';
			$stmt = $conectar->prepare($sql);
			$stmt->execute();
			$respuesta = $stmt->fetch(PDO::FETCH_ASSOC);

			$id_importacion = $respuesta['max_id'] ?? 0;

			// Validar y asignar el valor de urbaneo
			$urbaneo = isset($_POST["urbaneo"]) && is_numeric($_POST["urbaneo"]) ? (int) $_POST["urbaneo"] : 0;

			// Preparar array de datos
			$arrayActividadProyecto = [
				":id_importacion" => $id_importacion,
				":nombre" => $_POST["nombre"],
				":descripcion" => $_POST["descripcion"],
				":actividad_previa" => $_POST["actividad_previa"],
				":orden" => $_POST["orden"],
				":documentos" => $_POST["documentos"],
				":tiempo_aprobado" => $_POST["tiempo_aprobado"],
				":costo_aprobado" => $_POST["costo_aprobado"],
				":moneda" => $_POST["moneda"],
				":perfil_responsable" => $_POST["perfil_responsable"],
				":integracion" => $_POST["integracion"],
				":sub_integracion" => $_POST["sub_integracion"],
				":tipo_actividad" => $_POST["tipo_actividad"],
				":adjunto" => $_POST["adjunto"],
				":fecha_creacion" => date('Y-m-d H:i:s'),  // Usamos date() directamente
				":bloque" => $_POST["bloque"],
				":simultaneo" => $_POST["simultaneo"],
				":grupo" => $_POST["grupo"],
				":urbaneo" => $urbaneo
			];

			// Manejar campo opcional
			if ($_POST["id_centro_costo"] != 0) {
				$arrayActividadProyecto[":id_centro_costo"] = $_POST["id_centro_costo"];
				$centro_costo_field = ", id_centro_costo";
				$centro_costo_value = ", :id_centro_costo";
			} else {
				$centro_costo_field = "";
				$centro_costo_value = "";
			}

			// Construir SQL
			$sql = "INSERT INTO cmx_importacion_actividades (
                id_importacion, nombre, descripcion, actividad_previa, orden, 
                documentos, tiempo_aprobado, costo_aprobado, moneda, 
                perfil_responsable, integracion, sub_integracion, 
                tipo_actividad, adjunto, fecha_creacion, bloque, 
                simultaneo, grupo, urbaneo $centro_costo_field
            ) VALUES (
                :id_importacion, :nombre, :descripcion, :actividad_previa, :orden, 
                :documentos, :tiempo_aprobado, :costo_aprobado, :moneda, 
                :perfil_responsable, :integracion, :sub_integracion, 
                :tipo_actividad, :adjunto, :fecha_creacion, :bloque, 
                :simultaneo, :grupo, :urbaneo $centro_costo_value
            )";

			// Ejecutar inserción
			$stmt = $conectar->prepare($sql);
			$resultado = $stmt->execute($arrayActividadProyecto);

			// Verificar resultado
			if ($resultado) {
				$return['success'] = true;
				$return['message'] = "Registro insertado correctamente";
				$return['lastInsertId'] = $conectar->lastInsertId();
			} else {
				$error = $stmt->errorInfo();
				throw new Exception("Error al insertar: " . $error[2]);
			}

		} catch (Exception $e) {
			$return['success'] = false;
			$return['message'] = "Error: " . $e->getMessage();
		}

		$return["arrayActividad"] = $arrayActividadProyecto;
		break;

	case 'sube_contrato':
		$_msg_control .= "Entro en sube_contrato\n";

		$sql = '
				SELECT cip.id, cc.documento
				FROM cmx_importacion_proyecto cip
					INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
				HAVING cip.id = (SELECT MAX(cip1.id) FROM cmx_importacion_proyecto cip1)
			';
		$result = $Data->getConsulta($sql);
		$id_proyecto = $result["rowsData"][0][0];
		$documento = $result["rowsData"][0][1];

		$sql = '
				SELECT ccc.id, ccc.cod_contrato  FROM cmx_contrato_cliente ccc
				HAVING ccc.id = (SELECT MAX(ccc1.id) FROM cmx_contrato_cliente ccc1)
			';
		$result = $Data->getConsulta($sql);
		$contrato = $result["rowsData"][0];
		$id_contrato = $contrato[0];
		$num_contrato = $contrato[1];

		$tmp_file = $_FILES["url"]["tmp_name"];
		$extension = $Clientes->get_extension_archivo($_FILES["url"]["name"]);
		$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
		if (move_uploaded_file($tmp_file, $archivo_temporal)) {
			// Se crean las carpetas de destino del archivo
			$carpeta_destino = "../public/files/clientes/" . $documento . "/contratos";
			if (!file_exists($carpeta_destino)) {
				mkdir($carpeta_destino, 0777, true);
				// print_r("Si se pudo crear la carpeta\n");
			}

			$archivo_destino = $num_contrato . "." . $extension;
			$destino = $carpeta_destino . "/" . $archivo_destino;
			if (copy($archivo_temporal, $destino)) {
				// Se actualiza la url del contrato
				$array = array(
					'url' => $archivo_destino
				);
				$result = $Data->updateRegistro("cmx_contrato_cliente", $array, $id_contrato);

				// Se adicionan los origenes 
				$array_origenes = explode(",", $_POST["origenes"]);
				if (count($array_origenes) > 0) {
					foreach ($array_origenes as $value) {
						$array = array(
							'id_contrato' => $id_contrato,
							'id_ciudad' => $value,
							'tipo_tramo' => "Cargue"
						);
						$array_origenes_1[] = $array;
						$Data->setRegistro("cmx_contrato_tramos", $array);
					}
				}

				// Se adicionan los destinos 
				$array_destinos = explode(",", $_POST["destinos"]);
				if (count($array_destinos) > 0) {
					foreach ($array_destinos as $value) {
						$array = array(
							'id_contrato' => $id_contrato,
							'id_ciudad' => $value,
							'tipo_tramo' => "Descargue"
						);
						$array_destinos_1[] = $array;
						$Data->setRegistro("cmx_contrato_tramos", $array);
					}
				}

				// Se adicionan los vehículos
				$array_vehiculos = explode(",", $_POST["tipos_vehiculo"]);
				if (count($array_vehiculos) > 0) {
					foreach ($array_vehiculos as $value) {
						$array = array(
							'id_contrato' => $id_contrato,
							'id_vehiculo' => $value,
						);
						$array_vehiculos_1[] = $array;
						$Data->setRegistro("cmx_contrato_vehiculo", $array);
					}
				}

				// Se adicionan las condiciones
				if (isset($_POST["id_condiciones"])) {
					$array_condiciones = explode(",", $_POST["id_condiciones"]);
					if (count($array_condiciones) > 0) {
						foreach ($array_condiciones as $value) {
							if ($value) {
								$array = array(
									'id_contrato' => $id_contrato,
									'id_condicion' => $value,
									'descripcion' => trim($_POST["condicion_" . $value]),
								);
								$array_condiciones_1[] = $array;
								$Data->setRegistro("cmx_contrato_condiciones", $array);
							}
						}
					}
				}
			}
		}
		if (file_exists($archivo_temporal)) {
			unlink($archivo_temporal);
		}
		break;

	case 'verifica_archivo':
		$_msg_control .= "Entro en verifica_archivo\n";

		$linea = 0;
		//Abrimos nuestro archivo
		$archivo = fopen($_FILES["url_entregable"]["tmp_name"], "r");
		//Lo recorremos
		while (($datos = fgetcsv($archivo, ",")) == true) {
			$num = count($datos);
			$linea++;
			//Recorremos las columnas de esa linea
			for ($columna = 0; $columna > $num; $columna++) {
				$_msg_error .= $datos[$columna] . "\n";
			}
		}
		//Cerramos el archivo
		fclose($archivo);
		$return["lineas"] = $linea;
		break;

	case 'sube_material':
		$_msg_control .= "Entro en sube_material\n";
		$contenidoValido = false;

		if (isset($_FILES)) {
			$arrayFileName = explode(".", $_FILES["url_entregable"]["name"]);

			if ($arrayFileName[count($arrayFileName) - 1] == "csv") {
				$_msg_control .= "Formato de archivo válido...\n";
				ini_set('max_execution_time', 240);

				$table = "cmx_importacion_material";
				$ruta = BASE_URL . "public/files/";
				$columnasArchivo = 8;
				$_registro_exitoso = 0;
				$_count_row = 0;
				$archivoValido = true;

				// Se recorre el archivo 
				foreach ($_FILES as $key) {
					$nombre = $key["name"];
					$ruta_temporal = $key["tmp_name"];

					$x = 0;
					$info = array();
					$data = array();

					$archivo = file_get_contents($ruta_temporal);
					$archivo = ucfirst($archivo);

					// se verifica la separacion del archivo si es por , o por ;
					$_verifica_comas = substr_count($archivo, ";");
					if ($_verifica_comas == 0) {
						$arrayArchivo = explode(",", $archivo);
					} else {
						$arrayArchivo = explode(";", $archivo);
					}

					$i = 0;
					foreach ($arrayArchivo as $datos) {
						$i++;
						$data[$i - 1] = $datos;
						if ($i == $columnasArchivo) {
							$_count_row++;

							$arrayUltimaColumna = explode("\n", $datos);

							$data[$i - 1] = $arrayUltimaColumna[0];
							$i = 1;

							$x++;
							if ($x > 1) {
								// Se verifica si la fila tiene datos, si no tiene la ignora
								$flagFila = false;
								for ($j = 0; $j < $columnasArchivo; $j++) {
									if (limpiaTexto($data[$j]) != "") {
										$flagFila = true;
										break;
									}
								}

								if ($flagFila) {
									// arreglo para la tabla material bodega
									// valido contentido de los campos 
									// campo codigo
									if (limpiaTexto($data[0]) != "") {
										// campo Nombre Material
										if (limpiaTexto($data[1]) != "") {
											// campo Cantidad
											if (limpiaTexto($data[2]) != "" and limpiaTexto($data[2]) > 0) {
												// campo Peso Bruto
												if (limpiaTexto($data[3]) != "") {
													// campo Peso Neto
													if (limpiaTexto($data[4]) != "") {
														// valido que el peso bruto sea mayor que el peso neto
														if (limpiaTexto($data[3]) > limpiaTexto($data[4])) {
															// campo Código UN
															if (limpiaTexto($data[5]) != "") {
																// campo Rombos
																if (limpiaTexto($data[6]) != "") {
																	// campo Valor Declarado 
																	if (limpiaTexto($data[7]) != "") {
																		if (validaNumero($data[3])) {
																			if (validaNumero($data[4])) {
																				$info[$_count_row] = array(
																					"id_importacion" => $_POST["id_importacion"],
																					"codigo" => limpiaNumero(limpiaTexto($data[0])),
																					"nombre" => limpiaTexto(utf8_encode($data[1])),
																					"cantidad" => limpiaNumero(limpiaTexto($data[2])),
																					"peso_bruto" => limpiaNumero(limpiaTexto($data[3])),
																					"peso_neto" => limpiaNumero(limpiaTexto($data[4])),
																					"codigoUN" => limpiaNumero(limpiaTexto($data[5])),
																					"rombos" => limpiaNumero(limpiaTexto($data[6])),
																					"valor_declarado" => limpiaNumero(limpiaTexto($data[7]))
																				);
																			} else {
																				$archivoValido = false;
																				$_msg_error .= "<p><strong>Error en fila $_count_row:</strong> El formato de número de la columna \"Peso Neto\" no es válido por favor elimine los puntos separadores de miles, si el peso tiene decimales relaciónelos con una coma.</p>";
																			}
																		} else {
																			$archivoValido = false;
																			$_msg_error .= "<p><strong>Error en fila $_count_row:</strong> El formato de número de la columna \"Peso Bruto\" no es válido por favor elimine los puntos separadores de miles, si el peso tiene decimales relaciónelos con una coma.</p>";
																		}
																	} else {
																		$archivoValido = false;
																		$_msg_error .= "<p><strong>Error en fila $_count_row:</strong> La columna \"Valor Declarado\" está vacía.</p>";
																	}
																} else {
																	$archivoValido = false;
																	$_msg_error .= "<p><strong>Error en fila $_count_row:</strong> La columna \"Valor Declarado\" está vacía.</p>";
																}
															} else {
																$archivoValido = false;
																$_msg_error .= "<p><strong>Error en fila $_count_row:</strong> La columna \"Rombos\" está vacía.</p>";
															}
														} else {
															$archivoValido = false;
															$_msg_error .= "<p><strong>Error en fila $_count_row:</strong> El \"Peso Neto\" no puede ser mayor que el \"Peso Bruto\".</p>";
														}
													} else {
														$archivoValido = false;
														$_msg_error .= "<p><strong>Error en fila $_count_row:</strong> La columna \"Peso Neto\" está vacía.</p>";
													}
												} else {
													$archivoValido = false;
													$_msg_error .= "<p><strong>Error en fila $_count_row:</strong> La columna \"Peso Bruto\" está vacía.</p>";
												}
											} else {
												$archivoValido = false;
												$_msg_error .= "<p><strong>Error en fila $_count_row:</strong> La columna \"Cantidad\" está vacía o la cantidad es 0.</p>";
											}
										} else {
											$archivoValido = false;
											$_msg_error .= "<p><strong>Error en fila $_count_row:</strong> La columna \"Nombre Material\" está vacía.</p>";
										}
									} else {
										$archivoValido = false;
										$_msg_error .= "<p><strong>Error en fila $_count_row:</strong> La columna \"Código\" está vacía.</p>";
									}
								}
							}

							// se asigna el valor del primer registro de la siguinete fila
							$data[$i - 1] = $arrayUltimaColumna[1];
						}
					}
				}
				// print_r($info);
				// print_r("\n");

				// Si el archivo es correcto puede verificar si la informacion no se encuentra en la base de datos 
				if ($archivoValido) {
					$contenidoValido = true;
					$_msg_control .= "Archivo diligenciado correctamente\n";

					// Busco las actividades del proyecto de importacion
					$sql = '
							SELECT 
								cia.*
							FROM 
								cmx_importacion_actividades cia
							WHERE
								cia.id_importacion = ' . $_POST["id_importacion"] . '
						';
					$arrayActividades = $Data->getConsulta($sql);
					// print_r($arrayActividades);
					// print_r("\n");

					foreach ($info as $key1 => $value1) {
						$Data->setRegistro($table, $value1);

						// Se busca el id del material recien creado
						$sql = '
								SELECT 
									MAX(cim.id) ID_MATERIAL_IMPORTACION
								FROM 
									cmx_importacion_material cim
								WHERE 
									cim.id_importacion = ' . $_POST["id_importacion"] . ';
							';
						$arrayMaterial = $Data->getConsulta($sql);
						// print_r($arrayMaterial);
						// print_r("\n");

						foreach ($arrayActividades["rowsData"] as $key2 => $value2) {
							$arrayActividadesMaterial = array();
							$arrayActividadesMaterial["nombre"] = $value2["nombre"];
							$arrayActividadesMaterial["descripcion"] = $value2["descripcion"];
							$arrayActividadesMaterial["id_importacion"] = $value2["id_importacion"];
							$arrayActividadesMaterial["id_material"] = $arrayMaterial["rowsData"][0][0];
							$arrayActividadesMaterial["id_centro_costo"] = $value2["id_centro_costo"];
							$arrayActividadesMaterial["documentos"] = $value2["documentos"];
							$arrayActividadesMaterial["orden"] = $value2["orden"];
							$arrayActividadesMaterial["actividad_previa"] = $value2["actividad_previa"];
							$arrayActividadesMaterial["bloque"] = $value2["bloque"];
							$arrayActividadesMaterial["simultaneo"] = $value2["simultaneo"];
							$arrayActividadesMaterial["grupo"] = $value2["grupo"];
							$arrayActividadesMaterial["urbaneo"] = $value2["urbaneo"];
							$arrayActividadesMaterial["perfil_responsable"] = $value2["perfil_responsable"];
							$arrayActividadesMaterial["respuesta"] = $value2["respuesta"];
							$arrayActividadesMaterial["tiempo_aprobado"] = $value2["tiempo_aprobado"];
							$arrayActividadesMaterial["tiempo_real"] = $value2["tiempo_real"];
							$arrayActividadesMaterial["costo_aprobado"] = $value2["costo_aprobado"];
							$arrayActividadesMaterial["costo_real"] = $value2["costo_real"];
							$arrayActividadesMaterial["moneda"] = $value2["moneda"];
							$arrayActividadesMaterial["planeador"] = $value2["planeador"];
							$arrayActividadesMaterial["ejecutor"] = $value2["ejecutor"];
							$arrayActividadesMaterial["fecha_creacion"] = $value2["fecha_creacion"];
							$arrayActividadesMaterial["fecha_hora_inicio"] = $value2["fecha_hora_inicio"];
							$arrayActividadesMaterial["fecha_hora_finalizacion"] = $value2["fecha_hora_finalizacion"];
							$arrayActividadesMaterial["notificado"] = $value2["notificado"];
							$arrayActividadesMaterial["adjunto"] = $value2["adjunto"];
							$arrayActividadesMaterial["integracion"] = $value2["integracion"];
							$arrayActividadesMaterial["sub_integracion"] = $value2["sub_integracion"];
							$arrayActividadesMaterial["tipo_actividad"] = $value2["tipo_actividad"];
							$arrayActividadesMaterial["estado"] = $value2["estado"];
							// print_r($arrayActividadesMaterial);
							// print_r("\n");

							$Data->setRegistro("cmx_importacion_actividades", $arrayActividadesMaterial);

							// Se toma el id de la nueva actividad creada 
							$sql = '
									SELECT 
										MAX(cia.id)
									FROM 
										cmx_importacion_actividades cia;
								';
							$respuesta22 = $Data->getConsulta($sql);

							/****** Se busca si la actividad está integrada a soluciones ******/
							$sql = '
									SELECT 
										cisi.*
									FROM 
										cmx_integracion_soluc_import cisi
									WHERE 
										cisi.id_importacion_actividad = ' . $value2["id"] . '
								;';
							$respuesta21 = $Data->getConsulta($sql);

							// Se pregunta si existe la actividad integrada a Soluciones
							if ($respuesta21["rowsNum"] > 0) {
								foreach ($respuesta21["rowsData"] as $key21 => $value21) {
									$arrayIntegracion["id_solucion"] = $value21["id_solucion"];
									$arrayIntegracion["id_importacion_actividad"] = $respuesta22["rowsData"][0][0];
									$arrayIntegracion["bloque"] = $value21["bloque"];
									$arrayIntegracion["estado"] = $value21["estado"];

									// Se guarda la informacion de la inegracion de la actividad en la base de datos 
									$resul = $Data->setRegistro("cmx_integracion_soluc_import", $arrayIntegracion);
								}
							}
							/****** FIN Se busca si la actividad está integrada a soluciones ******/

							/******* SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE APLAZAMIENTOS *******/
							$sql = '
									SELECT 
										*
									FROM 
										cmx_importacion_aplazamientos ciap
									WHERE 
										ciap.id_actividad = ' . $value2["id"] . '
								;';
							$respuesta3 = $Data->getConsulta($sql);

							if ($respuesta3["rowsNum"] > 0) {
								$_msg_control .= "La actividad SI tiene aplazamientos\n";
								foreach ($respuesta3["rowsData"] as $key3 => $value3) {
									// Se pregunta si el aplazamiento tiene entregables adjuntos 
									$nom_archivo = "";
									if ($value3["url"]) {
										// Se incrementa el límite de ejecucion para este script
										ini_set('max_execution_time', 600);

										$arrayExtension = explode(".", $value3["url"]);
										$extension = $arrayExtension[1];

										$arrayNombre = explode("-", $value3["url"]);
										$nombre = $arrayNombre[0];

										// Se da el nombre al nuevo archivo
										$nom_archivo = $nombre . "-" . $respuesta22["rowsData"][0][0] . "." . $extension;

										// definimos la URL del archivo a descargar
										$archivo_antiguo = "../public/files/importaciones/aplazamientos/" . $value3["id_actividad"] . "/" . $value3["url"];
										// Leemos el archivo remoto
										$archivo_temporal = file_get_contents($archivo_antiguo) or die("No se puede leer el archivo remoto");


										$carpeta_destino = "../public/files/importaciones/aplazamientos/" . $respuesta22["rowsData"][0][0];
										if (!file_exists($carpeta_destino)) {
											mkdir($carpeta_destino, 0777, true);
											// print_r("Si se pudo crear la carpeta\n");
										}

										// Se copia el nuevo archivo 
										file_put_contents($carpeta_destino . "/" . $nom_archivo, $archivo_temporal) or die("No se puede escribir el archivo local");
									}
									// Se guarda el registro en la base de datos
									$arrayAplazamiento = array();
									$arrayAplazamiento["id_actividad"] = $respuesta22["rowsData"][0][0];
									$arrayAplazamiento["id_justificacion"] = $value3["id_justificacion"];
									$arrayAplazamiento["url"] = $nom_archivo;
									$arrayAplazamiento["causa"] = $value3["causa"];
									$arrayAplazamiento["fecha_hora_aplazamiento"] = $value3["fecha_hora_aplazamiento"];
									$arrayAplazamiento["estado"] = $value3["estado"];
									// Se guarda la informacion de aplazamientos de la actividad en la base de datos 
									$resul = $Data->setRegistro("cmx_importacion_aplazamientos", $arrayAplazamiento);
								}
							}
							/******* FIN SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE APLAZAMIENTOS *******/

							/******* SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE ENTREGABLES *******/
							$sql = '
									SELECT 
										*
									FROM 
										cmx_importacion_entregables cie
									WHERE 
										cie.id_actividad = ' . $value2["id"] . '
								;';
							$respuesta4 = $Data->getConsulta($sql);

							if ($respuesta4["rowsNum"] > 0) {
								$_msg_control .= "La actividad SI tiene entregables\n";
								foreach ($respuesta4["rowsData"] as $key4 => $value4) {
									// Se pregunta si el aplazamiento tiene entregables adjuntos 
									$nom_archivo = "";
									if ($value4["url"]) {
										// Se incrementa el límite de ejecucion para este script
										ini_set('max_execution_time', 600);

										$arrayExtension = explode(".", $value4["url"]);
										$extension = $arrayExtension[1];

										$arrayNombre = explode("-", $value4["url"]);
										$nombre = $arrayNombre[0];

										// Se da el nombre al nuevo archivo
										$nom_archivo = $nombre . "-" . $respuesta22["rowsData"][0][0] . "." . $extension;

										// definimos la URL del archivo a descargar
										$archivo_antiguo = "../public/files/importaciones/entregables/" . $value4["id_actividad"] . "/" . $value4["url"];
										// Leemos el archivo remoto
										$archivo_temporal = file_get_contents($archivo_antiguo) or die("No se puede leer el archivo remoto");


										$carpeta_destino = "../public/files/importaciones/entregables/" . $respuesta22["rowsData"][0][0];
										if (!file_exists($carpeta_destino)) {
											mkdir($carpeta_destino, 0777, true);
											// print_r("Si se pudo crear la carpeta\n");
										}
										// Se copia el nuevo archivo 
										file_put_contents($carpeta_destino . "/" . $nom_archivo, $archivo_temporal) or die("No se puede escribir el archivo local");
									}

									// Se guarda el registro en la base de datos
									$arrayEntregables = array();
									$arrayEntregables["id_actividad"] = $respuesta22["rowsData"][0][0];
									$arrayEntregables["url"] = $nom_archivo;
									$arrayEntregables["fecha"] = $value4["fecha"];
									$arrayEntregables["fecha_subida"] = $value4["fecha_subida"];
									$arrayEntregables["estado"] = $value4["estado"];
									// Se guarda la informacion de aplazamientos de la actividad en la base de datos 
									$resul = $Data->setRegistro("cmx_importacion_entregables", $arrayEntregables);
								}
							}
							/******* FIN SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE ENTREGABLES *******/

							/******* SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE SEGUIMIENTOS *******/
							$sql = '
									SELECT 
										*
									FROM 
										cmx_importacion_seguimiento cis
									WHERE 
										cis.id_actividad = ' . $value2["id"] . '
								;';
							$respuesta5 = $Data->getConsulta($sql);

							if ($respuesta5["rowsNum"] > 0) {
								$_msg_control .= "La actividad SI tiene seguimientos\n";
								foreach ($respuesta5["rowsData"] as $key5 => $value5) {
									// Se guarda el registro en la base de datos
									$arraySeguimientos = array();
									$arraySeguimientos["id_actividad"] = $respuesta22["rowsData"][0][0];
									$arraySeguimientos["observacion"] = $value5["observacion"];
									$arraySeguimientos["observacion_interna"] = $value5["observacion_interna"];
									$arraySeguimientos["fecha_hora"] = $value5["fecha_hora"];
									$arraySeguimientos["estado"] = $value5["estado"];
									// Se guarda la informacion de aplazamientos de la actividad en la base de datos 
									$resul = $Data->setRegistro("cmx_importacion_seguimiento", $arraySeguimientos);
								}
							}
							/******* FIN SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE SEGUIMIENTOS *******/

							/******* SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE OBSERVACIONES DE MATERIAL *******/
							$sql = '
									SELECT 
										*
									FROM 
										cmx_importacion_obsevacion_material ciom
									WHERE 
										ciom.id_actividad = ' . $value2["id"] . '
								;';
							$respuesta6 = $Data->getConsulta($sql);

							if ($respuesta6["rowsNum"] > 0) {
								$sql = '
										SELECT 
											cia.id_material
										FROM 
											cmx_importacion_actividades cia
										WHERE 
											cia.id = ' . $respuesta22["rowsData"][0][0] . '
									;';
								$respuesta61 = $Data->getConsulta($sql);

								$_msg_control .= "La actividad SI tiene observaciones de matrerial\n";
								foreach ($respuesta6["rowsData"] as $key6 => $value6) {
									// Se guarda el registro en la base de datos
									$arrayObservacionMaterial = array();
									$arrayObservacionMaterial["id_actividad"] = $respuesta22["rowsData"][0][0];
									$arrayObservacionMaterial["id_material"] = $respuesta61["rowsData"][0][0];
									$arrayObservacionMaterial["observacion"] = $value6["observacion"];
									$arrayObservacionMaterial["estado"] = $value6["estado"];
									// Se guarda la informacion de aplazamientos de la actividad en la base de datos 
									$resul = $Data->setRegistro("cmx_importacion_obsevacion_material", $arrayObservacionMaterial);
								}
							}
							/******* FIN SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE OBSERVACIONES DE MATERIAL *******/

							/******* SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE IMAGENES DE ACTIVIDAD *******/
							$sql = '
									SELECT 
										*
									FROM 
										cmx_importacion_imagen_actividad ciia
									WHERE 
										ciia.id_actividad = ' . $value2["id"] . '
								;';
							$respuesta7 = $Data->getConsulta($sql);

							if ($respuesta7["rowsNum"] > 0) {
								$_msg_control .= "La actividad SI tiene imágenes de actividad\n";
								foreach ($respuesta7["rowsData"] as $key7 => $value7) {
									// Se pregunta si el aplazamiento tiene entregables adjuntos 
									$nom_archivo = "";
									if ($value7["url"]) {
										// Se incrementa el límite de ejecucion para este script
										ini_set('max_execution_time', 600);

										// Se da el nombre al nuevo archivo
										$nom_archivo = $value7["url"];

										// definimos la URL del archivo a descargar
										$archivo_antiguo = "../public/files/importaciones/verificacion/" . $value7["id_actividad"] . "/" . $value7["url"];
										// Leemos el archivo remoto
										$archivo_temporal = file_get_contents($archivo_antiguo) or die("No se puede leer el archivo remoto");

										$carpeta_destino = "../public/files/importaciones/verificacion/" . $respuesta22["rowsData"][0][0];
										if (!file_exists($carpeta_destino)) {
											mkdir($carpeta_destino, 0777, true);
											// print_r("Si se pudo crear la carpeta\n");
										}
										// Se copia el nuevo archivo 
										file_put_contents($carpeta_destino . "/" . $nom_archivo, $archivo_temporal) or die("No se puede escribir el archivo local");
									}

									// Se guarda el registro en la base de datos
									$arrayImagenActividad = array();
									$arrayImagenActividad["id_actividad"] = $respuesta22["rowsData"][0][0];
									$arrayImagenActividad["url"] = $nom_archivo;
									$arrayImagenActividad["estado"] = $value7["estado"];
									// Se guarda la informacion de aplazamientos de la actividad en la base de datos 
									$resul = $Data->setRegistro("cmx_importacion_imagen_actividad", $arrayImagenActividad);
								}
							}
							/******* FIN SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE IMAGENES DE ACTIVIDAD *******/
						}
						$_registro_exitoso++;

					}
					// Se actualizan las actividades que no tienen material asignado para evitar inconvenientes con la gestion de las demás actividades con material
					$sql = '
							SELECT 
								cia.id
							FROM 
								cmx_importacion_actividades cia
							WHERE 
								cia.id_importacion = ' . $_POST["id_importacion"] . '
								AND cia.id_material IS NULL
						;';
					$respuesta8 = $Data->getConsulta($sql);
					// $_msg_control.= "\n" . $sql . "\n";
					$arrayEstadoActividadSinMaterial = array();
					$arrayEstadoActividadSinMaterial["estado"] = 1;
					foreach ($respuesta8["rowsData"] as $key10 => $value10) {
						$result = $Data->updateRegistro("cmx_importacion_actividades", $arrayEstadoActividadSinMaterial, $value10["id"]);
					}
					// FIN Se actualizan las actividades que no tienen material asignado

					// Se actualiza el estado del proyecto
					$arrayImportacion = array();
					$arrayImportacion["estado"] = 1;
					$result = $Data->updateRegistro("cmx_importacion_proyecto", $arrayImportacion, $_POST["id_importacion"]);
				} else {
					$_msg_error .= "<p>Archivo no diligenciado correctamente.</p>";
				}
			} else {
				$_msg_error .= "<p>Formato de archivo no válido.</p>";
			}
		} else {
			$_msg_error .= "<p>No Hay archivo.</p>";
		}
		break;

	case 'desconsolidar':
		$_msg_control .= "Entro en desconsolidar\n";

		$materiales = explode(",", $_POST["id_materiales"]);
		for ($i = 0; $i < (count($materiales) - 1); $i++) {
			$sql = '
					SELECT 
						cim.*
					FROM 
						cmx_importacion_material cim
					WHERE 
						cim.id = ' . $materiales[$i] . '
						AND cim.id_importacion = ' . $_POST["id_importacion"] . '
				;';
			// $_msg_control.= $sql . "\n";
			$respuesta = $Data->getConsulta($sql);

			// Se filtra el valor de la cantidad solicitada dependiendo el origen de la solicitud 
			if (isset($_GET["origen"]) && $_GET["origen"] == "agrupaciones") {
				$cantidad_solicitada = $_POST["cantidad_solicitada_"][$materiales[$i]];
			} else {
				$cantidad_solicitada = $_POST["cantidad_solicitada_" . $materiales[$i]];
			}

			foreach ($respuesta["rowsData"] as $key => $value) {
				if ($value["cantidad"] != $cantidad_solicitada) {
					$_msg_control .= "Se desconsolida parcial de la carga\n";

					// se actualiza el material restante
					$arrayMaterialResidual = array();
					$arrayMaterialResidual["cantidad"] = $value["cantidad"] - $cantidad_solicitada;
					$arrayMaterialResidual["valor_declarado"] = $value["valor_declarado"] - (($cantidad_solicitada * $value["valor_declarado"]) / $value["cantidad"]);
					$arrayMaterialResidual["peso_bruto"] = $value["peso_bruto"] - (($cantidad_solicitada * $value["peso_bruto"]) / $value["cantidad"]);
					$arrayMaterialResidual["peso_neto"] = $value["peso_neto"] - (($cantidad_solicitada * $value["peso_neto"]) / $value["cantidad"]);

					$result = $Data->updateRegistro("cmx_importacion_material", $arrayMaterialResidual, $materiales[$i]);
					// $_msg_error.= $result . "\n";


					// Se crea registro del nuevo material con la cantidad solicitada 
					$arrayMaterialNuevo = array();
					$arrayMaterialNuevo["id_importacion"] = $_POST["id_importacion"];
					$arrayMaterialNuevo["codigo"] = $value["codigo"];
					$arrayMaterialNuevo["nombre"] = $value["nombre"];
					$arrayMaterialNuevo["codigoUN"] = $value["codigoUN"];
					$arrayMaterialNuevo["rombos"] = $value["rombos"];
					$arrayMaterialNuevo["valor_declarado"] = ($cantidad_solicitada * $value["valor_declarado"]) / $value["cantidad"];
					$arrayMaterialNuevo["cantidad"] = $cantidad_solicitada;
					$arrayMaterialNuevo["peso_bruto"] = ($cantidad_solicitada * $value["peso_bruto"]) / $value["cantidad"];
					$arrayMaterialNuevo["peso_neto"] = ($cantidad_solicitada * $value["peso_neto"]) / $value["cantidad"];
					$arrayMaterialNuevo["estado"] = $value["estado"];

					// Se guarda la informacion del nuevo material en la base de datos 
					$resul = $Data->setRegistro("cmx_importacion_material", $arrayMaterialNuevo);
					// $_msg_error.= $result . "\n";

					// Se busca el registro del nuevo material 
					$sql = '
							SELECT 
								MAX(cim.id)
							FROM 
								cmx_importacion_material cim
							WHERE 
								cim.id_importacion = ' . $_POST["id_importacion"] . ';
						';
					// $_msg_control.= $sql . "\n";
					$respuesta1 = $Data->getConsulta($sql);

					// Se buscan las actividades del para el nuevo material 
					$sql = '
							SELECT 
								cia.*
							FROM 
								cmx_importacion_material cim
								INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
							WHERE 
								cim.id = ' . $materiales[$i] . '
							ORDER BY cia.orden;
						';
					// $_msg_control.= $sql . "\n";
					$respuesta2 = $Data->getConsulta($sql);

					$actividad_siguiente = "";
					foreach ($respuesta2["rowsData"] as $key1 => $value1) {
						// Se gestiona la actividad del nuevo grupo de actividades si la peticion viene del módulo de agrupamiento 
						$estado_actividad = $value1["estado"];
						$tiempo_real = $value1["tiempo_real"];
						$fecha_hora_finalizacion = $value1["fecha_hora_finalizacion"];
						$fecha_hora_inicio = $value1["fecha_hora_inicio"];

						// Se gestiona la actividad del nuevo grupo de actividades si la peticion viene del módulo de agrupamiento 
						if (isset($_GET["origen"]) && $_GET["origen"] = "agrupaciones") {
							// Se pregunta si la actividad esta activa 
							if ($value1["estado"] == 2 and $value1["orden"] == $_POST["orden"]) {
								// Si esta activa se da por terminada
								$_msg_control .= "Se gestiona la actividad " . $value1["nombre"] . " por que la petición viene desde agrupaciones\n";

								// Tomo la fecha/hora de inicio de la actividad
								$fecha_inicial = strtotime($value1["fecha_hora_inicio"]);

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

								$tiempo_real = $tiempo_usado;
								$fecha_hora_finalizacion = $fecha_final_actividad;
								$estado_actividad = 1;

								$actividad_siguiente = $value1["orden"] + 1;

								// Se agrega el material agrupación de la solicitud
								if (isset($_POST["material_agrupacion"])) {
									$material_agrupacion = $_POST["material_agrupacion"];
									if (isset($_POST["desagrupa"])) {
										foreach ($material_agrupacion[$_POST["desagrupa"]] as $key => $value10) {
											if ($materiales[$i] == $value10["id_material_proyecto"]) {
												$arrayAgrupacionMaterial["id_material"] = $value10["id_material"];
												$arrayAgrupacionMaterial["id_material_proyecto"] = $respuesta1["rowsData"][0][0];
												$arrayAgrupacionMaterial["orden_actividad"] = actividadesBloque($value1["id"]);
												$arrayAgrupacionMaterial["id_agrupamiento"] = $value10["id_agrupacion"];
												$arrayAgrupacionMaterial["peso"] = $value10["peso"];
												$arrayAgrupacionMaterial["valor_declarado"] = $value10["valor_declarado"];
												$resul = $Data->setRegistro("cmx_agrupacion_material", $arrayAgrupacionMaterial);
											}
										}
									} else {
										$arrayAgrupacionMaterial["id_material"] = $material_agrupacion[$materiales[$i]]["id_material"];
										$arrayAgrupacionMaterial["id_material_proyecto"] = $respuesta1["rowsData"][0][0];
										$arrayAgrupacionMaterial["orden_actividad"] = actividadesBloque($value1["id"]);
										$arrayAgrupacionMaterial["id_agrupamiento"] = $material_agrupacion[$materiales[$i]]["id_agrupacion"];
										$arrayAgrupacionMaterial["peso"] = $material_agrupacion[$materiales[$i]]["peso"];
										$arrayAgrupacionMaterial["valor_declarado"] = $material_agrupacion[$materiales[$i]]["valor_declarado"];
										$resul = $Data->setRegistro("cmx_agrupacion_material", $arrayAgrupacionMaterial);
									}
								}
							}

							// Si es la actividad siguiente se inicia 
							if ($actividad_siguiente == $value1["orden"]) {
								$_msg_control .= "Se habilita la actividad " . $value1["nombre"] . " por que la petición viene desde agrupaciones\n";
								$fecha_hora_inicio = $fecha_final_actividad;
								$estado_actividad = 2;
							}
						}

						// Se crean las actividades del nuevo material
						$arrayActividadesMaterialNuevo = array();
						$arrayActividadesMaterialNuevo["nombre"] = $value1["nombre"];
						$arrayActividadesMaterialNuevo["descripcion"] = $value1["descripcion"];
						$arrayActividadesMaterialNuevo["id_importacion"] = $_POST["id_importacion"];
						$arrayActividadesMaterialNuevo["id_material"] = $respuesta1["rowsData"][0][0];
						$arrayActividadesMaterialNuevo["id_centro_costo"] = $value1["id_centro_costo"];
						$arrayActividadesMaterialNuevo["documentos"] = $value1["documentos"];
						$arrayActividadesMaterialNuevo["orden"] = $value1["orden"];
						$arrayActividadesMaterialNuevo["actividad_previa"] = $value1["actividad_previa"];
						$arrayActividadesMaterialNuevo["bloque"] = $value1["bloque"];
						$arrayActividadesMaterialNuevo["simultaneo"] = $value1["simultaneo"];
						$arrayActividadesMaterialNuevo["grupo"] = ($_POST["cant_grupos"] + 1);
						$arrayActividadesMaterialNuevo["urbaneo"] = $value1["urbaneo"];
						$arrayActividadesMaterialNuevo["perfil_responsable"] = $value1["perfil_responsable"];
						$arrayActividadesMaterialNuevo["respuesta"] = $value1["respuesta"];
						$arrayActividadesMaterialNuevo["tiempo_aprobado"] = $value1["tiempo_aprobado"];
						$arrayActividadesMaterialNuevo["tiempo_real"] = $tiempo_real;
						$arrayActividadesMaterialNuevo["costo_aprobado"] = $value1["costo_aprobado"];
						$arrayActividadesMaterialNuevo["costo_real"] = $value1["costo_real"];
						$arrayActividadesMaterialNuevo["moneda"] = $value1["moneda"];
						$arrayActividadesMaterialNuevo["planeador"] = $value1["planeador"];
						$arrayActividadesMaterialNuevo["ejecutor"] = $value1["ejecutor"];
						$arrayActividadesMaterialNuevo["fecha_creacion"] = $value1["fecha_creacion"];
						$arrayActividadesMaterialNuevo["fecha_hora_inicio"] = $fecha_hora_inicio;
						$arrayActividadesMaterialNuevo["fecha_hora_finalizacion"] = $fecha_hora_finalizacion;
						$arrayActividadesMaterialNuevo["notificado"] = $value1["notificado"];
						$arrayActividadesMaterialNuevo["adjunto"] = $value1["adjunto"];
						$arrayActividadesMaterialNuevo["integracion"] = $value1["integracion"];
						$arrayActividadesMaterialNuevo["sub_integracion"] = $value1["sub_integracion"];
						$arrayActividadesMaterialNuevo["tipo_actividad"] = $value1["tipo_actividad"];
						$arrayActividadesMaterialNuevo["estado"] = $estado_actividad;

						// Se guarda la informacion de las actividades del nuevo material en la base de datos 
						$resul = $Data->setRegistro("cmx_importacion_actividades", $arrayActividadesMaterialNuevo);

						// Se toma el id de la nueva actividad creada 
						$sql = '
								SELECT 
									MAX(cia.id)
								FROM 
									cmx_importacion_actividades cia;
							';
						$respuesta22 = $Data->getConsulta($sql);

						/****** Se busca si la actividad está integrada a soluciones ******/
						$sql = '
								SELECT 
									cisi.*
								FROM 
									cmx_integracion_soluc_import cisi
								WHERE 
									cisi.id_importacion_actividad = ' . $value1["id"] . '
							;';
						$respuesta21 = $Data->getConsulta($sql);

						// Se pregunta si existe la actividad integrada a Soluciones
						if ($respuesta21["rowsNum"] > 0) {
							foreach ($respuesta21["rowsData"] as $key21 => $value21) {
								$arrayIntegracion["id_solucion"] = $value21["id_solucion"];
								$arrayIntegracion["id_importacion_actividad"] = $respuesta22["rowsData"][0][0];
								$arrayIntegracion["bloque"] = $value21["bloque"];
								$arrayIntegracion["estado"] = $value21["estado"];

								// Se guarda la informacion de la inegracion de la actividad en la base de datos 
								$resul = $Data->setRegistro("cmx_integracion_soluc_import", $arrayIntegracion);
							}
						}
						/****** FIN Se busca si la actividad está integrada a soluciones ******/

						/******* SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE APLAZAMIENTOS *******/
						$sql = '
								SELECT 
									*
								FROM 
									cmx_importacion_aplazamientos ciap
								WHERE 
									ciap.id_actividad = ' . $value1["id"] . '
							;';
						$respuesta3 = $Data->getConsulta($sql);

						if ($respuesta3["rowsNum"] > 0) {
							$_msg_control .= "La actividad SI tiene aplazamientos\n";
							foreach ($respuesta3["rowsData"] as $key3 => $value3) {
								// Se pregunta si el aplazamiento tiene entregables adjuntos 
								$nom_archivo = "";
								if ($value3["url"]) {
									// Se incrementa el límite de ejecucion para este script
									ini_set('max_execution_time', 600);

									$arrayExtension = explode(".", $value3["url"]);
									$extension = $arrayExtension[1];

									$arrayNombre = explode("-", $value3["url"]);
									$nombre = $arrayNombre[0];

									// Se da el nombre al nuevo archivo
									$nom_archivo = $nombre . "-" . $respuesta22["rowsData"][0][0] . "." . $extension;

									// definimos la URL del archivo a descargar
									$archivo_antiguo = "../public/files/importaciones/aplazamientos/" . $value3["id_actividad"] . "/" . $value3["url"];
									// Leemos el archivo remoto
									$archivo_temporal = file_get_contents($archivo_antiguo) or die("No se puede leer el archivo remoto");


									$carpeta_destino = "../public/files/importaciones/aplazamientos/" . $respuesta22["rowsData"][0][0];
									if (!file_exists($carpeta_destino)) {
										mkdir($carpeta_destino, 0777, true);
										// print_r("Si se pudo crear la carpeta\n");
									}

									// Se copia el nuevo archivo 
									file_put_contents($carpeta_destino . "/" . $nom_archivo, $archivo_temporal) or die("No se puede escribir el archivo local");
								}
								// Se guarda el registro en la base de datos
								$arrayAplazamiento = array();
								$arrayAplazamiento["id_actividad"] = $respuesta22["rowsData"][0][0];
								$arrayAplazamiento["id_justificacion"] = $value3["id_justificacion"];
								$arrayAplazamiento["url"] = $nom_archivo;
								$arrayAplazamiento["causa"] = $value3["causa"];
								$arrayAplazamiento["fecha_hora_aplazamiento"] = $value3["fecha_hora_aplazamiento"];
								$arrayAplazamiento["estado"] = $value3["estado"];
								// Se guarda la informacion de aplazamientos de la actividad en la base de datos 
								$resul = $Data->setRegistro("cmx_importacion_aplazamientos", $arrayAplazamiento);
							}
						}
						/******* FIN SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE APLAZAMIENTOS *******/

						/******* SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE ENTREGABLES *******/
						$sql = '
								SELECT 
									*
								FROM 
									cmx_importacion_entregables cie
								WHERE 
									cie.id_actividad = ' . $value1["id"] . '
							;';
						$respuesta4 = $Data->getConsulta($sql);

						if ($respuesta4["rowsNum"] > 0) {
							$_msg_control .= "La actividad SI tiene entregables\n";
							foreach ($respuesta4["rowsData"] as $key4 => $value4) {
								// Se pregunta si el aplazamiento tiene entregables adjuntos 
								$nom_archivo = "";
								if ($value4["url"]) {
									// Se incrementa el límite de ejecucion para este script
									ini_set('max_execution_time', 600);

									$arrayExtension = explode(".", $value4["url"]);
									$extension = $arrayExtension[1];

									$arrayNombre = explode("-", $value4["url"]);
									$nombre = $arrayNombre[0];

									// Se da el nombre al nuevo archivo
									$nom_archivo = $nombre . "-" . $respuesta22["rowsData"][0][0] . "." . $extension;

									// definimos la URL del archivo a descargar
									$archivo_antiguo = "../public/files/importaciones/entregables/" . $value4["id_actividad"] . "/" . $value4["url"];
									// Leemos el archivo remoto
									$archivo_temporal = file_get_contents($archivo_antiguo) or die("No se puede leer el archivo remoto");


									$carpeta_destino = "../public/files/importaciones/entregables/" . $respuesta22["rowsData"][0][0];
									if (!file_exists($carpeta_destino)) {
										mkdir($carpeta_destino, 0777, true);
										// print_r("Si se pudo crear la carpeta\n");
									}
									// Se copia el nuevo archivo 
									file_put_contents($carpeta_destino . "/" . $nom_archivo, $archivo_temporal) or die("No se puede escribir el archivo local");
								}

								// Se guarda el registro en la base de datos
								$arrayEntregables = array();
								$arrayEntregables["id_actividad"] = $respuesta22["rowsData"][0][0];
								$arrayEntregables["url"] = $nom_archivo;
								$arrayEntregables["fecha"] = $value4["fecha"];
								$arrayEntregables["fecha_subida"] = $value4["fecha_subida"];
								$arrayEntregables["estado"] = $value4["estado"];
								// Se guarda la informacion de aplazamientos de la actividad en la base de datos 
								$resul = $Data->setRegistro("cmx_importacion_entregables", $arrayEntregables);
							}
						}
						/******* FIN SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE ENTREGABLES *******/

						/******* SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE SEGUIMIENTOS *******/
						$sql = '
								SELECT 
									*
								FROM 
									cmx_importacion_seguimiento cis
								WHERE 
									cis.id_actividad = ' . $value1["id"] . '
							;';
						$respuesta5 = $Data->getConsulta($sql);

						if ($respuesta5["rowsNum"] > 0) {
							$_msg_control .= "La actividad SI tiene seguimientos\n";
							foreach ($respuesta5["rowsData"] as $key5 => $value5) {
								// Se guarda el registro en la base de datos
								$arraySeguimientos = array();
								$arraySeguimientos["id_actividad"] = $respuesta22["rowsData"][0][0];
								$arraySeguimientos["observacion"] = $value5["observacion"];
								$arraySeguimientos["observacion_interna"] = $value5["observacion_interna"];
								$arraySeguimientos["fecha_hora"] = $value5["fecha_hora"];
								$arraySeguimientos["estado"] = $value5["estado"];
								// Se guarda la informacion de aplazamientos de la actividad en la base de datos 
								$resul = $Data->setRegistro("cmx_importacion_seguimiento", $arraySeguimientos);
							}
						}
						/******* FIN SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE SEGUIMIENTOS *******/

						/******* SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE OBSERVACIONES DE MATERIAL *******/
						$sql = '
								SELECT 
									*
								FROM 
									cmx_importacion_obsevacion_material ciom
								WHERE 
									ciom.id_actividad = ' . $value1["id"] . '
							;';
						$respuesta6 = $Data->getConsulta($sql);

						if ($respuesta6["rowsNum"] > 0) {
							$sql = '
									SELECT 
										cia.id_material
									FROM 
										cmx_importacion_actividades cia
									WHERE 
										cia.id = ' . $respuesta22["rowsData"][0][0] . '
								;';
							$respuesta61 = $Data->getConsulta($sql);

							$_msg_control .= "La actividad SI tiene observaciones de matrerial\n";
							foreach ($respuesta6["rowsData"] as $key6 => $value6) {
								// Se guarda el registro en la base de datos
								$arrayObservacionMaterial = array();
								$arrayObservacionMaterial["id_actividad"] = $respuesta22["rowsData"][0][0];
								$arrayObservacionMaterial["id_material"] = $respuesta61["rowsData"][0][0];
								$arrayObservacionMaterial["observacion"] = $value6["observacion"];
								$arrayObservacionMaterial["estado"] = $value6["estado"];
								// Se guarda la informacion de aplazamientos de la actividad en la base de datos 
								$resul = $Data->setRegistro("cmx_importacion_obsevacion_material", $arrayObservacionMaterial);
							}
						}
						/******* FIN SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE OBSERVACIONES DE MATERIAL *******/

						/******* SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE IMAGENES DE ACTIVIDAD *******/
						$sql = '
								SELECT 
									*
								FROM 
									cmx_importacion_imagen_actividad ciia
								WHERE 
									ciia.id_actividad = ' . $value1["id"] . '
							;';
						$respuesta7 = $Data->getConsulta($sql);

						if ($respuesta7["rowsNum"] > 0) {
							$_msg_control .= "La actividad SI tiene imágenes de actividad\n";
							foreach ($respuesta7["rowsData"] as $key7 => $value7) {
								// Se pregunta si el aplazamiento tiene entregables adjuntos 
								$nom_archivo = "";
								if ($value7["url"]) {
									// Se incrementa el límite de ejecucion para este script
									ini_set('max_execution_time', 600);

									// Se da el nombre al nuevo archivo
									$nom_archivo = $value7["url"];

									// definimos la URL del archivo a descargar
									$archivo_antiguo = "../public/files/importaciones/verificacion/" . $value7["id_actividad"] . "/" . $value7["url"];
									// Leemos el archivo remoto
									$archivo_temporal = file_get_contents($archivo_antiguo) or die("No se puede leer el archivo remoto");

									$carpeta_destino = "../public/files/importaciones/verificacion/" . $respuesta22["rowsData"][0][0];
									if (!file_exists($carpeta_destino)) {
										mkdir($carpeta_destino, 0777, true);
										// print_r("Si se pudo crear la carpeta\n");
									}
									// Se copia el nuevo archivo 
									file_put_contents($carpeta_destino . "/" . $nom_archivo, $archivo_temporal) or die("No se puede escribir el archivo local");
								}

								// Se guarda el registro en la base de datos
								$arrayImagenActividad = array();
								$arrayImagenActividad["id_actividad"] = $respuesta22["rowsData"][0][0];
								$arrayImagenActividad["url"] = $nom_archivo;
								$arrayImagenActividad["estado"] = $value7["estado"];
								// Se guarda la informacion de aplazamientos de la actividad en la base de datos 
								$resul = $Data->setRegistro("cmx_importacion_imagen_actividad", $arrayImagenActividad);
							}
						}
						/******* FIN SE PREGUNTA SI LA ACTIVIDAD ANTIGUA TIENE IMAGENES DE ACTIVIDAD *******/
					}
				} else {
					$_msg_control .= "Se desconsolida carga completa\n";

					$sql = '
							SELECT 
								cia.*
							FROM 
								cmx_importacion_actividades cia
							WHERE 
								cia.id_material = ' . $materiales[$i] . '
							ORDER BY cia.orden;
						';
					$respuesta3 = $Data->getConsulta($sql);

					$actividad_siguiente = "";
					foreach ($respuesta3["rowsData"] as $key3 => $value3) {
						// Se pregunta si se puede gestionar la actividad
						if (isset($_GET["flag_gestion"]) && $_GET["flag_gestion"]) {
							// Se gestiona la actividad del nuevo grupo de actividades si la peticion viene del módulo de agrupamiento
							$arrayMaterialDesconsolidado = array();
							if (isset($_GET["origen"]) && $_GET["origen"] = "agrupaciones") {
								// Se pregunta si la actividad esta activa 
								if ($value3["estado"] == 2 and $value3["orden"] == $_POST["orden"]) {
									// Si esta activa se da por terminada
									$_msg_control .= "Se gestiona la actividad " . $value3["nombre"] . " por que la peticón viene desde agrupaciones\n";

									// Tomo la fecha/hora de inicio de la actividad
									$fecha_inicial = strtotime($value3["fecha_hora_inicio"]);

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

									$arrayMaterialDesconsolidado["tiempo_real"] = $tiempo_usado;
									$arrayMaterialDesconsolidado["fecha_hora_finalizacion"] = $fecha_final_actividad;
									$arrayMaterialDesconsolidado["estado"] = 1;

									$actividad_siguiente = $value3["orden"] + 1;

									// Se agrega el material agrupación de la solicitud
									if (isset($_POST["material_agrupacion"])) {
										$material_agrupacion = $_POST["material_agrupacion"];
										if (isset($_POST["desagrupa"])) {
											foreach ($material_agrupacion[$_POST["desagrupa"]] as $key => $value10) {
												if ($materiales[$i] == $value10["id_material_proyecto"]) {
													$arrayAgrupacionMaterial["id_material"] = $value10["id_material"];
													$arrayAgrupacionMaterial["id_material_proyecto"] = $value10["id_material_proyecto"];
													$arrayAgrupacionMaterial["orden_actividad"] = actividadesBloque($value3["id"]);
													$arrayAgrupacionMaterial["id_agrupamiento"] = $value10["id_agrupacion"];
													$arrayAgrupacionMaterial["peso"] = $value10["peso"];
													$arrayAgrupacionMaterial["valor_declarado"] = $value10["valor_declarado"];
													$resul = $Data->setRegistro("cmx_agrupacion_material", $arrayAgrupacionMaterial);
												}
											}
										} else {
											// Pregunto si se han creado los materiales de la agrupación
											$sql = '
													SELECT 
														cam.id 
													FROM 
														cmx_agrupacion_material cam
													WHERE 
														cam.id_material = ' . $_POST["material_agrupacion"][$materiales[$i]]["id_material"] . '
														AND cam.id_material_proyecto = ' . $_POST["material_agrupacion"][$materiales[$i]]["id_material_proyecto"] . '
														AND cam.id_agrupamiento = ' . $_POST["material_agrupacion"][$materiales[$i]]["id_agrupacion"] . '
												;';
											$respuesta4 = $Data->getConsulta($sql);
											// Si no hay agrupación de materiales entonces se crea 
											if (!$respuesta4) {
												$arrayAgrupacionMaterial["id_material"] = $_POST["material_agrupacion"][$materiales[$i]]["id_material"];
												$arrayAgrupacionMaterial["id_material_proyecto"] = $_POST["material_agrupacion"][$materiales[$i]]["id_material_proyecto"];
												$arrayAgrupacionMaterial["orden_actividad"] = actividadesBloque($value3["id"]);
												$arrayAgrupacionMaterial["id_agrupamiento"] = $_POST["material_agrupacion"][$materiales[$i]]["id_agrupacion"];
												$arrayAgrupacionMaterial["peso"] = $_POST["material_agrupacion"][$materiales[$i]]["peso"];
												$arrayAgrupacionMaterial["valor_declarado"] = $_POST["material_agrupacion"][$materiales[$i]]["valor_declarado"];
												$resul = $Data->setRegistro("cmx_agrupacion_material", $arrayAgrupacionMaterial);
											}

										}
									}
								}

								// Si es la actividad siguiente se inicia 
								if ($actividad_siguiente == $value3["orden"]) {
									$_msg_control .= "Se habilita la actividad " . $value3["nombre"] . " por que la peticón viene desde agrupaciones\n";

									$arrayMaterialDesconsolidado["fecha_hora_inicio"] = $fecha_final_actividad;
									$arrayMaterialDesconsolidado["estado"] = 2;
								}
							}
						}
						// Se actualizan las actividades del grupo del material a desconsolidar
						$arrayMaterialDesconsolidado["grupo"] = ($_POST["cant_grupos"] + 1);
						$result = $Data->updateRegistro("cmx_importacion_actividades", $arrayMaterialDesconsolidado, $value3["id"]);
					}
				}
			}
		}
		break;

	case 'ajusta_intr_oferta_comercial':
		$_msg_control .= "Entro en ajusta_intr_oferta_comercial\n";

		$actividades = explode(",", $_POST["id"]);

		foreach ($actividades as $value) {
			if ($value) {
				$array = array();
				$array["tiempo_real"] = 0;
				$array["fecha_hora_finalizacion"] = NULL;
				$array["estado"] = 2;
				$Data->updateRegistro("cmx_importacion_actividades", $array, (int) $value);
			}
		}
		break;

	case 'ver_proyecto_instruccion':
		$_msg_control .= "Entro en ver_proyecto_instruccion\n";

		$return["content"] = infoProyecto($Data, $_POST["id"], $_POST["grupo"]);
		break;

	case 'form_instrucciones_factura':
		$_msg_control .= "Entro en form_instrucciones_factura\n";

		$content = '
				<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
					<div class="icon">
						<span class="mdi mdi-close"></span>
					</div>
					<div class="message">
						<strong>Error!</strong>
						<p>No se encontró información de ningún proyecto...</p>
					</div>
				</div>
			';

		$array = explode(",", $_POST["id"]);
		if ($array) {
			$_accordion_content = "";
			foreach ($array as $value) {
				if ($value) {
					// Se muestra la información del proyecto

					/***** Servicios Adicionales *****/
					$_servicios_content = '
							<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible sin_adicionales" data-id_proyecto="' . $value . '" data-grupo="' . $_POST["grupos"][$value] . '">
								<div class="icon">
									<span class="mdi mdi-alert-triangle"></span>
								</div>
								<div class="message">
									<strong>Atención!</strong>
									<p>No se han registrado servicios adicionales para este proyecto...</p>
								</div>
							</div>
						';
					$sql = '
							SELECT DISTINCT(csat.id), csat.id_servicio, ccc.nom_servicios_especial, 
								csat.valor_venta, csat.valor_compra, csat.sobrecosto, csat.id_proveedor, csat.url_costo, 
								IF( csat.id_proveedor IS NOT NULL,
									(SELECT cp1.abreviatura
									FROM cmx_proveedores cp1
									WHERE cp1.id = csat.id_proveedor)
									, NULL ) PROVEEDOR,
								csat.id_tramo, csat.tipo_servicio, 
								IF( csat.id_tramo IS NOT NULL,
									(SELECT crd1.sigla
									FROM cmx_tramo_solicitud cts1
										INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
									WHERE cts1.id = csat.id_tramo),
									NULL
								) TRAMO,
								IF( csat.id_tramo IS NOT NULL,
									(SELECT cts1.tipo_operacion
									FROM cmx_tramo_solicitud cts1
									WHERE cts1.id = csat.id_tramo),
									NULL
								) TIPO_OPERACION
							FROM cmx_importacion_proyecto cip
								INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
								INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
								INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cim.id
								INNER JOIN cmx_servicio_adicional_tramo csat ON csat.id_solicitud = cms.id_solicitud
								INNER JOIN cmx_contabilidad_conceptos ccc ON ccc.id = csat.id_servicio
							WHERE cip.estado = 1
								AND cip.id = ' . $value . '
								AND cia.grupo = ' . $_POST["grupos"][$value] . '
								AND csat.id_servicio != 24;
						';
					$result = $Data->getConsulta($sql);
					if ($result) {
						$_servicios_content = '<h4>Servicios Adicionales</h4>';
						foreach ($result["rowsData"] as $key_01 => $value_01) {
							$_checked = "";
							if ($value_01["sobrecosto"] == "1") {
								$_checked = "checked";
							}

							$_proveedor_disabled = '';
							if ($value_01["id_proveedor"]) {
								$_proveedor_disabled = 'disabled="disabled"';
							}

							// Se valida si ya se subió el adjunto del costo 
							$_url_costo = '
									<label class="control-label">(*) Soporte Costo:</label><br />
									<input type="file" name="url_costo" id="url_costo_' . $value_01[0] . '" class="inputfile url_costo" placeholder="Soporte Costo">
									<label for="url_costo_' . $value_01[0] . '" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
								';
							if ($value_01["url_costo"]) {
								$_url_costo = '
										<div class="icon-container">
											<a href="' . BASE_URL . 'public/files/importaciones/servicios_adicionales/' . $_POST["numero_importacion"][$value] . '/' . $_POST["grupos"][$value] . '/' . $value_01["url_costo"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
												<span class="mdi mdi-download"></span>
											</a>
										</div>
									';
							}

							$_servicios_content .= '
									<div class="row servicio_row" data-id="' . $value_01[0] . '" data-id_proyecto="' . $value . '" data-importacion="' . $_POST["importacion"][$value] . '" data-numero_importacion="' . $_POST["numero_importacion"][$value] . '" data-grupo="' . $_POST["grupos"][$value] . '">
										<div class="col-xs-12 col-sm-12 col-md-12"><strong class="nombre_servicio">' . $value_01["nom_servicios_especial"] . '</strong></div>
										<div class="col-xs-2 col-sm-2 col-md-2">
											<label><small class="text-muted">Se cobra al cliente</small></label>
											<div class="be-checkbox">
												<input class="check_sobrecosto" id="sobrecosto_' . $value_01[0] . '" type="checkbox" ' . $_checked . '>
												<label for="sobrecosto_' . $value_01[0] . '" value="' . $value_01[0] . '"></label>
											</div>
										</div>
										<div class="col-xs-6 col-sm-3 col-md-3">
											<label>(*) Valor de venta:</label>
											<input type="text" id="valor_venta_servicio_' . $value_01[0] . '" placeholder="Valor de venta" class="form-control input-xs" onload="getFormatoNumeroDecimal(this)" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)" data-title="Valor de venta"  value="' . number_format($value_01["valor_venta"], 2, ',', '.') . '" disabled="disabled">
										</div>
										<div class="col-xs-6 col-sm-3 col-md-3">
											<label>(*) Valor de compra:</label>
											<input type="text" id="valor_compra_servicio_' . $value_01[0] . '" placeholder="Valor de compra" class="form-control input-xs" onload="getFormatoNumeroDecimal(this)" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)" data-title="Valor de compra" value="' . number_format($value_01["valor_compra"], 2, ',', '.') . '" disabled="disabled">
										</div>
										<div class="col-xs-12 col-sm-4 col-md-4">
											<label>(*) Proveedor:</label>
											<div id="caja_proveedor_servicio_' . $value_01[0] . '">
												<span class="twitter-typeahead" style="position: relative; display: inline-block;">
													<input type="text" class="typeahead form-control input-xs tt-input" placeholder="Proveedor" id="proveedor_servicio" autocomplete="off" spellcheck="false" dir="auto" style="position: relative; vertical-align: top; background-color: transparent;" data-id="' . $value_01[0] . '" value="' . $value_01["PROVEEDOR"] . '" ' . $_proveedor_disabled . '>
													<pre aria-hidden="true" style="position: absolute; visibility: hidden; white-space: pre; font-family: Roboto, Arial, sans-serif; font-size: 12px; font-style: normal; font-variant: normal; font-weight: 400; word-spacing: 0px; letter-spacing: 0px; text-indent: 0px; text-rendering: auto; text-transform: none;"></pre>
													<div class="tt-menu" style="position: absolute; top: 100%; left: 0px; z-index: 100; display: none;">
														<div class="tt-dataset tt-dataset-states"></div>
													</div>
												</span>
											</div>
											<input type="hidden" id="id_proveedor_servicio_' . $value_01[0] . '" class="id_proveedor_servicio" data-title="Proveedor"  value="' . $value_01["id_proveedor"] . '">
										</div>
										<div class="row"></div>
										<div class="form-group col-xs-12 col-sm-8 col-md-8">
											<label>Tramo:</label>
											' . slctTramosProyecto($Data, $value, $_POST["grupos"][$value], $value_01["id_tramo"]) . '
										</div>
										<div class="form-group col-xs-12 col-sm-4 col-md-4">
											' . $_url_costo . '
										</div>
									</div>
									<div class="form-group col-xs-12 col-sm-12 col-md-12"></div>
								';
						}
					}
					/***** Fin - Servicios Adicionales *****/

					$_accordion_content .= '
							<div class="panel panel-default">
								<div class="panel-heading">
									<h4 class="panel-title">
										<a data-toggle="collapse" data-parent="#accordion_proyectos" href="#collapse_' . $value . '" class="collapsed" aria-expanded="false">
											<i class="icon mdi mdi-chevron-down"></i> Proyecto: <strong>' . $_POST["importacion"][$value] . '</strong> <small>' . $_POST["numero_importacion"][$value] . ' (' . $_POST["grupos"][$value] . ')</small>
											<span class="panel-subtitle"></span>
										</a>
									</h4>
								</div>
								<div id="collapse_' . $value . '" class="panel-collapse collapse" aria-expanded="false">
									<div class="panel-body datos_proyecto">
										<table class="table table-condensed table-borderless">
											<tbody>
												<tr>
													<td class="actions">
														<a class="icon hint--top-left" data-hint="Ver Datos del Proyecto"><i class="mdi mdi-eye mostrar_proyecto"></i></a>
													</td>
												</tr>
											</tbody>
										</table>
										<div class="col-xs-12 col-sm-12 col-md-12 data_servicios">' . $_servicios_content . '</div>
										<div class="data_proyecto">' . infoProyecto($Data, $value, $_POST["grupos"][$value]) . '</div>
									</div>
								</div>
							</div>
						';
				}
			}

			if ($_accordion_content) {
				$_content_proyectos = '
						<form id="form_instruccion" enctype="multipart/form-data">
							<div id="accordion_proyectos" class="panel-group accordion" data-id_proyectos="' . $_POST["id"] . '">
								' . $_accordion_content . '
							</div>
						</form>
					';
			}
			$content = $_content_proyectos;
		}

		$return["content"] = $content;
		break;

	case 'generar_instruccion_factura':
		$_msg_control .= "Entro en generar_instruccion_factura\n";
		$Model = new Model;

		$array = array(
			"num_instruccion" => "INS-" . $time,
			"fecha_hora" => date('Y-m-d H:i:s', $time),
			"autor" => $_POST["id_usuario"]
		);
		$id_instruccion = $Data->setRegistro("cmx_importacion_instrucciones", $array);

		$proyectos = explode(",", $_POST["id_proyectos"]);
		foreach ($proyectos as $key => $value) {
			if ($value) {
				$array = array(
					"id_instruccion" => $id_instruccion,
					"id_proyecto" => $value,
					"grupo" => $_POST["grupo_proyecto_" . $value]
				);
				$Data->setRegistro("cmx_importacion_instr_proy", $array);
			}
		}

		if (isset($_POST["id_servicio_adicional"])) {
			$array = explode(",", $_POST["id_servicio_adicional"]);
			foreach ($array as $key => $value) {
				if ($value) {
					$file = $_FILES["url_costo_" . $value];
					$tmp_file = $file["tmp_name"];
					$extension = $Model->get_extension_archivo($file["name"]);
					$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;

					if (move_uploaded_file($tmp_file, $archivo_temporal)) {
						// Se crean las carpetas de destino del archivo
						$carpeta_destino = "../public/files/importaciones/servicios_adicionales/" . $_POST["numero_importacion_" . $value] . "/" . $_POST["grupo_" . $value] . "/";
						if (!file_exists($carpeta_destino)) {
							mkdir($carpeta_destino, 0777, true);
						}

						$archivo_destino = time() . "-soporte_costo_" . $_POST["id_servicio_adicional_" . $value] . "_" . $_POST["id_proveedor_servicio_" . $value] . "." . $extension;
						$destino = $carpeta_destino . "/" . $archivo_destino;

						if (copy($archivo_temporal, $destino)) {
							/***** Se actualiza la información del servicio adicional *****/
							$array = array(
								'id_proveedor' => (int) $_POST["id_proveedor_servicio_" . $value],
								'id_instruccion' => (int) $id_instruccion,
								'url_costo' => $archivo_destino,
								'sobrecosto' => (boolean) $_POST["sobrecosto_" . $value]
							);
							// Se valida si el costo pertenece a algun tramo del proyecto 
							if ($_POST["id_tramo_" . $value]) {
								$array["id_tramo"] = (int) $_POST["id_tramo_" . $value];
							}
							$result = $Data->updateRegistro("cmx_servicio_adicional_tramo", $array, (int) $value);
							/***** Fin - Se actualiza la información del servicio adicional *****/
						}
					}
					if (file_exists($archivo_temporal)) {
						unlink($archivo_temporal);
					}
				}
			}
		}

		/***** SE VALIDA SI SE DEBE GESTIONAR LA ACTIVIDAD DEL PROYECTO *****/
		foreach ($proyectos as $key => $value) {
			if ($value) {
				// Se pregunta si se debe gestionar la actividad 
				if (isset($_POST["grupo_proyecto_" . $value])) {
					// Se cuenta cuantos servicios están pendientes por editar
					$sql = '
							SELECT  cip.id, COUNT( DISTINCT(csat.id) ) CUANTOS
							FROM cmx_importacion_proyecto cip
								INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
								INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
								INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cim.id
								INNER JOIN cmx_servicio_adicional_tramo csat ON csat.id_solicitud = cms.id_solicitud
							WHERE cip.estado = 1
								AND cip.id = ' . $value . '
								AND cia.grupo = ' . $_POST["grupo_proyecto_" . $value] . '
								AND csat.url_costo IS NULL
								AND csat.id_servicio != 24;
						';
					$result = $Data->getConsulta($sql);
					if ($result) {
						foreach ($result["rowsData"] as $key_01 => $value_01) {
							if ($value_01["CUANTOS"] == 0) {
								$sql = '
										SELECT cia.id, cia.orden, cia.fecha_hora_inicio, cia.id_importacion, 
											cia.bloque, cia.grupo, cia.simultaneo, cia.id_material, cia.tipo_actividad,
											cia.costo_real, cia.respuesta
										FROM cmx_importacion_proyecto cip
											INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
										WHERE cip.estado = 1
											AND cia.tipo_actividad = "instruccion_factura"
											AND cia.estado = 2
											AND cip.id = ' . $value . '
											AND cia.grupo = ' . $_POST["grupo_proyecto_" . $value] . '
									';
								$result_01 = $Data->getConsulta($sql);

								$id_actividades = "";
								$id_material = "";
								foreach ($result_01["rowsData"] as $key_02 => $value_02) {
									$id_actividades .= $value_02[0] . ",";
									$id_material .= $value_02["id_material"] . ",";
								}
								$actividad = $result_01["rowsData"][0];

								$array = array();
								$array["id"] = $id_actividades;
								$array["id_material"] = $id_material;
								$array["orden"] = $actividad["orden"];
								$array["fecha_hora_inicio"] = $actividad["fecha_hora_inicio"];
								$array["id_importacion"] = $actividad["id_importacion"];
								$array["bloque"] = $actividad["bloque"];
								$array["grupo"] = $actividad["grupo"];
								$array["simultaneo"] = $actividad["simultaneo"];
								$array["tipo_actividad"] = $actividad["tipo_actividad"];
								$array["costo_real"] = $actividad["costo_real"];
								$array["respuesta"] = $actividad["respuesta"];
								$return["actividades"][] = $array;
							}
						}
					}
				}
			}
		}
		/***** FIN - SE VALIDA SI SE DEBE GESTIONAR LA ACTIVIDAD DEL PROYECTO *****/
		break;

	default:
		$_msg_control .= "Error en la seleccion de accion del archivo\n";
		$_msg_error .= "<p>Error en la selección de acción del archivo.</p>";
		break;
}

$return["control"] = $_msg_control;
$return["error"] = $_msg_error;
echo json_encode($return);

/**** FUNCIONES DE SUBIDA DE ARCHIVO ****/
function limpiaTexto($text)
{
	$text = filter_var(trim($text), FILTER_SANITIZE_STRING);
	//Filtro anti-XSS
	$caracteres_malos = array("<", ">", "\"", "'", "/", "<", ">", "'", "/");
	$caracteres_buenos = array("& lt;", "& gt;", "& quot;", "& #x27;", "& #x2F;", "& #060;", "& #062;", "& #039;", "& #047;");
	$consultaBusqueda = str_replace($caracteres_malos, $caracteres_buenos, $text);
	return $text;
}

// Función que quita los puntos decomales de los números
function limpiaNumero($text)
{
	$text = str_replace(".", "", $text);
	return $text;
}

// Función que valida si un número tiene puntos 
function validaNumero($numero)
{
	$_flag = true;
	$num = explode(".", $numero);
	if (count($num) > 1) {
		$_flag = false;
	}
	return $_flag;
}

// Funcion que busca las actividades del bloque de una actividad
function actividadesBloque($id_actividad)
{
	$Data = new Consultas;
	$sql = "
			SELECT 
				cia.*
			FROM 
				cmx_importacion_actividades cia
			WHERE 
				cia.id = " . $id_actividad . "
		";
	$resultActividades = $Data->getConsulta($sql);

	$orden = 0;
	$bloque_anterior = 0;
	$return = "";
	$_falgActividades = true;
	foreach ($resultActividades["rowsData"] as $key => $value) {
		$orden = $value["orden"];
		$return .= $orden . ",";
		do {
			$orden++;
			$sql = "
					SELECT 
						cia.orden, cia.bloque
					FROM 
						cmx_importacion_actividades cia
					WHERE 
					cia.id_importacion = " . $value["id_importacion"] . "
					AND cia.grupo = " . $value["grupo"] . "
					AND cia.id_material = " . $value["id_material"] . "
					AND cia.orden = " . $orden . "
				";
			$resultActividadesBloque = $Data->getConsulta($sql);

			if ($resultActividadesBloque["rowsData"][0]["bloque"] > $bloque_anterior) {
				$return .= $orden . ",";
				$bloque_anterior = $resultActividadesBloque["rowsData"][0]["bloque"];
			} else {
				$_falgActividades = false;
			}
		} while ($_falgActividades);
		$return .= "0";
	}

	return $return;
}

function infoProyecto($Data, $id_proyecto, $grupo)
{
	$content = '
			<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
				<div class="icon">
					<span class="mdi mdi-close"></span>
				</div>
				<div class="message">
					<strong>Error!</strong>
					<p>No se encontró información del proyecto...</p>
				</div>
			</div>
		';

	$sql = '
			SELECT
				cip.id, cia.grupo, cip.numero_importacion, cip.importacion, cip.id_cliente,
				caa.numero_manifiesto, SUM(cam.peso) PESO, SUM(cam.valor_declarado) VALOR_DECLARADO,
				ccc.id ID_CONTRATO, ccc.cod_contrato, ctc.nombre TIPO_CONTRATO
			FROM
				cmx_agrupacion_anticipo caa
				INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = caa.id_agrupacion
				INNER JOIN cmx_mercancia_solicitud cms ON cms.id = cam.id_material
				INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto AND cim.id = cms.id_material_proyecto
				INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
				INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion AND cip.id = cia.id_importacion
				INNER JOIN cmx_contrato_cliente ccc ON ccc.id = cip.id_contrato
				INNER JOIN cmx_tipo_contrato ctc ON ctc.id = ccc.tipo_contrato
			WHERE
				cip.estado = 1
				AND cip.id = ' . $id_proyecto . '
				AND cia.grupo = ' . $grupo . '
				AND cia.tipo_actividad = "instruccion_factura"
				AND cia.estado = 2
			GROUP BY caa.id_agrupacion;
		';

	$result = $Data->getConsulta($sql);
	$general = $result["rowsData"];
	if ($general) {
		$return["general"] = $result;
		foreach ($general as $key => $value) {
			/***** Información del cliente *****/
			$_cliente = datosClienteEncabezado($Data, $value["id_cliente"]);

			/***** Información del proyecto *****/
			$_proyecto = '
					<strong>Información Proyecto</strong>
					<table class="table" id="tabla_cliente">
						<tbody>
							<tr>
								<td class="cell-detail">
									<div class="col-xs-12 col-sm-6 col-md-3">
										<span>Proyecto <strong>' . $value["importacion"] . '</strong></span>
										<span class="cell-detail-description">' . $value["numero_importacion"] . ' (' . $value["grupo"] . ')</span>
									</div>
									<div class="col-xs-12 col-sm-6 col-md-3">
										<span>Contrato <strong>' . $value["cod_contrato"] . '</strong></span>
										<span class="cell-detail-description">' . $value["TIPO_CONTRATO"] . '</span>
									</div>
									<div class="col-xs-12 col-sm-6 col-md-2">
										<span>Manifiesto</span>
										<span class="cell-detail-description">' . $value["numero_manifiesto"] . '</span>
									</div>
									<div class="col-xs-12 col-sm-6 col-md-2">
										<span>Peso</span>
										<span class="cell-detail-description">' . number_format($value["PESO"], 0, ',', '.') . 'Kg</span>
									</div>
									<div class="col-xs-12 col-sm-6 col-md-2">
										<span>Valor Declarado</span>
										<span class="cell-detail-description">$' . number_format($value["VALOR_DECLARADO"], 2, ',', '.') . '</span>
									</div>
								</td>
							</tr>
							<tr><td></td></tr>
						</tbody>
					</table>
				';

			/***** Información del contrato *****/
			$_contrato = datosContrato($value["ID_CONTRATO"]);

			/***** Servicios Adicionales *****/
			$_servicios = '
					<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-alert-triangle"></span>
						</div>
						<div class="message">
							<strong>Atención!</strong>
							<p>No se han registrado servicios adicionales para este proyecto...</p>
						</div>
					</div>
				';

			$sql = '
					SELECT DISTINCT(csat.id), csat.id_servicio, ccc.nom_servicios_especial, 
						csat.valor_venta, csat.valor_compra, csat.sobrecosto, 
						IF( csat.id_proveedor IS NOT NULL,
							(SELECT cp1.abreviatura
							FROM cmx_proveedores cp1
							WHERE cp1.id = csat.id_proveedor)
							, "No especificado" 
						) PROVEEDOR,
						csat.id_tramo, 
						IF( csat.id_tramo IS NOT NULL,
							(SELECT crd1.sigla
							FROM cmx_tramo_solicitud cts1
								INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
							WHERE cts1.id = csat.id_tramo),
							NULL
						) TRAMO,
						IF( csat.id_tramo IS NOT NULL,
							(SELECT cts1.tipo_operacion
							FROM cmx_tramo_solicitud cts1
							WHERE cts1.id = csat.id_tramo),
							NULL
						) TIPO_OPERACION
					FROM cmx_importacion_proyecto cip
						INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
						INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
						INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cim.id
						INNER JOIN cmx_servicio_adicional_tramo csat ON csat.id_solicitud = cms.id_solicitud
						INNER JOIN cmx_contabilidad_conceptos ccc ON ccc.id = csat.id_servicio
					WHERE cip.estado = 1
						AND cip.id = ' . $value[0] . '
						AND cia.grupo = ' . $grupo . '
						AND csat.id_servicio != 24;
				';
			$result = $Data->getConsulta($sql);
			if ($result) {
				$_servicios = '
						<strong>Servicios Adicionales</strong>
						<table class="table table-striped table-condensed">
							<thead>
								<tr class="nexos-encabezado">
									<th>Servicio</th>
									<th>Valor Venta</th>
									<th>Valor Compra</th>
									<th>Proveedor</th>
								</tr>
							</thead>
							<tbody>
					';
				foreach ($result["rowsData"] as $key_01 => $value_01) {
					$_paga_cliente = '';
					if ($value_01["sobrecosto"] == "1") {
						$_paga_cliente = '<span class="cell-detail-description"><strong class="text-danger">(Paga el cliente)</strong></span>';
					}
					$_tramo_operacion = '';
					if ($value_01["id_tramo"]) {
						$_tramo_operacion = '<span class="cell-detail-description">(' . $value_01["TIPO_OPERACION"] . ') ' . $value_01["TRAMO"] . '</span>';
					}
					$_servicios .= '
							<tr>
								<td class="cell-detail">
									<span>' . $value_01["nom_servicios_especial"] . '</span>
									' . $_tramo_operacion . '
									' . $_paga_cliente . '
								</td>
								<td class="cell-detail text-right">
									<span>$' . number_format($value_01["valor_venta"], 2, ",", ".") . '</span>
								</td>
								<td class="cell-detail text-right">
									<span>$' . number_format($value_01["valor_compra"], 2, ",", ".") . '</span>
								</td>
								<td class="cell-detail">
									<span>' . $value_01["PROVEEDOR"] . '</span>
								</td>
							</tr>
						';
				}
				$_servicios .= '
							</tbody>
						</table>
					';
			}

			/***** Información de remesas *****/
			$_remesas = '
					<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<strong>Error!</strong>
							<p>No se encontró información de las remesas de este proyecto...</p>
						</div>
					</div>
				';

			$sql = '
					SELECT
						cip.id, cam.id ID_AGRUPACION_MATERIAL, cam.numero_remesa, cam.peso, cam.valor_declarado,
						cms.tipo_movilizacion, cim.id ID_MATERIAL_PROYECTO, cim.nombre MATERIAL,
						cia.id ID_ACTIVIDAD, cia.grupo, cip.numero_importacion, cip.importacion,
						cc.id ID_CLIENTE, cc.cod_cliente, CONCAT(cc.documento,"-",cc.digito_verificacion) DOCUMENTO_CLIENTE, cc.sigla, cc.nombre
					FROM cmx_agrupacion_anticipo caa
						INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = caa.id_agrupacion
						INNER JOIN cmx_mercancia_solicitud cms ON cms.id = cam.id_material
						INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto AND cim.id = cms.id_material_proyecto
						INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
						INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion AND cip.id = cia.id_importacion
						INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
					WHERE cip.estado = 1
						AND cip.id = ' . $value[0] . '
						AND cia.grupo = ' . $grupo . '
						AND cia.tipo_actividad = "instruccion_factura"
						AND cia.estado = 2;
				';
			$result = $Data->getConsulta($sql);
			if ($result) {
				$_remesas = '
						<strong>Remesas</strong>
						<table class="table table-striped table-condensed">
							<thead>
								<tr class="nexos-encabezado">
									<th class="col-md-2">Remesa</th>
									<th>Material</th>
									<th class="col-md-1">Peso</th>
									<th class="col-md-2">Valor Declarado</th>
								</tr>
							</thead>
							<tbody>
					';
				foreach ($result["rowsData"] as $key_01 => $value_01) {
					$_remesas .= '
							<tr>
								<td class="cell-detail">
									<span>' . $value_01["numero_remesa"] . '</span>
									<span class="cell-detail-description">' . $value_01["tipo_movilizacion"] . '</span>
								</td>
								<td class="cell-detail">
									<span>' . $value_01["MATERIAL"] . '</span>
								</td>
								<td class="cell-detail">
									<span>' . number_format($value_01["peso"], 0, ',', '.') . 'Kg</span>
								</td>
								<td class="cell-detail text-right">
									<span>$' . number_format($value_01["valor_declarado"], 2, ',', '.') . '</span>
								</td>
							</tr>
						';
				}
				$_remesas .= '
							</tbody>
						</table>
					';
			}
		}
		$content = '
				<div class="col-xs-12 col-sm-12 col-md-12">' . $_proyecto . '</div>
				<div class="col-xs-12 col-sm-12 col-md-12">' . $_contrato . '</div>
				<div class="col-xs-12 col-sm-12 col-md-12">' . $_remesas . '</div>
				<div class="col-xs-12 col-sm-12 col-md-12">' . $_servicios . '</div>
				<div class="col-xs-12 col-sm-12 col-md-12">' . $_cliente . '</div>
			';
	}
	return $content;
}

function datosClienteEncabezado($Data, $id_cliente)
{
	/****** Información básica ******/
	$content = '
			<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
				<div class="icon">
					<span class="mdi mdi-close"></span>
				</div>
				<div class="message">
					<strong>Error!</strong>
					<p>No se encontró información del cliente...</p>
				</div>
			</div>
		';

	$sql = '
			SELECT cc.*, cm.municipio, cm.depto, cm.pais, cm.rndc_codigo_ciudad
			FROM cmx_clientes cc
				INNER JOIN cmx_municipios cm ON cm.id = cc.ciudad
			WHERE cc.id = ' . $id_cliente . '
		';
	$result = $Data->getConsulta($sql);

	if (isset($result)) {
		$array = $result["rowsData"][0];
		$content = '
				<strong>Cliente</strong>
				<table class="table" id="tabla_cliente" data-cliente_nombre="' . $array["nombre"] . '" data-cliente_nit="' . number_format($array["documento"], 0, ',', '.') . '-' . $array["digito_verificacion"] . '" data-cliente_direccion="' . $array["direccion"] . '" data-cliente_municipio="' . $array["municipio"] . '" >
					<tbody>
						<tr>
							<td class="cell-detail">
								<div class="form-group col-xs-12 col-sm-12 col-md-4">
									<span>' . $array["nombre"] . '</span>
									<span class="cell-detail-description">' . $array["sigla"] . '</span>
									<span class="cell-detail-description">' . $array["documento"] . '-' . $array["digito_verificacion"] . '</span>
									<span class="cell-detail-description">Tipo Documento - ' . $array["tipo_documento"] . '</span>
									<span class="cell-detail-description">Régimen - ' . $array["regimen"] . '</span>
								</div>
								<div class="form-group col-xs-12 col-sm-6 col-md-4">
									<span>Ubicación</span>
									<span class="cell-detail-description">' . $array["direccion"] . '</span>
									<span class="cell-detail-description">' . $array["municipio"] . ' (' . $array["depto"] . ' - ' . $array["pais"] . ')</span>
									<span class="cell-detail-description">' . $array["indicaciones_llegada"] . '</span>
								</div>
								<div class="form-group col-xs-12 col-sm-6 col-md-4">
									<span>Contacto</span>
									<span class="cell-detail-description">Teléfono - ' . $array["telefono"] . '</span>
									<span class="cell-detail-description">' . $array["email"] . '</span>
								</div>
								<div class="col-sm-12"></div>
								<div class="form-group col-xs-12 col-sm-6 col-md-6">
									<span>Facturación</span>
									<span class="cell-detail-description">
										<strong>Dirección de radicación:</strong> ' . $array["fac_direccion_radicacion"] . '
									</span>
									<span class="cell-detail-description">
										<strong>Día máximo de radicación:</strong> ' . $array["fac_dia_max_facturacion"] . '
									</span>
									<span class="cell-detail-description">
										<strong>Horario de atención:</strong> ' . $array["fac_horario_atencion"] . '
									</span>
									<span class="cell-detail-description">
										<strong>Condiciones para Facturar:</strong> ' . $array["fac_cond_facturar"] . '
									</span>
								</div>
								<div class="form-group col-xs-12 col-sm-6 col-md-6">
									<span>Tesorería</span>
									<span class="cell-detail-description">
										<strong>Plazo para pagos:</strong> ' . $array["tes_plazo_pagos"] . ' días
									</span>
									<span class="cell-detail-description">
										<strong>Días de pago:</strong> ' . $array["tes_dias_pagos"] . '
									</span>
									<span class="cell-detail-description">
										<strong>Días de información:</strong> ' . $array["tes_dias_informacion"] . '
									</span>
									<span class="cell-detail-description">
										<strong>Instrucción de pago:</strong> ' . $array["tes_instruccion_pago"] . '
									</span>
								</div>
							</td>
						</tr>
						<tr><td></td></tr>
					</tbody>
				</table>
			';
	}
	return $content;
}

function slctTramosProyecto($Data, $id_proyecto, $grupo, $id_tramo)
{
	$sql = '
			SELECT DISTINCT(cts.id), cts.tipo_operacion, crd.sigla, crd.direccion
			FROM cmx_importacion_proyecto cip
				INNER JOIN cmx_importacion_material cim ON cim.id_importacion = cip.id
				INNER JOIN cmx_importacion_actividades cia ON cia.id_material = cim.id
				INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cim.id
				INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cms.id_solicitud
				INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
			WHERE cip.estado = 1
				AND cip.id = ' . $id_proyecto . '
				AND cia.grupo = ' . $grupo . '
		';
	$result = $Data->getConsulta($sql);

	$content = '<select class="form-control input-sm" name="id_tramo" id="slct_tramo" aria-hidden="true">';
	$content .= '<option value="">Seleccione</option>';
	if (isset($result)) {
		foreach ($result['rowsData'] as $key => $value) {
			if ($value[0] == $id_tramo) {
				$content .= '<option value="' . $value[0] . '" selected="">(' . $value[1] . ') ' . $value[2] . ' ' . $value[3] . '</option>';
			} else {
				$content .= '<option value="' . $value[0] . '">(' . $value[1] . ') ' . $value[2] . ' ' . $value[3] . '</option>';
			}
		}
	}
	$content .= '</select>';

	return $content;
}

function datosContrato($id)
{
	$Clientes = new clientesModel;
	$result = $Clientes->getDatosContrato($id);
	$content = '
			<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
				<div class="icon">
					<span class="mdi mdi-alert-triangle"></span>
				</div>
				<div class="message">
					<strong>Atención!</strong>
					</p>El cliente no tiene contratos registrados</p>
				</div>
			</div>
		';

	if ($result["contratos"]) {
		foreach ($result["contratos"] as $key => $value) {
			// Se buscan los origenes del contrato
			$_tipo_vehiculo_content = '';
			if (isset($result["tipos_vehiculo"][$value[0]])) {
				$_tipo_vehiculo_content .= '<span>Tipos de vehículo</span>';
				$_vehiculos = '';
				$_flag_primero = true;
				foreach ($result["tipos_vehiculo"][$value[0]] as $key_01 => $value_01) {
					$_tipo_vehiculo_content .= '<span class="cell-detail-description"><strong>' . $value_01["nombre"] . '</strong> $' . number_format($value_01["flete_maximo"], 0, ",", ".") . '</span>';
				}
				$_tipo_vehiculo_content .= '<span class="cell-detail-description">' . $_vehiculos . '</span>';
			}

			// Se buscan las condiciones del contrato
			$_condiciones_content = '';
			if (isset($result["condiciones"][$value[0]])) {
				foreach ($result["condiciones"][$value[0]] as $key_01 => $value_01) {
					$_condiciones_content .= '
							<div class="form-group col-xs-12 col-sm-6 col-md-6">
								<span>' . $value_01["nombre"] . '</span>
								<span class="cell-detail-description">' . $value_01["descripcion"] . '</span>
							</div>
						';
				}
			}

			// Se buscan los origenes del contrato
			$_origenes_title = '';
			$_origenes_content = '';
			if (isset($result["cargues"][$value[0]])) {
				$_origenes_content .= '<span>Orígenes</span>';
				$_flag_primero = true;
				foreach ($result["cargues"][$value[0]] as $key_01 => $value_01) {
					$_origenes_content .= '<span class="cell-detail-description">' . $value_01["MUNICIPIO"] . '</span>';
					if ($_flag_primero) {
						$_flag_primero = false;
						$_origenes_title .= 'Origen: ' . $value_01["CIUDAD"];
					} else {
						$_origenes_title .= ' - ' . $value_01["CIUDAD"];
					}
				}
			}

			// Se buscan los destinos del contrato
			$_destinos_title = '';
			$_destinos_content = '';
			if (isset($result["descargues"][$value[0]])) {
				$_destinos_content .= '<span>Destinos</span>';
				$_flag_primero = true;
				foreach ($result["descargues"][$value[0]] as $key_01 => $value_01) {
					$_destinos_content .= '<span class="cell-detail-description">' . $value_01["MUNICIPIO"] . '</span>';
					if ($_flag_primero) {
						$_flag_primero = false;
						$_destinos_title .= 'Destino: ' . $value_01["CIUDAD"];
					} else {
						$_destinos_title .= ' - ' . $value_01["CIUDAD"];
					}
				}
			}

			$content = '
					<strong>Información Contrato</strong>
					<table class="table">
						<tbody>
							<tr>
								<td class="cell-detail">
									<div class="form-group col-xs-12 col-sm-6 col-md-4">
										<span>Valor contratado</span>
										<span class="cell-detail-description">$' . number_format($value["valor"], 0, ",", ".") . '</span>
									</div>
									<div class="form-group col-xs-12 col-sm-6 col-md-4">
										<span>Inicio de contrato</span>
										<span class="cell-detail-description">' . $value["fecha_inicio"] . '</span>
									</div>
									<div class="form-group col-xs-12 col-sm-6 col-md-4">
										<span>Finalización de contrato</span>
										<span class="cell-detail-description">' . $value["fecha_fin"] . '</span>
									</div>
									<div class="form-group col-xs-12 col-sm-6 col-md-6">
										' . $_tipo_vehiculo_content . '
									</div>
									' . $_condiciones_content . '
									<div class="row"></div>
									<div class="form-group col-xs-12 col-sm-6 col-md-6">
										' . $_origenes_content . '
									</div>
									<div class="form-group col-xs-12 col-sm-6 col-md-6">
										' . $_destinos_content . '
									</div>
								</td>
							</tr>
							<tr><td></td></tr>
						</tbody>
					</table>
				';
		}
	}
	return $content;
}

?>