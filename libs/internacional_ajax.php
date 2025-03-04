<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';
include '../models/internacionalModel.php';
date_default_timezone_set('America/Bogota');


$_msg_error = "";
$_msg_control = "Entro en internacional_ajax.php\n";
$_msg_content = array();
$_array_result = array();

$Data = new Consultas;
$Internacional = new internacionalModel;
$time = time();

$return["get"] = $_GET;
$return["post"] = $_POST;
if (isset($_FILES)) {
	$return["file"] = $_FILES;
}

switch ($_GET["action"]) {
	case 'agregar_trm':
		$_msg_control .= "Entro en la acción agregar_trm.\n";
		$return["content"] = '
				<div class="col-xs-4">
					<label>(*) Moneda:</label>
					' . $Internacional->getHtmlSelectTrmMonedas_sm("id_moneda", "", "") . '
				</div>
				<div class="col-xs-4">
					<label>(*) Fecha:</label>
					<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
						<input size="10" type="text" value="' . date('Y-m-d', $time) . '" name="fecha" id="fecha" readonly="" class="form-control input-sm" placeholder="Fecha">
						<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
					</div>
				</div>
				<div class="col-xs-4">
					<label>(*) Tasa Representativa (COP):</label>
					<input type="text" class="form-control input-sm" name="valor" id="valor" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)" placeholder="Valor en Pesos (COP)">
				</div>
			';
		break;

	case 'valida_trm':
		$_msg_control .= "Entro en la acción valida_trm.\n";

		$return["flag_trm"] = false;
		// Se pregunta si ya existe un trm con los parámteros seleccionados
		$sql = '
				SELECT cmt.valor, cmt.fecha, cm.nom_moneda, cm.codigo
				FROM cmx_monedas_trm cmt
					INNER JOIN cmx_monedas cm ON cm.id = cmt.id_moneda
				WHERE cmt.id_moneda = ' . $_POST["moneda"] . '
					AND cmt.fecha = "' . $_POST["fecha"] . '"
			';
		$result = $Data->getConsulta($sql);
		if ($result) {
			$return["flag_trm"] = true;
			$return["trm"] = $result["rowsData"][0];
		}
		break;

	case 'form_edita_trm':
		$_msg_control .= "Entro en la acción form_edita_trm.\n";

		$return["title"] = 'Editar TRM - ' . $_POST["codigo"] . ' (' . $_POST["fecha"] . ')';
		$return["content"] = '
				<div class="well well-sm"><strong>' . $_POST["fecha"] . '</strong> - ' . $_POST["nom_moneda"] . ' (' . $_POST["codigo"] . ')</div>
				<div class="col-xs-4"></div>
				<div class="col-xs-4">
					<label>(*) Tasa Representativa (COP):</label>
					<input type="text" class="form-control input-sm" name="valor" id="valor" value="' . number_format($_POST["valor"], 2, ',', '.') . '" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)" placeholder="Valor en Pesos (COP)">
					<input type="hidden" name="id" id="id" value="' . $_POST["id"] . '">
				</div>
				<div class="col-xs-4"></div>
			';
		break;

	case 'crea_trm':
		$_msg_control .= "Entro en la acción crea_trm.\n";

		// Se crea el trm 
		$array = array();
		$array["id_moneda"] = $_POST["id_moneda"];
		$array["fecha"] = $_POST["fecha"];
		$array["valor"] =  str_replace(",", ".", str_replace(".", "", $_POST["valor"]));
		$Data->setRegistro("cmx_monedas_trm", $array);
		break;

	case 'edita_trm':
		$_msg_control .= "Entro en la acción edita_trm.\n";

		// Se edita el trm 
		$array = array();
		$array["valor"] =  str_replace(",", ".", str_replace(".", "", $_POST["valor"]));
		$Data->updateRegistro("cmx_monedas_trm", $array, (int)$_POST["id"]);
		break;

	case 'buscar_trm':
		$_msg_control .= "Entro en la acción buscar_trm.\n";

		$data = $_POST["data"];
		$fecha = $data[0]["value"];
		$id_moneda =  $data[1]["value"];
		$valor_oferta =  $data[2]["value"];

		if ($id_moneda == 2) {
			$return["content"] = '
					<div class="text-center">
						<h4>El valor de la oferta comercial es de <strong>' . $valor_oferta . ' COP</strong></h4>
					</div>
				';
		} else {
			$trm = $Internacional->getTrm($id_moneda, $fecha);
			if ($trm) {
				$return["content"] = '
						<div class="text-center">
							<h4>El valor de la oferta comercial es de <strong>' . $valor_oferta . ' ' . $trm["MONEDA"] . '</strong></h4>
							<h4>El valor de la oferta comercial en <strong>COP</strong> es de <strong>$' . number_format(($Internacional->formatNumber($valor_oferta) * $trm["valor"]), 2, ',', '.') . '</strong></h4>
						</div>
					';
			} else {
				$return["error"] = '<p>No se pudo Establecer el valor estimado de la Oferta Comercial.</p>';
			}
		}
		break;

	case 'agregar_cotizacion':
		$_msg_control .= "Entro en la acción agregar_cotizacion.\n";

		// Se saca el nombre del archivo de la cotización 
		$file = $_FILES[$_POST["div"] . "_file"];
		$extension = $Internacional->get_extension_archivo($file["name"]);
		$hora = date('H:i:s');
		$array = array();
		$array["id_intr_proyecto"] = $_POST["id_intr_proyecto"];
		$array["id_concepto"] = $_POST["id_concepto"];
		$array["id_proveedor"] = $_POST["id_proveedor"];
		$array["proveedor"] = $_POST["proveedor"];
		$array["valor"] = (float)str_replace(",", ".", str_replace(".", "", $_POST["valor"]));
		$array["id_moneda"] = $_POST["id_moneda"];
		$array["fecha_cotizacion"] = $_POST["fecha_cotizacion"];
		if (isset($_POST["descripcion"])) {
			$array["descripcion"] = $_POST["descripcion"];
		}
		//agregar hora
		$array["hora_cotizacion"] = $hora;
		$cotizacion = $Data->setRegistro("cmx_intr_cotizaciones", $array);

		$archivo = $_POST["id_intr_proyecto"] . "-" . $_POST["id_concepto"] . "-" . $cotizacion . "-" . $_POST["fecha_cotizacion"] . "." . $extension;

		// Se actualiza el dato del archivo de la cotización 
		$array = array();
		$array["url"] = $archivo;
		$Data->updateRegistro("cmx_intr_cotizaciones", $array, (int)$cotizacion);

		// Se guarda el archivo en el servidor 
		if ($file["error"] == 0) {
			$tmp_file = $file["tmp_name"];
			$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
			if (move_uploaded_file($tmp_file, $archivo_temporal)) {
				// Se crean las carpetas de destino del archivo
				$carpeta_destino = "../public/files/internacional";
				if (!file_exists($carpeta_destino)) {
					mkdir($carpeta_destino, 0777, true);
				}

				$carpeta_destino_1 = $carpeta_destino . "/cotizaciones";
				if (!file_exists($carpeta_destino_1)) {
					mkdir($carpeta_destino_1, 0777, true);
				}

				$carpeta_destino_2 = $carpeta_destino_1 . "/" . $_POST["id_intr_proyecto"];
				if (!file_exists($carpeta_destino_2)) {
					mkdir($carpeta_destino_2, 0777, true);
				}

				$carpeta_destino_3 = $carpeta_destino_2 . "/" . $_POST["div"];
				if (!file_exists($carpeta_destino_3)) {
					mkdir($carpeta_destino_3, 0777, true);
				}

				$destino = $carpeta_destino_3 . "/" . $archivo;

				if (copy($archivo_temporal, $destino)) {
					$return["copy_file_result"] = true;
				} else {
					$return["copy_file_result"] = false;
				}
			}
			if (file_exists($archivo_temporal)) {
				unlink($archivo_temporal);
			}
		} else {
			$return["copy_file_result"] = false;
		}
		break;

	case 'actualiza_solicitud':
		$_msg_control .= "Entro en la acción actualiza_solicitud.\n";
		$array = array();
		$array["do"] = "DO-" . $_POST["numero_importacion"];
		$array["estado"] = 1;
		$Data->updateRegistro("cmx_intr_solicitudes", $array, (int)$_POST["id"]);
		break;

	case 'actualiza_oferta':

		echo "Hola desde aqui";
		exit(0);

		$_msg_control .= "Entro en la acción actualiza_oferta.\n";

		$id_intr_protecto = $_POST["id_intr_proyecto"];

		// Se busca las ofertas comerciales anteriores 
		$sql = '
				SELECT cioc.id
				FROM cmx_intr_oferta_comercial cioc
				WHERE cioc.id_intr_proyecto = ' . $id_intr_protecto . '
			';
		$resul = $Data->getConsulta($sql);

		// Si existen ofertas comerciales se anulan 
		if ($resul) {
			foreach ($resul["rowsData"] as $key => $value) {
				$array = array();
				$array["estado"] = 0;
				$Data->updateRegistro("cmx_intr_oferta_comercial", $array, (int)$value[0]);
			}
		}

		// Se guarda la información de la nueva oferta comercial
		$array = array();
		$array["id_intr_proyecto"] = $id_intr_protecto;
		$array["fecha"] = $_POST["fecha_oferta"];
		$array["id_moneda"] = $_POST["moneda_oferta"];
		$array["valor"] = (float)str_replace(",", ".", str_replace(".", "", $_POST["valor_oferta"]));
		$array["fecha_aprobacion"] = date("Y-m-d");

		var_dump($array);
		exit(0);
		$id_oferta_comercial = $Data->setRegistro("cmx_intr_oferta_comercial", $array);

		// Se genera la información del archivo de la oferta comercial
		// Se saca el nombre del archivo de la cotización 
		$file = $_FILES["url_oferta"];
		$extension = $Internacional->get_extension_archivo($file["name"]);

		$archivo = $id_intr_protecto . "-" . $id_oferta_comercial . "-" . $_POST["fecha_oferta"] . "." . $extension;

		// Se actualiza el dato del archivo de la oferta comercial
		$array = array();
		$array["url"] = $archivo;
		$Data->updateRegistro("cmx_intr_oferta_comercial", $array, (int)$id_oferta_comercial);

		// Se guarda el archivo en el servidor 
		if ($file["error"] == 0) {
			$tmp_file = $file["tmp_name"];
			$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
			if (move_uploaded_file($tmp_file, $archivo_temporal)) {
				// Se crean las carpetas de destino del archivo
				$carpeta_destino = "../public/files/internacional/oferta_comercial/" . $id_intr_protecto;
				if (!file_exists($carpeta_destino)) {
					mkdir($carpeta_destino, 0777, true);
				}

				$destino = $carpeta_destino . "/" . $archivo;

				if (copy($archivo_temporal, $destino)) {
					$return["copy_file_result"] = true;
				} else {
					$return["copy_file_result"] = false;
				}
			}
			if (file_exists($archivo_temporal)) {
				unlink($archivo_temporal);
			}
		} else {
			$return["copy_file_result"] = false;
		}
		break;

	case 'editar_cotizacion':
		$_msg_control .= "Entro en la acción editar_cotizacion.\n";

		// Se pregunta por los permisos de acceso del perfil de usuario 
		$arrayPermisos = $Internacional->permisosPerfil($_POST["id_perfil"], 59);
		$_permisos = $arrayPermisos;


		// Se busca la información de la cotización 
		$cotizacion = $Internacional->getDatosCotizacion($_POST["id"]);
		$_array_result = $cotizacion;

		$_msg_content["title"] = 'Gestión de Cotizaciones - Error';
		$_msg_content["content"] = '
				<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
					<div class="icon">
						<span class="mdi mdi-close"></span>
					</div>
					<div class="message">
						<strong>Error!</strong><p>No hay información registrada de la cotización.</p>
					</div>
				</div>
			';

		// Se pregunta si existe información general de la cotización
		if (isset($cotizacion["general"]) and $cotizacion["general"]) {

			// Se genera la inforamación del título del popup
			$info_basica = $cotizacion["general"];
			$_msg_content["title"] = 'Gestión de Cotizaciones - ' . $info_basica["tipo_operacion"] . ' (' . $info_basica["tipo_transporte"] . ' - ' . $info_basica["incoterm"] . ')';

			// Se crea la tabla de tramos del proyecto
			$_origen = '
					<strong>Tramos</strong>
					<table class="table  table-striped">
						<thead>
							<tr class="nexos-encabezado">
								<th>Tipo de Tramo</th>
								<th>Remitente - Destinatario</th>
								<th>Ubicación</th>
							</tr>
						</thead>
						<tbody>
				';

			foreach ($cotizacion["tramos"]["tramos"] as $key => $value) {
				$_origen .= '
						<tr>
							<td class="cell-detail">
								<span>' . $value["guia"] . '</span>
								<span class="cell-detail-description">' . $value["tipo_tramo"] . '</span>
							</td>
							<td class="cell-detail">
								<span>' . $value["sigla"] . '</span>
							</td>
							<td class="cell-detail">
								<span>' . $value["direccion"] . '</span>
								<span class="cell-detail-description">' . $value["CIUDAD"] . '</span>
							</td>
						</tr>
					';
			}

			$_origen .= '
							<tr>
								<td colspan="3"></td>
							</tr>
						</tbody>
					</table>
				';

			// se crea la información de los materiales del proyecto
			$resumen_guias = "";
			$guias = "";
			if ($cotizacion["materiales"]) {
				$materiales = materialProyecto($cotizacion["materiales"]);

				$resumen_guias = $materiales["resumen"];
				$guias = $materiales["guias"];
			}

			// Se genera la tabla de totales de la cotización
			$totales_cotizacion = calculaCotizacion($cotizacion["calcula_cotizacion"]);

			$_valor_declarado = '<span class="text-danger">Valor declarado no registrado</span>';
			if ($info_basica["valor_declarado"] and $info_basica["MONEDA"]) {
				$_valor_declarado = number_format($info_basica["valor_declarado"], 2, ',', '.') . ' ' . $info_basica["MONEDA"];
			}

			// Se crea el contenido de la oferta comercial actual 
			$_oferta_content = '';
			if ($_POST["id_perfil"] == 13 or $_POST["id_perfil"] == 1 or $_POST["id_perfil"] == 25 or $_POST["id_perfil"] == 31 or $_POST["id_perfil"] == 29) {
				$_oferta_content = '
						<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
							<div class="icon">
								<span class="mdi mdi-close"></span>
							</div>
							<div class="message">
								<strong>Atención!</strong>
								<p>No se ha presentado ninguna oferta comercial al cliente...</p>
							</div>
						</div>
					';
				if ($cotizacion["oferta_comercial"]) {
					$oferta = $cotizacion["oferta_comercial"][0];
					$_oferta_content = '
							<div class="col-md-12 col-sm-12 col-xs-12" id="oferta_content">
								<strong>Oferta Comercial Actual</strong>
								<table class="table">
									<tbody>
										<tr>
											<td class="cell-detail">
												<div class="col-md-6 col-sm-6 col-xs-6 text-right">
													<span><strong>' . number_format($oferta["valor"], 2, ',', '.') . '</strong></span>
													<span class="cell-detail-description">' . $oferta["MONEDA"] . '</span>
													<span class="cell-detail-description">' . $oferta["fecha"] . '</span>
												</div>
												<div class="col-md-6 col-sm-6 col-xs-6 text-center">
													<div class="icon-container" style="padding:0;">
														<a href="' . BASE_URL . '/public/files/internacional/oferta_comercial/' . $oferta["id_intr_proyecto"] . '/' . $oferta["url"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
															<span class="mdi mdi-download"></span>
														</a>
													</div>
												</div>
											</td>
										</tr>
										<tr><td></td></tr>
									</tbody>
								</table>
							</div>
						';
				}
			}

			$_msg_content["content"] = '
					<table class="table">
						<tbody>
							<tr>
								<td class="cell-detail">
									<div class="form-group col-sm-3">
										<span>Cliente</span>
										<span class="cell-detail-description">' . $info_basica["sigla"] . '</span>
										<span class="cell-detail-description">' . $info_basica["DOC_CLIENTE"] . '</span>
										<span class="cell-detail-description">' . $info_basica["cod_cliente"] . '</span>
									</div>
									<div class="form-group col-sm-3">
										<span>Negociación</span>
										<span class="cell-detail-description">' . $info_basica["importacion"] . ' (' . $info_basica["numero_importacion"] . ')</span>
										<span class="cell-detail-description">' . $info_basica["tipo_operacion"] . ' (' . $info_basica["tipo_transporte"] . ')</span>
										<span class="cell-detail-description">' . $info_basica["incoterm"] . '</span>
									</div>
									<div class="form-group col-sm-3">
										<span>Valor Declarado</span>
										<span class="cell-detail-description">' . $_valor_declarado . '</span>
										<span class="cell-detail-description">' . $info_basica["CONTENEDOR"] . '</span>
									</div>
								</td>
							</tr>
							<tr><td></td></tr>
						</tbody>
					</table>
					' . $_oferta_content . '
					<div class="col-sm-12 col-md-12 col-xs-12 text-right">
						<div class="be-checkbox">
							<input id="check_info" type="checkbox">
							<label for="check_info">Ver Detalles</label>
						</div>
					</div>
					<div class="form-group col-sm-12 col-md-12 col-xs-12 info_proyecto">
						' . $_origen . '
					</div>
					<div class="form-group col-sm-12 col-md-12 col-xs-12 info_proyecto">
						' . $guias .  '
					</div>
					<div class="form-group col-sm-12 col-md-12 col-xs-12">
						' . $resumen_guias .  '
					</div>
					<div class="form-group col-sm-1 col-md-1 col-xs-1"></div>
					<div class="form-group col-sm-10 col-md-10 col-xs-12" id="total_cotizacion">
						' . $totales_cotizacion .  '
					</div>
					<div class="form-group col-sm-1 col-md-1 col-xs-1"></div>
					<div class="row"></div>
				';

			// Se genera la información del formulario de cotizaciones 
			$conceptos = $Internacional->getConceptos();

			$accordion_content = '';
			foreach ($conceptos as $key => $value) {
				// Se quita el concepto de impuesto de la lista de cotizacion
				if ($value['id'] != 11) {
					$div = strtolower(str_replace(" ", "_", $value["nombre"]));
					$div = strtolower(str_replace("-", "_", $div));
					$_accordion_color = "panel-border-color-default";

					$cotizacion_content = '';
					$i = 1;
					if (isset($cotizacion["cotizaciones"][$value['id']])) {
						$conseptos = $cotizacion["cotizaciones"][$value['id']];

						$array_accordion_content = cotizacionesContent($conseptos, $div, $_POST["id_perfil"]);
						$cotizacion_content .= $array_accordion_content["content"];
						$_accordion_color = $array_accordion_content["color"];
						$i = $array_accordion_content["i"];
					}

					if ($_permisos["adicionar"] == 1) {
						$cotizacion_content .= cotizacionFormContent($div, $i);
					}

					$accordion_content .= '
							<div class="panel panel-default panel-border-color ' . $_accordion_color . ' concepto" id="' . $div . '">
								<div class="panel-heading">
									<h4 class="panel-title">
										<a data-toggle="collapse" data-parent="#accordion1" href="#accordion_' . $div . '" class="collapsed" aria-expanded="false"><i class="icon mdi mdi-chevron-down"></i> ' . $value["nombre"] . '
											<span class="panel-subtitle">' . $value["descripcion"] . '</span>
										</a>
									</h4>
								</div>
								<div id="accordion_' . $div . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
									<div class="panel-body">
										<input type="hidden" id="id_concepto_' . $div . '" value="' . $value['id'] . '">
										<input type="hidden" id="' . $div . '_nombre" value="' . $value["nombre"] . '">
										<div class="row" id="row_' . $div . '">
											' . $cotizacion_content . '
										</div>
									</div>
								</div>
							</div>
						';
				}
			}

			// Se filtra el acceso al select de aprobacion de las cotizaciones 
			$_select_gestiona_cotizacion = '';
			if ($_POST["id_perfil"] == 13 or $_POST["id_perfil"] == 1 or $_POST["id_perfil"] == 25 or $_POST["id_perfil"] == 31 or $_POST["id_perfil"] == 29 or $_POST["id_perfil"] == 1) {
				$_select_gestiona_cotizacion = '
						<div class="form-group">
							<label class="col-md-2 col-sm-2 col-xs-12 control-label">Aprobar Cotización</label>
							<div class="form-group col-md-3 col-sm-6 col-xs-12">
								<select class="form-control input-sm" name="flag_cotizacion" id="flag_cotizacion">
									<option value="">Seleccione</option>
									<option value="1">Aprobado</option>
									<option value="0">No Aprobado</option>
								</select>
							</div>
							<label class="col-md-2 col-sm-6 col-xs-12 control-label div_respuesta">(*) Observación:</label>
							<div class="col-md-4 col-sm-6 col-xs-12 div_respuesta">
								<textarea name="cotizacion_respuesta" id="cotizacion_respuesta" class="form-control"></textarea>
							</div>

							<div class="col-md-7 col-sm-12 col-xs-12 div_oferta">
								<form id="form_oferta">
									' . $_oferta_content . '
									<input type="hidden" name="id_intr_proyecto" value="' . $_POST["id"] . '">
									<div class="col-md-12 col-sm-12 col-xs-12">
										<span><strong>Actualización Oferta Comercial</strong></span>
									</div>
									<div class="form-group col-md-4 col-sm-12 col-xs-12">
										<label class="control-label">Fecha Oferta:</label>
										<div data-min-view="2" data-start-view="4" data-date="' . date("Y-m-d", time()) . '" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker">
											<input size="16" type="text" value="" id="fecha_oferta" name="fecha_oferta" class="form-control input-xs" readonly=”readonly”><span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
										</div>
									</div>
									<div class="form-group col-md-4 col-sm-12 col-xs-12">
										<label class="control-label">Moneda Oferta:</label>
										' . $Internacional->getHtmlSelectMonedas_xs("moneda_oferta", "", "") . '
									</div>
									<div class="form-group col-md-4 col-sm-12 col-xs-12">
										<label class="control-label">Valor Oferta:</label>
										<input type="text" id="valor_oferta" name="valor_oferta" placeholder="Valor Oferta" class="form-control input-xs" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)">
									</div>
									<div class="form-group col-md-12 col-sm-12 col-xs-12">
										<label class="control-label">Archivo Oferta:</label>
										<input type="file" name="url_oferta" id="url_oferta" class="inputfile input-xs">
										<label for="url_oferta" class="btn-success"> <i class="mdi mdi-upload"></i><span>Busque Archivo...</span></label>
									</div>
								</form>
							</div>
						</div>
					';
			}

			$_msg_content["content"] .= '
					<input type="hidden" id="id_intr_proyecto" value="' . $_POST["id"] . '">
					<input type="hidden" id="id_actividad" value="' . $info_basica["ID_ACTIVIDAD"] . '">
					<input type="hidden" id="orden" value="' . $info_basica["orden"] . '">
					<input type="hidden" id="fecha_hora_inicio" value="' . $info_basica["fecha_hora_inicio"] . '">
					<input type="hidden" id="id_importacion" value="' . $info_basica["id_importacion"] . '">
					<input type="hidden" id="numero_importacion" value="' . $info_basica["numero_importacion"] . '">
					<input type="hidden" id="bloque" value="' . $info_basica["bloque"] . '">
					<input type="hidden" id="grupo" value="' . $info_basica["grupo"] . '">
					<input type="hidden" id="simultaneo" value="' . $info_basica["simultaneo"] . '">
					<input type="hidden" id="tipo_actividad" value="' . $info_basica["tipo_actividad"] . '">
					<input type="hidden" id="costo_real" value="' . $info_basica["costo_real"] . '">
					<input type="hidden" id="respuesta" value="' . $info_basica["respuesta"] . '">
					<!-- DATOS DE LA ACTIVIDAD EN EL PROYECTO -->
					<div id="accordion1" class="panel-group accordion">
						' . $accordion_content . '
					</div>
					' . $_select_gestiona_cotizacion . '
				';
		}
		break;

	case 'autoriza_cotizacion':
		$_msg_control .= "Entro en la acción autoriza_cotizacion.\n";
		$Internacional->setInactivaCotizaciones($_POST["id_intr_proyecto"], $_POST["id_concepto"]);
		if ($_POST["flag_checked"] == "true") {
			$array = array();
			$array["estado"] = 1;
			$Data->updateRegistro("cmx_intr_cotizaciones", $array, (int)$_POST["id_cotizacion"]);
		}

		// Se busca la información de la cotización 
		$cotizacion = $Internacional->getDatosCotizacion($_POST["id_intr_proyecto"]);
		// Se genera la tabla de totales de la cotización
		$_msg_content = calculaCotizacion($cotizacion["calcula_cotizacion"]);
		break;

	case 'borra_cotizacion':
		$_msg_control .= "Entro en la acción borra_cotizacion.\n";

		$id_cotizacion = $_POST["id"];
		$id_concepto = $_POST["id_concepto"];
		$id_solicitud = $_POST["id_solicitud"];
		$div = $_POST["div"];

		$array = array();
		$array["estado"] = 2;
		$Data->updateRegistro("cmx_intr_cotizaciones", $array, (int)$_POST["id"]);

		// Se busca la información de la cotización 
		$cotizacion = $Internacional->getDatosCotizacion($id_solicitud);
		$_array_result = $cotizacion;

		$i = 1;
		$_accordion_color = "panel-border-color-default";
		$cotizacion_content = '';
		if (isset($cotizacion["cotizaciones"][$_POST["id_concepto"]])) {
			$conseptos = $cotizacion["cotizaciones"][$_POST["id_concepto"]]["rowsData"];

			$array_accordion_content = cotizacionesContent($conseptos, $div);
			$cotizacion_content .= $array_accordion_content["content"];
			$_accordion_color = $array_accordion_content["color"];
			$i = $array_accordion_content["i"];
		}

		$cotizacion_content .= cotizacionFormContent($div, $i);
		$return["content"] = $cotizacion_content;
		$return["accordion_color"] = $_accordion_color;
		break;


	case 'edita_cotizacion':
		$_msg_control .= "Entro en la acción edita_cotizacion.\n";
		$id_cotizacion = $_POST["id"];
		$div = $_POST["div"];
		$observa = $_POST["descrip"];
		$money = $_POST["money"];
		/*$result=$Data->updateRegistro( "cmx_intr_cotizaciones", $array, (int)$_POST["id"] );*/
		$sql = "UPDATE cmx_intr_cotizaciones 
				SET descripcion='$observa',
				 valor='$money'
				WHERE id=$id_cotizacion";


		$result = $Data->ejecuteRegistro($sql);
		$return["result"] = $result["rowsData"];
		break;



	case 'cancelar_solicitud':
		$_msg_control .= "Entro en la acción cancelar_solicitud.\n";
		// Se inactiva la solicitud de internacional 
		$array = array();
		$array["estado"] = 0;
		$Data->updateRegistro("cmx_intr_solicitudes", $array, (int)$_POST["id_intr_proyecto"]);

		// Se gestiona la actividad actual 
		$array = array();
		$array["estado"] = 1;
		$array["fecha_hora_finalizacion"] = date('Y-m-d H:i:s', $time);
		$array["respuesta"] = $_POST["respuesta"];
		$Data->updateRegistro("cmx_importacion_actividades", $array, (int)$_POST["id"]);

		// Se gestionan todas las actividades activas del proyecto
		$sql = '
				UPDATE cmx_importacion_actividades
				SET estado = 1, fecha_hora_finalizacion = "' . date('Y-m-d H:i:s', $time) . '"
				WHERE 
					estado IN (2,3)
					AND id_importacion = ' . $_POST["id_importacion"] . '
			';
		$Data->getConsulta($sql);
		break;

	case 'editar_adjunta_cotizacion':
		$_msg_control .= "Entro en la acción editar_adjunta_cotizacion.\n";

		// Se busca la información de la cotización 
		$info = $Internacional->getDatosSubeFacturas($_POST["id"]);
		$general = $info["general"][0];
		$_array_result = $info;

		$_msg_content["title"] = 'Gestión de Cotizaciones - Error';
		$_msg_content["content"] = '
				<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
					<div class="icon">
						<span class="mdi mdi-close"></span>
					</div>
					<div class="message">
						<strong>Error!</strong><p>No hay información registrada de la cotización.</p>
					</div>
				</div>
			';

		if ($info["proveedores"]) {
			$_msg_content["title"] = 'Facturación - ' . $general["sigla"] . ' (' . $general["do"] . ')';

			// Se crea la tabla de tramos del proyecto
			$_origen = '
					<strong>Tramos</strong>
					<table class="table table-striped table-hover">
						<thead>
							<tr class="nexos-encabezado">
								<th>Tipo de Tramo</th>
								<th>Remitente - Destinatario</th>
								<th>Ubicación</th>
							</tr>
						</thead>
						<tbody>
				';

			if (isset($info["tramos"]["tramos"])) {
				foreach ($info["tramos"]["tramos"] as $key => $value) {
					$_origen .= '
							<tr>
								<td class="cell-detail">
									<span>' . $value["tipo_tramo"] . '</span>
								</td>
								<td class="cell-detail">
									<span>' . $value["sigla"] . '</span>
								</td>
								<td class="cell-detail">
									<span>' . $value["direccion"] . '</span>
									<span class="cell-detail-description">' . $value["CIUDAD"] . '</span>
								</td>
							</tr>
						';
				}
			}

			$_origen .= '
						</tbody>
					</table>
				';
			// Fin - Se crea la tabla de tramos del proyecto

			// Se crea la información de los materiales del proyecto
			$resumen_guias = "";
			$guias = "";
			if ($info["materiales"]) {
				$materiales = materialProyecto($info["materiales"]);

				$resumen_guias = $materiales["resumen"];
				$guias = $materiales["guias"];
			}
			// Fin - Se crea la información de los materiales del proyecto

			// Contenido del encabezado
			$_valor_declarado = '<span class="text-danger">Valor declarado no registrado</span>';
			if ($general["valor_declarado"] and $general["MONEDA"]) {
				$_valor_declarado = number_format($general["valor_declarado"], 2, ',', '.') . ' ' . $general["MONEDA"];
			}

			$_msg_content["content"] = '
					<table class="table">
						<tbody>
							<tr>
								<td class="cell-detail">
									<div class="form-group col-sm-3">
										<span>Cliente</span>
										<span class="cell-detail-description">' . $general["sigla"] . '</span>
										<span class="cell-detail-description">' . $general["DOC_CLIENTE"] . '</span>
										<span class="cell-detail-description">' . $general["cod_cliente"] . '</span>
									</div>
									<div class="form-group col-sm-3">
										<span>Negociación</span>
										<span class="cell-detail-description">' . $general["importacion"] . ' (' . $general["numero_importacion"] . ')</span>
										<span class="cell-detail-description">' . $general["tipo_operacion"] . ' (' . $general["tipo_transporte"] . ')</span>
										<span class="cell-detail-description">' . $general["incoterm"] . '</span>
									</div>
									<div class="form-group col-sm-3">
										<span>Valor Declarado</span>
										<span class="cell-detail-description">' . $_valor_declarado . '</span>
										<span class="cell-detail-description">' . $general["CONTENEDOR"] . '</span>
									</div>
									<div class="col-sm-12 col-md-12 col-xs-12"></div>
								</td>
							</tr>
							<tr><td></td></tr>
						</tbody>
					</table>
					<div class="col-sm-12 col-md-12 col-xs-12 text-right">
						<div class="be-checkbox">
							<input id="check_info" type="checkbox">
							<label for="check_info">Ver Detalles</label>
						</div>
					</div>
					<div class="form-group col-sm-12 col-md-12 col-xs-12 info_proyecto">
						' . $_origen . '
					</div>
					<div class="form-group col-sm-12 col-md-12 col-xs-12 info_proyecto">
						' . $resumen_guias .  '
					</div>
					<div class="form-group col-sm-12 col-md-12 col-xs-12 info_proyecto">
						' . $guias .  '
					</div>
					<div class="row"></div>
				';
			// Fin - Contenido del encabezado

			/***** Contenido del formulario para la creación de sobrecostos *****/
			$_msg_content["content"] .= '
					<div class="form-group col-xs-12 col-sm-12 col-md-12 be-checkbox text-right">
						<label>Registrar Sobrecosto:</label>
						<input type="checkbox" name="check_sobrecosto" id="check_sobrecosto">
						<label for="check_sobrecosto"></label>
					</div>
					<div class="form-group col-xs-12 col-sm-12 col-md-12" id="form_sobrecosto" style="display: none;">
						<div class="panel panel-border panel-contrast">
							<div class="panel-heading panel-heading-contrast">
								Sobrecosto
								<div class="tools"></div>
								<span class="panel-subtitle"></span>
							</div>
							<div class="panel-body">
								<form id="form_sobrecostos">
									<input type="hidden" name="id_intr_proyecto_sobrecosto" id="id_intr_proyecto_sobrecosto" value="' . $_POST["id"] . '">
									<input type="hidden" name="div" id="div" value="">
									<div class="form-group col-xs-12 col-sm-3 col-md-3">
										<label>(*) Concepto</label>
										' . $Internacional->getHtmlSelectConceptos("concepto", "", "")  . '
									</div>
									<div class="form-group col-xs-12 col-sm-3 col-md-3">
										<label class="control-label">(*) Fecha Factura:</label>
										<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
											<input size="10" type="text" value="' . date('Y-m-d', $time) . '" name="fecha" id="fecha" readonly="" class="form-control input-sm" placeholder="Fecha Factura">
											<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
										</div>
									</div>
									<div class="form-group col-xs-12 col-sm-6 col-md-6">
										<label>(*) Proveedor</label>
										' . $Internacional->getHtmlSelectProveedores("id_proveedor", "", " onchange=\"buscaProveedor(this)\"") . '
										<input type="hidden" name="proveedor" id="proveedor">
									</div>
									<div class="col-xs-12 col-sm-12 col-md-12"></div>

									<div class="form-group col-xs-12 col-sm-3 col-md-3">
										<label>(*) # Factura Proveedor</label>
										<input type="text" class="form-control input-sm" name="factura" id="factura" placeholder="# Factura">
									</div>
									<div class="form-group col-xs-12 col-sm-3 col-md-3">
										<label>(*) Valor Factura</label>
										<input type="text" class="form-control input-sm" name="valor" id="valor" onload="getFormatoNumeroDecimal(this)" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)" placeholder="Valor Factura">
									</div>
									<div class="form-group col-xs-12 col-sm-3 col-md-3">
										<label>(*) Moneda Factura</label>
										' . $Internacional->getHtmlSelectMonedas("moneda", "", "")  . '
									</div>
									<div class="form-group col-xs-12 col-sm-3 col-md-3">
										<label>(*) Adjunto Factura</label>
										<input type="file" name="file" id="file" class="inputfile input-sm" placeholder="Buscar Archivo...">
										<label for="file" class="btn-success input-xs"> 
											<i class="mdi mdi-upload"></i>
											<span>Buscar Archivo...</span>
										</label>
									</div>
									<div class="col-xs-12 col-sm-12 col-md-12">
										<label>(*) Descripción</label>
										<textarea class="form-control input-sm" name="descripcion" id="descripcion" placeholder="Descripción"></textarea>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div class="row"></div>
				';
			/***** Fin - Contenido del formulario para la creación de sobrecostos *****/

			/***** Contenido de los formularios para subir facturas por proveedor *****/
			$arrayProveedores = array();
			$_msg_content["content"] .= '
					<form id="form_facturas">
						<div id="accordion2" class="panel-group accordion">
							<input type="hidden" name="id_intr_proyecto" id="id_intr_proyecto" value="' . $_POST["id"] . '">
				';

			// print_r($info["proveedores"]);
			// exit();


			foreach ($info["proveedores"] as $key => $value) {
				$arrayProveedores[$value['id_proveedor']][] = $value;

				// Se pinta las cotizaciones del proveedor
				$_cotizaciones = '
						<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
							<div class="icon">
								<span class="mdi mdi-close"></span>
							</div>
							<div class="message">
								<strong>Atención!</strong>
								<p>No se ha registrado cotizaciones de este proveedor...</p>
							</div>
						</div>
					';
				if (isset($info["proveedor_cotizaciones"][$value['id_proveedor']])) {
					$_cotizaciones = '
							<strong>Cotizaciones</strong>
							<table class="table table-hover">
								<thead>
									<tr>
										<th>
											<div class="be-checkbox">
												<center>
													<input type="checkbox" class="check_cotizacion_todos"id="check_cotizacion_todos_' . $value['id_proveedor'] . '">
													<label for="check_cotizacion_todos_' . $value['id_proveedor'] . '"></label>
												</center>
											</div>
										</th>
										<th>Concepto</th>
										<th>Fecha</th>
										<th>Valor</th>
										<th></th>
										<th>Nota</th>
									</tr>
								</thead>
								<tbody>
						';

					$_total_cotizaciones = 0;
					$_total_sobrecostos = 0;

					$_flag_cotizacion_valor_pesos = true;
					$_valor_cotizacion_pesos = 0;
					$_flag_cotizacion_valor_usd = true;
					$_valor_cotizacion_usd = 0;
					$_id_cotizaciones = "";
					$_flag_muestra_formulario = false;
					foreach ($info["proveedor_cotizaciones"][$value['id_proveedor']] as $key_01 => $value_01) {
						$_id_cotizaciones .= $value_01['id'] . ",";
						$div = strtolower(str_replace(" ", "_", $value_01["CONCEPTO"]));
						$div = strtolower(str_replace("-", "_", $div));

						if ($_flag_cotizacion_valor_pesos and $value_01["VALOR_PESOS"]) {
							if ($value_01["sobrecosto"] == "1") {
								$_total_sobrecostos += $value_01["VALOR_PESOS"];
							} else {
								$_valor_cotizacion_pesos += $value_01["VALOR_PESOS"];
								$_total_cotizaciones += $value_01["VALOR_PESOS"];
							}
						} else {
							$_flag_cotizacion_valor_pesos = false;
						}

						if ($_flag_cotizacion_valor_usd and $value_01["VALOR_USD"]) {
							$_valor_cotizacion_usd += $value_01["VALOR_USD"];
						} else {
							$_flag_cotizacion_valor_usd = false;
						}

						// Se pregunta si es un sobrecosto
						$_sobrecosto = '';
						if ($value_01["sobrecosto"]) {
							$_sobrecosto = '<strong class="text-danger">(Sobrecosto)</strong>';
						}

						$_disabled = '';
						if ($value_01["id_factura"]) {
							$_disabled = 'disabled';
						} else {
							$_flag_muestra_formulario = true;
						}
						$_cotizaciones .= '
								<tr>
									<td>
										<div class="be-checkbox">
											<center>
												<input type="checkbox" class="check_cotizacion" name="check_cotizacion_' . $value_01['id'] . '" id="check_cotizacion_' . $value_01['id'] . '" value="' . $value_01['id'] . '" ' . $_disabled . '>
												<label for="check_cotizacion_' . $value_01['id'] . '"></label>
											</center>
										</div>
									</td>
									<td class="cell-detail">
										<span>' . $value_01["CONCEPTO"] . '</span>
										<span class="cell-detail-description">' . $_sobrecosto . '</span>
									</td>
									<td class="cell-detail text-center">
										<span>' . $value_01["fecha_cotizacion"] . '</span>
									</td>
									<td class="cell-detail text-right">
										<span>' . number_format($value_01["valor"], 2, ',', '.') . '</span>
										<span class="cell-detail-description">' . $value_01["codigo"] . '</span>
									</td>
									<td class="actions">
										<a href="' . BASE_URL . 'public/files/internacional/cotizaciones/' . $value_01["id_intr_proyecto"] . '/' . $div . '/' . $value_01["url"] . '" target="_blank" class="cell-detail hint--top-right" data-hint="Descargar Cotización">
											<span class="icon mdi mdi-download"></span>
										</a>
									</td>
									<td class="cell-detail-description">
										<textarea id="descripcion' . $value_01['id'] . '" class="form-control input-xs" readonly="readonly"  style="font-size:8px;">' . $value_01["descripcion"] . '</textarea>
									</td>
								</tr>

							';
					}

					$_total_cotizacion_pesos = 'Total en COP: <strong class="text-danger">Sin TRM</strong>';
					if ($_flag_cotizacion_valor_pesos) {
						$_total_cotizacion_pesos = 'Total en COP: <strong>' . number_format($_valor_cotizacion_pesos, 2, ',', '.') . '</strong>';
					}
					$_total_cotizacion_usd = 'Total en USD: <strong class="text-danger">Sin TRM</strong>';
					if ($_flag_cotizacion_valor_usd) {
						$_total_cotizacion_usd = 'Total en USD: <strong>' . number_format($_valor_cotizacion_usd, 2, ',', '.') . '</strong>';
					}
					$_cotizaciones .= '
									<tr>
										<td colspan="5" class="text-center">
											' . $_total_cotizacion_pesos . ' | ' . $_total_cotizacion_usd . '
											<input type="hidden" name="id_cotizaciones_' . $value['id_proveedor'] . '" value="' . $_id_cotizaciones . '">
										</td>
									</tr>
								</tbody>
							</table>
						';
				}

				// Se pinta las facturas del proveedor
				$_facturas = '
						<strong>Facturas</strong>
						<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
							<div class="icon">
								<span class="mdi mdi-close"></span>
							</div>
							<div class="message">
								<strong>Atención!</strong>
								<p>No se ha registrado facturas de este proveedor...</p>
							</div>
						</div>
					';

				$_cant_facturas = 0;
				$_valor_factura_pesos = 0;
				if (isset($info["proveedor_facturas"][$value['id_proveedor']])) {
					$_cant_facturas = COUNT($info["proveedor_facturas"][$value['id_proveedor']]);
					$_facturas = '
							<strong>Facturas</strong>
							<table class="table table-hover">
								<thead>
									<tr>
										<th></th>
										<th>Factura</th>
										<th>Valor</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
						';

					$_flag_factura_valor_pesos = true;
					$_valor_factura_pesos = 0;
					$_flag_factura_valor_usd = true;
					$_valor_factura_usd = 0;
					foreach ($info["proveedor_facturas"][$value['id_proveedor']] as $key_01 => $value_01) {
						if ($_flag_factura_valor_pesos and $value_01["VALOR_PESOS"]) {
							$_valor_factura_pesos += $value_01["VALOR_PESOS"];
						} else {
							$_flag_factura_valor_pesos = false;
						}
						if ($_flag_factura_valor_usd and $value_01["VALOR_USD"]) {
							$_valor_factura_usd += $value_01["VALOR_USD"];
						} else {
							$_flag_factura_valor_usd = false;
						}

						$_egreso = '
								<td class="actions nexos-actions">
									<center class="hint--top-right" data-hint="Sin egreso asignado">
										<span class="mdi mdi-dot-circle icon"></span>
									</center>
								</td>
							';
						if ($value_01["id_egreso"]) {
							$_egreso = '
									<td class="nexos-txt-warning text-center">
										<center class="hint--top-right" data-hint="Egreso asignado">
											<span class="mdi mdi-dot-circle icon"></span>
										</center>
									</td>
								';
						}

						$_facturas .= '
								<tr>
									' . $_egreso . '
									<td class="cell-detail">
										<span>' . $value_01["num_factura"] . '</span>
										<span class="cell-detail-description">' . $value_01["fecha_factura"] . '</span>
									</td>
									<td class="cell-detail text-right">
										<span>' . number_format($value_01["valor"], 2, ',', '.') . '</span>
										<span class="cell-detail-description">' . $value_01["codigo"] . '</span>
									</td>
									<td class="actions">
										<a href="' . BASE_URL . 'public/files/internacional/facturas/' . $value_01["id_intr_proyecto"] . '/' . $value_01["id_proveedor"] . '/' . $value_01["url"] . '" target="_blank" class="cell-detail hint--top-right" data-hint="Descargar Factura">
											<span class="icon mdi mdi-download"></span>
										</a>
									</td>
								</tr>
							';
					}

					$_total_factura_pesos = 'Total en COP: <strong class="text-danger">Sin TRM</strong>';
					if ($_flag_factura_valor_pesos) {
						$_total_factura_pesos = 'Total en COP: <strong>' . number_format($_valor_factura_pesos, 2, ',', '.') . '</strong>';
					}
					$_total_factura_usd = 'Total en USD: <strong class="text-danger">Sin TRM</strong>';
					if ($_flag_factura_valor_usd) {
						$_total_factura_usd = 'Total en USD: <strong>' . number_format($_valor_factura_usd, 2, ',', '.') . '</strong>';
					}
					$_facturas .= '
									<tr>
										<td colspan="4">
											' . $_total_factura_pesos . ' | ' . $_total_factura_usd . '
										</td>
									</tr>
								</tbody>
							</table>
						';
				}

				$_panel_color = "default";
				if ($_cant_facturas > 0) {
					$_panel_color = "warning";
					if (isset($_valor_cotizacion_pesos) and isset($_valor_factura_pesos)) {
						if ((int)$_valor_cotizacion_pesos == (int)$_valor_factura_pesos) {
							$_panel_color = "success";
						} elseif ((int)$_valor_cotizacion_pesos < (int)$_valor_factura_pesos) {
							$_panel_color = "danger";
						}
					}
				}

				// Se pinta el formulario del módulo de la pestaña 
				$_formulario = '';
				if ($_flag_muestra_formulario) {
					$_formulario = '
							<input type="hidden" name="id_proveedor_' . $value['id_proveedor'] . '" id="id_proveedor_' . $value['id_proveedor'] . '" value="' . $value['id_proveedor'] . '">
							<div class="form-group col-xs-12 col-sm-3 col-md-3">
								<label>(*) # Factura Proveedor</label>
								<input type="text" class="form-control input-sm" name="factura_' . $value['id_proveedor'] . '" id="factura_' . $value['id_proveedor'] . '" placeholder="# Factura">
							</div>
							<div class="form-group col-xs-12 col-sm-3 col-md-3">
								<label class="control-label">(*) Fecha Factura:</label>
								<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
									<input size="10" type="text" value="' . date('Y-m-d', $time) . '" name="fecha_' . $value['id_proveedor'] . '" id="fecha_' . $value['id_proveedor'] . '" readonly="" class="form-control input-sm" placeholder="Fecha Factura">
									<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
								</div>
							</div>
							<div class="form-group col-xs-12 col-sm-3 col-md-3">
								<label>(*) Valor Factura</label>
								<input type="text" class="form-control input-sm" name="valor_' . $value['id_proveedor'] . '" id="valor_' . $value['id_proveedor'] . '" onload="getFormatoNumeroDecimal(this)" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)" placeholder="Valor Factura">
							</div>
							<div class="form-group col-xs-12 col-sm-3 col-md-3">
								<label>(*) Moneda Factura</label>
								' . $Internacional->getHtmlSelectMonedas("moneda_" . $value['id_proveedor'], "", "")  . '
							</div>
							<div class="form-group col-xs-12 col-sm-12 col-md-12 text-center">
								<label>(*) Adjunto Factura</label>
								<input type="file" name="file_' . $value['id_proveedor'] . '" id="file_' . $value['id_proveedor'] . '" class="inputfile input-sm facturas" placeholder="Buscar Archivo...">
								<label for="file_' . $value['id_proveedor'] . '" class="btn-success input-xs"> 
									<i class="mdi mdi-upload"></i>
									<span>Buscar Archivo...</span>
								</label>
							</div>
						';
				}

				// Contenido del acordeón por proveedor
				$_msg_content["content"] .= '
						<div class="panel panel-default panel-border-color panel-border-color-' . $_panel_color . ' proveedor" id="proveedor_' . $value['id_proveedor'] . '">
							<div class="panel-heading">
								<div class="tools">
								</div>
								<h4 class="panel-title">
									<a data-toggle="collapse" data-parent="#accordion2" href="#accordion_' . $value['id_proveedor'] . '" class="collapsed" aria-expanded="false"><i class="icon mdi mdi-chevron-down"></i> <span class="accordion_title">' . $value["proveedor"] . '</span>
										<span class="panel-subtitle">Cotizaciones: <strong>(' . $value["CUANTOS"] . ')</strong> | Facturas: <strong>(' . $_cant_facturas . ')</strong> | Total Cotizaciones: <strong>$' . number_format($_total_cotizaciones, 0, ',', '.') . '</strong> | Total Facturas: <strong>$' . number_format($_valor_factura_pesos, 0, ',', '.') . '</strong> | Sobrecostos: <strong>$' . number_format($_total_sobrecostos, 0, ',', '.') . '</strong></span>
									</a>
								</h4>
							</div>
							<div id="accordion_' . $value['id_proveedor'] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
								<div class="panel-body">
									' . $_formulario . '
									<div class="col-xs-12 col-sm-12 col-md-6">
										' . $_cotizaciones . '
									</div>
									<div class="col-xs-12 col-sm-12 col-md-6">
										' . $_facturas . '
									</div>
								</div>
							</div>
						</div>
					';
			}

			// Se llena el contenido de los impuestos generados
			if (isset($info["impuestos"])) {
				$_impuestos = '
						<div class="col-xs-0 col-sm-1 col-md-1"></div>
						<div class="col-xs-12 col-sm-10 col-md-10">
							<table class="table table-hover">
								<thead>
									<tr>
										<th></th>
										<th>Proveedor</th>
										<th>Concepto</th>
										<th>Fecha</th>
										<th>Valor</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
					';

				foreach ($info["impuestos"] as $key => $value) {
					$_egreso = '
							<td class="actions nexos-actions">
								<center class="hint--top-right" data-hint="Sin egreso asignado">
									<span class="mdi mdi-dot-circle icon"></span>
								</center>
							</td>
						';
					if ($value["id_egreso"]) {
						$_egreso = '
								<td class="nexos-txt-warning">
									<center class="hint--top-right" data-hint="Egreso asignado">
										<span class="mdi mdi-dot-circle icon"></span>
									</center>
								</td>
							';
					}

					$_impuestos .= '
							<tr>
								' . $_egreso . ' 
								<td class="cell-detail">
									<span>' . $value["abreviatura"] . '</span>
								</td>
								<td class="cell-detail">
									<span>' . $value["nombre"] . '</span>
									<span class="cell-detail-description">' . $value["descripcion"] . '</span>
								</td>
								<td class="cell-detail">
									<span>' . $value["fecha_factura"] . '</span>
								</td>
								<td class="cell-detail">
									<span>' . number_format($value["valor"], 2, ',', '.') . '</span>
									<span class="cell-detail-description">' . $value["nom_moneda"] . ' (' . $value["codigo"] . ')</span>
								</td>
								<td class="actions">
									<a href="' . BASE_URL . 'public/files/internacional/facturas/' . $_POST["id"] . '/' . $value["id_proveedor"] . '/' . $value["url"] . '" target="_blank" class="cell-detail hint--top-right" data-hint="Descargar Factura">
										<span class="icon mdi mdi-download"></span>
									</a>
								</td>
							</tr>
						';
				}

				$_impuestos .= '
								</tbody>
							</table>
						</div>
						<div class="col-xs-0 col-sm-1 col-md-1"></div>
					';

				$_msg_content["content"] .= '
						<div class="panel panel-default panel-border-color panel-border-color-default" id="impuesto">
							<div class="panel-heading">
								<div class="tools">
								</div>
								<h4 class="panel-title">
									<a data-toggle="collapse" data-parent="#accordion2" href="#accordion_impuestos" class="collapsed" aria-expanded="false"><i class="icon mdi mdi-chevron-down"></i> Impuestos <strong>(' . COUNT($info["impuestos"]) . ')</strong>
									</a>
								</h4>
							</div>
							<div id="accordion_impuestos" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
								<div class="panel-body">
									' . $_impuestos . '
								</div>
							</div>
						</div>
					';
			}

			$_msg_content["content"] .= '
						</div>
					</form>
				';
			/***** Fin - Contenido de los formularios para subir facturas por proveedor *****/
		}
		break;

	case 'adjunta_factura':
		$_msg_control .= "Entro en la acción adjunta_factura.\n";

		$id_intr_proyecto = $_POST["id_intr_proyecto"];

		foreach ($_FILES as $key => $value) {
			$file = $value;
			if ($file["error"] == 0) {
				$div = explode("file_", $key);
				$id = $div[1];

				$extension = $Internacional->get_extension_archivo($value["name"]);

				// Se crea la información de la factura de la cotización con varias facturas una cotización
				$array = array();
				$array["num_factura"] = $_POST["factura_" . $id];
				$array["id_intr_proyecto"] = $_POST["id_intr_proyecto"];
				$array["id_proveedor"] = $_POST["id_proveedor_" . $id];
				$array["fecha_factura"] = $_POST["fecha_" . $id];
				$array["valor"] = (float)str_replace(",", ".", str_replace(".", "", $_POST["valor_" . $id]));
				$array["id_moneda"] = $_POST["moneda_" . $id];
				$id_factura = $Data->setRegistro("cmx_intr_facturas", $array);

				// Se guarda la información de la ubicacion del archivo de factura
				$archivo = $id_intr_proyecto . "-" . $_POST["id_proveedor_" . $id] . "-" . $id_factura . "-" . date('Y-m-d', $time) . "." . $extension;
				$array = array();
				$array["url"] = $archivo;
				$Data->updateRegistro("cmx_intr_facturas", $array, (int)$id_factura);

				// Se asigna la factura a las cotizaciones seleccionadas
				$arrayCotizaciones = explode(",", $_POST["id_cotizaciones_" . $id]);
				foreach ($arrayCotizaciones as $value) {
					if (isset($_POST["check_cotizacion_" . $value])) {
						$array = array();
						$array["id_factura"] = $id_factura;
						$Data->updateRegistro("cmx_intr_cotizaciones", $array, (int)$_POST["check_cotizacion_" . $value]);
					}
				}

				// Se deja activa las actividades de solicitud egreso y Anticipo al Proveedor
				$Internacional->activaActividades($_POST["id_intr_proyecto"], $_POST["id_proveedor_" . $id]);

				// Se guarda el archivo en el servidor 
				$tmp_file = $file["tmp_name"];
				$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
				if (move_uploaded_file($tmp_file, $archivo_temporal)) {
					// Se crean las carpetas de destino del archivo
					$carpeta_destino = "../public/files/internacional/facturas/" . $id_intr_proyecto . "/" . $_POST["id_proveedor_" . $id];
					if (!file_exists($carpeta_destino)) {
						mkdir($carpeta_destino, 0777, true);
					}

					$destino = $carpeta_destino . "/" . $archivo;

					if (copy($archivo_temporal, $destino)) {
						$return["copy_file_result"] = true;
					} else {
						$return["copy_file_result"] = false;
					}
				}
				if (file_exists($archivo_temporal)) {
					unlink($archivo_temporal);
				}
			}
		}
		break;

	case 'adjunta_sobrecosto':
		$_msg_control .= "Entro en la acción adjunta_sobrecosto.\n";

		$div = strtolower(str_replace(" ", "_", $_POST["div"]));
		$div = strtolower(str_replace("-", "_", $div));

		// Se saca el nombre del archivo de la cotización 
		$file = $_FILES["file"];
		$extension = $Internacional->get_extension_archivo($file["name"]);

		// Se guarda la infomacion de la factura
		$array["num_factura"] = $_POST["factura"];
		$array["id_intr_proyecto"] = $_POST["id_intr_proyecto_sobrecosto"];
		$array["id_proveedor"] = $_POST["id_proveedor"];
		$array["fecha_factura"] = $_POST["fecha"];
		$array["valor"] = (float)str_replace(",", ".", str_replace(".", "", $_POST["valor"]));
		$array["id_moneda"] = $_POST["moneda"];
		$id_factura = $Data->setRegistro("cmx_intr_facturas", $array);

		// Se guarda la información del adjunto de la factura 
		$archivo_factura = $_POST["id_intr_proyecto_sobrecosto"] . "-" . $_POST["id_proveedor"] . "-" . $id_factura . "-" . date('Y-m-d', $time) . "." . $extension;
		$array = array();
		$array["url"] = $archivo_factura;
		$Data->updateRegistro("cmx_intr_facturas", $array, (int)$id_factura);

		// Se guarda la infomacion de la cotización 
		$array = array();
		$array["id_intr_proyecto"] = $_POST["id_intr_proyecto_sobrecosto"];
		$array["id_factura"] = (int)$id_factura;
		$array["id_concepto"] = $_POST["concepto"];
		$array["id_proveedor"] = $_POST["id_proveedor"];
		$array["proveedor"] = $_POST["proveedor"];
		$array["valor"] = (float)str_replace(",", ".", str_replace(".", "", $_POST["valor"]));
		$array["id_moneda"] = $_POST["moneda"];
		$array["fecha_cotizacion"] = $_POST["fecha"];
		if (isset($_POST["descripcion"]) and $_POST["descripcion"]) {
			$array["descripcion"] = $_POST["descripcion"];
		}
		$array["sobrecosto"] = 1;
		$array["estado"] = 1;
		$cotizacion = $Data->setRegistro("cmx_intr_cotizaciones", $array);

		$archivo_cotizacion = $_POST["id_intr_proyecto_sobrecosto"] . "-" . $_POST["concepto"] . "-" . $cotizacion . "-" . $_POST["fecha"] . "." . $extension;

		// Se actualiza el dato del archivo de la cotización 
		$array = array();
		$array["url"] = $archivo_cotizacion;
		$Data->updateRegistro("cmx_intr_cotizaciones", $array, (int)$cotizacion);

		// Se deja activa las actividades de solicitud egreso y Anticipo al Proveedor
		$Internacional->activaActividades($_POST["id_intr_proyecto_sobrecosto"], $_POST["id_proveedor"]);

		// Se guardan los archivos de la cotización y de la factura  
		// Se guarda el archivo de la cotización del sobrecosto
		if ($file["error"] == 0) {
			$tmp_file = $file["tmp_name"];
			$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
			if (move_uploaded_file($tmp_file, $archivo_temporal)) {

				/***** ARCHIVO DE LA COTIZACIÓN *****/
				// Se crean las carpetas de destino del archivo
				$carpeta_destino = "../public/files/internacional/cotizaciones/" . $_POST["id_intr_proyecto_sobrecosto"] . "/" . $div;
				if (!file_exists($carpeta_destino)) {
					mkdir($carpeta_destino, 0777, true);
					// print_r("Si se pudo crear la carpeta \n");
				}

				$destino = $carpeta_destino . "/" . $archivo_cotizacion;

				if (copy($archivo_temporal, $destino)) {
					$return["copy_file_result"]["cotizacion"] = true;
				} else {
					$return["copy_file_result"]["cotizacion"] = false;
				}

				/***** ARCHIVO DE LA FACTURA *****/
				$carpeta_destino = "../public/files/internacional/facturas/" . $_POST["id_intr_proyecto_sobrecosto"] . "/" . $_POST["id_proveedor"];
				if (!file_exists($carpeta_destino)) {
					mkdir($carpeta_destino, 0777, true);
					// print_r("Si se pudo crear la carpeta \n");
				}

				$destino = $carpeta_destino . "/" . $archivo_factura;

				if (copy($archivo_temporal, $destino)) {
					$return["copy_file_result"]["factura"] = true;
				} else {
					$return["copy_file_result"]["factura"] = false;
				}
			}
			if (file_exists($archivo_temporal)) {
				unlink($archivo_temporal);
			}
		} else {
			$return["copy_file_result"] = false;
		}
		break;

	case 'form_gestiona_actividad_facturas':
		$_msg_control .= "Entro en la acción form_gestiona_actividad_facturas.\n";

		// Se busca la información de la cotización 
		$cotizacion = $Internacional->getDatosSubeFacturas($_POST["id"]);
		$_array_result = $cotizacion;

		$general = $cotizacion["general"]["rowsData"][0];

		$_tabla_cotizaciones = '
				<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
					<div class="icon">
						<span class="mdi mdi-check"></span>
					</div>
					<div class="message text-left">
						<button type="button" data-dismiss="alert" aria-label="Close" class="close">
							<span aria-hidden="true" class="mdi mdi-close"></span>
						</button>
						<strong>Atención!</strong>
						<p>No se ha registrado ninguna cotización para este proyecto.</p>
					</div>
				</div>
			';

		$proveedores = $cotizacion["proveedores"];
		if ($proveedores) {
			$_tabla_cotizaciones = '
					<strong>Resumen Cotizaciones y Facturas</strong>
					<table class="table table-striped table-hover table-condensed">
						<thead>
							<tr class="nexos-encabezado">
								<th>Cliente</th>
								<th>Total Cotizaciones</th>
								<th>Total Facturas</th>
							</tr>
						</thead>
						<tbody>
				';

			foreach ($proveedores as $key => $value) {
				// Se calcula el valor total de las cotizaciones 
				if (isset($cotizacion["proveedor_cotizaciones"][$value[0]])) {
					$_flag_cotizacion_valor_pesos = true;
					$_valor_cotizacion_pesos = 0;
					$_flag_cotizacion_valor_usd = true;
					$_valor_cotizacion_usd = 0;
					foreach ($cotizacion["proveedor_cotizaciones"][$value[0]] as $key_01 => $value_01) {
						if ($_flag_cotizacion_valor_pesos and $value_01["VALOR_PESOS"]) {
							$_valor_cotizacion_pesos += $value_01["VALOR_PESOS"];
						} else {
							$_flag_cotizacion_valor_pesos = false;
						}

						if ($_flag_cotizacion_valor_usd and $value_01["VALOR_USD"]) {
							$_valor_cotizacion_usd += $value_01["VALOR_USD"];
						} else {
							$_flag_cotizacion_valor_usd = false;
						}
					}

					$_total_cotizacion_pesos = '<strong class="text-danger">Sin TRM</strong>';
					if ($_flag_cotizacion_valor_pesos) {
						$_total_cotizacion_pesos = number_format($_valor_cotizacion_pesos, 2, ',', '.') . ' COP';
					}
					$_total_cotizacion_usd = '<strong class="text-danger">Sin TRM</strong>';
					if ($_flag_cotizacion_valor_usd) {
						$_total_cotizacion_usd = number_format($_valor_cotizacion_usd, 2, ',', '.') . ' USD';
					}
				}

				// Se calcula el valor total de las facturas 
				$_cant_facturas = 0;
				$_valor_factura_pesos = 0;
				if (isset($cotizacion["proveedor_facturas"][$value[0]])) {
					$_cant_facturas = COUNT($cotizacion["proveedor_facturas"][$value[0]]);

					$_flag_factura_valor_pesos = true;
					$_valor_factura_pesos = 0;
					$_flag_factura_valor_usd = true;
					$_valor_factura_usd = 0;
					foreach ($cotizacion["proveedor_facturas"][$value[0]] as $key_01 => $value_01) {
						if ($_flag_factura_valor_pesos and $value_01["VALOR_PESOS"]) {
							$_valor_factura_pesos += $value_01["VALOR_PESOS"];
						} else {
							$_flag_factura_valor_pesos = false;
						}

						if ($_flag_factura_valor_usd and $value_01["VALOR_USD"]) {
							$_valor_factura_usd += $value_01["VALOR_USD"];
						} else {
							$_flag_factura_valor_usd = false;
						}
					}

					$_total_factura_pesos = '<strong class="text-danger">Sin TRM</strong>';
					if ($_flag_factura_valor_pesos) {
						$_total_factura_pesos = number_format($_valor_factura_pesos, 2, ',', '.') . ' COP';
					}
					$_total_factura_usd = '<strong class="text-danger">Sin TRM</strong>';
					if ($_flag_factura_valor_usd) {
						$_total_factura_usd = number_format($_valor_factura_usd, 2, ',', '.') . ' USD';
					}
				}

				// Se filtra el contenido del resumen de las cotizaciones y facturas del proyecto
				$_factura_color_COP = "";
				if ($_flag_factura_valor_pesos and (float)$_valor_cotizacion_pesos < (float)$_valor_factura_pesos) {
					$_factura_color_COP = 'class="text-danger"';
				} elseif ((float)$_valor_cotizacion_pesos > (float)$_valor_factura_pesos) {
					$_factura_color_COP = 'class="text-success"';
				}

				$_factura_color_USD = "";
				if ($_flag_factura_valor_usd and (float)$_valor_cotizacion_usd < (float)$_valor_factura_usd) {
					$_factura_color_USD = 'class="text-danger"';
				} elseif ((float)$_valor_cotizacion_usd > (float)$_valor_factura_usd) {
					$_factura_color_USD = 'class="text-success"';
				}

				$_tabla_cotizaciones .= '
						<tr>
							<td class="cell-detail text-left">
								<span>' . $value["proveedor"] . '</span>
							</td>
							<td class="cell-detail text-right">
								<span><strong>' . $_total_cotizacion_pesos . '</strong></span>
								<span class="cell-detail-description"><strong>' . $_total_cotizacion_usd . '</strong></span>
							</td>
							<td class="cell-detail text-right">
								<span><strong ' . $_factura_color_COP . '>' . $_total_factura_pesos . '</strong></span>
								<span class="cell-detail-description"><strong ' . $_factura_color_USD . '>' . $_total_factura_usd . '</strong></span>
							</td>
						</tr>
					';
			}

			$_tabla_cotizaciones .= '
						</tbody>
					</table>
				';
		}

		$_msg_content = '
				<form id="form_gestiona_actividad">
					<div class="text-warning"><span class="modal-main-icon mdi mdi-alert-triangle"></span></div>
					<h3>¡Atención!</h3>
					<h4>¿Realmente desea terminar de subir las facturas del <strong>' . $general["do"] . '</strong>?</h4>
					' . $_tabla_cotizaciones . '
					<div class="xs-mt-50">
						<button type="button" data-dismiss="modal" class="btn btn-space btn-default">Cancelar</button>
						<button id="btn_gestiona_actividad" type="button" class="btn btn-space btn-success">Gestionar</button>
					</div>
				</form>
			';

		// Se pregunta si se debe gestionar la actividad cuando es de una factura por cotización
		$array = array();
		$array["id"] = $general["ID_ACTIVIDAD"] . ",";
		$array["orden"] = $general["orden"];
		$array["fecha_hora_inicio"] = $general["fecha_hora_inicio"];
		$array["id_importacion"] = $general["id_importacion"];
		$array["bloque"] = $general["bloque"];
		$array["grupo"] = $general["grupo"];
		$array["simultaneo"] = $general["simultaneo"];
		$array["tipo_actividad"] = $general["tipo_actividad"];
		$array["costo_real"] = $general["costo_real"];
		$array["respuesta"] = $general["respuesta"];
		$return["actividad"] = $array;
		break;

	case 'form_adjunta_egreso':
		$_msg_control .= "Entro en la acción form_adjunta_egreso.\n";

		$return["content"]["content"] = "";
		$return["content"]["title"] = "No hay datos";

		// Se busca la información de las facturas del proveedor 
		$facturas = $Internacional->getDatosSolicitaEgreso($_POST["id"]);
		$_array_result = $facturas;

		if ($facturas) {
			// Se pinta la información del proveedor
			$_proveedor_content = '
					<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<strong>Atención!</strong>
							<p>No hay información del proveedor...</p>
						</div>
					</div>
				';
			if ($facturas["proveedor"]) {
				$proveedor = $facturas["proveedor"];
				$return["content"]["title"] = 'Solicitud de egreso - <span id="nom_proveedor">' . $proveedor["abreviatura"] . '</span>';

				$_proveedor_content = '
						<strong>Proveedor</strong>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-4">
											<span>' . $proveedor["nombre"] . '</span>
											<span class="cell-detail-description">' . $proveedor["tipo_documento"] . ' - ' . $proveedor["numero_documento"] . '-' . $proveedor["digito_verificacion"] . '</span>
											<span class="cell-detail-description">' . $proveedor["tipo_regimen"] . '</span>
										</div>
										<div class="col-sm-4">
											<span>Contacto:</span>
											<span class="cell-detail-description">Tel. ' . $proveedor["contacto"] . '</span>
											<span class="cell-detail-description">' . $proveedor["celular"] . '</span>
											<span class="cell-detail-description">' . $proveedor["email"] . '</span>
										</div>
										<div class="col-sm-4">
											<span>Ubicación:</span>
											<span class="cell-detail-description">' . $proveedor["direccion"] . '</span>
											<span class="cell-detail-description">' . $proveedor["CIUDAD"] . '</span>
										</div>
									</td>
								</tr>
								<tr><td></td></tr>
							</tbody>
						</table>
					';
			}

			// Se pinta la información de las facturas
			$_facturas_content = '
					<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<strong>Atención!</strong>
							<p>No hay facturas registradas...</p>
						</div>
					</div>
				';
			if ($facturas["facturas"]) {
				$_facturas_content = '
						<form id="form_egreso">
							<div class="col-xs-12 col-sm-12 col-md-12 text-center">
								<input type="hidden" name="id_facturas" id="id_facturas">
								<input type="hidden" name="total_facturas_pesos" id="total_facturas_pesos">
								<h3>Total Facturas:</h3>
								<h4 id="total_facturas_pesos_text">$0</h4>
							</div>
						</form>
						<strong>Facturas</strong>
						<div id="accordion1" class="panel-group accordion">
					';

				foreach ($facturas["facturas"] as $key => $value) {
					// Se valida se se puede seleccionar la factura para egreso 
					$_check_disabled = "disabled";
					$_panel_color = "danger";
					if ($value["TRM_FACTURA_PROVEEDOR"]) {
						$_check_disabled = "";
						$_panel_color = "default";
						$_factura_pesos = "";
						if ($value["id_moneda"] != 2) {
							$_valor_pesos = $value["TRM_FACTURA_PROVEEDOR"] * $value["valor"];
							$_factura_pesos = " | Factura en COP: <strong>" . number_format($_valor_pesos, 2, ',', '.') . "</strong>";
						} else {
							$_valor_pesos = $value["valor"];
						}
					} else {
						$_factura_pesos = ' | Factura en COP: <strong class="text-danger">TRM no registrado</strong> ';
						$_valor_pesos = 0;
					}

					// Se valida el contenido de los conceptos cotizados de la factura 
					$_cant_conceptos = 0;
					$_cotizaciones = '
							<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
								<div class="icon">
									<span class="mdi mdi-close"></span>
								</div>
								<div class="message">
									<strong>Atención!</strong>
									<p>No hay cotizaciones registradas para la factura <strong>' . $value["num_factura"] . '</strong>...</p>
								</div>
							</div>
						';

					if ($facturas["cotizaciones"][$value['id']]) {
						// $_cant_conceptos = $facturas["cotizaciones"][$value['id']]["rowsNum"];
						$_cant_conceptos = $facturas["cotizaciones"][$value['id']];
						// Tabla de listado de cotizaciones de la factura
						$_cotizaciones = '
								<div class="col-xs-12 col-sm-12 col-md-12">
									<table id="table" class="table table-hover">
										<thead>
											<tr>
												<th>Concepto</th>
												<th>Fecha</th>
												<th>Valor</th>
												<th>Valor en COP</th>
												<th></th>
											</tr>
										</thead>
											<tbody>
							';

						foreach ($facturas["cotizaciones"][$value['id']] as $key_01 => $value_01) {
							// Se verifica si la cotización corresponde a un sobrecosto

							// Se toma la carpeta del concepto de la factura
							$concepto_div = strtolower(str_replace(" ", "_", $value_01["CONCEPTO"]));
							$concepto_div = strtolower(str_replace("-", "_", $concepto_div));

							$_sobrecosto = "";
							if ($value_01["sobrecosto"]) {
								$_sobrecosto = '<strong class="text-danger">(Sobrecosto)</strong>';
							}

							$_valor_cotizacion_pesos = '<span><strong class="text-danger">TRM no registrado</strong></span>';
							if ($value_01["TRM_COTIZACION"]) {
								$valor_cotizacion_pesos = $value_01["valor"] * $value_01["TRM_COTIZACION"];
								$_valor_cotizacion_pesos = '
										<span><strong>$' . number_format($valor_cotizacion_pesos, 2, ',', '.') . '</strong></span>
									';
							}

							$_cotizaciones .= '
									<tr>
										<td class="cell-detail">
											<span>' . $_sobrecosto . ' ' . $value_01["CONCEPTO"] . '</span>
											<span class="cell-detail-description">' . $value_01["descripcion"] . '</span>
										</td>
										<td class="cell-detail">
											<span>' . $value_01["fecha_cotizacion"] . '</span>
										</td>
										<td class="cell-detail">
										 	<span>' . number_format($value_01["valor"], 2, ',', '.') . ' ' . $value_01["MONEDA_COTIZACION"] . '</span>
										</td>
										<td class="cell-detail text-right">
											' . $_valor_cotizacion_pesos . '
										</td>
										<td class="actions">
											<a href="' . BASE_URL . 'public/files/internacional/cotizaciones/' . $value_01["id_intr_proyecto"] . '/' . $concepto_div . '/' . $value_01["URL_COTIZACION"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar Cotización">
												<span class="icon mdi mdi-download"></span>
											</a>
										</td>
									</tr>
								';
						}

						$_cotizaciones .= '
										</tbody>
									</table>
								</div>
							';
					}
					// Fin - Se valida el contenido de los conceptos cotizados de la factura 

					$_facturas_content .= '
							<div class="panel panel-default panel-border-color panel-border-color-' . $_panel_color . ' proveedor">
								<div class="panel-heading">
									<div class="tools">
					 					<a href="' . BASE_URL . 'public/files/internacional/facturas/' . $value["id_intr_proyecto"] . '/' . $value["id_proveedor"] . '/' . $value["url"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar Factura">
					 						<span class="icon mdi mdi-download"></span>
					 					</a>
									</div>
									<div class="tools">
										<div class="be-checkbox">
											<input class="check_facturas" value="' . $value['id'] . '" id="check_factura_' . $value['id'] . '" type="checkbox" data-moneda="' . $value["id_moneda"] . '" data-factura_pesos="' . $_valor_pesos . '" ' . $_check_disabled . '>
											<label for="check_factura_' . $value['id'] . '"></label>
										</div>
									</div>
									<h4 class="panel-title">
										<a data-toggle="collapse" data-parent="#accordion1" href="#accordion_' . $value['id'] . '" class="collapsed" aria-expanded="false"><i class="icon mdi mdi-chevron-down"></i> ' . $value["do"] . ' <small>Factura Proveedor: <strong>' . $value["num_factura"] . '</strong></small>
											<span class="panel-subtitle"># Conceptos: <strong>' . $_cant_conceptos . '</strong> | Fecha: <strong>' . $value["fecha_factura"] . '</strong> | Valor: <strong>' . number_format($value["valor"], 2, ',', '.') . ' ' . $value["MONEDA_FACTURA"] . '</strong>' . $_factura_pesos . '</span>
										</a>
									</h4>
								</div>
								<div id="accordion_' . $value['id'] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
									<div class="panel-body">
										' . $_cotizaciones . '
									</div>
								</div>
							</div>
						';
				}
				$_facturas_content .= '
						</div>
					';
			}
			$return["content"]["content"] = $_proveedor_content . $_facturas_content;
		}
		break;

	case 'adjunta_egreso':
		$_msg_control .= "Entro en la acción adjunta_egreso.\n";

		$numero_egreso = "EGR-" . $time;

		// Se guarda la infomacion del comprobante de egreso
		$array = array();
		$array["numero_egreso"] = $numero_egreso;
		$array["fecha_egreso"] = date('Y-m-d', $time);
		$array["valor"] = $_POST["total_facturas_pesos"];
		$id_egreso = $Data->setRegistro("cmx_intr_egresos", $array);

		// Se relaciona el comprobante de egreso a las facturas seleccionadas
		$arrayFacturas = explode(",", $_POST["id_facturas"]);
		for ($i = 0; $i < COUNT($arrayFacturas) - 1; $i++) {
			$array = array();
			$array["id_egreso"] = $id_egreso;
			$Data->updateRegistro("cmx_intr_facturas", $array, (int)$arrayFacturas[$i]);

			// Se pregunta si se debe gestionar la actividad 
			$return["flag_gestion"][$i] = $Internacional->validaGestionActividadEgreso($arrayFacturas[$i]);;
		}
		break;

	case 'ver_registro_egreso':
		$_msg_control .= "Entro en la acción ver_anticipo_proveedor.\n";

		$return["content"]["content"] = "";

		// Se busca la información de las facturas del proveedor 
		$anticipos = $Internacional->getDatosAnticiposProveedores($_POST["id"]);
		$_array_result = $anticipos;

		$return["content"]["title"] = "Proveedores Varios";
		$proveedor = $anticipos["proveedor"];
		$return["content"]["title"] = "Egreso - " . $_POST["egreso"] . " (" . $proveedor["abreviatura"] . ")";

		$_proveedor_content = '
				<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
					<div class="icon">
						<span class="mdi mdi-close"></span>
					</div>
					<div class="message">
						<strong>Atención!</strong>
						<p>No hay información del proveedor...</p>
					</div>
				</div>
			';
		$_facturas_content = '
				<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
					<div class="icon">
						<span class="mdi mdi-close"></span>
					</div>
					<div class="message">
						<strong>Atención!</strong>
						<p>No hay facturas registradas...</p>
					</div>
				</div>
			';
		if ($anticipos) {
			// Se pinta la información del proveedor
			if ($anticipos["proveedor"]) {
				$proveedor = $anticipos["proveedor"];

				$_proveedor_content = '
						<strong>Proveedor</strong>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-sm-4">
											<span>' . $proveedor["nombre"] . '</span>
											<span class="cell-detail-description">' . $proveedor["tipo_documento"] . ' - ' . $proveedor["numero_documento"] . '-' . $proveedor["digito_verificacion"] . '</span>
											<span class="cell-detail-description">' . $proveedor["tipo_regimen"] . '</span>
										</div>
										<div class="col-sm-4">
											<span>Contacto:</span>
											<span class="cell-detail-description">Tel. ' . $proveedor["contacto"] . '</span>
											<span class="cell-detail-description">' . $proveedor["celular"] . '</span>
											<span class="cell-detail-description">' . $proveedor["email"] . '</span>
										</div>
										<div class="col-sm-4">
											<span>Ubicación:</span>
											<span class="cell-detail-description">' . $proveedor["direccion"] . '</span>
											<span class="cell-detail-description">' . $proveedor["CIUDAD"] . '</span>
										</div>
									</td>
								</tr>
								<tr><td></td></tr>
							</tbody>
						</table>
					';
			}

			// Se pinta la información de las facturas
			if ($anticipos["facturas"]) {
				$_facturas_content = '
						<form id="form_egreso">
							<div class="col-xs-12 col-sm-12 col-md-12 text-center">
								<h3>Total Facturas:</h3>
								<h4 id="total_facturas_pesos_text">$%total_facturas%</h4>
							</div>
						</form>
						<strong>Facturas</strong>
						<div id="accordion1" class="panel-group accordion">
					';

				$total_facturas_pesos = 0;
				foreach ($anticipos["facturas"] as $key => $value) {
					// Se valida se se puede seleccionar la factura para egreso 
					$_check_disabled = "disabled";
					$_panel_color = "danger";
					if ($value["TRM_FACTURA_PROVEEDOR"]) {
						$_check_disabled = "";
						$_panel_color = "default";
						$_factura_pesos = "";
						if ($value["id_moneda"] != 2) {
							$_valor_pesos = $value["TRM_FACTURA_PROVEEDOR"] * $value["valor"];
							$_factura_pesos = " | Factura en COP: <strong>" . number_format($_valor_pesos, 2, ',', '.') . "</strong>";
						} else {
							$_valor_pesos = $value["valor"];
						}
					} else {
						$_factura_pesos = ' | Factura en COP: <strong class="text-danger">TRM no registrado</strong> ';
						$_valor_pesos = 0;
					}

					$total_facturas_pesos = $total_facturas_pesos + $_valor_pesos;

					// Se valida el contenido de los conceptos cotizados de la factura 
					$_cant_conceptos = 0;
					$_cotizaciones = '
							<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
								<div class="icon">
									<span class="mdi mdi-close"></span>
								</div>
								<div class="message">
									<strong>Atención!</strong>
									<p>No hay cotizaciones registradas para la factura <strong>' . $value["num_factura"] . '</strong>...</p>
								</div>
							</div>
						';
					if ($anticipos["cotizaciones"][$value['id']]) {
						// $_cant_conceptos = $anticipos["cotizaciones"][$value[0]]["rowsNum"];
						$_cant_conceptos = $anticipos["cotizaciones"][$value['id']];
						// Tabla de listado de cotizaciones de la factura
						$_cotizaciones = '
								<div class="col-xs-12 col-sm-12 col-md-12">
									<table id="table" class="table table-hover">
										<thead>
											<tr>
												<th>Concepto</th>
												<th>Fecha</th>
												<th>Valor</th>
												<th>Valor en COP</th>
												<th></th>
											</tr>
										</thead>
											<tbody>
							';

						foreach ($anticipos["cotizaciones"][$value['id']] as $key_01 => $value_01) {
							// Se verifica si la cotización corresponde a un sobrecosto

							// Se toma la carpeta del concepto de la factura
							$concepto_div = strtolower(str_replace(" ", "_", $value_01["CONCEPTO"]));
							$concepto_div = strtolower(str_replace("-", "_", $concepto_div));

							$_sobrecosto = "";
							if ($value_01["sobrecosto"]) {
								$_sobrecosto = '<strong class="text-danger">(Sobrecosto)</strong>';
							}

							$_valor_cotizacion_pesos = '
									<span><strong class="text-danger">TRM no registrado</strong></span>
								';
							if ($value_01["TRM_COTIZACION"]) {
								$valor_cotizacion_pesos = $value_01["valor"] * $value_01["TRM_COTIZACION"];
								$_valor_cotizacion_pesos = '
										<span><strong>$' . number_format($valor_cotizacion_pesos, 2, ',', '.') . '</strong></span>
									';
							}

							$_cotizaciones .= '
									<tr>
										<td class="cell-detail">
											<span>' . $_sobrecosto . ' ' . $value_01["CONCEPTO"] . '</span>
										</td>
										<td class="cell-detail">
											<span>' . $value_01["fecha_cotizacion"] . '</span>
										</td>
										<td class="cell-detail">
										 	<span>' . number_format($value_01["valor"], 2, ',', '.') . ' ' . $value_01["MONEDA_COTIZACION"] . '</span>
										</td>
										<td class="cell-detail text-right">
											' . $_valor_cotizacion_pesos . '
										</td>
										<td class="actions">
											<a href="' . BASE_URL . 'public/files/internacional/cotizaciones/' . $value_01["id_intr_proyecto"] . '/' . $concepto_div . '/' . $value_01["URL_COTIZACION"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar Cotización">
												<span class="icon mdi mdi-download"></span>
											</a>
										</td>
									</tr>
								';
						}

						$_cotizaciones .= '
										</tbody>
									</table>
								</div>
							';
					}
					// Fin - Se valida el contenido de los conceptos cotizados de la factura 

					$_facturas_content .= '
							<div class="panel panel-default panel-border-color panel-border-color-' . $_panel_color . ' proveedor">
								<div class="panel-heading">
									<div class="tools">
					 					<a href="' . BASE_URL . 'public/files/internacional/facturas/' . $value["id_intr_proyecto"] . '/' . $value["id_proveedor"] . '/' . $value["url"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar Factura">
					 						<span class="icon mdi mdi-download"></span>
					 					</a>
									</div>
									<h4 class="panel-title">
										<a data-toggle="collapse" data-parent="#accordion1" href="#accordion_' . $value['id'] . '" class="collapsed" aria-expanded="false"><i class="icon mdi mdi-chevron-down"></i> ' . $value["do"] . ' <small><strong>' . $value["NOM_CLIENTE"] . '</strong></small>
											<span class="panel-subtitle">Factura Proveedor: <strong>' . $value["num_factura"] . '</strong> | # Conceptos: <strong>' . $_cant_conceptos . '</strong> | Fecha: <strong>' . $value["fecha_factura"] . '</strong> | Valor: <strong>' . number_format($value["valor"], 2, ',', '.') . ' ' . $value["MONEDA_FACTURA"] . '</strong>' . $_factura_pesos . '</span>
										</a>
									</h4>
								</div>
								<div id="accordion_' . $value['id'] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
									<div class="panel-body">
										' . $_cotizaciones . '
									</div>
								</div>
							</div>
						';
				}
				$_facturas_content .= '
						</div>
					';

				$_facturas_content = str_replace("%total_facturas%", number_format($total_facturas_pesos, 2, ',', '.'), $_facturas_content);
			}
		}
		$return["content"]["content"] = $_proveedor_content . $_facturas_content;
		break;

	case 'form_registra_egreso':
		$_msg_control .= "Entro en la acción form_registra_egreso.\n";

		$return["content"]["title"] = "Registro de Egreso";

		$array_egresos = explode(",", $_POST["egresos"]);
		// $return["array_pagos"] = $array_egresos;

		$_accordion = '';
		$total_egresos = 0;
		$total_egresos_pesos = 0;
		foreach ($array_egresos as $value) {
			if ($value) {
				// Se busca la información de las facturas del proveedor 
				$egresos = $Internacional->getDatosAnticiposProveedores($value);
				$_array_result[] = $egresos;

				/***** Contenido del proveedor que pertenece al egreso *****/
				$_proveedor_content = '
						<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
							<div class="icon">
								<span class="mdi mdi-close"></span>
							</div>
							<div class="message">
								<strong>Atención!</strong>
								<p>No hay información del proveedor...</p>
							</div>
						</div>
					';
				// Se pinta la información del proveedor
				if ($egresos["proveedor"]) {
					$proveedor = $egresos["proveedor"]["rowsData"][0];

					$_proveedor_content = '
							<strong>Proveedor</strong>
							<table class="table">
								<tbody>
									<tr>
										<td class="cell-detail">
											<div class="col-sm-4">
												<span>' . $proveedor["nombre"] . '</span>
												<span class="cell-detail-description">' . $proveedor["tipo_documento"] . ' - ' . $proveedor["numero_documento"] . '-' . $proveedor["digito_verificacion"] . '</span>
												<span class="cell-detail-description">' . $proveedor["tipo_regimen"] . '</span>
											</div>
											<div class="col-sm-4">
												<span>Contacto:</span>
												<span class="cell-detail-description">Tel. ' . $proveedor["contacto"] . '</span>
												<span class="cell-detail-description">' . $proveedor["celular"] . '</span>
												<span class="cell-detail-description">' . $proveedor["email"] . '</span>
											</div>
											<div class="col-sm-4">
												<span>Ubicación:</span>
												<span class="cell-detail-description">' . $proveedor["direccion"] . '</span>
												<span class="cell-detail-description">' . $proveedor["CIUDAD"] . '</span>
											</div>
										</td>
									</tr>
									<tr><td></td></tr>
								</tbody>
							</table>
						';
				}
				/***** Contenido del proveedor que pertenece al egreso *****/

				/***** Contenido de las facturas que pertenecen al egreso *****/
				$_facturas_content = '
						<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
							<div class="icon">
								<span class="mdi mdi-close"></span>
							</div>
							<div class="message">
								<strong>Atención!</strong>
								<p>No hay facturas registradas...</p>
							</div>
						</div>
					';
				if ($egresos["facturas"]) {
					$_facturas_content = '
							<strong>Facturas</strong>
							<div id="accordion2" class="panel-group accordion">
						';

					$total_facturas = 0;
					$total_facturas_pesos = 0;
					foreach ($egresos["facturas"]["rowsData"] as $key_010 => $value_010) {
						// Se valida se se puede seleccionar la factura para egreso 
						$_check_disabled = "disabled";
						$_panel_color = "danger";
						if ($value_010["TRM_FACTURA_PROVEEDOR"]) {
							$_check_disabled = "";
							$_panel_color = "default";
							$_factura_pesos = "";
							if ($value_010["id_moneda"] != 2) {
								$_valor_pesos = $value_010["TRM_FACTURA_PROVEEDOR"] * $value_010["valor"];
								$_factura_pesos = " | Factura en COP: <strong>" . number_format($_valor_pesos, 2, ',', '.') . "</strong>";
							} else {
								$_valor_pesos = $value_010["valor"];
							}
						} else {
							$_factura_pesos = ' | Factura en COP: <strong class="text-danger">TRM no registrado</strong> ';
							$_valor_pesos = 0;
						}

						$total_facturas = $total_facturas + $value_010["valor"];
						$total_facturas_pesos = $total_facturas_pesos + $_valor_pesos;
						$total_egresos = $total_egresos + $value_010["valor"];
						$total_egresos_pesos = $total_egresos_pesos + $_valor_pesos;

						// Se valida el contenido de los conceptos cotizados de la factura 
						$_cant_conceptos = 0;
						$_cotizaciones = '
								<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
									<div class="icon">
										<span class="mdi mdi-close"></span>
									</div>
									<div class="message">
										<strong>Atención!</strong>
										<p>No hay cotizaciones registradas para la factura <strong>' . $value_010["num_factura"] . '</strong>...</p>
									</div>
								</div>
							';
						if ($egresos["cotizaciones"][$value_010[0]]) {
							$_cant_conceptos = $egresos["cotizaciones"][$value_010[0]]["rowsNum"];
							// Tabla de listado de cotizaciones de la factura
							$_cotizaciones = '
									<div class="col-xs-12 col-sm-12 col-md-12">
										<table id="table" class="table table-hover">
											<thead>
												<tr>
													<th>Concepto</th>
													<th>Fecha</th>
													<th>Valor</th>
													<th>Valor en COP</th>
													<th></th>
												</tr>
											</thead>
												<tbody>
								';

							foreach ($egresos["cotizaciones"][$value_010[0]]["rowsData"] as $key_020 => $value_020) {
								// Se verifica si la cotización corresponde a un sobrecosto

								// Se toma la carpeta del concepto de la factura
								$concepto_div = strtolower(str_replace(" ", "_", $value_020["CONCEPTO"]));
								$concepto_div = strtolower(str_replace("-", "_", $concepto_div));

								$_sobrecosto = "";
								if ($value_020["sobrecosto"]) {
									$_sobrecosto = '<strong class="text-danger">(Sobrecosto)</strong>';
								}

								$_valor_cotizacion_pesos = '
										<span><strong class="text-danger">TRM no registrado</strong></span>
									';
								if ($value_020["TRM_COTIZACION"]) {
									$valor_cotizacion_pesos = $value_020["valor"] * $value_020["TRM_COTIZACION"];
									$_valor_cotizacion_pesos = '
											<span><strong>$' . number_format($valor_cotizacion_pesos, 2, ',', '.') . '</strong></span>
										';
								}

								$_cotizaciones .= '
										<tr>
											<td class="cell-detail">
												<span>' . $_sobrecosto . ' ' . $value_020["CONCEPTO"] . '</span>
											</td>
											<td class="cell-detail">
												<span>' . $value_020["fecha_cotizacion"] . '</span>
											</td>
											<td class="cell-detail">
											 	<span>' . number_format($value_020["valor"], 2, ',', '.') . ' ' . $value_020["MONEDA_COTIZACION"] . '</span>
											</td>
											<td class="cell-detail text-right">
												' . $_valor_cotizacion_pesos . '
											</td>
											<td class="actions">
												<a href="' . BASE_URL . 'public/files/internacional/cotizaciones/' . $value_020["id_intr_proyecto"] . '/' . $concepto_div . '/' . $value_020["URL_COTIZACION"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar Cotización">
													<span class="icon mdi mdi-download"></span>
												</a>
											</td>
										</tr>
									';
							}

							$_cotizaciones .= '
											</tbody>
										</table>
									</div>
								';
						}
						// Fin - Se valida el contenido de los conceptos cotizados de la factura 

						$_facturas_content .= '
								<div class="panel panel-default panel-border-color panel-border-color-' . $_panel_color . ' proveedor">
									<div class="panel-heading">
										<div class="tools">
						 					<a href="' . BASE_URL . 'public/files/internacional/facturas/' . $value_010["id_intr_proyecto"] . '/' . $value_010["id_proveedor"] . '/' . $value_010["url"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar Factura">
						 						<span class="icon mdi mdi-download"></span>
						 					</a>
										</div>
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#accordion2" href="#accordion_' . $value_010[0] . '" class="collapsed" aria-expanded="false"><i class="icon mdi mdi-chevron-down"></i> ' . $value_010["do"] . ' <small><strong>' . $value_010["NOM_CLIENTE"] . '</strong></small>
												<span class="panel-subtitle">Factura: <strong>' . $value_010["num_factura"] . '</strong> | # Conceptos: <strong>' . $_cant_conceptos . '</strong> | Fecha: <strong>' . $value_010["fecha_factura"] . '</strong> | Valor: <strong>' . number_format($value_010["valor"], 2, ',', '.') . ' ' . $value_010["MONEDA_FACTURA"] . '</strong>' . $_factura_pesos . '</span>
											</a>
										</h4>
									</div>
									<div id="accordion_' . $value_010[0] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
										<div class="panel-body">
											' . $_cotizaciones . '
										</div>
									</div>
								</div>
							';
					}
					$_facturas_content .= '
							</div>
						';
				}
				/***** Fin - Contenido de las facturas que pertenecen al egreso *****/

				$_accordion_content = $_facturas_content;

				$_accordion .= '
						<div class="panel panel-default">
							<div class="panel-heading">
								<h4 class="panel-title">
									<a data-toggle="collapse" data-parent="#accordion1" href="#collapse_' . $value . '">
										<i class="icon mdi mdi-chevron-down"></i> ' . $value_010["numero_egreso"] . ' <small>(' . $value_010["fecha_egreso"] . ')</small>
										<span class="panel-subtitle">Cant. Facturas: <strong>' . $egresos["facturas"]["rowsNum"] . '</strong> | Total Facturas: <strong>' . number_format($total_facturas, 2, ',', '.') . ' ' . $value_010["MONEDA_FACTURA"] . '</strong> | Total Facturas en COP: <strong>$' . number_format($total_facturas_pesos, 2, ',', '.') . '</strong></span>
									</a>
								</h4>
							</div>
							<div id="collapse_' . $value . '" class="panel-collapse collapse">
								<div class="panel-body">
									' . $_accordion_content . '
								</div>
							</div>
						</div>
					';
			}
		}

		/***** Encabezado del formulario *****/
		$encabezado = '
				<strong>Resumen Registro de Pago</strong>
				<table class="table">
					<tbody>
						<tr>
							<td class="cell-detail">
								<div class="col-sm-4">
									<span>Cantidad Egresos:</span>
									<span class="cell-detail-description">' . (COUNT($array_egresos) - 1) . '</span>
								</div>
								<div class="col-sm-4">
									<span>Valor Total:</span>
									<span class="cell-detail-description">' . number_format($total_egresos, 2, ',', '.') . ' ' . $value_010["MONEDA_FACTURA"] . '</span>
								</div>
								<div class="col-sm-4">
									<span>Valor Total en Pesos:</span>
									<span class="cell-detail-description">$' . number_format($total_egresos_pesos, 2, ',', '.') . '</span>
								</div>
							</td>
						</tr>
						<tr><td></td></tr>
					</tbody>
				</table>
			';
		/***** Fin - Encabezado del formulario *****/

		/***** Formulario de gestión de las activiadades *****/
		$moneda = $egresos["total_monedas"]["rowsData"][0]["MONEDA"];

		$form_content = '';
		if ($egresos["total_monedas"]) {
			$form_content = '
					<div class="panel panel-border panel-contrast">
						<div class="panel-heading panel-heading-contrast">
							Registrar Egreso para Pago
						</div>
						<div class="panel-body">
							' . $encabezado . '
							' . $_proveedor_content . '
							<form id="form_egreso">
								<input type="hidden" id="id_egresos" name="id_egresos" value="' . $_POST["egresos"] . '">
								<input type="hidden" id="valor_pago_pesos" name="valor_pago_pesos" value="' . $total_egresos_pesos . '">
								<div class="col-xs-12 col-sm-4 col-md-4">
									<h4><strong>' . $moneda . '</strong></h4>
									<h4 class="text-muted" id="valor_egreso">' . number_format($total_egresos, 2, ',', '.') . '</h4>
								</div>
								<div class="form-group col-xs-12 col-sm-3 col-md-3">
									<label class="control-label">(*) # Egreso:</label>
									<input type="text" name="egreso_numero" id="egreso_numero" class="form-control input-sm">
								</div>
								<div class="form-group col-xs-12 col-sm-3 col-md-3">
									<label class="control-label">(*) Fecha Egreso:</label>
									<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
										<input size="10" type="text" value="" name="egreso_fecha" id="egreso_fecha" readonly="" class="form-control input-sm">
										<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
									</div>
								</div>
								<div class="form-group col-xs-12 col-sm-2 col-md-2">
									<label>(*) Adjunto Egreso</label><br>
									<input type="file" name="egreso_file" id="egreso_file" class="inputfile input-xs" placeholder="Buscar Archivo...">
									<label for="egreso_file" class="btn-success input-xs"> 
										<i class="mdi mdi-upload"></i>
										<span>Buscar Archivo...</span>
									</label>
								</div>
							</form>
						</div>
					</div>
				';
		}
		/***** Fin - Formulario de gestión de las activiadades *****/

		$return["content"]["content"] = '
				' . $form_content . '
				<strong>Egresos</strong>
				<div id="accordion1" class="panel-group accordion">
					' . $_accordion . '
				</div>
			';
		break;

	case 'registrar_egreso':
		$_msg_control .= "Entro en la acción registrar_egreso.\n";

		if (isset($_POST["egreso_numero"]) and isset($_POST["valor_pago_pesos"]) and isset($_POST["egreso_fecha"])) {
			// Se guarda el registro del desembolso 
			$array = array();
			$array["numero_pago"] = "PGO-" . $time;
			$array["numero_egreso"] = $_POST["egreso_numero"];
			$array["valor_egreso"] = (float)$_POST["valor_pago_pesos"];
			$array["fecha_egreso"] = $_POST["egreso_fecha"];
			$id_pago = $Data->setRegistro("cmx_intr_egresos_pagos", $array);
			// $return["array"] = $array;

			$arrayEgresos = explode(",", $_POST["id_egresos"]);
			foreach ($arrayEgresos as $value) {
				if ($value) {
					$array = array();
					$array["id_pago"] = $id_pago;
					$array["estado"] = 1;
					$Data->updateRegistro("cmx_intr_egresos", $array, (int)$value);

					// Se pregunta si se debe gestionar la actividad 
					$return["flag_gestion"][] = $Internacional->validaGestionActividadRegistroEgreso($value);
				}
			}

			// Se guarda el adjunto en el servidor
			if (isset($_FILES["egreso_file"])) {
				// Se saca el nombre del archivo de la cotización 
				$file = $_FILES["egreso_file"];
				$extension = $Internacional->get_extension_archivo($file["name"]);

				// Se guarda la url del archivo en la base de datos 
				$array = array();
				$array["url_egreso"] = $id_pago . "." . $extension;
				$Data->updateRegistro("cmx_intr_egresos_pagos", $array, (int)$id_pago);

				// Se guarda el archivo de la cotización del sobrecosto
				if ($file["error"] == 0) {
					$tmp_file = $file["tmp_name"];
					$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
					if (move_uploaded_file($tmp_file, $archivo_temporal)) {

						/***** ARCIVO DE LA COTIZACIÓN *****/
						// Se crean las carpetas de destino del archivo
						$carpeta_destino = "../public/files/internacional";
						if (!file_exists($carpeta_destino)) {
							mkdir($carpeta_destino, 0777, true);
							// print_r("Si se pudo crear la carpeta \n");
						}

						$carpeta_destino_1 = $carpeta_destino . "/egresos";
						if (!file_exists($carpeta_destino_1)) {
							mkdir($carpeta_destino_1, 0777, true);
							// print_r("Si se pudo crear la carpeta \n");
						}

						$destino = $carpeta_destino_1 . "/" . $id_pago . "." . $extension;

						if (copy($archivo_temporal, $destino)) {
							$return["copy_file_result"] = true;
						} else {
							$return["copy_file_result"] = false;
						}
					}
					if (file_exists($archivo_temporal)) {
						unlink($archivo_temporal);
					}
				} else {
					$return["copy_file_result"] = false;
				}
			}
		} else {
			$_msg_error .= "<p>No se puedo generar el registro de pago.</p>";
		}

		break;

	case 'form_crea_pago':
		$_msg_control .= "Entro en la acción form_crea_pago.\n";

		$total_egresos = 0;
		$total_egresos_pesos = 0;
		$_accordion = '';

		$_msg_content["content"] = "";

		$array_egresos = explode(",", $_POST["egresos"]);

		foreach ($array_egresos as $value) {
			if ($value) {
				// Se busca la información de las facturas del proveedor 
				$egresos = $Internacional->getDatosPagos($value);

				/***** Contenido del proveedor que pertenece al egreso *****/
				$_proveedor_content = '
						<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
							<div class="icon">
								<span class="mdi mdi-close"></span>
							</div>
							<div class="message">
								<strong>Atención!</strong>
								<p>No hay información del proveedor...</p>
							</div>
						</div>
					';
				// Se pinta la información del proveedor
				if ($egresos["proveedor"]) {
					$proveedor = $egresos["proveedor"][0];

					$_proveedor_content = '
							<strong>Proveedor</strong>
							<table class="table">
								<tbody>
									<tr>
										<td class="cell-detail">
											<div class="col-sm-4">
												<span>' . $proveedor["nombre"] . '</span>
												<span class="cell-detail-description">' . $proveedor["tipo_documento"] . ' - ' . $proveedor["numero_documento"] . '-' . $proveedor["digito_verificacion"] . '</span>
												<span class="cell-detail-description">' . $proveedor["tipo_regimen"] . '</span>
											</div>
											<div class="col-sm-4">
												<span>Contacto:</span>
												<span class="cell-detail-description">Tel. ' . $proveedor["contacto"] . '</span>
												<span class="cell-detail-description">' . $proveedor["celular"] . '</span>
												<span class="cell-detail-description">' . $proveedor["email"] . '</span>
											</div>
											<div class="col-sm-4">
												<span>Ubicación:</span>
												<span class="cell-detail-description">' . $proveedor["direccion"] . '</span>
												<span class="cell-detail-description">' . $proveedor["CIUDAD"] . '</span>
											</div>
										</td>
									</tr>
									<tr><td></td></tr>
								</tbody>
							</table>
						';
				}
				/***** Contenido del proveedor que pertenece al egreso *****/

				/***** Contenido de las facturas que pertenecen al egreso *****/
				$_facturas_content = '
						<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
							<div class="icon">
								<span class="mdi mdi-close"></span>
							</div>
							<div class="message">
								<strong>Atención!</strong>
								<p>No hay facturas registradas...</p>
							</div>
						</div>
					';
				if ($egresos["facturas"]) {
					$_facturas_content = '
							<strong>Facturas</strong>
							<div id="accordion2" class="panel-group accordion">
						';

					$total_facturas = 0;
					$total_facturas_pesos = 0;
					foreach ($egresos["facturas"] as $key_010 => $value_010) {
						// Se valida se se puede seleccionar la factura para egreso 
						$_check_disabled = "disabled";
						$_panel_color = "danger";
						if ($value_010["TRM_FACTURA_PROVEEDOR"]) {
							$_check_disabled = "";
							$_panel_color = "default";
							$_factura_pesos = "";
							if ($value_010["id_moneda"] != 2) {
								$_valor_pesos = $value_010["TRM_FACTURA_PROVEEDOR"] * $value_010["valor"];
								$_factura_pesos = " | Factura en COP: <strong>" . number_format($_valor_pesos, 2, ',', '.') . "</strong>";
							} else {
								$_valor_pesos = $value_010["valor"];
							}
						} else {
							$_factura_pesos = ' | Factura en COP: <strong class="text-danger">TRM no registrado</strong> ';
							$_valor_pesos = 0;
						}

						$total_facturas = $total_facturas + $value_010["valor"];
						$total_facturas_pesos = $total_facturas_pesos + $_valor_pesos;
						$total_egresos = $total_egresos + $value_010["valor"];
						$total_egresos_pesos = $total_egresos_pesos + $_valor_pesos;

						// Se valida el contenido de los conceptos cotizados de la factura 
						$_cant_conceptos = 0;
						$_cotizaciones = '
								<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
									<div class="icon">
										<span class="mdi mdi-close"></span>
									</div>
									<div class="message">
										<strong>Atención!</strong>
										<p>No hay cotizaciones registradas para la factura <strong>' . $value_010["num_factura"] . '</strong>...</p>
									</div>
								</div>
							';
						if ($egresos["cotizaciones"][$value_010['id']]) {
							// $_cant_conceptos = $egresos["cotizaciones"][$value_010[0]]["rowsNum"];
							$_cant_conceptos = $egresos["cotizaciones"][$value_010['id']];
							// Tabla de listado de cotizaciones de la factura
							$_cotizaciones = '
									<div class="col-xs-12 col-sm-12 col-md-12">
										<table id="table" class="table table-hover">
											<thead>
												<tr>
													<th>Concepto</th>
													<th>Fecha</th>
													<th>Valor</th>
													<th>Valor en COP</th>
													<th></th>
												</tr>
											</thead>
												<tbody>
								';

							foreach ($egresos["cotizaciones"][$value_010['id']] as $key_020 => $value_020) {
								// Se verifica si la cotización corresponde a un sobrecosto

								// Se toma la carpeta del concepto de la factura
								$concepto_div = strtolower(str_replace(" ", "_", $value_020["CONCEPTO"]));
								$concepto_div = strtolower(str_replace("-", "_", $concepto_div));

								$_sobrecosto = "";
								if ($value_020["sobrecosto"]) {
									$_sobrecosto = '<strong class="text-danger">(Sobrecosto)</strong>';
								}

								$_valor_cotizacion_pesos = '
										<span><strong class="text-danger">TRM no registrado</strong></span>
									';
								if ($value_020["TRM_COTIZACION"]) {
									$valor_cotizacion_pesos = $value_020["valor"] * $value_020["TRM_COTIZACION"];
									$_valor_cotizacion_pesos = '
											<span><strong>$' . number_format($valor_cotizacion_pesos, 2, ',', '.') . '</strong></span>
										';
								}

								$_cotizaciones .= '
										<tr>
											<td class="cell-detail">
												<span>' . $_sobrecosto . ' ' . $value_020["CONCEPTO"] . '</span>
											</td>
											<td class="cell-detail">
												<span>' . $value_020["fecha_cotizacion"] . '</span>
											</td>
											<td class="cell-detail">
											 	<span>' . number_format($value_020["valor"], 2, ',', '.') . ' ' . $value_020["MONEDA_COTIZACION"] . '</span>
											</td>
											<td class="cell-detail text-right">
												' . $_valor_cotizacion_pesos . '
											</td>
											<td class="actions">
												<a href="' . BASE_URL . 'public/files/internacional/cotizaciones/' . $value_020["id_intr_proyecto"] . '/' . $concepto_div . '/' . $value_020["URL_COTIZACION"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar Cotización">
													<span class="icon mdi mdi-download"></span>
												</a>
											</td>
										</tr>
									';
							}

							$_cotizaciones .= '
											</tbody>
										</table>
									</div>
								';
						}
						// Fin - Se valida el contenido de los conceptos cotizados de la factura 

						$_facturas_content .= '
								<div class="panel panel-default panel-border-color panel-border-color-' . $_panel_color . ' proveedor">
									<div class="panel-heading">
										<div class="tools">
						 					<a href="' . BASE_URL . 'public/files/internacional/facturas/' . $value_010["id_intr_proyecto"] . '/' . $value_010["id_proveedor"] . '/' . $value_010["url"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar Factura">
						 						<span class="icon mdi mdi-download"></span>
						 					</a>
										</div>
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#accordion2" href="#accordion_' . $value_010['id'] . '" class="collapsed" aria-expanded="false"><i class="icon mdi mdi-chevron-down"></i> ' . $value_010["do"] . ' <small><strong>' . $value_010["NOM_CLIENTE"] . '</strong></small>
												<span class="panel-subtitle">Factura: <strong>' . $value_010["num_factura"] . '</strong> | # Conceptos: <strong>' . $_cant_conceptos . '</strong> | Fecha: <strong>' . $value_010["fecha_factura"] . '</strong> | Valor: <strong>' . number_format($value_010["valor"], 2, ',', '.') . ' ' . $value_010["MONEDA_FACTURA"] . '</strong>' . $_factura_pesos . '</span>
											</a>
										</h4>
									</div>
									<div id="accordion_' . $value_010['id'] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
										<div class="panel-body">
											' . $_cotizaciones . '
										</div>
									</div>
								</div>
							';
					}
					$_facturas_content .= '
							</div>
						';
				}
				/***** Fin - Contenido de las facturas que pertenecen al egreso *****/

				$_accordion_content = $_facturas_content;
				// $egresos["facturas"]["rowsNum"]
				$_accordion .= '
						<div class="panel panel-default">
							<div class="panel-heading">
								<h4 class="panel-title">
									<a data-toggle="collapse" data-parent="#accordion1" href="#collapse_' . $value . '">
										<i class="icon mdi mdi-chevron-down"></i> ' . $value_010["numero_egreso"] . ' <small>(' . $value_010["fecha_egreso"] . ')</small>
										<span class="panel-subtitle">Cant. Facturas: <strong>' . $egresos["facturas"]["rowsNum"] . '</strong> | Total Facturas: <strong>' . number_format($total_facturas, 2, ',', '.') . ' ' . $value_010["MONEDA_FACTURA"] . '</strong> | Total Facturas en COP: <strong>$' . number_format($total_facturas_pesos, 2, ',', '.') . '</strong></span>
									</a>
								</h4>
							</div>
							<div id="collapse_' . $value . '" class="panel-collapse collapse">
								<div class="panel-body">
									' . $_accordion_content . '
								</div>
							</div>
						</div>
					';
			}
		}

		/***** Se pinta el encabezado del formulario de registro de pagos *****/
		$_header_registra_egreso = '';
		$pagos = $Internacional->getInfoPago($_POST["id"]);
		$_array_result["pago"] = $pagos;
		if ($pagos) {
			$pago = $pagos[0];
			$_msg_content["title"] = "Subir Registro de Pago - " . $pago["numero_egreso"] . " (" . $pago["numero_pago"] . ")";
			$_header_registra_egreso = '
					<strong>Información del Pago</strong>
					<table class="table">
						<tbody>
							<tr>
								<td class="cell-detail">
									<span># Pago</span>
									<span class="cell-detail-description">' . $pago["numero_egreso"] . '</span>
									<span class="cell-detail-description">' . $pago["numero_pago"] . '</span>
								</td>
								<td class="cell-detail">
									<span># Cant. Egresos</span>
									<span class="cell-detail-description">' . $pago["CUANTOS"] . '</span>
								</td>
								<td class="cell-detail">
									<span>Fecha Egreso</span>
									<span class="cell-detail-description">' . $pago["fecha_egreso"] . '</span>
								</td>
								<td class="cell-detail">
									<span>Valor</span>
									<span class="cell-detail-description">' . number_format($pago["TOTAL_FACTURAS"], 2, ',', '.') . '</span>
									<span class="cell-detail-description">' . $pago["MONEDA"] . '</span>
								</td>
								<td class="cell-detail">
									<span>Valor en COP</span>
									<span class="cell-detail-description">$' . number_format($pago["valor_egreso"], 2, ',', '.') . '</span>
								</td>
								<td class="actions cell-detail">
									<span>
										<a href="' . BASE_URL . 'public/files/internacional/egresos/' . $pago["url_egreso"] . '" class="cell-detail hint--top-left" data-hint="Descargar Egreso" target="_blank"><span class="icon mdi mdi-download"></span></a>
									</span>
								</td>
							</tr>
							<tr><td colspan="6"></td></tr>
						</tbody>
					</table>
				';
		}

		// Se pinta el formulario de gestion de la actividad 
		$form_content = '
				<div class="panel panel-border panel-contrast">
					<div class="panel-heading panel-heading-contrast">
						Registrar Comprobante de Desembolso
					</div>
					<div class="panel-body">
						' . $_header_registra_egreso . '
						' . $_proveedor_content . '
						<form id="form_registro_pago">
							<input type="hidden" name="id_pago" id="id_pago" value="' . $_POST["id"] . '">
							<div class="form-group col-xs-12 col-sm-3 col-md-3">
								<label class="control-label">(*) Fecha Desembolso:</label>
								<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
									<input size="10" type="text" value="" name="fecha_pago" id="fecha_pago" readonly="" class="form-control input-sm">
									<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
								</div>
							</div>
							<div class="form-group col-xs-12 col-sm-4 col-md-4">
								<label>(*) Valor Debitado:</label>
								<input type="text" class="form-control input-sm" name="valor_pago" id="valor_pago" value="' . number_format($pago["valor_egreso"], 2, ',', '.') . '" onload="getFormatoNumeroDecimal(this)" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)" placeholder="Valor Debitado">
							</div>
							<div class="form-group col-xs-12 col-sm-4 col-md-4">
								<label>(*) Adjunto Comprobante de Pago:</label><br>
								<input type="file" name="pago_file" id="pago_file" class="inputfile input-xs" placeholder="Buscar Archivo...">
								<label for="pago_file" class="btn-success input-xs"> 
									<i class="mdi mdi-upload"></i>
									<span>Buscar Archivo...</span>
								</label>
							</div>
						</form>
					</div>
				</div>
			';

		$_msg_content["content"] .= '
				' . $form_content . '
				<strong>Egresos</strong>
				<div id="accordion1" class="panel-group accordion">
					' . $_accordion . '
				</div>
			';
		break;

	case 'registrar_pago':
		$_msg_control .= "Entro en la acción registrar_pago.\n";
		$id_pago = $_POST["id_pago"];

		// Se actualiza el registro del egreso 
		$array = array();
		$array["fecha_pago"] = $_POST["fecha_pago"];
		$array["valor_pago"] = (float)str_replace(",", ".", str_replace(".", "", $_POST["valor_pago"]));
		$array["estado"] = 1;
		$Data->updateRegistro("cmx_intr_egresos_pagos", $array, (int)$id_pago);

		// Se pregunta si se debe gestionar la actividad 
		$return["flag_gestion"] = $Internacional->validaGestionActividadPagoProveedor((int)$id_pago);

		// Se guarda el adjunto en el servidor
		if (isset($_FILES["pago_file"])) {
			// Se saca el nombre del archivo de la cotización 
			$file = $_FILES["pago_file"];
			$extension = $Internacional->get_extension_archivo($file["name"]);

			// Se guarda la url del archivo en la base de datos 
			$array = array();
			$array["url_pago"] = $id_pago . "." . $extension;
			$Data->updateRegistro("cmx_intr_egresos_pagos", $array, (int)$id_pago);

			// Se guarda el archivo de la cotización del sobrecosto
			if ($file["error"] == 0) {
				$tmp_file = $file["tmp_name"];
				$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
				if (move_uploaded_file($tmp_file, $archivo_temporal)) {

					// Se crean las carpetas de destino del archivo
					$carpeta_destino = "../public/files/internacional";
					if (!file_exists($carpeta_destino)) {
						mkdir($carpeta_destino, 0777, true);
						// print_r("Si se pudo crear la carpeta \n");
					}

					$carpeta_destino_1 = $carpeta_destino . "/pago_proveedores";
					if (!file_exists($carpeta_destino_1)) {
						mkdir($carpeta_destino_1, 0777, true);
						// print_r("Si se pudo crear la carpeta \n");
					}

					$destino = $carpeta_destino_1 . "/" . $id_pago . "." . $extension;

					if (copy($archivo_temporal, $destino)) {
						$return["copy_file_result"] = true;
					} else {
						$return["copy_file_result"] = false;
					}
				}
				if (file_exists($archivo_temporal)) {
					unlink($archivo_temporal);
				}
			} else {
				$return["copy_file_result"] = false;
			}
		}
		break;

	case 'form_registro_material':
		$_msg_control .= "Entro en la acción form_registro_material.\n";

		$id_proyecto = $_POST["id"];

		$arrayDestinos = $Internacional->getDestinosProyecto($id_proyecto);
		$return["destinos"] = $arrayDestinos;

		$general = $arrayDestinos["general"][0];
		$_msg_content["title"] = "Registrar Materiales - Proyecto (" . $general["numero_importacion"] . ")";

		/***** Encabezado del formulario *****/
		$_valor_declarado = '<span class="text-danger"><strong>No declarado</strong></span>';
		if ($general["valor_declarado"]) {
			$_valor_declarado = '
					<span>$' . number_format($general["valor_declarado"], 2, ',', '.') . '</span>
					<span class="cell-detail-description">' . $general["MONEDA"] . '</span>
				';
		}

		$encabezado = '
				<strong>Proyecto</strong>
				<table id="table1" class="table">
					<tbody>
						<tr role="row" class="odd">
							<td class="cell-detail sorting_1">
								<span>' . $general["tipo_operacion"] . '</span>
								<span class="cell-detail-description">' . $general["numero_importacion"] . '</span>
								<span class="cell-detail-description">' . $general["importacion"] . '</span>
							</td>
							<td class="cell-detail">
								<span>Cliente</span>
								<span class="cell-detail-description">' . $general["sigla"] . '</span>
								<span class="cell-detail-description">' . $general["DOCUMENTO_CLIENTE"] . '</span>
								<span class="cell-detail-description">' . $general["cod_cliente"] . '</span>
							</td>
							<td class="cell-detail">
								<span>Negociación</span>
								<span class="cell-detail-description">' . $general["incoterm"] . '</span>
								<span class="cell-detail-description">' . $general["tipo_transporte"] . '</span>
							</td>
							<td class="cell-detail">
								<span>Cant. Destinos</span>
								<span class="label label-default">' . $general["CANT_DESTINOS"] . '</span>
							</td>
							<td class="cell-detail text-right">
								<span>Valor Declarado</span>
								' . $_valor_declarado . '
							</td>
						</tr>
						<tr><td colspan="5"></td></tr>
					</tbody>
				</table>
			';
		/***** Fin - Encabezado del formulario *****/

		/***** Formulario de gestión de las activiadades *****/
		$_form_content = '';
		$_tramos = '';
		foreach ($arrayDestinos["ciudades_destino"] as $key => $value) {
			$panel_content = '<div id="accordion' . $value['id'] . '" class="panel-group accordion">';
			foreach ($arrayDestinos["destinos"][$value['id']] as $key_01 => $value_01) {
				$_tramos .= $value_01['ID_TRAMO'] . ',';
				$panel_content .= '
						<div class="panel panel-default">
							<div class="panel-heading">
								<h4 class="panel-title">
									<a data-toggle="collapse" data-parent="#accordion' . $value['id'] . '" href="#collapse_' . $value_01['ID_TRAMO'] . '" class="collapsed" aria-expanded="false">
										<i class="icon mdi mdi-chevron-down"></i> ' . $value_01["sigla"] . '
										<span class="panel-subtitle">' . $value_01["direccion"] . '</span>
									</a>
								</h4>
							</div>
							<div id="collapse_' . $value_01['ID_TRAMO'] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
								<div class="panel-body">
									<input type="hidden" id="ciudad_destino_' . $value_01['ID_TRAMO'] . '" value="' . $value["municipio"] . ' (' . $value["depto"] . ' - ' . $value["pais"] . ')">
									<input type="hidden" id="destino_' . $value_01['ID_TRAMO'] . '" value="' . $value_01["sigla"] . '">
									<input type="hidden" class="tramos" name="id_tramo_' . $value_01['ID_TRAMO'] . '" id="id_tramo_' . $value_01['ID_TRAMO'] . '_1" value="' . $value_01['ID_TRAMO'] . '">
									<div class="form-group icon col-sm-12 div_registro_material_' . $value_01['ID_TRAMO'] . '">
										<button type="button" class="btn btn-space btn-success btn-small hint--top" data-hint="Agregar Material" id="btn_agrega_material_' . $value_01['ID_TRAMO'] . '"><span class="mdi mdi-plus"></span></button>
										<button type="button" class="btn btn-space btn-danger btn-small hint--top" data-hint="Quitar Material" id="btn_quita_material_' . $value_01['ID_TRAMO'] . '"><span class="mdi mdi-minus"></span></button>
									</div>
									<div class="registro_material_clon_' . $value_01['ID_TRAMO'] . '" id="form_registro_material_' . $value_01['ID_TRAMO'] . '_1">
										<div class="col-xs-12 col-sm-12 col-md-12" id="div_title_' . $value_01['ID_TRAMO'] . '_1">
											<div class="well well-sm">
												<h4 id="title_' . $value_01['ID_TRAMO'] . '_1">Material 1</h4>
											</div>
										</div>
										<div class="form-group col-xs-6 col-sm-3 col-md-3" id="div_delivery_' . $value_01['ID_TRAMO'] . '_1">
											<label class="control-label">Delivery:</label>
											<input type="text" name="delivery_' . $value_01['ID_TRAMO'] . '_1" id="delivery_' . $value_01['ID_TRAMO'] . '_1" class="form-control input-sm" placeholder="Delivery">
										</div>
										<div class="form-group col-xs-6 col-sm-3 col-md-3" id="div_shipment_' . $value_01['ID_TRAMO'] . '_1">
											<label class="control-label">Shipment:</label>
											<input type="text" name="shipment_' . $value_01['ID_TRAMO'] . '_1" id="shipment_' . $value_01['ID_TRAMO'] . '_1" class="form-control input-sm" placeholder="Shipment">
										</div>
										<div class="row"></div>
										<div class="form-group col-xs-12 col-sm-4 col-md-4" id="div_material_' . $value_01['ID_TRAMO'] . '_1">
											<label class="control-label">(*) Material:</label>
											<input type="text" name="material_' . $value_01['ID_TRAMO'] . '_1" id="material_' . $value_01['ID_TRAMO'] . '_1" class="form-control input-sm" placeholder="Material">
										</div>
										<div class="form-group col-xs-12 col-sm-3 col-md-3" id="div_posicion_arancelaria_' . $value_01['ID_TRAMO'] . '_1">
											<label class="control-label">Posición Arancelaria:</label>
											<input type="text" name="posicion_arancelaria_' . $value_01['ID_TRAMO'] . '_1" id="posicion_arancelaria_' . $value_01['ID_TRAMO'] . '_1" class="form-control input-sm" placeholder="Posición Arancelaria">
										</div>
										<div class="form-group col-xs-4 col-sm-2 col-md-2" id="div_cantidad_piezas_' . $value_01['ID_TRAMO'] . '_1">
											<label class="control-label">(*) # Piezas:</label>
											<input type="number" name="cantidad_piezas_' . $value_01['ID_TRAMO'] . '_1" id="cantidad_piezas_' . $value_01['ID_TRAMO'] . '_1" class="form-control input-sm" min="1" value="1">
										</div>
										<div class="form-group col-xs-8 col-sm-3 col-md-3" id="div_empaque_' . $value_01['ID_TRAMO'] . '_1">
											<label class="control-label">(*) Empaque:</label>
											' . $Internacional->getHtmlSelectEmpaques("empaque_" . $value_01['ID_TRAMO'] . "_1", "", "") . '
										</div>
										<div class="form-group col-xs-12 col-sm-3 col-md-3" id="div_peso_' . $value_01['ID_TRAMO'] . '_1">
											<label class="control-label">(*) Peso Unitario (Kg):</label>
											<input type="text" name="peso_' . $value_01['ID_TRAMO'] . '_1" id="peso_' . $value_01['ID_TRAMO'] . '_1" class="form-control input-sm" placeholder="Peso Unitario (Kg)" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)" onload="getFormatoNumeroDecimal(this)">
										</div>
										<div class="form-group col-xs-4 col-sm-3 col-md-3" id="div_largo_' . $value_01['ID_TRAMO'] . '_1">
											<label class="control-label">(*) Largo Pieza (cm):</label>
											<input type="text" name="largo_' . $value_01['ID_TRAMO'] . '_1" id="largo_' . $value_01['ID_TRAMO'] . '_1" class="form-control input-sm" placeholder="Largo Pieza (cm)">
										</div>
										<div class="form-group col-xs-4 col-sm-3 col-md-3" id="div_alto_' . $value_01['ID_TRAMO'] . '_1">
											<label class="control-label">(*) Alto Pieza (cm):</label>
											<input type="text" name="alto_' . $value_01['ID_TRAMO'] . '_1" id="alto_' . $value_01['ID_TRAMO'] . '_1" class="form-control input-sm" placeholder="Alto Pieza (cm)">
										</div>
										<div class="form-group col-xs-4 col-sm-3 col-md-3" id="div_ancho_' . $value_01['ID_TRAMO'] . '_1">
											<label class="control-label">(*) Ancho Pieza (cm):</label>
											<input type="text" name="ancho_' . $value_01['ID_TRAMO'] . '_1" id="ancho_' . $value_01['ID_TRAMO'] . '_1" class="form-control input-sm" placeholder="Ancho Pieza (cm)">
										</div>
										<div class="form-group col-xs-6 col-sm-2 col-md-2" id="div_check_refrigerado_' . $value_01['ID_TRAMO'] . '_1">
											<div class="be-checkbox">
												<input type="checkbox" name="check_refrigerado_' . $value_01['ID_TRAMO'] . '_1" id="check_refrigerado_' . $value_01['ID_TRAMO'] . '_1">
												<label for="check_refrigerado_' . $value_01['ID_TRAMO'] . '_1" id="label_check_refrigerado_' . $value_01['ID_TRAMO'] . '_1">Refrigerado</label>
											</div>
										</div>
										<div class="form-group col-xs-6 col-sm-3 col-md-3" id="div_check_peligroso_' . $value_01['ID_TRAMO'] . '_1">
											<div class="be-checkbox">
												<input type="checkbox" class="check_peligroso" name="check_peligroso_' . $value_01['ID_TRAMO'] . '_1" id="check_peligroso_' . $value_01['ID_TRAMO'] . '_1">
												<label for="check_peligroso_' . $value_01['ID_TRAMO'] . '_1" id="label_check_peligroso_' . $value_01['ID_TRAMO'] . '_1">Material Peligroso</label>
											</div>
										</div>
										<div class="form-group col-xs-6 col-sm-2 col-md-2 peligroso_content peligroso_content_' . $value_01['ID_TRAMO'] . '_1" id="div_un_' . $value_01['ID_TRAMO'] . '_1">
											<label class="control-label">(*) Código UN:</label>
											<input type="text" name="un_' . $value_01['ID_TRAMO'] . '_1" id="un_' . $value_01['ID_TRAMO'] . '_1" class="form-control input-sm" placeholder="UN" maxlength="4">
										</div>
										<div class="form-group col-xs-6 col-sm-2 col-md-2 peligroso_content peligroso_content_' . $value_01['ID_TRAMO'] . '_1" id="div_riesgo_' . $value_01['ID_TRAMO'] . '_1">
											<label class="control-label">(*) Riesgo:</label>
											' . $Internacional->getHtmlSelectRiesgoMaterial("riesgo_" . $value_01['ID_TRAMO'] . "_1", "", "") . '
										</div>
										<div class="form-group col-xs-6 col-sm-3 col-md-3 peligroso_content peligroso_content_' . $value_01['ID_TRAMO'] . '_1" id="div_hoja_seguridad_file_' . $value_01['ID_TRAMO'] . '_1">
											<label class="control-label">(*) Hoja de Seguridad:</label><br>
											<input type="file" name="hoja_seguridad_file_' . $value_01['ID_TRAMO'] . '_1" id="hoja_seguridad_file_' . $value_01['ID_TRAMO'] . '_1" class="inputfile">
											<label for="hoja_seguridad_file_' . $value_01['ID_TRAMO'] . '_1"  id="label_hoja_seguridad_file_' . $value_01['ID_TRAMO'] . '_1" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
										</div>
										<div class="row"></div>
									</div>
									<div class="row"></div>
								</div>
							</div>
						</div>
					';
			}
			$panel_content .= '</div>';

			$_form_content .= '
					<div class="panel panel-default">
						<div class="panel-heading">
							<h4 class="panel-title">
								<a data-toggle="collapse" data-parent="#accordion1" href="#collapse_' . $value['id'] . '">
									<i class="icon mdi mdi-chevron-down"></i> ' . $value["municipio"] . ' <small>' . $value["depto"] . ' - ' . $value["pais"] . '</small>
									<span class="panel-subtitle">Destinos: <strong>' . $arrayDestinos["destinos"][$value['id']]["rowsNum"] . '</strong></span>
								</a>
							</h4>
						</div>
						<div id="collapse_' . $value['id'] . '" class="panel-collapse collapse">
							<div class="panel-body">
								' . $panel_content . ' 
							</div>
						</div>
					</div>
				';
		}

		$form_content = '
				<form id="form_registro_material">
					<div id="accordion1" class="panel-group accordion">
						<input type="hidden" name="id_proyecto" value="' . $id_proyecto . '">
						<input type="hidden" name="tramos" value="' . $_tramos . '">
						' . $_form_content . '
					</div>
				</form>
			';
		/***** Fin - Formulario de gestión de las activiadades *****/

		$_msg_content["content"] = $encabezado . $form_content;
		break;

	case 'registrar_materiales':
		$_msg_control .= "Entro en la acción registrar_materiales.\n";
		if (isset($_POST["tramos"])) {
			$arrayTramos = explode(",", $_POST["tramos"]);
			foreach ($arrayTramos as $value) {
				if ($value) {
					$_flag_gestiona = true;
					$i = 1;

					// $array = [];
					$array = [];
					$array["guia"] = "GUIA-" . $time;

					// Se actualiza el registro del egreso 
					$Data->updateRegistro("cmx_intr_tramos", $array, (int)$value);
					$time += $i;

					
					echo "ENTRO AQUI BIEN UPDATE " . $value . " ARRAY " . print_r($array);
					exit();

					do {
						if (isset($_POST["material_" . $value . "_" . $i])) {
							// Se crea el array para crear el material
							$array = [];
							$array["id_tramo"] = $_POST["id_tramo_" . $value];
							$array["material"] = $_POST["material_" . $value . "_" . $i];
							$array["cant_piezas"] = $_POST["cantidad_piezas_" . $value . "_" . $i];
							$array["id_empaque"] = $_POST["empaque_" . $value . "_" . $i];
							$array["peso"] = (float)str_replace(",", ".", str_replace(".", "", $_POST["peso_" . $value . "_" . $i]));
							$array["largo"] = $_POST["largo_" . $value . "_" . $i];
							$array["alto"] = $_POST["alto_" . $value . "_" . $i];
							$array["ancho"] = $_POST["ancho_" . $value . "_" . $i];
							if (isset($_POST["delivery_" . $value . "_" . $i]) and $_POST["delivery_" . $value . "_" . $i]) {
								$array["delivery"] = $_POST["delivery_" . $value . "_" . $i];
							}
							if (isset($_POST["shipment_" . $value . "_" . $i]) and $_POST["shipment_" . $value . "_" . $i]) {
								$array["shipment"] = $_POST["shipment_" . $value . "_" . $i];
							}
							if (isset($_POST["check_refrigerado_" . $value . "_" . $i])) {
								$array["refrigerado"] = 1;
							}

							$id_material = $Data->setRegistro("cmx_intr_tramo_materiales", $array);

							// Se verifica si el material es peligroso
							if (isset($_POST["check_peligroso_" . $value . "_" . $i])) {
								// Se guarda el adjunto en el servidor
								if (isset($_FILES["hoja_seguridad_file_" . $value . "_" . $i])) {
									// Se saca el nombre del archivo de la cotización 
									$file = $_FILES["hoja_seguridad_file_" . $value . "_" . $i];
									$extension = $Internacional->get_extension_archivo($file["name"]);

									$archivo = $value . "_" . $id_material . "." . $extension;

									// Se guarda la url del archivo en la base de datos 
									$array = array();
									$array["material_peligroso"] = 1;
									$array["un"] = $_POST["un_" . $value . "_" . $i];
									$array["id_riesgo"] = $_POST["riesgo_" . $value . "_" . $i];
									$array["url_hoja_seguridad"] = $archivo;
									$Data->updateRegistro("cmx_intr_tramo_materiales", $array, (int)$id_material);

									// Se guarda el archivo de la hoja de seguridad
									if ($file["error"] == 0) {
										$tmp_file = $file["tmp_name"];
										$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
										if (move_uploaded_file($tmp_file, $archivo_temporal)) {

											// Se crean las carpetas de destino del archivo
											$carpeta_destino = "../public/files/internacional";
											if (!file_exists($carpeta_destino)) {
												mkdir($carpeta_destino, 0777, true);
												// print_r("Si se pudo crear la carpeta \n");
											}

											$carpeta_destino_1 = $carpeta_destino . "/materiales";
											if (!file_exists($carpeta_destino_1)) {
												mkdir($carpeta_destino_1, 0777, true);
												// print_r("Si se pudo crear la carpeta \n");
											}

											$carpeta_destino_2 = $carpeta_destino_1 . "/" . $value;
											if (!file_exists($carpeta_destino_2)) {
												mkdir($carpeta_destino_2, 0777, true);
												// print_r("Si se pudo crear la carpeta \n");
											}

											$destino = $carpeta_destino_2 . "/" . $archivo;

											if (copy($archivo_temporal, $destino)) {
												$return["copy_file_result"] = true;
											} else {
												$return["copy_file_result"] = false;
											}
										}
										if (file_exists($archivo_temporal)) {
											unlink($archivo_temporal);
										}
									} else {
										$return["copy_file_result"] = false;
									}
								}
							}
						} else {
							$_flag_gestiona = false;
						}
						$i++;
					} while ($_flag_gestiona);
				}
			}
			// Se pregunta si se debe gestionar la actividad 
			$return["flag_gestion"][] = $Internacional->validaGestionActividadMateriales((int)$_POST["id_proyecto"]);
		} else {
			$_msg_error .= "<p>No hay tramos relacionados para registrar los materiales.</p>";
		}
		break;

	case 'form_registro_documentos':
		$_msg_control .= "Entro en la acción form_registro_documentos.\n";

		$id_proyecto = $_POST["id"];

		$arrayDocumentos = $Internacional->getDocumentosProyecto($id_proyecto);
		$return["documentos"] = $arrayDocumentos;

		$general = $arrayDocumentos["general"][0];
		// print_r($general);
		// break;
		$_msg_content["title"] = "Registrar Documentos - Proyecto (" . $general["numero_importacion"] . ")";

		/***** Encabezado del formulario *****/
		$_valor_declarado = '<span class="text-danger"><strong>No declarado</strong></span>';
		if ($general["valor_declarado"]) {
			$_valor_declarado = '
					<span>$' . number_format($general["valor_declarado"], 2, ',', '.') . '</span>
					<span class="cell-detail-description">' . $general["MONEDA"] . '</span>
				';
		}

		$encabezado = '
				<strong>Proyecto</strong>
				<table id="table1" class="table">
					<tbody>
						<tr role="row" class="odd">
							<td class="cell-detail sorting_1">
								<span>' . $general["tipo_operacion"] . '</span>
								<span class="cell-detail-description">' . $general["numero_importacion"] . '</span>
								<span class="cell-detail-description">' . $general["importacion"] . '</span>
							</td>
							<td class="cell-detail">
								<span>Cliente</span>
								<span class="cell-detail-description">' . $general["sigla"] . '</span>
								<span class="cell-detail-description">' . $general["DOCUMENTO_CLIENTE"] . '</span>
								<span class="cell-detail-description">' . $general["cod_cliente"] . '</span>
							</td>
							<td class="cell-detail">
								<span>Negociación</span>
								<span class="cell-detail-description">' . $general["incoterm"] . '</span>
								<span class="cell-detail-description">' . $general["tipo_transporte"] . '</span>
							</td>
							<td class="cell-detail">
								<span>Cant. Destinos</span>
								<span class="label label-default">' . $general["CANT_DESTINOS"] . '</span>
							</td>
							<td class="cell-detail text-right">
								<span>Valor Declarado</span>
								' . $_valor_declarado . '
							</td>
						</tr>
						<tr><td colspan="5"></td></tr>
					</tbody>
				</table>
			';
		/***** Fin - Encabezado del formulario *****/

		/***** Formulario de edición de materiales *****/
		$resumen_guias = "";
		$guias = "";
		$materiales = $arrayDocumentos["materiales"];
		if ($materiales) {
			$materiales = formMaterialProyecto($materiales);
			$guias = $materiales;
		}
		/***** Fin - Formulario de edición de materiales *****/

		/***** Formulario de edición de documentos *****/
		$documentos_content = '';
		$_arrayDocumentos = $arrayDocumentos["documentos"];
		foreach ($arrayDocumentos["tipo_documentos"] as $key => $value) {
			$_panel_color = 'default';
			$_fecha_gestion =  '';
			if ($value["flag_fecha"] == 1) {
				$_fecha_gestion = '
						<div class="col-xs-12 col-sm-4 col-md-3">
							<label class="control-label">Fecha Gestión:</label>
							<div data-min-view="2" data-start-view="4" data-date="" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker">
								<input size="16" type="text" value="" id="fecha_gestion_' . $value['id'] . '" name="fecha_gestion_' . $value['id'] . '" class="form-control input-sm fecha_gestion" readonly="”readonly”"><span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
							</div>
						</div>
					';
			}

			$_panel_content = '
					<input type="hidden" id="documento_' . $value['id'] . '" value="' . $value["nombre"] . '">
					' . $_fecha_gestion . '
					<label class="control-label">Documento Adjunto:</label><br>
					<input type="file" name="documento_file_' . $value['id'] . '" id="documento_file_' . $value['id'] . '" class="inputfile file_documento">
					<label for="documento_file_' . $value['id'] . '" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
					<div class="be-checkbox">
						<input name="soporte_' . $value['id'] . '" id="soporte_' . $value['id'] . '" type="checkbox">
						<label for="soporte_' . $value['id'] . '">Soporte Facturación</label>
					</div>
				';

			$_soporte_facturacion = '';
			if (isset($_arrayDocumentos[$value['id']])) {
				$documento_envio = $_arrayDocumentos[$value['id']];
				$_panel_color = 'success';

				// Se verifica si el documento es soporte de factuarción 
				if ($documento_envio["soporte_facturacion"]) {
					$_soporte_facturacion = '<strong class="text-muted">Soporte facturación</strong>';
				}

				// Se pregunta si tiene fecha de gestion del documento 
				$_fecha_gestion = '';
				if ($documento_envio["fecha_gestion"]) {
					$_fecha_gestion = '<br><span class="cell-detail-description">Fecha Gestión: <strong>' . $documento_envio["fecha_gestion"] . '</strong></span>';
				}

				$_panel_content = '
						<div class="icon-container">
							<a href="' . BASE_URL . 'public/files/internacional/documentos/' . $id_proyecto . '/' . $documento_envio["url"] . '" target="_blank" class="icon hint--top" data-hint="Descargar">
								<span class="mdi mdi-download"></span>
							</a>
						</div>
						<span>' . date('Y-m-d', strtotime($documento_envio["FECHA"])) . '</span>
						<span class="cell-detail-description">' . date('H:i:s', strtotime($documento_envio["FECHA"])) . '</span>
						' . $_fecha_gestion . '
					';
			}

			// Se crea el contenido de la pestaña del acordeón
			$documentos_content .= '
					<div class="panel panel-default panel-border-color panel-border-color-' . $_panel_color . '">
						<div class="panel-heading">
							<h4 class="panel-title">
								<a data-toggle="collapse" data-parent="#accordion_form_documentos" href="#collapse_documentos_' . $value['id'] . '" class="collapsed" aria-expanded="false">
									<i class="icon mdi mdi-chevron-down"></i> ' . $value["nombre"] . '
									<span class="panel-subtitle">' . $_soporte_facturacion . '</span>
									<span class="panel-subtitle">' . $value["descripcion"] . '</span>
								</a>
							</h4>
						</div>
						<div id="collapse_documentos_' . $value['id'] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
							<div class="panel-body">
								<div class="col-xs-12 col-sm-12 col-md-12 text-center form_content">
									' . $_panel_content . '
								</div>
							</div>
						</div>
					</div>
				';
		}

		// Se crea el contenido del acordeón
		$documentos = '
				<div class="panel panel-border panel-contrast">
					<div class="panel-heading panel-heading-contrast">
						Documentos
						<div class="tools"></div>
						<span class="panel-subtitle"></span>
					</div>
					<div class="panel-body">
						<div id="accordion_form_documentos" class="panel-group accordion">
							' . $documentos_content . '
						</div>
					</div>
				</div>
			';
		/***** Fin - Formulario de edición de documentos *****/

		$_msg_content["content"] = '
				' . $encabezado . '
				<form id="form_registro_documentos">
					<input type="hidden" id="id_proyecto" name="id_proyecto" value="' . $id_proyecto . '">
					<input type="hidden" id="id_materiales" name="id_materiales">
					<input type="hidden" id="id_documentos" name="id_documentos">
					' .  $guias . $documentos . '
				</form>
				';
		break;

	case 'registrar_documentos':
		$_msg_control .= "Entro en la acción registrar_documentos.\n";

		/***** SE GUARDA LA INFORMACIÓN DE LOS MATERIALES *****/
		$arrayMateriales = explode(",", $_POST["id_materiales"]);

		foreach ($arrayMateriales as $value) {
			if ($value) {
				$file = $_FILES["hoja_seguridad_file_" . $value];
				$extension = $Internacional->get_extension_archivo($file["name"]);
				$archivo = $_POST["tramo_" . $value] . "_" . $value . "." . $extension;

				$array = array();
				$array["material_peligroso"] = 1;
				$array["un"] = $_POST["un_" . $value];
				$array["id_riesgo"] = (int)$_POST["riesgo_" . $value];
				$array["url_hoja_seguridad"] = $archivo;
				$result = $Data->updateRegistro("cmx_intr_tramo_materiales", $array, (int)$value);

				// Se guarda el archivo de la hoja de seguridad
				if ($file["error"] == 0 and $result == 1) {
					$tmp_file = $file["tmp_name"];
					$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
					if (move_uploaded_file($tmp_file, $archivo_temporal)) {

						// Se crean las carpetas de destino del archivo
						$carpeta_destino = "../public/files/internacional/materiales/" . $_POST["tramo_" . $value];
						if (!file_exists($carpeta_destino)) {
							mkdir($carpeta_destino, 0777, true);
							// print_r("Si se pudo crear la carpeta \n");
						}

						$destino = $carpeta_destino . "/" . $archivo;

						if (copy($archivo_temporal, $destino)) {
							$return["copy_file_result"] = true;
						} else {
							$return["copy_file_result"] = false;
						}
					}
					if (file_exists($archivo_temporal)) {
						unlink($archivo_temporal);
					}
				} else {
					$return["copy_file_result"] = false;
				}
			}
		}
		/***** FIN - SE GUARDA LA INFORMACIÓN DE LOS MATERIALES *****/

		/***** SE GUARDA LA INFORMACIÓN DE LOS DOCUMENTOS *****/
		$id_intr_proyecto = $_POST["id_proyecto"];
		$arrayDocumentos = explode(",", $_POST["id_documentos"]);

		foreach ($arrayDocumentos as $value) {
			if ($value) {
				// Se guarda el registro en la base de datos
				$array = array();
				$array["id_intr_proyecto"] = $id_intr_proyecto;
				$array["id_tipo_documento"] = $value;
				if (isset($_POST["soporte_" . $value])) {
					$array["soporte_facturacion"] = 1;
				}
				if (isset($_POST["fecha_gestion_" . $value]) and $_POST["fecha_gestion_" . $value]) {
					$array["fecha_gestion"] = $_POST["fecha_gestion_" . $value];
				}
				$id_documento = $Data->setRegistro("cmx_intr_solicitud_documentos", $array);

				$file = $_FILES["documento_file_" . $value];
				$extension = $Internacional->get_extension_archivo($file["name"]);
				$archivo = $id_intr_proyecto . "_" . $id_documento . "." . $extension;

				// Se guarda el nombre del archivo en la base de datos 
				$array = array();
				$array["url"] = $archivo;
				$array["fecha"] = date("Y-m-d H:i:s", time());
				$result = $Data->updateRegistro("cmx_intr_solicitud_documentos", $array, (int)$id_documento);

				// Se guarda el archivo del documento en el servidor
				if ($file["error"] == 0 and $result == 1) {
					$tmp_file = $file["tmp_name"];
					$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
					if (move_uploaded_file($tmp_file, $archivo_temporal)) {

						// Se crean las carpetas de destino del archivo
						$carpeta_destino = "../public/files/internacional/documentos/" . $id_intr_proyecto;
						if (!file_exists($carpeta_destino)) {
							mkdir($carpeta_destino, 0777, true);
							// print_r("Si se pudo crear la carpeta \n");
						}

						$destino = $carpeta_destino . "/" . $archivo;

						if (copy($archivo_temporal, $destino)) {
							$return["copy_file_result"] = true;
						} else {
							$return["copy_file_result"] = false;
						}
					}
					if (file_exists($archivo_temporal)) {
						unlink($archivo_temporal);
					}
				} else {
					$return["copy_file_result"] = false;
				}
			}
		}
		/***** FIN - SE GUARDA LA INFORMACIÓN DE LOS DOCUMENTOS *****/

		break;

	case 'form_gestiona_actividad_documentos':
		$_msg_control .= "Entro en la acción form_gestiona_actividad_documentos.\n";

		// Se busca la información de la cotización 
		$documentos = $Internacional->getDocumentosProyecto($_POST["id"]);
		$_array_result = $documentos;

		$general = $documentos["general"][0];

		$_msg_content = '
				<form id="form_gestiona_actividad">
					<div class="text-warning"><span class="modal-main-icon mdi mdi-alert-triangle"></span></div>
					<h3>¡Atención!</h3>
					<h4>¿Realmente desea terminar de subir los documentos y editar los materiales del <strong>' . $general["do"] . '</strong>?</h4>
					<div class="xs-mt-50">
						<button type="button" data-dismiss="modal" class="btn btn-space btn-default">Cancelar</button>
						<button id="btn_gestiona_actividad" type="button" class="btn btn-space btn-success">Gestionar</button>
					</div>
				</form>
			';

		// Se pregunta si se debe gestionar la actividad cuando es de una factura por cotización
		$array = array();
		$array["id"] = $general["ID_ACTIVIDAD"] . ",";
		$array["orden"] = $general["orden"];
		$array["fecha_hora_inicio"] = $general["fecha_hora_inicio"];
		$array["id_importacion"] = $general["id_importacion"];
		$array["bloque"] = $general["bloque"];
		$array["grupo"] = $general["grupo"];
		$array["simultaneo"] = $general["simultaneo"];
		$array["tipo_actividad"] = $general["tipo_actividad"];
		$array["costo_real"] = $general["costo_real"];
		$array["respuesta"] = $general["respuesta"];
		$return["actividad"] = $array;
		break;

	case 'form_instruccion_factura':
		$_msg_control .= "Entro en la acción form_instruccion_factura.\n";

		$instruccion = $Internacional->getDatosClienteInstruccion($_POST["id"]);
		$_array_result = $instruccion;

		// Contenido de la información del cliente
		// $cliente = $instruccion["cliente"]["rowsData"][0];
		$cliente = $instruccion["cliente"];
		$_info_cliente = datosClienteEncabezado($cliente);

		$_msg_content["title"] = 'Generar Instrucción de Factura - ' . $cliente["sigla"];

		// Contenido del acordeón de los proyectos a facturar
		$_accordion_content = '';
		if ($instruccion["proyectos"]) {
			foreach ($instruccion["proyectos"] as $key => $value) {
				$_flag_valor_pesos = false;

				// Se filtra el valor en pesos de la oferta 
				$_valor_pesos = '';
				if ($value["ID_MONEDA_OFERTA"] != 2) {
					$_valor_pesos = ' | Valor en COP: <strong class="text-danger">Sin TRM</strong> ';
					if ($value["VALOR_PESOS_FACTURA"]) {
						$_flag_valor_pesos = true;
						$_valor_pesos = ' | Valor en COP: <strong>' . number_format($value["VALOR_PESOS_FACTURA"], 2, ',', '.') . '</strong> ';
					}
				} else {
					$_flag_valor_pesos = true;
				}

				// Se feltra el valor en USD de la oferta 
				$_valor_usd = '';
				if ($value["ID_MONEDA_OFERTA"] != 1) {
					$_valor_usd = ' | Valor en USD: <strong class="text-danger">Sin TRM</strong> ';
					if ($value["VALOR_USD_FACTURA"]) {
						$_valor_usd = ' | Valor en USD: <strong>' . number_format($value["VALOR_USD_FACTURA"], 2, ',', '.') . '</strong> ';
					}
				}

				// Se genera el contenido de la información del proyecto
				$_tipo_transporte = "";
				if ($value["tipo_transporte"]) {
					$_tipo_transporte = '(' . $value["tipo_transporte"] . ')';
				}
				// Se genera el listado los tramos del proyecto 
				$_tramos = '';
				if ($instruccion["tramos"][$value["ID_PROYECTO_INTERNACIONAL"]]) {
					$arrayTramos = $instruccion["tramos"][$value["ID_PROYECTO_INTERNACIONAL"]]["tramos"];

					if ($arrayTramos) {
						$_lista_origenes = '<span>Origen:</span>';
						$_lista_destinos = '<span>Destino:</span>';
						foreach ($arrayTramos as $key_tramos => $value_tramos) {
							switch ($value_tramos["tipo_tramo"]) {
								case 'Cargue':
									$_lista_origenes .= '
											<span class="cell-detail-description"><strong>' . $value_tramos["sigla"] . '</strong></span>
											<span class="cell-detail-description">' . $value_tramos["CIUDAD"] . '</span>
										';
									break;

								case 'Descargue':
									$_lista_destinos .= '
											<span class="cell-detail-description"><strong>' . $value_tramos["sigla"] . '</strong></span>
											<span class="cell-detail-description">' . $value_tramos["CIUDAD"] . '</span>
										';
									break;
							}
						}
					}

					$_tramos = '
							<div class="col-xs-12 col-sm-6 col-md-6">
								' . $_lista_origenes . '
							</div>
							<div class="col-xs-12 col-sm-6 col-md-6">
								' . $_lista_destinos . '
							</div>
						';
				}

				$_info_proyecto = '
						<span><strong>Información del Proyecto</strong></span>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="form-group col-xs-12 col-sm-4 col-md-4">
											<span># Proyecto: <small><strong>' . $value["numero_importacion"] . '</strong></small></span>
											<span class="cell-detail-description">' . $value["importacion"] . '</span>
											<span class="cell-detail-description">' . date('Y-m-d', $value["numero_importacion"]) . '</span>
										</div>
										<div class="form-group col-xs-12 col-sm-4 col-md-4">
											<span>Tipo de Operación:</span>
											<span class="cell-detail-description">' . $value["tipo_operacion"] . ' ' . $_tipo_transporte . '</span>
											<span class="cell-detail-description">' . $value["incoterm"] . '</span>
										</div>
										<div class="form-group col-xs-12 col-sm-4 col-md-4">
											<span>Tipo de Carga:</span>
											<span class="cell-detail-description">' . $value["TIPO_CARGA"] . '</span>
											<span class="cell-detail-description">' . $value["contenedor"] . '</span>
										</div>
										' . $_tramos . '
									</td>
								</tr>
								<tr><td></td></tr>
							</tbody>
						</table>
					';

				// Se valida si se puede generar la instruccion de factura
				$_flag_habilita_check_proyecto = false;
				$_flag_habilita_check_impuestos = false;
				$_form_content = '
						<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
							<div class="icon">
								<span class="mdi mdi-close"></span>
							</div>
							<div class="message">
								<strong>Atención!</strong>
								<p>No se ha registrado TRM de la moneda para pasarla a pesos...</p>
							</div>
						</div>
					';
				$_flag_form_content = "";
				if ($_flag_valor_pesos) {
					$_flag_form_content = "form_content";
					$_flag_habilita_check_proyecto = true;

					// Se pinta la asignación de agendamiento 
					$_check_agenciamiento = '
							<div class="be-checkbox %visible%">
								<input name="agenciamiento_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" class="check_agenciamiento" id="check_agenciamiento_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" type="checkbox">
								<label for="check_agenciamiento_' . $value["ID_PROYECTO_INTERNACIONAL"] . '">Agenciamiento</label>
							</div>
							<input type="hidden" class="valor_pesos_fijo" value="' . (float)$value["VALOR_PESOS_FACTURA"] . '">
							<input type="hidden" class="valor_pesos" name="valor_pesos_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" value="' . (float)$value["VALOR_PESOS_FACTURA"] . '">
							<input type="hidden" class="valor_agenciamiento" name="valor_agenciamiento_' . $value["ID_PROYECTO_INTERNACIONAL"] . '">
							<input type="hidden" class="datos_actividad" data-id_actividad="' . $value["ID_ACTIVIDAD"] . '" data-orden="' . $value["orden"] . '" data-fecha_hora_inicio="' . $value["fecha_hora_inicio"] . '" data-id_importacion="' . $value["id_importacion"] . '" data-bloque="' . $value["bloque"] . '" data-grupo="' . $value["grupo"] . '" data-simultaneo="' . $value["simultaneo"] . '" data-tipo_actividad="' . $value["tipo_actividad"] . '" data-costo_real="' . $value["costo_real"] . '" data-respuesta="' . $value["respuesta"] . '">
						';

					// Se pinta el acordeón de documentos de envío
					$_proyecto_accordion = '
							<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
								<div class="icon">
									<span class="mdi mdi-alert-triangle"></span>
								</div>
								<div class="message">
									<strong>Atención!</strong>
									<p>No hay más información registrada para este proyecto...</p>
								</div>
							</div>
						';

					/***** ACORDEÓN DE DOCUMENTOS *****/
					$_flag_documentos = false;
					$_documentos_accordion = '';
					if ($instruccion["documentos_envio"][$value["ID_PROYECTO_INTERNACIONAL"]]) {
						$_flag_documentos = true;
						$_tabla_documentos = '
								<table id="table1" class="table table-striped table-hover table-fw-widget" data-page-length="50">
									<thead>
										<tr>
											<th>Soporte<br />Facturación</th>
											<th>Documento Envío</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
							';
						foreach ($instruccion["documentos_envio"][$value["ID_PROYECTO_INTERNACIONAL"]] as $key_01 => $value_01) {
							$_check_seleccionado = '';
							if ($value_01["soporte_facturacion"]) {
								$_check_seleccionado = 'checked';
							}
							$_tabla_documentos .= '
									<tr>
										<td>
											<div class="be-checkbox">
												<center>
													<input class="check_documento" value="' . $value_01['id'] . '" id="check_documento_' . $value_01['id'] . '" type="checkbox" onclick="cambiaEntregableDocumento(this)" ' . $_check_seleccionado . '>
													<label for="check_documento_' . $value_01['id'] . '"></label>
												</center>
											</div>
										</td>
										<td class="cell-detail">
											<span>' . $value_01["nombre"] . '</span>
											<span class="cell-detail-description">' . $value_01["descripcion"] . '</span>
										</td>
										<td class="actions">
											<a href="' . BASE_URL . 'public/files/internacional/documentos/' . $value_01["id_intr_proyecto"] . '/' . $value_01["url"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar documento de envío"><span class="icon mdi mdi-edit"></span></a>
										</td>
									</tr>
								';
						}
						$_tabla_documentos .= '
									</tbody>
								</table>
							';

						$_documentos_accordion = '
								<div class="panel panel-default panel-border-color panel-border-color-default documentos">
									<div class="panel-heading">
										<div class="tools"></div>
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#accordion_instruccion_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" href="#accordion_documentos_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" class="collapsed" aria-expanded="false">
												<i class="icon mdi mdi-chevron-down"></i> Documentos para soporte de facturación
												<span class="panel-subtitle">Seleccione los documentos a ser adjuntados en la factura del cliente.</span>
											</a>
										</h4>
									</div>
									<div id="accordion_documentos_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
										<div class="panel-body">
											<div class="col-xs-1 col-sm-1 col-md-2"></div>
											<div class="col-xs-12 col-sm-12 col-md-8">
												' . $_tabla_documentos . '
											</div>
											<div class="col-xs-1 col-sm-1 col-md-2"></div>
										</div>
									</div>
								</div>
							';
					}
					/***** FIN - ACORDEÓN DE DOCUMENTOS *****/

					/***** ACORDEÓN DE IMPUESTOS *****/
					$_impuestos_accordion = '';
					$_flag_impuestos = false;
					$_flag_habilita_check_impuestos = true;
					if (isset($instruccion["impuestos"][$value["ID_PROYECTO_INTERNACIONAL"]])) {
						$_flag_impuestos = true;

						$_tabla_impuestos = '
								<table id="table1" class="table table-striped table-hover table-fw-widget" data-page-length="50">
									<thead>
										<tr>
											<th>Impuesto</th>
											<th>Fecha</th>
											<th>Valor</th>
											<th>Valor en COP</th>
											<th>Valor en USD</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
							';

						$_flag_habilita_check_impuestos = true;
						$arraySumaImpuestos = array();
						$_id_cotizacion_impuestos = "";
						foreach ($instruccion["impuestos"][$value["ID_PROYECTO_INTERNACIONAL"]] as $key_01 => $value_01) {
							$_id_cotizacion_impuestos .= $value_01["ID_COTIZACION"] . ",";
							// Se filtra el valor en pesos del impuesto
							$_valor_impuesto_pesos = '<sapn><strong class="text-danger">Sin TRM</strong></sapn>';
							if ($value_01["VALOR_PESOS_FACTURA"]) {
								$_valor_impuesto_pesos = '
										<span>' . number_format($value_01["VALOR_PESOS_FACTURA"], 2, ',', '.') . '</span>
										<input type="hidden" class="datos_impuesto" data-descripcion="' . $value_01["nombre"] . ' - ' . $value_01["descripcion"] . '" data-valor_pesos="' . $value_01["VALOR_PESOS_FACTURA"] . '" value="' . (float)$value_01['id'] . '">
										<input type="hidden" class="valor_impuesto" name="valor_impuesto_' . $value["ID_PROYECTO_INTERNACIONAL"] . '_' . $value_01['id'] . '" value="' . (float)$value_01["valor"] . '">
										<input type="hidden" class="valor_impuesto_pesos" name="valor_impuesto_pesos_' . $value["ID_PROYECTO_INTERNACIONAL"] . '_' . $value_01["ID_COTIZACION"] . '" value="' . (float)$value_01["VALOR_PESOS_FACTURA"] . '">
										<input type="hidden" class="id_moneda_impuesto" name="id_moneda_impuesto_' . $value["ID_PROYECTO_INTERNACIONAL"] . '_' . $value_01['id'] . '" value="' . (float)$value_01["id_moneda"] . '"
										>
										<input type="hidden" class="moneda_impuesto" name="moneda_impuesto_' . $value["ID_PROYECTO_INTERNACIONAL"] . '_' . $value_01['id'] . '" value="' . $value_01["MONEDA"] . '" data-id_moneda_impuesto="' . (float)$value_01["id_moneda"] . '" data-valor_impuesto="' . (float)$value_01["valor"] . '" data-valor_impuesto_pesos="' . (float)$value_01["VALOR_PESOS_FACTURA"] . '">
									';
							} else {
								$_flag_habilita_check_impuestos = false;
							}

							// Se filtra el valor en USD del impuesto
							$_valor_impuesto_usd = '<sapn><strong class="text-danger">Sin TRM</strong></sapn>';
							if ($value_01["VALOR_USD_FACTURA"]) {
								$_valor_impuesto_usd = '
										<span>' . number_format($value_01["VALOR_USD_FACTURA"], 2, ',', '.') . '</span>
										<input type="hidden" name="valor_impuesto_usd_' . $value["ID_PROYECTO_INTERNACIONAL"] . '_' . $value_01['id'] . '" value="' . (float)$value_01["VALOR_USD_FACTURA"] . '">
									';
							}

							// Se suma los impuestos por moneda de pago de éste
							if (isset($arraySumaImpuestos[$value_01["id_moneda"]])) {
								$arraySumaImpuestos[$value_01["id_moneda"]]["valor"] += $value_01["valor"];
							} else {
								$arraySumaImpuestos[$value_01["id_moneda"]]["valor"] = $value_01["valor"];
								$arraySumaImpuestos[$value_01["id_moneda"]]["moneda"] = $value_01["MONEDA"];
							}

							$_tabla_impuestos .= '
									<tr>
										<td class="cell-detail">
											<span>' . $value_01["nombre"] . '</span>
											<span class="cell-detail-description">' . $value_01["descripcion"] . '</span>
											<span class="cell-detail-description"><strong>' . $value_01["proveedor"] . '</strong></span>
										</td>
										<td class="cell-detail">
											<span>' . $value_01["fecha_factura"] . '</span>
										</td>
										<td class="cell-detail text-right">
											<span>' . number_format($value_01["valor"], 2, ',', '.') . '</span>
											<span class="cell-detail-description">' . $value_01["MONEDA"] . '</span>
										</td>
										<td class="cell-detail text-right">
											' . $_valor_impuesto_pesos . '
										</td>
										<td class="cell-detail text-right">
											' . $_valor_impuesto_usd . '
										</td>
										<td class="actions">
											<a href="' . BASE_URL . 'public/files/internacional/facturas/' . $value_01["id_intr_proyecto"] . '/' . $value_01["id_proveedor"] . '/' . $value_01["url"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar Impuesto"><span class="icon mdi mdi-download"></span></a>
										</td>
									</tr>
								';
						}
						$_tabla_impuestos .= '
									</tbody>
								</table>
							';

						// Se valida si el proyecto tiene impuestos y se muestran
						$_suma_impuestos = '';
						if (isset($arraySumaImpuestos)) {
							foreach ($arraySumaImpuestos as $key_01 => $value_01) {
								$_suma_impuestos .= '<input type="hidden" class="suma_impuestos" value="' . $value_01["valor"] . '" data-monEda="' . $value_01["moneda"] . '">';
							}
						}

						$_impuestos_accordion = '
								<div class="panel panel-default panel-border-color panel-border-color-default impuestos">
									<div class="panel-heading">
										<div class="tools"></div>
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#accordion_instruccion_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" href="#accordion_impuestos_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" class="collapsed" aria-expanded="false">
												<i class="icon mdi mdi-chevron-down"></i> Impuestos
												<span class="panel-subtitle">Lista de impuestos generados en el poryecto</span>
											</a>
										</h4>
									</div>
									<div id="accordion_impuestos_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
										<div class="panel-body">
											<div class="col-xs-12 col-sm-12 col-md-12">
												<input type="hidden" name="id_impuestos_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" value="' . $_id_cotizacion_impuestos . '">
												' . $_suma_impuestos . '
												' . $_tabla_impuestos . '
											</div>
										</div>
									</div>
								</div>
							';
					}
					/***** FIN - ACORDEÓN DE IMPUESTOS *****/

					/***** ACORDEÓN DE CONCEPTOS A MOSTRAR *****/
					$_conceptos_accordion = '';
					$_flag_conceptos = false;

					if (isset($instruccion["conceptos"][$value["ID_PROYECTO_INTERNACIONAL"]][1])) {
						$_flag_conceptos = true;

						$_tabla_conceptos = '
								<table id="table1" class="table table-striped table-hover table-fw-widget" data-page-length="50">
									<thead>
										<tr>
											<th>Mostrar en <br />Detalles</th>
											<th>Concepto</th>
										</tr>
									</thead>
									<tbody>
							';
						foreach ($instruccion["conceptos"][$value["ID_PROYECTO_INTERNACIONAL"]][1] as $key_01 => $value_01) {
							$_check_seleccionado = '';
							if ($value_01["fct_muestra_concepto"]) {
								$_check_seleccionado = 'checked';
							}
							$_tabla_conceptos .= '
									<tr>
										<td>
											<div class="be-checkbox">
												<center>
													<input class="check_concepto" data-concepto="' . $value_01["nombre"] . '" value="' . $value_01['id'] . '" id="check_concepto_' . $value_01['id'] . '" type="checkbox" onclick="cambiaVistaConcepto(this)" ' . $_check_seleccionado . '>
													<label for="check_concepto_' . $value_01['id'] . '"></label>
												</center>
											</div>
										</td>
										<td class="cell-detail">
											<span>' . $value_01["nombre"] . '</span>
										</td>
									</tr>
								';
						}
						$_tabla_conceptos .= '
									</tbody>
								</table>
							';

						$_conceptos_accordion = '
								<div class="panel panel-default panel-border-color panel-border-color-default conceptos">
									<div class="panel-heading">
										<div class="tools"></div>
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#accordion_instruccion_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" href="#accordion_conceptos_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" class="collapsed" aria-expanded="false">
												<i class="icon mdi mdi-chevron-down"></i> Conceptos
												<span class="panel-subtitle">Seleccione los conceptos a mostrar en la factura del cliente.</span>
											</a>
										</h4>
									</div>
									<div id="accordion_conceptos_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
										<div class="panel-body">
											<div class="col-xs-1 col-sm-1 col-md-2"></div>
											<div class="col-xs-12 col-sm-12 col-md-8">
												' . $_tabla_conceptos . '
											</div>
											<div class="col-xs-1 col-sm-1 col-md-2"></div>
										</div>
									</div>
								</div>
							';
					}
					/***** FIN - ACORDEÓN DE CONCEPTOS A MOSTRAR *****/

					/***** ACORDEÓN DE SOBRECOSTOS *****/
					$_sobrecostos_accordion = '';
					if (isset($instruccion["sobrecostos"][$value["ID_PROYECTO_INTERNACIONAL"]])) {
						$_tabla_sobrecostos = '
								<table id="table1" class="table table-striped table-hover table-fw-widget" data-page-length="50">
									<thead>
										<tr>
											<th class="text-center">Concepto</th>
											<th class="text-center">Valor</th>
											<th class="text-center">Valor en COP</th>
											<th class="text-center">Valor en USD</th>
											<th class="text-center">Valor a Facturar (COP)</th>
											<th class="text-center"></th>
										</tr>
									</thead>
									<tbody>
							';
						$_total_sobrecostos = 0;
						$_id_sobrecostos = "";
						foreach ($instruccion["sobrecostos"][$value["ID_PROYECTO_INTERNACIONAL"]] as $key_01 => $value_01) {
							$_total_sobrecostos += (float)$value_01["VALOR_PESOS_FACTURA"];
							$_id_sobrecostos .= $value_01["ID_COTIZACION"] . ",";

							// Se filtra el valor en pesos del sobrecosto
							$_valor_sobrecosto_pesos = '<sapn><strong class="text-danger">Sin TRM</strong></sapn>';
							if ($value_01["VALOR_PESOS_FACTURA"]) {
								$_valor_sobrecosto_pesos = '
										<span>' . number_format($value_01["VALOR_PESOS_FACTURA"], 2, ',', '.') . '</span>
										<input type="hidden" class="valor_sobrecosto" name="valor_sobrecosto_' . $value["ID_PROYECTO_INTERNACIONAL"] . '_' . $value_01['id'] . '" value="' . (float)$value_01["valor"] . '">
										<input type="hidden" class="valor_sobrecosto_pesos" name="valor_sobrecosto_pesos_' . $value["ID_PROYECTO_INTERNACIONAL"] . '_' . $value_01['id'] . '" value="' . (float)$value_01["VALOR_PESOS_FACTURA"] . '">
										<input type="hidden" class="id_moneda_sobrecosto" name="id_moneda_sobrecosto_' . $value["ID_PROYECTO_INTERNACIONAL"] . '_' . $value_01['id'] . '" value="' . (float)$value_01["id_moneda"] . '">
										<input type="hidden" class="moneda_sobrecosto" name="moneda_sobrecosto_' . $value["ID_PROYECTO_INTERNACIONAL"] . '_' . $value_01['id'] . '" value="' . $value_01["MONEDA"] . '">
									';
							}

							// Se filtra el valor en USD del sobrecosto
							$_valor_sobrecosto_usd = '<sapn><strong class="text-danger">Sin TRM</strong></sapn>';
							if ($value_01["VALOR_USD_FACTURA"]) {
								$_valor_sobrecosto_usd = '
										<span>' . number_format($value_01["VALOR_USD_FACTURA"], 2, ',', '.') . '</span>
										<input type="hidden" name="valor_sobrecosto_usd_' . $value["ID_PROYECTO_INTERNACIONAL"] . '_' . $value_01['id'] . '" value="' . (float)$value_01["VALOR_USD_FACTURA"] . '">
									';
							}

							$_tabla_sobrecostos .= '
									<tr>
										<td class="cell-detail">
											<span>' . $value_01["nombre"] . '</span>
											<span class="cell-detail-description">' . $value_01["descripcion"] . '</span>
											<span class="cell-detail-description"><strong>' . $value_01["proveedor"] . '</strong></span>
										</td>
										<td class="cell-detail text-right">
											<span>' . number_format($value_01["valor"], 2, ',', '.') . '</span>
											<span class="cell-detail-description">' . $value_01["MONEDA"] . '</span>
										</td>
										<td class="cell-detail text-right">
											' . $_valor_sobrecosto_pesos . '
										</td>
										<td class="cell-detail text-right">
											' . $_valor_sobrecosto_usd . '
										</td>
										<td class="cell-detail">
											<input type="text" class="form-control input-xs valor_facturar" name="valor_facturar_' . $value["ID_PROYECTO_INTERNACIONAL"] . '_' . $value_01["ID_COTIZACION"] . '" value="' . number_format($value_01["VALOR_PESOS_FACTURA"], 2, ',', '.') . '" onload="getFormatoNumeroDecimal(this)" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)" placeholder="Valor a Facturar" data-descripcion="' . $value_01["nombre"] . ' - ' . $value_01["descripcion"] . '" data-id="' . (float)$value_01['id'] . '">
										</td>
										<td class="actions">
											<a href="' . BASE_URL . 'public/files/internacional/facturas/' . $value_01["id_intr_proyecto"] . '/' . $value_01["id_proveedor"] . '/' . $value_01["url"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar Impuesto"><span class="icon mdi mdi-download"></span></a>
										</td>
									</tr>
								';
						}
						$_tabla_sobrecostos .= '
									</tbody>
								</table>
							';

						$_sobrecostos_accordion = '
								<div class="panel panel-default panel-border-color panel-border-color-default sobrecostos">
									<div class="panel-heading">
										<div class="tools"></div>
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#accordion_instruccion_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" href="#accordion_sobrecostos_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" class="collapsed" aria-expanded="false">
												<i class="icon mdi mdi-chevron-down"></i> Sobrecostos
												<span class="panel-subtitle">Se ajustan los sobrecostos del proyecto para ser cobrados al cliente.</span>
											</a>
										</h4>
									</div>
									<div id="accordion_sobrecostos_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
										<div class="panel-body">
											<div class="col-xs-12 col-sm-12 col-md-12">
												<input type="hidden" class="total_sobrecosto" name="total_sobrecosto_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" value="' . number_format($_total_sobrecostos, 0, "", "")  . '">
												<input type="hidden" name="id_sobercosto_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" value="' . $_id_sobrecostos  . '">
												' . $_tabla_sobrecostos . '
											</div>
										</div>
									</div>
								</div>
							';
					}
					/***** FIN - ACORDEÓN DE SOBRECOSTOS *****/

					/***** ACORDEÓN DE AJUSTE OFERTA COMERCIAL *****/
					$_ajuste_oferta_accordion = '';
					if ($_POST["id_perfil"] == 13 or $_POST["id_perfil"] == 1) {
						$_valor_oferta = '';
						$_valor_oferta_pesos = '';
						if ($value["ID_MONEDA_OFERTA"] != 2) {
							$_valor_oferta = '<span>' . number_format($value["VALOR_OFERTA"], 2, ',', '.') . ' ' . $value["MONEDA_OFERTA"] . '</span>';
						}
						$_ajuste_oferta_accordion = '
								<div class="panel panel-default panel-border-color panel-border-color-warning ajuste_oferta" data-valor_oferta="' . $value["VALOR_OFERTA"] . '" data-fecha_oferta="' . $value["FECHA_OFERTA"] . '" data-id_oferta="' . $value["ID_OFERTA"] . '">
									<div class="panel-heading">
										<div class="tools"></div>
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#accordion_instruccion_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" href="#accordion_ajuste_oferta_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" class="collapsed" aria-expanded="false">
												<i class="icon mdi mdi-chevron-down"></i> Verificación Oferta Comecial
												<span class="panel-subtitle"><strong>Por favor verifique los valores de la oferta comercial antes de generar la instrucción de factura.</strong></span>
											</a>
										</h4>
									</div>
									<div id="accordion_ajuste_oferta_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
										<div class="panel-body">
											<div class="col-xs-12 col-sm-12 col-md-12" id="tmp_muestra_ajuste"></div>
											<table class="table table-condensed table-borderless">
												<tbody>
													<tr>
														<td class="cell-detail">
															<strong>Valor Oferta Comercial</strong> 
															' . $_valor_oferta . '
															<span class="cell-detail-description">Valor en pesos: <strong>$' . number_format($value["VALOR_PESOS_FACTURA"], 2, ',', '.') . '</strong></span>
															<span class="cell-detail-description">' . $value["FECHA_OFERTA"] . '</span>
														</td>
														<td class="cell-detail">
															' . $Internacional->getHtmlSelectMonedas_sm("moneda", $value["ID_MONEDA_OFERTA"], "") . '  
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							';
					}
					/***** FIN - ACORDEÓN DE AJUSTE OFERTA COMERCIAL *****/

					if ($_flag_documentos or $_flag_impuestos or $_flag_conceptos) {
						$_proyecto_accordion = '
								<div id="accordion_instruccion_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" class="panel-group accordion">
									' . $_ajuste_oferta_accordion . '
									' . $_sobrecostos_accordion . '
									' . $_impuestos_accordion . '
									' . $_documentos_accordion . '
									' . $_conceptos_accordion . '
								</div>
							';
					}

					// Se filtra si se debe mostrar el check de agenciamiento para el caso de que no tenga TRM algún impuesto
					$_flag_agenciamiento_visible = '';
					if (!$_flag_habilita_check_impuestos) {
						$_flag_agenciamiento_visible = 'agenciamiento_visible';
					}
					$_check_agenciamiento = str_replace("%visible%", $_flag_agenciamiento_visible, $_check_agenciamiento);

					$_form_content = $_check_agenciamiento . $_proyecto_accordion;
				}

				$_habilita_check = '';
				if (!$_flag_habilita_check_proyecto or !$_flag_habilita_check_impuestos) {
					$_habilita_check = 'disabled';
				}

				if (isset($instruccion["impuestos"][$value["ID_PROYECTO_INTERNACIONAL"]]) and !$_flag_habilita_check_impuestos) {
					$_flag_form_content = '';
				}

				$_accordion_content .= '
						<div class="panel panel-default panel-border-color panel-border-color-default" data-id_proyecto="' . $value["ID_PROYECTO_INTERNACIONAL"] . '">
							<div class="panel-heading">
								<div class="tools">
									<a href="' . BASE_URL . 'public/files/internacional/oferta_comercial/' . $value["ID_PROYECTO_INTERNACIONAL"] . '/' . $value["url"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar Oferta Comercial">
										<span class="icon mdi mdi-download"></span>
									</a>
								</div>
								<div class="tools">
									<div class="be-checkbox">
										<input class="check_instrucciones" value="' . $value["ID_PROYECTO_INTERNACIONAL"] . '" id="check_instruccion_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" type="checkbox" ' . $_habilita_check . '>
										<label for="check_instruccion_' . $value["ID_PROYECTO_INTERNACIONAL"] . '"></label>
									</div>
								</div>
								<h4 class="panel-title">
									<a data-toggle="collapse" data-parent="#accordion1" href="#accordion_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" class="collapsed" aria-expanded="false"><i class="icon mdi mdi-chevron-down"></i> ' . $value["do"] . ' <small>' . $value["importacion"] . '</small>
										<span class="panel-subtitle datos_oferta"></span>
										<span class="panel-subtitle">Fecha: <strong>' . $value["FECHA_OFERTA"] . '</strong> | Valor: <strong>' . number_format($value["VALOR_OFERTA"], 2, ',', '.') . ' ' . $value["MONEDA_OFERTA"] . '</strong> ' . $_valor_pesos . $_valor_usd . ' </span>
									</a>
								</h4>
							</div>
							<div id="accordion_' . $value["ID_PROYECTO_INTERNACIONAL"] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
								<div class="panel-body">
									' . $_info_proyecto . '
									<div class="col-xs-12 col-sm-12 col-md-12 ' . $_flag_form_content . '">
										' . $_form_content . '
									</div>
								</div>
							</div>
						</div>
					';
			}
		}

		// Contenido del popup
		$_msg_content["content"] = '
				' . $_info_cliente . '
				<div class="form-group col-xs-12 col-sm-6 col-md-6">
					' . $instruccion["trm"]["content"] . '
				</div>
				<div class="form-group col-xs-12 col-sm-6 col-md-6" id="table_impuestos"></div>
				<div class="form-group col-xs-12 col-sm-12 col-md-12" id="table_liquidacion"></div>
				<div class="form-group col-xs-12 col-sm-12 col-md-12" id="impresion_content">
					<table id="table1" class="table">
						<tbody>
							<tr>
								<th class="actions">
									<a href="#" id="btn_ver_proforma" class="cell-detail hint--top-left" data-hint="Ver modelo de Proforma de Factura">
										<span class="icon mdi mdi-eye"></span>
									</a> 
								</th>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="form-group col-xs-12 col-sm-12 col-md-12" id="impresion_view_content">
					<div class="panel panel-border panel-contrast">
						<div class="panel-heading panel-heading-contrast">
							Vista de Proforma
							<span class="panel-subtitle">Así será la vista aproximada de la factura, <strong class="text-danger">por favor verifique los datos</strong> antes de guardar los cambios.</span>
						</div>
						<div class="panel-body xs-mt-15">
							<div class="col-xs-12 col-sm-12 col-md-12" id="encabezado_content"></div>
							<div class="col-xs-12 col-sm-12 col-md-12" id="cuerpo_content"></div>
							<div class="col-xs-12 col-sm-12 col-md-12" id="totales_content"></div>
						</div>
					</div>
				</div>
				<div class="row"></div>
				<form id="form_instruccion">
					<input type="hidden" name="id_cliente" value="' . $_POST["id"] . '">
					<input type="hidden" name="proyectos" id="proyectos">
					<input type="hidden" name="total_factura" id="total_factura">
					<input type="hidden" name="total_agenciamiento" id="total_agenciamiento">
					<input type="hidden" name="total_sobrecostos" id="total_sobrecostos">
					<input type="hidden" name="iva_factura" id="iva_factura">
					<input type="hidden" name="retefuente_factura" id="retefuente_factura">
					<input type="hidden" name="total_impuestos_pesos" id="total_impuestos_pesos">
					<div id="accordion1" class="panel-group accordion">
						' . $_accordion_content . '
					</div>
				</form>
			';
		break;

	case 'actuliza_moneda_oferta':
		$_msg_control .= "Entro en la acción actuliza_moneda_oferta.\n";

		// Se edita la moneda de la oferta comercial
		$array = array();
		$array["id_moneda"] = $_POST["id_moneda"];
		$Data->updateRegistro("cmx_intr_oferta_comercial", $array, (int)$_POST["id"]);
		break;

	case 'ver_formato_proforma':
		$_msg_control .= "Entro en la acción ver_formato_proforma.\n";

		/***** CONTENIDO DEL ENCABEZADO *****/
		if ($_POST["encabezado"]) {
			$encabezado = $_POST["encabezado"];
			$_msg_content["encabezado"] = '
					<table class="table table-condensed table-bordered">
						<tbody>
							<tr>
								<td class="cell-detail">
									<span>' . $encabezado["cliente_nombre"] . '</span>
									<span class="cell-detail-description">' . $encabezado["cliente_nit"] . '</span>
									<span class="cell-detail-description">' . $encabezado["cliente_direccion"] . '</span>
									<span class="cell-detail-description">' . $encabezado["cliente_municipio"] . '</span>
								</td>
							</tr>
						</tbody>
					</table>
				';
		}
		/***** FIN - CONTENIDO DEL ENCABEZADO *****/

		/***** CONTENIDO DEL CUERPO *****/
		$_msg_content["cuerpo"] = '
				<table class="table table-condensed table-bordered">
					<tbody>
						<tr>
							<td class="cell-detail">
								<!-- ENCABEZADO DEL CUERPO DE LA FACTURA -->
								<div class="col-xs-12 col-sm-3 col-md-2 text-center">
									<span><strong>Cantidad</strong></span>
								</div>
								<div class="col-xs-12 col-sm-6 col-md-8 text-center">
									<span><strong>Descripción</strong></span>
								</div>
								<div class="col-xs-12 col-sm-3 col-md-2 text-center">
									<span><strong>Valor</strong></span>
								</div>
			';
		foreach ($_POST["cuerpo"] as $key => $value) {
			$id_intr_proyecto = $value[0];
			$conceptos = array();
			if (isset($value[1])) {
				$conceptos = $value[1];
			}
			$valores = $value[2];
			$impuestos = array();
			if (isset($value[4])) {
				$impuestos = $value[4];
			}

			$info = $Internacional->getDatosProyectosFactura($id_intr_proyecto);

			// Se pienta la información de DO del proyecto
			$general = $info["general"]["rowsData"][0];
			$_do = $general["do"];
			switch ($general["tipo_operacion"]) {
				case 'EXPORTACION':
					$tipo_proyecto = $general["tipo_operacion"];
					break;

				case 'IMPORTACION':
					$tipo_proyecto = $general["tipo_operacion"];
					break;

				default:
					$tipo_proyecto = "Transporte";
					break;
			}

			// Se pinta la información de los tramos del proyecto 
			$_tramo_origen = '';
			$_tramo_destino = '';
			$_guias = '';
			if (isset($info["tramos"]["tramos"]["rowsData"])) {
				$_tramo_origen = ' | Origen: [ ';
				$_flag_varios_origen = false;
				$_tramo_destino = ' | Destino: [ ';
				$_flag_varios_destino = false;
				$_guias = ' | Guías: [ ';
				$_flag_guias = false;
				foreach ($info["tramos"]["tramos"]["rowsData"] as $key_01 => $value_01) {
					if ($value_01["tipo_tramo"] == "Cargue") {
						if ($_flag_varios_origen) {
							$_tramo_origen .= ' | ' . $value_01["municipio"] . ' ';
						} else {
							$_tramo_origen .= ' ' . $value_01["municipio"] . ' ';
							$_flag_varios_origen = true;
						}
					} else {
						if ($_flag_varios_destino) {
							$_tramo_destino .= ' | ' . $value_01["municipio"] . ' ';
						} else {
							$_tramo_destino .= ' ' . $value_01["municipio"] . ' ';
							$_flag_varios_destino = true;
						}

						if ($_flag_guias) {
							$_guias .= ' | ' . $value_01["guia"] . ' ';
						} else {
							$_guias .= ' ' . $value_01["guia"] . ' ';
							$_flag_guias = true;
						}

						// Se buscan los deliveries de la guía 
						$_deliveries = '';
						if (isset($info["tramos"]["material"][$value_01['id']][0]["rowsData"])) {
							$_flag_varios_delivery = false;
							$_delivery_content = '';
							foreach ($info["tramos"]["material"][$value_01['id']][0]["rowsData"] as $key_02 => $value_02) {
								if ($value_02["delivery"]) {
									if ($_flag_varios_delivery) {
										$_delivery_content .= ' | ' . $value_02["delivery"] . ' ';
									} else {
										$_delivery_content .= ' ' . $value_02["delivery"] . ' ';
										$_flag_varios_delivery = true;
									}
								}
							}
							if ($_delivery_content) {
								$_deliveries = '<small>Delivery: [' . $_delivery_content . ']</small>';
							}
						}
					}
				}
				$_tramo_origen .= ' ]';
				$_tramo_destino .= ' ]';
				$_guias .= $_deliveries . ' ]';
			}

			// Se describe la ofeta comercial aprobada por el cliente 
			$_oferta_comercial = "Oferta Aprobada: [ " . number_format($general["valor"], 2, ',', '.') . " " . $general["MONEDA"] . " ]";

			// Se pregunta si se debe mostrar conceptos del proyecto
			$_conceptos = '';
			if (isset($conceptos) and $conceptos) {
				$_conceptos = 'Conceptos: [';
				$_flag_varios_conceptos = false;
				foreach ($conceptos as $value_01) {
					if ($_flag_varios_conceptos) {
						$_conceptos .= ' | ' . $value_01 . ' ';
					} else {
						$_conceptos .= ' ' . $value_01 . ' ';
						$_flag_varios_conceptos = true;
					}
				}
				$_conceptos .= ' ]';
			}

			$_impuestos = '';
			if (isset($impuestos) and $impuestos) {
				$_impuestos = '[ <strong>' . $_do . '</strong> ] Impuestos: [ ';
				$_flag_varios_impuestos = false;
				foreach ($impuestos as $value_01) {
					if ($_flag_varios_impuestos) {
						$_impuestos .= ' | ' . number_format($value_01["valor"], 2, ',', '.') . ' ' . $value_01["moneda"];
					} else {
						$_impuestos .= ' ' . number_format($value_01["valor"], 2, ',', '.') . ' ' . $value_01["moneda"];
						$_flag_varios_impuestos = true;
					}
				}
				$_impuestos .= ' ]<br />';
				$_array_impuestos[] = $_impuestos;
			}
			$_msg_content["cuerpo"] .= '
					<div class="col-xs-12 col-sm-3 col-md-2 text-center">
						<span>1</span>
					</div>
					<div class="col-xs-12 col-sm-6 col-md-8">
						<span>[ ' . $_do . ' ] ' . $tipo_proyecto . $_tramo_origen . $_tramo_destino . $_guias . '</span>
						<span class="cell-detail-description">' . $_oferta_comercial . '</span>
						<span class="cell-detail-description">' . $_conceptos . '</span>
						<span class="cell-detail-description">' . $general["comodin_facturacion"] . '</span>
					</div>
					<div class="col-xs-12 col-sm-3 col-md-2 text-right">
						<span>' . number_format((int)$valores["valor_servicio"], 0, ',', '.') . '</span>
					</div>
					<div class="row"></div>
				';

			// Se pregunta si el proyecto tiene agenciamiento 
			if ($valores["agenciamiento"] == "true") {
				$_msg_content["cuerpo"] .= '
						<div class="col-xs-12 col-sm-3 col-md-2 text-center">
							<span></span>
						</div>
						<div class="col-xs-12 col-sm-6 col-md-8">
							<span>[ ' . $_do . ' ] Agenciamiento</span>
						</div>
						<div class="col-xs-12 col-sm-3 col-md-2 text-right">
							<span>' . number_format($valores["valor_agenciamiento"], 0, ',', '.') . '</span>
						</div>
						<div class="row"></div>
					';
			}

			// Se agrega los impuestos incurridos en el proyecto
			if (isset($value[3]) and $value[3]) {
				foreach ($value[3] as $key_01 => $value_01) {
					if ($value_01["id_proyecto"] == $id_intr_proyecto) {
						$_msg_content["cuerpo"] .= '
								<div class="col-xs-12 col-sm-3 col-md-2 text-center">
									<span></span>
								</div>
								<div class="col-xs-12 col-sm-6 col-md-8">
									<span>[ ' . $_do . ' ] ' . $value_01["descripcion"] . '</span>
								</div>
								<div class="col-xs-12 col-sm-3 col-md-2 text-right">
									<span>' . number_format($value_01["valor"], 0, ',', '.') . '</span>
								</div>
								<div class="row"></div>
							';
					}
				}
			}

			// Se agrega los sobrecostos incurridos en el proyecto
			if (isset($value[5]) and $value[5]) {
				foreach ($value[5] as $key_01 => $value_01) {
					if ($value_01["id_proyecto"] == $id_intr_proyecto) {
						$_msg_content["cuerpo"] .= '
								<div class="col-xs-12 col-sm-3 col-md-2 text-center">
									<span></span>
								</div>
								<div class="col-xs-12 col-sm-6 col-md-8">
									<span>[ ' . $_do . ' ] Sobrecosto - ' . $value_01["descripcion"] . '</span>
								</div>
								<div class="col-xs-12 col-sm-3 col-md-2 text-right">
									<span>' . number_format($value_01["valor"], 0, ',', '.') . '</span>
								</div>
								<div class="row"></div>
							';
					}
				}
			}
			$_msg_content["cuerpo"] .= '<div class="form-group col-xs-12 col-sm-12 col-md-12"></div>';
		}
		$_msg_content["cuerpo"] .= '
							</td>
						</tr>
					</tbody>
				</table>
			';
		/***** FIN - CONTENIDO DEL CUERPO *****/

		/***** CONTENIDO DE LOS TOTALES *****/
		if ($_POST["totales"]) {
			$totales = $_POST["totales"];

			$_trm_content = '';
			if (isset($totales["trm_dia"])) {
				$_trm_content = 'Tasas de cambio: [ ';
				$_flag_varios_trm = false;

				foreach ($totales["trm_dia"] as $key => $value) {
					if ($_flag_varios_trm) {
						$_trm_content .= ' | ' . $value["moneda"] . ' (' . number_format($value["valor"], 2, ',', '.') . ') ';
					} else {
						$_trm_content .= ' ' . $value["moneda"] . ' (' . number_format($value["valor"], 2, ',', '.') . ') ';
						$_flag_varios_trm = true;
					}
				}
				$_trm_content .= ' ]';
			}
			$_total_impuestos = '';
			if (isset($_array_impuestos)) {
				foreach ($_array_impuestos as $key => $value) {
					$_total_impuestos .= '<span class="cell-detail-description">' . $value . '</span>';
				}
			}

			// Se toma el valor en letras del total de la factura 
			$total_factura_numero = number_format($totales["valor_total_factura"], 0, ',', '');
			$factura_letras = $Internacional->getNumeroEnLetra($total_factura_numero, 0);
			$_total_factura_letras = $factura_letras["entero"];

			$_msg_content["totales"] = '
					<table class="table table-condensed table-bordered">
						<tbody>
							<tr>
								<td class="cell-detail">
									<div class="col-xs-12 col-sm-6 col-md-8">
										<div class="form-group col-xs-12 col-sm-12 col-md-12">
											<span>Observaciones</span>
											<span class="cell-detail-description">' . $_trm_content . '</span>
											' . $_total_impuestos . '
										</div>
										<div class="col-xs-12 col-sm-12 col-md-12">
											<span>Valor en letras</span>
											<span class="cell-detail-description">' . $_total_factura_letras . ' PESOS M/C</span>
										</div>
									</div>
									<div class="col-xs-12 col-sm-3 col-md-2 text-right">
										<span>Subtotal</span>
										<span>Retefuente</span>
										<span>IVA</span>
										<span><strong>Total</strong></span>
									</div>
									<div class="col-xs-12 col-sm-3 col-md-2 text-right">
										<span>' . number_format($totales["subtotal"], 0, ',', '.') . '</span>
										<span>' . number_format($totales["retefuente"], 0, ',', '.') . '</span>
										<span>' . number_format($totales["valor_iva"], 0, ',', '.') . '</span>
										<span><strong>' . number_format($totales["valor_total_factura"], 0, ',', '.') . '</strong></span>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				';
		}
		/***** FIN - CONTENIDO DE LOS TOTALES *****/
		break;

	case 'ajusta_documento_entrega':
		$_msg_control .= "Entro en la acción ajusta_documento_entrega.\n";

		$array = array();
		$array["soporte_facturacion"] = (bool)$_POST["soporte_facturacion"];
		$Data->updateRegistro("cmx_intr_solicitud_documentos", $array, (int)$_POST["id"]);
		break;

	case 'ajusta_vista_concepto':
		$_msg_control .= "Entro en la acción ajusta_vista_concepto.\n";

		$array = array();
		$array["fct_muestra_concepto"] = (bool)$_POST["fct_muestra_concepto"];
		$Data->updateRegistro("cmx_intr_cotizaciones", $array, (int)$_POST["id"]);
		break;

	case 'tabla_resumen_impuestos':
		$_msg_control .= "Entro en la acción tabla_resumen_impuestos.\n";

		$arrayTotalImpuestos = array();
		$total_pesos = 0;
		foreach ($_POST["array"] as $key => $value) {
			if (!isset($arrayTotalImpuestos[$value["id_moneda"]])) {
				$arrayTotalImpuestos[$value["id_moneda"]]["cantidad"] = 1;
				$arrayTotalImpuestos[$value["id_moneda"]]["moneda"] = $value["moneda"];
				$arrayTotalImpuestos[$value["id_moneda"]]["valor"] = (float)$value["valor_impuesto"];
				$total_pesos += (float)$value["valor_pesos"];
			} else {
				$arrayTotalImpuestos[$value["id_moneda"]]["cantidad"]++;
				$arrayTotalImpuestos[$value["id_moneda"]]["valor"] += (float)$value["valor_impuesto"];
				$total_pesos += (float)$value["valor_pesos"];
			}
		}

		$_impuestos_table = '
				<strong>Resumen de Impuestos por Moneda</strong>
				<table class="table table-striped table-hover">
					<thead>
						<tr>
							<th>Moneda</th>
							<th>Cantidad</th>
							<th>Total</th>
						</tr>
					</thead>
					<tbody>
			';
		foreach ($arrayTotalImpuestos as $key => $value) {
			$_impuestos_table .= '
					<tr>
						<td class="cell-detail">
							<span>' . $value["moneda"] . '</span>
						</td>
						<td class="cell-detail text-center">
							<span>' . $value["cantidad"] . '</span>
						</td>
						<td class="cell-detail text-right">
							<span>' . number_format($value["valor"], 2, ',', '.') . '</span>
						</td>
					</tr>
				';
		}
		$_impuestos_table .= '
						<tr>
							<td class="cell-detail" colspan="3">
								<span>Total Facturas en COP: <strong>' . number_format($total_pesos, 0, ',', '.') . '</strong></span>
							</td>
						</tr>
					</tbody>
				</table>
			';
		$return["total_impuestos_pesos"] = number_format($total_pesos, 0, ',', '');
		$_msg_content = $_impuestos_table;
		break;

	case 'crear_instruccion':
		$_msg_control .= "Entro en la acción crear_instruccion.\n";

		$proyectos = explode(",", $_POST["proyectos"]);

		/***** Array para guardar la información de la factura *****/
		$proforma = "PRF-" . $time;

		$subtotal = number_format($_POST["total_factura"], 0, ',', '');

		$iva = 0;
		if ($_POST["iva_factura"]) {
			$iva = number_format($_POST["iva_factura"], 0, ',', '');
		}

		$retefuente = 0;
		if ($_POST["retefuente_factura"]) {
			$retefuente = number_format($_POST["retefuente_factura"], 0, ',', '');
		}
		$total = $subtotal + $iva + $retefuente;

		$array = array();
		$array["id_cliente"] = $_POST["id_cliente"];
		$array["num_proforma"] = $proforma;
		$array["subtotal"] = (int)$subtotal;
		$array["iva"] = (int)$iva;
		$array["retefuente"] = (int)$retefuente;
		$array["total"] = (int)$total;
		$id_factura = $Data->setRegistro("cmx_intr_factura_cliente", $array);
		$return["gestion"]["factura"] = $array;
		/***** Fin - Array para guardar la ainformación de la factura *****/

		/***** Se guarda las TRM usadas para la liquidación de la factura *****/
		$result = $Internacional->getTrmHoyFacturas();
		if ($result) {
			$trm_factura = $result["result"];
			foreach ($trm_factura as $key => $value) {
				$array = array();
				$array["id_factura"] = $id_factura;
				$array["valor"] = (float)$value["valor"] + 25;
				$array["id_moneda"] = $value["id_moneda"];
				$array["fecha"] = $value["fecha"];
				$Data->setRegistro("cmx_intr_factura_trm", $array);
				$return["gestion"]["trm_factura"][$value[0]] = $array;
			}
		}
		/***** Fin - Se guarda las TRM usadas para la liquidación de la factura *****/

		/***** Se asigna la factura a la solicitud *****/
		foreach ($proyectos as $value) {
			if ($value) {
				// Se asigna el valor de la factura en la BD
				$valor_facturado = number_format($_POST["valor_pesos_" . $value], 0, ',', '');
				$valor_agenciamiento = 0;
				if ($_POST["valor_agenciamiento_" . $value]) {
					$valor_agenciamiento = number_format($_POST["valor_agenciamiento_" . $value], 0, ',', '');
				}

				$valor_sobrecosto = 0;
				if (isset($_POST["total_sobrecosto_" . $value]) and $_POST["total_sobrecosto_" . $value]) {
					$valor_sobrecosto = number_format($_POST["total_sobrecosto_" . $value], 0, ',', '');
				}

				$array = array();
				$array["id_factura"] = $id_factura;
				$array["valor_facturado"] = (int)$valor_facturado;
				$array["valor_agenciamiento"] = (int)$valor_agenciamiento;
				$array["valor_sobrecosto"] = (int)$valor_sobrecosto;
				$Data->updateRegistro("cmx_intr_solicitudes", $array, (int)$value);
				// $return["gestion"]["proyectos"][$value] = $array;

				// Se asigna el valor de los impuestos en la BD
				if (isset($_POST["id_impuestos_" . $value])) {
					$impuestos = explode(",", $_POST["id_impuestos_" . $value]);
					foreach ($impuestos as $value_01) {
						if ($value_01) {
							$array = array();
							$valor_facturado = 0;
							if (isset($_POST["valor_impuesto_pesos_" . $value . "_" . $value_01]) and $_POST["valor_impuesto_pesos_" . $value . "_" . $value_01]) {
								$valor_facturado =  number_format($_POST["valor_impuesto_pesos_" . $value . "_" . $value_01], 0, ',', '');
								$valor_facturado = str_replace(",", ".", str_replace(".", "", $valor_facturado));
							}
							$array["valor_facturado"] = (float)$valor_facturado;
							$Data->updateRegistro("cmx_intr_cotizaciones", $array, (int)$value_01);
							// $return["gestion"]["impuestos"][$value][$value_01] = $array;
						}
					}
				}

				// Se asigna el valor de los sobrecostos en la BD
				if (isset($_POST["id_sobercosto_" . $value])) {
					$sobrecostos = explode(",", $_POST["id_sobercosto_" . $value]);
					foreach ($sobrecostos as $value_01) {
						if ($value_01) {
							$array = array();
							$valor_facturado = 0;
							if (isset($_POST["valor_facturar_" . $value . "_" . $value_01]) and $_POST["valor_facturar_" . $value . "_" . $value_01]) {
								$valor_facturado = $_POST["valor_facturar_" . $value . "_" . $value_01];
								$valor_facturado = str_replace(",", ".", str_replace(".", "", $valor_facturado));
							}
							$array["valor_facturado"] = (float)$valor_facturado;
							$Data->updateRegistro("cmx_intr_cotizaciones", $array, (int)$value_01);
							// $return["gestion"]["sobrecostos"][$value][$value_01] = $array;
						}
					}
				}
			}
		}
		/***** Fin - Se asigna la factura a la solicitud *****/
		break;

	case 'form_editar_factura':
		$_msg_control .= "Entro en la acción form_editar_factura.\n";

		$info_factura = $Internacional->getDatosInstruccionFactura($_POST["id"]);
		$_array_result = $info_factura;

		/***** Contenido de la información del cliente *****/
		$cliente = $info_factura["cliente"];
		$_info_cliente = datosClienteEncabezado($cliente);
		/***** FIN - Contenido de la información del cliente *****/

		$_msg_content["title"] = 'Gestionar Factura - ' . $cliente["sigla"];

		/***** CONTENIDO DE LA MAQUETA DE LA FACTURA *****/
		if ($info_factura["proyectos"]) {
			/***** CONTENIDO DEL ENCABEZADO *****/
			$_encabezado = '
					<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-alert-triangle"></span>
						</div>
						<div class="message">
							<strong>Atención!</strong><p>No se encontró información para el encabezado de la factura.</p>
						</div>
					</div>
				';
			$_encabezado_print = '';

			if ($info_factura["cliente"]) {
				$encabezado = $info_factura["cliente"];
				$_encabezado = '
						<table class="table table-condensed table-bordered">
							<tbody>
								<tr>
									<td class="cell-detail">
										<span>' . $encabezado["nombre"] . '</span>
										<span class="cell-detail-description">' . $encabezado["documento"] . '-' . $encabezado["digito_verificacion"] . '</span>
										<span class="cell-detail-description">' . $encabezado["direccion"] . '</span>
										<span class="cell-detail-description">' . $encabezado["municipio"] . ' (' . $encabezado["pais"] . ')</span>
									</td>
								</tr>
							</tbody>
						</table>
					';
				$_encabezado_print = '
						<table class="table table-condensed table-borderless">
							<tbody>
								<tr>
									<td class="cell-detail">
										<span>' . $encabezado["nombre"] . '</span>
										<span class="cell-detail-description">' . $encabezado["documento"] . '-' . $encabezado["digito_verificacion"] . '</span>
										<span class="cell-detail-description">' . $encabezado["direccion"] . '</span>
										<span class="cell-detail-description">' . $encabezado["municipio"] . ' (' . $encabezado["pais"] . ')</span>
									</td>
								</tr>
							</tbody>
						</table>
					';
			}
			/***** FIN - CONTENIDO DEL ENCABEZADO *****/

			// /***** CONTENIDO DEL CUERPO *****/
			$_cuerpo = '
					<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-alert-triangle"></span>
						</div>
						<div class="message">
							<strong>Atención!</strong><p>No se encontró información para el cuerpo de la factura.</p>
						</div>
					</div>
				';
			$_cuerpo_print = '';
			if ($info_factura["proyectos"]) {
				$_cuerpo = '
						<table class="table table-condensed table-bordered">
							<tbody>
								<tr>
									<td class="cell-detail">
										<!-- ENCABEZADO DEL CUERPO DE LA FACTURA -->
										<div class="col-xs-12 col-sm-3 col-md-2 text-center">
											<span><strong>Cantidad</strong></span>
										</div>
										<div class="col-xs-12 col-sm-6 col-md-8 text-center">
											<span><strong>Descripción</strong></span>
										</div>
										<div class="col-xs-12 col-sm-3 col-md-2 text-center">
											<span><strong>Valor</strong></span>
										</div>
					';
				$_cuerpo_print = '
						<table class="table table-condensed table-borderless">
							<thead>
								<tr>
									<th class="text-center">
										<span>Cantidad</span>
									</th>
									<th class="text-center">
										<span>Descripción</span>
									</th>
									<th class="text-center">
										<span>Valor</span>
									</th>
							</thead>
							<tbody>
					';

				$_actividades_proyecto = '';
				$_impuestos = '';
				foreach ($info_factura["proyectos"] as $key => $value) {
					$id_intr_proyecto = $value['ID_PROYECTO_INTERNACIONAL'];
					/***** CONTENIDO DE LAS ACTIVIDADES DEL PROYECTO *****/
					$_actividades_proyecto .= '<div class="actividades" data-id_actividad="' . $value["ID_ACTIVIDAD"] . '" data-orden="' . $value["orden"] . '" data-fecha_hora_inicio="' . $value["fecha_hora_inicio"] . '" data-id_importacion="' . $value["id_importacion"] . '" data-bloque="' . $value["bloque"] . '" data-grupo="' . $value["grupo"] . '" data-simultaneo="' . $value["simultaneo"] . '" data-tipo_actividad="' . $value["tipo_actividad"] . '" data-costo_real="' . $value["costo_real"] . '" data-respuesta="' . $value["respuesta"] . '"></div>';
					/***** FIN - CONTENIDO DE LAS ACTIVIDADES DEL PROYECTO *****/

					// Se pienta la información de DO del proyecto
					$_do = $value["do"];
					switch ($value["tipo_operacion"]) {
						case 'EXPORTACION':
							$tipo_proyecto = $value["tipo_operacion"];
							break;

						case 'IMPORTACION':
							$tipo_proyecto = $value["tipo_operacion"];
							break;

						default:
							$tipo_proyecto = "Transporte";
							break;
					}

					// Se pinta la información de los tramos del proyecto 
					$_tramo_origen = '';
					$_tramo_destino = '';
					$_guias = '';
					if (isset($info_factura["tramos"][$value['ID_PROYECTO_INTERNACIONAL']]["tramos"])) {
						$_tramo_origen = ' | Origen: [ ';
						$_flag_varios_origen = false;
						$_tramo_destino = ' | Destino: [ ';
						$_flag_varios_destino = false;
						$_guias = ' | Guías: [ ';
						$_flag_guias = false;
						foreach ($info_factura["tramos"][$value['ID_PROYECTO_INTERNACIONAL']]["tramos"] as $key_01 => $value_01) {
							if ($value_01["tipo_tramo"] == "Cargue") {
								if ($_flag_varios_origen) {
									$_tramo_origen .= ' | ' . $value_01["municipio"] . ' ';
								} else {
									$_tramo_origen .= ' ' . $value_01["municipio"] . ' ';
									$_flag_varios_origen = true;
								}
							} else {
								if ($_flag_varios_destino) {
									$_tramo_destino .= ' | ' . $value_01["municipio"] . ' ';
								} else {
									$_tramo_destino .= ' ' . $value_01["municipio"] . ' ';
									$_flag_varios_destino = true;
								}

								if ($_flag_guias) {
									$_guias .= ' | ' . $value_01["guia"] . ' ';
								} else {
									$_guias .= ' ' . $value_01["guia"] . ' ';
									$_flag_guias = true;
								}

								// // Se buscan los deliveries de la guía 
								$_deliveries = '';
								if (isset($info_factura["tramos"][$value['ID_PROYECTO_INTERNACIONAL']]["material"][$value_01[0]][0]["rowsData"])) {
									$_flag_varios_delivery = false;
									$_delivery_content = '';
									foreach ($info_factura["tramos"][$value['ID_PROYECTO_INTERNACIONAL']]["material"][$value_01[0]][0]["rowsData"] as $key_02 => $value_02) {
										if ($value_02["delivery"]) {
											if ($_flag_varios_delivery) {
												$_delivery_content .= ' | ' . $value_02["delivery"] . ' ';
											} else {
												$_delivery_content .= ' ' . $value_02["delivery"] . ' ';
												$_flag_varios_delivery = true;
											}
										}
									}
									if ($_delivery_content) {
										$_deliveries = '<small>Delivery: [' . $_delivery_content . ']</small>';
									}
								}
							}
						}
						$_tramo_origen .= ' ]';
						$_tramo_destino .= ' ]';
						$_guias .= $_deliveries . ' ]';
					}

					// Se describe la ofeta comercial aprobada por el cliente 
					$_oferta_comercial = "Oferta Aprobada: [ " . number_format($value["VALOR_OFERTA"], 2, ',', '.') . " " . $value["MONEDA_OFERTA"] . " ]";

					// Se pregunta si se debe mostrar conceptos del proyecto
					$_conceptos = '';
					// if (isset($info_factura["conceptos"][$value['ID_PROYECTO_INTERNACIONAL']][1])) {
					if (isset($info_factura["conceptos"][$value['ID_PROYECTO_INTERNACIONAL']])) {
						$_flag_varios_conceptos = false;
						// foreach ($info_factura["conceptos"][$value['ID_PROYECTO_INTERNACIONAL']][1] as $key_01 => $value_01) {
						foreach ($info_factura["conceptos"][$value['ID_PROYECTO_INTERNACIONAL']] as $key_01 => $value_01) {
							if ($value_01["fct_muestra_concepto"] == 1) {
								if ($_flag_varios_conceptos) {
									$_conceptos .= ' | ' . $value_01["nombre"] . ' ';
								} else {
									$_conceptos = 'Conceptos: [';
									$_conceptos .= ' ' . $value_01["nombre"] . ' ';
									$_flag_varios_conceptos = true;
								}
							}
						}
						if ($_conceptos) {
							$_conceptos .= ' ]';
						}
					}

					if (isset($info_factura["impuestos"][$value['ID_PROYECTO_INTERNACIONAL']])) {
						$_impuestos .= '[ <strong>' . $_do . '</strong> ] Impuestos: [ ';
						$_flag_varios_impuestos = false;
						foreach ($info_factura["impuestos"][$value['ID_PROYECTO_INTERNACIONAL']] as $key_01 => $value_01) {
							if ($_flag_varios_impuestos) {
								$_impuestos .= ' | ' . number_format($value_01["valor"], 2, ',', '.') . ' ' . $value_01["MONEDA"];
							} else {
								$_impuestos .= ' ' . number_format($value_01["valor"], 2, ',', '.') . ' ' . $value_01["MONEDA"];
								$_flag_varios_impuestos = true;
							}
						}
						$_impuestos .= ' ]<br />';
					}

					$_cuerpo .= '
							<div class="col-xs-12 col-sm-3 col-md-2 text-center">
								<span>1</span>
							</div>
							<div class="col-xs-12 col-sm-6 col-md-8">
								<span>[ ' . $_do . " ] " . $tipo_proyecto . $_tramo_origen . $_tramo_destino . $_guias . '</span>
								<span class="cell-detail-description">' . $_oferta_comercial . '</span>
								<span class="cell-detail-description">' . $_conceptos . '</span>
								<span class="cell-detail-description">' . $value["comodin_facturacion"] . '</span>
							</div>
							<div class="col-xs-12 col-sm-3 col-md-2 text-right">
								<span>' . number_format($value["valor_facturado"], 0, ',', '.') . '</span>
							</div>
							<div class="row"></div>
						';
					$_cuerpo_print .= '
							<tr>
								<td class="cell-detail text-center" style="vertical-align: text-top;">
									<span>1</span>
								</td>
								<td class="cell-detail" style="vertical-align: text-top;">
									<span>[ ' . $_do . " ] " . $tipo_proyecto . $_tramo_origen . $_tramo_destino . $_guias . '</span>
									<span class="cell-detail-description">' . $_oferta_comercial . '</span>
									<span class="cell-detail-description">' . $_conceptos . '</span>
									<span class="cell-detail-description">' . $value["comodin_facturacion"] . '</span>
								</td>
								<td class="cell-detail text-right" style="vertical-align: text-top;">
									<span>' . number_format($value["valor_facturado"], 0, ',', '.') . '</span>
								</td>
							</tr>
						';

					// Se pregunta si el proyecto tiene agenciamiento 
					if ((int)$value["valor_agenciamiento"] > 0) {
						$_cuerpo .= '
								<div class="col-xs-12 col-sm-3 col-md-2 text-center">
									<span></span>
								</div>
								<div class="col-xs-12 col-sm-6 col-md-8">
									<span>[ ' . $_do . ' ] Agenciamiento</span>
								</div>
								<div class="col-xs-12 col-sm-3 col-md-2 text-right">
									<span>' . number_format($value["valor_agenciamiento"], 0, ',', '.') . '</span>
								</div>
								<div class="row"></div>
							';
						$_cuerpo_print .= '
								<tr>
									<td class="cell-detail text-center">
										<span></span>
									</td>
									<td class="cell-detail">
										<span>[ ' . $_do . ' ] Agenciamiento</span>
									</td>
									<td class="cell-detail text-right">
										<span>' . number_format($value["valor_agenciamiento"], 0, ',', '.') . '</span>
									</td>
								</tr>
							';
					}

					// Se agrega los impuestos incurridos en el proyecto
					if (isset($info_factura["impuestos"][$value['ID_PROYECTO_INTERNACIONAL']]) and $info_factura["impuestos"][$value['ID_PROYECTO_INTERNACIONAL']]) {
						foreach ($info_factura["impuestos"][$value['ID_PROYECTO_INTERNACIONAL']] as $key_01 => $value_01) {
							$_cuerpo .= '
									<div class="col-xs-12 col-sm-3 col-md-2 text-center">
										<span></span>
									</div>
									<div class="col-xs-12 col-sm-6 col-md-8">
										<span>[ ' . $_do . ' ] ' . $value_01["nombre"] . ' - ' . $value_01["descripcion"] . '</span>
									</div>
									<div class="col-xs-12 col-sm-3 col-md-2 text-right">
										<span>' . number_format($value_01["valor_facturado"], 0, ',', '.') . '</span>
									</div>
									<div class="row"></div>
								';
							$_cuerpo_print .= '
									<tr>
										<td class="cell-detail text-center">
											<span></span>
										</td>
										<td class="cell-detail">
											<span>[ ' . $_do . ' ] ' . $value_01["nombre"] . ' - ' . $value_01["descripcion"] . '</span>
										</td>
										<td class="cell-detail text-right">
											<span>' . number_format($value_01["valor_facturado"], 0, ',', '.') . '</span>
										</td>
									</tr>
								';
						}
					}

					// Se agrega los sobrecostos incurridos en el proyecto
					if (isset($info_factura["sobrecostos"][$value['ID_PROYECTO_INTERNACIONAL']]) and $info_factura["sobrecostos"][$value['ID_PROYECTO_INTERNACIONAL']]) {
						foreach ($info_factura["sobrecostos"][$value['ID_PROYECTO_INTERNACIONAL']] as $key_01 => $value_01) {
							$_cuerpo .= '
									<div class="col-xs-12 col-sm-3 col-md-2 text-center">
										<span></span>
									</div>
									<div class="col-xs-12 col-sm-6 col-md-8">
										<span>[ ' . $_do . ' ] Sobrecosto - ' . $value_01["nombre"] . ' - ' . $value_01["descripcion"] . '</span>
									</div>
									<div class="col-xs-12 col-sm-3 col-md-2 text-right">
										<span>' . number_format($value_01["valor_facturado"], 0, ',', '.') . '</span>
									</div>
									<div class="row"></div>
								';
							$_cuerpo_print .= '
									<tr>
										<td class="cell-detail text-center">
											<span></span>
										</td>
										<td class="cell-detail">
											<span>[ ' . $_do . ' ] Sobrecosto - ' . $value_01["nombre"] . ' - ' . $value_01["descripcion"] . '</span>
										</td>
										<td class="cell-detail text-right">
											<span>' . number_format($value_01["valor_facturado"], 0, ',', '.') . '</span>
										</td>
									</tr>
								';
						}
					}
					$_cuerpo .= '<div class="form-group col-xs-12 col-sm-12 col-md-12"></div>';
					$_cuerpo_print .= '<tr><td colspan="3"></td></tr>';
				}
				$_cuerpo .= '
									</td>
								</tr>
							</tbody>
						</table>
					';
				$_cuerpo_print .= '
									</td>
								</tr>
							</tbody>
						</table>
					';
			}
			/***** FIN - CONTENIDO DEL CUERPO *****/

			/***** CONTENIDO DE LOS TOTALES *****/
			$_totales = '
					<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-alert-triangle"></span>
						</div>
						<div class="message">
							<strong>Atención!</strong><p>No se encontró información para los totales de la factura.</p>
						</div>
					</div>
				';
			$_totales_print = '';

			if ($info_factura["factura"]) {
				$totales = $info_factura["factura"];

				$_trm_content = '';
				if (isset($totales["trm"])) {
					$_trm_content = 'Tasas de cambio: [ ';
					$_flag_varios_trm = false;

					foreach ($totales["trm"] as $key => $value) {
						if ($_flag_varios_trm) {
							$_trm_content .= ' | ' . $value["MONEDA"] . ' (' . number_format($value["valor"], 2, ',', '.') . ') ';
						} else {
							$_trm_content .= ' ' . $value["MONEDA"] . ' (' . number_format($value["valor"], 2, ',', '.') . ') ';
							$_flag_varios_trm = true;
						}
					}
					$_trm_content .= ' ]';
				}

				// Se toma el valor en letras del total de la factura 
				$total_factura_numero = number_format($totales["total"], 0, ',', '');
				$factura_letras = $Internacional->getNumeroEnLetra($total_factura_numero, 0);
				$_total_factura_letras = $factura_letras["entero"];

				$_totales = '
						<table class="table table-condensed table-bordered">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-xs-12 col-sm-6 col-md-8">
											<div class="form-group col-xs-12 col-sm-12 col-md-12">
												<span>Observaciones</span>
												<span class="cell-detail-description">' . $_trm_content . '</span>
												<span class="cell-detail-description">' . $_impuestos . '</span>
											</div>
											<div class="col-xs-12 col-sm-12 col-md-12">
												<span>Valor en letras</span>
												<span class="cell-detail-description">' . $_total_factura_letras . ' PESOS M/C</span>
											</div>
										</div>
										<div class="col-xs-12 col-sm-3 col-md-2 text-right">
											<span>Subtotal</span>
											<span>Retefuente</span>
											<span>IVA</span>
											<span><strong>Total</strong></span>
										</div>
										<div class="col-xs-12 col-sm-3 col-md-2 text-right">
											<span>' . number_format($totales["subtotal"], 0, ',', '.') . '</span>
											<span>' . number_format($totales["retefuente"], 0, ',', '.') . '</span>
											<span>' . number_format($totales["iva"], 0, ',', '.') . '</span>
											<span><strong>' . number_format($totales["total"], 0, ',', '.') . '</strong></span>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					';

				$_totales_print = '
						<table class="table table-condensed table-borderless">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="form-group col-xs-12 col-sm-12 col-md-12">
											<span>Observaciones</span>
											<span class="cell-detail-description">' . $_trm_content . '</span>
											<span class="cell-detail-description">' . $_impuestos . '</span>
										</div>
										<div class="col-xs-12 col-sm-12 col-md-12">
											<span>Valor en letras</span>
											<span class="cell-detail-description">' . $_total_factura_letras . ' PESOS M/C</span>
										</div>
									</td>
									<td class="cell-detail text-right" style="vertical-align: text-top;">
										<span>Subtotal</span>
										<span>Retefuente</span>
										<span>IVA</span>
										<span><strong>Total</strong></span>
									</td>
									<td class="cell-detail text-right" style="vertical-align: text-top;">
										<span>' . number_format($totales["subtotal"], 0, ',', '.') . '</span>
										<span>' . number_format($totales["retefuente"], 0, ',', '.') . '</span>
										<span>' . number_format($totales["iva"], 0, ',', '.') . '</span>
										<span><strong>' . number_format($totales["total"], 0, ',', '.') . '</strong></span>
									</td>
								</tr>
							</tbody>
						</table>
					';
			}
			/***** FIN - CONTENIDO DE LOS TOTALES *****/
		}
		/***** FIN - CONTENIDO DE LA MAQUETA DE LA FACTURA *****/

		/***** CONTENIDO DE LOS ADJUNTOS DE LA FACTURA *****/
		$_adjuntos = '
				<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
					<div class="icon">
						<span class="mdi mdi-alert-triangle"></span>
					</div>
					<div class="message">
						<strong>Atención!</strong><p>No se registraron documentos para adjuntar a la factura.</p>
					</div>
				</div>
			';
		$_adjuntos_content = '';
		if (isset($info_factura["documentos_envio"][$_POST["id"]]) and $info_factura["documentos_envio"][$_POST["id"]]) {
			foreach ($info_factura["documentos_envio"] as $key => $value) {
				if ($value) {
					$_accordion_content = '';
					foreach ($value as $key_01 => $value_01) {
						if ((int)$value_01["soporte_facturacion"] == 1) {
							$_do = $value_01["do"];
							$_accordion_content .= '
									<tr>
										<td class="cell-detail">
											<span>' . $value_01["nombre"] . '</span>
										</td>
										<td class="actions">
											<a href="' . BASE_URL . '/public/files/internacional/documentos/' . $value_01["id_intr_proyecto"] . '/' . $value_01["url"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar">
												<span class="icon mdi mdi-download"></span>
											</a>
										</td>
									</tr>
								';
						}
					}
					if ($_accordion_content) {
						$_adjuntos_content .= '
								<div class="panel panel-default">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#accordion1" href="#collapse_' . $key . '">
												<i class="icon mdi mdi-chevron-down"></i> ' . $_do . '
											</a>
										</h4>
									</div>
									<div id="collapse_' . $key . '" class="panel-collapse collapse">
										<div class="panel-body">
											<div class="col-xs-12 col-sm-3 col-md-3"></div>
											<div class="col-xs-12 col-sm-6 col-md-6">
												<table id="table1" class="table table-striped">
													<tbody>
														' . $_accordion_content . '
													</tbody>
												</table>
											</div>
											<div class="col-xs-12 col-sm-3 col-md-3"></div>
										</div>
									</div>
								</div>
							';
					}
				}
			}
		}
		if ($_adjuntos_content) {
			// $_adjuntos = $_adjuntos_content;
			$_adjuntos = '
					<strong>Documentos Adjuntos</strong>
					<div id="accordion1" class="panel-group accordion">
						' . $_adjuntos_content . '
					</div>
				';
		}
		/***** FIN - CONTENIDO DE LOS ADJUNTOS DE LA FACTURA *****/

		/***** CONTENIDO DEL POPUP *****/
		// Variables para el formulario de gestión de la actividad
		$_tes_plazo_pagos = $cliente["tes_plazo_pagos"];

		$_num_factura = $info_factura["factura"]["num_factura"];

		$_fecha = $info_factura["factura"]["fecha"];
		if (!$info_factura["factura"]["fecha"]) {
			$_fecha = date('Y-m-d', $time);
		}

		$_fecha_vencimiento = $info_factura["factura"]["fecha_vencimiento"];
		if (!$info_factura["factura"]["fecha_vencimiento"]) {
			$_fecha_vencimiento = date('Y-m-d', $time);
			if ($_tes_plazo_pagos and $_tes_plazo_pagos > 0) {
				$nuevafecha = strtotime('+' . $_tes_plazo_pagos . ' day', strtotime($_fecha));
				$_fecha_vencimiento = date('Y-m-d', $nuevafecha);
			}
		}

		$_msg_content["content"] = '
				' . $_info_cliente . '
				' . $_actividades_proyecto . '
				<form id="form_instruccion">
					<input type="hidden" name="id_factura" value="' . $_POST["id"] . '">
					<div class="form-group col-xs-12 col-sm-6 col-md-3">
						<label>(*) # Factura:</label>
						<input type="text" class="form-control input-sm" name="factura" id="factura" value="' . $_num_factura . '" placeholder="# Factura">
					</div>
					<div class="form-group col-xs-12 col-sm-6 col-md-3">
						<label class="control-label">(*) Fecha Factura:</label>
						<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
							<input size="10" type="text" value="' . $_fecha . '" name="fecha_factura" id="fecha_factura" readonly="" class="form-control input-sm" placeholder="Fecha Factura">
							<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
						</div>
					</div>
					<div class="form-group col-xs-12 col-sm-6 col-md-3">
						<label class="control-label">(*) Fecha Vencimiento:</label>
						<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
							<input size="10" type="text" value="' . $_fecha_vencimiento . '" name="fecha_vencimiento" id="fecha_vencimiento" readonly="" class="form-control input-sm" placeholder="Fecha Vencimiento">
							<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
						</div>
					</div>
					<div class="form-group col-xs-12 col-sm-6 col-md-3">
						<label class="control-label">(*) Factura Recibida:</label><br />
						<input type="file" name="file_factura" id="file_factura" class="inputfile input-sm" placeholder="Buscar Archivo...">
						<label for="file_factura" class="btn-success input-xs"> 
							<i class="mdi mdi-upload"></i>
							<span>Buscar Archivo...</span>
						</label>
					</div>
				</form>
				<div class="row"></div>
				' . $_adjuntos . '
				<div class="panel panel-border panel-contrast">
					<div class="panel-heading panel-heading-contrast">
						Vista Preliminar Factura
						<div class="tools">
							<a href="javascript:" onclick="imprimirProforma()" class="cell-detail hint--top" data-hint="Imprimir"><span class="icon mdi mdi-print"></span></a>
						</div>
						<span class="panel-subtitle">Esta es la vista aproximada de la factura, <strong class="text-danger">por favor verifique la información</strong> antes de guardar los cambios.</span>
					</div>
					<div class="panel-body xs-mt-15">
						' . $_encabezado . '
						' . $_cuerpo . '
						' . $_totales . '

						<div id="proforma_print">
							' . $_encabezado_print . '
							' . $_cuerpo_print . '
							' . $_totales_print . '
						</div>
					</div>
				</div>
				<div class="row"></div>
			';
		break;

	case 'gestionar_factura_cliente':
		$_msg_control .= "Entro en la acción gestionar_factura_cliente.\n";
		$return["gestiona_actividad"] = false;

		$array = array();
		if ($_POST["factura"]) {
			$array["num_factura"] = $_POST["factura"];
		}
		$array["fecha"] = $_POST["fecha_factura"];
		$array["fecha_vencimiento"] = $_POST["fecha_vencimiento"];
		$Data->updateRegistro("cmx_intr_factura_cliente", $array, (int)$_POST["id_factura"]);
		// $return["datos_factura"] = $array;

		// Se genera la información del archivo de la factura
		$file = $_FILES["file_factura"];
		if ($file["error"] == 0) {
			$extension = $Internacional->get_extension_archivo($file["name"]);
			$archivo = $_POST["fecha_factura"] . "_" . $_POST["factura"] . "." . $extension;

			$tmp_file = $file["tmp_name"];
			$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
			if (move_uploaded_file($tmp_file, $archivo_temporal)) {
				// Se crean las carpetas de destino del archivo
				$carpeta_destino = "../public/files/internacional/facturas_clientes/";
				if (!file_exists($carpeta_destino)) {
					mkdir($carpeta_destino, 0777, true);
				}

				$destino = $carpeta_destino . "/" . $archivo;
				if (copy($archivo_temporal, $destino)) {
					$return["copy_file_result"] = true;

					// Se actualiza la información del archivo en la BD
					$array = array();
					$array["url"] = $archivo;
					$Data->updateRegistro("cmx_intr_factura_cliente", $array, (int)$_POST["id_factura"]);
					$return["gestiona_actividad"] = true;
				} else {
					$return["copy_file_result"] = false;
				}
			}
			if (file_exists($archivo_temporal)) {
				unlink($archivo_temporal);
			}
		} else {
			$return["copy_file_result"] = false;
		}
		break;

	case 'info_cartera':
		$_msg_control .= "Entro en la acción info_cartera.\n";

		$info_factura = $Internacional->getDatosCartera($_POST["id"]);
		$_array_result = $info_factura;

		/***** Contenido de la información del cliente *****/
		$cliente = $info_factura["cliente"];
		$_info_cliente = datosClienteEncabezado($cliente);
		/***** FIN - Contenido de la información del cliente *****/

		$_msg_content["title"] = 'Factura Pendiente';

		/***** CONTENIDO DE LA MAQUETA DE LA FACTURA *****/
		if ($info_factura["proyectos"]) {
			/***** CONTENIDO DEL ENCABEZADO *****/
			$_encabezado = '
					<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-alert-triangle"></span>
						</div>
						<div class="message">
							<strong>Atención!</strong><p>No se encontró información para el encabezado de la factura.</p>
						</div>
					</div>
				';
			if ($info_factura["cliente"]) {
				$encabezado = $info_factura["cliente"];
				$_encabezado = '
						<table class="table table-condensed table-bordered">
							<tbody>
								<tr>
									<td class="cell-detail">
										<span>' . $encabezado["nombre"] . '</span>
										<span class="cell-detail-description">' . $encabezado["documento"] . '-' . $encabezado["digito_verificacion"] . '</span>
										<span class="cell-detail-description">' . $encabezado["direccion"] . '</span>
										<span class="cell-detail-description">' . $encabezado["municipio"] . ' (' . $encabezado["pais"] . ')</span>
									</td>
								</tr>
							</tbody>
						</table>
					';
			}
			/***** FIN - CONTENIDO DEL ENCABEZADO *****/

			// /***** CONTENIDO DEL CUERPO *****/
			$_cuerpo = '
					<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-alert-triangle"></span>
						</div>
						<div class="message">
							<strong>Atención!</strong><p>No se encontró información para el cuerpo de la factura.</p>
						</div>
					</div>
				';
			if ($info_factura["proyectos"]) {
				$_cuerpo = '
						<table class="table table-condensed table-bordered">
							<tbody>
								<tr>
									<td class="cell-detail">
										<!-- ENCABEZADO DEL CUERPO DE LA FACTURA -->
										<div class="col-xs-12 col-sm-3 col-md-2 text-center">
											<span><strong>Cantidad</strong></span>
										</div>
										<div class="col-xs-12 col-sm-6 col-md-8 text-center">
											<span><strong>Descripción</strong></span>
										</div>
										<div class="col-xs-12 col-sm-3 col-md-2 text-center">
											<span><strong>Valor</strong></span>
										</div>
					';

				$_impuestos = '';
				foreach ($info_factura["proyectos"] as $key => $value) {
					$id_intr_proyecto = $value['ID_PROYECTO_INTERNACIONAL'];

					// Se pienta la información de DO del proyecto
					$_do = $value["do"];
					switch ($value["tipo_operacion"]) {
						case 'EXPORTACION':
							$tipo_proyecto = $value["tipo_operacion"];
							break;

						case 'IMPORTACION':
							$tipo_proyecto = $value["tipo_operacion"];
							break;

						default:
							$tipo_proyecto = "Transporte";
							break;
					}

					// Se pinta la información de los tramos del proyecto 
					$_tramo_origen = '';
					$_tramo_destino = '';
					$_guias = '';
					if (isset($info_factura["tramos"][$value['ID_PROYECTO_INTERNACIONAL']]["tramos"]["rowsData"])) {
						$_tramo_origen = ' | Origen: [ ';
						$_flag_varios_origen = false;
						$_tramo_destino = ' | Destino: [ ';
						$_flag_varios_destino = false;
						$_guias = ' | Guías: [ ';
						$_flag_guias = false;
						foreach ($info_factura["tramos"][$value['ID_PROYECTO_INTERNACIONAL']]["tramos"]["rowsData"] as $key_01 => $value_01) {
							if ($value_01["tipo_tramo"] == "Cargue") {
								if ($_flag_varios_origen) {
									$_tramo_origen .= ' | ' . $value_01["municipio"] . ' ';
								} else {
									$_tramo_origen .= ' ' . $value_01["municipio"] . ' ';
									$_flag_varios_origen = true;
								}
							} else {
								if ($_flag_varios_destino) {
									$_tramo_destino .= ' | ' . $value_01["municipio"] . ' ';
								} else {
									$_tramo_destino .= ' ' . $value_01["municipio"] . ' ';
									$_flag_varios_destino = true;
								}

								if ($_flag_guias) {
									$_guias .= ' | ' . $value_01["guia"] . ' ';
								} else {
									$_guias .= ' ' . $value_01["guia"] . ' ';
									$_flag_guias = true;
								}

								// // Se buscan los deliveries de la guía 
								$_deliveries = '';
								if (isset($info_factura["tramos"][$value['ID_PROYECTO_INTERNACIONAL']]["material"][$value_01[0]][0]["rowsData"])) {
									$_flag_varios_delivery = false;
									$_delivery_content = '';
									foreach ($info_factura["tramos"][$value['ID_PROYECTO_INTERNACIONAL']]["material"][$value_01[0]][0]["rowsData"] as $key_02 => $value_02) {
										if ($value_02["delivery"]) {
											if ($_flag_varios_delivery) {
												$_delivery_content .= ' | ' . $value_02["delivery"] . ' ';
											} else {
												$_delivery_content .= ' ' . $value_02["delivery"] . ' ';
												$_flag_varios_delivery = true;
											}
										}
									}
									if ($_delivery_content) {
										$_deliveries = '<small>Delivery: [' . $_delivery_content . ']</small>';
									}
								}
							}
						}
						$_tramo_origen .= ' ]';
						$_tramo_destino .= ' ]';
						$_guias .= $_deliveries . ' ]';
					}

					// Se describe la ofeta comercial aprobada por el cliente 
					$_oferta_comercial = "Oferta Aprobada: [ " . number_format($value["VALOR_OFERTA"], 2, ',', '.') . " " . $value["MONEDA_OFERTA"] . " ]";

					// Se pregunta si se debe mostrar conceptos del proyecto
					$_conceptos = '';
					if (isset($info_factura["conceptos"][$value['ID_PROYECTO_INTERNACIONAL']][1])) {
						$_flag_varios_conceptos = false;
						foreach ($info_factura["conceptos"][$value['ID_PROYECTO_INTERNACIONAL']][1] as $key_01 => $value_01) {
							if ($value_01["fct_muestra_concepto"] == 1) {
								if ($_flag_varios_conceptos) {
									$_conceptos .= ' | ' . $value_01["nombre"] . ' ';
								} else {
									$_conceptos = 'Conceptos: [';
									$_conceptos .= ' ' . $value_01["nombre"] . ' ';
									$_flag_varios_conceptos = true;
								}
							}
						}
						if ($_conceptos) {
							$_conceptos .= ' ]';
						}
					}

					if (isset($info_factura["impuestos"][$value['ID_PROYECTO_INTERNACIONAL']])) {
						$_impuestos .= '[ <strong>' . $_do . '</strong> ] Impuestos: [ ';
						$_flag_varios_impuestos = false;
						foreach ($info_factura["impuestos"][$value['ID_PROYECTO_INTERNACIONAL']] as $key_01 => $value_01) {
							if ($_flag_varios_impuestos) {
								$_impuestos .= ' | ' . number_format($value_01["valor"], 2, ',', '.') . ' ' . $value_01["MONEDA"];
							} else {
								$_impuestos .= ' ' . number_format($value_01["valor"], 2, ',', '.') . ' ' . $value_01["MONEDA"];
								$_flag_varios_impuestos = true;
							}
						}
						$_impuestos .= ' ]<br />';
					}

					$_cuerpo .= '
							<div class="col-xs-12 col-sm-3 col-md-2 text-center">
								<span>1</span>
							</div>
							<div class="col-xs-12 col-sm-6 col-md-8">
								<span>[ ' . $_do . " ] " . $tipo_proyecto . $_tramo_origen . $_tramo_destino . $_guias . '</span>
								<span class="cell-detail-description">' . $_oferta_comercial . '</span>
								<span class="cell-detail-description">' . $_conceptos . '</span>
								<span class="cell-detail-description">' . $value["comodin_facturacion"] . '</span>
							</div>
							<div class="col-xs-12 col-sm-3 col-md-2 text-right">
								<span>' . number_format($value["valor_facturado"], 0, ',', '.') . '</span>
							</div>
							<div class="row"></div>
						';

					// Se pregunta si el proyecto tiene agenciamiento 
					if ((int)$value["valor_agenciamiento"] > 0) {
						$_cuerpo .= '
								<div class="col-xs-12 col-sm-3 col-md-2 text-center">
									<span></span>
								</div>
								<div class="col-xs-12 col-sm-6 col-md-8">
									<span>[ ' . $_do . ' ] Agenciamiento</span>
								</div>
								<div class="col-xs-12 col-sm-3 col-md-2 text-right">
									<span>' . number_format($value["valor_agenciamiento"], 0, ',', '.') . '</span>
								</div>
								<div class="row"></div>
							';
					}

					// Se agrega los impuestos incurridos en el proyecto
					if (isset($info_factura["impuestos"][$value['ID_PROYECTO_INTERNACIONAL']]) and $info_factura["impuestos"][$value['ID_PROYECTO_INTERNACIONAL']]) {
						foreach ($info_factura["impuestos"][$value['ID_PROYECTO_INTERNACIONAL']] as $key_01 => $value_01) {
							$_cuerpo .= '
									<div class="col-xs-12 col-sm-3 col-md-2 text-center">
										<span></span>
									</div>
									<div class="col-xs-12 col-sm-6 col-md-8">
										<span>[ ' . $_do . ' ] ' . $value_01["nombre"] . ' - ' . $value_01["descripcion"] . '</span>
									</div>
									<div class="col-xs-12 col-sm-3 col-md-2 text-right">
										<span>' . number_format($value_01["valor_facturado"], 0, ',', '.') . '</span>
									</div>
									<div class="row"></div>
								';
							$_cuerpo_print .= '
									<tr>
										<td class="cell-detail text-center">
											<span></span>
										</td>
										<td class="cell-detail">
											<span>[ ' . $_do . ' ] ' . $value_01["nombre"] . ' - ' . $value_01["descripcion"] . '</span>
										</td>
										<td class="cell-detail text-right">
											<span>' . number_format($value_01["valor_facturado"], 0, ',', '.') . '</span>
										</td>
									</tr>
								';
						}
					}

					// Se agrega los sobrecostos incurridos en el proyecto
					if (isset($info_factura["sobrecostos"][$value['ID_PROYECTO_INTERNACIONAL']]) and $info_factura["sobrecostos"][$value['ID_PROYECTO_INTERNACIONAL']]) {
						foreach ($info_factura["sobrecostos"][$value['ID_PROYECTO_INTERNACIONAL']] as $key_01 => $value_01) {
							$_cuerpo .= '
									<div class="col-xs-12 col-sm-3 col-md-2 text-center">
										<span></span>
									</div>
									<div class="col-xs-12 col-sm-6 col-md-8">
										<span>[ ' . $_do . ' ] Sobrecosto - ' . $value_01["nombre"] . ' - ' . $value_01["descripcion"] . '</span>
									</div>
									<div class="col-xs-12 col-sm-3 col-md-2 text-right">
										<span>' . number_format($value_01["valor_facturado"], 0, ',', '.') . '</span>
									</div>
									<div class="row"></div>
								';
						}
					}
					$_cuerpo .= '<div class="form-group col-xs-12 col-sm-12 col-md-12"></div>';
				}
				$_cuerpo .= '
									</td>
								</tr>
							</tbody>
						</table>
					';
			}
			/***** FIN - CONTENIDO DEL CUERPO *****/

			/***** CONTENIDO DE LOS TOTALES *****/
			$_totales = '
					<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-alert-triangle"></span>
						</div>
						<div class="message">
							<strong>Atención!</strong><p>No se encontró información para los totales de la factura.</p>
						</div>
					</div>
				';
			if ($info_factura["factura"]) {
				$totales = $info_factura["factura"];

				$_trm_content = '';
				if (isset($totales["trm"])) {
					$_trm_content = 'Tasas de cambio: [ ';
					$_flag_varios_trm = false;

					foreach ($totales["trm"] as $key => $value) {
						if ($_flag_varios_trm) {
							$_trm_content .= ' | ' . $value["MONEDA"] . ' (' . number_format($value["valor"], 2, ',', '.') . ') ';
						} else {
							$_trm_content .= ' ' . $value["MONEDA"] . ' (' . number_format($value["valor"], 2, ',', '.') . ') ';
							$_flag_varios_trm = true;
						}
					}
					$_trm_content .= ' ]';
				}

				// Se toma el valor en letras del total de la factura 
				$total_factura_numero = number_format($totales["total"], 0, ',', '');
				$factura_letras = $Internacional->getNumeroEnLetra($total_factura_numero, 0);
				$_total_factura_letras = $factura_letras["entero"];

				$_totales = '
						<table class="table table-condensed table-bordered">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="col-xs-12 col-sm-6 col-md-8">
											<div class="form-group col-xs-12 col-sm-12 col-md-12">
												<span>Observaciones</span>
												<span class="cell-detail-description">' . $_trm_content . '</span>
												<span class="cell-detail-description">' . $_impuestos . '</span>
											</div>
											<div class="col-xs-12 col-sm-12 col-md-12">
												<span>Valor en letras</span>
												<span class="cell-detail-description">' . $_total_factura_letras . ' PESOS M/C</span>
											</div>
										</div>
										<div class="col-xs-12 col-sm-3 col-md-2 text-right">
											<span>Subtotal</span>
											<span>Retefuente</span>
											<span>IVA</span>
											<span><strong>Total</strong></span>
										</div>
										<div class="col-xs-12 col-sm-3 col-md-2 text-right">
											<span>' . number_format($totales["subtotal"], 0, ',', '.') . '</span>
											<span>' . number_format($totales["retefuente"], 0, ',', '.') . '</span>
											<span>' . number_format($totales["iva"], 0, ',', '.') . '</span>
											<span><strong>' . number_format($totales["total"], 0, ',', '.') . '</strong></span>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					';
			}
			/***** FIN - CONTENIDO DE LOS TOTALES *****/
		}
		/***** FIN - CONTENIDO DE LA MAQUETA DE LA FACTURA *****/

		/***** CONTENIDO DEL POPUP *****/
		// Variables para el formulario de gestión de la actividad
		$_tes_plazo_pagos = $cliente["tes_plazo_pagos"];

		$_num_factura = $info_factura["factura"]["num_factura"];

		$_fecha = $info_factura["factura"]["fecha"];
		if (!$info_factura["factura"]["fecha"]) {
			$_fecha = date('Y-m-d', $time);
		}

		$_fecha_vencimiento = $info_factura["factura"]["fecha_vencimiento"];
		if (!$info_factura["factura"]["fecha_vencimiento"]) {
			$_fecha_vencimiento = date('Y-m-d', $time);
			if ($_tes_plazo_pagos and $_tes_plazo_pagos > 0) {
				$nuevafecha = strtotime('+' . $_tes_plazo_pagos . ' day', strtotime($_fecha));
				$_fecha_vencimiento = date('Y-m-d', $nuevafecha);
			}
		}

		$_msg_content["content"] = '
				' . $_info_cliente . '
				<div class="row"></div>
				<div class="panel panel-border panel-contrast">
					<div class="panel-heading panel-heading-contrast">
						Vista Factura
						<div class="tools"></div>
					</div>
					<div class="panel-body xs-mt-15">
						' . $_encabezado . '
						' . $_cuerpo . '
						' . $_totales . '
					</div>
				</div>
				<div class="row"></div>
			';
		break;

	case 'form_pago_cartera':
		$_msg_control .= "Entro en la acción form_pago_cartera.\n";
		$table_content = '';

		$info_factura = $Internacional->getDatosInternacionalCarteraCliente($_POST["id"]);
		$_array_result = $info_factura;

		if ($info_factura["general"]) {
			$cliente = $info_factura["general"][0];
			$_msg_content["title"] = 'Registrar pago de facturas - ' . $cliente["sigla"];

			$table_content = '
					<div class="table-responsive noSwipe col-xs-12 col-sm-12 col-md-12">
						<table id="table1" class="table table-striped table-hover table-condensed table-fw-widget" data-page-length="50">
							<thead>
								<tr>
									<th>
										<div class="be-checkbox">
											<input class="check_todos" id="check_todos" type="checkbox">
											<label for="check_todos"></label>
										</div>
									</th>
									<th>Factura</th>
									<th>Cant. de DO´s</th>
									<th>DO´s</th>
									<th>Valor</th>
									<th>Vencimiento</th>
									<th></th>
								</tr>
							</thead>
								<tbody>
				';
			// Se pinta la tabla de facturas del cliente
			foreach ($info_factura["general"] as $key => $value) {
				$_do = "";
				if ($info_factura["do"][$value['id']]) {
					foreach ($info_factura["do"][$value['id']] as $key_01 => $value_01) {
						$_do .= '<span>' . $value_01["do"] . '</span>';
					}
				}

				$table_content .= '
						<tr>
							<td>
								<div class="be-checkbox">
									<input type="checkbox" class="check_factura" id="check_factura_' . $value['id'] . '" data-id_factura="' . $value['id'] . '" data-total="' . $value["total"] . '">
									<label for="check_factura_' . $value['id'] . '"></label>
								</div>
							</td>
							<td class="cell-detail">
								<span>' . $value["num_factura"] . '</span>
								<span class="cell-detail-description">' . $value["fecha"] . '</span>
								<span class="cell-detail-description">' . $value["num_proforma"] . '</span>
							</td>
							<td class="cell-detail">
								<span class="label label-default">' . $value["CANT_DO"] . '</span>
							</td>
							<td class="cell-detail">
								' . $_do . '
							</td>
							<td class="cell-detail text-right">
								<span>$ ' . number_format($value["total"], 0, ",", ".")  . '</span>
							</td>
							<td class="cell-detail text-center">
								<span>' . $value["fecha_vencimiento"]  . '</span>
							</td>
							<td class="actions">
								<a href="javascript:" onclick="verDatosCartera(' . $value['id'] . ')" class="cell-detail hint--top-left" data-hint="Ver Factura"><span class="icon mdi mdi-eye" data-toggle="modal" data-target="#ver_factura"></span></a>
							</td>
						</tr>
					';
			}
			$table_content .= '
									</tbody>
								</table>
							</div>
						</div>
					</div>
				';

			/***** CONTENIDO DEL POPUP *****/
			$_fecha = date('Y-m-d', $time);
			$_msg_content["content"] = '
					<form id="form_cartera">
						<div class="form-group col-xs-12 col-sm-3 col-md-3">
							<label class="control-label">(*) Fecha Pago:</label>
							<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
								<input size="10" type="text" value="' . $_fecha . '" name="fecha_pago" id="fecha_pago" readonly="" class="form-control input-sm" placeholder="Fecha Pago">
								<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
							</div>
						</div>
						<div class="form-group col-xs-12 col-sm-3 col-md-3">
							<label class="control-label">(*) Recibo de Caja:</label>
							<input type="text" class="form-control input-sm" name="recibo_caja" id="recibo_caja" placeholder="Recibo de Caja">
						</div>
						<div class="form-group col-xs-12 col-sm-3 col-md-3">
							<label class="control-label">(*) Valor Pagado:</label>
							<input type="text" class="form-control input-sm" name="valor_pagado" id="valor_pagado" placeholder="Valor Pagado" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)">
						</div>
						<div class="form-group col-xs-12 col-sm-3 col-md-3">
							<label class="control-label">(*) Adjunto:</label><br>
							<input type="file" name="recibo_caja_file" id="recibo_caja_file" class="inputfile">
							<label for="recibo_caja_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
						</div>
					</form>
					<div class="col-xs-12 col-sm-12 col-md-12 text-center">
						<input type="hidden" name="id_facturas" id="id_facturas">
						<input type="hidden" name="total_facturas" id="total_facturas">
						<h3>Total Facturas:</h3>
						<h4 id="total_facturas_text">$0</h4>
					</div>
					' . $table_content . '
				';
		}

		break;

	case 'pago_cartera':
		$_msg_control .= "Entro en la acción pago_cartera.\n";

		if (isset($_FILES["url"]) and $_FILES["url"]) {
			// Se saca el nombre del archivo
			$file = $_FILES["url"];
			// Se guarda el archivo de la cotización del sobrecosto
			if ($file["error"] == 0) {
				$pago = "RBC-" . $time;
				$array = array();
				$array["numero_pago"] = $pago;
				$array["fecha_pago"] = $_POST["fecha_pago"];
				$array["recibo_caja"] = $_POST["recibo_caja"];
				$array["valor_pagado"] = (float)$_POST["valor_pagado"];
				$id_pago = $Data->setRegistro("cmx_intr_pago_cartera", $array);

				if ($id_pago) {
					$sql = '
							UPDATE cmx_intr_factura_cliente
							SET id_pago = ' . $id_pago . ', cartera = "Pagado"
							WHERE id IN (' . $_POST["id_facturas"] . '0);
						';
					if (!$Data->ejecuteRegistro($sql)) {
						$_msg_error .= "<p>Error al actualizar el pago en las facturas.</p>";
					}

					// Se guarda el archivo en el servidor
					$extension = $Internacional->get_extension_archivo($file["name"]);
					$tmp_file = $file["tmp_name"];
					$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
					if (move_uploaded_file($tmp_file, $archivo_temporal)) {
						/***** ARCHIVO DE LA COTIZACIÓN *****/
						// Se crean las carpetas de destino del archivo
						$carpeta_destino = "../public/files/internacional/recibo_caja/" . $id_pago;
						if (!file_exists($carpeta_destino)) {
							mkdir($carpeta_destino, 0777, true);
						}

						$archivo_destino = $id_pago . "-" . $pago . "." . $extension;
						$destino = $carpeta_destino . "/" . $archivo_destino;
						if (copy($archivo_temporal, $destino)) {
							$return["copy_file_result"] = true;
							// Se guarda el registro del archivo en la base de datos 
							$array = array();
							$array["url"] = $archivo_destino;
							$Data->updateRegistro("cmx_intr_pago_cartera", $array, (int)$id_pago);
						} else {
							$return["copy_file_result"] = false;
						}
					}
					if (file_exists($archivo_temporal)) {
						unlink($archivo_temporal);
					}
				}
			} else {
				$return["copy_file_result"] = false;
			}
			if (!$return["copy_file_result"]) {
				$_msg_error .= '<p>Error al intentar generar el archivo en el servidor para realizar el registro.</p>';
			}
		} else {
			$_msg_error .= '<p>Archivo del Recibo de Caja no encontrado para realizar el registro.</p>';
		}
		break;

	case 'table_cartera_pagada':
		$_msg_control .= "Entro en la acción table_cartera_pagada.\n";

		$arrayCartera = $Internacional->getDatosInternacionalCarteraPagada($_POST["year"]);
		/* 		print_r($arrayCartera);
		exit(); */
		$table_content = '
				<table id="table1" class="table table-striped table-hover table-fw-widget" data-page-length="50">
					<thead>
						<tr class="nexos-encabezado">
							<th>Cliente</th>
							<th>Documento</th>
							<th class="col-xs-1 col-sm-1 col-md-2">Valor Facturado</th>
							<th class="col-xs-1 col-sm-1 col-md-2">Valor Pagado</th>
							<th class="col-xs-1 col-sm-1 col-md-1"></th>
						</tr>
					</thead>
						<tbody>
			';

		if ($arrayCartera["general"]) {
			foreach ($arrayCartera["general"] as $key => $value) {
				$total_pagado = 0;
				if ($arrayCartera["pagado"][$value['id']]) {
					$total_pagado = $arrayCartera["pagado"][$value['id']];
				}

				$table_content .= '
						<tr>
							<td class="cell-detail">
								<span>' . $value["sigla"] . '</span>
								<span class="cell-detail-description">' . $value["cod_cliente"] . '</span>
							</td>
							<td class="cell-detail">
								<span>' . $value["DOCUMENTO"] . '</span>
								<span class="cell-detail-description">' . $value["regimen"] . '</span>
							</td>
							<td class="cell-detail text-right">
								<span>$ ' . number_format($value["TOTAL_FACTURADO"], 2, ",", ".")  . '</span>
							</td>
							<td class="cell-detail text-right">
								<span>$ ' . number_format($total_pagado, 2, ",", ".")  . '</span>
							</td>
							<td class="actions">
								<a href="javascript:" onclick="verPagosRegistrados(' . $value['id'] . ')" class="cell-detail hint--top-left" data-hint="Ver Pagos"><span class="icon mdi mdi-eye" data-toggle="modal" data-target="#ver_cartera"></span></a>
							</td>
						</tr>
					';
			}
		}

		$table_content .= '
					</tbody>
				</table>
			';
		$_msg_content = $table_content;
		break;

	case 'form_cartera_pagada':
		$_msg_control .= "Entro en la acción form_cartera_pagada.\n";

		$info_factura = $Internacional->getDatosInternacionalCarteraPagadaCliente($_POST["id"], $_POST["year"]);
		$_array_result = $info_factura;
		$cliente = $info_factura["general"][0];
		$_msg_content["title"] = 'Resumen año ' . $_POST["year"] . ' de pagos ' . $cliente["CLIENTE"] . '.';

		$_content = '
				<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
					<div class="icon"><span class="mdi mdi-close"></span></div>
					<div class="message">
						<strong>Atención!</strong>
						<p>No se ha registrado información de pagos para el cliente <strong>' . $cliente["CLIENTE"] . '</strong> en el año <strong>' . $_POST["year"] . '</strong>...</p>
					</div>
				</div>
			';

		if ($info_factura["general"]) {
			$_accordion_content = '';
			foreach ($info_factura["general"] as $key => $value) {
				// Se busca las facturas relacionadas al pago registrado
				$_content_facturas = '
						<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
							<div class="icon"><span class="mdi mdi-close"></span></div>
							<div class="message">
								<strong>Atención!</strong>
								<p>No se encontro facturas relacionadas con el pago <strong>' . $value["recibo_caja"] . ' (' . $value["numero_pago"] . ')</strong>...</p>
							</div>
						</div>
					';

				$_accordion_content_facturas = '';
				if ($info_factura["facturas"][$value['id']]) {
					foreach ($info_factura["facturas"][$value['id']] as $key_01 => $value_01) {
						$_content_dos = '
								<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
									<div class="icon"><span class="mdi mdi-close"></span></div>
									<div class="message">
										<strong>Atención!</strong>
										<p>No se encontro do`s relacionados con la factura <strong>' . $value_01["num_factura"] . ' (' . $value_01["num_proforma"] . ')</strong>...</p>
									</div>
								</div>
							';

						// Se busca la información de los DO's
						if ($info_factura["do"][$value['id']][$value_01['id']]) {
							$_content_dos = '
									<div class="table-responsive noSwipe col-xs-12 col-sm-12 col-md-12">
										<table id="table" class="table table-hover table-condensed">
											<thead>
												<tr>
													<th>DO</th>
													<th>Valor Oferta Comercial</th>
													<th>Valor Oferta Comercial en COP</th>
													<th></th>
												</tr>
											</thead>
											<tbody>
								';
							foreach ($info_factura["do"][$value['id']][$value_01['id']] as $key_02 => $value_02) {
								$_content_dos .= '
										<tr>
											<td class="cell-detail">
												<span>' . $value_02["do"] . '</span>
											</td>
											<td class="cell-detail text-right">
											 	<span>' . number_format($value_02["valor"], 0, ",", ".") . ' (' . $value_02["codigo"] . ')</span>
											</td>
											<td class="cell-detail text-right">
												<span>$' . number_format($value_02["VALOR_OFERTA_PESOS"], 0, ",", ".") . '</span>
											</td>
											<td class="actions">
												<a href="' . BASE_URL . 'public/files/internacional/oferta_comercial/' . $value_02["id_intr_proyecto"] . '/' . $value_02["url"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar Oferta Comercial">
													<span class="icon mdi mdi-download"></span>
												</a>
											</td>
										</tr>
									';
							}
							$_content_dos .= '
											</tbody>
										</table>
									</div>
								';
						}

						// Se valida si se adjuntó alguna factura de venta 
						$_btn_factura = '';
						if ($value_01["url"]) {
							$_btn_factura = '
									<a href="' . BASE_URL . 'public/files/internacional/facturas_clientes/' . $value_01["url"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar Factura">
				 						<span class="icon mdi mdi-download"></span>
				 					</a>
								';
						}

						$_accordion_content_facturas .= '
								<div class="panel panel-default panel-border-color panel-border-color-default">
									<div class="panel-heading">
										<div class="tools">' . $_btn_factura . '</div>
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#accordion2" href="#accordion_facturas_' . $value['id'] . '_' . $value_01['id'] . '" class="collapsed" aria-expanded="false"><i class="icon mdi mdi-chevron-down"></i> 
												' . $value_01["num_factura"] . ' <small><strong>' . $value_01["num_proforma"] . '</strong></small>
												<span class="panel-subtitle">
													# DO`s: <strong>' . $value_01["CANT_DO"] . '</strong> | 
													Fecha Factura: <strong>' . $value_01["fecha"] . '</strong> | 
													Fecha Vencimiento: <strong>' . $value_01["fecha_vencimiento"] . '</strong>
													Total Factura: <strong>$' . number_format($value_01["total"], 0, ",", ".") . '</strong>
												</span>
											</a>
										</h4>
									</div>
									<div id="accordion_facturas_' . $value['id'] . '_' . $value_01['id'] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
										<div class="panel-body">' . $_content_dos . '</div>
									</div>
								</div>
							';
					}
					$_content_facturas = '
							<h4>Facturas</h4>
							<div id="accordion2" class="panel-group accordion">
								' . $_accordion_content_facturas . '
							</div>
						';
				}
				// FIN - Se busca las facturas relacionadas al pago registrado

				$_btn_pago = '';
				if ($value["url"]) {
					$_btn_pago = '
							<a href="' . BASE_URL . 'public/files/internacional/recibo_caja/' . $value['id'] . '/' . $value["url"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar Recibo de Caja">
		 						<span class="icon mdi mdi-download"></span>
		 					</a>
						';
				}

				$_accordion_content .= '
						<div class="panel panel-default panel-border-color panel-border-color-default">
							<div class="panel-heading">
								<div class="tools">' . $_btn_pago . '</div>
								<h4 class="panel-title">
									<a data-toggle="collapse" data-parent="#accordion1" href="#accordion_pago_' . $value['id'] . '" class="collapsed" aria-expanded="false"><i class="icon mdi mdi-chevron-down"></i> ' . $value["recibo_caja"] . ' <small><strong>' . $value["numero_pago"] . '</strong> | Fecha Pagado: <strong>' . $value["fecha_pago"] . '</strong></small>
										<span class="panel-subtitle">
											# Facturas: <strong>' . $value["CANT_FACTURAS"] . '</strong> | 
											Total facturado: <strong>$' . number_format($value["TOTAL_FACTURADO"], 0, ",", ".") . '</strong> | 
											Total Pagado: <strong>$' . number_format($value["valor_pagado"], 0, ",", ".") . '</strong>
										</span>
									</a>
								</h4>
							</div>
							<div id="accordion_pago_' . $value['id'] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
								<div class="panel-body">' . $_content_facturas . '</div>
							</div>
						</div>
					';
			}

			$_content = '
					<h4>Pagos</h4>
					<div id="accordion1" class="panel-group accordion">
						' . $_accordion_content . '
					</div>
				';
		}
		$_msg_content["content"] = $_content;
		break;

	default:
		$_msg_error .= "Error en la selección del action.\n";
		break;
}

$return["control"] = $_msg_control;
if ($_msg_error) {
	$return["error"] = $_msg_error;
}
if ($_array_result) {
	$return["result"] = $_array_result;
}
if ($_msg_content) {
	$return["content"] = $_msg_content;
}

echo json_encode($return);

function cotizacionesContent($array, $div, $id_perfil)
{
	$Internacional = new internacionalModel;
	$arrayPermisos = $Internacional->permisosPerfil($id_perfil, 59);
	$_permisos = $arrayPermisos;

	$cotizacion_content = '';
	$i = 1;
	$_accordion_color = "panel-border-color-warning";

	foreach ($array as $key_01 => $value_01) {
		$_checked = "";
		$_panel_color = "";
		if ($value_01["estado"] == 1) {
			$_panel_color = 'panel-border-color panel-border-color-success';
			$_accordion_color = "panel-border-color-success";
			$_checked = "checked";
		}

		$_check_autoriza = '';
		if ($id_perfil == 13 or $id_perfil == 1 or $id_perfil == 25 or $id_perfil == 29 or $id_perfil == 31) {
			$_check_autoriza = '
					<div class="form-group col-xs-12">
						<div class="be-checkbox inline">
							<input class="selecciona_cotizacion check_' . $div . '" id="check_' . $div . '_' . $i . '" type="checkbox" onclick="flag_cotizacion(\'check_' . $div . '\',\'check_' . $div . '_' . $i . '\')" ' . $_checked . '>
							<label for="check_' . $div . '_' . $i . '">Seleccionar</label>
						</div>
					</div>';
		}

		$_btn_eliminar = '';
		if ($_permisos["eliminar"] == 1) {
			$_btn_eliminar = '
					<a href="javascript:" onclick="quitarCotizacion(\'' . $div . '-' . $value_01["id_intr_proyecto"] . '-' . $value_01["id_concepto"] . '-' . $value_01[0] . '\')" class="hint--top-left borra_cotizacion" data-hint="Quitar Cotización ' . $i . '" 
						id="' . $div . '-' . $value_01["id_intr_proyecto"] . '-' . $value_01["id_concepto"] . '-' . $value_01[0] . '"
					>
						<span class="icon mdi mdi-delete"></span>
					</a>
				';
		}

		$_btn_actualizar = '';
		if ($_permisos["editar"] == 1) {
			$_btn_actualizar = '
					<a href="javascript:" onclick="actualizarCotizacion(\'' . $div . '-' . $value_01["id_intr_proyecto"] . '-' . $value_01["id_concepto"] . '-' . $value_01[0] . '-' . $value_01["descripcion"] . '\')" 
					class="hint--top-left borra_cotizacion" data-hint="Actualiza Cotización ' . $i . '" 
						id="' . $div . '-' . $value_01["id_intr_proyecto"] . '-' . $value_01["id_concepto"] . '-' . $value_01[0] . '-' . $value_01["descripcion"] . '">
						<span class="icon mdi mdi-edit btn-xs"></span>
					</a>
				';
		}

		$cotizacion_content .= '
				<div class="col-xs-12 col-sm-3 col-md-3 panel-body panel-body-contrast div_' . $div . '" id="div_' . $div . '_' . $i . '">
					<div class="row">
						<div class="panel-heading ' . $_panel_color . ' div_header_' . $div . '" id="div_header_' . $div . '_' . $i . '">
							<div class="tools">
								<a href="' . BASE_URL . 'public/files/internacional/cotizaciones/' . $_POST["id"] . '/' . $div . '/' . $value_01["url"] . '" target="_blank" class="hint--top-left" data-hint="Descargar Cotización ' . $i . '">
									<span class="icon mdi mdi-download"></span>
								</a>
							</div>
							<div class="tools">
								' . $_btn_eliminar . '
								
							</div>
							<div class="tools">
								' . $_btn_actualizar . '
							</div>
							<span class="panel-subtitle"><strong>Cotización ' . $i . '</strong></span>
						</div>
						<div class="form-group col-xs-12">
							<input type="hidden" id="' . $div . '_id_' . $i . '" value="' . $value_01[0] . '">
							<input type="text" class="form-control input-xs" placeholder="Proveedor" value="' . $value_01["proveedor"] . '" readonly>
						</div>
						<div class="col-xs-12">
							<input type="text" id="monedaco' . $value_01[0] . '" class="form-control input-xs" placeholder="Valor Cotización" value="' . number_format($value_01["valor"], 2, ',', '.') . '"  onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)"   >
						</div>
						<div class="col-xs-12">
							' . $Internacional->getHtmlSelectMonedas_xs("id_moneda", $value_01["id_moneda"], "disabled") . '
						</div>
						<div class="form-group col-xs-12">
							<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group" style="padding: 0">
								<input size="10" type="text" value="' . $value_01["fecha_cotizacion"] . '" readonly="" class="form-control input-xs" placeholder="Fecha Cotización">
								<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
							</div>
						</div>
						<div class="form-group col-xs-12">
							<input type="text"  class="form-control input-sm" value="' . $value_01['hora_cotizacion'] . '" disabled="disabled">
						</div>
						<div class="col-xs-12">
							<textarea id="descri' . $value_01[0] . '" class="form-control input-xs" placeholder="Descripción">' . $value_01["descripcion"] . '</textarea>
						</div>
						' . $_check_autoriza . '
					</div>
				</div>
			';
		$i++;
	}

	$return["content"] = $cotizacion_content;
	$return["color"] = $_accordion_color;
	$return["i"] = $i;

	return $return;
}

function cotizacionFormContent($div, $i)
{
	$Internacional = new internacionalModel;
	$cotizacion_content = '
			<div class="col-xs-12 col-sm-3 col-md-3 panel-body panel-body-contrast">
				<div class="row">
					<form id="form_' . $div . '">
						<div class="panel-heading">
							<span class="panel-subtitle"><strong id="' . $div . '_cotizacion">Cotización ' . $i . '</strong></span>
						</div>
						<div class="col-xs-12">
							' . $Internacional->getHtmlSelectProveedores_xs("slct_" . $div . "_proveedor", $div, " onchange=\"buscaProveedor(this,'" . $div . "')\"") . '
							<input type="hidden" name="' . $div . '_proveedor" id="' . $div . '_proveedor" placeholder="Proveedor">
						</div>
						<div class="col-xs-12">
						</div>
						<div class="col-xs-12">
							<input type="text" class="form-control input-xs" name="' . $div . '_valor" id="' . $div . '_valor" placeholder="Valor Cotización" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)">
						</div>
						<div class="col-xs-12">
							' . $Internacional->getHtmlSelectMonedas_xs($div . "_moneda", $div, "") . '
						</div>
						<div class="col-xs-12">
						<!--	<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
								<input size="10" type="text" value="' . date('Y-m-d') . '" name="' . $div . '_fecha" id="' . $div . '_fecha" readonly="" class="form-control input-xs" placeholder="Fecha Cotización">
								<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
							</div> -->
							<input size="10" type="text" value="' . date('Y-m-d') . '" name="' . $div . '_fechai" id="' . $div . '_fechai" readonly="" class="form-control input-xs" placeholder="Fecha Cotización">
						</div>

						<div class="col-xs-12">
							<input type="text" class="form-control input-sm" value="' . date('H:i:s') . '" id="' . $div . '_horai"  disabled="disabled">
						</div>

						<div class="col-xs-12">
							<textarea class="form-control input-xs" name="' . $div . '_descripcion" id="' . $div . '_descripcion" placeholder="Descripción"></textarea>
						</div>
						<div class="col-xs-12">
							<input type="file" name="' . $div . '_file" id="' . $div . '_file" class="inputfile input-xs" placeholder="Buscar Archivo...">
							<label for="' . $div . '_file" class="btn-success input-xs"> 
								<i class="mdi mdi-upload"></i>
								<span>Buscar Archivo...</span>
							</label>
						</div>
					</form>
				</div>
			</div>
		';
	return $cotizacion_content;
}

function materialProyecto($array)
{
	// Se pinta la información de las guias de los materiales de proyectos internacional
	if ($array) {
		$guias = '
				<strong>Destinos</strong>
				<div id="accordion_guias" class="panel-group accordion">
			';

		$total_piezas = 0;
		$total_peso = 0;
		$total_peso_volumetrico = 0;
		$total_peso_factura = 0;

		foreach ($array as $key => $value) {
			/***** Contenido del accordeón *****/
			$encabezado = $value[0];

			// Se lista los materiales de la Guía
			$materiales = $value;

			$materiales_content = '
					<table class="table table-striped">
						<thead>
							<tr class="nexos-encabezado">
								<th>Material</th>
								<th>Delivery</th>
								<th>Shipment</th>
								<th># Piezas</th>
								<th>
									Dimención unitaria 
									<br /><small>(largo x alto x ancho)</small>
								</th>
								<th>Peso</th>
								<th>Peso Volumétrico</th>
								<th>Peso a facturar</th>
								<th>Peligroso</th>
								<th>Hoja Seguridad</th>
								<th>Refrigerado</th>
							</tr>
						</thead>
						<tbody>
				';

			// Se filtra contenido de la tabla 
			$_total_piezas = 0;
			$_total_peso = 0;
			$_total_peso_volumetrico = 0;
			$_total_peso_factura = 0;
			foreach ($materiales as $key_01 => $value_01) {
				// Se suma el la cantidad de piezas de los materiales
				$_total_piezas = $_total_piezas + $value_01["cant_piezas"];
				$total_piezas = $total_piezas + $value_01["cant_piezas"];

				// Se filtra el contenido del delivery 
				$_delivery = '<strong class="text-danger">No especificado</strong>';
				$_delivery_color = 'text-danger';
				if ($value_01["delivery"]) {
					$_delivery = $value_01["delivery"];
					$_delivery_color = '';
				}

				// Se filtra el contenido del shipment 
				$_shipment = '<strong class="text-danger">No especificado</strong>';
				$_shipment_color = 'text-danger';
				if ($value_01["shipment"]) {
					$_shipment = $value_01["shipment"];
					$_shipment_color = '';
				}

				// Se calcula el peso total del material 
				$_peso = $value_01["peso"] * $value_01["cant_piezas"];
				$_total_peso = $_total_peso + $_peso;
				$total_peso = $total_peso + $_peso;

				// Se calcula el peso volumétrico total del material 
				$_peso_volumetrico = $value_01["PESO_VOLUMETRICO"] * $value_01["cant_piezas"];
				$_total_peso_volumetrico = $_total_peso_volumetrico + $_peso_volumetrico;
				$total_peso_volumetrico = $total_peso_volumetrico + $_peso_volumetrico;

				// Se filtra cual es el peso a facturar al cliente 
				$_peso_factura = $_peso;
				if ((float)$_peso < (float)$_peso_volumetrico) {
					$_peso_factura = $_peso_volumetrico;
				}
				$_col_peso_volumetrico = '
						<td class="cell-detail text-right">
							<span class="cell-detail-description">' . number_format($_peso_volumetrico, 5, ',', '.') . 'Kg.</span>
						</td>
					';

				$_total_peso_factura = $_total_peso_factura + (float)$_peso_factura;
				$total_peso_factura = $total_peso_factura + (float)$_peso_factura;

				// Se filtra el contenido de si es Peligroso
				$_peligroso_text = '<span class="cell-detail-description">No</span>';
				if ($value_01["material_peligroso"]) {
					$_peligroso_text = '
							<span>
								<span class="cell-detail-description">UN <strong>' . $value_01["un"] . '</strong></span>
								<a class="cell-detail hint--top" data-hint="' . $value_01["NOM_RIESGO"] . '">
									<img src="' . BASE_URL . 'public/img/riesgos/' . $value_01["URL_RIESGO"] . '" height="50" width="50">
									<span class="cell-detail-description">' . $value_01["RIESGO"] . '</span>

								</a>
							</span>
						';
				}

				// Se filtra el contenido de la hoja de seguridad
				$_hoja_seguridad = '<center><span class="cell-detail-description">No</span></center>';
				if ($value_01["url_hoja_seguridad"]) {
					$_hoja_seguridad = '
							<center>
								<a href="' . BASE_URL . 'public/files/internacional/materiales/' . $value_01["id_tramo"] . '/' . $value_01["url_hoja_seguridad"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar"><span class="icon mdi mdi-download"></span></a>
							</center>
						';
				}

				// Se filtra el contenido de si es Peligroso
				$_refrigerado_text = 'No';
				if ($value_01["refrigerado"]) {
					$_refrigerado_text = 'Si';
				}

				$materiales_content .= '
						<tr>
							<td class="cell-detail">
								<span class="cell-detail-description">' . $value_01["material"] . '</span>
							</td>
							<td class="cell-detail ' . $_delivery_color . '">
								<span class="cell-detail-description">' . $_delivery . '</span>
							</td>
							<td class="cell-detail ' . $_shipment_color . '">
								<span class="cell-detail-description">' . $_shipment . '</span>
							</td>
							<td class="cell-detail text-center">
								<span class="cell-detail-description">' . $value_01["cant_piezas"] . '</span>
							</td>
							<td class="cell-detail text-center">
								<span class="cell-detail-description">' . $value_01["largo"] . ' x ' . $value_01["alto"] . ' x ' . $value_01["ancho"] . ' cm<sup>3</sup></span>
							</td>
							<td class="cell-detail text-right">
								<span class="cell-detail-description">' . number_format($_peso, 2, ',', '.') . 'Kg.</span>
							</td>
							' . $_col_peso_volumetrico . '
							<td class="cell-detail text-right">
								<span class="cell-detail-description">' . number_format($_peso_factura, 2, ',', '.') . 'Kg.</span>
							</td>
							<td class="cell-detail text-center">
								' . $_peligroso_text . '
							</td>
							<td class="actions cell-detail">
								' . $_hoja_seguridad . ' 
							</td>
							<td class="cell-detail text-center">
								<span class="cell-detail-description">' . $_refrigerado_text . '</span>
							</td>
						</tr>
					';
			}

			$_total_peso_volumetrico_content = '';
			if ($encabezado["tipo_transporte"] == "AÉREO" or $encabezado["tipo_transporte"] == "MARÍTIMO") {
				$_total_peso_volumetrico_content = '
						<div class="col-xs-6 col-sm-3 col-md-3 text-center">
							<span>Peso Volumétrico Total</span>
							<span class="cell-detail-description">' . number_format($_total_peso_volumetrico, 2, ',', '.') . ' Kg.</span>
						</div>
					';
			}

			$materiales_content .= '
							<tr>
								<td class="cell-detail" colspan="11">
									<div class="col-xs-6 col-sm-3 col-md-3 text-center">
										<span>Total Piezas</span>
										<span class="cell-detail-description">' . $_total_piezas . '</span>
									</div>
									<div class="col-xs-6 col-sm-3 col-md-3 text-center">
										<span>Peso Total</span>
										<span class="cell-detail-description">' . number_format($_total_peso, 2, ',', '.') . ' Kg.</span>
									</div>
									' . $_total_peso_volumetrico_content . '
									<div class="col-xs-6 col-sm-3 col-md-3 text-center">
										<span>Peso Facturable</span>
										<span class="cell-detail-description">' . number_format($_total_peso_factura, 2, ',', '.') . ' Kg.</span>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				';

			// Contenido de la pestaña 
			$guias .= '
					<div class="panel panel-default">
						<div class="panel-heading">
							<h4 class="panel-title">
								<a data-toggle="collapse" data-parent="#accordion_guias" href="#collapse_' . $encabezado[0] . '" class="collapsed" aria-expanded="false">
									<i class="icon mdi mdi-chevron-down"></i> ' . $encabezado["guia"] . ' <small>' . $encabezado["tipo_transporte"] . '</small>
									<span class="panel-subtitle"><strong>' . $encabezado["sigla"] . '</strong> ' . $encabezado["direccion"] . ' <strong>' . $encabezado["municipio"] . ' (' . $encabezado["depto"] . ' - ' . $encabezado["pais"] . ')</strong></span>
								</a>
							</h4>
						</div>
						<div id="collapse_' . $encabezado[0] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
							<div class="panel-body">
								<strong>Materiales</strong>
								<div style="overflow-x:scroll; overflow-y:hidden; white-space:nowrap;">
									' . $materiales_content . '
								</div>
							</div>
						</div>
					</div>
				';
			/***** Fin - Contenido del accordeón *****/
		}

		$guias .= '
				</div>
			';

		// Contenido del resumen de las guías del proyecto
		$cotiza_por = "Peso";
		$total_peso_volumetrico_content = '';
		if ($encabezado["tipo_transporte"] == "AÉREO" or $encabezado["tipo_transporte"] == "MARÍTIMO") {
			if ((float)$total_peso < (float)$total_peso_volumetrico) {
				$cotiza_por = "Volumen";
			}
			$total_peso_volumetrico_content = '
					<div class="col-xs-6 col-sm-2 col-md-2 text-center">
						<span>Peso Volumétrico Total</span>
						<span class="cell-detail-description">' . number_format($total_peso_volumetrico, 2, ',', '.') . ' Kg.</span>
					</div>
				';
		}

		$resumen_guias = '
				<strong>Resúmen Guías</strong>
				<table class="table table-striped">
					<tbody>
						<tr>
							<td class="cell-detail">
								<div class="col-xs-6 col-sm-2 col-md-2 text-center">
									<span>Modo de Transporte</span>
									<span class="cell-detail-description">' . $encabezado["tipo_transporte"] . '</span>
								</div>
								<div class="col-xs-6 col-sm-2 col-md-2 text-center">
									<span>Total Piezas</span>
									<span class="cell-detail-description">' . $total_piezas . '</span>
								</div>
								<div class="col-xs-6 col-sm-2 col-md-2 text-center">
									<span>Peso Total</span>
									<span class="cell-detail-description">' . number_format($total_peso, 2, ',', '.') . ' Kg.</span>
								</div>
								' . $total_peso_volumetrico_content . '
								<div class="col-xs-6 col-sm-2 col-md-2 text-center">
									<span>Peso Facturable</span>
									<span class="cell-detail-description">' . number_format($total_peso_factura, 2, ',', '.') . ' Kg.</span>
								</div>
								<div class="col-xs-6 col-sm-2 col-md-2 text-center">
									<span>Cotizar por</span>
									<span class="cell-detail-description">' . $cotiza_por . '</span>
								</div>
							</td>
						</tr>
						<tr><td></td></tr>
					</tbody>
				</table>
			';
	}

	$return["resumen"] = $resumen_guias;
	$return["guias"] = $guias;
	return $return;
}

function formMaterialProyecto($array)
{



	$Internacional = new internacionalModel;
	/***** Se pinta la información de las guias de los materiales de proyectos internacional *****/
	if ($array) {
		$guias = '
				<div class="panel panel-border panel-contrast">
					<div class="panel-heading panel-heading-contrast">
						Materiales
						<div class="tools"></div>
						<span class="panel-subtitle"></span>
					</div>
					<div class="panel-body">
						<div id="accordion_form_material" class="panel-group accordion">
			';

		foreach ($array as $key => $value) {
			/***** Contenido del accordeón de materiales *****/
			$encabezado = $value[0];

			// print_r($encabezado);
			// exit();

			// Se lista los materiales de la Guía
			$materiales = $value;

			// print_r($materiales);
			// exit();

			$materiales_content = '
					<table class="table table-striped">
						<thead>
							<tr class="nexos-encabezado">
								<th>Material</th>
								<th>Delivery</th>
								<th>Shipment</th>
								<th>Refig</th>
								<th>Pelig</th>
								<th style="width: 10%;">UN</th>
								<th style="width: 15%;">Riesgo</th>
								<th>Hoja Seguridad</th>
							</tr>
						</thead>
						<tbody>
				';

			// Se filtra contenido de la tabla 
			foreach ($materiales as $key_01 => $value_01) {
				// Se filtra el contenido del delivery 
				$_delivery = '<strong>No especificado</strong>';
				$_delivery_color = 'text-danger';
				if ($value_01["delivery"]) {
					$_delivery = $value_01["delivery"];
					$_delivery_color = '';
				}

				// Se filtra el contenido del shipment 
				$_shipment = '<strong>No especificado</strong>';
				$_shipment_color = 'text-danger';
				if ($value_01["shipment"]) {
					$_shipment = $value_01["shipment"];
					$_shipment_color = '';
				}

				// Se filtra si el material requiere refrigeración 
				$_refrigerado_checked = '';
				$_refrigerado_checked_disabled = '';
				if ($value_01["refrigerado"]) {
					$_refrigerado_checked = 'checked';
					$_refrigerado_checked_disabled = 'disabled';
				}

				// Se filtra si el material es peligroso 
				$_peligroso_checked = '';
				$_peligroso_checked_disabled = '';
				$_un = '<input type="text" name="un_' . $value_01['id'] . '" id="un_' . $value_01['id'] . '" class="form-control input-xs" placeholder="UN" maxlength="4">';

				$_riesgo = $Internacional->getHtmlSelectRiesgoMaterial_xs("riesgo_" . $value_01['id'], "", "");

				$_hoja_seguridad = '
						<td class="cell-detail text-center">
							<input type="file" name="hoja_seguridad_file_' . $value_01['id'] . '" id="hoja_seguridad_file_' . $value_01['id'] . '" class="inputfile">
							<label for="hoja_seguridad_file_' . $value_01['id'] . '"  id="label_hoja_seguridad_file_' . $value_01['id'] . '" class="btn-success"><i class="mdi mdi-upload"></i></label>
						</td>
					';

				if ($value_01["material_peligroso"]) {
					$_peligroso_checked = 'checked';
					$_peligroso_checked_disabled = 'disabled';
					$_un = $value_01["un"];
					$_riesgo = '
							<a class="cell-detail hint--top" data-hint="' . $value_01["NOM_RIESGO"] . '">
								<img src="' . BASE_URL . 'public/img/riesgos/' . $value_01["URL_RIESGO"] . '" height="50" width="50">
								<span class="cell-detail-description">' . $value_01["RIESGO"] . '</span>
							</a>
						';
					$_hoja_seguridad = '
							<td class="actions">
								<center>
									<a href="' . BASE_URL . 'public/files/internacional/materiales/' . $value_01["id_tramo"] . '/' . $value_01["url_hoja_seguridad"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar"><span class="icon mdi mdi-download"></span></a>
								</center>
							</td>
						';
				}

				$materiales_content .= '
						<tr>
							<td class="cell-detail">
								<span>' . $value_01["material"] . '</span>
								<span class="cell-detail-description">' . $value_01["posicion_arancelaria"] . '</span>
							</td>
							<td class="cell-detail ' . $_delivery_color . '">
								<span>' . $_delivery . '</span>
							</td>
							<td class="cell-detail ' . $_shipment_color . '">
								<span>' . $_shipment . '</span>
							</td>
							<td>
								<div class="be-checkbox">
									<input id="check_refrigerado_' . $value_01['id'] . '" class="check_refrigerado" type="checkbox" ' . $_refrigerado_checked . ' ' . $_refrigerado_checked_disabled . '>
									<label for="check_refrigerado_' . $value_01['id'] . '"></label>
								</div>
							</td>
							<td class="cell-detail text-center">
								<input type="hidden" id="guia_' . $value_01['id'] . '" value="' . $encabezado["guia"] . '">
								<input type="hidden" id="material_' . $value_01['id'] . '" value="' . $value_01["material"] . '">
								<input type="hidden" name="tramo_' . $value_01['id'] . '" value="' . $value_01["id_tramo"] . '">
								<div class="be-checkbox">
									<input id="check_peligroso_' . $value_01['id'] . '" class="check_peligroso" type="checkbox" ' . $_peligroso_checked . ' ' . $_peligroso_checked_disabled . '>
									<label for="check_peligroso_' . $value_01['id'] . '"></label>
								</div>
							</td>
							<td class="cell-detail text-center">
								' . $_un . '
							</td>
							<td class="cell-detail text-center">
								' . $_riesgo . '
							</td>
							' . $_hoja_seguridad . '
						</tr>
					';
			}

			$materiales_content .= '
						</tbody>
					</table>
				';

			// Contenido de la pestaña 
			$guias .= '
					<div class="panel panel-default">
						<div class="panel-heading">
							<h4 class="panel-title">
								<a data-toggle="collapse" data-parent="#accordion_form_material" href="#collapse_' . $encabezado['id'] . '" class="collapsed" aria-expanded="false">
									<i class="icon mdi mdi-chevron-down"></i> ' . $encabezado["guia"] . ' <small>' . $encabezado["tipo_transporte"] . '</small>
									<span class="panel-subtitle"><strong>' . $encabezado["sigla"] . '</strong> ' . $encabezado["direccion"] . ' <strong>' . $encabezado["municipio"] . ' (' . $encabezado["depto"] . ' - ' . $encabezado["pais"] . ')</strong></span>
								</a>
							</h4>
						</div>
						<div id="collapse_' . $encabezado['id'] . '" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
							<div class="panel-body">
								<strong>Materiales</strong>
								' . $materiales_content . '
							</div>
						</div>
					</div>
				';
			/***** Fin - Contenido del accordeón de materiales *****/
		}

		$guias .= '
						</div>
					</div>
				</div>
			';
	}
	return $guias;
}

function calculaCotizacion($array)
{
	$return = '';
	if ($array["total_cotizaciones"]) {
		$return = '
				<strong>Resumen de Cotización</strong>
				<table class="table  table-striped">
					<thead>
						<tr class="nexos-encabezado">
							<th>Moneda</th>
							<th>Cant. Cotizaciones</th>
							<th>Total</th>
							<th>Total en COP</th>
							<th>Total en USD</th>
						</tr>
					</thead>
					<tbody>
			';

		$_flag_total = true;
		$_flag_total_usd = true;
		$total_pesos = 0;
		$total_usd = 0;
		$_valor_usd = 0;
		foreach ($array["total_cotizaciones"] as $key => $value) {
			// Se suma el valor en pesos de la columna 
			$_valor_pesos = '<span>$' . number_format($value["valor_pesos"], 2, ',', '.') . '</span>';
			$total_pesos = $total_pesos + (float)$value["valor_pesos"];
			if (!$value["valor_pesos"]) {
				$_valor_pesos = '<span class="text-danger"><strong>Sin TRM</strong></span>';
				$_flag_total = false;
			}

			// Se suma el valor en USD de la columna 
			$_valor_usd = '<span>$' . number_format($value["valor_usd"], 2, ',', '.') . '</span>';
			$total_usd = $total_usd + (float)$value["valor_usd"];
			if (!$value["valor_usd"]) {
				$_valor_usd = '<span class="text-danger"><strong>Sin TRM</strong></span>';
				$_flag_total_usd = false;
			}

			$return .= '
					<tr>
						<td class="cell-detail">
							<span>' . $value["moneda"] . '</span>
						</td>
						<td class="cell-detail text-center">
							<span>' . $value["cuantos"] . '</span>
						</td>
						<td class="cell-detail text-right">
							<span>' . number_format($value["valor_cotizacion"], 2, ',', '.') . '</span>
						</td>
						<td class="cell-detail text-right">
							' . $_valor_pesos . '
						</td>
						<td class="cell-detail text-right">
							' . $_valor_usd . '
						</td>
					</tr>
				';
		}

		// Se filtra el valor total de las cotizaciones en pesos 
		$_total_pesos = '<span><strong>$' . number_format($total_pesos, 2, ',', '.') . '</strong></span>';
		if (!$_flag_total) {
			$_total_pesos = '<span class="text-danger"><strong>Sin TRM</strong></span>';
		}

		// Se filtra el valor total de las cotizaciones en USD 
		$_total_usd = '<span><strong>$' . number_format($total_usd, 2, ',', '.') . '</strong></span>';
		if (!$_flag_total_usd) {
			$_total_usd = '<span class="text-danger"><strong>Sin TRM</strong></span>';
		}

		$return .= '
						<tr>
							<td class="cell-detail">
								<span><strong>Total Cotizaciones</strong></span>
							</td>
							<td class="cell-detail text-center">
								<span><strong>' . $array["lista_valor_cotizaciones"]["rowsNum"] . '</strong></span>
							</td>
							<td class="cell-detail text-right">
								<span><strong>Cotización Total</strong></span>
							</td>
							<td class="cell-detail text-right">
								' . $_total_pesos . '
							</td>
							<td class="cell-detail text-right">
								' . $_total_usd . '
							</td>
						</tr>
					</tbody>
				</table>
			';
	}
	return $return;
}

function datosClienteEncabezado($array)
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

	if (isset($array)) {
		$content = '
				<input type="hidden" id="cliente_nombre" value="' . $array["nombre"] . '">
				<input type="hidden" id="cliente_nit" value="' . number_format($array["documento"], 0, ',', '.') . '-' . $array["digito_verificacion"] . '">
				<input type="hidden" id="cliente_direccion" value="' . $array["direccion"] . '">
				<input type="hidden" id="cliente_municipio" value="' . $array["municipio"] . '">
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
