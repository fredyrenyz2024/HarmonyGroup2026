<?php
	include("../application/Config.php");
	include '../application/Conexion.php';
	include '../application/Model.php';
	include "../models/municipiosModel.php";
	$_msg_error = "";
	$_msg_control = "Entro en municipios_ajax.php\n";
	$_array_result = Array();

	$Municipios = new municipiosModel;

	// $return["post"] = $_POST;

	switch ( $_POST["action"] ) {
		case 'getRndc_id_municipio':
			$_msg_control.= "Entro en opción getRndc_id_municipio\n";
			$result = $Municipios->getMunicipiosById($_POST["id"]);
			if ($result) {
				$_array_result["municipio"]["rowsData"] = $result["rowsData"];
				$_array_result["municipio"]["rowsNum"] = $result["rowsNum"];
			}else{ $_msg_error.= "<p>Municipio no encontrado.</p>"; }
			break;

		case 'buscar_pais':
			$_msg_control.= "Entro en opción buscar_pais\n";
			$return["pais"] = $Municipios->limpiaTexto($_POST["pais"]);
			$result = $Municipios->getPais( $Municipios->limpiaTexto($_POST["pais"]));
			if ($result) { $_array_result = $result; }
			break;

		case 'agregar_pais':
			$_msg_control.= "Entro en opción agregar_pais\n";
			$return["id_municipio"] = $Municipios->crearPais( strtoupper($Municipios->limpiaTexto($_POST["pais"])) );
			break;

		case 'form_crea_depto':
			$_msg_control.= "Entro en opción form_crea_depto\n";
			$content = '
				<div class="col-xs-12 col-sm-1 col-md-2"></div>
				<div class="form-group col-xs-12 col-sm-5 col-md-4">
					<label class="control-label">(*) País:</label>
					' . $Municipios->getHtmlSelectPaisesTodos_sm( "pais" , "" ) . '
				</div>
				<div class="form-group col-xs-12 col-sm-5 col-md-4">
					<label class="control-label">(*) Estado | Departamento | Región:</label>
					<input type="text" class="form-control input-sm" name="depto" id="depto" placeholder="Estado | Departamento | Región">
				</div>
				<div class="col-xs-12 col-sm-1 col-md-2"></div>
			';
			$return["content"] = $content;
			break;

		case 'buscar_depto':
			$_msg_control.= "Entro en opción buscar_depto\n";
			$pais = strtoupper($Municipios->limpiaTexto($_POST["pais"]));
			$depto = strtoupper($Municipios->limpiaTexto($_POST["depto"]));
			$return["depto"] = $Municipios->getDepto($pais, $depto);
			break;

		case 'agregar_depto':
			$_msg_control.= "Entro en opción agregar_depto\n";
			$pais = strtoupper($Municipios->limpiaTexto($_POST["pais"]));
			$depto = strtoupper($Municipios->limpiaTexto($_POST["depto"]));
			$result = $Municipios->crearDepto($pais, $depto);
			if ($result) { $return["flag"] = $result; }
			else { $_msg_error.= '<p>Error en la creación del registro.</p>'; }
			break;

		case 'form_crea_municipio':
			$_msg_control.= "Entro en opción form_crea_municipio\n";
			$content = '
				<div class="form-group col-xs-12 col-sm-4 col-md-3">
					<label class="control-label">(*) País:</label>
					' . $Municipios->getHtmlSelectPaisesConDepto_sm( "pais" , "" ) . '
				</div>
				<div class="form-group col-xs-12 col-sm-4 col-md-6" id="div_depto"></div>
				<div class="form-group col-xs-12 col-sm-4 col-md-3" id="div_municipio"></div>


			';
			$return["content"] = $content;
			break;

		case 'fld_busca_depto':
			$_msg_control.= "Entro en opción fld_busca_depto\n";
			$return["content"]["depto"] = '
				<label class="control-label">(*) Estado | Departamento | Región:</label>
				' . $Municipios->getHtmlSelectDeptos_sm( "depto" , "", strtoupper($Municipios->limpiaTexto($_POST["pais"])) ) . '
			';

			if($_POST["pais"]=='COLOMBIA'){
				$contenido='
				<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
					<label class="comtrol-label">(*)Valor ICA</label>
					<input type="" class="form-control input-xs" name="ica" id="valica" value="0.0">
				</div>
				<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
					<label>(*)Latitud</label>
					<input type="text" class="form-control input-xs" name="latitud" id="latitud">
				</div>
				<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
					<label>(*)Longitud</label>
					<input type="text" class="form-control input-xs" name="longitud" id="longitud" placeholder="Incluir el signo negativo antes de la cifra">
				</div>';
			}else{
				$contenido='';
			}

			$return["content"]["municipio"] ='
				<label class="control-label">(*) Municipio:</label>
				<input type="text" class="form-control input-sm" name="municipio" id="municipio" placeholder="Municipio">
				<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				'.$contenido.'</div>';
			break;

		case 'buscar_municipio':
			$_msg_control.= "Entro en opción buscar_municipio\n";
			$pais = strtoupper($Municipios->limpiaTexto($_POST["pais"]));
			$depto = strtoupper($Municipios->limpiaTexto($_POST["depto"]));
			$municipio = strtoupper($Municipios->limpiaTexto($_POST["municipio"]));
			$return["municipio"] = $Municipios->getMunicipio($pais, $depto, $municipio);
			break;

		case 'agregar_municipio':
			$_msg_control.= "Entro en opción agregar_municipio\n";
			$pais = strtoupper($Municipios->limpiaTexto($_POST["pais"]));
			$depto = strtoupper($Municipios->limpiaTexto($_POST["depto"]));
			$municipio = strtoupper($Municipios->limpiaTexto($_POST["municipio"]));

			$valor_ica=$_POST["valica"];
			$latitud=$_POST["latitud"];
			$longitud=$_POST["longitud"];

			$result = $Municipios->crearMunicipio($pais, $depto, $municipio,$valor_ica,$latitud,$longitud);
			if ($result) { $return["flag"] = $result; }
			else { $_msg_error.= '<p>Error en la creación del registro.</p>'; }
			break;

		default:
			$_msg_error.= "Función no especificada";
			break;
	}

	$return["control"] = $_msg_control;
	if ( $_msg_error ) {
		$return["error"] = $_msg_error;
	}
	if ( $_array_result ) {
		$return["result"] = $_array_result;
	}

	echo json_encode($return);
?>
