<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';
include '../models/municipiosModel.php';
//include '../controllers/web_serviceController.php';

$_msg_error = "";
$_msg_control = "Entro en remitentes_ajax.php\n";
$_array_result = array();

$Data = new Consultas;
$Model = new Model;
$Municipios = new municipiosModel;

switch ($_GET["action"]) {
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

		break;

	case 'verRemiDestDoc':
		$_msg_control .= "Entro en la accion verRemiDestDoc.\n";

		$sql = 'SELECT 
					crd.*,
					cm.municipio, cm.depto, cm.pais, cm.rndc_codigo_ciudad,
					CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") CIUDAD_REMI_DEST,
					cc.nombre NOM_CLIENTE
				FROM 
					cmx_remitente_destinatario crd
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					INNER JOIN cmx_clientes cc ON cc.id = crd.id_cliente
				WHERE 
					crd.documento = "' . $Model->limpiaTexto($_POST["doc_remi_dest"]) . '"
					AND crd.id_cliente = ' . $Model->limpiaTexto($_POST["id_cliente"]) . '
					AND crd.nombre = "' . $Model->limpiaTexto($_POST["nom_remitente"]) . '"
					AND crd.id_ciudad = ' . $Model->limpiaTexto($_POST["municipio"]) . '
			;';
		$result = $Data->getConsulta($sql);
		// $return["sql"] = $sql;
		$return["response"] = $result;
		break;

	case 'rndcGuardaRemitente': // RNDC NUEVO
		$_msg_control .= "Entro en la accion rndcGuardaRemitente.\n";

		// Se busca cual es el siguiente id del la tabla de cmx_remitentes_destinatarios para asignarlo como el codigo de sede
		//del tercero en el RNDC
		session_start();
		$sql = 'SELECT (MAX(id)+1) AS max_id FROM cmx_remitente_destinatario';
		$result = $Data->getConsulta($sql);
		$_CODSEDETERCERO = $result["rowsData"][0]['max_id'];
		//
		$fecha = date('Y-m-d');
		$hora = date('H:i:s');
		$user = $_SESSION["usuario"]["nom_usuario"];

		//INSERCION DE CONTENIDO DEL TERCERO EN EL RNDC
		$arrayMinTrans = array();
		// Solicitud
		$arrayMinTrans["solicitud"] = array(
			"tipo" => 3,
			"procesoid" => 11,
		);
		// Variable que se envían para la consulta
		$arrayMinTrans["variables"] = "INGRESOID";

		$documento_tercero = $_POST["documento"];
		if ($_POST["tipo_documento"] == "NIT") {
			$documento_tercero = $Model->limpiaTexto($_POST["documento"]) . $Model->limpiaTexto($_POST["digito_verificacion"]);
		} else {
			$documento_tercero = $Model->limpiaTexto($_POST["documento"]);
		}

		$arrayMinTrans["documento"] = array(
			"NUMNITEMPRESATRANSPORTE" => MINTRANS_NIT,
			"NUMIDTERCERO" => "'" . $documento_tercero . "'",
			"CODSEDETERCERO" => "'" . $_CODSEDETERCERO . "'",
		);
		$return["verifica_tercero_array"] = $arrayMinTrans;

		$result = $Data->getRNDCQueryArray($arrayMinTrans);
		$return["verifica_tercero_result"] = $result;

		// Se valida si la operación fue exitosa
		if (isset($result["ErrorMSG"])) {
			// Solicitud
			$arrayMinTrans["solicitud"] = array(
				"tipo" => 1,
				"procesoid" => 11,
			);
			// Variable que se envían para la realizació del proceso
			$arrayMinTrans["variables"] = array(
				"NUMNITEMPRESATRANSPORTE" => MINTRANS_NIT,
				"CODTIPOIDTERCERO" => $Data->getRNDCTipoDocumento($_POST["tipo_documento"]),
				"NUMIDTERCERO" => $Model->limpiaTexto($documento_tercero),
				"NOMIDTERCERO" => $Model->limpiaTexto($_POST["rndc_nombre"]),
				"NOMENCLATURADIRECCION" => $Model->limpiaTexto($_POST["direccion"]),
				"LATITUD" => substr($_POST["latitud"], 0, 15),
				"LONGITUD" => substr($_POST["longitud"], 0, 15),
				"CODMUNICIPIORNDC" => $_POST["rndc_id_municipio"],
			);
			$arrayMinTrans["variables"]["NUMIDTERCERO"] = $Model->limpiaTexto($documento_tercero);
			$arrayMinTrans["variables"]["CODSEDETERCERO"] = $_CODSEDETERCERO;
			$arrayMinTrans["variables"]["NOMSEDETERCERO"] = 'PRINCIPAL';
			if ($_POST["tipo_documento"] == "NIT") {
				$arrayMinTrans["variables"]["NUMIDTERCERO"] = $documento_tercero;
			}

			if (isset($_POST["primer_apellido"])) {
				$arrayMinTrans["variables"]["PRIMERAPELLIDOIDTERCERO"] = $Model->limpiaTexto($_POST["primer_apellido"]);
			}
			if (isset($_POST["segundo_apellido"]) and $_POST["segundo_apellido"] != "") {
				$arrayMinTrans["variables"]["SEGUNDOAPELLIDOIDTERCERO"] = $Model->limpiaTexto($_POST["segundo_apellido"]);
			}
			if (isset($_POST["contacto"]) and $_POST["contacto"] != "" and $_POST["contacto"] != 0) {
				$arrayMinTrans["variables"]["NUMTELEFONOCONTACTO"] = $_POST["contacto"];
			}
			if (isset($_POST["celular"]) and $_POST["celular"] != "" and $_POST["celular"] != 0) {
				$arrayMinTrans["variables"]["NUMCELULARPERSONA"] = $_POST["celular"];
			}
			$return["crea_tercero_array"] = $arrayMinTrans;
			//Guardar variables
			$cadena_xml = implode(" ", $arrayMinTrans["variables"]);
			//print_r($cadena_xml);
			$sql = "INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario)
					VALUES(null,'" . $documento_tercero . "','Tercero',1,1,'" . $cadena_xml . "','" . $fecha . "','" . $hora . "','" .
				$user . "')";
			$Data->ejecuteRegistro($sql);
			// Se ejecuta la consulta hacia el RNDC del ministerio de transporte
			$result = $Data->getRNDCQueryArray($arrayMinTrans);

			$return["crea_tercero_result"] = $result;

			// Se valida si la operación fue exitosa
			if (isset($result["ErrorMSG"])) {
				$_msg_error .= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
				$_msg_error .= $result["ErrorMSG"];
				$respuesta = $result["ErrorMSG"];
			} else {
				$rndc_ingresoid = $result["ingresoid"];
				$return["crea_tercero_id_crea"] = $rndc_ingresoid;
				$respuesta = $result["ingresoid"];
			}
			$sql2 = "INSERT INTO
			web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)
			VALUES(null,'" . $documento_tercero . "','Tercero',2,1,'" . $cadena_xml . "','" . $fecha . "','" . $hora . "','" .
				$user . "','" . $respuesta . "','Remitente','Crear')";
			$Data->ejecuteRegistro($sql2);
		} else {
			$_msg_error .= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
			$_msg_error .= "<p>Registro ya existe en el RNDC</p>";
		}
		break;


	case 'rndcEditaRemitente':
		$_msg_control .= "Entro en la accion rndcEditaRemitente.\n";
		/********* REGISTRAR DATO EN TABLA DE TRANSMISION *****************/
		session_start();
		$fecha = date('Y-m-d');
		$hora = date('H:i:s');
		$user = $_SESSION["usuario"]["nom_usuario"];
		$sql1 = "INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,fecha,hora,usuario,tipo_tercero,accion)VALUES(null,'" .
			$_POST["documento"] . "','Tercero',0,1,'" . $fecha . "','" . $hora . "','" . $user . "','Remitente','Actualizar')";
		$Data->ejecuteRegistro($sql1);

		$sqlsede = 'SELECT codigo_sede FROM cmx_remitente_destinatario WHERE documento=' . $_POST["documento"] . ' 
			AND digito_verificacion=' . $_POST["digito_verificacion"] . ' ORDER BY id DESC LIMIT 1';
		$resultidsede = $Data->getConsulta($sqlsede);
		$_CODSEDE = $resultidsede["rowsData"][0]['codigo_sede'];

		if ($Data) {
			$array = array();

			//$array["rndc_id"] = $rndc_ingresoid;
			$array["rndc_id"] = '';
			$array["tipo_documento"] = $_POST["tipo_documento"];
			$array["nombre"] = $Model->limpiaTexto($_POST["nombre"]);
			$array["sigla"] = $Model->limpiaTexto($_POST["sigla"]);
			$array["codigo_postal"] = $_POST["codigo_postal"];
			$array["direccion"] = $Model->limpiaTexto($_POST["direccion"]);
			$array["latitud"] = $_POST["latitud"];
			$array["longitud"] = $_POST["longitud"];
			$array["contacto"] = $_POST["contacto"];
			$array["celular"] = $_POST["celular"];
			$array["como_llegar"] = $Model->limpiaTexto($_POST["como_llegar"]);
			$array["descripcion_actividad"] = $Model->limpiaTexto($_POST["descripcion_actividad"]);
			$array["dias_atencion"] = $Model->limpiaTexto($_POST["dias_atencion"]);
			$array["horario_atencion"] = $Model->limpiaTexto($_POST["horario_atencion"]);
			$array["codigo_sede"] = $_CODSEDE;

			$array_edita_remi_dest = array();
			foreach ($array as $key => $value) {
				if ($value) {
					$array_edita_remi_dest[$key] = $value;
				}
			}
			// $return["array_edita"] = $array;
			// $return["array_edita_1"] = $array_edita_remi_dest;
			$Data->updateRegistro("cmx_remitente_destinatario", $array_edita_remi_dest, (int) $_POST["id_remi_dest"]);
		}
		/******** INSERCION DE CONTENIDO DEL TERCERO EN EL RNDC ********/
		$rndc_ingresoid = NULL;
		// Se filtra si el remitente está dentro de Colombia

		if ($_POST["rndc_id_municipio"]) {

			$arrayMinTrans = array();
			// Solicitud
			$arrayMinTrans["solicitud"] = array(
				"tipo" => 1,
				"procesoid" => 11,
			);
			//Consulta datos en el RNDC
			// Variable que se envían para la consulta
			$arrayMinTrans["variables"] = "INGRESOID";
			$documento_tercero = $_POST["documento"];
			if ($_POST["tipo_documento"] == "NIT") {
				$documento_tercero = $Model->limpiaTexto($_POST["documento"]) . $Model->limpiaTexto($_POST["digito_verificacion"]);
			} else {
				$documento_tercero = $Model->limpiaTexto($_POST["documento"]);
			}

			$arrayMinTrans["documento"] = array(
				"NUMNITEMPRESATRANSPORTE" => MINTRANS_NIT,
				"NUMIDTERCERO" => "'" . $documento_tercero . "'",

			);
			$return["verifica_tercero_array"] = $arrayMinTrans;
			$result = $Data->getRNDCQueryArray($arrayMinTrans);
			$return["verifica_tercero_result"] = $result;

			if (isset($result["ErrorMSG"])) {
				//echo 'no existe RNDC INSERT';
				// Variable que se envían para la realizació del proceso
				$arrayMinTrans["variables"] = array(
					"NUMNITEMPRESATRANSPORTE" => MINTRANS_NIT,
					"CODTIPOIDTERCERO" => $Data->getRNDCTipoDocumento($_POST["tipo_documento"]),
					"NUMIDTERCERO" => $Model->limpiaTexto($documento_tercero),
					"NOMIDTERCERO" => $Model->limpiaTexto($_POST["rndc_nombre"]),
					"NOMENCLATURADIRECCION" => $Model->limpiaTexto($_POST["direccion"]),
					"LATITUD" => substr($_POST["latitud"], 0, 15),
					"LONGITUD" => substr($_POST["longitud"], 0, 15),
					"CODMUNICIPIORNDC" => $_POST["rndc_id_municipio"],
				);
				//SEDE DEL REMITENTE - ACTUALIZAR
				$arrayMinTrans["variables"]["NUMIDTERCERO"] = $Model->limpiaTexto($documento_tercero);
				$arrayMinTrans["variables"]["CODSEDETERCERO"] = $_CODSEDE;
				$arrayMinTrans["variables"]["NOMSEDETERCERO"] = 'PRINCIPAL';
				if ($_POST["tipo_documento"] == "NIT") {
					$arrayMinTrans["variables"]["NUMIDTERCERO"] = $Model->limpiaTexto($documento_tercero);
				}
				if (isset($_POST["primer_apellido"])) {
					$arrayMinTrans["variables"]["PRIMERAPELLIDOIDTERCERO"] = $Model->limpiaTexto($_POST["primer_apellido"]);
				}
				if (isset($_POST["segundo_apellido"]) and $_POST["segundo_apellido"] != "") {
					$arrayMinTrans["variables"]["SEGUNDOAPELLIDOIDTERCERO"] = $Model->limpiaTexto($_POST["segundo_apellido"]);
				}
				if (isset($_POST["contacto"]) and $_POST["contacto"] != "" and $_POST["contacto"] != 0) {
					$arrayMinTrans["variables"]["NUMTELEFONOCONTACTO"] = $_POST["contacto"];
				}
				if (isset($_POST["celular"]) and $_POST["celular"] != "" and $_POST["celular"] != 0) {
					$arrayMinTrans["variables"]["NUMCELULARPERSONA"] = $_POST["celular"];
				}

				$cadena = implode(",", $arrayMinTrans["variables"]);

				$sql2 = "INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,tipo_tercero,accion)
					VALUES(null,'" . $documento_tercero . "','Tercero',1,1,'" . $cadena . "','" . $fecha . "','" . $hora . "','" . $user . "','Remitente','Actualizar') ";
				$Data->ejecuteRegistro($sql2);
				// $return["edita_tercero_array"] = $arrayMinTrans;
				// Se ejecuta la consulta hacia el RNDC del ministerio de transporte
				$result = $Data->getRNDCQueryArray($arrayMinTrans);
				// $return["edita_tercero_result"] = $result;
				if (isset($result["ErrorMSG"])) {
					//convertir string  a Array
					$array_p2 = explode(" ", $result["ErrorMSG"]);
					$codigo = str_replace(':', '', $array_p2[2]);
					if ($codigo == 'TER015') { //info del ministerio
						$valor = 1;
						$sqlf = "UPDATE cmx_remitente_destinatario SET estado_actualizacion_rndc=" . $valor . " WHERE  id=" . $_POST["id_remi_dest"] . "";
						$Data->ejecuteRegistro($sqlf);
					} else {
						$valor = 0;
						$sqlf = "UPDATE cmx_remitente_destinatario SET estado_actualizacion_rndc=" . $valor . " WHERE  id=" . $_POST["id_remi_dest"] . "";
						$Data->ejecuteRegistro($sqlf);
					}
				} else {
					$valor = 1;
					$sqlf = "UPDATE cmx_remitente_destinatario SET estado_actualizacion_rndc=" . $valor . " WHERE  id=" . $_POST["id_remi_dest"] . "";
					$Data->ejecuteRegistro($sqlf);
				}
				// Se valida si la operación fue exitosa

				if (isset($result["ErrorMSG"])) {
					$_msg_error .= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
					$_msg_error .= $result["ErrorMSG"];
					$sql3 = "INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)
						VALUES(null,'" . $documento_tercero . "','Tercero',2,1,'" . $cadena . "','" . $fecha . "','" . $hora . "','" . $user . "','" . $result["ErrorMSG"] . "','Remitente','Actualizar')";
					$Data->ejecuteRegistro($sql3);
				} else {
					$rndc_ingresoid = $result["ingresoid"];
					$sql3 = "INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)
						VALUES(null,'" . $documento_tercero . "','Tercero',1,1,'" . $cadena . "','" . $fecha . "','" . $hora . "','" . $user . "','" . $result["ingresoid"] . "','Remitente','Actualizar')";
					$Data->ejecuteRegistro($sql3);
					// $return["edita_tercero_id_crea"] = $rndc_ingresoid;


				}
			} else {
				// Variable que se envían para la consulta
				$arrayMinTrans["variables"] = "INGRESOID";
				$documento_tercero = $_POST["documento"];
				if ($_POST["tipo_documento"] == "NIT") {
					$documento_tercero = $Model->limpiaTexto($_POST["documento"]) . $Model->limpiaTexto($_POST["digito_verificacion"]);
				} else {
					$documento_tercero = $Model->limpiaTexto($_POST["documento"]);
				}
				//echo 'ya existe en el RNDC UPDATE';
				// Variable que se envían para la realizació del proceso
				$arrayMinTrans["variables"] = array(
					"NUMNITEMPRESATRANSPORTE" => MINTRANS_NIT,
					"CODTIPOIDTERCERO" => $Data->getRNDCTipoDocumento($_POST["tipo_documento"]),
					"NUMIDTERCERO" => $Model->limpiaTexto($documento_tercero),
					"NOMIDTERCERO" => $Model->limpiaTexto($_POST["rndc_nombre"]),
					"NOMENCLATURADIRECCION" => $Model->limpiaTexto($_POST["direccion"]),
					"LATITUD" => substr($_POST["latitud"], 0, 15),
					"LONGITUD" => substr($_POST["longitud"], 0, 15),
					"CODMUNICIPIORNDC" => $_POST["rndc_id_municipio"],
				);

				$arrayMinTrans["variables"]["NUMIDTERCERO"] = $Model->limpiaTexto($documento_tercero);
				$arrayMinTrans["variables"]["CODSEDETERCERO"] = $_CODSEDE;
				$arrayMinTrans["variables"]["NOMSEDETERCERO"] = 'PRINCIPAL';

				if ($_POST["tipo_documento"] == "NIT") {
					$arrayMinTrans["variables"]["NUMIDTERCERO"] = $Model->limpiaTexto($documento_tercero);
				}

				if (isset($_POST["primer_apellido"])) {
					$arrayMinTrans["variables"]["PRIMERAPELLIDOIDTERCERO"] = $Model->limpiaTexto($_POST["primer_apellido"]);
				}
				if (isset($_POST["segundo_apellido"]) and $_POST["segundo_apellido"] != "") {
					$arrayMinTrans["variables"]["SEGUNDOAPELLIDOIDTERCERO"] = $Model->limpiaTexto($_POST["segundo_apellido"]);
				}
				if (isset($_POST["contacto"]) and $_POST["contacto"] != "" and $_POST["contacto"] != 0) {
					$arrayMinTrans["variables"]["NUMTELEFONOCONTACTO"] = $_POST["contacto"];
				}
				if (isset($_POST["celular"]) and $_POST["celular"] != "" and $_POST["celular"] != 0) {
					$arrayMinTrans["variables"]["NUMCELULARPERSONA"] = $_POST["celular"];
				}
				// $return["edita_tercero_array"] = $arrayMinTrans;
				$cadena = implode(",", $arrayMinTrans["variables"]);
				$sql2 = "INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena,fecha,hora,usuario,tipo_tercero,accion)
				VALUES(null,'" . $documento_tercero . "','Tercero',1,1,'" . $cadena . "','" . $fecha . "','" . $hora . "','" . $user . "','Remitente','Actualizar')";
				$Data->ejecuteRegistro($sql2);
				// Se ejecuta la consulta hacia el RNDC del ministerio de transporte
				$result = $Data->getRNDCQueryArray($arrayMinTrans);
				// $return["edita_tercero_result"] = $result;
				if (isset($result["ErrorMSG"])) {
					//convertir string  a Array
					$array_p2 = explode(" ", $result["ErrorMSG"]);
					$codigo = str_replace(':', '', $array_p2[2]);
					if ($codigo == 'TER015') { //info del ministerio
						$valor = 1;
						$sqlf = "UPDATE cmx_remitente_destinatario SET estado_actualizacion_rndc=" . $valor . " WHERE  id=" . $_POST["id_remi_dest"] . "";
						$Data->ejecuteRegistro($sqlf);
					} else {
						$valor = 0;
						$sqlf = "UPDATE cmx_remitente_destinatario SET estado_actualizacion_rndc=" . $valor . " WHERE  id=" . $_POST["id_remi_dest"] . "";
						$Data->ejecuteRegistro($sqlf);
					}
				} else {
					$valor = 1;
					$sqlf = "UPDATE cmx_remitente_destinatario SET estado_actualizacion_rndc=" . $valor . " WHERE  id=" . $_POST["id_remi_dest"] . "";
					$Data->ejecuteRegistro($sqlf);
				}
				// Se valida si la operación fue exitosa
				if (isset($result["ErrorMSG"])) {
					$_msg_error .= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
					$_msg_error .= $result["ErrorMSG"];
					$sql3 = "INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)
						VALUES(null,'" . $documento_tercero . "','Tercero',2,1,'" . $cadena . "','" . $fecha . "','" . $hora . "','" . $user . "','" . $result["ErrorMSG"] . "','Remitente','Actualizar')";
					$Data->ejecuteRegistro($sql3);
				} else {
					$rndc_ingresoid = $result["ingresoid"];
					$sql3 = "INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)
						VALUES(null,'" . $documento_tercero . "','Tercero',1,1,'" . $cadena . "','" . $fecha . "','" . $hora . "','" . $user . "','" . $result["ingresoid"] . "','Remitente','Actualizar')";
					$Data->ejecuteRegistro($sql3);
					//$return["edita_tercero_id_crea"] = $rndc_ingresoid;
				}
			}
		}
		break;

	case 'buscaDepto':
		$_msg_control .= "Entro en la accion buscaDepto.\n";
		// $Municipios = new municipiosModel;
		$return["depto"] = "<label>(*) Depto / Estado:</label>" . $Municipios->getHtmlSelectDeptos_sm(
			"id_depto",
			"",
			$_POST["pais"]
		);
		break;

	case 'buscaCiudad':
		$_msg_control .= "Entro en la accion buscaDepto.\n";
		// $Municipios = new municipiosModel;
		$return["municipio"] = "<label>(*) Ciudad:</label>" . $Municipios->getHtmlSelectCiudadFiltered_sm(
			"id_ciudad",
			"",
			$_POST["pais"],
			$_POST["depto"]
		);
		break;

	case 'rndcGuardaresultado':
		$_msg_control .= "Entro en la accion actualizarespuestarndc.\n";
		$numero_documento = $_POST["numero_documento"];
		//$sql = 'SELECT (MAX(id)) FROM cmx_remitente_destinatario WHERE documento=' . $numero_documento;
		$sql = 'SELECT id AS max_id_rem_dest FROM cmx_remitente_destinatario WHERE documento=' . $numero_documento . ' order by id desc Limit 1';
		$result = $Data->getConsulta($sql);
		$_CODSEDETERCERO = $result["rowsData"][0]['max_id_rem_dest'];
		if (isset($_POST["rndcid"])) {
			$rndcid = $_POST["rndcid"];
			$valor = 1;
			$sqlf = "UPDATE cmx_remitente_destinatario SET estado_actualizacion_rndc=" . $valor . ", codigo_sede=" . $_CODSEDETERCERO . " WHERE  id=" . $_CODSEDETERCERO . " AND documento='" . $numero_documento . "'";
			$Data->ejecuteRegistro($sqlf);
			$result = true;
		} else {
			$rndcid = "";
			$valor = 0;
			$sqlf = "UPDATE cmx_remitente_destinatario SET estado_actualizacion_rndc=" . $valor . ", codigo_sede=" . $_CODSEDETERCERO . " WHERE  id=" . $_CODSEDETERCERO . " AND documento='" . $numero_documento . "'";
			$Data->ejecuteRegistro($sqlf);
			$result = false;
		}
		$return["activa_tercero_result"] = $result;

		break;

	default:
		$_msg_control .= "Error en la seleccion de la action.\n";
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
