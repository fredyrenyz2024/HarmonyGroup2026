<?php 
	include("../application/Config.php");
	include '../application/Conexion.php';
	include '../application/Model.php';
	include '../models/informesModel.php';
	date_default_timezone_set('America/Bogota');

	$_msg_error = "";
	$_msg_control = "Entro en internacional_ajax.php\n";
	$_msg_content = Array();
	$_array_result = Array();

	$Data = new Consultas;
	$Informes = new informesModel;

	$return["get"] = $_GET;
	$return["post"] = $_POST;
	if ( isset($_FILES) ) {
		$return["file"] = $_FILES;
	}

	switch ( $_GET["action"] ) {
		case 'cargar_informe_rentabilidad':
			$_msg_control.= "Entro en la acción cargar_informe_rentabilidad.\n";

			switch ($_POST["filtro"]) {
				case 'inicial':
					$_msg_control.= "Entro en inicial.\n";

					$array = $Informes->getInfoRentabilidadInicial();
					$_array_result = $array;

					/***** Se busca la información para los filtros *****/
					// Filtro de años 
					$_slct_years = '';
					if ( $array["years"] ) {
						$_slct_years = '
							<div class="form-group col-xs-12 col-sm-6 col-md-6 form_field">
								<label class="data_label" data-campo="year">Año:</label>
								<select class="form-control input-sm filtro" id="slct_years">
									<option value="">Todos</option>
						';
						foreach ($array["years"] as $key => $value) {
							$_slct_years.= '<option value="' . $key . '">' . $key . '</option>';
						}
						$_slct_years.= '
								</select>
							</div>
						';
					}

					// Filtro de meses 
					$_slct_meses = '';
					if ( $array["meses"] ) {
						$_slct_meses = '
							<div class="form-group col-xs-12 col-sm-6 col-md-6 form_field">
								<label class="data_label" data-campo="mes">Mes:</label>
								<select class="form-control input-sm filtro" id="slct_meses">
									<option value="">Todos</option>
						';
						foreach ($array["meses"] as $key => $value) {
							$_slct_meses.= '<option value="' . $value["numero"] . '">' . $value["letra"] . '</option>';
						}
						$_slct_meses.= '
								</select>
							</div>
						';
					}

					// Filtro de clientes 
					$_slct_clientes = '';
					if ( $array["clientes"] ) {
						$_slct_clientes = '
							<div class="form-group col-xs-12 col-sm-12 col-md-12 form_field">
								<label class="data_label" data-campo="cliente">Cliente:</label>
								<select class="form-control input-sm filtro" id="slct_clientes">
									<option value="">Todos</option>
						';
						foreach ($array["clientes"] as $key => $value) {
							$_slct_clientes.= '<option value="' . $value["numero"] . '">' . $value["letra"] . '</option>';
						}
						$_slct_clientes.= '
								</select>
							</div>
						';
					}

					// Filtro de tipos de operación  
					$_slct_tipo_operacion = '';
					if ( $array["tipo_operacion"] ) {
						$_slct_tipo_operacion = '
							<div class="form-group col-xs-12 col-sm-6 col-md-6 form_field">
								<label class="data_label" data-campo="tipo_operacion">Tipo de operación:</label>
								<select class="form-control input-sm filtro" id="slct_tipo_operacion">
									<option value="">Todos</option>
						';
						foreach ($array["tipo_operacion"] as $key => $value) {
							$_slct_tipo_operacion.= '<option value="' . $key . '">' . $key . '</option>';
						}
						$_slct_tipo_operacion.= '
								</select>
							</div>
						';
					}

					// Filtro de tipos de operación  
					$_slct_tipo_transporte = '';
					if ( $array["tipo_transporte"] ) {
						$_slct_tipo_transporte = '
							<div class="form-group col-xs-12 col-sm-6 col-md-6 form_field">
								<label class="data_label" data-campo="tipo_transporte">Tipo de transporte:</label>
								<select class="form-control input-sm filtro" id="slct_tipo_transporte">
									<option value="">Todos</option>
						';
						foreach ($array["tipo_transporte"] as $key => $value) {
							$_slct_tipo_transporte.= '<option value="' . $key . '">' . $key . '</option>';
						}
						$_slct_tipo_transporte.= '
								</select>
							</div>
						';
					}

					$_msg_content["filtros"] = '
						' . $_slct_years . '
						' . $_slct_meses . '
						' . $_slct_clientes . '
						' . $_slct_tipo_operacion . '
						' . $_slct_tipo_transporte . '
						<div id="msg_filtros"></div>
					';

					break;

				case 'filtrado':
					$_msg_control.= "Entro en filtrado.\n";

					$array = $Informes->getInfoRentabilidadFiltrado($_POST["filtros"]);
					$_array_result = $array;

					break;
				default:
					$_msg_error.= "<p>No hay filtro seleccionado.</p>\n";
					break;
			}

			$return["content"] = '';
			break;

		default:
			$_msg_error.= "<p>Error en la selección del action.</p>\n";
			break;
	}

	$return["control"] = $_msg_control;
	if ( $_msg_error ) {
		$return["error"] = $_msg_error;
	}
	if ( $_array_result ) {
		$return["result"] = $_array_result;
	}
	if ( $_msg_content ) {
		$return["content"] = $_msg_content;
	}

	echo json_encode($return);

?>
