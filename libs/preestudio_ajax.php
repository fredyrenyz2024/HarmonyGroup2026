<?php
include_once 'sec_ajax.php';
include "../models/Preestudio.php";

$accion = $_REQUEST['accion'];
	switch ($accion) {

		case 'verpreestudio':
			echo verpreestudio();
		break;

		case 'registrar_respuesta_operacion':
			echo registrar_respuesta_operacion();
		break;

		case 'insertar_preestudio_con':
			echo insertar_preestudio_con();
		break;

		case 'insertar_preestudio_solo':
		 echo insertar_preestudio_solo();
		break;

		case 'insertar_preestudio_solo_rechazado':
			echo insertar_preestudio_solo();
		break;

		case 'insertar_camposactualizar_solo':
			echo insertar_camposactualizar_solo();
		break;

		case 'insertar_documento_solo':
			echo insertar_documento_solo();
		break;

		case 'insertar_habil_solo':
			echo insertar_habil_solo();
		break;

		case 'insertar_estadoautomaticos_solo':
			
			echo insertar_estadoautomaticos_solo();
		break;


		case 'reactivar_estudio';
			echo reactivar_estudio();
		break;

		case 'reactivar_estudio2';
			echo reactivar_estudio2();
		break;




		case 'insertar_nueva_solicitud':
			echo insertar_nueva_solicitud();
		break;

		case 'update_solicitud':
		 	echo update_solicitud();
		break;

		case 'update_sol':
			echo update_sol();
		break;

		case 'insertar_mas_referencias':
			echo insertar_mas_referencias();
		break;

		case 'insertar_referencias':
			echo insertar_referencias();
		break;

		case 'insertar_preestudio_ss':
			echo insertar_preestudio_ss();
		break;

		case 'insertar_subasta':
			echo insertar_subasta();
		break;


	}

	function verpreestudio() {
		$vehic = new Preestudio();
		return json_encode($vehic->verpreestudio(), JSON_UNESCAPED_UNICODE);
	}

	function registrar_respuesta_operacion() {
		$vehic = new Preestudio();
		return json_encode($vehic->registrar_respuesta_operacion(), JSON_UNESCAPED_UNICODE);
	}

	function insertar_preestudio_con() {
		$vehic = new Preestudio();
		return json_encode($vehic->insertar_preestudio_con(), JSON_UNESCAPED_UNICODE);
	}

	function insertar_preestudio_solo() {
		$vehic = new Preestudio();
		return json_encode($vehic->insertar_preestudio_solo(), JSON_UNESCAPED_UNICODE);
	}

	function insertar_camposactualizar_solo() {
		$vehic = new Preestudio();
		return json_encode($vehic->insertar_camposactualizar_solo(), JSON_UNESCAPED_UNICODE);
	}

	function insertar_documento_solo() {
		$vehic = new Preestudio();
		return json_encode($vehic->insertar_documento_solo(), JSON_UNESCAPED_UNICODE);
	}

	function insertar_habil_solo() {
		$vehic = new Preestudio();
		return json_encode($vehic->insertar_habil_solo(), JSON_UNESCAPED_UNICODE);
	}

	function insertar_estadoautomaticos_solo() {
		$vehic = new Preestudio();
		return json_encode($vehic->insertar_estadoautomaticos_solo(), JSON_UNESCAPED_UNICODE);
	}



	function insertar_nueva_solicitud() {
		$vehic = new Preestudio();
		return json_encode($vehic->insertar_nueva_solicitud(), JSON_UNESCAPED_UNICODE);
	}

	function update_solicitud() {
		$vehic = new Preestudio();
		return json_encode($vehic->update_solicitud(), JSON_UNESCAPED_UNICODE);
	}

	function update_sol() {
		$vehic = new Preestudio();
		return json_encode($vehic->update_sol(), JSON_UNESCAPED_UNICODE);
	}

	function insertar_mas_referencias() {
		$vehic = new Preestudio();
		return json_encode($vehic->insertar_mas_referencias(), JSON_UNESCAPED_UNICODE);
	}

	function insertar_referencias() {
		$vehic = new Preestudio();
		return json_encode($vehic->insertar_referencias(), JSON_UNESCAPED_UNICODE);
	}
	//rechazar preestudio 
	function insertar_preestudio_solo_rechazado() {
		$vehic = new Preestudio();
		return json_encode($vehic->insertar_preestudio_solo_rechazado(), JSON_UNESCAPED_UNICODE);
	}

	function reactivar_estudio() {
		$vehic = new Preestudio();
		return json_encode($vehic->reactivar_estudio(), 
			JSON_UNESCAPED_UNICODE);
	}

	function reactivar_estudio2() {
		$vehic = new Preestudio();
		return json_encode($vehic->reactivar_estudio2(), 
			JSON_UNESCAPED_UNICODE);
	}

	function insertar_preestudio_ss() {
		$vehic = new Preestudio();
		return json_encode($vehic->insertar_preestudio_ss(), JSON_UNESCAPED_UNICODE);
	}

	function insertar_subasta() {
		$vehic = new Preestudio();
		return json_encode($vehic->insertar_subasta(), JSON_UNESCAPED_UNICODE);
	}

	
?>