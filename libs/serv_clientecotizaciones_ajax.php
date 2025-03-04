<?php
include_once 'sec_ajax.php';
include "../models/serviciocliente.php";
include "../models/servicioclientepdf.php";

// include '../application/Conexion.php';
// include '../application/Model.php';
$_msg_error = "";


$accion = $_REQUEST['accion'];
switch ($accion) {
	case 'crearCotizacion':
	echo crearCotizacion();
	break;	

	case 'enviar_correo':
	echo enviarcorreo();
	break;

}

function crearCotizacion() {
	// echo 'entro crear proveedor ajax';
  /*$vehic = new serviciocliente();
  return json_encode($vehic->crearCotizacion(), JSON_UNESCAPED_UNICODE);*/
  
  //echo 'entro a crear cotizacion';
}

function enviarcorreo(){
  $vehic = new servicioclientepdf();
  return json_encode($vehic->enviarcorreo(), JSON_UNESCAPED_UNICODE);
}

?>