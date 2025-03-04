<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';
include '../models/clientesModel.php';
include '../models/importacionModel.php';

$Data = new Consultas;
$PDO = new Database2;
$Clientes = new clientesModel;
$Importacion = new importacionModel;

//Variable vacía (para evitar los E_NOTICE)
$mensaje = "";

/***** CONSULTAS PARA GENRACIÓN DE SELECT DE PLANTILLAS *****/
if (isset($_POST['tipo_operacion']) and $_POST['tipo_operacion']) {
	$mensaje .= "<label>(*) Plantilla de actividades:</label><br>";
	$sql = '
			SELECT 
				cpl.*
			FROM 
				cmx_plantillas cpl
			WHERE 
				cpl.estado = 1
				AND cpl.id_cliente = ' . $_POST['id_cliente'] . '
				AND cpl.tipo_proyecto = "' . $_POST['tipo_operacion'] . '"
			ORDER BY cpl.nom_plantilla;
		';
	// $arrayResult = $Data->getConsulta($sql);
	$arrayResult = $PDO->prepare($sql);
	$arrayResult->execute();
	$arrayResult = $arrayResult->fetchAll(PDO::FETCH_ASSOC);
	// print_r("<pre>");
	// print_r($arrayResult);
	// print_r("</pre>");

	if ($arrayResult) {
		$select = '
				<select class="form-control input-sm" name="id_plantilla" id="slct_plantilla_" aria-hidden="true">
			';
		$select .= '<option value="" selected disabled>Seleccione</option>';

		foreach ($arrayResult as $key => $value) {
			$select .= '<option value="' . $value['id'] . '">[ ' . $value["tipo_proyecto"] . ' ] ' . $value["nom_plantilla"] . '</option>';
		}
		$select .= '</select>';
		$mensaje .= $select;
	} else {
		$mensaje .= '<p class="text-danger">No existen plantillas para los parámetros señalados de <strong>Tipo de Operación</strong> y <strong>Solicitud Urbano</strong>.</p>';
	}
}

/***** FIN CONSULTAS PARA GENRACIÓN DE SELECT DE PLANTILLAS *****/


/***** CONSULTAS PARA LLENADO DE LA TABLA DE PLANTILLA *****/
// segmento de validacion de select plantilla
if (isset($_POST['valorBusqueda'])) {
	$consultaBusqueda = $_POST['valorBusqueda'];
}

//Comprueba si $consultaBusqueda está seteado
if (isset($consultaBusqueda) and isset($_GET["orden_compra"])) {
	$sql = "
			SELECT 
				cap.*,
				cpl.id id_plantilla
			FROM 
				cmx_actividades_plantilla cap
				INNER JOIN cmx_plantillas cpl ON cap.id_plantilla = cpl.id
			WHERE 
				cap.estado = 1
				AND cpl.estado = 1
				-- AND cpl.id_cliente IN (1,2)
				AND cpl.id = " . $consultaBusqueda . " 
			ORDER BY cap.orden;
		";
	// $arrayResult = $Data->getConsulta($sql);
	$arrayResult = $PDO->prepare($sql);
	$arrayResult->execute();
	$arrayResult = $arrayResult->fetchAll(PDO::FETCH_ASSOC);
	// print_r("<pre>");
	// print_r($arrayResult);
	// print_r("</pre>");

	// Se pregunta si existe actividades de solicitud de vehículo en la plantilla para tomar cual simultaneidad tiene
	$sql = "
			SELECT 
				cap.*
			FROM 
				cmx_actividades_plantilla cap
			WHERE 
				cap.id_plantilla = " . $consultaBusqueda . "
				AND cap.nombre = 'Solicitud de vehículo'
				AND cap.integracion = 'soluciones'
				AND cap.simultaneo != '0';
		";
	// $arrayResult_1 = $Data->getConsulta($sql);
	$arrayResult_1 = $PDO->prepare($sql);
	$arrayResult_1->execute();
	$arrayResult_1 = $arrayResult_1->fetchAll(PDO::FETCH_ASSOC);
	// print_r("<pre>");
	// print_r($arrayResult_1);
	// print_r("</pre>");

	if ($arrayResult_1) {
		$_simultaneo = $arrayResult_1[0]["simultaneo"];
		$_flag_simultaneo = true;
	} else {
		// echo "<p>Se debe mirar cual simultaneo se encuentra disponible</p>";
		$sql = "
				SHOW COLUMNS FROM 
					cmx_actividades_plantilla 
				LIKE 'simultaneo' 
			";
		// echo "<p>" . $sql . "</p>";
		// $result = $Data->getConsulta($sql);
		$result = $PDO->prepare($sql);
		$result->execute();
		$result = $result->fetchAll(PDO::FETCH_ASSOC);

		foreach ($result as $key_1 => $value_1) {
			$value_1["Type"] = str_replace("enum(", "", $value_1["Type"]);
			$value_1["Type"] = str_replace(")", "", $value_1["Type"]);
			$value_1["Type"] = str_replace("'", "", $value_1["Type"]);

			$arrayTipoActividad = explode(",", $value_1["Type"]);
		}

		foreach ($arrayTipoActividad as $key_1 => $value_1) {
			if ($value_1 != 0) {
				$sql = "
						SELECT 
							COUNT(cap.id) CUANTOS
						FROM 
							cmx_actividades_plantilla cap
						WHERE 
							cap.id_plantilla = " . $consultaBusqueda . "
							AND cap.simultaneo = '" . $value_1 . "'
					";
				// echo "<p>" . $sql . "</p>";
				// $result = $Data->getConsulta($sql);
				$result = $PDO->prepare($sql);
				$result->execute();
				$result = $result->fetch(PDO::FETCH_ASSOC);

				// print_r("<pre>");
				// print_r($result);
				// print_r("</pre>");
				$_flag_simultaneo = false;
				if ($result[0]["CUANTOS"] == 0) {
					$_simultaneo = $value_1;
					$_flag_simultaneo = true;
					break;
				}
			}
		}
	}

	$i = "";
	$j = 0;
	$_flag_simultaneo = false;
	$_flag_asigna_simultaneo = 0;
	foreach ($arrayResult as $key => $value) {
		// print_r("<pre>");
		// print_r($value);
		// print_r("</pre>");
		$_flag_valida_actividad_solicitud = true;

		// Se pregunta si se debe quitar las actividades de solicitud de cita al puerto que vienen del bloque de actividades de la plantilla 
		$_flag_incluye_actividad = true;
		if ($_POST["solicita_urbano"] == 1 and ($value["nombre"] == "Solicitud de cita al Puerto" or $value["nombre"] == "Asignación de cita del Puerto")) {
			$_flag_incluye_actividad = false;
		}

		// Se valida la simultaneidad de los bloque de solicitud de actividades 
		if ($_POST["solicita_urbano"] == 1 and $value["nombre"] == "Solicitud de vehículo" and $value["integracion"] == "soluciones") {
			if ($value["simultaneo"] == 0) {
				$_flag_simultaneo = true;
			}
		}

		// Se valida si se crea el formulariio de la actividad para generarla como actividad del proyecto
		if ($_flag_incluye_actividad) {
			$j++;
			$_flag_solicita_urbano = false;

			foreach ($value as $key1 => $value1) {
				// Se ajusta el orden de la actividad
				if ($key1 === "orden") {
					$value1 = $j;
				}
				// Se ajusta la actividad previa de la actividad
				if ($key1 === "actividad_previa") {
					$value1 = ($j - 1);
				}

				// Se se asigna el valor de la simultaneidad de la actividad 
				if ($key1 === "simultaneo" and $_flag_simultaneo) {
					if ($value["bloque"] > $_flag_asigna_simultaneo) {
						$value1 = $_simultaneo;
						$_flag_asigna_simultaneo = $value["bloque"];
					} else {
						$_flag_asigna_simultaneo = 0;
						if ($value["bloque"] > 0) {
							$_flag_asigna_simultaneo = $value["bloque"];
						}
					}
				}

				$mensaje .= '<input type="hidden" name="' . $key1 . '" id="' . $key1 . '_' . $j . '" value="' . $value1 . '" >';

				// Se pregunta si se solicita urbano para filtrar la adición e las actividades correspondientes
				if ($_POST["solicita_urbano"] == 1 && $key1 === "tipo_actividad" && $value1 == "material_importacion" && $_flag_valida_actividad_solicitud) {
					$_flag_solicita_urbano = true;
					$_flag_valida_actividad_solicitud = false;
				}
			}
		}

		// Se valida si se debe incluir las actividades de solicitud de urbano
		if ($_flag_solicita_urbano and !$_flag_valida_actividad_solicitud) {
			// Se crea array con las nuevas actividades
			$array_nuevas_actividades = array(
				0 => array(
					"id" => 0,
					"id_plantilla" => 0,
					"nombre" => "Solicitud de vehículo urbano",
					"descripcion" => "Se solicita vehículo a Operaciones",
					"id_centro_costo" => 6,
					"orden" => 0,
					"actividad_previa" => 0,
					"bloque" => 1,
					"simultaneo" => $_simultaneo,
					"urbaneo" => 1,
					"responsable" => 3,
					"documentos" => "",
					"tiempo_estimado" => 5,
					"costo_estimado" => 0,
					"moneda" => 2,
					"adjunto" => 0,
					"integracion" => "soluciones",
					"sub_integracion" => "importacion",
					"tipo_actividad" => "",
					"estado" => 1,
				),
				1 => array(
					"id" => 0,
					"id_plantilla" => 0,
					"nombre" => "Editar y aprobar solicitud para agrupamiento",
					"descripcion" => "Se agrega el tipo de movilización para la mercancía y se agregan los puntos de carge y descargue.",
					"id_centro_costo" => 5,
					"orden" => 0,
					"actividad_previa" => 0,
					"bloque" => 2,
					"simultaneo" => $_simultaneo,
					"urbaneo" => 0,
					"responsable" => "",
					"documentos" => "",
					"tiempo_estimado" => 60,
					"costo_estimado" => 0,
					"moneda" => 2,
					"adjunto" => 0,
					"integracion" => "soluciones",
					"sub_integracion" => "importacion",
					"tipo_actividad" => "",
					"estado" => 1,
				),
				2 => array(
					"id" => 0,
					"id_plantilla" => 0,
					"nombre" => "Agrupación y desagrupación de solicitudes",
					"descripcion" => "Desconsolidación y agrupación de materiales para asignación de vehículo para despacho.",
					"id_centro_costo" => 5,
					"orden" => 0,
					"actividad_previa" => 0,
					"bloque" => 3,
					"simultaneo" => $_simultaneo,
					"urbaneo" => 0,
					"responsable" => "",
					"documentos" => "",
					"tiempo_estimado" => 60,
					"costo_estimado" => 0,
					"moneda" => 2,
					"adjunto" => 0,
					"integracion" => "soluciones",
					"sub_integracion" => "importacion",
					"tipo_actividad" => "",
					"estado" => 1,
				),
				3 => array(
					"id" => 0,
					"id_plantilla" => 0,
					"nombre" => "Asignar Vehículo",
					"descripcion" => "Se postulan vehículos para un agrupamiento de materiales.",
					"id_centro_costo" => 5,
					"orden" => 0,
					"actividad_previa" => 0,
					"bloque" => 4,
					"simultaneo" => $_simultaneo,
					"urbaneo" => 0,
					"responsable" => "",
					"documentos" => "",
					"tiempo_estimado" => 60,
					"costo_estimado" => 0,
					"moneda" => 2,
					"adjunto" => 0,
					"integracion" => "soluciones",
					"sub_integracion" => "importacion",
					"tipo_actividad" => "",
					"estado" => 1,
				),
				4 => array(
					"id" => 0,
					"id_plantilla" => 0,
					"nombre" => "Aprobar Vehículo",
					"descripcion" => "Se aprueba un vehículo de los postulados del un agrupamiento de materiales.",
					"id_centro_costo" => 7,
					"orden" => 0,
					"actividad_previa" => 0,
					"bloque" => 5,
					"simultaneo" => $_simultaneo,
					"urbaneo" => 0,
					"responsable" => "",
					"documentos" => "",
					"tiempo_estimado" => 60,
					"costo_estimado" => 0,
					"moneda" => 2,
					"adjunto" => 0,
					"integracion" => "soluciones",
					"sub_integracion" => "importacion",
					"tipo_actividad" => "",
					"estado" => 1,
				),
				5 => array(
					"id" => 0,
					"id_plantilla" => 0,
					"nombre" => "Planillar Vehículo",
					"descripcion" => "Operaciones planilla el vehículo y entrega documentos al conductor.",
					"id_centro_costo" => 5,
					"orden" => 0,
					"actividad_previa" => 0,
					"bloque" => 6,
					"simultaneo" => $_simultaneo,
					"urbaneo" => 0,
					"responsable" => "",
					"documentos" => "",
					"tiempo_estimado" => 60,
					"costo_estimado" => 0,
					"moneda" => 2,
					"adjunto" => 0,
					"integracion" => "soluciones",
					"sub_integracion" => "importacion",
					"tipo_actividad" => "",
					"estado" => 1,
				),
				6 => array(
					"id" => 0,
					"id_plantilla" => 0,
					"nombre" => "Generar Anticipo",
					"descripcion" => "Se asigna la documentación necesaria para el despacho del vehículo y se asigna la tarjeta y la clave para que el conductor pueda retirar el anticipo.",
					"id_centro_costo" => 8,
					"orden" => 0,
					"actividad_previa" => 0,
					"bloque" => 7,
					"simultaneo" => $_simultaneo,
					"urbaneo" => 0,
					"responsable" => "",
					"documentos" => "",
					"tiempo_estimado" => 60,
					"costo_estimado" => 0,
					"moneda" => 2,
					"adjunto" => 0,
					"integracion" => "soluciones",
					"sub_integracion" => "importacion",
					"tipo_actividad" => "anticipo",
					"estado" => 1,
				),
				7 => array(
					"id" => 0,
					"id_plantilla" => 0,
					"nombre" => "Asignación de plan de ruta",
					"descripcion" => "Seguridad asignara la ruta para el transporte del material.",
					"id_centro_costo" => 7,
					"orden" => 0,
					"actividad_previa" => 0,
					"bloque" => 8,
					"simultaneo" => $_simultaneo,
					"urbaneo" => 0,
					"responsable" => "",
					"documentos" => "",
					"tiempo_estimado" => 60,
					"costo_estimado" => 0,
					"moneda" => 2,
					"adjunto" => 0,
					"integracion" => "soluciones",
					"sub_integracion" => "importacion",
					"tipo_actividad" => "",
					"estado" => 1,
				),
				8 => array(
					"id" => 0,
					"id_plantilla" => 0,
					"nombre" => "Seguimiento de vehículo llegada al punto de cargue",
					"descripcion" => "El controlador de tráfico realiza seguimiento al vehículo al punto de cargue.",
					"id_centro_costo" => 7,
					"orden" => 0,
					"actividad_previa" => 0,
					"bloque" => 9,
					"simultaneo" => $_simultaneo,
					"urbaneo" => 0,
					"responsable" => "",
					"documentos" => "",
					"tiempo_estimado" => 60,
					"costo_estimado" => 0,
					"moneda" => 2,
					"adjunto" => 0,
					"integracion" => "soluciones",
					"sub_integracion" => "importacion",
					"tipo_actividad" => "seguimiento",
					"estado" => 1,
				),
				9 => array(
					"id" => 0,
					"id_plantilla" => 0,
					"nombre" => "Seguimiento de cargue de vehículo",
					"descripcion" => "Se verfica que el vehículo ya halla cargado el material. Registrar fecha y hora de finalización del cargue.",
					"id_centro_costo" => 7,
					"orden" => 0,
					"actividad_previa" => 0,
					"bloque" => 10,
					"simultaneo" => $_simultaneo,
					"urbaneo" => 0,
					"responsable" => "",
					"documentos" => "",
					"tiempo_estimado" => 60,
					"costo_estimado" => 0,
					"moneda" => 2,
					"adjunto" => 0,
					"integracion" => "soluciones",
					"sub_integracion" => "importacion",
					"tipo_actividad" => "carga_inicial",
					"estado" => 1,
				),
				10 => array(
					"id" => 0,
					"id_plantilla" => 0,
					"nombre" => "Informar asignación anticipo al conductor",
					"descripcion" => "El controlador de tráfico informa al conductor la calve de la tarjeta donde le fue consignado el anticipo.",
					"id_centro_costo" => 7,
					"orden" => 0,
					"actividad_previa" => 0,
					"bloque" => 11,
					"simultaneo" => $_simultaneo,
					"urbaneo" => 0,
					"responsable" => "",
					"documentos" => "",
					"tiempo_estimado" => 60,
					"costo_estimado" => 0,
					"moneda" => 2,
					"adjunto" => 0,
					"integracion" => "soluciones",
					"sub_integracion" => "importacion",
					"tipo_actividad" => "",
					"estado" => 1,
				),
				11 => array(
					"id" => 0,
					"id_plantilla" => 0,
					"nombre" => "Solicitud de cita al Puerto",
					"descripcion" => "Operaciones verifica en la página del puerto la disponibilidad de citas y se agenda.",
					"id_centro_costo" => 5,
					"orden" => 0,
					"actividad_previa" => 0,
					"bloque" => 1,
					"simultaneo" => $_simultaneo,
					"urbaneo" => 0,
					"responsable" => "",
					"documentos" => "",
					"tiempo_estimado" => 60,
					"costo_estimado" => 0,
					"moneda" => 2,
					"adjunto" => 0,
					"integracion" => "",
					"sub_integracion" => "",
					"tipo_actividad" => "",
					"estado" => 1,
				),
				12 => array(
					"id" => 0,
					"id_plantilla" => 0,
					"nombre" => "Asignación de cita del Puerto",
					"descripcion" => "Operaciones imprime cita y coordina con el transportador el cargue. La fecha indica cuando debe ser retirado el material del puerto.",
					"id_centro_costo" => 5,
					"orden" => 0,
					"actividad_previa" => 0,
					"bloque" => 2,
					"simultaneo" => $_simultaneo,
					"urbaneo" => 0,
					"responsable" => "",
					"documentos" => "",
					"tiempo_estimado" => 60,
					"costo_estimado" => 0,
					"moneda" => 2,
					"adjunto" => 1,
					"integracion" => "",
					"sub_integracion" => "",
					"tipo_actividad" => "fecha",
					"estado" => 1,
				),
			);
			// print_r("<pre>");
			// print_r($array_nuevas_actividades);
			// print_r("</pre>");
			foreach ($array_nuevas_actividades as $key_2 => $value_2) {
				$j++;
				$mensaje .= creaHTMLFormularioActividades($Data, $j, $array_nuevas_actividades[$key_2]);
			}
		}
		$mensaje .= '<div class="row"></div>';
	}

	$mensaje .= '<input type="hidden" id="cant_actividades_' . $_GET["orden_compra"] . '" value="' . $j . '" >';
}


// Se pinta la tabla de actividades en el formulario
if (isset($consultaBusqueda) and isset($_GET["tabla"]) == "cmx_plantillas") {
	$sql = "
			SELECT 
				cap.nombre, cap.tiempo_estimado, cap.costo_estimado,
				cap.id id_actividad, cap.perfil_responsable, cap.id_centro_costo, cap.tipo_actividad,
				(SELECT 
					cmo.codigo
				FROM 
					cmx_monedas cmo
				WHERE 
					cmo.id = cap.moneda) MONEDA
			FROM 
				" . $_GET['tabla'] . " cpl
				INNER JOIN  cmx_actividades_plantilla cap ON cpl.id = cap.id_plantilla
			WHERE 
				cpl.estado = 1
				AND cap.estado = 1
				AND cpl.id = " . $consultaBusqueda . "
				ORDER BY cap.orden ;
		";
	// $arrayResult = $Data->getConsulta($sql);
	$arrayResult = $PDO->prepare($sql);
	$arrayResult->execute();
	$arrayResult = $arrayResult->fetchAll(PDO::FETCH_ASSOC);
	// print_r("<pre>");
	// print_r($arrayResult);
	// print_r("</pre>");

	$table = '
			<strong>Actividades</strong>
			<table class="table table-striped table-hover">
				<tbody>
		';
	$i = 0;

	foreach ($arrayResult as $key => $value) {

		// Se pregunta si se debe quitar las actividades de solicitud de cita al puerto que vienen del bloque de actividades de la plantilla 
		$_flag_incluye_actividad = true;
		if ($_POST["solicita_urbano"] == 1 and ($value["nombre"] == "Solicitud de cita al Puerto" or $value["nombre"] == "Asignación de cita del Puerto")) {
			$_flag_incluye_actividad = false;
		}

		if ($_flag_incluye_actividad) {
			$i++;
			$_slct = selectHtml($Data, "cmx_perfiles", "perfil_responsable", $i, $value["perfil_responsable"], $PDO);
			$_slct1 = selectHtml1($Data, "cmx_centro_costo", "id_centro_costo", $i, $_GET["id_cliente"], $value["id_centro_costo"], $PDO);

			$flag_actividad = "cell-detail";
			if (!$value["perfil_responsable"] || !$value["id_centro_costo"]) {
				$flag_actividad = "text-danger";
			}

			$table .= '
					<tr>
						<td class="' . $flag_actividad . '">
							<div class="col-sm-12">
								<span class="cell-detail-description">' . $value["nombre"] . '<span>
							</div>
						</td>
						<td class="cell-detail" style="width:17%">
							<span class="cell-detail-description">Centro de Costo<span>
							<span>' . $_slct1 . '</span>
						</td>
						<td class="cell-detail" style="width:17%">
							<span class="cell-detail-description">Perfil Responsable<span>
							<span>' . $_slct . '</span>
						</td>
						<td class="cell-detail" style="width:10%;">
							<span class="cell-detail-description">Tiempo<span>
							<input type="number" min="0" id="tiempo_' . $i . '" value="" placeholder="Tiempo estimado" class="form-control input-xs">
						</td>
						<td class="cell-detail" style="width:13%;">
							<span class="cell-detail-description">Medida Tiempo<span>
							<select id="slc_medida_tiempo_' . $i . '" class="form-control input-xs">
								<option value="" disabled="disabled">Seleccione</option>
								<option value="1">Minutos</option>
								<option value="2">Horas</option>
								<option value="3">Días</option>
							</select>
							<input type="hidden" name="tiempo_aprobado" id="tiempo_aprobado_' . $i . '" value="' . $value["tiempo_estimado"] . '" placeholder="Tiempo estimado" class="form-control input-xs">
						</td>
						<td class="cell-detail" style="width:15%;">
							<span class="cell-detail-description">Costo (' . $value["MONEDA"] . ')<span>
							<input type="number" min="0" name="costo_aprobado" id="costo_aprobado_' . $i . '" value="' . $value["costo_estimado"] . '" class="form-control input-xs text-right">
						</td>
					</tr>
				';

			// JS de validacion de tiempos de actividades
			$table .= '
					<script type="text/javascript">
						$(document).ready(function(){
							var minutos = $("#tiempo_aprobado_' . $i . '").val();
							var arrayMinutos = minutesToString(minutos).split(" " , 2);

							// filtro lo que debe mostrar el campo del tiempo
							switch (arrayMinutos[1]) {
								case "minuto":
									$("#tiempo_' . $i . '").val(\'\');
									$("#tiempo_' . $i . '").val(arrayMinutos[0]);
									$("#slc_medida_tiempo_' . $i . '").val(\'\');
									$("#slc_medida_tiempo_' . $i . '").val(1);
									break;

								case "minutos":
									$("#tiempo_' . $i . '").val(\'\');
									$("#tiempo_' . $i . '").val(arrayMinutos[0]);
									$("#slc_medida_tiempo_' . $i . '").val(\'\');
									$("#slc_medida_tiempo_' . $i . '").val(1);
									break;

								case "hora":
									$("#tiempo_' . $i . '").val(\'\');
									$("#tiempo_' . $i . '").val(arrayMinutos[0]);
									$("#slc_medida_tiempo_' . $i . '").val(\'\');
									$("#slc_medida_tiempo_' . $i . '").val(2);
									break;

								case "horas":
									$("#tiempo_' . $i . '").val(\'\');
									$("#tiempo_' . $i . '").val(arrayMinutos[0]);
									$("#slc_medida_tiempo_' . $i . '").val(\'\');
									$("#slc_medida_tiempo_' . $i . '").val(2);
									break;

								case "dia":
									$("#tiempo_' . $i . '").val(\'\');
									$("#tiempo_' . $i . '").val(arrayMinutos[0]);
									$("#slc_medida_tiempo_' . $i . '").val(\'\');
									$("#slc_medida_tiempo_' . $i . '").val(3);
									break;

								case "dias":
									$("#tiempo_' . $i . '").val(\'\');
									$("#tiempo_' . $i . '").val(arrayMinutos[0]);
									$("#slc_medida_tiempo_' . $i . '").val(\'\');
									$("#slc_medida_tiempo_' . $i . '").val(3);
									break;
							}

							$(\'#slc_medida_tiempo_' . $i . '\').change(function () {
								var tiempo = $("#tiempo_' . $i . '").val();
								var unidad_tiempo = $("select[id=slc_medida_tiempo_' . $i . ']").val();

								$("#tiempo_aprobado_' . $i . '").val(\'\');
								$("#tiempo_aprobado_' . $i . '").val(calculaMinutos(tiempo , unidad_tiempo));
							});

							$(\'#tiempo_' . $i . '\').blur(function () {
								var tiempo = $("#tiempo_' . $i . '").val();
								var unidad_tiempo = $("select[id=slc_medida_tiempo_' . $i . ']").val();

								$("#tiempo_aprobado_' . $i . '").val(\'\');
								$("#tiempo_aprobado_' . $i . '").val(calculaMinutos(tiempo , unidad_tiempo));
							});
						});

					</script>
				';

			// Se pregunta si se solicita urbano para filtrar la adición e las actividades correspondientes
			if ($_POST["solicita_urbano"] == 1 and $value["tipo_actividad"] == "material_importacion") {
				// Se incluyen las nuevas actividades de solicitud del urbano
				// Se crea array con la informacion de las actividades necesarias de la maqueta de la tabla
				$array_nuevas_actividades = array(
					0 => array(
						"nombre" => "Solicitud de vehículo urbano",
						"id_centro_costo" => 6,
						"perfil_responsable" => "",
						"tiempo_estimado" => 5,
						"costo_estimado" => 0,
						"MONEDA" => "COP",
						"id_cliente" => $_GET["id_cliente"],
					),
					1 => array(
						"nombre" => "Editar y aprobar solicitud para agrupamiento",
						"id_centro_costo" => 5,
						"perfil_responsable" => "",
						"tiempo_estimado" => 60,
						"costo_estimado" => 0,
						"MONEDA" => "COP",
						"id_cliente" => $_GET["id_cliente"],
					),
					2 => array(
						"nombre" => "Agrupación y desagrupación de solicitudes",
						"id_centro_costo" => 5,
						"perfil_responsable" => "",
						"tiempo_estimado" => 60,
						"costo_estimado" => 0,
						"MONEDA" => "COP",
						"id_cliente" => $_GET["id_cliente"],
					),
					3 => array(
						"nombre" => "Asignar Vehículo",
						"id_centro_costo" => 5,
						"perfil_responsable" => "",
						"tiempo_estimado" => 60,
						"costo_estimado" => 0,
						"MONEDA" => "COP",
						"id_cliente" => $_GET["id_cliente"],
					),
					4 => array(
						"nombre" => "Aprobar Vehículo",
						"id_centro_costo" => 7,
						"perfil_responsable" => "",
						"tiempo_estimado" => 60,
						"costo_estimado" => 0,
						"MONEDA" => "COP",
						"id_cliente" => $_GET["id_cliente"],
					),
					5 => array(
						"nombre" => "Planillar Vehículo",
						"id_centro_costo" => 5,
						"perfil_responsable" => "",
						"tiempo_estimado" => 60,
						"costo_estimado" => 0,
						"MONEDA" => "COP",
						"id_cliente" => $_GET["id_cliente"],
					),
					6 => array(
						"nombre" => "Generar Anticipo",
						"id_centro_costo" => 8,
						"perfil_responsable" => "",
						"tiempo_estimado" => 60,
						"costo_estimado" => 0,
						"MONEDA" => "COP",
						"id_cliente" => $_GET["id_cliente"],
					),
					7 => array(
						"nombre" => "Asignación de plan de ruta",
						"id_centro_costo" => 7,
						"perfil_responsable" => "",
						"tiempo_estimado" => 60,
						"costo_estimado" => 0,
						"MONEDA" => "COP",
						"id_cliente" => $_GET["id_cliente"],
					),
					8 => array(
						"nombre" => "Seguimiento de vehículo llegada al punto de cargue",
						"id_centro_costo" => 7,
						"perfil_responsable" => "",
						"tiempo_estimado" => 60,
						"costo_estimado" => 0,
						"MONEDA" => "COP",
						"id_cliente" => $_GET["id_cliente"],
					),
					9 => array(
						"nombre" => "Seguimiento de cargue de vehículo",
						"id_centro_costo" => 7,
						"perfil_responsable" => "",
						"tiempo_estimado" => 60,
						"costo_estimado" => 0,
						"MONEDA" => "COP",
						"id_cliente" => $_GET["id_cliente"],
					),
					10 => array(
						"nombre" => "Informar asignación anticipo al conductor",
						"id_centro_costo" => 7,
						"perfil_responsable" => "",
						"tiempo_estimado" => 60,
						"costo_estimado" => 0,
						"MONEDA" => "COP",
						"id_cliente" => $_GET["id_cliente"],
					),
					11 => array(
						"nombre" => "Solicitud de cita al Puerto",
						"id_centro_costo" => 5,
						"perfil_responsable" => "",
						"tiempo_estimado" => 60,
						"costo_estimado" => 0,
						"MONEDA" => "COP",
						"id_cliente" => $_GET["id_cliente"],
					),
					12 => array(
						"nombre" => "Asignación de cita del Puerto",
						"id_centro_costo" => 5,
						"perfil_responsable" => "",
						"tiempo_estimado" => 60,
						"costo_estimado" => 0,
						"MONEDA" => "COP",
						"id_cliente" => $_GET["id_cliente"],
					),
				);
				foreach ($array_nuevas_actividades as $key_1 => $value_1) {
					$i++;
					$table .= creaHTMLFilaActividades($Data, $i, $array_nuevas_actividades[$key_1], $PDO);
				}
			}
		}
	}
	// echo "<p>Cantidad de actividades de esta plantilla - " . $i . "</p>";
	$table .= '
				</tbody>
			</table>
		';
	$mensaje .= $table;
}

/***** FIN CONSULTAS PARA LLENADO DE LA TABLA DE PLANTILLA  *****/

/***** CONSULTAS PARA LLENADO DEL FORMULARIO DE CLIENTES *****/
if (isset($_POST["tipo_proyecto"])) {
	$_slct_clientes = $Clientes->getHtmlSelect_sm("id_cliente", "", 1);

	$_clientes_content = '
			<div class="form-group col-xs-4">
				<label>(*) Cliente:</label>
				' . $_slct_clientes . '
			</div>
			<div class="form-group col-xs-8" id="div_slct_contrato"></div>
		';

	if ($_POST["tipo_proyecto"] == "INTERNACIONAL") {
		$_slct_clientes = $Clientes->getHtmlSelectInternacional_sm("id_cliente", "", 1);
		$_clientes_content = '<div class="form-group col-xs-4">
					<label>(*) Cliente:</label>
					' . $_slct_clientes . '
				</div>
				<div class="form-group col-xs-8" id="div_btn_tramos" style="padding-top: 26px;"></div>
			';
	}
	$mensaje .= $_clientes_content;
}

// Llenado del formulario para proyectos internacionales 
if (isset($_POST["div_form_intencional"])) {
	$mensaje .= '
			<div class="form-group col-xs-6 col-xs-3 col-xs-3">
				<label>(*) Tipo de Transporte:</label>
				' . $Importacion->getEnumSlctTipoTransporte("tipo_transporte", "", "") . '
			</div>
			<div class="form-group col-xs-6 col-xs-4 col-xs-4">
				<label>(*) Incoterm:</label>
				' . $Importacion->getHtmlSelectIncoterm("incoterm", "") . '
			</div>
			<div class="form-group col-xs-6 col-xs-2 col-xs-2">
				<label><!-- (*) -->Valor Declarado:</label>
				<input type="text" name="valor_declarado" id="valor_declarado" placeholder="Valor Declarado" class="form-control input-sm"  onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)">
			</div>
			<div class="form-group col-xs-6 col-xs-3 col-xs-3">
				<label><!-- (*) -->Moneda:</label>
				' . $Importacion->getHtmlSelectMonedas("id_moneda", "") . '
			</div>
		';
}

/***** FIN - CONSULTAS PARA LLENADO DEL FORMULARIO DE CLIENTES *****/

echo $mensaje;


function selectHtml($Data, $table, $name, $id, $id_perfil, $PDO)
{
	$select = "";
	$sql = '
			SELECT 
				cp.id, cp.nombre_perfil
			FROM 
				' . $table . ' cp 
			WHERE 
				cp.estado = 1
				AND cp.id NOT IN (1,2,3,17,18)
			ORDER BY cp.nombre_perfil
		';
	// $arrayResult = $Data->getConsulta($sql);
	$arrayResult = $PDO->prepare($sql);
	$arrayResult->execute();
	$arrayResult = $arrayResult->fetchAll(PDO::FETCH_ASSOC);

	$slct = '
			<select name="' . $name . '" id="slct_' . $name . '_' . $id . '" class="form-control input-xs">
				<option value="" selected="" disabled="">Seleccione</option>
		';
	foreach ($arrayResult as $key => $value) {
		if ($value["id"] == $id_perfil) {
			$slct .= '<option value="' . $value["id"] . '" selected>' . $value["nombre_perfil"] . '</option>';
		} else {
			$slct .= '<option value="' . $value["id"] . '">' . $value["nombre_perfil"] . '</option>';
		}
	}
	$slct .= '
			</select>
		';
	return $slct;
}

function selectHtml1($Data, $table, $name, $id, $id_cliente, $id_centro_costo, $PDO)
{
	$select = "";
	$sql = '
			SELECT 
				ccc.id, ccc.nombre
			FROM 
				cmx_centro_costo ccc 
			WHERE 
				ccc.estado = 1
				AND ccc.id_cliente = ' . $id_cliente . ';
		';

	// $arrayResult = $Data->getConsulta($sql);
	$arrayResult = $PDO->prepare($sql);
	$arrayResult->execute();
	$arrayResult = $arrayResult->fetchAll(PDO::FETCH_ASSOC);
	$slct = '
			<select name="' . $name . '" id="slct_' . $name . '_' . $id . '" class="form-control input-xs">
				<option value="0" selected="" disabled="">Seleccione</option>
		';
	foreach ($arrayResult as $key => $value) {
		if ($value["id"] == $id_centro_costo) {
			$slct .= '<option value="' . $value["id"] . '" selected>' . $value["nombre"] . '</option>';
		} else {
			$slct .= '<option value="' . $value["id"] . '">' . $value["nombre"] . '</option>';
		}

	}
	$slct .= '
			</select>
		';
	return $slct;
}

function creaHTMLFilaActividades($Data, $i, $array, $PDO)
{
	$filas = "";

	$_slct = selectHtml($Data, "cmx_perfiles", "perfil_responsable", $i, $array["perfil_responsable"], $PDO);
	$_slct1 = selectHtml1($Data, "cmx_centro_costo", "id_centro_costo", $i, $array["id_cliente"], $array["id_centro_costo"], $PDO);

	$flag_actividad = "cell-detail";
	if (!$array["perfil_responsable"] || !$array["id_centro_costo"]) {
		$flag_actividad = "text-danger";
	}

	// Se maqueta la fila de la actividad 
	$filas .= '
			<tr>
				<td class="' . $flag_actividad . '">
					<div class="col-sm-12">
						<span class="cell-detail-description">' . $array["nombre"] . '<span>
					</div>
				</td>
				<td class="cell-detail" style="width:17%">
					<span class="cell-detail-description">Centro de Costo<span>
					<span>' . $_slct1 . '</span>
				</td>
				<td class="cell-detail" style="width:17%">
					<span class="cell-detail-description">Perfil Responsable<span>
					<span>' . $_slct . '</span>
				</td>
				<td class="cell-detail" style="width:10%;">
					<span class="cell-detail-description">Tiempo<span>
					<input type="number" min="0" id="tiempo_' . $i . '" value="" placeholder="Tiempo estimado" class="form-control input-xs">
				</td>
				<td class="cell-detail" style="width:13%;">
					<span class="cell-detail-description">Medida Tiempo<span>
					<select id="slc_medida_tiempo_' . $i . '" class="form-control input-xs">
						<option value="" disabled="disabled">Seleccione</option>
						<option value="1">Minutos</option>
						<option value="2">Horas</option>
						<option value="3">Días</option>
					</select>
					<input type="hidden" name="tiempo_aprobado" id="tiempo_aprobado_' . $i . '" value="' . $array["tiempo_estimado"] . '" placeholder="Tiempo estimado" class="form-control input-xs">
				</td>
				<td class="cell-detail" style="width:15%;">
					<span class="cell-detail-description">Costo (' . $array["MONEDA"] . ')<span>
					<input type="number" min="0" name="costo_aprobado" id="costo_aprobado_' . $i . '" value="' . $array["costo_estimado"] . '" class="form-control input-xs text-right">
				</td>
			</tr>
		';

	// JS de validacion de tiempos de actividades
	$filas .= '
			<script type="text/javascript">
				$(document).ready(function(){
					var minutos = $("#tiempo_aprobado_' . $i . '").val();
					var arrayMinutos = minutesToString(minutos).split(" " , 2);

					// filtro lo que debe mostrar el campo del tiempo
					switch (arrayMinutos[1]) {
						case "minuto":
							$("#tiempo_' . $i . '").val(\'\');
							$("#tiempo_' . $i . '").val(arrayMinutos[0]);
							$("#slc_medida_tiempo_' . $i . '").val(\'\');
							$("#slc_medida_tiempo_' . $i . '").val(1);
							break;

						case "minutos":
							$("#tiempo_' . $i . '").val(\'\');
							$("#tiempo_' . $i . '").val(arrayMinutos[0]);
							$("#slc_medida_tiempo_' . $i . '").val(\'\');
							$("#slc_medida_tiempo_' . $i . '").val(1);
							break;

						case "hora":
							$("#tiempo_' . $i . '").val(\'\');
							$("#tiempo_' . $i . '").val(arrayMinutos[0]);
							$("#slc_medida_tiempo_' . $i . '").val(\'\');
							$("#slc_medida_tiempo_' . $i . '").val(2);
							break;

						case "horas":
							$("#tiempo_' . $i . '").val(\'\');
							$("#tiempo_' . $i . '").val(arrayMinutos[0]);
							$("#slc_medida_tiempo_' . $i . '").val(\'\');
							$("#slc_medida_tiempo_' . $i . '").val(2);
							break;

						case "dia":
							$("#tiempo_' . $i . '").val(\'\');
							$("#tiempo_' . $i . '").val(arrayMinutos[0]);
							$("#slc_medida_tiempo_' . $i . '").val(\'\');
							$("#slc_medida_tiempo_' . $i . '").val(3);
							break;

						case "dias":
							$("#tiempo_' . $i . '").val(\'\');
							$("#tiempo_' . $i . '").val(arrayMinutos[0]);
							$("#slc_medida_tiempo_' . $i . '").val(\'\');
							$("#slc_medida_tiempo_' . $i . '").val(3);
							break;
					}

					$(\'#slc_medida_tiempo_' . $i . '\').change(function () {
						var tiempo = $("#tiempo_' . $i . '").val();
						var unidad_tiempo = $("select[id=slc_medida_tiempo_' . $i . ']").val();

						$("#tiempo_aprobado_' . $i . '").val(\'\');
						$("#tiempo_aprobado_' . $i . '").val(calculaMinutos(tiempo , unidad_tiempo));
					});

					$(\'#tiempo_' . $i . '\').blur(function () {
						var tiempo = $("#tiempo_' . $i . '").val();
						var unidad_tiempo = $("select[id=slc_medida_tiempo_' . $i . ']").val();

						$("#tiempo_aprobado_' . $i . '").val(\'\');
						$("#tiempo_aprobado_' . $i . '").val(calculaMinutos(tiempo , unidad_tiempo));
					});
				});
			</script>
		';

	return $filas;
}

function creaHTMLFormularioActividades($Data, $i, $array)
{
	$form = "";
	foreach ($array as $key => $value) {
		// Se ajusta el orden de la actividad
		if ($key === "orden") {
			$value = $i;
		}
		// Se ajusta la actividad previa de la actividad
		if ($key === "actividad_previa") {
			$value = ($i - 1);
		}
		$form .= '<input type="hidden" name="' . $key . '" id="' . $key . '_' . $i . '" value="' . $value . '" >';
	}
	return $form;
}
