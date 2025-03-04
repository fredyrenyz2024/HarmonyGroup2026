<?php 
	include("../application/Config.php");
	include '../application/Conexion.php';

	print_r("Ingreso al archivo insertar_plantilla.php\n");

	// print_r("Array del post \n");
	// print_r($_POST);

	// print_r("Array del get \n");
	// print_r($_GET);

	$Data = new Consultas;

	$table = $_GET['tabla'];
	if(isset($_GET['relacion'])){
		$tableRelacion = $_GET['relacion'];
		$campoRelacion = $_GET['campo_relacion'];
	}
	// // Se consulta si la actividad previa es de bloque
	// $sql = '
	// 	SELECT
	// 		cap.bloque
	// 	FROM 
	// 		cmx_actividades_plantilla cap
	// 		INNER JOIN cmx_plantillas cp ON cp.id = cap.id_plantilla
	// 	WHERE
	// 		cp.id = ' . $_POST["id_plantilla"] . '
	// 		AND cap.orden = ' . $_POST["actividad_previa"] . ';
	// ';
	// // print_r($sql);
	// $valida_bloque = $Data->getConsulta($sql);

	$array = array();

	foreach($_POST as $key => $value){
		if($key != 'id_relacion'){
			$array[$key]=$value;
		}
	} 

	// Se filtra el tipo de integracion de las actividades 
	switch ($array["integracion"]) {
		case 'soluciones_importacion':
			$array["integracion"] = "soluciones";
			$array["sub_integracion"] = "importacion";

			// Se busca los simultaneos disponibles del proyecto
			$araySimultaneos = buscaSimutaneos( $Data, $array["id_plantilla"] );
			$array["simultaneo"] = $araySimultaneos[1];
			break;

		case 'soluciones_exportacion':
			$array["integracion"] = "soluciones";
			$array["sub_integracion"] = "exportacion";
			break;

		default:
			# code...
			break;
	}
	// print_r($array);
	$Data->setRegistro($table, $array);


	// Actividades de integracion
	switch ($_POST['integracion']) {
		case 'soluciones':
			print_r("Se crean las actividades de integración de soluciones");
			// Se crea la actividad "Editar y aprobar solicitud para agrupamiento"
			$arrayActividad_1["orden"] 				= $array["orden"] + 1;
			$arrayActividad_1["bloque"] 			= $array["bloque"] + 1;
			$arrayActividad_1["actividad_previa"] 	= $array["actividad_previa"] + 1;
			$arrayActividad_1["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_1["nombre"] 			= "Editar y aprobar solicitud para agrupamiento";
			$arrayActividad_1["descripcion"] 		= "Se agrega el tipo de movilización para la mercancía y se agregan los puntos de carge y descargue.";
			$arrayActividad_1["tiempo_estimado"] 	= 60;
			$arrayActividad_1["integracion"] 		= $_POST['integracion'];
			$arrayActividad_1["costo_estimado"] 	= 0;
			$arrayActividad_1["moneda"] 			= 2;
			$arrayActividad_1["id_centro_costo"] 	= 5;
			// $arrayActividad_1["responsable"] 		= "";
			// print_r($arrayActividad_1);
			$Data->setRegistro($table, $arrayActividad_1);

			// Se crea la actividad "Agrupación y desagrupación de solicitudes"
			$arrayActividad_2["orden"] 				= $array["orden"] + 2;
			$arrayActividad_2["bloque"] 			= $array["bloque"] + 2;
			$arrayActividad_2["actividad_previa"] 	= $array["actividad_previa"] + 2;
			$arrayActividad_2["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_2["nombre"] 			= "Agrupación y desagrupación de solicitudes";
			$arrayActividad_2["descripcion"] 		= "Desconsolidación y agrupación de materiales para asignación de vehículo para despacho.";
			$arrayActividad_2["tiempo_estimado"] 	= 60;
			$arrayActividad_2["integracion"] 		= $_POST['integracion'];
			$arrayActividad_2["costo_estimado"] 	= 0;
			$arrayActividad_2["moneda"] 			= 2;
			$arrayActividad_2["id_centro_costo"] 	= 5;
			// $arrayActividad_2["responsable"] 		= "";
			// print_r($arrayActividad_2);
			$Data->setRegistro($table, $arrayActividad_2);

			// Se crea la actividad "Asignar Vehículo"
			$arrayActividad_3["orden"] 				= $array["orden"] + 3;
			$arrayActividad_3["bloque"] 			= $array["bloque"] + 3;
			$arrayActividad_3["actividad_previa"] 	= $array["actividad_previa"] + 3;
			$arrayActividad_3["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_3["nombre"] 			= "Asignar Vehículo";
			$arrayActividad_3["descripcion"] 		= "Se postulan vehículos para un agrupamiento de materiales.";
			$arrayActividad_3["tiempo_estimado"] 	= 60;
			$arrayActividad_3["integracion"] 		= $_POST['integracion'];
			$arrayActividad_3["costo_estimado"] 	= 0;
			$arrayActividad_3["moneda"] 			= 2;
			$arrayActividad_3["id_centro_costo"] 	= 5;
			// $arrayActividad_3["responsable"] 		= "";
			// print_r($arrayActividad_3);
			$Data->setRegistro($table, $arrayActividad_3);

			// Se crea la actividad "Aprobar Vehículo"
			$arrayActividad_4["orden"] 				= $array["orden"] + 4;
			$arrayActividad_4["bloque"] 			= $array["bloque"] + 4;
			$arrayActividad_4["actividad_previa"] 	= $array["actividad_previa"] + 4;
			$arrayActividad_4["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_4["nombre"] 			= "Aprobar Vehículo";
			$arrayActividad_4["descripcion"] 		= "Se aprueba un vehículo de los postulados del un agrupamiento de materiales.";
			$arrayActividad_4["tiempo_estimado"] 	= 60;
			$arrayActividad_4["integracion"] 		= $_POST['integracion'];
			$arrayActividad_4["costo_estimado"] 	= 0;
			$arrayActividad_4["moneda"] 			= 2;
			$arrayActividad_4["id_centro_costo"] 	= 7;
			// $arrayActividad_4["responsable"] 		= "";
			// print_r($arrayActividad_4);
			$Data->setRegistro($table, $arrayActividad_4);

			// Se crea la actividad "Planillar Vehículo"
			$arrayActividad_5["orden"] 				= $array["orden"] + 5;
			$arrayActividad_5["bloque"] 			= $array["bloque"] + 5;
			$arrayActividad_5["actividad_previa"] 	= $array["actividad_previa"] + 5;
			$arrayActividad_5["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_5["nombre"] 			= "Planillar Vehículo";
			$arrayActividad_5["descripcion"] 		= "Operaciones planilla el vehículo y entrega documentos al conductor.";
			$arrayActividad_5["tiempo_estimado"] 	= 60;
			$arrayActividad_5["integracion"] 		= "soluciones";
			$arrayActividad_5["sub_integracion"] 	= "importacion";
			$arrayActividad_5["costo_estimado"] 	= 0;
			$arrayActividad_5["moneda"] 			= 2;
			$arrayActividad_5["id_centro_costo"] 	= 7;
			// $arrayActividad_5["responsable"] 		= "";
			// print_r($arrayActividad_5);
			$Data->setRegistro($table, $arrayActividad_5);

			// Se crea la actividad "Cargas y Descargas"
			$arrayActividad_6["orden"] 				= $array["orden"] + 6;
			$arrayActividad_6["bloque"] 			= $array["bloque"] + 6;
			$arrayActividad_6["actividad_previa"] 	= $array["actividad_previa"] + 6;
			$arrayActividad_6["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_6["nombre"] 			= "Validar Cargas";
			$arrayActividad_6["descripcion"] 		= "Se verfica que el vehículo ya halla cargado el material.";
			$arrayActividad_6["tiempo_estimado"] 	= 60;
			$arrayActividad_6["integracion"] 		= $_POST['integracion'];
			$arrayActividad_6["costo_estimado"] 	= 0;
			$arrayActividad_6["moneda"] 			= 2;
			$arrayActividad_6["id_centro_costo"] 	= 7;
			$arrayActividad_6["tipo_actividad"] 	= "carga_inicial";
			// $arrayActividad_6["responsable"] 		= "";
			// print_r($arrayActividad_6);
			$Data->setRegistro($table, $arrayActividad_6);

			// Se crea la actividad "Anticipo"
			$arrayActividad_7["orden"] 				= $array["orden"] + 7;
			$arrayActividad_7["bloque"] 			= $array["bloque"] + 7;
			$arrayActividad_7["actividad_previa"] 	= $array["actividad_previa"] + 7;
			$arrayActividad_7["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_7["nombre"] 			= "Generar Anticipo";
			$arrayActividad_7["descripcion"] 		= "Se asigna la documentación necesaria para el despacho del vehículo y se asigna la tarjeta y la clave para que el conductor pueda retirar el anticipo.";
			$arrayActividad_7["tiempo_estimado"] 	= 60;
			$arrayActividad_7["integracion"] 		= $_POST['integracion'];
			$arrayActividad_7["costo_estimado"] 	= 0;
			$arrayActividad_7["moneda"] 			= 2;
			$arrayActividad_7["id_centro_costo"] 	= 7;
			$arrayActividad_7["tipo_actividad"] 	= "anticipo";
			// $arrayActividad_7["responsable"] 		= "";
			// print_r($arrayActividad_7);
			$Data->setRegistro($table, $arrayActividad_7);

			break;

		case 'soluciones_importacion':
			print_r("Se crean las actividades de integración de soluciones de importacion");
			// Se crea la actividad "Editar y aprobar solicitud para agrupamiento"
			$arrayActividad_1["orden"] 				= $array["orden"] + 1;
			$arrayActividad_1["bloque"] 			= $array["bloque"] + 1;
			$arrayActividad_1["simultaneo"] 		= $araySimultaneos[1];
			$arrayActividad_1["actividad_previa"] 	= $array["actividad_previa"] + 1;
			$arrayActividad_1["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_1["nombre"] 			= "Editar y aprobar solicitud para agrupamiento";
			$arrayActividad_1["descripcion"] 		= "Se agrega el tipo de movilización para la mercancía y se agregan los puntos de carge y descargue.";
			$arrayActividad_1["tiempo_estimado"] 	= 60;
			$arrayActividad_1["integracion"] 		= "soluciones";
			$arrayActividad_1["sub_integracion"] 	= "importacion";
			$arrayActividad_1["costo_estimado"] 	= 0;
			$arrayActividad_1["moneda"] 			= 2;
			$arrayActividad_1["id_centro_costo"] 	= 5;
			// $arrayActividad_1["responsable"] 		= "";
			// print_r($arrayActividad_1);
			$Data->setRegistro($table, $arrayActividad_1);

			// Se crea la actividad "Agrupación y desagrupación de solicitudes"
			$arrayActividad_2["orden"] 				= $array["orden"] + 2;
			$arrayActividad_2["bloque"] 			= $array["bloque"] + 2;
			$arrayActividad_2["simultaneo"] 		= $araySimultaneos[1];
			$arrayActividad_2["actividad_previa"] 	= $array["actividad_previa"] + 2;
			$arrayActividad_2["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_2["nombre"] 			= "Agrupación y desagrupación de solicitudes";
			$arrayActividad_2["descripcion"] 		= "Desconsolidación y agrupación de materiales para asignación de vehículo para despacho.";
			$arrayActividad_2["tiempo_estimado"] 	= 60;
			$arrayActividad_2["integracion"] 		= "soluciones";
			$arrayActividad_2["sub_integracion"] 	= "importacion";
			$arrayActividad_2["costo_estimado"] 	= 0;
			$arrayActividad_2["moneda"] 			= 2;
			$arrayActividad_2["id_centro_costo"] 	= 5;
			// $arrayActividad_2["responsable"] 		= "";
			// print_r($arrayActividad_2);
			$Data->setRegistro($table, $arrayActividad_2);

			// Se crea la actividad "Asignar Vehículo"
			$arrayActividad_3["orden"] 				= $array["orden"] + 3;
			$arrayActividad_3["bloque"] 			= $array["bloque"] + 3;
			$arrayActividad_3["simultaneo"] 		= $araySimultaneos[1];
			$arrayActividad_3["actividad_previa"] 	= $array["actividad_previa"] + 3;
			$arrayActividad_3["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_3["nombre"] 			= "Asignar Vehículo";
			$arrayActividad_3["descripcion"] 		= "Se postulan vehículos para un agrupamiento de materiales.";
			$arrayActividad_3["tiempo_estimado"] 	= 60;
			$arrayActividad_3["integracion"] 		= "soluciones";
			$arrayActividad_3["sub_integracion"] 	= "importacion";
			$arrayActividad_3["costo_estimado"] 	= 0;
			$arrayActividad_3["moneda"] 			= 2;
			$arrayActividad_3["id_centro_costo"] 	= 5;
			// $arrayActividad_3["responsable"] 		= "";
			// print_r($arrayActividad_3);
			$Data->setRegistro($table, $arrayActividad_3);

			// Se crea la actividad "Aprobar Vehículo"
			$arrayActividad_4["orden"] 				= $array["orden"] + 4;
			$arrayActividad_4["bloque"] 			= $array["bloque"] + 4;
			$arrayActividad_4["simultaneo"] 		= $araySimultaneos[1];
			$arrayActividad_4["actividad_previa"] 	= $array["actividad_previa"] + 4;
			$arrayActividad_4["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_4["nombre"] 			= "Aprobar Vehículo";
			$arrayActividad_4["descripcion"] 		= "Se aprueba un vehículo de los postulados del un agrupamiento de materiales.";
			$arrayActividad_4["tiempo_estimado"] 	= 60;
			$arrayActividad_4["integracion"] 		= "soluciones";
			$arrayActividad_4["sub_integracion"] 	= "importacion";
			$arrayActividad_4["costo_estimado"] 	= 0;
			$arrayActividad_4["moneda"] 			= 2;
			$arrayActividad_4["id_centro_costo"] 	= 7;
			// $arrayActividad_4["responsable"] 		= "";
			// print_r($arrayActividad_4);
			$Data->setRegistro($table, $arrayActividad_4);

			// Se crea la actividad "Planillar Vehículo"
			$arrayActividad_5["orden"] 				= $array["orden"] + 5;
			$arrayActividad_5["bloque"] 			= $array["bloque"] + 5;
			$arrayActividad_5["simultaneo"] 		= $araySimultaneos[1];
			$arrayActividad_5["actividad_previa"] 	= $array["actividad_previa"] + 5;
			$arrayActividad_5["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_5["nombre"] 			= "Planillar Vehículo";
			$arrayActividad_5["descripcion"] 		= "Operaciones planilla el vehículo y entrega documentos al conductor.";
			$arrayActividad_5["tiempo_estimado"] 	= 60;
			$arrayActividad_5["integracion"] 		= "soluciones";
			$arrayActividad_5["sub_integracion"] 	= "importacion";
			$arrayActividad_5["costo_estimado"] 	= 0;
			$arrayActividad_5["moneda"] 			= 2;
			$arrayActividad_5["id_centro_costo"] 	= 5;
			// $arrayActividad_5["responsable"] 		= "";
			// print_r($arrayActividad_5);
			$Data->setRegistro($table, $arrayActividad_5);

			// Se crea la actividad "Generar Anticipo"
			$arrayActividad_6["orden"] 				= $array["orden"] + 6;
			$arrayActividad_6["bloque"] 			= $array["bloque"] + 6;
			$arrayActividad_6["simultaneo"] 		= $araySimultaneos[1];
			$arrayActividad_6["actividad_previa"] 	= $array["actividad_previa"] + 6;
			$arrayActividad_6["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_6["nombre"] 			= "Generar Anticipo";
			$arrayActividad_6["descripcion"] 		= "Se asigna la documentación necesaria para el despacho del vehículo y se asigna la tarjeta y la clave para que el conductor pueda retirar el anticipo.";
			$arrayActividad_6["tiempo_estimado"] 	= 60;
			$arrayActividad_6["integracion"] 		= "soluciones";
			$arrayActividad_6["sub_integracion"] 	= "importacion";
			$arrayActividad_6["costo_estimado"] 	= 0;
			$arrayActividad_6["moneda"] 			= 2;
			$arrayActividad_6["id_centro_costo"] 	= 7;
			$arrayActividad_6["tipo_actividad"] 	= "anticipo";
			// $arrayActividad_6["responsable"] 		= "";
			// print_r($arrayActividad_6);
			$Data->setRegistro($table, $arrayActividad_6);

			// Se crea la actividad "Asignación de plan de ruta"
			$arrayActividad_7["orden"] 				= $array["orden"] + 7;
			$arrayActividad_7["bloque"] 			= $array["bloque"] + 7;
			$arrayActividad_7["simultaneo"] 		= $araySimultaneos[1];
			$arrayActividad_7["actividad_previa"] 	= $array["actividad_previa"] + 7;
			$arrayActividad_7["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_7["nombre"] 			= "Asignación de plan de ruta";
			$arrayActividad_7["descripcion"] 		= "Seguridad asignara la ruta para el transporte del material.";
			$arrayActividad_7["tiempo_estimado"] 	= 60;
			$arrayActividad_7["integracion"] 		= "soluciones";
			$arrayActividad_7["sub_integracion"] 	= "importacion";
			$arrayActividad_7["costo_estimado"] 	= 0;
			$arrayActividad_7["moneda"] 			= 2;
			$arrayActividad_7["id_centro_costo"] 	= 7;
			// $arrayActividad_7["tipo_actividad"] 	= "anticipo";
			// $arrayActividad_7["responsable"] 		= "";
			// print_r($arrayActividad_7);
			$Data->setRegistro($table, $arrayActividad_7);

			// Se crea la actividad "Seguimiento de vehículo llegada al punto de cargue"
			$arrayActividad_8["orden"] 			= $array["orden"] + 8;
			$arrayActividad_8["bloque"] 			= $array["bloque"] + 8;
			$arrayActividad_8["simultaneo"] 		= $araySimultaneos[1];
			$arrayActividad_8["actividad_previa"] 	= $array["actividad_previa"] + 8;
			$arrayActividad_8["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_8["nombre"] 			= "Seguimiento de vehículo llegada al punto de cargue";
			$arrayActividad_8["descripcion"] 		= "El controlador de tráfico realiza seguimiento al vehículo al punto de cargue.";
			$arrayActividad_8["tiempo_estimado"] 	= 60;
			$arrayActividad_8["integracion"] 		= "soluciones";
			$arrayActividad_8["sub_integracion"] 	= "importacion";
			$arrayActividad_8["costo_estimado"] 	= 0;
			$arrayActividad_8["moneda"] 			= 2;
			$arrayActividad_8["id_centro_costo"] 	= 7;
			$arrayActividad_8["tipo_actividad"] 	= "seguimiento";
			// $arrayActividad_8["responsable"] 		= "";
			// print_r($arrayActividad_8);
			$Data->setRegistro($table, $arrayActividad_8);

			// Se crea la actividad "Seguimiento de cargue de vehículo"
			$arrayActividad_9["orden"] 			= $array["orden"] + 9;
			$arrayActividad_9["bloque"] 			= $array["bloque"] + 9;
			$arrayActividad_9["simultaneo"] 		= $araySimultaneos[1];
			$arrayActividad_9["actividad_previa"] 	= $array["actividad_previa"] + 9;
			$arrayActividad_9["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_9["nombre"] 			= "Seguimiento de cargue de vehículo";
			$arrayActividad_9["descripcion"] 		= "Se verfica que el vehículo ya halla cargado el material. Registrar fecha y hora de finalización del cargue";
			$arrayActividad_9["tiempo_estimado"] 	= 60;
			$arrayActividad_9["integracion"] 		= "soluciones";
			$arrayActividad_9["sub_integracion"] 	= "importacion";
			$arrayActividad_9["costo_estimado"] 	= 0;
			$arrayActividad_9["moneda"] 			= 2;
			$arrayActividad_9["id_centro_costo"] 	= 7;
			$arrayActividad_9["tipo_actividad"] 	= "carga_inicial";
			// $arrayActividad_9["responsable"] 		= "";
			// print_r($arrayActividad_9);
			$Data->setRegistro($table, $arrayActividad_9);

			// Se crea la actividad "Informar asignación anticipo al conductor"
			$arrayActividad_10["orden"] 			= $array["orden"] + 10;
			$arrayActividad_10["bloque"] 			= $array["bloque"] + 10;
			$arrayActividad_10["simultaneo"] 		= $araySimultaneos[1];
			$arrayActividad_10["actividad_previa"] 	= $array["actividad_previa"] + 10;
			$arrayActividad_10["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_10["nombre"] 			= "Informar asignación anticipo al conductor";
			$arrayActividad_10["descripcion"] 		= "El controlador de tráfico informa al conductor la calve de la tarjeta donde le fue consignado el anticipo.";
			$arrayActividad_10["tiempo_estimado"] 	= 60;
			$arrayActividad_10["integracion"] 		= "soluciones";
			$arrayActividad_10["sub_integracion"] 	= "importacion";
			$arrayActividad_10["costo_estimado"] 	= 0;
			$arrayActividad_10["moneda"] 			= 2;
			$arrayActividad_10["id_centro_costo"] 	= 7;
			// $arrayActividad_10["tipo_actividad"] 	= "carga_inicial";
			// $arrayActividad_10["responsable"] 		= "";
			// print_r($arrayActividad_10);
			$Data->setRegistro($table, $arrayActividad_10);

			// Se crea la actividad "Solicitar Cita a Puerto"
			$arrayActividad_11["orden"] 			= $array["orden"] + 11;
			$arrayActividad_11["bloque"] 			= $array["bloque"];
			$arrayActividad_11["simultaneo"] 		= $araySimultaneos[1];
			$arrayActividad_11["actividad_previa"] 	= $array["actividad_previa"] + 11;
			$arrayActividad_11["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_11["nombre"] 			= "Solicitud de cita al Puerto";
			$arrayActividad_11["descripcion"] 		= "Operaciones verifica en la página del puerto la disponibilidad de citas y se agenda.";
			$arrayActividad_11["tiempo_estimado"] 	= 60;
			$arrayActividad_11["integracion"] 		= "";
			$arrayActividad_11["sub_integracion"] 	= "";
			$arrayActividad_11["costo_estimado"] 	= 0;
			$arrayActividad_11["moneda"] 			= 2;
			$arrayActividad_11["id_centro_costo"] 	= 7;
			// $arrayActividad_11["responsable"] 		= "";
			// print_r($arrayActividad_11);
			$Data->setRegistro($table, $arrayActividad_11);

			// Se crea la actividad "Asignación de cita del Puerto"
			$arrayActividad_12["orden"] 			= $array["orden"] + 12;
			$arrayActividad_12["bloque"] 			= $array["bloque"] + 1;
			$arrayActividad_12["simultaneo"] 		= $araySimultaneos[1];
			$arrayActividad_12["actividad_previa"] 	= $array["actividad_previa"] + 12;
			$arrayActividad_12["id_plantilla"] 		= $array["id_plantilla"];
			$arrayActividad_12["nombre"] 			= "Asignación de cita del Puerto";
			$arrayActividad_12["descripcion"] 		= "Operaciones imprime cita y coordina con el transportador el cargue. La fecha indica cuando debe ser retirado el material del puerto.";
			$arrayActividad_12["tiempo_estimado"] 	= 60;
			$arrayActividad_12["integracion"] 		= "";
			$arrayActividad_12["sub_integracion"] 	= "";
			$arrayActividad_12["costo_estimado"] 	= 0;
			$arrayActividad_12["moneda"] 			= 2;
			$arrayActividad_12["id_centro_costo"] 	= 7;
			// $arrayActividad_12["responsable"] 		= "";
			// print_r($arrayActividad_12);
			$Data->setRegistro($table, $arrayActividad_12);

			break;
	}


	function buscaSimutaneos( $Data, $id_plantilla ){
		// Se crea un array con los simultaneos disponibles en el proyecto
		$sql = "
			SHOW COLUMNS FROM 
				cmx_actividades_plantilla 
			LIKE 'simultaneo' 
		";
		$result = $Data->getConsulta($sql);

		foreach ($result["rowsData"] as $key => $value) {
			$value["Type"] = str_replace("enum(", "", $value["Type"]);
			$value["Type"] = str_replace(")", "", $value["Type"]);
			$value["Type"] = str_replace("'", "", $value["Type"]);

			$array = explode(",", $value["Type"]);
		}

		$i = 0;
		foreach ($array as $key => $value) {
			if ( $value != 0 ) {
				$sql = '
					SELECT 
						COUNT(cap.id) CUANTOS
					FROM 
						cmx_actividades_plantilla cap
					WHERE 
						cap.simultaneo = "' . $value . '"
						AND cap.id_plantilla = ' . $id_plantilla . '
				';
				$result = $Data->getConsulta($sql);

				if ( $result["rowsData"][0]["CUANTOS"] == 0 ) {
					$i++;
					$arraySimultaneo[ $i ] = $key;
				}
			}
		}
		return $arraySimultaneo;
	}

?>
