<?php
include_once 'sec_ajax.php';
include "../models/solicitud_servicio.php";

$_msg_error = "";
$accion = $_REQUEST['accion'];
switch ($accion) {
	case 'editaSolicitudservice':
	echo editaSolicitudservice();
	break;	

}

function editaSolicitudservice() {
	// echo 'entro crear proveedor ajax';
  $vehic = new solicitud_servicio();
  return json_encode($vehic->editaSolicitudservice(), JSON_UNESCAPED_UNICODE);
}


?>