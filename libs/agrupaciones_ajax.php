<?php
include_once 'sec_ajax.php';
include "../models/Agrupaciones.php";

$accion = $_REQUEST['accion'];

switch ($accion) {
    case 'verdatossolicitud':
      echo verdatossolicitud();
        break;
    case 'agruparsolicitudes':
      echo agruparsolicitudes();
        break;
    case 'desagruparsolicitudes':
    	echo desagruparsolicitudes();
        break;
    case 'cargartiposvehiculos':
        echo cargartiposvehiculos();
      break;
    case 'obtenerdatosvehiculos':
        echo obtenerdatosvehiculos();
      break;  
    case 'vermaterialsolicitud':
        echo vermaterialsolicitud();
      break;  
    case 'buscartarifa':
        echo buscartarifa();
      break;  
    case 'buscaTarifaAdicional':
        echo buscaTarifaAdicional();
      break;  
    case 'buscaDesconsolidacion':
        echo buscaDesconsolidacion();
      break;  

  }
function verdatossolicitud() {
  $vehic = new Agrupaciones();
  return json_encode($vehic->verdatossolicitud(), JSON_UNESCAPED_UNICODE);
}
function agruparsolicitudes() {
  $vehic = new Agrupaciones();
  return json_encode($vehic->agruparsolicitudes(), JSON_UNESCAPED_UNICODE);
}
function desagruparsolicitudes() {
  $vehic = new Agrupaciones();
  return json_encode($vehic->desagruparsolicitudes(), JSON_UNESCAPED_UNICODE);
}
function cargartiposvehiculos() {
  $vehic = new Agrupaciones();
  return json_encode($vehic->cargartiposvehiculos(), JSON_UNESCAPED_UNICODE);
}
function obtenerdatosvehiculos() {
  $vehic = new Agrupaciones();
  return json_encode($vehic->obtenerdatosvehiculos(), JSON_UNESCAPED_UNICODE);
}
function vermaterialsolicitud() {
  $vehic = new Agrupaciones();
  return json_encode($vehic->vermaterialsolicitud(), JSON_UNESCAPED_UNICODE);
}
function buscartarifa() {
  $vehic = new Agrupaciones();
  return json_encode($vehic->buscartarifa(), JSON_UNESCAPED_UNICODE);
}
function buscaTarifaAdicional() {
  $vehic = new Agrupaciones();
  return json_encode($vehic->buscaTarifaAdicional(), JSON_UNESCAPED_UNICODE);
}
function buscaDesconsolidacion() {
  $vehic = new Agrupaciones();
  return json_encode($vehic->buscaDesconsolidacion(), JSON_UNESCAPED_UNICODE);
}
?>
