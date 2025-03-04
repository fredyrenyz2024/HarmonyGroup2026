<?php
	include("../application/Config.php");
	include '../application/Conexion.php';
	include '../application/Model.php';

	$_msg_error = "";
	$_msg_control = "Entro en internacional_ajax.php\n";
	$_array_result = Array();

	$return["get"] = $_GET;
	$return["post"] = $_POST;
	if ( isset($_FILES) ) {
		$return["file"] = $_FILES;
	}

	$Data = new Consultas;
	$Model = new Model;


	switch ( $_GET["action"] ) {
		case 'editarServicio':
			$_msg_control.= "Entro en editarServicio\n";
			// Se actualiza la información del Servicio Especial
			$array = Array(
				"nom_servicios_especial" => $_POST["nom_servicios_especial"],
				"tipo_servicio" => $_POST["tipo_servicio"],
			);
			$Data->updateRegistro( "cmx_contabilidad_conceptos", $array, (int)$_POST["id"] ); 
			break;

		case 'cargarFormularioCuentas':
			$_msg_control.= "Entro en cargarFormularioCuentas\n";

			$return["content"] = '
				<div class="form-group col-xs-12 col-sm-6 col-md-6">
					<label>Agencia:</label>
					' . $Model->getSlctAgencias( "agencias" , "") . '
				</div>
				<div class="row"></div>
				<div class="form-group col-xs-4 col-sm-4 col-md-2">
					<label>(*) Tipo Documento:</label>
					' . $Model->getEnumSlctContTipoDocumento( "tipo_documento" , "" , "" ) . '
				</div>
				<div class="form-group col-xs-4 col-sm-4 col-md-2">
					<label>(*) Tipo Persona:</label>
					' . $Model->getEnumSlctContTipoPersona( "tipo_persona" , "" , "" ) . '
				</div>
				<div class="form-group col-xs-4 col-sm-4 col-md-2">
					<label>(*) Naturaleza:</label>
					' . $Model->getEnumSlctContTipoCuenta( "tipo_cuenta" , "" , "" ) . '
				</div>
				<div class="form-group col-xs-12 col-sm-6 col-md-3">
					<label>(*) Número Cuenta:</label>
					<input type="text" name="numero_cuenta" id="numero_cuenta" class="form-control input-sm" placeholder="Número Cuenta" maxlength="8">
				</div>
				<div class="form-group col-xs-12 col-sm-6 col-md-3">
					<label>(*) Nombre Cuenta:</label>
					<input type="text" name="nombre_cuenta" id="nombre_cuenta" class="form-control input-sm" placeholder="Nombre Cuenta" maxlength="50">
				</div>
			';
			break;

		case 'formCuentasContables':
			$_msg_control.= "Entro en formCuentasContables\n";

			$return["content"] = '
				<div class="col-xs-12 col-sm-12 col-md-12">
					<div role="alert" class="alert alert-warning alert-icon alert-icon-border alert-dismissible">
						<div class="icon">
							<span class="mdi mdi-alert-triangle"></span>
						</div>
						<div class="message">
							<strong>Atención!</strong>
							<p>El concepto no tiene cuentas contables registradas</p>
						</div>
					</div>
				</div>
			';
			$sql = '
				SELECT cccu.*,
					IF((
							SELECT COUNT(cag1.id)
							FROM cmx_agencias cag1
							WHERE cag1.id = cccu.id_agencia
						) > 0,
						(
							SELECT cag1.codigo
							FROM cmx_agencias cag1
							WHERE cag1.id = cccu.id_agencia
						),
						NULL
					) AGENCIA
				FROM cmx_contabilidad_cuentas cccu
				WHERE cccu.estado != "Eliminado"
					AND cccu.id_concepto = ' . $_POST["id"] . ' 
				ORDER BY cccu.estado
			';
			$result = $Data->getConsulta($sql);

			if ( $result ) {
				$_table_content = '';
				foreach ($result["rowsData"] as $key => $value) {
					$_btn_inhabilita = '';
					$_btn_habilita = '';
					$_btn_elimina = '';
					switch ($value["estado"]) {
						case 'Activo':
							$_col_status = '
								<td class="nexos-txt-success">
									<center>
										<span class="mdi mdi-dot-circle icon"></span>
									</center>
								</td>
							';
							$_btn_inhabilita = '
								<a href="javascript:" class="cell-detail hint--top-left btn_action" data-id="' . $value[0] . '" data-estado="Inactivo" data-hint="Inhabilitar Cuenta">
									<span class="icon mdi mdi-close-circle"></span>
								</a>
							';
							if ( $_POST["eliminar"] == "1" ) {
								$_btn_elimina = '
									<a href="javascript:" class="cell-detail hint--top-left btn_action" data-id="' . $value[0] . '" data-estado="Eliminado" data-hint="Eliminar Cuenta">
										<span class="icon mdi mdi-delete"></span>
									</a>
								';
							}
							break;

						case 'Inactivo':
							$_col_status = '
								<td class="nexos-txt-danger">
									<center>
										<span class="mdi mdi-dot-circle icon"></span>
									</center>
								</td>
							';
							$_btn_habilita = '
								<a href="javascript:" class="cell-detail hint--top-left btn_action" data-id="' . $value[0] . '" data-estado="Activo" data-hint="Habilitar Cuenta">
									<span class="icon mdi mdi-check-circle"></span>
								</a>
							';
							if ( $_POST["eliminar"] == "1" ) {
								$_btn_elimina = '
									<a href="javascript:" class="cell-detail hint--top-left btn_action" data-id="' . $value[0] . '" data-estado="Eliminado" data-hint="Eliminar Cuenta">
										<span class="icon mdi mdi-delete"></span>
									</a>
								';
							}
							break;

						default:
							$_col_status = '
								<td class="actions">
								</td>
							';
							break;
					}
					$_table_content.= '
						<tr>
							' . $_col_status . '
							<td class="cell-detail text-center">
								<span>' . $value["AGENCIA"] . '</span>
							</td>
							<td class="cell-detail text-center">
								<span>' . $value["tipo_documento"] . '</span>
							</td>
							<td class="cell-detail">
								<span><strong>(' . $value["tipo_cuenta"] . ')</strong> ' . $value["num_cuenta"] . '</span>
								<span class="cell-detail-description">' . $value["nom_cuenta"] . '</span>
							</td>
							<td class="cell-detail text-center">
								<span>' . $value["tipo_persona"] . '</span>
							</td>
							<td class="actions">
								' . $_btn_inhabilita . '
								' . $_btn_habilita . '
								' . $_btn_elimina . '
							</td>
						</tr>
					';
				}

				$return["content"] = '
					<div class="col-xs-12 col-sm-12 col-md-12">
						<table class="table table-striped table-condensed">
							<thead>
								<tr class="nexos-encabezado">
									<th class="col-md-1"></th>
									<th class="col-md-1">Agencia</th>
									<th class="col-md-2">Tipo Documento</th>
									<th>Cuenta</th>
									<th class="col-md-2">Tipo Persona</th>
									<th class="col-md-2 "></th>
								</tr>
							</thead>
							<tbody>
								' . $_table_content . '
							</tbody>
						</table>
					</div>
				';
			}
			break;

		case 'crearCuentaContable':
			$_msg_control.= "Entro en crearCuentaContable\n";
			$array = Array();
			$array["id_concepto"] = (int)$_POST["id"];
			$array["tipo_documento"] = $_POST["tipo_documento"];
			$array["tipo_persona"] = $_POST["tipo_persona"];
			$array["tipo_cuenta"] = $_POST["tipo_cuenta"];
			$array["num_cuenta"] = $_POST["numero_cuenta"];
			$array["nom_cuenta"] = strtoupper( trim($_POST["nombre_cuenta"]) );
			if ($_POST["agencia"]) {
				$array["id_agencia"] = $_POST["agencia"];
			}
			$Data->setRegistro("cmx_contabilidad_cuentas", $array);
			break;

		case 'cambiaEstadoCuenta':
			$_msg_control.= "Entro en cambiaEstadoCuenta\n";
			$array = Array();
			$array["estado"] = $_POST["estado"];
			$Data->updateRegistro( "cmx_contabilidad_cuentas", $array, (int)$_POST["id"] ); 
			break;

		default:
			$_msg_control.= "Error en la selección de acción de archivo";
			$_msg_error.= '<p>Error en la selección de acción de archivo.</p>';
			break;
	}

	$return["control"] = $_msg_control;
	if ( $_msg_error ) {
		$return["error"] = $_msg_error;
	}
	if ( $_array_result ) {
		$return["result"] = $_array_result;
	}
	echo json_encode( $return );
?>
