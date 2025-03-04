<?php
include_once 'sec_ajax.php';
include "../models/Preestudio.php";

$accion = $_REQUEST['accion'];
	switch ($accion) {
		case 'verpreestudio':
			echo verpreestudio();
		break;

		case 'insertar_preestudio_con':
			echo insertar_preestudio_con();
		break;

		case 'insertar_preestudio_solo':
		 echo insertar_preestudio_solo();
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

		case 'insertar_cabecera':
			echo insertar_cabecera();
		break;

	}

	function verpreestudio() {
		$vehic = new Preestudio();
		return json_encode($vehic->verpreestudio(), JSON_UNESCAPED_UNICODE);
	}

	function insertar_preestudio_con() {
		$vehic = new Preestudio();
		return json_encode($vehic->insertar_preestudio_con(), JSON_UNESCAPED_UNICODE);
	}

	function insertar_preestudio_solo() {
		$vehic = new Preestudio();
		return json_encode($vehic->insertar_preestudio_solo(), JSON_UNESCAPED_UNICODE);
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

	function insertar_cabecera() {
		$vehic = new Preestudio();
		return json_encode($vehic->insertar_cabecera(), JSON_UNESCAPED_UNICODE);
	}
	
?>