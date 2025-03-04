<?php
include_once 'sec_ajax.php';
include "../models/Solicitudes.php";

$accion = $_REQUEST['accion'];

switch ($accion) {
	case 'crearSolicitud':
		echo crearSolicitud();
		break;
	case 'listarSolicitudes':
		echo listarSolicitudes();
		break;
	case 'obtenerdatossolicitud':
		echo obtenerdatossolicitud();
		break;
	case 'verdatossolicitud':
		echo verdatossolicitud();
		break;
	case 'editarSolicitud':
		echo editarSolicitud();
		break;
	case 'editarSolicitud_1':
		echo editarSolicitud_1();
		break;
	case 'crea_costo':
		echo crea_costo();
		break;
	case 'cancelarSolicitud':
		echo cancelarSolicitud();
		break;
	case 'buscartramossolicitud':
		echo buscartramossolicitud();
		break;
	case 'cargarremitente':
		echo cargarremitente();
		break;
	case 'obtenerdatosremitente':
		echo obtenerdatosremitente();
		break;
	case 'agregarTramoSolicitud':
		echo agregarTramoSolicitud();
		break;
	case 'cargarsolicitudesvehiculos':
		echo cargarsolicitudesvehiculos();
		break;
	case 'cargarvehiculos':
		echo cargarvehiculos();
		break;
	case 'obtenerdatosvehiculo':
		echo obtenerdatosvehiculo();
		break;
	case 'crearsolicitudVehiculo':
		echo crearsolicitudVehiculo();
		break;
	case 'editardatossolicitudvehiculos':
		echo editardatossolicitudvehiculos();
		break;
	case 'editarsolicitudVehiculo':
		echo editarsolicitudVehiculo();
		break;
	case 'finalizarSolicitud':
		echo finalizarSolicitud();
		break;
	case 'cargarprovedores':
		echo cargarprovedores();
		break;
	case 'obtenerdatosproveedor':
		echo obtenerdatosproveedor();
		break;
	case 'cargartiposvehiculos':
		echo cargartiposvehiculos();
		break;
	case 'obtenerdatosvehiculos':
		echo obtenerdatosvehiculos();
		break;
	case 'cargartiposcarroceria':
		echo cargartiposcarroceria();
		break;
	case 'obtenerdatoscarroceria':
		echo obtenerdatoscarroceria();
		break;
	case 'cargarmunicipios':
		echo cargarmunicipios();
		break;
	case 'obtenerdatosmunicipio':
		echo obtenerdatosmunicipio();
		break;
	case 'verSolicitudesDeAgrupamiento':
		echo verSolicitudesDeAgrupamiento();
		break;
}

function crearSolicitud() {
	$solicit = new Solicitudes();
	return json_encode($solicit->crearSolicitud(), JSON_UNESCAPED_UNICODE);
}

function listarSolicitudes() {
	$solicit = new Solicitudes();
	return json_encode($solicit->listarSolicitudes(), JSON_UNESCAPED_UNICODE);
}

function obtenerdatossolicitud() {
	$solicit = new Solicitudes();
	return json_encode($solicit->obtenerdatossolicitud(), JSON_UNESCAPED_UNICODE);
}
function verdatossolicitud() {
	$solicit = new Solicitudes();
	return json_encode($solicit->verdatossolicitud(), JSON_UNESCAPED_UNICODE);
}
function editarSolicitud() {
	$solicit = new Solicitudes();
	return json_encode($solicit->editarSolicitud(), JSON_UNESCAPED_UNICODE);
}
function editarSolicitud_1() {
	$solicit = new Solicitudes();
	return json_encode($solicit->editarSolicitud_1(), JSON_UNESCAPED_UNICODE);
}
function crea_costo() {
	$solicit = new Solicitudes();
	return json_encode($solicit->crea_costo(), JSON_UNESCAPED_UNICODE);
}
function cancelarSolicitud() {
	$solicit = new Solicitudes();
	return json_encode($solicit->cancelarSolicitud(), JSON_UNESCAPED_UNICODE);
}
function buscartramossolicitud() {
	$solicit = new Solicitudes();
	return json_encode($solicit->buscartramossolicitud(), JSON_UNESCAPED_UNICODE);
}

function cargarremitente() {
	$solicit = new Solicitudes();
	return json_encode($solicit->cargarremitente(), JSON_UNESCAPED_UNICODE);
}

function obtenerdatosremitente() {
	$solicit = new Solicitudes();
	return json_encode($solicit->obtenerdatosremitente(), JSON_UNESCAPED_UNICODE);
}

function cargarsolicitudesvehiculos() {
	$solicit = new Solicitudes();
	return json_encode($solicit->cargarsolicitudesvehiculos(), JSON_UNESCAPED_UNICODE);
}

function cargarvehiculos() {
	$solicit = new Solicitudes();
	return json_encode($solicit->cargarvehiculos(), JSON_UNESCAPED_UNICODE);
}

function obtenerdatosvehiculo() {
	$solicit = new Solicitudes();
	return json_encode($solicit->obtenerdatosvehiculo(), JSON_UNESCAPED_UNICODE);
}

function crearsolicitudVehiculo() {
	$solicit = new Solicitudes();
	return json_encode($solicit->crearsolicitudVehiculo(), JSON_UNESCAPED_UNICODE);
}

function editardatossolicitudvehiculos() {
	$solicit = new Solicitudes();
	return json_encode($solicit->editardatossolicitudvehiculos(), JSON_UNESCAPED_UNICODE);
}

function editarsolicitudVehiculo() {
	$solicit = new Solicitudes();
	return json_encode($solicit->editarsolicitudVehiculo(), JSON_UNESCAPED_UNICODE);
}

function finalizarSolicitud() {
	$solicit = new Solicitudes();
	return json_encode($solicit->finalizarSolicitud(), JSON_UNESCAPED_UNICODE);
}

function cargarprovedores() {
	$solicit = new Solicitudes();
	return json_encode($solicit->cargarprovedores(), JSON_UNESCAPED_UNICODE);
}

function obtenerdatosproveedor() {
	$solicit = new Solicitudes();
	return json_encode($solicit->obtenerdatosproveedor(), JSON_UNESCAPED_UNICODE);
}

function cargartiposvehiculos() {
	$solicit = new Solicitudes();
	return json_encode($solicit->cargartiposvehiculos(), JSON_UNESCAPED_UNICODE);
}

function obtenerdatosvehiculos() {
	$solicit = new Solicitudes();
	return json_encode($solicit->obtenerdatosvehiculos(), JSON_UNESCAPED_UNICODE);
}

function cargartiposcarroceria() {
	$solicit = new Solicitudes();
	return json_encode($solicit->cargartiposcarroceria(), JSON_UNESCAPED_UNICODE);
}

function obtenerdatoscarroceria() {
	$solicit = new Solicitudes();
	return json_encode($solicit->obtenerdatoscarroceria(), JSON_UNESCAPED_UNICODE);
}

function cargarmunicipios() {
	$solicit = new Solicitudes();
	return json_encode($solicit->cargarmunicipios(), JSON_UNESCAPED_UNICODE);
}

function obtenerdatosmunicipio() {
	$solicit = new Solicitudes();
	return json_encode($solicit->obtenerdatosmunicipio(), JSON_UNESCAPED_UNICODE);
}

function verSolicitudesDeAgrupamiento() {
	$solicit = new Solicitudes();
	return json_encode($solicit->verSolicitudesDeAgrupamiento(), JSON_UNESCAPED_UNICODE);
}

?>
