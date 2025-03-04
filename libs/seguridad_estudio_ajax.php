<?php 
include_once 'sec_ajax.php';
include "../models/Seguridad_estudio.php";

$accion = $_REQUEST['accion'];

switch ($accion) {
	case 'iniciostudy':
		echo iniciostudy();
	break;
	case 'verVehiculo':
		// echo 'vervehijijiji';
		echo verVehiculo();
	break;

	case 'aprobarHVvehiculo':
		echo aprobarHVvehiculo();
	break;

	case 'desaprobarHVvehiculo':
		echo desaprobarHVvehiculo(); 
	break;

	case 'aprobarhvconductor':
		echo aprobarhvconductor();
	break;

	case 'desaprobarhvconductor':
		echo desaprobarhvconductor();
	break;

	case 'aprobar_risk':
		echo aprobar_risk();
	break;

	case 'desaprobar_risk':
		// echo 'jdhjskdhkj';
		echo desaprobar_risk();
	break;

	case 'aprobar_siplaft':
		echo aprobar_siplaft();
	break;

	case 'desaprobar_siplaft':
		echo desaprobar_siplaft();
	break;

	case 'aprobar_runt':
		echo aprobar_runt();
	break;

	case 'desaprobar_runt':
		echo desaprobar_runt();
	break;

	case 'aprobar_policia':
		 echo aprobar_policia();
	break;

	case 'desaprobar_policia':
	echo desaprobar_policia();
	break;

	case 'aprobar_procuraduria':
		echo aprobar_procuraduria();
	break;

	case 'desaprobar_procuraduria':
		echo desaprobar_procuraduria();
	break;

	case 'aprobar_simit':
		echo aprobar_simit();
	break;

	case 'desaprobar_simit':
		echo desaprobar_simit();
	break;

	case 'aprobar_siscomn':
		echo aprobar_siscomn();
	break;

	case 'desaprobar_siscomn':
		echo desaprobar_siscomn();
	break;

	case 'aprobar_adres':
		echo aprobar_adres();
	break;

	case 'desaprobar_adres':
	 	echo desaprobar_adres();
	break;

	case 'aprobacioncompleta':
		 // echo 'aprobarcompleto';
		aprobacioncompleta();
	break;

	case 'desaprobacioncompleta':
		// echo 'aprobarcompleto';
		desaprobacioncompleta();
	break;



	// case 'verlista':
	// 	verlista();
	// break;

}


function iniciostudy() {
		// echo 'aprobarcompleto2';
		$vehic = new Seguridad_estudio();
		return json_encode($vehic->iniciostudy(), JSON_UNESCAPED_UNICODE);
}

function aprobacioncompleta() {
		 // echo 'aprobarcompleto2';
		$vehic = new Seguridad_estudio();
		return json_encode($vehic->aprobacioncompleta(), JSON_UNESCAPED_UNICODE);
}

function desaprobacioncompleta() {
		// echo 'aprobarcompleto2';
		$vehic = new Seguridad_estudio();
		return json_encode($vehic->desaprobacioncompleta(), JSON_UNESCAPED_UNICODE);
}

function verVehiculo() {
		$vehic = new Seguridad_estudio();
		return json_encode($vehic->verVehiculo(), JSON_UNESCAPED_UNICODE);
	}

function aprobarHVvehiculo(){
	//echo 'ENTRO EN SEGURIDAD_ESTUDIO.PHP';
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->aprobarHVvehiculo(), JSON_UNESCAPED_UNICODE);
}	

function desaprobarHVvehiculo(){
	//echo 'ENTRO EN SEGURIDAD_ESTUDIO.PHP no aprobae';
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->desaprobarHVvehiculo(), JSON_UNESCAPED_UNICODE);
}

function aprobarhvconductor(){
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->aprobarhvconductor(), JSON_UNESCAPED_UNICODE);
}

function desaprobarhvconductor(){
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->desaprobarhvconductor(), JSON_UNESCAPED_UNICODE);
}

function aprobar_risk(){
	// echo 'aprobar risk';
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->aprobar_risk(), JSON_UNESCAPED_UNICODE);
}

function desaprobar_risk(){
	// echo 'DESAPROBAR RISK';
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->desaprobar_risk(), JSON_UNESCAPED_UNICODE);
}

function aprobar_siplaft(){
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->aprobar_siplaft(), JSON_UNESCAPED_UNICODE);
}

function desaprobar_siplaft(){
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->desaprobar_siplaft(), JSON_UNESCAPED_UNICODE);
}

function aprobar_runt(){
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->aprobar_runt(), JSON_UNESCAPED_UNICODE);
}

function desaprobar_runt(){
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->desaprobar_runt(), JSON_UNESCAPED_UNICODE);
}

function aprobar_policia(){
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->aprobar_policia(), JSON_UNESCAPED_UNICODE);
}

function desaprobar_policia(){
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->desaprobar_policia(), JSON_UNESCAPED_UNICODE);
}

function aprobar_procuraduria(){
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->aprobar_procuraduria(), JSON_UNESCAPED_UNICODE);
}

function desaprobar_procuraduria(){
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->desaprobar_procuraduria(), JSON_UNESCAPED_UNICODE);
}

function aprobar_simit(){
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->aprobar_simit(), JSON_UNESCAPED_UNICODE);
}

function desaprobar_simit(){
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->desaprobar_simit(), JSON_UNESCAPED_UNICODE);
}

function aprobar_siscomn(){
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->aprobar_siscomn(), JSON_UNESCAPED_UNICODE);
}

function desaprobar_siscomn(){
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->desaprobar_siscomn(), JSON_UNESCAPED_UNICODE);
}

function aprobar_adres(){
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->aprobar_adres(), JSON_UNESCAPED_UNICODE);
}

function desaprobar_adres(){
	$vehic = new Seguridad_estudio();
	return json_encode($vehic->desaprobar_adres(), JSON_UNESCAPED_UNICODE);
}

// function verlista(){
// 	 // echo 'paso por aqui';
// 	$vehic = new Seguridad_estudio();
// 	return json_encode($vehic->verlista(), JSON_UNESCAPED_UNICODE);
// }

?>