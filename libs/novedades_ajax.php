<?php
include("../application/Config.php");
include '../application/Conexion.php';
include '../application/Model.php';
$Data = new Consultas;

switch($_REQUEST['action']) {

	case 'ver_cotizacion':
		$fi=$_REQUEST["fecha_inicial"];
		$ff=$_REQUEST["fecha_final"];
		$sql="
			SELECT * FROM cmx_cotizaciones_serviciocliente
			WHERE fecha_creacion BETWEEN '".$fi."' AND '".$ff."'
		";
		// echo $sql;
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'ver_solicitudes':
		$fi=$_REQUEST["fecha_inicial"];
		$ff=$_REQUEST["fecha_final"];
		$sql="
			SELECT * FROM cmx_solicitud_vehiculo2
			WHERE fecha BETWEEN '".$fi."' AND '".$ff."';
			";
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'ver_conductor':
		$fi=$_REQUEST["fecha_inicial"];
		$ff=$_REQUEST["fecha_final"];
		$sql="
			SELECT p.numero_documento, p.nombre,p.celular,p.rndc_categoria_licencia  FROM cmx_proveedores p
			INNER JOIN cmx_detalle_conductor c
			INNER JOIN cmx_log_proveedores l
			ON p.id=c.id_proveedor AND p.id=l.id_proveedor
			WHERE fecha_hora_operacion BETWEEN '".$fi."' AND '".$ff."';

		";
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;
	
	case 'ver_vehiculo':
	$fi=$_REQUEST["fecha_inicial"];
	$ff=$_REQUEST["fecha_final"];
	$sql="	
	";
	$result = $Data->getConsulta($sql);
	$return["result"] = $result["rowsData"];
	break;

	case 'ver_trailer':
	$fi=$_REQUEST["fecha_inicial"];
	$ff=$_REQUEST["fecha_final"];
	$sql="	
		SELECT t.placa,t.peso_vacio, t.modelo, t.estado  FROM cmx_trailer t
		INNER JOIN cmx_log_trailers l
		ON t.id=l.id_trailer
		WHERE l.fecha BETWEEN '".$fi."' AND '".$ff."';
	";
	$result = $Data->getConsulta($sql);
	$return["result"] = $result["rowsData"];
	break;

	case 'ver_estudio':
		$fi=$_REQUEST["fecha_inicial"];
		$ff=$_REQUEST["fecha_final"];
		$sql="	
		 	SELECT es.id_estudio, es.usuario, es.fecha, es.hora  
		 	FROM cmx_estudio_vehiculo es
			WHERE fecha BETWEEN '".$fi."' AND '".$ff."';
		";
		$result = $Data->getConsulta($sql);
		$return["result"] = $result["rowsData"];
	break;

	case 'registrar_novedad':
		$codigo=$_REQUEST["codigo"];
		$valor=$_REQUEST["valor"];
		$tiponovenumero=$_REQUEST["tiponovenumero"];
		$factual=$_REQUEST["factual"];
		$hactual=$_REQUEST["hactual"];
		$user=$_REQUEST["user"];
		$fecha=$_REQUEST["fecha"];
		$hora=$_REQUEST["hora"];
		$tipo_documento=$_REQUEST["tipo_documento"];
		if($_REQUEST["nove1"]){
			$nove1=$_REQUEST["nove1"];
		}else{
			$nove1='';
		}

		if($_REQUEST["nove2"]){
			$nove2=$_REQUEST["nove2"];
		}else{
			$nove2='';
		}

		$sql='
			INSERT INTO cmx_novedades2(id,codigo_nove,numero_solicitud,tipo_documento,tipo_novedad,fecha_actual,hora_actual,usuario,fecha,hora,novedad_1,novedad_2)
			VALUES(NULL,'.$codigo.','.$valor.','.$tipo_documento.',"'.$tiponovenumero.'","'.$factual.'","'.$hactual.'","'.$user.'","'.$fecha.'","'.$hora.'","'.$nove1.'","'.$nove2.'");
		';
		// echo $sql;
		$result = $Data-> ejecuteRegistro($sql);
		$return["result"] = $result["rowsData"];
	break;



}

$return["result"] = $result["rowsData"];
echo json_encode($return);
?>