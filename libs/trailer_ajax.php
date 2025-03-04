<?php

include_once 'sec_ajax.php';
include "../models/Trailers.php";

$accion = $_REQUEST['accion'];
switch ($accion) {

case 'CrearTrailer':
	echo CrearTrailer();
break;

case 'EditarTrailer':
	// echo 'jadhjdh';
	echo EditarTrailer();
break;

}

function CrearTrailer() {
		// echo 'llego a aqui';
	$vehic = new Trailers();
	return json_encode($vehic->CrearTrailer(), JSON_UNESCAPED_UNICODE);
}

function EditarTrailer() {
	 // echo 'llego aquie';
	$vehic = new Trailers();
	return json_encode($vehic->EditarTrailer(), JSON_UNESCAPED_UNICODE);
}

?>

