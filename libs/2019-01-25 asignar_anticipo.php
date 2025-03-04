<?php 
	include("../application/Config.php");
	include '../application/Conexion.php';
	$_msg_error = "";
	$_msg_control = "Entro en asignar_anticipo.php\n";
	$_array_result = Array();

	$Data = new Consultas;
	$table = $_GET['tabla'];

	// $datafile["post"] = $_POST;

	$_flag_proceso = true;

	// Se crea el arreglo con los parámteros para insertar la información del anticipo
	$array = array();
	$array["id_agrupacion"] = $_POST["id_agrupacion"];
	$array["numero_manifiesto"] = $_POST["numero_manifiesto"];
	$array["flete"] = $_POST["flete"];
	$array["porcentaje_anticipo"] = $_POST["porcentaje_anticipo"];
	$array["metodo_desembolso"] = $_POST["metodo_desembolso"];
	if ($_POST["modulo"] == "planillar") {
		// se calcula el valor del anticipo
		$anticipo = intval( $array["flete"] * ( $array["porcentaje_anticipo"]/100 ) );
		$array["anticipo"] = $anticipo;
		$array["beneficiario"] = $_POST["beneficiario"];
	}

	if ($_POST["modulo"] == "planillar") {
		$arraySolicitudes = explode(",", $_POST["solicitudes"] );

		// Se consulta la información para tomar los tramos del agrupamiento
		$sql = '
			SELECT 
				cts.id
			FROM
				cmx_agrupaciones ca
				INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_agrupacion = ca.id
				INNER JOIN cmx_solicitudes cs ON cs.id = cas.id_solicitud
				INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cs.id
			WHERE
				ca.id = ' . $_POST["id_agrupacion"] . '
				AND cs.id IN (' . $_POST["solicitudes"] . '0)
				AND cts.estado = 2
			ORDER BY cts.fecha_hora_operacion
		';
		$respuesta_tramo = $Data->getConsulta($sql);
		// $datafile["sql"] = $sql;

		$arrayPreRemesas = Array();
		foreach ($arraySolicitudes as $value_solicitudes) {
			if ($value_solicitudes) {
				if ( $respuesta_tramo ) {
					/****** INTEGRACIÓN CON RNDC ******/
					/****** Arreglo para la creación de Información de Carga ******/
					$sql = '
						SELECT 
							cim.*, cc.id ID_CLIENTE, CONCAT(cc.documento,cc.digito_verificacion) DOCUMENTO_CLIENTE,
							cip.id_tipo_carga, cam.id ID_MATERIAL_AGRUPACION, cip.rndc_material,
							IF( cip.id_tipo_carga = 1,
							(
								SELECT 
									ctc1.tara
								FROM 
									cmx_tipo_contenedor ctc1
								WHERE
									ctc1.id = cip.tipo_contenedor
								),
								""
							) PESO_CONTENEDOR,
							cts.fecha_hora_operacion FECHA_PACTO_CARGUE,
							(
								SELECT 
									MAX(cts1.fecha_hora_operacion)
								FROM 
									cmx_tramo_solicitud cts1
									INNER JOIN cmx_tramo_material ctm1 ON ctm1.id_tramo = cts1.id
									INNER JOIN cmx_mercancia_solicitud cms1 ON cms1.id = ctm1.id_material
									INNER JOIN cmx_agrupacion_solicitudes cas1 ON cas1.id_solicitud = cms1.id_solicitud
									INNER JOIN cmx_agrupacion_material cam1 ON cam1.id_material = cms1.id AND cam1.id_agrupamiento = cas1.id_agrupacion
								WHERE
									cts1.tipo_operacion = "Descargue"
									AND cam1.id_material_proyecto = cim.id
									AND cts1.id_solicitud = cas.id_solicitud
									AND cas1.id_agrupacion = cas.id_agrupacion
							) FECHA_PACTO_DESCARGUE
						FROM 
							cmx_agrupacion_solicitudes cas 
							INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud
							INNER JOIN cmx_agrupacion_material cam ON cam.id_material = cms.id AND cas.id_agrupacion = cam.id_agrupamiento
							INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto
							INNER JOIN cmx_importacion_material cim1 ON cim1.id = cms.id_material_proyecto
							INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
							INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cas.id_solicitud
							INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
						WHERE 
							cas.id_agrupacion = ' . $_POST["id_agrupacion"] . '
							AND cas.id_solicitud = ' . $value_solicitudes . '
							AND cts.tipo_operacion = "Cargue";
					';
					$respuesta_material = $Data->getConsulta($sql);
					// $datafile["sql"] = $sql;

					foreach ($respuesta_material["rowsData"] as $key_rndc => $value_rndc) {
						// Se filtra el contenido para el campo CODOPERACIONTRANSPORTE
						switch ( $value_rndc["id_tipo_carga"] ) {
							case '1':
								$_CODOPERACIONTRANSPORTE = "C";
								break;

							case '2':
								$_CODOPERACIONTRANSPORTE = "G";
								break;

							case '3':
								$_CODOPERACIONTRANSPORTE = "V";
								break;
						}

						// Se genera las preremesas para incluirlas en la información de viaje
						$arrayPreRemesas[ $value_rndc[0] ] = "MTR-" . $value_rndc[0];

						$arrayMinTrans = Array();
						// Solicitud
						$arrayMinTrans["solicitud"] = Array(
							"tipo" => 3,
							"procesoid" => 1,
						);
						// Variable que se envían para la consulta  
						$arrayMinTrans["variables"] = "INGRESOID";

						$arrayMinTrans["documento"] = Array(
							"NUMNITEMPRESATRANSPORTE" => MINTRANS_NIT,
							"CONSECUTIVOINFORMACIONCARGA" => "'" . $arrayPreRemesas[ $value_rndc[0] ] . "'"
						);

						$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 
						$_array_result["result_info_carga"][$value_rndc[0]] = $result;

						// Se valida si la operación fue exitosa
						if ( isset( $result["ErrorMSG"] ) ) {

							// Se busca el tipo de documento del remitente 
							$_CODTIPOIDREMITENTE = rndcTipoDocumento( $Data, $_POST["CODSEDEREMITENTE_" . $value_solicitudes] );

							// Se busca el tipo de documento del remitente 
							$_CODTIPOIDDESTINATARIO = rndcTipoDocumento( $Data, $_POST["CODSEDEDESTINATARIO_" . $value_solicitudes] );


							// Se instancia el array de información de carga 
							$arrayMinTrans = Array();
							// Solicitud
							$arrayMinTrans["solicitud"] = Array(
								"tipo" => 1,
								"procesoid" => 1,
							);
							// Variable que se envían para la realizació del proceso 
							$arrayMinTrans["variables"] = Array(
								"NUMNITEMPRESATRANSPORTE" 			=> MINTRANS_NIT,
								"CONSECUTIVOINFORMACIONCARGA"		=> $arrayPreRemesas[ $value_rndc[0] ],
								"CODOPERACIONTRANSPORTE"			=> $_CODOPERACIONTRANSPORTE,
								"CODTIPOEMPAQUE"					=> "4", // Por definiir cómo se debe diligenciar (ver Excel)
								"CODNATURALEZACARGA"				=> "1", // Por definiir cómo se debe diligenciar [ 1 Carga normal | 2 Carga Peligrosa | 3 Carga extradimencionada | 4 Carga extra pesada | 5 Desechos Peligrosos | 6 Semovientes | 7 Refirgerada ]
								"DESCRIPCIONCORTAPRODUCTO"			=> $value_rndc["nombre"],
								"MERCANCIAINFORMACIONCARGA"			=> $value_rndc["rndc_material"], 
								"CANTIDADINFORMACIONCARGA"			=> number_format( $value_rndc["peso_bruto"] , 0, ",", "" ),
								"UNIDADMEDIDACAPACIDAD"				=> "1", // [ 1 Kilogramos | 2 galones ] // Se define que los liquidos se miden de acuerdo con el peso que tenga las unidades, queda por defecto este item como Kilos
								"CODTIPOIDREMITENTE"				=> $_CODTIPOIDREMITENTE, // Por definiir cómo se debe diligenciar
								"NUMIDREMITENTE"					=> $_POST["NUMIDREMITENTE_" . $value_solicitudes],
								"CODSEDEREMITENTE"					=> $_POST["CODSEDEREMITENTE_" . $value_solicitudes],
								"CODTIPOIDDESTINATARIO"				=> $_CODTIPOIDDESTINATARIO,
								"NUMIDDESTINATARIO"					=> $_POST["NUMIDDESTINATARIO_" . $value_solicitudes],
								"CODSEDEDESTINATARIO"				=> $_POST["CODSEDEDESTINATARIO_" . $value_solicitudes],
								"PACTOTIEMPOCARGUE"					=> "NO",
								"PACTOTIEMPODESCARGUE"				=> "NO",
								"FECHACITAPACTADACARGUE"			=> date("d/m/Y", strtotime( $value_rndc["FECHA_PACTO_CARGUE"] )),
								"HORACITAPACTADACARGUE"				=> date("H:i", strtotime( $value_rndc["FECHA_PACTO_CARGUE"] )),
								"FECHACITAPACTADADESCARGUE"			=> date("d/m/Y", strtotime( $value_rndc["FECHA_PACTO_DESCARGUE"] )),
								"HORACITAPACTADADESCARGUEREMESA"	=> date("H:i", strtotime( $value_rndc["FECHA_PACTO_DESCARGUE"] ))
							);

							// Se pregunta si el proyecto tiene contenedor y se asigna la tara
							if ( $value_rndc["id_tipo_carga"] == 1 ) {
								$arrayMinTrans["variables"]["PESOCONTENEDORVACIO"] = $value_rndc["PESO_CONTENEDOR"];
							}

							$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 
							$_array_result["info_carga"][ $value_solicitudes ][ $value_rndc[0] ] = $arrayMinTrans;
							$_array_result["result_info_carga_crea"][$value_rndc[0]] = $result;

							// Se valida si la operación fue exitosa
							if ( isset( $result["ErrorMSG"] ) ) {
								$_flag_proceso = false;
								$_msg_error.= '<p><strong>Registro no actualizado en RNDC - Información de Carga <span class="text-danger">' . $value_rndc["nombre"] . ' </span>.</strong></p>';
								$_msg_error.= $result["ErrorMSG"];
							}
						}
					}

					// Se buscar si el contenedor ya se encuentra registrado en el RNDC
					$sql = '
						SELECT 
							DISTINCT(cms.id_solicitud), cip.numero_remesa
						FROM
							cmx_importacion_proyecto cip
							INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
							INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cia.id_material
							INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
						WHERE
							cam.id_agrupamiento = ' . $_POST["id_agrupacion"] . '
							AND cms.id_solicitud = ' . $value_solicitudes . '
							AND cip.devolucion = 1
					';
					$respuesta_contenedor = $Data->getConsulta($sql);
					// $datafile["sql"] = $sql;

					if ($respuesta_contenedor) {
						$contenedor_consecutivo = "CND-" . $_POST["id_agrupacion"] . "-" . $value_solicitudes;
						$arrayContenedorConsecutivo[ $value_solicitudes ] = $contenedor_consecutivo;

						$arrayMinTrans = Array();
						// Solicitud
						$arrayMinTrans["solicitud"] = Array(
							"tipo" => 3,
							"procesoid" => 1,
						);
						// Variable que se envían para la consulta  
						$arrayMinTrans["variables"] = "INGRESOID";

						$arrayMinTrans["documento"] = Array(
							"NUMNITEMPRESATRANSPORTE" => MINTRANS_NIT,
							"CONSECUTIVOINFORMACIONCARGA" => "'" . $contenedor_consecutivo . "'"
						);

						$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 
						$_array_result["result_info_contenedor"][$value_rndc[0]] = $result;

						// Se valida si la operación fue exitosa
						if ( isset( $result["ErrorMSG"] ) ) {
							// Se valida si la operación tiene un contenedor para devolución
							$sql = '
								SELECT 
									DISTINCT(cip.id), cip.devolucion, CONCAT(cip.contenedor," (",ctc.nombre,")") nombre, ctc.tara, ctc.tamano
								FROM
									cmx_importacion_proyecto cip
									INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
									INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cia.id_material
									INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
									INNER JOIN cmx_tipo_contenedor ctc ON ctc.id = cip.tipo_contenedor
								WHERE
									cms.id_solicitud = ' . $value_solicitudes . '
									AND cam.id_agrupamiento = ' . $_POST["id_agrupacion"] . '
							';
							$respuesta_contenedor = $Data->getConsulta($sql);
							// $datafile["sql"] = $sql;

							$devolucion = $respuesta_contenedor["rowsData"][0]["devolucion"];
							$contenedor_nombre = $respuesta_contenedor["rowsData"][0]["nombre"];
							$contenedor_tara = $respuesta_contenedor["rowsData"][0]["tara"];

							if ( $devolucion == 1 ) {
								// Se busca el tipo de documento del remitente 
								$_CODTIPOIDREMITENTE = rndcTipoDocumento( $Data, $_POST["CODSEDEDESTINATARIO_" . $value_solicitudes] );

								// Se busca el tipo de documento del remitente 
								$_CODTIPOIDDESTINATARIO = rndcTipoDocumento( $Data, $_POST["CODSEDEREMITENTE_" . $value_solicitudes] );

								// Se filtra la información del tipo de de empaque del contenedor  
								$tipo_empaque = "7";
								if ($contenedor_tara == "40") {
									$tipo_empaque = "9";
								}

								// Se instancia el array de información de carga 
								$arrayMinTrans = Array();
								// Solicitud
								$arrayMinTrans["solicitud"] = Array(
									"tipo" => 1,
									"procesoid" => 1,
								);
								// Variable que se envían para la realizació del proceso 
								$arrayMinTrans["variables"] = Array(
									"NUMNITEMPRESATRANSPORTE" 			=> MINTRANS_NIT,
									"CONSECUTIVOINFORMACIONCARGA"		=> $arrayContenedorConsecutivo[ $value_solicitudes ],
									"CODOPERACIONTRANSPORTE"			=> "V",
									"CODTIPOEMPAQUE"					=> $tipo_empaque, // Por definiir cómo se debe diligenciar (ver Excel)
									"CODNATURALEZACARGA"				=> "1", // Por definiir cómo se debe diligenciar [ 1 Carga normal | 2 Carga Peligrosa | 3 Carga extradimencionada | 4 Carga extra pesada | 5 Desechos Peligrosos | 6 Semovientes | 7 Refirgerada ]
									"DESCRIPCIONCORTAPRODUCTO"			=> "Contenedor - " . $contenedor_nombre,
									"MERCANCIAINFORMACIONCARGA"			=> "009990", 
									// "CANTIDADINFORMACIONCARGA"			=> $contenedor_tara,
									"UNIDADMEDIDACAPACIDAD"				=> "1", // [ 1 Kilogramos | 2 galones ] // Se define que los liquidos se miden de acuerdo con el peso que tenga las unidades, queda por defecto este item como Kilos
									"CODTIPOIDREMITENTE"				=> $_CODTIPOIDREMITENTE, // Por definiir cómo se debe diligenciar
									"NUMIDREMITENTE"					=> $_POST["NUMIDDESTINATARIO_" . $value_solicitudes],
									"CODSEDEREMITENTE"					=> $_POST["CODSEDEDESTINATARIO_" . $value_solicitudes],
									"CODTIPOIDDESTINATARIO"				=> $_CODTIPOIDDESTINATARIO,
									"NUMIDDESTINATARIO"					=> $_POST["NUMIDREMITENTE_" . $value_solicitudes],
									"CODSEDEDESTINATARIO"				=> $_POST["CODSEDEREMITENTE_" . $value_solicitudes],
									"PACTOTIEMPOCARGUE"					=> "NO",
									"PACTOTIEMPODESCARGUE"				=> "NO",
									"PESOCONTENEDORVACIO"				=> $contenedor_tara,
									"FECHACITAPACTADACARGUE"			=> date("d/m/Y", strtotime( $value_rndc["FECHA_PACTO_DESCARGUE"] )),
									"HORACITAPACTADACARGUE"				=> date("H:i", strtotime( $value_rndc["FECHA_PACTO_DESCARGUE"] ))
								);

								$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 
								$_array_result["info_contenedor"][ $_POST["id_agrupacion"] ] [ $value_solicitudes ] = $arrayMinTrans;
								$_array_result["result_info_contenedor"][$value_rndc[0]] = $result;

								// Se valida si la operación fue exitosa
								if ( isset( $result["ErrorMSG"] ) ) {
									$_flag_proceso = false;
									$_msg_error.= '<p><strong>Registro no actualizado en RNDC - Información de Carga <span class="text-danger">Contenedor - ' . $contenedor_nombre . ' </span>.</strong></p>';
									$_msg_error.= $result["ErrorMSG"];
								}
							}
						}
					}
					/****** FIN - Arreglo para la creación de Información de Carga ******/
				}
			}
		}
		// $datafile["contenedores"] = $arrayContenedorConsecutivo;

		/****** Arreglo para la creación de Información de Viaje (ORDEN DE CARGUE) ******/
		if ( $_flag_proceso ) {
			// Se busca la información del cargue 
			$sql = '
				SELECT 
					ca.numero_agrupacion, 
					cp.numero_documento DOC_CONDUCTOR, cv.placa, cv.placa_trailer, cav.flete,
					(
						SELECT 
							cm1.rndc_codigo_ciudad
						FROM 
							cmx_tramo_solicitud cts1 
							INNER JOIN cmx_remitente_destinatario crd1 ON crd1.id = cts1.id_remitente_destinatario
							INNER JOIN cmx_municipios cm1 ON cm1.id = crd1.id_ciudad
						WHERE 
							cts1.id_solicitud = cas.id_solicitud
							AND cts1.tipo_operacion = "Cargue"
					) RNDC_COD_CIUDAD_ORIGEN,
					(
						SELECT 
							cts1.id
						FROM 
							cmx_tramo_solicitud cts1 
						WHERE 
							cts1.id_solicitud = cas.id_solicitud
							AND cts1.tipo_operacion = "Cargue"
					) ID_TRAMO
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
					INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
					INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor
					INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_agrupacion = ca.id
				WHERE 
					ca.id = ' . $_POST["id_agrupacion"] . '
					AND cas.id_solicitud IN (' . $_POST["solicitudes"] . '0)
					AND cav.estado = "Aprobado";
			';
			$respuesta_agrupacion = $Data->getConsulta($sql);
			// $datafile["sql"] = $sql;

			// Se buscan las decargas del tramo 
			$sql = '
				SELECT 
					cm.rndc_codigo_ciudad
				FROM 
					cmx_agrupaciones ca
					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
					INNER JOIN cmx_vehiculos cv ON cv.id = cav.id_vehiculo
					INNER JOIN cmx_proveedores cp ON cp.id = cv.id_conductor
					INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_agrupacion = ca.id
					INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cas.id_solicitud
					INNER JOIN cmx_remitente_destinatario crd ON crd.id = cts.id_remitente_destinatario
					INNER JOIN cmx_municipios cm ON cm.id = crd.id_ciudad
					INNER JOIN cmx_tramos_orden cto ON cto.id_tramo = cts.id
				WHERE 
					ca.id = ' . $_POST["id_agrupacion"] . '
					AND cas.id_solicitud IN (' . $_POST["solicitudes"] . '0)
					AND cav.estado = "Aprobado"
					AND cts.tipo_operacion = "Descargue"
				ORDER BY cto.orden DESC
				LIMIT 1
			';
			$respuesta_descargas = $Data->getConsulta($sql);
			// $datafile["sql"] = $sql;

			if ( $respuesta_descargas ) {
				foreach ($respuesta_descargas["rowsData"] as $keyDescargas => $valueDescargas) {
					$arrayMinTrans = Array();
					// Solicitud
					$arrayMinTrans["solicitud"] = Array(
						"tipo" => 3,
						"procesoid" => 2,
					);
					// Variable que se envían para la consulta  
					$arrayMinTrans["variables"] = "INGRESOID";

					$arrayMinTrans["documento"] = Array(
						"NUMNITEMPRESATRANSPORTE" 		=> MINTRANS_NIT,
						"CONSECUTIVOINFORMACIONVIAJE"	=> "'" . $respuesta_agrupacion["rowsData"][0]["numero_agrupacion"] . "'"
					);

					$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 
					$_array_result["busca_viaje_array"][ $value_solicitudes ][ $respuesta_agrupacion["rowsData"][0]["ID_TRAMO"] ] = $arrayMinTrans;
					$_array_result["result_busca_viaje"] = $result;

					// Se valida si la operación fue exitosa
					if ( isset( $result["ErrorMSG"] ) ){
						// Se instancia el array de información de viaje 
						$arrayMinTrans = Array();
						// Solicitud
						$arrayMinTrans["solicitud"] = Array(
							"tipo" => 1,
							"procesoid" => 2,
						);

						// Se adicionan las preRemesas al arreglo de información de viaje 
						$arrayMinTrans["preremesas"] = Array();
						foreach ($arrayPreRemesas as $key_rndc_01 => $value_rndc_01) {
							array_push($arrayMinTrans["preremesas"], Array( "MANPREREMESA" => Array( "CONSECUTIVOINFORMACIONCARGA" => $value_rndc_01 )));
						}

						// Se pregunta si existe contenedores para devolución y se adicionan a las preRemesas
						if ( isset($arrayContenedorConsecutivo) ) {
							foreach ($arrayContenedorConsecutivo as $valueContenedorConsecutivo) {
								array_push($arrayMinTrans["preremesas"], Array( "MANPREREMESA" => Array( "CONSECUTIVOINFORMACIONCARGA" => $valueContenedorConsecutivo )));
							}
						}

						// Variable que se envían para la realizació del proceso 
						$arrayMinTrans["variables"] = Array(
							"NUMNITEMPRESATRANSPORTE" 		=> MINTRANS_NIT,
							"CONSECUTIVOINFORMACIONVIAJE" 	=> $respuesta_agrupacion["rowsData"][0]["numero_agrupacion"],
							"CODIDCONDUCTOR" 				=> "C",
							"NUMIDCONDUCTOR" 				=> $respuesta_agrupacion["rowsData"][0]["DOC_CONDUCTOR"],
							"NUMPLACA" 						=> $respuesta_agrupacion["rowsData"][0]["placa"],
							"VALORFLETEPACTADOVIAJE" 		=> $respuesta_agrupacion["rowsData"][0]["flete"],
							"CODMUNICIPIOORIGENINFOVIAJE" 	=> $respuesta_agrupacion["rowsData"][0]["RNDC_COD_CIUDAD_ORIGEN"],
							"CODMUNICIPIODESTINOINFOVIAJE"	=> $valueDescargas["rndc_codigo_ciudad"],
							"MANCANTIDADPREREMESAS"			=> "" . COUNT($arrayMinTrans["preremesas"]),
						);

						if ( isset( $_POST["placa_trailer"] ) && $_POST["trailer"] == 1 ) {
							$arrayMinTrans["variables"]["NUMPLACAREMOLQUE"] = $_POST["placa_trailer"];
						}

						$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 
						$_array_result["info_viaje_array"][ $value_solicitudes ][ $respuesta_agrupacion["rowsData"][0]["ID_TRAMO"] ] = $arrayMinTrans;
						$_array_result["result_info_viaje"] = $result;

						// Se valida si la operación fue exitosa
						if ( isset( $result["ErrorMSG"] ) ) {
							$_flag_proceso = false;
							$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Información de Viaje.</strong></p>";
							$_msg_error.= $result["ErrorMSG"];
						}
					}
				}
			}
		}
		/****** FIN - Arreglo para la creación de Información de Viaje (ORDEN DE CARGUE) ******/

		/****** Arreglo para la creación de Remesas (REMESAS) ******/
		foreach ($arraySolicitudes as $value_solicitudes) {
			if ($value_solicitudes) {
				if ( $respuesta_tramo ) {
					/****** Arreglo para la creación de Expedición de Remesa ******/
					if ( $_flag_proceso ) {
						if ( $respuesta_material ) {
							$sql = '
								SELECT 
									cim.*, cc.id ID_CLIENTE, CONCAT(cc.documento,cc.digito_verificacion) DOCUMENTO_CLIENTE,
									cip.id_tipo_carga, cam.id ID_MATERIAL_AGRUPACION, cip.rndc_material,
									IF( cip.id_tipo_carga = 1,
									(
										SELECT 
											ctc1.tara
										FROM 
											cmx_tipo_contenedor ctc1
										WHERE
											ctc1.id = cip.tipo_contenedor
										),
										""
									) PESO_CONTENEDOR,
									cts.fecha_hora_operacion FECHA_PACTO_CARGUE,
									(
										SELECT 
											MAX(cts1.fecha_hora_operacion)
										FROM 
											cmx_tramo_solicitud cts1
											INNER JOIN cmx_tramo_material ctm1 ON ctm1.id_tramo = cts1.id
											INNER JOIN cmx_mercancia_solicitud cms1 ON cms1.id = ctm1.id_material
											INNER JOIN cmx_agrupacion_solicitudes cas1 ON cas1.id_solicitud = cms1.id_solicitud
											INNER JOIN cmx_agrupacion_material cam1 ON cam1.id_material = cms1.id AND cam1.id_agrupamiento = cas1.id_agrupacion
										WHERE
											cts1.tipo_operacion = "Descargue"
											AND cam1.id_material_proyecto = cim.id
											AND cts1.id_solicitud = cas.id_solicitud
											AND cas1.id_agrupacion = cas.id_agrupacion
									) FECHA_PACTO_DESCARGUE
								FROM 
									cmx_agrupacion_solicitudes cas 
									INNER JOIN cmx_mercancia_solicitud cms ON cms.id_solicitud = cas.id_solicitud
									INNER JOIN cmx_agrupacion_material cam ON cam.id_material = cms.id AND cas.id_agrupacion = cam.id_agrupamiento
									INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto
									INNER JOIN cmx_importacion_material cim1 ON cim1.id = cms.id_material_proyecto
									INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
									INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cas.id_solicitud
									INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
								WHERE 
									cas.id_agrupacion = ' . $_POST["id_agrupacion"] . '
									AND cas.id_solicitud = ' . $value_solicitudes . '
									AND cts.tipo_operacion = "Cargue";
							';
							$respuesta_material = $Data->getConsulta($sql);
							// $datafile["sql"] = $sql;

							$arrayPreRemesas = Array();
							foreach ($respuesta_material["rowsData"] as $key_rndc => $value_rndc) {
								// Se pregunta si la remisión ya existe
								// Se instancia el array de la consulta de la remisión 
								$arrayMinTrans = Array();
								// Solicitud
								$arrayMinTrans["solicitud"] = Array(
									"tipo" => 3,
									"procesoid" => 3,
								);
								$arrayMinTrans["variables"] = "INGRESOID";
								$arrayMinTrans["documento"] = Array(
									"NUMNITEMPRESATRANSPORTE"	=> MINTRANS_NIT,
									"CONSECUTIVOREMESA"			=> "'" . $_POST[ "numero_remesa_" . $value_rndc["ID_MATERIAL_AGRUPACION"] ] . "'",
								);

								$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 
								$_array_result["busca_remesa"][ $value_rndc[0] ] = $arrayMinTrans;
								$_array_result["result_busca_remesa"][ $value_rndc[0] ] = $result;

								if ( isset( $result["ErrorMSG"] ) ) {
									// Se filtra el contenido para el campo CODOPERACIONTRANSPORTE
									switch ( $value_rndc["id_tipo_carga"] ) {
										case '1':
											$_CODOPERACIONTRANSPORTE = "C";
											break;

										case '2':
											$_CODOPERACIONTRANSPORTE = "G";
											break;

										case '3':
											$_CODOPERACIONTRANSPORTE = "V";
											break;
									}

									// Se genera las preremesas para incluirlas en la información de viaje
									$arrayPreRemesas[ $value_rndc[0] ] = "MTR-" . $value_rndc[0];

									// Se busca el tipo de documento del remitente 
									$_CODTIPOIDREMITENTE = rndcTipoDocumento( $Data, $_POST["CODSEDEREMITENTE_" . $value_solicitudes] );

									// Se busca el tipo de documento del remitente 
									$_CODTIPOIDDESTINATARIO = rndcTipoDocumento( $Data, $_POST["CODSEDEDESTINATARIO_" . $value_solicitudes] );

									$fecha_cargue = new DateTime( $value_rndc["FECHA_PACTO_CARGUE"] );
									$fecha_descargue = new DateTime( $value_rndc["FECHA_PACTO_DESCARGUE"] );

									// Se instancia el array de información de carga 
									$arrayMinTrans = Array();
									// Solicitud
									$arrayMinTrans["solicitud"] = Array(
										"tipo" => 1,
										"procesoid" => 3,
									);
									// Variable que se envían para la realización del proceso 
									$arrayMinTrans["variables"] = Array(
										"NUMNITEMPRESATRANSPORTE"			=> MINTRANS_NIT,
										"CONSECUTIVOREMESA"					=> $_POST[ "numero_remesa_" . $value_rndc["ID_MATERIAL_AGRUPACION"] ],
										"CONSECUTIVOINFORMACIONCARGA"		=> $arrayPreRemesas[ $value_rndc[0] ],
										"CODOPERACIONTRANSPORTE"			=> $_CODOPERACIONTRANSPORTE,
										"CODTIPOEMPAQUE"					=> "4", // Por definiir cómo se debe diligenciar (ver Excel)
										"CODNATURALEZACARGA"				=> "1", // Por definiir cómo se debe diligenciar [ 1 Carga normal | 2 Carga Peligrosa | 3 Carga extradimencionada | 4 Carga extra pesada | 5 Desechos Peligrosos | 6 Semovientes | 7 Refirgerada ]
										"CANTIDADCARGADA"					=> number_format( $value_rndc["peso_bruto"] , 0, ",", "" ),
										"UNIDADMEDIDACAPACIDAD"				=> "1", // [ 1 Kilogramos | 2 galones ] // Se define que los liquidos se miden de acuerdo con el peso que tenga las unidades, queda por defecto este item como Kilos
										"MERCANCIAREMESA"					=> $value_rndc["rndc_material"],
										"DESCRIPCIONCORTAPRODUCTO"			=> $value_rndc["nombre"],
										"CODTIPOIDREMITENTE"				=> $_CODTIPOIDREMITENTE, // Por definiir cómo se debe diligenciar
										"NUMIDREMITENTE"					=> $_POST["NUMIDREMITENTE_" . $value_solicitudes],
										"CODSEDEREMITENTE"					=> $_POST["CODSEDEREMITENTE_" . $value_solicitudes],
										"CODTIPOIDDESTINATARIO"				=> $_CODTIPOIDDESTINATARIO,
										"NUMIDDESTINATARIO"					=> $_POST["NUMIDDESTINATARIO_" . $value_solicitudes],
										"CODSEDEDESTINATARIO"				=> $_POST["CODSEDEDESTINATARIO_" . $value_solicitudes],
										"DUENOPOLIZA"						=> "N",
										// "NUMPOLIZATRANSPORTE"				=> "",
										// "COMPANIASEGURO"					=> "",
										// "FECHAVENCIMIENTOPOLIZACARGA"		=> "",
										"HORASPACTOCARGA"					=> "3",
										// "MINUTOSPACTOCARGA"					=> "",
										"HORASPACTODESCARGUE"				=> "3",
										// "MINUTOSPACTODESCARGUE"				=> "",
										// "FECHALLEGADACARGUE"				=> "",
										// "HORALLEGADACARGUEREMESA"			=> "",
										// "FECHAENTRADACARGUE"				=> "",
										// "HORAENTRADACARGUEREMESA"			=> "",
										// "FECHASALIDACARGUE"					=> "",
										// "HORASALIDACARGUEREMESA"			=> "",
										"CODTIPOIDPROPIETARIO"				=> "N",
										"NUMIDPROPIETARIO"					=> $value_rndc["DOCUMENTO_CLIENTE"],
										"CODSEDEPROPIETARIO"				=> "0",
										"FECHACITAPACTADACARGUE"			=> $fecha_cargue->format('d/m/Y'),
										"HORACITAPACTADACARGUE"				=> $fecha_cargue->format('H:i'),
										"FECHACITAPACTADADESCARGUE"			=> $fecha_descargue->format('d/m/Y'),
										"HORACITAPACTADADESCARGUEREMESA"	=> $fecha_descargue->format('H:i'),
										// "PERMISOCARGAEXTRA"					=> "",
										// "NUMIDGPS"							=> ""
									);

									// Se valida el contenido de la variable del peso del contenedor
									if ( isset( $_POST["PESOCONTENEDORVACIO_" . $value_solicitudes ] )  ) {
										$arrayMinTrans["variables"]["PESOCONTENEDORVACIO"] = $_POST["PESOCONTENEDORVACIO_" . $value_solicitudes ];
									}

									$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 
									$_array_result["remesa"][ $value_rndc[0] ] = $arrayMinTrans;
									$_array_result["result_remesa"][ $value_rndc[0] ] = $result;

									// Se valida si la operación fue exitosa
									if ( isset( $result["ErrorMSG"] ) ) {
										$_flag_proceso = false;
										$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Información de Remesa.</strong></p>";
										$_msg_error.= $result["ErrorMSG"];
									}
								} 
							}
						}
					}
					/****** FIN - Arreglo para la creación de Expedición de Remesa ******/
				}
			}
			/****** FIN - INTEGRACIÓN CON RNDC ******/
		}
		if ( isset($arrayContenedorConsecutivo) ) {
			foreach ($arrayContenedorConsecutivo as $key => $value) {
				if ( isset($_POST["contenedor_remesa_" . $key]) ) {
					// Se buscar si el contenedor ya se encuentra registrado en el RNDC
					$contenedor_consecutivo = $value;

					// Se valida si la operación tiene un contenedor para devolución
					$sql = '
						SELECT 
							DISTINCT(cip.id), cip.devolucion, CONCAT(cip.contenedor," (",ctc.nombre,")") nombre, ctc.tara, ctc.tamano,
							CONCAT(cc.documento,cc.digito_verificacion) DOCUMENTO_CLIENTE
						FROM
							cmx_importacion_proyecto cip
							INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
							INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cia.id_material
							INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
							INNER JOIN cmx_tipo_contenedor ctc ON ctc.id = cip.tipo_contenedor
							INNER JOIN cmx_clientes cc ON cc.id = cip.id_cliente
						WHERE
							cms.id_solicitud = ' . $key . '
							AND cam.id_agrupamiento = ' . $_POST["id_agrupacion"] . '
					';
					$respuesta_contenedor = $Data->getConsulta($sql);
					// $datafile["sql"] = $sql;

					$devolucion = $respuesta_contenedor["rowsData"][0]["devolucion"];
					$contenedor_nombre = $respuesta_contenedor["rowsData"][0]["nombre"];
					$contenedor_tara = $respuesta_contenedor["rowsData"][0]["tara"];
					$contenedor_propietario = $respuesta_contenedor["rowsData"][0]["DOCUMENTO_CLIENTE"];

					// Se valida si ya existe una remesa creada para el contendor 
					$arrayMinTrans = Array();
					// Solicitud
					$arrayMinTrans["solicitud"] = Array(
						"tipo" => 3,
						"procesoid" => 3,
					);
					$arrayMinTrans["variables"] = "INGRESOID";
					$arrayMinTrans["documento"] = Array(
						"NUMNITEMPRESATRANSPORTE"	=> MINTRANS_NIT,
						"CONSECUTIVOREMESA"			=> "'" . $_POST["contenedor_remesa_" . $key] . "'",
					);
					$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 
					$_array_result["remesa_valida_contenedor"][$key] = $arrayMinTrans;
					$_array_result["result_remesa_valida_contenedor"][$key] = $result;

					if ( $devolucion == 1 AND isset( $result["ErrorMSG"] ) ) {
						// Se busca el tipo de documento del remitente 
						$_CODTIPOIDREMITENTE = rndcTipoDocumento( $Data, $_POST["CODSEDEREMITENTE_" . $key] );

						// Se busca el tipo de documento del remitente 
						$_CODTIPOIDDESTINATARIO = rndcTipoDocumento( $Data, $_POST["CODSEDEDESTINATARIO_" . $key] );

						// Se filtra la información del tipo de de empaque del contenedor  
						$tipo_empaque = "7";
						if ($contenedor_tara == "40") {
							$tipo_empaque = "9";
						}

						$fecha_cargue = new DateTime( $value_rndc["FECHA_PACTO_DESCARGUE"] );

						// Se instancia el array de información de carga 
						$arrayMinTrans = Array();
						// Solicitud
						$arrayMinTrans["solicitud"] = Array(
							"tipo" => 1,
							"procesoid" => 3,
						);
						// Variable que se envían para la realización del proceso 
						$arrayMinTrans["variables"] = Array(
							"NUMNITEMPRESATRANSPORTE"			=> MINTRANS_NIT,
							"CONSECUTIVOREMESA"					=> $_POST["contenedor_remesa_" . $key],
							"CONSECUTIVOINFORMACIONCARGA"		=> $contenedor_consecutivo,
							"CODOPERACIONTRANSPORTE"			=> "V",
							"CODTIPOEMPAQUE"					=> $tipo_empaque, // Por definiir cómo se debe diligenciar (ver Excel)
							"CODNATURALEZACARGA"				=> "1", // Por definiir cómo se debe diligenciar [ 1 Carga normal | 2 Carga Peligrosa | 3 Carga extradimencionada | 4 Carga extra pesada | 5 Desechos Peligrosos | 6 Semovientes | 7 Refirgerada ]
							"UNIDADMEDIDACAPACIDAD"				=> "1", // [ 1 Kilogramos | 2 galones ] // Se define que los liquidos se miden de acuerdo con el peso que tenga las unidades, queda por defecto este item como Kilos
							"MERCANCIAREMESA"					=> "009990",
							"DESCRIPCIONCORTAPRODUCTO"			=> "Contenedor - " . $contenedor_nombre,
							"CODTIPOIDREMITENTE"				=> $_CODTIPOIDDESTINATARIO, // Por definiir cómo se debe diligenciar
							"NUMIDREMITENTE"					=> $_POST["NUMIDDESTINATARIO_" . $key],
							"CODSEDEREMITENTE"					=> $_POST["CODSEDEDESTINATARIO_" . $key],
							"CODTIPOIDDESTINATARIO"				=> $_CODTIPOIDREMITENTE,
							"NUMIDDESTINATARIO"					=> $_POST["NUMIDREMITENTE_" . $key],
							"CODSEDEDESTINATARIO"				=> $_POST["CODSEDEREMITENTE_" . $key],
							"DUENOPOLIZA"						=> "N",
							// "NUMPOLIZATRANSPORTE"				=> "",
							// "COMPANIASEGURO"					=> "",
							// "FECHAVENCIMIENTOPOLIZACARGA"		=> "",
							"HORASPACTOCARGA"					=> "3",
							// "MINUTOSPACTOCARGA"					=> "",
							"HORASPACTODESCARGUE"				=> "3",
							// "MINUTOSPACTODESCARGUE"				=> "",
							// "FECHALLEGADACARGUE"				=> "",
							// "HORALLEGADACARGUEREMESA"			=> "",
							// "FECHAENTRADACARGUE"				=> "",
							// "HORAENTRADACARGUEREMESA"			=> "",
							// "FECHASALIDACARGUE"					=> "",
							// "HORASALIDACARGUEREMESA"			=> "",
							"CODTIPOIDPROPIETARIO"				=> "N",
							"NUMIDPROPIETARIO"					=> $contenedor_propietario,
							"CODSEDEPROPIETARIO"				=> "0",
							"FECHACITAPACTADACARGUE"			=> $fecha_cargue->format('d/m/Y'),
							"HORACITAPACTADACARGUE"				=> $fecha_cargue->format('H:i'),
							"FECHACITAPACTADADESCARGUE"			=> $fecha_descargue->format('d/m/Y'),
							"HORACITAPACTADADESCARGUEREMESA"	=> $fecha_descargue->format('H:i'),
							// "PERMISOCARGAEXTRA"					=> "",
							// "NUMIDGPS"							=> ""
						);

						// Se valida el contenido de la variable del peso del contenedor
						if ( isset( $_POST["PESOCONTENEDORVACIO_" . $key ] )  ) {
							$arrayMinTrans["variables"]["PESOCONTENEDORVACIO"] = $_POST["PESOCONTENEDORVACIO_" . $key ];
						}

						$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 
						$_array_result["remesa_contenedor"][ $value_rndc[0] ] = $arrayMinTrans;
						$_array_result["result_remesa_contenedor"][ $value_rndc[0] ] = $result;

						// Se valida si la operación fue exitosa
						if ( isset( $result["ErrorMSG"] ) ) {
							$_flag_proceso = false;
							$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Información de Remesa Contenedor.</strong></p>";
							$_msg_error.= $result["ErrorMSG"];
						}
					}
				}
			}
		}
		/****** FIN - Arreglo para la creación de Remesas (REMESAS) ******/

		/****** Arreglo para la creación de Expedición de Manifiesto ******/
		if ( $_flag_proceso ) {
			// Se pregunta si la remisión ya existe
			// Se instancia el array de la consulta de la remisión 
			$arrayMinTrans = Array();
			// Solicitud
			$arrayMinTrans["solicitud"] = Array(
				"tipo" => 3,
				"procesoid" => 4,
			);
			$arrayMinTrans["variables"] = "INGRESOID";
			$arrayMinTrans["documento"] = Array(
				"NUMNITEMPRESATRANSPORTE"	=> MINTRANS_NIT,
				"NUMMANIFIESTOCARGA"		=> "'" . $_POST["numero_manifiesto"] . "'",
			);

			$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 
			
			if ( isset( $result["ErrorMSG"] ) ) {
				$sql = '
					SELECT 
						DISTINCT(cip.id_tipo_carga), ca.numero_agrupacion
					FROM 
						cmx_agrupacion_solicitudes cas
						INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = cas.id_agrupacion
						INNER JOIN cmx_importacion_material cim ON cim.id = cam.id_material_proyecto 
						INNER JOIN cmx_importacion_proyecto cip ON cip.id = cim.id_importacion
						INNER JOIN cmx_tramo_solicitud cts ON cts.id_solicitud = cas.id_solicitud
						INNER JOIN cmx_agrupaciones ca ON ca.id = cas.id_agrupacion
					WHERE 
						cas.id_agrupacion = ' . $_POST["id_agrupacion"] . '
						AND cts.id = ' . $_POST["tramo_inicial_" . $_POST["id_agrupacion"] ] . '
						AND cts.tipo_operacion = "Cargue";
				';
				$respuesta_material = $Data->getConsulta($sql);
				// $datafile["sql"] = $sql;

				if ( $respuesta_material ) {
					$arrayPreRemesas = Array();
					foreach ($respuesta_material["rowsData"] as $key_rndc => $value_rndc) {
						// Se filtra el contenido para el campo CODOPERACIONTRANSPORTE
						switch ( $value_rndc["id_tipo_carga"] ) {
							case '1':
								$_CODOPERACIONTRANSPORTE = "C";
								break;

							case '2':
								$_CODOPERACIONTRANSPORTE = "G";
								break;

							case '3':
								$_CODOPERACIONTRANSPORTE = "V";
								break;
						}

						$fecha_actual = date("d-m-Y");

						// Se instancia el array de información de carga 
						$arrayMinTrans = Array();
						// Solicitud
						$arrayMinTrans["solicitud"] = Array(
							"tipo" => 1,
							"procesoid" => 4,
						);
						// Variable que se envían para la realizació del proceso 
						$arrayMinTrans["variables"] = Array(
							"NUMNITEMPRESATRANSPORTE"			=> MINTRANS_NIT,
							"NUMMANIFIESTOCARGA"				=> $_POST["numero_manifiesto"] ,
							"CONSECUTIVOINFORMACIONVIAJE"		=> $value_rndc["numero_agrupacion"],
							// "MANNROMANIFIESTOTRANSBORDO"		=> "",
							"CODOPERACIONTRANSPORTE"			=> $_CODOPERACIONTRANSPORTE,
							"FECHAEXPEDICIONMANIFIESTO"			=> date("d/m/Y"),
							"CODMUNICIPIOORIGENMANIFIESTO"		=> $_POST["CODMUNICIPIOORIGENMANIFIESTO"],
							"CODMUNICIPIODESTINOMANIFIESTO"		=> $_POST["CODMUNICIPIODESTINOMANIFIESTO"],
							"CODIDTITULARMANIFIESTO"			=> "N",
							"NUMIDTITULARMANIFIESTO"			=> MINTRANS_NIT,
							"NUMPLACA"							=> $respuesta_agrupacion["rowsData"][0]["placa"],
							"CODIDCONDUCTOR"					=> "C",
							"NUMIDCONDUCTOR"					=> $respuesta_agrupacion["rowsData"][0]["DOC_CONDUCTOR"],
							// "CODIDCONDUCTOR2"					=> "",
							// "NUMIDCONDUCTOR2"					=> "",
							"VALORFLETEPACTADOVIAJE"			=> $respuesta_agrupacion["rowsData"][0]["flete"],
							"FECHAPAGOSALDOMANIFIESTO"			=> date("d/m/Y", strtotime($fecha_actual . "+ 1 month")), 
							"CODMUNICIPIOPAGOSALDO"				=> "11001000",
							"CODRESPONSABLEPAGOCARGUE"			=> "R",
							"CODRESPONSABLEPAGODESCARGUE"		=> "D",
							// "RETENCIONFUENTEMANIFIESTO"			=> "",
							// "RETENCIONICAMANIFIESTOCARGA"		=> "",
							"VALORANTICIPOMANIFIESTO"			=> (string)$anticipo,
							// "OBSERVACIONES"						=> "",
						);
						if ( isset($_POST["placa_trailer"]) ) {
							$arrayMinTrans["variables"]["NUMPLACAREMOLQUE"] = $_POST["placa_trailer"];
						}	

						// Se buscan las remesas para crear el Manifiesto 
						$sql = '
							SELECT 
								cam.id, cam.numero_remesa
							FROM 
								cmx_agrupaciones ca
								INNER JOIN cmx_agrupacion_material cam ON cam.id_agrupamiento = ca.id
							WHERE 
								ca.id = ' . $_POST["id_agrupacion"] . ';
						';
						$respuesta_material_remesa = $Data->getConsulta($sql);
						// $datafile["sql"] = $sql;

						if ( $respuesta_material_remesa ) {
							$arrayMinTrans["remesas"] = Array();
							foreach ($respuesta_material_remesa["rowsData"] as $key_02 => $value_02) {
								$_remesa = $value_02["numero_remesa"];
								if ( !$value_02["numero_remesa"] ) {
									$_remesa = $_POST["numero_remesa_" . $value_02[0]];
								}
								array_push($arrayMinTrans["remesas"], Array( "REMESA"=>Array( "CONSECUTIVOREMESA"=>$_remesa )));
							}
						}

						// Se busca si hay remesas para algun contenedor vacío para crear el Manifiesto 
						$sql = '
							SELECT 
								DISTINCT(cms.id_solicitud), cip.numero_remesa
							FROM
								cmx_importacion_proyecto cip
								INNER JOIN cmx_importacion_actividades cia ON cia.id_importacion = cip.id
								INNER JOIN cmx_mercancia_solicitud cms ON cms.id_material_proyecto = cia.id_material
								INNER JOIN cmx_agrupacion_material cam ON cam.id_material_proyecto = cia.id_material
							WHERE
								cam.id_agrupamiento = ' . $_POST["id_agrupacion"] . '
								AND cip.devolucion = 1
						';
						$respuesta_contenedor_remesa = $Data->getConsulta($sql);
						// $datafile["sql"] = $sql;

						if ( $respuesta_contenedor_remesa ) {
							foreach ($respuesta_contenedor_remesa["rowsData"] as $key_02 => $value_02) {
								$_remesa = $value_02["numero_remesa"];
								if ( !$value_02["numero_remesa"] ) {
									$_remesa = $_POST["contenedor_remesa_" . $value_02[0]];
								}
								array_push($arrayMinTrans["remesas"], Array( "REMESA"=>Array( "CONSECUTIVOREMESA"=>$_remesa )));
							}
						}

						$result = $Data->getRNDCQueryArray( $arrayMinTrans ); 
						$_array_result["manifiesto"] = $arrayMinTrans;
						$_array_result["result_manifiesto"] = $result;

						// Se valida si la operación fue exitosa
						if ( isset( $result["ErrorMSG"] ) ) {
							$_flag_proceso = false;
							$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Creación Manifiesto de Carga.</strong></p>";
							$_msg_error.= $result["ErrorMSG"];
						}
					}
				}else{
					$_flag_proceso = false;
					$_msg_error.= "<p><strong>Registro no actualizado en RNDC - Creación Manifiesto de Carga.</strong></p>";
					$_msg_error.= "<p>No se encontró información para la creación del manifiesto</p>";
				}
			}
		}
		/****** FIN - Arreglo para la creación de Expedición de Manifiesto ******/

		// if ( $_flag_proceso ) {
		// 	// Se inserta el orden de las carga y las descargas 
		// 	foreach ($respuesta_tramo["rowsData"] as $key => $value) {
		// 		$arrayOrdenTramo = Array();
		// 		$arrayOrdenTramo["id_tramo"] = $value[0];
		// 		$arrayOrdenTramo["id_agrupacion"] = $_POST["id_agrupacion"];
		// 		$arrayOrdenTramo["orden"] = $_POST[ "orden_tramo_" . $value[0] ];
		// 		// $_array_result["orden_tramo"][ $value[0] ] = $arrayOrdenTramo;

		// 		$Data->setRegistro( "cmx_tramos_orden", $arrayOrdenTramo );
		// 	}
		// }
	}

	// if ($_POST["modulo"] == "anticipo") {
	// 	switch ($_POST["metodo_desembolso"]) {
	// 		case 'Tarjeta Débito':
	// 			$array["comprobante_egreso"] = $_POST["comprobante_egreso"];
	// 			$array["pin_tarjeta"] = $_POST["pin_tarjeta"];
	// 			$array["clave"] = $_POST["clave"];
	// 			break;

	// 		case 'Cuenta Personal':
	// 			$array["comprobante_egreso"] = $_POST["comprobante_egreso"];
	// 			$array["banco"] = $_POST["banco"];
	// 			$array["tipo_cuenta"] = $_POST["tipo_cuenta"];
	// 			$array["num_cuenta"] = $_POST["num_cuenta"];
	// 			$array["documento_titular"] = $_POST["documento_titular"];
	// 			$array["nombre_titular"] = $_POST["nombre_titular"];
	// 			break;

	// 		case 'Cheque':
	// 			$array["comprobante_egreso"] = $_POST["comprobante_egreso"];
	// 			$array["numero_cheque"] = $_POST["numero_cheque"];
	// 			break;
	// 	}
	// }
	// $_array_result = $array;

	// // se pregunta si hay registros de anticipos con el id
	// $sql = "
	// 	SELECT 
	// 		id
	// 	FROM 
	// 		" . $table . "
	// 	WHERE 
	// 		id_agrupacion = " . $_POST["id_agrupacion"] . "
	// ";
	// $respuesta = $Data->getConsulta($sql);
	// // $datafile["sql"] = $sql;
	// // $_array_result = $respuesta;

	// if ($respuesta) {
	// 	$_msg_control.= "Si hay entonces se actualiza\n";
	// 	$id_anticipo = $respuesta["rowsData"][0][0];
	// 	$Data->updateRegistro($table, $array, (int)$id_anticipo);

	// 	actualizaRemesa( $Data, $_POST["id_agrupacion"] );
	// } else {
	// 	$_msg_control.= "No hay entonces se inserta\n";
	// 	$resul = $Data->setRegistro($table, $array);

	// 	actualizaRemesa( $Data, $_POST["id_agrupacion"] );
	// }

	// if ( $_flag_proceso ) {
	// 	// Se filtra informacion a actualizar en la gestion de la actividad 
	// 	$arrayEstadoAgrupacion = Array();
	// 	switch ($_POST["modulo"]) {
	// 		case 'planillar':
	// 			$_msg_control.= "Entro en planillar\n";
	// 			// se pregunta si hay registros de vehículos con el id
	// 			$sql = "
	// 				SELECT 
	// 					id
	// 				FROM 
	// 					cmx_agrupaciones_vehiculos
	// 				WHERE 
	// 					id_agrupacion = " . $_POST["id_agrupacion"] . "
	// 					AND estado = 'Aprobado'
	// 			";
	// 			$respuesta = $Data->getConsulta($sql);
	// 			// $datafile["sql"] = $sql;
	// 			// $_array_result = $respuesta;

	// 			$arrayEstadoAgrupacion["estado"] = 'Planillado';
	// 			$filtro_estado_agrupacion_vehiculo = "'Planillado'";
	// 			$bloque = 8;
				
	// 			break;

	// 		case 'anticipo':
	// 			$_msg_control.= "Entro en anticipo\n";
	// 			// se pregunta si hay registros de vehículos con el id
	// 			$sql = "
	// 				SELECT 
	// 					id
	// 				FROM 
	// 					cmx_agrupaciones_vehiculos
	// 				WHERE 
	// 					id_agrupacion = " . $_POST["id_agrupacion"] . "
	// 					AND estado = 'Planillado'
	// 			";
	// 			$respuesta = $Data->getConsulta($sql);
	// 			// $datafile["sql"] = $sql;
	// 			// $_array_result = $respuesta;

	// 			$arrayEstadoAgrupacion["estado"] = 'Anticipo Asignado';
	// 			$filtro_estado_agrupacion_vehiculo = "'Anticipo Asignado','Planillado'";
	// 			$bloque = 9;

	// 			break;
	// 	}
	// 	// $_array_result = $arrayEstadoAgrupacion;
	// 	$Data->updateRegistro("cmx_agrupaciones_vehiculos", $arrayEstadoAgrupacion, (int)$respuesta["rowsData"][0][0]);

	// 	// ACTUALIZACION DE ACTIVIDADES DEL PROYECTO
	// 	// Saber cuales son las solicitudes asociadas al agrupamiento 
	// 	$sql = "
	// 		SELECT 
	// 			DISTINCT(cs.id)
	// 		FROM 
	// 			cmx_agrupaciones ca
	// 			INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_agrupacion = ca.id
	// 			INNER JOIN cmx_solicitudes cs ON cs.id = cas.id_solicitud
	// 			INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
	// 		WHERE 
	// 			cs.peso_pendiente = 0
	// 			AND ca.id = " . $_POST["id_agrupacion"] . "
	// 	";
	// 	$arraySolicitudes = $Data->getConsulta($sql);
	// 	// $datafile["sql"] = $sql;
	// 	// $_array_result = $arraySolicitudes;

	// 	if ($arraySolicitudes) {
	// 		foreach ($arraySolicitudes["rowsData"] as $key => $value) {
	// 			// Se pregunta cuantos vehiculos se encuentran agrupados 
	// 			$sql = "
	// 				SELECT 
	// 					COUNT(cav.id) CUANTOS
	// 				FROM 
	// 					cmx_agrupaciones ca
	// 					INNER JOIN cmx_agrupacion_solicitudes cas ON cas.id_agrupacion = ca.id
	// 					INNER JOIN cmx_solicitudes cs ON cs.id = cas.id_solicitud
	// 					INNER JOIN cmx_agrupaciones_vehiculos cav ON cav.id_agrupacion = ca.id
	// 				WHERE 
	// 					cs.peso_pendiente = 0
	// 					AND cav.estado NOT IN (" . $filtro_estado_agrupacion_vehiculo . ")
	// 					AND cs.id = " . $value["id"] . "
	// 			";
	// 			$arrayAnticipos = $Data->getConsulta($sql);
	// 			// $datafile["sql"] = $sql;
	// 			// $_array_result = $arrayAnticipos;

	// 			// Se averigua si la solicitud todos los anticipos ya tienen los anticipos asignados 
	// 			if ($arrayAnticipos["rowsData"][0]["CUANTOS"] == 0) {
	// 				// Si si, se buscan las actividades asociadas a la solicitud 
	// 				$sql = "
	// 					SELECT 
	// 						cia.*
	// 					FROM 
	// 						cmx_solicitudes cs
	// 						INNER JOIN cmx_integracion_soluc_import cisi ON cisi.id_solucion = cs.id
	// 						INNER JOIN cmx_importacion_actividades cia ON cia.id = cisi.id_importacion_actividad
	// 					WHERE 
	// 						cs.id = " . $value["id"] . "
	// 						AND cia.estado = 2;
	// 				";
	// 				$arrayActividadActual = $Data->getConsulta($sql);
	// 				// $datafile["sql"] = $sql;
	// 				// $_array_result = $arrayActividadActual;
	// 			}
	// 		}
	// 	}
	// }

	$datafile["control"] = $_msg_control;
	if ( $_msg_error ) {
		$datafile["error"] = $_msg_error;
	}
	if ( $_array_result ) {
		$datafile["result"] = $_array_result;
	}

	echo json_encode($datafile);

	/********* FUNCIONES DEL MÓDULO *********/
	function actualizaRemesa( $Data, $id_agrupacion ){
		// Busco los materiales del agrupamiento para asignar el número de remesa 
		$sql = "
			SELECT 
				id
			FROM 
				cmx_agrupacion_material
			WHERE 
				id_agrupamiento = " . $id_agrupacion . "
		";
		$respuesta = $Data->getConsulta($sql);
		// $_array_result = $respuesta;

		$array_material_agrupamiento = Array();
		foreach ($respuesta["rowsData"] as $key_01 => $value_01) {
			$array_material_agrupamiento["numero_remesa"] = $_POST["numero_remesa_" . $value_01[0]];
			$Data->updateRegistro("cmx_agrupacion_material", $array_material_agrupamiento, (int)$value_01[0]);
		}
	}

	function rndcTipoDocumento($Data, $id){
		// Se busca el tipo de documento del remitente
		$sql = '
			SELECT 
				crd.tipo_documento
			FROM
				cmx_remitente_destinatario crd
			WHERE
				crd.id = ' . $id . '
		;';
		$result = $Data->getConsulta($sql);

		if ( $result ) {
			foreach ($result["rowsData"] as $key => $value) {
				switch ( $value["tipo_documento"] ) {
					case 'Cedula de Ciudadania':
						$cod_tipo_documento = "C";
						break;

					case 'NIT':
						$cod_tipo_documento = "N";
						break;

					case 'Cedula de Extranjeria':
						$cod_tipo_documento = "E";
						break;

					default:
						$cod_tipo_documento = "Error";
						break;
				}
			}
		}
		return $cod_tipo_documento;
	}
?>
