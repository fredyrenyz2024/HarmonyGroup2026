<?php
	include_once 'sec_ajax.php';
	include "../models/Asignaciones.php";

	$accion = $_REQUEST['accion'];

	switch ($accion) {
		case 'buscarAgrupamientovehiculos':
			echo buscarAgrupamientovehiculos();
			break;
		case 'cargarvehiculos':
			echo cargarvehiculos();
			break;
		case 'obtenerdatosvehiculos':
			echo obtenerdatosvehiculos();
			break;
		case 'crearAsignacion':
			echo crearAsignacion();
			break;
		case 'cancelarAsignacion':
			echo cancelarAsignacion();
			break;
		case 'cambiarestadoAsignacion':
			echo cambiarestadoAsignacion();
			break;
		case 'verasignacion':
			echo verasignacion();
			break;
		case 'verSolicitudesAsignacion':
			echo verSolicitudesAsignacion();
			break;
		case 'buscarValidacionTarifa':
			echo buscarValidacionTarifa();
			break;
		case 'veridasignacion':
			echo veridasignacion();
			break;
	}


	function buscarAgrupamientovehiculos() {
		$vehic = new Asignaciones();
		return json_encode($vehic->buscarAgrupamientovehiculos(), JSON_UNESCAPED_UNICODE);
	}
	function obtenerdatosvehiculos() {
		$vehic = new Asignaciones();
		return json_encode($vehic->obtenerdatosvehiculos(), JSON_UNESCAPED_UNICODE);
	}
	function cargarvehiculos() {
		$vehic = new Asignaciones();
		return json_encode($vehic->cargarvehiculos(), JSON_UNESCAPED_UNICODE);
	}
	function crearAsignacion() {
		$vehic = new Asignaciones();
		return json_encode($vehic->crearAsignacion(), JSON_UNESCAPED_UNICODE);
	}
	function cancelarAsignacion() {
		$vehic = new Asignaciones();
		return json_encode($vehic->cancelarAsignacion(), JSON_UNESCAPED_UNICODE);
	}
	function cambiarestadoAsignacion() {
		$vehic = new Asignaciones();
		return json_encode($vehic->cambiarestadoAsignacion(), JSON_UNESCAPED_UNICODE);
	}
	function verasignacion() {
		$vehic = new Asignaciones();
		return json_encode($vehic->verasignacion(), JSON_UNESCAPED_UNICODE);
	}
	function verSolicitudesAsignacion() {
		$vehic = new Asignaciones();
		return json_encode($vehic->verSolicitudesAsignacion(), JSON_UNESCAPED_UNICODE);
	}
	function buscarValidacionTarifa() {
		$vehic = new Asignaciones();
		return json_encode($vehic->buscarValidacionTarifa(), JSON_UNESCAPED_UNICODE);
	}
	function veridasignacion() {
		$vehic = new Asignaciones();
		return json_encode($vehic->veridasignacion(), JSON_UNESCAPED_UNICODE);
	}
?>
