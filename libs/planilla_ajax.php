<?php
include_once 'sec_ajax.php';
include "../models/Planillar_vehiculo.php";
include "../models/Crear_planilla.php";


$accion = $_REQUEST['accion'];
switch ($accion) {
		case 'Creaciondeplanilla':
		echo Creaciondeplanilla();
		break;	

		case 'Ediciondeplanilla':
		echo Ediciondeplanilla();
		break;

		case 'Solicitainicioruta':
		echo Solicitainicioruta();
		break;	

		case 'Creacionbloque':
			echo Creacionbloque();
		break;

		case 'Creacionprecinto':
			echo Creacionprecinto();
		break;


}


function Creaciondeplanilla() {
	/*$planilla = new Planillar_vehiculo();
	return json_encode($planilla->Creaciondeplanilla(), JSON_UNESCAPED_UNICODE);*/
	  $planilla = new Planillar_vehiculon();
	  return json_encode($planilla->Creaciondeplanilla(), JSON_UNESCAPED_UNICODE);
}

function Ediciondeplanilla() {
	  $planilla = new Planillar_vehiculo();
	  return json_encode($planilla->Ediciondeplanilla(), JSON_UNESCAPED_UNICODE);
}

function Solicitainicioruta() {
		// echo 'entro crear proveedor ajax';
	  $planilla = new Planillar_vehiculo();
	  return json_encode($planilla->Solicitainicioruta(), JSON_UNESCAPED_UNICODE);
}


function Creacionbloque() {
		// echo 'entro crear proveedor ajax';
	  $planilla = new Planillar_vehiculon();
	  return json_encode($planilla->Creacionbloque(), JSON_UNESCAPED_UNICODE);
}


function Creacionprecinto() {
		// echo 'entro crear proveedor ajax';
	  $planilla = new Planillar_vehiculon();
	  return json_encode($planilla->Creacionprecinto(), JSON_UNESCAPED_UNICODE);
}


?>