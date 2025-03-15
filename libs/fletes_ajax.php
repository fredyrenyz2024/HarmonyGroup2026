<?php
include("../application/Config.php");
include '../application/Conexion.php';
$_msg_error = "";
$_msg_control = "Entro en fletes_ajax.php\n";
$_array_result = array();
session_start();
$Data = new Consultas;
$Data2 = new Conexion;

// $return["get"] = $_GET;
$return["post"] = $_POST;

switch ($_GET["action"]) {
	case 'guardaFleteNacional':
		$_msg_control .= "Entro en la accion guardaFlete.\n";
		$fecha = date('Y-m-d');
		$hora = date('G:i:s');
		$array = array(

			"vigencia" 			=> $_POST["vigencia"],
			"mes"				=> $_POST["mes"],
			"origen" 			=> $_POST["origen"],
			"destino" 			=> $_POST["destino"],
			"tipo_vehiculo"		=> $_POST["tipo_vehiculo"],
			"tarifa" 			=> $_POST["tarifa"],
			"estado"			=> 1,
			"usuario"			=> $_SESSION["usuario"]["nom_usuario"],
			"fecha"				=> $fecha,
			"hora"				=> $hora

		);
		if (!$Data->setRegistro("cmx_fletes_nacional", $array)) {
			$_msg_error .= "<p>Error al generar el Flete.</p>";
		}
		break;

	case 'verificaFlete2':
		$_msg_control .= "Entro en la accion verificaFlete.\n";
		$_flag_flete = false;

		$sql = '
					SELECT fl.id
					FROM cmx_fletes_nacional fl
					WHERE
					fl.origen=' . $_POST["origen"] . '
					AND fl.destino=' . $_POST["destino"] . '
					AND fl.tipo_vehiculo=' . $_POST["tipo_vehiculo"] . '
					AND fl.estado=1
				';
		$result = $Data->getConsulta($sql);

		if ($result) {
			$_flag_flete = true;
		}

		$return["flag_flete"] = $_flag_flete;
		break;

	case 'verificaFlete':
		$_msg_control .= "Entro en la accion verificaFlete.\n";
		$_flag_flete = false;

		$sql = '
				SELECT
					ct.id
				FROM
					cmx_tarifas ct
				WHERE
					ct.origen = ' . $_POST["origen"] . '
					AND ct.destino = ' . $_POST["destino"] . '
					AND ct.tipo_vehiculo = ' . $_POST["tipo_vehiculo"] . '
			;';
		$result = $Data->getConsulta($sql);

		if ($result) {
			$_flag_flete = true;
		}

		$return["flag_flete"] = $_flag_flete;
		break;

	case 'verRemiDestId':
		$_msg_control .= "Entro en la accion verRemiDestId.\n";

		$sql = '
				SELECT 
					crd.*,
					cm.municipio, cm.depto, cm.pais, cm.rndc_codigo_ciudad,
					CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") CIUDAD_REMI_DEST,
					cc.nombre NOM_CLIENTE
				FROM 
					cmx_remitente_destinatario crd
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					INNER JOIN cmx_clientes cc ON cc.id = crd.id_cliente
				WHERE 
					crd.id = ' . $_POST["id"] . '
			;';
		$result = $Data->getConsulta($sql);

		$return["response"] = $result;

		// Se busca si el registro de encuentra en el RNDC
		if ($result["rowsData"][0]["rndc_id"]) {
			$return["RNDC_response"] = "Se debe buscar en el rndc";

			$arrayMinTrans = array();
			// Solicitud
			$arrayMinTrans["solicitud"] = array(
				"tipo" => 3,
				"procesoid" => 11,
			);
			// Variable que se envían para la consulta  
			$arrayMinTrans["variables"] = "INGRESOID,FECHAING,NUMNITEMPRESATRANSPORTE,CODTIPOIDTERCERO,NUMIDTERCERO,NOMIDTERCERO,PRIMERAPELLIDOIDTERCERO,SEGUNDOAPELLIDOIDTERCERO,NUMTELEFONOCONTACTO,NOMENCLATURADIRECCION,CODMUNICIPIORNDC,CODSEDETERCERO,NOMSEDETERCERO,NUMLICENCIACONDUCCION,CODCATEGORIALICENCIACONDUCCION,FECHAVENCIMIENTOLICENCIA,LATITUD,LONGITUD";

			$arrayMinTrans["documento"] = array(
				"NUMNITEMPRESATRANSPORTE" => MINTRANS_NIT,
				"INGRESOID" => $result["rowsData"][0]["rndc_id"]
			);

			$result = $Data->getRNDCQueryArray($arrayMinTrans);

			if ($result["ErrorMSG"]) {
				$_msg_error .= $result["ErrorMSG"];
			} else {
				$return["result_info_remi_dest"] = $result;
			}
		} else {
			$return["RNDC_response"] = "No se debe buscar en el rndc";
		}
		break;

	case 'buscaFlete2':
		$_msg_control .= "Entro en la accion buscaFlete.\n";

		$sql = '
				SELECT
					ct.id, ct.mes,
					cmu1.id id_origen,cmu1.municipio municipio_origen,cmu1.depto depto_origen,cmu1.pais pais_origen,
					cmu2.id id_destino,cmu2.municipio municipio_destino,cmu2.depto depto_destino,cmu2.pais pais_destino,
					ctv.id,ctv.nombre,
					ct.tarifa,ct.vigencia,ct.estado
				FROM
					cmx_fletes_nacional ct
					INNER JOIN cmx_municipios cmu1 ON ct.origen = cmu1.rndc_codigo_ciudad
					INNER JOIN cmx_municipios cmu2 ON ct.destino = cmu2.rndc_codigo_ciudad
					INNER JOIN cmx_para_tipo_vehiculo ctv ON ct.tipo_vehiculo = ctv.id
				WHERE
					ct.id = ' . $_POST["id"] . '
			;';
		$result = $Data->getConsulta($sql);

		$return["content"] = '';
		if ($result) {
			foreach ($result["rowsData"] as $key => $value) {
				$mes_numero = $value["mes"];
				$mes_name = '';
				$mes_todos = '';
				if ($mes_numero == '1') {
					$mes_name = 'Enero';
					$mes_todos = '
						<option value="2">Febrero</option>
						<option value="3">Marzo</option>
						<option value="4">Abril</option>
						<option value="5">Mayo</option>
						<option value="6">Junio</option>
						<option value="7">Julio</option>
						<option value="8">Agosto</option>
						<option value="9">Septiembre</option>
						<option value="10">Octubre</option>
						<option value="11">Noviembre</option>
						<option value="12">Diciembre</option>
						';
				}
				if ($mes_numero == '2') {
					$mes_name = 'Febrero';
					$mes_todos = '
						<option value="1">Enero</option>
						<option value="3">Marzo</option>
						<option value="4">Abril</option>
						<option value="5">Mayo</option>
						<option value="6">Junio</option>
						<option value="7">Julio</option>
						<option value="8">Agosto</option>
						<option value="9">Septiembre</option>
						<option value="10">Octubre</option>
						<option value="11">Noviembre</option>
						<option value="12">Diciembre</option>
						';
				}
				if ($mes_numero == '3') {
					$mes_name = 'Marzo';
					$mes_todos = '
						<option value="1">Enero</option>
						<option value="2">Febrero</option>
						<option value="4">Abril</option>
						<option value="5">Mayo</option>
						<option value="6">Junio</option>
						<option value="7">Julio</option>
						<option value="8">Agosto</option>
						<option value="9">Septiembre</option>
						<option value="10">Octubre</option>
						<option value="11">Noviembre</option>
						<option value="12">Diciembre</option>
						';
				}
				if ($mes_numero == '4') {
					$mes_name = 'Abril';
					$mes_todos = '
						<option value="1">Enero</option>
						<option value="2">Febrero</option>
						<option value="3">Marzo</option>
						<option value="5">Mayo</option>
						<option value="6">Junio</option>
						<option value="7">Julio</option>
						<option value="8">Agosto</option>
						<option value="9">Septiembre</option>
						<option value="10">Octubre</option>
						<option value="11">Noviembre</option>
						<option value="12">Diciembre</option>
						';
				}
				if ($mes_numero == '5') {
					$mes_name = 'Mayo';
					$mes_todos = '
							<option value="1">Enero</option>
							<option value="2">Febrero</option>
							<option value="3">Marzo</option>
							<option value="4">Abril</option>
							<option value="6">Junio</option>
							<option value="7">Julio</option>
							<option value="8">Agosto</option>
							<option value="9">Septiembre</option>
							<option value="10">Octubre</option>
							<option value="11">Noviembre</option>
							<option value="12">Diciembre</option>
						';
				}
				if ($mes_numero == '6') {
					$mes_name = 'Junio';
					$mes_todos = '
							<option value="1">Enero</option>
							<option value="2">Febrero</option>
							<option value="3">Marzo</option>
							<option value="4">Abril</option>
							<option value="5">Mayo</option>
							<option value="7">Julio</option>
							<option value="8">Agosto</option>
							<option value="9">Septiembre</option>
							<option value="10">Octubre</option>
							<option value="11">Noviembre</option>
							<option value="12">Diciembre</option>
						';
				}
				if ($mes_numero == '7') {
					$mes_name = 'Julio';
					$mes_todos = '
						<option value="1">Enero</option>
						<option value="2">Febrero</option>
						<option value="3">Marzo</option>
						<option value="4">Abril</option>
						<option value="5">Mayo</option>
						<option value="6">Junio</option>
						<option value="8">Agosto</option>
						<option value="9">Septiembre</option>
						<option value="10">Octubre</option>
						<option value="11">Noviembre</option>
						<option value="12">Diciembre</option>
						';
				}
				if ($mes_numero == '8') {
					$mes_name = 'Agosto';
					$mes_todos = '
						<option value="1">Enero</option>
						<option value="2">Febrero</option>
						<option value="3">Marzo</option>
						<option value="4">Abril</option>
						<option value="5">Mayo</option>
						<option value="6">Junio</option>
						<option value="7">Julio</option>
						<option value="9">Septiembre</option>
						<option value="10">Octubre</option>
						<option value="11">Noviembre</option>
						<option value="12">Diciembre</option>
						';
				}
				if ($mes_numero == '9') {
					$mes_name = 'Septiembre';
					$mes_todos = '
						<option value="1">Enero</option>
						<option value="2">Febrero</option>
						<option value="3">Marzo</option>
						<option value="4">Abril</option>
						<option value="5">Mayo</option>
						<option value="6">Junio</option>
						<option value="7">Julio</option>
						<option value="8">Agosto</option>
						<option value="10">Octubre</option>
						<option value="11">Noviembre</option>
						<option value="12">Diciembre</option>
						';
				}
				if ($mes_numero == '10') {
					$mes_name = 'Octubre';
					$mes_todos = '
						<option value="1">Enero</option>
						<option value="2">Febrero</option>
						<option value="3">Marzo</option>
						<option value="4">Abril</option>
						<option value="5">Mayo</option>
						<option value="6">Junio</option>
						<option value="7">Julio</option>
						<option value="8">Agosto</option>
						<option value="9">Septiembre</option>
						<option value="11">Noviembre</option>
						<option value="12">Diciembre</option>
						';
				}
				if ($mes_numero == '11') {
					$mes_name = 'Noviembre';
					$mes_todos = '
						<option value="1">Enero</option>
						<option value="2">Febrero</option>
						<option value="3">Marzo</option>
						<option value="4">Abril</option>
						<option value="5">Mayo</option>
						<option value="6">Junio</option>
						<option value="7">Julio</option>
						<option value="8">Agosto</option>
						<option value="9">Septiembre</option>
						<option value="10">Octubre</option>
						<option value="12">Diciembre</option>
						';
				}
				if ($mes_numero == '12') {
					$mes_name = 'Diciembre';
					$mes_todos = '
						<option value="1">Enero</option>
								<option value="2">Febrero</option>
								<option value="3">Marzo</option>
								<option value="4">Abril</option>
								<option value="5">Mayo</option>
								<option value="6">Junio</option>
								<option value="7">Julio</option>
								<option value="8">Agosto</option>
								<option value="9">Septiembre</option>
								<option value="10">Octubre</option>
								<option value="11">Noviembre</option>
						';
				}
				$return["content"] .= '
						<input type="hidden" id="e_id" name="id" value="' . $value[0] . '">
						<span><strong>Datos del flete</strong></span>
						<table class="table table-striped">
							<tbody>
								<tr>
									<td class="cell-detail">
										<span>Origen:</span>
										<span class="cell-detail-description">' . $value["municipio_origen"] . '</span>
										<span class="cell-detail-description">(' . $value["depto_origen"] . ' - ' . $value["pais_origen"] . ')</span>
									</td>
									<td class="cell-detail">
										<span>Destino:</span>
										<span class="cell-detail-description">' . $value["municipio_destino"] . '</span>
										<span class="cell-detail-description">(' . $value["depto_destino"] . ' - ' . $value["pais_destino"] . ')</span>
									</td>
									<td class="cell-detail">
										<span>Tipo Vehículo:</span>
										<span class="cell-detail-description">' . $value["nombre"] . '</span>
									</td>
								</tr>
								<tr><td></td><td></td><td></td></tr>
							</tbody>
						</table>
						<div class="form-group col-xs-4">
							<label>(*)Costo Flete:</label>
							<input type="text" name="valor" id="e_valor" placeholder="Flete" class="form-control" value="' . $value["tarifa"] . '">
						</div>
						<div class="form-group col-xs-4">
							<label>(*)Año Vigencia:</label>
							<input type="text" name="vigencia" id="e_vigencia" placeholder="Vigencia" class="form-control" value="' . $value["vigencia"] . '">
						</div>
						<div class="form-group col-xs-4">
							<label>(*)Mes Vigencia:</label><br>
							<select  name="vigencia" id="e_mes" class="form-control input-md" >
							<option value="' . $value["mes"] . '">' . $mes_name . '</option>
								' . $mes_todos . '
							</select>
						</div>
						<div class="col-xs-2"></div>
						<div class="row"></div>
					';
			}
		} else {
			$_msg_error .= "<p>Error en el perocesamiento de la solicitud.</p>";
		}
		break;

	case 'buscaFlete':
		$_msg_control .= "Entro en la accion buscaFlete.\n";

		$sql = '
				SELECT
					ct.id,
					cmu1.id id_origen,cmu1.municipio municipio_origen,cmu1.depto depto_origen,cmu1.pais pais_origen,
					cmu2.id id_destino,cmu2.municipio municipio_destino,cmu2.depto depto_destino,cmu2.pais pais_destino,
					ctv.id,ctv.nombre,
					ct.tarifa,ct.vigencia,ct.estado
				FROM
					cmx_tarifas ct
					INNER JOIN cmx_municipios cmu1 ON ct.origen = cmu1.id
					INNER JOIN cmx_municipios cmu2 ON ct.destino = cmu2.id
					INNER JOIN cmx_tipo_vehiculos ctv ON ct.tipo_vehiculo = ctv.id
				WHERE
					ct.id = ' . $_POST["id"] . '
			;';
		$result = $Data->getConsulta($sql);

		$return["content"] = '';
		if ($result) {
			foreach ($result["rowsData"] as $key => $value) {
				$return["content"] .= '
						<input type="hidden" id="e_id" name="id" value="' . $value[0] . '">
						<span><strong>Datos del flete</strong></span>
						<table class="table table-striped">
							<tbody>
								<tr>
									<td class="cell-detail">
										<span>Origen:</span>
										<span class="cell-detail-description">' . $value["municipio_origen"] . '</span>
										<span class="cell-detail-description">(' . $value["depto_origen"] . ' - ' . $value["pais_origen"] . ')</span>
									</td>
									<td class="cell-detail">
										<span>Destino:</span>
										<span class="cell-detail-description">' . $value["municipio_destino"] . '</span>
										<span class="cell-detail-description">(' . $value["depto_destino"] . ' - ' . $value["pais_destino"] . ')</span>
									</td>
									<td class="cell-detail">
										<span>Tipo Vehículo:</span>
										<span class="cell-detail-description">' . $value["nombre"] . '</span>
									</td>
								</tr>
								<tr><td></td><td></td><td></td></tr>
							</tbody>
						</table>
						<div class="col-xs-2"></div>
						<div class="form-group col-xs-4">
							<label>(*) Flete:</label>
							<input type="text" name="valor" id="e_valor" placeholder="Flete" class="form-control" value="' . $value["tarifa"] . '">
						</div>
						<div class="form-group col-xs-4">
							<label>(*) Vigencia:</label>
							<input type="text" name="vigencia" id="e_vigencia" placeholder="Vigencia" class="form-control" value="' . $value["vigencia"] . '">
						</div>
						<div class="col-xs-2"></div>
						<div class="row"></div>
					';
			}
		} else {
			$_msg_error .= "<p>Error en el perocesamiento de la solicitud.</p>";
		}
		break;

	case 'guardaFlete':
		$_msg_control .= "Entro en la accion guardaFlete.\n";

		$array = array(
			"origen" 			=> $_POST["origen"],
			"destino" 			=> $_POST["destino"],
			"tipo_vehiculo"		=> $_POST["tipo_vehiculo"],
			"tarifa" 			=> $_POST["tarifa"],
			"vigencia" 			=> $_POST["vigencia"]
		);

		if (!$Data->setRegistro("cmx_tarifas", $array)) {
			$_msg_error .= "<p>Error al generar la tarifa.</p>";
		}
		break;

	case 'editaFlete':
		$_msg_control .= "Entro en la accion guardaFlete.\n";

		$array = array(
			"tarifa" 			=> $_POST["tarifa"],
			"vigencia" 			=> $_POST["vigencia"]
		);

		if (!$Data->updateRegistro("cmx_tarifas", $array, (int)$_POST['id'])) {
			$_msg_error .= "<p>Error al editar la tarifa.</p>";
		}

		break;

	case 'inactivarFlete':
		$_msg_control .= "Entro en la accion inactivaFlete.\n";
		$array = array(
			"estado" => 0
		);

		if (!$Data->updateRegistro("cmx_fletes_nacional", $array, (int)$_POST['id'])) {
			$_msg_error .= "<p>Error al inactivar la tarifa.</p>";
		}

		break;

	case 'editaFlete2':
		$_msg_control .= "Entro en la accion guardaFlete.\n";
		$fecha = date('Y-m-d');
		$hora = date('G:i:s');
		$array = array(
			"tarifa" 			=> $_POST["tarifa"],
			"vigencia" 			=> $_POST["vigencia"],
			"mes"				=> $_POST["mes"],
			"usuario"			=> $_SESSION["usuario"]["nom_usuario"],
			"fecha"				=> $fecha,
			"hora"				=> $hora

		);

		if (!$Data->updateRegistro("cmx_fletes_nacional", $array, (int)$_POST['id'])) {
			$_msg_error .= "<p>Error al editar el Flete.</p>";
		}

		break;

	case 'uploadMasivo':
		$PDO = $Data2->conectar();
		$fecha = date('Y-m-d');
		$hora = date('G:i:s');
		try {
			// 1) Leemos el JSON
			$data = file_get_contents("php://input");
			$rows = json_decode($data, true);

			if (!$rows) {
				echo "No se recibieron datos válidos.";
				exit;
			}

			// 2) Preparamos la sentencia SQL con placeholders
			$sql = "INSERT INTO cmx_fletes_nacional (
				vigencia,
				mes,
				origen,
				destino,
				tipo_vehiculo,
				tarifa,
				tipo_origen,
				estado,
				usuario,
				fecha,
				hora
		) VALUES (
				:vigencia,
				:mes,
				:origen,
				:destino,
				:tipo_vehiculo,
				:tarifa,
				:tipo_origen,
				:estado,
				:usuario,
				:fecha,
				:hora
		)";

			// Preparamos la consulta (solo una vez, fuera del foreach)
			$stmt = $PDO->prepare($sql);

			// (Opcional) Iniciar una transacción para un proceso masivo
			// $PDO->beginTransaction();

			// 3) Iteramos cada objeto del array y ejecutamos la sentencia
			foreach ($rows as $row) {
				// Validar/asegurar que existan las claves o asignar valores por defecto
				$vigencia        = isset($row["vigencia"])        ? $row["vigencia"]        : "";
				$mes        		 = isset($row["mes"])        			? $row["mes"]         		: "";
				$origen          = isset($row["origen"])          ? $row["origen"]          : "";
				$destino         = isset($row["destino"])         ? $row["destino"]         : "";
				$tipo_vehiculo   = isset($row["tipo_vehiculo"])   ? $row["tipo_vehiculo"]   : "";
				$tarifa          = isset($row["tarifa"])          ? $row["tarifa"]          : "";
				$tipo_origen     = isset($row["tipo_origen"])     ? $row["tipo_origen"]     : "";
				$estado          = isset($row["estado"])          ? $row["estado"]          : "";
				$usuario         = isset($row["usuario"])         ? $row["usuario"]         : $_SESSION["usuario"]["nom_usuario"];
				$fecha           = isset($row["fecha"])           ? $row["fecha"]          	: $fecha;
				$hora          	 = isset($row["hora"])            ? $row["hora"]            : $hora;

				// Ejecutamos la sentencia, pasando un array asociativo con los valores
				$stmt->execute([
					':vigencia'        => $vigencia,
					':mes'        		 => $mes,
					':origen'          => $origen,
					':destino'         => $destino,
					':tipo_vehiculo'   => $tipo_vehiculo,
					':tarifa'          => $tarifa,
					':tipo_origen'     => $tipo_origen,
					':estado'          => $estado,
					':usuario'         => $usuario,
					':fecha'           => $fecha,
					':hora'            => $hora,
				]);
			}

			// (Opcional) Confirmar la transacción
			// $PDO->commit();

			$_msg_control .= "Datos insertados exitosamente.";
		} catch (PDOException $e) {
			// (Opcional) Si iniciaste transacción, hacer rollback
			// $PDO->rollBack();
			// echo "Error en la inserción: " . $e->getMessage();
			$_msg_error = "Error en la inserción: " . $e->getMessage();
		}
		break;

	default:
		$_msg_control .= "Error en la seleccion del action.\n";
		break;
}

$return["control"] = $_msg_control;
if ($_msg_error) {
	$return["error"] = $_msg_error;
}
if ($_array_result) {
	$return["result"] = $_array_result;
}

echo json_encode($return);
