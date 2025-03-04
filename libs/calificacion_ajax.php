<?php
include_once 'sec_ajax.php';
include "../models/Calificacion.php";

$accion = $_REQUEST['accion'];

switch ($accion) {
  	case 'crearVehiculo':
    	echo crearVehiculo();
    break;
    case 'verVehiculo':
      echo verVehiculo();
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
    case 'verlistaCalificacion':
      echo verlistaCalificacion();
    break;
    case 'calificar_servicio':
      echo calificar_servicio();
    break;

  }
function crearVehiculo() {
  $calific = new Calificacion();
  return json_encode($calific->crearVehiculo(), JSON_UNESCAPED_UNICODE);
}
function verVehiculo() {
  $calific = new Calificacion();
  return json_encode($calific->verVehiculo(), JSON_UNESCAPED_UNICODE);
}
function editarVehiculo() {
  $calific = new Calificacion();
  return json_encode($calific->editarVehiculo(), JSON_UNESCAPED_UNICODE);
}
function verdatosActivarVehiculo() {
  $calific = new Calificacion();
  return json_encode($calific->verdatosActivarVehiculo(), JSON_UNESCAPED_UNICODE);
}
function activarVehiculo() {
  $calific = new Calificacion();
  return json_encode($calific->activarVehiculo(), JSON_UNESCAPED_UNICODE);
}
function inactivarVehiculo() {
  $calific = new Calificacion();
  return json_encode($calific->inactivarVehiculo(), JSON_UNESCAPED_UNICODE);
}
function cargarpropietario() {
  $calific = new Calificacion();
  return json_encode($calific->cargarpropietario(), JSON_UNESCAPED_UNICODE);
}
function cargartenedor() {
  $calific = new Calificacion();
  return json_encode($calific->cargartenedor(), JSON_UNESCAPED_UNICODE);
}
function cargarconductor() {
  $calific = new Calificacion();
  return json_encode($calific->cargarconductor(), JSON_UNESCAPED_UNICODE);
}
function obtenerdatosproveedor() {
  $calific = new Calificacion();
  return json_encode($calific->obtenerdatosproveedor(), JSON_UNESCAPED_UNICODE);
}
function verlistaCalificacion() {
  $calific = new Calificacion();
  return json_encode($calific->verlistaCalificacion(), JSON_UNESCAPED_UNICODE);
}
function calificar_servicio() {
  $calific = new Calificacion();
  return json_encode($calific->calificar_servicio(), JSON_UNESCAPED_UNICODE);
}

?>
