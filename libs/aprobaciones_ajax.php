<?php
include_once 'sec_ajax.php';
include "../models/Aprobaciones.php";

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
    case 'verVehiculo':
      echo verVehiculo();
    break;

  }
  
  
function buscarAgrupamientovehiculos() {
  $vehic = new Aprobaciones();
  return json_encode($vehic->buscarAgrupamientovehiculos(), JSON_UNESCAPED_UNICODE);
}
function obtenerdatosvehiculos() {
  $vehic = new Aprobaciones();
  return json_encode($vehic->obtenerdatosvehiculos(), JSON_UNESCAPED_UNICODE);
}
function cargarvehiculos() {
  $vehic = new Aprobaciones();
  return json_encode($vehic->cargarvehiculos(), JSON_UNESCAPED_UNICODE);
}
function crearAsignacion() {
  $vehic = new Aprobaciones();
  return json_encode($vehic->crearAsignacion(), JSON_UNESCAPED_UNICODE);
}
function cancelarAsignacion() {
  $vehic = new Aprobaciones();
  return json_encode($vehic->cancelarAsignacion(), JSON_UNESCAPED_UNICODE);
}
function cambiarestadoAsignacion() {
  $vehic = new Aprobaciones();
  return json_encode($vehic->cambiarestadoAsignacion(), JSON_UNESCAPED_UNICODE);
}
function verasignacion() {
  $vehic = new Aprobaciones();
  return json_encode($vehic->verasignacion(), JSON_UNESCAPED_UNICODE);
}
function verVehiculo() {
  $vehic = new Aprobaciones();
  return json_encode($vehic->verVehiculo(), JSON_UNESCAPED_UNICODE);
}
?>
