<?php 
	print_r("Entro en asignar_actividades_urbano.php\n");
	include("../application/Config.php");
	include '../application/Conexion.php';

	$Data = new Consultas;
	$table = $_GET['tabla'];

	// print_r($_POST);
	// print_r("\n");

	// Se crea un array con los id de actividades que se entan gestionando en el proyecto
	$arrayIdActividad = explode(",", $_POST["id"]);
	// print_r($arrayIdActividad);

	$_flag_busca_simultaneos = true;
	foreach ($arrayIdActividad as $key => $value) {
		if ( $value ) {
			$sql = '
				SELECT 
					cia.*
				FROM 
					cmx_importacion_actividades cia
				WHERE 
					cia.id = ' . $value . '
			';
			$result = $Data->getConsulta($sql);
			// print_r("Consulta 1 \n");
			// print_r($sql . "\n");
			// print_r($result);

			if ( $_flag_busca_simultaneos ) {
				// Se busca los simultaneos disponibles del proyecto
				$_flag_busca_simultaneos = false; 
				$araySimultaneos = buscaSimutaneos( $Data, $result["rowsData"][0]["id_importacion"], $result["rowsData"][0]["id_material"], $result["rowsData"][0]["grupo"] );
				// print_r($araySimultaneos);
			}

			foreach ($result["rowsData"] as $key_01 => $value_01) {
				// Se busca la actividad anterior a la del nuevo bloque 
				$sql = '
					SELECT 
						cia.*
					FROM 
						cmx_importacion_actividades cia
					WHERE 
						cia.estado = 3
						AND grupo = ' . $value_01["grupo"] . '
						AND cia.orden > ' . $value_01["orden"] . '
						AND cia.id_material = ' . $value_01["id_material"] . '
						AND cia.tipo_actividad = "seguimiento_descarga";
				';
				$result_01 = $Data->getConsulta($sql);
				// print_r("Consulta 2 \n");
				// print_r($sql . "\n");
				// print_r($result_01);

				if ( $result_01["rowsNum"] AND $result_01["rowsNum"] > 0 ) {
					$_flag_actualiza_siguientes = true;
					// Se busca las actividades siguientes  
					$sql = '
						SELECT 
							cia.*
						FROM 
							cmx_importacion_actividades cia
						WHERE 
							cia.estado = 3
							AND grupo = ' . $result_01["rowsData"][0]["grupo"] . '
							AND cia.orden > ' . $result_01["rowsData"][0]["orden"] . '
							AND cia.id_material = ' . $result_01["rowsData"][0]["id_material"] . '
					';
				}else{
					$_flag_actualiza_siguientes = false;
					// Si no encuentra se busca la última actividad  
					$sql = '
						SELECT 
							cia.*
						FROM 
							cmx_importacion_actividades cia
						WHERE 
							cia.estado = 3
							AND cia.grupo = ' . $value_01["grupo"] . '
							AND cia.id_material = ' . $value_01["id_material"] . '
							AND cia.orden = (
								SELECT 
									MAX(cia1.orden)
								FROM 
									cmx_importacion_actividades cia1
								WHERE 
									cia1.grupo = cia.grupo
									AND cia1.id_material = cia.id_material
							)
					';
				}

				$result_02 = $Data->getConsulta($sql);
				// print_r("Consulta 3 \n");
				// print_r($sql . "\n");
				// print_r($result_02);


				// Se crea array con las nuevas actividades
				$array_nuevas_actividades = array(
					0 => array (
						"id_importacion" => $value_01["id_importacion"], 
						"id_material" => $value_01["id_material"], 
						"nombre" => "Solicitud de vehículo urbano", 
						"descripcion" => "Se solicita vehículo a Operaciones", 
						"id_centro_costo" => 6, 
						"orden" => ($result_02["rowsData"][0]["orden"] + 1), 
						"actividad_previa" => (($result_02["rowsData"][0]["orden"] + 1) - 1), 
						"bloque" => 1, 
						"simultaneo" => $araySimultaneos[1], 
						"grupo" => $result_02["rowsData"][0]["grupo"], 
						"urbaneo" => 2, 
						"responsable" => "", 
						"documentos" => "", 
						"tiempo_aprobado" => 5, 
						"costo_aprobado" => 0, 
						"moneda" => 2, 
						"adjunto" => 0, 
						"integracion" => "soluciones", 
						"sub_integracion" => "importacion", 
						"tipo_actividad" => "", 
						"estado" => 3, 
					),
					1 => array (
						"id_importacion" => $value_01["id_importacion"], 
						"id_material" => $value_01["id_material"], 
						"nombre" => "Editar y aprobar solicitud para agrupamiento", 
						"descripcion" => "Se agrega el tipo de movilización para la mercancía y se agregan los puntos de carge y descargue.", 
						"id_centro_costo" => 5, 
						"orden" => ($result_02["rowsData"][0]["orden"] + 2), 
						"actividad_previa" => (($result_02["rowsData"][0]["orden"] + 2) - 1), 
						"bloque" => 2, 
						"simultaneo" => $araySimultaneos[1],
						"grupo" => $result_02["rowsData"][0]["grupo"], 
						"responsable" => "", 
						"documentos" => "", 
						"tiempo_aprobado" => 60, 
						"costo_aprobado" => 0, 
						"moneda" => 2, 
						"adjunto" => 0, 
						"integracion" => "soluciones", 
						"sub_integracion" => "importacion", 
						"tipo_actividad" => "", 
						"estado" => 3, 
					),
					2 => array (
						"id_importacion" => $value_01["id_importacion"], 
						"id_material" => $value_01["id_material"], 
						"nombre" => "Agrupación y desagrupación de solicitudes", 
						"descripcion" => "Desconsolidación y agrupación de materiales para asignación de vehículo para despacho.", 
						"id_centro_costo" => 5, 
						"orden" => ($result_02["rowsData"][0]["orden"] + 3), 
						"actividad_previa" => (($result_02["rowsData"][0]["orden"] + 3) - 1), 
						"bloque" => 3, 
						"simultaneo" => $araySimultaneos[1],
						"grupo" => $result_02["rowsData"][0]["grupo"], 
						"responsable" => "", 
						"documentos" => "", 
						"tiempo_aprobado" => 60, 
						"costo_aprobado" => 0, 
						"moneda" => 2, 
						"adjunto" => 0, 
						"integracion" => "soluciones", 
						"sub_integracion" => "importacion", 
						"tipo_actividad" => "", 
						"estado" => 3, 
					),
					3 => array (
						"id_importacion" => $value_01["id_importacion"], 
						"id_material" => $value_01["id_material"], 
						"nombre" => "Asignar Vehículo", 
						"descripcion" => "Se postulan vehículos para un agrupamiento de materiales.", 
						"id_centro_costo" => 5, 
						"orden" => ($result_02["rowsData"][0]["orden"] + 4), 
						"actividad_previa" => (($result_02["rowsData"][0]["orden"] + 4) - 1), 
						"bloque" => 4, 
						"simultaneo" => $araySimultaneos[1],
						"grupo" => $result_02["rowsData"][0]["grupo"], 
						"responsable" => "", 
						"documentos" => "", 
						"tiempo_aprobado" => 60, 
						"costo_aprobado" => 0, 
						"moneda" => 2, 
						"adjunto" => 0, 
						"integracion" => "soluciones", 
						"sub_integracion" => "importacion", 
						"tipo_actividad" => "", 
						"estado" => 3, 
					),
					4 => array (
						"id_importacion" => $value_01["id_importacion"], 
						"id_material" => $value_01["id_material"], 
						"nombre" => "Aprobar Vehículo", 
						"descripcion" => "Se aprueba un vehículo de los postulados del un agrupamiento de materiales.", 
						"id_centro_costo" => 7, 
						"orden" => ($result_02["rowsData"][0]["orden"] + 5), 
						"actividad_previa" => (($result_02["rowsData"][0]["orden"] + 5) - 1), 
						"bloque" => 5, 
						"simultaneo" => $araySimultaneos[1],
						"grupo" => $result_02["rowsData"][0]["grupo"], 
						"responsable" => "", 
						"documentos" => "", 
						"tiempo_aprobado" => 60, 
						"costo_aprobado" => 0, 
						"moneda" => 2, 
						"adjunto" => 0, 
						"integracion" => "soluciones", 
						"sub_integracion" => "importacion", 
						"tipo_actividad" => "", 
						"estado" => 3, 
					),
					5 => array (
						"id_importacion" => $value_01["id_importacion"], 
						"id_material" => $value_01["id_material"], 
						"nombre" => "Planillar Vehículo", 
						"descripcion" => "Operaciones planilla el vehículo y entrega documentos al conductor.", 
						"id_centro_costo" => 5, 
						"orden" => ($result_02["rowsData"][0]["orden"] + 6), 
						"actividad_previa" => (($result_02["rowsData"][0]["orden"] + 6) - 1), 
						"bloque" => 5, 
						"simultaneo" => $araySimultaneos[1],
						"grupo" => $result_02["rowsData"][0]["grupo"], 
						"responsable" => "", 
						"documentos" => "", 
						"tiempo_aprobado" => 60, 
						"costo_aprobado" => 0, 
						"moneda" => 2, 
						"adjunto" => 0, 
						"integracion" => "soluciones", 
						"sub_integracion" => "importacion", 
						"tipo_actividad" => "", 
						"estado" => 3, 
					),
					6 => array (
						"id_importacion" => $value_01["id_importacion"], 
						"id_material" => $value_01["id_material"], 
						"nombre" => "Generar Anticipo", 
						"descripcion" => "Se asigna la documentación necesaria para el despacho del vehículo y se asigna la tarjeta y la clave para que el conductor pueda retirar el anticipo.", 
						"id_centro_costo" => 8, 
						"orden" => ($result_02["rowsData"][0]["orden"] + 7), 
						"actividad_previa" => (($result_02["rowsData"][0]["orden"] + 7) - 1), 
						"bloque" => 9, 
						"simultaneo" => $araySimultaneos[1],
						"grupo" => $result_02["rowsData"][0]["grupo"], 
						"responsable" => "", 
						"documentos" => "", 
						"tiempo_aprobado" => 60, 
						"costo_aprobado" => 0, 
						"moneda" => 2, 
						"adjunto" => 0, 
						"integracion" => "soluciones", 
						"sub_integracion" => "importacion", 
						"tipo_actividad" => "anticipo", 
						"estado" => 3, 
					),
					7 => array (
						"id_importacion" => $value_01["id_importacion"], 
						"id_material" => $value_01["id_material"], 
						"nombre" => "Asignación de plan de ruta", 
						"descripcion" => "Seguridad asignara la ruta para el transporte del material.", 
						"id_centro_costo" => 7, 
						"orden" => ($result_02["rowsData"][0]["orden"] + 8), 
						"actividad_previa" => (($result_02["rowsData"][0]["orden"] + 8) - 1), 
						"bloque" => 10, 
						"simultaneo" => $araySimultaneos[1],
						"grupo" => $result_02["rowsData"][0]["grupo"], 
						"responsable" => "", 
						"documentos" => "", 
						"tiempo_aprobado" => 60, 
						"costo_aprobado" => 0, 
						"moneda" => 2, 
						"adjunto" => 0, 
						"integracion" => "soluciones", 
						"sub_integracion" => "importacion", 
						"tipo_actividad" => "", 
						"estado" => 3, 
					),
					8 => array (
						"id_importacion" => $value_01["id_importacion"], 
						"id_material" => $value_01["id_material"], 
						"nombre" => "Seguimiento de vehículo llegada al punto de cargue", 
						"descripcion" => "El controlador de tráfico realiza seguimiento al vehículo al punto de cargue.", 
						"id_centro_costo" => 7, 
						"orden" => ($result_02["rowsData"][0]["orden"] + 9), 
						"actividad_previa" => (($result_02["rowsData"][0]["orden"] + 9) - 1), 
						"bloque" => 11, 
						"simultaneo" => $araySimultaneos[1],
						"grupo" => $result_02["rowsData"][0]["grupo"], 
						"responsable" => "", 
						"documentos" => "", 
						"tiempo_aprobado" => 60, 
						"costo_aprobado" => 0, 
						"moneda" => 2, 
						"adjunto" => 0, 
						"integracion" => "soluciones", 
						"sub_integracion" => "importacion", 
						"tipo_actividad" => "seguimiento", 
						"estado" => 3, 
					),
					9 => array (
						"id_importacion" => $value_01["id_importacion"], 
						"id_material" => $value_01["id_material"], 
						"nombre" => "Seguimiento de cargue de vehículo", 
						"descripcion" => "Se verfica que el vehículo ya halla cargado el material. Registrar fecha y hora de finalización del cargue.", 
						"id_centro_costo" => 7, 
						"orden" => ($result_02["rowsData"][0]["orden"] + 10), 
						"actividad_previa" => (($result_02["rowsData"][0]["orden"] + 10) - 1), 
						"bloque" => 12, 
						"simultaneo" => $araySimultaneos[1],
						"grupo" => $result_02["rowsData"][0]["grupo"], 
						"responsable" => "", 
						"documentos" => "", 
						"tiempo_aprobado" => 60, 
						"costo_aprobado" => 0, 
						"moneda" => 2, 
						"adjunto" => 0, 
						"integracion" => "soluciones", 
						"sub_integracion" => "importacion", 
						"tipo_actividad" => "carga_inicial", 
						"estado" => 3, 
					),
					10 => array (
						"id_importacion" => $value_01["id_importacion"], 
						"id_material" => $value_01["id_material"], 
						"nombre" => "Informar asignación anticipo al conductor", 
						"descripcion" => "El controlador de tráfico informa al conductor la calve de la tarjeta donde le fue consignado el anticipo.", 
						"id_centro_costo" => 7, 
						"orden" => ($result_02["rowsData"][0]["orden"] + 11), 
						"actividad_previa" => (($result_02["rowsData"][0]["orden"] + 11) - 1), 
						"bloque" => 13, 
						"simultaneo" => $araySimultaneos[1],
						"grupo" => $result_02["rowsData"][0]["grupo"], 
						"responsable" => "", 
						"documentos" => "", 
						"tiempo_aprobado" => 60, 
						"costo_aprobado" => 0, 
						"moneda" => 2, 
						"adjunto" => 0, 
						"integracion" => "soluciones", 
						"sub_integracion" => "importacion", 
						"tipo_actividad" => "", 
						"estado" => 3, 
					),
				);
				// print_r($array_nuevas_actividades);

				// Se recorre el array de las actividades a mover del orden para dar espacio a las actividades nuevas
				if ( $result_02["rowsData"] AND $_flag_actualiza_siguientes ) {
					foreach ($result_02["rowsData"] as $key_03 => $value_03) {
						$arrayActividad = array(
							"orden" => ( $value_03["orden"] + COUNT( $array_nuevas_actividades ) + 1 ), 
							"actividad_previa" => ( $value_03["actividad_previa"] + COUNT( $array_nuevas_actividades ) + 1  )
						);
						$Data->updateRegistro("cmx_importacion_actividades", $arrayActividad, $value_03["id"] );
					}
				}


				// Se insertan las nuevas actividades
				foreach ($array_nuevas_actividades as $key_04 => $value_04) {
					$array = array();
					$_flag_urbano_destino = false;
					foreach ($array_nuevas_actividades[ $key_04 ] as $key_041 => $value_041) {
						$array[ $key_041 ] = $value_041;
						if ( $key_041 === "urbaneo" ) {
							$_flag_urbano_destino = true;
						}
					}
					$Data->setRegistro("cmx_importacion_actividades", $array);
					if ( $_flag_urbano_destino ) {
						// Se busca el id de la actividad recien creada 
						$sql = '
							SELECT 
								MAX(cia.id) ID_ACTIVIDAD
							FROM 
								cmx_importacion_actividades cia
						';
						$result_03 = $Data->getConsulta($sql);
						// print_r($sql . "\n");
						// print_r($result_03);


						// Se busca el id del destinatario urbano en destino
						$sql = '
							SELECT 
								crd.id
							FROM 
								cmx_remitente_destinatario crd
							WHERE 
								crd.id_cliente IN (1 , ' . $_POST["id_cliente"] . ')
								AND crd.nombre = "' . $_POST["id_remitente_urbano"] . '"
						;';
						$result_04 = $Data->getConsulta($sql);
						// print_r($sql . "\n");
						// print_r($result_04);

						$array_01 = array();
						$array_01["id_actividad"] = $result_03["rowsData"][0][0];
						$array_01["id_remitente_destinatario"] = $result_04["rowsData"][0][0];
						$Data->setRegistro("cmx_tramo_urbano", $array_01);
					}
				}
			}
		}
	}


	function buscaSimutaneos( $Data, $id_importacion, $id_material, $grupo ){
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
						COUNT(cia.id) CUANTOS
					FROM 
						cmx_importacion_actividades cia
					WHERE 
						cia.simultaneo = "' . $value . '"
						AND cia.id_importacion = ' . $id_importacion . '
						AND cia.id_material = ' . $id_material . '
						AND cia.grupo = ' . $grupo . '
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
