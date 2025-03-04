<?php
	include("../application/Config.php");
	include '../application/Conexion.php';
	include '../application/Model.php';
	include '../models/importacionModel.php';

	$_msg_error = "";
	$_msg_control = "Entro en buscar_proyectos.php\n";
	$_msg_content = "";
	$_array_result = Array();

	$Data = new Consultas;


	$mensaje = "";

	switch ( $_GET["action"] ) {
		case 'crea_html_select_contrato': // Caso para generar el select de remitentes destinatarios
			$_msg_control.= "Entro en action crea_html_select_contrato.php\n";

			$Model = new Model;
			$_msg_content = $Model->getHtmlSelectContratoCliente_sm( "id_contrato" , "" , $_POST["id_cliente"] );
			break;

		case 'crea_html_content_tramos': // Caso para generar el select de remitentes destinatarios
			$_msg_control.= "Entro en action crea_html_content_tramos.php\n";

			$Model = new Model;
			$Importacion = new importacionModel;

			$_array_result["botones"] = '
				<button type="button" class="btn btn-space btn-success btn-big hint--top-left" data-hint="Agregar Tramo" id="btn_agrega_tramo"><span class="mdi mdi-plus"></span></button>
				<button type="button" class="btn btn-space btn-danger btn-big hint--top-left" data-hint="Quitar Tramo" id="btn_quita_tramo" disabled="disabled"><span class="mdi mdi-minus"></span></button>
			';

			$_array_result["form_tramos"] = '
				<div class="form-group col-xs-4 div_tramo" id="div_tipo_tramo_1">
					<label>(*) Tipo de Tramo:</label>
					' . $Importacion->getEnumSlctTipoTramo( "tipo_tramo_1" , "1" , "" ) . '
				</div>
				<div class="form-group col-xs-8 div_tramo" id="div_tramo_1">
					<label>(*) Remitente - Destinatario:</label>
					' . $Model->getHtmlSelectIntrRemitenteDestinatario_sm( "rem_dest_1" , "1" , $_POST["id_cliente"] ) . '
				</div>
			';
			break;

	}

	// echo $mensaje;
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
