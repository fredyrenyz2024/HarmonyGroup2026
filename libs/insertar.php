<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';

$Model = new Model;


$Data = new Consultas;
$table = $_GET['tabla'];
if (isset($_GET['relacion'])) {
	$tableRelacion = $_GET['relacion'];
	$campoRelacion = $_GET['campo_relacion'];
}

$_msg_error = "";
// Filtro para subida de archivo
if (isset($_GET["file_name"])) {
	$flag_archivo = "No hay archivos";
	if (isset($_FILES[$_GET["file_name"]])) {
		if ($_FILES[$_GET["file_name"]]["name"]) {
			$flag_archivo = "Si hay archivo";

			// Se copia el archivo en una carpeta temporal 
			$tmp_file = $_FILES[$_GET["file_name"]]["tmp_name"];
			$archivo = explode(".", $_FILES[$_GET["file_name"]]["name"]);
			$archivo_temporal = "../public/files/tmp/tmp_file." . $archivo[1];
			if (move_uploaded_file($tmp_file, $archivo_temporal)) {
				print_r("Se copia el archivo temporal \n");
				$arrayId_actividad = explode(",", $_GET['id_actividades']);

				$arrayFile = array();
				for ($i = 0; $i < (count($arrayId_actividad) - 1); $i++) {

					$carpeta_destino = "../public/files/" . $_GET["proyecto"];
					if (!file_exists($carpeta_destino)) {
						mkdir($carpeta_destino, 0777, true);
						// print_r("Si se pudo crear la carpeta \n");
					}

					$carpeta_destino_1 = $carpeta_destino . "/aplazamientos/" . $arrayId_actividad[$i];
					if (!file_exists($carpeta_destino_1)) {
						mkdir($carpeta_destino_1, 0777, true);
						// print_r("Si se pudo crear la carpeta \n");
					}

					$ahora = getdate();
					$tiempo_actual = $ahora[0];

					$archivo = explode(".", $_FILES[$_GET["file_name"]]["name"]);
					$archivo_destino = $tiempo_actual . "-" . $arrayId_actividad[$i] . "." . $archivo[1];
					$destino = $carpeta_destino_1 . "/" . $archivo_destino;


					if (copy($archivo_temporal, $destino)) {
						print_r("Se copia el archivo \n");
						$_msg_error .= '<p>Se ha copiado el archivo corretamente.</p>';

						if ($_GET["misma_tabla"] = 1) {
							print_r("Se actualiza Registro de la tabla\n");

							$sql = '
									SELECT 
										MAX(id) 
									FROM ' . $table . '
									WHERE 
										id_actividad = ' . $arrayId_actividad[$i] . '
										AND url IS NULL
								';
							$respuesta = $Data->getConsulta($sql);
							// print_r($respuesta);
							// print_r("\n");

							$arrayFile[$i]["url"] = $archivo_destino;

							// Se actualiza la informacion del entregable en la base de datos 
							$resul = $Data->updateRegistro($table, $arrayFile[$i], $respuesta['rowsData'][0][0]);
							print_r($resul);
						} else {
							print_r("Se inserta Registro en otra tabla\n");
							$arrayFile[$i]["id_actividad"] = $arrayId_actividad[$i];
							$arrayFile[$i]["url"] = $archivo_destino;

							// Se guarda la informacion del entregable en la base de datos 
							$resul = $Data->setRegistro($table, $arrayFile[$i]);
							print_r($resul);
						}
					} else {
						print_r("No se copia el archivo \n");
						$_msg_error .= '<p>Se produjo un error al copiar el archivo.</p>';
					}
				}
				// Se elimina el archivo temporal
				unlink($archivo_temporal);
			} else {
				print_r("No se copia el archivo temporal \n");
			}
		}
	}
	print_r($flag_archivo . "\n");
} else {

	if (isset($_GET['campo_multiple'])) {

		$campoMultiple = $_GET['campo_multiple'];

		$arrayMultiple = explode(",", $_POST[$_GET['campo_multiple']]);
		// print_r($arrayMultiple);

		for ($i = 0; $i < (count($arrayMultiple) - 1); $i++) {
			foreach ($_POST as $key => $value) {
				if ($key === $_GET['campo_multiple']) {
					$array[$key] = $Model->limpiaTexto($arrayMultiple[$i]);
				} else {
					$array[$key] = $Model->limpiaTexto($value);
				}
			}
			$Data->setRegistro($table, $array);
			// print_r($array);
		}
	} else {

		if ($table == "cmx_remitente_destinatario") {
			$documento_identificacion = '';
			$docuemnto_asigndo = false;
			foreach ($_POST as $key => $value) {
				// $documento_identificacion = $value['documento'];
				if ($key === 'documento' && !$documento_identificacion) {
					$documento_identificacion = $value;
					$docuemnto_asigndo = true;
				}

				if ($key != 'rndc_nombre' and $key != 'rndc_id_municipio' and $key != 'primer_apellido' and $key != 'segundo_apellido' and $key != 'id_pais' and $key != 'id_depto' and $key != 'ciudad') {
					if ($key != 'id_relacion') {
						$array[$key] = $Model->limpiaTexto($value);
					}
				}
			}
		} else {
			foreach ($_POST as $key => $value) {
				if ($key != 'id_relacion') {
					$array[$key] = $Model->limpiaTexto($value);
				}
			}
		}
		// print_r($array);
		$registro = $Data->setRegistro($table, $array);
		//se realiza la insercion en las demás tablas
		if (isset($_GET['relacion'])) {
			// Esta es a relacion de la insercion
			foreach ($_POST as $key => $value) {
				if ($key == 'id_relacion') {
					$key = $campoRelacion;
					$arrayRelacion[$key] = $Model->limpiaTexto($value);

					$sql = 'SELECT MAX(id) AS remitente_destinatario_id FROM ' . $table . '';
					$respuesta = $Data->getConsulta($sql);
					foreach ($respuesta['rowsData'] as $key1 => $value1) {
						switch ($tableRelacion) {
							case 'cmx_cliente_remdest':

								$arrayRelacion = array(
									$key => $Model->limpiaTexto($value),
									"id_remdest" => $Model->limpiaTexto($value1['remitente_destinatario_id']),
								);
								break;
							case 'cmx_bodegas':

								$arrayRelacion = array(
									$key => $Model->limpiaTexto($value),
									"id_remtente_destinatario" => $value1['remitente_destinatario_id'],
								);
								break;
						}
					}

					// print_r("Este array resultante\n");
					// print_r($arrayRelacion);
					$Data->setRegistro($tableRelacion, $arrayRelacion);
					//exit;
				}
			}
		}

		//Crear registro en tablas de movimiento NEXOSAPP - MINISTERIO
		if ($table == "cmx_remitente_destinatario") {
			session_start();
			$fecha = date('Y-m-d');
			$hora = date('H:i:s');
			$user = $_SESSION["usuario"]["nom_usuario"];
			$sql2 = "INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,fecha,hora,usuario,tipo_tercero,accion)
						VALUES(null,'" . $documento_identificacion . "','Tercero',0,1,'" . $fecha . "','" . $hora . "','Admin Nexos','Remitente','Crear')";
			$Data->ejecuteRegistro($sql2);
		}
	}
}
