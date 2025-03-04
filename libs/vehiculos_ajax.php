<?php
include_once 'sec_ajax.php';
include "../models/Vehiculos.php";

$accion = $_REQUEST['accion'];

switch ($accion) {
	case 'crearVehiculo':
		echo crearVehiculo();
		break;
	case 'CrearTrailer':
		echo CrearTrailer();
		break;
	case 'verVehiculo':
		echo verVehiculo();
		break;
	case 'verVehiculoPlaca':
		echo verVehiculoPlaca();
		break;
	case 'editarvehiculonew':
		echo editarvehiculonew();
		break;
	case 'EditarTrailer':
		// echo 'jadhjdh';
		echo EditarTrailer();
		break;
	case 'editarVehiculo':
		echo editarVehiculo();
		break;
	case 'verdatosActivarVehiculo':
		echo verdatosActivarVehiculo();
		break;
	case 'activarVehiculo':
		echo activarVehiculo();
		break;
	case 'inactivarVehiculo':
		echo inactivarVehiculo();
		break;
	case 'cargarpropietario':
		echo cargarpropietario();
		break;
	case 'cargartenedor':
		echo cargartenedor();
		break;
	case 'cargarconductor':
		echo cargarconductor();
		break;
	case 'obtenerdatosproveedor':
		echo obtenerdatosproveedor();
		break;
	case 'verificarvehiculosexistentes':
		echo verificarvehiculosexistentes();
		break;
	case 'cargartiposvehiculos':
		echo cargartiposvehiculos();
		break;
	case 'obtenerdatosvehiculos':
		echo obtenerdatosvehiculos();
		break;
	case 'rndc_cargarconfiguracion':
		echo rndc_cargarconfiguracion();
		break;
	case 'rndc_obtenerdatosconfiguracion':
		echo rndc_obtenerdatosconfiguracion();
		break;
	case 'rndc_cargarcolor':
		echo rndc_cargarcolor();
		break;
	case 'rndc_obtenerdatoscolor':
		echo rndc_obtenerdatoscolor();
		break;
	case 'rndc_cargarmarca':
		echo rndc_cargarmarca();
		break;
	case 'rndc_obtenerdatosmarca':
		echo rndc_obtenerdatosmarca();
		break;
	case 'rndc_cargarlinea':
		echo rndc_cargarlinea();
		break;
	case 'rndc_obtenerdatoslinea':
		echo rndc_obtenerdatoslinea();
		break;
	case 'rndc_verificalinea':
		echo rndc_verificalinea();
		break;
	case 'rndc_cargarcarroceria':
		echo rndc_cargarcarroceria();
		break;
	case 'rndc_obtenerdatoscarroceria':
		echo rndc_obtenerdatoscarroceria();
		break;
	case 'rndc_cargaraseguradora':
		echo rndc_cargaraseguradora();
		break;
	case 'rndc_obtenerdatosaseguradora':
		echo rndc_obtenerdatosaseguradora();
		break;
	case 'TraerSatelital':
		TraerSatelital();
		break;
}

function crearVehiculo()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->crearVehiculo(), JSON_UNESCAPED_UNICODE);
}
function CrearTrailer()
{
	// echo 'llego a aqui';
	$vehic = new Vehiculos();
	return json_encode($vehic->CrearTrailer(), JSON_UNESCAPED_UNICODE);
}
function verVehiculo()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->verVehiculo(), JSON_UNESCAPED_UNICODE);
}
function verVehiculoPlaca()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->verVehiculoPlaca(), JSON_UNESCAPED_UNICODE);
}
function editarvehiculonew()
{
	// echo 'EDITARVEHICULONEW';
	$vehic = new Vehiculos();
	return json_encode($vehic->editarvehiculonew(), JSON_UNESCAPED_UNICODE);
}
function EditarTrailer()
{
	// echo 'llego aquie';
	$vehic = new Vehiculos();
	return json_encode($vehic->EditarTrailer(), JSON_UNESCAPED_UNICODE);
}
function editarVehiculo()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->editarVehiculo(), JSON_UNESCAPED_UNICODE);
}
function verdatosActivarVehiculo()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->verdatosActivarVehiculo(), JSON_UNESCAPED_UNICODE);
}
function activarVehiculo()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->activarVehiculo(), JSON_UNESCAPED_UNICODE);
}
function inactivarVehiculo()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->inactivarVehiculo(), JSON_UNESCAPED_UNICODE);
}
function cargarpropietario()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->cargarpropietario(), JSON_UNESCAPED_UNICODE);
}
function cargartenedor()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->cargartenedor(), JSON_UNESCAPED_UNICODE);
}
function cargarconductor()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->cargarconductor(), JSON_UNESCAPED_UNICODE);
}
function obtenerdatosproveedor()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->obtenerdatosproveedor(), JSON_UNESCAPED_UNICODE);
}
function verificarvehiculosexistentes()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->verificarvehiculosexistentes(), JSON_UNESCAPED_UNICODE);
}
function cargartiposvehiculos()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->cargartiposvehiculos(), JSON_UNESCAPED_UNICODE);
}
function obtenerdatosvehiculos()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->obtenerdatosvehiculos(), JSON_UNESCAPED_UNICODE);
}
function rndc_cargarconfiguracion()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->rndc_cargarconfiguracion(), JSON_UNESCAPED_UNICODE);
}
function rndc_obtenerdatosconfiguracion()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->rndc_obtenerdatosconfiguracion(), JSON_UNESCAPED_UNICODE);
}
function rndc_cargarcolor()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->rndc_cargarcolor(), JSON_UNESCAPED_UNICODE);
}
function rndc_obtenerdatoscolor()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->rndc_obtenerdatoscolor(), JSON_UNESCAPED_UNICODE);
}
function rndc_cargarmarca()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->rndc_cargarmarca(), JSON_UNESCAPED_UNICODE);
}
function rndc_obtenerdatosmarca()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->rndc_obtenerdatosmarca(), JSON_UNESCAPED_UNICODE);
}
function rndc_cargarlinea()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->rndc_cargarlinea(), JSON_UNESCAPED_UNICODE);
}
function rndc_obtenerdatoslinea()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->rndc_obtenerdatoslinea(), JSON_UNESCAPED_UNICODE);
}
function rndc_verificalinea()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->rndc_verificalinea(), JSON_UNESCAPED_UNICODE);
}
function rndc_cargarcarroceria()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->rndc_cargarcarroceria(), JSON_UNESCAPED_UNICODE);
}
function rndc_obtenerdatoscarroceria()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->rndc_obtenerdatoscarroceria(), JSON_UNESCAPED_UNICODE);
}
function rndc_cargaraseguradora()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->rndc_cargaraseguradora(), JSON_UNESCAPED_UNICODE);
}
function rndc_obtenerdatosaseguradora()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->rndc_obtenerdatosaseguradora(), JSON_UNESCAPED_UNICODE);
}

function TraerSatelital()
{
	$vehic = new Vehiculos();
	return json_encode($vehic->TraerSatelital(), JSON_UNESCAPED_UNICODE);
}
