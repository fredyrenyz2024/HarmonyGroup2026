<?php 
	include("../application/Config.php");
	include '../application/Conexion.php';
	// configuracion de la zona horaria
	date_default_timezone_set('America/Bogota');

	// print_r("Entro en archivo buscar_tramos.php\n");
	$Data = new Consultas;

	// // RECIBO LOS PARAMETROS POR GET
	// print_r("Array del GET\n");
	// print_r($_GET);

	$arrayId_actividad = explode(",", $_GET['id_actividad']);

	$sql = '
			SELECT 
				*
			FROM 
				cmx_importacion_seguimiento_rutas cisr
			WHERE 
				cisr.id_actividad = ' . $arrayId_actividad[0] . '
				AND cisr.estado = 1
			ORDER BY cisr.fecha_hora;
	';
	// print_r($sql);
	$resul_00 = $Data->getConsulta($sql);
	// print_r( $resul_00 );

	header("Content-type: text/xml");

	// Start XML file, echo parent node
	echo '<markers>';
	foreach ( $resul_00["rowsData"] as $key_00 => $value_00 ) {
		// Add to XML document node
		echo '<marker ';
		echo 'tipo_seguimiento_ruta="' . parseToXML($value_00['tipo_seguimiento_ruta']) . '" ';
		echo 'observacion="' . parseToXML($value_00['observacion']) . '" ';
		echo 'fecha_hora="' . parseToXML($value_00['fecha_hora']) . '" ';
		echo 'latitud="' . $value_00['latitud'] . '" ';
		echo 'longitud="' . $value_00['longitud'] . '" ';
		echo '/>';
	}
	// End XML file
	echo '</markers>';


	function parseToXML($htmlStr){
		$xmlStr=str_replace('<','&lt;',$htmlStr);
		$xmlStr=str_replace('>','&gt;',$xmlStr);
		$xmlStr=str_replace('"','&quot;',$xmlStr);
		$xmlStr=str_replace("'",'&#39;',$xmlStr);
		$xmlStr=str_replace("&",'&amp;',$xmlStr);
		return $xmlStr;
	}

?>
