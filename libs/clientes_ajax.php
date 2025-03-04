<?php
include "../application/Config.php";
include '../application/Conexion.php';
include '../application/Model.php';
include '../models/clientesModel.php';
include '../models/municipiosModel.php';
include '../models/usuariosModel.php';

$_msg_error = "";
$_msg_control = "Entro en clientes_ajax.php\n";
$_msg_content = "";
$_array_result = array();

$Data = new Consultas;
$Clientes = new clientesModel;
$Municipio = new municipiosModel;
$Usuario = new usuariosModel;
$Postal = new municipiosModel;
$Obligacion_tribu = new clientesModel;
$time = time();

$return["get"] = $_GET;
$return["post"] = $_POST;
if (isset($_FILES)) {
	$return["file"] = $_FILES;
}

switch ($_GET["action"]) {
	case 'buscarCliente':
		$_msg_control .= "Entro en la accion buscarCliente.\n";
		$_array_result = false;

		$result = $Clientes->getClienteByDocumento($_POST["documento"]);
		if ($result) {
			$_array_result = true;
			$_array_content = $result;
		}
		break;

	case 'verCliente':
		$_msg_control .= "Entro en la accion verCliente.\n";

		// Se busca la información del Cliente
		$result = $Clientes->getClienteInfoCompleta($_POST["id"]);
		$_msg_content = '
				<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
					<div class="icon">
						<span class="mdi mdi-check"></span>
					</div>
					<div class="message">
						<strong>Error!</strong><p>No hay información registrada del cliente.</p>
					</div>
				</div>
			';
		if ($result["general"]) {
			$_msg_content = '';
			$return["result"] = $result;

			/****** Información básica ******/
			$_info_basica_content = '
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

			if (isset($result["general"])) {
				$general = $result["general"]["rowsData"][0];

				// Se busca la información del representante legal
				$_representante = '<span class="cell-detail-description"><strong class="text-danger">No asignado</strong></span>';
				$_representante_link = '';
				if ($result["representante_legal"]) {
					$representante = $result["representante_legal"]["rowsData"][0];
					$_representante = '
							<span class="cell-detail-description">' . $representante["nombre_miembro"] . '</span>
							<span class="cell-detail-description">' . $representante["documento"] . '</span>
						';
					$_representante_link = '
							<table>
								<tr>
									<td class="actions-nexos">
										<center>
											<a href="' . BASE_URL . 'public/files/clientes/' . $representante["DOC_CLIENTE"] . '/' . $representante["tipo_miembro"] . '/' . $representante["documento"] . '/' . $representante["folder"] . '/' . $representante["url"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
												<span class="icon mdi mdi-download"></span>
											</a>
										</center>
									</td>
								</tr>
							</table>
						';
				}

				// Se busca la información de aprobación del cliente
				$_aprobacion = "";
				if (isset($result["aprobacion"]) and $result["aprobacion"]) {
					$aprobacion = $result["aprobacion"];
					$_aprobacion = '
							<center>
								<table>
									<tr>
										<td class="actions-nexos">
												<a href="' . BASE_URL . 'public/files/clientes/' . $aprobacion["DOC_CLIENTE"] . '/' . $aprobacion["folder"] . '/' . $aprobacion["url_documento"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
													<span class="icon mdi mdi-download"></span>
												</a>
										</td>
									</tr>
								</table>
								<span>Aprobación</span>
								<span class="cell-detail-description">' . $aprobacion["fecha_expedicion"] . '</span>
							</center>
						';
				}

				// Se busca la información de los servicios ofrecidos al cliente
				$_servicios = '
						<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
							<div class="icon">
								<span class="mdi mdi-close"></span>
							</div>
							<div class="message">
								<strong>Error!</strong>
								<p>No se ha registrado los servicios ofrecidos de éste cliente...</p>
							</div>
						</div>
					';
				if (isset($result["servicios"]) and $result["servicios"]) {
					$_servicios = '<h4>Servicios</h4>';

					foreach ($result["servicios"]["rowsData"] as $key => $value) {
						// Se busca los ejecutivos comerciales
						$_ejecutivo_comercial = '<span class="cell-detail-description"><strong class="text-danger">No asignado</strong></span>';

						if (isset($result["ejecutivo_comercial"][$value["id"]]["rowsData"]) and $result["ejecutivo_comercial"][$value["id"]]["rowsData"]) {
							$_ejecutivo_comercial = '';
							foreach ($result["ejecutivo_comercial"][$value["id"]]["rowsData"] as $key_01 => $value_01) {
								$_ejecutivo_comercial .= '<span class="cell-detail-description">' . $value_01["nom_usuario"] . '</span>';
							}
						}

						// Se busca los ejecutivos de servicio al cliente
						$_ejecutivo_servicio = '<span class="cell-detail-description"><strong class="text-danger">No asignado</strong></span>';

						if (isset($result["ejecutivo_cliente"][$value["id"]]["rowsData"]) and $result["ejecutivo_cliente"][$value["id"]]["rowsData"]) {
							$_ejecutivo_servicio = '';
							foreach ($result["ejecutivo_cliente"][$value["id"]]["rowsData"] as $key_01 => $value_01) {
								$_ejecutivo_servicio .= '<span class="cell-detail-description">' . $value_01["nom_usuario"] . '</span>';
							}
						}

						$_servicios .= '
								<strong>' . $value["servicio"] . '</strong>
								<table class="table">
									<tbody>
										<tr>
											<td class="cell-detail">
												<div class="col-sm-6">
													<span>Ejecutivos Comerciales</span>
													<span class="cell-detail-description">' . $_ejecutivo_comercial . '</span>
												</div>
												<div class="col-sm-6">
													<span>Ejecutivos Servicio al Cliente</span>
													<span class="cell-detail-description">' . $_ejecutivo_servicio . '</span>
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							';
					}
				}

				// Se filtra el contenido de la barra de progreso de los documentros del cliente
				$_progress_bar_color = "progress-bar-success";
				$_porcentaje = 100;
				if ($general["OBLIGATORIOS"] > $general["REGISTRADOS"]) {
					$_progress_bar_color = "progress-bar-danger";
					$_porcentaje = (int) (($general["REGISTRADOS"] * 100) / $general["OBLIGATORIOS"]);
				}
				$_barra_documentos = '
						<span class="progress-value">' . $_porcentaje . '%</span>
						<div class="progress">
							<div style="width: ' . $_porcentaje . '%;" class="progress-bar ' . $_progress_bar_color . '"></div>
						</div>
					';

				$_info_basica_content = '
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="form-group col-sm-4">
											<span>Cliente</span>
											<span class="cell-detail-description">' . $general["nombre"] . ' (' . $general["sigla"] . ')</span>
											<span class="cell-detail-description">' . $general["documento"] . '-' . $general["digito_verificacion"] . '</span>
											<span class="cell-detail-description">Tipo Documento - ' . $general["tipo_documento"] . '</span>
											<span class="cell-detail-description">Régimen - ' . $general["regimen"] . '</span>
										</div>
										<div class="form-group col-sm-4">
											<span>Ubicación</span>
											<span class="cell-detail-description">' . $general["direccion"] . '</span>
											<span class="cell-detail-description">' . $general["municipio"] . ' (' . $general["depto"] . ' - ' . $general["pais"] . ')</span>
											<span class="cell-detail-description">' . $general["indicaciones_llegada"] . '</span>
										</div>
										<div class="form-group col-sm-4">
											<span>Contacto</span>
											<span class="cell-detail-description">Teléfono - ' . $general["telefono"] . '</span>
											<span class="cell-detail-description">' . $general["email"] . '</span>
										</div>
										<div class="col-sm-12"></div>
										<div class="col-sm-4">
											<span>Representante Legal o Suplente</span>
											' . $_representante . '
										</div>
										<div class="col-xs-1">
											' . $_representante_link . '
										</div>
										<div class="col-sm-2">
											' . $_aprobacion . '
										</div>
										<div class="col-sm-4">
											' . $_barra_documentos . '
										</div>
									</td>
								</tr>
								<tr><td></td></tr>
							</tbody>
						</table>
						' . $_servicios . '
					';
			}

			$_info_basica = '
					<div class="panel panel-default panel-border-color panel-border-color-default">
						<div class="panel-heading">
							<h4 class="panel-title">
								<a data-toggle="collapse" data-parent="#accordion1" href="#info_basica">
									<i class="icon mdi mdi-chevron-down"></i>
									Información Básica
								</a>
							</h4>
						</div>
						<div id="info_basica" class="panel-collapse collapse in">
							<div class="panel-body">
								' . $_info_basica_content . '
							</div>
						</div>
					</div>
				';

			/****** Documentos ******/
			// Cámara de Comercio
			$_cam_comercio_content = '
					<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<strong>Error!</strong>
							<p>No se ha registrado información de la Cámara de Comercio de éste cliente...</p>
						</div>
					</div>
				';
			if (isset($result["camara_comercio"]) and $result["camara_comercio"]) {
				$cam_comercio = $result["camara_comercio"]["rowsData"][0];
				$_fecha_renovacion = '<span class="cell-detail-description"><strong class="text-danger">No registrado</strong></span>';
				$_adjunto_cam_comercio = "";
				if ($cam_comercio["fecha_expedicion"]) {
					$_fecha_renovacion = '<span class="cell-detail-description">' . $cam_comercio["fecha_expedicion"] . '</span>';
					$_adjunto_cam_comercio = '
							<table>
								<tr>
									<td class="actions-nexos">
										<center>
											<a href="' . BASE_URL . 'public/files/clientes/' . $cam_comercio["DOC_CLIENTE"] . '/' . $cam_comercio["folder"] . '/' . $cam_comercio["url_documento"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
												<span class="icon mdi mdi-download"></span>
											</a>
										</center>
									</td>
								</tr>
							</table>
						';
				}

				$_cam_comercio_content = '
						<div class="col-sm-1">
							' . $_adjunto_cam_comercio . '
						</div>
						<div class="col-sm-3">
							<span>Matrícula</span>
							<span class="cell-detail-description">' . $cam_comercio["numero_documento"] . '</span>
						</div>
						<div class="col-sm-4">
							<span>Fecha Constitución</span>
							<span class="cell-detail-description">' . $cam_comercio["fecha_constitucion"] . '</span>
						</div>
						<div class="col-sm-4">
							<span>Fecha Renovación</span>
							' . $_fecha_renovacion . '
						</div>
					';

				if ($cam_comercio["capital_autorizado"] and $cam_comercio["capital_suscrito"] and $cam_comercio["capital_pagado"]) {
					$_cam_comercio_content = '
							<div class="form-group col-sm-1">
								' . $_adjunto_cam_comercio . '
							</div>
							<div class="form-group col-sm-3">
								<span>Matrícula</span>
								<span class="cell-detail-description">' . $cam_comercio["numero_documento"] . '</span>
							</div>
							<div class="form-group col-sm-4">
								<span>Fecha Constitución</span>
								<span class="cell-detail-description">' . $cam_comercio["fecha_constitucion"] . '</span>
							</div>
							<div class="form-group col-sm-4">
								<span>Fecha Renovación</span>
								' . $_fecha_renovacion . '
							</div>
							<div class="col-sm-12"></div>
							<div class="col-sm-4">
								<span>Capital Autorizado</span>
								<span class="cell-detail-description">$ ' . number_format($cam_comercio["capital_autorizado"], 0, ",", ".") . '</span>
							</div>
							<div class="col-sm-4">
								<span>Capital Suscrito</span>
								<span class="cell-detail-description">$ ' . number_format($cam_comercio["capital_suscrito"], 0, ",", ".") . '</span>
							</div>
							<div class="col-sm-4">
								<span>Capital Pagado</span>
								<span class="cell-detail-description">$ ' . number_format($cam_comercio["capital_pagado"], 0, ",", ".") . '</span>
							</div>
						';
				}
			}

			$_cam_comercio = '
					<strong>Cámara de Comercio</strong>
					<table class="table">
						<tbody>
							<tr>
								<td class="cell-detail">
									' . $_cam_comercio_content . '
								</td>
							</tr>
							<tr><td></td></tr>
						</tbody>
					</table>
				';

			// Rut
			$_rut_content = '
					<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<strong>Error!</strong>
							<p>No se ha registrado información del RUT de éste cliente...</p>
						</div>
					</div>
				';
			if (isset($result["RUT"])) {
				$rut = $result["RUT"];
				$ciuu_rut = "";
				$acti_rut = "";

				if ($rut["ciiu_principal"]) {
					$ciuu_rut = $rut["ciiu_principal"];
				} else {
					$ciuu_rut = "";
				}

				if ($rut["actividad_aduanera"]) {
					$acti_rut = $rut["actividad_aduanera"];
				} else {
					$acti_rut = "";
				}


				$_rut_content = '
						<div class="col-sm-1">
							<table>
								<tr>
									<td class="actions-nexos">
										<center>
											<a href="' . BASE_URL . 'public/files/clientes/' . $rut["DOC_CLIENTE"] . '/' . $rut["folder"] . '/' . $rut["url_documento"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
												<span class="icon mdi mdi-download"></span>
											</a>
										</center>
									</td>
								</tr>
							</table>
						</div>
						<div class="col-sm-3">
							<span>Número Formulario RUT</span>
							<span class="cell-detail-description">' . $rut["numero_documento"] . '</span>
						</div>
						<div class="col-sm-2">
							<span>Fecha Expedición</span>
							<span class="cell-detail-description">' . $rut["fecha_expedicion"] . '</span>
						</div>
						<div class="col-sm-3">
							<span>CIIU Principal</span>
							<span class="cell-detail-description">' . str_replace(",", ", ", $ciuu_rut) . '</span>
						</div>
						<div class="col-sm-3">
							<span>Actividad Aduanera</span>
							<span class="cell-detail-description">' . str_replace(",", ", ", $acti_rut) . '</span>
						</div>
					';
			}

			$_rut = '
					<strong>RUT</strong>
					<table class="table">
						<tbody>
							<tr>
								<td class="cell-detail">
									' . $_rut_content . '
								</td>
							</tr>
							<tr><td></td></tr>
						</tbody>
					</table>
				';

			// Estado Financiero
			$_est_financiero_content = '
					<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<strong>Error!</strong>
							<p>No se ha registrado información del Estado Financiero de éste cliente...</p>
						</div>
					</div>
				';
			if (isset($result["estado_financiero"])) {
				$estado_financiero = $result["estado_financiero"];
				$_est_financiero_content = '
						<div class="col-sm-1">
							<table>
								<tr>
									<td class="actions-nexos">
										<center>
											<a href="' . BASE_URL . 'public/files/clientes/' . $estado_financiero["DOC_CLIENTE"] . '/' . $estado_financiero["folder"] . '/' . $estado_financiero["url_documento"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
												<span class="icon mdi mdi-download"></span>
											</a>
										</center>
									</td>
								</tr>
							</table>
						</div>
						<div class="col-sm-11">
							<span>Año Fiscal</span>
							<span class="cell-detail-description">' . $estado_financiero["numero_documento"] . '</span>
						</div>
					';
			}

			$_est_financiero = '
					<strong>Estado Financiero</strong>
					<table class="table">
						<tbody>
							<tr>
								<td class="cell-detail">
									' . $_est_financiero_content . '
								</td>
							</tr>
							<tr><td></td></tr>
						</tbody>
					</table>
				';

			// Poliza
			$_poliza_content = '
					<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<strong>Atención!</strong>
							<p>No se ha registrado información de la Póliza de éste cliente...</p>
						</div>
					</div>
				';
			if (isset($result["seguro"])) {
				$seguro = $result["seguro"];

				$_poliza_content = '
						<div class="form-group col-sm-1">
							<table>
								<tr>
									<td class="actions-nexos">
										<center>
											<a href="' . BASE_URL . 'public/files/clientes/' . $seguro["DOC_CLIENTE"] . '/' . $seguro["folder"] . '/' . $seguro["url_documento"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
												<span class="icon mdi mdi-download"></span>
											</a>
										</center>
									</td>
								</tr>
							</table>
						</div>
						<div class="form-group col-sm-3">
							<span># Poliza</span>
							<span class="cell-detail-description">' . $seguro["numero_documento"] . '</span>
						</div>
						<div class="form-group col-sm-4">
							<span>Fecha Expedición</span>
							<span class="cell-detail-description">' . $seguro["fecha_expedicion"] . '</span>
						</div>
						<div class="form-group col-sm-4">
							<span>Aseguradora</span>
							<span class="cell-detail-description">' . $seguro["aseguradora"] . '</span>
						</div>
						<div class="col-sm-12"></div>
						<div class="form-group col-sm-3">
							<span>Solicitante</span>
							<span class="cell-detail-description">' . $seguro["solicitante"] . '</span>
						</div>
						<div class="form-group col-sm-3">
							<span>Monto Asegurado</span>
							<span class="cell-detail-description">$ ' . number_format($seguro["monto"], 0, ",", ".") . '</span>
						</div>
						<div class="form-group col-sm-3">
							<span>Horario de Tránsito</span>
							<span class="cell-detail-description">' . $seguro["horario_transito"] . '</span>
						</div>
						<div class="form-group col-sm-3">
							<span>Modelo mínimo de Vehículo</span>
							<span class="cell-detail-description">' . $seguro["modelo_minimo_vehiculo"] . '</span>
						</div>
						<div class="col-sm-12"></div>
						<div class="col-sm-12">
							<span>Interés Asegurable</span>
							<span class="cell-detail-description">' . $seguro["interes_asegurable"] . '</span>
						</div>
					';
			}

			$_poliza = '
					<strong>Póliza</strong>
					<table class="table">
						<tbody>
							<tr>
								<td class="cell-detail">
									' . $_poliza_content . '
								</td>
							</tr>
							<tr><td></td></tr>
						</tbody>
					</table>
				';

			$_documentos_panel_color = 'danger';
			if (isset($result["camara_comercio"]) and isset($result["RUT"]) and isset($result["estado_financiero"]) and isset($cam_comercio["fecha_expedicion"]) and $cam_comercio["fecha_expedicion"]) {
				$_documentos_panel_color = 'success';
			}

			$_documentos = '
					<div class="panel panel-default panel-border-color panel-border-color-' . $_documentos_panel_color . '">
						<div class="panel-heading">
							<h4 class="panel-title">
								<a data-toggle="collapse" data-parent="#accordion1" href="#documentos" class="collapsed">
									<i class="icon mdi mdi-chevron-down"></i>
									Documentos
								</a>
							</h4>
						</div>
						<div id="documentos" class="panel-collapse collapse">
							<div class="panel-body">
								' . $_cam_comercio . '
								' . $_rut . '
								' . $_est_financiero . '
								' . $_poliza . '
							</div>
						</div>
					</div>
				';

			/****** Referencias ******/
			// Comerciales
			$_referencias_comerciales_content = '
					<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<strong>Error!</strong>
							<p>No se ha registrado información de referencias comerciales de éste cliente...</p>
						</div>
					</div>
				';

			if (isset($result["referencias_comerciales"]) and $result["referencias_comerciales"]) {
				$_referencias_comerciales_content = '
						<div class="col-sm-3"></div>
						<div class="col-sm-6">
							<strong>Referencias Comerciales</strong>
							<table class="table table-condensed table-striped">
								<tbody>
					';
				$referencias_comerciales = $result["referencias_comerciales"]["rowsData"];

				foreach ($referencias_comerciales as $key => $value) {
					$_referencias_comerciales_content .= '
							<tr>
								<td class="actions-nexos">
									<center>
										<a href="' . BASE_URL . 'public/files/clientes/' . $value["DOC_CLIENTE"] . '/' . $value["folder"] . '/' . $value["url_documento"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
											<span class="icon mdi mdi-download"></span>
										</a>
									</center>
								</td>
								<td>
									<span>' . $value["numero_documento"] . '</span>
								</td>
								<td>
									<span>' . $value["fecha_expedicion"] . '</span>
								</td>
							</tr>
						';
				}

				$_referencias_comerciales_content .= '
								</tbody>
							</table>
						</div>
						<div class="col-sm-3"></div>
						<div class="col-sm-12"></div>
					';
			}

			// Bancarias
			$_referencias_bancarias_content = '
					<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<strong>Error!</strong>
							<p>No se ha registrado información de referencias bancarias de éste cliente...</p>
						</div>
					</div>
				';
			if (isset($result["bancos"]) and $result["bancos"]) {
				$_referencias_bancarias_content = '
						<div class="col-sm-3"></div>
						<div class="col-sm-6">
							<strong>Referencias Bancarias</strong>
							<table class="table table-condensed table-striped">
								<tbody>
					';

				$referencias_bancarias = $result["bancos"]["rowsData"];

				foreach ($referencias_bancarias as $key => $value) {
					$_referencias_bancarias_content .= '
							<tr>
								<td class="actions-nexos">
									<center>
										<a href="' . BASE_URL . 'public/files/clientes/' . $value["DOC_CLIENTE"] . '/bancos/' . $value["url_certificado"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
											<span class="icon mdi mdi-download"></span>
										</a>
									</center>
								</td>
								<td>
									<span>' . $value["banco"] . '</span>
								</td>
								<td class="cell-detail">
									<span>' . $value["numero_cuenta"] . '</span>
									<span class="cell-detail-description">' . $value["tipo_cuenta"] . '</span>
								</td>
							</tr>
						';
				}

				$_referencias_bancarias_content .= '
								</tbody>
							</table>
						</div>
						<div class="col-sm-3"></div>
					';
			}

			$_referencias_panel_color = 'danger';
			if (isset($result["referencias_comerciales"]) and $result["referencias_comerciales"] and isset($result["bancos"]) and $result["bancos"]) {
				$_referencias_panel_color = 'success';
			}

			$_referencias = '
					<div class="panel panel-default panel-border-color panel-border-color-' . $_referencias_panel_color . '">
						<div class="panel-heading">
							<h4 class="panel-title">
								<a data-toggle="collapse" data-parent="#accordion1" href="#referencias" class="collapsed">
									<i class="icon mdi mdi-chevron-down"></i>
									Referencias
								</a>
							</h4>
						</div>
						<div id="referencias" class="panel-collapse collapse">
							<div class="panel-body">
								' . $_referencias_comerciales_content . '
								' . $_referencias_bancarias_content . '
							</div>
						</div>
					</div>
				';

			/****** Certificaciones ******/
			$_certificaciones_rows = "";
			$_certificaciones_content_color = 'default';
			$certificaciones = $Clientes->getListaTipoDocumentoById("7,8,9,10,11");
			$i = 0;
			foreach ($certificaciones["rowsData"] as $key => $value) {
				$_row_4 = '<span></span>';
				$_row_2 = '<span></span>';
				$_row_3 = '<span class="text-default"><strong>No registrado</strong></span>';
				if ($result["documentos"]) {
					$_flag_documento = $Clientes->buscarDocumento($result["documentos"], $value["id"]);
					if (!$_flag_documento) {
						if ($_flag_documento) {
							$i++;
							$content = $_flag_documento["content"];
							$_row_2 = '<span class="cell-detail">' . $content["numero_documento"] . '</span>';
							$_row_3 = '<span class="cell-detail">' . $content["fecha_expedicion"] . '</span>';
							$_row_4 = '
									<center>
										<a href="' . BASE_URL . 'public/files/clientes/' . $content["DOC_CLIENTE"] . '/' . $content["folder"] . '/' . $content["url_documento"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
											<span class="icon mdi mdi-download"></span>
										</a>
									</center>
								';
						}
					}
				}

				$_certificaciones_rows .= '
						<tr>
							<td class="actions-nexos">
								' . $_row_4 . '
							</td>
							<td class="cell-detail">
								<span>' . $value["nombre"] . '</span>
								<span class="cell-detail-description">' . $value["descripcion"] . '</span>
							</td>
							<td class="cell-detail">
								' . $_row_2 . '
							</td>
							<td class="cell-detail">
								' . $_row_3 . '
							</td>
						</tr>
					';
			}
			if ($i > 0) {
				$_certificaciones_content_color = 'warning';
				if ($i == $certificaciones["rowsNum"]) {
					$_certificaciones_content_color = 'success';
				}
			}

			$_certificaciones = '
					<div class="panel panel-default panel-border-color panel-border-color-' . $_certificaciones_content_color . '">
						<div class="panel-heading">
							<h4 class="panel-title">
								<a data-toggle="collapse" data-parent="#accordion1" href="#certificaciones" class="collapsed">
									<i class="icon mdi mdi-chevron-down"></i>
									Certificaciones
								</a>
							</h4>
						</div>
						<div id="certificaciones" class="panel-collapse collapse">
							<div class="panel-body">
								<div class="col-sm-2"></div>
								<div class="col-sm-8">
									<table class="table table-condensed table-striped">
										<tbody>
											' . $_certificaciones_rows . '
										</tbody>
									</table>
								</div>
								<div class="col-sm-2"></div>
							</div>
						</div>
					</div>
				';

			/****** Formatos ******/
			$_formatos = '';
			if (isset($result["servicios"]) and $result["servicios"]) {
				foreach ($result["servicios"]["rowsData"] as $key_tipo_servicio => $value_tipo_servicio) {
					switch ($value_tipo_servicio["servicio"]) {
						case 'Agenciamiento Aduanero':
							$_formatos_rows = "";
							$_formatos_content_color = 'success';
							$formatos = $Clientes->getListaTipoDocumentoById("23,24,25");

							foreach ($formatos["rowsData"] as $key => $value) {
								$_row_2 = '<span class="text-danger"><strong>No registrado</strong></span>';
								$_row_3 = '<span></span>';

								if ($result["documentos"]) {
									$_flag_documento = $Clientes->buscarDocumento($result["documentos"], $value["id"]);
									if ($_flag_documento) {
										$content = $_flag_documento["content"];
										$_row_2 = '<span class="cell-detail">' . $content["fecha_expedicion"] . '</span>';
										$_row_3 = '
												<center>
													<a href="' . BASE_URL . 'public/files/clientes/' . $content["DOC_CLIENTE"] . '/' . $content["folder"] . '/' . $content["url_documento"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
														<span class="icon mdi mdi-download"></span>
													</a>
												</center>
											';
									} else {
										$_formatos_content_color = 'danger';
									}
								} else {
									$_formatos_content_color = 'danger';
								}
								$_formatos_rows .= '
										<tr>
											<td class="actions-nexos">
												' . $_row_3 . '
											</td>
											<td class="cell-detail">
												<span>' . $value["nombre"] . '</span>
												<span class="cell-detail-description">' . $value["descripcion"] . '</span>
											</td>
											<td class="cell-detail">
												' . $_row_2 . '
											</td>
										</tr>
									';
							}

							$_formatos .= '
									<div class="panel panel-default panel-border-color panel-border-color-' . $_formatos_content_color . '">
										<div class="panel-heading">
											<h4 class="panel-title">
												<a data-toggle="collapse" data-parent="#accordion1" href="#formatos_' . strtolower(str_replace(" ", "_", $value_tipo_servicio["servicio"])) . '" class="collapsed">
													<i class="icon mdi mdi-chevron-down"></i>
													' . $value_tipo_servicio["servicio"] . '
												</a>
											</h4>
										</div>
										<div id="formatos_' . strtolower(str_replace(" ", "_", $value_tipo_servicio["servicio"])) . '" class="panel-collapse collapse">
											<div class="panel-body">
												<div class="col-sm-2"></div>
												<div class="col-sm-8">
													<table class="table table-condensed table-striped">
														<tbody>
															' . $_formatos_rows . '
														</tbody>
													</table>
												</div>
												<div class="col-sm-2"></div>
											</div>
										</div>
									</div>
								';
							break;

						case 'Transporte de Carga Nacional':
							$_formatos_rows = "";
							$_formatos_content_color = 'success';
							$formatos = $Clientes->getListaTipoDocumentoById("12,13,14");

							foreach ($formatos["rowsData"] as $key => $value) {
								$_row_2 = '<span class="text-danger"><strong>No registrado</strong></span>';
								$_row_3 = '<span></span>';

								if ($result["documentos"]) {
									$_flag_documento = $Clientes->buscarDocumento($result["documentos"], $value["id"]);
									if ($_flag_documento) {
										$content = $_flag_documento["content"];
										$_row_2 = '<span class="cell-detail">' . $content["fecha_expedicion"] . '</span>';
										$_row_3 = '
												<center>
													<a href="' . BASE_URL . 'public/files/clientes/' . $content["DOC_CLIENTE"] . '/' . $content["folder"] . '/' . $content["url_documento"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
														<span class="icon mdi mdi-download"></span>
													</a>
												</center>
											';
									} else {
										$_formatos_content_color = 'danger';
									}
								} else {
									$_formatos_content_color = 'danger';
								}
								$_formatos_rows .= '
										<tr>
											<td class="actions-nexos">
												' . $_row_3 . '
											</td>
											<td class="cell-detail">
												<span>' . $value["nombre"] . '</span>
												<span class="cell-detail-description">' . $value["descripcion"] . '</span>
											</td>
											<td class="cell-detail">
												' . $_row_2 . '
											</td>
										</tr>
									';
							}

							$_formatos .= '
									<div class="panel panel-default panel-border-color panel-border-color-' . $_formatos_content_color . '">
										<div class="panel-heading">
											<h4 class="panel-title">
												<a data-toggle="collapse" data-parent="#accordion1" href="#formatos_' . strtolower(str_replace(" ", "_", $value_tipo_servicio["servicio"])) . '" class="collapsed">
													<i class="icon mdi mdi-chevron-down"></i>
													' . $value_tipo_servicio["servicio"] . '
												</a>
											</h4>
										</div>
										<div id="formatos_' . strtolower(str_replace(" ", "_", $value_tipo_servicio["servicio"])) . '" class="panel-collapse collapse">
											<div class="panel-body">
												<div class="col-sm-2"></div>
												<div class="col-sm-8">
													<table class="table table-condensed table-striped">
														<tbody>
															' . $_formatos_rows . '
														</tbody>
													</table>
												</div>
												<div class="col-sm-2"></div>
											</div>
										</div>
									</div>
								';
							break;

						case 'Transporte de Carga Internacional':
							$_formatos_rows = "";
							$_formatos_content_color = 'success';
							$formatos = $Clientes->getListaTipoDocumentoById("26,27,28");

							foreach ($formatos["rowsData"] as $key => $value) {
								$_row_2 = '<span class="text-danger"><strong>No registrado</strong></span>';
								$_row_3 = '<span></span>';

								if ($result["documentos"]) {
									$_flag_documento = $Clientes->buscarDocumento($result["documentos"], $value["id"]);
									if ($_flag_documento) {
										$content = $_flag_documento["content"];
										$_row_2 = '<span class="cell-detail">' . $content["fecha_expedicion"] . '</span>';
										$_row_3 = '
												<center>
													<a href="' . BASE_URL . 'public/files/clientes/' . $content["DOC_CLIENTE"] . '/' . $content["folder"] . '/' . $content["url_documento"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
														<span class="icon mdi mdi-download"></span>
													</a>
												</center>
											';
									} else {
										$_formatos_content_color = 'danger';
									}
								} else {
									$_formatos_content_color = 'danger';
								}
								$_formatos_rows .= '
										<tr>
											<td class="actions-nexos">
												' . $_row_3 . '
											</td>
											<td class="cell-detail">
												<span>' . $value["nombre"] . '</span>
												<span class="cell-detail-description">' . $value["descripcion"] . '</span>
											</td>
											<td class="cell-detail">
												' . $_row_2 . '
											</td>
										</tr>
									';
							}

							$_formatos .= '
									<div class="panel panel-default panel-border-color panel-border-color-' . $_formatos_content_color . '">
										<div class="panel-heading">
											<h4 class="panel-title">
												<a data-toggle="collapse" data-parent="#accordion1" href="#formatos_' . strtolower(str_replace(" ", "_", $value_tipo_servicio["servicio"])) . '" class="collapsed">
													<i class="icon mdi mdi-chevron-down"></i>
													' . $value_tipo_servicio["servicio"] . '
												</a>
											</h4>
										</div>
										<div id="formatos_' . strtolower(str_replace(" ", "_", $value_tipo_servicio["servicio"])) . '" class="panel-collapse collapse">
											<div class="panel-body">
												<div class="col-sm-2"></div>
												<div class="col-sm-8">
													<table class="table table-condensed table-striped">
														<tbody>
															' . $_formatos_rows . '
														</tbody>
													</table>
												</div>
												<div class="col-sm-2"></div>
											</div>
										</div>
									</div>
								';
							break;

						case 'Almacenamiento':
							$_formatos_rows = "";
							$_formatos_content_color = 'success';
							$formatos = $Clientes->getListaTipoDocumentoById("29,30,31");

							foreach ($formatos["rowsData"] as $key => $value) {
								$_row_2 = '<span class="text-danger"><strong>No registrado</strong></span>';
								$_row_3 = '<span></span>';

								if ($result["documentos"]) {
									$_flag_documento = $Clientes->buscarDocumento($result["documentos"], $value["id"]);
									if ($_flag_documento) {
										$content = $_flag_documento["content"];
										$_row_2 = '<span class="cell-detail">' . $content["fecha_expedicion"] . '</span>';
										$_row_3 = '
												<center>
													<a href="' . BASE_URL . 'public/files/clientes/' . $content["DOC_CLIENTE"] . '/' . $content["folder"] . '/' . $content["url_documento"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
														<span class="icon mdi mdi-download"></span>
													</a>
												</center>
											';
									} else {
										$_formatos_content_color = 'danger';
									}
								} else {
									$_formatos_content_color = 'danger';
								}
								$_formatos_rows .= '
										<tr>
											<td class="actions-nexos">
												' . $_row_3 . '
											</td>
											<td class="cell-detail">
												<span>' . $value["nombre"] . '</span>
												<span class="cell-detail-description">' . $value["descripcion"] . '</span>
											</td>
											<td class="cell-detail">
												' . $_row_2 . '
											</td>
										</tr>
									';
							}

							$_formatos .= '
									<div class="panel panel-default panel-border-color panel-border-color-' . $_formatos_content_color . '">
										<div class="panel-heading">
											<h4 class="panel-title">
												<a data-toggle="collapse" data-parent="#accordion1" href="#formatos_' . strtolower(str_replace(" ", "_", $value_tipo_servicio["servicio"])) . '" class="collapsed">
													<i class="icon mdi mdi-chevron-down"></i>
													' . $value_tipo_servicio["servicio"] . '
												</a>
											</h4>
										</div>
										<div id="formatos_' . strtolower(str_replace(" ", "_", $value_tipo_servicio["servicio"])) . '" class="panel-collapse collapse">
											<div class="panel-body">
												<div class="col-sm-2"></div>
												<div class="col-sm-8">
													<table class="table table-condensed table-striped">
														<tbody>
															' . $_formatos_rows . '
														</tbody>
													</table>
												</div>
												<div class="col-sm-2"></div>
											</div>
										</div>
									</div>
								';
							break;
					}
				}
			}

			/****** Seguridad ******/
			$_seguridad_content_color = 'success';
			// Cliente
			$_cliente_rows = "";
			$seguridad = $Clientes->getListaTipoDocumentoById("15,17,18");
			foreach ($seguridad["rowsData"] as $key => $value) {
				$_row_2 = '<span class="text-danger"><strong>No registrado</strong></span>';
				$_row_3 = '<span></span>';
				$_novedad = '';
				$_file_color = 'actions-nexos';

				if ($result["documentos"]) {
					$_flag_documento = $Clientes->buscarDocumento($result["documentos"], $value["id"]);
					if ($_flag_documento) {
						$content = $_flag_documento["content"];
						$_row_2 = '<span class="cell-detail">' . $content["fecha_expedicion"] . '</span>';
						$_row_3 = '
								<center>
									<a href="' . BASE_URL . 'public/files/clientes/' . $content["DOC_CLIENTE"] . '/' . $content["folder"] . '/' . $content["url_documento"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
										<span class="icon mdi mdi-download"></span>
									</a>
								</center>
							';
						$_novedad = $content["novedad"];
						if ($_novedad) {
							$_file_color = 'nexos-txt-danger';
						}
					} else {
						$_seguridad_content_color = 'danger';
					}
				} else {
					$_seguridad_content_color = 'danger';
				}
				$_descripcion_documento = '';
				if ($value["descripcion"]) {
					$_descripcion_documento = ' (' . $value["descripcion"] . ')';
				}
				$_cliente_rows .= '
						<tr>
							<td class="' . $_file_color . '">
								' . $_row_3 . '
							</td>
							<td class="cell-detail">
								<span>' . $value["nombre"] . $_descripcion_documento . '</span>
								<span class="cell-detail-description">' . $_novedad . '</span>
							</td>
							<td class="cell-detail">
								' . $_row_2 . '
							</td>
						</tr>
					';
			}

			// Representante legal
			$_representante_content = '
					<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<strong>Error!</strong>
							<p>No se ha registrado información del representante legal de éste cliente...</p>
						</div>
					</div>
				';
			if ($result["representante_legal"]) {
				$_representante_rows = '';

				$seguridad = $Clientes->getListaTipoDocumentoById("15,16");
				foreach ($seguridad["rowsData"] as $key => $value) {
					$_row_2 = '<span class="text-danger"><strong>No registrado</strong></span>';
					$_row_3 = '<span></span>';
					$_novedad = '';
					$_file_color = 'actions-nexos';

					if ($result["documentos_miembros"]) {
						$_flag_documento = $Clientes->buscarDocumentoRespresentante($result["documentos_miembros"], $value["id"], "Representante Legal");
						if (!$_flag_documento) {
							if (isset($_flag_documento["flag"])) {
								$content = $_flag_documento["content"];
								$_row_2 = '<span class="cell-detail">' . $content["fecha_expedicion"] . '</span>';
								$_row_3 = '
										<center>
											<a href="' . BASE_URL . 'public/files/clientes/' . $content["DOC_CLIENTE"] . '/' . $content["tipo_miembro"] . '/' . $content["documento"] . '/' . $content["folder"] . '/' . $content["url"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
												<span class="icon mdi mdi-download"></span>
											</a>
										</center>
									';
								$_novedad = $content["novedad"];
								if ($_novedad) {
									$_file_color = 'nexos-txt-danger';
								}
							} else {
								$_seguridad_content_color = 'danger';
							}
						} else {
							$_seguridad_content_color = 'danger';
						}
					} else {
						$_seguridad_content_color = 'danger';
					}
					$_descripcion_documento = '';
					if ($value["descripcion"]) {
						$_descripcion_documento = ' (' . $value["descripcion"] . ')';
					}

					$_representante_rows .= '
							<tr>
								<td class="cell-detail ' . $_file_color . '">
									' . $_row_3 . '
								</td>
								<td class="cell-detail text-left">
									<span>' . $value["nombre"] . $_descripcion_documento . '</span>
									<span class="cell-detail-description">' . $_novedad . '</span>
								</td>
								<td class="cell-detail text-left">
									' . $_row_2 . '
								</td>
							</tr>
						';
				}

				$_representante_table = '
						<table class="table table-condensed table-striped">
							<tbody>
								' . $_representante_rows . '
							</tbody>
						</table>
					';

				$value = $result["representante_legal"]["rowsData"][0];
				$_representante_content = '
						<strong>Representante Legal o Suplente</strong>
						<table class="table table-condensed" style="margin-bottom: 0;">
							<tbody>
								<tr>
									<td class="cell-detail actions-nexos">
										<div class="col-sm-3">
											<center>
												<a href="' . BASE_URL . 'public/files/clientes/' . $representante["DOC_CLIENTE"] . '/' . $representante["tipo_miembro"] . '/' . $representante["documento"] . '/' . $representante["folder"] . '/' . $representante["url"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
													<span class="icon mdi mdi-download"></span>
												</a>
											</center>
										</div>
										<div class="col-sm-9">
											<span>' . $value["nombre_miembro"] . '</span>
											<span class="cell-detail-description">' . $value["documento"] . '</span>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
						' . $_representante_table . '
					';
			} else {
				$_seguridad_content_color = 'danger';
			}

			// Revisor Fiscal
			$_revisor_content = '
					<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<strong>Error!</strong>
							<p>No se ha registrado información del revisor fiscal de éste cliente...</p>
						</div>
					</div>
				';
			if ($result["revisor_fiscal"]) {
				$_revisor_rows = '';

				$seguridad = $Clientes->getListaTipoDocumentoById("15,16");
				foreach ($seguridad["rowsData"] as $key => $value) {
					$_row_2 = '<span class="text-danger"><strong>No registrado</strong></span>';
					$_row_3 = '<span></span>';
					$_novedad = '';
					$_file_color = 'actions-nexos';

					if ($result["documentos_miembros"]) {
						$_flag_documento = $Clientes->buscarDocumentoRespresentante($result["documentos_miembros"], $value["id"], "Revisor Fiscal");
						if (isset($_flag_documento["flag"])) {
							$content = $_flag_documento["content"];
							$_row_2 = '<span class="cell-detail">' . $content["fecha_expedicion"] . '</span>';
							$_row_3 = '
									<center>
										<a href="' . BASE_URL . 'public/files/clientes/' . $content["DOC_CLIENTE"] . '/' . $content["tipo_miembro"] . '/' . $content["documento"] . '/' . $content["folder"] . '/' . $content["url"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
											<span class="icon mdi mdi-download"></span>
										</a>
									</center>
								';
							$_novedad = $content["novedad"];
							if ($_novedad) {
								$_file_color = 'nexos-txt-danger';
							}
						} else {
							$_seguridad_content_color = 'danger';
						}
					} else {
						$_seguridad_content_color = 'danger';
					}
					$_descripcion_documento = '';
					if ($value["descripcion"]) {
						$_descripcion_documento = ' (' . $value["descripcion"] . ')';
					}

					$_revisor_rows .= '
							<tr>
								<td class="cell-detail ' . $_file_color . '">
									' . $_row_3 . '
								</td>
								<td class="cell-detail text-left">
									<span>' . $value["nombre"] . $_descripcion_documento . '</span>
									<span class="cell-detail-description">' . $_novedad . '</span>
								</td>
								<td class="cell-detail text-left">
									' . $_row_2 . '
								</td>
							</tr>
						';
				}

				$_revisor_table = '
						<table class="table table-condensed table-striped">
							<tbody>' . $_revisor_rows . '</tbody>
						</table>
					';

				$value = $result["revisor_fiscal"]["rowsData"][0];
				$_revisor_link = '';
				if ($value["url"]) {
					$_revisor_link = '
							<center>
								<a href="' . BASE_URL . 'public/files/clientes/' . $value["DOC_CLIENTE"] . '/' . $value["tipo_miembro"] . '/' . $value["documento"] . '/' . $value["folder"] . '/' . $value["url"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
									<span class="icon mdi mdi-download"></span>
								</a>
							</center>
						';
				}
				$_revisor_content = '
						<strong>Revisor Fiscal</strong>
						<table class="table table-condensed" style="margin-bottom: 0;">
							<tbody>
								<tr>
									<td class="cell-detail actions-nexos">
										<div class="col-sm-3">' . $_revisor_link . '</div>
										<div class="col-sm-9">
											<span>' . $value["nombre_miembro"] . '</span>
											<span class="cell-detail-description">' . $value["documento"] . '</span>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
						' . $_revisor_table . '
					';
			} else {
				$_seguridad_content_color = 'danger';
			}

			// Socios
			$_socios_content = '
					<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<strong>Atención!</strong>
							<p>No se ha registrado información de los socios de éste cliente...</p>
						</div>
					</div>
				';
			if ($result["socios"]) {
				$_socios_table = '';
				$seguridad = $Clientes->getListaTipoDocumentoById("16,15");
				foreach ($result["socios"]["rowsData"] as $key_socios => $value_socios) {
					$_socios_rows = '';
					foreach ($seguridad["rowsData"] as $key => $value) {
						$_row_2 = '<span class="text-danger"><strong>No registrado</strong></span>';
						$_row_3 = '<span></span>';
						$_novedad = '';
						$_file_color = 'actions-nexos';

						if ($result["documentos_miembros"]) {
							// $_flag_documento = $Clientes->buscarDocumentoRespresentante( $result["documentos_miembros"], $value[0], "Socio" );
							// $_flag_documento = $Clientes->buscarDocumentoSocio($result["documentos_miembros"], $value_socios[0], $value[0], "Socio");
							$_flag_documento = $Clientes->buscarDocumentoSocio($result["documentos_miembros"], $value_socios['id'], $value['id'], "Socio");
							if (isset($_flag_documento["flag"])) {
								$content = $_flag_documento["content"];
								$_row_2 = '<span class="cell-detail">' . $content["fecha_expedicion"] . '</span>';
								$_row_3 = '
										<center>
											<a href="' . BASE_URL . 'public/files/clientes/' . $content["DOC_CLIENTE"] . '/' . $content["tipo_miembro"] . '/' . $content["documento"] . '/' . $content["folder"] . '/' . $content["url"] . '" target="_blank" class="icon hint--top" data-hint="Descargar Documento">
												<span class="icon mdi mdi-download"></span>
											</a>
										</center>
									';
								$_novedad = $content["novedad"];
								if ($_novedad) {
									$_file_color = 'nexos-txt-danger';
								}
							} else {
								$_seguridad_content_color = 'danger';
							}
						} else {
							$_seguridad_content_color = 'danger';
						}
						$_descripcion_documento = '';
						if ($value["descripcion"]) {
							$_descripcion_documento = ' (' . $value["descripcion"] . ')';
						}
						$_descripcion_documento = '';
						if ($value["descripcion"]) {
							$_descripcion_documento = ' (' . $value["descripcion"] . ')';
						}
						$_socios_rows .= '
								<tr>
									<td class="' . $_file_color . '">
										' . $_row_3 . '
									</td>
									<td class="cell-detail text-left">
										<span>' . $value["nombre"] . $_descripcion_documento . '</span>
										<span class="cell-detail-description">' . $_novedad . '</span>
									</td>
									<td class="cell-detail text-left">
										' . $_row_2 . '
									</td>
								</tr>
							';
					}

					$_socios_table .= '
							<strong>' . $value_socios["nombre_miembro"] . ' (' . $value_socios["documento"] . ')</strong>
							<table class="table table-condensed table-striped">
								<tbody>
									' . $_socios_rows . '
								</tbody>
							</table>
						';
				}
				$_socios_content = '
						<strong>Socios</strong>
						<table class="table table-condensed">
							<tbody>
								<tr>
									<td>
										' . $_socios_table . '
									</td>
								</tr>
							</tbody>
						</table>
					';
			}

			$_seguridad = '
					<div class="panel panel-default panel-border-color panel-border-color-' . $_seguridad_content_color . '">
						<div class="panel-heading">
							<h4 class="panel-title">
								<a data-toggle="collapse" data-parent="#accordion1" href="#seguridad" class="collapsed">
									<i class="icon mdi mdi-chevron-down"></i>
									Estudio Seguridad
								</a>
							</h4>
						</div>
						<div id="seguridad" class="panel-collapse collapse">
							<div class="panel-body">
								<div class="col-sm-2"></div>
								<div class="col-sm-8">
									<strong>Cliente</strong>
									<table class="table table-condensed table-striped">
										<tbody>
											' . $_cliente_rows . '
										</tbody>
									</table>
								</div>
								<div class="col-sm-2"></div>
								<div class="col-sm-12"></div>
								<div class="col-sm-2"></div>
								<div class="col-sm-8">
									' . $_representante_content . '
								</div>
								<div class="col-sm-2"></div>
								<div class="col-sm-12"></div>
								<div class="col-sm-2"></div>
								<div class="col-sm-8">
									' . $_revisor_content . '
								</div>
								<div class="col-sm-2"></div>
								<div class="col-sm-12"></div>
								<div class="col-sm-2"></div>
								<div class="col-sm-8">
									' . $_socios_content . '
								</div>
								<div class="col-sm-2"></div>
							</div>
						</div>
					</div>
				';

			/****** Ficha técnica ******/
			$ficha_tecnica = $result["general"]["rowsData"][0];

			// Seguridad
			$seg_cond_cargue = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["seg_cond_cargue"]) {
				$seg_cond_cargue = '<span class="cell-detail-description">' . $ficha_tecnica["seg_cond_cargue"] . '</span>';
			}

			$seg_cond_seguridad = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["seg_cond_seguridad"]) {
				$seg_cond_seguridad = '<span class="cell-detail-description">' . $ficha_tecnica["seg_cond_seguridad"] . '</span>';
			}

			$_ficha_seguridad = '
					<strong>Seguridad</strong>
					<table class="table">
						<tbody>
							<tr>
								<td class="cell-detail">
									<div class="row">
										<div class="col-sm-6">
											<span>Condiciones de Cargue y Descargue</span>
											' . $seg_cond_cargue . '
										</div>
										<div class="col-sm-6">
											<span>Condiciones de Seguridad</span>
											' . $seg_cond_seguridad . '
										</div>
									</div>
								</td>
							</tr>
							<tr><td></td></tr>
						</tbody>
					</table>
				';

			// Operaciones
			$op_cond_planillar = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["op_cond_planillar"]) {
				$op_cond_planillar = '<span class="cell-detail-description">' . $ficha_tecnica["op_cond_planillar"] . '</span>';
			}

			$op_cond_cumplir = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["op_cond_cumplir"]) {
				$op_cond_cumplir = '<span class="cell-detail-description">' . $ficha_tecnica["op_cond_cumplir"] . '</span>';
			}

			$op_poliza_nexos = '<span class="cell-detail-description">No</span>';
			if ($ficha_tecnica["op_poliza_nexos"] == 1) {
				$op_poliza_nexos = '<span class="cell-detail-description">Si</span>';
			}

			$_ficha_operaciones = '
					<strong>Operaciones</strong>
					<table class="table">
						<tbody>
							<tr>
								<td class="cell-detail">
									<div class="row">
										<div class="col-sm-5">
											<span>Condiciones para Planillar</span>
											' . $op_cond_planillar . '
										</div>
										<div class="col-sm-5">
											<span>Condiciones para Cumplir</span>
											' . $op_cond_cumplir . '
										</div>
										<div class="col-sm-2">
											<span>Usa póliza Nexos</span>
											' . $op_poliza_nexos . '
										</div>
									</div>
								</td>
							</tr>
							<tr><td></td></tr>
						</tbody>
					</table>
				';

			// Facturación
			$fac_cond_cumplir = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["fac_cond_cumplir"]) {
				$fac_cond_cumplir = '<span class="cell-detail-description">' . $ficha_tecnica["fac_cond_cumplir"] . '</span>';
			}

			$fac_cond_facturar = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["fac_cond_facturar"]) {
				$fac_cond_facturar = '<span class="cell-detail-description">' . $ficha_tecnica["fac_cond_facturar"] . '</span>';
			}

			$fac_dia_max_facturacion = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["fac_dia_max_facturacion"]) {
				$fac_dia_max_facturacion = '<span class="cell-detail-description">' . $ficha_tecnica["fac_dia_max_facturacion"] . '</span>';
			}

			$fac_horario_atencion = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["fac_horario_atencion"]) {
				$fac_horario_atencion = '<span class="cell-detail-description">' . $ficha_tecnica["fac_horario_atencion"] . '</span>';
			}

			$fac_direccion_radicacion = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["fac_direccion_radicacion"]) {
				$fac_direccion_radicacion = '<span class="cell-detail-description">' . $ficha_tecnica["fac_direccion_radicacion"] . '</span>';
			}

			$_ficha_facturacion = '
					<strong>Facturación</strong>
					<table class="table">
						<tbody>
							<tr>
								<td class="cell-detail">
									<div class="form-group col-sm-6">
										<span>Condiciones para Cumplir</span>
										' . $fac_cond_cumplir . '
									</div>
									<div class="form-group col-sm-6">
										<span>Condiciones para Facturar</span>
										' . $fac_cond_facturar . '
									</div>
									<div class="col-sm-4">
										<span>Dirección radicación</span>
										' . $fac_direccion_radicacion . '
									</div>
									<div class="col-sm-4">
										<span>Día máximo de radicación</span>
										' . $fac_dia_max_facturacion . '
									</div>
									<div class="col-sm-4">
										<span>Horario de atención</span>
										' . $fac_horario_atencion . '
									</div>
								</td>
							</tr>
							<tr><td></td></tr>
						</tbody>
					</table>
				';

			// Tesorería
			$tes_plazo_pagos = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["tes_plazo_pagos"]) {
				$tes_plazo_pagos = '<span class="cell-detail-description">' . $ficha_tecnica["tes_plazo_pagos"] . '</span>';
			}

			$tes_dias_pagos = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["tes_dias_pagos"]) {
				$tes_dias_pagos = '<span class="cell-detail-description">' . $ficha_tecnica["tes_dias_pagos"] . '</span>';
			}

			$tes_dias_informacion = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["tes_dias_informacion"]) {
				$tes_dias_informacion = '<span class="cell-detail-description">' . $ficha_tecnica["tes_dias_informacion"] . '</span>';
			}

			$tes_instruccion_pago = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["tes_instruccion_pago"]) {
				$tes_instruccion_pago = '<span class="cell-detail-description">' . $ficha_tecnica["tes_instruccion_pago"] . '</span>';
			}

			$_ficha_tesoreria = '
					<strong>Tesorería</strong>
					<table class="table">
						<tbody>
							<tr>
								<td class="cell-detail">
									<div class="form-group col-sm-4">
										<span>Plazo para pagos</span>
										' . $tes_plazo_pagos . '
									</div>
									<div class="form-group col-sm-4">
										<span>Días de pago</span>
										' . $tes_dias_pagos . '
									</div>
									<div class="form-group col-sm-4">
										<span>Días de información</span>
										' . $tes_dias_informacion . '
									</div>
									<div class="col-sm-12">
										<span>Instrucción de pago</span>
										' . $tes_instruccion_pago . '
									</div>
								</td>
							</tr>
							<tr><td></td></tr>
						</tbody>
					</table>
				';

			$_ficha_tecnica_content_color = 'danger';
			if ($ficha_tecnica["fac_cond_cumplir"] and $ficha_tecnica["fac_cond_facturar"] and $ficha_tecnica["fac_dia_max_facturacion"] and $ficha_tecnica["fac_horario_atencion"] and $ficha_tecnica["fac_direccion_radicacion"] and $ficha_tecnica["tes_plazo_pagos"] and $ficha_tecnica["tes_dias_pagos"] and $ficha_tecnica["tes_dias_informacion"] and $ficha_tecnica["tes_instruccion_pago"]) {
				$_ficha_tecnica_content_color = 'success';
			}

			$_ficha_tecnica = '
					<div class="panel panel-default panel-border-color panel-border-color-' . $_ficha_tecnica_content_color . '">
						<div class="panel-heading">
							<h4 class="panel-title">
								<a data-toggle="collapse" data-parent="#accordion1" href="#v_ficha_tecnica" class="collapsed">
									<i class="icon mdi mdi-chevron-down"></i>
									Ficha Técnica
								</a>
							</h4>
						</div>
						<div id="v_ficha_tecnica" class="panel-collapse collapse">
							<div class="panel-body">
								' . $_ficha_seguridad . '
								' . $_ficha_operaciones . '
								' . $_ficha_facturacion . '
								' . $_ficha_tesoreria . '
							</div>
						</div>
					</div>
				';

			/****** Finanzas ******/
			$ingreso_neto_mensual = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["ingreso_neto_mensual"]) {
				$ingreso_neto_mensual = '<span class="cell-detail-description">$ ' . number_format($ficha_tecnica["ingreso_neto_mensual"], 0, ",", ".") . '</span>';
			}

			$pasivos_corrientes = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["pasivos_corrientes"]) {
				$pasivos_corrientes = '<span class="cell-detail-description">$ ' . number_format($ficha_tecnica["pasivos_corrientes"], 0, ",", ".") . '</span>';
			}

			$pasivos_no_corrientes = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["pasivos_no_corrientes"]) {
				$pasivos_no_corrientes = '<span class="cell-detail-description">$ ' . number_format($ficha_tecnica["pasivos_no_corrientes"], 0, ",", ".") . '</span>';
			}

			$capacidad_endeudamiento = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["capacidad_endeudamiento"]) {
				$capacidad_endeudamiento = '<span class="cell-detail-description">$ ' . number_format($ficha_tecnica["capacidad_endeudamiento"], 0, ",", ".") . '</span>';
			}

			$cupo_credito_base = '<span class="cell-detail-description"><strong class="text-danger">No Registrado.</strong></span>';
			if ($ficha_tecnica["cupo_credito_base"]) {
				$cupo_credito_base = '<span class="cell-detail-description">$ ' . number_format($ficha_tecnica["cupo_credito_base"], 0, ",", ".") . '</span>';
			}

			$_flag_calificaciones = false;
			$_calificaciones = '
					<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<strong>Error!</strong>
							<p>No se ha registrado información de calificaciones CIFIN de éste cliente...</p>
						</div>
					</div>
				';

			if (isset($result["calificaciones_CIFIN"]) and $result["calificaciones_CIFIN"]) {
				$_flag_calificaciones = true;
				$calificaciones = $result["calificaciones_CIFIN"]["rowsData"];

				$_calificaciones = '
						<div class="col-sm-3"></div>
						<div class="col-sm-6">
							<strong>Calificaciones CIFIN</strong>
							<table class="table table-condensed table-striped">
								<tbody>
					';
				foreach ($calificaciones as $key => $value) {
					$_calificaciones .= '
							<tr>
								<td>
									<span>' . $value["entidad_financiera"] . '</span>
								</td>
								<td class="text-center">
									<span>' . $value["calificacion"] . '</span>
								</td>
							</tr>
						';
				}
				$_calificaciones .= '
								</tbody>
							</table>
						</div>
						<div class="col-sm-3"></div>
					';
			}

			$finanzas_content_color = 'danger';
			if ($ficha_tecnica["ingreso_neto_mensual"] and $ficha_tecnica["pasivos_corrientes"] and $ficha_tecnica["pasivos_no_corrientes"] and $ficha_tecnica["capacidad_endeudamiento"] and $ficha_tecnica["cupo_credito_base"] and $_flag_calificaciones) {
				$finanzas_content_color = 'success';
			}

			$_finanzas = '
					<div class="panel panel-default panel-border-color panel-border-color-' . $finanzas_content_color . '">
						<div class="panel-heading">
							<h4 class="panel-title">
								<a data-toggle="collapse" data-parent="#accordion1" href="#v_finanzas" class="collapsed">
									<i class="icon mdi mdi-chevron-down"></i>
									Finanzas
								</a>
							</h4>
						</div>
						<div id="v_finanzas" class="panel-collapse collapse">
							<div class="panel-body">
								<table class="table">
									<tbody>
										<tr>
											<td class="cell-detail">
												<div class="form-group col-sm-4">
													<span>Ingreso Neto Mensual</span>
													' . $ingreso_neto_mensual . '
												</div>
												<div class="form-group col-sm-4">
													<span>Pasivos Corrientes</span>
													' . $pasivos_corrientes . '
												</div>
												<div class="form-group col-sm-4">
													<span>Pasivos No Corrientes</span>
													' . $pasivos_no_corrientes . '
												</div>
												<div class="col-sm-12"></div>
												<div class="col-sm-2"></div>
												<div class="col-sm-4">
													<span>Capacidad Endeudamiento</span>
													' . $capacidad_endeudamiento . '
												</div>
												<div class="col-sm-4">
													<span>Cupo de Crédito</span>
													' . $cupo_credito_base . '
												</div>
												<div class="col-sm-2"></div>
											</td>
										</tr>
										<tr><td></td></tr>
									</tbody>
								</table>
								' . $_calificaciones . '
							</div>
						</div>
					</div>
				';

			//Sedes cliente
			$_info_sedes = '';
			if (isset($result["sedes_cliente"]["rowsData"]) and $result["sedes_cliente"]["rowsData"]) {
				$_info_sedes .= '<div class="rows">
						<table class="table table-condensed table-striped">
							<thead>
								<tr><td>Sede</td>
								<td>Encargado</td>
								<td>Teléfono</td>
								<td>Municipio</td>
								<td>Dirección</td>
								<td>Acción</td>
								</tr>
							</thead>
							<tbody>';

				foreach ($result["sedes_cliente"]["rowsData"] as $key => $value) {
					$elimina = "<button id='elimina" . $value["id"] . "' class='mdi mdi-delete' onclick='elimina_sede(" . $value["id"] . ")'></button>";
					$_info_sedes .= '<tr>
							<td>' . $value["nombre_sede"] . '</td>
							<td>' . $value["encargado"] . '</td>
							<td>' . $value["telefono"] . '</td>
							<td>' . $value["municipio"] . ' | ' . $value["depto"] . '</td>
							<td>' . $value["direccion"] . '</td>
							<td>' . $elimina . '</td>
						</tr>';
				}
				$_info_sedes .= '
						</tbody>
						</table>
					</div>';
				// Se filtra el contenido de la barra de progreso de los documentros del cliente
				$_progress_bar_color = "success";
				$_porcentaje = 100;
				$_barra_documentos = '
						<span class="progress-value">' . $_porcentaje . '%</span>
						<div class="progress">
							<div style="width: ' . $_porcentaje . '%;" class="progress-bar ' . $_progress_bar_color . '"></div>
						</div>';
			} else {
				$_progress_bar_color = "danger";
				$_porcentaje = 0;
				$_info_sedes = '
					<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<strong>Error!</strong>
							<p>No se encontró sedes del cliente...</p>
						</div>
					</div>
				';
			}

			/*$_SedeCliente='<div class="panel panel-default panel-border-color panel-border-color-'.$_progress_bar_color.'">
            <div class="panel-heading">
            <h4 class="panel-title">
            <a data-toggle="collapse" data-parent="#accordion18" href="#info_sede_cliente">
            <i class="icon mdi mdi-chevron-down"></i>
            Sedes
            </a>
            </h4>
            </div>
            <div id="info_sede_cliente" class="panel-collapse collapse">
            <div class="panel-body">
            ' . $_info_sedes . '
            </div>
            </div>
            </div>';*/

			//VISTA DE TRANSIMISIONES
			$consulta_Transmision = '<div class="panel panel-default panel-border-color panel-border-color-' . $_progress_bar_color . '">
						<div class="panel-heading">
							<h4 class="panel-title">
								<a data-toggle="collapse" data-parent="#accordion18" href="#info_rndc">
									<i class="icon mdi mdi-chevron-down"></i>
									Consulta Rndc
								</a>
							</h4>
						</div>
						<div id="info_rndc" class="panel-collapse collapse">
							<div class="panel-body" id="panel_rndc">

							</div>
						</div>
					</div>';

			$consulta_Oet = '<div class="panel panel-default panel-border-color panel-border-color-' . $_progress_bar_color . '">
						<div class="panel-heading">
							<h4 class="panel-title">
								<a data-toggle="collapse" data-parent="#accordion18" href="#info_oet">
									<i class="icon mdi mdi-chevron-down"></i>
									Consulta Oet
								</a>
							</h4>
						</div>
						<div id="info_oet" class="panel-collapse collapse">
							<div class="panel-body" id="panel_oet">

							</div>
						</div>
					</div>';

			$_msg_content = '
					<div id="accordion1" class="panel-group accordion">
						' . $_info_basica . '
						' . $_documentos . '
						' . $_referencias . '
						' . $_certificaciones . '
						' . $_formatos . '
						' . $_seguridad . '
						' . $_ficha_tecnica . '
						' . $_finanzas . '
						' . $consulta_Transmision . '
						' . $consulta_Oet . '
					</div>';
		}
		break;

	case 'formCreaCliente':
		$_msg_control .= "Entro en la accion formCreaCliente.\n";

		$_msg_content .= '
				' . $Clientes->getEnumCheckTipoServicio("servicio", "") . '
				<div id="info" class="tab-pane active cont">
					<div class="tab-container">
						<ul class="nav nav-tabs nav-tabs-success">
							<li class="active"><a href="#info_basico" data-toggle="tab">Información General</a></li>
							<li><a href="#info_ubicacion" data-toggle="tab">Ubicación</a></li>
							<li><a href="#info_responsables" data-toggle="tab">Responsables</a></li>
						<!-- <li><a href="#info_sedes1" data-toggle="tab">Sede</a></li> -->
						</ul>
						<div class="tab-content">
							<div id="info_basico" class="tab-pane active cont">
								<div class="form-group col-sm-3">
									<label class="control-label">(*) Tipo de Documento:</label>
									' . $Clientes->getEnumSlctTipoDocumento_sm("tipo_documento", "", "") . '
								</div>
								<div class="form-group col-sm-3">
									<label class="control-label">(*) Régimen:</label>
									' . $Clientes->getEnumSlctRegimen_sm("regimen", "", "") . '
								</div>
								<div class="form-group col-sm-3">
									<label class="control-label">(*) Documento:</label>
									<input type="number" min="0" name="documento" id="documento" placeholder="Nit" class="form-control input-sm" onkeyup="Validar_Documento(event);">
									<span id="mensajeDocumento" style="color: red;"></span>
									</div>
								<div class="form-group col-sm-3">
									<label class="control-label">(*) Dígito Verficación:</label>
									<input type="number" min="0" name="digito_verificacion" id="digito_verificacion" placeholder="# Verificación" class="form-control input-sm" readonly="readonly">
								</div>
								<div class="form-group col-sm-6">
									<label class="control-label">(*) Nombre o Razón social:</label>
									<input type="text" name="nombre" id="nombre" placeholder="Nombre Cliente" class="form-control input-sm" onkeyup="Validar_Nombre(event);">
									<span id="mensajeNombre" style="color: red;"></span>
								</div>
								<div class="form-group col-sm-2">
									<label class="control-label">(*) Tipo Sociedad:</label>
									' . $Clientes->getEnumSlctTipoSociedad_sm("tipo_sociedad", "", "") . '
								</div>
								<div class="form-group col-sm-4">
									<label class="control-label">(*) Sigla:</label>
									<input type="text" name="sigla" id="sigla" placeholder="Sigla" class="form-control input-sm">
								</div>
								<div class="form-group col-sm-12">
									<label class="control-label">(*) Actividad:</label>
									<textarea name="actividad_cliente" id="actividad_cliente" class="form-control input-sm" data-parsley-id="73" required=""></textarea>
								</div>
								<div class="form-group col-sm-4">
									<label class="control-label"> Número Formulario RUT:</label>
									<input type="number" min="0" name="numero_formulario" id="numero_formulario" class="form-control input-sm" onkeyup="Valida_Longitud(event);">
									<span id="mensajeRut" style="color: red;"></span>
									</div>
								<div class="form-group col-sm-4">
									<label class="control-label"> Fecha Renovación RUT:</label>
									<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
										<input size="10" type="text" value="" name="rut_expedicion" id="rut_expedicion" readonly="" class="form-control input-sm">
										<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
									</div>
								</div>
								<div class="form-group col-sm-4">
									<label class="control-label"> Adjunto RUT:</label><br />
									<input type="file" name="rut_file" id="rut_file" class="inputfile">
									<label for="rut_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
								</div>
								<div class="form-group col-sm-2"></div>
								<div class="form-group col-sm-4">
									<label class="control-label">(*) CIIU Separados por (<strong>,</strong>):</label>
									<input type="text" name="ciiu_principal" id="ciiu_principal" class="form-control input-sm">
								</div>
								<div class="form-group col-sm-4">
									<label class="control-label">Actividad Aduanera Separados por (<strong>,</strong>):</label>
									<input type="text" name="actividad_aduanera" id="actividad_aduanera" class="form-control input-xs">
								</div>
								<div class="form-group col-sm-2"></div>
							</div>
							<div id="info_ubicacion" class="tab-pane cont">

							<div class="row">
								<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
									<label>(*) Nombre Sede:</label>
									<input type="text" id="sede" class="form-control input-xs" onkeyup="Valida_Sede(event);">
									<span id="mensajesede" style="color: red;"></span>
								</div>
								<div class="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
									<label class="control-label">(*) Ciudad:</label>
									' . $Municipio->getHtmlSelect_sm("ciudad", "", "") . '
								</div>
							</div>

							<div class="row">
								<div class="form-group col-xs-12 col-sm-4 col-md-4 col-lg-4">
									<label class="control-label">Código Postal</label>
									<input type="number" name="codigo_postal" id="codigo_postal" min="0" placeholder="Código Postal"
										class="form-control input-xs">
								</div>

								<div class="form-group col-xs-12 col-sm-4 col-md-4 col-lg-4">
									<label class="control-label">(*) Dirección:</label>
									<button class="btn-success mdi mdi-home btn-xs" id="mascara_direccion"></button>
									<input type="text" name="direccion" id="direccion" placeholder="Dirección" class="form-control input-xs" readonly="readonly" onChange="Valida_Direccion(this.value)">
									<span id="mensajeDireccion" style="color: red;"></span>
									</div>

								<div class="form-group col-xs-12 col-sm-4 col-md-4 col-lg-4">
									<label class="control-label">(*) Teléfono:</label>
									<input type="number" name="telefono" id="telefono" min="0" max="10" placeholder="Teléfono" onkeyup="Validar_Telefono(event);"
										class="form-control input-xs" require>
										<span id="mensajeTelefono" style="color: red;"></span>
								</div>
							</div>

							<div class="form-group col-xs-12 col-sm-12 col-md-12 col-lg-12" id="div_mascara">
								<div class="col-sm-12">
									<hr style="background:blue;">
									</hr>
									<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
										<label><strong>Generador Dirección</strong></label>
									</div>
									<div class="col-xs-3 col-sm-3 col-md-3">
										<div class="be-checkbox inline">
											<input type="checkbox" id="Complement" class="form-control input-sm comple_direc">
											<label for="Complement">¿Complemento?</label>
										</div>
									</div>
									<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
										<button id="limpiar" class="btn-xs btn-info">Limpiar</button>
									</div>
									<div class="col-sm-12">
										<hr />
									</div>
								</div>
								<div class="col-sm-3">
									<label><strong>Tipo vía:(*)</strong></label>
									<select id="di_tipovia" class="form-control input-xs address">
										<option value="">Seleccione</option>
										<option value="AC">AC Avenida calle</option>
										<option value="AD">AD Administración</option>
										<option value="ADL">ADL Adelante</option>
										<option value="AER">AER Aeropuerto</option>
										<option value="AG">AG Agencia</option>
										<option value="AGP">AGP Agrupación</option>
										<option value="AK">AK Avenida carrera</option>
										<option value="AL">AL Altillo</option>
										<option value="ALD">ALD Al lado</option>
										<option value="ALM">ALM Almacén</option>
										<option value="AP">AP Apartamento</option>
										<option value="APTDO">APTDO Apartado</option>
										<option value="ATR">ATR Atrás</option>
										<option value="AUT">AUT Autopista</option>
										<option value="AV">AV Avenida</option>
										<option value="AVIAL">AVIAL Anillo vial</option>
										<option value="BG">BG Bodega</option>
										<option value="BL">BL Bloque</option>
										<option value="BLV">BLV Boulevard</option>
										<option value="BR">BR Barrio</option>
										<option value="C">C Corregimiento</option>
										<option value="CA">CA Casa</option>
										<option value="CAS">CAS Caserío</option>
										<option value="CC">CC Centro comercial</option>
										<option value="CD">CD Ciudadela</option>
										<option value="CEL">CEL Célula</option>
										<option value="CEN">CEN Centro</option>
										<option value="CIR">CIR Circular</option>
										<option value="CL">CL Calle</option>
										<option value="CLJ">CLJ Callejón</option>
										<option value="CN">CN Camino</option>
										<option value="CON">CON Conjunto residencial</option>
										<option value="CONJ">CONJ Conjunto</option>
										<option value="CR">CR Carrera</option>
										<option value="CRT">CRT Carretera</option>
										<option value="CRV">CRV Circunvalar</option>
										<option value="CS">CS Consultorio</option>
										<option value="DG">DG Diagonal</option>DG Diagonal
										<option value="DP">DP Depósito</option>
										<option value="DPTO">DPTO Departamento</option>
										<option value="DS">DS Depósito sótano</option>
										<option value="ED">ED Edificio</option>
										<option value="EN">EN Entrada</option>
										<option value="ES">ES Escalera</option>
										<option value="ESQ">ESQ Esquina</option>
										<option value="ESTE">ESTE Este</option>
										<option value="ET">ET Etapa</option>
										<option value="EX">EX Exterior</option>
										<option value="FCA">FCA Finca</option>
										<option value="GJ">GJ Garaje</option>
										<option value="GS">GS Garaje sótano</option>
										<option value="GT">GT Glorieta</option>
										<option value="HC">HC Hacienda</option>
										<option value="HG">HG Hangar</option>
										<option value="IN">IN Interior</option>
										<option value="IP">IP Inspección de Policía</option>
										<option value="IPD">IPD Inspección Departamental</option>
										<option value="IPM">IPM Inspección Municipal</option>
										<option value="KM">KM Kilómetro</option>
										<option value="LC">LC Local</option>
										<option value="LM">LM Local mezzanine</option>
										<option value="LT">LT Lote</option>
										<option value="MD">MD Módulo</option>
										<option value="MJ">MJ Mojón</option>
										<option value="MLL">MLL Muelle</option>
										<option value="MN">MN Mezzanine</option>
										<option value="MZ">MZ Manzana</option>
										<option value="NOMBRE VIA">NOMBRE VIA Vías de nombre común</option>
										<option value="NORTE">NORTE Norte</option>
										<option value="O">O Oriente</option>
										<option value="OCC">OCC Occidente</option>
										<option value="OESTE">OESTE Oeste</option>
										<option value="OF">OF Oficina</option>
										<option value="P">P Piso</option>
										<option value="PA">PA Parcela</option>
										<option value="PAR">PAR Parque</option>
										<option value="PD">PD Predio</option>
										<option value="PH">PH Penthouse</option>
										<option value="PJ">PJ Pasaje</option>
										<option value="PL">PL Planta</option>
										<option value="PN">PN Puente</option>
										<option value="POR">POR Portería</option>
										<option value="POS">POS Poste</option>
										<option value="PQ">PQ Parqueadero</option>
										<option value="PRJ">PRJ Paraje</option>
										<option value="PS">PS Paseo</option>
										<option value="PT">PT Puesto</option>
										<option value="PW">PW Park Way</option>
										<option value="RP">RP Round Point</option>
										<option value="SA">SA Salón</option>
										<option value="SC">SC Salón comunal</option>
										<option value="SD">SD Salida</option>
										<option value="SEC">SEC Sector</option>
										<option value="SL">SL Solar</option>
										<option value="SM">SM Súper manzana</option>
										<option value="SS">SS Semisótano</option>
										<option value="ST">ST Sótano</option>
										<option value="SUITE">SUITE Suite</option>
										<option value="SUR">SUR Sur</option>
										<option value="TER">TER Terminal</option>
										<option value="TERPLN">TERPLN Terraplén</option>
										<option value="TO">TO Torre</option>
										<option value="TV">TV Transversal</option>
										<option value="TZ">TZ Terraza</option>
										<option value="UN">UN Unidad</option>
										<option value="UR">UR Unidad residencial</option>
										<option value="URB">URB Urbanización</option>
										<option value="VRD">VRD Vereda</option>
										<option value="VTE">VTE Variante</option>
										<option value="ZF">ZF Zona franca</option>
										<option value="ZN">ZN Zona</option>
									</select>
								</div>
								<div class="col-sm-3">
									<label><strong>Nombre/Núm de vía:(*)</strong></label>
									<input type="text" id="di_nomvia" class="form-control input-xs address">
								</div>
								<div class="col-sm-3">
									<label><strong>Letra:</strong></label><br>
									<select id="di_letra1" class="form-control input-xs address">
										<option value="">Seleccione</option>
										<option value="A">A</option>
										<option valu="B">B</option>
										<option value="C">C</option>
										<option value="D">D</option>
										<option value="E">E</option>
										<option value="F">F</option>
										<option value="G">G</option>
										<option value="H">H</option>
										<option value="I">I</option>
										<option value="J">J</option>
										<option value="K">K</option>
										<option value="L">L</option>
										<option value="M">M</option>
										<option value="N">N</option>
										<option value="O">O</option>
										<option value="P">P</option>
										<option value="Q">Q</option>
										<option value="R">R</option>
										<option value="S">S</option>
										<option value="T">T</option>
										<option value="U">U</option>
										<option value="V">V</option>
										<option value="W">W</option>
										<option value="X">X</option>
										<option value="Y">Y</option>
										<option value="Z">Z</option>
									</select>
								</div>
								<div class="col-sm-3">
									<label><strong>Prefijo:</strong></label>
									<select id="di_prefijo1" class="form-control input-xs address">
										<option value="">Seleccione</option>
										<option value="BIS">BIS</option>
									</select>
								</div>
								<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
									<hr />
								</div>
								<div class="col-sm-4">
									<label><strong>Letra:</strong></label>
									<select id="di_letra2" class="form-control input-xs address">
										<option value="">Seleccione</option>
										<option value="A">A</option>
										<option valu="B">B</option>
										<option value="C">C</option>
										<option value="D">D</option>
										<option value="E">E</option>
										<option value="F">F</option>
										<option value="G">G</option>
										<option value="H">H</option>
										<option value="I">I</option>
										<option value="J">J</option>
										<option value="K">K</option>
										<option value="L">L</option>
										<option value="M">M</option>
										<option value="N">N</option>
										<option value="O">O</option>
										<option value="P">P</option>
										<option value="Q">Q</option>
										<option value="R">R</option>
										<option value="S">S</option>
										<option value="T">T</option>
										<option value="U">U</option>
										<option value="V">V</option>
										<option value="W">W</option>
										<option value="X">X</option>
										<option value="Y">Y</option>
										<option value="Z">Z</option>
									</select>
								</div>
								<div class="col-sm-4">
									<label><strong>Cuadrante</strong></label>
									<select id="di_cuadrante" class="form-control input-xs address">
										<option value="">Seleccione</option>
										<option value="Norte">Norte</option>
										<option value="Sur">Sur</option>
										<option value="Este">Este</option>
										<option value="Oeste">Oeste</option>
									</select>
								</div>
								<div class="col-sm-4">
									<label><strong>Número</strong></label>
									<input type="number" id="di_num1" class="form-control input-xs address">
								</div>
								<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
									<hr />
								</div>
								<div class="col-xs-4 col-sm-4 col-md-4">
									<label><strong>Letra</strong></label>
									<select id="di_letra3" class="form-control input-xs address">
										<option value="">Seleccione</option>
										<option value="A">A</option>
										<option valu="B">B</option>
										<option value="C">C</option>
										<option value="D">D</option>
										<option value="E">E</option>
										<option value="F">F</option>
										<option value="G">G</option>
										<option value="H">H</option>
										<option value="I">I</option>
										<option value="J">J</option>
										<option value="K">K</option>
										<option value="L">L</option>
										<option value="M">M</option>
										<option value="N">N</option>
										<option value="O">O</option>
										<option value="P">P</option>
										<option value="Q">Q</option>
										<option value="R">R</option>
										<option value="S">S</option>
										<option value="T">T</option>
										<option value="U">U</option>
										<option value="V">V</option>
										<option value="W">W</option>
										<option value="X">X</option>
										<option value="Y">Y</option>
										<option value="Z">Z</option>
									</select>
								</div>
								<div class="col-sm-4">
									<label><strong>Número</strong></label>
									<input type="number" id="di_numero2" class="form-control input-xs address">
								</div>
								<div class="col-sm-4">
									<label><strong>Cuadrante</strong></label>
									<select id="di_cuadrante2" class="form-control input-xs address">
										<option value="">Seleccione</option>
										<option value="Norte">Norte</option>
										<option value="Sur">Sur</option>
										<option value="Este">Este</option>
										<option value="Oeste">Oeste</option>
									</select>
								</div>
								<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
									<hr />
								</div>
								<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="div_complemento">
									<div class="col-sm-3"><label>Complemento 1</label></div>
									<div class="col-sm-4">
										<label><strong>Tipo vía</strong></label>
										<select id="di_tipovia1" class="form-control input-xs address">
											<option value="">Seleccione</option>
											<option value="AC">AC Avenida calle</option>
											<option value="AD">AD Administración</option>
											<option value="ADL">ADL Adelante</option>
											<option value="AER">AER Aeropuerto</option>
											<option value="AG">AG Agencia</option>
											<option value="AGP">AGP Agrupación</option>
											<option value="AK">AK Avenida carrera</option>
											<option value="AL">AL Altillo</option>
											<option value="ALD">ALD Al lado</option>
											<option value="ALM">ALM Almacén</option>
											<option value="AP">AP Apartamento</option>
											<option value="APTDO">APTDO Apartado</option>
											<option value="ATR">ATR Atrás</option>
											<option value="AUT">AUT Autopista</option>
											<option value="AV">AV Avenida</option>
											<option value="AVIAL">AVIAL Anillo vial</option>
											<option value="BG">BG Bodega</option>
											<option value="BL">BL Bloque</option>
											<option value="BLV">BLV Boulevard</option>
											<option value="BR">BR Barrio</option>
											<option value="C">C Corregimiento</option>
											<option value="CA">CA Casa</option>
											<option value="CAS">CAS Caserío</option>
											<option value="CC">CC Centro comercial</option>
											<option value="CD">CD Ciudadela</option>
											<option value="CEL">CEL Célula</option>
											<option value="CEN">CEN Centro</option>
											<option value="CIR">CIR Circular</option>
											<option value="CL">CL Calle</option>
											<option value="CLJ">CLJ Callejón</option>
											<option value="CN">CN Camino</option>
											<option value="CON">CON Conjunto residencial</option>
											<option value="CONJ">CONJ Conjunto</option>
											<option value="CR">CR Carrera</option>
											<option value="CRT">CRT Carretera</option>
											<option value="CRV">CRV Circunvalar</option>
											<option value="CS">CS Consultorio</option>
											<option value="DG">DG Diagonal</option>DG Diagonal
											<option value="DP">DP Depósito</option>
											<option value="DPTO">DPTO Departamento</option>
											<option value="DS">DS Depósito sótano</option>
											<option value="ED">ED Edificio</option>
											<option value="EN">EN Entrada</option>
											<option value="ES">ES Escalera</option>
											<option value="ESQ">ESQ Esquina</option>
											<option value="ESTE">ESTE Este</option>
											<option value="ET">ET Etapa</option>
											<option value="EX">EX Exterior</option>
											<option value="FCA">FCA Finca</option>
											<option value="GJ">GJ Garaje</option>
											<option value="GS">GS Garaje sótano</option>
											<option value="GT">GT Glorieta</option>
											<option value="HC">HC Hacienda</option>
											<option value="HG">HG Hangar</option>
											<option value="IN">IN Interior</option>
											<option value="IP">IP Inspección de Policía</option>
											<option value="IPD">IPD Inspección Departamental</option>
											<option value="IPM">IPM Inspección Municipal</option>
											<option value="KM">KM Kilómetro</option>
											<option value="LC">LC Local</option>
											<option value="LM">LM Local mezzanine</option>
											<option value="LT">LT Lote</option>
											<option value="MD">MD Módulo</option>
											<option value="MJ">MJ Mojón</option>
											<option value="MLL">MLL Muelle</option>
											<option value="MN">MN Mezzanine</option>
											<option value="MZ">MZ Manzana</option>
											<option value="NOMBRE VIA">NOMBRE VIA Vías de nombre común</option>
											<option value="NORTE">NORTE Norte</option>
											<option value="O">O Oriente</option>
											<option value="OCC">OCC Occidente</option>
											<option value="OESTE">OESTE Oeste</option>
											<option value="OF">OF Oficina</option>
											<option value="P">P Piso</option>
											<option value="PA">PA Parcela</option>
											<option value="PAR">PAR Parque</option>
											<option value="PD">PD Predio</option>
											<option value="PH">PH Penthouse</option>
											<option value="PJ">PJ Pasaje</option>
											<option value="PL">PL Planta</option>
											<option value="PN">PN Puente</option>
											<option value="POR">POR Portería</option>
											<option value="POS">POS Poste</option>
											<option value="PQ">PQ Parqueadero</option>
											<option value="PRJ">PRJ Paraje</option>
											<option value="PS">PS Paseo</option>
											<option value="PT">PT Puesto</option>
											<option value="PW">PW Park Way</option>
											<option value="RP">RP Round Point</option>
											<option value="SA">SA Salón</option>
											<option value="SC">SC Salón comunal</option>
											<option value="SD">SD Salida</option>
											<option value="SEC">SEC Sector</option>
											<option value="SL">SL Solar</option>
											<option value="SM">SM Súper manzana</option>
											<option value="SS">SS Semisótano</option>
											<option value="ST">ST Sótano</option>
											<option value="SUITE">SUITE Suite</option>
											<option value="SUR">SUR Sur</option>
											<option value="TER">TER Terminal</option>
											<option value="TERPLN">TERPLN Terraplén</option>
											<option value="TO">TO Torre</option>
											<option value="TV">TV Transversal</option>
											<option value="TZ">TZ Terraza</option>
											<option value="UN">UN Unidad</option>
											<option value="UR">UR Unidad residencial</option>
											<option value="URB">URB Urbanización</option>
											<option value="VRD">VRD Vereda</option>
											<option value="VTE">VTE Variante</option>
											<option value="ZF">ZF Zona franca</option>
											<option value="ZN">ZN Zona</option>
										</select>
									</div>
									<div class="col-sm-4">
										<label>
											<strong>Número/Nombre</strong></label>
										<input type="text" id="di_numero3" class="form-control input-xs address">
									</div>
								</div>

								<div class="col-sm-12 col-md-12 col-lg-12">
									<label><strong>Dirección final</strong></label>
									<input type="text" id="direccion_compuesta" class="form-control input-xs" readonly="readonly">
								</div>

							</div>
							<div class="row">
								<div class="form-group col-xs-12 col-sm-4 col-md-4 col-lg-4">
									<label class="control-label">(*) E-mail:</label>
									<input type="email" name="email" id="email" placeholder="E-mail" class="form-control input-xs" onkeyup="Validar_Correo(event);">
									<span id="mensajeCorreo" style="color: red;"></span>
								</div>

								<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
									<label>(*) Persona Encargado:</label>
									<input type="text" id="sede_encargado" class="form-control input-xs">
								</div>

								<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
									<label>(*) Días Información:</label>
									<input type="text" id="sede_atencion" class="form-control input-xs">
								</div>
							</div>

							<div class="row">

								<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
									<label>(*) Condiciones de facturación:</label>
									<textarea id="sede_cond_factura" class="form-control input-sm"></textarea>
								</div>

								<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
									<label>(*)Obligacion tributaria:</label>
									' . $Obligacion_tribu->Obligacion_Tributaria() . '
								</div>

								<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
									<label>(*) Condición de Pago:</label>
									<select id="sede_cond_pago" class="form-control input-sm">
										<option value="">Seleccione</option>
										<option value="1">Transferencia</option>
										<option value="2">Cheque</option>
										<option value="3">Consignación</option>
										<option value="4">Contraentrega</option>
									</select>
								</div>

								<div class="form-group col-sm-12">
									<label class="control-label">Indicaciones de llegada:</label>
									<textarea name="indicaciones_llegada" id="indicaciones_llegada" class="form-control input-sm"></textarea>
								</div>

								<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
									<label>(*) Restricción Acceso:</label>
									<textarea id="sede_restriccion" class="form-control input-sm"></textarea>
								</div>

								<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
									<label>(*) Instrucción especial:</label>
									<textarea id="sede_instruccion" class="form-control input-sm"></textarea>
								</div>

								<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
										<label>(*)Empresa Cliente:</label>
									' . $Obligacion_tribu->Listar_Empresas() . '
								</div>

							</div>

						</div>
							<div id="info_responsables" class="tab-pane cont">
								<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
									<div class="icon">
										<span class="mdi mdi-close"></span>
									</div>
									<div class="message">
										<strong>Error!</strong>
										<p>No se ha seleccionado ningún servicio para el cliente...</p>
									</div>
								</div>
							</div>
							<!--
							<div id="info_sedes1" class="tab-pane cont">
								<div class="row">
									<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
									<label>(*) Nombre Sede:</label>
									<input type="text" id="sede" class="form-control input-sm">
									</div>
									<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
										<label>(*) Municipio Ubicación:</label>
										' . $Municipio->getHtmlSelect_sede("ciudad", "", "") . '
									</div>
									<div class="col-xs-12 col-md-12"><hr></div>
									<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
										<label>(*) Dirección:</label>
										<button class="btn-success mdi mdi-home btn-xs" id="mascara_direccionsd" title="Dirección Sede"></button>
										<input type="text" id="sede_direccion" class="form-control input-sm" readonly="readonly">
									</div>
									<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
										<label>(*) Persona Encargado:</label>
										<input type="text" id="sede_encargado" class="form-control input-sm">
									</div>
									<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
										<label>(*)Correo: </label>
										<input type="text" id="sede_correo" class="form-control input-sm">
									</div>
									<div class="col-xs-12 col-md-12"><hr></div>
										<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="div_mascarasd">
											<div class="col-sm-12"><hr style="background:blue;"></hr>
												<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
													<label><strong>Generador Dirección</strong></label>
												</div>
												<div class="col-xs-3 col-sm-3 col-md-3">
													<div class="be-checkbox inline">
														<input type="checkbox" id="Complement" class="form-control input-sm comple_direc">
														<label for="Complement">¿Complemento?</label>
													</div>
												</div>
												<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
													<button id="limpiar" class="btn-xs btn-info">Limpiar</button>
												</div>
												<div class="col-sm-12"><hr/></div>
											</div>
											<div class="col-sm-3">
												<label><strong>Tipo vía:(*)</strong></label>
												<select id="di_tipoviasd" class="form-control input-xs address_sd">
													<option value="">Seleccione</option>
													<option value="AC">AC	Avenida calle</option>
													<option value="AD">AD	Administración</option>
													<option value="ADL">ADL	Adelante</option>
													<option value="AER">AER	Aeropuerto</option>
													<option value="AG">AG	Agencia</option>
													<option value="AGP">AGP	Agrupación</option>
													<option value="AK">AK	Avenida carrera</option>
													<option value="AL">AL	Altillo</option>
													<option value="ALD">ALD	Al lado</option>
													<option value="ALM">ALM	Almacén</option>
													<option value="AP">AP	Apartamento</option>
													<option value="APTDO">APTDO	Apartado</option>
													<option value="ATR">ATR	Atrás</option>
													<option value="AUT">AUT	Autopista</option>
													<option value="AV">AV	Avenida</option>
													<option value="AVIAL">AVIAL	Anillo vial</option>
													<option value="BG">BG	Bodega</option>
													<option value="BL">BL	Bloque</option>
													<option value="BLV">BLV	Boulevard</option>
													<option value="BR">BR	Barrio</option>
													<option value="C">C	Corregimiento</option>
													<option value="CA">CA	Casa</option>
													<option value="CAS">CAS Caserío</option>
													<option value="CC">CC	Centro comercial</option>
													<option value="CD">CD	Ciudadela</option>
													<option value="CEL">CEL	Célula</option>
													<option value="CEN">CEN Centro</option>
													<option value="CIR">CIR Circular</option>
													<option value="CL">CL Calle</option>
													<option value="CLJ">CLJ	Callejón</option>
													<option value="CN">CN	Camino</option>
													<option value="CON">CON Conjunto residencial</option>
													<option value="CONJ">CONJ Conjunto</option>
													<option value="CR">CR	Carrera</option>
													<option value="CRT">CRT	Carretera</option>
													<option value="CRV">CRV	Circunvalar</option>
													<option value="CS">CS	Consultorio</option>
													<option value="DG">DG	Diagonal</option>DG	Diagonal
													<option value="DP">DP	Depósito</option>
													<option value="DPTO">DPTO	Departamento</option>
													<option value="DS">DS	Depósito sótano</option>
													<option value="ED">ED	Edificio</option>
													<option value="EN">EN	Entrada</option>
													<option value="ES">ES	Escalera</option>
													<option value="ESQ">ESQ	Esquina</option>
													<option value="ESTE">ESTE	Este</option>
													<option value="ET">ET	Etapa</option>
													<option value="EX">EX	Exterior</option>
													<option value="FCA">FCA Finca</option>
													<option value="GJ">GJ	Garaje</option>
													<option value="GS">GS	Garaje sótano</option>
													<option value="GT">GT	Glorieta</option>
													<option value="HC">HC	Hacienda</option>
													<option value="HG">HG	Hangar</option>
													<option value="IN">IN	Interior</option>
													<option value="IP">IP	Inspección de Policía</option>
													<option value="IPD">IPD	Inspección Departamental</option>
													<option value="IPM">IPM	Inspección Municipal</option>
													<option value="KM">KM	Kilómetro</option>
													<option value="LC">LC	Local</option>
													<option value="LM">LM	Local mezzanine</option>
													<option value="LT">LT	Lote</option>
													<option value="MD">MD	Módulo</option>
													<option value="MJ">MJ	Mojón</option>
													<option value="MLL">MLL	Muelle</option>
													<option value="MN">MN	Mezzanine</option>
													<option value="MZ">MZ	Manzana</option>
													<option value="NOMBRE VIA">NOMBRE VIA	Vías de nombre común</option>
													<option value="NORTE">NORTE	Norte</option>
													<option value="O">O	Oriente</option>
													<option value="OCC">OCC	Occidente</option>
													<option value="OESTE">OESTE	Oeste</option>
													<option value="OF">OF	Oficina</option>
													<option value="P">P	Piso</option>
													<option value="PA">PA	Parcela</option>
													<option value="PAR">PAR	Parque</option>
													<option value="PD">PD	Predio</option>
													<option value="PH">PH	Penthouse</option>
													<option value="PJ">PJ	Pasaje</option>
													<option value="PL">PL	Planta</option>
													<option value="PN">PN	Puente</option>
													<option value="POR">POR	Portería</option>
													<option value="POS">POS	Poste</option>
													<option value="PQ">PQ	Parqueadero</option>
													<option value="PRJ">PRJ	Paraje</option>
													<option value="PS">PS	Paseo</option>
													<option value="PT">PT	Puesto</option>
													<option value="PW">PW	Park Way</option>
													<option value="RP">RP	Round Point</option>
													<option value="SA">SA	Salón</option>
													<option value="SC">SC	Salón comunal</option>
													<option value="SD">SD	Salida</option>
													<option value="SEC">SEC	Sector</option>
													<option value="SL">SL	Solar</option>
													<option value="SM">SM	Súper manzana</option>
													<option value="SS">SS	Semisótano</option>
													<option value="ST">ST	Sótano</option>
													<option value="SUITE">SUITE	Suite</option>
													<option value="SUR">SUR	Sur</option>
													<option value="TER">TER	Terminal</option>
													<option value="TERPLN">TERPLN	Terraplén</option>
													<option value="TO">TO	Torre</option>
													<option value="TV">TV	Transversal</option>
													<option value="TZ">TZ	Terraza</option>
													<option value="UN">UN	Unidad</option>
													<option value="UR">UR	Unidad residencial</option>
													<option value="URB">URB	Urbanización</option>
													<option value="VRD">VRD	Vereda</option>
													<option value="VTE">VTE	Variante</option>
													<option value="ZF">ZF	Zona franca</option>
													<option value="ZN">ZN	Zona</option>
												</select>
											</div>
											<div class="col-sm-3">
												<label><strong>Nombre/Núm de vía:(*)</strong></label>
												<input type="text" id="di_nomviasd" class="form-control input-xs address_sd">
											</div>
											<div class="col-sm-3">
												<label><strong>Letra:</strong></label><br>
												<select id="di_letra1sd" class="form-control input-xs address_sd">
													<option value="">Seleccione</option>
													<option value="A">A</option>
													<option valu="B">B</option>
													<option value="C">C</option>
													<option value="D">D</option>
													<option value="E">E</option>
													<option value="F">F</option>
													<option value="G">G</option>
													<option value="H">H</option>
													<option value="I">I</option>
													<option value="J">J</option>
													<option value="K">K</option>
													<option value="L">L</option>
													<option value="M">M</option>
													<option value="N">N</option>
													<option value="O">O</option>
													<option value="P">P</option>
													<option value="Q">Q</option>
													<option value="R">R</option>
													<option value="S">S</option>
													<option value="T">T</option>
													<option value="U">U</option>
													<option value="V">V</option>
													<option value="W">W</option>
													<option value="X">X</option>
													<option value="Y">Y</option>
													<option value="Z">Z</option>
												</select>
											</div>
											<div class="col-sm-3">
												<label><strong>Prefijo:</strong></label>
												<select id="di_prefijo1sd" class="form-control input-xs address_sd">
													<option value="">Seleccione</option>
													<option value="BIS">BIS</option>
												</select>
											</div>
											<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><hr/></div>
											<div class="col-sm-4">
												<label><strong>Letra:</strong></label>
												<select id="di_letra2sd" class="form-control input-xs address_sd">
													<option value="">Seleccione</option>
													<option value="A">A</option>
													<option valu="B">B</option>
													<option value="C">C</option>
													<option value="D">D</option>
													<option value="E">E</option>
													<option value="F">F</option>
													<option value="G">G</option>
													<option value="H">H</option>
													<option value="I">I</option>
													<option value="J">J</option>
													<option value="K">K</option>
													<option value="L">L</option>
													<option value="M">M</option>
													<option value="N">N</option>
													<option value="O">O</option>
													<option value="P">P</option>
													<option value="Q">Q</option>
													<option value="R">R</option>
													<option value="S">S</option>
													<option value="T">T</option>
													<option value="U">U</option>
													<option value="V">V</option>
													<option value="W">W</option>
													<option value="X">X</option>
													<option value="Y">Y</option>
													<option value="Z">Z</option>
												</select>
											</div>
											<div class="col-sm-4">
												<label><strong>Cuadrante</strong></label>
												<select id="di_cuadrantesd" class="form-control input-xs address_sd">
													<option value="">Seleccione</option>
													<option value="Norte">Norte</option>
													<option value="Sur">Sur</option>
													<option value="Este">Este</option>
													<option value="Oeste">Oeste</option>
												</select>
											</div>
											<div class="col-sm-4">
												<label><strong>Número</strong></label>
												<input type="number" id="di_num1sd" class="form-control input-xs address_sd">
											</div>
											<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><hr/></div>
											<div class="col-xs-4 col-sm-4 col-md-4">
												<label><strong>Letra</strong></label>
												<select id="di_letra3sd" class="form-control input-xs address_sd">
													<option value="">Seleccione</option>
													<option value="A">A</option>
													<option valu="B">B</option>
													<option value="C">C</option>
													<option value="D">D</option>
													<option value="E">E</option>
													<option value="F">F</option>
													<option value="G">G</option>
													<option value="H">H</option>
													<option value="I">I</option>
													<option value="J">J</option>
													<option value="K">K</option>
													<option value="L">L</option>
													<option value="M">M</option>
													<option value="N">N</option>
													<option value="O">O</option>
													<option value="P">P</option>
													<option value="Q">Q</option>
													<option value="R">R</option>
													<option value="S">S</option>
													<option value="T">T</option>
													<option value="U">U</option>
													<option value="V">V</option>
													<option value="W">W</option>
													<option value="X">X</option>
													<option value="Y">Y</option>
													<option value="Z">Z</option>
												</select>
											</div>
											<div class="col-sm-4">
												<label><strong>Número</strong></label>
												<input type="number" id="di_numero2sd" class="form-control input-xs address_sd">
											</div>
											<div class="col-sm-4">
												<label><strong>Cuadrante</strong></label>
												<select id="di_cuadrante2sd" class="form-control input-xs address_sd">
													<option value="">Seleccione</option>
													<option value="Norte">Norte</option>
													<option value="Sur">Sur</option>
													<option value="Este">Este</option>
													<option value="Oeste">Oeste</option>
												</select>
											</div>
											<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><hr/></div>
											<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="div_complemento">
												<div class="col-sm-3"><label>Complemento 1</label></div>
												<div class="col-sm-4">
													<label><strong>Tipo vía</strong></label>
													<select id="di_tipovia1sd" class="form-control input-xs address_sd">
														<option value="">Seleccione</option>
														<option value="AC">AC	Avenida calle</option>
														<option value="AD">AD	Administración</option>
														<option value="ADL">ADL	Adelante</option>
														<option value="AER">AER	Aeropuerto</option>
														<option value="AG">AG	Agencia</option>
														<option value="AGP">AGP	Agrupación</option>
														<option value="AK">AK	Avenida carrera</option>
														<option value="AL">AL	Altillo</option>
														<option value="ALD">ALD	Al lado</option>
														<option value="ALM">ALM	Almacén</option>
														<option value="AP">AP	Apartamento</option>
														<option value="APTDO">APTDO	Apartado</option>
														<option value="ATR">ATR	Atrás</option>
														<option value="AUT">AUT	Autopista</option>
														<option value="AV">AV	Avenida</option>
														<option value="AVIAL">AVIAL	Anillo vial</option>
														<option value="BG">BG	Bodega</option>
														<option value="BL">BL	Bloque</option>
														<option value="BLV">BLV	Boulevard</option>
														<option value="BR">BR	Barrio</option>
														<option value="C">C	Corregimiento</option>
														<option value="CA">CA	Casa</option>
														<option value="CAS">CAS Caserío</option>
														<option value="CC">CC	Centro comercial</option>
														<option value="CD">CD	Ciudadela</option>
														<option value="CEL">CEL	Célula</option>
														<option value="CEN">CEN Centro</option>
														<option value="CIR">CIR Circular</option>
														<option value="CL">CL Calle</option>
														<option value="CLJ">CLJ	Callejón</option>
														<option value="CN">CN	Camino</option>
														<option value="CON">CON Conjunto residencial</option>
														<option value="CONJ">CONJ Conjunto</option>
														<option value="CR">CR	Carrera</option>
														<option value="CRT">CRT	Carretera</option>
														<option value="CRV">CRV	Circunvalar</option>
														<option value="CS">CS	Consultorio</option>
														<option value="DG">DG	Diagonal</option>DG	Diagonal
														<option value="DP">DP	Depósito</option>
														<option value="DPTO">DPTO	Departamento</option>
														<option value="DS">DS	Depósito sótano</option>
														<option value="ED">ED	Edificio</option>
														<option value="EN">EN	Entrada</option>
														<option value="ES">ES	Escalera</option>
														<option value="ESQ">ESQ	Esquina</option>
														<option value="ESTE">ESTE	Este</option>
														<option value="ET">ET	Etapa</option>
														<option value="EX">EX	Exterior</option>
														<option value="FCA">FCA Finca</option>
														<option value="GJ">GJ	Garaje</option>
														<option value="GS">GS	Garaje sótano</option>
														<option value="GT">GT	Glorieta</option>
														<option value="HC">HC	Hacienda</option>
														<option value="HG">HG	Hangar</option>
														<option value="IN">IN	Interior</option>
														<option value="IP">IP	Inspección de Policía</option>
														<option value="IPD">IPD	Inspección Departamental</option>
														<option value="IPM">IPM	Inspección Municipal</option>
														<option value="KM">KM	Kilómetro</option>
														<option value="LC">LC	Local</option>
														<option value="LM">LM	Local mezzanine</option>
														<option value="LT">LT	Lote</option>
														<option value="MD">MD	Módulo</option>
														<option value="MJ">MJ	Mojón</option>
														<option value="MLL">MLL	Muelle</option>
														<option value="MN">MN	Mezzanine</option>
														<option value="MZ">MZ	Manzana</option>
														<option value="NOMBRE VIA">NOMBRE VIA	Vías de nombre común</option>
														<option value="NORTE">NORTE	Norte</option>
														<option value="O">O	Oriente</option>
														<option value="OCC">OCC	Occidente</option>
														<option value="OESTE">OESTE	Oeste</option>
														<option value="OF">OF	Oficina</option>
														<option value="P">P	Piso</option>
														<option value="PA">PA	Parcela</option>
														<option value="PAR">PAR	Parque</option>
														<option value="PD">PD	Predio</option>
														<option value="PH">PH	Penthouse</option>
														<option value="PJ">PJ	Pasaje</option>
														<option value="PL">PL	Planta</option>
														<option value="PN">PN	Puente</option>
														<option value="POR">POR	Portería</option>
														<option value="POS">POS	Poste</option>
														<option value="PQ">PQ	Parqueadero</option>
														<option value="PRJ">PRJ	Paraje</option>
														<option value="PS">PS	Paseo</option>
														<option value="PT">PT	Puesto</option>
														<option value="PW">PW	Park Way</option>
														<option value="RP">RP	Round Point</option>
														<option value="SA">SA	Salón</option>
														<option value="SC">SC	Salón comunal</option>
														<option value="SD">SD	Salida</option>
														<option value="SEC">SEC	Sector</option>
														<option value="SL">SL	Solar</option>
														<option value="SM">SM	Súper manzana</option>
														<option value="SS">SS	Semisótano</option>
														<option value="ST">ST	Sótano</option>
														<option value="SUITE">SUITE	Suite</option>
														<option value="SUR">SUR	Sur</option>
														<option value="TER">TER	Terminal</option>
														<option value="TERPLN">TERPLN	Terraplén</option>
														<option value="TO">TO	Torre</option>
														<option value="TV">TV	Transversal</option>
														<option value="TZ">TZ	Terraza</option>
														<option value="UN">UN	Unidad</option>
														<option value="UR">UR	Unidad residencial</option>
														<option value="URB">URB	Urbanización</option>
														<option value="VRD">VRD	Vereda</option>
														<option value="VTE">VTE	Variante</option>
														<option value="ZF">ZF	Zona franca</option>
														<option value="ZN">ZN	Zona</option>
													</select>
												</div>
												<div class="col-sm-4">
													<label>
													<strong>Número/Nombre</strong></label>
													<input type="text" id="di_numero3sd" class="form-control input-xs address_sd">
												</div>

											</div>
											<div class="col-sm-12 col-md-12 col-lg-12">
													<label><strong>Dirección final</strong></label>
													<input type="text" id="direccion_compuesta_sd" class="form-control input-xs" readonly="readonly">
												</div>
											<div class="col-sm-10"><hr></hr></div>
										</div>

									<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
										<label>(*) Código Postal:</label>
										' . $Postal->getHtmlSelect_pos() . '
									</div>
									<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
										<label>(*) Días Información:</label>
										<input type="text" id="sede_atencion" class="form-control input-sm">
									</div>
									<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
										<label>(*) Condición de Pago:</label>
										<select id="sede_cond_pago" class="form-control input-sm">
												<option value="">Seleccione</option>
												<option value="1">Transferencia</option>
												<option value="2">Cheque</option>
												<option value="3">Consignación</option>
												<option value="4">Contraentrega</option>
										</select>
									</div>
									<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
										<label>(*) Teléfono:</label>
										<input type="number" id="sede_telefono" class="form-control input-sm">
									</div>
									<div class="col-xs-12 col-md-12"><hr></div>
									<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
										<label>(*) Condiciones de facturación:</label>
										<textarea id="sede_cond_factura" class="form-control input-sm"></textarea>
									</div>
									<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
										<label>(*)Obligacion tributaria:</label>
										' . $Obligacion_tribu->Obligacion_Tributaria() . '
									</div>
									<div class="col-xs-12 col-md-12"><hr></div>
									<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
										<label>(*) Restricción Acceso:</label>
										<textarea id="sede_restriccion" class="form-control input-sm"></textarea>
									</div>
									<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
										<label>(*) Instrucción especial:</label>
										<textarea id="sede_instruccion" class="form-control input-sm"></textarea>
									</div>
									<input type="text" class="form-control input-sm" id="valor_sede">
								</div>
								<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
										<label>(*)Empresa Cliente:</label>
										' . $Obligacion_tribu->Listar_Empresas() . '
								</div>
							</div>-->
							<input type="hidden" class="form-control input-sm" id="valor_sede">

						</div>
					</div>
				</div>
			';
		break;

	case 'crearCliente':
		$_msg_control .= "Entro en la accion crearCliente.\n";
		// $return["post"] = $_POST;
		// $return["files"] = $_FILES;
		session_start();
		if (!isset($_SESSION['usuario']['nom_usuario'])) {
			session_start();
			$id_usuario = $_SESSION["usuario"]["nom_usuario"];
		} else {
			$id_usuario = $_SESSION["usuario"]["nom_usuario"];
		}
		$factual = date('Y-m-d');
		$horactual = date('H:i:s');
		$user_empresa_id = $_SESSION['usuario']['empresa_id'];
		// Se adiciona el Cliente
		$arrayCliente = array(
			'tipo_documento' => $_POST["tipo_documento"],
			'cod_cliente' => 'CLI-' . $time,
			'regimen' => $_POST["regimen"],
			'documento' => $_POST["documento"],
			'digito_verificacion' => $_POST["digito_verificacion"],
			'nombre' => $Clientes->limpiaTexto($_POST["nombre"]) . " " . $Clientes->limpiaTexto($_POST["tipo_sociedad"]),
			'tipo_sociedad' => $_POST["tipo_sociedad"],
			'sigla' => $Clientes->limpiaTexto($_POST["sigla"]),
			'actividad_cliente' => $Clientes->limpiaTexto($_POST["actividad_cliente"]),
			'codigo_postal' => $Clientes->limpiaTexto($_POST["codigo_postal"]),
			'ciudad' => $_POST["ciudad"],
			'direccion' => $Clientes->limpiaTexto($_POST["direccion"]),
			'telefono' => $Clientes->limpiaTexto($_POST["telefono"]),
			'email' => $Clientes->limpiaTexto($_POST["email"]),
			'indicaciones_llegada' => $Clientes->limpiaTexto($_POST["indicaciones_llegada"]),
			'estado' => '1',
			'nom_sede' => $Clientes->limpiaTexto($_POST["name_sede"]),
			'encargado' => $Clientes->limpiaTexto($_POST["encargado_sede"]),
			'dia_informacion' => $Clientes->limpiaTexto($_POST["atencion_sede"]),
			'restriccion_acceso' => $Clientes->limpiaTexto($_POST["restri_sede"]),
			'condicion_pago' => $Clientes->limpiaTexto($_POST["pago_sede"]),
			'condicion_facturacion' => $Clientes->limpiaTexto($_POST["factura_sede"]),
			'obligacion_tributaria' => $Clientes->limpiaTexto($_POST["tributaria"]),
			'instruccion_especial' => $Clientes->limpiaTexto($_POST["instruccion_sede"]),
			'empresa' => $Clientes->limpiaTexto($_POST["empresa_cliente"]),
		);
		$result = $Data->setRegistro("cmx_clientes", $arrayCliente);
		if ($result) {
			$update_sede = array(
				'codigo_sede' => $result
			);
			$results = $Data->updateRegistro("cmx_clientes", $update_sede, (int) $result);
		}

		//se registra movimiento de cuando se crea el cliente
		// insertar el movimiento del cambio
		$sql_historico = "INSERT INTO cmx_movimientos_sistema (tipo_movimiento, modulo, objeto, objeto_anterior, referencia, descripcion, usuario, fecha, hora, empresa_id)
			VALUES ('Crear', 'Clientes', '" . $_POST["empresa_cliente"] . "','', '" . $result . "', 'Crear Cliente', '" . $id_usuario . "', '" . $factual . "', '" . $horactual . "', '" . $user_empresa_id . "')";
		$Data->ejecuteRegistro($sql_historico);


		// Se crea los responsables del cliente
		foreach ($Clientes->getEnumTipoServicio() as $key => $value) {
			$_servicio = strtolower(str_replace(" ", "_", $value));

			if (isset($_POST["slct_" . $_servicio . "_comercial_1"]) and isset($_POST["slct_" . $_servicio . "_servicio_1"])) {
				// Se guarda el servicio propuesto al cliente
				$arrayServicio = array(
					'id_cliente' => $result,
					'servicio' => $value,
				);
				$result_01 = $Data->setRegistro("cmx_clientes_serv_contratados", $arrayServicio);

				// Se guarda los responsables de comerciales del servicio propuesto al cliente
				$i = 1;
				$_flag_comercial = true;
				do {
					if (isset($_POST["slct_" . $_servicio . "_comercial_" . $i])) {
						$arrayResponsableComercial = array(
							'id_serv_contratado' => $result_01,
							'id_usuario' => $_POST["slct_" . $_servicio . "_comercial_" . $i],
							'tipo_ejecutivo' => 'Ejecutivo Comercial',
						);
						$result_02 = $Data->setRegistro("cmx_clientes_serv_responsables", $arrayResponsableComercial);
					} else {
						$_flag_comercial = false;
					}
					$i++;
				} while ($_flag_comercial);

				// Se guarda los responsables de servicio al cliente del servicio propuesto al cliente
				$i = 1;
				$_flag_servicio = true;
				do {
					if (isset($_POST["slct_" . $_servicio . "_servicio_" . $i])) {
						$arrayResponsableServicio = array(
							'id_serv_contratado' => $result_01,
							'id_usuario' => $_POST["slct_" . $_servicio . "_servicio_" . $i],
							'tipo_ejecutivo' => 'Ejecutivo Servicio al Cliente',
						);
						$result_02 = $Data->setRegistro("cmx_clientes_serv_responsables", $arrayResponsableServicio);
					} else {
						$_flag_servicio = false;
					}
					$i++;
				} while ($_flag_servicio);
			} else {
				$_flag_servicio = false;
			}
		}

		//Se crea las sedes des cliente
		if ($result) {
			/*$arraySede =Array(
            'id' =>null,
            'id_cliente' =>$result,
            'nombre_sede' => $_POST["name_sede"],
            'ciudad' => $_POST["municipio_sede"],
            'direccion' => $_POST["sede_direccion"],
            'telefono' => $_POST["tel_sede"],
            'encargado' => $_POST["encargado_sede"],
            'correo' => $_POST["correo_sede"],
            'codigo_postal' => $_POST["codigo_postal"],
            'estado' =>1,
            'condicion_facturacion' => $_POST["factura_sede"],
            'condicion_pago' => $_POST["pago_sede"],
            'dia_informacion' => $_POST["atencion_sede"],
            'restriccion_acceso' => $_POST["restri_sede"],
            'instruccion_especial' => $_POST["instruccion_sede"],
            'obligacion_tributaria' => $_POST["tributaria"]
            );
            $result_02 = $Data->setRegistro("cmx_cliente_sede", $arraySede);*/
			//Se crea registro en la tabla de transacción NexosApp + Ministerio transporte
			$arrayTransaccion = array(
				'codigo_proceso' => $_POST["documento"],
				'tipo' => 'Tercero',
				'estado_envio_rndc' => 0,
				'estado' => 1,
				'fecha' => $factual,
				'hora' => $horactual,
				'usuario' => $id_usuario,
				'tipo_tercero' => 'Cliente',
				'accion' => 'Crear',
			);
			$result_04 = $Data->setRegistro("web_service_rndc", $arrayTransaccion);
		}

		// Se sube el documento adjunto al servidor
		$arrayDocumento = array(
			'id_cliente' => $result,
			'documento' => $_POST["documento"],
			'tipo_documento' => 20,
			'fecha_expedicion' => $_POST["fecha_expedicion"],
		);
		$result_1 = $Clientes->setDocumentoCliente($_FILES, "url_rut", $arrayDocumento);
		// $return["sube_documento"] = $result_1;

		if ($result_1["result"]) {
			$idclientea =  $result;
			// Se adiciona el documento del cliente en la base de datos
			$arrayDocumento = array(
				'id_cliente' => $idclientea,
				'id_tipo_documento' => 20,
				'numero_documento' => $_POST["numero_documento"],
				'fecha_expedicion' => $_POST["fecha_expedicion"],
				'url_documento' => $_POST["fecha_expedicion"] . "-" . $result . "." . $Clientes->get_extension_archivo($_FILES["url_rut"]["name"]),
			);
			$result = $Data->setRegistro("cmx_clientes_documentos", $arrayDocumento);
			// $return["arrayDocumento_result"] = $result;
			// $return["arrayDocumento"] = $arrayDocumento;

			// Se adiciona el documento del cliente en la base de datos
			$arrayRut = array(
				'id_documento' =>  $result,
				'ciiu_principal' => $_POST["ciiu_principal"],
				'actividad_aduanera' => $_POST["actividad_aduanera"]
			);
			$result = $Data->setRegistro("cmx_clientes_rut", $arrayRut);
			// $return["arrayRut_result"] = $result;
			// $return["arrayRut"] = $arrayRut;
		}

		$_array_result = $result;
		$return["result"] = $_array_result;
		break;

	case 'formEditaInfoCliente':
		$_msg_control .= "Entro en la accion formEditaInfoCliente.\n";

		// Se busca la información del Cliente
		$result = $Clientes->getClienteInfoCompleta($_POST["id"]); //aqui no
		$return["result"] = $result;

		$cliente = $result["general"]["rowsData"][0];
		// $return["cliente"] = $cliente;

		// Se crea el título del popup
		$return["title"] = "Editar Cliente - " . $cliente["nombre"];
		if ($cliente["cod_cliente"]) {
			$return["title"] = "Editar Cliente - " . $cliente["nombre"] . " (" . $cliente["cod_cliente"] . ")";
		}

		// Se valida el nombre del cliente
		$nom_cliente = str_replace($cliente["tipo_sociedad"], "", $cliente["nombre"]);

		// Se valida información del RUT
		$_info_rut = '
				<div class="row"></div>
				<div class="form-group col-sm-4">
					<label class="control-label">(*) Número Formulario RUT:</label>
					<input type="number" min="0" name="numero_formulario" id="numero_formulario" class="form-control input-sm">
				</div>
				<div class="form-group col-sm-4">
					<label class="control-label">(*) Fecha Renovación RUT:</label>
					<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
						<input size="10" type="text" value="" name="rut_expedicion" id="rut_expedicion" readonly="" class="form-control input-sm">
						<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
					</div>
				</div>
				<div class="form-group col-sm-4">
					<label class="control-label">(*) Adjunto RUT:</label><br />
					<input type="file" name="rut_file" id="rut_file" class="inputfile">
					<label for="rut_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
				</div>
				<div class="form-group col-sm-2"></div>
				<div class="form-group col-sm-4">
					<label class="control-label">(*) CIIU Separados por (<strong>,</strong>):</label>
					<input type="text" name="ciiu_principal" id="ciiu_principal" class="form-control input-sm">
				</div>
				<div class="form-group col-sm-4">
					<label class="control-label">Actividad Aduanera Separados por (<strong>,</strong>):</label>
					<input type="text" name="actividad_aduanera" id="actividad_aduanera" class="form-control input-sm">
				</div>
				<div class="form-group col-sm-2"></div>
			';

		// Se valida si el cliente ya tiene un RUT registrado
		if (isset($result["RUT"]) and $result["RUT"]) {
			// $return["RUT"] = $result["RUT"];
			$rut = $result["RUT"];

			// Se valida cuales usuarios pueden cambiar los adjuntos subidos
			$_flag_cambia_archivo = false;
			if (
				$_POST["id_perfil"] == 1 or $_POST["id_perfil"] == 13
				or $_POST["id_perfil"] == 22
			) {
				$_flag_cambia_archivo = true;
			}

			$_cambia_archivo = '';
			if ($_flag_cambia_archivo) {
				$_cambia_archivo = '
						<div class="form-group col-sm-1 div_rut_file">
							<br />
							<table class="table">
								<tbody>
									<tr>
										<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
											<center>
												<span class="icon mdi mdi-edit" id="link_rut_file"></span>
											</center>
										</td>
									</tr>
									<tr><td></td></tr>
								</tbody>
							</table>
						</div>
					';
			}

			$_info_rut = '
					<div class="row"></div>
					<div class="form-group col-sm-4">
						<label class="control-label">(*) Número Formulario RUT:</label>
						<input type="number" min="0" name="numero_formulario" id="numero_formulario" value="' . $rut["numero_documento"] . '" class="form-control input-sm" disabled>
					</div>
					<div class="form-group col-sm-4">
						<label class="control-label">(*) Fecha Renovación RUT:</label>
						<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group" style="padding: 0">
							<input size="10" type="text" value="' . $rut["fecha_expedicion"] . '" name="rut_expedicion" id="rut_expedicion" disabled class="form-control input-sm">
							<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
						</div>
					</div>
					<div class="form-group col-sm-3" id="div_rut_file" style="display: none">
						<label class="control-label">(*) Adjunto RUT:</label><br />
						<input type="file" name="rut_file" id="rut_file" class="inputfile">
						<label for="rut_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
					</div>
					<div class="form-group col-sm-2 div_rut_file">
						<div class="icon-container">
							<a href="' . BASE_URL . 'public/files/clientes/' . $rut["DOC_CLIENTE"] . '/' . $rut["folder"] . '/' . $rut["url_documento"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
								<span class="mdi mdi-download"></span>
							</a>
						</div>
					</div>
					' . $_cambia_archivo . '
					<div class="form-group col-sm-2"></div>
					<div class="form-group col-sm-4">
						<label class="control-label">(*) CIIU Separados por (<strong>,</strong>):</label>
						<input type="text" name="ciiu_principal" id="ciiu_principal" value="' . $rut["ciiu_principal"] . '" class="form-control input-sm" disabled>
					</div>
					<div class="form-group col-sm-4">
						<label class="control-label">Actividad Aduanera Separados por (<strong>,</strong>):</label>
						<input type="text" name="actividad_aduanera" id="actividad_aduanera" value="' . $rut["actividad_aduanera"] . '" class="form-control input-sm" disabled>
					</div>
					<div class="form-group col-sm-2"></div>
				';
		}

		// Información básica
		$_info_basico = '
				<div id="info_basico" class="tab-pane active cont">
					<input id="e_id_cliente" type="hidden" class="form-control input-sm" value="' . $cliente["id"] . '">
					<div class="form-group col-sm-3">
						<label class="control-label">(*) Tipo de Documento:</label>
						' . $Clientes->getEnumSlctTipoDocumento_sm("tipo_documento", "", $cliente["tipo_documento"]) . '
					</div>
					<div class="form-group col-sm-3">
						<label class="control-label">(*) Régimen:</label>
						' . $Clientes->getEnumSlctRegimen_sm("regimen", "", $cliente["regimen"]) . '
					</div>
					<div class="form-group col-sm-3">
						<label class="control-label">(*) Documento:</label>
						<input type="number" min="0" name="documento" id="documento" value="' . $cliente["documento"] . '" placeholder="Nit" class="form-control input-sm" disabled>
					</div>
					<div class="form-group col-sm-3">
						<label class="control-label">(*) Dígito Verficación:</label>
						<input type="number" min="0" name="digito_verificacion" id="digito_verificacion" value="' . $cliente["digito_verificacion"] . '" placeholder="# Verificación" class="form-control input-sm" readonly="readonly">
					</div>
					<div class="form-group col-sm-6">
						<label class="control-label">(*) Nombre o Razón social:</label>
						<input type="text" name="nombre" id="nombre" value="' . $nom_cliente . '" placeholder="Nombre Cliente" class="form-control input-sm" onkeyup="Validar_Nombre(event);">
						<span id="mensajeNombre" style="color: red;"></span>
						</div>
					<div class="form-group col-sm-2">
						<label class="control-label">(*) Tipo Sociedad:</label>
						' . $Clientes->getEnumSlctTipoSociedad_sm("tipo_sociedad", "", $cliente["tipo_sociedad"]) . '
					</div>
					<div class="form-group col-sm-4">
						<label class="control-label">(*) Sigla:</label>
						<input type="text" name="sigla" id="sigla" placeholder="Sigla" value="' . $cliente["sigla"] . '" class="form-control input-sm">
					</div>
					<div class="form-group col-sm-12">
						<label class="control-label">(*) Actividad:</label>
						<textarea name="actividad_cliente" id="actividad_cliente" class="form-control input-sm" data-parsley-id="73" required="" >' . $cliente["actividad_cliente"] . '</textarea>
					</div>
					' . $_info_rut . '
				</div>
			';

		// Ubicación
		if ($cliente["condicion_pago"] == 0) {
			$page = '<option value="0" disabled>Seleccione</option>
					<option value="1">Transferencia</option>
					<option value="2">Cheque</option>
					<option value="3">Consignación</option>
					<option value="4">Contraentrega</option>';
		}
		if ($cliente["condicion_pago"] == 1) {
			$page = '<option value="1">Transferencia</option>
					<option value="2">Cheque</option>
					<option value="3">Consignación</option>
					<option value="4">Contraentrega</option>';
		}
		if ($cliente["condicion_pago"] == 2) {
			$page = '<option value="2">Cheque</option>
					<option value="1">Transferencia</option>
					<option value="3">Consignación</option>
					<option value="4">Contraentrega</option>';
		}
		if ($cliente["condicion_pago"] == 3) {
			$page = '<option value="3">Consignación</option>
					<option value="2">Cheque</option>
					<option value="1">Transferencia</option>
					<option value="4">Contraentrega</option>';
		}
		if ($cliente["condicion_pago"] == 4) {
			$page = '<option value="4">Contraentrega</option>
					<option value="3">Consignación</option>
					<option value="2">Cheque</option>
					<option value="1">Consignación</option>';
		}
		$_info_ubicacion = '
				<div id="info_ubicacion" class="tab-pane cont">
					<div class="form-group col-sm-8">
						<label class="control-label">(*) Ciudad:</label>
						' . $Municipio->getHtmlSelect_sm("ciudad", $cliente["id"], $cliente["ciudad"]) . '
					</div>
					<div class="form-group col-sm-4">
						<label class="control-label">Código Postal:</label>
						<input type="number" name="codigo_postal" id="codigo_postal" value="' . $cliente["codigo_postal"] . '" min="0" placeholder="Código Postal" class="form-control input-sm">
					</div>

					<div class="form-group col-sm-6">
						<label class="control-label">(*) Dirección:</label>
						<button class="btn-success mdi mdi-arrows btn-xs" id="btnmascarae_direccion"></button>
						<input type="text" name="direccion" id="direccion" value="' . $cliente["direccion"] . '" placeholder="Dirección" class="form-control input-sm" readonly="readonly">
					</div>
					<div class="form-group col-sm-2">
						<label class="control-label">(*) Teléfono:</label>
						<input type="number" name="telefono" id="telefono" value="' . $cliente["telefono"] . '" min="0" max="9999999" placeholder="Teléfono" class="form-control input-sm" onkeyup="Validar_Telefono(event);">
						<span id="mensajeTelefono" style="color: red;"></span>
						</div>
					<div class="form-group col-sm-4">
						<label class="control-label">(*) E-mail:</label>
						<input type="mail" name="email" id="email" value="' . $cliente["email"] . '" placeholder="E-mail" class="form-control input-sm" onkeyup="Validar_Correo(event);">
						<span id="mensajeCorreo" style="color: red;"></span>
					</div>

					<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="div_mascarae">
										<div class="col-sm-12" style="color:blue;"><hr></hr>
											<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
												<label><strong>Generador Dirección</strong></label>
											</div>
											<div class="col-xs-3 col-sm-3 col-md-3">
												<div class="be-checkbox inline">
													<input type="checkbox" id="Complemente" class="form-control input-sm comple_direce">
													<label for="Complemente">¿Complemento?</label>
												</div>
											</div>
											<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
												<button id="limpiare" class="btn-xs btn-info">Limpiar</button>
											</div>
										</div>
										<div class="col-sm-3">
											<label><strong>Tipo vía:(*)</strong></label>
											<select id="di_tipoviae" class="form-control input-xs addresse">
												<option value="">Seleccione</option>
												<option value="AC">AC	Avenida calle</option>
												<option value="AD">AD	Administración</option>
												<option value="ADL">ADL	Adelante</option>
												<option value="AER">AER	Aeropuerto</option>
												<option value="AG">AG	Agencia</option>
												<option value="AGP">AGP	Agrupación</option>
												<option value="AK">AK	Avenida carrera</option>
												<option value="AL">AL	Altillo</option>
												<option value="ALD">ALD	Al lado</option>
												<option value="ALM">ALM	Almacén</option>
												<option value="AP">AP	Apartamento</option>
												<option value="APTDO">APTDO	Apartado</option>
												<option value="ATR">ATR	Atrás</option>
												<option value="AUT">AUT	Autopista</option>
												<option value="AV">AV	Avenida</option>
												<option value="AVIAL">AVIAL	Anillo vial</option>
												<option value="BG">BG	Bodega</option>
												<option value="BL">BL	Bloque</option>
												<option value="BLV">BLV	Boulevard</option>
												<option value="BR">BR	Barrio</option>
												<option value="C">C	Corregimiento</option>
												<option value="CA">CA	Casa</option>
												<option value="CAS">CAS Caserío</option>
												<option value="CC">CC	Centro comercial</option>
												<option value="CD">CD	Ciudadela</option>
												<option value="CEL">CEL	Célula</option>
												<option value="CEN">CEN Centro</option>
												<option value="CIR">CIR Circular</option>
												<option value="CL">CL Calle</option>
												<option value="CLJ">CLJ	Callejón</option>
												<option value="CN">CN	Camino</option>
												<option value="CON">CON Conjunto residencial</option>
												<option value="CONJ">CONJ Conjunto</option>
												<option value="CR">CR	Carrera</option>
												<option value="CRT">CRT	Carretera</option>
												<option value="CRV">CRV	Circunvalar</option>
												<option value="CS">CS	Consultorio</option>
												<option value="DG">DG	Diagonal</option>DG	Diagonal
												<option value="DP">DP	Depósito</option>
												<option value="DPTO">DPTO	Departamento</option>
												<option value="DS">DS	Depósito sótano</option>
												<option value="ED">ED	Edificio</option>
												<option value="EN">EN	Entrada</option>
												<option value="ES">ES	Escalera</option>
												<option value="ESQ">ESQ	Esquina</option>
												<option value="ESTE">ESTE	Este</option>
												<option value="ET">ET	Etapa</option>
												<option value="EX">EX	Exterior</option>
												<option value="FCA">FCA Finca</option>
												<option value="GJ">GJ	Garaje</option>
												<option value="GS">GS	Garaje sótano</option>
												<option value="GT">GT	Glorieta</option>
												<option value="HC">HC	Hacienda</option>
												<option value="HG">HG	Hangar</option>
												<option value="IN">IN	Interior</option>
												<option value="IP">IP	Inspección de Policía</option>
												<option value="IPD">IPD	Inspección Departamental</option>
												<option value="IPM">IPM	Inspección Municipal</option>
												<option value="KM">KM	Kilómetro</option>
												<option value="LC">LC	Local</option>
												<option value="LM">LM	Local mezzanine</option>
												<option value="LT">LT	Lote</option>
												<option value="MD">MD	Módulo</option>
												<option value="MJ">MJ	Mojón</option>
												<option value="MLL">MLL	Muelle</option>
												<option value="MN">MN	Mezzanine</option>
												<option value="MZ">MZ	Manzana</option>
												<option value="NOMBRE VIA">NOMBRE VIA	Vías de nombre común</option>
												<option value="NORTE">NORTE	Norte</option>
												<option value="O">O	Oriente</option>
												<option value="OCC">OCC	Occidente</option>
												<option value="OESTE">OESTE	Oeste</option>
												<option value="OF">OF	Oficina</option>
												<option value="P">P	Piso</option>
												<option value="PA">PA	Parcela</option>
												<option value="PAR">PAR	Parque</option>
												<option value="PD">PD	Predio</option>
												<option value="PH">PH	Penthouse</option>
												<option value="PJ">PJ	Pasaje</option>
												<option value="PL">PL	Planta</option>
												<option value="PN">PN	Puente</option>
												<option value="POR">POR	Portería</option>
												<option value="POS">POS	Poste</option>
												<option value="PQ">PQ	Parqueadero</option>
												<option value="PRJ">PRJ	Paraje</option>
												<option value="PS">PS	Paseo</option>
												<option value="PT">PT	Puesto</option>
												<option value="PW">PW	Park Way</option>
												<option value="RP">RP	Round Point</option>
												<option value="SA">SA	Salón</option>
												<option value="SC">SC	Salón comunal</option>
												<option value="SD">SD	Salida</option>
												<option value="SEC">SEC	Sector</option>
												<option value="SL">SL	Solar</option>
												<option value="SM">SM	Súper manzana</option>
												<option value="SS">SS	Semisótano</option>
												<option value="ST">ST	Sótano</option>
												<option value="SUITE">SUITE	Suite</option>
												<option value="SUR">SUR	Sur</option>
												<option value="TER">TER	Terminal</option>
												<option value="TERPLN">TERPLN	Terraplén</option>
												<option value="TO">TO	Torre</option>
												<option value="TV">TV	Transversal</option>
												<option value="TZ">TZ	Terraza</option>
												<option value="UN">UN	Unidad</option>
												<option value="UR">UR	Unidad residencial</option>
												<option value="URB">URB	Urbanización</option>
												<option value="VRD">VRD	Vereda</option>
												<option value="VTE">VTE	Variante</option>
												<option value="ZF">ZF	Zona franca</option>
												<option value="ZN">ZN	Zona</option>
											</select>
										</div>
										<div class="col-sm-3">
											<label><strong>Nombre/Num de vía:(*)</strong> </label>
											<input type="text" id="di_nomviae" class="form-control input-xs addresse">
										</div>
										<div class="col-sm-3">
											<label><strong>Letra:</strong></label><br>
											<select id="di_letra1e" class="form-control input-xs addresse">
												<option value="">Seleccione</option>
												<option value="A">A</option>
												<option valu="B">B</option>
												<option value="C">C</option>
												<option value="D">D</option>
												<option value="E">E</option>
												<option value="F">F</option>
												<option value="G">G</option>
												<option value="H">H</option>
												<option value="I">I</option>
												<option value="J">J</option>
												<option value="K">K</option>
												<option value="L">L</option>
												<option value="M">M</option>
												<option value="N">N</option>
												<option value="O">O</option>
												<option value="P">P</option>
												<option value="Q">Q</option>
												<option value="R">R</option>
												<option value="S">S</option>
												<option value="T">T</option>
												<option value="U">U</option>
												<option value="V">V</option>
												<option value="W">W</option>
												<option value="X">X</option>
												<option value="Y">Y</option>
												<option value="Z">Z</option>
											</select>
										</div>
										<div class="col-sm-3">
											<label><strong>Prefijo:</strong></label>
											<select id="di_prefijo1e" class="form-control input-xs addresse">
												<option value="">Seleccione</option>
												<option value="BIS">BIS</option>
											</select>
										</div>
										<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><hr/></div>
										<div class="col-sm-4">
											<label><strong>Letra:</strong></label>
											<select id="di_letra2e" class="form-control input-xs addresse">
												<option value="">Seleccione</option>
												<option value="A">A</option>
												<option valu="B">B</option>
												<option value="C">C</option>
												<option value="D">D</option>
												<option value="E">E</option>
												<option value="F">F</option>
												<option value="G">G</option>
												<option value="H">H</option>
												<option value="I">I</option>
												<option value="J">J</option>
												<option value="K">K</option>
												<option value="L">L</option>
												<option value="M">M</option>
												<option value="N">N</option>
												<option value="O">O</option>
												<option value="P">P</option>
												<option value="Q">Q</option>
												<option value="R">R</option>
												<option value="S">S</option>
												<option value="T">T</option>
												<option value="U">U</option>
												<option value="V">V</option>
												<option value="W">W</option>
												<option value="X">X</option>
												<option value="Y">Y</option>
												<option value="Z">Z</option>
											</select>
										</div>
										<div class="col-sm-4">
											<label><strong>Cuadrante:</strong></label>
											<select id="di_cuadrantee" class="form-control input-xs addresse">
												<option value="">Seleccione</option>
												<option value="Norte">Norte</option>
												<option value="Sur">Sur</option>
												<option value="Este">Este</option>
												<option value="Oeste">Oeste</option>
											</select>
										</div>
										<div class="col-sm-4">
											<label><strong>Número:</strong></label>
											<input type="number" id="di_num1e" class="form-control input-xs addresse">
										</div>
										<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><hr/></div>
										<div class="col-xs-4 col-sm-4 col-md-4">
											<label><strong>Letra:</strong></label>
											<select id="di_letra3e" class="form-control input-xs addresse">
												<option value="">Seleccione</option>
												<option value="A">A</option>
												<option valu="B">B</option>
												<option value="C">C</option>
												<option value="D">D</option>
												<option value="E">E</option>
												<option value="F">F</option>
												<option value="G">G</option>
												<option value="H">H</option>
												<option value="">I</option>
												<option value="J">J</option>
												<option value="K">K</option>
												<option value="L">L</option>
												<option value="M">M</option>
												<option value="N">N</option>
												<option value="O">O</option>
												<option value="">P</option>
												<option value="Q">Q</option>
												<option value="R">R</option>
												<option value="S">S</option>
												<option value="T">T</option>
												<option value="U">U</option>
												<option value="V">V</option>
												<option value="W">W</option>
												<option value="X">X</option>
												<option value="Y">Y</option>
												<option value="Z">Z</option>
											</select>
										</div>
										<div class="col-sm-4">
											<label><strong>Número:</strong></label>
											<input type="number" id="di_numero2e" class="form-control input-xs addresse">
										</div>
										<div class="col-sm-4">
											<label><strong>Cuadrante:</strong></label>
											<select id="di_cuadrantee2" class="form-control input-xs addresse">
												<option value="">Seleccione</option>
												<option value="Norte">Norte</option>
												<option value="Sur">Sur</option>
												<option value="Este">Este</option>
												<option value="Oeste">Oeste</option>
											</select>
										</div>
										<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="e_complemento">
											<div class="col-sm-10"><hr></hr><label>Complemento 1</label></div>
											<div class="col-sm-6">
												<label><strong>Tipo vía:</strong></label>
												<select id="di_tipovia1e" class="form-control input-xs addresse">
													<option value="">Seleccione</option>
													<option value="AC">AC	Avenida calle</option>
													<option value="AD">AD	Administración</option>
													<option value="ADL">ADL	Adelante</option>
													<option value="AER">AER	Aeropuerto</option>
													<option value="AG">AG	Agencia</option>
													<option value="AGP">AGP	Agrupación</option>
													<option value="AK">AK	Avenida carrera</option>
													<option value="AL">AL	Altillo</option>
													<option value="ALD">ALD	Al lado</option>
													<option value="ALM">ALM	Almacén</option>
													<option value="AP">AP	Apartamento</option>
													<option value="APTDO">APTDO	Apartado</option>
													<option value="ATR">ATR	Atrás</option>
													<option value="AUT">AUT	Autopista</option>
													<option value="AV">AV	Avenida</option>
													<option value="AVIAL">AVIAL	Anillo vial</option>
													<option value="BG">BG	Bodega</option>
													<option value="BL">BL	Bloque</option>
													<option value="BLV">BLV	Boulevard</option>
													<option value="BR">BR	Barrio</option>
													<option value="C">C	Corregimiento</option>
													<option value="CA">CA	Casa</option>
													<option value="CAS">CAS Caserío</option>
													<option value="CC">CC	Centro comercial</option>
													<option value="CD">CD	Ciudadela</option>
													<option value="CEL">CEL	Célula</option>
													<option value="CEN">CEN Centro</option>
													<option value="CIR">CIR Circular</option>
													<option value="CL">CL Calle</option>
													<option value="CLJ">CLJ	Callejón</option>
													<option value="CN">CN	Camino</option>
													<option value="CON">CON Conjunto residencial</option>
													<option value="CONJ">CONJ Conjunto</option>
													<option value="CR">CR	Carrera</option>
													<option value="CRT">CRT	Carretera</option>
													<option value="CRV">CRV	Circunvalar</option>
													<option value="CS">CS	Consultorio</option>
													<option value="DG">DG	Diagonal</option>DG	Diagonal
													<option value="DP">DP	Depósito</option>
													<option value="DPTO">DPTO	Departamento</option>
													<option value="DS">DS	Depósito sótano</option>
													<option value="ED">ED	Edificio</option>
													<option value="EN">EN	Entrada</option>
													<option value="ES">ES	Escalera</option>
													<option value="ESQ">ESQ	Esquina</option>
													<option value="ESTE">ESTE	Este</option>
													<option value="ET">ET	Etapa</option>
													<option value="EX">EX	Exterior</option>
													<option value="FCA">FCA Finca</option>
													<option value="GJ">GJ	Garaje</option>
													<option value="GS">GS	Garaje sótano</option>
													<option value="GT">GT	Glorieta</option>
													<option value="HC">HC	Hacienda</option>
													<option value="HG">HG	Hangar</option>
													<option value="IN">IN	Interior</option>
													<option value="IP">IP	Inspección de Policía</option>
													<option value="IPD">IPD	Inspección Departamental</option>
													<option value="IPM">IPM	Inspección Municipal</option>
													<option value="KM">KM	Kilómetro</option>
													<option value="LC">LC	Local</option>
													<option value="LM">LM	Local mezzanine</option>
													<option value="LT">LT	Lote</option>
													<option value="MD">MD	Módulo</option>
													<option value="MJ">MJ	Mojón</option>
													<option value="MLL">MLL	Muelle</option>
													<option value="MN">MN	Mezzanine</option>
													<option value="MZ">MZ	Manzana</option>
													<option value="NOMBRE VIA">NOMBRE VIA	Vías de nombre común</option>
													<option value="NORTE">NORTE	Norte</option>
													<option value="O">O	Oriente</option>
													<option value="OCC">OCC	Occidente</option>
													<option value="OESTE">OESTE	Oeste</option>
													<option value="OF">OF	Oficina</option>
													<option value="P">P	Piso</option>
													<option value="PA">PA	Parcela</option>
													<option value="PAR">PAR	Parque</option>
													<option value="PD">PD	Predio</option>
													<option value="PH">PH	Penthouse</option>
													<option value="PJ">PJ	Pasaje</option>
													<option value="PL">PL	Planta</option>
													<option value="PN">PN	Puente</option>
													<option value="POR">POR	Portería</option>
													<option value="POS">POS	Poste</option>
													<option value="PQ">PQ	Parqueadero</option>
													<option value="PRJ">PRJ	Paraje</option>
													<option value="PS">PS	Paseo</option>
													<option value="PT">PT	Puesto</option>
													<option value="PW">PW	Park Way</option>
													<option value="RP">RP	Round Point</option>
													<option value="SA">SA	Salón</option>
													<option value="SC">SC	Salón comunal</option>
													<option value="SD">SD	Salida</option>
													<option value="SEC">SEC	Sector</option>
													<option value="SL">SL	Solar</option>
													<option value="SM">SM	Súper manzana</option>
													<option value="SS">SS	Semisótano</option>
													<option value="ST">ST	Sótano</option>
													<option value="SUITE">SUITE	Suite</option>
													<option value="SUR">SUR	Sur</option>
													<option value="TER">TER	Terminal</option>
													<option value="TERPLN">TERPLN	Terraplén</option>
													<option value="TO">TO	Torre</option>
													<option value="TV">TV	Transversal</option>
													<option value="TZ">TZ	Terraza</option>
													<option value="UN">UN	Unidad</option>
													<option value="UR">UR	Unidad residencial</option>
													<option value="URB">URB	Urbanización</option>
													<option value="VRD">VRD	Vereda</option>
													<option value="VTE">VTE	Variante</option>
													<option value="ZF">ZF	Zona franca</option>
													<option value="ZN">ZN	Zona</option>
												</select>
											</div>
											<div class="col-sm-6">
												<label><strong>Número/Nombre</strong></label>
												<input type="text" id="di_numero3e" class="form-control input-xs addresse">
											</div>
										</div>
										<div class="col-sm-12 col-md-12 col-lg-12">
											<label><strong>Dirección final</strong></label>
											<input type="text" id="direccion_compuestae" class="form-control input-xs" readonly="readonly">
										</div>
										<div class="col-sm-10"><hr></hr></div>
									</div>

					<div class="form-group col-sm-12">
						<label class="control-label">Indicaciones de llegada:</label>
						<textarea name="indicaciones_llegada" id="indicaciones_llegada" class="form-control input-sm" >' . $cliente["direccion"] . '</textarea>
					</div>
					<div class="form-group col-xs-6">
						<span id="mensajesede" style="color: red;"></span>
						<label class="control-label">Nombre Sede:</label>
						<input type="text" id="namesede' . $cliente["id"] . '" class="form-control input-xs" value="' . $cliente["nom_sede"] . '" onkeyup="Valida_Sede(event);">
					</div>
					<div class="form-group col-xs-6">
						<label class="control-label">Persona encargado:</label>
						<input type="text" id="personasede' . $cliente["id"] . '" class="form-control input-xs" value="' . $cliente["encargado"] . '">
					</div>
					<div class="form-group col-xs-6">
						<label class="control-label">Días información:</label>
						<textarea id="infosede' . $cliente["id"] . '" class="form-control input-xs">' . $cliente["dia_informacion"] . '</textarea>
					</div>
					<div class="form-group col-xs-4">
					<label class="control-label">Condición de Pago:</label>
						<select id="condicion' . $cliente["id"] . '" class="form-control input-xs">' . $page . '</select>
					</div>
					<div class="form-group col-xs-12">
						<label class="control-label">Condición facturación:</label>
						<textarea id="factu' . $cliente["id"] . '" class="form-control input-xs">' . $cliente["condicion_facturacion"] . '</textarea>
					</div>
					<div class="form-group col-xs-4">
						<label class="control-label">Obligación tributaria:</label>
						' . $Clientes->getObligacionTributaria($cliente["obligacion_tributaria"], $cliente["id"]) . '
					</div>
					<div class="form-group col-xs-6">
						<label class="control-label">Restricción acceso:</label>
						<textarea id="restrisede' . $cliente["id"] . '" class="form-control input-xs">' . $cliente["restriccion_acceso"] . '</textarea>
					</div>
					<div class="form-group col-xs-6">
						<label class="control-label">Instrucción especial:</label>
						<textarea id="instrusede' . $cliente["id"] . '" class="form-control input-xs">' . $cliente["instruccion_especial"] . '</textarea>
					</div>
					<div class="form-group col-xs-4">
						<label class="control-label">Empresa:</label>
							' . $Clientes->getEmpresaCliente($cliente["empresa_cliente"], $cliente["id"]) . '
					</div>
				</div>
			';

		$_info_responsables = '
				<div id="info_responsables" class="tab-pane cont">
					<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible" id="msg_info_responsables">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<strong>Error!</strong>
							<p>No se ha seleccionado ningún servicio para el cliente...</p>
						</div>
					</div>
				</div>
			';
		//Actualización Sedes

		/*
        $_info_sedes = '<div id="info_esede" class="tab-pane cont">
        <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <table class="table table-condensed table-striped">
        <thead>
        </thead>
        <tbody>
        ';
        if( isset($result["sedes_cliente"]["rowsData"]) AND $result["sedes_cliente"]["rowsData"] ){
        $conteo=0;
        foreach($result["sedes_cliente"]["rowsData"] as $key => $value ){
        $conteo++;
        if($value["condicion_pago"]==1){
        $page='<option value="1">Transferencia</option>
        <option value="2">Cheque</option>
        <option value="3">Consignación</option>
        <option value="4">Contraentrega</option>
        ';
        }
        if($value["condicion_pago"]==2){
        $page='<option value="2">Cheque</option>
        <option value="1">Transferencia</option>
        <option value="3">Consignación</option>
        <option value="4">Contraentrega</option>
        ';
        }
        if($value["condicion_pago"]==3){
        $page='<option value="3">Consignación</option>
        <option value="2">Cheque</option>
        <option value="1">Transferencia</option>
        <option value="4">Contraentrega</option>
        ';
        }
        if($value["condicion_pago"]==4){
        $page='<option value="4">Contraentrega</option>
        <option value="3">Consignación</option>
        <option value="2">Cheque</option>
        <option value="1">Consignación</option>
        ';
        }

        //$btn_update_sede='<button class="mdi mdi-edit"></button>';
        //$btn_update_sede='';
        $btn_update_sede = '
        <a href="javascript:" onclick="editarSedeu(' . $value[0] . ')" class="cell-detail  hint--top-left" data-hint="Editar sede">
        <span class="icon mdi mdi-edit"></span>
        </a>
        ';

        $_info_sedes.='<tr>
        <td><strong>Sede:</strong>
        <input type="text" id="namesede'.$value["id"].'" class="form-control input-xs" value="'.$value["nombre_sede"].'">
        </td>
        <td><strong>Municipio:</strong>
        '.$Clientes->getmunicipiosede($value["ciudad"],$value["id"] ).'
        </td>
        <td><strong>Dirección:</strong>
        <input type="text" id="diresede'.$value["id"].'" class="form-control input-xs" value="'.$value["direccion"].'">
        </td>
        <td><strong>Teléfono: </strong>
        <input type="number" id="telesede'.$value["id"].'" class="form-control input-xs" value="'.$value["telefono"].'">
        </td>
        <td><strong>Correo:</strong>
        <input type="text" id="correosede'.$value["id"].'" class="form-control input-xs" value="'.$value["correo"].'">
        </td>
        <td><strong>Día información:</strong>
        <textarea id="infosede'.$value["id"].'" class="form-control input-xs">'.$value["dia_informacion"].'</textarea>
        </td>
        </tr>
        <tr>
        <td>Condición:
        <select id="condicion'.$value["id"].'" class="form-control input-xs">'.$page.'</select>
        </td>
        <td>Facturación:
        <textarea id="factu'.$value["id"].'" class="form-control input-xs">'.$value["condicion_facturacion"].'</textarea>
        </td>
        <td>Obligación:
        '.$Clientes->getObligacionTributaria($value["obligacion_tributaria"],$value["id"]).'
        </td>
        <td>Restricción:
        <textarea id="restrisede'.$value["id"].'" class="form-control input-xs">'.$value["restriccion_acceso"].'</textarea>
        </td>
        <td>Instrucción:
        <textarea id="instrusede'.$value["id"].'" class="form-control input-xs">'.$value["instruccion_especial"].'</textarea>
        </td>
        <td>'.$btn_update_sede.'</td>
        </tr>';

        if($conteo==1){
        $_info_sedes .='<input type="hidden" class="form-control input-sm" id="e_valor_sede" value="'.$value["id"].'">';
        }

        }

        }else{

        $_info_sedes .='';
        }
        $_info_sedes .= '
        </div>
        </div>

        </div>';*/

		// Si hay responsables creados de buscan
		if (isset($result["servicios"]["rowsData"]) and $result["servicios"]["rowsData"]) {
			$servicios = $result["servicios"]["rowsData"];
			$_servicios_content = '';
			// Se recorre los servicios enconrtados del cliente
			foreach ($servicios as $key => $value) {
				$_div = strtolower(str_replace(" ", "_", $value["servicio"]));

				// Se asigna el valor del id del servicio
				$_servicios_content .= '<input type="hidden" id="flag_' . $_div . '" value="flag_' . $_div . '">';

				// Se busca los ejecutivos comerciales
				$_ejecutivo_comercial = '<span class="cell-detail-description"><strong class="text-danger">No asignado</strong></span>';
				if (isset($result["ejecutivo_comercial"][$value["id"]]["rowsData"]) and $result["ejecutivo_comercial"][$value["id"]]["rowsData"]) {
					$usuarios = $Usuario->getUsuariosPerfil("1", "13,7,22,23,24,33,32");
					$_ejecutivo_comercial = '<input type="hidden" id="cant_' . $_div . '_comercial" value="' . $usuarios["rowsNum"] . '">';
					$i = 1;
					foreach ($result["ejecutivo_comercial"][$value["id"]]["rowsData"] as $key_01 => $value_01) {
						$_ejecutivo_comercial .= '
								<div class="form-group col-sm-12 ' . $_div . '_comercial_clon" id="form_' . $_div . '_comercial_' . $i . '">
									' . $Usuario->getHtmlSelectUsuarioPerfil_sm($_div . "_comercial_" . $i, $_div . "_comercial_" . $i, "1", "13,7,22,23,24,32,33", $value_01["ID_USUARIO"]) . '
								</div>
							';
						$i++;
					}
				}

				// Se busca los ejecutivos de servicio al cliente
				$_ejecutivo_servicio = '<span class="cell-detail-description"><strong class="text-danger">No asignado</strong></span>';
				if (isset($result["ejecutivo_cliente"][$value["id"]]["rowsData"]) and $result["ejecutivo_cliente"][$value["id"]]["rowsData"]) {
					$usuarios = $Usuario->getUsuariosPerfil("1", "5,6,7,8,9,10,11,12,22,23,24,25,26,32,33");
					$_ejecutivo_servicio = '<input type="hidden" id="cant_' . $_div . '_servicio" value="' . $usuarios["rowsNum"] . '">';
					$i = 1;
					foreach ($result["ejecutivo_cliente"][$value["id"]]["rowsData"] as $key_01 => $value_01) {
						$_ejecutivo_servicio .= '
								<div class="form-group col-sm-12 ' . $_div . '_servicio_clon" id="form_' . $_div . '_servicio_' . $i . '">
									' . $Usuario->getHtmlSelectUsuarioPerfil_sm($_div . "_servicio_" . $i, $_div . "_servicio_" . $i, "1", "5,6,7,8,9,10,11,12,22,23,24,25,26,33,32", $value_01["ID_USUARIO"]) . '
								</div>
							';
						$i++;
					}
				}

				$_servicios_content .= '
						<div class="form-group col-sm-12" id="' . $_div . '">
							<h4>' . $value["servicio"] . '</h4>
							<div class="col-sm-6" id="' . $_div . '_comercial">
								<div class="col-sm-12">
									<p><strong>Ejecutivo Comercial</strong></p>
								</div>
								<div class="icon col-sm-12 div_' . $_div . '_comercial">
									<button type="button" class="btn btn-space btn-success btn-big hint--top-right" data-hint="Agregar Ejecutivo Comercial" id="btn_' . $_div . '_agrega_comercial"><span class="mdi mdi-plus"></span></button>
									<button type="button" class="btn btn-space btn-danger btn-big hint--top-right" data-hint="Quitar Ejecutivo Comercial" id="btn_' . $_div . '_quita_comercial"><span class="mdi mdi-minus"></span></button>
								</div>
								' . $_ejecutivo_comercial . '
							</div>
							<div class="col-sm-6" id="' . $_div . '_servicio">
								<div class="col-sm-12">
									<p><strong>Responsables del Cliente</strong></p>
								</div>
								<div class="icon col-sm-12 div_' . $_div . '_servicio">
									<button type="button" class="btn btn-space btn-success btn-big hint--top-right" data-hint="Agregar Ejecutivo de Servicio al Cliente" id="btn_' . $_div . '_agrega_servicio"><span class="mdi mdi-plus"></span></button>
									<button type="button" class="btn btn-space btn-danger btn-big hint--top-right" data-hint="Quitar Ejecutivo de Servicio al Cliente" id="btn_' . $_div . '_quita_servicio"><span class="mdi mdi-minus"></span></button>
								</div>
								' . $_ejecutivo_servicio . '
							</div>
						</div>
					';
			}

			$_info_responsables = '
					<div id="info_responsables" class="tab-pane cont">
						' . $_servicios_content . '
					</div>
				';
		}

		$_msg_content .= '
				<input type="hidden" id="id_cliente" value="' . $cliente["id"] . '">
				<input type="hidden" id="cod_cliente" value="' . $cliente["cod_cliente"] . '">
				' . $Clientes->getEnumCheckTipoServicio("servicio", "") . '
				<div id="info" class="tab-pane active cont">
					<div class="tab-container">
						<ul class="nav nav-tabs nav-tabs-success">
							<li class="active"><a href="#info_basico" data-toggle="tab">Información General</a></li>
							<li><a href="#info_ubicacion" data-toggle="tab">Ubicación</a></li>
							<li><a href="#info_responsables" data-toggle="tab">Responsables</a></li>
						<!-- <li><a href="#info_esede" data-toggle="tab">Sedes</a></li> -->
						</ul>
						<div class="tab-content">
							' . $_info_basico . '
							' . $_info_ubicacion . '
							' . $_info_responsables . '
						</div>
					</div>
				</div>
			';
		break;

	case 'editaInfoCliente':
		$_msg_control .= "Entro en la accion editaInfoCliente.\n";

		//consultar si la empresa del cliente ha cambiado
		$result = $Clientes->ValidarEmpresaCambio($_POST["empresa_cliente"], $_POST["id_cliente"]);
		$empresa = $result["rowsData"][0]["empresa"];

		if ($empresa == $_POST["empresa_cliente"]) {
			ini_set('log_errors', 1);
			ini_set('error_log.txt', __DIR__ . '/php_error.log');
			// $return["post"] = $_POST;
			// $return["files"] = $_FILES;
			//Crear
			session_start();
			$fecha = date('Y-m-d');
			$hora = date('H:i:s');
			$user = $_SESSION["usuario"]["nom_usuario"];
			/*$sql1="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,fecha,hora,usuario,tipo_tercero,accion)VALUES(null,'".$_POST["documento"]."','Tercero',0,1,'".$fecha."','".$hora."','".$user."','Cliente','Actualizar')";
					$Data->ejecuteRegistro($sql1);*/

			// Se actualiza la información del cliente
			$arrayCliente = array();
			$arrayCliente["tipo_documento"] = $_POST["tipo_documento"];
			$arrayCliente["regimen"] = $_POST["regimen"];
			$arrayCliente["nombre"] = $Clientes->limpiaTexto($_POST["nombre"] . " " . $_POST["tipo_sociedad"]);
			$arrayCliente["tipo_sociedad"] = $_POST["tipo_sociedad"];
			$arrayCliente["sigla"] = $Clientes->limpiaTexto($_POST["sigla"]);
			$arrayCliente["actividad_cliente"] = $Clientes->limpiaTexto($_POST["actividad_cliente"]);
			$arrayCliente["ciudad"] = $_POST["ciudad"];
			$arrayCliente["codigo_postal"] = $Clientes->limpiaTexto($_POST["codigo_postal"]);
			$arrayCliente["direccion"] = $Clientes->limpiaTexto($_POST["direccion"]);
			$arrayCliente["telefono"] = $Clientes->limpiaTexto($_POST["telefono"]);
			$arrayCliente["email"] = $Clientes->limpiaTexto($_POST["email"]);
			$arrayCliente["indicaciones_llegada"] = $Clientes->limpiaTexto($_POST["indicaciones_llegada"]);

			$arrayCliente["nom_sede"] = $Clientes->limpiaTexto($_POST["namesede"]);
			$arrayCliente["encargado"] = $Clientes->limpiaTexto($_POST["personsede"]);
			$arrayCliente["dia_informacion"] = $Clientes->limpiaTexto($_POST["infosede"]);
			$arrayCliente["condicion_pago"] = $Clientes->limpiaTexto($_POST["condicionsede"]);
			$arrayCliente["condicion_facturacion"] = $Clientes->limpiaTexto($_POST["factusede"]);
			$arrayCliente["obligacion_tributaria"] = $Clientes->limpiaTexto($_POST["oblisede"]);
			$arrayCliente["restriccion_acceso"] = $Clientes->limpiaTexto($_POST["restrisede"]);
			$arrayCliente["instruccion_especial"] = $Clientes->limpiaTexto($_POST["instrusede"]);
			$arrayCliente["empresa"] = $Clientes->limpiaTexto($_POST["empresa_cliente"]);

			if (!$_POST["cod_cliente"]) {
				$arrayCliente["cod_cliente"] = 'CLI-' . $time;
			}
			$result = $Data->updateRegistro("cmx_clientes", $arrayCliente, (int) $_POST["id_cliente"]);

			// Se inactivan los servicios actuales del cliente
			$sql = '
					UPDATE cmx_clientes_serv_contratados
					SET estado = 0
					WHERE id_cliente = ' . $_POST["id_cliente"] . '
				';
			$Data->ejecuteRegistro($sql);

			// Se inactivan los responsables actuales de los servicios
			$sql = '
					UPDATE cmx_clientes_serv_responsables
					SET estado = 0
					WHERE id_serv_contratado IN (
							SELECT id
							FROM cmx_clientes_serv_contratados
							WHERE id_cliente = ' . $_POST["id_cliente"] . '
						)
				';
			$Data->ejecuteRegistro($sql);

			// Se crea los responsables del cliente
			foreach ($Clientes->getEnumTipoServicio() as $key => $value) {
				$_servicio = strtolower(str_replace(" ", "_", $value));
				if (isset($_POST["slct_" . $_servicio . "_comercial_1"]) and isset($_POST["slct_" . $_servicio . "_servicio_1"])) {
					// Se consulta si el servicio existe
					$_flag_servicio = $Clientes->getServicioCliente($_POST["id_cliente"], $value);
					if ($_flag_servicio) {
						$_array_servicio = $_flag_servicio["rowsData"][0];
						// Se actualiza el registro del documento
						$arrayServicio = array();
						$arrayServicio["estado"] = 1;
						$Data->updateRegistro("cmx_clientes_serv_contratados", $arrayServicio, (int) $_array_servicio["id"]);

						// Se guarda los responsables de comerciales del servicio propuesto al cliente
						$i = 1;
						$_flag_comercial = true;
						do {
							if (isset($_POST["slct_" . $_servicio . "_comercial_" . $i])) {
								// Se pregunta si el responsable ya existe
								$_flag_responsable = $Clientes->getResponsable($_array_servicio["id"], 'Ejecutivo Comercial', $_POST["slct_" . $_servicio . "_comercial_" . $i]);
								if ($_flag_responsable) {
									// Si existe se actualiza
									$_array_responsable = $_flag_responsable["rowsData"][0];
									$arrayResponsableComercial = array(
										'estado' => 1,
									);
									$Data->updateRegistro("cmx_clientes_serv_responsables", $arrayResponsableComercial, (int) $_array_responsable["id"]);
								} else {
									// Si no existe se crea
									$arrayResponsableComercial = array(
										'id_serv_contratado' => $_array_servicio[0],
										'id_usuario' => $_POST["slct_" . $_servicio . "_comercial_" . $i],
										'tipo_ejecutivo' => 'Ejecutivo Comercial',
									);
									$Data->setRegistro("cmx_clientes_serv_responsables", $arrayResponsableComercial);
								}
							} else {
								$_flag_comercial = false;
							}
							$i++;
						} while ($_flag_comercial);

						// Se guarda los responsables de servicio al cliente del servicio propuesto al cliente
						$i = 1;
						$_flag_servicio = true;
						do {
							if (isset($_POST["slct_" . $_servicio . "_servicio_" . $i])) {
								// Se pregunta si el responsable ya existe
								$_flag_responsable = $Clientes->getResponsable($_array_servicio["id"], 'Ejecutivo Servicio al Cliente', $_POST["slct_" . $_servicio . "_servicio_" . $i]);
								if ($_flag_responsable) {
									// Si existe se actualiza
									$_array_responsable = $_flag_responsable["rowsData"][0];
									$arrayResponsableServicio = array(
										'estado' => 1,
									);
									$Data->updateRegistro("cmx_clientes_serv_responsables", $arrayResponsableServicio, $_array_responsable["id"]);
								} else {
									// Si no existe se crea
									$arrayResponsableServicio = array(
										'id_serv_contratado' => $_array_servicio["id"],
										'id_usuario' => $_POST["slct_" . $_servicio . "_servicio_" . $i],
										'tipo_ejecutivo' => 'Ejecutivo Servicio al Cliente',
									);
									$Data->setRegistro("cmx_clientes_serv_responsables", $arrayResponsableServicio);
								}
							} else {
								$_flag_servicio = false;
							}
							$i++;
						} while ($_flag_servicio);
					} else {
						// Se guarda el servicio propuesto al cliente
						$arrayServicio = array(
							'id_cliente' => $_POST["id_cliente"],
							'servicio' => $value,
						);
						$result_01 = $Data->setRegistro("cmx_clientes_serv_contratados", $arrayServicio);

						// Se guarda los responsables de comerciales del servicio propuesto al cliente
						$i = 1;
						$_flag_comercial = true;
						do {
							if (isset($_POST["slct_" . $_servicio . "_comercial_" . $i])) {
								$arrayResponsableComercial = array(
									'id_serv_contratado' => $result_01,
									'id_usuario' => $_POST["slct_" . $_servicio . "_comercial_" . $i],
									'tipo_ejecutivo' => 'Ejecutivo Comercial',
								);
								$result_02 = $Data->setRegistro("cmx_clientes_serv_responsables", $arrayResponsableComercial);
							} else {
								$_flag_comercial = false;
							}
							$i++;
						} while ($_flag_comercial);

						// Se guarda los responsables de servicio al cliente del servicio propuesto al cliente
						$i = 1;
						$_flag_servicio = true;
						do {
							if (isset($_POST["slct_" . $_servicio . "_servicio_" . $i])) {
								$arrayResponsableServicio = array(
									'id_serv_contratado' => $result_01,
									'id_usuario' => $_POST["slct_" . $_servicio . "_servicio_" . $i],
									'tipo_ejecutivo' => 'Ejecutivo Servicio al Cliente',
								);
								$result_02 = $Data->setRegistro("cmx_clientes_serv_responsables", $arrayResponsableServicio);
							} else {
								$_flag_servicio = false;
							}
							$i++;
						} while ($_flag_servicio);
					}
				}
			}

			// Se pregunta si es neceario subir la información del RUT
			if (isset($_FILES) and $_FILES) {
				// Se sube el documento adjunto al servidor
				$arrayFile = array(
					'id_cliente' => $_POST["id_cliente"],
					'documento' => $_POST["documento"],
					'tipo_documento' => 20,
					'fecha_expedicion' => $_POST["fecha_expedicion"],
				);
				$result_1 = $Clientes->setDocumentoCliente($_FILES, "url_rut", $arrayFile);
				// $return["sube_documento"] = $result_1;
				// Se inactiva el los registros anteriores de la cámara de comercio
				$sql = '
						UPDATE cmx_clientes_documentos
						SET estado = "0"
						WHERE
							id_cliente = ' . $_POST["id_cliente"] . '
							AND id_tipo_documento = 20
					';
				$Data->getConsulta($sql);

				if ($result_1["result"]) {
					// Se adiciona el documento del cliente en la base de datos
					$arrayDocumento = array(
						'id_cliente' => $_POST["id_cliente"],
						'id_tipo_documento' => 20,
						'numero_documento' => $_POST["numero_documento"],
						'fecha_expedicion' => $_POST["fecha_expedicion"],
						'url_documento' => $_POST["fecha_expedicion"] . "-" . $_POST["id_cliente"] . "." . $Clientes->get_extension_archivo($_FILES["url_rut"]["name"]),
					);
					$result = $Data->setRegistro("cmx_clientes_documentos", $arrayDocumento);
					// $return["arrayDocumento_result"] = $result;
					// $return["arrayDocumento"] = $arrayDocumento;

					// Se guarda la información del RUT
					$arrayRut = array();
					$arrayRut["id_documento"] = $result;
					$arrayRut["ciiu_principal"] = $_POST["ciiu_principal"];
					if ($_POST["actividad_aduanera"]) {
						$arrayRut["actividad_aduanera"] = $_POST["actividad_aduanera"];
					}
					$result = $Data->setRegistro("cmx_clientes_rut", $arrayRut);
				}
			}
		} else {
			// echo "No son iguales";

			ini_set('log_errors', 1);
			ini_set('error_log.txt', __DIR__ . '/php_error.log');
			// $return["post"] = $_POST;
			// $return["files"] = $_FILES;
			//Crear
			session_start();
			$fecha = date('Y-m-d');
			$hora = date('H:i:s');
			$user = $_SESSION["usuario"]["nom_usuario"];
			$user_empresa_id = $_SESSION['usuario']['empresa_id'];
			/*$sql1="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,fecha,hora,usuario,tipo_tercero,accion)VALUES(null,'".$_POST["documento"]."','Tercero',0,1,'".$fecha."','".$hora."','".$user."','Cliente','Actualizar')";
					$Data->ejecuteRegistro($sql1);*/

			// Se actualiza la información del cliente
			$arrayCliente = array();
			$arrayCliente["tipo_documento"] = $_POST["tipo_documento"];
			$arrayCliente["regimen"] = $_POST["regimen"];
			$arrayCliente["nombre"] = $Clientes->limpiaTexto($_POST["nombre"] . " " . $_POST["tipo_sociedad"]);
			$arrayCliente["tipo_sociedad"] = $_POST["tipo_sociedad"];
			$arrayCliente["sigla"] = $Clientes->limpiaTexto($_POST["sigla"]);
			$arrayCliente["actividad_cliente"] = $Clientes->limpiaTexto($_POST["actividad_cliente"]);
			$arrayCliente["ciudad"] = $_POST["ciudad"];
			$arrayCliente["codigo_postal"] = $Clientes->limpiaTexto($_POST["codigo_postal"]);
			$arrayCliente["direccion"] = $Clientes->limpiaTexto($_POST["direccion"]);
			$arrayCliente["telefono"] = $Clientes->limpiaTexto($_POST["telefono"]);
			$arrayCliente["email"] = $Clientes->limpiaTexto($_POST["email"]);
			$arrayCliente["indicaciones_llegada"] = $Clientes->limpiaTexto($_POST["indicaciones_llegada"]);

			$arrayCliente["nom_sede"] = $Clientes->limpiaTexto($_POST["namesede"]);
			$arrayCliente["encargado"] = $Clientes->limpiaTexto($_POST["personsede"]);
			$arrayCliente["dia_informacion"] = $Clientes->limpiaTexto($_POST["infosede"]);
			$arrayCliente["condicion_pago"] = $Clientes->limpiaTexto($_POST["condicionsede"]);
			$arrayCliente["condicion_facturacion"] = $Clientes->limpiaTexto($_POST["factusede"]);
			$arrayCliente["obligacion_tributaria"] = $Clientes->limpiaTexto($_POST["oblisede"]);
			$arrayCliente["restriccion_acceso"] = $Clientes->limpiaTexto($_POST["restrisede"]);
			$arrayCliente["instruccion_especial"] = $Clientes->limpiaTexto($_POST["instrusede"]);
			$arrayCliente["empresa"] = $Clientes->limpiaTexto($_POST["empresa_cliente"]);

			if (!$_POST["cod_cliente"]) {
				$arrayCliente["cod_cliente"] = 'CLI-' . $time;
			}
			$result = $Data->updateRegistro("cmx_clientes", $arrayCliente, (int) $_POST["id_cliente"]);

			// Se inactivan los servicios actuales del cliente
			$sql = '
					UPDATE cmx_clientes_serv_contratados
					SET estado = 0
					WHERE id_cliente = ' . $_POST["id_cliente"] . '
				';
			$Data->ejecuteRegistro($sql);

			// Se inactivan los responsables actuales de los servicios
			$sql = '
					UPDATE cmx_clientes_serv_responsables
					SET estado = 0
					WHERE id_serv_contratado IN (
							SELECT id
							FROM cmx_clientes_serv_contratados
							WHERE id_cliente = ' . $_POST["id_cliente"] . '
						)
				';
			$Data->ejecuteRegistro($sql);

			// insertar el movimiento del cambio
			$sql_historico = "INSERT INTO cmx_movimientos_sistema (tipo_movimiento, modulo, objeto, objeto_anterior, referencia, descripcion, usuario, fecha, hora, empresa_id)
			VALUES ('Actualizar', 'Clientes', '" . $_POST["empresa_cliente"] . "', '" . $empresa . "', '" . $_POST["id_cliente"] . "', 'Actualizar Empresa', '" . $user . "', '" . $fecha . "', '" . $hora . "', '" . $user_empresa_id . "')";
			$Data->ejecuteRegistro($sql_historico);

			// Se crea los responsables del cliente
			foreach ($Clientes->getEnumTipoServicio() as $key => $value) {
				$_servicio = strtolower(str_replace(" ", "_", $value));
				if (isset($_POST["slct_" . $_servicio . "_comercial_1"]) and isset($_POST["slct_" . $_servicio . "_servicio_1"])) {
					// Se consulta si el servicio existe
					$_flag_servicio = $Clientes->getServicioCliente($_POST["id_cliente"], $value);
					if ($_flag_servicio) {
						$_array_servicio = $_flag_servicio["rowsData"][0];
						// Se actualiza el registro del documento
						$arrayServicio = array();
						$arrayServicio["estado"] = 1;
						$Data->updateRegistro("cmx_clientes_serv_contratados", $arrayServicio, (int) $_array_servicio["id"]);

						// Se guarda los responsables de comerciales del servicio propuesto al cliente
						$i = 1;
						$_flag_comercial = true;
						do {
							if (isset($_POST["slct_" . $_servicio . "_comercial_" . $i])) {
								// Se pregunta si el responsable ya existe
								$_flag_responsable = $Clientes->getResponsable($_array_servicio["id"], 'Ejecutivo Comercial', $_POST["slct_" . $_servicio . "_comercial_" . $i]);
								if ($_flag_responsable) {
									// Si existe se actualiza
									$_array_responsable = $_flag_responsable["rowsData"][0];
									$arrayResponsableComercial = array(
										'estado' => 1,
									);
									$Data->updateRegistro("cmx_clientes_serv_responsables", $arrayResponsableComercial, (int) $_array_responsable["id"]);
								} else {
									// Si no existe se crea
									$arrayResponsableComercial = array(
										'id_serv_contratado' => $_array_servicio[0],
										'id_usuario' => $_POST["slct_" . $_servicio . "_comercial_" . $i],
										'tipo_ejecutivo' => 'Ejecutivo Comercial',
									);
									$Data->setRegistro("cmx_clientes_serv_responsables", $arrayResponsableComercial);
								}
							} else {
								$_flag_comercial = false;
							}
							$i++;
						} while ($_flag_comercial);

						// Se guarda los responsables de servicio al cliente del servicio propuesto al cliente
						$i = 1;
						$_flag_servicio = true;
						do {
							if (isset($_POST["slct_" . $_servicio . "_servicio_" . $i])) {
								// Se pregunta si el responsable ya existe
								$_flag_responsable = $Clientes->getResponsable($_array_servicio["id"], 'Ejecutivo Servicio al Cliente', $_POST["slct_" . $_servicio . "_servicio_" . $i]);
								if ($_flag_responsable) {
									// Si existe se actualiza
									$_array_responsable = $_flag_responsable["rowsData"][0];
									$arrayResponsableServicio = array(
										'estado' => 1,
									);
									$Data->updateRegistro("cmx_clientes_serv_responsables", $arrayResponsableServicio, $_array_responsable["id"]);
								} else {
									// Si no existe se crea
									$arrayResponsableServicio = array(
										'id_serv_contratado' => $_array_servicio["id"],
										'id_usuario' => $_POST["slct_" . $_servicio . "_servicio_" . $i],
										'tipo_ejecutivo' => 'Ejecutivo Servicio al Cliente',
									);
									$Data->setRegistro("cmx_clientes_serv_responsables", $arrayResponsableServicio);
								}
							} else {
								$_flag_servicio = false;
							}
							$i++;
						} while ($_flag_servicio);
					} else {
						// Se guarda el servicio propuesto al cliente
						$arrayServicio = array(
							'id_cliente' => $_POST["id_cliente"],
							'servicio' => $value,
						);
						$result_01 = $Data->setRegistro("cmx_clientes_serv_contratados", $arrayServicio);

						// Se guarda los responsables de comerciales del servicio propuesto al cliente
						$i = 1;
						$_flag_comercial = true;
						do {
							if (isset($_POST["slct_" . $_servicio . "_comercial_" . $i])) {
								$arrayResponsableComercial = array(
									'id_serv_contratado' => $result_01,
									'id_usuario' => $_POST["slct_" . $_servicio . "_comercial_" . $i],
									'tipo_ejecutivo' => 'Ejecutivo Comercial',
								);
								$result_02 = $Data->setRegistro("cmx_clientes_serv_responsables", $arrayResponsableComercial);
							} else {
								$_flag_comercial = false;
							}
							$i++;
						} while ($_flag_comercial);

						// Se guarda los responsables de servicio al cliente del servicio propuesto al cliente
						$i = 1;
						$_flag_servicio = true;
						do {
							if (isset($_POST["slct_" . $_servicio . "_servicio_" . $i])) {
								$arrayResponsableServicio = array(
									'id_serv_contratado' => $result_01,
									'id_usuario' => $_POST["slct_" . $_servicio . "_servicio_" . $i],
									'tipo_ejecutivo' => 'Ejecutivo Servicio al Cliente',
								);
								$result_02 = $Data->setRegistro("cmx_clientes_serv_responsables", $arrayResponsableServicio);
							} else {
								$_flag_servicio = false;
							}
							$i++;
						} while ($_flag_servicio);
					}
				}
			}

			// Se pregunta si es neceario subir la información del RUT
			if (isset($_FILES) and $_FILES) {
				// Se sube el documento adjunto al servidor
				$arrayFile = array(
					'id_cliente' => $_POST["id_cliente"],
					'documento' => $_POST["documento"],
					'tipo_documento' => 20,
					'fecha_expedicion' => $_POST["fecha_expedicion"],
				);
				$result_1 = $Clientes->setDocumentoCliente($_FILES, "url_rut", $arrayFile);
				// $return["sube_documento"] = $result_1;
				// Se inactiva el los registros anteriores de la cámara de comercio
				$sql = '
						UPDATE cmx_clientes_documentos
						SET estado = "0"
						WHERE
							id_cliente = ' . $_POST["id_cliente"] . '
							AND id_tipo_documento = 20
					';
				$Data->getConsulta($sql);

				if ($result_1["result"]) {
					// Se adiciona el documento del cliente en la base de datos
					$arrayDocumento = array(
						'id_cliente' => $_POST["id_cliente"],
						'id_tipo_documento' => 20,
						'numero_documento' => $_POST["numero_documento"],
						'fecha_expedicion' => $_POST["fecha_expedicion"],
						'url_documento' => $_POST["fecha_expedicion"] . "-" . $_POST["id_cliente"] . "." . $Clientes->get_extension_archivo($_FILES["url_rut"]["name"]),
					);
					$result = $Data->setRegistro("cmx_clientes_documentos", $arrayDocumento);
					// $return["arrayDocumento_result"] = $result;
					// $return["arrayDocumento"] = $arrayDocumento;

					// Se guarda la información del RUT
					$arrayRut = array();
					$arrayRut["id_documento"] = $result;
					$arrayRut["ciiu_principal"] = $_POST["ciiu_principal"];
					if ($_POST["actividad_aduanera"]) {
						$arrayRut["actividad_aduanera"] = $_POST["actividad_aduanera"];
					}
					$result = $Data->setRegistro("cmx_clientes_rut", $arrayRut);
				}
			}
		}

		break;

	case 'formEditaCliente':
		$_msg_control .= "Entro en la accion formEditaCliente.\n";

		// Se busca la información del Cliente
		$result = $Clientes->getClienteInfoCompleta($_POST["id"]);
		$return["result"] = $result;

		if ($result["general"]) {
			foreach ($result["general"]["rowsData"] as $key => $value) {
				// Se valida cuales usuarios pueden cambiar los adjuntos subidos
				$_flag_cambia_archivo = false;
				if (
					$_POST["id_perfil"] == 1 or $_POST["id_perfil"] == 13
					or $_POST["id_perfil"] == 22 or $_POST["id_perfil"] == 32
				) {
					$_flag_cambia_archivo = true;
				}

				// Se filtra el contenido de la barra de progreso de los documentros del cliente
				$_progress_bar_color = "progress-bar-success";
				$_porcentaje = 100;
				if ($value["OBLIGATORIOS"] > $value["REGISTRADOS"]) {
					$_progress_bar_color = "progress-bar-danger";
					$_porcentaje = (int) (($value["REGISTRADOS"] * 100) / $value["OBLIGATORIOS"]);
				}
				$_barra_documentos = '
						<span class="progress-value">' . $_porcentaje . '%</span>
						<div class="progress">
							<div style="width: ' . $_porcentaje . '%;" class="progress-bar ' . $_progress_bar_color . '"></div>
						</div>
					';

				$_msg_content .= '
						<strong  id="modulo_cliente">Información General</strong>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="form-group col-sm-4">
											<span>Cliente</span>
											<span class="cell-detail-description">' . $value["nombre"] . '</span>
											<span class="cell-detail-description">' . $value["documento"] . '-' . $value["digito_verificacion"] . '</span>
										</div>
										<div class="form-group col-sm-4">
											<span>' . $value["tipo_documento"] . '</span>
											<span class="cell-detail-description">' . $value["regimen"] . '</span>
										</div>
										<div class="form-group col-sm-4">
											<span>Ubicación</span>
											<span class="cell-detail-description">' . $value["direccion"] . '</span>
											<span class="cell-detail-description">' . $value["municipio"] . ' (' . $value["depto"] . ' - ' . $value["pais"] . ')</span>
											<span class="cell-detail-description">' . $value["indicaciones_llegada"] . '</span>
										</div>
										<div class="col-sm-4"></div>
										<div class="col-sm-4">
											' . $_barra_documentos . '
										</div>
										<div class="col-sm-4"></div>
									</td>
								</tr>
								<tr><td></td></tr>
							</tbody>
						</table>
					';

				/****** Pestaña Servicio al Cliente ******/
				// Se pregunta si el cliente ya tiene registrada la Cámara de Comercio
				$cam_comercio_documento = "";
				$cam_comercio_expedicion = "";
				$cam_comercio_renovacion = "";
				$cam_comercio_cap_pagado = "";
				$cam_comercio_cap_suscrito = "";
				$cam_comercio_cap_autorizado = "";
				$cam_comercio_file = '
						<div class="form-group col-sm-3">
							<label class="control-label">(*) Adjunto:</label><br />
							<input type="file" name="cam_comercio_file" id="cam_comercio_file" class="inputfile">
							<label for="cam_comercio_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
						</div>
					';

				if (isset($result["camara_comercio"]) and $result["camara_comercio"]) {
					foreach ($result["camara_comercio"]["rowsData"] as $key_camara_comercio => $value_camara_comercio) {
						$cam_comercio_documento = $value_camara_comercio["numero_documento"];
						$cam_comercio_expedicion = $value_camara_comercio["fecha_constitucion"];
						$cam_comercio_renovacion = $value_camara_comercio["fecha_expedicion"];
						$cam_comercio_cap_pagado = number_format($value_camara_comercio["capital_pagado"], 0, ",", ".");
						$cam_comercio_cap_suscrito = number_format($value_camara_comercio["capital_suscrito"], 0, ",", ".");
						$cam_comercio_cap_autorizado = number_format($value_camara_comercio["capital_autorizado"], 0, ",", ".");

						$_cambia_archivo = '';
						if ($_flag_cambia_archivo or !$cam_comercio_renovacion) {
							$_cambia_archivo = '
									<div class="form-group col-sm-1 div_cam_comercio_file">
										<br />
										<table class="table">
											<tbody>
												<tr>
													<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
														<center>
															<span class="icon mdi mdi-edit" id="link_cam_comercio_file"></span>
														</center>
													</td>
												</tr>
												<tr><td></td></tr>
											</tbody>
										</table>
									</div>
								';
						}

						if ($value_camara_comercio["fecha_expedicion"]) {
							$cam_comercio_file = '
									<div class="form-group col-sm-3" id="div_cam_comercio_file" style="display: none;">
										<label class="control-label">(*) Adjunto:</label><br />
										<input type="file" name="cam_comercio_file" id="cam_comercio_file" class="inputfile">
										<label for="cam_comercio_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
									</div>
									<div class="form-group col-sm-2 div_cam_comercio_file">
										<div class="icon-container">
											<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $value_camara_comercio["folder"] . '/' . $value_camara_comercio["url_documento"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
												<span class="mdi mdi-download"></span>
											</a>
										</div>
									</div>
									' . $_cambia_archivo . '
								';
						}
					}
				}

				// Se pregunta si el cliente ya tiene registrado el representante legal
				$cam_comercio_doc_representante = "";
				$cam_comercio_nom_representante = "";
				$cam_comercio_file_representante = '
						<div class="form-group col-sm-3">
							<label class="control-label">(*) Documento Adjunto:</label><br />
							<input type="file" name="cam_comercio_file_representante" id="cam_comercio_file_representante" class="inputfile">
							<label for="cam_comercio_file_representante" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
						</div>
					';

				if (isset($result["representante_legal"]) and $result["representante_legal"]) {
					foreach ($result["representante_legal"]["rowsData"] as $key_representante_legal => $value_representante_legal) {
						$cam_comercio_doc_representante = $value_representante_legal["documento"];
						$cam_comercio_nom_representante = $value_representante_legal["nombre_miembro"];

						$_cambia_archivo = '';
						if ($_flag_cambia_archivo or !$cam_comercio_renovacion) {
							$_cambia_archivo = '
									<div class="col-sm-1 div_cam_comercio_file_representante">
										<br />
										<table class="table">
											<tbody>
												<tr>
													<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
														<center>
															<span class="icon mdi mdi-edit" id="link_cam_comercio_file_representante"></span>
														</center>
													</td>
												</tr>
												<tr><td></td></tr>
											</tbody>
										</table>
									</div>
								';
						}

						$cam_comercio_file_representante = '
								<div class="form-group col-sm-3" id="div_cam_comercio_file_representante" style="display: none;">
									<label class="control-label">(*) Documento Adjunto:</label><br />
									<input type="file" name="cam_comercio_file_representante" id="cam_comercio_file_representante" class="inputfile">
									<label for="cam_comercio_file_representante" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
								</div>
								<div class="form-group col-sm-2 div_cam_comercio_file_representante">
									<div class="icon-container">
										<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $value_representante_legal["tipo_miembro"] . '/' . $value_representante_legal["documento"] . '/' . $value_representante_legal["folder"] . '/' . $value_representante_legal["url"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
											<span class="mdi mdi-download"></span>
										</a>
									</div>
								</div>
								' . $_cambia_archivo . '
							';
					}
				}

				// Se pregunta si el cliente ya tiene registrado el revisor fiscal
				$cam_comercio_doc_revisor = "";
				$cam_comercio_nom_revisor = "";
				$cam_comercio_file_revisor = '
						<div class="form-group col-sm-3">
							<label class="control-label">Documento Adjunto:</label><br />
							<input type="file" name="cam_comercio_file_revisor" id="cam_comercio_file_revisor" class="inputfile">
							<label for="cam_comercio_file_revisor" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
						</div>
					';

				if (isset($result["revisor_fiscal"]) and $result["revisor_fiscal"]) {
					foreach ($result["revisor_fiscal"]["rowsData"] as $key_revisor_fiscal => $value_revisor_fiscal) {
						$cam_comercio_doc_revisor = $value_revisor_fiscal["documento"];
						$cam_comercio_nom_revisor = $value_revisor_fiscal["nombre_miembro"];

						if ($value_revisor_fiscal["url"]) {
							$_cambia_archivo = '';
							if ($_flag_cambia_archivo or !$cam_comercio_renovacion) {
								$_cambia_archivo = '
										<div class="col-sm-1 div_cam_comercio_file_revisor">
											<br />
											<table class="table">
												<tbody>
													<tr>
														<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
															<center>
																<span class="icon mdi mdi-edit" id="link_cam_comercio_file_revisor"></span>
															</center>
														</td>
													</tr>
													<tr><td></td></tr>
												</tbody>
											</table>
										</div>
									';
							}
							$cam_comercio_file_revisor = '
									<div class="form-group col-sm-3" id="div_cam_comercio_file_revisor" style="display: none;">
										<label class="control-label">(*) Documento Adjunto:</label><br />
										<input type="file" name="cam_comercio_file_revisor" id="cam_comercio_file_revisor" class="inputfile">
										<label for="cam_comercio_file_revisor" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
									</div>
									<div class="form-group col-sm-2 div_cam_comercio_file_revisor">
										<div class="icon-container">
											<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $value_revisor_fiscal["tipo_miembro"] . '/' . $value_revisor_fiscal["documento"] . '/' . $value_revisor_fiscal["folder"] . '/' . $value_revisor_fiscal["url"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
												<span class="mdi mdi-download"></span>
											</a>
										</div>
									</div>
									' . $_cambia_archivo . '
								';
						}
					}
				}

				// Se pregunta si ya se registro los socios del cliente
				$cam_socios = '
						<div class="col-sm-12 socio_clon" id="form_socios_1">
							<div class="form-group col-sm-4" id="div_cam_comercio_doc_socio_1">
								<label class="control-label">(*) Documento:</label>
								<input type="text" name="cam_comercio_doc_socio_1" id="cam_comercio_doc_socio_1" class="form-control input-sm">
							</div>
							<div class="form-group col-sm-8" id="div_cam_comercio_nom_socio_1">
								<label class="control-label">(*) Nombre:</label>
								<input type="text" name="cam_comercio_nom_socio_1" id="cam_comercio_nom_socio_1" class="form-control input-sm">
							</div>
						</div>
					';
				if (isset($result["socios"]) and $result["socios"]) {
					$cam_socios = '';
					$i = 1;
					foreach ($result["socios"]["rowsData"] as $key_socios => $value_socios) {
						$cam_socios .= '
								<div class="col-sm-12 socio_clon" id="form_socios_' . $i . '">
									<div class="form-group col-sm-4" id="div_cam_comercio_doc_socio_' . $i . '">
										<label class="control-label">(*) Documento:</label>
										<input type="text" name="cam_comercio_doc_socio_' . $i . '" id="cam_comercio_doc_socio_' . $i . '" class="form-control input-sm" value="' . $value_socios["documento"] . '">
									</div>
									<div class="form-group col-sm-8" id="div_cam_comercio_nom_socio_' . $i . '">
										<label class="control-label">(*) Nombre:</label>
										<input type="text" name="cam_comercio_nom_socio_' . $i . '" id="cam_comercio_nom_socio_' . $i . '" class="form-control input-sm" value="' . $value_socios["nombre_miembro"] . '">
									</div>
								</div>
							';
						$i++;
					}
				}

				// Se pregunta si ya se registró las referencias comerciales del cliente
				$cam_ref_comercial = '
						<div class="col-sm-12 ref_comercial_clon" id="form_ref_comercial_1">
							<div class="form-group col-sm-6 hint--top" data-hint="Nombre de la persona o entidad que entrega la referencia comercial" id="div_ref_comercial_nombre_1">
								<label class="control-label">(*) Nombre:</label>
								<input type="text" name="ref_comercial_nombre_1" id="ref_comercial_nombre_1" class="form-control input-sm">
							</div>
							<div class="form-group col-sm-3" id="div_ref_comercial_expedicion_1">
								<label class="control-label">(*) Fecha Expedición:</label>
								<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
									<input size="10" type="text" value="" name="ref_comercial_expedicion_1" id="ref_comercial_expedicion_1" readonly="" class="form-control input-sm">
									<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
								</div>
							</div>
							<div class="form-group col-sm-3" id="div_ref_comercial_file_1">
								<label class="control-label">(*) Documento:</label><br />
								<input type="file" name="ref_comercial_file_1" id="ref_comercial_file_1" class="inputfile">
								<label for="ref_comercial_file_1" id="label_ref_comercial_file_1" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
							</div>
							<div class="form-group col-sm-3" id="div_ref_comercial_link_1" style="display:none;"></div>
						</div>
					';

				if (isset($result["referencias_comerciales"]) and $result["referencias_comerciales"]) {
					$cam_ref_comercial = '';
					$i = 1;
					foreach ($result["referencias_comerciales"]["rowsData"] as $key_ref_comercial => $value_ref_comercial) {
						$_cambia_archivo = '';
						if ($_flag_cambia_archivo) {
							$_cambia_archivo = '
									<div class="form-group col-sm-1 div_ref_comercial_file_' . $i . '" id="div_ref_comercial_edita_' . $i . '">
										<br />
										<table class="table">
											<tbody>
												<tr>
													<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
														<center>
															<span class="icon mdi mdi-edit link_ref_comercial" id="link_ref_comercial_file_' . $i . '"></span>
														</center>
													</td>
												</tr>
												<tr><td></td></tr>
											</tbody>
										</table>
									</div>
								';
						}
						$cam_ref_comercial .= '
								<input type="hidden" id="ref_comercial_id_' . $i . '" value="' . $value_ref_comercial["id"] . '">
								<div class="col-sm-12 ref_comercial_clon" id="form_ref_comercial_' . $i . '">
									<div class="form-group col-sm-6 hint--top" data-hint="Nombre de la persona o entidad que entrega la referencia comercial" id="div_ref_comercial_nombre_' . $i . '">
										<label class="control-label">(*) Nombre:</label>
										<input type="text" name="ref_comercial_nombre_' . $i . '" id="ref_comercial_nombre_' . $i . '" class="form-control input-sm" value="' . $value_ref_comercial["numero_documento"] . '">
									</div>
									<div class="form-group col-sm-3" id="div_ref_comercial_expedicion_' . $i . '">
										<label class="control-label">(*) Fecha Expedición:</label>
										<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
											<input size="10" type="text" value="' . $value_ref_comercial["fecha_expedicion"] . '" name="ref_comercial_expedicion_' . $i . '" id="ref_comercial_expedicion_' . $i . '" readonly="" class="form-control input-sm">
											<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
										</div>
									</div>
									<div class="form-group col-sm-3" id="div_ref_comercial_file_' . $i . '" style="display:none;">
										<label class="control-label">(*) Documento:</label><br />
										<input type="file" name="ref_comercial_file_' . $i . '" id="ref_comercial_file_' . $i . '" class="inputfile">
										<label for="ref_comercial_file_' . $i . '" id="label_ref_comercial_file_' . $i . '" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
									</div>
									<div class="form-group col-sm-2 div_ref_comercial_file_' . $i . '" id="div_ref_comercial_link_' . $i . '">
										<div class="icon-container">
											<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $value_ref_comercial["folder"] . '/' . $value_ref_comercial["url_documento"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
												<span class="mdi mdi-download"></span>
											</a>
										</div>
									</div>
									' . $_cambia_archivo . '
								</div>
							';
						$i++;
					}
				}

				// Se pregunta si ya se registró las referencias comerciales del cliente
				$cam_ref_bancaria = '
						<div class="col-sm-12 ref_bancaria_clon" id="form_ref_bancaria_1">
							<div class="form-group col-sm-4" id="div_ref_bancaria_banco_1">
								<label class="control-label">Entidad Financiera:</label>
								<input type="text" name="ref_bancaria_banco_1" id="ref_bancaria_banco_1" class="form-control input-sm">
							</div>
							<div class="form-group col-sm-2" id="div_slct_ref_bancaria_tipo_cuenta_1_">
								<label class="control-label">Tipo Cuenta:</label>
								' . $Clientes->getEnumSlctTipoCuenta_sm("ref_bancaria_tipo_cuenta_1", "", "") . '
							</div>
							<div class="form-group col-sm-3" id="div_ref_bancaria_num_cuenta_1">
								<label class="control-label"># Cuenta:</label>
								<input type="number" min="0" name="ref_bancaria_num_cuenta_1" id="ref_bancaria_num_cuenta_1" class="form-control input-sm">
							</div>
							<div class="form-group col-sm-3" id="div_ref_bancaria_file_1">
								<label class="control-label">Certificación Bancaria:</label><br />
								<input type="file" name="ref_bancaria_file_1" id="ref_bancaria_file_1" class="inputfile">
								<label for="ref_bancaria_file_1" id="label_ref_bancaria_file_1" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
							</div>
							<div class="form-group col-sm-3" id="div_ref_bancaria_link_1" style="display:none;"></div>
						</div>
					';

				if (isset($result["bancos"]) and $result["bancos"]) {
					$cam_ref_bancaria = '';
					$i = 1;
					foreach ($result["bancos"]["rowsData"] as $key_bancos => $value_bancos) {
						$_cambia_archivo = '';
						if ($_flag_cambia_archivo) {
							$_cambia_archivo = '
									<div class="form-group col-sm-1 div_ref_bancaria_file_' . $i . '">
										<br />
										<table class="table">
											<tbody>
												<tr>
													<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
														<center>
															<span class="icon mdi mdi-edit link_ref_bancaria" id="link_ref_bancaria_file_' . $i . '"></span>
														</center>
													</td>
												</tr>
												<tr><td></td></tr>
											</tbody>
										</table>
									</div>
								';
						}
						$cam_ref_bancaria .= '
								<input type="hidden" id="ref_bancaria_id_' . $i . '" value="' . $value_bancos["id"] . '">
								<div class="col-sm-12 ref_bancaria_clon" id="form_ref_bancaria_' . $i . '">
									<div class="form-group col-sm-4" id="div_ref_bancaria_banco_' . $i . '">
										<label class="control-label">Entidad Financiera:</label>
										<input type="text" name="ref_bancaria_banco_' . $i . '" id="ref_bancaria_banco_' . $i . '" class="form-control input-sm" value="' . $value_bancos["banco"] . '">
									</div>
									<div class="form-group col-sm-2" id="div_slct_ref_bancaria_tipo_cuenta_' . $i . '_">
										<label class="control-label">Tipo Cuenta:</label>
										' . $Clientes->getEnumSlctTipoCuenta_sm("ref_bancaria_tipo_cuenta_" . $i, "", $value_bancos["tipo_cuenta"]) . '
									</div>
									<div class="form-group col-sm-3" id="div_ref_bancaria_num_cuenta_' . $i . '">
										<label class="control-label"># Cuenta:</label>
										<input type="number" min="0" name="ref_bancaria_num_cuenta_' . $i . '" id="ref_bancaria_num_cuenta_' . $i . '" class="form-control input-sm" value="' . $value_bancos["numero_cuenta"] . '">
									</div>
									<div class="form-group col-sm-3" id="div_ref_bancaria_file_' . $i . '"  style="display:none;">
										<label class="control-label">Certificación Bancaria:</label><br />
										<input type="file" name="ref_bancaria_file_' . $i . '" id="ref_bancaria_file_' . $i . '" class="inputfile">
										<label for="ref_bancaria_file_' . $i . '" id="label_ref_bancaria_file_' . $i . '" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
									</div>
									<div class="form-group col-sm-2 div_ref_bancaria_file_' . $i . '" id="div_ref_bancaria_link_' . $i . '">
										<div class="icon-container">
											<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/bancos/' . $value_bancos["url_certificado"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
												<span class="mdi mdi-download"></span>
											</a>
										</div>
									</div>
									' . $_cambia_archivo . '
								</div>
							';
						$i++;
					}
				}

				// Se pregunta si ya se registró el estado financiero del cliente
				$est_financ_periodo = "";
				$est_financ_file = '
						<div class="form-group col-sm-3">
							<label class="control-label">(*) Documento:</label><br />
							<input type="file" name="est_financ_file" id="est_financ_file" class="inputfile">
							<label for="est_financ_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
						</div>
					';

				if (isset($result["estado_financiero"]) and $result["estado_financiero"]) {
					$est_financ_periodo = $result["estado_financiero"]["numero_documento"];

					$_cambia_archivo = '';
					if ($_flag_cambia_archivo or ((int) $Clientes->getTimestampToDate($time, 'Y') - 1) > (int) $est_financ_periodo) {
						$_cambia_archivo = '
								<div class="form-group col-sm-1 div_est_financ_file">
									<br />
									<table class="table">
										<tbody>
											<tr>
												<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
													<center>
														<span class="icon mdi mdi-edit" id="link_est_financ_file"></span>
													</center>
												</td>
											</tr>
											<tr><td></td></tr>
										</tbody>
									</table>
								</div>
							';
					}

					$est_financ_file = '
							<div class="form-group col-sm-3" id="div_est_financ_file" style="display:none;">
								<label class="control-label">(*) Documento:</label><br />
								<input type="file" name="est_financ_file" id="est_financ_file" class="inputfile">
								<label for="est_financ_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
							</div>
							<div class="form-group col-sm-2 div_est_financ_file">
								<div class="icon-container">
									<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $result["estado_financiero"]["folder"] . '/' . $result["estado_financiero"]["url_documento"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
										<span class="mdi mdi-download"></span>
									</a>
								</div>
							</div>
							' . $_cambia_archivo . '
						';
				}

				// Se pregunta si el cliente usa su propio seguro
				$serv_cliente_poliza = '
						<div class="be-checkbox">
							<input name="poliza_check" id="poliza_check" class="check_solicitudes" type="checkbox">
							<label for="poliza_check">Tiene póliza:</label>
						</div>
						<div id="poliza_content"></div>
					';

				if (isset($result["seguro"]) and $result["seguro"]) {
					$_cambia_archivo = '';
					if ($_flag_cambia_archivo) {
						$_cambia_archivo = '
								<div class="form-group col-sm-1 div_poliza_file">
									<br />
									<table class="table">
										<tbody>
											<tr>
												<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
													<center>
														<span class="icon mdi mdi-edit" id="link_poliza_file"></span>
													</center>
												</td>
											</tr>
											<tr><td></td></tr>
										</tbody>
									</table>
								</div>
							';
					}

					$serv_cliente_poliza = '
							<input type="hidden" name="poliza_id" id="poliza_id" value="' . $result["seguro"]["ID_SEGURO"] . '">
							<div class="be-checkbox">
								<input name="poliza_check" id="poliza_check" class="check_solicitudes" type="checkbox" checked disabled>
								<label for="poliza_check">Tiene póliza:</label>
							</div>
							<div id="poliza_content">
								<div class="form-group col-sm-12"></div>
								<div class="form-group col-sm-4">
									<label class="control-label">(*) # Poliza:</label>
									<input type="text" name="poliza_documento" id="poliza_documento" class="form-control input-sm" value="' . $result["seguro"]["numero_documento"] . '">
								</div>
								<div class="form-group col-sm-4">
									<label class="control-label">(*) Fecha Expedición:</label>
									<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
										<input size="10" type="text" value="' . $result["seguro"]["fecha_expedicion"] . '" name="poliza_expedicion" id="poliza_expedicion" readonly="" class="form-control input-sm">
										<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
									</div>
								</div>
								<div class="form-group col-sm-4" id="div_poliza_file" style="display: none;">
									<label class="control-label">(*) Documento:</label><br />
									<input type="file" name="poliza_file" id="poliza_file" class="inputfile">
									<label for="poliza_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span></label>
								</div>
								<div class="form-group col-sm-3 div_poliza_file">
									<div class="icon-container">
										<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $result["seguro"]["folder"] . '/' . $result["seguro"]["url_documento"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
											<span class="mdi mdi-download"></span>
										</a>
									</div>
								</div>
								' . $_cambia_archivo . '
								<div class="form-group col-sm-4">
									<label class="control-label">(*) Aseguradora:</label>
									<input type="text" name="poliza_aseguradora" id="poliza_aseguradora" class="form-control input-sm" value="' . $result["seguro"]["aseguradora"] . '">
								</div>
								<div class="form-group col-sm-4">
									<label class="control-label">(*) Solicitante:</label>
									<input type="text" name="poliza_solicitante" id="poliza_solicitante" class="form-control input-sm" value="' . $result["seguro"]["solicitante"] . '">
								</div>
								<div class="form-group col-sm-4">
									<label class="control-label">(*) Monto Asegurado:</label>
									<input type="text" onkeyup="getSeparadorMiles(this)" onchange="getSeparadorMiles(this)" name="poliza_monto" id="poliza_monto" class="form-control input-sm" value="' . number_format($result["seguro"]["monto"], 0, ",", ".") . '">
								</div>
								<div class="form-group col-sm-2"></div>
								<div class="form-group col-sm-4">
									<label class="control-label">(*) Horario de Tránsito:</label>
									<input type="text" name="poliza_transito" id="poliza_transito" class="form-control input-sm" value="' . $result["seguro"]["horario_transito"] . '">
								</div>
								<div class="form-group col-sm-4">
									<label class="control-label">(*) Modelo mínimo de Vehículo:</label>
									<div data-min-view="4" data-start-view="4" data-date-format="yyyy" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
										<input size="10" type="text" value="' . $result["seguro"]["modelo_minimo_vehiculo"] . '" name="poliza_modelo" id="poliza_modelo" readonly="" class="form-control input-sm">
										<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
									</div>
								</div>
								<div class="form-group col-sm-2"></div>
								<div class="form-group col-sm-12">
									<label class="control-label">(*) Interés Asegurable:</label>
									<textarea name="poliza_asegurable" id="poliza_asegurable" class="form-control input-sm" data-parsley-id="73" required="" >' . $result["seguro"]["interes_asegurable"] . '</textarea>
								</div>
							</div>
						';
				}

				// Se pregunta si ya se registró el certificado BASC del cliente
				$certificacion_basc_numero = "";
				$certificacion_basc_expedicion = "";
				$certificacion_basc_file = '
						<div class="form-group col-sm-3">
							<label class="control-label">(*) Documento:</label><br />
							<input type="file" name="certificacion_basc_file" id="certificacion_basc_file" class="inputfile">
							<label for="certificacion_basc_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
						</div>
					';

				if (isset($result["basc"]) and $result["basc"]) {
					$certificacion_basc_numero = $result["basc"]["numero_documento"];
					$certificacion_basc_expedicion = $result["basc"]["fecha_expedicion"];

					$_cambia_archivo = '';
					if ($_flag_cambia_archivo) {
						$_cambia_archivo = '
								<div class="form-group col-sm-1 div_certificacion_basc_file">
									<br />
									<table class="table">
										<tbody>
											<tr>
												<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
													<center>
														<span class="icon mdi mdi-edit" id="link_certificacion_basc_file"></span>
													</center>
												</td>
											</tr>
											<tr><td></td></tr>
										</tbody>
									</table>
								</div>
							';
					}

					$certificacion_basc_file = '
							<div class="form-group col-sm-3" id="div_certificacion_basc_file" style="display: none;">
								<label class="control-label">(*) Documento:</label><br />
								<input type="file" name="certificacion_basc_file" id="certificacion_basc_file" class="inputfile">
								<label for="certificacion_basc_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
							</div>
							<div class="form-group col-sm-2 div_certificacion_basc_file">
								<div class="icon-container">
									<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $result["basc"]["folder"] . '/' . $result["basc"]["url_documento"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
										<span class="mdi mdi-download"></span>
									</a>
								</div>
							</div>
							' . $_cambia_archivo . '
						';
				}

				// Se pregunta si ya se registró el certificado CT-PAT del cliente
				$certificacion_CT_PAT_numero = "";
				$certificacion_CT_PAT_expedicion = "";
				$certificacion_CT_PAT_file = '
						<div class="form-group col-sm-3">
							<label class="control-label">(*) Documento:</label><br />
							<input type="file" name="certificacion_CT_PAT_file" id="certificacion_CT_PAT_file" class="inputfile">
							<label for="certificacion_CT_PAT_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
						</div>
					';

				if (isset($result["ct_pat"]) and $result["ct_pat"]) {
					$certificacion_CT_PAT_numero = $result["ct_pat"]["numero_documento"];
					$certificacion_CT_PAT_expedicion = $result["ct_pat"]["fecha_expedicion"];

					$_cambia_archivo = '';
					if ($_flag_cambia_archivo) {
						$_cambia_archivo = '
								<div class="form-group col-sm-1 div_certificacion_CT_PAT_file">
									<br />
									<table class="table">
										<tbody>
											<tr>
												<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
													<center>
														<span class="icon mdi mdi-edit" id="link_certificacion_CT_PAT_file"></span>
													</center>
												</td>
											</tr>
											<tr><td></td></tr>
										</tbody>
									</table>
								</div>
							';
					}

					$certificacion_CT_PAT_file = '
							<div class="form-group col-sm-3" id="div_certificacion_CT_PAT_file" style="display: none;">
								<label class="control-label">(*) Documento:</label><br />
								<input type="file" name="certificacion_CT_PAT_file" id="certificacion_CT_PAT_file" class="inputfile">
								<label for="certificacion_CT_PAT_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
							</div>
							<div class="form-group col-sm-2 div_certificacion_CT_PAT_file">
								<div class="icon-container">
									<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $result["ct_pat"]["folder"] . '/' . $result["ct_pat"]["url_documento"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
										<span class="mdi mdi-download"></span>
									</a>
								</div>
							</div>
							' . $_cambia_archivo . '
						';
				}

				// Se pregunta si ya se registró el certificado OEA del cliente
				$certificacion_OEA_numero = "";
				$certificacion_OEA_expedicion = "";
				$certificacion_OEA_file = '
						<div class="form-group col-sm-3">
							<label class="control-label">(*) Documento:</label><br />
							<input type="file" name="certificacion_OEA_file" id="certificacion_OEA_file" class="inputfile">
							<label for="certificacion_OEA_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
						</div>
					';

				if (isset($result["oea"]) and $result["oea"]) {
					$certificacion_OEA_numero = $result["oea"]["numero_documento"];
					$certificacion_OEA_expedicion = $result["oea"]["fecha_expedicion"];

					$_cambia_archivo = '';
					if ($_flag_cambia_archivo) {
						$_cambia_archivo = '
								<div class="form-group col-sm-1 div_certificacion_OEA_file">
									<br />
									<table class="table">
										<tbody>
											<tr>
												<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
													<center>
														<span class="icon mdi mdi-edit" id="link_certificacion_OEA_file"></span>
													</center>
												</td>
											</tr>
											<tr><td></td></tr>
										</tbody>
									</table>
								</div>
							';
					}

					$certificacion_OEA_file = '
							<div class="form-group col-sm-3" id="div_certificacion_OEA_file" style="display: none;">
								<label class="control-label">(*) Documento:</label><br />
								<input type="file" name="certificacion_OEA_file" id="certificacion_OEA_file" class="inputfile">
								<label for="certificacion_OEA_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
							</div>
							<div class="form-group col-sm-2 div_certificacion_OEA_file">
								<div class="icon-container">
									<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $result["oea"]["folder"] . '/' . $result["oea"]["url_documento"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
										<span class="mdi mdi-download"></span>
									</a>
								</div>
							</div>
							' . $_cambia_archivo . '
						';
				}

				// Se pregunta si ya se registró el certificado ISO28000 del cliente
				$certificacion_ISO28000_numero = "";
				$certificacion_ISO28000_expedicion = "";
				$certificacion_ISO28000_file = '
						<div class="form-group col-sm-3">
							<label class="control-label">(*) Documento:</label><br />
							<input type="file" name="certificacion_ISO28000_file" id="certificacion_ISO28000_file" class="inputfile">
							<label for="certificacion_ISO28000_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
						</div>
					';

				if (isset($result["ISO28000"]) and $result["ISO28000"]) {
					$certificacion_ISO28000_numero = $result["ISO28000"]["numero_documento"];
					$certificacion_ISO28000_expedicion = $result["ISO28000"]["fecha_expedicion"];

					$_cambia_archivo = '';
					if ($_flag_cambia_archivo) {
						$_cambia_archivo = '
								<div class="form-group col-sm-1 div_certificacion_ISO28000_file">
									<br />
									<table class="table">
										<tbody>
											<tr>
												<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
													<center>
														<span class="icon mdi mdi-edit" id="link_certificacion_ISO28000_file"></span>
													</center>
												</td>
											</tr>
											<tr><td></td></tr>
										</tbody>
									</table>
								</div>
							';
					}

					$certificacion_ISO28000_file = '
							<div class="form-group col-sm-3" id="div_certificacion_ISO28000_file" style="display: none;">
								<label class="control-label">(*) Documento:</label><br />
								<input type="file" name="certificacion_ISO28000_file" id="certificacion_ISO28000_file" class="inputfile">
								<label for="certificacion_ISO28000_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
							</div>
							<div class="form-group col-sm-2 div_certificacion_ISO28000_file">
								<div class="icon-container">
									<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $result["ISO28000"]["folder"] . '/' . $result["ISO28000"]["url_documento"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
										<span class="mdi mdi-download"></span>
									</a>
								</div>
							</div>
							' . $_cambia_archivo . '
						';
				}

				// Se pregunta si ya se registró el certificado ISO9001 del cliente
				$certificacion_ISO9001_numero = "";
				$certificacion_ISO9001_expedicion = "";
				$certificacion_ISO9001_file = '
						<div class="form-group col-sm-3">
							<label class="control-label">(*) Documento:</label><br />
							<input type="file" name="certificacion_ISO9001_file" id="certificacion_ISO9001_file" class="inputfile">
							<label for="certificacion_ISO9001_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
						</div>
					';

				if (isset($result["ISO9001"]) and $result["ISO9001"]) {
					$certificacion_ISO9001_numero = $result["ISO9001"]["numero_documento"];
					$certificacion_ISO9001_expedicion = $result["ISO9001"]["fecha_expedicion"];

					$_cambia_archivo = '';
					if ($_flag_cambia_archivo) {
						$_cambia_archivo = '
								<div class="form-group col-sm-1 div_certificacion_ISO9001_file">
									<br />
									<table class="table">
										<tbody>
											<tr>
												<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
													<center>
														<span class="icon mdi mdi-edit" id="link_certificacion_ISO9001_file"></span>
													</center>
												</td>
											</tr>
											<tr><td></td></tr>
										</tbody>
									</table>
								</div>
							';
					}

					$certificacion_ISO9001_file = '
							<div class="form-group col-sm-3" id="div_certificacion_ISO9001_file" style="display: none;">
								<label class="control-label">(*) Documento:</label><br />
								<input type="file" name="certificacion_ISO9001_file" id="certificacion_ISO9001_file" class="inputfile">
								<label for="certificacion_ISO9001_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
							</div>
							<div class="form-group col-sm-2 div_certificacion_ISO9001_file">
								<div class="icon-container">
									<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $result["ISO9001"]["folder"] . '/' . $result["ISO9001"]["url_documento"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
										<span class="mdi mdi-download"></span>
									</a>
								</div>
							</div>
							' . $_cambia_archivo . '
						';
				}

				// Se pregunta si ya se registraron los formatos BASC de los servicios ofrecidos al cliente
				$_formatos = '';
				if (isset($result["servicios"]) and $result["servicios"]) {
					foreach ($result["servicios"]["rowsData"] as $key_tipo_servicio => $value_tipo_servicio) {
						switch ($value_tipo_servicio["servicio"]) {
							case 'Agenciamiento Aduanero':
								$_formatos .= $Clientes->getFormFormatoBASC($value["documento"], $result, $value_tipo_servicio["servicio"], "23,24,25", $_flag_cambia_archivo);
								break;

							case 'Transporte de Carga Nacional':
								$_formatos .= $Clientes->getFormFormatoBASC($value["documento"], $result, $value_tipo_servicio["servicio"], "12,13,14", $_flag_cambia_archivo);
								break;

							case 'Transporte de Carga Internacional':
								$_formatos .= $Clientes->getFormFormatoBASC($value["documento"], $result, $value_tipo_servicio["servicio"], "26,27,28", $_flag_cambia_archivo);
								break;

							case 'Almacenamiento':
								$_formatos .= $Clientes->getFormFormatoBASC($value["documento"], $result, $value_tipo_servicio["servicio"], "29,30,31", $_flag_cambia_archivo);
								break;
						}
					}
				}

				// Se pinta el contenido de las pestañas del contenido
				$serv_cliente = '
						<div id="serv_cliente" class="tab-pane cont">
							<div id="accordion1" class="panel-group accordion">
								<div class="panel panel-default">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#accordion1" href="#serv_cliente_cam_comercio"><i class="icon mdi mdi-chevron-down"></i> Cámara de Comercio</a>
										</h4>
									</div>
									<div id="serv_cliente_cam_comercio" class="panel-collapse collapse">
										<div class="panel-body">
											<div class="form-group col-sm-12"></div>
											<div class="form-group col-sm-4">
												<label class="control-label">(*) # Matricula:</label>
												<input type="text" name="cam_comercio_documento" id="cam_comercio_documento" class="form-control input-sm" value="' . $cam_comercio_documento . '">
											</div>
											<div class="form-group col-sm-4">
												<label class="control-label">(*) Fecha Constitución:</label>
												<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
													<input size="10" type="text" value="' . $cam_comercio_expedicion . '" name="cam_comercio_expedicion" id="cam_comercio_expedicion" readonly="" class="form-control input-sm">
													<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
												</div>
											</div>
											<div class="form-group col-sm-4">
												<label class="control-label">(*) Fecha Renovación:</label>
												<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
													<input size="10" type="text" value="' . $cam_comercio_renovacion . '" name="cam_comercio_renovacion" id="cam_comercio_renovacion" readonly="" class="form-control input-sm">
													<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
												</div>
											</div>
											<div class="form-group col-sm-3">
												<label class="control-label">(*) Capital pagado:</label>
												<input type="text" onload="getSeparadorMiles(this)" onkeyup="getSeparadorMiles(this)" onchange="getSeparadorMiles(this)" name="cam_comercio_cap_pagado" id="cam_comercio_cap_pagado" class="form-control input-sm" value="' . $cam_comercio_cap_pagado . '">
											</div>
											<div class="form-group col-sm-3">
												<label class="control-label">(*) Capital suscrito:</label>
												<input type="text" onkeyup="getSeparadorMiles(this)" onchange="getSeparadorMiles(this)" name="cam_comercio_cap_suscrito" id="cam_comercio_cap_suscrito" class="form-control input-sm" value= "' . $cam_comercio_cap_suscrito . '">
											</div>
											<div class="form-group col-sm-3">
												<label class="control-label">(*) Capital autorizado:</label>
												<input type="text" onkeyup="getSeparadorMiles(this)" onchange="getSeparadorMiles(this)" name="cam_comercio_cap_autorizado" id="cam_comercio_cap_autorizado" class="form-control input-sm" value="' . $cam_comercio_cap_autorizado . '">
											</div>
											' . $cam_comercio_file . '
											<div class="col-sm-12">
												<p><strong>Representante Legal o Suplente</p></strong>
											</div>
											<div class="form-group col-sm-3">
												<label class="control-label">(*) Documento:</label>
												<input type="text" name="cam_comercio_doc_representante" id="cam_comercio_doc_representante" class="form-control input-sm" value="' . $cam_comercio_doc_representante . '">
											</div>
											<div class="form-group col-sm-6">
												<label class="control-label">(*) Nombre:</label>
												<input type="text" name="cam_comercio_nom_representante" id="cam_comercio_nom_representante" class="form-control input-sm" value="' . $cam_comercio_nom_representante . '">
											</div>
											' . $cam_comercio_file_representante . '
											<div class="col-sm-12">
												<p><strong>Revisor Fiscal</p></strong>
											</div>
											<div class="form-group col-sm-3">
												<label class="control-label">(*) Documento:</label>
												<input type="text" name="cam_comercio_doc_revisor" id="cam_comercio_doc_revisor" class="form-control input-sm" value="' . $cam_comercio_doc_revisor . '">
											</div>
											<div class="form-group col-sm-6">
												<label class="control-label">(*) Nombre:</label>
												<input type="text" name="cam_comercio_nom_revisor" id="cam_comercio_nom_revisor" class="form-control input-sm" value="' . $cam_comercio_nom_revisor . '">
											</div>
											' . $cam_comercio_file_revisor . '
											<div class="col-sm-3">
												<p><strong>Socios</p></strong>
											</div>
											<div class="icon col-sm-9 div_socios">
												<button type="button" class="btn btn-space btn-success btn-big hint--top-left" data-hint="Agregar Socio" id="btn_agrega_socio"><span class="mdi mdi-plus"></span></button>
												<button type="button" class="btn btn-space btn-danger btn-big hint--top-left" data-hint="Quitar Socio" id="btn_quita_socio"><span class="mdi mdi-minus"></span></button>
											</div>
											' . $cam_socios . '
										</div>
									</div>
								</div>
								<div class="panel panel-default">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#accordion1" href="#serv_cliente_est_financieros" class="collapsed"><i class="icon mdi mdi-chevron-down"></i> Estados Financieros</a>
										</h4>
									</div>
									<div id="serv_cliente_est_financieros" class="panel-collapse collapse">
										<div class="panel-body">
											<div class="form-group col-sm-3"></div>
											<div class="form-group col-sm-3">
												<label class="control-label">(*) Año Fiscal:</label>
												<div data-min-view="4" data-start-view="4" data-date-format="yyyy" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
													<input size="10" type="text" value="' . $est_financ_periodo . '" name="est_financ_periodo" id="est_financ_periodo" readonly="" class="form-control input-sm">
													<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
												</div>
											</div>
											' . $est_financ_file . '
											<div class="form-group col-sm-3"></div>
										</div>
									</div>
								</div>
								<div class="panel panel-default">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#accordion1" href="#serv_cliente_poliza" class="collapsed"><i class="icon mdi mdi-chevron-down"></i> Póliza</a>
										</h4>
									</div>
									<div id="serv_cliente_poliza" class="panel-collapse collapse">
										<div class="panel-body">
											' . $serv_cliente_poliza . '
										</div>
									</div>
								</div>
								<div class="panel panel-default">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#accordion1" href="#serv_cliente_ref_comerciales" class="collapsed"><i class="icon mdi mdi-chevron-down"></i> Referencias Comerciales</a>
										</h4>
									</div>
									<div id="serv_cliente_ref_comerciales" class="panel-collapse collapse">
										<div class="panel-body">
											<div class="form-group icon col-sm-12 div_ref_comercial">
												<button type="button" class="btn btn-space btn-success btn-big hint--top" data-hint="Agregar Referencia Comercial" id="btn_agrega_ref_comercial"><span class="mdi mdi-plus"></span></button>
												<button type="button" class="btn btn-space btn-danger btn-big hint--top" data-hint="Quitar Referencia Comercial" id="btn_quita_ref_comercial"><span class="mdi mdi-minus"></span></button>
											</div>
											' . $cam_ref_comercial . '
										</div>
									</div>
								</div>
								<div class="panel panel-default">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#accordion1" href="#serv_cliente_certificaciones" class="collapsed"><i class="icon mdi mdi-chevron-down"></i> Certificaciones</a>
										</h4>
									</div>
									<div id="serv_cliente_certificaciones" class="panel-collapse collapse">
										<div class="panel-body">
											<div class="form-group col-sm-12"></div>
											<div class="form-group col-sm-2">
												<p><strong>BASC</strong></p>
											</div>
											<div class="form-group col-sm-4">
												<label class="control-label">(*) Código Documento:</label>
												<input type="text" name="certificacion_basc_numero" id="certificacion_basc_numero" class="form-control input-sm" value="' . $certificacion_basc_numero . '">
											</div>
											<div class="form-group col-sm-3">
												<label class="control-label">(*) Fecha Expedición:</label>
												<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
													<input size="10" type="text" value="' . $certificacion_basc_expedicion . '" name="certificacion_basc_expedicion" id="certificacion_basc_expedicion" readonly="" class="form-control input-sm">
													<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
												</div>
											</div>
											' . $certificacion_basc_file . '
											<div class="col-sm-12"></div>

											<div class="form-group col-sm-2">
												<p><strong>CT-PAT</strong></p>
											</div>
											<div class="form-group col-sm-4">
												<label class="control-label">(*) Código Documento:</label>
												<input type="text" name="certificacion_CT_PAT_numero" id="certificacion_CT_PAT_numero" class="form-control input-sm" value="' . $certificacion_CT_PAT_numero . '">
											</div>
											<div class="form-group col-sm-3">
												<label class="control-label">(*) Fecha Expedición:</label>
												<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
													<input size="10" type="text" value="' . $certificacion_CT_PAT_expedicion . '" name="certificacion_CT_PAT_expedicion" id="certificacion_CT_PAT_expedicion" readonly="" class="form-control input-sm">
													<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
												</div>
											</div>
											' . $certificacion_CT_PAT_file . '
											<div class="col-sm-12"></div>

											<div class="form-group col-sm-2">
												<p><strong>OEA - Operador Económico Autorizado</strong></p>
											</div>
											<div class="form-group col-sm-4">
												<label class="control-label">(*) Código Documento:</label>
												<input type="text" name="certificacion_OEA_numero" id="certificacion_OEA_numero" class="form-control input-sm" value="' . $certificacion_OEA_numero . '">
											</div>
											<div class="form-group col-sm-3">
												<label class="control-label">(*) Fecha Expedición:</label>
												<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
													<input size="10" type="text" value="' . $certificacion_OEA_expedicion . '" name="certificacion_OEA_expedicion" id="certificacion_OEA_expedicion" readonly="" class="form-control input-sm">
													<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
												</div>
											</div>
											' . $certificacion_OEA_file . '
											<div class="col-sm-12"></div>

											<div class="form-group col-sm-2">
												<p><strong>ISO28000</strong></p>
											</div>
											<div class="form-group col-sm-4">
												<label class="control-label">(*) Código Documento:</label>
												<input type="text" name="certificacion_ISO28000_numero" id="certificacion_ISO28000_numero" class="form-control input-sm" value="' . $certificacion_ISO28000_numero . '">
											</div>
											<div class="form-group col-sm-3">
												<label class="control-label">(*) Fecha Expedición:</label>
												<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
													<input size="10" type="text" value="' . $certificacion_ISO28000_expedicion . '" name="certificacion_ISO28000_expedicion" id="certificacion_ISO28000_expedicion" readonly="" class="form-control input-sm">
													<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
												</div>
											</div>
											' . $certificacion_ISO28000_file . '
											<div class="col-sm-12"></div>

											<div class="form-group col-sm-2">
												<p><strong>ISO9001</strong></p>
											</div>
											<div class="form-group col-sm-4">
												<label class="control-label">(*) Código Documento:</label>
												<input type="text" name="certificacion_ISO9001_numero" id="certificacion_ISO9001_numero" class="form-control input-sm" value="' . $certificacion_ISO9001_numero . '">
											</div>
											<div class="form-group col-sm-3">
												<label class="control-label">(*) Fecha Expedición:</label>
												<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
													<input size="10" type="text" value="' . $certificacion_ISO9001_expedicion . '" name="certificacion_ISO9001_expedicion" id="certificacion_ISO9001_expedicion" readonly="" class="form-control input-sm">
													<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
												</div>
											</div>
											' . $certificacion_ISO9001_file . '
										</div>
									</div>
								</div>
								<div class="panel panel-default">
									<div class="panel-heading">
										<h4 class="panel-title">
											<a data-toggle="collapse" data-parent="#accordion1" href="#serv_cliente_ref_bancaria" class="collapsed"><i class="icon mdi mdi-chevron-down"></i> Referencias Bancarias</a>
										</h4>
									</div>
									<div id="serv_cliente_ref_bancaria" class="panel-collapse collapse">
										<div class="panel-body">
											<div class="form-group icon col-sm-12 div_ref_bancaria">
												<button type="button" class="btn btn-space btn-success btn-big hint--top" data-hint="Agregar Referencia Bancaria" id="btn_agrega_ref_bancaria"><span class="mdi mdi-plus"></span></button>
												<button type="button" class="btn btn-space btn-danger btn-big hint--top" data-hint="Quitar Referencia Bancaria" id="btn_quita_ref_bancaria"><span class="mdi mdi-minus"></span></button>
											</div>
											' . $cam_ref_bancaria . '
										</div>
									</div>
								</div>
								' . $_formatos . '
							</div>
						</div>
					';
				/****** Fin - Pestaña Servicio al Cliente ******/

				/****** Pestaña Calidad ******/
				// Se pregunta si ya se registró el OFAC del cliente
				$cliente_OFAC_expedicion = "";
				$cliente_OFAC_file = '
						<div class="form-group col-sm-3">
							<label class="control-label">(*) Documento:</label><br />
							<input type="file" name="cliente_OFAC_file" id="cliente_OFAC_file" class="inputfile">
							<label for="cliente_OFAC_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
						</div>
					';
				$cliente_OFAC_novedad = '
						<label class="control-label">Novedad:</label>
						<textarea class="form-control input-sm" placeholder="Si la consulta genera alguna novedad, ingrésela aquí." id="cliente_OFAC_novedad"></textarea>
					';
				if (isset($result["OFAC"]) and $result["OFAC"]) {
					$cliente_OFAC_expedicion = $result["OFAC"]["fecha_expedicion"];

					$_cambia_archivo = '';
					if ($_flag_cambia_archivo) {
						$_cambia_archivo = '
								<div class="form-group col-sm-1 div_cliente_OFAC_file">
									<br />
									<table class="table">
										<tbody>
											<tr>
												<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
													<center>
														<span class="icon mdi mdi-edit" id="link_cliente_OFAC_file"></span>
													</center>
												</td>
											</tr>
											<tr><td></td></tr>
										</tbody>
									</table>
								</div>
							';
					}

					$cliente_OFAC_file = '
							<div class="form-group col-sm-3" id="div_cliente_OFAC_file" style="display: none;">
								<label class="control-label">(*) Documento:</label><br />
								<input type="file" name="cliente_OFAC_file" id="cliente_OFAC_file" class="inputfile">
								<label for="cliente_OFAC_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
							</div>
							<div class="form-group col-sm-2 div_cliente_OFAC_file">
								<div class="icon-container">
									<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $result["OFAC"]["folder"] . '/' . $result["OFAC"]["url_documento"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
										<span class="mdi mdi-download"></span>
									</a>
								</div>
							</div>
							' . $_cambia_archivo . '
						';
					$_novedad = "Sin novedad";
					if ($result["OFAC"]["novedad"]) {
						$_novedad = $result["OFAC"]["novedad"];
					}
					$cliente_OFAC_novedad = '
							<label class="control-label">Novedad:</label>
							<textarea class="form-control input-sm" placeholder="Si la consulta genera alguna novedad, ingrésela aquí." id="cliente_OFAC_novedad" disabled>' . $_novedad . '</textarea>
						';
				}

				// Se pregunta si ya se registró el CIFIN del cliente
				$cliente_CIFIN_expedicion = "";
				$cliente_CIFIN_file = '
						<div class="form-group col-sm-3">
							<label class="control-label">(*) Documento:</label><br />
							<input type="file" name="cliente_CIFIN_file" id="cliente_CIFIN_file" class="inputfile">
							<label for="cliente_CIFIN_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
						</div>
					';

				if (isset($result["CIFIN"]) and $result["CIFIN"]) {
					$cliente_CIFIN_expedicion = $result["CIFIN"]["fecha_expedicion"];

					$_cambia_archivo = '';
					if ($_flag_cambia_archivo) {
						$_cambia_archivo = '
								<div class="form-group col-sm-1 div_cliente_CIFIN_file">
									<br />
									<table class="table">
										<tbody>
											<tr>
												<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
													<center>
														<span class="icon mdi mdi-edit" id="link_cliente_CIFIN_file"></span>
													</center>
												</td>
											</tr>
											<tr><td></td></tr>
										</tbody>
									</table>
								</div>
							';
					}

					$cliente_CIFIN_file = '
							<div class="form-group col-sm-3" id="div_cliente_CIFIN_file" style="display: none;">
								<label class="control-label">(*) Documento:</label><br />
								<input type="file" name="cliente_CIFIN_file" id="cliente_CIFIN_file" class="inputfile">
								<label for="cliente_CIFIN_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
							</div>
							<div class="form-group col-sm-2 div_cliente_CIFIN_file">
								<div class="icon-container">
									<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $result["CIFIN"]["folder"] . '/' . $result["CIFIN"]["url_documento"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
										<span class="mdi mdi-download"></span>
									</a>
								</div>
							</div>
							' . $_cambia_archivo . '
						';
				}

				// Se pregunta si ya se registró el CIFIN del cliente
				$cliente_RUES_expedicion = "";
				$cliente_RUES_file = '
						<div class="form-group col-sm-3">
							<label class="control-label">(*) Documento:</label><br />
							<input type="file" name="cliente_RUES_file" id="cliente_RUES_file" class="inputfile">
							<label for="cliente_RUES_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
						</div>
					';

				if (isset($result["RUES"]) and $result["RUES"]) {
					$cliente_RUES_expedicion = $result["RUES"]["fecha_expedicion"];

					$_cambia_archivo = '';
					if ($_flag_cambia_archivo) {
						$_cambia_archivo = '
								<div class="form-group col-sm-1 div_cliente_RUES_file">
									<br />
									<table class="table">
										<tbody>
											<tr>
												<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
													<center>
														<span class="icon mdi mdi-edit" id="link_cliente_RUES_file"></span>
													</center>
												</td>
											</tr>
											<tr><td></td></tr>
										</tbody>
									</table>
								</div>
							';
					}

					$cliente_RUES_file = '
							<div class="form-group col-sm-3" id="div_cliente_RUES_file" style="display: none;">
								<label class="control-label">(*) Documento:</label><br />
								<input type="file" name="cliente_RUES_file" id="cliente_RUES_file" class="inputfile">
								<label for="cliente_RUES_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
							</div>
							<div class="form-group col-sm-2 div_cliente_RUES_file">
								<div class="icon-container">
									<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $result["RUES"]["folder"] . '/' . $result["RUES"]["url_documento"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
										<span class="mdi mdi-download"></span>
									</a>
								</div>
							</div>
							' . $_cambia_archivo . '
						';
				}

				// Se pregunta si ya se registró los antecedentes policiales del representante legal del cliente
				$representante_legal = '
						<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
							<div class="icon">
								<span class="mdi mdi-close"></span>
							</div>
							<div class="message">
								<strong>Error!</strong>
								<p>No hay un representante legal registrado...</p>
							</div>
						</div>
					';
				if (isset($result["representante_legal"]) and $result["representante_legal"]) {
					$representante_antecedentes_expedicion = "";
					$representante_antecedentes_file = '
							<div class="form-group col-sm-3">
								<label class="control-label">(*) Documento:</label><br />
								<input type="file" name="representante_antecedentes_file" id="representante_antecedentes_file" class="inputfile">
								<label for="representante_antecedentes_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
							</div>
						';
					$representante_antecedentes_novedad = '
							<label class="control-label">Novedad:</label>
							<textarea class="form-control input-sm" placeholder="Si la consulta genera alguna novedad, ingrésela aquí." id="representante_antecedentes_novedad"></textarea>
						';

					if (isset($result["repres_antecedentes"]) and $result["repres_antecedentes"]) {
						$representante_antecedentes_expedicion = $result["repres_antecedentes"]["fecha_expedicion"];

						$_cambia_archivo = '';
						if ($_flag_cambia_archivo) {
							$_cambia_archivo = '
									<div class="form-group col-sm-1 div_representante_antecedentes_file">
										<br />
										<table class="table">
											<tbody>
												<tr>
													<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
														<center>
															<span class="icon mdi mdi-edit" id="link_representante_antecedentes_file"></span>
														</center>
													</td>
												</tr>
												<tr><td></td></tr>
											</tbody>
										</table>
									</div>
								';
						}

						$representante_antecedentes_file = '
								<div class="form-group col-sm-3" id="div_representante_antecedentes_file" style="display: none;">
									<label class="control-label">(*) Documento:</label><br />
									<input type="file" name="representante_antecedentes_file" id="representante_antecedentes_file" class="inputfile">
									<label for="representante_antecedentes_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
								</div>
								<div class="form-group col-sm-2 div_representante_antecedentes_file">
									<div class="icon-container">
										<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $result["repres_antecedentes"]["tipo_miembro"] . '/' . $result["repres_antecedentes"]["documento"] . '/' . $result["repres_antecedentes"]["folder"] . '/' . $result["repres_antecedentes"]["url"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
											<span class="mdi mdi-download"></span>
										</a>
									</div>
								</div>
								' . $_cambia_archivo . '
							';
						$_novedad = "Sin novedad";
						if ($result["repres_antecedentes"]["novedad"]) {
							$_novedad = $result["repres_antecedentes"]["novedad"];
						}
						$representante_antecedentes_novedad = '
								<label class="control-label">Novedad:</label>
								<textarea class="form-control input-sm" placeholder="Si la consulta genera alguna novedad, ingrésela aquí." id="representante_antecedentes_novedad" disabled>' . $_novedad . '</textarea>
							';
					}

					// Se pregunta si ya se registró el OFAC del representante legal del cliente
					$representante_OFAC_expedicion = "";
					$representante_OFAC_file = '
							<div class="form-group col-sm-3">
								<label class="control-label">(*) Documento:</label><br />
								<input type="file" name="representante_OFAC_file" id="representante_OFAC_file" class="inputfile">
								<label for="representante_OFAC_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
							</div>
						';
					$representante_OFAC_novedad = '
							<label class="control-label">Novedad:</label>
							<textarea class="form-control input-sm" placeholder="Si la consulta genera alguna novedad, ingrésela aquí." id="representante_OFAC_novedad"></textarea>
						';

					if (isset($result["repres_OFAC"]) and $result["repres_OFAC"]) {
						$representante_OFAC_expedicion = $result["repres_OFAC"]["fecha_expedicion"];

						$_cambia_archivo = '';
						if ($_flag_cambia_archivo) {
							$_cambia_archivo = '
									<div class="form-group col-sm-1 div_representante_OFAC_file">
										<br />
										<table class="table">
											<tbody>
												<tr>
													<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
														<center>
															<span class="icon mdi mdi-edit" id="link_representante_OFAC_file"></span>
														</center>
													</td>
												</tr>
												<tr><td></td></tr>
											</tbody>
										</table>
									</div>
								';
						}

						$representante_OFAC_file = '
								<div class="form-group col-sm-3" id="div_representante_OFAC_file" style="display: none;">
									<label class="control-label">(*) Documento:</label><br />
									<input type="file" name="representante_OFAC_file" id="representante_OFAC_file" class="inputfile">
									<label for="representante_OFAC_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
								</div>
								<div class="form-group col-sm-2 div_representante_OFAC_file">
									<div class="icon-container">
										<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $result["repres_OFAC"]["tipo_miembro"] . '/' . $result["repres_OFAC"]["documento"] . '/' . $result["repres_OFAC"]["folder"] . '/' . $result["repres_OFAC"]["url"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
											<span class="mdi mdi-download"></span>
										</a>
									</div>
								</div>
								' . $_cambia_archivo . '
							';
						$_novedad = "Sin novedad";
						if ($result["repres_OFAC"]["novedad"]) {
							$_novedad = $result["repres_OFAC"]["novedad"];
						}
						$representante_OFAC_novedad = '
								<label class="control-label">Novedad:</label>
								<textarea class="form-control input-sm" placeholder="Si la consulta genera alguna novedad, ingrésela aquí." id="representante_OFAC_novedad" disabled>' . $_novedad . '</textarea>
							';
					}

					$representante_legal = '';
					foreach ($result["representante_legal"]["rowsData"] as $key_representante_legal => $value_representante_legal) {
						$representante_legal = '
								<input type="hidden" value="' . $value_representante_legal["id"] . '" name="representante_id" id="representante_id">
								<div class="panel panel-border panel-contrast">
									<div class="panel-heading panel-heading-contrast">
										' . $value_representante_legal["nombre_miembro"] . '
										<div class="tools"></div>
										<span class="panel-subtitle">' . $value_representante_legal["documento"] . '</span>
									</div>
									<div class="panel-body xs-mt-15">
										<div class="form-group col-sm-3">
											<p><strong>Antecedentes Policía</strong></p>
										</div>
										<div class="form-group col-sm-3">
											<label class="control-label">(*) Fecha Expedición:</label>
											<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
												<input size="10" type="text" value="' . $representante_antecedentes_expedicion . '" name="representante_antecedentes_expedicion" id="representante_antecedentes_expedicion" readonly="" class="form-control input-sm">
												<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
											</div>
										</div>
										' . $representante_antecedentes_file . '
										<div class="form-group col-sm-3">
											' . $representante_antecedentes_novedad . '
										</div>
										<div class="col-sm-12"></div>

										<div class="form-group col-sm-3">
											<p><strong>OFAC (Lista Clinton)</strong></p>
										</div>
										<div class="form-group col-sm-3">
											<label class="control-label">(*) Fecha Expedición:</label>
											<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
												<input size="10" type="text" value="' . $representante_OFAC_expedicion . '" name="representante_OFAC_expedicion" id="representante_OFAC_expedicion" readonly="" class="form-control input-sm">
												<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
											</div>
										</div>
										' . $representante_OFAC_file . '
										<div class="form-group col-sm-3">
											' . $representante_OFAC_novedad . '
										</div>
										<div class="form-group col-sm-12"></div>
									</div>
								</div>
							';
					}
				}

				// Se pregunta si ya se registró los antecedentes policiales del revisor fiscal del cliente
				$revisor_fiscal = '
						<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
							<div class="icon">
								<span class="mdi mdi-close"></span>
							</div>
							<div class="message">
								<strong>Error!</strong>
								<p>No hay un revisor fiscal registrado...</p>
							</div>
						</div>
					';
				if (isset($result["revisor_fiscal"]) and $result["revisor_fiscal"]) {
					$revisor_antecedentes_expedicion = "";
					$revisor_antecedentes_file = '
							<div class="form-group col-sm-3">
								<label class="control-label">(*) Documento:</label><br />
								<input type="file" name="revisor_antecedentes_file" id="revisor_antecedentes_file" class="inputfile">
								<label for="revisor_antecedentes_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
							</div>
						';
					$revisor_antecedentes_novedad = '
							<label class="control-label">Novedad:</label>
							<textarea class="form-control input-sm" placeholder="Si la consulta genera alguna novedad, ingrésela aquí." id="revisor_antecedentes_novedad"></textarea>
						';

					if (isset($result["revisor_antecedentes"]) and $result["revisor_antecedentes"]) {
						$revisor_antecedentes_expedicion = $result["revisor_antecedentes"]["fecha_expedicion"];

						$_cambia_archivo = '';
						if ($_flag_cambia_archivo) {
							$_cambia_archivo = '
									<div class="form-group col-sm-1 div_revisor_antecedentes_file">
										<br />
										<table class="table">
											<tbody>
												<tr>
													<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
														<center>
															<span class="icon mdi mdi-edit" id="link_revisor_antecedentes_file"></span>
														</center>
													</td>
												</tr>
												<tr><td></td></tr>
											</tbody>
										</table>
									</div>
								';
						}

						$revisor_antecedentes_file = '
								<div class="form-group col-sm-3" id="div_revisor_antecedentes_file" style="display: none;">
									<label class="control-label">(*) Documento:</label><br />
									<input type="file" name="revisor_antecedentes_file" id="revisor_antecedentes_file" class="inputfile">
									<label for="revisor_antecedentes_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
								</div>
								<div class="form-group col-sm-2 div_revisor_antecedentes_file">
									<div class="icon-container">
										<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $result["revisor_antecedentes"]["tipo_miembro"] . '/' . $result["revisor_antecedentes"]["documento"] . '/' . $result["revisor_antecedentes"]["folder"] . '/' . $result["revisor_antecedentes"]["url"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
											<span class="mdi mdi-download"></span>
										</a>
									</div>
								</div>
								' . $_cambia_archivo . '
							';
						$_novedad = "Sin novedad";
						if ($result["revisor_antecedentes"]["novedad"]) {
							$_novedad = $result["revisor_antecedentes"]["novedad"];
						}
						$revisor_antecedentes_novedad = '
								<label class="control-label">Novedad:</label>
								<textarea class="form-control input-sm" placeholder="Si la consulta genera alguna novedad, ingrésela aquí." id="revisor_antecedentes_novedad" disabled>' . $_novedad . '</textarea>
							';
					}

					// Se pregunta si ya se registró el OFAC del revisor fiscal del cliente
					$revisor_OFAC_expedicion = "";
					$revisor_OFAC_file = '
							<div class="form-group col-sm-3">
								<label class="control-label">(*) Documento:</label><br />
								<input type="file" name="revisor_OFAC_file" id="revisor_OFAC_file" class="inputfile">
								<label for="revisor_OFAC_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
							</div>
						';
					$revisor_OFAC_novedad = '
							<label class="control-label">Novedad:</label>
							<textarea class="form-control input-sm" placeholder="Si la consulta genera alguna novedad, ingrésela aquí." id="revisor_OFAC_novedad"></textarea>
						';

					if (isset($result["revisor_OFAC"]) and $result["revisor_OFAC"]) {
						$revisor_OFAC_expedicion = $result["revisor_OFAC"]["fecha_expedicion"];

						$_cambia_archivo = '';
						if ($_flag_cambia_archivo) {
							$_cambia_archivo = '
									<div class="form-group col-sm-1 div_revisor_OFAC_file">
										<br />
										<table class="table">
											<tbody>
												<tr>
													<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
														<center>
															<span class="icon mdi mdi-edit" id="link_revisor_OFAC_file"></span>
														</center>
													</td>
												</tr>
												<tr><td></td></tr>
											</tbody>
										</table>
									</div>
								';
						}

						$revisor_OFAC_file = '
								<div class="form-group col-sm-3" id="div_revisor_OFAC_file" style="display: none;">
									<label class="control-label">(*) Documento:</label><br />
									<input type="file" name="revisor_OFAC_file" id="revisor_OFAC_file" class="inputfile">
									<label for="revisor_OFAC_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
								</div>
								<div class="form-group col-sm-2 div_revisor_OFAC_file">
									<div class="icon-container">
										<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $result["revisor_OFAC"]["tipo_miembro"] . '/' . $result["revisor_OFAC"]["documento"] . '/' . $result["revisor_OFAC"]["folder"] . '/' . $result["revisor_OFAC"]["url"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
											<span class="mdi mdi-download"></span>
										</a>
									</div>
								</div>
								' . $_cambia_archivo . '
							';
						$_novedad = "Sin novedad";
						if ($result["revisor_OFAC"]["novedad"]) {
							$_novedad = $result["revisor_OFAC"]["novedad"];
						}
						$revisor_OFAC_novedad = '
								<label class="control-label">Novedad:</label>
								<textarea class="form-control input-sm" placeholder="Si la consulta genera alguna novedad, ingrésela aquí." id="revisor_OFAC_novedad" disabled>' . $_novedad . '</textarea>
							';
					}

					$revisor_fiscal = '';
					foreach ($result["revisor_fiscal"]["rowsData"] as $key_revisor => $value_revisor) {
						$revisor_fiscal = '
								<input type="hidden" value="' . $value_revisor["id"] . '" name="revisor_id" id="revisor_id">
								<div class="panel panel-border panel-contrast">
									<div class="panel-heading panel-heading-contrast">
										' . $value_revisor["nombre_miembro"] . '
										<div class="tools"></div>
										<span class="panel-subtitle">' . $value_revisor["documento"] . '</span>
									</div>
									<div class="panel-body xs-mt-15">
										<div class="form-group col-sm-3">
											<p><strong>Antecedentes Policía</strong></p>
										</div>
										<div class="form-group col-sm-3">
											<label class="control-label">(*) Fecha Expedición:</label>
											<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
												<input size="10" type="text" value="' . $revisor_antecedentes_expedicion . '" name="revisor_antecedentes_expedicion" id="revisor_antecedentes_expedicion" readonly="" class="form-control input-sm">
												<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
											</div>
										</div>
										' . $revisor_antecedentes_file . '
										<div class="form-group col-sm-3">
											' . $revisor_antecedentes_novedad . '
										</div>
										<div class="col-sm-12"></div>

										<div class="form-group col-sm-3">
											<p><strong>OFAC (Lista Clinton)</strong></p>
										</div>
										<div class="form-group col-sm-3">
											<label class="control-label">(*) Fecha Expedición:</label>
											<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
												<input size="10" type="text" value="' . $revisor_OFAC_expedicion . '" name="revisor_OFAC_expedicion" id="revisor_OFAC_expedicion" readonly="" class="form-control input-sm">
												<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
											</div>
										</div>
										' . $revisor_OFAC_file . '
										<div class="form-group col-sm-3">
											' . $revisor_OFAC_novedad . '
										</div>
										<div class="form-group col-sm-12"></div>
									</div>
								</div>
							';
					}
				}

				// Se pregunta si ya se registró los antecedentes policiales de los socios cliente
				$socios = '
						<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
							<div class="icon">
								<span class="mdi mdi-close"></span>
							</div>
							<div class="message">
								<strong>Error!</strong>
								<p>No hay socios registrados...</p>
							</div>
						</div>
					';
				if (isset($result["socios"]) and $result["socios"]) {
					$socios = '';
					foreach ($result["socios"]["rowsData"] as $key_socios => $value_socios) {
						// Se filtra el contenido de los campos del formulario
						$_flag_antecedentes = 16;
						$_flag_OFAC = 15;
						$socio_antecedentes_expedicion = '';
						$socio_antecedentes_file = '
								<div class="form-group col-sm-3">
									<label class="control-label">(*) Documento:</label><br />
									<input type="file" name="socio_antecedentes_file_' . ($key_socios + 1) . '" id="socio_antecedentes_file_' . ($key_socios + 1) . '" class="inputfile">
									<label for="socio_antecedentes_file_' . ($key_socios + 1) . '" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
								</div>
							';
						$socio_antecedentes_novedad = '
								<label class="control-label">Novedad:</label>
								<textarea class="form-control input-sm" placeholder="Si la consulta genera alguna novedad, ingrésela aquí." id="socio_antecedentes_novedad_' . ($key_socios + 1) . '"></textarea>
							';
						if (isset($result["documentos_socios"][$value_socios["id"]][$_flag_antecedentes])) {
							$socio_antecedentes_expedicion = $result["documentos_socios"][$value_socios["id"]][$_flag_antecedentes]["fecha_expedicion"];

							$_cambia_archivo = '';
							if ($_flag_cambia_archivo) {
								$_cambia_archivo = '
										<div class="form-group col-sm-1 div_socio_antecedentes_file_' . ($key_socios + 1) . '">
											<br />
											<table class="table">
												<tbody>
													<tr>
														<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
															<center>
																<span class="icon mdi mdi-edit link_socio_antecedentes_file" id="link_socio_antecedentes_file_' . ($key_socios + 1) . '"></span>
															</center>
														</td>
													</tr>
													<tr><td></td></tr>
												</tbody>
											</table>
										</div>
									';
							}

							$socio_antecedentes_file = '
									<div class="form-group col-sm-3" id="div_socio_antecedentes_file_' . ($key_socios + 1) . '" style="display: none;">
										<label class="control-label">(*) Documento:</label><br />
										<input type="file" name="socio_antecedentes_file_' . ($key_socios + 1) . '" id="socio_antecedentes_file_' . ($key_socios + 1) . '" class="inputfile">
										<label for="socio_antecedentes_file_' . ($key_socios + 1) . '" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
									</div>
									<div class="form-group col-sm-2 div_socio_antecedentes_file_' . ($key_socios + 1) . '">
										<div class="icon-container">
											<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $result["documentos_socios"][$value_socios[0]][$_flag_antecedentes]["tipo_miembro"] . '/' . $result["documentos_socios"][$value_socios[0]][$_flag_antecedentes]["documento"] . '/' . $result["documentos_socios"][$value_socios[0]][$_flag_antecedentes]["folder"] . '/' . $result["documentos_socios"][$value_socios[0]][$_flag_antecedentes]["url"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
												<span class="mdi mdi-download"></span>
											</a>
										</div>
									</div>
									' . $_cambia_archivo . '
								';
							$_novedad = "Sin novedad";
							if ($result["documentos_socios"][$value_socios[0]][$_flag_antecedentes]["novedad"]) {
								$_novedad = $result["documentos_socios"][$value_socios[0]][$_flag_antecedentes]["novedad"];
							}
							$socio_antecedentes_novedad = '
									<label class="control-label">Novedad:</label>
									<textarea class="form-control input-sm" placeholder="Si la consulta genera alguna novedad, ingrésela aquí." id="socio_antecedentes_novedad_' . ($key_socios + 1) . '" disabled>' . $_novedad . '</textarea>
								';
						}

						$socio_OFAC_expedicion = '';
						$socio_OFAC_file = '
								<div class="form-group col-sm-3">
									<label class="control-label">(*) Documento:</label><br />
									<input type="file" name="socio_OFAC_file_' . ($key_socios + 1) . '" id="socio_OFAC_file_' . ($key_socios + 1) . '" class="inputfile">
									<label for="socio_OFAC_file_' . ($key_socios + 1) . '" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
								</div>
							';
						$socio_OFAC_novedad = '
								<label class="control-label">Novedad:</label>
								<textarea class="form-control input-sm" placeholder="Si la consulta genera alguna novedad, ingrésela aquí." id="socio_OFAC_novedad_' . ($key_socios + 1) . '"></textarea>
							';

						if (isset($result["documentos_socios"][$value_socios["id"]][$_flag_OFAC])) {
							$socio_OFAC_expedicion = $result["documentos_socios"][$value_socios["id"]][$_flag_OFAC]["fecha_expedicion"];

							$_cambia_archivo = '';
							if ($_flag_cambia_archivo) {
								$_cambia_archivo = '
										<div class="form-group col-sm-1 div_socio_OFAC_file_' . ($key_socios + 1) . '">
											<br />
											<table class="table">
												<tbody>
													<tr>
														<td class="actions-nexos hint--top-left" data-hint="Ajustar Archivo">
															<center>
																<span class="icon mdi mdi-edit link_socio_OFAC_file" id="link_socio_OFAC_file_' . ($key_socios + 1) . '"></span>
															</center>
														</td>
													</tr>
													<tr><td></td></tr>
												</tbody>
											</table>
										</div>
									';
							}

							$socio_OFAC_file = '
									<div class="form-group col-sm-3" id="div_socio_OFAC_file_' . ($key_socios + 1) . '" style="display: none;">
										<label class="control-label">(*) Documento:</label><br />
										<input type="file" name="socio_OFAC_file_' . ($key_socios + 1) . '" id="socio_OFAC_file_' . ($key_socios + 1) . '" class="inputfile">
										<label for="socio_OFAC_file_' . ($key_socios + 1) . '" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
									</div>
									<div class="form-group col-sm-2 div_socio_OFAC_file_' . ($key_socios + 1) . '">
										<div class="icon-container">
											<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/' . $result["documentos_socios"][$value_socios["id"]][$_flag_OFAC]["tipo_miembro"] . '/' . $result["documentos_socios"][$value_socios[0]][$_flag_OFAC]["documento"] . '/' . $result["documentos_socios"][$value_socios[0]][$_flag_OFAC]["folder"] . '/' . $result["documentos_socios"][$value_socios[0]][$_flag_OFAC]["url"] . '" target="_blank" class="icon hint--top-left" data-hint="Descargar">
												<span class="mdi mdi-download"></span>
											</a>
										</div>
									</div>
									' . $_cambia_archivo . '
								';
							$_novedad = "Sin novedad";
							if ($result["documentos_socios"][$value_socios["id"]][$_flag_OFAC]["novedad"]) {
								$_novedad = $result["documentos_socios"][$value_socios["id"]][$_flag_OFAC]["novedad"];
							}
							$socio_OFAC_novedad = '
									<label class="control-label">Novedad:</label>
									<textarea class="form-control input-sm" placeholder="Si la consulta genera alguna novedad, ingrésela aquí." id="socio_OFAC_novedad_' . ($key_socios + 1) . '" disabled>' . $_novedad . '</textarea>
								';
						}

						$socios .= '
								<input type="hidden" name="id_socio_' . ($key_socios + 1) . '" id="id_socio_' . ($key_socios + 1) . '" value="' . $value_socios["id"] . '">
								<div class="panel panel-border panel-contrast panel_socio">
									<div class="panel-heading panel-heading-contrast">
										' . $value_socios["nombre_miembro"] . '
										<div class="tools"></div>
										<span class="panel-subtitle">' . $value_socios["documento"] . '</span>
									</div>
									<div class="panel-body xs-mt-15">
										<div class="form-group col-sm-3">
											<p><strong>Antecedentes Policía</strong></p>
										</div>
										<div class="form-group col-sm-3">
											<label class="control-label">(*) Fecha Expedición:</label>
											<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
												<input size="10" type="text" value="' . $socio_antecedentes_expedicion . '" name="socio_antecedentes_expedicion_' . ($key_socios + 1) . '" id="socio_antecedentes_expedicion_' . ($key_socios + 1) . '" readonly="" class="form-control input-sm">
												<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
											</div>
										</div>
										' . $socio_antecedentes_file . '
										<div class="form-group col-sm-3">
											' . $socio_antecedentes_novedad . '
										</div>

										<div class="col-sm-12"></div>
										<div class="form-group col-sm-3">
											<p><strong>OFAC (Lista Clinton)</strong></p>
										</div>
										<div class="form-group col-sm-3">
											<label class="control-label">(*) Fecha Expedición:</label>
											<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
												<input size="10" type="text" value="' . $socio_OFAC_expedicion . '" name="socio_OFAC_expedicion_' . ($key_socios + 1) . '" id="socio_OFAC_expedicion_' . ($key_socios + 1) . '" readonly="" class="form-control input-sm">
												<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
											</div>
										</div>
										' . $socio_OFAC_file . '
										<div class="form-group col-sm-3">
											' . $socio_OFAC_novedad . '
										</div>
										<div class="col-sm-12"></div>
									</div>
								</div>
							';
					}
					$socios .= '<input type="hidden" name="cant_socios" id="cant_socios" value="' . $result["socios"]["rowsNum"] . '">';
				}

				$calidad = '
						<div id="calidad" class="tab-pane">
							<div class="tab-container">
								<ul class="nav nav-tabs nav-tabs-success">
									<li class="active"><a href="#calidad_cliente" data-toggle="tab">Cliente</a></li>
									<li><a href="#calidad_representante" data-toggle="tab">Representante Legal o Suplente</a></li>
									<li><a href="#calidad_revisor" data-toggle="tab">Revisor Fiscal</a></li>
									<li><a href="#calidad_socios" data-toggle="tab">Socios</a></li>
								</ul>
								<div class="tab-content">
									<div id="calidad_cliente" class="tab-pane active cont">
										<div class="form-group col-sm-12"></div>
										<div class="form-group col-sm-3">
											<p><strong>OFAC (Lista Clinton)</strong></p>
										</div>
										<div class="form-group col-sm-3">
											<label class="control-label">(*) Fecha Consulta:</label>
											<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
												<input size="10" type="text" value="' . $cliente_OFAC_expedicion . '" name="cliente_OFAC_expedicion" id="cliente_OFAC_expedicion" readonly="" class="form-control input-sm">
												<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
											</div>
										</div>
										' . $cliente_OFAC_file . '
										<div class="form-group col-sm-3">
											' . $cliente_OFAC_novedad . '
										</div>
										<div class="col-sm-12"></div>
										<div class="form-group col-sm-3">
											<p><strong>Centrales de Riesgo (CIFIN)</strong></p>
										</div>
										<div class="form-group col-sm-3">
											<label class="control-label">(*) Fecha Expedición:</label>
											<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
												<input size="10" type="text" value="' . $cliente_CIFIN_expedicion . '" name="cliente_CIFIN_expedicion" id="cliente_CIFIN_expedicion" readonly="" class="form-control input-sm">
												<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
											</div>
										</div>
										' . $cliente_CIFIN_file . '
										<div class="col-sm-12"></div>
										<div class="form-group col-sm-3">
											<p><strong>RUES</strong></p>
										</div>
										<div class="form-group col-sm-3">
											<label class="control-label">(*) Fecha Expedición:</label>
											<div data-min-view="2" data-start-view="4" data-date-format="yyyy-mm-dd" data-link-field="dtp_input1" class="input-group date datetimepicker" style="padding: 0">
												<input size="10" type="text" value="' . $cliente_RUES_expedicion . '" name="cliente_RUES_expedicion" id="cliente_RUES_expedicion" readonly="" class="form-control input-sm">
												<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
											</div>
										</div>
										' . $cliente_RUES_file . '
										<div class="form-group col-sm-12"></div>
									</div>
									<div id="calidad_representante" class="tab-pane cont">
										' . $representante_legal . '
									</div>
									<div id="calidad_revisor" class="tab-pane cont">
										' . $revisor_fiscal . '
									</div>
									<div id="calidad_socios" class="tab-pane cont">
										' . $socios . '
									</div>
								</div>
							</div>
						</div>
					';
				/****** Fin - Pestaña Calidad ******/

				/****** Pestaña Ficha Técnica ******/
				$poliza_nexos_check = "";
				if ($value["op_poliza_nexos"]) {
					$poliza_nexos_check = "checked";
				}
				$ficha_tecnica = '
						<div id="ficha_tecnica" class="tab-pane">
							<div class="tab-container">
								<ul class="nav nav-tabs nav-tabs-success">
									<li class="active"><a href="#ficha_seguridad" data-toggle="tab">Seguridad</a></li>
									<li><a href="#ficha_operaciones" data-toggle="tab">Operaciones</a></li>
									<li><a href="#ficha_facturacion" data-toggle="tab">Facturación</a></li>
									<li><a href="#ficha_tesoreria" data-toggle="tab">Tesorería</a></li>
								</ul>
								<div class="tab-content">
									<div id="ficha_seguridad" class="tab-pane active cont">
										<div class="form-group col-sm-12">
											<label class="control-label">(*) Condiciones de Cargue y Descargue:</label>
											<textarea name="seguridad_condiciones_cargue" id="seguridad_condiciones_cargue" class="form-control input-sm" data-parsley-id="73">' . $value["seg_cond_cargue"] . '</textarea>
										</div>
										<div class="form-group col-sm-12">
											<label class="control-label">(*) Condiciones de Seguridad:</label>
											<textarea name="seguridad_condiciones_seguridad" id="seguridad_condiciones_seguridad" class="form-control input-sm" data-parsley-id="73">' . $value["seg_cond_seguridad"] . '</textarea>
										</div>
									</div>
									<div id="ficha_operaciones" class="tab-pane cont">
										<div class="form-group col-sm-12">
											<div class="be-checkbox">
												<input name="poliza_nexos_check" id="poliza_nexos_check" class="check_solicitudes" type="checkbox" ' . $poliza_nexos_check . '>
												<label for="poliza_nexos_check">Usa póliza Nexos:</label>
											</div>
										</div>
										<div class="form-group col-sm-12">
											<label class="control-label">(*) Condiciones para Planillar:</label>
											<textarea name="operaciones_planillar" id="operaciones_planillar" class="form-control input-sm" data-parsley-id="73">' . $value["op_cond_planillar"] . '</textarea>
										</div>
										<div class="form-group col-sm-12">
											<label class="control-label">(*) Condiciones para Cumplir:</label>
											<textarea name="operaciones_cumplir" id="operaciones_cumplir" class="form-control input-sm" data-parsley-id="73">' . $value["op_cond_cumplir"] . '</textarea>
										</div>
									</div>
									<div id="ficha_facturacion" class="tab-pane cont">
										<div class="form-group col-sm-12">
											<label class="control-label">(*) Condiciones para Cumplir:</label>
											<textarea name="facturacion_cumplir" id="facturacion_cumplir" class="form-control input-sm" data-parsley-id="73">' . $value["fac_cond_cumplir"] . '</textarea>
										</div>
										<div class="form-group col-sm-12">
											<label class="control-label">(*) Condiciones para Facturar:</label>
											<textarea name="facturacion_facturar" id="facturacion_facturar" class="form-control input-sm" data-parsley-id="73">' . $value["fac_cond_facturar"] . '</textarea>
										</div>
										<div class="form-group col-sm-4">
											<label class="control-label">(*) Dirección de radicación:</label>
											<input type="text" name="facturacion_direccion" id="facturacion_direccion" class="form-control input-sm" value="' . $value["fac_direccion_radicacion"] . '">
										</div>
										<div class="form-group col-sm-4">
											<label class="control-label">(*) Día máximo de radicación:</label>
											<input type="text" name="facturacion_radicar" id="facturacion_radicar" class="form-control input-sm" value="' . $value["fac_dia_max_facturacion"] . '">
										</div>
										<div class="form-group col-sm-4">
											<label class="control-label">(*) Horario de atención:</label>
											<input type="text" name="facturacion_atencion" id="facturacion_atencion" class="form-control input-sm" value="' . $value["fac_horario_atencion"] . '">
										</div>
									</div>
									<div id="ficha_tesoreria" class="tab-pane cont">
										<div class="form-group col-sm-4">
											<label class="control-label">(*) Plazo para pagos:</label>
											<input type="number" min="0" name="tesoreria_plazo_pagos" id="tesoreria_plazo_pagos" class="form-control input-sm" placeholder="Días" value="' . $value["tes_plazo_pagos"] . '">
										</div>
										<div class="form-group col-sm-4">
											<label class="control-label">(*) Días de pago:</label>
											<input type="text" name="tesoreria_dias_pago" id="tesoreria_dias_pago" class="form-control input-sm" value="' . $value["tes_dias_pagos"] . '">
										</div>
										<div class="form-group col-sm-4">
											<label class="control-label">(*) Días de información:</label>
											<input type="text" name="tesoreria_dias_informacion" id="tesoreria_dias_informacion" class="form-control input-sm" value="' . $value["tes_dias_informacion"] . '">
										</div>
										<div class="form-group col-sm-12">
											<label class="control-label">(*) Instrucción de pago:</label>
											<textarea name="tesoreria_instruccion" id="tesoreria_instruccion" class="form-control input-sm" data-parsley-id="73">' . $value["tes_instruccion_pago"] . '</textarea>
										</div>
									</div>
								</div>
							</div>
						</div>
					';
				/****** Fin - Pestaña Ficha Técnica ******/

				/****** Pestaña Finanzas ******/
				$ingreso_neto_mensual = "";
				if ($value["ingreso_neto_mensual"]) {
					$ingreso_neto_mensual = number_format((int) $value["ingreso_neto_mensual"], 0, ",", ".");
				}

				$pasivos_corrientes = "";
				if ($value["pasivos_corrientes"]) {
					$pasivos_corrientes = number_format((int) $value["pasivos_corrientes"], 0, ",", ".");
				}

				$pasivos_no_corrientes = "";
				if ($value["pasivos_no_corrientes"]) {
					$pasivos_no_corrientes = number_format((int) $value["pasivos_no_corrientes"], 0, ",", ".");
				}

				$capacidad_endeudamiento = "";
				if ($value["capacidad_endeudamiento"]) {
					$capacidad_endeudamiento = number_format((int) $value["capacidad_endeudamiento"], 0, ",", ".");
				}

				$cupo_credito_base = "";
				if ($value["cupo_credito_base"]) {
					$cupo_credito_base = number_format((int) $value["cupo_credito_base"], 0, ",", ".");
				}

				$finanzas = '
						<div id="finanzas" class="tab-pane cont">
							<div class="form-group col-sm-12"></div>
							<div class="form-group col-sm-3 hint--top-right" data-hint="Dato según estados financieros (Balance, P&G, etc)">
								<label class="control-label">(*) Ingreso Neto Mensual:</label>
								<input type="text" onkeyup="getSeparadorMiles(this)" onchange="getSeparadorMiles(this)" name="finanzas_ingreso_mensual" id="finanzas_ingreso_mensual" class="form-control input-sm" value="' . $ingreso_neto_mensual . '">
							</div>
							<div class="form-group col-sm-3">
								<label class="control-label">(*) Pasivos Corrientes:</label>
								<input type="text" onkeyup="getSeparadorMiles(this)" onchange="getSeparadorMiles(this)" name="finanzas_pasivo_corriente" id="finanzas_pasivo_corriente" class="form-control input-sm" value="' . $pasivos_corrientes . '">
							</div>
							<div class="form-group col-sm-3">
								<label class="control-label">(*) Pasivos No Corrientes:</label>
								<input type="text" onkeyup="getSeparadorMiles(this)" onchange="getSeparadorMiles(this)" name="finanzas_pasivo_no_corriente" id="finanzas_pasivo_no_corriente" class="form-control input-sm" value="' . $pasivos_no_corrientes . '">
							</div>
							<div class="form-group col-sm-3">
								<label class="control-label">(*) Capacidad Endeudam:</label>
								<input type="text" onkeyup="getSeparadorMiles(this)" onchange="getSeparadorMiles(this)" name="finanzas_capacidad_endeudamiento" id="finanzas_capacidad_endeudamiento" class="form-control input-sm" placeholder="Capacidad Endeudamiento" value="' . $capacidad_endeudamiento . '" readonly>
							</div>
							<div class="form-group col-sm-4">
								<label class="control-label">(*) Cupo de Crédito:</label>
								<input type="text" onkeyup="getSeparadorMiles(this)" onchange="getSeparadorMiles(this)" name="finanzas_cupo_credito" id="finanzas_cupo_credito" class="form-control input-sm" value="' . $cupo_credito_base . '">
							</div>
							<div class="col-sm-12"></div>
							<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
								<div class="icon">
									<span class="mdi mdi-close"></span>
								</div>
								<div class="message">
									<strong>Error!</strong>
									<p>No se ha registrado la última consulta CIFIN de éste cliente</p>
								</div>
							</div>
						</div>
					';

				// Se pregunta si ya se registró las calificaciones CIFIN del cliente
				$financ_cifin = '
						<div class="col-sm-12 calificacion_cifin_clon" id="form_calificacion_cifin_1">
							<div class="form-group col-sm-1"></div>
							<div class="form-group col-sm-6" id="div_calificacion_cifin_nombre_1">
								<label class="control-label">(*) Entidad Financiera:</label>
								<input type="text" name="calificacion_cifin_nombre_1" id="calificacion_cifin_nombre_1" class="form-control input-sm">
							</div>
							<div class="form-group col-sm-4" id="div_calificacion_cifin_1">
								<label class="control-label">(*) Calificación CIFIN:</label>
								' . $Clientes->getEnumSlctCifinCalificacion_sm("calificacion_cifin_1", "", "") . '
							</div>
							<div class="form-group col-sm-1"></div>
						</div>
					';

				if (isset($result["calificaciones_CIFIN"])) {
					$financ_cifin = '
							<div class="col-sm-12 calificacion_cifin_clon" id="form_calificacion_cifin_1">
								<div class="form-group col-sm-1"></div>
								<div class="form-group col-sm-6" id="div_calificacion_cifin_nombre_1">
									<label class="control-label">(*) Entidad Financiera:</label>
									<input type="text" name="calificacion_cifin_nombre_1" id="calificacion_cifin_nombre_1" class="form-control input-sm">
								</div>
								<div class="form-group col-sm-4" id="div_calificacion_cifin_1">
									<label class="control-label">(*) Calificación CIFIN:</label>
									' . $Clientes->getEnumSlctCifinCalificacion_sm("calificacion_cifin_1", "", "") . '
								</div>
								<div class="form-group col-sm-1"></div>
							</div>
						';

					if ($result["calificaciones_CIFIN"]) {
						$financ_cifin = '';
						$i = 1;
						foreach ($result["calificaciones_CIFIN"]["rowsData"] as $key_calificacion_cifin => $value_calificacion_cifin) {
							$financ_cifin .= '
									<div class="col-sm-12 calificacion_cifin_clon" id="form_calificacion_cifin_' . $i . '">
										<div class="form-group col-sm-1"></div>
										<div class="form-group col-sm-6" id="div_calificacion_cifin_nombre_' . $i . '">
											<label class="control-label">(*) Entidad Financiera:</label>
											<input type="text" name="calificacion_cifin_nombre_' . $i . '" id="calificacion_cifin_nombre_' . $i . '" class="form-control input-sm" value="' . $value_calificacion_cifin["entidad_financiera"] . '">
										</div>
										<div class="form-group col-sm-4" id="div_calificacion_cifin_' . $i . '">
											<label class="control-label">(*) Calificación CIFIN:</label>
											' . $Clientes->getEnumSlctCifinCalificacion_sm("calificacion_cifin_" . $i, "", $value_calificacion_cifin["calificacion"]) . '
										</div>
										<div class="form-group col-sm-1"></div>
									</div>
								';
							$i++;
						}
					}
				}

				if (isset($result["CIFIN"]) and $result["CIFIN"]) {
					$finanzas = '
							<div id="finanzas" class="tab-pane cont">
								<div class="form-group col-sm-12"></div>
								<div class="form-group col-sm-3 hint--top-right" data-hint="Dato según estados financieros (Balance, P&G, etc)">
									<label class="control-label">(*) Ingreso Neto Mensual:</label>
									<input type="text" onkeyup="getSeparadorMiles(this)" onchange="getSeparadorMiles(this)" name="finanzas_ingreso_mensual" id="finanzas_ingreso_mensual" class="form-control input-sm" value="' . $ingreso_neto_mensual . '">
								</div>
								<div class="form-group col-sm-3">
									<label class="control-label">(*) Pasivos Corrientes:</label>
									<input type="text" onkeyup="getSeparadorMiles(this)" onchange="getSeparadorMiles(this)" name="finanzas_pasivo_corriente" id="finanzas_pasivo_corriente" class="form-control input-sm" value="' . $pasivos_corrientes . '">
								</div>
								<div class="form-group col-sm-3">
									<label class="control-label">(*) Pasivos No Corrientes:</label>
									<input type="text" onkeyup="getSeparadorMiles(this)" onchange="getSeparadorMiles(this)" name="finanzas_pasivo_no_corriente" id="finanzas_pasivo_no_corriente" class="form-control input-sm" value="' . $pasivos_no_corrientes . '">
								</div>
								<div class="form-group col-sm-3">
									<label class="control-label">(*) Capacidad Endeudam:</label>
									<input type="text" onkeyup="getSeparadorMiles(this)" onchange="getSeparadorMiles(this)" name="finanzas_capacidad_endeudamiento" id="finanzas_capacidad_endeudamiento" class="form-control input-sm" placeholder="Capacidad Endeudamiento" value="' . $capacidad_endeudamiento . '" readonly>
								</div>
								<div class="form-group col-sm-4">
									<label class="control-label">(*) Cupo de Crédito:</label>
									<input type="text" onkeyup="getSeparadorMiles(this)" onchange="getSeparadorMiles(this)" name="finanzas_cupo_credito" id="finanzas_cupo_credito" class="form-control input-sm" value="' . $cupo_credito_base . '">
								</div>
								<div class="col-sm-12"></div>
								<div class="col-sm-4">
									<strong>Calificaciones CIFIN</strong>
								</div>
								<div class="icon col-sm-8 div_cifin">
									<button type="button" class="btn btn-space btn-success btn-big hint--top" data-hint="Agregar Calificación" id="btn_agrega_calificacion_cifin"><span class="mdi mdi-plus"></span></button>
									<button type="button" class="btn btn-space btn-danger btn-big hint--top" data-hint="Quitar Calificación" id="btn_quita_calificacion_cifin"><span class="mdi mdi-minus"></span></button>
								</div>
								<input type="hidden" name="id_cliente_documento" id="id_cliente_documento" value="' . $result["CIFIN"]["id"] . '">
								' . $financ_cifin . '
							</div>
						';
				}

				/****** Fin - Pestaña Finanzas ******/

				/****** Pestaña Aprobaciones ******/
				$_aprobaciones_content = '
						<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
							<div class="icon">
								<span class="mdi mdi-check"></span>
							</div>
							<div class="message">
								<strong>Error!</strong><p>No hay información suficiente para validar este cliente.</p>
							</div>
						</div>
					';

				// Se busca la información del Cliente
				$result_aprobacion = $Clientes->getValidaDocumentosAprobacion($result);
				// $return["valida_aprobacion"] = $result;
				if ($result_aprobacion) {
					$_aprobaciones_content = '
							<div class="form-group col-sm-3">
								<label class="control-label">(*) Cupo Autorizado:</label>
								<input type="number" name="cupo_autorizado" id="cupo_autorizado" class="form-control input-sm" value="' . $value["cupo_credito_base"] . '">
							</div>
							<div class="form-group col-sm-3">
								<label class="control-label">(*) Plazo de Pago:</label>
								<input type="number" name="plazo_pago_autorizado" id="plazo_pago_autorizado" class="form-control input-sm" value="' . $value["tes_plazo_pagos"] . '">
							</div>
							<div class="form-group col-sm-3">
								<label class="control-label">(*) Listado Documentación:</label><br>
								<input type="file" name="listado_documentacion_file" id="listado_documentacion_file" class="inputfile">
								<label for="listado_documentacion_file" class="btn-success"> <i class="mdi mdi-upload"></i><span>Buscar Archivo...</span>:</label>
							</div>
							<div class="form-group col-sm-3">
								<label class="control-label">(*) Aprobación:</label>
								<select class="form-control input-sm" name="aprobacion" id="aprobacion">
									<option disabled selected>Seleccione</option>
									<option value="0">No aprobado</option>
									<option value="1">Aprobado</option>
								</select>
							</div>
						';
				}

				$_participacion_content = '
						<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
							<div class="icon">
								<span class="mdi mdi-check"></span>
							</div>
							<div class="message">
								<strong>Error!</strong><p>No se ha asignado los responsables de este cliente.</p>
							</div>
						</div>
					';

				if (isset($result["servicios"]) and $result["servicios"]) {
					$_participacion_content = '
							<div class="col-sm-12">
								<h4>Servicios</h4>
							</div>
						';

					$_lista_servicios = "";
					foreach ($result["servicios"]["rowsData"] as $key_servicios => $value_servicios) {
						$_id_servicio = strtolower(str_replace(" ", "_", $value_servicios["servicio"]));

						$_participacion_content .= '
								<div class="col-sm-6">
								<span id="title_' . $_id_servicio . '" class="title_servicio"><strong>' . $value_servicios["servicio"] . '</strong></span>
									<table id="table1" class="table table-striped table-hover">
										<tbody>
							';

						// var_dump($result["ejecutivo_comercial"][$value_servicios["id"]]["rowsData"]);
						// exit();

						// foreach ($result["ejecutivo_comercial"][$value_servicios["id"]]["rowsData"] as $key_comercial => $value_comercial) {
						// 	$_participacion = $value_comercial["participacion"];

						// 	$_participacion_content .= '
						// 			<tr role="row" class="odd">
						// 				<td class="cell-detail">
						// 					<span id="responsable_' . $_id_servicio . '_' . $key_comercial . '">' . $value_comercial["nom_usuario"] . '</span>
						// 				</td>
						// 				<td class="cell-detail input-xs" style="width: 25%;">
						// 					<input type="number" min="0" max="100" id="participacion_' . $_id_servicio . '_' . $key_comercial . '" class="form-control input-xs participacion_' . $_id_servicio . '" value="' . $_participacion . '">
						// 					<input type="hidden" id="id_responsable_' . $_id_servicio . '_' . $key_comercial . '" value="' . $value_comercial["id"] . '">
						// 				</td>
						// 				<td class="cell-detail"  style="width: 2%;">
						// 					<span>%</span>
						// 				</td>
						// 			</tr>
						// 		';
						// }

						if (isset($result["ejecutivo_comercial"][$value_servicios["id"]]["rowsData"]) && is_array($result["ejecutivo_comercial"][$value_servicios["id"]]["rowsData"])) {
							foreach ($result["ejecutivo_comercial"][$value_servicios["id"]]["rowsData"] as $key_comercial => $value_comercial) {
								$_participacion = $value_comercial["participacion"];

								$_participacion_content .= '
											<tr role="row" class="odd">
													<td class="cell-detail">
															<span id="responsable_' . $_id_servicio . '_' . $key_comercial . '">' . $value_comercial["nom_usuario"] . '</span>
													</td>
													<td class="cell-detail input-xs" style="width: 25%;">
															<input type="number" min="0" max="100" id="participacion_' . $_id_servicio . '_' . $key_comercial . '" class="form-control input-xs participacion_' . $_id_servicio . '" value="' . $_participacion . '">
															<input type="hidden" id="id_responsable_' . $_id_servicio . '_' . $key_comercial . '" value="' . $value_comercial["id"] . '">
													</td>
													<td class="cell-detail" style="width: 2%;">
															<span>%</span>
													</td>
											</tr>
									';
							}
						} else {
							// Manejo de error o contenido alternativo si no existen datos
							$_participacion_content .= '
									<tr role="row" class="odd">
											<td class="cell-detail" colspan="3">No hay datos disponibles</td>
									</tr>
							';
						}

						$_participacion_content .= '
										</tbody>
									</table>
								</div>
							';
					}
				}

				$aprobaciones = '
						<div id="aprobaciones" class="tab-pane">
							' . $_aprobaciones_content . '
							' . $_participacion_content . '
						</div>
					';
				// /****** Fin - Pestaña Aprobaciones ******/

				// Se filtra lo que se debe mostrar de acuerdo con el perfil del usuario
				switch ($_POST["id_perfil"]) {
						// Perfil "User master"
					case 1:
						$nav_tabs = '
								<ul class="nav nav-tabs nav-tabs-warning">
									<li><a href="#serv_cliente" data-toggle="tab">Servicio al Cliente</a></li>
									<li><a href="#calidad" data-toggle="tab">Calidad</a></li>
									<li><a href="#ficha_tecnica" data-toggle="tab">Ficha Técnica</a></li>
									<li><a href="#finanzas" data-toggle="tab">Finanzas</a></li>
								</ul>
							';
						$tab_content = $serv_cliente . $calidad . $ficha_tecnica . $finanzas;
						break;

						// Perfil "Comercial - Ejecutivo Comercial"
					case 6:
						$nav_tabs = '
								<ul class="nav nav-tabs nav-tabs-warning">
									<li><a href="#ficha_tecnica" data-toggle="tab">Ficha Técnica</a></li>
								</ul>
							';
						$tab_content = $ficha_tecnica;
						break;

						// Perfil "Comercial - Ejecutivo Servicio al Cliente"
					case 7:
						$nav_tabs = '
								<ul class="nav nav-tabs nav-tabs-warning">
									<li><a href="#serv_cliente" data-toggle="tab">Servicio al Cliente</a></li>
									<li><a href="#ficha_tecnica" data-toggle="tab">Ficha Técnica</a></li>
								</ul>
							';
						$tab_content = $serv_cliente . $ficha_tecnica;
						break;

						// Perfil "Administrador"
					case 13:
						$nav_tabs = '
								<ul class="nav nav-tabs nav-tabs-warning">
									<li><a href="#serv_cliente" data-toggle="tab">Servicio al Cliente</a></li>
									<li><a href="#calidad" data-toggle="tab">Calidad</a></li>
									<li><a href="#ficha_tecnica" data-toggle="tab">Ficha Técnica</a></li>
									<li><a href="#finanzas" data-toggle="tab">Finanzas</a></li>
								</ul>
							';
						$tab_content = $serv_cliente . $calidad . $ficha_tecnica . $finanzas;
						break;

						// Perfil "Facturacion"
					case 14:
						$nav_tabs = '
								<ul class="nav nav-tabs nav-tabs-warning">
									<li><a href="#serv_cliente" data-toggle="tab">Servicio al Cliente</a></li>
									<li><a href="#ficha_tecnica" data-toggle="tab">Ficha Técnica</a></li>
								</ul>
							';
						$tab_content = $serv_cliente . $ficha_tecnica;
						break;

						// Perfil "Calidad"
					case 19:
						$nav_tabs = '
								<ul class="nav nav-tabs nav-tabs-warning">
									<li><a href="#calidad" data-toggle="tab">Calidad</a></li>
								</ul>
							';
						$tab_content = $calidad;
						break;

						// Perfil "Contabilidad"
					case 20:
						$nav_tabs = '
								<ul class="nav nav-tabs nav-tabs-warning">
									<li><a href="#finanzas" data-toggle="tab">Finanzas</a></li>
								</ul>
							';
						$tab_content = $finanzas;
						break;

						// Perfil "Gerencia"
					case 21:
						$nav_tabs = '
								<ul class="nav nav-tabs nav-tabs-warning">
									<li><a href="#aprobaciones" data-toggle="tab">Aprobaciones</a></li>
								</ul>
							';
						$tab_content = $aprobaciones;
						break;

						// Perfil "Internacional - Servicio al Cliente"
					case 22:
						$nav_tabs = '
								<ul class="nav nav-tabs nav-tabs-warning">
									<li><a href="#serv_cliente" data-toggle="tab">Servicio al Cliente</a></li>
									<li><a href="#calidad" data-toggle="tab">Calidad</a></li>
									<li><a href="#ficha_tecnica" data-toggle="tab">Ficha Técnica</a></li>
									<li><a href="#finanzas" data-toggle="tab">Finanzas</a></li>
								</ul>
							';
						$tab_content = $serv_cliente . $calidad . $ficha_tecnica . $finanzas;

						break;

					default:
						$_msg_control .= "Error de acceso del perfil.\n";
						$nav_tabs = '';
						$tab_content = '
								<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
									<div class="icon">
										<span class="mdi mdi-close"></span>
									</div>
									<div class="message">
										<strong>Error!</strong>
										<p>No tiene permisos va ver información de éste módulo...</p>
									</div>
								</div>
							';
						break;
				}

				// Formulario de edición de contenido
				$_msg_content .= '
						<input type="hidden" id="e_id_cliente" value="' . $value["id"] . '">
						<input type="hidden" id="e_documento" value="' . $value["documento"] . $value["digito_verificacion"] . '">
						<input type="hidden" id="e_cod_cliente" value="' . $value["cod_cliente"] . '">
						<input type="hidden" id="e_rndc_municipio" value="' . $value["rndc_codigo_ciudad"] . '">
						<div class="tab-container">
							' . $nav_tabs . '
							<div class="tab-content">
								' . $tab_content . '
							</div>
						</div>
					';
			}
		} else {
			$_msg_error .= '
					<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<strong>Error!</strong>
							<p>No se encontró información del Cliente</p>
						</div>
					</div>
				';
		}
		break;

	case 'editarCliente':
		$_msg_control .= "Entro en la accion editarCliente.\n";
		$return["post"] = $_POST;
		$return["files"] = $_FILES;

		$arrayCliente = array();
		$id_cliente = $_POST["id"];

		// Se valida si la información del formulario es de adicion de documentos o de Aprobación de datos
		if (isset($_POST["aprobaciones"]) and $_POST["aprobaciones"]) {
			$aprobacion = $_POST["aprobaciones"];

			if (isset($aprobacion["plazo_pago_autorizado"]) and isset($aprobacion["cupo_autorizado"]) and isset($aprobacion["aprobacion"]) and isset($aprobacion["listado_documentacion_file"])) {
				// Se crea array de actualización del cliente
				$arrayCliente["tes_plazo_pagos"] = $aprobacion["plazo_pago_autorizado"];
				$arrayCliente["cupo_credito_base"] = $aprobacion["cupo_autorizado"];
				$arrayCliente["estado"] = $aprobacion["aprobacion"];

				// Se guarda el registro del documento
				$arrayDocumento = array();
				$arrayDocumento["id_cliente"] = $id_cliente;
				$arrayDocumento["id_tipo_documento"] = 22;
				$arrayDocumento["fecha_expedicion"] = date('Y-m-d', $time);
				$arrayDocumento["url_documento"] = date('Y-m-d', $time) . "-" . $id_cliente . "." . $Clientes->get_extension_archivo($aprobacion["listado_documentacion_file"]);
				$Data->setRegistro("cmx_clientes_documentos", $arrayDocumento);
			}

			if (isset($_POST["aprobaciones"]["participacion"])) {
				foreach ($_POST["aprobaciones"]["participacion"] as $key => $value) {
					foreach ($value as $key_01 => $value_01) {
						$arrayParticipacion = array();
						$arrayParticipacion["participacion"] = $value_01["participacion"];
						$Data->updateRegistro("cmx_clientes_serv_responsables", $arrayParticipacion, (int) $value_01["id"]);
					}
				}
			}
		} else {
			$arrayCliente["op_poliza_nexos"] = '';
			// Se adiciona informacion de la pestaña de Servicio al CLiente
			if (isset($_POST["serv_cliente"])) {
				$return["serv_cliente"] = $_POST["serv_cliente"];
				foreach ($_POST["serv_cliente"] as $key => $value) {
					switch ($key) {
						case '0': // Pestaña de Cámara de Comercio
							if ($_POST["serv_cliente"][$key]) {
								$serv_cliente = $_POST["serv_cliente"][$key];

								// Se pregunta si ya existe la cámara de comercio
								$_flag_documento = $Clientes->buscarDocumentoByNumDocumento($id_cliente, $serv_cliente["numero_documento"], $serv_cliente["id_tipo_documento"]);

								if (!$_flag_documento) {
									// Se inactiva el los registros anteriores de la cámara de comercio
									$sql = '
											UPDATE cmx_clientes_documentos
											SET estado = "0"
											WHERE
												id_cliente = ' . $id_cliente . '
												AND id_tipo_documento = ' . $serv_cliente["id_tipo_documento"] . '
										';
									$Data->ejecuteRegistro($sql);

									// Se guarda el registro del documento
									$arrayDocumento = array();

									$id = $serv_cliente["id"];
									$arrayDocumento["id_cliente"] = $id_cliente;
									$arrayDocumento["id_tipo_documento"] = $serv_cliente["id_tipo_documento"];
									$arrayDocumento["numero_documento"] = $serv_cliente["numero_documento"];
									$arrayDocumento["fecha_expedicion"] = $serv_cliente["fecha_renovacion"];
									$arrayDocumento["url_documento"] = $serv_cliente["fecha_renovacion"] . "-" . $id_cliente . "." . $Clientes->get_extension_archivo($serv_cliente["url_documento"]);
									$Data->setRegistro("cmx_clientes_documentos", $arrayDocumento);
								} else {
									// Se actualiza el registro del documento
									$arrayDocumento = array();
									$arrayDocumento["id_cliente"] = $id_cliente;
									$arrayDocumento["id_tipo_documento"] = $serv_cliente["id_tipo_documento"];
									$arrayDocumento["numero_documento"] = $serv_cliente["numero_documento"];

									//$id =  $_flag_documento["rowsData"][0]  ;

									if ($serv_cliente["url_documento"]) {
										$arrayDocumento["fecha_expedicion"] = $serv_cliente["fecha_renovacion"];
										$arrayDocumento["url_documento"] = $serv_cliente["fecha_renovacion"] . "-" . $id_cliente . "." . $Clientes->get_extension_archivo($serv_cliente["url_documento"]);
									}
									$Data->updateRegistro("cmx_clientes_documentos", $arrayDocumento, $id_cliente);
								}

								// Si no se ha registrado una cámara de comercio se crea
								$result = $Clientes->getCamComercioCliente($id_cliente);
								if (!$result) {
									// Se guarda el registro de cámara de comercio
									$arrayCamComercio = array();
									$arrayCamComercio["id_cliente"] = $id_cliente;
									$arrayCamComercio["fecha_constitucion"] = $serv_cliente["fecha_expedicion"];
									$id_camara = $arrayCamComercio["id"];
									if ($serv_cliente["capital_pagado"] and $serv_cliente["capital_pagado"] > 0 and $serv_cliente["capital_suscrito"] and $serv_cliente["capital_suscrito"] > 0 and $serv_cliente["capital_autorizado"] and $serv_cliente["capital_autorizado"] > 0) {
										$arrayCamComercio["capital_pagado"] = $serv_cliente["capital_pagado"];
										$arrayCamComercio["capital_suscrito"] = $serv_cliente["capital_suscrito"];
										$arrayCamComercio["capital_autorizado"] = $serv_cliente["capital_autorizado"];
									}
									$Data->setRegistro("cmx_clientes_cam_comercio", $arrayCamComercio);
								} else {
									// Se actualiza el registro de cámara de comercio
									if ($serv_cliente["capital_pagado"] and $serv_cliente["capital_pagado"] > 0 and $serv_cliente["capital_suscrito"] and $serv_cliente["capital_suscrito"] > 0 and $serv_cliente["capital_autorizado"] and $serv_cliente["capital_autorizado"] > 0) {
										if ($result) {
											foreach ($result["rowsData"] as $key => $value) {
												$id_cam_comercio = $value['id'];
											}
										}
										$arrayCamComercio = array();
										$arrayCamComercio["capital_pagado"] = $serv_cliente["capital_pagado"];
										$arrayCamComercio["capital_suscrito"] = $serv_cliente["capital_suscrito"];
										$arrayCamComercio["capital_autorizado"] = $serv_cliente["capital_autorizado"];
										$result = $Data->updateRegistro("cmx_clientes_cam_comercio", $arrayCamComercio, $id_cam_comercio);
									}
								}

								// Si no exite el representante legal activo se inactiva el anterior y se guarda el nuevo
								$representante_legal = $serv_cliente["representante_legal"];
								$validaRepresentante = $Clientes->getMiembroClienteActivo($id_cliente, $representante_legal["documento"], $representante_legal["tipo_miembro"]);
								if (!$validaRepresentante) {
									// Se inactiva el los registros anteriores del representante legal
									$sql = '
											UPDATE
												cmx_clientes_miembros_documentos
											SET estado = 0
											WHERE
												id_tipo_documento = 1
												AND id_miembro IN (
													SELECT id
													FROM cmx_clientes_miembros
													WHERE id_cliente = ' . $id_cliente . '
												)
										';
									$Data->ejecuteRegistro($sql);

									// Se guarda la información del Representante legal
									$arrayRepresentante = array();
									$arrayRepresentante["id_cliente"] = $id_cliente;
									$arrayRepresentante["documento"] = $representante_legal["documento"];
									$arrayRepresentante["nombre_miembro"] = $representante_legal["nombre_miembro"];
									$arrayRepresentante["tipo_miembro"] = $representante_legal["tipo_miembro"];
									$id_miembro = $Data->setRegistro("cmx_clientes_miembros", $arrayRepresentante);

									// Se guarda la información del documento del Representante legal
									$arrayRepresentanteDocumento = array();
									$arrayRepresentanteDocumento["id_miembro"] = $id_miembro;
									$arrayRepresentanteDocumento["id_tipo_documento"] = 1;
									if ($representante_legal["url"]) {
										$arrayRepresentanteDocumento["fecha_expedicion"] = date("Y-m-d", $time);
										$arrayRepresentanteDocumento["url"] = date("Y-m-d", $time) . "-" . $id_miembro . "." . $Clientes->get_extension_archivo($representante_legal["url"]);
									}
									$Data->setRegistro("cmx_clientes_miembros_documentos", $arrayRepresentanteDocumento);
								} else {
									// Si existe se actualiza la informacion
									$arrayRepresentante = array();
									$arrayRepresentante["nombre_miembro"] = $representante_legal["nombre_miembro"];
									$representante_legal["nombre_miembro"];

									//$id = $validaRepresentante["rowsData"][0][0] ?? null;
									if ($validaRepresentante) {
										foreach ($validaRepresentante["rowsData"] as $key => $value) {
											$idrepresente = $value['id'];
										}
									}
									$Data->updateRegistro("cmx_clientes_miembros", $arrayRepresentante, $idrepresente);
									if ($representante_legal["url"]) {
										// Se actualiza la información del documento del Representante legal
										$result = $Clientes->buscarDocumentoMiembro($id_cliente, 1, $representante_legal["tipo_miembro"]);
										if ($result) {
											foreach ($result["rowsData"] as $key_01 => $value_01) {
												$arrayRepresentanteDocumento = array();
												$arrayRepresentanteDocumento["fecha_expedicion"] = date("Y-m-d", $time);
												$arrayRepresentanteDocumento["url"] = date("Y-m-d", $time) . "-" . $id . "." . $Clientes->get_extension_archivo($representante_legal["url"]);
												$Data->updateRegistro("cmx_clientes_miembros_documentos", $arrayRepresentanteDocumento, $value_01["id"]);
											}
										}
									}
								}

								// Si no exite el representante legal activo se inactiva el anterior y se guarda el nuevo
								$revisor_fiscal = $serv_cliente["revisor_fiscal"];
								$validaRevisor = $Clientes->getMiembroClienteActivo($id_cliente, $revisor_fiscal["documento"], $revisor_fiscal["tipo_miembro"]);
								if (!$validaRevisor) {
									// Se inactiva el los registros anteriores del representante legal
									$sql = '
											UPDATE
												cmx_clientes_miembros_documentos
											SET estado = 0
											WHERE
												id_tipo_documento = 1
												AND id_miembro IN (
													SELECT id
													FROM cmx_clientes_miembros
													WHERE id_cliente = ' . $id_cliente . '
												)
										';
									$Data->ejecuteRegistro($sql);

									// Se guarda la información del Representante legal
									$arrayRevisor = array();
									$arrayRevisor["id_cliente"] = $id_cliente;
									$arrayRevisor["documento"] = $revisor_fiscal["documento"];
									$arrayRevisor["nombre_miembro"] = $revisor_fiscal["nombre_miembro"];
									$arrayRevisor["tipo_miembro"] = $revisor_fiscal["tipo_miembro"];
									$id_miembro = $Data->setRegistro("cmx_clientes_miembros", $arrayRevisor);

									// Se guarda la información del documento del Representante legal
									$arrayRevisorDocumento = array();
									$arrayRevisorDocumento["id_miembro"] = $id_miembro;
									$arrayRevisorDocumento["id_tipo_documento"] = 1;
									if ($revisor_fiscal["url"]) {
										$arrayRevisorDocumento["fecha_expedicion"] = date("Y-m-d", $time);
										$arrayRevisorDocumento["url"] = date("Y-m-d", $time) . "-" . $id_miembro . "." . $Clientes->get_extension_archivo($revisor_fiscal["url"]);
									}
									$Data->setRegistro("cmx_clientes_miembros_documentos", $arrayRevisorDocumento);
								} else {
									// Si existe se actualiza la informacion
									$arrayRevisor = array();
									$arrayRevisor["nombre_miembro"] = $revisor_fiscal["nombre_miembro"];

									if ($validaRevisor) {
										foreach ($validaRevisor["rowsData"] as $key => $value) {
											$idrevisor = $value['id'];
										}
									}
									$Data->updateRegistro("cmx_clientes_miembros", $arrayRevisor, $idrevisor);
									if ($revisor_fiscal["url"]) {
										// Se actualiza la información del documento del Representante legal
										$result = $Clientes->buscarDocumentoMiembro($id_cliente, 1, $revisor_fiscal["tipo_miembro"]);
										if ($result) {
											foreach ($result["rowsData"] as $key_01 => $value_01) {
												$arrayRevisorDocumento = array();
												$arrayRevisorDocumento["fecha_expedicion"] = date("Y-m-d", $time);
												$arrayRevisorDocumento["url"] = date("Y-m-d", $time) . "-" . $idrevisor . "." . $Clientes->get_extension_archivo($revisor_fiscal["url"]);
												$Data->updateRegistro("cmx_clientes_miembros_documentos", $arrayRevisorDocumento, $value_01["id"]);
											}
										}
									}
								}

								// Se insertan los registros de los socios
								if ($serv_cliente["socios"]) {
									$socios = $serv_cliente["socios"];
									$documentosSocios = "";
									foreach ($socios as $key_socios => $value_socios) {
										if (isset($value_socios["documento"]) and $value_socios["documento"] and isset($value_socios["nombre_miembro"]) and $value_socios["nombre_miembro"]) {
											if ($value_socios != 0) {
												$documentosSocios .= "'" . $value_socios["documento"] . "',";
												$validaSocio = $Clientes->getMiembroClienteActivo($id_cliente, $value_socios["documento"], $value_socios["tipo_miembro"]);
												if (!$validaSocio) {
													// Se guarda la información del Socio
													$arraySocios = array();
													$arraySocios["id_cliente"] = $id_cliente;
													$arraySocios["documento"] = $value_socios["documento"];
													$arraySocios["nombre_miembro"] = $value_socios["nombre_miembro"];
													$arraySocios["tipo_miembro"] = $value_socios["tipo_miembro"];
													$Data->setRegistro("cmx_clientes_miembros", $arraySocios);
												} else {
													// Si existe se actualiza la informacion
													$arraySocios = array();
													$arraySocios["nombre_miembro"] = $value_socios["nombre_miembro"];
													$arraySocios["estado"] = 1;
													if ($validaSocio) {
														foreach ($validaSocio["rowsData"] as $key => $value) {
															$idsocio = $value['id'];
														}
													}
													$Data->updateRegistro("cmx_clientes_miembros", $arraySocios, $idsocio);
												}
											}
										}
									}
									// Se inactiva los socios que no se encontraron en la lista
									if ($documentosSocios) {
										$sql = '
												UPDATE cmx_clientes_miembros
												SET estado = 0
												WHERE
													id_cliente = ' . $id_cliente . '
													AND tipo_miembro = "Socio"
													AND documento NOT IN (' . $documentosSocios . '0)
											';
										$Data->ejecuteRegistro($sql);
									}
								}
							}
							break;

						case '1': // Pestaña de Estados Financieros
							if ($_POST["serv_cliente"][$key]) {
								// $_msg_control.= "Si hay información en la pestaña Servicio al cliente - Estados Financieros\n";
								$Clientes->guardarDatosDocumentos($_POST["serv_cliente"][$key], $id_cliente);
							}
							break;

						case '2': // Pestaña de Póliza
							// $_msg_control.= "Entro en la pestaña de Servicio al cliente - Póliza\n";
							if ($_POST["serv_cliente"][$key]) {
								$serv_cliente = $_POST["serv_cliente"][$key];
								$_flag_documento = $Clientes->buscarDocumentoByNumDocumento($id_cliente, $serv_cliente["numero_documento"], $serv_cliente["id_tipo_documento"]);
								if (!$_flag_documento) {
									$arrayCliente["op_poliza_nexos"] = 1;
								}
								$Clientes->guardarDatosDocumentos($_POST["serv_cliente"][$key], $id_cliente);
							}
							break;

						case '3': // Pestaña de Referencias Comerciales
							if ($_POST["serv_cliente"][$key]) {
								$serv_cliente = $_POST["serv_cliente"][$key];

								if (isset($serv_cliente["referencias_comerciales"]) and $serv_cliente["referencias_comerciales"]) {
									$referencias_comerciales = $serv_cliente["referencias_comerciales"];
									$_flag_ref_comercial = "";
									foreach ($referencias_comerciales as $key_ref_comercial => $value_ref_comercial) {
										if (isset($value_ref_comercial["id"]) and $value_ref_comercial["id"]) {
											//$_flag_ref_comercial .= $value_ref_comercial["id"] . ",";
											$_flag_ref_comercial .= $value_ref_comercial["id"];
										}
										if (isset($value_ref_comercial) != 0 and isset($value_ref_comercial["url_documento"])) {
											// $_flag_ref_comercial .= $Clientes->guardarDatosRefComercial($value_ref_comercial, $id_cliente) . ",";
											$_flag_ref_comercial .= $Clientes->guardarDatosRefComercial($value_ref_comercial, $id_cliente);
										}
									}
									// Se inactivan las cuentas no registradas en el formulario
									$Clientes->setInactivaRefComercial($id_cliente, $_flag_ref_comercial);
								}
							}
							break;

						case '4': // Pestaña de Certificaciones
							if ($_POST["serv_cliente"][$key]) {
								$serv_cliente = $_POST["serv_cliente"][$key];

								// Se guarda el registro del documento basc
								if (isset($serv_cliente["basc"]) and $serv_cliente["basc"]) {
									$Clientes->guardarDatosDocumentos($serv_cliente["basc"], $id_cliente);
								}

								// Se guarda el registro del documento ctpat
								if (isset($serv_cliente["ctpat"]) and $serv_cliente["ctpat"]) {
									$Clientes->guardarDatosDocumentos($serv_cliente["ctpat"], $id_cliente);
								}

								// Se guarda el registro del documento oea
								if (isset($serv_cliente["oea"]) and $serv_cliente["oea"]) {
									$Clientes->guardarDatosDocumentos($serv_cliente["oea"], $id_cliente);
								}

								// Se guarda el registro del documento ISO28000
								if (isset($serv_cliente["ISO28000"]) and $serv_cliente["ISO28000"]) {
									$Clientes->guardarDatosDocumentos($serv_cliente["ISO28000"], $id_cliente);
								}

								// Se guarda el registro del documento ISO9001
								if (isset($serv_cliente["ISO9001"]) and $serv_cliente["ISO9001"]) {
									$Clientes->guardarDatosDocumentos($serv_cliente["ISO9001"], $id_cliente);
								}
							}
							break;

						case '5': // Pestaña de Referencias Bancarias
							if ($_POST["serv_cliente"][$key]) {
								$serv_cliente = $_POST["serv_cliente"][$key];

								if ($serv_cliente["referencias_bancarias"]) {
									$referencias_bancarias = $serv_cliente["referencias_bancarias"];
									$_flag_bancos = "";
									foreach ($referencias_bancarias as $key_ref_bancaria => $value_ref_bancaria) {
										if ($value_ref_bancaria != 0) {
											if (is_array($value_ref_bancaria)) {
												//$_flag_bancos .= '"' . $value_ref_bancaria["numero_cuenta"] . '",';
												$_flag_bancos .= '"' . $value_ref_bancaria["numero_cuenta"] . '"';
												$Clientes->guardarDatosBanco($value_ref_bancaria, $id_cliente);
											}
										}
									}
									// Se inactivan las cuentas no registradas en el formulario
									$Clientes->setInactivaCuentasCliente($id_cliente, $_flag_bancos);
								}
							}
							break;

						case '6': // Pestañas de formatos BASC
							if ($_POST["serv_cliente"][$key]) {
								foreach ($_POST["serv_cliente"][$key] as $key_formato => $value_formato) {
									$Clientes->guardarDatosDocumentos($value_formato, $id_cliente);
								}
							}
							break;

						default:
							$_msg_control .= "Error en el acceso a la pestaña de Servicio al Cliente\n";
							break;
					}
				}
			}

			// Se adiciona informacion de la pestaña de Calidad
			if (isset($_POST["calidad"])) {
				$return["calidad"] = $_POST["calidad"];
				foreach ($_POST["calidad"] as $key => $value) {
					switch ($key) {
						case '0': // Pestaña de Cliente
							if ($_POST["calidad"][$key]) {
								$calidad = $_POST["calidad"][$key];

								if (isset($calidad["ofac"]) and $calidad["ofac"]) {
									$Clientes->guardarDatosDocumentos($calidad["ofac"], $id_cliente);
								}

								if (isset($calidad["cifin"]) and $calidad["cifin"]) {
									$Clientes->guardarDatosDocumentos($calidad["cifin"], $id_cliente);
								}

								if (isset($calidad["rues"]) and $calidad["rues"]) {
									$Clientes->guardarDatosDocumentos($calidad["rues"], $id_cliente);
								}
							}
							break;

						case '1': // Pestaña de Representante Legal
							if (isset($_POST["calidad"][$key]) and $_POST["calidad"][$key]) {
								$calidad = $_POST["calidad"][$key];

								if (isset($calidad["antecedentes"]) and $calidad["antecedentes"]) {
									$Clientes->guardarDatosDocumentosMiembros($calidad["antecedentes"], "Representante Legal");
								}

								if (isset($calidad["ofac"]) and $calidad["ofac"]) {
									$Clientes->guardarDatosDocumentosMiembros($calidad["ofac"], "Representante Legal");
								}
							}
							break;

						case '2':
							if (isset($_POST["calidad"][$key]) and $_POST["calidad"][$key]) {
								$calidad = $_POST["calidad"][$key];

								if (isset($calidad["antecedentes"]) and $calidad["antecedentes"]) {
									$Clientes->guardarDatosDocumentosMiembros($calidad["antecedentes"], "Representante Legal");
								}

								if (isset($calidad["ofac"]) and $calidad["ofac"]) {
									$Clientes->guardarDatosDocumentosMiembros($calidad["ofac"], "Representante Legal");
								}
							}
							break;

						case '3': // Pestaña de Socios
							if ($_POST["calidad"][$key]) {
								$calidad = $_POST["calidad"][$key];

								if (isset($calidad["socios_antecedentes"]) and $calidad["socios_antecedentes"]) {
									$antecedentes = $calidad["socios_antecedentes"];
									foreach ($antecedentes as $key_antecedentes => $value_antecedentes) {
										if ($value_antecedentes) {
											if (isset($value_antecedentes["id_miembro"])) {
												$Clientes->guardarDatosDocumentosMiembros($value_antecedentes, "Socio");
											}
										}
									}
								}

								if (isset($calidad["socios_ofac"]) and $calidad["socios_ofac"]) {
									$ofac = $calidad["socios_ofac"];
									foreach ($ofac as $key_ofac => $value_ofac) {
										if ($value_ofac) {
											if (isset($value_ofac["id_miembro"])) {
												$Clientes->guardarDatosDocumentosMiembros($value_ofac, "Socio");
											}
										}
									}
								}
							}
							break;

						default:
							$_msg_control .= "Error en el acceso a la pestaña de Calidad\n";
							break;
					}
				}
			}

			// Se adiciona informacion de la pestaña de Ficha Técnica
			if (isset($_POST["ficha_tecnica"])) {
				$return["ficha_tecnica"] = $_POST["ficha_tecnica"];

				// Se genera el array de actualización de datos del cliente
				foreach ($_POST["ficha_tecnica"] as $key => $value) {
					if (!empty($value)) {
						foreach ($value as $key_1 => $value_1) {
							$arrayCliente[$key_1] = $value_1;
						}
					}
				}
			}

			// Se adiciona informacion de la pestaña de Finanzas
			if (isset($_POST["finanzas"])) {
				$return["finanzas"] = $_POST["finanzas"];
				$finanzas = $_POST["finanzas"];

				foreach ($finanzas as $key => $value) {
					if (!empty($value) and $key != "calificacion_cifin") {
						$arrayCliente[$key] = $value;
					}
				}

				if (isset($finanzas["calificacion_cifin"])) {
					foreach ($finanzas["calificacion_cifin"] as $key => $value) {
						if (isset($value["id_cliente_documento"]) and $value["entidad_financiera"] and $value["calificacion"]) {
							if (!$Clientes->getVerificaCifin($value["id_cliente_documento"], $value["entidad_financiera"], $value["calificacion"])) {
								$arrayCifinCalificacion = array();
								$arrayCifinCalificacion["id_cliente_documento"] = $value["id_cliente_documento"];
								$arrayCifinCalificacion["entidad_financiera"] = $value["entidad_financiera"];
								$arrayCifinCalificacion["calificacion"] = $value["calificacion"];
								$Data->setRegistro("cmx_clientes_cifin", $arrayCifinCalificacion);
							}
						}
					}
				}
			}
		}
		$arrayCliente["op_poliza_nexos"] = '';
		if (!$_POST["cod_cliente"]) {
			$arrayCliente["cod_cliente"] = 'CLI-' . $time;
		}
		if (COUNT($arrayCliente) > 0) {
			// $return["arrayCliente"] = $arrayCliente;
			$result = $Data->updateRegistro("cmx_clientes", $arrayCliente, (int) $_POST["id"]);
		}
		break;

	case 'editarClienteAdjuntos':
		$_msg_control .= "Entro en la accion editarClienteAdjuntos.\n";
		$id_cliente = $_POST["id"];

		$result = $Clientes->getClienteInfoCompleta($id_cliente);
		// Se filtra si los archivos a subir son de Aprobación del cliente o de llenado de documentos
		if (isset($_FILES["listado_documentacion_file"])) {
			// CLIENTE - Se sube el adjunto aprobacion
			if (isset($result["aprobacion"]) and $result["aprobacion"]) {
				$value = $result["aprobacion"];
				$arrayDocumento = array(
					'id_cliente' => (int) $id_cliente,
					'documento' => $value["DOC_CLIENTE"],
					'tipo_documento' => (int) $value["ID_TIPO_DOCUMENTO"],
					'fecha_expedicion' => $value["fecha_expedicion"],
				);
				$result_1 = $Clientes->setDocumentoCliente($_FILES, "listado_documentacion_file", $arrayDocumento);
			}
		} else {
			/********** SE SUBE ARCHIVOS DE LA PESTAÑA SERVICIO AL CLIENTE **********/
			// Se sube el adjunto de la Cámara de Comercio
			if (isset($result["camara_comercio"]) and isset($_FILES["cam_comercio_file"]) and $_FILES["cam_comercio_file"]["error"] == 0) {
				foreach ($result["camara_comercio"]["rowsData"] as $key => $value) {
					$arrayDocumento = array(
						'id_cliente' => (int) $id_cliente,
						'documento' => $value["DOC_CLIENTE"],
						'tipo_documento' => (int) $value["ID_TIPO_DOCUMENTO"],
						'fecha_expedicion' => $value["fecha_expedicion"],
					);
					$result_1 = $Clientes->setDocumentoCliente($_FILES, "cam_comercio_file", $arrayDocumento);
				}
			}

			// Se sube el adjunto del Representante Legal
			if (isset($result["representante_legal"]) and isset($_FILES["cam_comercio_file_representante"]) and $_FILES["cam_comercio_file_representante"]["error"] == 0) {
				foreach ($result["representante_legal"]["rowsData"] as $key_01 => $value_01) {
					$arrayDocumento = array(
						'id_miembro' => $value_01[0],
						'documento' => $value_01["DOC_CLIENTE"], // documento del cliente
						'documento_miembro' => $value_01["documento"], // documento del miembro
						'tipo_miembro' => $value_01["tipo_miembro"],
						'tipo_documento' => $value_01["folder"],
						'fecha_expedicion' => $value_01["fecha_expedicion"],
					);
					$result_1 = $Clientes->setDocumentoMiembro($_FILES, "cam_comercio_file_representante", $arrayDocumento);
				}
			}

			// Se sube el adjunto del Revisor Fiscal
			if (isset($result["revisor_fiscal"]) and isset($_FILES["cam_comercio_file_revisor"]) and $_FILES["cam_comercio_file_revisor"]["error"] == 0) {
				foreach ($result["revisor_fiscal"] as $key_01 => $value_01) {
					$arrayDocumento = array(
						'id_miembro' => $value_01["id"],
						'documento' => $value_01["DOC_CLIENTE"], // documento del cliente
						'documento_miembro' => $value_01["documento"], // documento del miembro
						'tipo_miembro' => $value_01["tipo_miembro"],
						'tipo_documento' => $value_01["folder"],
						'fecha_expedicion' => $value_01["fecha_expedicion"],
					);
					$result_1 = $Clientes->setDocumentoMiembro($_FILES, "cam_comercio_file_revisor", $arrayDocumento);
				}
			}

			// Se sube el adjunto del Estado Financiero
			if (isset($result["estado_financiero"]) and isset($_FILES["est_financ_file"])) {
				$value = $result["estado_financiero"];
				$arrayDocumento = array(
					'id_cliente' => (int) $id_cliente,
					'documento' => $value["DOC_CLIENTE"],
					'tipo_documento' => (int) $value["ID_TIPO_DOCUMENTO"],
					'fecha_expedicion' => $value["fecha_expedicion"],
				);
				$result_1 = $Clientes->setDocumentoCliente($_FILES, "est_financ_file", $arrayDocumento);
			}

			// Se sube el adjunto del Seguro
			if (isset($result["documentos"])) {
				$_flag_documento = $Clientes->buscarDocumento($result["documentos"], 19);
				if ($_flag_documento and isset($_FILES["poliza_file"])) {
					$value = $_flag_documento["content"];
					$arrayDocumento = array(
						'id_cliente' => (int) $id_cliente,
						'documento' => $value["DOC_CLIENTE"],
						'tipo_documento' => (int) $value["ID_TIPO_DOCUMENTO"],
						'fecha_expedicion' => $value["fecha_expedicion"],
					);
					$result_1 = $Clientes->setDocumentoCliente($_FILES, "poliza_file", $arrayDocumento);
				}
			}

			// Se sube los adjuntos de las Referencias Comerciales
			if (isset($result["referencias_comerciales"]) and $result["referencias_comerciales"]) {
				$i = 1;
				foreach ($result["referencias_comerciales"]["rowsData"] as $key => $value) {
					if (isset($_FILES["ref_comercial_file_" . $i]) and $_FILES["ref_comercial_file_" . $i]) {
						$arrayDocumento = array(
							'id_cliente' => (int) $id_cliente,
							'documento' => $value["DOC_CLIENTE"],
							'tipo_documento' => (int) $value["ID_TIPO_DOCUMENTO"],
							'fecha_expedicion' => $value["fecha_expedicion"],
						);
						$result_1 = $Clientes->setDocumentoCliente($_FILES, "ref_comercial_file_" . $i, $arrayDocumento);
					}
					$i++;
				}
			}

			// Se sube el adjunto de las Certificaciones
			if (isset($result["documentos"])) {
				// Certificado Basc
				if (isset($_FILES["certificacion_basc_file"])) {
					$_flag_documento = $Clientes->buscarDocumento($result["documentos"], 7);
					if ($_flag_documento) {
						$value = $_flag_documento["content"];
						$arrayDocumento = array(
							'id_cliente' => (int) $id_cliente,
							'documento' => $value["DOC_CLIENTE"],
							'tipo_documento' => (int) $value["ID_TIPO_DOCUMENTO"],
							'fecha_expedicion' => $value["fecha_expedicion"],
						);
						$result_1 = $Clientes->setDocumentoCliente($_FILES, "certificacion_basc_file", $arrayDocumento);
					}
				}

				// Certificado CT-PAT
				if (isset($_FILES["certificacion_CT_PAT_file"])) {
					$_flag_documento = $Clientes->buscarDocumento($result["documentos"], 8);
					if ($_flag_documento) {
						$value = $_flag_documento["content"];
						$arrayDocumento = array(
							'id_cliente' => (int) $id_cliente,
							'documento' => $value["DOC_CLIENTE"],
							'tipo_documento' => (int) $value["ID_TIPO_DOCUMENTO"],
							'fecha_expedicion' => $value["fecha_expedicion"],
						);
						$result_1 = $Clientes->setDocumentoCliente($_FILES, "certificacion_CT_PAT_file", $arrayDocumento);
					}
				}

				// Certificado OEA
				if (isset($_FILES["certificacion_OEA_file"])) {
					$_flag_documento = $Clientes->buscarDocumento($result["documentos"], 9);
					if ($_flag_documento) {
						$value = $_flag_documento["content"];
						$arrayDocumento = array(
							'id_cliente' => (int) $id_cliente,
							'documento' => $value["DOC_CLIENTE"],
							'tipo_documento' => (int) $value["ID_TIPO_DOCUMENTO"],
							'fecha_expedicion' => $value["fecha_expedicion"],
						);
						$result_1 = $Clientes->setDocumentoCliente($_FILES, "certificacion_OEA_file", $arrayDocumento);
					}
				}

				// Certificado ISO28000
				if (isset($_FILES["certificacion_ISO28000_file"])) {
					$_flag_documento = $Clientes->buscarDocumento($result["documentos"], 10);
					if ($_flag_documento) {
						$value = $_flag_documento["content"];
						$arrayDocumento = array(
							'id_cliente' => (int) $id_cliente,
							'documento' => $value["DOC_CLIENTE"],
							'tipo_documento' => (int) $value["ID_TIPO_DOCUMENTO"],
							'fecha_expedicion' => $value["fecha_expedicion"],
						);
						$result_1 = $Clientes->setDocumentoCliente($_FILES, "certificacion_ISO28000_file", $arrayDocumento);
					}
				}

				// Certificado ISO9001
				if (isset($_FILES["certificacion_ISO9001_file"])) {
					$_flag_documento = $Clientes->buscarDocumento($result["documentos"], 11);
					if ($_flag_documento) {
						$value = $_flag_documento["content"];
						$arrayDocumento = array(
							'id_cliente' => (int) $id_cliente,
							'documento' => $value["DOC_CLIENTE"],
							'tipo_documento' => (int) $value["ID_TIPO_DOCUMENTO"],
							'fecha_expedicion' => $value["fecha_expedicion"],
						);
						$result_1 = $Clientes->setDocumentoCliente($_FILES, "certificacion_ISO9001_file", $arrayDocumento);
					}
				}
			}

			// Se sube el adjunto de las Referncias Bancarias
			if (isset($result["bancos"]) and $result["bancos"]) {
				$i = 1;
				if (isset($_FILES["ref_bancaria_file_" . $i])) {
					foreach ($result["bancos"]["rowsData"] as $key => $value) {
						if ($_FILES["ref_bancaria_file_" . $i]["error"] == 0) {
							$arrayDocumento = array(
								'id_cliente' => (int) $id_cliente,
								'documento' => $value["DOC_CLIENTE"],
								'banco' => $value["banco"],
								'numero_cuenta' => $value["numero_cuenta"],
							);
							$result_1 = $Clientes->setBancosCliente($_FILES, "ref_bancaria_file_" . $i, $arrayDocumento);
						}
						$i++;
					}
				}
			}

			// Se sube el adjunto de los formatos BASC del cliente
			/* if (isset($result["documentos"])) {
                $array_formatos = [12, 13, 14, 23, 24, 25, 26, 27, 28, 29, 30, 31];
                foreach ($array_formatos as $key => $value) {
                    $_flag_documento = $Clientes->buscarDocumento($result["documentos"], $value);
					if(!$_flag_documento ){
						if ($_flag_documento["flag"]) {
							$_div = str_replace("-", "_", $_flag_documento["content"]["folder"]);
							if (isset($_FILES[$_div . "_file"])) {
								$value_01 = $_flag_documento["content"];
								$arrayDocumento = array(
									'id_cliente' => (int) $id_cliente,
									'documento' => $value_01["DOC_CLIENTE"],
									'tipo_documento' => (int) $value_01["ID_TIPO_DOCUMENTO"],
									'fecha_expedicion' => $value_01["fecha_expedicion"],
								);
								$result_1 = $Clientes->setDocumentoCliente($_FILES, $_div . "_file", $arrayDocumento);
							}
						}
					}
                }
            }*/


			if (isset($result["documentos"])) {
				$array_formatos = [12, 13, 14, 23, 24, 25, 26, 27, 28, 29, 30, 31];
				foreach ($array_formatos as $value) {
					$_flag_documento = $Clientes->buscarDocumento($result["documentos"], $value);

					if (!$_flag_documento) {
						if ($_flag_documento & $_flag_documento) {
							$_div = str_replace("-", "_", $_flag_documento["contenido"]["carpeta"]);
							if (isset($_FILES[$_div . "_file"])) {
								$value_01 = $_flag_documento["contenido"];
								$arrayDocumento = [
									'id_cliente' => (int) $id_cliente,
									'documento' => $value_01["DOC_CLIENTE"],
									'tipo_documento' => (int) $value_01["ID_TIPO_DOCUMENTO"],
									'fecha_expedicion' => $value_01["fecha_expedicion"],
								];
								$result_1 = $Clientes->setDocumentoCliente($_FILES, $_div . "_file", $arrayDocumento);
							}
						}
					}
				}
			}



			/********** FIN - SE SUBE ARCHIVOS DE LA PESTAÑA SERVICIO AL CLIENTE **********/

			/********** SE SUBE ARCHIVOS DE LA PESTAÑA CALIDAD **********/
			// CLIENTE - Se sube el adjunto OFAC
			if (isset($result["OFAC"]) and isset($_FILES["cliente_OFAC_file"])) {
				$value = $result["OFAC"];
				$arrayDocumento = array(
					'id_cliente' => (int) $id_cliente,
					'documento' => $value["DOC_CLIENTE"],
					'tipo_documento' => (int) $value["ID_TIPO_DOCUMENTO"],
					'fecha_expedicion' => $value["fecha_expedicion"],
				);
				$result_1 = $Clientes->setDocumentoCliente($_FILES, "cliente_OFAC_file", $arrayDocumento);
			}

			// CLIENTE - Se sube el adjunto CIFIN
			if (isset($result["CIFIN"]) and isset($_FILES["cliente_CIFIN_file"])) {
				$value = $result["CIFIN"];
				$arrayDocumento = array(
					'id_cliente' => (int) $id_cliente,
					'documento' => $value["DOC_CLIENTE"],
					'tipo_documento' => (int) $value["ID_TIPO_DOCUMENTO"],
					'fecha_expedicion' => $value["fecha_expedicion"],
				);
				$result_1 = $Clientes->setDocumentoCliente($_FILES, "cliente_CIFIN_file", $arrayDocumento);
			}

			// CLIENTE - Se sube el adjunto RUES
			if (isset($result["RUES"]) and isset($_FILES["cliente_RUES_file"])) {
				$value = $result["RUES"];
				$arrayDocumento = array(
					'id_cliente' => (int) $id_cliente,
					'documento' => $value["DOC_CLIENTE"],
					'tipo_documento' => (int) $value["ID_TIPO_DOCUMENTO"],
					'fecha_expedicion' => $value["fecha_expedicion"],
				);
				$result_1 = $Clientes->setDocumentoCliente($_FILES, "cliente_RUES_file", $arrayDocumento);
			}

			// REPRESENTANTE LEGAL - Se sube el adjunto de los Antecedentes Policiales
			if (isset($result["repres_antecedentes"]) and isset($_FILES["representante_antecedentes_file"])) {
				$value = $result["repres_antecedentes"];
				$arrayDocumento = array(
					'id_miembro' => $value["ID_MIEMBRO"],
					'documento' => $value["DOC_CLIENTE"], // documento del cliente
					'documento_miembro' => $value["documento"], // documento del miembro
					'tipo_miembro' => $value["tipo_miembro"],
					'tipo_documento' => $value["folder"],
					'fecha_expedicion' => $value["fecha_expedicion"],
				);
				$result_1 = $Clientes->setDocumentoMiembro($_FILES, "representante_antecedentes_file", $arrayDocumento);
			}

			// REPRESENTANTE LEGAL - Se sube el adjunto del OFAC
			if (isset($result["repres_OFAC"]) and isset($_FILES["representante_OFAC_file"])) {
				$value = $result["repres_OFAC"];
				$arrayDocumento = array(
					'id_miembro' => $value["ID_MIEMBRO"],
					'documento' => $value["DOC_CLIENTE"], // documento del cliente
					'documento_miembro' => $value["documento"], // documento del miembro
					'tipo_miembro' => $value["tipo_miembro"],
					'tipo_documento' => $value["folder"],
					'fecha_expedicion' => $value["fecha_expedicion"],
				);
				$result_1 = $Clientes->setDocumentoMiembro($_FILES, "representante_OFAC_file", $arrayDocumento);
			}

			// REVISOR FISCAL - Se sube el adjunto de los Antecedentes Policiales
			if (isset($result["revisor_antecedentes"]) and isset($_FILES["revisor_antecedentes_file"])) {
				$value = $result["revisor_antecedentes"];
				$arrayDocumento = array(
					'id_miembro' => $value["ID_MIEMBRO"],
					'documento' => $value["DOC_CLIENTE"], // documento del cliente
					'documento_miembro' => $value["documento"], // documento del miembro
					'tipo_miembro' => $value["tipo_miembro"],
					'tipo_documento' => $value["folder"],
					'fecha_expedicion' => $value["fecha_expedicion"],
				);
				$result_1 = $Clientes->setDocumentoMiembro($_FILES, "revisor_antecedentes_file", $arrayDocumento);
			}

			// REVISOR FISCAL - Se sube el adjunto del OFAC
			if (isset($result["revisor_OFAC"]) and isset($_FILES["revisor_OFAC_file"])) {
				$value = $result["revisor_OFAC"];
				$arrayDocumento = array(
					'id_miembro' => $value["ID_MIEMBRO"],
					'documento' => $value["DOC_CLIENTE"], // documento del cliente
					'documento_miembro' => $value["documento"], // documento del miembro
					'tipo_miembro' => $value["tipo_miembro"],
					'tipo_documento' => $value["folder"],
					'fecha_expedicion' => $value["fecha_expedicion"],
				);
				$result_1 = $Clientes->setDocumentoMiembro($_FILES, "revisor_OFAC_file", $arrayDocumento);
			}

			// SOCIOS - Se sube los adjuntos de los socios del Cliente
			if (isset($result["documentos_socios"])) {
				$i = 1;
				foreach ($result["documentos_socios"] as $key_socios => $value_socios) {
					foreach ($value_socios as $key => $value) {
						$arrayDocumento = array(
							'id_miembro' => $value["ID_MIEMBRO"],
							'documento' => $value["DOC_CLIENTE"], // documento del cliente
							'documento_miembro' => $value["documento"], // documento del miembro
							'tipo_miembro' => $value["tipo_miembro"],
							'tipo_documento' => $value["folder"],
							'fecha_expedicion' => $value["fecha_expedicion"],
						);
						switch ($key) {
							case 15:
								if (isset($_FILES["socio_OFAC_file_" . $i])) {
									$result_1 = $Clientes->setDocumentoMiembro($_FILES, "socio_OFAC_file_" . $i, $arrayDocumento);
								}
								break;

							case 16:
								if (isset($_FILES["socio_antecedentes_file_" . $i])) {
									$result_1 = $Clientes->setDocumentoMiembro($_FILES, "socio_antecedentes_file_" . $i, $arrayDocumento);
								}
								break;
						}
					}
					$i++;
				}
			}
			/********** FIN - SE SUBE ARCHIVOS DE LA PESTAÑA CALIDAD **********/
		}
		break;

	case 'formRndcEditaCliente':
		$_msg_control .= "Entro en la accion formRndcEditaCliente.\n";

		$sql = '
				SELECT cc.*,
					cm.municipio, cm.depto, cm.pais, cm.rndc_codigo_ciudad
				FROM cmx_clientes cc
					INNER JOIN cmx_municipios cm ON cm.id = cc.ciudad
				WHERE cc.id = ' . $_POST["id"];
		$result = $Data->getConsulta($sql);
		$return["response"] = $result;

		if ($result) {
			foreach ($result["rowsData"] as $key => $value) {
				$_msg_content .= '
						<strong>Información General</strong>
						<table class="table">
							<tbody>
								<tr>
									<td class="cell-detail">
										<div class="row">
											<div class="col-sm-4">
												<span>Cliente</span>
												<span class="cell-detail-description">' . $value["nombre"] . '</span>
												<span class="cell-detail-description">' . $value["documento"] . '-' . $value["digito_verificacion"] . '</span>
											</div>
											<div class="col-sm-4">
												<span>' . $value["tipo_documento"] . '</span>
												<span class="cell-detail-description">' . $value["regimen"] . '</span>
											</div>
											<div class="col-sm-4">
												<span>Ubicación</span>
												<span class="cell-detail-description">' . $value["direccion"] . '</span>
												<span class="cell-detail-description">' . $value["municipio"] . ' (' . $value["depto"] . ' - ' . $value["pais"] . ')</span>
												<span class="cell-detail-description">' . $value["indicaciones_llegada"] . '</span>
											</div>
										</div>
									</td>
								</tr>
								<tr><td></td></tr>
							</tbody>
						</table>
					';
				// Formulario de edición de contenido
				$_msg_content .= '
						<input type="hidden" id="e_id_cliente" value="' . $value[0] . '">
						<input type="hidden" id="e_documento" value="' . $value["documento"] . $value["digito_verificacion"] . '">
						<input type="hidden" id="e_rndc_municipio" value="' . $value["rndc_codigo_ciudad"] . '">
						<div class="row" >
							<div class="form-group col-xs-4">
								<label>Nombre o Razón social:</label>
								<input type="text" id="e_rndc_nombre" placeholder="Nombre o Razón social" value="' . $value["nombre"] . '" class="form-control">
							</div>
							<div class="form-group col-xs-3">
								<label>Teléfono Fijo Contacto:</label>
								<input type="text" id="e_contacto" placeholder="Teléfono Contacto" maxlength="7" value="' . $value["telefono"] . '" class="form-control">
							</div>
							<div class="form-group col-xs-5">
								<label>Correo electrónico:</label>
								<input type="text" id="e_email" placeholder="Correo electrónico" value="' . $value["email"] . '" class="form-control">
							</div>
							<div class="row"></div>
							<div class="form-group col-xs-6">
								<label>Dirección:</label>
								<input type="text" id="e_direccion" placeholder="Dirección" value="' . $value["direccion"] . '" class="form-control">
							</div>
						</div>
						<div class="row"></div>
					';
			}
		} else {
			$_msg_error .= '
					<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="message">
							<button type="button" data-dismiss="alert" aria-label="Close" class="close">
								<span aria-hidden="true" class="mdi mdi-close"></span>
							</button>
							<strong>Error!</strong>
							<p>No se encontró información del Cliente</p>
						</div>
					</div>
				';
		}
		break;

	case 'rndcEditarCliente2':
		$_msg_control .= "Entro en la accion rndcEditarCliente.\n";
		session_start();
		$fecha = date('Y-m-d');
		$hora = date('H:i:s');
		$user = $_SESSION["usuario"]["nom_usuario"];
		/******** INSERCION DE CONTENIDO DEL CLIENTE EN EL RNDC  ********/
		$arrayMinTrans2 = array();
		// Solicitud
		$arrayMinTrans2["solicitud"] = array(
			"tipo" => 1,
			"procesoid" => 11,
		);
		$arrayMinTrans2["variables"] = "INGRESOID"; //CONSULTA EN EL MINISTERIO
		$documento_tercero = $_POST["documento"];
		if ($_POST["tipo_documento"] == "Juridico") {
			$documento_tercero = $_POST["documento"] . $_POST["digito"];
			$tp = "NIT";
		} else {
			$documento_tercero = $_POST["documento"];
			$tp = "Cedula de Ciudadania";
		}
		$arrayMinTrans2["documento"] = array(
			"NUMNITEMPRESATRANSPORTE" => MINTRANS_NIT,
			"CODTIPOIDTERCERO" => $Data->getRNDCTipoDocumento($tp),
			"NUMIDTERCERO" => "'" . $documento_tercero . "'",

		);
		$return["verifica_tercero_array"] = $arrayMinTrans2;
		$result2 = $Data->getRNDCQueryArray($arrayMinTrans2);
		$return["verifica_tercero_result"] = $result2;
		//Buscar ciudad
		$result2 = $Clientes->getCiudadById($_POST["municipio"]);
		if ($result2) {
			$municipio = $result2['rowsData'][0]['rndc_codigo_ciudad'] . 1;
		}


		if (isset($result2["ErrorMSG"])) {


			$arrayMinTrans = array();
			// Solicitud
			$arrayMinTrans["solicitud"] = array(
				"tipo" => 1,
				"procesoid" => 11,
			);
			$arrayMinTrans["variables"] = array(
				"NUMNITEMPRESATRANSPORTE" => MINTRANS_NIT,
				"CODTIPOIDTERCERO" => $Data->getRNDCTipoDocumento($tp),
				"NUMIDTERCERO" => $documento_tercero,
				"NOMIDTERCERO" => $_POST["rndc_nombre"],
				"NOMENCLATURADIRECCION" => $_POST["direccion"],
				"CODMUNICIPIORNDC" => $municipio,
			);
			$arrayMinTrans["variables"]["CODSEDETERCERO"] = $_POST["id_sede"];
			$arrayMinTrans["variables"]["NOMSEDETERCERO"] = $_POST["namesede"];
			$cadena = implode(",", $arrayMinTrans["variables"]);
			$result = $Data->getRNDCQueryArray($arrayMinTrans);
			$return["edita_cliente_result"] = $result;
			if (isset($result["ErrorMSG"])) {
				$_msg_error .= "<p><strong>Registro no actualizado en RNDC - Cliente.</strong></p>";
				$_msg_error .= $result["ErrorMSG"];
				$sql3 = "INSERT INTO web_service_rndc(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)VALUES(null,'" . $_POST["documento"] . "','Tercero',0,1,'" . $cadena . "','" . $fecha . "','" . $hora . "','" . $user . "','" . $result["ErrorMSG"] . "','Remitente','Actualizar')";
				$Data->ejecuteRegistro($sql3);
			} else {
				$rndc_ingresoid = $result["ingresoid"];
				$sql3 = "INSERT INTO web_service_rndc(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)VALUES(null,'" . $_POST["documento"] . "','Tercero',1,1,'" . $cadena . "','" . $fecha . "','" . $hora . "','" . $user . "','" . $result["ingresoid"] . "','Remitente','Actualizar')";
				$Data->ejecuteRegistro($sql3);
				$return["edita_cliente_id_crea"] = $rndc_ingresoid;
			}
		} else {


			$arrayMinTrans = array();
			// Solicitud
			$arrayMinTrans["solicitud"] = array(
				"tipo" => 1,
				"procesoid" => 11,
			);
			$arrayMinTrans["variables"] = array(
				"NUMNITEMPRESATRANSPORTE" => MINTRANS_NIT,
				"CODTIPOIDTERCERO" => $Data->getRNDCTipoDocumento($tp),
				"NUMIDTERCERO" => $documento_tercero,
				"NOMIDTERCERO" => $_POST["rndc_nombre"],
				"NOMENCLATURADIRECCION" => $_POST["direccion"],
				"CODMUNICIPIORNDC" => $municipio,
			);
			$arrayMinTrans["variables"]["CODSEDETERCERO"] = $_POST["id_sede"];
			$arrayMinTrans["variables"]["NOMSEDETERCERO"] = $_POST["namesede"];
			$cadena = implode(",", $arrayMinTrans["variables"]);
			$result = $Data->getRNDCQueryArray($arrayMinTrans);
			$return["edita_cliente_result"] = $result;
			if (isset($result["ErrorMSG"])) {
				$_msg_error .= "<p><strong>Registro no actualizado en RNDC - Cliente.</strong></p>";
				$_msg_error .= $result["ErrorMSG"];
				/* $sql3 = "INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)VALUES(null,'" . $_POST["documento"] . "','Tercero',0,1,'" . $cadena . "','" . $fecha . "','" . $hora . "','" . $user . "','" . $result["ErrorMSG"] . "','Remitente','Actualizar')";
               
                $Data->ejecuteRegistro($sql3);*/
			} else {
				$rndc_ingresoid = $result["ingresoid"];
				/*  $sql3 = "INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)VALUES(null,'" . $_POST["documento"] . "','Tercero',1,1,'" . $cadena . "','" . $fecha . "','" . $hora . "','" . $user . "','" . $result["ingresoid"] . "','Remitente','Actualizar')";
            	
                $Data->ejecuteRegistro($sql3);
                $return["edita_cliente_id_crea"] = $rndc_ingresoid;*/
			}
		}
		/******** FIN - INSERCIÓN DE CONTENIDO DEL CLIENTE EN EL RNDC  ********/
		// Se actualiza la información del Cliente
		if (!$_msg_error) {
			$sql = "UPDATE cmx_clientes SET
					rndc_id=" . $rndc_ingresoid . ",
					direccion='" . $_POST["direccion"] . "',
					telefono=" . $_POST["contacto"] . ",
					email='" . $_POST["email"] . "'
					WHERE documento=" . $_POST["documento"];
			$Data->ejecuteRegistro($sql);
		}
		break;

	case 'rndcEditarCliente':
		$_msg_control .= "Entro en la accion rndcEditarCliente.\n";

		/******** INSERCION DE CONTENIDO DEL CLIENTE EN EL RNDC  ********/
		$arrayMinTrans = array();
		// Solicitud
		$arrayMinTrans["solicitud"] = array(
			"tipo" => 1,
			"procesoid" => 11,
		);

		//registra en tabla del ministerio
		session_start();
		$fecha = date('Y-m-d');
		$hora = date('H:i:s');
		$user = $_SESSION["usuario"]["nom_usuario"];

		//CONSULTA EN EL MINISTERIO
		$arrayMinTrans["variables"] = "INGRESOID";
		$documento_tercero = $_POST["documento"];
		if ($_POST["tipo_documento"] == "Juridico") {
			$documento_tercero = $_POST["documento"] . $_POST["digito"];
			$tp = "NIT";
		} else {
			$documento_tercero = $_POST["documento"];
			$tp = "Cedula de Ciudadania";
		}
		$arrayMinTrans["documento"] = array(
			"NUMNITEMPRESATRANSPORTE" 	=> MINTRANS_NIT,
			"CODTIPOIDTERCERO" 			=>	$Data->getRNDCTipoDocumento($tp),
			"NUMIDTERCERO"				=> "'" . $documento_tercero . "'"

		);
		$return["verifica_tercero_array"] = $arrayMinTrans;
		$result = $Data->getRNDCQueryArray($arrayMinTrans);
		$return["verifica_tercero_result"] = $result;
		//Buscar ciudad
		$result = $Clientes->getCiudadById($_POST["municipio"]);
		if ($result) {
			$municipio = $result['rowsData'][0]['rndc_codigo_ciudad'] . 1;
		}

		//buscar la sede del cliente
		$result_sede = $Clientes->getSedeClienteE($_POST["tipo_documento"], $_POST["documento"], $_POST["digito"]);
		if ($result_sede) {
			$sede = $result_sede['rowsData'][0]['codigo_sede'];
		}
		if (isset($result["ErrorMSG"])) { //No existe cliente RNDC
			// Variable que se envían para la realizació del proceso 
			$arrayMinTrans["variables"] = array(
				"NUMNITEMPRESATRANSPORTE"	=> MINTRANS_NIT,
				"CODTIPOIDTERCERO"			=> $Data->getRNDCTipoDocumento($tp),
				"NUMIDTERCERO"				=> $documento_tercero,
				"NOMIDTERCERO"				=> $_POST["rndc_nombre"],
				"NOMENCLATURADIRECCION"		=> $_POST["direccion"],
				// "LATITUD"					=> substr($_POST["latitud"], 0 , 15),
				// "LONGITUD"					=> substr($_POST["longitud"], 0, 15),
				"CODMUNICIPIORNDC"			=> $municipio,
			);
			$arrayMinTrans["variables"]["CODSEDETERCERO"] = $sede;
			$arrayMinTrans["variables"]["NOMSEDETERCERO"] = $_POST["namesede"];
			// $return["edita_cliente_array"] = $arrayMinTrans;
			$cadena = implode(",", $arrayMinTrans["variables"]);
			/*$sql2="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena,fecha,hora,usuario,tipo_tercero,accion)VALUES(null,'".$_POST["documento"]."','Tercero',1,1,'".$cadena."','".$fecha."','".$hora."','".$user."','Cliente','Crear')";
				$Data->ejecuteRegistro($sql2);*/
			// Se ejecuta la consulta hacia el RNDC del ministerio de transporte 
			$result = $Data->getRNDCQueryArray($arrayMinTrans);
			$return["edita_cliente_result"] = $result;
			// Se valida si la operación fue exitosa
			if (isset($result["ErrorMSG"])) {
				$_msg_error .= "<p><strong>Registro no actualizado en RNDC - Cliente.</strong></p>";
				$_msg_error .= $result["ErrorMSG"];
				$sql3 = "INSERT INTO web_service_rndc(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)VALUES(null,'" . $_POST["documento"] . "','Tercero',0,1,'" . $cadena . "','" . $fecha . "','" . $hora . "','" . $user . "','" . $result["ErrorMSG"] . "','Remitente','Actualizar')";
				$Data->ejecuteRegistro($sql3);
			} else {
				$rndc_ingresoid = $result["ingresoid"];
				$sql3 = "INSERT INTO web_service_rndc(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)VALUES(null,'" . $_POST["documento"] . "','Tercero',1,1,'" . $cadena . "','" . $fecha . "','" . $hora . "','" . $user . "','" . $result["ingresoid"] . "','Remitente','Actualizar')";
				$Data->ejecuteRegistro($sql3);
				$return["edita_cliente_id_crea"] = $rndc_ingresoid;
			}
		} else { //Existe cliente RNDC
			// Variable que se envían para la realizació del proceso 
			if ($_POST["tipo_documento"] == "Juridico") {
				$documento_tercero = $_POST["documento"] . $_POST["digito"];
				$tp = "NIT";
			} else {
				$documento_tercero = $_POST["documento"];
				$tp = "Cedula de Ciudadania";
			}
			//Buscar ciudad
			$result = $Clientes->getCiudadById($_POST["municipio"]);
			if ($result) {
				$municipio = $result['rowsData'][0]['rndc_codigo_ciudad'];
			}

			//buscar la sede del cliente
			$result_sede = $Clientes->getSedeClienteE($_POST["tipo_documento"], $_POST["documento"], $_POST["digito"]);
			if ($result_sede) {
				$sede = $result_sede['rowsData'][0]['codigo_sede'];
			}
			$arrayMinTrans["variables"] = array(
				"NUMNITEMPRESATRANSPORTE"	=> MINTRANS_NIT,
				"CODTIPOIDTERCERO"			=> $Data->getRNDCTipoDocumento($tp),
				"NUMIDTERCERO"				=> $documento_tercero,
				"NOMIDTERCERO"				=> $_POST["rndc_nombre"],
				"NOMENCLATURADIRECCION"		=> $_POST["direccion"],
				"CODMUNICIPIORNDC"			=> $municipio,
			);
			$arrayMinTrans["variables"]["CODSEDETERCERO"] = $sede;
			$arrayMinTrans["variables"]["NOMSEDETERCERO"] = $_POST["namesede"];
			// $return["edita_cliente_array"] = $arrayMinTrans;
			$cadena = implode(",", $arrayMinTrans["variables"]);
			/*$sql2="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena,fecha,hora,usuario,tipo_tercero,accion)VALUES(null,'".$_POST["documento"]."','Tercero',1,1,'".$cadena."','".$fecha."','".$hora."','".$user."','Cliente','Actualizar')";
				// Se ejecuta la consulta hacia el RNDC del ministerio de transporte */
			$result = $Data->getRNDCQueryArray($arrayMinTrans);
			$return["edita_cliente_result"] = $result;

			// Se valida si la operación fue exitosa

			if (isset($result["ErrorMSG"])) {
				$sql3 = "INSERT INTO web_service_rndc(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)VALUES(null,'" . $_POST["documento"] . "','Tercero',0,1,'" . $cadena . "','" . $fecha . "','" . $hora . "','" . $user . "','" . $result["ErrorMSG"] . "','Remitente','Actualizar')";
				$Data->ejecuteRegistro($sql3);
				$_msg_error .= "<p><strong>Registro no actualizado en RNDC - Cliente.</strong></p>";
				$_msg_error .= $result["ErrorMSG"];
			} else {
				$rndc_ingresoid = $result["ingresoid"];
				$sql3 = "INSERT INTO web_service_rndc(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)VALUES(null,'" . $_POST["documento"] . "','Tercero',1,1,'" . $cadena . "','" . $fecha . "','" . $hora . "','" . $user . "','" . $result["ingresoid"] . "','Remitente','Actualizar')";
				$Data->ejecuteRegistro($sql3);
				$return["edita_cliente_id_crea"] = $rndc_ingresoid;
			}
		}
		/******** FIN - INSERCIÓN DE CONTENIDO DEL CLIENTE EN EL RNDC  ********/
		// Se actualiza la información del Cliente
		if (!$_msg_error) {
			$sql = "UPDATE cmx_clientes SET
					rndc_id=" . $rndc_ingresoid . ",
					direccion='" . $_POST["direccion"] . "',
					telefono=" . $_POST["contacto"] . ",
					email='" . $_POST["email"] . "'
					WHERE documento=" . $_POST["documento"];
			$Data->ejecuteRegistro($sql);
		}
		break;

	case 'verRemiDestId':
		$_msg_control .= "Entro en la accion verRemiDestId.\n";

		$sql = '
				SELECT crd.*,
					cm.municipio, cm.depto, cm.pais, cm.rndc_codigo_ciudad,
					CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") CIUDAD_REMI_DEST,
					cc.nombre NOM_CLIENTE
				FROM cmx_remitente_destinatario crd
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					INNER JOIN cmx_clientes cc ON cc.id = crd.id_cliente
				WHERE crd.id = ' . $_POST["id"] . '
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
				"INGRESOID" => $result["rowsData"][0]["rndc_id"],
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

	case 'verRemiDestDoc':
		$_msg_control .= "Entro en la accion verRemiDestDoc.\n";

		$sql = '
				SELECT crd.*,
					cm.municipio, cm.depto, cm.pais, cm.rndc_codigo_ciudad,
					CONCAT(cm.municipio, " (", cm.depto, " - ", cm.pais, ")") CIUDAD_REMI_DEST,
					cc.nombre NOM_CLIENTE
				FROM cmx_remitente_destinatario crd
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					INNER JOIN cmx_clientes cc ON cc.id = crd.id_cliente
				WHERE crd.documento = ' . $_POST["doc_remi_dest"] . '
			;';
		$result = $Data->getConsulta($sql);

		$return["response"] = $result;
		break;

	case 'rndcGuardaRemitente':
		$_msg_control .= "Entro en la accion rndcGuardaRemitente.\n";
		/******** INSERCION DE CONTENIDO DEL TERCERO EN EL RNDC  ********/
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
			$documento_tercero = $_POST["documento"] . $_POST["digito_verificacion"];
		}

		$arrayMinTrans["documento"] = array(
			"NUMNITEMPRESATRANSPORTE" => MINTRANS_NIT,
			"NUMIDTERCERO" => "'" . $documento_tercero . "'",
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
				"NUMIDTERCERO" => $_POST["documento"],
				"NOMIDTERCERO" => $_POST["rndc_nombre"],
				"NOMENCLATURADIRECCION" => $_POST["direccion"],
				"LATITUD" => substr($_POST["latitud"], 0, 15),
				"LONGITUD" => substr($_POST["longitud"], 0, 15),
				"CODMUNICIPIORNDC" => $_POST["rndc_id_municipio"],
			);

			$arrayMinTrans["variables"]["NUMIDTERCERO"] = $_POST["documento"];
			// Se busca cual es el siguiente id del la tabla de cmx_remitentes_destinatarios para asignarlo como el codigo de sede del tercero en el RNDC
			$sql = 'SELECT (MAX(id)+1) FROM cmx_remitente_destinatario';
			$result = $Data->getConsulta($sql);
			$arrayMinTrans["variables"]["CODSEDETERCERO"] = $result["rowsData"][0][0];
			$arrayMinTrans["variables"]["NOMSEDETERCERO"] = $_POST["sigla"];

			if ($_POST["tipo_documento"] == "NIT") {
				$arrayMinTrans["variables"]["NUMIDTERCERO"] = $_POST["documento"] . $_POST["digito_verificacion"];
			}

			if (isset($_POST["primer_apellido"])) {
				$arrayMinTrans["variables"]["PRIMERAPELLIDOIDTERCERO"] = $_POST["primer_apellido"];
			}
			if (isset($_POST["segundo_apellido"]) and $_POST["segundo_apellido"] != "") {
				$arrayMinTrans["variables"]["SEGUNDOAPELLIDOIDTERCERO"] = $_POST["segundo_apellido"];
			}
			if (isset($_POST["contacto"]) and $_POST["contacto"] != "" and $_POST["contacto"] != 0) {
				$arrayMinTrans["variables"]["NUMTELEFONOCONTACTO"] = $_POST["contacto"];
			}
			if (isset($_POST["celular"]) and $_POST["celular"] != "" and $_POST["celular"] != 0) {
				$arrayMinTrans["variables"]["NUMCELULARPERSONA"] = $_POST["celular"];
			}
			$return["crea_tercero_array"] = $arrayMinTrans;

			// Se ejecuta la consulta hacia el RNDC del ministerio de transporte
			$result = $Data->getRNDCQueryArray($arrayMinTrans);
			$return["crea_tercero_result"] = $result;

			// Se valida si la operación fue exitosa
			if (isset($result["ErrorMSG"])) {
				$_msg_error .= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
				$_msg_error .= $result["ErrorMSG"];
			} else {
				$rndc_ingresoid = $result["ingresoid"];
				$return["crea_tercero_id_crea"] = $rndc_ingresoid;
			}
		} else {
			$_msg_error .= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
			$_msg_error .= "<p>Registro ya existe en el RNDC</p>";
		}
		/******** FIN - INSERCION DE CONTENIDO DEL TERCERO EN EL RNDC  ********/
		break;

	case 'rndcEditaRemitente':
		$_msg_control .= "Entro en la accion rndcEditaRemitente.\n";

		/******** INSERCION DE CONTENIDO DEL TERCERO EN EL RNDC  ********/
		$arrayMinTrans = array();
		// Solicitud
		$arrayMinTrans["solicitud"] = array(
			"tipo" => 1,
			"procesoid" => 11,
		);
		// Variable que se envían para la realizació del proceso
		$arrayMinTrans["variables"] = array(
			"NUMNITEMPRESATRANSPORTE" => MINTRANS_NIT,
			"CODTIPOIDTERCERO" => $Data->getRNDCTipoDocumento($_POST["tipo_documento"]),
			"NUMIDTERCERO" => $_POST["documento"],
			"NOMIDTERCERO" => $_POST["rndc_nombre"],
			"NOMENCLATURADIRECCION" => $_POST["direccion"],
			"LATITUD" => substr($_POST["latitud"], 0, 15),
			"LONGITUD" => substr($_POST["longitud"], 0, 15),
			"CODMUNICIPIORNDC" => $_POST["rndc_id_municipio"],
		);

		$arrayMinTrans["variables"]["NUMIDTERCERO"] = $_POST["documento"];
		$arrayMinTrans["variables"]["CODSEDETERCERO"] = $_POST["id_remi_dest"];
		$arrayMinTrans["variables"]["NOMSEDETERCERO"] = $_POST["sigla"];

		if ($_POST["tipo_documento"] == "NIT") {
			$arrayMinTrans["variables"]["NUMIDTERCERO"] = $_POST["documento"] . $_POST["digito_verificacion"];
		}

		if (isset($_POST["primer_apellido"])) {
			$arrayMinTrans["variables"]["PRIMERAPELLIDOIDTERCERO"] = $_POST["primer_apellido"];
		}
		if (isset($_POST["segundo_apellido"]) and $_POST["segundo_apellido"] != "") {
			$arrayMinTrans["variables"]["SEGUNDOAPELLIDOIDTERCERO"] = $_POST["segundo_apellido"];
		}
		if (isset($_POST["contacto"]) and $_POST["contacto"] != "" and $_POST["contacto"] != 0) {
			$arrayMinTrans["variables"]["NUMTELEFONOCONTACTO"] = $_POST["contacto"];
		}
		if (isset($_POST["celular"]) and $_POST["celular"] != "" and $_POST["celular"] != 0) {
			$arrayMinTrans["variables"]["NUMCELULARPERSONA"] = $_POST["celular"];
		}
		// $return["edita_tercero_array"] = $arrayMinTrans;

		// Se ejecuta la consulta hacia el RNDC del ministerio de transporte
		$result = $Data->getRNDCQueryArray($arrayMinTrans);
		// $return["edita_tercero_result"] = $result;

		// Se valida si la operación fue exitosa
		if (isset($result["ErrorMSG"])) {
			$_msg_error .= "<p><strong>Registro no actualizado en RNDC - Tercero.</strong></p>";
			$_msg_error .= $result["ErrorMSG"];
		} else {
			$rndc_ingresoid = $result["ingresoid"];
			// $return["edita_tercero_id_crea"] = $rndc_ingresoid;
		}
		/******** FIN - INSERCION DE CONTENIDO DEL TERCERO EN EL RNDC  ********/

		// Se actualiza la indformación del Remitente/Destinatario
		if (!$_msg_error) {
			$array = array();

			$array["rndc_id"] = $rndc_ingresoid;
			$array["tipo_documento"] = $_POST["tipo_documento"];
			$array["nombre"] = $_POST["nombre"];
			$array["sigla"] = $_POST["sigla"];
			$array["codigo_postal"] = $_POST["codigo_postal"];
			$array["direccion"] = $_POST["direccion"];
			$array["latitud"] = $_POST["latitud"];
			$array["longitud"] = $_POST["longitud"];
			$array["contacto"] = $_POST["contacto"];
			$array["celular"] = $_POST["celular"];
			$array["como_llegar"] = $_POST["como_llegar"];
			$array["descripcion_actividad"] = $_POST["descripcion_actividad"];
			$array["dias_atencion"] = $_POST["dias_atencion"];
			$array["horario_atencion"] = $_POST["horario_atencion"];

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
		break;

	case 'verContratos':
		$_msg_control .= "Entro en la accion verContratos.\n";
		$id_perfil = $_POST["id_perfil"];

		$result = $Clientes->getContratosCliente($_POST["id"]);
		if ($result["contratos"]) {
			$_msg_content .= '
					<h3>Lista de Contratos</h3>
					<div id="accordion" class="panel-group accordion">
				';
			foreach ($result["contratos"] as $key => $value) {
				// Se establece el contenido de la persiana dependiendo el estado del contrato
				$_form_edita = "";
				$_actions = "";
				$_flag_edita = false;
				if ($id_perfil == 1 or $id_perfil == 13 or $id_perfil == 22) {
					$_flag_edita = true;
				}

				switch ($value["estado"]) {
					case '0':
						$_panel_color = "danger";
						if ($_flag_edita) {
							$_actions = '
									<div class="tools">
					 					<a href="javascript:" onclick="cambiaEstadoContrato(' . $value["id"] . ', 4, ' . $_POST["id"] . ')" class="cell-detail hint--top-left" data-hint="Borrar Contrato">
					 						<span class="icon mdi mdi-delete"></span>
					 					</a>
									</div>
									<div class="tools">
					 					<a href="javascript:" onclick="cambiaEstadoContrato(' . $value["id"] . ', 1, ' . $_POST["id"] . ')" class="cell-detail hint--top-left" data-hint="Activar Contrato">
					 						<span class="icon mdi mdi-check-circle"></span>
					 					</a>
									</div>
								';
						}
						break;

					case '1':
						$_panel_color = "success";
						if ($_flag_edita) {
							$_actions = '
									<div class="tools">
					 					<a href="javascript:" onclick="cambiaEstadoContrato(' . $value[0] . ', 4, ' . $_POST["id"] . ')" class="cell-detail hint--top-left" data-hint="Borrar Contrato">
					 						<span class="icon mdi mdi-delete"></span>
					 					</a>
									</div>
									<div class="tools">
					 					<a href="javascript:" onclick="cambiaEstadoContrato(' . $value[0] . ', 0, ' . $_POST["id"] . ')" class="cell-detail hint--top-left" data-hint="Anular Contrato">
					 						<span class="icon mdi mdi-close-circle"></span>
					 					</a>
									</div>
								';
						}
						break;

					case '2':
						/***** Se valida si la información del contrato está completa *****/
						$_flag_btn = false;
						// Se valida si tiene asignado el porcentaje de ganancia
						$_form_edita_ganacia = "";
						if (!$value["porcentaje_ganancia"]) {
							$_flag_btn = true;
							$_form_edita_ganacia .= '
									<div class="form-group col-xs-12 col-sm-2 col-md-2">
										<label>(*) % Ganancia:</label>
										<input type="number" name="e_porcentaje_ganancia" id="e_porcentaje_ganancia" min="0" class="form-control input-sm porcentaje_ganancia" placeholder="% Ganancia">
									</div>
								';
						}

						// Se valida si los vehículos tienen asiganada la tarifa
						$_form_flete_maximo = "";
						if (isset($result["tipos_vehiculo"][$value["id"]])) {
							foreach ($result["tipos_vehiculo"][$value["id"]] as $key_01 => $value_01) {
								if (!$value_01["flete_maximo"]) {
									$_flag_btn = true;
									$_form_flete_maximo .= '
											<div class="form-group col-xs-12 col-sm-5 col-md-5">
												<label>(*) <strong>' . $value_01["nombre"] . '</strong> Valor Flete Máximo:</label>
												<input type="text" name="e_valor_flete_maximo" id="e_valor_flete_maximo_' . $value_01["id"] . '" class="form-control input-sm valor_flete_maximo" onload="getFormatoNumeroDecimal(this)" onkeyup="getFormatoNumeroDecimal(this)" onchange="getFormatoNumeroDecimal(this)" placeholder="Valor Flete Máximo - ' . $value_01["nombre"] . '" data-id="' . $value_01["id"] . '">
											</div>
										';
								}
							}
						}

						$btn_edita = "";
						$_form_edita = "";
						if ($_flag_btn) {
							$_form_edita = '
									<div class="form-group col-xs-12 col-sm-12 col-md-12 edita_contrato">
										' . $_form_edita_ganacia . $_form_flete_maximo . '
										<div class="form-group col-xs-12 col-sm-12 col-md-12 text-center">
											<button type="button" class="btn btn-success md-close btn_actualiza_contrato_cliente" data-id="' . $value[0] . '" data-contrato="' . $value["cod_contrato"] . '">Guardar</button>
										</div>
									</div>
								';
						}
						/***** Se valida si la información del contrato está completa *****/

						$_panel_color = "warning";
						// Se valida si se debe actualizar el estado del contrato
						$_actions = '';
						if (!$_flag_btn) {
							if ($_flag_edita) {
								$_actions = '
										<div class="tools">
						 					<a href="javascript:" onclick="cambiaEstadoContrato(' . $value["id"] . ', 4, ' . $_POST["id"] . ')" class="cell-detail hint--top-left" data-hint="Borrar Contrato">
						 						<span class="icon mdi mdi-delete"></span>
						 					</a>
										</div>
										<div class="tools">
						 					<a href="javascript:" onclick="cambiaEstadoContrato(' . $value["id"] . ', 0, ' . $_POST["id"] . ')" class="cell-detail hint--top-left" data-hint="Rechazar Contrato">
						 						<span class="icon mdi mdi-close-circle"></span>
						 					</a>
										</div>
										<div class="tools">
						 					<a href="javascript:" onclick="cambiaEstadoContrato(' . $value["id"] . ', 1, ' . $_POST["id"] . ')" class="cell-detail hint--top-left" data-hint="Validar Contrato">
						 						<span class="icon mdi mdi-check-circle"></span>
						 					</a>
										</div>
									';
							}
						}
						break;
				}
				$_actions .= '
						<div class="tools">
		 					<a href="' . BASE_URL . 'public/files/clientes/' . $value["documento"] . '/contratos/' . $value["url"] . '" target="_blank" class="cell-detail hint--top-left" data-hint="Descargar Contrato">
		 						<span class="icon mdi mdi-download"></span>
		 					</a>
						</div>
					';

				// Se buscan los origenes del contrato
				$_tipo_vehiculo_content = '';
				if (isset($result["tipos_vehiculo"][$value["id"]])) {
					$_tipo_vehiculo_content .= '<span>Tipos de vehículo</span>';
					$_vehiculos = '';
					$_flag_primero = true;
					foreach ($result["tipos_vehiculo"][$value["id"]] as $key_01 => $value_01) {
						$_tipo_vehiculo_content .= '<span class="cell-detail-description"><strong>' . $value_01["nombre"] . '</strong> $' . number_format($value_01["flete_maximo"], 0, ",", ".") . '</span>';
					}
					$_tipo_vehiculo_content .= '<span class="cell-detail-description">' . $_vehiculos . '</span>';
				}

				// Se buscan las condiciones del contrato
				$_condiciones_content = '';
				if (isset($result["condiciones"][$value["id"]])) {
					foreach ($result["condiciones"][$value["id"]] as $key_01 => $value_01) {
						$_condiciones_content .= '
								<div class="form-group col-xs-12 col-sm-6 col-md-4">
									<span>' . $value_01["nombre"] . '</span>
									<span class="cell-detail-description">' . $value_01["descripcion"] . '</span>
								</div>
							';
					}
				}

				// Se buscan los origenes del contrato
				$_origenes_title = '';
				$_origenes_content = '';
				if (isset($result["cargues"][$value["id"]])) {
					$_origenes_content .= '<span>Orígenes</span>';
					$_flag_primero = true;
					foreach ($result["cargues"][$value["id"]] as $key_01 => $value_01) {
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
				if (isset($result["descargues"][$value["id"]])) {
					$_destinos_content .= '<span>Destinos</span>';
					$_flag_primero = true;
					foreach ($result["descargues"][$value["id"]] as $key_01 => $value_01) {
						$_destinos_content .= '<span class="cell-detail-description">' . $value_01["MUNICIPIO"] . '</span>';
						if ($_flag_primero) {
							$_flag_primero = false;
							$_destinos_title .= 'Destino: ' . $value_01["CIUDAD"];
						} else {
							$_destinos_title .= ' - ' . $value_01["CIUDAD"];
						}
					}
				}

				// Se verifica si el contrato sigue vigente
				$_fecha_color = "";
				if (date('Y-m-d', $time) > $value["fecha_fin"]) {
					$_fecha_color = 'class="text-danger"';
					$_panel_color = 'danger';
				}

				$_msg_content .= '
						<div class="panel panel-default panel-border-color panel-border-color-' . $_panel_color . '">
							<div class="panel-heading">
								' . $_actions . '
								<h4 class="panel-title">
									<a data-toggle="collapse" data-parent="#accordion" href="#collapse_contrato_' . $value["id"] . '" class="collapsed" aria-expanded="false">
										<i class="icon mdi mdi-chevron-down"></i> ' . $value["cod_contrato"] . ' | <small>' . $value["nombre"] . '</small> | <small>Vence: <strong ' . $_fecha_color . '>' . $value["fecha_fin"] . '</strong></small>
										<span class="panel-subtitle">' . $_origenes_title . '</span>
										<span class="panel-subtitle">' . $_destinos_title . '</span>
									</a>
								</h4>
							</div>
							<div id="collapse_contrato_' . $value["id"] . '" class="panel-collapse collapse" aria-expanded="false">
								<div class="panel-body">
									<div class="col-xs-12 col-sm-12 col-md-12">
										<strong>Información del Contrato</strong>
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
														<div class="form-group col-xs-12 col-sm-6 col-md-4">
															<span>% Ganancia</span>
															<span class="cell-detail-description">' . $value["porcentaje_ganancia"] . '%</span>
														</div>
														<div class="form-group col-xs-12 col-sm-6 col-md-4">
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
										' . $_form_edita . '
									</div>
								</div>
							</div>
						</div>
					';
			}
			$_msg_content .= '
					</div>
				';
		} else {
			$_msg_content .= '
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
		}
		break;

	case 'crearContrato':
		$_msg_control .= "Entro en la accion crearContrato.\n";
		if ($_FILES["url"]["error"] == 0) {
			$cod_contrato = 'CTR-' . $time;

			$tmp_file = $_FILES["url"]["tmp_name"];
			$extension = $Clientes->get_extension_archivo($_FILES["url"]["name"]);
			$archivo_temporal = "../public/files/tmp/tmp_file." . $extension;
			if (move_uploaded_file($tmp_file, $archivo_temporal)) {
				// Se crean las carpetas de destino del archivo
				$carpeta_destino = "../public/files/clientes/" . $_POST["documento"] . "/contratos";
				if (!file_exists($carpeta_destino)) {
					mkdir($carpeta_destino, 0777, true);
					// print_r("Si se pudo crear la carpeta \n");
				}

				$archivo_destino = $cod_contrato . "." . $extension;
				$destino = $carpeta_destino . "/" . $archivo_destino;

				if (copy($archivo_temporal, $destino)) {
					// Se adiciona el Contrato
					$array_valor = explode(",", $_POST["valor"]);
					$_valor = str_replace(".", "", $array_valor[0]);

					$array = array(
						'cod_contrato' => $cod_contrato,
						'id_cliente' => $_POST["id"],
						'tipo_contrato' => $_POST["id_tipo_contrato"],
						'valor' => $_valor,
						'porcentaje_ganancia' => $_POST["porcentaje_ganancia"],
						'fecha_inicio' => $_POST["fecha_inicio"],
						'fecha_fin' => $_POST["fecha_fin"],
						'url' => $archivo_destino,
					);
					$result = $Data->setRegistro("cmx_contrato_cliente", $array);

					if ($result) {
						// Se adicionan los origenes
						$array_origenes = explode(",", $_POST["origenes"]);
						if (count($array_origenes) > 0) {
							foreach ($array_origenes as $value) {
								$array = array(
									'id_contrato' => $result,
									'id_ciudad' => $value,
									'tipo_tramo' => "Cargue",
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
									'id_contrato' => $result,
									'id_ciudad' => $value,
									'tipo_tramo' => "Descargue",
								);
								$array_destinos_1[] = $array;
								$Data->setRegistro("cmx_contrato_tramos", $array);
							}
						}

						// Se adicionan los vehículos
						$array_vehiculos = explode(",", $_POST["tipos_vehiculo"]);
						if (count($array_vehiculos) > 0) {
							foreach ($array_vehiculos as $value) {
								$array_valor = explode(",", $_POST["flete_maximo_" . $value]);
								$_flete_maximo = str_replace(".", "", $array_valor[0]);

								$array = array(
									'id_contrato' => $result,
									'id_vehiculo' => $value,
									'flete_maximo' => $_flete_maximo,
								);
								$array_vehiculos_1[] = $array;
								$Data->setRegistro("cmx_contrato_vehiculo", $array);
							}
						}

						// Se adicionan las condiciones
						$array_condiciones = explode(",", $_POST["id_condiciones"]);
						if (count($array_condiciones) > 0) {
							foreach ($array_condiciones as $value) {
								if ($value) {
									$array = array(
										'id_contrato' => $result,
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
		}
		break;

	case 'ajustarContrato':
		$_msg_control .= "Entro en la accion ajustarContrato.\n";
		// Se actualiza el valor del porcentaje de ganancia
		if (isset($_POST["porcentaje_ganancia"]) and $_POST["porcentaje_ganancia"]) {
			$array = array();
			$array["porcentaje_ganancia"] = $_POST["porcentaje_ganancia"];
			$Data->updateRegistro("cmx_contrato_cliente", $array, (int) $_POST["id_contrato"]);
		}

		// Se actualiza el valor del flete máximo a pagar
		if (isset($_POST["flete_maximo"]) and $_POST["flete_maximo"]) {
			foreach ($_POST["flete_maximo"] as $key => $value) {
				$array_valor = explode(",", $value["flete_maximo"]);
				$_valor = str_replace(".", "", $array_valor[0]);

				$array = array();
				$array["flete_maximo"] = $_valor;
				$Data->updateRegistro("cmx_contrato_vehiculo", $array, (int) $value["id_vehiculo"]);
			}
		}
		break;

	case 'editarEstadoContrato':
		$_msg_control .= "Entro en la accion editarEstadoContrato.\n";

		$array = array(
			'estado' => $_POST["estado"],
		);
		$result = $Data->updateRegistro("cmx_contrato_cliente", $array, (int) $_POST["id"]);
		break;

	case 'ConsultaMunicipio':
		$sql = '
				SELECT id,municipio, depto
				FROM cmx_municipios
				WHERE pais="COLOMBIA"
				ORDER BY municipio ASC';
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
		break;

	case 'ConsultaPostal':
		$sql = 'SELECT * FROM cmx_para_codigo_postal';
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
		break;

	case 'ConsultaunCliente':
		//$idcliente=$_GET["idcliente"];
		$id = $_REQUEST["idcliente"];
		$sql = "SELECT id, nombre
				FROM cmx_clientes
				WHERE id=" . $id;
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
		break;

	case 'ConsultaSedes':
		$idcliente = $_REQUEST["idcliente"];
		$sql = "SELECT cs.nombre_sede, mn.municipio, mn.depto,
				cs.direccion, cs.encargado, cs.correo, cs.telefono
				FROM cmx_cliente_sede cs
				INNER JOIN cmx_municipios mn
				ON cs.ciudad=mn.id
				LEFT JOIN cmx_para_obligacion_tributaria ot
				ON cs.obligacion_tributaria=ot.id
				WHERE cs.id_cliente=" . $idcliente . "
				AND cs.estado=1";
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
		break;

	case 'consulta_obligacion':
		$sql = "SELECT *
				FROM
				cmx_para_obligacion_tributaria
				WHERE estado=1";
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
		break;

	case 'EliminaSede':
		$idsede = $_REQUEST["idsedecliente"];
		$sql = "DELETE FROM cmx_cliente_sede
				WHERE id=" . $idsede;
		$result2 = $Data->ejecuteRegistro($sql);
		if ($result2) {
			$return["result"] = "true";
		} else {
			$return["result"] = "false";
		}
		break;

	case 'ActualizaunaSede':
		$idsede = $_REQUEST["idsedecliente"];
		$sede = $_REQUEST["sede"];
		$municipio = $_REQUEST["municipio"];
		$oblisede = $_REQUEST["oblisede"];
		$diresede = $_REQUEST["diresede"];
		$telefono = $_REQUEST["telefono"];
		$info = $_REQUEST["info"];
		$correosede = $_REQUEST["correosede"];
		$condipago = $_REQUEST["condipago"];
		$factu = $_REQUEST["factu"];
		$restrisede = $_REQUEST["restrisede"];
		$instrusede = $_REQUEST["instrusede"];
		$sql = "UPDATE cmx_cliente_sede
				SET
				nombre_sede='" . $sede . "',
				ciudad=" . $municipio . ",
				direccion='" . $diresede . "',
				telefono=" . $telefono . ",
				correo='" . $correosede . "',
				condicion_facturacion='" . $factu . "',
				condicion_pago='" . $condipago . "',
				dia_informacion='" . $info . "',
				restriccion_acceso='" . $restrisede . "',
				instruccion_especial='" . $instrusede . "',
				obligacion_tributaria='" . $oblisede . "'
				WHERE id=" . $idsede;
		$result2 = $Data->ejecuteRegistro($sql);
		if ($result2) {
			$return["result"] = "true";
		} else {
			$return["result"] = "false";
		}
		break;

	case 'rndc_GuardaCliente':
		$_msg_control .= "Entro en la accion rndcCreaCliente.\n";
		/******** INSERCION DE CONTENIDO DEL CLIENTE EN EL RNDC  ********/
		$id_usuario = $_POST["user"];
		$factual = date('Y-m-d');
		$horactual = date('H:i:s');
		$arrayMinTrans = array();
		$arrayMinTrans2 = array();
		// Solicitud
		$arrayMinTrans["solicitud"] = array(
			"tipo" => 1,
			"procesoid" => 11,
		);
		//Buscar ciudad
		$result = $Clientes->getCiudadById($_POST["municipio"]);
		if ($result) {
			$municipio = $result['rowsData'][0]['rndc_codigo_ciudad'];
		}

		//Buscar Id Cliente
		$result3 = $Clientes->getClienteById($_POST["documento"]);
		if ($result3) {
			$id_cliente = $result3['rowsData'][0]['id'];
		}

		//buscar la sede del cliente

		$result_sede = $Clientes->getSedeCliente("NIT", $_POST["documento"], $_POST["verificacion"]);
		if ($result_sede) {
			$sede = $result_sede['rowsData'][0]['codigo_sede'];
		}

		$consulta_xml = "";
		$consulta_xml .= "<?xml version='1.0' encoding='ISO-8859-1' ?>";
		$consulta_xml .= "<root>";
		$consulta_xml .= "<acceso>";
		$consulta_xml .= "<username>" . MINTRANS_USER . "</username>";
		$consulta_xml .= "<password>" . MINTRANS_PASS . "</password>";
		$consulta_xml .= "</acceso>";
		$consulta_xml .= "<solicitud>";
		$consulta_xml .= "<tipo>3</tipo>";
		$consulta_xml .= "<procesoid>11</procesoid>";
		$consulta_xml .= "</solicitud>";
		$consulta_xml .= "<variables>";
		$consulta_xml .= "NOMIDTERCERO, CODTIPOIDTERCERO, NUMIDTERCERO, PRIMERAPELLIDOIDTERCERO, SEGUNDOAPELLIDOIDTERCERO, CODSEDETERCERO, NOMSEDETERCERO, NUMTELEFONOCONTACTO, NUMCELULARPERSONA, NOMENCLATURADIRECCION, CODMUNICIPIORNDC, CODCATEGORIALICENCIACONDUCCION, NUMLICENCIACONDUCCION, FECHAVENCIMIENTOLICENCIA, LATITUD, LONGITUD";
		$consulta_xml .= "</variables>";
		$consulta_xml .= "<documento>";
		$consulta_xml .= "<NUMNITEMPRESATRANSPORTE>'" . MINTRANS_NIT . "'</NUMNITEMPRESATRANSPORTE>";
		$consulta_xml .= "<CODTIPOIDTERCERO>'N'</CODTIPOIDTERCERO>";
		$consulta_xml .= "<NUMIDTERCERO>'" . $_POST["documento"] . $_POST['verificacion'] . "'</NUMIDTERCERO>";
		$consulta_xml .= "</documento>";
		$consulta_xml .= "</root>";
		$consulta_web = new SoapClient(MINTRANS_URL, ['trace' => true]);
		$resultado_consulta = $consulta_web->AtenderMensajeRNDC($consulta_xml);
		$convierte_xml = new SimpleXMLElement($resultado_consulta);

		if ($convierte_xml->ErrorMSG[0]) {
			//REGISTRAR
			//if($convierte_xml->ErrorMSG[0]=="Error RNDC11: Documento no encontrado."){
			// Variable que se envían para la realizació del proceso
			$arrayMinTrans["variables"] = array(
				"NUMNITEMPRESATRANSPORTE" => MINTRANS_NIT,
				"CODTIPOIDTERCERO" => $Data->getRNDCTipoDocumento('NIT'),
				"NUMIDTERCERO" => $_POST["documento"] . $_POST['verificacion'],
				"NOMIDTERCERO" => $_POST["nombre_cliente"],
				"NOMENCLATURADIRECCION" => $_POST["direccion"],
				// "LATITUD"                    => substr($_POST["latitud"], 0 , 15),
				// "LONGITUD"                    => substr($_POST["longitud"], 0, 15),
				"CODMUNICIPIORNDC" => $municipio,
			);
			$arrayMinTrans["variables"]["CODSEDETERCERO"] =  $id_cliente;
			$arrayMinTrans["variables"]["NOMSEDETERCERO"] = $_POST["nombre_sede"];
			$result = $Data->getRNDCQueryArray($arrayMinTrans);
			$return["crea_cliente_result"] = $result;
			//Convertir a XML

			$cadena = implode(",", $arrayMinTrans["variables"]);
			//Registrar transacción en tb nexosapp + mintransporte
			/*$sql_a="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,tipo_tercero,accion)
				VALUES(null,'".$_POST['documento']."','Tercero',0,1,'".$cadena."','".$factual."','".$horactual."','".$id_usuario."','Cliente','Crear')";
				$result_a = $Data->ejecuteRegistro($sql_a); */
			if (isset($result["ErrorMSG"])) {
				$sql_b = "INSERT INTO web_service_rndc(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)
								VALUES(null,'" . $_POST["documento"] . "','Tercero',0,1,'" . $cadena . "','" . $factual . "','" . $horactual . "','" . $id_usuario . "','" . $result["ErrorMSG"] . "','Cliente','Crear')";
				$result_b = $Data->ejecuteRegistro($sql_b);
				$_msg_error .= "<p><strong>Registro no registrado en RNDC - Cliente.</strong></p>";
				$_msg_error .= $result["ErrorMSG"];
			} else {
				//
				$sql_b = "INSERT INTO web_service_rndc(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)
								VALUES(null,'" . $_POST["documento"] . "','Tercero',1,1,'" . $cadena . "','" . $factual . "','" . $horactual . "','" . $id_usuario . "','" . $result["ingresoid"] . "','Cliente','Crear')";
				$result_b = $Data->ejecuteRegistro($sql_b);
				$rndc_ingresoid = $result["ingresoid"];
				$return["crea_cliente_id_crea"] = $rndc_ingresoid;
			}
			$_array_result = $result["ingresoid"];
			//}
		} else {
			//ACTUALIZAR
			$arrayMinTrans["variables"] = array(
				"NUMNITEMPRESATRANSPORTE" => MINTRANS_NIT,
				"CODTIPOIDTERCERO" => $Data->getRNDCTipoDocumento('NIT'),
				"NUMIDTERCERO" => $_POST["documento"] . $_POST['verificacion'],
				"NOMIDTERCERO" => $_POST["nombre_cliente"],
				"NOMENCLATURADIRECCION" => $_POST["direccion"],
				// "LATITUD"                    => substr($_POST["latitud"], 0 , 15),
				// "LONGITUD"                    => substr($_POST["longitud"], 0, 15),
				"CODMUNICIPIORNDC" => $municipio,
			);
			$arrayMinTrans["variables"]["CODSEDETERCERO"] = $sede;
			$arrayMinTrans["variables"]["NOMSEDETERCERO"] = $_POST["nombre_sede"];
			$result = $Data->getRNDCQueryArray($arrayMinTrans);
			$return["crea_cliente_result"] = $result;
			$cadena = implode(",", $arrayMinTrans["variables"]);
			//Registrar transacción
			/*$sql_a="INSERT INTO web_service_RNDC(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,tipo_tercero,accion)
				VALUES(null,'".$_POST['documento']."','Tercero',0,1,'".$cadena."','".$factual."','".$horactual."','".$id_usuario."','Cliente','Actualizar')";
				$result_a = $Data->ejecuteRegistro($sql_a);*/
			if (isset($result["ErrorMSG"])) {
				$sql_b = "INSERT INTO web_service_rndc(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)
								VALUES(null,'" . $_POST["documento"] . "','Tercero',0,1,'" . $cadena . "','" . $factual . "','" . $horactual . "','" . $id_usuario . "','" . $result["ErrorMSG"] . "','Cliente','Actualizar')";
				$result_b = $Data->ejecuteRegistro($sql_b);
				$_msg_error .= "<p><strong>Registro no registrado en RNDC - Cliente.</strong></p>";
				$_msg_error .= $result["ErrorMSG"];
			} else {
				$sql_b = "INSERT INTO web_service_rndc(id,codigo_proceso,tipo,estado_envio_rndc,estado,cadena_xml,fecha,hora,usuario,rta_ministerio,tipo_tercero,accion)
								VALUES(null,'" . $_POST["documento"] . "','Tercero',1,1,'" . $cadena . "','" . $factual . "','" . $horactual . "','" . $id_usuario . "','" . $result["ErrorMSG"] . "','Cliente','Actualizar')";
				$result_b = $Data->ejecuteRegistro($sql_b);
				$rndc_ingresoid = $result["ingresoid"];
				$return["crea_cliente_id_crea"] = $rndc_ingresoid;
			}
			$_array_result = $result["ingresoid"];
		}
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
if ($_msg_content) {
	$return["content"] = $_msg_content;
}
echo json_encode($return);
